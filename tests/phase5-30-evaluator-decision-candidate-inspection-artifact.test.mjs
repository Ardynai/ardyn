import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readFile, readdir, rm, mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";
import {
  NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_ARTIFACT_SCHEMA,
  createApprovalEvaluatorCandidateIntakeCheckpointForReview,
  createNonAuthorizingEvaluatorDecisionCandidateBoundaryForReview,
  createNonAuthorizingEvaluatorDecisionCandidateInspectionArtifactForReview,
  createPrerequisiteReviewArtifactBoundaryForReview,
  createReviewArtifactEvaluatorInputHandoffForReview,
  createReviewOnlyEvaluatorPreflightCheckpointForReview
} from "../packages/core/src/index.mjs";

const execFileAsync = promisify(execFile);
const phase530BaselineCommit = "12cbe4c13865d09865cb4652967c156c31360026";
const reviewedAt = "2026-06-16T00:00:00.000Z";
const repoRootUrl = new URL("../", import.meta.url);
const repoRoot = fileURLToPath(repoRootUrl);
const cliSourceUrl = new URL("../apps/cli/src/index.mjs", import.meta.url);
const cliPath = fileURLToPath(cliSourceUrl);
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-30/non-authorizing-evaluator-decision-candidate-inspection-artifact.json",
  import.meta.url
);

const expectedTopLevelKeys = Object.freeze([
  "schema",
  "schemaVersion",
  "phase",
  "artifactKind",
  "metadataGeneratedAt",
  "sourcePhase",
  "inspectionArtifactSummary",
  "inspectionArtifactInputShape",
  "inspectionArtifactResultShape",
  "inspectionArtifactCases",
  "inspectionArtifactBoundary",
  "blockedRuntimeEffect",
  "serveRuntimeBlockedBehavior",
  "forbiddenBehavior",
  "filesAllowedToChange",
  "filesForbiddenToChange",
  "validationCommands"
]);

const expectedCaseIds = Object.freeze([
  "missing-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected",
  "malformed-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected",
  "malformed-non-authorizing-evaluator-decision-candidate-inspection-artifact-invalid-reviewed-at-rejected",
  "empty-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected",
  "conflicting-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected",
  "stale-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected",
  "revoked-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected",
  "unknown-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected",
  "duplicate-invalid-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected",
  "authorizing-looking-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected",
  "grant-looking-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected",
  "approval-decision-looking-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected",
  "approval-grant-looking-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected",
  "runtime-permission-looking-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected",
  "command-exposure-looking-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected",
  "evaluator-execution-looking-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected",
  "evaluator-result-looking-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected",
  "runtime-effect-true-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected",
  "process-flag-true-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected",
  "unsafe-top-level-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected",
  "unsafe-nested-decision-candidate-report-artifact-data-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected",
  "execution-signal-looking-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected",
  "valid-non-authorizing-evaluator-decision-candidate-inspection-artifact"
]);

const expectedClassifications = Object.freeze({
  "missing-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected":
    "missing_non_authorizing_evaluator_decision_candidate_inspection_artifact_input_rejected",
  "malformed-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected":
    "malformed_non_authorizing_evaluator_decision_candidate_inspection_artifact_input_rejected",
  "malformed-non-authorizing-evaluator-decision-candidate-inspection-artifact-invalid-reviewed-at-rejected":
    "malformed_non_authorizing_evaluator_decision_candidate_inspection_artifact_input_rejected",
  "empty-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected":
    "empty_non_authorizing_evaluator_decision_candidate_inspection_artifact_input_rejected",
  "conflicting-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected":
    "conflicting_non_authorizing_evaluator_decision_candidate_inspection_artifact_input_rejected",
  "stale-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected":
    "stale_non_authorizing_evaluator_decision_candidate_inspection_artifact_input_rejected",
  "revoked-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected":
    "revoked_non_authorizing_evaluator_decision_candidate_inspection_artifact_input_rejected",
  "unknown-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected":
    "unknown_non_authorizing_evaluator_decision_candidate_inspection_artifact_input_rejected",
  "duplicate-invalid-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected":
    "duplicate_invalid_non_authorizing_evaluator_decision_candidate_inspection_artifact_input_rejected",
  "authorizing-looking-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected":
    "authorizing_non_authorizing_evaluator_decision_candidate_inspection_artifact_input_rejected",
  "grant-looking-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected":
    "grant_looking_non_authorizing_evaluator_decision_candidate_inspection_artifact_input_rejected",
  "approval-decision-looking-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected":
    "approval_decision_looking_non_authorizing_evaluator_decision_candidate_inspection_artifact_input_rejected",
  "approval-grant-looking-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected":
    "approval_grant_looking_non_authorizing_evaluator_decision_candidate_inspection_artifact_input_rejected",
  "runtime-permission-looking-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected":
    "runtime_permission_looking_non_authorizing_evaluator_decision_candidate_inspection_artifact_input_rejected",
  "command-exposure-looking-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected":
    "command_exposure_looking_non_authorizing_evaluator_decision_candidate_inspection_artifact_input_rejected",
  "evaluator-execution-looking-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected":
    "evaluator_execution_looking_non_authorizing_evaluator_decision_candidate_inspection_artifact_input_rejected",
  "evaluator-result-looking-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected":
    "evaluator_result_looking_non_authorizing_evaluator_decision_candidate_inspection_artifact_input_rejected",
  "runtime-effect-true-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected":
    "runtime_effect_true_non_authorizing_evaluator_decision_candidate_inspection_artifact_input_rejected",
  "process-flag-true-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected":
    "process_flag_true_non_authorizing_evaluator_decision_candidate_inspection_artifact_input_rejected",
  "unsafe-top-level-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected":
    "unsafe_non_authorizing_evaluator_decision_candidate_inspection_artifact_input_rejected",
  "unsafe-nested-decision-candidate-report-artifact-data-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected":
    "unsafe_non_authorizing_evaluator_decision_candidate_inspection_artifact_input_rejected",
  "execution-signal-looking-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected":
    "execution_signal_looking_non_authorizing_evaluator_decision_candidate_inspection_artifact_input_rejected",
  "valid-non-authorizing-evaluator-decision-candidate-inspection-artifact":
    "valid_non_authorizing_evaluator_decision_candidate_inspection_artifact_runtime_still_blocked"
});

const inspectionCommandProbes = Object.freeze([
  "review-only-evaluator-decision-candidate-inspection",
  "create-non-authorizing-evaluator-decision-candidate-inspection-artifact",
  "evaluator-decision-candidate-inspection-artifact",
  "phase-5-30-non-authorizing-evaluator-decision-candidate-inspection-artifact",
  "approval-evaluator-result",
  "serve-runtime"
]);

const expectedInspectionSummary = Object.freeze({
  evaluatorDecisionCandidateInspectionArtifactRecorded: true,
  artifactKind: "non-authorizing-evaluator-decision-candidate-inspection-artifact",
  artifactReviewOnly: true,
  artifactAuthoritative: false,
  validDecisionCandidateStateProducesInspectionArtifact: true,
  missingDecisionCandidateStateRejected: true,
  malformedDecisionCandidateStateRejected: true,
  emptyDecisionCandidateStateRejected: true,
  conflictingDecisionCandidateStateRejected: true,
  staleDecisionCandidateStateRejected: true,
  revokedDecisionCandidateStateRejected: true,
  unknownDecisionCandidateStateRejected: true,
  duplicateInvalidDecisionCandidateStateRejected: true,
  authorizingLookingDecisionCandidateStateRejected: true,
  grantLookingDecisionCandidateStateRejected: true,
  approvalDecisionLookingDecisionCandidateStateRejected: true,
  approvalGrantLookingDecisionCandidateStateRejected: true,
  runtimePermissionLookingDecisionCandidateStateRejected: true,
  commandExposureLookingDecisionCandidateStateRejected: true,
  evaluatorExecutionLookingDecisionCandidateStateRejected: true,
  evaluatorResultLookingDecisionCandidateStateRejected: true,
  runtimeEffectTrueDecisionCandidateStateRejected: true,
  processFlagTrueDecisionCandidateStateRejected: true,
  unsafeDecisionCandidateStateRejected: true,
  executionSignalLookingDecisionCandidateStateRejected: true,
  inspectionArtifactIsApprovalDecision: false,
  inspectionArtifactIsApprovalGrant: false,
  evaluatorResultProduced: false,
  approvalDecisionProduced: false,
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
  assert.equal(preflight.preflightCheckpointStateIsApprovalGrant, false, sourceId);
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
  assert.equal(decision.decisionCandidateStateIsApprovalGrant, false, sourceId);
  assert.equal(decision.evaluatorExecuted, false, sourceId);
  return clone(decision.decisionCandidateState);
}

function rejectedInspectionCase(caseId, decisionCandidateStates) {
  return {
    caseId,
    input: { reviewedAt, decisionCandidateStates },
    expectedArtifactProduced: false
  };
}

function acceptedInspectionCase(caseId, decisionCandidateStates) {
  return {
    caseId,
    input: { reviewedAt, decisionCandidateStates },
    expectedArtifactProduced: true
  };
}

function decisionCandidateStateWith(sourceId, overrides) {
  return {
    ...validDecisionCandidateState(sourceId),
    ...overrides
  };
}

function decisionCandidateStateWithNested(
  sourceId,
  nestedKey,
  nestedSourceId,
  overrides
) {
  return {
    ...validDecisionCandidateState(sourceId),
    [nestedKey]: {
      ...validDecisionCandidateState(nestedSourceId)[nestedKey],
      ...overrides
    }
  };
}

function missingInspectionCase() {
  return {
    caseId:
      "missing-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected",
    input: { reviewedAt },
    expectedArtifactProduced: false
  };
}

function requiredShapeInspectionCases(duplicateState) {
  return [
    missingInspectionCase(),
    rejectedInspectionCase(
      "malformed-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected",
      [decisionCandidateStateWith("source-malformed", { stateMode: "runtime" })]
    ),
    rejectedInspectionCase(
      "malformed-non-authorizing-evaluator-decision-candidate-inspection-artifact-invalid-reviewed-at-rejected",
      [
        decisionCandidateStateWith("source-invalid-reviewed-at", {
          reviewedAt: "not-a-date"
        })
      ]
    ),
    rejectedInspectionCase(
      "empty-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected",
      []
    ),
    rejectedInspectionCase(
      "conflicting-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected",
      [
        validDecisionCandidateState("source-conflict-a"),
        validDecisionCandidateState("source-conflict-b")
      ]
    ),
    rejectedInspectionCase(
      "stale-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected",
      [
        decisionCandidateStateWith("source-stale", {
          reviewedAt: "2026-06-15T00:00:00.000Z"
        })
      ]
    ),
    rejectedInspectionCase(
      "revoked-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected",
      [
        decisionCandidateStateWith("source-revoked", {
          revocation: {
            revoked: true,
            revokedAt: "2026-06-16T00:00:00.000Z",
            revocationReason: "operator-revoked"
          }
        })
      ]
    ),
    rejectedInspectionCase(
      "unknown-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected",
      [
        decisionCandidateStateWith("source-unknown", {
          schema: "ardyn.phase-5.29.unknown-evaluator-decision-candidate-state",
          stateKind: "unknown-evaluator-decision-candidate-state"
        })
      ]
    ),
    rejectedInspectionCase(
      "duplicate-invalid-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected",
      [duplicateState, clone(duplicateState)]
    )
  ];
}

function authorizationInspectionCases() {
  return [
    rejectedInspectionCase(
      "authorizing-looking-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected",
      [decisionCandidateStateWith("source-authorizing", { authoritative: true })]
    ),
    rejectedInspectionCase(
      "grant-looking-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected",
      [decisionCandidateStateWith("source-grant-looking", { grantProduced: true })]
    ),
    rejectedInspectionCase(
      "approval-decision-looking-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected",
      [
        decisionCandidateStateWith("source-approval-decision-looking", {
          approvalDecisionProduced: true
        })
      ]
    ),
    rejectedInspectionCase(
      "approval-grant-looking-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected",
      [
        decisionCandidateStateWith("source-approval-grant-looking", {
          approvalGrant: { produced: true, persisted: false, grantId: "grant-looking" }
        })
      ]
    ),
    rejectedInspectionCase(
      "runtime-permission-looking-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected",
      [
        decisionCandidateStateWith("source-runtime-permission-looking", {
          runtimePermissionGranted: true
        })
      ]
    ),
    rejectedInspectionCase(
      "command-exposure-looking-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected",
      [
        decisionCandidateStateWith("source-command-exposure-looking", {
          commandExposurePermissionGranted: true
        })
      ]
    )
  ];
}

function executionUnsafeInspectionCases() {
  return [
    rejectedInspectionCase(
      "evaluator-execution-looking-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected",
      [
        decisionCandidateStateWith("source-evaluator-execution", {
          evaluatorExecutionPerformed: true
        })
      ]
    ),
    rejectedInspectionCase(
      "evaluator-result-looking-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected",
      [
        decisionCandidateStateWith("source-evaluator-result", {
          evaluatorResultProduced: true
        })
      ]
    ),
    rejectedInspectionCase(
      "runtime-effect-true-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected",
      [
        decisionCandidateStateWithNested(
          "source-runtime-effect-claim",
          "runtimeEffect",
          "source-runtime-effect-copy",
          { runtimeEnabled: true }
        )
      ]
    ),
    rejectedInspectionCase(
      "process-flag-true-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected",
      [decisionCandidateStateWith("source-process-claim", { processSpawnEnabled: true })]
    ),
    rejectedInspectionCase(
      "unsafe-top-level-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected",
      [
        decisionCandidateStateWith("source-unsafe-top-level", {
          externalSourceLookupEnabled: true
        })
      ]
    ),
    rejectedInspectionCase(
      "unsafe-nested-decision-candidate-report-artifact-data-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected",
      [
        decisionCandidateStateWithNested(
          "source-nested-unsafe",
          "inspectionReport",
          "source-nested-unsafe-copy",
          { externalSourceLookup: "file:///not-ingested" }
        )
      ]
    ),
    rejectedInspectionCase(
      "execution-signal-looking-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected",
      [decisionCandidateStateWith("source-execution-signal", { executionSignal: true })]
    )
  ];
}

function inspectionCases() {
  const duplicateState = validDecisionCandidateState("source-duplicate");

  return [
    ...requiredShapeInspectionCases(duplicateState),
    ...authorizationInspectionCases(),
    ...executionUnsafeInspectionCases(),
    acceptedInspectionCase(
      "valid-non-authorizing-evaluator-decision-candidate-inspection-artifact",
      [
        validDecisionCandidateState("source-valid")
      ]
    )
  ];
}

function validInspectionResult() {
  const validCase = inspectionCases().find(
    (inspectionCase) =>
      inspectionCase.caseId ===
      "valid-non-authorizing-evaluator-decision-candidate-inspection-artifact"
  );

  return createNonAuthorizingEvaluatorDecisionCandidateInspectionArtifactForReview(
    validCase.input
  );
}

function assertValidInspectionArtifact(artifact) {
  assert.equal(
    artifact.schema,
    "ardyn.phase-5.30.non-authorizing-evaluator-decision-candidate-inspection-artifact"
  );
  assert.equal(
    artifact.artifactKind,
    "non-authorizing-evaluator-decision-candidate-inspection-artifact"
  );
  assert.equal(artifact.artifactMode, "review-only");
  assert.equal(artifact.reviewedAt, reviewedAt);
  assert.equal(artifact.inspectionArtifactOnly, true);
  assert.equal(artifact.inspectionArtifactIsApprovalDecision, false);
  assert.equal(artifact.inspectionArtifactIsApprovalGrant, false);
  assert.equal(artifact.evaluatorResultProduced, false);
  assert.equal(artifact.evaluatorResultPersisted, false);
  assert.equal(artifact.evaluatorResultId, null);
  assert.equal(artifact.approvalDecisionProduced, false);
  assert.equal(artifact.approvalDecisionPersisted, false);
  assert.equal(artifact.approvalDecisionId, null);
  assert.equal(artifact.approvalGrantProduced, false);
  assert.equal(artifact.approvalGrantPersisted, false);
  assert.equal(artifact.approvalGrantId, null);
  assert.equal(artifact.runtimePermissionGranted, false);
  assert.equal(artifact.commandExposurePermissionGranted, false);
  assert.equal(artifact.evaluatorExecuted, false);
  assertAllFalse(artifact.runtimeEffect);
  assert.equal(
    Object.hasOwn(artifact.sourceDecisionCandidateState, "sourcePreflightCheckpointState"),
    false
  );
  assert.equal(
    Object.hasOwn(artifact.sourceDecisionCandidateState, "integratedReviewSummary"),
    false
  );
  assert.match(
    artifact.sourceDecisionCandidateState.stateDigest,
    /^sha256:[0-9a-f]{64}$/
  );
  assert.match(
    artifact.sourceDecisionCandidateState.sourcePreflightCheckpointStateDigest,
    /^sha256:[0-9a-f]{64}$/
  );
  assert.equal(
    artifact.sourceDecisionCandidateState.decisionCandidateStateIsApprovalDecision,
    false
  );
  assert.equal(
    artifact.sourceDecisionCandidateState.evaluatorResultProduced,
    false
  );
  assert.equal(artifact.inspectionSummary.evaluatorResultProduced, false);
  assert.equal(artifact.inspectionSummary.approvalDecisionProduced, false);
  assert.equal(artifact.inspectionSummary.approvalGrantProduced, false);
  assert.equal(artifact.inspectionSummary.evaluatorExecuted, false);
  assert.equal(artifact.integratedReviewSummary.reviewSummaryIsApprovalGrant, false);
  assert.equal(artifact.integratedReviewSummary.approvalGrantProduced, false);
  assert.equal(artifact.integratedReviewSummary.approvalGrantPersisted, false);
  assert.equal(artifact.integratedReviewSummary.approvalGrantId, null);
  assert.equal(artifact.integratedReviewSummary.runtimeEffectAllFalse, true);
}

function assertNonAuthorizingResult(result, label) {
  assert.equal(result.inspectionArtifactIsApprovalDecision, false, label);
  assert.equal(result.inspectionArtifactIsApprovalGrant, false, label);
  assert.equal(result.reviewOnly, true, label);
  assert.equal(result.authoritative, false, label);
  assert.equal(result.reviewArtifactOnly, true, label);
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

async function readJson(url) {
  return JSON.parse(await readFile(url, "utf8"));
}

function assertAllFalse(record) {
  for (const [key, value] of Object.entries(record)) {
    assert.equal(value, false, `${key} should remain false`);
  }
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
    fixture.inspectionArtifactCases.map((inspectionCase) => inspectionCase.caseId),
    expectedCaseIds
  );

  for (const inspectionCase of fixture.inspectionArtifactCases) {
    assert.equal(
      inspectionCase.classification,
      expectedClassifications[inspectionCase.caseId]
    );
    assert.equal(inspectionCase.reviewOnly, true, inspectionCase.caseId);
    assert.equal(inspectionCase.authoritative, false, inspectionCase.caseId);
    assert.equal(inspectionCase.reviewArtifactOnly, true, inspectionCase.caseId);
    assert.equal(inspectionCase.inspectionArtifactIsApprovalDecision, false);
    assert.equal(inspectionCase.inspectionArtifactIsApprovalGrant, false);
    assert.equal(inspectionCase.evaluatorResultProduced, false);
    assert.equal(inspectionCase.approvalDecisionProduced, false);
    assert.equal(inspectionCase.approvalGrant.produced, false, inspectionCase.caseId);
    assert.equal(inspectionCase.approvalGrant.persisted, false, inspectionCase.caseId);
    assert.equal(inspectionCase.approvalGrant.grantId, null, inspectionCase.caseId);
    assert.equal(inspectionCase.runtimePermissionGranted, false);
    assert.equal(inspectionCase.commandExposurePermissionGranted, false);
    assert.equal(inspectionCase.evaluatorExecuted, false);
    assertAllFalse(inspectionCase.runtimeEffect);
  }
}

function assertFixtureBoundary(fixture) {
  assert.equal(fixture.inspectionArtifactBoundary.artifactCanExecuteEvaluator, false);
  assert.equal(fixture.inspectionArtifactBoundary.artifactCanProduceEvaluatorResult, false);
  assert.equal(fixture.inspectionArtifactBoundary.artifactCanProduceApprovalDecision, false);
  assert.equal(fixture.inspectionArtifactBoundary.artifactCanGrantApproval, false);
  assert.equal(fixture.inspectionArtifactBoundary.artifactCanPersistGrant, false);
  assert.equal(fixture.inspectionArtifactBoundary.artifactCanGrantRuntimePermission, false);
  assert.equal(
    fixture.inspectionArtifactBoundary.artifactCanGrantCommandExposurePermission,
    false
  );
  assert.equal(fixture.inspectionArtifactBoundary.artifactCanExecuteRuntime, false);
  assertAllFalse(fixture.blockedRuntimeEffect);
}

test("Phase 5.30 inspection artifact fixture is deterministic metadata", async () => {
  const raw = await readFile(fixtureUrl, "utf8");
  const fixture = JSON.parse(raw);

  assert.equal(raw.endsWith("\n"), true);
  assert.equal(raw.includes("\r"), false);
  assert.deepEqual(Object.keys(fixture), expectedTopLevelKeys);
  assert.equal(
    fixture.schema,
    "ardyn.phase-5.30.non-authorizing-evaluator-decision-candidate-inspection-artifact"
  );
  assert.equal(fixture.schemaVersion, "0.1.0");
  assert.equal(
    fixture.phase,
    "phase-5.30-non-authorizing-evaluator-decision-candidate-inspection-artifact"
  );
  assert.equal(
    fixture.artifactKind,
    "non-authorizing-evaluator-decision-candidate-inspection-artifact"
  );
  assert.equal(fixture.metadataGeneratedAt, "1970-01-01T00:00:00.000Z");
  assert.equal(
    fixture.sourcePhase.phase,
    "phase-5.29-non-authorizing-evaluator-decision-candidate-boundary"
  );
});

test("Phase 5.30 inspection artifact classifies decision-candidate state cases", () => {
  for (const inspectionCase of inspectionCases()) {
    const result =
      createNonAuthorizingEvaluatorDecisionCandidateInspectionArtifactForReview(
        inspectionCase.input
      );

    assert.equal(
      result.schema,
      NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_ARTIFACT_SCHEMA
    );
    assert.equal(result.schemaVersion, "0.1.0");
    assert.equal(
      result.artifactKind,
      "non-authorizing-evaluator-decision-candidate-inspection-artifact"
    );
    assert.equal(result.artifactMode, "review-only");
    assert.equal(result.reviewedAt, reviewedAt);
    assert.equal(result.classification, expectedClassifications[inspectionCase.caseId]);
    assert.equal(
      result.inspectionArtifactProduced,
      inspectionCase.expectedArtifactProduced,
      inspectionCase.caseId
    );
    assertNonAuthorizingResult(result, inspectionCase.caseId);
  }
});

test("Phase 5.30 valid decision-candidate state produces only inspection artifact", () => {
  const result = validInspectionResult();

  assert.equal(result.decisionCandidateStateAccepted, true);
  assert.equal(result.inspectionArtifactProduced, true);
  assertNonAuthorizingResult(result, "valid");
  assert.match(result.inspectionSummary.stateDigest, /^sha256:[0-9a-f]{64}$/);
  assert.equal(result.inspectionSummary.evaluatorResultProduced, false);
  assert.equal(result.inspectionSummary.approvalDecisionProduced, false);
  assert.equal(result.inspectionSummary.evaluatorExecuted, false);

  assertValidInspectionArtifact(result.inspectionArtifact);
});

test("Phase 5.30 rejected decision-candidate state fails closed before artifact", () => {
  for (const inspectionCase of inspectionCases().filter(
    (entry) => !entry.expectedArtifactProduced
  )) {
    const result =
      createNonAuthorizingEvaluatorDecisionCandidateInspectionArtifactForReview(
        inspectionCase.input
      );

    assert.equal(result.decisionCandidateStateAccepted, false, inspectionCase.caseId);
    assert.equal(result.inspectionArtifactProduced, false, inspectionCase.caseId);
    assert.equal(result.inspectionArtifact, null, inspectionCase.caseId);
    assert.equal(result.inspectionSummary, null, inspectionCase.caseId);
    assertNonAuthorizingResult(result, inspectionCase.caseId);
    assert.ok(
      result.rejectionReasons.includes(
        "evaluator_decision_candidate_inspection_artifact_not_produced"
      ),
      inspectionCase.caseId
    );
    assert.ok(result.rejectionReasons.includes("evaluator_result_not_implemented"));
    assert.ok(result.rejectionReasons.includes("approval_decision_not_implemented"));
    assert.ok(result.rejectionReasons.includes("approval_grant_not_implemented"));
    assert.ok(result.rejectionReasons.includes("evaluator_execution_not_implemented"));
  }
});

test("Phase 5.30 fixture mirrors inspection cases and blocks authorization", async () => {
  const fixture = await readJson(fixtureUrl);

  assert.deepEqual(fixture.inspectionArtifactSummary, expectedInspectionSummary);
  assertFixtureCases(fixture);
  assertFixtureBoundary(fixture);
});

test("serve-runtime remains default-blocked and dry-run cannot bypass Phase 5.30", async () => {
  const fixture = await readJson(fixtureUrl);
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-30-decision-"));

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

test("Phase 5.30 inspection-artifact command names remain rejected", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-30-decision-probes-"));
  const serveRuntimeStderr =
    "Usage: ardyn serve-runtime [--dry-run]\n" +
    "Runtime unavailable: serve-runtime is recognized, but runtime is not enabled in Phase 5.5.\n";

  try {
    for (const commandName of inspectionCommandProbes) {
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

test("Phase 5.30 does not change CLI runtime source or add evaluator execution", async () => {
  const [baselineSource, currentSource] = await Promise.all([
    execFileAsync("git", ["show", `${phase530BaselineCommit}:apps/cli/src/index.mjs`], {
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
    /createNonAuthorizingEvaluatorDecisionCandidateInspectionArtifactForReview/,
    /non-authorizing-evaluator-decision-candidate/,
    /evaluator-decision-candidate/,
    /evaluator.*execut/i
  ]) {
    assert.doesNotMatch(currentSource, forbiddenPattern);
  }
});
