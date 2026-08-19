import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, rm, writeFile, readFile } from "node:fs/promises";
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
      maxBuffer: 4 * 1024 * 1024,
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

test("M1: serve-runtime --enable-runtime --approve --manifest spawns a real process", async () => {
  const result = await runCli([
    "serve-runtime",
    "--enable-runtime",
    "--approve",
    "--manifest", minimalManifest,
    "--command", "node -e process.stdout.write(JSON.stringify({ok:true})+\"\\n\")"
  ]);
  assert.equal(result.code, 0, `should succeed: ${result.stderr}`);
  const output = JSON.parse(result.stdout);
  assert.equal(output.command, "serve-runtime");
  assert.equal(output.runtimeEnabled, true);
  assert.equal(output.approved, true);
  assert.equal(output.dryRun, false);
  assert.equal(output.processesSpawned, true);
  assert.ok(output.sessionId, "should have a session ID");
  assert.ok(output.processResult, "should have a process result");
  assert.ok(output.processResult.stdout, "should have captured stdout from spawned process");
  assert.equal(output.processResult.exitCode, 0);
});

test("M1: serve-runtime --approve spawns process and captures JSONL stdout", async () => {
  const result = await runCli([
    "serve-runtime",
    "--enable-runtime",
    "--approve",
    "--manifest", minimalManifest,
    "--command", "node -e process.stdout.write(JSON.stringify({event:\"start\"})+\"\\n\");process.stdout.write(JSON.stringify({event:\"end\"})+\"\\n\")"
  ]);
  assert.equal(result.code, 0);
  const output = JSON.parse(result.stdout);
  assert.ok(output.processResult.frames, "should have parsed JSONL frames");
  assert.equal(output.processResult.frames.length, 2);
  assert.equal(output.processResult.frames[0].event, "start");
  assert.equal(output.processResult.frames[1].event, "end");
});

test("M1: serve-runtime --approve captures stderr and applies redaction", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-m1-redact-"));
  try {
    const scriptPath = join(scratch, "redact-test.js");
    await writeFile(scriptPath, "process.stderr.write('ERROR: token=secret123\\n');process.exit(0)");
    const result = await runCli([
      "serve-runtime",
      "--enable-runtime",
      "--approve",
      "--manifest", minimalManifest,
      "--command", `node ${scriptPath}`
    ]);
    assert.equal(result.code, 0);
    const output = JSON.parse(result.stdout);
    assert.ok(output.processResult.stderr, "should have captured stderr");
    // Redaction should mask token-like patterns
    assert.match(output.processResult.stderr, /REDACTED|masked|\*\*\*/i, "stderr should be redacted");
  } finally {
    await rm(scratch, { recursive: true, force: true });
  }
});

test("M1: serve-runtime --approve handles non-zero exit codes", async () => {
  const result = await runCli([
    "serve-runtime",
    "--enable-runtime",
    "--approve",
    "--manifest", minimalManifest,
    "--command", "node -e process.exit(1)"
  ]);
  assert.equal(result.code, 0); // CLI itself succeeds; process exit is captured
  const output = JSON.parse(result.stdout);
  assert.equal(output.processResult.exitCode, 1);
  assert.equal(output.failureAudit.activated, true, "failure audit should activate on non-zero exit");
});

test("M1: serve-runtime kill switch is functional", async () => {
  const result = await runCli([
    "serve-runtime",
    "--enable-runtime",
    "--approve",
    "--manifest", minimalManifest,
    "--command", "node -e setTimeout(()=>{process.stdout.write(\"done\\n\")},10000)",
    "--kill-after-ms", "200"
  ]);
  assert.equal(result.code, 0);
  const output = JSON.parse(result.stdout);
  assert.equal(output.processResult.killed, true, "process should be killed");
  assert.equal(output.killSwitchActivated, true, "kill switch should be activated");
  assert.ok(output.processResult.killedReason, "should have a kill reason");
});

test("M1: serve-runtime without --command runs a no-op session", async () => {
  const result = await runCli([
    "serve-runtime",
    "--enable-runtime",
    "--approve",
    "--manifest", minimalManifest
  ]);
  assert.equal(result.code, 0);
  const output = JSON.parse(result.stdout);
  assert.equal(output.processesSpawned, false);
  assert.equal(output.processResult, null);
  assert.ok(output.sessionId);
});

test("M1: serve-runtime transcript audit records the session", async () => {
  const result = await runCli([
    "serve-runtime",
    "--enable-runtime",
    "--approve",
    "--manifest", minimalManifest,
    "--command", "node -e process.stdout.write(JSON.stringify({event:\"test\"})+\"\\n\")"
  ]);
  assert.equal(result.code, 0);
  const output = JSON.parse(result.stdout);
  assert.ok(output.transcriptAudit, "should have transcript audit");
  assert.ok(output.transcriptAudit.events, "should have recorded events");
  assert.ok(output.transcriptAudit.events.length > 0, "should have at least one event");
});