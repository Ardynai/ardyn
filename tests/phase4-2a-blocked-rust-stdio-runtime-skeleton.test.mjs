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
const rustHostLibUrl = new URL("lib.rs", rustHostSourceDirUrl);
const rustSkeletonUrl = new URL("stdio_runtime/mod.rs", rustHostSourceDirUrl);
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase4-2a/blocked-stdio-runtime-skeleton-plan.json",
  import.meta.url
);
const phase41JExpectedOutcomesUrl = new URL(
  "../tests/fixtures/stdio-harness/phase4-1j/expected-outcomes.json",
  import.meta.url
);
const phase41KGatesUrl = new URL(
  "../tests/fixtures/host-policy/phase4-1k/stdio-runtime-contract-gates.json",
  import.meta.url
);
const phase41LReadinessUrl = new URL(
  "../tests/fixtures/host-policy/phase4-1l/runtime-implementation-readiness.json",
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

test("Phase 4.2A fixture records a blocked skeleton plan over reused 4.1 fixtures", async () => {
  const [fixture, phase41J, phase41K, phase41L] = await Promise.all([
    readJson(fixtureUrl),
    readJson(phase41JExpectedOutcomesUrl),
    readJson(phase41KGatesUrl),
    readJson(phase41LReadinessUrl)
  ]);

  assert.equal(fixture.schema, "ardyn.phase-4.2a.blocked-stdio-runtime-skeleton-plan");
  assert.equal(fixture.schemaVersion, "0.1.0");
  assert.equal(fixture.phase, "phase-4.2a-blocked-stdio-runtime-skeleton");
  assert.equal(fixture.metadataGeneratedAt, "1970-01-01T00:00:00.000Z");
  assert.equal(fixture.rustSkeleton.moduleRoot, "crates/ardyn-host/src/stdio_runtime/mod.rs");
  assert.equal(fixture.rustSkeleton.crateModuleVisibility, "private");
  assert.ok(fixture.rustSkeleton.helperFunctions.includes("blocked_stdio_runtime_entrypoint"));

  assert.equal(phase41J.phase, "phase-4.1j-stdio-harness-fixtures");
  assert.equal(phase41K.phase, "phase-4.1k-stdio-runtime-contract-gates");
  assert.equal(phase41K.contractBoundary.runtimeEnabled, false);
  assert.equal(phase41K.approvalState.runtimeApprovalGranted, false);
  assert.equal(phase41L.implementationReadiness.readyToPlan42A, true);
  assert.equal(phase41L.implementationReadiness.runtimeEnablementReady, false);

  assert.deepEqual(
    fixture.cases.map(({ name, expected }) => [
      name,
      expected.inputClassification,
      expected.entrypointStatus,
      expected.executed,
      expected.runtimeEnabled,
      expected.approvalGranted
    ]),
    [
      [
        "valid-single-event-maps-to-blocked-plan",
        "accepted_static_probe",
        "runtime_unavailable",
        false,
        false,
        false
      ],
      [
        "well-formed-runtime-approval-request-stays-blocked",
        "rejected_runtime_approval_request",
        "runtime_unavailable",
        false,
        false,
        false
      ]
    ]
  );
  assertAllFalse(fixture.runtimeEffect);
});

test("Phase 4.2A Rust skeleton is real code but not a public runtime module", async () => {
  const [libSource, skeletonSource] = await Promise.all([
    readFile(rustHostLibUrl, "utf8"),
    readFile(rustSkeletonUrl, "utf8")
  ]);

  assert.match(libSource, /^mod stdio_runtime;$/m);
  assert.doesNotMatch(libSource, /^pub mod stdio_runtime;$/m);
  assert.match(skeletonSource, /pub struct StdioRuntimeSkeletonState/);
  assert.match(skeletonSource, /pub struct BlockedStdioRuntimeEntrypointResult/);
  assert.match(skeletonSource, /pub fn plan_stdio_runtime_frame/);
  assert.match(skeletonSource, /pub fn plan_stdio_runtime_gates_from_bundle/);
  assert.match(skeletonSource, /pub fn blocked_stdio_runtime_entrypoint/);
  assert.match(skeletonSource, /pub fn blocked_stdio_runtime_approval_request/);
  assert.match(skeletonSource, /simulate_blocked_stdio_runtime_for_test/);
});

test("Phase 4.2A source guard keeps CLI unchanged and scans all Rust source files", async () => {
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
    /TcpListener/,
    /TcpStream/,
    /UdpSocket/,
    /thread::spawn/,
    /tokio::/,
    /async_std::/,
    /println!/,
    /eprintln!/,
    /pub\s+fn\s+run_.*runtime/
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

test("Phase 4.2A runtime-like commands remain rejected with zero stdout", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase4-2a-probes-"));

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
