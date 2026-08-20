// M4: Federation wiring — CLI federation command using hardened client
// Tests: CLI `federation` command connects to the hardened client
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import test from "node:test";

const execFileAsync = promisify(execFile);
const cliPath = "apps/cli/src/index.mjs";

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

test("M4: federation status command shows hardening status", async () => {
  const result = await runCli(["federation", "status"]);
  assert.equal(result.code, 0, `federation status should succeed: ${result.stderr}`);
  const output = JSON.parse(result.stdout);
  assert.equal(output.command, "federation");
  assert.equal(output.wired, true);
  assert.ok(output.hardening);
  assert.equal(output.hardening.redirectManual, true);
  assert.equal(output.hardening.hostAllowlist, true);
  assert.equal(output.hardening.responseSizeCap, true);
  assert.equal(output.hardening.identityConfinement, true);
});

test("M4: federation status shows loopback-only posture", async () => {
  const result = await runCli(["federation", "status"]);
  const output = JSON.parse(result.stdout);
  assert.equal(output.loopbackOnly, true);
  assert.equal(output.remoteHttps, true);
  assert.ok(output.closedSiblingAllowlist);
});

test("M4: federation config shows env config without secrets", async () => {
  const result = await runCli(["federation", "config"]);
  assert.equal(result.code, 0);
  const output = JSON.parse(result.stdout);
  assert.ok(output.config);
  // Should not expose any secret values
  assert.equal(output.config.registryToken, undefined);
  assert.equal(output.config.identityFile, undefined);
});