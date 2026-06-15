import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readFile, readdir, rm, mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";
import {
  APPROVAL_PREREQUISITE_SOURCE_PREFLIGHT_SCHEMA,
  evaluateRuntimeApprovalPrerequisitesForReview,
  preflightApprovalPrerequisiteSourcesForReview
} from "../packages/core/src/index.mjs";

const execFileAsync = promisify(execFile);
const phase520BaselineCommit = "f93f88bd5539dc64844f7c42b6ce73c44d59f78d";
const reviewedAt = "2026-06-15T00:00:00.000Z";
const repoRootUrl = new URL("../", import.meta.url);
const repoRoot = fileURLToPath(repoRootUrl);
const cliSourceUrl = new URL("../apps/cli/src/index.mjs", import.meta.url);
const cliPath = fileURLToPath(cliSourceUrl);
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-20/approval-prerequisite-source-ingestion-preflight.json",
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
  "sourceInputShape",
  "preflightResultShape",
  "sourcePreflightCases",
  "readerIntegration",
  "blockedRuntimeEffect",
  "serveRuntimeBlockedBehavior",
  "forbiddenBehavior",
  "filesAllowedToChange",
  "filesForbiddenToChange",
  "validationCommands"
]);

const expectedCaseIds = Object.freeze([
  "missing-source-inputs",
  "malformed-source-input",
  "empty-source-input",
  "duplicate-source-input",
  "stale-prerequisite-source-input",
  "unknown-prerequisite-source-input",
  "revoked-prerequisite-source-input",
  "valid-prerequisite-source-input"
]);

const expectedClassifications = Object.freeze({
  "missing-source-inputs": "missing_prerequisite_source_input_rejected",
  "malformed-source-input": "malformed_prerequisite_source_input_rejected",
  "empty-source-input": "empty_prerequisite_source_input_rejected",
  "duplicate-source-input": "duplicate_prerequisite_source_input_rejected",
  "stale-prerequisite-source-input": "stale_prerequisite_source_input_rejected",
  "unknown-prerequisite-source-input": "unknown_prerequisite_source_input_rejected",
  "revoked-prerequisite-source-input": "revoked_prerequisite_source_input_rejected",
  "valid-prerequisite-source-input":
    "valid_prerequisite_source_input_review_only_runtime_still_blocked"
});

const sourcePreflightCommandProbes = Object.freeze([
  "approval-prerequisite-source-preflight",
  "preflight-approval-prerequisite-sources",
  "runtime-prerequisite-source-preflight",
  "phase-5-20-approval-prerequisite-source-ingestion-preflight",
  "approval-prerequisite-reader",
  "read-approval-prerequisites",
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

function inlineSource(sourceId, records, overrides = {}) {
  return {
    sourceId,
    sourceKind: "inline-prerequisite-records",
    sourceMode: "in-memory",
    records,
    ...overrides
  };
}

function sourceCases() {
  return [
    {
      caseId: "missing-source-inputs",
      input: { reviewedAt },
      expectedAccepted: false,
      expectedForwarded: false
    },
    {
      caseId: "malformed-source-input",
      input: {
        reviewedAt,
        sourceInputs: [
          inlineSource("source-malformed", [runtimeApprovalRecord()], {
            sourceKind: "file-prerequisite-records",
            sourceMode: "filesystem"
          })
        ]
      },
      expectedAccepted: false,
      expectedForwarded: false
    },
    {
      caseId: "empty-source-input",
      input: {
        reviewedAt,
        sourceInputs: [inlineSource("source-empty", [])]
      },
      expectedAccepted: false,
      expectedForwarded: false
    },
    {
      caseId: "duplicate-source-input",
      input: {
        reviewedAt,
        sourceInputs: [
          inlineSource("source-duplicate", [runtimeApprovalRecord()]),
          inlineSource("source-duplicate", [commandExposureApprovalRecord()])
        ]
      },
      expectedAccepted: false,
      expectedForwarded: false
    },
    {
      caseId: "stale-prerequisite-source-input",
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
      expectedForwarded: false
    },
    {
      caseId: "unknown-prerequisite-source-input",
      input: {
        reviewedAt,
        sourceInputs: [
          inlineSource("source-unknown", [
            runtimeApprovalRecord(),
            commandExposureApprovalRecord(),
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
      expectedForwarded: false
    },
    {
      caseId: "revoked-prerequisite-source-input",
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
      expectedForwarded: false
    },
    {
      caseId: "valid-prerequisite-source-input",
      input: {
        reviewedAt,
        sourceInputs: [
          inlineSource("source-valid", [
            runtimeApprovalRecord(),
            commandExposureApprovalRecord()
          ])
        ]
      },
      expectedAccepted: true,
      expectedForwarded: true
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

test("Phase 5.20 source preflight fixture is deterministic metadata", async () => {
  const raw = await readFile(fixtureUrl, "utf8");
  const fixture = JSON.parse(raw);

  assert.equal(raw.endsWith("\n"), true);
  assert.equal(raw.includes("\r"), false);
  assert.deepEqual(Object.keys(fixture), expectedTopLevelKeys);
  assert.equal(
    fixture.schema,
    "ardyn.phase-5.20.approval-prerequisite-source-ingestion-preflight"
  );
  assert.equal(fixture.schemaVersion, "0.1.0");
  assert.equal(fixture.phase, "phase-5.20-approval-prerequisite-source-ingestion-preflight");
  assert.equal(fixture.artifactKind, "approval-prerequisite-source-ingestion-preflight");
  assert.equal(fixture.metadataGeneratedAt, "1970-01-01T00:00:00.000Z");
  assert.equal(fixture.sourcePhase.phase, "phase-5.19-approval-prerequisite-reader-hardening");
  assert.equal(fixture.sourcePhase.runtimeEnabled, false);
  assert.equal(fixture.sourcePhase.approvalGrantProduced, false);
});

test("Phase 5.20 source preflight classifies source inputs deterministically", () => {
  for (const sourceCase of sourceCases()) {
    const result = preflightApprovalPrerequisiteSourcesForReview(sourceCase.input);

    assert.equal(result.schema, APPROVAL_PREREQUISITE_SOURCE_PREFLIGHT_SCHEMA);
    assert.equal(result.schemaVersion, "0.1.0");
    assert.equal(result.preflightKind, "approval-prerequisite-source-ingestion-preflight");
    assert.equal(result.preflightMode, "review-only");
    assert.equal(result.reviewedAt, reviewedAt);
    assert.equal(result.reviewOnly, true);
    assert.equal(result.authoritative, false);
    assert.equal(result.classification, expectedClassifications[sourceCase.caseId]);
    assert.equal(result.sourceInputsAccepted, sourceCase.expectedAccepted, sourceCase.caseId);
    assert.equal(result.readerInputForwarded, sourceCase.expectedForwarded, sourceCase.caseId);
    assert.equal(result.approvalGrant.produced, false, sourceCase.caseId);
    assert.equal(result.approvalGrant.persisted, false, sourceCase.caseId);
    assert.equal(result.approvalGrant.grantId, null, sourceCase.caseId);
    assertAllFalse(result.runtimeEffect);
  }
});

test("Phase 5.20 valid source input feeds only the review reader and evaluator", () => {
  const validCase = sourceCases().find(
    (sourceCase) => sourceCase.caseId === "valid-prerequisite-source-input"
  );
  const result = preflightApprovalPrerequisiteSourcesForReview(validCase.input);
  const evaluation = evaluateRuntimeApprovalPrerequisitesForReview(result.acceptedReaderInput);

  assert.equal(result.sourceInputsAccepted, true);
  assert.equal(result.readerInputForwarded, true);
  assert.equal(result.acceptedReaderInput.reviewedAt, reviewedAt);
  assert.equal(result.acceptedReaderInput.prerequisiteRecords.length, 2);
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

test("Phase 5.20 rejected source inputs fail closed before reader forwarding", () => {
  for (const sourceCase of sourceCases().filter((entry) => !entry.expectedAccepted)) {
    const result = preflightApprovalPrerequisiteSourcesForReview(sourceCase.input);

    assert.equal(result.sourceInputsAccepted, false, sourceCase.caseId);
    assert.equal(result.readerInputForwarded, false, sourceCase.caseId);
    assert.equal(result.acceptedReaderInput, null, sourceCase.caseId);
    assert.equal(result.approvalPrerequisiteReader, null, sourceCase.caseId);
    assert.ok(result.rejectionReasons.length > 0, sourceCase.caseId);
    assert.ok(result.rejectionReasons.includes("approval_grant_not_implemented"));
    assert.ok(result.rejectionReasons.includes("runtime_enablement_still_blocked"));
    assertAllFalse(result.runtimeEffect);
  }
});

test("Phase 5.20 fixture mirrors source preflight cases and blocks grants", async () => {
  const fixture = await readJson(fixtureUrl);

  assert.deepEqual(fixture.preflightSummary, {
    approvalPrerequisiteSourcePreflightRecorded: true,
    preflightKind: "approval-prerequisite-source-ingestion-preflight",
    preflightReviewOnly: true,
    preflightAuthoritative: false,
    missingSourceInputsRejected: true,
    malformedSourceInputsRejected: true,
    emptySourceInputsRejected: true,
    duplicateSourceInputsRejected: true,
    stalePrerequisiteSourceInputsRejected: true,
    unknownPrerequisiteSourceInputsRejected: true,
    revokedPrerequisiteSourceInputsRejected: true,
    validSourceInputsRecognizedForReaderOnly: true,
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
    fixture.sourcePreflightCases.map((sourceCase) => sourceCase.caseId),
    expectedCaseIds
  );

  for (const sourceCase of fixture.sourcePreflightCases) {
    assert.equal(sourceCase.classification, expectedClassifications[sourceCase.caseId]);
    assert.equal(sourceCase.reviewOnly, true, sourceCase.caseId);
    assert.equal(sourceCase.authoritative, false, sourceCase.caseId);
    assert.equal(sourceCase.approvalGrant.produced, false, sourceCase.caseId);
    assert.equal(sourceCase.approvalGrant.persisted, false, sourceCase.caseId);
    assert.equal(sourceCase.approvalGrant.grantId, null, sourceCase.caseId);
    assertAllFalse(sourceCase.runtimeEffect);
  }
  assert.equal(fixture.readerIntegration.acceptedSourcesMayFeedReviewReader, true);
  assert.equal(fixture.readerIntegration.rejectedSourcesDoNotFeedReader, true);
  assert.equal(fixture.readerIntegration.readerStillReviewOnly, true);
  assert.equal(fixture.readerIntegration.evaluatorStillReviewOnly, true);
  assert.equal(fixture.readerIntegration.readerCanProduceGrant, false);
  assert.equal(fixture.readerIntegration.evaluatorCanProduceGrant, false);
  assertAllFalse(fixture.blockedRuntimeEffect);
});

test("serve-runtime remains default-blocked and dry-run cannot bypass Phase 5.20 source preflight", async () => {
  const fixture = await readJson(fixtureUrl);
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-20-source-"));

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

test("Phase 5.20 source preflight command names remain rejected", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-20-source-probes-"));
  const serveRuntimeStderr =
    "Usage: ardyn serve-runtime [--dry-run]\n" +
    "Runtime unavailable: serve-runtime is recognized, but runtime is not enabled in Phase 5.5.\n";

  try {
    for (const command of sourcePreflightCommandProbes) {
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

test("Phase 5.20 does not change CLI runtime source or add source-ingestion runtime primitives", async () => {
  const [{ stdout: baselineSource }, currentSource] = await Promise.all([
    execFileAsync("git", ["show", `${phase520BaselineCommit}:apps/cli/src/index.mjs`], {
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
    /approvalPrerequisiteSourcePreflightCommand/i,
    /runtimePrerequisiteSourcePreflightCommand/i
  ]) {
    assert.doesNotMatch(currentSource, forbiddenPattern);
  }
});
