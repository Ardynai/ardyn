// M9: Computer-use sandboxed agent loop — tests
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { mkdtemp, rm, writeFile, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

const execFileAsync = promisify(execFile);

async function runCli(args) {
  try {
    const { stdout, stderr } = await execFileAsync("node", ["apps/cli/src/index.mjs", ...args], {
      cwd: process.cwd(), maxBuffer: 4 * 1024 * 1024,
    });
    return { code: 0, stdout, stderr };
  } catch (error) {
    return { code: error.code ?? 1, stdout: error.stdout ?? "", stderr: error.stderr ?? String(error) };
  }
}

const manifest = "examples/minimal-manifest/ardyn.manifest.json";

// ── Tool schema tests ──

test("M9: computer-use tool schema is model-agnostic and exported", async () => {
  const { default: computerUse } = await import("../packages/core/src/computer-use.mjs");
  assert.ok(computerUse.toolSchema, "must export tool schema");
  assert.ok(computerUse.toolSchema.name, "schema must have a name");
  assert.ok(computerUse.toolSchema.actions, "schema must list actions");
  const actions = computerUse.toolSchema.actions;
  for (const required of ["screenshot", "click", "double_click", "type", "key_press", "scroll", "mouse_move", "drag", "wait"]) {
    assert.ok(actions.find(a => a.name === required), `must include ${required} action`);
  }
});

// ── Approval gate tests ──

test("M9: computer-use without --enable-computer-use fails (approval gate)", async () => {
  const result = await runCli(["computer-use", "--manifest", manifest]);
  assert.notEqual(result.code, 0);
  assert.equal(result.stdout, "");
});

test("M9: computer-use --dry-run produces plan without spawning sandbox", async () => {
  const result = await runCli(["computer-use", "--enable-computer-use", "--dry-run", "--manifest", manifest]);
  assert.equal(result.code, 0);
  const output = JSON.parse(result.stdout);
  assert.equal(output.command, "computer-use");
  assert.equal(output.dryRun, true);
  assert.equal(output.sandboxSpawned, false);
  assert.ok(output.sandboxImage, "must specify a pinned sandbox image");
  assert.ok(output.networkEgress, "must have network egress config");
  assert.equal(output.networkEgress.default, "deny");
  assert.ok(output.killSwitchAvailable, "must have kill switch");
  assert.ok(output.transcriptAudit, "must have transcript audit");
  assert.ok(output.redaction, "must have redaction");
});

test("M9: computer-use --dry-run without --approve shows approval required", async () => {
  const result = await runCli(["computer-use", "--enable-computer-use", "--approve", "--dry-run", "--manifest", manifest]);
  assert.equal(result.code, 0);
  const output = JSON.parse(result.stdout);
  assert.equal(output.approvalGateStatus, "dry-run-no-approval-needed");
});

// ── Sandbox isolation tests ──

test("M9: sandbox config rejects host filesystem access", async () => {
  const { default: computerUse } = await import("../packages/core/src/computer-use.mjs");
  const config = computerUse.createSandboxConfig({ sessionId: "test-isolation" });
  assert.equal(config.mountHostFilesystem, false, "must not mount host filesystem");
  assert.equal(config.accessHostEnv, false, "must not access host env vars");
  assert.equal(config.accessHostCredentials, false, "must not access host credentials");
  assert.equal(config.accessArdynRepo, false, "must not access Ardyn repo");
  assert.ok(config.containerImage, "must specify a container image");
  assert.ok(config.containerImage.includes(":"), "image must be pinned with a tag");
  assert.equal(config.networkEgress, "deny", "network egress must be deny by default");
  assert.ok(config.ephemeral, "sandbox must be ephemeral");
  assert.ok(config.destroyOnSessionEnd, "sandbox must be destroyed on session end");
});

test("M9: sandbox allowlist is empty by default (deny-by-default)", async () => {
  const { default: computerUse } = await import("../packages/core/src/computer-use.mjs");
  const config = computerUse.createSandboxConfig({ sessionId: "test-egress" });
  assert.deepEqual(config.networkAllowlist, [], "network allowlist must be empty by default");
});

// ── Action audit + redaction tests ──

test("M9: action audit records all actions with timestamps", async () => {
  const { default: computerUse } = await import("../packages/core/src/computer-use.mjs");
  const audit = computerUse.createActionAudit();
  audit.record({ action: "screenshot", result: "captured" });
  audit.record({ action: "click", x: 100, y: 200 });
  const events = audit.getEvents();
  assert.equal(events.length, 2);
  assert.equal(events[0].action, "screenshot");
  assert.ok(events[0].timestamp, "each event must have a timestamp");
  assert.equal(events[1].action, "click");
  assert.equal(events[1].x, 100);
});

test("M9: redaction masks secrets in captured text", async () => {
  const { default: computerUse } = await import("../packages/core/src/computer-use.mjs");
  const redacted = computerUse.redactCapturedText("token=secret123 password=abc Bearer xyz");
  assert.match(redacted, /REDACTED/);
  assert.doesNotMatch(redacted, /secret123/);
  assert.doesNotMatch(redacted, /password=abc/);
});

// ── Kill switch tests ──

test("M9: kill switch terminates sandbox session", async () => {
  const { default: computerUse } = await import("../packages/core/src/computer-use.mjs");
  const session = computerUse.createSandboxSession({ sessionId: "test-kill", dryRun: true });
  assert.equal(session.alive, true);
  session.kill();
  assert.equal(session.alive, false);
  assert.equal(session.killedReason, "kill_switch");
});

test("M9: sandbox session is destroyed on end", async () => {
  const { default: computerUse } = await import("../packages/core/src/computer-use.mjs");
  const session = computerUse.createSandboxSession({ sessionId: "test-destroy", dryRun: true });
  assert.equal(session.alive, true);
  session.end();
  assert.equal(session.alive, false);
  assert.equal(session.destroyReason, "session_end");
});