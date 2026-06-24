import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";
import {
  AVAILABILITY_RECOVERY_CONTRACT_BOUNDARY_MAP_SCHEMA,
  createAvailabilityRecoveryContractBoundaryMapForReview
} from "../packages/core/src/index.mjs";

const execFileAsync = promisify(execFile);
const phase566BaselineCommit = "b446f0ad7cafc3b6733e51b384f94e73d67576c4";
const reviewedAt = "2026-06-24T00:00:00.000Z";
const repoRootUrl = new URL("../", import.meta.url);
const repoRoot = fileURLToPath(repoRootUrl);
const cliPath = fileURLToPath(new URL("../apps/cli/src/index.mjs", import.meta.url));
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-66/availability-recovery-contract-boundary-map.json",
  import.meta.url
);

const expectedCaseClassifications = Object.freeze({
  "valid-availability-recovery-contract-boundary-map":
    "valid_availability_recovery_contract_boundary_map_runtime_still_blocked",
  "malformed-availability-recovery-contract-boundary-map-input-rejected":
    "malformed_availability_recovery_contract_boundary_map_input_rejected",
  "missing-required-availability-recovery-contract-boundary-entry-rejected":
    "missing_required_availability_recovery_contract_boundary_entry_rejected",
  "unknown-top-level-field-availability-recovery-contract-boundary-map-input-rejected":
    "unknown_top_level_field_availability_recovery_contract_boundary_map_input_rejected",
  "unknown-boundary-family-availability-recovery-contract-boundary-map-input-rejected":
    "unknown_boundary_family_availability_recovery_contract_boundary_map_input_rejected",
  "unknown-related-system-availability-recovery-contract-boundary-map-input-rejected":
    "unknown_related_system_availability_recovery_contract_boundary_map_input_rejected",
  "unknown-current-status-availability-recovery-contract-boundary-map-input-rejected":
    "unknown_current_status_availability_recovery_contract_boundary_map_input_rejected",
  "authorization-flags-enabled-availability-recovery-contract-boundary-map-input-rejected":
    "authorization_flags_enabled_availability_recovery_contract_boundary_map_input_rejected",
  "report-runs-checks-true-availability-recovery-contract-boundary-map-input-rejected":
    "report_runs_checks_true_availability_recovery_contract_boundary_map_input_rejected",
  "runtime-authorization-attempt-availability-recovery-contract-boundary-map-input-rejected":
    "runtime_authorization_attempt_availability_recovery_contract_boundary_map_input_rejected",
  "command-exposure-attempt-availability-recovery-contract-boundary-map-input-rejected":
    "command_exposure_attempt_availability_recovery_contract_boundary_map_input_rejected",
  "blocked-cli-bypass-attempt-availability-recovery-contract-boundary-map-input-rejected":
    "blocked_cli_bypass_attempt_availability_recovery_contract_boundary_map_input_rejected",
  "hidden-health-check-runtime-semantics-availability-recovery-contract-boundary-map-input-rejected":
    "hidden_health_check_runtime_semantics_availability_recovery_contract_boundary_map_input_rejected",
  "hidden-monitor-scheduler-semantics-availability-recovery-contract-boundary-map-input-rejected":
    "hidden_monitor_scheduler_semantics_availability_recovery_contract_boundary_map_input_rejected",
  "hidden-backup-restore-execution-semantics-availability-recovery-contract-boundary-map-input-rejected":
    "hidden_backup_restore_execution_semantics_availability_recovery_contract_boundary_map_input_rejected",
  "hidden-failover-degraded-mode-runtime-semantics-availability-recovery-contract-boundary-map-input-rejected":
    "hidden_failover_degraded_mode_runtime_semantics_availability_recovery_contract_boundary_map_input_rejected",
  "hidden-process-supervision-semantics-availability-recovery-contract-boundary-map-input-rejected":
    "hidden_process_supervision_semantics_availability_recovery_contract_boundary_map_input_rejected",
  "hidden-backend-api-server-semantics-availability-recovery-contract-boundary-map-input-rejected":
    "hidden_backend_api_server_semantics_availability_recovery_contract_boundary_map_input_rejected",
  "hidden-database-storage-cache-write-semantics-availability-recovery-contract-boundary-map-input-rejected":
    "hidden_database_storage_cache_write_semantics_availability_recovery_contract_boundary_map_input_rejected",
  "hidden-auth-session-token-api-key-semantics-availability-recovery-contract-boundary-map-input-rejected":
    "hidden_auth_session_token_api_key_semantics_availability_recovery_contract_boundary_map_input_rejected",
  "hidden-connector-grant-semantics-availability-recovery-contract-boundary-map-input-rejected":
    "hidden_connector_grant_semantics_availability_recovery_contract_boundary_map_input_rejected",
  "hidden-fabric-websocket-http-mcp-task-runtime-semantics-availability-recovery-contract-boundary-map-input-rejected":
    "hidden_fabric_websocket_http_mcp_task_runtime_semantics_availability_recovery_contract_boundary_map_input_rejected",
  "hidden-secure-drop-implementation-semantics-availability-recovery-contract-boundary-map-input-rejected":
    "hidden_secure_drop_implementation_semantics_availability_recovery_contract_boundary_map_input_rejected",
  "hidden-encoded-handoff-codec-translator-stego-covert-channel-tokenizer-exploit-bypass-semantics-availability-recovery-contract-boundary-map-input-rejected":
    "hidden_encoded_handoff_codec_translator_stego_covert_channel_tokenizer_exploit_bypass_semantics_availability_recovery_contract_boundary_map_input_rejected",
  "hidden-logger-audit-transcript-telemetry-external-sink-semantics-availability-recovery-contract-boundary-map-input-rejected":
    "hidden_logger_audit_transcript_telemetry_external_sink_semantics_availability_recovery_contract_boundary_map_input_rejected",
  "unsafe-availability-recovery-health-monitor-scheduler-backup-restore-failover-process-supervisor-backend-storage-runtime-flags-availability-recovery-contract-boundary-map-input-rejected":
    "unsafe_availability_recovery_health_monitor_scheduler_backup_restore_failover_process_supervisor_backend_storage_runtime_flags_availability_recovery_contract_boundary_map_input_rejected",
  "nested-unsafe-flags-availability-recovery-contract-boundary-map-input-rejected":
    "nested_unsafe_flags_availability_recovery_contract_boundary_map_input_rejected",
  "noncanonical-availability-recovery-contract-boundary-map-input-rejected":
    "noncanonical_availability_recovery_contract_boundary_map_input_rejected"
});

const expectedBoundaryIds = Object.freeze([
  "phase5-66.repo_family.backend_api_availability.availability_boundary",
  "phase5-66.ardyn.database_storage_backup.backup_boundary",
  "phase5-66.ardyn.database_storage_restore.restore_boundary",
  "phase5-66.ardyn.auth_permissions_recovery_revocation.resilience_boundary",
  "phase5-66.ardyn.security_rls_fail_closed_recovery.failover_boundary",
  "phase5-66.ardyn.rate_limit_abuse_degraded_mode.degraded_boundary",
  "phase5-66.ardyn.error_log_audit_recovery_visibility.disaster_recovery_boundary",
  "phase5-66.ardyn.cli_runtime_unavailable_mode.runtime_unavailability_boundary",
  "phase5-66.ardyn.process_stdio_health_recovery.health_check_boundary",
  "phase5-66.ardyn_subagent.encoded_handoff_recovery.fabric_recovery_boundary",
  "phase5-66.repo_family.fabric_coordination_envelope_recovery.fabric_recovery_boundary",
  "phase5-66.locus.availability_degraded_recovery_status.degraded_boundary",
  "phase5-66.multiverse.capability_task_availability_status.degraded_boundary",
  "phase5-66.ardyn.mcp_tool_exposure_availability.availability_boundary",
  "phase5-66.repo_family.connector_grant_availability.availability_boundary",
  "phase5-66.content_fabric.secure_drop_metadata_recovery.secure_drop_recovery_boundary",
  "phase5-66.repo_family.recovery_drill_evidence.recovery_drill_boundary",
  "phase5-66.repo_family.rto_rpo_planning.rto_rpo_boundary",
  "phase5-66.repo_family.dependency_failure_domain_inventory.resilience_boundary"
]);

const commandProbes = Object.freeze([
  "availability-recovery-contract-boundary-map",
  "health-check-runtime",
  "monitor-runtime",
  "scheduler-runtime",
  "backup-job-runtime",
  "restore-job-runtime",
  "failover-runtime",
  "degraded-mode-runtime",
  "recovery-automation-runtime",
  "process-supervisor-runtime",
  "service-discovery-runtime",
  "mcp-availability-runtime",
  "connector-availability-runtime",
  "secure-drop-recovery-runtime",
  "encoded-handoff-recovery-runtime"
]);

const nonAuthorizingResultFields = Object.freeze([
  "reportRunsChecks",
  "healthCheckerImplemented",
  "healthCheckRuntimeImplemented",
  "healthEndpointImplemented",
  "monitorImplemented",
  "monitoringRuntimeImplemented",
  "schedulerImplemented",
  "backupJobImplemented",
  "restoreJobImplemented",
  "failoverRuntimeImplemented",
  "degradedModeRuntimeImplemented",
  "recoveryAutomationImplemented",
  "processSupervisorImplemented",
  "processSupervisionRuntimeImplemented",
  "externalServiceIntegrationImplemented",
  "persistencePathImplementedByArdyn",
  "persistenceImplementedByArdyn",
  "serviceDiscoveryEnabled",
  "backgroundPollingEnabled",
  "pollingEnabled",
  "filesystemWriteEnabled",
  "filesystemScanningEnabled",
  "processControlEnabled",
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
  "websocketHttpTransportImplementedByArdyn",
  "fabricRuntimeImplementedByArdyn",
  "encodedHandoffRuntimeImplementedByArdyn",
  "codecImplemented",
  "translatorRuntimeImplemented",
  "commandExposureEnabled",
  "commandRuntimeControlEnabled",
  "runtimeExecutionEnabled",
  "runtimeAuthorizationEnabled",
  "secretVaultEnvAccessEnabled",
  "secretsRuntimeIngestionEnabled",
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
  "scheduleEnforcementEnabled",
  "uiFrontendBrowserRenderingImplemented",
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
  const [entry] = createAvailabilityRecoveryContractBoundaryMapForReview({
    reviewedAt
  }).boundaryEntries;

  return [{ ...structuredClone(entry), ...patch }];
}

test("Phase 5.66 availability/recovery boundary map fixture is deterministic", async () => {
  const fixture = await readFixture();
  const generated = createAvailabilityRecoveryContractBoundaryMapForReview({
    reviewedAt
  });

  assert.deepEqual(fixture, generated);
  assert.equal(fixture.schema, AVAILABILITY_RECOVERY_CONTRACT_BOUNDARY_MAP_SCHEMA);
  assert.equal(fixture.reviewedAt, reviewedAt);
  assert.equal(
    fixture.classification,
    expectedCaseClassifications["valid-availability-recovery-contract-boundary-map"]
  );
  assert.equal(fixture.availabilityRecoveryContractBoundaryMapProduced, true);
  assert.equal(fixture.availabilityRecoveryContractBoundaryMapMode, "review-only");
  assert.equal(fixture.boundaryEntries.length, 19);
  assert.deepEqual(
    fixture.boundaryEntries.map(({ boundaryId }) => boundaryId),
    expectedBoundaryIds
  );
  assertNonAuthorizing(fixture);
});

test("Phase 5.66 references Phase 5.48 through 5.65 and content-fabric ownership", async () => {
  const fixture = await readFixture();
  const state = fixture.availabilityRecoveryContractBoundaryMap;

  assert.equal(state.sourcePhaseContext.phase548AvailabilityRecoveryAreaNumber, 13);
  assert.equal(state.sourcePhaseContext.phase548AvailabilityRecoveryStatus, "deferred");
  assert.equal(state.sourcePhaseContext.secureDropCanonicalOwner, "content-fabric");
  assert.equal(state.sourcePhaseContext.runtimeStillBlocked, true);
  assert.equal(
    fixture.boundaryMapSummary.phase548AvailabilityRecoveryCoverageItemRepresented,
    true
  );
  assert.equal(
    fixture.boundaryMapSummary.phase559FabricAwareApiBackendBoundaryReferenced,
    true
  );
  assert.equal(fixture.boundaryMapSummary.phase560EncodedHandoffConformanceReferenced, true);
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
  assert.equal(fixture.boundaryMapSummary.phase564RateLimitingAbuseControlBoundaryReferenced, true);
  assert.equal(
    fixture.boundaryMapSummary
      .phase565ErrorTrackingLoggingAuditIntegrityBoundaryReferenced,
    true
  );

  for (const entry of fixture.boundaryEntries) {
    assert.equal(entry.productionReadinessAreaReference.areaNumber, 13);
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
  }
});

test("Phase 5.66 invalid availability/recovery boundary cases fail closed", () => {
  const valid = createAvailabilityRecoveryContractBoundaryMapForReview({
    reviewedAt
  });
  const firstEntry = valid.boundaryEntries[0];
  const missingBoundaryIdEntry = { ...firstEntry };
  delete missingBoundaryIdEntry.boundaryId;

  const cases = [
    [
      null,
      "malformed-availability-recovery-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt: "not-a-date" },
      "malformed-availability-recovery-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, boundaryEntries: [missingBoundaryIdEntry] },
      "missing-required-availability-recovery-contract-boundary-entry-rejected"
    ],
    [
      { reviewedAt, unknownField: true },
      "unknown-top-level-field-availability-recovery-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, boundaryEntries: boundaryEntryPatch({ boundaryFamily: "monitor_runtime" }) },
      "unknown-boundary-family-availability-recovery-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, boundaryEntries: boundaryEntryPatch({ relatedSystem: "external-repo" }) },
      "unknown-related-system-availability-recovery-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, boundaryEntries: boundaryEntryPatch({ currentStatus: "implemented" }) },
      "unknown-current-status-availability-recovery-contract-boundary-map-input-rejected"
    ],
    [
      {
        reviewedAt,
        boundaryEntries: boundaryEntryPatch({
          explicitBlockedAuthorizationFlags: {
            ...firstEntry.explicitBlockedAuthorizationFlags,
            backupJobAuthorizationGranted: true
          }
        })
      },
      "authorization-flags-enabled-availability-recovery-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, reportRunsChecks: true },
      "report-runs-checks-true-availability-recovery-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, runtimeAuthorized: true },
      "runtime-authorization-attempt-availability-recovery-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, commandExposureEnabled: true },
      "command-exposure-attempt-availability-recovery-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, blockedCliBypassEnabled: true },
      "blocked-cli-bypass-attempt-availability-recovery-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, healthCheckUrl: "https://example.invalid/health" },
      "hidden-health-check-runtime-semantics-availability-recovery-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, monitor: { enabled: false } },
      "hidden-monitor-scheduler-semantics-availability-recovery-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, backupJob: { schedule: "daily" } },
      "hidden-backup-restore-execution-semantics-availability-recovery-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, failoverController: { enabled: false } },
      "hidden-failover-degraded-mode-runtime-semantics-availability-recovery-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, processSupervisor: { restartPolicy: "never" } },
      "hidden-process-supervision-semantics-availability-recovery-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, httpServer: { enabled: false } },
      "hidden-backend-api-server-semantics-availability-recovery-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, databaseUrl: "postgres://example" },
      "hidden-database-storage-cache-write-semantics-availability-recovery-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, sessionToken: "token" },
      "hidden-auth-session-token-api-key-semantics-availability-recovery-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, connectorGrant: { enabled: false } },
      "hidden-connector-grant-semantics-availability-recovery-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, websocketUrl: "wss://example.invalid" },
      "hidden-fabric-websocket-http-mcp-task-runtime-semantics-availability-recovery-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, secureDropKeyring: { enabled: false } },
      "hidden-secure-drop-implementation-semantics-availability-recovery-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, codecImplemented: false },
      "hidden-encoded-handoff-codec-translator-stego-covert-channel-tokenizer-exploit-bypass-semantics-availability-recovery-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, auditWriter: { path: "audit.jsonl" } },
      "hidden-logger-audit-transcript-telemetry-external-sink-semantics-availability-recovery-contract-boundary-map-input-rejected"
    ],
    [
      {
        reviewedAt,
        boundaryEntries: boundaryEntryPatch({
          unsafeAvailabilityRecoveryRuntimeFlags: {
            ...firstEntry.unsafeAvailabilityRecoveryRuntimeFlags,
            healthCheckerImplemented: true
          }
        })
      },
      "unsafe-availability-recovery-health-monitor-scheduler-backup-restore-failover-process-supervisor-backend-storage-runtime-flags-availability-recovery-contract-boundary-map-input-rejected"
    ],
    [
      {
        reviewedAt,
        boundaryEntries: boundaryEntryPatch({
          runtimeEffect: { ...firstEntry.runtimeEffect, runtimeReady: true }
        })
      },
      "nested-unsafe-flags-availability-recovery-contract-boundary-map-input-rejected"
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
      "noncanonical-availability-recovery-contract-boundary-map-input-rejected"
    ]
  ];

  for (const [input, caseKey] of cases) {
    const result = createAvailabilityRecoveryContractBoundaryMapForReview(input);
    assert.equal(
      result.classification,
      expectedCaseClassifications[caseKey],
      caseKey
    );
    assert.equal(
      result.availabilityRecoveryContractBoundaryMapProduced,
      false,
      caseKey
    );
    assert.equal(result.boundaryEntries.length, 0, caseKey);
    assertNonAuthorizing(result);
  }
});

test("Phase 5.66 boundary entries cover required families, systems, and blocked recovery semantics", async () => {
  const fixture = await readFixture();
  const summary = fixture.boundaryMapSummary;

  assert.deepEqual(summary.countByFamily, {
    availability_contract: 3,
    health_check_contract: 1,
    resilience_contract: 2,
    disaster_recovery_contract: 1,
    backup_contract: 1,
    restore_contract: 1,
    rto_rpo_contract: 1,
    failover_contract: 1,
    degraded_mode_contract: 3,
    recovery_drill_contract: 1,
    runtime_unavailability_contract: 1,
    fabric_recovery_boundary: 2,
    secure_drop_recovery_boundary: 1
  });
  assert.deepEqual(summary.countByRelatedSystem, {
    ardyn: 9,
    "ardyn-subagent": 1,
    locus: 1,
    multiverse: 1,
    "content-fabric": 1,
    "repo-family": 6
  });

  for (const entry of fixture.boundaryEntries) {
    assert.match(entry.boundaryId, /^phase5-66\./);
    assert.equal(entry.availabilityRecoveryBoundaryMetadataOnly, true);
    assert.equal(entry.noLiveAvailabilityRecoveryPerformed, true);
    assert.equal(entry.nonAuthorizingProof, true);
    assert.equal(typeof entry.availabilityExpectation, "string");
    assert.equal(typeof entry.degradedModeExpectation, "string");
    assert.equal(typeof entry.healthCheckExpectation, "string");
    assert.equal(typeof entry.backupRestoreExpectation, "string");
    assert.equal(typeof entry.rtoRpoExpectation, "string");
    assert.equal(typeof entry.recoveryDrillExpectation, "string");
    assert.equal(typeof entry.dependencyFailureDomainExpectation, "string");
    assertAllFalse(entry.explicitBlockedAuthorizationFlags);
    assertAllFalse(entry.unsafeAvailabilityRecoveryRuntimeFlags);
    assertAllFalse(entry.runtimeEffect);
    assert.ok(entry.forbiddenCurrentBehavior.includes("health-check runtime"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("monitor"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("backup job"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("restore job"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("failover runtime"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("process supervisor"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("backend API"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("websocket/http transport"));
  }
});

test("Phase 5.66 boundary map stays non-authorizing and runtime-blocked", async () => {
  const fixture = await readFixture();
  const summary = fixture.boundaryMapSummary;

  assert.equal(summary.availabilityRecoveryBoundaryMetadataOnly, true);
  assert.equal(summary.noLiveAvailabilityRecoveryPerformed, true);
  assert.equal(summary.noHealthCheckerRuntimeImplemented, true);
  assert.equal(summary.noMonitorSchedulerImplemented, true);
  assert.equal(summary.noBackupJobImplemented, true);
  assert.equal(summary.noRestoreJobImplemented, true);
  assert.equal(summary.noFailoverRuntimeImplemented, true);
  assert.equal(summary.noRecoveryAutomationImplemented, true);
  assert.equal(summary.noProcessSupervisorImplemented, true);
  assert.equal(summary.noBackendApiServerImplemented, true);
  assert.equal(summary.noStorageWrites, true);
  assert.equal(summary.noConnectorGrants, true);
  assert.equal(summary.allBlockedAuthorizationFlagsFalse, true);
  assert.equal(summary.allUnsafeAvailabilityRecoveryRuntimeFlagsFalse, true);
  assert.equal(summary.allRuntimeEffectsFalse, true);
  assert.equal(summary.allEntriesNonAuthorizing, true);
  assertNonAuthorizing(fixture);
  assert.equal(
    fixture.recommendedNextPhase,
    "phase-5.67-review-only-infrastructure-compliance-data-retention-contract-boundary-map"
  );
});

test("serve-runtime remains default-blocked and dry-run cannot bypass Phase 5.66", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-66-runtime-"));
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

test("Phase 5.66 availability/recovery/runtime command names remain rejected", async () => {
  for (const command of commandProbes) {
    const error = await expectCliFailure([command]);
    assert.notEqual(error.code, 0, command);
    assert.equal(error.stdout, "", command);
  }
});

test("Phase 5.66 does not change CLI, Rust, Fabric, package, or consumer source", async () => {
  const files = [
    "apps/cli/src/index.mjs",
    "crates/ardyn-host/src/lib.rs",
    "crates/ardyn-host/src/stdio_runtime/mod.rs",
    "packages/fabric/src/index.mjs",
    "package.json"
  ];

  for (const file of files) {
    const [baseline, current] = await Promise.all([
      execFileAsync("git", ["show", `${phase566BaselineCommit}:${file}`], {
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
  assert.doesNotMatch(currentCliSource, /availability-recovery-contract-boundary-map/);
  assert.doesNotMatch(currentCliSource, /health-check-runtime/);
  assert.doesNotMatch(currentCliSource, /backup-job-runtime/);
  assert.doesNotMatch(currentCliSource, /restore-job-runtime/);
  assert.doesNotMatch(currentCliSource, /failover-runtime/);
  assert.doesNotMatch(currentCliSource, /recovery-automation-runtime/);
  assert.doesNotMatch(currentCliSource, /process-supervisor-runtime/);
});
