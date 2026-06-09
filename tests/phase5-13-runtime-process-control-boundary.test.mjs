import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readFile, readdir, rm, mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";

const execFileAsync = promisify(execFile);
const phase513BaselineCommit = "995a2ccbb5f88a5e759af84fcb67ccc802ddd1ed";
const repoRootUrl = new URL("../", import.meta.url);
const repoRoot = fileURLToPath(repoRootUrl);
const cliSourceUrl = new URL("../apps/cli/src/index.mjs", import.meta.url);
const cliPath = fileURLToPath(cliSourceUrl);
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-13/runtime-process-control-boundary-contract.json",
  import.meta.url
);
const phase56FixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-6/runtime-enable-precondition-gate.json",
  import.meta.url
);
const phase512FixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-12/runtime-transcript-audit-confinement-boundary-contract.json",
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
  "processControlBoundaryShape",
  "processControlBoundaryCases",
  "validationRules",
  "blockedRuntimeEffect",
  "serveRuntimeBlockedBehavior",
  "forbiddenBehavior",
  "filesAllowedToChange",
  "filesForbiddenToChange",
  "validationCommands"
]);

const expectedCaseIds = Object.freeze([
  "missing-process-control-boundary",
  "invalid-process-control-boundary",
  "unbounded-process-spawning-termination-supervision",
  "valid-restrictive-process-control-boundary-prerequisite-only"
]);
const expectedClassifications = Object.freeze({
  "missing-process-control-boundary": "missing_process_control_boundary_rejected",
  "invalid-process-control-boundary": "invalid_process_control_boundary_rejected",
  "unbounded-process-spawning-termination-supervision":
    "unbounded_process_spawning_termination_supervision_rejected",
  "valid-restrictive-process-control-boundary-prerequisite-only":
    "valid_restrictive_process_control_boundary_prerequisite_only"
});
const processControlCommandProbes = Object.freeze([
  "process-control-boundary",
  "runtime-process-control",
  "runtime-process-control-boundary",
  "validate-process-control-boundary",
  "grant-process-control-boundary",
  "process-control",
  "runtime-supervision",
  "runtime-process-supervision",
  "runtime-process-spawn",
  "runtime-process-termination",
  "phase-5-13-runtime-process-control-boundary",
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

test("Phase 5.13 runtime process-control boundary fixture is deterministic metadata", async () => {
  const raw = await readFile(fixtureUrl, "utf8");
  const fixture = JSON.parse(raw);

  assert.equal(raw.endsWith("\n"), true);
  assert.equal(raw.includes("\r"), false);
  assert.deepEqual(Object.keys(fixture), expectedTopLevelKeys);
  assert.equal(fixture.schema, "ardyn.phase-5.13.runtime-process-control-boundary-contract");
  assert.equal(fixture.schemaVersion, "0.1.0");
  assert.equal(fixture.phase, "phase-5.13-runtime-process-control-boundary");
  assert.equal(fixture.artifactKind, "runtime-process-control-boundary-contract");
  assert.equal(fixture.metadataGeneratedAt, "1970-01-01T00:00:00.000Z");
  assert.deepEqual(fixture.sourcePhase, {
    phase: "phase-5.12-runtime-transcript-audit-boundary",
    document: "docs/phase-5-12-runtime-transcript-audit-boundary.md",
    fixture:
      "tests/fixtures/host-policy/phase5-12/runtime-transcript-audit-confinement-boundary-contract.json",
    runtimeEnabled: false,
    transcriptAuditConfinementImplemented: false,
    transcriptAuditConfinementActive: false,
    processControlBoundaryImplemented: false
  });
});

test("Phase 5.13 records process control as necessary but not sufficient", async () => {
  const [fixture, phase56Fixture, phase512Fixture] = await Promise.all([
    readJson(fixtureUrl),
    readJson(phase56FixtureUrl),
    readJson(phase512FixtureUrl)
  ]);

  assert.equal(phase56Fixture.gateSummary.runtimeEnabled, false);
  assert.equal(phase512Fixture.contractSummary.canEnableRuntime, false);
  assert.deepEqual(fixture.contractSummary, {
    runtimeProcessControlBoundaryRecorded: true,
    processControlRequiredBeforeRuntimeEnablement: true,
    processControlBoundaryImplemented: false,
    processControlBoundaryActive: false,
    missingProcessControlBoundaryRejected: true,
    invalidProcessControlBoundaryRejected: true,
    unboundedProcessSpawningTerminationSupervisionRejected: true,
    validRestrictiveProcessControlBoundaryPrerequisiteOnly: true,
    validRestrictiveProcessControlBoundaryEnablesRuntime: false,
    validRestrictiveProcessControlBoundaryStartsRuntime: false,
    validRestrictiveProcessControlBoundaryExposesRuntimeExecution: false,
    runtimeEnabled: false,
    runtimeCommandEnabled: false,
    runtimeExecutionEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    requiresSeparateProcessControlRuntimeImplementationReview: true,
    requiresRemainingPhase56Preconditions: true,
    canEnableRuntime: false
  });
});

test("Phase 5.13 process-control boundary shape requires bounded process ownership", async () => {
  const fixture = await readJson(fixtureUrl);

  assert.equal(
    fixture.processControlBoundaryShape.futureBoundaryKind,
    "runtime-process-control-boundary"
  );
  assert.equal(fixture.processControlBoundaryShape.validRestrictivePrerequisiteRule, true);
  assert.ok(
    fixture.processControlBoundaryShape.requiredBeforeRuntimeEnablement.includes(
      "bounded-process-spawn-policy"
    )
  );
  assert.ok(
    fixture.processControlBoundaryShape.requiredBeforeRuntimeEnablement.includes(
      "bounded-process-termination-policy"
    )
  );
  assert.ok(
    fixture.processControlBoundaryShape.requiredBeforeRuntimeEnablement.includes(
      "bounded-runtime-supervision-policy"
    )
  );
  assert.ok(
    fixture.processControlBoundaryShape.rejectedBoundaryShapes.includes(
      "unbounded-process-spawning-termination-supervision"
    )
  );
  assert.ok(
    fixture.processControlBoundaryShape.requiredRestrictiveControls.includes(
      "no-process-spawn-before-explicit-runtime-approval"
    )
  );
  assert.ok(
    fixture.processControlBoundaryShape.requiredRestrictiveControls.includes(
      "deny-shell-string-process-control"
    )
  );
  assert.deepEqual(fixture.processControlBoundaryShape.falseFieldsUntilImplemented, [
    "processControlBoundaryImplemented",
    "processControlBoundaryActive",
    "processSpawnEnabled",
    "processTerminationEnabled",
    "runtimeSupervisionEnabled",
    "runtimeEnablementAuthorized",
    "runtimeExecutionAuthorized"
  ]);
});

test("Phase 5.13 process-control cases reject unsafe supervision and keep runtime effects false", async () => {
  const fixture = await readJson(fixtureUrl);

  assert.deepEqual(
    fixture.processControlBoundaryCases.map((boundaryCase) => boundaryCase.caseId),
    expectedCaseIds
  );

  for (const boundaryCase of fixture.processControlBoundaryCases) {
    assert.equal(
      boundaryCase.classification,
      expectedClassifications[boundaryCase.caseId],
      boundaryCase.caseId
    );
    assert.equal(boundaryCase.rejectedForRuntimeEnablement, true, boundaryCase.caseId);
    assert.ok(boundaryCase.rejectionReasons.length >= 1, boundaryCase.caseId);
    assertAllFalse(boundaryCase.processControlEffect);
    assertAllFalse(boundaryCase.runtimeEffect);
  }

  const validCase = fixture.processControlBoundaryCases.find(
    (boundaryCase) =>
      boundaryCase.caseId ===
      "valid-restrictive-process-control-boundary-prerequisite-only"
  );
  assert.equal(validCase.processControlBoundaryPresent, true);
  assert.equal(validCase.processControlBoundaryValid, true);
  assert.equal(validCase.processControlBoundaryRestrictive, true);
  assert.equal(validCase.prerequisiteSignalRecognized, true);
  assert.ok(validCase.rejectionReasons.includes("runtime_enable_preconditions_unsatisfied"));
  assert.equal(
    fixture.validationRules.validRestrictiveProcessControlBoundaryCannotEnableRuntime,
    true
  );
  assert.equal(
    fixture.validationRules.validRestrictiveProcessControlBoundaryCannotStartRuntime,
    true
  );
});

test("serve-runtime remains default-blocked and dry-run cannot bypass Phase 5.13 process-control boundary", async () => {
  const fixture = await readJson(fixtureUrl);
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-13-process-control-"));

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

test("Phase 5.13 process-control command names remain rejected", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-13-process-control-probes-"));
  const serveRuntimeStderr =
    "Usage: ardyn serve-runtime [--dry-run]\n" +
    "Runtime unavailable: serve-runtime is recognized, but runtime is not enabled in Phase 5.5.\n";

  try {
    for (const command of processControlCommandProbes) {
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

test("Phase 5.13 does not change CLI runtime source or add process-control primitives", async () => {
  const [{ stdout: baselineSource }, currentSource] = await Promise.all([
    execFileAsync("git", ["show", `${phase513BaselineCommit}:apps/cli/src/index.mjs`], {
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
    /runtimeSupervision/i,
    /processControl.*enable/i,
    /processSpawnEnabled/i,
    /processTerminationEnabled/i
  ]) {
    assert.doesNotMatch(currentSource, forbiddenPattern);
  }
});
