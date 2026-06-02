import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  compareApprovalReviewArtifacts,
  validateApprovalReviewArtifact
} from "../packages/core/src/index.mjs";

const traceReviewFixtures = Object.freeze({
  equalLeft: "tests/fixtures/trace-review/equal-left-approval-review-artifact.json",
  equalRight: "tests/fixtures/trace-review/equal-right-approval-review-artifact.json",
  selectedCapabilityChanged:
    "tests/fixtures/trace-review/selected-capability-changed-approval-review-artifact.json",
  approvalStatusChanged:
    "tests/fixtures/trace-review/approval-status-changed-approval-review-artifact.json",
  unresolvedRequestChanged:
    "tests/fixtures/trace-review/unresolved-request-changed-approval-review-artifact.json",
  invalidReviewArtifact: "tests/fixtures/trace-review/invalid-review-artifact.json"
});

async function readJsonFixture(fixturePath) {
  return JSON.parse(await readFile(fixturePath, "utf8"));
}

async function readTraceReviewFixture(name) {
  return readJsonFixture(traceReviewFixtures[name]);
}

function assertValidReviewArtifact(artifact) {
  assert.deepEqual(validateApprovalReviewArtifact(artifact), {
    valid: true,
    errors: []
  });
}

function assertComparisonSafetyFlags(comparison) {
  assert.equal(comparison.nonExecuting, true);
  for (const [key, value] of Object.entries(comparison.safety)) {
    assert.equal(value, false, `${key} should remain false`);
  }
}

test("phase 3.5 trace review fixtures compare equal for an equal artifact pair", async () => {
  const left = await readTraceReviewFixture("equalLeft");
  const right = await readTraceReviewFixture("equalRight");

  assertValidReviewArtifact(left);
  assertValidReviewArtifact(right);

  const comparison = compareApprovalReviewArtifacts(left, right);

  assert.equal(comparison.equal, true);
  assert.equal(comparison.differenceCount, 0);
  assert.deepEqual(comparison.differences, []);
  assertComparisonSafetyFlags(comparison);
});

test("phase 3.5 trace review fixtures detect selected capability changes", async () => {
  const left = await readTraceReviewFixture("equalLeft");
  const right = await readTraceReviewFixture("selectedCapabilityChanged");

  assertValidReviewArtifact(left);
  assertValidReviewArtifact(right);

  const comparison = compareApprovalReviewArtifacts(left, right);

  assert.equal(comparison.equal, false);
  assert.equal(comparison.differenceCount, 1);
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
  assertComparisonSafetyFlags(comparison);
});

test("phase 3.5 trace review fixtures detect approval status changes", async () => {
  const left = await readTraceReviewFixture("equalLeft");
  const right = await readTraceReviewFixture("approvalStatusChanged");

  assertValidReviewArtifact(left);
  assertValidReviewArtifact(right);

  const comparison = compareApprovalReviewArtifacts(left, right);

  assert.equal(comparison.equal, false);
  assert.equal(comparison.differenceCount, 1);
  assert.deepEqual(comparison.differences, [
    {
      type: "approval-status-change",
      path: "approvalDecision.status",
      left: "not_required",
      right: "required"
    }
  ]);
  assertComparisonSafetyFlags(comparison);
});

test("phase 3.5 trace review fixtures detect unresolved request changes", async () => {
  const left = await readTraceReviewFixture("equalLeft");
  const right = await readTraceReviewFixture("unresolvedRequestChanged");

  assertValidReviewArtifact(left);
  assertValidReviewArtifact(right);

  const comparison = compareApprovalReviewArtifacts(left, right);

  assert.equal(comparison.equal, false);
  assert.equal(comparison.differenceCount, 1);
  assert.deepEqual(comparison.differences, [
    {
      type: "unresolved-requests-change",
      path: "unresolvedRequests",
      left: [],
      right: ["missing.capability"],
      added: ["missing.capability"],
      removed: []
    }
  ]);
  assertComparisonSafetyFlags(comparison);
});

test("phase 3.5 trace review fixtures reject invalid input before diffing", async () => {
  const left = await readTraceReviewFixture("equalLeft");
  const invalid = await readTraceReviewFixture("invalidReviewArtifact");
  const validation = validateApprovalReviewArtifact(invalid);

  assertValidReviewArtifact(left);
  assert.equal(validation.valid, false);
  assert.match(validation.errors.join("\n"), /safety\.apiCallsEnabled must be false/);
  assert.throws(
    () => compareApprovalReviewArtifacts(left, invalid),
    /right approval review artifact is invalid: safety\.apiCallsEnabled must be false/
  );
});
