import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import test from "node:test";

const execFileAsync = promisify(execFile);

async function runCli(args) {
  const result = await execFileAsync(process.execPath, ["apps/cli/src/index.mjs", ...args], {
    cwd: process.cwd(),
    encoding: "utf8"
  });

  return JSON.parse(result.stdout);
}

test("ardyn identity reports a static non-executing identity", async () => {
  const output = await runCli(["identity"]);

  assert.equal(output.name, "ardyn");
  assert.equal(output.phase, "phase-2-schema-handshake");
  assert.equal(output.executionEnabled, false);
  assert.equal(output.host.crateName, "ardyn-host");
});

test("ardyn doctor reports local runtime readiness without execution", async () => {
  const output = await runCli(["doctor"]);

  assert.equal(output.status, "ok");
  assert.equal(output.executionEnabled, false);
  assert.equal(output.toolExecutionEnabled, false);
  assert.equal(output.networkListening, false);
});

test("ardyn capabilities prints normalized manifest capabilities", async () => {
  const output = await runCli([
    "capabilities",
    "--manifest",
    "examples/minimal-manifest/ardyn.manifest.json"
  ]);

  assert.deepEqual(output.capabilities.map((capability) => capability.id), ["runtime.describe"]);
  assert.equal(output.manifest.name, "minimal-ardyn");
  assert.equal(output.executionEnabled, false);
});

test("ardyn serve --dry-run prints a runtime plan without executing anything", async () => {
  const output = await runCli([
    "serve",
    "--dry-run",
    "--manifest",
    "examples/minimal-manifest/ardyn.manifest.json"
  ]);

  assert.equal(output.command, "serve");
  assert.equal(output.dryRun, true);
  assert.equal(output.executionEnabled, false);
  assert.equal(output.toolExecutionEnabled, false);
  assert.equal(output.networkListening, false);
  assert.equal(output.longRunningServicesStarted, false);
  assert.equal(output.apiCallsEnabled, false);
  assert.equal(output.processesSpawned, false);
});
