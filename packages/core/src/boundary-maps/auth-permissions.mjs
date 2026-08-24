import { isPlainObjectRecord, isReviewedAtDefaulted, isUtcIsoTimestampWithMilliseconds } from "../internal/utils.mjs";
import { APPROVAL_PREREQUISITE_SOURCE_PREFLIGHT_DEFAULT_REVIEWED_AT, REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE, authPermissionsContractBoundaryMapForbiddenBehavior } from "../internal/review-shared.mjs";


export const AUTH_PERMISSIONS_CONTRACT_BOUNDARY_MAP_SCHEMA =
  "ardyn.phase-5.62.auth-permissions-contract-boundary-map-result";
export const AUTH_PERMISSIONS_CONTRACT_BOUNDARY_MAP_VERSION = "0.1.0";
export const AUTH_PERMISSIONS_CONTRACT_BOUNDARY_MAP_KIND =
  "auth-permissions-contract-boundary-map";
const AUTH_PERMISSIONS_CONTRACT_BOUNDARY_MAP_STATE_SCHEMA =
  "ardyn.phase-5.62.auth-permissions-contract-boundary-map-state";
const VALID_AUTH_PERMISSIONS_CONTRACT_BOUNDARY_MAP_CLASSIFICATION =
  "valid_auth_permissions_contract_boundary_map_runtime_still_blocked";
const MALFORMED_AUTH_PERMISSIONS_CONTRACT_BOUNDARY_MAP_CLASSIFICATION =
  "malformed_auth_permissions_contract_boundary_map_input_rejected";
const AUTH_PERMISSIONS_CONTRACT_BOUNDARY_FAMILIES = Object.freeze([
  "identity_contract",
  "authentication_contract",
  "authorization_contract",
  "permission_contract",
  "role_contract",
  "operator_consent_contract",
  "approval_prerequisite_contract",
  "runtime_authorization_boundary",
  "connector_grant_boundary",
  "secret_access_boundary",
  "delegation_boundary",
  "revocation_boundary",
  "audit_subject_boundary"
]);
const AUTH_PERMISSIONS_CONTRACT_BOUNDARY_RELATED_SYSTEMS = Object.freeze([
  "ardyn",
  "ardyn-subagent",
  "locus",
  "multiverse",
  "content-fabric",
  "repo-family"
]);
const AUTH_PERMISSIONS_CONTRACT_BOUNDARY_STATUSES = Object.freeze([
  "metadata_only",
  "blocked",
  "future_contract_required"
]);
const AUTH_PERMISSIONS_CONTRACT_BOUNDARY_REQUIRED_FIELDS = Object.freeze([
  "boundaryId",
  "boundaryFamily",
  "relatedSystem",
  "currentStatus",
  "allowedCurrentBehavior",
  "forbiddenCurrentBehavior",
  "requiredFutureContractBeforeImplementation",
  "requiredFutureAuthorizationPhaseBeforeRuntime",
  "identitySubjectNotes",
  "rolePermissionExpectation",
  "consentApprovalExpectation",
  "revocationExpectation",
  "auditSubjectExpectation",
  "locusRoleDescription",
  "multiverseRoleDescription",
  "fabricRoleDescription",
  "secureDropRoleDescription",
  "explicitBlockedAuthorizationFlags",
  "unsafeAuthPermissionsRuntimeFlags",
  "nonAuthorizingProof"
]);
const AUTH_PERMISSIONS_CONTRACT_BOUNDARY_ALLOWED_TOP_LEVEL_FIELDS =
  Object.freeze(["reviewedAt", "boundaryEntries"]);
const AUTH_PERMISSIONS_CONTRACT_BOUNDARY_UNSAFE_FIELDS = Object.freeze([
  "identityProviderImplemented",
  "identityProviderRuntimeEnabled",
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
  "operatorConsentRuntimeImplemented",
  "secretVaultEnvAccessEnabled",
  "secretRuntimeIngestionEnabled",
  "connectorGrantProduced",
  "connectorGrantRuntimeImplemented",
  "delegationEngineImplemented",
  "revocationEngineImplemented",
  "runtimeAuthorizationEnabled",
  "runtimeAuthorizationEnforcementImplemented",
  "policyEnforcementRuntimeImplemented",
  "externalIdentityProviderIntegrated",
  "keyringImplemented",
  "didImplemented",
  "keyringDidImplemented",
  "secureDropImplemented",
  "secureDropCryptoImplemented",
  "secureDropTransportImplemented",
  "secureDropStegoImplemented",
  "secureDropSendReceiveImplemented",
  "secureDropInboxPollingEnabled",
  "st3ggVendored",
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
  "mcpToolExposureEnabled",
  "taskExecutionEnabled",
  "serviceDiscoveryEnabled",
  "scheduleEnforcementEnabled",
  "backgroundPollingEnabled",
  "filesystemScanningEnabled",
  "processControlEnabled",
  "uiFrontendBrowserRenderingImplemented",
  "commandExposureEnabled",
  "commandRuntimeControlEnabled",
  "runtimeExecutionEnabled",
  "databaseStorageRuntimeWritesEnabled",
  "reportRunsChecks",
  "blockedCliBypassEnabled"
]);
const AUTH_PERMISSIONS_CONTRACT_BOUNDARY_AUTHORIZATION_FIELDS = Object.freeze([
  "runtimeAuthorized",
  "runtimeAuthorizationGranted",
  "authRuntimeAuthorizationGranted",
  "identityAuthorizationGranted",
  "authenticationAuthorizationGranted",
  "authorizationEvaluatorGranted",
  "permissionEvaluatorAuthorized",
  "roleEngineAuthorized",
  "grantAuthorizationGranted",
  "secretAccessAuthorizationGranted",
  "connectorGrantAuthorizationGranted",
  "delegationAuthorizationGranted",
  "revocationAuthorizationGranted",
  "secureDropAuthorizationGranted",
  "approvalDecisionProduced",
  "approvalGrantProduced",
  "authorizesRuntime"
]);
const AUTH_PERMISSIONS_CONTRACT_BOUNDARY_COMMAND_FIELDS = Object.freeze([
  "commandExposureEnabled",
  "commandRuntimeControlEnabled",
  "commandsExposed",
  "exposesCommands",
  "runtimeCommandEnabled",
  "cliCommandExposed"
]);
const AUTH_PERMISSIONS_CONTRACT_BOUNDARY_BLOCKED_CLI_BYPASS_FIELDS =
  Object.freeze([
    "blockedCliBypassEnabled",
    "dryRunBypassesBlock",
    "serveRuntimeBypassEnabled",
    "bypassBlockedCommandBehavior",
    "blockedCommandOverride"
  ]);
const AUTH_PERMISSIONS_CONTRACT_BOUNDARY_LOGIN_SESSION_TOKEN_FIELDS =
  Object.freeze([
    "loginUrl",
    "loginFlow",
    "loginHandler",
    "sessionCookie",
    "sessionStore",
    "sessionToken",
    "tokenIssuer",
    "accessToken",
    "refreshToken",
    "idToken",
    "apiKey",
    "apiKeySecret",
    "apiKeyIssuer",
    "bearerToken"
  ]);
const AUTH_PERMISSIONS_CONTRACT_BOUNDARY_PERMISSION_EVALUATOR_FIELDS =
  Object.freeze([
    "permissionEvaluator",
    "permissionEngine",
    "evaluatePermission",
    "roleEngine",
    "policyEngine",
    "policyEvaluator",
    "rbacEngine",
    "abacEngine",
    "permissionDecision"
  ]);
const AUTH_PERMISSIONS_CONTRACT_BOUNDARY_APPROVAL_GRANT_FIELDS =
  Object.freeze([
    "approvalDecision",
    "approvalGrant",
    "approvalGrantToken",
    "grantRuntime",
    "grantProducer",
    "runtimeGrant",
    "decisionEvaluator",
    "evaluatorResult"
  ]);
const AUTH_PERMISSIONS_CONTRACT_BOUNDARY_CONNECTOR_GRANT_FIELDS =
  Object.freeze([
    "connectorGrant",
    "connectorGrantToken",
    "connectorCredential",
    "connectorAccessToken",
    "connectorIngestionGrant"
  ]);
const AUTH_PERMISSIONS_CONTRACT_BOUNDARY_RUNTIME_AUTH_FIELDS = Object.freeze([
  "runtimeAuthorizationGrant",
  "runtimeAuthorizationToken",
  "runtimeAuthorizationHeader",
  "authorizationHeader",
  "authorizationMiddleware",
  "authzRuntime",
  "enforceRuntimeAuthorization"
]);
const AUTH_PERMISSIONS_CONTRACT_BOUNDARY_SECRET_FIELDS = Object.freeze([
  "secretVaultPath",
  "envSecretName",
  "vaultClient",
  "secretProvider",
  "secretManager",
  "dotenvPath",
  "envFilePath",
  "apiSecret",
  "privateKeyPath"
]);
const AUTH_PERMISSIONS_CONTRACT_BOUNDARY_EXTERNAL_IDP_FIELDS = Object.freeze([
  "identityProviderUrl",
  "oidcIssuer",
  "samlMetadata",
  "oauthClientId",
  "oauthClientSecret",
  "idpClient",
  "openidConfiguration",
  "jwksUri"
]);
const AUTH_PERMISSIONS_CONTRACT_BOUNDARY_KEYRING_DID_SECURE_DROP_FIELDS =
  Object.freeze([
    "keyringPath",
    "keyringProvider",
    "didDocument",
    "didResolver",
    "recipientKey",
    "secureDropPayloadPath",
    "secureDropKeyring",
    "secureDropDid",
    "secureDropCryptoImplemented",
    "secureDropTransportImplemented",
    "secureDropSendReceiveImplemented"
  ]);
const AUTH_PERMISSIONS_CONTRACT_BOUNDARY_DATABASE_STORAGE_FIELDS =
  Object.freeze([
    "databaseUrl",
    "databaseDsn",
    "dbConnectionString",
    "rlsPolicy",
    "rlsRule",
    "storageAdapter",
    "persistenceLayer",
    "migrationCommand",
    "schemaMigration",
    "auditWriter",
    "transcriptWriter"
  ]);
const AUTH_PERMISSIONS_CONTRACT_BOUNDARY_FABRIC_RUNTIME_FIELDS =
  Object.freeze([
    "fabricBusTopic",
    "fabricBrokerUrl",
    "websocketUrl",
    "httpEndpoint",
    "mcpToolName",
    "mcpServerUrl",
    "taskExecutor",
    "taskRunner",
    "runtimeEndpoint",
    "adapterRuntime"
  ]);
function authPermissionsContractBoundaryMapInputRecord(input) {
  return isPlainObjectRecord(input) ? input : null;
}
function authPermissionsContractBoundaryMapReviewedAt(inputRecord) {
  if (
    inputRecord === null ||
    !Object.prototype.hasOwnProperty.call(inputRecord, "reviewedAt")
  ) {
    return APPROVAL_PREREQUISITE_SOURCE_PREFLIGHT_DEFAULT_REVIEWED_AT;
  }

  return isUtcIsoTimestampWithMilliseconds(inputRecord.reviewedAt)
    ? inputRecord.reviewedAt
    : APPROVAL_PREREQUISITE_SOURCE_PREFLIGHT_DEFAULT_REVIEWED_AT;
}
function authPermissionsContractBoundaryMapInputMalformed(inputRecord) {
  return (
    inputRecord === null ||
    (Object.prototype.hasOwnProperty.call(inputRecord, "reviewedAt") &&
      !isUtcIsoTimestampWithMilliseconds(inputRecord.reviewedAt)) ||
    (Object.prototype.hasOwnProperty.call(inputRecord, "boundaryEntries") &&
      !Array.isArray(inputRecord.boundaryEntries))
  );
}
function authPermissionsContractBoundaryMapInputEntries(inputRecord) {
  return Array.isArray(inputRecord?.boundaryEntries)
    ? inputRecord.boundaryEntries
    : null;
}
function authPermissionsContractBoundaryMapContainsTrue(value) {
  if (value === true) {
    return true;
  }

  if (Array.isArray(value)) {
    return value.some(authPermissionsContractBoundaryMapContainsTrue);
  }

  if (isPlainObjectRecord(value)) {
    return Object.values(value).some(
      authPermissionsContractBoundaryMapContainsTrue
    );
  }

  return false;
}
function authPermissionsContractBoundaryMapHasTrueFieldDeep(value, fields) {
  if (Array.isArray(value)) {
    return value.some((item) =>
      authPermissionsContractBoundaryMapHasTrueFieldDeep(item, fields)
    );
  }

  if (!isPlainObjectRecord(value)) {
    return false;
  }

  for (const [key, nested] of Object.entries(value)) {
    if (fields.includes(key) && nested === true) {
      return true;
    }

    if (authPermissionsContractBoundaryMapHasTrueFieldDeep(nested, fields)) {
      return true;
    }
  }

  return false;
}
function authPermissionsContractBoundaryMapHasPresentFieldDeep(value, fields) {
  if (Array.isArray(value)) {
    return value.some((item) =>
      authPermissionsContractBoundaryMapHasPresentFieldDeep(item, fields)
    );
  }

  if (!isPlainObjectRecord(value)) {
    return false;
  }

  for (const [key, nested] of Object.entries(value)) {
    if (
      key === "explicitBlockedAuthorizationFlags" ||
      key === "unsafeAuthPermissionsRuntimeFlags"
    ) {
      continue;
    }

    if (fields.includes(key)) {
      return true;
    }

    if (authPermissionsContractBoundaryMapHasPresentFieldDeep(nested, fields)) {
      return true;
    }
  }

  return false;
}
function authPermissionsContractBoundaryMapContainsEntryIssue(
  entries,
  predicate
) {
  return entries !== null && entries.some((entry) => predicate(entry));
}
function authPermissionsContractBoundaryMapMissingRequiredField(entry) {
  if (!isPlainObjectRecord(entry)) {
    return true;
  }

  return AUTH_PERMISSIONS_CONTRACT_BOUNDARY_REQUIRED_FIELDS.some(
    (field) => !Object.prototype.hasOwnProperty.call(entry, field)
  );
}
function authPermissionsContractBoundaryMapEntryMalformed(entry) {
  if (!isPlainObjectRecord(entry)) {
    return true;
  }

  return (
    typeof entry.boundaryId !== "string" ||
    !Array.isArray(entry.allowedCurrentBehavior) ||
    !Array.isArray(entry.forbiddenCurrentBehavior) ||
    typeof entry.requiredFutureContractBeforeImplementation !== "string" ||
    typeof entry.requiredFutureAuthorizationPhaseBeforeRuntime !== "string" ||
    typeof entry.identitySubjectNotes !== "string" ||
    typeof entry.rolePermissionExpectation !== "string" ||
    typeof entry.consentApprovalExpectation !== "string" ||
    typeof entry.revocationExpectation !== "string" ||
    typeof entry.auditSubjectExpectation !== "string" ||
    typeof entry.locusRoleDescription !== "string" ||
    typeof entry.multiverseRoleDescription !== "string" ||
    typeof entry.fabricRoleDescription !== "string" ||
    typeof entry.secureDropRoleDescription !== "string" ||
    !isPlainObjectRecord(entry.explicitBlockedAuthorizationFlags) ||
    !isPlainObjectRecord(entry.unsafeAuthPermissionsRuntimeFlags) ||
    entry.nonAuthorizingProof !== true
  );
}
function authPermissionsContractBoundaryMapAuthorizationFlagEnabled(value) {
  if (!isPlainObjectRecord(value)) {
    return false;
  }

  return (
    (isPlainObjectRecord(value.explicitBlockedAuthorizationFlags) &&
      Object.values(value.explicitBlockedAuthorizationFlags).some(
        (flag) => flag !== false
      )) ||
    AUTH_PERMISSIONS_CONTRACT_BOUNDARY_AUTHORIZATION_FIELDS.some(
      (field) => value[field] === true
    )
  );
}
function authPermissionsContractBoundaryMapUnsafeFlagEnabled(value) {
  if (!isPlainObjectRecord(value)) {
    return false;
  }

  return (
    (isPlainObjectRecord(value.unsafeAuthPermissionsRuntimeFlags) &&
      Object.values(value.unsafeAuthPermissionsRuntimeFlags).some(
        (flag) => flag !== false
      )) ||
    authPermissionsContractBoundaryMapHasTrueFieldDeep(
      value,
      AUTH_PERMISSIONS_CONTRACT_BOUNDARY_UNSAFE_FIELDS
    )
  );
}
function authPermissionsContractBoundaryMapHasUnknownTopLevelField(
  inputRecord
) {
  if (inputRecord === null) {
    return false;
  }

  return Object.keys(inputRecord).some(
    (field) =>
      !AUTH_PERMISSIONS_CONTRACT_BOUNDARY_ALLOWED_TOP_LEVEL_FIELDS.includes(
        field
      )
  );
}
function authPermissionsContractBoundaryMapCanonical(entries) {
  if (entries === null) {
    return true;
  }

  return (
    JSON.stringify(entries) ===
    JSON.stringify(authPermissionsContractBoundaryMapEntries())
  );
}
function authPermissionsContractBoundaryMapInputClassification(inputRecord) {
  if (authPermissionsContractBoundaryMapInputMalformed(inputRecord)) {
    return MALFORMED_AUTH_PERMISSIONS_CONTRACT_BOUNDARY_MAP_CLASSIFICATION;
  }

  const entries = authPermissionsContractBoundaryMapInputEntries(inputRecord);

  if (
    authPermissionsContractBoundaryMapContainsEntryIssue(
      entries,
      authPermissionsContractBoundaryMapMissingRequiredField
    )
  ) {
    return "missing_required_auth_permissions_contract_boundary_entry_rejected";
  }

  if (
    authPermissionsContractBoundaryMapContainsEntryIssue(
      entries,
      (entry) =>
        !AUTH_PERMISSIONS_CONTRACT_BOUNDARY_FAMILIES.includes(
          entry.boundaryFamily
        )
    )
  ) {
    return "unknown_boundary_family_auth_permissions_contract_boundary_map_input_rejected";
  }

  if (
    authPermissionsContractBoundaryMapContainsEntryIssue(
      entries,
      (entry) =>
        !AUTH_PERMISSIONS_CONTRACT_BOUNDARY_RELATED_SYSTEMS.includes(
          entry.relatedSystem
        )
    )
  ) {
    return "unknown_related_system_auth_permissions_contract_boundary_map_input_rejected";
  }

  if (
    authPermissionsContractBoundaryMapContainsEntryIssue(
      entries,
      (entry) =>
        !AUTH_PERMISSIONS_CONTRACT_BOUNDARY_STATUSES.includes(
          entry.currentStatus
        )
    )
  ) {
    return "unknown_current_status_auth_permissions_contract_boundary_map_input_rejected";
  }

  if (
    authPermissionsContractBoundaryMapContainsEntryIssue(
      entries,
      authPermissionsContractBoundaryMapEntryMalformed
    )
  ) {
    return MALFORMED_AUTH_PERMISSIONS_CONTRACT_BOUNDARY_MAP_CLASSIFICATION;
  }

  if (
    authPermissionsContractBoundaryMapContainsEntryIssue(
      entries,
      authPermissionsContractBoundaryMapAuthorizationFlagEnabled
    ) ||
    authPermissionsContractBoundaryMapAuthorizationFlagEnabled(inputRecord)
  ) {
    return "authorization_flags_enabled_auth_permissions_contract_boundary_map_input_rejected";
  }

  if (
    authPermissionsContractBoundaryMapHasTrueFieldDeep(inputRecord, [
      "reportRunsChecks"
    ])
  ) {
    return "report_runs_checks_true_auth_permissions_contract_boundary_map_input_rejected";
  }

  if (
    authPermissionsContractBoundaryMapHasTrueFieldDeep(
      inputRecord,
      AUTH_PERMISSIONS_CONTRACT_BOUNDARY_AUTHORIZATION_FIELDS
    )
  ) {
    return "runtime_authorization_attempt_auth_permissions_contract_boundary_map_input_rejected";
  }

  if (
    authPermissionsContractBoundaryMapHasTrueFieldDeep(
      inputRecord,
      AUTH_PERMISSIONS_CONTRACT_BOUNDARY_COMMAND_FIELDS
    )
  ) {
    return "command_exposure_attempt_auth_permissions_contract_boundary_map_input_rejected";
  }

  if (
    authPermissionsContractBoundaryMapHasTrueFieldDeep(
      inputRecord,
      AUTH_PERMISSIONS_CONTRACT_BOUNDARY_BLOCKED_CLI_BYPASS_FIELDS
    )
  ) {
    return "blocked_cli_bypass_attempt_auth_permissions_contract_boundary_map_input_rejected";
  }

  if (
    authPermissionsContractBoundaryMapHasPresentFieldDeep(
      inputRecord,
      AUTH_PERMISSIONS_CONTRACT_BOUNDARY_LOGIN_SESSION_TOKEN_FIELDS
    )
  ) {
    return "hidden_login_session_token_api_key_semantics_auth_permissions_contract_boundary_map_input_rejected";
  }

  if (
    authPermissionsContractBoundaryMapHasPresentFieldDeep(
      inputRecord,
      AUTH_PERMISSIONS_CONTRACT_BOUNDARY_PERMISSION_EVALUATOR_FIELDS
    )
  ) {
    return "hidden_permission_evaluator_semantics_auth_permissions_contract_boundary_map_input_rejected";
  }

  if (
    authPermissionsContractBoundaryMapHasPresentFieldDeep(
      inputRecord,
      AUTH_PERMISSIONS_CONTRACT_BOUNDARY_APPROVAL_GRANT_FIELDS
    )
  ) {
    return "hidden_approval_decision_grant_semantics_auth_permissions_contract_boundary_map_input_rejected";
  }

  if (
    authPermissionsContractBoundaryMapHasPresentFieldDeep(
      inputRecord,
      AUTH_PERMISSIONS_CONTRACT_BOUNDARY_CONNECTOR_GRANT_FIELDS
    )
  ) {
    return "hidden_connector_grant_semantics_auth_permissions_contract_boundary_map_input_rejected";
  }

  if (
    authPermissionsContractBoundaryMapHasPresentFieldDeep(
      inputRecord,
      AUTH_PERMISSIONS_CONTRACT_BOUNDARY_RUNTIME_AUTH_FIELDS
    )
  ) {
    return "hidden_runtime_authorization_semantics_auth_permissions_contract_boundary_map_input_rejected";
  }

  if (
    authPermissionsContractBoundaryMapHasPresentFieldDeep(
      inputRecord,
      AUTH_PERMISSIONS_CONTRACT_BOUNDARY_SECRET_FIELDS
    )
  ) {
    return "hidden_secret_env_vault_access_semantics_auth_permissions_contract_boundary_map_input_rejected";
  }

  if (
    authPermissionsContractBoundaryMapHasPresentFieldDeep(
      inputRecord,
      AUTH_PERMISSIONS_CONTRACT_BOUNDARY_EXTERNAL_IDP_FIELDS
    )
  ) {
    return "hidden_external_identity_provider_integration_semantics_auth_permissions_contract_boundary_map_input_rejected";
  }

  if (
    authPermissionsContractBoundaryMapHasPresentFieldDeep(
      inputRecord,
      AUTH_PERMISSIONS_CONTRACT_BOUNDARY_KEYRING_DID_SECURE_DROP_FIELDS
    )
  ) {
    return "hidden_keyring_did_secure_drop_implementation_semantics_auth_permissions_contract_boundary_map_input_rejected";
  }

  if (
    authPermissionsContractBoundaryMapHasPresentFieldDeep(
      inputRecord,
      AUTH_PERMISSIONS_CONTRACT_BOUNDARY_DATABASE_STORAGE_FIELDS
    )
  ) {
    return "hidden_database_storage_rls_persistence_semantics_auth_permissions_contract_boundary_map_input_rejected";
  }

  if (
    authPermissionsContractBoundaryMapHasPresentFieldDeep(
      inputRecord,
      AUTH_PERMISSIONS_CONTRACT_BOUNDARY_FABRIC_RUNTIME_FIELDS
    )
  ) {
    return "hidden_fabric_websocket_http_mcp_task_runtime_semantics_auth_permissions_contract_boundary_map_input_rejected";
  }

  if (
    authPermissionsContractBoundaryMapUnsafeFlagEnabled(inputRecord) ||
    authPermissionsContractBoundaryMapContainsEntryIssue(
      entries,
      authPermissionsContractBoundaryMapUnsafeFlagEnabled
    )
  ) {
    return "unsafe_identity_authentication_authorization_session_token_api_key_role_permission_grant_secret_delegation_revocation_runtime_flags_auth_permissions_contract_boundary_map_input_rejected";
  }

  if (
    authPermissionsContractBoundaryMapContainsEntryIssue(entries, (entry) =>
      authPermissionsContractBoundaryMapContainsTrue(entry?.runtimeEffect)
    ) ||
    authPermissionsContractBoundaryMapContainsTrue(inputRecord?.runtimeEffect)
  ) {
    return "nested_unsafe_flags_auth_permissions_contract_boundary_map_input_rejected";
  }

  if (authPermissionsContractBoundaryMapHasUnknownTopLevelField(inputRecord)) {
    return "unknown_top_level_field_auth_permissions_contract_boundary_map_input_rejected";
  }

  if (!authPermissionsContractBoundaryMapCanonical(entries)) {
    return "noncanonical_auth_permissions_contract_boundary_map_input_rejected";
  }

  return VALID_AUTH_PERMISSIONS_CONTRACT_BOUNDARY_MAP_CLASSIFICATION;
}
function authPermissionsContractBoundaryMapAuthorizationFlags() {
  return {
    identityRuntimeAuthorizationGranted: false,
    authenticationRuntimeAuthorizationGranted: false,
    authorizationRuntimeAuthorizationGranted: false,
    rolePermissionRuntimeAuthorizationGranted: false,
    operatorConsentRuntimeAuthorizationGranted: false,
    approvalPrerequisiteRuntimeAuthorizationGranted: false,
    runtimeCommandAuthorizationGranted: false,
    connectorGrantAuthorizationGranted: false,
    secretAccessAuthorizationGranted: false,
    delegationAuthorizationGranted: false,
    revocationAuthorizationGranted: false,
    auditSubjectRuntimeAuthorizationGranted: false,
    fabricRuntimeAuthorizationGranted: false,
    mcpToolExposureAuthorizationGranted: false,
    taskExecutionAuthorizationGranted: false,
    secureDropAuthorizationGranted: false,
    databaseStorageAuthorizationGranted: false,
    commandExposureAuthorizationGranted: false,
    approvalDecisionProduced: false,
    approvalGrantProduced: false,
    connectorGrantProduced: false,
    authorizesRuntime: false
  };
}
function authPermissionsContractBoundaryMapUnsafeFlags() {
  return Object.fromEntries(
    AUTH_PERMISSIONS_CONTRACT_BOUNDARY_UNSAFE_FIELDS.map((field) => [
      field,
      false
    ])
  );
}
function authPermissionsContractBoundaryMapEntry(definition) {
  return {
    boundaryId: definition.boundaryId,
    boundaryFamily: definition.boundaryFamily,
    relatedSystem: definition.relatedSystem,
    currentStatus: definition.currentStatus,
    allowedCurrentBehavior: definition.allowedCurrentBehavior,
    forbiddenCurrentBehavior: authPermissionsContractBoundaryMapForbiddenBehavior(),
    requiredFutureContractBeforeImplementation:
      definition.requiredFutureContractBeforeImplementation,
    requiredFutureAuthorizationPhaseBeforeRuntime:
      definition.requiredFutureAuthorizationPhaseBeforeRuntime,
    identitySubjectNotes: definition.identitySubjectNotes,
    rolePermissionExpectation: definition.rolePermissionExpectation,
    consentApprovalExpectation: definition.consentApprovalExpectation,
    revocationExpectation: definition.revocationExpectation,
    auditSubjectExpectation: definition.auditSubjectExpectation,
    locusRoleDescription: definition.locusRoleDescription,
    multiverseRoleDescription: definition.multiverseRoleDescription,
    fabricRoleDescription: definition.fabricRoleDescription,
    secureDropRoleDescription: definition.secureDropRoleDescription,
    productionReadinessAreaReference: {
      phase: "5.48",
      areaNumber: 4,
      areaName: "Auth & Permissions",
      sourceFixture:
        "tests/fixtures/host-policy/phase5-48/production-readiness-coverage-matrix.json",
      sourceStatus: "deferred",
      representedByPhase562: true,
      authorizesRuntime: false
    },
    phase559FabricAwareApiBackendReference: {
      phase: "5.59",
      sourceFixture:
        "tests/fixtures/host-policy/phase5-59/fabric-aware-api-backend-contract-boundary-map.json",
      fabricBoundaryReferenced: true,
      implementsFabricRuntime: false,
      authorizesRuntime: false
    },
    phase560EncodedHandoffConformanceReference: {
      phase: "5.60",
      sourceFixture:
        "tests/fixtures/host-policy/phase5-60/inter-agent-encoded-handoff-conformance.json",
      encodedHandoffConformanceReferenced: true,
      implementsEncodedHandoffRuntime: false,
      authorizesRuntime: false
    },
    phase561DatabaseStorageContractBoundaryReference: {
      phase: "5.61",
      sourceFixture:
        "tests/fixtures/host-policy/phase5-61/database-storage-contract-boundary-map.json",
      databaseStorageBoundaryReferenced: true,
      implementsDatabaseStorageRuntime: false,
      authorizesRuntime: false
    },
    authPermissionsBoundaryMetadataOnly: true,
    noIdentityVerificationPerformed: true,
    explicitBlockedAuthorizationFlags:
      authPermissionsContractBoundaryMapAuthorizationFlags(),
    unsafeAuthPermissionsRuntimeFlags:
      authPermissionsContractBoundaryMapUnsafeFlags(),
    nonAuthorizingProof: true,
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}
function authPermissionsContractBoundaryMapDefinitions() {
  const currentAuthorization =
    "Requires a future auth, permission, runtime, command exposure, connector, storage, secrets, audit, and process-control authorization phase before any executable behavior.";
  const noConsumerRole =
    "No current role; future consumers may inspect metadata only.";
  const contentFabricSecureDrop =
    "Secure Drop recipient identity, keyring, DID, and access semantics remain canonically owned by content-fabric; Ardyn records metadata references only and implements no crypto, transport, stego, send/receive, inbox polling, file selection, connector ingestion, secret/vault/env access, or ST3GG wrapping.";

  return [
    {
      boundaryId: "phase5-62.ardyn.operator-identity.identity-boundary",
      boundaryFamily: "identity_contract",
      relatedSystem: "ardyn",
      currentStatus: "metadata_only",
      allowedCurrentBehavior: [
        "Describe future operator identity subject requirements.",
        "Keep operator identity metadata non-verifying and non-authorizing."
      ],
      requiredFutureContractBeforeImplementation:
        "A future identity contract must define operator subject shape, verification source, trust boundary, display semantics, audit traceability, and denial states.",
      requiredFutureAuthorizationPhaseBeforeRuntime: currentAuthorization,
      identitySubjectNotes:
        "Current operator identity is planning metadata only; no login, session, token, API key, or external identity-provider verification exists.",
      rolePermissionExpectation:
        "Future operator roles must be separately contracted before any permission evaluation.",
      consentApprovalExpectation:
        "Operator consent remains metadata and cannot produce approval decisions or grants.",
      revocationExpectation:
        "Future operator identity must include revocation semantics before runtime use.",
      auditSubjectExpectation:
        "Future audit subjects must be stable and reviewable without exposing secrets.",
      locusRoleDescription: noConsumerRole,
      multiverseRoleDescription: noConsumerRole,
      fabricRoleDescription:
        "Fabric may later envelope operator subject metadata only.",
      secureDropRoleDescription: "Not applicable."
    },
    {
      boundaryId:
        "phase5-62.ardyn-subagent.subagent-identity.identity-boundary",
      boundaryFamily: "identity_contract",
      relatedSystem: "ardyn-subagent",
      currentStatus: "metadata_only",
      allowedCurrentBehavior: [
        "Describe future subagent identity subject requirements.",
        "Keep subagent identity metadata non-executing and non-delegating."
      ],
      requiredFutureContractBeforeImplementation:
        "A future subagent identity contract must define subject identity, parent task linkage, delegation limits, audit labels, and revocation behavior.",
      requiredFutureAuthorizationPhaseBeforeRuntime: currentAuthorization,
      identitySubjectNotes:
        "Subagent identity is metadata only and cannot authenticate, receive tokens, or inherit operator grants.",
      rolePermissionExpectation:
        "Future subagent permissions must be strictly scoped and never inferred from metadata.",
      consentApprovalExpectation:
        "Subagents cannot provide operator consent or approval grants.",
      revocationExpectation:
        "Future subagent identity must be revocable independently of operator metadata.",
      auditSubjectExpectation:
        "Future subagent audit subjects must remain traceable to explicit review metadata.",
      locusRoleDescription: noConsumerRole,
      multiverseRoleDescription: noConsumerRole,
      fabricRoleDescription:
        "Fabric may later carry subagent subject references only.",
      secureDropRoleDescription: "Not applicable."
    },
    {
      boundaryId:
        "phase5-62.locus.external-harness-identity.authentication-boundary",
      boundaryFamily: "authentication_contract",
      relatedSystem: "locus",
      currentStatus: "future_contract_required",
      allowedCurrentBehavior: [
        "Describe future Locus-mediated external harness identity metadata.",
        "Keep external harness authentication as a consumer-owned future contract."
      ],
      requiredFutureContractBeforeImplementation:
        "Future external harness authentication requires a Locus-owned contract for subject proof, bridge trust, denial states, audit visibility, and no implicit Ardyn grants.",
      requiredFutureAuthorizationPhaseBeforeRuntime: currentAuthorization,
      identitySubjectNotes:
        "External harness identity through Locus is a future metadata target only.",
      rolePermissionExpectation:
        "Future harness roles must be consumer-owned and cannot grant Ardyn runtime behavior.",
      consentApprovalExpectation:
        "Locus bridge metadata cannot substitute for operator consent or approval.",
      revocationExpectation:
        "Future bridge authentication must include revocation before any interop.",
      auditSubjectExpectation:
        "Future external harness subjects must remain visible in review artifacts.",
      locusRoleDescription:
        "Locus may later own external harness identity display and verification.",
      multiverseRoleDescription: noConsumerRole,
      fabricRoleDescription:
        "Fabric may later envelope bridge identity references only.",
      secureDropRoleDescription: "Not applicable."
    },
    {
      boundaryId:
        "phase5-62.locus.control-surface-permission.permission-boundary",
      boundaryFamily: "permission_contract",
      relatedSystem: "locus",
      currentStatus: "future_contract_required",
      allowedCurrentBehavior: [
        "Describe future Locus control-surface permission metadata.",
        "Keep current control surfaces display-only and non-interactive."
      ],
      requiredFutureContractBeforeImplementation:
        "Future Locus control permissions require a consumer-owned contract for available actions, disabled states, approval prerequisites, audit traceability, and command-blocked defaults.",
      requiredFutureAuthorizationPhaseBeforeRuntime: currentAuthorization,
      identitySubjectNotes:
        "No authenticated Locus subject exists in Ardyn.",
      rolePermissionExpectation:
        "Future Locus control permissions must be explicit and color-independent in display surfaces.",
      consentApprovalExpectation:
        "Control-surface display cannot approve runtime or expose commands.",
      revocationExpectation:
        "Future Locus permissions must define revocation before interactivity.",
      auditSubjectExpectation:
        "Future control actions must carry explicit subject metadata.",
      locusRoleDescription:
        "Locus may later own display and permission checks for its controls.",
      multiverseRoleDescription: noConsumerRole,
      fabricRoleDescription:
        "Fabric may later coordinate control metadata envelopes only.",
      secureDropRoleDescription: "Not applicable."
    },
    {
      boundaryId:
        "phase5-62.multiverse.citizen-adapter-permission.permission-boundary",
      boundaryFamily: "permission_contract",
      relatedSystem: "multiverse",
      currentStatus: "future_contract_required",
      allowedCurrentBehavior: [
        "Describe future Multiverse citizen and adapter candidate permission metadata.",
        "Keep Multiverse targets as consumer-owned planning metadata only."
      ],
      requiredFutureContractBeforeImplementation:
        "Future Multiverse permissions require a consumer-owned contract for citizen subjects, adapter candidates, task wrappers, denial states, and audit evidence.",
      requiredFutureAuthorizationPhaseBeforeRuntime: currentAuthorization,
      identitySubjectNotes:
        "No Multiverse citizen or adapter identity is authenticated by Ardyn.",
      rolePermissionExpectation:
        "Future Multiverse permissions must not grant connector or adapter runtime from Ardyn metadata.",
      consentApprovalExpectation:
        "Multiverse metadata cannot produce Ardyn approval decisions or grants.",
      revocationExpectation:
        "Future citizen and adapter permissions must be revocable before runtime.",
      auditSubjectExpectation:
        "Future Multiverse subjects must remain traceable in review metadata.",
      locusRoleDescription: noConsumerRole,
      multiverseRoleDescription:
        "Multiverse may later own citizen and adapter permission checks.",
      fabricRoleDescription:
        "Fabric may later coordinate Multiverse permission references only.",
      secureDropRoleDescription: "Not applicable."
    },
    {
      boundaryId:
        "phase5-62.multiverse.role-capability-badge.role-boundary",
      boundaryFamily: "role_contract",
      relatedSystem: "multiverse",
      currentStatus: "metadata_only",
      allowedCurrentBehavior: [
        "Describe future role and capability badge metadata.",
        "Keep role labels non-authorizing and display-only."
      ],
      requiredFutureContractBeforeImplementation:
        "A future role contract must distinguish visible role labels from executable permissions, grants, connector access, and runtime authorization.",
      requiredFutureAuthorizationPhaseBeforeRuntime: currentAuthorization,
      identitySubjectNotes:
        "Role labels do not verify identity or authenticate subjects.",
      rolePermissionExpectation:
        "Future role labels must never imply permissions without a separate evaluator contract.",
      consentApprovalExpectation:
        "Role labels cannot represent consent, approval decisions, or grants.",
      revocationExpectation:
        "Future role metadata must define revocation and stale badge display.",
      auditSubjectExpectation:
        "Future role assertions must remain auditable as metadata claims.",
      locusRoleDescription: noConsumerRole,
      multiverseRoleDescription:
        "Multiverse may later display role metadata without enabling actions.",
      fabricRoleDescription:
        "Fabric may later envelope role references only.",
      secureDropRoleDescription: "Not applicable."
    },
    {
      boundaryId:
        "phase5-62.repo-family.fabric-envelope-authorization.authorization-boundary",
      boundaryFamily: "authorization_contract",
      relatedSystem: "repo-family",
      currentStatus: "future_contract_required",
      allowedCurrentBehavior: [
        "Describe future Fabric coordination-envelope authorization metadata.",
        "Keep Fabric authorization as a future cross-repo contract only."
      ],
      requiredFutureContractBeforeImplementation:
        "Future Fabric authorization requires a cross-repo contract for envelope subjects, scopes, denial semantics, audit digests, replay handling, and explicit runtime authorization gates.",
      requiredFutureAuthorizationPhaseBeforeRuntime: currentAuthorization,
      identitySubjectNotes:
        "Fabric envelope subjects are metadata references only.",
      rolePermissionExpectation:
        "Fabric authorization metadata cannot grant bus, broker, transport, connector, or task runtime.",
      consentApprovalExpectation:
        "Fabric envelopes cannot substitute for operator consent or Ardyn approval.",
      revocationExpectation:
        "Future Fabric authorization must define revocation and stale-envelope handling.",
      auditSubjectExpectation:
        "Future Fabric envelopes must preserve subject traceability.",
      locusRoleDescription:
        "Locus may later inspect Fabric authorization metadata only.",
      multiverseRoleDescription:
        "Multiverse may later inspect Fabric authorization metadata only.",
      fabricRoleDescription:
        "Fabric remains a future coordination envelope, not a runtime bus.",
      secureDropRoleDescription: "Not applicable."
    },
    {
      boundaryId: "phase5-62.ardyn.mcp-tool-access.permission-boundary",
      boundaryFamily: "permission_contract",
      relatedSystem: "ardyn",
      currentStatus: "blocked",
      allowedCurrentBehavior: [
        "Describe future MCP/tool access permission prerequisites.",
        "Keep MCP/tool access fully blocked in Ardyn."
      ],
      requiredFutureContractBeforeImplementation:
        "Future MCP/tool access requires a permission contract covering subject identity, allowed tools, denial states, audit, revocation, and runtime isolation.",
      requiredFutureAuthorizationPhaseBeforeRuntime: currentAuthorization,
      identitySubjectNotes:
        "No MCP/tool subject is authenticated or authorized by Ardyn.",
      rolePermissionExpectation:
        "Future MCP permissions must be explicit and cannot be inferred from fixture metadata.",
      consentApprovalExpectation:
        "No tool access can be approved by current metadata.",
      revocationExpectation:
        "Future MCP/tool grants must be revocable and auditable.",
      auditSubjectExpectation:
        "Future tool calls must carry a stable subject and approval record.",
      locusRoleDescription: noConsumerRole,
      multiverseRoleDescription: noConsumerRole,
      fabricRoleDescription:
        "Fabric may later reference MCP/tool permissions only as metadata.",
      secureDropRoleDescription: "Not applicable."
    },
    {
      boundaryId:
        "phase5-62.repo-family.connector-grant.connector-grant-boundary",
      boundaryFamily: "connector_grant_boundary",
      relatedSystem: "repo-family",
      currentStatus: "blocked",
      allowedCurrentBehavior: [
        "Describe future connector grant prerequisites.",
        "Keep connector grants unavailable and non-authorizing."
      ],
      requiredFutureContractBeforeImplementation:
        "Future connector grants require explicit subject identity, connector scope, secret handling, approval record, revocation, and audit contract.",
      requiredFutureAuthorizationPhaseBeforeRuntime: currentAuthorization,
      identitySubjectNotes:
        "No connector subject or credential exists in Ardyn.",
      rolePermissionExpectation:
        "Future connector permissions must be explicitly scoped and denied by default.",
      consentApprovalExpectation:
        "Connector grants require future operator consent and approval records.",
      revocationExpectation:
        "Future connector grants must be revocable before use.",
      auditSubjectExpectation:
        "Future connector grant attempts must record subject and scope.",
      locusRoleDescription:
        "Locus may later display connector grant status metadata only.",
      multiverseRoleDescription:
        "Multiverse may later display connector candidate metadata only.",
      fabricRoleDescription:
        "Fabric may later coordinate connector grant metadata only.",
      secureDropRoleDescription: "Not applicable."
    },
    {
      boundaryId:
        "phase5-62.ardyn.runtime-command-authorization.runtime-authorization-boundary",
      boundaryFamily: "runtime_authorization_boundary",
      relatedSystem: "ardyn",
      currentStatus: "blocked",
      allowedCurrentBehavior: [
        "Describe future runtime command authorization prerequisites.",
        "Keep runtime commands default-blocked with zero stdout on rejection."
      ],
      requiredFutureContractBeforeImplementation:
        "Future runtime command authorization requires explicit subject identity, consent, approval prerequisite records, command exposure authorization, revocation, and audit policy.",
      requiredFutureAuthorizationPhaseBeforeRuntime: currentAuthorization,
      identitySubjectNotes:
        "No runtime command subject is authenticated or authorized.",
      rolePermissionExpectation:
        "Future command permissions must be explicit and command-specific.",
      consentApprovalExpectation:
        "Current metadata cannot authorize runtime commands or approval grants.",
      revocationExpectation:
        "Future command authorization must define revocation before execution.",
      auditSubjectExpectation:
        "Future runtime command attempts must be subject-traceable.",
      locusRoleDescription:
        "Locus may later display blocked command status metadata only.",
      multiverseRoleDescription:
        "Multiverse may later display blocked task capability status only.",
      fabricRoleDescription:
        "Fabric may later envelope command authorization references only.",
      secureDropRoleDescription: "Not applicable."
    },
    {
      boundaryId:
        "phase5-62.ardyn.approval-prerequisite-metadata.approval-prerequisite-boundary",
      boundaryFamily: "approval_prerequisite_contract",
      relatedSystem: "ardyn",
      currentStatus: "metadata_only",
      allowedCurrentBehavior: [
        "Describe approval-prerequisite metadata boundaries.",
        "Keep prerequisite metadata necessary but not sufficient for runtime."
      ],
      requiredFutureContractBeforeImplementation:
        "Future approval prerequisites require an explicit source contract, freshness, denial semantics, subject identity, and non-forgeable audit references.",
      requiredFutureAuthorizationPhaseBeforeRuntime: currentAuthorization,
      identitySubjectNotes:
        "Approval prerequisite metadata does not authenticate an operator.",
      rolePermissionExpectation:
        "Prerequisite records cannot grant permissions without a future evaluator.",
      consentApprovalExpectation:
        "Prerequisite metadata is not an approval decision or grant.",
      revocationExpectation:
        "Future prerequisites must expire or revoke cleanly.",
      auditSubjectExpectation:
        "Future prerequisite records must identify source and subject.",
      locusRoleDescription:
        "Locus may later display prerequisite status metadata only.",
      multiverseRoleDescription:
        "Multiverse may later display prerequisite status metadata only.",
      fabricRoleDescription:
        "Fabric may later carry prerequisite references only.",
      secureDropRoleDescription: "Not applicable."
    },
    {
      boundaryId:
        "phase5-62.ardyn.approval-decision-grant.authorization-boundary",
      boundaryFamily: "authorization_contract",
      relatedSystem: "ardyn",
      currentStatus: "blocked",
      allowedCurrentBehavior: [
        "Describe future approval decision and grant boundaries.",
        "Keep current approval decision and grant behavior unimplemented."
      ],
      requiredFutureContractBeforeImplementation:
        "Future approval decisions and grants require a separate evaluator contract, subject identity, denial handling, revocation, audit trail, and runtime enablement approval.",
      requiredFutureAuthorizationPhaseBeforeRuntime: currentAuthorization,
      identitySubjectNotes:
        "No authenticated approval decision subject exists.",
      rolePermissionExpectation:
        "Approval grants cannot be inferred from roles or metadata.",
      consentApprovalExpectation:
        "Current metadata cannot decide, grant, or expose commands.",
      revocationExpectation:
        "Future grants must define expiry and revocation.",
      auditSubjectExpectation:
        "Future grants must bind operator, evaluator, and command subject metadata.",
      locusRoleDescription:
        "Locus may later display approval status metadata only.",
      multiverseRoleDescription:
        "Multiverse may later display approval status metadata only.",
      fabricRoleDescription:
        "Fabric may later envelope approval references only.",
      secureDropRoleDescription: "Not applicable."
    },
    {
      boundaryId: "phase5-62.ardyn.operator_consent.operator_consent_boundary",
      boundaryFamily: "operator_consent_contract",
      relatedSystem: "ardyn",
      currentStatus: "metadata_only",
      allowedCurrentBehavior: [
        "Describe future operator consent metadata requirements.",
        "Keep consent metadata non-executable and non-granting."
      ],
      requiredFutureContractBeforeImplementation:
        "Future operator consent requires subject identity, explicit scope, duration, revocation, denial, audit, and UI display requirements before any runtime use.",
      requiredFutureAuthorizationPhaseBeforeRuntime: currentAuthorization,
      identitySubjectNotes:
        "Current consent metadata does not verify the operator.",
      rolePermissionExpectation:
        "Consent cannot imply role, permission, connector, or runtime access.",
      consentApprovalExpectation:
        "Consent metadata remains separate from approval decisions and grants.",
      revocationExpectation:
        "Future consent must be revocable and time-bound.",
      auditSubjectExpectation:
        "Future consent must be traceable to a reviewable subject.",
      locusRoleDescription:
        "Locus may later display operator consent metadata only.",
      multiverseRoleDescription: noConsumerRole,
      fabricRoleDescription:
        "Fabric may later carry consent references only.",
      secureDropRoleDescription: "Not applicable."
    },
    {
      boundaryId:
        "phase5-62.repo-family.delegation-candidate.delegation-boundary",
      boundaryFamily: "delegation_boundary",
      relatedSystem: "repo-family",
      currentStatus: "future_contract_required",
      allowedCurrentBehavior: [
        "Describe future delegation metadata requirements.",
        "Keep delegation non-executable and non-inheriting."
      ],
      requiredFutureContractBeforeImplementation:
        "Future delegation requires explicit delegator, delegate, scope, duration, revocation, audit, and no implicit runtime inheritance.",
      requiredFutureAuthorizationPhaseBeforeRuntime: currentAuthorization,
      identitySubjectNotes:
        "Delegation candidates do not authenticate or authorize delegate subjects.",
      rolePermissionExpectation:
        "Future delegation must not broaden permissions beyond explicit scope.",
      consentApprovalExpectation:
        "Delegation requires separate operator consent and approval prerequisites.",
      revocationExpectation:
        "Future delegation must be revocable before runtime.",
      auditSubjectExpectation:
        "Future delegation must preserve delegator and delegate traceability.",
      locusRoleDescription:
        "Locus may later display delegation metadata only.",
      multiverseRoleDescription:
        "Multiverse may later display delegation metadata only.",
      fabricRoleDescription:
        "Fabric may later coordinate delegation references only.",
      secureDropRoleDescription: "Not applicable."
    },
    {
      boundaryId:
        "phase5-62.repo-family.revocation-candidate.revocation-boundary",
      boundaryFamily: "revocation_boundary",
      relatedSystem: "repo-family",
      currentStatus: "future_contract_required",
      allowedCurrentBehavior: [
        "Describe future revocation metadata requirements.",
        "Keep revocation planning separate from runtime enforcement."
      ],
      requiredFutureContractBeforeImplementation:
        "Future revocation requires subject identity, grant linkage, stale state handling, audit visibility, and fail-closed runtime enforcement.",
      requiredFutureAuthorizationPhaseBeforeRuntime: currentAuthorization,
      identitySubjectNotes:
        "Revocation candidates do not authenticate or revoke live grants.",
      rolePermissionExpectation:
        "Future revocation must invalidate role, permission, connector, and runtime grants by explicit reference.",
      consentApprovalExpectation:
        "Revocation metadata cannot produce approval decisions.",
      revocationExpectation:
        "Revocation is a future contract and is not currently enforced.",
      auditSubjectExpectation:
        "Future revocation must be traceable to subject and grant metadata.",
      locusRoleDescription:
        "Locus may later display revocation metadata only.",
      multiverseRoleDescription:
        "Multiverse may later display revocation metadata only.",
      fabricRoleDescription:
        "Fabric may later coordinate revocation references only.",
      secureDropRoleDescription:
        "Secure Drop revocation remains content-fabric-owned future work."
    },
    {
      boundaryId:
        "phase5-62.content-fabric.secure-drop-recipient-keyring-did.secret-access-boundary",
      boundaryFamily: "secret_access_boundary",
      relatedSystem: "content-fabric",
      currentStatus: "future_contract_required",
      allowedCurrentBehavior: [
        "Describe future Secure Drop recipient identity, keyring, and DID reference metadata.",
        "Keep Secure Drop canonical implementation outside Ardyn."
      ],
      requiredFutureContractBeforeImplementation:
        "Future Secure Drop identity references require content-fabric-owned recipient identity, keyring, DID, consent, revocation, audit, and secret-handling contracts.",
      requiredFutureAuthorizationPhaseBeforeRuntime: currentAuthorization,
      identitySubjectNotes:
        "Secure Drop recipient identity, keyring, and DID references are metadata only.",
      rolePermissionExpectation:
        "Ardyn cannot grant Secure Drop recipient access or keyring permissions.",
      consentApprovalExpectation:
        "Secure Drop consent and approvals remain future content-fabric-owned work.",
      revocationExpectation:
        "Future Secure Drop recipient references must include revocation semantics.",
      auditSubjectExpectation:
        "Future Secure Drop references must preserve recipient traceability without exposing secrets.",
      locusRoleDescription:
        "Locus may later display Secure Drop status metadata only.",
      multiverseRoleDescription: noConsumerRole,
      fabricRoleDescription:
        "Fabric may later carry Secure Drop reference metadata only.",
      secureDropRoleDescription: contentFabricSecureDrop
    },
    {
      boundaryId:
        "phase5-62.ardyn.secret-env-vault-access.secret-access-boundary",
      boundaryFamily: "secret_access_boundary",
      relatedSystem: "ardyn",
      currentStatus: "blocked",
      allowedCurrentBehavior: [
        "Describe future secret/env/vault access prerequisites.",
        "Keep secrets, env files, vaults, and API keys inaccessible."
      ],
      requiredFutureContractBeforeImplementation:
        "Future secret access requires explicit subject identity, secret scope, storage ownership, audit, revocation, environment handling, and runtime authorization.",
      requiredFutureAuthorizationPhaseBeforeRuntime: currentAuthorization,
      identitySubjectNotes:
        "No secret access subject is authenticated or authorized.",
      rolePermissionExpectation:
        "Future secret permissions must be explicit, minimal, and denied by default.",
      consentApprovalExpectation:
        "Secret access requires separate operator consent and approval records.",
      revocationExpectation:
        "Future secret access must be revocable and rotated.",
      auditSubjectExpectation:
        "Future secret access attempts must be auditable without exposing secret values.",
      locusRoleDescription: noConsumerRole,
      multiverseRoleDescription: noConsumerRole,
      fabricRoleDescription:
        "Fabric may later reference secret access prerequisites only.",
      secureDropRoleDescription:
        "Secure Drop secret handling remains content-fabric-owned future work."
    },
    {
      boundaryId:
        "phase5-62.repo-family.audit-subject-traceability.audit-subject-boundary",
      boundaryFamily: "audit_subject_boundary",
      relatedSystem: "repo-family",
      currentStatus: "metadata_only",
      allowedCurrentBehavior: [
        "Describe future audit subject and traceability metadata.",
        "Keep audit subjects review-only without runtime audit writers."
      ],
      requiredFutureContractBeforeImplementation:
        "Future audit subjects require stable identity, action, consent, approval, revocation, and storage contracts before runtime audit persistence.",
      requiredFutureAuthorizationPhaseBeforeRuntime: currentAuthorization,
      identitySubjectNotes:
        "Audit subject metadata does not authenticate or authorize subjects.",
      rolePermissionExpectation:
        "Audit subject labels cannot grant permissions.",
      consentApprovalExpectation:
        "Audit subject metadata can reference consent and approval only after future contracts exist.",
      revocationExpectation:
        "Future audit subjects must record revoked and expired states.",
      auditSubjectExpectation:
        "Future traceability must cover operator, subagent, consumer, connector, and Secure Drop subjects without secrets.",
      locusRoleDescription:
        "Locus may later display audit subject metadata only.",
      multiverseRoleDescription:
        "Multiverse may later display audit subject metadata only.",
      fabricRoleDescription:
        "Fabric may later coordinate audit subject references only.",
      secureDropRoleDescription:
        "Secure Drop audit subjects remain content-fabric-owned future work."
    }
  ];
}
function authPermissionsContractBoundaryMapEntries() {
  return authPermissionsContractBoundaryMapDefinitions().map(
    authPermissionsContractBoundaryMapEntry
  );
}
function authPermissionsContractBoundaryMapSummary(entries) {
  const countByFamily = Object.fromEntries(
    AUTH_PERMISSIONS_CONTRACT_BOUNDARY_FAMILIES.map((family) => [
      family,
      entries.filter((entry) => entry.boundaryFamily === family).length
    ])
  );
  const countByRelatedSystem = Object.fromEntries(
    AUTH_PERMISSIONS_CONTRACT_BOUNDARY_RELATED_SYSTEMS.map((system) => [
      system,
      entries.filter((entry) => entry.relatedSystem === system).length
    ])
  );

  return {
    authPermissionsContractBoundaryMapKind:
      AUTH_PERMISSIONS_CONTRACT_BOUNDARY_MAP_KIND,
    boundaryEntryCount: entries.length,
    boundaryIds: entries.map((entry) => entry.boundaryId),
    boundaryFamilies: [...AUTH_PERMISSIONS_CONTRACT_BOUNDARY_FAMILIES],
    relatedSystems: [...AUTH_PERMISSIONS_CONTRACT_BOUNDARY_RELATED_SYSTEMS],
    currentStatusValues: [...AUTH_PERMISSIONS_CONTRACT_BOUNDARY_STATUSES],
    countByFamily,
    countByRelatedSystem,
    phase548AuthPermissionsCoverageItemRepresented: true,
    phase559FabricAwareApiBackendBoundaryReferenced: true,
    phase560EncodedHandoffConformanceReferenced: true,
    phase561DatabaseStorageContractBoundaryReferenced: true,
    authPermissionsBoundaryMetadataOnly: true,
    noIdentityVerificationPerformed: true,
    noLoginSessionTokenApiKeyRuntime: true,
    noRolePermissionEvaluatorRuntime: true,
    noApprovalDecisionGrantRuntime: true,
    noConnectorGrants: true,
    noSecretEnvVaultAccess: true,
    noDelegationRevocationRuntime: true,
    contentFabricCanonicalSecureDropOwnerOnly: true,
    allBlockedAuthorizationFlagsFalse: true,
    allUnsafeAuthPermissionsRuntimeFlagsFalse: true,
    allRuntimeEffectsFalse: true,
    allEntriesNonAuthorizing: true
  };
}
function authPermissionsContractBoundaryMapValidationRules() {
  return {
    missingRequiredFieldsFailClosed: true,
    unknownTopLevelFieldsFailClosed: true,
    unknownBoundaryFamiliesFailClosed: true,
    unknownRelatedSystemsFailClosed: true,
    unknownCurrentStatusesFailClosed: true,
    enabledAuthorizationFlagsFailClosed: true,
    reportRunsChecksTrueFailClosed: true,
    runtimeAuthorizationAttemptsFailClosed: true,
    commandExposureAttemptsFailClosed: true,
    blockedCliBypassAttemptsFailClosed: true,
    unsafeRuntimeCommandConnectorFabricWebsocketHttpMcpTaskSecureDropServiceDiscoveryScheduleFilesystemProcessFlagsFailClosed:
      true,
    unsafeIdentityAuthenticationAuthorizationSessionTokenApiKeyRolePermissionGrantSecretDelegationRevocationExecutionFlagsFailClosed:
      true,
    hiddenLoginSessionTokenApiKeySemanticsFailClosed: true,
    hiddenPermissionEvaluatorSemanticsFailClosed: true,
    hiddenApprovalDecisionGrantSemanticsFailClosed: true,
    hiddenConnectorGrantSemanticsFailClosed: true,
    hiddenRuntimeAuthorizationSemanticsFailClosed: true,
    hiddenSecretEnvVaultAccessSemanticsFailClosed: true,
    hiddenExternalIdentityProviderIntegrationSemanticsFailClosed: true,
    hiddenKeyringDidSecureDropImplementationSemanticsFailClosed: true,
    hiddenDatabaseStorageRlsPersistenceSemanticsFailClosed: true,
    hiddenFabricWebsocketHttpMcpTaskRuntimeSemanticsFailClosed: true,
    nestedUnsafeFlagsFailClosed: true,
    noncanonicalBoundaryEntriesFailClosed: true,
    validationImplementsIdentityProvider: false,
    validationImplementsAuthenticationRuntime: false,
    validationImplementsSessionRuntime: false,
    validationIssuesTokens: false,
    validationIssuesApiKeys: false,
    validationImplementsRoleEngine: false,
    validationImplementsPermissionEvaluator: false,
    validationProducesApprovalDecision: false,
    validationProducesApprovalGrant: false,
    validationProducesConnectorGrant: false,
    validationAccessesSecrets: false,
    validationImplementsDelegationRevocation: false,
    validationRunsRuntime: false
  };
}
function authPermissionsContractBoundaryMapGaps() {
  return [
    "No identity provider, login flow, session runtime, token issuer, API-key issuer, role engine, permission evaluator, or authorization evaluator exists in Ardyn.",
    "Approval decisions, approval grants, runtime command authorization, connector grants, delegation, and revocation remain blocked metadata boundaries only.",
    "Secrets, env files, vaults, keyrings, DIDs, and Secure Drop recipient identity references are not ingested; Secure Drop remains future content-fabric-owned work.",
    "Auth and permissions are not connected to database/storage, RLS, persistence, transcript/audit writes, backend API/server, Fabric runtime, websocket/http transport, MCP, or task execution.",
    "Future audit subject traceability needs explicit subject, consent, approval, revocation, storage, and display contracts before runtime."
  ];
}
function authPermissionsContractBoundaryMapState(reviewedAt) {
  const boundaryEntries = authPermissionsContractBoundaryMapEntries();

  return {
    schema: AUTH_PERMISSIONS_CONTRACT_BOUNDARY_MAP_STATE_SCHEMA,
    schemaVersion: AUTH_PERMISSIONS_CONTRACT_BOUNDARY_MAP_VERSION,
    stateKind: AUTH_PERMISSIONS_CONTRACT_BOUNDARY_MAP_KIND,
    stateMode: "review-only",
    reviewedAt,
    sourcePhaseContext: {
      phase548ProductionReadinessCoverageMatrix:
        "tests/fixtures/host-policy/phase5-48/production-readiness-coverage-matrix.json",
      phase548AuthPermissionsAreaNumber: 4,
      phase548AuthPermissionsStatus: "deferred",
      phase559FabricAwareApiBackendBoundary:
        "tests/fixtures/host-policy/phase5-59/fabric-aware-api-backend-contract-boundary-map.json",
      phase560InterAgentEncodedHandoffConformance:
        "tests/fixtures/host-policy/phase5-60/inter-agent-encoded-handoff-conformance.json",
      phase561DatabaseStorageContractBoundary:
        "tests/fixtures/host-policy/phase5-61/database-storage-contract-boundary-map.json",
      secureDropCanonicalOwner: "content-fabric",
      runtimeStillBlocked: true
    },
    boundaryEntries,
    boundaryMapSummary:
      authPermissionsContractBoundaryMapSummary(boundaryEntries),
    invalidBoundaryCasePolicy:
      authPermissionsContractBoundaryMapValidationRules(),
    topAuthPermissionsDatabaseStorageFabricApiBackendGaps:
      authPermissionsContractBoundaryMapGaps(),
    recommendedNextPhase:
      "phase-5.63-review-only-security-rls-input-sanitization-contract-boundary-map",
    authPermissionsContractBoundaryMapOnly: true,
    reviewOnly: true,
    metadataOnly: true,
    authoritative: false,
    nonAuthorizingProof: true,
    reportRunsChecks: false,
    identityProviderImplemented: false,
    authenticationRuntimeImplemented: false,
    loginFlowImplemented: false,
    sessionRuntimeImplemented: false,
    tokenIssuerImplemented: false,
    apiKeyIssuerImplemented: false,
    roleEngineImplemented: false,
    permissionEvaluatorImplemented: false,
    authorizationEvaluatorImplemented: false,
    grantProducerImplemented: false,
    approvalDecisionProduced: false,
    approvalGrantProduced: false,
    secretVaultEnvAccessEnabled: false,
    connectorGrantProduced: false,
    delegationEngineImplemented: false,
    revocationEngineImplemented: false,
    runtimeAuthorizationEnabled: false,
    policyEnforcementRuntimeImplemented: false,
    externalIdentityProviderIntegrated: false,
    keyringDidImplemented: false,
    databaseClientImplemented: false,
    databaseSchemaImplemented: false,
    databaseMigrationImplemented: false,
    rlsPolicyImplemented: false,
    storageAdapterImplemented: false,
    cacheEngineImplemented: false,
    cacheInvalidationRuntimeImplemented: false,
    transcriptWriterImplemented: false,
    auditWriterImplemented: false,
    filesystemWriteEnabled: false,
    importExportPathImplementedByArdyn: false,
    packageDistributionImplementedByArdyn: false,
    persistenceImplementedByArdyn: false,
    backendRuntimeImplementedByArdyn: false,
    apiEndpointImplementedByArdyn: false,
    serverImplementedByArdyn: false,
    websocketHttpTransportImplementedByArdyn: false,
    fabricRuntimeImplementedByArdyn: false,
    encodedHandoffRuntimeImplementedByArdyn: false,
    codecImplemented: false,
    translatorRuntimeImplemented: false,
    commandExposureEnabled: false,
    commandRuntimeControlEnabled: false,
    runtimeExecutionEnabled: false,
    databaseStorageRuntimeWritesEnabled: false,
    secretsRuntimeIngestionEnabled: false,
    mcpToolExposureEnabled: false,
    taskExecutionEnabled: false,
    secureDropImplemented: false,
    st3ggVendored: false,
    serviceDiscoveryEnabled: false,
    scheduleEnforcementEnabled: false,
    backgroundPollingEnabled: false,
    filesystemScanningEnabled: false,
    processControlEnabled: false,
    uiFrontendBrowserRenderingImplemented: false,
    blockedCliBypassEnabled: false,
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}
function authPermissionsContractBoundaryMapResult({
  reviewedAt,
  reviewedAtDefaulted,
  classification,
  accepted,
  authPermissionsContractBoundaryMap
}) {
  return {
    schema: AUTH_PERMISSIONS_CONTRACT_BOUNDARY_MAP_SCHEMA,
    schemaVersion: AUTH_PERMISSIONS_CONTRACT_BOUNDARY_MAP_VERSION,
    authPermissionsContractBoundaryMapKind:
      AUTH_PERMISSIONS_CONTRACT_BOUNDARY_MAP_KIND,
    authPermissionsContractBoundaryMapMode: "review-only",
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    authPermissionsContractBoundaryMapProduced: accepted,
    authPermissionsContractBoundaryMap,
    boundaryMapSummary: accepted
      ? authPermissionsContractBoundaryMap.boundaryMapSummary
      : null,
    boundaryEntries: accepted
      ? authPermissionsContractBoundaryMap.boundaryEntries
      : [],
    invalidBoundaryCasePolicy: accepted
      ? authPermissionsContractBoundaryMap.invalidBoundaryCasePolicy
      : authPermissionsContractBoundaryMapValidationRules(),
    topAuthPermissionsDatabaseStorageFabricApiBackendGaps: accepted
      ? authPermissionsContractBoundaryMap
          .topAuthPermissionsDatabaseStorageFabricApiBackendGaps
      : [],
    recommendedNextPhase: accepted
      ? authPermissionsContractBoundaryMap.recommendedNextPhase
      : null,
    authPermissionsContractBoundaryMapOnly: true,
    reviewOnly: true,
    metadataOnly: true,
    authoritative: false,
    nonAuthorizingProof: true,
    reportRunsChecks: false,
    identityProviderImplemented: false,
    authenticationRuntimeImplemented: false,
    loginFlowImplemented: false,
    sessionRuntimeImplemented: false,
    tokenIssuerImplemented: false,
    apiKeyIssuerImplemented: false,
    roleEngineImplemented: false,
    permissionEvaluatorImplemented: false,
    authorizationEvaluatorImplemented: false,
    grantProducerImplemented: false,
    approvalDecisionProduced: false,
    approvalGrantProduced: false,
    secretVaultEnvAccessEnabled: false,
    connectorGrantProduced: false,
    delegationEngineImplemented: false,
    revocationEngineImplemented: false,
    runtimeAuthorizationEnabled: false,
    policyEnforcementRuntimeImplemented: false,
    externalIdentityProviderIntegrated: false,
    keyringDidImplemented: false,
    databaseClientImplemented: false,
    databaseSchemaImplemented: false,
    databaseMigrationImplemented: false,
    rlsPolicyImplemented: false,
    storageAdapterImplemented: false,
    cacheEngineImplemented: false,
    cacheInvalidationRuntimeImplemented: false,
    transcriptWriterImplemented: false,
    auditWriterImplemented: false,
    filesystemWriteEnabled: false,
    importExportPathImplementedByArdyn: false,
    packageDistributionImplementedByArdyn: false,
    persistenceImplementedByArdyn: false,
    backendRuntimeImplementedByArdyn: false,
    apiEndpointImplementedByArdyn: false,
    serverImplementedByArdyn: false,
    websocketHttpTransportImplementedByArdyn: false,
    fabricRuntimeImplementedByArdyn: false,
    encodedHandoffRuntimeImplementedByArdyn: false,
    codecImplemented: false,
    translatorRuntimeImplemented: false,
    commandExposureEnabled: false,
    commandRuntimeControlEnabled: false,
    runtimeExecutionEnabled: false,
    databaseStorageRuntimeWritesEnabled: false,
    secretsRuntimeIngestionEnabled: false,
    mcpToolExposureEnabled: false,
    taskExecutionEnabled: false,
    secureDropImplemented: false,
    st3ggVendored: false,
    serviceDiscoveryEnabled: false,
    scheduleEnforcementEnabled: false,
    backgroundPollingEnabled: false,
    filesystemScanningEnabled: false,
    processControlEnabled: false,
    uiFrontendBrowserRenderingImplemented: false,
    blockedCliBypassEnabled: false,
    rejectionReasons: accepted
      ? []
      : [
          {
            classification,
            rejected: true,
            runtimeAuthorized: false,
            authPermissionsRuntimeAuthorized: false,
            commandExposureAuthorized: false,
            reportRunsChecks: false
          }
        ],
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}
export function createAuthPermissionsContractBoundaryMapForReview(input = {}) {
  const inputRecord =
    authPermissionsContractBoundaryMapInputRecord(input);
  const reviewedAt =
    authPermissionsContractBoundaryMapReviewedAt(inputRecord);
  const reviewedAtDefaulted = isReviewedAtDefaulted(inputRecord);
  const classification =
    authPermissionsContractBoundaryMapInputClassification(inputRecord);
  const accepted =
    classification ===
    VALID_AUTH_PERMISSIONS_CONTRACT_BOUNDARY_MAP_CLASSIFICATION;
  const authPermissionsContractBoundaryMap = accepted
    ? authPermissionsContractBoundaryMapState(reviewedAt)
    : null;

  return authPermissionsContractBoundaryMapResult({
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    accepted,
    authPermissionsContractBoundaryMap
  });
}