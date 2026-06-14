import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readFile, readdir, rm, mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";

const execFileAsync = promisify(execFile);
const phase516BaselineCommit = "958b04e0c4a0e8bacb08ecfe7ec75378cc5bdf96";
const repoRootUrl = new URL("../", import.meta.url);
const repoRoot = fileURLToPath(repoRootUrl);
const cliSourceUrl = new URL("../apps/cli/src/index.mjs", import.meta.url);
const cliPath = fileURLToPath(cliSourceUrl);
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-16/runtime-enable-readiness-checkpoint.json",
  import.meta.url
);

const expectedTopLevelKeys = Object.freeze([
  "schema",
  "schemaVersion",
  "phase",
  "artifactKind",
  "metadataGeneratedAt",
  "sourcePhases",
  "checkpointSummary",
  "preconditionContracts",
  "prerequisiteSignalStatus",
  "liveRuntimeStatus",
  "serveRuntimeBlockedBehavior",
  "readinessDecision",
  "forbiddenBehavior",
  "filesAllowedToChange",
  "filesForbiddenToChange",
  "validationCommands"
]);

const expectedPreconditionContracts = Object.freeze([
  {
    contractId: "runtime-enable-precondition-gate",
    phase: "phase-5.6-runtime-enable-preconditions",
    document: "docs/phase-5-6-runtime-enable-preconditions.md",
    fixture: "tests/fixtures/host-policy/phase5-6/runtime-enable-precondition-gate.json"
  },
  {
    contractId: "runtime-approval-validation",
    phase: "phase-5.7-runtime-approval-validation",
    document: "docs/phase-5-7-runtime-approval-validation.md",
    fixture: "tests/fixtures/host-policy/phase5-7/runtime-approval-validation-contract.json"
  },
  {
    contractId: "runtime-command-exposure-approval",
    phase: "phase-5.8-runtime-command-exposure-approval",
    document: "docs/phase-5-8-runtime-command-exposure-approval.md",
    fixture:
      "tests/fixtures/command-surface/phase5-8/runtime-command-exposure-approval-contract.json"
  },
  {
    contractId: "approval-evaluator-grant-boundary",
    phase: "phase-5.9-approval-evaluator-grant-boundary",
    document: "docs/phase-5-9-approval-evaluator-grant-boundary.md",
    fixture:
      "tests/fixtures/host-policy/phase5-9/approval-evaluator-grant-boundary-contract.json"
  },
  {
    contractId: "runtime-host-policy-boundary",
    phase: "phase-5.10-runtime-host-policy-boundary",
    document: "docs/phase-5-10-runtime-host-policy-boundary.md",
    fixture:
      "tests/fixtures/host-policy/phase5-10/runtime-host-policy-enforcement-boundary-contract.json"
  },
  {
    contractId: "runtime-stdio-safety-boundary",
    phase: "phase-5.11-runtime-stdio-safety-boundary",
    document: "docs/phase-5-11-runtime-stdio-safety-boundary.md",
    fixture: "tests/fixtures/host-policy/phase5-11/runtime-stdio-safety-boundary-contract.json"
  },
  {
    contractId: "runtime-transcript-audit-boundary",
    phase: "phase-5.12-runtime-transcript-audit-boundary",
    document: "docs/phase-5-12-runtime-transcript-audit-boundary.md",
    fixture:
      "tests/fixtures/host-policy/phase5-12/runtime-transcript-audit-confinement-boundary-contract.json"
  },
  {
    contractId: "runtime-process-control-boundary",
    phase: "phase-5.13-runtime-process-control-boundary",
    document: "docs/phase-5-13-runtime-process-control-boundary.md",
    fixture: "tests/fixtures/host-policy/phase5-13/runtime-process-control-boundary-contract.json"
  },
  {
    contractId: "runtime-rollback-kill-switch-boundary",
    phase: "phase-5.14-runtime-rollback-kill-switch-boundary",
    document: "docs/phase-5-14-runtime-rollback-kill-switch-boundary.md",
    fixture:
      "tests/fixtures/host-policy/phase5-14/runtime-rollback-kill-switch-boundary-contract.json"
  },
  {
    contractId: "positive-runtime-smoke-requirement",
    phase: "phase-5.15-positive-runtime-smoke-requirement",
    document: "docs/phase-5-15-positive-runtime-smoke-requirement.md",
    fixture:
      "tests/fixtures/host-policy/phase5-15/positive-runtime-smoke-requirement-contract.json"
  }
]);

const readinessCommandProbes = Object.freeze([
  "runtime-enable-readiness-checkpoint",
  "runtime-enable-readiness",
  "runtime-readiness-checkpoint",
  "runtime-enable-checkpoint",
  "check-runtime-enable-readiness",
  "validate-runtime-enable-readiness",
  "grant-runtime-enable-readiness",
  "runtime-enable",
  "enable-runtime",
  "grant-runtime",
  "phase-5-16-runtime-enable-readiness-checkpoint",
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

test("Phase 5.16 readiness checkpoint fixture is deterministic metadata", async () => {
  const raw = await readFile(fixtureUrl, "utf8");
  const fixture = JSON.parse(raw);

  assert.equal(raw.endsWith("\n"), true);
  assert.equal(raw.includes("\r"), false);
  assert.deepEqual(Object.keys(fixture), expectedTopLevelKeys);
  assert.equal(fixture.schema, "ardyn.phase-5.16.runtime-enable-readiness-checkpoint");
  assert.equal(fixture.schemaVersion, "0.1.0");
  assert.equal(fixture.phase, "phase-5.16-runtime-enable-readiness-checkpoint");
  assert.equal(fixture.artifactKind, "runtime-enable-readiness-checkpoint");
  assert.equal(fixture.metadataGeneratedAt, "1970-01-01T00:00:00.000Z");
});

test("Phase 5.16 summarizes all Phase 5.6 through 5.15 precondition contracts", async () => {
  const fixture = await readJson(fixtureUrl);

  assert.deepEqual(fixture.sourcePhases, expectedPreconditionContracts);
  assert.deepEqual(
    fixture.preconditionContracts.map(({ contractId, phase, document, fixture }) => ({
      contractId,
      phase,
      document,
      fixture
    })),
    expectedPreconditionContracts
  );
  assert.equal(fixture.checkpointSummary.representedPreconditionCount, 10);
  assert.equal(fixture.preconditionContracts.length, 10);

  for (const precondition of fixture.preconditionContracts) {
    assert.equal(precondition.representedAsContract, true, precondition.contractId);
    assert.equal(precondition.implementedAsLiveRuntime, false, precondition.contractId);
    assert.equal(precondition.activeRuntimeBehavior, false, precondition.contractId);
    assert.equal(precondition.prerequisiteOnly, true, precondition.contractId);
    assert.equal(precondition.enablesRuntime, false, precondition.contractId);
    assert.equal(precondition.startsRuntime, false, precondition.contractId);
    assert.equal(precondition.exposesRuntimeExecution, false, precondition.contractId);
  }
});

test("Phase 5.16 checkpoint records all prerequisite signals as contract-only", async () => {
  const fixture = await readJson(fixtureUrl);

  assert.deepEqual(fixture.checkpointSummary, {
    runtimeEnableReadinessCheckpointRecorded: true,
    phase56Through515ContractsRepresented: true,
    representedPreconditionCount: 10,
    implementedLivePreconditionCount: 0,
    approvalRecordsPrerequisiteOnly: true,
    commandExposureApprovalPrerequisiteOnly: true,
    approvalEvaluatorImplemented: false,
    approvalGrantProduced: false,
    hostPolicyRuntimeEnforcementImplemented: false,
    stdioSafetyImplemented: false,
    transcriptAuditConfinementImplemented: false,
    processControlBoundaryImplemented: false,
    rollbackKillSwitchBoundaryImplemented: false,
    positiveRuntimeSmokeCoverageImplemented: false,
    runtimeEnabled: false,
    runtimeCommandEnabled: false,
    runtimeExecutionEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    readyForRuntimeEnablement: false,
    readyForLiveRuntimeImplementation: false,
    canEnableRuntime: false
  });

  assert.deepEqual(fixture.prerequisiteSignalStatus, {
    validRuntimeApprovalPrerequisiteOnly: true,
    validCommandExposureApprovalPrerequisiteOnly: true,
    approvalEvaluatorImplemented: false,
    approvalGrantProduced: false,
    hostPolicyContractOnly: true,
    stdioSafetyContractOnly: true,
    transcriptAuditContractOnly: true,
    processControlContractOnly: true,
    rollbackKillSwitchContractOnly: true,
    positiveRuntimeSmokeContractOnly: true,
    anyPrerequisiteSignalEnablesRuntime: false,
    anyPrerequisiteSignalStartsRuntime: false,
    anyPrerequisiteSignalExposesRuntimeExecution: false
  });
});

test("Phase 5.16 keeps live runtime status fully blocked", async () => {
  const fixture = await readJson(fixtureUrl);

  assertAllFalse(fixture.liveRuntimeStatus);
  assertAllFalse(fixture.readinessDecision.runtimeEffect);
  assert.equal(fixture.readinessDecision.decision, "blocked");
  assert.equal(fixture.readinessDecision.readyForRuntimeEnablement, false);
  assert.equal(fixture.readinessDecision.readyForLiveRuntimeImplementation, false);
  assert.equal(fixture.readinessDecision.recommendedNextPhase, "phase-5.17-guarded-runtime-implementation-plan");
  assert.ok(
    fixture.readinessDecision.blockers.includes("approval_evaluator_not_implemented")
  );
  assert.ok(
    fixture.readinessDecision.blockers.includes("positive_runtime_smoke_not_implemented")
  );
});

test("serve-runtime remains default-blocked and dry-run cannot bypass Phase 5.16 readiness checkpoint", async () => {
  const fixture = await readJson(fixtureUrl);
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-16-readiness-"));

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

test("Phase 5.16 readiness command names remain rejected", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-16-readiness-probes-"));
  const serveRuntimeStderr =
    "Usage: ardyn serve-runtime [--dry-run]\n" +
    "Runtime unavailable: serve-runtime is recognized, but runtime is not enabled in Phase 5.5.\n";

  try {
    for (const command of readinessCommandProbes) {
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

test("Phase 5.16 does not change CLI runtime source or add readiness primitives", async () => {
  const [{ stdout: baselineSource }, currentSource] = await Promise.all([
    execFileAsync("git", ["show", `${phase516BaselineCommit}:apps/cli/src/index.mjs`], {
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
    /runtimeEnableReadiness/i,
    /readinessCheckpoint/i,
    /approvalEvaluator/i,
    /approvalGrant/i
  ]) {
    assert.doesNotMatch(currentSource, forbiddenPattern);
  }
});
