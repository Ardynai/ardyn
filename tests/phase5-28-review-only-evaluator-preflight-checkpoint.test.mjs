import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readFile, readdir, rm, mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";
import {
  REVIEW_ONLY_EVALUATOR_PREFLIGHT_CHECKPOINT_SCHEMA,
  createApprovalEvaluatorCandidateIntakeCheckpointForReview,
  createPrerequisiteReviewArtifactBoundaryForReview,
  createReviewArtifactEvaluatorInputHandoffForReview,
  createReviewOnlyEvaluatorPreflightCheckpointForReview
} from "../packages/core/src/index.mjs";

const execFileAsync = promisify(execFile);
const phase528BaselineCommit = "6142ec9937ce3a1f227527d73fae93a1c9cdbe48";
const reviewedAt = "2026-06-16T00:00:00.000Z";
const repoRootUrl = new URL("../", import.meta.url);
const repoRoot = fileURLToPath(repoRootUrl);
const cliSourceUrl = new URL("../apps/cli/src/index.mjs", import.meta.url);
const cliPath = fileURLToPath(cliSourceUrl);
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-28/review-only-evaluator-preflight-checkpoint.json",
  import.meta.url
);

const expectedTopLevelKeys = Object.freeze([
  "schema",
  "schemaVersion",
  "phase",
  "artifactKind",
  "metadataGeneratedAt",
  "sourcePhase",
  "preflightSummary",
  "preflightInputShape",
  "preflightResultShape",
  "preflightCases",
  "preflightCheckpointStateBoundary",
  "blockedRuntimeEffect",
  "serveRuntimeBlockedBehavior",
  "forbiddenBehavior",
  "filesAllowedToChange",
  "filesForbiddenToChange",
  "validationCommands"
]);

const expectedCaseIds = Object.freeze([
  "missing-review-only-evaluator-preflight-input-rejected",
  "malformed-review-only-evaluator-preflight-input-rejected",
  "malformed-review-only-evaluator-preflight-invalid-reviewed-at-rejected",
  "empty-review-only-evaluator-preflight-input-rejected",
  "conflicting-review-only-evaluator-preflight-input-rejected",
  "stale-review-only-evaluator-preflight-input-rejected",
  "revoked-review-only-evaluator-preflight-input-rejected",
  "unknown-review-only-evaluator-preflight-input-rejected",
  "duplicate-invalid-review-only-evaluator-preflight-input-rejected",
  "authorizing-looking-review-only-evaluator-preflight-input-rejected",
  "grant-looking-review-only-evaluator-preflight-input-rejected",
  "runtime-permission-looking-review-only-evaluator-preflight-input-rejected",
  "command-exposure-looking-review-only-evaluator-preflight-input-rejected",
  "runtime-effect-true-review-only-evaluator-preflight-input-rejected",
  "process-flag-true-review-only-evaluator-preflight-input-rejected",
  "unsafe-top-level-review-only-evaluator-preflight-input-rejected",
  "unsafe-nested-checkpoint-data-review-only-evaluator-preflight-input-rejected",
  "execution-signal-looking-review-only-evaluator-preflight-input-rejected",
  "valid-review-only-evaluator-preflight-checkpoint-state"
]);

const expectedClassifications = Object.freeze({
  "missing-review-only-evaluator-preflight-input-rejected":
    "missing_review_only_evaluator_preflight_checkpoint_input_rejected",
  "malformed-review-only-evaluator-preflight-input-rejected":
    "malformed_review_only_evaluator_preflight_checkpoint_input_rejected",
  "malformed-review-only-evaluator-preflight-invalid-reviewed-at-rejected":
    "malformed_review_only_evaluator_preflight_checkpoint_input_rejected",
  "empty-review-only-evaluator-preflight-input-rejected":
    "empty_review_only_evaluator_preflight_checkpoint_input_rejected",
  "conflicting-review-only-evaluator-preflight-input-rejected":
    "conflicting_review_only_evaluator_preflight_checkpoint_input_rejected",
  "stale-review-only-evaluator-preflight-input-rejected":
    "stale_review_only_evaluator_preflight_checkpoint_input_rejected",
  "revoked-review-only-evaluator-preflight-input-rejected":
    "revoked_review_only_evaluator_preflight_checkpoint_input_rejected",
  "unknown-review-only-evaluator-preflight-input-rejected":
    "unknown_review_only_evaluator_preflight_checkpoint_input_rejected",
  "duplicate-invalid-review-only-evaluator-preflight-input-rejected":
    "duplicate_invalid_review_only_evaluator_preflight_checkpoint_input_rejected",
  "authorizing-looking-review-only-evaluator-preflight-input-rejected":
    "authorizing_review_only_evaluator_preflight_checkpoint_input_rejected",
  "grant-looking-review-only-evaluator-preflight-input-rejected":
    "grant_looking_review_only_evaluator_preflight_checkpoint_input_rejected",
  "runtime-permission-looking-review-only-evaluator-preflight-input-rejected":
    "runtime_permission_looking_review_only_evaluator_preflight_checkpoint_input_rejected",
  "command-exposure-looking-review-only-evaluator-preflight-input-rejected":
    "command_exposure_looking_review_only_evaluator_preflight_checkpoint_input_rejected",
  "runtime-effect-true-review-only-evaluator-preflight-input-rejected":
    "runtime_effect_true_review_only_evaluator_preflight_checkpoint_input_rejected",
  "process-flag-true-review-only-evaluator-preflight-input-rejected":
    "process_flag_true_review_only_evaluator_preflight_checkpoint_input_rejected",
  "unsafe-top-level-review-only-evaluator-preflight-input-rejected":
    "unsafe_review_only_evaluator_preflight_checkpoint_input_rejected",
  "unsafe-nested-checkpoint-data-review-only-evaluator-preflight-input-rejected":
    "unsafe_review_only_evaluator_preflight_checkpoint_input_rejected",
  "execution-signal-looking-review-only-evaluator-preflight-input-rejected":
    "execution_signal_looking_review_only_evaluator_preflight_checkpoint_input_rejected",
  "valid-review-only-evaluator-preflight-checkpoint-state":
    "valid_review_only_evaluator_preflight_checkpoint_runtime_still_blocked"
});

const preflightCommandProbes = Object.freeze([
  "review-only-evaluator-preflight-checkpoint",
  "create-review-only-evaluator-preflight",
  "evaluator-preflight-checkpoint",
  "phase-5-28-review-only-evaluator-preflight-checkpoint",
  "approval-evaluator-preflight",
  "serve-runtime"
]);

const prototypePollutionMetadataKeys = Object.freeze([
  "__proto__",
  "constructor",
  "prototype"
]);

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function defineEnumerableDataProperty(record, key, value) {
  Object.defineProperty(record, key, {
    value,
    enumerable: true,
    configurable: true,
    writable: true
  });

  return record;
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

function validIntakeCheckpointState(sourceId = "source-valid") {
  const intake = createApprovalEvaluatorCandidateIntakeCheckpointForReview({
    reviewedAt,
    evaluatorInputCandidates: [validEvaluatorInputCandidate(sourceId)]
  });

  assert.equal(intake.intakeCheckpointStateProduced, true, sourceId);
  assert.equal(intake.intakeCheckpointStateIsApprovalGrant, false, sourceId);
  return clone(intake.intakeCheckpointState);
}

function rejectedPreflightCase(caseId, intakeCheckpointStates) {
  return {
    caseId,
    input: {
      reviewedAt,
      intakeCheckpointStates
    },
    expectedStateProduced: false
  };
}

function acceptedPreflightCase(caseId, intakeCheckpointStates) {
  return {
    caseId,
    input: {
      reviewedAt,
      intakeCheckpointStates
    },
    expectedStateProduced: true
  };
}

function intakeStateWith(sourceId, overrides) {
  return {
    ...validIntakeCheckpointState(sourceId),
    ...overrides
  };
}

function intakeStateWithNested(sourceId, nestedKey, nestedSourceId, overrides) {
  return {
    ...validIntakeCheckpointState(sourceId),
    [nestedKey]: {
      ...validIntakeCheckpointState(nestedSourceId)[nestedKey],
      ...overrides
    }
  };
}

function missingPreflightCase() {
  return {
    caseId: "missing-review-only-evaluator-preflight-input-rejected",
    input: { reviewedAt },
    expectedStateProduced: false
  };
}

function requiredShapePreflightCases(duplicateState) {
  return [
    missingPreflightCase(),
    rejectedPreflightCase(
      "malformed-review-only-evaluator-preflight-input-rejected",
      [intakeStateWith("source-malformed", { stateMode: "authorizing" })]
    ),
    rejectedPreflightCase(
      "malformed-review-only-evaluator-preflight-invalid-reviewed-at-rejected",
      [intakeStateWith("source-invalid-reviewed-at", { reviewedAt: "not-a-date" })]
    ),
    rejectedPreflightCase("empty-review-only-evaluator-preflight-input-rejected", []),
    rejectedPreflightCase(
      "conflicting-review-only-evaluator-preflight-input-rejected",
      [
        validIntakeCheckpointState("source-conflict-a"),
        validIntakeCheckpointState("source-conflict-b")
      ]
    ),
    rejectedPreflightCase("stale-review-only-evaluator-preflight-input-rejected", [
      intakeStateWith("source-stale", { reviewedAt: "2026-06-15T00:00:00.000Z" })
    ]),
    rejectedPreflightCase("revoked-review-only-evaluator-preflight-input-rejected", [
      intakeStateWith("source-revoked", {
        revocation: {
          revoked: true,
          revokedAt: "2026-06-16T00:00:00.000Z",
          revocationReason: "operator-revoked"
        }
      })
    ]),
    rejectedPreflightCase("unknown-review-only-evaluator-preflight-input-rejected", [
      intakeStateWith("source-unknown", {
        schema: "ardyn.phase-5.27.unknown-intake-checkpoint-state",
        stateKind: "unknown-intake-checkpoint-state"
      })
    ]),
    rejectedPreflightCase(
      "duplicate-invalid-review-only-evaluator-preflight-input-rejected",
      [duplicateState, clone(duplicateState)]
    )
  ];
}

function unsafeSignalPreflightCases() {
  return [
    rejectedPreflightCase(
      "authorizing-looking-review-only-evaluator-preflight-input-rejected",
      [intakeStateWith("source-authorizing", { authoritative: true })]
    ),
    rejectedPreflightCase("grant-looking-review-only-evaluator-preflight-input-rejected", [
      intakeStateWith("source-grant-looking", {
        approvalGrant: {
          produced: true,
          persisted: false,
          grantId: "grant-looking"
        }
      })
    ]),
    rejectedPreflightCase(
      "runtime-permission-looking-review-only-evaluator-preflight-input-rejected",
      [intakeStateWith("source-runtime-permission-looking", { runtimePermissionGranted: true })]
    ),
    rejectedPreflightCase(
      "command-exposure-looking-review-only-evaluator-preflight-input-rejected",
      [
        intakeStateWith("source-command-exposure-looking", {
          commandExposurePermissionGranted: true
        })
      ]
    ),
    rejectedPreflightCase(
      "runtime-effect-true-review-only-evaluator-preflight-input-rejected",
      [
        intakeStateWithNested(
          "source-runtime-effect-claim",
          "runtimeEffect",
          "source-runtime-effect-copy",
          { runtimeEnabled: true }
        )
      ]
    ),
    rejectedPreflightCase(
      "process-flag-true-review-only-evaluator-preflight-input-rejected",
      [intakeStateWith("source-process-claim", { processSpawnEnabled: true })]
    ),
    rejectedPreflightCase("unsafe-top-level-review-only-evaluator-preflight-input-rejected", [
      intakeStateWith("source-unsafe-top-level", { externalSourceLookupEnabled: true })
    ]),
    rejectedPreflightCase(
      "unsafe-nested-checkpoint-data-review-only-evaluator-preflight-input-rejected",
      [
        intakeStateWithNested(
          "source-nested-unsafe",
          "pipelineSummary",
          "source-nested-unsafe-copy",
          { externalSourceLookup: "file:///not-ingested" }
        )
      ]
    ),
    rejectedPreflightCase(
      "execution-signal-looking-review-only-evaluator-preflight-input-rejected",
      [intakeStateWith("source-execution-signal", { evaluatorExecuted: true })]
    )
  ];
}

function preflightCases() {
  const duplicateState = validIntakeCheckpointState("source-duplicate");

  return [
    ...requiredShapePreflightCases(duplicateState),
    ...unsafeSignalPreflightCases(),
    acceptedPreflightCase("valid-review-only-evaluator-preflight-checkpoint-state", [
      validIntakeCheckpointState("source-valid")
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

test("Phase 5.28 preflight fixture is deterministic metadata", async () => {
  const raw = await readFile(fixtureUrl, "utf8");
  const fixture = JSON.parse(raw);

  assert.equal(raw.endsWith("\n"), true);
  assert.equal(raw.includes("\r"), false);
  assert.deepEqual(Object.keys(fixture), expectedTopLevelKeys);
  assert.equal(
    fixture.schema,
    "ardyn.phase-5.28.review-only-evaluator-preflight-checkpoint"
  );
  assert.equal(fixture.schemaVersion, "0.1.0");
  assert.equal(
    fixture.phase,
    "phase-5.28-review-only-evaluator-preflight-checkpoint"
  );
  assert.equal(
    fixture.artifactKind,
    "review-only-evaluator-preflight-checkpoint"
  );
  assert.equal(fixture.metadataGeneratedAt, "1970-01-01T00:00:00.000Z");
  assert.equal(
    fixture.sourcePhase.phase,
    "phase-5.27-approval-evaluator-candidate-intake-checkpoint"
  );
  assert.equal(fixture.sourcePhase.runtimeEnabled, false);
  assert.equal(fixture.sourcePhase.approvalGrantProduced, false);
  assert.equal(fixture.sourcePhase.evaluatorExecutionPerformed, false);
});

test("Phase 5.28 preflight classifies intake checkpoint state cases", () => {
  for (const preflightCase of preflightCases()) {
    const result = createReviewOnlyEvaluatorPreflightCheckpointForReview(
      preflightCase.input
    );

    assert.equal(result.schema, REVIEW_ONLY_EVALUATOR_PREFLIGHT_CHECKPOINT_SCHEMA);
    assert.equal(result.schemaVersion, "0.1.0");
    assert.equal(
      result.checkpointKind,
      "review-only-evaluator-preflight-checkpoint"
    );
    assert.equal(result.checkpointMode, "review-only");
    assert.equal(result.reviewedAt, reviewedAt);
    assert.equal(
      result.classification,
      expectedClassifications[preflightCase.caseId],
      preflightCase.caseId
    );
    assert.equal(
      result.preflightCheckpointStateProduced,
      preflightCase.expectedStateProduced,
      preflightCase.caseId
    );
    assert.equal(result.preflightCheckpointStateIsApprovalGrant, false);
    assert.equal(result.reviewOnly, true, preflightCase.caseId);
    assert.equal(result.authoritative, false, preflightCase.caseId);
    assert.equal(result.approvalGrant.produced, false, preflightCase.caseId);
    assert.equal(result.approvalGrant.persisted, false, preflightCase.caseId);
    assert.equal(result.approvalGrant.grantId, null, preflightCase.caseId);
    assert.equal(result.approvalGrantProduced, false, preflightCase.caseId);
    assert.equal(result.approvalGrantPersisted, false, preflightCase.caseId);
    assert.equal(result.approvalGrantId, null, preflightCase.caseId);
    assert.equal(result.runtimePermissionGranted, false, preflightCase.caseId);
    assert.equal(result.commandExposurePermissionGranted, false, preflightCase.caseId);
    assert.equal(result.runtimeCommandExposureEnabled, false, preflightCase.caseId);
    assert.equal(result.runtimeExecutionEnabled, false, preflightCase.caseId);
    assert.equal(result.evaluatorExecutionRequested, false, preflightCase.caseId);
    assert.equal(result.evaluatorExecutionStarted, false, preflightCase.caseId);
    assert.equal(result.evaluatorExecutionEnabled, false, preflightCase.caseId);
    assert.equal(result.evaluatorExecuted, false, preflightCase.caseId);
    assertAllFalse(result.runtimeEffect);
  }
});

test("Phase 5.28 valid checkpoint produces only evaluator preflight state", () => {
  const validCase = preflightCases().find(
    (preflightCase) =>
      preflightCase.caseId ===
      "valid-review-only-evaluator-preflight-checkpoint-state"
  );
  const result = createReviewOnlyEvaluatorPreflightCheckpointForReview(
    validCase.input
  );

  assert.equal(result.intakeCheckpointStateAccepted, true);
  assert.equal(result.preflightCheckpointStateProduced, true);
  assert.equal(result.preflightCheckpointStateIsApprovalGrant, false);
  assert.equal(result.approvalGrant.produced, false);
  assert.equal(result.approvalGrant.persisted, false);
  assert.equal(result.approvalGrant.grantId, null);
  assert.match(result.checkpointSummary.stateDigest, /^sha256:[0-9a-f]{64}$/);
  assert.equal(result.evaluatorExecuted, false);

  const state = result.preflightCheckpointState;
  assert.equal(
    state.schema,
    "ardyn.phase-5.28.review-only-evaluator-preflight-state"
  );
  assert.equal(state.stateKind, "review-only-evaluator-preflight-state");
  assert.equal(state.stateMode, "review-only");
  assert.equal(state.reviewedAt, reviewedAt);
  assert.equal(state.evaluatorPreflightAccepted, true);
  assert.equal(state.evaluatorPreflightCheckpointStateIsApprovalGrant, false);
  assert.equal(state.approvalGrantProduced, false);
  assert.equal(state.approvalGrantPersisted, false);
  assert.equal(state.approvalGrantId, null);
  assert.equal(state.runtimePermissionGranted, false);
  assert.equal(state.commandExposurePermissionGranted, false);
  assert.equal(state.runtimeCommandExposureEnabled, false);
  assert.equal(state.runtimeExecutionEnabled, false);
  assert.equal(state.evaluatorExecutionRequested, false);
  assert.equal(state.evaluatorExecutionStarted, false);
  assert.equal(state.evaluatorExecutionEnabled, false);
  assert.equal(state.evaluatorExecuted, false);
  assertAllFalse(state.runtimeEffect);
  assert.equal(
    state.sourceIntakeCheckpointState.schema,
    "ardyn.phase-5.27.approval-evaluator-candidate-intake-state"
  );
  assert.equal(
    state.sourceIntakeCheckpointState.stateKind,
    "approval-evaluator-candidate-intake-state"
  );
  assert.equal(state.sourceIntakeCheckpointState.stateMode, "review-only");
  assert.match(
    state.sourceIntakeCheckpointState.stateDigest,
    /^sha256:[0-9a-f]{64}$/
  );
  assert.match(
    state.sourceIntakeCheckpointState.sourceEvaluatorInputCandidateDigest,
    /^sha256:[0-9a-f]{64}$/
  );
  assert.equal(
    Object.hasOwn(state.sourceIntakeCheckpointState, "sourceReviewArtifact"),
    false
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

test("Phase 5.44A preflight path lookup ignores inherited grant-looking data", () => {
  const state = validIntakeCheckpointState("source-phase-5-44a-inherited-grant");
  const pollutedPrototype = Object.create(null);
  pollutedPrototype.approvalGrant = {
    produced: true,
    persisted: true
  };
  for (const key of prototypePollutionMetadataKeys) {
    defineEnumerableDataProperty(pollutedPrototype, key, {
      ardynPhase544APrototypePolluted: true
    });
  }
  Object.setPrototypeOf(state, pollutedPrototype);

  const result = createReviewOnlyEvaluatorPreflightCheckpointForReview({
    reviewedAt,
    intakeCheckpointStates: [state]
  });

  assert.equal(
    result.classification,
    "valid_review_only_evaluator_preflight_checkpoint_runtime_still_blocked"
  );
  assert.equal(result.intakeCheckpointStateAccepted, true);
  assert.equal(result.preflightCheckpointStateProduced, true);
  assert.equal(result.approvalGrant.produced, false);
  assert.equal(result.approvalGrant.persisted, false);
  assert.equal(Object.prototype.ardynPhase544APrototypePolluted, undefined);
  assert.equal({}.ardynPhase544APrototypePolluted, undefined);
});

test("Phase 5.44A prototype-pollution metadata keys fail closed without prototype mutation", () => {
  for (const key of prototypePollutionMetadataKeys) {
    const state = validIntakeCheckpointState(`source-phase-5-44a-${key}`);
    defineEnumerableDataProperty(state.integratedReviewSummary, key, {
      ardynPhase544APrototypePolluted: true,
      approvalGrant: {
        produced: true,
        persisted: true
      }
    });

    const result = createReviewOnlyEvaluatorPreflightCheckpointForReview({
      reviewedAt,
      intakeCheckpointStates: [state]
    });

    assert.equal(
      result.classification,
      "malformed_review_only_evaluator_preflight_checkpoint_input_rejected",
      key
    );
    assert.equal(result.intakeCheckpointStateAccepted, false, key);
    assert.equal(result.preflightCheckpointStateProduced, false, key);
    assert.equal(result.preflightCheckpointState, null, key);
    assert.equal(result.approvalGrant.produced, false, key);
    assert.equal(result.approvalGrant.persisted, false, key);
    assert.equal(Object.prototype.ardynPhase544APrototypePolluted, undefined, key);
    assert.equal({}.ardynPhase544APrototypePolluted, undefined, key);
  }
});

test("Phase 5.28 rejected checkpoint state fails closed before preflight state", () => {
  for (const preflightCase of preflightCases().filter(
    (entry) => !entry.expectedStateProduced
  )) {
    const result = createReviewOnlyEvaluatorPreflightCheckpointForReview(
      preflightCase.input
    );

    assert.equal(result.intakeCheckpointStateAccepted, false, preflightCase.caseId);
    assert.equal(result.preflightCheckpointStateProduced, false, preflightCase.caseId);
    assert.equal(result.preflightCheckpointState, null, preflightCase.caseId);
    assert.equal(result.checkpointSummary, null, preflightCase.caseId);
    assert.equal(result.approvalGrant.produced, false, preflightCase.caseId);
    assert.equal(result.evaluatorExecuted, false, preflightCase.caseId);
    assert.ok(
      result.rejectionReasons.includes(
        "evaluator_preflight_checkpoint_state_not_produced"
      ),
      preflightCase.caseId
    );
    assert.ok(
      result.rejectionReasons.includes("approval_grant_not_implemented"),
      preflightCase.caseId
    );
    assert.ok(
      result.rejectionReasons.includes("evaluator_execution_not_implemented"),
      preflightCase.caseId
    );
    assert.ok(
      result.rejectionReasons.includes("runtime_enablement_still_blocked"),
      preflightCase.caseId
    );
    assertAllFalse(result.runtimeEffect);
  }
});

test("Phase 5.28 fixture mirrors preflight cases and blocks grants", async () => {
  const fixture = await readJson(fixtureUrl);

  assert.deepEqual(fixture.preflightSummary, {
    evaluatorPreflightCheckpointRecorded: true,
    checkpointKind: "review-only-evaluator-preflight-checkpoint",
    checkpointReviewOnly: true,
    checkpointAuthoritative: false,
    validIntakeCheckpointStateProducesPreflightState: true,
    missingIntakeCheckpointStateRejected: true,
    malformedIntakeCheckpointStateRejected: true,
    emptyIntakeCheckpointStateRejected: true,
    conflictingIntakeCheckpointStateRejected: true,
    staleIntakeCheckpointStateRejected: true,
    revokedIntakeCheckpointStateRejected: true,
    unknownIntakeCheckpointStateRejected: true,
    duplicateInvalidIntakeCheckpointStateRejected: true,
    authorizingLookingIntakeCheckpointStateRejected: true,
    grantLookingIntakeCheckpointStateRejected: true,
    runtimePermissionLookingIntakeCheckpointStateRejected: true,
    commandExposureLookingIntakeCheckpointStateRejected: true,
    runtimeEffectTrueIntakeCheckpointStateRejected: true,
    processFlagTrueIntakeCheckpointStateRejected: true,
    unsafeIntakeCheckpointStateRejected: true,
    executionSignalLookingIntakeCheckpointStateRejected: true,
    preflightCheckpointStateIsApprovalGrant: false,
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
  assert.deepEqual(
    fixture.preflightCases.map((preflightCase) => preflightCase.caseId),
    expectedCaseIds
  );

  for (const preflightCase of fixture.preflightCases) {
    assert.equal(
      preflightCase.classification,
      expectedClassifications[preflightCase.caseId],
      preflightCase.caseId
    );
    assert.equal(preflightCase.reviewOnly, true, preflightCase.caseId);
    assert.equal(preflightCase.authoritative, false, preflightCase.caseId);
    assert.equal(preflightCase.preflightCheckpointStateIsApprovalGrant, false);
    assert.equal(preflightCase.approvalGrant.produced, false, preflightCase.caseId);
    assert.equal(preflightCase.approvalGrant.persisted, false, preflightCase.caseId);
    assert.equal(preflightCase.approvalGrant.grantId, null, preflightCase.caseId);
    assert.equal(preflightCase.runtimePermissionGranted, false);
    assert.equal(preflightCase.commandExposurePermissionGranted, false);
    assert.equal(preflightCase.runtimeCommandExposureEnabled, false);
    assert.equal(preflightCase.runtimeExecutionEnabled, false);
    assert.equal(preflightCase.evaluatorExecuted, false);
    assertAllFalse(preflightCase.runtimeEffect);
  }
  assert.equal(
    fixture.preflightCheckpointStateBoundary.stateCanGrantApproval,
    false
  );
  assert.equal(
    fixture.preflightCheckpointStateBoundary.stateCanPersistGrant,
    false
  );
  assert.equal(
    fixture.preflightCheckpointStateBoundary.stateCanGrantRuntimePermission,
    false
  );
  assert.equal(
    fixture.preflightCheckpointStateBoundary
      .stateCanGrantCommandExposurePermission,
    false
  );
  assert.equal(
    fixture.preflightCheckpointStateBoundary.stateCanExecuteEvaluator,
    false
  );
  assert.equal(
    fixture.preflightCheckpointStateBoundary.stateCanExecuteRuntime,
    false
  );
  assertAllFalse(fixture.blockedRuntimeEffect);
});

test("serve-runtime remains default-blocked and dry-run cannot bypass Phase 5.28 preflight", async () => {
  const fixture = await readJson(fixtureUrl);
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-28-preflight-"));

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

test("Phase 5.28 preflight command names remain rejected", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-28-preflight-probes-"));
  const serveRuntimeStderr =
    "Usage: ardyn serve-runtime [--dry-run]\n" +
    "Runtime unavailable: serve-runtime is recognized, but runtime is not enabled in Phase 5.5.\n";

  try {
    for (const commandName of preflightCommandProbes) {
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

test("Phase 5.28 does not change CLI runtime source or add evaluator runtime primitives", async () => {
  const [baselineSource, currentSource] = await Promise.all([
    execFileAsync("git", ["show", `${phase528BaselineCommit}:apps/cli/src/index.mjs`], {
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
    /createReviewOnlyEvaluatorPreflightCheckpointForReview/,
    /review-only-evaluator-preflight/,
    /evaluator-preflight-checkpoint/,
    /evaluator.*execut/i
  ]) {
    assert.doesNotMatch(currentSource, forbiddenPattern);
  }
});
