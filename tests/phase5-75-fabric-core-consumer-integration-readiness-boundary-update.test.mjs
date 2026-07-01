import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";
import {
  FABRIC_CORE_CONSUMER_INTEGRATION_READINESS_BOUNDARY_UPDATE_SCHEMA,
  createFabricCoreConsumerIntegrationReadinessBoundaryUpdateForReview
} from "../packages/core/src/index.mjs";

const execFileAsync = promisify(execFile);
const phase575BaselineCommit = "f2b19206754ee5dd70a2f4cbebb77d5823b02672";
const reviewedAt = "2026-07-01T00:00:00.000Z";
const repoRootUrl = new URL("../", import.meta.url);
const repoRoot = fileURLToPath(repoRootUrl);
const cliPath = fileURLToPath(
  new URL("../apps/cli/src/index.mjs", import.meta.url)
);
const packageJsonUrl = new URL("../package.json", import.meta.url);
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-75/fabric-core-consumer-integration-readiness-boundary-update.json",
  import.meta.url
);

const expectedCaseClassifications = Object.freeze({
  "valid-fabric-core-consumer-integration-readiness-boundary-update":
    "valid_fabric_core_consumer_integration_readiness_boundary_update_runtime_still_blocked",
  "malformed-fabric-core-consumer-integration-readiness-boundary-update-input-rejected":
    "malformed_fabric_core_consumer_integration_readiness_boundary_update_input_rejected",
  "missing-required-fabric-core-consumer-readiness-boundary-entry-rejected":
    "missing_required_fabric_core_consumer_readiness_boundary_entry_rejected",
  "unknown-top-level-field-fabric-core-consumer-integration-readiness-boundary-update-input-rejected":
    "unknown_top_level_field_fabric_core_consumer_integration_readiness_boundary_update_input_rejected",
  "unknown-boundary-family-fabric-core-consumer-integration-readiness-boundary-update-input-rejected":
    "unknown_boundary_family_fabric_core_consumer_integration_readiness_boundary_update_input_rejected",
  "unknown-related-system-fabric-core-consumer-integration-readiness-boundary-update-input-rejected":
    "unknown_related_system_fabric_core_consumer_integration_readiness_boundary_update_input_rejected",
  "unknown-current-status-fabric-core-consumer-integration-readiness-boundary-update-input-rejected":
    "unknown_current_status_fabric_core_consumer_integration_readiness_boundary_update_input_rejected",
  "authorization-flags-enabled-fabric-core-consumer-integration-readiness-boundary-update-input-rejected":
    "authorization_flags_enabled_fabric_core_consumer_integration_readiness_boundary_update_input_rejected",
  "report-runs-checks-true-fabric-core-consumer-integration-readiness-boundary-update-input-rejected":
    "report_runs_checks_true_fabric_core_consumer_integration_readiness_boundary_update_input_rejected",
  "runtime-authorization-attempt-fabric-core-consumer-integration-readiness-boundary-update-input-rejected":
    "runtime_authorization_attempt_fabric_core_consumer_integration_readiness_boundary_update_input_rejected",
  "command-exposure-attempt-fabric-core-consumer-integration-readiness-boundary-update-input-rejected":
    "command_exposure_attempt_fabric_core_consumer_integration_readiness_boundary_update_input_rejected",
  "blocked-cli-bypass-attempt-fabric-core-consumer-integration-readiness-boundary-update-input-rejected":
    "blocked_cli_bypass_attempt_fabric_core_consumer_integration_readiness_boundary_update_input_rejected",
  "hidden-fabric-core-import-semantics-fabric-core-consumer-integration-readiness-boundary-update-input-rejected":
    "hidden_fabric_core_import_semantics_fabric_core_consumer_integration_readiness_boundary_update_input_rejected",
  "hidden-sidecar-http-bearer-token-semantics-fabric-core-consumer-integration-readiness-boundary-update-input-rejected":
    "hidden_sidecar_http_bearer_token_semantics_fabric_core_consumer_integration_readiness_boundary_update_input_rejected",
  "hidden-hashing-content-id-verification-semantics-fabric-core-consumer-integration-readiness-boundary-update-input-rejected":
    "hidden_hashing_content_id_verification_semantics_fabric_core_consumer_integration_readiness_boundary_update_input_rejected",
  "hidden-content-addressed-chunked-resumable-p2p-transport-semantics-fabric-core-consumer-integration-readiness-boundary-update-input-rejected":
    "hidden_content_addressed_chunked_resumable_p2p_transport_semantics_fabric_core_consumer_integration_readiness_boundary_update_input_rejected",
  "hidden-large-payload-movement-semantics-fabric-core-consumer-integration-readiness-boundary-update-input-rejected":
    "hidden_large_payload_movement_semantics_fabric_core_consumer_integration_readiness_boundary_update_input_rejected",
  "hidden-filesystem-scanning-file-selection-semantics-fabric-core-consumer-integration-readiness-boundary-update-input-rejected":
    "hidden_filesystem_scanning_file_selection_semantics_fabric_core_consumer_integration_readiness_boundary_update_input_rejected",
  "hidden-backend-api-server-semantics-fabric-core-consumer-integration-readiness-boundary-update-input-rejected":
    "hidden_backend_api_server_semantics_fabric_core_consumer_integration_readiness_boundary_update_input_rejected",
  "hidden-database-storage-cache-write-semantics-fabric-core-consumer-integration-readiness-boundary-update-input-rejected":
    "hidden_database_storage_cache_write_semantics_fabric_core_consumer_integration_readiness_boundary_update_input_rejected",
  "hidden-auth-session-token-api-key-semantics-fabric-core-consumer-integration-readiness-boundary-update-input-rejected":
    "hidden_auth_session_token_api_key_semantics_fabric_core_consumer_integration_readiness_boundary_update_input_rejected",
  "hidden-connector-grant-semantics-fabric-core-consumer-integration-readiness-boundary-update-input-rejected":
    "hidden_connector_grant_semantics_fabric_core_consumer_integration_readiness_boundary_update_input_rejected",
  "hidden-matrix-gateway-runtime-semantics-fabric-core-consumer-integration-readiness-boundary-update-input-rejected":
    "hidden_matrix_gateway_runtime_semantics_fabric_core_consumer_integration_readiness_boundary_update_input_rejected",
  "hidden-shell-command-runtime-semantics-fabric-core-consumer-integration-readiness-boundary-update-input-rejected":
    "hidden_shell_command_runtime_semantics_fabric_core_consumer_integration_readiness_boundary_update_input_rejected",
  "hidden-sqlite-embedded-db-query-runtime-semantics-fabric-core-consumer-integration-readiness-boundary-update-input-rejected":
    "hidden_sqlite_embedded_db_query_runtime_semantics_fabric_core_consumer_integration_readiness_boundary_update_input_rejected",
  "hidden-encoded-handoff-runtime-codec-translator-semantics-fabric-core-consumer-integration-readiness-boundary-update-input-rejected":
    "hidden_encoded_handoff_runtime_codec_translator_semantics_fabric_core_consumer_integration_readiness_boundary_update_input_rejected",
  "unsafe-fabric-core-consumer-readiness-runtime-flags-fabric-core-consumer-integration-readiness-boundary-update-input-rejected":
    "unsafe_fabric_core_consumer_readiness_runtime_flags_fabric_core_consumer_integration_readiness_boundary_update_input_rejected",
  "nested-unsafe-flags-fabric-core-consumer-integration-readiness-boundary-update-input-rejected":
    "nested_unsafe_flags_fabric_core_consumer_integration_readiness_boundary_update_input_rejected",
  "noncanonical-fabric-core-consumer-integration-readiness-boundary-update-input-rejected":
    "noncanonical_fabric_core_consumer_integration_readiness_boundary_update_input_rejected"
});

const expectedBoundaryFamilies = Object.freeze([
  "fabric_core_consumer_readiness_contract",
  "fabric_core_js_ts_consumer_contract",
  "fabric_transport_sidecar_consumer_contract",
  "fabric_content_id_reverification_contract",
  "fabric_large_payload_todo_contract",
  "fabric_existing_point_to_point_hold_contract",
  "fabric_dedicated_consumer_prompt_required_contract",
  "fabric_no_reimplementation_contract",
  "fabric_no_p2p_dependency_contract",
  "fabric_sidecar_bearer_token_boundary",
  "fabric_loopback_http_boundary",
  "fabric_security_review_dependency_contract"
]);

const expectedRelatedSystems = Object.freeze([
  "ardyn",
  "multiverse",
  "locus",
  "content-fabric",
  "repo-family",
  "fabric-core-reference",
  "fabric-transport-d-reference"
]);

const expectedStatusValues = Object.freeze([
  "metadata_only",
  "producer_ready_consumer_pending",
  "blocked",
  "future_contract_required"
]);

const commandProbes = Object.freeze([
  "fabric-core-consumer-integration-readiness-boundary-update",
  "multiverse-fabric-core-import",
  "fabric-core-npm-consumer",
  "fabric-transport-d-sidecar",
  "loopback-http-client",
  "bearer-token-loader",
  "content-id-verifier",
  "content-id-hashing-runtime",
  "content-addressed-transfer-runtime",
  "chunked-transfer-runtime",
  "resumable-transfer-runtime",
  "multi-source-transfer-runtime",
  "p2p-transfer-runtime",
  "large-payload-transfer-runtime",
  "fabric-core-producer-runtime",
  "package-json-dependency-runtime",
  "rust-sidecar-client",
  "shell-runtime",
  "sqlite-runtime"
]);

const unsafeFlagCases = Object.freeze([
  "runtimeExecutionEnabled",
  "connectorGrantProduced",
  "fabricRuntimeImplementedByArdyn",
  "websocketHttpTransportImplementedByArdyn",
  "httpTransportImplementedByArdyn",
  "mcpRuntimeEnabled",
  "mcpToolExposureEnabled",
  "taskExecutionEnabled",
  "secureDropImplemented",
  "serviceDiscoveryEnabled",
  "schedulePollingEnabled",
  "filesystemWriteEnabled",
  "filesystemScanningEnabled",
  "fileSelectionRuntimeEnabled",
  "processControlEnabled",
  "multiverseFabricCoreImportEnabled",
  "fabricCoreNpmDependencyEnabled",
  "fabricTransportDSidecarClientEnabled",
  "loopbackHttpClientEnabled",
  "bearerTokenLoaderEnabled",
  "contentIdVerificationRuntimeEnabled",
  "contentIdHashingRuntimeEnabled",
  "contentAddressedTransportEnabled",
  "chunkedTransferEnabled",
  "resumableTransferEnabled",
  "multiSourceTransferEnabled",
  "bittorrentDhtSwarmP2pEnabled",
  "largePayloadTransferRuntimeEnabled",
  "packageJsonDependencyChanged",
  "rustSidecarClientEnabled",
  "fabricCoreProducerBehaviorEnabled",
  "matrixClientRuntimeEnabled",
  "externalGatewayRuntimeEnabled",
  "shellRuntimeEnabled",
  "commandRuntimeEnabled",
  "sqliteRuntimeEnabled",
  "embeddedDbRuntimeEnabled",
  "queryEngineRuntimeEnabled",
  "backendRuntimeImplementedByArdyn",
  "databaseStorageRuntimeWritesEnabled",
  "loggerRuntimeImplemented",
  "auditWriterRuntimeImplemented",
  "telemetryClientImplemented",
  "healthCheckRuntimeImplemented",
  "encodedHandoffRuntimeImplementedByArdyn",
  "codecRuntimeEnabled",
  "translatorRuntimeEnabled"
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
    createFabricCoreConsumerIntegrationReadinessBoundaryUpdateForReview({
      reviewedAt
    });
  const runtimeFlagNames = Object.keys(
    valid.boundaryEntries[0].unsafeFabricCoreConsumerReadinessRuntimeFlags
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
    createFabricCoreConsumerIntegrationReadinessBoundaryUpdateForReview({
      reviewedAt
    }).boundaryEntries;

  return [{ ...structuredClone(entry), ...patch }];
}

test("Phase 5.75 fabric-core consumer readiness fixture is deterministic", async () => {
  const fixture = await readFixture();
  const generated =
    createFabricCoreConsumerIntegrationReadinessBoundaryUpdateForReview({
      reviewedAt
    });

  assert.deepEqual(fixture, generated);
  assert.equal(
    fixture.schema,
    FABRIC_CORE_CONSUMER_INTEGRATION_READINESS_BOUNDARY_UPDATE_SCHEMA
  );
  assert.equal(fixture.reviewedAt, reviewedAt);
  assert.equal(
    fixture.classification,
    expectedCaseClassifications[
      "valid-fabric-core-consumer-integration-readiness-boundary-update"
    ]
  );
  assert.equal(
    fixture.fabricCoreConsumerIntegrationReadinessBoundaryUpdateProduced,
    true
  );
  assert.equal(
    fixture.fabricCoreConsumerIntegrationReadinessBoundaryUpdateMode,
    "review-only"
  );
});

test("Phase 5.75 covers requested fabric-core consumer boundaries", async () => {
  const fixture = await readFixture();
  const state =
    fixture.fabricCoreConsumerIntegrationReadinessBoundaryUpdate;
  const entries = state.boundaryEntries;
  const families = new Set(entries.map((entry) => entry.boundaryFamily));
  const systems = new Set(entries.map((entry) => entry.relatedSystem));
  const statuses = new Set(entries.map((entry) => entry.currentStatus));

  assert.equal(fixture.boundaryEntries.length, 13);
  assert.deepEqual([...families].sort(), [...expectedBoundaryFamilies].sort());
  assert.deepEqual([...systems].sort(), [...expectedRelatedSystems].sort());
  assert.deepEqual([...statuses].sort(), [...expectedStatusValues].sort());
  assert.equal(state.sourcePhaseContext.fabricCoreProducerRepository, "Ardynai/multiverse");
  assert.equal(state.sourcePhaseContext.fabricCoreProducerPackage, "packages/fabric-core");
  assert.equal(state.sourcePhaseContext.fabricCoreProducerSecurityReviewed, true);
  assert.equal(state.sourcePhaseContext.fabricTransportDSidecar, "fabric-transport-d");
  assert.equal(state.sourcePhaseContext.jsTsFuturePackage, "@multiverse/fabric-core");
  assert.equal(
    state.sourcePhaseContext.ardynConsumerIntegrationPendingDedicatedPrompt,
    true
  );
  assert.equal(state.sourcePhaseContext.existingPointToPointTransportHeld, true);
  assert.equal(state.sourcePhaseContext.noRuntimeWiring, true);
  assert.equal(state.sourcePhaseContext.noPackageDependencyAdded, true);

  for (const entry of entries) {
    assert.match(entry.boundaryId, /^phase5-75\./);
    assert.equal(entry.fabricCoreConsumerReadinessBoundaryMetadataOnly, true);
    assert.equal(
      entry.noLiveFabricCoreConsumerIntegrationRuntimePerformed,
      true
    );
    assert.equal(entry.fabricCoreProducerReference.producerRepository, "Ardynai/multiverse");
    assert.equal(entry.fabricCoreProducerReference.producerPackage, "packages/fabric-core");
    assert.equal(entry.fabricCoreProducerReference.sidecarName, "fabric-transport-d");
    assert.equal(entry.fabricCoreProducerReference.producerSecurityReviewed, true);
    assert.equal(entry.fabricCoreProducerReference.producerImplementedByArdyn, false);
    assert.equal(
      entry.fabricCoreProducerReference
        .ardynConsumerIntegrationPendingDedicatedPrompt,
      true
    );
    assert.equal(entry.explicitBlockedAuthorizationFlagsAllFalse, undefined);
    assertAllFalse(entry.explicitBlockedAuthorizationFlags);
    assertAllFalse(entry.unsafeFabricCoreConsumerReadinessRuntimeFlags);
    assertAllFalse(entry.runtimeEffect);
    assert.equal(entry.nonAuthorizingProof, true);
  }

  const summary = state.boundaryMapSummary;
  for (const family of expectedBoundaryFamilies) {
    assert.ok(summary.countByFamily[family] >= 1, family);
  }
  for (const system of expectedRelatedSystems) {
    assert.ok(summary.countByRelatedSystem[system] >= 1, system);
  }

  for (const field of [
    "fabricCoreConsumerReadinessBoundaryMetadataOnly",
    "noLiveFabricCoreConsumerIntegrationRuntimePerformed",
    "producerReadyConsumerPendingRecorded",
    "fabricCoreJsTsNpmConsumerBoundaryRecorded",
    "fabricTransportDSidecarConsumerBoundaryRecorded",
    "sidecarBearerTokenBoundaryRecorded",
    "loopbackHttpBoundaryRecorded",
    "contentIdReverificationBoundaryRecorded",
    "largePayloadTodoBoundaryRecorded",
    "existingPointToPointTransportHoldRecorded",
    "dedicatedConsumerPromptRequiredRecorded",
    "noReimplementationBoundaryRecorded",
    "noP2pDependencyBoundaryRecorded",
    "locusByteInteropBoundaryRecorded",
    "securityReviewedProducerDependencyRecorded",
    "secureDropRelationBoundaryRecorded",
    "noFabricCoreImport",
    "noFabricTransportDSidecarClient",
    "noLoopbackHttpClient",
    "noBearerTokenLoader",
    "noContentIdHashingVerificationRuntime",
    "noContentAddressedChunkedResumableMultiSourceTransfer",
    "noBitTorrentDhtSwarmP2pBehavior",
    "noLargePayloadTransferRuntime",
    "noPackageJsonDependencyChange",
    "noRustSidecarClient",
    "noFabricCoreProducerBehavior",
    "noSecureDropImplementation",
    "noMatrixGatewayRuntime",
    "noShellCommandRuntime",
    "noSqliteRuntime",
    "noBackendApiServerDatabaseStorageCacheRlsMigration",
    "noEncodedHandoffRuntimeCodecTranslator",
    "noLoggerAuditTelemetryHealthRuntime",
    "noInfrastructureDeploymentComplianceAutomation",
    "noTestingCiReleaseAutomation",
    "noFilesystemProcessUiRuntime",
    "noCommandExposure",
    "noBlockedCliBypass",
    "allBlockedAuthorizationFlagsFalse",
    "allUnsafeFabricCoreConsumerReadinessRuntimeFlagsFalse",
    "allRuntimeEffectsFalse",
    "allEntriesNonAuthorizing"
  ]) {
    assert.equal(summary[field], true, `${field} should be true`);
  }

  const jsTs = entries.find(
    (entry) => entry.boundaryFamily === "fabric_core_js_ts_consumer_contract"
  );
  assert.match(jsTs.jsTsConsumerExpectation, /@multiverse\/fabric-core/);
  assert.match(jsTs.jsTsConsumerExpectation, /adds no package\.json/);

  const sidecar = entries.find(
    (entry) =>
      entry.boundaryFamily === "fabric_transport_sidecar_consumer_contract"
  );
  assert.match(sidecar.nonJsSidecarConsumerExpectation, /fabric-transport-d/);
  assert.match(sidecar.nonJsSidecarConsumerExpectation, /loopback HTTP/);

  const prompt = entries.find(
    (entry) =>
      entry.boundaryFamily ===
      "fabric_dedicated_consumer_prompt_required_contract"
  );
  assert.equal(prompt.currentStatus, "future_contract_required");
  assert.match(prompt.requiredFutureContractBeforeImplementation, /dedicated/);

  const secureDrop = entries.find(
    (entry) => entry.relatedSystem === "content-fabric"
  );
  assert.match(secureDrop.secureDropRelationExpectation, /content-fabric/);
  assert.match(secureDrop.secureDropRelationExpectation, /adds no Secure Drop/);

  assertNonAuthorizing(fixture);
  assert.equal(
    fixture.recommendedNextPhase,
    "phase-5.76-review-only-embedded-db-query-engine-primitive-contract-boundary-map"
  );
});

test("Phase 5.75 invalid fabric-core consumer cases fail closed", () => {
  const valid =
    createFabricCoreConsumerIntegrationReadinessBoundaryUpdateForReview({
      reviewedAt
    });
  const [firstEntry] = valid.boundaryEntries;
  const invalidCases = [
    {
      name: "malformed-fabric-core-consumer-integration-readiness-boundary-update-input-rejected",
      input: null
    },
    {
      name: "malformed-fabric-core-consumer-integration-readiness-boundary-update-input-rejected",
      input: { reviewedAt: "not-a-date" }
    },
    {
      name: "malformed-fabric-core-consumer-integration-readiness-boundary-update-input-rejected",
      input: { reviewedAt, boundaryEntries: "not-array" }
    },
    {
      name: "missing-required-fabric-core-consumer-readiness-boundary-entry-rejected",
      input: { reviewedAt, boundaryEntries: [{}] }
    },
    {
      name: "unknown-boundary-family-fabric-core-consumer-integration-readiness-boundary-update-input-rejected",
      input: {
        reviewedAt,
        boundaryEntries: boundaryEntryPatch({ boundaryFamily: "unknown" })
      }
    },
    {
      name: "unknown-related-system-fabric-core-consumer-integration-readiness-boundary-update-input-rejected",
      input: {
        reviewedAt,
        boundaryEntries: boundaryEntryPatch({ relatedSystem: "unknown" })
      }
    },
    {
      name: "unknown-current-status-fabric-core-consumer-integration-readiness-boundary-update-input-rejected",
      input: {
        reviewedAt,
        boundaryEntries: boundaryEntryPatch({ currentStatus: "enabled" })
      }
    },
    {
      name: "authorization-flags-enabled-fabric-core-consumer-integration-readiness-boundary-update-input-rejected",
      input: {
        reviewedAt,
        boundaryEntries: [
          {
            ...structuredClone(firstEntry),
            explicitBlockedAuthorizationFlags: {
              ...firstEntry.explicitBlockedAuthorizationFlags,
              fabricCoreConsumerAuthorizationGranted: true
            }
          }
        ]
      }
    },
    {
      name: "report-runs-checks-true-fabric-core-consumer-integration-readiness-boundary-update-input-rejected",
      input: { reviewedAt, reportRunsChecks: true }
    },
    {
      name: "runtime-authorization-attempt-fabric-core-consumer-integration-readiness-boundary-update-input-rejected",
      input: { reviewedAt, authorizesRuntime: true }
    },
    {
      name: "command-exposure-attempt-fabric-core-consumer-integration-readiness-boundary-update-input-rejected",
      input: { reviewedAt, commandExposureEnabled: true }
    },
    {
      name: "blocked-cli-bypass-attempt-fabric-core-consumer-integration-readiness-boundary-update-input-rejected",
      input: { reviewedAt, blockedCliBypassEnabled: true }
    },
    {
      name: "hidden-fabric-core-import-semantics-fabric-core-consumer-integration-readiness-boundary-update-input-rejected",
      input: { reviewedAt, fabricCoreImport: {} }
    },
    {
      name: "hidden-sidecar-http-bearer-token-semantics-fabric-core-consumer-integration-readiness-boundary-update-input-rejected",
      input: { reviewedAt, fabricTransportDSidecar: {} }
    },
    {
      name: "hidden-sidecar-http-bearer-token-semantics-fabric-core-consumer-integration-readiness-boundary-update-input-rejected",
      input: { reviewedAt, bearerTokenLoader: {} }
    },
    {
      name: "hidden-hashing-content-id-verification-semantics-fabric-core-consumer-integration-readiness-boundary-update-input-rejected",
      input: { reviewedAt, contentIdVerifier: {} }
    },
    {
      name: "hidden-content-addressed-chunked-resumable-p2p-transport-semantics-fabric-core-consumer-integration-readiness-boundary-update-input-rejected",
      input: { reviewedAt, contentAddressedTransport: {} }
    },
    {
      name: "hidden-large-payload-movement-semantics-fabric-core-consumer-integration-readiness-boundary-update-input-rejected",
      input: { reviewedAt, largePayloadTransfer: {} }
    },
    {
      name: "hidden-filesystem-scanning-file-selection-semantics-fabric-core-consumer-integration-readiness-boundary-update-input-rejected",
      input: { reviewedAt, filesystemScanner: {} }
    },
    {
      name: "hidden-backend-api-server-semantics-fabric-core-consumer-integration-readiness-boundary-update-input-rejected",
      input: { reviewedAt, apiServer: {} }
    },
    {
      name: "hidden-database-storage-cache-write-semantics-fabric-core-consumer-integration-readiness-boundary-update-input-rejected",
      input: { reviewedAt, databaseClient: {} }
    },
    {
      name: "hidden-auth-session-token-api-key-semantics-fabric-core-consumer-integration-readiness-boundary-update-input-rejected",
      input: { reviewedAt, apiKey: {} }
    },
    {
      name: "hidden-connector-grant-semantics-fabric-core-consumer-integration-readiness-boundary-update-input-rejected",
      input: { reviewedAt, connectorGrant: {} }
    },
    {
      name: "hidden-matrix-gateway-runtime-semantics-fabric-core-consumer-integration-readiness-boundary-update-input-rejected",
      input: { reviewedAt, matrixClient: {} }
    },
    {
      name: "hidden-shell-command-runtime-semantics-fabric-core-consumer-integration-readiness-boundary-update-input-rejected",
      input: { reviewedAt, shellRuntime: {} }
    },
    {
      name: "hidden-sqlite-embedded-db-query-runtime-semantics-fabric-core-consumer-integration-readiness-boundary-update-input-rejected",
      input: { reviewedAt, sqliteRuntime: {} }
    },
    {
      name: "hidden-encoded-handoff-runtime-codec-translator-semantics-fabric-core-consumer-integration-readiness-boundary-update-input-rejected",
      input: { reviewedAt, encodedHandoffRuntime: {} }
    },
    {
      name: "unsafe-fabric-core-consumer-readiness-runtime-flags-fabric-core-consumer-integration-readiness-boundary-update-input-rejected",
      input: { reviewedAt, fabricCoreNpmDependencyEnabled: true }
    },
    {
      name: "unsafe-fabric-core-consumer-readiness-runtime-flags-fabric-core-consumer-integration-readiness-boundary-update-input-rejected",
      input: {
        reviewedAt,
        boundaryEntries: [
          {
            ...structuredClone(firstEntry),
            unsafeFabricCoreConsumerReadinessRuntimeFlags: {
              ...firstEntry.unsafeFabricCoreConsumerReadinessRuntimeFlags,
              fabricTransportDSidecarClientEnabled: true
            }
          }
        ]
      }
    },
    {
      name: "nested-unsafe-flags-fabric-core-consumer-integration-readiness-boundary-update-input-rejected",
      input: { reviewedAt, runtimeEffect: { sideEffect: true } }
    },
    {
      name: "unknown-top-level-field-fabric-core-consumer-integration-readiness-boundary-update-input-rejected",
      input: { reviewedAt, unknownField: "not allowed" }
    },
    {
      name: "noncanonical-fabric-core-consumer-integration-readiness-boundary-update-input-rejected",
      input: {
        reviewedAt,
        boundaryEntries: boundaryEntryPatch({
          boundaryId: "phase5-75.modified.noncanonical"
        })
      }
    }
  ];

  for (const { name, input } of invalidCases) {
    const result =
      createFabricCoreConsumerIntegrationReadinessBoundaryUpdateForReview(input);
    assert.equal(result.classification, expectedCaseClassifications[name], name);
    assert.equal(
      result.fabricCoreConsumerIntegrationReadinessBoundaryUpdateProduced,
      false
    );
    assert.equal(
      result.fabricCoreConsumerIntegrationReadinessBoundaryUpdate,
      null
    );
    assert.deepEqual(result.boundaryEntries, []);
    assert.equal(result.reportRunsChecks, false);
    assert.equal(result.nonAuthorizingProof, true);
    assertAllFalse(result.runtimeEffect);
  }
});

test("Phase 5.75 enabled runtime flags cannot authorize fabric-core consumer behavior", () => {
  for (const field of unsafeFlagCases) {
    const result =
      createFabricCoreConsumerIntegrationReadinessBoundaryUpdateForReview({
        reviewedAt,
        [field]: true
      });

    assert.equal(
      result.classification,
      "unsafe_fabric_core_consumer_readiness_runtime_flags_fabric_core_consumer_integration_readiness_boundary_update_input_rejected",
      field
    );
    assert.equal(
      result.fabricCoreConsumerIntegrationReadinessBoundaryUpdateProduced,
      false
    );
    assert.equal(result[field], false, field);
    assert.equal(result.reportRunsChecks, false);
  }
});

test("Phase 5.75 boundary update stays non-authorizing and runtime-blocked", async () => {
  const fixture = await readFixture();
  const summary = fixture.boundaryMapSummary;

  for (const field of [
    "fabricCoreConsumerReadinessBoundaryMetadataOnly",
    "noLiveFabricCoreConsumerIntegrationRuntimePerformed",
    "allBlockedAuthorizationFlagsFalse",
    "allUnsafeFabricCoreConsumerReadinessRuntimeFlagsFalse",
    "allRuntimeEffectsFalse",
    "allEntriesNonAuthorizing"
  ]) {
    assert.equal(summary[field], true, `${field} should be true`);
  }

  assert.equal(fixture.reviewOnly, true);
  assert.equal(fixture.metadataOnly, true);
  assert.equal(fixture.authoritative, false);
  assert.equal(
    fixture.fabricCoreConsumerIntegrationReadinessBoundaryUpdateOnly,
    true
  );
  assert.equal(
    fixture.fabricCoreConsumerIntegrationReadinessBoundaryUpdateProduced,
    true
  );
  assert.equal(fixture.reportRunsChecks, false);
  assertNonAuthorizing(fixture);
});

test("serve-runtime remains default-blocked and dry-run cannot bypass Phase 5.75", async () => {
  const direct = await expectCliFailure(["serve-runtime"]);
  assert.notEqual(direct.code, 0);
  assert.equal(direct.stdout, "");

  const dryRun = await expectCliFailure(["serve-runtime", "--dry-run"]);
  assert.notEqual(dryRun.code, 0);
  assert.equal(dryRun.stdout, "");
});

test("Phase 5.75 fabric-core consumer command names remain rejected", async () => {
  for (const command of commandProbes) {
    const error = await expectCliFailure([command]);
    assert.notEqual(error.code, 0, command);
    assert.equal(error.stdout, "", command);
  }
});

test("Phase 5.75 does not change CLI, Rust, Fabric, package, or consumer source", async () => {
  const files = [
    "apps/cli/src/index.mjs",
    "crates/ardyn-host/src/lib.rs",
    "crates/ardyn-host/src/stdio_runtime/mod.rs",
    "packages/fabric/src/index.mjs",
    "package.json"
  ];

  for (const file of files) {
    const [baseline, current] = await Promise.all([
      execFileAsync("git", ["show", `${phase575BaselineCommit}:${file}`], {
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

  const packageJson = JSON.parse(await readFile(packageJsonUrl, "utf8"));
  const dependencies = {
    ...(packageJson.dependencies ?? {}),
    ...(packageJson.devDependencies ?? {}),
    ...(packageJson.optionalDependencies ?? {})
  };

  assert.equal(Object.hasOwn(dependencies, "@multiverse/fabric-core"), false);

  const currentCliSource = await readFile(cliPath, "utf8");
  for (const command of commandProbes) {
    assert.doesNotMatch(currentCliSource, new RegExp(command));
  }
});
