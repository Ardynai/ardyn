// M1-Rust: Subprocess bridge — CLI invokes Rust host session lifecycle
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import test from "node:test";

const execFileAsync = promisify(execFile);

async function runCli(args) {
  try {
    const { stdout, stderr } = await execFileAsync("node", ["apps/cli/src/index.mjs", ...args], {
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

test("M1-Rust: serve-runtime --rust-session invokes the Rust host binary", async () => {
  const result = await runCli([
    "serve-runtime",
    "--enable-runtime",
    "--approve",
    "--manifest", "examples/minimal-manifest/ardyn.manifest.json",
    "--rust-session"
  ]);
  assert.equal(result.code, 0, `should succeed: ${result.stderr}`);
  const output = JSON.parse(result.stdout);
  assert.equal(output.command, "serve-runtime");
  assert.ok(output.processResult, "should have process result");
  assert.equal(output.processResult.rustSession, true);
  assert.ok(output.processResult.rustSessionId, "should have a Rust session ID");
  assert.equal(output.processResult.rustStatus, "completed");
  assert.ok(output.processResult.frames.length > 0, "should have processed frames");
});

test("M1-Rust: Rust session binary produces valid JSON without --approved", async () => {
  const { execFile } = await import("node:child_process");
  const { promisify } = await import("node:util");
  const exec = promisify(execFile);
  const { stdout } = await exec("cargo", ["run", "--manifest-path", "crates/ardyn-host/Cargo.toml", "--bin", "session", "--", "--max-frames", "4"], {
    cwd: process.cwd(),
    maxBuffer: 4 * 1024 * 1024,
  });
  const result = JSON.parse(stdout.trim());
  assert.equal(result.status, "blocked_approval_required");
  assert.equal(result.approval_required, true);
  assert.equal(result.approved, false);
  assert.equal(result.frames_processed, 0);
});