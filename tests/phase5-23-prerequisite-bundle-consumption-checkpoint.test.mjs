import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readFile, readdir, rm, mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";
import {
  APPROVAL_PREREQUISITE_BUNDLE_CONSUMPTION_CHECKPOINT_SCHEMA,
  bundleApprovalPrerequisiteSourcesForReview,
  consumeApprovalPrerequisiteBundleForReview
} from "../packages/core/src/index.mjs";

const execFileAsync = promisify(execFile);
const phase523BaselineCommit = "76b6b01a396362650d03a7639bf2235ade424f90";
const reviewedAt = "2026-06-15T00:00:00.000Z";
const repoRootUrl = new URL("../", import.meta.url);
const repoRoot = fileURLToPath(repoRootUrl);
const cliSourceUrl = new URL("../apps/cli/src/index.mjs", import.meta.url);
const cliPath = fileURLToPath(cliSourceUrl);
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-23/prerequisite-bundle-consumption-checkpoint.json",
  import.meta.url
);

const expectedTopLevelKeys = Object.freeze([
  "schema",
  "schemaVersion",
  "phase",
  "artifactKind",
  "metadataGeneratedAt",
  "sourcePhase",
  "checkpointSummary",
  "consumptionInputShape",
  "consumptionResultShape",
  "bundleConsumptionCases",
  "reviewEvaluatorIntegration",
  "blockedRuntimeEffect",
  "serveRuntimeBlockedBehavior",
  "forbiddenBehavior",
  "filesAllowedToChange",
  "filesForbiddenToChange",
  "validationCommands"
]);

const expectedCaseIds = Object.freeze([
  "missing-bundle-rejected",
  "malformed-bundle-rejected",
  "conflicting-bundle-rejected",
  "valid-bundle-review-only-summary"
]);

const expectedClassifications = Object.freeze({
  "missing-bundle-rejected":
    "missing_prerequisite_bundle_consumption_rejected",
  "malformed-bundle-rejected":
    "malformed_prerequisite_bundle_consumption_rejected",
  "conflicting-bundle-rejected":
    "conflicting_prerequisite_bundle_consumption_rejected",
  "valid-bundle-review-only-summary":
    "valid_prerequisite_bundle_consumed_for_review_only_runtime_still_blocked"
});

const bundleConsumptionCommandProbes = Object.freeze([
  "approval-prerequisite-bundle-consumption",
  "consume-approval-prerequisite-bundle",
  "runtime-prerequisite-bundle-checkpoint",
  "phase-5-23-prerequisite-bundle-consumption-checkpoint",
  "approval-prerequisite-source-bundle",
  "bundle-approval-prerequisite-sources",
  "serve-runtime"
]);

function validity(overrides = {}) {
  return {
    notBefore: "2026-06-01T00:00:00.000Z",
    expiresAt: "2026-12-31T00:00:00.000Z",
    evaluatedAt: reviewedAt,
    validAtEvaluation: true,
    ...overrides
  };
}

function runtimeApprovalRecord(overrides = {}) {
  return {
    schema: "ardyn.runtime-approval-record",
    schemaVersion: "0.1.0",
    recordKind: "runtime-approval-record",
    recordId: "runtime-approval-record-001",
    recordPhase: "phase-5.7-runtime-approval-validation",
    approvalStatus: "approved",
    validity: validity(),
    revocation: {
      revoked: false,
      revokedAt: null,
      revocationReason: null
    },
    runtimeEffect: {
      currentRecordEnablesRuntime: false,
      runtimeStarts: false,
      runtimeEnabled: false,
      runtimeCommandEnabled: false,
      runtimeExecutionEnabled: false,
      approvalGrantCreated: false
    },
    ...overrides
  };
}

function commandExposureApprovalRecord(overrides = {}) {
  return {
    schema: "ardyn.runtime-command-exposure-approval-record",
    schemaVersion: "0.1.0",
    recordKind: "runtime-command-exposure-approval-record",
    recordId: "command-exposure-approval-record-001",
    recordPhase: "phase-5.8-runtime-command-exposure-approval",
    approvalStatus: "approved",
    validity: validity(),
    revocation: {
      revoked: false,
      revokedAt: null,
      revocationReason: null
    },
    commandExposureEffect: {
      currentRecordExposesUserRuntimeCommand: false,
      currentRecordEnablesRuntimeCommand: false,
      currentRecordExposesRuntimeExecution: false,
      additionalRuntimeCommandsRecognized: false,
      commandAliasCreated: false
    },
    runtimeEffect: {
      currentRecordEnablesRuntime: false,
      runtimeStarts: false,
      runtimeEnabled: false,
      runtimeCommandEnabled: false,
      runtimeExecutionEnabled: false,
      approvalGrantCreated: false
    },
    ...overrides
  };
}

function validRecords(overrides = {}) {
  return [
    runtimeApprovalRecord(overrides.runtimeApprovalRecord),
    commandExposureApprovalRecord(overrides.commandExposureApprovalRecord)
  ];
}

function inlineSource(sourceId, records, overrides = {}) {
  return {
    sourceId,
    sourceKind: "inline-prerequisite-records",
    sourceMode: "in-memory",
    records,
    ...overrides
  };
}

function selectedSourceBundlePart(partId, sourceInputs, overrides = {}) {
  return {
    partId,
    partKind: "selected-prerequisite-source",
    partMode: "in-memory",
    sourceInputs,
    ...overrides
  };
}

function validSourceBundle() {
  return bundleApprovalPrerequisiteSourcesForReview({
    reviewedAt,
    bundleParts: [
      selectedSourceBundlePart("bundle-valid-a", [
        inlineSource("source-valid-a", validRecords())
      ])
    ]
  });
}

function conflictingSourceBundle() {
  return bundleApprovalPrerequisiteSourcesForReview({
    reviewedAt,
    bundleParts: [
      selectedSourceBundlePart("bundle-valid-a", [
        inlineSource("source-valid-a", validRecords())
      ]),
      selectedSourceBundlePart("bundle-valid-b", [
        inlineSource("source-valid-b", [
          runtimeApprovalRecord({ recordId: "runtime-approval-record-002" }),
          commandExposureApprovalRecord()
        ])
      ])
    ]
  });
}

function bundleConsumptionCases() {
  return [
    {
      caseId: "missing-bundle-rejected",
      input: { reviewedAt },
      expectedConsumed: false,
      expectedEvaluatorForwarded: false
    },
    {
      caseId: "malformed-bundle-rejected",
      input: {
        reviewedAt,
        sourceBundle: {
          schema: "ardyn.phase-5.22.approval-prerequisite-source-bundle-result",
          schemaVersion: "0.1.0",
          bundleKind: "approval-prerequisite-source-bundle",
          bundleMode: "live-runtime",
          sourceBundleAccepted: true
        }
      },
      expectedConsumed: false,
      expectedEvaluatorForwarded: false
    },
    {
      caseId: "conflicting-bundle-rejected",
      input: { reviewedAt, sourceBundle: conflictingSourceBundle() },
      expectedConsumed: false,
      expectedEvaluatorForwarded: false
    },
    {
      caseId: "valid-bundle-review-only-summary",
      input: { reviewedAt, sourceBundle: validSourceBundle() },
      expectedConsumed: true,
      expectedEvaluatorForwarded: true
    }
  ];
}

async function readFixture() {
  return JSON.parse(await readFile(fixtureUrl, "utf8"));
}

async function runCliFailure(args) {
  try {
    await execFileAsync(process.execPath, [cliPath, ...args], {
      cwd: repoRoot
    });
    assert.fail(`Expected command to fail: ${args.join(" ")}`);
  } catch (error) {
    assert.notEqual(error.code, 0);
    assert.equal(error.stdout, "");
    return {
      stderr: error.stderr,
      code: error.code
    };
  }
}

async function withTempDir(callback) {
  const tempDir = await mkdtemp(join(tmpdir(), "ardyn-phase5-23-"));
  try {
    return await callback(tempDir);
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}

function assertAllFalse(record) {
  for (const [key, value] of Object.entries(record)) {
    assert.equal(value, false, `${key} should remain false`);
  }
}

test("Phase 5.23 bundle consumption checkpoint fixture is deterministic metadata", async () => {
  const fixture = await readFixture();

  assert.deepEqual(Object.keys(fixture), expectedTopLevelKeys);
  assert.equal(
    fixture.schema,
    "ardyn.phase-5.23.prerequisite-bundle-consumption-checkpoint"
  );
  assert.equal(fixture.schemaVersion, "0.1.0");
  assert.equal(
    fixture.phase,
    "phase-5.23-prerequisite-bundle-consumption-checkpoint"
  );
  assert.equal(
    fixture.artifactKind,
    "prerequisite-bundle-consumption-checkpoint"
  );
  assert.equal(fixture.metadataGeneratedAt, "1970-01-01T00:00:00.000Z");
  assert.equal(
    fixture.checkpointSummary.consumptionCheckpointRecorded,
    true
  );
  assert.equal(fixture.checkpointSummary.checkpointReviewOnly, true);
  assert.equal(fixture.checkpointSummary.checkpointAuthoritative, false);
  assert.equal(fixture.checkpointSummary.runtimeEnabled, false);
  assert.equal(fixture.checkpointSummary.approvalGrantProduced, false);
});

test("Phase 5.23 bundle consumption checkpoint classifies inputs deterministically", () => {
  for (const consumptionCase of bundleConsumptionCases()) {
    const result = consumeApprovalPrerequisiteBundleForReview(
      consumptionCase.input
    );

    assert.equal(
      result.schema,
      APPROVAL_PREREQUISITE_BUNDLE_CONSUMPTION_CHECKPOINT_SCHEMA
    );
    assert.equal(
      result.classification,
      expectedClassifications[consumptionCase.caseId]
    );
    assert.equal(
      result.bundleConsumedForReview,
      consumptionCase.expectedConsumed
    );
    assert.equal(
      result.evaluatorInputForwarded,
      consumptionCase.expectedEvaluatorForwarded
    );
    assert.equal(result.reviewOnly, true);
    assert.equal(result.authoritative, false);
    assert.equal(result.approvalGrant.produced, false);
    assert.equal(result.approvalGrant.persisted, false);
    assert.equal(result.approvalGrant.grantId, null);
    assertAllFalse(result.runtimeEffect);
  }
});

test("Phase 5.23 valid bundle summary remains review-only and non-authorizing", () => {
  const result = consumeApprovalPrerequisiteBundleForReview({
    reviewedAt,
    sourceBundle: validSourceBundle()
  });

  assert.equal(result.bundleConsumedForReview, true);
  assert.equal(result.evaluatorInputForwarded, true);
  assert.equal(result.consumedBundleSummary.selectedBundlePartId, "bundle-valid-a");
  assert.equal(result.consumedBundleSummary.readerRecordCount, 2);
  assert.equal(
    result.approvalPrerequisiteEvaluator.classification,
    "valid_prerequisites_review_only_runtime_still_blocked"
  );
  assert.equal(
    result.approvalPrerequisiteEvaluator.prerequisiteSignalRecognized,
    true
  );
  assert.equal(result.approvalPrerequisiteEvaluator.reviewOnly, true);
  assert.equal(result.approvalPrerequisiteEvaluator.authoritative, false);
  assert.equal(result.approvalPrerequisiteEvaluator.approvalGrant.produced, false);
  assert.equal(result.approvalPrerequisiteEvaluator.approvalGrant.persisted, false);
  assertAllFalse(result.approvalPrerequisiteEvaluator.runtimeEffect);
  assert.equal(result.runtimeEffect.runtimeEnabled, false);
  assert.equal(result.runtimeEffect.approvalGrantProduced, false);
});

test("Phase 5.23 rejected bundle consumption does not forward evaluator input", () => {
  const result = consumeApprovalPrerequisiteBundleForReview({
    reviewedAt,
    sourceBundle: conflictingSourceBundle()
  });

  assert.equal(
    result.classification,
    "conflicting_prerequisite_bundle_consumption_rejected"
  );
  assert.equal(result.bundleConsumedForReview, false);
  assert.equal(result.evaluatorInputForwarded, false);
  assert.equal(result.approvalPrerequisiteEvaluator, null);
  assert.equal(result.consumedBundleSummary.selectedBundlePartId, null);
  assert.equal(result.consumedBundleSummary.readerRecordCount, 0);
  assert.ok(
    result.rejectionReasons.includes(
      "conflicting_prerequisite_source_bundle_parts"
    )
  );
  assert.ok(result.rejectionReasons.includes("approval_grant_not_implemented"));
  assert.ok(result.rejectionReasons.includes("runtime_enablement_still_blocked"));
});

test("Phase 5.23 fixture mirrors bundle consumption cases and blocks grants", async () => {
  const fixture = await readFixture();

  assert.deepEqual(
    fixture.bundleConsumptionCases.map(({ caseId }) => caseId),
    expectedCaseIds
  );
  for (const fixtureCase of fixture.bundleConsumptionCases) {
    assert.equal(
      fixtureCase.classification,
      expectedClassifications[fixtureCase.caseId]
    );
    assert.equal(fixtureCase.reviewOnly, true);
    assert.equal(fixtureCase.authoritative, false);
    assert.equal(fixtureCase.approvalGrant.produced, false);
    assert.equal(fixtureCase.approvalGrant.persisted, false);
    assert.equal(fixtureCase.approvalGrant.grantId, null);
    assertAllFalse(fixtureCase.runtimeEffect);
  }
  assert.equal(
    fixture.reviewEvaluatorIntegration.validBundleMayFeedReviewEvaluator,
    true
  );
  assert.equal(
    fixture.reviewEvaluatorIntegration.rejectedBundleDoesNotFeedEvaluator,
    true
  );
  assert.equal(
    fixture.reviewEvaluatorIntegration.evaluatorStillReviewOnly,
    true
  );
  assert.equal(
    fixture.reviewEvaluatorIntegration.evaluatorCanProduceGrant,
    false
  );
  assert.equal(fixture.consumptionResultShape.approvalGrantProduced, false);
  assert.equal(fixture.consumptionResultShape.runtimeEffectAllFalse, true);
  assertAllFalse(fixture.blockedRuntimeEffect);
});

test("serve-runtime remains default-blocked and dry-run cannot bypass Phase 5.23 checkpoint", async () => {
  for (const args of [["serve-runtime"], ["serve-runtime", "--dry-run"]]) {
    const result = await runCliFailure(args);
    assert.match(result.stderr, /Runtime unavailable: serve-runtime is recognized/);
    assert.match(result.stderr, /runtime is not enabled in Phase 5\.5/);
  }
});

test("Phase 5.23 bundle consumption command names remain rejected", async () => {
  await withTempDir(async (tempDir) => {
    for (const command of bundleConsumptionCommandProbes) {
      const result = await runCliFailure([command]);
      assert.match(result.stderr, /Usage: ardyn/);
    }

    const entries = await readdir(tempDir);
    assert.deepEqual(entries, []);
  });
});

test("Phase 5.23 does not change CLI runtime source or add consumption runtime primitives", async () => {
  const currentCliSource = await readFile(cliPath, "utf8");
  const baselineCliSource = await execFileAsync(
    "git",
    ["show", `${phase523BaselineCommit}:apps/cli/src/index.mjs`],
    { cwd: repoRoot }
  );

  assert.equal(currentCliSource, baselineCliSource.stdout);

  const forbiddenSourcePatterns = [
    "createServer(",
    "listen(",
    "process.stdin.on",
    "process.stdin.resume",
    "spawn(",
    "execFile(",
    "fork(",
    "kill(",
    "WebSocket",
    "runtime-prerequisite-bundle-checkpoint",
    "consume-approval-prerequisite-bundle"
  ];

  for (const pattern of forbiddenSourcePatterns) {
    assert.equal(
      currentCliSource.includes(pattern),
      false,
      `CLI source must not contain ${pattern}`
    );
  }
});
