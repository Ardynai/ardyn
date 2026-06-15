import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readFile, readdir, rm, mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";
import {
  APPROVAL_PREREQUISITE_READER_SCHEMA,
  evaluateRuntimeApprovalPrerequisitesForReview,
  readApprovalPrerequisiteRecordsForReview
} from "../packages/core/src/index.mjs";

const execFileAsync = promisify(execFile);
const phase519BaselineCommit = "4b8a415449f577283c62aa01c9008f7dc6174ad9";
const reviewedAt = "2026-06-15T00:00:00.000Z";
const repoRootUrl = new URL("../", import.meta.url);
const repoRoot = fileURLToPath(repoRootUrl);
const cliSourceUrl = new URL("../apps/cli/src/index.mjs", import.meta.url);
const cliPath = fileURLToPath(cliSourceUrl);
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-19/approval-prerequisite-reader-hardening.json",
  import.meta.url
);

const expectedTopLevelKeys = Object.freeze([
  "schema",
  "schemaVersion",
  "phase",
  "artifactKind",
  "metadataGeneratedAt",
  "sourcePhase",
  "readerSummary",
  "readerInputShape",
  "readerResultShape",
  "readerCases",
  "evaluatorIntegration",
  "blockedRuntimeEffect",
  "serveRuntimeBlockedBehavior",
  "forbiddenBehavior",
  "filesAllowedToChange",
  "filesForbiddenToChange",
  "validationCommands"
]);

const expectedCaseIds = Object.freeze([
  "missing-prerequisite-records",
  "malformed-prerequisite-record",
  "malformed-sparse-effect-record",
  "revoked-prerequisite-record",
  "valid-prerequisite-records-review-only",
  "duplicate-prerequisite-record",
  "stale-prerequisite-record",
  "unknown-prerequisite-record"
]);

const expectedClassifications = Object.freeze({
  "missing-prerequisite-records": "missing_prerequisite_record_rejected",
  "malformed-prerequisite-record": "malformed_prerequisite_record_rejected",
  "malformed-sparse-effect-record": "malformed_prerequisite_record_rejected",
  "revoked-prerequisite-record": "revoked_prerequisite_record_rejected",
  "valid-prerequisite-records-review-only":
    "valid_prerequisite_records_review_only_runtime_still_blocked",
  "duplicate-prerequisite-record": "duplicate_prerequisite_record_rejected",
  "stale-prerequisite-record": "stale_prerequisite_record_rejected",
  "unknown-prerequisite-record": "unknown_prerequisite_record_rejected"
});

const readerCommandProbes = Object.freeze([
  "approval-prerequisite-reader",
  "read-approval-prerequisites",
  "runtime-approval-prerequisite-reader",
  "runtime-prerequisite-reader",
  "phase-5-19-approval-prerequisite-reader-hardening",
  "review-only-approval-evaluator",
  "approval-grant",
  "serve-runtime"
]);

const allRuntimeEffectFalse = Object.freeze({
  runtimeEnabled: false,
  runtimeStarted: false,
  runtimeReady: false,
  runtimeCommandEnabled: false,
  runtimeCommandExposureEnabled: false,
  runtimeExecutionEnabled: false,
  runtimeExecuted: false,
  approvalGrantProduced: false,
  approvalGrantPersisted: false,
  approvalEvaluatorAuthoritative: false
});

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

function readerCases() {
  return [
    {
      caseId: "missing-prerequisite-records",
      input: {
        reviewedAt,
        prerequisiteRecords: []
      },
      expectedRuntimeStatus: "missing",
      expectedCommandStatus: "missing"
    },
    {
      caseId: "malformed-prerequisite-record",
      input: {
        reviewedAt,
        runtimeApprovalRecord: runtimeApprovalRecord({
          approvalStatus: "denied"
        }),
        commandExposureApprovalRecord: commandExposureApprovalRecord()
      },
      expectedRuntimeStatus: "malformed",
      expectedCommandStatus: "valid"
    },
    {
      caseId: "malformed-sparse-effect-record",
      input: {
        reviewedAt,
        runtimeApprovalRecord: runtimeApprovalRecord(),
        commandExposureApprovalRecord: commandExposureApprovalRecord({
          commandExposureEffect: undefined,
          runtimeEffect: {
            runtimeEnabled: false
          }
        })
      },
      expectedRuntimeStatus: "valid",
      expectedCommandStatus: "malformed"
    },
    {
      caseId: "revoked-prerequisite-record",
      input: {
        reviewedAt,
        runtimeApprovalRecord: runtimeApprovalRecord({
          revocation: {
            revoked: true,
            revokedAt: "2026-06-15T00:00:00.000Z",
            revocationReason: "operator-revoked"
          }
        }),
        commandExposureApprovalRecord: commandExposureApprovalRecord()
      },
      expectedRuntimeStatus: "revoked",
      expectedCommandStatus: "valid"
    },
    {
      caseId: "valid-prerequisite-records-review-only",
      input: {
        reviewedAt,
        runtimeApprovalRecord: runtimeApprovalRecord(),
        commandExposureApprovalRecord: commandExposureApprovalRecord()
      },
      expectedRuntimeStatus: "valid",
      expectedCommandStatus: "valid"
    },
    {
      caseId: "duplicate-prerequisite-record",
      input: {
        reviewedAt,
        prerequisiteRecords: [
          runtimeApprovalRecord({ recordId: "runtime-approval-record-001" }),
          runtimeApprovalRecord({ recordId: "runtime-approval-record-002" }),
          commandExposureApprovalRecord()
        ]
      },
      expectedRuntimeStatus: "duplicate",
      expectedCommandStatus: "valid"
    },
    {
      caseId: "stale-prerequisite-record",
      input: {
        reviewedAt,
        runtimeApprovalRecord: runtimeApprovalRecord({
          validity: validity({
            expiresAt: "2026-06-14T00:00:00.000Z",
            validAtEvaluation: false
          })
        }),
        commandExposureApprovalRecord: commandExposureApprovalRecord()
      },
      expectedRuntimeStatus: "stale",
      expectedCommandStatus: "valid"
    },
    {
      caseId: "unknown-prerequisite-record",
      input: {
        reviewedAt,
        prerequisiteRecords: [
          runtimeApprovalRecord(),
          commandExposureApprovalRecord(),
          {
            schema: "ardyn.unreviewed-runtime-prerequisite-record",
            schemaVersion: "0.1.0",
            recordKind: "unreviewed-runtime-prerequisite-record",
            recordId: "unknown-record-001"
          }
        ]
      },
      expectedRuntimeStatus: "valid",
      expectedCommandStatus: "valid"
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

test("Phase 5.19 prerequisite reader fixture is deterministic metadata", async () => {
  const raw = await readFile(fixtureUrl, "utf8");
  const fixture = JSON.parse(raw);

  assert.equal(raw.endsWith("\n"), true);
  assert.equal(raw.includes("\r"), false);
  assert.deepEqual(Object.keys(fixture), expectedTopLevelKeys);
  assert.equal(fixture.schema, "ardyn.phase-5.19.approval-prerequisite-reader-hardening");
  assert.equal(fixture.schemaVersion, "0.1.0");
  assert.equal(fixture.phase, "phase-5.19-approval-prerequisite-reader-hardening");
  assert.equal(fixture.artifactKind, "approval-prerequisite-reader-hardening");
  assert.equal(fixture.metadataGeneratedAt, "1970-01-01T00:00:00.000Z");
  assert.deepEqual(fixture.sourcePhase, {
    phase: "phase-5.18-review-only-approval-evaluator-skeleton",
    document: "docs/phase-5-18-review-only-approval-evaluator-skeleton.md",
    fixture: "tests/fixtures/host-policy/phase5-18/review-only-approval-evaluator-skeleton.json",
    runtimeEnabled: false,
    reviewOnlyApprovalEvaluatorSkeletonRecorded: true,
    approvalGrantProduced: false,
    recommendedNextSlice: "phase-5.19-approval-prerequisite-reader-hardening"
  });
});

test("Phase 5.19 reader normalizes prerequisite records deterministically", () => {
  for (const readerCase of readerCases()) {
    const result = readApprovalPrerequisiteRecordsForReview(readerCase.input);

    assert.equal(result.schema, APPROVAL_PREREQUISITE_READER_SCHEMA);
    assert.equal(result.schemaVersion, "0.1.0");
    assert.equal(result.readerKind, "approval-prerequisite-reader");
    assert.equal(result.readerMode, "review-only");
    assert.equal(result.reviewedAt, reviewedAt);
    assert.equal(result.reviewOnly, true);
    assert.equal(result.authoritative, false);
    assert.equal(result.classification, expectedClassifications[readerCase.caseId]);
    assert.equal(
      result.prerequisiteRecords.runtimeApprovalRecord.status,
      readerCase.expectedRuntimeStatus,
      readerCase.caseId
    );
    assert.equal(
      result.prerequisiteRecords.commandExposureApprovalRecord.status,
      readerCase.expectedCommandStatus,
      readerCase.caseId
    );
    assert.equal(
      result.prerequisiteSignalRecognized,
      readerCase.caseId === "valid-prerequisite-records-review-only",
      readerCase.caseId
    );
    assert.equal(result.approvalGrant.produced, false, readerCase.caseId);
    assert.equal(result.approvalGrant.persisted, false, readerCase.caseId);
    assert.equal(result.approvalGrant.grantId, null, readerCase.caseId);
    assertAllFalse(result.runtimeEffect);
  }
});

test("Phase 5.19 reader exposes deterministic review evidence for duplicate stale and unknown records", () => {
  const duplicate = readApprovalPrerequisiteRecordsForReview(
    readerCases().find((readerCase) => readerCase.caseId === "duplicate-prerequisite-record")
      .input
  );
  const stale = readApprovalPrerequisiteRecordsForReview(
    readerCases().find((readerCase) => readerCase.caseId === "stale-prerequisite-record")
      .input
  );
  const unknown = readApprovalPrerequisiteRecordsForReview(
    readerCases().find((readerCase) => readerCase.caseId === "unknown-prerequisite-record")
      .input
  );

  assert.deepEqual(duplicate.recordCounts, {
    total: 3,
    known: 3,
    unknown: 0,
    malformed: 0,
    duplicate: 1,
    stale: 0,
    revoked: 0,
    valid: 1,
    missing: 0
  });
  assert.deepEqual(
    duplicate.duplicateRecords.map(({ expectedRecord, recordIds }) => [
      expectedRecord,
      recordIds
    ]),
    [["runtimeApprovalRecord", ["runtime-approval-record-001", "runtime-approval-record-002"]]]
  );
  assert.deepEqual(stale.staleRecords.map(({ expectedRecord, recordId }) => [
    expectedRecord,
    recordId
  ]), [["runtimeApprovalRecord", "runtime-approval-record-001"]]);
  assert.deepEqual(unknown.unknownRecords, [
    {
      index: 2,
      schema: "ardyn.unreviewed-runtime-prerequisite-record",
      recordKind: "unreviewed-runtime-prerequisite-record",
      reason: "unknown_prerequisite_record"
    }
  ]);
  assert.ok(duplicate.rejectionReasons.includes("runtime_approval_record_duplicate"));
  assert.ok(stale.rejectionReasons.includes("runtime_approval_record_stale"));
  assert.ok(unknown.rejectionReasons.includes("unknown_prerequisite_record"));
});

test("Phase 5.19 evaluator consumes the hardened reader without authorizing grants", () => {
  for (const readerCase of readerCases()) {
    const result = evaluateRuntimeApprovalPrerequisitesForReview(readerCase.input);

    assert.equal(result.reviewOnly, true, readerCase.caseId);
    assert.equal(result.authoritative, false, readerCase.caseId);
    assert.equal(result.approvalPrerequisiteReader.schema, APPROVAL_PREREQUISITE_READER_SCHEMA);
    assert.equal(
      result.approvalPrerequisiteReader.classification,
      expectedClassifications[readerCase.caseId],
      readerCase.caseId
    );
    assert.equal(result.approvalGrant.produced, false, readerCase.caseId);
    assert.equal(result.approvalGrant.persisted, false, readerCase.caseId);
    assert.equal(result.approvalGrant.grantId, null, readerCase.caseId);
    assertAllFalse(result.runtimeEffect);
  }
});

test("Phase 5.19 fixture mirrors reader cases and blocks grants", async () => {
  const fixture = await readJson(fixtureUrl);

  assert.deepEqual(fixture.readerSummary, {
    approvalPrerequisiteReaderHardeningRecorded: true,
    readerKind: "approval-prerequisite-reader",
    readerReviewOnly: true,
    readerAuthoritative: false,
    missingPrerequisiteRecordsRejected: true,
    malformedPrerequisiteRecordsRejected: true,
    revokedPrerequisiteRecordsRejected: true,
    validPrerequisiteRecordsRecognizedForReviewOnly: true,
    duplicatePrerequisiteRecordsRejected: true,
    stalePrerequisiteRecordsRejected: true,
    unknownPrerequisiteRecordsRejected: true,
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
    fixture.readerCases.map((readerCase) => readerCase.caseId),
    expectedCaseIds
  );

  for (const readerCase of fixture.readerCases) {
    assert.equal(readerCase.classification, expectedClassifications[readerCase.caseId]);
    assert.equal(readerCase.reviewOnly, true, readerCase.caseId);
    assert.equal(readerCase.authoritative, false, readerCase.caseId);
    assert.equal(readerCase.approvalGrant.produced, false, readerCase.caseId);
    assert.equal(readerCase.approvalGrant.persisted, false, readerCase.caseId);
    assert.equal(readerCase.approvalGrant.grantId, null, readerCase.caseId);
    assertAllFalse(readerCase.runtimeEffect);
  }
  assert.equal(fixture.evaluatorIntegration.readerUsedByReviewOnlyEvaluator, true);
  assert.equal(fixture.evaluatorIntegration.evaluatorStillReviewOnly, true);
  assert.equal(fixture.evaluatorIntegration.evaluatorCanProduceGrant, false);
  assertAllFalse(fixture.blockedRuntimeEffect);
});

test("serve-runtime remains default-blocked and dry-run cannot bypass Phase 5.19 reader", async () => {
  const fixture = await readJson(fixtureUrl);
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-19-reader-"));

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

test("Phase 5.19 reader command names remain rejected", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-19-reader-probes-"));
  const serveRuntimeStderr =
    "Usage: ardyn serve-runtime [--dry-run]\n" +
    "Runtime unavailable: serve-runtime is recognized, but runtime is not enabled in Phase 5.5.\n";

  try {
    for (const command of readerCommandProbes) {
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

test("Phase 5.19 does not change CLI runtime source or add runtime primitives", async () => {
  const [{ stdout: baselineSource }, currentSource] = await Promise.all([
    execFileAsync("git", ["show", `${phase519BaselineCommit}:apps/cli/src/index.mjs`], {
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
    /\bwriteFile\s*\([^)]*runtime/i,
    /\bappendFile\s*\(/,
    /approval.*grant.*create/i,
    /approvalPrerequisiteReaderCommand/i,
    /runtimeApprovalPrerequisiteReaderCommand/i
  ]) {
    assert.doesNotMatch(currentSource, forbiddenPattern);
  }
});
