import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readFile, readdir, rm, mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";
import {
  NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_BOUNDARY_SCHEMA,
  createApprovalEvaluatorCandidateIntakeCheckpointForReview,
  createNonAuthorizingEvaluatorDecisionCandidateBoundaryForReview,
  createPrerequisiteReviewArtifactBoundaryForReview,
  createReviewArtifactEvaluatorInputHandoffForReview,
  createReviewOnlyEvaluatorPreflightCheckpointForReview
} from "../packages/core/src/index.mjs";

const execFileAsync = promisify(execFile);
const phase529BaselineCommit = "bb85a2c8b49f6ba3f7c0d26cec8e28ea07472e72";
const reviewedAt = "2026-06-16T00:00:00.000Z";
const repoRootUrl = new URL("../", import.meta.url);
const repoRoot = fileURLToPath(repoRootUrl);
const cliSourceUrl = new URL("../apps/cli/src/index.mjs", import.meta.url);
const cliPath = fileURLToPath(cliSourceUrl);
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-29/non-authorizing-evaluator-decision-candidate-boundary.json",
  import.meta.url
);

const expectedTopLevelKeys = Object.freeze([
  "schema",
  "schemaVersion",
  "phase",
  "artifactKind",
  "metadataGeneratedAt",
  "sourcePhase",
  "decisionCandidateSummary",
  "decisionCandidateInputShape",
  "decisionCandidateResultShape",
  "decisionCandidateCases",
  "decisionCandidateStateBoundary",
  "blockedRuntimeEffect",
  "serveRuntimeBlockedBehavior",
  "forbiddenBehavior",
  "filesAllowedToChange",
  "filesForbiddenToChange",
  "validationCommands"
]);

const expectedCaseIds = Object.freeze([
  "missing-non-authorizing-evaluator-decision-candidate-input-rejected",
  "malformed-non-authorizing-evaluator-decision-candidate-input-rejected",
  "malformed-non-authorizing-evaluator-decision-candidate-invalid-reviewed-at-rejected",
  "empty-non-authorizing-evaluator-decision-candidate-input-rejected",
  "conflicting-non-authorizing-evaluator-decision-candidate-input-rejected",
  "stale-non-authorizing-evaluator-decision-candidate-input-rejected",
  "revoked-non-authorizing-evaluator-decision-candidate-input-rejected",
  "unknown-non-authorizing-evaluator-decision-candidate-input-rejected",
  "duplicate-invalid-non-authorizing-evaluator-decision-candidate-input-rejected",
  "authorizing-looking-non-authorizing-evaluator-decision-candidate-input-rejected",
  "grant-looking-non-authorizing-evaluator-decision-candidate-input-rejected",
  "approval-decision-looking-non-authorizing-evaluator-decision-candidate-input-rejected",
  "approval-grant-looking-non-authorizing-evaluator-decision-candidate-input-rejected",
  "runtime-permission-looking-non-authorizing-evaluator-decision-candidate-input-rejected",
  "command-exposure-looking-non-authorizing-evaluator-decision-candidate-input-rejected",
  "evaluator-execution-looking-non-authorizing-evaluator-decision-candidate-input-rejected",
  "runtime-effect-true-non-authorizing-evaluator-decision-candidate-input-rejected",
  "process-flag-true-non-authorizing-evaluator-decision-candidate-input-rejected",
  "unsafe-top-level-non-authorizing-evaluator-decision-candidate-input-rejected",
  "unsafe-nested-decision-preflight-checkpoint-data-non-authorizing-evaluator-decision-candidate-input-rejected",
  "execution-signal-looking-non-authorizing-evaluator-decision-candidate-input-rejected",
  "valid-non-authorizing-evaluator-decision-candidate-state"
]);

const expectedClassifications = Object.freeze({
  "missing-non-authorizing-evaluator-decision-candidate-input-rejected":
    "missing_non_authorizing_evaluator_decision_candidate_input_rejected",
  "malformed-non-authorizing-evaluator-decision-candidate-input-rejected":
    "malformed_non_authorizing_evaluator_decision_candidate_input_rejected",
  "malformed-non-authorizing-evaluator-decision-candidate-invalid-reviewed-at-rejected":
    "malformed_non_authorizing_evaluator_decision_candidate_input_rejected",
  "empty-non-authorizing-evaluator-decision-candidate-input-rejected":
    "empty_non_authorizing_evaluator_decision_candidate_input_rejected",
  "conflicting-non-authorizing-evaluator-decision-candidate-input-rejected":
    "conflicting_non_authorizing_evaluator_decision_candidate_input_rejected",
  "stale-non-authorizing-evaluator-decision-candidate-input-rejected":
    "stale_non_authorizing_evaluator_decision_candidate_input_rejected",
  "revoked-non-authorizing-evaluator-decision-candidate-input-rejected":
    "revoked_non_authorizing_evaluator_decision_candidate_input_rejected",
  "unknown-non-authorizing-evaluator-decision-candidate-input-rejected":
    "unknown_non_authorizing_evaluator_decision_candidate_input_rejected",
  "duplicate-invalid-non-authorizing-evaluator-decision-candidate-input-rejected":
    "duplicate_invalid_non_authorizing_evaluator_decision_candidate_input_rejected",
  "authorizing-looking-non-authorizing-evaluator-decision-candidate-input-rejected":
    "authorizing_non_authorizing_evaluator_decision_candidate_input_rejected",
  "grant-looking-non-authorizing-evaluator-decision-candidate-input-rejected":
    "grant_looking_non_authorizing_evaluator_decision_candidate_input_rejected",
  "approval-decision-looking-non-authorizing-evaluator-decision-candidate-input-rejected":
    "approval_decision_looking_non_authorizing_evaluator_decision_candidate_input_rejected",
  "approval-grant-looking-non-authorizing-evaluator-decision-candidate-input-rejected":
    "approval_grant_looking_non_authorizing_evaluator_decision_candidate_input_rejected",
  "runtime-permission-looking-non-authorizing-evaluator-decision-candidate-input-rejected":
    "runtime_permission_looking_non_authorizing_evaluator_decision_candidate_input_rejected",
  "command-exposure-looking-non-authorizing-evaluator-decision-candidate-input-rejected":
    "command_exposure_looking_non_authorizing_evaluator_decision_candidate_input_rejected",
  "evaluator-execution-looking-non-authorizing-evaluator-decision-candidate-input-rejected":
    "evaluator_execution_looking_non_authorizing_evaluator_decision_candidate_input_rejected",
  "runtime-effect-true-non-authorizing-evaluator-decision-candidate-input-rejected":
    "runtime_effect_true_non_authorizing_evaluator_decision_candidate_input_rejected",
  "process-flag-true-non-authorizing-evaluator-decision-candidate-input-rejected":
    "process_flag_true_non_authorizing_evaluator_decision_candidate_input_rejected",
  "unsafe-top-level-non-authorizing-evaluator-decision-candidate-input-rejected":
    "unsafe_non_authorizing_evaluator_decision_candidate_input_rejected",
  "unsafe-nested-decision-preflight-checkpoint-data-non-authorizing-evaluator-decision-candidate-input-rejected":
    "unsafe_non_authorizing_evaluator_decision_candidate_input_rejected",
  "execution-signal-looking-non-authorizing-evaluator-decision-candidate-input-rejected":
    "execution_signal_looking_non_authorizing_evaluator_decision_candidate_input_rejected",
  "valid-non-authorizing-evaluator-decision-candidate-state":
    "valid_non_authorizing_evaluator_decision_candidate_runtime_still_blocked"
});

const decisionCommandProbes = Object.freeze([
  "review-only-evaluator-decision-candidate",
  "create-non-authorizing-evaluator-decision-candidate",
  "evaluator-decision-candidate-boundary",
  "phase-5-29-non-authorizing-evaluator-decision-candidate-boundary",
  "approval-evaluator-decision-candidate",
  "serve-runtime"
]);

const expectedDecisionSummary = Object.freeze({
  evaluatorDecisionCandidateBoundaryRecorded: true,
  boundaryKind: "non-authorizing-evaluator-decision-candidate-boundary",
  boundaryReviewOnly: true,
  boundaryAuthoritative: false,
  validPreflightCheckpointStateProducesDecisionCandidateState: true,
  missingPreflightCheckpointStateRejected: true,
  malformedPreflightCheckpointStateRejected: true,
  emptyPreflightCheckpointStateRejected: true,
  conflictingPreflightCheckpointStateRejected: true,
  stalePreflightCheckpointStateRejected: true,
  revokedPreflightCheckpointStateRejected: true,
  unknownPreflightCheckpointStateRejected: true,
  duplicateInvalidPreflightCheckpointStateRejected: true,
  authorizingLookingPreflightCheckpointStateRejected: true,
  grantLookingPreflightCheckpointStateRejected: true,
  approvalDecisionLookingPreflightCheckpointStateRejected: true,
  approvalGrantLookingPreflightCheckpointStateRejected: true,
  runtimePermissionLookingPreflightCheckpointStateRejected: true,
  commandExposureLookingPreflightCheckpointStateRejected: true,
  evaluatorExecutionLookingPreflightCheckpointStateRejected: true,
  runtimeEffectTruePreflightCheckpointStateRejected: true,
  processFlagTruePreflightCheckpointStateRejected: true,
  unsafePreflightCheckpointStateRejected: true,
  executionSignalLookingPreflightCheckpointStateRejected: true,
  decisionCandidateStateIsApprovalDecision: false,
  decisionCandidateStateIsApprovalGrant: false,
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

function rejectedDecisionCase(caseId, preflightCheckpointStates) {
  return {
    caseId,
    input: { reviewedAt, preflightCheckpointStates },
    expectedStateProduced: false
  };
}

function acceptedDecisionCase(caseId, preflightCheckpointStates) {
  return {
    caseId,
    input: { reviewedAt, preflightCheckpointStates },
    expectedStateProduced: true
  };
}

function preflightStateWith(sourceId, overrides) {
  return {
    ...validPreflightCheckpointState(sourceId),
    ...overrides
  };
}

function preflightStateWithNested(sourceId, nestedKey, nestedSourceId, overrides) {
  return {
    ...validPreflightCheckpointState(sourceId),
    [nestedKey]: {
      ...validPreflightCheckpointState(nestedSourceId)[nestedKey],
      ...overrides
    }
  };
}

function missingDecisionCase() {
  return {
    caseId: "missing-non-authorizing-evaluator-decision-candidate-input-rejected",
    input: { reviewedAt },
    expectedStateProduced: false
  };
}

function requiredShapeDecisionCases(duplicateState) {
  return [
    missingDecisionCase(),
    rejectedDecisionCase(
      "malformed-non-authorizing-evaluator-decision-candidate-input-rejected",
      [preflightStateWith("source-malformed", { stateMode: "runtime" })]
    ),
    rejectedDecisionCase(
      "malformed-non-authorizing-evaluator-decision-candidate-invalid-reviewed-at-rejected",
      [preflightStateWith("source-invalid-reviewed-at", { reviewedAt: "not-a-date" })]
    ),
    rejectedDecisionCase(
      "empty-non-authorizing-evaluator-decision-candidate-input-rejected",
      []
    ),
    rejectedDecisionCase(
      "conflicting-non-authorizing-evaluator-decision-candidate-input-rejected",
      [
        validPreflightCheckpointState("source-conflict-a"),
        validPreflightCheckpointState("source-conflict-b")
      ]
    ),
    rejectedDecisionCase(
      "stale-non-authorizing-evaluator-decision-candidate-input-rejected",
      [preflightStateWith("source-stale", { reviewedAt: "2026-06-15T00:00:00.000Z" })]
    ),
    rejectedDecisionCase(
      "revoked-non-authorizing-evaluator-decision-candidate-input-rejected",
      [
        preflightStateWith("source-revoked", {
          revocation: {
            revoked: true,
            revokedAt: "2026-06-16T00:00:00.000Z",
            revocationReason: "operator-revoked"
          }
        })
      ]
    ),
    rejectedDecisionCase(
      "unknown-non-authorizing-evaluator-decision-candidate-input-rejected",
      [
        preflightStateWith("source-unknown", {
          schema: "ardyn.phase-5.28.unknown-evaluator-preflight-state",
          stateKind: "unknown-evaluator-preflight-state"
        })
      ]
    ),
    rejectedDecisionCase(
      "duplicate-invalid-non-authorizing-evaluator-decision-candidate-input-rejected",
      [duplicateState, clone(duplicateState)]
    )
  ];
}

function authorizationDecisionCases() {
  return [
    rejectedDecisionCase(
      "authorizing-looking-non-authorizing-evaluator-decision-candidate-input-rejected",
      [preflightStateWith("source-authorizing", { authoritative: true })]
    ),
    rejectedDecisionCase(
      "grant-looking-non-authorizing-evaluator-decision-candidate-input-rejected",
      [preflightStateWith("source-grant-looking", { grantProduced: true })]
    ),
    rejectedDecisionCase(
      "approval-decision-looking-non-authorizing-evaluator-decision-candidate-input-rejected",
      [preflightStateWith("source-approval-decision-looking", { approvalDecisionProduced: true })]
    ),
    rejectedDecisionCase(
      "approval-grant-looking-non-authorizing-evaluator-decision-candidate-input-rejected",
      [
        preflightStateWith("source-approval-grant-looking", {
          approvalGrant: { produced: true, persisted: false, grantId: "grant-looking" }
        })
      ]
    ),
    rejectedDecisionCase(
      "runtime-permission-looking-non-authorizing-evaluator-decision-candidate-input-rejected",
      [preflightStateWith("source-runtime-permission-looking", { runtimePermissionGranted: true })]
    ),
    rejectedDecisionCase(
      "command-exposure-looking-non-authorizing-evaluator-decision-candidate-input-rejected",
      [
        preflightStateWith("source-command-exposure-looking", {
          commandExposurePermissionGranted: true
        })
      ]
    )
  ];
}

function executionUnsafeDecisionCases() {
  return [
    rejectedDecisionCase(
      "evaluator-execution-looking-non-authorizing-evaluator-decision-candidate-input-rejected",
      [preflightStateWith("source-evaluator-execution", { evaluatorExecutionPerformed: true })]
    ),
    rejectedDecisionCase(
      "runtime-effect-true-non-authorizing-evaluator-decision-candidate-input-rejected",
      [
        preflightStateWithNested(
          "source-runtime-effect-claim",
          "runtimeEffect",
          "source-runtime-effect-copy",
          { runtimeEnabled: true }
        )
      ]
    ),
    rejectedDecisionCase(
      "process-flag-true-non-authorizing-evaluator-decision-candidate-input-rejected",
      [preflightStateWith("source-process-claim", { processSpawnEnabled: true })]
    ),
    rejectedDecisionCase(
      "unsafe-top-level-non-authorizing-evaluator-decision-candidate-input-rejected",
      [preflightStateWith("source-unsafe-top-level", { externalSourceLookupEnabled: true })]
    ),
    rejectedDecisionCase(
      "unsafe-nested-decision-preflight-checkpoint-data-non-authorizing-evaluator-decision-candidate-input-rejected",
      [
        preflightStateWithNested(
          "source-nested-unsafe",
          "pipelineSummary",
          "source-nested-unsafe-copy",
          { externalSourceLookup: "file:///not-ingested" }
        )
      ]
    ),
    rejectedDecisionCase(
      "execution-signal-looking-non-authorizing-evaluator-decision-candidate-input-rejected",
      [preflightStateWith("source-execution-signal", { executionSignal: true })]
    )
  ];
}

function decisionCases() {
  const duplicateState = validPreflightCheckpointState("source-duplicate");

  return [
    ...requiredShapeDecisionCases(duplicateState),
    ...authorizationDecisionCases(),
    ...executionUnsafeDecisionCases(),
    acceptedDecisionCase("valid-non-authorizing-evaluator-decision-candidate-state", [
      validPreflightCheckpointState("source-valid")
    ])
  ];
}

async function readJson(url) {
  return JSON.parse(await readFile(url, "utf8"));
}

function assertAllFalse(record) {
  for (const [key, value] of Object.entries(record)) {
    assert.equal(value, false, `${key} should remain false`);
  }
}

function assertNonAuthorizingResult(result, label) {
  assert.equal(result.decisionCandidateStateIsApprovalDecision, false, label);
  assert.equal(result.decisionCandidateStateIsApprovalGrant, false, label);
  assert.equal(result.reviewOnly, true, label);
  assert.equal(result.authoritative, false, label);
  assert.equal(result.reviewArtifactOnly, true, label);
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

test("Phase 5.29 decision-candidate fixture is deterministic metadata", async () => {
  const raw = await readFile(fixtureUrl, "utf8");
  const fixture = JSON.parse(raw);

  assert.equal(raw.endsWith("\n"), true);
  assert.equal(raw.includes("\r"), false);
  assert.deepEqual(Object.keys(fixture), expectedTopLevelKeys);
  assert.equal(
    fixture.schema,
    "ardyn.phase-5.29.non-authorizing-evaluator-decision-candidate-boundary"
  );
  assert.equal(fixture.schemaVersion, "0.1.0");
  assert.equal(
    fixture.phase,
    "phase-5.29-non-authorizing-evaluator-decision-candidate-boundary"
  );
  assert.equal(fixture.artifactKind, "non-authorizing-evaluator-decision-candidate-boundary");
  assert.equal(fixture.metadataGeneratedAt, "1970-01-01T00:00:00.000Z");
  assert.equal(fixture.sourcePhase.phase, "phase-5.28-review-only-evaluator-preflight-checkpoint");
});

test("Phase 5.29 decision candidate classifies preflight state cases", () => {
  for (const decisionCase of decisionCases()) {
    const result = createNonAuthorizingEvaluatorDecisionCandidateBoundaryForReview(
      decisionCase.input
    );

    assert.equal(result.schema, NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_BOUNDARY_SCHEMA);
    assert.equal(result.schemaVersion, "0.1.0");
    assert.equal(result.boundaryKind, "non-authorizing-evaluator-decision-candidate-boundary");
    assert.equal(result.boundaryMode, "review-only");
    assert.equal(result.reviewedAt, reviewedAt);
    assert.equal(result.classification, expectedClassifications[decisionCase.caseId]);
    assert.equal(
      result.decisionCandidateStateProduced,
      decisionCase.expectedStateProduced,
      decisionCase.caseId
    );
    assertNonAuthorizingResult(result, decisionCase.caseId);
  }
});

function validDecisionResult() {
  const validCase = decisionCases().find(
    (decisionCase) =>
      decisionCase.caseId === "valid-non-authorizing-evaluator-decision-candidate-state"
  );

  return createNonAuthorizingEvaluatorDecisionCandidateBoundaryForReview(validCase.input);
}

function assertValidDecisionState(state) {
  assert.equal(state.schema, "ardyn.phase-5.29.review-only-evaluator-decision-candidate-state");
  assert.equal(state.stateKind, "review-only-evaluator-decision-candidate-state");
  assert.equal(state.stateMode, "review-only");
  assert.equal(state.reviewedAt, reviewedAt);
  assert.equal(state.decisionCandidateAccepted, true);
  assert.equal(state.reviewArtifactOnly, true);
  assert.equal(state.decisionCandidateStateIsApprovalDecision, false);
  assert.equal(state.decisionCandidateStateIsApprovalGrant, false);
  assert.equal(state.approvalDecisionProduced, false);
  assert.equal(state.approvalDecisionPersisted, false);
  assert.equal(state.approvalDecisionId, null);
  assert.equal(state.approvalGrantProduced, false);
  assert.equal(state.approvalGrantPersisted, false);
  assert.equal(state.approvalGrantId, null);
  assert.equal(state.evaluatorExecuted, false);
  assertAllFalse(state.runtimeEffect);
}

test("Phase 5.29 valid preflight state produces only decision-candidate state", () => {
  const result = validDecisionResult();

  assert.equal(result.preflightCheckpointStateAccepted, true);
  assert.equal(result.decisionCandidateStateProduced, true);
  assertNonAuthorizingResult(result, "valid");
  assert.match(result.decisionCandidateSummary.stateDigest, /^sha256:[0-9a-f]{64}$/);
  assert.equal(result.decisionCandidateSummary.approvalDecisionProduced, false);
  assert.equal(result.decisionCandidateSummary.evaluatorExecuted, false);

  const state = result.decisionCandidateState;
  assertValidDecisionState(state);
  assert.equal(state.sourcePreflightCheckpointState.schema, "ardyn.phase-5.28.review-only-evaluator-preflight-state");
  assert.equal(state.sourcePreflightCheckpointState.stateKind, "review-only-evaluator-preflight-state");
  assert.match(state.sourcePreflightCheckpointState.stateDigest, /^sha256:[0-9a-f]{64}$/);
  assert.match(
    state.sourcePreflightCheckpointState.sourceIntakeCheckpointStateDigest,
    /^sha256:[0-9a-f]{64}$/
  );
  assert.equal(Object.hasOwn(state.sourcePreflightCheckpointState, "sourceIntakeCheckpointState"), false);
  assert.equal(Object.hasOwn(state.sourcePreflightCheckpointState, "sourceReviewArtifact"), false);
  assert.equal(state.decisionCandidateSummary.reviewArtifactOnly, true);
  assert.equal(state.decisionCandidateSummary.approvalDecisionProduced, false);
  assert.equal(state.integratedReviewSummary.reviewSummaryIsApprovalGrant, false);
  assert.equal(state.integratedReviewSummary.approvalGrantProduced, false);
  assert.equal(state.integratedReviewSummary.approvalGrantPersisted, false);
  assert.equal(state.integratedReviewSummary.approvalGrantId, null);
  assert.equal(state.integratedReviewSummary.runtimeEffectAllFalse, true);
});

test("Phase 5.29 rejected preflight state fails closed before decision state", () => {
  for (const decisionCase of decisionCases().filter((entry) => !entry.expectedStateProduced)) {
    const result = createNonAuthorizingEvaluatorDecisionCandidateBoundaryForReview(
      decisionCase.input
    );

    assert.equal(result.preflightCheckpointStateAccepted, false, decisionCase.caseId);
    assert.equal(result.decisionCandidateStateProduced, false, decisionCase.caseId);
    assert.equal(result.decisionCandidateState, null, decisionCase.caseId);
    assert.equal(result.decisionCandidateSummary, null, decisionCase.caseId);
    assertNonAuthorizingResult(result, decisionCase.caseId);
    assert.ok(
      result.rejectionReasons.includes("evaluator_decision_candidate_state_not_produced"),
      decisionCase.caseId
    );
    assert.ok(result.rejectionReasons.includes("approval_decision_not_implemented"));
    assert.ok(result.rejectionReasons.includes("approval_grant_not_implemented"));
    assert.ok(result.rejectionReasons.includes("evaluator_execution_not_implemented"));
  }
});

function assertFixtureCases(fixture) {
  assert.deepEqual(
    fixture.decisionCandidateCases.map((decisionCase) => decisionCase.caseId),
    expectedCaseIds
  );

  for (const decisionCase of fixture.decisionCandidateCases) {
    assert.equal(decisionCase.classification, expectedClassifications[decisionCase.caseId]);
    assert.equal(decisionCase.reviewOnly, true, decisionCase.caseId);
    assert.equal(decisionCase.authoritative, false, decisionCase.caseId);
    assert.equal(decisionCase.reviewArtifactOnly, true, decisionCase.caseId);
    assert.equal(decisionCase.decisionCandidateStateIsApprovalDecision, false);
    assert.equal(decisionCase.decisionCandidateStateIsApprovalGrant, false);
    assert.equal(decisionCase.approvalDecisionProduced, false);
    assert.equal(decisionCase.approvalGrant.produced, false, decisionCase.caseId);
    assert.equal(decisionCase.approvalGrant.persisted, false, decisionCase.caseId);
    assert.equal(decisionCase.approvalGrant.grantId, null, decisionCase.caseId);
    assert.equal(decisionCase.runtimePermissionGranted, false);
    assert.equal(decisionCase.commandExposurePermissionGranted, false);
    assert.equal(decisionCase.evaluatorExecuted, false);
    assertAllFalse(decisionCase.runtimeEffect);
  }
}

function assertFixtureBoundary(fixture) {
  assert.equal(fixture.decisionCandidateStateBoundary.stateCanExecuteEvaluator, false);
  assert.equal(fixture.decisionCandidateStateBoundary.stateCanProduceApprovalDecision, false);
  assert.equal(fixture.decisionCandidateStateBoundary.stateCanGrantApproval, false);
  assert.equal(fixture.decisionCandidateStateBoundary.stateCanPersistGrant, false);
  assert.equal(fixture.decisionCandidateStateBoundary.stateCanGrantRuntimePermission, false);
  assert.equal(
    fixture.decisionCandidateStateBoundary.stateCanGrantCommandExposurePermission,
    false
  );
  assert.equal(fixture.decisionCandidateStateBoundary.stateCanExecuteRuntime, false);
  assertAllFalse(fixture.blockedRuntimeEffect);
}

test("Phase 5.29 fixture mirrors decision cases and blocks authorization", async () => {
  const fixture = await readJson(fixtureUrl);

  assert.deepEqual(fixture.decisionCandidateSummary, expectedDecisionSummary);
  assertFixtureCases(fixture);
  assertFixtureBoundary(fixture);
});

test("serve-runtime remains default-blocked and dry-run cannot bypass Phase 5.29", async () => {
  const fixture = await readJson(fixtureUrl);
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-29-decision-"));

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

test("Phase 5.29 decision-candidate command names remain rejected", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-29-decision-probes-"));
  const serveRuntimeStderr =
    "Usage: ardyn serve-runtime [--dry-run]\n" +
    "Runtime unavailable: serve-runtime is recognized, but runtime is not enabled in Phase 5.5.\n";

  try {
    for (const commandName of decisionCommandProbes) {
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

test("Phase 5.29 does not change CLI runtime source or add evaluator execution", async () => {
  const [baselineSource, currentSource] = await Promise.all([
    execFileAsync("git", ["show", `${phase529BaselineCommit}:apps/cli/src/index.mjs`], {
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
    /createNonAuthorizingEvaluatorDecisionCandidateBoundaryForReview/,
    /non-authorizing-evaluator-decision-candidate/,
    /evaluator-decision-candidate/,
    /evaluator.*execut/i
  ]) {
    assert.doesNotMatch(currentSource, forbiddenPattern);
  }
});
