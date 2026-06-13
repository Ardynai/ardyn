import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readFile, readdir, rm, mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";

const execFileAsync = promisify(execFile);
const phase514BaselineCommit = "b14e00d1ff7ac78b0feae6a5eeee171eadef4546";
const repoRootUrl = new URL("../", import.meta.url);
const repoRoot = fileURLToPath(repoRootUrl);
const cliSourceUrl = new URL("../apps/cli/src/index.mjs", import.meta.url);
const cliPath = fileURLToPath(cliSourceUrl);
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-14/runtime-rollback-kill-switch-boundary-contract.json",
  import.meta.url
);
const phase56FixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-6/runtime-enable-precondition-gate.json",
  import.meta.url
);
const phase513FixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-13/runtime-process-control-boundary-contract.json",
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
  "rollbackKillSwitchBoundaryShape",
  "rollbackKillSwitchBoundaryCases",
  "validationRules",
  "blockedRuntimeEffect",
  "serveRuntimeBlockedBehavior",
  "forbiddenBehavior",
  "filesAllowedToChange",
  "filesForbiddenToChange",
  "validationCommands"
]);

const expectedCaseIds = Object.freeze([
  "missing-rollback-kill-switch-boundary",
  "invalid-rollback-kill-switch-boundary",
  "non-deterministic-or-manual-only-rollback",
  "valid-restrictive-rollback-kill-switch-boundary-prerequisite-only"
]);
const expectedClassifications = Object.freeze({
  "missing-rollback-kill-switch-boundary":
    "missing_rollback_kill_switch_boundary_rejected",
  "invalid-rollback-kill-switch-boundary":
    "invalid_rollback_kill_switch_boundary_rejected",
  "non-deterministic-or-manual-only-rollback":
    "non_deterministic_or_manual_only_rollback_rejected",
  "valid-restrictive-rollback-kill-switch-boundary-prerequisite-only":
    "valid_restrictive_rollback_kill_switch_boundary_prerequisite_only"
});
const rollbackKillSwitchCommandProbes = Object.freeze([
  "rollback-kill-switch-boundary",
  "runtime-rollback-kill-switch",
  "runtime-rollback",
  "runtime-kill-switch",
  "validate-rollback-kill-switch-boundary",
  "grant-rollback-kill-switch-boundary",
  "rollback-runtime",
  "kill-runtime",
  "runtime-shutdown",
  "runtime-stop",
  "runtime-kill",
  "phase-5-14-runtime-rollback-kill-switch-boundary",
  "serve-runtime"
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

test("Phase 5.14 rollback/kill-switch boundary fixture is deterministic metadata", async () => {
  const raw = await readFile(fixtureUrl, "utf8");
  const fixture = JSON.parse(raw);

  assert.equal(raw.endsWith("\n"), true);
  assert.equal(raw.includes("\r"), false);
  assert.deepEqual(Object.keys(fixture), expectedTopLevelKeys);
  assert.equal(
    fixture.schema,
    "ardyn.phase-5.14.runtime-rollback-kill-switch-boundary-contract"
  );
  assert.equal(fixture.schemaVersion, "0.1.0");
  assert.equal(fixture.phase, "phase-5.14-runtime-rollback-kill-switch-boundary");
  assert.equal(fixture.artifactKind, "runtime-rollback-kill-switch-boundary-contract");
  assert.equal(fixture.metadataGeneratedAt, "1970-01-01T00:00:00.000Z");
  assert.deepEqual(fixture.sourcePhase, {
    phase: "phase-5.13-runtime-process-control-boundary",
    document: "docs/phase-5-13-runtime-process-control-boundary.md",
    fixture: "tests/fixtures/host-policy/phase5-13/runtime-process-control-boundary-contract.json",
    runtimeEnabled: false,
    processControlBoundaryImplemented: false,
    processControlBoundaryActive: false,
    rollbackKillSwitchBoundaryImplemented: false
  });
});

test("Phase 5.14 records rollback/kill-switch as necessary but not sufficient", async () => {
  const [fixture, phase56Fixture, phase513Fixture] = await Promise.all([
    readJson(fixtureUrl),
    readJson(phase56FixtureUrl),
    readJson(phase513FixtureUrl)
  ]);

  assert.equal(phase56Fixture.gateSummary.runtimeEnabled, false);
  assert.equal(phase513Fixture.contractSummary.canEnableRuntime, false);
  assert.deepEqual(fixture.contractSummary, {
    runtimeRollbackKillSwitchBoundaryRecorded: true,
    rollbackKillSwitchRequiredBeforeRuntimeEnablement: true,
    rollbackKillSwitchBoundaryImplemented: false,
    rollbackKillSwitchBoundaryActive: false,
    missingRollbackKillSwitchBoundaryRejected: true,
    invalidRollbackKillSwitchBoundaryRejected: true,
    nonDeterministicOrManualOnlyRollbackRejected: true,
    validRestrictiveRollbackKillSwitchBoundaryPrerequisiteOnly: true,
    validRestrictiveRollbackKillSwitchBoundaryEnablesRuntime: false,
    validRestrictiveRollbackKillSwitchBoundaryStartsRuntime: false,
    validRestrictiveRollbackKillSwitchBoundaryExposesRuntimeExecution: false,
    runtimeEnabled: false,
    runtimeCommandEnabled: false,
    runtimeExecutionEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    requiresSeparateRollbackKillSwitchRuntimeImplementationReview: true,
    requiresRemainingPhase56Preconditions: true,
    canEnableRuntime: false
  });
});

test("Phase 5.14 rollback/kill-switch boundary shape requires deterministic rollback", async () => {
  const fixture = await readJson(fixtureUrl);

  assert.equal(
    fixture.rollbackKillSwitchBoundaryShape.futureBoundaryKind,
    "runtime-rollback-kill-switch-boundary"
  );
  assert.equal(fixture.rollbackKillSwitchBoundaryShape.validRestrictivePrerequisiteRule, true);
  assert.ok(
    fixture.rollbackKillSwitchBoundaryShape.requiredBeforeRuntimeEnablement.includes(
      "deterministic-runtime-disable-path"
    )
  );
  assert.ok(
    fixture.rollbackKillSwitchBoundaryShape.requiredBeforeRuntimeEnablement.includes(
      "bounded-kill-switch-activation-policy"
    )
  );
  assert.ok(
    fixture.rollbackKillSwitchBoundaryShape.requiredBeforeRuntimeEnablement.includes(
      "rollback-smoke-and-verification-policy"
    )
  );
  assert.ok(
    fixture.rollbackKillSwitchBoundaryShape.rejectedBoundaryShapes.includes(
      "non-deterministic-or-manual-only-rollback"
    )
  );
  assert.ok(
    fixture.rollbackKillSwitchBoundaryShape.requiredRestrictiveControls.includes(
      "rollback-path-must-fail-before-runtime-start-on-mismatch"
    )
  );
  assert.ok(
    fixture.rollbackKillSwitchBoundaryShape.requiredRestrictiveControls.includes(
      "kill-switch-cannot-spawn-or-terminate-processes-in-this-phase"
    )
  );
  assert.deepEqual(fixture.rollbackKillSwitchBoundaryShape.falseFieldsUntilImplemented, [
    "rollbackKillSwitchBoundaryImplemented",
    "rollbackKillSwitchBoundaryActive",
    "rollbackCommandEnabled",
    "killSwitchCommandEnabled",
    "runtimeShutdownEnabled",
    "processTerminationEnabled",
    "runtimeEnablementAuthorized",
    "runtimeExecutionAuthorized"
  ]);
});

test("Phase 5.14 rollback/kill-switch cases reject unsafe rollback and keep runtime effects false", async () => {
  const fixture = await readJson(fixtureUrl);

  assert.deepEqual(
    fixture.rollbackKillSwitchBoundaryCases.map((boundaryCase) => boundaryCase.caseId),
    expectedCaseIds
  );

  for (const boundaryCase of fixture.rollbackKillSwitchBoundaryCases) {
    assert.equal(
      boundaryCase.classification,
      expectedClassifications[boundaryCase.caseId],
      boundaryCase.caseId
    );
    assert.equal(boundaryCase.rejectedForRuntimeEnablement, true, boundaryCase.caseId);
    assert.ok(boundaryCase.rejectionReasons.length >= 1, boundaryCase.caseId);
    assertAllFalse(boundaryCase.rollbackKillSwitchEffect);
    assertAllFalse(boundaryCase.runtimeEffect);
  }

  const validCase = fixture.rollbackKillSwitchBoundaryCases.find(
    (boundaryCase) =>
      boundaryCase.caseId ===
      "valid-restrictive-rollback-kill-switch-boundary-prerequisite-only"
  );
  assert.equal(validCase.rollbackKillSwitchBoundaryPresent, true);
  assert.equal(validCase.rollbackKillSwitchBoundaryValid, true);
  assert.equal(validCase.rollbackKillSwitchBoundaryRestrictive, true);
  assert.equal(validCase.prerequisiteSignalRecognized, true);
  assert.ok(validCase.rejectionReasons.includes("runtime_enable_preconditions_unsatisfied"));
  assert.equal(
    fixture.validationRules.validRestrictiveRollbackKillSwitchBoundaryCannotEnableRuntime,
    true
  );
  assert.equal(
    fixture.validationRules.validRestrictiveRollbackKillSwitchBoundaryCannotStartRuntime,
    true
  );
});

test("serve-runtime remains default-blocked and dry-run cannot bypass Phase 5.14 rollback/kill-switch boundary", async () => {
  const fixture = await readJson(fixtureUrl);
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-14-rollback-kill-switch-"));

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

test("Phase 5.14 rollback/kill-switch command names remain rejected", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-14-rollback-probes-"));
  const serveRuntimeStderr =
    "Usage: ardyn serve-runtime [--dry-run]\n" +
    "Runtime unavailable: serve-runtime is recognized, but runtime is not enabled in Phase 5.5.\n";

  try {
    for (const command of rollbackKillSwitchCommandProbes) {
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

test("Phase 5.14 does not change CLI runtime source or add rollback primitives", async () => {
  const [{ stdout: baselineSource }, currentSource] = await Promise.all([
    execFileAsync("git", ["show", `${phase514BaselineCommit}:apps/cli/src/index.mjs`], {
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
    /\bkill\s*\([^)]*runtime/i,
    /\bsignal\s*\([^)]*runtime/i,
    /\bwait\s*\([^)]*runtime/i,
    /runtimeShutdown/i,
    /rollbackKillSwitch.*enable/i,
    /rollbackCommandEnabled/i,
    /killSwitchCommandEnabled/i
  ]) {
    assert.doesNotMatch(currentSource, forbiddenPattern);
  }
});
