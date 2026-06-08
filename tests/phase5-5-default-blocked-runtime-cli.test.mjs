import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";

const execFileAsync = promisify(execFile);
const repoRootUrl = new URL("../", import.meta.url);
const repoRoot = fileURLToPath(repoRootUrl);
const cliSourceUrl = new URL("../apps/cli/src/index.mjs", import.meta.url);
const cliPath = fileURLToPath(cliSourceUrl);
const fixtureUrl = new URL(
  "../tests/fixtures/command-surface/phase5-5/default-blocked-runtime-cli.json",
  import.meta.url
);

const expectedTopLevelKeys = Object.freeze([
  "schema",
  "schemaVersion",
  "phase",
  "artifactKind",
  "metadataGeneratedAt",
  "sourceReviewDisposition",
  "implementedCommandSurface",
  "runtimeEffect",
  "blockedBehavior",
  "remainingBlockers",
  "filesAllowedToChange",
  "filesForbiddenToChange",
  "nonExecutionInvariants",
  "validationCommands"
]);

async function readJson(url) {
  return JSON.parse(await readFile(url, "utf8"));
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

test("Phase 5.5 default-blocked runtime CLI fixture is deterministic metadata", async () => {
  const raw = await readFile(fixtureUrl, "utf8");
  const fixture = JSON.parse(raw);

  assert.equal(raw.endsWith("\n"), true);
  assert.equal(raw.includes("\r"), false);
  assert.deepEqual(Object.keys(fixture), expectedTopLevelKeys);
  assert.equal(fixture.schema, "ardyn.phase-5.5.default-blocked-runtime-cli");
  assert.equal(fixture.schemaVersion, "0.1.0");
  assert.equal(fixture.phase, "phase-5.5-default-blocked-runtime-cli");
  assert.equal(fixture.metadataGeneratedAt, "1970-01-01T00:00:00.000Z");
  assert.deepEqual(fixture.sourceReviewDisposition, {
    sourcePhase: "phase-5.4a-jules-review-disposition",
    sourceFixture: "tests/fixtures/command-surface/phase5-4a/jules-review-disposition.json",
    julesVerdict: "APPROVE",
    mayProceedToNextStillDefaultBlockedCliCommandImplementationPhase: true,
    runtimeEnablementApproved: false
  });
});

test("Phase 5.5 recognizes serve-runtime but keeps runtime unavailable", async () => {
  const fixture = await readJson(fixtureUrl);

  assert.deepEqual(fixture.implementedCommandSurface, {
    commandName: "serve-runtime",
    recognizedByCli: true,
    runtimeEnabled: false,
    runtimeCommandEnabled: false,
    runtimeExecutionEnabled: false,
    defaultResult: "recognized_unavailable_nonzero_zero_stdout",
    dryRunResult: "recognized_unavailable_nonzero_zero_stdout",
    stdout: "",
    stderr:
      "Usage: ardyn serve-runtime [--dry-run]\nRuntime unavailable: serve-runtime is recognized, but runtime is not enabled in Phase 5.5.\n",
    exitCode: "nonzero"
  });

  assert.deepEqual(fixture.runtimeEffect, {
    runtimeEnabled: false,
    runtimeStarted: false,
    runtimeReady: false,
    runtimeCommandEnabled: false,
    runtimeExecutionEnabled: false,
    approvalCommandEnabled: false,
    approvalGrantCreated: false,
    approvalEvaluatorEnabled: false,
    stdinLoopEnabled: false,
    stdoutStderrWritersEnabled: false,
    processControlEnabled: false,
    transcriptAuditSideEffectsEnabled: false,
    adapterRuntimeBehaviorEnabled: false,
    contentFabricRuntimeBehaviorEnabled: false,
    webSocketHttpSurfaceEnabled: false
  });
});

test("serve-runtime and serve-runtime --dry-run fail closed with deterministic stderr", async () => {
  const fixture = await readJson(fixtureUrl);
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-5-runtime-cli-"));

  try {
    for (const invocation of [
      fixture.blockedBehavior.defaultInvocation,
      fixture.blockedBehavior.dryRunInvocation
    ]) {
      const failure = await runCliFailure(invocation.args, { cwd: scratch });
      const label = invocation.args.join(" ");

      assert.notEqual(failure.code, 0, label);
      assert.equal(failure.stdout, "", label);
      assert.equal(failure.stderr, fixture.implementedCommandSurface.stderr, label);
      assert.match(failure.stderr, /Runtime unavailable: serve-runtime is recognized/);
      assert.doesNotMatch(failure.stderr, /stack|process\.env|secret/i, label);
      assert.deepEqual(await readdir(scratch), [], `${label} should not write files`);
    }
  } finally {
    await rm(scratch, { recursive: true, force: true });
  }
});

test("Phase 5.5 CLI change stays narrow and avoids runtime primitives", async () => {
  const source = await readFile(cliSourceUrl, "utf8");

  assert.match(source, /DEFAULT_BLOCKED_RUNTIME_COMMANDS\.has\(command\)/);
  assert.match(source, /createDefaultBlockedRuntimeCommandMessage\(command\)/);

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
    /\bappendFile\s*\(/
  ]) {
    assert.doesNotMatch(source, forbiddenPattern);
  }
});
