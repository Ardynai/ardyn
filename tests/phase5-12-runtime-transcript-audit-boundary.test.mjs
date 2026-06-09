import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readFile, readdir, rm, mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";

const execFileAsync = promisify(execFile);
const phase512BaselineCommit = "ea4185cb97eacc6fdac4aefaa402faf17f16cae0";
const repoRootUrl = new URL("../", import.meta.url);
const repoRoot = fileURLToPath(repoRootUrl);
const cliSourceUrl = new URL("../apps/cli/src/index.mjs", import.meta.url);
const cliPath = fileURLToPath(cliSourceUrl);
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-12/runtime-transcript-audit-confinement-boundary-contract.json",
  import.meta.url
);
const phase56FixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-6/runtime-enable-precondition-gate.json",
  import.meta.url
);
const phase511FixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-11/runtime-stdio-safety-boundary-contract.json",
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
  "transcriptAuditConfinementBoundaryShape",
  "transcriptAuditConfinementCases",
  "validationRules",
  "blockedRuntimeEffect",
  "serveRuntimeBlockedBehavior",
  "forbiddenBehavior",
  "filesAllowedToChange",
  "filesForbiddenToChange",
  "validationCommands"
]);

const expectedCaseIds = Object.freeze([
  "missing-transcript-audit-confinement",
  "invalid-transcript-audit-confinement",
  "unbounded-runtime-transcript-audit-writes",
  "valid-restrictive-transcript-audit-confinement-prerequisite-only"
]);
const expectedClassifications = Object.freeze({
  "missing-transcript-audit-confinement":
    "missing_transcript_audit_confinement_rejected",
  "invalid-transcript-audit-confinement":
    "invalid_transcript_audit_confinement_rejected",
  "unbounded-runtime-transcript-audit-writes":
    "unbounded_runtime_transcript_audit_writes_rejected",
  "valid-restrictive-transcript-audit-confinement-prerequisite-only":
    "valid_restrictive_transcript_audit_confinement_prerequisite_only"
});
const transcriptAuditCommandProbes = Object.freeze([
  "transcript-audit-confinement",
  "runtime-transcript-audit",
  "runtime-transcript-audit-boundary",
  "validate-transcript-audit-confinement",
  "grant-transcript-audit-confinement",
  "runtime-transcript-confinement",
  "runtime-audit-confinement",
  "phase-5-12-runtime-transcript-audit-boundary",
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

test("Phase 5.12 runtime transcript/audit boundary fixture is deterministic metadata", async () => {
  const raw = await readFile(fixtureUrl, "utf8");
  const fixture = JSON.parse(raw);

  assert.equal(raw.endsWith("\n"), true);
  assert.equal(raw.includes("\r"), false);
  assert.deepEqual(Object.keys(fixture), expectedTopLevelKeys);
  assert.equal(
    fixture.schema,
    "ardyn.phase-5.12.runtime-transcript-audit-confinement-boundary-contract"
  );
  assert.equal(fixture.schemaVersion, "0.1.0");
  assert.equal(fixture.phase, "phase-5.12-runtime-transcript-audit-boundary");
  assert.equal(
    fixture.artifactKind,
    "runtime-transcript-audit-confinement-boundary-contract"
  );
  assert.equal(fixture.metadataGeneratedAt, "1970-01-01T00:00:00.000Z");
  assert.deepEqual(fixture.sourcePhase, {
    phase: "phase-5.11-runtime-stdio-safety-boundary",
    document: "docs/phase-5-11-runtime-stdio-safety-boundary.md",
    fixture:
      "tests/fixtures/host-policy/phase5-11/runtime-stdio-safety-boundary-contract.json",
    runtimeEnabled: false,
    stdioSafetyImplemented: false,
    stdioSafetyActive: false,
    transcriptAuditConfinementImplemented: false
  });
});

test("Phase 5.12 records transcript/audit confinement as necessary but not sufficient", async () => {
  const [fixture, phase56Fixture, phase511Fixture] = await Promise.all([
    readJson(fixtureUrl),
    readJson(phase56FixtureUrl),
    readJson(phase511FixtureUrl)
  ]);

  assert.equal(phase56Fixture.gateSummary.runtimeEnabled, false);
  assert.equal(phase511Fixture.contractSummary.canEnableRuntime, false);
  assert.deepEqual(fixture.contractSummary, {
    runtimeTranscriptAuditBoundaryRecorded: true,
    transcriptAuditConfinementRequiredBeforeRuntimeEnablement: true,
    transcriptAuditConfinementImplemented: false,
    transcriptAuditConfinementActive: false,
    missingTranscriptAuditConfinementRejected: true,
    invalidTranscriptAuditConfinementRejected: true,
    unboundedRuntimeTranscriptAuditWritesRejected: true,
    validRestrictiveTranscriptAuditConfinementPrerequisiteOnly: true,
    validRestrictiveTranscriptAuditConfinementEnablesRuntime: false,
    validRestrictiveTranscriptAuditConfinementStartsRuntime: false,
    validRestrictiveTranscriptAuditConfinementExposesRuntimeExecution: false,
    runtimeEnabled: false,
    runtimeCommandEnabled: false,
    runtimeExecutionEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    requiresSeparateTranscriptAuditRuntimeImplementationReview: true,
    requiresRemainingPhase56Preconditions: true,
    canEnableRuntime: false
  });
});

test("Phase 5.12 transcript/audit boundary shape requires bounded runtime writes", async () => {
  const fixture = await readJson(fixtureUrl);

  assert.equal(
    fixture.transcriptAuditConfinementBoundaryShape.futureConfinementKind,
    "runtime-transcript-audit-confinement"
  );
  assert.equal(
    fixture.transcriptAuditConfinementBoundaryShape.validRestrictivePrerequisiteRule,
    true
  );
  assert.ok(
    fixture.transcriptAuditConfinementBoundaryShape.requiredBeforeRuntimeEnablement.includes(
      "bounded-transcript-write-policy"
    )
  );
  assert.ok(
    fixture.transcriptAuditConfinementBoundaryShape.requiredBeforeRuntimeEnablement.includes(
      "bounded-audit-write-policy"
    )
  );
  assert.ok(
    fixture.transcriptAuditConfinementBoundaryShape.rejectedConfinementShapes.includes(
      "unbounded-runtime-transcript-audit-writes"
    )
  );
  assert.ok(
    fixture.transcriptAuditConfinementBoundaryShape.requiredRestrictiveControls.includes(
      "no-runtime-transcript-write-before-explicit-runtime-approval"
    )
  );
  assert.ok(
    fixture.transcriptAuditConfinementBoundaryShape.requiredRestrictiveControls.includes(
      "bounded-transcript-audit-path-and-size-policy"
    )
  );
  assert.deepEqual(
    fixture.transcriptAuditConfinementBoundaryShape.falseFieldsUntilImplemented,
    [
      "transcriptAuditConfinementImplemented",
      "transcriptAuditConfinementActive",
      "runtimeTranscriptWriterEnabled",
      "runtimeAuditWriterEnabled",
      "runtimeEnablementAuthorized",
      "runtimeExecutionAuthorized"
    ]
  );
});

test("Phase 5.12 transcript/audit confinement cases reject unsafe writes and keep runtime effects false", async () => {
  const fixture = await readJson(fixtureUrl);

  assert.deepEqual(
    fixture.transcriptAuditConfinementCases.map((boundaryCase) => boundaryCase.caseId),
    expectedCaseIds
  );

  for (const boundaryCase of fixture.transcriptAuditConfinementCases) {
    assert.equal(
      boundaryCase.classification,
      expectedClassifications[boundaryCase.caseId],
      boundaryCase.caseId
    );
    assert.equal(boundaryCase.rejectedForRuntimeEnablement, true, boundaryCase.caseId);
    assert.ok(boundaryCase.rejectionReasons.length >= 1, boundaryCase.caseId);
    assertAllFalse(boundaryCase.transcriptAuditEffect);
    assertAllFalse(boundaryCase.runtimeEffect);
  }

  const validCase = fixture.transcriptAuditConfinementCases.find(
    (boundaryCase) =>
      boundaryCase.caseId ===
      "valid-restrictive-transcript-audit-confinement-prerequisite-only"
  );
  assert.equal(validCase.transcriptAuditConfinementPresent, true);
  assert.equal(validCase.transcriptAuditConfinementValid, true);
  assert.equal(validCase.transcriptAuditConfinementRestrictive, true);
  assert.equal(validCase.prerequisiteSignalRecognized, true);
  assert.ok(validCase.rejectionReasons.includes("runtime_enable_preconditions_unsatisfied"));
  assert.equal(
    fixture.validationRules.validRestrictiveTranscriptAuditConfinementCannotEnableRuntime,
    true
  );
  assert.equal(
    fixture.validationRules.validRestrictiveTranscriptAuditConfinementCannotStartRuntime,
    true
  );
});

test("serve-runtime remains default-blocked and dry-run cannot bypass Phase 5.12 transcript/audit boundary", async () => {
  const fixture = await readJson(fixtureUrl);
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-12-transcript-audit-"));

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

test("Phase 5.12 transcript/audit confinement command names remain rejected", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-12-transcript-audit-probes-"));
  const serveRuntimeStderr =
    "Usage: ardyn serve-runtime [--dry-run]\n" +
    "Runtime unavailable: serve-runtime is recognized, but runtime is not enabled in Phase 5.5.\n";

  try {
    for (const command of transcriptAuditCommandProbes) {
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

test("Phase 5.12 does not change CLI runtime source or add transcript/audit primitives", async () => {
  const [{ stdout: baselineSource }, currentSource] = await Promise.all([
    execFileAsync("git", ["show", `${phase512BaselineCommit}:apps/cli/src/index.mjs`], {
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
    /\bcreateWriteStream\s*\(/,
    /runtimeTranscript/i,
    /runtimeAudit/i,
    /transcriptAudit.*enable/i
  ]) {
    assert.doesNotMatch(currentSource, forbiddenPattern);
  }
});
