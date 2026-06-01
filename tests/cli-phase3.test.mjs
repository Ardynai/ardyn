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

async function runCliFailure(args) {
  let result;

  try {
    result = await execFileAsync(process.execPath, ["apps/cli/src/index.mjs", ...args], {
      cwd: process.cwd(),
      encoding: "utf8"
    });
  } catch (error) {
    if (typeof error.code !== "number" || error.stdout === undefined || error.stderr === undefined) {
      throw error;
    }

    return {
      code: error.code,
      stdout: error.stdout,
      stderr: error.stderr
    };
  }

  assert.fail(`Expected ardyn ${args.join(" ")} to fail, got stdout: ${result.stdout}`);
}

function assertCliFailure(failure, stderrPattern) {
  assert.notEqual(failure.code, 0);
  assert.equal(failure.stdout, "");
  assert.match(failure.stderr, stderrPattern);
}

function assertAllFalse(flags) {
  for (const [key, value] of Object.entries(flags)) {
    assert.equal(value, false, `${key} should remain false`);
  }
}

test("ardyn plan prints a non-executing task plan", async () => {
  const output = await runCli([
    "plan",
    "--manifest",
    "examples/minimal-manifest/ardyn.manifest.json",
    "--task",
    "examples/minimal-task/task.json"
  ]);

  assert.equal(output.command, "plan");
  assert.equal(output.task.id, "task.minimal.describe");
  assert.deepEqual(
    output.selectedCapabilities.map((capability) => capability.id),
    ["runtime.describe"]
  );
  assert.equal(output.approval.required, false);
  assert.equal(output.approval.status, null);
  assert.equal(output.matchingPolicy.tags, false);
  assertAllFalse(output.safety);
});

test("ardyn plan without --manifest fails without JSON output", async () => {
  const failure = await runCliFailure(["plan", "--task", "examples/minimal-task/task.json"]);

  assertCliFailure(failure, /Missing required --manifest path\./);
});

test("ardyn plan without --task fails without JSON output", async () => {
  const failure = await runCliFailure([
    "plan",
    "--manifest",
    "examples/minimal-manifest/ardyn.manifest.json"
  ]);

  assertCliFailure(failure, /Missing required --task path\./);
});
