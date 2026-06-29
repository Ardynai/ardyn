import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";
import {
  EXTERNAL_GATEWAY_MATRIX_TRANSPORT_CONTRACT_BOUNDARY_MAP_SCHEMA,
  createExternalGatewayMatrixTransportContractBoundaryMapForReview
} from "../packages/core/src/index.mjs";

const execFileAsync = promisify(execFile);
const phase573BaselineCommit = "2a7966574c5d8303212daf1bf305a007f55ed78f";
const reviewedAt = "2026-06-29T00:00:00.000Z";
const repoRootUrl = new URL("../", import.meta.url);
const repoRoot = fileURLToPath(repoRootUrl);
const cliPath = fileURLToPath(
  new URL("../apps/cli/src/index.mjs", import.meta.url)
);
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-73/external-gateway-matrix-transport-contract-boundary-map.json",
  import.meta.url
);

const expectedCaseClassifications = Object.freeze({
  "valid-external-gateway-matrix-transport-contract-boundary-map":
    "valid_external_gateway_matrix_transport_contract_boundary_map_runtime_still_blocked",
  "malformed-external-gateway-matrix-transport-contract-boundary-map-input-rejected":
    "malformed_external_gateway_matrix_transport_contract_boundary_map_input_rejected",
  "missing-required-external-gateway-matrix-transport-boundary-entry-rejected":
    "missing_required_external_gateway_matrix_transport_boundary_entry_rejected",
  "unknown-top-level-field-external-gateway-matrix-transport-contract-boundary-map-input-rejected":
    "unknown_top_level_field_external_gateway_matrix_transport_contract_boundary_map_input_rejected",
  "unknown-boundary-family-external-gateway-matrix-transport-contract-boundary-map-input-rejected":
    "unknown_boundary_family_external_gateway_matrix_transport_contract_boundary_map_input_rejected",
  "unknown-related-system-external-gateway-matrix-transport-contract-boundary-map-input-rejected":
    "unknown_related_system_external_gateway_matrix_transport_contract_boundary_map_input_rejected",
  "unknown-current-status-external-gateway-matrix-transport-contract-boundary-map-input-rejected":
    "unknown_current_status_external_gateway_matrix_transport_contract_boundary_map_input_rejected",
  "authorization-flags-enabled-external-gateway-matrix-transport-contract-boundary-map-input-rejected":
    "authorization_flags_enabled_external_gateway_matrix_transport_contract_boundary_map_input_rejected",
  "report-runs-checks-true-external-gateway-matrix-transport-contract-boundary-map-input-rejected":
    "report_runs_checks_true_external_gateway_matrix_transport_contract_boundary_map_input_rejected",
  "runtime-authorization-attempt-external-gateway-matrix-transport-contract-boundary-map-input-rejected":
    "runtime_authorization_attempt_external_gateway_matrix_transport_contract_boundary_map_input_rejected",
  "command-exposure-attempt-external-gateway-matrix-transport-contract-boundary-map-input-rejected":
    "command_exposure_attempt_external_gateway_matrix_transport_contract_boundary_map_input_rejected",
  "blocked-cli-bypass-attempt-external-gateway-matrix-transport-contract-boundary-map-input-rejected":
    "blocked_cli_bypass_attempt_external_gateway_matrix_transport_contract_boundary_map_input_rejected",
  "hidden-matrix-gateway-runtime-semantics-external-gateway-matrix-transport-contract-boundary-map-input-rejected":
    "hidden_matrix_gateway_runtime_semantics_external_gateway_matrix_transport_contract_boundary_map_input_rejected",
  "hidden-external-connector-semantics-external-gateway-matrix-transport-contract-boundary-map-input-rejected":
    "hidden_external_connector_semantics_external_gateway_matrix_transport_contract_boundary_map_input_rejected",
  "hidden-fabric-websocket-http-mcp-task-runtime-semantics-external-gateway-matrix-transport-contract-boundary-map-input-rejected":
    "hidden_fabric_websocket_http_mcp_task_runtime_semantics_external_gateway_matrix_transport_contract_boundary_map_input_rejected",
  "hidden-content-addressed-chunked-resumable-p2p-transport-semantics-external-gateway-matrix-transport-contract-boundary-map-input-rejected":
    "hidden_content_addressed_chunked_resumable_p2p_transport_semantics_external_gateway_matrix_transport_contract_boundary_map_input_rejected",
  "hidden-secure-drop-implementation-semantics-external-gateway-matrix-transport-contract-boundary-map-input-rejected":
    "hidden_secure_drop_implementation_semantics_external_gateway_matrix_transport_contract_boundary_map_input_rejected",
  "hidden-secret-env-vault-token-keyring-semantics-external-gateway-matrix-transport-contract-boundary-map-input-rejected":
    "hidden_secret_env_vault_token_keyring_semantics_external_gateway_matrix_transport_contract_boundary_map_input_rejected",
  "hidden-shell-path-executable-env-history-runtime-semantics-external-gateway-matrix-transport-contract-boundary-map-input-rejected":
    "hidden_shell_path_executable_env_history_runtime_semantics_external_gateway_matrix_transport_contract_boundary_map_input_rejected",
  "hidden-sqlite-embedded-db-query-key-runtime-semantics-external-gateway-matrix-transport-contract-boundary-map-input-rejected":
    "hidden_sqlite_embedded_db_query_key_runtime_semantics_external_gateway_matrix_transport_contract_boundary_map_input_rejected",
  "hidden-backend-api-server-semantics-external-gateway-matrix-transport-contract-boundary-map-input-rejected":
    "hidden_backend_api_server_semantics_external_gateway_matrix_transport_contract_boundary_map_input_rejected",
  "hidden-database-storage-cache-write-semantics-external-gateway-matrix-transport-contract-boundary-map-input-rejected":
    "hidden_database_storage_cache_write_semantics_external_gateway_matrix_transport_contract_boundary_map_input_rejected",
  "hidden-auth-session-token-api-key-semantics-external-gateway-matrix-transport-contract-boundary-map-input-rejected":
    "hidden_auth_session_token_api_key_semantics_external_gateway_matrix_transport_contract_boundary_map_input_rejected",
  "hidden-logger-audit-transcript-telemetry-external-sink-semantics-external-gateway-matrix-transport-contract-boundary-map-input-rejected":
    "hidden_logger_audit_transcript_telemetry_external_sink_semantics_external_gateway_matrix_transport_contract_boundary_map_input_rejected",
  "hidden-infrastructure-deployment-compliance-pii-retention-export-semantics-external-gateway-matrix-transport-contract-boundary-map-input-rejected":
    "hidden_infrastructure_deployment_compliance_pii_retention_export_semantics_external_gateway_matrix_transport_contract_boundary_map_input_rejected",
  "hidden-testing-ci-release-automation-semantics-external-gateway-matrix-transport-contract-boundary-map-input-rejected":
    "hidden_testing_ci_release_automation_semantics_external_gateway_matrix_transport_contract_boundary_map_input_rejected",
  "unsafe-external-gateway-matrix-transport-runtime-flags-external-gateway-matrix-transport-contract-boundary-map-input-rejected":
    "unsafe_external_gateway_matrix_transport_runtime_flags_external_gateway_matrix_transport_contract_boundary_map_input_rejected",
  "nested-unsafe-flags-external-gateway-matrix-transport-contract-boundary-map-input-rejected":
    "nested_unsafe_flags_external_gateway_matrix_transport_contract_boundary_map_input_rejected",
  "noncanonical-external-gateway-matrix-transport-contract-boundary-map-input-rejected":
    "noncanonical_external_gateway_matrix_transport_contract_boundary_map_input_rejected"
});

const expectedBoundaryFamilies = Object.freeze([
  "matrix_gateway_contract",
  "matrix_room_contract",
  "matrix_identity_contract",
  "matrix_e2ee_boundary",
  "gateway_transport_contract",
  "gateway_delivery_contract",
  "gateway_ingestion_contract",
  "gateway_export_contract",
  "gateway_moderation_contract",
  "gateway_rate_limit_contract",
  "gateway_audit_contract",
  "locus_gateway_visibility_contract",
  "harness_gateway_bridge_contract",
  "fabric_core_consumer_boundary",
  "large_payload_transfer_todo_boundary",
  "external_platform_gateway_contract"
]);

const expectedRelatedSystems = Object.freeze([
  "ardyn",
  "ardyn-subagent",
  "locus",
  "multiverse",
  "content-fabric",
  "repo-family",
  "external-harness",
  "matrix-reference",
  "hiclaw-reference",
  "fabric-core-reference"
]);

const expectedStatusValues = Object.freeze([
  "metadata_only",
  "blocked",
  "future_contract_required"
]);

const commandProbes = Object.freeze([
  "external-gateway-matrix-transport-contract-boundary-map",
  "matrix-gateway-runtime",
  "matrix-client-runtime",
  "matrix-homeserver-runtime",
  "matrix-room-poller",
  "matrix-message-sender",
  "matrix-e2ee-runtime",
  "external-gateway-runtime",
  "telegram-gateway-runtime",
  "discord-gateway-runtime",
  "slack-gateway-runtime",
  "signal-gateway-runtime",
  "whatsapp-gateway-runtime",
  "home-assistant-gateway-runtime",
  "fabric-core-producer-runtime",
  "content-addressed-transfer-runtime",
  "chunked-transfer-runtime",
  "resumable-transfer-runtime",
  "multi-source-transfer-runtime",
  "p2p-transfer-runtime",
  "large-payload-transfer-runtime",
  "shell-runtime",
  "sqlite-runtime"
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
  "schedulePollingEnabled",
  "filesystemWriteEnabled",
  "processControlEnabled",
  "matrixClientRuntimeEnabled",
  "homeserverConnectionEnabled",
  "matrixRoomJoinRuntimeEnabled",
  "matrixRoomSendRuntimeEnabled",
  "matrixRoomReadRuntimeEnabled",
  "matrixRoomPollRuntimeEnabled",
  "e2eeKeySessionHandlingEnabled",
  "accessTokenLoaderEnabled",
  "gatewayRuntimeEnabled",
  "externalPlatformConnectorEnabled",
  "messageIngestionRuntimeEnabled",
  "messageExportRuntimeEnabled",
  "contentAddressedTransportEnabled",
  "chunkedTransferEnabled",
  "resumableTransferEnabled",
  "multiSourceTransferEnabled",
  "bittorrentDhtSwarmP2pEnabled",
  "largePayloadTransferRuntimeEnabled",
  "fabricCoreProducerBehaviorEnabled",
  "shellRuntimeEnabled",
  "sqliteRuntimeEnabled",
  "backendRuntimeImplementedByArdyn",
  "databaseStorageRuntimeWritesEnabled",
  "loggerRuntimeImplemented",
  "auditWriterRuntimeImplemented",
  "telemetryClientImplemented",
  "healthCheckRuntimeImplemented"
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
  const valid = createExternalGatewayMatrixTransportContractBoundaryMapForReview({
    reviewedAt
  });
  const runtimeFlagNames = Object.keys(
    valid.boundaryEntries[0].unsafeExternalGatewayMatrixTransportRuntimeFlags
  );

  for (const field of runtimeFlagNames) {
    assert.equal(result[field], false, `${field} should be false`);
  }

  assert.equal(result.reportRunsChecks, false);
  assert.equal(result.nonAuthorizingProof, true);
  assertAllFalse(result.runtimeEffect);
}

function boundaryEntryPatch(patch) {
  const [entry] = createExternalGatewayMatrixTransportContractBoundaryMapForReview({
    reviewedAt
  }).boundaryEntries;

  return [{ ...structuredClone(entry), ...patch }];
}

test("Phase 5.73 external gateway/Matrix boundary map fixture is deterministic", async () => {
  const fixture = await readFixture();
  const generated = createExternalGatewayMatrixTransportContractBoundaryMapForReview({
    reviewedAt
  });

  assert.deepEqual(fixture, generated);
  assert.equal(
    fixture.schema,
    EXTERNAL_GATEWAY_MATRIX_TRANSPORT_CONTRACT_BOUNDARY_MAP_SCHEMA
  );
  assert.equal(fixture.reviewedAt, reviewedAt);
  assert.equal(
    fixture.classification,
    expectedCaseClassifications[
      "valid-external-gateway-matrix-transport-contract-boundary-map"
    ]
  );
  assert.equal(
    fixture.externalGatewayMatrixTransportContractBoundaryMapProduced,
    true
  );
  assert.equal(
    fixture.externalGatewayMatrixTransportContractBoundaryMapMode,
    "review-only"
  );
  assert.equal(fixture.boundaryEntries.length, 17);
  assertNonAuthorizing(fixture);
});

test("Phase 5.73 covers requested Matrix, gateway, fabric-core consumer, and large-payload boundaries", async () => {
  const fixture = await readFixture();
  const state = fixture.externalGatewayMatrixTransportContractBoundaryMap;
  const summary = fixture.boundaryMapSummary;

  assert.deepEqual(summary.boundaryFamilies, expectedBoundaryFamilies);
  assert.deepEqual(summary.relatedSystems, expectedRelatedSystems);
  assert.deepEqual(summary.currentStatusValues, expectedStatusValues);
  assert.equal(state.sourcePhaseContext.phase572CredentialLinkageRequiredBeforeRuntime, true);
  assert.equal(state.sourcePhaseContext.hiclawStyleRoomCoordinationReferenceOnly, true);
  assert.equal(state.sourcePhaseContext.fabricCoreProducerRepository, "Ardynai/multiverse");
  assert.equal(state.sourcePhaseContext.fabricCoreProducerPackage, "packages/fabric-core");
  assert.equal(state.sourcePhaseContext.ardynFutureFabricCoreRole, "consumer-only-after-paired-security-review");
  assert.equal(state.sourcePhaseContext.noMatrixClientImplemented, true);
  assert.equal(state.sourcePhaseContext.noGatewayRuntimeImplemented, true);
  assert.equal(state.sourcePhaseContext.noFabricCoreProducerImplemented, true);
  assert.equal(state.sourcePhaseContext.noLargePayloadTransferImplemented, true);
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
    assert.match(entry.boundaryId, /^phase5-73\./);
    assert.ok(expectedBoundaryFamilies.includes(entry.boundaryFamily));
    assert.ok(expectedRelatedSystems.includes(entry.relatedSystem));
    assert.ok(expectedStatusValues.includes(entry.currentStatus));
    assert.equal(entry.gatewayTransportBoundaryMetadataOnly, true);
    assert.equal(entry.noLiveExternalGatewayMatrixTransportRuntimePerformed, true);
    assert.equal(entry.nonAuthorizingProof, true);
    assertAllFalse(entry.explicitBlockedAuthorizationFlags);
    assertAllFalse(entry.unsafeExternalGatewayMatrixTransportRuntimeFlags);
    assertAllFalse(entry.runtimeEffect);
    assert.match(entry.credentialKeyExpectation, /Phase 5\.72/);
    assert.match(entry.forbiddenCurrentBehavior.join(" "), /Matrix client/);
    assert.match(entry.forbiddenCurrentBehavior.join(" "), /content-addressed transport/);
    assert.match(entry.forbiddenCurrentBehavior.join(" "), /BitTorrent/);
    assert.match(entry.forbiddenCurrentBehavior.join(" "), /Secure Drop implementation/);
    assert.match(entry.forbiddenCurrentBehavior.join(" "), /shell runtime/);
    assert.match(entry.forbiddenCurrentBehavior.join(" "), /SQLite runtime/);
    assert.match(entry.forbiddenCurrentBehavior.join(" "), /blocked CLI bypass/);
  }

  const matrixGateway = fixture.boundaryEntries.find(
    (entry) => entry.boundaryFamily === "matrix_gateway_contract"
  );
  assert.equal(matrixGateway.relatedSystem, "matrix-reference");
  assert.match(matrixGateway.requiredFutureContractBeforeImplementation, /homeserver URL/);
  assert.match(matrixGateway.gatewayIdentityExpectation, /homeserver URL/);
  assert.match(matrixGateway.roomChannelAllowlistExpectation, /room\/channel allowlists/);

  const room = fixture.boundaryEntries.find(
    (entry) => entry.boundaryFamily === "matrix_room_contract"
  );
  assert.match(room.requiredFutureContractBeforeImplementation, /room allowlist/);
  assert.match(room.messageIngestionExportExpectation, /ingests and sends no message/);

  const identity = fixture.boundaryEntries.find(
    (entry) => entry.boundaryFamily === "matrix_identity_contract"
  );
  assert.match(identity.gatewayIdentityExpectation, /user\/device identity/);

  const e2ee = fixture.boundaryEntries.find(
    (entry) => entry.boundaryFamily === "matrix_e2ee_boundary"
  );
  assert.equal(e2ee.currentStatus, "blocked");
  assert.match(e2ee.e2eeKeySessionExpectation, /no Olm\/Megolm session/);

  const externalPlatform = fixture.boundaryEntries.find(
    (entry) => entry.boundaryFamily === "external_platform_gateway_contract"
  );
  assert.equal(externalPlatform.externalPlatformGatewayExpectation.telegram, "future metadata only");
  assert.equal(externalPlatform.externalPlatformGatewayExpectation.discord, "future metadata only");
  assert.equal(externalPlatform.externalPlatformGatewayExpectation.slack, "future metadata only");
  assert.equal(externalPlatform.externalPlatformGatewayExpectation.signal, "future metadata only");
  assert.equal(externalPlatform.externalPlatformGatewayExpectation.whatsapp, "future metadata only");
  assert.equal(externalPlatform.externalPlatformGatewayExpectation.homeAssistant, "future metadata only");
  assert.equal(externalPlatform.externalPlatformGatewayExpectation.runtimeImplemented, false);

  const fabricCore = fixture.boundaryEntries.find(
    (entry) => entry.boundaryFamily === "fabric_core_consumer_boundary"
  );
  assert.equal(fabricCore.fabricCoreProducerReference.producerRepository, "Ardynai/multiverse");
  assert.equal(fabricCore.fabricCoreProducerReference.producerPackage, "packages/fabric-core");
  assert.equal(fabricCore.fabricCoreProducerReference.producerImplementedByArdyn, false);
  assert.equal(fabricCore.fabricCoreConsumerExpectation.futureFabricCoreConsumerOnly, true);
  assert.equal(fabricCore.fabricCoreConsumerExpectation.contentAddressedTransportImplementedByArdyn, false);
  assert.equal(fabricCore.fabricCoreConsumerExpectation.chunkedTransferImplementedByArdyn, false);
  assert.equal(fabricCore.fabricCoreConsumerExpectation.resumableTransferImplementedByArdyn, false);
  assert.equal(fabricCore.fabricCoreConsumerExpectation.multiSourceTransferImplementedByArdyn, false);
  assert.equal(fabricCore.fabricCoreConsumerExpectation.bittorrentDhtSwarmP2pImplementedByArdyn, false);
  assert.equal(fabricCore.fabricCoreConsumerExpectation.largePayloadTransferRuntimeImplementedByArdyn, false);
  assert.match(fabricCore.largePayloadTransferExpectation, /future_fabric_core_consumer_only/);

  const largePayload = fixture.boundaryEntries.find(
    (entry) => entry.boundaryFamily === "large_payload_transfer_todo_boundary"
  );
  assert.match(largePayload.requiredFutureContractBeforeImplementation, /model weights/);
  assert.match(largePayload.requiredFutureContractBeforeImplementation, /large connector packs/);
  assert.match(largePayload.requiredFutureContractBeforeImplementation, /large skill packs/);
  assert.match(largePayload.requiredFutureContractBeforeImplementation, /big media/);
  assert.match(largePayload.largePayloadTransferExpectation, /future_fabric_core_consumer_only/);

  assert.ok(
    fixture.boundaryEntries.some(
      (entry) =>
        entry.relatedSystem === "content-fabric" &&
        entry.secureDropRoleDescription.includes("canonical to content-fabric")
    )
  );
  assert.ok(
    fixture.boundaryEntries.some(
      (entry) =>
        entry.relatedSystem === "locus" &&
        entry.locusRoleDescription.includes("display gateway status")
    )
  );
  assert.ok(
    fixture.boundaryEntries.some(
      (entry) =>
        entry.relatedSystem === "hiclaw-reference" &&
        entry.gatewayIdentityExpectation.includes("HiClaw-style coordination")
    )
  );
});

test("Phase 5.73 invalid external gateway and Matrix cases fail closed", () => {
  const valid = createExternalGatewayMatrixTransportContractBoundaryMapForReview({
    reviewedAt
  });
  const firstEntry = valid.boundaryEntries[0];
  const missingBoundaryIdEntry = { ...firstEntry };
  delete missingBoundaryIdEntry.boundaryId;

  const cases = [
    [
      null,
      "malformed-external-gateway-matrix-transport-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt: "not-a-date" },
      "malformed-external-gateway-matrix-transport-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, boundaryEntries: [missingBoundaryIdEntry] },
      "missing-required-external-gateway-matrix-transport-boundary-entry-rejected"
    ],
    [
      { reviewedAt, unknownField: true },
      "unknown-top-level-field-external-gateway-matrix-transport-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, boundaryEntries: boundaryEntryPatch({ boundaryFamily: "matrix_runtime" }) },
      "unknown-boundary-family-external-gateway-matrix-transport-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, boundaryEntries: boundaryEntryPatch({ relatedSystem: "matrix" }) },
      "unknown-related-system-external-gateway-matrix-transport-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, boundaryEntries: boundaryEntryPatch({ currentStatus: "enabled" }) },
      "unknown-current-status-external-gateway-matrix-transport-contract-boundary-map-input-rejected"
    ],
    [
      {
        reviewedAt,
        boundaryEntries: boundaryEntryPatch({
          explicitBlockedAuthorizationFlags: {
            ...firstEntry.explicitBlockedAuthorizationFlags,
            matrixGatewayAuthorizationGranted: true
          }
        })
      },
      "authorization-flags-enabled-external-gateway-matrix-transport-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, reportRunsChecks: true },
      "report-runs-checks-true-external-gateway-matrix-transport-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, runtimeAuthorized: true },
      "runtime-authorization-attempt-external-gateway-matrix-transport-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, commandExposureEnabled: true },
      "command-exposure-attempt-external-gateway-matrix-transport-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, blockedCliBypassEnabled: true },
      "blocked-cli-bypass-attempt-external-gateway-matrix-transport-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, matrixClient: { enabled: false } },
      "hidden-matrix-gateway-runtime-semantics-external-gateway-matrix-transport-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, telegramClient: { enabled: false } },
      "hidden-external-connector-semantics-external-gateway-matrix-transport-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, fabricBus: { enabled: false } },
      "hidden-fabric-websocket-http-mcp-task-runtime-semantics-external-gateway-matrix-transport-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, contentAddressedTransport: { enabled: false } },
      "hidden-content-addressed-chunked-resumable-p2p-transport-semantics-external-gateway-matrix-transport-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, secureDropTransport: { enabled: false } },
      "hidden-secure-drop-implementation-semantics-external-gateway-matrix-transport-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, accessToken: "not-a-real-token" },
      "hidden-secret-env-vault-token-keyring-semantics-external-gateway-matrix-transport-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, shellRuntime: { enabled: false } },
      "hidden-shell-path-executable-env-history-runtime-semantics-external-gateway-matrix-transport-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, sqliteRuntime: { enabled: false } },
      "hidden-sqlite-embedded-db-query-key-runtime-semantics-external-gateway-matrix-transport-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, apiServer: { enabled: false } },
      "hidden-backend-api-server-semantics-external-gateway-matrix-transport-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, databaseClient: { enabled: false } },
      "hidden-database-storage-cache-write-semantics-external-gateway-matrix-transport-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, apiKey: "not-a-real-key" },
      "hidden-auth-session-token-api-key-semantics-external-gateway-matrix-transport-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, telemetryClient: { enabled: false } },
      "hidden-logger-audit-transcript-telemetry-external-sink-semantics-external-gateway-matrix-transport-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, deploymentAutomation: { enabled: false } },
      "hidden-infrastructure-deployment-compliance-pii-retention-export-semantics-external-gateway-matrix-transport-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, ciPipeline: { enabled: false } },
      "hidden-testing-ci-release-automation-semantics-external-gateway-matrix-transport-contract-boundary-map-input-rejected"
    ],
    [
      {
        reviewedAt,
        boundaryEntries: boundaryEntryPatch({
          unsafeExternalGatewayMatrixTransportRuntimeFlags: {
            ...firstEntry.unsafeExternalGatewayMatrixTransportRuntimeFlags,
            gatewayRuntimeEnabled: true
          }
        })
      },
      "unsafe-external-gateway-matrix-transport-runtime-flags-external-gateway-matrix-transport-contract-boundary-map-input-rejected"
    ],
    [
      {
        reviewedAt,
        boundaryEntries: boundaryEntryPatch({
          runtimeEffect: { ...firstEntry.runtimeEffect, runtimeReady: true }
        })
      },
      "nested-unsafe-flags-external-gateway-matrix-transport-contract-boundary-map-input-rejected"
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
      "noncanonical-external-gateway-matrix-transport-contract-boundary-map-input-rejected"
    ]
  ];

  for (const [input, caseKey] of cases) {
    const result =
      createExternalGatewayMatrixTransportContractBoundaryMapForReview(input);
    assert.equal(
      result.classification,
      expectedCaseClassifications[caseKey],
      caseKey
    );
    assert.equal(
      result.externalGatewayMatrixTransportContractBoundaryMapProduced,
      false,
      caseKey
    );
    assert.equal(result.boundaryEntries.length, 0, caseKey);
    assertNonAuthorizing(result);
  }
});

test("Phase 5.73 enabled runtime flags cannot authorize gateway or transport behavior", () => {
  for (const field of unsafeFlagCases) {
    const result =
      createExternalGatewayMatrixTransportContractBoundaryMapForReview({
        reviewedAt,
        [field]: true
      });

    assert.equal(
      result.classification,
      expectedCaseClassifications[
        "unsafe-external-gateway-matrix-transport-runtime-flags-external-gateway-matrix-transport-contract-boundary-map-input-rejected"
      ],
      field
    );
    assert.equal(
      result.externalGatewayMatrixTransportContractBoundaryMapProduced,
      false,
      field
    );
    assertNonAuthorizing(result);
  }
});

test("Phase 5.73 boundary map stays non-authorizing and runtime-blocked", async () => {
  const fixture = await readFixture();
  const summary = fixture.boundaryMapSummary;

  for (const field of [
    "externalGatewayMatrixTransportBoundaryMetadataOnly",
    "noLiveExternalGatewayMatrixTransportRuntimePerformed",
    "matrixHomeserverUrlBoundaryRecorded",
    "matrixRoomAllowlistBoundaryRecorded",
    "matrixUserDeviceIdentityBoundaryRecorded",
    "matrixAccessRefreshTokenBoundaryLinkedFromPhase572",
    "matrixE2eeKeySessionBoundaryRecorded",
    "matrixMessageIngestionBoundaryRecorded",
    "matrixMessageExportSendBoundaryRecorded",
    "matrixDeliveryRetryRateLimitBoundaryRecorded",
    "matrixModerationAbuseControlBoundaryRecorded",
    "matrixAuditLoggingBoundaryRecorded",
    "locusVisibleGatewayStatusBoundaryRecorded",
    "hiclawRoomCoordinationReferenceBoundaryRecorded",
    "externalPlatformGatewayBoundaryRecorded",
    "locusMediatedHarnessBridgeBoundaryRecorded",
    "externalHarnessGatewayBridgeBoundaryRecorded",
    "fabricCoordinationEnvelopeGatewayBoundaryRecorded",
    "fabricCoreFutureConsumerBoundaryRecorded",
    "largePayloadTodoBoundaryRecorded",
    "secureDropGatewayReferenceBoundaryRecorded",
    "noMatrixClientRuntime",
    "noHomeserverConnection",
    "noRoomJoinReadSendPollRuntime",
    "noE2eeKeySessionHandling",
    "noAccessTokenLoader",
    "noGatewayRuntime",
    "noExternalPlatformConnector",
    "noMessageIngestionExportRuntime",
    "noServiceDiscoverySchedulePolling",
    "noContentAddressedChunkedResumableMultiSourceTransfer",
    "noBitTorrentDhtSwarmP2pBehavior",
    "noLargePayloadTransferRuntime",
    "noFabricCoreProducerBehavior",
    "noFabricWebsocketHttpMcpTaskRuntime",
    "noSecureDropImplementation",
    "noShellRuntime",
    "noSqliteRuntime",
    "noBackendApiServerDatabaseStorageCacheRlsMigration",
    "noTranscriptAuditTelemetryLoggerHealthRuntime",
    "noInfrastructureDeploymentComplianceAutomation",
    "noTestingCiReleaseAutomation",
    "noFilesystemProcessUiRuntime",
    "noCommandExposure",
    "noBlockedCliBypass",
    "allBlockedAuthorizationFlagsFalse",
    "allUnsafeExternalGatewayMatrixTransportRuntimeFlagsFalse",
    "allRuntimeEffectsFalse",
    "allEntriesNonAuthorizing"
  ]) {
    assert.equal(summary[field], true, `${field} should be true`);
  }

  assertNonAuthorizing(fixture);
  assert.equal(
    fixture.recommendedNextPhase,
    "phase-5.74-review-only-command-surface-shell-primitive-contract-boundary-map"
  );
});

test("serve-runtime remains default-blocked and dry-run cannot bypass Phase 5.73", async () => {
  const direct = await expectCliFailure(["serve-runtime"]);
  assert.notEqual(direct.code, 0);
  assert.equal(direct.stdout, "");

  const dryRun = await expectCliFailure(["serve-runtime", "--dry-run"]);
  assert.notEqual(dryRun.code, 0);
  assert.equal(dryRun.stdout, "");
});

test("Phase 5.73 gateway and transport command names remain rejected", async () => {
  for (const command of commandProbes) {
    const error = await expectCliFailure([command]);
    assert.notEqual(error.code, 0, command);
    assert.equal(error.stdout, "", command);
  }
});

test("Phase 5.73 does not change CLI, Rust, Fabric, package, or consumer source", async () => {
  const files = [
    "apps/cli/src/index.mjs",
    "crates/ardyn-host/src/lib.rs",
    "crates/ardyn-host/src/stdio_runtime/mod.rs",
    "packages/fabric/src/index.mjs",
    "package.json"
  ];

  for (const file of files) {
    const [baseline, current] = await Promise.all([
      execFileAsync("git", ["show", `${phase573BaselineCommit}:${file}`], {
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
