import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readFile, readdir, rm, mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";
import {
  APPROVAL_EVALUATOR_CANDIDATE_INTAKE_CHECKPOINT_SCHEMA,
  createApprovalEvaluatorCandidateIntakeCheckpointForReview,
  createPrerequisiteReviewArtifactBoundaryForReview,
  createReviewArtifactEvaluatorInputHandoffForReview
} from "../packages/core/src/index.mjs";

const execFileAsync = promisify(execFile);
const phase527BaselineCommit = "d2296ac95141866665d657bb12abae48e0f1fec3";
const reviewedAt = "2026-06-16T00:00:00.000Z";
const repoRootUrl = new URL("../", import.meta.url);
const repoRoot = fileURLToPath(repoRootUrl);
const cliSourceUrl = new URL("../apps/cli/src/index.mjs", import.meta.url);
const cliPath = fileURLToPath(cliSourceUrl);
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-27/approval-evaluator-candidate-intake-checkpoint.json",
  import.meta.url
);

const expectedTopLevelKeys = Object.freeze([
  "schema",
  "schemaVersion",
  "phase",
  "artifactKind",
  "metadataGeneratedAt",
  "sourcePhase",
  "intakeSummary",
  "intakeInputShape",
  "intakeResultShape",
  "intakeCases",
  "intakeCheckpointStateBoundary",
  "blockedRuntimeEffect",
  "serveRuntimeBlockedBehavior",
  "forbiddenBehavior",
  "filesAllowedToChange",
  "filesForbiddenToChange",
  "validationCommands"
]);

const expectedCaseIds = Object.freeze([
  "missing-approval-evaluator-candidate-intake-input-rejected",
  "malformed-approval-evaluator-candidate-intake-input-rejected",
  "malformed-approval-evaluator-candidate-invalid-reviewed-at-rejected",
  "empty-approval-evaluator-candidate-intake-input-rejected",
  "conflicting-approval-evaluator-candidate-intake-input-rejected",
  "stale-approval-evaluator-candidate-intake-input-rejected",
  "revoked-approval-evaluator-candidate-intake-input-rejected",
  "unknown-approval-evaluator-candidate-intake-input-rejected",
  "duplicate-invalid-approval-evaluator-candidate-intake-input-rejected",
  "authorizing-looking-approval-evaluator-candidate-intake-input-rejected",
  "runtime-effect-true-approval-evaluator-candidate-intake-input-rejected",
  "process-flag-true-approval-evaluator-candidate-intake-input-rejected",
  "unsafe-approval-evaluator-candidate-intake-input-rejected",
  "nested-unsafe-approval-evaluator-candidate-intake-input-rejected",
  "valid-approval-evaluator-candidate-intake-checkpoint-state"
]);

const expectedClassifications = Object.freeze({
  "missing-approval-evaluator-candidate-intake-input-rejected":
    "missing_approval_evaluator_candidate_intake_input_rejected",
  "malformed-approval-evaluator-candidate-intake-input-rejected":
    "malformed_approval_evaluator_candidate_intake_input_rejected",
  "malformed-approval-evaluator-candidate-invalid-reviewed-at-rejected":
    "malformed_approval_evaluator_candidate_intake_input_rejected",
  "empty-approval-evaluator-candidate-intake-input-rejected":
    "empty_approval_evaluator_candidate_intake_input_rejected",
  "conflicting-approval-evaluator-candidate-intake-input-rejected":
    "conflicting_approval_evaluator_candidate_intake_input_rejected",
  "stale-approval-evaluator-candidate-intake-input-rejected":
    "stale_approval_evaluator_candidate_intake_input_rejected",
  "revoked-approval-evaluator-candidate-intake-input-rejected":
    "revoked_approval_evaluator_candidate_intake_input_rejected",
  "unknown-approval-evaluator-candidate-intake-input-rejected":
    "unknown_approval_evaluator_candidate_intake_input_rejected",
  "duplicate-invalid-approval-evaluator-candidate-intake-input-rejected":
    "duplicate_invalid_approval_evaluator_candidate_intake_input_rejected",
  "authorizing-looking-approval-evaluator-candidate-intake-input-rejected":
    "authorizing_approval_evaluator_candidate_intake_input_rejected",
  "runtime-effect-true-approval-evaluator-candidate-intake-input-rejected":
    "runtime_effect_true_approval_evaluator_candidate_intake_input_rejected",
  "process-flag-true-approval-evaluator-candidate-intake-input-rejected":
    "process_flag_true_approval_evaluator_candidate_intake_input_rejected",
  "unsafe-approval-evaluator-candidate-intake-input-rejected":
    "unsafe_approval_evaluator_candidate_intake_input_rejected",
  "nested-unsafe-approval-evaluator-candidate-intake-input-rejected":
    "unsafe_approval_evaluator_candidate_intake_input_rejected",
  "valid-approval-evaluator-candidate-intake-checkpoint-state":
    "valid_approval_evaluator_candidate_intake_checkpoint_runtime_still_blocked"
});

const intakeCommandProbes = Object.freeze([
  "approval-evaluator-candidate-intake-checkpoint",
  "create-approval-evaluator-candidate-intake",
  "evaluator-candidate-intake-checkpoint",
  "phase-5-27-approval-evaluator-candidate-intake-checkpoint",
  "approval-evaluator-candidate-intake",
  "serve-runtime"
]);

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
    revocation: {
      revoked: false,
      revokedAt: null,
      revocationReason: null
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

function commandExposureApprovalRecord(overrides = {}) {
  return {
    schema: "ardyn.runtime-command-exposure-approval-record",
    schemaVersion: "0.1.0",
    recordKind: "runtime-command-exposure-approval-record",
    recordId: "command-exposure-approval-record-001",
    recordPhase: "phase-5.8-runtime-command-exposure-approval",
    approvalStatus: "approved",
    validity: validity(),
    revocation: {
      revoked: false,
      revokedAt: null,
      revocationReason: null
    },
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

function validRecords(overrides = {}) {
  return [
    runtimeApprovalRecord(overrides.runtimeApprovalRecord),
    commandExposureApprovalRecord(overrides.commandExposureApprovalRecord)
  ];
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
  assert.equal(handoff.evaluatorInputCandidateIsApprovalGrant, false, sourceId);
  return clone(handoff.evaluatorInputCandidate);
}

function intakeCases() {
  const duplicateCandidate = validEvaluatorInputCandidate("source-duplicate");

  return [
    {
      caseId: "missing-approval-evaluator-candidate-intake-input-rejected",
      input: { reviewedAt },
      expectedStateProduced: false
    },
    {
      caseId: "malformed-approval-evaluator-candidate-intake-input-rejected",
      input: {
        reviewedAt,
        evaluatorInputCandidates: [
          {
            ...validEvaluatorInputCandidate("source-malformed"),
            candidateMode: "authorizing"
          }
        ]
      },
      expectedStateProduced: false
    },
    {
      caseId:
        "malformed-approval-evaluator-candidate-invalid-reviewed-at-rejected",
      input: {
        reviewedAt,
        evaluatorInputCandidates: [
          {
            ...validEvaluatorInputCandidate("source-invalid-reviewed-at"),
            reviewedAt: "not-a-date"
          }
        ]
      },
      expectedStateProduced: false
    },
    {
      caseId: "empty-approval-evaluator-candidate-intake-input-rejected",
      input: {
        reviewedAt,
        evaluatorInputCandidates: []
      },
      expectedStateProduced: false
    },
    {
      caseId: "conflicting-approval-evaluator-candidate-intake-input-rejected",
      input: {
        reviewedAt,
        evaluatorInputCandidates: [
          validEvaluatorInputCandidate("source-conflict-a"),
          validEvaluatorInputCandidate("source-conflict-b")
        ]
      },
      expectedStateProduced: false
    },
    {
      caseId: "stale-approval-evaluator-candidate-intake-input-rejected",
      input: {
        reviewedAt,
        evaluatorInputCandidates: [
          {
            ...validEvaluatorInputCandidate("source-stale"),
            reviewedAt: "2026-06-14T00:00:00.000Z"
          }
        ]
      },
      expectedStateProduced: false
    },
    {
      caseId: "revoked-approval-evaluator-candidate-intake-input-rejected",
      input: {
        reviewedAt,
        evaluatorInputCandidates: [
          {
            ...validEvaluatorInputCandidate("source-revoked"),
            revocation: {
              revoked: true,
              revokedAt: "2026-06-16T00:00:00.000Z",
              revocationReason: "operator-revoked"
            }
          }
        ]
      },
      expectedStateProduced: false
    },
    {
      caseId: "unknown-approval-evaluator-candidate-intake-input-rejected",
      input: {
        reviewedAt,
        evaluatorInputCandidates: [
          {
            ...validEvaluatorInputCandidate("source-unknown"),
            schema: "ardyn.phase-5.26.unknown-evaluator-input-candidate",
            candidateKind: "unknown-evaluator-input-candidate"
          }
        ]
      },
      expectedStateProduced: false
    },
    {
      caseId:
        "duplicate-invalid-approval-evaluator-candidate-intake-input-rejected",
      input: {
        reviewedAt,
        evaluatorInputCandidates: [duplicateCandidate, clone(duplicateCandidate)]
      },
      expectedStateProduced: false
    },
    {
      caseId:
        "authorizing-looking-approval-evaluator-candidate-intake-input-rejected",
      input: {
        reviewedAt,
        evaluatorInputCandidates: [
          {
            ...validEvaluatorInputCandidate("source-authorizing"),
            approvalGrantProduced: true
          }
        ]
      },
      expectedStateProduced: false
    },
    {
      caseId:
        "runtime-effect-true-approval-evaluator-candidate-intake-input-rejected",
      input: {
        reviewedAt,
        evaluatorInputCandidates: [
          {
            ...validEvaluatorInputCandidate("source-runtime-effect-claim"),
            runtimeEffect: {
              ...validEvaluatorInputCandidate(
                "source-runtime-effect-claim-copy"
              ).runtimeEffect,
              runtimeEnabled: true
            }
          }
        ]
      },
      expectedStateProduced: false
    },
    {
      caseId:
        "process-flag-true-approval-evaluator-candidate-intake-input-rejected",
      input: {
        reviewedAt,
        evaluatorInputCandidates: [
          {
            ...validEvaluatorInputCandidate("source-process-claim"),
            processSpawnEnabled: true
          }
        ]
      },
      expectedStateProduced: false
    },
    {
      caseId: "unsafe-approval-evaluator-candidate-intake-input-rejected",
      input: {
        reviewedAt,
        evaluatorInputCandidates: [
          {
            ...validEvaluatorInputCandidate("source-unsafe-claim"),
            externalSourceLookupEnabled: true
          }
        ]
      },
      expectedStateProduced: false
    },
    {
      caseId:
        "nested-unsafe-approval-evaluator-candidate-intake-input-rejected",
      input: {
        reviewedAt,
        evaluatorInputCandidates: [
          {
            ...validEvaluatorInputCandidate("source-nested-unsafe-claim"),
            sourceReviewArtifact: {
              ...validEvaluatorInputCandidate("source-nested-unsafe-copy")
                .sourceReviewArtifact,
              externalSourceLookupEnabled: true
            }
          }
        ]
      },
      expectedStateProduced: false
    },
    {
      caseId: "valid-approval-evaluator-candidate-intake-checkpoint-state",
      input: {
        reviewedAt,
        evaluatorInputCandidates: [validEvaluatorInputCandidate("source-valid")]
      },
      expectedStateProduced: true
    }
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

test("Phase 5.27 intake fixture is deterministic metadata", async () => {
  const raw = await readFile(fixtureUrl, "utf8");
  const fixture = JSON.parse(raw);

  assert.equal(raw.endsWith("\n"), true);
  assert.equal(raw.includes("\r"), false);
  assert.deepEqual(Object.keys(fixture), expectedTopLevelKeys);
  assert.equal(
    fixture.schema,
    "ardyn.phase-5.27.approval-evaluator-candidate-intake-checkpoint"
  );
  assert.equal(fixture.schemaVersion, "0.1.0");
  assert.equal(
    fixture.phase,
    "phase-5.27-approval-evaluator-candidate-intake-checkpoint"
  );
  assert.equal(
    fixture.artifactKind,
    "approval-evaluator-candidate-intake-checkpoint"
  );
  assert.equal(fixture.metadataGeneratedAt, "1970-01-01T00:00:00.000Z");
  assert.equal(
    fixture.sourcePhase.phase,
    "phase-5.26-review-artifact-evaluator-input-handoff"
  );
  assert.equal(fixture.sourcePhase.runtimeEnabled, false);
  assert.equal(fixture.sourcePhase.approvalGrantProduced, false);
});

test("Phase 5.27 intake classifies evaluator-input candidate cases", () => {
  for (const intakeCase of intakeCases()) {
    const result = createApprovalEvaluatorCandidateIntakeCheckpointForReview(
      intakeCase.input
    );

    assert.equal(
      result.schema,
      APPROVAL_EVALUATOR_CANDIDATE_INTAKE_CHECKPOINT_SCHEMA
    );
    assert.equal(result.schemaVersion, "0.1.0");
    assert.equal(
      result.checkpointKind,
      "approval-evaluator-candidate-intake-checkpoint"
    );
    assert.equal(result.checkpointMode, "review-only");
    assert.equal(result.reviewedAt, reviewedAt);
    assert.equal(
      result.classification,
      expectedClassifications[intakeCase.caseId],
      intakeCase.caseId
    );
    assert.equal(
      result.intakeCheckpointStateProduced,
      intakeCase.expectedStateProduced,
      intakeCase.caseId
    );
    assert.equal(result.intakeCheckpointStateIsApprovalGrant, false);
    assert.equal(result.reviewOnly, true, intakeCase.caseId);
    assert.equal(result.authoritative, false, intakeCase.caseId);
    assert.equal(result.approvalGrant.produced, false, intakeCase.caseId);
    assert.equal(result.approvalGrant.persisted, false, intakeCase.caseId);
    assert.equal(result.approvalGrant.grantId, null, intakeCase.caseId);
    assert.equal(result.approvalGrantProduced, false, intakeCase.caseId);
    assert.equal(result.approvalGrantPersisted, false, intakeCase.caseId);
    assert.equal(result.approvalGrantId, null, intakeCase.caseId);
    assert.equal(result.runtimePermissionGranted, false, intakeCase.caseId);
    assert.equal(result.commandExposurePermissionGranted, false, intakeCase.caseId);
    assert.equal(result.runtimeCommandExposureEnabled, false, intakeCase.caseId);
    assert.equal(result.runtimeExecutionEnabled, false, intakeCase.caseId);
    assertAllFalse(result.runtimeEffect);
  }
});

test("Phase 5.27 valid candidate produces only intake checkpoint state", () => {
  const validCase = intakeCases().find(
    (intakeCase) =>
      intakeCase.caseId ===
      "valid-approval-evaluator-candidate-intake-checkpoint-state"
  );
  const result = createApprovalEvaluatorCandidateIntakeCheckpointForReview(
    validCase.input
  );

  assert.equal(result.evaluatorInputCandidateAccepted, true);
  assert.equal(result.intakeCheckpointStateProduced, true);
  assert.equal(result.intakeCheckpointStateIsApprovalGrant, false);
  assert.equal(result.approvalGrant.produced, false);
  assert.equal(result.approvalGrant.persisted, false);
  assert.equal(result.approvalGrant.grantId, null);
  assert.match(result.candidateSummary.candidateDigest, /^sha256:[0-9a-f]{64}$/);

  const state = result.intakeCheckpointState;
  assert.equal(
    state.schema,
    "ardyn.phase-5.27.approval-evaluator-candidate-intake-state"
  );
  assert.equal(state.stateKind, "approval-evaluator-candidate-intake-state");
  assert.equal(state.stateMode, "review-only");
  assert.equal(state.reviewedAt, reviewedAt);
  assert.equal(state.approvalEvaluatorInputCandidateAccepted, true);
  assert.equal(state.intakeCheckpointStateIsApprovalGrant, false);
  assert.equal(state.approvalGrantProduced, false);
  assert.equal(state.approvalGrantPersisted, false);
  assert.equal(state.approvalGrantId, null);
  assert.equal(state.runtimePermissionGranted, false);
  assert.equal(state.commandExposurePermissionGranted, false);
  assert.equal(state.runtimeCommandExposureEnabled, false);
  assert.equal(state.runtimeExecutionEnabled, false);
  assertAllFalse(state.runtimeEffect);
  assert.equal(
    state.sourceEvaluatorInputCandidate.schema,
    "ardyn.phase-5.26.review-artifact-evaluator-input-candidate"
  );
  assert.equal(
    state.sourceEvaluatorInputCandidate.candidateKind,
    "review-artifact-evaluator-input-candidate"
  );
  assert.equal(state.sourceEvaluatorInputCandidate.candidateMode, "review-only");
  assert.equal(
    state.sourceEvaluatorInputCandidate.evaluatorInputCandidateIsApprovalGrant,
    false
  );
  assert.equal(state.sourceEvaluatorInputCandidate.approvalGrantProduced, false);
  assert.equal(state.sourceEvaluatorInputCandidate.runtimeEffectAllFalse, true);
  assert.match(
    state.sourceEvaluatorInputCandidate.candidateDigest,
    /^sha256:[0-9a-f]{64}$/
  );
  assert.equal(state.integratedReviewSummary.reviewSummaryIsApprovalGrant, false);
  assert.equal(state.integratedReviewSummary.approvalGrantProduced, false);
  assert.equal(state.integratedReviewSummary.approvalGrantPersisted, false);
  assert.equal(state.integratedReviewSummary.approvalGrantId, null);
  assert.equal(state.integratedReviewSummary.runtimeEffectAllFalse, true);
  assert.deepEqual(state.pipelineSummary, {
    sourceCount: 1,
    selectedSourceId: "source-valid",
    selectedBundlePartId: "phase-5.24-selected-prerequisite-sources",
    readerRecordCount: 2,
    evaluatorClassification:
      "valid_prerequisites_review_only_runtime_still_blocked",
    prerequisiteSignalRecognized: true
  });
});

test("Phase 5.27 rejected candidates fail closed before checkpoint state", () => {
  for (const intakeCase of intakeCases().filter(
    (entry) => !entry.expectedStateProduced
  )) {
    const result = createApprovalEvaluatorCandidateIntakeCheckpointForReview(
      intakeCase.input
    );

    assert.equal(result.evaluatorInputCandidateAccepted, false, intakeCase.caseId);
    assert.equal(result.intakeCheckpointStateProduced, false, intakeCase.caseId);
    assert.equal(result.intakeCheckpointState, null, intakeCase.caseId);
    assert.equal(result.candidateSummary, null, intakeCase.caseId);
    assert.equal(result.approvalGrant.produced, false, intakeCase.caseId);
    assert.ok(
      result.rejectionReasons.includes("intake_checkpoint_state_not_produced"),
      intakeCase.caseId
    );
    assert.ok(
      result.rejectionReasons.includes("approval_grant_not_implemented"),
      intakeCase.caseId
    );
    assert.ok(
      result.rejectionReasons.includes("runtime_enablement_still_blocked"),
      intakeCase.caseId
    );
    assertAllFalse(result.runtimeEffect);
  }
});

test("Phase 5.27 fixture mirrors intake cases and blocks grants", async () => {
  const fixture = await readJson(fixtureUrl);

  assert.deepEqual(fixture.intakeSummary, {
    intakeCheckpointRecorded: true,
    checkpointKind: "approval-evaluator-candidate-intake-checkpoint",
    checkpointReviewOnly: true,
    checkpointAuthoritative: false,
    validEvaluatorInputCandidatesProduceIntakeCheckpointState: true,
    missingEvaluatorInputCandidatesRejected: true,
    malformedEvaluatorInputCandidatesRejected: true,
    emptyEvaluatorInputCandidatesRejected: true,
    conflictingEvaluatorInputCandidatesRejected: true,
    staleEvaluatorInputCandidatesRejected: true,
    revokedEvaluatorInputCandidatesRejected: true,
    unknownEvaluatorInputCandidatesRejected: true,
    duplicateInvalidEvaluatorInputCandidatesRejected: true,
    authorizingLookingEvaluatorInputCandidatesRejected: true,
    runtimeEffectTrueEvaluatorInputCandidatesRejected: true,
    processFlagTrueEvaluatorInputCandidatesRejected: true,
    unsafeEvaluatorInputCandidatesRejected: true,
    intakeCheckpointStateIsApprovalGrant: false,
    approvalGrantProduced: false,
    approvalGrantPersisted: false,
    runtimePermissionGranted: false,
    commandExposurePermissionGranted: false,
    runtimeEnabled: false,
    runtimeCommandEnabled: false,
    runtimeCommandExposureEnabled: false,
    runtimeExecutionEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    canEnableRuntime: false
  });
  assert.deepEqual(
    fixture.intakeCases.map((intakeCase) => intakeCase.caseId),
    expectedCaseIds
  );

  for (const intakeCase of fixture.intakeCases) {
    assert.equal(
      intakeCase.classification,
      expectedClassifications[intakeCase.caseId],
      intakeCase.caseId
    );
    assert.equal(intakeCase.reviewOnly, true, intakeCase.caseId);
    assert.equal(intakeCase.authoritative, false, intakeCase.caseId);
    assert.equal(intakeCase.intakeCheckpointStateIsApprovalGrant, false);
    assert.equal(intakeCase.approvalGrant.produced, false, intakeCase.caseId);
    assert.equal(intakeCase.approvalGrant.persisted, false, intakeCase.caseId);
    assert.equal(intakeCase.approvalGrant.grantId, null, intakeCase.caseId);
    assert.equal(intakeCase.runtimePermissionGranted, false);
    assert.equal(intakeCase.commandExposurePermissionGranted, false);
    assert.equal(intakeCase.runtimeCommandExposureEnabled, false);
    assert.equal(intakeCase.runtimeExecutionEnabled, false);
    assertAllFalse(intakeCase.runtimeEffect);
  }
  assert.equal(
    fixture.intakeCheckpointStateBoundary.stateCanGrantApproval,
    false
  );
  assert.equal(
    fixture.intakeCheckpointStateBoundary.stateCanPersistGrant,
    false
  );
  assert.equal(
    fixture.intakeCheckpointStateBoundary.stateCanGrantRuntimePermission,
    false
  );
  assert.equal(
    fixture.intakeCheckpointStateBoundary
      .stateCanGrantCommandExposurePermission,
    false
  );
  assert.equal(
    fixture.intakeCheckpointStateBoundary.stateCanExposeRuntimeCommand,
    false
  );
  assert.equal(
    fixture.intakeCheckpointStateBoundary.stateCanExecuteRuntime,
    false
  );
  assertAllFalse(fixture.blockedRuntimeEffect);
});

test("serve-runtime remains default-blocked and dry-run cannot bypass Phase 5.27 intake", async () => {
  const fixture = await readJson(fixtureUrl);
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-27-intake-"));

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

test("Phase 5.27 intake command names remain rejected", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-27-intake-probes-"));
  const serveRuntimeStderr =
    "Usage: ardyn serve-runtime [--dry-run]\n" +
    "Runtime unavailable: serve-runtime is recognized, but runtime is not enabled in Phase 5.5.\n";

  try {
    for (const commandName of intakeCommandProbes) {
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

test("Phase 5.27 does not change CLI runtime source or add intake runtime primitives", async () => {
  const [baselineSource, currentSource] = await Promise.all([
    execFileAsync("git", ["show", `${phase527BaselineCommit}:apps/cli/src/index.mjs`], {
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
    /approval.*grant.*create/i,
    /createApprovalEvaluatorCandidateIntakeCheckpointForReview/,
    /approval-evaluator-candidate-intake/,
    /intake-checkpoint-state/
  ]) {
    assert.doesNotMatch(currentSource, forbiddenPattern);
  }
});
