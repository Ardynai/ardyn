import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { access, mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";

const execFileAsync = promisify(execFile);
const dispositionFixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase4-1h/external-review-disposition.json",
  import.meta.url
);
const packetFixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase4-1g/external-review-packet.json",
  import.meta.url
);
const dispositionDocUrl = new URL(
  "../docs/phase-4-1h-external-review-disposition.md",
  import.meta.url
);
const packetDocUrl = new URL(
  "../docs/phase-4-1g-external-review-packet.md",
  import.meta.url
);
const reportScriptUrl = new URL("../scripts/report-phase-status.mjs", import.meta.url);
const cliSourceUrl = new URL("../apps/cli/src/index.mjs", import.meta.url);
const repoRootUrl = new URL("../", import.meta.url);
const repoRoot = fileURLToPath(repoRootUrl);
const reportScriptPath = fileURLToPath(reportScriptUrl);
const cliPath = fileURLToPath(cliSourceUrl);

const stalePacketSha = "070b327b6132e14170598d3e865dcf5ec4b0993e";
const correctedReviewedSha = "3a2f28e02494cb2ac0735e6bec32f283f4b616db";
const fixCommitSha = "74b9872a7e44972fcc6d9bf33eb5a93829554cd0";

const topLevelOrder = Object.freeze([
  "schema",
  "schemaVersion",
  "artifactKind",
  "dispositionPhase",
  "reviewedPhase",
  "metadataGeneratedAt",
  "currentMainSha",
  "sourceReview",
  "targetedFix",
  "validationSummary",
  "smokeProbeSummary",
  "reviewOnlyBoundary",
  "nextAllowedStep",
  "stillBlockedRuntimeSurfaces",
  "runtimeEffect",
  "audit"
]);

const fixFiles = Object.freeze([
  "docs/phase-4-1g-external-review-packet.md",
  "tests/fixtures/host-policy/phase4-1g/external-review-packet.json",
  "tests/phase4-1g-external-review-packet.test.mjs",
  "tests/report-phase-status.test.mjs"
]);

const blockedRuntimeSurfaceIds = Object.freeze([
  "serve-runtime-command",
  "stdio-runtime-command",
  "replay-session-transcript-command",
  "approval-evaluator-runtime",
  "process-stdio-ownership-runtime",
  "failure-audit-cleanup-kill-runtime",
  "transcript-persistence-replay-runtime",
  "external-integration-runtime",
  "websocket-http-control-surface",
  "runtime-approval-grant"
]);

const requiredRejectedProbes = Object.freeze([
  "missing --dry-run",
  "unknown arg",
  "unsafe manifest URL",
  "invalid JSON manifest",
  "invalid JSON task",
  "replay-session-transcript",
  "policy-metadata",
  "host-policy-export",
  "serve-runtime",
  "stdio-runtime",
  "external-review-packet",
  "review-packet",
  "runtime-readiness-review"
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

const crossLinkDocUrls = Object.freeze([
  new URL("../README.md", import.meta.url),
  new URL("../apps/cli/README.md", import.meta.url),
  new URL("../packages/core/README.md", import.meta.url),
  new URL("../crates/ardyn-host/README.md", import.meta.url),
  new URL("../docs/architecture.md", import.meta.url),
  new URL("../docs/host-policy-preconditions.md", import.meta.url),
  new URL("../docs/session-events-stdio-contract.md", import.meta.url),
  new URL("../docs/phase-4-stdio-dry-run-event-emission.md", import.meta.url),
  new URL("../docs/phase-4-1-runtime-proposal.md", import.meta.url),
  new URL("../docs/phase-4-1g-external-review-packet.md", import.meta.url)
]);

async function readDispositionFixture() {
  const text = await readFile(dispositionFixtureUrl, "utf8");
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

function clone(record) {
  return JSON.parse(JSON.stringify(record));
}

function assertAllFalse(record) {
  for (const [field, value] of Object.entries(record)) {
    assert.equal(value, false, field);
  }
}

function classifyExternalReviewDispositionForReview(record) {
  if (
    record?.schema !== "ardyn.external-review-disposition-record" ||
    record?.dispositionPhase !== "phase-4.1h-external-review-disposition" ||
    record?.reviewOnlyBoundary?.externalReviewDispositionRecordOnly !== true ||
    record?.reviewOnlyBoundary?.reviewMetadataOnly !== true ||
    record?.sourceReview?.freshDevinReReview !== false ||
    record?.targetedFix?.blockerFixed !== true
  ) {
    return {
      classification: "malformed",
      valid: false,
      failClosed: true
    };
  }

  const runtimeFlags = [
    record.reviewOnlyBoundary.runtimeImplementationApproved,
    record.reviewOnlyBoundary.runtimeEnablementApproved,
    record.reviewOnlyBoundary.grantsRuntimeApproval,
    record.reviewOnlyBoundary.runtimeBehaviorIntroduced,
    record.nextAllowedStep.implementationAllowedInThisPhase,
    record.nextAllowedStep.runtimeApprovalGranted,
    ...Object.values(record.runtimeEffect),
    ...record.stillBlockedRuntimeSurfaces.flatMap((surface) => [
      surface.runtimeBehaviorIntroduced,
      surface.grantsRuntimeApproval
    ])
  ];

  if (runtimeFlags.some((value) => value !== false)) {
    return {
      classification: "runtime_unavailable",
      valid: false,
      failClosed: true,
      runtimeAvailable: false
    };
  }

  return {
    classification: "external_review_disposition_only",
    valid: true,
    failClosed: false,
    runtimeAvailable: false
  };
}

test("Phase 4.1H external review disposition fixture is deterministic LF-only metadata", async () => {
  const { text, json } = await readDispositionFixture();

  assert.equal(text.endsWith("\n"), true);
  assert.equal(text.includes("\r"), false);
  assert.deepEqual(Object.keys(json), topLevelOrder);
  assert.equal(json.schema, "ardyn.external-review-disposition-record");
  assert.equal(json.schemaVersion, "0.1.0");
  assert.equal(json.artifactKind, "external-review-disposition-record");
  assert.equal(json.dispositionPhase, "phase-4.1h-external-review-disposition");
  assert.equal(json.reviewedPhase, "4.1H");
  assert.equal(json.metadataGeneratedAt, "1970-01-01T00:00:00.000Z");
  assert.equal(json.currentMainSha, fixCommitSha);
  assert.equal(json.sourceReview.priorDisposition, "request_targeted_fixes_before_approval");
  assert.equal(json.sourceReview.targetedBlocker, "stale_phase_4.1g_currentMainSha");
  assert.equal(json.sourceReview.reviewedPacketCurrentMainSha, correctedReviewedSha);
  assert.equal(json.sourceReview.architectureRuntimeBlockerFound, false);
  assert.equal(json.sourceReview.freshDevinReReview, false);
  assert.equal(json.targetedFix.blockerFixed, true);
  assert.equal(json.targetedFix.staleMainSha, stalePacketSha);
  assert.equal(json.targetedFix.correctedReviewedSha, correctedReviewedSha);
  assert.equal(json.targetedFix.fixCommitSha, fixCommitSha);
  assert.equal(json.targetedFix.staleShaRemainingPhase41GPacketMatches, 0);
  assert.equal(json.targetedFix.appsCliSourceTouched, false);
  assert.deepEqual(json.targetedFix.filesChangedByFix, fixFiles);
  assert.equal(json.validationSummary.recordedFromTargetedFix, true);
  assert.equal(json.validationSummary.ranByDispositionPhase, false);
  assert.deepEqual(
    json.validationSummary.commands.map(({ command, result }) => [command, result]),
    [
      ["npm test", "passed"],
      ["npm run test:schemas", "passed"],
      ["cargo test --workspace", "passed"],
      ["cargo check --workspace", "passed"],
      ["cargo fmt --check", "passed"],
      ["git diff --check", "passed"],
      ["npm run report:phase-status", "passed"]
    ]
  );
  assert.deepEqual(json.smokeProbeSummary.rejectionProbes, requiredRejectedProbes);
  assert.equal(json.smokeProbeSummary.emitSessionEventsDryRun.exitCode, 0);
  assert.equal(json.smokeProbeSummary.emitSessionEventsDryRun.stdoutJsonlOnly, true);
  assert.equal(json.smokeProbeSummary.emitSessionEventsDryRun.lfOnly, true);
  assert.equal(json.smokeProbeSummary.emitSessionEventsDryRun.finalLf, true);
  assert.equal(json.smokeProbeSummary.emitSessionEventsDryRun.eventLines, 6);
  assert.equal(json.smokeProbeSummary.emitSessionEventsDryRun.zeroStderr, true);
  assert.equal(json.reviewOnlyBoundary.externalReviewDispositionRecordOnly, true);
  assert.equal(json.reviewOnlyBoundary.notFreshDevinReReview, true);
  assert.equal(json.reviewOnlyBoundary.readyToPlanFirstRustHostStdioRuntimeTestHarnessOnly, true);
  assert.equal(json.nextAllowedStep.id, "plan-first-rust-host-stdio-runtime-test-harness-only");
  assert.equal(json.nextAllowedStep.planningOnly, true);
  assert.equal(json.nextAllowedStep.implementationAllowedInThisPhase, false);
  assert.deepEqual(
    json.stillBlockedRuntimeSurfaces.map(({ id }) => id),
    blockedRuntimeSurfaceIds
  );
  assertAllFalse(json.runtimeEffect);
  assert.deepEqual(classifyExternalReviewDispositionForReview(json), {
    classification: "external_review_disposition_only",
    valid: true,
    failClosed: false,
    runtimeAvailable: false
  });
});

test("Phase 4.1H disposition references fixed Phase 4.1G SHA metadata and committed evidence", async () => {
  const { json } = await readDispositionFixture();
  const packetFixture = JSON.parse(await readFile(packetFixtureUrl, "utf8"));
  const dispositionDoc = await readFile(dispositionDocUrl, "utf8");

  assert.equal(packetFixture.currentMainSha, correctedReviewedSha);
  assert.equal(json.sourceReview.reviewedPacketCurrentMainSha, packetFixture.currentMainSha);
  assert.equal(json.targetedFix.correctedReviewedSha, packetFixture.currentMainSha);
  assert.match(dispositionDoc, new RegExp(correctedReviewedSha, "g"));
  assert.match(dispositionDoc, new RegExp(fixCommitSha, "g"));

  for (const evidencePath of json.audit.evidencePaths) {
    await assertRepoPathExists(evidencePath);
  }

  for (const fixedFile of json.targetedFix.filesChangedByFix) {
    await assertRepoPathExists(fixedFile);
  }
});

test("Phase 4.1G packet and fixture no longer contain stale currentMainSha", async () => {
  const [packetFixtureText, packetDoc] = await Promise.all([
    readFile(packetFixtureUrl, "utf8"),
    readFile(packetDocUrl, "utf8")
  ]);

  assert.doesNotMatch(packetFixtureText, new RegExp(stalePacketSha, "g"));
  assert.doesNotMatch(packetDoc, new RegExp(stalePacketSha, "g"));
  assert.match(packetFixtureText, new RegExp(correctedReviewedSha, "g"));
  assert.match(packetDoc, new RegExp(correctedReviewedSha, "g"));
});

test("Phase 4.1H disposition cannot bless targeted-fix metadata into runtime approval", async () => {
  const { json } = await readDispositionFixture();
  const mutations = [
    ["reviewOnlyBoundary.grantsRuntimeApproval", (record) => {
      record.reviewOnlyBoundary.grantsRuntimeApproval = true;
    }],
    ["reviewOnlyBoundary.runtimeImplementationApproved", (record) => {
      record.reviewOnlyBoundary.runtimeImplementationApproved = true;
    }],
    ["nextAllowedStep.implementationAllowedInThisPhase", (record) => {
      record.nextAllowedStep.implementationAllowedInThisPhase = true;
    }],
    ["runtimeEffect.runtimeCommandAvailable", (record) => {
      record.runtimeEffect.runtimeCommandAvailable = true;
    }],
    ["runtimeEffect.stdioRuntimeCommandAvailable", (record) => {
      record.runtimeEffect.stdioRuntimeCommandAvailable = true;
    }],
    ["stillBlockedRuntimeSurfaces grantsRuntimeApproval", (record) => {
      record.stillBlockedRuntimeSurfaces[0].grantsRuntimeApproval = true;
    }]
  ];

  for (const [label, mutate] of mutations) {
    const mutated = clone(json);
    mutate(mutated);
    const result = classifyExternalReviewDispositionForReview(mutated);

    assert.equal(result.classification, "runtime_unavailable", label);
    assert.equal(result.valid, false, label);
    assert.equal(result.failClosed, true, label);
    assert.equal(result.runtimeAvailable, false, label);
  }

  const malformed = clone(json);
  malformed.reviewOnlyBoundary.externalReviewDispositionRecordOnly = false;
  assert.deepEqual(classifyExternalReviewDispositionForReview(malformed), {
    classification: "malformed",
    valid: false,
    failClosed: true
  });
});

test("Phase 4.1H docs cross-link disposition without implying runtime", async () => {
  const [dispositionDoc, ...docs] = await Promise.all([
    readFile(dispositionDocUrl, "utf8"),
    ...crossLinkDocUrls.map((url) => readFile(url, "utf8"))
  ]);
  const normalizedDoc = dispositionDoc.replace(/\s+/g, " ");

  for (const requiredPhrase of [
    "Phase 4.1H records the external-review disposition",
    "static review disposition record only",
    "not a fresh Devin re-review",
    "REQUEST targeted fixes before approval",
    "Stale Phase 4.1G currentMainSha metadata",
    correctedReviewedSha,
    fixCommitSha,
    "The stale SHA has no remaining Phase 4.1G packet or fixture matches",
    "runtime enabled",
    "No",
    "plan the first Rust-host stdio runtime test harness only",
    "Phase 4.1H may record that Devin's targeted blocker was fixed"
  ]) {
    assert.match(
      normalizedDoc,
      new RegExp(requiredPhrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i")
    );
  }

  for (const source of docs) {
    assert.match(source, /docs\/phase-4-1h-external-review-disposition\.md/);
  }

  for (const misleadingPhrase of [
    "fresh Devin approval",
    "runtime command implemented",
    "runtime unlocked",
    "runtime approval granted",
    "stdio-runtime implemented",
    "serve-runtime implemented",
    "packet grants runtime approval"
  ]) {
    assert.doesNotMatch(normalizedDoc, new RegExp(misleadingPhrase, "i"));
  }
});

test("Phase 4.1H status report inventories disposition without running checks", async () => {
  const report = await runReport();
  const inventory = report.phase41HExternalReviewDispositionInventory;

  assert.deepEqual(report.phase, {
    id: "5.32",
    name: "Review-only disposition aggregation checkpoint",
    executionPosture:
      "review-only-disposition-aggregation-checkpoint runtime-disabled no-reviewer-routing no-evaluator-execution no-evaluator-result no-runtime-execution no-approval-decision"
  });
  assert.equal(report.reportMode, "local-summary-only");
  assert.equal(report.reportRunsChecks, false);
  assert.equal(inventory.disposition.schema, "ardyn.external-review-disposition-record");
  assert.equal(inventory.disposition.artifactKind, "external-review-disposition-record");
  assert.equal(inventory.disposition.dispositionPhase, "phase-4.1h-external-review-disposition");
  assert.equal(inventory.disposition.reviewedPhase, "4.1H");
  assert.equal(inventory.disposition.currentMainSha, fixCommitSha);
  assert.equal(inventory.disposition.reviewMetadataOnly, true);
  assert.equal(inventory.disposition.notFreshDevinReReview, true);
  assert.equal(inventory.disposition.runtimeBehaviorIntroduced, false);
  assert.equal(inventory.disposition.liveRuntimeBehaviorIntroduced, false);
  assert.equal(inventory.disposition.grantsRuntimeApproval, false);
  assert.equal(inventory.sourceReview.priorDisposition, "request_targeted_fixes_before_approval");
  assert.equal(inventory.sourceReview.architectureRuntimeBlockerFound, false);
  assert.equal(inventory.targetedFix.blockerFixed, true);
  assert.equal(inventory.targetedFix.correctedReviewedSha, correctedReviewedSha);
  assert.equal(inventory.targetedFix.fixCommitSha, fixCommitSha);
  assert.deepEqual(inventory.targetedFix.filesChangedByFix, fixFiles);
  assert.deepEqual(inventory.blockedRuntimeSurfaceIds, blockedRuntimeSurfaceIds);
  assert.deepEqual(inventory.smokeProbeSummary.rejectionProbes, requiredRejectedProbes);
  assertAllFalse(inventory.runtimeEffect);
  assert.equal(inventory.reviewOnlyDisplayBehavior.dispositionCannotGrantRuntimeApproval, true);
  assert.equal(inventory.reviewOnlyDisplayBehavior.dispositionDoesNotEnableRuntime, true);
  assert.equal(inventory.reviewOnlyDisplayBehavior.notFreshDevinReReview, true);
  assert.equal(inventory.nextAllowedStep.planningOnly, true);
  assert.equal(inventory.nextAllowedStep.implementationAllowedInThisPhase, false);
  assert.equal(inventory.cliCommandSurface.commandAdded, false);
  assert.equal(inventory.cliCommandSurface.reviewDispositionCommandAdded, false);
  assert.equal(inventory.cliCommandSurface.serveRuntimeCommandAdded, false);
  assert.equal(inventory.cliCommandSurface.stdioRuntimeCommandAdded, false);
  assert.equal(inventory.apiSurface.typescriptCoreRuntimeApiAdded, false);
  assert.equal(inventory.apiSurface.rustRuntimeHelperAdded, false);
  assert.equal(inventory.apiSurface.approvalEvaluatorAdded, false);
  assert.equal(report.safetyPosture.externalReviewPacket, true);
  assert.equal(report.safetyPosture.externalReviewDisposition, true);
  assert.equal(report.safetyPosture.flags.phase41RuntimeImplemented, false);

  assert.deepEqual(inventory.fixtures, [
    {
      path: "tests/fixtures/host-policy/phase4-1h/external-review-disposition.json",
      status: "present"
    }
  ]);
  assert.deepEqual(
    inventory.docs.map(({ path, status }) => [path, status]),
    [
      ["docs/phase-4-1h-external-review-disposition.md", "present"],
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
      ["tests/phase4-1h-external-review-disposition.test.mjs", "present"],
      ["tests/phase4-1g-external-review-packet.test.mjs", "present"],
      ["tests/report-phase-status.test.mjs", "present"]
    ]
  );

  for (const probe of requiredRejectedProbes) {
    assert.ok(inventory.invariantProbes.includes(probe), probe);
  }

  assert.deepEqual(inventory.safetyPosture, {
    nonExecuting: true,
    externalReviewDispositionOnly: true,
    reviewOnly: true,
    noFreshDevinReReview: true,
    targetedBlockerFixed: true,
    noLiveRuntime: true,
    noRuntimeCommand: true,
    noReviewDispositionCommand: true,
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

test("Phase 4.1H runtime commands remain rejected with zero stdout", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase4-1h-probes-"));

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

test("Phase 4.1H source guard keeps disposition static and review-only", async () => {
  const [cliSource, reportSource] = await Promise.all([
    readFile(cliSourceUrl, "utf8"),
    readFile(reportScriptUrl, "utf8")
  ]);
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
  assert.match(reportSource, /phase41HExternalReviewDispositionInventory/);

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
    /process\.kill\s*\(/,
    /class\s+ApprovalEvaluator/,
    /function\s+ApprovalEvaluator/,
    /(?:export\s+)?function\s+grantRuntimeApproval/,
    /@ardyn\/adapters/,
    /@ardyn\/fabric/,
    /@ardyn\/mcp/
  ]) {
    assert.doesNotMatch(cliSource, forbiddenPattern);
  }
});
