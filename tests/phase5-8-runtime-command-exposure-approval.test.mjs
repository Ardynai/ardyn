import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readFile, readdir, rm, mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";

const execFileAsync = promisify(execFile);
const phase58BaselineCommit = "6231515386c94956fa7174217e56abd2733bee04";
const repoRootUrl = new URL("../", import.meta.url);
const repoRoot = fileURLToPath(repoRootUrl);
const cliSourceUrl = new URL("../apps/cli/src/index.mjs", import.meta.url);
const cliPath = fileURLToPath(cliSourceUrl);
const fixtureUrl = new URL(
  "../tests/fixtures/command-surface/phase5-8/runtime-command-exposure-approval-contract.json",
  import.meta.url
);

const expectedTopLevelKeys = Object.freeze([
  "schema",
  "schemaVersion",
  "phase",
  "artifactKind",
  "metadataGeneratedAt",
  "sourcePhase",
  "contractSummary",
  "commandExposureApprovalRecordShape",
  "commandExposureApprovalCases",
  "validationRules",
  "recognizedCommandBoundary",
  "blockedRuntimeEffect",
  "serveRuntimeBlockedBehavior",
  "forbiddenBehavior",
  "filesAllowedToChange",
  "filesForbiddenToChange",
  "validationCommands"
]);

const expectedCaseIds = Object.freeze([
  "missing-command-exposure-approval",
  "invalid-command-exposure-approval",
  "revoked-command-exposure-approval",
  "valid-command-exposure-approval-prerequisite-only"
]);
const expectedClassifications = Object.freeze({
  "missing-command-exposure-approval": "missing_command_exposure_approval_rejected",
  "invalid-command-exposure-approval": "invalid_command_exposure_approval_rejected",
  "revoked-command-exposure-approval": "revoked_command_exposure_approval_rejected",
  "valid-command-exposure-approval-prerequisite-only":
    "valid_command_exposure_prerequisite_signal_runtime_still_blocked"
});
const commandExposureApprovalCommandProbes = Object.freeze([
  "runtime-command-exposure-approval",
  "approve-runtime-command-exposure",
  "validate-runtime-command-exposure-approval",
  "command-exposure-approval-record"
]);

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

test("Phase 5.8 command-exposure approval fixture is deterministic metadata", async () => {
  const raw = await readFile(fixtureUrl, "utf8");
  const fixture = JSON.parse(raw);

  assert.equal(raw.endsWith("\n"), true);
  assert.equal(raw.includes("\r"), false);
  assert.deepEqual(Object.keys(fixture), expectedTopLevelKeys);
  assert.equal(fixture.schema, "ardyn.phase-5.8.runtime-command-exposure-approval-contract");
  assert.equal(fixture.schemaVersion, "0.1.0");
  assert.equal(fixture.phase, "phase-5.8-runtime-command-exposure-approval");
  assert.equal(fixture.artifactKind, "runtime-command-exposure-approval-contract");
  assert.equal(fixture.metadataGeneratedAt, "1970-01-01T00:00:00.000Z");
  assert.deepEqual(fixture.sourcePhase, {
    phase: "phase-5.7-runtime-approval-validation",
    document: "docs/phase-5-7-runtime-approval-validation.md",
    fixture: "tests/fixtures/host-policy/phase5-7/runtime-approval-validation-contract.json",
    runtimeEnabled: false,
    runtimeApprovalValidationContractRecorded: true,
    runtimeApprovalEnablesRuntime: false
  });
});

test("Phase 5.8 command-exposure approval record shape is necessary but not sufficient", async () => {
  const fixture = await readJson(fixtureUrl);

  assert.deepEqual(fixture.contractSummary, {
    commandExposureApprovalContractRecorded: true,
    commandExposureApprovalRecordSchema: "ardyn.runtime-command-exposure-approval-record",
    commandExposureApprovalRecordSchemaVersion: "0.1.0",
    missingCommandExposureApprovalRejected: true,
    invalidCommandExposureApprovalRejected: true,
    revokedCommandExposureApprovalRejected: true,
    validCommandExposureApprovalRecognizedAsPrerequisiteOnly: true,
    validCommandExposureApprovalEnablesRuntime: false,
    validCommandExposureApprovalStartsRuntime: false,
    validCommandExposureApprovalExposesRuntimeExecution: false,
    validCommandExposureApprovalExposesUserRuntimeCommand: false,
    recognizedCommandIsRuntimeExecutionExposure: false,
    recognizedRuntimeCommandDefaultBlocked: true,
    runtimeEnabled: false,
    runtimeCommandEnabled: false,
    runtimeExecutionEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    approvalGrantCreated: false,
    approvalEvaluatorImplemented: false,
    requiresRemainingPhase56Preconditions: true,
    requiresSeparateRuntimeEnablementReview: true,
    canEnableRuntime: false
  });
  assert.equal(
    fixture.commandExposureApprovalRecordShape.recordKind,
    "runtime-command-exposure-approval-record"
  );
  assert.ok(
    fixture.commandExposureApprovalRecordShape.requiredTopLevelFields.includes(
      "commandExposureEffect"
    )
  );
  assert.ok(
    fixture.commandExposureApprovalRecordShape.requiredScopeFields.includes(
      "defaultBlockedCliContractDigest"
    )
  );
  assert.ok(
    fixture.commandExposureApprovalRecordShape.requiredScopeFields.includes(
      "externalReviewDispositionDigest"
    )
  );
  assert.deepEqual(
    fixture.commandExposureApprovalRecordShape.requiredCommandExposureEffectFalseFields,
    [
      "currentRecordExposesUserRuntimeCommand",
      "currentRecordEnablesRuntimeCommand",
      "currentRecordExposesRuntimeExecution",
      "additionalRuntimeCommandsRecognized",
      "commandAliasCreated"
    ]
  );
  assert.match(
    fixture.commandExposureApprovalRecordShape.validPrerequisiteRule,
    /necessary_but_not_sufficient/
  );
});

test("Phase 5.8 command-exposure approval cases reject missing invalid and revoked approval", async () => {
  const fixture = await readJson(fixtureUrl);

  assert.deepEqual(
    fixture.commandExposureApprovalCases.map((approvalCase) => approvalCase.caseId),
    expectedCaseIds
  );

  for (const approvalCase of fixture.commandExposureApprovalCases) {
    assert.equal(
      approvalCase.classification,
      expectedClassifications[approvalCase.caseId],
      approvalCase.caseId
    );
    assertAllFalse(approvalCase.commandExposureEffect);
    assertAllFalse(approvalCase.runtimeEffect);

    if (approvalCase.caseId === "valid-command-exposure-approval-prerequisite-only") {
      assert.equal(approvalCase.approvalRecordValid, true);
      assert.equal(approvalCase.rejected, false);
      assert.equal(approvalCase.prerequisiteSignalRecognized, true);
      assert.ok(approvalCase.remainingBlockers.length >= 5);
    } else {
      assert.equal(approvalCase.rejected, true, approvalCase.caseId);
      assert.equal(approvalCase.prerequisiteSignalRecognized, false, approvalCase.caseId);
      assert.ok(approvalCase.rejectionReasons.length >= 1, approvalCase.caseId);
    }
  }
});

test("Phase 5.8 valid command-exposure approval cannot imply runtime exposure", async () => {
  const fixture = await readJson(fixtureUrl);
  const validCase = fixture.commandExposureApprovalCases.find(
    (approvalCase) =>
      approvalCase.caseId === "valid-command-exposure-approval-prerequisite-only"
  );

  assert.equal(validCase.approvalRecordValid, true);
  assert.equal(validCase.prerequisiteSignalRecognized, true);
  assert.equal(validCase.commandExposureEffect.currentRecordExposesUserRuntimeCommand, false);
  assert.equal(validCase.commandExposureEffect.currentRecordEnablesRuntimeCommand, false);
  assert.equal(validCase.commandExposureEffect.currentRecordExposesRuntimeExecution, false);
  assert.equal(validCase.runtimeEffect.currentRecordEnablesRuntime, false);
  assert.equal(validCase.runtimeEffect.runtimeStarts, false);
  assert.equal(validCase.runtimeEffect.runtimeEnabled, false);
  assert.equal(validCase.runtimeEffect.runtimeCommandEnabled, false);
  assert.equal(validCase.runtimeEffect.runtimeExecutionEnabled, false);
  assert.equal(fixture.contractSummary.canEnableRuntime, false);
  assert.equal(fixture.validationRules.validCommandExposureApprovalCannotEnableRuntime, true);
  assert.equal(fixture.validationRules.validCommandExposureApprovalCannotStartRuntime, true);
  assert.equal(
    fixture.validationRules.validCommandExposureApprovalCannotExposeRuntimeExecution,
    true
  );
  assert.deepEqual(fixture.recognizedCommandBoundary.recognizedRuntimeCommandsToday, [
    "serve-runtime"
  ]);
  assert.equal(fixture.recognizedCommandBoundary.additionalRuntimeCommandsRecognizedByThisPhase, false);
  assert.equal(fixture.recognizedCommandBoundary.userRuntimeExecutionExposedToday, false);

  const mutated = structuredClone(validCase);
  mutated.commandExposureEffect.currentRecordExposesRuntimeExecution = true;
  assert.notEqual(
    mutated.commandExposureEffect.currentRecordExposesRuntimeExecution,
    validCase.commandExposureEffect.currentRecordExposesRuntimeExecution
  );
  assert.equal(fixture.contractSummary.runtimeEnabled, false);
});

test("serve-runtime remains default-blocked and dry-run cannot bypass Phase 5.8 approval contract", async () => {
  const fixture = await readJson(fixtureUrl);
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-8-command-exposure-"));

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
      assert.doesNotMatch(failure.stderr, /stack|process\.env|secret/i, label);
      assert.deepEqual(await readdir(scratch), [], `${label} should not write files`);
    }
  } finally {
    await rm(scratch, { recursive: true, force: true });
  }
});

test("Phase 5.8 command-exposure approval commands remain rejected", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-8-approval-command-probes-"));

  try {
    for (const command of commandExposureApprovalCommandProbes) {
      for (const args of [[command], [command, "--dry-run"]]) {
        const failure = await runCliFailure(args, { cwd: scratch });
        const label = args.join(" ");

        assert.notEqual(failure.code, 0, label);
        assert.equal(failure.stdout, "", label);
        assert.match(failure.stderr, /^Usage: ardyn /, label);
        assert.doesNotMatch(failure.stderr, /Runtime unavailable: serve-runtime is recognized/);
        assert.deepEqual(await readdir(scratch), [], `${label} should not write files`);
      }
    }
  } finally {
    await rm(scratch, { recursive: true, force: true });
  }
});

test("Phase 5.8 does not change CLI runtime source or add runtime primitives", async () => {
  const [{ stdout: baselineSource }, currentSource] = await Promise.all([
    execFileAsync("git", ["show", `${phase58BaselineCommit}:apps/cli/src/index.mjs`], {
      cwd: repoRoot,
      encoding: "utf8",
      maxBuffer: 1024 * 1024
    }),
    readFile(cliSourceUrl, "utf8")
  ]);

  assert.equal(currentSource, baselineSource);

  for (const forbiddenPattern of [
    /process\.stdin/,
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
    /evaluate.*approval/i
  ]) {
    assert.doesNotMatch(currentSource, forbiddenPattern);
  }
});
