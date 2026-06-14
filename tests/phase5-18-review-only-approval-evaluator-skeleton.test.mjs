import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readFile, readdir, rm, mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";
import {
  REVIEW_ONLY_RUNTIME_APPROVAL_EVALUATOR_SCHEMA,
  evaluateRuntimeApprovalPrerequisitesForReview
} from "../packages/core/src/index.mjs";

const execFileAsync = promisify(execFile);
const phase518BaselineCommit = "8edce9bea05e3f79280108b122550cbe527a3562";
const repoRootUrl = new URL("../", import.meta.url);
const repoRoot = fileURLToPath(repoRootUrl);
const cliSourceUrl = new URL("../apps/cli/src/index.mjs", import.meta.url);
const cliPath = fileURLToPath(cliSourceUrl);
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-18/review-only-approval-evaluator-skeleton.json",
  import.meta.url
);

const expectedTopLevelKeys = Object.freeze([
  "schema",
  "schemaVersion",
  "phase",
  "artifactKind",
  "metadataGeneratedAt",
  "sourcePhase",
  "evaluatorSummary",
  "evaluatorInputShape",
  "evaluatorResultShape",
  "evaluatorCases",
  "blockedRuntimeEffect",
  "serveRuntimeBlockedBehavior",
  "forbiddenBehavior",
  "filesAllowedToChange",
  "filesForbiddenToChange",
  "validationCommands"
]);

const expectedCaseIds = Object.freeze([
  "missing-prerequisite-records",
  "invalid-runtime-approval-record",
  "revoked-runtime-approval-record",
  "valid-prerequisite-records-review-only"
]);

const expectedClassifications = Object.freeze({
  "missing-prerequisite-records": "missing_prerequisite_record_rejected",
  "invalid-runtime-approval-record": "invalid_prerequisite_record_rejected",
  "revoked-runtime-approval-record": "revoked_prerequisite_record_rejected",
  "valid-prerequisite-records-review-only":
    "valid_prerequisites_review_only_runtime_still_blocked"
});

const evaluatorCommandProbes = Object.freeze([
  "review-only-approval-evaluator",
  "approval-evaluator",
  "runtime-approval-evaluator",
  "evaluate-runtime-approval",
  "evaluate-runtime-prerequisites",
  "runtime-approval-review",
  "approval-grant",
  "grant-runtime",
  "phase-5-18-review-only-approval-evaluator-skeleton",
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

function runtimeApprovalRecord(overrides = {}) {
  return {
    schema: "ardyn.runtime-approval-record",
    schemaVersion: "0.1.0",
    recordKind: "runtime-approval-record",
    approvalStatus: "approved",
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
    approvalStatus: "approved",
    revocation: {
      revoked: false,
      revokedAt: null,
      revocationReason: null
    },
    runtimeEffect: {
      currentRecordExposesRuntimeCommand: false,
      runtimeCommandEnabled: false,
      runtimeCommandExposureEnabled: false,
      runtimeExecutionEnabled: false,
      runtimeStarts: false,
      approvalGrantCreated: false
    },
    ...overrides
  };
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

test("Phase 5.18 review-only evaluator fixture is deterministic metadata", async () => {
  const raw = await readFile(fixtureUrl, "utf8");
  const fixture = JSON.parse(raw);

  assert.equal(raw.endsWith("\n"), true);
  assert.equal(raw.includes("\r"), false);
  assert.deepEqual(Object.keys(fixture), expectedTopLevelKeys);
  assert.equal(fixture.schema, "ardyn.phase-5.18.review-only-approval-evaluator-skeleton");
  assert.equal(fixture.schemaVersion, "0.1.0");
  assert.equal(fixture.phase, "phase-5.18-review-only-approval-evaluator-skeleton");
  assert.equal(fixture.artifactKind, "review-only-approval-evaluator-skeleton");
  assert.equal(fixture.metadataGeneratedAt, "1970-01-01T00:00:00.000Z");
  assert.deepEqual(fixture.sourcePhase, {
    phase: "phase-5.17-guarded-runtime-implementation-plan",
    document: "docs/phase-5-17-guarded-runtime-implementation-plan.md",
    fixture: "tests/fixtures/host-policy/phase5-17/guarded-runtime-implementation-plan.json",
    runtimeEnabled: false,
    implementationPlanRecorded: true,
    recommendedNextSlice: "phase-5.18-review-only-approval-evaluator-skeleton"
  });
});

test("Phase 5.18 evaluator skeleton classifies prerequisite records for review only", async () => {
  const cases = [
    {
      caseId: "missing-prerequisite-records",
      input: {},
      expectedRuntimeStatus: "missing",
      expectedCommandStatus: "missing"
    },
    {
      caseId: "invalid-runtime-approval-record",
      input: {
        runtimeApprovalRecord: runtimeApprovalRecord({
          schema: "ardyn.unsupported-runtime-approval-record"
        }),
        commandExposureApprovalRecord: commandExposureApprovalRecord()
      },
      expectedRuntimeStatus: "invalid",
      expectedCommandStatus: "valid"
    },
    {
      caseId: "revoked-runtime-approval-record",
      input: {
        runtimeApprovalRecord: runtimeApprovalRecord({
          revocation: {
            revoked: true,
            revokedAt: "2026-06-14T00:00:00.000Z",
            revocationReason: "test-revocation"
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
        runtimeApprovalRecord: runtimeApprovalRecord(),
        commandExposureApprovalRecord: commandExposureApprovalRecord()
      },
      expectedRuntimeStatus: "valid",
      expectedCommandStatus: "valid"
    }
  ];

  for (const reviewCase of cases) {
    const result = evaluateRuntimeApprovalPrerequisitesForReview(reviewCase.input);

    assert.equal(result.schema, REVIEW_ONLY_RUNTIME_APPROVAL_EVALUATOR_SCHEMA);
    assert.equal(result.schemaVersion, "0.1.0");
    assert.equal(result.evaluatorKind, "review-only-runtime-approval-evaluator");
    assert.equal(result.evaluationMode, "review-only");
    assert.equal(result.classification, expectedClassifications[reviewCase.caseId]);
    assert.equal(
      result.prerequisiteRecords.runtimeApprovalRecord.status,
      reviewCase.expectedRuntimeStatus
    );
    assert.equal(
      result.prerequisiteRecords.commandExposureApprovalRecord.status,
      reviewCase.expectedCommandStatus
    );
    assert.equal(
      result.prerequisiteSignalRecognized,
      reviewCase.caseId === "valid-prerequisite-records-review-only",
      reviewCase.caseId
    );
    assert.equal(result.reviewOnly, true, reviewCase.caseId);
    assert.equal(result.authoritative, false, reviewCase.caseId);
    assert.equal(result.approvalGrant.produced, false, reviewCase.caseId);
    assert.equal(result.approvalGrant.persisted, false, reviewCase.caseId);
    assert.equal(result.approvalGrant.grantId, null, reviewCase.caseId);
    assertAllFalse(result.runtimeEffect);
  }
});

test("Phase 5.18 fixture mirrors evaluator cases and blocks grants", async () => {
  const fixture = await readJson(fixtureUrl);

  assert.deepEqual(fixture.evaluatorSummary, {
    reviewOnlyApprovalEvaluatorSkeletonRecorded: true,
    evaluatorKind: "review-only-runtime-approval-evaluator",
    evaluatorReviewOnly: true,
    evaluatorAuthoritative: false,
    missingPrerequisiteRecordsRejected: true,
    invalidPrerequisiteRecordsRejected: true,
    revokedPrerequisiteRecordsRejected: true,
    validPrerequisiteRecordsRecognizedForReviewOnly: true,
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
    fixture.evaluatorCases.map((evaluatorCase) => evaluatorCase.caseId),
    expectedCaseIds
  );

  for (const evaluatorCase of fixture.evaluatorCases) {
    assert.equal(
      evaluatorCase.classification,
      expectedClassifications[evaluatorCase.caseId],
      evaluatorCase.caseId
    );
    assert.equal(evaluatorCase.reviewOnly, true, evaluatorCase.caseId);
    assert.equal(evaluatorCase.authoritative, false, evaluatorCase.caseId);
    assert.equal(evaluatorCase.approvalGrant.produced, false, evaluatorCase.caseId);
    assert.equal(evaluatorCase.approvalGrant.persisted, false, evaluatorCase.caseId);
    assert.equal(evaluatorCase.approvalGrant.grantId, null, evaluatorCase.caseId);
    assertAllFalse(evaluatorCase.runtimeEffect);
  }
  assert.deepEqual(fixture.evaluatorResultShape.requiredRuntimeEffectFalseFields, [
    "runtimeEnabled",
    "runtimeStarted",
    "runtimeReady",
    "runtimeCommandEnabled",
    "runtimeCommandExposureEnabled",
    "runtimeExecutionEnabled",
    "runtimeExecuted",
    "approvalGrantProduced",
    "approvalGrantPersisted",
    "approvalEvaluatorAuthoritative"
  ]);
  assert.deepEqual(fixture.blockedRuntimeEffect, {
    ...allRuntimeEffectFalse,
    liveStdinLoopEnabled: false,
    runtimeStdoutWriterEnabled: false,
    runtimeStderrWriterEnabled: false,
    processSpawnEnabled: false,
    processTerminationEnabled: false,
    runtimeSupervisionEnabled: false,
    runtimeTranscriptWritePerformed: false,
    runtimeAuditWritePerformed: false,
    adapterRuntimeBehaviorEnabled: false,
    contentFabricRuntimeBehaviorEnabled: false,
    webSocketHttpSurfaceEnabled: false
  });
});

test("serve-runtime remains default-blocked and dry-run cannot bypass Phase 5.18 evaluator", async () => {
  const fixture = await readJson(fixtureUrl);
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-18-evaluator-"));

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

test("Phase 5.18 evaluator command names remain rejected", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-18-evaluator-probes-"));
  const serveRuntimeStderr =
    "Usage: ardyn serve-runtime [--dry-run]\n" +
    "Runtime unavailable: serve-runtime is recognized, but runtime is not enabled in Phase 5.5.\n";

  try {
    for (const command of evaluatorCommandProbes) {
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

test("Phase 5.18 does not change CLI runtime source or add runtime primitives", async () => {
  const [{ stdout: baselineSource }, currentSource] = await Promise.all([
    execFileAsync("git", ["show", `${phase518BaselineCommit}:apps/cli/src/index.mjs`], {
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
    /runtimeApprovalEvaluator/i,
    /reviewOnlyRuntimeApprovalEvaluator/i
  ]) {
    assert.doesNotMatch(currentSource, forbiddenPattern);
  }
});
