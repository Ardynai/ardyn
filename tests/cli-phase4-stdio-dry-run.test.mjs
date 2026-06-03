import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { promisify } from "node:util";
import test from "node:test";

import {
  createStdioDryRunSessionEvents,
  formatSessionEventsJsonl
} from "../packages/core/src/index.mjs";

const execFileAsync = promisify(execFile);
const minimalManifestPath = "examples/minimal-manifest/ardyn.manifest.json";
const minimalTaskPath = "examples/minimal-task/task.json";
const validMinimalTranscriptPath = "examples/session-transcripts/valid-minimal.json";
const goldenMinimalJsonlPath = "tests/fixtures/stdio-dry-run/phase4-0b-minimal-session-events.jsonl";
const schemaInvalidTaskPath = "tests/fixtures/tasks/invalid-missing-objective.json";

async function readJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

async function runCliRaw(args, options = {}) {
  return execFileAsync(process.execPath, [resolve("apps/cli/src/index.mjs"), ...args], {
    cwd: options.cwd ?? process.cwd(),
    encoding: "utf8"
  });
}

async function runCliFailure(args) {
  try {
    const result = await runCliRaw(args);
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

function assertCliFailure(failure, stderrPattern) {
  assert.notEqual(failure.code, 0);
  assert.equal(failure.stdout, "");
  assert.match(failure.stderr, stderrPattern);
}

function assertAllFalse(flags) {
  for (const [key, value] of Object.entries(flags)) {
    assert.equal(value, false, `${key} should remain false`);
  }
}

test("ardyn emit-session-events --dry-run writes deterministic session-event JSONL to stdout only", async () => {
  const manifest = await readJson(minimalManifestPath);
  const task = await readJson(minimalTaskPath);
  const expectedJsonl = await readFile(goldenMinimalJsonlPath, "utf8");
  const expectedEvents = createStdioDryRunSessionEvents(manifest, task, {
    manifestPath: minimalManifestPath,
    taskPath: minimalTaskPath
  });
  const { stdout, stderr } = await runCliRaw([
    "emit-session-events",
    "--dry-run",
    "--manifest",
    minimalManifestPath,
    "--task",
    minimalTaskPath
  ]);

  assert.equal(stderr, "");
  assert.equal(formatSessionEventsJsonl(expectedEvents), expectedJsonl);
  assert.equal(stdout, expectedJsonl);
  assert.doesNotMatch(stdout, /\r\n/);
  assert.equal(stdout.endsWith("\n"), true);

  const events = stdout.trimEnd().split("\n").map((line) => JSON.parse(line));
  assert.deepEqual(
    events.map((event) => event.eventType),
    [
      "session.started",
      "session.heartbeat",
      "session.capabilities",
      "task.planned",
      "approval.recorded",
      "session.completed"
    ]
  );
  assert.deepEqual(
    events.map((event) => event.sequence),
    [1, 2, 3, 4, 5, 6]
  );

  for (const event of events) {
    assert.equal(event.nonExecuting, true);
    assertAllFalse(event.safety);
  }
});

test("ardyn emit-session-events --dry-run performs no file side effects", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-stdio-dry-run-"));

  try {
    assert.deepEqual(await readdir(scratch), []);

    const { stderr } = await runCliRaw(
      [
        "emit-session-events",
        "--dry-run",
        "--manifest",
        resolve(minimalManifestPath),
        "--task",
        resolve(minimalTaskPath)
      ],
      { cwd: scratch }
    );

    assert.equal(stderr, "");
    assert.deepEqual(await readdir(scratch), []);
  } finally {
    await rm(scratch, { recursive: true, force: true });
  }
});

test("ardyn emit-session-events rejects missing dry-run mode and unsafe local paths on stderr only", async () => {
  assertCliFailure(
    await runCliFailure([
      "emit-session-events",
      "--manifest",
      minimalManifestPath,
      "--task",
      minimalTaskPath
    ]),
    /Only emit-session-events --dry-run is available in Phase 4\.0B\./
  );

  assertCliFailure(
    await runCliFailure([
      "emit-session-events",
      "--dry-run",
      "--manifest",
      "https://example.test/manifest.json",
      "--task",
      minimalTaskPath
    ]),
    /manifest must be a local JSON file path\./
  );

  assertCliFailure(
    await runCliFailure([
      "emit-session-events",
      "--dry-run",
      "--manifest",
      minimalManifestPath,
      "--task",
      "file:///C:/tmp/task.json"
    ]),
    /task must be a local JSON file path\./
  );

  assertCliFailure(
    await runCliFailure([
      "emit-session-events",
      "--dry-run",
      "--manifest",
      minimalManifestPath,
      "--task",
      "\\\\server\\share\\task.json"
    ]),
    /task must be a local JSON file path\./
  );
});

test("ardyn emit-session-events rejects unreadable, invalid JSON, and schema-invalid inputs without stdout", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-stdio-dry-run-failures-"));

  try {
    const missingManifestPath = join(scratch, "missing-manifest.json");
    const missingTaskPath = join(scratch, "missing-task.json");
    const invalidJsonManifestPath = join(scratch, "invalid-json-manifest.json");
    const invalidJsonTaskPath = join(scratch, "invalid-json-task.json");
    const schemaInvalidManifestPath = join(scratch, "schema-invalid-manifest.json");

    await writeFile(invalidJsonManifestPath, "{ invalid manifest json\n", "utf8");
    await writeFile(invalidJsonTaskPath, "{ invalid task json\n", "utf8");
    await writeFile(schemaInvalidManifestPath, "{}\n", "utf8");

    assertCliFailure(
      await runCliFailure([
        "emit-session-events",
        "--dry-run",
        "--manifest",
        missingManifestPath,
        "--task",
        minimalTaskPath
      ]),
      /manifest could not be read:/
    );

    assertCliFailure(
      await runCliFailure([
        "emit-session-events",
        "--dry-run",
        "--manifest",
        minimalManifestPath,
        "--task",
        missingTaskPath
      ]),
      /task could not be read:/
    );

    assertCliFailure(
      await runCliFailure([
        "emit-session-events",
        "--dry-run",
        "--manifest",
        invalidJsonManifestPath,
        "--task",
        minimalTaskPath
      ]),
      /manifest is not valid JSON:/
    );

    assertCliFailure(
      await runCliFailure([
        "emit-session-events",
        "--dry-run",
        "--manifest",
        minimalManifestPath,
        "--task",
        invalidJsonTaskPath
      ]),
      /task is not valid JSON:/
    );

    assertCliFailure(
      await runCliFailure([
        "emit-session-events",
        "--dry-run",
        "--manifest",
        schemaInvalidManifestPath,
        "--task",
        minimalTaskPath
      ]),
      /Invalid ARDYN manifest:/
    );

    assertCliFailure(
      await runCliFailure([
        "emit-session-events",
        "--dry-run",
        "--manifest",
        minimalManifestPath,
        "--task",
        schemaInvalidTaskPath
      ]),
      /Invalid ARDYN task:/
    );
  } finally {
    await rm(scratch, { recursive: true, force: true });
  }
});

test("ardyn emit-session-events rejects unknown, duplicate, and positional args before emitting stdout", async () => {
  for (const [args, pattern] of [
    [
      [
        "emit-session-events",
        "--dry-run",
        "--manifest",
        minimalManifestPath,
        "--task",
        minimalTaskPath,
        "--unknown"
      ],
      /Unknown emit-session-events option: --unknown\./
    ],
    [
      [
        "emit-session-events",
        "--dry-run=true",
        "--manifest",
        minimalManifestPath,
        "--task",
        minimalTaskPath
      ],
      /Unknown emit-session-events option: --dry-run=true\./
    ],
    [
      [
        "emit-session-events",
        "--dry-run",
        "--manifest",
        minimalManifestPath,
        "--task",
        minimalTaskPath,
        "extra-positional"
      ],
      /Unexpected emit-session-events argument: extra-positional\./
    ],
    [
      [
        "emit-session-events",
        "--dry-run",
        "--dry-run",
        "--manifest",
        minimalManifestPath,
        "--task",
        minimalTaskPath
      ],
      /Duplicate emit-session-events option: --dry-run\./
    ],
    [
      [
        "emit-session-events",
        "--dry-run",
        "--manifest",
        "--task",
        minimalTaskPath
      ],
      /Missing required --manifest path\./
    ]
  ]) {
    assertCliFailure(await runCliFailure(args), pattern);
  }
});

test("local-only path policy is shared by transcript validation inputs", async () => {
  for (const filePath of ["C:relative\\transcript.json", "-", "transcript\n.json"]) {
    const failure = await runCliFailure([
      "validate-session-transcript",
      "--file",
      filePath,
      "--summary"
    ]);

    assertCliFailure(failure, /--file must be a local JSON file path\./);
  }

  const { stdout, stderr } = await runCliRaw([
    "validate-session-transcript",
    "--file",
    validMinimalTranscriptPath,
    "--summary"
  ]);

  assert.equal(stderr, "");
  assert.equal(JSON.parse(stdout).output, "summary");
});

test("Phase 4 CLI and dry-run core source do not add live stdin loops, listeners, subprocesses, or adapter calls", async () => {
  const cliSource = await readFile("apps/cli/src/index.mjs", "utf8");
  const coreSource = await readFile("packages/core/src/index.mjs", "utf8");
  const runtimeForbiddenPatterns = [
    /process\.stdin/,
    /node:child_process/,
    /from\s+["']child_process["']/,
    /require\s*\(\s*["'](?:node:)?child_process["']\s*\)/,
    /node:http/,
    /node:https/,
    /node:net/,
    /node:dgram/,
    /\bfetch\s*\(/,
    /\bWebSocket\b/,
    /\bspawn\s*\(/,
    /\bexecFile\s*\(/,
    /childProcess\.(?:exec|execFile|spawn)\s*\(/,
    /\bcreateServer\s*\(/,
    /\blisten\s*\(/,
    /@ardyn\/adapters/,
    /@ardyn\/fabric/,
    /@ardyn\/mcp/
  ];
  const cliOnlyForbiddenPatterns = [
    /\bopenclaw\b/i,
    /\blocus\b/i
  ];

  for (const pattern of runtimeForbiddenPatterns) {
    assert.doesNotMatch(cliSource, pattern);
    assert.doesNotMatch(coreSource, pattern);
  }

  for (const pattern of cliOnlyForbiddenPatterns) {
    assert.doesNotMatch(cliSource, pattern);
  }
});
