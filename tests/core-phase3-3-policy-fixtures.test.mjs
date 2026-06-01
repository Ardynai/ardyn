import assert from "node:assert/strict";
import test from "node:test";

import {
  APPROVAL_DENIED,
  APPROVAL_REQUIRED,
  createTaskPlan,
  loadManifest,
  loadTask
} from "../packages/core/src/index.mjs";

const manifestPath = "tests/fixtures/planning-manifest.json";
const taskFixtures = Object.freeze({
  exactMatch: "tests/fixtures/tasks/exact-match.json",
  tagMatch: "tests/fixtures/tasks/tag-match.json",
  scopeMatch: "tests/fixtures/tasks/scope-match.json",
  noMatch: "tests/fixtures/tasks/no-match.json",
  multiCapabilityRanking: "tests/fixtures/tasks/multi-capability-ranking.json",
  approvalRequired: "tests/fixtures/tasks/approval-required.json",
  partialUnresolved: "tests/fixtures/tasks/partial-unresolved.json"
});

function ids(capabilities) {
  return capabilities.map((capability) => capability.id);
}

function candidateSummary(resolution) {
  return resolution.candidates.map((candidate) => ({
    capabilityId: candidate.capabilityId,
    matchType: candidate.matchType,
    score: candidate.score,
    scope: candidate.scope,
    tag: candidate.tag
  }));
}

function assertAllFalse(flags) {
  for (const [key, value] of Object.entries(flags)) {
    assert.equal(value, false, `${key} should remain false`);
  }
}

function assertNonExecutingPlan(plan) {
  assertAllFalse(plan.safety);
  assertAllFalse(plan.plannerTrace.safety);
  assert.equal(plan.approvalDecision.nonExecuting, true);
}

async function createFixturePlan(fixtureName, options = {}) {
  const fixturePath = taskFixtures[fixtureName];
  const manifest = await loadManifest(manifestPath);
  const task = await loadTask(fixturePath);
  const plan = createTaskPlan(manifest, task, {
    manifestPath,
    taskPath: fixturePath,
    ...options
  });

  assertNonExecutingPlan(plan);
  return plan;
}

async function createStableFixturePlan(fixtureName, options = {}) {
  const first = await createFixturePlan(fixtureName, options);
  const second = await createFixturePlan(fixtureName, options);

  assert.deepEqual(second.resolutions, first.resolutions);
  assert.deepEqual(ids(second.selectedCapabilities), ids(first.selectedCapabilities));
  assert.deepEqual(second.unresolvedRequests, first.unresolvedRequests);
  assert.deepEqual(second.approvalDecision, first.approvalDecision);

  return first;
}

test("exact-match fixture deterministically ranks exact above tag and scope candidates", async () => {
  const plan = await createStableFixturePlan("exactMatch");
  const [resolution] = plan.resolutions;

  assert.deepEqual(ids(plan.selectedCapabilities), ["network"]);
  assert.deepEqual(plan.unresolvedRequests, []);
  assert.equal(resolution.request, "network");
  assert.equal(resolution.matchType, "exact");
  assert.deepEqual(resolution.capabilityIds, ["network"]);
  assert.deepEqual(candidateSummary(resolution), [
    {
      capabilityId: "network",
      matchType: "exact",
      score: 300,
      scope: null,
      tag: null
    },
    {
      capabilityId: "beta.scope",
      matchType: "tag",
      score: 200,
      scope: null,
      tag: "network"
    },
    {
      capabilityId: "alpha.scope",
      matchType: "scope",
      score: 100,
      scope: "network",
      tag: null
    },
    {
      capabilityId: "beta.scope",
      matchType: "scope",
      score: 100,
      scope: "network",
      tag: null
    }
  ]);
  assert.equal(plan.approval.required, false);
  assert.equal(plan.approvalDecision.status, "not_required");
});

test("tag-match fixture deterministically selects tied tag capabilities before scope candidates", async () => {
  const plan = await createStableFixturePlan("tagMatch");
  const [resolution] = plan.resolutions;

  assert.deepEqual(ids(plan.selectedCapabilities), ["alpha.tag", "beta.tag"]);
  assert.equal(resolution.request, "filesystem");
  assert.equal(resolution.matchType, "tag");
  assert.deepEqual(resolution.capabilityIds, ["alpha.tag", "beta.tag"]);
  assert.deepEqual(candidateSummary(resolution), [
    {
      capabilityId: "alpha.tag",
      matchType: "tag",
      score: 200,
      scope: null,
      tag: "filesystem"
    },
    {
      capabilityId: "beta.tag",
      matchType: "tag",
      score: 200,
      scope: null,
      tag: "filesystem"
    },
    {
      capabilityId: "alpha.tag",
      matchType: "scope",
      score: 100,
      scope: "filesystem",
      tag: null
    },
    {
      capabilityId: "gamma.scope",
      matchType: "scope",
      score: 100,
      scope: "filesystem",
      tag: null
    }
  ]);
  assert.equal(plan.approval.status, APPROVAL_REQUIRED);
});

test("scope-match fixture selects permission-scope matches when no exact id or tag matches", async () => {
  const plan = await createStableFixturePlan("scopeMatch");
  const [resolution] = plan.resolutions;

  assert.deepEqual(ids(plan.selectedCapabilities), ["network"]);
  assert.deepEqual(plan.unresolvedRequests, []);
  assert.equal(resolution.request, "memory");
  assert.equal(resolution.matchType, "scope");
  assert.equal(resolution.scope, "memory");
  assert.deepEqual(resolution.capabilityIds, ["network"]);
  assert.deepEqual(candidateSummary(resolution), [
    {
      capabilityId: "network",
      matchType: "scope",
      score: 100,
      scope: "memory",
      tag: null
    }
  ]);
  assert.equal(plan.approval.required, false);
});

test("no-match fixture preserves deterministic empty selections and unresolved requests", async () => {
  const plan = await createStableFixturePlan("noMatch");

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
  assert.equal(plan.approval.required, false);
});

test("multi-capability ranking fixture preserves deterministic tied selection order", async () => {
  const plan = await createStableFixturePlan("multiCapabilityRanking");
  const [resolution] = plan.resolutions;

  assert.deepEqual(ids(plan.selectedCapabilities), ["alpha.tag", "beta.tag"]);
  assert.equal(resolution.request, "planner.tie");
  assert.equal(resolution.matchType, "tag");
  assert.deepEqual(resolution.capabilityIds, ["alpha.tag", "beta.tag"]);
  assert.deepEqual(candidateSummary(resolution), [
    {
      capabilityId: "alpha.tag",
      matchType: "tag",
      score: 200,
      scope: null,
      tag: "planner.tie"
    },
    {
      capabilityId: "beta.tag",
      matchType: "tag",
      score: 200,
      scope: null,
      tag: "planner.tie"
    }
  ]);
  assert.equal(plan.approval.status, APPROVAL_REQUIRED);
  assert.deepEqual(plan.approvalDecision.requestedCapabilityIds, ["alpha.tag", "beta.tag"]);
});

test("approval-required fixture records required approval without enabling execution", async () => {
  const plan = await createStableFixturePlan("approvalRequired");

  assert.deepEqual(ids(plan.selectedCapabilities), ["secure.registry"]);
  assert.equal(plan.approval.required, true);
  assert.equal(plan.approval.status, APPROVAL_REQUIRED);
  assert.deepEqual(plan.approval.reasons, [
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
  assert.equal(plan.approvalDecision.status, "required");
  assert.deepEqual(plan.approvalDecision.requestedCapabilityIds, ["secure.registry"]);
});

test("approval-denied fixture path uses simulated denial input without enabling execution", async () => {
  const plan = await createStableFixturePlan("approvalRequired", {
    approvalDecision: {
      status: "denied",
      reason: "fixture denial"
    }
  });

  assert.deepEqual(ids(plan.selectedCapabilities), ["secure.registry"]);
  assert.equal(plan.approval.required, true);
  assert.equal(plan.approval.status, APPROVAL_DENIED);
  assert.equal(plan.approvalDecision.status, "denied");
  assert.equal(plan.approvalDecision.reason, "fixture denial");
  assert.deepEqual(plan.approvalDecision.requestedCapabilityIds, ["secure.registry"]);
});

test("partial-unresolved fixture resolves available requests while preserving unresolved entries", async () => {
  const plan = await createStableFixturePlan("partialUnresolved");

  assert.deepEqual(ids(plan.selectedCapabilities), ["alpha.scope", "network"]);
  assert.deepEqual(plan.unresolvedRequests, ["missing.capability"]);
  assert.deepEqual(plan.plannerTrace.unresolvedRequests, ["missing.capability"]);
  assert.deepEqual(
    plan.resolutions.map((resolution) => ({
      request: resolution.request,
      matchType: resolution.matchType,
      capabilityIds: resolution.capabilityIds
    })),
    [
      {
        request: "memory",
        matchType: "scope",
        capabilityIds: ["network"]
      },
      {
        request: "missing.capability",
        matchType: "no-match",
        capabilityIds: []
      },
      {
        request: "alpha.scope",
        matchType: "exact",
        capabilityIds: ["alpha.scope"]
      }
    ]
  );
  assert.equal(plan.approval.required, false);
  assert.equal(plan.approvalDecision.status, "not_required");
});
