import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readFile, readdir, rm, mkdtemp } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";
import {
  REVIEW_ONLY_INSPECTION_HANDOFF_CHECKPOINT_SCHEMA,
  createReviewOnlyInspectionHandoffCheckpointForReview
} from "../packages/core/src/index.mjs";

const execFileAsync = promisify(execFile);
const phase539BaselineCommit = "654fab98c346d782d3e24f51013831894b86c9eb";
const reviewedAt = "2026-06-17T00:00:00.000Z";
const repoRootUrl = new URL("../", import.meta.url);
const repoRoot = fileURLToPath(repoRootUrl);
const cliSourceUrl = new URL("../apps/cli/src/index.mjs", import.meta.url);
const cliPath = fileURLToPath(cliSourceUrl);
const rustLibSourceUrl = new URL("../crates/ardyn-host/src/lib.rs", import.meta.url);
const rustStdioSourceUrl = new URL(
  "../crates/ardyn-host/src/stdio_runtime/mod.rs",
  import.meta.url
);
const phase538FixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-38/review-only-inspection-handoff-metadata-boundary.json",
  import.meta.url
);
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-39/review-only-inspection-handoff-checkpoint.json",
  import.meta.url
);
const phase538Fixture = JSON.parse(
  readFileSync(fileURLToPath(phase538FixtureUrl), "utf8")
);

const expectedTopLevelKeys = Object.freeze([
  "schema",
  "schemaVersion",
  "phase",
  "checkpointKind",
  "metadataGeneratedAt",
  "sourcePhase",
  "inspectionHandoffCheckpointSummary",
  "inspectionHandoffCheckpointInputShape",
  "inspectionHandoffCheckpointResultShape",
  "inspectionHandoffCheckpointCases",
  "inspectionHandoffCheckpoint",
  "cleanupToolkitBaselineEvidence",
  "blockedRuntimeEffect",
  "serveRuntimeBlockedBehavior",
  "forbiddenBehavior",
  "filesAllowedToChange",
  "filesForbiddenToChange",
  "validationCommands"
]);

const expectedCaseIds = Object.freeze([
  "missing-review-only-inspection-handoff-checkpoint-input-rejected",
  "malformed-review-only-inspection-handoff-checkpoint-input-rejected",
  "malformed-review-only-inspection-handoff-checkpoint-invalid-reviewed-at-rejected",
  "empty-review-only-inspection-handoff-checkpoint-input-rejected",
  "conflicting-review-only-inspection-handoff-checkpoint-input-rejected",
  "stale-review-only-inspection-handoff-checkpoint-input-rejected",
  "revoked-review-only-inspection-handoff-checkpoint-input-rejected",
  "unknown-review-only-inspection-handoff-checkpoint-input-rejected",
  "duplicate-invalid-review-only-inspection-handoff-checkpoint-input-rejected",
  "authorizing-looking-review-only-inspection-handoff-checkpoint-input-rejected",
  "grant-looking-review-only-inspection-handoff-checkpoint-input-rejected",
  "approval-decision-looking-review-only-inspection-handoff-checkpoint-input-rejected",
  "approval-grant-looking-review-only-inspection-handoff-checkpoint-input-rejected",
  "evaluator-result-looking-review-only-inspection-handoff-checkpoint-input-rejected",
  "evaluator-execution-looking-review-only-inspection-handoff-checkpoint-input-rejected",
  "reviewer-routing-looking-review-only-inspection-handoff-checkpoint-input-rejected",
  "reviewer-assignment-looking-review-only-inspection-handoff-checkpoint-input-rejected",
  "runtime-permission-looking-review-only-inspection-handoff-checkpoint-input-rejected",
  "command-exposure-looking-review-only-inspection-handoff-checkpoint-input-rejected",
  "runtime-effect-true-review-only-inspection-handoff-checkpoint-input-rejected",
  "process-flag-true-review-only-inspection-handoff-checkpoint-input-rejected",
  "unsafe-top-level-review-only-inspection-handoff-checkpoint-input-rejected",
  "unsafe-nested-inspection-handoff-checkpoint-metadata-review-only-inspection-handoff-checkpoint-input-rejected",
  "execution-signal-looking-review-only-inspection-handoff-checkpoint-input-rejected",
  "valid-review-only-inspection-handoff-checkpoint"
]);

const expectedClassifications = Object.freeze({
  "missing-review-only-inspection-handoff-checkpoint-input-rejected":
    "missing_review_only_inspection_handoff_checkpoint_input_rejected",
  "malformed-review-only-inspection-handoff-checkpoint-input-rejected":
    "malformed_review_only_inspection_handoff_checkpoint_input_rejected",
  "malformed-review-only-inspection-handoff-checkpoint-invalid-reviewed-at-rejected":
    "malformed_review_only_inspection_handoff_checkpoint_input_rejected",
  "empty-review-only-inspection-handoff-checkpoint-input-rejected":
    "empty_review_only_inspection_handoff_checkpoint_input_rejected",
  "conflicting-review-only-inspection-handoff-checkpoint-input-rejected":
    "conflicting_review_only_inspection_handoff_checkpoint_input_rejected",
  "stale-review-only-inspection-handoff-checkpoint-input-rejected":
    "stale_review_only_inspection_handoff_checkpoint_input_rejected",
  "revoked-review-only-inspection-handoff-checkpoint-input-rejected":
    "revoked_review_only_inspection_handoff_checkpoint_input_rejected",
  "unknown-review-only-inspection-handoff-checkpoint-input-rejected":
    "unknown_review_only_inspection_handoff_checkpoint_input_rejected",
  "duplicate-invalid-review-only-inspection-handoff-checkpoint-input-rejected":
    "duplicate_invalid_review_only_inspection_handoff_checkpoint_input_rejected",
  "authorizing-looking-review-only-inspection-handoff-checkpoint-input-rejected":
    "authorizing_review_only_inspection_handoff_checkpoint_input_rejected",
  "grant-looking-review-only-inspection-handoff-checkpoint-input-rejected":
    "grant_looking_review_only_inspection_handoff_checkpoint_input_rejected",
  "approval-decision-looking-review-only-inspection-handoff-checkpoint-input-rejected":
    "approval_decision_looking_review_only_inspection_handoff_checkpoint_input_rejected",
  "approval-grant-looking-review-only-inspection-handoff-checkpoint-input-rejected":
    "approval_grant_looking_review_only_inspection_handoff_checkpoint_input_rejected",
  "evaluator-result-looking-review-only-inspection-handoff-checkpoint-input-rejected":
    "evaluator_result_looking_review_only_inspection_handoff_checkpoint_input_rejected",
  "evaluator-execution-looking-review-only-inspection-handoff-checkpoint-input-rejected":
    "evaluator_execution_looking_review_only_inspection_handoff_checkpoint_input_rejected",
  "reviewer-routing-looking-review-only-inspection-handoff-checkpoint-input-rejected":
    "reviewer_routing_looking_review_only_inspection_handoff_checkpoint_input_rejected",
  "reviewer-assignment-looking-review-only-inspection-handoff-checkpoint-input-rejected":
    "reviewer_assignment_looking_review_only_inspection_handoff_checkpoint_input_rejected",
  "runtime-permission-looking-review-only-inspection-handoff-checkpoint-input-rejected":
    "runtime_permission_looking_review_only_inspection_handoff_checkpoint_input_rejected",
  "command-exposure-looking-review-only-inspection-handoff-checkpoint-input-rejected":
    "command_exposure_looking_review_only_inspection_handoff_checkpoint_input_rejected",
  "runtime-effect-true-review-only-inspection-handoff-checkpoint-input-rejected":
    "runtime_effect_true_review_only_inspection_handoff_checkpoint_input_rejected",
  "process-flag-true-review-only-inspection-handoff-checkpoint-input-rejected":
    "process_flag_true_review_only_inspection_handoff_checkpoint_input_rejected",
  "unsafe-top-level-review-only-inspection-handoff-checkpoint-input-rejected":
    "unsafe_review_only_inspection_handoff_checkpoint_input_rejected",
  "unsafe-nested-inspection-handoff-checkpoint-metadata-review-only-inspection-handoff-checkpoint-input-rejected":
    "unsafe_review_only_inspection_handoff_checkpoint_input_rejected",
  "execution-signal-looking-review-only-inspection-handoff-checkpoint-input-rejected":
    "execution_signal_looking_review_only_inspection_handoff_checkpoint_input_rejected",
  "valid-review-only-inspection-handoff-checkpoint":
    "valid_review_only_inspection_handoff_checkpoint_runtime_still_blocked"
});

const checkpointCommandProbes = Object.freeze([
  "review-only-inspection-handoff-checkpoint",
  "create-review-only-inspection-handoff-checkpoint",
  "inspection-handoff-checkpoint",
  "phase-5-39-review-only-inspection-handoff-checkpoint",
  "reviewer-routing",
  "reviewer-assignment",
  "serve-runtime"
]);

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function validMetadata() {
  return clone(phase538Fixture.inspectionHandoffMetadata);
}

function metadataWith(overrides = {}) {
  return {
    ...validMetadata(),
    ...overrides
  };
}

function metadataWithNested(objectKey, nestedKey, nestedValue = true) {
  const metadata = validMetadata();
  metadata[objectKey] = {
    ...metadata[objectKey],
    [nestedKey]: nestedValue
  };
  return metadata;
}

function createResult(entries, options = {}) {
  return createReviewOnlyInspectionHandoffCheckpointForReview({
    reviewedAt,
    inspectionHandoffMetadataEntries: entries,
    ...options
  });
}

function caseSummary(caseId, result) {
  return {
    caseId,
    classification: result.classification,
    reviewOnly: result.reviewOnly,
    authoritative: result.authoritative,
    reviewArtifactOnly: result.reviewArtifactOnly,
    inspectionHandoffCheckpointProduced:
      result.inspectionHandoffCheckpointProduced,
    inspectionHandoffCheckpointIsReviewerRouting:
      result.inspectionHandoffCheckpointIsReviewerRouting,
    inspectionHandoffCheckpointIsReviewerAssignment:
      result.inspectionHandoffCheckpointIsReviewerAssignment,
    inspectionHandoffCheckpointIsEvaluatorExecution:
      result.inspectionHandoffCheckpointIsEvaluatorExecution,
    inspectionHandoffCheckpointIsEvaluatorResult:
      result.inspectionHandoffCheckpointIsEvaluatorResult,
    inspectionHandoffCheckpointIsApprovalDecision:
      result.inspectionHandoffCheckpointIsApprovalDecision,
    inspectionHandoffCheckpointIsApprovalGrant:
      result.inspectionHandoffCheckpointIsApprovalGrant,
    reviewerRoutingPerformed: result.reviewerRoutingPerformed,
    reviewerAssignmentPerformed: result.reviewerAssignmentPerformed,
    evaluatorResultProduced: result.evaluatorResultProduced,
    evaluatorResultPersisted: result.evaluatorResultPersisted,
    approvalDecisionProduced: result.approvalDecisionProduced,
    approvalDecisionPersisted: result.approvalDecisionPersisted,
    approvalGrant: result.approvalGrant,
    approvalGrantProduced: result.approvalGrantProduced,
    approvalGrantPersisted: result.approvalGrantPersisted,
    runtimePermissionGranted: result.runtimePermissionGranted,
    commandExposurePermissionGranted: result.commandExposurePermissionGranted,
    runtimeCommandExposureEnabled: result.runtimeCommandExposureEnabled,
    runtimeExecutionEnabled: result.runtimeExecutionEnabled,
    evaluatorExecuted: result.evaluatorExecuted,
    runtimeEffect: result.runtimeEffect
  };
}

function authorizationCheckpointCases() {
  const conflicting = metadataWith({
    reviewedAt: "2026-06-17T00:00:01.000Z"
  });
  return [
    [
      "missing-review-only-inspection-handoff-checkpoint-input-rejected",
      createReviewOnlyInspectionHandoffCheckpointForReview({ reviewedAt })
    ],
    [
      "malformed-review-only-inspection-handoff-checkpoint-input-rejected",
      createReviewOnlyInspectionHandoffCheckpointForReview(null)
    ],
    [
      "malformed-review-only-inspection-handoff-checkpoint-invalid-reviewed-at-rejected",
      createReviewOnlyInspectionHandoffCheckpointForReview({
        reviewedAt: "not-a-date",
        inspectionHandoffMetadataEntries: [validMetadata()]
      })
    ],
    ["empty-review-only-inspection-handoff-checkpoint-input-rejected", createResult([])],
    [
      "conflicting-review-only-inspection-handoff-checkpoint-input-rejected",
      createResult([validMetadata(), conflicting])
    ],
    [
      "stale-review-only-inspection-handoff-checkpoint-input-rejected",
      createResult([metadataWith({ reviewedAt: "2026-06-16T23:59:59.000Z" })])
    ],
    [
      "revoked-review-only-inspection-handoff-checkpoint-input-rejected",
      createResult([metadataWith({ status: "revoked" })])
    ],
    [
      "unknown-review-only-inspection-handoff-checkpoint-input-rejected",
      createResult([metadataWith({ status: "unknown" })])
    ],
    [
      "duplicate-invalid-review-only-inspection-handoff-checkpoint-input-rejected",
      createResult([validMetadata(), validMetadata()])
    ],
    [
      "authorizing-looking-review-only-inspection-handoff-checkpoint-input-rejected",
      createResult([
        metadataWithNested("inspectionHandoffMetadataSummary", "canGrantRuntime")
      ])
    ],
    [
      "grant-looking-review-only-inspection-handoff-checkpoint-input-rejected",
      createResult([
        metadataWithNested("inspectionHandoffMetadataSummary", "grant")
      ])
    ],
    [
      "approval-decision-looking-review-only-inspection-handoff-checkpoint-input-rejected",
      createResult([metadataWith({ approvalDecisionProduced: true })])
    ],
    [
      "approval-grant-looking-review-only-inspection-handoff-checkpoint-input-rejected",
      createResult([metadataWith({ approvalGrantProduced: true })])
    ],
    [
      "evaluator-result-looking-review-only-inspection-handoff-checkpoint-input-rejected",
      createResult([metadataWith({ evaluatorResultProduced: true })])
    ],
    [
      "evaluator-execution-looking-review-only-inspection-handoff-checkpoint-input-rejected",
      createResult([metadataWith({ evaluatorExecuted: true })])
    ],
    [
      "reviewer-routing-looking-review-only-inspection-handoff-checkpoint-input-rejected",
      createResult([metadataWith({ reviewerRoutingEnabled: true })])
    ],
    [
      "reviewer-assignment-looking-review-only-inspection-handoff-checkpoint-input-rejected",
      createResult([metadataWith({ reviewerAssignmentEnabled: true })])
    ],
    [
      "runtime-permission-looking-review-only-inspection-handoff-checkpoint-input-rejected",
      createResult([metadataWith({ runtimePermissionGranted: true })])
    ],
    [
      "command-exposure-looking-review-only-inspection-handoff-checkpoint-input-rejected",
      createResult([metadataWith({ commandExposurePermissionGranted: true })])
    ],
    [
      "runtime-effect-true-review-only-inspection-handoff-checkpoint-input-rejected",
      createResult([
        metadataWith({
          runtimeEffect: {
            ...validMetadata().runtimeEffect,
            runtimeEnabled: true
          }
        })
      ])
    ],
    [
      "process-flag-true-review-only-inspection-handoff-checkpoint-input-rejected",
      createResult([
        metadataWithNested("inspectionHandoffMetadataSummary", "processSpawned")
      ])
    ],
    [
      "unsafe-top-level-review-only-inspection-handoff-checkpoint-input-rejected",
      createResult([metadataWith({ checkpointMetadata: {} })])
    ],
    [
      "unsafe-nested-inspection-handoff-checkpoint-metadata-review-only-inspection-handoff-checkpoint-input-rejected",
      createResult([
        metadataWithNested(
          "inspectionHandoffMetadataSummary",
          "inspectionHandoffCheckpoint"
        )
      ])
    ],
    [
      "execution-signal-looking-review-only-inspection-handoff-checkpoint-input-rejected",
      createResult([
        metadataWithNested("inspectionHandoffMetadataSummary", "executionSignal")
      ])
    ],
    ["valid-review-only-inspection-handoff-checkpoint", createResult([validMetadata()])]
  ].map(([caseId, result]) => caseSummary(caseId, result));
}

function expectedFixture() {
  const validResult = createResult([validMetadata()]);
  return {
    schema: REVIEW_ONLY_INSPECTION_HANDOFF_CHECKPOINT_SCHEMA,
    schemaVersion: "0.1.0",
    phase: "phase-5.39-review-only-inspection-handoff-checkpoint",
    checkpointKind: "review-only-inspection-handoff-checkpoint",
    metadataGeneratedAt: reviewedAt,
    sourcePhase: {
      phase: "phase-5.38-review-only-inspection-handoff-metadata-boundary",
      inspectionHandoffMetadataBoundaryPath:
        "packages/core/src/index.mjs#createReviewOnlyInspectionHandoffMetadataBoundaryForReview",
      inspectionHandoffCheckpointPath:
        "packages/core/src/index.mjs#createReviewOnlyInspectionHandoffCheckpointForReview",
      sourceInspectionHandoffMetadataBoundaryFixture:
        "tests/fixtures/host-policy/phase5-38/review-only-inspection-handoff-metadata-boundary.json",
      cleanupToolkitBaselineDocument:
        "docs/phase-5-38a-cleanup-toolkit-adoption.md",
      runtimeEnabled: false,
      reviewerRoutingPerformed: false,
      reviewerAssignmentPerformed: false,
      approvalDecisionProduced: false,
      approvalGrantProduced: false,
      evaluatorExecutionPerformed: false
    },
    inspectionHandoffCheckpointSummary: {
      reviewOnlyInspectionHandoffCheckpointRecorded: true,
      checkpointKind: "review-only-inspection-handoff-checkpoint",
      checkpointReviewOnly: true,
      checkpointAuthoritative: false,
      validInspectionHandoffMetadataProducesCheckpoint: true,
      missingInspectionHandoffMetadataRejected: true,
      malformedInspectionHandoffMetadataRejected: true,
      emptyInspectionHandoffMetadataRejected: true,
      conflictingInspectionHandoffMetadataRejected: true,
      staleInspectionHandoffMetadataRejected: true,
      revokedInspectionHandoffMetadataRejected: true,
      unknownInspectionHandoffMetadataRejected: true,
      duplicateInvalidInspectionHandoffMetadataRejected: true,
      authorizingLookingInspectionHandoffMetadataRejected: true,
      grantLookingInspectionHandoffMetadataRejected: true,
      approvalDecisionLookingInspectionHandoffMetadataRejected: true,
      approvalGrantLookingInspectionHandoffMetadataRejected: true,
      evaluatorResultLookingInspectionHandoffMetadataRejected: true,
      evaluatorExecutionLookingInspectionHandoffMetadataRejected: true,
      reviewerRoutingLookingInspectionHandoffMetadataRejected: true,
      reviewerAssignmentLookingInspectionHandoffMetadataRejected: true,
      runtimePermissionLookingInspectionHandoffMetadataRejected: true,
      commandExposureLookingInspectionHandoffMetadataRejected: true,
      runtimeEffectTrueInspectionHandoffMetadataRejected: true,
      processFlagTrueInspectionHandoffMetadataRejected: true,
      unsafeInspectionHandoffMetadataRejected: true,
      executionSignalLookingInspectionHandoffMetadataRejected: true,
      inspectionHandoffCheckpointIsReviewerRouting: false,
      inspectionHandoffCheckpointIsReviewerAssignment: false,
      inspectionHandoffCheckpointIsEvaluatorExecution: false,
      inspectionHandoffCheckpointIsEvaluatorResult: false,
      inspectionHandoffCheckpointIsApprovalDecision: false,
      inspectionHandoffCheckpointIsApprovalGrant: false,
      reviewerRoutingPerformed: false,
      reviewerAssignmentPerformed: false,
      evaluatorResultProduced: false,
      evaluatorResultPersisted: false,
      approvalDecisionProduced: false,
      approvalDecisionPersisted: false,
      approvalGrantProduced: false,
      approvalGrantPersisted: false,
      runtimePermissionGranted: false,
      commandExposurePermissionGranted: false,
      runtimeEnabled: false,
      runtimeCommandEnabled: false,
      runtimeCommandExposureEnabled: false,
      runtimeExecutionEnabled: false,
      evaluatorExecutionPerformed: false,
      cleanupToolkitBaselineBehaviorPreserving: true,
      cleanupToolkitBaselineRuntimeBlocked: true,
      cleanupToolsInstalledByPhase539: false,
      fallowRuntimeUsed: false,
      serveRuntimeStillDefaultBlocked: true,
      dryRunBypassesBlock: false,
      canEnableRuntime: false
    },
    inspectionHandoffCheckpointInputShape: {
      inspectionHandoffMetadataEntries:
        "exactly one Phase 5.38 review-only inspection/handoff metadata state",
      inspectionHandoffMetadataSchema:
        "ardyn.phase-5.38.review-only-inspection-handoff-metadata-state",
      inspectionHandoffMetadataMode: "review-only",
      validInspectionHandoffMetadataRequired: true,
      authorizingLookingMetadataPolicy: "fail-closed",
      grantLookingMetadataPolicy: "fail-closed",
      reviewerRoutingLookingMetadataPolicy: "fail-closed",
      reviewerAssignmentLookingMetadataPolicy: "fail-closed",
      evaluatorExecutionLookingMetadataPolicy: "fail-closed",
      runtimeEffectTrueMetadataPolicy: "fail-closed",
      processFlagTrueMetadataPolicy: "fail-closed",
      unsafeTopLevelMetadataPolicy: "fail-closed",
      unsafeNestedInspectionHandoffCheckpointMetadataPolicy: "fail-closed",
      executionSignalLookingMetadataPolicy: "fail-closed",
      filesystemWatcherAllowed: false,
      externalSourceLookupAllowed: false,
      secretsEnvIngestionAllowed: false,
      filePathAllowed: false,
      urlAllowed: false
    },
    inspectionHandoffCheckpointResultShape: {
      schema:
        "ardyn.phase-5.39.review-only-inspection-handoff-checkpoint-result",
      schemaVersion: "0.1.0",
      checkpointKind: "review-only-inspection-handoff-checkpoint",
      checkpointMode: "review-only",
      stateSchema:
        "ardyn.phase-5.39.review-only-inspection-handoff-checkpoint-state",
      stateKind: "review-only-inspection-handoff-checkpoint-state",
      reviewOnly: true,
      reviewArtifactOnly: true,
      authoritative: false,
      performsReviewerRouting: false,
      assignsReviewers: false,
      executesEvaluator: false,
      producesEvaluatorResult: false,
      producesApprovalDecision: false,
      producesApprovalGrant: false,
      persistsApprovalGrant: false,
      grantsRuntimePermission: false,
      grantsCommandExposurePermission: false,
      enablesRuntimeCommandExposure: false,
      enablesRuntimeExecution: false
    },
    inspectionHandoffCheckpointCases: authorizationCheckpointCases(),
    inspectionHandoffCheckpoint: validResult.inspectionHandoffCheckpoint,
    cleanupToolkitBaselineEvidence: validResult.cleanupToolkitBaselineEvidence,
    blockedRuntimeEffect: validResult.runtimeEffect,
    serveRuntimeBlockedBehavior: {
      commandRecognized: true,
      defaultBlocked: true,
      dryRunBlocked: true,
      dryRunBypassesBlock: false,
      stdout: "",
      stderrIncludes: "runtime unavailable",
      exitCode: 1
    },
    forbiddenBehavior: {
      reviewerRoutingPerformed: false,
      reviewerAssignmentPerformed: false,
      evaluatorExecutionPerformed: false,
      evaluatorResultProduced: false,
      approvalDecisionProduced: false,
      approvalGrantProduced: false,
      approvalGrantPersisted: false,
      runtimePermissionGranted: false,
      commandExposurePermissionGranted: false,
      runtimeCommandExposureEnabled: false,
      runtimeExecutionEnabled: false,
      rustHostRuntimeImplemented: false,
      liveRuntimeStarted: false,
      processControlPerformed: false,
      stdinLoopEnabled: false,
      stdoutRuntimeWriterEnabled: false,
      stderrRuntimeWriterEnabled: false,
      transcriptRuntimeWritePerformed: false,
      auditRuntimeWritePerformed: false,
      adapterRuntimeSurfaceEnabled: false,
      fabricRuntimeSurfaceEnabled: false,
      webSocketHttpSurfaceEnabled: false,
      filesystemWatcherEnabled: false,
      externalLookupPerformed: false,
      envSecretsIngested: false
    },
    filesAllowedToChange: [
      "packages/core/src/index.mjs",
      "packages/core/src/index.d.ts",
      "tests/phase5-39-review-only-inspection-handoff-checkpoint.test.mjs",
      "tests/fixtures/host-policy/phase5-39/review-only-inspection-handoff-checkpoint.json",
      "docs/phase-5-39-review-only-inspection-handoff-checkpoint.md",
      "docs/phase-5-38-review-only-inspection-handoff-metadata-boundary.md",
      "README.md",
      "apps/cli/README.md",
      "crates/ardyn-host/README.md",
      "scripts/report-phase-status.mjs",
      "tests/report-phase-status.test.mjs"
    ],
    filesForbiddenToChange: [
      "apps/cli/src/index.mjs",
      "crates/ardyn-host/src/lib.rs",
      "crates/ardyn-host/src/stdio_runtime/mod.rs",
      "packages/adapters/**",
      "packages/fabric/**",
      ".env",
      ".env.local"
    ],
    validationCommands: [
      "node --test tests/phase5-39-review-only-inspection-handoff-checkpoint.test.mjs",
      "node --test tests/report-phase-status.test.mjs",
      "npm test",
      "npm run test:schemas",
      "npm run report:phase-status",
      "cargo test --workspace",
      "cargo check --workspace",
      "cargo fmt --check",
      "cargo clippy --workspace -- -D warnings",
      "npm audit --json",
      "git diff --check",
      "git diff --cached --check",
      "fallow health --score --hotspots --targets --format json",
      "fallow audit --format json"
    ]
  };
}

function assertAllFalse(record) {
  for (const [field, value] of Object.entries(record)) {
    assert.equal(value, false, field);
  }
}

async function runCliFailure(args, options = {}) {
  try {
    const result = await execFileAsync(process.execPath, [cliPath, ...args], {
      cwd: repoRoot,
      ...options
    });
    return { code: 0, stdout: result.stdout, stderr: result.stderr };
  } catch (error) {
    return {
      code: error.code,
      stdout: error.stdout,
      stderr: error.stderr
    };
  }
}

test("Phase 5.39 inspection handoff checkpoint fixture is deterministic metadata", async () => {
  const fixture = JSON.parse(await readFile(fixtureUrl, "utf8"));

  assert.deepEqual(Object.keys(fixture), expectedTopLevelKeys);
  assert.deepEqual(fixture, expectedFixture());
});

test("Phase 5.39 inspection handoff checkpoint classifies metadata cases", () => {
  const cases = authorizationCheckpointCases();

  assert.deepEqual(
    cases.map(({ caseId }) => caseId),
    expectedCaseIds
  );
  for (const checkpointCase of cases) {
    assert.equal(
      checkpointCase.classification,
      expectedClassifications[checkpointCase.caseId],
      checkpointCase.caseId
    );
    assert.equal(checkpointCase.reviewOnly, true);
    assert.equal(checkpointCase.authoritative, false);
    assert.equal(checkpointCase.reviewArtifactOnly, true);
    assert.equal(checkpointCase.inspectionHandoffCheckpointIsReviewerRouting, false);
    assert.equal(
      checkpointCase.inspectionHandoffCheckpointIsReviewerAssignment,
      false
    );
    assert.equal(
      checkpointCase.inspectionHandoffCheckpointIsEvaluatorExecution,
      false
    );
    assert.equal(checkpointCase.inspectionHandoffCheckpointIsEvaluatorResult, false);
    assert.equal(
      checkpointCase.inspectionHandoffCheckpointIsApprovalDecision,
      false
    );
    assert.equal(checkpointCase.inspectionHandoffCheckpointIsApprovalGrant, false);
    assert.equal(checkpointCase.approvalGrant.produced, false);
    assert.equal(checkpointCase.approvalGrant.persisted, false);
    assert.equal(checkpointCase.approvalGrant.grantId, null);
    assertAllFalse(checkpointCase.runtimeEffect);
  }
});

test("Phase 5.39 malformed checkpoint input fails closed without throwing", () => {
  for (const input of [null, "bad", { reviewedAt: "bad" }]) {
    const result = createReviewOnlyInspectionHandoffCheckpointForReview(input);

    assert.equal(
      result.classification,
      "malformed_review_only_inspection_handoff_checkpoint_input_rejected"
    );
    assert.equal(result.inspectionHandoffCheckpointProduced, false);
    assert.equal(result.inspectionHandoffCheckpoint, null);
    assert.equal(result.approvalGrantProduced, false);
    assert.equal(result.runtimeExecutionEnabled, false);
    assertAllFalse(result.runtimeEffect);
  }
});

test("Phase 5.39 valid metadata produces only inspection handoff checkpoint", () => {
  const result = createResult([validMetadata()]);
  const checkpoint = result.inspectionHandoffCheckpoint;

  assert.equal(
    result.classification,
    "valid_review_only_inspection_handoff_checkpoint_runtime_still_blocked"
  );
  assert.equal(result.inspectionHandoffCheckpointProduced, true);
  assert.equal(
    checkpoint.schema,
    "ardyn.phase-5.39.review-only-inspection-handoff-checkpoint-state"
  );
  assert.equal(
    checkpoint.stateKind,
    "review-only-inspection-handoff-checkpoint-state"
  );
  assert.equal(checkpoint.stateMode, "review-only");
  assert.equal(checkpoint.inspectionHandoffCheckpointMetadataOnly, true);
  assert.equal(checkpoint.inspectionHandoffCheckpointIsReviewerRouting, false);
  assert.equal(checkpoint.inspectionHandoffCheckpointIsReviewerAssignment, false);
  assert.equal(checkpoint.inspectionHandoffCheckpointIsEvaluatorExecution, false);
  assert.equal(checkpoint.inspectionHandoffCheckpointIsEvaluatorResult, false);
  assert.equal(checkpoint.inspectionHandoffCheckpointIsApprovalDecision, false);
  assert.equal(checkpoint.inspectionHandoffCheckpointIsApprovalGrant, false);
  assert.equal(checkpoint.reviewerRoutingPerformed, false);
  assert.equal(checkpoint.reviewerAssignmentPerformed, false);
  assert.equal(checkpoint.evaluatorExecuted, false);
  assert.equal(checkpoint.evaluatorResultProduced, false);
  assert.equal(checkpoint.approvalDecisionProduced, false);
  assert.equal(checkpoint.approvalGrantProduced, false);
  assert.equal(checkpoint.approvalGrantPersisted, false);
  assert.equal(checkpoint.runtimePermissionGranted, false);
  assert.equal(checkpoint.commandExposurePermissionGranted, false);
  assert.equal(checkpoint.cleanupToolkitBaselineEvidence.behaviorPreserving, true);
  assert.equal(
    checkpoint.cleanupToolkitBaselineEvidence.serveRuntimeStillDefaultBlocked,
    true
  );
  assert.equal(
    checkpoint.cleanupToolkitBaselineEvidence.cleanupToolsInstalledByPhase539,
    false
  );
  assert.equal(checkpoint.cleanupToolkitBaselineEvidence.fallowRuntimeUsed, false);
  assertAllFalse(checkpoint.runtimeEffect);
});

test("Phase 5.39 rejected metadata fails closed before checkpoint", () => {
  const result = createResult([
    metadataWith({ commandExposurePermissionGranted: true })
  ]);

  assert.equal(
    result.classification,
    "command_exposure_looking_review_only_inspection_handoff_checkpoint_input_rejected"
  );
  assert.equal(result.inspectionHandoffMetadataAccepted, false);
  assert.equal(result.inspectionHandoffCheckpointProduced, false);
  assert.equal(result.inspectionHandoffCheckpoint, null);
  assert.equal(result.approvalDecisionProduced, false);
  assert.equal(result.approvalGrantProduced, false);
  assert.equal(result.runtimeCommandExposureEnabled, false);
  assert.equal(result.runtimeExecutionEnabled, false);
  assertAllFalse(result.runtimeEffect);
});

test("Phase 5.39 fixture mirrors checkpoint cases and blocks authorization", async () => {
  const fixture = JSON.parse(await readFile(fixtureUrl, "utf8"));

  assert.deepEqual(
    fixture.inspectionHandoffCheckpointCases.map(({ caseId }) => caseId),
    expectedCaseIds
  );
  for (const checkpointCase of fixture.inspectionHandoffCheckpointCases) {
    assert.equal(checkpointCase.approvalGrant.produced, false);
    assert.equal(checkpointCase.approvalGrant.persisted, false);
    assert.equal(checkpointCase.approvalGrant.grantId, null);
    assert.equal(checkpointCase.reviewerRoutingPerformed, false);
    assert.equal(checkpointCase.reviewerAssignmentPerformed, false);
    assert.equal(checkpointCase.evaluatorExecuted, false);
    assert.equal(checkpointCase.evaluatorResultProduced, false);
    assert.equal(checkpointCase.approvalDecisionProduced, false);
    assert.equal(checkpointCase.approvalGrantProduced, false);
    assert.equal(checkpointCase.runtimePermissionGranted, false);
    assert.equal(checkpointCase.commandExposurePermissionGranted, false);
    assertAllFalse(checkpointCase.runtimeEffect);
  }
  assertAllFalse(fixture.blockedRuntimeEffect);
  assert.equal(fixture.serveRuntimeBlockedBehavior.defaultBlocked, true);
  assert.equal(fixture.serveRuntimeBlockedBehavior.dryRunBlocked, true);
  assert.equal(fixture.serveRuntimeBlockedBehavior.dryRunBypassesBlock, false);
  assert.equal(fixture.serveRuntimeBlockedBehavior.stdout, "");
  assert.deepEqual(fixture.inspectionHandoffCheckpointResultShape, {
    ...expectedFixture().inspectionHandoffCheckpointResultShape
  });
});

test("serve-runtime remains default-blocked and dry-run cannot bypass Phase 5.39", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-39-runtime-"));

  try {
    for (const args of [["serve-runtime"], ["serve-runtime", "--dry-run"]]) {
      const failure = await runCliFailure(args, { cwd: scratch });

      assert.notEqual(failure.code, 0, args.join(" "));
      assert.equal(failure.stdout, "");
      assert.match(failure.stderr, /runtime unavailable/i);
      assert.doesNotMatch(failure.stderr, /stack|secret|process\.env/i);
      assert.deepEqual(await readdir(scratch), []);
    }
  } finally {
    await rm(scratch, { recursive: true, force: true });
  }
});

test("Phase 5.39 inspection handoff checkpoint command names remain rejected", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-39-commands-"));

  try {
    for (const command of checkpointCommandProbes) {
      const failure = await runCliFailure([command], { cwd: scratch });

      assert.notEqual(failure.code, 0, command);
      assert.equal(failure.stdout, "", command);
      assert.match(failure.stderr, /^Usage: ardyn /, command);
      assert.doesNotMatch(failure.stderr, /stack|secret|process\.env/i, command);
      assert.deepEqual(await readdir(scratch), [], command);
    }
  } finally {
    await rm(scratch, { recursive: true, force: true });
  }
});

test("Phase 5.39 does not change CLI or Rust runtime source", async () => {
  const currentCliSource = await readFile(cliSourceUrl, "utf8");
  const currentRustLibSource = await readFile(rustLibSourceUrl, "utf8");
  const currentRustStdioSource = await readFile(rustStdioSourceUrl, "utf8");
  const { stdout: baselineCliSource } = await execFileAsync("git", [
    "show",
    `${phase539BaselineCommit}:apps/cli/src/index.mjs`
  ], {
    cwd: repoRoot,
    maxBuffer: 1024 * 1024
  });
  const { stdout: baselineRustLibSource } = await execFileAsync("git", [
    "show",
    `${phase539BaselineCommit}:crates/ardyn-host/src/lib.rs`
  ], {
    cwd: repoRoot,
    maxBuffer: 1024 * 1024
  });
  const { stdout: baselineRustStdioSource } = await execFileAsync("git", [
    "show",
    `${phase539BaselineCommit}:crates/ardyn-host/src/stdio_runtime/mod.rs`
  ], {
    cwd: repoRoot,
    maxBuffer: 1024 * 1024
  });

  assert.equal(currentCliSource, baselineCliSource);
  assert.equal(currentRustLibSource, baselineRustLibSource);
  assert.equal(currentRustStdioSource, baselineRustStdioSource);
  assert.doesNotMatch(
    currentCliSource,
    /createReviewOnlyInspectionHandoffCheckpointForReview/
  );
  assert.doesNotMatch(currentCliSource, /inspection-handoff-checkpoint/);
});
