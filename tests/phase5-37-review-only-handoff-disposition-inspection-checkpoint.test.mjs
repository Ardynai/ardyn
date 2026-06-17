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
  REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_SCHEMA,
  createReviewOnlyHandoffDispositionInspectionCheckpointForReview
} from "../packages/core/src/index.mjs";

const execFileAsync = promisify(execFile);
const phase537BaselineCommit = "03ccd8d30f5cff78c4fda750012bd7a5764b5752";
const reviewedAt = "2026-06-17T00:00:00.000Z";
const repoRootUrl = new URL("../", import.meta.url);
const repoRoot = fileURLToPath(repoRootUrl);
const cliSourceUrl = new URL("../apps/cli/src/index.mjs", import.meta.url);
const cliPath = fileURLToPath(cliSourceUrl);
const phase536FixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-36/review-only-readiness-handoff-disposition-boundary.json",
  import.meta.url
);
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-37/review-only-handoff-disposition-inspection-checkpoint.json",
  import.meta.url
);
const phase536Fixture = JSON.parse(
  readFileSync(fileURLToPath(phase536FixtureUrl), "utf8")
);

const expectedTopLevelKeys = Object.freeze([
  "schema",
  "schemaVersion",
  "phase",
  "checkpointKind",
  "metadataGeneratedAt",
  "sourcePhase",
  "handoffDispositionInspectionCheckpointSummary",
  "handoffDispositionInspectionCheckpointInputShape",
  "handoffDispositionInspectionCheckpointResultShape",
  "handoffDispositionInspectionCheckpointCases",
  "handoffDispositionInspectionCheckpoint",
  "blockedRuntimeEffect",
  "serveRuntimeBlockedBehavior",
  "forbiddenBehavior",
  "filesAllowedToChange",
  "filesForbiddenToChange",
  "validationCommands"
]);

const expectedCaseIds = Object.freeze([
  "missing-review-only-handoff-disposition-inspection-checkpoint-input-rejected",
  "malformed-review-only-handoff-disposition-inspection-checkpoint-input-rejected",
  "malformed-review-only-handoff-disposition-inspection-checkpoint-invalid-reviewed-at-rejected",
  "empty-review-only-handoff-disposition-inspection-checkpoint-input-rejected",
  "conflicting-review-only-handoff-disposition-inspection-checkpoint-input-rejected",
  "stale-review-only-handoff-disposition-inspection-checkpoint-input-rejected",
  "revoked-review-only-handoff-disposition-inspection-checkpoint-input-rejected",
  "unknown-review-only-handoff-disposition-inspection-checkpoint-input-rejected",
  "duplicate-invalid-review-only-handoff-disposition-inspection-checkpoint-input-rejected",
  "authorizing-looking-review-only-handoff-disposition-inspection-checkpoint-input-rejected",
  "grant-looking-review-only-handoff-disposition-inspection-checkpoint-input-rejected",
  "approval-decision-looking-review-only-handoff-disposition-inspection-checkpoint-input-rejected",
  "approval-grant-looking-review-only-handoff-disposition-inspection-checkpoint-input-rejected",
  "evaluator-result-looking-review-only-handoff-disposition-inspection-checkpoint-input-rejected",
  "evaluator-execution-looking-review-only-handoff-disposition-inspection-checkpoint-input-rejected",
  "reviewer-routing-looking-review-only-handoff-disposition-inspection-checkpoint-input-rejected",
  "reviewer-assignment-looking-review-only-handoff-disposition-inspection-checkpoint-input-rejected",
  "runtime-permission-looking-review-only-handoff-disposition-inspection-checkpoint-input-rejected",
  "command-exposure-looking-review-only-handoff-disposition-inspection-checkpoint-input-rejected",
  "runtime-effect-true-review-only-handoff-disposition-inspection-checkpoint-input-rejected",
  "process-flag-true-review-only-handoff-disposition-inspection-checkpoint-input-rejected",
  "unsafe-top-level-review-only-handoff-disposition-inspection-checkpoint-input-rejected",
  "unsafe-nested-handoff-disposition-inspection-checkpoint-data-review-only-handoff-disposition-inspection-checkpoint-input-rejected",
  "execution-signal-looking-review-only-handoff-disposition-inspection-checkpoint-input-rejected",
  "valid-review-only-handoff-disposition-inspection-checkpoint"
]);

const expectedClassifications = Object.freeze({
  "missing-review-only-handoff-disposition-inspection-checkpoint-input-rejected":
    "missing_review_only_handoff_disposition_inspection_checkpoint_input_rejected",
  "malformed-review-only-handoff-disposition-inspection-checkpoint-input-rejected":
    "malformed_review_only_handoff_disposition_inspection_checkpoint_input_rejected",
  "malformed-review-only-handoff-disposition-inspection-checkpoint-invalid-reviewed-at-rejected":
    "malformed_review_only_handoff_disposition_inspection_checkpoint_input_rejected",
  "empty-review-only-handoff-disposition-inspection-checkpoint-input-rejected":
    "empty_review_only_handoff_disposition_inspection_checkpoint_input_rejected",
  "conflicting-review-only-handoff-disposition-inspection-checkpoint-input-rejected":
    "conflicting_review_only_handoff_disposition_inspection_checkpoint_input_rejected",
  "stale-review-only-handoff-disposition-inspection-checkpoint-input-rejected":
    "stale_review_only_handoff_disposition_inspection_checkpoint_input_rejected",
  "revoked-review-only-handoff-disposition-inspection-checkpoint-input-rejected":
    "revoked_review_only_handoff_disposition_inspection_checkpoint_input_rejected",
  "unknown-review-only-handoff-disposition-inspection-checkpoint-input-rejected":
    "unknown_review_only_handoff_disposition_inspection_checkpoint_input_rejected",
  "duplicate-invalid-review-only-handoff-disposition-inspection-checkpoint-input-rejected":
    "duplicate_invalid_review_only_handoff_disposition_inspection_checkpoint_input_rejected",
  "authorizing-looking-review-only-handoff-disposition-inspection-checkpoint-input-rejected":
    "authorizing_review_only_handoff_disposition_inspection_checkpoint_input_rejected",
  "grant-looking-review-only-handoff-disposition-inspection-checkpoint-input-rejected":
    "grant_looking_review_only_handoff_disposition_inspection_checkpoint_input_rejected",
  "approval-decision-looking-review-only-handoff-disposition-inspection-checkpoint-input-rejected":
    "approval_decision_looking_review_only_handoff_disposition_inspection_checkpoint_input_rejected",
  "approval-grant-looking-review-only-handoff-disposition-inspection-checkpoint-input-rejected":
    "approval_grant_looking_review_only_handoff_disposition_inspection_checkpoint_input_rejected",
  "evaluator-result-looking-review-only-handoff-disposition-inspection-checkpoint-input-rejected":
    "evaluator_result_looking_review_only_handoff_disposition_inspection_checkpoint_input_rejected",
  "evaluator-execution-looking-review-only-handoff-disposition-inspection-checkpoint-input-rejected":
    "evaluator_execution_looking_review_only_handoff_disposition_inspection_checkpoint_input_rejected",
  "reviewer-routing-looking-review-only-handoff-disposition-inspection-checkpoint-input-rejected":
    "reviewer_routing_looking_review_only_handoff_disposition_inspection_checkpoint_input_rejected",
  "reviewer-assignment-looking-review-only-handoff-disposition-inspection-checkpoint-input-rejected":
    "reviewer_assignment_looking_review_only_handoff_disposition_inspection_checkpoint_input_rejected",
  "runtime-permission-looking-review-only-handoff-disposition-inspection-checkpoint-input-rejected":
    "runtime_permission_looking_review_only_handoff_disposition_inspection_checkpoint_input_rejected",
  "command-exposure-looking-review-only-handoff-disposition-inspection-checkpoint-input-rejected":
    "command_exposure_looking_review_only_handoff_disposition_inspection_checkpoint_input_rejected",
  "runtime-effect-true-review-only-handoff-disposition-inspection-checkpoint-input-rejected":
    "runtime_effect_true_review_only_handoff_disposition_inspection_checkpoint_input_rejected",
  "process-flag-true-review-only-handoff-disposition-inspection-checkpoint-input-rejected":
    "process_flag_true_review_only_handoff_disposition_inspection_checkpoint_input_rejected",
  "unsafe-top-level-review-only-handoff-disposition-inspection-checkpoint-input-rejected":
    "unsafe_review_only_handoff_disposition_inspection_checkpoint_input_rejected",
  "unsafe-nested-handoff-disposition-inspection-checkpoint-data-review-only-handoff-disposition-inspection-checkpoint-input-rejected":
    "unsafe_review_only_handoff_disposition_inspection_checkpoint_input_rejected",
  "execution-signal-looking-review-only-handoff-disposition-inspection-checkpoint-input-rejected":
    "execution_signal_looking_review_only_handoff_disposition_inspection_checkpoint_input_rejected",
  "valid-review-only-handoff-disposition-inspection-checkpoint":
    "valid_review_only_handoff_disposition_inspection_checkpoint_runtime_still_blocked"
});

const checkpointCommandProbes = Object.freeze([
  "review-only-handoff-disposition-inspection-checkpoint",
  "create-review-only-handoff-disposition-inspection-checkpoint",
  "handoff-disposition-inspection-checkpoint",
  "phase-5-37-review-only-handoff-disposition-inspection-checkpoint",
  "reviewer-routing",
  "reviewer-assignment",
  "serve-runtime"
]);

const expectedCheckpointSummary = Object.freeze({
  reviewOnlyHandoffDispositionInspectionCheckpointRecorded: true,
  checkpointKind: "review-only-handoff-disposition-inspection-checkpoint",
  checkpointReviewOnly: true,
  checkpointAuthoritative: false,
  validReadinessHandoffDispositionProducesInspectionCheckpoint: true,
  missingReadinessHandoffDispositionRejected: true,
  malformedReadinessHandoffDispositionRejected: true,
  emptyReadinessHandoffDispositionRejected: true,
  conflictingReadinessHandoffDispositionRejected: true,
  staleReadinessHandoffDispositionRejected: true,
  revokedReadinessHandoffDispositionRejected: true,
  unknownReadinessHandoffDispositionRejected: true,
  duplicateInvalidReadinessHandoffDispositionRejected: true,
  authorizingLookingReadinessHandoffDispositionRejected: true,
  grantLookingReadinessHandoffDispositionRejected: true,
  approvalDecisionLookingReadinessHandoffDispositionRejected: true,
  approvalGrantLookingReadinessHandoffDispositionRejected: true,
  evaluatorResultLookingReadinessHandoffDispositionRejected: true,
  evaluatorExecutionLookingReadinessHandoffDispositionRejected: true,
  reviewerRoutingLookingReadinessHandoffDispositionRejected: true,
  reviewerAssignmentLookingReadinessHandoffDispositionRejected: true,
  runtimePermissionLookingReadinessHandoffDispositionRejected: true,
  commandExposureLookingReadinessHandoffDispositionRejected: true,
  runtimeEffectTrueReadinessHandoffDispositionRejected: true,
  processFlagTrueReadinessHandoffDispositionRejected: true,
  unsafeReadinessHandoffDispositionRejected: true,
  executionSignalLookingReadinessHandoffDispositionRejected: true,
  handoffDispositionInspectionCheckpointIsReviewerRouting: false,
  handoffDispositionInspectionCheckpointIsReviewerAssignment: false,
  handoffDispositionInspectionCheckpointIsEvaluatorExecution: false,
  handoffDispositionInspectionCheckpointIsEvaluatorResult: false,
  handoffDispositionInspectionCheckpointIsApprovalDecision: false,
  handoffDispositionInspectionCheckpointIsApprovalGrant: false,
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
  serveRuntimeStillDefaultBlocked: true,
  dryRunBypassesBlock: false,
  canEnableRuntime: false
});

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function validReadinessHandoffDisposition(label = "source-valid") {
  const disposition = clone(phase536Fixture.readinessHandoffDisposition);
  disposition.reviewedAt = reviewedAt;
  disposition.sourceLabel = undefined;
  delete disposition.sourceLabel;
  disposition.testLabel = label;
  delete disposition.testLabel;
  return disposition;
}

function dispositionWith(label, overrides = {}) {
  return {
    ...validReadinessHandoffDisposition(label),
    ...overrides
  };
}

function dispositionWithNested(label, objectKey, nestedKey, overrides = {}) {
  const disposition = validReadinessHandoffDisposition(label);
  disposition[objectKey] = {
    ...disposition[objectKey],
    [nestedKey]: {
      ...(disposition[objectKey]?.[nestedKey] ?? {}),
      ...overrides
    }
  };
  return disposition;
}

function caseFromResult(caseId, result) {
  return {
    caseId,
    classification: result.classification,
    reviewOnly: result.reviewOnly,
    authoritative: result.authoritative,
    reviewArtifactOnly: result.reviewArtifactOnly,
    handoffDispositionInspectionCheckpointProduced:
      result.handoffDispositionInspectionCheckpointProduced,
    handoffDispositionInspectionCheckpointIsReviewerRouting:
      result.handoffDispositionInspectionCheckpointIsReviewerRouting,
    handoffDispositionInspectionCheckpointIsReviewerAssignment:
      result.handoffDispositionInspectionCheckpointIsReviewerAssignment,
    handoffDispositionInspectionCheckpointIsEvaluatorExecution:
      result.handoffDispositionInspectionCheckpointIsEvaluatorExecution,
    handoffDispositionInspectionCheckpointIsEvaluatorResult:
      result.handoffDispositionInspectionCheckpointIsEvaluatorResult,
    handoffDispositionInspectionCheckpointIsApprovalDecision:
      result.handoffDispositionInspectionCheckpointIsApprovalDecision,
    handoffDispositionInspectionCheckpointIsApprovalGrant:
      result.handoffDispositionInspectionCheckpointIsApprovalGrant,
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

function rejectedCheckpointCase(caseId, readinessHandoffDispositions) {
  const result = createReviewOnlyHandoffDispositionInspectionCheckpointForReview({
    reviewedAt,
    readinessHandoffDispositions
  });
  return caseFromResult(caseId, result);
}

function inputShapeCheckpointCases(duplicateDisposition) {
  return [
    caseFromResult(
      "missing-review-only-handoff-disposition-inspection-checkpoint-input-rejected",
      createReviewOnlyHandoffDispositionInspectionCheckpointForReview({ reviewedAt })
    ),
    caseFromResult(
      "malformed-review-only-handoff-disposition-inspection-checkpoint-input-rejected",
      createReviewOnlyHandoffDispositionInspectionCheckpointForReview(null)
    ),
    caseFromResult(
      "malformed-review-only-handoff-disposition-inspection-checkpoint-invalid-reviewed-at-rejected",
      createReviewOnlyHandoffDispositionInspectionCheckpointForReview({
        reviewedAt: "not-a-date",
        readinessHandoffDispositions: [validReadinessHandoffDisposition()]
      })
    ),
    rejectedCheckpointCase(
      "empty-review-only-handoff-disposition-inspection-checkpoint-input-rejected",
      []
    ),
    rejectedCheckpointCase(
      "conflicting-review-only-handoff-disposition-inspection-checkpoint-input-rejected",
      [
        validReadinessHandoffDisposition("source-conflict-a"),
        dispositionWith("source-conflict-b", {
          reviewedAt: "2026-06-17T00:00:01.000Z"
        })
      ]
    ),
    rejectedCheckpointCase(
      "stale-review-only-handoff-disposition-inspection-checkpoint-input-rejected",
      [
        dispositionWith("source-stale", {
          reviewedAt: "2026-06-16T00:00:00.000Z"
        })
      ]
    ),
    rejectedCheckpointCase(
      "revoked-review-only-handoff-disposition-inspection-checkpoint-input-rejected",
      [dispositionWith("source-revoked", { revoked: true })]
    ),
    rejectedCheckpointCase(
      "unknown-review-only-handoff-disposition-inspection-checkpoint-input-rejected",
      [
        dispositionWith("source-unknown", {
          schema:
            "ardyn.phase-5.36.unknown-readiness-handoff-disposition-state",
          stateKind: "unknown-readiness-handoff-disposition-state"
        })
      ]
    ),
    rejectedCheckpointCase(
      "duplicate-invalid-review-only-handoff-disposition-inspection-checkpoint-input-rejected",
      [duplicateDisposition, clone(duplicateDisposition)]
    )
  ];
}

function authorizationCheckpointCases() {
  return [
    rejectedCheckpointCase(
      "authorizing-looking-review-only-handoff-disposition-inspection-checkpoint-input-rejected",
      [dispositionWith("source-authorizing", { authoritative: true })]
    ),
    rejectedCheckpointCase(
      "grant-looking-review-only-handoff-disposition-inspection-checkpoint-input-rejected",
      [dispositionWith("source-grant", { grantProduced: true })]
    ),
    rejectedCheckpointCase(
      "approval-decision-looking-review-only-handoff-disposition-inspection-checkpoint-input-rejected",
      [dispositionWith("source-approval-decision", { approvalDecisionProduced: true })]
    ),
    rejectedCheckpointCase(
      "approval-grant-looking-review-only-handoff-disposition-inspection-checkpoint-input-rejected",
      [dispositionWith("source-approval-grant", { approvalGrantProduced: true })]
    ),
    rejectedCheckpointCase(
      "evaluator-result-looking-review-only-handoff-disposition-inspection-checkpoint-input-rejected",
      [dispositionWith("source-evaluator-result", { evaluatorResultProduced: true })]
    ),
    rejectedCheckpointCase(
      "evaluator-execution-looking-review-only-handoff-disposition-inspection-checkpoint-input-rejected",
      [
        dispositionWith("source-evaluator-execution", {
          evaluatorExecutionRequested: true
        })
      ]
    ),
    rejectedCheckpointCase(
      "reviewer-routing-looking-review-only-handoff-disposition-inspection-checkpoint-input-rejected",
      [dispositionWith("source-reviewer-routing", { reviewerRouting: { queue: "ops" } })]
    ),
    rejectedCheckpointCase(
      "reviewer-assignment-looking-review-only-handoff-disposition-inspection-checkpoint-input-rejected",
      [
        dispositionWith("source-reviewer-assignment", {
          reviewerAssignment: { reviewerId: "human-reviewer-1" }
        })
      ]
    ),
    rejectedCheckpointCase(
      "runtime-permission-looking-review-only-handoff-disposition-inspection-checkpoint-input-rejected",
      [dispositionWith("source-runtime-permission", { runtimePermissionGranted: true })]
    ),
    rejectedCheckpointCase(
      "command-exposure-looking-review-only-handoff-disposition-inspection-checkpoint-input-rejected",
      [
        dispositionWith("source-command-exposure", {
          commandExposurePermissionGranted: true
        })
      ]
    ),
    rejectedCheckpointCase(
      "runtime-effect-true-review-only-handoff-disposition-inspection-checkpoint-input-rejected",
      [
        dispositionWithNested(
          "source-runtime-effect",
          "runtimeEffect",
          "runtime-effect-nested",
          { runtimeEnabled: true }
        )
      ]
    ),
    rejectedCheckpointCase(
      "process-flag-true-review-only-handoff-disposition-inspection-checkpoint-input-rejected",
      [dispositionWith("source-process", { processSpawnEnabled: true })]
    ),
    rejectedCheckpointCase(
      "unsafe-top-level-review-only-handoff-disposition-inspection-checkpoint-input-rejected",
      [dispositionWith("source-unsafe", { externalSourceLookupEnabled: true })]
    ),
    rejectedCheckpointCase(
      "unsafe-nested-handoff-disposition-inspection-checkpoint-data-review-only-handoff-disposition-inspection-checkpoint-input-rejected",
      [
        dispositionWith("source-unsafe-nested", {
          handoffDispositionInspectionCheckpoint: {
            envSecretsReaderEnabled: true
          }
        })
      ]
    ),
    rejectedCheckpointCase(
      "execution-signal-looking-review-only-handoff-disposition-inspection-checkpoint-input-rejected",
      [dispositionWith("source-execution-signal", { executionSignal: true })]
    )
  ];
}

function checkpointCases() {
  const duplicateDisposition = validReadinessHandoffDisposition("source-duplicate");

  return [
    ...inputShapeCheckpointCases(duplicateDisposition),
    ...authorizationCheckpointCases(),
    caseFromResult(
      "valid-review-only-handoff-disposition-inspection-checkpoint",
      createReviewOnlyHandoffDispositionInspectionCheckpointForReview({
        reviewedAt,
        readinessHandoffDispositions: [
          validReadinessHandoffDisposition("source-valid-handoff-disposition")
        ]
      })
    )
  ];
}

function validCheckpointResult() {
  return createReviewOnlyHandoffDispositionInspectionCheckpointForReview({
    reviewedAt,
    readinessHandoffDispositions: [
      validReadinessHandoffDisposition("source-valid-handoff-disposition")
    ]
  });
}

function assertAllRuntimeEffectFalse(runtimeEffect, label = "runtimeEffect") {
  for (const [field, value] of Object.entries(runtimeEffect)) {
    assert.equal(value, false, `${label}.${field}`);
  }
}

function assertBlockedGrant(approvalGrant, label = "approvalGrant") {
  assert.deepEqual(approvalGrant, {
    produced: false,
    persisted: false,
    grantId: null,
    schema: "ardyn.runtime-approval-grant",
    schemaVersion: "not-implemented"
  }, label);
}

function assertNonAuthorizingCheckpoint(result, label = "checkpoint") {
  assert.equal(result.reviewOnly, true, label);
  assert.equal(result.authoritative, false, label);
  assert.equal(result.reviewArtifactOnly, true, label);
  assert.equal(result.handoffDispositionInspectionCheckpointIsReviewerRouting, false, label);
  assert.equal(result.handoffDispositionInspectionCheckpointIsReviewerAssignment, false, label);
  assert.equal(result.handoffDispositionInspectionCheckpointIsEvaluatorExecution, false, label);
  assert.equal(result.handoffDispositionInspectionCheckpointIsEvaluatorResult, false, label);
  assert.equal(result.handoffDispositionInspectionCheckpointIsApprovalDecision, false, label);
  assert.equal(result.handoffDispositionInspectionCheckpointIsApprovalGrant, false, label);
  assert.equal(result.reviewerRoutingPerformed, false, label);
  assert.equal(result.reviewerAssignmentPerformed, false, label);
  assert.equal(result.evaluatorResultProduced, false, label);
  assert.equal(result.evaluatorResultPersisted, false, label);
  assert.equal(result.approvalDecisionProduced, false, label);
  assert.equal(result.approvalDecisionPersisted, false, label);
  assert.equal(result.approvalGrantProduced, false, label);
  assert.equal(result.approvalGrantPersisted, false, label);
  assert.equal(result.runtimePermissionGranted, false, label);
  assert.equal(result.commandExposurePermissionGranted, false, label);
  assert.equal(result.runtimeCommandExposureEnabled, false, label);
  assert.equal(result.runtimeExecutionEnabled, false, label);
  assert.equal(result.evaluatorExecuted, false, label);
  assertBlockedGrant(result.approvalGrant, `${label}.approvalGrant`);
  assertAllRuntimeEffectFalse(result.runtimeEffect, `${label}.runtimeEffect`);
}

function expectedFixture() {
  const validResult = validCheckpointResult();
  return {
    schema: REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_SCHEMA,
    schemaVersion: "0.1.0",
    phase: "phase-5.37-review-only-handoff-disposition-inspection-checkpoint",
    checkpointKind: "review-only-handoff-disposition-inspection-checkpoint",
    metadataGeneratedAt: reviewedAt,
    sourcePhase: {
      phase: "phase-5.36-review-only-readiness-handoff-disposition-boundary",
      readinessHandoffDispositionPath:
        "packages/core/src/index.mjs#createReviewOnlyReadinessHandoffDispositionBoundaryForReview",
      handoffDispositionInspectionCheckpointPath:
        "packages/core/src/index.mjs#createReviewOnlyHandoffDispositionInspectionCheckpointForReview",
      sourceReadinessHandoffDispositionFixture:
        "tests/fixtures/host-policy/phase5-36/review-only-readiness-handoff-disposition-boundary.json",
      runtimeEnabled: false,
      reviewerRoutingPerformed: false,
      reviewerAssignmentPerformed: false,
      approvalDecisionProduced: false,
      approvalGrantProduced: false,
      evaluatorExecutionPerformed: false
    },
    handoffDispositionInspectionCheckpointSummary: expectedCheckpointSummary,
    handoffDispositionInspectionCheckpointInputShape: {
      readinessHandoffDispositions:
        "exactly one Phase 5.36 review-only readiness handoff/disposition state",
      readinessHandoffDispositionSchema:
        "ardyn.phase-5.36.review-only-readiness-handoff-disposition-state",
      readinessHandoffDispositionMode: "review-only",
      validReadinessHandoffDispositionRequired: true,
      authorizingLookingDispositionPolicy: "fail-closed",
      grantLookingDispositionPolicy: "fail-closed",
      reviewerRoutingLookingDispositionPolicy: "fail-closed",
      reviewerAssignmentLookingDispositionPolicy: "fail-closed",
      evaluatorExecutionLookingDispositionPolicy: "fail-closed",
      runtimeEffectTrueDispositionPolicy: "fail-closed",
      processFlagTrueDispositionPolicy: "fail-closed",
      unsafeTopLevelDispositionPolicy: "fail-closed",
      unsafeNestedHandoffDispositionInspectionCheckpointDataPolicy: "fail-closed",
      executionSignalLookingDispositionPolicy: "fail-closed",
      filesystemWatcherAllowed: false,
      externalSourceLookupAllowed: false,
      secretsEnvIngestionAllowed: false,
      filePathAllowed: false,
      urlAllowed: false
    },
    handoffDispositionInspectionCheckpointResultShape: {
      schema:
        "ardyn.phase-5.37.review-only-handoff-disposition-inspection-checkpoint-result",
      schemaVersion: "0.1.0",
      checkpointKind: "review-only-handoff-disposition-inspection-checkpoint",
      checkpointMode: "review-only",
      stateSchema:
        "ardyn.phase-5.37.review-only-handoff-disposition-inspection-checkpoint-state",
      stateKind: "review-only-handoff-disposition-inspection-checkpoint-state",
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
    handoffDispositionInspectionCheckpointCases: checkpointCases(),
    handoffDispositionInspectionCheckpoint:
      validResult.handoffDispositionInspectionCheckpoint,
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
      "README.md",
      "apps/cli/README.md",
      "crates/ardyn-host/README.md",
      "docs/phase-5-36-review-only-readiness-handoff-disposition-boundary.md",
      "docs/phase-5-37-review-only-handoff-disposition-inspection-checkpoint.md",
      "packages/core/src/index.mjs",
      "packages/core/src/index.d.ts",
      "scripts/report-phase-status.mjs",
      "tests/fixtures/host-policy/phase5-37/review-only-handoff-disposition-inspection-checkpoint.json",
      "tests/phase5-37-review-only-handoff-disposition-inspection-checkpoint.test.mjs",
      "tests/report-phase-status.test.mjs"
    ],
    filesForbiddenToChange: [
      "apps/cli/src/index.mjs",
      "crates/ardyn-host/src/lib.rs",
      "crates/ardyn-host/src/stdio_runtime.rs"
    ],
    validationCommands: [
      "node --test tests/phase5-37-review-only-handoff-disposition-inspection-checkpoint.test.mjs",
      "node --test tests/report-phase-status.test.mjs",
      "npm test",
      "npm run test:schemas",
      "npm run report:phase-status",
      "cargo test --workspace",
      "cargo check --workspace",
      "cargo fmt --check",
      "git diff --check",
      "git diff --cached --check",
      "fallow health --score --hotspots --targets --format json",
      "fallow audit --format json"
    ]
  };
}

async function runCliFailure(args, options = {}) {
  return execFileAsync(process.execPath, [cliPath, ...args], {
    cwd: options.cwd ?? repoRoot,
    encoding: "utf8"
  }).then(
    (result) => {
      assert.fail(`Expected ardyn ${args.join(" ")} to fail, got stdout: ${result.stdout}`);
    },
    (error) => {
      if (typeof error.code !== "number" || error.stdout === undefined || error.stderr === undefined) {
        throw error;
      }

      return {
        code: error.code,
        stdout: error.stdout,
        stderr: error.stderr
      };
    }
  );
}

test("Phase 5.37 handoff disposition inspection checkpoint fixture is deterministic metadata", async () => {
  const text = await readFile(fixtureUrl, "utf8");
  const fixture = JSON.parse(text);

  assert.equal(text.endsWith("\n"), true);
  assert.equal(text.includes("\r"), false);
  assert.deepEqual(Object.keys(fixture), expectedTopLevelKeys);
  assert.deepEqual(fixture, expectedFixture());
});

test("Phase 5.37 handoff disposition inspection checkpoint classifies handoff disposition cases", () => {
  const cases = checkpointCases();
  assert.deepEqual(cases.map(({ caseId }) => caseId), expectedCaseIds);

  for (const checkpointCase of cases) {
    assert.equal(
      checkpointCase.classification,
      expectedClassifications[checkpointCase.caseId],
      checkpointCase.caseId
    );
    assertNonAuthorizingCheckpoint(checkpointCase, checkpointCase.caseId);
    if (checkpointCase.caseId === "valid-review-only-handoff-disposition-inspection-checkpoint") {
      assert.equal(checkpointCase.handoffDispositionInspectionCheckpointProduced, true);
    } else {
      assert.equal(checkpointCase.handoffDispositionInspectionCheckpointProduced, false);
    }
  }
});

test("Phase 5.37 malformed checkpoint input fails closed without throwing", () => {
  for (const input of [null, undefined, "bad", 42, true]) {
    const result = createReviewOnlyHandoffDispositionInspectionCheckpointForReview(input);
    assert.equal(
      result.classification,
      input === undefined
        ? "missing_review_only_handoff_disposition_inspection_checkpoint_input_rejected"
        : "malformed_review_only_handoff_disposition_inspection_checkpoint_input_rejected"
    );
    assert.equal(result.handoffDispositionInspectionCheckpointProduced, false);
    assert.equal(result.handoffDispositionInspectionCheckpoint, null);
    assertNonAuthorizingCheckpoint(result, "malformed input");
  }
});

test("Phase 5.37 valid handoff disposition produces only inspection checkpoint metadata", () => {
  const result = validCheckpointResult();
  const checkpoint = result.handoffDispositionInspectionCheckpoint;

  assert.equal(
    result.classification,
    "valid_review_only_handoff_disposition_inspection_checkpoint_runtime_still_blocked"
  );
  assert.equal(result.readinessHandoffDispositionAccepted, true);
  assert.equal(result.handoffDispositionInspectionCheckpointProduced, true);
  assert.equal(checkpoint.schema, "ardyn.phase-5.37.review-only-handoff-disposition-inspection-checkpoint-state");
  assert.equal(checkpoint.stateKind, "review-only-handoff-disposition-inspection-checkpoint-state");
  assert.equal(checkpoint.stateMode, "review-only");
  assert.equal(checkpoint.readinessHandoffDispositionAccepted, true);
  assert.equal(checkpoint.handoffDispositionInspectionCheckpointMetadataOnly, true);
  assert.equal(checkpoint.sourceReadinessHandoffDisposition.schema, "ardyn.phase-5.36.review-only-readiness-handoff-disposition-state");
  assert.equal(checkpoint.sourceReadinessHandoffDisposition.readinessHandoffDispositionMetadataOnly, true);
  assert.equal(checkpoint.handoffDispositionInspectionCheckpointIsReviewerRouting, false);
  assert.equal(checkpoint.handoffDispositionInspectionCheckpointIsReviewerAssignment, false);
  assert.equal(checkpoint.handoffDispositionInspectionCheckpointIsEvaluatorExecution, false);
  assert.equal(checkpoint.handoffDispositionInspectionCheckpointIsEvaluatorResult, false);
  assert.equal(checkpoint.handoffDispositionInspectionCheckpointIsApprovalDecision, false);
  assert.equal(checkpoint.handoffDispositionInspectionCheckpointIsApprovalGrant, false);
  assert.equal(checkpoint.approvalGrantProduced, false);
  assert.equal(checkpoint.approvalGrantPersisted, false);
  assert.equal(checkpoint.runtimePermissionGranted, false);
  assert.equal(checkpoint.commandExposurePermissionGranted, false);
  assert.equal(checkpoint.runtimeCommandExposureEnabled, false);
  assert.equal(checkpoint.runtimeExecutionEnabled, false);
  assert.equal(checkpoint.evaluatorExecuted, false);
  assertAllRuntimeEffectFalse(checkpoint.runtimeEffect, "checkpoint.runtimeEffect");
  assertNonAuthorizingCheckpoint(result, "valid result");
});

test("Phase 5.37 rejected handoff disposition fails closed before checkpoint", () => {
  const result = createReviewOnlyHandoffDispositionInspectionCheckpointForReview({
    reviewedAt,
    readinessHandoffDispositions: [
      dispositionWith("source-approval-decision", {
        approvalDecisionProduced: true
      })
    ]
  });

  assert.equal(
    result.classification,
    "approval_decision_looking_review_only_handoff_disposition_inspection_checkpoint_input_rejected"
  );
  assert.equal(result.readinessHandoffDispositionAccepted, false);
  assert.equal(result.handoffDispositionInspectionCheckpointProduced, false);
  assert.equal(result.handoffDispositionInspectionCheckpoint, null);
  assert.equal(result.readinessHandoffDispositionSummary, null);
  assertNonAuthorizingCheckpoint(result, "rejected result");
});

test("Phase 5.37 fixture mirrors checkpoint cases and blocks authorization", async () => {
  const fixture = JSON.parse(await readFile(fixtureUrl, "utf8"));

  assert.deepEqual(
    fixture.handoffDispositionInspectionCheckpointCases.map(({ caseId }) => caseId),
    expectedCaseIds
  );
  for (const checkpointCase of fixture.handoffDispositionInspectionCheckpointCases) {
    assert.equal(
      checkpointCase.classification,
      expectedClassifications[checkpointCase.caseId],
      checkpointCase.caseId
    );
    assertNonAuthorizingCheckpoint(checkpointCase, checkpointCase.caseId);
  }

  assert.deepEqual(fixture.handoffDispositionInspectionCheckpointSummary, expectedCheckpointSummary);
  assert.equal(fixture.forbiddenBehavior.reviewerRoutingPerformed, false);
  assert.equal(fixture.forbiddenBehavior.reviewerAssignmentPerformed, false);
  assert.equal(fixture.forbiddenBehavior.evaluatorExecutionPerformed, false);
  assert.equal(fixture.forbiddenBehavior.evaluatorResultProduced, false);
  assert.equal(fixture.forbiddenBehavior.approvalDecisionProduced, false);
  assert.equal(fixture.forbiddenBehavior.approvalGrantProduced, false);
  assert.equal(fixture.forbiddenBehavior.approvalGrantPersisted, false);
  assert.equal(fixture.forbiddenBehavior.runtimeCommandExposureEnabled, false);
  assert.equal(fixture.forbiddenBehavior.runtimeExecutionEnabled, false);
  assertAllRuntimeEffectFalse(fixture.blockedRuntimeEffect, "fixture.blockedRuntimeEffect");
});

test("serve-runtime remains default-blocked and dry-run cannot bypass Phase 5.37", async () => {
  for (const args of [
    ["serve-runtime"],
    ["serve-runtime", "--dry-run"]
  ]) {
    const tmp = await mkdtemp(join(tmpdir(), "ardyn-phase5-37-"));
    try {
      const result = await runCliFailure(args, { cwd: tmp });
      assert.equal(result.code, 1);
      assert.equal(result.stdout, "");
      assert.match(result.stderr, /runtime unavailable: serve-runtime is recognized, but runtime is not enabled/i);
      assert.deepEqual(await readdir(tmp), []);
    } finally {
      await rm(tmp, { recursive: true, force: true });
    }
  }
});

test("Phase 5.37 handoff disposition inspection checkpoint command names remain rejected", async () => {
  for (const command of checkpointCommandProbes) {
    const result = await runCliFailure([command]);
    assert.equal(result.stdout, "");
    if (command === "serve-runtime") {
      assert.match(result.stderr, /runtime unavailable/i);
    } else {
      assert.match(result.stderr, /Unknown command|Usage:/i);
    }
  }
});

test("Phase 5.37 does not change CLI runtime source or add checkpoint commands", async () => {
  const { stdout: baselineSource } = await execFileAsync(
    "git",
    ["show", `${phase537BaselineCommit}:apps/cli/src/index.mjs`],
    { cwd: repoRoot, encoding: "utf8", maxBuffer: 4 * 1024 * 1024 }
  );
  const currentSource = await readFile(cliSourceUrl, "utf8");

  assert.equal(currentSource, baselineSource);
  assert.doesNotMatch(currentSource, /phase-5-37/i);
  assert.doesNotMatch(currentSource, /handoff-disposition-inspection-checkpoint/i);
  assert.doesNotMatch(currentSource, /createReviewOnlyHandoffDispositionInspectionCheckpointForReview/);
});
