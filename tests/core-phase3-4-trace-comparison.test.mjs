import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  compareApprovalReviewArtifacts,
  createApprovalReviewArtifact,
  createTaskPlan,
  loadManifest,
  loadTask,
  validateApprovalReviewArtifact
} from "../packages/core/src/index.mjs";

const comparisonFixtures = Object.freeze({
  left: "tests/fixtures/trace-comparison/left-approval-review-artifact.json",
  right: "tests/fixtures/trace-comparison/right-approval-review-artifact.json"
});

async function readJsonFixture(fixturePath) {
  return JSON.parse(await readFile(fixturePath, "utf8"));
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

async function readComparisonFixtures() {
  return {
    left: await readJsonFixture(comparisonFixtures.left),
    right: await readJsonFixture(comparisonFixtures.right)
  };
}

test("approval review artifact comparison has no differences for identical artifacts", async () => {
  const { left } = await readComparisonFixtures();
  const comparison = compareApprovalReviewArtifacts(left, clone(left));

  assert.equal(comparison.equal, true);
  assert.equal(comparison.differenceCount, 0);
  assert.deepEqual(comparison.differences, []);
  assert.equal(comparison.nonExecuting, true);
  for (const [key, value] of Object.entries(comparison.safety)) {
    assert.equal(value, false, `${key} should remain false`);
  }
});

test("approval review artifact comparison detects selected capability changes", async () => {
  const { left } = await readComparisonFixtures();
  const changed = clone(left);
  changed.selectedCapabilities = ["alpha.scope", "network"];

  const comparison = compareApprovalReviewArtifacts(left, changed);

  assert.equal(comparison.equal, false);
  assert.deepEqual(comparison.differences, [
    {
      type: "selected-capabilities-change",
      path: "selectedCapabilities",
      left: ["network"],
      right: ["alpha.scope", "network"],
      added: ["alpha.scope"],
      removed: []
    }
  ]);
});

test("approval review artifact comparison detects approval status changes", async () => {
  const { left } = await readComparisonFixtures();
  const changed = clone(left);
  changed.approvalDecision.status = "required";

  const comparison = compareApprovalReviewArtifacts(left, changed);

  assert.equal(comparison.equal, false);
  assert.deepEqual(comparison.differences, [
    {
      type: "approval-status-change",
      path: "approvalDecision.status",
      left: "not_required",
      right: "required"
    }
  ]);
});

test("approval review artifact comparison orders task, manifest, request, resolution, approval, and ranking diffs deterministically", async () => {
  const { left, right } = await readComparisonFixtures();
  const first = compareApprovalReviewArtifacts(left, right);
  const second = compareApprovalReviewArtifacts(clone(left), clone(right));

  assert.equal(first.equal, false);
  assert.deepEqual(first, second);
  assert.deepEqual(
    first.differences.map((difference) => [difference.type, difference.path]),
    [
      ["task-mismatch", "taskId"],
      ["manifest-mismatch", "manifest.version"],
      ["requested-capabilities-change", "requestedCapabilityIds"],
      ["selected-capabilities-change", "selectedCapabilities"],
      ["unresolved-requests-change", "unresolvedRequests"],
      ["approval-requested-capabilities-change", "approvalDecision.requestedCapabilityIds"],
      ["approval-status-change", "approvalDecision.status"],
      ["candidate-rankings-change", "candidateRankings"]
    ]
  );
});

test("approval review artifact comparison accepts planner traces through the stable review artifact shape", async () => {
  const manifest = await loadManifest("tests/fixtures/planning-manifest.json");
  const task = await loadTask("tests/fixtures/tasks/exact-match.json");
  const plan = createTaskPlan(manifest, task, {
    manifestPath: "tests/fixtures/planning-manifest.json",
    taskPath: "tests/fixtures/tasks/exact-match.json"
  });
  const reviewArtifact = createApprovalReviewArtifact(plan);
  const comparison = compareApprovalReviewArtifacts(plan.plannerTrace, reviewArtifact);

  assert.equal(comparison.equal, true);
  assert.deepEqual(comparison.differences, []);
});

test("approval review artifact comparison rejects unsafe artifacts before diffing", async () => {
  const { left } = await readComparisonFixtures();
  const unsafe = clone(left);
  unsafe.safety.processesSpawned = true;

  const validation = validateApprovalReviewArtifact(unsafe);
  assert.equal(validation.valid, false);
  assert.match(validation.errors.join("\n"), /safety.processesSpawned must be false/);
  assert.throws(
    () => compareApprovalReviewArtifacts(unsafe, left),
    /left approval review artifact is invalid: safety\.processesSpawned must be false/
  );
});
