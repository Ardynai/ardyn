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
  createFailureAuditRecordForReview,
  formatFailureAuditRecordJsonForReview
} from "../packages/core/src/index.mjs";

const execFileAsync = promisify(execFile);
const fixtureRootUrl = new URL("../tests/fixtures/host-policy/phase4-1e/", import.meta.url);
const failureAuditDocUrl = new URL(
  "../docs/phase-4-1e-failure-audit-kill-semantics.md",
  import.meta.url
);
const cliSourceUrl = new URL("../apps/cli/src/index.mjs", import.meta.url);
const coreSourceUrl = new URL("../packages/core/src/index.mjs", import.meta.url);
const coreTypesUrl = new URL("../packages/core/src/index.d.ts", import.meta.url);
const reportScriptUrl = new URL("../scripts/report-phase-status.mjs", import.meta.url);
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
  new URL("../docs/phase-4-1d-transcript-replay-contracts.md", import.meta.url)
];

const fixtureClassifications = Object.freeze({
  "valid-static-failure-audit-record.json": "static_contract_only",
  "redacted-failure-diagnostic-record.json": "redacted_failure",
  "unredactable-failure-diagnostic-fail-closed-record.json": "unredactable_failure",
  "expected-nonzero-exit-mapping-record.json": "nonzero_exit_expected",
  "unexpected-nonzero-exit-mapping-record.json": "nonzero_exit_unexpected",
  "terminal-completed-record.json": "terminal_completed",
  "terminal-failed-record.json": "terminal_failed",
  "terminal-aborted-record.json": "terminal_aborted",
  "terminal-rejected-record.json": "terminal_rejected",
  "cleanup-required-policy-only-record.json": "cleanup_required",
  "cleanup-not-available-record.json": "cleanup_not_available",
  "runtime-cleanup-kill-attempt-record.json": "runtime_unavailable",
  "malformed-failure-audit-record.json": "malformed",
  "unsupported-major-failure-audit-record.json": "unsupported_major"
});

const fixtureFiles = Object.freeze([
  "valid-static-failure-audit-record.json",
  "redacted-failure-diagnostic-record.json",
  "unredactable-failure-diagnostic-fail-closed-record.json",
  "expected-nonzero-exit-mapping-record.json",
  "unexpected-nonzero-exit-mapping-record.json",
  "terminal-completed-record.json",
  "terminal-failed-record.json",
  "terminal-aborted-record.json",
  "terminal-rejected-record.json",
  "cleanup-required-policy-only-record.json",
  "cleanup-not-available-record.json",
  "runtime-cleanup-kill-attempt-record.json",
  "malformed-failure-audit-record.json",
  "unsupported-major-failure-audit-record.json"
]);
const failClosedClassifications = new Set([
  "unredactable_failure",
  "nonzero_exit_unexpected",
  "cleanup_not_available",
  "runtime_unavailable",
  "malformed",
  "unsupported_major"
]);

const forbiddenRuntimeCommands = Object.freeze([
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
  "approval-evaluator",
  "evaluate-approval",
  "serve-runtime",
  "stdio-runtime",
  "replay-session-transcript",
  "policy-metadata",
  "host-policy-export",
  "runtime",
  "run",
  "execute",
  "live-runtime"
]);
const reportInvariantProbes = Object.freeze([
  "missing --dry-run",
  "unknown emit-session-events arg",
  "unsafe manifest URL",
  "invalid JSON manifest",
  "invalid JSON task",
  "replay-session-transcript",
  "policy-metadata",
  "host-policy-export",
  "serve-runtime",
  "stdio-runtime",
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
  "approval-evaluator",
  "evaluate-approval"
]);

async function readFixture(file) {
  const text = await readFile(new URL(file, fixtureRootUrl), "utf8");
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

function assertAllRuntimeEffectFalse(runtimeEffect) {
  for (const [field, value] of Object.entries(runtimeEffect)) {
    assert.equal(value, false, field);
  }
}

test("Phase 4.1E failure-audit fixtures are deterministic LF-only JSON", async () => {
  const staticFixture = await readFixture("valid-static-failure-audit-record.json");
  const redactedFixture = await readFixture("redacted-failure-diagnostic-record.json");
  const terminalCompletedFixture = await readFixture("terminal-completed-record.json");

  assert.equal(staticFixture.text, formatFailureAuditRecordJsonForReview());
  assert.equal(
    redactedFixture.text,
    formatFailureAuditRecordJsonForReview({ classification: "redacted_failure" })
  );
  assert.equal(
    terminalCompletedFixture.text,
    formatFailureAuditRecordJsonForReview({
      classification: "terminal_completed",
      stdoutCommitBoundary: {
        committedEventCount: 6,
        committedSequenceRange: { first: 1, last: 6 }
      }
    })
  );

  for (const file of fixtureFiles) {
    const { text, json } = await readFixture(file);
    assert.equal(text.endsWith("\n"), true, file);
    assert.equal(text.includes("\r"), false, file);
    assert.equal(json.schema, "ardyn.failure-audit-record", file);
    assert.equal(json.recordPhase, "phase-4.1e-failure-audit-kill-semantics", file);
    assert.equal(json.reviewedPhase, "4.1E", file);
    assert.equal(json.runtimeAvailabilityStatus, "runtime_unavailable", file);
  }

  assert.equal(staticFixture.json.classification, "static_contract_only");
  assert.equal(staticFixture.json.failureCategory, "contract-definition");
  assert.equal(staticFixture.json.terminalState, "not-run");
  assert.equal(staticFixture.json.exitCodeClassification, "not-applicable");
  assert.equal(staticFixture.json.audit.createdAt, "1970-01-01T00:00:00.000Z");
  assert.equal(staticFixture.json.audit.devinReviewRequiredNow, false);
  assert.equal(
    staticFixture.json.audit.preserveDevinReviewFor,
    "major-runtime-readiness-checkpoint"
  );
  assertAllRuntimeEffectFalse(staticFixture.json.runtimeEffect);
});

test("Phase 4.1E failure-audit fixtures classify deterministic fail-closed cases", async () => {
  for (const [file, expectedClassification] of Object.entries(fixtureClassifications)) {
    const { json } = await readFixture(file);
    const result = classifyFailureAuditRecordForReview(json);

    assert.equal(result.classification, expectedClassification, file);
    assert.equal(result.failureAuditRuntimeAvailable, false, file);
    assert.equal(result.cleanupRuntimeAvailable, false, file);
    assert.equal(result.processKillAvailable, false, file);
    assert.equal(result.processControlAvailable, false, file);
    assert.equal(result.runtimeCommandAvailable, false, file);
    assert.equal(result.reviewOnly, true, file);
    assertAllRuntimeEffectFalse(result.runtimeEffect);

    if (failClosedClassifications.has(expectedClassification)) {
      assert.equal(result.failClosed, true, file);
      assert.equal(result.valid, false, file);
      assert.notEqual(result.failureReasons.length, 0, file);
    } else {
      assert.equal(result.failClosed, false, file);
      assert.equal(result.valid, true, file);
    }
  }
});

test("Phase 4.1E terminal-state and nonzero-exit mappings are static and deterministic", async () => {
  const terminalCompleted = createFailureAuditRecordForReview({
    classification: "terminal_completed",
    stdoutCommitBoundary: {
      committedEventCount: 6,
      committedSequenceRange: { first: 1, last: 6 }
    }
  });
  const terminalFailed = createFailureAuditRecordForReview({ classification: "terminal_failed" });
  const terminalAborted = createFailureAuditRecordForReview({ classification: "terminal_aborted" });
  const terminalRejected = createFailureAuditRecordForReview({ classification: "terminal_rejected" });
  const unexpectedNonzero = createFailureAuditRecordForReview({
    classification: "nonzero_exit_unexpected"
  });

  assert.equal(terminalCompleted.terminalState, "completed");
  assert.equal(terminalCompleted.exitCodeMapping.code, 0);
  assert.equal(terminalCompleted.exitCodeClassification, "zero_exit");
  assert.equal(terminalCompleted.stdoutCommitBoundary.stdoutEndedWithFinalLf, true);
  assert.deepEqual(terminalCompleted.stdoutCommitBoundary.committedSequenceRange, {
    first: 1,
    last: 6
  });

  assert.equal(terminalFailed.terminalState, "failed");
  assert.equal(terminalFailed.exitCodeClassification, "nonzero_exit_expected");
  assert.equal(terminalAborted.terminalState, "aborted");
  assert.equal(terminalAborted.exitCodeClassification, "nonzero_exit_expected");
  assert.equal(terminalRejected.terminalState, "rejected");
  assert.equal(terminalRejected.exitCodeClassification, "nonzero_exit_expected");

  assert.equal(unexpectedNonzero.exitCodeClassification, "nonzero_exit_unexpected");
  assert.equal(classifyFailureAuditRecordForReview(unexpectedNonzero).failClosed, true);

  for (const record of [
    terminalCompleted,
    terminalFailed,
    terminalAborted,
    terminalRejected,
    unexpectedNonzero
  ]) {
    assert.equal(record.terminalStateRules.deterministic, true);
    assert.equal(record.terminalStateRules.synthesizedTerminalEventsAllowed, false);
    assert.equal(record.terminalStateRules.partialOutputMayBecomeTranscriptEvidence, false);
    assert.equal(record.stdoutCommitBoundary.policyOnly, true);
    assert.equal(record.stdoutCommitBoundary.partialOutputMayBecomeTranscriptEvidence, false);
    assert.equal(record.stdoutCommitBoundary.synthesizedTerminalEventAllowed, false);
    assert.equal(record.nonzeroExitMappingRules.deterministic, true);
    assert.equal(record.nonzeroExitMappingRules.unexpectedNonzeroFailsClosed, true);
    assertAllRuntimeEffectFalse(record.runtimeEffect);
  }
});

test("Phase 4.1E runtime cleanup and kill attempts fail closed", async () => {
  const { json } = await readFixture("runtime-cleanup-kill-attempt-record.json");
  const result = classifyFailureAuditRecordForReview(json);

  assert.equal(json.runtimeEffect.cleanupRuntimeAvailable, true);
  assert.equal(json.runtimeEffect.processKillAvailable, true);
  assert.equal(json.runtimeEffect.processControlAvailable, true);
  assert.equal(json.runtimeEffect.signalHandlerAvailable, true);
  assert.equal(json.cleanupRequirement.cleanupRuntimeAvailable, true);
  assert.equal(json.cleanupRequirement.processKillAvailable, true);
  assert.equal(json.killInterruptTimeoutSemantics.killRuntimeAvailable, true);
  assert.equal(json.killInterruptTimeoutSemantics.interruptRuntimeAvailable, true);
  assert.equal(json.killInterruptTimeoutSemantics.timeoutRuntimeAvailable, true);

  assert.equal(result.classification, "runtime_unavailable");
  assert.equal(result.valid, false);
  assert.equal(result.failClosed, true);
  assert.equal(result.failureAuditRuntimeAvailable, false);
  assert.equal(result.cleanupRuntimeAvailable, false);
  assert.equal(result.processKillAvailable, false);
  assert.equal(result.processControlAvailable, false);
  assertAllRuntimeEffectFalse(result.runtimeEffect);
});

test("Phase 4.1E docs cross-link failure-audit contracts without implying runtime", async () => {
  const [failureAuditDoc, ...docs] = await Promise.all([
    readFile(failureAuditDocUrl, "utf8"),
    ...docUrls.map((url) => readFile(url, "utf8"))
  ]);
  const normalizedDoc = failureAuditDoc.replace(/\s+/g, " ");

  for (const requiredPhrase of [
    "static contract/fixture work only",
    "no process killing or cleanup runtime exists",
    "no failure-audit runtime exists",
    "no live runtime exists",
    "future runtime must satisfy these contracts before implementation",
    "Devin review remains reserved for the major runtime-readiness checkpoint",
    "static_contract_only",
    "clean_failure",
    "redacted_failure",
    "unredactable_failure",
    "terminal_completed",
    "terminal_failed",
    "terminal_aborted",
    "terminal_rejected",
    "nonzero_exit_expected",
    "nonzero_exit_unexpected",
    "cleanup_required",
    "cleanup_not_available",
    "runtime_unavailable",
    "malformed",
    "unsupported_major",
    "Phase 4.1E adds no live stdin command loop"
  ]) {
    assert.match(
      normalizedDoc,
      new RegExp(requiredPhrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i")
    );
  }

  for (const source of docs) {
    assert.match(source, /docs\/phase-4-1e-failure-audit-kill-semantics\.md/);
  }

  for (const misleadingPhrase of [
    "readyForRuntimeExecution",
    "goLive",
    "productionReady",
    "runtime unlocked",
    "failure audit command implemented",
    "process killing implemented"
  ]) {
    assert.doesNotMatch(normalizedDoc, new RegExp(misleadingPhrase, "i"));
  }
});

test("Phase 4.1E status report inventories failure-audit contracts without running checks", async () => {
  const report = await runReport();
  const inventory = report.phase41EFailureAuditInventory;

  assert.deepEqual(report.phase, {
    id: "5.38",
    name: "Review-only inspection handoff metadata boundary",
    executionPosture:
      "review-only-inspection-handoff-metadata-boundary runtime-disabled no-reviewer-routing no-reviewer-assignment no-evaluator-execution no-evaluator-result no-runtime-execution no-approval-decision"
  });
  assert.equal(report.reportMode, "local-summary-only");
  assert.equal(report.reportRunsChecks, false);
  assert.equal(inventory.failureAuditRecord.schema, "ardyn.failure-audit-record");
  assert.equal(inventory.failureAuditRecord.recordKind, "failure-audit-record");
  assert.equal(inventory.failureAuditRecord.recordPhase, "phase-4.1e-failure-audit-kill-semantics");
  assert.equal(inventory.failureAuditRecord.reviewedPhase, "4.1E");
  assert.equal(inventory.failureAuditRecord.classification, "static_contract_only");
  assert.equal(inventory.failureAuditRecord.runtimeAvailabilityStatus, "runtime_unavailable");
  assert.equal(inventory.failureAuditRecord.failureAuditRuntimeAvailable, false);
  assert.equal(inventory.failureAuditRecord.cleanupRuntimeAvailable, false);
  assert.equal(inventory.failureAuditRecord.processKillAvailable, false);
  assert.equal(inventory.failureAuditRecord.processControlAvailable, false);
  assert.equal(inventory.redactedFailureDiagnostic.classification, "redacted_failure");
  assert.equal(inventory.redactedFailureDiagnostic.stderrDiagnosticClassification, "redacted_failure");
  assert.equal(inventory.redactedFailureDiagnostic.redactionStatus, "redacted_safe");
  assert.equal(inventory.redactedFailureDiagnostic.redactionCount, 1);
  assert.equal(inventory.runtimeAttempt.classification, "runtime_unavailable");
  assert.equal(inventory.runtimeAttempt.failClosedExpected, true);
  assert.equal(inventory.terminalStateRules.deterministic, true);
  assert.equal(inventory.terminalStateRules.synthesizedTerminalEventsAllowed, false);
  assert.equal(inventory.stdoutCommitBoundary.policyOnly, true);
  assert.equal(inventory.stdoutCommitBoundary.partialOutputMayBecomeTranscriptEvidence, false);
  assert.equal(inventory.nonzeroExitMappingRules.deterministic, true);
  assert.equal(inventory.nonzeroExitMappingRules.unexpectedNonzeroFailsClosed, true);
  assert.equal(inventory.cleanupKillSemantics.cleanupRuntimeAvailable, false);
  assert.equal(inventory.cleanupKillSemantics.processKillAvailable, false);
  assert.equal(inventory.cleanupKillSemantics.killRuntimeAvailable, false);
  assert.equal(inventory.cleanupKillSemantics.interruptRuntimeAvailable, false);
  assert.equal(inventory.cleanupKillSemantics.timeoutRuntimeAvailable, false);
  assert.equal(inventory.transcriptPersistenceReplayImpact.policyOnly, true);
  assert.equal(inventory.transcriptPersistenceReplayImpact.replayPermitted, false);
  assertAllRuntimeEffectFalse(inventory.runtimeEffect);
  assert.deepEqual(inventory.classifications, [
    "static_contract_only",
    "clean_failure",
    "redacted_failure",
    "unredactable_failure",
    "terminal_completed",
    "terminal_failed",
    "terminal_aborted",
    "terminal_rejected",
    "nonzero_exit_expected",
    "nonzero_exit_unexpected",
    "cleanup_required",
    "cleanup_not_available",
    "runtime_unavailable",
    "malformed",
    "unsupported_major"
  ]);
  assert.deepEqual(inventory.failClosedClassifications, [
    "unredactable_failure",
    "nonzero_exit_unexpected",
    "cleanup_not_available",
    "runtime_unavailable",
    "malformed",
    "unsupported_major"
  ]);
  assert.equal(inventory.reviewOnlyDisplayBehavior.failureAuditRecordsAreStaticArtifactsOnly, true);
  assert.equal(inventory.cliCommandSurface.failureAuditCommandAdded, false);
  assert.equal(inventory.cliCommandSurface.cleanupRuntimeCommandAdded, false);
  assert.equal(inventory.cliCommandSurface.killRuntimeCommandAdded, false);
  assert.equal(inventory.apiSurface.typescriptCoreRuntimeApiAdded, false);
  assert.equal(inventory.apiSurface.processKillAdded, false);
  assert.equal(inventory.apiSurface.processControlAdded, false);
  assert.equal(inventory.apiSurface.signalHandlerAdded, false);
  assert.equal(inventory.apiSurface.approvalEvaluatorAdded, false);
  assert.equal(inventory.safetyPosture.noFailureAuditRuntime, true);
  assert.equal(inventory.safetyPosture.noCleanupRuntime, true);
  assert.equal(inventory.safetyPosture.noProcessKill, true);
  assert.equal(inventory.safetyPosture.noProcessControl, true);
  assert.equal(report.safetyPosture.failureAuditContracts, true);
  assert.equal(report.safetyPosture.flags.phase41RuntimeImplemented, false);

  assert.deepEqual(
    inventory.fixtures.map(({ path, status }) => [path, status]),
    fixtureFiles.map((file) => [`tests/fixtures/host-policy/phase4-1e/${file}`, "present"])
  );
  assert.deepEqual(
    inventory.docs.map(({ path, status }) => [path, status]),
    [
      ["docs/phase-4-1e-failure-audit-kill-semantics.md", "present"],
      ["docs/phase-4-1d-transcript-replay-contracts.md", "present"],
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

  for (const probe of reportInvariantProbes) {
    assert.ok(inventory.invariantProbes.includes(probe), probe);
  }

  for (const check of [...report.configuredChecks, ...report.verificationCommands]) {
    assert.equal(check.ranByReport, false, check.command);
  }
});

test("Phase 4.1E source guards do not add cleanup, kill, or runtime surfaces", async () => {
  const [cliSource, coreSource, coreTypes, reportSource] = await Promise.all([
    readFile(cliSourceUrl, "utf8"),
    readFile(coreSourceUrl, "utf8"),
    readFile(coreTypesUrl, "utf8"),
    readFile(reportScriptUrl, "utf8")
  ]);
  const commandBranches = [...cliSource.matchAll(/if \(command === "([^"]+)"\)/g)].map(
    (match) => match[1]
  );
  const usage = cliSource.match(/Usage: ardyn <([^"]+)>/)?.[1] ?? "";
  const cliWriteFileMatches = [...cliSource.matchAll(/\bwriteFile\s*\(/g)];

  for (const requiredSymbol of [
    "ARDYN_FAILURE_AUDIT_CONTRACT_PHASE",
    "createFailureAuditRecordForReview",
    "classifyFailureAuditRecordForReview",
    "formatFailureAuditRecordJsonForReview"
  ]) {
    assert.match(coreSource, new RegExp(`\\b${requiredSymbol}\\b`));
    assert.match(coreTypes, new RegExp(`\\b${requiredSymbol}\\b`));
  }
  assert.match(reportSource, /phase41EFailureAuditInventory/);

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
      /process\.kill\s*\(/,
      /process\.exit\s*\(/,
      /process\.(?:on|once)\s*\(\s*["']SIG(?:INT|TERM|BREAK|KILL|QUIT)["']/,
      /node:readline/,
      /node:child_process/,
      /\bspawn\s*\(/,
      /\bexecFile\s*\(/,
      /\bfork\s*\(/,
      /\bcreateServer\s*\(/,
      /\blisten\s*\(/,
      /createReadStream/,
      /createWriteStream/,
      /(?:class|function)\s+ApprovalEvaluator/,
      /export\s+function\s+evaluateApproval/,
      /\bcleanupRuntime\s*\(/,
      /\bkillRuntime\s*\(/,
      /\bsignalHandler\s*\(/
    ]) {
      assert.doesNotMatch(source, forbiddenPattern, `${label} source should avoid ${forbiddenPattern}`);
    }
  }
});

test("Phase 4.1E failure-audit and runtime CLI probes fail safely with zero stdout", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase4-1e-probes-"));

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

test("Phase 4.1E fixture paths are committed static artifacts only", async () => {
  for (const file of fixtureFiles) {
    await access(new URL(file, fixtureRootUrl));
  }
});
