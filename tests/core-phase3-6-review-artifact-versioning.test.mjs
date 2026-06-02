import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  buildApprovalReviewArtifactDisplaySummary,
  classifyApprovalReviewArtifactCompatibility,
  compareApprovalReviewArtifacts,
  normalizeApprovalReviewArtifactForDisplay,
  validateApprovalReviewArtifact,
  validateApprovalReviewArtifactVersion
} from "../packages/core/src/index.mjs";

const phase36Fixtures = Object.freeze({
  currentCompatible: "tests/fixtures/review-artifacts/phase3-6/current-compatible-v1.json",
  unknownFields: "tests/fixtures/review-artifacts/phase3-6/compatible-unknown-fields.json",
  unsupportedMajor: "tests/fixtures/review-artifacts/phase3-6/unsupported-major-v2.json",
  malformed: "tests/fixtures/review-artifacts/phase3-6/malformed-missing-version.json",
  displaySummary: "tests/fixtures/review-artifacts/phase3-6/display-summary.json"
});

const traceReviewFixtures = Object.freeze({
  equalLeft: "tests/fixtures/trace-review/equal-left-approval-review-artifact.json",
  equalRight: "tests/fixtures/trace-review/equal-right-approval-review-artifact.json"
});

async function readJsonFixture(fixturePath) {
  return JSON.parse(await readFile(fixturePath, "utf8"));
}

function normalizeFixtureLineEndings(text) {
  return text.replaceAll("\r\n", "\n");
}

function assertAllSafetyFlagsFalse(flags) {
  for (const [key, value] of Object.entries(flags)) {
    assert.equal(value, false, `${key} should remain false`);
  }
}

test("phase 3.6 accepts the current compatible review artifact version", async () => {
  const artifact = await readJsonFixture(phase36Fixtures.currentCompatible);

  assert.equal(classifyApprovalReviewArtifactCompatibility(artifact), "compatible");
  assert.deepEqual(validateApprovalReviewArtifactVersion(artifact), {
    valid: true,
    compatibility: "compatible",
    errors: []
  });
  assert.deepEqual(validateApprovalReviewArtifact(artifact), {
    valid: true,
    errors: []
  });
  assertAllSafetyFlagsFalse(artifact.safety);
});

test("phase 3.6 display normalization preserves unknown fields without changing safety", async () => {
  const artifact = await readJsonFixture(phase36Fixtures.unknownFields);
  const normalized = normalizeApprovalReviewArtifactForDisplay(artifact);

  assert.equal(normalized.compatibility, "compatible");
  assert.equal(normalized.valid, true);
  assert.deepEqual(normalized.unknownFields, ["displayHints", "futureReviewMetadata"]);
  assert.deepEqual(normalized.unknown, {
    displayHints: {
      columns: ["taskId", "approvalDecision.status"],
      priority: "review"
    },
    futureReviewMetadata: {
      labels: ["phase3-6", "locus-display"],
      nested: {
        a: 1,
        z: 2
      },
      riskScore: 0
    }
  });
  assert.equal(normalized.safetyFlagsAllFalse, true);
  assertAllSafetyFlagsFalse(normalized.safety);
});

test("phase 3.6 rejects unsupported major review artifact versions deterministically", async () => {
  const artifact = await readJsonFixture(phase36Fixtures.unsupportedMajor);

  assert.equal(classifyApprovalReviewArtifactCompatibility(artifact), "unsupported_major");
  assert.deepEqual(validateApprovalReviewArtifactVersion(artifact), {
    valid: false,
    compatibility: "unsupported_major",
    errors: [
      "schemaVersion major 2 is unsupported; supported major is 0",
      "version major 2 is unsupported; supported major is 0"
    ]
  });

  const validation = validateApprovalReviewArtifact(artifact);
  assert.equal(validation.valid, false);
  assert.match(validation.errors.join("\n"), /schemaVersion must be 0\.1\.0/);
  assert.match(validation.errors.join("\n"), /version must be 0\.1\.0/);
});

test("phase 3.6 rejects malformed review artifact version metadata deterministically", async () => {
  const artifact = await readJsonFixture(phase36Fixtures.malformed);

  assert.equal(classifyApprovalReviewArtifactCompatibility(artifact), "malformed");
  assert.deepEqual(validateApprovalReviewArtifactVersion(artifact), {
    valid: false,
    compatibility: "malformed",
    errors: [
      "schema must be ardyn.approval-review-artifact",
      "version must be a semantic version string"
    ]
  });

  const validation = validateApprovalReviewArtifact(artifact);
  assert.equal(validation.valid, false);
  assert.match(validation.errors.join("\n"), /schema must be ardyn\.approval-review-artifact/);
  assert.match(validation.errors.join("\n"), /version must be 0\.1\.0/);
});

test("phase 3.6 builds a deterministic display summary for Locus and UI callers", async () => {
  const artifact = await readJsonFixture(phase36Fixtures.unknownFields);
  const summary = buildApprovalReviewArtifactDisplaySummary(artifact);
  const fixtureText = await readFile(phase36Fixtures.displaySummary, "utf8");
  const expected = JSON.parse(fixtureText);

  assert.deepEqual(summary, expected);
  assert.equal(`${JSON.stringify(summary, null, 2)}\n`, normalizeFixtureLineEndings(fixtureText));
  assert.equal(summary.safety.allFlagsFalse, true);
  assertAllSafetyFlagsFalse(summary.safety.flags);
});

test("phase 3.6 keeps existing review-trace comparison behavior intact", async () => {
  const left = await readJsonFixture(traceReviewFixtures.equalLeft);
  const right = await readJsonFixture(traceReviewFixtures.equalRight);
  const comparison = compareApprovalReviewArtifacts(left, right);

  assert.equal(comparison.equal, true);
  assert.equal(comparison.differenceCount, 0);
  assert.deepEqual(comparison.differences, []);
  assert.equal(comparison.nonExecuting, true);
  assertAllSafetyFlagsFalse(comparison.safety);
});
