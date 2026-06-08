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
const matrixUrl = new URL(
  "../tests/fixtures/command-surface/phase5-1/runtime-command-surface-review-matrix.json",
  import.meta.url
);

const topLevelOrder = Object.freeze([
  "schema",
  "schemaVersion",
  "phase",
  "artifactKind",
  "metadataGeneratedAt",
  "scope",
  "candidateRuntimeCommands",
  "rejectionProbeExpectation",
  "nonExecutionInvariants"
]);

const commandEntryFields = Object.freeze([
  "commandName",
  "blockedStatus",
  "requiredPreconditions",
  "expectedStdoutBehavior",
  "expectedStderrBehavior",
  "dryRunBehavior",
  "approvalRequirements",
  "rollbackBehavior"
]);

const hardBoundaryCommands = Object.freeze([
  "serve-runtime",
  "stdio-runtime",
  "replay-session-transcript",
  "external-review-packet",
  "review-packet",
  "runtime-readiness-review",
  "grant-runtime",
  "runtime-implementation-approval",
  "phase-5-1-controlled-runtime-implementation-approval",
  "approve-runtime"
]);

async function readMatrix() {
  const text = await readFile(matrixUrl, "utf8");
  return { text, json: JSON.parse(text) };
}

async function runCliFailure(args, options = {}) {
  try {
    const result = await execFileAsync(process.execPath, [cliPath, ...args], {
      cwd: options.cwd ?? repoRoot,
      encoding: "utf8"
    });
    assert.fail(`Expected ardyn ${args.join(" ")} to fail, got stdout: ${result.stdout}`);
  } catch (error) {
    if (typeof error.code !== "number" || error.stdout === undefined || error.stderr === undefined) {
      throw error;
    }

    return {
      code: error.code,
      stdout: error.stdout,
      stderr: error.stderr
    };
  }
}

function candidateCommandNames(matrix) {
  return matrix.candidateRuntimeCommands.map(({ commandName }) => commandName);
}

function assertAllFalse(record) {
  for (const [field, value] of Object.entries(record)) {
    if (field === "status") {
      assert.equal(value, "blocked", field);
    } else {
      assert.equal(value, false, field);
    }
  }
}

test("Phase 5.1 command-surface matrix is deterministic blocked metadata", async () => {
  const { text, json } = await readMatrix();
  const names = candidateCommandNames(json);

  assert.equal(text.endsWith("\n"), true);
  assert.equal(text.includes("\r"), false);
  assert.deepEqual(Object.keys(json), topLevelOrder);
  assert.equal(json.schema, "ardyn.phase-5.1.runtime-command-surface-review-matrix");
  assert.equal(json.schemaVersion, "0.1.0");
  assert.equal(json.phase, "phase-5.1-controlled-runtime-implementation-approval");
  assert.equal(json.artifactKind, "future-runtime-command-surface-review-matrix");
  assert.equal(json.metadataGeneratedAt, "1970-01-01T00:00:00.000Z");
  assertAllFalse(json.scope);
  assert.equal(new Set(names).size, names.length);

  for (const command of hardBoundaryCommands) {
    assert.ok(names.includes(command), command);
  }

  for (const entry of json.candidateRuntimeCommands) {
    assert.deepEqual(Object.keys(entry), commandEntryFields, entry.commandName);
    assert.match(entry.commandName, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.equal(entry.blockedStatus, "blocked_today", entry.commandName);
    assert.equal(entry.expectedStdoutBehavior, "zero_stdout_while_blocked", entry.commandName);
    assert.equal(entry.expectedStderrBehavior, "usage_stderr_while_blocked", entry.commandName);
    assert.equal(entry.dryRunBehavior, "no_dry_run_surface_while_blocked", entry.commandName);
    assert.ok(entry.requiredPreconditions.length >= 4, entry.commandName);
    assert.ok(entry.approvalRequirements.length >= 2, entry.commandName);
    assert.match(entry.rollbackBehavior, /^must_/, entry.commandName);
  }

  assert.deepEqual(json.rejectionProbeExpectation, {
    exitCode: "nonzero",
    stdout: "empty",
    stderrPrefix: "Usage: ardyn ",
    scratchDirectoryWrites: "none",
    stackOrSecretLeakage: "none"
  });
  assert.ok(json.nonExecutionInvariants.includes("apps-cli-src-index-mjs-unchanged"));
});

test("Phase 5.1 candidate runtime commands remain rejected by the CLI", async () => {
  const [{ json }, cliSource] = await Promise.all([readMatrix(), readFile(cliSourceUrl, "utf8")]);
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-1-command-surface-"));

  try {
    for (const command of candidateCommandNames(json)) {
      const escapedCommand = command.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      assert.doesNotMatch(cliSource, new RegExp(`command === "${escapedCommand}"`), command);

      const failure = await runCliFailure([command], { cwd: scratch });

      assert.notEqual(failure.code, 0, command);
      assert.equal(failure.stdout, "", command);
      assert.match(failure.stderr, /^Usage: ardyn /, command);
      assert.doesNotMatch(failure.stderr, /stack|process\.env|secret/i, command);
      assert.deepEqual(await readdir(scratch), [], `${command} should not write files`);
    }
  } finally {
    await rm(scratch, { recursive: true, force: true });
  }
});

test("Phase 5.1 candidate runtime dry-run variants remain rejected by the CLI", async () => {
  const { json } = await readMatrix();
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-1-command-surface-dry-run-"));

  try {
    for (const command of candidateCommandNames(json)) {
      const failure = await runCliFailure([command, "--dry-run"], { cwd: scratch });

      assert.notEqual(failure.code, 0, command);
      assert.equal(failure.stdout, "", command);
      assert.match(failure.stderr, /^Usage: ardyn /, command);
      assert.doesNotMatch(failure.stderr, /stack|process\.env|secret/i, command);
      assert.deepEqual(await readdir(scratch), [], `${command} --dry-run should not write files`);
    }
  } finally {
    await rm(scratch, { recursive: true, force: true });
  }
});
