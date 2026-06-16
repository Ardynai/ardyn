import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { access, mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";

const execFileAsync = promisify(execFile);
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase4-1g/external-review-packet.json",
  import.meta.url
);
const packetDocUrl = new URL(
  "../docs/phase-4-1g-external-review-packet.md",
  import.meta.url
);
const cliSourceUrl = new URL("../apps/cli/src/index.mjs", import.meta.url);
const coreSourceUrl = new URL("../packages/core/src/index.mjs", import.meta.url);
const reportScriptUrl = new URL("../scripts/report-phase-status.mjs", import.meta.url);
const rustHostSourceUrl = new URL("../crates/ardyn-host/src/lib.rs", import.meta.url);
const rootPackageUrl = new URL("../package.json", import.meta.url);
const cliPackageUrl = new URL("../apps/cli/package.json", import.meta.url);
const corePackageUrl = new URL("../packages/core/package.json", import.meta.url);
const cargoTomlUrl = new URL("../Cargo.toml", import.meta.url);
const rustHostCargoUrl = new URL("../crates/ardyn-host/Cargo.toml", import.meta.url);
const repoRootUrl = new URL("../", import.meta.url);
const repoRoot = fileURLToPath(repoRootUrl);
const cliPath = fileURLToPath(cliSourceUrl);
const reportScriptPath = fileURLToPath(reportScriptUrl);
const reviewedMainSha = "3a2f28e02494cb2ac0735e6bec32f283f4b616db";

const docUrls = [
  new URL("../README.md", import.meta.url),
  new URL("../apps/cli/README.md", import.meta.url),
  new URL("../packages/core/README.md", import.meta.url),
  new URL("../crates/ardyn-host/README.md", import.meta.url),
  new URL("../docs/architecture.md", import.meta.url),
  new URL("../docs/host-policy-preconditions.md", import.meta.url),
  new URL("../docs/session-events-stdio-contract.md", import.meta.url),
  new URL("../docs/phase-4-stdio-dry-run-event-emission.md", import.meta.url),
  new URL("../docs/phase-4-1-runtime-proposal.md", import.meta.url),
  new URL("../docs/phase-4-1e-failure-audit-kill-semantics.md", import.meta.url),
  new URL("../docs/phase-4-1f-runtime-readiness-checkpoint.md", import.meta.url)
];

const topLevelOrder = Object.freeze([
  "schema",
  "schemaVersion",
  "artifactKind",
  "packetPhase",
  "reviewedPhase",
  "metadataGeneratedAt",
  "currentMainSha",
  "reviewedPhaseRange",
  "reviewPacketOnly",
  "reviewMetadataOnly",
  "reviewPacketVerdict",
  "phaseSummaries",
  "runtimeReadinessEvidenceMap",
  "testAndSmokeCommands",
  "nonRuntimeInvariantMatrix",
  "blockedRuntimeSurfaces",
  "reviewerQuestionCategories",
  "reviewerOutcomeCategories",
  "reviewerQuestions",
  "recommendedOutcomes",
  "runtimeEffect",
  "audit"
]);

const phaseSummaryPhases = Object.freeze([
  "4.0A",
  "4.0B",
  "4.0C",
  "4.0D",
  "4.0E",
  "4.0F",
  "4.0G",
  "4.0H",
  "4.0I",
  "4.1",
  "4.1A",
  "4.1B",
  "4.1C",
  "4.1D",
  "4.1E",
  "4.1F"
]);

const evidenceMapIds = Object.freeze([
  "dry-run-emitter-evidence",
  "transport-policy-evidence",
  "host-policy-review-evidence",
  "pre-runtime-readiness-evidence",
  "phase-4.1-planning-evidence",
  "status-report-evidence"
]);

const nonRuntimeInvariantIds = Object.freeze([
  "no-live-runtime",
  "no-live-stdin-command-loop",
  "no-live-stdio-reader-or-writer",
  "no-listener-server-or-web-control-surface",
  "no-subprocess-spawning-or-process-control",
  "no-adapter-locus-mcp-openclaw-plugin-or-content-fabric-runtime",
  "no-secret-or-production-signing-key-use",
  "no-transcript-persistence-replay-runtime",
  "no-runtime-approval-grant"
]);

const blockedRuntimeSurfaceIds = Object.freeze([
  "serve-runtime-command",
  "stdio-runtime-command",
  "replay-session-transcript-command",
  "approval-evaluator-runtime",
  "process-stdio-ownership-runtime",
  "failure-audit-cleanup-kill-runtime",
  "transcript-persistence-replay-runtime",
  "external-integration-runtime"
]);

const reviewerQuestionCategories = Object.freeze([
  "packet-navigation",
  "documentation-consistency",
  "evidence-completeness",
  "scope-boundary",
  "approval-consent-boundary",
  "runtime-negative-surface",
  "transport-stdio-boundary",
  "transcript-replay-boundary",
  "failure-audit-kill-boundary",
  "external-integration-boundary",
  "blocker-disposition"
]);

const reviewerOutcomeCategories = Object.freeze([
  "packet-pass-runtime-still-blocked",
  "packet-pass-with-nits-runtime-still-blocked",
  "needs-clarification-runtime-still-blocked",
  "evidence-gap-runtime-still-blocked",
  "runtime-claim-detected-fail-closed",
  "out-of-scope-runtime-request",
  "external-review-recorded-runtime-still-blocked"
]);

const recommendedOutcomeIds = Object.freeze([
  "approve-packet-only",
  "deny-runtime",
  "check-again"
]);

const forbiddenRuntimeCommands = Object.freeze([
  "runtime",
  "run",
  "execute",
  "live-runtime",
  "serve-runtime",
  "stdio-runtime",
  "start-runtime",
  "run-runtime",
  "enable-runtime",
  "runtime-readiness",
  "runtime-readiness-checkpoint",
  "readiness-checkpoint",
  "checkpoint-runtime",
  "runtime-checkpoint",
  "runtime-readiness-review",
  "external-review-packet",
  "review-packet",
  "runtime-review-packet",
  "devin-review-packet",
  "phase-4-1g-review",
  "devin-runtime-review",
  "approve-runtime",
  "grant-runtime",
  "host-policy-approval",
  "operator-consent",
  "approval-evaluator",
  "evaluate-approval",
  "replay-session-transcript",
  "persist-session-transcript",
  "transcript-replay",
  "transport-harness",
  "stdin-reader",
  "stdout-writer",
  "stderr-writer",
  "failure-audit",
  "failure-audit-record",
  "emit-failure-audit",
  "failure-audit-runtime",
  "cleanup-runtime",
  "run-cleanup",
  "kill-runtime",
  "kill-process",
  "terminate-process",
  "process-kill",
  "exit-runtime",
  "exit-handler",
  "signal-handler",
  "handle-signal",
  "policy-metadata",
  "host-policy-export"
]);

async function readJsonUrl(url) {
  return JSON.parse(await readFile(url, "utf8"));
}

async function readPacketFixture() {
  const text = await readFile(fixtureUrl, "utf8");
  return { text, json: JSON.parse(text) };
}

async function runReport() {
  const { stdout, stderr } = await execFileAsync(process.execPath, [reportScriptPath], {
    cwd: repoRoot,
    encoding: "utf8",
    maxBuffer: 4 * 1024 * 1024
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

async function assertRepoPathExists(path) {
  await access(new URL(`../${path}`, import.meta.url));
}

function assertAllFalse(record) {
  for (const [field, value] of Object.entries(record)) {
    assert.equal(value, false, field);
  }
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function classifyExternalReviewPacketForReview(record) {
  if (
    record?.schema !== "ardyn.external-runtime-readiness-review-packet" ||
    record?.packetPhase !== "phase-4.1g-external-review-packet" ||
    record?.reviewPacketOnly !== true ||
    record?.reviewMetadataOnly !== true
  ) {
    return { classification: "malformed", valid: false, failClosed: true };
  }

  const runtimeEffectValues = Object.values(record.runtimeEffect ?? {});
  const phaseAttemptsRuntime = (record.phaseSummaries ?? []).some(
    (phase) => phase.runtimeImplemented === true || phase.grantsRuntimeApproval === true
  );
  const invariantAttemptsRuntime = (record.nonRuntimeInvariantMatrix ?? []).some(
    (invariant) =>
      invariant.grantsRuntimeApproval === true ||
      invariant.runtimeBehaviorIntroduced === true
  );
  const blockedSurfaceAttemptsRuntime = (record.blockedRuntimeSurfaces ?? []).some(
    (surface) =>
      surface.grantsRuntimeApproval === true || surface.runtimeBehaviorIntroduced === true
  );
  const reviewerQuestionAttemptsRuntime = (record.reviewerQuestions ?? []).some(
    (question) => question.grantsRuntimeApproval === true
  );
  const outcomeAttemptsRuntime = (record.recommendedOutcomes ?? []).some(
    (outcome) =>
      outcome.grantsRuntimeApproval === true ||
      outcome.runtimeImplementationApproved === true ||
      outcome.runtimeEnablementApproved === true ||
      outcome.runtimeBehaviorIntroduced === true ||
      outcome.runtimeUnblockRequiresSeparateApproval !== true
  );

  if (
    runtimeEffectValues.some((value) => value === true) ||
    record.reviewPacketVerdict?.grantsRuntimeApproval === true ||
    record.reviewPacketVerdict?.runtimeImplementationApproved === true ||
    record.reviewPacketVerdict?.runtimeEnablementApproved === true ||
    record.reviewPacketVerdict?.runtimeBehaviorIntroduced === true ||
    record.reviewPacketVerdict?.liveRuntimeBehaviorIntroduced === true ||
    phaseAttemptsRuntime ||
    invariantAttemptsRuntime ||
    blockedSurfaceAttemptsRuntime ||
    reviewerQuestionAttemptsRuntime ||
    outcomeAttemptsRuntime
  ) {
    return {
      classification: "runtime_unavailable",
      valid: false,
      failClosed: true,
      runtimeAvailable: false
    };
  }

  return {
    classification: "external_review_packet_only",
    valid: true,
    failClosed: false,
    runtimeAvailable: false
  };
}

test("Phase 4.1G review packet fixture is deterministic LF-only metadata", async () => {
  const { text, json } = await readPacketFixture();

  assert.equal(text.endsWith("\n"), true);
  assert.equal(text.includes("\r"), false);
  assert.deepEqual(Object.keys(json), topLevelOrder);
  assert.equal(json.schema, "ardyn.external-runtime-readiness-review-packet");
  assert.equal(json.schemaVersion, "0.1.0");
  assert.equal(json.artifactKind, "external-runtime-readiness-review-packet");
  assert.equal(json.packetPhase, "phase-4.1g-external-review-packet");
  assert.equal(json.reviewedPhase, "4.1G");
  assert.equal(json.metadataGeneratedAt, "1970-01-01T00:00:00.000Z");
  assert.equal(json.currentMainSha, reviewedMainSha);
  assert.deepEqual(json.reviewedPhaseRange, {
    fromPhase: "4.0A",
    throughPhase: "4.1F",
    externalReviewTarget: "Devin or human runtime-readiness reviewer",
    addsRuntimeImplementation: false
  });
  assert.equal(json.reviewPacketOnly, true);
  assert.equal(json.reviewMetadataOnly, true);
  assert.deepEqual(json.reviewPacketVerdict, {
    id: "phase-4.1g-external-review-packet-verdict",
    verdict: "packet-ready-runtime-still-blocked",
    codexPacketStatus: "ready-for-external-review",
    devinReviewTarget: true,
    runtimeImplementationApproved: false,
    runtimeEnablementApproved: false,
    grantsRuntimeApproval: false,
    runtimeBehaviorIntroduced: false,
    liveRuntimeBehaviorIntroduced: false,
    requiresSeparateRuntimeImplementationApproval: true,
    requiresReviewerDecisionBeforeRuntime: true
  });
  assert.deepEqual(
    json.phaseSummaries.map(({ phase }) => phase),
    phaseSummaryPhases
  );
  assert.deepEqual(
    json.runtimeReadinessEvidenceMap.map(({ id }) => id),
    evidenceMapIds
  );
  assert.deepEqual(
    json.nonRuntimeInvariantMatrix.map(({ id }) => id),
    nonRuntimeInvariantIds
  );
  assert.deepEqual(
    json.blockedRuntimeSurfaces.map(({ id }) => id),
    blockedRuntimeSurfaceIds
  );
  assert.deepEqual(json.reviewerQuestionCategories, reviewerQuestionCategories);
  assert.deepEqual(json.reviewerOutcomeCategories, reviewerOutcomeCategories);
  assert.deepEqual(
    json.recommendedOutcomes.map(({ outcome }) => outcome),
    recommendedOutcomeIds
  );
  assertAllFalse(json.runtimeEffect);
  assert.deepEqual(classifyExternalReviewPacketForReview(json), {
    classification: "external_review_packet_only",
    valid: true,
    failClosed: false,
    runtimeAvailable: false
  });

  for (const phase of json.phaseSummaries) {
    assert.equal(phase.runtimeImplemented, false, phase.phase);
    assert.equal(phase.grantsRuntimeApproval, false, phase.phase);
  }

  for (const invariant of json.nonRuntimeInvariantMatrix) {
    assert.equal(invariant.status, "preserved", invariant.id);
    assert.equal(invariant.runtimeBehaviorIntroduced, false, invariant.id);
    assert.equal(invariant.grantsRuntimeApproval, false, invariant.id);
  }

  for (const blockedSurface of json.blockedRuntimeSurfaces) {
    assert.equal(blockedSurface.status, "blocked", blockedSurface.id);
    assert.equal(blockedSurface.grantsRuntimeApproval, false, blockedSurface.id);
    assert.equal(blockedSurface.runtimeBehaviorIntroduced, false, blockedSurface.id);
  }

  for (const question of json.reviewerQuestions) {
    assert.ok(json.reviewerQuestionCategories.includes(question.category), question.id);
    assert.equal(question.grantsRuntimeApproval, false, question.id);
  }

  for (const outcome of json.recommendedOutcomes) {
    assert.ok(json.reviewerOutcomeCategories.includes(outcome.category), outcome.outcome);
    assert.equal(outcome.grantsRuntimeApproval, false, outcome.outcome);
    assert.equal(outcome.runtimeImplementationApproved, false, outcome.outcome);
    assert.equal(outcome.runtimeEnablementApproved, false, outcome.outcome);
    assert.equal(outcome.runtimeBehaviorIntroduced, false, outcome.outcome);
    assert.equal(outcome.runtimeUnblockRequiresSeparateApproval, true, outcome.outcome);
  }
});

test("Phase 4.1G review packet currentMainSha matches Devin-reviewed main SHA", async () => {
  const { json } = await readPacketFixture();
  const packetDoc = await readFile(packetDocUrl, "utf8");

  assert.equal(json.currentMainSha, reviewedMainSha);
  assert.match(packetDoc, new RegExp(reviewedMainSha, "g"));
});

test("Phase 4.1G review packet references committed Phase 4.0A through 4.1F evidence", async () => {
  const { json } = await readPacketFixture();

  for (const phase of json.phaseSummaries) {
    for (const evidencePath of phase.primaryEvidencePaths) {
      await assertRepoPathExists(evidencePath);
    }
  }

  for (const item of json.runtimeReadinessEvidenceMap) {
    assert.equal(item.reviewOnly, true, item.id);
    for (const evidencePath of item.evidencePaths) {
      await assertRepoPathExists(evidencePath);
    }
  }

  for (const invariant of json.nonRuntimeInvariantMatrix) {
    for (const evidencePath of invariant.evidencePaths) {
      await assertRepoPathExists(evidencePath);
    }
  }

  for (const blockedSurface of json.blockedRuntimeSurfaces) {
    for (const evidencePath of blockedSurface.evidencePaths) {
      await assertRepoPathExists(evidencePath);
    }
  }

  for (const question of json.reviewerQuestions) {
    for (const evidencePath of question.expectedEvidencePaths) {
      await assertRepoPathExists(evidencePath);
    }
  }
});

test("Phase 4.1G cannot bless packet metadata into runtime approval", async () => {
  const { json } = await readPacketFixture();
  const mutations = [
    ["reviewPacketVerdict.grantsRuntimeApproval", (record) => {
      record.reviewPacketVerdict.grantsRuntimeApproval = true;
    }],
    ["reviewPacketVerdict.runtimeImplementationApproved", (record) => {
      record.reviewPacketVerdict.runtimeImplementationApproved = true;
    }],
    ["runtimeEffect.runtimeCommandAvailable", (record) => {
      record.runtimeEffect.runtimeCommandAvailable = true;
    }],
    ["runtimeEffect.approvalEvaluatorAvailable", (record) => {
      record.runtimeEffect.approvalEvaluatorAvailable = true;
    }],
    ["phaseSummaries runtimeImplemented", (record) => {
      record.phaseSummaries[0].runtimeImplemented = true;
    }],
    ["nonRuntimeInvariantMatrix grantsRuntimeApproval", (record) => {
      record.nonRuntimeInvariantMatrix[0].grantsRuntimeApproval = true;
    }],
    ["blockedRuntimeSurfaces runtimeBehaviorIntroduced", (record) => {
      record.blockedRuntimeSurfaces[0].runtimeBehaviorIntroduced = true;
    }],
    ["reviewerQuestions grantsRuntimeApproval", (record) => {
      record.reviewerQuestions[0].grantsRuntimeApproval = true;
    }],
    ["recommendedOutcomes runtimeImplementationApproved", (record) => {
      record.recommendedOutcomes[0].runtimeImplementationApproved = true;
    }],
    ["recommendedOutcomes runtimeUnblockRequiresSeparateApproval false", (record) => {
      record.recommendedOutcomes[0].runtimeUnblockRequiresSeparateApproval = false;
    }]
  ];

  for (const [label, mutate] of mutations) {
    const mutated = clone(json);
    mutate(mutated);
    const result = classifyExternalReviewPacketForReview(mutated);

    assert.equal(result.classification, "runtime_unavailable", label);
    assert.equal(result.valid, false, label);
    assert.equal(result.failClosed, true, label);
    assert.equal(result.runtimeAvailable, false, label);
  }

  const malformed = clone(json);
  malformed.reviewPacketOnly = false;
  assert.deepEqual(classifyExternalReviewPacketForReview(malformed), {
    classification: "malformed",
    valid: false,
    failClosed: true
  });
});

test("Phase 4.1G docs cross-link packet without implying runtime", async () => {
  const [packetDoc, ...docs] = await Promise.all([
    readFile(packetDocUrl, "utf8"),
    ...docUrls.map((url) => readFile(url, "utf8"))
  ]);
  const normalizedDoc = packetDoc.replace(/\s+/g, " ");

  for (const requiredPhrase of [
    "Phase 4.1G prepares the external runtime-readiness review packet",
    "review packet metadata only",
    "cannot grant runtime approval",
    "Current main SHA at packet preparation",
    reviewedMainSha,
    "Phase 4.0A through Phase 4.1F",
    "Runtime-Readiness Evidence Map",
    "Required Validation And Smoke Commands",
    "Non-Runtime Invariant Matrix",
    "Blocked Runtime Surfaces",
    "Reviewer Questions",
    "Recommended Outcomes",
    "serve-runtime",
    "stdio-runtime",
    "replay-session-transcript",
    "approval evaluator",
    "Phase 4.1G itself is not that approval"
  ]) {
    assert.match(
      normalizedDoc,
      new RegExp(requiredPhrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i")
    );
  }

  for (const source of docs) {
    assert.match(source, /docs\/phase-4-1g-external-review-packet\.md/);
  }

  for (const misleadingPhrase of [
    "readyForRuntimeExecution",
    "goLive",
    "productionReady",
    "runtime unlocked",
    "runtime command implemented",
    "packet grants runtime approval",
    "review packet command implemented"
  ]) {
    assert.doesNotMatch(normalizedDoc, new RegExp(misleadingPhrase, "i"));
  }
});

test("Phase 4.1G status report inventories packet without running checks", async () => {
  const report = await runReport();
  const inventory = report.phase41GExternalReviewPacketInventory;

  assert.deepEqual(report.phase, {
    id: "5.30",
    name: "Non-authorizing evaluator decision-candidate inspection artifact",
    executionPosture:
      "non-authorizing-evaluator-decision-candidate-inspection-artifact runtime-disabled no-evaluator-execution no-evaluator-result no-runtime-execution no-approval-decision"
  });
  assert.equal(report.reportMode, "local-summary-only");
  assert.equal(report.reportRunsChecks, false);
  assert.equal(inventory.packet.schema, "ardyn.external-runtime-readiness-review-packet");
  assert.equal(inventory.packet.artifactKind, "external-runtime-readiness-review-packet");
  assert.equal(inventory.packet.packetPhase, "phase-4.1g-external-review-packet");
  assert.equal(inventory.packet.reviewedPhase, "4.1G");
  assert.equal(inventory.packet.currentMainSha, reviewedMainSha);
  assert.equal(inventory.packet.reviewPacketOnly, true);
  assert.equal(inventory.packet.reviewMetadataOnly, true);
  assert.equal(inventory.packet.runtimeBehaviorIntroduced, false);
  assert.equal(inventory.packet.liveRuntimeBehaviorIntroduced, false);
  assert.equal(inventory.packet.grantsRuntimeApproval, false);
  assert.deepEqual(inventory.phaseSummaryPhases, phaseSummaryPhases);
  assert.deepEqual(inventory.evidenceMapIds, evidenceMapIds);
  assert.deepEqual(inventory.nonRuntimeInvariantIds, nonRuntimeInvariantIds);
  assert.deepEqual(inventory.blockedRuntimeSurfaceIds, blockedRuntimeSurfaceIds);
  assert.deepEqual(inventory.reviewerQuestionCategories, reviewerQuestionCategories);
  assert.deepEqual(inventory.reviewerOutcomeCategories, reviewerOutcomeCategories);
  assert.deepEqual(inventory.recommendedOutcomeIds, recommendedOutcomeIds);
  assertAllFalse(inventory.runtimeEffect);
  assert.equal(inventory.reviewOnlyDisplayBehavior.packetCannotGrantRuntimeApproval, true);
  assert.equal(inventory.reviewOnlyDisplayBehavior.packetDoesNotEnableRuntime, true);
  assert.equal(inventory.cliCommandSurface.commandAdded, false);
  assert.equal(inventory.cliCommandSurface.reviewPacketCommandAdded, false);
  assert.equal(inventory.cliCommandSurface.serveRuntimeCommandAdded, false);
  assert.equal(inventory.cliCommandSurface.stdioRuntimeCommandAdded, false);
  assert.equal(inventory.apiSurface.typescriptCoreRuntimeApiAdded, false);
  assert.equal(inventory.apiSurface.typescriptCoreReviewPacketHelperAdded, false);
  assert.equal(inventory.apiSurface.approvalEvaluatorAdded, false);
  assert.equal(report.safetyPosture.runtimeReadinessCheckpoint, true);
  assert.equal(report.safetyPosture.externalReviewPacket, true);
  assert.equal(report.safetyPosture.flags.phase41RuntimeImplemented, false);

  assert.deepEqual(inventory.fixtures, [
    {
      path: "tests/fixtures/host-policy/phase4-1g/external-review-packet.json",
      status: "present"
    }
  ]);
  assert.deepEqual(
    inventory.docs.map(({ path, status }) => [path, status]),
    [
      ["docs/phase-4-1g-external-review-packet.md", "present"],
      ["docs/phase-4-1f-runtime-readiness-checkpoint.md", "present"],
      ["docs/phase-4-1-runtime-proposal.md", "present"],
      ["docs/phase-4-stdio-dry-run-event-emission.md", "present"],
      ["docs/session-events-stdio-contract.md", "present"],
      ["docs/host-policy-preconditions.md", "present"],
      ["docs/architecture.md", "present"],
      ["README.md", "present"],
      ["apps/cli/README.md", "present"],
      ["packages/core/README.md", "present"],
      ["crates/ardyn-host/README.md", "present"]
    ]
  );
  assert.deepEqual(
    inventory.tests.map(({ path, status }) => [path, status]),
    [
      ["tests/phase4-1g-external-review-packet.test.mjs", "present"],
      ["tests/report-phase-status.test.mjs", "present"],
      ["tests/phase4-1f-runtime-readiness-checkpoint.test.mjs", "present"]
    ]
  );

  for (const probe of [
    "missing --dry-run",
    "unsafe manifest URL",
    "invalid JSON manifest",
    "invalid JSON task",
    "serve-runtime",
    "stdio-runtime",
    "runtime-readiness-review",
    "external-review-packet",
    "review-packet",
    "runtime-review-packet",
    "phase-4-1g-review",
    "approve-runtime",
    "grant-runtime",
    "host-policy-approval",
    "operator-consent",
    "approval-evaluator",
    "replay-session-transcript",
    "transcript-replay",
    "transport-harness",
    "stdout-writer",
    "stderr-writer",
    "failure-audit-record",
    "cleanup-runtime",
    "kill-runtime",
    "policy-metadata",
    "host-policy-export"
  ]) {
    assert.ok(inventory.invariantProbes.includes(probe), probe);
  }

  assert.deepEqual(inventory.safetyPosture, {
    nonExecuting: true,
    externalReviewPacketOnly: true,
    reviewOnly: true,
    noLiveRuntime: true,
    noRuntimeCommand: true,
    noReviewPacketCommand: true,
    noServeRuntime: true,
    noStdioRuntime: true,
    noReplaySessionTranscript: true,
    noLiveStdioRuntime: true,
    noStdinCommandLoop: true,
    noLiveStdioReader: true,
    noStdoutWriter: true,
    noStderrWriter: true,
    noProcessStdioOwnership: true,
    noListener: true,
    noServer: true,
    noSubprocessSpawning: true,
    noAdapterCalls: true,
    noLocusRuntimeDependency: true,
    noMcpCalls: true,
    noOpenClawCalls: true,
    noPluginExecution: true,
    noContentFabricRuntimeBehavior: true,
    noContentFabricDownloadInstallEnable: true,
    noTranscriptPersistenceReplayRuntime: true,
    noFailureAuditRuntime: true,
    noCleanupRuntime: true,
    noProcessKill: true,
    noApprovalEvaluator: true,
    noHostPolicyEnforcement: true,
    noWebSocketHttpControlSurface: true,
    noSecrets: true,
    noProductionSigningKeys: true,
    noRuntimeApprovalGrant: true,
    noCliCommandAdded: true,
    noFileWriterAdded: true,
    noStdoutPrinterAdded: true,
    noRuntimeBehaviorIntroduced: true
  });

  for (const check of [...report.configuredChecks, ...report.verificationCommands]) {
    assert.equal(check.ranByReport, false, check.command);
  }
});

test("Phase 4.1G source guards do not add runtime, review packet command, or dependency surfaces", async () => {
  const [
    cliSource,
    coreSource,
    reportSource,
    rustSource,
    rootPackage,
    cliPackage,
    corePackage,
    cargoToml,
    rustHostCargo
  ] = await Promise.all([
    readFile(cliSourceUrl, "utf8"),
    readFile(coreSourceUrl, "utf8"),
    readFile(reportScriptUrl, "utf8"),
    readFile(rustHostSourceUrl, "utf8"),
    readJsonUrl(rootPackageUrl),
    readJsonUrl(cliPackageUrl),
    readJsonUrl(corePackageUrl),
    readFile(cargoTomlUrl, "utf8"),
    readFile(rustHostCargoUrl, "utf8")
  ]);
  const rustProductionSource = rustSource.split(/\n#\[cfg\(test\)\]\n/)[0];
  const commandBranches = [...cliSource.matchAll(/if \(command === "([^"]+)"\)/g)].map(
    (match) => match[1]
  );
  const usage = cliSource.match(/Usage: ardyn <([^"]+)>/)?.[1] ?? "";
  const cliWriteFileMatches = [...cliSource.matchAll(/\bwriteFile\s*\(/g)];

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
  assert.equal(cliWriteFileMatches.length, 1, "only existing plan --review-artifact --output writer remains");
  assert.match(reportSource, /phase41GExternalReviewPacketInventory/);

  for (const command of forbiddenRuntimeCommands) {
    const escapedCommand = command.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    assert.doesNotMatch(cliSource, new RegExp(`command === "${escapedCommand}"`));
    assert.doesNotMatch(usage, new RegExp(`(^|\\||<)${escapedCommand}(\\||>|\\s|$)`));
  }

  for (const [label, source] of [
    ["CLI", cliSource],
    ["core", coreSource],
    ["report", reportSource]
  ]) {
    for (const forbiddenPattern of [
      /process\.stdin/,
      /node:readline/,
      /node:child_process/,
      /node:http/,
      /node:https/,
      /node:net/,
      /node:dgram/,
      /\bfetch\s*\(/,
      /\bWebSocket\s*\(/,
      /\bspawn\s*\(/,
      /\bexecFile\s*\(/,
      /\bfork\s*\(/,
      /\bcreateServer\s*\(/,
      /\.listen\s*\(/,
      /process\.kill\s*\(/,
      /process\.(?:on|once)\s*\(\s*["']SIG(?:INT|TERM|BREAK|KILL|QUIT)["']/,
      /createWriteStream/,
      /class\s+ApprovalEvaluator/,
      /function\s+ApprovalEvaluator/,
      /export\s+function\s+evaluateApproval/,
      /(?:export\s+)?function\s+grantRuntimeApproval/,
      /class\s+RuntimeApprovalGrant/,
      /@ardyn\/adapters/,
      /@ardyn\/fabric/,
      /@ardyn\/mcp/
    ]) {
      assert.doesNotMatch(source, forbiddenPattern, `${label} source should avoid ${forbiddenPattern}`);
    }
  }

  for (const forbiddenRustPattern of [
    /std::process/,
    /\bCommand::new\b/,
    /std::io::stdin/,
    /std::net::/,
    /\bTcpListener\b/,
    /\bTcpStream\b/,
    /\bUdpSocket\b/,
    /\btokio\b/,
    /\breqwest\b/,
    /\bhyper\b/,
    /\baxum\b/,
    /\bwarp\b/,
    /\btungstenite\b/,
    /println!/,
    /eprintln!/,
    /std::fs::write/,
    /\bFile::create\b/,
    /\bwrite_all\b/,
    /std::env::var/,
    /grant_runtime_approval/i,
    /runtime_approval_granted\s*:\s*true/i
  ]) {
    assert.doesNotMatch(rustProductionSource, forbiddenRustPattern);
  }

  assert.deepEqual(rootPackage.devDependencies, { ajv: "^8.17.1" });
  assert.equal(rootPackage.dependencies, undefined);
  assert.deepEqual(cliPackage.dependencies, { "@ardyn/core": "file:../../packages/core" });
  assert.deepEqual(corePackage.dependencies, { ajv: "^8.17.1" });
  assert.match(cargoToml, /members = \["crates\/ardyn-host"\]/);
  assert.match(rustHostCargo, /serde = \{ version = "1", features = \["derive"\] \}/);
  assert.match(rustHostCargo, /serde_json = "1"/);
  assert.match(rustHostCargo, /sha2 = "0\.10"/);
  assert.doesNotMatch(rustHostCargo, /tokio|reqwest|hyper|axum|warp|tungstenite/);
});

test("Phase 4.1G runtime and review-packet CLI probes fail safely with zero stdout", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase4-1g-probes-"));

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
