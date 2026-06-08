import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readFile, readdir, rm, mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";

const execFileAsync = promisify(execFile);
const phase55CliBaselineCommit = "c0c6e05bf2ff452d1c33e30394fa407b51bdc6bf";
const repoRootUrl = new URL("../", import.meta.url);
const repoRoot = fileURLToPath(repoRootUrl);
const cliSourceUrl = new URL("../apps/cli/src/index.mjs", import.meta.url);
const cliPath = fileURLToPath(cliSourceUrl);
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-6/runtime-enable-precondition-gate.json",
  import.meta.url
);

const expectedTopLevelKeys = Object.freeze([
  "schema",
  "schemaVersion",
  "phase",
  "artifactKind",
  "metadataGeneratedAt",
  "sourcePhase",
  "gateSummary",
  "requiredPreconditions",
  "blockedRuntimeEffect",
  "serveRuntimeBlockedBehavior",
  "forbiddenBehavior",
  "filesAllowedToChange",
  "filesForbiddenToChange",
  "validationCommands"
]);

const expectedPreconditionIds = Object.freeze([
  "runtime-enablement-approval",
  "runtime-command-exposure-approval",
  "approval-record-validation-and-revocation",
  "host-policy-runtime-enforcement",
  "stdio-safety-boundary",
  "transcript-audit-confinement",
  "process-control-boundary",
  "rollback-kill-switch",
  "positive-runtime-smokes"
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

test("Phase 5.6 runtime enablement precondition fixture is deterministic metadata", async () => {
  const raw = await readFile(fixtureUrl, "utf8");
  const fixture = JSON.parse(raw);

  assert.equal(raw.endsWith("\n"), true);
  assert.equal(raw.includes("\r"), false);
  assert.deepEqual(Object.keys(fixture), expectedTopLevelKeys);
  assert.equal(fixture.schema, "ardyn.phase-5.6.runtime-enable-precondition-gate");
  assert.equal(fixture.schemaVersion, "0.1.0");
  assert.equal(fixture.phase, "phase-5.6-runtime-enable-preconditions");
  assert.equal(fixture.metadataGeneratedAt, "1970-01-01T00:00:00.000Z");
  assert.deepEqual(fixture.sourcePhase, {
    phase: "phase-5.5-default-blocked-runtime-cli",
    document: "docs/phase-5-5-default-blocked-runtime-cli.md",
    fixture: "tests/fixtures/command-surface/phase5-5/default-blocked-runtime-cli.json",
    recognizedRuntimeCommand: "serve-runtime",
    runtimeEnabled: false
  });
});

test("Phase 5.6 records every required precondition as blocked before runtime enablement", async () => {
  const fixture = await readJson(fixtureUrl);

  assert.deepEqual(fixture.gateSummary, {
    runtimeEnablementGateRecorded: true,
    gateSatisfied: false,
    requiredPreconditionCount: expectedPreconditionIds.length,
    satisfiedPreconditionCount: 0,
    canEnableRuntime: false,
    runtimeEnabled: false,
    runtimeCommandEnabled: false,
    runtimeExecutionEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    requiresFutureReviewBeforeEnablement: true
  });
  assert.deepEqual(
    fixture.requiredPreconditions.map((precondition) => precondition.id),
    expectedPreconditionIds
  );

  for (const precondition of fixture.requiredPreconditions) {
    assert.equal(precondition.requiredBeforeRuntimeEnablement, true, precondition.id);
    assert.equal(precondition.satisfied, false, precondition.id);
    assert.equal(precondition.status, "blocked", precondition.id);
    assert.equal(Array.isArray(precondition.requiredEvidence), true, precondition.id);
    assert.ok(precondition.requiredEvidence.length >= 3, precondition.id);
    assert.match(precondition.failureMode, /^[a-z0-9]+(?:_[a-z0-9]+)*$/);
  }
});

test("Phase 5.6 precondition gate cannot pass while blockers remain false", async () => {
  const fixture = await readJson(fixtureUrl);

  assert.equal(fixture.gateSummary.gateSatisfied, false);
  assert.equal(fixture.gateSummary.canEnableRuntime, false);
  assert.equal(fixture.requiredPreconditions.every((precondition) => precondition.satisfied), false);
  assert.equal(Object.values(fixture.blockedRuntimeEffect).every((value) => value === false), true);

  for (const precondition of fixture.requiredPreconditions) {
    const mutated = structuredClone(fixture);
    const target = mutated.requiredPreconditions.find((candidate) => candidate.id === precondition.id);
    target.status = "satisfied";
    target.satisfied = true;
    mutated.gateSummary.satisfiedPreconditionCount = 1;

    assert.equal(mutated.gateSummary.canEnableRuntime, false, precondition.id);
    assert.equal(mutated.requiredPreconditions.every((candidate) => candidate.satisfied), false, precondition.id);
  }
});

test("Phase 5.6 keeps every runtime effect and forbidden behavior blocked", async () => {
  const fixture = await readJson(fixtureUrl);

  assertAllFalse(fixture.blockedRuntimeEffect);
  assert.deepEqual(fixture.forbiddenBehavior, [
    "runtime-enabled-true",
    "runtime-command-enabled-true",
    "runtime-start",
    "live-stdin-loop",
    "runtime-stdout-stderr-writer",
    "process-control",
    "transcript-audit-runtime-write",
    "adapter-runtime-behavior",
    "content-fabric-runtime-behavior",
    "websocket-http-runtime-surface",
    "approval-grant-or-evaluator"
  ]);
  assert.ok(fixture.filesForbiddenToChange.includes("apps/cli/src/index.mjs"));
  assert.ok(fixture.filesForbiddenToChange.includes("crates/ardyn-host/src/**"));
});

test("serve-runtime remains default-blocked and dry-run cannot bypass Phase 5.6 gate", async () => {
  const fixture = await readJson(fixtureUrl);
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-6-runtime-gate-"));

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

test("Phase 5.6 does not change CLI runtime source or add runtime primitives", async () => {
  const [{ stdout: baselineSource }, currentSource] = await Promise.all([
    execFileAsync("git", ["show", `${phase55CliBaselineCommit}:apps/cli/src/index.mjs`], {
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
