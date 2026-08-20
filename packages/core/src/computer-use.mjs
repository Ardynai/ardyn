// M9: Sandboxed computer-use capability — screenshot → action agent loop
// Runs inside an isolated, ephemeral Docker container with virtual display (Xvfb).
// Never the host. One fresh sandbox per session, destroyed on session end.
// No access to host filesystem, host env vars, host credentials, or the Ardyn repo.
// Network egress is deny-by-default with an allowlist.

// Sandbox mechanism: Docker container with Xvfb virtual display
// Image: ubuntu:22.04 (pinned, mainstream, well-understood)
// Isolation: --no-new-privileges, dropped capabilities, no host mounts
// Display: Xvfb on :99 inside the container
// Network: --network none by default (deny-by-default egress)
// Lifecycle: created per session, destroyed on session end or kill switch

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
    ],
  };
}

// Action audit — records all actions with timestamps
export function createActionAudit() {
  const events = [];
  return {
    record(action) {
      events.push({
        ...action,
        timestamp: new Date().toISOString(),
      });
    },
    getEvents() {
      return [...events];
    },
    clear() {
      events.length = 0;
    },
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

// Sandbox session — represents one ephemeral container lifecycle
export function createSandboxSession(options = {}) {
  const config = createSandboxConfig(options);
  let alive = true; // sessions are "alive" conceptually even in dry-run (for testing)
  let killedReason = null;
  let destroyReason = null;
  const audit = createActionAudit();

  return {
    sessionId: config.sessionId,
    config,
    audit,
    get alive() { return alive; },
    get killedReason() { return killedReason; },
    get destroyReason() { return destroyReason; },

    // Execute an action inside the sandbox
    async executeAction(action) {
      if (!alive) throw new Error("Sandbox session is not alive");
      audit.record(action);
      // In dry-run mode, return a placeholder result
      if (options.dryRun) {
        return { action: action.action, status: "dry_run", result: "planned" };
      }
      // In real mode: send action to the container via docker exec
      // ponytail: real container interaction would use spawn('docker', ['exec', containerId, ...])
      // For now, record the action and return a placeholder
      return { action: action.action, status: "planned", result: "container-not-running" };
    },

    // Kill switch — tear the sandbox down immediately
    kill() {
      if (!alive) return;
      alive = false;
      killedReason = "kill_switch";
      // ponytail: real implementation would run spawn('docker', ['kill', containerId])
    },

    // End session — destroy sandbox
    end() {
      if (!alive) return;
      alive = false;
      destroyReason = "session_end";
      // ponytail: real implementation would run spawn('docker', ['rm', '-f', containerId])
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
};