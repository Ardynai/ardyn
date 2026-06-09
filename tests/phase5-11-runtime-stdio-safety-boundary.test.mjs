import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readFile, readdir, rm, mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";

const execFileAsync = promisify(execFile);
const phase511BaselineCommit = "51318ca1238209edc546d5555ddf3e5f8f1ba076";
const repoRootUrl = new URL("../", import.meta.url);
const repoRoot = fileURLToPath(repoRootUrl);
const cliSourceUrl = new URL("../apps/cli/src/index.mjs", import.meta.url);
const cliPath = fileURLToPath(cliSourceUrl);
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-11/runtime-stdio-safety-boundary-contract.json",
  import.meta.url
);
const phase56FixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-6/runtime-enable-precondition-gate.json",
  import.meta.url
);
const phase510FixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-10/runtime-host-policy-enforcement-boundary-contract.json",
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
  "stdioSafetyBoundaryShape",
  "stdioSafetyCases",
  "validationRules",
  "blockedRuntimeEffect",
  "serveRuntimeBlockedBehavior",
  "forbiddenBehavior",
  "filesAllowedToChange",
  "filesForbiddenToChange",
  "validationCommands"
]);

const expectedCaseIds = Object.freeze([
  "missing-stdio-safety",
  "invalid-stdio-safety",
  "unbounded-stdin-stdout-stderr-behavior",
  "valid-restrictive-stdio-safety-prerequisite-only"
]);
const expectedClassifications = Object.freeze({
  "missing-stdio-safety": "missing_stdio_safety_rejected",
  "invalid-stdio-safety": "invalid_stdio_safety_rejected",
  "unbounded-stdin-stdout-stderr-behavior":
    "unbounded_stdin_stdout_stderr_behavior_rejected",
  "valid-restrictive-stdio-safety-prerequisite-only":
    "valid_restrictive_stdio_safety_prerequisite_only"
});
const stdioSafetyCommandProbes = Object.freeze([
  "stdio-safety",
  "runtime-stdio-safety",
  "runtime-stdio-safety-boundary",
  "validate-stdio-safety",
  "grant-stdio-safety",
  "stdio-runtime-safety",
  "phase-5-11-runtime-stdio-safety-boundary",
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

test("Phase 5.11 runtime stdio safety boundary fixture is deterministic metadata", async () => {
  const raw = await readFile(fixtureUrl, "utf8");
  const fixture = JSON.parse(raw);

  assert.equal(raw.endsWith("\n"), true);
  assert.equal(raw.includes("\r"), false);
  assert.deepEqual(Object.keys(fixture), expectedTopLevelKeys);
  assert.equal(fixture.schema, "ardyn.phase-5.11.runtime-stdio-safety-boundary-contract");
  assert.equal(fixture.schemaVersion, "0.1.0");
  assert.equal(fixture.phase, "phase-5.11-runtime-stdio-safety-boundary");
  assert.equal(fixture.artifactKind, "runtime-stdio-safety-boundary-contract");
  assert.equal(fixture.metadataGeneratedAt, "1970-01-01T00:00:00.000Z");
  assert.deepEqual(fixture.sourcePhase, {
    phase: "phase-5.10-runtime-host-policy-boundary",
    document: "docs/phase-5-10-runtime-host-policy-boundary.md",
    fixture:
      "tests/fixtures/host-policy/phase5-10/runtime-host-policy-enforcement-boundary-contract.json",
    runtimeEnabled: false,
    hostPolicyRuntimeEnforcementImplemented: false,
    hostPolicyRuntimeEnforcementActive: false,
    stdioSafetyImplemented: false
  });
});

test("Phase 5.11 records stdio safety as necessary but not sufficient", async () => {
  const [fixture, phase56Fixture, phase510Fixture] = await Promise.all([
    readJson(fixtureUrl),
    readJson(phase56FixtureUrl),
    readJson(phase510FixtureUrl)
  ]);

  assert.equal(phase56Fixture.gateSummary.runtimeEnabled, false);
  assert.equal(phase510Fixture.contractSummary.canEnableRuntime, false);
  assert.deepEqual(fixture.contractSummary, {
    runtimeStdioSafetyBoundaryRecorded: true,
    stdioSafetyRequiredBeforeRuntimeEnablement: true,
    stdioSafetyImplemented: false,
    stdioSafetyActive: false,
    missingStdioSafetyRejected: true,
    invalidStdioSafetyRejected: true,
    unboundedStdinStdoutStderrBehaviorRejected: true,
    validRestrictiveStdioSafetyPrerequisiteOnly: true,
    validRestrictiveStdioSafetyEnablesRuntime: false,
    validRestrictiveStdioSafetyStartsRuntime: false,
    validRestrictiveStdioSafetyExposesRuntimeExecution: false,
    runtimeEnabled: false,
    runtimeCommandEnabled: false,
    runtimeExecutionEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    requiresSeparateStdioRuntimeImplementationReview: true,
    requiresRemainingPhase56Preconditions: true,
    canEnableRuntime: false
  });
});

test("Phase 5.11 stdio safety boundary shape requires bounded stdin stdout and stderr", async () => {
  const fixture = await readJson(fixtureUrl);

  assert.equal(fixture.stdioSafetyBoundaryShape.futureSafetyKind, "runtime-stdio-safety");
  assert.equal(fixture.stdioSafetyBoundaryShape.validRestrictivePrerequisiteRule, true);
  assert.ok(
    fixture.stdioSafetyBoundaryShape.requiredBeforeRuntimeEnablement.includes(
      "bounded-stdin-read-policy"
    )
  );
  assert.ok(
    fixture.stdioSafetyBoundaryShape.requiredBeforeRuntimeEnablement.includes(
      "stdout-stderr-writer-policy"
    )
  );
  assert.ok(
    fixture.stdioSafetyBoundaryShape.rejectedSafetyShapes.includes(
      "unbounded-stdin-stdout-stderr-behavior"
    )
  );
  assert.ok(
    fixture.stdioSafetyBoundaryShape.requiredRestrictiveControls.includes(
      "no-live-stdin-loop-before-explicit-runtime-approval"
    )
  );
  assert.ok(
    fixture.stdioSafetyBoundaryShape.requiredRestrictiveControls.includes(
      "bounded-stdout-stderr-framing-redaction-and-backpressure"
    )
  );
  assert.deepEqual(fixture.stdioSafetyBoundaryShape.falseFieldsUntilImplemented, [
    "stdioSafetyImplemented",
    "stdioSafetyActive",
    "liveStdinLoopEnabled",
    "runtimeStdoutWriterEnabled",
    "runtimeStderrWriterEnabled",
    "runtimeEnablementAuthorized",
    "runtimeExecutionAuthorized"
  ]);
});

test("Phase 5.11 stdio safety cases reject unsafe stdio and keep runtime effects false", async () => {
  const fixture = await readJson(fixtureUrl);

  assert.deepEqual(
    fixture.stdioSafetyCases.map((boundaryCase) => boundaryCase.caseId),
    expectedCaseIds
  );

  for (const boundaryCase of fixture.stdioSafetyCases) {
    assert.equal(
      boundaryCase.classification,
      expectedClassifications[boundaryCase.caseId],
      boundaryCase.caseId
    );
    assert.equal(boundaryCase.rejectedForRuntimeEnablement, true, boundaryCase.caseId);
    assert.ok(boundaryCase.rejectionReasons.length >= 1, boundaryCase.caseId);
    assertAllFalse(boundaryCase.stdioEffect);
    assertAllFalse(boundaryCase.runtimeEffect);
  }

  const validCase = fixture.stdioSafetyCases.find(
    (boundaryCase) =>
      boundaryCase.caseId === "valid-restrictive-stdio-safety-prerequisite-only"
  );
  assert.equal(validCase.stdioSafetyPresent, true);
  assert.equal(validCase.stdioSafetyValid, true);
  assert.equal(validCase.stdioSafetyRestrictive, true);
  assert.equal(validCase.prerequisiteSignalRecognized, true);
  assert.ok(validCase.rejectionReasons.includes("runtime_enable_preconditions_unsatisfied"));
  assert.equal(fixture.validationRules.validRestrictiveStdioSafetyCannotEnableRuntime, true);
  assert.equal(fixture.validationRules.validRestrictiveStdioSafetyCannotStartRuntime, true);
});

test("serve-runtime remains default-blocked and dry-run cannot bypass Phase 5.11 stdio safety boundary", async () => {
  const fixture = await readJson(fixtureUrl);
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-11-stdio-safety-boundary-"));

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

test("Phase 5.11 stdio safety command names remain rejected", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-11-stdio-safety-probes-"));
  const serveRuntimeStderr =
    "Usage: ardyn serve-runtime [--dry-run]\n" +
    "Runtime unavailable: serve-runtime is recognized, but runtime is not enabled in Phase 5.5.\n";

  try {
    for (const command of stdioSafetyCommandProbes) {
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

test("Phase 5.11 does not change CLI runtime source or add runtime I/O primitives", async () => {
  const [{ stdout: baselineSource }, currentSource] = await Promise.all([
    execFileAsync("git", ["show", `${phase511BaselineCommit}:apps/cli/src/index.mjs`], {
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
    /runtimeStdioSafety/i,
    /stdioSafety.*enable/i
  ]) {
    assert.doesNotMatch(currentSource, forbiddenPattern);
  }
});
