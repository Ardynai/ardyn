import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readFile, readdir, rm, mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";

const execFileAsync = promisify(execFile);
const phase517BaselineCommit = "365c2a99433bac4845f007434e4a7a237148bba4";
const repoRootUrl = new URL("../", import.meta.url);
const repoRoot = fileURLToPath(repoRootUrl);
const cliSourceUrl = new URL("../apps/cli/src/index.mjs", import.meta.url);
const cliPath = fileURLToPath(cliSourceUrl);
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-17/guarded-runtime-implementation-plan.json",
  import.meta.url
);

const expectedTopLevelKeys = Object.freeze([
  "schema",
  "schemaVersion",
  "phase",
  "artifactKind",
  "metadataGeneratedAt",
  "sourceCheckpoint",
  "prerequisiteContracts",
  "implementationPlanSummary",
  "plannedImplementationSequence",
  "prerequisiteContractStatus",
  "runtimeBlockedStatus",
  "serveRuntimeBlockedBehavior",
  "planningDecision",
  "forbiddenBehavior",
  "filesAllowedToChange",
  "filesForbiddenToChange",
  "validationCommands"
]);

const expectedPrerequisiteContracts = Object.freeze([
  "runtime-enable-precondition-gate",
  "runtime-approval-validation",
  "runtime-command-exposure-approval",
  "approval-evaluator-grant-boundary",
  "runtime-host-policy-boundary",
  "runtime-stdio-safety-boundary",
  "runtime-transcript-audit-boundary",
  "runtime-process-control-boundary",
  "runtime-rollback-kill-switch-boundary",
  "positive-runtime-smoke-requirement",
  "runtime-enable-readiness-checkpoint"
]);

const expectedImplementationSteps = Object.freeze([
  "confirm-approval-and-command-exposure-record-readers",
  "add-review-only-approval-evaluator-design",
  "add-restrictive-host-policy-runtime-gate",
  "add-bounded-stdio-runtime-gate",
  "add-transcript-audit-confinement-gate",
  "add-process-control-boundary-gate",
  "add-rollback-kill-switch-gate",
  "add-positive-runtime-smoke-fixtures",
  "prepare-still-default-blocked-runtime-entrypoint-slice"
]);

const implementationPlanCommandProbes = Object.freeze([
  "guarded-runtime-implementation-plan",
  "runtime-implementation-plan",
  "guarded-runtime-plan",
  "runtime-plan",
  "plan-runtime-enable",
  "runtime-enable-plan",
  "validate-guarded-runtime-plan",
  "grant-guarded-runtime-plan",
  "phase-5-17-guarded-runtime-implementation-plan",
  "runtime-enable",
  "enable-runtime",
  "grant-runtime",
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

test("Phase 5.17 guarded runtime implementation plan fixture is deterministic metadata", async () => {
  const raw = await readFile(fixtureUrl, "utf8");
  const fixture = JSON.parse(raw);

  assert.equal(raw.endsWith("\n"), true);
  assert.equal(raw.includes("\r"), false);
  assert.deepEqual(Object.keys(fixture), expectedTopLevelKeys);
  assert.equal(fixture.schema, "ardyn.phase-5.17.guarded-runtime-implementation-plan");
  assert.equal(fixture.schemaVersion, "0.1.0");
  assert.equal(fixture.phase, "phase-5.17-guarded-runtime-implementation-plan");
  assert.equal(fixture.artifactKind, "guarded-runtime-implementation-plan");
  assert.equal(fixture.metadataGeneratedAt, "1970-01-01T00:00:00.000Z");
});

test("Phase 5.17 keeps all Phase 5.6 through 5.16 contracts prerequisite-only", async () => {
  const fixture = await readJson(fixtureUrl);

  assert.equal(fixture.sourceCheckpoint.phase, "phase-5.16-runtime-enable-readiness-checkpoint");
  assert.equal(
    fixture.sourceCheckpoint.fixture,
    "tests/fixtures/host-policy/phase5-16/runtime-enable-readiness-checkpoint.json"
  );
  assert.deepEqual(
    fixture.prerequisiteContracts.map(({ contractId }) => contractId),
    expectedPrerequisiteContracts
  );
  assert.equal(fixture.implementationPlanSummary.prerequisiteContractCount, 11);

  for (const contract of fixture.prerequisiteContracts) {
    assert.equal(contract.prerequisiteOnly, true, contract.contractId);
    assert.equal(contract.implementedByThisPhase, false, contract.contractId);
    assert.equal(contract.enablesRuntime, false, contract.contractId);
    assert.equal(contract.startsRuntime, false, contract.contractId);
    assert.equal(contract.exposesRuntimeExecution, false, contract.contractId);
  }
});

test("Phase 5.17 records a planned implementation sequence without implementing it", async () => {
  const fixture = await readJson(fixtureUrl);

  assert.deepEqual(fixture.implementationPlanSummary, {
    guardedRuntimeImplementationPlanRecorded: true,
    prerequisiteContractCount: 11,
    plannedImplementationStepCount: 9,
    implementationInThisPhase: false,
    runtimeEnabled: false,
    runtimeCommandEnabled: false,
    runtimeExecutionEnabled: false,
    approvalEvaluatorImplemented: false,
    approvalGrantProduced: false,
    runtimeCommandExposureEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    readyForRuntimeEnablement: false,
    canEnableRuntime: false
  });
  assert.deepEqual(
    fixture.plannedImplementationSequence.map(({ stepId }) => stepId),
    expectedImplementationSteps
  );

  for (const step of fixture.plannedImplementationSequence) {
    assert.equal(step.plannedOnly, true, step.stepId);
    assert.equal(step.implementedInThisPhase, false, step.stepId);
    assert.equal(step.enablesRuntime, false, step.stepId);
    assert.equal(step.startsRuntime, false, step.stepId);
    assert.equal(step.exposesRuntimeExecution, false, step.stepId);
  }
});

test("Phase 5.17 keeps runtime status and planning decision fully blocked", async () => {
  const fixture = await readJson(fixtureUrl);

  assertAllFalse(fixture.runtimeBlockedStatus);
  assert.deepEqual(fixture.prerequisiteContractStatus, {
    allPriorContractsPrerequisiteOnly: true,
    approvalRecordsPrerequisiteOnly: true,
    commandExposureApprovalPrerequisiteOnly: true,
    readinessCheckpointPrerequisiteOnly: true,
    anyPrerequisiteEnablesRuntime: false,
    anyPrerequisiteStartsRuntime: false,
    anyPrerequisiteExposesRuntimeExecution: false,
    anyPrerequisiteCreatesApprovalGrant: false
  });
  assertAllFalse(fixture.planningDecision.runtimeEffect);
  assert.equal(fixture.planningDecision.decision, "blocked");
  assert.equal(fixture.planningDecision.planRecorded, true);
  assert.equal(fixture.planningDecision.readyForRuntimeEnablement, false);
  assert.equal(fixture.planningDecision.recommendedNextSlice, "phase-5.18-review-only-approval-evaluator-skeleton");
  assert.ok(fixture.planningDecision.blockers.includes("approval_evaluator_not_implemented"));
  assert.ok(fixture.planningDecision.blockers.includes("runtime_enablement_review_not_granted"));
});

test("serve-runtime remains default-blocked and dry-run cannot bypass Phase 5.17 plan", async () => {
  const fixture = await readJson(fixtureUrl);
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-17-plan-"));

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

test("Phase 5.17 plan command names remain rejected", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-17-plan-probes-"));
  const serveRuntimeStderr =
    "Usage: ardyn serve-runtime [--dry-run]\n" +
    "Runtime unavailable: serve-runtime is recognized, but runtime is not enabled in Phase 5.5.\n";

  try {
    for (const command of implementationPlanCommandProbes) {
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

test("Phase 5.17 does not change CLI runtime source or add plan primitives", async () => {
  const [{ stdout: baselineSource }, currentSource] = await Promise.all([
    execFileAsync("git", ["show", `${phase517BaselineCommit}:apps/cli/src/index.mjs`], {
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
    /guardedRuntime/i,
    /runtimeImplementationPlan/i,
    /approvalEvaluator/i,
    /approvalGrant/i
  ]) {
    assert.doesNotMatch(currentSource, forbiddenPattern);
  }
});
