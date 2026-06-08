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
  "../tests/fixtures/host-policy/phase5-1/controlled-runtime-implementation-approval-boundary.json",
  import.meta.url
);
const phase42DFixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase4-2d/external-review-disposition-phase5-handoff.json",
  import.meta.url
);

const expectedTopLevelKeys = Object.freeze([
  "schema",
  "schemaVersion",
  "phase",
  "artifactKind",
  "metadataGeneratedAt",
  "sourceDisposition",
  "implementationApprovalScope",
  "commandSurfaceReviewScope",
  "remainingRuntimeBlockers",
  "explicitlyForbiddenBehavior",
  "rollbackExpectations",
  "validationCommands",
  "requiredFutureReviewBeforeRuntimeEnablement",
  "runtimeLikeCommandRejectionProbes",
  "runtimeEffect",
  "nonExecutionInvariants",
  "safetyPosture"
]);

const expectedForbiddenBehavior = Object.freeze([
  "live-runtime-execution",
  "runtime-command-exposure-to-users",
  "stdin-read-loop",
  "stdout-writer",
  "stderr-writer",
  "process-spawn",
  "process-stop-kill-signal-or-wait",
  "transcript-runtime-write",
  "failure-audit-runtime-write",
  "approval-grant-evaluator",
  "adapter-runtime-call",
  "websocket-http-control-surface",
  "content-fabric-runtime-execution"
]);

const runtimeLikeCommands = Object.freeze([
  "serve-runtime",
  "stdio-runtime",
  "replay-session-transcript",
  "external-review-packet",
  "review-packet",
  "runtime-readiness-review",
  "runtime-implementation-approval",
  "runtime-command-surface-review",
  "controlled-runtime-implementation-approval",
  "phase-5-1-controlled-runtime-implementation-approval",
  "approve-runtime-implementation",
  "approve-runtime-command",
  "approve-runtime",
  "grant-runtime",
  "enable-runtime",
  "phase-5-runtime",
  "phase-5-1-runtime",
  "runtime-start",
  "runtime-stop",
  "runtime-status",
  "runtime-rollback",
  "runtime-failure-audit"
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

function classifyApprovalBoundary(fixture) {
  if (
    fixture.schema !== "ardyn.phase-5.1.controlled-runtime-implementation-approval-boundary" ||
    fixture.phase !== "phase-5.1-controlled-runtime-implementation-approval"
  ) {
    return { classification: "malformed", valid: false, failClosed: true };
  }

  const julesDisposition = fixture.sourceDisposition.julesPhase42CApprovalDisposition;
  if (
    julesDisposition.reviewerSystem !== "Jules" ||
    julesDisposition.verdict !== "APPROVE" ||
    julesDisposition.status !== "review-recorded-runtime-still-blocked" ||
    julesDisposition.runtimeApprovalGranted !== false ||
    julesDisposition.runtimeEnabled !== false
  ) {
    return { classification: "source_disposition_not_runtime_blocked", valid: false, failClosed: true };
  }

  if (
    fixture.implementationApprovalScope.implementationBoundaryApproved !== true ||
    fixture.implementationApprovalScope.approvalRecordCreated !== true
  ) {
    return { classification: "implementation_approval_boundary_missing", valid: false, failClosed: true };
  }

  const forbiddenRuntimeFlags = [
    fixture.implementationApprovalScope.runtimeImplementationMayStartInThisPhase,
    fixture.implementationApprovalScope.runtimeBehaviorIntroduced,
    fixture.implementationApprovalScope.liveRuntimeBehaviorIntroduced,
    fixture.implementationApprovalScope.runtimeEnabled,
    fixture.implementationApprovalScope.runtimeEnablementApproved,
    fixture.implementationApprovalScope.runtimeApprovalGranted,
    fixture.implementationApprovalScope.cliRuntimeCommandAdded,
    fixture.implementationApprovalScope.userCommandSurfaceApproved,
    fixture.commandSurfaceReviewScope.commandSurfaceApprovedForUsers,
    fixture.commandSurfaceReviewScope.cliExposureApproved,
    fixture.commandSurfaceReviewScope.runtimeCommandAvailable,
    fixture.rollbackExpectations.rollbackApproved,
    fixture.rollbackExpectations.killSwitchApproved,
    fixture.requiredFutureReviewBeforeRuntimeEnablement.runtimeEnablementReviewComplete,
    fixture.requiredFutureReviewBeforeRuntimeEnablement.runtimeCommandSurfaceUserExposureReviewComplete,
    ...Object.values(fixture.runtimeEffect),
    fixture.safetyPosture.runtimeEnabled,
    fixture.safetyPosture.runtimeApproved,
    fixture.safetyPosture.runtimeEnablementApproved,
    fixture.safetyPosture.runtimeCommandSurfaceApprovedForUsers,
    fixture.safetyPosture.cliRuntimeCommandAdded
  ];

  if (forbiddenRuntimeFlags.some(Boolean)) {
    return { classification: "implementation_approval_widened_to_runtime", valid: false, failClosed: true };
  }

  const openRuntimeBlockers = fixture.remainingRuntimeBlockers.filter(
    (blocker) => blocker.requiredBeforeRuntimeEnablement && blocker.status !== "complete"
  );
  if (openRuntimeBlockers.length < 5 || openRuntimeBlockers.some((blocker) => blocker.grantsRuntimeApproval)) {
    return { classification: "remaining_runtime_blockers_missing", valid: false, failClosed: true };
  }

  if (
    fixture.requiredFutureReviewBeforeRuntimeEnablement.reviewRequired !== true ||
    fixture.requiredFutureReviewBeforeRuntimeEnablement.freshJulesOrDevinReviewRequired !== true
  ) {
    return { classification: "future_review_missing", valid: false, failClosed: true };
  }

  return {
    classification: "implementation_boundary_approved_runtime_and_command_surface_blocked",
    valid: true,
    failClosed: false,
    runtimeEnabled: false,
    runtimeCommandAvailable: false
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

test("Phase 5.1 fixture is deterministic implementation approval metadata only", async () => {
  const raw = await readFile(fixtureUrl, "utf8");
  const [fixture, phase42D] = await Promise.all([readJson(fixtureUrl), readJson(phase42DFixtureUrl)]);

  assert.equal(raw.includes("\r\n"), false);
  assert.equal(raw.endsWith("\n"), true);
  assert.deepEqual(Object.keys(fixture), expectedTopLevelKeys);
  assert.equal(fixture.schemaVersion, "0.1.0");
  assert.equal(fixture.artifactKind, "implementation-approval-boundary-runtime-still-disabled");
  assert.equal(phase42D.phase, "phase-4.2d-external-review-disposition-phase5-handoff");
  assert.equal(
    fixture.sourceDisposition.sourceFixture,
    "tests/fixtures/host-policy/phase4-2d/external-review-disposition-phase5-handoff.json"
  );

  assert.deepEqual(classifyApprovalBoundary(fixture), {
    classification: "implementation_boundary_approved_runtime_and_command_surface_blocked",
    valid: true,
    failClosed: false,
    runtimeEnabled: false,
    runtimeCommandAvailable: false
  });
  assert.equal(fixture.implementationApprovalScope.implementationBoundaryApproved, true);
  assert.equal(fixture.implementationApprovalScope.approvedToImplementNextSkeletonSlice, true);
  assert.equal(fixture.implementationApprovalScope.approvedNextSkeletonSliceRequiresSeparatePhase, true);
  assert.equal(fixture.implementationApprovalScope.runtimeImplementationMayStartInThisPhase, false);
  assert.equal(fixture.implementationApprovalScope.runtimeEnabled, false);
  assert.equal(fixture.commandSurfaceReviewScope.commandSurfaceApprovedForUsers, false);
  assert.equal(fixture.commandSurfaceReviewScope.runtimeCommandAvailable, false);
  assert.deepEqual(fixture.explicitlyForbiddenBehavior, expectedForbiddenBehavior);
  assertAllFalse(fixture.runtimeEffect);
});

test("Phase 5.1 implementation approval fails closed if widened into runtime enablement", async () => {
  const fixture = await readJson(fixtureUrl);

  for (const [label, mutate] of [
    [
      "runtime implementation starts in approval phase",
      (json) => (json.implementationApprovalScope.runtimeImplementationMayStartInThisPhase = true)
    ],
    ["runtime enabled", (json) => (json.implementationApprovalScope.runtimeEnabled = true)],
    ["runtime approval granted", (json) => (json.implementationApprovalScope.runtimeApprovalGranted = true)],
    ["CLI runtime command added", (json) => (json.implementationApprovalScope.cliRuntimeCommandAdded = true)],
    ["user command surface approved", (json) => (json.implementationApprovalScope.userCommandSurfaceApproved = true)],
    ["command available", (json) => (json.commandSurfaceReviewScope.runtimeCommandAvailable = true)],
    ["rollback approved", (json) => (json.rollbackExpectations.rollbackApproved = true)],
    [
      "future enablement review complete",
      (json) => (json.requiredFutureReviewBeforeRuntimeEnablement.runtimeEnablementReviewComplete = true)
    ],
    ["runtime effect implemented", (json) => (json.runtimeEffect.runtimeImplemented = true)],
    ["safety runtime enabled", (json) => (json.safetyPosture.runtimeEnabled = true)]
  ]) {
    const mutated = clone(fixture);
    mutate(mutated);
    assert.deepEqual(
      classifyApprovalBoundary(mutated),
      { classification: "implementation_approval_widened_to_runtime", valid: false, failClosed: true },
      label
    );
  }

  const missingBlockers = clone(fixture);
  missingBlockers.remainingRuntimeBlockers = missingBlockers.remainingRuntimeBlockers.filter(
    ({ id }) => id !== "runtime-enablement-review"
  );
  assert.deepEqual(classifyApprovalBoundary(missingBlockers), {
    classification: "remaining_runtime_blockers_missing",
    valid: false,
    failClosed: true
  });
});

test("Phase 5.1 records rollback and future review requirements before runtime enablement", async () => {
  const fixture = await readJson(fixtureUrl);

  assert.equal(fixture.rollbackExpectations.status, "design-required-before-enable");
  assert.equal(fixture.rollbackExpectations.rollbackApproved, false);
  assert.equal(fixture.rollbackExpectations.killSwitchApproved, false);
  assert.ok(
    fixture.rollbackExpectations.requiredBeforeRuntimeEnablement.includes(
      "negative smoke proving denied runtime command does not start work"
    )
  );
  assert.equal(fixture.requiredFutureReviewBeforeRuntimeEnablement.status, "required-not-complete");
  assert.equal(fixture.requiredFutureReviewBeforeRuntimeEnablement.reviewRequired, true);
  assert.equal(fixture.requiredFutureReviewBeforeRuntimeEnablement.freshJulesOrDevinReviewRequired, true);
  assert.ok(
    fixture.requiredFutureReviewBeforeRuntimeEnablement.requiredRecords.includes(
      "runtime-command-surface-user-exposure-review-record"
    )
  );
  assert.deepEqual(
    fixture.validationCommands.map(({ command }) => command),
    [
      "node --test tests/phase5-1-controlled-runtime-implementation-approval-boundary.test.mjs",
      "node --test tests/phase5-1-command-surface-review.test.mjs",
      "npm test",
      "npm run test:schemas",
      "cargo test --workspace",
      "cargo check --workspace",
      "cargo fmt --check",
      "git diff --check",
      "git diff --cached --check",
      "npm run report:phase-status",
      "node apps/cli/src/index.mjs emit-session-events --dry-run --manifest examples/minimal-manifest/ardyn.manifest.json --task examples/minimal-task/task.json",
      "runtime-like rejection probes for Phase 5.1 command candidates"
    ]
  );
});

test("Phase 5.1 runtime-like commands remain unexposed and side-effect free", async () => {
  const [fixture, cliSource] = await Promise.all([readJson(fixtureUrl), readFile(cliSourceUrl, "utf8")]);
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-1-probes-"));

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
