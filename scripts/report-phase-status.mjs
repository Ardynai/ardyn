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

const report = {
  schemaVersion: "ardyn.phase-status-report.v1",
  phase: {
    id: "3.7",
    name: "Schema migration metadata and review-artifact attestation planning",
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
      purpose: "Render this deterministic local Phase 3.7 status report.",
      ranByReport: false
    },
    {
      command: "node --test tests/report-phase-status.test.mjs",
      purpose: "Run focused tests for this local Phase 3.7 status report.",
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
      command: "node --test tests/cli-phase3.test.mjs",
      purpose: "Run focused CLI tests covering review-trace and review artifact export ergonomics.",
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
  safetyPosture: {
    nonExecuting: true,
    noSecrets: true,
    noNetwork: true,
    noProcessSpawn: true,
    flags: {
      runtimeExecution: false,
      networkCalls: false,
      networkListeners: false,
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
      "The report renders local metadata only; it does not execute checks, spawn processes, write files, call network APIs, or run runtime behavior."
  },
  externalCi: {
    ran: false,
    claimed: false,
    note: "This local report does not query or imply external CI status."
  }
};

process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
