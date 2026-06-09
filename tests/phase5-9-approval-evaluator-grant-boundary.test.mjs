import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readFile, readdir, rm, mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";

const execFileAsync = promisify(execFile);
const phase59BaselineCommit = "bf0d7c5dde78c290f6cee3900a6e1578b09cf5ef";
const repoRootUrl = new URL("../", import.meta.url);
const repoRoot = fileURLToPath(repoRootUrl);
const cliSourceUrl = new URL("../apps/cli/src/index.mjs", import.meta.url);
const cliPath = fileURLToPath(cliSourceUrl);
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-9/approval-evaluator-grant-boundary-contract.json",
  import.meta.url
);
const phase57FixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-7/runtime-approval-validation-contract.json",
  import.meta.url
);
const phase58FixtureUrl = new URL(
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
  "boundarySignals",
  "evaluatorGrantBoundaryShape",
  "boundaryCases",
  "validationRules",
  "blockedRuntimeEffect",
  "serveRuntimeBlockedBehavior",
  "forbiddenBehavior",
  "filesAllowedToChange",
  "filesForbiddenToChange",
  "validationCommands"
]);

const expectedCaseIds = Object.freeze([
  "valid-runtime-approval-only",
  "valid-command-exposure-approval-only",
  "valid-approval-signals-no-evaluator",
  "fake-grant-attempt"
]);
const expectedClassifications = Object.freeze({
  "valid-runtime-approval-only": "runtime_approval_prerequisite_only_evaluator_absent",
  "valid-command-exposure-approval-only":
    "command_exposure_prerequisite_only_evaluator_absent",
  "valid-approval-signals-no-evaluator": "combined_prerequisites_no_evaluator_no_grant",
  "fake-grant-attempt": "fake_grant_attempt_rejected"
});
const evaluatorGrantCommandProbes = Object.freeze([
  "approval-evaluator",
  "runtime-approval-evaluator",
  "evaluate-runtime-approval",
  "approval-grant",
  "runtime-approval-grant",
  "grant-runtime",
  "approval-evaluator-grant-boundary",
  "phase-5-9-approval-evaluator-grant-boundary"
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

test("Phase 5.9 approval evaluator/grant fixture is deterministic metadata", async () => {
  const raw = await readFile(fixtureUrl, "utf8");
  const fixture = JSON.parse(raw);

  assert.equal(raw.endsWith("\n"), true);
  assert.equal(raw.includes("\r"), false);
  assert.deepEqual(Object.keys(fixture), expectedTopLevelKeys);
  assert.equal(fixture.schema, "ardyn.phase-5.9.approval-evaluator-grant-boundary-contract");
  assert.equal(fixture.schemaVersion, "0.1.0");
  assert.equal(fixture.phase, "phase-5.9-approval-evaluator-grant-boundary");
  assert.equal(fixture.artifactKind, "approval-evaluator-grant-boundary-contract");
  assert.equal(fixture.metadataGeneratedAt, "1970-01-01T00:00:00.000Z");
  assert.deepEqual(fixture.sourcePhase, {
    phase: "phase-5.8-runtime-command-exposure-approval",
    document: "docs/phase-5-8-runtime-command-exposure-approval.md",
    fixture:
      "tests/fixtures/command-surface/phase5-8/runtime-command-exposure-approval-contract.json",
    runtimeEnabled: false,
    runtimeApprovalPrerequisiteOnly: true,
    commandExposureApprovalPrerequisiteOnly: true,
    approvalEvaluatorImplemented: false,
    approvalGrantCreated: false
  });
});

test("Phase 5.9 separates prerequisite signals from evaluator and grant authority", async () => {
  const [fixture, runtimeApprovalFixture, commandExposureFixture] = await Promise.all([
    readJson(fixtureUrl),
    readJson(phase57FixtureUrl),
    readJson(phase58FixtureUrl)
  ]);
  const runtimeApprovalCase = runtimeApprovalFixture.approvalCases.find(
    (approvalCase) => approvalCase.caseId === "valid-approval-prerequisite-only"
  );
  const commandExposureCase = commandExposureFixture.commandExposureApprovalCases.find(
    (approvalCase) =>
      approvalCase.caseId === "valid-command-exposure-approval-prerequisite-only"
  );

  assert.equal(runtimeApprovalCase.approvalRecordValid, true);
  assert.equal(runtimeApprovalCase.prerequisiteSignalRecognized, true);
  assert.equal(runtimeApprovalCase.runtimeEffect.approvalGrantCreated, false);
  assert.equal(commandExposureCase.approvalRecordValid, true);
  assert.equal(commandExposureCase.prerequisiteSignalRecognized, true);
  assert.equal(commandExposureCase.runtimeEffect.approvalGrantCreated, false);

  assert.deepEqual(fixture.contractSummary, {
    approvalEvaluatorGrantBoundaryRecorded: true,
    runtimeApprovalPrerequisiteOnly: true,
    commandExposureApprovalPrerequisiteOnly: true,
    combinedApprovalSignalsPrerequisiteOnly: true,
    approvalEvaluatorImplemented: false,
    approvalGrantProduced: false,
    approvalGrantSchema: "ardyn.runtime-approval-grant",
    approvalGrantSchemaVersion: "not-implemented",
    validRuntimeApprovalCreatesEvaluator: false,
    validCommandExposureApprovalCreatesEvaluator: false,
    validApprovalSignalsCreateGrant: false,
    validApprovalSignalsEnableRuntime: false,
    validApprovalSignalsStartRuntime: false,
    validApprovalSignalsExposeRuntimeExecution: false,
    runtimeEnabled: false,
    runtimeCommandEnabled: false,
    runtimeExecutionEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    requiresSeparateEvaluatorImplementationReview: true,
    requiresRemainingPhase56Preconditions: true,
    canEnableRuntime: false
  });
  assert.equal(fixture.boundarySignals.runtimeApprovalRecord.recognizedAsPrerequisite, true);
  assert.equal(fixture.boundarySignals.runtimeApprovalRecord.createsEvaluator, false);
  assert.equal(fixture.boundarySignals.commandExposureApprovalRecord.recognizedAsPrerequisite, true);
  assert.equal(fixture.boundarySignals.commandExposureApprovalRecord.createsGrant, false);
  assert.equal(fixture.boundarySignals.combinedPrerequisiteState.allPrerequisiteSignalsRecognized, true);
  assert.equal(fixture.boundarySignals.combinedPrerequisiteState.evaluatorAvailable, false);
  assert.equal(fixture.boundarySignals.combinedPrerequisiteState.grantAvailable, false);
});

test("Phase 5.9 boundary shape requires a future evaluator before any grant", async () => {
  const fixture = await readJson(fixtureUrl);

  assert.equal(
    fixture.evaluatorGrantBoundaryShape.futureEvaluatorKind,
    "runtime-approval-evaluator"
  );
  assert.equal(fixture.evaluatorGrantBoundaryShape.futureGrantKind, "runtime-approval-grant");
  assert.ok(
    fixture.evaluatorGrantBoundaryShape.requiredBeforeImplementation.includes(
      "separate-evaluator-design-review"
    )
  );
  assert.ok(
    fixture.evaluatorGrantBoundaryShape.requiredEvaluatorInputSignals.includes(
      "valid-runtime-approval-record"
    )
  );
  assert.ok(
    fixture.evaluatorGrantBoundaryShape.requiredEvaluatorInputSignals.includes(
      "valid-command-exposure-approval-record"
    )
  );
  assert.deepEqual(fixture.evaluatorGrantBoundaryShape.requiredGrantFalseFieldsUntilImplemented, [
    "grantProduced",
    "grantPersisted",
    "grantEvaluated",
    "grantRevocationChecked",
    "runtimeEnablementAuthorized",
    "runtimeCommandAuthorized",
    "runtimeExecutionAuthorized"
  ]);
  assert.match(
    fixture.evaluatorGrantBoundaryShape.validPrerequisiteRule,
    /must_not_create_evaluator_grant_or_runtime_enablement/
  );
});

test("Phase 5.9 boundary cases keep evaluator grant and runtime effects false", async () => {
  const fixture = await readJson(fixtureUrl);

  assert.deepEqual(
    fixture.boundaryCases.map((boundaryCase) => boundaryCase.caseId),
    expectedCaseIds
  );

  for (const boundaryCase of fixture.boundaryCases) {
    assert.equal(
      boundaryCase.classification,
      expectedClassifications[boundaryCase.caseId],
      boundaryCase.caseId
    );
    assert.equal(boundaryCase.prerequisiteSignalRecognized, true, boundaryCase.caseId);
    assert.equal(boundaryCase.rejectedForRuntimeEnablement, true, boundaryCase.caseId);
    assert.ok(boundaryCase.rejectionReasons.length >= 2, boundaryCase.caseId);
    assertAllFalse(boundaryCase.evaluatorEffect);
    assertAllFalse(boundaryCase.runtimeEffect);
  }

  const combinedCase = fixture.boundaryCases.find(
    (boundaryCase) => boundaryCase.caseId === "valid-approval-signals-no-evaluator"
  );
  assert.equal(combinedCase.runtimeApprovalValid, true);
  assert.equal(combinedCase.commandExposureApprovalValid, true);
  assert.ok(combinedCase.rejectionReasons.includes("approval_evaluator_not_implemented"));
  assert.ok(combinedCase.rejectionReasons.includes("approval_grant_not_produced"));

  const fakeGrantCase = fixture.boundaryCases.find(
    (boundaryCase) => boundaryCase.caseId === "fake-grant-attempt"
  );
  assert.ok(fakeGrantCase.rejectionReasons.includes("grant_schema_not_implemented"));
  assert.equal(fixture.validationRules.validApprovalSignalsCannotCreateEvaluator, true);
  assert.equal(fixture.validationRules.validApprovalSignalsCannotProduceGrant, true);
  assert.equal(fixture.validationRules.validApprovalSignalsCannotEnableRuntime, true);
  assert.equal(fixture.validationRules.validApprovalSignalsCannotStartRuntime, true);
});

test("serve-runtime remains default-blocked and dry-run cannot bypass Phase 5.9 boundary", async () => {
  const fixture = await readJson(fixtureUrl);
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-9-evaluator-boundary-"));

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

test("Phase 5.9 evaluator and grant command names remain rejected", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-9-evaluator-command-probes-"));

  try {
    for (const command of evaluatorGrantCommandProbes) {
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

test("Phase 5.9 does not change CLI runtime source or add runtime primitives", async () => {
  const [{ stdout: baselineSource }, currentSource] = await Promise.all([
    execFileAsync("git", ["show", `${phase59BaselineCommit}:apps/cli/src/index.mjs`], {
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
