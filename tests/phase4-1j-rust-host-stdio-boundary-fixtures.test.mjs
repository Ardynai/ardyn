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
const rustHostSourceUrl = new URL("../crates/ardyn-host/src/lib.rs", import.meta.url);
const reportScriptUrl = new URL("../scripts/report-phase-status.mjs", import.meta.url);
const fixtureDirUrl = new URL("../tests/fixtures/stdio-harness/phase4-1j/", import.meta.url);
const expectedOutcomesUrl = new URL("expected-outcomes.json", fixtureDirUrl);
const cliPath = fileURLToPath(cliSourceUrl);
const reportScriptPath = fileURLToPath(reportScriptUrl);

const expectedCaseNames = Object.freeze([
  "valid-single-event",
  "valid-multiple-events",
  "malformed-json",
  "non-object-json",
  "missing-required-fields",
  "invalid-event-kind",
  "crlf-rejected",
  "missing-final-lf",
  "empty-input",
  "invalid-utf8",
  "oversized-payload",
  "oversized-input",
  "early-eof-partial-frame",
  "runtime-approval-request-rejected"
]);

const expectedFixtureFiles = Object.freeze([
  "expected-outcomes.json",
  "valid-single-event.jsonl",
  "valid-multiple-events.jsonl",
  "malformed-json.jsonl",
  "non-object-json.jsonl",
  "missing-required-fields.jsonl",
  "invalid-event-kind.jsonl",
  "oversized-payload.jsonl",
  "oversized-input.jsonl",
  "runtime-approval-request-rejected.jsonl"
]);

const forbiddenRuntimeCommands = Object.freeze([
  "serve-runtime",
  "stdio-runtime",
  "replay-session-transcript",
  "policy-metadata",
  "host-policy-export",
  "external-review-packet",
  "review-packet",
  "runtime-readiness-review",
  "fixture-backed-stdio-boundary",
  "stdio-boundary",
  "public-runtime-contract",
  "rust-host-stdio-harness",
  "stdio-harness",
  "runtime-harness",
  "runtime-readiness",
  "runtime-readiness-checkpoint",
  "approve-runtime",
  "grant-runtime",
  "enable-runtime",
  "approval-evaluator",
  "transport-harness",
  "stdin-reader",
  "stdout-writer",
  "stderr-writer",
  "failure-audit",
  "cleanup-runtime",
  "kill-runtime"
]);

async function readJson(url) {
  return JSON.parse(await readFile(url, "utf8"));
}

async function runReport() {
  const { stdout, stderr } = await execFileAsync(process.execPath, [reportScriptPath], {
    cwd: repoRoot,
    encoding: "utf8"
  });

  assert.equal(stderr, "");
  return JSON.parse(stdout);
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

function assertAllFalse(record) {
  for (const [field, value] of Object.entries(record)) {
    assert.equal(value, false, field);
  }
}

test("Phase 4.1J fixture suite covers concrete stdio boundary cases without runtime effect", async () => {
  const suite = await readJson(expectedOutcomesUrl);

  assert.equal(suite.schema, "ardyn.phase-4.1j.stdio-harness-fixtures");
  assert.equal(suite.schemaVersion, "0.1.0");
  assert.equal(suite.phase, "phase-4.1j-stdio-harness-fixtures");
  assert.equal(suite.fixtureKind, "private-rust-stdio-harness-stream-cases");
  assert.equal(suite.harness.scope, "private-rust-cfg-test-only");
  assert.equal(suite.harness.maxFrameBytes, 256);
  assert.equal(suite.harness.lineEnding, "lf-only");
  assertAllFalse(suite.runtimeEffect);

  assert.deepEqual(
    suite.cases.map((fixtureCase) => fixtureCase.name),
    expectedCaseNames
  );

  for (const fixtureCase of suite.cases) {
    assert.equal(typeof fixtureCase.expected.accepted, "boolean", fixtureCase.name);
    assert.equal(fixtureCase.expected.runtimeEnabled ?? false, false, fixtureCase.name);
    assert.equal(fixtureCase.expected.approvalGranted ?? false, false, fixtureCase.name);

    for (const event of fixtureCase.expected.stdoutEvents) {
      assert.equal(event.runtimeEnabled, false, fixtureCase.name);
      assert.equal(event.approvalGranted, false, fixtureCase.name);
    }

    if (fixtureCase.inputRepresentation === "file") {
      assert.ok(expectedFixtureFiles.includes(fixtureCase.inputFile), fixtureCase.inputFile);
      const bytes = await readFile(new URL(fixtureCase.inputFile, fixtureDirUrl));
      assert.equal(bytes.includes(0x0d), false, `${fixtureCase.name} must be LF-only`);
      assert.equal(bytes.at(-1), 0x0a, `${fixtureCase.name} must end with LF`);
    }
  }

  const oversizedInput = await readFile(new URL("oversized-input.jsonl", fixtureDirUrl));
  assert.ok(oversizedInput.length > 768, "oversized-input fixture must exceed stream limit");

  const oversizedPayload = await readFile(new URL("oversized-payload.jsonl", fixtureDirUrl));
  assert.ok(oversizedPayload.length > 256, "oversized-payload fixture must exceed frame limit");

  const invalidUtf8 = suite.cases.find((fixtureCase) => fixtureCase.name === "invalid-utf8");
  assert.equal(invalidUtf8.inputRepresentation, "hex");
  assert.equal(invalidUtf8.inputHex, "ff0a");
});

test("Phase 4.1J report inventories fixture-backed Rust harness coverage without runtime readiness", async () => {
  const report = await runReport();
  const inventory = report.phase41JFixtureBackedStdioBoundaryInventory;

  assert.deepEqual(report.phase, {
    id: "5.11",
    name: "Runtime stdio safety boundary",
    executionPosture:
      "runtime-stdio-safety-boundary-contract runtime-disabled no-runtime-execution"
  });
  assert.equal(inventory.boundaryLayer.fixtureBackedRustHostCoverage, true);
  assert.equal(inventory.boundaryLayer.privateRustCfgTestHarness, true);
  assert.equal(inventory.boundaryLayer.publicRuntimeContractIntroduced, false);
  assert.equal(inventory.boundaryLayer.runtimeReadinessClaimed, false);
  assert.equal(inventory.ownershipBoundary.rustTestHarnessSourceChangedByThisPhase, true);
  assert.equal(inventory.ownershipBoundary.productionRuntimeSourceChangedByThisPhase, false);
  assert.equal(inventory.ownershipBoundary.cliSourceChangedByThisPhase, false);
  assert.deepEqual(inventory.fixtures.map(({ path, status }) => [path, status]), [
    ...expectedFixtureFiles.map((filename) => [
      `tests/fixtures/stdio-harness/phase4-1j/${filename}`,
      "present"
    ])
  ]);
  assert.equal(inventory.runtimeEffect.runtimeEnabled, false);
  assert.equal(inventory.runtimeEffect.runtimeReadinessClaimed, false);
  assert.equal(inventory.runtimeEffect.grantsRuntimeApproval, false);
  assert.equal(inventory.safetyPosture.privateRustTestHarnessOnly, true);
  assert.equal(inventory.safetyPosture.runtimeBlocked, true);
});

test("Phase 4.1J runtime-like commands remain rejected with zero stdout", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase4-1j-probes-"));

  try {
    for (const command of forbiddenRuntimeCommands) {
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

test("Phase 4.1J source guard keeps CLI unchanged and Rust fixture harness private", async () => {
  const [cliSource, rustSource] = await Promise.all([
    readFile(cliSourceUrl, "utf8"),
    readFile(rustHostSourceUrl, "utf8")
  ]);
  const commandBranches = [...cliSource.matchAll(/if \(command === "([^"]+)"\)/g)].map(
    (match) => match[1]
  );
  const usage = cliSource.match(/Usage: ardyn <([^"]+)>/)?.[1] ?? "";
  const cfgTestIndex = rustSource.indexOf("#[cfg(test)]");
  const fixtureRootIndex = rustSource.indexOf("TEST_STDIO_HARNESS_PHASE_4_1J_FIXTURE_ROOT");
  const rustProductionSource = rustSource.split(/\n#\[cfg\(test\)\]\n/)[0];

  assert.deepEqual(commandBranches, [
    "doctor",
    "identity",
    "capabilities",
    "plan",
    "review-trace",
    "review-artifact",
    "validate-session-transcript",
    "emit-session-events",
    "serve"
  ]);
  assert.ok(fixtureRootIndex > cfgTestIndex, "Phase 4.1J fixture loader must stay under cfg(test)");
  assert.doesNotMatch(rustSource, /pub\s+fn\s+run_test_stdio_harness/);
  assert.doesNotMatch(rustSource, /pub\s+fn\s+.*phase_4_1j/i);

  for (const command of forbiddenRuntimeCommands) {
    const escapedCommand = command.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    assert.doesNotMatch(cliSource, new RegExp(`command === "${escapedCommand}"`));
    assert.doesNotMatch(usage, new RegExp(`(^|\\||<)${escapedCommand}(\\||>|\\s|$)`));
  }

  for (const forbiddenPattern of [
    /process\.stdin/,
    /node:readline/,
    /node:http/,
    /node:https/,
    /node:net/,
    /node:dgram/,
    /\bfetch\s*\(/,
    /\bWebSocket\s*\(/,
    /\bspawn\s*\(/,
    /\bfork\s*\(/,
    /\bcreateServer\s*\(/,
    /\.listen\s*\(/,
    /process\.kill\s*\(/
  ]) {
    assert.doesNotMatch(cliSource, forbiddenPattern);
  }

  for (const forbiddenPattern of [
    /std::io::stdin/,
    /std::io::stdout/,
    /std::io::stderr/,
    /\bstdin\s*\(/,
    /\bstdout\s*\(/,
    /\bstderr\s*\(/,
    /std::process/,
    /Command::new/,
    /TcpListener/,
    /TcpStream/,
    /UdpSocket/,
    /thread::spawn/,
    /tokio/,
    /async-std/,
    /println!/,
    /eprintln!/
  ]) {
    assert.doesNotMatch(rustProductionSource, forbiddenPattern);
  }
});
