import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { access, mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";

import {
  classifyFailureAuditRecordForReview,
  classifyTranscriptReplayCompatibilityForReview
} from "../packages/core/src/index.mjs";

const execFileAsync = promisify(execFile);
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase4-1f/runtime-readiness-checkpoint.json",
  import.meta.url
);
const checkpointDocUrl = new URL(
  "../docs/phase-4-1f-runtime-readiness-checkpoint.md",
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
  new URL("../docs/phase-4-1e-failure-audit-kill-semantics.md", import.meta.url)
];

const topLevelOrder = Object.freeze([
  "schema",
  "schemaVersion",
  "artifactKind",
  "checkpointPhase",
  "reviewedPhase",
  "metadataGeneratedAt",
  "reviewRange",
  "checkpointOnly",
  "reviewMetadataOnly",
  "checkpointVerdict",
  "readinessMatrix",
  "consolidatedInventoryKeys",
  "consolidatedArtifacts",
  "fixtureCounts",
  "requiredVerificationCommands",
  "approvalBoundary",
  "blockersBeforeRuntime",
  "runtimeEffect",
  "nonExecutionInvariantSummary",
  "audit"
]);

const readinessMatrixIds = Object.freeze([
  "runtime-proposal-boundary-readiness",
  "host-policy-approval-record-readiness",
  "transport-harness-contract-readiness",
  "framing-redaction-contract-readiness",
  "transcript-persistence-replay-contract-readiness",
  "failure-audit-kill-semantics-readiness",
  "runtime-effect-false-across-phase-4-1",
  "report-inventory-checkpoint-readiness",
  "runtime-command-negative-probe-readiness",
  "source-guard-no-runtime-surface-readiness",
  "devin-major-runtime-review-required",
  "separate-runtime-implementation-approval-required"
]);

const blockerIds = Object.freeze([
  "devin-major-runtime-readiness-review-not-recorded",
  "explicit-runtime-implementation-approval-not-recorded",
  "rust-host-live-stdio-runtime-not-implemented",
  "stdout-jsonl-live-writer-tests-missing",
  "stderr-redaction-live-enforcement-tests-missing",
  "transcript-persistence-replay-runtime-not-implemented",
  "failure-audit-cleanup-kill-runtime-not-implemented",
  "backpressure-partial-write-runtime-tests-missing",
  "line-integrity-runtime-tests-missing",
  "runtime-command-surface-not-approved",
  "approval-evaluator-host-policy-enforcement-not-implemented",
  "external-runtime-integrations-not-approved"
]);

const forbiddenRuntimeCommands = Object.freeze([
  "serve-runtime",
  "stdio-runtime",
  "approve-runtime",
  "grant-runtime",
  "enable-runtime",
  "runtime-readiness",
  "runtime-readiness-checkpoint",
  "readiness-checkpoint",
  "checkpoint-runtime",
  "runtime-checkpoint",
  "devin-runtime-review",
  "replay-session-transcript",
  "persist-session-transcript",
  "failure-audit",
  "emit-failure-audit",
  "cleanup-runtime",
  "kill-runtime",
  "approval-evaluator",
  "evaluate-approval",
  "runtime",
  "run",
  "execute",
  "live-runtime"
]);

async function readJsonUrl(url) {
  return JSON.parse(await readFile(url, "utf8"));
}

async function readCheckpointFixture() {
  const text = await readFile(fixtureUrl, "utf8");
  return { text, json: JSON.parse(text) };
}

async function readRepoJson(path) {
  return readJsonUrl(new URL(`../${path}`, import.meta.url));
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

function assertNoRuntimeEnablement(runtimeEffect) {
  const allowedReviewTrueFields = new Set([
    "approvalRecordNecessaryButNotSufficient",
    "operatorConsentNecessaryButNotSufficient",
    "requiresSeparateRuntimeImplementationApproval",
    "requiresDevinReviewBeforeEnablement"
  ]);

  for (const [field, value] of Object.entries(runtimeEffect)) {
    if (allowedReviewTrueFields.has(field)) {
      assert.equal(value, true, field);
    } else if (typeof value === "boolean") {
      assert.equal(value, false, field);
    }
  }
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function classifyCheckpointForReview(record) {
  if (
    record?.schema !== "ardyn.runtime-readiness-checkpoint" ||
    record?.checkpointPhase !== "phase-4.1f-runtime-readiness-checkpoint" ||
    record?.checkpointOnly !== true ||
    record?.reviewMetadataOnly !== true
  ) {
    return { classification: "malformed", valid: false, failClosed: true };
  }

  const runtimeEffectValues = Object.values(record.runtimeEffect ?? {});
  const matrixAttemptsRuntime = (record.readinessMatrix ?? []).some(
    (row) => row.grantsRuntimeApproval === true || row.runtimeBehaviorIntroduced === true
  );
  const blockerAttemptsRuntime = (record.blockersBeforeRuntime ?? []).some(
    (blocker) =>
      blocker.grantsRuntimeApproval === true || blocker.runtimeBehaviorIntroduced === true
  );

  if (
    runtimeEffectValues.some((value) => value === true) ||
    record.checkpointVerdict?.grantsRuntimeApproval === true ||
    record.checkpointVerdict?.runtimeImplementationApproved === true ||
    record.checkpointVerdict?.runtimeEnablementApproved === true ||
    record.checkpointVerdict?.runtimeBehaviorIntroduced === true ||
    record.checkpointVerdict?.liveRuntimeBehaviorIntroduced === true ||
    record.approvalBoundary?.grantsRuntimeApproval === true ||
    record.approvalBoundary?.runtimeBehaviorIntroduced === true ||
    matrixAttemptsRuntime ||
    blockerAttemptsRuntime
  ) {
    return {
      classification: "runtime_unavailable",
      valid: false,
      failClosed: true,
      runtimeAvailable: false
    };
  }

  return {
    classification: "runtime_readiness_checkpoint_only",
    valid: true,
    failClosed: false,
    runtimeAvailable: false
  };
}

async function assertRepoPathExists(path) {
  await access(new URL(`../${path}`, import.meta.url));
}

test("Phase 4.1F checkpoint fixture is deterministic LF-only metadata", async () => {
  const { text, json } = await readCheckpointFixture();

  assert.equal(text.endsWith("\n"), true);
  assert.equal(text.includes("\r"), false);
  assert.deepEqual(Object.keys(json), topLevelOrder);
  assert.equal(json.schema, "ardyn.runtime-readiness-checkpoint");
  assert.equal(json.schemaVersion, "0.1.0");
  assert.equal(json.artifactKind, "runtime-readiness-checkpoint");
  assert.equal(json.checkpointPhase, "phase-4.1f-runtime-readiness-checkpoint");
  assert.equal(json.reviewedPhase, "4.1F");
  assert.equal(json.metadataGeneratedAt, "1970-01-01T00:00:00.000Z");
  assert.equal(json.checkpointOnly, true);
  assert.equal(json.reviewMetadataOnly, true);
  assert.deepEqual(json.checkpointVerdict, {
    id: "phase-4.1f-runtime-readiness-checkpoint-verdict",
    verdict: "checkpoint-pass-runtime-still-blocked",
    codexValidationStatus: "pass",
    devinReviewStatus: "required-before-runtime-enable",
    runtimeImplementationApproved: false,
    runtimeEnablementApproved: false,
    grantsRuntimeApproval: false,
    runtimeBehaviorIntroduced: false,
    liveRuntimeBehaviorIntroduced: false,
    requiresSeparateRuntimeImplementationApproval: true,
    blockingReasonIds: []
  });
  assert.deepEqual(
    json.readinessMatrix.map(({ id }) => id),
    readinessMatrixIds
  );
  assert.deepEqual(
    json.blockersBeforeRuntime.map(({ id }) => id),
    blockerIds
  );
  assert.deepEqual(
    json.consolidatedArtifacts.map(({ phase }) => phase),
    ["4.1", "4.1A", "4.1B", "4.1C", "4.1D", "4.1E"]
  );
  assertAllFalse(json.runtimeEffect);
  assert.deepEqual(classifyCheckpointForReview(json), {
    classification: "runtime_readiness_checkpoint_only",
    valid: true,
    failClosed: false,
    runtimeAvailable: false
  });

  for (const row of json.readinessMatrix) {
    assert.equal(row.grantsRuntimeApproval, false, row.id);
    assert.equal(row.runtimeBehaviorIntroduced, false, row.id);
    assert.equal(row.checkpointRequiredBeforeRuntime, true, row.id);
  }
  assert.deepEqual(
    json.readinessMatrix.map(({ status }) => status),
    [
      "ready-for-checkpoint",
      "ready-for-checkpoint",
      "ready-for-checkpoint",
      "ready-for-checkpoint",
      "ready-for-checkpoint",
      "ready-for-checkpoint",
      "ready-for-checkpoint",
      "ready-for-checkpoint",
      "ready-for-checkpoint",
      "ready-for-checkpoint",
      "blocked-before-runtime",
      "blocked-before-runtime"
    ]
  );

  for (const blocker of json.blockersBeforeRuntime) {
    assert.equal(blocker.status, "blocking-live-runtime", blocker.id);
    assert.equal(blocker.severity, "blocker", blocker.id);
    assert.equal(blocker.runtimeUnblockRequiresSeparateApproval, true, blocker.id);
    assert.equal(blocker.grantsRuntimeApproval, false, blocker.id);
    assert.equal(blocker.runtimeBehaviorIntroduced, false, blocker.id);
  }
});

test("Phase 4.1F checkpoint references committed Phase 4.1 through 4.1E artifacts", async () => {
  const { json } = await readCheckpointFixture();

  for (const artifact of json.consolidatedArtifacts) {
    await assertRepoPathExists(artifact.document);
    await assertRepoPathExists(artifact.testPath);
    assert.equal(artifact.runtimeImplemented, false, artifact.phase);
    assert.equal(artifact.grantsRuntimeApproval, false, artifact.phase);

    for (const fixturePath of artifact.fixturePaths) {
      await assertRepoPathExists(fixturePath);
    }
  }

  for (const row of json.readinessMatrix) {
    for (const evidencePath of row.evidencePaths) {
      await assertRepoPathExists(evidencePath);
    }
  }

  for (const blocker of json.blockersBeforeRuntime) {
    for (const evidencePath of blocker.evidencePaths) {
      await assertRepoPathExists(evidencePath);
    }
  }
});

test("Phase 4.1F cannot bless prior static contracts into runtime", async () => {
  const approval = await readRepoJson(
    "tests/fixtures/host-policy/phase4-1a/valid-review-only-host-policy-approval-record.json"
  );
  const approvalRuntimeAttempt = await readRepoJson(
    "tests/fixtures/host-policy/phase4-1a/runtime-grant-attempt-host-policy-approval-record.json"
  );
  const harness = await readRepoJson(
    "tests/fixtures/host-policy/phase4-1b/valid-static-transport-harness-contract.json"
  );
  const harnessRuntimeAttempt = await readRepoJson(
    "tests/fixtures/host-policy/phase4-1b/runtime-available-attempt-transport-harness-contract.json"
  );
  const framing = await readRepoJson(
    "tests/fixtures/host-policy/phase4-1c/valid-static-framing-redaction-contract.json"
  );
  const replay = await readRepoJson(
    "tests/fixtures/host-policy/phase4-1d/valid-static-transcript-replay-contract.json"
  );
  const replayRuntimeAttempt = await readRepoJson(
    "tests/fixtures/host-policy/phase4-1d/runtime-available-attempt-transcript-replay-record.json"
  );
  const failureAudit = await readRepoJson(
    "tests/fixtures/host-policy/phase4-1e/valid-static-failure-audit-record.json"
  );
  const failureAuditRuntimeAttempt = await readRepoJson(
    "tests/fixtures/host-policy/phase4-1e/runtime-cleanup-kill-attempt-record.json"
  );

  assertNoRuntimeEnablement(approval.runtimeEffect);
  assertNoRuntimeEnablement(harness.runtimeEffect);
  assertAllFalse(framing.runtimeEffect);
  assertAllFalse(replay.runtimeEffect);
  assertAllFalse(failureAudit.runtimeEffect);
  assert.equal(approval.runtimeEffect.operatorConsentNecessaryButNotSufficient, true);
  assert.equal(harness.runtimeEffect.approvalRecordNecessaryButNotSufficient, true);

  assert.equal(approvalRuntimeAttempt.classification, "runtime_not_available");
  assert.equal(approvalRuntimeAttempt.runtimeEffect.currentRecordEnablesRuntime, true);
  assert.equal(harnessRuntimeAttempt.classification, "runtime_unavailable");
  assert.equal(harnessRuntimeAttempt.runtimeEffect.currentContractEnablesRuntime, true);

  const replayResult = classifyTranscriptReplayCompatibilityForReview(replayRuntimeAttempt);
  assert.equal(replayResult.classification, "replay_runtime_unavailable");
  assert.equal(replayResult.valid, false);
  assert.equal(replayResult.failClosed, true);
  assertAllFalse(replayResult.runtimeEffect);

  const failureAuditResult = classifyFailureAuditRecordForReview(failureAuditRuntimeAttempt);
  assert.equal(failureAuditResult.classification, "runtime_unavailable");
  assert.equal(failureAuditResult.valid, false);
  assert.equal(failureAuditResult.failClosed, true);
  assertAllFalse(failureAuditResult.runtimeEffect);
});

test("Phase 4.1F mutated checkpoint approval or runtime fields fail closed", async () => {
  const { json } = await readCheckpointFixture();
  const mutations = [
    ["checkpointVerdict.grantsRuntimeApproval", (record) => {
      record.checkpointVerdict.grantsRuntimeApproval = true;
    }],
    ["checkpointVerdict.runtimeImplementationApproved", (record) => {
      record.checkpointVerdict.runtimeImplementationApproved = true;
    }],
    ["approvalBoundary.grantsRuntimeApproval", (record) => {
      record.approvalBoundary.grantsRuntimeApproval = true;
    }],
    ["runtimeEffect.runtimeCommandAvailable", (record) => {
      record.runtimeEffect.runtimeCommandAvailable = true;
    }],
    ["runtimeEffect.cleanupRuntimeAvailable", (record) => {
      record.runtimeEffect.cleanupRuntimeAvailable = true;
    }],
    ["runtimeEffect.transcriptReplayRuntimeAvailable", (record) => {
      record.runtimeEffect.transcriptReplayRuntimeAvailable = true;
    }],
    ["runtimeEffect.approvalEvaluatorAvailable", (record) => {
      record.runtimeEffect.approvalEvaluatorAvailable = true;
    }],
    ["readinessMatrix grantsRuntimeApproval", (record) => {
      record.readinessMatrix[0].grantsRuntimeApproval = true;
    }],
    ["blockersBeforeRuntime runtimeBehaviorIntroduced", (record) => {
      record.blockersBeforeRuntime[0].runtimeBehaviorIntroduced = true;
    }]
  ];

  for (const [label, mutate] of mutations) {
    const mutated = clone(json);
    mutate(mutated);
    const result = classifyCheckpointForReview(mutated);

    assert.equal(result.classification, "runtime_unavailable", label);
    assert.equal(result.valid, false, label);
    assert.equal(result.failClosed, true, label);
    assert.equal(result.runtimeAvailable, false, label);
  }
});

test("Phase 4.1F docs cross-link checkpoint without implying runtime", async () => {
  const [checkpointDoc, ...docs] = await Promise.all([
    readFile(checkpointDocUrl, "utf8"),
    ...docUrls.map((url) => readFile(url, "utf8"))
  ]);
  const normalizedDoc = checkpointDoc.replace(/\s+/g, " ");

  for (const requiredPhrase of [
    "Phase 4.1F is a review checkpoint, not runtime",
    "No live runtime implementation is included",
    "checkpoint cannot grant runtime approval",
    "Future live runtime work must be a separate approved phase",
    "Devin review should happen after this if Josh wants an external runtime-readiness review",
    "runtime-proposal-boundary-readiness",
    "host-policy-approval-record-readiness",
    "transport-harness-contract-readiness",
    "framing-redaction-contract-readiness",
    "transcript-persistence-replay-contract-readiness",
    "failure-audit-kill-semantics-readiness",
    "devin-major-runtime-readiness-review-not-recorded",
    "explicit-runtime-implementation-approval-not-recorded",
    "Phase 4.1F adds no live stdin command loop",
    "runtime-readiness-checkpoint",
    "serve-runtime",
    "stdio-runtime",
    "replay-session-transcript"
  ]) {
    assert.match(
      normalizedDoc,
      new RegExp(requiredPhrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i")
    );
  }

  for (const source of docs) {
    assert.match(source, /docs\/phase-4-1f-runtime-readiness-checkpoint\.md/);
  }

  for (const misleadingPhrase of [
    "readyForRuntimeExecution",
    "goLive",
    "productionReady",
    "runtime unlocked",
    "runtime command implemented",
    "checkpoint grants runtime approval"
  ]) {
    assert.doesNotMatch(normalizedDoc, new RegExp(misleadingPhrase, "i"));
  }
});

test("Phase 4.1F status report inventories checkpoint without running checks", async () => {
  const report = await runReport();
  const inventory = report.phase41FRuntimeReadinessCheckpointInventory;

  assert.deepEqual(report.phase, {
    id: "5.9",
    name: "Approval evaluator/grant boundary",
    executionPosture:
      "approval-evaluator-grant-boundary-contract runtime-disabled no-runtime-execution"
  });
  assert.equal(report.reportMode, "local-summary-only");
  assert.equal(report.reportRunsChecks, false);
  assert.equal(inventory.checkpoint.schema, "ardyn.runtime-readiness-checkpoint");
  assert.equal(inventory.checkpoint.checkpointOnly, true);
  assert.equal(inventory.checkpoint.reviewMetadataOnly, true);
  assert.equal(inventory.checkpoint.grantsRuntimeApproval, false);
  assert.deepEqual(inventory.readinessMatrixIds, readinessMatrixIds);
  assert.deepEqual(inventory.blockerIds, blockerIds);
  assert.equal(inventory.reviewOnlyDisplayBehavior.checkpointCannotGrantRuntimeApproval, true);
  assert.equal(inventory.cliCommandSurface.commandAdded, false);
  assert.equal(inventory.cliCommandSurface.readinessCheckpointCommandAdded, false);
  assert.equal(inventory.cliCommandSurface.serveRuntimeCommandAdded, false);
  assert.equal(inventory.cliCommandSurface.stdioRuntimeCommandAdded, false);
  assert.equal(inventory.apiSurface.typescriptCoreRuntimeApiAdded, false);
  assert.equal(inventory.apiSurface.typescriptCoreCheckpointHelperAdded, false);
  assert.equal(inventory.apiSurface.rustRuntimeHelperAdded, false);
  assertAllFalse(inventory.runtimeEffect);
  assert.equal(report.safetyPosture.runtimeReadinessCheckpoint, true);
  assert.equal(report.safetyPosture.flags.phase41RuntimeImplemented, false);

  for (const check of [...report.configuredChecks, ...report.verificationCommands]) {
    assert.equal(check.ranByReport, false, check.command);
  }
});

test("Phase 4.1F source guards do not add runtime, checkpoint command, or dependency surfaces", async () => {
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
  assert.match(reportSource, /phase41FRuntimeReadinessCheckpointInventory/);

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

test("Phase 4.1F runtime and checkpoint CLI probes fail safely with zero stdout", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase4-1f-probes-"));

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
