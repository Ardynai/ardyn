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

const minimalManifestPath = "examples/minimal-manifest/ardyn.manifest.json";
const minimalTaskPath = "examples/minimal-task/task.json";
const planningManifestPath = "tests/fixtures/planning-manifest.json";
const exactMatchTaskPath = "tests/fixtures/tasks/exact-match.json";
const approvalRequiredTaskPath = "tests/fixtures/tasks/approval-required.json";

test("ardyn plan prints a non-executing task plan", async () => {
  const output = await runCli(["plan", "--manifest", minimalManifestPath, "--task", minimalTaskPath]);

  assert.equal(output.command, "plan");
  assert.equal(output.output, undefined);
  assert.equal(output.phase, "phase-3-task-planning");
  assert.equal(output.task.id, "task.minimal.describe");
  assert.deepEqual(
    output.selectedCapabilities.map((capability) => capability.id),
    ["runtime.describe"]
  );
  assert.equal(output.approval.required, false);
  assert.equal(output.approval.status, null);
  assert.equal(output.matchingPolicy.tags, true);
  assert.deepEqual(output.plannerTrace.manifest, {
    id: "minimal-ardyn",
    version: "0.1.0",
    schemaVersion: "0.1.0"
  });
  assert.deepEqual(output.plannerTrace.selectedCapabilities, ["runtime.describe"]);
  assert.equal(output.plannerTrace.approvalDecision.status, "not_required");
  assertAllFalse(output.safety);
});

test("ardyn plan --trace prints the full planner trace without enabling runtime work", async () => {
  const defaultOutput = await runCli([
    "plan",
    "--manifest",
    minimalManifestPath,
    "--task",
    minimalTaskPath
  ]);
  const output = await runCli([
    "plan",
    "--manifest",
    minimalManifestPath,
    "--task",
    minimalTaskPath,
    "--trace"
  ]);

  assert.equal(output.command, "plan");
  assert.equal(output.output, "trace");
  assert.deepEqual(output.manifest, {
    id: "minimal-ardyn",
    version: "0.1.0",
    schemaVersion: "0.1.0"
  });
  assert.equal(output.taskId, "task.minimal.describe");
  assert.deepEqual(output.trace, defaultOutput.plannerTrace);
  assert.deepEqual(output.trace.taskIntake, {
    valid: true,
    errors: [],
    taskId: "task.minimal.describe",
    requestedCapabilities: ["runtime.describe"]
  });
  assert.deepEqual(output.trace.candidateCapabilities, [
    {
      request: "runtime.describe",
      candidates: [
        {
          capabilityId: "runtime.describe",
          matchType: "exact",
          score: 300,
          scope: null,
          tag: null,
          reason: "Matched exact capability id."
        }
      ]
    }
  ]);
  assert.deepEqual(output.trace.selectedCapabilities, ["runtime.describe"]);
  assert.deepEqual(output.trace.unresolvedRequests, []);
  assert.equal(output.trace.approvalDecision.status, "not_required");
  assert.deepEqual(output.trace.safety, output.safety);
  assertAllFalse(output.trace.safety);
  assertAllFalse(output.safety);
});

test("ardyn plan --summary prints concise selection, unresolved, and approval results", async () => {
  const output = await runCli([
    "plan",
    "--manifest",
    planningManifestPath,
    "--task",
    approvalRequiredTaskPath,
    "--summary"
  ]);

  assert.equal(output.command, "plan");
  assert.equal(output.output, "summary");
  assert.deepEqual(output.manifest, {
    id: "planner-hardening",
    version: "0.1.0",
    schemaVersion: "0.1.0"
  });
  assert.equal(output.taskId, "task.phase3-1.approval");
  assert.deepEqual(output.selectedCapabilities, ["secure.registry"]);
  assert.deepEqual(output.unresolvedRequests, []);
  assert.equal(output.approval.required, true);
  assert.equal(output.approval.status, "approval-required");
  assert.deepEqual(output.approval.reasons, [
    {
      type: "task-constraint",
      field: "constraints.requireHumanApproval"
    },
    {
      type: "policy-scope",
      capabilityId: "secure.registry",
      scope: "registry",
      access: "read"
    }
  ]);
  assert.equal(output.approval.decision.status, "required");
  assert.equal(output.approval.decision.nonExecuting, true);
  assert.equal(output.trace, undefined);
  assert.equal(output.plannerTrace, undefined);
  assert.equal(output.requests, undefined);
  assert.equal(output.task, undefined);
  assertAllFalse(output.safety);
});

test("ardyn plan --explain prints deterministic candidate ranking", async () => {
  const output = await runCli([
    "plan",
    "--manifest",
    planningManifestPath,
    "--task",
    exactMatchTaskPath,
    "--explain"
  ]);

  assert.equal(output.command, "plan");
  assert.equal(output.output, "explain");
  assert.deepEqual(output.matchingPolicy, {
    exactCapabilityId: true,
    permissionScope: true,
    tags: true
  });
  assert.deepEqual(output.requests, [
    {
      request: "network",
      matchType: "exact",
      scope: null,
      reason: "Matched exact capability id.",
      selectedCapabilityIds: ["network"],
      candidates: [
        {
          capabilityId: "network",
          matchType: "exact",
          score: 300,
          scope: null,
          tag: null,
          reason: "Matched exact capability id."
        },
        {
          capabilityId: "beta.scope",
          matchType: "tag",
          score: 200,
          scope: null,
          tag: "network",
          reason: "Matched capability tag."
        },
        {
          capabilityId: "alpha.scope",
          matchType: "scope",
          score: 100,
          scope: "network",
          tag: null,
          reason: "Matched permission scope."
        },
        {
          capabilityId: "beta.scope",
          matchType: "scope",
          score: 100,
          scope: "network",
          tag: null,
          reason: "Matched permission scope."
        }
      ]
    }
  ]);
  assert.deepEqual(output.unresolvedRequests, []);
  assert.equal(output.approval.required, false);
  assert.equal(output.approval.status, null);
  assert.deepEqual(output.approval.reasons, []);
  assert.equal(output.approval.decision.status, "not_required");
  assertAllFalse(output.safety);
});

test("ardyn plan --explain includes approval reasons and decision details", async () => {
  const output = await runCli([
    "plan",
    "--manifest",
    planningManifestPath,
    "--task",
    approvalRequiredTaskPath,
    "--explain"
  ]);

  assert.equal(output.command, "plan");
  assert.equal(output.output, "explain");
  assert.equal(output.taskId, "task.phase3-1.approval");
  assert.deepEqual(output.requests, [
    {
      request: "secure.registry",
      matchType: "exact",
      scope: null,
      reason: "Matched exact capability id.",
      selectedCapabilityIds: ["secure.registry"],
      candidates: [
        {
          capabilityId: "secure.registry",
          matchType: "exact",
          score: 300,
          scope: null,
          tag: null,
          reason: "Matched exact capability id."
        }
      ]
    }
  ]);
  assert.deepEqual(output.unresolvedRequests, []);
  assert.equal(output.approval.required, true);
  assert.equal(output.approval.status, "approval-required");
  assert.deepEqual(output.approval.reasons, [
    {
      type: "task-constraint",
      field: "constraints.requireHumanApproval"
    },
    {
      type: "policy-scope",
      capabilityId: "secure.registry",
      scope: "registry",
      access: "read"
    }
  ]);
  assert.deepEqual(output.approval.decision.requestedCapabilityIds, ["secure.registry"]);
  assert.equal(output.approval.decision.status, "required");
  assert.equal(output.approval.decision.reason, "Approval is required before any future execution.");
  assert.equal(output.approval.decision.nonExecuting, true);
  assertAllFalse(output.safety);
});

test("ardyn plan output modes preserve no-match smoke shapes", async () => {
  const traceOutput = await runCli([
    "plan",
    "--manifest",
    planningManifestPath,
    "--task",
    minimalTaskPath,
    "--trace"
  ]);
  const summaryOutput = await runCli([
    "plan",
    "--manifest",
    planningManifestPath,
    "--task",
    minimalTaskPath,
    "--summary"
  ]);
  const explainOutput = await runCli([
    "plan",
    "--manifest",
    planningManifestPath,
    "--task",
    minimalTaskPath,
    "--explain"
  ]);

  assert.equal(traceOutput.output, "trace");
  assert.deepEqual(traceOutput.trace.selectedCapabilities, []);
  assert.deepEqual(traceOutput.trace.unresolvedRequests, ["runtime.describe"]);
  assert.deepEqual(traceOutput.trace.candidateCapabilities, [
    {
      request: "runtime.describe",
      candidates: []
    }
  ]);

  assert.equal(summaryOutput.output, "summary");
  assert.deepEqual(summaryOutput.selectedCapabilities, []);
  assert.deepEqual(summaryOutput.unresolvedRequests, ["runtime.describe"]);
  assert.equal(summaryOutput.approval.required, false);
  assert.equal(summaryOutput.approval.decision.status, "not_required");

  assert.equal(explainOutput.output, "explain");
  assert.deepEqual(explainOutput.requests, [
    {
      request: "runtime.describe",
      matchType: "no-match",
      scope: null,
      reason: "No exact capability id, capability tag, or supported permission scope matched.",
      selectedCapabilityIds: [],
      candidates: []
    }
  ]);
  assert.deepEqual(explainOutput.unresolvedRequests, ["runtime.describe"]);
  assert.equal(explainOutput.approval.required, false);
  assert.equal(explainOutput.approval.decision.status, "not_required");

  assertAllFalse(traceOutput.safety);
  assertAllFalse(traceOutput.trace.safety);
  assertAllFalse(summaryOutput.safety);
  assertAllFalse(explainOutput.safety);
});

test("ardyn plan rejects multiple output modes without JSON output", async () => {
  const failure = await runCliFailure([
    "plan",
    "--manifest",
    minimalManifestPath,
    "--task",
    minimalTaskPath,
    "--trace",
    "--summary"
  ]);

  assertCliFailure(failure, /Plan output flags are mutually exclusive: --trace, --summary\./);
});

test("ardyn plan without --manifest fails without JSON output", async () => {
  const failure = await runCliFailure(["plan", "--task", minimalTaskPath]);

  assertCliFailure(failure, /Missing required --manifest path\./);
});

test("ardyn plan without --task fails without JSON output", async () => {
  const failure = await runCliFailure(["plan", "--manifest", minimalManifestPath]);

  assertCliFailure(failure, /Missing required --task path\./);
});
