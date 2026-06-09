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
const phase41IDocUrl = new URL(
  "../docs/phase-4-1i-rust-host-stdio-harness.md",
  import.meta.url
);
const reportScriptUrl = new URL("../scripts/report-phase-status.mjs", import.meta.url);
const cliPath = fileURLToPath(cliSourceUrl);
const reportScriptPath = fileURLToPath(reportScriptUrl);

const forbiddenRuntimeCommands = Object.freeze([
  "serve-runtime",
  "stdio-runtime",
  "replay-session-transcript",
  "policy-metadata",
  "host-policy-export",
  "external-review-packet",
  "review-packet",
  "runtime-readiness-review",
  "rust-host-stdio-harness",
  "stdio-harness",
  "runtime-harness",
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

test("Phase 4.1I report records private Rust stdio harness tests without runtime approval", async () => {
  const report = await runReport();
  const inventory = report.phase41IRustHostStdioHarnessInventory;

  assert.equal(report.phase.id, "5.13");
  assert.equal(inventory.harnessLayer.privateRustCfgTestHarness, true);
  assert.equal(inventory.harnessLayer.inMemoryOnly, true);
  assert.equal(inventory.harnessLayer.productionRuntimeSourceChanged, false);
  assert.equal(inventory.ownershipBoundary.rustTestHarnessSourceChangedByThisPhase, true);
  assert.equal(inventory.ownershipBoundary.productionRuntimeSourceChangedByThisPhase, false);
  assert.equal(inventory.ownershipBoundary.cliSourceChangedByThisPhase, false);
  assert.equal(inventory.runtimeEffect.runtimeEnabled, false);
  assert.equal(inventory.runtimeEffect.grantsRuntimeApproval, false);
  assert.equal(inventory.runtimeEffect.processStdioOwnershipAdded, false);
  assert.equal(inventory.safetyPosture.privateRustTestHarnessOnly, true);
  assert.equal(inventory.safetyPosture.runtimeBlocked, true);
});

test("Phase 4.1I runtime-like commands remain rejected with zero stdout", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase4-1i-probes-"));

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

test("Phase 4.1I source guard keeps CLI unchanged and Rust harness test-only", async () => {
  const [cliSource, rustSource, phase41IDoc] = await Promise.all([
    readFile(cliSourceUrl, "utf8"),
    readFile(rustHostSourceUrl, "utf8"),
    readFile(phase41IDocUrl, "utf8")
  ]);
  const commandBranches = [...cliSource.matchAll(/if \(command === "([^"]+)"\)/g)].map(
    (match) => match[1]
  );
  const usage = cliSource.match(/Usage: ardyn <([^"]+)>/)?.[1] ?? "";
  const cfgTestIndex = rustSource.indexOf("#[cfg(test)]");
  const harnessIndex = rustSource.indexOf("TEST_STDIO_HARNESS_EVENT_SCHEMA");
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
  assert.ok(cfgTestIndex >= 0, "Rust test module must be cfg(test)");
  assert.ok(harnessIndex > cfgTestIndex, "Phase 4.1I harness helpers must remain under cfg(test)");
  assert.doesNotMatch(rustSource, /pub\s+fn\s+run_test_stdio_harness/);
  assert.match(phase41IDoc, /private Rust `#\[cfg\(test\)\]` coverage/);
  assert.match(phase41IDoc, /Production runtime source changes \| No/);

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
