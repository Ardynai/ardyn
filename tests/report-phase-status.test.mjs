import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";

const execFileAsync = promisify(execFile);
const packageJsonUrl = new URL("../package.json", import.meta.url);
const reportScriptUrl = new URL("../scripts/report-phase-status.mjs", import.meta.url);
const repoRoot = fileURLToPath(new URL("..", import.meta.url));
const reportScriptPath = fileURLToPath(reportScriptUrl);
const phase40IChecklistIds = [
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
];
const phase40IInvariantIds = [
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
];
const phase41ProposalSectionIds = [
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
];
const phase41RequiredTestIds = [
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
];
const phase41RoadmapIds = [
  "phase-4.1a-host-policy-approval-records",
  "phase-4.1b-rust-host-transport-harness",
  "phase-4.1c-stdout-stderr-enforcement",
  "phase-4.1d-transcript-persistence-replay",
  "phase-4.1e-failure-audit-and-kill-semantics",
  "phase-4.1f-major-runtime-readiness-checkpoint"
];
const phase41AApprovalClassifications = [
  "valid_review_record",
  "missing_operator_consent",
  "expired_or_not_yet_valid",
  "unsupported_version",
  "malformed",
  "denied",
  "runtime_not_available"
];
const phase41AConsentScope = [
  "process-stdio-ownership",
  "stdin-lifecycle-control",
  "stdout-jsonl-ownership",
  "stderr-diagnostics-ownership",
  "process-termination-control",
  "transcript-persistence-review",
  "failure-audit-record-emission"
];
const phase41AFixtureFiles = [
  "tests/fixtures/host-policy/phase4-1a/valid-review-only-host-policy-approval-record.json",
  "tests/fixtures/host-policy/phase4-1a/missing-operator-consent-host-policy-approval-record.json",
  "tests/fixtures/host-policy/phase4-1a/denied-host-policy-approval-record.json",
  "tests/fixtures/host-policy/phase4-1a/unsupported-major-host-policy-approval-record.json",
  "tests/fixtures/host-policy/phase4-1a/malformed-missing-record-kind-host-policy-approval-record.json",
  "tests/fixtures/host-policy/phase4-1a/expired-not-yet-valid-host-policy-approval-record.json",
  "tests/fixtures/host-policy/phase4-1a/runtime-grant-attempt-host-policy-approval-record.json"
];
const phase41BTransportHarnessClassifications = [
  "static_contract_only",
  "approval_missing",
  "policy_metadata_missing",
  "redaction_policy_missing",
  "transcript_policy_missing",
  "unsupported_version",
  "malformed",
  "runtime_unavailable"
];
const phase41BFixtureFiles = [
  "tests/fixtures/host-policy/phase4-1b/valid-static-transport-harness-contract.json",
  "tests/fixtures/host-policy/phase4-1b/missing-approval-reference-transport-harness-contract.json",
  "tests/fixtures/host-policy/phase4-1b/missing-policy-metadata-reference-transport-harness-contract.json",
  "tests/fixtures/host-policy/phase4-1b/missing-redaction-policy-reference-transport-harness-contract.json",
  "tests/fixtures/host-policy/phase4-1b/missing-transcript-audit-policy-reference-transport-harness-contract.json",
  "tests/fixtures/host-policy/phase4-1b/unsupported-major-transport-harness-contract.json",
  "tests/fixtures/host-policy/phase4-1b/malformed-missing-contract-kind-transport-harness-contract.json",
  "tests/fixtures/host-policy/phase4-1b/runtime-available-attempt-transport-harness-contract.json"
];
const phase41CJsonlClassifications = [
  "valid_whole_line_bundle",
  "blank_line_rejected",
  "missing_final_lf",
  "crlf_rejected",
  "malformed_json_line",
  "partial_line_rejected"
];
const phase41CRedactionClassifications = [
  "redacted_safe",
  "unredactable_fail_closed",
  "malformed"
];
const phase41CFixtureFiles = [
  "tests/fixtures/host-policy/phase4-1c/valid-static-framing-redaction-contract.json",
  "tests/fixtures/host-policy/phase4-1c/valid-whole-line-jsonl-bundle.json",
  "tests/fixtures/host-policy/phase4-1c/blank-line-rejected-jsonl-bundle.json",
  "tests/fixtures/host-policy/phase4-1c/missing-final-lf-rejected-jsonl-bundle.json",
  "tests/fixtures/host-policy/phase4-1c/crlf-rejected-jsonl-bundle.json",
  "tests/fixtures/host-policy/phase4-1c/malformed-json-line-rejected-jsonl-bundle.json",
  "tests/fixtures/host-policy/phase4-1c/partial-line-rejected-jsonl-bundle.json",
  "tests/fixtures/host-policy/phase4-1c/redacted-secret-token-diagnostic.json",
  "tests/fixtures/host-policy/phase4-1c/redacted-absolute-path-diagnostic.json",
  "tests/fixtures/host-policy/phase4-1c/redacted-stack-trace-diagnostic.json",
  "tests/fixtures/host-policy/phase4-1c/unredactable-diagnostic-fail-closed.json"
];

async function readJson(url) {
  return JSON.parse(await readFile(url, "utf8"));
}

async function runReport() {
  const { stdout, stderr } = await execFileAsync(process.execPath, [reportScriptPath], {
    cwd: repoRoot
  });

  assert.equal(stderr, "");
  return JSON.parse(stdout);
}

test("package exposes report:phase-status without replacing existing test scripts", async () => {
  const packageJson = await readJson(packageJsonUrl);

  assert.equal(packageJson.scripts.test, "node --test tests/*.test.mjs");
  assert.equal(
    packageJson.scripts["test:schemas"],
    "node --test tests/schema-validation.test.mjs tests/session-event-schema.test.mjs tests/session-transcript-schema.test.mjs"
  );
  assert.equal(packageJson.scripts["report:phase-status"], "node scripts/report-phase-status.mjs");
});

test("phase status report is Phase 4.1C framing-redaction-contract-only local metadata and does not claim to run checks", async () => {
  const report = await runReport();

  assert.equal(report.schemaVersion, "ardyn.phase-status-report.v1");
  assert.deepEqual(report.phase, {
    id: "4.1C",
    name: "Framing and redaction contracts",
    executionPosture: "framing-redaction-contract-only non-executing"
  });
  assert.equal(report.reportMode, "local-summary-only");
  assert.equal(report.reportRunsChecks, false);
  assert.equal(report.externalCi.ran, false);
  assert.equal(report.externalCi.claimed, false);
  assert.match(report.externalCi.note, /does not query or imply external CI/i);
});

test("report lists configured checks and verification commands without running them", async () => {
  const report = await runReport();

  assert.deepEqual(report.configuredChecks, [
    {
      name: "test",
      command: "npm test",
      packageScript: "node --test tests/*.test.mjs",
      ranByReport: false
    },
    {
      name: "test:schemas",
      command: "npm run test:schemas",
      packageScript:
        "node --test tests/schema-validation.test.mjs tests/session-event-schema.test.mjs tests/session-transcript-schema.test.mjs",
      ranByReport: false
    },
    {
      name: "report:phase-status",
      command: "npm run report:phase-status",
      packageScript: "node scripts/report-phase-status.mjs",
      ranByReport: false
    }
  ]);

  assert.deepEqual(report.verificationCommands, [
    {
      command: "npm test",
      purpose: "Run the repository node:test suite.",
      ranByReport: false
    },
    {
      command: "npm run test:schemas",
      purpose: "Run focused schema validation tests.",
      ranByReport: false
    },
    {
      command: "cargo test --workspace",
      purpose: "Run Rust workspace tests.",
      ranByReport: false
    },
    {
      command: "cargo check --workspace",
      purpose: "Check Rust workspace compilation without producing binaries.",
      ranByReport: false
    },
    {
      command: "cargo fmt --check",
      purpose: "Check Rust formatting without modifying files.",
      ranByReport: false
    },
    {
      command: "git diff --check",
      purpose: "Check the working diff for whitespace errors.",
      ranByReport: false
    },
    {
      command: "npm run report:phase-status",
      purpose: "Render this deterministic local Phase 4.1C framing-redaction-contract-only status report.",
      ranByReport: false
    },
    {
      command: "node --test tests/report-phase-status.test.mjs",
      purpose: "Run focused tests for this local Phase 4.1C status report.",
      ranByReport: false
    },
    {
      command: "node --test tests/phase4-1c-framing-redaction-contracts.test.mjs",
      purpose: "Run focused Phase 4.1C framing/redaction static checks.",
      ranByReport: false
    },
    {
      command: "node --test tests/phase4-1b-transport-harness-contracts.test.mjs",
      purpose: "Run focused Phase 4.1B transport harness contract static checks.",
      ranByReport: false
    },
    {
      command: "node --test tests/phase4-1a-host-policy-approval-records.test.mjs",
      purpose: "Run focused Phase 4.1A host-policy approval-record static checks.",
      ranByReport: false
    },
    {
      command: "node --test tests/phase4-1-runtime-proposal.test.mjs",
      purpose: "Run focused Phase 4.1 runtime proposal static checks.",
      ranByReport: false
    },
    {
      command: "node --test tests/phase4-0i-final-pre-runtime-readiness.test.mjs",
      purpose: "Run focused Phase 4.0I final pre-runtime readiness static checks.",
      ranByReport: false
    },
    {
      command: "node --test tests/phase4-0h-reviewer-handoff-index.test.mjs",
      purpose: "Run focused Phase 4.0H reviewer handoff index static checks.",
      ranByReport: false
    },
    {
      command: "node --test tests/host-policy-preconditions.test.mjs",
      purpose: "Run focused documentation/report checks for host-policy preconditions.",
      ranByReport: false
    },
    {
      command: "node --test tests/phase4-0c-transport-policy.test.mjs",
      purpose: "Run focused Phase 4.0C pre-runtime transport policy static checks.",
      ranByReport: false
    },
    {
      command: "node --test tests/phase4-0d-rust-host-policy-contracts.test.mjs",
      purpose: "Run focused Phase 4.0D Rust-host transport policy contract static checks.",
      ranByReport: false
    },
    {
      command: "node --test tests/phase4-0e-policy-metadata.test.mjs",
      purpose: "Run focused Phase 4.0E Rust-host policy metadata export static checks.",
      ranByReport: false
    },
    {
      command: "node --test tests/phase4-0f-host-policy-review-records.test.mjs",
      purpose: "Run focused Phase 4.0F host-policy review-record static checks.",
      ranByReport: false
    },
    {
      command: "node --test tests/phase4-0g-host-policy-review-comparison.test.mjs",
      purpose: "Run focused Phase 4.0G host-policy review-record comparison checks.",
      ranByReport: false
    },
    {
      command: "node --test tests/core-phase3-5-trace-fixtures.test.mjs",
      purpose: "Run focused Phase 3.5 trace-review fixture tests.",
      ranByReport: false
    },
    {
      command: "node --test tests/core-phase3-6-review-artifact-versioning.test.mjs",
      purpose: "Run focused Phase 3.6 review-artifact versioning and display tests.",
      ranByReport: false
    },
    {
      command: "node --test tests/core-phase3-7-schema-attestation.test.mjs",
      purpose: "Run focused Phase 3.7 schema migration and attestation planning tests.",
      ranByReport: false
    },
    {
      command: "node --test tests/session-event-schema.test.mjs",
      purpose: "Run focused Phase 3.8 session-event schema and fixture tests.",
      ranByReport: false
    },
    {
      command: "node --test tests/session-transcript-schema.test.mjs",
      purpose: "Run focused Phase 3.9 session-transcript schema and fixture tests.",
      ranByReport: false
    },
    {
      command: "node --test tests/core-phase3-9-session-transcripts.test.mjs",
      purpose: "Run focused Phase 3.9 static transcript validation and summary tests.",
      ranByReport: false
    },
    {
      command: "node --test tests/core-phase3-10-transcript-versioning.test.mjs",
      purpose: "Run focused Phase 3.10 transcript compatibility, migration, and display tests.",
      ranByReport: false
    },
    {
      command: "node --test tests/phase3-8-locus-family-alignment.test.mjs",
      purpose: "Run focused Phase 3.8 harness identity, Fabric family, and Locus display freeze tests.",
      ranByReport: false
    },
    {
      command: "node --test tests/cli-phase3.test.mjs",
      purpose: "Run focused CLI tests covering review-trace and review artifact export ergonomics.",
      ranByReport: false
    },
    {
      command: "node --test tests/core-phase4-stdio-dry-run.test.mjs",
      purpose: "Run focused Phase 4.0A core tests for JSONL event emission and path policy.",
      ranByReport: false
    },
    {
      command: "node --test tests/cli-phase4-stdio-dry-run.test.mjs",
      purpose: "Run focused Phase 4.0A CLI tests for stdout JSONL, stderr errors, and no side effects.",
      ranByReport: false
    }
  ]);

  for (const command of report.verificationCommands) {
    assert.equal(command.ranByReport, false, `${command.command} should not be run by report`);
  }
});

test("report inventories Phase 3.8 identity, Fabric family, Locus freeze, and session events", async () => {
  const report = await runReport();

  assert.deepEqual(report.phase38Inventory.harnessIdentity, {
    canonicalSlug: "ardyn",
    packageNamespace: "ardyn",
    manifestFacingHarnessId: "ardyn",
    keyringNamespace: "ardyn",
    fabricFamily: "ardyn",
    futureLocusConnectorExpectedId: "ardyn",
    multiverseIntegration: "optional-external",
    locusRuntimeDependency: false
  });

  assert.deepEqual(report.phase38Inventory.fabricFamilySet, [
    "*",
    "locus",
    "multiverse",
    "kortex-audio",
    "locus-evolution-lab",
    "somatic",
    "ardyn"
  ]);

  assert.deepEqual(report.phase38Inventory.staleSlugPolicy, {
    legacyArdynOsVariantsAcceptedAsCurrentHarnessId: false,
    acceptedAsCurrentHarnessId: false,
    allowedOnlyInNegativeTests: true
  });

  assert.deepEqual(report.phase38Inventory.locusDisplayContract, {
    freezeMarker: "PHASE_3_X_LOCUS_DISPLAY_CONTRACT_FROZEN",
    phase3xReadOnlyContractFrozen: true,
    locusMayDisplayPlannerTraces: true,
    locusMayDisplayReviewArtifacts: true,
    locusMayDisplayTraceDiffs: true,
    locusMayDisplaySchemaStatus: true,
    locusMayDisplayAttestationPlans: true,
    locusMayDisplaySessionEventFixtures: true,
    locusRuntimeDependency: false,
    approvalBypassAllowed: false,
    safetyBypassAllowed: false
  });

  assert.deepEqual(report.phase38Inventory.sessionEvents, {
    schema: "https://schemas.ardyn.ai/session-event.schema.json",
    schemaVersion: "0.1.0",
    sourceHarness: "ardyn",
    transportRoadmap: {
      firstFutureTransport: "stdio",
      stdioRuntimeImplemented: false,
      websocketRuntimeImplemented: false,
      httpRuntimeImplemented: false
    },
    eventTypes: [
      "session.started",
      "session.heartbeat",
      "session.capabilities",
      "task.planned",
      "approval.requested",
      "approval.recorded",
      "session.completed",
      "session.error"
    ],
    validExampleDirectory: "examples/session-events",
    invalidFixtures: ["invalid-source-harness.json", "invalid-safety-flag.json"],
    nonExecuting: true
  });

  assert.deepEqual(
    report.phase38Inventory.docs.map(({ path, status }) => [path, status]),
    [
      ["docs/harness-identity.md", "present"],
      ["docs/session-events-stdio-contract.md", "present"],
      ["docs/content-fabric.md", "present"],
      ["docs/locus-trace-display-contract.md", "present"]
    ]
  );

  assert.deepEqual(
    report.phase38Inventory.tests.map(({ path, status }) => [path, status]),
    [
      ["tests/phase3-8-locus-family-alignment.test.mjs", "present"],
      ["tests/session-event-schema.test.mjs", "present"],
      ["tests/fabric.test.mjs", "present"]
    ]
  );
});

test("report inventories review-trace commands and explicit-only output behavior", async () => {
  const report = await runReport();

  assert.deepEqual(report.phase36Inventory.reviewTraceCommands, [
    {
      command: "ardyn review-trace <left> <right>",
      mode: "default",
      writesFiles: false,
      summary: "Renders the non-executing trace review comparison in the default local review format."
    },
    {
      command: "ardyn review-trace --summary <left> <right>",
      mode: "summary",
      writesFiles: false,
      summary: "Renders a concise local summary of trace review changes."
    },
    {
      command: "ardyn review-trace --explain <left> <right>",
      mode: "explain",
      writesFiles: false,
      summary: "Renders reviewer-oriented local explanations for trace review changes."
    }
  ]);

  assert.deepEqual(report.phase36Inventory.exportErgonomics, {
    reportWritesFiles: false,
    reportOutputFileSupport: false,
    reviewTraceWritesFiles: false,
    reviewArtifactOutputCommand: "ardyn plan --review-artifact --output <file>",
    reviewArtifactOutputRequiresExplicitCliFlag: true,
    summary:
      "The report script is stdout-only local metadata; artifact file writes are only available through an explicit plan --review-artifact --output CLI request."
  });
});

test("report inventories Phase 3.9 transcript contract hardening and static review metadata", async () => {
  const report = await runReport();

  assert.deepEqual(report.phase39Inventory.transcriptSchema, {
    schema: "https://schemas.ardyn.ai/session-transcript.schema.json",
    schemaName: "ardyn.session-transcript",
    schemaVersion: "0.1.0",
    sourceHarness: "ardyn",
    nonExecuting: true,
    additionalProperties: false,
    unknownTopLevelFieldsRejected: true,
    unknownFutureMetadataInertUntilVersioned: true,
    semanticChecksOutsideJsonSchema: [
      "first-event-session-started",
      "contiguous-sequence-ordering",
      "cross-event-session-id-match",
      "cross-event-source-harness-match"
    ]
  });

  assert.deepEqual(report.phase39Inventory.transcriptFixtures, {
    directory: "examples/session-transcripts",
    files: [
      { path: "examples/session-transcripts/valid-error.json", status: "present" },
      { path: "examples/session-transcripts/valid-minimal.json", status: "present" },
      { path: "examples/session-transcripts/valid-task-approval.json", status: "present" },
      { path: "examples/session-transcripts/invalid-missing-session-started.json", status: "present" },
      { path: "examples/session-transcripts/invalid-out-of-order-sequence.json", status: "present" },
      { path: "examples/session-transcripts/invalid-safety-flag.json", status: "present" },
      { path: "examples/session-transcripts/invalid-source-harness.json", status: "present" }
    ]
  });

  assert.deepEqual(
    report.phase39Inventory.transcriptDocs.map(({ path, status }) => [path, status]),
    [
      ["docs/session-events-stdio-contract.md", "present"],
      ["docs/host-policy-preconditions.md", "present"],
      ["docs/locus-trace-display-contract.md", "present"],
      ["README.md", "present"]
    ]
  );

  assert.deepEqual(
    report.phase39Inventory.transcriptTests.map(({ path, status }) => [path, status]),
    [
      ["tests/session-transcript-schema.test.mjs", "present"],
      ["tests/core-phase3-9-session-transcripts.test.mjs", "present"],
      ["tests/report-phase-status.test.mjs", "present"]
    ]
  );

  assert.deepEqual(report.phase39Inventory.cliValidationCommandMetadata, {
    expectedCommand: "ardyn validate-session-transcript --file <file>",
    optionalModes: ["--summary", "--explain"],
    summary:
      "Implemented local read-only transcript validation command for static JSON review; Phase 3.9 does not implement a live stdio runtime.",
    filePolicy: {
      acceptsLocalFileOnly: true,
      urlsAllowed: false,
      fileUrlsAllowed: false,
      networkSharePathsAllowed: false,
      arbitraryLocalJsonPathsAllowed: true
    },
    writesFiles: false,
    network: false,
    stdioRuntime: false,
    processSpawning: false,
    locusRuntimeDependency: false
  });

  assert.deepEqual(report.phase39Inventory.safetyPreconditions, {
    explicitApprovalRequiredForTaskExecution: true,
    adapterPermissionDeclarationsRequired: true,
    rustHostPolicyRequiredForProcessNetworkFilesystemAccess: true,
    codePackEnablementRequiresFabricVerificationQuarantineEnablePolicy: true,
    stdoutStderrAndLineDelimitedJsonPolicyRequiredBeforeRuntime: true,
    locusRole: "peer-client-viewer-or-future-controller-only"
  });
});

test("report inventories Phase 3.10 transcript versioning and display metadata", async () => {
  const report = await runReport();

  assert.deepEqual(report.phase310Inventory.transcriptVersioning, {
    schema: "ardyn.session-transcript",
    schemaVersion: "0.1.0",
    schemaVersionSemantics:
      "Semantic version metadata for transcript envelope, safety proof, and event semantics; not a runtime permission.",
    compatibilityClasses: ["compatible", "upgrade_available", "unsupported_major", "malformed"],
    currentSupportedMajor: 0,
    sameMajorPatchMinorDisplayCompatible: true,
    sameMajorOlderMayBeUpgradeAvailable: true,
    unsupportedMajorBehavior:
      "Show identity, version, warnings, and raw inert metadata only; do not interpret current event or safety semantics.",
    malformedBehavior:
      "Show validation errors and raw inert metadata only; do not treat as ARDYN review evidence.",
    strictCurrentSchemaAllowsExtraTopLevelFields: false,
    unknownFieldsInertForCompatibilityAndDisplay: true,
    strictValidatorMayRejectCurrentSchemaExtraFields: true,
    deterministicTimestampPolicy: {
      liveTimestampsAllowedForMigrationOrStatusRecords: false,
      fixtureSuppliedTimestampsAllowed: true,
      deterministicTestMetadata: true,
      exampleEventCreatedAt: "1970-01-01T00:00:00.000Z",
      exampleGeneratedAt: "2026-06-02T00:00:00.000Z"
    },
    nonExecuting: true
  });

  assert.deepEqual(report.phase310Inventory.commandExamples, [
    {
      command: "ardyn validate-session-transcript --file <file> --schema-status",
      status: "implemented-local-read-only",
      writesFiles: false,
      network: false,
      processSpawning: false,
      stdioRuntime: false,
      summary:
        "Renders schema id, schemaVersion, compatibility class, migration availability, warnings, and safety posture for one local transcript."
    },
    {
      command: "ardyn validate-session-transcript --file <file> --display-summary",
      status: "implemented-local-read-only",
      writesFiles: false,
      network: false,
      processSpawning: false,
      stdioRuntime: false,
      summary:
        "Renders the Locus-facing read-only transcript summary fields for one local transcript."
    },
    {
      command: "ardyn validate-session-transcript --file <file> --compatibility-explain",
      status: "implemented-local-read-only",
      writesFiles: false,
      network: false,
      processSpawning: false,
      stdioRuntime: false,
      summary:
        "Renders compatibility reasoning, strict-validator notes, unknown-field policy, warnings, and severity mapping."
    }
  ]);

  assert.deepEqual(report.phase310Inventory.safetyPosture, {
    noLiveStdioRuntime: true,
    noCommandExecutionSemantics: true,
    noNetworkCalls: true,
    noProcessRuntime: true,
    noPluginInstall: true,
    noTorrentBehavior: true,
    noContentFabricRuntimeBehavior: true,
    noCodePackBehavior: true,
    noLocusRuntimeDependency: true
  });

  assert.deepEqual(
    report.phase310Inventory.docs.map(({ path, status }) => [path, status]),
    [
      ["docs/session-transcript-versioning-policy.md", "present"],
      ["docs/session-events-stdio-contract.md", "present"],
      ["docs/locus-trace-display-contract.md", "present"],
      ["README.md", "present"]
    ]
  );

  assert.deepEqual(
    report.phase310Inventory.fixtures.map(({ path, status }) => [path, status]),
    [
      ["tests/fixtures/session-transcripts/phase3-10/current-compatible.json", "present"],
      ["tests/fixtures/session-transcripts/phase3-10/display-summary.json", "present"],
      ["tests/fixtures/session-transcripts/phase3-10/inert-unknown-fields.json", "present"],
      ["tests/fixtures/session-transcripts/phase3-10/malformed.json", "present"],
      ["tests/fixtures/session-transcripts/phase3-10/migration-metadata.json", "present"],
      [
        "tests/fixtures/session-transcripts/phase3-10/older-compatible-upgrade-available.json",
        "present"
      ],
      ["tests/fixtures/session-transcripts/phase3-10/unsupported-major.json", "present"]
    ]
  );

  assert.deepEqual(
    report.phase310Inventory.tests.map(({ path, status }) => [path, status]),
    [
      ["tests/session-transcript-schema.test.mjs", "present"],
      ["tests/core-phase3-9-session-transcripts.test.mjs", "present"],
      ["tests/core-phase3-10-transcript-versioning.test.mjs", "present"],
      ["tests/report-phase-status.test.mjs", "present"]
    ]
  );
});

test("report inventories Phase 4.0A stdio dry-run event emission", async () => {
  const report = await runReport();

  assert.deepEqual(report.phase40AInventory.command, {
    command: "ardyn emit-session-events --dry-run --manifest <manifest.json> --task <task.json>",
    status: "implemented-finite-dry-run-emitter",
    stdout: "LF-delimited JSONL session events with one JSON object per line.",
    stderr: "Plain diagnostics and errors only.",
    writesFiles: false,
    readsStdin: false,
    network: false,
    processSpawning: false,
    listener: false,
    adapterCalls: false,
    locusRuntimeDependency: false,
    mcpCalls: false,
    openClawCalls: false,
    pluginExecution: false,
    contentFabricRuntimeBehavior: false
  });

  assert.deepEqual(report.phase40AInventory.coreApi, [
    "createStdioDryRunSessionEvents",
    "formatSessionEventsJsonl",
    "assertLocalFilePath",
    "assertLocalJsonFilePath",
    "readLocalJsonFile"
  ]);

  assert.deepEqual(report.phase40AInventory.eventOrder, [
    "session.started",
    "session.heartbeat",
    "session.capabilities",
    "task.planned",
    "approval.recorded",
    "session.completed"
  ]);

  assert.deepEqual(report.phase40AInventory.framing, {
    format: "jsonl",
    newline: "lf",
    finalTrailingNewline: true,
    validatesEveryEventBeforeSerialization: true,
    malformedEventsRejected: true
  });

  assert.deepEqual(report.phase40AInventory.localPathPolicy, {
    appliesTo: ["manifest", "task", "transcript", "local-json-review-input"],
    rejectsUrlSchemes: true,
    rejectsFileUrls: true,
    rejectsUncAndNetworkPaths: true,
    rejectsWindowsDriveRelativePaths: true,
    rejectsStdinMarker: true,
    rejectsNulCrLf: true,
    requiresJsonExtensionForJsonInputs: true,
    absoluteLocalPathsAllowed: true
  });

  assert.deepEqual(
    report.phase40AInventory.docs.map(({ path, status }) => [path, status]),
    [
      ["docs/phase-4-stdio-dry-run-event-emission.md", "present"],
      ["docs/session-events-stdio-contract.md", "present"],
      ["README.md", "present"],
      ["apps/cli/README.md", "present"],
      [".gitattributes", "present"]
    ]
  );

  assert.deepEqual(
    report.phase40AInventory.tests.map(({ path, status }) => [path, status]),
    [
      ["tests/core-phase4-stdio-dry-run.test.mjs", "present"],
      ["tests/cli-phase4-stdio-dry-run.test.mjs", "present"]
    ]
  );

  assert.deepEqual(report.phase40AInventory.safetyPosture, {
    nonExecuting: true,
    noLiveStdioRuntime: true,
    noStdinCommandLoop: true,
    noListener: true,
    noServer: true,
    noSubprocessSpawning: true,
    noAdapterCalls: true,
    noLocusRuntimeDependency: true,
    noMcpCalls: true,
    noOpenClawCalls: true,
    noPluginExecution: true,
    noContentFabricDownloadInstallEnable: true,
    allEventSafetyFlagsFalse: true
  });
});

test("report inventories Phase 4.0B dry-run emitter hardening", async () => {
  const report = await runReport();

  assert.deepEqual(report.phase40BInventory.command, {
    command: "ardyn emit-session-events --dry-run --manifest <manifest.json> --task <task.json>",
    status: "hardened-finite-dry-run-emitter",
    strictArgumentValidation: true,
    allowedArgs: ["--dry-run", "--manifest <path>", "--task <path>"],
    rejectsUnknownArgs: true,
    rejectsDuplicateArgs: true,
    rejectsMissingArgValues: true,
    rejectsExtraPositionals: true,
    validatesArgsBeforeFileReads: true,
    successStdout: "JSONL only.",
    failureStdout: "empty",
    failureStderr: "plain diagnostics"
  });

  assert.deepEqual(report.phase40BInventory.negativeCliCoverage, {
    unreadableManifestFile: true,
    unreadableTaskFile: true,
    invalidJsonManifest: true,
    invalidJsonTask: true,
    schemaInvalidManifest: true,
    schemaInvalidTask: true,
    unsafeManifestPath: true,
    unsafeTaskPath: true,
    missingDryRun: true,
    extraUnknownArgs: true,
    failuresEmitPartialStdoutJsonl: false
  });

  assert.deepEqual(report.phase40BInventory.formatterHardening, {
    finalLfRequired: true,
    blankJsonlLinesAllowed: false,
    sparseEventSlotsRejected: true,
    malformedEventsRejectedBeforeSerialization: true,
    allEventSafetyFlagsRemainFalse: true
  });

  assert.deepEqual(
    report.phase40BInventory.goldenFixtures.map(({ path, status }) => [path, status]),
    [["tests/fixtures/stdio-dry-run/phase4-0b-minimal-session-events.jsonl", "present"]]
  );

  assert.deepEqual(
    report.phase40BInventory.docs.map(({ path, status }) => [path, status]),
    [
      ["README.md", "present"],
      ["apps/cli/README.md", "present"],
      ["docs/phase-4-stdio-dry-run-event-emission.md", "present"],
      ["docs/session-events-stdio-contract.md", "present"],
      ["docs/host-policy-preconditions.md", "present"]
    ]
  );

  assert.deepEqual(
    report.phase40BInventory.tests.map(({ path, status }) => [path, status]),
    [
      ["tests/cli-phase4-stdio-dry-run.test.mjs", "present"],
      ["tests/core-phase4-stdio-dry-run.test.mjs", "present"],
      ["tests/report-phase-status.test.mjs", "present"]
    ]
  );

  assert.deepEqual(report.phase40BInventory.futureRustHostPolicyDesign, {
    documented: true,
    activeRuntimeEnforcement: false,
    rustOwnsFutureStdoutStderrPolicy: true,
    stdoutReservedForFutureJsonlEvents: true,
    stderrReservedForFutureDiagnostics: true,
    requiresBackpressureAndPartialWritePolicyBeforeRuntime: true
  });

  assert.deepEqual(report.phase40BInventory.safetyPosture, {
    nonExecuting: true,
    noLiveStdioRuntime: true,
    noStdinCommandLoop: true,
    noListener: true,
    noServer: true,
    noSubprocessSpawning: true,
    noAdapterCalls: true,
    noLocusRuntimeDependency: true,
    noMcpCalls: true,
    noOpenClawCalls: true,
    noPluginExecution: true,
    noContentFabricDownloadInstallEnable: true,
    noSecrets: true,
    noProductionSigningKeys: true
  });
});

test("report inventories Phase 4.0C pre-runtime transport policy", async () => {
  const report = await runReport();

  assert.deepEqual(report.phase40CInventory.transportPolicy, {
    document: "docs/phase-4-0c-pre-runtime-transport-policy.md",
    status: "policy-only-pre-runtime",
    activeRuntimeEnforcement: false,
    liveStdioRuntimeImplemented: false,
    stdinCommandLoopImplemented: false,
    replayCommandImplemented: false,
    stdoutOwnerBeforeRuntime: "current finite TypeScript dry-run CLI renderer",
    stdoutOwnerForFutureRuntime: "Rust host",
    stderrOwnerBeforeRuntime: "current finite TypeScript dry-run CLI diagnostics",
    stderrOwnerForFutureRuntime: "Rust host",
    stdoutReservedFor: "validated LF-delimited session-event JSONL",
    stderrReservedFor: "redacted diagnostics, never session-event JSONL"
  });

  assert.deepEqual(report.phase40CInventory.stdoutJsonlPolicy, {
    utf8Only: true,
    lfOnly: true,
    crlfAllowed: false,
    blankLinesAllowed: false,
    finalLfRequiredForCompleteStreams: true,
    oneJsonObjectPerLine: true,
    validatesSessionEventSchema: true,
    contiguousSequencesRequired: true,
    duplicateEventIdsAllowed: false,
    partialFramesAreInvalid: true
  });

  assert.deepEqual(report.phase40CInventory.stderrDiagnosticPolicy, {
    diagnosticsOnly: true,
    sessionEventsAllowedOnStderr: false,
    oneDiagnosticRecordPerLineBeforeRuntime: true,
    deterministicSeverityRequiredBeforeRuntime: true,
    deterministicCodeOrCategoryRequiredBeforeRuntime: true,
    redactionRequiredBeforeLiveRuntime: true,
    currentDryRunDiagnosticsArePlainText: true
  });

  assert.deepEqual(report.phase40CInventory.transportFailurePolicy, {
    backpressurePolicyImplemented: false,
    backpressureMustBeDefinedBeforeRuntime: true,
    partialWriteRecoveryImplemented: false,
    droppedLinesInvalidateTranscript: true,
    duplicateLinesInvalidateTranscript: true,
    outOfOrderLinesInvalidateTranscript: true,
    malformedLinesInvalidateTranscript: true,
    hostMustNotSynthesizeMissingEvents: true,
    processExitSemanticsDocumented: true
  });

  assert.deepEqual(report.phase40CInventory.redactionPolicy, {
    documentSection: "Stderr Redaction Policy",
    safeDiagnosticsToday: [
      "usage-errors",
      "unknown-or-duplicate-options",
      "local-path-policy-labels",
      "unreadable-local-files",
      "json-parse-summaries",
      "schema-validation-summaries"
    ],
    mustRedactBeforeRuntime: [
      "secrets",
      "production-signing-keys",
      "tokens-and-credentials",
      "local-absolute-paths",
      "environment-variables",
      "stack-traces",
      "raw-json-parse-excerpts",
      "schema-validation-values"
    ],
    liveSecretHandlingImplemented: false
  });

  assert.deepEqual(report.phase40CInventory.replayDesign, {
    documentSection: "Transcript Persistence And Replay Design",
    implementationStatus: "proposal-only",
    preferredReplayInput: "normalized ardyn.session-transcript JSON",
    rawJsonlCaptureRole: "forensic-source-only",
    compatibleWithExistingTranscriptValidation: true,
    futureCliProposalOnly: [
      "ardyn replay-session-transcript --file <session-transcript.json> --summary",
      "ardyn replay-session-transcript --file <session-transcript.json> --explain"
    ],
    liveReplayImplemented: false,
    transcriptPersistenceImplemented: false
  });

  assert.deepEqual(report.phase40CInventory.ownershipSplit, {
    futureRustHostOwns: [
      "stdout-stderr-policy",
      "buffering-flushing-backpressure",
      "partial-write-handling",
      "process-exit-semantics",
      "transport-failure-audit-records",
      "diagnostic-redaction-enforcement"
    ],
    typeScriptCoreOwns: [
      "manifest-validation",
      "task-validation",
      "non-executing-planning-data",
      "session-event-construction",
      "session-event-schema-validation",
      "normalized-transcript-validation",
      "diagnostic-classification-inputs"
    ]
  });

  assert.deepEqual(
    report.phase40CInventory.docs.map(({ path, status }) => [path, status]),
    [
      ["docs/phase-4-0c-pre-runtime-transport-policy.md", "present"],
      ["docs/phase-4-stdio-dry-run-event-emission.md", "present"],
      ["docs/session-events-stdio-contract.md", "present"],
      ["docs/host-policy-preconditions.md", "present"],
      ["README.md", "present"],
      ["apps/cli/README.md", "present"],
      ["packages/core/README.md", "present"],
      ["docs/architecture.md", "present"],
      ["crates/ardyn-host/README.md", "present"]
    ]
  );

  assert.deepEqual(
    report.phase40CInventory.tests.map(({ path, status }) => [path, status]),
    [
      ["tests/phase4-0c-transport-policy.test.mjs", "present"],
      ["tests/report-phase-status.test.mjs", "present"],
      ["tests/host-policy-preconditions.test.mjs", "present"]
    ]
  );

  assert.deepEqual(report.phase40CInventory.safetyPosture, {
    nonExecuting: true,
    noLiveStdioRuntime: true,
    noStdinCommandLoop: true,
    noListener: true,
    noServer: true,
    noSubprocessSpawning: true,
    noAdapterCalls: true,
    noLocusRuntimeDependency: true,
    noMcpCalls: true,
    noOpenClawCalls: true,
    noPluginExecution: true,
    noContentFabricDownloadInstallEnable: true,
    noSecrets: true,
    noProductionSigningKeys: true,
    noTranscriptPersistenceReplayRuntime: true,
    noWebSocketHttpControlSurface: true
  });
});

test("report inventories Phase 4.0D Rust-host transport policy contracts", async () => {
  const report = await runReport();

  assert.deepEqual(report.phase40DInventory.rustHostPolicyContract, {
    document: "docs/phase-4-0d-rust-host-transport-policy-contracts.md",
    source: "crates/ardyn-host/src/lib.rs",
    exportedHelper: "stdio_transport_policy_contract",
    status: "policy-only-pre-runtime",
    derivedFromPhase: "4.0C",
    runtimeImplementationActive: false,
    activeRuntimeEnforcement: false,
    liveStdioRuntimeImplemented: false,
    stdioOwnershipImplementationActive: false,
    replayRuntimeImplemented: false,
    transcriptPersistenceImplemented: false,
    secretHandlingImplemented: false
  });

  assert.deepEqual(report.phase40DInventory.contractTypes, [
    "PolicyImplementationStatus",
    "StdioPolicyOwner",
    "StdioStreamPurpose",
    "StdioLineEnding",
    "StdioCommitUnit",
    "StdioTransportFailureAction",
    "StdioLineFailureKind",
    "StderrDiagnosticClass",
    "RedactionSubject",
    "TranscriptReplayInputPreference",
    "RawJsonlCaptureRole",
    "StdioStreamOwnershipPolicy",
    "StdioJsonlFramingPolicy",
    "StderrDiagnosticPolicy",
    "StderrRedactionPolicy",
    "BackpressurePolicy",
    "PartialWritePolicy",
    "LineIntegrityFailureRule",
    "LineIntegrityPolicy",
    "ExitSemanticsPolicy",
    "TranscriptReplayReadinessPolicy",
    "RuntimeSafetyPolicyFlags",
    "StdioTransportPolicyContract"
  ]);

  assert.deepEqual(report.phase40DInventory.helpers, [
    "stdio_transport_policy_contract",
    "StdioTransportPolicyContract::is_pre_runtime_fail_closed",
    "RuntimeSafetyPolicyFlags::all_runtime_flags_disabled"
  ]);

  assert.deepEqual(report.phase40DInventory.modeledPolicies, {
    stdoutOwnership: true,
    stderrOwnership: true,
    jsonlFraming: true,
    stderrDiagnostics: true,
    stderrRedaction: true,
    backpressure: true,
    partialWrite: true,
    droppedLine: true,
    duplicateLine: true,
    outOfOrderLine: true,
    malformedLine: true,
    exitSemantics: true,
    transcriptReplayReadiness: true
  });

  assert.deepEqual(report.phase40DInventory.defaults, {
    implementationStatus: "policy-only-pre-runtime",
    runtimeImplementationActive: false,
    stdoutCurrentOwner: "typescript-dry-run-cli",
    stdoutFutureRuntimeOwner: "rust-host",
    stdoutReservedFor: "validated-session-event-jsonl-only",
    stderrCurrentOwner: "typescript-dry-run-cli",
    stderrFutureRuntimeOwner: "rust-host",
    stderrReservedFor: "redacted-diagnostics-only",
    jsonlLineEnding: "lf-only",
    finalLfRequiredForCompleteStreams: true,
    crlfAllowed: false,
    blankLinesAllowed: false,
    partialFramesAreEvents: false,
    duplicateEventIdsAllowed: false,
    redactionEnforcementActive: false,
    redactionRequiredBeforeRuntime: true,
    backpressureImplementationActive: false,
    partialWriteImplementationActive: false,
    transcriptReplayImplementationStatus: "policy-only-pre-runtime",
    transcriptPersistenceImplemented: false,
    replayRuntimeImplemented: false
  });

  assert.deepEqual(report.phase40DInventory.failClosedChecks, {
    defaultContractPasses: true,
    allRuntimeFlagsDisabled: true,
    liveStdioRuntimeMutationRejected: true,
    stdoutImplementationMutationRejected: true,
    partialFrameMutationRejected: true,
    duplicateLineRecoveryMutationRejected: true,
    replayRuntimeMutationRejected: true
  });

  assert.deepEqual(
    report.phase40DInventory.docs.map(({ path, status }) => [path, status]),
    [
      ["docs/phase-4-0d-rust-host-transport-policy-contracts.md", "present"],
      ["docs/phase-4-0c-pre-runtime-transport-policy.md", "present"],
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
    report.phase40DInventory.tests.map(({ path, status }) => [path, status]),
    [
      ["crates/ardyn-host/src/lib.rs", "present"],
      ["tests/phase4-0d-rust-host-policy-contracts.test.mjs", "present"],
      ["tests/report-phase-status.test.mjs", "present"]
    ]
  );

  assert.deepEqual(report.phase40DInventory.safetyPosture, {
    nonExecuting: true,
    noLiveStdioRuntime: true,
    noStdinCommandLoop: true,
    noLiveStdioReader: true,
    noListener: true,
    noServer: true,
    noSubprocessSpawning: true,
    noAdapterCalls: true,
    noLocusRuntimeDependency: true,
    noMcpCalls: true,
    noOpenClawCalls: true,
    noPluginExecution: true,
    noContentFabricRuntimeBehavior: true,
    noTranscriptPersistenceReplayRuntime: true,
    noWebSocketHttpControlSurface: true,
    noSecrets: true,
    noProductionSigningKeys: true
  });
});

test("report inventories Phase 4.0E Rust-host policy metadata export", async () => {
  const report = await runReport();

  assert.deepEqual(report.phase40EInventory.policyMetadata, {
    document: "docs/phase-4-0e-rust-host-policy-metadata.md",
    source: "crates/ardyn-host/src/lib.rs",
    fixture: "tests/fixtures/host-policy/phase4-0e-stdio-transport-policy-metadata.json",
    schema: "ardyn.stdio-transport-policy-metadata",
    schemaVersion: "0.1.0",
    metadataPhase: "phase-4.0e-rust-host-policy-metadata",
    contractPhase: "phase-4.0d-rust-host-transport-policy-contracts",
    exportStatus: "review-export-only",
    runtimeStatus: "pre-runtime-policy-only",
    reviewOnly: true,
    activeRuntimeEnforcement: false,
    liveRuntimeBehaviorIntroduced: false
  });

  assert.deepEqual(report.phase40EInventory.jsonExport, {
    helper: "stdio_transport_policy_metadata_json",
    serializer: "serde_json::to_string_pretty",
    format: "pretty-json-lf-terminated",
    finalLfRequired: true,
    crlfAllowed: false,
    parseRejectsCr: true,
    digestHelper: "stdio_transport_policy_metadata_digest_hex",
    digestAlgorithm: "sha256",
    writesFiles: false,
    cliCommandAdded: false
  });

  assert.deepEqual(report.phase40EInventory.futureHostPolicyReviewRecordMapping, {
    mappingStruct: "HostPolicyReviewRecordMapping",
    recordStruct: "HostPolicyReviewRecord",
    mappingHelper: "host_policy_review_record_for_stdio_transport_policy_metadata",
    validationHelper: "validate_host_policy_review_record",
    recordSchema: "ardyn.host-policy-review-record",
    recordSchemaVersion: "0.1.0",
    reviewedPhase: "4.0E",
    policyContractSchema: "ardyn.stdio-transport-policy-metadata",
    policyContractVersion: "0.1.0",
    policyDigestAlgorithm: "sha256",
    runtimeStatus: "pre-runtime-policy-only",
    decisionStatusDefault: "review-pending",
    approvalRecordedDefault: false,
    rejectionRecordedDefault: false,
    reviewMetadataOnlyDefault: true,
    approvalFieldsReviewMetadataOnly: true,
    approvalRuntimeEffectAllowed: false,
    rejectionRuntimeEffectAllowed: false
  });

  assert.deepEqual(report.phase40EInventory.negativeDeserializationCoverage, {
    unknownVersion: true,
    missingRequiredFields: true,
    invalidStdoutOwnershipValue: true,
    invalidStderrOwnershipValue: true,
    permissiveLiveRuntimeMode: true,
    malformedRedactionPolicy: true,
    malformedLineIntegrityPolicy: true,
    malformedExitSemantics: true,
    crlfJsonRejected: true,
    unknownFieldsRejected: true
  });

  assert.deepEqual(report.phase40EInventory.nonExecutionInvariants, [
    "no-live-stdio-runtime",
    "no-stdin-command-loop",
    "no-live-stdio-reader",
    "no-listener",
    "no-server",
    "no-subprocess-spawning",
    "no-adapter-calls",
    "no-locus-runtime-dependency",
    "no-mcp-calls",
    "no-openclaw-calls",
    "no-plugin-execution",
    "no-content-fabric-runtime-behavior",
    "no-autonomous-loop",
    "no-secret-handling",
    "no-production-signing-keys",
    "no-transcript-persistence-replay-runtime",
    "no-websocket-http-control-surface",
    "no-runtime-execution-behavior"
  ]);

  assert.deepEqual(
    report.phase40EInventory.docs.map(({ path, status }) => [path, status]),
    [
      ["docs/phase-4-0e-rust-host-policy-metadata.md", "present"],
      ["docs/phase-4-0d-rust-host-transport-policy-contracts.md", "present"],
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
    report.phase40EInventory.tests.map(({ path, status }) => [path, status]),
    [
      ["crates/ardyn-host/src/lib.rs", "present"],
      ["tests/fixtures/host-policy/phase4-0e-stdio-transport-policy-metadata.json", "present"],
      ["tests/phase4-0e-policy-metadata.test.mjs", "present"],
      ["tests/report-phase-status.test.mjs", "present"]
    ]
  );

  assert.deepEqual(report.phase40EInventory.safetyPosture, {
    nonExecuting: true,
    noLiveStdioRuntime: true,
    noStdinCommandLoop: true,
    noLiveStdioReader: true,
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
    noTranscriptPersistenceReplayRuntime: true,
    noWebSocketHttpControlSurface: true,
    noSecrets: true,
    noProductionSigningKeys: true,
    noCliCommandAdded: true,
    noFileWriterAdded: true
  });
});

test("report inventories Phase 4.0F host-policy review records", async () => {
  const report = await runReport();

  assert.deepEqual(report.phase40FInventory.reviewRecords, {
    document: "docs/phase-4-0f-host-policy-review-records.md",
    source: "crates/ardyn-host/src/lib.rs",
    schema: "ardyn.host-policy-review-record",
    schemaVersion: "0.1.0",
    recordPhase: "phase-4.0f-host-policy-review-records",
    reviewedPhase: "4.0E",
    policyMetadataSchema: "ardyn.stdio-transport-policy-metadata",
    policyMetadataVersion: "0.1.0",
    policyMetadataDigestAlgorithm: "sha256",
    currentPolicyMetadataDigestHex:
      "91e64ea2ec4b61ef4850501ba4d80d01af5e23def60dd893652bfaa0cd7b494a",
    runtimeStatus: "pre-runtime-policy-only",
    staticReviewArtifactOnly: true,
    grantsRuntimeApproval: false,
    activeRuntimeEnforcement: false,
    liveRuntimeBehaviorIntroduced: false
  });

  assert.deepEqual(report.phase40FInventory.compatibilityClassification, {
    enum: "HostPolicyReviewCompatibility",
    helper: "classify_host_policy_review_record_json",
    parserHelper: "parse_host_policy_review_record_json",
    validationHelper: "validate_host_policy_review_record",
    classes: [
      "compatible",
      "upgrade_available",
      "unsupported_major",
      "malformed",
      "rejected_policy"
    ],
    exactCurrentValidationRequiredForCompatible: true,
    tolerantSchemaVersionPrepass: true,
    unsupportedMajorFailClosed: true,
    malformedFailClosed: true,
    rejectedPolicyFailClosed: true,
    sameMajorFutureMinorInertMetadataOnly: true
  });

  assert.deepEqual(report.phase40FInventory.deterministicMapping, {
    mappingHelper: "host_policy_review_record_for_stdio_transport_policy_metadata",
    jsonHelper: "host_policy_review_record_json_for_stdio_transport_policy_metadata",
    rejectedPolicyHelper:
      "rejected_host_policy_review_record_for_stdio_transport_policy_metadata",
    serializer: "serde_json::to_string_pretty",
    format: "pretty-json-lf-terminated",
    finalLfRequired: true,
    crlfAllowed: false,
    writesFiles: false,
    cliCommandAdded: false
  });

  assert.deepEqual(report.phase40FInventory.decisionMetadata, {
    defaultStatus: "review-pending",
    approvedStatusAllowedAsInertMetadata: true,
    rejectedStatusAllowedAsInertMetadata: true,
    approvalRecordedDefault: false,
    rejectionRecordedDefault: false,
    reviewMetadataOnlyRequired: true,
    approvalRuntimeEffectAllowed: false,
    rejectionRuntimeEffectAllowed: false,
    reviewRecordDoesNotGrantRuntimeApproval: true
  });

  assert.deepEqual(
    report.phase40FInventory.fixtures.map(({ path, status }) => [path, status]),
    [
      ["tests/fixtures/host-policy/phase4-0f/current-host-policy-review-record.json", "present"],
      [
        "tests/fixtures/host-policy/phase4-0f/same-major-future-minor-host-policy-review-record.json",
        "present"
      ],
      ["tests/fixtures/host-policy/phase4-0f/unsupported-major-host-policy-review-record.json", "present"],
      [
        "tests/fixtures/host-policy/phase4-0f/malformed-missing-schema-version-host-policy-review-record.json",
        "present"
      ],
      [
        "tests/fixtures/host-policy/phase4-0f/malformed-missing-policy-digest-host-policy-review-record.json",
        "present"
      ],
      [
        "tests/fixtures/host-policy/phase4-0f/malformed-permissive-approval-runtime-effect-host-policy-review-record.json",
        "present"
      ],
      [
        "tests/fixtures/host-policy/phase4-0f/rejected-permissive-policy-host-policy-review-record.json",
        "present"
      ]
    ]
  );

  assert.deepEqual(report.phase40FInventory.negativeCoverage, {
    unsupportedMajorClassifiedFailClosed: true,
    malformedMissingRequiredFieldsClassifiedFailClosed: true,
    missingPolicyDigestRejected: true,
    permissiveApprovalRuntimeEffectRejected: true,
    permissivePolicyMetadataRejectedPolicy: true,
    approvalFieldsRuntimeEffectRejected: true,
    crlfJsonRejected: true,
    unknownFieldsRejectedForExactCurrentRecords: true
  });

  assert.deepEqual(report.phase40FInventory.nonExecutionInvariants, [
    "no-live-stdio-runtime",
    "no-stdin-command-loop",
    "no-live-stdio-reader",
    "no-listener",
    "no-server",
    "no-subprocess-spawning",
    "no-adapter-calls",
    "no-locus-runtime-dependency",
    "no-mcp-calls",
    "no-openclaw-calls",
    "no-plugin-execution",
    "no-content-fabric-runtime-behavior",
    "no-autonomous-loop",
    "no-secret-handling",
    "no-production-signing-keys",
    "no-transcript-persistence-replay-runtime",
    "no-websocket-http-control-surface",
    "no-runtime-execution-behavior"
  ]);

  assert.deepEqual(
    report.phase40FInventory.docs.map(({ path, status }) => [path, status]),
    [
      ["docs/phase-4-0f-host-policy-review-records.md", "present"],
      ["docs/phase-4-0e-rust-host-policy-metadata.md", "present"],
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
    report.phase40FInventory.tests.map(({ path, status }) => [path, status]),
    [
      ["crates/ardyn-host/src/lib.rs", "present"],
      [
        "tests/fixtures/host-policy/phase4-0f/current-host-policy-review-record.json",
        "present"
      ],
      ["tests/phase4-0f-host-policy-review-records.test.mjs", "present"],
      ["tests/report-phase-status.test.mjs", "present"]
    ]
  );

  assert.deepEqual(report.phase40FInventory.safetyPosture, {
    nonExecuting: true,
    noLiveStdioRuntime: true,
    noStdinCommandLoop: true,
    noLiveStdioReader: true,
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
    noTranscriptPersistenceReplayRuntime: true,
    noWebSocketHttpControlSurface: true,
    noSecrets: true,
    noProductionSigningKeys: true,
    noRuntimeApprovalGrant: true,
    noCliCommandAdded: true,
    noFileWriterAdded: true
  });
});

test("report inventories Phase 4.0G host-policy review comparison", async () => {
  const report = await runReport();

  assert.deepEqual(report.phase40GInventory.hostPolicyReviewComparison, {
    document: "docs/phase-4-0g-host-policy-review-comparison.md",
    source: "packages/core/src/index.mjs",
    typeDeclarations: "packages/core/src/index.d.ts",
    schema: "ardyn.host-policy-review-record-comparison",
    schemaVersion: "0.1.0",
    comparisonPhase: "phase-4.0g-host-policy-review-comparison",
    artifactKind: "host_policy_review_record",
    helper: "compareHostPolicyReviewRecords",
    normalizationHelper: "normalizeHostPolicyReviewRecordForDisplay",
    displaySummaryHelper: "buildHostPolicyReviewRecordDisplaySummary",
    formatter: "formatHostPolicyReviewRecordComparisonJson",
    classifier: "classifyHostPolicyReviewRecordCompatibility",
    staticDisplayOnly: true,
    comparisonDoesNotGrantRuntimeApproval: true,
    approvalMetadataInert: true,
    rejectionMetadataInert: true,
    liveRuntimeBehaviorIntroduced: false,
    runtimeBehaviorIntroduced: false
  });

  assert.deepEqual(report.phase40GInventory.comparedFields, [
    "record kind",
    "record version",
    "reviewed phase",
    "policy contract version",
    "policy metadata schema",
    "policy metadata version",
    "policy metadata digest algorithm",
    "policy metadata digest hex",
    "runtime status",
    "non-execution invariant summary",
    "compatibility classification",
    "approval and rejection metadata",
    "warnings metadata",
    "errors metadata"
  ]);

  assert.deepEqual(report.phase40GInventory.compatibilityHandling, {
    exactCurrentCompatible: true,
    sameMajorUpgradeAvailableDisplayOnly: true,
    unsupportedMajorFailClosed: true,
    malformedFailClosed: true,
    rejectedPolicyFailClosed: true,
    digestMismatchFailClosedReviewEvidenceOnly: true,
    runtimeStatusMismatchFailClosed: true
  });

  assert.deepEqual(
    report.phase40GInventory.fixtureCoverage.map(({ path, status }) => [path, status]),
    [
      [
        "tests/fixtures/host-policy/phase4-0g/identical-current-host-policy-review-comparison.json",
        "present"
      ],
      [
        "tests/fixtures/host-policy/phase4-0g/same-major-future-minor-upgrade-available-host-policy-review-comparison.json",
        "present"
      ],
      [
        "tests/fixtures/host-policy/phase4-0g/unsupported-major-fail-closed-host-policy-review-comparison.json",
        "present"
      ],
      [
        "tests/fixtures/host-policy/phase4-0g/malformed-missing-schema-version-host-policy-review-comparison.json",
        "present"
      ],
      [
        "tests/fixtures/host-policy/phase4-0g/rejected-permissive-policy-host-policy-review-comparison.json",
        "present"
      ],
      [
        "tests/fixtures/host-policy/phase4-0g/policy-digest-mismatch-host-policy-review-comparison.json",
        "present"
      ],
      [
        "tests/fixtures/host-policy/phase4-0g/runtime-status-mismatch-host-policy-review-comparison.json",
        "present"
      ]
    ]
  );

  assert.deepEqual(report.phase40GInventory.cliCommandSurface, {
    commandAdded: false,
    finiteStaticOnly: true,
    stdoutPrinterAdded: false,
    fileWriterAdded: false,
    liveRuntimeCommandAdded: false,
    existingDryRunEmitterUnchanged: true
  });

  assert.deepEqual(
    report.phase40GInventory.docs.map(({ path, status }) => [path, status]),
    [
      ["docs/phase-4-0g-host-policy-review-comparison.md", "present"],
      ["docs/phase-4-0f-host-policy-review-records.md", "present"],
      ["docs/host-policy-preconditions.md", "present"],
      ["README.md", "present"],
      ["apps/cli/README.md", "present"],
      ["packages/core/README.md", "present"]
    ]
  );

  assert.deepEqual(
    report.phase40GInventory.tests.map(({ path, status }) => [path, status]),
    [
      ["tests/phase4-0g-host-policy-review-comparison.test.mjs", "present"],
      ["tests/report-phase-status.test.mjs", "present"]
    ]
  );

  assert.deepEqual(report.phase40GInventory.invariantProbes, [
    "missing --dry-run",
    "unknown emit-session-events arg",
    "unsafe manifest URL",
    "invalid JSON manifest",
    "invalid JSON task",
    "replay-session-transcript",
    "policy-metadata",
    "host-policy-export",
    "serve-runtime",
    "stdio-runtime"
  ]);

  assert.deepEqual(report.phase40GInventory.safetyPosture, {
    nonExecuting: true,
    noLiveStdioRuntime: true,
    noStdinCommandLoop: true,
    noLiveStdioReader: true,
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
    noTranscriptPersistenceReplayRuntime: true,
    noWebSocketHttpControlSurface: true,
    noSecrets: true,
    noProductionSigningKeys: true,
    noRuntimeApprovalGrant: true,
    noCliCommandAdded: true,
    noFileWriterAdded: true
  });
});

test("report inventories Phase 4.0H reviewer handoff index", async () => {
  const report = await runReport();

  assert.deepEqual(report.phase40HInventory.reviewerHandoffIndex, {
    document: "docs/phase-4-0h-reviewer-handoff-index.md",
    metadataFixture: "tests/fixtures/host-policy/phase4-0h/reviewer-handoff-index.json",
    schema: "ardyn.phase-4-reviewer-handoff-index",
    schemaVersion: "0.1.0",
    indexPhase: "phase-4.0h-reviewer-handoff-index",
    phaseIntroduced: "4.0H",
    artifactKind: "phase_4_reviewer_handoff_index",
    reviewRange: {
      fromPhase: "4.0A",
      throughPhase: "4.0H"
    },
    runtimeStatus: "static-reviewer-index-only",
    artifactCount: 37,
    staticIndexOnly: true,
    reviewOnly: true,
    nonExecuting: true,
    reviewMetadataOnly: true,
    grantsRuntimeApproval: false,
    runtimeBehaviorIntroduced: false,
    liveRuntimeBehaviorIntroduced: false
  });

  assert.deepEqual(report.phase40HInventory.roleBoundaries, {
    authoritativeRoles: ["normative-doc", "source-evidence"],
    evidenceOnlyRoles: [
      "test-evidence",
      "fixture-evidence",
      "display-only-evidence",
      "metadata-index"
    ],
    normativeDocsAreAuthoritative: true,
    sourceEvidenceIsAuthoritativeForStaticContractSurface: true,
    fixturesAreEvidenceOnly: true,
    testsAreEvidenceOnly: true,
    comparisonArtifactsAreDisplayOnly: true,
    metadataIndexIsNavigationOnly: true,
    indexDoesNotOverrideNormativeDocs: true
  });

  assert.deepEqual(report.phase40HInventory.phaseCoverage, [
    "4.0A",
    "4.0B",
    "4.0C",
    "4.0D",
    "4.0E",
    "4.0F",
    "4.0G",
    "4.0H"
  ]);
  assert.equal(report.phase40HInventory.indexedArtifacts.length, 37);
  assert.deepEqual(report.phase40HInventory.artifactRoleCounts, {
    normativeDocs: 8,
    sourceEvidence: 1,
    testEvidence: 10,
    fixtureEvidence: 9,
    displayOnlyEvidence: 7,
    metadataIndex: 2
  });

  assert.deepEqual(report.phase40HInventory.comparisonAndReviewArtifactPosture, {
    reviewRecordFixturesStaticOnly: true,
    comparisonFixturesDisplayOnly: true,
    reviewRecordsGrantRuntimeApproval: false,
    comparisonsGrantRuntimeApproval: false,
    metadataIndexGrantsRuntimeApproval: false,
    futureLiveRuntimeBlockedUntilSeparateApprovedPhase: true
  });

  assert.deepEqual(report.phase40HInventory.cliCommandSurface, {
    commandAdded: false,
    reviewerIndexCommandAdded: false,
    policyIndexCommandAdded: false,
    finiteStaticOnly: true,
    stdoutPrinterAdded: false,
    fileWriterAdded: false,
    liveRuntimeCommandAdded: false,
    existingDryRunEmitterUnchanged: true
  });

  assert.deepEqual(
    report.phase40HInventory.docs.map(({ path, status }) => [path, status]),
    [
      ["docs/phase-4-0h-reviewer-handoff-index.md", "present"],
      ["docs/phase-4-0g-host-policy-review-comparison.md", "present"],
      ["docs/phase-4-stdio-dry-run-event-emission.md", "present"],
      ["docs/session-events-stdio-contract.md", "present"],
      ["docs/host-policy-preconditions.md", "present"],
      ["docs/architecture.md", "present"],
      ["README.md", "present"],
      ["apps/cli/README.md", "present"],
      ["packages/core/README.md", "present"]
    ]
  );

  assert.deepEqual(report.phase40HInventory.fixtures, [
    {
      path: "tests/fixtures/host-policy/phase4-0h/reviewer-handoff-index.json",
      status: "present"
    }
  ]);

  assert.deepEqual(
    report.phase40HInventory.tests.map(({ path, status }) => [path, status]),
    [
      ["tests/phase4-0h-reviewer-handoff-index.test.mjs", "present"],
      ["tests/report-phase-status.test.mjs", "present"]
    ]
  );

  assert.deepEqual(report.phase40HInventory.invariantProbes, [
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
    "host-policy-index",
    "policy-index",
    "review-index",
    "index-host-policy"
  ]);

  assert.deepEqual(report.phase40HInventory.safetyPosture, {
    nonExecuting: true,
    staticIndexOnly: true,
    reviewOnly: true,
    noLiveStdioRuntime: true,
    noStdinCommandLoop: true,
    noLiveStdioReader: true,
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
    noTranscriptPersistenceReplayRuntime: true,
    noWebSocketHttpControlSurface: true,
    noSecrets: true,
    noProductionSigningKeys: true,
    noRuntimeApprovalGrant: true,
    noCliCommandAdded: true,
    noFileWriterAdded: true,
    noStdoutPrinterAdded: true,
    noRuntimeBehaviorIntroduced: true
  });
});

test("report inventories Phase 4.0I final pre-runtime readiness", async () => {
  const report = await runReport();

  assert.deepEqual(report.phase40IInventory.finalPreRuntimeReadiness, {
    document: "docs/phase-4-0i-final-pre-runtime-readiness.md",
    metadataFixture: "tests/fixtures/host-policy/phase4-0i/final-pre-runtime-readiness.json",
    schema: "ardyn.phase-4-final-pre-runtime-readiness",
    schemaVersion: "0.1.0",
    readinessPhase: "phase-4.0i-final-pre-runtime-readiness",
    phaseIntroduced: "4.0I",
    artifactKind: "phase_4_final_pre_runtime_readiness_bundle",
    reviewedStartingSha: "d0a8530e4c43991e79fddabdc49212f2c1a6a5f6",
    reviewRange: {
      fromPhase: "4.0A",
      throughPhase: "4.0I"
    },
    runtimeStatus: "final-pre-runtime-readiness-only",
    readinessStatus: "pre-runtime-evidence-ready-for-separate-phase-4.1-review",
    artifactCount: 40,
    checklistCount: 11,
    invariantCount: 17,
    finalPreRuntimeReadinessOnly: true,
    reviewOnly: true,
    nonExecuting: true,
    reviewMetadataOnly: true,
    grantsRuntimeApproval: false,
    runtimeBehaviorIntroduced: false,
    liveRuntimeBehaviorIntroduced: false,
    phase41Implemented: false,
    requiresSeparatePhase41Approval: true,
    phase41BlockedUnlessSeparatelyApproved: true
  });

  assert.deepEqual(report.phase40IInventory.devinMilestoneReview, {
    fromPhase: "4.0A",
    throughPhase: "4.0H",
    reviewer: "Devin",
    verdict: "PASS",
    reviewSummary:
      "Phase 4.0A through Phase 4.0H was reviewed as coherent, reviewable, and non-executing with no blockers before a separately approved Phase 4.1.",
    fullAuditCopied: false
  });

  assert.deepEqual(report.phase40IInventory.basedOnReviewerHandoffIndex, {
    document: "docs/phase-4-0h-reviewer-handoff-index.md",
    metadataFixture: "tests/fixtures/host-policy/phase4-0h/reviewer-handoff-index.json"
  });

  assert.deepEqual(report.phase40IInventory.phaseCoverage, [
    "4.0A",
    "4.0B",
    "4.0C",
    "4.0D",
    "4.0E",
    "4.0F",
    "4.0G",
    "4.0H",
    "4.0I"
  ]);
  assert.equal(report.phase40IInventory.phaseMilestones.length, 9);
  assert.equal(report.phase40IInventory.phaseMilestones.at(-1).runtimeStatus, "final-pre-runtime-readiness-only");

  assert.deepEqual(
    report.phase40IInventory.readinessChecklist.map((item) => item.id),
    phase40IChecklistIds
  );
  for (const checklistItem of report.phase40IInventory.readinessChecklist) {
    assert.equal(checklistItem.grantsRuntimeApproval, false, checklistItem.id);
    assert.equal(checklistItem.runtimeBehaviorIntroduced, false, checklistItem.id);
    assert.equal(checklistItem.phase41ApprovalRequired, true, checklistItem.id);
  }

  assert.deepEqual(
    report.phase40IInventory.nonExecutionInvariantMatrix.map((item) => item.id),
    phase40IInvariantIds
  );
  for (const invariant of report.phase40IInventory.nonExecutionInvariantMatrix) {
    assert.equal(invariant.status, "confirmed", invariant.id);
    assert.equal(invariant.grantsRuntimeApproval, false, invariant.id);
    assert.equal(invariant.runtimeBehaviorIntroduced, false, invariant.id);
  }

  assert.equal(report.phase40IInventory.representedArtifacts.length, 40);
  assert.deepEqual(report.phase40IInventory.representedArtifactCounts, {
    total: 40,
    upstreamReviewerIndexArtifacts: 37,
    phase40IArtifacts: 3
  });

  assert.deepEqual(report.phase40IInventory.cliCommandSurface, {
    commandAdded: false,
    readinessCommandAdded: false,
    finalReadinessCommandAdded: false,
    phase41RuntimeCommandAdded: false,
    stdoutPrinterAdded: false,
    fileWriterAdded: false,
    liveRuntimeCommandAdded: false,
    existingDryRunEmitterUnchanged: true
  });

  assert.deepEqual(report.phase40IInventory.phase41Boundary, {
    implemented: false,
    runtimeApprovalGranted: false,
    separateApprovalRequired: true,
    blockedUnlessSeparatelyApproved: true,
    thisPhaseCanGrantApproval: false,
    liveRuntimeStillBlocked: true
  });

  assert.deepEqual(
    report.phase40IInventory.docs.map(({ path, status }) => [path, status]),
    [
      ["docs/phase-4-0i-final-pre-runtime-readiness.md", "present"],
      ["docs/phase-4-0h-reviewer-handoff-index.md", "present"],
      ["docs/phase-4-stdio-dry-run-event-emission.md", "present"],
      ["docs/session-events-stdio-contract.md", "present"],
      ["docs/host-policy-preconditions.md", "present"],
      ["docs/architecture.md", "present"],
      ["README.md", "present"],
      ["apps/cli/README.md", "present"],
      ["packages/core/README.md", "present"]
    ]
  );

  assert.deepEqual(report.phase40IInventory.fixtures, [
    {
      path: "tests/fixtures/host-policy/phase4-0i/final-pre-runtime-readiness.json",
      status: "present"
    },
    {
      path: "tests/fixtures/host-policy/phase4-0h/reviewer-handoff-index.json",
      status: "present"
    }
  ]);

  assert.deepEqual(
    report.phase40IInventory.tests.map(({ path, status }) => [path, status]),
    [
      ["tests/phase4-0i-final-pre-runtime-readiness.test.mjs", "present"],
      ["tests/phase4-0h-reviewer-handoff-index.test.mjs", "present"],
      ["tests/report-phase-status.test.mjs", "present"]
    ]
  );

  assert.deepEqual(report.phase40IInventory.invariantProbes, [
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

  assert.deepEqual(report.phase40IInventory.safetyPosture, {
    nonExecuting: true,
    finalPreRuntimeReadinessOnly: true,
    reviewOnly: true,
    noLiveStdioRuntime: true,
    noStdinCommandLoop: true,
    noLiveStdioReader: true,
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
    noWebSocketHttpControlSurface: true,
    noSecrets: true,
    noProductionSigningKeys: true,
    noRuntimeApprovalGrant: true,
    noPhase41Implementation: true,
    requiresSeparatePhase41Approval: true,
    noCliCommandAdded: true,
    noFileWriterAdded: true,
    noStdoutPrinterAdded: true,
    noRuntimeBehaviorIntroduced: true
  });
});

test("report inventories Phase 4.1 runtime proposal without implementing runtime", async () => {
  const report = await runReport();

  assert.deepEqual(report.phase41ProposalInventory.runtimeProposal, {
    document: "docs/phase-4-1-runtime-proposal.md",
    metadataFixture: "tests/fixtures/host-policy/phase4-1/runtime-proposal.json",
    schema: "ardyn.phase-4-runtime-proposal",
    schemaVersion: "0.1.0",
    proposalPhase: "phase-4.1-runtime-proposal-only",
    phaseIntroduced: "4.1",
    artifactKind: "phase_4_runtime_proposal_only_bundle",
    reviewRange: {
      fromPhase: "4.0A",
      throughPhase: "4.1"
    },
    proposalStatus: "proposal-only-review-draft",
    runtimeStatus: "runtime-proposal-only",
    implementationStatus: "not-implemented",
    approvalStatus: "not-granted",
    roadmapStatus: "future-work-only",
    proposalOnly: true,
    reviewOnly: true,
    nonExecuting: true,
    reviewMetadataOnly: true,
    grantsRuntimeApproval: false,
    runtimeApprovalGranted: false,
    runtimeBehaviorIntroduced: false,
    liveRuntimeBehaviorIntroduced: false,
    phase41RuntimeImplemented: false,
    consumedByLiveHostLoop: false,
    requiresSeparateImplementationApproval: true,
    requiresSeparateRuntimeImplementationApproval: true
  });

  assert.deepEqual(report.phase41ProposalInventory.basedOnFinalReadiness, {
    document: "docs/phase-4-0i-final-pre-runtime-readiness.md",
    metadataFixture: "tests/fixtures/host-policy/phase4-0i/final-pre-runtime-readiness.json",
    finalReadinessCommit: "34ac1c3df105074bd5c2b1f04062e8d3da59204a"
  });
  assert.deepEqual(report.phase41ProposalInventory.devinReviewPolicy, {
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

  assert.equal(report.phase41ProposalInventory.approvalBoundary.status, "defined-not-granted");
  assert.equal(report.phase41ProposalInventory.approvalBoundary.grantsRuntimeApproval, false);
  assert.equal(report.phase41ProposalInventory.approvalBoundary.runtimeBehaviorIntroduced, false);
  assert.deepEqual(report.phase41ProposalInventory.phaseCoverage, [
    "4.0A",
    "4.0B",
    "4.0C",
    "4.0D",
    "4.0E",
    "4.0F",
    "4.0G",
    "4.0H",
    "4.0I",
    "4.1"
  ]);
  assert.deepEqual(
    report.phase41ProposalInventory.proposalSections.map((section) => section.id),
    phase41ProposalSectionIds
  );
  assert.deepEqual(
    report.phase41ProposalInventory.requiredTestsBeforeRuntime.map((item) => item.id),
    phase41RequiredTestIds
  );
  assert.deepEqual(
    report.phase41ProposalInventory.implementationRoadmap.map((item) => item.id),
    phase41RoadmapIds
  );
  for (const section of report.phase41ProposalInventory.proposalSections) {
    assert.equal(section.proposalOnly, true, section.id);
    assert.equal(section.grantsRuntimeApproval, false, section.id);
    assert.equal(section.runtimeBehaviorIntroduced, false, section.id);
  }
  for (const item of report.phase41ProposalInventory.requiredTestsBeforeRuntime) {
    assert.equal(item.blocksRuntimeUntilPresent, true, item.id);
    assert.equal(item.proposalOnly, true, item.id);
    assert.equal(item.grantsRuntimeApproval, false, item.id);
  }
  for (const item of report.phase41ProposalInventory.implementationRoadmap) {
    assert.equal(item.implementationInThisPhase, false, item.id);
    assert.equal(item.requiresSeparateApproval, true, item.id);
    assert.equal(item.grantsRuntimeApproval, false, item.id);
  }
  assert.equal(report.phase41ProposalInventory.implementationRoadmap.at(-1).requiresDevinReview, true);

  assert.deepEqual(report.phase41ProposalInventory.representedArtifactCounts, {
    total: 43,
    upstreamFinalReadinessArtifacts: 40,
    phase41ProposalArtifacts: 3
  });
  assert.deepEqual(
    report.phase41ProposalInventory.proposalArtifacts.map((artifact) => artifact.path),
    [
      "docs/phase-4-1-runtime-proposal.md",
      "tests/fixtures/host-policy/phase4-1/runtime-proposal.json",
      "tests/phase4-1-runtime-proposal.test.mjs"
    ]
  );

  assert.deepEqual(report.phase41ProposalInventory.cliCommandSurface, {
    commandAdded: false,
    runtimeProposalCommandAdded: false,
    phase41RuntimeCommandAdded: false,
    serveRuntimeCommandAdded: false,
    stdioRuntimeCommandAdded: false,
    transcriptReplayCommandAdded: false,
    stdoutPrinterAdded: false,
    fileWriterAdded: false,
    liveRuntimeCommandAdded: false,
    existingDryRunEmitterUnchanged: true
  });
  assert.deepEqual(report.phase41ProposalInventory.apiSurface, {
    typescriptCoreRuntimeApiAdded: false,
    rustRuntimeHelperAdded: false,
    rustStdioOwnerAdded: false,
    hostPolicyEnforcementAdded: false,
    transcriptReplayRuntimeAdded: false
  });
  assert.deepEqual(
    report.phase41ProposalInventory.docs.map(({ path, status }) => [path, status]),
    [
      ["docs/phase-4-1-runtime-proposal.md", "present"],
      ["docs/phase-4-0i-final-pre-runtime-readiness.md", "present"],
      ["docs/phase-4-stdio-dry-run-event-emission.md", "present"],
      ["docs/session-events-stdio-contract.md", "present"],
      ["docs/host-policy-preconditions.md", "present"],
      ["docs/architecture.md", "present"],
      ["README.md", "present"],
      ["apps/cli/README.md", "present"],
      ["packages/core/README.md", "present"]
    ]
  );
  assert.deepEqual(report.phase41ProposalInventory.fixtures, [
    {
      path: "tests/fixtures/host-policy/phase4-1/runtime-proposal.json",
      status: "present"
    },
    {
      path: "tests/fixtures/host-policy/phase4-0i/final-pre-runtime-readiness.json",
      status: "present"
    }
  ]);
  assert.deepEqual(
    report.phase41ProposalInventory.tests.map(({ path, status }) => [path, status]),
    [
      ["tests/phase4-1-runtime-proposal.test.mjs", "present"],
      ["tests/phase4-0i-final-pre-runtime-readiness.test.mjs", "present"],
      ["tests/report-phase-status.test.mjs", "present"]
    ]
  );
  assert.deepEqual(report.phase41ProposalInventory.safetyPosture, {
    nonExecuting: true,
    proposalOnly: true,
    reviewOnly: true,
    noLiveStdioRuntime: true,
    noStdinCommandLoop: true,
    noLiveStdioReader: true,
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
    noWebSocketHttpControlSurface: true,
    noSecrets: true,
    noProductionSigningKeys: true,
    noRuntimeApprovalGrant: true,
    noPhase41RuntimeImplementation: true,
    requiresSeparateRuntimeImplementationApproval: true,
    noCliCommandAdded: true,
    noFileWriterAdded: true,
    noStdoutPrinterAdded: true,
    noRuntimeBehaviorIntroduced: true
  });
});

test("report inventories Phase 4.1A host-policy approval records without enabling runtime", async () => {
  const report = await runReport();
  const inventory = report.phase41AApprovalRecordInventory;

  assert.deepEqual(inventory.hostPolicyApprovalRecords, {
    document: "docs/phase-4-1a-host-policy-approval-records.md",
    source: "crates/ardyn-host/src/lib.rs",
    schema: "ardyn.host-policy-approval-record",
    schemaVersion: "0.1.0",
    recordKind: "host-policy-approval-record",
    recordPhase: "phase-4.1a-host-policy-approval-records",
    reviewedPhase: "4.1A",
    runtimeCapabilityRequested: "live-stdio-runtime",
    approvalStatus: "review-approved",
    classification: "valid_review_record",
    currentRecordRuntimeStatement:
      "Current Phase 4.1A approval records are static review/audit artifacts only and do not enable runtime.",
    staticReviewArtifactOnly: true,
    operatorConsentNecessaryButNotSufficient: true,
    currentRecordEnablesRuntime: false,
    runtimeApprovalEffectAllowed: false,
    runtimeImplementationAvailable: false,
    runtimeCommandAvailable: false,
    grantsRuntimeApproval: false,
    runtimeApprovalGranted: false,
    runtimeBehaviorIntroduced: false,
    liveRuntimeBehaviorIntroduced: false,
    hostPolicyEnforcementActive: false,
    consumedByLiveHostLoop: false
  });

  assert.deepEqual(inventory.basedOnRuntimeProposal, {
    document: "docs/phase-4-1-runtime-proposal.md",
    metadataFixture: "tests/fixtures/host-policy/phase4-1/runtime-proposal.json",
    proposalPhase: "phase-4.1-runtime-proposal-only",
    approvalBoundaryId: "phase-4-1-live-runtime-approval-boundary",
    roadmapItem: "phase-4.1a-host-policy-approval-records",
    grantsRuntimeApproval: false,
    phase41RuntimeImplemented: false
  });
  assert.deepEqual(inventory.approvalRecordModel.classes, phase41AApprovalClassifications);
  assert.equal(inventory.approvalRecordModel.nonRuntimeReviewMetadataOnly, true);
  assert.deepEqual(inventory.operatorConsentDisplayFields.consentScope, phase41AConsentScope);
  assert.equal(inventory.operatorConsentDisplayFields.operatorConsentRuntimeEffectAllowed, false);
  assert.equal(
    inventory.operatorConsentDisplayFields.operatorConsentNecessaryButNotSufficient,
    true
  );
  assert.deepEqual(inventory.runtimeScopeNames.targetCommands, ["serve-runtime", "stdio-runtime"]);
  assert.equal(inventory.runtimeScopeNames.serveRuntimeAvailable, false);
  assert.equal(inventory.runtimeScopeNames.stdioRuntimeAvailable, false);
  assert.equal(inventory.runtimeScopeNames.requiresSeparateImplementationPhase, true);
  assert.equal(inventory.runtimeScopeNames.devinReviewRequiredBeforeEnablement, true);

  for (const reason of [
    "missing_operator_consent",
    "unsupported_schema_major",
    "malformed_record",
    "runtime_effect_flag_true",
    "runtime_not_available"
  ]) {
    assert.ok(inventory.denialReasonCatalog.includes(reason), reason);
  }

  assert.deepEqual(inventory.reviewOnlyDisplayBehavior, {
    approvalRecordsAreReviewAuditArtifactsOnly: true,
    operatorConsentNecessaryButNotSufficient: true,
    currentRecordsDoNotEnableRuntime: true,
    futureRuntimeRequiresSeparateApprovedImplementationPhase: true,
    preserveDevinReviewForMajorRuntimeReadinessCheckpoint: true,
    reportRunsChecks: false,
    writesFiles: false,
    printsStdoutFromCli: false,
    consumedByLiveHostLoop: false
  });
  assert.deepEqual(inventory.cliCommandSurface, {
    commandAdded: false,
    approvalRecordCommandAdded: false,
    operatorConsentCommandAdded: false,
    approveRuntimeCommandAdded: false,
    grantRuntimeCommandAdded: false,
    enableRuntimeCommandAdded: false,
    serveRuntimeCommandAdded: false,
    stdioRuntimeCommandAdded: false,
    stdoutPrinterAdded: false,
    fileWriterAdded: false,
    liveRuntimeCommandAdded: false,
    existingDryRunEmitterUnchanged: true
  });
  assert.deepEqual(inventory.apiSurface, {
    rustReviewOnlyTypesAdded: true,
    rustRuntimeHelperAdded: false,
    rustStdioOwnerAdded: false,
    typescriptCoreRuntimeApiAdded: false,
    hostPolicyEnforcementAdded: false,
    approvalEvaluatorAdded: false,
    transcriptReplayRuntimeAdded: false
  });
  assert.deepEqual(
    inventory.fixtures.map(({ path, status }) => [path, status]),
    phase41AFixtureFiles.map((path) => [path, "present"])
  );
  assert.deepEqual(
    inventory.docs.map(({ path, status }) => [path, status]),
    [
      ["docs/phase-4-1a-host-policy-approval-records.md", "present"],
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
      ["crates/ardyn-host/src/lib.rs", "present"],
      ["tests/phase4-1a-host-policy-approval-records.test.mjs", "present"],
      ["tests/report-phase-status.test.mjs", "present"]
    ]
  );
  assert.deepEqual(inventory.invariantProbes, [
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
    "approve-runtime",
    "grant-runtime",
    "host-policy-approval",
    "operator-consent",
    "enable-runtime",
    "phase-4-1a-approval-records"
  ]);
  assert.deepEqual(inventory.safetyPosture, {
    nonExecuting: true,
    approvalRecordOnly: true,
    reviewOnly: true,
    noLiveStdioRuntime: true,
    noStdinCommandLoop: true,
    noLiveStdioReader: true,
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
    noWebSocketHttpControlSurface: true,
    noSecrets: true,
    noProductionSigningKeys: true,
    noRuntimeApprovalGrant: true,
    noHostPolicyEnforcement: true,
    noApprovalEvaluator: true,
    noCliCommandAdded: true,
    noFileWriterAdded: true,
    noStdoutPrinterAdded: true,
    noRuntimeBehaviorIntroduced: true
  });
});

test("report inventories Phase 4.1B transport harness contracts without enabling runtime", async () => {
  const report = await runReport();
  const inventory = report.phase41BTransportHarnessInventory;

  assert.deepEqual(inventory.transportHarnessContract, {
    document: "docs/phase-4-1b-transport-harness-contracts.md",
    source: "crates/ardyn-host/src/lib.rs",
    fixture: "tests/fixtures/host-policy/phase4-1b/valid-static-transport-harness-contract.json",
    schema: "ardyn.transport-harness-contract",
    schemaVersion: "0.1.0",
    contractKind: "transport-harness-contract",
    contractPhase: "phase-4.1b-transport-harness-contracts",
    reviewedPhase: "4.1B",
    harnessKind: "rust-host-stdio-transport-harness-static-contract",
    harnessVersion: "0.1.0",
    classification: "static_contract_only",
    staticContractOnly: true,
    runtimeAvailable: false,
    currentContractEnablesRuntime: false,
    runtimeCommandAvailable: false,
    processStdioOwnershipAvailable: false,
    stdinReaderAvailable: false,
    stdoutWriterAvailable: false,
    stderrWriterAvailable: false,
    grantsRuntimeApproval: false,
    runtimeApprovalGranted: false,
    runtimeBehaviorIntroduced: false,
    liveRuntimeBehaviorIntroduced: false,
    consumedByLiveHostLoop: false
  });

  assert.deepEqual(inventory.basedOnApprovalRecord, {
    document: "docs/phase-4-1a-host-policy-approval-records.md",
    fixture: "tests/fixtures/host-policy/phase4-1a/valid-review-only-host-policy-approval-record.json",
    schema: "ardyn.host-policy-approval-record",
    classification: "valid_review_record",
    operatorConsentNecessaryButNotSufficient: true,
    approvalRecordGrantsRuntime: false
  });
  assert.deepEqual(inventory.basedOnPolicyMetadata, {
    document: "docs/phase-4-stdio-dry-run-event-emission.md",
    fixture: "tests/fixtures/host-policy/phase4-0e/stdio-transport-policy-metadata.json",
    schema: "ardyn.stdio-transport-policy-metadata",
    schemaVersion: "0.1.0",
    runtimeStatus: "pre-runtime-policy-only",
    reviewOnly: true,
    digestAlgorithm: "sha256"
  });
  assert.deepEqual(inventory.harnessContractModel.classes, phase41BTransportHarnessClassifications);
  assert.equal(inventory.harnessContractModel.exactCurrentStaticContractRequired, true);
  assert.equal(inventory.harnessContractModel.nonRuntimeReviewMetadataOnly, true);
  assert.deepEqual(
    inventory.supportedTransportModes.map(({ name, direction, metadataOnly, runtimeImplemented }) => ({
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
  assert.equal(inventory.runtimeAvailability.runtimeAvailable, false);
  assert.equal(inventory.runtimeAvailability.serveRuntimeAvailable, false);
  assert.equal(inventory.runtimeAvailability.stdioRuntimeAvailable, false);
  assert.equal(inventory.runtimeAvailability.processStdioOwnershipAvailable, false);
  assert.equal(inventory.runtimeAvailability.stdinReaderAvailable, false);
  assert.equal(inventory.requiredReferences.approvalRecordReference.present, true);
  assert.equal(inventory.requiredReferences.approvalRecordReference.approvalRecordGrantsRuntime, false);
  assert.equal(inventory.requiredReferences.policyMetadataReference.present, true);
  assert.equal(inventory.requiredReferences.stderrRedactionPolicyReference.present, true);
  assert.equal(inventory.requiredReferences.stderrRedactionPolicyReference.enforcementActive, false);
  assert.equal(inventory.requiredReferences.transcriptAuditOutputPolicyReference.present, true);
  assert.equal(
    inventory.requiredReferences.transcriptAuditOutputPolicyReference
      .transcriptPersistenceRuntimeImplemented,
    false
  );

  assert.deepEqual(inventory.reviewOnlyDisplayBehavior, {
    transportHarnessContractsAreStaticArtifactsOnly: true,
    approvalReferencesNecessaryButNotSufficient: true,
    currentContractsDoNotEnableRuntime: true,
    futureRuntimeRequiresSeparateApprovedImplementationPhase: true,
    preserveDevinReviewForMajorRuntimeReadinessCheckpoint: true,
    reportRunsChecks: false,
    writesFiles: false,
    printsStdoutFromCli: false,
    consumedByLiveHostLoop: false
  });
  assert.deepEqual(inventory.cliCommandSurface, {
    commandAdded: false,
    transportHarnessCommandAdded: false,
    serveRuntimeCommandAdded: false,
    stdioRuntimeCommandAdded: false,
    stdinReaderCommandAdded: false,
    stdoutWriterCommandAdded: false,
    stderrWriterCommandAdded: false,
    failureAuditCommandAdded: false,
    fileWriterAdded: false,
    stdoutPrinterAdded: false,
    existingDryRunEmitterUnchanged: true
  });
  assert.deepEqual(inventory.apiSurface, {
    rustStaticContractTypesAdded: true,
    rustRuntimeHelperAdded: false,
    rustStdioOwnerAdded: false,
    rustStdinReaderAdded: false,
    rustStdoutWriterAdded: false,
    rustStderrWriterAdded: false,
    typescriptCoreRuntimeApiAdded: false,
    hostPolicyEnforcementAdded: false,
    approvalEvaluatorAdded: false,
    transcriptReplayRuntimeAdded: false,
    failureAuditRuntimeAdded: false
  });
  assert.deepEqual(
    inventory.fixtures.map(({ path, status }) => [path, status]),
    phase41BFixtureFiles.map((path) => [path, "present"])
  );
  assert.deepEqual(
    inventory.docs.map(({ path, status }) => [path, status]),
    [
      ["docs/phase-4-1b-transport-harness-contracts.md", "present"],
      ["docs/phase-4-1a-host-policy-approval-records.md", "present"],
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
      ["crates/ardyn-host/src/lib.rs", "present"],
      ["tests/phase4-1b-transport-harness-contracts.test.mjs", "present"],
      ["tests/report-phase-status.test.mjs", "present"]
    ]
  );

  for (const probe of [
    "transport-harness",
    "transport-harness-contract",
    "stdin-reader",
    "stdout-writer",
    "stderr-writer",
    "failure-audit",
    "emit-failure-audit"
  ]) {
    assert.ok(inventory.invariantProbes.includes(probe), probe);
  }

  assert.deepEqual(inventory.safetyPosture, {
    nonExecuting: true,
    transportHarnessContractOnly: true,
    reviewOnly: true,
    noLiveStdioRuntime: true,
    noStdinCommandLoop: true,
    noLiveStdioReader: true,
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
    noWebSocketHttpControlSurface: true,
    noSecrets: true,
    noProductionSigningKeys: true,
    noRuntimeApprovalGrant: true,
    noHostPolicyEnforcement: true,
    noApprovalEvaluator: true,
    noStdoutWriter: true,
    noStderrWriter: true,
    noFailureAuditRuntime: true,
    noCliCommandAdded: true,
    noFileWriterAdded: true,
    noStdoutPrinterAdded: true,
    noRuntimeBehaviorIntroduced: true
  });
});

test("report inventories Phase 4.1C framing and redaction contracts without enabling runtime", async () => {
  const report = await runReport();
  const inventory = report.phase41CFramingRedactionInventory;

  assert.deepEqual(inventory.framingRedactionContract, {
    document: "docs/phase-4-1c-framing-redaction-contracts.md",
    source: "packages/core/src/index.mjs",
    types: "packages/core/src/index.d.ts",
    fixture: "tests/fixtures/host-policy/phase4-1c/valid-static-framing-redaction-contract.json",
    schema: "ardyn.stdio-framing-redaction-contract",
    schemaVersion: "0.1.0",
    contractKind: "stdio-framing-redaction-contract",
    contractPhase: "phase-4.1c-framing-redaction-contracts",
    reviewedPhase: "4.1C",
    staticContractOnly: true,
    currentContractEnablesRuntime: false,
    runtimeImplementationAvailable: false,
    runtimeCommandAvailable: false,
    processStdioOwnershipAvailable: false,
    stdinReaderAvailable: false,
    stdoutWriterAvailable: false,
    stderrWriterAvailable: false,
    failureAuditRuntimeAvailable: false,
    approvalEvaluatorAvailable: false,
    runtimeBehaviorIntroduced: false,
    liveRuntimeBehaviorIntroduced: false,
    consumedByLiveHostLoop: false
  });
  assert.deepEqual(inventory.basedOnTransportHarness, {
    document: "docs/phase-4-1b-transport-harness-contracts.md",
    fixture: "tests/fixtures/host-policy/phase4-1b/valid-static-transport-harness-contract.json",
    schema: "ardyn.transport-harness-contract",
    schemaVersion: "0.1.0",
    contractKind: "transport-harness-contract",
    contractPhase: "phase-4.1b-transport-harness-contracts",
    reviewedPhase: "4.1B",
    classification: "static_contract_only",
    approvalReferencesNecessaryButNotSufficient: true,
    currentContractEnablesRuntime: false,
    processStdioOwnershipAvailable: false,
    stdoutWriterAvailable: false,
    stderrWriterAvailable: false
  });
  assert.deepEqual(inventory.jsonlFraming, {
    exactlyOneJsonObjectPerLine: true,
    jsonObjectOnly: true,
    lfOnly: true,
    finalLfRequired: true,
    blankLinesAllowed: false,
    crlfAllowed: false,
    partialLineEmissionAllowed: false,
    deterministicKeyOrder: "ascii-key-order-via-stable-json-display-v1",
    helper: "formatJsonlWholeLinesForReview",
    classifications: phase41CJsonlClassifications,
    reviewOnly: true,
    noLiveWriter: true,
    stdoutWriterAvailable: false,
    writesToStdout: false,
    runtimeCommandAvailable: false
  });
  assert.deepEqual(inventory.stderrRedaction, {
    deterministicCodeRequired: true,
    deterministicMessageRequired: true,
    codePattern: "^[a-z][a-z0-9_.-]{2,63}$",
    redactionTokenPolicy: "typed-redaction-placeholders",
    helper: "redactStderrDiagnosticForReview",
    classifier: "classifyRedactionSafety",
    failClosedOnUnredactableDiagnostics: true,
    redactedSubjects: [
      "secrets",
      "environment_variables",
      "absolute_paths",
      "user_home_paths",
      "tokens",
      "api_keys",
      "stack_traces",
      "raw_parse_details"
    ],
    classifications: phase41CRedactionClassifications,
    reviewOnly: true,
    noLiveWriter: true,
    stderrWriterAvailable: false,
    writesToStderr: false,
    runtimeCommandAvailable: false
  });
  assert.deepEqual(inventory.validation, {
    helper: "validateJsonlWholeLineBundle",
    jsonlClassifications: phase41CJsonlClassifications,
    redactionClassifications: phase41CRedactionClassifications,
    fixtureBacked: true,
    reportRunsChecks: false,
    helpers: [
      "formatJsonlWholeLinesForReview",
      "validateJsonlWholeLineBundle",
      "redactStderrDiagnosticForReview",
      "classifyRedactionSafety"
    ]
  });
  assert.deepEqual(inventory.runtimeEffect, {
    currentContractEnablesRuntime: false,
    runtimeImplementationAvailable: false,
    runtimeCommandAvailable: false,
    processStdioOwnershipAvailable: false,
    stdinReaderAvailable: false,
    stdoutWriterAvailable: false,
    stderrWriterAvailable: false,
    failureAuditRuntimeAvailable: false,
    approvalEvaluatorAvailable: false
  });
  assert.deepEqual(inventory.reviewOnlyDisplayBehavior, {
    framingRedactionContractsAreStaticArtifactsOnly: true,
    currentContractsDoNotEnableRuntime: true,
    futureRuntimeRequiresSeparateApprovedImplementationPhase: true,
    preserveDevinReviewForMajorRuntimeReadinessCheckpoint: true,
    reportRunsChecks: false,
    writesFiles: false,
    printsStdoutFromCli: false,
    consumedByLiveHostLoop: false
  });
  assert.deepEqual(inventory.cliCommandSurface, {
    commandAdded: false,
    framingRedactionCommandAdded: false,
    stdoutFramingCommandAdded: false,
    stderrRedactionCommandAdded: false,
    stdoutWriterCommandAdded: false,
    stderrWriterCommandAdded: false,
    serveRuntimeCommandAdded: false,
    stdioRuntimeCommandAdded: false,
    fileWriterAdded: false,
    stdoutPrinterAdded: false,
    existingDryRunEmitterUnchanged: true
  });
  assert.deepEqual(inventory.apiSurface, {
    typescriptCoreStaticReviewHelpersAdded: true,
    typescriptCoreRuntimeApiAdded: false,
    rustRuntimeHelperAdded: false,
    rustStdioOwnerAdded: false,
    rustStdoutWriterAdded: false,
    rustStderrWriterAdded: false,
    approvalEvaluatorAdded: false,
    failureAuditRuntimeAdded: false,
    secretsUsed: false
  });
  assert.deepEqual(
    inventory.fixtures.map(({ path, status }) => [path, status]),
    phase41CFixtureFiles.map((path) => [path, "present"])
  );
  assert.deepEqual(
    inventory.docs.map(({ path, status }) => [path, status]),
    [
      ["docs/phase-4-1c-framing-redaction-contracts.md", "present"],
      ["docs/phase-4-1b-transport-harness-contracts.md", "present"],
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
      ["tests/phase4-1c-framing-redaction-contracts.test.mjs", "present"],
      ["tests/report-phase-status.test.mjs", "present"],
      ["packages/core/src/index.mjs", "present"],
      ["packages/core/src/index.d.ts", "present"]
    ]
  );

  for (const probe of [
    "framing-redaction",
    "stdout-framing",
    "stderr-redaction",
    "redact-stderr",
    "validate-jsonl-framing",
    "phase-4-1c-framing-redaction"
  ]) {
    assert.ok(inventory.invariantProbes.includes(probe), probe);
  }

  assert.deepEqual(inventory.safetyPosture, {
    nonExecuting: true,
    framingRedactionContractOnly: true,
    reviewOnly: true,
    noLiveStdioRuntime: true,
    noStdinCommandLoop: true,
    noLiveStdioReader: true,
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
    noWebSocketHttpControlSurface: true,
    noSecrets: true,
    noProductionSigningKeys: true,
    noRuntimeApprovalGrant: true,
    noHostPolicyEnforcement: true,
    noApprovalEvaluator: true,
    noStdoutWriter: true,
    noStderrWriter: true,
    noFailureAuditRuntime: true,
    noCliCommandAdded: true,
    noFileWriterAdded: true,
    noStdoutPrinterAdded: true,
    noRuntimeBehaviorIntroduced: true
  });
});

test("report inventories Phase 3.6 versioning, display contract, fixtures, docs, and tests", async () => {
  const report = await runReport();

  assert.deepEqual(report.phase36Inventory.reviewArtifactVersioning, {
    schema: "ardyn.approval-review-artifact",
    schemaVersion: "0.1.0",
    version: "0.1.0",
    compatibilityStates: ["compatible", "unsupported_major", "malformed"],
    supportedMajor: {
      schemaVersion: 0,
      version: 0
    },
    compatibleSameMajorDisplayOnly: true,
    fullArtifactValidationRequiresExactCurrentVersion: true,
    unsupportedMajorRejected: true,
    unknownFieldsPreservedForDisplay: true,
    deterministicFixtureTimestamps: {
      generatedAt: "2026-06-02T00:00:00.000Z",
      approvalDecisionCreatedAt: "1970-01-01T00:00:00.000Z"
    }
  });

  assert.deepEqual(report.phase36Inventory.displayContract, {
    locusRuntimeDependency: false,
    displaySummaryHelper: "buildApprovalReviewArtifactDisplaySummary",
    normalizationHelper: "normalizeApprovalReviewArtifactForDisplay",
    versionValidationHelper: "validateApprovalReviewArtifactVersion",
    compatibilityHelper: "classifyApprovalReviewArtifactCompatibility",
    displaysPlannerTraces: true,
    displaysReviewArtifacts: true,
    displaysTraceDiffs: true,
    approvalStatusDisplayRulesDocumented: true,
    severityMappingDocumented: true,
    unknownFieldsAreInertMetadata: true
  });

  assert.deepEqual(report.phase36Inventory.traceReviewFixtures, [
    {
      path: "tests/fixtures/trace-review/equal-left-approval-review-artifact.json",
      status: "present"
    },
    {
      path: "tests/fixtures/trace-review/equal-right-approval-review-artifact.json",
      status: "present"
    },
    {
      path: "tests/fixtures/trace-review/approval-status-changed-approval-review-artifact.json",
      status: "present"
    },
    {
      path: "tests/fixtures/trace-review/selected-capability-changed-approval-review-artifact.json",
      status: "present"
    },
    {
      path: "tests/fixtures/trace-review/unresolved-request-changed-approval-review-artifact.json",
      status: "present"
    },
    {
      path: "tests/fixtures/trace-review/invalid-review-artifact.json",
      status: "present"
    }
  ]);

  assert.deepEqual(
    report.phase36Inventory.docs.map(({ path, status }) => [path, status]),
    [
      ["README.md", "present"],
      ["apps/cli/README.md", "present"],
      ["docs/planner-policy-review.md", "present"],
      ["docs/planner-trace-review-workflow.md", "present"],
      ["docs/locus-trace-display-contract.md", "present"],
      ["docs/review-artifact-versioning-policy.md", "present"],
      ["docs/host-policy-preconditions.md", "present"],
      ["packages/core/README.md", "present"]
    ]
  );

  assert.deepEqual(
    report.phase36Inventory.tests.map(({ path, status }) => [path, status]),
    [
      ["tests/cli-phase3.test.mjs", "present"],
      ["tests/core-phase3-4-review-artifacts.test.mjs", "present"],
      ["tests/core-phase3-4-trace-comparison.test.mjs", "present"],
      ["tests/core-phase3-5-trace-fixtures.test.mjs", "present"],
      ["tests/core-phase3-6-review-artifact-versioning.test.mjs", "present"],
      ["tests/report-phase-status.test.mjs", "present"],
      ["tests/host-policy-preconditions.test.mjs", "present"]
    ]
  );
});

test("report inventories Phase 3.7 schema migration and attestation planning", async () => {
  const report = await runReport();

  assert.deepEqual(report.phase37Inventory.schemaMigrationMetadata, {
    schema: "ardyn.schema-migration-metadata",
    schemaVersion: "0.1.0",
    artifactKinds: [
      "manifest",
      "task",
      "planner_trace",
      "approval_review_artifact",
      "trace_diff",
      "host_policy"
    ],
    compatibilityStates: ["compatible", "upgrade_available", "unsupported_major", "malformed"],
    migrationRequiredFor: ["unsupported_major", "malformed"],
    migrationAvailableFor: ["upgrade_available"],
    nonExecuting: true
  });

  assert.deepEqual(report.phase37Inventory.attestationPlanning, {
    schema: "ardyn.review-artifact-attestation-plan",
    schemaVersion: "0.1.0",
    digestAlgorithm: "sha256",
    canonicalization: "ardyn.stable-json-display-v1",
    verificationStatuses: ["unsigned", "planned", "test_fixture_only", "unsupported"],
    productionSigningKeys: false,
    realSigning: false,
    secrets: false,
    nonExecuting: true,
    contentFabricAlignment:
      "Review-artifact attestation planning keeps payloads separate from Content Fabric signing payloads and does not enable Content Fabric runtime behavior."
  });

  assert.deepEqual(report.phase37Inventory.cliCommands, [
    {
      command: "ardyn review-artifact --file <file> --schema-status",
      writesFiles: false,
      network: false,
      summary:
        "Renders deterministic schema migration metadata and display status for one local review artifact."
    },
    {
      command: "ardyn review-artifact --file <file> --attestation-plan",
      writesFiles: false,
      network: false,
      summary:
        "Renders unsigned review-artifact attestation planning metadata for one local review artifact."
    }
  ]);

  assert.deepEqual(
    report.phase37Inventory.fixtures.map(({ path, status }) => [path, status]),
    [
      ["tests/fixtures/review-artifacts/phase3-7/current-compatible-review-artifact.json", "present"],
      ["tests/fixtures/review-artifacts/phase3-7/older-compatible-review-artifact.json", "present"],
      ["tests/fixtures/review-artifacts/phase3-7/unsupported-major-review-artifact.json", "present"],
      ["tests/fixtures/review-artifacts/phase3-7/malformed-review-artifact.json", "present"],
      ["tests/fixtures/review-artifacts/phase3-7/unsigned-attestation-plan.json", "present"],
      ["tests/fixtures/review-artifacts/phase3-7/test-fixture-only-attestation-plan.json", "present"],
      ["tests/fixtures/review-artifacts/phase3-7/migration-metadata-display.json", "present"]
    ]
  );

  assert.deepEqual(
    report.phase37Inventory.docs.map(({ path, status }) => [path, status]),
    [
      ["docs/schema-migration-policy.md", "present"],
      ["docs/review-artifact-attestation-plan.md", "present"]
    ]
  );

  assert.deepEqual(
    report.phase37Inventory.tests.map(({ path, status }) => [path, status]),
    [
      ["tests/core-phase3-7-schema-attestation.test.mjs", "present"],
      ["tests/cli-phase3.test.mjs", "present"]
    ]
  );
});

test("safety posture keeps every execution, network, plugin, torrent, and runtime flag false", async () => {
  const report = await runReport();

  assert.equal(report.safetyPosture.nonExecuting, true);
  assert.equal(report.safetyPosture.noSecrets, true);
  assert.equal(report.safetyPosture.noNetwork, true);
  assert.equal(report.safetyPosture.noProcessSpawn, true);
  assert.equal(report.safetyPosture.noStdioRuntime, true);
  assert.equal(report.safetyPosture.stdioDryRunEmitter, true);
  assert.equal(report.safetyPosture.stdioDryRunHardening, true);
  assert.equal(report.safetyPosture.stdioTransportPolicy, true);
  assert.equal(report.safetyPosture.stdioRustHostPolicyContracts, true);
  assert.equal(report.safetyPosture.stdioPolicyMetadataExport, true);
  assert.equal(report.safetyPosture.stdioPolicyReviewRecords, true);
  assert.equal(report.safetyPosture.hostPolicyReviewComparison, true);
  assert.equal(report.safetyPosture.reviewerHandoffIndex, true);
  assert.equal(report.safetyPosture.finalPreRuntimeReadiness, true);
  assert.equal(report.safetyPosture.runtimeProposal, true);
  assert.equal(report.safetyPosture.hostPolicyApprovalRecords, true);
  assert.equal(report.safetyPosture.transportHarnessContracts, true);
  assert.equal(report.safetyPosture.framingRedactionContracts, true);
  assert.equal(report.safetyPosture.noLocusRuntimeDependency, true);

  const falseFlags = {
    runtimeExecution: false,
    networkCalls: false,
    networkListeners: false,
    stdioRuntime: false,
    websocketRuntime: false,
    httpRuntime: false,
    locusRuntimeDependency: false,
    adapterConnections: false,
    mcpCalls: false,
    openClawCalls: false,
    pluginInstall: false,
    torrentDownload: false,
    codePackEnablement: false,
    autonomousLoops: false,
    contentFabricRuntimeBehavior: false,
    secretsUsed: false,
    processSpawning: false,
    phase41RuntimeImplemented: false,
    externalCiRan: false
  };

  assert.deepEqual(report.safetyPosture.flags, falseFlags);
  assert.equal(report.phase36Inventory.displayContract.locusRuntimeDependency, false);
  assert.equal(report.phase36Inventory.displayContract.unknownFieldsAreInertMetadata, true);
});

test("report script source does not import forbidden process, network, write, or runtime modules", async () => {
  const source = await readFile(reportScriptUrl, "utf8");
  const forbiddenPatterns = [
    /node:child_process/,
    /from\s+["']child_process["']/,
    /node:http/,
    /node:https/,
    /node:net/,
    /node:dgram/,
    /\bfetch\s*\(/,
    /\bWebSocket\b/,
    /\bspawn\s*\(/,
    /\bexec(File)?\s*\(/,
    /\bcreateServer\s*\(/,
    /\blisten\s*\(/,
    /\bwriteFile\s*\(/,
    /\bappendFile\s*\(/,
    /\bmkdir\s*\(/,
    /\brm\s*\(/,
    /\bunlink\s*\(/
  ];

  for (const pattern of forbiddenPatterns) {
    assert.doesNotMatch(source, pattern);
  }
});
