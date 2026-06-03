import { constants } from "node:fs";
import { access, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("../", import.meta.url));

async function readJson(path) {
  return JSON.parse(await readFile(join(repoRoot, path), "utf8"));
}

async function localStatus(path) {
  try {
    await access(join(repoRoot, path), constants.R_OK);
    return "present";
  } catch {
    return "missing";
  }
}

function configuredCheck(packageJson, name, command) {
  return {
    name,
    command,
    packageScript: packageJson.scripts[name] ?? null,
    ranByReport: false
  };
}

async function localInventoryEntry(path, summary) {
  return {
    path,
    status: await localStatus(path),
    summary
  };
}

async function fixtureInventoryEntry(path) {
  return {
    path,
    status: await localStatus(path)
  };
}

const packageJson = await readJson("package.json");
const phase38FabricFamilySet = [
  "*",
  "locus",
  "multiverse",
  "kortex-audio",
  "locus-evolution-lab",
  "somatic",
  "ardyn"
];
const phase38SessionEventTypes = [
  "session.started",
  "session.heartbeat",
  "session.capabilities",
  "task.planned",
  "approval.requested",
  "approval.recorded",
  "session.completed",
  "session.error"
];
const phase39TranscriptFixtures = [
  "valid-error.json",
  "valid-minimal.json",
  "valid-task-approval.json",
  "invalid-missing-session-started.json",
  "invalid-out-of-order-sequence.json",
  "invalid-safety-flag.json",
  "invalid-source-harness.json"
];
const phase310TranscriptFixtures = [
  "current-compatible.json",
  "display-summary.json",
  "inert-unknown-fields.json",
  "malformed.json",
  "migration-metadata.json",
  "older-compatible-upgrade-available.json",
  "unsupported-major.json"
];
const phase310CompatibilityClasses = [
  "compatible",
  "upgrade_available",
  "unsupported_major",
  "malformed"
];

const report = {
  schemaVersion: "ardyn.phase-status-report.v1",
  phase: {
    id: "4.0A",
    name: "stdio session-event dry-run emission",
    executionPosture: "non-executing"
  },
  reportMode: "local-summary-only",
  reportRunsChecks: false,
  configuredChecks: [
    configuredCheck(packageJson, "test", "npm test"),
    configuredCheck(packageJson, "test:schemas", "npm run test:schemas"),
    configuredCheck(packageJson, "report:phase-status", "npm run report:phase-status")
  ],
  verificationCommands: [
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
      purpose: "Render this deterministic local Phase 4.0A status report.",
      ranByReport: false
    },
    {
      command: "node --test tests/report-phase-status.test.mjs",
      purpose: "Run focused tests for this local Phase 4.0A status report.",
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
  ],
  plannerReviewOutputs: [
    await localInventoryEntry(
      "docs/planner-policy-review.md",
      "Documents planning-only policy review boundaries and examples."
    ),
    await localInventoryEntry(
      "docs/planner-trace-review-workflow.md",
      "Documents the planner trace, approval artifact, and review-trace workflow."
    ),
    await localInventoryEntry(
      "docs/locus-trace-display-contract.md",
      "Documents Locus-facing inert display fields, severity mapping, and no runtime dependency."
    ),
    await localInventoryEntry(
      "docs/review-artifact-versioning-policy.md",
      "Documents review-artifact schema id, version semantics, compatibility posture, and timestamp guidance."
    ),
    await localInventoryEntry(
      "docs/schema-migration-policy.md",
      "Documents Phase 3.7 schema migration metadata, compatibility states, and manual-review boundaries."
    ),
    await localInventoryEntry(
      "docs/review-artifact-attestation-plan.md",
      "Documents unsigned/test-fixture-only attestation planning and Content Fabric signing alignment."
    ),
    await localInventoryEntry(
      "docs/harness-identity.md",
      "Documents canonical ARDYN slug, Locus-facing identity, and optional external Multiverse boundary."
    ),
    await localInventoryEntry(
      "docs/session-events-stdio-contract.md",
      "Documents Phase 3.9 session-event and transcript review boundaries without adding runtime transport."
    ),
    await localInventoryEntry(
      "docs/session-transcript-versioning-policy.md",
      "Documents Phase 3.10 transcript schema/version compatibility, deterministic metadata policy, and display-only boundaries."
    ),
    await localInventoryEntry(
      "tests/core-phase3-1-planner-hardening.test.mjs",
      "Covers deterministic planner ranking, approval records, and safety flags."
    ),
    await localInventoryEntry(
      "tests/core-phase3-3-policy-fixtures.test.mjs",
      "Covers Phase 3.3 policy-review fixture behavior."
    ),
    await localInventoryEntry(
      "tests/core-phase3-6-review-artifact-versioning.test.mjs",
      "Covers Phase 3.6 review-artifact version compatibility, unknown-field display, and display summaries."
    ),
    await localInventoryEntry(
      "tests/core-phase3-7-schema-attestation.test.mjs",
      "Covers Phase 3.7 schema migration metadata, attestation planning, fixtures, and safety flags."
    ),
    await localInventoryEntry(
      "tests/session-event-schema.test.mjs",
      "Covers Phase 3.8 session-event schema validation and invalid examples."
    ),
    await localInventoryEntry(
      "tests/session-transcript-schema.test.mjs",
      "Covers Phase 3.9 session-transcript schema validation and transcript fixtures."
    ),
    await localInventoryEntry(
      "tests/core-phase3-9-session-transcripts.test.mjs",
      "Covers Phase 3.9 static transcript validation, classification, summaries, and explanations."
    ),
    await localInventoryEntry(
      "tests/phase3-8-locus-family-alignment.test.mjs",
      "Covers Phase 3.8 slug alignment, Fabric family membership, and Locus display freeze marker."
    )
  ],
  phase36Inventory: {
    reviewTraceCommands: [
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
    ],
    traceReviewFixtures: [
      await fixtureInventoryEntry(
        "tests/fixtures/trace-review/equal-left-approval-review-artifact.json"
      ),
      await fixtureInventoryEntry(
        "tests/fixtures/trace-review/equal-right-approval-review-artifact.json"
      ),
      await fixtureInventoryEntry(
        "tests/fixtures/trace-review/approval-status-changed-approval-review-artifact.json"
      ),
      await fixtureInventoryEntry(
        "tests/fixtures/trace-review/selected-capability-changed-approval-review-artifact.json"
      ),
      await fixtureInventoryEntry(
        "tests/fixtures/trace-review/unresolved-request-changed-approval-review-artifact.json"
      ),
      await fixtureInventoryEntry("tests/fixtures/trace-review/invalid-review-artifact.json")
    ],
    exportErgonomics: {
      reportWritesFiles: false,
      reportOutputFileSupport: false,
      reviewTraceWritesFiles: false,
      reviewArtifactOutputCommand: "ardyn plan --review-artifact --output <file>",
      reviewArtifactOutputRequiresExplicitCliFlag: true,
      summary:
        "The report script is stdout-only local metadata; artifact file writes are only available through an explicit plan --review-artifact --output CLI request."
    },
    reviewArtifactVersioning: {
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
    },
    displayContract: {
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
    },
    docs: [
      await localInventoryEntry(
        "README.md",
        "Documents Phase 3.6 review-artifact versioning/display workflow, existing review-trace CLI usage, and non-executing posture."
      ),
      await localInventoryEntry(
        "apps/cli/README.md",
        "Documents CLI review-trace modes and explicit review artifact export ergonomics."
      ),
      await localInventoryEntry(
        "docs/planner-policy-review.md",
        "Documents approval review artifact examples and policy boundaries."
      ),
      await localInventoryEntry(
        "docs/planner-trace-review-workflow.md",
        "Documents reviewer workflow for planner traces, approval artifacts, and trace-review fixtures."
      ),
      await localInventoryEntry(
        "docs/locus-trace-display-contract.md",
        "Documents Phase 3.6 Locus-facing display fields, severity mapping, and no runtime dependency."
      ),
      await localInventoryEntry(
        "docs/review-artifact-versioning-policy.md",
        "Documents Phase 3.6 review-artifact versioning and backward-compatible display policy."
      ),
      await localInventoryEntry(
        "docs/host-policy-preconditions.md",
        "Documents future host-policy preconditions without active runtime enforcement."
      ),
      await localInventoryEntry(
        "packages/core/README.md",
        "Documents core-package host-policy precondition posture."
      )
    ],
    tests: [
      await localInventoryEntry(
        "tests/cli-phase3.test.mjs",
        "Covers CLI review-trace modes and explicit review artifact output ergonomics."
      ),
      await localInventoryEntry(
        "tests/core-phase3-4-review-artifacts.test.mjs",
        "Pins stable approval review artifact fixtures and safety validation."
      ),
      await localInventoryEntry(
        "tests/core-phase3-4-trace-comparison.test.mjs",
        "Covers approval artifact comparison, planner-trace normalization, and unsafe artifact rejection."
      ),
      await localInventoryEntry(
        "tests/core-phase3-5-trace-fixtures.test.mjs",
        "Covers Phase 3.5 trace-review fixtures."
      ),
      await localInventoryEntry(
        "tests/core-phase3-6-review-artifact-versioning.test.mjs",
        "Covers Phase 3.6 review-artifact versioning, unknown-field preservation, and display summaries."
      ),
      await localInventoryEntry(
        "tests/report-phase-status.test.mjs",
        "Covers the Phase 3.6 local-summary-only status report output."
      ),
      await localInventoryEntry(
        "tests/host-policy-preconditions.test.mjs",
        "Covers host-policy precondition documentation and report inventory."
      )
    ]
  },
  phase37Inventory: {
    schemaMigrationMetadata: {
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
      compatibilityStates: [
        "compatible",
        "upgrade_available",
        "unsupported_major",
        "malformed"
      ],
      migrationRequiredFor: ["unsupported_major", "malformed"],
      migrationAvailableFor: ["upgrade_available"],
      nonExecuting: true
    },
    attestationPlanning: {
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
    },
    cliCommands: [
      {
        command: "ardyn review-artifact --file <file> --schema-status",
        writesFiles: false,
        network: false,
        summary: "Renders deterministic schema migration metadata and display status for one local review artifact."
      },
      {
        command: "ardyn review-artifact --file <file> --attestation-plan",
        writesFiles: false,
        network: false,
        summary: "Renders unsigned review-artifact attestation planning metadata for one local review artifact."
      }
    ],
    fixtures: [
      await fixtureInventoryEntry(
        "tests/fixtures/review-artifacts/phase3-7/current-compatible-review-artifact.json"
      ),
      await fixtureInventoryEntry(
        "tests/fixtures/review-artifacts/phase3-7/older-compatible-review-artifact.json"
      ),
      await fixtureInventoryEntry(
        "tests/fixtures/review-artifacts/phase3-7/unsupported-major-review-artifact.json"
      ),
      await fixtureInventoryEntry(
        "tests/fixtures/review-artifacts/phase3-7/malformed-review-artifact.json"
      ),
      await fixtureInventoryEntry(
        "tests/fixtures/review-artifacts/phase3-7/unsigned-attestation-plan.json"
      ),
      await fixtureInventoryEntry(
        "tests/fixtures/review-artifacts/phase3-7/test-fixture-only-attestation-plan.json"
      ),
      await fixtureInventoryEntry(
        "tests/fixtures/review-artifacts/phase3-7/migration-metadata-display.json"
      )
    ],
    docs: [
      await localInventoryEntry(
        "docs/schema-migration-policy.md",
        "Documents Phase 3.7 schema migration metadata and compatibility records."
      ),
      await localInventoryEntry(
        "docs/review-artifact-attestation-plan.md",
        "Documents non-production review-artifact attestation planning."
      )
    ],
    tests: [
      await localInventoryEntry(
        "tests/core-phase3-7-schema-attestation.test.mjs",
        "Covers schema migration metadata and attestation planning."
      ),
      await localInventoryEntry(
        "tests/cli-phase3.test.mjs",
        "Covers review-artifact schema-status and attestation-plan CLI output."
      )
    ]
  },
  phase38Inventory: {
    harnessIdentity: {
      canonicalSlug: "ardyn",
      packageNamespace: "ardyn",
      manifestFacingHarnessId: "ardyn",
      keyringNamespace: "ardyn",
      fabricFamily: "ardyn",
      futureLocusConnectorExpectedId: "ardyn",
      multiverseIntegration: "optional-external",
      locusRuntimeDependency: false
    },
    fabricFamilySet: phase38FabricFamilySet,
    staleSlugPolicy: {
      legacyArdynOsVariantsAcceptedAsCurrentHarnessId: false,
      acceptedAsCurrentHarnessId: false,
      allowedOnlyInNegativeTests: true
    },
    locusDisplayContract: {
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
    },
    sessionEvents: {
      schema: "https://schemas.ardyn.ai/session-event.schema.json",
      schemaVersion: "0.1.0",
      sourceHarness: "ardyn",
      transportRoadmap: {
        firstFutureTransport: "stdio",
        stdioRuntimeImplemented: false,
        websocketRuntimeImplemented: false,
        httpRuntimeImplemented: false
      },
      eventTypes: phase38SessionEventTypes,
      validExampleDirectory: "examples/session-events",
      invalidFixtures: ["invalid-source-harness.json", "invalid-safety-flag.json"],
      nonExecuting: true
    },
    docs: [
      await localInventoryEntry(
        "docs/harness-identity.md",
        "Pins canonical Locus-facing slug and product boundaries."
      ),
      await localInventoryEntry(
        "docs/session-events-stdio-contract.md",
        "Documents future stdio-first session-event contract without runtime transport."
      ),
      await localInventoryEntry(
        "docs/content-fabric.md",
        "Documents reconciled Fabric family set and Locus byte-reference fixture policy."
      ),
      await localInventoryEntry(
        "docs/locus-trace-display-contract.md",
        "Contains the Phase 3.x read-only Locus display contract freeze marker."
      )
    ],
    tests: [
      await localInventoryEntry(
        "tests/phase3-8-locus-family-alignment.test.mjs",
        "Covers slug consistency, Fabric family set, stale slug policy, and display freeze marker."
      ),
      await localInventoryEntry(
        "tests/session-event-schema.test.mjs",
        "Covers session-event schema examples, invalid fixtures, and false safety flags."
      ),
      await localInventoryEntry(
        "tests/fabric.test.mjs",
        "Covers reconciled Fabric family membership and rejection of legacy harness ids."
      )
    ]
  },
  phase39Inventory: {
    transcriptSchema: {
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
    },
    transcriptFixtures: {
      directory: "examples/session-transcripts",
      files: await Promise.all(phase39TranscriptFixtures.map((path) => fixtureInventoryEntry(`examples/session-transcripts/${path}`)))
    },
    transcriptDocs: [
      await localInventoryEntry(
        "docs/session-events-stdio-contract.md",
        "Documents the Phase 3.9 static session-transcript review model, inert metadata posture, and no stdio runtime boundary."
      ),
      await localInventoryEntry(
        "docs/host-policy-preconditions.md",
        "Documents the Rust host policy preconditions required before stdout/stderr and line-delimited JSON stdio semantics can exist."
      ),
      await localInventoryEntry(
        "docs/locus-trace-display-contract.md",
        "Documents Phase 3.9 read-only transcript viewer notes for Locus or any other peer client."
      ),
      await localInventoryEntry(
        "README.md",
        "Documents Phase 3.9 transcript review scope, local-only report posture, and non-runtime validation command examples."
      )
    ],
    transcriptTests: [
      await localInventoryEntry(
        "tests/session-transcript-schema.test.mjs",
        "Covers Phase 3.9 transcript schema validation and fixture coverage."
      ),
      await localInventoryEntry(
        "tests/core-phase3-9-session-transcripts.test.mjs",
        "Covers Phase 3.9 transcript semantic validation, classification, summaries, and explanations."
      ),
      await localInventoryEntry(
        "tests/report-phase-status.test.mjs",
        "Pins Phase 3.9 report metadata, transcript inventory, and local-summary-only safety posture."
      )
    ],
    cliValidationCommandMetadata: {
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
    },
    safetyPreconditions: {
      explicitApprovalRequiredForTaskExecution: true,
      adapterPermissionDeclarationsRequired: true,
      rustHostPolicyRequiredForProcessNetworkFilesystemAccess: true,
      codePackEnablementRequiresFabricVerificationQuarantineEnablePolicy: true,
      stdoutStderrAndLineDelimitedJsonPolicyRequiredBeforeRuntime: true,
      locusRole: "peer-client-viewer-or-future-controller-only"
    }
  },
  phase310Inventory: {
    transcriptVersioning: {
      schema: "ardyn.session-transcript",
      schemaVersion: "0.1.0",
      schemaVersionSemantics:
        "Semantic version metadata for transcript envelope, safety proof, and event semantics; not a runtime permission.",
      compatibilityClasses: phase310CompatibilityClasses,
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
    },
    commandExamples: [
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
    ],
    locusDisplaySummaryFields: [
      "sessionId",
      "sourceHarness",
      "schemaStatus.schemaId",
      "schemaStatus.schemaVersion",
      "schemaStatus.compatibility",
      "eventCount",
      "firstEventType",
      "lastEventType",
      "sequenceRange.first",
      "sequenceRange.last",
      "counts.errors",
      "counts.approvalEvents",
      "counts.taskPlannedEvents",
      "safetyPosture",
      "warnings",
      "unknownFieldCount"
    ],
    safetyPosture: {
      noLiveStdioRuntime: true,
      noCommandExecutionSemantics: true,
      noNetworkCalls: true,
      noProcessRuntime: true,
      noPluginInstall: true,
      noTorrentBehavior: true,
      noContentFabricRuntimeBehavior: true,
      noCodePackBehavior: true,
      noLocusRuntimeDependency: true
    },
    docs: [
      await localInventoryEntry(
        "docs/session-transcript-versioning-policy.md",
        "Documents Phase 3.10 transcript versioning, compatibility classes, unknown-field policy, deterministic metadata, display fields, and future preconditions."
      ),
      await localInventoryEntry(
        "docs/session-events-stdio-contract.md",
        "Cross-links Phase 3.10 transcript versioning while preserving no-runtime stdio boundaries."
      ),
      await localInventoryEntry(
        "docs/locus-trace-display-contract.md",
        "Documents Phase 3.10 read-only Locus transcript compatibility and summary fields."
      ),
      await localInventoryEntry(
        "README.md",
        "Documents Phase 3.10 local-only command examples and non-executing boundaries."
      )
    ],
    fixtures: await Promise.all(
      phase310TranscriptFixtures.map((path) =>
        fixtureInventoryEntry(`tests/fixtures/session-transcripts/phase3-10/${path}`)
      )
    ),
    tests: [
      await localInventoryEntry(
        "tests/session-transcript-schema.test.mjs",
        "Expected focused schema and fixture coverage for transcript examples."
      ),
      await localInventoryEntry(
        "tests/core-phase3-9-session-transcripts.test.mjs",
        "Expected current transcript semantic validation, summary, and explanation coverage."
      ),
      await localInventoryEntry(
        "tests/core-phase3-10-transcript-versioning.test.mjs",
        "Covers Phase 3.10 transcript compatibility, migration metadata, display summaries, fixtures, and safety flags."
      ),
      await localInventoryEntry(
        "tests/report-phase-status.test.mjs",
        "Pins Phase 3.10 report metadata, implemented command modes, and local-summary-only safety posture."
      )
    ],
    futureExecutionAdjacentPreconditions: [
      "Reviewed Rust host policy for filesystem, process, network, stdout, stderr, and line-delimited JSON framing.",
      "Explicit approval gates before task or tool execution.",
      "Adapter permission declarations and review UI boundaries.",
      "Malformed-line, dropped-event, duplicate-event, and out-of-order-event handling.",
      "Secrets policy and redaction behavior.",
      "Content Fabric code-pack verification, quarantine, and explicit enablement policy before any code-pack path exists.",
      "Locus role and control boundaries through a later public ARDYN API contract.",
      "Negative tests proving transcript metadata cannot start runtimes, connect adapters, install plugins, download torrents, enable code packs, or execute tools."
    ]
  },
  phase40AInventory: {
    command: {
      command:
        "ardyn emit-session-events --dry-run --manifest <manifest.json> --task <task.json>",
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
    },
    coreApi: [
      "createStdioDryRunSessionEvents",
      "formatSessionEventsJsonl",
      "assertLocalFilePath",
      "assertLocalJsonFilePath",
      "readLocalJsonFile"
    ],
    eventOrder: [
      "session.started",
      "session.heartbeat",
      "session.capabilities",
      "task.planned",
      "approval.recorded",
      "session.completed"
    ],
    approvalRequiredEventInsertion: "approval.requested is inserted before approval.recorded when approval is required and selected capability ids exist.",
    framing: {
      format: "jsonl",
      newline: "lf",
      finalTrailingNewline: true,
      validatesEveryEventBeforeSerialization: true,
      malformedEventsRejected: true
    },
    localPathPolicy: {
      appliesTo: ["manifest", "task", "transcript", "local-json-review-input"],
      rejectsUrlSchemes: true,
      rejectsFileUrls: true,
      rejectsUncAndNetworkPaths: true,
      rejectsWindowsDriveRelativePaths: true,
      rejectsStdinMarker: true,
      rejectsNulCrLf: true,
      requiresJsonExtensionForJsonInputs: true,
      absoluteLocalPathsAllowed: true
    },
    docs: [
      await localInventoryEntry(
        "docs/phase-4-stdio-dry-run-event-emission.md",
        "Documents the Phase 4.0A dry-run JSONL event emitter contract, path policy, malformed handling, and deferred hardening."
      ),
      await localInventoryEntry(
        "docs/session-events-stdio-contract.md",
        "Cross-links the Phase 4.0A finite dry-run emitter while preserving no-live-runtime boundaries."
      ),
      await localInventoryEntry(
        "README.md",
        "Documents the emit-session-events dry-run CLI command and non-executing behavior."
      ),
      await localInventoryEntry(
        "apps/cli/README.md",
        "Documents the CLI command shape and stdout/stderr behavior."
      ),
      await localInventoryEntry(
        ".gitattributes",
        "Pins LF handling for source, JSON, schemas, markdown, and fixtures while preserving byte-reference Fabric fixtures."
      )
    ],
    tests: [
      await localInventoryEntry(
        "tests/core-phase4-stdio-dry-run.test.mjs",
        "Covers deterministic event order, sequence numbers, JSONL framing, malformed rejection, safety flags, LF behavior, and path policy."
      ),
      await localInventoryEntry(
        "tests/cli-phase4-stdio-dry-run.test.mjs",
        "Covers stdout-only JSONL success, stderr-only failures, transcript path policy reuse, no file side effects, and no runtime imports."
      )
    ],
    safetyPosture: {
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
    },
    deferredHardening: [
      "Repo-root confinement for local inputs.",
      "Transcript persistence or replay.",
      "Dropped-line and duplicate-line handling across a live stream.",
      "stderr redaction policy.",
      "Rust-host ownership of stdout and stderr for a future live runtime."
    ]
  },
  safetyPosture: {
    nonExecuting: true,
    noSecrets: true,
    noNetwork: true,
    noProcessSpawn: true,
    noStdioRuntime: true,
    stdioDryRunEmitter: true,
    noLocusRuntimeDependency: true,
    flags: {
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
    },
    note:
      "The report renders local metadata only; it does not execute checks, spawn processes, write files, call network APIs, start live stdio or network transports, connect to Locus, or run runtime behavior."
  },
  externalCi: {
    ran: false,
    claimed: false,
    note: "This local report does not query or imply external CI status."
  }
};

process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
