// M1: Runtime core — serve-runtime with explicit enable flag
// Tests that serve-runtime works under --enable-runtime, with approval gates,
// kill-switch, redaction, and transcript audit.
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, writeFile, rm, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import test from "node:test";

const execFileAsync = promisify(execFile);
const cliPath = "apps/cli/src/index.mjs";
const minimalManifestPath = "examples/minimal-manifest/ardyn.manifest.json";

async function runCli(args, options = {}) {
  try {
    const { stdout, stderr } = await execFileAsync("node", [cliPath, ...args], {
      cwd: process.cwd(),
      maxBuffer: 1024 * 1024,
      ...options
    });
    return { code: 0, stdout, stderr };
  } catch (error) {
    return {
      code: error.code ?? 1,
      stdout: error.stdout ?? "",
      stderr: error.stderr ?? String(error)
    };
  }
}

test("M1: serve-runtime without --enable-runtime still fails (approval gate)", async () => {
  const result = await runCli(["serve-runtime"]);
  assert.notEqual(result.code, 0, "serve-runtime without --enable-runtime must fail");
  assert.match(result.stderr, /runtime/i, "should mention runtime");
});

test("M1: serve-runtime --dry-run --enable-runtime produces runtime plan", async () => {
  const result = await runCli([
    "serve-runtime",
    "--dry-run",
    "--enable-runtime",
    "--manifest", minimalManifestPath
  ]);
  assert.equal(result.code, 0, `should succeed: ${result.stderr}`);
  assert.equal(result.stderr, "", "no stderr");

  const output = JSON.parse(result.stdout);
  assert.equal(output.command, "serve-runtime");
  assert.equal(output.dryRun, true);
  assert.equal(output.runtimeEnabled, true);
  assert.equal(typeof output.killSwitchAvailable, "boolean");
  assert.equal(typeof output.approvalGateStatus, "string");
  assert.equal(output.processesSpawned, false);
});

test("M1: serve-runtime --dry-run produces session lifecycle plan", async () => {
  const result = await runCli([
    "serve-runtime",
    "--dry-run",
    "--enable-runtime",
    "--manifest", minimalManifestPath
  ]);
  assert.equal(result.code, 0);

  const output = JSON.parse(result.stdout);
  assert.ok(output.sessionPlan, "should have sessionPlan");
  assert.ok(output.sessionPlan.sessionId, "session plan should have sessionId");
  assert.ok(output.sessionPlan.frames, "session plan should have frames array");
  assert.ok(output.redaction, "should have redaction config");
  assert.equal(output.redaction.stderrRedactionEnabled, true);
  assert.ok(output.transcriptAudit, "should have transcript audit config");
  assert.equal(output.transcriptAudit.replayEnabled, true);
});

test("M1: serve-runtime --enable-runtime without --dry-run requires approval", async () => {
  const result = await runCli([
    "serve-runtime",
    "--enable-runtime",
    "--manifest", minimalManifestPath
  ]);
  assert.notEqual(result.code, 0, "should require approval");
  assert.match(result.stderr, /approval/i, "should mention approval requirement");
});

test("M1: serve-runtime kill-switch is visible in output", async () => {
  const result = await runCli([
    "serve-runtime",
    "--dry-run",
    "--enable-runtime",
    "--manifest", minimalManifestPath
  ]);
  assert.equal(result.code, 0);
  const output = JSON.parse(result.stdout);
  assert.equal(output.killSwitchAvailable, true);
  assert.ok(output.killSwitchDescription, "kill switch should have a description");
});