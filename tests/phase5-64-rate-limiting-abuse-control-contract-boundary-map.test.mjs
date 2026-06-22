import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";
import {
  RATE_LIMITING_ABUSE_CONTROL_CONTRACT_BOUNDARY_MAP_SCHEMA,
  createRateLimitingAbuseControlContractBoundaryMapForReview
} from "../packages/core/src/index.mjs";

const execFileAsync = promisify(execFile);
const phase564BaselineCommit = "aaaec7a06e2af59a4c979cd8199c0430349f01de";
const reviewedAt = "2026-06-22T00:00:00.000Z";
const repoRootUrl = new URL("../", import.meta.url);
const repoRoot = fileURLToPath(repoRootUrl);
const cliPath = fileURLToPath(new URL("../apps/cli/src/index.mjs", import.meta.url));
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-64/rate-limiting-abuse-control-contract-boundary-map.json",
  import.meta.url
);

const expectedCaseClassifications = Object.freeze({
  "valid-rate-limiting-abuse-control-contract-boundary-map":
    "valid_rate_limiting_abuse_control_contract_boundary_map_runtime_still_blocked",
  "malformed-rate-limiting-abuse-control-contract-boundary-map-input-rejected":
    "malformed_rate_limiting_abuse_control_contract_boundary_map_input_rejected",
  "missing-required-rate-limiting-abuse-control-contract-boundary-entry-rejected":
    "missing_required_rate_limiting_abuse_control_contract_boundary_entry_rejected",
  "unknown-top-level-field-rate-limiting-abuse-control-contract-boundary-map-input-rejected":
    "unknown_top_level_field_rate_limiting_abuse_control_contract_boundary_map_input_rejected",
  "unknown-boundary-family-rate-limiting-abuse-control-contract-boundary-map-input-rejected":
    "unknown_boundary_family_rate_limiting_abuse_control_contract_boundary_map_input_rejected",
  "unknown-related-system-rate-limiting-abuse-control-contract-boundary-map-input-rejected":
    "unknown_related_system_rate_limiting_abuse_control_contract_boundary_map_input_rejected",
  "unknown-current-status-rate-limiting-abuse-control-contract-boundary-map-input-rejected":
    "unknown_current_status_rate_limiting_abuse_control_contract_boundary_map_input_rejected",
  "authorization-flags-enabled-rate-limiting-abuse-control-contract-boundary-map-input-rejected":
    "authorization_flags_enabled_rate_limiting_abuse_control_contract_boundary_map_input_rejected",
  "report-runs-checks-true-rate-limiting-abuse-control-contract-boundary-map-input-rejected":
    "report_runs_checks_true_rate_limiting_abuse_control_contract_boundary_map_input_rejected",
  "runtime-authorization-attempt-rate-limiting-abuse-control-contract-boundary-map-input-rejected":
    "runtime_authorization_attempt_rate_limiting_abuse_control_contract_boundary_map_input_rejected",
  "command-exposure-attempt-rate-limiting-abuse-control-contract-boundary-map-input-rejected":
    "command_exposure_attempt_rate_limiting_abuse_control_contract_boundary_map_input_rejected",
  "blocked-cli-bypass-attempt-rate-limiting-abuse-control-contract-boundary-map-input-rejected":
    "blocked_cli_bypass_attempt_rate_limiting_abuse_control_contract_boundary_map_input_rejected",
  "hidden-rate-limit-middleware-semantics-rate-limiting-abuse-control-contract-boundary-map-input-rejected":
    "hidden_rate_limit_middleware_semantics_rate_limiting_abuse_control_contract_boundary_map_input_rejected",
  "hidden-quota-engine-semantics-rate-limiting-abuse-control-contract-boundary-map-input-rejected":
    "hidden_quota_engine_semantics_rate_limiting_abuse_control_contract_boundary_map_input_rejected",
  "hidden-abuse-detector-runtime-scanner-semantics-rate-limiting-abuse-control-contract-boundary-map-input-rejected":
    "hidden_abuse_detector_runtime_scanner_semantics_rate_limiting_abuse_control_contract_boundary_map_input_rejected",
  "hidden-retry-circuit-breaker-execution-semantics-rate-limiting-abuse-control-contract-boundary-map-input-rejected":
    "hidden_retry_circuit_breaker_execution_semantics_rate_limiting_abuse_control_contract_boundary_map_input_rejected",
  "hidden-idempotency-persistence-semantics-rate-limiting-abuse-control-contract-boundary-map-input-rejected":
    "hidden_idempotency_persistence_semantics_rate_limiting_abuse_control_contract_boundary_map_input_rejected",
  "hidden-backend-api-server-semantics-rate-limiting-abuse-control-contract-boundary-map-input-rejected":
    "hidden_backend_api_server_semantics_rate_limiting_abuse_control_contract_boundary_map_input_rejected",
  "hidden-database-storage-cache-write-semantics-rate-limiting-abuse-control-contract-boundary-map-input-rejected":
    "hidden_database_storage_cache_write_semantics_rate_limiting_abuse_control_contract_boundary_map_input_rejected",
  "hidden-auth-session-token-api-key-semantics-rate-limiting-abuse-control-contract-boundary-map-input-rejected":
    "hidden_auth_session_token_api_key_semantics_rate_limiting_abuse_control_contract_boundary_map_input_rejected",
  "hidden-connector-grant-semantics-rate-limiting-abuse-control-contract-boundary-map-input-rejected":
    "hidden_connector_grant_semantics_rate_limiting_abuse_control_contract_boundary_map_input_rejected",
  "hidden-fabric-websocket-http-mcp-task-runtime-semantics-rate-limiting-abuse-control-contract-boundary-map-input-rejected":
    "hidden_fabric_websocket_http_mcp_task_runtime_semantics_rate_limiting_abuse_control_contract_boundary_map_input_rejected",
  "hidden-secure-drop-implementation-semantics-rate-limiting-abuse-control-contract-boundary-map-input-rejected":
    "hidden_secure_drop_implementation_semantics_rate_limiting_abuse_control_contract_boundary_map_input_rejected",
  "hidden-encoded-handoff-codec-translator-stego-covert-channel-tokenizer-exploit-bypass-semantics-rate-limiting-abuse-control-contract-boundary-map-input-rejected":
    "hidden_encoded_handoff_codec_translator_stego_covert_channel_tokenizer_exploit_bypass_semantics_rate_limiting_abuse_control_contract_boundary_map_input_rejected",
  "unsafe-limiter-quota-throttle-abuse-queue-scheduler-retry-circuit-breaker-idempotency-cost-backend-storage-runtime-flags-rate-limiting-abuse-control-contract-boundary-map-input-rejected":
    "unsafe_limiter_quota_throttle_abuse_queue_scheduler_retry_circuit_breaker_idempotency_cost_backend_storage_runtime_flags_rate_limiting_abuse_control_contract_boundary_map_input_rejected",
  "nested-unsafe-flags-rate-limiting-abuse-control-contract-boundary-map-input-rejected":
    "nested_unsafe_flags_rate_limiting_abuse_control_contract_boundary_map_input_rejected",
  "noncanonical-rate-limiting-abuse-control-contract-boundary-map-input-rejected":
    "noncanonical_rate_limiting_abuse_control_contract_boundary_map_input_rejected"
});

const expectedBoundaryIds = Object.freeze([
  "phase5-64.repo_family.backend_api_request_rate_limit.rate_limit_boundary",
  "phase5-64.ardyn.cli_command_invocation_abuse.abuse_detection_boundary",
  "phase5-64.ardyn.future_runtime_command_throttle.throttle_boundary",
  "phase5-64.ardyn_subagent.encoded_handoff_abuse.encoded_handoff_abuse_boundary",
  "phase5-64.repo_family.fabric_coordination_envelope_abuse.fabric_coordination_abuse_boundary",
  "phase5-64.locus.control_surface_request_throttle.throttle_boundary",
  "phase5-64.multiverse.citizen_adapter_request_throttle.throttle_boundary",
  "phase5-64.ardyn.mcp_tool_exposure_abuse.denial_of_service_boundary",
  "phase5-64.repo_family.connector_grant_abuse.connector_abuse_boundary",
  "phase5-64.content_fabric.secure_drop_compose_inbox_abuse.secure_drop_abuse_boundary",
  "phase5-64.ardyn.storage_write_quota.quota_boundary",
  "phase5-64.ardyn.auth_permission_subject_quota.quota_boundary",
  "phase5-64.ardyn.security_input_abuse.request_cost_boundary",
  "phase5-64.repo_family.retry_budget_planning.retry_budget_boundary",
  "phase5-64.repo_family.idempotency_planning.idempotency_boundary",
  "phase5-64.repo_family.backpressure_circuit_breaker_planning.backpressure_boundary"
]);

const commandProbes = Object.freeze([
  "rate-limiting-abuse-control-contract-boundary-map",
  "limiter-runtime",
  "rate-limiter-runtime",
  "quota-engine",
  "throttle-runtime",
  "abuse-detector-runtime",
  "abuse-scanner-runtime",
  "queue-runtime",
  "scheduler-runtime",
  "retry-engine",
  "circuit-breaker",
  "idempotency-store",
  "request-cost-meter",
  "rate-limit-middleware",
  "backend-rate-limit-runtime",
  "fabric-abuse-runtime",
  "encoded-handoff-abuse-runtime",
  "secure-drop-abuse-runtime",
  "connector-abuse-runtime",
  "mcp-abuse-runtime",
  "task-abuse-runtime"
]);

const nonAuthorizingResultFields = Object.freeze([
  "reportRunsChecks",
  "limiterRuntimeImplemented",
  "rateLimiterRuntimeImplemented",
  "quotaEngineImplemented",
  "throttleRuntimeImplemented",
  "abuseDetectorImplemented",
  "abuseScannerRuntimeEnabled",
  "denialOfServiceProtectionRuntimeImplemented",
  "backpressureRuntimeImplemented",
  "retryEngineImplemented",
  "retryBudgetRuntimeImplemented",
  "circuitBreakerImplemented",
  "idempotencyStoreImplemented",
  "requestCostMeterImplemented",
  "costMeterImplemented",
  "queueImplemented",
  "schedulerImplemented",
  "rateLimitMiddlewareImplemented",
  "backendApiServerMiddlewareImplemented",
  "storageWriteQuotaRuntimeImplemented",
  "databaseClientImplemented",
  "databaseSchemaImplemented",
  "databaseMigrationImplemented",
  "rlsRuntimeImplemented",
  "rlsPolicyImplemented",
  "storageAdapterImplemented",
  "cacheEngineImplemented",
  "cacheInvalidationRuntimeImplemented",
  "transcriptWriterImplemented",
  "auditWriterImplemented",
  "filesystemWriteEnabled",
  "importExportPathImplementedByArdyn",
  "packageDistributionImplementedByArdyn",
  "persistenceImplementedByArdyn",
  "backendRuntimeImplementedByArdyn",
  "apiEndpointImplementedByArdyn",
  "serverImplementedByArdyn",
  "websocketHttpTransportImplementedByArdyn",
  "fabricRuntimeImplementedByArdyn",
  "encodedHandoffRuntimeImplementedByArdyn",
  "codecImplemented",
  "translatorRuntimeImplemented",
  "commandExposureEnabled",
  "commandRuntimeControlEnabled",
  "runtimeExecutionEnabled",
  "runtimeAuthorizationEnabled",
  "databaseStorageRuntimeWritesEnabled",
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
  "serviceDiscoveryEnabled",
  "scheduleEnforcementEnabled",
  "backgroundPollingEnabled",
  "filesystemScanningEnabled",
  "processControlEnabled",
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
  const [entry] = createRateLimitingAbuseControlContractBoundaryMapForReview({
    reviewedAt
  }).boundaryEntries;

  return [{ ...structuredClone(entry), ...patch }];
}

test("Phase 5.64 rate-limiting/abuse-control boundary map fixture is deterministic", async () => {
  const fixture = await readFixture();
  const generated = createRateLimitingAbuseControlContractBoundaryMapForReview({
    reviewedAt
  });

  assert.equal(fixture.schema, RATE_LIMITING_ABUSE_CONTROL_CONTRACT_BOUNDARY_MAP_SCHEMA);
  assert.deepEqual(fixture, generated);
  assert.equal(
    fixture.classification,
    expectedCaseClassifications[
      "valid-rate-limiting-abuse-control-contract-boundary-map"
    ]
  );
  assert.equal(fixture.rateLimitingAbuseControlContractBoundaryMapProduced, true);
  assert.equal(fixture.boundaryMapSummary.boundaryEntryCount, 16);
  assert.deepEqual(fixture.boundaryMapSummary.boundaryIds, expectedBoundaryIds);
  assert.deepEqual(fixture.boundaryMapSummary.countByFamily, {
    rate_limit_contract: 1,
    quota_contract: 2,
    throttle_contract: 3,
    abuse_detection_contract: 1,
    denial_of_service_boundary: 1,
    backpressure_contract: 1,
    retry_budget_contract: 1,
    idempotency_contract: 1,
    request_cost_contract: 1,
    encoded_handoff_abuse_boundary: 1,
    fabric_coordination_abuse_boundary: 1,
    connector_abuse_boundary: 1,
    secure_drop_abuse_boundary: 1
  });
  assert.deepEqual(fixture.boundaryMapSummary.countByRelatedSystem, {
    ardyn: 6,
    "ardyn-subagent": 1,
    locus: 1,
    multiverse: 1,
    "content-fabric": 1,
    "repo-family": 6
  });
});

test("Phase 5.64 references Phase 5.48, 5.59, 5.60, 5.61, 5.62, 5.63, and content-fabric ownership", async () => {
  const fixture = await readFixture();
  const state = fixture.rateLimitingAbuseControlContractBoundaryMap;

  assert.equal(state.sourcePhaseContext.phase548RateLimitingAreaNumber, 9);
  assert.equal(state.sourcePhaseContext.phase548RateLimitingStatus, "deferred");
  assert.match(
    state.sourcePhaseContext.phase548ProductionReadinessCoverageMatrix,
    /phase5-48/
  );
  assert.match(state.sourcePhaseContext.phase559FabricAwareApiBackendBoundary, /phase5-59/);
  assert.match(
    state.sourcePhaseContext.phase560InterAgentEncodedHandoffConformance,
    /phase5-60/
  );
  assert.match(
    state.sourcePhaseContext.phase561DatabaseStorageContractBoundary,
    /phase5-61/
  );
  assert.match(
    state.sourcePhaseContext.phase562AuthPermissionsContractBoundary,
    /phase5-62/
  );
  assert.match(
    state.sourcePhaseContext.phase563SecurityRlsInputSanitizationContractBoundary,
    /phase5-63/
  );
  assert.equal(state.sourcePhaseContext.secureDropCanonicalOwner, "content-fabric");
  assert.equal(fixture.boundaryMapSummary.phase548RateLimitingCoverageItemRepresented, true);
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
    fixture.boundaryMapSummary.phase563SecurityRlsInputSanitizationBoundaryReferenced,
    true
  );
});

test("Phase 5.64 invalid rate-limiting/abuse-control boundary cases fail closed", () => {
  const canonical =
    createRateLimitingAbuseControlContractBoundaryMapForReview({ reviewedAt });
  const firstEntry = structuredClone(canonical.boundaryEntries[0]);
  const missingFieldEntry = structuredClone(firstEntry);

  delete missingFieldEntry.boundaryId;

  const cases = [
    {
      name:
        "malformed-rate-limiting-abuse-control-contract-boundary-map-input-rejected",
      input: null
    },
    {
      name:
        "malformed-rate-limiting-abuse-control-contract-boundary-map-input-rejected",
      input: { reviewedAt: "not-a-timestamp" }
    },
    {
      name:
        "missing-required-rate-limiting-abuse-control-contract-boundary-entry-rejected",
      input: { reviewedAt, boundaryEntries: [missingFieldEntry] }
    },
    {
      name:
        "unknown-top-level-field-rate-limiting-abuse-control-contract-boundary-map-input-rejected",
      input: { reviewedAt, unknownRateLimitPayload: "blocked" }
    },
    {
      name:
        "unknown-boundary-family-rate-limiting-abuse-control-contract-boundary-map-input-rejected",
      input: {
        reviewedAt,
        boundaryEntries: boundaryEntryPatch({ boundaryFamily: "runtime_limiter" })
      }
    },
    {
      name:
        "unknown-related-system-rate-limiting-abuse-control-contract-boundary-map-input-rejected",
      input: {
        reviewedAt,
        boundaryEntries: boundaryEntryPatch({ relatedSystem: "jules" })
      }
    },
    {
      name:
        "unknown-current-status-rate-limiting-abuse-control-contract-boundary-map-input-rejected",
      input: {
        reviewedAt,
        boundaryEntries: boundaryEntryPatch({ currentStatus: "implemented" })
      }
    },
    {
      name:
        "authorization-flags-enabled-rate-limiting-abuse-control-contract-boundary-map-input-rejected",
      input: {
        reviewedAt,
        boundaryEntries: boundaryEntryPatch({
          explicitBlockedAuthorizationFlags: {
            ...firstEntry.explicitBlockedAuthorizationFlags,
            limiterRuntimeAuthorizationGranted: true
          }
        })
      }
    },
    {
      name:
        "report-runs-checks-true-rate-limiting-abuse-control-contract-boundary-map-input-rejected",
      input: { reviewedAt, reportRunsChecks: true }
    },
    {
      name:
        "runtime-authorization-attempt-rate-limiting-abuse-control-contract-boundary-map-input-rejected",
      input: {
        reviewedAt,
        boundaryEntries: boundaryEntryPatch({
          hiddenRuntimeAuthorizationCandidate: {
            runtimeAuthorizationGranted: true
          }
        })
      }
    },
    {
      name:
        "command-exposure-attempt-rate-limiting-abuse-control-contract-boundary-map-input-rejected",
      input: { reviewedAt, commandExposureEnabled: true }
    },
    {
      name:
        "blocked-cli-bypass-attempt-rate-limiting-abuse-control-contract-boundary-map-input-rejected",
      input: { reviewedAt, blockedCliBypassEnabled: true }
    },
    {
      name:
        "hidden-rate-limit-middleware-semantics-rate-limiting-abuse-control-contract-boundary-map-input-rejected",
      input: { reviewedAt, rateLimitMiddleware: "blocked" }
    },
    {
      name:
        "hidden-quota-engine-semantics-rate-limiting-abuse-control-contract-boundary-map-input-rejected",
      input: { reviewedAt, quotaEngine: "blocked" }
    },
    {
      name:
        "hidden-abuse-detector-runtime-scanner-semantics-rate-limiting-abuse-control-contract-boundary-map-input-rejected",
      input: { reviewedAt, abuseDetector: "blocked" }
    },
    {
      name:
        "hidden-retry-circuit-breaker-execution-semantics-rate-limiting-abuse-control-contract-boundary-map-input-rejected",
      input: { reviewedAt, circuitBreaker: "blocked" }
    },
    {
      name:
        "hidden-idempotency-persistence-semantics-rate-limiting-abuse-control-contract-boundary-map-input-rejected",
      input: { reviewedAt, idempotencyStore: "blocked" }
    },
    {
      name:
        "hidden-backend-api-server-semantics-rate-limiting-abuse-control-contract-boundary-map-input-rejected",
      input: { reviewedAt, httpServer: "blocked" }
    },
    {
      name:
        "hidden-database-storage-cache-write-semantics-rate-limiting-abuse-control-contract-boundary-map-input-rejected",
      input: { reviewedAt, databaseUrl: "postgres://blocked" }
    },
    {
      name:
        "hidden-auth-session-token-api-key-semantics-rate-limiting-abuse-control-contract-boundary-map-input-rejected",
      input: { reviewedAt, sessionToken: "blocked" }
    },
    {
      name:
        "hidden-connector-grant-semantics-rate-limiting-abuse-control-contract-boundary-map-input-rejected",
      input: { reviewedAt, connectorGrant: "blocked" }
    },
    {
      name:
        "hidden-fabric-websocket-http-mcp-task-runtime-semantics-rate-limiting-abuse-control-contract-boundary-map-input-rejected",
      input: { reviewedAt, fabricBusTopic: "blocked.topic" }
    },
    {
      name:
        "hidden-secure-drop-implementation-semantics-rate-limiting-abuse-control-contract-boundary-map-input-rejected",
      input: { reviewedAt, secureDropPayloadPath: "C:/blocked/drop" }
    },
    {
      name:
        "hidden-encoded-handoff-codec-translator-stego-covert-channel-tokenizer-exploit-bypass-semantics-rate-limiting-abuse-control-contract-boundary-map-input-rejected",
      input: { reviewedAt, covertChannel: "blocked" }
    },
    {
      name:
        "unsafe-limiter-quota-throttle-abuse-queue-scheduler-retry-circuit-breaker-idempotency-cost-backend-storage-runtime-flags-rate-limiting-abuse-control-contract-boundary-map-input-rejected",
      input: {
        reviewedAt,
        boundaryEntries: boundaryEntryPatch({
          unsafeRateLimitingAbuseControlRuntimeFlags: {
            ...firstEntry.unsafeRateLimitingAbuseControlRuntimeFlags,
            quotaEngineImplemented: true
          }
        })
      }
    },
    {
      name:
        "nested-unsafe-flags-rate-limiting-abuse-control-contract-boundary-map-input-rejected",
      input: {
        reviewedAt,
        boundaryEntries: boundaryEntryPatch({
          runtimeEffect: {
            ...firstEntry.runtimeEffect,
            unexpectedRuntimeEffect: true
          }
        })
      }
    },
    {
      name:
        "noncanonical-rate-limiting-abuse-control-contract-boundary-map-input-rejected",
      input: {
        reviewedAt,
        boundaryEntries: [...canonical.boundaryEntries].reverse()
      }
    }
  ];

  for (const { name, input } of cases) {
    const result =
      createRateLimitingAbuseControlContractBoundaryMapForReview(input);

    assert.equal(result.classification, expectedCaseClassifications[name], name);
    assert.equal(result.rateLimitingAbuseControlContractBoundaryMapProduced, false);
    assert.equal(result.rateLimitingAbuseControlContractBoundaryMap, null);
    assertNonAuthorizing(result);
  }
});

test("Phase 5.64 boundary entries cover required families, systems, and blocked abuse-control semantics", async () => {
  const fixture = await readFixture();
  const families = new Set();
  const systems = new Set();
  const statuses = new Set();

  for (const entry of fixture.boundaryEntries) {
    families.add(entry.boundaryFamily);
    systems.add(entry.relatedSystem);
    statuses.add(entry.currentStatus);

    assert.match(entry.boundaryId, /^phase5-64\./);
    assert.equal(entry.rateLimitingAbuseControlBoundaryMetadataOnly, true);
    assert.equal(entry.noLiveTrafficHandlingPerformed, true);
    assert.equal(entry.nonAuthorizingProof, true);
    assert.ok(entry.allowedCurrentBehavior.length >= 2);
    assert.ok(entry.forbiddenCurrentBehavior.includes("limiter runtime"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("quota engine"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("throttle runtime"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("abuse detector"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("queue"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("scheduler"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("retry engine"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("circuit breaker"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("idempotency store"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("backend API"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("storage write"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("connector grant"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("websocket/http transport"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("MCP tool exposure"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("task execution"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("command exposure"));
    assert.equal(entry.productionReadinessAreaReference.areaNumber, 9);
    assert.equal(entry.productionReadinessAreaReference.authorizesRuntime, false);
    assert.equal(
      entry.phase559FabricAwareApiBackendReference.implementsFabricRuntime,
      false
    );
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
    assertAllFalse(entry.explicitBlockedAuthorizationFlags);
    assertAllFalse(entry.unsafeRateLimitingAbuseControlRuntimeFlags);
    assertAllFalse(entry.runtimeEffect);
  }

  assert.deepEqual([...families].sort(), [
    "abuse_detection_contract",
    "backpressure_contract",
    "connector_abuse_boundary",
    "denial_of_service_boundary",
    "encoded_handoff_abuse_boundary",
    "fabric_coordination_abuse_boundary",
    "idempotency_contract",
    "quota_contract",
    "rate_limit_contract",
    "request_cost_contract",
    "retry_budget_contract",
    "secure_drop_abuse_boundary",
    "throttle_contract"
  ]);
  assert.deepEqual([...systems].sort(), [
    "ardyn",
    "ardyn-subagent",
    "content-fabric",
    "locus",
    "multiverse",
    "repo-family"
  ]);
  assert.deepEqual([...statuses].sort(), [
    "blocked",
    "future_contract_required",
    "metadata_only"
  ]);

  const secureDropEntry = fixture.boundaryEntries.find(
    (entry) => entry.relatedSystem === "content-fabric"
  );

  assert.ok(secureDropEntry);
  assert.match(secureDropEntry.secureDropRoleDescription, /content-fabric/);
});

test("Phase 5.64 boundary map stays non-authorizing and runtime-blocked", async () => {
  const fixture = await readFixture();
  const summary = fixture.boundaryMapSummary;

  assert.equal(summary.rateLimitingAbuseControlBoundaryMetadataOnly, true);
  assert.equal(summary.noLiveTrafficHandlingPerformed, true);
  assert.equal(summary.noLimiterRuntimeImplemented, true);
  assert.equal(summary.noQuotaEngineImplemented, true);
  assert.equal(summary.noThrottleRuntimeImplemented, true);
  assert.equal(summary.noAbuseDetectorImplemented, true);
  assert.equal(summary.noQueueSchedulerImplemented, true);
  assert.equal(summary.noRetryEngineImplemented, true);
  assert.equal(summary.noCircuitBreakerImplemented, true);
  assert.equal(summary.noIdempotencyStoreImplemented, true);
  assert.equal(summary.noBackendApiServerImplemented, true);
  assert.equal(summary.noStorageWrites, true);
  assert.equal(summary.noConnectorGrants, true);
  assert.equal(summary.contentFabricCanonicalSecureDropOwnerOnly, true);
  assert.equal(summary.allBlockedAuthorizationFlagsFalse, true);
  assert.equal(summary.allUnsafeRateLimitingAbuseControlRuntimeFlagsFalse, true);
  assert.equal(summary.allRuntimeEffectsFalse, true);
  assert.equal(summary.allEntriesNonAuthorizing, true);
  assert.equal(fixture.invalidBoundaryCasePolicy.validationImplementsLimiterRuntime, false);
  assert.equal(fixture.invalidBoundaryCasePolicy.validationImplementsQuotaEngine, false);
  assert.equal(fixture.invalidBoundaryCasePolicy.validationImplementsThrottleRuntime, false);
  assert.equal(fixture.invalidBoundaryCasePolicy.validationRunsAbuseDetector, false);
  assert.equal(fixture.invalidBoundaryCasePolicy.validationCreatesQueueScheduler, false);
  assert.equal(fixture.invalidBoundaryCasePolicy.validationRunsRetryEngine, false);
  assert.equal(fixture.invalidBoundaryCasePolicy.validationRunsCircuitBreaker, false);
  assert.equal(fixture.invalidBoundaryCasePolicy.validationCreatesIdempotencyStore, false);
  assert.equal(fixture.invalidBoundaryCasePolicy.validationRunsBackendApiServer, false);
  assert.equal(fixture.invalidBoundaryCasePolicy.validationWritesStorage, false);
  assert.equal(fixture.invalidBoundaryCasePolicy.validationGrantsConnectors, false);
  assert.equal(fixture.invalidBoundaryCasePolicy.validationRunsRuntime, false);
  assertNonAuthorizing(fixture);
  assertNonAuthorizing(fixture.rateLimitingAbuseControlContractBoundaryMap);
  assert.ok(
    fixture.topRateLimitingSecurityAuthDatabaseFabricApiBackendGaps.some((gap) =>
      gap.includes("No limiter runtime")
    )
  );
  assert.equal(
    fixture.recommendedNextPhase,
    "phase-5.65-review-only-error-tracking-logging-audit-integrity-contract-boundary-map"
  );
});

test("serve-runtime remains default-blocked and dry-run cannot bypass Phase 5.64", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-64-runtime-"));

  try {
    for (const args of [["serve-runtime"], ["serve-runtime", "--dry-run"]]) {
      const failure = await expectCliFailure(args);

      assert.equal(failure.code, 1);
      assert.equal(failure.stdout, "");
      assert.match(failure.stderr, /runtime unavailable/i);
    }
  } finally {
    await rm(scratch, { recursive: true, force: true });
  }
});

test("Phase 5.64 limiter/quota/throttle/runtime command names remain rejected", async () => {
  for (const command of commandProbes) {
    const failure = await expectCliFailure([command]);

    assert.notEqual(failure.code, 0);
    assert.equal(failure.stdout, "");
    assert.match(failure.stderr, /unknown command|Usage: ardyn/i);
  }
});

test("Phase 5.64 does not change CLI, Rust, Fabric, package, or consumer source", async () => {
  await execFileAsync(
    "git",
    [
      "diff",
      "--exit-code",
      phase564BaselineCommit,
      "--",
      "apps/cli/src/index.mjs",
      "crates/ardyn-host/src/lib.rs",
      "crates/ardyn-host/src/stdio_runtime/mod.rs",
      "packages/fabric/src/index.mjs",
      "package.json"
    ],
    {
      cwd: repoRoot
    }
  );

  const currentCliSource = await readFile(cliPath, "utf8");

  assert.doesNotMatch(currentCliSource, /rate-limiting-abuse-control-contract-boundary-map/);
  assert.doesNotMatch(currentCliSource, /limiter-runtime/);
  assert.doesNotMatch(currentCliSource, /rate-limiter-runtime/);
  assert.doesNotMatch(currentCliSource, /quota-engine/);
  assert.doesNotMatch(currentCliSource, /throttle-runtime/);
  assert.doesNotMatch(currentCliSource, /abuse-detector-runtime/);
  assert.doesNotMatch(currentCliSource, /abuse-scanner-runtime/);
  assert.doesNotMatch(currentCliSource, /queue-runtime/);
  assert.doesNotMatch(currentCliSource, /scheduler-runtime/);
  assert.doesNotMatch(currentCliSource, /retry-engine/);
  assert.doesNotMatch(currentCliSource, /circuit-breaker/);
  assert.doesNotMatch(currentCliSource, /idempotency-store/);
  assert.doesNotMatch(currentCliSource, /request-cost-meter/);
  assert.doesNotMatch(currentCliSource, /rate-limit-middleware/);
  assert.doesNotMatch(currentCliSource, /backend-rate-limit-runtime/);
  assert.doesNotMatch(currentCliSource, /fabric-abuse-runtime/);
  assert.doesNotMatch(currentCliSource, /encoded-handoff-abuse-runtime/);
  assert.doesNotMatch(currentCliSource, /secure-drop-abuse-runtime/);
  assert.doesNotMatch(currentCliSource, /connector-abuse-runtime/);
  assert.doesNotMatch(currentCliSource, /mcp-abuse-runtime/);
  assert.doesNotMatch(currentCliSource, /task-abuse-runtime/);
  assert.doesNotMatch(currentCliSource, /phase-5-64/);
});
