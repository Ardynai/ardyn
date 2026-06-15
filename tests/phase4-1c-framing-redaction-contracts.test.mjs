import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { access, mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";

import {
  classifyRedactionSafety,
  createStdioFramingRedactionContractForReview,
  formatJsonlWholeLinesForReview,
  formatStdioFramingRedactionContractJsonForReview,
  redactStderrDiagnosticForReview,
  validateJsonlWholeLineBundle
} from "../packages/core/src/index.mjs";

const execFileAsync = promisify(execFile);
const fixtureRootUrl = new URL("../tests/fixtures/host-policy/phase4-1c/", import.meta.url);
const framingRedactionDocUrl = new URL(
  "../docs/phase-4-1c-framing-redaction-contracts.md",
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
  new URL("../docs/phase-4-1b-transport-harness-contracts.md", import.meta.url)
];

const jsonlFixtureClassifications = Object.freeze({
  "valid-whole-line-jsonl-bundle.json": "valid_whole_line_bundle",
  "blank-line-rejected-jsonl-bundle.json": "blank_line_rejected",
  "missing-final-lf-rejected-jsonl-bundle.json": "missing_final_lf",
  "crlf-rejected-jsonl-bundle.json": "crlf_rejected",
  "malformed-json-line-rejected-jsonl-bundle.json": "malformed_json_line",
  "partial-line-rejected-jsonl-bundle.json": "partial_line_rejected"
});

const redactionFixtureClassifications = Object.freeze({
  "redacted-secret-token-diagnostic.json": "redacted_safe",
  "redacted-absolute-path-diagnostic.json": "redacted_safe",
  "redacted-stack-trace-diagnostic.json": "redacted_safe",
  "unredactable-diagnostic-fail-closed.json": "unredactable_fail_closed"
});

const topLevelOrder = Object.freeze([
  "schema",
  "schemaVersion",
  "contractKind",
  "contractPhase",
  "reviewedPhase",
  "jsonlFraming",
  "stderrRedaction",
  "validation",
  "runtimeEffect",
  "audit"
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
  "framing-redaction",
  "stdout-framing",
  "stderr-redaction",
  "redact-stderr",
  "validate-jsonl-framing",
  "phase-4-1c-framing-redaction",
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

test("Phase 4.1C contract fixture is deterministic LF-only JSON", async () => {
  const fixture = await readFixture("valid-static-framing-redaction-contract.json");
  const generated = formatStdioFramingRedactionContractJsonForReview();
  const contract = createStdioFramingRedactionContractForReview();

  assert.equal(fixture.text, generated);
  assert.equal(fixture.text.endsWith("\n"), true);
  assert.equal(fixture.text.includes("\r"), false);
  assert.deepEqual(Object.keys(fixture.json), topLevelOrder);
  assert.deepEqual(fixture.json, contract);
  assert.equal(fixture.json.schema, "ardyn.stdio-framing-redaction-contract");
  assert.equal(fixture.json.schemaVersion, "0.1.0");
  assert.equal(fixture.json.contractKind, "stdio-framing-redaction-contract");
  assert.equal(fixture.json.contractPhase, "phase-4.1c-framing-redaction-contracts");
  assert.equal(fixture.json.reviewedPhase, "4.1C");
  assert.equal(fixture.json.audit.devinReviewRequiredNow, false);
  assert.equal(fixture.json.audit.preserveDevinReviewFor, "major-runtime-readiness-checkpoint");

  for (const [field, value] of Object.entries(fixture.json.runtimeEffect)) {
    assert.equal(value, false, field);
  }
});

test("Phase 4.1C JSONL formatter emits deterministic whole lines for review only", () => {
  const jsonl = formatJsonlWholeLinesForReview([
    { status: "static-review", sequence: 1, phase: "4.1C" },
    { status: "static-review", sequence: 2, phase: "4.1C" }
  ]);

  assert.equal(
    jsonl,
    '{"phase":"4.1C","sequence":1,"status":"static-review"}\n{"phase":"4.1C","sequence":2,"status":"static-review"}\n'
  );
  assert.equal(jsonl.endsWith("\n"), true);
  assert.equal(jsonl.includes("\r"), false);
  assert.deepEqual(validateJsonlWholeLineBundle(jsonl), {
    schema: "ardyn.jsonl-whole-line-bundle-validation",
    schemaVersion: "0.1.0",
    phase: "phase-4.1c-framing-redaction-contracts",
    classification: "valid_whole_line_bundle",
    valid: true,
    lineCount: 2,
    lfOnly: true,
    finalLf: true,
    blankLinesAllowed: false,
    partialLineEmissionAllowed: false,
    oneJsonObjectPerLine: true,
    errors: [],
    reviewOnly: true,
    runtimeEffect: {
      currentContractEnablesRuntime: false,
      processStdioOwnershipAvailable: false,
      stdoutWriterAvailable: false,
      stderrWriterAvailable: false,
      stdinReaderAvailable: false,
      runtimeCommandAvailable: false,
      writesToStdout: false,
      writesToStderr: false
    }
  });

  assert.throws(() => formatJsonlWholeLinesForReview([]), /at least one object/i);
  assert.throws(() => formatJsonlWholeLinesForReview([{ ok: true }, , { ok: true }]), /missing/i);
  assert.throws(() => formatJsonlWholeLinesForReview([{ ok: true }, []]), /JSON object/i);
});

test("Phase 4.1C JSONL fixtures classify whole-line framing failures", async () => {
  for (const [file, classification] of Object.entries(jsonlFixtureClassifications)) {
    const { text, json } = await readFixture(file);
    const result = validateJsonlWholeLineBundle(json.input);

    assert.equal(text.endsWith("\n"), true, file);
    assert.equal(text.includes("\r"), false, file);
    assert.equal(json.schema, "ardyn.phase-4.1c-static-fixture", file);
    assert.equal(json.fixtureKind, "jsonl-whole-line-bundle", file);
    assert.equal(json.expectedClassification, classification, file);
    assert.equal(json.reviewOnly, true, file);
    assert.equal(json.runtimeEffect.currentContractEnablesRuntime, false, file);
    assert.equal(json.runtimeEffect.runtimeCommandAvailable, false, file);
    assert.equal(result.classification, classification, file);
    assert.equal(result.reviewOnly, true, file);
    assert.equal(result.runtimeEffect.currentContractEnablesRuntime, false, file);

    if (classification === "valid_whole_line_bundle") {
      assert.equal(result.valid, true, file);
      assert.equal(result.lineCount, 2, file);
      assert.equal(result.errors.length, 0, file);
    } else {
      assert.equal(result.valid, false, file);
      assert.notEqual(result.errors.length, 0, file);
    }
  }
});

test("Phase 4.1C stderr redaction fixtures redact sensitive diagnostics or fail closed", async () => {
  for (const [file, classification] of Object.entries(redactionFixtureClassifications)) {
    const { text, json } = await readFixture(file);
    const result = redactStderrDiagnosticForReview(json.inputDiagnostic);

    assert.equal(text.endsWith("\n"), true, file);
    assert.equal(text.includes("\r"), false, file);
    assert.equal(json.schema, "ardyn.phase-4.1c-static-fixture", file);
    assert.equal(json.fixtureKind, "stderr-diagnostic-redaction", file);
    assert.equal(json.expectedClassification, classification, file);
    assert.equal(json.reviewOnly, true, file);
    assert.equal(classifyRedactionSafety(json.inputDiagnostic), classification, file);
    assert.equal(result.classification, classification, file);
    assert.equal(result.reviewOnly, true, file);
    assert.equal(result.runtimeEffect.currentContractEnablesRuntime, false, file);
    assert.equal(result.runtimeEffect.stderrWriterAvailable, false, file);
    assert.equal(result.runtimeEffect.writesToStderr, false, file);

    if (classification === "redacted_safe") {
      assert.equal(result.failClosed, false, file);
      assert.notEqual(result.redactions.length, 0, file);
      for (const fragment of json.forbiddenFragments) {
        assert.doesNotMatch(result.diagnostic.message, new RegExp(fragment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), file);
      }
    } else {
      assert.equal(result.failClosed, true, file);
      assert.equal(result.diagnostic.message, "[DIAGNOSTIC_REDACTION_FAILED]", file);
    }
  }
});

test("Phase 4.1C stderr redaction covers environment variables and raw parser details", () => {
  const envResult = redactStderrDiagnosticForReview({
    code: "stderr.redaction.env",
    message: "failed process.env.SECRET_TOKEN=abc123 TOKEN=xyz"
  });
  const rawParseResult = redactStderrDiagnosticForReview({
    code: "stderr.redaction.raw",
    message: 'raw parse detail: {"token":"abc123","path":"C:\\Users\\Josh\\repo"}'
  });
  const malformedResult = redactStderrDiagnosticForReview({
    code: "bad code",
    message: "message"
  });

  assert.equal(envResult.classification, "redacted_safe");
  assert.doesNotMatch(envResult.diagnostic.message, /SECRET_TOKEN|abc123|TOKEN=xyz/);
  assert.match(envResult.diagnostic.message, /process\.env\.\[REDACTED_ENV\]/);
  assert.match(envResult.diagnostic.message, /\[REDACTED_ENV\]=\[REDACTED\]/);
  assert.equal(rawParseResult.classification, "redacted_safe");
  assert.equal(rawParseResult.diagnostic.message, "raw parse detail: [REDACTED_RAW_PARSE_DETAIL]");
  assert.equal(malformedResult.classification, "malformed");
  assert.equal(malformedResult.failClosed, true);
});

test("Phase 4.1C docs cross-link framing/redaction contracts without implying runtime", async () => {
  const [framingRedactionDoc, ...docs] = await Promise.all([
    readFile(framingRedactionDocUrl, "utf8"),
    ...docUrls.map((url) => readFile(url, "utf8"))
  ]);
  const normalizedDoc = framingRedactionDoc.replace(/\s+/g, " ");

  for (const requiredPhrase of [
    "static contract/helper work only",
    "no live writer exists",
    "no process stdio ownership exists",
    "future runtime must use these rules but is not implemented yet",
    "Devin review is still reserved",
    "valid_whole_line_bundle",
    "blank_line_rejected",
    "missing_final_lf",
    "crlf_rejected",
    "partial_line_rejected",
    "redacted_safe",
    "unredactable_fail_closed",
    "Phase 4.1C adds no live stdin command loop"
  ]) {
    assert.match(
      normalizedDoc,
      new RegExp(requiredPhrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i")
    );
  }

  for (const source of docs) {
    assert.match(source, /docs\/phase-4-1c-framing-redaction-contracts\.md/);
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

test("Phase 4.1C status report inventories framing/redaction contracts without running checks", async () => {
  const report = await runReport();
  const inventory = report.phase41CFramingRedactionInventory;

  assert.deepEqual(report.phase, {
    id: "5.19",
    name: "Approval prerequisite reader hardening",
    executionPosture:
      "approval-prerequisite-reader-hardening runtime-disabled no-runtime-execution"
  });
  assert.equal(report.reportMode, "local-summary-only");
  assert.equal(report.reportRunsChecks, false);
  assert.equal(inventory.framingRedactionContract.schema, "ardyn.stdio-framing-redaction-contract");
  assert.equal(inventory.framingRedactionContract.contractKind, "stdio-framing-redaction-contract");
  assert.equal(inventory.framingRedactionContract.staticContractOnly, true);
  assert.equal(inventory.framingRedactionContract.currentContractEnablesRuntime, false);
  assert.equal(inventory.framingRedactionContract.processStdioOwnershipAvailable, false);
  assert.deepEqual(inventory.jsonlFraming.classifications, Object.values(jsonlFixtureClassifications));
  assert.deepEqual(inventory.stderrRedaction.classifications, [
    "redacted_safe",
    "unredactable_fail_closed",
    "malformed"
  ]);
  assert.equal(inventory.reviewOnlyDisplayBehavior.futureRuntimeRequiresSeparateApprovedImplementationPhase, true);
  assert.equal(inventory.cliCommandSurface.commandAdded, false);
  assert.equal(inventory.cliCommandSurface.framingRedactionCommandAdded, false);
  assert.equal(inventory.apiSurface.typescriptCoreStaticReviewHelpersAdded, true);
  assert.equal(inventory.apiSurface.typescriptCoreRuntimeApiAdded, false);
  assert.equal(inventory.apiSurface.rustRuntimeHelperAdded, false);
  assert.equal(inventory.apiSurface.secretsUsed, false);
  assert.deepEqual(
    inventory.fixtures.map(({ path, status }) => [path, status]),
    [
      "tests/fixtures/host-policy/phase4-1c/valid-static-framing-redaction-contract.json",
      ...Object.keys(jsonlFixtureClassifications).map(
        (file) => `tests/fixtures/host-policy/phase4-1c/${file}`
      ),
      ...Object.keys(redactionFixtureClassifications).map(
        (file) => `tests/fixtures/host-policy/phase4-1c/${file}`
      )
    ].map((path) => [path, "present"])
  );
  assert.equal(report.safetyPosture.transportHarnessContracts, true);
  assert.equal(report.safetyPosture.framingRedactionContracts, true);
  assert.equal(report.safetyPosture.flags.phase41RuntimeImplemented, false);

  for (const check of [...report.configuredChecks, ...report.verificationCommands]) {
    assert.equal(check.ranByReport, false, check.command);
  }
});

test("Phase 4.1C source guards do not add runtime or command surfaces", async () => {
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

  for (const requiredSymbol of [
    "ARDYN_STDIO_FRAMING_REDACTION_PHASE",
    "formatJsonlWholeLinesForReview",
    "validateJsonlWholeLineBundle",
    "redactStderrDiagnosticForReview",
    "classifyRedactionSafety",
    "createStdioFramingRedactionContractForReview",
    "formatStdioFramingRedactionContractJsonForReview"
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
      /framing-redaction-command/i,
      /stdout-framing-command/i,
      /stderr-redaction-command/i,
      /redact-stderr-command/i,
      /validate-jsonl-framing-command/i
    ]) {
      assert.doesNotMatch(source, forbiddenPattern, `${label} source should avoid ${forbiddenPattern}`);
    }
  }

  for (const forbiddenCorePattern of [
    /process\.env\.[A-Za-z_$]/,
    /process\.stdout\.write/,
    /process\.stderr\.write/,
    /\bwriteFile\s*\(/,
    /\bappendFile\s*\(/,
    /\bmkdir\s*\(/,
    /\brm\s*\(/,
    /\bunlink\s*\(/
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

test("Phase 4.1C framing/redaction CLI probes fail safely with zero stdout", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase4-1c-probes-"));

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

test("Phase 4.1C fixture paths are committed static artifacts only", async () => {
  await access(new URL("valid-static-framing-redaction-contract.json", fixtureRootUrl));

  for (const file of [
    ...Object.keys(jsonlFixtureClassifications),
    ...Object.keys(redactionFixtureClassifications)
  ]) {
    await access(new URL(file, fixtureRootUrl));
  }
});
