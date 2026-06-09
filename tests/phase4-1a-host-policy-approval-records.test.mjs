import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { access, readFile, readdir, rm, mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";

const execFileAsync = promisify(execFile);
const fixtureRootUrl = new URL("../tests/fixtures/host-policy/phase4-1a/", import.meta.url);
const approvalDocUrl = new URL(
  "../docs/phase-4-1a-host-policy-approval-records.md",
  import.meta.url
);
const rustHostSourceUrl = new URL("../crates/ardyn-host/src/lib.rs", import.meta.url);
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
  new URL("../crates/ardyn-host/README.md", import.meta.url),
  new URL("../docs/architecture.md", import.meta.url),
  new URL("../docs/host-policy-preconditions.md", import.meta.url),
  new URL("../docs/session-events-stdio-contract.md", import.meta.url),
  new URL("../docs/phase-4-stdio-dry-run-event-emission.md", import.meta.url),
  new URL("../docs/phase-4-1-runtime-proposal.md", import.meta.url)
];

const fixtureClassifications = Object.freeze({
  "valid-review-only-host-policy-approval-record.json": "valid_review_record",
  "missing-operator-consent-host-policy-approval-record.json": "missing_operator_consent",
  "denied-host-policy-approval-record.json": "denied",
  "unsupported-major-host-policy-approval-record.json": "unsupported_version",
  "malformed-missing-record-kind-host-policy-approval-record.json": "malformed",
  "expired-not-yet-valid-host-policy-approval-record.json": "expired_or_not_yet_valid",
  "runtime-grant-attempt-host-policy-approval-record.json": "runtime_not_available"
});

const topLevelOrder = Object.freeze([
  "schema",
  "schemaVersion",
  "recordKind",
  "recordPhase",
  "reviewedPhase",
  "approvalTarget",
  "operatorConsent",
  "runtimeCapabilityRequest",
  "approvalStatus",
  "validity",
  "runtimeEffect",
  "currentRecordRuntimeStatement",
  "nonExecutionInvariantSummary",
  "classification",
  "denial",
  "audit"
]);

const consentScope = Object.freeze([
  "process-stdio-ownership",
  "stdin-lifecycle-control",
  "stdout-jsonl-ownership",
  "stderr-diagnostics-ownership",
  "process-termination-control",
  "transcript-persistence-review",
  "failure-audit-record-emission"
]);

const classificationStates = Object.freeze([
  "valid_review_record",
  "missing_operator_consent",
  "expired_or_not_yet_valid",
  "unsupported_version",
  "malformed",
  "denied",
  "runtime_not_available"
]);

const forbiddenRuntimeCommands = Object.freeze([
  "replay-session-transcript",
  "policy-metadata",
  "host-policy-export",
  "serve-runtime",
  "stdio-runtime",
  "approve-runtime",
  "grant-runtime",
  "host-policy-approval",
  "operator-consent",
  "enable-runtime",
  "phase-4-1a-approval-records",
  "runtime",
  "run",
  "execute",
  "live-runtime",
  "runtime-proposal",
  "proposal-runtime",
  "phase-4.1-runtime"
]);

async function readFixture(file) {
  const text = await readFile(new URL(file, fixtureRootUrl), "utf8");
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

function rustSourceRange(source, startMarker, endMarker, label) {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start + startMarker.length);

  assert.notEqual(start, -1, `${label} start marker should exist`);
  assert.notEqual(end, -1, `${label} end marker should exist`);
  assert.ok(start < end, `${label} should have ordered source markers`);

  return source.slice(start, end);
}

function rustApprovalRecordSection(source) {
  return [
    rustSourceRange(
      source,
      "ARDYN_HOST_POLICY_APPROVAL_RECORD_SCHEMA",
      "ARDYN_TRANSPORT_HARNESS_CONTRACT_SCHEMA",
      "Phase 4.1A approval-record constants"
    ),
    rustSourceRange(
      source,
      "pub enum HostPolicyApprovalStatus",
      "pub enum TransportHarnessRuntimeAvailabilityStatus",
      "Phase 4.1A approval-record enums"
    ),
    rustSourceRange(
      source,
      "pub struct HostPolicyApprovalTarget",
      "pub struct TransportHarnessModeMetadata",
      "Phase 4.1A approval-record structs"
    ),
    rustSourceRange(
      source,
      "pub fn host_policy_approval_record_top_level_order",
      "pub fn transport_harness_contract_top_level_order",
      "Phase 4.1A approval-record helpers"
    )
  ].join("\n");
}

test("Phase 4.1A approval-record fixtures are deterministic LF-only JSON", async () => {
  for (const [file, classification] of Object.entries(fixtureClassifications)) {
    const { text, json } = await readFixture(file);

    assert.equal(text.endsWith("\n"), true, file);
    assert.equal(text.includes("\r"), false, file);
    assert.equal(json.schema, "ardyn.host-policy-approval-record", file);
    assert.equal(json.classification, classification, file);
  }

  const { json } = await readFixture("valid-review-only-host-policy-approval-record.json");
  assert.deepEqual(Object.keys(json), topLevelOrder);
  assert.equal(json.schemaVersion, "0.1.0");
  assert.equal(json.recordKind, "host-policy-approval-record");
  assert.equal(json.recordPhase, "phase-4.1a-host-policy-approval-records");
  assert.equal(json.reviewedPhase, "4.1A");
});

test("Phase 4.1A valid-looking approval record still cannot enable runtime", async () => {
  const { json } = await readFixture("valid-review-only-host-policy-approval-record.json");

  assert.equal(json.approvalStatus, "review-approved");
  assert.deepEqual(json.approvalTarget.targetCommands, ["serve-runtime", "stdio-runtime"]);
  assert.equal(json.approvalTarget.requiresSeparateImplementationPhase, true);
  assert.equal(json.approvalTarget.devinReviewRequiredBeforeEnablement, true);
  assert.equal(json.operatorConsent.consentRecorded, true);
  assert.deepEqual(json.operatorConsent.consentScope, consentScope);
  assert.equal(json.operatorConsent.processStdioOwnershipConsent, true);
  assert.equal(json.operatorConsent.stdinLifecycleControlConsent, true);
  assert.equal(json.operatorConsent.stdoutJsonlOwnershipConsent, true);
  assert.equal(json.operatorConsent.stderrDiagnosticsOwnershipConsent, true);
  assert.equal(json.operatorConsent.processTerminationControlConsent, true);
  assert.equal(json.operatorConsent.transcriptPersistenceReviewConsent, true);
  assert.equal(json.operatorConsent.failureAuditRecordEmissionConsent, true);
  assert.equal(json.operatorConsent.understandsNecessaryButNotSufficient, true);
  assert.equal(json.operatorConsent.understandsNoRuntimeEnabledInThisPhase, true);
  assert.equal(json.operatorConsent.understandsSeparateImplementationRequired, true);
  assert.equal(json.runtimeCapabilityRequest.capability, "live-stdio-runtime");
  assert.equal(json.runtimeCapabilityRequest.runtimeImplementationAvailable, false);
  assert.equal(json.runtimeCapabilityRequest.serveRuntimeAvailable, false);
  assert.equal(json.runtimeCapabilityRequest.stdioRuntimeAvailable, false);
  assert.equal(json.runtimeEffect.currentRecordEnablesRuntime, false);
  assert.equal(json.runtimeEffect.runtimeApprovalEffectAllowed, false);
  assert.equal(json.runtimeEffect.runtimeImplementationAvailable, false);
  assert.equal(json.runtimeEffect.runtimeCommandAvailable, false);
  assert.equal(json.runtimeEffect.requiresSeparateRuntimeImplementationApproval, true);
  assert.equal(json.runtimeEffect.operatorConsentNecessaryButNotSufficient, true);
  assert.match(json.currentRecordRuntimeStatement, /do not enable runtime/i);
  assert.equal(json.audit.devinReviewRequiredNow, false);
  assert.equal(json.audit.preserveDevinReviewFor, "major-runtime-readiness-checkpoint");
  assert.equal(json.audit.metadataOnly, true);
  assert.equal(json.audit.writesFiles, false);
  assert.equal(json.audit.runsRuntime, false);
});

test("Phase 4.1A fail-closed fixtures cover required classifications", async () => {
  const fixtures = Object.fromEntries(
    await Promise.all(
      Object.keys(fixtureClassifications).map(async (file) => [file, (await readFixture(file)).json])
    )
  );

  assert.equal(
    fixtures["missing-operator-consent-host-policy-approval-record.json"].operatorConsent
      .consentRecorded,
    false
  );
  assert.deepEqual(
    fixtures["missing-operator-consent-host-policy-approval-record.json"].denial.failClosedReasons,
    ["missing_operator_consent"]
  );
  assert.equal(fixtures["denied-host-policy-approval-record.json"].approvalStatus, "review-denied");
  assert.deepEqual(fixtures["denied-host-policy-approval-record.json"].denial.failClosedReasons, [
    "operator_denied_runtime_request"
  ]);
  assert.equal(fixtures["unsupported-major-host-policy-approval-record.json"].schemaVersion, "9.0.0");
  assert.equal(
    Object.hasOwn(fixtures["malformed-missing-record-kind-host-policy-approval-record.json"], "recordKind"),
    false
  );
  assert.equal(
    fixtures["expired-not-yet-valid-host-policy-approval-record.json"].validity.validAtEvaluation,
    false
  );
  assert.equal(
    fixtures["runtime-grant-attempt-host-policy-approval-record.json"].runtimeEffect
      .runtimeApprovalEffectAllowed,
    true
  );
  assert.equal(
    fixtures["runtime-grant-attempt-host-policy-approval-record.json"].runtimeEffect
      .currentRecordEnablesRuntime,
    true
  );
});

test("Phase 4.1A docs cross-link approval records without implying runtime", async () => {
  const [approvalDoc, ...docs] = await Promise.all([
    readFile(approvalDocUrl, "utf8"),
    ...docUrls.map((url) => readFile(url, "utf8"))
  ]);
  const normalizedDoc = approvalDoc.replace(/\s+/g, " ");

  for (const requiredPhrase of [
    "static review/audit artifacts only",
    "operator consent is necessary but not sufficient",
    "current records do not enable runtime",
    "valid_review_record",
    "missing_operator_consent",
    "expired_or_not_yet_valid",
    "runtime_not_available",
    "Devin review should remain reserved",
    "Phase 4.1A adds no live stdin command loop"
  ]) {
    assert.match(
      normalizedDoc,
      new RegExp(requiredPhrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i")
    );
  }

  for (const source of docs) {
    assert.match(source, /docs\/phase-4-1a-host-policy-approval-records\.md/);
  }

  for (const misleadingPhrase of [
    "readyForRuntimeExecution",
    "goLive",
    "productionReady",
    "runtime unlocked",
    "approval token"
  ]) {
    assert.doesNotMatch(normalizedDoc, new RegExp(misleadingPhrase, "i"));
  }
});

test("Phase 4.1A status report inventories approval records without running checks", async () => {
  const report = await runReport();

  assert.deepEqual(report.phase, {
    id: "5.7",
    name: "Runtime approval validation",
    executionPosture: "runtime-approval-validation-contract runtime-disabled no-runtime-execution"
  });
  assert.equal(report.reportMode, "local-summary-only");
  assert.equal(report.reportRunsChecks, false);
  assert.equal(report.phase41AApprovalRecordInventory.hostPolicyApprovalRecords.schema, "ardyn.host-policy-approval-record");
  assert.equal(report.phase41AApprovalRecordInventory.hostPolicyApprovalRecords.recordKind, "host-policy-approval-record");
  assert.equal(report.phase41AApprovalRecordInventory.hostPolicyApprovalRecords.classification, "valid_review_record");
  assert.equal(report.phase41AApprovalRecordInventory.hostPolicyApprovalRecords.currentRecordEnablesRuntime, false);
  assert.equal(report.phase41AApprovalRecordInventory.hostPolicyApprovalRecords.runtimeApprovalEffectAllowed, false);
  assert.equal(report.phase41AApprovalRecordInventory.hostPolicyApprovalRecords.grantsRuntimeApproval, false);
  assert.deepEqual(report.phase41AApprovalRecordInventory.approvalRecordModel.classes, classificationStates);
  assert.deepEqual(report.phase41AApprovalRecordInventory.operatorConsentDisplayFields.consentScope, consentScope);
  assert.equal(report.phase41AApprovalRecordInventory.reviewOnlyDisplayBehavior.currentRecordsDoNotEnableRuntime, true);
  assert.equal(report.phase41AApprovalRecordInventory.reviewOnlyDisplayBehavior.reportRunsChecks, false);
  assert.deepEqual(
    report.phase41AApprovalRecordInventory.fixtures.map(({ path, status }) => [path, status]),
    Object.keys(fixtureClassifications).map((file) => [
      `tests/fixtures/host-policy/phase4-1a/${file}`,
      "present"
    ])
  );
  assert.equal(report.safetyPosture.hostPolicyApprovalRecords, true);
  assert.equal(report.safetyPosture.transportHarnessContracts, true);
  assert.equal(report.safetyPosture.flags.phase41RuntimeImplemented, false);

  for (const check of [...report.configuredChecks, ...report.verificationCommands]) {
    assert.equal(check.ranByReport, false, check.command);
  }
});

test("Phase 4.1A source guards do not add runtime or command surfaces", async () => {
  const [rustSource, cliSource, coreSource, reportSource] = await Promise.all([
    readFile(rustHostSourceUrl, "utf8"),
    readFile(cliSourceUrl, "utf8"),
    readFile(coreSourceUrl, "utf8"),
    readFile(reportScriptUrl, "utf8")
  ]);
  const approvalSection = rustApprovalRecordSection(rustSource.split(/\n#\[cfg\(test\)\]\n/)[0]);
  const commandBranches = [...cliSource.matchAll(/if \(command === "([^"]+)"\)/g)].map(
    (match) => match[1]
  );
  const usage = cliSource.match(/Usage: ardyn <([^"]+)>/)?.[1] ?? "";

  for (const requiredSymbol of [
    "ARDYN_HOST_POLICY_APPROVAL_RECORD_SCHEMA",
    "HostPolicyApprovalRecord",
    "HostPolicyOperatorConsent",
    "HostPolicyApprovalRecordClassification",
    "host_policy_approval_record_json",
    "denied_host_policy_approval_record_json",
    "parse_host_policy_approval_record_json",
    "classify_host_policy_approval_record_json"
  ]) {
    assert.match(rustSource, new RegExp(`\\b${requiredSymbol}\\b`));
  }

  for (const forbiddenRustPattern of [
    /std::io::stdin\b/,
    /std::process\b/,
    /\bCommand::new\b/,
    /std::net::/,
    /\bTcpListener\b/,
    /\bTcpStream\b/,
    /\bUdpSocket\b/,
    /std::env::var\b/,
    /std::env::vars\b/,
    /println!/,
    /eprintln!/,
    /std::fs::write/,
    /\bfs::write/,
    /\bFile::create\b/,
    /\bwrite_all\b/,
    /load_production_signing_key/i,
    /grant_runtime_approval/i,
    /runtime_approval_granted/i
  ]) {
    assert.doesNotMatch(approvalSection, forbiddenRustPattern);
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
      /host-policy-approval/i,
      /operator-consent/i,
      /approve-runtime/i,
      /grant-runtime/i,
      /enable-runtime/i,
      /phase-4-1a/i
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

test("Phase 4.1A approval and runtime CLI probes fail safely with zero stdout", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase4-1a-probes-"));

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

test("Phase 4.1A fixture paths are committed static artifacts only", async () => {
  for (const file of Object.keys(fixtureClassifications)) {
    await access(new URL(file, fixtureRootUrl));
  }
});
