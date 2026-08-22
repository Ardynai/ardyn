// M16: Production-ops posture — process metrics registry with Prometheus text output.
// Pattern adapted from Vision-Agents' production-ops posture (MIT) — not vendored.
//
// Zero-dependency: counters/gauges live in plain Maps; render() emits Prometheus
// text format (no client lib required).
//
// PRIVACY RULE: only aggregate series + structural labels (platform, outcome,
// pseudonymous hashed user ids). Never label with usernames, message text,
// action text, tokens/secrets, or raw credentials.

import { createHash } from "node:crypto";

const VALID_NAME = /^[a-zA-Z_:][a-zA-Z0-9_:]*$/;

// Pseudonymous per-user label: one-way hash prefix — no username/email leaks.
export function pseudonymizeUserId(userId) {
  return createHash("sha256").update(String(userId)).digest("hex").slice(0, 12);
}

function escapeLabelValue(v) {
  return String(v).replace(/\\/g, "\\\\").replace(/"/g, "\\\"").replace(/\n/g, "\\n");
}

function formatLabels(labels) {
  const keys = Object.keys(labels).sort();
  if (keys.length === 0) return "";
  return `{${keys.map(k => `${k}="${escapeLabelValue(labels[k])}"`).join(",")}}`;
}

export function createMetricsRegistry() {
  // name -> Map<labelsKey, { labels, value }>
  const counters = new Map();
  const gauges = new Map();
  const help = new Map();   // name -> help text
  let activeSessionProvider = null; // optional () => [{ userId, count }]

  function describe(name, text) {
    if (!VALID_NAME.test(name)) throw new Error(`invalid metric name: ${name}`);
    help.set(name, text);
  }

  function counter(name, labels = {}, delta = 1) {
    if (!VALID_NAME.test(name)) throw new Error(`invalid metric name: ${name}`);
    if (!counters.has(name)) counters.set(name, new Map());
    const bucket = counters.get(name);
    const key = JSON.stringify(labels);
    const cur = bucket.get(key);
    if (cur) cur.value += delta;
    else bucket.set(key, { labels: { ...labels }, value: delta });
  }

  function setGauge(name, labels, value) {
    if (!VALID_NAME.test(name)) throw new Error(`invalid metric name: ${name}`);
    if (!gauges.has(name)) gauges.set(name, new Map());
    gauges.get(name).set(JSON.stringify(labels), { labels: { ...labels }, value });
  }

  function renderSeries(map, typeName) {
    const lines = [];
    for (const [name, bucket] of map) {
      lines.push(`# HELP ${name} ${help.get(name) ?? name}`);
      lines.push(`# TYPE ${name} ${typeName}`);
      for (const { labels, value } of bucket.values()) {
        lines.push(`${name}${formatLabels(labels)} ${value}`);
      }
    }
    return lines;
  }

  // Register a provider that reports per-user ACTIVE session counts at scrape
  // time. Provider must return [{ userId, count }] and nothing else.
  function setActiveSessionProvider(fn) {
    activeSessionProvider = typeof fn === "function" ? fn : null;
  }

  function render() {
    const lines = [
      ...renderSeries(counters, "counter"),
      ...renderSeries(gauges, "gauge"),
    ];
    if (activeSessionProvider) {
      lines.push("# HELP ardyn_active_user_sessions Active sessions per user (pseudonymous id)");
      lines.push("# TYPE ardyn_active_user_sessions gauge");
      try {
        for (const row of activeSessionProvider()) {
          lines.push(`ardyn_active_user_sessions{user="${pseudonymizeUserId(row.userId)}"} ${row.count}`);
        }
      } catch {
        // provider failure must not break the scrape; gauge is simply absent
      }
    }
    return lines.join("\n") + "\n";
  }

  return { counter, setGauge, describe, setActiveSessionProvider, render };
}

// Process-wide singleton so every module increments the same registry.
export const metrics = createMetricsRegistry();

metrics.describe("ardyn_runtime_sessions_started_total", "Runtime sandbox sessions started");
metrics.describe("ardyn_runtime_sessions_killed_total", "Runtime sandbox sessions killed or ended");
metrics.describe("ardyn_computer_use_actions_total", "Computer-use actions evaluated by outcome");
metrics.describe("ardyn_gateway_messages_total", "Inbound chat gateway messages per channel");
metrics.describe("ardyn_auth_failures_total", "Authentication failures");

export default { createMetricsRegistry, metrics, pseudonymizeUserId };
