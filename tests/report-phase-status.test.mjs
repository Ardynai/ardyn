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
    "node --test tests/schema-validation.test.mjs tests/session-event-schema.test.mjs"
  );
  assert.equal(packageJson.scripts["report:phase-status"], "node scripts/report-phase-status.mjs");
});

test("phase status report is Phase 3.8 local metadata and does not claim to run checks", async () => {
  const report = await runReport();

  assert.equal(report.schemaVersion, "ardyn.phase-status-report.v1");
  assert.deepEqual(report.phase, {
    id: "3.8",
    name: "Locus family alignment and stdio session-event contracts",
    executionPosture: "non-executing"
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
      packageScript: "node --test tests/schema-validation.test.mjs tests/session-event-schema.test.mjs",
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
      command: "git diff --check",
      purpose: "Check the working diff for whitespace errors.",
      ranByReport: false
    },
    {
      command: "npm run report:phase-status",
      purpose: "Render this deterministic local Phase 3.8 status report.",
      ranByReport: false
    },
    {
      command: "node --test tests/report-phase-status.test.mjs",
      purpose: "Run focused tests for this local Phase 3.8 status report.",
      ranByReport: false
    },
    {
      command: "node --test tests/host-policy-preconditions.test.mjs",
      purpose: "Run focused documentation/report checks for host-policy preconditions.",
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
      command: "node --test tests/phase3-8-locus-family-alignment.test.mjs",
      purpose: "Run focused Phase 3.8 harness identity, Fabric family, and Locus display freeze tests.",
      ranByReport: false
    },
    {
      command: "node --test tests/cli-phase3.test.mjs",
      purpose: "Run focused CLI tests covering review-trace and review artifact export ergonomics.",
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
