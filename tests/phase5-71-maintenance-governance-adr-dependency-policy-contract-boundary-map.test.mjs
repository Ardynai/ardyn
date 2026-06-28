import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";
import {
  MAINTENANCE_GOVERNANCE_ADR_DEPENDENCY_POLICY_CONTRACT_BOUNDARY_MAP_SCHEMA,
  createMaintenanceGovernanceAdrDependencyPolicyContractBoundaryMapForReview
} from "../packages/core/src/index.mjs";

const execFileAsync = promisify(execFile);
const phase571BaselineCommit = "4937644e395df2d95db3aab277bd417726262a66";
const reviewedAt = "2026-06-28T00:00:00.000Z";
const repoRootUrl = new URL("../", import.meta.url);
const repoRoot = fileURLToPath(repoRootUrl);
const cliPath = fileURLToPath(new URL("../apps/cli/src/index.mjs", import.meta.url));
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-71/maintenance-governance-adr-dependency-policy-contract-boundary-map.json",
  import.meta.url
);

const expectedCaseClassifications = Object.freeze({
  "valid-maintenance-governance-adr-dependency-policy-contract-boundary-map":
    "valid_maintenance_governance_adr_dependency_policy_contract_boundary_map_runtime_still_blocked",
  "malformed-maintenance-governance-adr-dependency-policy-contract-boundary-map-input-rejected":
    "malformed_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected",
  "missing-required-maintenance-governance-adr-dependency-policy-contract-boundary-entry-rejected":
    "missing_required_maintenance_governance_adr_dependency_policy_contract_boundary_entry_rejected",
  "unknown-top-level-field-maintenance-governance-adr-dependency-policy-contract-boundary-map-input-rejected":
    "unknown_top_level_field_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected",
  "unknown-boundary-family-maintenance-governance-adr-dependency-policy-contract-boundary-map-input-rejected":
    "unknown_boundary_family_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected",
  "unknown-related-system-maintenance-governance-adr-dependency-policy-contract-boundary-map-input-rejected":
    "unknown_related_system_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected",
  "unknown-current-status-maintenance-governance-adr-dependency-policy-contract-boundary-map-input-rejected":
    "unknown_current_status_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected",
  "authorization-flags-enabled-maintenance-governance-adr-dependency-policy-contract-boundary-map-input-rejected":
    "authorization_flags_enabled_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected",
  "report-runs-checks-true-maintenance-governance-adr-dependency-policy-contract-boundary-map-input-rejected":
    "report_runs_checks_true_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected",
  "runtime-authorization-attempt-maintenance-governance-adr-dependency-policy-contract-boundary-map-input-rejected":
    "runtime_authorization_attempt_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected",
  "command-exposure-attempt-maintenance-governance-adr-dependency-policy-contract-boundary-map-input-rejected":
    "command_exposure_attempt_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected",
  "blocked-cli-bypass-attempt-maintenance-governance-adr-dependency-policy-contract-boundary-map-input-rejected":
    "blocked_cli_bypass_attempt_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected",
  "hidden-dependency-update-patch-execution-semantics-maintenance-governance-adr-dependency-policy-contract-boundary-map-input-rejected":
    "hidden_dependency_update_patch_execution_semantics_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected",
  "hidden-release-ci-publishing-automation-semantics-maintenance-governance-adr-dependency-policy-contract-boundary-map-input-rejected":
    "hidden_release_ci_publishing_automation_semantics_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected",
  "hidden-graphify-memory-mutation-semantics-maintenance-governance-adr-dependency-policy-contract-boundary-map-input-rejected":
    "hidden_graphify_memory_mutation_semantics_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected",
  "hidden-code-mode-runtime-semantics-maintenance-governance-adr-dependency-policy-contract-boundary-map-input-rejected":
    "hidden_code_mode_runtime_semantics_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected",
  "hidden-subagent-jules-automation-semantics-maintenance-governance-adr-dependency-policy-contract-boundary-map-input-rejected":
    "hidden_subagent_jules_automation_semantics_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected",
  "hidden-external-reference-vendoring-copying-semantics-maintenance-governance-adr-dependency-policy-contract-boundary-map-input-rejected":
    "hidden_external_reference_vendoring_copying_semantics_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected",
  "hidden-backend-api-server-semantics-maintenance-governance-adr-dependency-policy-contract-boundary-map-input-rejected":
    "hidden_backend_api_server_semantics_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected",
  "hidden-database-storage-cache-write-semantics-maintenance-governance-adr-dependency-policy-contract-boundary-map-input-rejected":
    "hidden_database_storage_cache_write_semantics_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected",
  "hidden-auth-session-token-api-key-semantics-maintenance-governance-adr-dependency-policy-contract-boundary-map-input-rejected":
    "hidden_auth_session_token_api_key_semantics_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected",
  "hidden-connector-grant-semantics-maintenance-governance-adr-dependency-policy-contract-boundary-map-input-rejected":
    "hidden_connector_grant_semantics_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected",
  "hidden-fabric-websocket-http-mcp-task-runtime-semantics-maintenance-governance-adr-dependency-policy-contract-boundary-map-input-rejected":
    "hidden_fabric_websocket_http_mcp_task_runtime_semantics_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected",
  "hidden-secure-drop-implementation-semantics-maintenance-governance-adr-dependency-policy-contract-boundary-map-input-rejected":
    "hidden_secure_drop_implementation_semantics_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected",
  "hidden-encoded-handoff-codec-translator-stego-covert-channel-tokenizer-exploit-bypass-semantics-maintenance-governance-adr-dependency-policy-contract-boundary-map-input-rejected":
    "hidden_encoded_handoff_codec_translator_stego_covert_channel_tokenizer_exploit_bypass_semantics_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected",
  "hidden-hermes-cua-computer-use-runtime-semantics-maintenance-governance-adr-dependency-policy-contract-boundary-map-input-rejected":
    "hidden_hermes_cua_computer_use_runtime_semantics_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected",
  "hidden-infrastructure-deployment-compliance-pii-retention-export-semantics-maintenance-governance-adr-dependency-policy-contract-boundary-map-input-rejected":
    "hidden_infrastructure_deployment_compliance_pii_retention_export_semantics_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected",
  "hidden-testing-ci-release-automation-semantics-maintenance-governance-adr-dependency-policy-contract-boundary-map-input-rejected":
    "hidden_testing_ci_release_automation_semantics_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected",
  "unsafe-maintenance-governance-runtime-flags-maintenance-governance-adr-dependency-policy-contract-boundary-map-input-rejected":
    "unsafe_maintenance_governance_runtime_flags_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected",
  "nested-unsafe-flags-maintenance-governance-adr-dependency-policy-contract-boundary-map-input-rejected":
    "nested_unsafe_flags_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected",
  "noncanonical-maintenance-governance-adr-dependency-policy-contract-boundary-map-input-rejected":
    "noncanonical_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected"
});

const expectedBoundaryFamilies = Object.freeze([
  "adr_contract",
  "architecture_diagram_contract",
  "governance_policy_contract",
  "dependency_policy_contract",
  "vulnerability_patch_policy_contract",
  "waiver_policy_contract",
  "release_governance_contract",
  "versioning_policy_contract",
  "ownership_contract",
  "review_policy_contract",
  "jules_review_boundary",
  "subagent_review_boundary",
  "toolkit_usage_boundary",
  "graphify_memory_boundary",
  "code_mode_governance_boundary",
  "external_reference_policy_contract"
]);

const expectedRelatedSystems = Object.freeze([
  "ardyn",
  "ardyn-subagent",
  "locus",
  "multiverse",
  "content-fabric",
  "repo-family",
  "external-harness",
  "hermes-reference",
  "cua-driver-reference"
]);

const expectedStatusValues = Object.freeze([
  "metadata_only",
  "covered_by_existing_validation",
  "blocked",
  "future_contract_required"
]);

const commandProbes = Object.freeze([
  "maintenance-governance-adr-dependency-policy-contract-boundary-map",
  "adr-generator-runtime",
  "diagram-generator-runtime",
  "dependency-update-bot",
  "vulnerability-patch-automation",
  "release-publishing-runtime",
  "ci-modification-runtime",
  "waiver-automation-runtime",
  "policy-engine-runtime",
  "graphify-mutation-runtime",
  "code-mode-runtime",
  "subagent-runtime",
  "jules-automation-runtime",
  "external-repo-vendoring-runtime"
]);

const unsafeFlagCases = Object.freeze([
  "runtimeExecutionEnabled",
  "connectorGrantProduced",
  "fabricRuntimeImplementedByArdyn",
  "websocketHttpTransportImplementedByArdyn",
  "mcpToolExposureEnabled",
  "taskExecutionEnabled",
  "secureDropImplemented",
  "serviceDiscoveryEnabled",
  "scheduleEnforcementEnabled",
  "filesystemWriteEnabled",
  "processControlEnabled",
  "adrGeneratorEnabled",
  "diagramGeneratorEnabled",
  "dependencyUpdateAutomationEnabled",
  "dependencyUpdateBotEnabled",
  "vulnerabilityPatchAutomationEnabled",
  "releasePublishingEnabled",
  "ciModificationEnabled",
  "ciWorkflowModificationEnabled",
  "policyEngineEnabled",
  "waiverAutomationEnabled",
  "adrGeneratorRuntimeEnabled",
  "diagramGeneratorRuntimeEnabled",
  "graphifyRuntimeMutationEnabled",
  "graphifyRepoMutationEnabled",
  "codeModeRuntimeEnabled",
  "subagentRuntimeEnabled",
  "julesAutomationEnabled",
  "externalRepoImportEnabled",
  "externalRepoVendoringEnabled",
  "externalRepoCopyingEnabled",
  "packageExportEnabled",
  "deploymentAutomationImplemented",
  "runtimeGovernanceEnabled",
  "backendRuntimeImplementedByArdyn",
  "databaseStorageRuntimeWritesEnabled",
  "cacheEngineImplemented",
  "rlsRuntimeImplemented",
  "databaseMigrationImplemented",
  "transcriptWriterImplemented",
  "auditWriterImplemented",
  "persistenceImplementedByArdyn",
  "loggerRuntimeImplemented",
  "auditWriterRuntimeImplemented",
  "telemetryClientImplemented",
  "healthCheckRuntimeImplemented",
  "backupJobImplemented",
  "restoreJobImplemented",
  "failoverRuntimeImplemented",
  "infrastructureAutomationImplemented",
  "complianceEnforcementImplemented",
  "piiProcessingImplemented",
  "retentionJobImplemented",
  "exportJobImplemented",
  "testingCiReleaseAutomationEnabled",
  "hermesRuntimeEnabled",
  "cuaDriverRuntimeEnabled",
  "computerUseRuntimeEnabled",
  "agentModeRuntimeEnabled",
  "profileLoaderEnabled",
  "skillLoaderEnabled",
  "uiFrontendBrowserRenderingImplemented"
]);

async function readFixture() {
  return JSON.parse(await readFile(fixtureUrl, "utf8"));
}

async function expectCliFailure(args) {
  try {
    await execFileAsync(process.execPath, [cliPath, ...args], {
      cwd: repoRoot,
      env: { ...process.env, NO_COLOR: "1" }
    });
  } catch (error) {
    return error;
  }

  assert.fail(`expected CLI command to fail: ${args.join(" ")}`);
}

function assertAllFalse(record) {
  for (const [key, value] of Object.entries(record)) {
    assert.equal(value, false, `${key} should be false`);
  }
}

function assertNonAuthorizing(result) {
  const valid =
    createMaintenanceGovernanceAdrDependencyPolicyContractBoundaryMapForReview({
      reviewedAt
    });
  const runtimeFlagNames = Object.keys(
    valid.boundaryEntries[0].unsafeMaintenanceGovernanceRuntimeFlags
  );

  for (const field of runtimeFlagNames) {
    assert.equal(result[field], false, `${field} should be false`);
  }

  assert.equal(result.reportRunsChecks, false);
  assert.equal(result.nonAuthorizingProof, true);
  assertAllFalse(result.runtimeEffect);
}

function boundaryEntryPatch(patch) {
  const [entry] =
    createMaintenanceGovernanceAdrDependencyPolicyContractBoundaryMapForReview({
      reviewedAt
    }).boundaryEntries;

  return [{ ...structuredClone(entry), ...patch }];
}

test("Phase 5.71 maintenance/governance boundary map fixture is deterministic", async () => {
  const fixture = await readFixture();
  const generated =
    createMaintenanceGovernanceAdrDependencyPolicyContractBoundaryMapForReview({
      reviewedAt
    });

  assert.deepEqual(fixture, generated);
  assert.equal(
    fixture.schema,
    MAINTENANCE_GOVERNANCE_ADR_DEPENDENCY_POLICY_CONTRACT_BOUNDARY_MAP_SCHEMA
  );
  assert.equal(fixture.reviewedAt, reviewedAt);
  assert.equal(
    fixture.classification,
    expectedCaseClassifications[
      "valid-maintenance-governance-adr-dependency-policy-contract-boundary-map"
    ]
  );
  assert.equal(
    fixture.maintenanceGovernanceAdrDependencyPolicyContractBoundaryMapProduced,
    true
  );
  assert.equal(
    fixture.maintenanceGovernanceAdrDependencyPolicyContractBoundaryMapMode,
    "review-only"
  );
  assert.equal(fixture.boundaryEntries.length, 22);
  assertNonAuthorizing(fixture);
});

test("Phase 5.71 covers requested maintenance/governance families, systems, and statuses", async () => {
  const fixture = await readFixture();
  const state =
    fixture.maintenanceGovernanceAdrDependencyPolicyContractBoundaryMap;
  const summary = fixture.boundaryMapSummary;

  assert.deepEqual(summary.boundaryFamilies, expectedBoundaryFamilies);
  assert.deepEqual(summary.relatedSystems, expectedRelatedSystems);
  assert.deepEqual(summary.currentStatusValues, expectedStatusValues);
  assert.equal(
    state.sourcePhaseContext.productionReadinessMaintenanceGovernanceItemDeferred,
    true
  );
  assert.equal(
    state.sourcePhaseContext.noMaintenanceGovernanceRuntimeImplemented,
    true
  );
  assert.equal(
    state.sourcePhaseContext.noDependencyUpdatePatchAutomationImplemented,
    true
  );
  assert.equal(
    state.sourcePhaseContext.noReleasePublishingCiModificationImplemented,
    true
  );
  assert.equal(state.sourcePhaseContext.noCodeModeRuntimeImplemented, true);
  assert.equal(state.sourcePhaseContext.runtimeStillBlocked, true);

  for (const family of expectedBoundaryFamilies) {
    assert.ok(summary.countByFamily[family] >= 1, family);
  }

  for (const system of expectedRelatedSystems) {
    assert.ok(summary.countByRelatedSystem[system] >= 1, system);
  }

  for (const status of expectedStatusValues) {
    assert.ok(summary.countByStatus[status] >= 1, status);
  }

  for (const entry of fixture.boundaryEntries) {
    assert.match(entry.boundaryId, /^phase5-71\./);
    assert.ok(expectedBoundaryFamilies.includes(entry.boundaryFamily));
    assert.ok(expectedRelatedSystems.includes(entry.relatedSystem));
    assert.ok(expectedStatusValues.includes(entry.currentStatus));
    assert.equal(entry.maintenanceGovernanceBoundaryMetadataOnly, true);
    assert.equal(entry.noLiveMaintenanceGovernanceRuntimePerformed, true);
    assert.equal(entry.nonAuthorizingProof, true);
    assertAllFalse(entry.explicitBlockedAuthorizationFlags);
    assertAllFalse(entry.unsafeMaintenanceGovernanceRuntimeFlags);
    assertAllFalse(entry.runtimeEffect);
    assert.ok(entry.forbiddenCurrentBehavior.includes("dependency update bot"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("Code Mode runtime"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("Jules automation"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("command exposure"));
  }

  assert.ok(
    fixture.boundaryEntries.some(
      (entry) =>
        entry.boundaryFamily === "jules_review_boundary" &&
        entry.currentStatus === "blocked"
    )
  );
  assert.ok(
    fixture.boundaryEntries.some(
      (entry) =>
        entry.boundaryFamily === "subagent_review_boundary" &&
        /one narrow Codex read-only reviewer/.test(
          entry.reviewOwnershipExpectation
        )
    )
  );
  assert.ok(
    fixture.boundaryEntries.some(
      (entry) =>
        entry.boundaryFamily === "governance_policy_contract" &&
        /Per-Repo Model Program/.test(entry.subject)
    )
  );
});

test("Phase 5.71 invalid maintenance/governance cases fail closed", () => {
  const valid =
    createMaintenanceGovernanceAdrDependencyPolicyContractBoundaryMapForReview({
      reviewedAt
    });
  const firstEntry = valid.boundaryEntries[0];
  const missingBoundaryIdEntry = { ...firstEntry };
  delete missingBoundaryIdEntry.boundaryId;

  const cases = [
    [
      null,
      "malformed-maintenance-governance-adr-dependency-policy-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt: "not-a-date" },
      "malformed-maintenance-governance-adr-dependency-policy-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, boundaryEntries: [missingBoundaryIdEntry] },
      "missing-required-maintenance-governance-adr-dependency-policy-contract-boundary-entry-rejected"
    ],
    [
      { reviewedAt, unknownField: true },
      "unknown-top-level-field-maintenance-governance-adr-dependency-policy-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, boundaryEntries: boundaryEntryPatch({ boundaryFamily: "adr_runtime" }) },
      "unknown-boundary-family-maintenance-governance-adr-dependency-policy-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, boundaryEntries: boundaryEntryPatch({ relatedSystem: "governance" }) },
      "unknown-related-system-maintenance-governance-adr-dependency-policy-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, boundaryEntries: boundaryEntryPatch({ currentStatus: "enabled" }) },
      "unknown-current-status-maintenance-governance-adr-dependency-policy-contract-boundary-map-input-rejected"
    ],
    [
      {
        reviewedAt,
        boundaryEntries: boundaryEntryPatch({
          explicitBlockedAuthorizationFlags: {
            ...firstEntry.explicitBlockedAuthorizationFlags,
            dependencyUpdateAutomationAuthorizationGranted: true
          }
        })
      },
      "authorization-flags-enabled-maintenance-governance-adr-dependency-policy-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, reportRunsChecks: true },
      "report-runs-checks-true-maintenance-governance-adr-dependency-policy-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, runtimeAuthorized: true },
      "runtime-authorization-attempt-maintenance-governance-adr-dependency-policy-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, commandExposureEnabled: true },
      "command-exposure-attempt-maintenance-governance-adr-dependency-policy-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, blockedCliBypassEnabled: true },
      "blocked-cli-bypass-attempt-maintenance-governance-adr-dependency-policy-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, dependencyUpdateBot: { enabled: false } },
      "hidden-dependency-update-patch-execution-semantics-maintenance-governance-adr-dependency-policy-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, releasePublisher: { enabled: false } },
      "hidden-release-ci-publishing-automation-semantics-maintenance-governance-adr-dependency-policy-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, graphifyRuntime: { enabled: false } },
      "hidden-graphify-memory-mutation-semantics-maintenance-governance-adr-dependency-policy-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, codeModeRuntime: { enabled: false } },
      "hidden-code-mode-runtime-semantics-maintenance-governance-adr-dependency-policy-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, julesAutomation: { enabled: false } },
      "hidden-subagent-jules-automation-semantics-maintenance-governance-adr-dependency-policy-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, externalRepoImport: "NousResearch/hermes-agent" },
      "hidden-external-reference-vendoring-copying-semantics-maintenance-governance-adr-dependency-policy-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, httpServer: { enabled: false } },
      "hidden-backend-api-server-semantics-maintenance-governance-adr-dependency-policy-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, databaseUrl: "postgres://example.invalid/db" },
      "hidden-database-storage-cache-write-semantics-maintenance-governance-adr-dependency-policy-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, sessionToken: "token" },
      "hidden-auth-session-token-api-key-semantics-maintenance-governance-adr-dependency-policy-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, connectorGrant: { enabled: false } },
      "hidden-connector-grant-semantics-maintenance-governance-adr-dependency-policy-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, fabricBus: { enabled: false } },
      "hidden-fabric-websocket-http-mcp-task-runtime-semantics-maintenance-governance-adr-dependency-policy-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, secureDropKeyring: { enabled: false } },
      "hidden-secure-drop-implementation-semantics-maintenance-governance-adr-dependency-policy-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, encodedHandoffRuntime: { enabled: false } },
      "hidden-encoded-handoff-codec-translator-stego-covert-channel-tokenizer-exploit-bypass-semantics-maintenance-governance-adr-dependency-policy-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, hermesRuntime: { enabled: false } },
      "hidden-hermes-cua-computer-use-runtime-semantics-maintenance-governance-adr-dependency-policy-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, terraformPlan: { enabled: false } },
      "hidden-infrastructure-deployment-compliance-pii-retention-export-semantics-maintenance-governance-adr-dependency-policy-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, ciPipeline: { enabled: false } },
      "hidden-testing-ci-release-automation-semantics-maintenance-governance-adr-dependency-policy-contract-boundary-map-input-rejected"
    ],
    [
      {
        reviewedAt,
        boundaryEntries: boundaryEntryPatch({
          unsafeMaintenanceGovernanceRuntimeFlags: {
            ...firstEntry.unsafeMaintenanceGovernanceRuntimeFlags,
            dependencyUpdateAutomationEnabled: true
          }
        })
      },
      "unsafe-maintenance-governance-runtime-flags-maintenance-governance-adr-dependency-policy-contract-boundary-map-input-rejected"
    ],
    [
      {
        reviewedAt,
        boundaryEntries: boundaryEntryPatch({
          runtimeEffect: { ...firstEntry.runtimeEffect, runtimeReady: true }
        })
      },
      "nested-unsafe-flags-maintenance-governance-adr-dependency-policy-contract-boundary-map-input-rejected"
    ],
    [
      {
        reviewedAt,
        boundaryEntries: [
          valid.boundaryEntries[1],
          valid.boundaryEntries[0],
          ...valid.boundaryEntries.slice(2)
        ]
      },
      "noncanonical-maintenance-governance-adr-dependency-policy-contract-boundary-map-input-rejected"
    ]
  ];

  for (const [input, caseKey] of cases) {
    const result =
      createMaintenanceGovernanceAdrDependencyPolicyContractBoundaryMapForReview(
        input
      );
    assert.equal(
      result.classification,
      expectedCaseClassifications[caseKey],
      caseKey
    );
    assert.equal(
      result.maintenanceGovernanceAdrDependencyPolicyContractBoundaryMapProduced,
      false,
      caseKey
    );
    assert.equal(result.boundaryEntries.length, 0, caseKey);
    assertNonAuthorizing(result);
  }
});

test("Phase 5.71 enabled runtime flags cannot authorize maintenance/governance behavior", () => {
  for (const field of unsafeFlagCases) {
    const result =
      createMaintenanceGovernanceAdrDependencyPolicyContractBoundaryMapForReview(
        {
          reviewedAt,
          [field]: true
        }
      );

    assert.equal(
      result.classification,
      expectedCaseClassifications[
        "unsafe-maintenance-governance-runtime-flags-maintenance-governance-adr-dependency-policy-contract-boundary-map-input-rejected"
      ],
      field
    );
    assert.equal(
      result.maintenanceGovernanceAdrDependencyPolicyContractBoundaryMapProduced,
      false,
      field
    );
    assertNonAuthorizing(result);
  }
});

test("Phase 5.71 boundary map stays non-authorizing and runtime-blocked", async () => {
  const fixture = await readFixture();
  const summary = fixture.boundaryMapSummary;

  for (const field of [
    "phase548MaintenanceGovernanceCoverageItemRepresented",
    "maintenanceGovernanceBoundaryMetadataOnly",
    "noLiveMaintenanceGovernanceRuntimePerformed",
    "adrPolicyBoundaryRecorded",
    "architectureDiagramUpdateBoundaryRecorded",
    "dependencyUpdatePolicyBoundaryRecorded",
    "vulnerabilityPatchPolicyBoundaryRecorded",
    "dependencyAuditEvidenceBoundaryRecorded",
    "waiverExceptionPolicyBoundaryRecorded",
    "releaseGovernanceVersioningPolicyBoundaryRecorded",
    "ownershipMaintainerBoundaryRecorded",
    "externalReferencePolicyBoundaryRecorded",
    "toolkitUsageBoundaryRecorded",
    "subagentReviewBoundaryRecorded",
    "julesReviewBoundaryRecorded",
    "graphifyMemoryBoundaryRecorded",
    "codeModeGovernanceBoundaryRecorded",
    "productionReadinessGovernanceBoundaryRecorded",
    "perRepoModelProgramBoundaryRecorded",
    "noAdrGenerator",
    "noDiagramGenerator",
    "noDependencyUpdateBot",
    "noVulnerabilityPatchAutomation",
    "noReleasePublishingCiModification",
    "noWaiverAutomationPolicyEngine",
    "noGraphifyMutation",
    "noCodeModeRuntime",
    "noSubagentRuntimeJulesAutomation",
    "noExternalRepoVendoringCopying",
    "noPackageDeploymentBehavior",
    "noRuntimeIntegrationBackendStorageBehavior",
    "noFabricSecureDropEncodedHandoffRuntime",
    "noHermesCuaComputerUseRuntime",
    "noLoggerAuditTelemetryHealthInfrastructureRuntime",
    "noTestingCiReleaseAutomation",
    "noCommandExposure",
    "noBlockedCliBypass",
    "allBlockedAuthorizationFlagsFalse",
    "allUnsafeMaintenanceGovernanceRuntimeFlagsFalse",
    "allRuntimeEffectsFalse",
    "allEntriesNonAuthorizing"
  ]) {
    assert.equal(summary[field], true, `${field} should be true`);
  }

  assertNonAuthorizing(fixture);
  assert.equal(
    fixture.recommendedNextPhase,
    "phase-5.72-review-only-secrets-management-key-rotation-contract-boundary-map"
  );
});

test("serve-runtime remains default-blocked and dry-run cannot bypass Phase 5.71", async () => {
  const direct = await expectCliFailure(["serve-runtime"]);
  assert.notEqual(direct.code, 0);
  assert.equal(direct.stdout, "");

  const dryRun = await expectCliFailure(["serve-runtime", "--dry-run"]);
  assert.notEqual(dryRun.code, 0);
  assert.equal(dryRun.stdout, "");
});

test("Phase 5.71 maintenance/governance command names remain rejected", async () => {
  for (const command of commandProbes) {
    const error = await expectCliFailure([command]);
    assert.notEqual(error.code, 0, command);
    assert.equal(error.stdout, "", command);
  }
});

test("Phase 5.71 does not change CLI, Rust, Fabric, package, or consumer source", async () => {
  const files = [
    "apps/cli/src/index.mjs",
    "crates/ardyn-host/src/lib.rs",
    "crates/ardyn-host/src/stdio_runtime/mod.rs",
    "packages/fabric/src/index.mjs",
    "package.json"
  ];

  for (const file of files) {
    const [baseline, current] = await Promise.all([
      execFileAsync("git", ["show", `${phase571BaselineCommit}:${file}`], {
        cwd: repoRoot,
        maxBuffer: 20 * 1024 * 1024
      }),
      readFile(new URL(`../${file}`, import.meta.url), "utf8")
    ]);

    assert.equal(
      current.replaceAll("\r\n", "\n"),
      baseline.stdout.replaceAll("\r\n", "\n"),
      `${file} should not change`
    );
  }

  const currentCliSource = await readFile(cliPath, "utf8");
  for (const command of commandProbes) {
    assert.doesNotMatch(currentCliSource, new RegExp(command));
  }
});
