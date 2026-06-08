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
  "../tests/fixtures/host-policy/phase4-2d/external-review-disposition-phase5-handoff.json",
  import.meta.url
);
const phase42CFixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase4-2c/runtime-readiness-review-gate.json",
  import.meta.url
);
const rustSkeletonUrl = new URL("../crates/ardyn-host/src/stdio_runtime/mod.rs", import.meta.url);

const expectedTopLevelKeys = Object.freeze([
  "schema",
  "schemaVersion",
  "phase",
  "artifactKind",
  "metadataGeneratedAt",
  "sourcePhase",
  "julesReviewDisposition",
  "blockerDisposition",
  "phase5Handoff",
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
  "phase-4-2d-external-review-disposition",
  "phase-4-2d-phase5-handoff",
  "runtime-readiness-gate",
  "readiness-gate",
  "phase-5-1-controlled-runtime-implementation-approval",
  "controlled-runtime-implementation-approval",
  "runtime-implementation-approval",
  "runtime-command-surface-review",
  "approve-runtime-implementation",
  "approve-runtime-command",
  "phase-5-runtime",
  "phase-5-1-runtime",
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

function classifyDisposition(fixture) {
  if (
    fixture.schema !== "ardyn.phase-4.2d.external-review-disposition-phase5-handoff" ||
    fixture.phase !== "phase-4.2d-external-review-disposition-phase5-handoff"
  ) {
    return { classification: "malformed", valid: false, failClosed: true };
  }

  const review = fixture.julesReviewDisposition;
  if (
    review.reviewerSystem !== "Jules" ||
    review.verdict !== "APPROVE" ||
    review.externalReviewComplete !== true ||
    review.reviewedCommit !== "6f2097816cf1f93dbfffb468d8444ef7ec87e2ac"
  ) {
    return { classification: "external_review_disposition_incomplete", valid: false, failClosed: true };
  }

  const runtimeApprovalFlags = [
    review.runtimeApprovalGranted,
    review.runtimeEnabled,
    review.runtimeImplementationApproved,
    review.runtimeCommandSurfaceApproved,
    fixture.phase5Handoff.liveRuntimeImplementationAllowedByHandoff,
    fixture.phase5Handoff.runtimeEnablementAllowedByHandoff,
    fixture.runtimeEffect.runtimeEnabled,
    fixture.runtimeEffect.runtimeApproved,
    fixture.runtimeEffect.runtimeImplementationApproved,
    fixture.runtimeEffect.runtimeEnablementApproved,
    fixture.runtimeEffect.runtimeCommandSurfaceApproved,
    fixture.safetyPosture.runtimeEnabled,
    fixture.safetyPosture.runtimeApproved,
    fixture.safetyPosture.runtimeImplementationApproved,
    fixture.safetyPosture.runtimeEnablementApproved,
    fixture.safetyPosture.runtimeCommandSurfaceApproved
  ];

  if (runtimeApprovalFlags.some(Boolean)) {
    return {
      classification: "jules_review_cannot_grant_runtime_approval",
      valid: false,
      failClosed: true
    };
  }

  const stillOpen = fixture.blockerDisposition.stillOpenBeforeAnyImplementation.map(({ id }) => id);
  if (
    !stillOpen.includes("runtime-implementation-approval") ||
    !stillOpen.includes("runtime-command-surface-review")
  ) {
    return {
      classification: "phase5_implementation_blockers_missing",
      valid: false,
      failClosed: true
    };
  }

  if (fixture.safetyPosture.runtimeBlocked !== true) {
    return { classification: "runtime_not_blocked", valid: false, failClosed: true };
  }

  return {
    classification: "jules_approved_external_review_runtime_blocked_phase5_handoff_ready",
    valid: true,
    failClosed: false,
    runtimeEnabled: false,
    runtimeApproved: false
  };
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

test("Phase 4.2D fixture records Jules approval as external review only", async () => {
  const raw = await readFile(fixtureUrl, "utf8");
  const [fixture, phase42C] = await Promise.all([readJson(fixtureUrl), readJson(phase42CFixtureUrl)]);

  assert.equal(raw.includes("\r\n"), false);
  assert.equal(raw.endsWith("\n"), true);
  assert.deepEqual(Object.keys(fixture), expectedTopLevelKeys);
  assert.equal(fixture.schema, "ardyn.phase-4.2d.external-review-disposition-phase5-handoff");
  assert.equal(fixture.schemaVersion, "0.1.0");
  assert.equal(fixture.phase, "phase-4.2d-external-review-disposition-phase5-handoff");
  assert.equal(phase42C.phase, "phase-4.2c-runtime-readiness-review-gate");
  assert.equal(fixture.sourcePhase.previousCommit, "6f2097816cf1f93dbfffb468d8444ef7ec87e2ac");

  assert.deepEqual(classifyDisposition(fixture), {
    classification: "jules_approved_external_review_runtime_blocked_phase5_handoff_ready",
    valid: true,
    failClosed: false,
    runtimeEnabled: false,
    runtimeApproved: false
  });
  assert.equal(fixture.julesReviewDisposition.reviewerSystem, "Jules");
  assert.equal(fixture.julesReviewDisposition.verdict, "APPROVE");
  assert.equal(fixture.julesReviewDisposition.externalReviewComplete, true);
  assert.equal(fixture.safetyPosture.freshExternalReviewRan, true);
  assert.equal(fixture.julesReviewDisposition.runtimeApprovalGranted, false);
  assert.equal(fixture.julesReviewDisposition.runtimeImplementationApproved, false);
  assert.equal(fixture.julesReviewDisposition.runtimeCommandSurfaceApproved, false);
  assert.equal(fixture.julesReviewDisposition.runtimeEnabled, false);
  assert.equal(fixture.julesReviewDisposition.reviewFindings.length, 9);
  assert.ok(
    fixture.julesReviewDisposition.reviewFindings.some(
      ({ id }) => id === "blocked-effects-enforced"
    )
  );
  assertAllFalse(fixture.runtimeEffect);
});

test("Phase 4.2D fails closed if Jules approval is mutated into runtime approval", async () => {
  const fixture = await readJson(fixtureUrl);

  for (const [label, mutate] of [
    ["runtime approval grant", (json) => (json.julesReviewDisposition.runtimeApprovalGranted = true)],
    ["runtime enabled", (json) => (json.julesReviewDisposition.runtimeEnabled = true)],
    [
      "implementation approval",
      (json) => (json.julesReviewDisposition.runtimeImplementationApproved = true)
    ],
    [
      "command-surface approval",
      (json) => (json.julesReviewDisposition.runtimeCommandSurfaceApproved = true)
    ],
    [
      "handoff live implementation",
      (json) => (json.phase5Handoff.liveRuntimeImplementationAllowedByHandoff = true)
    ],
    [
      "handoff runtime enablement",
      (json) => (json.phase5Handoff.runtimeEnablementAllowedByHandoff = true)
    ],
    ["runtime effect enabled", (json) => (json.runtimeEffect.runtimeEnabled = true)],
    ["safety enabled", (json) => (json.safetyPosture.runtimeEnabled = true)]
  ]) {
    const mutated = clone(fixture);
    mutate(mutated);
    assert.equal(classifyDisposition(mutated).valid, false, label);
    assert.equal(classifyDisposition(mutated).failClosed, true, label);
  }

  const missingImplementationBlocker = clone(fixture);
  missingImplementationBlocker.blockerDisposition.stillOpenBeforeAnyImplementation =
    missingImplementationBlocker.blockerDisposition.stillOpenBeforeAnyImplementation.filter(
      ({ id }) => id !== "runtime-implementation-approval"
    );
  assert.deepEqual(classifyDisposition(missingImplementationBlocker), {
    classification: "phase5_implementation_blockers_missing",
    valid: false,
    failClosed: true
  });
});

test("Phase 4.2D handoff records Phase 5.1 as approval gate only", async () => {
  const fixture = await readJson(fixtureUrl);

  assert.equal(
    fixture.phase5Handoff.document,
    "docs/phase-5-1-controlled-runtime-implementation-approval-handoff.md"
  );
  assert.equal(fixture.phase5Handoff.nextPhase, "phase-5.1-controlled-runtime-implementation-approval");
  assert.equal(fixture.phase5Handoff.nextPhaseIsApprovalGateOnly, true);
  assert.equal(fixture.phase5Handoff.liveRuntimeImplementationAllowedByHandoff, false);
  assert.equal(fixture.phase5Handoff.runtimeEnablementAllowedByHandoff, false);
  assert.deepEqual(fixture.blockerDisposition.closedByJulesReview.map(({ id }) => id), [
    "fresh-jules-or-devin-review"
  ]);
  assert.deepEqual(
    fixture.blockerDisposition.stillOpenBeforeAnyImplementation.map(({ id, status }) => [id, status]),
    [
      ["runtime-implementation-approval", "open"],
      ["runtime-command-surface-review", "open"],
      ["host-policy-runtime-enforcement", "open"],
      ["rollback-kill-switch", "open"]
    ]
  );
  assert.match(fixture.phase5Handoff.phase51Prompt, /Do not implement or enable a live runtime/);
  assert.match(fixture.phase5Handoff.phase51Prompt, /approval-boundary and runtime command-surface review artifacts only/);
  assert.ok(
    fixture.phase5Handoff.requiredApprovalRecordsBeforeRuntimeCommand.includes(
      "runtime-command-surface-review-record"
    )
  );
});

test("Phase 4.2D source guard keeps CLI unchanged and runtime command-like names rejected", async () => {
  const [fixture, cliSource, rustSkeletonSource] = await Promise.all([
    readJson(fixtureUrl),
    readFile(cliSourceUrl, "utf8"),
    readFile(rustSkeletonUrl, "utf8")
  ]);
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase4-2d-probes-"));

  try {
    assert.deepEqual(fixture.runtimeLikeCommandRejectionProbes, runtimeLikeCommands);
    assert.match(rustSkeletonSource, /all_runtime_paths_blocked/);
    assert.match(rustSkeletonSource, /all_effects_blocked/);

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
