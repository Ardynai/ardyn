import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readFile, readdir, rm, mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";
import {
  REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_SCHEMA,
  createApprovalEvaluatorCandidateIntakeCheckpointForReview,
  createHumanToolInspectionDispositionBoundaryForReview,
  createNonAuthorizingEvaluatorDecisionCandidateBoundaryForReview,
  createNonAuthorizingEvaluatorDecisionCandidateInspectionArtifactForReview,
  createPrerequisiteReviewArtifactBoundaryForReview,
  createReviewArtifactEvaluatorInputHandoffForReview,
  createReviewOnlyAggregationInspectionHandoffForReview,
  createReviewOnlyDispositionAggregationCheckpointForReview,
  createReviewOnlyEvaluatorPreflightCheckpointForReview,
  createReviewOnlyHandoffReadinessArtifactForReview
} from "../packages/core/src/index.mjs";

const execFileAsync = promisify(execFile);
const phase534BaselineCommit = "3f1e250b5e76995d4bac9341def0cd295caf5132";
const reviewedAt = "2026-06-16T00:00:00.000Z";
const defaultReviewedAt = "1970-01-01T00:00:00.000Z";
const repoRootUrl = new URL("../", import.meta.url);
const repoRoot = fileURLToPath(repoRootUrl);
const cliSourceUrl = new URL("../apps/cli/src/index.mjs", import.meta.url);
const cliPath = fileURLToPath(cliSourceUrl);
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-34/review-only-handoff-readiness-artifact.json",
  import.meta.url
);

const expectedTopLevelKeys = Object.freeze([
  "schema",
  "schemaVersion",
  "phase",
  "artifactKind",
  "metadataGeneratedAt",
  "sourcePhase",
  "handoffReadinessArtifactSummary",
  "handoffReadinessArtifactInputShape",
  "handoffReadinessArtifactResultShape",
  "handoffReadinessArtifactCases",
  "handoffReadinessArtifact",
  "blockedRuntimeEffect",
  "serveRuntimeBlockedBehavior",
  "forbiddenBehavior",
  "filesAllowedToChange",
  "filesForbiddenToChange",
  "validationCommands"
]);

const expectedCaseIds = Object.freeze([
  "missing-review-only-handoff-readiness-artifact-input-rejected",
  "malformed-review-only-handoff-readiness-artifact-input-rejected",
  "malformed-review-only-handoff-readiness-artifact-invalid-reviewed-at-rejected",
  "empty-review-only-handoff-readiness-artifact-input-rejected",
  "conflicting-review-only-handoff-readiness-artifact-input-rejected",
  "stale-review-only-handoff-readiness-artifact-input-rejected",
  "revoked-review-only-handoff-readiness-artifact-input-rejected",
  "unknown-review-only-handoff-readiness-artifact-input-rejected",
  "duplicate-invalid-review-only-handoff-readiness-artifact-input-rejected",
  "authorizing-looking-review-only-handoff-readiness-artifact-input-rejected",
  "grant-looking-review-only-handoff-readiness-artifact-input-rejected",
  "approval-decision-looking-review-only-handoff-readiness-artifact-input-rejected",
  "approval-grant-looking-review-only-handoff-readiness-artifact-input-rejected",
  "evaluator-result-looking-review-only-handoff-readiness-artifact-input-rejected",
  "evaluator-execution-looking-review-only-handoff-readiness-artifact-input-rejected",
  "reviewer-routing-looking-review-only-handoff-readiness-artifact-input-rejected",
  "reviewer-assignment-looking-review-only-handoff-readiness-artifact-input-rejected",
  "runtime-permission-looking-review-only-handoff-readiness-artifact-input-rejected",
  "command-exposure-looking-review-only-handoff-readiness-artifact-input-rejected",
  "runtime-effect-true-review-only-handoff-readiness-artifact-input-rejected",
  "process-flag-true-review-only-handoff-readiness-artifact-input-rejected",
  "unsafe-top-level-review-only-handoff-readiness-artifact-input-rejected",
  "unsafe-nested-handoff-readiness-artifact-data-review-only-handoff-readiness-artifact-input-rejected",
  "execution-signal-looking-review-only-handoff-readiness-artifact-input-rejected",
  "valid-review-only-handoff-readiness-artifact"
]);

const expectedClassifications = Object.freeze({
  "missing-review-only-handoff-readiness-artifact-input-rejected":
    "missing_review_only_handoff_readiness_artifact_input_rejected",
  "malformed-review-only-handoff-readiness-artifact-input-rejected":
    "malformed_review_only_handoff_readiness_artifact_input_rejected",
  "malformed-review-only-handoff-readiness-artifact-invalid-reviewed-at-rejected":
    "malformed_review_only_handoff_readiness_artifact_input_rejected",
  "empty-review-only-handoff-readiness-artifact-input-rejected":
    "empty_review_only_handoff_readiness_artifact_input_rejected",
  "conflicting-review-only-handoff-readiness-artifact-input-rejected":
    "conflicting_review_only_handoff_readiness_artifact_input_rejected",
  "stale-review-only-handoff-readiness-artifact-input-rejected":
    "stale_review_only_handoff_readiness_artifact_input_rejected",
  "revoked-review-only-handoff-readiness-artifact-input-rejected":
    "revoked_review_only_handoff_readiness_artifact_input_rejected",
  "unknown-review-only-handoff-readiness-artifact-input-rejected":
    "unknown_review_only_handoff_readiness_artifact_input_rejected",
  "duplicate-invalid-review-only-handoff-readiness-artifact-input-rejected":
    "duplicate_invalid_review_only_handoff_readiness_artifact_input_rejected",
  "authorizing-looking-review-only-handoff-readiness-artifact-input-rejected":
    "authorizing_review_only_handoff_readiness_artifact_input_rejected",
  "grant-looking-review-only-handoff-readiness-artifact-input-rejected":
    "grant_looking_review_only_handoff_readiness_artifact_input_rejected",
  "approval-decision-looking-review-only-handoff-readiness-artifact-input-rejected":
    "approval_decision_looking_review_only_handoff_readiness_artifact_input_rejected",
  "approval-grant-looking-review-only-handoff-readiness-artifact-input-rejected":
    "approval_grant_looking_review_only_handoff_readiness_artifact_input_rejected",
  "evaluator-result-looking-review-only-handoff-readiness-artifact-input-rejected":
    "evaluator_result_looking_review_only_handoff_readiness_artifact_input_rejected",
  "evaluator-execution-looking-review-only-handoff-readiness-artifact-input-rejected":
    "evaluator_execution_looking_review_only_handoff_readiness_artifact_input_rejected",
  "reviewer-routing-looking-review-only-handoff-readiness-artifact-input-rejected":
    "reviewer_routing_looking_review_only_handoff_readiness_artifact_input_rejected",
  "reviewer-assignment-looking-review-only-handoff-readiness-artifact-input-rejected":
    "reviewer_assignment_looking_review_only_handoff_readiness_artifact_input_rejected",
  "runtime-permission-looking-review-only-handoff-readiness-artifact-input-rejected":
    "runtime_permission_looking_review_only_handoff_readiness_artifact_input_rejected",
  "command-exposure-looking-review-only-handoff-readiness-artifact-input-rejected":
    "command_exposure_looking_review_only_handoff_readiness_artifact_input_rejected",
  "runtime-effect-true-review-only-handoff-readiness-artifact-input-rejected":
    "runtime_effect_true_review_only_handoff_readiness_artifact_input_rejected",
  "process-flag-true-review-only-handoff-readiness-artifact-input-rejected":
    "process_flag_true_review_only_handoff_readiness_artifact_input_rejected",
  "unsafe-top-level-review-only-handoff-readiness-artifact-input-rejected":
    "unsafe_review_only_handoff_readiness_artifact_input_rejected",
  "unsafe-nested-handoff-readiness-artifact-data-review-only-handoff-readiness-artifact-input-rejected":
    "unsafe_review_only_handoff_readiness_artifact_input_rejected",
  "execution-signal-looking-review-only-handoff-readiness-artifact-input-rejected":
    "execution_signal_looking_review_only_handoff_readiness_artifact_input_rejected",
  "valid-review-only-handoff-readiness-artifact":
    "valid_review_only_handoff_readiness_artifact_runtime_still_blocked"
});

const readinessCommandProbes = Object.freeze([
  "review-only-handoff-readiness-artifact",
  "create-review-only-handoff-readiness-artifact",
  "handoff-readiness-artifact",
  "phase-5-34-review-only-handoff-readiness-artifact",
  "reviewer-routing",
  "reviewer-assignment",
  "serve-runtime"
]);

const expectedReadinessSummary = Object.freeze({
  reviewOnlyHandoffReadinessArtifactRecorded: true,
  artifactKind: "review-only-handoff-readiness-artifact",
  artifactReviewOnly: true,
  artifactAuthoritative: false,
  validHandoffStateProducesReadinessArtifact: true,
  missingHandoffStateRejected: true,
  malformedHandoffStateRejected: true,
  emptyHandoffStateRejected: true,
  conflictingHandoffStateRejected: true,
  staleHandoffStateRejected: true,
  revokedHandoffStateRejected: true,
  unknownHandoffStateRejected: true,
  duplicateInvalidHandoffStateRejected: true,
  authorizingLookingHandoffStateRejected: true,
  grantLookingHandoffStateRejected: true,
  approvalDecisionLookingHandoffStateRejected: true,
  approvalGrantLookingHandoffStateRejected: true,
  evaluatorResultLookingHandoffStateRejected: true,
  evaluatorExecutionLookingHandoffStateRejected: true,
  reviewerRoutingLookingHandoffStateRejected: true,
  reviewerAssignmentLookingHandoffStateRejected: true,
  runtimePermissionLookingHandoffStateRejected: true,
  commandExposureLookingHandoffStateRejected: true,
  runtimeEffectTrueHandoffStateRejected: true,
  processFlagTrueHandoffStateRejected: true,
  unsafeHandoffStateRejected: true,
  executionSignalLookingHandoffStateRejected: true,
  readinessArtifactIsReviewerRouting: false,
  readinessArtifactIsReviewerAssignment: false,
  readinessArtifactIsEvaluatorExecution: false,
  readinessArtifactIsEvaluatorResult: false,
  readinessArtifactIsApprovalDecision: false,
  readinessArtifactIsApprovalGrant: false,
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

function rejectedReadinessCase(caseId, handoffStates) {
  return {
    caseId,
    input: { reviewedAt, handoffStates },
    expectedReadinessArtifactProduced: false
  };
}

function acceptedReadinessCase(caseId, handoffStates) {
  return {
    caseId,
    input: { reviewedAt, handoffStates },
    expectedReadinessArtifactProduced: true
  };
}

function handoffStateWith(sourceId, overrides) {
  return {
    ...validHandoffState(sourceId),
    ...overrides
  };
}

function handoffStateWithNested(sourceId, nestedKey, nestedSourceId, overrides) {
  return {
    ...validHandoffState(sourceId),
    [nestedKey]: {
      ...validHandoffState(nestedSourceId)[nestedKey],
      ...overrides
    }
  };
}

function missingReadinessCase() {
  return {
    caseId: "missing-review-only-handoff-readiness-artifact-input-rejected",
    input: { reviewedAt },
    expectedReadinessArtifactProduced: false
  };
}

function requiredShapeReadinessCases(duplicateState) {
  return [
    missingReadinessCase(),
    rejectedReadinessCase(
      "malformed-review-only-handoff-readiness-artifact-input-rejected",
      [handoffStateWith("source-malformed", { stateMode: "runtime" })]
    ),
    rejectedReadinessCase(
      "malformed-review-only-handoff-readiness-artifact-invalid-reviewed-at-rejected",
      [handoffStateWith("source-invalid-reviewed-at", { reviewedAt: "not-a-date" })]
    ),
    rejectedReadinessCase(
      "empty-review-only-handoff-readiness-artifact-input-rejected",
      []
    ),
    rejectedReadinessCase(
      "conflicting-review-only-handoff-readiness-artifact-input-rejected",
      [validHandoffState("source-conflict-a"), validHandoffState("source-conflict-b")]
    ),
    rejectedReadinessCase(
      "stale-review-only-handoff-readiness-artifact-input-rejected",
      [handoffStateWith("source-stale", { reviewedAt: "2026-06-15T00:00:00.000Z" })]
    ),
    rejectedReadinessCase(
      "revoked-review-only-handoff-readiness-artifact-input-rejected",
      [
        handoffStateWith("source-revoked", {
          revocation: {
            revoked: true,
            revokedAt: "2026-06-16T00:00:00.000Z",
            revocationReason: "operator-revoked"
          }
        })
      ]
    ),
    rejectedReadinessCase(
      "unknown-review-only-handoff-readiness-artifact-input-rejected",
      [
        handoffStateWith("source-unknown", {
          schema: "ardyn.phase-5.33.unknown-handoff-state",
          stateKind: "unknown-handoff-state"
        })
      ]
    ),
    rejectedReadinessCase(
      "duplicate-invalid-review-only-handoff-readiness-artifact-input-rejected",
      [duplicateState, clone(duplicateState)]
    )
  ];
}

function authorizationReadinessCases() {
  return [
    rejectedReadinessCase(
      "authorizing-looking-review-only-handoff-readiness-artifact-input-rejected",
      [handoffStateWith("source-authorizing", { authoritative: true })]
    ),
    rejectedReadinessCase(
      "grant-looking-review-only-handoff-readiness-artifact-input-rejected",
      [handoffStateWith("source-grant", { grantProduced: true })]
    ),
    rejectedReadinessCase(
      "approval-decision-looking-review-only-handoff-readiness-artifact-input-rejected",
      [handoffStateWith("source-approval-decision", { approvalDecisionProduced: true })]
    ),
    rejectedReadinessCase(
      "approval-grant-looking-review-only-handoff-readiness-artifact-input-rejected",
      [handoffStateWith("source-approval-grant", { approvalGrantProduced: true })]
    ),
    rejectedReadinessCase(
      "evaluator-result-looking-review-only-handoff-readiness-artifact-input-rejected",
      [handoffStateWith("source-evaluator-result", { evaluatorResultProduced: true })]
    ),
    rejectedReadinessCase(
      "evaluator-execution-looking-review-only-handoff-readiness-artifact-input-rejected",
      [handoffStateWith("source-evaluator-execution", { evaluatorExecutionRequested: true })]
    ),
    rejectedReadinessCase(
      "reviewer-routing-looking-review-only-handoff-readiness-artifact-input-rejected",
      [handoffStateWith("source-reviewer-routing", { reviewerRouting: { queue: "ops" } })]
    ),
    rejectedReadinessCase(
      "reviewer-assignment-looking-review-only-handoff-readiness-artifact-input-rejected",
      [
        handoffStateWith("source-reviewer-assignment", {
          reviewerAssignment: { reviewerId: "human-reviewer-1" }
        })
      ]
    ),
    rejectedReadinessCase(
      "runtime-permission-looking-review-only-handoff-readiness-artifact-input-rejected",
      [handoffStateWith("source-runtime-permission", { runtimePermissionGranted: true })]
    ),
    rejectedReadinessCase(
      "command-exposure-looking-review-only-handoff-readiness-artifact-input-rejected",
      [
        handoffStateWith("source-command-exposure", {
          commandExposurePermissionGranted: true
        })
      ]
    ),
    rejectedReadinessCase(
      "runtime-effect-true-review-only-handoff-readiness-artifact-input-rejected",
      [
        handoffStateWithNested("source-runtime-effect", "runtimeEffect", "source-runtime-effect-nested", {
          runtimeEnabled: true
        })
      ]
    ),
    rejectedReadinessCase(
      "process-flag-true-review-only-handoff-readiness-artifact-input-rejected",
      [handoffStateWith("source-process", { processSpawnEnabled: true })]
    ),
    rejectedReadinessCase(
      "unsafe-top-level-review-only-handoff-readiness-artifact-input-rejected",
      [handoffStateWith("source-unsafe", { externalSourceLookupEnabled: true })]
    ),
    rejectedReadinessCase(
      "unsafe-nested-handoff-readiness-artifact-data-review-only-handoff-readiness-artifact-input-rejected",
      [
        handoffStateWith("source-unsafe-nested", {
          readinessArtifact: { envSecretsReaderEnabled: true }
        })
      ]
    ),
    rejectedReadinessCase(
      "execution-signal-looking-review-only-handoff-readiness-artifact-input-rejected",
      [handoffStateWith("source-execution-signal", { executionSignal: true })]
    )
  ];
}

function readinessCases() {
  const duplicateState = validHandoffState("source-duplicate");

  return [
    ...requiredShapeReadinessCases(duplicateState),
    ...authorizationReadinessCases(),
    acceptedReadinessCase("valid-review-only-handoff-readiness-artifact", [
      validHandoffState("source-valid-readiness")
    ])
  ];
}

function validReadinessResult() {
  const validCase = readinessCases().find(
    (entry) => entry.caseId === "valid-review-only-handoff-readiness-artifact"
  );

  return createReviewOnlyHandoffReadinessArtifactForReview(validCase.input);
}

function assertAllFalse(record) {
  for (const [key, value] of Object.entries(record)) {
    assert.equal(value, false, `${key} should remain false`);
  }
}

function assertNonAuthorizingResult(result, label) {
  assert.equal(result.readinessArtifactIsReviewerRouting, false, label);
  assert.equal(result.readinessArtifactIsReviewerAssignment, false, label);
  assert.equal(result.readinessArtifactIsEvaluatorExecution, false, label);
  assert.equal(result.readinessArtifactIsEvaluatorResult, false, label);
  assert.equal(result.readinessArtifactIsApprovalDecision, false, label);
  assert.equal(result.readinessArtifactIsApprovalGrant, false, label);
  assert.equal(result.reviewOnly, true, label);
  assert.equal(result.authoritative, false, label);
  assert.equal(result.reviewArtifactOnly, true, label);
  assert.equal(result.readinessArtifactMetadataOnly, true, label);
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

function assertValidReadinessArtifact(readinessArtifact) {
  assert.equal(
    readinessArtifact.schema,
    "ardyn.phase-5.34.review-only-handoff-readiness-artifact-state"
  );
  assert.equal(
    readinessArtifact.stateKind,
    "review-only-handoff-readiness-artifact-state"
  );
  assert.equal(readinessArtifact.stateMode, "review-only");
  assert.equal(readinessArtifact.reviewedAt, reviewedAt);
  assert.equal(readinessArtifact.handoffStateAccepted, true);
  assert.equal(readinessArtifact.readinessArtifactMetadataOnly, true);
  assert.equal(readinessArtifact.readinessArtifactIsReviewerRouting, false);
  assert.equal(readinessArtifact.readinessArtifactIsReviewerAssignment, false);
  assert.equal(readinessArtifact.readinessArtifactIsEvaluatorExecution, false);
  assert.equal(readinessArtifact.readinessArtifactIsEvaluatorResult, false);
  assert.equal(readinessArtifact.readinessArtifactIsApprovalDecision, false);
  assert.equal(readinessArtifact.readinessArtifactIsApprovalGrant, false);
  assert.equal(readinessArtifact.reviewerRoutingPerformed, false);
  assert.equal(readinessArtifact.reviewerAssignmentPerformed, false);
  assert.equal(readinessArtifact.evaluatorResultProduced, false);
  assert.equal(readinessArtifact.evaluatorResultPersisted, false);
  assert.equal(readinessArtifact.approvalDecisionProduced, false);
  assert.equal(readinessArtifact.approvalDecisionPersisted, false);
  assert.equal(readinessArtifact.approvalGrantProduced, false);
  assert.equal(readinessArtifact.approvalGrantPersisted, false);
  assert.equal(readinessArtifact.runtimePermissionGranted, false);
  assert.equal(readinessArtifact.commandExposurePermissionGranted, false);
  assert.equal(readinessArtifact.evaluatorExecuted, false);
  assertAllFalse(readinessArtifact.runtimeEffect);
  assert.equal(
    readinessArtifact.sourceInspectionHandoffState.schema,
    "ardyn.phase-5.33.review-only-aggregation-inspection-handoff-state"
  );
  assert.equal(
    readinessArtifact.sourceInspectionHandoffState.stateKind,
    "review-only-aggregation-inspection-handoff-state"
  );
  assert.match(
    readinessArtifact.sourceInspectionHandoffState.stateDigest,
    /^sha256:[0-9a-f]{64}$/
  );
  assert.match(
    readinessArtifact.sourceInspectionHandoffState.sourceAggregationStateDigest,
    /^sha256:[0-9a-f]{64}$/
  );
  assert.equal(
    Object.hasOwn(readinessArtifact.sourceInspectionHandoffState, "sourceAggregationState"),
    false
  );
  assert.equal(
    Object.hasOwn(readinessArtifact.sourceInspectionHandoffState, "handoffSummary"),
    false
  );
  assert.equal(
    readinessArtifact.sourceInspectionHandoffState.inspectionHandoffMetadataOnly,
    true
  );
  assert.equal(readinessArtifact.sourceInspectionHandoffState.handoffIsReviewerRouting, false);
  assert.equal(readinessArtifact.sourceInspectionHandoffState.handoffIsEvaluatorResult, false);
  assert.equal(readinessArtifact.sourceInspectionHandoffState.handoffIsApprovalDecision, false);
  assert.equal(readinessArtifact.sourceInspectionHandoffState.handoffIsApprovalGrant, false);
  assert.equal(readinessArtifact.sourceInspectionHandoffState.reviewerAssignmentPerformed, false);
  assert.equal(readinessArtifact.sourceInspectionHandoffState.evaluatorResultProduced, false);
  assert.equal(readinessArtifact.sourceInspectionHandoffState.approvalDecisionProduced, false);
  assert.equal(readinessArtifact.sourceInspectionHandoffState.approvalGrantProduced, false);
  assert.equal(readinessArtifact.sourceInspectionHandoffState.evaluatorExecuted, false);
  assert.equal(readinessArtifact.readinessSummary.readinessArtifactMetadataOnly, true);
  assert.equal(readinessArtifact.readinessSummary.reviewerRoutingPerformed, false);
  assert.equal(readinessArtifact.readinessSummary.reviewerAssignmentPerformed, false);
  assert.equal(readinessArtifact.readinessSummary.evaluatorExecutionPerformed, false);
  assert.equal(readinessArtifact.readinessSummary.evaluatorResultProduced, false);
  assert.equal(readinessArtifact.readinessSummary.approvalDecisionProduced, false);
  assert.equal(readinessArtifact.readinessSummary.approvalGrantProduced, false);
  assert.equal(readinessArtifact.readinessSummary.evaluatorExecuted, false);
  assert.equal(readinessArtifact.integratedReviewSummary.reviewSummaryIsApprovalGrant, false);
  assert.equal(readinessArtifact.integratedReviewSummary.approvalGrantProduced, false);
  assert.equal(readinessArtifact.integratedReviewSummary.approvalGrantPersisted, false);
  assert.equal(readinessArtifact.integratedReviewSummary.approvalGrantId, null);
  assert.equal(readinessArtifact.integratedReviewSummary.runtimeEffectAllFalse, true);
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
    fixture.handoffReadinessArtifactCases.map((artifactCase) => artifactCase.caseId),
    expectedCaseIds
  );

  for (const artifactCase of fixture.handoffReadinessArtifactCases) {
    assert.equal(artifactCase.classification, expectedClassifications[artifactCase.caseId]);
    assert.equal(artifactCase.reviewOnly, true, artifactCase.caseId);
    assert.equal(artifactCase.authoritative, false, artifactCase.caseId);
    assert.equal(artifactCase.reviewArtifactOnly, true, artifactCase.caseId);
    assert.equal(artifactCase.readinessArtifactMetadataOnly, true, artifactCase.caseId);
    assert.equal(artifactCase.readinessArtifactIsReviewerRouting, false);
    assert.equal(artifactCase.readinessArtifactIsReviewerAssignment, false);
    assert.equal(artifactCase.readinessArtifactIsEvaluatorExecution, false);
    assert.equal(artifactCase.readinessArtifactIsEvaluatorResult, false);
    assert.equal(artifactCase.readinessArtifactIsApprovalDecision, false);
    assert.equal(artifactCase.readinessArtifactIsApprovalGrant, false);
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
    fixture.handoffReadinessArtifact.artifactCanPerformReviewerRouting,
    false
  );
  assert.equal(
    fixture.handoffReadinessArtifact.artifactCanAssignReviewers,
    false
  );
  assert.equal(fixture.handoffReadinessArtifact.artifactCanExecuteEvaluator, false);
  assert.equal(
    fixture.handoffReadinessArtifact.artifactCanProduceEvaluatorResult,
    false
  );
  assert.equal(
    fixture.handoffReadinessArtifact.artifactCanProduceApprovalDecision,
    false
  );
  assert.equal(fixture.handoffReadinessArtifact.artifactCanGrantApproval, false);
  assert.equal(fixture.handoffReadinessArtifact.artifactCanPersistGrant, false);
  assert.equal(
    fixture.handoffReadinessArtifact.artifactCanGrantRuntimePermission,
    false
  );
  assert.equal(
    fixture.handoffReadinessArtifact.artifactCanGrantCommandExposurePermission,
    false
  );
  assert.equal(fixture.handoffReadinessArtifact.artifactCanExecuteRuntime, false);
  assertAllFalse(fixture.blockedRuntimeEffect);
}

test("Phase 5.34 handoff readiness artifact fixture is deterministic metadata", async () => {
  const raw = await readFile(fixtureUrl, "utf8");
  const fixture = JSON.parse(raw);

  assert.equal(raw.endsWith("\n"), true);
  assert.equal(raw.includes("\r"), false);
  assert.deepEqual(Object.keys(fixture), expectedTopLevelKeys);
  assert.equal(
    fixture.schema,
    "ardyn.phase-5.34.review-only-handoff-readiness-artifact"
  );
  assert.equal(fixture.schemaVersion, "0.1.0");
  assert.equal(fixture.phase, "phase-5.34-review-only-handoff-readiness-artifact");
  assert.equal(fixture.artifactKind, "review-only-handoff-readiness-artifact");
  assert.equal(fixture.metadataGeneratedAt, "1970-01-01T00:00:00.000Z");
  assert.equal(
    fixture.sourcePhase.phase,
    "phase-5.33-review-only-aggregation-inspection-handoff"
  );
});

test("Phase 5.34 handoff readiness artifact classifies handoff state cases", () => {
  for (const artifactCase of readinessCases()) {
    const result = createReviewOnlyHandoffReadinessArtifactForReview(
      artifactCase.input
    );

    assert.equal(result.schema, REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_SCHEMA);
    assert.equal(result.schemaVersion, "0.1.0");
    assert.equal(result.artifactKind, "review-only-handoff-readiness-artifact");
    assert.equal(result.artifactMode, "review-only");
    assert.equal(result.reviewedAt, reviewedAt);
    assert.equal(result.classification, expectedClassifications[artifactCase.caseId]);
    assert.equal(
      result.readinessArtifactProduced,
      artifactCase.expectedReadinessArtifactProduced,
      artifactCase.caseId
    );
    assertNonAuthorizingResult(result, artifactCase.caseId);
  }
});

test("Phase 5.34 malformed readiness input fails closed without throwing", () => {
  const malformedInputs = [null, "not-an-object", [], 1, true];

  for (const input of malformedInputs) {
    const result = createReviewOnlyHandoffReadinessArtifactForReview(input);

    assert.equal(result.reviewedAt, defaultReviewedAt);
    assert.equal(
      result.classification,
      "malformed_review_only_handoff_readiness_artifact_input_rejected"
    );
    assert.equal(result.handoffStateAccepted, false);
    assert.equal(result.readinessArtifactProduced, false);
    assert.equal(result.readinessArtifact, null);
    assert.equal(result.handoffSummary, null);
    assertNonAuthorizingResult(result, String(input));
  }

  const invalidTimestampResult =
    createReviewOnlyHandoffReadinessArtifactForReview({
      reviewedAt: "not-a-date",
      handoffStates: [validHandoffState("source-readiness-invalid-reviewed-at")]
    });

  assert.equal(invalidTimestampResult.reviewedAt, defaultReviewedAt);
  assert.equal(
    invalidTimestampResult.classification,
    "malformed_review_only_handoff_readiness_artifact_input_rejected"
  );
  assert.equal(invalidTimestampResult.handoffStateAccepted, false);
  assert.equal(invalidTimestampResult.readinessArtifactProduced, false);
  assert.equal(invalidTimestampResult.readinessArtifact, null);
  assert.equal(invalidTimestampResult.handoffSummary, null);
  assertNonAuthorizingResult(invalidTimestampResult, "invalid-readiness-reviewed-at");
});

test("Phase 5.34 valid handoff state produces only readiness artifact metadata", () => {
  const result = validReadinessResult();

  assert.equal(result.handoffStateAccepted, true);
  assert.equal(result.readinessArtifactProduced, true);
  assertNonAuthorizingResult(result, "valid");
  assert.match(result.handoffSummary.stateDigest, /^sha256:[0-9a-f]{64}$/);
  assert.equal(result.handoffSummary.handoffIsReviewerRouting, false);
  assert.equal(result.handoffSummary.handoffIsEvaluatorResult, false);
  assert.equal(result.handoffSummary.handoffIsApprovalDecision, false);
  assert.equal(result.handoffSummary.handoffIsApprovalGrant, false);
  assert.equal(result.handoffSummary.reviewerAssignmentPerformed, false);
  assert.equal(result.handoffSummary.evaluatorResultProduced, false);
  assert.equal(result.handoffSummary.approvalDecisionProduced, false);
  assert.equal(result.handoffSummary.evaluatorExecuted, false);

  assertValidReadinessArtifact(result.readinessArtifact);
});

test("Phase 5.34 rejected handoff state fails closed before readiness artifact", () => {
  for (const artifactCase of readinessCases().filter(
    (entry) => !entry.expectedReadinessArtifactProduced
  )) {
    const result = createReviewOnlyHandoffReadinessArtifactForReview(
      artifactCase.input
    );

    assert.equal(result.handoffStateAccepted, false, artifactCase.caseId);
    assert.equal(result.readinessArtifactProduced, false, artifactCase.caseId);
    assert.equal(result.readinessArtifact, null, artifactCase.caseId);
    assert.equal(result.handoffSummary, null, artifactCase.caseId);
    assertNonAuthorizingResult(result, artifactCase.caseId);
    assert.ok(
      result.rejectionReasons.includes("handoff_readiness_artifact_not_produced"),
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

test("Phase 5.34 fixture mirrors readiness cases and blocks authorization", async () => {
  const fixture = await readJson(fixtureUrl);

  assert.deepEqual(
    fixture.handoffReadinessArtifactSummary,
    expectedReadinessSummary
  );
  assertFixtureCases(fixture);
  assertFixtureReadinessArtifact(fixture);
});

test("serve-runtime remains default-blocked and dry-run cannot bypass Phase 5.34", async () => {
  const fixture = await readJson(fixtureUrl);
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-34-readiness-"));

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

test("Phase 5.34 readiness artifact command names remain rejected", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-34-readiness-probes-"));
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

test("Phase 5.34 does not change CLI runtime source or add readiness commands", async () => {
  const [baselineSource, currentSource] = await Promise.all([
    execFileAsync("git", ["show", `${phase534BaselineCommit}:apps/cli/src/index.mjs`], {
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
    /createReviewOnlyHandoffReadinessArtifactForReview/,
    /review-only-handoff-readiness-artifact/,
    /handoff-readiness-artifact/,
    /reviewer-routing/,
    /reviewer-assignment/,
    /evaluator.*execut/i
  ]) {
    assert.doesNotMatch(currentSource, forbiddenPattern);
  }
});
