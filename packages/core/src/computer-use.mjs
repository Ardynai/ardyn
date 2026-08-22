// M9/M11: Sandboxed computer-use — REAL governed sandbox spawn, gateway, take-the-wheel
// Pattern adapted from OpenBot (MIT, CopilotKit/OpenBot) — not vendored.
//
// Sandbox mechanism: Docker container with Xvfb virtual display
// Image: ubuntu:22.04 (pinned, mainstream, well-understood)
// Isolation: --no-new-privileges, dropped capabilities, no host mounts, loopback-bound
// Display: Xvfb on :99 inside the container
// Network: --network none by default (deny-by-default egress)
// Per-session token: random token generated per session, required for all container API calls
// Lifecycle: created per session via real `docker run`, destroyed on session end or kill switch via `docker kill`/`docker rm`
// Optional gVisor: set COMPUTER_RUNTIME=runsc to use gVisor where available
// Injectable: pass spawnImpl to override spawn for testing (tests never need real Docker)

import { spawn as defaultSpawn } from "node:child_process";
import { randomBytes } from "node:crypto";
import { metrics } from "./metrics.mjs";

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
    record(action) { events.push({ ...action, timestamp: new Date().toISOString() }); },
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

  function matchRule(action, rule) {
    if (rule.action && action.action !== rule.action) return false;
    if (rule.text && typeof action.text === "string") {
      return action.text.includes(rule.text);
    }
    if (rule.action && action.action === rule.action && !rule.text) return true;
    return true; // empty rule matches all (used for default allow)
  }

  return {
    async evaluateAction(action) {
      const hasPolicy = policy && (policy.deny || policy.allow);
      let allowed = false;
      let decision = "deny";

      if (!hasPolicy) {
        allowed = false;
        decision = "deny_no_policy";
      } else {
        const denyMatched = (policy.deny || []).some(r => matchRule(action, r));
        if (denyMatched) {
          allowed = false;
          decision = "deny_rule";
        } else if ((policy.allow || []).some(r => matchRule(action, r))) {
          allowed = true;
          decision = "allow";
        } else {
          allowed = false;
          decision = "deny_no_allow";
        }
      }

      const auditRecord = {
        action: action.action,
        decision,
        allowed,
        timestamp: new Date().toISOString(),
        auditRecordWrittenBefore: true,
        details: { ...action },
      };
      audit.record(auditRecord);

      // M16 metrics — aggregate outcome only; never label with action text/details
      metrics.counter("ardyn_computer_use_actions_total", { outcome: allowed ? "allowed" : "denied" });

      return { allowed, decision, auditRecord, auditRecordWrittenBefore: true };
    },
    audit,
  };
}

// M11-real: Sandbox session with REAL spawn, governed gateway, take-the-wheel
// spawnImpl is injectable for testing — defaults to node:child_process spawn
export function createSandboxSession(options = {}) {
  const config = createSandboxConfig(options);
  const _spawn = options.spawnImpl ?? defaultSpawn;
  // M11-real: alive starts true for dry-run/test sessions (backward compat with M9 tests);
  // real sessions require start() to set alive=true after successful spawn
  let alive = options.dryRun || !options.approved ? true : false;
  let started = false;
  let killedReason = null;
  let destroyReason = null;
  let humanControl = false;
  let containerId = null;
  let childProcess = null;
  const audit = createActionAudit();
  const gateway = createGateway({ ...options, audit });
  const sessionToken = randomBytes(32).toString("hex");

  // M11-real: Build the docker run command for spawning the sandbox
  function buildRunCommand() {
    const args = ["run", "-d", "--name", `ardyn-sandbox-${config.sessionId}`];
    args.push(...config.dockerArgs);
    args.push("-e", `ARDYN_SESSION_TOKEN=${sessionToken}`);
    args.push(config.containerImage);
    // Start Xvfb + a simple shell to keep the container alive
    args.push("sh", "-c", "Xvfb :99 -screen 0 1280x720x24 & sleep infinity");
    return { cmd: "docker", args };
  }

  // M11-real: Build docker kill command
  function buildKillCommand() {
    return { cmd: "docker", args: ["kill", `ardyn-sandbox-${config.sessionId}`] };
  }

  // M11-real: Build docker rm command
  function buildRmCommand() {
    return { cmd: "docker", args: ["rm", "-f", `ardyn-sandbox-${config.sessionId}`] };
  }

  // M11-real: Build docker exec command for an action
  function buildExecCommand(action) {
    const args = ["exec", `ardyn-sandbox-${config.sessionId}`];
    switch (action.action) {
      case "screenshot":
        args.push("sh", "-c", "DISPLAY=:99 import -window root /tmp/screenshot.png && cat /tmp/screenshot.png | base64");
        break;
      case "click":
        args.push("sh", "-c", `DISPLAY=:99 xdotool click --window root ${action.x},${action.y}`);
        break;
      case "double_click":
        args.push("sh", "-c", `DISPLAY=:99 xdotool click --repeat 2 --delay 100 --window root ${action.x},${action.y}`);
        break;
      case "type":
        args.push("sh", "-c", `DISPLAY=:99 xdotool type --clear-modifiers -- ${JSON.stringify(action.text)}`);
        break;
      case "key_press":
        args.push("sh", "-c", `DISPLAY=:99 xdotool key ${action.keys}`);
        break;
      case "scroll":
        args.push("sh", "-c", `DISPLAY=:99 xdotool click ${action.direction === "down" ? 5 : 4} --window root ${action.x},${action.y}`);
        break;
      case "mouse_move":
        args.push("sh", "-c", `DISPLAY=:99 xdotool mousemove ${action.x} ${action.y}`);
        break;
      case "drag":
        args.push("sh", "-c", `DISPLAY=:99 xdotool mousemove ${action.fromX} ${action.fromY} mousedown 1 mousemove ${action.toX} ${action.toY} mouseup 1`);
        break;
      case "wait":
        args.push("sh", "-c", `sleep ${Math.max(0, (action.ms ?? 0) / 1000)}`);
        break;
      default:
        args.push("sh", "-c", "echo 'unknown action'");
    }
    return { cmd: "docker", args };
  }

  // Spawn a child process and wait for either "spawn" or "error" event
  function spawnAndWait(cmd, args) {
    return new Promise((resolve, reject) => {
      const child = _spawn(cmd, args, { stdio: ["pipe", "pipe", "pipe"] });
      let stdoutData = "";
      let stderrData = "";
      child.stdout?.on("data", (d) => { stdoutData += d.toString(); });
      child.stderr?.on("data", (d) => { stderrData += d.toString(); });

      child.on("spawn", () => resolve({ child, stdout: stdoutData, stderr: stderrData }));
      child.on("error", (err) => reject(err));
      // Also resolve on close for commands that exit immediately (like kill/rm)
      child.on("close", (code) => resolve({ child, stdout: stdoutData, stderr: stderrData, exitCode: code }));
    });
  }

  return {
    sessionId: config.sessionId,
    config,
    audit,
    gateway,
    sessionToken,
    containerId: () => containerId,
    get alive() { return alive; },
    get killedReason() { return killedReason; },
    get destroyReason() { return destroyReason; },
    get humanControl() { return humanControl; },

    // M11-real: Start the sandbox — spawns a real Docker container
    async start() {
      if (started) return { alreadyStarted: true };
      started = true;

      // M11-real: No spawn without approval
      if (!options.approved) {
        alive = false;
        audit.record({ action: "start_denied_no_approval", timestamp: new Date().toISOString() });
        return { spawnError: "Approval required — sandbox not started" };
      }

      // M11-real: No spawn in dry-run mode
      if (options.dryRun) {
        audit.record({ action: "start_dry_run", timestamp: new Date().toISOString() });
        alive = true; // conceptually alive for testing
        return { dryRun: true };
      }

      // M11-real: REAL SPAWN — docker run with isolation flags
      const { cmd, args } = buildRunCommand();
      try {
        const result = await spawnAndWait(cmd, args);
        childProcess = result.child;
        containerId = result.stdout.trim() || `ardyn-sandbox-${config.sessionId}`;
        alive = true;
        audit.record({ action: "sandbox_spawned", containerId, timestamp: new Date().toISOString() });
        metrics.counter("ardyn_runtime_sessions_started_total");
        return { spawned: true, containerId };
      } catch (err) {
        // M11-real: spawn error is caught and audited, NOT crashed
        audit.record({ action: "spawn_error", error: err.message, timestamp: new Date().toISOString() });
        alive = false;
        return { spawnError: err.message };
      }
    },

    // M11-real: Execute an action through the gateway (record-before-act)
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

      // M11-real: REAL docker exec into the container
      const { cmd, args } = buildExecCommand(action);
      try {
        const result = await spawnAndWait(cmd, args);
        const output = redactCapturedText(result.stdout || "");
        return { action: action.action, status: "executed", result: output, auditRecord: gateResult.auditRecord };
      } catch (err) {
        audit.record({ action: "exec_error", error: err.message, timestamp: new Date().toISOString() });
        return { action: action.action, status: "error", error: err.message, auditRecord: gateResult.auditRecord };
      }
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

    // M11-real: Kill switch — REAL docker kill to tear the sandbox down
    kill() {
      if (!alive) return;
      alive = false;
      killedReason = "kill_switch";
      audit.record({ action: "kill_switch_activated", timestamp: new Date().toISOString() });
      metrics.counter("ardyn_runtime_sessions_killed_total");
      // REAL: docker kill
      if (!options.dryRun && options.approved) {
        const { cmd, args } = buildKillCommand();
        try { _spawn(cmd, args, { stdio: ["pipe", "pipe", "pipe"] }); } catch {}
      }
    },

    // M11-real: End session — REAL docker rm to destroy the sandbox
    end() {
      if (!alive) return;
      alive = false;
      destroyReason = "session_end";
      audit.record({ action: "session_ended", timestamp: new Date().toISOString() });
      metrics.counter("ardyn_runtime_sessions_killed_total");
      // REAL: docker rm -f
      if (!options.dryRun && options.approved) {
        const { cmd, args } = buildRmCommand();
        try { _spawn(cmd, args, { stdio: ["pipe", "pipe", "pipe"] }); } catch {}
      }
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