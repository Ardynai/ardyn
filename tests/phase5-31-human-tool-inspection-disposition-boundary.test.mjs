import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readFile, readdir, rm, mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";
import {
  HUMAN_TOOL_INSPECTION_DISPOSITION_BOUNDARY_SCHEMA,
  createApprovalEvaluatorCandidateIntakeCheckpointForReview,
  createHumanToolInspectionDispositionBoundaryForReview,
  createNonAuthorizingEvaluatorDecisionCandidateBoundaryForReview,
  createNonAuthorizingEvaluatorDecisionCandidateInspectionArtifactForReview,
  createPrerequisiteReviewArtifactBoundaryForReview,
  createReviewArtifactEvaluatorInputHandoffForReview,
  createReviewOnlyEvaluatorPreflightCheckpointForReview
} from "../packages/core/src/index.mjs";

const execFileAsync = promisify(execFile);
const phase531BaselineCommit = "8ebb88ee9ac6f69a428dce00de03961efdc73d6e";
const reviewedAt = "2026-06-16T00:00:00.000Z";
const defaultReviewedAt = "1970-01-01T00:00:00.000Z";
const repoRootUrl = new URL("../", import.meta.url);
const repoRoot = fileURLToPath(repoRootUrl);
const cliSourceUrl = new URL("../apps/cli/src/index.mjs", import.meta.url);
const cliPath = fileURLToPath(cliSourceUrl);
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-31/human-tool-inspection-disposition-boundary.json",
  import.meta.url
);

const expectedTopLevelKeys = Object.freeze([
  "schema",
  "schemaVersion",
  "phase",
  "artifactKind",
  "metadataGeneratedAt",
  "sourcePhase",
  "dispositionBoundarySummary",
  "dispositionBoundaryInputShape",
  "dispositionBoundaryResultShape",
  "dispositionBoundaryCases",
  "dispositionBoundary",
  "blockedRuntimeEffect",
  "serveRuntimeBlockedBehavior",
  "forbiddenBehavior",
  "filesAllowedToChange",
  "filesForbiddenToChange",
  "validationCommands"
]);

const expectedCaseIds = Object.freeze([
  "missing-human-tool-inspection-disposition-boundary-input-rejected",
  "malformed-human-tool-inspection-disposition-boundary-input-rejected",
  "malformed-human-tool-inspection-disposition-boundary-invalid-reviewed-at-rejected",
  "empty-human-tool-inspection-disposition-boundary-input-rejected",
  "conflicting-human-tool-inspection-disposition-boundary-input-rejected",
  "stale-human-tool-inspection-disposition-boundary-input-rejected",
  "revoked-human-tool-inspection-disposition-boundary-input-rejected",
  "unknown-human-tool-inspection-disposition-boundary-input-rejected",
  "duplicate-invalid-human-tool-inspection-disposition-boundary-input-rejected",
  "authorizing-looking-human-tool-inspection-disposition-boundary-input-rejected",
  "grant-looking-human-tool-inspection-disposition-boundary-input-rejected",
  "approval-decision-looking-human-tool-inspection-disposition-boundary-input-rejected",
  "approval-grant-looking-human-tool-inspection-disposition-boundary-input-rejected",
  "evaluator-result-looking-human-tool-inspection-disposition-boundary-input-rejected",
  "evaluator-execution-looking-human-tool-inspection-disposition-boundary-input-rejected",
  "runtime-permission-looking-human-tool-inspection-disposition-boundary-input-rejected",
  "command-exposure-looking-human-tool-inspection-disposition-boundary-input-rejected",
  "runtime-effect-true-human-tool-inspection-disposition-boundary-input-rejected",
  "process-flag-true-human-tool-inspection-disposition-boundary-input-rejected",
  "unsafe-top-level-human-tool-inspection-disposition-boundary-input-rejected",
  "unsafe-nested-inspection-artifact-disposition-data-human-tool-inspection-disposition-boundary-input-rejected",
  "execution-signal-looking-human-tool-inspection-disposition-boundary-input-rejected",
  "valid-human-tool-inspection-disposition-boundary"
]);

const expectedClassifications = Object.freeze({
  "missing-human-tool-inspection-disposition-boundary-input-rejected":
    "missing_human_tool_inspection_disposition_boundary_input_rejected",
  "malformed-human-tool-inspection-disposition-boundary-input-rejected":
    "malformed_human_tool_inspection_disposition_boundary_input_rejected",
  "malformed-human-tool-inspection-disposition-boundary-invalid-reviewed-at-rejected":
    "malformed_human_tool_inspection_disposition_boundary_input_rejected",
  "empty-human-tool-inspection-disposition-boundary-input-rejected":
    "empty_human_tool_inspection_disposition_boundary_input_rejected",
  "conflicting-human-tool-inspection-disposition-boundary-input-rejected":
    "conflicting_human_tool_inspection_disposition_boundary_input_rejected",
  "stale-human-tool-inspection-disposition-boundary-input-rejected":
    "stale_human_tool_inspection_disposition_boundary_input_rejected",
  "revoked-human-tool-inspection-disposition-boundary-input-rejected":
    "revoked_human_tool_inspection_disposition_boundary_input_rejected",
  "unknown-human-tool-inspection-disposition-boundary-input-rejected":
    "unknown_human_tool_inspection_disposition_boundary_input_rejected",
  "duplicate-invalid-human-tool-inspection-disposition-boundary-input-rejected":
    "duplicate_invalid_human_tool_inspection_disposition_boundary_input_rejected",
  "authorizing-looking-human-tool-inspection-disposition-boundary-input-rejected":
    "authorizing_human_tool_inspection_disposition_boundary_input_rejected",
  "grant-looking-human-tool-inspection-disposition-boundary-input-rejected":
    "grant_looking_human_tool_inspection_disposition_boundary_input_rejected",
  "approval-decision-looking-human-tool-inspection-disposition-boundary-input-rejected":
    "approval_decision_looking_human_tool_inspection_disposition_boundary_input_rejected",
  "approval-grant-looking-human-tool-inspection-disposition-boundary-input-rejected":
    "approval_grant_looking_human_tool_inspection_disposition_boundary_input_rejected",
  "evaluator-result-looking-human-tool-inspection-disposition-boundary-input-rejected":
    "evaluator_result_looking_human_tool_inspection_disposition_boundary_input_rejected",
  "evaluator-execution-looking-human-tool-inspection-disposition-boundary-input-rejected":
    "evaluator_execution_looking_human_tool_inspection_disposition_boundary_input_rejected",
  "runtime-permission-looking-human-tool-inspection-disposition-boundary-input-rejected":
    "runtime_permission_looking_human_tool_inspection_disposition_boundary_input_rejected",
  "command-exposure-looking-human-tool-inspection-disposition-boundary-input-rejected":
    "command_exposure_looking_human_tool_inspection_disposition_boundary_input_rejected",
  "runtime-effect-true-human-tool-inspection-disposition-boundary-input-rejected":
    "runtime_effect_true_human_tool_inspection_disposition_boundary_input_rejected",
  "process-flag-true-human-tool-inspection-disposition-boundary-input-rejected":
    "process_flag_true_human_tool_inspection_disposition_boundary_input_rejected",
  "unsafe-top-level-human-tool-inspection-disposition-boundary-input-rejected":
    "unsafe_human_tool_inspection_disposition_boundary_input_rejected",
  "unsafe-nested-inspection-artifact-disposition-data-human-tool-inspection-disposition-boundary-input-rejected":
    "unsafe_human_tool_inspection_disposition_boundary_input_rejected",
  "execution-signal-looking-human-tool-inspection-disposition-boundary-input-rejected":
    "execution_signal_looking_human_tool_inspection_disposition_boundary_input_rejected",
  "valid-human-tool-inspection-disposition-boundary":
    "valid_human_tool_inspection_disposition_boundary_runtime_still_blocked"
});

const dispositionCommandProbes = Object.freeze([
  "review-only-human-tool-inspection-disposition",
  "create-human-tool-inspection-disposition-boundary",
  "human-tool-inspection-disposition-boundary",
  "phase-5-31-human-tool-inspection-disposition-boundary",
  "approval-evaluator-result",
  "serve-runtime"
]);

const expectedDispositionSummary = Object.freeze({
  humanToolInspectionDispositionBoundaryRecorded: true,
  boundaryKind: "human-tool-inspection-disposition-boundary",
  boundaryReviewOnly: true,
  boundaryAuthoritative: false,
  validInspectionArtifactProducesDispositionState: true,
  missingInspectionArtifactRejected: true,
  malformedInspectionArtifactRejected: true,
  emptyInspectionArtifactRejected: true,
  conflictingInspectionArtifactRejected: true,
  staleInspectionArtifactRejected: true,
  revokedInspectionArtifactRejected: true,
  unknownInspectionArtifactRejected: true,
  duplicateInvalidInspectionArtifactRejected: true,
  authorizingLookingInspectionArtifactRejected: true,
  grantLookingInspectionArtifactRejected: true,
  approvalDecisionLookingInspectionArtifactRejected: true,
  approvalGrantLookingInspectionArtifactRejected: true,
  evaluatorResultLookingInspectionArtifactRejected: true,
  evaluatorExecutionLookingInspectionArtifactRejected: true,
  runtimePermissionLookingInspectionArtifactRejected: true,
  commandExposureLookingInspectionArtifactRejected: true,
  runtimeEffectTrueInspectionArtifactRejected: true,
  processFlagTrueInspectionArtifactRejected: true,
  unsafeInspectionArtifactRejected: true,
  executionSignalLookingInspectionArtifactRejected: true,
  dispositionStateIsApprovalDecision: false,
  dispositionStateIsApprovalGrant: false,
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

function validInspectionArtifact(sourceId = "source-valid") {
  const artifact = createNonAuthorizingEvaluatorDecisionCandidateInspectionArtifactForReview({
    reviewedAt,
    decisionCandidateStates: [validDecisionCandidateState(sourceId)]
  });

  assert.equal(artifact.inspectionArtifactProduced, true, sourceId);
  assert.equal(artifact.inspectionArtifactIsApprovalDecision, false, sourceId);
  assert.equal(artifact.inspectionArtifactIsApprovalGrant, false, sourceId);
  assert.equal(artifact.evaluatorResultProduced, false, sourceId);
  assert.equal(artifact.evaluatorExecuted, false, sourceId);
  return clone(artifact.inspectionArtifact);
}

function rejectedDispositionCase(caseId, inspectionArtifacts) {
  return {
    caseId,
    input: { reviewedAt, inspectionArtifacts },
    expectedDispositionStateProduced: false
  };
}

function acceptedDispositionCase(caseId, inspectionArtifacts) {
  return {
    caseId,
    input: { reviewedAt, inspectionArtifacts },
    expectedDispositionStateProduced: true
  };
}

function inspectionArtifactWith(sourceId, overrides) {
  return {
    ...validInspectionArtifact(sourceId),
    ...overrides
  };
}

function inspectionArtifactWithNested(
  sourceId,
  nestedKey,
  nestedSourceId,
  overrides
) {
  return {
    ...validInspectionArtifact(sourceId),
    [nestedKey]: {
      ...validInspectionArtifact(nestedSourceId)[nestedKey],
      ...overrides
    }
  };
}

function missingDispositionCase() {
  return {
    caseId: "missing-human-tool-inspection-disposition-boundary-input-rejected",
    input: { reviewedAt },
    expectedDispositionStateProduced: false
  };
}

function requiredShapeDispositionCases(duplicateArtifact) {
  return [
    missingDispositionCase(),
    rejectedDispositionCase(
      "malformed-human-tool-inspection-disposition-boundary-input-rejected",
      [inspectionArtifactWith("source-malformed", { artifactMode: "runtime" })]
    ),
    rejectedDispositionCase(
      "malformed-human-tool-inspection-disposition-boundary-invalid-reviewed-at-rejected",
      [
        inspectionArtifactWith("source-invalid-reviewed-at", {
          reviewedAt: "not-a-date"
        })
      ]
    ),
    rejectedDispositionCase(
      "empty-human-tool-inspection-disposition-boundary-input-rejected",
      []
    ),
    rejectedDispositionCase(
      "conflicting-human-tool-inspection-disposition-boundary-input-rejected",
      [
        validInspectionArtifact("source-conflict-a"),
        validInspectionArtifact("source-conflict-b")
      ]
    ),
    rejectedDispositionCase(
      "stale-human-tool-inspection-disposition-boundary-input-rejected",
      [
        inspectionArtifactWith("source-stale", {
          reviewedAt: "2026-06-15T00:00:00.000Z"
        })
      ]
    ),
    rejectedDispositionCase(
      "revoked-human-tool-inspection-disposition-boundary-input-rejected",
      [
        inspectionArtifactWith("source-revoked", {
          revocation: {
            revoked: true,
            revokedAt: "2026-06-16T00:00:00.000Z",
            revocationReason: "operator-revoked"
          }
        })
      ]
    ),
    rejectedDispositionCase(
      "unknown-human-tool-inspection-disposition-boundary-input-rejected",
      [
        inspectionArtifactWith("source-unknown", {
          schema: "ardyn.phase-5.30.unknown-inspection-artifact",
          artifactKind: "unknown-inspection-artifact"
        })
      ]
    ),
    rejectedDispositionCase(
      "duplicate-invalid-human-tool-inspection-disposition-boundary-input-rejected",
      [duplicateArtifact, clone(duplicateArtifact)]
    )
  ];
}

function authorizationDispositionCases() {
  return [
    rejectedDispositionCase(
      "authorizing-looking-human-tool-inspection-disposition-boundary-input-rejected",
      [inspectionArtifactWith("source-authorizing", { authoritative: true })]
    ),
    rejectedDispositionCase(
      "grant-looking-human-tool-inspection-disposition-boundary-input-rejected",
      [inspectionArtifactWith("source-grant-looking", { grantProduced: true })]
    ),
    rejectedDispositionCase(
      "approval-decision-looking-human-tool-inspection-disposition-boundary-input-rejected",
      [
        inspectionArtifactWith("source-approval-decision-looking", {
          approvalDecision: { decisionId: "approval-decision-looking" }
        })
      ]
    ),
    rejectedDispositionCase(
      "approval-grant-looking-human-tool-inspection-disposition-boundary-input-rejected",
      [
        inspectionArtifactWith("source-approval-grant-looking", {
          approvalGrant: { produced: true, persisted: false, grantId: "grant-looking" }
        })
      ]
    ),
    rejectedDispositionCase(
      "evaluator-result-looking-human-tool-inspection-disposition-boundary-input-rejected",
      [
        inspectionArtifactWith("source-evaluator-result", {
          evaluatorResult: { resultId: "evaluator-result-looking" }
        })
      ]
    ),
    rejectedDispositionCase(
      "evaluator-execution-looking-human-tool-inspection-disposition-boundary-input-rejected",
      [
        inspectionArtifactWith("source-evaluator-execution", {
          evaluatorExecutionPerformed: true
        })
      ]
    ),
    rejectedDispositionCase(
      "runtime-permission-looking-human-tool-inspection-disposition-boundary-input-rejected",
      [
        inspectionArtifactWith("source-runtime-permission-looking", {
          runtimePermissionGranted: true
        })
      ]
    ),
    rejectedDispositionCase(
      "command-exposure-looking-human-tool-inspection-disposition-boundary-input-rejected",
      [
        inspectionArtifactWith("source-command-exposure-looking", {
          commandExposurePermissionGranted: true
        })
      ]
    )
  ];
}

function executionUnsafeDispositionCases() {
  return [
    rejectedDispositionCase(
      "runtime-effect-true-human-tool-inspection-disposition-boundary-input-rejected",
      [
        inspectionArtifactWithNested(
          "source-runtime-effect-claim",
          "runtimeEffect",
          "source-runtime-effect-copy",
          { runtimeEnabled: true }
        )
      ]
    ),
    rejectedDispositionCase(
      "process-flag-true-human-tool-inspection-disposition-boundary-input-rejected",
      [inspectionArtifactWith("source-process-claim", { processSpawnEnabled: true })]
    ),
    rejectedDispositionCase(
      "unsafe-top-level-human-tool-inspection-disposition-boundary-input-rejected",
      [
        inspectionArtifactWith("source-unsafe-top-level", {
          externalSourceLookupEnabled: true
        })
      ]
    ),
    rejectedDispositionCase(
      "unsafe-nested-inspection-artifact-disposition-data-human-tool-inspection-disposition-boundary-input-rejected",
      [
        inspectionArtifactWithNested(
          "source-nested-unsafe",
          "dispositionData",
          "source-nested-unsafe-copy",
          { externalSourceLookup: "file:///not-ingested" }
        )
      ]
    ),
    rejectedDispositionCase(
      "execution-signal-looking-human-tool-inspection-disposition-boundary-input-rejected",
      [inspectionArtifactWith("source-execution-signal", { executionSignal: true })]
    )
  ];
}

function dispositionCases() {
  const duplicateArtifact = validInspectionArtifact("source-duplicate");

  return [
    ...requiredShapeDispositionCases(duplicateArtifact),
    ...authorizationDispositionCases(),
    ...executionUnsafeDispositionCases(),
    acceptedDispositionCase(
      "valid-human-tool-inspection-disposition-boundary",
      [validInspectionArtifact("source-valid")]
    )
  ];
}

function validDispositionResult() {
  const validCase = dispositionCases().find(
    (dispositionCase) =>
      dispositionCase.caseId === "valid-human-tool-inspection-disposition-boundary"
  );

  return createHumanToolInspectionDispositionBoundaryForReview(validCase.input);
}

function assertValidDispositionState(dispositionState) {
  assert.equal(
    dispositionState.schema,
    "ardyn.phase-5.31.review-only-human-tool-inspection-disposition-state"
  );
  assert.equal(dispositionState.stateKind, "review-only-human-tool-inspection-disposition-state");
  assert.equal(dispositionState.stateMode, "review-only");
  assert.equal(dispositionState.reviewedAt, reviewedAt);
  assert.equal(dispositionState.inspectionArtifactAccepted, true);
  assert.equal(dispositionState.reviewArtifactOnly, true);
  assert.equal(dispositionState.dispositionStateIsApprovalDecision, false);
  assert.equal(dispositionState.dispositionStateIsApprovalGrant, false);
  assert.equal(dispositionState.evaluatorResultProduced, false);
  assert.equal(dispositionState.evaluatorResultPersisted, false);
  assert.equal(dispositionState.evaluatorResultId, null);
  assert.equal(dispositionState.approvalDecisionProduced, false);
  assert.equal(dispositionState.approvalDecisionPersisted, false);
  assert.equal(dispositionState.approvalDecisionId, null);
  assert.equal(dispositionState.approvalGrantProduced, false);
  assert.equal(dispositionState.approvalGrantPersisted, false);
  assert.equal(dispositionState.approvalGrantId, null);
  assert.equal(dispositionState.runtimePermissionGranted, false);
  assert.equal(dispositionState.commandExposurePermissionGranted, false);
  assert.equal(dispositionState.evaluatorExecuted, false);
  assertAllFalse(dispositionState.runtimeEffect);
  assert.equal(
    dispositionState.sourceInspectionArtifact.schema,
    "ardyn.phase-5.30.non-authorizing-evaluator-decision-candidate-inspection-artifact"
  );
  assert.equal(
    dispositionState.sourceInspectionArtifact.artifactKind,
    "non-authorizing-evaluator-decision-candidate-inspection-artifact"
  );
  assert.equal(dispositionState.sourceInspectionArtifact.artifactMode, "review-only");
  assert.equal(
    Object.hasOwn(dispositionState.sourceInspectionArtifact, "sourceDecisionCandidateState"),
    false
  );
  assert.equal(
    Object.hasOwn(dispositionState.sourceInspectionArtifact, "inspectionSummary"),
    false
  );
  assert.match(dispositionState.sourceInspectionArtifact.artifactDigest, /^sha256:[0-9a-f]{64}$/);
  assert.match(
    dispositionState.sourceInspectionArtifact.sourceDecisionCandidateStateDigest,
    /^sha256:[0-9a-f]{64}$/
  );
  assert.equal(
    dispositionState.sourceInspectionArtifact.inspectionArtifactIsApprovalDecision,
    false
  );
  assert.equal(
    dispositionState.sourceInspectionArtifact.evaluatorResultProduced,
    false
  );
  assert.equal(dispositionState.inspectionSummary.evaluatorResultProduced, false);
  assert.equal(dispositionState.inspectionSummary.approvalDecisionProduced, false);
  assert.equal(dispositionState.inspectionSummary.approvalGrantProduced, false);
  assert.equal(dispositionState.inspectionSummary.evaluatorExecuted, false);
  assert.equal(dispositionState.dispositionSummary.evaluatorResultProduced, false);
  assert.equal(dispositionState.dispositionSummary.approvalDecisionProduced, false);
  assert.equal(dispositionState.dispositionSummary.approvalGrantProduced, false);
  assert.equal(dispositionState.dispositionSummary.evaluatorExecuted, false);
  assert.equal(
    dispositionState.integratedReviewSummary.reviewSummaryIsApprovalGrant,
    false
  );
  assert.equal(dispositionState.integratedReviewSummary.approvalGrantProduced, false);
  assert.equal(dispositionState.integratedReviewSummary.approvalGrantPersisted, false);
  assert.equal(dispositionState.integratedReviewSummary.approvalGrantId, null);
  assert.equal(dispositionState.integratedReviewSummary.runtimeEffectAllFalse, true);
}

function assertNonAuthorizingResult(result, label) {
  assert.equal(result.dispositionStateIsApprovalDecision, false, label);
  assert.equal(result.dispositionStateIsApprovalGrant, false, label);
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
    fixture.dispositionBoundaryCases.map((dispositionCase) => dispositionCase.caseId),
    expectedCaseIds
  );

  for (const dispositionCase of fixture.dispositionBoundaryCases) {
    assert.equal(
      dispositionCase.classification,
      expectedClassifications[dispositionCase.caseId]
    );
    assert.equal(dispositionCase.reviewOnly, true, dispositionCase.caseId);
    assert.equal(dispositionCase.authoritative, false, dispositionCase.caseId);
    assert.equal(dispositionCase.reviewArtifactOnly, true, dispositionCase.caseId);
    assert.equal(dispositionCase.dispositionStateIsApprovalDecision, false);
    assert.equal(dispositionCase.dispositionStateIsApprovalGrant, false);
    assert.equal(dispositionCase.evaluatorResultProduced, false);
    assert.equal(dispositionCase.evaluatorResultPersisted, false);
    assert.equal(dispositionCase.approvalDecisionProduced, false);
    assert.equal(dispositionCase.approvalDecisionPersisted, false);
    assert.equal(dispositionCase.approvalGrant.produced, false, dispositionCase.caseId);
    assert.equal(dispositionCase.approvalGrant.persisted, false, dispositionCase.caseId);
    assert.equal(dispositionCase.approvalGrant.grantId, null, dispositionCase.caseId);
    assert.equal(dispositionCase.runtimePermissionGranted, false);
    assert.equal(dispositionCase.commandExposurePermissionGranted, false);
    assert.equal(dispositionCase.evaluatorExecuted, false);
    assertAllFalse(dispositionCase.runtimeEffect);
  }
}

function assertFixtureBoundary(fixture) {
  assert.equal(fixture.dispositionBoundary.dispositionCanExecuteEvaluator, false);
  assert.equal(fixture.dispositionBoundary.dispositionCanProduceEvaluatorResult, false);
  assert.equal(fixture.dispositionBoundary.dispositionCanProduceApprovalDecision, false);
  assert.equal(fixture.dispositionBoundary.dispositionCanGrantApproval, false);
  assert.equal(fixture.dispositionBoundary.dispositionCanPersistGrant, false);
  assert.equal(fixture.dispositionBoundary.dispositionCanGrantRuntimePermission, false);
  assert.equal(
    fixture.dispositionBoundary.dispositionCanGrantCommandExposurePermission,
    false
  );
  assert.equal(fixture.dispositionBoundary.dispositionCanExecuteRuntime, false);
  assertAllFalse(fixture.blockedRuntimeEffect);
}

test("Phase 5.31 disposition boundary fixture is deterministic metadata", async () => {
  const raw = await readFile(fixtureUrl, "utf8");
  const fixture = JSON.parse(raw);

  assert.equal(raw.endsWith("\n"), true);
  assert.equal(raw.includes("\r"), false);
  assert.deepEqual(Object.keys(fixture), expectedTopLevelKeys);
  assert.equal(
    fixture.schema,
    "ardyn.phase-5.31.human-tool-inspection-disposition-boundary"
  );
  assert.equal(fixture.schemaVersion, "0.1.0");
  assert.equal(
    fixture.phase,
    "phase-5.31-human-tool-inspection-disposition-boundary"
  );
  assert.equal(
    fixture.artifactKind,
    "human-tool-inspection-disposition-boundary"
  );
  assert.equal(fixture.metadataGeneratedAt, "1970-01-01T00:00:00.000Z");
  assert.equal(
    fixture.sourcePhase.phase,
    "phase-5.30-non-authorizing-evaluator-decision-candidate-inspection-artifact"
  );
});

test("Phase 5.31 disposition boundary classifies inspection artifact cases", () => {
  for (const dispositionCase of dispositionCases()) {
    const result = createHumanToolInspectionDispositionBoundaryForReview(
      dispositionCase.input
    );

    assert.equal(
      result.schema,
      HUMAN_TOOL_INSPECTION_DISPOSITION_BOUNDARY_SCHEMA
    );
    assert.equal(result.schemaVersion, "0.1.0");
    assert.equal(
      result.boundaryKind,
      "human-tool-inspection-disposition-boundary"
    );
    assert.equal(result.boundaryMode, "review-only");
    assert.equal(result.reviewedAt, reviewedAt);
    assert.equal(result.classification, expectedClassifications[dispositionCase.caseId]);
    assert.equal(
      result.dispositionStateProduced,
      dispositionCase.expectedDispositionStateProduced,
      dispositionCase.caseId
    );
    assertNonAuthorizingResult(result, dispositionCase.caseId);
  }
});

test("Phase 5.31 malformed boundary input fails closed without throwing", () => {
  const malformedInputs = [null, "not-an-object", [], 1, true];

  for (const input of malformedInputs) {
    const result = createHumanToolInspectionDispositionBoundaryForReview(input);

    assert.equal(result.reviewedAt, defaultReviewedAt);
    assert.equal(
      result.classification,
      "malformed_human_tool_inspection_disposition_boundary_input_rejected"
    );
    assert.equal(result.inspectionArtifactAccepted, false);
    assert.equal(result.dispositionStateProduced, false);
    assert.equal(result.dispositionState, null);
    assert.equal(result.dispositionSummary, null);
    assertNonAuthorizingResult(result, String(input));
  }

  const invalidTimestampResult =
    createHumanToolInspectionDispositionBoundaryForReview({
      reviewedAt: "not-a-date",
      inspectionArtifacts: [validInspectionArtifact("source-boundary-invalid-reviewed-at")]
    });

  assert.equal(invalidTimestampResult.reviewedAt, defaultReviewedAt);
  assert.equal(
    invalidTimestampResult.classification,
    "malformed_human_tool_inspection_disposition_boundary_input_rejected"
  );
  assert.equal(invalidTimestampResult.inspectionArtifactAccepted, false);
  assert.equal(invalidTimestampResult.dispositionStateProduced, false);
  assert.equal(invalidTimestampResult.dispositionState, null);
  assert.equal(invalidTimestampResult.dispositionSummary, null);
  assertNonAuthorizingResult(invalidTimestampResult, "invalid-boundary-reviewed-at");
});

test("Phase 5.31 valid inspection artifact produces only disposition state", () => {
  const result = validDispositionResult();

  assert.equal(result.inspectionArtifactAccepted, true);
  assert.equal(result.dispositionStateProduced, true);
  assertNonAuthorizingResult(result, "valid");
  assert.match(result.dispositionSummary.artifactDigest, /^sha256:[0-9a-f]{64}$/);
  assert.equal(result.dispositionSummary.evaluatorResultProduced, false);
  assert.equal(result.dispositionSummary.approvalDecisionProduced, false);
  assert.equal(result.dispositionSummary.evaluatorExecuted, false);

  assertValidDispositionState(result.dispositionState);
});

test("Phase 5.31 rejected inspection artifact fails closed before disposition state", () => {
  for (const dispositionCase of dispositionCases().filter(
    (entry) => !entry.expectedDispositionStateProduced
  )) {
    const result = createHumanToolInspectionDispositionBoundaryForReview(
      dispositionCase.input
    );

    assert.equal(result.inspectionArtifactAccepted, false, dispositionCase.caseId);
    assert.equal(result.dispositionStateProduced, false, dispositionCase.caseId);
    assert.equal(result.dispositionState, null, dispositionCase.caseId);
    assert.equal(result.dispositionSummary, null, dispositionCase.caseId);
    assertNonAuthorizingResult(result, dispositionCase.caseId);
    assert.ok(
      result.rejectionReasons.includes(
        "human_tool_inspection_disposition_state_not_produced"
      ),
      dispositionCase.caseId
    );
    assert.ok(result.rejectionReasons.includes("evaluator_result_not_implemented"));
    assert.ok(result.rejectionReasons.includes("approval_decision_not_implemented"));
    assert.ok(result.rejectionReasons.includes("approval_grant_not_implemented"));
    assert.ok(result.rejectionReasons.includes("evaluator_execution_not_implemented"));
  }
});

test("Phase 5.31 fixture mirrors disposition cases and blocks authorization", async () => {
  const fixture = await readJson(fixtureUrl);

  assert.deepEqual(fixture.dispositionBoundarySummary, expectedDispositionSummary);
  assertFixtureCases(fixture);
  assertFixtureBoundary(fixture);
});

test("serve-runtime remains default-blocked and dry-run cannot bypass Phase 5.31", async () => {
  const fixture = await readJson(fixtureUrl);
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-31-disposition-"));

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

test("Phase 5.31 disposition command names remain rejected", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-31-disposition-probes-"));
  const serveRuntimeStderr =
    "Usage: ardyn serve-runtime [--dry-run]\n" +
    "Runtime unavailable: serve-runtime is recognized, but runtime is not enabled in Phase 5.5.\n";

  try {
    for (const commandName of dispositionCommandProbes) {
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

test("Phase 5.31 does not change CLI runtime source or add evaluator execution", async () => {
  const [baselineSource, currentSource] = await Promise.all([
    execFileAsync("git", ["show", `${phase531BaselineCommit}:apps/cli/src/index.mjs`], {
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
    /createHumanToolInspectionDispositionBoundaryForReview/,
    /human-tool-inspection-disposition/,
    /inspection-disposition/,
    /evaluator.*execut/i
  ]) {
    assert.doesNotMatch(currentSource, forbiddenPattern);
  }
});
