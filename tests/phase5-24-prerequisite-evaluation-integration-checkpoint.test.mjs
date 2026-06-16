import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readFile, readdir, rm, mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";
import {
  APPROVAL_PREREQUISITE_INTEGRATION_CHECKPOINT_SCHEMA,
  evaluatePrerequisiteIntegrationCheckpointForReview
} from "../packages/core/src/index.mjs";

const execFileAsync = promisify(execFile);
const phase524BaselineCommit = "c46e2d778210428e943d4aee4df5d6b7e951c388";
const reviewedAt = "2026-06-15T00:00:00.000Z";
const repoRootUrl = new URL("../", import.meta.url);
const repoRoot = fileURLToPath(repoRootUrl);
const cliSourceUrl = new URL("../apps/cli/src/index.mjs", import.meta.url);
const cliPath = fileURLToPath(cliSourceUrl);
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-24/prerequisite-evaluation-integration-checkpoint.json",
  import.meta.url
);

const expectedTopLevelKeys = Object.freeze([
  "schema",
  "schemaVersion",
  "phase",
  "artifactKind",
  "metadataGeneratedAt",
  "sourcePhase",
  "integrationSummary",
  "integrationInputShape",
  "integrationResultShape",
  "integrationCheckpointCases",
  "pipelineStageIntegration",
  "blockedRuntimeEffect",
  "serveRuntimeBlockedBehavior",
  "forbiddenBehavior",
  "filesAllowedToChange",
  "filesForbiddenToChange",
  "validationCommands"
]);

const expectedCaseIds = Object.freeze([
  "missing-prerequisite-input-rejected",
  "malformed-prerequisite-input-rejected",
  "empty-prerequisite-input-rejected",
  "conflicting-prerequisite-input-rejected",
  "stale-prerequisite-input-rejected",
  "revoked-prerequisite-input-rejected",
  "unknown-prerequisite-input-rejected",
  "duplicate-prerequisite-input-rejected",
  "valid-prerequisite-review-summary"
]);

const expectedClassifications = Object.freeze({
  "missing-prerequisite-input-rejected":
    "missing_prerequisite_integration_input_rejected",
  "malformed-prerequisite-input-rejected":
    "malformed_prerequisite_integration_input_rejected",
  "empty-prerequisite-input-rejected":
    "empty_prerequisite_integration_input_rejected",
  "conflicting-prerequisite-input-rejected":
    "conflicting_prerequisite_integration_input_rejected",
  "stale-prerequisite-input-rejected":
    "stale_prerequisite_integration_input_rejected",
  "revoked-prerequisite-input-rejected":
    "revoked_prerequisite_integration_input_rejected",
  "unknown-prerequisite-input-rejected":
    "unknown_prerequisite_integration_input_rejected",
  "duplicate-prerequisite-input-rejected":
    "duplicate_prerequisite_integration_input_rejected",
  "valid-prerequisite-review-summary":
    "valid_prerequisite_integration_review_summary_runtime_still_blocked"
});

const integrationCommandProbes = Object.freeze([
  "approval-prerequisite-integration-checkpoint",
  "evaluate-approval-prerequisite-integration",
  "runtime-prerequisite-integration-checkpoint",
  "phase-5-24-prerequisite-evaluation-integration-checkpoint",
  "approval-prerequisite-bundle-consumption",
  "consume-approval-prerequisite-bundle",
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

function integrationCases() {
  const equivalentRecords = validRecords();

  return [
    {
      caseId: "missing-prerequisite-input-rejected",
      input: { reviewedAt },
      expectedSummaryProduced: false
    },
    {
      caseId: "malformed-prerequisite-input-rejected",
      input: {
        reviewedAt,
        sourceInputs: [
          inlineSource("source-malformed", validRecords(), {
            sourceKind: "file-prerequisite-records",
            sourceMode: "filesystem"
          })
        ]
      },
      expectedSummaryProduced: false
    },
    {
      caseId: "empty-prerequisite-input-rejected",
      input: {
        reviewedAt,
        sourceInputs: [inlineSource("source-empty", [])]
      },
      expectedSummaryProduced: false
    },
    {
      caseId: "conflicting-prerequisite-input-rejected",
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
      expectedSummaryProduced: false
    },
    {
      caseId: "stale-prerequisite-input-rejected",
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
      expectedSummaryProduced: false
    },
    {
      caseId: "revoked-prerequisite-input-rejected",
      input: {
        reviewedAt,
        sourceInputs: [
          inlineSource("source-revoked", [
            runtimeApprovalRecord({
              revocation: {
                revoked: true,
                revokedAt: "2026-06-15T00:00:00.000Z",
                revocationReason: "operator-revoked"
              }
            }),
            commandExposureApprovalRecord()
          ])
        ]
      },
      expectedSummaryProduced: false
    },
    {
      caseId: "unknown-prerequisite-input-rejected",
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
      expectedSummaryProduced: false
    },
    {
      caseId: "duplicate-prerequisite-input-rejected",
      input: {
        reviewedAt,
        sourceInputs: [
          inlineSource("source-duplicate", validRecords()),
          inlineSource("source-duplicate", validRecords())
        ]
      },
      expectedSummaryProduced: false
    },
    {
      caseId: "valid-prerequisite-review-summary",
      input: {
        reviewedAt,
        sourceInputs: [
          inlineSource("source-valid-b", equivalentRecords),
          inlineSource("source-valid-a", equivalentRecords)
        ]
      },
      expectedSummaryProduced: true
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

test("Phase 5.24 integration checkpoint fixture is deterministic metadata", async () => {
  const raw = await readFile(fixtureUrl, "utf8");
  const fixture = JSON.parse(raw);

  assert.equal(raw.endsWith("\n"), true);
  assert.equal(raw.includes("\r"), false);
  assert.deepEqual(Object.keys(fixture), expectedTopLevelKeys);
  assert.equal(
    fixture.schema,
    "ardyn.phase-5.24.prerequisite-evaluation-integration-checkpoint"
  );
  assert.equal(fixture.schemaVersion, "0.1.0");
  assert.equal(
    fixture.phase,
    "phase-5.24-prerequisite-evaluation-integration-checkpoint"
  );
  assert.equal(
    fixture.artifactKind,
    "prerequisite-evaluation-integration-checkpoint"
  );
  assert.equal(fixture.metadataGeneratedAt, "1970-01-01T00:00:00.000Z");
  assert.equal(
    fixture.sourcePhase.phase,
    "phase-5.23-prerequisite-bundle-consumption-checkpoint"
  );
  assert.equal(fixture.sourcePhase.runtimeEnabled, false);
  assert.equal(fixture.sourcePhase.approvalGrantProduced, false);
});

test("Phase 5.24 integration checkpoint classifies the full prerequisite pipeline", () => {
  for (const integrationCase of integrationCases()) {
    const result = evaluatePrerequisiteIntegrationCheckpointForReview(
      integrationCase.input
    );

    assert.equal(result.schema, APPROVAL_PREREQUISITE_INTEGRATION_CHECKPOINT_SCHEMA);
    assert.equal(result.schemaVersion, "0.1.0");
    assert.equal(
      result.checkpointKind,
      "approval-prerequisite-evaluation-integration-checkpoint"
    );
    assert.equal(result.checkpointMode, "review-only");
    assert.equal(result.reviewedAt, reviewedAt);
    assert.equal(
      result.classification,
      expectedClassifications[integrationCase.caseId],
      integrationCase.caseId
    );
    assert.equal(
      result.reviewSummaryProduced,
      integrationCase.expectedSummaryProduced,
      integrationCase.caseId
    );
    assert.equal(result.reviewSummaryIsApprovalGrant, false, integrationCase.caseId);
    assert.equal(result.reviewOnly, true, integrationCase.caseId);
    assert.equal(result.authoritative, false, integrationCase.caseId);
    assert.equal(result.approvalGrant.produced, false, integrationCase.caseId);
    assert.equal(result.approvalGrant.persisted, false, integrationCase.caseId);
    assert.equal(result.approvalGrant.grantId, null, integrationCase.caseId);
    assertAllFalse(result.runtimeEffect);
  }
});

test("Phase 5.24 valid inputs produce only a non-authorizing review summary", () => {
  const validCase = integrationCases().find(
    (integrationCase) => integrationCase.caseId === "valid-prerequisite-review-summary"
  );
  const result = evaluatePrerequisiteIntegrationCheckpointForReview(
    validCase.input
  );

  assert.equal(result.reviewSummaryProduced, true);
  assert.equal(result.sourceIngestion.sourceCount, 2);
  assert.deepEqual(
    result.sourceIngestion.sourcePreflightResults.map((entry) => [
      entry.sourceId,
      entry.classification,
      entry.sourceInputsAccepted
    ]),
    [
      [
        "source-valid-b",
        "valid_prerequisite_source_input_review_only_runtime_still_blocked",
        true
      ],
      [
        "source-valid-a",
        "valid_prerequisite_source_input_review_only_runtime_still_blocked",
        true
      ]
    ]
  );
  assert.equal(result.sourceSelection.sourceSelectionAccepted, true);
  assert.equal(result.sourceSelection.selectedSourceId, "source-valid-a");
  assert.deepEqual(result.sourceSelection.equivalentSourceIds, [
    "source-valid-a",
    "source-valid-b"
  ]);
  assert.equal(result.sourceBundle.sourceBundleAccepted, true);
  assert.equal(
    result.sourceBundle.selectedBundlePartId,
    "phase-5.24-selected-prerequisite-sources"
  );
  assert.equal(result.bundleConsumption.bundleConsumedForReview, true);
  assert.equal(result.bundleConsumption.evaluatorInputForwarded, true);
  assert.equal(result.bundleConsumption.readerRecordCount, 2);
  assert.equal(
    result.bundleConsumption.evaluatorClassification,
    "valid_prerequisites_review_only_runtime_still_blocked"
  );
  assert.equal(
    result.reviewOnlyEvaluatorSummary.classification,
    "valid_prerequisites_review_only_runtime_still_blocked"
  );
  assert.equal(result.reviewOnlyEvaluatorSummary.reviewSummaryIsApprovalGrant, false);
  assert.equal(result.reviewOnlyEvaluatorSummary.approvalGrantProduced, false);
  assert.equal(result.reviewOnlyEvaluatorSummary.approvalGrantPersisted, false);
  assert.equal(result.reviewOnlyEvaluatorSummary.approvalGrantId, null);
  assert.equal(result.reviewOnlyEvaluatorSummary.runtimeEffectAllFalse, true);
});

test("Phase 5.24 rejected inputs fail closed before review summary production", () => {
  for (const integrationCase of integrationCases().filter(
    (entry) => !entry.expectedSummaryProduced
  )) {
    const result = evaluatePrerequisiteIntegrationCheckpointForReview(
      integrationCase.input
    );

    assert.equal(result.reviewSummaryProduced, false, integrationCase.caseId);
    assert.equal(result.reviewOnlyEvaluatorSummary, null, integrationCase.caseId);
    assert.equal(result.approvalGrant.produced, false, integrationCase.caseId);
    assert.ok(
      result.rejectionReasons.includes("approval_grant_not_implemented"),
      integrationCase.caseId
    );
    assert.ok(
      result.rejectionReasons.includes("runtime_enablement_still_blocked"),
      integrationCase.caseId
    );
    assertAllFalse(result.runtimeEffect);
  }
});

test("Phase 5.24 fixture mirrors integration cases and blocks grants", async () => {
  const fixture = await readJson(fixtureUrl);

  assert.deepEqual(fixture.integrationSummary, {
    integrationCheckpointRecorded: true,
    checkpointKind: "approval-prerequisite-evaluation-integration-checkpoint",
    checkpointReviewOnly: true,
    checkpointAuthoritative: false,
    sourceIngestionConnected: true,
    sourceSelectionConnected: true,
    sourceBundlingConnected: true,
    bundleConsumptionConnected: true,
    reviewOnlyEvaluatorSummaryConnected: true,
    missingPrerequisiteInputsRejected: true,
    malformedPrerequisiteInputsRejected: true,
    emptyPrerequisiteInputsRejected: true,
    conflictingPrerequisiteInputsRejected: true,
    stalePrerequisiteInputsRejected: true,
    revokedPrerequisiteInputsRejected: true,
    unknownPrerequisiteInputsRejected: true,
    duplicatePrerequisiteInputsRejected: true,
    validPrerequisiteInputsProduceReviewSummary: true,
    reviewSummaryIsApprovalGrant: false,
    approvalGrantProduced: false,
    approvalGrantPersisted: false,
    runtimeEnabled: false,
    runtimeCommandEnabled: false,
    runtimeCommandExposureEnabled: false,
    runtimeExecutionEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    canEnableRuntime: false
  });
  assert.deepEqual(
    fixture.integrationCheckpointCases.map((checkpointCase) => checkpointCase.caseId),
    expectedCaseIds
  );

  for (const checkpointCase of fixture.integrationCheckpointCases) {
    assert.equal(
      checkpointCase.classification,
      expectedClassifications[checkpointCase.caseId],
      checkpointCase.caseId
    );
    assert.equal(checkpointCase.reviewOnly, true, checkpointCase.caseId);
    assert.equal(checkpointCase.authoritative, false, checkpointCase.caseId);
    assert.equal(checkpointCase.reviewSummaryIsApprovalGrant, false);
    assert.equal(checkpointCase.approvalGrant.produced, false, checkpointCase.caseId);
    assert.equal(checkpointCase.approvalGrant.persisted, false, checkpointCase.caseId);
    assert.equal(checkpointCase.approvalGrant.grantId, null, checkpointCase.caseId);
    assertAllFalse(checkpointCase.runtimeEffect);
  }
  assert.equal(fixture.pipelineStageIntegration.sourceIngestionFeedsSelection, true);
  assert.equal(fixture.pipelineStageIntegration.sourceSelectionFeedsBundling, true);
  assert.equal(fixture.pipelineStageIntegration.sourceBundlingFeedsConsumption, true);
  assert.equal(
    fixture.pipelineStageIntegration.bundleConsumptionFeedsReviewOnlyEvaluatorSummary,
    true
  );
  assert.equal(fixture.pipelineStageIntegration.reviewSummaryCanProduceGrant, false);
  assert.equal(fixture.integrationResultShape.approvalGrantProduced, false);
  assert.equal(fixture.integrationResultShape.runtimeEffectAllFalse, true);
  assertAllFalse(fixture.blockedRuntimeEffect);
});

test("serve-runtime remains default-blocked and dry-run cannot bypass Phase 5.24 integration", async () => {
  const fixture = await readJson(fixtureUrl);
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-24-integration-"));

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

test("Phase 5.24 integration checkpoint command names remain rejected", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-24-integration-probes-"));
  const serveRuntimeStderr =
    "Usage: ardyn serve-runtime [--dry-run]\n" +
    "Runtime unavailable: serve-runtime is recognized, but runtime is not enabled in Phase 5.5.\n";

  try {
    for (const command of integrationCommandProbes) {
      for (const args of [[command], [command, "--dry-run"]]) {
        const failure = await runCliFailure(args, { cwd: scratch });
        const label = args.join(" ");

        assert.notEqual(failure.code, 0, label);
        assert.equal(failure.stdout, "", label);
        if (command === "serve-runtime") {
          assert.equal(failure.stderr, serveRuntimeStderr, label);
        } else {
          assert.match(failure.stderr, /^Usage: ardyn /, label);
        }
        assert.deepEqual(await readdir(scratch), [], `${label} should not write files`);
      }
    }
  } finally {
    await rm(scratch, { recursive: true, force: true });
  }
});

test("Phase 5.24 does not change CLI runtime source or add integration runtime primitives", async () => {
  const [{ stdout: baselineSource }, currentSource] = await Promise.all([
    execFileAsync("git", ["show", `${phase524BaselineCommit}:apps/cli/src/index.mjs`], {
      cwd: repoRoot,
      encoding: "utf8",
      maxBuffer: 1024 * 1024
    }),
    readFile(cliSourceUrl, "utf8")
  ]);

  assert.equal(currentSource, baselineSource);

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
    /process\.env/,
    /approval.*grant.*create/i,
    /approvalPrerequisiteIntegrationCheckpointCommand/i,
    /runtimePrerequisiteIntegrationCheckpointCommand/i,
    /evaluatePrerequisiteIntegrationCheckpointForReview/
  ]) {
    assert.doesNotMatch(currentSource, forbiddenPattern);
  }
});
