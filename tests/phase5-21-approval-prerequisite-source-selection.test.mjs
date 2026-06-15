import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readFile, readdir, rm, mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";
import {
  APPROVAL_PREREQUISITE_SOURCE_SELECTION_SCHEMA,
  evaluateRuntimeApprovalPrerequisitesForReview,
  selectApprovalPrerequisiteSourcesForReview
} from "../packages/core/src/index.mjs";

const execFileAsync = promisify(execFile);
const phase521BaselineCommit = "5afbe38098132a6f3ac53b28e1af7fe88f4f6b73";
const reviewedAt = "2026-06-15T00:00:00.000Z";
const repoRootUrl = new URL("../", import.meta.url);
const repoRoot = fileURLToPath(repoRootUrl);
const cliSourceUrl = new URL("../apps/cli/src/index.mjs", import.meta.url);
const cliPath = fileURLToPath(cliSourceUrl);
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-21/approval-prerequisite-source-selection-contract.json",
  import.meta.url
);

const expectedTopLevelKeys = Object.freeze([
  "schema",
  "schemaVersion",
  "phase",
  "artifactKind",
  "metadataGeneratedAt",
  "sourcePhase",
  "selectionSummary",
  "sourceSelectionShape",
  "selectionResultShape",
  "sourceSelectionCases",
  "readerIntegration",
  "blockedRuntimeEffect",
  "serveRuntimeBlockedBehavior",
  "forbiddenBehavior",
  "filesAllowedToChange",
  "filesForbiddenToChange",
  "validationCommands"
]);

const expectedCaseIds = Object.freeze([
  "missing-sources",
  "single-valid-source-selected",
  "multiple-equivalent-valid-sources-selected",
  "duplicate-equivalent-valid-sources-selected",
  "conflicting-valid-sources-rejected",
  "duplicate-source-id-rejected",
  "stale-source-rejected",
  "revoked-source-rejected",
  "unknown-source-rejected",
  "malformed-source-rejected",
  "empty-source-rejected"
]);

const expectedClassifications = Object.freeze({
  "missing-sources": "missing_prerequisite_source_selection_rejected",
  "single-valid-source-selected":
    "valid_prerequisite_source_selected_review_only_runtime_still_blocked",
  "multiple-equivalent-valid-sources-selected":
    "equivalent_prerequisite_sources_selected_review_only_runtime_still_blocked",
  "duplicate-equivalent-valid-sources-selected":
    "equivalent_prerequisite_sources_selected_review_only_runtime_still_blocked",
  "conflicting-valid-sources-rejected": "conflicting_valid_prerequisite_sources_rejected",
  "duplicate-source-id-rejected": "duplicate_prerequisite_source_selection_rejected",
  "stale-source-rejected": "stale_prerequisite_source_selection_rejected",
  "revoked-source-rejected": "revoked_prerequisite_source_selection_rejected",
  "unknown-source-rejected": "unknown_prerequisite_source_selection_rejected",
  "malformed-source-rejected": "malformed_prerequisite_source_selection_rejected",
  "empty-source-rejected": "empty_prerequisite_source_selection_rejected"
});

const sourceSelectionCommandProbes = Object.freeze([
  "approval-prerequisite-source-selection",
  "select-approval-prerequisite-sources",
  "runtime-prerequisite-source-selection",
  "phase-5-21-approval-prerequisite-source-selection",
  "approval-prerequisite-source-preflight",
  "preflight-approval-prerequisite-sources",
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

function sourceSelectionCases() {
  const equivalentRecords = validRecords();

  return [
    {
      caseId: "missing-sources",
      input: { reviewedAt },
      expectedAccepted: false,
      expectedForwarded: false,
      expectedSelectedSourceId: null
    },
    {
      caseId: "single-valid-source-selected",
      input: {
        reviewedAt,
        sourceInputs: [inlineSource("source-valid-a", validRecords())]
      },
      expectedAccepted: true,
      expectedForwarded: true,
      expectedSelectedSourceId: "source-valid-a"
    },
    {
      caseId: "multiple-equivalent-valid-sources-selected",
      input: {
        reviewedAt,
        sourceInputs: [
          inlineSource("source-valid-b", equivalentRecords),
          inlineSource("source-valid-a", equivalentRecords)
        ]
      },
      expectedAccepted: true,
      expectedForwarded: true,
      expectedSelectedSourceId: "source-valid-a"
    },
    {
      caseId: "duplicate-equivalent-valid-sources-selected",
      input: {
        reviewedAt,
        sourceInputs: [
          inlineSource("source-duplicate-b", validRecords()),
          inlineSource("source-duplicate-a", validRecords())
        ]
      },
      expectedAccepted: true,
      expectedForwarded: true,
      expectedSelectedSourceId: "source-duplicate-a"
    },
    {
      caseId: "conflicting-valid-sources-rejected",
      input: {
        reviewedAt,
        sourceInputs: [
          inlineSource("source-conflict-a", validRecords()),
          inlineSource("source-conflict-b", validRecords({
            runtimeApprovalRecord: {
              recordId: "runtime-approval-record-conflicting"
            }
          }))
        ]
      },
      expectedAccepted: false,
      expectedForwarded: false,
      expectedSelectedSourceId: null
    },
    {
      caseId: "duplicate-source-id-rejected",
      input: {
        reviewedAt,
        sourceInputs: [
          inlineSource("source-duplicate-id", validRecords()),
          inlineSource("source-duplicate-id", validRecords())
        ]
      },
      expectedAccepted: false,
      expectedForwarded: false,
      expectedSelectedSourceId: null
    },
    {
      caseId: "stale-source-rejected",
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
      expectedAccepted: false,
      expectedForwarded: false,
      expectedSelectedSourceId: null
    },
    {
      caseId: "revoked-source-rejected",
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
      expectedAccepted: false,
      expectedForwarded: false,
      expectedSelectedSourceId: null
    },
    {
      caseId: "unknown-source-rejected",
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
      expectedAccepted: false,
      expectedForwarded: false,
      expectedSelectedSourceId: null
    },
    {
      caseId: "malformed-source-rejected",
      input: {
        reviewedAt,
        sourceInputs: [
          inlineSource("source-malformed", validRecords(), {
            sourceKind: "file-prerequisite-records",
            sourceMode: "filesystem"
          })
        ]
      },
      expectedAccepted: false,
      expectedForwarded: false,
      expectedSelectedSourceId: null
    },
    {
      caseId: "empty-source-rejected",
      input: {
        reviewedAt,
        sourceInputs: [inlineSource("source-empty", [])]
      },
      expectedAccepted: false,
      expectedForwarded: false,
      expectedSelectedSourceId: null
    }
  ];
}

async function readJson(url) {
  return JSON.parse(await readFile(url, "utf8"));
}

function assertAllFalse(record) {
  for (const [key, value] of Object.entries(record)) {
    assert.equal(value, false, key);
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

test("Phase 5.21 source selection fixture is deterministic metadata", async () => {
  const raw = await readFile(fixtureUrl, "utf8");
  const fixture = JSON.parse(raw);

  assert.equal(raw.endsWith("\n"), true);
  assert.equal(raw.includes("\r"), false);
  assert.deepEqual(Object.keys(fixture), expectedTopLevelKeys);
  assert.equal(
    fixture.schema,
    "ardyn.phase-5.21.approval-prerequisite-source-selection-contract"
  );
  assert.equal(fixture.schemaVersion, "0.1.0");
  assert.equal(fixture.phase, "phase-5.21-approval-prerequisite-source-selection");
  assert.equal(fixture.artifactKind, "approval-prerequisite-source-selection-contract");
  assert.equal(fixture.metadataGeneratedAt, "1970-01-01T00:00:00.000Z");
  assert.equal(
    fixture.sourcePhase.phase,
    "phase-5.20-approval-prerequisite-source-ingestion-preflight"
  );
  assert.equal(fixture.sourcePhase.runtimeEnabled, false);
  assert.equal(fixture.sourcePhase.approvalGrantProduced, false);
});

test("Phase 5.21 source selection classifies source sets deterministically", () => {
  for (const sourceCase of sourceSelectionCases()) {
    const result = selectApprovalPrerequisiteSourcesForReview(sourceCase.input);

    assert.equal(result.schema, APPROVAL_PREREQUISITE_SOURCE_SELECTION_SCHEMA);
    assert.equal(result.schemaVersion, "0.1.0");
    assert.equal(result.selectionKind, "approval-prerequisite-source-selection");
    assert.equal(result.selectionMode, "review-only");
    assert.equal(result.reviewedAt, reviewedAt);
    assert.equal(result.reviewOnly, true);
    assert.equal(result.authoritative, false);
    assert.equal(result.classification, expectedClassifications[sourceCase.caseId]);
    assert.equal(result.sourceSelectionAccepted, sourceCase.expectedAccepted, sourceCase.caseId);
    assert.equal(result.readerInputForwarded, sourceCase.expectedForwarded, sourceCase.caseId);
    assert.equal(result.selectedSourceId, sourceCase.expectedSelectedSourceId, sourceCase.caseId);
    assert.equal(result.approvalGrant.produced, false, sourceCase.caseId);
    assert.equal(result.approvalGrant.persisted, false, sourceCase.caseId);
    assert.equal(result.approvalGrant.grantId, null, sourceCase.caseId);
    assertAllFalse(result.runtimeEffect);
  }
});

test("Phase 5.21 equivalent valid sources select the lowest source id and remain review-only", () => {
  const equivalentCase = sourceSelectionCases().find(
    (sourceCase) => sourceCase.caseId === "multiple-equivalent-valid-sources-selected"
  );
  const result = selectApprovalPrerequisiteSourcesForReview(equivalentCase.input);
  const evaluation = evaluateRuntimeApprovalPrerequisitesForReview(result.selectedReaderInput);

  assert.equal(result.sourceSelectionAccepted, true);
  assert.equal(result.readerInputForwarded, true);
  assert.equal(result.selectedSourceId, "source-valid-a");
  assert.deepEqual(result.equivalentSourceIds, ["source-valid-a", "source-valid-b"]);
  assert.equal(result.selectedReaderInput.reviewedAt, reviewedAt);
  assert.equal(result.selectedReaderInput.prerequisiteRecords.length, 2);
  assert.equal(
    result.approvalPrerequisiteReader.classification,
    "valid_prerequisite_records_review_only_runtime_still_blocked"
  );
  assert.equal(result.approvalPrerequisiteReader.prerequisiteSignalRecognized, true);
  assert.equal(evaluation.prerequisiteSignalRecognized, true);
  assert.equal(evaluation.approvalGrant.produced, false);
  assert.equal(evaluation.approvalGrant.persisted, false);
  assertAllFalse(evaluation.runtimeEffect);
});

test("Phase 5.21 conflicting valid sources fail closed before reader forwarding", () => {
  const conflictCase = sourceSelectionCases().find(
    (sourceCase) => sourceCase.caseId === "conflicting-valid-sources-rejected"
  );
  const result = selectApprovalPrerequisiteSourcesForReview(conflictCase.input);

  assert.equal(result.sourceSelectionAccepted, false);
  assert.equal(result.readerInputForwarded, false);
  assert.equal(result.selectedSourceId, null);
  assert.equal(result.selectedReaderInput, null);
  assert.equal(result.approvalPrerequisiteReader, null);
  assert.deepEqual(result.conflictingSourceIds, ["source-conflict-a", "source-conflict-b"]);
  assert.ok(result.rejectionReasons.includes("conflicting_valid_prerequisite_sources"));
  assert.ok(result.rejectionReasons.includes("approval_grant_not_implemented"));
  assert.ok(result.rejectionReasons.includes("runtime_enablement_still_blocked"));
  assertAllFalse(result.runtimeEffect);
});

test("Phase 5.21 fixture mirrors source selection cases and blocks grants", async () => {
  const fixture = await readJson(fixtureUrl);

  assert.deepEqual(fixture.selectionSummary, {
    approvalPrerequisiteSourceSelectionRecorded: true,
    selectionKind: "approval-prerequisite-source-selection",
    selectionReviewOnly: true,
    selectionAuthoritative: false,
    missingSourcesRejected: true,
    multipleValidSourcesHandledDeterministically: true,
    conflictingValidSourcesRejected: true,
    duplicateEquivalentSourcesHandledDeterministically: true,
    staleSourcesRejected: true,
    revokedSourcesRejected: true,
    unknownSourcesRejected: true,
    malformedSourcesRejected: true,
    emptySourcesRejected: true,
    selectedSourceFeedsReviewReaderOnly: true,
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
    fixture.sourceSelectionCases.map((sourceCase) => sourceCase.caseId),
    expectedCaseIds
  );

  for (const sourceCase of fixture.sourceSelectionCases) {
    assert.equal(sourceCase.classification, expectedClassifications[sourceCase.caseId]);
    assert.equal(sourceCase.reviewOnly, true, sourceCase.caseId);
    assert.equal(sourceCase.authoritative, false, sourceCase.caseId);
    assert.equal(sourceCase.approvalGrant.produced, false, sourceCase.caseId);
    assert.equal(sourceCase.approvalGrant.persisted, false, sourceCase.caseId);
    assert.equal(sourceCase.approvalGrant.grantId, null, sourceCase.caseId);
    assertAllFalse(sourceCase.runtimeEffect);
  }
  assert.equal(fixture.readerIntegration.selectedSourceMayFeedReviewReader, true);
  assert.equal(fixture.readerIntegration.rejectedSelectionDoesNotFeedReader, true);
  assert.equal(fixture.readerIntegration.readerStillReviewOnly, true);
  assert.equal(fixture.readerIntegration.evaluatorStillReviewOnly, true);
  assert.equal(fixture.readerIntegration.readerCanProduceGrant, false);
  assert.equal(fixture.readerIntegration.evaluatorCanProduceGrant, false);
  assertAllFalse(fixture.blockedRuntimeEffect);
});

test("serve-runtime remains default-blocked and dry-run cannot bypass Phase 5.21 source selection", async () => {
  const fixture = await readJson(fixtureUrl);
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-21-source-selection-"));

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

test("Phase 5.21 source selection command names remain rejected", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-21-source-selection-probes-"));
  const serveRuntimeStderr =
    "Usage: ardyn serve-runtime [--dry-run]\n" +
    "Runtime unavailable: serve-runtime is recognized, but runtime is not enabled in Phase 5.5.\n";

  try {
    for (const command of sourceSelectionCommandProbes) {
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

test("Phase 5.21 does not change CLI runtime source or add source-selection runtime primitives", async () => {
  const [{ stdout: baselineSource }, currentSource] = await Promise.all([
    execFileAsync("git", ["show", `${phase521BaselineCommit}:apps/cli/src/index.mjs`], {
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
    /approvalPrerequisiteSourceSelectionCommand/i,
    /runtimePrerequisiteSourceSelectionCommand/i
  ]) {
    assert.doesNotMatch(currentSource, forbiddenPattern);
  }
});
