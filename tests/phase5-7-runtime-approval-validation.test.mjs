import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readFile, readdir, rm, mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";

const execFileAsync = promisify(execFile);
const phase57BaselineCommit = "090924f49f305dfaf1d38e41edf9293c744873f3";
const repoRootUrl = new URL("../", import.meta.url);
const repoRoot = fileURLToPath(repoRootUrl);
const cliSourceUrl = new URL("../apps/cli/src/index.mjs", import.meta.url);
const cliPath = fileURLToPath(cliSourceUrl);
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-7/runtime-approval-validation-contract.json",
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
  "approvalRecordShape",
  "approvalCases",
  "validationRules",
  "blockedRuntimeEffect",
  "serveRuntimeBlockedBehavior",
  "forbiddenBehavior",
  "filesAllowedToChange",
  "filesForbiddenToChange",
  "validationCommands"
]);

const expectedCaseIds = Object.freeze([
  "missing-approval",
  "invalid-approval",
  "revoked-approval",
  "valid-approval-prerequisite-only"
]);
const expectedClassifications = Object.freeze({
  "missing-approval": "missing_approval_rejected",
  "invalid-approval": "invalid_approval_rejected",
  "revoked-approval": "revoked_approval_rejected",
  "valid-approval-prerequisite-only": "valid_prerequisite_signal_runtime_still_blocked"
});

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

test("Phase 5.7 approval validation fixture is deterministic metadata", async () => {
  const raw = await readFile(fixtureUrl, "utf8");
  const fixture = JSON.parse(raw);

  assert.equal(raw.endsWith("\n"), true);
  assert.equal(raw.includes("\r"), false);
  assert.deepEqual(Object.keys(fixture), expectedTopLevelKeys);
  assert.equal(fixture.schema, "ardyn.phase-5.7.runtime-approval-validation-contract");
  assert.equal(fixture.schemaVersion, "0.1.0");
  assert.equal(fixture.phase, "phase-5.7-runtime-approval-validation");
  assert.equal(fixture.artifactKind, "runtime-approval-validation-contract");
  assert.equal(fixture.metadataGeneratedAt, "1970-01-01T00:00:00.000Z");
  assert.deepEqual(fixture.sourcePhase, {
    phase: "phase-5.6-runtime-enable-preconditions",
    document: "docs/phase-5-6-runtime-enable-preconditions.md",
    fixture: "tests/fixtures/host-policy/phase5-6/runtime-enable-precondition-gate.json",
    runtimeEnabled: false,
    runtimeEnablementGateSatisfied: false
  });
});

test("Phase 5.7 approval record shape is necessary but not sufficient", async () => {
  const fixture = await readJson(fixtureUrl);

  assert.deepEqual(fixture.contractSummary, {
    approvalValidationContractRecorded: true,
    approvalRecordSchema: "ardyn.runtime-approval-record",
    approvalRecordSchemaVersion: "0.1.0",
    missingApprovalRejected: true,
    invalidApprovalRejected: true,
    revokedApprovalRejected: true,
    validApprovalRecognizedAsPrerequisiteOnly: true,
    validApprovalEnablesRuntime: false,
    validApprovalStartsRuntime: false,
    runtimeEnabled: false,
    runtimeCommandEnabled: false,
    runtimeExecutionEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    approvalGrantCreated: false,
    approvalEvaluatorImplemented: false,
    requiresRemainingPhase56Preconditions: true,
    canEnableRuntime: false
  });
  assert.equal(fixture.approvalRecordShape.recordKind, "runtime-approval-record");
  assert.ok(fixture.approvalRecordShape.requiredTopLevelFields.includes("revocation"));
  assert.ok(fixture.approvalRecordShape.requiredTopLevelFields.includes("runtimeEffect"));
  assert.ok(fixture.approvalRecordShape.requiredScopeFields.includes("hostPolicyDigest"));
  assert.ok(fixture.approvalRecordShape.requiredRevocationFields.includes("revoked"));
  assert.deepEqual(fixture.approvalRecordShape.requiredRuntimeEffectFalseFields, [
    "currentRecordEnablesRuntime",
    "runtimeStarts",
    "runtimeEnabled",
    "runtimeCommandEnabled",
    "runtimeExecutionEnabled",
    "approvalGrantCreated"
  ]);
  assert.match(fixture.approvalRecordShape.validPrerequisiteRule, /necessary_but_not_sufficient/);
});

test("Phase 5.7 approval cases reject missing invalid and revoked approval", async () => {
  const fixture = await readJson(fixtureUrl);

  assert.deepEqual(
    fixture.approvalCases.map((approvalCase) => approvalCase.caseId),
    expectedCaseIds
  );

  for (const approvalCase of fixture.approvalCases) {
    assert.equal(
      approvalCase.classification,
      expectedClassifications[approvalCase.caseId],
      approvalCase.caseId
    );
    assertAllFalse(approvalCase.runtimeEffect);

    if (approvalCase.caseId === "valid-approval-prerequisite-only") {
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

test("Phase 5.7 valid approval cannot imply runtime enablement", async () => {
  const fixture = await readJson(fixtureUrl);
  const validCase = fixture.approvalCases.find(
    (approvalCase) => approvalCase.caseId === "valid-approval-prerequisite-only"
  );

  assert.equal(validCase.approvalRecordValid, true);
  assert.equal(validCase.prerequisiteSignalRecognized, true);
  assert.equal(validCase.runtimeEffect.currentRecordEnablesRuntime, false);
  assert.equal(validCase.runtimeEffect.runtimeStarts, false);
  assert.equal(validCase.runtimeEffect.runtimeEnabled, false);
  assert.equal(validCase.runtimeEffect.runtimeCommandEnabled, false);
  assert.equal(validCase.runtimeEffect.runtimeExecutionEnabled, false);
  assert.equal(fixture.contractSummary.canEnableRuntime, false);
  assert.equal(fixture.validationRules.validApprovalCannotEnableRuntime, true);
  assert.equal(fixture.validationRules.validApprovalCannotStartRuntime, true);
  assert.equal(fixture.validationRules.validApprovalCannotExposeCommand, true);

  const mutated = structuredClone(validCase);
  mutated.runtimeEffect.runtimeEnabled = true;
  assert.notEqual(mutated.runtimeEffect.runtimeEnabled, validCase.runtimeEffect.runtimeEnabled);
  assert.equal(fixture.contractSummary.runtimeEnabled, false);
});

test("serve-runtime remains default-blocked and dry-run cannot bypass Phase 5.7 approval contract", async () => {
  const fixture = await readJson(fixtureUrl);
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-7-runtime-approval-"));

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

test("Phase 5.7 does not change CLI runtime source or add runtime primitives", async () => {
  const [{ stdout: baselineSource }, currentSource] = await Promise.all([
    execFileAsync("git", ["show", `${phase57BaselineCommit}:apps/cli/src/index.mjs`], {
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
