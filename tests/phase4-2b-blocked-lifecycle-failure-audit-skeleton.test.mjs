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
const rustHostSourceDirUrl = new URL("../crates/ardyn-host/src/", import.meta.url);
const rustSkeletonUrl = new URL("stdio_runtime/mod.rs", rustHostSourceDirUrl);
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase4-2b/lifecycle-failure-audit-skeleton-plan.json",
  import.meta.url
);
const phase42AFixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase4-2a/blocked-stdio-runtime-skeleton-plan.json",
  import.meta.url
);
const phase41EFailureAuditUrl = new URL(
  "../tests/fixtures/host-policy/phase4-1e/valid-static-failure-audit-record.json",
  import.meta.url
);

const runtimeLikeCommands = Object.freeze([
  "serve-runtime",
  "stdio-runtime",
  "replay-session-transcript",
  "external-review-packet",
  "review-packet",
  "runtime-readiness-review",
  "runtime-implementation-readiness",
  "phase-4-2a-runtime-skeleton",
  "phase-4-2b-lifecycle-runtime",
  "phase-4-2b-failure-audit",
  "runtime-lifecycle",
  "failure-audit-runtime",
  "cleanup-runtime",
  "kill-runtime",
  "runtime-skeleton",
  "approve-runtime",
  "grant-runtime",
  "enable-runtime"
]);

async function readJson(url) {
  return JSON.parse(await readFile(url, "utf8"));
}

async function rustSourceFiles(dirUrl = rustHostSourceDirUrl) {
  const entries = await readdir(dirUrl, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const childUrl = new URL(entry.name, dirUrl);
    if (entry.isDirectory()) {
      files.push(...(await rustSourceFiles(new URL(`${entry.name}/`, dirUrl))));
    } else if (entry.isFile() && entry.name.endsWith(".rs")) {
      files.push(childUrl);
    }
  }

  return files;
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

test("Phase 4.2B fixture records blocked lifecycle and failure-audit expectations", async () => {
  const [fixture, phase42A, phase41E] = await Promise.all([
    readJson(fixtureUrl),
    readJson(phase42AFixtureUrl),
    readJson(phase41EFailureAuditUrl)
  ]);

  assert.equal(fixture.schema, "ardyn.phase-4.2b.blocked-lifecycle-failure-audit-skeleton-plan");
  assert.equal(fixture.schemaVersion, "0.1.0");
  assert.equal(fixture.phase, "phase-4.2b-blocked-lifecycle-failure-audit-skeleton");
  assert.equal(fixture.metadataGeneratedAt, "1970-01-01T00:00:00.000Z");
  assert.equal(
    fixture.reusedFixtures.blockedRuntimeSkeleton,
    "tests/fixtures/host-policy/phase4-2a/blocked-stdio-runtime-skeleton-plan.json"
  );
  assert.equal(phase42A.phase, "phase-4.2a-blocked-stdio-runtime-skeleton");
  assert.equal(phase41E.recordPhase, "phase-4.1e-failure-audit-kill-semantics");
  assert.equal(fixture.rustLifecycleSkeleton.crateModuleVisibility, "private");
  assert.ok(fixture.rustLifecycleSkeleton.helperFunctions.includes("blocked_stdio_runtime_kill_request"));

  assert.deepEqual(
    fixture.blockedLifecycleRequests.map(({ name, action, expectedStatus, expectedBlockReason }) => [
      name,
      action,
      expectedStatus,
      expectedBlockReason
    ]),
    [
      ["blocked-start-request", "start", "start_blocked", "start_unavailable"],
      ["blocked-stop-request", "stop", "stop_blocked", "stop_unavailable"],
      ["blocked-kill-request", "kill", "kill_blocked", "kill_unavailable"],
      ["blocked-execute-request", "execute", "execution_blocked", "execution_unavailable"]
    ]
  );
  assertAllFalse(fixture.blockedWriteSideEffects);
  assertAllFalse(fixture.runtimeEffect);
  assert.equal(fixture.deterministicFailureAudit.plannedOnly, true);
  assert.equal(fixture.deterministicFailureAudit.emitted, false);
  assert.equal(fixture.deterministicFailureAudit.containsProcessId, false);
});

test("Phase 4.2B Rust skeleton is private planning code without process identity", async () => {
  const source = await readFile(rustSkeletonUrl, "utf8");

  assert.match(source, /pub enum StdioRuntimeLifecycleAction/);
  assert.match(source, /pub struct StdioRuntimeLifecycleTransitionPlan/);
  assert.match(source, /pub struct StdioRuntimeFailureAuditPlan/);
  assert.match(source, /pub struct StdioRuntimeKillSemanticsPlan/);
  assert.match(source, /pub fn blocked_stdio_runtime_start_request/);
  assert.match(source, /pub fn blocked_stdio_runtime_stop_request/);
  assert.match(source, /pub fn blocked_stdio_runtime_kill_request/);
  assert.match(source, /pub fn plan_stdio_runtime_lifecycle_transition/);
  assert.doesNotMatch(source.split(/\n#\[cfg\(test\)\]/)[0], /\b(process_id|pid|child_pid)\b/i);
});

test("Phase 4.2B source guard keeps CLI unchanged and bans live process surfaces", async () => {
  const cliSource = await readFile(cliSourceUrl, "utf8");
  const commandBranches = [...cliSource.matchAll(/if \(command === "([^"]+)"\)/g)].map(
    (match) => match[1]
  );
  const usage = cliSource.match(/Usage: ardyn <([^"]+)>/)?.[1] ?? "";

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

  for (const command of runtimeLikeCommands) {
    const escapedCommand = command.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    assert.doesNotMatch(cliSource, new RegExp(`command === "${escapedCommand}"`));
    assert.doesNotMatch(usage, new RegExp(`(^|\\||<)${escapedCommand}(\\||>|\\s|$)`));
  }

  const forbiddenRustPatterns = [
    /std::io::stdin/,
    /std::io::stdout/,
    /std::io::stderr/,
    /std::process/,
    /Command::new/,
    /std::fs::/,
    /File::create/,
    /OpenOptions/,
    /TcpListener/,
    /TcpStream/,
    /UdpSocket/,
    /thread::spawn/,
    /tokio::/,
    /async_std::/,
    /println!/,
    /eprintln!/,
    /process::exit/,
    /\.kill\s*\(/,
    /\.wait\s*\(/,
    /\.try_wait\s*\(/,
    /signal_hook/,
    /nix::/
  ];

  for (const sourceUrl of await rustSourceFiles()) {
    const source = await readFile(sourceUrl, "utf8");
    const productionSource = source.split(/\n#\[cfg\(test\)\]/)[0];
    for (const pattern of forbiddenRustPatterns) {
      assert.doesNotMatch(
        productionSource,
        pattern,
        `${sourceUrl.pathname} production source must not match ${pattern}`
      );
    }
  }
});

test("Phase 4.2B runtime-like commands remain rejected with zero stdout", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase4-2b-probes-"));

  try {
    for (const command of runtimeLikeCommands) {
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
