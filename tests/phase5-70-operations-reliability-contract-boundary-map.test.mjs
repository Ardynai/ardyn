import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";
import {
  OPERATIONS_RELIABILITY_CONTRACT_BOUNDARY_MAP_SCHEMA,
  createOperationsReliabilityContractBoundaryMapForReview
} from "../packages/core/src/index.mjs";

const execFileAsync = promisify(execFile);
const phase570BaselineCommit = "636ec07bb84924ef1a2b542bc1ac9942504b681e";
const reviewedAt = "2026-06-28T00:00:00.000Z";
const repoRootUrl = new URL("../", import.meta.url);
const repoRoot = fileURLToPath(repoRootUrl);
const cliPath = fileURLToPath(new URL("../apps/cli/src/index.mjs", import.meta.url));
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-70/operations-reliability-contract-boundary-map.json",
  import.meta.url
);

const expectedCaseClassifications = Object.freeze({
  "valid-operations-reliability-contract-boundary-map":
    "valid_operations_reliability_contract_boundary_map_runtime_still_blocked",
  "malformed-operations-reliability-contract-boundary-map-input-rejected":
    "malformed_operations_reliability_contract_boundary_map_input_rejected",
  "missing-required-operations-reliability-contract-boundary-entry-rejected":
    "missing_required_operations_reliability_contract_boundary_entry_rejected",
  "unknown-top-level-field-operations-reliability-contract-boundary-map-input-rejected":
    "unknown_top_level_field_operations_reliability_contract_boundary_map_input_rejected",
  "unknown-boundary-family-operations-reliability-contract-boundary-map-input-rejected":
    "unknown_boundary_family_operations_reliability_contract_boundary_map_input_rejected",
  "unknown-related-system-operations-reliability-contract-boundary-map-input-rejected":
    "unknown_related_system_operations_reliability_contract_boundary_map_input_rejected",
  "unknown-current-status-operations-reliability-contract-boundary-map-input-rejected":
    "unknown_current_status_operations_reliability_contract_boundary_map_input_rejected",
  "authorization-flags-enabled-operations-reliability-contract-boundary-map-input-rejected":
    "authorization_flags_enabled_operations_reliability_contract_boundary_map_input_rejected",
  "report-runs-checks-true-operations-reliability-contract-boundary-map-input-rejected":
    "report_runs_checks_true_operations_reliability_contract_boundary_map_input_rejected",
  "runtime-authorization-attempt-operations-reliability-contract-boundary-map-input-rejected":
    "runtime_authorization_attempt_operations_reliability_contract_boundary_map_input_rejected",
  "command-exposure-attempt-operations-reliability-contract-boundary-map-input-rejected":
    "command_exposure_attempt_operations_reliability_contract_boundary_map_input_rejected",
  "blocked-cli-bypass-attempt-operations-reliability-contract-boundary-map-input-rejected":
    "blocked_cli_bypass_attempt_operations_reliability_contract_boundary_map_input_rejected",
  "hidden-retry-circuit-breaker-execution-semantics-operations-reliability-contract-boundary-map-input-rejected":
    "hidden_retry_circuit_breaker_execution_semantics_operations_reliability_contract_boundary_map_input_rejected",
  "hidden-idempotency-persistence-semantics-operations-reliability-contract-boundary-map-input-rejected":
    "hidden_idempotency_persistence_semantics_operations_reliability_contract_boundary_map_input_rejected",
  "hidden-queue-scheduler-worker-semantics-operations-reliability-contract-boundary-map-input-rejected":
    "hidden_queue_scheduler_worker_semantics_operations_reliability_contract_boundary_map_input_rejected",
  "hidden-lease-work-ownership-runtime-semantics-operations-reliability-contract-boundary-map-input-rejected":
    "hidden_lease_work_ownership_runtime_semantics_operations_reliability_contract_boundary_map_input_rejected",
  "hidden-cancellation-concurrency-runtime-semantics-operations-reliability-contract-boundary-map-input-rejected":
    "hidden_cancellation_concurrency_runtime_semantics_operations_reliability_contract_boundary_map_input_rejected",
  "hidden-background-subagent-execution-semantics-operations-reliability-contract-boundary-map-input-rejected":
    "hidden_background_subagent_execution_semantics_operations_reliability_contract_boundary_map_input_rejected",
  "hidden-front-desk-fusion-judge-model-routing-runtime-semantics-operations-reliability-contract-boundary-map-input-rejected":
    "hidden_front_desk_fusion_judge_model_routing_runtime_semantics_operations_reliability_contract_boundary_map_input_rejected",
  "hidden-computer-use-cua-driver-reliability-runtime-semantics-operations-reliability-contract-boundary-map-input-rejected":
    "hidden_computer_use_cua_driver_reliability_runtime_semantics_operations_reliability_contract_boundary_map_input_rejected",
  "hidden-skillhub-install-rollback-runtime-semantics-operations-reliability-contract-boundary-map-input-rejected":
    "hidden_skillhub_install_rollback_runtime_semantics_operations_reliability_contract_boundary_map_input_rejected",
  "hidden-mcp-tool-plugin-provider-runtime-semantics-operations-reliability-contract-boundary-map-input-rejected":
    "hidden_mcp_tool_plugin_provider_runtime_semantics_operations_reliability_contract_boundary_map_input_rejected",
  "hidden-backend-api-server-semantics-operations-reliability-contract-boundary-map-input-rejected":
    "hidden_backend_api_server_semantics_operations_reliability_contract_boundary_map_input_rejected",
  "hidden-database-storage-cache-write-semantics-operations-reliability-contract-boundary-map-input-rejected":
    "hidden_database_storage_cache_write_semantics_operations_reliability_contract_boundary_map_input_rejected",
  "hidden-auth-session-token-api-key-semantics-operations-reliability-contract-boundary-map-input-rejected":
    "hidden_auth_session_token_api_key_semantics_operations_reliability_contract_boundary_map_input_rejected",
  "hidden-connector-grant-semantics-operations-reliability-contract-boundary-map-input-rejected":
    "hidden_connector_grant_semantics_operations_reliability_contract_boundary_map_input_rejected",
  "hidden-fabric-websocket-http-mcp-task-runtime-semantics-operations-reliability-contract-boundary-map-input-rejected":
    "hidden_fabric_websocket_http_mcp_task_runtime_semantics_operations_reliability_contract_boundary_map_input_rejected",
  "hidden-secure-drop-implementation-semantics-operations-reliability-contract-boundary-map-input-rejected":
    "hidden_secure_drop_implementation_semantics_operations_reliability_contract_boundary_map_input_rejected",
  "hidden-encoded-handoff-codec-translator-stego-covert-channel-tokenizer-exploit-bypass-semantics-operations-reliability-contract-boundary-map-input-rejected":
    "hidden_encoded_handoff_codec_translator_stego_covert_channel_tokenizer_exploit_bypass_semantics_operations_reliability_contract_boundary_map_input_rejected",
  "hidden-logger-audit-transcript-telemetry-external-sink-semantics-operations-reliability-contract-boundary-map-input-rejected":
    "hidden_logger_audit_transcript_telemetry_external_sink_semantics_operations_reliability_contract_boundary_map_input_rejected",
  "hidden-health-backup-restore-failover-scheduler-process-supervisor-semantics-operations-reliability-contract-boundary-map-input-rejected":
    "hidden_health_backup_restore_failover_scheduler_process_supervisor_semantics_operations_reliability_contract_boundary_map_input_rejected",
  "hidden-infrastructure-deployment-compliance-pii-retention-export-semantics-operations-reliability-contract-boundary-map-input-rejected":
    "hidden_infrastructure_deployment_compliance_pii_retention_export_semantics_operations_reliability_contract_boundary_map_input_rejected",
  "hidden-testing-ci-release-automation-semantics-operations-reliability-contract-boundary-map-input-rejected":
    "hidden_testing_ci_release_automation_semantics_operations_reliability_contract_boundary_map_input_rejected",
  "unsafe-operations-reliability-runtime-flags-operations-reliability-contract-boundary-map-input-rejected":
    "unsafe_operations_reliability_runtime_flags_operations_reliability_contract_boundary_map_input_rejected",
  "nested-unsafe-flags-operations-reliability-contract-boundary-map-input-rejected":
    "nested_unsafe_flags_operations_reliability_contract_boundary_map_input_rejected",
  "noncanonical-operations-reliability-contract-boundary-map-input-rejected":
    "noncanonical_operations_reliability_contract_boundary_map_input_rejected"
});

const expectedBoundaryFamilies = Object.freeze([
  "retry_contract",
  "idempotency_contract",
  "circuit_breaker_contract",
  "concurrency_contract",
  "cancellation_contract",
  "lease_contract",
  "work_ownership_contract",
  "queue_semantics_contract",
  "degraded_mode_contract",
  "front_desk_busy_contract",
  "background_subagent_reliability_contract",
  "operation_runbook_contract",
  "handoff_recovery_contract",
  "fabric_reliability_contract",
  "computer_use_reliability_contract",
  "skillhub_reliability_contract"
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
  "blocked",
  "future_contract_required"
]);

const commandProbes = Object.freeze([
  "operations-reliability-contract-boundary-map",
  "retry-engine-runtime",
  "idempotency-store-runtime",
  "circuit-breaker-runtime",
  "queue-runtime",
  "scheduler-runtime",
  "worker-runtime",
  "lease-store-runtime",
  "operation-monitor-runtime",
  "runbook-executor-runtime",
  "process-supervisor-runtime",
  "background-subagent-runtime",
  "model-router-runtime",
  "fusion-runtime",
  "judge-runtime",
  "front-desk-model-runtime",
  "computer-use-runtime",
  "cua-driver-runtime",
  "skillhub-rollback-runtime",
  "mcp-tool-plugin-provider-runtime"
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
  "retryEngineEnabled",
  "idempotencyStoreEnabled",
  "circuitBreakerEnabled",
  "queueEnabled",
  "schedulerEnabled",
  "schedulerImplemented",
  "leaseStoreEnabled",
  "workerEnabled",
  "backgroundWorkerEnabled",
  "backgroundSubagentRuntimeEnabled",
  "frontDeskModelRuntimeEnabled",
  "modelRouterEnabled",
  "processSupervisorImplemented",
  "runbookExecutorEnabled",
  "failoverRuntimeImplemented",
  "operationMonitorEnabled",
  "orchestrationRuntimeEnabled",
  "fusionRuntimeEnabled",
  "judgeRuntimeEnabled",
  "computerUseRuntimeEnabled",
  "cuaDriverRuntimeEnabled",
  "skillhubRollbackRuntimeEnabled",
  "skillhubInstallerEnabled",
  "mcpRuntimeEnabled",
  "toolRuntimeEnabled",
  "pluginRuntimeEnabled",
  "providerRuntimeEnabled",
  "backendRuntimeImplementedByArdyn",
  "backendApiServerMiddlewareImplemented",
  "apiEndpointImplementedByArdyn",
  "serverImplementedByArdyn",
  "databaseClientImplemented",
  "databaseStorageRuntimeWritesEnabled",
  "cacheEngineImplemented",
  "rlsRuntimeImplemented",
  "databaseMigrationImplemented",
  "transcriptWriterImplemented",
  "auditWriterImplemented",
  "importExportPathImplementedByArdyn",
  "packageDistributionImplementedByArdyn",
  "persistenceImplementedByArdyn",
  "loggerRuntimeImplemented",
  "auditWriterRuntimeImplemented",
  "telemetryClientImplemented",
  "healthCheckRuntimeImplemented",
  "backupJobImplemented",
  "restoreJobImplemented",
  "infrastructureAutomationImplemented",
  "deploymentAutomationImplemented",
  "complianceEnforcementImplemented",
  "piiProcessingImplemented",
  "retentionJobImplemented",
  "exportJobImplemented",
  "testingCiReleaseAutomationEnabled",
  "hermesRuntimeEnabled",
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
    createOperationsReliabilityContractBoundaryMapForReview({ reviewedAt });
  const runtimeFlagNames = Object.keys(
    valid.boundaryEntries[0].unsafeOperationsReliabilityRuntimeFlags
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
    createOperationsReliabilityContractBoundaryMapForReview({
      reviewedAt
    }).boundaryEntries;

  return [{ ...structuredClone(entry), ...patch }];
}

test("Phase 5.70 operations/reliability boundary map fixture is deterministic", async () => {
  const fixture = await readFixture();
  const generated =
    createOperationsReliabilityContractBoundaryMapForReview({
      reviewedAt
    });

  assert.deepEqual(fixture, generated);
  assert.equal(fixture.schema, OPERATIONS_RELIABILITY_CONTRACT_BOUNDARY_MAP_SCHEMA);
  assert.equal(fixture.reviewedAt, reviewedAt);
  assert.equal(
    fixture.classification,
    expectedCaseClassifications[
      "valid-operations-reliability-contract-boundary-map"
    ]
  );
  assert.equal(fixture.operationsReliabilityContractBoundaryMapProduced, true);
  assert.equal(fixture.operationsReliabilityContractBoundaryMapMode, "review-only");
  assert.equal(fixture.boundaryEntries.length, 25);
  assertNonAuthorizing(fixture);
});

test("Phase 5.70 covers requested operations families, systems, and statuses", async () => {
  const fixture = await readFixture();
  const state = fixture.operationsReliabilityContractBoundaryMap;
  const summary = fixture.boundaryMapSummary;

  assert.deepEqual(summary.boundaryFamilies, expectedBoundaryFamilies);
  assert.deepEqual(summary.relatedSystems, expectedRelatedSystems);
  assert.deepEqual(summary.currentStatusValues, expectedStatusValues);
  assert.equal(
    state.sourcePhaseContext.productionReadinessOperationsReliabilityItemDeferred,
    true
  );
  assert.equal(state.sourcePhaseContext.noOperationsRuntimeImplemented, true);
  assert.equal(
    state.sourcePhaseContext.noQueueSchedulerWorkerLeaseImplemented,
    true
  );
  assert.equal(state.sourcePhaseContext.noRunbookExecutorImplemented, true);
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
    assert.match(entry.boundaryId, /^phase5-70\./);
    assert.ok(expectedBoundaryFamilies.includes(entry.boundaryFamily));
    assert.ok(expectedRelatedSystems.includes(entry.relatedSystem));
    assert.ok(expectedStatusValues.includes(entry.currentStatus));
    assert.equal(entry.operationsReliabilityBoundaryMetadataOnly, true);
    assert.equal(entry.noLiveOperationsReliabilityRuntimePerformed, true);
    assert.equal(entry.nonAuthorizingProof, true);
    assertAllFalse(entry.explicitBlockedAuthorizationFlags);
    assertAllFalse(entry.unsafeOperationsReliabilityRuntimeFlags);
    assertAllFalse(entry.runtimeEffect);
    assert.ok(entry.forbiddenCurrentBehavior.includes("retry engine"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("queue"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("computer-use or CUA-driver reliability runtime"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("command exposure"));
  }

  assert.ok(
    fixture.boundaryEntries.some(
      (entry) =>
        entry.boundaryFamily === "computer_use_reliability_contract" &&
        entry.relatedSystem === "cua-driver-reference" &&
        entry.currentStatus === "blocked"
    )
  );
  assert.ok(
    fixture.boundaryEntries.some(
      (entry) =>
        entry.boundaryFamily === "handoff_recovery_contract" &&
        entry.relatedSystem === "content-fabric" &&
        /Secure Drop/.test(entry.handoffRecoveryExpectation)
    )
  );
  assert.ok(
    fixture.boundaryEntries.some(
      (entry) =>
        entry.boundaryId === "phase5-70.ardyn.front_desk.busy_state_boundary" &&
        entry.boundaryFamily === "front_desk_busy_contract" &&
        entry.currentStatus === "blocked"
    )
  );
});

test("Phase 5.70 invalid operations/reliability cases fail closed", () => {
  const valid =
    createOperationsReliabilityContractBoundaryMapForReview({ reviewedAt });
  const firstEntry = valid.boundaryEntries[0];
  const missingBoundaryIdEntry = { ...firstEntry };
  delete missingBoundaryIdEntry.boundaryId;

  const cases = [
    [
      null,
      "malformed-operations-reliability-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt: "not-a-date" },
      "malformed-operations-reliability-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, boundaryEntries: [missingBoundaryIdEntry] },
      "missing-required-operations-reliability-contract-boundary-entry-rejected"
    ],
    [
      { reviewedAt, unknownField: true },
      "unknown-top-level-field-operations-reliability-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, boundaryEntries: boundaryEntryPatch({ boundaryFamily: "retry_runtime" }) },
      "unknown-boundary-family-operations-reliability-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, boundaryEntries: boundaryEntryPatch({ relatedSystem: "ops" }) },
      "unknown-related-system-operations-reliability-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, boundaryEntries: boundaryEntryPatch({ currentStatus: "enabled" }) },
      "unknown-current-status-operations-reliability-contract-boundary-map-input-rejected"
    ],
    [
      {
        reviewedAt,
        boundaryEntries: boundaryEntryPatch({
          explicitBlockedAuthorizationFlags: {
            ...firstEntry.explicitBlockedAuthorizationFlags,
            retryEngineAuthorizationGranted: true
          }
        })
      },
      "authorization-flags-enabled-operations-reliability-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, reportRunsChecks: true },
      "report-runs-checks-true-operations-reliability-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, runtimeAuthorized: true },
      "runtime-authorization-attempt-operations-reliability-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, commandExposureEnabled: true },
      "command-exposure-attempt-operations-reliability-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, blockedCliBypassEnabled: true },
      "blocked-cli-bypass-attempt-operations-reliability-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, retryEngine: { enabled: false } },
      "hidden-retry-circuit-breaker-execution-semantics-operations-reliability-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, idempotencyStore: { enabled: false } },
      "hidden-idempotency-persistence-semantics-operations-reliability-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, queue: { enabled: false } },
      "hidden-queue-scheduler-worker-semantics-operations-reliability-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, leaseStore: { enabled: false } },
      "hidden-lease-work-ownership-runtime-semantics-operations-reliability-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, cancellationToken: "token" },
      "hidden-cancellation-concurrency-runtime-semantics-operations-reliability-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, backgroundSubagent: { enabled: false } },
      "hidden-background-subagent-execution-semantics-operations-reliability-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, frontDeskModel: { enabled: false } },
      "hidden-front-desk-fusion-judge-model-routing-runtime-semantics-operations-reliability-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, computerUseRuntime: { enabled: false } },
      "hidden-computer-use-cua-driver-reliability-runtime-semantics-operations-reliability-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, skillhubRollback: { enabled: false } },
      "hidden-skillhub-install-rollback-runtime-semantics-operations-reliability-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, mcpServer: { enabled: false } },
      "hidden-mcp-tool-plugin-provider-runtime-semantics-operations-reliability-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, httpServer: { enabled: false } },
      "hidden-backend-api-server-semantics-operations-reliability-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, databaseUrl: "postgres://example.invalid/db" },
      "hidden-database-storage-cache-write-semantics-operations-reliability-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, sessionToken: "token" },
      "hidden-auth-session-token-api-key-semantics-operations-reliability-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, connectorGrant: { enabled: false } },
      "hidden-connector-grant-semantics-operations-reliability-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, fabricBus: { enabled: false } },
      "hidden-fabric-websocket-http-mcp-task-runtime-semantics-operations-reliability-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, secureDropKeyring: { enabled: false } },
      "hidden-secure-drop-implementation-semantics-operations-reliability-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, encodedHandoffRuntime: { enabled: false } },
      "hidden-encoded-handoff-codec-translator-stego-covert-channel-tokenizer-exploit-bypass-semantics-operations-reliability-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, loggerRuntime: { enabled: false } },
      "hidden-logger-audit-transcript-telemetry-external-sink-semantics-operations-reliability-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, healthChecker: { enabled: false } },
      "hidden-health-backup-restore-failover-scheduler-process-supervisor-semantics-operations-reliability-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, terraformPlan: { enabled: false } },
      "hidden-infrastructure-deployment-compliance-pii-retention-export-semantics-operations-reliability-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, ciPipeline: { enabled: false } },
      "hidden-testing-ci-release-automation-semantics-operations-reliability-contract-boundary-map-input-rejected"
    ],
    [
      {
        reviewedAt,
        boundaryEntries: boundaryEntryPatch({
          unsafeOperationsReliabilityRuntimeFlags: {
            ...firstEntry.unsafeOperationsReliabilityRuntimeFlags,
            retryEngineEnabled: true
          }
        })
      },
      "unsafe-operations-reliability-runtime-flags-operations-reliability-contract-boundary-map-input-rejected"
    ],
    [
      {
        reviewedAt,
        boundaryEntries: boundaryEntryPatch({
          runtimeEffect: { ...firstEntry.runtimeEffect, runtimeReady: true }
        })
      },
      "nested-unsafe-flags-operations-reliability-contract-boundary-map-input-rejected"
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
      "noncanonical-operations-reliability-contract-boundary-map-input-rejected"
    ]
  ];

  for (const [input, caseKey] of cases) {
    const result =
      createOperationsReliabilityContractBoundaryMapForReview(input);
    assert.equal(
      result.classification,
      expectedCaseClassifications[caseKey],
      caseKey
    );
    assert.equal(
      result.operationsReliabilityContractBoundaryMapProduced,
      false,
      caseKey
    );
    assert.equal(result.boundaryEntries.length, 0, caseKey);
    assertNonAuthorizing(result);
  }
});

test("Phase 5.70 enabled runtime flags cannot authorize operations behavior", () => {
  for (const field of unsafeFlagCases) {
    const result =
      createOperationsReliabilityContractBoundaryMapForReview({
        reviewedAt,
        [field]: true
      });

    assert.equal(
      result.classification,
      expectedCaseClassifications[
        "unsafe-operations-reliability-runtime-flags-operations-reliability-contract-boundary-map-input-rejected"
      ],
      field
    );
    assert.equal(
      result.operationsReliabilityContractBoundaryMapProduced,
      false,
      field
    );
    assertNonAuthorizing(result);
  }
});

test("Phase 5.70 boundary map stays non-authorizing and runtime-blocked", async () => {
  const fixture = await readFixture();
  const summary = fixture.boundaryMapSummary;

  for (const field of [
    "phase548OperationsReliabilityCoverageItemRepresented",
    "operationsReliabilityBoundaryMetadataOnly",
    "noLiveOperationsReliabilityRuntimePerformed",
    "backendApiReliabilityBoundaryRecorded",
    "encodedHandoffReliabilityBoundaryRecorded",
    "databaseStorageIdempotencyWriteSafetyBoundaryRecorded",
    "authPermissionsRetryRevocationBoundaryRecorded",
    "securityRlsFailClosedOperationsBoundaryRecorded",
    "rateLimitAbuseRetryBudgetBoundaryRecorded",
    "errorLogAuditOperationalVisibilityBoundaryRecorded",
    "availabilityRecoveryDegradedModeBoundaryRecorded",
    "infrastructureComplianceOperationalGovernanceBoundaryRecorded",
    "hermesCuaComputerUseReliabilityBoundaryRecorded",
    "testingQualityGateOperationalReleaseBoundaryRecorded",
    "backgroundSubagentConcurrencyCancellationBoundaryRecorded",
    "frontDeskBusyStateBoundaryRecorded",
    "fusionJudgeOrchestrationReliabilityBoundaryRecorded",
    "skillhubInstallRollbackRetryBoundaryRecorded",
    "mcpToolPluginProviderReliabilityBoundaryRecorded",
    "locusMediatedHarnessReliabilityBoundaryRecorded",
    "fabricCoordinationEnvelopeReliabilityBoundaryRecorded",
    "secureDropHandoffRecoveryBoundaryRecorded",
    "operationalRunbookEvidenceBoundaryRecorded",
    "noRetryEngine",
    "noIdempotencyStore",
    "noCircuitBreaker",
    "noQueueSchedulerWorkerLeaseRuntime",
    "noOperationMonitorRunbookExecutorProcessSupervisor",
    "noBackgroundSubagentModelRouterFusionJudgeFrontDeskRuntime",
    "noComputerUseCuaDriverRuntime",
    "noSkillhubRollbackInstallRuntime",
    "noMcpToolPluginProviderRuntime",
    "noRuntimeIntegrationBackendStorageBehavior",
    "noFabricSecureDropEncodedHandoffRuntime",
    "noLoggerAuditTelemetryHealthInfrastructureRuntime",
    "noTestingCiReleaseAutomation",
    "noCommandExposure",
    "noBlockedCliBypass",
    "allBlockedAuthorizationFlagsFalse",
    "allUnsafeOperationsReliabilityRuntimeFlagsFalse",
    "allRuntimeEffectsFalse",
    "allEntriesNonAuthorizing"
  ]) {
    assert.equal(summary[field], true, `${field} should be true`);
  }

  assertNonAuthorizing(fixture);
  assert.equal(
    fixture.recommendedNextPhase,
    "phase-5.71-review-only-maintenance-governance-adr-dependency-policy-contract-boundary-map"
  );
});

test("serve-runtime remains default-blocked and dry-run cannot bypass Phase 5.70", async () => {
  const direct = await expectCliFailure(["serve-runtime"]);
  assert.notEqual(direct.code, 0);
  assert.equal(direct.stdout, "");

  const dryRun = await expectCliFailure(["serve-runtime", "--dry-run"]);
  assert.notEqual(dryRun.code, 0);
  assert.equal(dryRun.stdout, "");
});

test("Phase 5.70 operations/reliability command names remain rejected", async () => {
  for (const command of commandProbes) {
    const error = await expectCliFailure([command]);
    assert.notEqual(error.code, 0, command);
    assert.equal(error.stdout, "", command);
  }
});

test("Phase 5.70 does not change CLI, Rust, Fabric, package, or consumer source", async () => {
  const files = [
    "apps/cli/src/index.mjs",
    "crates/ardyn-host/src/lib.rs",
    "crates/ardyn-host/src/stdio_runtime/mod.rs",
    "packages/fabric/src/index.mjs",
    "package.json"
  ];

  for (const file of files) {
    const [baseline, current] = await Promise.all([
      execFileAsync("git", ["show", `${phase570BaselineCommit}:${file}`], {
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
