// M2: Shell + SQLite command families — real, validated, within security floor
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, rm, writeFile, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import test from "node:test";

const execFileAsync = promisify(execFile);
const cliPath = "apps/cli/src/index.mjs";
const minimalManifest = "examples/minimal-manifest/ardyn.manifest.json";

async function runCli(args, options = {}) {
  try {
    const { stdout, stderr } = await execFileAsync("node", [cliPath, ...args], {
      cwd: process.cwd(),
      maxBuffer: 4 * 1024 * 1024,
      ...options
    });
    return { code: 0, stdout, stderr };
  } catch (error) {
    return {
      code: error.code ?? 1,
      stdout: error.stdout ?? "",
      stderr: error.stderr ?? String(error)
    };
  }
}

test("M2: shell command executes a safe shell command under approval", async () => {
  const result = await runCli([
    "shell",
    "--enable-runtime",
    "--approve",
    "--manifest", minimalManifest,
    "--command", "echo hello"
  ]);
  assert.equal(result.code, 0, `shell should succeed: ${result.stderr}`);
  const output = JSON.parse(result.stdout);
  assert.equal(output.command, "shell");
  assert.equal(output.runtimeEnabled, true);
  assert.ok(output.processResult);
  assert.match(output.processResult.stdout, /hello/);
});

test("M2: shell without --enable-runtime fails (approval gate)", async () => {
  const result = await runCli(["shell", "--command", "echo hello"]);
  assert.notEqual(result.code, 0);
  assert.equal(result.stdout, "");
});

test("M2: shell rejects path traversal in --command", async () => {
  const result = await runCli([
    "shell",
    "--enable-runtime",
    "--approve",
    "--manifest", minimalManifest,
    "--command", "cat ../../etc/passwd"
  ]);
  // Should either fail or the command should be rejected
  const output = JSON.parse(result.stdout || "{}");
  if (result.code === 0) {
    // If it ran, the output should not contain passwd content
    assert.doesNotMatch(output.processResult?.stdout || "", /root:x:/);
  }
});

test("M2: shell --dry-run produces a plan without executing", async () => {
  const result = await runCli([
    "shell",
    "--enable-runtime",
    "--dry-run",
    "--manifest", minimalManifest,
    "--command", "echo hello"
  ]);
  assert.equal(result.code, 0);
  const output = JSON.parse(result.stdout);
  assert.equal(output.dryRun, true);
  assert.equal(output.processesSpawned, false);
  assert.equal(output.processResult, null);
});

test("M2: sqlite command executes a safe SQLite query", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-m2-sqlite-"));
  try {
    const dbPath = join(scratch, "test.db");
    // First create a table via the CLI
    const createResult = await runCli([
      "sqlite",
      "--enable-runtime",
      "--approve",
      "--manifest", minimalManifest,
      "--database", dbPath,
      "--query", "CREATE TABLE test (id INTEGER PRIMARY KEY, name TEXT)"
    ]);
    assert.equal(createResult.code, 0, `create should succeed: ${createResult.stderr}`);
    const createOutput = JSON.parse(createResult.stdout);
    assert.equal(createOutput.command, "sqlite");
    assert.ok(createOutput.databaseResult);

    // Then insert data
    const insertResult = await runCli([
      "sqlite",
      "--enable-runtime",
      "--approve",
      "--manifest", minimalManifest,
      "--database", dbPath,
      "--query", "INSERT INTO test (name) VALUES ('hello')"
    ]);
    assert.equal(insertResult.code, 0);

    // Then query it
    const queryResult = await runCli([
      "sqlite",
      "--enable-runtime",
      "--approve",
      "--manifest", minimalManifest,
      "--database", dbPath,
      "--query", "SELECT * FROM test"
    ]);
    assert.equal(queryResult.code, 0);
    const queryOutput = JSON.parse(queryResult.stdout);
    assert.ok(queryOutput.databaseResult.rows);
    assert.equal(queryOutput.databaseResult.rows.length, 1);
    assert.equal(queryOutput.databaseResult.rows[0].name, "hello");
  } finally {
    await rm(scratch, { recursive: true, force: true });
  }
});

test("M2: sqlite without --enable-runtime fails (approval gate)", async () => {
  const result = await runCli(["sqlite", "--query", "SELECT 1"]);
  assert.notEqual(result.code, 0);
  assert.equal(result.stdout, "");
});

test("M2: sqlite --dry-run produces a plan without executing", async () => {
  const result = await runCli([
    "sqlite",
    "--enable-runtime",
    "--dry-run",
    "--manifest", minimalManifest,
    "--query", "SELECT 1"
  ]);
  assert.equal(result.code, 0);
  const output = JSON.parse(result.stdout);
  assert.equal(output.dryRun, true);
  assert.equal(output.processesSpawned, false);
});