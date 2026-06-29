import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";
import {
  SECRETS_MANAGEMENT_KEY_ROTATION_EXTERNAL_GATEWAY_CREDENTIAL_BOUNDARY_MAP_SCHEMA,
  createSecretsManagementKeyRotationExternalGatewayCredentialBoundaryMapForReview
} from "../packages/core/src/index.mjs";

const execFileAsync = promisify(execFile);
const phase572BaselineCommit = "6688f3a0c867b577fc316f95752cc43b6011e66f";
const reviewedAt = "2026-06-29T00:00:00.000Z";
const repoRootUrl = new URL("../", import.meta.url);
const repoRoot = fileURLToPath(repoRootUrl);
const cliPath = fileURLToPath(
  new URL("../apps/cli/src/index.mjs", import.meta.url)
);
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-72/secrets-management-key-rotation-external-gateway-credential-boundary-map.json",
  import.meta.url
);

const expectedCaseClassifications = Object.freeze({
  "valid-secrets-management-key-rotation-external-gateway-credential-boundary-map":
    "valid_secrets_management_key_rotation_external_gateway_credential_boundary_map_runtime_still_blocked",
  "malformed-secrets-management-key-rotation-external-gateway-credential-boundary-map-input-rejected":
    "malformed_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected",
  "missing-required-secrets-management-key-rotation-external-gateway-credential-boundary-entry-rejected":
    "missing_required_secrets_management_key_rotation_external_gateway_credential_boundary_entry_rejected",
  "unknown-top-level-field-secrets-management-key-rotation-external-gateway-credential-boundary-map-input-rejected":
    "unknown_top_level_field_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected",
  "unknown-boundary-family-secrets-management-key-rotation-external-gateway-credential-boundary-map-input-rejected":
    "unknown_boundary_family_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected",
  "unknown-related-system-secrets-management-key-rotation-external-gateway-credential-boundary-map-input-rejected":
    "unknown_related_system_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected",
  "unknown-current-status-secrets-management-key-rotation-external-gateway-credential-boundary-map-input-rejected":
    "unknown_current_status_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected",
  "authorization-flags-enabled-secrets-management-key-rotation-external-gateway-credential-boundary-map-input-rejected":
    "authorization_flags_enabled_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected",
  "report-runs-checks-true-secrets-management-key-rotation-external-gateway-credential-boundary-map-input-rejected":
    "report_runs_checks_true_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected",
  "runtime-authorization-attempt-secrets-management-key-rotation-external-gateway-credential-boundary-map-input-rejected":
    "runtime_authorization_attempt_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected",
  "command-exposure-attempt-secrets-management-key-rotation-external-gateway-credential-boundary-map-input-rejected":
    "command_exposure_attempt_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected",
  "blocked-cli-bypass-attempt-secrets-management-key-rotation-external-gateway-credential-boundary-map-input-rejected":
    "blocked_cli_bypass_attempt_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected",
  "hidden-secret-env-vault-access-semantics-secrets-management-key-rotation-external-gateway-credential-boundary-map-input-rejected":
    "hidden_secret_env_vault_access_semantics_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected",
  "hidden-api-key-token-oauth-session-semantics-secrets-management-key-rotation-external-gateway-credential-boundary-map-input-rejected":
    "hidden_api_key_token_oauth_session_semantics_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected",
  "hidden-matrix-gateway-credential-runtime-semantics-secrets-management-key-rotation-external-gateway-credential-boundary-map-input-rejected":
    "hidden_matrix_gateway_credential_runtime_semantics_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected",
  "hidden-e2ee-key-session-handling-semantics-secrets-management-key-rotation-external-gateway-credential-boundary-map-input-rejected":
    "hidden_e2ee_key_session_handling_semantics_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected",
  "hidden-mcp-plugin-provider-credential-runtime-semantics-secrets-management-key-rotation-external-gateway-credential-boundary-map-input-rejected":
    "hidden_mcp_plugin_provider_credential_runtime_semantics_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected",
  "hidden-skillhub-install-trust-scanner-runtime-semantics-secrets-management-key-rotation-external-gateway-credential-boundary-map-input-rejected":
    "hidden_skillhub_install_trust_scanner_runtime_semantics_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected",
  "hidden-secret-scanner-rotation-redaction-runtime-semantics-secrets-management-key-rotation-external-gateway-credential-boundary-map-input-rejected":
    "hidden_secret_scanner_rotation_redaction_runtime_semantics_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected",
  "hidden-fabric-websocket-http-mcp-task-runtime-semantics-secrets-management-key-rotation-external-gateway-credential-boundary-map-input-rejected":
    "hidden_fabric_websocket_http_mcp_task_runtime_semantics_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected",
  "hidden-secure-drop-implementation-keyring-did-semantics-secrets-management-key-rotation-external-gateway-credential-boundary-map-input-rejected":
    "hidden_secure_drop_implementation_keyring_did_semantics_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected",
  "hidden-encoded-handoff-runtime-codec-translator-stego-covert-channel-tokenizer-exploit-bypass-semantics-secrets-management-key-rotation-external-gateway-credential-boundary-map-input-rejected":
    "hidden_encoded_handoff_runtime_codec_translator_stego_covert_channel_tokenizer_exploit_bypass_semantics_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected",
  "hidden-hermes-cua-computer-use-runtime-semantics-secrets-management-key-rotation-external-gateway-credential-boundary-map-input-rejected":
    "hidden_hermes_cua_computer_use_runtime_semantics_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected",
  "hidden-shell-path-executable-env-history-runtime-semantics-secrets-management-key-rotation-external-gateway-credential-boundary-map-input-rejected":
    "hidden_shell_path_executable_env_history_runtime_semantics_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected",
  "hidden-sqlite-embedded-db-query-key-runtime-semantics-secrets-management-key-rotation-external-gateway-credential-boundary-map-input-rejected":
    "hidden_sqlite_embedded_db_query_key_runtime_semantics_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected",
  "hidden-logger-audit-transcript-telemetry-external-sink-semantics-secrets-management-key-rotation-external-gateway-credential-boundary-map-input-rejected":
    "hidden_logger_audit_transcript_telemetry_external_sink_semantics_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected",
  "hidden-backend-api-server-semantics-secrets-management-key-rotation-external-gateway-credential-boundary-map-input-rejected":
    "hidden_backend_api_server_semantics_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected",
  "hidden-database-storage-cache-write-semantics-secrets-management-key-rotation-external-gateway-credential-boundary-map-input-rejected":
    "hidden_database_storage_cache_write_semantics_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected",
  "hidden-connector-grant-semantics-secrets-management-key-rotation-external-gateway-credential-boundary-map-input-rejected":
    "hidden_connector_grant_semantics_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected",
  "hidden-infrastructure-deployment-compliance-pii-retention-export-semantics-secrets-management-key-rotation-external-gateway-credential-boundary-map-input-rejected":
    "hidden_infrastructure_deployment_compliance_pii_retention_export_semantics_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected",
  "hidden-testing-ci-release-automation-semantics-secrets-management-key-rotation-external-gateway-credential-boundary-map-input-rejected":
    "hidden_testing_ci_release_automation_semantics_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected",
  "unsafe-secrets-management-key-rotation-external-gateway-credential-runtime-flags-secrets-management-key-rotation-external-gateway-credential-boundary-map-input-rejected":
    "unsafe_secrets_management_key_rotation_external_gateway_credential_runtime_flags_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected",
  "nested-unsafe-flags-secrets-management-key-rotation-external-gateway-credential-boundary-map-input-rejected":
    "nested_unsafe_flags_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected",
  "noncanonical-secrets-management-key-rotation-external-gateway-credential-boundary-map-input-rejected":
    "noncanonical_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected"
});

const expectedBoundaryFamilies = Object.freeze([
  "secret_management_contract",
  "key_rotation_contract",
  "credential_provenance_contract",
  "env_secret_boundary",
  "vault_access_boundary",
  "api_key_boundary",
  "oauth_token_boundary",
  "session_token_boundary",
  "provider_credential_boundary",
  "mcp_credential_boundary",
  "plugin_credential_boundary",
  "skillhub_trust_boundary",
  "matrix_gateway_credential_boundary",
  "external_gateway_credential_boundary",
  "fabric_secret_boundary",
  "secure_drop_key_boundary",
  "did_keyring_boundary",
  "cua_driver_trust_boundary",
  "computer_use_permission_secret_boundary",
  "encoded_handoff_secret_boundary",
  "secret_scanning_contract",
  "secret_redaction_contract",
  "secret_audit_contract"
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
  "hermes-reference",
  "cua-driver-reference",
  "codecrafters-shell-reference",
  "codecrafters-sqlite-reference"
]);

const expectedStatusValues = Object.freeze([
  "metadata_only",
  "blocked",
  "future_contract_required"
]);

const commandProbes = Object.freeze([
  "secrets-management-key-rotation-external-gateway-credential-boundary-map",
  "secret-store-runtime",
  "env-ingestion-runtime",
  "vault-access-runtime",
  "keyring-did-runtime",
  "token-loader-runtime",
  "oauth-flow-runtime",
  "credential-scanner-runtime",
  "secret-scanner-runtime",
  "rotation-job-runtime",
  "revocation-job-runtime",
  "matrix-gateway-runtime",
  "external-gateway-runtime",
  "mcp-credential-runtime",
  "provider-credential-runtime",
  "secure-drop-keyring-runtime",
  "fabric-secret-runtime",
  "cua-driver-runtime",
  "computer-use-permission-runtime",
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
  "scheduleEnforcementEnabled",
  "filesystemWriteEnabled",
  "processControlEnabled",
  "envIngestionEnabled",
  "secretLoadingEnabled",
  "vaultAccessEnabled",
  "keyringRuntimeEnabled",
  "didRuntimeEnabled",
  "tokenLoaderEnabled",
  "oauthFlowEnabled",
  "sessionHandlingEnabled",
  "credentialScannerRuntimeEnabled",
  "secretScannerRuntimeEnabled",
  "rotationJobEnabled",
  "revocationJobEnabled",
  "credentialExportEnabled",
  "secretPersistenceEnabled",
  "redactionRuntimeEnabled",
  "matrixGatewayRuntimeEnabled",
  "e2eeKeyHandlingEnabled",
  "externalGatewayRuntimeEnabled",
  "mcpCredentialRuntimeEnabled",
  "pluginCredentialRuntimeEnabled",
  "providerCredentialRuntimeEnabled",
  "skillhubInstallTrustScannerRuntimeEnabled",
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
  const valid =
    createSecretsManagementKeyRotationExternalGatewayCredentialBoundaryMapForReview({
      reviewedAt
    });
  const runtimeFlagNames = Object.keys(
    valid.boundaryEntries[0].unsafeSecretsCredentialRuntimeFlags
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
    createSecretsManagementKeyRotationExternalGatewayCredentialBoundaryMapForReview({
      reviewedAt
    }).boundaryEntries;

  return [{ ...structuredClone(entry), ...patch }];
}

test("Phase 5.72 secrets boundary map fixture is deterministic", async () => {
  const fixture = await readFixture();
  const generated =
    createSecretsManagementKeyRotationExternalGatewayCredentialBoundaryMapForReview({
      reviewedAt
    });

  assert.deepEqual(fixture, generated);
  assert.equal(
    fixture.schema,
    SECRETS_MANAGEMENT_KEY_ROTATION_EXTERNAL_GATEWAY_CREDENTIAL_BOUNDARY_MAP_SCHEMA
  );
  assert.equal(fixture.reviewedAt, reviewedAt);
  assert.equal(
    fixture.classification,
    expectedCaseClassifications[
      "valid-secrets-management-key-rotation-external-gateway-credential-boundary-map"
    ]
  );
  assert.equal(
    fixture
      .secretsManagementKeyRotationExternalGatewayCredentialBoundaryMapProduced,
    true
  );
  assert.equal(
    fixture
      .secretsManagementKeyRotationExternalGatewayCredentialBoundaryMapMode,
    "review-only"
  );
  assert.equal(fixture.boundaryEntries.length, 25);
  assertNonAuthorizing(fixture);
});

test("Phase 5.72 covers requested credential families, systems, statuses, and future references", async () => {
  const fixture = await readFixture();
  const state =
    fixture.secretsManagementKeyRotationExternalGatewayCredentialBoundaryMap;
  const summary = fixture.boundaryMapSummary;

  assert.deepEqual(summary.boundaryFamilies, expectedBoundaryFamilies);
  assert.deepEqual(summary.relatedSystems, expectedRelatedSystems);
  assert.deepEqual(summary.currentStatusValues, expectedStatusValues);
  assert.equal(
    state.sourcePhaseContext.productionReadinessSecretsManagementItemDeferred,
    true
  );
  assert.equal(state.sourcePhaseContext.noSecretStoreImplemented, true);
  assert.equal(
    state.sourcePhaseContext.noEnvIngestionVaultAccessImplemented,
    true
  );
  assert.equal(
    state.sourcePhaseContext.noCredentialScannerSecretScannerRotationRevocationImplemented,
    true
  );
  assert.equal(state.sourcePhaseContext.noMatrixExternalGatewayImplemented, true);
  assert.equal(state.sourcePhaseContext.noShellSqliteRuntimeImplemented, true);
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
    assert.match(entry.boundaryId, /^phase5-72\./);
    assert.ok(expectedBoundaryFamilies.includes(entry.boundaryFamily));
    assert.ok(expectedRelatedSystems.includes(entry.relatedSystem));
    assert.ok(expectedStatusValues.includes(entry.currentStatus));
    assert.equal(entry.secretsCredentialBoundaryMetadataOnly, true);
    assert.equal(entry.noLiveSecretsCredentialRuntimePerformed, true);
    assert.equal(entry.nonAuthorizingProof, true);
    assertAllFalse(entry.explicitBlockedAuthorizationFlags);
    assertAllFalse(entry.unsafeSecretsCredentialRuntimeFlags);
    assertAllFalse(entry.runtimeEffect);
    assert.ok(entry.forbiddenCurrentBehavior.join(" ").includes("secret store"));
    assert.ok(entry.forbiddenCurrentBehavior.join(" ").includes("Matrix client"));
    assert.ok(entry.forbiddenCurrentBehavior.join(" ").includes("shell runtime"));
    assert.ok(entry.forbiddenCurrentBehavior.join(" ").includes("SQLite runtime"));
    assert.ok(entry.forbiddenCurrentBehavior.join(" ").includes("blocked CLI bypass"));
  }

  const matrix = fixture.boundaryEntries.find(
    (entry) => entry.boundaryFamily === "matrix_gateway_credential_boundary"
  );
  assert.equal(matrix.relatedSystem, "matrix-reference");
  assert.match(matrix.matrixGatewayRoleDescription, /homeserver URL/);
  assert.match(matrix.matrixGatewayRoleDescription, /room allowlist/);
  assert.match(matrix.matrixGatewayRoleDescription, /E2EE key\/session/);
  assert.equal(
    matrix.matrixGatewayCredentialExpectation.accessRefreshTokenHandling,
    "future contract required, no token loader"
  );
  assert.equal(
    matrix.matrixGatewayCredentialExpectation.locusVisibleStatusBoundary,
    "future contract required, no Locus bridge"
  );

  const externalGateway = fixture.boundaryEntries.find(
    (entry) => entry.boundaryFamily === "external_gateway_credential_boundary"
  );
  assert.equal(externalGateway.externalGatewayCredentialExpectation.telegram, "future metadata only");
  assert.equal(externalGateway.externalGatewayCredentialExpectation.discord, "future metadata only");
  assert.equal(externalGateway.externalGatewayCredentialExpectation.slack, "future metadata only");
  assert.equal(externalGateway.externalGatewayCredentialExpectation.signal, "future metadata only");
  assert.equal(externalGateway.externalGatewayCredentialExpectation.whatsapp, "future metadata only");
  assert.equal(externalGateway.externalGatewayCredentialExpectation.homeAssistant, "future metadata only");
  assert.equal(externalGateway.externalGatewayCredentialExpectation.runtimeImplemented, false);

  assert.ok(
    fixture.boundaryEntries.some(
      (entry) =>
        entry.relatedSystem === "codecrafters-shell-reference" &&
        /PATH env executable lookup and shell history/.test(entry.subject)
    )
  );
  assert.ok(
    fixture.boundaryEntries.some(
      (entry) =>
        entry.relatedSystem === "codecrafters-sqlite-reference" &&
        /embedded DB file key credential and query-engine/.test(entry.subject)
    )
  );
  assert.ok(
    fixture.boundaryEntries.some(
      (entry) =>
        entry.boundaryFamily === "secure_drop_key_boundary" &&
        entry.secureDropRoleDescription.includes("canonical to content-fabric")
    )
  );
});

test("Phase 5.72 invalid secrets-management cases fail closed", () => {
  const valid =
    createSecretsManagementKeyRotationExternalGatewayCredentialBoundaryMapForReview({
      reviewedAt
    });
  const firstEntry = valid.boundaryEntries[0];
  const missingBoundaryIdEntry = { ...firstEntry };
  delete missingBoundaryIdEntry.boundaryId;

  const cases = [
    [
      null,
      "malformed-secrets-management-key-rotation-external-gateway-credential-boundary-map-input-rejected"
    ],
    [
      { reviewedAt: "not-a-date" },
      "malformed-secrets-management-key-rotation-external-gateway-credential-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, boundaryEntries: [missingBoundaryIdEntry] },
      "missing-required-secrets-management-key-rotation-external-gateway-credential-boundary-entry-rejected"
    ],
    [
      { reviewedAt, unknownField: true },
      "unknown-top-level-field-secrets-management-key-rotation-external-gateway-credential-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, boundaryEntries: boundaryEntryPatch({ boundaryFamily: "secret_runtime" }) },
      "unknown-boundary-family-secrets-management-key-rotation-external-gateway-credential-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, boundaryEntries: boundaryEntryPatch({ relatedSystem: "matrix" }) },
      "unknown-related-system-secrets-management-key-rotation-external-gateway-credential-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, boundaryEntries: boundaryEntryPatch({ currentStatus: "enabled" }) },
      "unknown-current-status-secrets-management-key-rotation-external-gateway-credential-boundary-map-input-rejected"
    ],
    [
      {
        reviewedAt,
        boundaryEntries: boundaryEntryPatch({
          explicitBlockedAuthorizationFlags: {
            ...firstEntry.explicitBlockedAuthorizationFlags,
            vaultAccessAuthorizationGranted: true
          }
        })
      },
      "authorization-flags-enabled-secrets-management-key-rotation-external-gateway-credential-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, reportRunsChecks: true },
      "report-runs-checks-true-secrets-management-key-rotation-external-gateway-credential-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, runtimeAuthorized: true },
      "runtime-authorization-attempt-secrets-management-key-rotation-external-gateway-credential-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, commandExposureEnabled: true },
      "command-exposure-attempt-secrets-management-key-rotation-external-gateway-credential-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, blockedCliBypassEnabled: true },
      "blocked-cli-bypass-attempt-secrets-management-key-rotation-external-gateway-credential-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, secretStore: { enabled: false } },
      "hidden-secret-env-vault-access-semantics-secrets-management-key-rotation-external-gateway-credential-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, apiKey: "not-a-real-key" },
      "hidden-api-key-token-oauth-session-semantics-secrets-management-key-rotation-external-gateway-credential-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, matrixClient: { enabled: false } },
      "hidden-matrix-gateway-credential-runtime-semantics-secrets-management-key-rotation-external-gateway-credential-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, e2eeSession: { enabled: false } },
      "hidden-e2ee-key-session-handling-semantics-secrets-management-key-rotation-external-gateway-credential-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, mcpServerCredential: { enabled: false } },
      "hidden-mcp-plugin-provider-credential-runtime-semantics-secrets-management-key-rotation-external-gateway-credential-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, skillTrustScanner: { enabled: false } },
      "hidden-skillhub-install-trust-scanner-runtime-semantics-secrets-management-key-rotation-external-gateway-credential-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, secretScanner: { enabled: false } },
      "hidden-secret-scanner-rotation-redaction-runtime-semantics-secrets-management-key-rotation-external-gateway-credential-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, fabricBus: { enabled: false } },
      "hidden-fabric-websocket-http-mcp-task-runtime-semantics-secrets-management-key-rotation-external-gateway-credential-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, secureDropKeyring: { enabled: false } },
      "hidden-secure-drop-implementation-keyring-did-semantics-secrets-management-key-rotation-external-gateway-credential-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, encodedHandoffRuntime: { enabled: false } },
      "hidden-encoded-handoff-runtime-codec-translator-stego-covert-channel-tokenizer-exploit-bypass-semantics-secrets-management-key-rotation-external-gateway-credential-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, hermesRuntime: { enabled: false } },
      "hidden-hermes-cua-computer-use-runtime-semantics-secrets-management-key-rotation-external-gateway-credential-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, shellRuntime: { enabled: false } },
      "hidden-shell-path-executable-env-history-runtime-semantics-secrets-management-key-rotation-external-gateway-credential-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, sqliteRuntime: { enabled: false } },
      "hidden-sqlite-embedded-db-query-key-runtime-semantics-secrets-management-key-rotation-external-gateway-credential-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, loggerRuntime: { enabled: false } },
      "hidden-logger-audit-transcript-telemetry-external-sink-semantics-secrets-management-key-rotation-external-gateway-credential-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, httpServer: { enabled: false } },
      "hidden-backend-api-server-semantics-secrets-management-key-rotation-external-gateway-credential-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, databaseUrl: "sqlite://example.invalid/db" },
      "hidden-database-storage-cache-write-semantics-secrets-management-key-rotation-external-gateway-credential-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, connectorAccessGrant: { enabled: false } },
      "hidden-connector-grant-semantics-secrets-management-key-rotation-external-gateway-credential-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, terraformPlan: { enabled: false } },
      "hidden-infrastructure-deployment-compliance-pii-retention-export-semantics-secrets-management-key-rotation-external-gateway-credential-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, ciPipeline: { enabled: false } },
      "hidden-testing-ci-release-automation-semantics-secrets-management-key-rotation-external-gateway-credential-boundary-map-input-rejected"
    ],
    [
      {
        reviewedAt,
        boundaryEntries: boundaryEntryPatch({
          unsafeSecretsCredentialRuntimeFlags: {
            ...firstEntry.unsafeSecretsCredentialRuntimeFlags,
            vaultAccessEnabled: true
          }
        })
      },
      "unsafe-secrets-management-key-rotation-external-gateway-credential-runtime-flags-secrets-management-key-rotation-external-gateway-credential-boundary-map-input-rejected"
    ],
    [
      {
        reviewedAt,
        boundaryEntries: boundaryEntryPatch({
          runtimeEffect: { ...firstEntry.runtimeEffect, runtimeReady: true }
        })
      },
      "nested-unsafe-flags-secrets-management-key-rotation-external-gateway-credential-boundary-map-input-rejected"
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
      "noncanonical-secrets-management-key-rotation-external-gateway-credential-boundary-map-input-rejected"
    ]
  ];

  for (const [input, caseKey] of cases) {
    const result =
      createSecretsManagementKeyRotationExternalGatewayCredentialBoundaryMapForReview(
        input
      );
    assert.equal(
      result.classification,
      expectedCaseClassifications[caseKey],
      caseKey
    );
    assert.equal(
      result
        .secretsManagementKeyRotationExternalGatewayCredentialBoundaryMapProduced,
      false,
      caseKey
    );
    assert.equal(result.boundaryEntries.length, 0, caseKey);
    assertNonAuthorizing(result);
  }
});

test("Phase 5.72 enabled runtime flags cannot authorize secret behavior", () => {
  for (const field of unsafeFlagCases) {
    const result =
      createSecretsManagementKeyRotationExternalGatewayCredentialBoundaryMapForReview(
        {
          reviewedAt,
          [field]: true
        }
      );

    assert.equal(
      result.classification,
      expectedCaseClassifications[
        "unsafe-secrets-management-key-rotation-external-gateway-credential-runtime-flags-secrets-management-key-rotation-external-gateway-credential-boundary-map-input-rejected"
      ],
      field
    );
    assert.equal(
      result
        .secretsManagementKeyRotationExternalGatewayCredentialBoundaryMapProduced,
      false,
      field
    );
    assertNonAuthorizing(result);
  }
});

test("Phase 5.72 boundary map stays non-authorizing and runtime-blocked", async () => {
  const fixture = await readFixture();
  const summary = fixture.boundaryMapSummary;

  for (const field of [
    "phase548SecretsManagementCoverageItemRepresented",
    "secretsCredentialBoundaryMetadataOnly",
    "noLiveSecretsCredentialRuntimePerformed",
    "envSecretsVaultBoundaryRecorded",
    "apiKeyProviderCredentialBoundaryRecorded",
    "oauthSessionTokenBoundaryRecorded",
    "mcpPluginProviderCredentialBoundaryRecorded",
    "skillhubTrustProvenanceBoundaryRecorded",
    "matrixGatewayCredentialBoundaryRecorded",
    "externalGatewayCredentialBoundaryRecorded",
    "fabricCoordinationEnvelopeSecretBoundaryRecorded",
    "secureDropRecipientIdentityKeyringDidBoundaryRecorded",
    "encodedHandoffProtocolIdentityBoundaryRecorded",
    "hermesCuaDriverTrustBoundaryRecorded",
    "computerUsePermissionSecretBoundaryRecorded",
    "shellPrimitiveSecretBoundaryRecorded",
    "sqlitePrimitiveSecretBoundaryRecorded",
    "secretScanningEvidenceBoundaryRecorded",
    "rotationRevocationEvidenceBoundaryRecorded",
    "redactionAuditBoundaryRecorded",
    "localOnlyCloudOptInBoundaryRecorded",
    "noSecretStore",
    "noEnvIngestion",
    "noVaultAccess",
    "noKeyringDidRuntime",
    "noTokenLoaderOauthSessionHandling",
    "noCredentialScannerSecretScannerRuntime",
    "noRotationRevocationJobs",
    "noCredentialExportSecretPersistence",
    "noRedactionRuntime",
    "noMatrixGatewayE2eeKeyHandling",
    "noExternalGatewayRuntime",
    "noMcpPluginProviderCredentialsRuntime",
    "noSecureDropFabricRuntime",
    "noHermesCuaComputerUseRuntime",
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
    "allUnsafeSecretsCredentialRuntimeFlagsFalse",
    "allRuntimeEffectsFalse",
    "allEntriesNonAuthorizing"
  ]) {
    assert.equal(summary[field], true, `${field} should be true`);
  }

  assertNonAuthorizing(fixture);
  assert.equal(
    fixture.recommendedNextPhase,
    "phase-5.73-review-only-external-gateway-matrix-transport-contract-boundary-map"
  );
});

test("serve-runtime remains default-blocked and dry-run cannot bypass Phase 5.72", async () => {
  const direct = await expectCliFailure(["serve-runtime"]);
  assert.notEqual(direct.code, 0);
  assert.equal(direct.stdout, "");

  const dryRun = await expectCliFailure(["serve-runtime", "--dry-run"]);
  assert.notEqual(dryRun.code, 0);
  assert.equal(dryRun.stdout, "");
});

test("Phase 5.72 secret and gateway command names remain rejected", async () => {
  for (const command of commandProbes) {
    const error = await expectCliFailure([command]);
    assert.notEqual(error.code, 0, command);
    assert.equal(error.stdout, "", command);
  }
});

test("Phase 5.72 does not change CLI, Rust, Fabric, package, or consumer source", async () => {
  const files = [
    "apps/cli/src/index.mjs",
    "crates/ardyn-host/src/lib.rs",
    "crates/ardyn-host/src/stdio_runtime/mod.rs",
    "packages/fabric/src/index.mjs",
    "package.json"
  ];

  for (const file of files) {
    const [baseline, current] = await Promise.all([
      execFileAsync("git", ["show", `${phase572BaselineCommit}:${file}`], {
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
