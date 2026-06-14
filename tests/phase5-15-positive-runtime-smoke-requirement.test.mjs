import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readFile, readdir, rm, mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";

const execFileAsync = promisify(execFile);
const phase515BaselineCommit = "b35577d38b7fa09a591291c6895e131ade18db54";
const repoRootUrl = new URL("../", import.meta.url);
const repoRoot = fileURLToPath(repoRootUrl);
const cliSourceUrl = new URL("../apps/cli/src/index.mjs", import.meta.url);
const cliPath = fileURLToPath(cliSourceUrl);
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-15/positive-runtime-smoke-requirement-contract.json",
  import.meta.url
);
const phase56FixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-6/runtime-enable-precondition-gate.json",
  import.meta.url
);
const phase514FixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-14/runtime-rollback-kill-switch-boundary-contract.json",
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
  "positiveRuntimeSmokeRequirementShape",
  "positiveRuntimeSmokeRequirementCases",
  "validationRules",
  "blockedRuntimeEffect",
  "serveRuntimeBlockedBehavior",
  "forbiddenBehavior",
  "filesAllowedToChange",
  "filesForbiddenToChange",
  "validationCommands"
]);

const expectedCaseIds = Object.freeze([
  "missing-positive-runtime-smoke-coverage",
  "invalid-positive-runtime-smoke-coverage",
  "non-guarded-or-non-deterministic-runtime-smoke-coverage",
  "valid-positive-runtime-smoke-coverage-prerequisite-only"
]);
const expectedClassifications = Object.freeze({
  "missing-positive-runtime-smoke-coverage":
    "missing_positive_runtime_smoke_coverage_rejected",
  "invalid-positive-runtime-smoke-coverage":
    "invalid_positive_runtime_smoke_coverage_rejected",
  "non-guarded-or-non-deterministic-runtime-smoke-coverage":
    "non_guarded_or_non_deterministic_runtime_smoke_coverage_rejected",
  "valid-positive-runtime-smoke-coverage-prerequisite-only":
    "valid_positive_runtime_smoke_coverage_prerequisite_only"
});
const positiveRuntimeSmokeCommandProbes = Object.freeze([
  "positive-runtime-smoke",
  "positive-runtime-smoke-requirement",
  "runtime-positive-smoke",
  "runtime-smoke",
  "runtime-smoke-requirement",
  "validate-positive-runtime-smoke",
  "grant-positive-runtime-smoke",
  "run-positive-runtime-smoke",
  "run-runtime-smoke",
  "smoke-runtime",
  "guarded-runtime-smoke",
  "phase-5-15-positive-runtime-smoke-requirement",
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

test("Phase 5.15 positive runtime smoke requirement fixture is deterministic metadata", async () => {
  const raw = await readFile(fixtureUrl, "utf8");
  const fixture = JSON.parse(raw);

  assert.equal(raw.endsWith("\n"), true);
  assert.equal(raw.includes("\r"), false);
  assert.deepEqual(Object.keys(fixture), expectedTopLevelKeys);
  assert.equal(
    fixture.schema,
    "ardyn.phase-5.15.positive-runtime-smoke-requirement-contract"
  );
  assert.equal(fixture.schemaVersion, "0.1.0");
  assert.equal(fixture.phase, "phase-5.15-positive-runtime-smoke-requirement");
  assert.equal(fixture.artifactKind, "positive-runtime-smoke-requirement-contract");
  assert.equal(fixture.metadataGeneratedAt, "1970-01-01T00:00:00.000Z");
  assert.deepEqual(fixture.sourcePhase, {
    phase: "phase-5.14-runtime-rollback-kill-switch-boundary",
    document: "docs/phase-5-14-runtime-rollback-kill-switch-boundary.md",
    fixture:
      "tests/fixtures/host-policy/phase5-14/runtime-rollback-kill-switch-boundary-contract.json",
    runtimeEnabled: false,
    rollbackKillSwitchBoundaryImplemented: false,
    rollbackKillSwitchBoundaryActive: false,
    positiveRuntimeSmokeCoverageImplemented: false
  });
});

test("Phase 5.15 records positive runtime smoke coverage as necessary but not sufficient", async () => {
  const [fixture, phase56Fixture, phase514Fixture] = await Promise.all([
    readJson(fixtureUrl),
    readJson(phase56FixtureUrl),
    readJson(phase514FixtureUrl)
  ]);

  assert.equal(phase56Fixture.gateSummary.runtimeEnabled, false);
  assert.equal(phase514Fixture.contractSummary.canEnableRuntime, false);
  assert.deepEqual(fixture.contractSummary, {
    positiveRuntimeSmokeRequirementRecorded: true,
    positiveRuntimeSmokeCoverageRequiredBeforeRuntimeEnablement: true,
    positiveRuntimeSmokeCoverageImplemented: false,
    positiveRuntimeSmokeCoverageActive: false,
    missingPositiveRuntimeSmokeCoverageRejected: true,
    invalidPositiveRuntimeSmokeCoverageRejected: true,
    nonGuardedOrNonDeterministicRuntimeSmokeCoverageRejected: true,
    validPositiveRuntimeSmokeCoveragePrerequisiteOnly: true,
    validPositiveRuntimeSmokeCoverageEnablesRuntime: false,
    validPositiveRuntimeSmokeCoverageStartsRuntime: false,
    validPositiveRuntimeSmokeCoverageExposesRuntimeExecution: false,
    validPositiveRuntimeSmokeCoverageRunsRuntime: false,
    runtimeEnabled: false,
    runtimeCommandEnabled: false,
    runtimeExecutionEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    requiresSeparatePositiveRuntimeSmokeImplementationReview: true,
    requiresRemainingPhase56Preconditions: true,
    canEnableRuntime: false
  });
});

test("Phase 5.15 positive runtime smoke shape requires guarded deterministic coverage", async () => {
  const fixture = await readJson(fixtureUrl);

  assert.equal(
    fixture.positiveRuntimeSmokeRequirementShape.futureRequirementKind,
    "positive-runtime-smoke-requirement"
  );
  assert.equal(
    fixture.positiveRuntimeSmokeRequirementShape.validPrerequisiteSignalRule,
    true
  );
  assert.ok(
    fixture.positiveRuntimeSmokeRequirementShape.requiredBeforeRuntimeEnablement.includes(
      "guarded-runtime-smoke-plan"
    )
  );
  assert.ok(
    fixture.positiveRuntimeSmokeRequirementShape.requiredBeforeRuntimeEnablement.includes(
      "deterministic-smoke-input-fixture"
    )
  );
  assert.ok(
    fixture.positiveRuntimeSmokeRequirementShape.requiredBeforeRuntimeEnablement.includes(
      "positive-runtime-smoke-coverage-review"
    )
  );
  assert.ok(
    fixture.positiveRuntimeSmokeRequirementShape.rejectedRequirementShapes.includes(
      "non-guarded-or-non-deterministic-runtime-smoke-coverage"
    )
  );
  assert.ok(
    fixture.positiveRuntimeSmokeRequirementShape.requiredRestrictiveControls.includes(
      "smoke-coverage-cannot-run-runtime-in-this-phase"
    )
  );
  assert.deepEqual(fixture.positiveRuntimeSmokeRequirementShape.falseFieldsUntilImplemented, [
    "positiveRuntimeSmokeCoverageImplemented",
    "positiveRuntimeSmokeCoverageActive",
    "positiveRuntimeSmokeExecuted",
    "positiveRuntimeSmokePassed",
    "runtimeSmokeCommandEnabled",
    "runtimeEnablementAuthorized",
    "runtimeExecutionAuthorized"
  ]);
});

test("Phase 5.15 positive runtime smoke cases reject unsafe coverage and keep runtime effects false", async () => {
  const fixture = await readJson(fixtureUrl);

  assert.deepEqual(
    fixture.positiveRuntimeSmokeRequirementCases.map((requirementCase) => requirementCase.caseId),
    expectedCaseIds
  );

  for (const requirementCase of fixture.positiveRuntimeSmokeRequirementCases) {
    assert.equal(
      requirementCase.classification,
      expectedClassifications[requirementCase.caseId],
      requirementCase.caseId
    );
    assert.equal(requirementCase.rejectedForRuntimeEnablement, true, requirementCase.caseId);
    assert.ok(requirementCase.rejectionReasons.length >= 1, requirementCase.caseId);
    assertAllFalse(requirementCase.positiveRuntimeSmokeEffect);
    assertAllFalse(requirementCase.runtimeEffect);
  }

  const validCase = fixture.positiveRuntimeSmokeRequirementCases.find(
    (requirementCase) =>
      requirementCase.caseId ===
      "valid-positive-runtime-smoke-coverage-prerequisite-only"
  );
  assert.equal(validCase.positiveRuntimeSmokeCoveragePresent, true);
  assert.equal(validCase.positiveRuntimeSmokeCoverageValid, true);
  assert.equal(validCase.positiveRuntimeSmokeCoverageGuarded, true);
  assert.equal(validCase.positiveRuntimeSmokeCoverageDeterministic, true);
  assert.equal(validCase.prerequisiteSignalRecognized, true);
  assert.ok(validCase.rejectionReasons.includes("runtime_enable_preconditions_unsatisfied"));
  assert.equal(
    fixture.validationRules.validPositiveRuntimeSmokeCoverageCannotEnableRuntime,
    true
  );
  assert.equal(
    fixture.validationRules.validPositiveRuntimeSmokeCoverageCannotStartRuntime,
    true
  );
});

test("serve-runtime remains default-blocked and dry-run cannot bypass Phase 5.15 positive runtime smoke requirement", async () => {
  const fixture = await readJson(fixtureUrl);
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-15-positive-smoke-"));

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

test("Phase 5.15 positive runtime smoke command names remain rejected", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-15-positive-smoke-probes-"));
  const serveRuntimeStderr =
    "Usage: ardyn serve-runtime [--dry-run]\n" +
    "Runtime unavailable: serve-runtime is recognized, but runtime is not enabled in Phase 5.5.\n";

  try {
    for (const command of positiveRuntimeSmokeCommandProbes) {
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

test("Phase 5.15 does not change CLI runtime source or add smoke primitives", async () => {
  const [{ stdout: baselineSource }, currentSource] = await Promise.all([
    execFileAsync("git", ["show", `${phase515BaselineCommit}:apps/cli/src/index.mjs`], {
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
    /positiveRuntimeSmoke/i,
    /runtimeSmoke/i,
    /smokeRuntime/i,
    /positive-runtime-smoke/
  ]) {
    assert.doesNotMatch(currentSource, forbiddenPattern);
  }
});
