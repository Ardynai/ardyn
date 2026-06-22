import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";
import {
  SECURITY_RLS_INPUT_SANITIZATION_CONTRACT_BOUNDARY_MAP_SCHEMA,
  createSecurityRlsInputSanitizationContractBoundaryMapForReview
} from "../packages/core/src/index.mjs";

const execFileAsync = promisify(execFile);
const phase563BaselineCommit = "9d0bf952474ffb73a9a0dd509814d80f074545d5";
const reviewedAt = "2026-06-22T00:00:00.000Z";
const repoRootUrl = new URL("../", import.meta.url);
const repoRoot = fileURLToPath(repoRootUrl);
const cliPath = fileURLToPath(new URL("../apps/cli/src/index.mjs", import.meta.url));
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-63/security-rls-input-sanitization-contract-boundary-map.json",
  import.meta.url
);

const expectedCaseClassifications = Object.freeze({
  "valid-security-rls-input-sanitization-contract-boundary-map":
    "valid_security_rls_input_sanitization_contract_boundary_map_runtime_still_blocked",
  "malformed-security-rls-input-sanitization-contract-boundary-map-input-rejected":
    "malformed_security_rls_input_sanitization_contract_boundary_map_input_rejected",
  "missing-required-security-rls-input-sanitization-contract-boundary-entry-rejected":
    "missing_required_security_rls_input_sanitization_contract_boundary_entry_rejected",
  "unknown-top-level-field-security-rls-input-sanitization-contract-boundary-map-input-rejected":
    "unknown_top_level_field_security_rls_input_sanitization_contract_boundary_map_input_rejected",
  "unknown-boundary-family-security-rls-input-sanitization-contract-boundary-map-input-rejected":
    "unknown_boundary_family_security_rls_input_sanitization_contract_boundary_map_input_rejected",
  "unknown-related-system-security-rls-input-sanitization-contract-boundary-map-input-rejected":
    "unknown_related_system_security_rls_input_sanitization_contract_boundary_map_input_rejected",
  "unknown-current-status-security-rls-input-sanitization-contract-boundary-map-input-rejected":
    "unknown_current_status_security_rls_input_sanitization_contract_boundary_map_input_rejected",
  "authorization-flags-enabled-security-rls-input-sanitization-contract-boundary-map-input-rejected":
    "authorization_flags_enabled_security_rls_input_sanitization_contract_boundary_map_input_rejected",
  "report-runs-checks-true-security-rls-input-sanitization-contract-boundary-map-input-rejected":
    "report_runs_checks_true_security_rls_input_sanitization_contract_boundary_map_input_rejected",
  "runtime-authorization-attempt-security-rls-input-sanitization-contract-boundary-map-input-rejected":
    "runtime_authorization_attempt_security_rls_input_sanitization_contract_boundary_map_input_rejected",
  "command-exposure-attempt-security-rls-input-sanitization-contract-boundary-map-input-rejected":
    "command_exposure_attempt_security_rls_input_sanitization_contract_boundary_map_input_rejected",
  "blocked-cli-bypass-attempt-security-rls-input-sanitization-contract-boundary-map-input-rejected":
    "blocked_cli_bypass_attempt_security_rls_input_sanitization_contract_boundary_map_input_rejected",
  "hidden-backend-api-server-middleware-semantics-security-rls-input-sanitization-contract-boundary-map-input-rejected":
    "hidden_backend_api_server_middleware_semantics_security_rls_input_sanitization_contract_boundary_map_input_rejected",
  "hidden-database-rls-schema-migration-semantics-security-rls-input-sanitization-contract-boundary-map-input-rejected":
    "hidden_database_rls_schema_migration_semantics_security_rls_input_sanitization_contract_boundary_map_input_rejected",
  "hidden-secret-env-vault-access-semantics-security-rls-input-sanitization-contract-boundary-map-input-rejected":
    "hidden_secret_env_vault_access_semantics_security_rls_input_sanitization_contract_boundary_map_input_rejected",
  "hidden-connector-grant-semantics-security-rls-input-sanitization-contract-boundary-map-input-rejected":
    "hidden_connector_grant_semantics_security_rls_input_sanitization_contract_boundary_map_input_rejected",
  "hidden-fabric-websocket-http-mcp-task-runtime-semantics-security-rls-input-sanitization-contract-boundary-map-input-rejected":
    "hidden_fabric_websocket_http_mcp_task_runtime_semantics_security_rls_input_sanitization_contract_boundary_map_input_rejected",
  "hidden-secure-drop-implementation-semantics-security-rls-input-sanitization-contract-boundary-map-input-rejected":
    "hidden_secure_drop_implementation_semantics_security_rls_input_sanitization_contract_boundary_map_input_rejected",
  "hidden-encoded-handoff-codec-translator-stego-covert-channel-tokenizer-exploit-bypass-semantics-security-rls-input-sanitization-contract-boundary-map-input-rejected":
    "hidden_encoded_handoff_codec_translator_stego_covert_channel_tokenizer_exploit_bypass_semantics_security_rls_input_sanitization_contract_boundary_map_input_rejected",
  "hidden-audit-log-write-tamper-evident-writer-semantics-security-rls-input-sanitization-contract-boundary-map-input-rejected":
    "hidden_audit_log_write_tamper_evident_writer_semantics_security_rls_input_sanitization_contract_boundary_map_input_rejected",
  "unsafe-sanitizer-rls-permission-secure-transport-dependency-audit-log-secret-connector-external-lookup-runtime-flags-security-rls-input-sanitization-contract-boundary-map-input-rejected":
    "unsafe_sanitizer_rls_permission_secure_transport_dependency_audit_log_secret_connector_external_lookup_runtime_flags_security_rls_input_sanitization_contract_boundary_map_input_rejected",
  "nested-unsafe-flags-security-rls-input-sanitization-contract-boundary-map-input-rejected":
    "nested_unsafe_flags_security_rls_input_sanitization_contract_boundary_map_input_rejected",
  "noncanonical-security-rls-input-sanitization-contract-boundary-map-input-rejected":
    "noncanonical_security_rls_input_sanitization_contract_boundary_map_input_rejected"
});

const expectedBoundaryIds = Object.freeze([
  "phase5-63.ardyn.manifest_task_review_artifact.input_sanitization_boundary",
  "phase5-63.ardyn.encoded_handoff_input.encoded_handoff_safety_boundary",
  "phase5-63.ardyn.display_conformance_fixture.schema_validation_boundary",
  "phase5-63.repo_family.api_backend_request_validation.schema_validation_boundary",
  "phase5-63.ardyn.database_storage_rls.rls_boundary",
  "phase5-63.repo_family.tenant_project_workspace.data_isolation_boundary",
  "phase5-63.ardyn.auth_permissions_enforcement.permission_enforcement_boundary",
  "phase5-63.repo_family.fabric_coordination_envelope.content_safety_boundary",
  "phase5-63.locus.control_surface_input_safety.input_sanitization_boundary",
  "phase5-63.multiverse.citizen_adapter_input_safety.input_sanitization_boundary",
  "phase5-63.ardyn.mcp_tool_exposure_safety.injection_prevention_boundary",
  "phase5-63.repo_family.connector_input_safety.injection_prevention_boundary",
  "phase5-63.content_fabric.secure_drop_metadata_safety.secure_drop_boundary",
  "phase5-63.ardyn.secret_env_vault_exposure.secret_exposure_boundary",
  "phase5-63.repo_family.dependency_security_scan.dependency_security_boundary",
  "phase5-63.repo_family.audit_log_integrity.audit_integrity_boundary",
  "phase5-63.repo_family.secure_transport_https_hsts.secure_transport_boundary",
  "phase5-63.ardyn_subagent.prompt_output_safety.input_sanitization_boundary"
]);

const commandProbes = Object.freeze([
  "security-rls-input-sanitization-contract-boundary-map",
  "sanitizer-runtime",
  "runtime-sanitizer",
  "security-middleware",
  "rls-runtime",
  "rls-policy-runtime",
  "permission-enforcement-runtime",
  "secure-transport-runtime",
  "https-hsts-server-config",
  "dependency-patch-automation",
  "audit-log-writer",
  "tamper-evident-log-writer",
  "secret-scanner-runtime",
  "connector-scanner-runtime",
  "backend-security-middleware",
  "api-request-validator",
  "fabric-safety-runtime",
  "encoded-handoff-safety-runtime",
  "secure-drop-safety-runtime",
  "mcp-safety-runtime",
  "task-safety-runtime"
]);

const nonAuthorizingResultFields = Object.freeze([
  "reportRunsChecks",
  "sanitizerRuntimeImplemented",
  "runtimeSanitizerImplemented",
  "securityMiddlewareImplemented",
  "backendSecurityMiddlewareImplemented",
  "schemaValidatorAuthorizesRuntime",
  "injectionPreventionRuntimeImplemented",
  "rlsRuntimeImplemented",
  "rlsPolicyImplemented",
  "dataIsolationRuntimeImplemented",
  "permissionEnforcementRuntimeImplemented",
  "policyEnforcementRuntimeImplemented",
  "secureTransportRuntimeImplemented",
  "httpsHstsServerConfigImplemented",
  "dependencyPatchAutomationEnabled",
  "dependencySecurityScannerRuntimeEnabled",
  "liveSecurityScannerEnabled",
  "auditWriterImplemented",
  "auditLogWriterImplemented",
  "logWriterImplemented",
  "tamperEvidentWriterImplemented",
  "secretScannerRuntimeEnabled",
  "connectorScannerRuntimeEnabled",
  "externalLookupEnabled",
  "databaseClientImplemented",
  "databaseSchemaImplemented",
  "databaseMigrationImplemented",
  "storageAdapterImplemented",
  "cacheEngineImplemented",
  "cacheInvalidationRuntimeImplemented",
  "transcriptWriterImplemented",
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
  const [entry] = createSecurityRlsInputSanitizationContractBoundaryMapForReview({
    reviewedAt
  }).boundaryEntries;

  return [{ ...structuredClone(entry), ...patch }];
}

test("Phase 5.63 security/RLS/input-sanitization boundary map fixture is deterministic", async () => {
  const fixture = await readFixture();
  const generated = createSecurityRlsInputSanitizationContractBoundaryMapForReview({
    reviewedAt
  });

  assert.equal(fixture.schema, SECURITY_RLS_INPUT_SANITIZATION_CONTRACT_BOUNDARY_MAP_SCHEMA);
  assert.deepEqual(fixture, generated);
  assert.equal(
    fixture.classification,
    expectedCaseClassifications[
      "valid-security-rls-input-sanitization-contract-boundary-map"
    ]
  );
  assert.equal(fixture.securityRlsInputSanitizationContractBoundaryMapProduced, true);
  assert.equal(fixture.boundaryMapSummary.boundaryEntryCount, 18);
  assert.deepEqual(fixture.boundaryMapSummary.boundaryIds, expectedBoundaryIds);
  assert.deepEqual(fixture.boundaryMapSummary.countByFamily, {
    input_sanitization_contract: 4,
    schema_validation_contract: 2,
    injection_prevention_contract: 2,
    rls_contract: 1,
    data_isolation_contract: 1,
    permission_enforcement_contract: 1,
    secure_transport_contract: 1,
    content_safety_contract: 1,
    dependency_security_contract: 1,
    secret_exposure_contract: 1,
    audit_integrity_contract: 1,
    encoded_handoff_safety_contract: 1,
    secure_drop_boundary_contract: 1
  });
  assert.deepEqual(fixture.boundaryMapSummary.countByRelatedSystem, {
    ardyn: 7,
    "ardyn-subagent": 1,
    locus: 1,
    multiverse: 1,
    "content-fabric": 1,
    "repo-family": 7
  });
});

test("Phase 5.63 references Phase 5.48, 5.59, 5.60, 5.61, 5.62, and content-fabric ownership", async () => {
  const fixture = await readFixture();
  const state = fixture.securityRlsInputSanitizationContractBoundaryMap;

  assert.equal(state.sourcePhaseContext.phase548SecurityRlsAreaNumber, 8);
  assert.equal(state.sourcePhaseContext.phase548SecurityRlsStatus, "deferred");
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
  assert.equal(state.sourcePhaseContext.secureDropCanonicalOwner, "content-fabric");
  assert.equal(fixture.boundaryMapSummary.phase548SecurityRlsCoverageItemRepresented, true);
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
});

test("Phase 5.63 invalid security/RLS/input-sanitization boundary cases fail closed", () => {
  const canonical =
    createSecurityRlsInputSanitizationContractBoundaryMapForReview({ reviewedAt });
  const firstEntry = structuredClone(canonical.boundaryEntries[0]);
  const missingFieldEntry = structuredClone(firstEntry);

  delete missingFieldEntry.boundaryId;

  const cases = [
    {
      name:
        "malformed-security-rls-input-sanitization-contract-boundary-map-input-rejected",
      input: null
    },
    {
      name:
        "malformed-security-rls-input-sanitization-contract-boundary-map-input-rejected",
      input: { reviewedAt: "not-a-timestamp" }
    },
    {
      name:
        "missing-required-security-rls-input-sanitization-contract-boundary-entry-rejected",
      input: { reviewedAt, boundaryEntries: [missingFieldEntry] }
    },
    {
      name:
        "unknown-top-level-field-security-rls-input-sanitization-contract-boundary-map-input-rejected",
      input: { reviewedAt, unknownSecurityPayload: "blocked" }
    },
    {
      name:
        "unknown-boundary-family-security-rls-input-sanitization-contract-boundary-map-input-rejected",
      input: {
        reviewedAt,
        boundaryEntries: boundaryEntryPatch({ boundaryFamily: "runtime_security" })
      }
    },
    {
      name:
        "unknown-related-system-security-rls-input-sanitization-contract-boundary-map-input-rejected",
      input: {
        reviewedAt,
        boundaryEntries: boundaryEntryPatch({ relatedSystem: "jules" })
      }
    },
    {
      name:
        "unknown-current-status-security-rls-input-sanitization-contract-boundary-map-input-rejected",
      input: {
        reviewedAt,
        boundaryEntries: boundaryEntryPatch({ currentStatus: "implemented" })
      }
    },
    {
      name:
        "authorization-flags-enabled-security-rls-input-sanitization-contract-boundary-map-input-rejected",
      input: {
        reviewedAt,
        boundaryEntries: boundaryEntryPatch({
          explicitBlockedAuthorizationFlags: {
            ...firstEntry.explicitBlockedAuthorizationFlags,
            sanitizerRuntimeAuthorizationGranted: true
          }
        })
      }
    },
    {
      name:
        "report-runs-checks-true-security-rls-input-sanitization-contract-boundary-map-input-rejected",
      input: { reviewedAt, reportRunsChecks: true }
    },
    {
      name:
        "runtime-authorization-attempt-security-rls-input-sanitization-contract-boundary-map-input-rejected",
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
        "command-exposure-attempt-security-rls-input-sanitization-contract-boundary-map-input-rejected",
      input: { reviewedAt, commandExposureEnabled: true }
    },
    {
      name:
        "blocked-cli-bypass-attempt-security-rls-input-sanitization-contract-boundary-map-input-rejected",
      input: { reviewedAt, blockedCliBypassEnabled: true }
    },
    {
      name:
        "hidden-backend-api-server-middleware-semantics-security-rls-input-sanitization-contract-boundary-map-input-rejected",
      input: { reviewedAt, backendApiMiddleware: "blocked" }
    },
    {
      name:
        "hidden-database-rls-schema-migration-semantics-security-rls-input-sanitization-contract-boundary-map-input-rejected",
      input: { reviewedAt, rlsPolicy: "blocked" }
    },
    {
      name:
        "hidden-secret-env-vault-access-semantics-security-rls-input-sanitization-contract-boundary-map-input-rejected",
      input: { reviewedAt, secretVaultPath: "C:/blocked/vault" }
    },
    {
      name:
        "hidden-connector-grant-semantics-security-rls-input-sanitization-contract-boundary-map-input-rejected",
      input: { reviewedAt, connectorGrant: "blocked" }
    },
    {
      name:
        "hidden-fabric-websocket-http-mcp-task-runtime-semantics-security-rls-input-sanitization-contract-boundary-map-input-rejected",
      input: { reviewedAt, fabricBusTopic: "blocked.topic" }
    },
    {
      name:
        "hidden-secure-drop-implementation-semantics-security-rls-input-sanitization-contract-boundary-map-input-rejected",
      input: { reviewedAt, secureDropPayloadPath: "C:/blocked/drop" }
    },
    {
      name:
        "hidden-encoded-handoff-codec-translator-stego-covert-channel-tokenizer-exploit-bypass-semantics-security-rls-input-sanitization-contract-boundary-map-input-rejected",
      input: { reviewedAt, covertChannel: "blocked" }
    },
    {
      name:
        "hidden-audit-log-write-tamper-evident-writer-semantics-security-rls-input-sanitization-contract-boundary-map-input-rejected",
      input: { reviewedAt, auditWriter: "blocked" }
    },
    {
      name:
        "unsafe-sanitizer-rls-permission-secure-transport-dependency-audit-log-secret-connector-external-lookup-runtime-flags-security-rls-input-sanitization-contract-boundary-map-input-rejected",
      input: {
        reviewedAt,
        boundaryEntries: boundaryEntryPatch({
          unsafeSecurityRlsInputRuntimeFlags: {
            ...firstEntry.unsafeSecurityRlsInputRuntimeFlags,
            rlsRuntimeImplemented: true
          }
        })
      }
    },
    {
      name:
        "nested-unsafe-flags-security-rls-input-sanitization-contract-boundary-map-input-rejected",
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
        "noncanonical-security-rls-input-sanitization-contract-boundary-map-input-rejected",
      input: {
        reviewedAt,
        boundaryEntries: [...canonical.boundaryEntries].reverse()
      }
    }
  ];

  for (const { name, input } of cases) {
    const result =
      createSecurityRlsInputSanitizationContractBoundaryMapForReview(input);

    assert.equal(result.classification, expectedCaseClassifications[name], name);
    assert.equal(result.securityRlsInputSanitizationContractBoundaryMapProduced, false);
    assert.equal(result.securityRlsInputSanitizationContractBoundaryMap, null);
    assertNonAuthorizing(result);
  }
});

test("Phase 5.63 boundary entries cover required families, systems, and blocked security semantics", async () => {
  const fixture = await readFixture();
  const families = new Set();
  const systems = new Set();
  const statuses = new Set();

  for (const entry of fixture.boundaryEntries) {
    families.add(entry.boundaryFamily);
    systems.add(entry.relatedSystem);
    statuses.add(entry.currentStatus);

    assert.match(entry.boundaryId, /^phase5-63\./);
    assert.equal(entry.securityRlsInputSanitizationBoundaryMetadataOnly, true);
    assert.equal(entry.noLiveSecurityEnforcementPerformed, true);
    assert.equal(entry.nonAuthorizingProof, true);
    assert.ok(entry.allowedCurrentBehavior.length >= 2);
    assert.ok(entry.forbiddenCurrentBehavior.includes("security middleware"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("runtime sanitizer"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("RLS rule"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("permission enforcement runtime"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("secure transport server config"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("secret/env/vault access"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("connector grant"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("websocket/http transport"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("MCP tool exposure"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("task execution"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("audit writer"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("command exposure"));
    assert.equal(entry.productionReadinessAreaReference.areaNumber, 8);
    assert.equal(entry.productionReadinessAreaReference.authorizesRuntime, false);
    assert.equal(
      entry.phase559FabricAwareApiBackendReference.implementsFabricRuntime,
      false
    );
    assert.equal(
      entry.phase560EncodedHandoffConformanceReference
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
    assertAllFalse(entry.explicitBlockedAuthorizationFlags);
    assertAllFalse(entry.unsafeSecurityRlsInputRuntimeFlags);
    assertAllFalse(entry.runtimeEffect);
  }

  assert.deepEqual([...families].sort(), [
    "audit_integrity_contract",
    "content_safety_contract",
    "data_isolation_contract",
    "dependency_security_contract",
    "encoded_handoff_safety_contract",
    "injection_prevention_contract",
    "input_sanitization_contract",
    "permission_enforcement_contract",
    "rls_contract",
    "schema_validation_contract",
    "secret_exposure_contract",
    "secure_drop_boundary_contract",
    "secure_transport_contract"
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

test("Phase 5.63 boundary map stays non-authorizing and runtime-blocked", async () => {
  const fixture = await readFixture();
  const summary = fixture.boundaryMapSummary;

  assert.equal(summary.securityRlsInputSanitizationBoundaryMetadataOnly, true);
  assert.equal(summary.noLiveSecurityEnforcementPerformed, true);
  assert.equal(summary.noSanitizerRuntimeImplemented, true);
  assert.equal(summary.noSecurityMiddlewareImplemented, true);
  assert.equal(summary.noRlsRuntimeImplemented, true);
  assert.equal(summary.noPermissionEnforcementRuntime, true);
  assert.equal(summary.noSecureTransportRuntime, true);
  assert.equal(summary.noDependencyPatchAutomation, true);
  assert.equal(summary.noAuditLogWriters, true);
  assert.equal(summary.noSecretEnvVaultAccess, true);
  assert.equal(summary.contentFabricCanonicalSecureDropOwnerOnly, true);
  assert.equal(summary.allBlockedAuthorizationFlagsFalse, true);
  assert.equal(summary.allUnsafeSecurityRlsInputRuntimeFlagsFalse, true);
  assert.equal(summary.allRuntimeEffectsFalse, true);
  assert.equal(summary.allEntriesNonAuthorizing, true);
  assert.equal(fixture.invalidBoundaryCasePolicy.validationImplementsSanitizerRuntime, false);
  assert.equal(fixture.invalidBoundaryCasePolicy.validationImplementsSecurityMiddleware, false);
  assert.equal(fixture.invalidBoundaryCasePolicy.validationImplementsRlsRuntime, false);
  assert.equal(
    fixture.invalidBoundaryCasePolicy.validationImplementsPermissionEnforcementRuntime,
    false
  );
  assert.equal(fixture.invalidBoundaryCasePolicy.validationImplementsSecureTransportRuntime, false);
  assert.equal(fixture.invalidBoundaryCasePolicy.validationRunsDependencyPatchAutomation, false);
  assert.equal(fixture.invalidBoundaryCasePolicy.validationWritesAuditLogs, false);
  assert.equal(fixture.invalidBoundaryCasePolicy.validationAccessesSecrets, false);
  assert.equal(fixture.invalidBoundaryCasePolicy.validationRunsConnectorScanner, false);
  assert.equal(fixture.invalidBoundaryCasePolicy.validationPerformsExternalLookup, false);
  assert.equal(fixture.invalidBoundaryCasePolicy.validationRunsRuntime, false);
  assertNonAuthorizing(fixture);
  assertNonAuthorizing(fixture.securityRlsInputSanitizationContractBoundaryMap);
  assert.ok(
    fixture.topSecurityRlsAuthDatabaseFabricApiBackendGaps.some((gap) =>
      gap.includes("No security middleware")
    )
  );
  assert.equal(
    fixture.recommendedNextPhase,
    "phase-5.64-review-only-rate-limiting-abuse-control-contract-boundary-map"
  );
});

test("serve-runtime remains default-blocked and dry-run cannot bypass Phase 5.63", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-63-runtime-"));

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

test("Phase 5.63 security/RLS/input/runtime command names remain rejected", async () => {
  for (const command of commandProbes) {
    const failure = await expectCliFailure([command]);

    assert.notEqual(failure.code, 0);
    assert.equal(failure.stdout, "");
    assert.match(failure.stderr, /unknown command|Usage: ardyn/i);
  }
});

test("Phase 5.63 does not change CLI, Rust, Fabric, package, or consumer source", async () => {
  await execFileAsync(
    "git",
    [
      "diff",
      "--exit-code",
      phase563BaselineCommit,
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

  assert.doesNotMatch(currentCliSource, /security-rls-input-sanitization-contract-boundary-map/);
  assert.doesNotMatch(currentCliSource, /sanitizer-runtime/);
  assert.doesNotMatch(currentCliSource, /runtime-sanitizer/);
  assert.doesNotMatch(currentCliSource, /security-middleware/);
  assert.doesNotMatch(currentCliSource, /rls-runtime/);
  assert.doesNotMatch(currentCliSource, /rls-policy-runtime/);
  assert.doesNotMatch(currentCliSource, /permission-enforcement-runtime/);
  assert.doesNotMatch(currentCliSource, /secure-transport-runtime/);
  assert.doesNotMatch(currentCliSource, /https-hsts-server-config/);
  assert.doesNotMatch(currentCliSource, /dependency-patch-automation/);
  assert.doesNotMatch(currentCliSource, /audit-log-writer/);
  assert.doesNotMatch(currentCliSource, /tamper-evident-log-writer/);
  assert.doesNotMatch(currentCliSource, /secret-scanner-runtime/);
  assert.doesNotMatch(currentCliSource, /connector-scanner-runtime/);
  assert.doesNotMatch(currentCliSource, /backend-security-middleware/);
  assert.doesNotMatch(currentCliSource, /api-request-validator/);
  assert.doesNotMatch(currentCliSource, /fabric-safety-runtime/);
  assert.doesNotMatch(currentCliSource, /encoded-handoff-safety-runtime/);
  assert.doesNotMatch(currentCliSource, /secure-drop-safety-runtime/);
  assert.doesNotMatch(currentCliSource, /mcp-safety-runtime/);
  assert.doesNotMatch(currentCliSource, /task-safety-runtime/);
  assert.doesNotMatch(currentCliSource, /phase-5-63/);
});
