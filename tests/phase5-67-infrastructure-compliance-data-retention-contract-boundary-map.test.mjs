import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";
import {
  INFRASTRUCTURE_COMPLIANCE_DATA_RETENTION_CONTRACT_BOUNDARY_MAP_SCHEMA,
  createInfrastructureComplianceDataRetentionContractBoundaryMapForReview
} from "../packages/core/src/index.mjs";

const execFileAsync = promisify(execFile);
const phase567BaselineCommit = "b7584a607bc3744488705e50f647ceb22849b9d0";
const reviewedAt = "2026-06-24T00:00:00.000Z";
const repoRootUrl = new URL("../", import.meta.url);
const repoRoot = fileURLToPath(repoRootUrl);
const cliPath = fileURLToPath(new URL("../apps/cli/src/index.mjs", import.meta.url));
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-67/infrastructure-compliance-data-retention-contract-boundary-map.json",
  import.meta.url
);

const expectedCaseClassifications = Object.freeze({
  "valid-infrastructure-compliance-data-retention-contract-boundary-map":
    "valid_infrastructure_compliance_data_retention_contract_boundary_map_runtime_still_blocked",
  "malformed-infrastructure-compliance-data-retention-contract-boundary-map-input-rejected":
    "malformed_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected",
  "missing-required-infrastructure-compliance-data-retention-contract-boundary-entry-rejected":
    "missing_required_infrastructure_compliance_data_retention_contract_boundary_entry_rejected",
  "unknown-top-level-field-infrastructure-compliance-data-retention-contract-boundary-map-input-rejected":
    "unknown_top_level_field_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected",
  "unknown-boundary-family-infrastructure-compliance-data-retention-contract-boundary-map-input-rejected":
    "unknown_boundary_family_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected",
  "unknown-related-system-infrastructure-compliance-data-retention-contract-boundary-map-input-rejected":
    "unknown_related_system_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected",
  "unknown-current-status-infrastructure-compliance-data-retention-contract-boundary-map-input-rejected":
    "unknown_current_status_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected",
  "authorization-flags-enabled-infrastructure-compliance-data-retention-contract-boundary-map-input-rejected":
    "authorization_flags_enabled_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected",
  "report-runs-checks-true-infrastructure-compliance-data-retention-contract-boundary-map-input-rejected":
    "report_runs_checks_true_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected",
  "runtime-authorization-attempt-infrastructure-compliance-data-retention-contract-boundary-map-input-rejected":
    "runtime_authorization_attempt_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected",
  "command-exposure-attempt-infrastructure-compliance-data-retention-contract-boundary-map-input-rejected":
    "command_exposure_attempt_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected",
  "blocked-cli-bypass-attempt-infrastructure-compliance-data-retention-contract-boundary-map-input-rejected":
    "blocked_cli_bypass_attempt_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected",
  "hidden-infrastructure-automation-semantics-infrastructure-compliance-data-retention-contract-boundary-map-input-rejected":
    "hidden_infrastructure_automation_semantics_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected",
  "hidden-deployment-cloud-provisioning-semantics-infrastructure-compliance-data-retention-contract-boundary-map-input-rejected":
    "hidden_deployment_cloud_provisioning_semantics_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected",
  "hidden-compliance-certification-enforcement-semantics-infrastructure-compliance-data-retention-contract-boundary-map-input-rejected":
    "hidden_compliance_certification_enforcement_semantics_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected",
  "hidden-pii-collection-processing-semantics-infrastructure-compliance-data-retention-contract-boundary-map-input-rejected":
    "hidden_pii_collection_processing_semantics_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected",
  "hidden-retention-deletion-export-execution-semantics-infrastructure-compliance-data-retention-contract-boundary-map-input-rejected":
    "hidden_retention_deletion_export_execution_semantics_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected",
  "hidden-vendor-external-service-integration-semantics-infrastructure-compliance-data-retention-contract-boundary-map-input-rejected":
    "hidden_vendor_external_service_integration_semantics_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected",
  "hidden-secret-env-vault-access-semantics-infrastructure-compliance-data-retention-contract-boundary-map-input-rejected":
    "hidden_secret_env_vault_access_semantics_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected",
  "hidden-backend-api-server-semantics-infrastructure-compliance-data-retention-contract-boundary-map-input-rejected":
    "hidden_backend_api_server_semantics_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected",
  "hidden-database-storage-cache-write-semantics-infrastructure-compliance-data-retention-contract-boundary-map-input-rejected":
    "hidden_database_storage_cache_write_semantics_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected",
  "hidden-auth-session-token-api-key-semantics-infrastructure-compliance-data-retention-contract-boundary-map-input-rejected":
    "hidden_auth_session_token_api_key_semantics_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected",
  "hidden-connector-grant-semantics-infrastructure-compliance-data-retention-contract-boundary-map-input-rejected":
    "hidden_connector_grant_semantics_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected",
  "hidden-fabric-websocket-http-mcp-task-runtime-semantics-infrastructure-compliance-data-retention-contract-boundary-map-input-rejected":
    "hidden_fabric_websocket_http_mcp_task_runtime_semantics_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected",
  "hidden-secure-drop-implementation-semantics-infrastructure-compliance-data-retention-contract-boundary-map-input-rejected":
    "hidden_secure_drop_implementation_semantics_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected",
  "hidden-encoded-handoff-codec-translator-stego-covert-channel-tokenizer-exploit-bypass-semantics-infrastructure-compliance-data-retention-contract-boundary-map-input-rejected":
    "hidden_encoded_handoff_codec_translator_stego_covert_channel_tokenizer_exploit_bypass_semantics_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected",
  "hidden-logger-audit-transcript-telemetry-external-sink-semantics-infrastructure-compliance-data-retention-contract-boundary-map-input-rejected":
    "hidden_logger_audit_transcript_telemetry_external_sink_semantics_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected",
  "hidden-health-backup-restore-failover-scheduler-process-supervisor-semantics-infrastructure-compliance-data-retention-contract-boundary-map-input-rejected":
    "hidden_health_backup_restore_failover_scheduler_process_supervisor_semantics_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected",
  "unsafe-infrastructure-compliance-data-retention-runtime-flags-infrastructure-compliance-data-retention-contract-boundary-map-input-rejected":
    "unsafe_infrastructure_compliance_data_retention_runtime_flags_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected",
  "nested-unsafe-flags-infrastructure-compliance-data-retention-contract-boundary-map-input-rejected":
    "nested_unsafe_flags_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected",
  "noncanonical-infrastructure-compliance-data-retention-contract-boundary-map-input-rejected":
    "noncanonical_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected"
});

const expectedBoundaryIds = Object.freeze([
  "phase5-67.repo_family.infrastructure_ownership.infrastructure_management_boundary",
  "phase5-67.repo_family.deployment_environment_separation.deployment_governance_boundary",
  "phase5-67.ardyn.local_dev_staging_production_environment.environment_boundary",
  "phase5-67.repo_family.compliance_readiness_posture.compliance_readiness_boundary",
  "phase5-67.repo_family.gdpr_ccpa_soc2_evidence_planning.compliance_readiness_boundary",
  "phase5-67.ardyn.pii_classification_transcripts_audit_identity_secure_drop_user_content.pii_boundary",
  "phase5-67.ardyn.data_processing_inventory.data_processing_inventory_boundary",
  "phase5-67.ardyn.retention_policy.phase561_phase565.data_retention_boundary",
  "phase5-67.ardyn.deletion_policy.phase561_phase565.data_deletion_boundary",
  "phase5-67.ardyn.export_policy.phase561_phase565.data_export_boundary",
  "phase5-67.repo_family.backup_recovery_compliance_evidence.phase566.policy_governance_boundary",
  "phase5-67.ardyn.auth_permission_subject_consent_traceability.phase562.policy_governance_boundary",
  "phase5-67.ardyn.security_rls_input_sanitization_compliance.phase563.policy_governance_boundary",
  "phase5-67.ardyn.rate_limit_abuse_evidence.phase564.policy_governance_boundary",
  "phase5-67.ardyn.error_log_audit_integrity_evidence.phase565.policy_governance_boundary",
  "phase5-67.repo_family.fabric_coordination_envelope_compliance.fabric_compliance_boundary",
  "phase5-67.locus.compliance_status_visibility.compliance_readiness_boundary",
  "phase5-67.multiverse.capability_task_compliance_status.compliance_readiness_boundary",
  "phase5-67.ardyn.mcp_tool_exposure_compliance.deployment_governance_boundary",
  "phase5-67.repo_family.connector_vendor_external_service_compliance.vendor_boundary",
  "phase5-67.content_fabric.secure_drop_compliance.secure_drop_compliance_boundary",
  "phase5-67.ardyn.secrets_env_vault_governance.environment_boundary",
  "phase5-67.repo_family.license_provenance_dependency_compliance_evidence.policy_governance_boundary",
  "phase5-67.ardyn_subagent.encoded_handoff_compliance.phase560.policy_governance_boundary"
]);

const commandProbes = Object.freeze([
  "infrastructure-compliance-data-retention-contract-boundary-map",
  "infrastructure-automation-runtime",
  "deployment-automation-runtime",
  "cloud-provisioning-runtime",
  "compliance-enforcement-runtime",
  "pii-processing-runtime",
  "data-retention-job-runtime",
  "data-deletion-job-runtime",
  "data-export-job-runtime",
  "vendor-integration-runtime",
  "external-service-lookup-runtime",
  "policy-engine-runtime",
  "secrets-governance-runtime",
  "secure-drop-compliance-runtime",
  "fabric-compliance-runtime"
]);

const nonAuthorizingResultFields = Object.freeze([
  "reportRunsChecks",
  "infrastructureAutomationImplemented",
  "deploymentAutomationImplemented",
  "cloudProvisioningImplemented",
  "environmentManagerImplemented",
  "complianceAutomationImplemented",
  "complianceEnforcementImplemented",
  "complianceCertificationClaimed",
  "gdprComplianceClaimed",
  "ccpaComplianceClaimed",
  "soc2ComplianceClaimed",
  "piiProcessingImplemented",
  "piiCollectionImplemented",
  "dataRetentionJobImplemented",
  "dataDeletionJobImplemented",
  "dataExportJobImplemented",
  "policyEngineImplemented",
  "runtimeGovernanceImplemented",
  "vendorIntegrationImplemented",
  "externalServiceLookupEnabled",
  "secretVaultEnvAccessEnabled",
  "secretsRuntimeIngestionEnabled",
  "backendRuntimeImplementedByArdyn",
  "backendApiServerMiddlewareImplemented",
  "apiEndpointImplementedByArdyn",
  "serverImplementedByArdyn",
  "databaseClientImplemented",
  "databaseStorageRuntimeWritesEnabled",
  "databaseSchemaImplemented",
  "databaseMigrationImplemented",
  "rlsRuntimeImplemented",
  "rlsPolicyImplemented",
  "storageAdapterImplemented",
  "cacheEngineImplemented",
  "cacheInvalidationRuntimeImplemented",
  "transcriptWriterImplemented",
  "auditWriterImplemented",
  "loggerRuntimeImplemented",
  "logWriterImplemented",
  "telemetryClientImplemented",
  "externalSinkImplemented",
  "importExportPathImplementedByArdyn",
  "packageDistributionImplementedByArdyn",
  "persistencePathImplementedByArdyn",
  "persistenceImplementedByArdyn",
  "websocketHttpTransportImplementedByArdyn",
  "fabricRuntimeImplementedByArdyn",
  "encodedHandoffRuntimeImplementedByArdyn",
  "codecImplemented",
  "translatorRuntimeImplemented",
  "commandExposureEnabled",
  "commandRuntimeControlEnabled",
  "runtimeExecutionEnabled",
  "runtimeAuthorizationEnabled",
  "connectorGrantProduced",
  "mcpToolExposureEnabled",
  "taskExecutionEnabled",
  "secureDropImplemented",
  "secureDropCryptoImplemented",
  "secureDropTransportImplemented",
  "secureDropStegoImplemented",
  "secureDropSendReceiveImplemented",
  "secureDropInboxPollingEnabled",
  "st3ggVendored",
  "serviceDiscoveryEnabled",
  "scheduleEnforcementEnabled",
  "schedulerImplemented",
  "backgroundPollingEnabled",
  "pollingEnabled",
  "filesystemWriteEnabled",
  "filesystemScanningEnabled",
  "processControlEnabled",
  "uiFrontendBrowserRenderingImplemented",
  "healthCheckerImplemented",
  "healthCheckRuntimeImplemented",
  "monitorImplemented",
  "monitoringRuntimeImplemented",
  "backupJobImplemented",
  "restoreJobImplemented",
  "failoverRuntimeImplemented",
  "degradedModeRuntimeImplemented",
  "recoveryAutomationImplemented",
  "processSupervisorImplemented",
  "processSupervisionRuntimeImplemented",
  "approvalDecisionProduced",
  "approvalGrantProduced",
  "permissionEvaluatorImplemented",
  "authorizationEvaluatorImplemented",
  "blockedCliBypassEnabled"
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
  for (const field of nonAuthorizingResultFields) {
    assert.equal(result[field], false, `${field} should be false`);
  }

  assert.equal(result.nonAuthorizingProof, true);
  assertAllFalse(result.runtimeEffect);
}

function boundaryEntryPatch(patch) {
  const [entry] =
    createInfrastructureComplianceDataRetentionContractBoundaryMapForReview({
      reviewedAt
    }).boundaryEntries;

  return [{ ...structuredClone(entry), ...patch }];
}

test("Phase 5.67 infrastructure/compliance/data-retention boundary map fixture is deterministic", async () => {
  const fixture = await readFixture();
  const generated =
    createInfrastructureComplianceDataRetentionContractBoundaryMapForReview({
      reviewedAt
    });

  assert.deepEqual(fixture, generated);
  assert.equal(
    fixture.schema,
    INFRASTRUCTURE_COMPLIANCE_DATA_RETENTION_CONTRACT_BOUNDARY_MAP_SCHEMA
  );
  assert.equal(fixture.reviewedAt, reviewedAt);
  assert.equal(
    fixture.classification,
    expectedCaseClassifications[
      "valid-infrastructure-compliance-data-retention-contract-boundary-map"
    ]
  );
  assert.equal(
    fixture.infrastructureComplianceDataRetentionContractBoundaryMapProduced,
    true
  );
  assert.equal(
    fixture.infrastructureComplianceDataRetentionContractBoundaryMapMode,
    "review-only"
  );
  assert.equal(fixture.boundaryEntries.length, 24);
  assert.deepEqual(
    fixture.boundaryEntries.map(({ boundaryId }) => boundaryId),
    expectedBoundaryIds
  );
  assertNonAuthorizing(fixture);
});

test("Phase 5.67 references Phase 5.48 through 5.66 and content-fabric ownership", async () => {
  const fixture = await readFixture();
  const state =
    fixture.infrastructureComplianceDataRetentionContractBoundaryMap;

  assert.equal(
    state.sourcePhaseContext.phase548InfrastructureManagementComplianceAreaNumber,
    14
  );
  assert.equal(
    state.sourcePhaseContext.phase548InfrastructureManagementComplianceStatus,
    "deferred"
  );
  assert.equal(state.sourcePhaseContext.secureDropCanonicalOwner, "content-fabric");
  assert.equal(state.sourcePhaseContext.complianceCertificationClaimed, false);
  assert.equal(state.sourcePhaseContext.runtimeStillBlocked, true);
  assert.equal(
    fixture.boundaryMapSummary
      .phase548InfrastructureManagementComplianceCoverageItemRepresented,
    true
  );
  assert.equal(
    fixture.boundaryMapSummary.phase559FabricAwareApiBackendBoundaryReferenced,
    true
  );
  assert.equal(
    fixture.boundaryMapSummary.phase560EncodedHandoffConformanceReferenced,
    true
  );
  assert.equal(
    fixture.boundaryMapSummary.phase561DatabaseStorageContractBoundaryReferenced,
    true
  );
  assert.equal(
    fixture.boundaryMapSummary.phase562AuthPermissionsContractBoundaryReferenced,
    true
  );
  assert.equal(
    fixture.boundaryMapSummary
      .phase563SecurityRlsInputSanitizationBoundaryReferenced,
    true
  );
  assert.equal(
    fixture.boundaryMapSummary.phase564RateLimitingAbuseControlBoundaryReferenced,
    true
  );
  assert.equal(
    fixture.boundaryMapSummary
      .phase565ErrorTrackingLoggingAuditIntegrityBoundaryReferenced,
    true
  );
  assert.equal(
    fixture.boundaryMapSummary.phase566AvailabilityRecoveryBoundaryReferenced,
    true
  );

  for (const entry of fixture.boundaryEntries) {
    assert.equal(entry.productionReadinessAreaReference.areaNumber, 14);
    assert.equal(entry.productionReadinessAreaReference.authorizesRuntime, false);
    assert.equal(entry.phase559FabricAwareApiBackendReference.implementsFabricRuntime, false);
    assert.equal(
      entry.phase560InterAgentEncodedHandoffConformanceReference
        .implementsEncodedHandoffRuntime,
      false
    );
    assert.equal(
      entry.phase561DatabaseStorageContractBoundaryReference
        .implementsDatabaseStorageRuntime,
      false
    );
    assert.equal(
      entry.phase562AuthPermissionsContractBoundaryReference
        .implementsAuthPermissionsRuntime,
      false
    );
    assert.equal(
      entry.phase563SecurityRlsInputSanitizationBoundaryReference
        .implementsSecurityRuntime,
      false
    );
    assert.equal(
      entry.phase564RateLimitingAbuseControlBoundaryReference
        .implementsAbuseRuntime,
      false
    );
    assert.equal(
      entry.phase565ErrorTrackingLoggingAuditIntegrityBoundaryReference
        .implementsObservabilityRuntime,
      false
    );
    assert.equal(
      entry.phase566AvailabilityRecoveryBoundaryReference
        .implementsAvailabilityRecoveryRuntime,
      false
    );
  }
});

test("Phase 5.67 invalid infrastructure/compliance/data-retention boundary cases fail closed", () => {
  const valid =
    createInfrastructureComplianceDataRetentionContractBoundaryMapForReview({
      reviewedAt
    });
  const firstEntry = valid.boundaryEntries[0];
  const missingBoundaryIdEntry = { ...firstEntry };
  delete missingBoundaryIdEntry.boundaryId;

  const cases = [
    [
      null,
      "malformed-infrastructure-compliance-data-retention-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt: "not-a-date" },
      "malformed-infrastructure-compliance-data-retention-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, boundaryEntries: [missingBoundaryIdEntry] },
      "missing-required-infrastructure-compliance-data-retention-contract-boundary-entry-rejected"
    ],
    [
      { reviewedAt, unknownField: true },
      "unknown-top-level-field-infrastructure-compliance-data-retention-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, boundaryEntries: boundaryEntryPatch({ boundaryFamily: "policy_engine_runtime" }) },
      "unknown-boundary-family-infrastructure-compliance-data-retention-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, boundaryEntries: boundaryEntryPatch({ relatedSystem: "external-repo" }) },
      "unknown-related-system-infrastructure-compliance-data-retention-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, boundaryEntries: boundaryEntryPatch({ currentStatus: "implemented" }) },
      "unknown-current-status-infrastructure-compliance-data-retention-contract-boundary-map-input-rejected"
    ],
    [
      {
        reviewedAt,
        boundaryEntries: boundaryEntryPatch({
          explicitBlockedAuthorizationFlags: {
            ...firstEntry.explicitBlockedAuthorizationFlags,
            deploymentAutomationAuthorizationGranted: true
          }
        })
      },
      "authorization-flags-enabled-infrastructure-compliance-data-retention-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, reportRunsChecks: true },
      "report-runs-checks-true-infrastructure-compliance-data-retention-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, runtimeAuthorized: true },
      "runtime-authorization-attempt-infrastructure-compliance-data-retention-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, commandExposureEnabled: true },
      "command-exposure-attempt-infrastructure-compliance-data-retention-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, blockedCliBypassEnabled: true },
      "blocked-cli-bypass-attempt-infrastructure-compliance-data-retention-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, terraformPlan: { enabled: false } },
      "hidden-infrastructure-automation-semantics-infrastructure-compliance-data-retention-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, deployCommand: "ship" },
      "hidden-deployment-cloud-provisioning-semantics-infrastructure-compliance-data-retention-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, soc2Certified: true },
      "hidden-compliance-certification-enforcement-semantics-infrastructure-compliance-data-retention-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, piiProcessor: { enabled: false } },
      "hidden-pii-collection-processing-semantics-infrastructure-compliance-data-retention-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, retentionScheduler: { enabled: false } },
      "hidden-retention-deletion-export-execution-semantics-infrastructure-compliance-data-retention-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, vendorClient: { enabled: false } },
      "hidden-vendor-external-service-integration-semantics-infrastructure-compliance-data-retention-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, vaultPath: "secret/ardyn" },
      "hidden-secret-env-vault-access-semantics-infrastructure-compliance-data-retention-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, httpServer: { enabled: false } },
      "hidden-backend-api-server-semantics-infrastructure-compliance-data-retention-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, databaseUrl: "postgres://example" },
      "hidden-database-storage-cache-write-semantics-infrastructure-compliance-data-retention-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, sessionToken: "token" },
      "hidden-auth-session-token-api-key-semantics-infrastructure-compliance-data-retention-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, connectorComplianceGrant: { enabled: false } },
      "hidden-connector-grant-semantics-infrastructure-compliance-data-retention-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, websocketUrl: "wss://example.invalid" },
      "hidden-fabric-websocket-http-mcp-task-runtime-semantics-infrastructure-compliance-data-retention-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, secureDropKeyring: { enabled: false } },
      "hidden-secure-drop-implementation-semantics-infrastructure-compliance-data-retention-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, codecImplemented: false },
      "hidden-encoded-handoff-codec-translator-stego-covert-channel-tokenizer-exploit-bypass-semantics-infrastructure-compliance-data-retention-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, auditWriter: { path: "audit.jsonl" } },
      "hidden-logger-audit-transcript-telemetry-external-sink-semantics-infrastructure-compliance-data-retention-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, healthChecker: { enabled: false } },
      "hidden-health-backup-restore-failover-scheduler-process-supervisor-semantics-infrastructure-compliance-data-retention-contract-boundary-map-input-rejected"
    ],
    [
      {
        reviewedAt,
        boundaryEntries: boundaryEntryPatch({
          unsafeInfrastructureComplianceDataRetentionRuntimeFlags: {
            ...firstEntry.unsafeInfrastructureComplianceDataRetentionRuntimeFlags,
            infrastructureAutomationImplemented: true
          }
        })
      },
      "unsafe-infrastructure-compliance-data-retention-runtime-flags-infrastructure-compliance-data-retention-contract-boundary-map-input-rejected"
    ],
    [
      {
        reviewedAt,
        boundaryEntries: boundaryEntryPatch({
          runtimeEffect: { ...firstEntry.runtimeEffect, runtimeReady: true }
        })
      },
      "nested-unsafe-flags-infrastructure-compliance-data-retention-contract-boundary-map-input-rejected"
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
      "noncanonical-infrastructure-compliance-data-retention-contract-boundary-map-input-rejected"
    ]
  ];

  for (const [input, caseKey] of cases) {
    const result =
      createInfrastructureComplianceDataRetentionContractBoundaryMapForReview(
        input
      );
    assert.equal(
      result.classification,
      expectedCaseClassifications[caseKey],
      caseKey
    );
    assert.equal(
      result.infrastructureComplianceDataRetentionContractBoundaryMapProduced,
      false,
      caseKey
    );
    assert.equal(result.boundaryEntries.length, 0, caseKey);
    assertNonAuthorizing(result);
  }
});

test("Phase 5.67 boundary entries cover required families, systems, and blocked compliance semantics", async () => {
  const fixture = await readFixture();
  const summary = fixture.boundaryMapSummary;

  assert.deepEqual(summary.countByFamily, {
    infrastructure_management_contract: 1,
    deployment_governance_contract: 2,
    environment_boundary_contract: 2,
    compliance_readiness_contract: 4,
    pii_boundary_contract: 1,
    data_retention_contract: 1,
    data_deletion_contract: 1,
    data_export_contract: 1,
    policy_governance_contract: 7,
    data_processing_inventory_contract: 1,
    vendor_external_service_boundary: 1,
    secure_drop_compliance_boundary: 1,
    fabric_compliance_boundary: 1
  });
  assert.deepEqual(summary.countByRelatedSystem, {
    ardyn: 12,
    "ardyn-subagent": 1,
    locus: 1,
    multiverse: 1,
    "content-fabric": 1,
    "repo-family": 8
  });

  for (const entry of fixture.boundaryEntries) {
    assert.match(entry.boundaryId, /^phase5-67\./);
    assert.equal(entry.infrastructureComplianceDataRetentionBoundaryMetadataOnly, true);
    assert.equal(entry.noLiveInfrastructureComplianceDataRetentionPerformed, true);
    assert.equal(entry.nonAuthorizingProof, true);
    assert.equal(typeof entry.infrastructureOwnershipExpectation, "string");
    assert.equal(typeof entry.environmentSeparationExpectation, "string");
    assert.equal(typeof entry.piiDataClassificationExpectation, "string");
    assert.equal(typeof entry.retentionDeletionExportExpectation, "string");
    assert.equal(typeof entry.compliancePostureNotes, "string");
    assert.equal(typeof entry.vendorExternalServiceExpectation, "string");
    assert.equal(typeof entry.policyGovernanceExpectation, "string");
    assert.doesNotMatch(entry.compliancePostureNotes, /certified|certification achieved|compliant/i);
    assertAllFalse(entry.explicitBlockedAuthorizationFlags);
    assertAllFalse(entry.unsafeInfrastructureComplianceDataRetentionRuntimeFlags);
    assertAllFalse(entry.runtimeEffect);
    assert.ok(entry.forbiddenCurrentBehavior.includes("infrastructure automation"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("deployment automation"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("cloud provisioning"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("PII collection or processing"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("retention job"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("deletion job"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("export job"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("policy engine"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("vendor integration"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("secret/env/vault access"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("websocket/http transport"));
  }
});

test("Phase 5.67 boundary map stays non-authorizing and runtime-blocked", async () => {
  const fixture = await readFixture();
  const summary = fixture.boundaryMapSummary;

  assert.equal(summary.infrastructureComplianceDataRetentionBoundaryMetadataOnly, true);
  assert.equal(summary.noLiveInfrastructureComplianceDataRetentionPerformed, true);
  assert.equal(summary.noInfrastructureAutomationImplemented, true);
  assert.equal(summary.noDeploymentAutomationImplemented, true);
  assert.equal(summary.noCloudProvisioningImplemented, true);
  assert.equal(summary.noComplianceAutomationImplemented, true);
  assert.equal(summary.noComplianceEnforcementImplemented, true);
  assert.equal(summary.noComplianceCertificationClaimed, true);
  assert.equal(summary.noPiiProcessingImplemented, true);
  assert.equal(summary.noRetentionDeletionExportJobsImplemented, true);
  assert.equal(summary.noVendorExternalServiceIntegration, true);
  assert.equal(summary.noSecretsAccess, true);
  assert.equal(summary.noPolicyEngineImplemented, true);
  assert.equal(summary.noBackendApiServerImplemented, true);
  assert.equal(summary.noStorageWrites, true);
  assert.equal(summary.noConnectorGrants, true);
  assert.equal(summary.noSecureDropImplementation, true);
  assert.equal(summary.noFabricRuntime, true);
  assert.equal(summary.noHealthBackupRestoreFailoverRuntime, true);
  assert.equal(summary.allBlockedAuthorizationFlagsFalse, true);
  assert.equal(
    summary.allUnsafeInfrastructureComplianceDataRetentionRuntimeFlagsFalse,
    true
  );
  assert.equal(summary.allRuntimeEffectsFalse, true);
  assert.equal(summary.allEntriesNonAuthorizing, true);
  assertNonAuthorizing(fixture);
  assert.equal(
    fixture.recommendedNextPhase,
    "phase-5.68-review-only-testing-frameworks-quality-gates-contract-boundary-map"
  );
});

test("serve-runtime remains default-blocked and dry-run cannot bypass Phase 5.67", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-67-runtime-"));
  try {
    const direct = await expectCliFailure(["serve-runtime"]);
    assert.notEqual(direct.code, 0);
    assert.equal(direct.stdout, "");

    const dryRun = await expectCliFailure(["serve-runtime", "--dry-run"]);
    assert.notEqual(dryRun.code, 0);
    assert.equal(dryRun.stdout, "");
  } finally {
    await rm(scratch, { force: true, recursive: true });
  }
});

test("Phase 5.67 infrastructure/compliance/runtime command names remain rejected", async () => {
  for (const command of commandProbes) {
    const error = await expectCliFailure([command]);
    assert.notEqual(error.code, 0, command);
    assert.equal(error.stdout, "", command);
  }
});

test("Phase 5.67 does not change CLI, Rust, Fabric, package, or consumer source", async () => {
  const files = [
    "apps/cli/src/index.mjs",
    "crates/ardyn-host/src/lib.rs",
    "crates/ardyn-host/src/stdio_runtime/mod.rs",
    "packages/fabric/src/index.mjs",
    "package.json"
  ];

  for (const file of files) {
    const [baseline, current] = await Promise.all([
      execFileAsync("git", ["show", `${phase567BaselineCommit}:${file}`], {
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
  assert.doesNotMatch(
    currentCliSource,
    /infrastructure-compliance-data-retention-contract-boundary-map/
  );
  assert.doesNotMatch(currentCliSource, /infrastructure-automation-runtime/);
  assert.doesNotMatch(currentCliSource, /deployment-automation-runtime/);
  assert.doesNotMatch(currentCliSource, /cloud-provisioning-runtime/);
  assert.doesNotMatch(currentCliSource, /compliance-enforcement-runtime/);
  assert.doesNotMatch(currentCliSource, /pii-processing-runtime/);
  assert.doesNotMatch(currentCliSource, /data-retention-job-runtime/);
  assert.doesNotMatch(currentCliSource, /data-deletion-job-runtime/);
  assert.doesNotMatch(currentCliSource, /data-export-job-runtime/);
  assert.doesNotMatch(currentCliSource, /policy-engine-runtime/);
  assert.doesNotMatch(currentCliSource, /vendor-integration-runtime/);
  assert.doesNotMatch(currentCliSource, /secure-drop-compliance-runtime/);
  assert.doesNotMatch(currentCliSource, /fabric-compliance-runtime/);
});
