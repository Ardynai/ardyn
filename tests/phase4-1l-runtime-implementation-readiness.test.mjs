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
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase4-1l/runtime-implementation-readiness.json",
  import.meta.url
);
const previousGateFixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase4-1k/stdio-runtime-contract-gates.json",
  import.meta.url
);
const docUrl = new URL("../docs/phase-4-1l-runtime-implementation-readiness.md", import.meta.url);
const cliSourceUrl = new URL("../apps/cli/src/index.mjs", import.meta.url);
const rustHostSourceUrl = new URL("../crates/ardyn-host/src/lib.rs", import.meta.url);
const reportScriptUrl = new URL("../scripts/report-phase-status.mjs", import.meta.url);
const cliPath = fileURLToPath(cliSourceUrl);
const reportScriptPath = fileURLToPath(reportScriptUrl);

const topLevelOrder = Object.freeze([
  "schema",
  "schemaVersion",
  "phase",
  "artifactKind",
  "metadataGeneratedAt",
  "sourcePhase",
  "implementationReadiness",
  "phase41EvidenceMap",
  "blockerBurnDown",
  "phase42AHandoff",
  "reviewEvidence",
  "validationPlan",
  "smokeProbePlan",
  "runtimeEffect",
  "nonExecutionInvariants",
  "audit"
]);

const runtimeLikeCommands = Object.freeze([
  "serve-runtime",
  "stdio-runtime",
  "replay-session-transcript",
  "external-review-packet",
  "review-packet",
  "runtime-readiness-review",
  "runtime-implementation-readiness",
  "implementation-readiness",
  "runtime-implementation",
  "phase-4-1l-runtime-implementation-readiness",
  "phase-4-2a-runtime-skeleton",
  "runtime-skeleton",
  "approve-runtime",
  "grant-runtime",
  "enable-runtime"
]);

async function readFixture() {
  const text = await readFile(fixtureUrl, "utf8");
  return { text, json: JSON.parse(text) };
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

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function hasRuntimeAttempt(record) {
  const boundary = record.implementationReadiness ?? {};
  const runtimeFlags = [
    boundary.runtimeEnablementReady,
    boundary.runtimeImplementationApproved,
    boundary.runtimeEnablementApproved,
    boundary.runtimeApprovalGranted,
    boundary.runtimeReady,
    ...(record.implementationReadiness?.entryCriteria ?? []).flatMap((criterion) => [
      criterion.allowsRuntimeEnablement,
      criterion.grantsRuntimeApproval,
      criterion.runtimeBehaviorIntroduced
    ]),
    ...(record.implementationReadiness?.runtimeEnablementCriteria ?? []).flatMap((criterion) => [
      criterion.status === "met",
      criterion.status === "approved",
      criterion.status === "runtime-approved",
      criterion.grantsRuntimeApproval,
      criterion.runtimeBehaviorIntroduced
    ]),
    ...(record.phase41EvidenceMap ?? []).map((evidence) => evidence.runtimeImplemented),
    ...(record.blockerBurnDown ?? []).flatMap((blocker) => [
      blocker.classification === "must-remain-blocked-until-runtime-enablement-review" &&
        blocker.status !== "blocked",
      blocker.status === "approved",
      blocker.status === "runtime-approved"
    ]),
    ...Object.values(record.runtimeEffect ?? {})
  ];

  return runtimeFlags.some((value) => value === true);
}

function classifyImplementationReadiness(record) {
  if (
    record?.schema !== "ardyn.phase-4.1l.runtime-implementation-readiness" ||
    record?.schemaVersion !== "0.1.0" ||
    record?.phase !== "phase-4.1l-runtime-implementation-readiness" ||
    record?.artifactKind !== "approval-reviewed-rust-host-stdio-runtime-implementation-readiness" ||
    record?.metadataGeneratedAt !== "1970-01-01T00:00:00.000Z" ||
    record?.sourcePhase?.previousPhase !== "phase-4.1k-stdio-runtime-contract-gates" ||
    !Array.isArray(record?.implementationReadiness?.entryCriteria) ||
    !Array.isArray(record?.implementationReadiness?.runtimeEnablementCriteria)
  ) {
    return { classification: "malformed", valid: false, failClosed: true };
  }

  const entryCriteria = record.implementationReadiness.entryCriteria;
  const blockedRuntimeCriteria = record.implementationReadiness.runtimeEnablementCriteria;
  const skeletonEntryReady =
    record.implementationReadiness.readyToPlan42A === true &&
    record.implementationReadiness.readyToImplementDeliberatelyBlockedSkeleton === true &&
    entryCriteria.length > 0 &&
    entryCriteria.every(
      (criterion) =>
        criterion.status === "satisfied" &&
        criterion.allows42ASkeletonPlanning === true &&
        criterion.allowsRuntimeEnablement === false
    );
  const runtimeEnablementBlocked =
    record.implementationReadiness.runtimeEnablementReady === false &&
    blockedRuntimeCriteria.length > 0 &&
    blockedRuntimeCriteria.every(
      (criterion) =>
        criterion.status === "blocked" &&
        criterion.requiredBeforeRuntimeEnablement === true &&
        criterion.grantsRuntimeApproval === false
    );

  if (!skeletonEntryReady || !runtimeEnablementBlocked) {
    return {
      classification: "runtime_unavailable",
      valid: false,
      failClosed: true,
      runtimeAvailable: false
    };
  }

  if (hasRuntimeAttempt(record)) {
    return {
      classification: "runtime_unavailable",
      valid: false,
      failClosed: true,
      runtimeAvailable: false
    };
  }

  return {
    classification: "skeleton_entry_ready_runtime_blocked",
    valid: true,
    failClosed: false,
    runtimeAvailable: false
  };
}

function assertAllFalse(record) {
  for (const [field, value] of Object.entries(record)) {
    assert.equal(value, false, field);
  }
}

test("Phase 4.1L readiness fixture is deterministic LF-only metadata", async () => {
  const { text, json } = await readFixture();

  assert.equal(text.endsWith("\n"), true);
  assert.equal(text.includes("\r"), false);
  assert.deepEqual(Object.keys(json), topLevelOrder);
  assert.deepEqual(classifyImplementationReadiness(json), {
    classification: "skeleton_entry_ready_runtime_blocked",
    valid: true,
    failClosed: false,
    runtimeAvailable: false
  });
});

test("Phase 4.1L records 4.2A skeleton entry while runtime enablement stays blocked", async () => {
  const { json } = await readFixture();
  const previousGateFixture = JSON.parse(await readFile(previousGateFixtureUrl, "utf8"));

  assert.equal(json.sourcePhase.previousFixture, "tests/fixtures/host-policy/phase4-1k/stdio-runtime-contract-gates.json");
  assert.equal(previousGateFixture.schema, "ardyn.phase-4.1k.stdio-runtime-contract-gates");
  assert.equal(previousGateFixture.contractBoundary.runtimeEnabled, false);
  assert.equal(json.sourcePhase.freshExternalReviewRecorded, false);
  assert.equal(json.sourcePhase.freshDevinReviewRecorded, false);
  assert.equal(json.sourcePhase.notFreshExternalReview, true);
  assert.equal(json.sourcePhase.notRuntimeReadinessApproval, true);
  assert.equal(json.implementationReadiness.readyToPlan42A, true);
  assert.equal(json.implementationReadiness.readyToImplementDeliberatelyBlockedSkeleton, true);
  assert.equal(json.implementationReadiness.runtimeEnablementReady, false);
  assert.equal(json.implementationReadiness.runtimeImplementationApproved, false);
  assert.equal(json.implementationReadiness.runtimeEnablementApproved, false);
  assert.equal(json.implementationReadiness.runtimeApprovalGranted, false);
  assert.equal(json.reviewEvidence.freshExternalReviewRecorded, false);
  assert.equal(json.reviewEvidence.freshDevinReviewRecorded, false);
  assertAllFalse(json.runtimeEffect);

  for (const criterion of json.implementationReadiness.entryCriteria) {
    assert.equal(criterion.status, "satisfied", criterion.id);
    assert.equal(criterion.allows42ASkeletonPlanning, true, criterion.id);
    assert.equal(criterion.allowsRuntimeEnablement, false, criterion.id);
  }

  for (const criterion of json.implementationReadiness.runtimeEnablementCriteria) {
    assert.equal(criterion.status, "blocked", criterion.id);
    assert.equal(criterion.requiredBeforeRuntimeEnablement, true, criterion.id);
    assert.equal(criterion.grantsRuntimeApproval, false, criterion.id);
  }
});

test("Phase 4.1L blocker burn-down classifies skeleton and runtime blockers separately", async () => {
  const { json } = await readFixture();
  const blockers = new Map(json.blockerBurnDown.map((blocker) => [blocker.id, blocker]));

  assert.equal(blockers.get("bounded-skeleton-module-layout").classification, "must-solve-before-skeleton");
  assert.equal(blockers.get("bounded-skeleton-module-layout").status, "ready");
  assert.equal(blockers.get("stdin-loop-shape").classification, "can-solve-during-skeleton");
  assert.equal(blockers.get("stdin-loop-shape").status, "planned-only");
  assert.equal(
    blockers.get("runtime-command-surface").classification,
    "must-remain-blocked-until-runtime-enablement-review"
  );
  assert.equal(blockers.get("runtime-command-surface").status, "blocked");

  assert.equal(json.phase42AHandoff.recommendedPhaseName, "Phase 4.2A deliberately blocked Rust-host stdio runtime skeleton");
  assert.ok(json.phase42AHandoff.allowedScope.includes("private Rust module skeletons under crates/ardyn-host"));
  assert.ok(json.phase42AHandoff.disallowedScope.includes("apps/cli/src/index.mjs command enablement"));
  assert.ok(json.phase42AHandoff.disallowedScope.includes("live stdin read loop"));
  assert.ok(json.phase42AHandoff.required42ATests.includes("no CLI runtime-like command is introduced"));
});

test("Phase 4.1L mutated runtime readiness or approval attempts fail closed", async () => {
  const { json } = await readFixture();
  const mutations = [
    ["runtimeEffect.runtimeImplemented", (record) => {
      record.runtimeEffect.runtimeImplemented = true;
    }],
    ["implementationReadiness.runtimeEnablementReady", (record) => {
      record.implementationReadiness.runtimeEnablementReady = true;
    }],
    ["implementationReadiness.runtimeApprovalGranted", (record) => {
      record.implementationReadiness.runtimeApprovalGranted = true;
    }],
    ["entry criterion grantsRuntimeApproval", (record) => {
      record.implementationReadiness.entryCriteria[0].grantsRuntimeApproval = true;
    }],
    ["entry criterion allows runtime enablement", (record) => {
      record.implementationReadiness.entryCriteria[0].allowsRuntimeEnablement = true;
    }],
    ["runtime enablement criterion approved", (record) => {
      record.implementationReadiness.runtimeEnablementCriteria[0].status = "approved";
    }],
    ["runtime command surface unblocked", (record) => {
      record.blockerBurnDown.find((blocker) => blocker.id === "runtime-command-surface").status =
        "approved";
    }]
  ];

  for (const [label, mutate] of mutations) {
    const mutated = clone(json);
    mutate(mutated);
    const result = classifyImplementationReadiness(mutated);

    assert.equal(result.classification, "runtime_unavailable", label);
    assert.equal(result.valid, false, label);
    assert.equal(result.failClosed, true, label);
    assert.equal(result.runtimeAvailable, false, label);
  }

  const malformed = clone(json);
  malformed.schema = "ardyn.phase-4.1l.runtime-ready";
  assert.deepEqual(classifyImplementationReadiness(malformed), {
    classification: "malformed",
    valid: false,
    failClosed: true
  });
});

test("Phase 4.1L report inventories readiness without claiming runtime readiness", async () => {
  const report = await runReport();
  const inventory = report.phase41LRuntimeImplementationReadinessInventory;

  assert.deepEqual(report.phase, {
    id: "5.20",
    name: "Approval prerequisite source ingestion preflight",
    executionPosture:
      "approval-prerequisite-source-ingestion-preflight runtime-disabled no-runtime-execution"
  });
  assert.equal(report.reportMode, "local-summary-only");
  assert.equal(report.reportRunsChecks, false);
  assert.equal(inventory.readinessLayer.readyToPlan42A, true);
  assert.equal(inventory.readinessLayer.readyToImplementDeliberatelyBlockedSkeleton, true);
  assert.equal(inventory.readinessLayer.runtimeEnablementReady, false);
  assert.equal(inventory.readinessLayer.runtimeImplementationApproved, false);
  assert.equal(inventory.readinessLayer.runtimeApprovalGranted, false);
  assert.equal(inventory.readinessLayer.cliSourceChanged, false);
  assert.equal(inventory.readinessLayer.appsCliIndexChanged, false);
  assert.equal(inventory.readinessLayer.runtimeBlocked, true);
  assert.equal(inventory.readinessLayer.runtimeReadinessClaimed, false);
  assert.equal(inventory.readinessFixture.path, "tests/fixtures/host-policy/phase4-1l/runtime-implementation-readiness.json");
  assert.equal(inventory.readinessFixture.status, "present");
  assert.equal(inventory.readinessMetadata.schema, "ardyn.phase-4.1l.runtime-implementation-readiness");
  assert.equal(inventory.phase42AHandoff.recommendedPhaseName, "Phase 4.2A deliberately blocked Rust-host stdio runtime skeleton");
  assertAllFalse(inventory.runtimeEffect);
  assert.equal(inventory.safetyPosture.readyToPlan42A, true);
  assert.equal(inventory.safetyPosture.runtimeBlocked, true);
  assert.equal(inventory.safetyPosture.noRuntimeBehaviorIntroduced, true);
  assert.equal(report.safetyPosture.runtimeImplementationReadinessInventory, true);
  assert.equal(report.safetyPosture.flags.phase41LRuntimeImplemented, false);
  assert.equal(report.safetyPosture.flags.phase41LRuntimeReady, false);
  assert.equal(report.safetyPosture.flags.phase41LRuntimeImplementationReadinessCommandEnabled, false);
});

test("Phase 4.1L runtime-like commands remain rejected with zero stdout", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase4-1l-probes-"));

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

test("Phase 4.1L source guard keeps CLI unchanged and Rust runtime APIs absent", async () => {
  const [cliSource, rustSource, phase41LDoc] = await Promise.all([
    readFile(cliSourceUrl, "utf8"),
    readFile(rustHostSourceUrl, "utf8"),
    readFile(docUrl, "utf8")
  ]);
  const commandBranches = [...cliSource.matchAll(/if \(command === "([^"]+)"\)/g)].map(
    (match) => match[1]
  );
  const usage = cliSource.match(/Usage: ardyn <([^"]+)>/)?.[1] ?? "";
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
  assert.match(phase41LDoc, /4\.2A skeleton entry may be ready while runtime enablement remains blocked/);
  assert.match(phase41LDoc, /does not change `apps\/cli\/src\/index\.mjs`/);
  assert.match(phase41LDoc, /not a fresh Devin or external re-review/);

  for (const command of runtimeLikeCommands) {
    const escapedCommand = command.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    assert.doesNotMatch(cliSource, new RegExp(`command === "${escapedCommand}"`));
    assert.doesNotMatch(usage, new RegExp(`(^|\\||<)${escapedCommand}(\\||>|\\s|$)`));
  }

  for (const forbiddenPattern of [
    /std::io::stdin/,
    /std::io::stdout/,
    /std::io::stderr/,
    /std::process/,
    /Command::new/,
    /TcpListener/,
    /UdpSocket/,
    /thread::spawn/,
    /tokio::/,
    /async_std::/,
    /println!/,
    /eprintln!/,
    /pub\s+fn\s+run_stdio_runtime/,
    /pub\s+fn\s+stdio_runtime_skeleton_boundary/,
    /pub\s+struct\s+BlockedStdioRuntimeSkeleton/
  ]) {
    assert.doesNotMatch(rustProductionSource, forbiddenPattern);
  }
});
