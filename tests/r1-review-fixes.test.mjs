// R1: behavioral tests for the 2026-08-25 review-pass fixes.
// Covers:
//   R1-1  serve-runtime --steps/--replay refuse --dry-run (approval-gate bypass fix)
//   R1-2  shell/sqlite outputs are secret-redacted (canonical-redactor invariant)
//   R1-3  canonical redactor covers colon/JSON/YAML secret shapes
//   R1-4  sqlite row-returning detection (WITH...SELECT / PRAGMA) + change counts
//   R1-5  federation status/config expose the real registryBaseUrl
//   R1-6  CLI internal imports work from any working directory
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const runCli = promisify(execFile);
const repoRoot = fileURLToPath(new URL("../", import.meta.url));
const cliPath = join(repoRoot, "apps", "cli", "src", "index.mjs");
const { redactSecretsDeep } = await import(
  new URL("../packages/core/src/internal/redaction.mjs", import.meta.url)
);

async function runCliJson(args, options = {}) {
  const { stdout } = await runCli("node", [cliPath, ...args], {
    cwd: options.cwd ?? repoRoot,
    maxBuffer: 8 * 1024 * 1024,
  });
  return JSON.parse(stdout);
}

test("R1-1a: serve-runtime --steps refuses --dry-run (no execution without --approve)", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "r1-steps-"));
  try {
    const stepsFile = join(scratch, "steps.json");
    await writeFile(stepsFile, JSON.stringify([
      { label: "should-never-run", command: "node -e \"process.stdout.write('r1-leak')\"" },
    ]));
    await assert.rejects(
      () => runCli("node", [cliPath, "serve-runtime", "--enable-runtime", "--dry-run", "--manifest",
        join(repoRoot, "examples/minimal-manifest/ardyn.manifest.json"), "--steps", stepsFile],
        { cwd: repoRoot, maxBuffer: 8 * 1024 * 1024 }),
      (err) => {
        assert.match(String(err.stderr), /--steps cannot be combined with --dry-run/);
        assert.doesNotMatch(String(err.stdout ?? "") + String(err.stderr), /r1-leak/, "step must not execute");
        return true;
      }
    );
  } finally {
    await rm(scratch, { recursive: true, force: true });
  }
});

test("R1-1b: serve-runtime --steps still executes with --approve (control)", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "r1-steps-ok-"));
  try {
    const stepsFile = join(scratch, "steps.json");
    await writeFile(stepsFile, JSON.stringify([
      { label: "echo-ok", command: "node -e \"process.stdout.write('r1-control-ok')\"" },
    ]));
    const out = await runCliJson([
      "serve-runtime", "--enable-runtime", "--approve", "--manifest",
      join(repoRoot, "examples/minimal-manifest/ardyn.manifest.json"), "--steps", stepsFile,
    ]);
    assert.equal(out.ok, true);
    assert.equal(out.results[0].stdoutPreview, "r1-control-ok");
  } finally {
    await rm(scratch, { recursive: true, force: true });
  }
});

test("R1-1c: serve-runtime --replay refuses --dry-run; still runs with --approve", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "r1-replay-"));
  try {
    const transcriptFile = join(scratch, "transcript.json");
    await writeFile(transcriptFile, JSON.stringify({
      events: [{ type: "command", command: "echo a", exitCode: 0, stdout: "a" }],
    }));
    await assert.rejects(
      () => runCli("node", [cliPath, "serve-runtime", "--enable-runtime", "--dry-run", "--manifest",
        join(repoRoot, "examples/minimal-manifest/ardyn.manifest.json"), "--replay", transcriptFile],
        { cwd: repoRoot, maxBuffer: 8 * 1024 * 1024 }),
      (err) => {
        assert.match(String(err.stderr), /--replay cannot be combined with --dry-run/);
        return true;
      }
    );
    const out = await runCliJson([
      "serve-runtime", "--enable-runtime", "--approve", "--manifest",
      join(repoRoot, "examples/minimal-manifest/ardyn.manifest.json"), "--replay", transcriptFile,
    ]);
    // Same contract as m25's approved-path: echo executor runs, report prints.
    assert.equal(out.replay, true);
    assert.equal(out.totalSteps, 1);
  } finally {
    await rm(scratch, { recursive: true, force: true });
  }
});

test("R1-2a: shell command output is secret-redacted", async () => {
  const out = await runCliJson(["shell", "--enable-runtime", "--approve", "--command", "echo token=supersecret123"]);
  const serialized = JSON.stringify(out);
  assert.doesNotMatch(serialized, /supersecret123/, "raw token value must NOT appear in shell output");
  assert.match(serialized, /REDACTED/, "redaction marker present");
});

test("R1-2b: sqlite fallback/error surfaces are secret-redacted", async () => {
  // Invalid SQL on purpose: error text path must be redacted too.
  const out = await runCliJson(["sqlite", "--enable-runtime", "--approve", "--query", "SELEC token=leakyvalue"]);
  const serialized = JSON.stringify(out);
  assert.doesNotMatch(serialized, /leakyvalue/, "raw token value must NOT appear in sqlite output");
});

test("R1-3a: canonical redactor masks JSON colon-form secrets and keeps JSON parseable", () => {
  const input = '{"config":{"password":"hunter2"},"ok":1}';
  const out = redactSecretsDeep(input);
  assert.doesNotMatch(out, /hunter2/);
  assert.match(out, /REDACTED/);
  assert.deepEqual(JSON.parse(out).config.password, "REDACTED");
});

test("R1-3b: canonical redactor masks bare key:value (YAML-ish) and prefixed keys", () => {
  for (const [input, banned] of [
    ["password: hunter2", /hunter2/],
    ["access_token=zzz-secret", /zzz-secret/],
    ["x-api-key: v1.k2", /v1\.k2/],
  ]) {
    const out = redactSecretsDeep(input);
    assert.doesNotMatch(out, banned, `${input} must be masked`);
    assert.match(out, /REDACTED/);
  }
});

test("R1-3c: canonical redactor does not over-redact lookalike keys or break legacy '=' form", () => {
  assert.match(redactSecretsDeep("tokenizer=bpe"), /tokenizer=bpe/, "tokenizer must survive");
  assert.match(redactSecretsDeep("token=abc123"), /REDACTED/);
  assert.doesNotMatch(redactSecretsDeep("token=abc123"), /abc123/);
});

test("R1-4a: sqlite returns rows for WITH...SELECT (previously silently empty)", async () => {
  const out = await runCliJson(["sqlite", "--enable-runtime", "--approve", "--query",
    "WITH t AS (SELECT 42 AS v) SELECT v FROM t"]);
  assert.equal(out.databaseResult.error, null);
  assert.deepEqual(out.databaseResult.rows, [{ v: 42 }]);
});

test("R1-4b: sqlite reports real change counts for writes (db.changes was always undefined)", async () => {
  // Pre-fix: changes came from db.changes ?? 0 and node:sqlite's DatabaseSync
  // exposes no .changes field, so EVERY write reported changes: 0.
  const scratch = await mkdtemp(join(tmpdir(), "r1-sqlite-"));
  try {
    const dbFile = join(scratch, "r14b.sqlite");
    const create = await runCliJson(["sqlite", "--enable-runtime", "--approve",
      "--database", dbFile, "--query", "CREATE TABLE r14b(x)"]);
    assert.equal(create.databaseResult.error, null, JSON.stringify(create.databaseResult));
    const write = await runCliJson(["sqlite", "--enable-runtime", "--approve",
      "--database", dbFile, "--query", "INSERT INTO r14b VALUES (7)"]);
    assert.equal(write.databaseResult.error, null);
    assert.equal(write.databaseResult.changes, 1, "single INSERT must report exactly 1 change");
  } finally {
    await rm(scratch, { recursive: true, force: true });
  }
});

test("R1-5: federation status/config surface the configured registryBaseUrl", async () => {
  const url = "https://registry.example.invalid";
  const statusOut = await runCliJson(["federation", "status"], {});
  assert.equal(statusOut.config.registryUrl, null, "unset env -> null (not crash)");
  const { stdout } = await runCli("node", [cliPath, "federation", "status"], {
    cwd: repoRoot,
    maxBuffer: 8 * 1024 * 1024,
    env: { ...process.env, ARDYN_FABRIC_REGISTRY_URL: url },
  });
  assert.equal(JSON.parse(stdout).config.registryUrl, url);
});

test("R1-6: CLI works from an unrelated working directory (cwd-independent imports)", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "r1-cwd-"));
  try {
    const out = await runCliJson(["doctor"], { cwd: scratch });
    assert.equal(out.status, "ok");
  } finally {
    await rm(scratch, { recursive: true, force: true });
  }
});
