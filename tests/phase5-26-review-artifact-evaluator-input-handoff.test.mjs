import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readFile, readdir, rm, mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";
import {
  PREREQUISITE_REVIEW_ARTIFACT_EVALUATOR_INPUT_HANDOFF_SCHEMA,
  createPrerequisiteReviewArtifactBoundaryForReview,
  createReviewArtifactEvaluatorInputHandoffForReview
} from "../packages/core/src/index.mjs";

const execFileAsync = promisify(execFile);
const phase526BaselineCommit = "e6ecc24fdbcca24769f05bc0f844a622d71bf177";
const reviewedAt = "2026-06-16T00:00:00.000Z";
const repoRootUrl = new URL("../", import.meta.url);
const repoRoot = fileURLToPath(repoRootUrl);
const cliSourceUrl = new URL("../apps/cli/src/index.mjs", import.meta.url);
const cliPath = fileURLToPath(cliSourceUrl);
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-26/review-artifact-evaluator-input-handoff.json",
  import.meta.url
);

const expectedTopLevelKeys = Object.freeze([
  "schema",
  "schemaVersion",
  "phase",
  "artifactKind",
  "metadataGeneratedAt",
  "sourcePhase",
  "handoffSummary",
  "handoffInputShape",
  "handoffResultShape",
  "handoffCases",
  "evaluatorInputCandidateBoundary",
  "blockedRuntimeEffect",
  "serveRuntimeBlockedBehavior",
  "forbiddenBehavior",
  "filesAllowedToChange",
  "filesForbiddenToChange",
  "validationCommands"
]);

const expectedCaseIds = Object.freeze([
  "missing-review-artifact-handoff-input-rejected",
  "malformed-review-artifact-handoff-input-rejected",
  "malformed-review-artifact-invalid-reviewed-at-rejected",
  "empty-review-artifact-handoff-input-rejected",
  "conflicting-review-artifact-handoff-input-rejected",
  "stale-review-artifact-handoff-input-rejected",
  "revoked-review-artifact-handoff-input-rejected",
  "unknown-review-artifact-handoff-input-rejected",
  "duplicate-invalid-review-artifact-handoff-input-rejected",
  "authorizing-looking-review-artifact-handoff-input-rejected",
  "authorizing-looking-review-artifact-extra-runtime-effect-rejected",
  "authorizing-looking-review-artifact-extra-process-flag-rejected",
  "valid-review-artifact-evaluator-input-candidate"
]);

const expectedClassifications = Object.freeze({
  "missing-review-artifact-handoff-input-rejected":
    "missing_review_artifact_evaluator_input_handoff_rejected",
  "malformed-review-artifact-handoff-input-rejected":
    "malformed_review_artifact_evaluator_input_handoff_rejected",
  "malformed-review-artifact-invalid-reviewed-at-rejected":
    "malformed_review_artifact_evaluator_input_handoff_rejected",
  "empty-review-artifact-handoff-input-rejected":
    "empty_review_artifact_evaluator_input_handoff_rejected",
  "conflicting-review-artifact-handoff-input-rejected":
    "conflicting_review_artifact_evaluator_input_handoff_rejected",
  "stale-review-artifact-handoff-input-rejected":
    "stale_review_artifact_evaluator_input_handoff_rejected",
  "revoked-review-artifact-handoff-input-rejected":
    "revoked_review_artifact_evaluator_input_handoff_rejected",
  "unknown-review-artifact-handoff-input-rejected":
    "unknown_review_artifact_evaluator_input_handoff_rejected",
  "duplicate-invalid-review-artifact-handoff-input-rejected":
    "duplicate_invalid_review_artifact_evaluator_input_handoff_rejected",
  "authorizing-looking-review-artifact-handoff-input-rejected":
    "authorizing_review_artifact_evaluator_input_handoff_rejected",
  "authorizing-looking-review-artifact-extra-runtime-effect-rejected":
    "authorizing_review_artifact_evaluator_input_handoff_rejected",
  "authorizing-looking-review-artifact-extra-process-flag-rejected":
    "authorizing_review_artifact_evaluator_input_handoff_rejected",
  "valid-review-artifact-evaluator-input-candidate":
    "valid_review_artifact_evaluator_input_candidate_runtime_still_blocked"
});

const handoffCommandProbes = Object.freeze([
  "review-artifact-evaluator-input-handoff",
  "create-review-artifact-evaluator-input",
  "evaluator-input-candidate",
  "phase-5-26-review-artifact-evaluator-input-handoff",
  "approval-evaluator-input",
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

function handoffCases() {
  const duplicateArtifact = validReviewArtifact("source-duplicate");

  return [
    {
      caseId: "missing-review-artifact-handoff-input-rejected",
      input: { reviewedAt },
      expectedCandidateProduced: false
    },
    {
      caseId: "malformed-review-artifact-handoff-input-rejected",
      input: {
        reviewedAt,
        reviewArtifacts: [
          {
            ...validReviewArtifact("source-malformed"),
            artifactMode: "authorizing"
          }
        ]
      },
      expectedCandidateProduced: false
    },
    {
      caseId: "malformed-review-artifact-invalid-reviewed-at-rejected",
      input: {
        reviewedAt,
        reviewArtifacts: [
          {
            ...validReviewArtifact("source-invalid-reviewed-at"),
            reviewedAt: "not-a-date"
          }
        ]
      },
      expectedCandidateProduced: false
    },
    {
      caseId: "empty-review-artifact-handoff-input-rejected",
      input: {
        reviewedAt,
        reviewArtifacts: []
      },
      expectedCandidateProduced: false
    },
    {
      caseId: "conflicting-review-artifact-handoff-input-rejected",
      input: {
        reviewedAt,
        reviewArtifacts: [
          validReviewArtifact("source-conflict-a"),
          validReviewArtifact("source-conflict-b")
        ]
      },
      expectedCandidateProduced: false
    },
    {
      caseId: "stale-review-artifact-handoff-input-rejected",
      input: {
        reviewedAt,
        reviewArtifacts: [
          {
            ...validReviewArtifact("source-stale"),
            reviewedAt: "2026-06-14T00:00:00.000Z"
          }
        ]
      },
      expectedCandidateProduced: false
    },
    {
      caseId: "revoked-review-artifact-handoff-input-rejected",
      input: {
        reviewedAt,
        reviewArtifacts: [
          {
            ...validReviewArtifact("source-revoked"),
            revocation: {
              revoked: true,
              revokedAt: "2026-06-16T00:00:00.000Z",
              revocationReason: "operator-revoked"
            }
          }
        ]
      },
      expectedCandidateProduced: false
    },
    {
      caseId: "unknown-review-artifact-handoff-input-rejected",
      input: {
        reviewedAt,
        reviewArtifacts: [
          {
            ...validReviewArtifact("source-unknown"),
            schema: "ardyn.phase-5.25.unknown-review-artifact",
            artifactKind: "unknown-review-artifact"
          }
        ]
      },
      expectedCandidateProduced: false
    },
    {
      caseId: "duplicate-invalid-review-artifact-handoff-input-rejected",
      input: {
        reviewedAt,
        reviewArtifacts: [duplicateArtifact, clone(duplicateArtifact)]
      },
      expectedCandidateProduced: false
    },
    {
      caseId: "authorizing-looking-review-artifact-handoff-input-rejected",
      input: {
        reviewedAt,
        reviewArtifacts: [
          {
            ...validReviewArtifact("source-authorizing"),
            approvalGrantProduced: true
          }
        ]
      },
      expectedCandidateProduced: false
    },
    {
      caseId: "authorizing-looking-review-artifact-extra-runtime-effect-rejected",
      input: {
        reviewedAt,
        reviewArtifacts: [
          {
            ...validReviewArtifact("source-runtime-effect-claim"),
            runtimeEffect: {
              ...validReviewArtifact("source-runtime-effect-claim-copy")
                .runtimeEffect,
              processSpawnEnabled: true
            }
          }
        ]
      },
      expectedCandidateProduced: false
    },
    {
      caseId: "authorizing-looking-review-artifact-extra-process-flag-rejected",
      input: {
        reviewedAt,
        reviewArtifacts: [
          {
            ...validReviewArtifact("source-process-claim"),
            processSpawnEnabled: true
          }
        ]
      },
      expectedCandidateProduced: false
    },
    {
      caseId: "valid-review-artifact-evaluator-input-candidate",
      input: {
        reviewedAt,
        reviewArtifacts: [validReviewArtifact("source-valid")]
      },
      expectedCandidateProduced: true
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

test("Phase 5.26 evaluator-input handoff fixture is deterministic metadata", async () => {
  const raw = await readFile(fixtureUrl, "utf8");
  const fixture = JSON.parse(raw);

  assert.equal(raw.endsWith("\n"), true);
  assert.equal(raw.includes("\r"), false);
  assert.deepEqual(Object.keys(fixture), expectedTopLevelKeys);
  assert.equal(
    fixture.schema,
    "ardyn.phase-5.26.review-artifact-evaluator-input-handoff"
  );
  assert.equal(fixture.schemaVersion, "0.1.0");
  assert.equal(
    fixture.phase,
    "phase-5.26-review-artifact-evaluator-input-handoff"
  );
  assert.equal(fixture.artifactKind, "review-artifact-evaluator-input-handoff");
  assert.equal(fixture.metadataGeneratedAt, "1970-01-01T00:00:00.000Z");
  assert.equal(
    fixture.sourcePhase.phase,
    "phase-5.25-non-authorizing-review-artifact-boundary"
  );
  assert.equal(fixture.sourcePhase.runtimeEnabled, false);
  assert.equal(fixture.sourcePhase.approvalGrantProduced, false);
});

test("Phase 5.26 handoff classifies review artifact cases", () => {
  for (const handoffCase of handoffCases()) {
    const result = createReviewArtifactEvaluatorInputHandoffForReview(
      handoffCase.input
    );

    assert.equal(
      result.schema,
      PREREQUISITE_REVIEW_ARTIFACT_EVALUATOR_INPUT_HANDOFF_SCHEMA
    );
    assert.equal(result.schemaVersion, "0.1.0");
    assert.equal(
      result.handoffKind,
      "review-artifact-evaluator-input-handoff"
    );
    assert.equal(result.handoffMode, "review-only");
    assert.equal(result.reviewedAt, reviewedAt);
    assert.equal(
      result.classification,
      expectedClassifications[handoffCase.caseId],
      handoffCase.caseId
    );
    assert.equal(
      result.evaluatorInputCandidateProduced,
      handoffCase.expectedCandidateProduced,
      handoffCase.caseId
    );
    assert.equal(result.evaluatorInputCandidateIsApprovalGrant, false);
    assert.equal(result.reviewOnly, true, handoffCase.caseId);
    assert.equal(result.authoritative, false, handoffCase.caseId);
    assert.equal(result.approvalGrant.produced, false, handoffCase.caseId);
    assert.equal(result.approvalGrant.persisted, false, handoffCase.caseId);
    assert.equal(result.approvalGrant.grantId, null, handoffCase.caseId);
    assert.equal(result.runtimePermissionGranted, false, handoffCase.caseId);
    assert.equal(result.commandExposurePermissionGranted, false, handoffCase.caseId);
    assertAllFalse(result.runtimeEffect);
  }
});

test("Phase 5.26 valid review artifact produces only evaluator-input candidate", () => {
  const validCase = handoffCases().find(
    (handoffCase) =>
      handoffCase.caseId === "valid-review-artifact-evaluator-input-candidate"
  );
  const result = createReviewArtifactEvaluatorInputHandoffForReview(
    validCase.input
  );

  assert.equal(result.reviewArtifactAccepted, true);
  assert.equal(result.evaluatorInputCandidateProduced, true);
  assert.equal(result.evaluatorInputCandidateIsApprovalGrant, false);
  assert.equal(result.approvalGrant.produced, false);
  assert.equal(result.approvalGrant.persisted, false);
  assert.equal(result.approvalGrant.grantId, null);
  assert.match(result.reviewArtifactSummary.artifactDigest, /^sha256:[0-9a-f]{64}$/);

  const candidate = result.evaluatorInputCandidate;
  assert.equal(
    candidate.schema,
    "ardyn.phase-5.26.review-artifact-evaluator-input-candidate"
  );
  assert.equal(candidate.candidateMode, "review-only");
  assert.equal(candidate.evaluatorInputCandidateIsApprovalGrant, false);
  assert.equal(candidate.candidateIsApprovalGrant, false);
  assert.equal(candidate.approvalGrantProduced, false);
  assert.equal(candidate.approvalGrantPersisted, false);
  assert.equal(candidate.approvalGrantId, null);
  assert.equal(candidate.runtimePermissionGranted, false);
  assert.equal(candidate.commandExposurePermissionGranted, false);
  assertAllFalse(candidate.runtimeEffect);
  assert.equal(candidate.sourceReviewArtifact.reviewArtifactIsApprovalGrant, false);
  assert.equal(candidate.sourceReviewArtifact.approvalGrantProduced, false);
  assert.equal(candidate.sourceReviewArtifact.runtimeEffectAllFalse, true);
  assert.equal(candidate.integratedReviewSummary.reviewSummaryIsApprovalGrant, false);
  assert.equal(candidate.integratedReviewSummary.approvalGrantProduced, false);
  assert.equal(candidate.integratedReviewSummary.approvalGrantPersisted, false);
  assert.equal(candidate.integratedReviewSummary.approvalGrantId, null);
  assert.equal(candidate.integratedReviewSummary.runtimeEffectAllFalse, true);
  assert.deepEqual(candidate.pipelineSummary, {
    sourceCount: 1,
    selectedSourceId: "source-valid",
    selectedBundlePartId: "phase-5.24-selected-prerequisite-sources",
    readerRecordCount: 2,
    evaluatorClassification:
      "valid_prerequisites_review_only_runtime_still_blocked",
    prerequisiteSignalRecognized: true
  });
});

test("Phase 5.26 rejected review artifacts fail closed before candidate production", () => {
  for (const handoffCase of handoffCases().filter(
    (entry) => !entry.expectedCandidateProduced
  )) {
    const result = createReviewArtifactEvaluatorInputHandoffForReview(
      handoffCase.input
    );

    assert.equal(result.reviewArtifactAccepted, false, handoffCase.caseId);
    assert.equal(result.evaluatorInputCandidateProduced, false, handoffCase.caseId);
    assert.equal(result.evaluatorInputCandidate, null, handoffCase.caseId);
    assert.equal(result.reviewArtifactSummary, null, handoffCase.caseId);
    assert.equal(result.approvalGrant.produced, false, handoffCase.caseId);
    assert.ok(
      result.rejectionReasons.includes("evaluator_input_candidate_not_produced"),
      handoffCase.caseId
    );
    assert.ok(
      result.rejectionReasons.includes("approval_grant_not_implemented"),
      handoffCase.caseId
    );
    assert.ok(
      result.rejectionReasons.includes("runtime_enablement_still_blocked"),
      handoffCase.caseId
    );
    assertAllFalse(result.runtimeEffect);
  }
});

test("Phase 5.26 fixture mirrors handoff cases and blocks grants", async () => {
  const fixture = await readJson(fixtureUrl);

  assert.deepEqual(fixture.handoffSummary, {
    handoffRecorded: true,
    handoffKind: "review-artifact-evaluator-input-handoff",
    handoffReviewOnly: true,
    handoffAuthoritative: false,
    validReviewArtifactsProduceEvaluatorInputCandidate: true,
    missingReviewArtifactsRejected: true,
    malformedReviewArtifactsRejected: true,
    emptyReviewArtifactsRejected: true,
    conflictingReviewArtifactsRejected: true,
    staleReviewArtifactsRejected: true,
    revokedReviewArtifactsRejected: true,
    unknownReviewArtifactsRejected: true,
    duplicateInvalidReviewArtifactsRejected: true,
    authorizingLookingReviewArtifactsRejected: true,
    evaluatorInputCandidateIsApprovalGrant: false,
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
    fixture.handoffCases.map((handoffCase) => handoffCase.caseId),
    expectedCaseIds
  );

  for (const handoffCase of fixture.handoffCases) {
    assert.equal(
      handoffCase.classification,
      expectedClassifications[handoffCase.caseId],
      handoffCase.caseId
    );
    assert.equal(handoffCase.reviewOnly, true, handoffCase.caseId);
    assert.equal(handoffCase.authoritative, false, handoffCase.caseId);
    assert.equal(handoffCase.evaluatorInputCandidateIsApprovalGrant, false);
    assert.equal(handoffCase.approvalGrant.produced, false, handoffCase.caseId);
    assert.equal(handoffCase.approvalGrant.persisted, false, handoffCase.caseId);
    assert.equal(handoffCase.approvalGrant.grantId, null, handoffCase.caseId);
    assert.equal(handoffCase.runtimePermissionGranted, false);
    assert.equal(handoffCase.commandExposurePermissionGranted, false);
    assertAllFalse(handoffCase.runtimeEffect);
  }
  assert.equal(
    fixture.evaluatorInputCandidateBoundary.candidateCanGrantApproval,
    false
  );
  assert.equal(
    fixture.evaluatorInputCandidateBoundary.candidateCanPersistGrant,
    false
  );
  assert.equal(
    fixture.evaluatorInputCandidateBoundary.candidateCanGrantRuntimePermission,
    false
  );
  assert.equal(
    fixture.evaluatorInputCandidateBoundary
      .candidateCanGrantCommandExposurePermission,
    false
  );
  assert.equal(
    fixture.evaluatorInputCandidateBoundary.candidateCanExecuteRuntime,
    false
  );
  assertAllFalse(fixture.blockedRuntimeEffect);
});

test("serve-runtime remains default-blocked and dry-run cannot bypass Phase 5.26 handoff", async () => {
  const fixture = await readJson(fixtureUrl);
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-26-handoff-"));

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

test("Phase 5.26 evaluator-input handoff command names remain rejected", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-26-handoff-probes-"));
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

test("Phase 5.26 does not change CLI runtime source or add handoff runtime primitives", async () => {
  const [baselineSource, currentSource] = await Promise.all([
    execFileAsync("git", ["show", `${phase526BaselineCommit}:apps/cli/src/index.mjs`], {
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
    /createReviewArtifactEvaluatorInputHandoffForReview/,
    /review-artifact-evaluator-input-handoff/,
    /evaluator-input-candidate/
  ]) {
    assert.doesNotMatch(currentSource, forbiddenPattern);
  }
});
