import assert from "node:assert/strict";
import test from "node:test";

import {
  APPROVAL_REQUIRED,
  createTaskPlan,
  loadManifest,
  loadTask,
  validateTask
} from "../packages/core/src/index.mjs";

function assertAllFalse(flags) {
  for (const [key, value] of Object.entries(flags)) {
    assert.equal(value, false, `${key} should remain false`);
  }
}

test("loads and validates the minimal task from disk", async () => {
  const task = await loadTask("examples/minimal-task/task.json");
  const result = validateTask(task);

  assert.equal(result.valid, true, JSON.stringify(result.errors, null, 2));
  assert.equal(task.id, "task.minimal.describe");
  assert.deepEqual(task.requestedCapabilities, ["runtime.describe"]);
});

test("rejects invalid tasks with schema errors", async () => {
  const result = validateTask({
    id: "task.invalid.no-objective",
    mode: "plan",
    requestedCapabilities: ["runtime.describe"]
  });

  assert.equal(result.valid, false);
  assert.match(JSON.stringify(result.errors), /objective/);
  await assert.rejects(
    () => loadTask("tests/fixtures/tasks/invalid-missing-objective.json"),
    /Invalid ARDYN task/
  );
});

test("plans exact capability id matches before any scope matching", async () => {
  const manifest = await loadManifest("examples/minimal-manifest/ardyn.manifest.json");
  const task = await loadTask("examples/minimal-task/task.json");
  const plan = createTaskPlan(manifest, task, {
    manifestPath: "examples/minimal-manifest/ardyn.manifest.json",
    taskPath: "examples/minimal-task/task.json"
  });

  assert.equal(plan.phase, "phase-3-task-planning");
  assert.deepEqual(
    plan.selectedCapabilities.map((capability) => capability.id),
    ["runtime.describe"]
  );
  assert.deepEqual(plan.resolutions, [
    {
      request: "runtime.describe",
      matchType: "exact",
      scope: null,
      capabilityIds: ["runtime.describe"],
      reason: "Matched exact capability id."
    }
  ]);
  assert.equal(plan.matchingPolicy.tags, false);
  assert.equal(plan.approval.required, false);
  assert.equal(plan.approval.status, null);
  assertAllFalse(plan.safety);
});

test("plans permission scope matches when no exact capability id matches", async () => {
  const manifest = await loadManifest("examples/minimal-manifest/ardyn.manifest.json");
  const task = {
    id: "task.scope.registry",
    objective: "Plan all registry-readable metadata capabilities.",
    mode: "plan",
    requestedCapabilities: ["registry"]
  };

  const plan = createTaskPlan(manifest, task);

  assert.deepEqual(
    plan.selectedCapabilities.map((capability) => capability.id),
    ["runtime.describe"]
  );
  assert.deepEqual(plan.resolutions, [
    {
      request: "registry",
      matchType: "scope",
      scope: "registry",
      capabilityIds: ["runtime.describe"],
      reason: "Matched permission scope; tag matching is unsupported by the current capability schema."
    }
  ]);
});

test("plans deterministic no-match results for unavailable requests", async () => {
  const manifest = await loadManifest("examples/minimal-manifest/ardyn.manifest.json");
  const task = {
    id: "task.missing.capability",
    objective: "Plan a missing capability without throwing.",
    mode: "plan",
    requestedCapabilities: ["missing.capability"]
  };

  const plan = createTaskPlan(manifest, task);

  assert.deepEqual(plan.selectedCapabilities, []);
  assert.deepEqual(plan.unresolvedRequests, ["missing.capability"]);
  assert.deepEqual(plan.resolutions, [
    {
      request: "missing.capability",
      matchType: "no-match",
      scope: null,
      capabilityIds: [],
      reason: "No exact capability id or supported permission scope matched."
    }
  ]);
});

test("approval is required for task constraints and policy-listed permission scopes", async () => {
  const manifest = await loadManifest("examples/minimal-manifest/ardyn.manifest.json");
  const plan = createTaskPlan(
    {
      ...manifest,
      policies: {
        ...manifest.policies,
        requiresApprovalFor: ["registry"]
      }
    },
    {
      id: "task.approval.registry",
      objective: "Plan registry metadata access behind an approval gate.",
      mode: "plan",
      requestedCapabilities: ["runtime.describe"],
      constraints: {
        requireHumanApproval: true
      }
    }
  );

  assert.equal(plan.approval.required, true);
  assert.equal(plan.approval.status, APPROVAL_REQUIRED);
  assert.deepEqual(plan.approval.reasons, [
    {
      type: "task-constraint",
      field: "constraints.requireHumanApproval"
    },
    {
      type: "policy-scope",
      capabilityId: "runtime.describe",
      scope: "registry",
      access: "read"
    }
  ]);
});

test("duplicate requested capabilities are reported deterministically without duplicate selections", async () => {
  const manifest = await loadManifest("examples/minimal-manifest/ardyn.manifest.json");
  const plan = createTaskPlan(manifest, {
    id: "task.duplicate.requests",
    objective: "Plan duplicate requests once.",
    mode: "plan",
    requestedCapabilities: ["runtime.describe", "runtime.describe", "registry", "registry"]
  });

  assert.deepEqual(plan.duplicateRequestedCapabilities, ["registry", "runtime.describe"]);
  assert.deepEqual(
    plan.selectedCapabilities.map((capability) => capability.id),
    ["runtime.describe"]
  );
});
