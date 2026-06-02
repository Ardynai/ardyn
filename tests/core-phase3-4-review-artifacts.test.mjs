import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  createApprovalReviewArtifact,
  createTaskPlan,
  loadManifest,
  loadTask,
  validateApprovalReviewArtifact
} from "../packages/core/src/index.mjs";

const manifestPath = "tests/fixtures/planning-manifest.json";
const fixtureGeneratedAt = "2026-06-02T00:00:00.000Z";
const defaultGeneratedAt = "1970-01-01T00:00:00.000Z";
const taskFixtures = Object.freeze({
  exactMatch: "tests/fixtures/tasks/exact-match.json",
  approvalRequired: "tests/fixtures/tasks/approval-required.json",
  noMatch: "tests/fixtures/tasks/no-match.json"
});
const artifactFixtures = Object.freeze({
  exactMatch: "tests/fixtures/review-artifacts/exact-match.json",
  approvalRequired: "tests/fixtures/review-artifacts/approval-required.json",
  noMatch: "tests/fixtures/review-artifacts/no-match.json",
  invalidExecutionEnabled: "tests/fixtures/review-artifacts/invalid-execution-enabled.json"
});

async function createFixturePlan(fixtureName) {
  const manifest = await loadManifest(manifestPath);
  const taskPath = taskFixtures[fixtureName];
  const task = await loadTask(taskPath);

  return createTaskPlan(manifest, task, {
    manifestPath,
    taskPath
  });
}

async function readJsonFixture(fixturePath) {
  return JSON.parse(await readFile(fixturePath, "utf8"));
}

function normalizeFixtureLineEndings(text) {
  return text.replaceAll("\r\n", "\n");
}

async function assertArtifactMatchesFixture(fixtureName) {
  const plan = await createFixturePlan(fixtureName);
  const artifact = createApprovalReviewArtifact(plan, {
    generatedAt: fixtureGeneratedAt
  });
  const fixtureText = await readFile(artifactFixtures[fixtureName], "utf8");
  const expected = JSON.parse(fixtureText);

  assert.equal(`${JSON.stringify(artifact, null, 2)}\n`, normalizeFixtureLineEndings(fixtureText));
  assert.deepEqual(artifact, expected);
  assert.deepEqual(artifact.approvalDecision, plan.approvalDecision);
  assert.equal(artifact.nonExecuting, true);
  for (const [key, value] of Object.entries(artifact.safety)) {
    assert.equal(value, false, `${key} should remain false`);
  }
  assert.deepEqual(validateApprovalReviewArtifact(artifact), {
    valid: true,
    errors: []
  });

  return { artifact, plan };
}

test("exact-match review artifact fixture pins stable shape and candidate ranking order", async () => {
  const { artifact } = await assertArtifactMatchesFixture("exactMatch");

  assert.deepEqual(artifact.requestedCapabilityIds, ["network"]);
  assert.deepEqual(artifact.selectedCapabilities, ["network"]);
  assert.deepEqual(
    artifact.candidateRankings[0].candidates.map((candidate) => [
      candidate.rank,
      candidate.capabilityId,
      candidate.matchType,
      candidate.score
    ]),
    [
      [1, "network", "exact", 300],
      [2, "beta.scope", "tag", 200],
      [3, "alpha.scope", "scope", 100],
      [4, "beta.scope", "scope", 100]
    ]
  );
});

test("approval-required review artifact preserves planner approval decision", async () => {
  const { artifact, plan } = await assertArtifactMatchesFixture("approvalRequired");

  assert.equal(artifact.approvalDecision.status, "required");
  assert.deepEqual(artifact.approvalDecision, plan.approvalDecision);
  assert.deepEqual(artifact.selectedCapabilities, ["secure.registry"]);
  assert.deepEqual(artifact.unresolvedRequests, []);
});

test("no-match review artifact preserves unresolved requests and empty candidate rankings", async () => {
  const { artifact } = await assertArtifactMatchesFixture("noMatch");

  assert.deepEqual(artifact.requestedCapabilityIds, ["missing.capability"]);
  assert.deepEqual(artifact.selectedCapabilities, []);
  assert.deepEqual(artifact.unresolvedRequests, ["missing.capability"]);
  assert.deepEqual(artifact.candidateRankings, [
    {
      request: "missing.capability",
      candidates: []
    }
  ]);
});

test("review artifact can be derived from a planner trace with deterministic default generatedAt", async () => {
  const plan = await createFixturePlan("exactMatch");
  const fromPlan = createApprovalReviewArtifact(plan);
  const fromTrace = createApprovalReviewArtifact(plan.plannerTrace);

  assert.equal(fromPlan.generatedAt, defaultGeneratedAt);
  assert.deepEqual(fromTrace, fromPlan);
});

test("review artifact generatedAt override does not change approval decisions", async () => {
  const plan = await createFixturePlan("approvalRequired");
  const artifact = createApprovalReviewArtifact(plan, {
    generatedAt: "2030-01-02T03:04:05.000Z"
  });

  assert.equal(artifact.generatedAt, "2030-01-02T03:04:05.000Z");
  assert.deepEqual(artifact.approvalDecision, plan.approvalDecision);
});

test("invalid review artifact fixture is rejected by the validation helper", async () => {
  const invalidArtifact = await readJsonFixture(artifactFixtures.invalidExecutionEnabled);
  const result = validateApprovalReviewArtifact(invalidArtifact);

  assert.equal(result.valid, false);
  assert.match(result.errors.join("\n"), /safety.executionEnabled must be false/);
  assert.match(result.errors.join("\n"), /nonExecuting must be true/);
});
