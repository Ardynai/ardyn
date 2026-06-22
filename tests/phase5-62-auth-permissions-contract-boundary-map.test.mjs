import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";
import {
  AUTH_PERMISSIONS_CONTRACT_BOUNDARY_MAP_SCHEMA,
  createAuthPermissionsContractBoundaryMapForReview
} from "../packages/core/src/index.mjs";

const execFileAsync = promisify(execFile);
const phase562BaselineCommit = "cf658bf30d126b7ce67068dc022a369f92d42dff";
const reviewedAt = "2026-06-22T00:00:00.000Z";
const repoRootUrl = new URL("../", import.meta.url);
const repoRoot = fileURLToPath(repoRootUrl);
const cliPath = fileURLToPath(new URL("../apps/cli/src/index.mjs", import.meta.url));
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-62/auth-permissions-contract-boundary-map.json",
  import.meta.url
);

const expectedCaseClassifications = Object.freeze({
  "valid-auth-permissions-contract-boundary-map":
    "valid_auth_permissions_contract_boundary_map_runtime_still_blocked",
  "malformed-auth-permissions-contract-boundary-map-input-rejected":
    "malformed_auth_permissions_contract_boundary_map_input_rejected",
  "missing-required-auth-permissions-contract-boundary-entry-rejected":
    "missing_required_auth_permissions_contract_boundary_entry_rejected",
  "unknown-top-level-field-auth-permissions-contract-boundary-map-input-rejected":
    "unknown_top_level_field_auth_permissions_contract_boundary_map_input_rejected",
  "unknown-boundary-family-auth-permissions-contract-boundary-map-input-rejected":
    "unknown_boundary_family_auth_permissions_contract_boundary_map_input_rejected",
  "unknown-related-system-auth-permissions-contract-boundary-map-input-rejected":
    "unknown_related_system_auth_permissions_contract_boundary_map_input_rejected",
  "unknown-current-status-auth-permissions-contract-boundary-map-input-rejected":
    "unknown_current_status_auth_permissions_contract_boundary_map_input_rejected",
  "authorization-flags-enabled-auth-permissions-contract-boundary-map-input-rejected":
    "authorization_flags_enabled_auth_permissions_contract_boundary_map_input_rejected",
  "report-runs-checks-true-auth-permissions-contract-boundary-map-input-rejected":
    "report_runs_checks_true_auth_permissions_contract_boundary_map_input_rejected",
  "runtime-authorization-attempt-auth-permissions-contract-boundary-map-input-rejected":
    "runtime_authorization_attempt_auth_permissions_contract_boundary_map_input_rejected",
  "command-exposure-attempt-auth-permissions-contract-boundary-map-input-rejected":
    "command_exposure_attempt_auth_permissions_contract_boundary_map_input_rejected",
  "blocked-cli-bypass-attempt-auth-permissions-contract-boundary-map-input-rejected":
    "blocked_cli_bypass_attempt_auth_permissions_contract_boundary_map_input_rejected",
  "hidden-login-session-token-api-key-semantics-auth-permissions-contract-boundary-map-input-rejected":
    "hidden_login_session_token_api_key_semantics_auth_permissions_contract_boundary_map_input_rejected",
  "hidden-permission-evaluator-semantics-auth-permissions-contract-boundary-map-input-rejected":
    "hidden_permission_evaluator_semantics_auth_permissions_contract_boundary_map_input_rejected",
  "hidden-approval-decision-grant-semantics-auth-permissions-contract-boundary-map-input-rejected":
    "hidden_approval_decision_grant_semantics_auth_permissions_contract_boundary_map_input_rejected",
  "hidden-connector-grant-semantics-auth-permissions-contract-boundary-map-input-rejected":
    "hidden_connector_grant_semantics_auth_permissions_contract_boundary_map_input_rejected",
  "hidden-runtime-authorization-semantics-auth-permissions-contract-boundary-map-input-rejected":
    "hidden_runtime_authorization_semantics_auth_permissions_contract_boundary_map_input_rejected",
  "hidden-secret-env-vault-access-semantics-auth-permissions-contract-boundary-map-input-rejected":
    "hidden_secret_env_vault_access_semantics_auth_permissions_contract_boundary_map_input_rejected",
  "hidden-external-identity-provider-integration-semantics-auth-permissions-contract-boundary-map-input-rejected":
    "hidden_external_identity_provider_integration_semantics_auth_permissions_contract_boundary_map_input_rejected",
  "hidden-keyring-did-secure-drop-implementation-semantics-auth-permissions-contract-boundary-map-input-rejected":
    "hidden_keyring_did_secure_drop_implementation_semantics_auth_permissions_contract_boundary_map_input_rejected",
  "hidden-database-storage-rls-persistence-semantics-auth-permissions-contract-boundary-map-input-rejected":
    "hidden_database_storage_rls_persistence_semantics_auth_permissions_contract_boundary_map_input_rejected",
  "hidden-fabric-websocket-http-mcp-task-runtime-semantics-auth-permissions-contract-boundary-map-input-rejected":
    "hidden_fabric_websocket_http_mcp_task_runtime_semantics_auth_permissions_contract_boundary_map_input_rejected",
  "unsafe-identity-authentication-authorization-session-token-api-key-role-permission-grant-secret-delegation-revocation-runtime-flags-auth-permissions-contract-boundary-map-input-rejected":
    "unsafe_identity_authentication_authorization_session_token_api_key_role_permission_grant_secret_delegation_revocation_runtime_flags_auth_permissions_contract_boundary_map_input_rejected",
  "nested-unsafe-flags-auth-permissions-contract-boundary-map-input-rejected":
    "nested_unsafe_flags_auth_permissions_contract_boundary_map_input_rejected",
  "noncanonical-auth-permissions-contract-boundary-map-input-rejected":
    "noncanonical_auth_permissions_contract_boundary_map_input_rejected"
});

const expectedBoundaryIds = Object.freeze([
  "phase5-62.ardyn.operator-identity.identity-boundary",
  "phase5-62.ardyn-subagent.subagent-identity.identity-boundary",
  "phase5-62.locus.external-harness-identity.authentication-boundary",
  "phase5-62.locus.control-surface-permission.permission-boundary",
  "phase5-62.multiverse.citizen-adapter-permission.permission-boundary",
  "phase5-62.multiverse.role-capability-badge.role-boundary",
  "phase5-62.repo-family.fabric-envelope-authorization.authorization-boundary",
  "phase5-62.ardyn.mcp-tool-access.permission-boundary",
  "phase5-62.repo-family.connector-grant.connector-grant-boundary",
  "phase5-62.ardyn.runtime-command-authorization.runtime-authorization-boundary",
  "phase5-62.ardyn.approval-prerequisite-metadata.approval-prerequisite-boundary",
  "phase5-62.ardyn.approval-decision-grant.authorization-boundary",
  "phase5-62.ardyn.operator_consent.operator_consent_boundary",
  "phase5-62.repo-family.delegation-candidate.delegation-boundary",
  "phase5-62.repo-family.revocation-candidate.revocation-boundary",
  "phase5-62.content-fabric.secure-drop-recipient-keyring-did.secret-access-boundary",
  "phase5-62.ardyn.secret-env-vault-access.secret-access-boundary",
  "phase5-62.repo-family.audit-subject-traceability.audit-subject-boundary"
]);

const commandProbes = Object.freeze([
  "auth-permissions-contract-boundary-map",
  "identity-provider-runtime",
  "login-session-runtime",
  "token-issuer",
  "api-key-issuer",
  "role-engine",
  "permission-evaluator",
  "authorization-evaluator",
  "approval-grant-runtime",
  "connector-grant-runtime",
  "secret-vault-access",
  "delegation-engine",
  "revocation-engine",
  "runtime-authorization-enforcement",
  "external-idp-integration",
  "keyring-did-runtime",
  "secure-drop-auth-runtime",
  "fabric-auth-runtime",
  "mcp-permission-runtime",
  "task-permission-runtime"
]);

const nonAuthorizingResultFields = Object.freeze([
  "reportRunsChecks",
  "identityProviderImplemented",
  "authenticationRuntimeImplemented",
  "loginFlowImplemented",
  "sessionRuntimeImplemented",
  "tokenIssuerImplemented",
  "apiKeyIssuerImplemented",
  "roleEngineImplemented",
  "permissionEvaluatorImplemented",
  "authorizationEvaluatorImplemented",
  "grantProducerImplemented",
  "approvalDecisionProduced",
  "approvalGrantProduced",
  "secretVaultEnvAccessEnabled",
  "connectorGrantProduced",
  "delegationEngineImplemented",
  "revocationEngineImplemented",
  "runtimeAuthorizationEnabled",
  "policyEnforcementRuntimeImplemented",
  "externalIdentityProviderIntegrated",
  "keyringDidImplemented",
  "databaseClientImplemented",
  "databaseSchemaImplemented",
  "databaseMigrationImplemented",
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
  "databaseStorageRuntimeWritesEnabled",
  "secretsRuntimeIngestionEnabled",
  "mcpToolExposureEnabled",
  "taskExecutionEnabled",
  "secureDropImplemented",
  "st3ggVendored",
  "serviceDiscoveryEnabled",
  "scheduleEnforcementEnabled",
  "backgroundPollingEnabled",
  "filesystemScanningEnabled",
  "processControlEnabled",
  "uiFrontendBrowserRenderingImplemented",
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
  const [entry] = createAuthPermissionsContractBoundaryMapForReview({
    reviewedAt
  }).boundaryEntries;

  return [{ ...structuredClone(entry), ...patch }];
}

test("Phase 5.62 auth/permissions boundary map fixture is deterministic", async () => {
  const fixture = await readFixture();
  const generated = createAuthPermissionsContractBoundaryMapForReview({
    reviewedAt
  });

  assert.equal(fixture.schema, AUTH_PERMISSIONS_CONTRACT_BOUNDARY_MAP_SCHEMA);
  assert.deepEqual(fixture, generated);
  assert.equal(
    fixture.classification,
    expectedCaseClassifications["valid-auth-permissions-contract-boundary-map"]
  );
  assert.equal(fixture.authPermissionsContractBoundaryMapProduced, true);
  assert.equal(fixture.boundaryMapSummary.boundaryEntryCount, 18);
  assert.deepEqual(fixture.boundaryMapSummary.boundaryIds, expectedBoundaryIds);
  assert.deepEqual(fixture.boundaryMapSummary.countByFamily, {
    identity_contract: 2,
    authentication_contract: 1,
    authorization_contract: 2,
    permission_contract: 3,
    role_contract: 1,
    operator_consent_contract: 1,
    approval_prerequisite_contract: 1,
    runtime_authorization_boundary: 1,
    connector_grant_boundary: 1,
    secret_access_boundary: 2,
    delegation_boundary: 1,
    revocation_boundary: 1,
    audit_subject_boundary: 1
  });
  assert.deepEqual(fixture.boundaryMapSummary.countByRelatedSystem, {
    ardyn: 7,
    "ardyn-subagent": 1,
    locus: 2,
    multiverse: 2,
    "content-fabric": 1,
    "repo-family": 5
  });
});

test("Phase 5.62 references Phase 5.48, 5.59, 5.60, 5.61, and content-fabric ownership", async () => {
  const fixture = await readFixture();
  const state = fixture.authPermissionsContractBoundaryMap;

  assert.equal(state.sourcePhaseContext.phase548AuthPermissionsAreaNumber, 4);
  assert.equal(state.sourcePhaseContext.phase548AuthPermissionsStatus, "deferred");
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
  assert.equal(state.sourcePhaseContext.secureDropCanonicalOwner, "content-fabric");
  assert.equal(fixture.boundaryMapSummary.phase548AuthPermissionsCoverageItemRepresented, true);
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
});

test("Phase 5.62 invalid auth/permissions boundary cases fail closed", () => {
  const canonical =
    createAuthPermissionsContractBoundaryMapForReview({ reviewedAt });
  const firstEntry = structuredClone(canonical.boundaryEntries[0]);
  const missingFieldEntry = structuredClone(firstEntry);

  delete missingFieldEntry.boundaryId;

  const cases = [
    {
      name: "malformed-auth-permissions-contract-boundary-map-input-rejected",
      input: null
    },
    {
      name: "malformed-auth-permissions-contract-boundary-map-input-rejected",
      input: { reviewedAt: "not-a-timestamp" }
    },
    {
      name: "missing-required-auth-permissions-contract-boundary-entry-rejected",
      input: { reviewedAt, boundaryEntries: [missingFieldEntry] }
    },
    {
      name:
        "unknown-top-level-field-auth-permissions-contract-boundary-map-input-rejected",
      input: { reviewedAt, unknownAuthPayload: "blocked" }
    },
    {
      name:
        "unknown-boundary-family-auth-permissions-contract-boundary-map-input-rejected",
      input: {
        reviewedAt,
        boundaryEntries: boundaryEntryPatch({ boundaryFamily: "runtime_auth" })
      }
    },
    {
      name:
        "unknown-related-system-auth-permissions-contract-boundary-map-input-rejected",
      input: {
        reviewedAt,
        boundaryEntries: boundaryEntryPatch({ relatedSystem: "jules" })
      }
    },
    {
      name:
        "unknown-current-status-auth-permissions-contract-boundary-map-input-rejected",
      input: {
        reviewedAt,
        boundaryEntries: boundaryEntryPatch({ currentStatus: "implemented" })
      }
    },
    {
      name:
        "authorization-flags-enabled-auth-permissions-contract-boundary-map-input-rejected",
      input: {
        reviewedAt,
        boundaryEntries: boundaryEntryPatch({
          explicitBlockedAuthorizationFlags: {
            ...firstEntry.explicitBlockedAuthorizationFlags,
            identityRuntimeAuthorizationGranted: true
          }
        })
      }
    },
    {
      name:
        "report-runs-checks-true-auth-permissions-contract-boundary-map-input-rejected",
      input: { reviewedAt, reportRunsChecks: true }
    },
    {
      name:
        "runtime-authorization-attempt-auth-permissions-contract-boundary-map-input-rejected",
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
        "command-exposure-attempt-auth-permissions-contract-boundary-map-input-rejected",
      input: { reviewedAt, commandExposureEnabled: true }
    },
    {
      name:
        "blocked-cli-bypass-attempt-auth-permissions-contract-boundary-map-input-rejected",
      input: { reviewedAt, blockedCliBypassEnabled: true }
    },
    {
      name:
        "hidden-login-session-token-api-key-semantics-auth-permissions-contract-boundary-map-input-rejected",
      input: { reviewedAt, loginUrl: "https://blocked.invalid/login" }
    },
    {
      name:
        "hidden-permission-evaluator-semantics-auth-permissions-contract-boundary-map-input-rejected",
      input: { reviewedAt, permissionEvaluator: "blocked" }
    },
    {
      name:
        "hidden-approval-decision-grant-semantics-auth-permissions-contract-boundary-map-input-rejected",
      input: { reviewedAt, approvalGrant: "blocked" }
    },
    {
      name:
        "hidden-connector-grant-semantics-auth-permissions-contract-boundary-map-input-rejected",
      input: { reviewedAt, connectorGrant: "blocked" }
    },
    {
      name:
        "hidden-runtime-authorization-semantics-auth-permissions-contract-boundary-map-input-rejected",
      input: { reviewedAt, runtimeAuthorizationGrant: "blocked" }
    },
    {
      name:
        "hidden-secret-env-vault-access-semantics-auth-permissions-contract-boundary-map-input-rejected",
      input: { reviewedAt, secretVaultPath: "C:/blocked/vault" }
    },
    {
      name:
        "hidden-external-identity-provider-integration-semantics-auth-permissions-contract-boundary-map-input-rejected",
      input: { reviewedAt, oidcIssuer: "https://blocked.invalid" }
    },
    {
      name:
        "hidden-keyring-did-secure-drop-implementation-semantics-auth-permissions-contract-boundary-map-input-rejected",
      input: { reviewedAt, didDocument: { id: "did:blocked:ardyn" } }
    },
    {
      name:
        "hidden-database-storage-rls-persistence-semantics-auth-permissions-contract-boundary-map-input-rejected",
      input: { reviewedAt, rlsPolicy: "blocked" }
    },
    {
      name:
        "hidden-fabric-websocket-http-mcp-task-runtime-semantics-auth-permissions-contract-boundary-map-input-rejected",
      input: { reviewedAt, fabricBusTopic: "blocked.topic" }
    },
    {
      name:
        "unsafe-identity-authentication-authorization-session-token-api-key-role-permission-grant-secret-delegation-revocation-runtime-flags-auth-permissions-contract-boundary-map-input-rejected",
      input: {
        reviewedAt,
        boundaryEntries: boundaryEntryPatch({
          unsafeAuthPermissionsRuntimeFlags: {
            ...firstEntry.unsafeAuthPermissionsRuntimeFlags,
            permissionEvaluatorImplemented: true
          }
        })
      }
    },
    {
      name:
        "nested-unsafe-flags-auth-permissions-contract-boundary-map-input-rejected",
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
        "noncanonical-auth-permissions-contract-boundary-map-input-rejected",
      input: {
        reviewedAt,
        boundaryEntries: [...canonical.boundaryEntries].reverse()
      }
    }
  ];

  for (const { name, input } of cases) {
    const result = createAuthPermissionsContractBoundaryMapForReview(input);

    assert.equal(result.classification, expectedCaseClassifications[name], name);
    assert.equal(result.authPermissionsContractBoundaryMapProduced, false);
    assert.equal(result.authPermissionsContractBoundaryMap, null);
    assertNonAuthorizing(result);
  }
});

test("Phase 5.62 boundary entries cover required families, systems, and blocked auth semantics", async () => {
  const fixture = await readFixture();
  const families = new Set();
  const systems = new Set();
  const statuses = new Set();

  for (const entry of fixture.boundaryEntries) {
    families.add(entry.boundaryFamily);
    systems.add(entry.relatedSystem);
    statuses.add(entry.currentStatus);

    assert.match(entry.boundaryId, /^phase5-62\./);
    assert.equal(entry.authPermissionsBoundaryMetadataOnly, true);
    assert.equal(entry.noIdentityVerificationPerformed, true);
    assert.equal(entry.nonAuthorizingProof, true);
    assert.ok(entry.allowedCurrentBehavior.length >= 2);
    assert.ok(entry.forbiddenCurrentBehavior.includes("identity provider integration"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("login flow"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("session runtime"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("token issuance"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("API-key issuance"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("role engine"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("permission evaluator"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("approval grant"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("connector grant"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("secret/env/vault access"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("runtime authorization enforcement"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("websocket/http transport"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("Fabric runtime bus"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("command exposure"));
    assert.equal(entry.productionReadinessAreaReference.areaNumber, 4);
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
    assertAllFalse(entry.explicitBlockedAuthorizationFlags);
    assertAllFalse(entry.unsafeAuthPermissionsRuntimeFlags);
    assertAllFalse(entry.runtimeEffect);
  }

  assert.deepEqual([...families].sort(), [
    "approval_prerequisite_contract",
    "audit_subject_boundary",
    "authentication_contract",
    "authorization_contract",
    "connector_grant_boundary",
    "delegation_boundary",
    "identity_contract",
    "operator_consent_contract",
    "permission_contract",
    "revocation_boundary",
    "role_contract",
    "runtime_authorization_boundary",
    "secret_access_boundary"
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

test("Phase 5.62 boundary map stays non-authorizing and runtime-blocked", async () => {
  const fixture = await readFixture();
  const summary = fixture.boundaryMapSummary;

  assert.equal(summary.authPermissionsBoundaryMetadataOnly, true);
  assert.equal(summary.noIdentityVerificationPerformed, true);
  assert.equal(summary.noLoginSessionTokenApiKeyRuntime, true);
  assert.equal(summary.noRolePermissionEvaluatorRuntime, true);
  assert.equal(summary.noApprovalDecisionGrantRuntime, true);
  assert.equal(summary.noConnectorGrants, true);
  assert.equal(summary.noSecretEnvVaultAccess, true);
  assert.equal(summary.noDelegationRevocationRuntime, true);
  assert.equal(summary.contentFabricCanonicalSecureDropOwnerOnly, true);
  assert.equal(summary.allBlockedAuthorizationFlagsFalse, true);
  assert.equal(summary.allUnsafeAuthPermissionsRuntimeFlagsFalse, true);
  assert.equal(summary.allRuntimeEffectsFalse, true);
  assert.equal(summary.allEntriesNonAuthorizing, true);
  assert.equal(fixture.invalidBoundaryCasePolicy.validationImplementsIdentityProvider, false);
  assert.equal(fixture.invalidBoundaryCasePolicy.validationImplementsAuthenticationRuntime, false);
  assert.equal(fixture.invalidBoundaryCasePolicy.validationImplementsSessionRuntime, false);
  assert.equal(fixture.invalidBoundaryCasePolicy.validationIssuesTokens, false);
  assert.equal(fixture.invalidBoundaryCasePolicy.validationIssuesApiKeys, false);
  assert.equal(fixture.invalidBoundaryCasePolicy.validationImplementsRoleEngine, false);
  assert.equal(fixture.invalidBoundaryCasePolicy.validationImplementsPermissionEvaluator, false);
  assert.equal(fixture.invalidBoundaryCasePolicy.validationProducesApprovalDecision, false);
  assert.equal(fixture.invalidBoundaryCasePolicy.validationProducesApprovalGrant, false);
  assert.equal(fixture.invalidBoundaryCasePolicy.validationProducesConnectorGrant, false);
  assert.equal(fixture.invalidBoundaryCasePolicy.validationAccessesSecrets, false);
  assert.equal(fixture.invalidBoundaryCasePolicy.validationImplementsDelegationRevocation, false);
  assert.equal(fixture.invalidBoundaryCasePolicy.validationRunsRuntime, false);
  assertNonAuthorizing(fixture);
  assertNonAuthorizing(fixture.authPermissionsContractBoundaryMap);
  assert.ok(
    fixture.topAuthPermissionsDatabaseStorageFabricApiBackendGaps.some((gap) =>
      gap.includes("No identity provider")
    )
  );
  assert.equal(
    fixture.recommendedNextPhase,
    "phase-5.63-review-only-security-rls-input-sanitization-contract-boundary-map"
  );
});

test("serve-runtime remains default-blocked and dry-run cannot bypass Phase 5.62", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-62-runtime-"));

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

test("Phase 5.62 auth/permissions/runtime command names remain rejected", async () => {
  for (const command of commandProbes) {
    const failure = await expectCliFailure([command]);

    assert.notEqual(failure.code, 0);
    assert.equal(failure.stdout, "");
    assert.match(failure.stderr, /unknown command|Usage: ardyn/i);
  }
});

test("Phase 5.62 does not change CLI, Rust, Fabric, package, or consumer source", async () => {
  await execFileAsync(
    "git",
    [
      "diff",
      "--exit-code",
      phase562BaselineCommit,
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

  assert.doesNotMatch(currentCliSource, /auth-permissions-contract-boundary-map/);
  assert.doesNotMatch(currentCliSource, /identity-provider-runtime/);
  assert.doesNotMatch(currentCliSource, /login-session-runtime/);
  assert.doesNotMatch(currentCliSource, /token-issuer/);
  assert.doesNotMatch(currentCliSource, /api-key-issuer/);
  assert.doesNotMatch(currentCliSource, /role-engine/);
  assert.doesNotMatch(currentCliSource, /permission-evaluator/);
  assert.doesNotMatch(currentCliSource, /authorization-evaluator/);
  assert.doesNotMatch(currentCliSource, /approval-grant-runtime/);
  assert.doesNotMatch(currentCliSource, /connector-grant-runtime/);
  assert.doesNotMatch(currentCliSource, /secret-vault-access/);
  assert.doesNotMatch(currentCliSource, /delegation-engine/);
  assert.doesNotMatch(currentCliSource, /revocation-engine/);
  assert.doesNotMatch(currentCliSource, /runtime-authorization-enforcement/);
  assert.doesNotMatch(currentCliSource, /external-idp-integration/);
  assert.doesNotMatch(currentCliSource, /keyring-did-runtime/);
  assert.doesNotMatch(currentCliSource, /secure-drop-auth-runtime/);
  assert.doesNotMatch(currentCliSource, /fabric-auth-runtime/);
  assert.doesNotMatch(currentCliSource, /mcp-permission-runtime/);
  assert.doesNotMatch(currentCliSource, /task-permission-runtime/);
  assert.doesNotMatch(currentCliSource, /phase-5-62/);
});
