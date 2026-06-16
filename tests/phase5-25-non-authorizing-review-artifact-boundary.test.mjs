import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readFile, readdir, rm, mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";
import {
  PREREQUISITE_REVIEW_ARTIFACT_BOUNDARY_SCHEMA,
  createPrerequisiteReviewArtifactBoundaryForReview
} from "../packages/core/src/index.mjs";

const execFileAsync = promisify(execFile);
const phase525BaselineCommit = "cb85ac469c5eb0784b0ece50afb68b19d10bb683";
const reviewedAt = "2026-06-16T00:00:00.000Z";
const repoRootUrl = new URL("../", import.meta.url);
const repoRoot = fileURLToPath(repoRootUrl);
const cliSourceUrl = new URL("../apps/cli/src/index.mjs", import.meta.url);
const cliPath = fileURLToPath(cliSourceUrl);
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-25/non-authorizing-review-artifact-boundary.json",
  import.meta.url
);

const expectedTopLevelKeys = Object.freeze([
  "schema",
  "schemaVersion",
  "phase",
  "artifactKind",
  "metadataGeneratedAt",
  "sourcePhase",
  "artifactBoundarySummary",
  "artifactInputShape",
  "artifactResultShape",
  "artifactBoundaryCases",
  "reviewArtifactBoundary",
  "blockedRuntimeEffect",
  "serveRuntimeBlockedBehavior",
  "forbiddenBehavior",
  "filesAllowedToChange",
  "filesForbiddenToChange",
  "validationCommands"
]);

const expectedCaseIds = Object.freeze([
  "missing-prerequisite-artifact-input-rejected",
  "malformed-prerequisite-artifact-input-rejected",
  "empty-prerequisite-artifact-input-rejected",
  "conflicting-prerequisite-artifact-input-rejected",
  "stale-prerequisite-artifact-input-rejected",
  "revoked-prerequisite-artifact-input-rejected",
  "unknown-prerequisite-artifact-input-rejected",
  "duplicate-invalid-prerequisite-artifact-input-rejected",
  "valid-prerequisite-non-authorizing-review-artifact"
]);

const expectedClassifications = Object.freeze({
  "missing-prerequisite-artifact-input-rejected":
    "missing_prerequisite_review_artifact_input_rejected",
  "malformed-prerequisite-artifact-input-rejected":
    "malformed_prerequisite_review_artifact_input_rejected",
  "empty-prerequisite-artifact-input-rejected":
    "empty_prerequisite_review_artifact_input_rejected",
  "conflicting-prerequisite-artifact-input-rejected":
    "conflicting_prerequisite_review_artifact_input_rejected",
  "stale-prerequisite-artifact-input-rejected":
    "stale_prerequisite_review_artifact_input_rejected",
  "revoked-prerequisite-artifact-input-rejected":
    "revoked_prerequisite_review_artifact_input_rejected",
  "unknown-prerequisite-artifact-input-rejected":
    "unknown_prerequisite_review_artifact_input_rejected",
  "duplicate-invalid-prerequisite-artifact-input-rejected":
    "duplicate_invalid_prerequisite_review_artifact_input_rejected",
  "valid-prerequisite-non-authorizing-review-artifact":
    "valid_prerequisite_review_artifact_non_authorizing_runtime_still_blocked"
});

const artifactCommandProbes = Object.freeze([
  "prerequisite-review-artifact-boundary",
  "create-prerequisite-review-artifact",
  "non-authorizing-review-artifact",
  "phase-5-25-non-authorizing-review-artifact-boundary",
  "approval-prerequisite-review-artifact",
  "serve-runtime"
]);

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

function artifactBoundaryCases() {
  const equivalentRecords = validRecords();

  return [
    {
      caseId: "missing-prerequisite-artifact-input-rejected",
      input: { reviewedAt },
      expectedArtifactProduced: false
    },
    {
      caseId: "malformed-prerequisite-artifact-input-rejected",
      input: {
        reviewedAt,
        sourceInputs: [
          inlineSource("source-malformed", validRecords(), {
            sourceKind: "file-prerequisite-records",
            sourceMode: "filesystem"
          })
        ]
      },
      expectedArtifactProduced: false
    },
    {
      caseId: "empty-prerequisite-artifact-input-rejected",
      input: {
        reviewedAt,
        sourceInputs: [inlineSource("source-empty", [])]
      },
      expectedArtifactProduced: false
    },
    {
      caseId: "conflicting-prerequisite-artifact-input-rejected",
      input: {
        reviewedAt,
        sourceInputs: [
          inlineSource("source-conflict-a", validRecords()),
          inlineSource(
            "source-conflict-b",
            validRecords({
              runtimeApprovalRecord: {
                recordId: "runtime-approval-record-conflicting"
              }
            })
          )
        ]
      },
      expectedArtifactProduced: false
    },
    {
      caseId: "stale-prerequisite-artifact-input-rejected",
      input: {
        reviewedAt,
        sourceInputs: [
          inlineSource("source-stale", [
            runtimeApprovalRecord({
              validity: validity({
                expiresAt: "2026-06-14T00:00:00.000Z",
                validAtEvaluation: false
              })
            }),
            commandExposureApprovalRecord()
          ])
        ]
      },
      expectedArtifactProduced: false
    },
    {
      caseId: "revoked-prerequisite-artifact-input-rejected",
      input: {
        reviewedAt,
        sourceInputs: [
          inlineSource("source-revoked", [
            runtimeApprovalRecord({
              revocation: {
                revoked: true,
                revokedAt: "2026-06-16T00:00:00.000Z",
                revocationReason: "operator-revoked"
              }
            }),
            commandExposureApprovalRecord()
          ])
        ]
      },
      expectedArtifactProduced: false
    },
    {
      caseId: "unknown-prerequisite-artifact-input-rejected",
      input: {
        reviewedAt,
        sourceInputs: [
          inlineSource("source-unknown", [
            ...validRecords(),
            {
              schema: "ardyn.unreviewed-runtime-prerequisite-record",
              schemaVersion: "0.1.0",
              recordKind: "unreviewed-runtime-prerequisite-record",
              recordId: "unknown-record-001"
            }
          ])
        ]
      },
      expectedArtifactProduced: false
    },
    {
      caseId: "duplicate-invalid-prerequisite-artifact-input-rejected",
      input: {
        reviewedAt,
        sourceInputs: [
          inlineSource("source-duplicate", validRecords()),
          inlineSource("source-duplicate", validRecords())
        ]
      },
      expectedArtifactProduced: false
    },
    {
      caseId: "valid-prerequisite-non-authorizing-review-artifact",
      input: {
        reviewedAt,
        sourceInputs: [
          inlineSource("source-valid-b", equivalentRecords),
          inlineSource("source-valid-a", equivalentRecords)
        ]
      },
      expectedArtifactProduced: true
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

test("Phase 5.25 review artifact boundary fixture is deterministic metadata", async () => {
  const raw = await readFile(fixtureUrl, "utf8");
  const fixture = JSON.parse(raw);

  assert.equal(raw.endsWith("\n"), true);
  assert.equal(raw.includes("\r"), false);
  assert.deepEqual(Object.keys(fixture), expectedTopLevelKeys);
  assert.equal(
    fixture.schema,
    "ardyn.phase-5.25.non-authorizing-review-artifact-boundary"
  );
  assert.equal(fixture.schemaVersion, "0.1.0");
  assert.equal(
    fixture.phase,
    "phase-5.25-non-authorizing-review-artifact-boundary"
  );
  assert.equal(fixture.artifactKind, "non-authorizing-review-artifact-boundary");
  assert.equal(fixture.metadataGeneratedAt, "1970-01-01T00:00:00.000Z");
  assert.equal(
    fixture.sourcePhase.phase,
    "phase-5.24-prerequisite-evaluation-integration-checkpoint"
  );
  assert.equal(fixture.sourcePhase.runtimeEnabled, false);
  assert.equal(fixture.sourcePhase.approvalGrantProduced, false);
});

test("Phase 5.25 boundary classifies review artifact cases", () => {
  for (const artifactCase of artifactBoundaryCases()) {
    const result = createPrerequisiteReviewArtifactBoundaryForReview(
      artifactCase.input
    );

    assert.equal(result.schema, PREREQUISITE_REVIEW_ARTIFACT_BOUNDARY_SCHEMA);
    assert.equal(result.schemaVersion, "0.1.0");
    assert.equal(
      result.boundaryKind,
      "non-authorizing-prerequisite-review-artifact-boundary"
    );
    assert.equal(result.boundaryMode, "review-only");
    assert.equal(result.reviewedAt, reviewedAt);
    assert.equal(
      result.classification,
      expectedClassifications[artifactCase.caseId],
      artifactCase.caseId
    );
    assert.equal(
      result.reviewArtifactProduced,
      artifactCase.expectedArtifactProduced,
      artifactCase.caseId
    );
    assert.equal(result.reviewArtifactIsApprovalGrant, false, artifactCase.caseId);
    assert.equal(result.reviewOnly, true, artifactCase.caseId);
    assert.equal(result.authoritative, false, artifactCase.caseId);
    assert.equal(result.approvalGrant.produced, false, artifactCase.caseId);
    assert.equal(result.approvalGrant.persisted, false, artifactCase.caseId);
    assert.equal(result.approvalGrant.grantId, null, artifactCase.caseId);
    assert.equal(result.runtimePermissionGranted, false, artifactCase.caseId);
    assert.equal(result.commandExposurePermissionGranted, false, artifactCase.caseId);
    assertAllFalse(result.runtimeEffect);
  }
});

test("Phase 5.25 valid inputs produce only a non-authorizing review artifact", () => {
  const validCase = artifactBoundaryCases().find(
    (artifactCase) =>
      artifactCase.caseId === "valid-prerequisite-non-authorizing-review-artifact"
  );
  const result = createPrerequisiteReviewArtifactBoundaryForReview(
    validCase.input
  );

  assert.equal(result.reviewArtifactProduced, true);
  assert.equal(result.integratedReviewSummary.reviewSummaryProduced, true);
  assert.equal(result.integratedReviewSummary.reviewSummaryIsApprovalGrant, false);
  assert.equal(result.integratedReviewSummary.approvalGrantProduced, false);
  assert.equal(result.integratedReviewSummary.runtimeEffectAllFalse, true);

  assert.equal(
    result.reviewArtifact.schema,
    "ardyn.phase-5.25.non-authorizing-prerequisite-review-artifact"
  );
  assert.equal(result.reviewArtifact.artifactMode, "review-only");
  assert.equal(result.reviewArtifact.reviewArtifactIsApprovalGrant, false);
  assert.equal(result.reviewArtifact.approvalGrantProduced, false);
  assert.equal(result.reviewArtifact.approvalGrantPersisted, false);
  assert.equal(result.reviewArtifact.approvalGrantId, null);
  assert.equal(result.reviewArtifact.runtimePermissionGranted, false);
  assert.equal(result.reviewArtifact.commandExposurePermissionGranted, false);
  assertAllFalse(result.reviewArtifact.runtimeEffect);
  assert.deepEqual(result.reviewArtifact.pipelineSummary, {
    sourceCount: 2,
    selectedSourceId: "source-valid-a",
    selectedBundlePartId: "phase-5.24-selected-prerequisite-sources",
    readerRecordCount: 2,
    evaluatorClassification:
      "valid_prerequisites_review_only_runtime_still_blocked",
    prerequisiteSignalRecognized: true
  });
});

test("Phase 5.25 rejected inputs fail closed before artifact production", () => {
  for (const artifactCase of artifactBoundaryCases().filter(
    (entry) => !entry.expectedArtifactProduced
  )) {
    const result = createPrerequisiteReviewArtifactBoundaryForReview(
      artifactCase.input
    );

    assert.equal(result.reviewArtifactProduced, false, artifactCase.caseId);
    assert.equal(result.reviewArtifact, null, artifactCase.caseId);
    assert.equal(result.approvalGrant.produced, false, artifactCase.caseId);
    assert.ok(
      result.rejectionReasons.includes("review_artifact_not_produced"),
      artifactCase.caseId
    );
    assert.ok(
      result.rejectionReasons.includes("approval_grant_not_implemented"),
      artifactCase.caseId
    );
    assert.ok(
      result.rejectionReasons.includes("runtime_enablement_still_blocked"),
      artifactCase.caseId
    );
    assertAllFalse(result.runtimeEffect);
  }
});

test("Phase 5.25 fixture mirrors boundary cases and blocks grants", async () => {
  const fixture = await readJson(fixtureUrl);

  assert.deepEqual(fixture.artifactBoundarySummary, {
    artifactBoundaryRecorded: true,
    boundaryKind: "non-authorizing-prerequisite-review-artifact-boundary",
    boundaryReviewOnly: true,
    boundaryAuthoritative: false,
    integratedReviewSummaryAccepted: true,
    missingPrerequisiteInputsRejected: true,
    malformedPrerequisiteInputsRejected: true,
    emptyPrerequisiteInputsRejected: true,
    conflictingPrerequisiteInputsRejected: true,
    stalePrerequisiteInputsRejected: true,
    revokedPrerequisiteInputsRejected: true,
    unknownPrerequisiteInputsRejected: true,
    duplicateInvalidPrerequisiteInputsRejected: true,
    validIntegratedSummariesProduceReviewArtifact: true,
    reviewArtifactIsApprovalGrant: false,
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
    fixture.artifactBoundaryCases.map((artifactCase) => artifactCase.caseId),
    expectedCaseIds
  );

  for (const artifactCase of fixture.artifactBoundaryCases) {
    assert.equal(
      artifactCase.classification,
      expectedClassifications[artifactCase.caseId],
      artifactCase.caseId
    );
    assert.equal(artifactCase.reviewOnly, true, artifactCase.caseId);
    assert.equal(artifactCase.authoritative, false, artifactCase.caseId);
    assert.equal(artifactCase.reviewArtifactIsApprovalGrant, false);
    assert.equal(artifactCase.approvalGrant.produced, false, artifactCase.caseId);
    assert.equal(artifactCase.approvalGrant.persisted, false, artifactCase.caseId);
    assert.equal(artifactCase.approvalGrant.grantId, null, artifactCase.caseId);
    assert.equal(artifactCase.runtimePermissionGranted, false);
    assert.equal(artifactCase.commandExposurePermissionGranted, false);
    assertAllFalse(artifactCase.runtimeEffect);
  }
  assert.equal(fixture.reviewArtifactBoundary.reviewArtifactCanGrantApproval, false);
  assert.equal(fixture.reviewArtifactBoundary.reviewArtifactCanPersistGrant, false);
  assert.equal(fixture.reviewArtifactBoundary.reviewArtifactCanEnableRuntime, false);
  assert.equal(
    fixture.reviewArtifactBoundary.reviewArtifactCanExposeRuntimeCommand,
    false
  );
  assert.equal(fixture.reviewArtifactBoundary.reviewArtifactCanExecuteRuntime, false);
  assertAllFalse(fixture.blockedRuntimeEffect);
});

test("serve-runtime remains default-blocked and dry-run cannot bypass Phase 5.25 boundary", async () => {
  const fixture = await readJson(fixtureUrl);
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-25-artifact-"));

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

test("Phase 5.25 review artifact boundary command names remain rejected", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-25-artifact-probes-"));
  const serveRuntimeStderr =
    "Usage: ardyn serve-runtime [--dry-run]\n" +
    "Runtime unavailable: serve-runtime is recognized, but runtime is not enabled in Phase 5.5.\n";

  try {
    for (const commandName of artifactCommandProbes) {
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

test("Phase 5.25 does not change CLI runtime source or add artifact runtime primitives", async () => {
  const [baselineSource, currentSource] = await Promise.all([
    execFileAsync("git", ["show", `${phase525BaselineCommit}:apps/cli/src/index.mjs`], {
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
    /createPrerequisiteReviewArtifactBoundaryForReview/,
    /non-authorizing-review-artifact-boundary/
  ]) {
    assert.doesNotMatch(currentSource, forbiddenPattern);
  }
});
