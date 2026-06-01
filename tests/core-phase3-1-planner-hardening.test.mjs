import assert from "node:assert/strict";
import test from "node:test";

import {
  APPROVAL_DENIED,
  APPROVAL_GRANTED,
  APPROVAL_REQUIRED,
  createTaskPlan,
  loadManifest,
  loadTask
} from "../packages/core/src/index.mjs";

const manifestPath = "tests/fixtures/planning-manifest.json";

function ids(capabilities) {
  return capabilities.map((capability) => capability.id);
}

function candidateSummary(resolution) {
  return resolution.candidates.map((candidate) => ({
    capabilityId: candidate.capabilityId,
    matchType: candidate.matchType,
    score: candidate.score
  }));
}

function assertAllFalse(flags) {
  for (const [key, value] of Object.entries(flags)) {
    assert.equal(value, false, `${key} should remain false`);
  }
}

test("deterministic ranking returns all candidates and exact beats tag and scope", async () => {
  const manifest = await loadManifest(manifestPath);
  const task = await loadTask("tests/fixtures/tasks/exact-match.json");
  const plan = createTaskPlan(manifest, task, { manifestPath });
  const [resolution] = plan.resolutions;

  assert.deepEqual(ids(plan.selectedCapabilities), ["network"]);
  assert.equal(resolution.matchType, "exact");
  assert.deepEqual(resolution.capabilityIds, ["network"]);
  assert.deepEqual(candidateSummary(resolution), [
    { capabilityId: "network", matchType: "exact", score: 300 },
    { capabilityId: "beta.scope", matchType: "tag", score: 200 },
    { capabilityId: "alpha.scope", matchType: "scope", score: 100 },
    { capabilityId: "beta.scope", matchType: "scope", score: 100 }
  ]);
});

test("tag matches beat scope matches and stable ties are sorted by capability id", async () => {
  const manifest = await loadManifest(manifestPath);
  const task = await loadTask("tests/fixtures/tasks/tag-match.json");
  const plan = createTaskPlan(manifest, task, { manifestPath });
  const [resolution] = plan.resolutions;

  assert.equal(resolution.matchType, "tag");
  assert.deepEqual(resolution.capabilityIds, ["alpha.tag", "beta.tag"]);
  assert.deepEqual(ids(plan.selectedCapabilities), ["alpha.tag", "beta.tag"]);
  assert.deepEqual(candidateSummary(resolution), [
    { capabilityId: "alpha.tag", matchType: "tag", score: 200 },
    { capabilityId: "beta.tag", matchType: "tag", score: 200 },
    { capabilityId: "alpha.tag", matchType: "scope", score: 100 },
    { capabilityId: "gamma.scope", matchType: "scope", score: 100 }
  ]);
});

test("tag tie ordering is deterministic across repeated plans", async () => {
  const manifest = await loadManifest(manifestPath);
  const task = {
    id: "task.phase3-1.tie",
    objective: "Plan deterministic tag tie ordering.",
    mode: "plan",
    requestedCapabilities: ["planner.tie"]
  };

  const first = createTaskPlan(manifest, task);
  const second = createTaskPlan(manifest, task);

  assert.deepEqual(first.resolutions[0].capabilityIds, ["alpha.tag", "beta.tag"]);
  assert.deepEqual(second.resolutions[0].capabilityIds, ["alpha.tag", "beta.tag"]);
  assert.deepEqual(first.resolutions[0].candidates, second.resolutions[0].candidates);
});

test("no-match planning is deterministic with empty candidates and selected ids", async () => {
  const manifest = await loadManifest(manifestPath);
  const task = await loadTask("tests/fixtures/tasks/no-match.json");
  const plan = createTaskPlan(manifest, task);

  assert.deepEqual(plan.selectedCapabilities, []);
  assert.deepEqual(plan.unresolvedRequests, ["missing.capability"]);
  assert.deepEqual(plan.resolutions, [
    {
      request: "missing.capability",
      matchType: "no-match",
      scope: null,
      capabilityIds: [],
      selectedCapabilityIds: [],
      candidates: [],
      reason: "No exact capability id, capability tag, or supported permission scope matched."
    }
  ]);
});

test("approval decision records are stable and remain non-executing", async () => {
  const manifest = await loadManifest(manifestPath);
  const task = await loadTask("tests/fixtures/tasks/approval-required.json");
  const first = createTaskPlan(manifest, task);
  const second = createTaskPlan(manifest, task);

  assert.equal(first.approval.required, true);
  assert.equal(first.approval.status, APPROVAL_REQUIRED);
  assert.deepEqual(first.approvalDecision, second.approvalDecision);
  assert.match(first.approvalDecision.id, /^approval\.[a-f0-9]{16}$/);
  assert.equal(first.approvalDecision.taskId, "task.phase3-1.approval");
  assert.deepEqual(first.approvalDecision.requestedCapabilityIds, ["secure.registry"]);
  assert.equal(first.approvalDecision.status, "required");
  assert.equal(first.approvalDecision.createdAt, "1970-01-01T00:00:00.000Z");
  assert.equal(first.approvalDecision.nonExecuting, true);
  assertAllFalse(first.safety);
});

test("approval decision requested capability ids come from selected tag and scope capabilities", async () => {
  const manifest = await loadManifest(manifestPath);
  const tagPlan = createTaskPlan(manifest, {
    id: "task.phase3-1.tag-approval",
    objective: "Plan tag-selected filesystem capabilities with approval.",
    mode: "plan",
    requestedCapabilities: ["filesystem"],
    constraints: {
      requireHumanApproval: true
    }
  });
  const scopePlan = createTaskPlan(manifest, {
    id: "task.phase3-1.scope-approval",
    objective: "Plan scope-selected memory capability with approval.",
    mode: "plan",
    requestedCapabilities: ["memory"],
    constraints: {
      requireHumanApproval: true
    }
  });

  assert.deepEqual(tagPlan.approvalDecision.requestedCapabilityIds, ["alpha.tag", "beta.tag"]);
  assert.notDeepEqual(tagPlan.approvalDecision.requestedCapabilityIds, ["filesystem"]);
  assert.deepEqual(scopePlan.approvalDecision.requestedCapabilityIds, ["network"]);
  assert.notDeepEqual(scopePlan.approvalDecision.requestedCapabilityIds, ["memory"]);
});

test("approval decision ids change when selected capabilities or approval reasons change", async () => {
  const manifest = await loadManifest(manifestPath);
  const selectionTask = {
    id: "task.phase3-1.id-preimage-selection",
    objective: "Plan deterministic approval ids from selected capabilities.",
    mode: "plan",
    requestedCapabilities: ["filesystem"],
    constraints: {
      requireHumanApproval: true
    }
  };
  const changedSelectionManifest = {
    ...manifest,
    capabilities: manifest.capabilities.map((capability) => {
      if (capability.id !== "alpha.tag" && capability.id !== "beta.tag") {
        return capability;
      }

      return {
        ...capability,
        tags: capability.tags.filter((tag) => tag !== "filesystem")
      };
    })
  };
  const reasonsTask = {
    id: "task.phase3-1.id-preimage-reasons",
    objective: "Plan deterministic approval ids from approval reasons.",
    mode: "plan",
    requestedCapabilities: ["secure.registry"],
    constraints: {
      requireHumanApproval: false
    }
  };
  const changedReasonsTask = {
    ...reasonsTask,
    constraints: {
      requireHumanApproval: true
    }
  };

  const baseSelectionPlan = createTaskPlan(manifest, selectionTask);
  const changedSelectionPlan = createTaskPlan(changedSelectionManifest, selectionTask);
  const baseReasonsPlan = createTaskPlan(manifest, reasonsTask);
  const changedReasonsPlan = createTaskPlan(manifest, changedReasonsTask);

  assert.deepEqual(baseSelectionPlan.approvalDecision.requestedCapabilityIds, ["alpha.tag", "beta.tag"]);
  assert.deepEqual(changedSelectionPlan.approvalDecision.requestedCapabilityIds, [
    "alpha.tag",
    "gamma.scope"
  ]);
  assert.notEqual(baseSelectionPlan.approvalDecision.id, changedSelectionPlan.approvalDecision.id);
  assert.notEqual(baseReasonsPlan.approvalDecision.id, changedReasonsPlan.approvalDecision.id);
});

test("simulated denied and granted approval decisions never enable execution", async () => {
  const manifest = await loadManifest(manifestPath);
  const task = await loadTask("tests/fixtures/tasks/approval-required.json");
  const denied = createTaskPlan(manifest, task, {
    approvalDecision: {
      status: "denied",
      reason: "fixture denial"
    }
  });
  const granted = createTaskPlan(manifest, task, {
    approvalDecision: {
      status: "granted",
      reason: "fixture grant"
    }
  });

  assert.equal(denied.approval.status, APPROVAL_DENIED);
  assert.equal(denied.approvalDecision.status, "denied");
  assert.equal(denied.approvalDecision.reason, "fixture denial");
  assertAllFalse(denied.safety);
  assert.equal(granted.approval.status, APPROVAL_GRANTED);
  assert.equal(granted.approvalDecision.status, "granted");
  assertAllFalse(granted.safety);
});

test("simulated not_required approval decision is rejected when approval is required", async () => {
  const manifest = await loadManifest(manifestPath);
  const task = await loadTask("tests/fixtures/tasks/approval-required.json");

  assert.throws(
    () =>
      createTaskPlan(manifest, task, {
        approvalDecision: {
          status: "not_required",
          reason: "fixture not required"
        }
      }),
    /Cannot apply approval decision status not_required when approval is required/
  );
});

test("simulated denied, granted, or required approval decisions are rejected when approval is not required", async () => {
  const manifest = await loadManifest(manifestPath);
  const task = await loadTask("tests/fixtures/tasks/exact-match.json");

  assert.throws(
    () =>
      createTaskPlan(manifest, task, {
        approvalDecision: {
          status: "denied",
          reason: "fixture denial"
        }
      }),
    /Cannot apply approval decision status denied when approval is not required/
  );
  assert.throws(
    () =>
      createTaskPlan(manifest, task, {
        approvalDecision: {
          status: "granted",
          reason: "fixture grant"
        }
      }),
    /Cannot apply approval decision status granted when approval is not required/
  );
  assert.throws(
    () =>
      createTaskPlan(manifest, task, {
        approvalDecision: {
          status: "required",
          reason: "fixture required"
        }
      }),
    /Cannot apply approval decision status required when approval is not required/
  );
});

test("planner trace includes intake, manifest, candidates, approval decision, and safety flags", async () => {
  const manifest = await loadManifest(manifestPath);
  const task = await loadTask("tests/fixtures/tasks/tag-match.json");
  const plan = createTaskPlan(manifest, task, {
    manifestPath,
    taskPath: "tests/fixtures/tasks/tag-match.json",
    createdAt: "2026-06-01T00:00:00.000Z"
  });

  assert.deepEqual(plan.plannerTrace.taskIntake, {
    valid: true,
    errors: [],
    taskId: "task.phase3-1.tag",
    requestedCapabilities: ["filesystem"]
  });
  assert.deepEqual(plan.plannerTrace.manifest, {
    id: "planner-hardening",
    version: "0.1.0",
    schemaVersion: "0.1.0"
  });
  assert.deepEqual(plan.plannerTrace.candidateCapabilities[0].request, "filesystem");
  assert.deepEqual(
    plan.plannerTrace.selectedCapabilities,
    ["alpha.tag", "beta.tag"]
  );
  assert.deepEqual(plan.plannerTrace.unresolvedRequests, []);
  assert.equal(plan.plannerTrace.approvalDecision.status, "required");
  assert.equal(plan.plannerTrace.safety.executionEnabled, false);
  assertAllFalse(plan.plannerTrace.safety);
});
