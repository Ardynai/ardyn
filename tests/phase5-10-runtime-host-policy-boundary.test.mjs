import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readFile, readdir, rm, mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";

const execFileAsync = promisify(execFile);
const phase510BaselineCommit = "3d9f23dfb029ae73b686425ea9da91eec149f415";
const repoRootUrl = new URL("../", import.meta.url);
const repoRoot = fileURLToPath(repoRootUrl);
const cliSourceUrl = new URL("../apps/cli/src/index.mjs", import.meta.url);
const cliPath = fileURLToPath(cliSourceUrl);
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-10/runtime-host-policy-enforcement-boundary-contract.json",
  import.meta.url
);
const phase56FixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-6/runtime-enable-precondition-gate.json",
  import.meta.url
);
const phase59FixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-9/approval-evaluator-grant-boundary-contract.json",
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
  "hostPolicyBoundaryShape",
  "hostPolicyEnforcementCases",
  "validationRules",
  "blockedRuntimeEffect",
  "serveRuntimeBlockedBehavior",
  "forbiddenBehavior",
  "filesAllowedToChange",
  "filesForbiddenToChange",
  "validationCommands"
]);

const expectedCaseIds = Object.freeze([
  "missing-host-policy-enforcement",
  "invalid-host-policy-enforcement",
  "permissive-unbounded-host-policy-enforcement",
  "valid-restrictive-host-policy-prerequisite-only"
]);
const expectedClassifications = Object.freeze({
  "missing-host-policy-enforcement": "missing_host_policy_enforcement_rejected",
  "invalid-host-policy-enforcement": "invalid_host_policy_enforcement_rejected",
  "permissive-unbounded-host-policy-enforcement":
    "permissive_unbounded_host_policy_enforcement_rejected",
  "valid-restrictive-host-policy-prerequisite-only":
    "valid_restrictive_host_policy_prerequisite_only"
});
const hostPolicyCommandProbes = Object.freeze([
  "host-policy-enforcement",
  "runtime-host-policy",
  "runtime-host-policy-enforcement",
  "validate-host-policy-enforcement",
  "grant-host-policy-enforcement",
  "phase-5-10-runtime-host-policy-boundary",
  "runtime-host-policy-boundary",
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

test("Phase 5.10 runtime host-policy boundary fixture is deterministic metadata", async () => {
  const raw = await readFile(fixtureUrl, "utf8");
  const fixture = JSON.parse(raw);

  assert.equal(raw.endsWith("\n"), true);
  assert.equal(raw.includes("\r"), false);
  assert.deepEqual(Object.keys(fixture), expectedTopLevelKeys);
  assert.equal(fixture.schema, "ardyn.phase-5.10.runtime-host-policy-enforcement-boundary-contract");
  assert.equal(fixture.schemaVersion, "0.1.0");
  assert.equal(fixture.phase, "phase-5.10-runtime-host-policy-boundary");
  assert.equal(fixture.artifactKind, "runtime-host-policy-enforcement-boundary-contract");
  assert.equal(fixture.metadataGeneratedAt, "1970-01-01T00:00:00.000Z");
  assert.deepEqual(fixture.sourcePhase, {
    phase: "phase-5.9-approval-evaluator-grant-boundary",
    document: "docs/phase-5-9-approval-evaluator-grant-boundary.md",
    fixture:
      "tests/fixtures/host-policy/phase5-9/approval-evaluator-grant-boundary-contract.json",
    runtimeEnabled: false,
    approvalEvaluatorImplemented: false,
    approvalGrantProduced: false,
    hostPolicyRuntimeEnforcementImplemented: false
  });
});

test("Phase 5.10 records host-policy enforcement as necessary but not sufficient", async () => {
  const [fixture, phase56Fixture, phase59Fixture] = await Promise.all([
    readJson(fixtureUrl),
    readJson(phase56FixtureUrl),
    readJson(phase59FixtureUrl)
  ]);

  assert.equal(phase56Fixture.gateSummary.runtimeEnabled, false);
  assert.equal(phase59Fixture.contractSummary.canEnableRuntime, false);
  assert.deepEqual(fixture.contractSummary, {
    runtimeHostPolicyBoundaryRecorded: true,
    hostPolicyRuntimeEnforcementRequired: true,
    hostPolicyRuntimeEnforcementImplemented: false,
    hostPolicyRuntimeEnforcementActive: false,
    missingHostPolicyEnforcementRejected: true,
    invalidHostPolicyEnforcementRejected: true,
    permissiveUnboundedHostPolicyEnforcementRejected: true,
    validRestrictiveHostPolicyPrerequisiteOnly: true,
    validRestrictiveHostPolicyEnablesRuntime: false,
    validRestrictiveHostPolicyStartsRuntime: false,
    validRestrictiveHostPolicyExposesRuntimeExecution: false,
    runtimeEnabled: false,
    runtimeCommandEnabled: false,
    runtimeExecutionEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    requiresSeparateHostPolicyRuntimeImplementationReview: true,
    requiresRemainingPhase56Preconditions: true,
    canEnableRuntime: false
  });
});

test("Phase 5.10 host-policy boundary shape requires restrictive enforcement before runtime", async () => {
  const fixture = await readJson(fixtureUrl);

  assert.equal(
    fixture.hostPolicyBoundaryShape.futureEnforcementKind,
    "runtime-host-policy-enforcement"
  );
  assert.equal(fixture.hostPolicyBoundaryShape.validRestrictivePrerequisiteRule, true);
  assert.ok(
    fixture.hostPolicyBoundaryShape.requiredBeforeRuntimeEnablement.includes(
      "restrictive-host-policy-runtime-enforcement"
    )
  );
  assert.ok(
    fixture.hostPolicyBoundaryShape.rejectedEnforcementShapes.includes(
      "missing-host-policy-enforcement"
    )
  );
  assert.ok(
    fixture.hostPolicyBoundaryShape.requiredRestrictiveControls.includes(
      "bounded-capability-scope"
    )
  );
  assert.ok(
    fixture.hostPolicyBoundaryShape.requiredRestrictiveControls.includes(
      "deny-by-default-runtime-actions"
    )
  );
  assert.deepEqual(fixture.hostPolicyBoundaryShape.falseFieldsUntilImplemented, [
    "hostPolicyRuntimeEnforcementImplemented",
    "hostPolicyRuntimeEnforcementActive",
    "runtimeEnablementAuthorized",
    "runtimeCommandAuthorized",
    "runtimeExecutionAuthorized"
  ]);
});

test("Phase 5.10 host-policy enforcement cases reject unsafe enforcement and keep runtime effects false", async () => {
  const fixture = await readJson(fixtureUrl);

  assert.deepEqual(
    fixture.hostPolicyEnforcementCases.map((boundaryCase) => boundaryCase.caseId),
    expectedCaseIds
  );

  for (const boundaryCase of fixture.hostPolicyEnforcementCases) {
    assert.equal(
      boundaryCase.classification,
      expectedClassifications[boundaryCase.caseId],
      boundaryCase.caseId
    );
    assert.equal(boundaryCase.rejectedForRuntimeEnablement, true, boundaryCase.caseId);
    assert.ok(boundaryCase.rejectionReasons.length >= 1, boundaryCase.caseId);
    assertAllFalse(boundaryCase.enforcementEffect);
    assertAllFalse(boundaryCase.runtimeEffect);
  }

  const validCase = fixture.hostPolicyEnforcementCases.find(
    (boundaryCase) =>
      boundaryCase.caseId === "valid-restrictive-host-policy-prerequisite-only"
  );
  assert.equal(validCase.hostPolicyEnforcementPresent, true);
  assert.equal(validCase.hostPolicyEnforcementValid, true);
  assert.equal(validCase.hostPolicyEnforcementRestrictive, true);
  assert.equal(validCase.prerequisiteSignalRecognized, true);
  assert.ok(validCase.rejectionReasons.includes("runtime_enable_preconditions_unsatisfied"));
  assert.equal(fixture.validationRules.validRestrictiveHostPolicyCannotEnableRuntime, true);
  assert.equal(fixture.validationRules.validRestrictiveHostPolicyCannotStartRuntime, true);
});

test("serve-runtime remains default-blocked and dry-run cannot bypass Phase 5.10 host-policy boundary", async () => {
  const fixture = await readJson(fixtureUrl);
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-10-host-policy-boundary-"));

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

test("Phase 5.10 host-policy command names remain rejected", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-10-host-policy-probes-"));
  const serveRuntimeStderr =
    "Usage: ardyn serve-runtime [--dry-run]\n" +
    "Runtime unavailable: serve-runtime is recognized, but runtime is not enabled in Phase 5.5.\n";

  try {
    for (const command of hostPolicyCommandProbes) {
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

test("Phase 5.10 does not change CLI runtime source or add runtime primitives", async () => {
  const [{ stdout: baselineSource }, currentSource] = await Promise.all([
    execFileAsync("git", ["show", `${phase510BaselineCommit}:apps/cli/src/index.mjs`], {
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
    /hostPolicy.*enforce/i,
    /runtimeHostPolicy/i
  ]) {
    assert.doesNotMatch(currentSource, forbiddenPattern);
  }
});
