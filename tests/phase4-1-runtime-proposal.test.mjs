import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { access, readFile, readdir, rm, mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";

const execFileAsync = promisify(execFile);
const proposalFixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase4-1/runtime-proposal.json",
  import.meta.url
);
const finalReadinessFixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase4-0i/final-pre-runtime-readiness.json",
  import.meta.url
);
const proposalDocUrl = new URL("../docs/phase-4-1-runtime-proposal.md", import.meta.url);
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
  new URL("../docs/phase-4-0i-final-pre-runtime-readiness.md", import.meta.url)
];

const topLevelOrder = Object.freeze([
  "schema",
  "schemaVersion",
  "proposalPhase",
  "phaseIntroduced",
  "artifactKind",
  "metadataGeneratedAt",
  "reviewRange",
  "basedOnFinalReadiness",
  "devinReviewPolicy",
  "proposalStatus",
  "runtimeStatus",
  "implementationStatus",
  "approvalStatus",
  "roadmapStatus",
  "grantsRuntimeApproval",
  "runtimeApprovalGranted",
  "runtimeBehaviorIntroduced",
  "liveRuntimeBehaviorIntroduced",
  "phase41RuntimeImplemented",
  "consumedByLiveHostLoop",
  "reviewMetadataOnly",
  "proposalOnly",
  "requiresSeparateImplementationApproval",
  "requiresSeparateRuntimeImplementationApproval",
  "approvalBoundary",
  "proposalSections",
  "requiredTestsBeforeRuntime",
  "implementationRoadmap",
  "representedArtifactCounts",
  "proposalArtifacts",
  "safety"
]);

const proposalSectionIds = Object.freeze([
  "approval-boundary",
  "rust-host-stdio-ownership",
  "stdout-jsonl-emission",
  "stderr-diagnostics-redaction",
  "transcript-persistence-replay",
  "failure-audit-records",
  "kill-exit-fail-closed",
  "backpressure-partial-write",
  "line-integrity-failures",
  "required-tests-before-runtime",
  "phased-runtime-roadmap"
]);

const requiredTestIds = Object.freeze([
  "approval-boundary-tests",
  "rust-host-stdio-ownership-tests",
  "stdout-jsonl-framing-tests",
  "stderr-redaction-tests",
  "transcript-persistence-replay-tests",
  "failure-audit-record-tests",
  "kill-exit-fail-closed-tests",
  "backpressure-partial-write-tests",
  "line-integrity-failure-tests",
  "runtime-command-negative-tests"
]);

const roadmapIds = Object.freeze([
  "phase-4.1a-host-policy-approval-records",
  "phase-4.1b-rust-host-transport-harness",
  "phase-4.1c-stdout-stderr-enforcement",
  "phase-4.1d-transcript-persistence-replay",
  "phase-4.1e-failure-audit-and-kill-semantics",
  "phase-4.1f-major-runtime-readiness-checkpoint"
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
  "phase-4-1-runtime-proposal",
  "phase-4.1-proposal",
  "persist-session-transcript",
  "transcript-replay",
  "start-runtime",
  "run-runtime",
  "approve-runtime",
  "host-policy-index",
  "policy-index",
  "review-index",
  "index-host-policy"
]);

async function readProposalFixture() {
  const text = await readFile(proposalFixtureUrl, "utf8");
  return {
    text,
    json: JSON.parse(text)
  };
}

async function readFinalReadinessFixture() {
  return JSON.parse(await readFile(finalReadinessFixtureUrl, "utf8"));
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

function assertProposalOnly(value, label) {
  assert.equal(value.grantsRuntimeApproval, false, `${label} grantsRuntimeApproval`);
  assert.equal(value.runtimeBehaviorIntroduced, false, `${label} runtimeBehaviorIntroduced`);
  if ("proposalOnly" in value) {
    assert.equal(value.proposalOnly, true, `${label} proposalOnly`);
  }
}

test("Phase 4.1 runtime proposal metadata is deterministic LF-only JSON", async () => {
  const { text, json } = await readProposalFixture();

  assert.equal(text.endsWith("\n"), true);
  assert.equal(text.includes("\r"), false);
  assert.deepEqual(Object.keys(json), topLevelOrder);
  assert.equal(json.schema, "ardyn.phase-4-runtime-proposal");
  assert.equal(json.schemaVersion, "0.1.0");
  assert.equal(json.proposalPhase, "phase-4.1-runtime-proposal-only");
  assert.equal(json.phaseIntroduced, "4.1");
  assert.equal(json.artifactKind, "phase_4_runtime_proposal_only_bundle");
  assert.equal(json.metadataGeneratedAt, "1970-01-01T00:00:00.000Z");
  assert.deepEqual(json.reviewRange, {
    fromPhase: "4.0A",
    throughPhase: "4.1"
  });
  assert.equal(json.proposalStatus, "proposal-only-review-draft");
  assert.equal(json.runtimeStatus, "runtime-proposal-only");
  assert.equal(json.implementationStatus, "not-implemented");
  assert.equal(json.approvalStatus, "not-granted");
});

test("Phase 4.1 proposal cannot approve or implement runtime behavior", async () => {
  const { json } = await readProposalFixture();

  assert.equal(json.grantsRuntimeApproval, false);
  assert.equal(json.runtimeApprovalGranted, false);
  assert.equal(json.runtimeBehaviorIntroduced, false);
  assert.equal(json.liveRuntimeBehaviorIntroduced, false);
  assert.equal(json.phase41RuntimeImplemented, false);
  assert.equal(json.consumedByLiveHostLoop, false);
  assert.equal(json.reviewMetadataOnly, true);
  assert.equal(json.proposalOnly, true);
  assert.equal(json.requiresSeparateImplementationApproval, true);
  assert.equal(json.requiresSeparateRuntimeImplementationApproval, true);
  assertProposalOnly(json.approvalBoundary, "approval boundary");

  for (const [key, value] of Object.entries(json.safety)) {
    if (key === "nonExecuting" || key === "proposalOnly" || key === "reviewOnly" || key === "reviewMetadataOnly") {
      assert.equal(value, true, `${key} should remain true`);
    } else {
      assert.equal(value, false, `${key} should remain false`);
    }
  }
});

test("Phase 4.1 proposal is based on Phase 4.0I readiness without requiring Devin now", async () => {
  const { json } = await readProposalFixture();
  const finalReadiness = await readFinalReadinessFixture();

  assert.deepEqual(json.basedOnFinalReadiness, {
    document: "docs/phase-4-0i-final-pre-runtime-readiness.md",
    metadataFixture: "tests/fixtures/host-policy/phase4-0i/final-pre-runtime-readiness.json",
    finalReadinessCommit: "34ac1c3df105074bd5c2b1f04062e8d3da59204a"
  });
  assert.equal(finalReadiness.phase41Implemented, false);
  assert.deepEqual(json.devinReviewPolicy, {
    priorReviewedRange: {
      fromPhase: "4.0A",
      throughPhase: "4.0H"
    },
    priorReviewer: "Devin",
    priorVerdict: "PASS",
    codexValidationForThisPhase: true,
    requiresDevinReviewNow: false,
    preserveDevinReviewFor: "major-runtime-readiness-checkpoint"
  });
});

test("Phase 4.1 proposal covers exact design sections, required tests, and roadmap items", async () => {
  const { json } = await readProposalFixture();

  assert.deepEqual(
    json.proposalSections.map((section) => section.id),
    proposalSectionIds
  );
  for (const section of json.proposalSections) {
    assert.equal(section.requiredOutcomeBeforeRuntime.length > 0, true, section.id);
    assertProposalOnly(section, section.id);
  }

  assert.deepEqual(
    json.requiredTestsBeforeRuntime.map((item) => item.id),
    requiredTestIds
  );
  for (const item of json.requiredTestsBeforeRuntime) {
    assert.equal(item.blocksRuntimeUntilPresent, true, item.id);
    assertProposalOnly(item, item.id);
  }

  assert.deepEqual(
    json.implementationRoadmap.map((item) => item.id),
    roadmapIds
  );
  for (const item of json.implementationRoadmap) {
    assert.equal(item.implementationInThisPhase, false, item.id);
    assert.equal(item.requiresSeparateApproval, true, item.id);
    assertProposalOnly(item, item.id);
  }
  assert.equal(json.implementationRoadmap.at(-1).requiresDevinReview, true);
});

test("Phase 4.1 proposal artifacts exist and represent only the proposal layer", async () => {
  const { json } = await readProposalFixture();

  assert.deepEqual(json.representedArtifactCounts, {
    total: 43,
    upstreamFinalReadinessArtifacts: 40,
    phase41ProposalArtifacts: 3
  });
  assert.deepEqual(
    json.proposalArtifacts.map((artifact) => artifact.path),
    [
      "docs/phase-4-1-runtime-proposal.md",
      "tests/fixtures/host-policy/phase4-1/runtime-proposal.json",
      "tests/phase4-1-runtime-proposal.test.mjs"
    ]
  );

  for (const artifact of json.proposalArtifacts) {
    assert.equal(artifact.phaseIntroduced, "4.1", artifact.path);
    assert.equal(artifact.runtimeStatus, "runtime-proposal-only", artifact.path);
    assertProposalOnly(artifact, artifact.path);
    await access(artifactUrl(artifact.path));
  }
});

test("Phase 4.1 docs cross-link proposal-only status without implying execution", async () => {
  const [proposalDoc, ...docs] = await Promise.all([
    readFile(proposalDocUrl, "utf8"),
    ...docUrls.map((url) => readFile(url, "utf8"))
  ]);
  const normalizedDoc = proposalDoc.replace(/\s+/g, " ");

  for (const requiredPhrase of [
    "proposal and implementation-plan phase only",
    "does not implement a live runtime",
    "not runtime configuration",
    "not an approval token",
    "The Phase 4.1 proposal cannot grant runtime approval",
    "Future Rust-host responsibilities",
    "Future live stdout is reserved for session-event JSONL only",
    "Future live stderr is reserved for diagnostics",
    "The existing `replay-session-transcript` name remains proposal-only",
    "Runtime and proposal command names remain rejected"
  ]) {
    assert.match(
      normalizedDoc,
      new RegExp(requiredPhrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i")
    );
  }

  for (const source of docs) {
    assert.match(source, /docs\/phase-4-1-runtime-proposal\.md/);
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

test("Phase 4.1 status report inventories proposal metadata without running checks", async () => {
  const report = await runReport();

  assert.deepEqual(report.phase, {
    id: "4.1",
    name: "Runtime proposal",
    executionPosture: "proposal-only non-executing"
  });
  assert.equal(report.reportMode, "local-summary-only");
  assert.equal(report.reportRunsChecks, false);
  assert.equal(report.phase41ProposalInventory.runtimeProposal.phase41RuntimeImplemented, false);
  assert.equal(report.phase41ProposalInventory.runtimeProposal.grantsRuntimeApproval, false);
  assert.equal(report.phase41ProposalInventory.runtimeProposal.runtimeBehaviorIntroduced, false);
  assert.equal(report.phase41ProposalInventory.phaseCoverage.at(-1), "4.1");
  assert.deepEqual(
    report.phase41ProposalInventory.proposalSections.map((section) => section.id),
    proposalSectionIds
  );
  assert.deepEqual(
    report.phase41ProposalInventory.requiredTestsBeforeRuntime.map((item) => item.id),
    requiredTestIds
  );
  assert.deepEqual(
    report.phase41ProposalInventory.implementationRoadmap.map((item) => item.id),
    roadmapIds
  );
  assert.equal(report.safetyPosture.runtimeProposal, true);
  assert.equal(report.safetyPosture.flags.phase41RuntimeImplemented, false);

  for (const check of [...report.configuredChecks, ...report.verificationCommands]) {
    assert.equal(check.ranByReport, false, check.command);
  }
});

test("Phase 4.1 source guards do not add runtime or proposal command surfaces", async () => {
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
});

test("Phase 4.1 runtime and proposal CLI probes fail safely with zero stdout", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase4-1-probes-"));

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
