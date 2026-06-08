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
const rustHostLibUrl = new URL("../crates/ardyn-host/src/lib.rs", import.meta.url);
const rustSkeletonUrl = new URL("../crates/ardyn-host/src/stdio_runtime/mod.rs", import.meta.url);
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase4-2c/runtime-readiness-review-gate.json",
  import.meta.url
);
const phase42BFixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase4-2b/lifecycle-failure-audit-skeleton-plan.json",
  import.meta.url
);

const expectedTopLevelKeys = Object.freeze([
  "schema",
  "schemaVersion",
  "phase",
  "artifactKind",
  "metadataGeneratedAt",
  "currentState",
  "nextAllowedState",
  "prohibitedTransitions",
  "readinessGate",
  "externalReview",
  "reviewPacket",
  "evidenceLinks",
  "blockerBurnDown",
  "runtimeLikeCommandRejectionProbes",
  "runtimeEffect",
  "nonExecutionInvariants",
  "safetyPosture"
]);

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
  "runtime-lifecycle",
  "phase-4-2b-lifecycle-runtime",
  "phase-4-2b-failure-audit",
  "phase-4-2c-runtime-readiness-review-gate",
  "phase-4-2c-readiness-gate",
  "runtime-readiness-gate",
  "readiness-gate",
  "failure-audit-runtime",
  "cleanup-runtime",
  "kill-runtime",
  "approve-runtime",
  "grant-runtime",
  "enable-runtime"
]);

async function readJson(url) {
  return JSON.parse(await readFile(url, "utf8"));
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function assertAllFalse(record) {
  for (const [field, value] of Object.entries(record)) {
    assert.equal(value, false, field);
  }
}

function openPreApprovalBlockers(fixture) {
  return fixture.blockerBurnDown.mustFixBeforeAnyEnablement.filter(
    (blocker) => blocker.requiredBeforeRuntimeEnablement && blocker.status !== "complete"
  );
}

function externalReviewIsComplete(fixture) {
  const review = fixture.externalReview;
  return (
    review.status === "review-recorded-runtime-still-blocked" &&
    review.externalReviewPerformed === true &&
    review.externalReviewComplete === true &&
    ["Jules", "Devin"].includes(review.reviewerSystem) &&
    review.reviewer === review.reviewerSystem &&
    review.reviewedBranch === "codex/phase-4-2c-runtime-readiness-review-gate" &&
    /^[0-9a-f]{40}$/.test(review.reviewedCommit ?? "") &&
    typeof review.reviewRecordPath === "string" &&
    review.reviewRecordPath.length > 0
  );
}

function classifyReadinessGate(fixture) {
  if (
    fixture.schema !== "ardyn.phase-4.2c.runtime-readiness-review-gate" ||
    fixture.phase !== "phase-4.2c-runtime-readiness-review-gate"
  ) {
    return { classification: "malformed", valid: false, failClosed: true };
  }

  const runtimeApprovalFlags = [
    fixture.readinessGate.runtimeReadinessApproved,
    fixture.readinessGate.runtimeEnablementApproved,
    fixture.readinessGate.runtimeEnabled,
    fixture.runtimeEffect.runtimeEnabled,
    fixture.runtimeEffect.runtimeApproved,
    fixture.runtimeEffect.runtimeReadinessApproved,
    fixture.runtimeEffect.runtimeEnablementApproved,
    fixture.safetyPosture.runtimeEnabled,
    fixture.safetyPosture.runtimeApproved,
    fixture.safetyPosture.runtimeReadinessApproved,
    fixture.safetyPosture.runtimeEnablementApproved
  ];

  if (runtimeApprovalFlags.some(Boolean)) {
    return {
      classification: "runtime_approval_not_allowed_in_4_2c",
      valid: false,
      failClosed: true
    };
  }

  if (fixture.externalReview.externalReviewComplete && !externalReviewIsComplete(fixture)) {
    return {
      classification: "external_review_completion_unproven",
      valid: false,
      failClosed: true
    };
  }

  if (fixture.readinessGate.runtimeBlocked !== true || fixture.safetyPosture.runtimeBlocked !== true) {
    return { classification: "runtime_not_blocked", valid: false, failClosed: true };
  }

  if (openPreApprovalBlockers(fixture).length === 0) {
    return {
      classification: "pre_enablement_blocker_inventory_missing",
      valid: false,
      failClosed: true
    };
  }

  if (fixture.readinessGate.readyForExternalReview === true) {
    return {
      classification: "ready_for_external_review_runtime_blocked",
      valid: true,
      failClosed: false,
      runtimeEnabled: false,
      runtimeApproved: false
    };
  }

  return { classification: "not_ready_for_external_review", valid: false, failClosed: true };
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

test("Phase 4.2C fixture is deterministic and records a blocked review gate", async () => {
  const raw = await readFile(fixtureUrl, "utf8");
  const [fixture, phase42B] = await Promise.all([readJson(fixtureUrl), readJson(phase42BFixtureUrl)]);

  assert.equal(raw.includes("\r\n"), false);
  assert.equal(raw.endsWith("\n"), true);
  assert.deepEqual(Object.keys(fixture), expectedTopLevelKeys);
  assert.equal(fixture.schema, "ardyn.phase-4.2c.runtime-readiness-review-gate");
  assert.equal(fixture.schemaVersion, "0.1.0");
  assert.equal(fixture.phase, "phase-4.2c-runtime-readiness-review-gate");
  assert.equal(fixture.currentState, "blocked_skeleton_current");
  assert.equal(phase42B.phase, "phase-4.2b-blocked-lifecycle-failure-audit-skeleton");

  assert.deepEqual(classifyReadinessGate(fixture), {
    classification: "ready_for_external_review_runtime_blocked",
    valid: true,
    failClosed: false,
    runtimeEnabled: false,
    runtimeApproved: false
  });
  assert.equal(fixture.readinessGate.readyForExternalReview, true);
  assert.equal(fixture.readinessGate.runtimeReadinessApproved, false);
  assert.equal(fixture.readinessGate.runtimeEnablementApproved, false);
  assert.equal(fixture.readinessGate.runtimeEnabled, false);
  assert.equal(fixture.externalReview.externalReviewComplete, false);
  assert.equal(fixture.reviewPacket.claimsExternalReviewComplete, false);
  assert.equal(fixture.reviewPacket.claimsRuntimeApproved, false);
  assert.equal(fixture.reviewPacket.claimsRuntimeEnabled, false);
  assertAllFalse(fixture.runtimeEffect);
});

test("Phase 4.2C fails closed when approval, enablement, or external review is faked", async () => {
  const fixture = await readJson(fixtureUrl);

  for (const [label, mutate] of [
    ["runtime readiness approval", (json) => (json.readinessGate.runtimeReadinessApproved = true)],
    ["runtime enablement approval", (json) => (json.readinessGate.runtimeEnablementApproved = true)],
    ["runtime enabled", (json) => (json.readinessGate.runtimeEnabled = true)],
    ["runtime effect approved", (json) => (json.runtimeEffect.runtimeApproved = true)],
    ["runtime effect enabled", (json) => (json.runtimeEffect.runtimeEnabled = true)],
    ["safety approved", (json) => (json.safetyPosture.runtimeApproved = true)],
    ["safety enabled", (json) => (json.safetyPosture.runtimeEnabled = true)]
  ]) {
    const mutated = clone(fixture);
    mutate(mutated);
    assert.equal(classifyReadinessGate(mutated).valid, false, label);
    assert.equal(classifyReadinessGate(mutated).failClosed, true, label);
  }

  const forgedReview = clone(fixture);
  forgedReview.externalReview.status = "review-recorded-runtime-still-blocked";
  forgedReview.externalReview.externalReviewPerformed = true;
  forgedReview.externalReview.externalReviewComplete = true;
  assert.deepEqual(classifyReadinessGate(forgedReview), {
    classification: "external_review_completion_unproven",
    valid: false,
    failClosed: true
  });

  const missingBlockers = clone(fixture);
  for (const blocker of missingBlockers.blockerBurnDown.mustFixBeforeAnyEnablement) {
    blocker.status = "complete";
  }
  assert.deepEqual(classifyReadinessGate(missingBlockers), {
    classification: "pre_enablement_blocker_inventory_missing",
    valid: false,
    failClosed: true
  });
});

test("Phase 4.2C source guard keeps Rust skeleton private and non-runtime", async () => {
  const [libSource, skeletonSource] = await Promise.all([
    readFile(rustHostLibUrl, "utf8"),
    readFile(rustSkeletonUrl, "utf8")
  ]);
  const libProductionSource = libSource.split(/\n#\[cfg\(test\)\]/)[0];
  const skeletonProductionSource = skeletonSource.split(/\n#\[cfg\(test\)\]/)[0];

  assert.match(libProductionSource, /^\s*mod\s+stdio_runtime\s*;/m);
  assert.doesNotMatch(libProductionSource, /^\s*pub(?:\([^)]*\))?\s+mod\s+stdio_runtime\s*;/m);
  assert.doesNotMatch(
    libProductionSource,
    /^\s*pub(?:\([^)]*\))?\s+use\s+(?:crate::)?stdio_runtime(?:::|\b)/m
  );
  assert.match(libSource, /```compile_fail[\s\S]*ardyn_host::stdio_runtime/);

  const forbiddenRustPatterns = [
    /\bstd::io::(?:stdin|stdout|stderr)\s*\(/,
    /\bio::(?:stdin|stdout|stderr)\s*\(/,
    /\b(?:println|eprintln|dbg)!\s*\(/,
    /\bstd::process::|\bprocess::Command\b|\bCommand::new\s*\(/,
    /\b(?:Child|Stdio)::|\.(?:spawn|kill|wait|try_wait|wait_with_output)\s*\(/,
    /\bstd::fs::|\bfs::(?:write|create|create_dir|remove|rename|copy|read|read_to_string)\b/,
    /\b(?:File|OpenOptions)::(?:create|open|options|new)\b/,
    /\.(?:write_all|flush|sync_all|sync_data)\s*\(/,
    /\b(?:tokio|async_std)::|\b(?:TcpListener|TcpStream|UdpSocket|UnixListener|UnixStream)\b/,
    /\bruntime_available\s*:\s*true\b/,
    /\bexecution_available\s*:\s*true\b/,
    /\bexecution_allowed\s*:\s*true\b/,
    /\bapproval_granted\s*:\s*true\b/,
    /\bapproval_grants_available\s*:\s*true\b/,
    /\bprocess_control_available\s*:\s*true\b/,
    /\blive_streams_available\s*:\s*true\b/,
    /\b(?:stdin_read|stdout_written|stderr_written|process_started|process_stopped|process_killed|signal_sent|process_polled|process_waited)\s*:\s*true\b/,
    /\btranscript_persistence_available\s*:\s*true\b/,
    /\bruntime_effect_recorded\s*:\s*true\b/
  ];

  for (const pattern of forbiddenRustPatterns) {
    assert.doesNotMatch(skeletonProductionSource, pattern);
  }
});

test("Phase 4.2C runtime-like commands remain rejected with zero stdout", async () => {
  const [fixture, cliSource] = await Promise.all([readJson(fixtureUrl), readFile(cliSourceUrl, "utf8")]);
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase4-2c-probes-"));

  try {
    assert.deepEqual(fixture.runtimeLikeCommandRejectionProbes, runtimeLikeCommands);

    for (const command of runtimeLikeCommands) {
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
