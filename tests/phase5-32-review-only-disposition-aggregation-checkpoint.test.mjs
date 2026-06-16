import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readFile, readdir, rm, mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";
import {
  REVIEW_ONLY_DISPOSITION_AGGREGATION_CHECKPOINT_SCHEMA,
  createApprovalEvaluatorCandidateIntakeCheckpointForReview,
  createHumanToolInspectionDispositionBoundaryForReview,
  createNonAuthorizingEvaluatorDecisionCandidateBoundaryForReview,
  createNonAuthorizingEvaluatorDecisionCandidateInspectionArtifactForReview,
  createPrerequisiteReviewArtifactBoundaryForReview,
  createReviewArtifactEvaluatorInputHandoffForReview,
  createReviewOnlyDispositionAggregationCheckpointForReview,
  createReviewOnlyEvaluatorPreflightCheckpointForReview
} from "../packages/core/src/index.mjs";

const execFileAsync = promisify(execFile);
const phase532BaselineCommit = "054f5afa00a0544903022806561f89f643afcd82";
const reviewedAt = "2026-06-16T00:00:00.000Z";
const defaultReviewedAt = "1970-01-01T00:00:00.000Z";
const repoRootUrl = new URL("../", import.meta.url);
const repoRoot = fileURLToPath(repoRootUrl);
const cliSourceUrl = new URL("../apps/cli/src/index.mjs", import.meta.url);
const cliPath = fileURLToPath(cliSourceUrl);
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-32/review-only-disposition-aggregation-checkpoint.json",
  import.meta.url
);

const expectedTopLevelKeys = Object.freeze([
  "schema",
  "schemaVersion",
  "phase",
  "artifactKind",
  "metadataGeneratedAt",
  "sourcePhase",
  "aggregationCheckpointSummary",
  "aggregationCheckpointInputShape",
  "aggregationCheckpointResultShape",
  "aggregationCheckpointCases",
  "aggregationCheckpoint",
  "blockedRuntimeEffect",
  "serveRuntimeBlockedBehavior",
  "forbiddenBehavior",
  "filesAllowedToChange",
  "filesForbiddenToChange",
  "validationCommands"
]);

const expectedCaseIds = Object.freeze([
  "missing-review-only-disposition-aggregation-checkpoint-input-rejected",
  "malformed-review-only-disposition-aggregation-checkpoint-input-rejected",
  "malformed-review-only-disposition-aggregation-checkpoint-invalid-reviewed-at-rejected",
  "empty-review-only-disposition-aggregation-checkpoint-input-rejected",
  "conflicting-review-only-disposition-aggregation-checkpoint-input-rejected",
  "stale-review-only-disposition-aggregation-checkpoint-input-rejected",
  "revoked-review-only-disposition-aggregation-checkpoint-input-rejected",
  "unknown-review-only-disposition-aggregation-checkpoint-input-rejected",
  "duplicate-invalid-review-only-disposition-aggregation-checkpoint-input-rejected",
  "authorizing-looking-review-only-disposition-aggregation-checkpoint-input-rejected",
  "grant-looking-review-only-disposition-aggregation-checkpoint-input-rejected",
  "approval-decision-looking-review-only-disposition-aggregation-checkpoint-input-rejected",
  "approval-grant-looking-review-only-disposition-aggregation-checkpoint-input-rejected",
  "evaluator-result-looking-review-only-disposition-aggregation-checkpoint-input-rejected",
  "evaluator-execution-looking-review-only-disposition-aggregation-checkpoint-input-rejected",
  "reviewer-routing-looking-review-only-disposition-aggregation-checkpoint-input-rejected",
  "runtime-permission-looking-review-only-disposition-aggregation-checkpoint-input-rejected",
  "command-exposure-looking-review-only-disposition-aggregation-checkpoint-input-rejected",
  "runtime-effect-true-review-only-disposition-aggregation-checkpoint-input-rejected",
  "process-flag-true-review-only-disposition-aggregation-checkpoint-input-rejected",
  "unsafe-top-level-review-only-disposition-aggregation-checkpoint-input-rejected",
  "unsafe-nested-disposition-aggregation-data-review-only-disposition-aggregation-checkpoint-input-rejected",
  "execution-signal-looking-review-only-disposition-aggregation-checkpoint-input-rejected",
  "valid-review-only-disposition-aggregation-checkpoint"
]);

const expectedClassifications = Object.freeze({
  "missing-review-only-disposition-aggregation-checkpoint-input-rejected":
    "missing_review_only_disposition_aggregation_checkpoint_input_rejected",
  "malformed-review-only-disposition-aggregation-checkpoint-input-rejected":
    "malformed_review_only_disposition_aggregation_checkpoint_input_rejected",
  "malformed-review-only-disposition-aggregation-checkpoint-invalid-reviewed-at-rejected":
    "malformed_review_only_disposition_aggregation_checkpoint_input_rejected",
  "empty-review-only-disposition-aggregation-checkpoint-input-rejected":
    "empty_review_only_disposition_aggregation_checkpoint_input_rejected",
  "conflicting-review-only-disposition-aggregation-checkpoint-input-rejected":
    "conflicting_review_only_disposition_aggregation_checkpoint_input_rejected",
  "stale-review-only-disposition-aggregation-checkpoint-input-rejected":
    "stale_review_only_disposition_aggregation_checkpoint_input_rejected",
  "revoked-review-only-disposition-aggregation-checkpoint-input-rejected":
    "revoked_review_only_disposition_aggregation_checkpoint_input_rejected",
  "unknown-review-only-disposition-aggregation-checkpoint-input-rejected":
    "unknown_review_only_disposition_aggregation_checkpoint_input_rejected",
  "duplicate-invalid-review-only-disposition-aggregation-checkpoint-input-rejected":
    "duplicate_invalid_review_only_disposition_aggregation_checkpoint_input_rejected",
  "authorizing-looking-review-only-disposition-aggregation-checkpoint-input-rejected":
    "authorizing_review_only_disposition_aggregation_checkpoint_input_rejected",
  "grant-looking-review-only-disposition-aggregation-checkpoint-input-rejected":
    "grant_looking_review_only_disposition_aggregation_checkpoint_input_rejected",
  "approval-decision-looking-review-only-disposition-aggregation-checkpoint-input-rejected":
    "approval_decision_looking_review_only_disposition_aggregation_checkpoint_input_rejected",
  "approval-grant-looking-review-only-disposition-aggregation-checkpoint-input-rejected":
    "approval_grant_looking_review_only_disposition_aggregation_checkpoint_input_rejected",
  "evaluator-result-looking-review-only-disposition-aggregation-checkpoint-input-rejected":
    "evaluator_result_looking_review_only_disposition_aggregation_checkpoint_input_rejected",
  "evaluator-execution-looking-review-only-disposition-aggregation-checkpoint-input-rejected":
    "evaluator_execution_looking_review_only_disposition_aggregation_checkpoint_input_rejected",
  "reviewer-routing-looking-review-only-disposition-aggregation-checkpoint-input-rejected":
    "reviewer_routing_looking_review_only_disposition_aggregation_checkpoint_input_rejected",
  "runtime-permission-looking-review-only-disposition-aggregation-checkpoint-input-rejected":
    "runtime_permission_looking_review_only_disposition_aggregation_checkpoint_input_rejected",
  "command-exposure-looking-review-only-disposition-aggregation-checkpoint-input-rejected":
    "command_exposure_looking_review_only_disposition_aggregation_checkpoint_input_rejected",
  "runtime-effect-true-review-only-disposition-aggregation-checkpoint-input-rejected":
    "runtime_effect_true_review_only_disposition_aggregation_checkpoint_input_rejected",
  "process-flag-true-review-only-disposition-aggregation-checkpoint-input-rejected":
    "process_flag_true_review_only_disposition_aggregation_checkpoint_input_rejected",
  "unsafe-top-level-review-only-disposition-aggregation-checkpoint-input-rejected":
    "unsafe_review_only_disposition_aggregation_checkpoint_input_rejected",
  "unsafe-nested-disposition-aggregation-data-review-only-disposition-aggregation-checkpoint-input-rejected":
    "unsafe_review_only_disposition_aggregation_checkpoint_input_rejected",
  "execution-signal-looking-review-only-disposition-aggregation-checkpoint-input-rejected":
    "execution_signal_looking_review_only_disposition_aggregation_checkpoint_input_rejected",
  "valid-review-only-disposition-aggregation-checkpoint":
    "valid_review_only_disposition_aggregation_checkpoint_runtime_still_blocked"
});

const aggregationCommandProbes = Object.freeze([
  "review-only-disposition-aggregation",
  "create-review-only-disposition-aggregation-checkpoint",
  "review-only-disposition-aggregation-checkpoint",
  "phase-5-32-review-only-disposition-aggregation-checkpoint",
  "reviewer-routing",
  "serve-runtime"
]);

const expectedAggregationSummary = Object.freeze({
  reviewOnlyDispositionAggregationCheckpointRecorded: true,
  checkpointKind: "review-only-disposition-aggregation-checkpoint",
  checkpointReviewOnly: true,
  checkpointAuthoritative: false,
  validDispositionStateProducesAggregationState: true,
  missingDispositionStateRejected: true,
  malformedDispositionStateRejected: true,
  emptyDispositionStateRejected: true,
  conflictingDispositionStateRejected: true,
  staleDispositionStateRejected: true,
  revokedDispositionStateRejected: true,
  unknownDispositionStateRejected: true,
  duplicateInvalidDispositionStateRejected: true,
  authorizingLookingDispositionStateRejected: true,
  grantLookingDispositionStateRejected: true,
  approvalDecisionLookingDispositionStateRejected: true,
  approvalGrantLookingDispositionStateRejected: true,
  evaluatorResultLookingDispositionStateRejected: true,
  evaluatorExecutionLookingDispositionStateRejected: true,
  reviewerRoutingLookingDispositionStateRejected: true,
  runtimePermissionLookingDispositionStateRejected: true,
  commandExposureLookingDispositionStateRejected: true,
  runtimeEffectTrueDispositionStateRejected: true,
  processFlagTrueDispositionStateRejected: true,
  unsafeDispositionStateRejected: true,
  executionSignalLookingDispositionStateRejected: true,
  aggregationCheckpointIsReviewerRouting: false,
  aggregationCheckpointIsApprovalDecision: false,
  aggregationCheckpointIsApprovalGrant: false,
  reviewerRoutingPerformed: false,
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

function validRecords() {
  return [runtimeApprovalRecord(), commandExposureApprovalRecord()];
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

function validReviewArtifact(sourceId = "source-valid") {
  const result = createPrerequisiteReviewArtifactBoundaryForReview({
    reviewedAt,
    sourceInputs: [inlineSource(sourceId, validRecords())]
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

function rejectedAggregationCase(caseId, dispositionStates) {
  return {
    caseId,
    input: { reviewedAt, dispositionStates },
    expectedAggregationStateProduced: false
  };
}

function acceptedAggregationCase(caseId, dispositionStates) {
  return {
    caseId,
    input: { reviewedAt, dispositionStates },
    expectedAggregationStateProduced: true
  };
}

function dispositionStateWith(sourceId, overrides) {
  return {
    ...validDispositionState(sourceId),
    ...overrides
  };
}

function dispositionStateWithNested(sourceId, nestedKey, nestedSourceId, overrides) {
  return {
    ...validDispositionState(sourceId),
    [nestedKey]: {
      ...validDispositionState(nestedSourceId)[nestedKey],
      ...overrides
    }
  };
}

function missingAggregationCase() {
  return {
    caseId: "missing-review-only-disposition-aggregation-checkpoint-input-rejected",
    input: { reviewedAt },
    expectedAggregationStateProduced: false
  };
}

function requiredShapeAggregationCases(duplicateState) {
  return [
    missingAggregationCase(),
    rejectedAggregationCase(
      "malformed-review-only-disposition-aggregation-checkpoint-input-rejected",
      [dispositionStateWith("source-malformed", { stateMode: "runtime" })]
    ),
    rejectedAggregationCase(
      "malformed-review-only-disposition-aggregation-checkpoint-invalid-reviewed-at-rejected",
      [dispositionStateWith("source-invalid-reviewed-at", { reviewedAt: "not-a-date" })]
    ),
    rejectedAggregationCase(
      "empty-review-only-disposition-aggregation-checkpoint-input-rejected",
      []
    ),
    rejectedAggregationCase(
      "conflicting-review-only-disposition-aggregation-checkpoint-input-rejected",
      [
        validDispositionState("source-conflict-a"),
        validDispositionState("source-conflict-b")
      ]
    ),
    rejectedAggregationCase(
      "stale-review-only-disposition-aggregation-checkpoint-input-rejected",
      [dispositionStateWith("source-stale", { reviewedAt: "2026-06-15T00:00:00.000Z" })]
    ),
    rejectedAggregationCase(
      "revoked-review-only-disposition-aggregation-checkpoint-input-rejected",
      [
        dispositionStateWith("source-revoked", {
          revocation: {
            revoked: true,
            revokedAt: "2026-06-16T00:00:00.000Z",
            revocationReason: "operator-revoked"
          }
        })
      ]
    ),
    rejectedAggregationCase(
      "unknown-review-only-disposition-aggregation-checkpoint-input-rejected",
      [
        dispositionStateWith("source-unknown", {
          schema: "ardyn.phase-5.31.unknown-disposition-state",
          stateKind: "unknown-disposition-state"
        })
      ]
    ),
    rejectedAggregationCase(
      "duplicate-invalid-review-only-disposition-aggregation-checkpoint-input-rejected",
      [duplicateState, clone(duplicateState)]
    )
  ];
}

function authorizationAggregationCases() {
  return [
    rejectedAggregationCase(
      "authorizing-looking-review-only-disposition-aggregation-checkpoint-input-rejected",
      [dispositionStateWith("source-authorizing", { authoritative: true })]
    ),
    rejectedAggregationCase(
      "grant-looking-review-only-disposition-aggregation-checkpoint-input-rejected",
      [dispositionStateWith("source-grant-looking", { grantProduced: true })]
    ),
    rejectedAggregationCase(
      "approval-decision-looking-review-only-disposition-aggregation-checkpoint-input-rejected",
      [
        dispositionStateWith("source-approval-decision-looking", {
          approvalDecision: { decisionId: "approval-decision-looking" }
        })
      ]
    ),
    rejectedAggregationCase(
      "approval-grant-looking-review-only-disposition-aggregation-checkpoint-input-rejected",
      [
        dispositionStateWith("source-approval-grant-looking", {
          approvalGrant: { produced: true, persisted: false, grantId: "grant-looking" }
        })
      ]
    ),
    rejectedAggregationCase(
      "evaluator-result-looking-review-only-disposition-aggregation-checkpoint-input-rejected",
      [
        dispositionStateWith("source-evaluator-result", {
          evaluatorResult: { resultId: "evaluator-result-looking" }
        })
      ]
    ),
    rejectedAggregationCase(
      "evaluator-execution-looking-review-only-disposition-aggregation-checkpoint-input-rejected",
      [
        dispositionStateWith("source-evaluator-execution", {
          evaluatorExecutionPerformed: true
        })
      ]
    ),
    rejectedAggregationCase(
      "reviewer-routing-looking-review-only-disposition-aggregation-checkpoint-input-rejected",
      [
        dispositionStateWith("source-reviewer-routing", {
          reviewerRouting: { routeId: "route-looking" }
        })
      ]
    ),
    rejectedAggregationCase(
      "runtime-permission-looking-review-only-disposition-aggregation-checkpoint-input-rejected",
      [dispositionStateWith("source-runtime-permission", { runtimePermissionGranted: true })]
    ),
    rejectedAggregationCase(
      "command-exposure-looking-review-only-disposition-aggregation-checkpoint-input-rejected",
      [
        dispositionStateWith("source-command-exposure", {
          commandExposurePermissionGranted: true
        })
      ]
    )
  ];
}

function executionUnsafeAggregationCases() {
  return [
    rejectedAggregationCase(
      "runtime-effect-true-review-only-disposition-aggregation-checkpoint-input-rejected",
      [
        dispositionStateWithNested(
          "source-runtime-effect-claim",
          "runtimeEffect",
          "source-runtime-effect-copy",
          { runtimeEnabled: true }
        )
      ]
    ),
    rejectedAggregationCase(
      "process-flag-true-review-only-disposition-aggregation-checkpoint-input-rejected",
      [dispositionStateWith("source-process-claim", { processSpawnEnabled: true })]
    ),
    rejectedAggregationCase(
      "unsafe-top-level-review-only-disposition-aggregation-checkpoint-input-rejected",
      [
        dispositionStateWith("source-unsafe-top-level", {
          externalSourceLookupEnabled: true
        })
      ]
    ),
    rejectedAggregationCase(
      "unsafe-nested-disposition-aggregation-data-review-only-disposition-aggregation-checkpoint-input-rejected",
      [
        dispositionStateWithNested(
          "source-nested-unsafe",
          "aggregationData",
          "source-nested-unsafe-copy",
          { externalSourceLookup: "file:///not-ingested" }
        )
      ]
    ),
    rejectedAggregationCase(
      "execution-signal-looking-review-only-disposition-aggregation-checkpoint-input-rejected",
      [dispositionStateWith("source-execution-signal", { executionSignal: true })]
    )
  ];
}

function aggregationCases() {
  const duplicateState = validDispositionState("source-duplicate");

  return [
    ...requiredShapeAggregationCases(duplicateState),
    ...authorizationAggregationCases(),
    ...executionUnsafeAggregationCases(),
    acceptedAggregationCase(
      "valid-review-only-disposition-aggregation-checkpoint",
      [validDispositionState("source-valid")]
    )
  ];
}

function validAggregationResult() {
  const validCase = aggregationCases().find(
    (aggregationCase) =>
      aggregationCase.caseId === "valid-review-only-disposition-aggregation-checkpoint"
  );

  return createReviewOnlyDispositionAggregationCheckpointForReview(validCase.input);
}

function assertAllFalse(record) {
  for (const [key, value] of Object.entries(record)) {
    assert.equal(value, false, `${key} should remain false`);
  }
}

function assertNonAuthorizingResult(result, label) {
  assert.equal(result.aggregationCheckpointIsReviewerRouting, false, label);
  assert.equal(result.aggregationCheckpointIsApprovalDecision, false, label);
  assert.equal(result.aggregationCheckpointIsApprovalGrant, false, label);
  assert.equal(result.reviewOnly, true, label);
  assert.equal(result.authoritative, false, label);
  assert.equal(result.reviewArtifactOnly, true, label);
  assert.equal(result.aggregationMetadataOnly, true, label);
  assert.equal(result.reviewerRoutingPerformed, false, label);
  assert.equal(result.reviewerRoutingEnabled, false, label);
  assert.equal(result.reviewerRouteId, null, label);
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

function assertValidAggregationState(aggregationState) {
  assert.equal(
    aggregationState.schema,
    "ardyn.phase-5.32.review-only-disposition-aggregation-state"
  );
  assert.equal(aggregationState.stateKind, "review-only-disposition-aggregation-state");
  assert.equal(aggregationState.stateMode, "review-only");
  assert.equal(aggregationState.reviewedAt, reviewedAt);
  assert.equal(aggregationState.dispositionStateAccepted, true);
  assert.equal(aggregationState.aggregationMetadataOnly, true);
  assert.equal(aggregationState.aggregationCheckpointIsReviewerRouting, false);
  assert.equal(aggregationState.aggregationCheckpointIsApprovalDecision, false);
  assert.equal(aggregationState.aggregationCheckpointIsApprovalGrant, false);
  assert.equal(aggregationState.reviewerRoutingPerformed, false);
  assert.equal(aggregationState.reviewerRoutingEnabled, false);
  assert.equal(aggregationState.reviewerRouteId, null);
  assert.equal(aggregationState.evaluatorResultProduced, false);
  assert.equal(aggregationState.evaluatorResultPersisted, false);
  assert.equal(aggregationState.evaluatorResultId, null);
  assert.equal(aggregationState.approvalDecisionProduced, false);
  assert.equal(aggregationState.approvalDecisionPersisted, false);
  assert.equal(aggregationState.approvalDecisionId, null);
  assert.equal(aggregationState.approvalGrantProduced, false);
  assert.equal(aggregationState.approvalGrantPersisted, false);
  assert.equal(aggregationState.approvalGrantId, null);
  assert.equal(aggregationState.runtimePermissionGranted, false);
  assert.equal(aggregationState.commandExposurePermissionGranted, false);
  assert.equal(aggregationState.evaluatorExecuted, false);
  assertAllFalse(aggregationState.runtimeEffect);
  assert.equal(
    aggregationState.sourceDispositionState.schema,
    "ardyn.phase-5.31.review-only-human-tool-inspection-disposition-state"
  );
  assert.equal(
    aggregationState.sourceDispositionState.stateKind,
    "review-only-human-tool-inspection-disposition-state"
  );
  assert.equal(aggregationState.sourceDispositionState.stateMode, "review-only");
  assert.match(aggregationState.sourceDispositionState.stateDigest, /^sha256:[0-9a-f]{64}$/);
  assert.match(
    aggregationState.sourceDispositionState.sourceInspectionArtifactDigest,
    /^sha256:[0-9a-f]{64}$/
  );
  assert.equal(
    Object.hasOwn(aggregationState.sourceDispositionState, "sourceInspectionArtifact"),
    false
  );
  assert.equal(Object.hasOwn(aggregationState.sourceDispositionState, "dispositionSummary"), false);
  assert.equal(aggregationState.sourceDispositionState.reviewArtifactOnly, true);
  assert.equal(aggregationState.sourceDispositionState.dispositionStateIsApprovalDecision, false);
  assert.equal(aggregationState.sourceDispositionState.dispositionStateIsApprovalGrant, false);
  assert.equal(aggregationState.sourceDispositionState.evaluatorResultProduced, false);
  assert.equal(aggregationState.sourceDispositionState.approvalDecisionProduced, false);
  assert.equal(aggregationState.sourceDispositionState.approvalGrantProduced, false);
  assert.equal(aggregationState.sourceDispositionState.evaluatorExecuted, false);
  assert.equal(aggregationState.aggregationSummary.aggregationMetadataOnly, true);
  assert.equal(aggregationState.aggregationSummary.reviewerRoutingPerformed, false);
  assert.equal(aggregationState.aggregationSummary.evaluatorResultProduced, false);
  assert.equal(aggregationState.aggregationSummary.approvalDecisionProduced, false);
  assert.equal(aggregationState.aggregationSummary.approvalGrantProduced, false);
  assert.equal(aggregationState.aggregationSummary.evaluatorExecuted, false);
  assert.equal(aggregationState.integratedReviewSummary.reviewSummaryIsApprovalGrant, false);
  assert.equal(aggregationState.integratedReviewSummary.approvalGrantProduced, false);
  assert.equal(aggregationState.integratedReviewSummary.approvalGrantPersisted, false);
  assert.equal(aggregationState.integratedReviewSummary.approvalGrantId, null);
  assert.equal(aggregationState.integratedReviewSummary.runtimeEffectAllFalse, true);
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
    fixture.aggregationCheckpointCases.map((aggregationCase) => aggregationCase.caseId),
    expectedCaseIds
  );

  for (const aggregationCase of fixture.aggregationCheckpointCases) {
    assert.equal(
      aggregationCase.classification,
      expectedClassifications[aggregationCase.caseId]
    );
    assert.equal(aggregationCase.reviewOnly, true, aggregationCase.caseId);
    assert.equal(aggregationCase.authoritative, false, aggregationCase.caseId);
    assert.equal(aggregationCase.reviewArtifactOnly, true, aggregationCase.caseId);
    assert.equal(aggregationCase.aggregationMetadataOnly, true, aggregationCase.caseId);
    assert.equal(aggregationCase.aggregationCheckpointIsReviewerRouting, false);
    assert.equal(aggregationCase.aggregationCheckpointIsApprovalDecision, false);
    assert.equal(aggregationCase.aggregationCheckpointIsApprovalGrant, false);
    assert.equal(aggregationCase.reviewerRoutingPerformed, false);
    assert.equal(aggregationCase.evaluatorResultProduced, false);
    assert.equal(aggregationCase.evaluatorResultPersisted, false);
    assert.equal(aggregationCase.approvalDecisionProduced, false);
    assert.equal(aggregationCase.approvalDecisionPersisted, false);
    assert.equal(aggregationCase.approvalGrant.produced, false, aggregationCase.caseId);
    assert.equal(aggregationCase.approvalGrant.persisted, false, aggregationCase.caseId);
    assert.equal(aggregationCase.approvalGrant.grantId, null, aggregationCase.caseId);
    assert.equal(aggregationCase.runtimePermissionGranted, false);
    assert.equal(aggregationCase.commandExposurePermissionGranted, false);
    assert.equal(aggregationCase.evaluatorExecuted, false);
    assertAllFalse(aggregationCase.runtimeEffect);
  }
}

function assertFixtureCheckpoint(fixture) {
  assert.equal(fixture.aggregationCheckpoint.aggregationCanPerformReviewerRouting, false);
  assert.equal(fixture.aggregationCheckpoint.aggregationCanExecuteEvaluator, false);
  assert.equal(fixture.aggregationCheckpoint.aggregationCanProduceEvaluatorResult, false);
  assert.equal(fixture.aggregationCheckpoint.aggregationCanProduceApprovalDecision, false);
  assert.equal(fixture.aggregationCheckpoint.aggregationCanGrantApproval, false);
  assert.equal(fixture.aggregationCheckpoint.aggregationCanPersistGrant, false);
  assert.equal(fixture.aggregationCheckpoint.aggregationCanGrantRuntimePermission, false);
  assert.equal(
    fixture.aggregationCheckpoint.aggregationCanGrantCommandExposurePermission,
    false
  );
  assert.equal(fixture.aggregationCheckpoint.aggregationCanExecuteRuntime, false);
  assertAllFalse(fixture.blockedRuntimeEffect);
}

test("Phase 5.32 aggregation checkpoint fixture is deterministic metadata", async () => {
  const raw = await readFile(fixtureUrl, "utf8");
  const fixture = JSON.parse(raw);

  assert.equal(raw.endsWith("\n"), true);
  assert.equal(raw.includes("\r"), false);
  assert.deepEqual(Object.keys(fixture), expectedTopLevelKeys);
  assert.equal(
    fixture.schema,
    "ardyn.phase-5.32.review-only-disposition-aggregation-checkpoint"
  );
  assert.equal(fixture.schemaVersion, "0.1.0");
  assert.equal(
    fixture.phase,
    "phase-5.32-review-only-disposition-aggregation-checkpoint"
  );
  assert.equal(fixture.artifactKind, "review-only-disposition-aggregation-checkpoint");
  assert.equal(fixture.metadataGeneratedAt, "1970-01-01T00:00:00.000Z");
  assert.equal(
    fixture.sourcePhase.phase,
    "phase-5.31-human-tool-inspection-disposition-boundary"
  );
});

test("Phase 5.32 aggregation checkpoint classifies disposition state cases", () => {
  for (const aggregationCase of aggregationCases()) {
    const result = createReviewOnlyDispositionAggregationCheckpointForReview(
      aggregationCase.input
    );

    assert.equal(result.schema, REVIEW_ONLY_DISPOSITION_AGGREGATION_CHECKPOINT_SCHEMA);
    assert.equal(result.schemaVersion, "0.1.0");
    assert.equal(
      result.checkpointKind,
      "review-only-disposition-aggregation-checkpoint"
    );
    assert.equal(result.checkpointMode, "review-only");
    assert.equal(result.reviewedAt, reviewedAt);
    assert.equal(result.classification, expectedClassifications[aggregationCase.caseId]);
    assert.equal(
      result.aggregationStateProduced,
      aggregationCase.expectedAggregationStateProduced,
      aggregationCase.caseId
    );
    assertNonAuthorizingResult(result, aggregationCase.caseId);
  }
});

test("Phase 5.32 malformed checkpoint input fails closed without throwing", () => {
  const malformedInputs = [null, "not-an-object", [], 1, true];

  for (const input of malformedInputs) {
    const result = createReviewOnlyDispositionAggregationCheckpointForReview(input);

    assert.equal(result.reviewedAt, defaultReviewedAt);
    assert.equal(
      result.classification,
      "malformed_review_only_disposition_aggregation_checkpoint_input_rejected"
    );
    assert.equal(result.dispositionStateAccepted, false);
    assert.equal(result.aggregationStateProduced, false);
    assert.equal(result.aggregationState, null);
    assert.equal(result.aggregationSummary, null);
    assertNonAuthorizingResult(result, String(input));
  }

  const invalidTimestampResult =
    createReviewOnlyDispositionAggregationCheckpointForReview({
      reviewedAt: "not-a-date",
      dispositionStates: [validDispositionState("source-checkpoint-invalid-reviewed-at")]
    });

  assert.equal(invalidTimestampResult.reviewedAt, defaultReviewedAt);
  assert.equal(
    invalidTimestampResult.classification,
    "malformed_review_only_disposition_aggregation_checkpoint_input_rejected"
  );
  assert.equal(invalidTimestampResult.dispositionStateAccepted, false);
  assert.equal(invalidTimestampResult.aggregationStateProduced, false);
  assert.equal(invalidTimestampResult.aggregationState, null);
  assert.equal(invalidTimestampResult.aggregationSummary, null);
  assertNonAuthorizingResult(invalidTimestampResult, "invalid-checkpoint-reviewed-at");
});

test("Phase 5.32 valid disposition state produces only aggregation metadata", () => {
  const result = validAggregationResult();

  assert.equal(result.dispositionStateAccepted, true);
  assert.equal(result.aggregationStateProduced, true);
  assertNonAuthorizingResult(result, "valid");
  assert.match(result.aggregationSummary.stateDigest, /^sha256:[0-9a-f]{64}$/);
  assert.equal(result.aggregationSummary.reviewerRoutingPerformed, false);
  assert.equal(result.aggregationSummary.evaluatorResultProduced, false);
  assert.equal(result.aggregationSummary.approvalDecisionProduced, false);
  assert.equal(result.aggregationSummary.evaluatorExecuted, false);

  assertValidAggregationState(result.aggregationState);
});

test("Phase 5.32 rejected disposition state fails closed before aggregation state", () => {
  for (const aggregationCase of aggregationCases().filter(
    (entry) => !entry.expectedAggregationStateProduced
  )) {
    const result = createReviewOnlyDispositionAggregationCheckpointForReview(
      aggregationCase.input
    );

    assert.equal(result.dispositionStateAccepted, false, aggregationCase.caseId);
    assert.equal(result.aggregationStateProduced, false, aggregationCase.caseId);
    assert.equal(result.aggregationState, null, aggregationCase.caseId);
    assert.equal(result.aggregationSummary, null, aggregationCase.caseId);
    assertNonAuthorizingResult(result, aggregationCase.caseId);
    assert.ok(
      result.rejectionReasons.includes("disposition_aggregation_state_not_produced"),
      aggregationCase.caseId
    );
    assert.ok(result.rejectionReasons.includes("reviewer_routing_not_implemented"));
    assert.ok(result.rejectionReasons.includes("evaluator_result_not_implemented"));
    assert.ok(result.rejectionReasons.includes("approval_decision_not_implemented"));
    assert.ok(result.rejectionReasons.includes("approval_grant_not_implemented"));
    assert.ok(result.rejectionReasons.includes("evaluator_execution_not_implemented"));
  }
});

test("Phase 5.32 fixture mirrors aggregation cases and blocks authorization", async () => {
  const fixture = await readJson(fixtureUrl);

  assert.deepEqual(fixture.aggregationCheckpointSummary, expectedAggregationSummary);
  assertFixtureCases(fixture);
  assertFixtureCheckpoint(fixture);
});

test("serve-runtime remains default-blocked and dry-run cannot bypass Phase 5.32", async () => {
  const fixture = await readJson(fixtureUrl);
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-32-aggregation-"));

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

test("Phase 5.32 aggregation command names remain rejected", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-32-aggregation-probes-"));
  const serveRuntimeStderr =
    "Usage: ardyn serve-runtime [--dry-run]\n" +
    "Runtime unavailable: serve-runtime is recognized, but runtime is not enabled in Phase 5.5.\n";

  try {
    for (const commandName of aggregationCommandProbes) {
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

test("Phase 5.32 does not change CLI runtime source or add reviewer routing", async () => {
  const [baselineSource, currentSource] = await Promise.all([
    execFileAsync("git", ["show", `${phase532BaselineCommit}:apps/cli/src/index.mjs`], {
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
    /createReviewOnlyDispositionAggregationCheckpointForReview/,
    /review-only-disposition-aggregation/,
    /disposition-aggregation/,
    /reviewer-routing/,
    /evaluator.*execut/i
  ]) {
    assert.doesNotMatch(currentSource, forbiddenPattern);
  }
});
