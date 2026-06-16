import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readFile, readdir, rm, mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";
import {
  REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_SCHEMA,
  createApprovalEvaluatorCandidateIntakeCheckpointForReview,
  createHumanToolInspectionDispositionBoundaryForReview,
  createNonAuthorizingEvaluatorDecisionCandidateBoundaryForReview,
  createNonAuthorizingEvaluatorDecisionCandidateInspectionArtifactForReview,
  createPrerequisiteReviewArtifactBoundaryForReview,
  createReviewArtifactEvaluatorInputHandoffForReview,
  createReviewOnlyAggregationInspectionHandoffForReview,
  createReviewOnlyDispositionAggregationCheckpointForReview,
  createReviewOnlyEvaluatorPreflightCheckpointForReview
} from "../packages/core/src/index.mjs";

const execFileAsync = promisify(execFile);
const phase533BaselineCommit = "13e894a7eb1d321dc651e943f282a736c9d6dd88";
const reviewedAt = "2026-06-16T00:00:00.000Z";
const defaultReviewedAt = "1970-01-01T00:00:00.000Z";
const repoRootUrl = new URL("../", import.meta.url);
const repoRoot = fileURLToPath(repoRootUrl);
const cliSourceUrl = new URL("../apps/cli/src/index.mjs", import.meta.url);
const cliPath = fileURLToPath(cliSourceUrl);
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-33/review-only-aggregation-inspection-handoff.json",
  import.meta.url
);

const expectedTopLevelKeys = Object.freeze([
  "schema",
  "schemaVersion",
  "phase",
  "artifactKind",
  "metadataGeneratedAt",
  "sourcePhase",
  "aggregationInspectionHandoffSummary",
  "aggregationInspectionHandoffInputShape",
  "aggregationInspectionHandoffResultShape",
  "aggregationInspectionHandoffCases",
  "aggregationInspectionHandoff",
  "blockedRuntimeEffect",
  "serveRuntimeBlockedBehavior",
  "forbiddenBehavior",
  "filesAllowedToChange",
  "filesForbiddenToChange",
  "validationCommands"
]);

const expectedCaseIds = Object.freeze([
  "missing-review-only-aggregation-inspection-handoff-input-rejected",
  "malformed-review-only-aggregation-inspection-handoff-input-rejected",
  "malformed-review-only-aggregation-inspection-handoff-invalid-reviewed-at-rejected",
  "empty-review-only-aggregation-inspection-handoff-input-rejected",
  "conflicting-review-only-aggregation-inspection-handoff-input-rejected",
  "stale-review-only-aggregation-inspection-handoff-input-rejected",
  "revoked-review-only-aggregation-inspection-handoff-input-rejected",
  "unknown-review-only-aggregation-inspection-handoff-input-rejected",
  "duplicate-invalid-review-only-aggregation-inspection-handoff-input-rejected",
  "authorizing-looking-review-only-aggregation-inspection-handoff-input-rejected",
  "grant-looking-review-only-aggregation-inspection-handoff-input-rejected",
  "approval-decision-looking-review-only-aggregation-inspection-handoff-input-rejected",
  "approval-grant-looking-review-only-aggregation-inspection-handoff-input-rejected",
  "evaluator-result-looking-review-only-aggregation-inspection-handoff-input-rejected",
  "evaluator-execution-looking-review-only-aggregation-inspection-handoff-input-rejected",
  "reviewer-routing-looking-review-only-aggregation-inspection-handoff-input-rejected",
  "runtime-permission-looking-review-only-aggregation-inspection-handoff-input-rejected",
  "command-exposure-looking-review-only-aggregation-inspection-handoff-input-rejected",
  "runtime-effect-true-review-only-aggregation-inspection-handoff-input-rejected",
  "process-flag-true-review-only-aggregation-inspection-handoff-input-rejected",
  "unsafe-top-level-review-only-aggregation-inspection-handoff-input-rejected",
  "unsafe-nested-aggregation-inspection-handoff-data-review-only-aggregation-inspection-handoff-input-rejected",
  "execution-signal-looking-review-only-aggregation-inspection-handoff-input-rejected",
  "valid-review-only-aggregation-inspection-handoff"
]);

const expectedClassifications = Object.freeze({
  "missing-review-only-aggregation-inspection-handoff-input-rejected":
    "missing_review_only_aggregation_inspection_handoff_input_rejected",
  "malformed-review-only-aggregation-inspection-handoff-input-rejected":
    "malformed_review_only_aggregation_inspection_handoff_input_rejected",
  "malformed-review-only-aggregation-inspection-handoff-invalid-reviewed-at-rejected":
    "malformed_review_only_aggregation_inspection_handoff_input_rejected",
  "empty-review-only-aggregation-inspection-handoff-input-rejected":
    "empty_review_only_aggregation_inspection_handoff_input_rejected",
  "conflicting-review-only-aggregation-inspection-handoff-input-rejected":
    "conflicting_review_only_aggregation_inspection_handoff_input_rejected",
  "stale-review-only-aggregation-inspection-handoff-input-rejected":
    "stale_review_only_aggregation_inspection_handoff_input_rejected",
  "revoked-review-only-aggregation-inspection-handoff-input-rejected":
    "revoked_review_only_aggregation_inspection_handoff_input_rejected",
  "unknown-review-only-aggregation-inspection-handoff-input-rejected":
    "unknown_review_only_aggregation_inspection_handoff_input_rejected",
  "duplicate-invalid-review-only-aggregation-inspection-handoff-input-rejected":
    "duplicate_invalid_review_only_aggregation_inspection_handoff_input_rejected",
  "authorizing-looking-review-only-aggregation-inspection-handoff-input-rejected":
    "authorizing_review_only_aggregation_inspection_handoff_input_rejected",
  "grant-looking-review-only-aggregation-inspection-handoff-input-rejected":
    "grant_looking_review_only_aggregation_inspection_handoff_input_rejected",
  "approval-decision-looking-review-only-aggregation-inspection-handoff-input-rejected":
    "approval_decision_looking_review_only_aggregation_inspection_handoff_input_rejected",
  "approval-grant-looking-review-only-aggregation-inspection-handoff-input-rejected":
    "approval_grant_looking_review_only_aggregation_inspection_handoff_input_rejected",
  "evaluator-result-looking-review-only-aggregation-inspection-handoff-input-rejected":
    "evaluator_result_looking_review_only_aggregation_inspection_handoff_input_rejected",
  "evaluator-execution-looking-review-only-aggregation-inspection-handoff-input-rejected":
    "evaluator_execution_looking_review_only_aggregation_inspection_handoff_input_rejected",
  "reviewer-routing-looking-review-only-aggregation-inspection-handoff-input-rejected":
    "reviewer_routing_looking_review_only_aggregation_inspection_handoff_input_rejected",
  "runtime-permission-looking-review-only-aggregation-inspection-handoff-input-rejected":
    "runtime_permission_looking_review_only_aggregation_inspection_handoff_input_rejected",
  "command-exposure-looking-review-only-aggregation-inspection-handoff-input-rejected":
    "command_exposure_looking_review_only_aggregation_inspection_handoff_input_rejected",
  "runtime-effect-true-review-only-aggregation-inspection-handoff-input-rejected":
    "runtime_effect_true_review_only_aggregation_inspection_handoff_input_rejected",
  "process-flag-true-review-only-aggregation-inspection-handoff-input-rejected":
    "process_flag_true_review_only_aggregation_inspection_handoff_input_rejected",
  "unsafe-top-level-review-only-aggregation-inspection-handoff-input-rejected":
    "unsafe_review_only_aggregation_inspection_handoff_input_rejected",
  "unsafe-nested-aggregation-inspection-handoff-data-review-only-aggregation-inspection-handoff-input-rejected":
    "unsafe_review_only_aggregation_inspection_handoff_input_rejected",
  "execution-signal-looking-review-only-aggregation-inspection-handoff-input-rejected":
    "execution_signal_looking_review_only_aggregation_inspection_handoff_input_rejected",
  "valid-review-only-aggregation-inspection-handoff":
    "valid_review_only_aggregation_inspection_handoff_runtime_still_blocked"
});

const handoffCommandProbes = Object.freeze([
  "review-only-aggregation-inspection-handoff",
  "create-review-only-aggregation-inspection-handoff",
  "aggregation-inspection-handoff",
  "phase-5-33-review-only-aggregation-inspection-handoff",
  "reviewer-routing",
  "serve-runtime"
]);

const expectedHandoffSummary = Object.freeze({
  reviewOnlyAggregationInspectionHandoffRecorded: true,
  handoffKind: "review-only-aggregation-inspection-handoff",
  handoffReviewOnly: true,
  handoffAuthoritative: false,
  validAggregationStateProducesInspectionHandoffState: true,
  missingAggregationStateRejected: true,
  malformedAggregationStateRejected: true,
  emptyAggregationStateRejected: true,
  conflictingAggregationStateRejected: true,
  staleAggregationStateRejected: true,
  revokedAggregationStateRejected: true,
  unknownAggregationStateRejected: true,
  duplicateInvalidAggregationStateRejected: true,
  authorizingLookingAggregationStateRejected: true,
  grantLookingAggregationStateRejected: true,
  approvalDecisionLookingAggregationStateRejected: true,
  approvalGrantLookingAggregationStateRejected: true,
  evaluatorResultLookingAggregationStateRejected: true,
  evaluatorExecutionLookingAggregationStateRejected: true,
  reviewerRoutingLookingAggregationStateRejected: true,
  runtimePermissionLookingAggregationStateRejected: true,
  commandExposureLookingAggregationStateRejected: true,
  runtimeEffectTrueAggregationStateRejected: true,
  processFlagTrueAggregationStateRejected: true,
  unsafeAggregationStateRejected: true,
  executionSignalLookingAggregationStateRejected: true,
  handoffIsReviewerRouting: false,
  handoffIsEvaluatorExecution: false,
  handoffIsEvaluatorResult: false,
  handoffIsApprovalDecision: false,
  handoffIsApprovalGrant: false,
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

function validAggregationState(sourceId = "source-valid") {
  const aggregation = createReviewOnlyDispositionAggregationCheckpointForReview({
    reviewedAt,
    dispositionStates: [validDispositionState(sourceId)]
  });

  assert.equal(aggregation.aggregationStateProduced, true, sourceId);
  assert.equal(aggregation.aggregationCheckpointIsReviewerRouting, false, sourceId);
  assert.equal(aggregation.aggregationCheckpointIsApprovalDecision, false, sourceId);
  assert.equal(aggregation.aggregationCheckpointIsApprovalGrant, false, sourceId);
  assert.equal(aggregation.evaluatorResultProduced, false, sourceId);
  assert.equal(aggregation.evaluatorExecuted, false, sourceId);
  return clone(aggregation.aggregationState);
}

function rejectedHandoffCase(caseId, aggregationStates) {
  return {
    caseId,
    input: { reviewedAt, aggregationStates },
    expectedInspectionHandoffStateProduced: false
  };
}

function acceptedHandoffCase(caseId, aggregationStates) {
  return {
    caseId,
    input: { reviewedAt, aggregationStates },
    expectedInspectionHandoffStateProduced: true
  };
}

function aggregationStateWith(sourceId, overrides) {
  return {
    ...validAggregationState(sourceId),
    ...overrides
  };
}

function aggregationStateWithNested(sourceId, nestedKey, nestedSourceId, overrides) {
  return {
    ...validAggregationState(sourceId),
    [nestedKey]: {
      ...validAggregationState(nestedSourceId)[nestedKey],
      ...overrides
    }
  };
}

function missingHandoffCase() {
  return {
    caseId: "missing-review-only-aggregation-inspection-handoff-input-rejected",
    input: { reviewedAt },
    expectedInspectionHandoffStateProduced: false
  };
}

function requiredShapeHandoffCases(duplicateState) {
  return [
    missingHandoffCase(),
    rejectedHandoffCase(
      "malformed-review-only-aggregation-inspection-handoff-input-rejected",
      [aggregationStateWith("source-malformed", { stateMode: "runtime" })]
    ),
    rejectedHandoffCase(
      "malformed-review-only-aggregation-inspection-handoff-invalid-reviewed-at-rejected",
      [aggregationStateWith("source-invalid-reviewed-at", { reviewedAt: "not-a-date" })]
    ),
    rejectedHandoffCase(
      "empty-review-only-aggregation-inspection-handoff-input-rejected",
      []
    ),
    rejectedHandoffCase(
      "conflicting-review-only-aggregation-inspection-handoff-input-rejected",
      [
        validAggregationState("source-conflict-a"),
        validAggregationState("source-conflict-b")
      ]
    ),
    rejectedHandoffCase(
      "stale-review-only-aggregation-inspection-handoff-input-rejected",
      [
        aggregationStateWith("source-stale", {
          reviewedAt: "2026-06-15T00:00:00.000Z"
        })
      ]
    ),
    rejectedHandoffCase(
      "revoked-review-only-aggregation-inspection-handoff-input-rejected",
      [
        aggregationStateWith("source-revoked", {
          revocation: {
            revoked: true,
            revokedAt: "2026-06-16T00:00:00.000Z",
            revocationReason: "operator-revoked"
          }
        })
      ]
    ),
    rejectedHandoffCase(
      "unknown-review-only-aggregation-inspection-handoff-input-rejected",
      [
        aggregationStateWith("source-unknown", {
          schema: "ardyn.phase-5.32.unknown-aggregation-state",
          stateKind: "unknown-aggregation-state"
        })
      ]
    ),
    rejectedHandoffCase(
      "duplicate-invalid-review-only-aggregation-inspection-handoff-input-rejected",
      [duplicateState, clone(duplicateState)]
    )
  ];
}

function authorizationHandoffCases() {
  return [
    rejectedHandoffCase(
      "authorizing-looking-review-only-aggregation-inspection-handoff-input-rejected",
      [aggregationStateWith("source-authorizing", { authoritative: true })]
    ),
    rejectedHandoffCase(
      "grant-looking-review-only-aggregation-inspection-handoff-input-rejected",
      [aggregationStateWith("source-grant-looking", { grantProduced: true })]
    ),
    rejectedHandoffCase(
      "approval-decision-looking-review-only-aggregation-inspection-handoff-input-rejected",
      [
        aggregationStateWith("source-approval-decision-looking", {
          approvalDecision: { decisionId: "approval-decision-looking" }
        })
      ]
    ),
    rejectedHandoffCase(
      "approval-grant-looking-review-only-aggregation-inspection-handoff-input-rejected",
      [
        aggregationStateWith("source-approval-grant-looking", {
          approvalGrant: { produced: true, persisted: false, grantId: "grant-looking" }
        })
      ]
    ),
    rejectedHandoffCase(
      "evaluator-result-looking-review-only-aggregation-inspection-handoff-input-rejected",
      [
        aggregationStateWith("source-evaluator-result", {
          evaluatorResult: { resultId: "evaluator-result-looking" }
        })
      ]
    ),
    rejectedHandoffCase(
      "evaluator-execution-looking-review-only-aggregation-inspection-handoff-input-rejected",
      [
        aggregationStateWith("source-evaluator-execution", {
          evaluatorExecutionPerformed: true
        })
      ]
    ),
    rejectedHandoffCase(
      "reviewer-routing-looking-review-only-aggregation-inspection-handoff-input-rejected",
      [
        aggregationStateWith("source-reviewer-routing", {
          reviewerRouting: { routeId: "route-looking" }
        })
      ]
    ),
    rejectedHandoffCase(
      "runtime-permission-looking-review-only-aggregation-inspection-handoff-input-rejected",
      [aggregationStateWith("source-runtime-permission", { runtimePermissionGranted: true })]
    ),
    rejectedHandoffCase(
      "command-exposure-looking-review-only-aggregation-inspection-handoff-input-rejected",
      [
        aggregationStateWith("source-command-exposure", {
          commandExposurePermissionGranted: true
        })
      ]
    )
  ];
}

function executionUnsafeHandoffCases() {
  return [
    rejectedHandoffCase(
      "runtime-effect-true-review-only-aggregation-inspection-handoff-input-rejected",
      [
        aggregationStateWithNested(
          "source-runtime-effect-claim",
          "runtimeEffect",
          "source-runtime-effect-copy",
          { runtimeEnabled: true }
        )
      ]
    ),
    rejectedHandoffCase(
      "process-flag-true-review-only-aggregation-inspection-handoff-input-rejected",
      [aggregationStateWith("source-process-claim", { processSpawnEnabled: true })]
    ),
    rejectedHandoffCase(
      "unsafe-top-level-review-only-aggregation-inspection-handoff-input-rejected",
      [
        aggregationStateWith("source-unsafe-top-level", {
          externalSourceLookupEnabled: true
        })
      ]
    ),
    rejectedHandoffCase(
      "unsafe-nested-aggregation-inspection-handoff-data-review-only-aggregation-inspection-handoff-input-rejected",
      [
        aggregationStateWithNested(
          "source-nested-unsafe",
          "handoffData",
          "source-nested-unsafe-copy",
          { externalSourceLookup: "file:///not-ingested" }
        )
      ]
    ),
    rejectedHandoffCase(
      "execution-signal-looking-review-only-aggregation-inspection-handoff-input-rejected",
      [aggregationStateWith("source-execution-signal", { executionSignal: true })]
    )
  ];
}

function handoffCases() {
  const duplicateState = validAggregationState("source-duplicate");

  return [
    ...requiredShapeHandoffCases(duplicateState),
    ...authorizationHandoffCases(),
    ...executionUnsafeHandoffCases(),
    acceptedHandoffCase(
      "valid-review-only-aggregation-inspection-handoff",
      [validAggregationState("source-valid")]
    )
  ];
}

function validHandoffResult() {
  const validCase = handoffCases().find(
    (handoffCase) =>
      handoffCase.caseId === "valid-review-only-aggregation-inspection-handoff"
  );

  return createReviewOnlyAggregationInspectionHandoffForReview(validCase.input);
}

function assertAllFalse(record) {
  for (const [key, value] of Object.entries(record)) {
    assert.equal(value, false, `${key} should remain false`);
  }
}

function assertNonAuthorizingResult(result, label) {
  assert.equal(result.handoffIsReviewerRouting, false, label);
  assert.equal(result.handoffIsEvaluatorExecution, false, label);
  assert.equal(result.handoffIsEvaluatorResult, false, label);
  assert.equal(result.handoffIsApprovalDecision, false, label);
  assert.equal(result.handoffIsApprovalGrant, false, label);
  assert.equal(result.reviewOnly, true, label);
  assert.equal(result.authoritative, false, label);
  assert.equal(result.reviewArtifactOnly, true, label);
  assert.equal(result.inspectionHandoffMetadataOnly, true, label);
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

function assertValidInspectionHandoffState(inspectionHandoffState) {
  assert.equal(
    inspectionHandoffState.schema,
    "ardyn.phase-5.33.review-only-aggregation-inspection-handoff-state"
  );
  assert.equal(
    inspectionHandoffState.stateKind,
    "review-only-aggregation-inspection-handoff-state"
  );
  assert.equal(inspectionHandoffState.stateMode, "review-only");
  assert.equal(inspectionHandoffState.reviewedAt, reviewedAt);
  assert.equal(inspectionHandoffState.aggregationStateAccepted, true);
  assert.equal(inspectionHandoffState.inspectionHandoffMetadataOnly, true);
  assert.equal(inspectionHandoffState.handoffIsReviewerRouting, false);
  assert.equal(inspectionHandoffState.handoffIsEvaluatorExecution, false);
  assert.equal(inspectionHandoffState.handoffIsEvaluatorResult, false);
  assert.equal(inspectionHandoffState.handoffIsApprovalDecision, false);
  assert.equal(inspectionHandoffState.handoffIsApprovalGrant, false);
  assert.equal(inspectionHandoffState.reviewerRoutingPerformed, false);
  assert.equal(inspectionHandoffState.reviewerRoutingEnabled, false);
  assert.equal(inspectionHandoffState.reviewerRouteId, null);
  assert.equal(inspectionHandoffState.evaluatorResultProduced, false);
  assert.equal(inspectionHandoffState.evaluatorResultPersisted, false);
  assert.equal(inspectionHandoffState.evaluatorResultId, null);
  assert.equal(inspectionHandoffState.approvalDecisionProduced, false);
  assert.equal(inspectionHandoffState.approvalDecisionPersisted, false);
  assert.equal(inspectionHandoffState.approvalDecisionId, null);
  assert.equal(inspectionHandoffState.approvalGrantProduced, false);
  assert.equal(inspectionHandoffState.approvalGrantPersisted, false);
  assert.equal(inspectionHandoffState.approvalGrantId, null);
  assert.equal(inspectionHandoffState.runtimePermissionGranted, false);
  assert.equal(inspectionHandoffState.commandExposurePermissionGranted, false);
  assert.equal(inspectionHandoffState.evaluatorExecuted, false);
  assertAllFalse(inspectionHandoffState.runtimeEffect);
  assert.equal(
    inspectionHandoffState.sourceAggregationState.schema,
    "ardyn.phase-5.32.review-only-disposition-aggregation-state"
  );
  assert.equal(
    inspectionHandoffState.sourceAggregationState.stateKind,
    "review-only-disposition-aggregation-state"
  );
  assert.equal(inspectionHandoffState.sourceAggregationState.stateMode, "review-only");
  assert.match(
    inspectionHandoffState.sourceAggregationState.stateDigest,
    /^sha256:[0-9a-f]{64}$/
  );
  assert.match(
    inspectionHandoffState.sourceAggregationState.sourceDispositionStateDigest,
    /^sha256:[0-9a-f]{64}$/
  );
  assert.match(
    inspectionHandoffState.sourceAggregationState.sourceInspectionArtifactDigest,
    /^sha256:[0-9a-f]{64}$/
  );
  assert.equal(
    Object.hasOwn(inspectionHandoffState.sourceAggregationState, "sourceDispositionState"),
    false
  );
  assert.equal(
    Object.hasOwn(inspectionHandoffState.sourceAggregationState, "aggregationSummary"),
    false
  );
  assert.equal(
    inspectionHandoffState.sourceAggregationState.aggregationMetadataOnly,
    true
  );
  assert.equal(
    inspectionHandoffState.sourceAggregationState.aggregationCheckpointIsReviewerRouting,
    false
  );
  assert.equal(
    inspectionHandoffState.sourceAggregationState.aggregationCheckpointIsApprovalDecision,
    false
  );
  assert.equal(
    inspectionHandoffState.sourceAggregationState.aggregationCheckpointIsApprovalGrant,
    false
  );
  assert.equal(inspectionHandoffState.sourceAggregationState.evaluatorResultProduced, false);
  assert.equal(inspectionHandoffState.sourceAggregationState.approvalDecisionProduced, false);
  assert.equal(inspectionHandoffState.sourceAggregationState.approvalGrantProduced, false);
  assert.equal(inspectionHandoffState.sourceAggregationState.evaluatorExecuted, false);
  assert.equal(inspectionHandoffState.handoffSummary.inspectionHandoffMetadataOnly, true);
  assert.equal(inspectionHandoffState.handoffSummary.reviewerRoutingPerformed, false);
  assert.equal(inspectionHandoffState.handoffSummary.evaluatorExecutionPerformed, false);
  assert.equal(inspectionHandoffState.handoffSummary.evaluatorResultProduced, false);
  assert.equal(inspectionHandoffState.handoffSummary.approvalDecisionProduced, false);
  assert.equal(inspectionHandoffState.handoffSummary.approvalGrantProduced, false);
  assert.equal(inspectionHandoffState.handoffSummary.evaluatorExecuted, false);
  assert.equal(inspectionHandoffState.integratedReviewSummary.reviewSummaryIsApprovalGrant, false);
  assert.equal(inspectionHandoffState.integratedReviewSummary.approvalGrantProduced, false);
  assert.equal(inspectionHandoffState.integratedReviewSummary.approvalGrantPersisted, false);
  assert.equal(inspectionHandoffState.integratedReviewSummary.approvalGrantId, null);
  assert.equal(inspectionHandoffState.integratedReviewSummary.runtimeEffectAllFalse, true);
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
    fixture.aggregationInspectionHandoffCases.map((handoffCase) => handoffCase.caseId),
    expectedCaseIds
  );

  for (const handoffCase of fixture.aggregationInspectionHandoffCases) {
    assert.equal(handoffCase.classification, expectedClassifications[handoffCase.caseId]);
    assert.equal(handoffCase.reviewOnly, true, handoffCase.caseId);
    assert.equal(handoffCase.authoritative, false, handoffCase.caseId);
    assert.equal(handoffCase.reviewArtifactOnly, true, handoffCase.caseId);
    assert.equal(handoffCase.inspectionHandoffMetadataOnly, true, handoffCase.caseId);
    assert.equal(handoffCase.handoffIsReviewerRouting, false);
    assert.equal(handoffCase.handoffIsEvaluatorExecution, false);
    assert.equal(handoffCase.handoffIsEvaluatorResult, false);
    assert.equal(handoffCase.handoffIsApprovalDecision, false);
    assert.equal(handoffCase.handoffIsApprovalGrant, false);
    assert.equal(handoffCase.reviewerRoutingPerformed, false);
    assert.equal(handoffCase.evaluatorResultProduced, false);
    assert.equal(handoffCase.evaluatorResultPersisted, false);
    assert.equal(handoffCase.approvalDecisionProduced, false);
    assert.equal(handoffCase.approvalDecisionPersisted, false);
    assert.equal(handoffCase.approvalGrant.produced, false, handoffCase.caseId);
    assert.equal(handoffCase.approvalGrant.persisted, false, handoffCase.caseId);
    assert.equal(handoffCase.approvalGrant.grantId, null, handoffCase.caseId);
    assert.equal(handoffCase.runtimePermissionGranted, false);
    assert.equal(handoffCase.commandExposurePermissionGranted, false);
    assert.equal(handoffCase.evaluatorExecuted, false);
    assertAllFalse(handoffCase.runtimeEffect);
  }
}

function assertFixtureHandoff(fixture) {
  assert.equal(
    fixture.aggregationInspectionHandoff.handoffCanPerformReviewerRouting,
    false
  );
  assert.equal(fixture.aggregationInspectionHandoff.handoffCanExecuteEvaluator, false);
  assert.equal(
    fixture.aggregationInspectionHandoff.handoffCanProduceEvaluatorResult,
    false
  );
  assert.equal(
    fixture.aggregationInspectionHandoff.handoffCanProduceApprovalDecision,
    false
  );
  assert.equal(fixture.aggregationInspectionHandoff.handoffCanGrantApproval, false);
  assert.equal(fixture.aggregationInspectionHandoff.handoffCanPersistGrant, false);
  assert.equal(
    fixture.aggregationInspectionHandoff.handoffCanGrantRuntimePermission,
    false
  );
  assert.equal(
    fixture.aggregationInspectionHandoff.handoffCanGrantCommandExposurePermission,
    false
  );
  assert.equal(fixture.aggregationInspectionHandoff.handoffCanExecuteRuntime, false);
  assertAllFalse(fixture.blockedRuntimeEffect);
}

test("Phase 5.33 aggregation inspection handoff fixture is deterministic metadata", async () => {
  const raw = await readFile(fixtureUrl, "utf8");
  const fixture = JSON.parse(raw);

  assert.equal(raw.endsWith("\n"), true);
  assert.equal(raw.includes("\r"), false);
  assert.deepEqual(Object.keys(fixture), expectedTopLevelKeys);
  assert.equal(
    fixture.schema,
    "ardyn.phase-5.33.review-only-aggregation-inspection-handoff"
  );
  assert.equal(fixture.schemaVersion, "0.1.0");
  assert.equal(
    fixture.phase,
    "phase-5.33-review-only-aggregation-inspection-handoff"
  );
  assert.equal(fixture.artifactKind, "review-only-aggregation-inspection-handoff");
  assert.equal(fixture.metadataGeneratedAt, "1970-01-01T00:00:00.000Z");
  assert.equal(
    fixture.sourcePhase.phase,
    "phase-5.32-review-only-disposition-aggregation-checkpoint"
  );
});

test("Phase 5.33 aggregation inspection handoff classifies aggregation state cases", () => {
  for (const handoffCase of handoffCases()) {
    const result = createReviewOnlyAggregationInspectionHandoffForReview(
      handoffCase.input
    );

    assert.equal(result.schema, REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_SCHEMA);
    assert.equal(result.schemaVersion, "0.1.0");
    assert.equal(result.handoffKind, "review-only-aggregation-inspection-handoff");
    assert.equal(result.handoffMode, "review-only");
    assert.equal(result.reviewedAt, reviewedAt);
    assert.equal(result.classification, expectedClassifications[handoffCase.caseId]);
    assert.equal(
      result.inspectionHandoffStateProduced,
      handoffCase.expectedInspectionHandoffStateProduced,
      handoffCase.caseId
    );
    assertNonAuthorizingResult(result, handoffCase.caseId);
  }
});

test("Phase 5.33 malformed handoff input fails closed without throwing", () => {
  const malformedInputs = [null, "not-an-object", [], 1, true];

  for (const input of malformedInputs) {
    const result = createReviewOnlyAggregationInspectionHandoffForReview(input);

    assert.equal(result.reviewedAt, defaultReviewedAt);
    assert.equal(
      result.classification,
      "malformed_review_only_aggregation_inspection_handoff_input_rejected"
    );
    assert.equal(result.aggregationStateAccepted, false);
    assert.equal(result.inspectionHandoffStateProduced, false);
    assert.equal(result.inspectionHandoffState, null);
    assert.equal(result.aggregationSummary, null);
    assertNonAuthorizingResult(result, String(input));
  }

  const invalidTimestampResult =
    createReviewOnlyAggregationInspectionHandoffForReview({
      reviewedAt: "not-a-date",
      aggregationStates: [validAggregationState("source-handoff-invalid-reviewed-at")]
    });

  assert.equal(invalidTimestampResult.reviewedAt, defaultReviewedAt);
  assert.equal(
    invalidTimestampResult.classification,
    "malformed_review_only_aggregation_inspection_handoff_input_rejected"
  );
  assert.equal(invalidTimestampResult.aggregationStateAccepted, false);
  assert.equal(invalidTimestampResult.inspectionHandoffStateProduced, false);
  assert.equal(invalidTimestampResult.inspectionHandoffState, null);
  assert.equal(invalidTimestampResult.aggregationSummary, null);
  assertNonAuthorizingResult(invalidTimestampResult, "invalid-handoff-reviewed-at");
});

test("Phase 5.33 valid aggregation state produces only inspection handoff metadata", () => {
  const result = validHandoffResult();

  assert.equal(result.aggregationStateAccepted, true);
  assert.equal(result.inspectionHandoffStateProduced, true);
  assertNonAuthorizingResult(result, "valid");
  assert.match(result.aggregationSummary.stateDigest, /^sha256:[0-9a-f]{64}$/);
  assert.equal(result.aggregationSummary.reviewerRoutingPerformed, false);
  assert.equal(result.aggregationSummary.evaluatorResultProduced, false);
  assert.equal(result.aggregationSummary.approvalDecisionProduced, false);
  assert.equal(result.aggregationSummary.evaluatorExecuted, false);

  assertValidInspectionHandoffState(result.inspectionHandoffState);
});

test("Phase 5.33 rejected aggregation state fails closed before handoff state", () => {
  for (const handoffCase of handoffCases().filter(
    (entry) => !entry.expectedInspectionHandoffStateProduced
  )) {
    const result = createReviewOnlyAggregationInspectionHandoffForReview(
      handoffCase.input
    );

    assert.equal(result.aggregationStateAccepted, false, handoffCase.caseId);
    assert.equal(result.inspectionHandoffStateProduced, false, handoffCase.caseId);
    assert.equal(result.inspectionHandoffState, null, handoffCase.caseId);
    assert.equal(result.aggregationSummary, null, handoffCase.caseId);
    assertNonAuthorizingResult(result, handoffCase.caseId);
    assert.ok(
      result.rejectionReasons.includes(
        "aggregation_inspection_handoff_state_not_produced"
      ),
      handoffCase.caseId
    );
    assert.ok(result.rejectionReasons.includes("reviewer_routing_not_implemented"));
    assert.ok(result.rejectionReasons.includes("evaluator_execution_not_implemented"));
    assert.ok(result.rejectionReasons.includes("evaluator_result_not_implemented"));
    assert.ok(result.rejectionReasons.includes("approval_decision_not_implemented"));
    assert.ok(result.rejectionReasons.includes("approval_grant_not_implemented"));
  }
});

test("Phase 5.33 fixture mirrors handoff cases and blocks authorization", async () => {
  const fixture = await readJson(fixtureUrl);

  assert.deepEqual(fixture.aggregationInspectionHandoffSummary, expectedHandoffSummary);
  assertFixtureCases(fixture);
  assertFixtureHandoff(fixture);
});

test("serve-runtime remains default-blocked and dry-run cannot bypass Phase 5.33", async () => {
  const fixture = await readJson(fixtureUrl);
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-33-handoff-"));

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

test("Phase 5.33 handoff command names remain rejected", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-33-handoff-probes-"));
  const serveRuntimeStderr =
    "Usage: ardyn serve-runtime [--dry-run]\n" +
    "Runtime unavailable: serve-runtime is recognized, but runtime is not enabled in Phase 5.5.\n";

  try {
    for (const commandName of handoffCommandProbes) {
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

test("Phase 5.33 does not change CLI runtime source or add handoff commands", async () => {
  const [baselineSource, currentSource] = await Promise.all([
    execFileAsync("git", ["show", `${phase533BaselineCommit}:apps/cli/src/index.mjs`], {
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
    /createReviewOnlyAggregationInspectionHandoffForReview/,
    /review-only-aggregation-inspection-handoff/,
    /aggregation-inspection-handoff/,
    /reviewer-routing/,
    /evaluator.*execut/i
  ]) {
    assert.doesNotMatch(currentSource, forbiddenPattern);
  }
});
