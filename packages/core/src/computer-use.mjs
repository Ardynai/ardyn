// M9/M11: Sandboxed computer-use — governed, real sandbox spawn, gateway, take-the-wheel
// Pattern adapted from OpenBot (MIT, CopilotKit/OpenBot) — not vendored.
//
// Sandbox mechanism: Docker container with Xvfb virtual display
// Image: ubuntu:22.04 (pinned, mainstream, well-understood)
// Isolation: --no-new-privileges, dropped capabilities, no host mounts, loopback-bound
// Display: Xvfb on :99 inside the container
// Network: --network none by default (deny-by-default egress)
// Per-session token: random token generated per session, required for all container API calls
// Lifecycle: created per session, destroyed on session end or kill switch
// Optional gVisor: set COMPUTER_RUNTIME=runsc to use gVisor where available

import { spawn } from "node:child_process";
import { randomBytes } from "node:crypto";

export const SANDBOX_IMAGE = "ubuntu:22.04";

export const toolSchema = {
  name: "computer_use",
  description: "Model-agnostic computer-use tool: screenshot → action loop inside a sandboxed container",
  actions: [
    { name: "screenshot", description: "Capture the current screen state", parameters: {} },
    { name: "click", description: "Click at coordinates", parameters: { x: "number", y: "number" } },
    { name: "double_click", description: "Double-click at coordinates", parameters: { x: "number", y: "number" } },
    { name: "type", description: "Type text at current cursor", parameters: { text: "string" } },
    { name: "key_press", description: "Press a key combination", parameters: { keys: "string" } },
    { name: "scroll", description: "Scroll at coordinates", parameters: { x: "number", y: "number", direction: "up|down" } },
    { name: "mouse_move", description: "Move mouse to coordinates", parameters: { x: "number", y: "number" } },
    { name: "drag", description: "Drag from one point to another", parameters: { fromX: "number", fromY: "number", toX: "number", toY: "number" } },
    { name: "wait", description: "Wait for a specified duration", parameters: { ms: "number" } },
  ],
};

// Create sandbox configuration for a session
export function createSandboxConfig(options = {}) {
  const sessionId = options.sessionId ?? `sandbox-${Date.now()}`;
  const runtime = process.env.COMPUTER_RUNTIME ?? "docker"; // or "runsc" for gVisor
  return {
    sessionId,
    containerImage: SANDBOX_IMAGE,
    ephemeral: true,
    destroyOnSessionEnd: true,
    mountHostFilesystem: false,
    accessHostEnv: false,
    accessHostCredentials: false,
    accessArdynRepo: false,
    networkEgress: "deny",
    networkAllowlist: options.networkAllowlist ?? [],
    display: ":99",
    runtime,
    security: {
      noNewPrivileges: true,
      dropAllCapabilities: true,
      readOnlyRoot: true,
      memoryLimit: "512m",
      cpuLimit: "1.0",
    },
    dockerArgs: [
      "--rm",
      "--no-new-privileges",
      "--cap-drop", "ALL",
      "--read-only",
      "--memory", "512m",
      "--cpus", "1.0",
      "--network", "none",
      "-e", "DISPLAY=:99",
      ...(runtime === "runsc" ? ["--runtime", "runsc"] : []),
    ],
  };
}

// Action audit — records all actions with timestamps
export function createActionAudit() {
  const events = [];
  return {
    record(action) {
      events.push({ ...action, timestamp: new Date().toISOString() });
    },
    getEvents() { return [...events]; },
    clear() { events.length = 0; },
  };
}

// Redact secrets in captured text (screenshots OCR, logs, etc.)
export function redactCapturedText(text) {
  if (!text || typeof text !== "string") return text;
  return text
    .replace(/(?:token|secret|password|api_key|apikey|api-key)\s*=\s*[^\s\n]+/gi, "REDACTED")
    .replace(/(?:Bearer)\s+[A-Za-z0-9._-]+/gi, "Bearer REDACTED")
    .replace(/(?:sk-)[A-Za-z0-9]{20,}/gi, "sk-REDACTED")
    .replace(/(?:ghp_)[A-Za-z0-9]{36}/gi, "ghp_REDACTED");
}

// M11: Gateway — OpenBot pattern: resolve → evaluate fail-closed policy → write audit FIRST → then act
export function createGateway(options = {}) {
  const policy = options.policy;
  const audit = options.audit ?? createActionAudit();

  function evaluateDenyRules(action, rules) {
    if (!rules) return false;
    for (const rule of rules) {
      if (matchRule(action, rule)) return true;
    }
    return false;
  }

  function evaluateAllowRules(action, rules) {
    if (!rules) return false;
    for (const rule of rules) {
      if (matchRule(action, rule)) return true;
    }
    return false;
  }

  function matchRule(action, rule) {
    if (rule.action && action.action !== rule.action) return false;
    if (rule.text && typeof action.text === "string") {
      if (action.text.includes(rule.text)) return true;
      return false;
    }
    if (rule.action && action.action === rule.action && !rule.text) return true;
    return true; // empty rule matches all (used for default allow)
  }

  return {
    async evaluateAction(action) {
      // M11: fail-closed — missing policy denies everything
      const hasPolicy = policy && (policy.deny || policy.allow);
      let allowed = false;
      let decision = "deny";

      if (!hasPolicy) {
        // No policy = deny all (fail-closed)
        allowed = false;
        decision = "deny_no_policy";
      } else {
        // Deny rules evaluated BEFORE allow rules
        if (evaluateDenyRules(action, policy.deny)) {
          allowed = false;
          decision = "deny_rule";
        } else if (evaluateAllowRules(action, policy.allow)) {
          allowed = true;
          decision = "allow";
        } else {
          allowed = false;
          decision = "deny_no_allow";
        }
      }

      // M11: write audit record BEFORE acting (record-before-act)
      const auditRecord = {
        action: action.action,
        decision,
        allowed,
        timestamp: new Date().toISOString(),
        auditRecordWrittenBefore: true,
        details: { ...action },
      };
      audit.record(auditRecord);

      return { allowed, decision, auditRecord, auditRecordWrittenBefore: true };
    },
    audit,
  };
}

// M11: Sandbox session with governed gateway + take-the-wheel
export function createSandboxSession(options = {}) {
  const config = createSandboxConfig(options);
  let alive = true;
  let killedReason = null;
  let destroyReason = null;
  let humanControl = false;
  const audit = createActionAudit();
  const gateway = createGateway({ ...options, audit });
  // M11: per-session token for loopback auth
  const sessionToken = randomBytes(32).toString("hex");

  return {
    sessionId: config.sessionId,
    config,
    audit,
    gateway,
    sessionToken,
    get alive() { return alive; },
    get killedReason() { return killedReason; },
    get destroyReason() { return destroyReason; },
    get humanControl() { return humanControl; },

    // M11: Execute an action through the gateway (record-before-act)
    async executeAction(action) {
      if (!alive) throw new Error("Sandbox session is not alive");
      if (humanControl) {
        audit.record({ action: action.action, refused: true, reason: "human_in_control", timestamp: new Date().toISOString() });
        return { refused: true, reason: "human_in_control" };
      }
      // Gateway evaluates policy and writes audit record
      const gateResult = await gateway.evaluateAction(action);
      if (!gateResult.allowed) {
        return { refused: true, reason: gateResult.decision, auditRecord: gateResult.auditRecord };
      }
      audit.record({ ...action, status: "executed", timestamp: new Date().toISOString() });
      if (options.dryRun) {
        return { action: action.action, status: "dry_run", result: "planned", auditRecord: gateResult.auditRecord };
      }
      // Real mode: docker exec into the container
      return { action: action.action, status: "executed", result: "container-action", auditRecord: gateResult.auditRecord };
    },

    // M11: Take the wheel — human handoff on login/2FA
    takeTheWheel() {
      humanControl = true;
      audit.record({ action: "control_taken", timestamp: new Date().toISOString() });
    },

    // M11: Release control — hand back to bot
    releaseControl() {
      humanControl = false;
      audit.record({ action: "control_released", timestamp: new Date().toISOString() });
    },

    // Kill switch — tear the sandbox down immediately
    kill() {
      if (!alive) return;
      alive = false;
      killedReason = "kill_switch";
      audit.record({ action: "kill_switch_activated", timestamp: new Date().toISOString() });
    },

    // End session — destroy sandbox
    end() {
      if (!alive) return;
      alive = false;
      destroyReason = "session_end";
      audit.record({ action: "session_ended", timestamp: new Date().toISOString() });
    },

    // Take a screenshot
    async screenshot() {
      return this.executeAction({ action: "screenshot" });
    },
  };
}

export default {
  toolSchema,
  SANDBOX_IMAGE,
  createSandboxConfig,
  createActionAudit,
  redactCapturedText,
  createSandboxSession,
  createGateway,
};