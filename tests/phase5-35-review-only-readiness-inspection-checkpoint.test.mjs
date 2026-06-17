import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readFile, readdir, rm, mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";
import {
  REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_SCHEMA,
  createApprovalEvaluatorCandidateIntakeCheckpointForReview,
  createHumanToolInspectionDispositionBoundaryForReview,
  createNonAuthorizingEvaluatorDecisionCandidateBoundaryForReview,
  createNonAuthorizingEvaluatorDecisionCandidateInspectionArtifactForReview,
  createPrerequisiteReviewArtifactBoundaryForReview,
  createReviewArtifactEvaluatorInputHandoffForReview,
  createReviewOnlyAggregationInspectionHandoffForReview,
  createReviewOnlyDispositionAggregationCheckpointForReview,
  createReviewOnlyEvaluatorPreflightCheckpointForReview,
  createReviewOnlyHandoffReadinessArtifactForReview,
  createReviewOnlyReadinessInspectionCheckpointForReview
} from "../packages/core/src/index.mjs";

const execFileAsync = promisify(execFile);
const phase535BaselineCommit = "919dc0982d1ed33b84b1172dedbc5ec8a28e2683";
const reviewedAt = "2026-06-16T00:00:00.000Z";
const defaultReviewedAt = "1970-01-01T00:00:00.000Z";
const repoRootUrl = new URL("../", import.meta.url);
const repoRoot = fileURLToPath(repoRootUrl);
const cliSourceUrl = new URL("../apps/cli/src/index.mjs", import.meta.url);
const cliPath = fileURLToPath(cliSourceUrl);
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-35/review-only-readiness-inspection-checkpoint.json",
  import.meta.url
);

const expectedTopLevelKeys = Object.freeze([
  "schema",
  "schemaVersion",
  "phase",
  "artifactKind",
  "metadataGeneratedAt",
  "sourcePhase",
  "readinessInspectionCheckpointSummary",
  "readinessInspectionCheckpointInputShape",
  "readinessInspectionCheckpointResultShape",
  "readinessInspectionCheckpointCases",
  "readinessInspectionCheckpoint",
  "blockedRuntimeEffect",
  "serveRuntimeBlockedBehavior",
  "forbiddenBehavior",
  "filesAllowedToChange",
  "filesForbiddenToChange",
  "validationCommands"
]);

const expectedCaseIds = Object.freeze([
  "missing-review-only-readiness-inspection-checkpoint-input-rejected",
  "malformed-review-only-readiness-inspection-checkpoint-input-rejected",
  "malformed-review-only-readiness-inspection-checkpoint-invalid-reviewed-at-rejected",
  "empty-review-only-readiness-inspection-checkpoint-input-rejected",
  "conflicting-review-only-readiness-inspection-checkpoint-input-rejected",
  "stale-review-only-readiness-inspection-checkpoint-input-rejected",
  "revoked-review-only-readiness-inspection-checkpoint-input-rejected",
  "unknown-review-only-readiness-inspection-checkpoint-input-rejected",
  "duplicate-invalid-review-only-readiness-inspection-checkpoint-input-rejected",
  "authorizing-looking-review-only-readiness-inspection-checkpoint-input-rejected",
  "grant-looking-review-only-readiness-inspection-checkpoint-input-rejected",
  "approval-decision-looking-review-only-readiness-inspection-checkpoint-input-rejected",
  "approval-grant-looking-review-only-readiness-inspection-checkpoint-input-rejected",
  "evaluator-result-looking-review-only-readiness-inspection-checkpoint-input-rejected",
  "evaluator-execution-looking-review-only-readiness-inspection-checkpoint-input-rejected",
  "reviewer-routing-looking-review-only-readiness-inspection-checkpoint-input-rejected",
  "reviewer-assignment-looking-review-only-readiness-inspection-checkpoint-input-rejected",
  "runtime-permission-looking-review-only-readiness-inspection-checkpoint-input-rejected",
  "command-exposure-looking-review-only-readiness-inspection-checkpoint-input-rejected",
  "runtime-effect-true-review-only-readiness-inspection-checkpoint-input-rejected",
  "process-flag-true-review-only-readiness-inspection-checkpoint-input-rejected",
  "unsafe-top-level-review-only-readiness-inspection-checkpoint-input-rejected",
  "unsafe-nested-readiness-inspection-checkpoint-data-review-only-readiness-inspection-checkpoint-input-rejected",
  "execution-signal-looking-review-only-readiness-inspection-checkpoint-input-rejected",
  "valid-review-only-readiness-inspection-checkpoint"
]);

const expectedClassifications = Object.freeze({
  "missing-review-only-readiness-inspection-checkpoint-input-rejected":
    "missing_review_only_readiness_inspection_checkpoint_input_rejected",
  "malformed-review-only-readiness-inspection-checkpoint-input-rejected":
    "malformed_review_only_readiness_inspection_checkpoint_input_rejected",
  "malformed-review-only-readiness-inspection-checkpoint-invalid-reviewed-at-rejected":
    "malformed_review_only_readiness_inspection_checkpoint_input_rejected",
  "empty-review-only-readiness-inspection-checkpoint-input-rejected":
    "empty_review_only_readiness_inspection_checkpoint_input_rejected",
  "conflicting-review-only-readiness-inspection-checkpoint-input-rejected":
    "conflicting_review_only_readiness_inspection_checkpoint_input_rejected",
  "stale-review-only-readiness-inspection-checkpoint-input-rejected":
    "stale_review_only_readiness_inspection_checkpoint_input_rejected",
  "revoked-review-only-readiness-inspection-checkpoint-input-rejected":
    "revoked_review_only_readiness_inspection_checkpoint_input_rejected",
  "unknown-review-only-readiness-inspection-checkpoint-input-rejected":
    "unknown_review_only_readiness_inspection_checkpoint_input_rejected",
  "duplicate-invalid-review-only-readiness-inspection-checkpoint-input-rejected":
    "duplicate_invalid_review_only_readiness_inspection_checkpoint_input_rejected",
  "authorizing-looking-review-only-readiness-inspection-checkpoint-input-rejected":
    "authorizing_review_only_readiness_inspection_checkpoint_input_rejected",
  "grant-looking-review-only-readiness-inspection-checkpoint-input-rejected":
    "grant_looking_review_only_readiness_inspection_checkpoint_input_rejected",
  "approval-decision-looking-review-only-readiness-inspection-checkpoint-input-rejected":
    "approval_decision_looking_review_only_readiness_inspection_checkpoint_input_rejected",
  "approval-grant-looking-review-only-readiness-inspection-checkpoint-input-rejected":
    "approval_grant_looking_review_only_readiness_inspection_checkpoint_input_rejected",
  "evaluator-result-looking-review-only-readiness-inspection-checkpoint-input-rejected":
    "evaluator_result_looking_review_only_readiness_inspection_checkpoint_input_rejected",
  "evaluator-execution-looking-review-only-readiness-inspection-checkpoint-input-rejected":
    "evaluator_execution_looking_review_only_readiness_inspection_checkpoint_input_rejected",
  "reviewer-routing-looking-review-only-readiness-inspection-checkpoint-input-rejected":
    "reviewer_routing_looking_review_only_readiness_inspection_checkpoint_input_rejected",
  "reviewer-assignment-looking-review-only-readiness-inspection-checkpoint-input-rejected":
    "reviewer_assignment_looking_review_only_readiness_inspection_checkpoint_input_rejected",
  "runtime-permission-looking-review-only-readiness-inspection-checkpoint-input-rejected":
    "runtime_permission_looking_review_only_readiness_inspection_checkpoint_input_rejected",
  "command-exposure-looking-review-only-readiness-inspection-checkpoint-input-rejected":
    "command_exposure_looking_review_only_readiness_inspection_checkpoint_input_rejected",
  "runtime-effect-true-review-only-readiness-inspection-checkpoint-input-rejected":
    "runtime_effect_true_review_only_readiness_inspection_checkpoint_input_rejected",
  "process-flag-true-review-only-readiness-inspection-checkpoint-input-rejected":
    "process_flag_true_review_only_readiness_inspection_checkpoint_input_rejected",
  "unsafe-top-level-review-only-readiness-inspection-checkpoint-input-rejected":
    "unsafe_review_only_readiness_inspection_checkpoint_input_rejected",
  "unsafe-nested-readiness-inspection-checkpoint-data-review-only-readiness-inspection-checkpoint-input-rejected":
    "unsafe_review_only_readiness_inspection_checkpoint_input_rejected",
  "execution-signal-looking-review-only-readiness-inspection-checkpoint-input-rejected":
    "execution_signal_looking_review_only_readiness_inspection_checkpoint_input_rejected",
  "valid-review-only-readiness-inspection-checkpoint":
    "valid_review_only_readiness_inspection_checkpoint_runtime_still_blocked"
});

const readinessCommandProbes = Object.freeze([
  "review-only-readiness-inspection-checkpoint",
  "create-review-only-readiness-inspection-checkpoint",
  "readiness-inspection-checkpoint",
  "phase-5-35-review-only-readiness-inspection-checkpoint",
  "reviewer-routing",
  "reviewer-assignment",
  "serve-runtime"
]);

const expectedReadinessSummary = Object.freeze({
  reviewOnlyReadinessInspectionCheckpointRecorded: true,
  artifactKind: "review-only-readiness-inspection-checkpoint",
  artifactReviewOnly: true,
  artifactAuthoritative: false,
  validReadinessArtifactProducesInspectionCheckpoint: true,
  missingReadinessArtifactRejected: true,
  malformedReadinessArtifactRejected: true,
  emptyReadinessArtifactRejected: true,
  conflictingReadinessArtifactRejected: true,
  staleReadinessArtifactRejected: true,
  revokedReadinessArtifactRejected: true,
  unknownReadinessArtifactRejected: true,
  duplicateInvalidReadinessArtifactRejected: true,
  authorizingLookingReadinessArtifactRejected: true,
  grantLookingReadinessArtifactRejected: true,
  approvalDecisionLookingReadinessArtifactRejected: true,
  approvalGrantLookingReadinessArtifactRejected: true,
  evaluatorResultLookingReadinessArtifactRejected: true,
  evaluatorExecutionLookingReadinessArtifactRejected: true,
  reviewerRoutingLookingReadinessArtifactRejected: true,
  reviewerAssignmentLookingReadinessArtifactRejected: true,
  runtimePermissionLookingReadinessArtifactRejected: true,
  commandExposureLookingReadinessArtifactRejected: true,
  runtimeEffectTrueReadinessArtifactRejected: true,
  processFlagTrueReadinessArtifactRejected: true,
  unsafeReadinessArtifactRejected: true,
  executionSignalLookingReadinessArtifactRejected: true,
  readinessInspectionCheckpointIsReviewerRouting: false,
  readinessInspectionCheckpointIsReviewerAssignment: false,
  readinessInspectionCheckpointIsEvaluatorExecution: false,
  readinessInspectionCheckpointIsEvaluatorResult: false,
  readinessInspectionCheckpointIsApprovalDecision: false,
  readinessInspectionCheckpointIsApprovalGrant: false,
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
    revocation: { revoked: false, revokedAt: null, revocationReason: null },
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
    revocation: { revoked: false, revokedAt: null, revocationReason: null },
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

function inlineSource(sourceId) {
  return {
    sourceId,
    sourceKind: "inline-prerequisite-records",
    sourceMode: "in-memory",
    records: [runtimeApprovalRecord(), commandExposureApprovalRecord()]
  };
}

function validReviewArtifact(sourceId = "source-valid") {
  const result = createPrerequisiteReviewArtifactBoundaryForReview({
    reviewedAt,
    sourceInputs: [inlineSource(sourceId)]
  });

  assert.equal(result.reviewArtifactProduced, true, sourceId);
  return clone(result.reviewArtifact);
}

function validEvaluatorInputCandidate(sourceId = "source-valid") {
  const handoff = createReviewArtifactEvaluatorInputHandoffForReview({
    reviewedAt,
    reviewArtifacts: [validReviewArtifact(sourceId)]
  });

  assert.equal(handoff.evaluatorInputCandidateProduced, true, sourceId);
  return clone(handoff.evaluatorInputCandidate);
}

function validIntakeCheckpointState(sourceId = "source-valid") {
  const intake = createApprovalEvaluatorCandidateIntakeCheckpointForReview({
    reviewedAt,
    evaluatorInputCandidates: [validEvaluatorInputCandidate(sourceId)]
  });

  assert.equal(intake.intakeCheckpointStateProduced, true, sourceId);
  return clone(intake.intakeCheckpointState);
}

function validPreflightCheckpointState(sourceId = "source-valid") {
  const preflight = createReviewOnlyEvaluatorPreflightCheckpointForReview({
    reviewedAt,
    intakeCheckpointStates: [validIntakeCheckpointState(sourceId)]
  });

  assert.equal(preflight.preflightCheckpointStateProduced, true, sourceId);
  assert.equal(preflight.evaluatorExecuted, false, sourceId);
  return clone(preflight.preflightCheckpointState);
}

function validDecisionCandidateState(sourceId = "source-valid") {
  const decision = createNonAuthorizingEvaluatorDecisionCandidateBoundaryForReview({
    reviewedAt,
    preflightCheckpointStates: [validPreflightCheckpointState(sourceId)]
  });

  assert.equal(decision.decisionCandidateStateProduced, true, sourceId);
  assert.equal(decision.decisionCandidateStateIsApprovalDecision, false, sourceId);
  assert.equal(decision.evaluatorExecuted, false, sourceId);
  return clone(decision.decisionCandidateState);
}

function validInspectionArtifact(sourceId = "source-valid") {
  const artifact =
    createNonAuthorizingEvaluatorDecisionCandidateInspectionArtifactForReview({
      reviewedAt,
      decisionCandidateStates: [validDecisionCandidateState(sourceId)]
    });

  assert.equal(artifact.inspectionArtifactProduced, true, sourceId);
  assert.equal(artifact.inspectionArtifactIsApprovalDecision, false, sourceId);
  assert.equal(artifact.evaluatorResultProduced, false, sourceId);
  assert.equal(artifact.evaluatorExecuted, false, sourceId);
  return clone(artifact.inspectionArtifact);
}

function validDispositionState(sourceId = "source-valid") {
  const disposition = createHumanToolInspectionDispositionBoundaryForReview({
    reviewedAt,
    inspectionArtifacts: [validInspectionArtifact(sourceId)]
  });

  assert.equal(disposition.dispositionStateProduced, true, sourceId);
  assert.equal(disposition.dispositionStateIsApprovalDecision, false, sourceId);
  assert.equal(disposition.evaluatorResultProduced, false, sourceId);
  assert.equal(disposition.evaluatorExecuted, false, sourceId);
  return clone(disposition.dispositionState);
}

function validAggregationState(sourceId = "source-valid") {
  const aggregation = createReviewOnlyDispositionAggregationCheckpointForReview({
    reviewedAt,
    dispositionStates: [validDispositionState(sourceId)]
  });

  assert.equal(aggregation.aggregationStateProduced, true, sourceId);
  assert.equal(aggregation.aggregationCheckpointIsReviewerRouting, false, sourceId);
  assert.equal(aggregation.evaluatorResultProduced, false, sourceId);
  assert.equal(aggregation.evaluatorExecuted, false, sourceId);
  return clone(aggregation.aggregationState);
}

function validHandoffState(sourceId = "source-valid") {
  const handoff = createReviewOnlyAggregationInspectionHandoffForReview({
    reviewedAt,
    aggregationStates: [validAggregationState(sourceId)]
  });

  assert.equal(handoff.inspectionHandoffStateProduced, true, sourceId);
  assert.equal(handoff.handoffIsReviewerRouting, false, sourceId);
  assert.equal(handoff.evaluatorResultProduced, false, sourceId);
  assert.equal(handoff.evaluatorExecuted, false, sourceId);
  return clone(handoff.inspectionHandoffState);
}

function validReadinessArtifact(sourceId = "source-valid") {
  const readiness = createReviewOnlyHandoffReadinessArtifactForReview({
    reviewedAt,
    handoffStates: [validHandoffState(sourceId)]
  });

  assert.equal(readiness.readinessArtifactProduced, true, sourceId);
  assert.equal(readiness.readinessArtifactIsReviewerRouting, false, sourceId);
  assert.equal(readiness.readinessArtifactIsReviewerAssignment, false, sourceId);
  assert.equal(readiness.evaluatorResultProduced, false, sourceId);
  assert.equal(readiness.evaluatorExecuted, false, sourceId);
  return clone(readiness.readinessArtifact);
}

function rejectedReadinessCase(caseId, readinessArtifacts) {
  return {
    caseId,
    input: { reviewedAt, readinessArtifacts },
    expectedReadinessInspectionCheckpointProduced: false
  };
}

function acceptedReadinessCase(caseId, readinessArtifacts) {
  return {
    caseId,
    input: { reviewedAt, readinessArtifacts },
    expectedReadinessInspectionCheckpointProduced: true
  };
}

function readinessArtifactWith(sourceId, overrides) {
  return {
    ...validReadinessArtifact(sourceId),
    ...overrides
  };
}

function readinessArtifactWithNested(sourceId, nestedKey, nestedSourceId, overrides) {
  return {
    ...validReadinessArtifact(sourceId),
    [nestedKey]: {
      ...validReadinessArtifact(nestedSourceId)[nestedKey],
      ...overrides
    }
  };
}

function missingReadinessCase() {
  return {
    caseId: "missing-review-only-readiness-inspection-checkpoint-input-rejected",
    input: { reviewedAt },
    expectedReadinessInspectionCheckpointProduced: false
  };
}

function requiredShapeReadinessCases(duplicateState) {
  return [
    missingReadinessCase(),
    rejectedReadinessCase(
      "malformed-review-only-readiness-inspection-checkpoint-input-rejected",
      [readinessArtifactWith("source-malformed", { stateMode: "runtime" })]
    ),
    rejectedReadinessCase(
      "malformed-review-only-readiness-inspection-checkpoint-invalid-reviewed-at-rejected",
      [readinessArtifactWith("source-invalid-reviewed-at", { reviewedAt: "not-a-date" })]
    ),
    rejectedReadinessCase(
      "empty-review-only-readiness-inspection-checkpoint-input-rejected",
      []
    ),
    rejectedReadinessCase(
      "conflicting-review-only-readiness-inspection-checkpoint-input-rejected",
      [
        validReadinessArtifact("source-conflict-a"),
        validReadinessArtifact("source-conflict-b")
      ]
    ),
    rejectedReadinessCase(
      "stale-review-only-readiness-inspection-checkpoint-input-rejected",
      [
        readinessArtifactWith("source-stale", {
          reviewedAt: "2026-06-15T00:00:00.000Z"
        })
      ]
    ),
    rejectedReadinessCase(
      "revoked-review-only-readiness-inspection-checkpoint-input-rejected",
      [
        readinessArtifactWith("source-revoked", {
          revocation: {
            revoked: true,
            revokedAt: "2026-06-16T00:00:00.000Z",
            revocationReason: "operator-revoked"
          }
        })
      ]
    ),
    rejectedReadinessCase(
      "unknown-review-only-readiness-inspection-checkpoint-input-rejected",
      [
        readinessArtifactWith("source-unknown", {
          schema: "ardyn.phase-5.34.unknown-readiness-artifact-state",
          stateKind: "unknown-readiness-artifact-state"
        })
      ]
    ),
    rejectedReadinessCase(
      "duplicate-invalid-review-only-readiness-inspection-checkpoint-input-rejected",
      [duplicateState, clone(duplicateState)]
    )
  ];
}

function authorizationReadinessCases() {
  return [
    rejectedReadinessCase(
      "authorizing-looking-review-only-readiness-inspection-checkpoint-input-rejected",
      [readinessArtifactWith("source-authorizing", { authoritative: true })]
    ),
    rejectedReadinessCase(
      "grant-looking-review-only-readiness-inspection-checkpoint-input-rejected",
      [readinessArtifactWith("source-grant", { grantProduced: true })]
    ),
    rejectedReadinessCase(
      "approval-decision-looking-review-only-readiness-inspection-checkpoint-input-rejected",
      [
        readinessArtifactWith("source-approval-decision", {
          approvalDecisionProduced: true
        })
      ]
    ),
    rejectedReadinessCase(
      "approval-grant-looking-review-only-readiness-inspection-checkpoint-input-rejected",
      [readinessArtifactWith("source-approval-grant", { approvalGrantProduced: true })]
    ),
    rejectedReadinessCase(
      "evaluator-result-looking-review-only-readiness-inspection-checkpoint-input-rejected",
      [
        readinessArtifactWith("source-evaluator-result", {
          evaluatorResultProduced: true
        })
      ]
    ),
    rejectedReadinessCase(
      "evaluator-execution-looking-review-only-readiness-inspection-checkpoint-input-rejected",
      [
        readinessArtifactWith("source-evaluator-execution", {
          evaluatorExecutionRequested: true
        })
      ]
    ),
    rejectedReadinessCase(
      "reviewer-routing-looking-review-only-readiness-inspection-checkpoint-input-rejected",
      [
        readinessArtifactWith("source-reviewer-routing", {
          reviewerRouting: { queue: "ops" }
        })
      ]
    ),
    rejectedReadinessCase(
      "reviewer-assignment-looking-review-only-readiness-inspection-checkpoint-input-rejected",
      [
        readinessArtifactWith("source-reviewer-assignment", {
          reviewerAssignment: { reviewerId: "human-reviewer-1" }
        })
      ]
    ),
    rejectedReadinessCase(
      "runtime-permission-looking-review-only-readiness-inspection-checkpoint-input-rejected",
      [
        readinessArtifactWith("source-runtime-permission", {
          runtimePermissionGranted: true
        })
      ]
    ),
    rejectedReadinessCase(
      "command-exposure-looking-review-only-readiness-inspection-checkpoint-input-rejected",
      [
        readinessArtifactWith("source-command-exposure", {
          commandExposurePermissionGranted: true
        })
      ]
    ),
    rejectedReadinessCase(
      "runtime-effect-true-review-only-readiness-inspection-checkpoint-input-rejected",
      [
        readinessArtifactWithNested(
          "source-runtime-effect",
          "runtimeEffect",
          "source-runtime-effect-nested",
          {
            runtimeEnabled: true
          }
        )
      ]
    ),
    rejectedReadinessCase(
      "process-flag-true-review-only-readiness-inspection-checkpoint-input-rejected",
      [readinessArtifactWith("source-process", { processSpawnEnabled: true })]
    ),
    rejectedReadinessCase(
      "unsafe-top-level-review-only-readiness-inspection-checkpoint-input-rejected",
      [readinessArtifactWith("source-unsafe", { externalSourceLookupEnabled: true })]
    ),
    rejectedReadinessCase(
      "unsafe-nested-readiness-inspection-checkpoint-data-review-only-readiness-inspection-checkpoint-input-rejected",
      [
        readinessArtifactWith("source-unsafe-nested", {
          readinessInspectionCheckpoint: { envSecretsReaderEnabled: true }
        })
      ]
    ),
    rejectedReadinessCase(
      "execution-signal-looking-review-only-readiness-inspection-checkpoint-input-rejected",
      [readinessArtifactWith("source-execution-signal", { executionSignal: true })]
    )
  ];
}

function readinessCases() {
  const duplicateState = validReadinessArtifact("source-duplicate");

  return [
    ...requiredShapeReadinessCases(duplicateState),
    ...authorizationReadinessCases(),
    acceptedReadinessCase("valid-review-only-readiness-inspection-checkpoint", [
      validReadinessArtifact("source-valid-readiness")
    ])
  ];
}

function validReadinessResult() {
  const validCase = readinessCases().find(
    (entry) => entry.caseId === "valid-review-only-readiness-inspection-checkpoint"
  );

  return createReviewOnlyReadinessInspectionCheckpointForReview(validCase.input);
}

function assertAllFalse(record) {
  for (const [key, value] of Object.entries(record)) {
    assert.equal(value, false, `${key} should remain false`);
  }
}

function assertNonAuthorizingResult(result, label) {
  assert.equal(result.readinessInspectionCheckpointIsReviewerRouting, false, label);
  assert.equal(result.readinessInspectionCheckpointIsReviewerAssignment, false, label);
  assert.equal(result.readinessInspectionCheckpointIsEvaluatorExecution, false, label);
  assert.equal(result.readinessInspectionCheckpointIsEvaluatorResult, false, label);
  assert.equal(result.readinessInspectionCheckpointIsApprovalDecision, false, label);
  assert.equal(result.readinessInspectionCheckpointIsApprovalGrant, false, label);
  assert.equal(result.reviewOnly, true, label);
  assert.equal(result.authoritative, false, label);
  assert.equal(result.reviewArtifactOnly, true, label);
  assert.equal(result.readinessInspectionCheckpointMetadataOnly, true, label);
  assert.equal(result.reviewerRoutingPerformed, false, label);
  assert.equal(result.reviewerRoutingEnabled, false, label);
  assert.equal(result.reviewerRouteId, null, label);
  assert.equal(result.reviewerAssignmentPerformed, false, label);
  assert.equal(result.reviewerAssignmentEnabled, false, label);
  assert.equal(result.reviewerAssignmentId, null, label);
  assert.equal(result.reviewerId, null, label);
  assert.equal(result.evaluatorResultProduced, false, label);
  assert.equal(result.evaluatorResultPersisted, false, label);
  assert.equal(result.evaluatorResultId, null, label);
  assert.equal(result.approvalDecisionProduced, false, label);
  assert.equal(result.approvalDecisionPersisted, false, label);
  assert.equal(result.approvalDecisionId, null, label);
  assert.equal(result.approvalGrant.produced, false, label);
  assert.equal(result.approvalGrant.persisted, false, label);
  assert.equal(result.approvalGrant.grantId, null, label);
  assert.equal(result.approvalGrantProduced, false, label);
  assert.equal(result.approvalGrantPersisted, false, label);
  assert.equal(result.approvalGrantId, null, label);
  assert.equal(result.runtimePermissionGranted, false, label);
  assert.equal(result.commandExposurePermissionGranted, false, label);
  assert.equal(result.runtimeCommandExposureEnabled, false, label);
  assert.equal(result.runtimeExecutionEnabled, false, label);
  assert.equal(result.evaluatorExecutionRequested, false, label);
  assert.equal(result.evaluatorExecutionStarted, false, label);
  assert.equal(result.evaluatorExecutionEnabled, false, label);
  assert.equal(result.evaluatorExecuted, false, label);
  assertAllFalse(result.runtimeEffect);
}

function assertValidReadinessInspectionCheckpoint(checkpoint) {
  assert.equal(
    checkpoint.schema,
    "ardyn.phase-5.35.review-only-readiness-inspection-checkpoint-state"
  );
  assert.equal(
    checkpoint.stateKind,
    "review-only-readiness-inspection-checkpoint-state"
  );
  assert.equal(checkpoint.stateMode, "review-only");
  assert.equal(checkpoint.reviewedAt, reviewedAt);
  assert.equal(checkpoint.readinessArtifactAccepted, true);
  assert.equal(checkpoint.readinessInspectionCheckpointMetadataOnly, true);
  assert.equal(checkpoint.readinessInspectionCheckpointIsReviewerRouting, false);
  assert.equal(checkpoint.readinessInspectionCheckpointIsReviewerAssignment, false);
  assert.equal(checkpoint.readinessInspectionCheckpointIsEvaluatorExecution, false);
  assert.equal(checkpoint.readinessInspectionCheckpointIsEvaluatorResult, false);
  assert.equal(checkpoint.readinessInspectionCheckpointIsApprovalDecision, false);
  assert.equal(checkpoint.readinessInspectionCheckpointIsApprovalGrant, false);
  assert.equal(checkpoint.reviewerRoutingPerformed, false);
  assert.equal(checkpoint.reviewerAssignmentPerformed, false);
  assert.equal(checkpoint.evaluatorResultProduced, false);
  assert.equal(checkpoint.evaluatorResultPersisted, false);
  assert.equal(checkpoint.approvalDecisionProduced, false);
  assert.equal(checkpoint.approvalDecisionPersisted, false);
  assert.equal(checkpoint.approvalGrantProduced, false);
  assert.equal(checkpoint.approvalGrantPersisted, false);
  assert.equal(checkpoint.runtimePermissionGranted, false);
  assert.equal(checkpoint.commandExposurePermissionGranted, false);
  assert.equal(checkpoint.evaluatorExecuted, false);
  assertAllFalse(checkpoint.runtimeEffect);
  assert.equal(
    checkpoint.sourceHandoffReadinessArtifact.schema,
    "ardyn.phase-5.34.review-only-handoff-readiness-artifact-state"
  );
  assert.equal(
    checkpoint.sourceHandoffReadinessArtifact.stateKind,
    "review-only-handoff-readiness-artifact-state"
  );
  assert.match(
    checkpoint.sourceHandoffReadinessArtifact.stateDigest,
    /^sha256:[0-9a-f]{64}$/
  );
  assert.match(
    checkpoint.sourceHandoffReadinessArtifact.sourceInspectionHandoffStateDigest,
    /^sha256:[0-9a-f]{64}$/
  );
  assert.match(
    checkpoint.sourceHandoffReadinessArtifact.sourceAggregationStateDigest,
    /^sha256:[0-9a-f]{64}$/
  );
  assert.equal(
    Object.hasOwn(
      checkpoint.sourceHandoffReadinessArtifact,
      "sourceInspectionHandoffState"
    ),
    false
  );
  assert.equal(
    Object.hasOwn(checkpoint.sourceHandoffReadinessArtifact, "readinessSummary"),
    false
  );
  assert.equal(
    checkpoint.sourceHandoffReadinessArtifact.readinessArtifactMetadataOnly,
    true
  );
  assert.equal(
    checkpoint.sourceHandoffReadinessArtifact.readinessArtifactIsReviewerRouting,
    false
  );
  assert.equal(
    checkpoint.sourceHandoffReadinessArtifact.readinessArtifactIsReviewerAssignment,
    false
  );
  assert.equal(
    checkpoint.sourceHandoffReadinessArtifact.readinessArtifactIsEvaluatorResult,
    false
  );
  assert.equal(
    checkpoint.sourceHandoffReadinessArtifact.readinessArtifactIsApprovalDecision,
    false
  );
  assert.equal(
    checkpoint.sourceHandoffReadinessArtifact.readinessArtifactIsApprovalGrant,
    false
  );
  assert.equal(
    checkpoint.sourceHandoffReadinessArtifact.reviewerAssignmentPerformed,
    false
  );
  assert.equal(
    checkpoint.sourceHandoffReadinessArtifact.evaluatorResultProduced,
    false
  );
  assert.equal(
    checkpoint.sourceHandoffReadinessArtifact.approvalDecisionProduced,
    false
  );
  assert.equal(
    checkpoint.sourceHandoffReadinessArtifact.approvalGrantProduced,
    false
  );
  assert.equal(checkpoint.sourceHandoffReadinessArtifact.evaluatorExecuted, false);
  assert.equal(
    checkpoint.inspectionCheckpointSummary.readinessInspectionCheckpointMetadataOnly,
    true
  );
  assert.equal(checkpoint.inspectionCheckpointSummary.reviewerRoutingPerformed, false);
  assert.equal(checkpoint.inspectionCheckpointSummary.reviewerAssignmentPerformed, false);
  assert.equal(
    checkpoint.inspectionCheckpointSummary.evaluatorExecutionPerformed,
    false
  );
  assert.equal(checkpoint.inspectionCheckpointSummary.evaluatorResultProduced, false);
  assert.equal(checkpoint.inspectionCheckpointSummary.approvalDecisionProduced, false);
  assert.equal(checkpoint.inspectionCheckpointSummary.approvalGrantProduced, false);
  assert.equal(checkpoint.inspectionCheckpointSummary.evaluatorExecuted, false);
  assert.equal(checkpoint.integratedReviewSummary.reviewSummaryIsApprovalGrant, false);
  assert.equal(checkpoint.integratedReviewSummary.approvalGrantProduced, false);
  assert.equal(checkpoint.integratedReviewSummary.approvalGrantPersisted, false);
  assert.equal(checkpoint.integratedReviewSummary.approvalGrantId, null);
  assert.equal(checkpoint.integratedReviewSummary.runtimeEffectAllFalse, true);
}

async function readJson(url) {
  return JSON.parse(await readFile(url, "utf8"));
}

async function runCliFailure(args, options = {}) {
  const result = await execFileAsync(process.execPath, [cliPath, ...args], {
    cwd: options.cwd ?? repoRoot,
    encoding: "utf8"
  }).then(
    (success) => ({ kind: "success", stdout: success.stdout }),
    (error) => ({ kind: "failure", error })
  );

  assert.equal(result.kind, "failure", `Expected ardyn ${args.join(" ")} to fail`);
  assert.equal(typeof result.error.code, "number", args.join(" "));
  assert.equal(typeof result.error.stdout, "string", args.join(" "));
  assert.equal(typeof result.error.stderr, "string", args.join(" "));

  return {
    code: result.error.code,
    stdout: result.error.stdout,
    stderr: result.error.stderr
  };
}

function assertFixtureCases(fixture) {
  assert.deepEqual(
    fixture.readinessInspectionCheckpointCases.map((artifactCase) => artifactCase.caseId),
    expectedCaseIds
  );

  for (const artifactCase of fixture.readinessInspectionCheckpointCases) {
    assert.equal(artifactCase.classification, expectedClassifications[artifactCase.caseId]);
    assert.equal(artifactCase.reviewOnly, true, artifactCase.caseId);
    assert.equal(artifactCase.authoritative, false, artifactCase.caseId);
    assert.equal(artifactCase.reviewArtifactOnly, true, artifactCase.caseId);
    assert.equal(
      artifactCase.readinessInspectionCheckpointMetadataOnly,
      true,
      artifactCase.caseId
    );
    assert.equal(artifactCase.readinessInspectionCheckpointIsReviewerRouting, false);
    assert.equal(artifactCase.readinessInspectionCheckpointIsReviewerAssignment, false);
    assert.equal(artifactCase.readinessInspectionCheckpointIsEvaluatorExecution, false);
    assert.equal(artifactCase.readinessInspectionCheckpointIsEvaluatorResult, false);
    assert.equal(artifactCase.readinessInspectionCheckpointIsApprovalDecision, false);
    assert.equal(artifactCase.readinessInspectionCheckpointIsApprovalGrant, false);
    assert.equal(artifactCase.reviewerRoutingPerformed, false);
    assert.equal(artifactCase.reviewerAssignmentPerformed, false);
    assert.equal(artifactCase.evaluatorResultProduced, false);
    assert.equal(artifactCase.evaluatorResultPersisted, false);
    assert.equal(artifactCase.approvalDecisionProduced, false);
    assert.equal(artifactCase.approvalDecisionPersisted, false);
    assert.equal(artifactCase.approvalGrant.produced, false, artifactCase.caseId);
    assert.equal(artifactCase.approvalGrant.persisted, false, artifactCase.caseId);
    assert.equal(artifactCase.approvalGrant.grantId, null, artifactCase.caseId);
    assert.equal(artifactCase.runtimePermissionGranted, false);
    assert.equal(artifactCase.commandExposurePermissionGranted, false);
    assert.equal(artifactCase.evaluatorExecuted, false);
    assertAllFalse(artifactCase.runtimeEffect);
  }
}

function assertFixtureReadinessArtifact(fixture) {
  assert.equal(
    fixture.readinessInspectionCheckpoint.artifactCanPerformReviewerRouting,
    false
  );
  assert.equal(
    fixture.readinessInspectionCheckpoint.artifactCanAssignReviewers,
    false
  );
  assert.equal(fixture.readinessInspectionCheckpoint.artifactCanExecuteEvaluator, false);
  assert.equal(
    fixture.readinessInspectionCheckpoint.artifactCanProduceEvaluatorResult,
    false
  );
  assert.equal(
    fixture.readinessInspectionCheckpoint.artifactCanProduceApprovalDecision,
    false
  );
  assert.equal(fixture.readinessInspectionCheckpoint.artifactCanGrantApproval, false);
  assert.equal(fixture.readinessInspectionCheckpoint.artifactCanPersistGrant, false);
  assert.equal(
    fixture.readinessInspectionCheckpoint.artifactCanGrantRuntimePermission,
    false
  );
  assert.equal(
    fixture.readinessInspectionCheckpoint.artifactCanGrantCommandExposurePermission,
    false
  );
  assert.equal(fixture.readinessInspectionCheckpoint.artifactCanExecuteRuntime, false);
  assertAllFalse(fixture.blockedRuntimeEffect);
}

test("Phase 5.35 readiness inspection checkpoint fixture is deterministic metadata", async () => {
  const raw = await readFile(fixtureUrl, "utf8");
  const fixture = JSON.parse(raw);

  assert.equal(raw.endsWith("\n"), true);
  assert.equal(raw.includes("\r"), false);
  assert.deepEqual(Object.keys(fixture), expectedTopLevelKeys);
  assert.equal(
    fixture.schema,
    "ardyn.phase-5.35.review-only-readiness-inspection-checkpoint"
  );
  assert.equal(fixture.schemaVersion, "0.1.0");
  assert.equal(fixture.phase, "phase-5.35-review-only-readiness-inspection-checkpoint");
  assert.equal(fixture.artifactKind, "review-only-readiness-inspection-checkpoint");
  assert.equal(fixture.metadataGeneratedAt, "1970-01-01T00:00:00.000Z");
  assert.equal(
    fixture.sourcePhase.phase,
    "phase-5.34-review-only-handoff-readiness-artifact"
  );
});

test("Phase 5.35 readiness inspection checkpoint classifies readiness artifact cases", () => {
  for (const artifactCase of readinessCases()) {
    const result = createReviewOnlyReadinessInspectionCheckpointForReview(
      artifactCase.input
    );

    assert.equal(result.schema, REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_SCHEMA);
    assert.equal(result.schemaVersion, "0.1.0");
    assert.equal(result.artifactKind, "review-only-readiness-inspection-checkpoint");
    assert.equal(result.artifactMode, "review-only");
    assert.equal(result.reviewedAt, reviewedAt);
    assert.equal(result.classification, expectedClassifications[artifactCase.caseId]);
    assert.equal(
      result.readinessInspectionCheckpointProduced,
      artifactCase.expectedReadinessInspectionCheckpointProduced,
      artifactCase.caseId
    );
    assertNonAuthorizingResult(result, artifactCase.caseId);
  }
});

test("Phase 5.35 malformed readiness input fails closed without throwing", () => {
  const malformedInputs = [null, "not-an-object", [], 1, true];

  for (const input of malformedInputs) {
    const result = createReviewOnlyReadinessInspectionCheckpointForReview(input);

    assert.equal(result.reviewedAt, defaultReviewedAt);
    assert.equal(
      result.classification,
      "malformed_review_only_readiness_inspection_checkpoint_input_rejected"
    );
    assert.equal(result.readinessArtifactAccepted, false);
    assert.equal(result.readinessInspectionCheckpointProduced, false);
    assert.equal(result.readinessInspectionCheckpoint, null);
    assert.equal(result.readinessArtifactSummary, null);
    assertNonAuthorizingResult(result, String(input));
  }

  const invalidTimestampResult =
    createReviewOnlyReadinessInspectionCheckpointForReview({
      reviewedAt: "not-a-date",
      readinessArtifacts: [
        validReadinessArtifact("source-readiness-invalid-reviewed-at")
      ]
    });

  assert.equal(invalidTimestampResult.reviewedAt, defaultReviewedAt);
  assert.equal(
    invalidTimestampResult.classification,
    "malformed_review_only_readiness_inspection_checkpoint_input_rejected"
  );
  assert.equal(invalidTimestampResult.readinessArtifactAccepted, false);
  assert.equal(
    invalidTimestampResult.readinessInspectionCheckpointProduced,
    false
  );
  assert.equal(invalidTimestampResult.readinessInspectionCheckpoint, null);
  assert.equal(invalidTimestampResult.readinessArtifactSummary, null);
  assertNonAuthorizingResult(invalidTimestampResult, "invalid-readiness-reviewed-at");
});

test("Phase 5.35 valid readiness artifact produces only inspection checkpoint metadata", () => {
  const result = validReadinessResult();

  assert.equal(result.readinessArtifactAccepted, true);
  assert.equal(result.readinessInspectionCheckpointProduced, true);
  assertNonAuthorizingResult(result, "valid");
  assert.match(result.readinessArtifactSummary.stateDigest, /^sha256:[0-9a-f]{64}$/);
  assert.equal(result.readinessArtifactSummary.readinessArtifactIsReviewerRouting, false);
  assert.equal(
    result.readinessArtifactSummary.readinessArtifactIsReviewerAssignment,
    false
  );
  assert.equal(result.readinessArtifactSummary.readinessArtifactIsEvaluatorResult, false);
  assert.equal(result.readinessArtifactSummary.readinessArtifactIsApprovalDecision, false);
  assert.equal(result.readinessArtifactSummary.readinessArtifactIsApprovalGrant, false);
  assert.equal(result.readinessArtifactSummary.reviewerAssignmentPerformed, false);
  assert.equal(result.readinessArtifactSummary.evaluatorResultProduced, false);
  assert.equal(result.readinessArtifactSummary.approvalDecisionProduced, false);
  assert.equal(result.readinessArtifactSummary.evaluatorExecuted, false);

  assertValidReadinessInspectionCheckpoint(result.readinessInspectionCheckpoint);
});

test("Phase 5.35 rejected readiness artifact fails closed before inspection checkpoint", () => {
  for (const artifactCase of readinessCases().filter(
    (entry) => !entry.expectedReadinessInspectionCheckpointProduced
  )) {
    const result = createReviewOnlyReadinessInspectionCheckpointForReview(
      artifactCase.input
    );

    assert.equal(result.readinessArtifactAccepted, false, artifactCase.caseId);
    assert.equal(result.readinessInspectionCheckpointProduced, false, artifactCase.caseId);
    assert.equal(result.readinessInspectionCheckpoint, null, artifactCase.caseId);
    assert.equal(result.readinessArtifactSummary, null, artifactCase.caseId);
    assertNonAuthorizingResult(result, artifactCase.caseId);
    assert.ok(
      result.rejectionReasons.includes("readiness_inspection_checkpoint_not_produced"),
      artifactCase.caseId
    );
    assert.ok(result.rejectionReasons.includes("reviewer_routing_not_implemented"));
    assert.ok(result.rejectionReasons.includes("reviewer_assignment_not_implemented"));
    assert.ok(result.rejectionReasons.includes("evaluator_execution_not_implemented"));
    assert.ok(result.rejectionReasons.includes("evaluator_result_not_implemented"));
    assert.ok(result.rejectionReasons.includes("approval_decision_not_implemented"));
    assert.ok(result.rejectionReasons.includes("approval_grant_not_implemented"));
  }
});

test("Phase 5.35 fixture mirrors readiness cases and blocks authorization", async () => {
  const fixture = await readJson(fixtureUrl);

  assert.deepEqual(
    fixture.readinessInspectionCheckpointSummary,
    expectedReadinessSummary
  );
  assertFixtureCases(fixture);
  assertFixtureReadinessArtifact(fixture);
});

test("serve-runtime remains default-blocked and dry-run cannot bypass Phase 5.35", async () => {
  const fixture = await readJson(fixtureUrl);
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-35-readiness-"));

  try {
    for (const args of [
      fixture.serveRuntimeBlockedBehavior.args,
      fixture.serveRuntimeBlockedBehavior.dryRunArgs
    ]) {
      const failure = await runCliFailure(args, { cwd: scratch });
      const label = args.join(" ");

      assert.notEqual(failure.code, 0, label);
      assert.equal(failure.stdout, "", label);
      assert.equal(failure.stderr, fixture.serveRuntimeBlockedBehavior.stderr, label);
      assert.match(failure.stderr, /Runtime unavailable: serve-runtime is recognized/);
      assert.deepEqual(await readdir(scratch), [], `${label} should not write files`);
    }
  } finally {
    await rm(scratch, { recursive: true, force: true });
  }
});

test("Phase 5.35 readiness inspection checkpoint command names remain rejected", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-35-readiness-probes-"));
  const serveRuntimeStderr =
    "Usage: ardyn serve-runtime [--dry-run]\n" +
    "Runtime unavailable: serve-runtime is recognized, but runtime is not enabled in Phase 5.5.\n";

  try {
    for (const commandName of readinessCommandProbes) {
      const failure = await runCliFailure([commandName], { cwd: scratch });

      assert.notEqual(failure.code, 0, commandName);
      assert.equal(failure.stdout, "", commandName);
      if (commandName === "serve-runtime") {
        assert.equal(failure.stderr, serveRuntimeStderr);
      } else {
        assert.match(failure.stderr, /Usage: ardyn /, commandName);
        assert.doesNotMatch(failure.stderr, /Runtime unavailable:/, commandName);
      }
      assert.deepEqual(await readdir(scratch), [], `${commandName} should not write files`);
    }
  } finally {
    await rm(scratch, { recursive: true, force: true });
  }
});

test("Phase 5.35 does not change CLI runtime source or add readiness commands", async () => {
  const [baselineSource, currentSource] = await Promise.all([
    execFileAsync("git", ["show", `${phase535BaselineCommit}:apps/cli/src/index.mjs`], {
      cwd: repoRoot,
      encoding: "utf8",
      maxBuffer: 1024 * 1024
    }),
    readFile(cliSourceUrl, "utf8")
  ]);

  assert.equal(currentSource, baselineSource.stdout);

  for (const forbiddenPattern of [
    /process\.stdin/,
    /process\.stdout\.write\s*\([^)]*runtime/i,
    /process\.stderr\.write\s*\([^)]*runtime/i,
    /node:readline/,
    /node:child_process/,
    /node:http/,
    /node:https/,
    /node:net/,
    /node:dgram/,
    /\bfetch\s*\(/,
    /\bWebSocket\b/,
    /\bspawn\s*\(/,
    /\bfork\s*\(/,
    /\bexec(File)?\s*\(/,
    /\bcreateServer\s*\(/,
    /\.listen\s*\(/,
    /process\.kill\s*\(/,
    /\bwatch\s*\(/,
    /\bwatchFile\s*\(/,
    /\bwriteFile\s*\([^)]*runtime/i,
    /\bappendFile\s*\(/,
    /createReviewOnlyReadinessInspectionCheckpointForReview/,
    /review-only-readiness-inspection-checkpoint/,
    /readiness-inspection-checkpoint/,
    /reviewer-routing/,
    /reviewer-assignment/,
    /evaluator.*execut/i
  ]) {
    assert.doesNotMatch(currentSource, forbiddenPattern);
  }
});
