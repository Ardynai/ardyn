import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { access, readFile, readdir, rm, mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";

const execFileAsync = promisify(execFile);
const fixtureRootUrl = new URL("../tests/fixtures/host-policy/phase4-1b/", import.meta.url);
const harnessDocUrl = new URL(
  "../docs/phase-4-1b-transport-harness-contracts.md",
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
  new URL("../docs/phase-4-1-runtime-proposal.md", import.meta.url),
  new URL("../docs/phase-4-1a-host-policy-approval-records.md", import.meta.url)
];

const fixtureClassifications = Object.freeze({
  "valid-static-transport-harness-contract.json": "static_contract_only",
  "missing-approval-reference-transport-harness-contract.json": "approval_missing",
  "missing-policy-metadata-reference-transport-harness-contract.json":
    "policy_metadata_missing",
  "missing-redaction-policy-reference-transport-harness-contract.json":
    "redaction_policy_missing",
  "missing-transcript-audit-policy-reference-transport-harness-contract.json":
    "transcript_policy_missing",
  "unsupported-major-transport-harness-contract.json": "unsupported_version",
  "malformed-missing-contract-kind-transport-harness-contract.json": "malformed",
  "runtime-available-attempt-transport-harness-contract.json": "runtime_unavailable"
});

const topLevelOrder = Object.freeze([
  "schema",
  "schemaVersion",
  "contractKind",
  "contractPhase",
  "reviewedPhase",
  "harnessKind",
  "harnessVersion",
  "supportedTransportModes",
  "runtimeAvailability",
  "approvalRecordReference",
  "policyMetadataReference",
  "stderrRedactionPolicyReference",
  "transcriptAuditOutputPolicyReference",
  "failClosedStartupPreconditions",
  "runtimeEffect",
  "nonExecutionInvariantSummary",
  "classification",
  "unsupportedRuntimeReasons",
  "rejectedRuntimeReasons",
  "audit"
]);

const classificationStates = Object.freeze([
  "static_contract_only",
  "approval_missing",
  "policy_metadata_missing",
  "redaction_policy_missing",
  "transcript_policy_missing",
  "unsupported_version",
  "malformed",
  "runtime_unavailable"
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
  "transport-harness",
  "transport-harness-contract",
  "stdio-harness",
  "host-transport-harness",
  "phase-4-1b-transport-harness",
  "phase-4.1b-transport-harness",
  "start-transport-harness",
  "run-transport-harness",
  "enable-transport-harness",
  "transport-runtime",
  "stdio-transport",
  "stdin-reader",
  "stdout-writer",
  "stderr-writer",
  "failure-audit",
  "emit-failure-audit",
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

function transportHarnessSection(source) {
  return [
    rustSourceRange(
      source,
      "ARDYN_TRANSPORT_HARNESS_CONTRACT_SCHEMA",
      "ARDYN_STDIO_RUNTIME_CONTRACT_GATES_SCHEMA",
      "Phase 4.1B transport harness constants"
    ),
    rustSourceRange(
      source,
      "pub enum TransportHarnessRuntimeAvailabilityStatus",
      "pub enum StdioRuntimeContractGateBundleClassification",
      "Phase 4.1B transport harness enums"
    ),
    rustSourceRange(
      source,
      "pub struct TransportHarnessModeMetadata",
      "pub struct StdioRuntimeInputFramePayload",
      "Phase 4.1B transport harness structs"
    ),
    rustSourceRange(
      source,
      "pub fn transport_harness_contract_top_level_order",
      "pub fn stdio_runtime_contract_gates_top_level_order",
      "Phase 4.1B transport harness helpers"
    )
  ].join("\n");
}

test("Phase 4.1B transport harness fixtures are deterministic LF-only JSON", async () => {
  for (const [file, classification] of Object.entries(fixtureClassifications)) {
    const { text, json } = await readFixture(file);

    assert.equal(text.endsWith("\n"), true, file);
    assert.equal(text.includes("\r"), false, file);
    assert.equal(json.schema, "ardyn.transport-harness-contract", file);
    assert.equal(json.classification, classification, file);
  }

  const { json } = await readFixture("valid-static-transport-harness-contract.json");
  assert.deepEqual(Object.keys(json), topLevelOrder);
  assert.equal(json.schemaVersion, "0.1.0");
  assert.equal(json.contractKind, "transport-harness-contract");
  assert.equal(json.contractPhase, "phase-4.1b-transport-harness-contracts");
  assert.equal(json.reviewedPhase, "4.1B");
  assert.equal(json.harnessKind, "rust-host-stdio-transport-harness-static-contract");
  assert.equal(json.harnessVersion, "0.1.0");
});

test("Phase 4.1B valid contract cannot enable runtime", async () => {
  const { json } = await readFixture("valid-static-transport-harness-contract.json");

  assert.deepEqual(
    json.supportedTransportModes.map(({ name, direction, metadataOnly, runtimeImplemented }) => ({
      name,
      direction,
      metadataOnly,
      runtimeImplemented
    })),
    [
      {
        name: "stdio-jsonl-session-events",
        direction: "stdout",
        metadataOnly: true,
        runtimeImplemented: false
      },
      {
        name: "stderr-diagnostics",
        direction: "stderr",
        metadataOnly: true,
        runtimeImplemented: false
      },
      {
        name: "stdin-command-stream",
        direction: "stdin",
        metadataOnly: true,
        runtimeImplemented: false
      }
    ]
  );

  assert.equal(json.runtimeAvailability.status, "runtime-unavailable");
  for (const [field, value] of Object.entries(json.runtimeAvailability)) {
    if (field !== "status") {
      assert.equal(value, false, field);
    }
  }

  assert.equal(json.approvalRecordReference.required, true);
  assert.equal(json.approvalRecordReference.present, true);
  assert.equal(json.approvalRecordReference.operatorConsentRequired, true);
  assert.equal(json.approvalRecordReference.approvalRecordGrantsRuntime, false);
  assert.equal(json.policyMetadataReference.required, true);
  assert.equal(json.policyMetadataReference.present, true);
  assert.equal(json.policyMetadataReference.reviewOnly, true);
  assert.equal(json.stderrRedactionPolicyReference.required, true);
  assert.equal(json.stderrRedactionPolicyReference.present, true);
  assert.equal(json.stderrRedactionPolicyReference.enforcementActive, false);
  assert.equal(json.stderrRedactionPolicyReference.requiredBeforeLiveRuntime, true);
  assert.equal(json.transcriptAuditOutputPolicyReference.required, true);
  assert.equal(json.transcriptAuditOutputPolicyReference.present, true);
  assert.equal(json.transcriptAuditOutputPolicyReference.transcriptPersistenceRuntimeImplemented, false);
  assert.equal(json.transcriptAuditOutputPolicyReference.replayRuntimeImplemented, false);
  assert.equal(json.transcriptAuditOutputPolicyReference.writesFilesInThisPhase, false);

  assert.equal(json.runtimeEffect.currentContractEnablesRuntime, false);
  assert.equal(json.runtimeEffect.runtimeImplementationAvailable, false);
  assert.equal(json.runtimeEffect.runtimeCommandAvailable, false);
  assert.equal(json.runtimeEffect.processStdioOwnershipAvailable, false);
  assert.equal(json.runtimeEffect.stdinReaderAvailable, false);
  assert.equal(json.runtimeEffect.stdoutWriterAvailable, false);
  assert.equal(json.runtimeEffect.stderrWriterAvailable, false);
  assert.equal(json.runtimeEffect.approvalRecordNecessaryButNotSufficient, true);
  assert.equal(json.runtimeEffect.requiresSeparateRuntimeImplementationApproval, true);
  assert.equal(json.runtimeEffect.requiresDevinReviewBeforeEnablement, true);
  assert.equal(json.audit.devinReviewRequiredNow, false);
  assert.equal(json.audit.preserveDevinReviewFor, "major-runtime-readiness-checkpoint");
  assert.equal(json.audit.metadataOnly, true);
  assert.equal(json.audit.writesFiles, false);
  assert.equal(json.audit.runsRuntime, false);
});

test("Phase 4.1B fail-closed fixtures cover required classifications", async () => {
  const fixtures = Object.fromEntries(
    await Promise.all(
      Object.keys(fixtureClassifications).map(async (file) => [file, (await readFixture(file)).json])
    )
  );

  assert.equal(
    fixtures["missing-approval-reference-transport-harness-contract.json"].approvalRecordReference
      .present,
    false
  );
  assert.equal(
    fixtures["missing-policy-metadata-reference-transport-harness-contract.json"]
      .policyMetadataReference.present,
    false
  );
  assert.equal(
    fixtures["missing-redaction-policy-reference-transport-harness-contract.json"]
      .stderrRedactionPolicyReference.present,
    false
  );
  assert.equal(
    fixtures["missing-transcript-audit-policy-reference-transport-harness-contract.json"]
      .transcriptAuditOutputPolicyReference.present,
    false
  );
  assert.equal(fixtures["unsupported-major-transport-harness-contract.json"].schemaVersion, "9.0.0");
  assert.equal(
    Object.hasOwn(fixtures["malformed-missing-contract-kind-transport-harness-contract.json"], "contractKind"),
    false
  );
  assert.equal(
    fixtures["runtime-available-attempt-transport-harness-contract.json"].runtimeAvailability
      .runtimeAvailable,
    true
  );
  assert.equal(
    fixtures["runtime-available-attempt-transport-harness-contract.json"].runtimeEffect
      .currentContractEnablesRuntime,
    true
  );
  assert.equal(
    fixtures["runtime-available-attempt-transport-harness-contract.json"].approvalRecordReference
      .approvalRecordGrantsRuntime,
    true
  );

  for (const [file, json] of Object.entries(fixtures)) {
    assert.equal(
      json.classification === "static_contract_only",
      file === "valid-static-transport-harness-contract.json",
      file
    );
  }
});

test("Phase 4.1B docs cross-link transport harness contracts without implying runtime", async () => {
  const [harnessDoc, ...docs] = await Promise.all([
    readFile(harnessDocUrl, "utf8"),
    ...docUrls.map((url) => readFile(url, "utf8"))
  ]);
  const normalizedDoc = harnessDoc.replace(/\s+/g, " ");

  for (const requiredPhrase of [
    "static Rust-host metadata only",
    "approval references are necessary but not sufficient",
    "current contracts do not enable runtime",
    "static_contract_only",
    "approval_missing",
    "policy_metadata_missing",
    "redaction_policy_missing",
    "transcript_policy_missing",
    "runtime_unavailable",
    "Devin review should remain reserved",
    "Phase 4.1B adds no live stdin command loop"
  ]) {
    assert.match(
      normalizedDoc,
      new RegExp(requiredPhrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i")
    );
  }

  for (const source of docs) {
    assert.match(source, /docs\/phase-4-1b-transport-harness-contracts\.md/);
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

test("Phase 4.1B status report inventories transport harness contracts without running checks", async () => {
  const report = await runReport();

  assert.deepEqual(report.phase, {
    id: "5.22",
    name: "Approval prerequisite source bundle",
    executionPosture:
      "approval-prerequisite-source-bundle runtime-disabled no-runtime-execution"
  });
  assert.equal(report.reportMode, "local-summary-only");
  assert.equal(report.reportRunsChecks, false);
  assert.equal(report.phase41BTransportHarnessInventory.transportHarnessContract.schema, "ardyn.transport-harness-contract");
  assert.equal(report.phase41BTransportHarnessInventory.transportHarnessContract.contractKind, "transport-harness-contract");
  assert.equal(report.phase41BTransportHarnessInventory.transportHarnessContract.classification, "static_contract_only");
  assert.equal(report.phase41BTransportHarnessInventory.transportHarnessContract.currentContractEnablesRuntime, false);
  assert.equal(report.phase41BTransportHarnessInventory.transportHarnessContract.runtimeCommandAvailable, false);
  assert.equal(report.phase41BTransportHarnessInventory.transportHarnessContract.grantsRuntimeApproval, false);
  assert.deepEqual(report.phase41BTransportHarnessInventory.harnessContractModel.classes, classificationStates);
  assert.equal(report.phase41BTransportHarnessInventory.reviewOnlyDisplayBehavior.currentContractsDoNotEnableRuntime, true);
  assert.equal(report.phase41BTransportHarnessInventory.reviewOnlyDisplayBehavior.reportRunsChecks, false);
  assert.deepEqual(
    report.phase41BTransportHarnessInventory.fixtures.map(({ path, status }) => [path, status]),
    Object.keys(fixtureClassifications).map((file) => [
      `tests/fixtures/host-policy/phase4-1b/${file}`,
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

test("Phase 4.1B source guards do not add runtime or command surfaces", async () => {
  const [rustSource, cliSource, coreSource, reportSource] = await Promise.all([
    readFile(rustHostSourceUrl, "utf8"),
    readFile(cliSourceUrl, "utf8"),
    readFile(coreSourceUrl, "utf8"),
    readFile(reportScriptUrl, "utf8")
  ]);
  const harnessSection = transportHarnessSection(rustSource.split(/\n#\[cfg\(test\)\]\n/)[0]);
  const commandBranches = [...cliSource.matchAll(/if \(command === "([^"]+)"\)/g)].map(
    (match) => match[1]
  );
  const usage = cliSource.match(/Usage: ardyn <([^"]+)>/)?.[1] ?? "";

  for (const requiredSymbol of [
    "ARDYN_TRANSPORT_HARNESS_CONTRACT_SCHEMA",
    "TransportHarnessContract",
    "TransportHarnessRuntimeAvailability",
    "TransportHarnessContractClassification",
    "transport_harness_contract_json",
    "parse_transport_harness_contract_json",
    "classify_transport_harness_contract_json",
    "validate_transport_harness_contract"
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
    /tokio::net/,
    /\breqwest\b/,
    /\bhyper\b/,
    /\baxum\b/,
    /\bwarp\b/,
    /\btungstenite\b/,
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
    /runtime_approval_granted/i,
    /approval_evaluator/i,
    /process_stdio_owner_impl/i
  ]) {
    assert.doesNotMatch(harnessSection, forbiddenRustPattern);
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
      /transport-harness/i,
      /stdio-harness/i,
      /host-transport-harness/i,
      /phase-4-1b/i,
      /stdin-reader/i,
      /stdout-writer/i,
      /stderr-writer/i
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

test("Phase 4.1B transport and runtime CLI probes fail safely with zero stdout", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase4-1b-probes-"));

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

test("Phase 4.1B fixture paths are committed static artifacts only", async () => {
  for (const file of Object.keys(fixtureClassifications)) {
    await access(new URL(file, fixtureRootUrl));
  }
});
