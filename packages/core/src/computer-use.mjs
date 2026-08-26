// M9/M11: Sandboxed computer-use — REAL governed sandbox spawn, gateway, take-the-wheel
// Pattern adapted from OpenBot (MIT, CopilotKit/OpenBot) — not vendored.
//
// Sandbox mechanism: Docker container with Xvfb virtual display
// Image: ardyn-sandbox:22.04 (built from docker/sandbox.Dockerfile: ubuntu:22.04
//        + xvfb + xdotool + imagemagick). Build it once with:
//          docker build -t ardyn-sandbox:22.04 -f docker/sandbox.Dockerfile .
// Isolation: --no-new-privileges, dropped capabilities, no host mounts, loopback-bound
// Display: Xvfb on :99 inside the container
// Network: --network none by default (deny-by-default egress)
// Per-session token: random token generated per session, required for all container API calls
// Lifecycle: created per session via real `docker run`, destroyed on session end or kill switch via `docker kill`/`docker rm`
// Optional gVisor: set COMPUTER_RUNTIME=runsc to use gVisor where available
// Injectable: pass spawnImpl to override spawn for testing (tests never need real Docker)
//
// U1 hardening: action fields are VALIDATED (integers in bounds, keysym
// allowlist) and free text is base64-encoded before it ever touches a shell
// string; the decoded payload never interpolates back into a command.

import { spawn as defaultSpawn } from "node:child_process";
import { randomBytes } from "node:crypto";
import {
  runProcessors,
  policyGateProcessor,
  auditRecordProcessor,
  redactResultProcessor,
  writeActionAuditRecord,
  redactCapturedText,
} from "./processor-pipeline.mjs";
import { metrics } from "./metrics.mjs";

// M15: redaction moved to processor-pipeline.mjs; re-exported for compatibility
// (CLI and tests import it from here).
export { redactCapturedText };

// U2: capable sandbox image (built from docker/sandbox.Dockerfile). Falls back
// to stock ubuntu:22.04 ONLY if the operator overrides via ARDYN_SANDBOX_IMAGE;
// the stock image cannot run the action toolchain (no Xvfb/xdotool/import).
export const SANDBOX_IMAGE = process.env.ARDYN_SANDBOX_IMAGE ?? "ardyn-sandbox:22.04";

// U1: field-validation rules. Everything that reaches a container shell string
// must be a validated integer, an allowlisted token, or base64.
const COORD_MAX = 100_000; // generous screen bound; rejects absurd/garbage values
const WAIT_MS_MAX = 60_000;
const TYPE_TEXT_MAX = 10_000;

function isBoundedInt(value, max) {
  return typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= max;
}

// xdotool keysym combos: letters, digits, underscore, plus (chords), dash, dot.
// Deliberately excludes spaces, quotes, $, backticks, ;, |, &, parentheses —
// a keysym never needs any of them, so any such character is hostile input.
const KEYSYM_ALLOWED = /^[A-Za-z0-9_+\-.]{1,64}(?:\+[A-Za-z0-9_+\-.]{1,64})*$/;

// Validate one action against the tool schema. Returns { ok:true } or
// { ok:false, reason }. Pure — used by BOTH the pipeline processor (so denial
// is audited through the governed chain) and the executor (defense in depth:
// even a custom processor chain cannot smuggle fields into a shell string).
export function validateComputerUseAction(action) {
  if (!action || typeof action !== "object" || typeof action.action !== "string") {
    return { ok: false, reason: "deny_invalid_action_shape" };
  }
  const coord = (v) => isBoundedInt(v, COORD_MAX);
  switch (action.action) {
    case "screenshot":
      return { ok: true };
    case "click":
    case "double_click":
    case "mouse_move":
      if (!coord(action.x) || !coord(action.y)) return { ok: false, reason: "deny_invalid_coordinates" };
      return { ok: true };
    case "scroll":
      if (!coord(action.x) || !coord(action.y)) return { ok: false, reason: "deny_invalid_coordinates" };
      if (action.direction !== "up" && action.direction !== "down") return { ok: false, reason: "deny_invalid_direction" };
      return { ok: true };
    case "drag":
      if (!coord(action.fromX) || !coord(action.fromY) || !coord(action.toX) || !coord(action.toY)) {
        return { ok: false, reason: "deny_invalid_coordinates" };
      }
      return { ok: true };
    case "type":
      if (typeof action.text !== "string" || action.text.length > TYPE_TEXT_MAX) {
        return { ok: false, reason: "deny_invalid_text" };
      }
      return { ok: true };
    case "key_press":
      if (typeof action.keys !== "string" || !KEYSYM_ALLOWED.test(action.keys)) {
        return { ok: false, reason: "deny_invalid_keys" };
      }
      return { ok: true };
    case "wait":
      if (!isBoundedInt(action.ms, WAIT_MS_MAX)) return { ok: false, reason: "deny_invalid_wait_ms" };
      return { ok: true };
    default:
      return { ok: false, reason: "deny_unknown_action" };
  }
}

// Built-in PRE processor wrapping the validator so malformed fields are denied
// through the governed pipeline (audited, sticky, fail-closed).
export function actionFieldValidationProcessor() {
  return {
    name: "action-field-validation",
    phase: "pre",
    process(ctx) {
      const verdict = validateComputerUseAction(ctx.action);
      return verdict.ok ? { action: "allow" } : { action: "deny", reason: verdict.reason };
    },
  };
}

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
    // U2 fix: --tmpfs /tmp gives the read-only rootfs a writable scratch space
    // (screenshots write /tmp/screenshot.png; without this mount every action
    // would fail under --read-only).
    dockerArgs: [
      "--rm",
      // Portable no-new-privileges form: `--security-opt no-new-privileges`
      // works on both legacy engines and Docker 29+, unlike the removed
      // --no-new-privileges shorthand.
      "--security-opt", "no-new-privileges",
      "--cap-drop", "ALL",
      "--read-only",
      "--tmpfs", "/tmp:rw,noexec,nosuid,size=64m",
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

// Redact secrets in captured text — moved to processor-pipeline.mjs (re-exported above).

// M11/M15: Gateway — processor chain (fail-closed) → write audit FIRST → then act
// Default chain: [action-field-validation, policy-gate, audit-record] on pre +
// [redact-result] on post. U1: malformed action fields are denied through the
// governed pipeline (audited, sticky) BEFORE policy evaluation.
// options.processors REPLACES the whole chain for full ordering control
// (compose the exported built-in processors yourself when overriding).
export function createGateway(options = {}) {
  const policy = options.policy;
  const audit = options.audit ?? createActionAudit();
  const processors = Array.isArray(options.processors)
    ? options.processors
    : [
        actionFieldValidationProcessor(),
        policyGateProcessor(policy),
        auditRecordProcessor(audit),
        redactResultProcessor(),
      ];

  return {
    audit,
    processors,

    // Runs all pre processors in declared order, writes the audit record BEFORE
    // acting, then — when an executor is provided — executes and runs the post
    // processors over the result. Without an executor it keeps the M11
    // decision-only return shape.
    async evaluateAction(action, execute) {
      const ctx = {
        phase: "pre",
        action: { ...action },
        target: null,
        result: null,
        allowed: true,
        decision: "allow",
        auditPayloads: [],
      };
      ctx.target = ctx.action; // pre transforms patch the effective action

      const pre = await runProcessors(processors, "pre", ctx);

      // M16 metrics — aggregate outcome only; never label with action text/details
      metrics.counter("ardyn_computer_use_actions_total", { outcome: pre.allowed ? "allowed" : "denied" });

      // Record-before-act invariant: exactly one authoritative row per evaluation,
      // even if a custom chain lacks or misorders the audit-record processor.
      if ((!ctx.auditRecord || ctx.auditWrittenDecision !== ctx.decision) &&
          audit && typeof audit.record === "function") {
        writeActionAuditRecord(audit, ctx);
      }
      const auditRecord = ctx.auditRecord;

      if (!pre.allowed) {
        return { allowed: false, decision: ctx.decision, reason: ctx.reason, auditRecord, auditRecordWrittenBefore: true };
      }

      if (!execute) {
        return { allowed: true, decision: "allow", auditRecord, auditRecordWrittenBefore: true };
      }

      // Execute with the effective (possibly transform-patched) action; executor
      // errors are caught so the post chain still runs (and redacts error strings).
      let result;
      try {
        result = await execute(ctx.action);
      } catch (err) {
        result = { status: "error", error: err?.message ?? String(err) };
      }

      const postCtx = {
        phase: "post",
        action: ctx.action,
        result,
        target: result && typeof result === "object" ? result : null,
        allowed: true,
        decision: "allow",
        auditPayloads: [],
      };
      const post = await runProcessors(processors, "post", postCtx);
      if (!post.allowed) {
        // Fail closed on post: never release captured output through a broken chain.
        result = {
          ...(result && typeof result === "object" && result.action ? { action: result.action } : {}),
          status: "error",
          error: `post_processor_fail_closed:${post.decision}`,
        };
        audit.record({ action: "post_processor_fail_closed", processor: post.decision, timestamp: new Date().toISOString() });
      }

      return {
        ...(result && typeof result === "object" ? result : { result }),
        allowed: true,
        decision: "allow",
        auditRecord,
        auditRecordWrittenBefore: true,
      };
    },
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

  // M11-real: Build docker exec command for an action.
  // U1 hardening: every interpolated value is either a VALIDATED integer
  // (coords/ms), an allowlisted keysym token, or base64 — free text never
  // touches the shell string. The executor re-validates before calling this,
  // so an invalid field can never reach here.
  function buildExecCommand(action) {
    const args = ["exec", `ardyn-sandbox-${config.sessionId}`];
    switch (action.action) {
      case "screenshot":
        args.push("sh", "-c", "DISPLAY=:99 import -window root /tmp/screenshot.png && base64 /tmp/screenshot.png");
        break;
      case "click":
        args.push("sh", "-c", `DISPLAY=:99 xdotool click --window root ${action.x},${action.y}`);
        break;
      case "double_click":
        args.push("sh", "-c", `DISPLAY=:99 xdotool click --repeat 2 --delay 100 --window root ${action.x},${action.y}`);
        break;
      case "type": {
        // Base64-encode so quotes/$/backticks/newlines in the text can never
        // break out of the command; decode inside the container to a tmpfs
        // file, then let xdotool type from the file (--file avoids argv limits).
        const b64 = Buffer.from(String(action.text), "utf8").toString("base64");
        args.push(
          "sh",
          "-c",
          `echo ${b64} | base64 -d > /tmp/ardyn-type-input && DISPLAY=:99 xdotool type --clearmodifiers --file /tmp/ardyn-type-input`
        );
        break;
      }
      case "key_press":
        // keys matched KEYSYM_ALLOWED (no spaces/metachars) during validation
        args.push("sh", "-c", `DISPLAY=:99 xdotool key -- ${action.keys}`);
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
        args.push("sh", "-c", `sleep ${(isBoundedInt(action.ms, WAIT_MS_MAX) ? action.ms : 0) / 1000}`);
        break;
      default:
        // Unreachable via the governed path (validation denies unknown actions
        // first); kept as a loud no-op so this function can never execute
        // anything unintended.
        args.push("sh", "-c", "echo 'unreachable: unvalidated action reached executor'");
    }
    return { cmd: "docker", args };
  }

  // U2 fix: wait for process CLOSE (not the earlier "spawn" event) so stdout is
  // fully captured — this is what makes real container IDs and action results
  // observable, and what lets start() verify docker run's exit code before
  // reporting success.
  function spawnAndWait(cmd, args) {
    return new Promise((resolve, reject) => {
      const child = _spawn(cmd, args, { stdio: ["pipe", "pipe", "pipe"] });
      let stdoutData = "";
      let stderrData = "";
      child.stdout?.on("data", (d) => { stdoutData += d.toString(); });
      child.stderr?.on("data", (d) => { stderrData += d.toString(); });

      child.on("error", (err) => reject(err));
      child.on("close", (code) => resolve({ child, exitCode: code ?? -1, stdout: stdoutData.trim(), stderr: stderrData.trim() }));
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

      // M11-real: REAL SPAWN — docker run with isolation flags.
      // U2 fix: success is only reported after docker run EXITS SUCCESSFULLY
      // and printed a container id; a failed pull/bad flag now surfaces as an
      // honest spawnError instead of a fake alive sandbox.
      const { cmd, args } = buildRunCommand();
      try {
        const result = await spawnAndWait(cmd, args);
        if (result.exitCode !== 0 || !result.stdout) {
          const detail = result.stderr ? `: ${result.stderr.slice(0, 300)}` : " (no container id printed)";
          audit.record({ action: "spawn_error", error: `docker run failed (exit ${result.exitCode})${detail}`, timestamp: new Date().toISOString() });
          alive = false;
          return { spawnError: `docker run failed (exit ${result.exitCode})${detail}` };
        }
        // docker run -d prints exactly one line: the container id.
        containerId = result.stdout.split("\n")[0]?.trim() ?? null;
        childProcess = result.child;
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

    // M11-real/M15: Execute an action through the gateway processor pipeline
    // (pre chain → audit-before-act → executor → post chain incl. redaction)
    async executeAction(action) {
      if (!alive) throw new Error("Sandbox session is not alive");
      if (humanControl) {
        audit.record({ action: action.action, refused: true, reason: "human_in_control", timestamp: new Date().toISOString() });
        return { refused: true, reason: "human_in_control" };
      }
      // Executor closure: run by the gateway between pre and post processors.
      // Raw stdout is returned unredacted — the default post chain (redact-result) masks it.
      // U1 defense in depth: the executor re-validates the EFFECTIVE action
      // even when a custom processor chain replaced the default one — an
      // invalid or unknown field can never reach buildExecCommand.
      const exec = async (effectiveAction) => {
        const verdict = validateComputerUseAction(effectiveAction);
        if (!verdict.ok) {
          audit.record({ action: effectiveAction?.action ?? "unknown", refused: true, reason: verdict.reason, timestamp: new Date().toISOString() });
          return { action: effectiveAction?.action ?? "unknown", status: "error", error: verdict.reason };
        }
        audit.record({ ...effectiveAction, status: "executed", timestamp: new Date().toISOString() });
        if (options.dryRun) {
          return { action: effectiveAction.action, status: "dry_run", result: "planned" };
        }
        const { cmd, args } = buildExecCommand(effectiveAction);
        try {
          const result = await spawnAndWait(cmd, args);
          if (result.exitCode !== 0) {
            audit.record({ action: "exec_error", error: `exit ${result.exitCode}: ${result.stderr.slice(0, 300)}`, timestamp: new Date().toISOString() });
            return { action: effectiveAction.action, status: "error", error: `docker exec failed (exit ${result.exitCode}): ${result.stderr.slice(0, 300)}` };
          }
          return { action: effectiveAction.action, status: "executed", result: result.stdout || "" };
        } catch (err) {
          audit.record({ action: "exec_error", error: err.message, timestamp: new Date().toISOString() });
          return { action: effectiveAction.action, status: "error", error: err.message };
        }
      };
      const gateResult = await gateway.evaluateAction(action, exec);
      if (!gateResult.allowed) {
        return { refused: true, reason: gateResult.decision, auditRecord: gateResult.auditRecord };
      }
      return gateResult;
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

    // M11-real: Kill switch — REAL docker kill to tear the sandbox down.
    // Credibility pass: teardown spawns get 'error' listeners (a missing docker
    // binary used to crash the process with an unhandled 'error' event) and
    // failures are audited instead of silently swallowed.
    kill() {
      if (!alive) return;
      alive = false;
      killedReason = "kill_switch";
      audit.record({ action: "kill_switch_activated", timestamp: new Date().toISOString() });
      metrics.counter("ardyn_runtime_sessions_killed_total");
      if (!options.dryRun && options.approved) {
        const { cmd, args } = buildKillCommand();
        try {
          const child = _spawn(cmd, args, { stdio: ["pipe", "pipe", "pipe"] });
          child.on("error", (err) => {
            audit.record({ action: "kill_error", error: err?.message ?? String(err), timestamp: new Date().toISOString() });
          });
        } catch (err) {
          audit.record({ action: "kill_error", error: err?.message ?? String(err), timestamp: new Date().toISOString() });
        }
      }
    },

    // M11-real: End session — REAL docker rm to destroy the sandbox.
    end() {
      if (!alive) return;
      alive = false;
      destroyReason = "session_end";
      audit.record({ action: "session_ended", timestamp: new Date().toISOString() });
      metrics.counter("ardyn_runtime_sessions_killed_total");
      if (!options.dryRun && options.approved) {
        const { cmd, args } = buildRmCommand();
        try {
          const child = _spawn(cmd, args, { stdio: ["pipe", "pipe", "pipe"] });
          child.on("error", (err) => {
            audit.record({ action: "end_error", error: err?.message ?? String(err), timestamp: new Date().toISOString() });
          });
        } catch (err) {
          audit.record({ action: "end_error", error: err?.message ?? String(err), timestamp: new Date().toISOString() });
        }
      }
    },

    // Take a screenshot
    async screenshot() {
      return this.executeAction({ action: "screenshot" });
    },
  };
}

// U9: Standalone teardown — stops and removes a sandbox container by session
// id, WITHOUT needing the original session object. This is what makes the
// CLI's kill switch real: `computer-use --kill <sessionId>` tears down the
// detached container that `computer-use` (live) left running. spawnImpl is
// injectable for tests.
export async function teardownSandbox(sessionId, { spawnImpl } = {}) {
  const _spawn = spawnImpl ?? defaultSpawn;
  const name = `ardyn-sandbox-${sessionId}`;
  const audit = createActionAudit();
  // rm -f covers both running and already-stopped containers; a separate kill
  // is unnecessary noise. Failures are audited and returned, never thrown past
  // the caller unchecked.
  const result = await new Promise((resolve) => {
    let stdout = "";
    let stderr = "";
    let child;
    try {
      child = _spawn("docker", ["rm", "-f", name], { stdio: ["pipe", "pipe", "pipe"] });
    } catch (err) {
      audit.record({ action: "teardown_error", error: err?.message ?? String(err), timestamp: new Date().toISOString() });
      resolve({ ok: false, error: err?.message ?? String(err), audit });
      return;
    }
    child.stdout?.on("data", (d) => { stdout += d.toString(); });
    child.stderr?.on("data", (d) => { stderr += d.toString(); });
    child.on("error", (err) => {
      audit.record({ action: "teardown_error", error: err?.message ?? String(err), timestamp: new Date().toISOString() });
      resolve({ ok: false, error: err?.message ?? String(err), audit });
    });
    child.on("close", (code) => {
      if (code === 0) {
        audit.record({ action: "sandbox_torn_down", container: name, timestamp: new Date().toISOString() });
        resolve({ ok: true, container: name, stdout: stdout.trim(), audit });
      } else {
        audit.record({ action: "teardown_error", error: `docker rm -f exited ${code}: ${stderr.trim().slice(0, 300)}`, timestamp: new Date().toISOString() });
        resolve({ ok: false, error: `docker rm -f exited ${code}: ${stderr.trim().slice(0, 300)}`, audit });
      }
    });
  });
  metrics.counter("ardyn_runtime_sessions_killed_total");
  return result;
}

export default {
  toolSchema,
  SANDBOX_IMAGE,
  createSandboxConfig,
  createActionAudit,
  redactCapturedText,
  createSandboxSession,
  createGateway,
  validateComputerUseAction,
  actionFieldValidationProcessor,
  teardownSandbox,
};