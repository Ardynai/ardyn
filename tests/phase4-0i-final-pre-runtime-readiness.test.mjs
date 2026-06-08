import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { access, readFile, readdir, rm, mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";

const execFileAsync = promisify(execFile);
const readinessFixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase4-0i/final-pre-runtime-readiness.json",
  import.meta.url
);
const reviewerIndexFixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase4-0h/reviewer-handoff-index.json",
  import.meta.url
);
const readinessDocUrl = new URL(
  "../docs/phase-4-0i-final-pre-runtime-readiness.md",
  import.meta.url
);
const cliSourceUrl = new URL("../apps/cli/src/index.mjs", import.meta.url);
const coreSourceUrl = new URL("../packages/core/src/index.mjs", import.meta.url);
const reportScriptUrl = new URL("../scripts/report-phase-status.mjs", import.meta.url);
const repoRootUrl = new URL("../", import.meta.url);
const repoRoot = fileURLToPath(repoRootUrl);
const cliPath = fileURLToPath(cliSourceUrl);
const reportScriptPath = fileURLToPath(reportScriptUrl);

const docUrls = [
  new URL("../README.md", import.meta.url),
  new URL("../apps/cli/README.md", import.meta.url),
  new URL("../packages/core/README.md", import.meta.url),
  new URL("../docs/architecture.md", import.meta.url),
  new URL("../docs/host-policy-preconditions.md", import.meta.url),
  new URL("../docs/session-events-stdio-contract.md", import.meta.url),
  new URL("../docs/phase-4-stdio-dry-run-event-emission.md", import.meta.url),
  new URL("../docs/phase-4-0h-reviewer-handoff-index.md", import.meta.url)
];

const topLevelOrder = Object.freeze([
  "schema",
  "schemaVersion",
  "readinessPhase",
  "phaseIntroduced",
  "artifactKind",
  "metadataGeneratedAt",
  "reviewRange",
  "reviewedStartingSha",
  "reviewedMilestone",
  "runtimeStatus",
  "readinessStatus",
  "artifactCount",
  "checklistCount",
  "invariantCount",
  "grantsRuntimeApproval",
  "runtimeBehaviorIntroduced",
  "liveRuntimeBehaviorIntroduced",
  "phase41Implemented",
  "reviewMetadataOnly",
  "requiresSeparatePhase41Approval",
  "phase41BlockedUnlessSeparatelyApproved",
  "basedOnReviewerHandoffIndex",
  "phaseMilestones",
  "checklist",
  "nonExecutionInvariantMatrix",
  "representedArtifacts",
  "safety"
]);

const representedArtifactKeyOrder = Object.freeze([
  "path",
  "artifactKind",
  "phaseIntroduced",
  "reviewPurpose",
  "runtimeStatus",
  "evidenceRole",
  "grantsRuntimeApproval",
  "runtimeBehaviorIntroduced"
]);

const checklistIds = Object.freeze([
  "event-framing",
  "stdout-stderr-policy",
  "failure-behavior",
  "local-path-safety",
  "rust-host-policy-contract-readiness",
  "policy-metadata-fixture-readiness",
  "review-record-compatibility-readiness",
  "comparison-display-readiness",
  "reviewer-index-readiness",
  "remaining-blockers-before-runtime",
  "explicit-approval-boundary-before-phase-4-1"
]);

const invariantIds = Object.freeze([
  "no-live-runtime",
  "no-stdin-loop",
  "no-stdio-reader",
  "no-listener-server",
  "no-runtime-subprocess-spawning",
  "no-adapter-call",
  "no-locus-runtime-dependency",
  "no-mcp-openclaw-call",
  "no-plugin-execution",
  "no-content-fabric-download-install-enable",
  "no-autonomous-loop",
  "no-secret-handling",
  "no-production-signing-key-usage",
  "no-transcript-replay-runtime",
  "no-websocket-http-control-surface",
  "no-runtime-approval-grant",
  "no-phase-4-1-implementation"
]);

const forbiddenRuntimeCommands = Object.freeze([
  "replay-session-transcript",
  "policy-metadata",
  "host-policy-export",
  "serve-runtime",
  "stdio-runtime",
  "runtime",
  "run",
  "execute",
  "live-runtime",
  "runtime-proposal",
  "proposal-runtime",
  "phase-4.1-runtime",
  "host-policy-index",
  "policy-index",
  "review-index",
  "index-host-policy"
]);

async function readReadinessFixture() {
  const text = await readFile(readinessFixtureUrl, "utf8");
  return {
    text,
    json: JSON.parse(text)
  };
}

async function readReviewerIndexFixture() {
  return JSON.parse(await readFile(reviewerIndexFixtureUrl, "utf8"));
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

function artifactUrl(path) {
  return new URL(path, repoRootUrl);
}

function assertNoRuntimeApproval(value, label) {
  assert.equal(value.grantsRuntimeApproval, false, `${label} should not grant runtime approval`);
  assert.equal(
    value.runtimeBehaviorIntroduced,
    false,
    `${label} should not introduce runtime behavior`
  );
}

test("Phase 4.0I final pre-runtime readiness metadata is deterministic LF-only JSON", async () => {
  const { text, json } = await readReadinessFixture();

  assert.equal(text.endsWith("\n"), true);
  assert.equal(text.includes("\r"), false);
  assert.deepEqual(Object.keys(json), topLevelOrder);
  assert.equal(json.schema, "ardyn.phase-4-final-pre-runtime-readiness");
  assert.equal(json.schemaVersion, "0.1.0");
  assert.equal(json.readinessPhase, "phase-4.0i-final-pre-runtime-readiness");
  assert.equal(json.phaseIntroduced, "4.0I");
  assert.equal(json.artifactKind, "phase_4_final_pre_runtime_readiness_bundle");
  assert.equal(json.metadataGeneratedAt, "1970-01-01T00:00:00.000Z");
  assert.deepEqual(json.reviewRange, {
    fromPhase: "4.0A",
    throughPhase: "4.0I"
  });
  assert.equal(json.reviewedStartingSha, "d0a8530e4c43991e79fddabdc49212f2c1a6a5f6");
  assert.equal(json.runtimeStatus, "final-pre-runtime-readiness-only");
  assert.equal(json.readinessStatus, "pre-runtime-evidence-ready-for-separate-phase-4.1-review");
  assert.equal(json.artifactCount, json.representedArtifacts.length);
  assert.equal(json.checklistCount, json.checklist.length);
  assert.equal(json.invariantCount, json.nonExecutionInvariantMatrix.length);
});

test("Phase 4.0I records Devin milestone context without copying an audit or approving runtime", async () => {
  const { json } = await readReadinessFixture();

  assert.deepEqual(json.reviewedMilestone, {
    fromPhase: "4.0A",
    throughPhase: "4.0H",
    reviewer: "Devin",
    verdict: "PASS",
    reviewSummary:
      "Phase 4.0A through Phase 4.0H was reviewed as coherent, reviewable, and non-executing with no blockers before a separately approved Phase 4.1.",
    fullAuditCopied: false
  });
  assert.equal(json.reviewMetadataOnly, true);
  assert.equal(json.requiresSeparatePhase41Approval, true);
  assert.equal(json.phase41BlockedUnlessSeparatelyApproved, true);
  assert.equal(json.phase41Implemented, false);
  assertNoRuntimeApproval(json, "Phase 4.0I fixture");
  assert.equal(json.liveRuntimeBehaviorIntroduced, false);
});

test("Phase 4.0I represents every Phase 4.0A through 4.0H indexed artifact plus its own bundle", async () => {
  const { json } = await readReadinessFixture();
  const reviewerIndex = await readReviewerIndexFixture();
  const representedPaths = json.representedArtifacts.map((artifact) => artifact.path);
  const uniquePaths = new Set(representedPaths);

  assert.equal(json.artifactCount, 40);
  assert.equal(reviewerIndex.artifactCount, 37);
  assert.equal(uniquePaths.size, representedPaths.length);

  for (const artifact of reviewerIndex.artifacts) {
    assert.ok(uniquePaths.has(artifact.path), `${artifact.path} should be represented`);
  }

  for (const requiredPath of [
    "docs/phase-4-0i-final-pre-runtime-readiness.md",
    "tests/fixtures/host-policy/phase4-0i/final-pre-runtime-readiness.json",
    "tests/phase4-0i-final-pre-runtime-readiness.test.mjs"
  ]) {
    assert.ok(uniquePaths.has(requiredPath), `${requiredPath} should be represented`);
  }

  for (const artifact of json.representedArtifacts) {
    assert.deepEqual(Object.keys(artifact), representedArtifactKeyOrder, artifact.path);
    assert.match(artifact.phaseIntroduced, /^4\.0[A-I]$/);
    assertNoRuntimeApproval(artifact, artifact.path);
    await access(artifactUrl(artifact.path));
  }

  assert.deepEqual(
    [...new Set(json.phaseMilestones.map((milestone) => milestone.phase))],
    ["4.0A", "4.0B", "4.0C", "4.0D", "4.0E", "4.0F", "4.0G", "4.0H", "4.0I"]
  );
});

test("Phase 4.0I checklist cannot grant approval and keeps Phase 4.1 blocked", async () => {
  const { json } = await readReadinessFixture();

  assert.deepEqual(
    json.checklist.map((item) => item.id),
    checklistIds
  );

  for (const item of json.checklist) {
    assert.equal(item.phase41ApprovalRequired, true, item.id);
    assertNoRuntimeApproval(item, item.id);
    for (const evidencePath of item.evidencePaths) {
      await access(artifactUrl(evidencePath));
    }
  }

  assert.equal(
    json.checklist.find((item) => item.id === "remaining-blockers-before-runtime").status,
    "blocked-before-runtime"
  );
  assert.equal(
    json.checklist.find((item) => item.id === "explicit-approval-boundary-before-phase-4-1")
      .status,
    "blocked-before-runtime"
  );
});

test("Phase 4.0I invariant matrix pins the no-runtime boundary", async () => {
  const { json } = await readReadinessFixture();

  assert.deepEqual(
    json.nonExecutionInvariantMatrix.map((item) => item.id),
    invariantIds
  );

  for (const invariant of json.nonExecutionInvariantMatrix) {
    assert.equal(invariant.status, "confirmed", invariant.id);
    assertNoRuntimeApproval(invariant, invariant.id);
    for (const evidencePath of invariant.evidencePaths) {
      await access(artifactUrl(evidencePath));
    }
  }

  assert.deepEqual(json.safety, {
    nonExecuting: true,
    finalPreRuntimeReadinessOnly: true,
    reviewOnly: true,
    reviewMetadataOnly: true,
    cliCommandAdded: false,
    stdoutPrinterAdded: false,
    fileWriterAdded: false,
    runtimeBehaviorIntroduced: false,
    liveRuntimeBehaviorIntroduced: false,
    phase41Implemented: false,
    phase41RuntimeApprovalGranted: false,
    grantsRuntimeApproval: false,
    stdinCommandLoop: false,
    liveStdioReader: false,
    processStdioOwnership: false,
    listener: false,
    server: false,
    subprocessSpawning: false,
    adapterCalls: false,
    locusRuntimeDependency: false,
    mcpCalls: false,
    openClawCalls: false,
    pluginExecution: false,
    contentFabricRuntimeBehavior: false,
    contentFabricDownloadInstallEnable: false,
    autonomousLoop: false,
    secretHandling: false,
    productionSigningKeys: false,
    transcriptPersistenceReplayRuntime: false,
    webSocketHttpControlSurface: false,
    runtimeExecution: false
  });
});

test("Phase 4.0I docs cross-link the readiness bundle without implying execution approval", async () => {
  const [readinessDoc, ...docs] = await Promise.all([
    readFile(readinessDocUrl, "utf8"),
    ...docUrls.map((url) => readFile(url, "utf8"))
  ]);
  const normalizedDoc = readinessDoc.replace(/\s+/g, " ");

  for (const requiredPhrase of [
    "static final pre-runtime readiness bundle",
    "review evidence only",
    "not runtime configuration",
    "not an approval token",
    "not a Phase 4.1 implementation",
    "Devin reviewed Phase 4.0A through Phase 4.0H and gave PASS",
    "The checklist cannot grant approval",
    "Phase 4.0I does not certify execution"
  ]) {
    assert.match(
      normalizedDoc,
      new RegExp(requiredPhrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i")
    );
  }

  for (const source of docs) {
    assert.match(source, /docs\/phase-4-0i-final-pre-runtime-readiness\.md/);
  }

  for (const misleadingPhrase of [
    "readyForExecution",
    "readyForRuntimeExecution",
    "goLive",
    "productionReady",
    "release approved"
  ]) {
    assert.doesNotMatch(normalizedDoc, new RegExp(misleadingPhrase, "i"));
  }
});

test("Phase 4.1 status report still inventories Phase 4.0I readiness metadata without running checks", async () => {
  const report = await runReport();

  assert.deepEqual(report.phase, {
    id: "4.2D",
    name: "External review disposition and Phase 5 handoff",
    executionPosture: "external-review-disposition-phase5-handoff-only non-executing"
  });
  assert.equal(report.reportMode, "local-summary-only");
  assert.equal(report.reportRunsChecks, false);
  assert.equal(report.phase40IInventory.finalPreRuntimeReadiness.phase41Implemented, false);
  assert.equal(
    report.phase40IInventory.finalPreRuntimeReadiness.requiresSeparatePhase41Approval,
    true
  );
  assert.equal(report.phase40IInventory.finalPreRuntimeReadiness.grantsRuntimeApproval, false);
  assert.equal(report.phase40IInventory.finalPreRuntimeReadiness.runtimeBehaviorIntroduced, false);
  assert.equal(report.phase40IInventory.phaseCoverage.at(-1), "4.0I");
  assert.equal(report.phase40IInventory.representedArtifacts.length, 40);
  assert.deepEqual(report.phase40IInventory.readinessChecklist.map((item) => item.id), checklistIds);
  assert.deepEqual(
    report.phase40IInventory.nonExecutionInvariantMatrix.map((item) => item.id),
    invariantIds
  );
  assert.equal(report.safetyPosture.finalPreRuntimeReadiness, true);
  assert.equal(report.safetyPosture.runtimeProposal, true);
  assert.equal(report.safetyPosture.hostPolicyApprovalRecords, true);
  assert.equal(report.safetyPosture.transportHarnessContracts, true);
  assert.equal(report.safetyPosture.flags.phase41RuntimeImplemented, false);

  for (const check of [...report.configuredChecks, ...report.verificationCommands]) {
    assert.equal(check.ranByReport, false, check.command);
  }
});

test("Phase 4.0I source guards do not add runtime or proposal command surfaces", async () => {
  const [cliSource, coreSource, reportSource] = await Promise.all([
    readFile(cliSourceUrl, "utf8"),
    readFile(coreSourceUrl, "utf8"),
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

  for (const allowedToken of commandBranches) {
    assert.match(usage, new RegExp(allowedToken.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  for (const command of forbiddenRuntimeCommands) {
    const escapedCommand = command.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    assert.doesNotMatch(cliSource, new RegExp(`command === "${escapedCommand}"`));
    assert.doesNotMatch(usage, new RegExp(`(^|\\||<)${escapedCommand}(\\||>|\\s|$)`));
  }

  for (const [label, source] of [
    ["CLI", cliSource],
    ["core", coreSource]
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
      /\bWebSocket\b/,
      /\bspawn\s*\(/,
      /\bexecFile\s*\(/,
      /\bcreateServer\s*\(/,
      /\blisten\s*\(/,
      /@ardyn\/adapters/,
      /@ardyn\/fabric/,
      /@ardyn\/mcp/,
      /runtime-approval/i,
      /phase-4-1/i,
      /phase4-1/i,
      /phase-41/i
    ]) {
      assert.doesNotMatch(source, forbiddenPattern, `${label} source should avoid ${forbiddenPattern}`);
    }
  }

  for (const forbiddenReportPattern of [
    /node:child_process/,
    /from\s+["']child_process["']/,
    /node:http/,
    /node:https/,
    /node:net/,
    /node:dgram/,
    /\bfetch\s*\(/,
    /\bWebSocket\b/,
    /\bspawn\s*\(/,
    /\bexecFile\s*\(/,
    /\bcreateServer\s*\(/,
    /\blisten\s*\(/,
    /\bwriteFile\s*\(/,
    /\bappendFile\s*\(/,
    /\bmkdir\s*\(/,
    /\brm\s*\(/,
    /\bunlink\s*\(/,
    /process\.env/
  ]) {
    assert.doesNotMatch(reportSource, forbiddenReportPattern);
  }

  assert.match(reportSource, /phase41Implemented/);
  assert.match(reportSource, /requiresSeparatePhase41Approval/);
});

test("Phase 4.0I runtime and proposal CLI probes fail safely with zero stdout", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase4-0i-probes-"));

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
