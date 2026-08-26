// M11: Governed computer-use — real sandbox spawn, gateway, take-the-wheel
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import test from "node:test";

const execFileAsync = promisify(execFile);
const cliPath = "apps/cli/src/index.mjs";
const manifest = "examples/minimal-manifest/ardyn.manifest.json";

async function runCli(args) {
  try {
    const { stdout, stderr } = await execFileAsync("node", [cliPath, ...args], {
      cwd: process.cwd(), maxBuffer: 4 * 1024 * 1024,
    });
    return { code: 0, stdout, stderr };
  } catch (error) {
    return { code: error.code ?? 1, stdout: error.stdout ?? "", stderr: error.stderr ?? String(error) };
  }
}

// ── Gateway: record-before-act ──

test("M11: gateway writes audit record BEFORE acting", async () => {
  const { default: cu } = await import("../packages/core/src/computer-use.mjs");
  const gateway = cu.createGateway({ sessionId: "test-gateway", dryRun: true, policy: { deny: [], allow: [{}] } });
  const result = await gateway.evaluateAction({ action: "screenshot" });
  assert.equal(result.allowed, true, "screenshot should be allowed with default-allow policy");
  assert.ok(result.auditRecord, "must have audit record");
  assert.ok(result.auditRecordWrittenBefore, "audit record must be written BEFORE action");
  assert.equal(result.auditRecord.action, "screenshot");
  assert.ok(result.auditRecord.timestamp, "audit record must have timestamp");
});

test("M11: gateway fails closed on missing policy", async () => {
  const { default: cu } = await import("../packages/core/src/computer-use.mjs");
  const gateway = cu.createGateway({ sessionId: "test-fail-closed", dryRun: true, policy: null });
  const result = await gateway.evaluateAction({ action: "click", x: 100, y: 200 });
  assert.equal(result.allowed, false, "must deny when policy is missing");
  assert.ok(result.auditRecord, "must still write audit record for denial");
  assert.match(result.auditRecord.decision, /deny/, "audit decision must be a denial");
});

test("M11: gateway deny rules evaluated before allow", async () => {
  const { default: cu } = await import("../packages/core/src/computer-use.mjs");
  const gateway = cu.createGateway({
    sessionId: "test-deny-first", dryRun: true,
    policy: { deny: [{ action: "type", text: "rm -rf" }], allow: [{ action: "type" }] },
  });
  // "rm -rf" matches deny → must deny even though allow permits "type"
  const result = await gateway.evaluateAction({ action: "type", text: "rm -rf /" });
  assert.equal(result.allowed, false, "deny must win over allow");
  assert.match(result.auditRecord.decision, /deny/, "audit decision must be a denial");
  // Normal text should be allowed
  const ok = await gateway.evaluateAction({ action: "type", text: "hello" });
  assert.equal(ok.allowed, true, "normal type should be allowed");
});

// ── Take the wheel ──

test("M11: take the wheel pauses bot and refuses bot actions during human control", async () => {
  const { default: cu } = await import("../packages/core/src/computer-use.mjs");
  const session = cu.createSandboxSession({ sessionId: "test-wheel", dryRun: true, policy: { deny: [], allow: [{}] } });
  assert.equal(session.humanControl, false, "human control starts false");
  session.takeTheWheel();
  assert.equal(session.humanControl, true, "human control is taken");
  // Bot actions should be refused during human control
  const result = await session.executeAction({ action: "click", x: 1, y: 1 });
  assert.equal(result.refused, true, "bot actions must be refused during human control");
  assert.equal(result.reason, "human_in_control");
  session.releaseControl();
  assert.equal(session.humanControl, false, "human control is released");
  // After release, bot actions work again
  const ok = await session.executeAction({ action: "screenshot" });
  assert.notEqual(ok.refused, true, "bot actions should work after control released");
});

test("M11: control_taken and control_released are audited", async () => {
  const { default: cu } = await import("../packages/core/src/computer-use.mjs");
  const session = cu.createSandboxSession({ sessionId: "test-audit-wheel", dryRun: true, policy: { deny: [], allow: [{}] } });
  session.takeTheWheel();
  session.releaseControl();
  const events = session.audit.getEvents();
  const taken = events.find(e => e.action === "control_taken");
  const released = events.find(e => e.action === "control_released");
  assert.ok(taken, "control_taken must be audited");
  assert.ok(released, "control_released must be audited");
});

// ── Real sandbox spawn (dry-run verified, real spawn tested structurally) ──

test("M11: sandbox spawn config has real docker run args", async () => {
  const { default: cu } = await import("../packages/core/src/computer-use.mjs");
  const config = cu.createSandboxConfig({ sessionId: "test-spawn" });
  assert.ok(config.dockerArgs.includes("--rm"), "must have --rm for ephemeral");
  assert.ok(config.dockerArgs.includes("--network"), "must restrict network");
  // U2: portable no-new-privileges form (--security-opt) works on legacy
  // engines and Docker 29+ alike, unlike the removed --no-new-privileges flag.
  assert.ok(config.dockerArgs.includes("--security-opt"), "must drop privileges");
  assert.ok(config.dockerArgs.includes("no-new-privileges"), "must drop privileges");
  assert.ok(config.dockerArgs.includes("--cap-drop"), "must drop capabilities");
});

test("M11: sandbox session has per-session token for loopback auth", async () => {
  const { default: cu } = await import("../packages/core/src/computer-use.mjs");
  const session = cu.createSandboxSession({ sessionId: "test-token", dryRun: true });
  assert.ok(session.sessionToken, "must have a per-session token");
  assert.notEqual(session.sessionToken, "test-token", "token must not be the session ID");
});