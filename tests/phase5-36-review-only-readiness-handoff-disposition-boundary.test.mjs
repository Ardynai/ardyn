import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readFile, readdir, rm, mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";
import {
  REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_BOUNDARY_SCHEMA,
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
  createReviewOnlyReadinessHandoffDispositionBoundaryForReview,
  createReviewOnlyReadinessInspectionCheckpointForReview
} from "../packages/core/src/index.mjs";

const execFileAsync = promisify(execFile);
const phase536BaselineCommit = "7ddd3132c8770cea3c6881656085bdcf082394a1";
const reviewedAt = "2026-06-16T00:00:00.000Z";
const defaultReviewedAt = "1970-01-01T00:00:00.000Z";
const repoRootUrl = new URL("../", import.meta.url);
const repoRoot = fileURLToPath(repoRootUrl);
const cliSourceUrl = new URL("../apps/cli/src/index.mjs", import.meta.url);
const cliPath = fileURLToPath(cliSourceUrl);
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-36/review-only-readiness-handoff-disposition-boundary.json",
  import.meta.url
);

const expectedTopLevelKeys = Object.freeze([
  "schema",
  "schemaVersion",
  "phase",
  "boundaryKind",
  "metadataGeneratedAt",
  "sourcePhase",
  "readinessHandoffDispositionSummary",
  "readinessHandoffDispositionInputShape",
  "readinessHandoffDispositionResultShape",
  "readinessHandoffDispositionCases",
  "readinessHandoffDisposition",
  "blockedRuntimeEffect",
  "serveRuntimeBlockedBehavior",
  "forbiddenBehavior",
  "filesAllowedToChange",
  "filesForbiddenToChange",
  "validationCommands"
]);

const expectedCaseIds = Object.freeze([
  "missing-review-only-readiness-handoff-disposition-input-rejected",
  "malformed-review-only-readiness-handoff-disposition-input-rejected",
  "malformed-review-only-readiness-handoff-disposition-invalid-reviewed-at-rejected",
  "empty-review-only-readiness-handoff-disposition-input-rejected",
  "conflicting-review-only-readiness-handoff-disposition-input-rejected",
  "stale-review-only-readiness-handoff-disposition-input-rejected",
  "revoked-review-only-readiness-handoff-disposition-input-rejected",
  "unknown-review-only-readiness-handoff-disposition-input-rejected",
  "duplicate-invalid-review-only-readiness-handoff-disposition-input-rejected",
  "authorizing-looking-review-only-readiness-handoff-disposition-input-rejected",
  "grant-looking-review-only-readiness-handoff-disposition-input-rejected",
  "approval-decision-looking-review-only-readiness-handoff-disposition-input-rejected",
  "approval-grant-looking-review-only-readiness-handoff-disposition-input-rejected",
  "evaluator-result-looking-review-only-readiness-handoff-disposition-input-rejected",
  "evaluator-execution-looking-review-only-readiness-handoff-disposition-input-rejected",
  "reviewer-routing-looking-review-only-readiness-handoff-disposition-input-rejected",
  "reviewer-assignment-looking-review-only-readiness-handoff-disposition-input-rejected",
  "runtime-permission-looking-review-only-readiness-handoff-disposition-input-rejected",
  "command-exposure-looking-review-only-readiness-handoff-disposition-input-rejected",
  "runtime-effect-true-review-only-readiness-handoff-disposition-input-rejected",
  "process-flag-true-review-only-readiness-handoff-disposition-input-rejected",
  "unsafe-top-level-review-only-readiness-handoff-disposition-input-rejected",
  "unsafe-nested-readiness-handoff-disposition-data-review-only-readiness-handoff-disposition-input-rejected",
  "execution-signal-looking-review-only-readiness-handoff-disposition-input-rejected",
  "valid-review-only-readiness-handoff-disposition"
]);

const expectedClassifications = Object.freeze({
  "missing-review-only-readiness-handoff-disposition-input-rejected":
    "missing_review_only_readiness_handoff_disposition_input_rejected",
  "malformed-review-only-readiness-handoff-disposition-input-rejected":
    "malformed_review_only_readiness_handoff_disposition_input_rejected",
  "malformed-review-only-readiness-handoff-disposition-invalid-reviewed-at-rejected":
    "malformed_review_only_readiness_handoff_disposition_input_rejected",
  "empty-review-only-readiness-handoff-disposition-input-rejected":
    "empty_review_only_readiness_handoff_disposition_input_rejected",
  "conflicting-review-only-readiness-handoff-disposition-input-rejected":
    "conflicting_review_only_readiness_handoff_disposition_input_rejected",
  "stale-review-only-readiness-handoff-disposition-input-rejected":
    "stale_review_only_readiness_handoff_disposition_input_rejected",
  "revoked-review-only-readiness-handoff-disposition-input-rejected":
    "revoked_review_only_readiness_handoff_disposition_input_rejected",
  "unknown-review-only-readiness-handoff-disposition-input-rejected":
    "unknown_review_only_readiness_handoff_disposition_input_rejected",
  "duplicate-invalid-review-only-readiness-handoff-disposition-input-rejected":
    "duplicate_invalid_review_only_readiness_handoff_disposition_input_rejected",
  "authorizing-looking-review-only-readiness-handoff-disposition-input-rejected":
    "authorizing_review_only_readiness_handoff_disposition_input_rejected",
  "grant-looking-review-only-readiness-handoff-disposition-input-rejected":
    "grant_looking_review_only_readiness_handoff_disposition_input_rejected",
  "approval-decision-looking-review-only-readiness-handoff-disposition-input-rejected":
    "approval_decision_looking_review_only_readiness_handoff_disposition_input_rejected",
  "approval-grant-looking-review-only-readiness-handoff-disposition-input-rejected":
    "approval_grant_looking_review_only_readiness_handoff_disposition_input_rejected",
  "evaluator-result-looking-review-only-readiness-handoff-disposition-input-rejected":
    "evaluator_result_looking_review_only_readiness_handoff_disposition_input_rejected",
  "evaluator-execution-looking-review-only-readiness-handoff-disposition-input-rejected":
    "evaluator_execution_looking_review_only_readiness_handoff_disposition_input_rejected",
  "reviewer-routing-looking-review-only-readiness-handoff-disposition-input-rejected":
    "reviewer_routing_looking_review_only_readiness_handoff_disposition_input_rejected",
  "reviewer-assignment-looking-review-only-readiness-handoff-disposition-input-rejected":
    "reviewer_assignment_looking_review_only_readiness_handoff_disposition_input_rejected",
  "runtime-permission-looking-review-only-readiness-handoff-disposition-input-rejected":
    "runtime_permission_looking_review_only_readiness_handoff_disposition_input_rejected",
  "command-exposure-looking-review-only-readiness-handoff-disposition-input-rejected":
    "command_exposure_looking_review_only_readiness_handoff_disposition_input_rejected",
  "runtime-effect-true-review-only-readiness-handoff-disposition-input-rejected":
    "runtime_effect_true_review_only_readiness_handoff_disposition_input_rejected",
  "process-flag-true-review-only-readiness-handoff-disposition-input-rejected":
    "process_flag_true_review_only_readiness_handoff_disposition_input_rejected",
  "unsafe-top-level-review-only-readiness-handoff-disposition-input-rejected":
    "unsafe_review_only_readiness_handoff_disposition_input_rejected",
  "unsafe-nested-readiness-handoff-disposition-data-review-only-readiness-handoff-disposition-input-rejected":
    "unsafe_review_only_readiness_handoff_disposition_input_rejected",
  "execution-signal-looking-review-only-readiness-handoff-disposition-input-rejected":
    "execution_signal_looking_review_only_readiness_handoff_disposition_input_rejected",
  "valid-review-only-readiness-handoff-disposition":
    "valid_review_only_readiness_handoff_disposition_runtime_still_blocked"
});

const handoffDispositionCommandProbes = Object.freeze([
  "review-only-readiness-handoff-disposition",
  "review-only-readiness-handoff-disposition-boundary",
  "create-review-only-readiness-handoff-disposition-boundary",
  "readiness-handoff-disposition",
  "phase-5-36-review-only-readiness-handoff-disposition-boundary",
  "reviewer-routing",
  "reviewer-assignment",
  "serve-runtime"
]);

const expectedHandoffDispositionSummary = Object.freeze({
  reviewOnlyReadinessHandoffDispositionRecorded: true,
  boundaryKind: "review-only-readiness-handoff-disposition-boundary",
  boundaryReviewOnly: true,
  boundaryAuthoritative: false,
  validReadinessInspectionCheckpointProducesHandoffDisposition: true,
  missingReadinessInspectionCheckpointRejected: true,
  malformedReadinessInspectionCheckpointRejected: true,
  emptyReadinessInspectionCheckpointRejected: true,
  conflictingReadinessInspectionCheckpointRejected: true,
  staleReadinessInspectionCheckpointRejected: true,
  revokedReadinessInspectionCheckpointRejected: true,
  unknownReadinessInspectionCheckpointRejected: true,
  duplicateInvalidReadinessInspectionCheckpointRejected: true,
  authorizingLookingReadinessInspectionCheckpointRejected: true,
  grantLookingReadinessInspectionCheckpointRejected: true,
  approvalDecisionLookingReadinessInspectionCheckpointRejected: true,
  approvalGrantLookingReadinessInspectionCheckpointRejected: true,
  evaluatorResultLookingReadinessInspectionCheckpointRejected: true,
  evaluatorExecutionLookingReadinessInspectionCheckpointRejected: true,
  reviewerRoutingLookingReadinessInspectionCheckpointRejected: true,
  reviewerAssignmentLookingReadinessInspectionCheckpointRejected: true,
  runtimePermissionLookingReadinessInspectionCheckpointRejected: true,
  commandExposureLookingReadinessInspectionCheckpointRejected: true,
  runtimeEffectTrueReadinessInspectionCheckpointRejected: true,
  processFlagTrueReadinessInspectionCheckpointRejected: true,
  unsafeReadinessInspectionCheckpointRejected: true,
  executionSignalLookingReadinessInspectionCheckpointRejected: true,
  readinessHandoffDispositionIsReviewerRouting: false,
  readinessHandoffDispositionIsReviewerAssignment: false,
  readinessHandoffDispositionIsEvaluatorExecution: false,
  readinessHandoffDispositionIsEvaluatorResult: false,
  readinessHandoffDispositionIsApprovalDecision: false,
  readinessHandoffDispositionIsApprovalGrant: false,
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

function validReadinessInspectionCheckpoint(sourceId = "source-valid") {
  const checkpoint = createReviewOnlyReadinessInspectionCheckpointForReview({
    reviewedAt,
    readinessArtifacts: [validReadinessArtifact(sourceId)]
  });

  assert.equal(checkpoint.readinessInspectionCheckpointProduced, true, sourceId);
  assert.equal(checkpoint.readinessInspectionCheckpointIsReviewerRouting, false, sourceId);
  assert.equal(
    checkpoint.readinessInspectionCheckpointIsReviewerAssignment,
    false,
    sourceId
  );
  assert.equal(checkpoint.evaluatorResultProduced, false, sourceId);
  assert.equal(checkpoint.evaluatorExecuted, false, sourceId);
  return clone(checkpoint.readinessInspectionCheckpoint);
}

function rejectedHandoffDispositionCase(caseId, readinessInspectionCheckpoints) {
  return {
    caseId,
    input: { reviewedAt, readinessInspectionCheckpoints },
    expectedReadinessHandoffDispositionProduced: false
  };
}

function acceptedHandoffDispositionCase(caseId, readinessInspectionCheckpoints) {
  return {
    caseId,
    input: { reviewedAt, readinessInspectionCheckpoints },
    expectedReadinessHandoffDispositionProduced: true
  };
}

function checkpointWith(sourceId, overrides) {
  return {
    ...validReadinessInspectionCheckpoint(sourceId),
    ...overrides
  };
}

function checkpointWithNested(sourceId, nestedKey, nestedSourceId, overrides) {
  return {
    ...validReadinessInspectionCheckpoint(sourceId),
    [nestedKey]: {
      ...validReadinessInspectionCheckpoint(nestedSourceId)[nestedKey],
      ...overrides
    }
  };
}

function missingHandoffDispositionCase() {
  return {
    caseId: "missing-review-only-readiness-handoff-disposition-input-rejected",
    input: { reviewedAt },
    expectedReadinessHandoffDispositionProduced: false
  };
}

function requiredShapeHandoffDispositionCases(duplicateState) {
  return [
    missingHandoffDispositionCase(),
    rejectedHandoffDispositionCase(
      "malformed-review-only-readiness-handoff-disposition-input-rejected",
      [checkpointWith("source-malformed", { stateMode: "runtime" })]
    ),
    rejectedHandoffDispositionCase(
      "malformed-review-only-readiness-handoff-disposition-invalid-reviewed-at-rejected",
      [checkpointWith("source-invalid-reviewed-at", { reviewedAt: "not-a-date" })]
    ),
    rejectedHandoffDispositionCase(
      "empty-review-only-readiness-handoff-disposition-input-rejected",
      []
    ),
    rejectedHandoffDispositionCase(
      "conflicting-review-only-readiness-handoff-disposition-input-rejected",
      [
        validReadinessInspectionCheckpoint("source-conflict-a"),
        validReadinessInspectionCheckpoint("source-conflict-b")
      ]
    ),
    rejectedHandoffDispositionCase(
      "stale-review-only-readiness-handoff-disposition-input-rejected",
      [
        checkpointWith("source-stale", {
          reviewedAt: "2026-06-15T00:00:00.000Z"
        })
      ]
    ),
    rejectedHandoffDispositionCase(
      "revoked-review-only-readiness-handoff-disposition-input-rejected",
      [
        checkpointWith("source-revoked", {
          revocation: {
            revoked: true,
            revokedAt: "2026-06-16T00:00:00.000Z",
            revocationReason: "operator-revoked"
          }
        })
      ]
    ),
    rejectedHandoffDispositionCase(
      "unknown-review-only-readiness-handoff-disposition-input-rejected",
      [
        checkpointWith("source-unknown", {
          schema: "ardyn.phase-5.35.unknown-readiness-inspection-checkpoint-state",
          stateKind: "unknown-readiness-inspection-checkpoint-state"
        })
      ]
    ),
    rejectedHandoffDispositionCase(
      "duplicate-invalid-review-only-readiness-handoff-disposition-input-rejected",
      [duplicateState, clone(duplicateState)]
    )
  ];
}

function authorizationHandoffDispositionCases() {
  return [
    rejectedHandoffDispositionCase(
      "authorizing-looking-review-only-readiness-handoff-disposition-input-rejected",
      [checkpointWith("source-authorizing", { authoritative: true })]
    ),
    rejectedHandoffDispositionCase(
      "grant-looking-review-only-readiness-handoff-disposition-input-rejected",
      [checkpointWith("source-grant", { grantProduced: true })]
    ),
    rejectedHandoffDispositionCase(
      "approval-decision-looking-review-only-readiness-handoff-disposition-input-rejected",
      [
        checkpointWith("source-approval-decision", {
          approvalDecisionProduced: true
        })
      ]
    ),
    rejectedHandoffDispositionCase(
      "approval-grant-looking-review-only-readiness-handoff-disposition-input-rejected",
      [checkpointWith("source-approval-grant", { approvalGrantProduced: true })]
    ),
    rejectedHandoffDispositionCase(
      "evaluator-result-looking-review-only-readiness-handoff-disposition-input-rejected",
      [
        checkpointWith("source-evaluator-result", {
          evaluatorResultProduced: true
        })
      ]
    ),
    rejectedHandoffDispositionCase(
      "evaluator-execution-looking-review-only-readiness-handoff-disposition-input-rejected",
      [
        checkpointWith("source-evaluator-execution", {
          evaluatorExecutionRequested: true
        })
      ]
    ),
    rejectedHandoffDispositionCase(
      "reviewer-routing-looking-review-only-readiness-handoff-disposition-input-rejected",
      [
        checkpointWith("source-reviewer-routing", {
          reviewerRouting: { queue: "ops" }
        })
      ]
    ),
    rejectedHandoffDispositionCase(
      "reviewer-assignment-looking-review-only-readiness-handoff-disposition-input-rejected",
      [
        checkpointWith("source-reviewer-assignment", {
          reviewerAssignment: { reviewerId: "human-reviewer-1" }
        })
      ]
    ),
    rejectedHandoffDispositionCase(
      "runtime-permission-looking-review-only-readiness-handoff-disposition-input-rejected",
      [
        checkpointWith("source-runtime-permission", {
          runtimePermissionGranted: true
        })
      ]
    ),
    rejectedHandoffDispositionCase(
      "command-exposure-looking-review-only-readiness-handoff-disposition-input-rejected",
      [
        checkpointWith("source-command-exposure", {
          commandExposurePermissionGranted: true
        })
      ]
    ),
    rejectedHandoffDispositionCase(
      "runtime-effect-true-review-only-readiness-handoff-disposition-input-rejected",
      [
        checkpointWithNested(
          "source-runtime-effect",
          "runtimeEffect",
          "source-runtime-effect-nested",
          {
            runtimeEnabled: true
          }
        )
      ]
    ),
    rejectedHandoffDispositionCase(
      "process-flag-true-review-only-readiness-handoff-disposition-input-rejected",
      [checkpointWith("source-process", { processSpawnEnabled: true })]
    ),
    rejectedHandoffDispositionCase(
      "unsafe-top-level-review-only-readiness-handoff-disposition-input-rejected",
      [
        checkpointWith("source-unsafe", {
          externalSourceLookupEnabled: true
        })
      ]
    ),
    rejectedHandoffDispositionCase(
      "unsafe-nested-readiness-handoff-disposition-data-review-only-readiness-handoff-disposition-input-rejected",
      [
        checkpointWith("source-unsafe-nested", {
          readinessHandoffDisposition: { envSecretsReaderEnabled: true }
        })
      ]
    ),
    rejectedHandoffDispositionCase(
      "execution-signal-looking-review-only-readiness-handoff-disposition-input-rejected",
      [checkpointWith("source-execution-signal", { executionSignal: true })]
    )
  ];
}

function handoffDispositionCases() {
  const duplicateState = validReadinessInspectionCheckpoint("source-duplicate");

  return [
    ...requiredShapeHandoffDispositionCases(duplicateState),
    ...authorizationHandoffDispositionCases(),
    acceptedHandoffDispositionCase(
      "valid-review-only-readiness-handoff-disposition",
      [validReadinessInspectionCheckpoint("source-valid-checkpoint")]
    )
  ];
}

function validHandoffDispositionResult() {
  const validCase = handoffDispositionCases().find(
    (entry) => entry.caseId === "valid-review-only-readiness-handoff-disposition"
  );

  return createReviewOnlyReadinessHandoffDispositionBoundaryForReview(
    validCase.input
  );
}

function assertRuntimeEffectFalse(runtimeEffect) {
  for (const [field, value] of Object.entries(runtimeEffect)) {
    assert.equal(value, false, field);
  }
}

function assertNonAuthorizingResult(result, label = result.classification) {
  assert.equal(result.reviewOnly, true, label);
  assert.equal(result.authoritative, false, label);
  assert.equal(result.reviewArtifactOnly, true, label);
  assert.equal(result.readinessHandoffDispositionIsReviewerRouting, false, label);
  assert.equal(
    result.readinessHandoffDispositionIsReviewerAssignment,
    false,
    label
  );
  assert.equal(result.readinessHandoffDispositionIsEvaluatorExecution, false, label);
  assert.equal(result.readinessHandoffDispositionIsEvaluatorResult, false, label);
  assert.equal(result.readinessHandoffDispositionIsApprovalDecision, false, label);
  assert.equal(result.readinessHandoffDispositionIsApprovalGrant, false, label);
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
  assertRuntimeEffectFalse(result.runtimeEffect);
}

function assertValidReadinessHandoffDisposition(disposition) {
  assert.equal(
    disposition.schema,
    "ardyn.phase-5.36.review-only-readiness-handoff-disposition-state"
  );
  assert.equal(disposition.schemaVersion, "0.1.0");
  assert.equal(disposition.stateKind, "review-only-readiness-handoff-disposition-state");
  assert.equal(disposition.stateMode, "review-only");
  assert.equal(disposition.reviewedAt, reviewedAt);
  assert.match(disposition.sourceReadinessInspectionCheckpoint.stateDigest, /^sha256:[0-9a-f]{64}$/);
  assert.match(
    disposition.sourceReadinessInspectionCheckpoint
      .sourceHandoffReadinessArtifactDigest,
    /^sha256:[0-9a-f]{64}$/
  );
  assert.equal(disposition.readinessInspectionCheckpointAccepted, true);
  assert.equal(disposition.readinessHandoffDispositionMetadataOnly, true);
  assert.equal(disposition.readinessHandoffDispositionIsReviewerRouting, false);
  assert.equal(disposition.readinessHandoffDispositionIsReviewerAssignment, false);
  assert.equal(disposition.readinessHandoffDispositionIsEvaluatorExecution, false);
  assert.equal(disposition.readinessHandoffDispositionIsEvaluatorResult, false);
  assert.equal(disposition.readinessHandoffDispositionIsApprovalDecision, false);
  assert.equal(disposition.readinessHandoffDispositionIsApprovalGrant, false);
  assert.equal(disposition.reviewerRoutingPerformed, false);
  assert.equal(disposition.reviewerRoutingEnabled, false);
  assert.equal(disposition.reviewerRouteId, null);
  assert.equal(disposition.reviewerAssignmentPerformed, false);
  assert.equal(disposition.reviewerAssignmentEnabled, false);
  assert.equal(disposition.reviewerAssignmentId, null);
  assert.equal(disposition.reviewerId, null);
  assert.equal(disposition.evaluatorResultProduced, false);
  assert.equal(disposition.evaluatorResultPersisted, false);
  assert.equal(disposition.evaluatorResultId, null);
  assert.equal(disposition.approvalDecisionProduced, false);
  assert.equal(disposition.approvalDecisionPersisted, false);
  assert.equal(disposition.approvalDecisionId, null);
  assert.equal(disposition.approvalGrantProduced, false);
  assert.equal(disposition.approvalGrantPersisted, false);
  assert.equal(disposition.approvalGrantId, null);
  assert.equal(disposition.runtimePermissionGranted, false);
  assert.equal(disposition.commandExposurePermissionGranted, false);
  assert.equal(disposition.runtimeCommandExposureEnabled, false);
  assert.equal(disposition.runtimeExecutionEnabled, false);
  assert.equal(disposition.evaluatorExecutionRequested, false);
  assert.equal(disposition.evaluatorExecutionStarted, false);
  assert.equal(disposition.evaluatorExecutionEnabled, false);
  assert.equal(disposition.evaluatorExecuted, false);
  assertRuntimeEffectFalse(disposition.runtimeEffect);
  assert.deepEqual(disposition.readinessHandoffDispositionSummary, {
    dispositionKind: "review-only-readiness-handoff-disposition",
    dispositionMode: "review-only",
    sourceReadinessInspectionClassification:
      "valid_review_only_readiness_inspection_checkpoint_runtime_still_blocked",
    readinessHandoffDispositionMetadataOnly: true,
    reviewerRoutingPerformed: false,
    reviewerAssignmentPerformed: false,
    evaluatorExecutionPerformed: false,
    evaluatorResultProduced: false,
    approvalDecisionProduced: false,
    approvalGrantProduced: false,
    runtimePermissionGranted: false,
    commandExposurePermissionGranted: false,
    evaluatorExecuted: false,
    runtimeEffectAllFalse: true
  });
}

function expectedFixture() {
  const cases = handoffDispositionCases().map((entry) => {
    const result = createReviewOnlyReadinessHandoffDispositionBoundaryForReview(
      entry.input
    );
    return {
      caseId: entry.caseId,
      classification: result.classification,
      reviewOnly: result.reviewOnly,
      authoritative: result.authoritative,
      reviewArtifactOnly: result.reviewArtifactOnly,
      readinessHandoffDispositionProduced:
        result.readinessHandoffDispositionProduced,
      readinessHandoffDispositionIsReviewerRouting:
        result.readinessHandoffDispositionIsReviewerRouting,
      readinessHandoffDispositionIsReviewerAssignment:
        result.readinessHandoffDispositionIsReviewerAssignment,
      readinessHandoffDispositionIsEvaluatorExecution:
        result.readinessHandoffDispositionIsEvaluatorExecution,
      readinessHandoffDispositionIsEvaluatorResult:
        result.readinessHandoffDispositionIsEvaluatorResult,
      readinessHandoffDispositionIsApprovalDecision:
        result.readinessHandoffDispositionIsApprovalDecision,
      readinessHandoffDispositionIsApprovalGrant:
        result.readinessHandoffDispositionIsApprovalGrant,
      reviewerRoutingPerformed: result.reviewerRoutingPerformed,
      reviewerAssignmentPerformed: result.reviewerAssignmentPerformed,
      evaluatorResultProduced: result.evaluatorResultProduced,
      approvalDecisionProduced: result.approvalDecisionProduced,
      approvalGrant: result.approvalGrant,
      approvalGrantProduced: result.approvalGrantProduced,
      approvalGrantPersisted: result.approvalGrantPersisted,
      runtimePermissionGranted: result.runtimePermissionGranted,
      commandExposurePermissionGranted: result.commandExposurePermissionGranted,
      evaluatorExecuted: result.evaluatorExecuted,
      runtimeEffect: result.runtimeEffect
    };
  });
  const validResult = validHandoffDispositionResult();

  return {
    schema: "ardyn.phase-5.36.review-only-readiness-handoff-disposition-boundary",
    schemaVersion: "0.1.0",
    phase: "phase-5.36-review-only-readiness-handoff-disposition-boundary",
    boundaryKind: "review-only-readiness-handoff-disposition-boundary",
    metadataGeneratedAt: defaultReviewedAt,
    sourcePhase: {
      phase: "phase-5.35-review-only-readiness-inspection-checkpoint",
      artifactKind: "review-only-readiness-inspection-checkpoint",
      fixture:
        "tests/fixtures/host-policy/phase5-35/review-only-readiness-inspection-checkpoint.json"
    },
    readinessHandoffDispositionSummary: expectedHandoffDispositionSummary,
    readinessHandoffDispositionInputShape: {
      reviewedAt: "UTC ISO timestamp with milliseconds",
      readinessInspectionCheckpoints:
        "exactly one Phase 5.35 review-only readiness inspection checkpoint state"
    },
    readinessHandoffDispositionResultShape: {
      schema:
        "ardyn.phase-5.36.review-only-readiness-handoff-disposition-boundary-result",
      stateSchema:
        "ardyn.phase-5.36.review-only-readiness-handoff-disposition-state",
      output: "review-only handoff disposition metadata only",
      producesApprovalDecision: false,
      producesApprovalGrant: false,
      persistsApprovalGrant: false,
      performsReviewerRouting: false,
      assignsReviewers: false,
      executesEvaluator: false,
      producesEvaluatorResult: false,
      grantsRuntimePermission: false,
      grantsCommandExposurePermission: false,
      enablesRuntime: false,
      enablesRuntimeCommandExposure: false,
      enablesRuntimeExecution: false
    },
    readinessHandoffDispositionCases: cases,
    readinessHandoffDisposition: validResult.readinessHandoffDisposition,
    blockedRuntimeEffect: validResult.runtimeEffect,
    serveRuntimeBlockedBehavior: {
      serveRuntimeDefaultBlocked: true,
      dryRunBypassesBlock: false,
      runtimeEnabled: false,
      runtimeCommandExposureEnabled: false,
      runtimeExecutionEnabled: false
    },
    forbiddenBehavior: {
      reviewerRoutingPerformed: false,
      reviewerAssignmentPerformed: false,
      evaluatorExecuted: false,
      evaluatorResultProduced: false,
      approvalDecisionProduced: false,
      approvalGrantProduced: false,
      approvalGrantPersisted: false,
      runtimePermissionGranted: false,
      commandExposurePermissionGranted: false,
      runtimeCommandExposureEnabled: false,
      runtimeExecutionEnabled: false,
      filesystemWatcherEnabled: false,
      externalSourceLookupEnabled: false,
      secretsEnvIngestionEnabled: false
    },
    filesAllowedToChange: [
      "packages/core/src/index.mjs",
      "packages/core/src/index.d.ts",
      "tests/phase5-36-review-only-readiness-handoff-disposition-boundary.test.mjs",
      "tests/fixtures/host-policy/phase5-36/review-only-readiness-handoff-disposition-boundary.json",
      "docs/phase-5-36-review-only-readiness-handoff-disposition-boundary.md",
      "docs/phase-5-35-review-only-readiness-inspection-checkpoint.md",
      "scripts/report-phase-status.mjs",
      "tests/report-phase-status.test.mjs",
      "README.md",
      "apps/cli/README.md",
      "crates/ardyn-host/README.md"
    ],
    filesForbiddenToChange: [
      "apps/cli/src/index.mjs",
      "crates/ardyn-host/src/lib.rs",
      "crates/ardyn-host/src/stdio_runtime.rs"
    ],
    validationCommands: [
      "node --test tests/phase5-36-review-only-readiness-handoff-disposition-boundary.test.mjs",
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
  const error = await execFileAsync(
    process.execPath,
    [cliPath, ...args],
    {
      cwd: options.cwd ?? repoRoot,
      encoding: "utf8"
    }
  ).then(
    (result) =>
      assert.fail(
        `Expected ardyn ${args.join(" ")} to fail, got stdout: ${result.stdout}`
      ),
    (failure) => failure
  );

  assert.equal(typeof error.code, "number");
  assert.equal(typeof error.stdout, "string");
  assert.equal(typeof error.stderr, "string");

  return {
    code: error.code,
    stdout: error.stdout,
    stderr: error.stderr
  };
}

test("Phase 5.36 readiness handoff disposition fixture is deterministic metadata", async () => {
  const fixture = JSON.parse(await readFile(fixtureUrl, "utf8"));

  assert.deepEqual(Object.keys(fixture), expectedTopLevelKeys);
  assert.deepEqual(fixture, expectedFixture());
  assert.equal(fixture.readinessHandoffDispositionSummary.boundaryReviewOnly, true);
  assert.equal(fixture.readinessHandoffDispositionSummary.boundaryAuthoritative, false);
  assert.equal(fixture.readinessHandoffDispositionSummary.approvalGrantProduced, false);
  assert.equal(fixture.readinessHandoffDispositionSummary.runtimeExecutionEnabled, false);
});

test("Phase 5.36 readiness handoff disposition classifies checkpoint cases", () => {
  for (const checkpointCase of handoffDispositionCases()) {
    const result = createReviewOnlyReadinessHandoffDispositionBoundaryForReview(
      checkpointCase.input
    );

    assert.equal(result.schema, REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_BOUNDARY_SCHEMA);
    assert.equal(result.boundaryKind, "review-only-readiness-handoff-disposition-boundary");
    assert.equal(result.boundaryMode, "review-only");
    assert.equal(result.classification, expectedClassifications[checkpointCase.caseId]);
    assert.equal(
      result.readinessHandoffDispositionProduced,
      checkpointCase.expectedReadinessHandoffDispositionProduced,
      checkpointCase.caseId
    );
    assertNonAuthorizingResult(result, checkpointCase.caseId);
    if (!checkpointCase.expectedReadinessHandoffDispositionProduced) {
      assert.equal(result.readinessHandoffDisposition, null, checkpointCase.caseId);
      assert.equal(result.readinessInspectionCheckpointSummary, null, checkpointCase.caseId);
    }
  }
});

test("Phase 5.36 malformed boundary input fails closed without throwing", () => {
  for (const input of [null, "bad", 42, false, []]) {
    const result = createReviewOnlyReadinessHandoffDispositionBoundaryForReview(input);
    assert.equal(
      result.classification,
      "malformed_review_only_readiness_handoff_disposition_input_rejected"
    );
    assert.equal(result.reviewedAt, defaultReviewedAt);
    assert.equal(result.readinessHandoffDispositionProduced, false);
    assertNonAuthorizingResult(result);
  }

  const invalidReviewedAt = createReviewOnlyReadinessHandoffDispositionBoundaryForReview({
    reviewedAt: "not-a-date",
    readinessInspectionCheckpoints: [validReadinessInspectionCheckpoint("invalid-reviewed-at")]
  });
  assert.equal(
    invalidReviewedAt.classification,
    "malformed_review_only_readiness_handoff_disposition_input_rejected"
  );
  assert.equal(invalidReviewedAt.reviewedAt, defaultReviewedAt);
  assert.equal(invalidReviewedAt.readinessHandoffDispositionProduced, false);
});

test("Phase 5.36 valid checkpoint produces only handoff disposition metadata", () => {
  const result = validHandoffDispositionResult();

  assert.equal(
    result.classification,
    "valid_review_only_readiness_handoff_disposition_runtime_still_blocked"
  );
  assert.equal(result.readinessInspectionCheckpointAccepted, true);
  assert.equal(result.readinessHandoffDispositionProduced, true);
  assertNonAuthorizingResult(result);
  assert.deepEqual(result.rejectionReasons, [
    "readiness_handoff_disposition_is_review_only",
    "reviewer_routing_not_implemented",
    "reviewer_assignment_not_implemented",
    "evaluator_execution_not_implemented",
    "evaluator_result_not_implemented",
    "approval_decision_not_implemented",
    "approval_grant_not_implemented",
    "runtime_enablement_still_blocked"
  ]);
  assert.equal(
    result.readinessInspectionCheckpointSummary.schema,
    "ardyn.phase-5.35.review-only-readiness-inspection-checkpoint-state"
  );
  assert.equal(
    result.readinessInspectionCheckpointSummary.readinessInspectionCheckpointIsApprovalGrant,
    false
  );
  assert.equal(result.readinessInspectionCheckpointSummary.approvalGrantPersisted, false);
  assertValidReadinessHandoffDisposition(result.readinessHandoffDisposition);
});

test("Phase 5.36 rejected checkpoint fails closed before handoff disposition", () => {
  const rejectedCases = handoffDispositionCases().filter(
    (entry) => !entry.expectedReadinessHandoffDispositionProduced
  );

  for (const checkpointCase of rejectedCases) {
    const result = createReviewOnlyReadinessHandoffDispositionBoundaryForReview(
      checkpointCase.input
    );
    assert.equal(result.readinessInspectionCheckpointAccepted, false, checkpointCase.caseId);
    assert.equal(result.readinessHandoffDispositionProduced, false, checkpointCase.caseId);
    assert.equal(result.readinessHandoffDisposition, null, checkpointCase.caseId);
    assert.equal(result.readinessInspectionCheckpointSummary, null, checkpointCase.caseId);
    assertNonAuthorizingResult(result, checkpointCase.caseId);
  }
});

test("Phase 5.36 fixture mirrors handoff disposition cases and blocks authorization", async () => {
  const fixture = JSON.parse(await readFile(fixtureUrl, "utf8"));

  assert.deepEqual(
    fixture.readinessHandoffDispositionCases.map((entry) => entry.caseId),
    expectedCaseIds
  );
  assert.deepEqual(fixture.readinessHandoffDispositionSummary, expectedHandoffDispositionSummary);

  for (const artifactCase of fixture.readinessHandoffDispositionCases) {
    assert.equal(artifactCase.classification, expectedClassifications[artifactCase.caseId]);
    assert.equal(artifactCase.reviewOnly, true);
    assert.equal(artifactCase.authoritative, false);
    assert.equal(artifactCase.reviewArtifactOnly, true);
    assert.equal(artifactCase.readinessHandoffDispositionIsReviewerRouting, false);
    assert.equal(artifactCase.readinessHandoffDispositionIsReviewerAssignment, false);
    assert.equal(artifactCase.readinessHandoffDispositionIsEvaluatorExecution, false);
    assert.equal(artifactCase.readinessHandoffDispositionIsEvaluatorResult, false);
    assert.equal(artifactCase.readinessHandoffDispositionIsApprovalDecision, false);
    assert.equal(artifactCase.readinessHandoffDispositionIsApprovalGrant, false);
    assert.equal(artifactCase.reviewerRoutingPerformed, false);
    assert.equal(artifactCase.reviewerAssignmentPerformed, false);
    assert.equal(artifactCase.evaluatorResultProduced, false);
    assert.equal(artifactCase.approvalDecisionProduced, false);
    assert.equal(artifactCase.approvalGrant.produced, false);
    assert.equal(artifactCase.approvalGrant.persisted, false);
    assert.equal(artifactCase.approvalGrant.grantId, null);
    assert.equal(artifactCase.approvalGrantProduced, false);
    assert.equal(artifactCase.approvalGrantPersisted, false);
    assert.equal(artifactCase.runtimePermissionGranted, false);
    assert.equal(artifactCase.commandExposurePermissionGranted, false);
    assert.equal(artifactCase.evaluatorExecuted, false);
    assertRuntimeEffectFalse(artifactCase.runtimeEffect);
  }

  assertValidReadinessHandoffDisposition(fixture.readinessHandoffDisposition);
});

test("serve-runtime remains default-blocked and dry-run cannot bypass Phase 5.36", async () => {
  for (const args of [
    ["serve-runtime"],
    ["serve-runtime", "--dry-run"]
  ]) {
    const tempDir = await mkdtemp(join(tmpdir(), "ardyn-phase5-36-"));
    try {
      const result = await runCliFailure(args, { cwd: tempDir });

      assert.equal(result.code, 1);
      assert.equal(result.stdout, "");
      assert.match(result.stderr, /runtime unavailable: serve-runtime is recognized, but runtime is not enabled/i);
      assert.deepEqual(await readdir(tempDir), []);
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  }
});

test("Phase 5.36 readiness handoff disposition command names remain rejected", async () => {
  for (const command of handoffDispositionCommandProbes) {
    const tempDir = await mkdtemp(join(tmpdir(), "ardyn-phase5-36-command-"));
    try {
      const result = await runCliFailure([command], { cwd: tempDir });

      assert.notEqual(result.code, 0, command);
      assert.equal(result.stdout, "", command);
      assert.deepEqual(await readdir(tempDir), [], command);
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  }
});

test("Phase 5.36 does not change CLI runtime source or add disposition commands", async () => {
  const [currentCliSource, baselineCliSource] = await Promise.all([
    readFile(cliSourceUrl, "utf8"),
    execFileAsync("git", ["show", `${phase536BaselineCommit}:apps/cli/src/index.mjs`], {
      cwd: repoRoot,
      encoding: "utf8",
      maxBuffer: 1024 * 1024
    }).then(({ stdout }) => stdout)
  ]);

  assert.equal(currentCliSource, baselineCliSource);
  for (const forbiddenPattern of [
    /review-only-readiness-handoff-disposition/,
    /readiness-handoff-disposition/,
    /createReviewOnlyReadinessHandoffDispositionBoundaryForReview/,
    /reviewer-routing/,
    /reviewer-assignment/,
    /node:child_process/,
    /node:readline/,
    /process\.stdin/,
    /createServer/,
    /WebSocket/,
    /watch\s*\(/
  ]) {
    assert.doesNotMatch(currentCliSource, forbiddenPattern);
  }
});
