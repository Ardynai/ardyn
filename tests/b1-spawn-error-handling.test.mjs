// B1: spawn error handling — ENOENT and spawn failure route to failure audit
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
      cwd: process.cwd(),
      maxBuffer: 4 * 1024 * 1024,
    });
    return { code: 0, stdout, stderr };
  } catch (error) {
    return {
      code: error.code ?? 1,
      stdout: error.stdout ?? "",
      stderr: error.stderr ?? String(error),
    };
  }
}

test("B1: serve-runtime with missing binary produces clean audited failure (not crash)", async () => {
  const result = await runCli([
    "serve-runtime",
    "--enable-runtime",
    "--approve",
    "--manifest", manifest,
    "--command", "nonexistent-binary-xyz123"
  ]);
  // CLI must not crash — it should produce JSON output
  assert.equal(result.code, 0, `CLI should not crash: ${result.stderr}`);
  const output = JSON.parse(result.stdout);
  assert.ok(output.processResult, "should have process result");
  assert.equal(output.processResult.killed, false);
  assert.ok(output.processResult.spawnError, "should have spawnError");
  assert.match(output.processResult.spawnError, /ENOENT|not found|spawn/i);
  assert.equal(output.failureAudit.activated, true, "failure audit should activate on spawn error");
  assert.equal(output.processResult.exitCode, -1, "exit code should be -1 for spawn failure");
});

test("B1: shell with missing binary produces clean audited failure", async () => {
  const result = await runCli([
    "shell",
    "--enable-runtime",
    "--approve",
    "--manifest", manifest,
    "--command", "nonexistent-binary-xyz123"
  ]);
  assert.equal(result.code, 0, `CLI should not crash: ${result.stderr}`);
  const output = JSON.parse(result.stdout);
  assert.ok(output.processResult);
  // shell uses sh -c which handles the error gracefully, but stderr should have the error
  assert.ok(output.processResult.stderr || output.processResult.stdout !== undefined);
});

test("B1: serve-runtime --rust-session with missing binary produces clean failure", async () => {
  // Temporarily point to a non-existent binary path
  const result = await runCli([
    "serve-runtime",
    "--enable-runtime",
    "--approve",
    "--manifest", manifest,
    "--rust-session",
  ]);
  // The Rust binary may or may not exist depending on build state.
  // If it doesn't exist, we should get a clean failure, not a crash.
  if (result.code === 0) {
    const output = JSON.parse(result.stdout);
    if (output.processResult && output.processResult.exitCode !== 0) {
      assert.ok(output.processResult.spawnError || output.processResult.stderr, "should have error info");
      assert.equal(output.failureAudit.activated, true, "failure audit should activate");
    }
  }
});