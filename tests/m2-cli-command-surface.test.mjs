// M2: CLI command surface — all commands work as specified
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, rm, writeFile, readdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import test from "node:test";

const execFileAsync = promisify(execFile);
const cliPath = "apps/cli/src/index.mjs";
const minimalManifest = "examples/minimal-manifest/ardyn.manifest.json";

async function runCli(args, options = {}) {
  try {
    const { stdout, stderr } = await execFileAsync("node", [cliPath, ...args], {
      cwd: process.cwd(),
      maxBuffer: 2 * 1024 * 1024,
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

test("M2: doctor produces valid JSON with status", async () => {
  const { code, stdout, stderr } = await runCli(["doctor"]);
  assert.equal(code, 0, `doctor should succeed: ${stderr}`);
  const output = JSON.parse(stdout);
  assert.ok(output.status, "doctor should have status");
  assert.ok(output.phase, "doctor should have phase");
});

test("M2: identity produces valid JSON with name", async () => {
  const { code, stdout } = await runCli(["identity"]);
  assert.equal(code, 0);
  const output = JSON.parse(stdout);
  assert.equal(output.name, "ardyn");
});

test("M2: capabilities with manifest produces valid JSON", async () => {
  const { code, stdout } = await runCli(["capabilities", "--manifest", minimalManifest]);
  assert.equal(code, 0);
  const output = JSON.parse(stdout);
  assert.ok(output.capabilities, "should have capabilities");
});

test("M2: capabilities without manifest fails with error", async () => {
  const { code, stdout, stderr } = await runCli(["capabilities"]);
  assert.notEqual(code, 0);
  assert.equal(stdout, "");
  assert.match(stderr, /Missing required --manifest path/);
});

test("M2: plan with manifest and task produces output", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-m2-plan-"));
  try {
    const taskPath = join(scratch, "task.json");
    await writeFile(taskPath, JSON.stringify({
      id: "test-task",
      objective: "Test task for M2",
      mode: "plan",
      requestedCapabilities: ["test.capability"]
    }));
    const { code, stdout, stderr } = await runCli(["plan", "--manifest", minimalManifest, "--task", taskPath, "--summary"]);
    assert.equal(code, 0, `plan should succeed: ${stderr}`);
    const output = JSON.parse(stdout);
    assert.ok(output.output, "plan should produce output");
  } finally {
    await rm(scratch, { recursive: true, force: true });
  }
});

test("M2: serve --dry-run produces runtime plan without executing", async () => {
  const { code, stdout } = await runCli(["serve", "--dry-run", "--manifest", minimalManifest]);
  assert.equal(code, 0);
  const output = JSON.parse(stdout);
  assert.equal(output.command, "serve");
  assert.equal(output.dryRun, true);
  assert.equal(output.executionEnabled, false);
});

test("M2: serve without --dry-run fails", async () => {
  const { code, stderr } = await runCli(["serve", "--manifest", minimalManifest]);
  assert.notEqual(code, 0);
  assert.match(stderr, /Phase 3|dry-run/);
});

test("M2: serve-runtime --enable-runtime --dry-run produces runtime plan", async () => {
  const { code, stdout } = await runCli(["serve-runtime", "--enable-runtime", "--dry-run", "--manifest", minimalManifest]);
  assert.equal(code, 0);
  const output = JSON.parse(stdout);
  assert.equal(output.command, "serve-runtime");
  assert.equal(output.runtimeEnabled, true);
  assert.equal(output.dryRun, true);
  assert.equal(output.killSwitchAvailable, true);
});

test("M2: serve-runtime without --enable-runtime fails (approval gate)", async () => {
  const { code, stdout } = await runCli(["serve-runtime"]);
  assert.notEqual(code, 0);
  assert.equal(stdout, "");
});

test("M2: path traversal protection on --task", async () => {
  const { code, stderr } = await runCli(["plan", "--manifest", minimalManifest, "--task", "../../../etc/passwd", "--summary"]);
  assert.notEqual(code, 0);
  assert.match(stderr, /task must point to a .json file|path|confine|travers/i);
});

test("M2: path traversal protection on --manifest", async () => {
  const { code, stderr } = await runCli(["capabilities", "--manifest", "../../../etc/passwd"]);
  assert.notEqual(code, 0);
});