import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { access, mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";

import {
  classifyTranscriptReplayCompatibilityForReview,
  createTranscriptPersistenceContractForReview,
  createTranscriptReplayCompatibilityRecordForReview,
  createTranscriptReplayContractForReview,
  formatTranscriptPersistenceContractJsonForReview,
  formatTranscriptReplayCompatibilityRecordJsonForReview,
  formatTranscriptReplayContractJsonForReview
} from "../packages/core/src/index.mjs";

const execFileAsync = promisify(execFile);
const fixtureRootUrl = new URL("../tests/fixtures/host-policy/phase4-1d/", import.meta.url);
const transcriptReplayDocUrl = new URL(
  "../docs/phase-4-1d-transcript-replay-contracts.md",
  import.meta.url
);
const currentTranscriptUrl = new URL(
  "../examples/session-transcripts/valid-task-approval.json",
  import.meta.url
);
const olderTranscriptUrl = new URL(
  "../tests/fixtures/session-transcripts/phase3-10/older-compatible-upgrade-available.json",
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
  new URL("../docs/phase-4-1c-framing-redaction-contracts.md", import.meta.url)
];

const replayFixtureClassifications = Object.freeze({
  "valid-static-transcript-replay-contract.json": "replay_contract_only",
  "compatible-transcript-replay-record.json": "compatible",
  "upgrade-available-transcript-replay-record.json": "upgrade_available",
  "unsupported-major-transcript-replay-record.json": "unsupported_major",
  "malformed-transcript-replay-record.json": "malformed",
  "digest-mismatch-transcript-replay-record.json": "digest_mismatch",
  "sequence-gap-transcript-replay-record.json": "sequence_gap",
  "duplicate-sequence-transcript-replay-record.json": "duplicate_sequence",
  "out-of-order-sequence-transcript-replay-record.json": "out_of_order_sequence",
  "runtime-available-attempt-transcript-replay-record.json": "replay_runtime_unavailable"
});

const fixtureFiles = Object.freeze([
  "valid-static-transcript-persistence-contract.json",
  ...Object.keys(replayFixtureClassifications)
]);

const topLevelPersistenceOrder = Object.freeze([
  "schema",
  "schemaVersion",
  "contractKind",
  "contractPhase",
  "reviewedPhase",
  "transcriptArtifact",
  "sourceEventStreamReference",
  "eventCount",
  "sequenceRange",
  "eventDigest",
  "eventIndex",
  "persistedAt",
  "persistedAtIsDeterministicFixtureMetadataOnly",
  "replayCompatibilityClassification",
  "replaySafetyStatus",
  "nonExecutionInvariantSummary",
  "failureReasons",
  "runtimeEffect",
  "audit"
]);

const forbiddenRuntimeCommands = Object.freeze([
  "replay-session-transcript",
  "persist-session-transcript",
  "transcript-replay",
  "transcript-persistence",
  "transcript-replay-contract",
  "transcript-persistence-contract",
  "transcript-sidecar",
  "sidecar-writer",
  "replay-transcript",
  "serve-runtime",
  "stdio-runtime",
  "stdin-reader",
  "stdout-writer",
  "stderr-writer",
  "approve-runtime",
  "grant-runtime",
  "approval-evaluator",
  "runtime",
  "run",
  "execute",
  "live-runtime"
]);

async function readJson(url) {
  return JSON.parse(await readFile(url, "utf8"));
}

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

test("Phase 4.1D persistence and replay fixtures are deterministic LF-only JSON", async () => {
  const transcript = await readJson(currentTranscriptUrl);
  const persistenceFixture = await readFixture("valid-static-transcript-persistence-contract.json");
  const replayFixture = await readFixture("valid-static-transcript-replay-contract.json");
  const compatibleFixture = await readFixture("compatible-transcript-replay-record.json");
  const persistence = createTranscriptPersistenceContractForReview(transcript);
  const replay = createTranscriptReplayContractForReview(persistence);

  assert.equal(persistenceFixture.text, formatTranscriptPersistenceContractJsonForReview(transcript));
  assert.equal(replayFixture.text, formatTranscriptReplayContractJsonForReview(persistence));
  assert.equal(
    compatibleFixture.text,
    formatTranscriptReplayCompatibilityRecordJsonForReview(transcript)
  );

  for (const file of fixtureFiles) {
    const { text } = await readFixture(file);
    assert.equal(text.endsWith("\n"), true, file);
    assert.equal(text.includes("\r"), false, file);
  }

  assert.deepEqual(Object.keys(persistenceFixture.json), topLevelPersistenceOrder);
  assert.deepEqual(persistenceFixture.json, persistence);
  assert.deepEqual(replayFixture.json, replay);
  assert.equal(persistenceFixture.json.schema, "ardyn.transcript-persistence-contract");
  assert.equal(replayFixture.json.schema, "ardyn.transcript-replay-contract");
  assert.equal(compatibleFixture.json.schema, "ardyn.transcript-replay-compatibility-record");
  assert.equal(persistenceFixture.json.eventCount, 7);
  assert.deepEqual(persistenceFixture.json.sequenceRange, { first: 1, last: 7 });
  assert.match(persistenceFixture.json.eventDigest.value, /^sha256:[0-9a-f]{64}$/);
  assert.equal(persistenceFixture.json.persistedAt, "1970-01-01T00:00:00.000Z");
  assert.equal(persistenceFixture.json.persistedAtIsDeterministicFixtureMetadataOnly, true);
  assertAllRuntimeEffectFalse(persistenceFixture.json.runtimeEffect);
  assertAllRuntimeEffectFalse(replayFixture.json.runtimeEffect);
  assertAllRuntimeEffectFalse(compatibleFixture.json.runtimeEffect);
});

test("Phase 4.1D replay compatibility fixtures classify fail-closed cases", async () => {
  for (const [file, expectedClassification] of Object.entries(replayFixtureClassifications)) {
    const { json } = await readFixture(file);
    const result = classifyTranscriptReplayCompatibilityForReview(json);

    assert.equal(result.classification, expectedClassification, file);
    assert.equal(result.replayRuntimeAvailable, false, file);
    assert.equal(result.replayCommandAvailable, false, file);
    assert.equal(result.reviewOnly, true, file);
    assertAllRuntimeEffectFalse(result.runtimeEffect);

    if (["compatible", "upgrade_available", "replay_contract_only"].includes(expectedClassification)) {
      assert.equal(result.failClosed, false, file);
    } else {
      assert.equal(result.failClosed, true, file);
      assert.equal(result.valid, false, file);
      assert.notEqual(result.failureReasons.length, 0, file);
    }
  }
});

test("Phase 4.1D helpers expose upgrade-compatible transcript replay review without runtime", async () => {
  const olderTranscript = await readJson(olderTranscriptUrl);
  const record = createTranscriptReplayCompatibilityRecordForReview(olderTranscript);
  const classification = classifyTranscriptReplayCompatibilityForReview(record);

  assert.equal(record.transcriptArtifact.transcriptVersion, "0.0.9");
  assert.equal(record.replayCompatibilityClassification, "upgrade_available");
  assert.equal(classification.classification, "upgrade_available");
  assert.equal(classification.failClosed, false);
  assert.equal(classification.replayRuntimeAvailable, false);
  assert.equal(classification.replayCommandAvailable, false);
});

test("Phase 4.1D docs cross-link transcript replay contracts without implying runtime", async () => {
  const [transcriptReplayDoc, ...docs] = await Promise.all([
    readFile(transcriptReplayDocUrl, "utf8"),
    ...docUrls.map((url) => readFile(url, "utf8"))
  ]);
  const normalizedDoc = transcriptReplayDoc.replace(/\s+/g, " ");

  for (const requiredPhrase of [
    "static contract/fixture work only",
    "transcript persistence runtime is not implemented",
    "replay runtime is not implemented",
    "replay-session-transcript remains proposal-only/rejected",
    "future live transcript/replay behavior requires separate approval and Devin review",
    "replay_contract_only",
    "compatible",
    "upgrade_available",
    "unsupported_major",
    "malformed",
    "digest_mismatch",
    "sequence_gap",
    "duplicate_sequence",
    "out_of_order_sequence",
    "replay_runtime_unavailable",
    "Phase 4.1D adds no live stdin command loop"
  ]) {
    assert.match(
      normalizedDoc,
      new RegExp(requiredPhrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i")
    );
  }

  for (const source of docs) {
    assert.match(source, /docs\/phase-4-1d-transcript-replay-contracts\.md/);
  }

  for (const misleadingPhrase of [
    "readyForRuntimeExecution",
    "goLive",
    "productionReady",
    "runtime unlocked",
    "replay command implemented"
  ]) {
    assert.doesNotMatch(normalizedDoc, new RegExp(misleadingPhrase, "i"));
  }
});

test("Phase 4.1D status report inventories transcript replay contracts without running checks", async () => {
  const report = await runReport();
  const inventory = report.phase41DTranscriptReplayInventory;

  assert.deepEqual(report.phase, {
    id: "5.38",
    name: "Review-only inspection handoff metadata boundary",
    executionPosture:
      "review-only-inspection-handoff-metadata-boundary runtime-disabled no-reviewer-routing no-reviewer-assignment no-evaluator-execution no-evaluator-result no-runtime-execution no-approval-decision"
  });
  assert.equal(report.reportMode, "local-summary-only");
  assert.equal(report.reportRunsChecks, false);
  assert.equal(inventory.transcriptPersistenceContract.schema, "ardyn.transcript-persistence-contract");
  assert.equal(inventory.transcriptReplayContract.schema, "ardyn.transcript-replay-contract");
  assert.equal(inventory.compatibilityRecord.schema, "ardyn.transcript-replay-compatibility-record");
  assert.equal(inventory.transcriptPersistenceContract.staticContractOnly, true);
  assert.equal(inventory.transcriptReplayContract.staticContractOnly, true);
  assert.equal(inventory.compatibilityRecord.classification, "compatible");
  assert.deepEqual(inventory.replayCompatibility.classifications, [
    "replay_contract_only",
    "compatible",
    "upgrade_available",
    "unsupported_major",
    "malformed",
    "digest_mismatch",
    "sequence_gap",
    "duplicate_sequence",
    "out_of_order_sequence",
    "replay_runtime_unavailable"
  ]);
  assert.equal(inventory.reviewOnlyDisplayBehavior.futureRuntimeRequiresSeparateApprovedImplementationPhase, true);
  assert.equal(inventory.cliCommandSurface.replaySessionTranscriptCommandAdded, false);
  assert.equal(inventory.apiSurface.typescriptCoreStaticReviewHelpersAdded, true);
  assert.equal(inventory.apiSurface.typescriptCoreRuntimeApiAdded, false);
  assert.equal(inventory.apiSurface.rustRuntimeHelperAdded, false);
  assert.equal(inventory.apiSurface.secretsUsed, false);
  assert.deepEqual(
    inventory.fixtures.map(({ path, status }) => [path, status]),
    fixtureFiles.map((file) => [`tests/fixtures/host-policy/phase4-1d/${file}`, "present"])
  );
  assert.equal(report.safetyPosture.transcriptReplayContracts, true);
  assert.equal(report.safetyPosture.flags.phase41RuntimeImplemented, false);

  for (const check of [...report.configuredChecks, ...report.verificationCommands]) {
    assert.equal(check.ranByReport, false, check.command);
  }
});

test("Phase 4.1D source guards do not add persistence or replay runtime surfaces", async () => {
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
    "ARDYN_TRANSCRIPT_REPLAY_CONTRACT_PHASE",
    "createTranscriptPersistenceContractForReview",
    "createTranscriptReplayContractForReview",
    "createTranscriptReplayCompatibilityRecordForReview",
    "classifyTranscriptReplayCompatibilityForReview",
    "formatTranscriptPersistenceContractJsonForReview",
    "formatTranscriptReplayContractJsonForReview",
    "formatTranscriptReplayCompatibilityRecordJsonForReview"
  ]) {
    assert.match(coreSource, new RegExp(`\\b${requiredSymbol}\\b`));
    assert.match(coreTypes, new RegExp(`\\b${requiredSymbol}\\b`));
  }

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
      /createWriteStream/,
      /watch\s*\(/,
      /@ardyn\/adapters/,
      /@ardyn\/fabric/,
      /@ardyn\/mcp/
    ]) {
      assert.doesNotMatch(source, forbiddenPattern, `${label} source should avoid ${forbiddenPattern}`);
    }
  }

  for (const forbiddenCorePattern of [
    /process\.env\.[A-Za-z_$]/,
    /\bwriteFile\s*\(/,
    /\bappendFile\s*\(/,
    /\bmkdir\s*\(/,
    /\brm\s*\(/,
    /\bunlink\s*\(/,
    /createWriteStream/
  ]) {
    assert.doesNotMatch(coreSource, forbiddenCorePattern);
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
    /process\.env\.[A-Za-z_$]/
  ]) {
    assert.doesNotMatch(reportSource, forbiddenReportPattern);
  }
});

test("Phase 4.1D transcript replay CLI probes fail safely with zero stdout", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase4-1d-probes-"));

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

test("Phase 4.1D fixture paths are committed static artifacts only", async () => {
  for (const file of fixtureFiles) {
    await access(new URL(file, fixtureRootUrl));
  }
});
