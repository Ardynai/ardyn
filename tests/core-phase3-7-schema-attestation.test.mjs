import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  buildMigrationAttestationDisplaySummary,
  buildReviewArtifactAttestationPlan,
  buildSchemaMigrationMetadataRecord,
  classifyArtifactSchemaMetadata,
  digestApprovalReviewArtifact,
  normalizeApprovalReviewArtifactForDisplay
} from "../packages/core/src/index.mjs";

const fixtures = Object.freeze({
  current: "tests/fixtures/review-artifacts/phase3-7/current-compatible-review-artifact.json",
  older: "tests/fixtures/review-artifacts/phase3-7/older-compatible-review-artifact.json",
  unsupported: "tests/fixtures/review-artifacts/phase3-7/unsupported-major-review-artifact.json",
  malformed: "tests/fixtures/review-artifacts/phase3-7/malformed-review-artifact.json",
  unsignedPlan: "tests/fixtures/review-artifacts/phase3-7/unsigned-attestation-plan.json",
  testFixturePlan: "tests/fixtures/review-artifacts/phase3-7/test-fixture-only-attestation-plan.json",
  displaySummary: "tests/fixtures/review-artifacts/phase3-7/migration-metadata-display.json"
});

async function readJsonFixture(fixturePath) {
  return JSON.parse(await readFile(fixturePath, "utf8"));
}

async function readFixtureText(fixturePath) {
  return (await readFile(fixturePath, "utf8")).replaceAll("\r\n", "\n");
}

function assertAllSafetyFlagsFalse(flags) {
  for (const [key, value] of Object.entries(flags)) {
    assert.equal(value, false, `${key} should remain false`);
  }
}

function assertNoSecrets(value) {
  const text = JSON.stringify(value).toLowerCase();

  for (const forbidden of ["privatekey", "private_key", "secret", "token", "password"]) {
    assert.equal(text.includes(forbidden), false, `attestation plan should not contain ${forbidden}`);
  }
}

test("phase 3.7 schema metadata classifies current review artifacts as compatible", async () => {
  const artifact = await readJsonFixture(fixtures.current);
  const record = buildSchemaMigrationMetadataRecord("approval_review_artifact", artifact);

  assert.equal(classifyArtifactSchemaMetadata("approval_review_artifact", artifact), "compatible");
  assert.deepEqual(record, {
    schema: "ardyn.schema-migration-metadata",
    schemaVersion: "0.1.0",
    artifactKind: "approval_review_artifact",
    schemaId: "ardyn.approval-review-artifact",
    artifactSchemaVersion: "0.1.0",
    artifactVersion: "0.1.0",
    currentSchemaVersion: "0.1.0",
    currentArtifactVersion: "0.1.0",
    compatibility: "compatible",
    migrationRequired: false,
    migrationAvailable: false,
    migrationNotes: ["Artifact schema metadata is current; no migration is required."],
    validationErrors: [],
    nonExecuting: true
  });
});

test("phase 3.7 same-major older review artifacts get deterministic upgrade metadata", async () => {
  const artifact = await readJsonFixture(fixtures.older);
  const record = buildSchemaMigrationMetadataRecord("approval_review_artifact", artifact);

  assert.equal(classifyArtifactSchemaMetadata("approval_review_artifact", artifact), "upgrade_available");
  assert.equal(record.compatibility, "upgrade_available");
  assert.equal(record.migrationRequired, false);
  assert.equal(record.migrationAvailable, true);
  assert.deepEqual(record.validationErrors, []);
  assert.deepEqual(record.migrationNotes, [
    "Artifact shares the supported major schema version and can be displayed without execution.",
    "A future migration may normalize schemaVersion to 0.1.0.",
    "A future migration may normalize artifact version to 0.1.0."
  ]);

  const normalized = normalizeApprovalReviewArtifactForDisplay(artifact);
  assert.deepEqual(normalized.unknownFields, ["futureReviewMetadata"]);
  assert.equal(normalized.unknown.futureReviewMetadata.unknownFieldsRemainInert, true);
  assert.equal(normalized.safetyFlagsAllFalse, true);
  assertAllSafetyFlagsFalse(normalized.safety);
});

test("phase 3.7 unsupported major and malformed artifacts classify deterministically", async () => {
  const unsupported = await readJsonFixture(fixtures.unsupported);
  const malformed = await readJsonFixture(fixtures.malformed);

  assert.equal(classifyArtifactSchemaMetadata("approval_review_artifact", unsupported), "unsupported_major");
  assert.deepEqual(
    buildSchemaMigrationMetadataRecord("approval_review_artifact", unsupported).validationErrors,
    [
      "schemaVersion major 2 is unsupported; supported major is 0",
      "version major 2 is unsupported; supported major is 0"
    ]
  );

  assert.equal(classifyArtifactSchemaMetadata("approval_review_artifact", malformed), "malformed");
  assert.deepEqual(
    buildSchemaMigrationMetadataRecord("approval_review_artifact", malformed).validationErrors,
    ["version must be a semantic version string"]
  );
});

test("phase 3.7 unsigned attestation plan is deterministic, non-executing, and secret-free", async () => {
  const artifact = await readJsonFixture(fixtures.current);
  const plan = buildReviewArtifactAttestationPlan(artifact);
  const fixture = await readJsonFixture(fixtures.unsignedPlan);
  const fixtureText = await readFixtureText(fixtures.unsignedPlan);

  assert.deepEqual(plan, fixture);
  assert.equal(`${JSON.stringify(plan, null, 2)}\n`, fixtureText);
  assert.equal(plan.verification.status, "unsigned");
  assert.equal(plan.verification.verified, false);
  assert.equal(plan.signer.productionKeyAvailable, false);
  assert.equal(plan.signing.productionSigningEnabled, false);
  assert.equal(plan.signing.keysLoaded, false);
  assert.equal(plan.signing.realSigningPerformed, false);
  assert.equal(plan.nonExecuting, true);
  assertAllSafetyFlagsFalse(plan.safety);
  assertNoSecrets(plan);
  assert.deepEqual(digestApprovalReviewArtifact(artifact), plan.artifact.digest);
});

test("phase 3.7 test-fixture-only attestation plan remains clearly non-production", async () => {
  const artifact = await readJsonFixture(fixtures.current);
  const plan = buildReviewArtifactAttestationPlan(artifact, {
    verificationStatus: "test_fixture_only",
    signerIdentity: "test-fixture:phase3-7"
  });
  const fixture = await readJsonFixture(fixtures.testFixturePlan);

  assert.deepEqual(plan, fixture);
  assert.equal(plan.verification.status, "test_fixture_only");
  assert.equal(plan.signing.testFixtureOnly, true);
  assert.equal(plan.signer.identity, "test-fixture:phase3-7");
  assert.equal(plan.signing.productionSigningEnabled, false);
  assert.equal(plan.signing.keysLoaded, false);
  assert.equal(plan.signing.realSigningPerformed, false);
  assertNoSecrets(plan);
  assertAllSafetyFlagsFalse(plan.safety);
});

test("phase 3.7 migration and attestation display summary is fixture-stable", async () => {
  const artifact = await readJsonFixture(fixtures.older);
  const summary = buildMigrationAttestationDisplaySummary("approval_review_artifact", artifact);
  const fixture = await readJsonFixture(fixtures.displaySummary);
  const fixtureText = await readFixtureText(fixtures.displaySummary);

  assert.deepEqual(summary, fixture);
  assert.equal(`${JSON.stringify(summary, null, 2)}\n`, fixtureText);
  assert.equal(summary.compatibility, "upgrade_available");
  assert.deepEqual(summary.warnings, ["unsigned", "upgrade_available"]);
  assert.deepEqual(summary.unknownFields, ["futureReviewMetadata"]);
  assert.equal(summary.attestation.productionSigningEnabled, false);
  assert.equal(summary.attestation.keysLoaded, false);
  assert.equal(summary.attestation.realSigningPerformed, false);
  assertAllSafetyFlagsFalse(summary.safety);
});
