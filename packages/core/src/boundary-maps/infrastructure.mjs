// Modularization: infrastructure & data-protection boundary-map family extracted from index.mjs
// (5.63 security-RLS, 5.64 rate-limiting, 5.65 error-tracking, 5.66 availability-recovery,
//  5.67 infra/compliance-data-retention + dependency-pulled 5.76 embedded-db query).
// Public surface preserved via index.mjs re-export shims.

import { isPlainObjectRecord, isUtcIsoTimestampWithMilliseconds, isReviewedAtDefaulted } from "../internal/utils.mjs";
import {
  APPROVAL_PREREQUISITE_SOURCE_PREFLIGHT_DEFAULT_REVIEWED_AT,
  REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE,
  agentModeProfileSkillhubCapabilityBoundaryMapForbiddenBehavior,
  availabilityRecoveryBoundaryMapForbiddenBehavior,
  commandSurfaceShellBoundaryMapForbiddenBehavior,
  errorTrackingLoggingAuditIntegrityBoundaryMapForbiddenBehavior,
  externalGatewayMatrixBoundaryMapForbiddenBehavior,
  infrastructureComplianceDataRetentionBoundaryMapForbiddenBehavior,
  maintenanceGovernanceBoundaryMapForbiddenBehavior,
  operationsReliabilityBoundaryMapForbiddenBehavior,
  rateLimitingAbuseControlBoundaryMapForbiddenBehavior,
  secretsCredentialBoundaryMapForbiddenBehavior,
  securityRlsInputSanitizationBoundaryMapForbiddenBehavior,
  testingFrameworksQualityGatesBoundaryMapForbiddenBehavior,
} from "../internal/review-shared.mjs";

export const SECURITY_RLS_INPUT_SANITIZATION_CONTRACT_BOUNDARY_MAP_SCHEMA =
  "ardyn.phase-5.63.security-rls-input-sanitization-contract-boundary-map-result";
export const SECURITY_RLS_INPUT_SANITIZATION_CONTRACT_BOUNDARY_MAP_VERSION =
  "0.1.0";
export const SECURITY_RLS_INPUT_SANITIZATION_CONTRACT_BOUNDARY_MAP_KIND =
  "security-rls-input-sanitization-contract-boundary-map";
export const RATE_LIMITING_ABUSE_CONTROL_CONTRACT_BOUNDARY_MAP_SCHEMA =
  "ardyn.phase-5.64.rate-limiting-abuse-control-contract-boundary-map-result";
export const RATE_LIMITING_ABUSE_CONTROL_CONTRACT_BOUNDARY_MAP_VERSION =
  "0.1.0";
export const RATE_LIMITING_ABUSE_CONTROL_CONTRACT_BOUNDARY_MAP_KIND =
  "rate-limiting-abuse-control-contract-boundary-map";
export const ERROR_TRACKING_LOGGING_AUDIT_INTEGRITY_CONTRACT_BOUNDARY_MAP_SCHEMA =
  "ardyn.phase-5.65.error-tracking-logging-audit-integrity-contract-boundary-map-result";
export const ERROR_TRACKING_LOGGING_AUDIT_INTEGRITY_CONTRACT_BOUNDARY_MAP_VERSION =
  "0.1.0";
export const ERROR_TRACKING_LOGGING_AUDIT_INTEGRITY_CONTRACT_BOUNDARY_MAP_KIND =
  "error-tracking-logging-audit-integrity-contract-boundary-map";
export const AVAILABILITY_RECOVERY_CONTRACT_BOUNDARY_MAP_SCHEMA =
  "ardyn.phase-5.66.availability-recovery-contract-boundary-map-result";
export const AVAILABILITY_RECOVERY_CONTRACT_BOUNDARY_MAP_VERSION = "0.1.0";
export const AVAILABILITY_RECOVERY_CONTRACT_BOUNDARY_MAP_KIND =
  "availability-recovery-contract-boundary-map";
export const INFRASTRUCTURE_COMPLIANCE_DATA_RETENTION_CONTRACT_BOUNDARY_MAP_SCHEMA =
  "ardyn.phase-5.67.infrastructure-compliance-data-retention-contract-boundary-map-result";
export const INFRASTRUCTURE_COMPLIANCE_DATA_RETENTION_CONTRACT_BOUNDARY_MAP_VERSION =
  "0.1.0";
export const INFRASTRUCTURE_COMPLIANCE_DATA_RETENTION_CONTRACT_BOUNDARY_MAP_KIND =
  "infrastructure-compliance-data-retention-contract-boundary-map";
export const AGENT_MODE_PROFILE_SKILLHUB_CAPABILITY_BOUNDARY_MAP_SCHEMA =
  "ardyn.phase-5.68.agent-mode-profile-skillhub-capability-boundary-map-result";
export const AGENT_MODE_PROFILE_SKILLHUB_CAPABILITY_BOUNDARY_MAP_VERSION =
  "0.1.0";
export const AGENT_MODE_PROFILE_SKILLHUB_CAPABILITY_BOUNDARY_MAP_KIND =
  "agent-mode-profile-skillhub-capability-boundary-map";
export const TESTING_FRAMEWORKS_QUALITY_GATES_CONTRACT_BOUNDARY_MAP_SCHEMA =
  "ardyn.phase-5.69.testing-frameworks-quality-gates-contract-boundary-map-result";
export const TESTING_FRAMEWORKS_QUALITY_GATES_CONTRACT_BOUNDARY_MAP_VERSION =
  "0.1.0";
export const TESTING_FRAMEWORKS_QUALITY_GATES_CONTRACT_BOUNDARY_MAP_KIND =
  "testing-frameworks-quality-gates-contract-boundary-map";
export const OPERATIONS_RELIABILITY_CONTRACT_BOUNDARY_MAP_SCHEMA =
  "ardyn.phase-5.70.operations-reliability-contract-boundary-map-result";
export const OPERATIONS_RELIABILITY_CONTRACT_BOUNDARY_MAP_VERSION = "0.1.0";
export const OPERATIONS_RELIABILITY_CONTRACT_BOUNDARY_MAP_KIND =
  "operations-reliability-contract-boundary-map";
export const MAINTENANCE_GOVERNANCE_ADR_DEPENDENCY_POLICY_CONTRACT_BOUNDARY_MAP_SCHEMA =
  "ardyn.phase-5.71.maintenance-governance-adr-dependency-policy-contract-boundary-map-result";
export const MAINTENANCE_GOVERNANCE_ADR_DEPENDENCY_POLICY_CONTRACT_BOUNDARY_MAP_VERSION =
  "0.1.0";
export const MAINTENANCE_GOVERNANCE_ADR_DEPENDENCY_POLICY_CONTRACT_BOUNDARY_MAP_KIND =
  "maintenance-governance-adr-dependency-policy-contract-boundary-map";
export const SECRETS_MANAGEMENT_KEY_ROTATION_EXTERNAL_GATEWAY_CREDENTIAL_BOUNDARY_MAP_SCHEMA =
  "ardyn.phase-5.72.secrets-management-key-rotation-external-gateway-credential-boundary-map-result";
export const SECRETS_MANAGEMENT_KEY_ROTATION_EXTERNAL_GATEWAY_CREDENTIAL_BOUNDARY_MAP_VERSION =
  "0.1.0";
export const SECRETS_MANAGEMENT_KEY_ROTATION_EXTERNAL_GATEWAY_CREDENTIAL_BOUNDARY_MAP_KIND =
  "secrets-management-key-rotation-external-gateway-credential-boundary-map";
export const EXTERNAL_GATEWAY_MATRIX_TRANSPORT_CONTRACT_BOUNDARY_MAP_SCHEMA =
  "ardyn.phase-5.73.external-gateway-matrix-transport-contract-boundary-map-result";
export const EXTERNAL_GATEWAY_MATRIX_TRANSPORT_CONTRACT_BOUNDARY_MAP_VERSION =
  "0.1.0";
export const EXTERNAL_GATEWAY_MATRIX_TRANSPORT_CONTRACT_BOUNDARY_MAP_KIND =
  "external-gateway-matrix-transport-contract-boundary-map";
export const COMMAND_SURFACE_SHELL_PRIMITIVE_CONTRACT_BOUNDARY_MAP_SCHEMA =
  "ardyn.phase-5.74.command-surface-shell-primitive-contract-boundary-map-result";
export const COMMAND_SURFACE_SHELL_PRIMITIVE_CONTRACT_BOUNDARY_MAP_VERSION =
  "0.1.0";
export const COMMAND_SURFACE_SHELL_PRIMITIVE_CONTRACT_BOUNDARY_MAP_KIND =
  "command-surface-shell-primitive-contract-boundary-map";
export const FABRIC_CORE_CONSUMER_INTEGRATION_READINESS_BOUNDARY_UPDATE_SCHEMA =
  "ardyn.phase-5.75.fabric-core-consumer-integration-readiness-boundary-update-result";
export const FABRIC_CORE_CONSUMER_INTEGRATION_READINESS_BOUNDARY_UPDATE_VERSION =
  "0.1.0";
export const FABRIC_CORE_CONSUMER_INTEGRATION_READINESS_BOUNDARY_UPDATE_KIND =
  "fabric-core-consumer-integration-readiness-boundary-update";
export const EMBEDDED_DB_QUERY_ENGINE_PRIMITIVE_CONTRACT_BOUNDARY_MAP_SCHEMA =
  "ardyn.phase-5.76.embedded-db-query-engine-primitive-contract-boundary-map-result";
export const EMBEDDED_DB_QUERY_ENGINE_PRIMITIVE_CONTRACT_BOUNDARY_MAP_VERSION =
  "0.1.0";
export const EMBEDDED_DB_QUERY_ENGINE_PRIMITIVE_CONTRACT_BOUNDARY_MAP_KIND =
  "embedded-db-query-engine-primitive-contract-boundary-map";

const SECURITY_RLS_INPUT_SANITIZATION_CONTRACT_BOUNDARY_MAP_STATE_SCHEMA =
  "ardyn.phase-5.63.security-rls-input-sanitization-contract-boundary-map-state";
const VALID_SECURITY_RLS_INPUT_SANITIZATION_CONTRACT_BOUNDARY_MAP_CLASSIFICATION =
  "valid_security_rls_input_sanitization_contract_boundary_map_runtime_still_blocked";
const MALFORMED_SECURITY_RLS_INPUT_SANITIZATION_CONTRACT_BOUNDARY_MAP_CLASSIFICATION =
  "malformed_security_rls_input_sanitization_contract_boundary_map_input_rejected";

const SECURITY_RLS_INPUT_SANITIZATION_BOUNDARY_FAMILIES = Object.freeze([
  "input_sanitization_contract",
  "schema_validation_contract",
  "injection_prevention_contract",
  "rls_contract",
  "data_isolation_contract",
  "permission_enforcement_contract",
  "secure_transport_contract",
  "content_safety_contract",
  "dependency_security_contract",
  "secret_exposure_contract",
  "audit_integrity_contract",
  "encoded_handoff_safety_contract",
  "secure_drop_boundary_contract"
]);
const SECURITY_RLS_INPUT_SANITIZATION_BOUNDARY_RELATED_SYSTEMS =
  Object.freeze([
    "ardyn",
    "ardyn-subagent",
    "locus",
    "multiverse",
    "content-fabric",
    "repo-family"
  ]);
const SECURITY_RLS_INPUT_SANITIZATION_BOUNDARY_STATUSES = Object.freeze([
  "metadata_only",
  "blocked",
  "future_contract_required"
]);
const SECURITY_RLS_INPUT_SANITIZATION_BOUNDARY_REQUIRED_FIELDS =
  Object.freeze([
    "boundaryId",
    "boundaryFamily",
    "relatedSystem",
    "currentStatus",
    "allowedCurrentBehavior",
    "forbiddenCurrentBehavior",
    "requiredFutureContractBeforeImplementation",
    "requiredFutureAuthorizationPhaseBeforeRuntime",
    "inputSanitizationExpectation",
    "injectionPreventionExpectation",
    "rlsDataIsolationExpectation",
    "permissionEnforcementExpectation",
    "dependencySecurityToolingExpectation",
    "secureTransportExpectation",
    "auditIntegrityExpectation",
    "locusRoleDescription",
    "multiverseRoleDescription",
    "fabricRoleDescription",
    "secureDropRoleDescription",
    "explicitBlockedAuthorizationFlags",
    "unsafeSecurityRlsInputRuntimeFlags",
    "nonAuthorizingProof"
  ]);
const SECURITY_RLS_INPUT_SANITIZATION_BOUNDARY_ALLOWED_TOP_LEVEL_FIELDS =
  Object.freeze(["reviewedAt", "boundaryEntries"]);
const SECURITY_RLS_INPUT_SANITIZATION_BOUNDARY_UNSAFE_FIELDS = Object.freeze([
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
  "reportRunsChecks",
  "blockedCliBypassEnabled"
]);
const SECURITY_RLS_INPUT_SANITIZATION_BOUNDARY_AUTHORIZATION_FIELDS =
  Object.freeze([
    "runtimeAuthorized",
    "runtimeAuthorizationGranted",
    "securityRuntimeAuthorizationGranted",
    "sanitizerRuntimeAuthorizationGranted",
    "rlsRuntimeAuthorizationGranted",
    "permissionEnforcementAuthorizationGranted",
    "secureTransportAuthorizationGranted",
    "auditWriterAuthorizationGranted",
    "secretAccessAuthorizationGranted",
    "connectorGrantAuthorizationGranted",
    "fabricRuntimeAuthorizationGranted",
    "secureDropAuthorizationGranted",
    "approvalDecisionProduced",
    "approvalGrantProduced",
    "authorizesRuntime"
  ]);
const SECURITY_RLS_INPUT_SANITIZATION_BOUNDARY_COMMAND_FIELDS = Object.freeze([
  "commandExposureEnabled",
  "commandRuntimeControlEnabled",
  "commandsExposed",
  "exposesCommands",
  "runtimeCommandEnabled",
  "cliCommandExposed"
]);
const SECURITY_RLS_INPUT_SANITIZATION_BOUNDARY_BLOCKED_CLI_BYPASS_FIELDS =
  Object.freeze([
    "blockedCliBypassEnabled",
    "dryRunBypassesBlock",
    "serveRuntimeBypassEnabled",
    "bypassBlockedCommandBehavior",
    "blockedCommandOverride"
  ]);
const SECURITY_RLS_INPUT_SANITIZATION_BOUNDARY_MIDDLEWARE_FIELDS =
  Object.freeze([
    "backendApiMiddleware",
    "securityMiddleware",
    "backendSecurityMiddleware",
    "expressMiddleware",
    "fastifyPlugin",
    "apiRequestHandler",
    "httpServer",
    "serverMiddleware",
    "requestValidatorRuntime"
  ]);
const SECURITY_RLS_INPUT_SANITIZATION_BOUNDARY_DATABASE_RLS_FIELDS =
  Object.freeze([
    "databaseUrl",
    "databaseDsn",
    "dbConnectionString",
    "rlsPolicy",
    "rlsRule",
    "rlsEnforcement",
    "schemaMigration",
    "migrationCommand",
    "prismaSchema",
    "databaseSchema",
    "storageAdapter"
  ]);
const SECURITY_RLS_INPUT_SANITIZATION_BOUNDARY_SECRET_FIELDS = Object.freeze([
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
const SECURITY_RLS_INPUT_SANITIZATION_BOUNDARY_CONNECTOR_FIELDS =
  Object.freeze([
    "connectorGrant",
    "connectorCredential",
    "connectorAccessToken",
    "connectorScanner",
    "connectorIngestionGrant"
  ]);
const SECURITY_RLS_INPUT_SANITIZATION_BOUNDARY_FABRIC_RUNTIME_FIELDS =
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
const SECURITY_RLS_INPUT_SANITIZATION_BOUNDARY_SECURE_DROP_FIELDS =
  Object.freeze([
    "secureDropPayloadPath",
    "secureDropKeyring",
    "secureDropCryptoImplemented",
    "secureDropTransportImplemented",
    "secureDropStegoImplemented",
    "secureDropSendReceiveImplemented",
    "secureDropInboxPollingEnabled",
    "secureDropFileSelection",
    "st3ggPayload"
  ]);
const SECURITY_RLS_INPUT_SANITIZATION_BOUNDARY_ENCODED_HANDOFF_FIELDS =
  Object.freeze([
    "codecImplemented",
    "translatorRuntimeImplemented",
    "encoderImplemented",
    "decoderImplemented",
    "conlangGenerator",
    "semanticStegoCandidate",
    "steganographyCandidate",
    "tokenExploitationCandidate",
    "covertChannel",
    "guardrailBypass",
    "hiddenPayload"
  ]);
const SECURITY_RLS_INPUT_SANITIZATION_BOUNDARY_AUDIT_LOG_FIELDS =
  Object.freeze([
    "auditWriter",
    "auditLogWriter",
    "logWriter",
    "tamperEvidentWriter",
    "auditLogPath",
    "appendAuditLog",
    "transcriptWriter"
  ]);

function securityRlsInputSanitizationBoundaryMapInputRecord(input) {
  return isPlainObjectRecord(input) ? input : null;
}

function securityRlsInputSanitizationBoundaryMapReviewedAt(inputRecord) {
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

function securityRlsInputSanitizationBoundaryMapInputMalformed(inputRecord) {
  return (
    inputRecord === null ||
    (Object.prototype.hasOwnProperty.call(inputRecord, "reviewedAt") &&
      !isUtcIsoTimestampWithMilliseconds(inputRecord.reviewedAt)) ||
    (Object.prototype.hasOwnProperty.call(inputRecord, "boundaryEntries") &&
      !Array.isArray(inputRecord.boundaryEntries))
  );
}

function securityRlsInputSanitizationBoundaryMapInputEntries(inputRecord) {
  return Array.isArray(inputRecord?.boundaryEntries)
    ? inputRecord.boundaryEntries
    : null;
}

function securityRlsInputSanitizationBoundaryMapContainsTrue(value) {
  if (value === true) {
    return true;
  }

  if (Array.isArray(value)) {
    return value.some(securityRlsInputSanitizationBoundaryMapContainsTrue);
  }

  if (isPlainObjectRecord(value)) {
    return Object.values(value).some(
      securityRlsInputSanitizationBoundaryMapContainsTrue
    );
  }

  return false;
}

function securityRlsInputSanitizationBoundaryMapHasTrueFieldDeep(
  value,
  fields
) {
  if (Array.isArray(value)) {
    return value.some((item) =>
      securityRlsInputSanitizationBoundaryMapHasTrueFieldDeep(item, fields)
    );
  }

  if (!isPlainObjectRecord(value)) {
    return false;
  }

  for (const [key, nested] of Object.entries(value)) {
    if (fields.includes(key) && nested === true) {
      return true;
    }

    if (
      securityRlsInputSanitizationBoundaryMapHasTrueFieldDeep(nested, fields)
    ) {
      return true;
    }
  }

  return false;
}

function securityRlsInputSanitizationBoundaryMapHasPresentFieldDeep(
  value,
  fields
) {
  if (Array.isArray(value)) {
    return value.some((item) =>
      securityRlsInputSanitizationBoundaryMapHasPresentFieldDeep(item, fields)
    );
  }

  if (!isPlainObjectRecord(value)) {
    return false;
  }

  for (const [key, nested] of Object.entries(value)) {
    if (
      key === "explicitBlockedAuthorizationFlags" ||
      key === "unsafeSecurityRlsInputRuntimeFlags"
    ) {
      continue;
    }

    if (fields.includes(key)) {
      return true;
    }

    if (
      securityRlsInputSanitizationBoundaryMapHasPresentFieldDeep(
        nested,
        fields
      )
    ) {
      return true;
    }
  }

  return false;
}

function securityRlsInputSanitizationBoundaryMapContainsEntryIssue(
  entries,
  predicate
) {
  return entries !== null && entries.some((entry) => predicate(entry));
}

function securityRlsInputSanitizationBoundaryMapMissingRequiredField(entry) {
  if (!isPlainObjectRecord(entry)) {
    return true;
  }

  return SECURITY_RLS_INPUT_SANITIZATION_BOUNDARY_REQUIRED_FIELDS.some(
    (field) => !Object.prototype.hasOwnProperty.call(entry, field)
  );
}

function securityRlsInputSanitizationBoundaryMapEntryMalformed(entry) {
  if (!isPlainObjectRecord(entry)) {
    return true;
  }

  return (
    typeof entry.boundaryId !== "string" ||
    !Array.isArray(entry.allowedCurrentBehavior) ||
    !Array.isArray(entry.forbiddenCurrentBehavior) ||
    typeof entry.requiredFutureContractBeforeImplementation !== "string" ||
    typeof entry.requiredFutureAuthorizationPhaseBeforeRuntime !== "string" ||
    typeof entry.inputSanitizationExpectation !== "string" ||
    typeof entry.injectionPreventionExpectation !== "string" ||
    typeof entry.rlsDataIsolationExpectation !== "string" ||
    typeof entry.permissionEnforcementExpectation !== "string" ||
    typeof entry.dependencySecurityToolingExpectation !== "string" ||
    typeof entry.secureTransportExpectation !== "string" ||
    typeof entry.auditIntegrityExpectation !== "string" ||
    typeof entry.locusRoleDescription !== "string" ||
    typeof entry.multiverseRoleDescription !== "string" ||
    typeof entry.fabricRoleDescription !== "string" ||
    typeof entry.secureDropRoleDescription !== "string" ||
    !isPlainObjectRecord(entry.explicitBlockedAuthorizationFlags) ||
    !isPlainObjectRecord(entry.unsafeSecurityRlsInputRuntimeFlags) ||
    entry.nonAuthorizingProof !== true
  );
}

function securityRlsInputSanitizationBoundaryMapAuthorizationFlagEnabled(
  value
) {
  if (!isPlainObjectRecord(value)) {
    return false;
  }

  return (
    (isPlainObjectRecord(value.explicitBlockedAuthorizationFlags) &&
      Object.values(value.explicitBlockedAuthorizationFlags).some(
        (flag) => flag !== false
      )) ||
    SECURITY_RLS_INPUT_SANITIZATION_BOUNDARY_AUTHORIZATION_FIELDS.some(
      (field) => value[field] === true
    )
  );
}

function securityRlsInputSanitizationBoundaryMapUnsafeFlagEnabled(value) {
  if (!isPlainObjectRecord(value)) {
    return false;
  }

  return (
    (isPlainObjectRecord(value.unsafeSecurityRlsInputRuntimeFlags) &&
      Object.values(value.unsafeSecurityRlsInputRuntimeFlags).some(
        (flag) => flag !== false
      )) ||
    securityRlsInputSanitizationBoundaryMapHasTrueFieldDeep(
      value,
      SECURITY_RLS_INPUT_SANITIZATION_BOUNDARY_UNSAFE_FIELDS
    )
  );
}

function securityRlsInputSanitizationBoundaryMapHasUnknownTopLevelField(
  inputRecord
) {
  if (inputRecord === null) {
    return false;
  }

  return Object.keys(inputRecord).some(
    (field) =>
      !SECURITY_RLS_INPUT_SANITIZATION_BOUNDARY_ALLOWED_TOP_LEVEL_FIELDS.includes(
        field
      )
  );
}

function securityRlsInputSanitizationBoundaryMapCanonical(entries) {
  if (entries === null) {
    return true;
  }

  return (
    JSON.stringify(entries) ===
    JSON.stringify(securityRlsInputSanitizationBoundaryMapEntries())
  );
}

function securityRlsInputSanitizationBoundaryMapInputClassification(
  inputRecord
) {
  if (securityRlsInputSanitizationBoundaryMapInputMalformed(inputRecord)) {
    return MALFORMED_SECURITY_RLS_INPUT_SANITIZATION_CONTRACT_BOUNDARY_MAP_CLASSIFICATION;
  }

  const entries =
    securityRlsInputSanitizationBoundaryMapInputEntries(inputRecord);

  if (
    securityRlsInputSanitizationBoundaryMapContainsEntryIssue(
      entries,
      securityRlsInputSanitizationBoundaryMapMissingRequiredField
    )
  ) {
    return "missing_required_security_rls_input_sanitization_contract_boundary_entry_rejected";
  }

  if (
    securityRlsInputSanitizationBoundaryMapContainsEntryIssue(
      entries,
      (entry) =>
        !SECURITY_RLS_INPUT_SANITIZATION_BOUNDARY_FAMILIES.includes(
          entry.boundaryFamily
        )
    )
  ) {
    return "unknown_boundary_family_security_rls_input_sanitization_contract_boundary_map_input_rejected";
  }

  if (
    securityRlsInputSanitizationBoundaryMapContainsEntryIssue(
      entries,
      (entry) =>
        !SECURITY_RLS_INPUT_SANITIZATION_BOUNDARY_RELATED_SYSTEMS.includes(
          entry.relatedSystem
        )
    )
  ) {
    return "unknown_related_system_security_rls_input_sanitization_contract_boundary_map_input_rejected";
  }

  if (
    securityRlsInputSanitizationBoundaryMapContainsEntryIssue(
      entries,
      (entry) =>
        !SECURITY_RLS_INPUT_SANITIZATION_BOUNDARY_STATUSES.includes(
          entry.currentStatus
        )
    )
  ) {
    return "unknown_current_status_security_rls_input_sanitization_contract_boundary_map_input_rejected";
  }

  if (
    securityRlsInputSanitizationBoundaryMapContainsEntryIssue(
      entries,
      securityRlsInputSanitizationBoundaryMapEntryMalformed
    )
  ) {
    return MALFORMED_SECURITY_RLS_INPUT_SANITIZATION_CONTRACT_BOUNDARY_MAP_CLASSIFICATION;
  }

  if (
    securityRlsInputSanitizationBoundaryMapContainsEntryIssue(
      entries,
      securityRlsInputSanitizationBoundaryMapAuthorizationFlagEnabled
    ) ||
    securityRlsInputSanitizationBoundaryMapAuthorizationFlagEnabled(inputRecord)
  ) {
    return "authorization_flags_enabled_security_rls_input_sanitization_contract_boundary_map_input_rejected";
  }

  if (
    securityRlsInputSanitizationBoundaryMapHasTrueFieldDeep(inputRecord, [
      "reportRunsChecks"
    ])
  ) {
    return "report_runs_checks_true_security_rls_input_sanitization_contract_boundary_map_input_rejected";
  }

  if (
    securityRlsInputSanitizationBoundaryMapHasTrueFieldDeep(
      inputRecord,
      SECURITY_RLS_INPUT_SANITIZATION_BOUNDARY_AUTHORIZATION_FIELDS
    )
  ) {
    return "runtime_authorization_attempt_security_rls_input_sanitization_contract_boundary_map_input_rejected";
  }

  if (
    securityRlsInputSanitizationBoundaryMapHasTrueFieldDeep(
      inputRecord,
      SECURITY_RLS_INPUT_SANITIZATION_BOUNDARY_COMMAND_FIELDS
    )
  ) {
    return "command_exposure_attempt_security_rls_input_sanitization_contract_boundary_map_input_rejected";
  }

  if (
    securityRlsInputSanitizationBoundaryMapHasTrueFieldDeep(
      inputRecord,
      SECURITY_RLS_INPUT_SANITIZATION_BOUNDARY_BLOCKED_CLI_BYPASS_FIELDS
    )
  ) {
    return "blocked_cli_bypass_attempt_security_rls_input_sanitization_contract_boundary_map_input_rejected";
  }

  if (
    securityRlsInputSanitizationBoundaryMapHasPresentFieldDeep(
      inputRecord,
      SECURITY_RLS_INPUT_SANITIZATION_BOUNDARY_MIDDLEWARE_FIELDS
    )
  ) {
    return "hidden_backend_api_server_middleware_semantics_security_rls_input_sanitization_contract_boundary_map_input_rejected";
  }

  if (
    securityRlsInputSanitizationBoundaryMapHasPresentFieldDeep(
      inputRecord,
      SECURITY_RLS_INPUT_SANITIZATION_BOUNDARY_DATABASE_RLS_FIELDS
    )
  ) {
    return "hidden_database_rls_schema_migration_semantics_security_rls_input_sanitization_contract_boundary_map_input_rejected";
  }

  if (
    securityRlsInputSanitizationBoundaryMapHasPresentFieldDeep(
      inputRecord,
      SECURITY_RLS_INPUT_SANITIZATION_BOUNDARY_SECRET_FIELDS
    )
  ) {
    return "hidden_secret_env_vault_access_semantics_security_rls_input_sanitization_contract_boundary_map_input_rejected";
  }

  if (
    securityRlsInputSanitizationBoundaryMapHasPresentFieldDeep(
      inputRecord,
      SECURITY_RLS_INPUT_SANITIZATION_BOUNDARY_CONNECTOR_FIELDS
    )
  ) {
    return "hidden_connector_grant_semantics_security_rls_input_sanitization_contract_boundary_map_input_rejected";
  }

  if (
    securityRlsInputSanitizationBoundaryMapHasPresentFieldDeep(
      inputRecord,
      SECURITY_RLS_INPUT_SANITIZATION_BOUNDARY_FABRIC_RUNTIME_FIELDS
    )
  ) {
    return "hidden_fabric_websocket_http_mcp_task_runtime_semantics_security_rls_input_sanitization_contract_boundary_map_input_rejected";
  }

  if (
    securityRlsInputSanitizationBoundaryMapHasPresentFieldDeep(
      inputRecord,
      SECURITY_RLS_INPUT_SANITIZATION_BOUNDARY_SECURE_DROP_FIELDS
    )
  ) {
    return "hidden_secure_drop_implementation_semantics_security_rls_input_sanitization_contract_boundary_map_input_rejected";
  }

  if (
    securityRlsInputSanitizationBoundaryMapHasPresentFieldDeep(
      inputRecord,
      SECURITY_RLS_INPUT_SANITIZATION_BOUNDARY_ENCODED_HANDOFF_FIELDS
    )
  ) {
    return "hidden_encoded_handoff_codec_translator_stego_covert_channel_tokenizer_exploit_bypass_semantics_security_rls_input_sanitization_contract_boundary_map_input_rejected";
  }

  if (
    securityRlsInputSanitizationBoundaryMapHasPresentFieldDeep(
      inputRecord,
      SECURITY_RLS_INPUT_SANITIZATION_BOUNDARY_AUDIT_LOG_FIELDS
    )
  ) {
    return "hidden_audit_log_write_tamper_evident_writer_semantics_security_rls_input_sanitization_contract_boundary_map_input_rejected";
  }

  if (
    securityRlsInputSanitizationBoundaryMapUnsafeFlagEnabled(inputRecord) ||
    securityRlsInputSanitizationBoundaryMapContainsEntryIssue(
      entries,
      securityRlsInputSanitizationBoundaryMapUnsafeFlagEnabled
    )
  ) {
    return "unsafe_sanitizer_rls_permission_secure_transport_dependency_audit_log_secret_connector_external_lookup_runtime_flags_security_rls_input_sanitization_contract_boundary_map_input_rejected";
  }

  if (
    securityRlsInputSanitizationBoundaryMapContainsEntryIssue(
      entries,
      (entry) =>
        securityRlsInputSanitizationBoundaryMapContainsTrue(
          entry?.runtimeEffect
        )
    ) ||
    securityRlsInputSanitizationBoundaryMapContainsTrue(
      inputRecord?.runtimeEffect
    )
  ) {
    return "nested_unsafe_flags_security_rls_input_sanitization_contract_boundary_map_input_rejected";
  }

  if (
    securityRlsInputSanitizationBoundaryMapHasUnknownTopLevelField(inputRecord)
  ) {
    return "unknown_top_level_field_security_rls_input_sanitization_contract_boundary_map_input_rejected";
  }

  if (!securityRlsInputSanitizationBoundaryMapCanonical(entries)) {
    return "noncanonical_security_rls_input_sanitization_contract_boundary_map_input_rejected";
  }

  return VALID_SECURITY_RLS_INPUT_SANITIZATION_CONTRACT_BOUNDARY_MAP_CLASSIFICATION;
}

function securityRlsInputSanitizationBoundaryMapAuthorizationFlags() {
  return {
    sanitizerRuntimeAuthorizationGranted: false,
    rlsRuntimeAuthorizationGranted: false,
    securityMiddlewareAuthorizationGranted: false,
    backendApiServerAuthorizationGranted: false,
    secureTransportRuntimeAuthorizationGranted: false,
    auditLogWriterAuthorizationGranted: false,
    secretAccessAuthorizationGranted: false,
    connectorGrantAuthorizationGranted: false,
    databaseStorageAuthorizationGranted: false,
    fabricRuntimeAuthorizationGranted: false,
    websocketHttpRuntimeAuthorizationGranted: false,
    mcpToolExposureAuthorizationGranted: false,
    taskExecutionAuthorizationGranted: false,
    secureDropAuthorizationGranted: false,
    encodedHandoffRuntimeAuthorizationGranted: false,
    commandExposureAuthorizationGranted: false,
    approvalDecisionProduced: false,
    approvalGrantProduced: false,
    connectorGrantProduced: false,
    authorizesRuntime: false
  };
}

function securityRlsInputSanitizationBoundaryMapUnsafeFlags() {
  return Object.fromEntries(
    SECURITY_RLS_INPUT_SANITIZATION_BOUNDARY_UNSAFE_FIELDS.map((field) => [
      field,
      false
    ])
  );
}

function securityRlsInputSanitizationBoundaryMapCommonNotes() {
  return {
    noConsumerRole: "No current runtime role; future consumers may inspect metadata only.",
    currentAuthorization:
      "Requires a future security, RLS, input-validation, permission, runtime, command exposure, connector, storage, secrets, audit, and process-control authorization phase before any executable behavior.",
    secureDropContentFabric:
      "Secure Drop metadata safety remains a future content-fabric contract; Ardyn records metadata references only and implements no crypto, transport, stego, send/receive, inbox polling, file selection, connector ingestion, secret/vault/env access, or ST3GG wrapping.",
    fabricMetadataOnly:
      "Fabric remains a future coordination envelope metadata layer, not a bus, broker, transport, adapter, connector, registry, scheduler, importer, exporter, package distributor, or task executor."
  };
}

function securityRlsInputSanitizationBoundaryMapEntry(definition) {
  return {
    boundaryId: definition.boundaryId,
    boundaryFamily: definition.boundaryFamily,
    relatedSystem: definition.relatedSystem,
    currentStatus: definition.currentStatus,
    allowedCurrentBehavior: definition.allowedCurrentBehavior,
    forbiddenCurrentBehavior:
      securityRlsInputSanitizationBoundaryMapForbiddenBehavior(),
    requiredFutureContractBeforeImplementation:
      definition.requiredFutureContractBeforeImplementation,
    requiredFutureAuthorizationPhaseBeforeRuntime:
      definition.requiredFutureAuthorizationPhaseBeforeRuntime,
    inputSanitizationExpectation: definition.inputSanitizationExpectation,
    injectionPreventionExpectation: definition.injectionPreventionExpectation,
    rlsDataIsolationExpectation: definition.rlsDataIsolationExpectation,
    permissionEnforcementExpectation:
      definition.permissionEnforcementExpectation,
    dependencySecurityToolingExpectation:
      definition.dependencySecurityToolingExpectation,
    secureTransportExpectation: definition.secureTransportExpectation,
    auditIntegrityExpectation: definition.auditIntegrityExpectation,
    locusRoleDescription: definition.locusRoleDescription,
    multiverseRoleDescription: definition.multiverseRoleDescription,
    fabricRoleDescription: definition.fabricRoleDescription,
    secureDropRoleDescription: definition.secureDropRoleDescription,
    productionReadinessAreaReference: {
      phase: "5.48",
      areaNumber: 8,
      areaName: "Security & RLS",
      sourceFixture:
        "tests/fixtures/host-policy/phase5-48/production-readiness-coverage-matrix.json",
      sourceStatus: "deferred",
      representedByPhase563: true,
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
    phase562AuthPermissionsContractBoundaryReference: {
      phase: "5.62",
      sourceFixture:
        "tests/fixtures/host-policy/phase5-62/auth-permissions-contract-boundary-map.json",
      authPermissionsBoundaryReferenced: true,
      implementsAuthPermissionsRuntime: false,
      authorizesRuntime: false
    },
    securityRlsInputSanitizationBoundaryMetadataOnly: true,
    noLiveSecurityEnforcementPerformed: true,
    explicitBlockedAuthorizationFlags:
      securityRlsInputSanitizationBoundaryMapAuthorizationFlags(),
    unsafeSecurityRlsInputRuntimeFlags:
      securityRlsInputSanitizationBoundaryMapUnsafeFlags(),
    nonAuthorizingProof: true,
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

function securityRlsInputSanitizationBoundaryMapDefinition({
  boundaryId,
  boundaryFamily,
  relatedSystem,
  currentStatus,
  subject,
  inputExpectation,
  injectionExpectation,
  rlsExpectation,
  permissionExpectation,
  dependencyExpectation,
  transportExpectation,
  auditExpectation,
  locusRole,
  multiverseRole,
  fabricRole,
  secureDropRole
}) {
  const notes = securityRlsInputSanitizationBoundaryMapCommonNotes();

  return {
    boundaryId,
    boundaryFamily,
    relatedSystem,
    currentStatus,
    allowedCurrentBehavior: [
      `Describe future ${subject} security boundary metadata.`,
      "Keep current behavior review-only, metadata-only, non-authorizing, and runtime-blocked."
    ],
    requiredFutureContractBeforeImplementation:
      `A future ${subject} contract must define accepted inputs, denied inputs, display semantics, audit visibility, ownership, failure modes, and explicit no-runtime defaults before implementation.`,
    requiredFutureAuthorizationPhaseBeforeRuntime: notes.currentAuthorization,
    inputSanitizationExpectation: inputExpectation,
    injectionPreventionExpectation: injectionExpectation,
    rlsDataIsolationExpectation: rlsExpectation,
    permissionEnforcementExpectation: permissionExpectation,
    dependencySecurityToolingExpectation: dependencyExpectation,
    secureTransportExpectation: transportExpectation,
    auditIntegrityExpectation: auditExpectation,
    locusRoleDescription: locusRole ?? notes.noConsumerRole,
    multiverseRoleDescription: multiverseRole ?? notes.noConsumerRole,
    fabricRoleDescription: fabricRole ?? notes.fabricMetadataOnly,
    secureDropRoleDescription: secureDropRole ?? "Not applicable."
  };
}

function securityRlsInputSanitizationBoundaryMapDefinitions() {
  const notes = securityRlsInputSanitizationBoundaryMapCommonNotes();
  const metadataDependency =
    "Security tooling may be documented and audited as evidence only; no dependency patch automation, live scanner, external lookup, or runtime remediation is enabled.";
  const noTransport =
    "Secure transport remains a future contract only; Ardyn does not configure https/hsts, open listeners, or add websocket/http transport.";
  const auditMetadata =
    "Audit integrity is a future contract; Ardyn writes no audit logs, transcripts, tamper-evident records, stdout/stderr runtime streams, or persistent files.";

  return [
    securityRlsInputSanitizationBoundaryMapDefinition({
      boundaryId:
        "phase5-63.ardyn.manifest_task_review_artifact.input_sanitization_boundary",
      boundaryFamily: "input_sanitization_contract",
      relatedSystem: "ardyn",
      currentStatus: "metadata_only",
      subject: "manifest, task, and review-artifact input",
      inputExpectation:
        "Future manifest, task, and review-artifact inputs must reject executable commands, hidden runtime grants, unsafe paths, and malformed metadata before any display or evaluator handoff.",
      injectionExpectation:
        "Future schema and display consumers must treat user-provided strings as inert metadata and never interpolate them into commands, queries, selectors, or code.",
      rlsExpectation:
        "No live data or database row exists now; future storage must define tenant, project, and workspace isolation before persistence.",
      permissionExpectation:
        "Current validation cannot authorize runtime, approvals, commands, grants, connectors, MCP, or task execution.",
      dependencyExpectation: metadataDependency,
      transportExpectation: noTransport,
      auditExpectation: auditMetadata
    }),
    securityRlsInputSanitizationBoundaryMapDefinition({
      boundaryId:
        "phase5-63.ardyn.encoded_handoff_input.encoded_handoff_safety_boundary",
      boundaryFamily: "encoded_handoff_safety_contract",
      relatedSystem: "ardyn",
      currentStatus: "metadata_only",
      subject: "encoded handoff input",
      inputExpectation:
        "Future encoded handoff metadata must remain visible, auditable, and unable to carry hidden commands, runtime authorization, bypass instructions, stego, covert channels, or tokenizer exploit semantics.",
      injectionExpectation:
        "Future encoded handoff handling must reject codec, translator, encoder, decoder, conlang, hidden payload, and transport execution semantics unless a separate runtime authorization phase exists.",
      rlsExpectation:
        "No encoded handoff transcript is persisted by Ardyn; future storage must define isolation and retention first.",
      permissionExpectation:
        "Encoded content cannot authorize runtime, expose commands, change reportRunsChecks, or bypass blocked CLI behavior.",
      dependencyExpectation: metadataDependency,
      transportExpectation: noTransport,
      auditExpectation:
        "Future handoff audits must expose raw protocol metadata or an operator-visible digest; Ardyn writes no audit record now."
    }),
    securityRlsInputSanitizationBoundaryMapDefinition({
      boundaryId:
        "phase5-63.ardyn.display_conformance_fixture.schema_validation_boundary",
      boundaryFamily: "schema_validation_contract",
      relatedSystem: "ardyn",
      currentStatus: "metadata_only",
      subject: "display and conformance fixture",
      inputExpectation:
        "Future display fixtures must fail closed for hidden actions, interactivity, commands, Secure Drop implementation details, runtime flags, and unsafe nested fields.",
      injectionExpectation:
        "Future consumers must render fixture text as inert metadata with no hidden action semantics, no browser automation, and no command binding.",
      rlsExpectation:
        "Fixture metadata contains no live DB rows; future fixture storage must be isolated before persistence.",
      permissionExpectation:
        "Display fixture metadata cannot grant Locus or Multiverse controls.",
      dependencyExpectation: metadataDependency,
      transportExpectation: noTransport,
      auditExpectation: auditMetadata,
      locusRole:
        "Locus may later display fixture validation status as metadata only.",
      multiverseRole:
        "Multiverse may later display fixture validation status as metadata only."
    }),
    securityRlsInputSanitizationBoundaryMapDefinition({
      boundaryId:
        "phase5-63.repo_family.api_backend_request_validation.schema_validation_boundary",
      boundaryFamily: "schema_validation_contract",
      relatedSystem: "repo-family",
      currentStatus: "future_contract_required",
      subject: "API/backend request validation",
      inputExpectation:
        "Future API/backend requests need a contract for accepted fields, rejected fields, size limits, canonical ordering, provenance, and explicit blocked defaults before any endpoint exists.",
      injectionExpectation:
        "Future request validation must prevent query, command, path, template, prompt, and transport injection before handlers exist.",
      rlsExpectation:
        "Future request handling must tie storage access to explicit RLS and app-permission contracts.",
      permissionExpectation:
        "Future request handling cannot infer authorization from metadata, headers, fixtures, or Fabric envelopes.",
      dependencyExpectation: metadataDependency,
      transportExpectation: noTransport,
      auditExpectation: auditMetadata,
      fabricRole: notes.fabricMetadataOnly
    }),
    securityRlsInputSanitizationBoundaryMapDefinition({
      boundaryId:
        "phase5-63.ardyn.database_storage_rls.rls_boundary",
      boundaryFamily: "rls_contract",
      relatedSystem: "ardyn",
      currentStatus: "future_contract_required",
      subject: "database/storage/RLS",
      inputExpectation:
        "Future DB/storage inputs must be canonical, bounded, and rejected before persistence if isolation, retention, or ownership is unknown.",
      injectionExpectation:
        "Future database access must reject SQL, migration, schema, path, and query injection before storage adapters exist.",
      rlsExpectation:
        "RLS is a future contract only and requires tenant, project, workspace, subject, and policy ownership before implementation.",
      permissionExpectation:
        "Future RLS must compose with Phase 5.62 auth/permissions contracts and cannot authorize runtime from metadata alone.",
      dependencyExpectation: metadataDependency,
      transportExpectation: noTransport,
      auditExpectation: auditMetadata
    }),
    securityRlsInputSanitizationBoundaryMapDefinition({
      boundaryId:
        "phase5-63.repo_family.tenant_project_workspace.data_isolation_boundary",
      boundaryFamily: "data_isolation_contract",
      relatedSystem: "repo-family",
      currentStatus: "future_contract_required",
      subject: "tenant, project, and workspace isolation",
      inputExpectation:
        "Future isolation metadata must define tenant, project, workspace, actor, and artifact boundaries before live data exists.",
      injectionExpectation:
        "Future isolation selectors must not be derived from untrusted strings without validation.",
      rlsExpectation:
        "Future RLS and app permissions must reject cross-tenant, cross-project, and cross-workspace access by default.",
      permissionExpectation:
        "Future isolation decisions require explicit subject and approval metadata, not display labels.",
      dependencyExpectation: metadataDependency,
      transportExpectation: noTransport,
      auditExpectation:
        "Future isolation audit trails must be append-safe and tamper-evident only after a separate writer contract."
    }),
    securityRlsInputSanitizationBoundaryMapDefinition({
      boundaryId:
        "phase5-63.ardyn.auth_permissions_enforcement.permission_enforcement_boundary",
      boundaryFamily: "permission_enforcement_contract",
      relatedSystem: "ardyn",
      currentStatus: "blocked",
      subject: "auth/permissions enforcement",
      inputExpectation:
        "Future permission inputs must carry explicit subject, role, scope, denial, consent, revocation, and audit metadata before enforcement.",
      injectionExpectation:
        "Future permission checks must reject policy, role, scope, and approval injection.",
      rlsExpectation:
        "Future permission enforcement must align with RLS and data-isolation contracts before DB/storage use.",
      permissionExpectation:
        "Ardyn currently records approval prerequisites only and implements no role engine, permission evaluator, policy enforcement runtime, approval decision, or approval grant.",
      dependencyExpectation: metadataDependency,
      transportExpectation: noTransport,
      auditExpectation: auditMetadata
    }),
    securityRlsInputSanitizationBoundaryMapDefinition({
      boundaryId:
        "phase5-63.repo_family.fabric_coordination_envelope.content_safety_boundary",
      boundaryFamily: "content_safety_contract",
      relatedSystem: "repo-family",
      currentStatus: "future_contract_required",
      subject: "Fabric coordination-envelope safety",
      inputExpectation:
        "Future Fabric envelope metadata must reject hidden transport, bus, broker, adapter, connector, registry, scheduler, importer, exporter, package, and task execution semantics.",
      injectionExpectation:
        "Future Fabric envelopes must be inert metadata and cannot interpolate envelope values into commands, routes, topics, URLs, or tasks.",
      rlsExpectation:
        "Future Fabric-related storage must define isolation before any envelope persistence.",
      permissionExpectation:
        "Fabric metadata cannot authorize runtime, approve commands, or grant connector access.",
      dependencyExpectation: metadataDependency,
      transportExpectation: noTransport,
      auditExpectation: auditMetadata,
      locusRole:
        "Locus may later display Fabric envelope safety metadata only.",
      multiverseRole:
        "Multiverse may later display Fabric envelope safety metadata only.",
      fabricRole: notes.fabricMetadataOnly
    }),
    securityRlsInputSanitizationBoundaryMapDefinition({
      boundaryId:
        "phase5-63.locus.control_surface_input_safety.input_sanitization_boundary",
      boundaryFamily: "input_sanitization_contract",
      relatedSystem: "locus",
      currentStatus: "future_contract_required",
      subject: "Locus control-surface input safety",
      inputExpectation:
        "Future Locus control-surface inputs must reject hidden actions, command bindings, runtime grants, unsafe selectors, and browser automation semantics.",
      injectionExpectation:
        "Future Locus display inputs must remain color-independent, keyboard-visible metadata with no hidden action handlers from Ardyn.",
      rlsExpectation:
        "No Locus storage is implemented by Ardyn; future status persistence needs isolation contracts.",
      permissionExpectation:
        "Locus controls require consumer-owned permission checks before interactivity.",
      dependencyExpectation: metadataDependency,
      transportExpectation: noTransport,
      auditExpectation: auditMetadata,
      locusRole:
        "Locus remains a future first-class consumer target only; no Locus repo or runtime is modified."
    }),
    securityRlsInputSanitizationBoundaryMapDefinition({
      boundaryId:
        "phase5-63.multiverse.citizen_adapter_input_safety.input_sanitization_boundary",
      boundaryFamily: "input_sanitization_contract",
      relatedSystem: "multiverse",
      currentStatus: "future_contract_required",
      subject: "Multiverse citizen/adapter input safety",
      inputExpectation:
        "Future Multiverse citizen and adapter metadata must reject connector grants, task execution, adapter runtime, hidden routes, and unsafe orchestration semantics.",
      injectionExpectation:
        "Future citizen and adapter labels must be display metadata, not executable connector or task input.",
      rlsExpectation:
        "No Multiverse storage is implemented by Ardyn; future capability and task metadata require isolation contracts.",
      permissionExpectation:
        "Future Multiverse permission enforcement must be consumer-owned before adapters become actionable.",
      dependencyExpectation: metadataDependency,
      transportExpectation: noTransport,
      auditExpectation: auditMetadata,
      multiverseRole:
        "Multiverse remains a future first-class consumer target only; no Multiverse repo or runtime is modified."
    }),
    securityRlsInputSanitizationBoundaryMapDefinition({
      boundaryId:
        "phase5-63.ardyn.mcp_tool_exposure_safety.injection_prevention_boundary",
      boundaryFamily: "injection_prevention_contract",
      relatedSystem: "ardyn",
      currentStatus: "blocked",
      subject: "MCP/tool exposure safety",
      inputExpectation:
        "Future MCP/tool metadata must reject tool names, server URLs, arguments, task runners, and command exposure unless separately authorized.",
      injectionExpectation:
        "Future MCP/tool boundaries must prevent prompt, command, argument, route, and adapter injection before any exposure.",
      rlsExpectation:
        "Future tool result storage requires RLS and isolation contracts first.",
      permissionExpectation:
        "MCP/tool exposure remains blocked and cannot be granted by metadata.",
      dependencyExpectation: metadataDependency,
      transportExpectation: noTransport,
      auditExpectation: auditMetadata
    }),
    securityRlsInputSanitizationBoundaryMapDefinition({
      boundaryId:
        "phase5-63.repo_family.connector_input_safety.injection_prevention_boundary",
      boundaryFamily: "injection_prevention_contract",
      relatedSystem: "repo-family",
      currentStatus: "blocked",
      subject: "connector input safety",
      inputExpectation:
        "Future connector inputs must reject credentials, grants, ingestion URLs, scanner directives, file selection, and filesystem scanning semantics.",
      injectionExpectation:
        "Future connector contracts must prevent connector, path, credential, and payload injection before grants exist.",
      rlsExpectation:
        "Future connector output storage requires isolation and retention contracts first.",
      permissionExpectation:
        "Connector grants remain unavailable and cannot be produced by Ardyn metadata.",
      dependencyExpectation: metadataDependency,
      transportExpectation: noTransport,
      auditExpectation: auditMetadata,
      locusRole:
        "Locus may later display connector input safety metadata only.",
      multiverseRole:
        "Multiverse may later display connector candidate safety metadata only."
    }),
    securityRlsInputSanitizationBoundaryMapDefinition({
      boundaryId:
        "phase5-63.content_fabric.secure_drop_metadata_safety.secure_drop_boundary",
      boundaryFamily: "secure_drop_boundary_contract",
      relatedSystem: "content-fabric",
      currentStatus: "future_contract_required",
      subject: "Secure Drop metadata safety",
      inputExpectation:
        "Future Secure Drop references in Ardyn must stay metadata-only and reject crypto, transport, stego, send/receive, inbox polling, file selection, filesystem scanning, connector ingestion, secret/vault/env access, and ST3GG wrapping.",
      injectionExpectation:
        "Future Secure Drop metadata must not become payload, keyring, DID resolver, transport, or inbox input in Ardyn.",
      rlsExpectation:
        "Future Secure Drop metadata storage, if any, must be content-fabric-owned and isolated before persistence.",
      permissionExpectation:
        "Secure Drop identity, recipient, keyring, DID, consent, and authorization remain future content-fabric work.",
      dependencyExpectation: metadataDependency,
      transportExpectation: noTransport,
      auditExpectation:
        "Future Secure Drop audit metadata must avoid secret or payload disclosure and remain content-fabric-owned.",
      locusRole:
        "Locus may later display Secure Drop placeholder safety metadata only.",
      fabricRole:
        "Fabric may later carry Secure Drop reference metadata only.",
      secureDropRole: notes.secureDropContentFabric
    }),
    securityRlsInputSanitizationBoundaryMapDefinition({
      boundaryId:
        "phase5-63.ardyn.secret_env_vault_exposure.secret_exposure_boundary",
      boundaryFamily: "secret_exposure_contract",
      relatedSystem: "ardyn",
      currentStatus: "blocked",
      subject: "secret/env/vault exposure",
      inputExpectation:
        "Future secret metadata must reject secret values, env file paths, vault clients, private keys, API secrets, and secret scanner runtime instructions.",
      injectionExpectation:
        "Future secret boundaries must prevent secret value interpolation into logs, commands, transport, fixtures, or display text.",
      rlsExpectation:
        "Future secret reference storage requires isolation and redaction contracts first.",
      permissionExpectation:
        "No current metadata can grant secret/env/vault access.",
      dependencyExpectation: metadataDependency,
      transportExpectation: noTransport,
      auditExpectation:
        "Future secret audit records must avoid value disclosure and require a separate writer contract."
    }),
    securityRlsInputSanitizationBoundaryMapDefinition({
      boundaryId:
        "phase5-63.repo_family.dependency_security_scan.dependency_security_boundary",
      boundaryFamily: "dependency_security_contract",
      relatedSystem: "repo-family",
      currentStatus: "metadata_only",
      subject: "dependency/security scan evidence",
      inputExpectation:
        "Dependency scan evidence is advisory metadata only and cannot trigger dependency patch automation, live scanners, external lookup, or runtime remediation.",
      injectionExpectation:
        "Future scan-result ingestion must reject executable remediation, package writer, import/export, or CI semantics.",
      rlsExpectation:
        "Future scan-result storage needs isolation and retention contracts first.",
      permissionExpectation:
        "Security evidence cannot approve runtime, commands, connectors, or package changes.",
      dependencyExpectation: metadataDependency,
      transportExpectation: noTransport,
      auditExpectation:
        "Future scan evidence audits must identify provenance without writing runtime logs."
    }),
    securityRlsInputSanitizationBoundaryMapDefinition({
      boundaryId:
        "phase5-63.repo_family.audit_log_integrity.audit_integrity_boundary",
      boundaryFamily: "audit_integrity_contract",
      relatedSystem: "repo-family",
      currentStatus: "future_contract_required",
      subject: "audit/log integrity",
      inputExpectation:
        "Future audit inputs must reject log-writer, transcript-writer, stdout/stderr writer, tamper-evident writer, filesystem write, and persistence semantics until a writer contract exists.",
      injectionExpectation:
        "Future audit fields must prevent log injection, path injection, newline confusion, hidden payloads, and command interpolation.",
      rlsExpectation:
        "Future audit persistence requires isolation, retention, deletion, and recovery contracts first.",
      permissionExpectation:
        "Audit metadata cannot approve or grant runtime behavior.",
      dependencyExpectation: metadataDependency,
      transportExpectation: noTransport,
      auditExpectation:
        "Audit integrity is planned as a future contract only; no audit or log writer exists now."
    }),
    securityRlsInputSanitizationBoundaryMapDefinition({
      boundaryId:
        "phase5-63.repo_family.secure_transport_https_hsts.secure_transport_boundary",
      boundaryFamily: "secure_transport_contract",
      relatedSystem: "repo-family",
      currentStatus: "future_contract_required",
      subject: "https/hsts secure transport",
      inputExpectation:
        "Future transport metadata must distinguish secure transport requirements from actual server, listener, websocket/http, adapter, gRPC, MQTT, libp2p, or Fabric transport behavior.",
      injectionExpectation:
        "Future transport config must reject URL, route, header, certificate path, and proxy injection before implementation.",
      rlsExpectation:
        "Transport metadata contains no live data; future logs require isolation first.",
      permissionExpectation:
        "Secure transport planning cannot authorize endpoints, commands, connectors, or tasks.",
      dependencyExpectation: metadataDependency,
      transportExpectation:
        "https/hsts remains a future secure transport contract only; no server, listener, certificate, proxy, websocket/http, gRPC, MQTT, or libp2p transport is implemented.",
      auditExpectation: auditMetadata
    }),
    securityRlsInputSanitizationBoundaryMapDefinition({
      boundaryId:
        "phase5-63.ardyn_subagent.prompt_output_safety.input_sanitization_boundary",
      boundaryFamily: "input_sanitization_contract",
      relatedSystem: "ardyn-subagent",
      currentStatus: "future_contract_required",
      subject: "subagent prompt/output safety",
      inputExpectation:
        "Future subagent handoff inputs and outputs must reject hidden commands, runtime authorization, process-control instructions, secret references, connector grants, and encoded bypass semantics.",
      injectionExpectation:
        "Future subagent metadata must prevent prompt injection from becoming command, tool, MCP, task, or transport execution.",
      rlsExpectation:
        "Future subagent transcript or audit storage requires Phase 5.61 storage isolation and retention contracts first.",
      permissionExpectation:
        "Subagent metadata cannot inherit operator permissions or issue approval grants.",
      dependencyExpectation: metadataDependency,
      transportExpectation: noTransport,
      auditExpectation: auditMetadata,
      fabricRole:
        "Fabric may later carry subagent safety references only as metadata."
    })
  ];
}

function securityRlsInputSanitizationBoundaryMapEntries() {
  return securityRlsInputSanitizationBoundaryMapDefinitions().map(
    securityRlsInputSanitizationBoundaryMapEntry
  );
}

function securityRlsInputSanitizationBoundaryMapSummary(entries) {
  const countByFamily = Object.fromEntries(
    SECURITY_RLS_INPUT_SANITIZATION_BOUNDARY_FAMILIES.map((family) => [
      family,
      entries.filter((entry) => entry.boundaryFamily === family).length
    ])
  );
  const countByRelatedSystem = Object.fromEntries(
    SECURITY_RLS_INPUT_SANITIZATION_BOUNDARY_RELATED_SYSTEMS.map((system) => [
      system,
      entries.filter((entry) => entry.relatedSystem === system).length
    ])
  );

  return {
    securityRlsInputSanitizationContractBoundaryMapKind:
      SECURITY_RLS_INPUT_SANITIZATION_CONTRACT_BOUNDARY_MAP_KIND,
    boundaryEntryCount: entries.length,
    boundaryIds: entries.map((entry) => entry.boundaryId),
    boundaryFamilies: [...SECURITY_RLS_INPUT_SANITIZATION_BOUNDARY_FAMILIES],
    relatedSystems: [
      ...SECURITY_RLS_INPUT_SANITIZATION_BOUNDARY_RELATED_SYSTEMS
    ],
    currentStatusValues: [
      ...SECURITY_RLS_INPUT_SANITIZATION_BOUNDARY_STATUSES
    ],
    countByFamily,
    countByRelatedSystem,
    phase548SecurityRlsCoverageItemRepresented: true,
    phase559FabricAwareApiBackendBoundaryReferenced: true,
    phase560EncodedHandoffConformanceReferenced: true,
    phase561DatabaseStorageContractBoundaryReferenced: true,
    phase562AuthPermissionsContractBoundaryReferenced: true,
    securityRlsInputSanitizationBoundaryMetadataOnly: true,
    noLiveSecurityEnforcementPerformed: true,
    noSanitizerRuntimeImplemented: true,
    noSecurityMiddlewareImplemented: true,
    noRlsRuntimeImplemented: true,
    noPermissionEnforcementRuntime: true,
    noSecureTransportRuntime: true,
    noDependencyPatchAutomation: true,
    noAuditLogWriters: true,
    noSecretEnvVaultAccess: true,
    contentFabricCanonicalSecureDropOwnerOnly: true,
    allBlockedAuthorizationFlagsFalse: true,
    allUnsafeSecurityRlsInputRuntimeFlagsFalse: true,
    allRuntimeEffectsFalse: true,
    allEntriesNonAuthorizing: true
  };
}

function securityRlsInputSanitizationBoundaryMapValidationRules() {
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
    unsafeSanitizerRlsPermissionSecureTransportDependencyAuditLogSecretConnectorExternalLookupRuntimeFlagsFailClosed:
      true,
    hiddenBackendApiServerMiddlewareSemanticsFailClosed: true,
    hiddenDatabaseRlsSchemaMigrationSemanticsFailClosed: true,
    hiddenSecretEnvVaultAccessSemanticsFailClosed: true,
    hiddenConnectorGrantSemanticsFailClosed: true,
    hiddenFabricWebsocketHttpMcpTaskRuntimeSemanticsFailClosed: true,
    hiddenSecureDropImplementationSemanticsFailClosed: true,
    hiddenEncodedHandoffCodecTranslatorStegoCovertChannelTokenizerExploitBypassSemanticsFailClosed:
      true,
    hiddenAuditLogWriteTamperEvidentWriterSemanticsFailClosed: true,
    nestedUnsafeFlagsFailClosed: true,
    noncanonicalBoundaryEntriesFailClosed: true,
    validationImplementsSanitizerRuntime: false,
    validationImplementsSecurityMiddleware: false,
    validationImplementsRlsRuntime: false,
    validationImplementsPermissionEnforcementRuntime: false,
    validationImplementsSecureTransportRuntime: false,
    validationRunsDependencyPatchAutomation: false,
    validationWritesAuditLogs: false,
    validationWritesRuntimeLogs: false,
    validationAccessesSecrets: false,
    validationRunsConnectorScanner: false,
    validationPerformsExternalLookup: false,
    validationRunsRuntime: false
  };
}

function securityRlsInputSanitizationBoundaryMapGaps() {
  return [
    "No security middleware, runtime sanitizer, injection-prevention runtime, RLS runtime, permission enforcement runtime, secure transport runtime, or backend API/server behavior exists in Ardyn.",
    "Database/storage/RLS, auth/permissions, and Fabric boundaries are referenced as metadata only and still require explicit implementation and runtime authorization contracts.",
    "Secrets, env files, vaults, connector grants, Secure Drop metadata, encoded handoff content, and audit/log writers remain blocked and cannot be enabled by metadata.",
    "Dependency and security scan evidence is advisory only; no live scanner, dependency patch automation, external lookup, package write, import/export, or CI behavior is implemented.",
    "Future UI/display consumers still need consumer-owned sanitization, accessibility, and action-disablement validation before any interactive surface exists."
  ];
}

function securityRlsInputSanitizationBoundaryMapFalseRuntimeFields() {
  return Object.fromEntries(
    SECURITY_RLS_INPUT_SANITIZATION_BOUNDARY_UNSAFE_FIELDS.map((field) => [
      field,
      false
    ])
  );
}

function securityRlsInputSanitizationBoundaryMapState(reviewedAt) {
  const boundaryEntries = securityRlsInputSanitizationBoundaryMapEntries();

  return {
    schema: SECURITY_RLS_INPUT_SANITIZATION_CONTRACT_BOUNDARY_MAP_STATE_SCHEMA,
    schemaVersion:
      SECURITY_RLS_INPUT_SANITIZATION_CONTRACT_BOUNDARY_MAP_VERSION,
    stateKind: SECURITY_RLS_INPUT_SANITIZATION_CONTRACT_BOUNDARY_MAP_KIND,
    stateMode: "review-only",
    reviewedAt,
    sourcePhaseContext: {
      phase548ProductionReadinessCoverageMatrix:
        "tests/fixtures/host-policy/phase5-48/production-readiness-coverage-matrix.json",
      phase548SecurityRlsAreaNumber: 8,
      phase548SecurityRlsStatus: "deferred",
      phase559FabricAwareApiBackendBoundary:
        "tests/fixtures/host-policy/phase5-59/fabric-aware-api-backend-contract-boundary-map.json",
      phase560InterAgentEncodedHandoffConformance:
        "tests/fixtures/host-policy/phase5-60/inter-agent-encoded-handoff-conformance.json",
      phase561DatabaseStorageContractBoundary:
        "tests/fixtures/host-policy/phase5-61/database-storage-contract-boundary-map.json",
      phase562AuthPermissionsContractBoundary:
        "tests/fixtures/host-policy/phase5-62/auth-permissions-contract-boundary-map.json",
      secureDropCanonicalOwner: "content-fabric",
      runtimeStillBlocked: true
    },
    boundaryEntries,
    boundaryMapSummary:
      securityRlsInputSanitizationBoundaryMapSummary(boundaryEntries),
    invalidBoundaryCasePolicy:
      securityRlsInputSanitizationBoundaryMapValidationRules(),
    topSecurityRlsAuthDatabaseFabricApiBackendGaps:
      securityRlsInputSanitizationBoundaryMapGaps(),
    recommendedNextPhase:
      "phase-5.64-review-only-rate-limiting-abuse-control-contract-boundary-map",
    securityRlsInputSanitizationContractBoundaryMapOnly: true,
    reviewOnly: true,
    metadataOnly: true,
    authoritative: false,
    nonAuthorizingProof: true,
    reportRunsChecks: false,
    ...securityRlsInputSanitizationBoundaryMapFalseRuntimeFields(),
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

function securityRlsInputSanitizationBoundaryMapResult({
  reviewedAt,
  reviewedAtDefaulted,
  classification,
  accepted,
  securityRlsInputSanitizationContractBoundaryMap
}) {
  return {
    schema: SECURITY_RLS_INPUT_SANITIZATION_CONTRACT_BOUNDARY_MAP_SCHEMA,
    schemaVersion:
      SECURITY_RLS_INPUT_SANITIZATION_CONTRACT_BOUNDARY_MAP_VERSION,
    securityRlsInputSanitizationContractBoundaryMapKind:
      SECURITY_RLS_INPUT_SANITIZATION_CONTRACT_BOUNDARY_MAP_KIND,
    securityRlsInputSanitizationContractBoundaryMapMode: "review-only",
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    securityRlsInputSanitizationContractBoundaryMapProduced: accepted,
    securityRlsInputSanitizationContractBoundaryMap,
    boundaryMapSummary: accepted
      ? securityRlsInputSanitizationContractBoundaryMap.boundaryMapSummary
      : null,
    boundaryEntries: accepted
      ? securityRlsInputSanitizationContractBoundaryMap.boundaryEntries
      : [],
    invalidBoundaryCasePolicy: accepted
      ? securityRlsInputSanitizationContractBoundaryMap.invalidBoundaryCasePolicy
      : securityRlsInputSanitizationBoundaryMapValidationRules(),
    topSecurityRlsAuthDatabaseFabricApiBackendGaps: accepted
      ? securityRlsInputSanitizationContractBoundaryMap
          .topSecurityRlsAuthDatabaseFabricApiBackendGaps
      : [],
    recommendedNextPhase: accepted
      ? securityRlsInputSanitizationContractBoundaryMap.recommendedNextPhase
      : null,
    securityRlsInputSanitizationContractBoundaryMapOnly: true,
    reviewOnly: true,
    metadataOnly: true,
    authoritative: false,
    nonAuthorizingProof: true,
    reportRunsChecks: false,
    ...securityRlsInputSanitizationBoundaryMapFalseRuntimeFields(),
    rejectionReasons: accepted
      ? []
      : [
          {
            classification,
            rejected: true,
            runtimeAuthorized: false,
            securityRuntimeAuthorized: false,
            commandExposureAuthorized: false,
            reportRunsChecks: false
          }
        ],
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

export function createSecurityRlsInputSanitizationContractBoundaryMapForReview(
  input = {}
) {
  const inputRecord =
    securityRlsInputSanitizationBoundaryMapInputRecord(input);
  const reviewedAt =
    securityRlsInputSanitizationBoundaryMapReviewedAt(inputRecord);
  const reviewedAtDefaulted = isReviewedAtDefaulted(inputRecord);
  const classification =
    securityRlsInputSanitizationBoundaryMapInputClassification(inputRecord);
  const accepted =
    classification ===
    VALID_SECURITY_RLS_INPUT_SANITIZATION_CONTRACT_BOUNDARY_MAP_CLASSIFICATION;
  const securityRlsInputSanitizationContractBoundaryMap = accepted
    ? securityRlsInputSanitizationBoundaryMapState(reviewedAt)
    : null;

  return securityRlsInputSanitizationBoundaryMapResult({
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    accepted,
    securityRlsInputSanitizationContractBoundaryMap
  });
}

const RATE_LIMITING_ABUSE_CONTROL_CONTRACT_BOUNDARY_MAP_STATE_SCHEMA =
  "ardyn.phase-5.64.rate-limiting-abuse-control-contract-boundary-map-state";
const VALID_RATE_LIMITING_ABUSE_CONTROL_CONTRACT_BOUNDARY_MAP_CLASSIFICATION =
  "valid_rate_limiting_abuse_control_contract_boundary_map_runtime_still_blocked";
const MALFORMED_RATE_LIMITING_ABUSE_CONTROL_CONTRACT_BOUNDARY_MAP_CLASSIFICATION =
  "malformed_rate_limiting_abuse_control_contract_boundary_map_input_rejected";

const RATE_LIMITING_ABUSE_CONTROL_BOUNDARY_FAMILIES = Object.freeze([
  "rate_limit_contract",
  "quota_contract",
  "throttle_contract",
  "abuse_detection_contract",
  "denial_of_service_boundary",
  "backpressure_contract",
  "retry_budget_contract",
  "idempotency_contract",
  "request_cost_contract",
  "encoded_handoff_abuse_boundary",
  "fabric_coordination_abuse_boundary",
  "connector_abuse_boundary",
  "secure_drop_abuse_boundary"
]);
const RATE_LIMITING_ABUSE_CONTROL_BOUNDARY_RELATED_SYSTEMS = Object.freeze([
  "ardyn",
  "ardyn-subagent",
  "locus",
  "multiverse",
  "content-fabric",
  "repo-family"
]);
const RATE_LIMITING_ABUSE_CONTROL_BOUNDARY_STATUSES = Object.freeze([
  "metadata_only",
  "blocked",
  "future_contract_required"
]);
const RATE_LIMITING_ABUSE_CONTROL_BOUNDARY_REQUIRED_FIELDS = Object.freeze([
  "boundaryId",
  "boundaryFamily",
  "relatedSystem",
  "currentStatus",
  "allowedCurrentBehavior",
  "forbiddenCurrentBehavior",
  "requiredFutureContractBeforeImplementation",
  "requiredFutureAuthorizationPhaseBeforeRuntime",
  "requestIdentityExpectation",
  "quotaSubjectExpectation",
  "backpressureExpectation",
  "retryIdempotencyExpectation",
  "abuseSignalExpectation",
  "locusRoleDescription",
  "multiverseRoleDescription",
  "fabricRoleDescription",
  "secureDropRoleDescription",
  "explicitBlockedAuthorizationFlags",
  "unsafeRateLimitingAbuseControlRuntimeFlags",
  "nonAuthorizingProof"
]);
const RATE_LIMITING_ABUSE_CONTROL_BOUNDARY_ALLOWED_TOP_LEVEL_FIELDS =
  Object.freeze(["reviewedAt", "boundaryEntries"]);
const RATE_LIMITING_ABUSE_CONTROL_BOUNDARY_UNSAFE_FIELDS = Object.freeze([
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
  "reportRunsChecks",
  "blockedCliBypassEnabled"
]);
const RATE_LIMITING_ABUSE_CONTROL_BOUNDARY_AUTHORIZATION_FIELDS =
  Object.freeze([
    "runtimeAuthorized",
    "runtimeAuthorizationGranted",
    "limiterRuntimeAuthorizationGranted",
    "quotaEngineAuthorizationGranted",
    "throttleRuntimeAuthorizationGranted",
    "abuseDetectorAuthorizationGranted",
    "queueSchedulerAuthorizationGranted",
    "retryRuntimeAuthorizationGranted",
    "circuitBreakerAuthorizationGranted",
    "idempotencyStoreAuthorizationGranted",
    "backendApiServerAuthorizationGranted",
    "storageWriteAuthorizationGranted",
    "connectorGrantAuthorizationGranted",
    "fabricRuntimeAuthorizationGranted",
    "secureDropAuthorizationGranted",
    "encodedHandoffRuntimeAuthorizationGranted",
    "commandExposureAuthorizationGranted",
    "approvalDecisionProduced",
    "approvalGrantProduced",
    "authorizesRuntime"
  ]);
const RATE_LIMITING_ABUSE_CONTROL_BOUNDARY_COMMAND_FIELDS = Object.freeze([
  "commandExposureEnabled",
  "commandRuntimeControlEnabled",
  "commandsExposed",
  "exposesCommands",
  "runtimeCommandEnabled",
  "cliCommandExposed"
]);
const RATE_LIMITING_ABUSE_CONTROL_BOUNDARY_BLOCKED_CLI_BYPASS_FIELDS =
  Object.freeze([
    "blockedCliBypassEnabled",
    "dryRunBypassesBlock",
    "serveRuntimeBypassEnabled",
    "bypassBlockedCommandBehavior",
    "blockedCommandOverride"
  ]);
const RATE_LIMITING_ABUSE_CONTROL_BOUNDARY_RATE_LIMIT_FIELDS = Object.freeze([
  "rateLimitMiddleware",
  "rateLimiterMiddleware",
  "limiterMiddleware",
  "throttleMiddleware",
  "expressRateLimit",
  "apiRateLimitHandler",
  "requestLimiterRuntime"
]);
const RATE_LIMITING_ABUSE_CONTROL_BOUNDARY_QUOTA_FIELDS = Object.freeze([
  "quotaEngine",
  "quotaStore",
  "quotaCounter",
  "quotaBucket",
  "quotaToken",
  "quotaLedger",
  "quotaDb"
]);
const RATE_LIMITING_ABUSE_CONTROL_BOUNDARY_ABUSE_FIELDS = Object.freeze([
  "abuseDetector",
  "abuseScanner",
  "abuseSignalScanner",
  "dosDetector",
  "botDetector",
  "trafficScanner",
  "liveTrafficAnalyzer"
]);
const RATE_LIMITING_ABUSE_CONTROL_BOUNDARY_RETRY_FIELDS = Object.freeze([
  "retryEngine",
  "retryQueue",
  "retryScheduler",
  "circuitBreaker",
  "breakerState",
  "backoffScheduler",
  "resiliencePolicyRuntime"
]);
const RATE_LIMITING_ABUSE_CONTROL_BOUNDARY_IDEMPOTENCY_FIELDS =
  Object.freeze([
    "idempotencyStore",
    "idempotencyKeyStore",
    "dedupeStore",
    "requestReplayStore",
    "idempotencyDatabase",
    "idempotencyCache"
  ]);
const RATE_LIMITING_ABUSE_CONTROL_BOUNDARY_BACKEND_FIELDS = Object.freeze([
  "backendApiMiddleware",
  "apiRequestHandler",
  "httpServer",
  "serverMiddleware",
  "httpEndpoint",
  "runtimeEndpoint"
]);
const RATE_LIMITING_ABUSE_CONTROL_BOUNDARY_DATABASE_STORAGE_FIELDS =
  Object.freeze([
    "databaseUrl",
    "databaseDsn",
    "dbConnectionString",
    "storageAdapter",
    "cacheEngine",
    "writeQueue",
    "persistenceLayer",
    "filesystemWrite",
    "auditWriter",
    "transcriptWriter"
  ]);
const RATE_LIMITING_ABUSE_CONTROL_BOUNDARY_AUTH_FIELDS = Object.freeze([
  "loginUrl",
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
const RATE_LIMITING_ABUSE_CONTROL_BOUNDARY_CONNECTOR_FIELDS = Object.freeze([
  "connectorGrant",
  "connectorCredential",
  "connectorAccessToken",
  "connectorScanner",
  "connectorIngestionGrant"
]);
const RATE_LIMITING_ABUSE_CONTROL_BOUNDARY_FABRIC_RUNTIME_FIELDS =
  Object.freeze([
    "fabricBusTopic",
    "fabricBrokerUrl",
    "websocketUrl",
    "mcpToolName",
    "mcpServerUrl",
    "taskExecutor",
    "taskRunner",
    "adapterRuntime"
  ]);
const RATE_LIMITING_ABUSE_CONTROL_BOUNDARY_SECURE_DROP_FIELDS =
  Object.freeze([
    "secureDropPayloadPath",
    "secureDropKeyring",
    "secureDropCryptoImplemented",
    "secureDropTransportImplemented",
    "secureDropStegoImplemented",
    "secureDropSendReceiveImplemented",
    "secureDropInboxPollingEnabled",
    "secureDropFileSelection",
    "st3ggPayload"
  ]);
const RATE_LIMITING_ABUSE_CONTROL_BOUNDARY_ENCODED_HANDOFF_FIELDS =
  Object.freeze([
    "codecImplemented",
    "translatorRuntimeImplemented",
    "encoderImplemented",
    "decoderImplemented",
    "conlangGenerator",
    "semanticStegoCandidate",
    "steganographyCandidate",
    "tokenExploitationCandidate",
    "covertChannel",
    "guardrailBypass",
    "hiddenPayload"
  ]);

function rateLimitingAbuseControlBoundaryMapInputRecord(input) {
  return isPlainObjectRecord(input) ? input : null;
}

function rateLimitingAbuseControlBoundaryMapReviewedAt(inputRecord) {
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

function rateLimitingAbuseControlBoundaryMapInputMalformed(inputRecord) {
  return (
    inputRecord === null ||
    (Object.prototype.hasOwnProperty.call(inputRecord, "reviewedAt") &&
      !isUtcIsoTimestampWithMilliseconds(inputRecord.reviewedAt)) ||
    (Object.prototype.hasOwnProperty.call(inputRecord, "boundaryEntries") &&
      !Array.isArray(inputRecord.boundaryEntries))
  );
}

function rateLimitingAbuseControlBoundaryMapInputEntries(inputRecord) {
  return Array.isArray(inputRecord?.boundaryEntries)
    ? inputRecord.boundaryEntries
    : null;
}

function rateLimitingAbuseControlBoundaryMapContainsTrue(value) {
  if (value === true) {
    return true;
  }

  if (Array.isArray(value)) {
    return value.some(rateLimitingAbuseControlBoundaryMapContainsTrue);
  }

  if (isPlainObjectRecord(value)) {
    return Object.values(value).some(
      rateLimitingAbuseControlBoundaryMapContainsTrue
    );
  }

  return false;
}

function rateLimitingAbuseControlBoundaryMapHasTrueFieldDeep(value, fields) {
  if (Array.isArray(value)) {
    return value.some((item) =>
      rateLimitingAbuseControlBoundaryMapHasTrueFieldDeep(item, fields)
    );
  }

  if (!isPlainObjectRecord(value)) {
    return false;
  }

  for (const [key, nested] of Object.entries(value)) {
    if (fields.includes(key) && nested === true) {
      return true;
    }

    if (rateLimitingAbuseControlBoundaryMapHasTrueFieldDeep(nested, fields)) {
      return true;
    }
  }

  return false;
}

function rateLimitingAbuseControlBoundaryMapHasPresentFieldDeep(
  value,
  fields
) {
  if (Array.isArray(value)) {
    return value.some((item) =>
      rateLimitingAbuseControlBoundaryMapHasPresentFieldDeep(item, fields)
    );
  }

  if (!isPlainObjectRecord(value)) {
    return false;
  }

  for (const [key, nested] of Object.entries(value)) {
    if (
      key === "explicitBlockedAuthorizationFlags" ||
      key === "unsafeRateLimitingAbuseControlRuntimeFlags"
    ) {
      continue;
    }

    if (fields.includes(key)) {
      return true;
    }

    if (
      rateLimitingAbuseControlBoundaryMapHasPresentFieldDeep(nested, fields)
    ) {
      return true;
    }
  }

  return false;
}

function rateLimitingAbuseControlBoundaryMapContainsEntryIssue(
  entries,
  predicate
) {
  return entries !== null && entries.some((entry) => predicate(entry));
}

function rateLimitingAbuseControlBoundaryMapMissingRequiredField(entry) {
  if (!isPlainObjectRecord(entry)) {
    return true;
  }

  return RATE_LIMITING_ABUSE_CONTROL_BOUNDARY_REQUIRED_FIELDS.some(
    (field) => !Object.prototype.hasOwnProperty.call(entry, field)
  );
}

function rateLimitingAbuseControlBoundaryMapEntryMalformed(entry) {
  if (!isPlainObjectRecord(entry)) {
    return true;
  }

  return (
    typeof entry.boundaryId !== "string" ||
    !Array.isArray(entry.allowedCurrentBehavior) ||
    !Array.isArray(entry.forbiddenCurrentBehavior) ||
    typeof entry.requiredFutureContractBeforeImplementation !== "string" ||
    typeof entry.requiredFutureAuthorizationPhaseBeforeRuntime !== "string" ||
    typeof entry.requestIdentityExpectation !== "string" ||
    typeof entry.quotaSubjectExpectation !== "string" ||
    typeof entry.backpressureExpectation !== "string" ||
    typeof entry.retryIdempotencyExpectation !== "string" ||
    typeof entry.abuseSignalExpectation !== "string" ||
    typeof entry.locusRoleDescription !== "string" ||
    typeof entry.multiverseRoleDescription !== "string" ||
    typeof entry.fabricRoleDescription !== "string" ||
    typeof entry.secureDropRoleDescription !== "string" ||
    !isPlainObjectRecord(entry.explicitBlockedAuthorizationFlags) ||
    !isPlainObjectRecord(entry.unsafeRateLimitingAbuseControlRuntimeFlags) ||
    entry.nonAuthorizingProof !== true
  );
}

function rateLimitingAbuseControlBoundaryMapAuthorizationFlagEnabled(value) {
  if (!isPlainObjectRecord(value)) {
    return false;
  }

  return (
    (isPlainObjectRecord(value.explicitBlockedAuthorizationFlags) &&
      Object.values(value.explicitBlockedAuthorizationFlags).some(
        (flag) => flag !== false
      )) ||
    RATE_LIMITING_ABUSE_CONTROL_BOUNDARY_AUTHORIZATION_FIELDS.some(
      (field) => value[field] === true
    )
  );
}

function rateLimitingAbuseControlBoundaryMapUnsafeFlagEnabled(value) {
  if (!isPlainObjectRecord(value)) {
    return false;
  }

  return (
    (isPlainObjectRecord(value.unsafeRateLimitingAbuseControlRuntimeFlags) &&
      Object.values(value.unsafeRateLimitingAbuseControlRuntimeFlags).some(
        (flag) => flag !== false
      )) ||
    rateLimitingAbuseControlBoundaryMapHasTrueFieldDeep(
      value,
      RATE_LIMITING_ABUSE_CONTROL_BOUNDARY_UNSAFE_FIELDS
    )
  );
}

function rateLimitingAbuseControlBoundaryMapHasUnknownTopLevelField(
  inputRecord
) {
  if (inputRecord === null) {
    return false;
  }

  return Object.keys(inputRecord).some(
    (field) =>
      !RATE_LIMITING_ABUSE_CONTROL_BOUNDARY_ALLOWED_TOP_LEVEL_FIELDS.includes(
        field
      )
  );
}

function rateLimitingAbuseControlBoundaryMapCanonical(entries) {
  if (entries === null) {
    return true;
  }

  return (
    JSON.stringify(entries) ===
    JSON.stringify(rateLimitingAbuseControlBoundaryMapEntries())
  );
}

function rateLimitingAbuseControlBoundaryMapInputClassification(inputRecord) {
  if (rateLimitingAbuseControlBoundaryMapInputMalformed(inputRecord)) {
    return MALFORMED_RATE_LIMITING_ABUSE_CONTROL_CONTRACT_BOUNDARY_MAP_CLASSIFICATION;
  }

  const entries =
    rateLimitingAbuseControlBoundaryMapInputEntries(inputRecord);

  if (
    rateLimitingAbuseControlBoundaryMapContainsEntryIssue(
      entries,
      rateLimitingAbuseControlBoundaryMapMissingRequiredField
    )
  ) {
    return "missing_required_rate_limiting_abuse_control_contract_boundary_entry_rejected";
  }

  if (
    rateLimitingAbuseControlBoundaryMapContainsEntryIssue(
      entries,
      (entry) =>
        !RATE_LIMITING_ABUSE_CONTROL_BOUNDARY_FAMILIES.includes(
          entry.boundaryFamily
        )
    )
  ) {
    return "unknown_boundary_family_rate_limiting_abuse_control_contract_boundary_map_input_rejected";
  }

  if (
    rateLimitingAbuseControlBoundaryMapContainsEntryIssue(
      entries,
      (entry) =>
        !RATE_LIMITING_ABUSE_CONTROL_BOUNDARY_RELATED_SYSTEMS.includes(
          entry.relatedSystem
        )
    )
  ) {
    return "unknown_related_system_rate_limiting_abuse_control_contract_boundary_map_input_rejected";
  }

  if (
    rateLimitingAbuseControlBoundaryMapContainsEntryIssue(
      entries,
      (entry) =>
        !RATE_LIMITING_ABUSE_CONTROL_BOUNDARY_STATUSES.includes(
          entry.currentStatus
        )
    )
  ) {
    return "unknown_current_status_rate_limiting_abuse_control_contract_boundary_map_input_rejected";
  }

  if (
    rateLimitingAbuseControlBoundaryMapContainsEntryIssue(
      entries,
      rateLimitingAbuseControlBoundaryMapEntryMalformed
    )
  ) {
    return MALFORMED_RATE_LIMITING_ABUSE_CONTROL_CONTRACT_BOUNDARY_MAP_CLASSIFICATION;
  }

  if (
    rateLimitingAbuseControlBoundaryMapContainsEntryIssue(
      entries,
      rateLimitingAbuseControlBoundaryMapAuthorizationFlagEnabled
    ) ||
    rateLimitingAbuseControlBoundaryMapAuthorizationFlagEnabled(inputRecord)
  ) {
    return "authorization_flags_enabled_rate_limiting_abuse_control_contract_boundary_map_input_rejected";
  }

  if (
    rateLimitingAbuseControlBoundaryMapHasTrueFieldDeep(inputRecord, [
      "reportRunsChecks"
    ])
  ) {
    return "report_runs_checks_true_rate_limiting_abuse_control_contract_boundary_map_input_rejected";
  }

  if (
    rateLimitingAbuseControlBoundaryMapHasTrueFieldDeep(
      inputRecord,
      RATE_LIMITING_ABUSE_CONTROL_BOUNDARY_AUTHORIZATION_FIELDS
    )
  ) {
    return "runtime_authorization_attempt_rate_limiting_abuse_control_contract_boundary_map_input_rejected";
  }

  if (
    rateLimitingAbuseControlBoundaryMapHasTrueFieldDeep(
      inputRecord,
      RATE_LIMITING_ABUSE_CONTROL_BOUNDARY_COMMAND_FIELDS
    )
  ) {
    return "command_exposure_attempt_rate_limiting_abuse_control_contract_boundary_map_input_rejected";
  }

  if (
    rateLimitingAbuseControlBoundaryMapHasTrueFieldDeep(
      inputRecord,
      RATE_LIMITING_ABUSE_CONTROL_BOUNDARY_BLOCKED_CLI_BYPASS_FIELDS
    )
  ) {
    return "blocked_cli_bypass_attempt_rate_limiting_abuse_control_contract_boundary_map_input_rejected";
  }

  if (
    rateLimitingAbuseControlBoundaryMapHasPresentFieldDeep(
      inputRecord,
      RATE_LIMITING_ABUSE_CONTROL_BOUNDARY_RATE_LIMIT_FIELDS
    )
  ) {
    return "hidden_rate_limit_middleware_semantics_rate_limiting_abuse_control_contract_boundary_map_input_rejected";
  }

  if (
    rateLimitingAbuseControlBoundaryMapHasPresentFieldDeep(
      inputRecord,
      RATE_LIMITING_ABUSE_CONTROL_BOUNDARY_QUOTA_FIELDS
    )
  ) {
    return "hidden_quota_engine_semantics_rate_limiting_abuse_control_contract_boundary_map_input_rejected";
  }

  if (
    rateLimitingAbuseControlBoundaryMapHasPresentFieldDeep(
      inputRecord,
      RATE_LIMITING_ABUSE_CONTROL_BOUNDARY_ABUSE_FIELDS
    )
  ) {
    return "hidden_abuse_detector_runtime_scanner_semantics_rate_limiting_abuse_control_contract_boundary_map_input_rejected";
  }

  if (
    rateLimitingAbuseControlBoundaryMapHasPresentFieldDeep(
      inputRecord,
      RATE_LIMITING_ABUSE_CONTROL_BOUNDARY_RETRY_FIELDS
    )
  ) {
    return "hidden_retry_circuit_breaker_execution_semantics_rate_limiting_abuse_control_contract_boundary_map_input_rejected";
  }

  if (
    rateLimitingAbuseControlBoundaryMapHasPresentFieldDeep(
      inputRecord,
      RATE_LIMITING_ABUSE_CONTROL_BOUNDARY_IDEMPOTENCY_FIELDS
    )
  ) {
    return "hidden_idempotency_persistence_semantics_rate_limiting_abuse_control_contract_boundary_map_input_rejected";
  }

  if (
    rateLimitingAbuseControlBoundaryMapHasPresentFieldDeep(
      inputRecord,
      RATE_LIMITING_ABUSE_CONTROL_BOUNDARY_BACKEND_FIELDS
    )
  ) {
    return "hidden_backend_api_server_semantics_rate_limiting_abuse_control_contract_boundary_map_input_rejected";
  }

  if (
    rateLimitingAbuseControlBoundaryMapHasPresentFieldDeep(
      inputRecord,
      RATE_LIMITING_ABUSE_CONTROL_BOUNDARY_DATABASE_STORAGE_FIELDS
    )
  ) {
    return "hidden_database_storage_cache_write_semantics_rate_limiting_abuse_control_contract_boundary_map_input_rejected";
  }

  if (
    rateLimitingAbuseControlBoundaryMapHasPresentFieldDeep(
      inputRecord,
      RATE_LIMITING_ABUSE_CONTROL_BOUNDARY_AUTH_FIELDS
    )
  ) {
    return "hidden_auth_session_token_api_key_semantics_rate_limiting_abuse_control_contract_boundary_map_input_rejected";
  }

  if (
    rateLimitingAbuseControlBoundaryMapHasPresentFieldDeep(
      inputRecord,
      RATE_LIMITING_ABUSE_CONTROL_BOUNDARY_CONNECTOR_FIELDS
    )
  ) {
    return "hidden_connector_grant_semantics_rate_limiting_abuse_control_contract_boundary_map_input_rejected";
  }

  if (
    rateLimitingAbuseControlBoundaryMapHasPresentFieldDeep(
      inputRecord,
      RATE_LIMITING_ABUSE_CONTROL_BOUNDARY_FABRIC_RUNTIME_FIELDS
    )
  ) {
    return "hidden_fabric_websocket_http_mcp_task_runtime_semantics_rate_limiting_abuse_control_contract_boundary_map_input_rejected";
  }

  if (
    rateLimitingAbuseControlBoundaryMapHasPresentFieldDeep(
      inputRecord,
      RATE_LIMITING_ABUSE_CONTROL_BOUNDARY_SECURE_DROP_FIELDS
    )
  ) {
    return "hidden_secure_drop_implementation_semantics_rate_limiting_abuse_control_contract_boundary_map_input_rejected";
  }

  if (
    rateLimitingAbuseControlBoundaryMapHasPresentFieldDeep(
      inputRecord,
      RATE_LIMITING_ABUSE_CONTROL_BOUNDARY_ENCODED_HANDOFF_FIELDS
    )
  ) {
    return "hidden_encoded_handoff_codec_translator_stego_covert_channel_tokenizer_exploit_bypass_semantics_rate_limiting_abuse_control_contract_boundary_map_input_rejected";
  }

  if (
    rateLimitingAbuseControlBoundaryMapUnsafeFlagEnabled(inputRecord) ||
    rateLimitingAbuseControlBoundaryMapContainsEntryIssue(
      entries,
      rateLimitingAbuseControlBoundaryMapUnsafeFlagEnabled
    )
  ) {
    return "unsafe_limiter_quota_throttle_abuse_queue_scheduler_retry_circuit_breaker_idempotency_cost_backend_storage_runtime_flags_rate_limiting_abuse_control_contract_boundary_map_input_rejected";
  }

  if (
    rateLimitingAbuseControlBoundaryMapContainsEntryIssue(
      entries,
      (entry) =>
        rateLimitingAbuseControlBoundaryMapContainsTrue(entry?.runtimeEffect)
    ) ||
    rateLimitingAbuseControlBoundaryMapContainsTrue(inputRecord?.runtimeEffect)
  ) {
    return "nested_unsafe_flags_rate_limiting_abuse_control_contract_boundary_map_input_rejected";
  }

  if (rateLimitingAbuseControlBoundaryMapHasUnknownTopLevelField(inputRecord)) {
    return "unknown_top_level_field_rate_limiting_abuse_control_contract_boundary_map_input_rejected";
  }

  if (!rateLimitingAbuseControlBoundaryMapCanonical(entries)) {
    return "noncanonical_rate_limiting_abuse_control_contract_boundary_map_input_rejected";
  }

  return VALID_RATE_LIMITING_ABUSE_CONTROL_CONTRACT_BOUNDARY_MAP_CLASSIFICATION;
}

function rateLimitingAbuseControlBoundaryMapAuthorizationFlags() {
  return {
    limiterRuntimeAuthorizationGranted: false,
    quotaEngineAuthorizationGranted: false,
    throttleRuntimeAuthorizationGranted: false,
    abuseDetectorAuthorizationGranted: false,
    queueSchedulerAuthorizationGranted: false,
    retryRuntimeAuthorizationGranted: false,
    circuitBreakerAuthorizationGranted: false,
    idempotencyStoreAuthorizationGranted: false,
    backendApiServerAuthorizationGranted: false,
    storageWriteAuthorizationGranted: false,
    connectorGrantAuthorizationGranted: false,
    fabricRuntimeAuthorizationGranted: false,
    websocketHttpRuntimeAuthorizationGranted: false,
    mcpToolExposureAuthorizationGranted: false,
    taskExecutionAuthorizationGranted: false,
    secureDropAuthorizationGranted: false,
    encodedHandoffRuntimeAuthorizationGranted: false,
    commandExposureAuthorizationGranted: false,
    approvalDecisionProduced: false,
    approvalGrantProduced: false,
    connectorGrantProduced: false,
    authorizesRuntime: false
  };
}

function rateLimitingAbuseControlBoundaryMapUnsafeFlags() {
  return Object.fromEntries(
    RATE_LIMITING_ABUSE_CONTROL_BOUNDARY_UNSAFE_FIELDS.map((field) => [
      field,
      false
    ])
  );
}

function rateLimitingAbuseControlBoundaryMapCommonNotes() {
  return {
    noConsumerRole:
      "No current runtime role; future consumers may inspect metadata only.",
    currentAuthorization:
      "Requires a future rate-limiting, abuse-control, backend, storage, auth, security, runtime, command exposure, connector, Fabric, Secure Drop, MCP/task, filesystem/process-control, and approval authorization phase before any executable behavior.",
    fabricMetadataOnly:
      "Fabric remains a future coordination envelope metadata layer, not a bus, broker, transport, adapter, connector, registry, scheduler, importer, exporter, package distributor, limiter, queue, or task executor.",
    secureDropContentFabric:
      "Secure Drop abuse-control metadata remains a future content-fabric contract; Ardyn records references only and implements no compose/inbox limiter, crypto, transport, stego, send/receive, inbox polling, file selection, connector ingestion, secret/vault/env access, or ST3GG wrapping."
  };
}

function rateLimitingAbuseControlBoundaryMapEntry(definition) {
  return {
    boundaryId: definition.boundaryId,
    boundaryFamily: definition.boundaryFamily,
    relatedSystem: definition.relatedSystem,
    currentStatus: definition.currentStatus,
    allowedCurrentBehavior: definition.allowedCurrentBehavior,
    forbiddenCurrentBehavior:
      rateLimitingAbuseControlBoundaryMapForbiddenBehavior(),
    requiredFutureContractBeforeImplementation:
      definition.requiredFutureContractBeforeImplementation,
    requiredFutureAuthorizationPhaseBeforeRuntime:
      definition.requiredFutureAuthorizationPhaseBeforeRuntime,
    requestIdentityExpectation: definition.requestIdentityExpectation,
    quotaSubjectExpectation: definition.quotaSubjectExpectation,
    backpressureExpectation: definition.backpressureExpectation,
    retryIdempotencyExpectation: definition.retryIdempotencyExpectation,
    abuseSignalExpectation: definition.abuseSignalExpectation,
    locusRoleDescription: definition.locusRoleDescription,
    multiverseRoleDescription: definition.multiverseRoleDescription,
    fabricRoleDescription: definition.fabricRoleDescription,
    secureDropRoleDescription: definition.secureDropRoleDescription,
    productionReadinessAreaReference: {
      phase: "5.48",
      areaNumber: 9,
      areaName: "Rate Limiting",
      sourceFixture:
        "tests/fixtures/host-policy/phase5-48/production-readiness-coverage-matrix.json",
      sourceStatus: "deferred",
      representedByPhase564: true,
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
    phase560InterAgentEncodedHandoffConformanceReference: {
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
    phase562AuthPermissionsContractBoundaryReference: {
      phase: "5.62",
      sourceFixture:
        "tests/fixtures/host-policy/phase5-62/auth-permissions-contract-boundary-map.json",
      authPermissionsBoundaryReferenced: true,
      implementsAuthPermissionsRuntime: false,
      authorizesRuntime: false
    },
    phase563SecurityRlsInputSanitizationBoundaryReference: {
      phase: "5.63",
      sourceFixture:
        "tests/fixtures/host-policy/phase5-63/security-rls-input-sanitization-contract-boundary-map.json",
      securityRlsInputSanitizationBoundaryReferenced: true,
      implementsSecurityRuntime: false,
      authorizesRuntime: false
    },
    rateLimitingAbuseControlBoundaryMetadataOnly: true,
    noLiveTrafficHandlingPerformed: true,
    explicitBlockedAuthorizationFlags:
      rateLimitingAbuseControlBoundaryMapAuthorizationFlags(),
    unsafeRateLimitingAbuseControlRuntimeFlags:
      rateLimitingAbuseControlBoundaryMapUnsafeFlags(),
    nonAuthorizingProof: true,
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

function rateLimitingAbuseControlBoundaryMapDefinition({
  boundaryId,
  boundaryFamily,
  relatedSystem,
  currentStatus,
  subject,
  requestIdentityExpectation,
  quotaSubjectExpectation,
  backpressureExpectation,
  retryIdempotencyExpectation,
  abuseSignalExpectation,
  locusRole,
  multiverseRole,
  fabricRole,
  secureDropRole
}) {
  const notes = rateLimitingAbuseControlBoundaryMapCommonNotes();

  return {
    boundaryId,
    boundaryFamily,
    relatedSystem,
    currentStatus,
    allowedCurrentBehavior: [
      `Describe future ${subject} rate-limiting and abuse-control boundary metadata.`,
      "Keep current behavior review-only, metadata-only, non-authorizing, and runtime-blocked."
    ],
    requiredFutureContractBeforeImplementation:
      `A future ${subject} contract must define request identity, quota subject, backpressure, retry/idempotency, abuse signals, storage boundaries, failure modes, consumer ownership, and explicit no-runtime defaults before implementation.`,
    requiredFutureAuthorizationPhaseBeforeRuntime: notes.currentAuthorization,
    requestIdentityExpectation,
    quotaSubjectExpectation,
    backpressureExpectation,
    retryIdempotencyExpectation,
    abuseSignalExpectation,
    locusRoleDescription: locusRole ?? notes.noConsumerRole,
    multiverseRoleDescription: multiverseRole ?? notes.noConsumerRole,
    fabricRoleDescription: fabricRole ?? notes.fabricMetadataOnly,
    secureDropRoleDescription: secureDropRole ?? "Not applicable."
  };
}

function rateLimitingAbuseControlBoundaryMapDefinitions() {
  const notes = rateLimitingAbuseControlBoundaryMapCommonNotes();
  const metadataOnlyIdentity =
    "Future request identity must be explicit metadata only now; Ardyn performs no login, session, token, API-key, IP, user-agent, connector, or runtime subject inspection.";
  const metadataOnlyQuota =
    "Future quota subjects must be defined by a separate auth/storage contract; Ardyn creates no counters, buckets, ledgers, stores, or write paths now.";
  const noBackpressureRuntime =
    "Backpressure remains planning metadata only; Ardyn creates no queue, scheduler, worker, breaker, retry loop, timer, polling loop, or live traffic handler.";
  const noRetryRuntime =
    "Retry and idempotency remain future contract metadata only; Ardyn creates no retry engine, circuit breaker, idempotency store, replay store, or persistence.";
  const metadataOnlySignals =
    "Abuse signals are review metadata only and cannot scan traffic, block requests, emit grants, expose commands, or authorize runtime.";

  return [
    rateLimitingAbuseControlBoundaryMapDefinition({
      boundaryId:
        "phase5-64.repo_family.backend_api_request_rate_limit.rate_limit_boundary",
      boundaryFamily: "rate_limit_contract",
      relatedSystem: "repo-family",
      currentStatus: "future_contract_required",
      subject: "backend/API request rate-limit",
      requestIdentityExpectation: metadataOnlyIdentity,
      quotaSubjectExpectation:
        "Future backend/API quotas require explicit subject, route, method, scope, and storage ownership before any endpoint exists.",
      backpressureExpectation: noBackpressureRuntime,
      retryIdempotencyExpectation: noRetryRuntime,
      abuseSignalExpectation:
        "Future backend/API abuse signals must be advisory until a separate server, storage, and enforcement contract is authorized.",
      fabricRole: notes.fabricMetadataOnly
    }),
    rateLimitingAbuseControlBoundaryMapDefinition({
      boundaryId:
        "phase5-64.ardyn.cli_command_invocation_abuse.abuse_detection_boundary",
      boundaryFamily: "abuse_detection_contract",
      relatedSystem: "ardyn",
      currentStatus: "metadata_only",
      subject: "CLI command invocation abuse",
      requestIdentityExpectation:
        "Future CLI invocation metadata may describe command identity expectations but cannot add command exposure, process control, stdin loops, or stdout/stderr runtime writers.",
      quotaSubjectExpectation:
        "Future CLI quota subjects require a separate command-surface contract; current blocked commands still fail closed.",
      backpressureExpectation: noBackpressureRuntime,
      retryIdempotencyExpectation: noRetryRuntime,
      abuseSignalExpectation:
        "Current CLI abuse metadata is descriptive only and cannot alter blocked CLI behavior or reportRunsChecks."
    }),
    rateLimitingAbuseControlBoundaryMapDefinition({
      boundaryId:
        "phase5-64.ardyn.future_runtime_command_throttle.throttle_boundary",
      boundaryFamily: "throttle_contract",
      relatedSystem: "ardyn",
      currentStatus: "blocked",
      subject: "future runtime command throttle",
      requestIdentityExpectation:
        "Future runtime command throttles need explicit operator, process, workspace, and approval identity before runtime exists.",
      quotaSubjectExpectation:
        "Future command quotas require approval-bound scope and denial defaults; metadata cannot grant execution.",
      backpressureExpectation: noBackpressureRuntime,
      retryIdempotencyExpectation: noRetryRuntime,
      abuseSignalExpectation:
        "Command throttle signals cannot expose commands, authorize runtime, or bypass default-blocked serve-runtime behavior."
    }),
    rateLimitingAbuseControlBoundaryMapDefinition({
      boundaryId:
        "phase5-64.ardyn_subagent.encoded_handoff_abuse.encoded_handoff_abuse_boundary",
      boundaryFamily: "encoded_handoff_abuse_boundary",
      relatedSystem: "ardyn-subagent",
      currentStatus: "future_contract_required",
      subject: "subagent encoded handoff abuse",
      requestIdentityExpectation:
        "Future encoded handoff identities require visible source, target, operator translation, and audit metadata; no codec or transport identity exists now.",
      quotaSubjectExpectation:
        "Future encoded handoff quota subjects must not be inferred from encoded content, hidden payloads, tokens, or bypass strings.",
      backpressureExpectation: noBackpressureRuntime,
      retryIdempotencyExpectation: noRetryRuntime,
      abuseSignalExpectation:
        "Encoded handoff abuse metadata must reject stego, covert-channel, tokenizer-exploit, bypass, codec, translator runtime, encoder, decoder, conlang, and hidden-payload semantics.",
      fabricRole: notes.fabricMetadataOnly
    }),
    rateLimitingAbuseControlBoundaryMapDefinition({
      boundaryId:
        "phase5-64.repo_family.fabric_coordination_envelope_abuse.fabric_coordination_abuse_boundary",
      boundaryFamily: "fabric_coordination_abuse_boundary",
      relatedSystem: "repo-family",
      currentStatus: "future_contract_required",
      subject: "Fabric coordination-envelope abuse",
      requestIdentityExpectation:
        "Future Fabric envelope rate metadata needs explicit envelope source, target, family, and operator visibility; no Fabric runtime identity exists now.",
      quotaSubjectExpectation:
        "Future Fabric quotas must not create bus topics, broker state, adapter routes, registry entries, package paths, or task queues.",
      backpressureExpectation: noBackpressureRuntime,
      retryIdempotencyExpectation: noRetryRuntime,
      abuseSignalExpectation:
        "Fabric abuse signals remain metadata only and cannot become a bus, broker, transport, adapter, connector, registry, scheduler, importer, exporter, package distributor, or task executor.",
      locusRole:
        "Locus may later display Fabric abuse-control metadata only.",
      multiverseRole:
        "Multiverse may later display Fabric abuse-control metadata only.",
      fabricRole: notes.fabricMetadataOnly
    }),
    rateLimitingAbuseControlBoundaryMapDefinition({
      boundaryId:
        "phase5-64.locus.control_surface_request_throttle.throttle_boundary",
      boundaryFamily: "throttle_contract",
      relatedSystem: "locus",
      currentStatus: "future_contract_required",
      subject: "Locus control-surface request throttle",
      requestIdentityExpectation:
        "Future Locus control throttles require consumer-owned operator, panel, action, and permission identity before interactivity.",
      quotaSubjectExpectation:
        "Future Locus quotas must be consumer-owned and cannot be granted by Ardyn metadata.",
      backpressureExpectation: noBackpressureRuntime,
      retryIdempotencyExpectation: noRetryRuntime,
      abuseSignalExpectation:
        "Locus abuse indicators may be displayed later as metadata only; Ardyn implements no UI, browser, rendering, or control runtime.",
      locusRole:
        "Locus remains a future first-class consumer target only; no Locus repo or runtime is modified."
    }),
    rateLimitingAbuseControlBoundaryMapDefinition({
      boundaryId:
        "phase5-64.multiverse.citizen_adapter_request_throttle.throttle_boundary",
      boundaryFamily: "throttle_contract",
      relatedSystem: "multiverse",
      currentStatus: "future_contract_required",
      subject: "Multiverse citizen/adapter request throttle",
      requestIdentityExpectation:
        "Future Multiverse throttles require consumer-owned world, project, citizen, adapter, task, and permission identity before requests become actionable.",
      quotaSubjectExpectation:
        "Future Multiverse quotas cannot grant adapters, connectors, tasks, or orchestration from Ardyn metadata.",
      backpressureExpectation: noBackpressureRuntime,
      retryIdempotencyExpectation: noRetryRuntime,
      abuseSignalExpectation:
        "Multiverse abuse indicators may be displayed later as metadata only; Ardyn implements no adapter runtime or task execution.",
      multiverseRole:
        "Multiverse remains a future first-class consumer target only; no Multiverse repo or runtime is modified."
    }),
    rateLimitingAbuseControlBoundaryMapDefinition({
      boundaryId:
        "phase5-64.ardyn.mcp_tool_exposure_abuse.denial_of_service_boundary",
      boundaryFamily: "denial_of_service_boundary",
      relatedSystem: "ardyn",
      currentStatus: "blocked",
      subject: "MCP/tool exposure abuse",
      requestIdentityExpectation:
        "Future MCP/tool request identity requires explicit tool, server, operator, permission, and task boundaries before exposure.",
      quotaSubjectExpectation:
        "Future MCP/tool quotas cannot be created until tool exposure, task execution, and connector grants are separately authorized.",
      backpressureExpectation: noBackpressureRuntime,
      retryIdempotencyExpectation: noRetryRuntime,
      abuseSignalExpectation:
        "MCP/tool abuse metadata cannot expose tools, run tasks, connect to servers, or bypass command blocking."
    }),
    rateLimitingAbuseControlBoundaryMapDefinition({
      boundaryId:
        "phase5-64.repo_family.connector_grant_abuse.connector_abuse_boundary",
      boundaryFamily: "connector_abuse_boundary",
      relatedSystem: "repo-family",
      currentStatus: "blocked",
      subject: "connector grant abuse",
      requestIdentityExpectation:
        "Future connector abuse boundaries require explicit connector, credential, subject, scope, and revocation identity before grants.",
      quotaSubjectExpectation:
        "Future connector quotas must not create credentials, grants, ingestion URLs, scanner directives, or filesystem scans.",
      backpressureExpectation: noBackpressureRuntime,
      retryIdempotencyExpectation: noRetryRuntime,
      abuseSignalExpectation:
        "Connector abuse metadata cannot grant connectors, read secrets, scan files, or ingest external services.",
      locusRole:
        "Locus may later display connector abuse metadata only.",
      multiverseRole:
        "Multiverse may later display connector candidate abuse metadata only."
    }),
    rateLimitingAbuseControlBoundaryMapDefinition({
      boundaryId:
        "phase5-64.content_fabric.secure_drop_compose_inbox_abuse.secure_drop_abuse_boundary",
      boundaryFamily: "secure_drop_abuse_boundary",
      relatedSystem: "content-fabric",
      currentStatus: "future_contract_required",
      subject: "Secure Drop compose/inbox abuse",
      requestIdentityExpectation:
        "Future Secure Drop compose/inbox abuse controls require content-fabric-owned recipient, sender, keyring, DID, consent, and audit identity.",
      quotaSubjectExpectation:
        "Future Secure Drop quotas are content-fabric-owned and cannot be implemented, counted, stored, or enforced by Ardyn metadata.",
      backpressureExpectation: noBackpressureRuntime,
      retryIdempotencyExpectation:
        "Future Secure Drop retry/idempotency semantics require content-fabric-owned transport and storage contracts first; Ardyn implements none.",
      abuseSignalExpectation:
        "Secure Drop abuse metadata must reject crypto, transport, stego, send/receive, inbox polling, file selection, filesystem scanning, connector ingestion, secret/vault/env access, and ST3GG wrapping.",
      locusRole:
        "Locus may later display Secure Drop placeholder abuse metadata only.",
      fabricRole:
        "Fabric may later carry Secure Drop abuse-control reference metadata only.",
      secureDropRole: notes.secureDropContentFabric
    }),
    rateLimitingAbuseControlBoundaryMapDefinition({
      boundaryId:
        "phase5-64.ardyn.storage_write_quota.quota_boundary",
      boundaryFamily: "quota_contract",
      relatedSystem: "ardyn",
      currentStatus: "future_contract_required",
      subject: "storage/write quota",
      requestIdentityExpectation: metadataOnlyIdentity,
      quotaSubjectExpectation:
        "Future storage/write quotas require Phase 5.61 database/storage ownership, isolation, retention, backup, and write contracts before any persistence.",
      backpressureExpectation: noBackpressureRuntime,
      retryIdempotencyExpectation: noRetryRuntime,
      abuseSignalExpectation:
        "Storage quota metadata cannot create database clients, storage adapters, cache engines, transcript writers, audit writers, filesystem writes, or persistence."
    }),
    rateLimitingAbuseControlBoundaryMapDefinition({
      boundaryId:
        "phase5-64.ardyn.auth_permission_subject_quota.quota_boundary",
      boundaryFamily: "quota_contract",
      relatedSystem: "ardyn",
      currentStatus: "future_contract_required",
      subject: "auth/permission subject quota",
      requestIdentityExpectation:
        "Future subject quotas require Phase 5.62 identity, role, permission, consent, delegation, revocation, and audit-subject contracts first.",
      quotaSubjectExpectation: metadataOnlyQuota,
      backpressureExpectation: noBackpressureRuntime,
      retryIdempotencyExpectation: noRetryRuntime,
      abuseSignalExpectation:
        "Auth quota metadata cannot implement login, sessions, tokens, API keys, role engines, permission evaluators, approval decisions, approval grants, or secret access."
    }),
    rateLimitingAbuseControlBoundaryMapDefinition({
      boundaryId:
        "phase5-64.ardyn.security_input_abuse.request_cost_boundary",
      boundaryFamily: "request_cost_contract",
      relatedSystem: "ardyn",
      currentStatus: "future_contract_required",
      subject: "security/input-sanitization abuse cost",
      requestIdentityExpectation: metadataOnlyIdentity,
      quotaSubjectExpectation:
        "Future request-cost metadata must compose with Phase 5.63 input-safety contracts before any cost meter or limiter exists.",
      backpressureExpectation: noBackpressureRuntime,
      retryIdempotencyExpectation: noRetryRuntime,
      abuseSignalExpectation:
        "Security/input abuse metadata cannot run sanitizers, live scanners, dependency patch automation, audit/log writers, external lookups, or backend middleware."
    }),
    rateLimitingAbuseControlBoundaryMapDefinition({
      boundaryId:
        "phase5-64.repo_family.retry_budget_planning.retry_budget_boundary",
      boundaryFamily: "retry_budget_contract",
      relatedSystem: "repo-family",
      currentStatus: "future_contract_required",
      subject: "retry budget planning",
      requestIdentityExpectation: metadataOnlyIdentity,
      quotaSubjectExpectation:
        "Future retry budgets need explicit request, actor, operation, and failure-mode subjects before retries are executable.",
      backpressureExpectation: noBackpressureRuntime,
      retryIdempotencyExpectation:
        "Retry budgets are metadata only; no retry engine, backoff scheduler, circuit breaker, queue, or task runner exists.",
      abuseSignalExpectation:
        "Retry budget metadata cannot mask runtime failures, loop tasks, poll services, or generate background traffic.",
      fabricRole: notes.fabricMetadataOnly
    }),
    rateLimitingAbuseControlBoundaryMapDefinition({
      boundaryId:
        "phase5-64.repo_family.idempotency_planning.idempotency_boundary",
      boundaryFamily: "idempotency_contract",
      relatedSystem: "repo-family",
      currentStatus: "future_contract_required",
      subject: "idempotency planning",
      requestIdentityExpectation: metadataOnlyIdentity,
      quotaSubjectExpectation:
        "Future idempotency subjects require operation keys, replay windows, storage ownership, and privacy contracts before any store.",
      backpressureExpectation: noBackpressureRuntime,
      retryIdempotencyExpectation:
        "Idempotency remains metadata only; Ardyn creates no idempotency key store, dedupe store, replay store, database, cache, or persistence.",
      abuseSignalExpectation:
        "Idempotency metadata cannot persist keys, write cache, dedupe commands, or enable request replay."
    }),
    rateLimitingAbuseControlBoundaryMapDefinition({
      boundaryId:
        "phase5-64.repo_family.backpressure_circuit_breaker_planning.backpressure_boundary",
      boundaryFamily: "backpressure_contract",
      relatedSystem: "repo-family",
      currentStatus: "future_contract_required",
      subject: "backpressure and circuit-breaker planning",
      requestIdentityExpectation: metadataOnlyIdentity,
      quotaSubjectExpectation:
        "Future backpressure subjects require explicit service, operation, dependency, queue, and failure-domain contracts.",
      backpressureExpectation:
        "Backpressure is metadata only; no breaker state, worker queue, scheduler, polling loop, or live dependency pressure signal exists.",
      retryIdempotencyExpectation: noRetryRuntime,
      abuseSignalExpectation:
        "Circuit-breaker planning metadata cannot open transports, poll services, schedule work, or gate runtime execution."
    })
  ];
}

function rateLimitingAbuseControlBoundaryMapEntries() {
  return rateLimitingAbuseControlBoundaryMapDefinitions().map(
    rateLimitingAbuseControlBoundaryMapEntry
  );
}

function rateLimitingAbuseControlBoundaryMapSummary(entries) {
  const countByFamily = Object.fromEntries(
    RATE_LIMITING_ABUSE_CONTROL_BOUNDARY_FAMILIES.map((family) => [
      family,
      entries.filter((entry) => entry.boundaryFamily === family).length
    ])
  );
  const countByRelatedSystem = Object.fromEntries(
    RATE_LIMITING_ABUSE_CONTROL_BOUNDARY_RELATED_SYSTEMS.map((system) => [
      system,
      entries.filter((entry) => entry.relatedSystem === system).length
    ])
  );

  return {
    rateLimitingAbuseControlContractBoundaryMapKind:
      RATE_LIMITING_ABUSE_CONTROL_CONTRACT_BOUNDARY_MAP_KIND,
    boundaryEntryCount: entries.length,
    boundaryIds: entries.map((entry) => entry.boundaryId),
    boundaryFamilies: [...RATE_LIMITING_ABUSE_CONTROL_BOUNDARY_FAMILIES],
    relatedSystems: [
      ...RATE_LIMITING_ABUSE_CONTROL_BOUNDARY_RELATED_SYSTEMS
    ],
    currentStatusValues: [...RATE_LIMITING_ABUSE_CONTROL_BOUNDARY_STATUSES],
    countByFamily,
    countByRelatedSystem,
    phase548RateLimitingCoverageItemRepresented: true,
    phase559FabricAwareApiBackendBoundaryReferenced: true,
    phase560EncodedHandoffConformanceReferenced: true,
    phase561DatabaseStorageContractBoundaryReferenced: true,
    phase562AuthPermissionsContractBoundaryReferenced: true,
    phase563SecurityRlsInputSanitizationBoundaryReferenced: true,
    rateLimitingAbuseControlBoundaryMetadataOnly: true,
    noLiveTrafficHandlingPerformed: true,
    noLimiterRuntimeImplemented: true,
    noQuotaEngineImplemented: true,
    noThrottleRuntimeImplemented: true,
    noAbuseDetectorImplemented: true,
    noQueueSchedulerImplemented: true,
    noRetryEngineImplemented: true,
    noCircuitBreakerImplemented: true,
    noIdempotencyStoreImplemented: true,
    noBackendApiServerImplemented: true,
    noStorageWrites: true,
    noConnectorGrants: true,
    contentFabricCanonicalSecureDropOwnerOnly: true,
    allBlockedAuthorizationFlagsFalse: true,
    allUnsafeRateLimitingAbuseControlRuntimeFlagsFalse: true,
    allRuntimeEffectsFalse: true,
    allEntriesNonAuthorizing: true
  };
}

function rateLimitingAbuseControlBoundaryMapValidationRules() {
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
    unsafeLimiterQuotaThrottleAbuseQueueSchedulerRetryCircuitBreakerIdempotencyCostBackendStorageRuntimeFlagsFailClosed:
      true,
    hiddenRateLimitMiddlewareSemanticsFailClosed: true,
    hiddenQuotaEngineSemanticsFailClosed: true,
    hiddenAbuseDetectorRuntimeScannerSemanticsFailClosed: true,
    hiddenRetryCircuitBreakerExecutionSemanticsFailClosed: true,
    hiddenIdempotencyPersistenceSemanticsFailClosed: true,
    hiddenBackendApiServerSemanticsFailClosed: true,
    hiddenDatabaseStorageCacheWriteSemanticsFailClosed: true,
    hiddenAuthSessionTokenApiKeySemanticsFailClosed: true,
    hiddenConnectorGrantSemanticsFailClosed: true,
    hiddenFabricWebsocketHttpMcpTaskRuntimeSemanticsFailClosed: true,
    hiddenSecureDropImplementationSemanticsFailClosed: true,
    hiddenEncodedHandoffCodecTranslatorStegoCovertChannelTokenizerExploitBypassSemanticsFailClosed:
      true,
    nestedUnsafeFlagsFailClosed: true,
    noncanonicalBoundaryEntriesFailClosed: true,
    validationImplementsLimiterRuntime: false,
    validationImplementsQuotaEngine: false,
    validationImplementsThrottleRuntime: false,
    validationRunsAbuseDetector: false,
    validationCreatesQueueScheduler: false,
    validationRunsRetryEngine: false,
    validationRunsCircuitBreaker: false,
    validationCreatesIdempotencyStore: false,
    validationRunsBackendApiServer: false,
    validationWritesStorage: false,
    validationGrantsConnectors: false,
    validationRunsRuntime: false
  };
}

function rateLimitingAbuseControlBoundaryMapGaps() {
  return [
    "No limiter runtime, quota engine, throttle runtime, abuse detector, denial-of-service runtime, queue, scheduler, retry engine, circuit breaker, idempotency store, request cost meter, backend middleware, API, or server exists in Ardyn.",
    "Database/storage/cache/RLS, auth/permissions subject identity, and security/input-sanitization boundaries are referenced as metadata only and still require explicit future contracts.",
    "Fabric coordination, encoded handoff, MCP/tool exposure, connector grants, and Secure Drop compose/inbox abuse controls remain future metadata boundaries with no runtime transport, task execution, or service discovery.",
    "No storage writes, counters, buckets, ledgers, retry state, idempotency persistence, audit/transcript writers, import/export paths, packages, filesystem writes, or background polling are implemented.",
    "Future consumer displays still need Locus/Multiverse-owned abuse-control UI, accessibility, and action-disablement conformance before any interactive control surface."
  ];
}

function rateLimitingAbuseControlBoundaryMapFalseRuntimeFields() {
  return Object.fromEntries(
    RATE_LIMITING_ABUSE_CONTROL_BOUNDARY_UNSAFE_FIELDS.map((field) => [
      field,
      false
    ])
  );
}

function rateLimitingAbuseControlBoundaryMapState(reviewedAt) {
  const boundaryEntries = rateLimitingAbuseControlBoundaryMapEntries();

  return {
    schema: RATE_LIMITING_ABUSE_CONTROL_CONTRACT_BOUNDARY_MAP_STATE_SCHEMA,
    schemaVersion: RATE_LIMITING_ABUSE_CONTROL_CONTRACT_BOUNDARY_MAP_VERSION,
    stateKind: RATE_LIMITING_ABUSE_CONTROL_CONTRACT_BOUNDARY_MAP_KIND,
    stateMode: "review-only",
    reviewedAt,
    sourcePhaseContext: {
      phase548ProductionReadinessCoverageMatrix:
        "tests/fixtures/host-policy/phase5-48/production-readiness-coverage-matrix.json",
      phase548RateLimitingAreaNumber: 9,
      phase548RateLimitingStatus: "deferred",
      phase559FabricAwareApiBackendBoundary:
        "tests/fixtures/host-policy/phase5-59/fabric-aware-api-backend-contract-boundary-map.json",
      phase560InterAgentEncodedHandoffConformance:
        "tests/fixtures/host-policy/phase5-60/inter-agent-encoded-handoff-conformance.json",
      phase561DatabaseStorageContractBoundary:
        "tests/fixtures/host-policy/phase5-61/database-storage-contract-boundary-map.json",
      phase562AuthPermissionsContractBoundary:
        "tests/fixtures/host-policy/phase5-62/auth-permissions-contract-boundary-map.json",
      phase563SecurityRlsInputSanitizationContractBoundary:
        "tests/fixtures/host-policy/phase5-63/security-rls-input-sanitization-contract-boundary-map.json",
      secureDropCanonicalOwner: "content-fabric",
      runtimeStillBlocked: true
    },
    boundaryEntries,
    boundaryMapSummary:
      rateLimitingAbuseControlBoundaryMapSummary(boundaryEntries),
    invalidBoundaryCasePolicy:
      rateLimitingAbuseControlBoundaryMapValidationRules(),
    topRateLimitingSecurityAuthDatabaseFabricApiBackendGaps:
      rateLimitingAbuseControlBoundaryMapGaps(),
    recommendedNextPhase:
      "phase-5.65-review-only-error-tracking-logging-audit-integrity-contract-boundary-map",
    rateLimitingAbuseControlContractBoundaryMapOnly: true,
    reviewOnly: true,
    metadataOnly: true,
    authoritative: false,
    nonAuthorizingProof: true,
    reportRunsChecks: false,
    ...rateLimitingAbuseControlBoundaryMapFalseRuntimeFields(),
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

function rateLimitingAbuseControlBoundaryMapResult({
  reviewedAt,
  reviewedAtDefaulted,
  classification,
  accepted,
  rateLimitingAbuseControlContractBoundaryMap
}) {
  return {
    schema: RATE_LIMITING_ABUSE_CONTROL_CONTRACT_BOUNDARY_MAP_SCHEMA,
    schemaVersion: RATE_LIMITING_ABUSE_CONTROL_CONTRACT_BOUNDARY_MAP_VERSION,
    rateLimitingAbuseControlContractBoundaryMapKind:
      RATE_LIMITING_ABUSE_CONTROL_CONTRACT_BOUNDARY_MAP_KIND,
    rateLimitingAbuseControlContractBoundaryMapMode: "review-only",
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    rateLimitingAbuseControlContractBoundaryMapProduced: accepted,
    rateLimitingAbuseControlContractBoundaryMap,
    boundaryMapSummary: accepted
      ? rateLimitingAbuseControlContractBoundaryMap.boundaryMapSummary
      : null,
    boundaryEntries: accepted
      ? rateLimitingAbuseControlContractBoundaryMap.boundaryEntries
      : [],
    invalidBoundaryCasePolicy: accepted
      ? rateLimitingAbuseControlContractBoundaryMap.invalidBoundaryCasePolicy
      : rateLimitingAbuseControlBoundaryMapValidationRules(),
    topRateLimitingSecurityAuthDatabaseFabricApiBackendGaps: accepted
      ? rateLimitingAbuseControlContractBoundaryMap
          .topRateLimitingSecurityAuthDatabaseFabricApiBackendGaps
      : [],
    recommendedNextPhase: accepted
      ? rateLimitingAbuseControlContractBoundaryMap.recommendedNextPhase
      : null,
    rateLimitingAbuseControlContractBoundaryMapOnly: true,
    reviewOnly: true,
    metadataOnly: true,
    authoritative: false,
    nonAuthorizingProof: true,
    reportRunsChecks: false,
    ...rateLimitingAbuseControlBoundaryMapFalseRuntimeFields(),
    rejectionReasons: accepted
      ? []
      : [
          {
            classification,
            rejected: true,
            runtimeAuthorized: false,
            rateLimitingRuntimeAuthorized: false,
            commandExposureAuthorized: false,
            reportRunsChecks: false
          }
        ],
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

export function createRateLimitingAbuseControlContractBoundaryMapForReview(
  input = {}
) {
  const inputRecord = rateLimitingAbuseControlBoundaryMapInputRecord(input);
  const reviewedAt =
    rateLimitingAbuseControlBoundaryMapReviewedAt(inputRecord);
  const reviewedAtDefaulted = isReviewedAtDefaulted(inputRecord);
  const classification =
    rateLimitingAbuseControlBoundaryMapInputClassification(inputRecord);
  const accepted =
    classification ===
    VALID_RATE_LIMITING_ABUSE_CONTROL_CONTRACT_BOUNDARY_MAP_CLASSIFICATION;
  const rateLimitingAbuseControlContractBoundaryMap = accepted
    ? rateLimitingAbuseControlBoundaryMapState(reviewedAt)
    : null;

  return rateLimitingAbuseControlBoundaryMapResult({
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    accepted,
    rateLimitingAbuseControlContractBoundaryMap
  });
}

const ERROR_TRACKING_LOGGING_AUDIT_INTEGRITY_CONTRACT_BOUNDARY_MAP_STATE_SCHEMA =
  "ardyn.phase-5.65.error-tracking-logging-audit-integrity-contract-boundary-map-state";
const VALID_ERROR_TRACKING_LOGGING_AUDIT_INTEGRITY_CONTRACT_BOUNDARY_MAP_CLASSIFICATION =
  "valid_error_tracking_logging_audit_integrity_contract_boundary_map_runtime_still_blocked";
const MALFORMED_ERROR_TRACKING_LOGGING_AUDIT_INTEGRITY_CONTRACT_BOUNDARY_MAP_CLASSIFICATION =
  "malformed_error_tracking_logging_audit_integrity_contract_boundary_map_input_rejected";

const ERROR_TRACKING_LOGGING_AUDIT_INTEGRITY_BOUNDARY_FAMILIES = Object.freeze([
  "error_tracking_contract",
  "logging_contract",
  "audit_integrity_contract",
  "tamper_evidence_contract",
  "trace_correlation_contract",
  "transcript_observability_contract",
  "redaction_contract",
  "retention_contract",
  "external_sink_boundary",
  "abuse_event_observability_contract",
  "encoded_handoff_audit_contract",
  "fabric_observability_contract",
  "secure_drop_audit_boundary"
]);
const ERROR_TRACKING_LOGGING_AUDIT_INTEGRITY_RELATED_SYSTEMS = Object.freeze([
  "ardyn",
  "ardyn-subagent",
  "locus",
  "multiverse",
  "content-fabric",
  "repo-family"
]);
const ERROR_TRACKING_LOGGING_AUDIT_INTEGRITY_STATUSES = Object.freeze([
  "metadata_only",
  "blocked",
  "future_contract_required"
]);
const ERROR_TRACKING_LOGGING_AUDIT_INTEGRITY_REQUIRED_FIELDS = Object.freeze([
  "boundaryId",
  "boundaryFamily",
  "relatedSystem",
  "currentStatus",
  "allowedCurrentBehavior",
  "forbiddenCurrentBehavior",
  "requiredFutureContractBeforeImplementation",
  "requiredFutureAuthorizationPhaseBeforeRuntime",
  "errorClassificationExpectation",
  "logEventShapeExpectation",
  "auditSubjectExpectation",
  "tamperEvidenceExpectation",
  "redactionExpectation",
  "retentionDeletionExpectation",
  "correlationIdempotencyExpectation",
  "locusRoleDescription",
  "multiverseRoleDescription",
  "fabricRoleDescription",
  "secureDropRoleDescription",
  "explicitBlockedAuthorizationFlags",
  "unsafeErrorLoggingAuditRuntimeFlags",
  "nonAuthorizingProof"
]);
const ERROR_TRACKING_LOGGING_AUDIT_INTEGRITY_ALLOWED_TOP_LEVEL_FIELDS =
  Object.freeze(["reviewedAt", "boundaryEntries"]);
const ERROR_TRACKING_LOGGING_AUDIT_INTEGRITY_UNSAFE_FIELDS = Object.freeze([
  "loggerRuntimeImplemented",
  "loggingRuntimeImplemented",
  "logWriterImplemented",
  "auditWriterImplemented",
  "auditLogWriterImplemented",
  "transcriptWriterImplemented",
  "transcriptRuntimeWriteEnabled",
  "telemetryClientImplemented",
  "telemetryExporterImplemented",
  "errorCollectorImplemented",
  "externalSinkImplemented",
  "externalSinkConfigured",
  "exportPathImplementedByArdyn",
  "persistencePathImplementedByArdyn",
  "persistenceImplementedByArdyn",
  "redactionRuntimeImplemented",
  "tamperEvidentWriterImplemented",
  "digestWriterImplemented",
  "hashChainWriterImplemented",
  "traceCollectorImplemented",
  "alertingRuntimeImplemented",
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
  "filesystemWriteEnabled",
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
  "reportRunsChecks",
  "blockedCliBypassEnabled"
]);
const ERROR_TRACKING_LOGGING_AUDIT_INTEGRITY_AUTHORIZATION_FIELDS =
  Object.freeze([
    "runtimeAuthorized",
    "runtimeAuthorizationGranted",
    "loggingRuntimeAuthorizationGranted",
    "auditWriterAuthorizationGranted",
    "transcriptWriterAuthorizationGranted",
    "telemetryClientAuthorizationGranted",
    "errorCollectorAuthorizationGranted",
    "externalSinkAuthorizationGranted",
    "exportPathAuthorizationGranted",
    "persistencePathAuthorizationGranted",
    "tamperEvidentWriterAuthorizationGranted",
    "redactionRuntimeAuthorizationGranted",
    "traceCollectorAuthorizationGranted",
    "alertingRuntimeAuthorizationGranted",
    "backendApiServerAuthorizationGranted",
    "storageWriteAuthorizationGranted",
    "connectorGrantAuthorizationGranted",
    "fabricRuntimeAuthorizationGranted",
    "secureDropAuthorizationGranted",
    "encodedHandoffRuntimeAuthorizationGranted",
    "commandExposureAuthorizationGranted",
    "approvalDecisionProduced",
    "approvalGrantProduced",
    "authorizesRuntime"
  ]);
const ERROR_TRACKING_LOGGING_AUDIT_INTEGRITY_COMMAND_FIELDS = Object.freeze([
  "commandExposureEnabled",
  "commandRuntimeControlEnabled",
  "commandsExposed",
  "exposesCommands",
  "runtimeCommandEnabled",
  "cliCommandExposed"
]);
const ERROR_TRACKING_LOGGING_AUDIT_INTEGRITY_BLOCKED_CLI_BYPASS_FIELDS =
  Object.freeze([
    "blockedCliBypassEnabled",
    "dryRunBypassesBlock",
    "serveRuntimeBypassEnabled",
    "bypassBlockedCommandBehavior",
    "blockedCommandOverride"
  ]);
const ERROR_TRACKING_LOGGING_AUDIT_INTEGRITY_HIDDEN_FIELD_GROUPS =
  Object.freeze([
    {
      classification:
        "hidden_log_writer_semantics_error_tracking_logging_audit_integrity_contract_boundary_map_input_rejected",
      fields: [
        "loggerRuntime",
        "logWriter",
        "loggerTransport",
        "auditLogger",
        "pinoLogger",
        "winstonLogger",
        "runtimeLogSink"
      ]
    },
    {
      classification:
        "hidden_audit_transcript_write_semantics_error_tracking_logging_audit_integrity_contract_boundary_map_input_rejected",
      fields: [
        "auditWriter",
        "auditLogWriter",
        "auditSink",
        "auditStore",
        "transcriptWriter",
        "transcriptSink",
        "runtimeTranscriptStore"
      ]
    },
    {
      classification:
        "hidden_telemetry_export_external_sink_semantics_error_tracking_logging_audit_integrity_contract_boundary_map_input_rejected",
      fields: [
        "telemetryClient",
        "telemetryExporter",
        "errorCollector",
        "externalSink",
        "logDrain",
        "sentryDsn",
        "datadogApiKey",
        "otelCollector",
        "exporterEndpoint",
        "alertingClient"
      ]
    },
    {
      classification:
        "hidden_tamper_evident_chain_writer_semantics_error_tracking_logging_audit_integrity_contract_boundary_map_input_rejected",
      fields: [
        "tamperEvidentWriter",
        "hashChainWriter",
        "digestWriter",
        "merkleRootWriter",
        "chainedAuditStore",
        "signatureWriter"
      ]
    },
    {
      classification:
        "hidden_redaction_runtime_semantics_error_tracking_logging_audit_integrity_contract_boundary_map_input_rejected",
      fields: [
        "redactionRuntime",
        "liveRedactor",
        "redactPii",
        "secretScannerRuntime",
        "runtimeScrubber"
      ]
    },
    {
      classification:
        "hidden_backend_api_server_semantics_error_tracking_logging_audit_integrity_contract_boundary_map_input_rejected",
      fields: [
        "backendApiMiddleware",
        "apiRequestHandler",
        "httpServer",
        "serverMiddleware",
        "httpEndpoint",
        "runtimeEndpoint"
      ]
    },
    {
      classification:
        "hidden_database_storage_cache_write_semantics_error_tracking_logging_audit_integrity_contract_boundary_map_input_rejected",
      fields: [
        "databaseUrl",
        "databaseDsn",
        "dbConnectionString",
        "storageAdapter",
        "cacheEngine",
        "writeQueue",
        "persistenceLayer",
        "filesystemWrite",
        "auditWriter",
        "transcriptWriter"
      ]
    },
    {
      classification:
        "hidden_auth_session_token_api_key_semantics_error_tracking_logging_audit_integrity_contract_boundary_map_input_rejected",
      fields: [
        "loginUrl",
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
      ]
    },
    {
      classification:
        "hidden_connector_grant_semantics_error_tracking_logging_audit_integrity_contract_boundary_map_input_rejected",
      fields: [
        "connectorGrant",
        "connectorCredential",
        "connectorAccessToken",
        "connectorAuditSink",
        "connectorLogDrain",
        "connectorIngestionGrant"
      ]
    },
    {
      classification:
        "hidden_fabric_websocket_http_mcp_task_runtime_semantics_error_tracking_logging_audit_integrity_contract_boundary_map_input_rejected",
      fields: [
        "fabricBusTopic",
        "fabricBrokerUrl",
        "websocketUrl",
        "mcpToolName",
        "mcpServerUrl",
        "taskExecutor",
        "taskRunner",
        "adapterRuntime"
      ]
    },
    {
      classification:
        "hidden_secure_drop_implementation_semantics_error_tracking_logging_audit_integrity_contract_boundary_map_input_rejected",
      fields: [
        "secureDropPayloadPath",
        "secureDropKeyring",
        "secureDropCryptoImplemented",
        "secureDropTransportImplemented",
        "secureDropStegoImplemented",
        "secureDropSendReceiveImplemented",
        "secureDropInboxPollingEnabled",
        "secureDropFileSelection",
        "st3ggPayload"
      ]
    },
    {
      classification:
        "hidden_encoded_handoff_codec_translator_stego_covert_channel_tokenizer_exploit_bypass_semantics_error_tracking_logging_audit_integrity_contract_boundary_map_input_rejected",
      fields: [
        "codecImplemented",
        "translatorRuntimeImplemented",
        "encoderImplemented",
        "decoderImplemented",
        "conlangGenerator",
        "semanticStegoCandidate",
        "steganographyCandidate",
        "tokenExploitationCandidate",
        "covertChannel",
        "guardrailBypass",
        "hiddenPayload"
      ]
    }
  ]);

function errorTrackingLoggingAuditIntegrityBoundaryMapInputRecord(input) {
  return isPlainObjectRecord(input) ? input : null;
}

function errorTrackingLoggingAuditIntegrityBoundaryMapReviewedAt(inputRecord) {
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

function errorTrackingLoggingAuditIntegrityBoundaryMapContainsTrue(value) {
  if (value === true) {
    return true;
  }

  if (Array.isArray(value)) {
    return value.some(errorTrackingLoggingAuditIntegrityBoundaryMapContainsTrue);
  }

  if (isPlainObjectRecord(value)) {
    return Object.values(value).some(
      errorTrackingLoggingAuditIntegrityBoundaryMapContainsTrue
    );
  }

  return false;
}

function errorTrackingLoggingAuditIntegrityBoundaryMapHasTrueFieldDeep(
  value,
  fields
) {
  if (Array.isArray(value)) {
    return value.some((item) =>
      errorTrackingLoggingAuditIntegrityBoundaryMapHasTrueFieldDeep(
        item,
        fields
      )
    );
  }

  if (!isPlainObjectRecord(value)) {
    return false;
  }

  for (const [key, nested] of Object.entries(value)) {
    if (fields.includes(key) && nested === true) {
      return true;
    }

    if (
      errorTrackingLoggingAuditIntegrityBoundaryMapHasTrueFieldDeep(
        nested,
        fields
      )
    ) {
      return true;
    }
  }

  return false;
}

function errorTrackingLoggingAuditIntegrityBoundaryMapHasPresentFieldDeep(
  value,
  fields
) {
  if (Array.isArray(value)) {
    return value.some((item) =>
      errorTrackingLoggingAuditIntegrityBoundaryMapHasPresentFieldDeep(
        item,
        fields
      )
    );
  }

  if (!isPlainObjectRecord(value)) {
    return false;
  }

  for (const [key, nested] of Object.entries(value)) {
    if (
      key === "explicitBlockedAuthorizationFlags" ||
      key === "unsafeErrorLoggingAuditRuntimeFlags"
    ) {
      continue;
    }

    if (fields.includes(key)) {
      return true;
    }

    if (
      errorTrackingLoggingAuditIntegrityBoundaryMapHasPresentFieldDeep(
        nested,
        fields
      )
    ) {
      return true;
    }
  }

  return false;
}

function errorTrackingLoggingAuditIntegrityBoundaryMapEntriesInput(inputRecord) {
  return Array.isArray(inputRecord?.boundaryEntries)
    ? inputRecord.boundaryEntries
    : null;
}

function errorTrackingLoggingAuditIntegrityBoundaryMapMalformed(inputRecord) {
  return (
    inputRecord === null ||
    (Object.prototype.hasOwnProperty.call(inputRecord, "reviewedAt") &&
      !isUtcIsoTimestampWithMilliseconds(inputRecord.reviewedAt)) ||
    (Object.prototype.hasOwnProperty.call(inputRecord, "boundaryEntries") &&
      !Array.isArray(inputRecord.boundaryEntries))
  );
}

function errorTrackingLoggingAuditIntegrityBoundaryMapEntryIssue(
  entries,
  predicate
) {
  return entries !== null && entries.some((entry) => predicate(entry));
}

function errorTrackingLoggingAuditIntegrityBoundaryMapMissingRequired(entry) {
  return (
    !isPlainObjectRecord(entry) ||
    ERROR_TRACKING_LOGGING_AUDIT_INTEGRITY_REQUIRED_FIELDS.some(
      (field) => !Object.prototype.hasOwnProperty.call(entry, field)
    )
  );
}

function errorTrackingLoggingAuditIntegrityBoundaryMapEntryMalformed(entry) {
  if (!isPlainObjectRecord(entry)) {
    return true;
  }

  return (
    typeof entry.boundaryId !== "string" ||
    !Array.isArray(entry.allowedCurrentBehavior) ||
    !Array.isArray(entry.forbiddenCurrentBehavior) ||
    typeof entry.requiredFutureContractBeforeImplementation !== "string" ||
    typeof entry.requiredFutureAuthorizationPhaseBeforeRuntime !== "string" ||
    typeof entry.errorClassificationExpectation !== "string" ||
    typeof entry.logEventShapeExpectation !== "string" ||
    typeof entry.auditSubjectExpectation !== "string" ||
    typeof entry.tamperEvidenceExpectation !== "string" ||
    typeof entry.redactionExpectation !== "string" ||
    typeof entry.retentionDeletionExpectation !== "string" ||
    typeof entry.correlationIdempotencyExpectation !== "string" ||
    typeof entry.locusRoleDescription !== "string" ||
    typeof entry.multiverseRoleDescription !== "string" ||
    typeof entry.fabricRoleDescription !== "string" ||
    typeof entry.secureDropRoleDescription !== "string" ||
    !isPlainObjectRecord(entry.explicitBlockedAuthorizationFlags) ||
    !isPlainObjectRecord(entry.unsafeErrorLoggingAuditRuntimeFlags) ||
    entry.nonAuthorizingProof !== true
  );
}

function errorTrackingLoggingAuditIntegrityBoundaryMapAuthorizationFlagEnabled(
  value
) {
  if (!isPlainObjectRecord(value)) {
    return false;
  }

  return (
    (isPlainObjectRecord(value.explicitBlockedAuthorizationFlags) &&
      Object.values(value.explicitBlockedAuthorizationFlags).some(
        (flag) => flag !== false
      )) ||
    ERROR_TRACKING_LOGGING_AUDIT_INTEGRITY_AUTHORIZATION_FIELDS.some(
      (field) => value[field] === true
    )
  );
}

function errorTrackingLoggingAuditIntegrityBoundaryMapUnsafeFlagEnabled(value) {
  if (!isPlainObjectRecord(value)) {
    return false;
  }

  return (
    (isPlainObjectRecord(value.unsafeErrorLoggingAuditRuntimeFlags) &&
      Object.values(value.unsafeErrorLoggingAuditRuntimeFlags).some(
        (flag) => flag !== false
      )) ||
    errorTrackingLoggingAuditIntegrityBoundaryMapHasTrueFieldDeep(
      value,
      ERROR_TRACKING_LOGGING_AUDIT_INTEGRITY_UNSAFE_FIELDS
    )
  );
}

function errorTrackingLoggingAuditIntegrityBoundaryMapCanonical(entries) {
  if (entries === null) {
    return true;
  }

  return (
    JSON.stringify(entries) ===
    JSON.stringify(errorTrackingLoggingAuditIntegrityBoundaryMapEntries())
  );
}

function errorTrackingLoggingAuditIntegrityBoundaryMapInputClassification(
  inputRecord
) {
  if (errorTrackingLoggingAuditIntegrityBoundaryMapMalformed(inputRecord)) {
    return MALFORMED_ERROR_TRACKING_LOGGING_AUDIT_INTEGRITY_CONTRACT_BOUNDARY_MAP_CLASSIFICATION;
  }

  const entries =
    errorTrackingLoggingAuditIntegrityBoundaryMapEntriesInput(inputRecord);

  if (
    errorTrackingLoggingAuditIntegrityBoundaryMapEntryIssue(
      entries,
      errorTrackingLoggingAuditIntegrityBoundaryMapMissingRequired
    )
  ) {
    return "missing_required_error_tracking_logging_audit_integrity_contract_boundary_entry_rejected";
  }

  if (
    errorTrackingLoggingAuditIntegrityBoundaryMapEntryIssue(
      entries,
      (entry) =>
        !ERROR_TRACKING_LOGGING_AUDIT_INTEGRITY_BOUNDARY_FAMILIES.includes(
          entry.boundaryFamily
        )
    )
  ) {
    return "unknown_boundary_family_error_tracking_logging_audit_integrity_contract_boundary_map_input_rejected";
  }

  if (
    errorTrackingLoggingAuditIntegrityBoundaryMapEntryIssue(
      entries,
      (entry) =>
        !ERROR_TRACKING_LOGGING_AUDIT_INTEGRITY_RELATED_SYSTEMS.includes(
          entry.relatedSystem
        )
    )
  ) {
    return "unknown_related_system_error_tracking_logging_audit_integrity_contract_boundary_map_input_rejected";
  }

  if (
    errorTrackingLoggingAuditIntegrityBoundaryMapEntryIssue(
      entries,
      (entry) =>
        !ERROR_TRACKING_LOGGING_AUDIT_INTEGRITY_STATUSES.includes(
          entry.currentStatus
        )
    )
  ) {
    return "unknown_current_status_error_tracking_logging_audit_integrity_contract_boundary_map_input_rejected";
  }

  if (
    errorTrackingLoggingAuditIntegrityBoundaryMapEntryIssue(
      entries,
      errorTrackingLoggingAuditIntegrityBoundaryMapEntryMalformed
    )
  ) {
    return MALFORMED_ERROR_TRACKING_LOGGING_AUDIT_INTEGRITY_CONTRACT_BOUNDARY_MAP_CLASSIFICATION;
  }

  if (
    ERROR_TRACKING_LOGGING_AUDIT_INTEGRITY_AUTHORIZATION_FIELDS.some(
      (field) => inputRecord[field] === true
    )
  ) {
    return "runtime_authorization_attempt_error_tracking_logging_audit_integrity_contract_boundary_map_input_rejected";
  }

  if (
    errorTrackingLoggingAuditIntegrityBoundaryMapEntryIssue(
      entries,
      errorTrackingLoggingAuditIntegrityBoundaryMapAuthorizationFlagEnabled
    ) ||
    errorTrackingLoggingAuditIntegrityBoundaryMapAuthorizationFlagEnabled(
      inputRecord
    )
  ) {
    return "authorization_flags_enabled_error_tracking_logging_audit_integrity_contract_boundary_map_input_rejected";
  }

  if (
    errorTrackingLoggingAuditIntegrityBoundaryMapHasTrueFieldDeep(inputRecord, [
      "reportRunsChecks"
    ])
  ) {
    return "report_runs_checks_true_error_tracking_logging_audit_integrity_contract_boundary_map_input_rejected";
  }

  if (
    errorTrackingLoggingAuditIntegrityBoundaryMapHasTrueFieldDeep(
      inputRecord,
      ERROR_TRACKING_LOGGING_AUDIT_INTEGRITY_AUTHORIZATION_FIELDS
    )
  ) {
    return "runtime_authorization_attempt_error_tracking_logging_audit_integrity_contract_boundary_map_input_rejected";
  }

  if (
    errorTrackingLoggingAuditIntegrityBoundaryMapHasTrueFieldDeep(
      inputRecord,
      ERROR_TRACKING_LOGGING_AUDIT_INTEGRITY_COMMAND_FIELDS
    )
  ) {
    return "command_exposure_attempt_error_tracking_logging_audit_integrity_contract_boundary_map_input_rejected";
  }

  if (
    errorTrackingLoggingAuditIntegrityBoundaryMapHasTrueFieldDeep(
      inputRecord,
      ERROR_TRACKING_LOGGING_AUDIT_INTEGRITY_BLOCKED_CLI_BYPASS_FIELDS
    )
  ) {
    return "blocked_cli_bypass_attempt_error_tracking_logging_audit_integrity_contract_boundary_map_input_rejected";
  }

  for (const { classification, fields } of ERROR_TRACKING_LOGGING_AUDIT_INTEGRITY_HIDDEN_FIELD_GROUPS) {
    if (
      errorTrackingLoggingAuditIntegrityBoundaryMapHasPresentFieldDeep(
        inputRecord,
        fields
      )
    ) {
      return classification;
    }
  }

  if (
    errorTrackingLoggingAuditIntegrityBoundaryMapUnsafeFlagEnabled(
      inputRecord
    ) ||
    errorTrackingLoggingAuditIntegrityBoundaryMapEntryIssue(
      entries,
      errorTrackingLoggingAuditIntegrityBoundaryMapUnsafeFlagEnabled
    )
  ) {
    return "unsafe_logger_audit_transcript_telemetry_error_external_sink_tamper_redaction_trace_alerting_backend_storage_runtime_flags_error_tracking_logging_audit_integrity_contract_boundary_map_input_rejected";
  }

  if (
    errorTrackingLoggingAuditIntegrityBoundaryMapEntryIssue(
      entries,
      (entry) =>
        errorTrackingLoggingAuditIntegrityBoundaryMapContainsTrue(
          entry?.runtimeEffect
        )
    ) ||
    errorTrackingLoggingAuditIntegrityBoundaryMapContainsTrue(
      inputRecord?.runtimeEffect
    )
  ) {
    return "nested_unsafe_flags_error_tracking_logging_audit_integrity_contract_boundary_map_input_rejected";
  }

  if (
    Object.keys(inputRecord).some(
      (field) =>
        !ERROR_TRACKING_LOGGING_AUDIT_INTEGRITY_ALLOWED_TOP_LEVEL_FIELDS.includes(
          field
        )
    )
  ) {
    return "unknown_top_level_field_error_tracking_logging_audit_integrity_contract_boundary_map_input_rejected";
  }

  if (!errorTrackingLoggingAuditIntegrityBoundaryMapCanonical(entries)) {
    return "noncanonical_error_tracking_logging_audit_integrity_contract_boundary_map_input_rejected";
  }

  return VALID_ERROR_TRACKING_LOGGING_AUDIT_INTEGRITY_CONTRACT_BOUNDARY_MAP_CLASSIFICATION;
}

function errorTrackingLoggingAuditIntegrityBoundaryMapAuthorizationFlags() {
  return {
    loggingRuntimeAuthorizationGranted: false,
    auditWriterAuthorizationGranted: false,
    transcriptWriterAuthorizationGranted: false,
    telemetryClientAuthorizationGranted: false,
    errorCollectorAuthorizationGranted: false,
    externalSinkAuthorizationGranted: false,
    exportPathAuthorizationGranted: false,
    persistencePathAuthorizationGranted: false,
    tamperEvidentWriterAuthorizationGranted: false,
    redactionRuntimeAuthorizationGranted: false,
    traceCollectorAuthorizationGranted: false,
    alertingRuntimeAuthorizationGranted: false,
    backendApiServerAuthorizationGranted: false,
    storageWriteAuthorizationGranted: false,
    connectorGrantAuthorizationGranted: false,
    fabricRuntimeAuthorizationGranted: false,
    websocketHttpRuntimeAuthorizationGranted: false,
    mcpToolExposureAuthorizationGranted: false,
    taskExecutionAuthorizationGranted: false,
    secureDropAuthorizationGranted: false,
    encodedHandoffRuntimeAuthorizationGranted: false,
    commandExposureAuthorizationGranted: false,
    approvalDecisionProduced: false,
    approvalGrantProduced: false,
    connectorGrantProduced: false,
    authorizesRuntime: false
  };
}

function errorTrackingLoggingAuditIntegrityBoundaryMapFalseRuntimeFields() {
  return Object.fromEntries(
    ERROR_TRACKING_LOGGING_AUDIT_INTEGRITY_UNSAFE_FIELDS.map((field) => [
      field,
      false
    ])
  );
}

function errorTrackingLoggingAuditIntegrityBoundaryMapNotes() {
  return {
    noConsumerRole:
      "No current runtime role; future consumers may inspect metadata only.",
    currentAuthorization:
      "Requires a future error-tracking, logging, audit-integrity, backend, storage, auth, security, rate-limiting, runtime, command exposure, connector, Fabric, Secure Drop, MCP/task, filesystem/process-control, and approval authorization phase before any executable behavior.",
    fabricMetadataOnly:
      "Fabric remains a future coordination envelope metadata layer, not a bus, broker, transport, adapter, connector, registry, scheduler, importer, exporter, package distributor, observability sink, or task executor.",
    secureDropContentFabric:
      "Secure Drop audit metadata remains a future content-fabric contract; Ardyn records references only and implements no Secure Drop crypto, transport, stego, send/receive, inbox polling, file selection, connector ingestion, secret/vault/env access, ST3GG wrapping, audit writer, or result collector."
  };
}

function errorTrackingLoggingAuditIntegrityBoundaryMapDefinition(definition) {
  const notes = errorTrackingLoggingAuditIntegrityBoundaryMapNotes();

  return {
    ...definition,
    allowedCurrentBehavior: [
      `Describe future ${definition.subject} error-tracking, logging, audit-integrity, tamper-evidence, and observability boundary metadata.`,
      "Keep current behavior review-only, metadata-only, non-authorizing, and runtime-blocked."
    ],
    requiredFutureContractBeforeImplementation:
      `A future ${definition.subject} contract must define error classification, log event shape, audit subject, tamper-evidence, redaction, retention/deletion, correlation/idempotency, storage boundaries, consumer ownership, and explicit no-runtime defaults before implementation.`,
    requiredFutureAuthorizationPhaseBeforeRuntime: notes.currentAuthorization,
    locusRoleDescription: definition.locusRole ?? notes.noConsumerRole,
    multiverseRoleDescription:
      definition.multiverseRole ?? notes.noConsumerRole,
    fabricRoleDescription: definition.fabricRole ?? notes.fabricMetadataOnly,
    secureDropRoleDescription: definition.secureDropRole ?? "Not applicable."
  };
}

function errorTrackingLoggingAuditIntegrityBoundaryMapDefinitions() {
  const notes = errorTrackingLoggingAuditIntegrityBoundaryMapNotes();
  const classification =
    "Future error classes must be stable review metadata only; Ardyn emits no runtime exceptions, collectors, alerts, or live telemetry.";
  const shape =
    "Future log event shapes must be schema-bound metadata only now; Ardyn writes no logs, audit records, transcripts, telemetry, files, databases, or external sinks.";
  const subject =
    "Future audit subjects require explicit identity, permission, consent, and review contracts before any runtime subject is observed.";
  const tamper =
    "Tamper-evidence remains planning metadata only; Ardyn creates no digest writer, hash chain, signature writer, Merkle root, or persistence path.";
  const redaction =
    "Redaction remains contract metadata only; Ardyn runs no sanitizer, redactor, secret scanner, telemetry scrubber, or external lookup.";
  const retention =
    "Retention, deletion, and export remain policy metadata only; Ardyn creates no retention job, deletion job, package export, external sink, or persistence.";
  const correlation =
    "Correlation and idempotency remain future contract metadata only; Ardyn creates no trace collector, span, request id store, idempotency store, retry state, or queue.";

  return [
    errorTrackingLoggingAuditIntegrityBoundaryMapDefinition({
      boundaryId:
        "phase5-65.repo_family.backend_api_error_tracking.error_tracking_boundary",
      boundaryFamily: "error_tracking_contract",
      relatedSystem: "repo-family",
      currentStatus: "future_contract_required",
      subject: "backend/API error tracking",
      errorClassificationExpectation: classification,
      logEventShapeExpectation:
        "Future backend/API error events require explicit route, method, status, actor, correlation, redaction, and sink ownership before any endpoint or server exists.",
      auditSubjectExpectation: subject,
      tamperEvidenceExpectation: tamper,
      redactionExpectation: redaction,
      retentionDeletionExpectation: retention,
      correlationIdempotencyExpectation: correlation
    }),
    errorTrackingLoggingAuditIntegrityBoundaryMapDefinition({
      boundaryId:
        "phase5-65.ardyn.database_storage_audit_transcript.transcript_observability_boundary",
      boundaryFamily: "transcript_observability_contract",
      relatedSystem: "ardyn",
      currentStatus: "future_contract_required",
      subject: "database/storage audit and transcript persistence",
      errorClassificationExpectation: classification,
      logEventShapeExpectation: shape,
      auditSubjectExpectation:
        "Future transcript/audit subjects require Phase 5.61 storage ownership and Phase 5.62 identity boundaries before any write path.",
      tamperEvidenceExpectation: tamper,
      redactionExpectation: redaction,
      retentionDeletionExpectation:
        "Future transcript/audit retention requires explicit storage, deletion, export, backup, and recovery contracts before persistence.",
      correlationIdempotencyExpectation: correlation
    }),
    errorTrackingLoggingAuditIntegrityBoundaryMapDefinition({
      boundaryId:
        "phase5-65.ardyn.auth_permissions_audit_subject.audit_integrity_boundary",
      boundaryFamily: "audit_integrity_contract",
      relatedSystem: "ardyn",
      currentStatus: "future_contract_required",
      subject: "auth/permissions audit subject",
      errorClassificationExpectation: classification,
      logEventShapeExpectation: shape,
      auditSubjectExpectation:
        "Future audit subjects require Phase 5.62 identity, role, permission, consent, delegation, revocation, and traceability contracts first.",
      tamperEvidenceExpectation: tamper,
      redactionExpectation: redaction,
      retentionDeletionExpectation: retention,
      correlationIdempotencyExpectation: correlation
    }),
    errorTrackingLoggingAuditIntegrityBoundaryMapDefinition({
      boundaryId:
        "phase5-65.ardyn.security_rls_input_audit_integrity.audit_integrity_boundary",
      boundaryFamily: "audit_integrity_contract",
      relatedSystem: "ardyn",
      currentStatus: "future_contract_required",
      subject: "security/RLS/input-sanitization audit integrity",
      errorClassificationExpectation:
        "Future security findings must distinguish input, RLS, permission, dependency, and transport categories without running enforcement.",
      logEventShapeExpectation: shape,
      auditSubjectExpectation: subject,
      tamperEvidenceExpectation: tamper,
      redactionExpectation:
        "Future security audit redaction must be defined before any log writer; current metadata cannot inspect secrets, env, vaults, payloads, or connectors.",
      retentionDeletionExpectation: retention,
      correlationIdempotencyExpectation: correlation
    }),
    errorTrackingLoggingAuditIntegrityBoundaryMapDefinition({
      boundaryId:
        "phase5-65.ardyn.rate_limit_abuse_event_observability.abuse_event_boundary",
      boundaryFamily: "abuse_event_observability_contract",
      relatedSystem: "ardyn",
      currentStatus: "future_contract_required",
      subject: "rate-limit/abuse event observability",
      errorClassificationExpectation:
        "Future abuse events must remain separate from enforcement until Phase 5.64 limiter and quota contracts are separately authorized.",
      logEventShapeExpectation: shape,
      auditSubjectExpectation:
        "Future abuse event subjects require identity, quota, and storage contracts before any limiter state or audit record.",
      tamperEvidenceExpectation: tamper,
      redactionExpectation: redaction,
      retentionDeletionExpectation: retention,
      correlationIdempotencyExpectation: correlation
    }),
    errorTrackingLoggingAuditIntegrityBoundaryMapDefinition({
      boundaryId:
        "phase5-65.ardyn.cli_runtime_command_error_tracking.error_tracking_boundary",
      boundaryFamily: "error_tracking_contract",
      relatedSystem: "ardyn",
      currentStatus: "metadata_only",
      subject: "CLI/runtime command error tracking",
      errorClassificationExpectation:
        "Current CLI error metadata cannot expose commands, alter blocked command behavior, start runtime, or set reportRunsChecks.",
      logEventShapeExpectation: shape,
      auditSubjectExpectation: subject,
      tamperEvidenceExpectation: tamper,
      redactionExpectation: redaction,
      retentionDeletionExpectation: retention,
      correlationIdempotencyExpectation: correlation
    }),
    errorTrackingLoggingAuditIntegrityBoundaryMapDefinition({
      boundaryId:
        "phase5-65.ardyn.process_stdio_failure_logging.logging_boundary",
      boundaryFamily: "logging_contract",
      relatedSystem: "ardyn",
      currentStatus: "blocked",
      subject: "future process/stdin/stdout/stderr failure logging",
      errorClassificationExpectation: classification,
      logEventShapeExpectation:
        "Future process and stdio failure events require a separate runtime host contract; current metadata cannot add stdin loops or stdout/stderr runtime writers.",
      auditSubjectExpectation: subject,
      tamperEvidenceExpectation: tamper,
      redactionExpectation: redaction,
      retentionDeletionExpectation: retention,
      correlationIdempotencyExpectation: correlation
    }),
    errorTrackingLoggingAuditIntegrityBoundaryMapDefinition({
      boundaryId:
        "phase5-65.ardyn_subagent.encoded_handoff_raw_audit_visibility.encoded_handoff_audit_boundary",
      boundaryFamily: "encoded_handoff_audit_contract",
      relatedSystem: "ardyn-subagent",
      currentStatus: "future_contract_required",
      subject: "inter-agent encoded handoff raw/audit visibility",
      errorClassificationExpectation:
        "Future encoded handoff audit classes must keep raw protocol visibility metadata separate from codec, translator, stego, covert-channel, tokenizer-exploit, bypass, and hidden-payload runtimes.",
      logEventShapeExpectation: shape,
      auditSubjectExpectation:
        "Future encoded handoff audit subjects require visible source, target, operator translation, and audit metadata; no runtime channel exists now.",
      tamperEvidenceExpectation: tamper,
      redactionExpectation: redaction,
      retentionDeletionExpectation: retention,
      correlationIdempotencyExpectation: correlation
    }),
    errorTrackingLoggingAuditIntegrityBoundaryMapDefinition({
      boundaryId:
        "phase5-65.repo_family.fabric_coordination_envelope_observability.fabric_observability_boundary",
      boundaryFamily: "fabric_observability_contract",
      relatedSystem: "repo-family",
      currentStatus: "future_contract_required",
      subject: "Fabric coordination-envelope observability",
      errorClassificationExpectation: classification,
      logEventShapeExpectation:
        "Future Fabric observability events require envelope source, target, family, correlation, and audit metadata without creating a Fabric bus or sink.",
      auditSubjectExpectation: subject,
      tamperEvidenceExpectation: tamper,
      redactionExpectation: redaction,
      retentionDeletionExpectation: retention,
      correlationIdempotencyExpectation: correlation,
      locusRole: "Locus may later display Fabric observability metadata only.",
      multiverseRole:
        "Multiverse may later display Fabric observability metadata only."
    }),
    errorTrackingLoggingAuditIntegrityBoundaryMapDefinition({
      boundaryId:
        "phase5-65.locus.status_error_audit_display.redaction_boundary",
      boundaryFamily: "redaction_contract",
      relatedSystem: "locus",
      currentStatus: "future_contract_required",
      subject: "Locus-visible status/error/audit display",
      errorClassificationExpectation: classification,
      logEventShapeExpectation:
        "Future Locus display events require consumer-owned accessible labels, redaction, severity vocabulary, and no hidden action semantics before UI work.",
      auditSubjectExpectation: subject,
      tamperEvidenceExpectation: tamper,
      redactionExpectation:
        "Locus display redaction remains metadata only; Ardyn implements no UI, browser, rendering, WCAG automation, log writer, or secret scanner.",
      retentionDeletionExpectation: retention,
      correlationIdempotencyExpectation: correlation,
      locusRole:
        "Locus remains a future first-class consumer target only; no Locus repo or runtime is modified."
    }),
    errorTrackingLoggingAuditIntegrityBoundaryMapDefinition({
      boundaryId:
        "phase5-65.multiverse.capability_task_error_status.trace_correlation_boundary",
      boundaryFamily: "trace_correlation_contract",
      relatedSystem: "multiverse",
      currentStatus: "future_contract_required",
      subject: "Multiverse-visible capability/task error status",
      errorClassificationExpectation: classification,
      logEventShapeExpectation:
        "Future Multiverse capability/task status events require consumer-owned world, project, citizen, adapter, task, and correlation metadata before display or orchestration.",
      auditSubjectExpectation: subject,
      tamperEvidenceExpectation: tamper,
      redactionExpectation: redaction,
      retentionDeletionExpectation: retention,
      correlationIdempotencyExpectation:
        "Future Multiverse correlation requires consumer-owned task/capability identifiers; Ardyn creates no task runner, trace collector, queue, or orchestration runtime.",
      multiverseRole:
        "Multiverse remains a future first-class consumer target only; no Multiverse repo or runtime is modified."
    }),
    errorTrackingLoggingAuditIntegrityBoundaryMapDefinition({
      boundaryId:
        "phase5-65.ardyn.mcp_tool_exposure_audit.audit_integrity_boundary",
      boundaryFamily: "audit_integrity_contract",
      relatedSystem: "ardyn",
      currentStatus: "blocked",
      subject: "MCP/tool exposure audit",
      errorClassificationExpectation: classification,
      logEventShapeExpectation: shape,
      auditSubjectExpectation:
        "Future MCP/tool audit subjects require explicit tool, server, operator, permission, connector, and task boundaries before exposure.",
      tamperEvidenceExpectation: tamper,
      redactionExpectation: redaction,
      retentionDeletionExpectation: retention,
      correlationIdempotencyExpectation: correlation
    }),
    errorTrackingLoggingAuditIntegrityBoundaryMapDefinition({
      boundaryId:
        "phase5-65.repo_family.connector_grant_audit.audit_integrity_boundary",
      boundaryFamily: "audit_integrity_contract",
      relatedSystem: "repo-family",
      currentStatus: "blocked",
      subject: "connector-grant audit",
      errorClassificationExpectation: classification,
      logEventShapeExpectation: shape,
      auditSubjectExpectation:
        "Future connector audits require explicit connector, credential, subject, scope, consent, and revocation metadata before any grant.",
      tamperEvidenceExpectation: tamper,
      redactionExpectation:
        "Connector audit redaction cannot read credentials, secrets, env, vaults, files, or external services in Ardyn.",
      retentionDeletionExpectation: retention,
      correlationIdempotencyExpectation: correlation,
      locusRole: "Locus may later display connector audit metadata only.",
      multiverseRole:
        "Multiverse may later display connector candidate audit metadata only."
    }),
    errorTrackingLoggingAuditIntegrityBoundaryMapDefinition({
      boundaryId:
        "phase5-65.content_fabric.secure_drop_metadata_audit.secure_drop_audit_boundary",
      boundaryFamily: "secure_drop_audit_boundary",
      relatedSystem: "content-fabric",
      currentStatus: "future_contract_required",
      subject: "Secure Drop metadata audit",
      errorClassificationExpectation:
        "Future Secure Drop metadata audit classes are content-fabric-owned and cannot imply Ardyn Secure Drop implementation.",
      logEventShapeExpectation: shape,
      auditSubjectExpectation:
        "Future Secure Drop audit subjects require content-fabric-owned sender, recipient, keyring, DID, consent, and traceability metadata.",
      tamperEvidenceExpectation:
        "Future Secure Drop tamper-evidence is content-fabric-owned; Ardyn creates no digest, chain, signature, or persistence writer.",
      redactionExpectation:
        "Secure Drop metadata audit must reject crypto, transport, stego, send/receive, inbox polling, file selection, filesystem scanning, connector ingestion, secret/vault/env access, and ST3GG wrapping.",
      retentionDeletionExpectation: retention,
      correlationIdempotencyExpectation: correlation,
      locusRole: "Locus may later display Secure Drop audit placeholders only.",
      fabricRole:
        "Fabric may later carry Secure Drop audit reference metadata only.",
      secureDropRole: notes.secureDropContentFabric
    }),
    errorTrackingLoggingAuditIntegrityBoundaryMapDefinition({
      boundaryId:
        "phase5-65.repo_family.external_sink_export.external_sink_boundary",
      boundaryFamily: "external_sink_boundary",
      relatedSystem: "repo-family",
      currentStatus: "blocked",
      subject: "external sink/export",
      errorClassificationExpectation: classification,
      logEventShapeExpectation:
        "Future external sink payloads require explicit schemas, redaction, retention, export ownership, and authorization; Ardyn creates no sink, exporter, package, or network path.",
      auditSubjectExpectation: subject,
      tamperEvidenceExpectation: tamper,
      redactionExpectation: redaction,
      retentionDeletionExpectation: retention,
      correlationIdempotencyExpectation: correlation
    }),
    errorTrackingLoggingAuditIntegrityBoundaryMapDefinition({
      boundaryId:
        "phase5-65.repo_family.retention_deletion_export_policy.retention_boundary",
      boundaryFamily: "retention_contract",
      relatedSystem: "repo-family",
      currentStatus: "future_contract_required",
      subject: "retention/deletion/export policy",
      errorClassificationExpectation: classification,
      logEventShapeExpectation: shape,
      auditSubjectExpectation: subject,
      tamperEvidenceExpectation: tamper,
      redactionExpectation: redaction,
      retentionDeletionExpectation:
        "Future retention/deletion/export requires explicit policy, storage owner, consumer owner, recovery impact, and legal/compliance review before any job or export path.",
      correlationIdempotencyExpectation: correlation
    }),
    errorTrackingLoggingAuditIntegrityBoundaryMapDefinition({
      boundaryId:
        "phase5-65.repo_family.tamper_evident_digest_hash_chaining.tamper_evidence_boundary",
      boundaryFamily: "tamper_evidence_contract",
      relatedSystem: "repo-family",
      currentStatus: "future_contract_required",
      subject: "tamper-evident digest/hash/chaining planning",
      errorClassificationExpectation: classification,
      logEventShapeExpectation: shape,
      auditSubjectExpectation: subject,
      tamperEvidenceExpectation:
        "Future tamper-evident planning may describe digest, hash, chain, signature, and verification metadata only; Ardyn writes no digest, chain, signature, audit log, or storage record.",
      redactionExpectation: redaction,
      retentionDeletionExpectation: retention,
      correlationIdempotencyExpectation: correlation
    })
  ];
}

function errorTrackingLoggingAuditIntegrityBoundaryMapEntry(definition) {
  const { subject: _subject, locusRole, multiverseRole, fabricRole, secureDropRole, ...entry } = definition;

  return {
    ...entry,
    forbiddenCurrentBehavior:
      errorTrackingLoggingAuditIntegrityBoundaryMapForbiddenBehavior(),
    productionReadinessAreaReference: {
      phase: "5.48",
      areaNumber: 12,
      areaName: "Error Tracking & Logs",
      sourceFixture:
        "tests/fixtures/host-policy/phase5-48/production-readiness-coverage-matrix.json",
      sourceStatus: "deferred",
      representedByPhase565: true,
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
    phase560InterAgentEncodedHandoffConformanceReference: {
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
    phase562AuthPermissionsContractBoundaryReference: {
      phase: "5.62",
      sourceFixture:
        "tests/fixtures/host-policy/phase5-62/auth-permissions-contract-boundary-map.json",
      authPermissionsBoundaryReferenced: true,
      implementsAuthPermissionsRuntime: false,
      authorizesRuntime: false
    },
    phase563SecurityRlsInputSanitizationBoundaryReference: {
      phase: "5.63",
      sourceFixture:
        "tests/fixtures/host-policy/phase5-63/security-rls-input-sanitization-contract-boundary-map.json",
      securityRlsInputSanitizationBoundaryReferenced: true,
      implementsSecurityRuntime: false,
      authorizesRuntime: false
    },
    phase564RateLimitingAbuseControlBoundaryReference: {
      phase: "5.64",
      sourceFixture:
        "tests/fixtures/host-policy/phase5-64/rate-limiting-abuse-control-contract-boundary-map.json",
      rateLimitingAbuseControlBoundaryReferenced: true,
      implementsAbuseRuntime: false,
      authorizesRuntime: false
    },
    errorTrackingLoggingAuditIntegrityBoundaryMetadataOnly: true,
    noLiveObservabilityPerformed: true,
    explicitBlockedAuthorizationFlags:
      errorTrackingLoggingAuditIntegrityBoundaryMapAuthorizationFlags(),
    unsafeErrorLoggingAuditRuntimeFlags:
      errorTrackingLoggingAuditIntegrityBoundaryMapFalseRuntimeFields(),
    nonAuthorizingProof: true,
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

function errorTrackingLoggingAuditIntegrityBoundaryMapEntries() {
  return errorTrackingLoggingAuditIntegrityBoundaryMapDefinitions().map(
    errorTrackingLoggingAuditIntegrityBoundaryMapEntry
  );
}

function errorTrackingLoggingAuditIntegrityBoundaryMapSummary(entries) {
  const countByFamily = Object.fromEntries(
    ERROR_TRACKING_LOGGING_AUDIT_INTEGRITY_BOUNDARY_FAMILIES.map((family) => [
      family,
      entries.filter((entry) => entry.boundaryFamily === family).length
    ])
  );
  const countByRelatedSystem = Object.fromEntries(
    ERROR_TRACKING_LOGGING_AUDIT_INTEGRITY_RELATED_SYSTEMS.map((system) => [
      system,
      entries.filter((entry) => entry.relatedSystem === system).length
    ])
  );

  return {
    errorTrackingLoggingAuditIntegrityContractBoundaryMapKind:
      ERROR_TRACKING_LOGGING_AUDIT_INTEGRITY_CONTRACT_BOUNDARY_MAP_KIND,
    boundaryEntryCount: entries.length,
    boundaryIds: entries.map((entry) => entry.boundaryId),
    boundaryFamilies: [
      ...ERROR_TRACKING_LOGGING_AUDIT_INTEGRITY_BOUNDARY_FAMILIES
    ],
    relatedSystems: [...ERROR_TRACKING_LOGGING_AUDIT_INTEGRITY_RELATED_SYSTEMS],
    currentStatusValues: [...ERROR_TRACKING_LOGGING_AUDIT_INTEGRITY_STATUSES],
    countByFamily,
    countByRelatedSystem,
    phase548ErrorTrackingLogsCoverageItemRepresented: true,
    phase559FabricAwareApiBackendBoundaryReferenced: true,
    phase560EncodedHandoffConformanceReferenced: true,
    phase561DatabaseStorageContractBoundaryReferenced: true,
    phase562AuthPermissionsContractBoundaryReferenced: true,
    phase563SecurityRlsInputSanitizationBoundaryReferenced: true,
    phase564RateLimitingAbuseControlBoundaryReferenced: true,
    errorTrackingLoggingAuditIntegrityBoundaryMetadataOnly: true,
    noLiveObservabilityPerformed: true,
    noLoggerRuntimeImplemented: true,
    noAuditWriterImplemented: true,
    noTranscriptWriterImplemented: true,
    noTelemetryClientImplemented: true,
    noErrorCollectorImplemented: true,
    noExternalSinkImplemented: true,
    noTamperEvidentWriterImplemented: true,
    noRedactionRuntimeImplemented: true,
    noTraceCollectorImplemented: true,
    noAlertingRuntimeImplemented: true,
    noBackendApiServerImplemented: true,
    noStorageWrites: true,
    noConnectorGrants: true,
    contentFabricCanonicalSecureDropOwnerOnly: true,
    allBlockedAuthorizationFlagsFalse: true,
    allUnsafeErrorLoggingAuditRuntimeFlagsFalse: true,
    allRuntimeEffectsFalse: true,
    allEntriesNonAuthorizing: true
  };
}

function errorTrackingLoggingAuditIntegrityBoundaryMapValidationRules() {
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
    unsafeLoggerAuditTranscriptTelemetryErrorExternalSinkTamperRedactionTraceAlertingBackendStorageRuntimeFlagsFailClosed:
      true,
    hiddenLogWriterSemanticsFailClosed: true,
    hiddenAuditTranscriptWriteSemanticsFailClosed: true,
    hiddenTelemetryExportExternalSinkSemanticsFailClosed: true,
    hiddenTamperEvidentChainWriterSemanticsFailClosed: true,
    hiddenRedactionRuntimeSemanticsFailClosed: true,
    hiddenBackendApiServerSemanticsFailClosed: true,
    hiddenDatabaseStorageCacheWriteSemanticsFailClosed: true,
    hiddenAuthSessionTokenApiKeySemanticsFailClosed: true,
    hiddenConnectorGrantSemanticsFailClosed: true,
    hiddenFabricWebsocketHttpMcpTaskRuntimeSemanticsFailClosed: true,
    hiddenSecureDropImplementationSemanticsFailClosed: true,
    hiddenEncodedHandoffCodecTranslatorStegoCovertChannelTokenizerExploitBypassSemanticsFailClosed:
      true,
    nestedUnsafeFlagsFailClosed: true,
    noncanonicalBoundaryEntriesFailClosed: true,
    validationImplementsLoggerRuntime: false,
    validationWritesAudit: false,
    validationWritesTranscript: false,
    validationRunsTelemetryClient: false,
    validationRunsErrorCollector: false,
    validationConfiguresExternalSink: false,
    validationRunsTamperEvidentWriter: false,
    validationRunsRedactionRuntime: false,
    validationRunsTraceCollector: false,
    validationRunsAlertingRuntime: false,
    validationRunsBackendApiServer: false,
    validationWritesStorage: false,
    validationGrantsConnectors: false,
    validationRunsRuntime: false
  };
}

function errorTrackingLoggingAuditIntegrityBoundaryMapGaps() {
  return [
    "No logger runtime, audit writer, transcript writer, telemetry client, error collector, external sink, alerting client, redaction runtime, tamper-evident writer, digest/hash chain writer, trace collector, backend middleware, API, or server exists in Ardyn.",
    "Database/storage/cache/RLS, auth/permissions subject identity, security/input-sanitization, and rate-limit/abuse-control boundaries are referenced as metadata only and still require explicit future contracts.",
    "Fabric coordination, encoded handoff, MCP/tool exposure, connector grants, and Secure Drop audit metadata remain future boundaries with no runtime transport, task execution, service discovery, or storage sink.",
    "No storage writes, transcripts, audit records, logs, traces, spans, alerts, retention jobs, deletion jobs, export paths, packages, filesystem writes, or background polling are implemented.",
    "Future consumer displays still need Locus/Multiverse-owned error/audit status UI, accessibility, redaction, and action-disablement conformance before any interactive observability surface."
  ];
}

function errorTrackingLoggingAuditIntegrityBoundaryMapState(reviewedAt) {
  const boundaryEntries = errorTrackingLoggingAuditIntegrityBoundaryMapEntries();

  return {
    schema:
      ERROR_TRACKING_LOGGING_AUDIT_INTEGRITY_CONTRACT_BOUNDARY_MAP_STATE_SCHEMA,
    schemaVersion:
      ERROR_TRACKING_LOGGING_AUDIT_INTEGRITY_CONTRACT_BOUNDARY_MAP_VERSION,
    stateKind: ERROR_TRACKING_LOGGING_AUDIT_INTEGRITY_CONTRACT_BOUNDARY_MAP_KIND,
    stateMode: "review-only",
    reviewedAt,
    sourcePhaseContext: {
      phase548ProductionReadinessCoverageMatrix:
        "tests/fixtures/host-policy/phase5-48/production-readiness-coverage-matrix.json",
      phase548ErrorTrackingLogsAreaNumber: 12,
      phase548ErrorTrackingLogsStatus: "deferred",
      phase559FabricAwareApiBackendBoundary:
        "tests/fixtures/host-policy/phase5-59/fabric-aware-api-backend-contract-boundary-map.json",
      phase560InterAgentEncodedHandoffConformance:
        "tests/fixtures/host-policy/phase5-60/inter-agent-encoded-handoff-conformance.json",
      phase561DatabaseStorageContractBoundary:
        "tests/fixtures/host-policy/phase5-61/database-storage-contract-boundary-map.json",
      phase562AuthPermissionsContractBoundary:
        "tests/fixtures/host-policy/phase5-62/auth-permissions-contract-boundary-map.json",
      phase563SecurityRlsInputSanitizationContractBoundary:
        "tests/fixtures/host-policy/phase5-63/security-rls-input-sanitization-contract-boundary-map.json",
      phase564RateLimitingAbuseControlContractBoundary:
        "tests/fixtures/host-policy/phase5-64/rate-limiting-abuse-control-contract-boundary-map.json",
      secureDropCanonicalOwner: "content-fabric",
      runtimeStillBlocked: true
    },
    boundaryEntries,
    boundaryMapSummary:
      errorTrackingLoggingAuditIntegrityBoundaryMapSummary(boundaryEntries),
    invalidBoundaryCasePolicy:
      errorTrackingLoggingAuditIntegrityBoundaryMapValidationRules(),
    topObservabilityLoggingSecurityRateLimitingAuthDatabaseFabricApiBackendGaps:
      errorTrackingLoggingAuditIntegrityBoundaryMapGaps(),
    recommendedNextPhase:
      "phase-5.66-review-only-availability-recovery-contract-boundary-map",
    errorTrackingLoggingAuditIntegrityContractBoundaryMapOnly: true,
    reviewOnly: true,
    metadataOnly: true,
    authoritative: false,
    nonAuthorizingProof: true,
    reportRunsChecks: false,
    ...errorTrackingLoggingAuditIntegrityBoundaryMapFalseRuntimeFields(),
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

function errorTrackingLoggingAuditIntegrityBoundaryMapResult({
  reviewedAt,
  reviewedAtDefaulted,
  classification,
  accepted,
  errorTrackingLoggingAuditIntegrityContractBoundaryMap
}) {
  return {
    schema: ERROR_TRACKING_LOGGING_AUDIT_INTEGRITY_CONTRACT_BOUNDARY_MAP_SCHEMA,
    schemaVersion:
      ERROR_TRACKING_LOGGING_AUDIT_INTEGRITY_CONTRACT_BOUNDARY_MAP_VERSION,
    errorTrackingLoggingAuditIntegrityContractBoundaryMapKind:
      ERROR_TRACKING_LOGGING_AUDIT_INTEGRITY_CONTRACT_BOUNDARY_MAP_KIND,
    errorTrackingLoggingAuditIntegrityContractBoundaryMapMode: "review-only",
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    errorTrackingLoggingAuditIntegrityContractBoundaryMapProduced: accepted,
    errorTrackingLoggingAuditIntegrityContractBoundaryMap,
    boundaryMapSummary: accepted
      ? errorTrackingLoggingAuditIntegrityContractBoundaryMap.boundaryMapSummary
      : null,
    boundaryEntries: accepted
      ? errorTrackingLoggingAuditIntegrityContractBoundaryMap.boundaryEntries
      : [],
    invalidBoundaryCasePolicy: accepted
      ? errorTrackingLoggingAuditIntegrityContractBoundaryMap.invalidBoundaryCasePolicy
      : errorTrackingLoggingAuditIntegrityBoundaryMapValidationRules(),
    topObservabilityLoggingSecurityRateLimitingAuthDatabaseFabricApiBackendGaps:
      accepted
        ? errorTrackingLoggingAuditIntegrityContractBoundaryMap
            .topObservabilityLoggingSecurityRateLimitingAuthDatabaseFabricApiBackendGaps
        : [],
    recommendedNextPhase: accepted
      ? errorTrackingLoggingAuditIntegrityContractBoundaryMap.recommendedNextPhase
      : null,
    errorTrackingLoggingAuditIntegrityContractBoundaryMapOnly: true,
    reviewOnly: true,
    metadataOnly: true,
    authoritative: false,
    nonAuthorizingProof: true,
    reportRunsChecks: false,
    ...errorTrackingLoggingAuditIntegrityBoundaryMapFalseRuntimeFields(),
    rejectionReasons: accepted
      ? []
      : [
          {
            classification,
            rejected: true,
            runtimeAuthorized: false,
            loggingRuntimeAuthorized: false,
            auditWriterAuthorized: false,
            commandExposureAuthorized: false,
            reportRunsChecks: false
          }
        ],
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

export function createErrorTrackingLoggingAuditIntegrityContractBoundaryMapForReview(
  input = {}
) {
  const inputRecord =
    errorTrackingLoggingAuditIntegrityBoundaryMapInputRecord(input);
  const reviewedAt =
    errorTrackingLoggingAuditIntegrityBoundaryMapReviewedAt(inputRecord);
  const reviewedAtDefaulted = isReviewedAtDefaulted(inputRecord);
  const classification =
    errorTrackingLoggingAuditIntegrityBoundaryMapInputClassification(
      inputRecord
    );
  const accepted =
    classification ===
    VALID_ERROR_TRACKING_LOGGING_AUDIT_INTEGRITY_CONTRACT_BOUNDARY_MAP_CLASSIFICATION;
  const errorTrackingLoggingAuditIntegrityContractBoundaryMap = accepted
    ? errorTrackingLoggingAuditIntegrityBoundaryMapState(reviewedAt)
    : null;

  return errorTrackingLoggingAuditIntegrityBoundaryMapResult({
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    accepted,
    errorTrackingLoggingAuditIntegrityContractBoundaryMap
  });
}

const AVAILABILITY_RECOVERY_CONTRACT_BOUNDARY_MAP_STATE_SCHEMA =
  "ardyn.phase-5.66.availability-recovery-contract-boundary-map-state";
const VALID_AVAILABILITY_RECOVERY_CONTRACT_BOUNDARY_MAP_CLASSIFICATION =
  "valid_availability_recovery_contract_boundary_map_runtime_still_blocked";
const MALFORMED_AVAILABILITY_RECOVERY_CONTRACT_BOUNDARY_MAP_CLASSIFICATION =
  "malformed_availability_recovery_contract_boundary_map_input_rejected";

const AVAILABILITY_RECOVERY_BOUNDARY_FAMILIES = Object.freeze([
  "availability_contract",
  "health_check_contract",
  "resilience_contract",
  "disaster_recovery_contract",
  "backup_contract",
  "restore_contract",
  "rto_rpo_contract",
  "failover_contract",
  "degraded_mode_contract",
  "recovery_drill_contract",
  "runtime_unavailability_contract",
  "fabric_recovery_boundary",
  "secure_drop_recovery_boundary"
]);
const AVAILABILITY_RECOVERY_RELATED_SYSTEMS = Object.freeze([
  "ardyn",
  "ardyn-subagent",
  "locus",
  "multiverse",
  "content-fabric",
  "repo-family"
]);
const AVAILABILITY_RECOVERY_STATUSES = Object.freeze([
  "metadata_only",
  "blocked",
  "future_contract_required"
]);
const AVAILABILITY_RECOVERY_REQUIRED_FIELDS = Object.freeze([
  "boundaryId",
  "boundaryFamily",
  "relatedSystem",
  "currentStatus",
  "allowedCurrentBehavior",
  "forbiddenCurrentBehavior",
  "requiredFutureContractBeforeImplementation",
  "requiredFutureAuthorizationPhaseBeforeRuntime",
  "availabilityExpectation",
  "degradedModeExpectation",
  "healthCheckExpectation",
  "backupRestoreExpectation",
  "rtoRpoExpectation",
  "recoveryDrillExpectation",
  "dependencyFailureDomainExpectation",
  "locusRoleDescription",
  "multiverseRoleDescription",
  "fabricRoleDescription",
  "secureDropRoleDescription",
  "explicitBlockedAuthorizationFlags",
  "unsafeAvailabilityRecoveryRuntimeFlags",
  "nonAuthorizingProof"
]);
const AVAILABILITY_RECOVERY_ALLOWED_TOP_LEVEL_FIELDS = Object.freeze([
  "reviewedAt",
  "boundaryEntries"
]);
const AVAILABILITY_RECOVERY_UNSAFE_FIELDS = Object.freeze([
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
  "reportRunsChecks",
  "blockedCliBypassEnabled"
]);
const AVAILABILITY_RECOVERY_AUTHORIZATION_FIELDS = Object.freeze([
  "runtimeAuthorized",
  "runtimeAuthorizationGranted",
  "healthCheckRuntimeAuthorizationGranted",
  "monitorAuthorizationGranted",
  "schedulerAuthorizationGranted",
  "backupJobAuthorizationGranted",
  "restoreJobAuthorizationGranted",
  "failoverRuntimeAuthorizationGranted",
  "recoveryAutomationAuthorizationGranted",
  "processSupervisorAuthorizationGranted",
  "backendApiServerAuthorizationGranted",
  "databaseStorageAuthorizationGranted",
  "connectorGrantAuthorizationGranted",
  "fabricRuntimeAuthorizationGranted",
  "websocketHttpRuntimeAuthorizationGranted",
  "mcpToolExposureAuthorizationGranted",
  "taskExecutionAuthorizationGranted",
  "secureDropAuthorizationGranted",
  "encodedHandoffRuntimeAuthorizationGranted",
  "loggerAuditRuntimeAuthorizationGranted",
  "commandExposureAuthorizationGranted",
  "approvalDecisionProduced",
  "approvalGrantProduced",
  "authorizesRuntime"
]);
const AVAILABILITY_RECOVERY_COMMAND_FIELDS = Object.freeze([
  "commandExposureEnabled",
  "commandRuntimeControlEnabled",
  "commandsExposed",
  "exposesCommands",
  "runtimeCommandEnabled",
  "cliCommandExposed"
]);
const AVAILABILITY_RECOVERY_BLOCKED_CLI_BYPASS_FIELDS = Object.freeze([
  "blockedCliBypassEnabled",
  "dryRunBypassesBlock",
  "serveRuntimeBypassEnabled",
  "bypassBlockedCommandBehavior",
  "blockedCommandOverride"
]);
const AVAILABILITY_RECOVERY_HIDDEN_FIELD_GROUPS = Object.freeze([
  {
    classification:
      "hidden_health_check_runtime_semantics_availability_recovery_contract_boundary_map_input_rejected",
    fields: [
      "healthCheckUrl",
      "healthEndpoint",
      "healthChecker",
      "readinessProbe",
      "livenessProbe",
      "uptimeProbe",
      "syntheticCheck",
      "statusEndpoint"
    ]
  },
  {
    classification:
      "hidden_monitor_scheduler_semantics_availability_recovery_contract_boundary_map_input_rejected",
    fields: [
      "monitor",
      "monitoringClient",
      "scheduler",
      "cronSchedule",
      "pollingInterval",
      "backgroundPoller",
      "watchLoop",
      "uptimeMonitor"
    ]
  },
  {
    classification:
      "hidden_backup_restore_execution_semantics_availability_recovery_contract_boundary_map_input_rejected",
    fields: [
      "backupJob",
      "backupScheduler",
      "backupBucket",
      "snapshotWriter",
      "restoreJob",
      "restoreRunner",
      "restorePath",
      "recoveryPoint"
    ]
  },
  {
    classification:
      "hidden_failover_degraded_mode_runtime_semantics_availability_recovery_contract_boundary_map_input_rejected",
    fields: [
      "failoverController",
      "failoverRuntime",
      "degradedModeHandler",
      "trafficRouter",
      "standbyRegion",
      "circuitBreakerRuntime",
      "recoveryAutomation"
    ]
  },
  {
    classification:
      "hidden_process_supervision_semantics_availability_recovery_contract_boundary_map_input_rejected",
    fields: [
      "processSupervisor",
      "supervisorConfig",
      "childProcessManager",
      "restartPolicy",
      "processHealthLoop"
    ]
  },
  {
    classification:
      "hidden_backend_api_server_semantics_availability_recovery_contract_boundary_map_input_rejected",
    fields: [
      "backendApiMiddleware",
      "apiRequestHandler",
      "httpServer",
      "serverMiddleware",
      "httpEndpoint",
      "runtimeEndpoint"
    ]
  },
  {
    classification:
      "hidden_database_storage_cache_write_semantics_availability_recovery_contract_boundary_map_input_rejected",
    fields: [
      "databaseUrl",
      "databaseDsn",
      "dbConnectionString",
      "storageAdapter",
      "cacheEngine",
      "writeQueue",
      "persistenceLayer",
      "filesystemWrite",
      "backupRepository",
      "restoreRepository"
    ]
  },
  {
    classification:
      "hidden_auth_session_token_api_key_semantics_availability_recovery_contract_boundary_map_input_rejected",
    fields: [
      "loginUrl",
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
    ]
  },
  {
    classification:
      "hidden_connector_grant_semantics_availability_recovery_contract_boundary_map_input_rejected",
    fields: [
      "connectorGrant",
      "connectorCredential",
      "connectorAccessToken",
      "connectorHealthProbe",
      "connectorRecoveryGrant",
      "connectorIngestionGrant"
    ]
  },
  {
    classification:
      "hidden_fabric_websocket_http_mcp_task_runtime_semantics_availability_recovery_contract_boundary_map_input_rejected",
    fields: [
      "fabricBusTopic",
      "fabricBrokerUrl",
      "websocketUrl",
      "mcpToolName",
      "mcpServerUrl",
      "taskExecutor",
      "taskRunner",
      "adapterRuntime"
    ]
  },
  {
    classification:
      "hidden_secure_drop_implementation_semantics_availability_recovery_contract_boundary_map_input_rejected",
    fields: [
      "secureDropPayloadPath",
      "secureDropKeyring",
      "secureDropCryptoImplemented",
      "secureDropTransportImplemented",
      "secureDropStegoImplemented",
      "secureDropSendReceiveImplemented",
      "secureDropInboxPollingEnabled",
      "secureDropFileSelection",
      "st3ggPayload"
    ]
  },
  {
    classification:
      "hidden_encoded_handoff_codec_translator_stego_covert_channel_tokenizer_exploit_bypass_semantics_availability_recovery_contract_boundary_map_input_rejected",
    fields: [
      "codecImplemented",
      "translatorRuntimeImplemented",
      "encoderImplemented",
      "decoderImplemented",
      "conlangGenerator",
      "semanticStegoCandidate",
      "steganographyCandidate",
      "tokenExploitationCandidate",
      "covertChannel",
      "guardrailBypass",
      "hiddenPayload"
    ]
  },
  {
    classification:
      "hidden_logger_audit_transcript_telemetry_external_sink_semantics_availability_recovery_contract_boundary_map_input_rejected",
    fields: [
      "loggerRuntime",
      "logWriter",
      "auditWriter",
      "auditLogWriter",
      "transcriptWriter",
      "telemetryClient",
      "externalSink",
      "alertingClient",
      "logDrain"
    ]
  }
]);

function availabilityRecoveryBoundaryMapInputRecord(input) {
  return isPlainObjectRecord(input) ? input : null;
}

function availabilityRecoveryBoundaryMapReviewedAt(inputRecord) {
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

function availabilityRecoveryBoundaryMapContainsTrue(value) {
  if (value === true) {
    return true;
  }

  if (Array.isArray(value)) {
    return value.some(availabilityRecoveryBoundaryMapContainsTrue);
  }

  if (isPlainObjectRecord(value)) {
    return Object.values(value).some(availabilityRecoveryBoundaryMapContainsTrue);
  }

  return false;
}

function availabilityRecoveryBoundaryMapHasTrueFieldDeep(value, fields) {
  if (Array.isArray(value)) {
    return value.some((item) =>
      availabilityRecoveryBoundaryMapHasTrueFieldDeep(item, fields)
    );
  }

  if (!isPlainObjectRecord(value)) {
    return false;
  }

  for (const [key, nested] of Object.entries(value)) {
    if (fields.includes(key) && nested === true) {
      return true;
    }

    if (availabilityRecoveryBoundaryMapHasTrueFieldDeep(nested, fields)) {
      return true;
    }
  }

  return false;
}

function availabilityRecoveryBoundaryMapHasPresentFieldDeep(value, fields) {
  if (Array.isArray(value)) {
    return value.some((item) =>
      availabilityRecoveryBoundaryMapHasPresentFieldDeep(item, fields)
    );
  }

  if (!isPlainObjectRecord(value)) {
    return false;
  }

  for (const [key, nested] of Object.entries(value)) {
    if (
      key === "explicitBlockedAuthorizationFlags" ||
      key === "unsafeAvailabilityRecoveryRuntimeFlags"
    ) {
      continue;
    }

    if (fields.includes(key)) {
      return true;
    }

    if (availabilityRecoveryBoundaryMapHasPresentFieldDeep(nested, fields)) {
      return true;
    }
  }

  return false;
}

function availabilityRecoveryBoundaryMapEntriesInput(inputRecord) {
  return Array.isArray(inputRecord?.boundaryEntries)
    ? inputRecord.boundaryEntries
    : null;
}

function availabilityRecoveryBoundaryMapMalformed(inputRecord) {
  return (
    inputRecord === null ||
    (Object.prototype.hasOwnProperty.call(inputRecord, "reviewedAt") &&
      !isUtcIsoTimestampWithMilliseconds(inputRecord.reviewedAt)) ||
    (Object.prototype.hasOwnProperty.call(inputRecord, "boundaryEntries") &&
      !Array.isArray(inputRecord.boundaryEntries))
  );
}

function availabilityRecoveryBoundaryMapEntryIssue(entries, predicate) {
  return entries !== null && entries.some((entry) => predicate(entry));
}

function availabilityRecoveryBoundaryMapMissingRequired(entry) {
  return (
    !isPlainObjectRecord(entry) ||
    AVAILABILITY_RECOVERY_REQUIRED_FIELDS.some(
      (field) => !Object.prototype.hasOwnProperty.call(entry, field)
    )
  );
}

function availabilityRecoveryBoundaryMapEntryMalformed(entry) {
  if (!isPlainObjectRecord(entry)) {
    return true;
  }

  return (
    typeof entry.boundaryId !== "string" ||
    !Array.isArray(entry.allowedCurrentBehavior) ||
    !Array.isArray(entry.forbiddenCurrentBehavior) ||
    typeof entry.requiredFutureContractBeforeImplementation !== "string" ||
    typeof entry.requiredFutureAuthorizationPhaseBeforeRuntime !== "string" ||
    typeof entry.availabilityExpectation !== "string" ||
    typeof entry.degradedModeExpectation !== "string" ||
    typeof entry.healthCheckExpectation !== "string" ||
    typeof entry.backupRestoreExpectation !== "string" ||
    typeof entry.rtoRpoExpectation !== "string" ||
    typeof entry.recoveryDrillExpectation !== "string" ||
    typeof entry.dependencyFailureDomainExpectation !== "string" ||
    typeof entry.locusRoleDescription !== "string" ||
    typeof entry.multiverseRoleDescription !== "string" ||
    typeof entry.fabricRoleDescription !== "string" ||
    typeof entry.secureDropRoleDescription !== "string" ||
    !isPlainObjectRecord(entry.explicitBlockedAuthorizationFlags) ||
    !isPlainObjectRecord(entry.unsafeAvailabilityRecoveryRuntimeFlags) ||
    entry.nonAuthorizingProof !== true
  );
}

function availabilityRecoveryBoundaryMapAuthorizationFlagEnabled(value) {
  if (!isPlainObjectRecord(value)) {
    return false;
  }

  return (
    (isPlainObjectRecord(value.explicitBlockedAuthorizationFlags) &&
      Object.values(value.explicitBlockedAuthorizationFlags).some(
        (flag) => flag !== false
      )) ||
    AVAILABILITY_RECOVERY_AUTHORIZATION_FIELDS.some(
      (field) => value[field] === true
    )
  );
}

function availabilityRecoveryBoundaryMapUnsafeFlagEnabled(value) {
  if (!isPlainObjectRecord(value)) {
    return false;
  }

  return (
    (isPlainObjectRecord(value.unsafeAvailabilityRecoveryRuntimeFlags) &&
      Object.values(value.unsafeAvailabilityRecoveryRuntimeFlags).some(
        (flag) => flag !== false
      )) ||
    availabilityRecoveryBoundaryMapHasTrueFieldDeep(
      value,
      AVAILABILITY_RECOVERY_UNSAFE_FIELDS
    )
  );
}

function availabilityRecoveryBoundaryMapCanonical(entries) {
  if (entries === null) {
    return true;
  }

  return (
    JSON.stringify(entries) ===
    JSON.stringify(availabilityRecoveryBoundaryMapEntries())
  );
}

function availabilityRecoveryBoundaryMapInputClassification(inputRecord) {
  if (availabilityRecoveryBoundaryMapMalformed(inputRecord)) {
    return MALFORMED_AVAILABILITY_RECOVERY_CONTRACT_BOUNDARY_MAP_CLASSIFICATION;
  }

  const entries = availabilityRecoveryBoundaryMapEntriesInput(inputRecord);

  if (
    availabilityRecoveryBoundaryMapEntryIssue(
      entries,
      availabilityRecoveryBoundaryMapMissingRequired
    )
  ) {
    return "missing_required_availability_recovery_contract_boundary_entry_rejected";
  }

  if (
    availabilityRecoveryBoundaryMapEntryIssue(
      entries,
      (entry) =>
        !AVAILABILITY_RECOVERY_BOUNDARY_FAMILIES.includes(entry.boundaryFamily)
    )
  ) {
    return "unknown_boundary_family_availability_recovery_contract_boundary_map_input_rejected";
  }

  if (
    availabilityRecoveryBoundaryMapEntryIssue(
      entries,
      (entry) =>
        !AVAILABILITY_RECOVERY_RELATED_SYSTEMS.includes(entry.relatedSystem)
    )
  ) {
    return "unknown_related_system_availability_recovery_contract_boundary_map_input_rejected";
  }

  if (
    availabilityRecoveryBoundaryMapEntryIssue(
      entries,
      (entry) => !AVAILABILITY_RECOVERY_STATUSES.includes(entry.currentStatus)
    )
  ) {
    return "unknown_current_status_availability_recovery_contract_boundary_map_input_rejected";
  }

  if (
    availabilityRecoveryBoundaryMapEntryIssue(
      entries,
      availabilityRecoveryBoundaryMapEntryMalformed
    )
  ) {
    return MALFORMED_AVAILABILITY_RECOVERY_CONTRACT_BOUNDARY_MAP_CLASSIFICATION;
  }

  if (
    AVAILABILITY_RECOVERY_AUTHORIZATION_FIELDS.some(
      (field) => inputRecord[field] === true
    )
  ) {
    return "runtime_authorization_attempt_availability_recovery_contract_boundary_map_input_rejected";
  }

  if (
    availabilityRecoveryBoundaryMapEntryIssue(
      entries,
      availabilityRecoveryBoundaryMapAuthorizationFlagEnabled
    ) ||
    availabilityRecoveryBoundaryMapAuthorizationFlagEnabled(inputRecord)
  ) {
    return "authorization_flags_enabled_availability_recovery_contract_boundary_map_input_rejected";
  }

  if (
    availabilityRecoveryBoundaryMapHasTrueFieldDeep(inputRecord, [
      "reportRunsChecks"
    ])
  ) {
    return "report_runs_checks_true_availability_recovery_contract_boundary_map_input_rejected";
  }

  if (
    availabilityRecoveryBoundaryMapHasTrueFieldDeep(
      inputRecord,
      AVAILABILITY_RECOVERY_AUTHORIZATION_FIELDS
    )
  ) {
    return "runtime_authorization_attempt_availability_recovery_contract_boundary_map_input_rejected";
  }

  if (
    availabilityRecoveryBoundaryMapHasTrueFieldDeep(
      inputRecord,
      AVAILABILITY_RECOVERY_COMMAND_FIELDS
    )
  ) {
    return "command_exposure_attempt_availability_recovery_contract_boundary_map_input_rejected";
  }

  if (
    availabilityRecoveryBoundaryMapHasTrueFieldDeep(
      inputRecord,
      AVAILABILITY_RECOVERY_BLOCKED_CLI_BYPASS_FIELDS
    )
  ) {
    return "blocked_cli_bypass_attempt_availability_recovery_contract_boundary_map_input_rejected";
  }

  for (const { classification, fields } of AVAILABILITY_RECOVERY_HIDDEN_FIELD_GROUPS) {
    if (availabilityRecoveryBoundaryMapHasPresentFieldDeep(inputRecord, fields)) {
      return classification;
    }
  }

  if (
    availabilityRecoveryBoundaryMapUnsafeFlagEnabled(inputRecord) ||
    availabilityRecoveryBoundaryMapEntryIssue(
      entries,
      availabilityRecoveryBoundaryMapUnsafeFlagEnabled
    )
  ) {
    return "unsafe_availability_recovery_health_monitor_scheduler_backup_restore_failover_process_supervisor_backend_storage_runtime_flags_availability_recovery_contract_boundary_map_input_rejected";
  }

  if (
    availabilityRecoveryBoundaryMapEntryIssue(entries, (entry) =>
      availabilityRecoveryBoundaryMapContainsTrue(entry?.runtimeEffect)
    ) ||
    availabilityRecoveryBoundaryMapContainsTrue(inputRecord?.runtimeEffect)
  ) {
    return "nested_unsafe_flags_availability_recovery_contract_boundary_map_input_rejected";
  }

  if (
    Object.keys(inputRecord).some(
      (field) => !AVAILABILITY_RECOVERY_ALLOWED_TOP_LEVEL_FIELDS.includes(field)
    )
  ) {
    return "unknown_top_level_field_availability_recovery_contract_boundary_map_input_rejected";
  }

  if (!availabilityRecoveryBoundaryMapCanonical(entries)) {
    return "noncanonical_availability_recovery_contract_boundary_map_input_rejected";
  }

  return VALID_AVAILABILITY_RECOVERY_CONTRACT_BOUNDARY_MAP_CLASSIFICATION;
}

function availabilityRecoveryBoundaryMapAuthorizationFlags() {
  return {
    healthCheckRuntimeAuthorizationGranted: false,
    monitorAuthorizationGranted: false,
    schedulerAuthorizationGranted: false,
    backupJobAuthorizationGranted: false,
    restoreJobAuthorizationGranted: false,
    failoverRuntimeAuthorizationGranted: false,
    recoveryAutomationAuthorizationGranted: false,
    processSupervisorAuthorizationGranted: false,
    backendApiServerAuthorizationGranted: false,
    databaseStorageAuthorizationGranted: false,
    connectorGrantAuthorizationGranted: false,
    fabricRuntimeAuthorizationGranted: false,
    websocketHttpRuntimeAuthorizationGranted: false,
    mcpToolExposureAuthorizationGranted: false,
    taskExecutionAuthorizationGranted: false,
    secureDropAuthorizationGranted: false,
    encodedHandoffRuntimeAuthorizationGranted: false,
    loggerAuditRuntimeAuthorizationGranted: false,
    commandExposureAuthorizationGranted: false,
    approvalDecisionProduced: false,
    approvalGrantProduced: false,
    connectorGrantProduced: false,
    authorizesRuntime: false
  };
}

function availabilityRecoveryBoundaryMapFalseRuntimeFields() {
  return Object.fromEntries(
    AVAILABILITY_RECOVERY_UNSAFE_FIELDS.map((field) => [field, false])
  );
}

function availabilityRecoveryBoundaryMapNotes() {
  return {
    noConsumerRole:
      "No current runtime role; future consumers may inspect metadata only.",
    currentAuthorization:
      "Requires a future availability, resilience, disaster recovery, backup/restore, health-check, failover, RTO/RPO, recovery-drill, backend, storage, auth, security, rate-limiting, observability, runtime, command exposure, connector, Fabric, Secure Drop, MCP/task, filesystem/process-control, and approval authorization phase before any executable behavior.",
    fabricMetadataOnly:
      "Fabric remains a future coordination envelope metadata layer, not a bus, broker, transport, adapter, connector, registry, scheduler, monitor, importer, exporter, package distributor, recovery channel, or task executor.",
    secureDropContentFabric:
      "Secure Drop recovery metadata remains a future content-fabric contract; Ardyn records references only and implements no Secure Drop crypto, transport, stego, send/receive, inbox polling, file selection, connector ingestion, secret/vault/env access, ST3GG wrapping, restore job, recovery monitor, or result collector."
  };
}

function availabilityRecoveryBoundaryMapDefinition(definition) {
  const notes = availabilityRecoveryBoundaryMapNotes();

  return {
    ...definition,
    allowedCurrentBehavior: [
      `Describe future ${definition.subject} availability and recovery boundary metadata.`,
      "Keep current behavior review-only, metadata-only, non-authorizing, and runtime-blocked."
    ],
    requiredFutureContractBeforeImplementation:
      `A future ${definition.subject} contract must define availability expectations, degraded-mode semantics, health-check ownership, backup/restore ownership, RTO/RPO targets, recovery-drill evidence, dependency/failure-domain ownership, consumer visibility, and explicit no-runtime defaults before implementation.`,
    requiredFutureAuthorizationPhaseBeforeRuntime: notes.currentAuthorization,
    locusRoleDescription: definition.locusRole ?? notes.noConsumerRole,
    multiverseRoleDescription:
      definition.multiverseRole ?? notes.noConsumerRole,
    fabricRoleDescription: definition.fabricRole ?? notes.fabricMetadataOnly,
    secureDropRoleDescription: definition.secureDropRole ?? "Not applicable."
  };
}

function availabilityRecoveryBoundaryMapDefinitions() {
  const notes = availabilityRecoveryBoundaryMapNotes();
  const availability =
    "Availability remains future contract metadata only; Ardyn exposes no uptime monitor, probe, endpoint, transport, service discovery, or runtime status emitter.";
  const degraded =
    "Degraded-mode behavior remains future contract metadata only; Ardyn does not route traffic, disable runtime paths, execute tasks, or alter command behavior.";
  const health =
    "Health checks remain future contract metadata only; Ardyn starts no health checker, readiness probe, liveness probe, uptime probe, monitor, scheduler, or polling loop.";
  const backup =
    "Backup/restore remains future contract metadata only; Ardyn creates no snapshot, backup job, restore job, storage adapter, filesystem write, import/export path, package, or persistence.";
  const rto =
    "RTO/RPO remains planning metadata only; Ardyn records no live measurements, service-level objectives, timers, recovery windows, or enforcement.";
  const drill =
    "Recovery-drill evidence remains future contract metadata only; Ardyn runs no drill, scheduler, checker, monitor, task executor, or external lookup.";
  const dependency =
    "Dependency and failure-domain inventory remains future contract metadata only; Ardyn performs no service discovery, network lookup, connector introspection, filesystem scan, or process inspection.";

  return [
    availabilityRecoveryBoundaryMapDefinition({
      boundaryId:
        "phase5-66.repo_family.backend_api_availability.availability_boundary",
      boundaryFamily: "availability_contract",
      relatedSystem: "repo-family",
      currentStatus: "future_contract_required",
      subject: "backend/API availability",
      availabilityExpectation:
        "Future backend/API availability must define endpoint ownership, dependency ownership, downtime states, and consumer-visible status before any API or server exists.",
      degradedModeExpectation: degraded,
      healthCheckExpectation: health,
      backupRestoreExpectation: backup,
      rtoRpoExpectation: rto,
      recoveryDrillExpectation: drill,
      dependencyFailureDomainExpectation:
        "Future backend/API availability must list service, queue, storage, auth, Fabric, connector, and consumer failure domains without implementing them."
    }),
    availabilityRecoveryBoundaryMapDefinition({
      boundaryId:
        "phase5-66.ardyn.database_storage_backup.backup_boundary",
      boundaryFamily: "backup_contract",
      relatedSystem: "ardyn",
      currentStatus: "future_contract_required",
      subject: "database/storage backup",
      availabilityExpectation: availability,
      degradedModeExpectation: degraded,
      healthCheckExpectation: health,
      backupRestoreExpectation:
        "Future database/storage backup requires Phase 5.61 ownership, schema, retention, encryption, restore-test, and storage-write authorization before any backup job.",
      rtoRpoExpectation: rto,
      recoveryDrillExpectation: drill,
      dependencyFailureDomainExpectation: dependency
    }),
    availabilityRecoveryBoundaryMapDefinition({
      boundaryId:
        "phase5-66.ardyn.database_storage_restore.restore_boundary",
      boundaryFamily: "restore_contract",
      relatedSystem: "ardyn",
      currentStatus: "future_contract_required",
      subject: "database/storage restore",
      availabilityExpectation: availability,
      degradedModeExpectation: degraded,
      healthCheckExpectation: health,
      backupRestoreExpectation:
        "Future database/storage restore requires Phase 5.61 ownership, RLS, auth continuity, audit visibility, restore validation, and explicit rollback authorization before any restore job.",
      rtoRpoExpectation: rto,
      recoveryDrillExpectation: drill,
      dependencyFailureDomainExpectation: dependency
    }),
    availabilityRecoveryBoundaryMapDefinition({
      boundaryId:
        "phase5-66.ardyn.auth_permissions_recovery_revocation.resilience_boundary",
      boundaryFamily: "resilience_contract",
      relatedSystem: "ardyn",
      currentStatus: "future_contract_required",
      subject: "auth/permissions recovery and revocation continuity",
      availabilityExpectation:
        "Future auth recovery must define identity, role, permission, delegation, revocation, and stale-token continuity before any auth runtime.",
      degradedModeExpectation:
        "Future degraded auth behavior must fail closed and preserve revocation continuity; Ardyn creates no session, token, API key, or permission evaluator.",
      healthCheckExpectation: health,
      backupRestoreExpectation: backup,
      rtoRpoExpectation: rto,
      recoveryDrillExpectation: drill,
      dependencyFailureDomainExpectation: dependency
    }),
    availabilityRecoveryBoundaryMapDefinition({
      boundaryId:
        "phase5-66.ardyn.security_rls_fail_closed_recovery.failover_boundary",
      boundaryFamily: "failover_contract",
      relatedSystem: "ardyn",
      currentStatus: "future_contract_required",
      subject: "security/RLS fail-closed recovery",
      availabilityExpectation:
        "Future security/RLS recovery must define fail-closed behavior for missing RLS, invalid inputs, unavailable dependencies, and degraded identity before any enforcement.",
      degradedModeExpectation:
        "Future security degraded mode must deny unsafe access rather than grant fallback access; Ardyn creates no RLS, sanitizer, policy engine, or storage write.",
      healthCheckExpectation: health,
      backupRestoreExpectation: backup,
      rtoRpoExpectation: rto,
      recoveryDrillExpectation: drill,
      dependencyFailureDomainExpectation: dependency
    }),
    availabilityRecoveryBoundaryMapDefinition({
      boundaryId:
        "phase5-66.ardyn.rate_limit_abuse_degraded_mode.degraded_boundary",
      boundaryFamily: "degraded_mode_contract",
      relatedSystem: "ardyn",
      currentStatus: "future_contract_required",
      subject: "rate-limit/abuse-control degraded mode",
      availabilityExpectation:
        "Future abuse-control availability must define how limiter, quota, queue, backpressure, and abuse signals behave under partial outage before implementation.",
      degradedModeExpectation:
        "Future rate-limit degraded mode must not silently disable abuse controls; Ardyn creates no limiter, quota engine, queue, retry engine, circuit breaker, or idempotency store.",
      healthCheckExpectation: health,
      backupRestoreExpectation: backup,
      rtoRpoExpectation: rto,
      recoveryDrillExpectation: drill,
      dependencyFailureDomainExpectation: dependency
    }),
    availabilityRecoveryBoundaryMapDefinition({
      boundaryId:
        "phase5-66.ardyn.error_log_audit_recovery_visibility.disaster_recovery_boundary",
      boundaryFamily: "disaster_recovery_contract",
      relatedSystem: "ardyn",
      currentStatus: "future_contract_required",
      subject: "error/log/audit recovery visibility",
      availabilityExpectation:
        "Future recovery visibility must define error, log, audit, transcript, telemetry, redaction, retention, and tamper-evidence ownership before any writer or sink.",
      degradedModeExpectation: degraded,
      healthCheckExpectation: health,
      backupRestoreExpectation: backup,
      rtoRpoExpectation: rto,
      recoveryDrillExpectation: drill,
      dependencyFailureDomainExpectation: dependency
    }),
    availabilityRecoveryBoundaryMapDefinition({
      boundaryId:
        "phase5-66.ardyn.cli_runtime_unavailable_mode.runtime_unavailability_boundary",
      boundaryFamily: "runtime_unavailability_contract",
      relatedSystem: "ardyn",
      currentStatus: "blocked",
      subject: "CLI/runtime unavailable-mode",
      availabilityExpectation:
        "Current CLI/runtime remains unavailable; future availability metadata cannot expose commands, bypass dry-run blocking, or set reportRunsChecks.",
      degradedModeExpectation:
        "Unavailable mode remains blocked and emits no runtime status, command side effect, monitor, scheduler, or process control.",
      healthCheckExpectation: health,
      backupRestoreExpectation: backup,
      rtoRpoExpectation: rto,
      recoveryDrillExpectation: drill,
      dependencyFailureDomainExpectation: dependency
    }),
    availabilityRecoveryBoundaryMapDefinition({
      boundaryId:
        "phase5-66.ardyn.process_stdio_health_recovery.health_check_boundary",
      boundaryFamily: "health_check_contract",
      relatedSystem: "ardyn",
      currentStatus: "blocked",
      subject: "future process/stdio runtime health and recovery",
      availabilityExpectation:
        "Future process/stdio health requires a separate runtime host contract; current metadata cannot spawn, supervise, restart, read stdin, or write stdout/stderr.",
      degradedModeExpectation: degraded,
      healthCheckExpectation:
        "Future process/stdio health checks require explicit ownership for stdin, stdout, stderr, process lifecycle, transcript/audit boundaries, and fail-closed behavior before runtime.",
      backupRestoreExpectation: backup,
      rtoRpoExpectation: rto,
      recoveryDrillExpectation: drill,
      dependencyFailureDomainExpectation: dependency
    }),
    availabilityRecoveryBoundaryMapDefinition({
      boundaryId:
        "phase5-66.ardyn_subagent.encoded_handoff_recovery.fabric_recovery_boundary",
      boundaryFamily: "fabric_recovery_boundary",
      relatedSystem: "ardyn-subagent",
      currentStatus: "future_contract_required",
      subject: "inter-agent encoded handoff recovery",
      availabilityExpectation:
        "Future encoded handoff recovery must define raw-text preservation, consumer display, fail-closed decoding, and audit visibility without creating any codec or translator runtime.",
      degradedModeExpectation:
        "Future encoded handoff degraded mode must preserve review-only handoff metadata and never create stego, covert-channel, tokenizer exploit, bypass, or hidden payload behavior.",
      healthCheckExpectation: health,
      backupRestoreExpectation: backup,
      rtoRpoExpectation: rto,
      recoveryDrillExpectation: drill,
      dependencyFailureDomainExpectation: dependency
    }),
    availabilityRecoveryBoundaryMapDefinition({
      boundaryId:
        "phase5-66.repo_family.fabric_coordination_envelope_recovery.fabric_recovery_boundary",
      boundaryFamily: "fabric_recovery_boundary",
      relatedSystem: "repo-family",
      currentStatus: "future_contract_required",
      subject: "Fabric coordination-envelope recovery",
      availabilityExpectation:
        "Future Fabric envelope recovery must define metadata-only coordination, replay, visibility, and ownership before any bus, broker, websocket/http transport, registry, or task executor.",
      degradedModeExpectation: degraded,
      healthCheckExpectation: health,
      backupRestoreExpectation: backup,
      rtoRpoExpectation: rto,
      recoveryDrillExpectation: drill,
      dependencyFailureDomainExpectation: dependency,
      fabricRole:
        "Fabric may later carry recovery-envelope metadata only; Ardyn implements no Fabric runtime, bus, broker, adapter, connector, websocket/http transport, registry, scheduler, importer, exporter, or task execution."
    }),
    availabilityRecoveryBoundaryMapDefinition({
      boundaryId:
        "phase5-66.locus.availability_degraded_recovery_status.degraded_boundary",
      boundaryFamily: "degraded_mode_contract",
      relatedSystem: "locus",
      currentStatus: "future_contract_required",
      subject: "Locus-visible availability/degraded/recovery status",
      availabilityExpectation:
        "Future Locus display may render availability and recovery metadata only after Locus-owned UI contracts; Ardyn creates no UI, browser, frontend, rendering, or accessibility automation.",
      degradedModeExpectation:
        "Future Locus degraded display must be consumer-owned and action-disabled until runtime authorization exists.",
      healthCheckExpectation: health,
      backupRestoreExpectation: backup,
      rtoRpoExpectation: rto,
      recoveryDrillExpectation: drill,
      dependencyFailureDomainExpectation: dependency,
      locusRole:
        "Locus may later display availability, degraded, and recovery status metadata only."
    }),
    availabilityRecoveryBoundaryMapDefinition({
      boundaryId:
        "phase5-66.multiverse.capability_task_availability_status.degraded_boundary",
      boundaryFamily: "degraded_mode_contract",
      relatedSystem: "multiverse",
      currentStatus: "future_contract_required",
      subject: "Multiverse-visible capability/task availability status",
      availabilityExpectation:
        "Future Multiverse display may render capability/task availability metadata only after Multiverse-owned contracts; Ardyn creates no task runtime or connector grant.",
      degradedModeExpectation:
        "Future Multiverse degraded status must not imply task execution, connector ingestion, or recovery automation.",
      healthCheckExpectation: health,
      backupRestoreExpectation: backup,
      rtoRpoExpectation: rto,
      recoveryDrillExpectation: drill,
      dependencyFailureDomainExpectation: dependency,
      multiverseRole:
        "Multiverse may later display capability/task availability and degraded status metadata only."
    }),
    availabilityRecoveryBoundaryMapDefinition({
      boundaryId:
        "phase5-66.ardyn.mcp_tool_exposure_availability.availability_boundary",
      boundaryFamily: "availability_contract",
      relatedSystem: "ardyn",
      currentStatus: "blocked",
      subject: "MCP/tool exposure availability",
      availabilityExpectation:
        "Future MCP/tool availability requires explicit exposure, permission, health, failure, and consumer contracts before any MCP server, tool, or task runtime.",
      degradedModeExpectation:
        "Future MCP degraded status must not expose a fallback command or task executor; Ardyn keeps MCP/tool exposure blocked.",
      healthCheckExpectation: health,
      backupRestoreExpectation: backup,
      rtoRpoExpectation: rto,
      recoveryDrillExpectation: drill,
      dependencyFailureDomainExpectation: dependency
    }),
    availabilityRecoveryBoundaryMapDefinition({
      boundaryId:
        "phase5-66.repo_family.connector_grant_availability.availability_boundary",
      boundaryFamily: "availability_contract",
      relatedSystem: "repo-family",
      currentStatus: "future_contract_required",
      subject: "connector-grant availability",
      availabilityExpectation:
        "Future connector availability requires explicit grant, revocation, degraded-state, health, recovery, and audit contracts before any connector token or external integration.",
      degradedModeExpectation:
        "Future connector degraded mode must fail closed and preserve revocation; Ardyn creates no connector grant, credential, health probe, or external service integration.",
      healthCheckExpectation: health,
      backupRestoreExpectation: backup,
      rtoRpoExpectation: rto,
      recoveryDrillExpectation: drill,
      dependencyFailureDomainExpectation: dependency
    }),
    availabilityRecoveryBoundaryMapDefinition({
      boundaryId:
        "phase5-66.content_fabric.secure_drop_metadata_recovery.secure_drop_recovery_boundary",
      boundaryFamily: "secure_drop_recovery_boundary",
      relatedSystem: "content-fabric",
      currentStatus: "future_contract_required",
      subject: "Secure Drop metadata recovery",
      availabilityExpectation:
        "Future Secure Drop recovery metadata is content-fabric-owned and cannot imply Ardyn Secure Drop implementation.",
      degradedModeExpectation:
        "Future Secure Drop degraded mode must be content-fabric-owned; Ardyn creates no crypto, transport, stego, send/receive, inbox polling, file selection, connector ingestion, or ST3GG wrapping.",
      healthCheckExpectation: health,
      backupRestoreExpectation:
        "Future Secure Drop backup/restore ownership remains in content-fabric; Ardyn creates no payload storage, recovery job, restore job, keyring access, or filesystem scan.",
      rtoRpoExpectation: rto,
      recoveryDrillExpectation: drill,
      dependencyFailureDomainExpectation: dependency,
      locusRole: "Locus may later display Secure Drop recovery placeholders only.",
      fabricRole:
        "Fabric may later carry Secure Drop recovery reference metadata only.",
      secureDropRole: notes.secureDropContentFabric
    }),
    availabilityRecoveryBoundaryMapDefinition({
      boundaryId:
        "phase5-66.repo_family.recovery_drill_evidence.recovery_drill_boundary",
      boundaryFamily: "recovery_drill_contract",
      relatedSystem: "repo-family",
      currentStatus: "future_contract_required",
      subject: "recovery-drill evidence",
      availabilityExpectation: availability,
      degradedModeExpectation: degraded,
      healthCheckExpectation: health,
      backupRestoreExpectation: backup,
      rtoRpoExpectation: rto,
      recoveryDrillExpectation:
        "Future recovery-drill evidence must define scenario, scope, fixture, proof, owner, cadence, and pass/fail semantics before any scheduler or automation.",
      dependencyFailureDomainExpectation: dependency
    }),
    availabilityRecoveryBoundaryMapDefinition({
      boundaryId:
        "phase5-66.repo_family.rto_rpo_planning.rto_rpo_boundary",
      boundaryFamily: "rto_rpo_contract",
      relatedSystem: "repo-family",
      currentStatus: "future_contract_required",
      subject: "RTO/RPO planning",
      availabilityExpectation: availability,
      degradedModeExpectation: degraded,
      healthCheckExpectation: health,
      backupRestoreExpectation: backup,
      rtoRpoExpectation:
        "Future RTO/RPO planning must define target, measurement source, dependency scope, storage owner, recovery owner, consumer display, and authorization gate before runtime.",
      recoveryDrillExpectation: drill,
      dependencyFailureDomainExpectation: dependency
    }),
    availabilityRecoveryBoundaryMapDefinition({
      boundaryId:
        "phase5-66.repo_family.dependency_failure_domain_inventory.resilience_boundary",
      boundaryFamily: "resilience_contract",
      relatedSystem: "repo-family",
      currentStatus: "future_contract_required",
      subject: "dependency/failure-domain inventory",
      availabilityExpectation: availability,
      degradedModeExpectation: degraded,
      healthCheckExpectation: health,
      backupRestoreExpectation: backup,
      rtoRpoExpectation: rto,
      recoveryDrillExpectation: drill,
      dependencyFailureDomainExpectation:
        "Future dependency/failure-domain inventory must enumerate backend/API, DB/storage/cache, auth, security/RLS, rate-limiting, observability, Fabric, connector, MCP/task, Secure Drop, process, filesystem, and consumer-display owners without service discovery or polling."
    })
  ];
}

function availabilityRecoveryBoundaryMapEntry(definition) {
  const {
    subject: _subject,
    locusRole,
    multiverseRole,
    fabricRole,
    secureDropRole,
    ...entry
  } = definition;

  return {
    ...entry,
    forbiddenCurrentBehavior: availabilityRecoveryBoundaryMapForbiddenBehavior(),
    productionReadinessAreaReference: {
      phase: "5.48",
      areaNumber: 13,
      areaName: "Availability & Recovery",
      sourceFixture:
        "tests/fixtures/host-policy/phase5-48/production-readiness-coverage-matrix.json",
      sourceStatus: "deferred",
      representedByPhase566: true,
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
    phase560InterAgentEncodedHandoffConformanceReference: {
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
    phase562AuthPermissionsContractBoundaryReference: {
      phase: "5.62",
      sourceFixture:
        "tests/fixtures/host-policy/phase5-62/auth-permissions-contract-boundary-map.json",
      authPermissionsBoundaryReferenced: true,
      implementsAuthPermissionsRuntime: false,
      authorizesRuntime: false
    },
    phase563SecurityRlsInputSanitizationBoundaryReference: {
      phase: "5.63",
      sourceFixture:
        "tests/fixtures/host-policy/phase5-63/security-rls-input-sanitization-contract-boundary-map.json",
      securityRlsInputSanitizationBoundaryReferenced: true,
      implementsSecurityRuntime: false,
      authorizesRuntime: false
    },
    phase564RateLimitingAbuseControlBoundaryReference: {
      phase: "5.64",
      sourceFixture:
        "tests/fixtures/host-policy/phase5-64/rate-limiting-abuse-control-contract-boundary-map.json",
      rateLimitingAbuseControlBoundaryReferenced: true,
      implementsAbuseRuntime: false,
      authorizesRuntime: false
    },
    phase565ErrorTrackingLoggingAuditIntegrityBoundaryReference: {
      phase: "5.65",
      sourceFixture:
        "tests/fixtures/host-policy/phase5-65/error-tracking-logging-audit-integrity-contract-boundary-map.json",
      errorTrackingLoggingAuditIntegrityBoundaryReferenced: true,
      implementsObservabilityRuntime: false,
      authorizesRuntime: false
    },
    availabilityRecoveryBoundaryMetadataOnly: true,
    noLiveAvailabilityRecoveryPerformed: true,
    explicitBlockedAuthorizationFlags:
      availabilityRecoveryBoundaryMapAuthorizationFlags(),
    unsafeAvailabilityRecoveryRuntimeFlags:
      availabilityRecoveryBoundaryMapFalseRuntimeFields(),
    nonAuthorizingProof: true,
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

function availabilityRecoveryBoundaryMapEntries() {
  return availabilityRecoveryBoundaryMapDefinitions().map(
    availabilityRecoveryBoundaryMapEntry
  );
}

function availabilityRecoveryBoundaryMapSummary(entries) {
  const countByFamily = Object.fromEntries(
    AVAILABILITY_RECOVERY_BOUNDARY_FAMILIES.map((family) => [
      family,
      entries.filter((entry) => entry.boundaryFamily === family).length
    ])
  );
  const countByRelatedSystem = Object.fromEntries(
    AVAILABILITY_RECOVERY_RELATED_SYSTEMS.map((system) => [
      system,
      entries.filter((entry) => entry.relatedSystem === system).length
    ])
  );

  return {
    availabilityRecoveryContractBoundaryMapKind:
      AVAILABILITY_RECOVERY_CONTRACT_BOUNDARY_MAP_KIND,
    boundaryEntryCount: entries.length,
    boundaryIds: entries.map((entry) => entry.boundaryId),
    boundaryFamilies: [...AVAILABILITY_RECOVERY_BOUNDARY_FAMILIES],
    relatedSystems: [...AVAILABILITY_RECOVERY_RELATED_SYSTEMS],
    currentStatusValues: [...AVAILABILITY_RECOVERY_STATUSES],
    countByFamily,
    countByRelatedSystem,
    phase548AvailabilityRecoveryCoverageItemRepresented: true,
    phase559FabricAwareApiBackendBoundaryReferenced: true,
    phase560EncodedHandoffConformanceReferenced: true,
    phase561DatabaseStorageContractBoundaryReferenced: true,
    phase562AuthPermissionsContractBoundaryReferenced: true,
    phase563SecurityRlsInputSanitizationBoundaryReferenced: true,
    phase564RateLimitingAbuseControlBoundaryReferenced: true,
    phase565ErrorTrackingLoggingAuditIntegrityBoundaryReferenced: true,
    availabilityRecoveryBoundaryMetadataOnly: true,
    noLiveAvailabilityRecoveryPerformed: true,
    noHealthCheckerRuntimeImplemented: true,
    noMonitorSchedulerImplemented: true,
    noBackupJobImplemented: true,
    noRestoreJobImplemented: true,
    noFailoverRuntimeImplemented: true,
    noRecoveryAutomationImplemented: true,
    noProcessSupervisorImplemented: true,
    noBackendApiServerImplemented: true,
    noStorageWrites: true,
    noConnectorGrants: true,
    contentFabricCanonicalSecureDropOwnerOnly: true,
    allBlockedAuthorizationFlagsFalse: true,
    allUnsafeAvailabilityRecoveryRuntimeFlagsFalse: true,
    allRuntimeEffectsFalse: true,
    allEntriesNonAuthorizing: true
  };
}

function availabilityRecoveryBoundaryMapValidationRules() {
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
    unsafeAvailabilityRecoveryHealthMonitorSchedulerBackupRestoreFailoverProcessSupervisorBackendStorageRuntimeFlagsFailClosed:
      true,
    hiddenHealthCheckRuntimeSemanticsFailClosed: true,
    hiddenMonitorSchedulerSemanticsFailClosed: true,
    hiddenBackupRestoreExecutionSemanticsFailClosed: true,
    hiddenFailoverDegradedModeRuntimeSemanticsFailClosed: true,
    hiddenProcessSupervisionSemanticsFailClosed: true,
    hiddenBackendApiServerSemanticsFailClosed: true,
    hiddenDatabaseStorageCacheWriteSemanticsFailClosed: true,
    hiddenAuthSessionTokenApiKeySemanticsFailClosed: true,
    hiddenConnectorGrantSemanticsFailClosed: true,
    hiddenFabricWebsocketHttpMcpTaskRuntimeSemanticsFailClosed: true,
    hiddenSecureDropImplementationSemanticsFailClosed: true,
    hiddenEncodedHandoffCodecTranslatorStegoCovertChannelTokenizerExploitBypassSemanticsFailClosed:
      true,
    hiddenLoggerAuditTranscriptTelemetryExternalSinkSemanticsFailClosed: true,
    nestedUnsafeFlagsFailClosed: true,
    noncanonicalBoundaryEntriesFailClosed: true,
    validationRunsHealthChecker: false,
    validationRunsMonitor: false,
    validationRunsScheduler: false,
    validationRunsBackupJob: false,
    validationRunsRestoreJob: false,
    validationRunsFailoverRuntime: false,
    validationRunsRecoveryAutomation: false,
    validationRunsProcessSupervisor: false,
    validationRunsBackendApiServer: false,
    validationWritesStorage: false,
    validationGrantsConnectors: false,
    validationRunsRuntime: false
  };
}

function availabilityRecoveryBoundaryMapGaps() {
  return [
    "No health checker, monitor, scheduler, backup job, restore job, failover runtime, degraded-mode runtime behavior, recovery automation, process supervisor, service discovery, or polling loop exists in Ardyn.",
    "Database/storage/cache/RLS, auth/permissions continuity, security fail-closed recovery, rate-limit degraded behavior, and error/log/audit recovery visibility remain metadata-only future contracts.",
    "Fabric coordination, encoded handoff, MCP/tool exposure, connector grants, and Secure Drop recovery metadata remain future boundaries with no runtime transport, task execution, service discovery, or storage sink.",
    "No backend/API/server behavior, storage writes, transcripts, audit records, logs, traces, retention jobs, export paths, packages, filesystem writes, or external integrations are implemented.",
    "Future consumer displays still need Locus/Multiverse-owned availability, degraded, recovery, RTO/RPO, and drill-evidence UI contracts before any interactive surface."
  ];
}

function availabilityRecoveryBoundaryMapState(reviewedAt) {
  const boundaryEntries = availabilityRecoveryBoundaryMapEntries();

  return {
    schema: AVAILABILITY_RECOVERY_CONTRACT_BOUNDARY_MAP_STATE_SCHEMA,
    schemaVersion: AVAILABILITY_RECOVERY_CONTRACT_BOUNDARY_MAP_VERSION,
    stateKind: AVAILABILITY_RECOVERY_CONTRACT_BOUNDARY_MAP_KIND,
    stateMode: "review-only",
    reviewedAt,
    sourcePhaseContext: {
      phase548ProductionReadinessCoverageMatrix:
        "tests/fixtures/host-policy/phase5-48/production-readiness-coverage-matrix.json",
      phase548AvailabilityRecoveryAreaNumber: 13,
      phase548AvailabilityRecoveryStatus: "deferred",
      phase559FabricAwareApiBackendBoundary:
        "tests/fixtures/host-policy/phase5-59/fabric-aware-api-backend-contract-boundary-map.json",
      phase560InterAgentEncodedHandoffConformance:
        "tests/fixtures/host-policy/phase5-60/inter-agent-encoded-handoff-conformance.json",
      phase561DatabaseStorageContractBoundary:
        "tests/fixtures/host-policy/phase5-61/database-storage-contract-boundary-map.json",
      phase562AuthPermissionsContractBoundary:
        "tests/fixtures/host-policy/phase5-62/auth-permissions-contract-boundary-map.json",
      phase563SecurityRlsInputSanitizationContractBoundary:
        "tests/fixtures/host-policy/phase5-63/security-rls-input-sanitization-contract-boundary-map.json",
      phase564RateLimitingAbuseControlContractBoundary:
        "tests/fixtures/host-policy/phase5-64/rate-limiting-abuse-control-contract-boundary-map.json",
      phase565ErrorTrackingLoggingAuditIntegrityContractBoundary:
        "tests/fixtures/host-policy/phase5-65/error-tracking-logging-audit-integrity-contract-boundary-map.json",
      secureDropCanonicalOwner: "content-fabric",
      runtimeStillBlocked: true
    },
    boundaryEntries,
    boundaryMapSummary: availabilityRecoveryBoundaryMapSummary(boundaryEntries),
    invalidBoundaryCasePolicy: availabilityRecoveryBoundaryMapValidationRules(),
    topAvailabilityRecoveryObservabilitySecurityRateLimitingAuthDatabaseFabricApiBackendGaps:
      availabilityRecoveryBoundaryMapGaps(),
    recommendedNextPhase:
      "phase-5.67-review-only-infrastructure-compliance-data-retention-contract-boundary-map",
    availabilityRecoveryContractBoundaryMapOnly: true,
    reviewOnly: true,
    metadataOnly: true,
    authoritative: false,
    nonAuthorizingProof: true,
    reportRunsChecks: false,
    ...availabilityRecoveryBoundaryMapFalseRuntimeFields(),
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

function availabilityRecoveryBoundaryMapResult({
  reviewedAt,
  reviewedAtDefaulted,
  classification,
  accepted,
  availabilityRecoveryContractBoundaryMap
}) {
  return {
    schema: AVAILABILITY_RECOVERY_CONTRACT_BOUNDARY_MAP_SCHEMA,
    schemaVersion: AVAILABILITY_RECOVERY_CONTRACT_BOUNDARY_MAP_VERSION,
    availabilityRecoveryContractBoundaryMapKind:
      AVAILABILITY_RECOVERY_CONTRACT_BOUNDARY_MAP_KIND,
    availabilityRecoveryContractBoundaryMapMode: "review-only",
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    availabilityRecoveryContractBoundaryMapProduced: accepted,
    availabilityRecoveryContractBoundaryMap,
    boundaryMapSummary: accepted
      ? availabilityRecoveryContractBoundaryMap.boundaryMapSummary
      : null,
    boundaryEntries: accepted
      ? availabilityRecoveryContractBoundaryMap.boundaryEntries
      : [],
    invalidBoundaryCasePolicy: accepted
      ? availabilityRecoveryContractBoundaryMap.invalidBoundaryCasePolicy
      : availabilityRecoveryBoundaryMapValidationRules(),
    topAvailabilityRecoveryObservabilitySecurityRateLimitingAuthDatabaseFabricApiBackendGaps:
      accepted
        ? availabilityRecoveryContractBoundaryMap
            .topAvailabilityRecoveryObservabilitySecurityRateLimitingAuthDatabaseFabricApiBackendGaps
        : [],
    recommendedNextPhase: accepted
      ? availabilityRecoveryContractBoundaryMap.recommendedNextPhase
      : null,
    availabilityRecoveryContractBoundaryMapOnly: true,
    reviewOnly: true,
    metadataOnly: true,
    authoritative: false,
    nonAuthorizingProof: true,
    reportRunsChecks: false,
    ...availabilityRecoveryBoundaryMapFalseRuntimeFields(),
    rejectionReasons: accepted
      ? []
      : [
          {
            classification,
            rejected: true,
            runtimeAuthorized: false,
            healthCheckRuntimeAuthorized: false,
            backupRestoreRuntimeAuthorized: false,
            failoverRuntimeAuthorized: false,
            commandExposureAuthorized: false,
            reportRunsChecks: false
          }
        ],
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

export function createAvailabilityRecoveryContractBoundaryMapForReview(
  input = {}
) {
  const inputRecord = availabilityRecoveryBoundaryMapInputRecord(input);
  const reviewedAt = availabilityRecoveryBoundaryMapReviewedAt(inputRecord);
  const reviewedAtDefaulted = isReviewedAtDefaulted(inputRecord);
  const classification =
    availabilityRecoveryBoundaryMapInputClassification(inputRecord);
  const accepted =
    classification ===
    VALID_AVAILABILITY_RECOVERY_CONTRACT_BOUNDARY_MAP_CLASSIFICATION;
  const availabilityRecoveryContractBoundaryMap = accepted
    ? availabilityRecoveryBoundaryMapState(reviewedAt)
    : null;

  return availabilityRecoveryBoundaryMapResult({
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    accepted,
    availabilityRecoveryContractBoundaryMap
  });
}

const INFRASTRUCTURE_COMPLIANCE_DATA_RETENTION_CONTRACT_BOUNDARY_MAP_STATE_SCHEMA =
  "ardyn.phase-5.67.infrastructure-compliance-data-retention-contract-boundary-map-state";
const VALID_INFRASTRUCTURE_COMPLIANCE_DATA_RETENTION_CONTRACT_BOUNDARY_MAP_CLASSIFICATION =
  "valid_infrastructure_compliance_data_retention_contract_boundary_map_runtime_still_blocked";
const MALFORMED_INFRASTRUCTURE_COMPLIANCE_DATA_RETENTION_CONTRACT_BOUNDARY_MAP_CLASSIFICATION =
  "malformed_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected";

const INFRASTRUCTURE_COMPLIANCE_DATA_RETENTION_BOUNDARY_FAMILIES = Object.freeze([
  "infrastructure_management_contract",
  "deployment_governance_contract",
  "environment_boundary_contract",
  "compliance_readiness_contract",
  "pii_boundary_contract",
  "data_retention_contract",
  "data_deletion_contract",
  "data_export_contract",
  "policy_governance_contract",
  "data_processing_inventory_contract",
  "vendor_external_service_boundary",
  "secure_drop_compliance_boundary",
  "fabric_compliance_boundary"
]);
const INFRASTRUCTURE_COMPLIANCE_DATA_RETENTION_RELATED_SYSTEMS = Object.freeze([
  "ardyn",
  "ardyn-subagent",
  "locus",
  "multiverse",
  "content-fabric",
  "repo-family"
]);
const INFRASTRUCTURE_COMPLIANCE_DATA_RETENTION_STATUSES = Object.freeze([
  "metadata_only",
  "blocked",
  "future_contract_required"
]);
const INFRASTRUCTURE_COMPLIANCE_DATA_RETENTION_REQUIRED_FIELDS = Object.freeze([
  "boundaryId",
  "boundaryFamily",
  "relatedSystem",
  "currentStatus",
  "allowedCurrentBehavior",
  "forbiddenCurrentBehavior",
  "requiredFutureContractBeforeImplementation",
  "requiredFutureAuthorizationPhaseBeforeRuntime",
  "infrastructureOwnershipExpectation",
  "environmentSeparationExpectation",
  "piiDataClassificationExpectation",
  "retentionDeletionExportExpectation",
  "compliancePostureNotes",
  "vendorExternalServiceExpectation",
  "policyGovernanceExpectation",
  "locusRoleDescription",
  "multiverseRoleDescription",
  "fabricRoleDescription",
  "secureDropRoleDescription",
  "explicitBlockedAuthorizationFlags",
  "unsafeInfrastructureComplianceDataRetentionRuntimeFlags",
  "nonAuthorizingProof"
]);
const INFRASTRUCTURE_COMPLIANCE_DATA_RETENTION_ALLOWED_TOP_LEVEL_FIELDS =
  Object.freeze(["reviewedAt", "boundaryEntries"]);
const INFRASTRUCTURE_COMPLIANCE_DATA_RETENTION_UNSAFE_FIELDS = Object.freeze([
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
  "reportRunsChecks",
  "blockedCliBypassEnabled"
]);
const INFRASTRUCTURE_COMPLIANCE_DATA_RETENTION_AUTHORIZATION_FIELDS =
  Object.freeze([
    "runtimeAuthorized",
    "runtimeAuthorizationGranted",
    "infrastructureAutomationAuthorizationGranted",
    "deploymentAutomationAuthorizationGranted",
    "cloudProvisioningAuthorizationGranted",
    "complianceEnforcementAuthorizationGranted",
    "piiProcessingAuthorizationGranted",
    "retentionJobAuthorizationGranted",
    "deletionJobAuthorizationGranted",
    "exportJobAuthorizationGranted",
    "policyEngineAuthorizationGranted",
    "vendorIntegrationAuthorizationGranted",
    "externalServiceAuthorizationGranted",
    "secretsAccessAuthorizationGranted",
    "backendApiServerAuthorizationGranted",
    "databaseStorageAuthorizationGranted",
    "connectorGrantAuthorizationGranted",
    "fabricRuntimeAuthorizationGranted",
    "websocketHttpRuntimeAuthorizationGranted",
    "mcpToolExposureAuthorizationGranted",
    "taskExecutionAuthorizationGranted",
    "secureDropAuthorizationGranted",
    "encodedHandoffRuntimeAuthorizationGranted",
    "loggerAuditRuntimeAuthorizationGranted",
    "healthBackupRestoreFailoverRuntimeAuthorizationGranted",
    "commandExposureAuthorizationGranted",
    "approvalDecisionProduced",
    "approvalGrantProduced",
    "authorizesRuntime"
  ]);
const INFRASTRUCTURE_COMPLIANCE_DATA_RETENTION_COMMAND_FIELDS = Object.freeze([
  "commandExposureEnabled",
  "commandRuntimeControlEnabled",
  "commandsExposed",
  "exposesCommands",
  "runtimeCommandEnabled",
  "cliCommandExposed"
]);
const INFRASTRUCTURE_COMPLIANCE_DATA_RETENTION_BLOCKED_CLI_BYPASS_FIELDS =
  Object.freeze([
    "blockedCliBypassEnabled",
    "dryRunBypassesBlock",
    "serveRuntimeBypassEnabled",
    "bypassBlockedCommandBehavior",
    "blockedCommandOverride"
  ]);
const INFRASTRUCTURE_COMPLIANCE_DATA_RETENTION_HIDDEN_FIELD_GROUPS =
  Object.freeze([
    {
      classification:
        "hidden_infrastructure_automation_semantics_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected",
      fields: [
        "terraformPlan",
        "pulumiStack",
        "cloudFormationTemplate",
        "infrastructureRunner",
        "provisioningScript",
        "environmentManager",
        "deploymentTarget"
      ]
    },
    {
      classification:
        "hidden_deployment_cloud_provisioning_semantics_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected",
      fields: [
        "deployCommand",
        "deploymentPipeline",
        "cloudProvider",
        "cloudAccountId",
        "regionFailoverPolicy",
        "containerRegistry",
        "serviceAccount",
        "releaseController"
      ]
    },
    {
      classification:
        "hidden_compliance_certification_enforcement_semantics_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected",
      fields: [
        "certificationStatus",
        "gdprCompliant",
        "ccpaCompliant",
        "soc2Certified",
        "complianceEnforcer",
        "controlRuntime",
        "evidenceCollector",
        "policyEngineRuntime"
      ]
    },
    {
      classification:
        "hidden_pii_collection_processing_semantics_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected",
      fields: [
        "piiCollector",
        "piiProcessor",
        "userEmail",
        "operatorIdentityToken",
        "subjectIdentifier",
        "consentRecord",
        "personalDataStore",
        "dataSubjectRuntime"
      ]
    },
    {
      classification:
        "hidden_retention_deletion_export_execution_semantics_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected",
      fields: [
        "retentionScheduler",
        "retentionJob",
        "deletionJob",
        "erasureRunner",
        "exportJob",
        "exportPath",
        "dataPackageWriter",
        "purgeCommand"
      ]
    },
    {
      classification:
        "hidden_vendor_external_service_integration_semantics_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected",
      fields: [
        "vendorClient",
        "externalServiceClient",
        "webhookUrl",
        "saasEndpoint",
        "connectorGrant",
        "connectorCredential",
        "connectorAccessToken",
        "externalLookup"
      ]
    },
    {
      classification:
        "hidden_secret_env_vault_access_semantics_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected",
      fields: [
        "secretName",
        "secretValue",
        "envVar",
        "vaultPath",
        "vaultToken",
        "keyringPath",
        "apiKey",
        "apiKeySecret"
      ]
    },
    {
      classification:
        "hidden_backend_api_server_semantics_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected",
      fields: [
        "backendApiMiddleware",
        "apiRequestHandler",
        "httpServer",
        "serverMiddleware",
        "httpEndpoint",
        "runtimeEndpoint"
      ]
    },
    {
      classification:
        "hidden_database_storage_cache_write_semantics_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected",
      fields: [
        "databaseUrl",
        "databaseDsn",
        "dbConnectionString",
        "storageAdapter",
        "cacheEngine",
        "writeQueue",
        "persistenceLayer",
        "filesystemWrite"
      ]
    },
    {
      classification:
        "hidden_auth_session_token_api_key_semantics_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected",
      fields: [
        "loginUrl",
        "sessionCookie",
        "sessionStore",
        "sessionToken",
        "tokenIssuer",
        "accessToken",
        "refreshToken",
        "idToken",
        "bearerToken"
      ]
    },
    {
      classification:
        "hidden_connector_grant_semantics_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected",
      fields: [
        "connectorGrant",
        "connectorCredential",
        "connectorAccessToken",
        "connectorIngestionGrant",
        "connectorComplianceGrant",
        "vendorGrant"
      ]
    },
    {
      classification:
        "hidden_fabric_websocket_http_mcp_task_runtime_semantics_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected",
      fields: [
        "fabricBusTopic",
        "fabricBrokerUrl",
        "websocketUrl",
        "mcpToolName",
        "mcpServerUrl",
        "taskExecutor",
        "taskRunner",
        "adapterRuntime"
      ]
    },
    {
      classification:
        "hidden_secure_drop_implementation_semantics_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected",
      fields: [
        "secureDropPayloadPath",
        "secureDropKeyring",
        "secureDropCryptoImplemented",
        "secureDropTransportImplemented",
        "secureDropStegoImplemented",
        "secureDropSendReceiveImplemented",
        "secureDropInboxPollingEnabled",
        "secureDropFileSelection",
        "st3ggPayload"
      ]
    },
    {
      classification:
        "hidden_encoded_handoff_codec_translator_stego_covert_channel_tokenizer_exploit_bypass_semantics_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected",
      fields: [
        "codecImplemented",
        "translatorRuntimeImplemented",
        "encoderImplemented",
        "decoderImplemented",
        "conlangGenerator",
        "semanticStegoCandidate",
        "steganographyCandidate",
        "tokenExploitationCandidate",
        "covertChannel",
        "guardrailBypass",
        "hiddenPayload"
      ]
    },
    {
      classification:
        "hidden_logger_audit_transcript_telemetry_external_sink_semantics_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected",
      fields: [
        "loggerRuntime",
        "logWriter",
        "auditWriter",
        "auditLogWriter",
        "transcriptWriter",
        "telemetryClient",
        "externalSink",
        "alertingClient",
        "logDrain"
      ]
    },
    {
      classification:
        "hidden_health_backup_restore_failover_scheduler_process_supervisor_semantics_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected",
      fields: [
        "healthChecker",
        "monitoringClient",
        "scheduler",
        "cronSchedule",
        "backupJob",
        "restoreJob",
        "failoverRuntime",
        "processSupervisor",
        "recoveryAutomation"
      ]
    }
  ]);

function infrastructureComplianceDataRetentionBoundaryMapInputRecord(input) {
  return isPlainObjectRecord(input) ? input : null;
}

function infrastructureComplianceDataRetentionBoundaryMapReviewedAt(inputRecord) {
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

function infrastructureComplianceDataRetentionBoundaryMapContainsTrue(value) {
  if (value === true) {
    return true;
  }

  if (Array.isArray(value)) {
    return value.some(infrastructureComplianceDataRetentionBoundaryMapContainsTrue);
  }

  if (isPlainObjectRecord(value)) {
    return Object.values(value).some(
      infrastructureComplianceDataRetentionBoundaryMapContainsTrue
    );
  }

  return false;
}

function infrastructureComplianceDataRetentionBoundaryMapHasTrueFieldDeep(
  value,
  fields
) {
  if (Array.isArray(value)) {
    return value.some((item) =>
      infrastructureComplianceDataRetentionBoundaryMapHasTrueFieldDeep(
        item,
        fields
      )
    );
  }

  if (!isPlainObjectRecord(value)) {
    return false;
  }

  for (const [key, nested] of Object.entries(value)) {
    if (fields.includes(key) && nested === true) {
      return true;
    }

    if (
      infrastructureComplianceDataRetentionBoundaryMapHasTrueFieldDeep(
        nested,
        fields
      )
    ) {
      return true;
    }
  }

  return false;
}

function infrastructureComplianceDataRetentionBoundaryMapHasPresentFieldDeep(
  value,
  fields
) {
  if (Array.isArray(value)) {
    return value.some((item) =>
      infrastructureComplianceDataRetentionBoundaryMapHasPresentFieldDeep(
        item,
        fields
      )
    );
  }

  if (!isPlainObjectRecord(value)) {
    return false;
  }

  for (const [key, nested] of Object.entries(value)) {
    if (
      key === "explicitBlockedAuthorizationFlags" ||
      key === "unsafeInfrastructureComplianceDataRetentionRuntimeFlags"
    ) {
      continue;
    }

    if (fields.includes(key)) {
      return true;
    }

    if (
      infrastructureComplianceDataRetentionBoundaryMapHasPresentFieldDeep(
        nested,
        fields
      )
    ) {
      return true;
    }
  }

  return false;
}

function infrastructureComplianceDataRetentionBoundaryMapEntriesInput(
  inputRecord
) {
  return Array.isArray(inputRecord?.boundaryEntries)
    ? inputRecord.boundaryEntries
    : null;
}

function infrastructureComplianceDataRetentionBoundaryMapMalformed(inputRecord) {
  return (
    inputRecord === null ||
    (Object.prototype.hasOwnProperty.call(inputRecord, "reviewedAt") &&
      !isUtcIsoTimestampWithMilliseconds(inputRecord.reviewedAt)) ||
    (Object.prototype.hasOwnProperty.call(inputRecord, "boundaryEntries") &&
      !Array.isArray(inputRecord.boundaryEntries))
  );
}

function infrastructureComplianceDataRetentionBoundaryMapEntryIssue(
  entries,
  predicate
) {
  return entries !== null && entries.some((entry) => predicate(entry));
}

function infrastructureComplianceDataRetentionBoundaryMapMissingRequired(entry) {
  return (
    !isPlainObjectRecord(entry) ||
    INFRASTRUCTURE_COMPLIANCE_DATA_RETENTION_REQUIRED_FIELDS.some(
      (field) => !Object.prototype.hasOwnProperty.call(entry, field)
    )
  );
}

function infrastructureComplianceDataRetentionBoundaryMapEntryMalformed(entry) {
  if (!isPlainObjectRecord(entry)) {
    return true;
  }

  return (
    typeof entry.boundaryId !== "string" ||
    !Array.isArray(entry.allowedCurrentBehavior) ||
    !Array.isArray(entry.forbiddenCurrentBehavior) ||
    typeof entry.requiredFutureContractBeforeImplementation !== "string" ||
    typeof entry.requiredFutureAuthorizationPhaseBeforeRuntime !== "string" ||
    typeof entry.infrastructureOwnershipExpectation !== "string" ||
    typeof entry.environmentSeparationExpectation !== "string" ||
    typeof entry.piiDataClassificationExpectation !== "string" ||
    typeof entry.retentionDeletionExportExpectation !== "string" ||
    typeof entry.compliancePostureNotes !== "string" ||
    typeof entry.vendorExternalServiceExpectation !== "string" ||
    typeof entry.policyGovernanceExpectation !== "string" ||
    typeof entry.locusRoleDescription !== "string" ||
    typeof entry.multiverseRoleDescription !== "string" ||
    typeof entry.fabricRoleDescription !== "string" ||
    typeof entry.secureDropRoleDescription !== "string" ||
    !isPlainObjectRecord(entry.explicitBlockedAuthorizationFlags) ||
    !isPlainObjectRecord(
      entry.unsafeInfrastructureComplianceDataRetentionRuntimeFlags
    ) ||
    entry.nonAuthorizingProof !== true
  );
}

function infrastructureComplianceDataRetentionBoundaryMapAuthorizationFlagEnabled(
  value
) {
  if (!isPlainObjectRecord(value)) {
    return false;
  }

  return (
    (isPlainObjectRecord(value.explicitBlockedAuthorizationFlags) &&
      Object.values(value.explicitBlockedAuthorizationFlags).some(
        (flag) => flag !== false
      )) ||
    INFRASTRUCTURE_COMPLIANCE_DATA_RETENTION_AUTHORIZATION_FIELDS.some(
      (field) => value[field] === true
    )
  );
}

function infrastructureComplianceDataRetentionBoundaryMapUnsafeFlagEnabled(
  value
) {
  if (!isPlainObjectRecord(value)) {
    return false;
  }

  return (
    (isPlainObjectRecord(
      value.unsafeInfrastructureComplianceDataRetentionRuntimeFlags
    ) &&
      Object.values(
        value.unsafeInfrastructureComplianceDataRetentionRuntimeFlags
      ).some((flag) => flag !== false)) ||
    infrastructureComplianceDataRetentionBoundaryMapHasTrueFieldDeep(
      value,
      INFRASTRUCTURE_COMPLIANCE_DATA_RETENTION_UNSAFE_FIELDS
    )
  );
}

function infrastructureComplianceDataRetentionBoundaryMapCanonical(entries) {
  if (entries === null) {
    return true;
  }

  return (
    JSON.stringify(entries) ===
    JSON.stringify(infrastructureComplianceDataRetentionBoundaryMapEntries())
  );
}

function infrastructureComplianceDataRetentionBoundaryMapInputClassification(
  inputRecord
) {
  if (infrastructureComplianceDataRetentionBoundaryMapMalformed(inputRecord)) {
    return MALFORMED_INFRASTRUCTURE_COMPLIANCE_DATA_RETENTION_CONTRACT_BOUNDARY_MAP_CLASSIFICATION;
  }

  const entries =
    infrastructureComplianceDataRetentionBoundaryMapEntriesInput(inputRecord);

  if (
    infrastructureComplianceDataRetentionBoundaryMapEntryIssue(
      entries,
      infrastructureComplianceDataRetentionBoundaryMapMissingRequired
    )
  ) {
    return "missing_required_infrastructure_compliance_data_retention_contract_boundary_entry_rejected";
  }

  if (
    infrastructureComplianceDataRetentionBoundaryMapEntryIssue(
      entries,
      (entry) =>
        !INFRASTRUCTURE_COMPLIANCE_DATA_RETENTION_BOUNDARY_FAMILIES.includes(
          entry.boundaryFamily
        )
    )
  ) {
    return "unknown_boundary_family_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected";
  }

  if (
    infrastructureComplianceDataRetentionBoundaryMapEntryIssue(
      entries,
      (entry) =>
        !INFRASTRUCTURE_COMPLIANCE_DATA_RETENTION_RELATED_SYSTEMS.includes(
          entry.relatedSystem
        )
    )
  ) {
    return "unknown_related_system_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected";
  }

  if (
    infrastructureComplianceDataRetentionBoundaryMapEntryIssue(
      entries,
      (entry) =>
        !INFRASTRUCTURE_COMPLIANCE_DATA_RETENTION_STATUSES.includes(
          entry.currentStatus
        )
    )
  ) {
    return "unknown_current_status_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected";
  }

  if (
    infrastructureComplianceDataRetentionBoundaryMapEntryIssue(
      entries,
      infrastructureComplianceDataRetentionBoundaryMapEntryMalformed
    )
  ) {
    return MALFORMED_INFRASTRUCTURE_COMPLIANCE_DATA_RETENTION_CONTRACT_BOUNDARY_MAP_CLASSIFICATION;
  }

  if (
    INFRASTRUCTURE_COMPLIANCE_DATA_RETENTION_AUTHORIZATION_FIELDS.some(
      (field) => inputRecord[field] === true
    )
  ) {
    return "runtime_authorization_attempt_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected";
  }

  if (
    infrastructureComplianceDataRetentionBoundaryMapEntryIssue(
      entries,
      infrastructureComplianceDataRetentionBoundaryMapAuthorizationFlagEnabled
    ) ||
    infrastructureComplianceDataRetentionBoundaryMapAuthorizationFlagEnabled(
      inputRecord
    )
  ) {
    return "authorization_flags_enabled_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected";
  }

  if (
    infrastructureComplianceDataRetentionBoundaryMapHasTrueFieldDeep(inputRecord, [
      "reportRunsChecks"
    ])
  ) {
    return "report_runs_checks_true_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected";
  }

  if (
    infrastructureComplianceDataRetentionBoundaryMapHasTrueFieldDeep(
      inputRecord,
      INFRASTRUCTURE_COMPLIANCE_DATA_RETENTION_AUTHORIZATION_FIELDS
    )
  ) {
    return "runtime_authorization_attempt_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected";
  }

  if (
    infrastructureComplianceDataRetentionBoundaryMapHasTrueFieldDeep(
      inputRecord,
      INFRASTRUCTURE_COMPLIANCE_DATA_RETENTION_COMMAND_FIELDS
    )
  ) {
    return "command_exposure_attempt_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected";
  }

  if (
    infrastructureComplianceDataRetentionBoundaryMapHasTrueFieldDeep(
      inputRecord,
      INFRASTRUCTURE_COMPLIANCE_DATA_RETENTION_BLOCKED_CLI_BYPASS_FIELDS
    )
  ) {
    return "blocked_cli_bypass_attempt_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected";
  }

  for (const { classification, fields } of INFRASTRUCTURE_COMPLIANCE_DATA_RETENTION_HIDDEN_FIELD_GROUPS) {
    if (
      infrastructureComplianceDataRetentionBoundaryMapHasPresentFieldDeep(
        inputRecord,
        fields
      )
    ) {
      return classification;
    }
  }

  if (
    infrastructureComplianceDataRetentionBoundaryMapUnsafeFlagEnabled(
      inputRecord
    ) ||
    infrastructureComplianceDataRetentionBoundaryMapEntryIssue(
      entries,
      infrastructureComplianceDataRetentionBoundaryMapUnsafeFlagEnabled
    )
  ) {
    return "unsafe_infrastructure_compliance_data_retention_runtime_flags_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected";
  }

  if (
    infrastructureComplianceDataRetentionBoundaryMapEntryIssue(entries, (entry) =>
      infrastructureComplianceDataRetentionBoundaryMapContainsTrue(
        entry?.runtimeEffect
      )
    ) ||
    infrastructureComplianceDataRetentionBoundaryMapContainsTrue(
      inputRecord?.runtimeEffect
    )
  ) {
    return "nested_unsafe_flags_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected";
  }

  if (
    Object.keys(inputRecord).some(
      (field) =>
        !INFRASTRUCTURE_COMPLIANCE_DATA_RETENTION_ALLOWED_TOP_LEVEL_FIELDS.includes(
          field
        )
    )
  ) {
    return "unknown_top_level_field_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected";
  }

  if (!infrastructureComplianceDataRetentionBoundaryMapCanonical(entries)) {
    return "noncanonical_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected";
  }

  return VALID_INFRASTRUCTURE_COMPLIANCE_DATA_RETENTION_CONTRACT_BOUNDARY_MAP_CLASSIFICATION;
}

function infrastructureComplianceDataRetentionBoundaryMapAuthorizationFlags() {
  return {
    infrastructureAutomationAuthorizationGranted: false,
    deploymentAutomationAuthorizationGranted: false,
    cloudProvisioningAuthorizationGranted: false,
    complianceEnforcementAuthorizationGranted: false,
    piiProcessingAuthorizationGranted: false,
    retentionJobAuthorizationGranted: false,
    deletionJobAuthorizationGranted: false,
    exportJobAuthorizationGranted: false,
    policyEngineAuthorizationGranted: false,
    vendorIntegrationAuthorizationGranted: false,
    externalServiceAuthorizationGranted: false,
    secretsAccessAuthorizationGranted: false,
    backendApiServerAuthorizationGranted: false,
    databaseStorageAuthorizationGranted: false,
    connectorGrantAuthorizationGranted: false,
    fabricRuntimeAuthorizationGranted: false,
    websocketHttpRuntimeAuthorizationGranted: false,
    mcpToolExposureAuthorizationGranted: false,
    taskExecutionAuthorizationGranted: false,
    secureDropAuthorizationGranted: false,
    encodedHandoffRuntimeAuthorizationGranted: false,
    loggerAuditRuntimeAuthorizationGranted: false,
    healthBackupRestoreFailoverRuntimeAuthorizationGranted: false,
    commandExposureAuthorizationGranted: false,
    approvalDecisionProduced: false,
    approvalGrantProduced: false,
    connectorGrantProduced: false,
    authorizesRuntime: false
  };
}

function infrastructureComplianceDataRetentionBoundaryMapFalseRuntimeFields() {
  return Object.fromEntries(
    INFRASTRUCTURE_COMPLIANCE_DATA_RETENTION_UNSAFE_FIELDS.map((field) => [
      field,
      false
    ])
  );
}

function infrastructureComplianceDataRetentionBoundaryMapNotes() {
  return {
    noConsumerRole:
      "No current runtime role; future consumers may inspect metadata only.",
    currentAuthorization:
      "Requires a future infrastructure, deployment, environment, compliance, PII, data-retention, deletion/export, policy-governance, vendor, secrets, backend, storage, auth, security, rate-limiting, observability, availability/recovery, runtime, command exposure, connector, Fabric, Secure Drop, MCP/task, filesystem/process-control, and approval authorization phase before any executable behavior.",
    complianceEvidenceOnly:
      "Compliance posture remains future evidence planning only; Ardyn claims no GDPR, CCPA, SOC2, or similar compliance or certification and runs no compliance enforcement.",
    fabricMetadataOnly:
      "Fabric remains a future coordination envelope metadata layer, not a bus, broker, transport, adapter, connector, registry, scheduler, monitor, compliance enforcer, importer, exporter, package distributor, recovery channel, or task executor.",
    secureDropContentFabric:
      "Secure Drop compliance metadata remains a future content-fabric contract; Ardyn records references only and implements no Secure Drop crypto, transport, stego, send/receive, inbox polling, file selection, connector ingestion, secret/vault/env access, ST3GG wrapping, retention/deletion/export job, or compliance runtime."
  };
}

function infrastructureComplianceDataRetentionBoundaryMapDefinition(definition) {
  const notes = infrastructureComplianceDataRetentionBoundaryMapNotes();

  return {
    ...definition,
    allowedCurrentBehavior: [
      `Describe future ${definition.subject} infrastructure, compliance, and data-retention boundary metadata.`,
      "Keep current behavior review-only, metadata-only, non-authorizing, and runtime-blocked."
    ],
    requiredFutureContractBeforeImplementation:
      `A future ${definition.subject} contract must define ownership, environment separation, data classification, retention/deletion/export policy, compliance evidence boundaries, vendor/service ownership, policy governance, consumer visibility, and explicit no-runtime defaults before implementation.`,
    requiredFutureAuthorizationPhaseBeforeRuntime: notes.currentAuthorization,
    locusRoleDescription: definition.locusRole ?? notes.noConsumerRole,
    multiverseRoleDescription:
      definition.multiverseRole ?? notes.noConsumerRole,
    fabricRoleDescription: definition.fabricRole ?? notes.fabricMetadataOnly,
    secureDropRoleDescription: definition.secureDropRole ?? "Not applicable."
  };
}

function infrastructureComplianceDataRetentionBoundaryMapDefinitions() {
  const notes = infrastructureComplianceDataRetentionBoundaryMapNotes();
  const infrastructure =
    "Infrastructure ownership remains future contract metadata only; Ardyn provisions no cloud, account, container, environment, service, network, secret, database, storage, cache, or process resource.";
  const environment =
    "Environment separation remains future contract metadata only; Ardyn creates no local/dev/staging/production manager, deployment target, secret resolver, or runtime switch.";
  const pii =
    "PII and data classification remains future contract metadata only; Ardyn collects, stores, processes, exports, deletes, or classifies no live personal data.";
  const retention =
    "Retention, deletion, and export remain future policy metadata only; Ardyn runs no retention job, erasure job, export job, package writer, storage writer, or filesystem scan.";
  const vendor =
    "Vendor and external-service posture remains future contract metadata only; Ardyn creates no connector grant, external client, webhook, lookup, integration, or data-processing agreement runtime.";
  const policy =
    "Policy governance remains future contract metadata only; Ardyn creates no policy engine, enforcement hook, compliance automation, reviewer routing, approval grant, or runtime governance.";

  return [
    infrastructureComplianceDataRetentionBoundaryMapDefinition({
      boundaryId:
        "phase5-67.repo_family.infrastructure_ownership.infrastructure_management_boundary",
      boundaryFamily: "infrastructure_management_contract",
      relatedSystem: "repo-family",
      currentStatus: "future_contract_required",
      subject: "repo-family infrastructure ownership",
      infrastructureOwnershipExpectation:
        "Future repo-family infrastructure ownership must name resource owners, deployment owners, account boundaries, environment owners, data owners, and support escalation paths before any provisioning.",
      environmentSeparationExpectation: environment,
      piiDataClassificationExpectation: pii,
      retentionDeletionExportExpectation: retention,
      compliancePostureNotes: notes.complianceEvidenceOnly,
      vendorExternalServiceExpectation: vendor,
      policyGovernanceExpectation: policy
    }),
    infrastructureComplianceDataRetentionBoundaryMapDefinition({
      boundaryId:
        "phase5-67.repo_family.deployment_environment_separation.deployment_governance_boundary",
      boundaryFamily: "deployment_governance_contract",
      relatedSystem: "repo-family",
      currentStatus: "future_contract_required",
      subject: "deployment and environment separation",
      infrastructureOwnershipExpectation: infrastructure,
      environmentSeparationExpectation:
        "Future deployment governance must separate local, dev, staging, production, credentials, service accounts, audit evidence, rollback ownership, and approvals before deployment automation.",
      piiDataClassificationExpectation: pii,
      retentionDeletionExportExpectation: retention,
      compliancePostureNotes: notes.complianceEvidenceOnly,
      vendorExternalServiceExpectation: vendor,
      policyGovernanceExpectation: policy
    }),
    infrastructureComplianceDataRetentionBoundaryMapDefinition({
      boundaryId:
        "phase5-67.ardyn.local_dev_staging_production_environment.environment_boundary",
      boundaryFamily: "environment_boundary_contract",
      relatedSystem: "ardyn",
      currentStatus: "future_contract_required",
      subject: "local/dev/staging/production environment boundary",
      infrastructureOwnershipExpectation: infrastructure,
      environmentSeparationExpectation:
        "Future Ardyn environments must define local-only review behavior, dev/staging/production ownership, credential isolation, fixture provenance, and blocked runtime defaults before any environment manager.",
      piiDataClassificationExpectation: pii,
      retentionDeletionExportExpectation: retention,
      compliancePostureNotes: notes.complianceEvidenceOnly,
      vendorExternalServiceExpectation: vendor,
      policyGovernanceExpectation: policy
    }),
    infrastructureComplianceDataRetentionBoundaryMapDefinition({
      boundaryId:
        "phase5-67.repo_family.compliance_readiness_posture.compliance_readiness_boundary",
      boundaryFamily: "compliance_readiness_contract",
      relatedSystem: "repo-family",
      currentStatus: "metadata_only",
      subject: "compliance-readiness posture",
      infrastructureOwnershipExpectation: infrastructure,
      environmentSeparationExpectation: environment,
      piiDataClassificationExpectation: pii,
      retentionDeletionExportExpectation: retention,
      compliancePostureNotes:
        "Future compliance readiness may define evidence needs for GDPR, CCPA, SOC2, and similar regimes, but this metadata claims no certification, control operation, or enforcement.",
      vendorExternalServiceExpectation: vendor,
      policyGovernanceExpectation: policy
    }),
    infrastructureComplianceDataRetentionBoundaryMapDefinition({
      boundaryId:
        "phase5-67.repo_family.gdpr_ccpa_soc2_evidence_planning.compliance_readiness_boundary",
      boundaryFamily: "compliance_readiness_contract",
      relatedSystem: "repo-family",
      currentStatus: "future_contract_required",
      subject: "GDPR/CCPA/SOC2 evidence planning",
      infrastructureOwnershipExpectation: infrastructure,
      environmentSeparationExpectation: environment,
      piiDataClassificationExpectation:
        "Future GDPR, CCPA, SOC2, and similar evidence planning must identify personal data categories, data subjects, processors, sub-processors, consent, access, erasure, portability, and audit evidence before processing.",
      retentionDeletionExportExpectation: retention,
      compliancePostureNotes:
        "This boundary is evidence planning only and explicitly does not assert GDPR, CCPA, SOC2, or similar certification or compliance.",
      vendorExternalServiceExpectation: vendor,
      policyGovernanceExpectation: policy
    }),
    infrastructureComplianceDataRetentionBoundaryMapDefinition({
      boundaryId:
        "phase5-67.ardyn.pii_classification_transcripts_audit_identity_secure_drop_user_content.pii_boundary",
      boundaryFamily: "pii_boundary_contract",
      relatedSystem: "ardyn",
      currentStatus: "future_contract_required",
      subject:
        "PII classification for transcripts, audit logs, operator identity, Secure Drop metadata, and user content",
      infrastructureOwnershipExpectation: infrastructure,
      environmentSeparationExpectation: environment,
      piiDataClassificationExpectation:
        "Future PII classification must cover transcripts, audit logs, operator identity, Secure Drop metadata, user content, consent, retention class, minimization, redaction, and access boundaries before any processing.",
      retentionDeletionExportExpectation: retention,
      compliancePostureNotes: notes.complianceEvidenceOnly,
      vendorExternalServiceExpectation: vendor,
      policyGovernanceExpectation: policy,
      secureDropRole: notes.secureDropContentFabric
    }),
    infrastructureComplianceDataRetentionBoundaryMapDefinition({
      boundaryId:
        "phase5-67.ardyn.data_processing_inventory.data_processing_inventory_boundary",
      boundaryFamily: "data_processing_inventory_contract",
      relatedSystem: "ardyn",
      currentStatus: "future_contract_required",
      subject: "data processing inventory",
      infrastructureOwnershipExpectation: infrastructure,
      environmentSeparationExpectation: environment,
      piiDataClassificationExpectation:
        "Future data processing inventory must list data categories, sources, sinks, processors, owners, legal basis, retention class, deletion/export obligations, and external-service boundaries before runtime.",
      retentionDeletionExportExpectation: retention,
      compliancePostureNotes: notes.complianceEvidenceOnly,
      vendorExternalServiceExpectation: vendor,
      policyGovernanceExpectation: policy
    }),
    infrastructureComplianceDataRetentionBoundaryMapDefinition({
      boundaryId:
        "phase5-67.ardyn.retention_policy.phase561_phase565.data_retention_boundary",
      boundaryFamily: "data_retention_contract",
      relatedSystem: "ardyn",
      currentStatus: "future_contract_required",
      subject: "retention policy from Phases 5.61 and 5.65",
      infrastructureOwnershipExpectation: infrastructure,
      environmentSeparationExpectation: environment,
      piiDataClassificationExpectation: pii,
      retentionDeletionExportExpectation:
        "Future retention policy must bind database/storage ownership from Phase 5.61 and log/audit/transcript integrity from Phase 5.65 before any retention job or storage write.",
      compliancePostureNotes: notes.complianceEvidenceOnly,
      vendorExternalServiceExpectation: vendor,
      policyGovernanceExpectation: policy
    }),
    infrastructureComplianceDataRetentionBoundaryMapDefinition({
      boundaryId:
        "phase5-67.ardyn.deletion_policy.phase561_phase565.data_deletion_boundary",
      boundaryFamily: "data_deletion_contract",
      relatedSystem: "ardyn",
      currentStatus: "future_contract_required",
      subject: "deletion policy from Phases 5.61 and 5.65",
      infrastructureOwnershipExpectation: infrastructure,
      environmentSeparationExpectation: environment,
      piiDataClassificationExpectation: pii,
      retentionDeletionExportExpectation:
        "Future deletion policy must define subject scope, authorization, storage ownership, audit preservation, fail-closed semantics, and proof boundaries before any deletion or erasure job.",
      compliancePostureNotes: notes.complianceEvidenceOnly,
      vendorExternalServiceExpectation: vendor,
      policyGovernanceExpectation: policy
    }),
    infrastructureComplianceDataRetentionBoundaryMapDefinition({
      boundaryId:
        "phase5-67.ardyn.export_policy.phase561_phase565.data_export_boundary",
      boundaryFamily: "data_export_contract",
      relatedSystem: "ardyn",
      currentStatus: "future_contract_required",
      subject: "export policy from Phases 5.61 and 5.65",
      infrastructureOwnershipExpectation: infrastructure,
      environmentSeparationExpectation: environment,
      piiDataClassificationExpectation: pii,
      retentionDeletionExportExpectation:
        "Future export policy must define portability scope, packaging format, approval, audit proof, storage ownership, and redaction before any export job, import/export path, or package writer.",
      compliancePostureNotes: notes.complianceEvidenceOnly,
      vendorExternalServiceExpectation: vendor,
      policyGovernanceExpectation: policy
    }),
    infrastructureComplianceDataRetentionBoundaryMapDefinition({
      boundaryId:
        "phase5-67.repo_family.backup_recovery_compliance_evidence.phase566.policy_governance_boundary",
      boundaryFamily: "policy_governance_contract",
      relatedSystem: "repo-family",
      currentStatus: "future_contract_required",
      subject: "backup/recovery compliance evidence from Phase 5.66",
      infrastructureOwnershipExpectation: infrastructure,
      environmentSeparationExpectation: environment,
      piiDataClassificationExpectation: pii,
      retentionDeletionExportExpectation: retention,
      compliancePostureNotes:
        "Future backup/recovery compliance evidence must align with Phase 5.66 RTO/RPO, drill, restore-test, retention, and audit boundaries without running backup, restore, or failover automation.",
      vendorExternalServiceExpectation: vendor,
      policyGovernanceExpectation: policy
    }),
    infrastructureComplianceDataRetentionBoundaryMapDefinition({
      boundaryId:
        "phase5-67.ardyn.auth_permission_subject_consent_traceability.phase562.policy_governance_boundary",
      boundaryFamily: "policy_governance_contract",
      relatedSystem: "ardyn",
      currentStatus: "future_contract_required",
      subject: "auth/permission subject and consent traceability from Phase 5.62",
      infrastructureOwnershipExpectation: infrastructure,
      environmentSeparationExpectation: environment,
      piiDataClassificationExpectation:
        "Future subject and consent traceability must define identity, role, delegation, consent, revocation, and audit evidence before any auth/session/token/API-key runtime.",
      retentionDeletionExportExpectation: retention,
      compliancePostureNotes: notes.complianceEvidenceOnly,
      vendorExternalServiceExpectation: vendor,
      policyGovernanceExpectation: policy
    }),
    infrastructureComplianceDataRetentionBoundaryMapDefinition({
      boundaryId:
        "phase5-67.ardyn.security_rls_input_sanitization_compliance.phase563.policy_governance_boundary",
      boundaryFamily: "policy_governance_contract",
      relatedSystem: "ardyn",
      currentStatus: "future_contract_required",
      subject: "security/RLS/input-sanitization compliance from Phase 5.63",
      infrastructureOwnershipExpectation: infrastructure,
      environmentSeparationExpectation: environment,
      piiDataClassificationExpectation: pii,
      retentionDeletionExportExpectation: retention,
      compliancePostureNotes:
        "Future security/RLS/input-sanitization compliance evidence must prove fail-closed behavior before any database, RLS, sanitizer, storage write, migration, or policy engine.",
      vendorExternalServiceExpectation: vendor,
      policyGovernanceExpectation: policy
    }),
    infrastructureComplianceDataRetentionBoundaryMapDefinition({
      boundaryId:
        "phase5-67.ardyn.rate_limit_abuse_evidence.phase564.policy_governance_boundary",
      boundaryFamily: "policy_governance_contract",
      relatedSystem: "ardyn",
      currentStatus: "future_contract_required",
      subject: "rate-limit/abuse evidence from Phase 5.64",
      infrastructureOwnershipExpectation: infrastructure,
      environmentSeparationExpectation: environment,
      piiDataClassificationExpectation:
        "Future abuse evidence must define data minimization, retention, false-positive handling, appeal/override governance, and audit scope before any limiter or abuse-control runtime.",
      retentionDeletionExportExpectation: retention,
      compliancePostureNotes: notes.complianceEvidenceOnly,
      vendorExternalServiceExpectation: vendor,
      policyGovernanceExpectation: policy
    }),
    infrastructureComplianceDataRetentionBoundaryMapDefinition({
      boundaryId:
        "phase5-67.ardyn.error_log_audit_integrity_evidence.phase565.policy_governance_boundary",
      boundaryFamily: "policy_governance_contract",
      relatedSystem: "ardyn",
      currentStatus: "future_contract_required",
      subject: "error/log/audit integrity evidence from Phase 5.65",
      infrastructureOwnershipExpectation: infrastructure,
      environmentSeparationExpectation: environment,
      piiDataClassificationExpectation:
        "Future log/audit evidence must define personal data minimization, transcript scope, redaction, retention, deletion exceptions, and external-sink ownership before any logger or audit writer.",
      retentionDeletionExportExpectation: retention,
      compliancePostureNotes: notes.complianceEvidenceOnly,
      vendorExternalServiceExpectation: vendor,
      policyGovernanceExpectation: policy
    }),
    infrastructureComplianceDataRetentionBoundaryMapDefinition({
      boundaryId:
        "phase5-67.repo_family.fabric_coordination_envelope_compliance.fabric_compliance_boundary",
      boundaryFamily: "fabric_compliance_boundary",
      relatedSystem: "repo-family",
      currentStatus: "future_contract_required",
      subject: "Fabric coordination-envelope compliance",
      infrastructureOwnershipExpectation: infrastructure,
      environmentSeparationExpectation: environment,
      piiDataClassificationExpectation:
        "Future Fabric compliance must classify coordination envelopes, payload references, task metadata, connector references, audit traces, and consumer-visible status before any Fabric runtime.",
      retentionDeletionExportExpectation: retention,
      compliancePostureNotes: notes.complianceEvidenceOnly,
      vendorExternalServiceExpectation: vendor,
      policyGovernanceExpectation: policy,
      fabricRole:
        "Fabric may later carry compliance reference metadata only; Ardyn creates no Fabric bus, websocket/http transport, MCP/task runtime, broker, adapter, or external sink."
    }),
    infrastructureComplianceDataRetentionBoundaryMapDefinition({
      boundaryId:
        "phase5-67.locus.compliance_status_visibility.compliance_readiness_boundary",
      boundaryFamily: "compliance_readiness_contract",
      relatedSystem: "locus",
      currentStatus: "future_contract_required",
      subject: "Locus-visible compliance and status boundary",
      infrastructureOwnershipExpectation: infrastructure,
      environmentSeparationExpectation: environment,
      piiDataClassificationExpectation: pii,
      retentionDeletionExportExpectation: retention,
      compliancePostureNotes:
        "Future Locus-visible status may display evidence metadata only after a consumer-owned UI contract; Ardyn creates no UI, browser, frontend, rendering, or WCAG automation.",
      vendorExternalServiceExpectation: vendor,
      policyGovernanceExpectation: policy,
      locusRole:
        "Locus may later display compliance/status metadata only after Locus-owned authorization and UI contracts."
    }),
    infrastructureComplianceDataRetentionBoundaryMapDefinition({
      boundaryId:
        "phase5-67.multiverse.capability_task_compliance_status.compliance_readiness_boundary",
      boundaryFamily: "compliance_readiness_contract",
      relatedSystem: "multiverse",
      currentStatus: "future_contract_required",
      subject: "Multiverse-visible capability/task compliance status boundary",
      infrastructureOwnershipExpectation: infrastructure,
      environmentSeparationExpectation: environment,
      piiDataClassificationExpectation: pii,
      retentionDeletionExportExpectation: retention,
      compliancePostureNotes:
        "Future Multiverse-visible capability/task compliance status may display metadata only after Multiverse-owned task and UI contracts; Ardyn executes no task.",
      vendorExternalServiceExpectation: vendor,
      policyGovernanceExpectation: policy,
      multiverseRole:
        "Multiverse may later display capability/task compliance metadata only after Multiverse-owned authorization, task, and UI contracts."
    }),
    infrastructureComplianceDataRetentionBoundaryMapDefinition({
      boundaryId:
        "phase5-67.ardyn.mcp_tool_exposure_compliance.deployment_governance_boundary",
      boundaryFamily: "deployment_governance_contract",
      relatedSystem: "ardyn",
      currentStatus: "future_contract_required",
      subject: "MCP/tool exposure compliance",
      infrastructureOwnershipExpectation: infrastructure,
      environmentSeparationExpectation:
        "Future MCP/tool exposure compliance must define environment, capability, audit, retention, consent, and command-exposure gates before any tool or MCP server is exposed.",
      piiDataClassificationExpectation: pii,
      retentionDeletionExportExpectation: retention,
      compliancePostureNotes: notes.complianceEvidenceOnly,
      vendorExternalServiceExpectation: vendor,
      policyGovernanceExpectation: policy
    }),
    infrastructureComplianceDataRetentionBoundaryMapDefinition({
      boundaryId:
        "phase5-67.repo_family.connector_vendor_external_service_compliance.vendor_boundary",
      boundaryFamily: "vendor_external_service_boundary",
      relatedSystem: "repo-family",
      currentStatus: "future_contract_required",
      subject: "connector/vendor external-service compliance",
      infrastructureOwnershipExpectation: infrastructure,
      environmentSeparationExpectation: environment,
      piiDataClassificationExpectation:
        "Future connector/vendor compliance must classify data sent to vendors, legal basis, processor role, retention, deletion, export, and revocation before any connector grant or external lookup.",
      retentionDeletionExportExpectation: retention,
      compliancePostureNotes: notes.complianceEvidenceOnly,
      vendorExternalServiceExpectation:
        "Future vendor/external-service boundaries require a contract, DPA posture, data processing inventory, authorization, revocation, and audit evidence before any integration.",
      policyGovernanceExpectation: policy
    }),
    infrastructureComplianceDataRetentionBoundaryMapDefinition({
      boundaryId:
        "phase5-67.content_fabric.secure_drop_compliance.secure_drop_compliance_boundary",
      boundaryFamily: "secure_drop_compliance_boundary",
      relatedSystem: "content-fabric",
      currentStatus: "future_contract_required",
      subject: "Secure Drop compliance",
      infrastructureOwnershipExpectation:
        "Secure Drop compliance implementation ownership remains canonical in content-fabric; Ardyn records only metadata references.",
      environmentSeparationExpectation: environment,
      piiDataClassificationExpectation:
        "Future Secure Drop compliance must classify metadata, payload references, sender/recipient identity, retention, deletion, export, and evidence ownership in content-fabric before implementation.",
      retentionDeletionExportExpectation:
        "Future Secure Drop retention/deletion/export remains content-fabric-owned; Ardyn creates no storage, inbox polling, file selection, transport, crypto, stego, ST3GG, or connector ingestion.",
      compliancePostureNotes: notes.complianceEvidenceOnly,
      vendorExternalServiceExpectation: vendor,
      policyGovernanceExpectation: policy,
      fabricRole:
        "Fabric may later carry Secure Drop compliance reference metadata only.",
      secureDropRole: notes.secureDropContentFabric
    }),
    infrastructureComplianceDataRetentionBoundaryMapDefinition({
      boundaryId:
        "phase5-67.ardyn.secrets_env_vault_governance.environment_boundary",
      boundaryFamily: "environment_boundary_contract",
      relatedSystem: "ardyn",
      currentStatus: "future_contract_required",
      subject: "secrets/env/vault governance",
      infrastructureOwnershipExpectation: infrastructure,
      environmentSeparationExpectation:
        "Future secrets/env/vault governance must separate local/dev/staging/production secrets, rotation, access, audit, and break-glass ownership before any secret/env/vault read.",
      piiDataClassificationExpectation: pii,
      retentionDeletionExportExpectation: retention,
      compliancePostureNotes: notes.complianceEvidenceOnly,
      vendorExternalServiceExpectation: vendor,
      policyGovernanceExpectation: policy
    }),
    infrastructureComplianceDataRetentionBoundaryMapDefinition({
      boundaryId:
        "phase5-67.repo_family.license_provenance_dependency_compliance_evidence.policy_governance_boundary",
      boundaryFamily: "policy_governance_contract",
      relatedSystem: "repo-family",
      currentStatus: "future_contract_required",
      subject: "license/provenance/dependency compliance evidence",
      infrastructureOwnershipExpectation: infrastructure,
      environmentSeparationExpectation: environment,
      piiDataClassificationExpectation: pii,
      retentionDeletionExportExpectation: retention,
      compliancePostureNotes:
        "Future license/provenance/dependency evidence must define SBOM, dependency provenance, license review, vulnerability triage, package ownership, and audit scope without packaging or external lookups.",
      vendorExternalServiceExpectation: vendor,
      policyGovernanceExpectation: policy
    }),
    infrastructureComplianceDataRetentionBoundaryMapDefinition({
      boundaryId:
        "phase5-67.ardyn_subagent.encoded_handoff_compliance.phase560.policy_governance_boundary",
      boundaryFamily: "policy_governance_contract",
      relatedSystem: "ardyn-subagent",
      currentStatus: "future_contract_required",
      subject: "inter-agent encoded handoff compliance from Phase 5.60",
      infrastructureOwnershipExpectation: infrastructure,
      environmentSeparationExpectation: environment,
      piiDataClassificationExpectation:
        "Future encoded handoff compliance must define metadata classification, auditability, covert-channel exclusions, retention, and review boundaries before any codec, translator, encoder, decoder, stego, tokenizer exploit, bypass, or transport.",
      retentionDeletionExportExpectation: retention,
      compliancePostureNotes: notes.complianceEvidenceOnly,
      vendorExternalServiceExpectation: vendor,
      policyGovernanceExpectation: policy
    })
  ];
}

function infrastructureComplianceDataRetentionBoundaryMapEntry(definition) {
  const {
    subject: _subject,
    locusRole,
    multiverseRole,
    fabricRole,
    secureDropRole,
    ...entry
  } = definition;

  return {
    ...entry,
    forbiddenCurrentBehavior:
      infrastructureComplianceDataRetentionBoundaryMapForbiddenBehavior(),
    productionReadinessAreaReference: {
      phase: "5.48",
      areaNumber: 14,
      areaName: "Infrastructure Management & Compliance",
      sourceFixture:
        "tests/fixtures/host-policy/phase5-48/production-readiness-coverage-matrix.json",
      sourceStatus: "deferred",
      representedByPhase567: true,
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
    phase560InterAgentEncodedHandoffConformanceReference: {
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
    phase562AuthPermissionsContractBoundaryReference: {
      phase: "5.62",
      sourceFixture:
        "tests/fixtures/host-policy/phase5-62/auth-permissions-contract-boundary-map.json",
      authPermissionsBoundaryReferenced: true,
      implementsAuthPermissionsRuntime: false,
      authorizesRuntime: false
    },
    phase563SecurityRlsInputSanitizationBoundaryReference: {
      phase: "5.63",
      sourceFixture:
        "tests/fixtures/host-policy/phase5-63/security-rls-input-sanitization-contract-boundary-map.json",
      securityRlsInputSanitizationBoundaryReferenced: true,
      implementsSecurityRuntime: false,
      authorizesRuntime: false
    },
    phase564RateLimitingAbuseControlBoundaryReference: {
      phase: "5.64",
      sourceFixture:
        "tests/fixtures/host-policy/phase5-64/rate-limiting-abuse-control-contract-boundary-map.json",
      rateLimitingAbuseControlBoundaryReferenced: true,
      implementsAbuseRuntime: false,
      authorizesRuntime: false
    },
    phase565ErrorTrackingLoggingAuditIntegrityBoundaryReference: {
      phase: "5.65",
      sourceFixture:
        "tests/fixtures/host-policy/phase5-65/error-tracking-logging-audit-integrity-contract-boundary-map.json",
      errorTrackingLoggingAuditIntegrityBoundaryReferenced: true,
      implementsObservabilityRuntime: false,
      authorizesRuntime: false
    },
    phase566AvailabilityRecoveryBoundaryReference: {
      phase: "5.66",
      sourceFixture:
        "tests/fixtures/host-policy/phase5-66/availability-recovery-contract-boundary-map.json",
      availabilityRecoveryBoundaryReferenced: true,
      implementsAvailabilityRecoveryRuntime: false,
      authorizesRuntime: false
    },
    infrastructureComplianceDataRetentionBoundaryMetadataOnly: true,
    noLiveInfrastructureComplianceDataRetentionPerformed: true,
    explicitBlockedAuthorizationFlags:
      infrastructureComplianceDataRetentionBoundaryMapAuthorizationFlags(),
    unsafeInfrastructureComplianceDataRetentionRuntimeFlags:
      infrastructureComplianceDataRetentionBoundaryMapFalseRuntimeFields(),
    nonAuthorizingProof: true,
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

function infrastructureComplianceDataRetentionBoundaryMapEntries() {
  return infrastructureComplianceDataRetentionBoundaryMapDefinitions().map(
    infrastructureComplianceDataRetentionBoundaryMapEntry
  );
}

function infrastructureComplianceDataRetentionBoundaryMapSummary(entries) {
  const countByFamily = Object.fromEntries(
    INFRASTRUCTURE_COMPLIANCE_DATA_RETENTION_BOUNDARY_FAMILIES.map((family) => [
      family,
      entries.filter((entry) => entry.boundaryFamily === family).length
    ])
  );
  const countByRelatedSystem = Object.fromEntries(
    INFRASTRUCTURE_COMPLIANCE_DATA_RETENTION_RELATED_SYSTEMS.map((system) => [
      system,
      entries.filter((entry) => entry.relatedSystem === system).length
    ])
  );

  return {
    infrastructureComplianceDataRetentionContractBoundaryMapKind:
      INFRASTRUCTURE_COMPLIANCE_DATA_RETENTION_CONTRACT_BOUNDARY_MAP_KIND,
    boundaryEntryCount: entries.length,
    boundaryIds: entries.map((entry) => entry.boundaryId),
    boundaryFamilies: [
      ...INFRASTRUCTURE_COMPLIANCE_DATA_RETENTION_BOUNDARY_FAMILIES
    ],
    relatedSystems: [
      ...INFRASTRUCTURE_COMPLIANCE_DATA_RETENTION_RELATED_SYSTEMS
    ],
    currentStatusValues: [...INFRASTRUCTURE_COMPLIANCE_DATA_RETENTION_STATUSES],
    countByFamily,
    countByRelatedSystem,
    phase548InfrastructureManagementComplianceCoverageItemRepresented: true,
    phase559FabricAwareApiBackendBoundaryReferenced: true,
    phase560EncodedHandoffConformanceReferenced: true,
    phase561DatabaseStorageContractBoundaryReferenced: true,
    phase562AuthPermissionsContractBoundaryReferenced: true,
    phase563SecurityRlsInputSanitizationBoundaryReferenced: true,
    phase564RateLimitingAbuseControlBoundaryReferenced: true,
    phase565ErrorTrackingLoggingAuditIntegrityBoundaryReferenced: true,
    phase566AvailabilityRecoveryBoundaryReferenced: true,
    infrastructureComplianceDataRetentionBoundaryMetadataOnly: true,
    noLiveInfrastructureComplianceDataRetentionPerformed: true,
    noInfrastructureAutomationImplemented: true,
    noDeploymentAutomationImplemented: true,
    noCloudProvisioningImplemented: true,
    noComplianceAutomationImplemented: true,
    noComplianceEnforcementImplemented: true,
    noComplianceCertificationClaimed: true,
    noPiiProcessingImplemented: true,
    noRetentionDeletionExportJobsImplemented: true,
    noVendorExternalServiceIntegration: true,
    noSecretsAccess: true,
    noPolicyEngineImplemented: true,
    noBackendApiServerImplemented: true,
    noStorageWrites: true,
    noConnectorGrants: true,
    noSecureDropImplementation: true,
    noFabricRuntime: true,
    noHealthBackupRestoreFailoverRuntime: true,
    contentFabricCanonicalSecureDropOwnerOnly: true,
    allBlockedAuthorizationFlagsFalse: true,
    allUnsafeInfrastructureComplianceDataRetentionRuntimeFlagsFalse: true,
    allRuntimeEffectsFalse: true,
    allEntriesNonAuthorizing: true
  };
}

function infrastructureComplianceDataRetentionBoundaryMapValidationRules() {
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
    unsafeInfrastructureComplianceDataRetentionRuntimeFlagsFailClosed: true,
    hiddenInfrastructureAutomationSemanticsFailClosed: true,
    hiddenDeploymentCloudProvisioningSemanticsFailClosed: true,
    hiddenComplianceCertificationEnforcementSemanticsFailClosed: true,
    hiddenPiiCollectionProcessingSemanticsFailClosed: true,
    hiddenRetentionDeletionExportExecutionSemanticsFailClosed: true,
    hiddenVendorExternalServiceIntegrationSemanticsFailClosed: true,
    hiddenSecretEnvVaultAccessSemanticsFailClosed: true,
    hiddenBackendApiServerSemanticsFailClosed: true,
    hiddenDatabaseStorageCacheWriteSemanticsFailClosed: true,
    hiddenAuthSessionTokenApiKeySemanticsFailClosed: true,
    hiddenConnectorGrantSemanticsFailClosed: true,
    hiddenFabricWebsocketHttpMcpTaskRuntimeSemanticsFailClosed: true,
    hiddenSecureDropImplementationSemanticsFailClosed: true,
    hiddenEncodedHandoffCodecTranslatorStegoCovertChannelTokenizerExploitBypassSemanticsFailClosed:
      true,
    hiddenLoggerAuditTranscriptTelemetryExternalSinkSemanticsFailClosed: true,
    hiddenHealthBackupRestoreFailoverSchedulerProcessSupervisorSemanticsFailClosed:
      true,
    nestedUnsafeFlagsFailClosed: true,
    noncanonicalBoundaryEntriesFailClosed: true,
    validationRunsInfrastructureAutomation: false,
    validationRunsDeploymentAutomation: false,
    validationRunsCloudProvisioning: false,
    validationRunsComplianceEnforcement: false,
    validationProcessesPii: false,
    validationRunsRetentionDeletionExportJobs: false,
    validationRunsPolicyEngine: false,
    validationAccessesSecrets: false,
    validationRunsVendorIntegration: false,
    validationRunsBackendApiServer: false,
    validationWritesStorage: false,
    validationGrantsConnectors: false,
    validationRunsHealthBackupRestoreFailover: false,
    validationRunsRuntime: false
  };
}

function infrastructureComplianceDataRetentionBoundaryMapGaps() {
  return [
    "No infrastructure automation, deployment automation, cloud provisioning, environment manager, policy engine, compliance automation, compliance enforcement, or runtime governance exists in Ardyn.",
    "No PII collection, PII processing, data processing inventory runtime, retention job, deletion job, export job, package writer, import/export path, storage write, database client, storage adapter, cache engine, RLS rule, or migration exists in Ardyn.",
    "GDPR, CCPA, SOC2, and similar regimes remain future evidence-planning boundaries only; Ardyn claims no certification, no compliance status, and no live control operation.",
    "Fabric coordination, encoded handoff, MCP/tool exposure, connector/vendor grants, Secure Drop compliance, and external-service processing remain future contracts with no runtime transport, task execution, lookup, service discovery, or storage sink.",
    "Future Locus/Multiverse displays still need consumer-owned infrastructure, compliance, availability, observability, auth, database, Fabric, and API/backend status contracts before any UI or task surface."
  ];
}

function infrastructureComplianceDataRetentionBoundaryMapState(reviewedAt) {
  const boundaryEntries =
    infrastructureComplianceDataRetentionBoundaryMapEntries();

  return {
    schema:
      INFRASTRUCTURE_COMPLIANCE_DATA_RETENTION_CONTRACT_BOUNDARY_MAP_STATE_SCHEMA,
    schemaVersion:
      INFRASTRUCTURE_COMPLIANCE_DATA_RETENTION_CONTRACT_BOUNDARY_MAP_VERSION,
    stateKind:
      INFRASTRUCTURE_COMPLIANCE_DATA_RETENTION_CONTRACT_BOUNDARY_MAP_KIND,
    stateMode: "review-only",
    reviewedAt,
    sourcePhaseContext: {
      phase548ProductionReadinessCoverageMatrix:
        "tests/fixtures/host-policy/phase5-48/production-readiness-coverage-matrix.json",
      phase548InfrastructureManagementComplianceAreaNumber: 14,
      phase548InfrastructureManagementComplianceStatus: "deferred",
      phase559FabricAwareApiBackendBoundary:
        "tests/fixtures/host-policy/phase5-59/fabric-aware-api-backend-contract-boundary-map.json",
      phase560InterAgentEncodedHandoffConformance:
        "tests/fixtures/host-policy/phase5-60/inter-agent-encoded-handoff-conformance.json",
      phase561DatabaseStorageContractBoundary:
        "tests/fixtures/host-policy/phase5-61/database-storage-contract-boundary-map.json",
      phase562AuthPermissionsContractBoundary:
        "tests/fixtures/host-policy/phase5-62/auth-permissions-contract-boundary-map.json",
      phase563SecurityRlsInputSanitizationContractBoundary:
        "tests/fixtures/host-policy/phase5-63/security-rls-input-sanitization-contract-boundary-map.json",
      phase564RateLimitingAbuseControlContractBoundary:
        "tests/fixtures/host-policy/phase5-64/rate-limiting-abuse-control-contract-boundary-map.json",
      phase565ErrorTrackingLoggingAuditIntegrityContractBoundary:
        "tests/fixtures/host-policy/phase5-65/error-tracking-logging-audit-integrity-contract-boundary-map.json",
      phase566AvailabilityRecoveryContractBoundary:
        "tests/fixtures/host-policy/phase5-66/availability-recovery-contract-boundary-map.json",
      secureDropCanonicalOwner: "content-fabric",
      complianceCertificationClaimed: false,
      runtimeStillBlocked: true
    },
    boundaryEntries,
    boundaryMapSummary:
      infrastructureComplianceDataRetentionBoundaryMapSummary(boundaryEntries),
    invalidBoundaryCasePolicy:
      infrastructureComplianceDataRetentionBoundaryMapValidationRules(),
    topInfrastructureComplianceAvailabilityObservabilitySecurityAuthDatabaseFabricApiBackendGaps:
      infrastructureComplianceDataRetentionBoundaryMapGaps(),
    recommendedNextPhase:
      "phase-5.68-review-only-testing-frameworks-quality-gates-contract-boundary-map",
    infrastructureComplianceDataRetentionContractBoundaryMapOnly: true,
    reviewOnly: true,
    metadataOnly: true,
    authoritative: false,
    nonAuthorizingProof: true,
    reportRunsChecks: false,
    ...infrastructureComplianceDataRetentionBoundaryMapFalseRuntimeFields(),
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

function infrastructureComplianceDataRetentionBoundaryMapResult({
  reviewedAt,
  reviewedAtDefaulted,
  classification,
  accepted,
  infrastructureComplianceDataRetentionContractBoundaryMap
}) {
  return {
    schema:
      INFRASTRUCTURE_COMPLIANCE_DATA_RETENTION_CONTRACT_BOUNDARY_MAP_SCHEMA,
    schemaVersion:
      INFRASTRUCTURE_COMPLIANCE_DATA_RETENTION_CONTRACT_BOUNDARY_MAP_VERSION,
    infrastructureComplianceDataRetentionContractBoundaryMapKind:
      INFRASTRUCTURE_COMPLIANCE_DATA_RETENTION_CONTRACT_BOUNDARY_MAP_KIND,
    infrastructureComplianceDataRetentionContractBoundaryMapMode: "review-only",
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    infrastructureComplianceDataRetentionContractBoundaryMapProduced: accepted,
    infrastructureComplianceDataRetentionContractBoundaryMap,
    boundaryMapSummary: accepted
      ? infrastructureComplianceDataRetentionContractBoundaryMap.boundaryMapSummary
      : null,
    boundaryEntries: accepted
      ? infrastructureComplianceDataRetentionContractBoundaryMap.boundaryEntries
      : [],
    invalidBoundaryCasePolicy: accepted
      ? infrastructureComplianceDataRetentionContractBoundaryMap.invalidBoundaryCasePolicy
      : infrastructureComplianceDataRetentionBoundaryMapValidationRules(),
    topInfrastructureComplianceAvailabilityObservabilitySecurityAuthDatabaseFabricApiBackendGaps:
      accepted
        ? infrastructureComplianceDataRetentionContractBoundaryMap
            .topInfrastructureComplianceAvailabilityObservabilitySecurityAuthDatabaseFabricApiBackendGaps
        : [],
    recommendedNextPhase: accepted
      ? infrastructureComplianceDataRetentionContractBoundaryMap.recommendedNextPhase
      : null,
    infrastructureComplianceDataRetentionContractBoundaryMapOnly: true,
    reviewOnly: true,
    metadataOnly: true,
    authoritative: false,
    nonAuthorizingProof: true,
    reportRunsChecks: false,
    ...infrastructureComplianceDataRetentionBoundaryMapFalseRuntimeFields(),
    rejectionReasons: accepted
      ? []
      : [
          {
            classification,
            rejected: true,
            runtimeAuthorized: false,
            infrastructureAutomationAuthorized: false,
            deploymentAutomationAuthorized: false,
            complianceEnforcementAuthorized: false,
            piiProcessingAuthorized: false,
            retentionDeletionExportJobsAuthorized: false,
            commandExposureAuthorized: false,
            reportRunsChecks: false
          }
        ],
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

export function createInfrastructureComplianceDataRetentionContractBoundaryMapForReview(
  input = {}
) {
  const inputRecord =
    infrastructureComplianceDataRetentionBoundaryMapInputRecord(input);
  const reviewedAt =
    infrastructureComplianceDataRetentionBoundaryMapReviewedAt(inputRecord);
  const reviewedAtDefaulted = isReviewedAtDefaulted(inputRecord);
  const classification =
    infrastructureComplianceDataRetentionBoundaryMapInputClassification(
      inputRecord
    );
  const accepted =
    classification ===
    VALID_INFRASTRUCTURE_COMPLIANCE_DATA_RETENTION_CONTRACT_BOUNDARY_MAP_CLASSIFICATION;
  const infrastructureComplianceDataRetentionContractBoundaryMap = accepted
    ? infrastructureComplianceDataRetentionBoundaryMapState(reviewedAt)
    : null;

  return infrastructureComplianceDataRetentionBoundaryMapResult({
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    accepted,
    infrastructureComplianceDataRetentionContractBoundaryMap
  });
}

const AGENT_MODE_PROFILE_SKILLHUB_CAPABILITY_BOUNDARY_MAP_STATE_SCHEMA =
  "ardyn.phase-5.68.agent-mode-profile-skillhub-capability-boundary-map-state";
const VALID_AGENT_MODE_PROFILE_SKILLHUB_CAPABILITY_BOUNDARY_MAP_CLASSIFICATION =
  "valid_agent_mode_profile_skillhub_capability_boundary_map_runtime_still_blocked";
const MALFORMED_AGENT_MODE_PROFILE_SKILLHUB_CAPABILITY_BOUNDARY_MAP_CLASSIFICATION =
  "malformed_agent_mode_profile_skillhub_capability_boundary_map_input_rejected";

const AGENT_MODE_PROFILE_SKILLHUB_CAPABILITY_BOUNDARY_FAMILIES = Object.freeze([
  "agent_mode_contract",
  "profile_contract",
  "personality_session_contract",
  "subagent_background_contract",
  "conversation_continuity_contract",
  "front_desk_model_contract",
  "computer_use_contract",
  "cua_driver_contract",
  "cua_driver_mcp_stdio_contract",
  "cua_driver_manifest_contract",
  "computer_use_doctor_contract",
  "desktop_control_contract",
  "browser_control_contract",
  "screenshot_capture_contract",
  "accessibility_tree_contract",
  "som_index_contract",
  "safe_action_contract",
  "mutating_action_approval_contract",
  "blocked_key_combo_contract",
  "dangerous_type_pattern_contract",
  "multimodal_tool_return_contract",
  "telemetry_opt_in_contract",
  "driver_update_provenance_contract",
  "terminal_backend_contract",
  "toolset_contract",
  "skill_loading_contract",
  "skillhub_install_contract",
  "skill_security_scan_contract",
  "skill_inventory_contract",
  "mcp_inventory_contract",
  "plugin_inventory_contract",
  "provider_inventory_contract",
  "tool_adapter_visibility_contract",
  "gateway_messaging_contract",
  "scheduled_automation_contract",
  "context_file_contract",
  "memory_profile_contract",
  "acp_adapter_registry_contract",
  "a2a_handoff_contract",
  "diffusion_mode_contract",
  "sakana_style_mode_contract",
  "fusion_judge_mode_contract",
  "prompt_skill_resolution_contract",
  "control_plane_visibility_contract"
]);
const AGENT_MODE_PROFILE_SKILLHUB_CAPABILITY_RELATED_SYSTEMS = Object.freeze([
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
const AGENT_MODE_PROFILE_SKILLHUB_CAPABILITY_STATUSES = Object.freeze([
  "metadata_only",
  "blocked",
  "future_contract_required"
]);
const AGENT_MODE_PROFILE_SKILLHUB_CAPABILITY_REQUIRED_FIELDS = Object.freeze([
  "boundaryId",
  "boundaryFamily",
  "relatedSystem",
  "currentStatus",
  "allowedCurrentBehavior",
  "forbiddenCurrentBehavior",
  "requiredFutureContractBeforeImplementation",
  "requiredFutureAuthorizationPhaseBeforeRuntime",
  "operatorVisibilityExpectation",
  "humanConversationContinuityExpectation",
  "profilePersonalitySessionExpectation",
  "promptToSkillMatchingExpectation",
  "skillPluginMcpProviderInventoryExpectation",
  "securityScanExpectation",
  "frontDeskFallbackExpectation",
  "modelRoutingExpectation",
  "gatewayPlatformExpectation",
  "memoryContextExpectation",
  "cuaDriverRoleDescription",
  "locusRoleDescription",
  "multiverseRoleDescription",
  "fabricRoleDescription",
  "explicitBlockedAuthorizationFlags",
  "unsafeAgentModeCapabilityRuntimeFlags",
  "nonAuthorizingProof"
]);
const AGENT_MODE_PROFILE_SKILLHUB_CAPABILITY_ALLOWED_TOP_LEVEL_FIELDS =
  Object.freeze(["reviewedAt", "boundaryEntries"]);
const AGENT_MODE_PROFILE_SKILLHUB_CUA_DRIVER_COMPUTER_USE_ACTIONS =
  Object.freeze([
    "capture",
    "wait",
    "list apps",
    "list windows",
    "get window state",
    "screenshot",
    "click",
    "double click",
    "right click",
    "middle click",
    "drag",
    "scroll",
    "type text",
    "key/hotkey",
    "focus app",
    "set value",
    "move cursor",
    "launch app"
  ]);
const AGENT_MODE_PROFILE_SKILLHUB_CAPABILITY_UNSAFE_FIELDS = Object.freeze([
  "runtimeExecutionEnabled",
  "runtimeAuthorizationEnabled",
  "runtimeCommandEnabled",
  "commandExposureEnabled",
  "commandRuntimeControlEnabled",
  "connectorGrantProduced",
  "fabricRuntimeImplementedByArdyn",
  "websocketHttpTransportImplementedByArdyn",
  "mcpToolExposureEnabled",
  "taskExecutionEnabled",
  "secureDropImplemented",
  "serviceDiscoveryEnabled",
  "scheduleEnforcementEnabled",
  "filesystemWriteEnabled",
  "filesystemScanningEnabled",
  "processControlEnabled",
  "cuaDriverRuntimeEnabled",
  "cuaDriverBinaryExecutionEnabled",
  "cuaDriverInstallCommandEnabled",
  "cuaDriverUpdateCommandEnabled",
  "cuaDriverMcpStdioInvocationEnabled",
  "cuaDriverManifestDiscoveryRuntimeEnabled",
  "computerUseRuntimeEnabled",
  "desktopControlEnabled",
  "browserControlEnabled",
  "screenshotCaptureRuntimeEnabled",
  "ocrEnabled",
  "accessibilityTreeAccessEnabled",
  "somIndexRuntimeEnabled",
  "osWindowEnumerationEnabled",
  "waylandX11InputEnabled",
  "windowsUiAutomationSendInputEnabled",
  "macosAccessibilityPrivateApiEnabled",
  "clickRuntimeEnabled",
  "typeTextRuntimeEnabled",
  "keyHotkeyRuntimeEnabled",
  "dragRuntimeEnabled",
  "scrollRuntimeEnabled",
  "focusRuntimeEnabled",
  "setValueRuntimeEnabled",
  "moveCursorRuntimeEnabled",
  "launchAppRuntimeEnabled",
  "alwaysApproveEnabled",
  "sessionApproveEnabled",
  "telemetryOptInEnabled",
  "backgroundWorkerEnabled",
  "subagentDaemonEnabled",
  "profileLoaderEnabled",
  "personalityLoaderEnabled",
  "sessionLoaderEnabled",
  "contextFileLoaderEnabled",
  "skillLoaderEnabled",
  "skillhubInstallerEnabled",
  "securityScannerRuntimeEnabled",
  "mcpScannerEnabled",
  "pluginScannerEnabled",
  "providerScannerEnabled",
  "toolInventoryScannerEnabled",
  "gatewayRuntimeEnabled",
  "scheduledAutomationRuntimeEnabled",
  "terminalBackendRuntimeEnabled",
  "modelRouterEnabled",
  "fusionRuntimeEnabled",
  "judgeRuntimeEnabled",
  "frontDeskModelRuntimeEnabled",
  "queueEnabled",
  "schedulerImplemented",
  "asyncExecutorEnabled",
  "acpA2aRuntimeEnabled",
  "locusIntegrationEnabled",
  "externalHarnessIntegrationEnabled",
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
  "failoverRuntimeImplemented",
  "infrastructureAutomationImplemented",
  "deploymentAutomationImplemented",
  "complianceEnforcementImplemented",
  "piiProcessingImplemented",
  "uiFrontendBrowserRenderingImplemented",
  "blockedCliBypassEnabled"
]);
const AGENT_MODE_PROFILE_SKILLHUB_CAPABILITY_AUTHORIZATION_FIELDS =
  Object.freeze([
    "runtimeAuthorized",
    "runtimeAuthorizationGranted",
    "authorizesRuntime",
    "commandExposureAuthorizationGranted",
    "computerUseAuthorizationGranted",
    "cuaDriverAuthorizationGranted",
    "desktopControlAuthorizationGranted",
    "browserControlAuthorizationGranted",
    "screenshotCaptureAuthorizationGranted",
    "backgroundSubagentAuthorizationGranted",
    "profileLoaderAuthorizationGranted",
    "personalitySessionAuthorizationGranted",
    "contextFileAuthorizationGranted",
    "skillLoaderAuthorizationGranted",
    "skillhubInstallerAuthorizationGranted",
    "securityScannerAuthorizationGranted",
    "gatewayAuthorizationGranted",
    "schedulerAuthorizationGranted",
    "terminalBackendAuthorizationGranted",
    "modelRouterAuthorizationGranted",
    "fusionJudgeAuthorizationGranted",
    "frontDeskModelAuthorizationGranted",
    "acpA2aAuthorizationGranted",
    "locusIntegrationAuthorizationGranted",
    "externalHarnessAuthorizationGranted",
    "backendApiServerAuthorizationGranted",
    "databaseStorageAuthorizationGranted",
    "connectorGrantAuthorizationGranted",
    "approvalDecisionProduced",
    "approvalGrantProduced"
  ]);
const AGENT_MODE_PROFILE_SKILLHUB_CAPABILITY_COMMAND_FIELDS = Object.freeze([
  "commandExposureEnabled",
  "commandRuntimeControlEnabled",
  "commandsExposed",
  "exposesCommands",
  "runtimeCommandEnabled",
  "cliCommandExposed"
]);
const AGENT_MODE_PROFILE_SKILLHUB_CAPABILITY_BLOCKED_CLI_BYPASS_FIELDS =
  Object.freeze([
    "blockedCliBypassEnabled",
    "dryRunBypassesBlock",
    "serveRuntimeBypassEnabled",
    "bypassBlockedCommandBehavior",
    "blockedCommandOverride"
  ]);
const AGENT_MODE_PROFILE_SKILLHUB_CAPABILITY_HIDDEN_FIELD_GROUPS =
  Object.freeze([
    {
      classification:
        "hidden_cua_driver_execution_semantics_agent_mode_profile_skillhub_capability_boundary_map_input_rejected",
      fields: [
        "cuaDriver",
        "cuaDriverBackend",
        "cuaDriverCommand",
        "cuaDriverBinary",
        "cuaDriverInstallCommand",
        "cuaDriverUpdateCommand",
        "cuaDriverMcpStdioInvocation",
        "cuaDriverManifestDiscovery"
      ]
    },
    {
      classification:
        "hidden_computer_use_semantics_agent_mode_profile_skillhub_capability_boundary_map_input_rejected",
      fields: [
        "computerUseTool",
        "desktopController",
        "browserController",
        "screenshotPipeline",
        "ocrPipeline",
        "accessibilityTreeReader",
        "somIndexRuntime",
        "osWindowEnumerator"
      ]
    },
    {
      classification:
        "hidden_input_automation_semantics_agent_mode_profile_skillhub_capability_boundary_map_input_rejected",
      fields: [
        "clickAction",
        "typeTextAction",
        "keyHotkeyAction",
        "dragAction",
        "scrollAction",
        "focusAction",
        "setValueAction",
        "moveCursorAction",
        "launchAppAction",
        "sendInput",
        "waylandX11Input",
        "macosAccessibilityPrivateApi"
      ]
    },
    {
      classification:
        "hidden_action_approval_semantics_agent_mode_profile_skillhub_capability_boundary_map_input_rejected",
      fields: [
        "alwaysApprove",
        "sessionApprove",
        "mutatingActionApproval",
        "destructiveKeyComboExecutor",
        "dangerousTypedCommandExecutor",
        "approvalRuntime"
      ]
    },
    {
      classification:
        "hidden_multimodal_return_semantics_agent_mode_profile_skillhub_capability_boundary_map_input_rejected",
      fields: [
        "multimodalReturn",
        "imageReturn",
        "screenshotReturn",
        "captureReturn",
        "toolImagePayload",
        "textFallbackRuntime"
      ]
    },
    {
      classification:
        "hidden_telemetry_driver_update_semantics_agent_mode_profile_skillhub_capability_boundary_map_input_rejected",
      fields: [
        "telemetryOptIn",
        "telemetrySink",
        "driverUpdater",
        "driverVersionResolver",
        "driverProvenanceFetcher",
        "externalTelemetry"
      ]
    },
    {
      classification:
        "hidden_background_subagent_execution_semantics_agent_mode_profile_skillhub_capability_boundary_map_input_rejected",
      fields: [
        "backgroundWorker",
        "subagentDaemon",
        "asyncExecutor",
        "queueRuntime",
        "visibleSessionRuntime",
        "subagentResultHandoff"
      ]
    },
    {
      classification:
        "hidden_conversation_concurrency_semantics_agent_mode_profile_skillhub_capability_boundary_map_input_rejected",
      fields: [
        "frontDeskResponder",
        "orchestratorBusyRuntime",
        "concurrentStatusChannel",
        "conversationContinuationRuntime",
        "userInterruptRuntime"
      ]
    },
    {
      classification:
        "hidden_profile_personality_session_context_loading_semantics_agent_mode_profile_skillhub_capability_boundary_map_input_rejected",
      fields: [
        "profileLoader",
        "personalityLoader",
        "sessionLoader",
        "contextFileLoader",
        "memoryProfileLoader",
        "profileRuntime"
      ]
    },
    {
      classification:
        "hidden_skill_loading_install_scan_inventory_semantics_agent_mode_profile_skillhub_capability_boundary_map_input_rejected",
      fields: [
        "skillLoader",
        "skillhubInstaller",
        "oneClickSkillInstall",
        "skillSecurityScanner",
        "mcpScanner",
        "pluginScanner",
        "providerScanner",
        "toolInventoryScanner",
        "toolRegistry"
      ]
    },
    {
      classification:
        "hidden_gateway_scheduled_terminal_semantics_agent_mode_profile_skillhub_capability_boundary_map_input_rejected",
      fields: [
        "gatewayRuntime",
        "telegramBridge",
        "discordBridge",
        "slackBridge",
        "signalBridge",
        "whatsappBridge",
        "homeAssistantBridge",
        "cronScheduler",
        "scheduledAutomation",
        "terminalBackend",
        "sshBackend",
        "dockerBackend",
        "cloudBackend"
      ]
    },
    {
      classification:
        "hidden_model_routing_fusion_judge_front_desk_semantics_agent_mode_profile_skillhub_capability_boundary_map_input_rejected",
      fields: [
        "modelRouter",
        "frontDeskModel",
        "fusionRuntime",
        "judgeRuntime",
        "candidateModelRunner",
        "sakanaCandidateGenerator",
        "diffusionOrchestrator"
      ]
    },
    {
      classification:
        "hidden_acp_a2a_adapter_registry_semantics_agent_mode_profile_skillhub_capability_boundary_map_input_rejected",
      fields: [
        "acpAdapter",
        "a2aAdapter",
        "agentRegistry",
        "serviceRegistry",
        "serviceDiscovery",
        "handoffTransport"
      ]
    },
    {
      classification:
        "hidden_backend_api_server_storage_auth_connector_semantics_agent_mode_profile_skillhub_capability_boundary_map_input_rejected",
      fields: [
        "backendApiMiddleware",
        "apiRequestHandler",
        "httpServer",
        "serverMiddleware",
        "databaseUrl",
        "databaseDsn",
        "storageAdapter",
        "cacheEngine",
        "rlsPolicy",
        "migrationRunner",
        "sessionToken",
        "apiKey",
        "connectorGrant"
      ]
    },
    {
      classification:
        "hidden_fabric_secure_drop_encoded_handoff_runtime_semantics_agent_mode_profile_skillhub_capability_boundary_map_input_rejected",
      fields: [
        "fabricBus",
        "websocketUrl",
        "mcpServer",
        "taskRunner",
        "secureDropKeyring",
        "secureDropTransport",
        "encodedHandoffRuntime",
        "codecRuntime",
        "translatorRuntime",
        "stegoChannel",
        "covertChannel",
        "tokenizerExploit"
      ]
    },
    {
      classification:
        "hidden_logger_audit_telemetry_health_infrastructure_semantics_agent_mode_profile_skillhub_capability_boundary_map_input_rejected",
      fields: [
        "loggerRuntime",
        "auditWriter",
        "transcriptWriter",
        "telemetryClient",
        "healthChecker",
        "backupJob",
        "restoreJob",
        "failoverRuntime",
        "processSupervisor",
        "terraformPlan",
        "deployCommand",
        "complianceEnforcer",
        "piiProcessor"
      ]
    }
  ]);

function agentModeProfileSkillhubCapabilityBoundaryMapInputRecord(input) {
  return isPlainObjectRecord(input) ? input : null;
}

function agentModeProfileSkillhubCapabilityBoundaryMapReviewedAt(inputRecord) {
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

function agentModeProfileSkillhubCapabilityBoundaryMapContainsTrue(value) {
  if (value === true) {
    return true;
  }

  if (Array.isArray(value)) {
    return value.some(
      agentModeProfileSkillhubCapabilityBoundaryMapContainsTrue
    );
  }

  if (isPlainObjectRecord(value)) {
    return Object.values(value).some(
      agentModeProfileSkillhubCapabilityBoundaryMapContainsTrue
    );
  }

  return false;
}

function agentModeProfileSkillhubCapabilityBoundaryMapHasTrueFieldDeep(
  value,
  fields
) {
  if (Array.isArray(value)) {
    return value.some((item) =>
      agentModeProfileSkillhubCapabilityBoundaryMapHasTrueFieldDeep(
        item,
        fields
      )
    );
  }

  if (!isPlainObjectRecord(value)) {
    return false;
  }

  for (const [key, nested] of Object.entries(value)) {
    if (fields.includes(key) && nested === true) {
      return true;
    }

    if (
      agentModeProfileSkillhubCapabilityBoundaryMapHasTrueFieldDeep(
        nested,
        fields
      )
    ) {
      return true;
    }
  }

  return false;
}

function agentModeProfileSkillhubCapabilityBoundaryMapHasPresentFieldDeep(
  value,
  fields
) {
  if (Array.isArray(value)) {
    return value.some((item) =>
      agentModeProfileSkillhubCapabilityBoundaryMapHasPresentFieldDeep(
        item,
        fields
      )
    );
  }

  if (!isPlainObjectRecord(value)) {
    return false;
  }

  for (const [key, nested] of Object.entries(value)) {
    if (
      key === "explicitBlockedAuthorizationFlags" ||
      key === "unsafeAgentModeCapabilityRuntimeFlags"
    ) {
      continue;
    }

    if (fields.includes(key)) {
      return true;
    }

    if (
      agentModeProfileSkillhubCapabilityBoundaryMapHasPresentFieldDeep(
        nested,
        fields
      )
    ) {
      return true;
    }
  }

  return false;
}

function agentModeProfileSkillhubCapabilityBoundaryMapEntriesInput(inputRecord) {
  return Array.isArray(inputRecord?.boundaryEntries)
    ? inputRecord.boundaryEntries
    : null;
}

function agentModeProfileSkillhubCapabilityBoundaryMapMalformed(inputRecord) {
  return (
    inputRecord === null ||
    (Object.prototype.hasOwnProperty.call(inputRecord, "reviewedAt") &&
      !isUtcIsoTimestampWithMilliseconds(inputRecord.reviewedAt)) ||
    (Object.prototype.hasOwnProperty.call(inputRecord, "boundaryEntries") &&
      !Array.isArray(inputRecord.boundaryEntries))
  );
}

function agentModeProfileSkillhubCapabilityBoundaryMapEntryIssue(
  entries,
  predicate
) {
  return entries !== null && entries.some((entry) => predicate(entry));
}

function agentModeProfileSkillhubCapabilityBoundaryMapMissingRequired(entry) {
  return (
    !isPlainObjectRecord(entry) ||
    AGENT_MODE_PROFILE_SKILLHUB_CAPABILITY_REQUIRED_FIELDS.some(
      (field) => !Object.prototype.hasOwnProperty.call(entry, field)
    )
  );
}

function agentModeProfileSkillhubCapabilityBoundaryMapEntryMalformed(entry) {
  if (!isPlainObjectRecord(entry)) {
    return true;
  }

  return (
    typeof entry.boundaryId !== "string" ||
    !Array.isArray(entry.allowedCurrentBehavior) ||
    !Array.isArray(entry.forbiddenCurrentBehavior) ||
    typeof entry.requiredFutureContractBeforeImplementation !== "string" ||
    typeof entry.requiredFutureAuthorizationPhaseBeforeRuntime !== "string" ||
    typeof entry.operatorVisibilityExpectation !== "string" ||
    typeof entry.humanConversationContinuityExpectation !== "string" ||
    typeof entry.profilePersonalitySessionExpectation !== "string" ||
    typeof entry.promptToSkillMatchingExpectation !== "string" ||
    typeof entry.skillPluginMcpProviderInventoryExpectation !== "string" ||
    typeof entry.securityScanExpectation !== "string" ||
    typeof entry.frontDeskFallbackExpectation !== "string" ||
    typeof entry.modelRoutingExpectation !== "string" ||
    typeof entry.gatewayPlatformExpectation !== "string" ||
    typeof entry.memoryContextExpectation !== "string" ||
    typeof entry.cuaDriverRoleDescription !== "string" ||
    typeof entry.locusRoleDescription !== "string" ||
    typeof entry.multiverseRoleDescription !== "string" ||
    typeof entry.fabricRoleDescription !== "string" ||
    !isPlainObjectRecord(entry.explicitBlockedAuthorizationFlags) ||
    !isPlainObjectRecord(entry.unsafeAgentModeCapabilityRuntimeFlags) ||
    entry.nonAuthorizingProof !== true
  );
}

function agentModeProfileSkillhubCapabilityBoundaryMapAuthorizationFlagEnabled(
  value
) {
  if (!isPlainObjectRecord(value)) {
    return false;
  }

  return (
    (isPlainObjectRecord(value.explicitBlockedAuthorizationFlags) &&
      Object.values(value.explicitBlockedAuthorizationFlags).some(
        (flag) => flag !== false
      )) ||
    AGENT_MODE_PROFILE_SKILLHUB_CAPABILITY_AUTHORIZATION_FIELDS.some(
      (field) => value[field] === true
    )
  );
}

function agentModeProfileSkillhubCapabilityBoundaryMapUnsafeFlagEnabled(value) {
  if (!isPlainObjectRecord(value)) {
    return false;
  }

  return (
    (isPlainObjectRecord(value.unsafeAgentModeCapabilityRuntimeFlags) &&
      Object.values(value.unsafeAgentModeCapabilityRuntimeFlags).some(
        (flag) => flag !== false
      )) ||
    agentModeProfileSkillhubCapabilityBoundaryMapHasTrueFieldDeep(
      value,
      AGENT_MODE_PROFILE_SKILLHUB_CAPABILITY_UNSAFE_FIELDS
    )
  );
}

function agentModeProfileSkillhubCapabilityBoundaryMapCanonical(entries) {
  if (entries === null) {
    return true;
  }

  return (
    JSON.stringify(entries) ===
    JSON.stringify(agentModeProfileSkillhubCapabilityBoundaryMapEntries())
  );
}

function agentModeProfileSkillhubCapabilityBoundaryMapInputClassification(
  inputRecord
) {
  if (agentModeProfileSkillhubCapabilityBoundaryMapMalformed(inputRecord)) {
    return MALFORMED_AGENT_MODE_PROFILE_SKILLHUB_CAPABILITY_BOUNDARY_MAP_CLASSIFICATION;
  }

  const entries =
    agentModeProfileSkillhubCapabilityBoundaryMapEntriesInput(inputRecord);

  if (
    agentModeProfileSkillhubCapabilityBoundaryMapEntryIssue(
      entries,
      agentModeProfileSkillhubCapabilityBoundaryMapMissingRequired
    )
  ) {
    return "missing_required_agent_mode_profile_skillhub_capability_boundary_entry_rejected";
  }

  if (
    agentModeProfileSkillhubCapabilityBoundaryMapEntryIssue(
      entries,
      (entry) =>
        !AGENT_MODE_PROFILE_SKILLHUB_CAPABILITY_BOUNDARY_FAMILIES.includes(
          entry.boundaryFamily
        )
    )
  ) {
    return "unknown_boundary_family_agent_mode_profile_skillhub_capability_boundary_map_input_rejected";
  }

  if (
    agentModeProfileSkillhubCapabilityBoundaryMapEntryIssue(
      entries,
      (entry) =>
        !AGENT_MODE_PROFILE_SKILLHUB_CAPABILITY_RELATED_SYSTEMS.includes(
          entry.relatedSystem
        )
    )
  ) {
    return "unknown_related_system_agent_mode_profile_skillhub_capability_boundary_map_input_rejected";
  }

  if (
    agentModeProfileSkillhubCapabilityBoundaryMapEntryIssue(
      entries,
      (entry) =>
        !AGENT_MODE_PROFILE_SKILLHUB_CAPABILITY_STATUSES.includes(
          entry.currentStatus
        )
    )
  ) {
    return "unknown_current_status_agent_mode_profile_skillhub_capability_boundary_map_input_rejected";
  }

  if (
    agentModeProfileSkillhubCapabilityBoundaryMapEntryIssue(
      entries,
      agentModeProfileSkillhubCapabilityBoundaryMapEntryMalformed
    )
  ) {
    return MALFORMED_AGENT_MODE_PROFILE_SKILLHUB_CAPABILITY_BOUNDARY_MAP_CLASSIFICATION;
  }

  if (
    AGENT_MODE_PROFILE_SKILLHUB_CAPABILITY_AUTHORIZATION_FIELDS.some(
      (field) => inputRecord[field] === true
    )
  ) {
    return "runtime_authorization_attempt_agent_mode_profile_skillhub_capability_boundary_map_input_rejected";
  }

  if (
    agentModeProfileSkillhubCapabilityBoundaryMapEntryIssue(
      entries,
      agentModeProfileSkillhubCapabilityBoundaryMapAuthorizationFlagEnabled
    ) ||
    agentModeProfileSkillhubCapabilityBoundaryMapAuthorizationFlagEnabled(
      inputRecord
    )
  ) {
    return "authorization_flags_enabled_agent_mode_profile_skillhub_capability_boundary_map_input_rejected";
  }

  if (
    agentModeProfileSkillhubCapabilityBoundaryMapHasTrueFieldDeep(inputRecord, [
      "reportRunsChecks"
    ])
  ) {
    return "report_runs_checks_true_agent_mode_profile_skillhub_capability_boundary_map_input_rejected";
  }

  if (
    agentModeProfileSkillhubCapabilityBoundaryMapHasTrueFieldDeep(
      inputRecord,
      AGENT_MODE_PROFILE_SKILLHUB_CAPABILITY_AUTHORIZATION_FIELDS
    )
  ) {
    return "runtime_authorization_attempt_agent_mode_profile_skillhub_capability_boundary_map_input_rejected";
  }

  if (
    agentModeProfileSkillhubCapabilityBoundaryMapHasTrueFieldDeep(
      inputRecord,
      AGENT_MODE_PROFILE_SKILLHUB_CAPABILITY_COMMAND_FIELDS
    )
  ) {
    return "command_exposure_attempt_agent_mode_profile_skillhub_capability_boundary_map_input_rejected";
  }

  if (
    agentModeProfileSkillhubCapabilityBoundaryMapHasTrueFieldDeep(
      inputRecord,
      AGENT_MODE_PROFILE_SKILLHUB_CAPABILITY_BLOCKED_CLI_BYPASS_FIELDS
    )
  ) {
    return "blocked_cli_bypass_attempt_agent_mode_profile_skillhub_capability_boundary_map_input_rejected";
  }

  for (const {
    classification,
    fields
  } of AGENT_MODE_PROFILE_SKILLHUB_CAPABILITY_HIDDEN_FIELD_GROUPS) {
    if (
      agentModeProfileSkillhubCapabilityBoundaryMapHasPresentFieldDeep(
        inputRecord,
        fields
      )
    ) {
      return classification;
    }
  }

  if (
    agentModeProfileSkillhubCapabilityBoundaryMapUnsafeFlagEnabled(
      inputRecord
    ) ||
    agentModeProfileSkillhubCapabilityBoundaryMapEntryIssue(
      entries,
      agentModeProfileSkillhubCapabilityBoundaryMapUnsafeFlagEnabled
    )
  ) {
    return "unsafe_agent_mode_profile_skillhub_capability_runtime_flags_agent_mode_profile_skillhub_capability_boundary_map_input_rejected";
  }

  if (
    agentModeProfileSkillhubCapabilityBoundaryMapEntryIssue(entries, (entry) =>
      agentModeProfileSkillhubCapabilityBoundaryMapContainsTrue(
        entry?.runtimeEffect
      )
    ) ||
    agentModeProfileSkillhubCapabilityBoundaryMapContainsTrue(
      inputRecord?.runtimeEffect
    )
  ) {
    return "nested_unsafe_flags_agent_mode_profile_skillhub_capability_boundary_map_input_rejected";
  }

  if (
    Object.keys(inputRecord).some(
      (field) =>
        !AGENT_MODE_PROFILE_SKILLHUB_CAPABILITY_ALLOWED_TOP_LEVEL_FIELDS.includes(
          field
        )
    )
  ) {
    return "unknown_top_level_field_agent_mode_profile_skillhub_capability_boundary_map_input_rejected";
  }

  if (!agentModeProfileSkillhubCapabilityBoundaryMapCanonical(entries)) {
    return "noncanonical_agent_mode_profile_skillhub_capability_boundary_map_input_rejected";
  }

  return VALID_AGENT_MODE_PROFILE_SKILLHUB_CAPABILITY_BOUNDARY_MAP_CLASSIFICATION;
}

function agentModeProfileSkillhubCapabilityBoundaryMapAuthorizationFlags() {
  return {
    runtimeAuthorizationGranted: false,
    commandExposureAuthorizationGranted: false,
    computerUseAuthorizationGranted: false,
    cuaDriverAuthorizationGranted: false,
    desktopControlAuthorizationGranted: false,
    browserControlAuthorizationGranted: false,
    screenshotCaptureAuthorizationGranted: false,
    backgroundSubagentAuthorizationGranted: false,
    profileLoaderAuthorizationGranted: false,
    personalitySessionAuthorizationGranted: false,
    contextFileAuthorizationGranted: false,
    skillLoaderAuthorizationGranted: false,
    skillhubInstallerAuthorizationGranted: false,
    securityScannerAuthorizationGranted: false,
    gatewayAuthorizationGranted: false,
    schedulerAuthorizationGranted: false,
    terminalBackendAuthorizationGranted: false,
    modelRouterAuthorizationGranted: false,
    fusionJudgeAuthorizationGranted: false,
    frontDeskModelAuthorizationGranted: false,
    acpA2aAuthorizationGranted: false,
    locusIntegrationAuthorizationGranted: false,
    externalHarnessAuthorizationGranted: false,
    backendApiServerAuthorizationGranted: false,
    databaseStorageAuthorizationGranted: false,
    connectorGrantAuthorizationGranted: false,
    approvalDecisionProduced: false,
    approvalGrantProduced: false,
    authorizesRuntime: false
  };
}

function agentModeProfileSkillhubCapabilityBoundaryMapFalseRuntimeFields() {
  return Object.fromEntries(
    AGENT_MODE_PROFILE_SKILLHUB_CAPABILITY_UNSAFE_FIELDS.map((field) => [
      field,
      false
    ])
  );
}

function agentModeProfileSkillhubCapabilityBoundaryMapNotes() {
  return {
    currentAuthorization:
      "Requires a future explicit authorization phase before any runtime, driver, tool, skill, inventory, gateway, scheduler, terminal backend, model-routing, fusion, judge, ACP/A2A, Locus, external harness, backend/API/server, storage, Fabric, Secure Drop, encoded handoff, telemetry, health-check, infrastructure, filesystem, process, UI, or command behavior.",
    operatorVisibility:
      "Future implementation must expose visible sessions, capability status, active profile, active skills, inventories, permissions, approvals, cancellations, audit trail, and blocked-deny reasons before runtime.",
    continuity:
      "Future implementation must keep main orchestrator state, background subagent status, front-desk responses, user interruptions, and result handoff distinct and visible.",
    profile:
      "Future profiles for planner, implementer, reviewer, security auditor, tester, browser operator, desktop operator, front desk, coordinator, and specialized harness roles require explicit contracts before any loader.",
    promptSkill:
      "Future prompt/context-to-skill matching must be deterministic, auditable, context-file bound, and recorded as explicit skill activation metadata before any skill auto-load.",
    inventory:
      "Future inventory must visibly list installed skills, MCP servers, plugins, providers, tools, toolsets, trust levels, permissions, source, version, and provenance before any runtime registry or scanner.",
    securityScan:
      "Future install or enablement flows require source provenance, version pinning, permission manifests, rollback, trust level, and optional security-scan contracts before any scanner runtime.",
    frontDesk:
      "Future front-desk fallback may answer only within an explicit orchestrator-busy scope and must escalate and hand back to the main orchestrator.",
    modelRouting:
      "Future model routing, provider switching, diffusion, Sakana-style multi-candidate generation, fusion, and judge flows require candidate, merge, evaluation, budget, and audit contracts before runtime.",
    gateway:
      "Future gateway/platform bridges require pairing, allowed-user, platform-status, delivery, cancellation, and security contracts before any messaging runtime.",
    memoryContext:
      "Future memory, user-profile, context-file, and durable-memory behavior must define ownership, privacy, loading scope, retention, audit, and deletion boundaries before runtime.",
    cua:
      "CUA driver remains an external architecture reference only; future use would require permission, sandbox, audit, session approval, deny path, user confirmation, OS requirement checks, telemetry opt-in, and version/provenance contracts.",
    locus:
      "Locus may later own UI/control-surface visibility only after a Locus contract; Ardyn creates no Locus integration or UI.",
    multiverse:
      "Multiverse may later expose visible sessions or task/capability status only after Multiverse-owned task and UI contracts; Ardyn executes no task.",
    fabric:
      "Content Fabric remains a future external handoff/reference layer only; Ardyn creates no Fabric bus, websocket/http transport, MCP/task runtime, Secure Drop runtime, codec, translator, or external sink.",
    noConsumerRole:
      "No current runtime role; future consumers may inspect metadata only."
  };
}

function agentModeProfileSkillhubCapabilityBoundaryMapDefinition(definition) {
  const notes = agentModeProfileSkillhubCapabilityBoundaryMapNotes();

  return {
    ...definition,
    allowedCurrentBehavior: [
      `Describe future ${definition.subject} capability boundary metadata.`,
      "Keep current behavior review-only, metadata-only, non-authorizing, and runtime-blocked."
    ],
    forbiddenCurrentBehavior:
      agentModeProfileSkillhubCapabilityBoundaryMapForbiddenBehavior(),
    requiredFutureContractBeforeImplementation:
      `A future ${definition.subject} contract must define ownership, permissions, operator visibility, deny paths, approvals, audit trail, inventory/provenance, context/memory boundaries, and explicit no-runtime defaults before implementation.`,
    requiredFutureAuthorizationPhaseBeforeRuntime: notes.currentAuthorization,
    operatorVisibilityExpectation:
      definition.operatorVisibilityExpectation ?? notes.operatorVisibility,
    humanConversationContinuityExpectation:
      definition.humanConversationContinuityExpectation ?? notes.continuity,
    profilePersonalitySessionExpectation:
      definition.profilePersonalitySessionExpectation ?? notes.profile,
    promptToSkillMatchingExpectation:
      definition.promptToSkillMatchingExpectation ?? notes.promptSkill,
    skillPluginMcpProviderInventoryExpectation:
      definition.skillPluginMcpProviderInventoryExpectation ?? notes.inventory,
    securityScanExpectation:
      definition.securityScanExpectation ?? notes.securityScan,
    frontDeskFallbackExpectation:
      definition.frontDeskFallbackExpectation ?? notes.frontDesk,
    modelRoutingExpectation:
      definition.modelRoutingExpectation ?? notes.modelRouting,
    gatewayPlatformExpectation:
      definition.gatewayPlatformExpectation ?? notes.gateway,
    memoryContextExpectation:
      definition.memoryContextExpectation ?? notes.memoryContext,
    cuaDriverRoleDescription:
      definition.cuaDriverRoleDescription ?? notes.cua,
    locusRoleDescription: definition.locusRoleDescription ?? notes.locus,
    multiverseRoleDescription:
      definition.multiverseRoleDescription ?? notes.multiverse,
    fabricRoleDescription: definition.fabricRoleDescription ?? notes.fabric
  };
}

function agentModeProfileSkillhubCapabilityBoundaryMapDefinitions() {
  const notes = agentModeProfileSkillhubCapabilityBoundaryMapNotes();
  const rows = [
    [
      "phase5-68.ardyn.harness_wrapper_agent_modes.agent_mode_boundary",
      "agent_mode_contract",
      "ardyn",
      "future_contract_required",
      "harness-wrapper agent mode"
    ],
    [
      "phase5-68.ardyn.profile_contracts.profile_boundary",
      "profile_contract",
      "ardyn",
      "future_contract_required",
      "agent and subagent profile"
    ],
    [
      "phase5-68.ardyn.personality_session_contracts.personality_session_boundary",
      "personality_session_contract",
      "ardyn",
      "future_contract_required",
      "personality and session state"
    ],
    [
      "phase5-68.ardyn_subagent.background_workstreams.subagent_background_boundary",
      "subagent_background_contract",
      "ardyn-subagent",
      "future_contract_required",
      "background subagent and isolated parallel workstream"
    ],
    [
      "phase5-68.ardyn_subagent.conversation_while_working.conversation_continuity_boundary",
      "conversation_continuity_contract",
      "ardyn-subagent",
      "future_contract_required",
      "conversation continuity while background work is happening"
    ],
    [
      "phase5-68.ardyn.front_desk_lightweight_model.front_desk_model_boundary",
      "front_desk_model_contract",
      "ardyn",
      "future_contract_required",
      "front-desk lightweight model"
    ],
    [
      "phase5-68.hermes_reference.computer_use_category.computer_use_boundary",
      "computer_use_contract",
      "hermes-reference",
      "metadata_only",
      "Hermes-style computer-use category reference"
    ],
    [
      "phase5-68.cua_driver_reference.driver_role.cua_driver_boundary",
      "cua_driver_contract",
      "cua-driver-reference",
      "metadata_only",
      "CUA-driver computer-use boundary"
    ],
    [
      "phase5-68.cua_driver_reference.mcp_stdio_invocation.cua_driver_mcp_stdio_boundary",
      "cua_driver_mcp_stdio_contract",
      "cua-driver-reference",
      "blocked",
      "stdio MCP driver invocation"
    ],
    [
      "phase5-68.cua_driver_reference.manifest_invocation_discovery.cua_driver_manifest_boundary",
      "cua_driver_manifest_contract",
      "cua-driver-reference",
      "blocked",
      "CUA driver manifest and invocation discovery"
    ],
    [
      "phase5-68.cua_driver_reference.doctor_requirements_check.computer_use_doctor_boundary",
      "computer_use_doctor_contract",
      "cua-driver-reference",
      "blocked",
      "computer-use doctor and requirements check"
    ],
    [
      "phase5-68.cua_driver_reference.desktop_control.desktop_control_boundary",
      "desktop_control_contract",
      "cua-driver-reference",
      "blocked",
      "desktop control driver"
    ],
    [
      "phase5-68.external_harness.browser_control.browser_control_boundary",
      "browser_control_contract",
      "external-harness",
      "blocked",
      "browser control driver"
    ],
    [
      "phase5-68.cua_driver_reference.screenshot_capture.screenshot_capture_boundary",
      "screenshot_capture_contract",
      "cua-driver-reference",
      "blocked",
      "screenshot and capture"
    ],
    [
      "phase5-68.cua_driver_reference.accessibility_tree.accessibility_tree_boundary",
      "accessibility_tree_contract",
      "cua-driver-reference",
      "blocked",
      "accessibility tree access"
    ],
    [
      "phase5-68.cua_driver_reference.som_index.som_index_boundary",
      "som_index_contract",
      "cua-driver-reference",
      "blocked",
      "UI element and SOM index"
    ],
    [
      "phase5-68.ardyn.safe_read_only_actions.safe_action_boundary",
      "safe_action_contract",
      "ardyn",
      "future_contract_required",
      "safe read-only action taxonomy"
    ],
    [
      "phase5-68.ardyn.mutating_action_approval.mutating_action_approval_boundary",
      "mutating_action_approval_contract",
      "ardyn",
      "future_contract_required",
      "approval-gated mutating action"
    ],
    [
      "phase5-68.ardyn.blocked_destructive_key_combo.blocked_key_combo_boundary",
      "blocked_key_combo_contract",
      "ardyn",
      "future_contract_required",
      "hard-blocked destructive key combo"
    ],
    [
      "phase5-68.ardyn.dangerous_typed_command_blocking.dangerous_type_pattern_boundary",
      "dangerous_type_pattern_contract",
      "ardyn",
      "future_contract_required",
      "dangerous typed-command blocking"
    ],
    [
      "phase5-68.ardyn.multimodal_tool_return.multimodal_tool_return_boundary",
      "multimodal_tool_return_contract",
      "ardyn",
      "future_contract_required",
      "multimodal computer-use return"
    ],
    [
      "phase5-68.cua_driver_reference.telemetry_opt_in.telemetry_opt_in_boundary",
      "telemetry_opt_in_contract",
      "cua-driver-reference",
      "blocked",
      "driver telemetry opt-in or disable"
    ],
    [
      "phase5-68.cua_driver_reference.driver_update_provenance.driver_update_provenance_boundary",
      "driver_update_provenance_contract",
      "cua-driver-reference",
      "blocked",
      "driver update, version, and provenance"
    ],
    [
      "phase5-68.ardyn.terminal_backend_tooling.terminal_backend_boundary",
      "terminal_backend_contract",
      "ardyn",
      "future_contract_required",
      "terminal backend"
    ],
    [
      "phase5-68.ardyn.toolsets.toolset_boundary",
      "toolset_contract",
      "ardyn",
      "future_contract_required",
      "terminal and harness toolset"
    ],
    [
      "phase5-68.ardyn.skill_loading.skill_loading_boundary",
      "skill_loading_contract",
      "ardyn",
      "future_contract_required",
      "prompt/context-to-skill loading"
    ],
    [
      "phase5-68.external_harness.skillhub_one_click_install.skillhub_install_boundary",
      "skillhub_install_contract",
      "external-harness",
      "future_contract_required",
      "Skills Hub one-click install"
    ],
    [
      "phase5-68.ardyn.skill_security_scan.skill_security_scan_boundary",
      "skill_security_scan_contract",
      "ardyn",
      "future_contract_required",
      "optional security scan for skill, plugin, and MCP installs"
    ],
    [
      "phase5-68.ardyn.visible_skill_inventory.skill_inventory_boundary",
      "skill_inventory_contract",
      "ardyn",
      "future_contract_required",
      "visible skill inventory"
    ],
    [
      "phase5-68.ardyn.visible_mcp_inventory.mcp_inventory_boundary",
      "mcp_inventory_contract",
      "ardyn",
      "future_contract_required",
      "visible MCP inventory"
    ],
    [
      "phase5-68.ardyn.visible_plugin_inventory.plugin_inventory_boundary",
      "plugin_inventory_contract",
      "ardyn",
      "future_contract_required",
      "visible plugin inventory"
    ],
    [
      "phase5-68.ardyn.visible_provider_inventory.provider_inventory_boundary",
      "provider_inventory_contract",
      "ardyn",
      "future_contract_required",
      "visible provider inventory"
    ],
    [
      "phase5-68.ardyn.tool_adapter_visibility.tool_adapter_visibility_boundary",
      "tool_adapter_visibility_contract",
      "ardyn",
      "future_contract_required",
      "tool adapter and tool provider visibility"
    ],
    [
      "phase5-68.repo_family.gateway_messaging_platforms.gateway_messaging_boundary",
      "gateway_messaging_contract",
      "repo-family",
      "future_contract_required",
      "gateway and messaging-platform bridge"
    ],
    [
      "phase5-68.ardyn.scheduled_automation_cron.scheduled_automation_boundary",
      "scheduled_automation_contract",
      "ardyn",
      "future_contract_required",
      "scheduled automation and cron"
    ],
    [
      "phase5-68.ardyn.context_files.context_file_boundary",
      "context_file_contract",
      "ardyn",
      "future_contract_required",
      "context-file loading"
    ],
    [
      "phase5-68.ardyn.memory_profile.durable_memory_profile_boundary",
      "memory_profile_contract",
      "ardyn",
      "future_contract_required",
      "memory, user-profile, and durable context"
    ],
    [
      "phase5-68.external_harness.acp_adapter_registry.acp_adapter_registry_boundary",
      "acp_adapter_registry_contract",
      "external-harness",
      "future_contract_required",
      "ACP-style adapter and registry"
    ],
    [
      "phase5-68.external_harness.a2a_handoff.a2a_handoff_boundary",
      "a2a_handoff_contract",
      "external-harness",
      "future_contract_required",
      "A2A-style handoff"
    ],
    [
      "phase5-68.ardyn_subagent.diffusion_multi_candidate.diffusion_mode_boundary",
      "diffusion_mode_contract",
      "ardyn-subagent",
      "future_contract_required",
      "diffusion multi-candidate mode"
    ],
    [
      "phase5-68.ardyn_subagent.sakana_style_multi_candidate.sakana_style_mode_boundary",
      "sakana_style_mode_contract",
      "ardyn-subagent",
      "future_contract_required",
      "Sakana-style multi-candidate mode"
    ],
    [
      "phase5-68.ardyn_subagent.fusion_judge_orchestrator.fusion_judge_mode_boundary",
      "fusion_judge_mode_contract",
      "ardyn-subagent",
      "future_contract_required",
      "fusion, judge, and orchestrator mode"
    ],
    [
      "phase5-68.ardyn.prompt_skill_resolution.prompt_skill_resolution_boundary",
      "prompt_skill_resolution_contract",
      "ardyn",
      "future_contract_required",
      "prompt/context to skill resolution"
    ],
    [
      "phase5-68.ardyn.control_plane_state_visibility.control_plane_visibility_boundary",
      "control_plane_visibility_contract",
      "ardyn",
      "future_contract_required",
      "control-plane state and runtime capability matrix"
    ],
    [
      "phase5-68.locus.harness_control_surface.control_plane_visibility_boundary",
      "control_plane_visibility_contract",
      "locus",
      "future_contract_required",
      "Locus-mediated harness bridge and UI control surface"
    ],
    [
      "phase5-68.multiverse.visible_sessions.control_plane_visibility_boundary",
      "control_plane_visibility_contract",
      "multiverse",
      "future_contract_required",
      "visible sessions and task graph for Multiverse consumers"
    ],
    [
      "phase5-68.content_fabric.external_harness_handoff.tool_adapter_visibility_boundary",
      "tool_adapter_visibility_contract",
      "content-fabric",
      "future_contract_required",
      "external harness and Fabric/API/backend encoded handoff contract"
    ]
  ];

  return rows.map(
    ([boundaryId, boundaryFamily, relatedSystem, currentStatus, subject]) =>
      agentModeProfileSkillhubCapabilityBoundaryMapDefinition({
        boundaryId,
        boundaryFamily,
        relatedSystem,
        currentStatus,
        subject,
        cuaDriverRoleDescription:
          relatedSystem === "cua-driver-reference" ||
          boundaryFamily.includes("computer_use") ||
          boundaryFamily.includes("desktop_control") ||
          boundaryFamily.includes("browser_control") ||
          boundaryFamily.includes("screenshot") ||
          boundaryFamily.includes("accessibility") ||
          boundaryFamily.includes("som")
            ? `${notes.cua} Windows UI Automation/SendInput, Linux X11/Wayland/AT-SPI accessibility tree, and macOS accessibility/private-API requirements are metadata-only notes.`
            : notes.cua,
        locusRoleDescription:
          relatedSystem === "locus"
            ? "Locus may later own the operator UI/control surface for this boundary after a separate Locus contract; Ardyn creates no UI or Locus integration."
            : notes.locus,
        multiverseRoleDescription:
          relatedSystem === "multiverse"
            ? "Multiverse may later display visible sessions or task graph metadata after a separate Multiverse contract; Ardyn executes no task."
            : notes.multiverse,
        fabricRoleDescription:
          relatedSystem === "content-fabric"
            ? "Content Fabric may later own external handoff and API/backend bridge metadata after a separate Fabric contract; Ardyn creates no Fabric, Secure Drop, transport, codec, or backend runtime."
            : notes.fabric
      })
  );
}

function agentModeProfileSkillhubCapabilityBoundaryMapEntry(definition) {
  return {
    ...definition,
    futureCuaDriverComputerUseActions: [
      ...AGENT_MODE_PROFILE_SKILLHUB_CUA_DRIVER_COMPUTER_USE_ACTIONS
    ],
    architectureReferencePolicy: {
      hermesReferenceOnly: true,
      cuaDriverReferenceOnly: true,
      fainirPromptGuideCategoryOnly: true,
      importsHermes: false,
      vendorsHermes: false,
      executesCuaDriver: false,
      installsCuaDriver: false,
      importsPromptGuide: false,
      authorizesRuntime: false
    },
    agentModeProfileSkillhubCapabilityBoundaryMetadataOnly: true,
    noLiveAgentModeProfileSkillhubCapabilityRuntimePerformed: true,
    explicitBlockedAuthorizationFlags:
      agentModeProfileSkillhubCapabilityBoundaryMapAuthorizationFlags(),
    unsafeAgentModeCapabilityRuntimeFlags:
      agentModeProfileSkillhubCapabilityBoundaryMapFalseRuntimeFields(),
    nonAuthorizingProof: true,
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

function agentModeProfileSkillhubCapabilityBoundaryMapEntries() {
  return agentModeProfileSkillhubCapabilityBoundaryMapDefinitions().map(
    agentModeProfileSkillhubCapabilityBoundaryMapEntry
  );
}

function agentModeProfileSkillhubCapabilityBoundaryMapSummary(entries) {
  const countByFamily = Object.fromEntries(
    AGENT_MODE_PROFILE_SKILLHUB_CAPABILITY_BOUNDARY_FAMILIES.map((family) => [
      family,
      entries.filter((entry) => entry.boundaryFamily === family).length
    ])
  );
  const countByRelatedSystem = Object.fromEntries(
    AGENT_MODE_PROFILE_SKILLHUB_CAPABILITY_RELATED_SYSTEMS.map((system) => [
      system,
      entries.filter((entry) => entry.relatedSystem === system).length
    ])
  );
  const allBlockedAuthorizationFlagsFalse = entries.every((entry) =>
    Object.values(entry.explicitBlockedAuthorizationFlags).every(
      (value) => value === false
    )
  );
  const allUnsafeAgentModeCapabilityRuntimeFlagsFalse = entries.every((entry) =>
    Object.values(entry.unsafeAgentModeCapabilityRuntimeFlags).every(
      (value) => value === false
    )
  );
  const allRuntimeEffectsFalse = entries.every((entry) =>
    Object.values(entry.runtimeEffect).every((value) => value === false)
  );

  return {
    boundaryMapKind: AGENT_MODE_PROFILE_SKILLHUB_CAPABILITY_BOUNDARY_MAP_KIND,
    boundaryEntryCount: entries.length,
    countByFamily,
    countByRelatedSystem,
    boundaryFamilies: [
      ...AGENT_MODE_PROFILE_SKILLHUB_CAPABILITY_BOUNDARY_FAMILIES
    ],
    relatedSystems: [
      ...AGENT_MODE_PROFILE_SKILLHUB_CAPABILITY_RELATED_SYSTEMS
    ],
    currentStatusValues: [
      ...AGENT_MODE_PROFILE_SKILLHUB_CAPABILITY_STATUSES
    ],
    futureCuaDriverComputerUseActions: [
      ...AGENT_MODE_PROFILE_SKILLHUB_CUA_DRIVER_COMPUTER_USE_ACTIONS
    ],
    hermesReferenceOnly: true,
    cuaDriverReferenceOnly: true,
    fainirPromptGuideCategoryOnly: true,
    noHermesInstallVendorCopyImportMigrationIntegration: true,
    noCuaDriverInstallExecutionMcpStdioManifestDiscoveryBackendStartToolDispatchUpdate:
      true,
    noComputerUseRuntime: true,
    noDesktopControl: true,
    noBrowserControl: true,
    noScreenshotCaptureRuntime: true,
    noOcrRuntime: true,
    noAccessibilityTreeRuntime: true,
    noSomIndexRuntime: true,
    noOsWindowEnumeration: true,
    noInputAutomationRuntime: true,
    noActionApprovalRuntime: true,
    noBackgroundSubagentRuntime: true,
    noProfilePersonalitySessionContextSkillLoaderRuntime: true,
    noSkillhubInstallRuntime: true,
    noSecurityScannerRuntime: true,
    noMcpPluginProviderToolInventoryScannerRuntime: true,
    noGatewayMessagingRuntime: true,
    noScheduledAutomationRuntime: true,
    noTerminalBackendRuntime: true,
    noModelRouterFusionJudgeFrontDeskRuntime: true,
    noAcpA2aRuntime: true,
    noLocusIntegration: true,
    noExternalHarnessIntegration: true,
    noBackendApiServerStorageCacheRlsMigrationRuntime: true,
    noFabricWebsocketHttpMcpTaskRuntime: true,
    noSecureDropRuntime: true,
    noEncodedHandoffRuntime: true,
    noLoggerAuditTelemetryHealthInfrastructureRuntime: true,
    noCommandExposure: true,
    noBlockedCliBypass: true,
    allBlockedAuthorizationFlagsFalse,
    allUnsafeAgentModeCapabilityRuntimeFlagsFalse,
    allRuntimeEffectsFalse,
    allEntriesNonAuthorizing: entries.every(
      (entry) => entry.nonAuthorizingProof === true
    )
  };
}

function agentModeProfileSkillhubCapabilityBoundaryMapValidationRules() {
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
    enabledCuaDriverRuntimeFailClosed: true,
    enabledCuaDriverBinaryExecutionFailClosed: true,
    enabledCuaDriverInstallUpdateCommandFailClosed: true,
    enabledCuaDriverMcpStdioInvocationFailClosed: true,
    enabledCuaDriverManifestDiscoveryRuntimeFailClosed: true,
    enabledComputerUseRuntimeFailClosed: true,
    enabledDesktopBrowserScreenshotOcrAccessibilitySomInputRuntimeFailClosed:
      true,
    enabledAlwaysApproveOrSessionApproveFailClosed: true,
    enabledTelemetryOptInFailClosed: true,
    enabledBackgroundSubagentRuntimeFailClosed: true,
    enabledProfilePersonalitySessionContextSkillLoaderFailClosed: true,
    enabledSkillhubInstallSecurityScanRuntimeFailClosed: true,
    enabledMcpPluginProviderToolInventoryScannerFailClosed: true,
    enabledGatewayScheduledTerminalRuntimeFailClosed: true,
    enabledModelRouterFusionJudgeFrontDeskRuntimeFailClosed: true,
    enabledAcpA2aLocusExternalHarnessRuntimeFailClosed: true,
    hiddenCuaDriverExecutionSemanticsFailClosed: true,
    hiddenComputerUseSemanticsFailClosed: true,
    hiddenInputAutomationSemanticsFailClosed: true,
    hiddenActionApprovalSemanticsFailClosed: true,
    hiddenMultimodalReturnSemanticsFailClosed: true,
    hiddenTelemetryDriverUpdateSemanticsFailClosed: true,
    hiddenBackgroundSubagentExecutionSemanticsFailClosed: true,
    hiddenConversationConcurrencySemanticsFailClosed: true,
    hiddenProfilePersonalitySessionContextLoadingSemanticsFailClosed: true,
    hiddenSkillLoadingInstallScanInventorySemanticsFailClosed: true,
    hiddenGatewayScheduledTerminalSemanticsFailClosed: true,
    hiddenModelRoutingFusionJudgeFrontDeskSemanticsFailClosed: true,
    hiddenAcpA2aAdapterRegistrySemanticsFailClosed: true,
    hiddenBackendApiServerStorageAuthConnectorSemanticsFailClosed: true,
    hiddenFabricSecureDropEncodedHandoffRuntimeSemanticsFailClosed: true,
    hiddenLoggerAuditTelemetryHealthInfrastructureSemanticsFailClosed: true,
    nestedUnsafeFlagsFailClosed: true,
    noncanonicalBoundaryEntriesFailClosed: true,
    validationRunsRuntime: false,
    validationRunsComputerUse: false,
    validationRunsSkillInstall: false,
    validationRunsBackgroundWorker: false,
    validationRunsModelRouter: false
  };
}

function agentModeProfileSkillhubCapabilityBoundaryMapGaps() {
  return [
    "Future Hermes/CUA-inspired categories still need explicit contracts for action taxonomy, OS requirements, permissions, sandboxing, session approval, deny paths, audit, and user confirmation before any driver runtime.",
    "Future background-subagent, visible-session, front-desk, and conversation-continuity behavior still needs cancellability, interruptibility, result handoff, status, and control-plane contracts.",
    "Future profile/personality/session, context-file, skill loading, SkillHub install, scanner, and inventory behavior still needs deterministic activation, provenance, trust, rollback, permission, and audit contracts.",
    "Future model routing, diffusion, Sakana-style multi-candidate generation, fusion, and judge orchestration still needs budget, candidate, synthesis, evaluation, and artifact-trail contracts.",
    "Future Locus, Multiverse, Content Fabric, ACP/A2A, gateway, terminal backend, backend/API/server, storage, Fabric, Secure Drop, encoded handoff, telemetry, health-check, infrastructure, filesystem, process, and UI behavior remains blocked."
  ];
}

function agentModeProfileSkillhubCapabilityBoundaryMapState(reviewedAt) {
  const boundaryEntries =
    agentModeProfileSkillhubCapabilityBoundaryMapEntries();

  return {
    schema: AGENT_MODE_PROFILE_SKILLHUB_CAPABILITY_BOUNDARY_MAP_STATE_SCHEMA,
    schemaVersion: AGENT_MODE_PROFILE_SKILLHUB_CAPABILITY_BOUNDARY_MAP_VERSION,
    stateKind: AGENT_MODE_PROFILE_SKILLHUB_CAPABILITY_BOUNDARY_MAP_KIND,
    stateMode: "review-only",
    reviewedAt,
    sourcePhaseContext: {
      phase567InfrastructureComplianceDataRetentionBoundary:
        "tests/fixtures/host-policy/phase5-67/infrastructure-compliance-data-retention-contract-boundary-map.json",
      referenceRepoHermesAgent: "NousResearch/hermes-agent",
      referenceHermesCuaBackend:
        "tools/computer_use/cua_backend.py architecture reference only",
      referenceHermesCuaTool:
        "tools/computer_use/tool.py architecture reference only",
      referencePromptGuide:
        "fainir/most-capable-agent-system-prompt category guide only",
      hermesReferenceOnly: true,
      cuaDriverReferenceOnly: true,
      promptGuideCategoryOnly: true,
      externalCodeImported: false,
      externalCodeVendored: false,
      externalRepoModified: false,
      runtimeStillBlocked: true
    },
    boundaryEntries,
    boundaryMapSummary:
      agentModeProfileSkillhubCapabilityBoundaryMapSummary(boundaryEntries),
    invalidBoundaryCasePolicy:
      agentModeProfileSkillhubCapabilityBoundaryMapValidationRules(),
    topHermesCuaAgentModeProfileSkillhubTestingQualityGatesFabricApiBackendGaps:
      agentModeProfileSkillhubCapabilityBoundaryMapGaps(),
    recommendedNextPhase:
      "phase-5.69-review-only-testing-frameworks-quality-gates-contract-boundary-map",
    agentModeProfileSkillhubCapabilityBoundaryMapOnly: true,
    reviewOnly: true,
    metadataOnly: true,
    authoritative: false,
    nonAuthorizingProof: true,
    reportRunsChecks: false,
    ...agentModeProfileSkillhubCapabilityBoundaryMapFalseRuntimeFields(),
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

function agentModeProfileSkillhubCapabilityBoundaryMapResult({
  reviewedAt,
  reviewedAtDefaulted,
  classification,
  accepted,
  agentModeProfileSkillhubCapabilityBoundaryMap
}) {
  return {
    schema: AGENT_MODE_PROFILE_SKILLHUB_CAPABILITY_BOUNDARY_MAP_SCHEMA,
    schemaVersion: AGENT_MODE_PROFILE_SKILLHUB_CAPABILITY_BOUNDARY_MAP_VERSION,
    agentModeProfileSkillhubCapabilityBoundaryMapKind:
      AGENT_MODE_PROFILE_SKILLHUB_CAPABILITY_BOUNDARY_MAP_KIND,
    agentModeProfileSkillhubCapabilityBoundaryMapMode: "review-only",
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    agentModeProfileSkillhubCapabilityBoundaryMapProduced: accepted,
    agentModeProfileSkillhubCapabilityBoundaryMap,
    boundaryMapSummary: accepted
      ? agentModeProfileSkillhubCapabilityBoundaryMap.boundaryMapSummary
      : null,
    boundaryEntries: accepted
      ? agentModeProfileSkillhubCapabilityBoundaryMap.boundaryEntries
      : [],
    invalidBoundaryCasePolicy: accepted
      ? agentModeProfileSkillhubCapabilityBoundaryMap.invalidBoundaryCasePolicy
      : agentModeProfileSkillhubCapabilityBoundaryMapValidationRules(),
    topHermesCuaAgentModeProfileSkillhubTestingQualityGatesFabricApiBackendGaps:
      accepted
        ? agentModeProfileSkillhubCapabilityBoundaryMap
            .topHermesCuaAgentModeProfileSkillhubTestingQualityGatesFabricApiBackendGaps
        : [],
    recommendedNextPhase: accepted
      ? agentModeProfileSkillhubCapabilityBoundaryMap.recommendedNextPhase
      : null,
    agentModeProfileSkillhubCapabilityBoundaryMapOnly: true,
    reviewOnly: true,
    metadataOnly: true,
    authoritative: false,
    nonAuthorizingProof: true,
    reportRunsChecks: false,
    ...agentModeProfileSkillhubCapabilityBoundaryMapFalseRuntimeFields(),
    rejectionReasons: accepted
      ? []
      : [
          {
            classification,
            rejected: true,
            runtimeAuthorized: false,
            computerUseAuthorized: false,
            cuaDriverAuthorized: false,
            skillhubInstallAuthorized: false,
            modelRoutingAuthorized: false,
            fusionJudgeAuthorized: false,
            commandExposureAuthorized: false,
            reportRunsChecks: false
          }
        ],
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

export function createAgentModeProfileSkillhubCapabilityBoundaryMapForReview(
  input = {}
) {
  const inputRecord =
    agentModeProfileSkillhubCapabilityBoundaryMapInputRecord(input);
  const reviewedAt =
    agentModeProfileSkillhubCapabilityBoundaryMapReviewedAt(inputRecord);
  const reviewedAtDefaulted = isReviewedAtDefaulted(inputRecord);
  const classification =
    agentModeProfileSkillhubCapabilityBoundaryMapInputClassification(
      inputRecord
    );
  const accepted =
    classification ===
    VALID_AGENT_MODE_PROFILE_SKILLHUB_CAPABILITY_BOUNDARY_MAP_CLASSIFICATION;
  const agentModeProfileSkillhubCapabilityBoundaryMap = accepted
    ? agentModeProfileSkillhubCapabilityBoundaryMapState(reviewedAt)
    : null;

  return agentModeProfileSkillhubCapabilityBoundaryMapResult({
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    accepted,
    agentModeProfileSkillhubCapabilityBoundaryMap
  });
}

const TESTING_FRAMEWORKS_QUALITY_GATES_CONTRACT_BOUNDARY_MAP_STATE_SCHEMA =
  "ardyn.phase-5.69.testing-frameworks-quality-gates-contract-boundary-map-state";
const VALID_TESTING_FRAMEWORKS_QUALITY_GATES_CONTRACT_BOUNDARY_MAP_CLASSIFICATION =
  "valid_testing_frameworks_quality_gates_contract_boundary_map_runtime_still_blocked";
const MALFORMED_TESTING_FRAMEWORKS_QUALITY_GATES_CONTRACT_BOUNDARY_MAP_CLASSIFICATION =
  "malformed_testing_frameworks_quality_gates_contract_boundary_map_input_rejected";

const TESTING_FRAMEWORKS_QUALITY_GATES_BOUNDARY_FAMILIES = Object.freeze([
  "unit_test_contract",
  "schema_test_contract",
  "integration_test_contract",
  "e2e_test_contract",
  "regression_gate_contract",
  "stress_test_contract",
  "chaos_test_contract",
  "security_test_contract",
  "dependency_audit_contract",
  "static_analysis_contract",
  "fixture_conformance_contract",
  "runtime_blocked_gate_contract",
  "computer_use_test_contract",
  "agent_mode_test_contract",
  "model_eval_contract",
  "quality_gate_contract",
  "release_blocker_contract",
  "ci_gate_contract"
]);
const TESTING_FRAMEWORKS_QUALITY_GATES_RELATED_SYSTEMS = Object.freeze([
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
const TESTING_FRAMEWORKS_QUALITY_GATES_STATUSES = Object.freeze([
  "metadata_only",
  "covered_by_existing_validation",
  "blocked",
  "future_contract_required"
]);
const TESTING_FRAMEWORKS_QUALITY_GATES_REQUIRED_FIELDS = Object.freeze([
  "boundaryId",
  "boundaryFamily",
  "relatedSystem",
  "currentStatus",
  "allowedCurrentBehavior",
  "forbiddenCurrentBehavior",
  "requiredFutureContractBeforeImplementation",
  "requiredFutureAuthorizationPhaseBeforeRuntime",
  "qualityGateExpectation",
  "failureBlockerExpectation",
  "fixtureEvidenceExpectation",
  "ciReleaseExpectation",
  "securityStaticAnalysisExpectation",
  "modelEvalExpectation",
  "locusRoleDescription",
  "multiverseRoleDescription",
  "fabricRoleDescription",
  "explicitBlockedAuthorizationFlags",
  "unsafeTestingQualityGateRuntimeFlags",
  "nonAuthorizingProof"
]);
const TESTING_FRAMEWORKS_QUALITY_GATES_ALLOWED_TOP_LEVEL_FIELDS =
  Object.freeze(["reviewedAt", "boundaryEntries"]);
const TESTING_FRAMEWORKS_QUALITY_GATES_UNSAFE_FIELDS = Object.freeze([
  "runtimeExecutionEnabled",
  "runtimeAuthorizationEnabled",
  "runtimeCommandEnabled",
  "commandExposureEnabled",
  "commandRuntimeControlEnabled",
  "connectorGrantProduced",
  "fabricRuntimeImplementedByArdyn",
  "websocketHttpTransportImplementedByArdyn",
  "mcpToolExposureEnabled",
  "taskExecutionEnabled",
  "secureDropImplemented",
  "serviceDiscoveryEnabled",
  "scheduleEnforcementEnabled",
  "filesystemWriteEnabled",
  "filesystemScanningEnabled",
  "processControlEnabled",
  "testRunnerEnabled",
  "integrationTestRunnerEnabled",
  "e2eRunnerEnabled",
  "browserTestRunnerEnabled",
  "computerUseTestRunnerEnabled",
  "cuaDriverTestRuntimeEnabled",
  "chaosRunnerEnabled",
  "stressRunnerEnabled",
  "modelEvalRuntimeEnabled",
  "ciPipelineCreationEnabled",
  "releaseAutomationEnabled",
  "packageExportEnabled",
  "artifactUploadEnabled",
  "externalServiceTestEnabled",
  "liveDependencyUpdateEnabled",
  "patchAutomationEnabled",
  "runtimeTestHarnessEnabled",
  "browserControlEnabled",
  "computerUseRuntimeEnabled",
  "cuaDriverRuntimeEnabled",
  "cuaDriverBinaryExecutionEnabled",
  "cuaDriverMcpStdioInvocationEnabled",
  "cuaDriverManifestDiscoveryRuntimeEnabled",
  "desktopControlEnabled",
  "screenshotCaptureRuntimeEnabled",
  "ocrEnabled",
  "accessibilityTreeAccessEnabled",
  "somIndexRuntimeEnabled",
  "osWindowEnumerationEnabled",
  "inputAutomationRuntimeEnabled",
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
  "failoverRuntimeImplemented",
  "schedulerImplemented",
  "processSupervisorImplemented",
  "infrastructureAutomationImplemented",
  "deploymentAutomationImplemented",
  "complianceEnforcementImplemented",
  "piiProcessingImplemented",
  "retentionJobImplemented",
  "exportJobImplemented",
  "hermesRuntimeEnabled",
  "agentModeRuntimeEnabled",
  "profileLoaderEnabled",
  "skillLoaderEnabled",
  "skillhubInstallerEnabled",
  "securityScannerRuntimeEnabled",
  "backgroundSubagentRuntimeEnabled",
  "fusionRuntimeEnabled",
  "judgeRuntimeEnabled",
  "frontDeskModelRuntimeEnabled",
  "uiFrontendBrowserRenderingImplemented",
  "blockedCliBypassEnabled"
]);
const TESTING_FRAMEWORKS_QUALITY_GATES_AUTHORIZATION_FIELDS = Object.freeze([
  "runtimeAuthorized",
  "runtimeAuthorizationGranted",
  "authorizesRuntime",
  "testingRuntimeAuthorizationGranted",
  "testRunnerAuthorizationGranted",
  "integrationRunnerAuthorizationGranted",
  "e2eRunnerAuthorizationGranted",
  "browserTestAuthorizationGranted",
  "computerUseTestAuthorizationGranted",
  "cuaDriverTestAuthorizationGranted",
  "chaosStressAuthorizationGranted",
  "modelEvalAuthorizationGranted",
  "ciPipelineAuthorizationGranted",
  "releaseAutomationAuthorizationGranted",
  "artifactUploadAuthorizationGranted",
  "externalServiceTestAuthorizationGranted",
  "liveDependencyUpdateAuthorizationGranted",
  "patchAutomationAuthorizationGranted",
  "commandExposureAuthorizationGranted",
  "backendApiServerAuthorizationGranted",
  "databaseStorageAuthorizationGranted",
  "fabricRuntimeAuthorizationGranted",
  "secureDropAuthorizationGranted",
  "encodedHandoffRuntimeAuthorizationGranted",
  "agentModeRuntimeAuthorizationGranted",
  "approvalDecisionProduced",
  "approvalGrantProduced"
]);
const TESTING_FRAMEWORKS_QUALITY_GATES_COMMAND_FIELDS = Object.freeze([
  "commandExposureEnabled",
  "commandRuntimeControlEnabled",
  "commandsExposed",
  "exposesCommands",
  "runtimeCommandEnabled",
  "cliCommandExposed"
]);
const TESTING_FRAMEWORKS_QUALITY_GATES_BLOCKED_CLI_BYPASS_FIELDS =
  Object.freeze([
    "blockedCliBypassEnabled",
    "dryRunBypassesBlock",
    "serveRuntimeBypassEnabled",
    "bypassBlockedCommandBehavior",
    "blockedCommandOverride"
  ]);
const TESTING_FRAMEWORKS_QUALITY_GATES_HIDDEN_FIELD_GROUPS = Object.freeze([
  {
    classification:
      "hidden_test_harness_execution_semantics_testing_frameworks_quality_gates_contract_boundary_map_input_rejected",
    fields: [
      "testRunner",
      "integrationRunner",
      "e2eRunner",
      "browserTestRunner",
      "computerUseTestRunner",
      "chaosRunner",
      "stressRunner",
      "runtimeHarness",
      "testExecutionPlan",
      "playwrightConfig",
      "cypressConfig"
    ]
  },
  {
    classification:
      "hidden_ci_release_automation_semantics_testing_frameworks_quality_gates_contract_boundary_map_input_rejected",
    fields: [
      "ciPipeline",
      "githubActionsWorkflow",
      "releaseJob",
      "releaseAutomation",
      "artifactUpload",
      "packageExport",
      "publishCommand",
      "deployGate",
      "liveDependencyUpdate",
      "patchAutomation"
    ]
  },
  {
    classification:
      "hidden_browser_computer_use_cua_driver_execution_semantics_testing_frameworks_quality_gates_contract_boundary_map_input_rejected",
    fields: [
      "browserRunner",
      "browserAutomation",
      "computerUseRunner",
      "cuaDriverTest",
      "cuaDriverBinary",
      "desktopTest",
      "screenshotTest",
      "ocrTest",
      "accessibilityTreeTest",
      "inputAutomationTest"
    ]
  },
  {
    classification:
      "hidden_model_eval_training_finetuning_semantics_testing_frameworks_quality_gates_contract_boundary_map_input_rejected",
    fields: [
      "modelEvalRunner",
      "evalDataset",
      "trainingJob",
      "fineTuningJob",
      "finetuneJob",
      "modelWeights",
      "modelScorer",
      "refusalEvalRuntime"
    ]
  },
  {
    classification:
      "hidden_external_service_lookup_semantics_testing_frameworks_quality_gates_contract_boundary_map_input_rejected",
    fields: [
      "externalServiceTest",
      "vendorTestClient",
      "networkProbe",
      "webhookUrl",
      "saasEndpoint",
      "externalLookup"
    ]
  },
  {
    classification:
      "hidden_backend_api_server_semantics_testing_frameworks_quality_gates_contract_boundary_map_input_rejected",
    fields: [
      "backendApiMiddleware",
      "apiRequestHandler",
      "httpServer",
      "serverMiddleware",
      "httpEndpoint",
      "runtimeEndpoint"
    ]
  },
  {
    classification:
      "hidden_database_storage_cache_write_semantics_testing_frameworks_quality_gates_contract_boundary_map_input_rejected",
    fields: [
      "databaseUrl",
      "databaseDsn",
      "dbConnectionString",
      "storageAdapter",
      "cacheEngine",
      "writeQueue",
      "persistenceLayer",
      "filesystemWrite"
    ]
  },
  {
    classification:
      "hidden_auth_session_token_api_key_semantics_testing_frameworks_quality_gates_contract_boundary_map_input_rejected",
    fields: [
      "loginUrl",
      "sessionCookie",
      "sessionStore",
      "sessionToken",
      "apiKey",
      "oauthToken",
      "authHeader"
    ]
  },
  {
    classification:
      "hidden_connector_grant_semantics_testing_frameworks_quality_gates_contract_boundary_map_input_rejected",
    fields: [
      "connectorGrant",
      "connectorCredential",
      "connectorAccessToken",
      "connectorComplianceGrant"
    ]
  },
  {
    classification:
      "hidden_fabric_websocket_http_mcp_task_runtime_semantics_testing_frameworks_quality_gates_contract_boundary_map_input_rejected",
    fields: [
      "fabricBus",
      "websocketUrl",
      "httpTransport",
      "mcpServer",
      "mcpTool",
      "taskRunner",
      "taskQueue"
    ]
  },
  {
    classification:
      "hidden_secure_drop_implementation_semantics_testing_frameworks_quality_gates_contract_boundary_map_input_rejected",
    fields: [
      "secureDropKeyring",
      "secureDropCrypto",
      "secureDropTransport",
      "secureDropInbox",
      "secureDropFilePicker",
      "st3ggWrapper"
    ]
  },
  {
    classification:
      "hidden_encoded_handoff_codec_translator_stego_covert_channel_tokenizer_exploit_bypass_semantics_testing_frameworks_quality_gates_contract_boundary_map_input_rejected",
    fields: [
      "encodedHandoffRuntime",
      "codecRuntime",
      "translatorRuntime",
      "encoderRuntime",
      "decoderRuntime",
      "stegoChannel",
      "covertChannel",
      "tokenizerExploit",
      "bypassPayload"
    ]
  },
  {
    classification:
      "hidden_logger_audit_transcript_telemetry_external_sink_semantics_testing_frameworks_quality_gates_contract_boundary_map_input_rejected",
    fields: [
      "loggerRuntime",
      "auditWriter",
      "transcriptWriter",
      "telemetryClient",
      "externalSink",
      "logExporter"
    ]
  },
  {
    classification:
      "hidden_health_backup_restore_failover_scheduler_process_supervisor_semantics_testing_frameworks_quality_gates_contract_boundary_map_input_rejected",
    fields: [
      "healthChecker",
      "backupJob",
      "restoreJob",
      "failoverRuntime",
      "scheduler",
      "cronSchedule",
      "processSupervisor",
      "serviceDiscovery"
    ]
  },
  {
    classification:
      "hidden_infrastructure_deployment_compliance_pii_retention_export_semantics_testing_frameworks_quality_gates_contract_boundary_map_input_rejected",
    fields: [
      "terraformPlan",
      "deployCommand",
      "cloudProvider",
      "complianceEnforcer",
      "piiProcessor",
      "retentionScheduler",
      "exportJob",
      "policyEngine"
    ]
  },
  {
    classification:
      "hidden_agent_mode_profile_skillhub_background_subagent_fusion_front_desk_semantics_testing_frameworks_quality_gates_contract_boundary_map_input_rejected",
    fields: [
      "hermesRuntime",
      "agentModeRuntime",
      "profileLoader",
      "skillLoader",
      "skillhubInstaller",
      "backgroundSubagent",
      "fusionRuntime",
      "judgeRuntime",
      "frontDeskModel",
      "modelRouter"
    ]
  }
]);

function testingFrameworksQualityGatesBoundaryMapInputRecord(input) {
  return isPlainObjectRecord(input) ? input : null;
}

function testingFrameworksQualityGatesBoundaryMapReviewedAt(inputRecord) {
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

function testingFrameworksQualityGatesBoundaryMapContainsTrue(value) {
  if (value === true) {
    return true;
  }

  if (Array.isArray(value)) {
    return value.some(testingFrameworksQualityGatesBoundaryMapContainsTrue);
  }

  if (isPlainObjectRecord(value)) {
    return Object.values(value).some(
      testingFrameworksQualityGatesBoundaryMapContainsTrue
    );
  }

  return false;
}

function testingFrameworksQualityGatesBoundaryMapHasTrueFieldDeep(
  value,
  fields
) {
  if (Array.isArray(value)) {
    return value.some((item) =>
      testingFrameworksQualityGatesBoundaryMapHasTrueFieldDeep(item, fields)
    );
  }

  if (!isPlainObjectRecord(value)) {
    return false;
  }

  for (const [key, nested] of Object.entries(value)) {
    if (fields.includes(key) && nested === true) {
      return true;
    }

    if (
      testingFrameworksQualityGatesBoundaryMapHasTrueFieldDeep(nested, fields)
    ) {
      return true;
    }
  }

  return false;
}

function testingFrameworksQualityGatesBoundaryMapHasPresentFieldDeep(
  value,
  fields
) {
  if (Array.isArray(value)) {
    return value.some((item) =>
      testingFrameworksQualityGatesBoundaryMapHasPresentFieldDeep(item, fields)
    );
  }

  if (!isPlainObjectRecord(value)) {
    return false;
  }

  for (const [key, nested] of Object.entries(value)) {
    if (
      key === "explicitBlockedAuthorizationFlags" ||
      key === "unsafeTestingQualityGateRuntimeFlags"
    ) {
      continue;
    }

    if (fields.includes(key)) {
      return true;
    }

    if (
      testingFrameworksQualityGatesBoundaryMapHasPresentFieldDeep(
        nested,
        fields
      )
    ) {
      return true;
    }
  }

  return false;
}

function testingFrameworksQualityGatesBoundaryMapEntriesInput(inputRecord) {
  return Array.isArray(inputRecord?.boundaryEntries)
    ? inputRecord.boundaryEntries
    : null;
}

function testingFrameworksQualityGatesBoundaryMapMalformed(inputRecord) {
  return (
    inputRecord === null ||
    (Object.prototype.hasOwnProperty.call(inputRecord, "reviewedAt") &&
      !isUtcIsoTimestampWithMilliseconds(inputRecord.reviewedAt)) ||
    (Object.prototype.hasOwnProperty.call(inputRecord, "boundaryEntries") &&
      !Array.isArray(inputRecord.boundaryEntries))
  );
}

function testingFrameworksQualityGatesBoundaryMapEntryIssue(
  entries,
  predicate
) {
  return entries !== null && entries.some((entry) => predicate(entry));
}

function testingFrameworksQualityGatesBoundaryMapMissingRequired(entry) {
  return (
    !isPlainObjectRecord(entry) ||
    TESTING_FRAMEWORKS_QUALITY_GATES_REQUIRED_FIELDS.some(
      (field) => !Object.prototype.hasOwnProperty.call(entry, field)
    )
  );
}

function testingFrameworksQualityGatesBoundaryMapEntryMalformed(entry) {
  if (!isPlainObjectRecord(entry)) {
    return true;
  }

  return (
    typeof entry.boundaryId !== "string" ||
    !Array.isArray(entry.allowedCurrentBehavior) ||
    !Array.isArray(entry.forbiddenCurrentBehavior) ||
    typeof entry.requiredFutureContractBeforeImplementation !== "string" ||
    typeof entry.requiredFutureAuthorizationPhaseBeforeRuntime !== "string" ||
    typeof entry.qualityGateExpectation !== "string" ||
    typeof entry.failureBlockerExpectation !== "string" ||
    typeof entry.fixtureEvidenceExpectation !== "string" ||
    typeof entry.ciReleaseExpectation !== "string" ||
    typeof entry.securityStaticAnalysisExpectation !== "string" ||
    typeof entry.modelEvalExpectation !== "string" ||
    typeof entry.locusRoleDescription !== "string" ||
    typeof entry.multiverseRoleDescription !== "string" ||
    typeof entry.fabricRoleDescription !== "string" ||
    !isPlainObjectRecord(entry.explicitBlockedAuthorizationFlags) ||
    !isPlainObjectRecord(entry.unsafeTestingQualityGateRuntimeFlags) ||
    entry.nonAuthorizingProof !== true
  );
}

function testingFrameworksQualityGatesBoundaryMapAuthorizationFlagEnabled(
  value
) {
  if (!isPlainObjectRecord(value)) {
    return false;
  }

  return (
    (isPlainObjectRecord(value.explicitBlockedAuthorizationFlags) &&
      Object.values(value.explicitBlockedAuthorizationFlags).some(
        (flag) => flag !== false
      )) ||
    TESTING_FRAMEWORKS_QUALITY_GATES_AUTHORIZATION_FIELDS.some(
      (field) => value[field] === true
    )
  );
}

function testingFrameworksQualityGatesBoundaryMapUnsafeFlagEnabled(value) {
  if (!isPlainObjectRecord(value)) {
    return false;
  }

  return (
    (isPlainObjectRecord(value.unsafeTestingQualityGateRuntimeFlags) &&
      Object.values(value.unsafeTestingQualityGateRuntimeFlags).some(
        (flag) => flag !== false
      )) ||
    testingFrameworksQualityGatesBoundaryMapHasTrueFieldDeep(
      value,
      TESTING_FRAMEWORKS_QUALITY_GATES_UNSAFE_FIELDS
    )
  );
}

function testingFrameworksQualityGatesBoundaryMapCanonical(entries) {
  if (entries === null) {
    return true;
  }

  return (
    JSON.stringify(entries) ===
    JSON.stringify(testingFrameworksQualityGatesBoundaryMapEntries())
  );
}

function testingFrameworksQualityGatesBoundaryMapInputClassification(
  inputRecord
) {
  if (testingFrameworksQualityGatesBoundaryMapMalformed(inputRecord)) {
    return MALFORMED_TESTING_FRAMEWORKS_QUALITY_GATES_CONTRACT_BOUNDARY_MAP_CLASSIFICATION;
  }

  const entries =
    testingFrameworksQualityGatesBoundaryMapEntriesInput(inputRecord);

  if (
    testingFrameworksQualityGatesBoundaryMapEntryIssue(
      entries,
      testingFrameworksQualityGatesBoundaryMapMissingRequired
    )
  ) {
    return "missing_required_testing_frameworks_quality_gates_contract_boundary_entry_rejected";
  }

  if (
    testingFrameworksQualityGatesBoundaryMapEntryIssue(
      entries,
      (entry) =>
        !TESTING_FRAMEWORKS_QUALITY_GATES_BOUNDARY_FAMILIES.includes(
          entry.boundaryFamily
        )
    )
  ) {
    return "unknown_boundary_family_testing_frameworks_quality_gates_contract_boundary_map_input_rejected";
  }

  if (
    testingFrameworksQualityGatesBoundaryMapEntryIssue(
      entries,
      (entry) =>
        !TESTING_FRAMEWORKS_QUALITY_GATES_RELATED_SYSTEMS.includes(
          entry.relatedSystem
        )
    )
  ) {
    return "unknown_related_system_testing_frameworks_quality_gates_contract_boundary_map_input_rejected";
  }

  if (
    testingFrameworksQualityGatesBoundaryMapEntryIssue(
      entries,
      (entry) =>
        !TESTING_FRAMEWORKS_QUALITY_GATES_STATUSES.includes(
          entry.currentStatus
        )
    )
  ) {
    return "unknown_current_status_testing_frameworks_quality_gates_contract_boundary_map_input_rejected";
  }

  if (
    testingFrameworksQualityGatesBoundaryMapEntryIssue(
      entries,
      testingFrameworksQualityGatesBoundaryMapEntryMalformed
    )
  ) {
    return MALFORMED_TESTING_FRAMEWORKS_QUALITY_GATES_CONTRACT_BOUNDARY_MAP_CLASSIFICATION;
  }

  if (
    TESTING_FRAMEWORKS_QUALITY_GATES_AUTHORIZATION_FIELDS.some(
      (field) => inputRecord[field] === true
    )
  ) {
    return "runtime_authorization_attempt_testing_frameworks_quality_gates_contract_boundary_map_input_rejected";
  }

  if (
    testingFrameworksQualityGatesBoundaryMapEntryIssue(
      entries,
      testingFrameworksQualityGatesBoundaryMapAuthorizationFlagEnabled
    ) ||
    testingFrameworksQualityGatesBoundaryMapAuthorizationFlagEnabled(inputRecord)
  ) {
    return "authorization_flags_enabled_testing_frameworks_quality_gates_contract_boundary_map_input_rejected";
  }

  if (
    testingFrameworksQualityGatesBoundaryMapHasTrueFieldDeep(inputRecord, [
      "reportRunsChecks"
    ])
  ) {
    return "report_runs_checks_true_testing_frameworks_quality_gates_contract_boundary_map_input_rejected";
  }

  if (
    testingFrameworksQualityGatesBoundaryMapHasTrueFieldDeep(
      inputRecord,
      TESTING_FRAMEWORKS_QUALITY_GATES_AUTHORIZATION_FIELDS
    )
  ) {
    return "runtime_authorization_attempt_testing_frameworks_quality_gates_contract_boundary_map_input_rejected";
  }

  if (
    testingFrameworksQualityGatesBoundaryMapHasTrueFieldDeep(
      inputRecord,
      TESTING_FRAMEWORKS_QUALITY_GATES_COMMAND_FIELDS
    )
  ) {
    return "command_exposure_attempt_testing_frameworks_quality_gates_contract_boundary_map_input_rejected";
  }

  if (
    testingFrameworksQualityGatesBoundaryMapHasTrueFieldDeep(
      inputRecord,
      TESTING_FRAMEWORKS_QUALITY_GATES_BLOCKED_CLI_BYPASS_FIELDS
    )
  ) {
    return "blocked_cli_bypass_attempt_testing_frameworks_quality_gates_contract_boundary_map_input_rejected";
  }

  for (const {
    classification,
    fields
  } of TESTING_FRAMEWORKS_QUALITY_GATES_HIDDEN_FIELD_GROUPS) {
    if (
      testingFrameworksQualityGatesBoundaryMapHasPresentFieldDeep(
        inputRecord,
        fields
      )
    ) {
      return classification;
    }
  }

  if (
    testingFrameworksQualityGatesBoundaryMapUnsafeFlagEnabled(inputRecord) ||
    testingFrameworksQualityGatesBoundaryMapEntryIssue(
      entries,
      testingFrameworksQualityGatesBoundaryMapUnsafeFlagEnabled
    )
  ) {
    return "unsafe_testing_frameworks_quality_gates_runtime_flags_testing_frameworks_quality_gates_contract_boundary_map_input_rejected";
  }

  if (
    testingFrameworksQualityGatesBoundaryMapEntryIssue(entries, (entry) =>
      testingFrameworksQualityGatesBoundaryMapContainsTrue(entry?.runtimeEffect)
    ) ||
    testingFrameworksQualityGatesBoundaryMapContainsTrue(
      inputRecord?.runtimeEffect
    )
  ) {
    return "nested_unsafe_flags_testing_frameworks_quality_gates_contract_boundary_map_input_rejected";
  }

  if (
    Object.keys(inputRecord).some(
      (field) =>
        !TESTING_FRAMEWORKS_QUALITY_GATES_ALLOWED_TOP_LEVEL_FIELDS.includes(
          field
        )
    )
  ) {
    return "unknown_top_level_field_testing_frameworks_quality_gates_contract_boundary_map_input_rejected";
  }

  if (!testingFrameworksQualityGatesBoundaryMapCanonical(entries)) {
    return "noncanonical_testing_frameworks_quality_gates_contract_boundary_map_input_rejected";
  }

  return VALID_TESTING_FRAMEWORKS_QUALITY_GATES_CONTRACT_BOUNDARY_MAP_CLASSIFICATION;
}

function testingFrameworksQualityGatesBoundaryMapAuthorizationFlags() {
  return {
    runtimeAuthorizationGranted: false,
    testingRuntimeAuthorizationGranted: false,
    testRunnerAuthorizationGranted: false,
    integrationRunnerAuthorizationGranted: false,
    e2eRunnerAuthorizationGranted: false,
    browserTestAuthorizationGranted: false,
    computerUseTestAuthorizationGranted: false,
    cuaDriverTestAuthorizationGranted: false,
    chaosStressAuthorizationGranted: false,
    modelEvalAuthorizationGranted: false,
    ciPipelineAuthorizationGranted: false,
    releaseAutomationAuthorizationGranted: false,
    artifactUploadAuthorizationGranted: false,
    externalServiceTestAuthorizationGranted: false,
    liveDependencyUpdateAuthorizationGranted: false,
    patchAutomationAuthorizationGranted: false,
    commandExposureAuthorizationGranted: false,
    backendApiServerAuthorizationGranted: false,
    databaseStorageAuthorizationGranted: false,
    fabricRuntimeAuthorizationGranted: false,
    secureDropAuthorizationGranted: false,
    encodedHandoffRuntimeAuthorizationGranted: false,
    agentModeRuntimeAuthorizationGranted: false,
    approvalDecisionProduced: false,
    approvalGrantProduced: false,
    authorizesRuntime: false
  };
}

function testingFrameworksQualityGatesBoundaryMapFalseRuntimeFields() {
  return Object.fromEntries(
    TESTING_FRAMEWORKS_QUALITY_GATES_UNSAFE_FIELDS.map((field) => [
      field,
      false
    ])
  );
}

function testingFrameworksQualityGatesBoundaryMapNotes() {
  return {
    currentAuthorization:
      "Requires a future explicit authorization phase before any test runner, CI/release automation, browser/computer-use/CUA-driver test runtime, model-eval runtime, chaos/stress/e2e runner, external service test, package export, artifact upload, live dependency update, patch automation, runtime integration, backend/API/server, storage, Fabric, Secure Drop, encoded handoff, agent-mode runtime, telemetry, health-check, infrastructure, filesystem, process, UI, or command behavior.",
    qualityGate:
      "Future quality gates must define deterministic command ownership, acceptance criteria, failure classification, waiver policy, artifact retention, and release-blocking semantics before implementation.",
    blocker:
      "Future failures must distinguish introduced regressions from inherited advisory debt and must define whether the failure blocks review, merge, release, or only records evidence.",
    fixture:
      "Current evidence is deterministic fixture/status metadata only; future fixture conformance must define schema, ordering, freshness, provenance, and canonicalization before any runtime runner.",
    ciRelease:
      "Future CI/release gates require a separate pipeline, runner, secret, artifact-upload, package-export, release, rollback, and publication contract before automation.",
    security:
      "Current security/static-analysis/audit commands are evidence only; future enforcement must define severity policy, dependency provenance, false-positive workflow, and advisory aging before gating.",
    modelEval:
      "Future model-eval or refusal-resilience checks are post-launch/advisory contracts only and must not include training, fine-tuning, model-weight handling, or automated model routing.",
    locus:
      "Locus may later display gate status after a Locus-owned UI/control-surface contract; Ardyn creates no Locus integration or UI.",
    multiverse:
      "Multiverse may later display consumer conformance or release-gate metadata after a Multiverse-owned contract; Ardyn executes no task.",
    fabric:
      "Content Fabric may later carry fixture/evidence references after a separate Fabric contract; Ardyn creates no Fabric bus, websocket/http transport, MCP/task runtime, Secure Drop runtime, codec, translator, or external sink.",
    noConsumerRole: "No current runtime role; future consumers may inspect metadata only."
  };
}

function testingFrameworksQualityGatesBoundaryMapDefinition(definition) {
  const notes = testingFrameworksQualityGatesBoundaryMapNotes();

  return {
    ...definition,
    allowedCurrentBehavior: [
      `Describe future ${definition.subject} testing and quality-gate boundary metadata.`,
      "Reference existing local validation evidence as metadata when explicitly marked covered by existing validation.",
      "Keep current behavior review-only, metadata-only, non-authorizing, and runtime-blocked."
    ],
    forbiddenCurrentBehavior:
      testingFrameworksQualityGatesBoundaryMapForbiddenBehavior(),
    requiredFutureContractBeforeImplementation:
      `A future ${definition.subject} contract must define test ownership, runner isolation, inputs, fixtures, evidence retention, failure/blocker policy, release/CI relationship, security/static-analysis posture, and explicit no-runtime defaults before implementation.`,
    requiredFutureAuthorizationPhaseBeforeRuntime: notes.currentAuthorization,
    qualityGateExpectation:
      definition.qualityGateExpectation ?? notes.qualityGate,
    failureBlockerExpectation:
      definition.failureBlockerExpectation ?? notes.blocker,
    fixtureEvidenceExpectation:
      definition.fixtureEvidenceExpectation ?? notes.fixture,
    ciReleaseExpectation: definition.ciReleaseExpectation ?? notes.ciRelease,
    securityStaticAnalysisExpectation:
      definition.securityStaticAnalysisExpectation ?? notes.security,
    modelEvalExpectation: definition.modelEvalExpectation ?? notes.modelEval,
    locusRoleDescription: definition.locusRoleDescription ?? notes.locus,
    multiverseRoleDescription:
      definition.multiverseRoleDescription ?? notes.multiverse,
    fabricRoleDescription: definition.fabricRoleDescription ?? notes.fabric
  };
}

function testingFrameworksQualityGatesBoundaryMapDefinitions() {
  const notes = testingFrameworksQualityGatesBoundaryMapNotes();
  const rows = [
    [
      "phase5-69.ardyn.current_unit_validation.unit_test_boundary",
      "unit_test_contract",
      "ardyn",
      "covered_by_existing_validation",
      "current node:test unit validation evidence"
    ],
    [
      "phase5-69.ardyn.current_schema_validation.schema_test_boundary",
      "schema_test_contract",
      "ardyn",
      "covered_by_existing_validation",
      "current schema validation evidence"
    ],
    [
      "phase5-69.ardyn.current_report_status_validation.quality_gate_boundary",
      "quality_gate_contract",
      "ardyn",
      "covered_by_existing_validation",
      "current report/status validation evidence"
    ],
    [
      "phase5-69.repo_family.npm_cargo_validation.quality_gate_boundary",
      "quality_gate_contract",
      "repo-family",
      "covered_by_existing_validation",
      "current npm and cargo validation evidence"
    ],
    [
      "phase5-69.repo_family.semgrep_static_analysis.static_analysis_boundary",
      "static_analysis_contract",
      "repo-family",
      "covered_by_existing_validation",
      "current Semgrep static-analysis evidence"
    ],
    [
      "phase5-69.repo_family.npm_cargo_audit.dependency_audit_boundary",
      "dependency_audit_contract",
      "repo-family",
      "covered_by_existing_validation",
      "current npm audit and cargo audit evidence"
    ],
    [
      "phase5-69.repo_family.cargo_machete_static_analysis.static_analysis_boundary",
      "static_analysis_contract",
      "repo-family",
      "covered_by_existing_validation",
      "current cargo machete evidence"
    ],
    [
      "phase5-69.ardyn.phase5_fixture_conformance.fixture_conformance_boundary",
      "fixture_conformance_contract",
      "ardyn",
      "covered_by_existing_validation",
      "focused Phase 5 fixture conformance evidence"
    ],
    [
      "phase5-69.repo_family.adjacent_regression_gates.regression_gate_boundary",
      "regression_gate_contract",
      "repo-family",
      "covered_by_existing_validation",
      "adjacent Phase 5 regression-gate evidence"
    ],
    [
      "phase5-69.ardyn.runtime_blocked_gate.runtime_blocked_gate_boundary",
      "runtime_blocked_gate_contract",
      "ardyn",
      "covered_by_existing_validation",
      "runtime-blocked gate evidence"
    ],
    [
      "phase5-69.ardyn.blocked_command_matrix.runtime_blocked_gate_boundary",
      "runtime_blocked_gate_contract",
      "ardyn",
      "covered_by_existing_validation",
      "blocked-command matrix evidence"
    ],
    [
      "phase5-69.external_harness.ci_release_gate.ci_gate_boundary",
      "ci_gate_contract",
      "external-harness",
      "future_contract_required",
      "CI gate boundary"
    ],
    [
      "phase5-69.repo_family.release_blocker_policy.release_blocker_boundary",
      "release_blocker_contract",
      "repo-family",
      "future_contract_required",
      "release-blocker policy"
    ],
    [
      "phase5-69.ardyn.docs_markdown_lint.static_analysis_boundary",
      "static_analysis_contract",
      "ardyn",
      "metadata_only",
      "docs, markdown, and lint evidence"
    ],
    [
      "phase5-69.ardyn.database_storage_phase561.integration_test_boundary",
      "integration_test_contract",
      "ardyn",
      "covered_by_existing_validation",
      "database/storage test boundary from Phase 5.61"
    ],
    [
      "phase5-69.ardyn.auth_permissions_phase562.integration_test_boundary",
      "integration_test_contract",
      "ardyn",
      "covered_by_existing_validation",
      "auth/permissions test boundary from Phase 5.62"
    ],
    [
      "phase5-69.ardyn.security_rls_input_phase563.security_test_boundary",
      "security_test_contract",
      "ardyn",
      "covered_by_existing_validation",
      "security/RLS/input-sanitization test boundary from Phase 5.63"
    ],
    [
      "phase5-69.ardyn.rate_limiting_phase564.stress_test_boundary",
      "stress_test_contract",
      "ardyn",
      "future_contract_required",
      "rate-limiting and abuse-control stress test boundary from Phase 5.64"
    ],
    [
      "phase5-69.ardyn.error_log_audit_phase565.regression_gate_boundary",
      "regression_gate_contract",
      "ardyn",
      "covered_by_existing_validation",
      "error/log/audit-integrity regression boundary from Phase 5.65"
    ],
    [
      "phase5-69.repo_family.availability_recovery_phase566.chaos_test_boundary",
      "chaos_test_contract",
      "repo-family",
      "future_contract_required",
      "availability/recovery chaos test boundary from Phase 5.66"
    ],
    [
      "phase5-69.repo_family.infrastructure_compliance_phase567.quality_gate_boundary",
      "quality_gate_contract",
      "repo-family",
      "covered_by_existing_validation",
      "infrastructure/compliance/data-retention quality-gate boundary from Phase 5.67"
    ],
    [
      "phase5-69.hermes_reference.agent_mode_phase568.agent_mode_test_boundary",
      "agent_mode_test_contract",
      "hermes-reference",
      "covered_by_existing_validation",
      "Hermes/CUA agent-mode test boundary from Phase 5.68"
    ],
    [
      "phase5-69.cua_driver_reference.computer_use_test.computer_use_test_boundary",
      "computer_use_test_contract",
      "cua-driver-reference",
      "blocked",
      "computer-use test boundary with CUA driver execution blocked"
    ],
    [
      "phase5-69.external_harness.skillhub_security_scan.security_test_boundary",
      "security_test_contract",
      "external-harness",
      "blocked",
      "SkillHub and security-scan test boundary"
    ],
    [
      "phase5-69.ardyn_subagent.background_fusion_front_desk.agent_mode_test_boundary",
      "agent_mode_test_contract",
      "ardyn-subagent",
      "blocked",
      "background-subagent, fusion, judge, and front-desk model test boundary"
    ],
    [
      "phase5-69.content_fabric.encoded_handoff_phase560.fixture_conformance_boundary",
      "fixture_conformance_contract",
      "content-fabric",
      "covered_by_existing_validation",
      "encoded handoff conformance test boundary from Phase 5.60"
    ],
    [
      "phase5-69.content_fabric.fabric_api_backend_phase559.integration_test_boundary",
      "integration_test_contract",
      "content-fabric",
      "covered_by_existing_validation",
      "Fabric/API/backend test boundary from Phase 5.59"
    ],
    [
      "phase5-69.locus.consumer_conformance.e2e_test_boundary",
      "e2e_test_contract",
      "locus",
      "future_contract_required",
      "Locus consumer conformance test boundary"
    ],
    [
      "phase5-69.multiverse.consumer_conformance.e2e_test_boundary",
      "e2e_test_contract",
      "multiverse",
      "future_contract_required",
      "Multiverse consumer conformance test boundary"
    ],
    [
      "phase5-69.external_harness.model_eval_refusal_resilience.model_eval_boundary",
      "model_eval_contract",
      "external-harness",
      "future_contract_required",
      "future model-eval and refusal-resilience test boundary"
    ],
    [
      "phase5-69.external_harness.browser_e2e_future.e2e_test_boundary",
      "e2e_test_contract",
      "external-harness",
      "future_contract_required",
      "future browser, e2e, chaos, stress, and computer-use tests"
    ]
  ];

  return rows.map(
    ([boundaryId, boundaryFamily, relatedSystem, currentStatus, subject]) =>
      testingFrameworksQualityGatesBoundaryMapDefinition({
        boundaryId,
        boundaryFamily,
        relatedSystem,
        currentStatus,
        subject,
        modelEvalExpectation:
          boundaryFamily === "model_eval_contract"
            ? "Future model-eval and refusal-resilience checks remain post-launch/advisory only; no training code, fine-tuning, model-weight handling, or runtime model routing is authorized."
            : notes.modelEval,
        locusRoleDescription:
          relatedSystem === "locus"
            ? "Locus may later own consumer conformance and gate-status UI after a separate Locus contract; Ardyn creates no UI, browser runner, or Locus integration."
            : notes.locus,
        multiverseRoleDescription:
          relatedSystem === "multiverse"
            ? "Multiverse may later expose consumer conformance and task/capability gate metadata after a separate Multiverse contract; Ardyn executes no task."
            : notes.multiverse,
        fabricRoleDescription:
          relatedSystem === "content-fabric"
            ? "Content Fabric may later own encoded handoff or Fabric/API/backend fixture evidence after a separate Fabric contract; Ardyn creates no Fabric, Secure Drop, transport, codec, backend, or task runtime."
            : notes.fabric
      })
  );
}

function testingFrameworksQualityGatesBoundaryMapEntry(definition) {
  return {
    ...definition,
    productionReadinessAreaReference: {
      phase: "5.48",
      areaNumber: 15,
      areaName: "Testing Frameworks",
      sourceFixture:
        "tests/fixtures/host-policy/phase5-48/production-readiness-coverage-matrix.json",
      sourceStatus: "deferred",
      representedByPhase569: true,
      authorizesRuntime: false
    },
    testingFrameworksQualityGatesBoundaryMetadataOnly: true,
    noLiveTestingFrameworksQualityGatesRuntimePerformed: true,
    explicitBlockedAuthorizationFlags:
      testingFrameworksQualityGatesBoundaryMapAuthorizationFlags(),
    unsafeTestingQualityGateRuntimeFlags:
      testingFrameworksQualityGatesBoundaryMapFalseRuntimeFields(),
    nonAuthorizingProof: true,
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

function testingFrameworksQualityGatesBoundaryMapEntries() {
  return testingFrameworksQualityGatesBoundaryMapDefinitions().map(
    testingFrameworksQualityGatesBoundaryMapEntry
  );
}

function testingFrameworksQualityGatesBoundaryMapSummary(entries) {
  const countByFamily = Object.fromEntries(
    TESTING_FRAMEWORKS_QUALITY_GATES_BOUNDARY_FAMILIES.map((family) => [
      family,
      entries.filter((entry) => entry.boundaryFamily === family).length
    ])
  );
  const countByRelatedSystem = Object.fromEntries(
    TESTING_FRAMEWORKS_QUALITY_GATES_RELATED_SYSTEMS.map((system) => [
      system,
      entries.filter((entry) => entry.relatedSystem === system).length
    ])
  );
  const countByStatus = Object.fromEntries(
    TESTING_FRAMEWORKS_QUALITY_GATES_STATUSES.map((status) => [
      status,
      entries.filter((entry) => entry.currentStatus === status).length
    ])
  );
  const allBlockedAuthorizationFlagsFalse = entries.every((entry) =>
    Object.values(entry.explicitBlockedAuthorizationFlags).every(
      (value) => value === false
    )
  );
  const allUnsafeTestingQualityGateRuntimeFlagsFalse = entries.every((entry) =>
    Object.values(entry.unsafeTestingQualityGateRuntimeFlags).every(
      (value) => value === false
    )
  );
  const allRuntimeEffectsFalse = entries.every((entry) =>
    Object.values(entry.runtimeEffect).every((value) => value === false)
  );

  return {
    boundaryMapKind: TESTING_FRAMEWORKS_QUALITY_GATES_CONTRACT_BOUNDARY_MAP_KIND,
    boundaryEntryCount: entries.length,
    countByFamily,
    countByRelatedSystem,
    countByStatus,
    boundaryFamilies: [...TESTING_FRAMEWORKS_QUALITY_GATES_BOUNDARY_FAMILIES],
    relatedSystems: [...TESTING_FRAMEWORKS_QUALITY_GATES_RELATED_SYSTEMS],
    currentStatusValues: [...TESTING_FRAMEWORKS_QUALITY_GATES_STATUSES],
    phase548TestingFrameworksCoverageItemRepresented: true,
    testingFrameworksQualityGatesBoundaryMetadataOnly: true,
    noLiveTestingFrameworksQualityGatesRuntimePerformed: true,
    currentUnitSchemaReportStatusValidationEvidenceRecorded: true,
    currentNpmCargoValidationEvidenceRecorded: true,
    currentSemgrepNpmAuditCargoAuditCargoMacheteEvidenceRecorded: true,
    focusedFixtureConformanceBoundaryRecorded: true,
    adjacentRegressionGateBoundaryRecorded: true,
    runtimeBlockedGateBoundaryRecorded: true,
    blockedCommandMatrixBoundaryRecorded: true,
    ciReleaseGateBoundaryRecorded: true,
    noNewTestRunner: true,
    noCiPipelineCreation: true,
    noReleaseAutomation: true,
    noBrowserComputerUseCuaDriverTestRuntime: true,
    noModelEvalTrainingFinetuningRuntime: true,
    noChaosStressE2eRuntime: true,
    noExternalServiceTestRuntime: true,
    noPackageExportArtifactUploadLiveDependencyUpdatePatchAutomation: true,
    noRuntimeIntegrationBackendStorageBehavior: true,
    noFabricSecureDropEncodedHandoffRuntime: true,
    noHermesCuaAgentModeProfileSkillhubBackgroundFusionFrontDeskRuntime: true,
    noLoggerAuditTelemetryHealthInfrastructureRuntime: true,
    noCommandExposure: true,
    noBlockedCliBypass: true,
    allBlockedAuthorizationFlagsFalse,
    allUnsafeTestingQualityGateRuntimeFlagsFalse,
    allRuntimeEffectsFalse,
    allEntriesNonAuthorizing: entries.every(
      (entry) => entry.nonAuthorizingProof === true
    )
  };
}

function testingFrameworksQualityGatesBoundaryMapValidationRules() {
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
    enabledTestRunnerFailClosed: true,
    enabledIntegrationE2eBrowserComputerUseCuaDriverRunnerFailClosed: true,
    enabledChaosStressRunnerFailClosed: true,
    enabledModelEvalRuntimeFailClosed: true,
    enabledCiReleaseAutomationFailClosed: true,
    enabledPackageExportArtifactUploadFailClosed: true,
    enabledExternalServiceTestFailClosed: true,
    enabledLiveDependencyUpdatePatchAutomationFailClosed: true,
    hiddenTestHarnessExecutionSemanticsFailClosed: true,
    hiddenCiReleaseAutomationSemanticsFailClosed: true,
    hiddenBrowserComputerUseCuaDriverExecutionSemanticsFailClosed: true,
    hiddenModelEvalTrainingFinetuningSemanticsFailClosed: true,
    hiddenExternalServiceLookupSemanticsFailClosed: true,
    hiddenBackendApiServerSemanticsFailClosed: true,
    hiddenDatabaseStorageCacheWriteSemanticsFailClosed: true,
    hiddenAuthSessionTokenApiKeySemanticsFailClosed: true,
    hiddenConnectorGrantSemanticsFailClosed: true,
    hiddenFabricWebsocketHttpMcpTaskRuntimeSemanticsFailClosed: true,
    hiddenSecureDropImplementationSemanticsFailClosed: true,
    hiddenEncodedHandoffCodecTranslatorStegoCovertChannelTokenizerExploitBypassSemanticsFailClosed:
      true,
    hiddenLoggerAuditTranscriptTelemetryExternalSinkSemanticsFailClosed: true,
    hiddenHealthBackupRestoreFailoverSchedulerProcessSupervisorSemanticsFailClosed:
      true,
    hiddenInfrastructureDeploymentCompliancePiiRetentionExportSemanticsFailClosed:
      true,
    hiddenAgentModeProfileSkillhubBackgroundSubagentFusionFrontDeskSemanticsFailClosed:
      true,
    nestedUnsafeFlagsFailClosed: true,
    noncanonicalBoundaryEntriesFailClosed: true,
    validationRunsTestRunner: false,
    validationCreatesCiPipeline: false,
    validationRunsModelEval: false,
    validationRunsComputerUse: false,
    validationUploadsArtifacts: false,
    validationRunsRuntime: false
  };
}

function testingFrameworksQualityGatesBoundaryMapGaps() {
  return [
    "Future testing framework contracts still need explicit runner ownership, isolation, fixture freshness, evidence retention, waiver, and failure/blocker semantics before any new runner.",
    "Future CI/release gates still need pipeline, branch protection, artifact upload, package export, release automation, rollback, and secret-boundary contracts before automation.",
    "Future browser, e2e, computer-use, CUA-driver, chaos, stress, and external-service tests remain future contracts and require sandbox, permission, deny-path, and no-live-side-effect rules.",
    "Future model-eval and refusal-resilience checks remain post-launch/advisory and need dataset, scoring, privacy, budget, and non-training contracts before any runtime.",
    "Future operations/reliability gates still need health, backup, restore, failover, process-supervision, service-discovery, and infrastructure boundaries without enabling runtime."
  ];
}

function testingFrameworksQualityGatesBoundaryMapState(reviewedAt) {
  const boundaryEntries = testingFrameworksQualityGatesBoundaryMapEntries();

  return {
    schema: TESTING_FRAMEWORKS_QUALITY_GATES_CONTRACT_BOUNDARY_MAP_STATE_SCHEMA,
    schemaVersion:
      TESTING_FRAMEWORKS_QUALITY_GATES_CONTRACT_BOUNDARY_MAP_VERSION,
    stateKind: TESTING_FRAMEWORKS_QUALITY_GATES_CONTRACT_BOUNDARY_MAP_KIND,
    stateMode: "review-only",
    reviewedAt,
    sourcePhaseContext: {
      phase548ProductionReadinessCoverageMatrix:
        "tests/fixtures/host-policy/phase5-48/production-readiness-coverage-matrix.json",
      phase548TestingFrameworksAreaNumber: 15,
      phase548TestingFrameworksStatus: "deferred",
      phase559FabricAwareApiBackendBoundary:
        "tests/fixtures/host-policy/phase5-59/fabric-aware-api-backend-contract-boundary-map.json",
      phase560InterAgentEncodedHandoffConformance:
        "tests/fixtures/host-policy/phase5-60/inter-agent-encoded-handoff-conformance.json",
      phase561DatabaseStorageContractBoundary:
        "tests/fixtures/host-policy/phase5-61/database-storage-contract-boundary-map.json",
      phase562AuthPermissionsContractBoundary:
        "tests/fixtures/host-policy/phase5-62/auth-permissions-contract-boundary-map.json",
      phase563SecurityRlsInputSanitizationContractBoundary:
        "tests/fixtures/host-policy/phase5-63/security-rls-input-sanitization-contract-boundary-map.json",
      phase564RateLimitingAbuseControlContractBoundary:
        "tests/fixtures/host-policy/phase5-64/rate-limiting-abuse-control-contract-boundary-map.json",
      phase565ErrorTrackingLoggingAuditIntegrityContractBoundary:
        "tests/fixtures/host-policy/phase5-65/error-tracking-logging-audit-integrity-contract-boundary-map.json",
      phase566AvailabilityRecoveryContractBoundary:
        "tests/fixtures/host-policy/phase5-66/availability-recovery-contract-boundary-map.json",
      phase567InfrastructureComplianceDataRetentionBoundary:
        "tests/fixtures/host-policy/phase5-67/infrastructure-compliance-data-retention-contract-boundary-map.json",
      phase568AgentModeProfileSkillhubCapabilityBoundary:
        "tests/fixtures/host-policy/phase5-68/agent-mode-profile-skillhub-capability-boundary-map.json",
      testingFrameworksCoverageItemRepresented: true,
      productionReadinessTestingFrameworksItemDeferred: true,
      noNewTestRunnerImplemented: true,
      noCiReleaseAutomationImplemented: true,
      noRuntimeHarnessImplemented: true,
      runtimeStillBlocked: true
    },
    boundaryEntries,
    boundaryMapSummary:
      testingFrameworksQualityGatesBoundaryMapSummary(boundaryEntries),
    invalidBoundaryCasePolicy:
      testingFrameworksQualityGatesBoundaryMapValidationRules(),
    topTestingQualityGatesOperationsCodeModeFabricApiBackendGaps:
      testingFrameworksQualityGatesBoundaryMapGaps(),
    recommendedNextPhase:
      "phase-5.70-review-only-operations-reliability-contract-boundary-map",
    testingFrameworksQualityGatesContractBoundaryMapOnly: true,
    reviewOnly: true,
    metadataOnly: true,
    authoritative: false,
    nonAuthorizingProof: true,
    reportRunsChecks: false,
    ...testingFrameworksQualityGatesBoundaryMapFalseRuntimeFields(),
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

function testingFrameworksQualityGatesBoundaryMapResult({
  reviewedAt,
  reviewedAtDefaulted,
  classification,
  accepted,
  testingFrameworksQualityGatesContractBoundaryMap
}) {
  return {
    schema: TESTING_FRAMEWORKS_QUALITY_GATES_CONTRACT_BOUNDARY_MAP_SCHEMA,
    schemaVersion:
      TESTING_FRAMEWORKS_QUALITY_GATES_CONTRACT_BOUNDARY_MAP_VERSION,
    testingFrameworksQualityGatesContractBoundaryMapKind:
      TESTING_FRAMEWORKS_QUALITY_GATES_CONTRACT_BOUNDARY_MAP_KIND,
    testingFrameworksQualityGatesContractBoundaryMapMode: "review-only",
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    testingFrameworksQualityGatesContractBoundaryMapProduced: accepted,
    testingFrameworksQualityGatesContractBoundaryMap,
    boundaryMapSummary: accepted
      ? testingFrameworksQualityGatesContractBoundaryMap.boundaryMapSummary
      : null,
    boundaryEntries: accepted
      ? testingFrameworksQualityGatesContractBoundaryMap.boundaryEntries
      : [],
    invalidBoundaryCasePolicy: accepted
      ? testingFrameworksQualityGatesContractBoundaryMap.invalidBoundaryCasePolicy
      : testingFrameworksQualityGatesBoundaryMapValidationRules(),
    topTestingQualityGatesOperationsCodeModeFabricApiBackendGaps: accepted
      ? testingFrameworksQualityGatesContractBoundaryMap
          .topTestingQualityGatesOperationsCodeModeFabricApiBackendGaps
      : [],
    recommendedNextPhase: accepted
      ? testingFrameworksQualityGatesContractBoundaryMap.recommendedNextPhase
      : null,
    testingFrameworksQualityGatesContractBoundaryMapOnly: true,
    reviewOnly: true,
    metadataOnly: true,
    authoritative: false,
    nonAuthorizingProof: true,
    reportRunsChecks: false,
    ...testingFrameworksQualityGatesBoundaryMapFalseRuntimeFields(),
    rejectionReasons: accepted
      ? []
      : [
          {
            classification,
            rejected: true,
            runtimeAuthorized: false,
            testRunnerAuthorized: false,
            ciReleaseAuthorized: false,
            modelEvalAuthorized: false,
            computerUseTestAuthorized: false,
            commandExposureAuthorized: false,
            reportRunsChecks: false
          }
        ],
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

export function createTestingFrameworksQualityGatesContractBoundaryMapForReview(
  input = {}
) {
  const inputRecord =
    testingFrameworksQualityGatesBoundaryMapInputRecord(input);
  const reviewedAt =
    testingFrameworksQualityGatesBoundaryMapReviewedAt(inputRecord);
  const reviewedAtDefaulted = isReviewedAtDefaulted(inputRecord);
  const classification =
    testingFrameworksQualityGatesBoundaryMapInputClassification(inputRecord);
  const accepted =
    classification ===
    VALID_TESTING_FRAMEWORKS_QUALITY_GATES_CONTRACT_BOUNDARY_MAP_CLASSIFICATION;
  const testingFrameworksQualityGatesContractBoundaryMap = accepted
    ? testingFrameworksQualityGatesBoundaryMapState(reviewedAt)
    : null;

  return testingFrameworksQualityGatesBoundaryMapResult({
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    accepted,
    testingFrameworksQualityGatesContractBoundaryMap
  });
}

const OPERATIONS_RELIABILITY_CONTRACT_BOUNDARY_MAP_STATE_SCHEMA =
  "ardyn.phase-5.70.operations-reliability-contract-boundary-map-state";
const VALID_OPERATIONS_RELIABILITY_CONTRACT_BOUNDARY_MAP_CLASSIFICATION =
  "valid_operations_reliability_contract_boundary_map_runtime_still_blocked";
const MALFORMED_OPERATIONS_RELIABILITY_CONTRACT_BOUNDARY_MAP_CLASSIFICATION =
  "malformed_operations_reliability_contract_boundary_map_input_rejected";

const OPERATIONS_RELIABILITY_BOUNDARY_FAMILIES = Object.freeze([
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
const OPERATIONS_RELIABILITY_RELATED_SYSTEMS = Object.freeze([
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
const OPERATIONS_RELIABILITY_STATUSES = Object.freeze([
  "metadata_only",
  "blocked",
  "future_contract_required"
]);
const OPERATIONS_RELIABILITY_REQUIRED_FIELDS = Object.freeze([
  "boundaryId",
  "boundaryFamily",
  "relatedSystem",
  "currentStatus",
  "allowedCurrentBehavior",
  "forbiddenCurrentBehavior",
  "requiredFutureContractBeforeImplementation",
  "requiredFutureAuthorizationPhaseBeforeRuntime",
  "retryExpectation",
  "idempotencyExpectation",
  "circuitBreakerExpectation",
  "concurrencyExpectation",
  "cancellationExpectation",
  "workOwnershipExpectation",
  "handoffRecoveryExpectation",
  "degradedModeExpectation",
  "runbookExpectation",
  "locusRoleDescription",
  "multiverseRoleDescription",
  "fabricRoleDescription",
  "explicitBlockedAuthorizationFlags",
  "unsafeOperationsReliabilityRuntimeFlags",
  "nonAuthorizingProof"
]);
const OPERATIONS_RELIABILITY_ALLOWED_TOP_LEVEL_FIELDS = Object.freeze([
  "reviewedAt",
  "boundaryEntries"
]);
const OPERATIONS_RELIABILITY_UNSAFE_FIELDS = Object.freeze([
  "runtimeExecutionEnabled",
  "runtimeAuthorizationEnabled",
  "runtimeCommandEnabled",
  "commandExposureEnabled",
  "commandRuntimeControlEnabled",
  "connectorGrantProduced",
  "fabricRuntimeImplementedByArdyn",
  "websocketHttpTransportImplementedByArdyn",
  "mcpToolExposureEnabled",
  "taskExecutionEnabled",
  "secureDropImplemented",
  "serviceDiscoveryEnabled",
  "scheduleEnforcementEnabled",
  "filesystemWriteEnabled",
  "filesystemScanningEnabled",
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
  "uiFrontendBrowserRenderingImplemented",
  "blockedCliBypassEnabled"
]);
const OPERATIONS_RELIABILITY_AUTHORIZATION_FIELDS = Object.freeze([
  "runtimeAuthorized",
  "runtimeAuthorizationGranted",
  "authorizesRuntime",
  "operationsRuntimeAuthorizationGranted",
  "retryEngineAuthorizationGranted",
  "idempotencyStoreAuthorizationGranted",
  "circuitBreakerAuthorizationGranted",
  "queueSchedulerAuthorizationGranted",
  "leaseStoreAuthorizationGranted",
  "workerAuthorizationGranted",
  "operationMonitorAuthorizationGranted",
  "runbookExecutorAuthorizationGranted",
  "processSupervisorAuthorizationGranted",
  "backgroundSubagentAuthorizationGranted",
  "modelRouterAuthorizationGranted",
  "frontDeskAuthorizationGranted",
  "computerUseReliabilityAuthorizationGranted",
  "skillhubRollbackAuthorizationGranted",
  "mcpToolPluginProviderAuthorizationGranted",
  "commandExposureAuthorizationGranted",
  "backendApiServerAuthorizationGranted",
  "databaseStorageAuthorizationGranted",
  "fabricRuntimeAuthorizationGranted",
  "secureDropAuthorizationGranted",
  "encodedHandoffRuntimeAuthorizationGranted",
  "approvalDecisionProduced",
  "approvalGrantProduced"
]);
const OPERATIONS_RELIABILITY_COMMAND_FIELDS = Object.freeze([
  "commandExposureEnabled",
  "commandRuntimeControlEnabled",
  "commandsExposed",
  "exposesCommands",
  "runtimeCommandEnabled",
  "cliCommandExposed"
]);
const OPERATIONS_RELIABILITY_BLOCKED_CLI_BYPASS_FIELDS = Object.freeze([
  "blockedCliBypassEnabled",
  "dryRunBypassesBlock",
  "serveRuntimeBypassEnabled",
  "bypassBlockedCommandBehavior",
  "blockedCommandOverride"
]);
const OPERATIONS_RELIABILITY_HIDDEN_FIELD_GROUPS = Object.freeze([
  {
    classification:
      "hidden_retry_circuit_breaker_execution_semantics_operations_reliability_contract_boundary_map_input_rejected",
    fields: [
      "retryEngine",
      "retryPolicy",
      "backoffSchedule",
      "circuitBreaker",
      "breakerState",
      "fallbackExecutor"
    ]
  },
  {
    classification:
      "hidden_idempotency_persistence_semantics_operations_reliability_contract_boundary_map_input_rejected",
    fields: [
      "idempotencyStore",
      "idempotencyKey",
      "dedupeStore",
      "writeFence",
      "exactlyOnce"
    ]
  },
  {
    classification:
      "hidden_queue_scheduler_worker_semantics_operations_reliability_contract_boundary_map_input_rejected",
    fields: [
      "queue",
      "taskQueue",
      "scheduler",
      "cronSchedule",
      "worker",
      "workerPool",
      "asyncExecutor",
      "pollingLoop"
    ]
  },
  {
    classification:
      "hidden_lease_work_ownership_runtime_semantics_operations_reliability_contract_boundary_map_input_rejected",
    fields: [
      "leaseStore",
      "leaseToken",
      "workOwner",
      "ownershipRegistry",
      "lockManager"
    ]
  },
  {
    classification:
      "hidden_cancellation_concurrency_runtime_semantics_operations_reliability_contract_boundary_map_input_rejected",
    fields: [
      "cancellationToken",
      "abortController",
      "concurrencyLimit",
      "semaphore",
      "mutex",
      "parallelExecutor"
    ]
  },
  {
    classification:
      "hidden_background_subagent_execution_semantics_operations_reliability_contract_boundary_map_input_rejected",
    fields: [
      "backgroundSubagent",
      "subagentDaemon",
      "subagentQueue",
      "subagentWorker",
      "subagentCancellation"
    ]
  },
  {
    classification:
      "hidden_front_desk_fusion_judge_model_routing_runtime_semantics_operations_reliability_contract_boundary_map_input_rejected",
    fields: [
      "frontDeskModel",
      "frontDeskResponder",
      "fusionRuntime",
      "judgeRuntime",
      "modelRouter",
      "orchestratorBusyState"
    ]
  },
  {
    classification:
      "hidden_computer_use_cua_driver_reliability_runtime_semantics_operations_reliability_contract_boundary_map_input_rejected",
    fields: [
      "computerUseRuntime",
      "computerUseReliabilityRunner",
      "cuaDriverRuntime",
      "cuaDriverBinary",
      "desktopControl",
      "inputAutomation"
    ]
  },
  {
    classification:
      "hidden_skillhub_install_rollback_runtime_semantics_operations_reliability_contract_boundary_map_input_rejected",
    fields: [
      "skillhubInstaller",
      "skillhubRollback",
      "skillInstaller",
      "skillRollback",
      "skillActivation"
    ]
  },
  {
    classification:
      "hidden_mcp_tool_plugin_provider_runtime_semantics_operations_reliability_contract_boundary_map_input_rejected",
    fields: [
      "mcpServer",
      "mcpTool",
      "toolRuntime",
      "pluginRuntime",
      "providerRuntime",
      "toolRegistry"
    ]
  },
  {
    classification:
      "hidden_backend_api_server_semantics_operations_reliability_contract_boundary_map_input_rejected",
    fields: [
      "backendApiMiddleware",
      "apiRequestHandler",
      "httpServer",
      "serverMiddleware",
      "httpEndpoint",
      "runtimeEndpoint"
    ]
  },
  {
    classification:
      "hidden_database_storage_cache_write_semantics_operations_reliability_contract_boundary_map_input_rejected",
    fields: [
      "databaseUrl",
      "databaseDsn",
      "dbConnectionString",
      "storageAdapter",
      "cacheEngine",
      "writeQueue",
      "persistenceLayer",
      "filesystemWrite"
    ]
  },
  {
    classification:
      "hidden_auth_session_token_api_key_semantics_operations_reliability_contract_boundary_map_input_rejected",
    fields: [
      "loginUrl",
      "sessionCookie",
      "sessionStore",
      "sessionToken",
      "apiKey",
      "oauthToken",
      "authHeader"
    ]
  },
  {
    classification:
      "hidden_connector_grant_semantics_operations_reliability_contract_boundary_map_input_rejected",
    fields: [
      "connectorGrant",
      "connectorCredential",
      "connectorAccessToken",
      "connectorComplianceGrant"
    ]
  },
  {
    classification:
      "hidden_fabric_websocket_http_mcp_task_runtime_semantics_operations_reliability_contract_boundary_map_input_rejected",
    fields: [
      "fabricBus",
      "websocketUrl",
      "httpTransport",
      "mcpRuntime",
      "mcpServer",
      "mcpTool",
      "taskRunner",
      "taskQueue"
    ]
  },
  {
    classification:
      "hidden_secure_drop_implementation_semantics_operations_reliability_contract_boundary_map_input_rejected",
    fields: [
      "secureDropKeyring",
      "secureDropCrypto",
      "secureDropTransport",
      "secureDropInbox",
      "secureDropFilePicker",
      "st3ggWrapper"
    ]
  },
  {
    classification:
      "hidden_encoded_handoff_codec_translator_stego_covert_channel_tokenizer_exploit_bypass_semantics_operations_reliability_contract_boundary_map_input_rejected",
    fields: [
      "encodedHandoffRuntime",
      "codecRuntime",
      "translatorRuntime",
      "encoderRuntime",
      "decoderRuntime",
      "stegoChannel",
      "covertChannel",
      "tokenizerExploit",
      "bypassPayload"
    ]
  },
  {
    classification:
      "hidden_logger_audit_transcript_telemetry_external_sink_semantics_operations_reliability_contract_boundary_map_input_rejected",
    fields: [
      "loggerRuntime",
      "auditWriter",
      "transcriptWriter",
      "telemetryClient",
      "externalSink",
      "logExporter"
    ]
  },
  {
    classification:
      "hidden_health_backup_restore_failover_scheduler_process_supervisor_semantics_operations_reliability_contract_boundary_map_input_rejected",
    fields: [
      "healthChecker",
      "backupJob",
      "restoreJob",
      "failoverRuntime",
      "scheduler",
      "cronSchedule",
      "processSupervisor",
      "serviceDiscovery"
    ]
  },
  {
    classification:
      "hidden_infrastructure_deployment_compliance_pii_retention_export_semantics_operations_reliability_contract_boundary_map_input_rejected",
    fields: [
      "terraformPlan",
      "deployCommand",
      "cloudProvider",
      "complianceEnforcer",
      "piiProcessor",
      "retentionScheduler",
      "exportJob",
      "policyEngine"
    ]
  },
  {
    classification:
      "hidden_testing_ci_release_automation_semantics_operations_reliability_contract_boundary_map_input_rejected",
    fields: [
      "testRunner",
      "ciPipeline",
      "githubActionsWorkflow",
      "releaseJob",
      "releaseAutomation",
      "artifactUpload",
      "packageExport"
    ]
  }
]);

function operationsReliabilityBoundaryMapInputRecord(input) {
  return isPlainObjectRecord(input) ? input : null;
}

function operationsReliabilityBoundaryMapReviewedAt(inputRecord) {
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

function operationsReliabilityBoundaryMapContainsTrue(value) {
  if (value === true) {
    return true;
  }

  if (Array.isArray(value)) {
    return value.some(operationsReliabilityBoundaryMapContainsTrue);
  }

  if (isPlainObjectRecord(value)) {
    return Object.values(value).some(
      operationsReliabilityBoundaryMapContainsTrue
    );
  }

  return false;
}

function operationsReliabilityBoundaryMapHasTrueFieldDeep(value, fields) {
  if (Array.isArray(value)) {
    return value.some((item) =>
      operationsReliabilityBoundaryMapHasTrueFieldDeep(item, fields)
    );
  }

  if (!isPlainObjectRecord(value)) {
    return false;
  }

  for (const [key, nested] of Object.entries(value)) {
    if (fields.includes(key) && nested === true) {
      return true;
    }

    if (operationsReliabilityBoundaryMapHasTrueFieldDeep(nested, fields)) {
      return true;
    }
  }

  return false;
}

function operationsReliabilityBoundaryMapHasPresentFieldDeep(value, fields) {
  if (Array.isArray(value)) {
    return value.some((item) =>
      operationsReliabilityBoundaryMapHasPresentFieldDeep(item, fields)
    );
  }

  if (!isPlainObjectRecord(value)) {
    return false;
  }

  for (const [key, nested] of Object.entries(value)) {
    if (
      key === "explicitBlockedAuthorizationFlags" ||
      key === "unsafeOperationsReliabilityRuntimeFlags"
    ) {
      continue;
    }

    if (fields.includes(key)) {
      return true;
    }

    if (operationsReliabilityBoundaryMapHasPresentFieldDeep(nested, fields)) {
      return true;
    }
  }

  return false;
}

function operationsReliabilityBoundaryMapEntriesInput(inputRecord) {
  return Array.isArray(inputRecord?.boundaryEntries)
    ? inputRecord.boundaryEntries
    : null;
}

function operationsReliabilityBoundaryMapMalformed(inputRecord) {
  return (
    inputRecord === null ||
    (Object.prototype.hasOwnProperty.call(inputRecord, "reviewedAt") &&
      !isUtcIsoTimestampWithMilliseconds(inputRecord.reviewedAt)) ||
    (Object.prototype.hasOwnProperty.call(inputRecord, "boundaryEntries") &&
      !Array.isArray(inputRecord.boundaryEntries))
  );
}

function operationsReliabilityBoundaryMapEntryIssue(entries, predicate) {
  return entries !== null && entries.some((entry) => predicate(entry));
}

function operationsReliabilityBoundaryMapMissingRequired(entry) {
  return (
    !isPlainObjectRecord(entry) ||
    OPERATIONS_RELIABILITY_REQUIRED_FIELDS.some(
      (field) => !Object.prototype.hasOwnProperty.call(entry, field)
    )
  );
}

function operationsReliabilityBoundaryMapEntryMalformed(entry) {
  if (!isPlainObjectRecord(entry)) {
    return true;
  }

  return (
    typeof entry.boundaryId !== "string" ||
    !Array.isArray(entry.allowedCurrentBehavior) ||
    !Array.isArray(entry.forbiddenCurrentBehavior) ||
    typeof entry.requiredFutureContractBeforeImplementation !== "string" ||
    typeof entry.requiredFutureAuthorizationPhaseBeforeRuntime !== "string" ||
    typeof entry.retryExpectation !== "string" ||
    typeof entry.idempotencyExpectation !== "string" ||
    typeof entry.circuitBreakerExpectation !== "string" ||
    typeof entry.concurrencyExpectation !== "string" ||
    typeof entry.cancellationExpectation !== "string" ||
    typeof entry.workOwnershipExpectation !== "string" ||
    typeof entry.handoffRecoveryExpectation !== "string" ||
    typeof entry.degradedModeExpectation !== "string" ||
    typeof entry.runbookExpectation !== "string" ||
    typeof entry.locusRoleDescription !== "string" ||
    typeof entry.multiverseRoleDescription !== "string" ||
    typeof entry.fabricRoleDescription !== "string" ||
    !isPlainObjectRecord(entry.explicitBlockedAuthorizationFlags) ||
    !isPlainObjectRecord(entry.unsafeOperationsReliabilityRuntimeFlags) ||
    entry.nonAuthorizingProof !== true
  );
}

function operationsReliabilityBoundaryMapAuthorizationFlagEnabled(value) {
  if (!isPlainObjectRecord(value)) {
    return false;
  }

  return (
    (isPlainObjectRecord(value.explicitBlockedAuthorizationFlags) &&
      Object.values(value.explicitBlockedAuthorizationFlags).some(
        (flag) => flag !== false
      )) ||
    OPERATIONS_RELIABILITY_AUTHORIZATION_FIELDS.some(
      (field) => value[field] === true
    )
  );
}

function operationsReliabilityBoundaryMapUnsafeFlagEnabled(value) {
  if (!isPlainObjectRecord(value)) {
    return false;
  }

  return (
    (isPlainObjectRecord(value.unsafeOperationsReliabilityRuntimeFlags) &&
      Object.values(value.unsafeOperationsReliabilityRuntimeFlags).some(
        (flag) => flag !== false
      )) ||
    operationsReliabilityBoundaryMapHasTrueFieldDeep(
      value,
      OPERATIONS_RELIABILITY_UNSAFE_FIELDS
    )
  );
}

function operationsReliabilityBoundaryMapCanonical(entries) {
  if (entries === null) {
    return true;
  }

  return (
    JSON.stringify(entries) ===
    JSON.stringify(operationsReliabilityBoundaryMapEntries())
  );
}

function operationsReliabilityBoundaryMapInputClassification(inputRecord) {
  if (operationsReliabilityBoundaryMapMalformed(inputRecord)) {
    return MALFORMED_OPERATIONS_RELIABILITY_CONTRACT_BOUNDARY_MAP_CLASSIFICATION;
  }

  const entries = operationsReliabilityBoundaryMapEntriesInput(inputRecord);

  if (
    operationsReliabilityBoundaryMapEntryIssue(
      entries,
      operationsReliabilityBoundaryMapMissingRequired
    )
  ) {
    return "missing_required_operations_reliability_contract_boundary_entry_rejected";
  }

  if (
    operationsReliabilityBoundaryMapEntryIssue(
      entries,
      (entry) =>
        !OPERATIONS_RELIABILITY_BOUNDARY_FAMILIES.includes(
          entry.boundaryFamily
        )
    )
  ) {
    return "unknown_boundary_family_operations_reliability_contract_boundary_map_input_rejected";
  }

  if (
    operationsReliabilityBoundaryMapEntryIssue(
      entries,
      (entry) =>
        !OPERATIONS_RELIABILITY_RELATED_SYSTEMS.includes(entry.relatedSystem)
    )
  ) {
    return "unknown_related_system_operations_reliability_contract_boundary_map_input_rejected";
  }

  if (
    operationsReliabilityBoundaryMapEntryIssue(
      entries,
      (entry) => !OPERATIONS_RELIABILITY_STATUSES.includes(entry.currentStatus)
    )
  ) {
    return "unknown_current_status_operations_reliability_contract_boundary_map_input_rejected";
  }

  if (
    operationsReliabilityBoundaryMapEntryIssue(
      entries,
      operationsReliabilityBoundaryMapEntryMalformed
    )
  ) {
    return MALFORMED_OPERATIONS_RELIABILITY_CONTRACT_BOUNDARY_MAP_CLASSIFICATION;
  }

  if (
    OPERATIONS_RELIABILITY_AUTHORIZATION_FIELDS.some(
      (field) => inputRecord[field] === true
    )
  ) {
    return "runtime_authorization_attempt_operations_reliability_contract_boundary_map_input_rejected";
  }

  if (
    operationsReliabilityBoundaryMapEntryIssue(
      entries,
      operationsReliabilityBoundaryMapAuthorizationFlagEnabled
    ) ||
    operationsReliabilityBoundaryMapAuthorizationFlagEnabled(inputRecord)
  ) {
    return "authorization_flags_enabled_operations_reliability_contract_boundary_map_input_rejected";
  }

  if (
    operationsReliabilityBoundaryMapHasTrueFieldDeep(inputRecord, [
      "reportRunsChecks"
    ])
  ) {
    return "report_runs_checks_true_operations_reliability_contract_boundary_map_input_rejected";
  }

  if (
    operationsReliabilityBoundaryMapHasTrueFieldDeep(
      inputRecord,
      OPERATIONS_RELIABILITY_AUTHORIZATION_FIELDS
    )
  ) {
    return "runtime_authorization_attempt_operations_reliability_contract_boundary_map_input_rejected";
  }

  if (
    operationsReliabilityBoundaryMapHasTrueFieldDeep(
      inputRecord,
      OPERATIONS_RELIABILITY_COMMAND_FIELDS
    )
  ) {
    return "command_exposure_attempt_operations_reliability_contract_boundary_map_input_rejected";
  }

  if (
    operationsReliabilityBoundaryMapHasTrueFieldDeep(
      inputRecord,
      OPERATIONS_RELIABILITY_BLOCKED_CLI_BYPASS_FIELDS
    )
  ) {
    return "blocked_cli_bypass_attempt_operations_reliability_contract_boundary_map_input_rejected";
  }

  for (const {
    classification,
    fields
  } of OPERATIONS_RELIABILITY_HIDDEN_FIELD_GROUPS) {
    if (
      operationsReliabilityBoundaryMapHasPresentFieldDeep(inputRecord, fields)
    ) {
      return classification;
    }
  }

  if (
    operationsReliabilityBoundaryMapUnsafeFlagEnabled(inputRecord) ||
    operationsReliabilityBoundaryMapEntryIssue(
      entries,
      operationsReliabilityBoundaryMapUnsafeFlagEnabled
    )
  ) {
    return "unsafe_operations_reliability_runtime_flags_operations_reliability_contract_boundary_map_input_rejected";
  }

  if (
    operationsReliabilityBoundaryMapEntryIssue(entries, (entry) =>
      operationsReliabilityBoundaryMapContainsTrue(entry?.runtimeEffect)
    ) ||
    operationsReliabilityBoundaryMapContainsTrue(inputRecord?.runtimeEffect)
  ) {
    return "nested_unsafe_flags_operations_reliability_contract_boundary_map_input_rejected";
  }

  if (
    Object.keys(inputRecord).some(
      (field) =>
        !OPERATIONS_RELIABILITY_ALLOWED_TOP_LEVEL_FIELDS.includes(field)
    )
  ) {
    return "unknown_top_level_field_operations_reliability_contract_boundary_map_input_rejected";
  }

  if (!operationsReliabilityBoundaryMapCanonical(entries)) {
    return "noncanonical_operations_reliability_contract_boundary_map_input_rejected";
  }

  return VALID_OPERATIONS_RELIABILITY_CONTRACT_BOUNDARY_MAP_CLASSIFICATION;
}

function operationsReliabilityBoundaryMapAuthorizationFlags() {
  return {
    runtimeAuthorizationGranted: false,
    operationsRuntimeAuthorizationGranted: false,
    retryEngineAuthorizationGranted: false,
    idempotencyStoreAuthorizationGranted: false,
    circuitBreakerAuthorizationGranted: false,
    queueSchedulerAuthorizationGranted: false,
    leaseStoreAuthorizationGranted: false,
    workerAuthorizationGranted: false,
    operationMonitorAuthorizationGranted: false,
    runbookExecutorAuthorizationGranted: false,
    processSupervisorAuthorizationGranted: false,
    backgroundSubagentAuthorizationGranted: false,
    modelRouterAuthorizationGranted: false,
    frontDeskAuthorizationGranted: false,
    computerUseReliabilityAuthorizationGranted: false,
    skillhubRollbackAuthorizationGranted: false,
    mcpToolPluginProviderAuthorizationGranted: false,
    commandExposureAuthorizationGranted: false,
    backendApiServerAuthorizationGranted: false,
    databaseStorageAuthorizationGranted: false,
    fabricRuntimeAuthorizationGranted: false,
    secureDropAuthorizationGranted: false,
    encodedHandoffRuntimeAuthorizationGranted: false,
    approvalDecisionProduced: false,
    approvalGrantProduced: false,
    authorizesRuntime: false
  };
}

function operationsReliabilityBoundaryMapFalseRuntimeFields() {
  return Object.fromEntries(
    OPERATIONS_RELIABILITY_UNSAFE_FIELDS.map((field) => [field, false])
  );
}

function operationsReliabilityBoundaryMapNotes() {
  return {
    currentAuthorization:
      "Requires a future explicit authorization phase before any retry engine, idempotency store, circuit breaker, queue, scheduler, worker, lease store, operation monitor, runbook executor, process supervisor, background subagent, model router, fusion/judge/front-desk runtime, computer-use/CUA-driver runtime, SkillHub install/rollback runtime, MCP/tool/plugin/provider runtime, backend/API/server behavior, storage write, connector grant, Secure Drop, Fabric, encoded handoff, logger/audit/telemetry, health-check, infrastructure, testing/CI/release automation, filesystem, process, UI, or command behavior.",
    retry:
      "Future retry behavior must define retryable classes, nonretryable classes, backoff, jitter, retry budgets, cancellation, audit evidence, and side-effect protection before implementation.",
    idempotency:
      "Future idempotency must define keys, dedupe windows, write fences, replay behavior, persistence ownership, and recovery semantics before any storage-backed operation.",
    circuitBreaker:
      "Future circuit breakers must define trip conditions, half-open behavior, fallback scope, operator visibility, reset policy, and fail-closed defaults before implementation.",
    concurrency:
      "Future concurrency must define work isolation, resource limits, queue ownership, parallelism, fairness, starvation handling, and user-interruptible status before runtime.",
    cancellation:
      "Future cancellation must define user interrupt, cleanup, partial-result handoff, cancellation propagation, and deny-path behavior before runtime.",
    ownership:
      "Future work ownership must define owner identity, leases, handoff, expiry, recovery, duplicate suppression, and conflict semantics before any live worker.",
    handoff:
      "Future handoff/recovery must define typed handoff records, retry safety, lost-result handling, transcript/audit visibility, and content-fabric boundaries before implementation.",
    degraded:
      "Future degraded modes must define fallback scope, user-visible busy/degraded status, escalation, no-silent-success behavior, and operator recovery steps before runtime.",
    runbook:
      "Future runbooks must be evidence and operator guidance until a separate executor contract exists; Ardyn executes no operational runbook in this phase.",
    locus:
      "Locus may later display reliability status after a Locus-owned UI/control-surface contract; Ardyn creates no Locus integration or UI.",
    multiverse:
      "Multiverse may later consume reliability metadata after a Multiverse-owned contract; Ardyn executes no task and creates no bridge.",
    fabric:
      "Content Fabric may later own coordination envelopes, Secure Drop canonical implementation, and handoff recovery after a separate Fabric contract; Ardyn creates no Fabric bus, websocket/http transport, MCP/task runtime, Secure Drop runtime, codec, translator, or external sink."
  };
}

function operationsReliabilityBoundaryMapDefinition(definition) {
  const notes = operationsReliabilityBoundaryMapNotes();

  return {
    ...definition,
    allowedCurrentBehavior: [
      `Describe future ${definition.subject} operations/reliability boundary metadata.`,
      "Reference prior Phase 5 boundary artifacts as review-only metadata.",
      "Keep current behavior review-only, metadata-only, non-authorizing, and runtime-blocked."
    ],
    forbiddenCurrentBehavior:
      operationsReliabilityBoundaryMapForbiddenBehavior(),
    requiredFutureContractBeforeImplementation:
      `A future ${definition.subject} contract must define retry, idempotency, circuit-breaker, concurrency, cancellation, work ownership, degraded-mode, runbook, handoff/recovery, operator visibility, audit/evidence, deny-path, and explicit no-runtime defaults before implementation.`,
    requiredFutureAuthorizationPhaseBeforeRuntime:
      definition.requiredFutureAuthorizationPhaseBeforeRuntime ??
      notes.currentAuthorization,
    retryExpectation: definition.retryExpectation ?? notes.retry,
    idempotencyExpectation:
      definition.idempotencyExpectation ?? notes.idempotency,
    circuitBreakerExpectation:
      definition.circuitBreakerExpectation ?? notes.circuitBreaker,
    concurrencyExpectation:
      definition.concurrencyExpectation ?? notes.concurrency,
    cancellationExpectation:
      definition.cancellationExpectation ?? notes.cancellation,
    workOwnershipExpectation:
      definition.workOwnershipExpectation ?? notes.ownership,
    handoffRecoveryExpectation:
      definition.handoffRecoveryExpectation ?? notes.handoff,
    degradedModeExpectation:
      definition.degradedModeExpectation ?? notes.degraded,
    runbookExpectation: definition.runbookExpectation ?? notes.runbook,
    locusRoleDescription: definition.locusRoleDescription ?? notes.locus,
    multiverseRoleDescription:
      definition.multiverseRoleDescription ?? notes.multiverse,
    fabricRoleDescription: definition.fabricRoleDescription ?? notes.fabric
  };
}

function operationsReliabilityBoundaryMapDefinitions() {
  const notes = operationsReliabilityBoundaryMapNotes();
  const rows = [
    [
      "phase5-70.content_fabric.backend_api_phase559.fabric_reliability_boundary",
      "fabric_reliability_contract",
      "content-fabric",
      "future_contract_required",
      "backend/API reliability boundary from Phase 5.59"
    ],
    [
      "phase5-70.content_fabric.encoded_handoff_phase560.handoff_recovery_boundary",
      "handoff_recovery_contract",
      "content-fabric",
      "future_contract_required",
      "encoded handoff reliability boundary from Phase 5.60"
    ],
    [
      "phase5-70.ardyn.database_storage_phase561.idempotency_write_safety_boundary",
      "idempotency_contract",
      "ardyn",
      "future_contract_required",
      "database/storage idempotency and write-safety boundary from Phase 5.61"
    ],
    [
      "phase5-70.ardyn.auth_permissions_phase562.retry_revocation_boundary",
      "retry_contract",
      "ardyn",
      "future_contract_required",
      "auth/permissions retry and revocation-continuity boundary from Phase 5.62"
    ],
    [
      "phase5-70.ardyn.security_rls_phase563.fail_closed_operations_boundary",
      "circuit_breaker_contract",
      "ardyn",
      "future_contract_required",
      "security/RLS fail-closed operations boundary from Phase 5.63"
    ],
    [
      "phase5-70.repo_family.rate_limit_abuse_phase564.retry_budget_boundary",
      "retry_contract",
      "repo-family",
      "future_contract_required",
      "rate-limit and abuse retry-budget boundary from Phase 5.64"
    ],
    [
      "phase5-70.ardyn.error_log_audit_phase565.operational_visibility_boundary",
      "operation_runbook_contract",
      "ardyn",
      "metadata_only",
      "error/log/audit operational visibility boundary from Phase 5.65"
    ],
    [
      "phase5-70.repo_family.availability_recovery_phase566.degraded_mode_boundary",
      "degraded_mode_contract",
      "repo-family",
      "future_contract_required",
      "availability/recovery degraded-mode boundary from Phase 5.66"
    ],
    [
      "phase5-70.repo_family.infrastructure_compliance_phase567.operational_governance_boundary",
      "operation_runbook_contract",
      "repo-family",
      "metadata_only",
      "infrastructure/compliance operational governance boundary from Phase 5.67"
    ],
    [
      "phase5-70.hermes_reference.computer_use_phase568.reliability_boundary",
      "computer_use_reliability_contract",
      "hermes-reference",
      "blocked",
      "Hermes/CUA computer-use reliability boundary from Phase 5.68"
    ],
    [
      "phase5-70.cua_driver_reference.computer_use_driver_phase568.reliability_boundary",
      "computer_use_reliability_contract",
      "cua-driver-reference",
      "blocked",
      "CUA-driver computer-use reliability boundary from Phase 5.68"
    ],
    [
      "phase5-70.external_harness.testing_quality_phase569.operational_release_boundary",
      "operation_runbook_contract",
      "external-harness",
      "metadata_only",
      "testing/quality-gate operational release boundary from Phase 5.69"
    ],
    [
      "phase5-70.ardyn_subagent.background_subagent.concurrency_cancellation_boundary",
      "background_subagent_reliability_contract",
      "ardyn-subagent",
      "blocked",
      "future background subagent concurrency and cancellation boundary"
    ],
    [
      "phase5-70.ardyn.front_desk.busy_state_boundary",
      "front_desk_busy_contract",
      "ardyn",
      "blocked",
      "future front-desk lightweight model busy-state boundary"
    ],
    [
      "phase5-70.ardyn_subagent.fusion_judge.orchestration_reliability_boundary",
      "concurrency_contract",
      "ardyn-subagent",
      "blocked",
      "future fusion/judge orchestration reliability boundary"
    ],
    [
      "phase5-70.external_harness.skillhub.rollback_retry_boundary",
      "skillhub_reliability_contract",
      "external-harness",
      "blocked",
      "future SkillHub install rollback and retry boundary"
    ],
    [
      "phase5-70.external_harness.mcp_tool_plugin_provider.reliability_boundary",
      "work_ownership_contract",
      "external-harness",
      "blocked",
      "future MCP/tool/plugin/provider reliability boundary"
    ],
    [
      "phase5-70.locus.harness_reliability_boundary",
      "work_ownership_contract",
      "locus",
      "future_contract_required",
      "future Locus-mediated harness reliability boundary"
    ],
    [
      "phase5-70.multiverse.harness_reliability_boundary",
      "work_ownership_contract",
      "multiverse",
      "future_contract_required",
      "future Multiverse consumer reliability boundary"
    ],
    [
      "phase5-70.content_fabric.fabric_coordination_envelope.reliability_boundary",
      "fabric_reliability_contract",
      "content-fabric",
      "future_contract_required",
      "future Fabric coordination-envelope reliability boundary"
    ],
    [
      "phase5-70.content_fabric.secure_drop.handoff_recovery_boundary",
      "handoff_recovery_contract",
      "content-fabric",
      "blocked",
      "future Secure Drop handoff/recovery boundary"
    ],
    [
      "phase5-70.ardyn.operational_runbook_evidence_boundary",
      "operation_runbook_contract",
      "ardyn",
      "metadata_only",
      "future operational runbook and evidence boundary"
    ],
    [
      "phase5-70.ardyn.cancellation_boundary",
      "cancellation_contract",
      "ardyn",
      "blocked",
      "future cancellation propagation boundary"
    ],
    [
      "phase5-70.ardyn.lease_boundary",
      "lease_contract",
      "ardyn",
      "blocked",
      "future lease and work ownership runtime boundary"
    ],
    [
      "phase5-70.ardyn.queue_semantics_boundary",
      "queue_semantics_contract",
      "ardyn",
      "blocked",
      "future queue semantics and scheduler boundary"
    ]
  ];

  return rows.map(
    ([boundaryId, boundaryFamily, relatedSystem, currentStatus, subject]) =>
      operationsReliabilityBoundaryMapDefinition({
        boundaryId,
        boundaryFamily,
        relatedSystem,
        currentStatus,
        subject,
        locusRoleDescription:
          relatedSystem === "locus"
            ? "Locus may later own display and control-surface reliability status after a separate Locus contract; Ardyn creates no UI, bridge, or Locus integration."
            : notes.locus,
        multiverseRoleDescription:
          relatedSystem === "multiverse"
            ? "Multiverse may later consume reliability status metadata after a separate Multiverse contract; Ardyn executes no task and creates no bridge."
            : notes.multiverse,
        fabricRoleDescription:
          relatedSystem === "content-fabric"
            ? "Content Fabric remains the canonical owner for Fabric coordination and Secure Drop implementation boundaries; Ardyn creates no Fabric, Secure Drop, transport, codec, backend, or task runtime."
            : notes.fabric,
        handoffRecoveryExpectation:
          subject.includes("Secure Drop")
            ? "Future Secure Drop handoff/recovery remains content-fabric canonical implementation work; Ardyn records only review metadata and no crypto, transport, inbox, stego, send/receive, connector ingestion, or file selection behavior."
            : notes.handoff
      })
  );
}

function operationsReliabilityBoundaryMapEntry(definition) {
  return {
    ...definition,
    productionReadinessAreaReference: {
      phase: "5.48",
      areaNumber: 16,
      areaName: "Operations & Reliability",
      sourceFixture:
        "tests/fixtures/host-policy/phase5-48/production-readiness-coverage-matrix.json",
      sourceStatus: "deferred",
      representedByPhase570: true,
      authorizesRuntime: false
    },
    operationsReliabilityBoundaryMetadataOnly: true,
    noLiveOperationsReliabilityRuntimePerformed: true,
    explicitBlockedAuthorizationFlags:
      operationsReliabilityBoundaryMapAuthorizationFlags(),
    unsafeOperationsReliabilityRuntimeFlags:
      operationsReliabilityBoundaryMapFalseRuntimeFields(),
    nonAuthorizingProof: true,
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

function operationsReliabilityBoundaryMapEntries() {
  return operationsReliabilityBoundaryMapDefinitions().map(
    operationsReliabilityBoundaryMapEntry
  );
}

function operationsReliabilityBoundaryMapSummary(entries) {
  const countByFamily = Object.fromEntries(
    OPERATIONS_RELIABILITY_BOUNDARY_FAMILIES.map((family) => [
      family,
      entries.filter((entry) => entry.boundaryFamily === family).length
    ])
  );
  const countByRelatedSystem = Object.fromEntries(
    OPERATIONS_RELIABILITY_RELATED_SYSTEMS.map((system) => [
      system,
      entries.filter((entry) => entry.relatedSystem === system).length
    ])
  );
  const countByStatus = Object.fromEntries(
    OPERATIONS_RELIABILITY_STATUSES.map((status) => [
      status,
      entries.filter((entry) => entry.currentStatus === status).length
    ])
  );
  const allBlockedAuthorizationFlagsFalse = entries.every((entry) =>
    Object.values(entry.explicitBlockedAuthorizationFlags).every(
      (value) => value === false
    )
  );
  const allUnsafeOperationsReliabilityRuntimeFlagsFalse = entries.every(
    (entry) =>
      Object.values(entry.unsafeOperationsReliabilityRuntimeFlags).every(
        (value) => value === false
      )
  );
  const allRuntimeEffectsFalse = entries.every((entry) =>
    Object.values(entry.runtimeEffect).every((value) => value === false)
  );

  return {
    boundaryMapKind: OPERATIONS_RELIABILITY_CONTRACT_BOUNDARY_MAP_KIND,
    boundaryEntryCount: entries.length,
    countByFamily,
    countByRelatedSystem,
    countByStatus,
    boundaryFamilies: [...OPERATIONS_RELIABILITY_BOUNDARY_FAMILIES],
    relatedSystems: [...OPERATIONS_RELIABILITY_RELATED_SYSTEMS],
    currentStatusValues: [...OPERATIONS_RELIABILITY_STATUSES],
    phase548OperationsReliabilityCoverageItemRepresented: true,
    operationsReliabilityBoundaryMetadataOnly: true,
    noLiveOperationsReliabilityRuntimePerformed: true,
    backendApiReliabilityBoundaryRecorded: true,
    encodedHandoffReliabilityBoundaryRecorded: true,
    databaseStorageIdempotencyWriteSafetyBoundaryRecorded: true,
    authPermissionsRetryRevocationBoundaryRecorded: true,
    securityRlsFailClosedOperationsBoundaryRecorded: true,
    rateLimitAbuseRetryBudgetBoundaryRecorded: true,
    errorLogAuditOperationalVisibilityBoundaryRecorded: true,
    availabilityRecoveryDegradedModeBoundaryRecorded: true,
    infrastructureComplianceOperationalGovernanceBoundaryRecorded: true,
    hermesCuaComputerUseReliabilityBoundaryRecorded: true,
    testingQualityGateOperationalReleaseBoundaryRecorded: true,
    backgroundSubagentConcurrencyCancellationBoundaryRecorded: true,
    frontDeskBusyStateBoundaryRecorded: true,
    fusionJudgeOrchestrationReliabilityBoundaryRecorded: true,
    skillhubInstallRollbackRetryBoundaryRecorded: true,
    mcpToolPluginProviderReliabilityBoundaryRecorded: true,
    locusMediatedHarnessReliabilityBoundaryRecorded: true,
    fabricCoordinationEnvelopeReliabilityBoundaryRecorded: true,
    secureDropHandoffRecoveryBoundaryRecorded: true,
    operationalRunbookEvidenceBoundaryRecorded: true,
    noRetryEngine: true,
    noIdempotencyStore: true,
    noCircuitBreaker: true,
    noQueueSchedulerWorkerLeaseRuntime: true,
    noOperationMonitorRunbookExecutorProcessSupervisor: true,
    noBackgroundSubagentModelRouterFusionJudgeFrontDeskRuntime: true,
    noComputerUseCuaDriverRuntime: true,
    noSkillhubRollbackInstallRuntime: true,
    noMcpToolPluginProviderRuntime: true,
    noRuntimeIntegrationBackendStorageBehavior: true,
    noFabricSecureDropEncodedHandoffRuntime: true,
    noLoggerAuditTelemetryHealthInfrastructureRuntime: true,
    noTestingCiReleaseAutomation: true,
    noCommandExposure: true,
    noBlockedCliBypass: true,
    allBlockedAuthorizationFlagsFalse,
    allUnsafeOperationsReliabilityRuntimeFlagsFalse,
    allRuntimeEffectsFalse,
    allEntriesNonAuthorizing: entries.every(
      (entry) => entry.nonAuthorizingProof === true
    )
  };
}

function operationsReliabilityBoundaryMapValidationRules() {
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
    enabledRetryEngineFailClosed: true,
    enabledIdempotencyStoreFailClosed: true,
    enabledCircuitBreakerFailClosed: true,
    enabledQueueSchedulerWorkerLeaseRuntimeFailClosed: true,
    enabledBackgroundSubagentFrontDeskModelRouterRuntimeFailClosed: true,
    enabledProcessSupervisorRunbookFailoverOperationMonitorOrchestrationRuntimeFailClosed:
      true,
    enabledComputerUseCuaDriverReliabilityRuntimeFailClosed: true,
    enabledSkillhubInstallRollbackRuntimeFailClosed: true,
    enabledMcpToolPluginProviderRuntimeFailClosed: true,
    hiddenRetryCircuitBreakerExecutionSemanticsFailClosed: true,
    hiddenIdempotencyPersistenceSemanticsFailClosed: true,
    hiddenQueueSchedulerWorkerSemanticsFailClosed: true,
    hiddenLeaseWorkOwnershipRuntimeSemanticsFailClosed: true,
    hiddenCancellationConcurrencyRuntimeSemanticsFailClosed: true,
    hiddenBackgroundSubagentExecutionSemanticsFailClosed: true,
    hiddenFrontDeskFusionJudgeModelRoutingRuntimeSemanticsFailClosed: true,
    hiddenComputerUseCuaDriverReliabilityRuntimeSemanticsFailClosed: true,
    hiddenSkillhubInstallRollbackRuntimeSemanticsFailClosed: true,
    hiddenMcpToolPluginProviderRuntimeSemanticsFailClosed: true,
    hiddenBackendApiServerSemanticsFailClosed: true,
    hiddenDatabaseStorageCacheWriteSemanticsFailClosed: true,
    hiddenAuthSessionTokenApiKeySemanticsFailClosed: true,
    hiddenConnectorGrantSemanticsFailClosed: true,
    hiddenFabricWebsocketHttpMcpTaskRuntimeSemanticsFailClosed: true,
    hiddenSecureDropImplementationSemanticsFailClosed: true,
    hiddenEncodedHandoffCodecTranslatorStegoCovertChannelTokenizerExploitBypassSemanticsFailClosed:
      true,
    hiddenLoggerAuditTranscriptTelemetryExternalSinkSemanticsFailClosed: true,
    hiddenHealthBackupRestoreFailoverSchedulerProcessSupervisorSemanticsFailClosed:
      true,
    hiddenInfrastructureDeploymentCompliancePiiRetentionExportSemanticsFailClosed:
      true,
    hiddenTestingCiReleaseAutomationSemanticsFailClosed: true,
    nestedUnsafeFlagsFailClosed: true,
    noncanonicalBoundaryEntriesFailClosed: true,
    validationRunsOperationsRuntime: false,
    validationCreatesQueue: false,
    validationCreatesWorker: false,
    validationCreatesLeaseStore: false,
    validationRunsComputerUse: false,
    validationRunsFabric: false
  };
}

function operationsReliabilityBoundaryMapGaps() {
  return [
    "Future operations contracts still need explicit retry budgets, idempotency-key ownership, write fences, circuit-breaker state, and no-side-effect replay semantics before runtime.",
    "Future queue, scheduler, worker, lease, cancellation, and background subagent contracts still need visibility, interruptibility, ownership, expiry, handoff, and duplicate-suppression rules.",
    "Future front-desk, model-router, fusion, and judge reliability still need busy-state, escalation, cancellation, result handoff, and synthesized-output contracts before runtime.",
    "Future Fabric/API/backend and Secure Drop recovery remain separate contracts with content-fabric ownership for canonical implementation and no Ardyn transport or codec behavior.",
    "Future operations runbooks still need evidence retention, operator action taxonomy, manual recovery, release-blocker, maintenance/governance, ADR, and dependency-policy boundaries."
  ];
}

function operationsReliabilityBoundaryMapState(reviewedAt) {
  const boundaryEntries = operationsReliabilityBoundaryMapEntries();

  return {
    schema: OPERATIONS_RELIABILITY_CONTRACT_BOUNDARY_MAP_STATE_SCHEMA,
    schemaVersion: OPERATIONS_RELIABILITY_CONTRACT_BOUNDARY_MAP_VERSION,
    stateKind: OPERATIONS_RELIABILITY_CONTRACT_BOUNDARY_MAP_KIND,
    stateMode: "review-only",
    reviewedAt,
    sourcePhaseContext: {
      phase548ProductionReadinessCoverageMatrix:
        "tests/fixtures/host-policy/phase5-48/production-readiness-coverage-matrix.json",
      phase548OperationsReliabilityAreaNumber: 16,
      phase548OperationsReliabilityStatus: "deferred",
      phase559FabricAwareApiBackendBoundary:
        "tests/fixtures/host-policy/phase5-59/fabric-aware-api-backend-contract-boundary-map.json",
      phase560InterAgentEncodedHandoffConformance:
        "tests/fixtures/host-policy/phase5-60/inter-agent-encoded-handoff-conformance.json",
      phase561DatabaseStorageContractBoundary:
        "tests/fixtures/host-policy/phase5-61/database-storage-contract-boundary-map.json",
      phase562AuthPermissionsContractBoundary:
        "tests/fixtures/host-policy/phase5-62/auth-permissions-contract-boundary-map.json",
      phase563SecurityRlsInputSanitizationContractBoundary:
        "tests/fixtures/host-policy/phase5-63/security-rls-input-sanitization-contract-boundary-map.json",
      phase564RateLimitingAbuseControlContractBoundary:
        "tests/fixtures/host-policy/phase5-64/rate-limiting-abuse-control-contract-boundary-map.json",
      phase565ErrorTrackingLoggingAuditIntegrityContractBoundary:
        "tests/fixtures/host-policy/phase5-65/error-tracking-logging-audit-integrity-contract-boundary-map.json",
      phase566AvailabilityRecoveryContractBoundary:
        "tests/fixtures/host-policy/phase5-66/availability-recovery-contract-boundary-map.json",
      phase567InfrastructureComplianceDataRetentionBoundary:
        "tests/fixtures/host-policy/phase5-67/infrastructure-compliance-data-retention-contract-boundary-map.json",
      phase568AgentModeProfileSkillhubCapabilityBoundary:
        "tests/fixtures/host-policy/phase5-68/agent-mode-profile-skillhub-capability-boundary-map.json",
      phase569TestingFrameworksQualityGatesBoundary:
        "tests/fixtures/host-policy/phase5-69/testing-frameworks-quality-gates-contract-boundary-map.json",
      operationsReliabilityCoverageItemRepresented: true,
      productionReadinessOperationsReliabilityItemDeferred: true,
      noOperationsRuntimeImplemented: true,
      noQueueSchedulerWorkerLeaseImplemented: true,
      noRunbookExecutorImplemented: true,
      runtimeStillBlocked: true
    },
    boundaryEntries,
    boundaryMapSummary:
      operationsReliabilityBoundaryMapSummary(boundaryEntries),
    invalidBoundaryCasePolicy:
      operationsReliabilityBoundaryMapValidationRules(),
    topOperationsReliabilityCodeModeFabricApiBackendGaps:
      operationsReliabilityBoundaryMapGaps(),
    recommendedNextPhase:
      "phase-5.71-review-only-maintenance-governance-adr-dependency-policy-contract-boundary-map",
    operationsReliabilityContractBoundaryMapOnly: true,
    reviewOnly: true,
    metadataOnly: true,
    authoritative: false,
    nonAuthorizingProof: true,
    reportRunsChecks: false,
    ...operationsReliabilityBoundaryMapFalseRuntimeFields(),
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

function operationsReliabilityBoundaryMapResult({
  reviewedAt,
  reviewedAtDefaulted,
  classification,
  accepted,
  operationsReliabilityContractBoundaryMap
}) {
  return {
    schema: OPERATIONS_RELIABILITY_CONTRACT_BOUNDARY_MAP_SCHEMA,
    schemaVersion: OPERATIONS_RELIABILITY_CONTRACT_BOUNDARY_MAP_VERSION,
    operationsReliabilityContractBoundaryMapKind:
      OPERATIONS_RELIABILITY_CONTRACT_BOUNDARY_MAP_KIND,
    operationsReliabilityContractBoundaryMapMode: "review-only",
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    operationsReliabilityContractBoundaryMapProduced: accepted,
    operationsReliabilityContractBoundaryMap,
    boundaryMapSummary: accepted
      ? operationsReliabilityContractBoundaryMap.boundaryMapSummary
      : null,
    boundaryEntries: accepted
      ? operationsReliabilityContractBoundaryMap.boundaryEntries
      : [],
    invalidBoundaryCasePolicy: accepted
      ? operationsReliabilityContractBoundaryMap.invalidBoundaryCasePolicy
      : operationsReliabilityBoundaryMapValidationRules(),
    topOperationsReliabilityCodeModeFabricApiBackendGaps: accepted
      ? operationsReliabilityContractBoundaryMap
          .topOperationsReliabilityCodeModeFabricApiBackendGaps
      : [],
    recommendedNextPhase: accepted
      ? operationsReliabilityContractBoundaryMap.recommendedNextPhase
      : null,
    operationsReliabilityContractBoundaryMapOnly: true,
    reviewOnly: true,
    metadataOnly: true,
    authoritative: false,
    nonAuthorizingProof: true,
    reportRunsChecks: false,
    ...operationsReliabilityBoundaryMapFalseRuntimeFields(),
    rejectionReasons: accepted
      ? []
      : [
          {
            classification,
            rejected: true,
            runtimeAuthorized: false,
            operationsRuntimeAuthorized: false,
            retryEngineAuthorized: false,
            queueWorkerAuthorized: false,
            runbookExecutorAuthorized: false,
            commandExposureAuthorized: false,
            reportRunsChecks: false
          }
        ],
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

export function createOperationsReliabilityContractBoundaryMapForReview(
  input = {}
) {
  const inputRecord = operationsReliabilityBoundaryMapInputRecord(input);
  const reviewedAt = operationsReliabilityBoundaryMapReviewedAt(inputRecord);
  const reviewedAtDefaulted = isReviewedAtDefaulted(inputRecord);
  const classification =
    operationsReliabilityBoundaryMapInputClassification(inputRecord);
  const accepted =
    classification ===
    VALID_OPERATIONS_RELIABILITY_CONTRACT_BOUNDARY_MAP_CLASSIFICATION;
  const operationsReliabilityContractBoundaryMap = accepted
    ? operationsReliabilityBoundaryMapState(reviewedAt)
    : null;

  return operationsReliabilityBoundaryMapResult({
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    accepted,
    operationsReliabilityContractBoundaryMap
  });
}

const MAINTENANCE_GOVERNANCE_ADR_DEPENDENCY_POLICY_CONTRACT_BOUNDARY_MAP_STATE_SCHEMA =
  "ardyn.phase-5.71.maintenance-governance-adr-dependency-policy-contract-boundary-map-state";
const VALID_MAINTENANCE_GOVERNANCE_ADR_DEPENDENCY_POLICY_CONTRACT_BOUNDARY_MAP_CLASSIFICATION =
  "valid_maintenance_governance_adr_dependency_policy_contract_boundary_map_runtime_still_blocked";
const MALFORMED_MAINTENANCE_GOVERNANCE_ADR_DEPENDENCY_POLICY_CONTRACT_BOUNDARY_MAP_CLASSIFICATION =
  "malformed_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected";

const MAINTENANCE_GOVERNANCE_BOUNDARY_FAMILIES = Object.freeze([
  "adr_contract",
  "architecture_diagram_contract",
  "governance_policy_contract",
  "dependency_policy_contract",
  "vulnerability_patch_policy_contract",
  "waiver_policy_contract",
  "release_governance_contract",
  "versioning_policy_contract",
  "ownership_contract",
  "review_policy_contract",
  "jules_review_boundary",
  "subagent_review_boundary",
  "toolkit_usage_boundary",
  "graphify_memory_boundary",
  "code_mode_governance_boundary",
  "external_reference_policy_contract"
]);
const MAINTENANCE_GOVERNANCE_RELATED_SYSTEMS = Object.freeze([
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
const MAINTENANCE_GOVERNANCE_STATUSES = Object.freeze([
  "metadata_only",
  "covered_by_existing_validation",
  "blocked",
  "future_contract_required"
]);
const MAINTENANCE_GOVERNANCE_REQUIRED_FIELDS = Object.freeze([
  "boundaryId",
  "boundaryFamily",
  "relatedSystem",
  "currentStatus",
  "allowedCurrentBehavior",
  "forbiddenCurrentBehavior",
  "requiredFutureContractBeforeImplementation",
  "requiredFutureAuthorizationPhaseBeforeRuntime",
  "governanceExpectation",
  "adrEvidenceExpectation",
  "dependencyPolicyExpectation",
  "waiverExceptionExpectation",
  "reviewOwnershipExpectation",
  "releaseVersioningExpectation",
  "toolkitEvidenceExpectation",
  "graphifyMemoryExpectation",
  "externalReferenceProvenanceExpectation",
  "locusRoleDescription",
  "multiverseRoleDescription",
  "fabricRoleDescription",
  "explicitBlockedAuthorizationFlags",
  "unsafeMaintenanceGovernanceRuntimeFlags",
  "nonAuthorizingProof"
]);
const MAINTENANCE_GOVERNANCE_ALLOWED_TOP_LEVEL_FIELDS = Object.freeze([
  "reviewedAt",
  "boundaryEntries"
]);
const MAINTENANCE_GOVERNANCE_UNSAFE_FIELDS = Object.freeze([
  "runtimeExecutionEnabled",
  "runtimeAuthorizationEnabled",
  "runtimeCommandEnabled",
  "commandExposureEnabled",
  "commandRuntimeControlEnabled",
  "connectorGrantProduced",
  "fabricRuntimeImplementedByArdyn",
  "websocketHttpTransportImplementedByArdyn",
  "mcpToolExposureEnabled",
  "taskExecutionEnabled",
  "secureDropImplemented",
  "serviceDiscoveryEnabled",
  "scheduleEnforcementEnabled",
  "filesystemWriteEnabled",
  "filesystemScanningEnabled",
  "processControlEnabled",
  "adrGeneratorEnabled",
  "diagramGeneratorEnabled",
  "dependencyUpdateAutomationEnabled",
  "dependencyUpdateBotEnabled",
  "vulnerabilityPatchAutomationEnabled",
  "releasePublishingEnabled",
  "ciModificationEnabled",
  "ciWorkflowModificationEnabled",
  "policyEngineEnabled",
  "waiverAutomationEnabled",
  "adrGeneratorRuntimeEnabled",
  "diagramGeneratorRuntimeEnabled",
  "graphifyRuntimeMutationEnabled",
  "graphifyRepoMutationEnabled",
  "codeModeRuntimeEnabled",
  "subagentRuntimeEnabled",
  "julesAutomationEnabled",
  "externalRepoImportEnabled",
  "externalRepoVendoringEnabled",
  "externalRepoCopyingEnabled",
  "packageExportEnabled",
  "packageDistributionImplementedByArdyn",
  "deploymentAutomationImplemented",
  "runtimeGovernanceEnabled",
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
  "persistenceImplementedByArdyn",
  "loggerRuntimeImplemented",
  "auditWriterRuntimeImplemented",
  "telemetryClientImplemented",
  "healthCheckRuntimeImplemented",
  "backupJobImplemented",
  "restoreJobImplemented",
  "failoverRuntimeImplemented",
  "infrastructureAutomationImplemented",
  "complianceEnforcementImplemented",
  "piiProcessingImplemented",
  "retentionJobImplemented",
  "exportJobImplemented",
  "testingCiReleaseAutomationEnabled",
  "hermesRuntimeEnabled",
  "cuaDriverRuntimeEnabled",
  "computerUseRuntimeEnabled",
  "agentModeRuntimeEnabled",
  "profileLoaderEnabled",
  "skillLoaderEnabled",
  "uiFrontendBrowserRenderingImplemented",
  "blockedCliBypassEnabled"
]);
const MAINTENANCE_GOVERNANCE_AUTHORIZATION_FIELDS = Object.freeze([
  "runtimeAuthorized",
  "runtimeAuthorizationGranted",
  "authorizesRuntime",
  "maintenanceGovernanceAuthorizationGranted",
  "adrGeneratorAuthorizationGranted",
  "diagramGeneratorAuthorizationGranted",
  "dependencyUpdateAutomationAuthorizationGranted",
  "vulnerabilityPatchAutomationAuthorizationGranted",
  "releasePublishingAuthorizationGranted",
  "ciModificationAuthorizationGranted",
  "policyEngineAuthorizationGranted",
  "waiverAutomationAuthorizationGranted",
  "graphifyMutationAuthorizationGranted",
  "codeModeRuntimeAuthorizationGranted",
  "subagentRuntimeAuthorizationGranted",
  "julesAutomationAuthorizationGranted",
  "externalRepoVendoringAuthorizationGranted",
  "commandExposureAuthorizationGranted",
  "backendApiServerAuthorizationGranted",
  "databaseStorageAuthorizationGranted",
  "fabricRuntimeAuthorizationGranted",
  "secureDropAuthorizationGranted",
  "encodedHandoffRuntimeAuthorizationGranted",
  "approvalDecisionProduced",
  "approvalGrantProduced"
]);
const MAINTENANCE_GOVERNANCE_COMMAND_FIELDS = Object.freeze([
  "commandExposureEnabled",
  "commandRuntimeControlEnabled",
  "commandsExposed",
  "exposesCommands",
  "runtimeCommandEnabled",
  "cliCommandExposed"
]);
const MAINTENANCE_GOVERNANCE_BLOCKED_CLI_BYPASS_FIELDS = Object.freeze([
  "blockedCliBypassEnabled",
  "dryRunBypassesBlock",
  "serveRuntimeBypassEnabled",
  "bypassBlockedCommandBehavior",
  "blockedCommandOverride"
]);
const MAINTENANCE_GOVERNANCE_HIDDEN_FIELD_GROUPS = Object.freeze([
  {
    classification:
      "hidden_dependency_update_patch_execution_semantics_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected",
    fields: [
      "dependencyUpdateBot",
      "dependencyUpdateJob",
      "patchApplier",
      "vulnerabilityPatchRunner",
      "packageUpgradePlan",
      "lockfileRewrite"
    ]
  },
  {
    classification:
      "hidden_release_ci_publishing_automation_semantics_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected",
    fields: [
      "releasePublisher",
      "releaseJob",
      "ciWorkflow",
      "githubActionsWorkflow",
      "artifactPublisher",
      "packagePublisher"
    ]
  },
  {
    classification:
      "hidden_graphify_memory_mutation_semantics_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected",
    fields: [
      "graphifyRuntime",
      "graphifyMutation",
      "graphMemoryWrite",
      "memoryWriter",
      "outsideRepoMemoryWrite"
    ]
  },
  {
    classification:
      "hidden_code_mode_runtime_semantics_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected",
    fields: [
      "codeModeRuntime",
      "orchestratorPlanLoop",
      "selfSubagentRuntime",
      "miniFusionRuntime",
      "judgeRuntime",
      "frontDeskModel"
    ]
  },
  {
    classification:
      "hidden_subagent_jules_automation_semantics_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected",
    fields: [
      "subagentRuntime",
      "subagentRouter",
      "julesAutomation",
      "julesReviewer",
      "reviewerAssignment",
      "reviewerRouting"
    ]
  },
  {
    classification:
      "hidden_external_reference_vendoring_copying_semantics_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected",
    fields: [
      "externalRepoImport",
      "externalRepoVendor",
      "externalRepoCopy",
      "hermesSourceCopy",
      "cuaDriverSourceCopy",
      "promptGuideImport",
      "glossopetraeImport"
    ]
  },
  {
    classification:
      "hidden_backend_api_server_semantics_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected",
    fields: [
      "backendApiMiddleware",
      "apiRequestHandler",
      "httpServer",
      "serverMiddleware",
      "httpEndpoint",
      "runtimeEndpoint"
    ]
  },
  {
    classification:
      "hidden_database_storage_cache_write_semantics_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected",
    fields: [
      "databaseUrl",
      "databaseDsn",
      "dbConnectionString",
      "storageAdapter",
      "cacheEngine",
      "writeQueue",
      "persistenceLayer",
      "filesystemWrite"
    ]
  },
  {
    classification:
      "hidden_auth_session_token_api_key_semantics_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected",
    fields: [
      "loginUrl",
      "sessionCookie",
      "sessionStore",
      "sessionToken",
      "apiKey",
      "oauthToken",
      "authHeader"
    ]
  },
  {
    classification:
      "hidden_connector_grant_semantics_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected",
    fields: [
      "connectorGrant",
      "connectorCredential",
      "connectorAccessToken",
      "connectorComplianceGrant"
    ]
  },
  {
    classification:
      "hidden_fabric_websocket_http_mcp_task_runtime_semantics_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected",
    fields: [
      "fabricBus",
      "websocketUrl",
      "httpTransport",
      "mcpRuntime",
      "mcpServer",
      "mcpTool",
      "taskRunner",
      "taskQueue"
    ]
  },
  {
    classification:
      "hidden_secure_drop_implementation_semantics_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected",
    fields: [
      "secureDropKeyring",
      "secureDropCrypto",
      "secureDropTransport",
      "secureDropInbox",
      "secureDropFilePicker",
      "st3ggWrapper"
    ]
  },
  {
    classification:
      "hidden_encoded_handoff_codec_translator_stego_covert_channel_tokenizer_exploit_bypass_semantics_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected",
    fields: [
      "encodedHandoffRuntime",
      "codecRuntime",
      "translatorRuntime",
      "encoderRuntime",
      "decoderRuntime",
      "stegoChannel",
      "covertChannel",
      "tokenizerExploit",
      "bypassPayload"
    ]
  },
  {
    classification:
      "hidden_hermes_cua_computer_use_runtime_semantics_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected",
    fields: [
      "hermesRuntime",
      "cuaDriverRuntime",
      "computerUseRuntime",
      "desktopControl",
      "browserControl",
      "inputAutomation"
    ]
  },
  {
    classification:
      "hidden_infrastructure_deployment_compliance_pii_retention_export_semantics_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected",
    fields: [
      "terraformPlan",
      "deployCommand",
      "cloudProvider",
      "complianceEnforcer",
      "piiProcessor",
      "retentionScheduler",
      "exportJob",
      "policyEngine"
    ]
  },
  {
    classification:
      "hidden_testing_ci_release_automation_semantics_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected",
    fields: [
      "testRunner",
      "ciPipeline",
      "githubActionsWorkflow",
      "releaseAutomation",
      "artifactUpload",
      "packageExport"
    ]
  }
]);

function maintenanceGovernanceBoundaryMapInputRecord(input) {
  return isPlainObjectRecord(input) ? input : null;
}

function maintenanceGovernanceBoundaryMapReviewedAt(inputRecord) {
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

function maintenanceGovernanceBoundaryMapContainsTrue(value) {
  if (value === true) {
    return true;
  }

  if (Array.isArray(value)) {
    return value.some(maintenanceGovernanceBoundaryMapContainsTrue);
  }

  if (isPlainObjectRecord(value)) {
    return Object.values(value).some(
      maintenanceGovernanceBoundaryMapContainsTrue
    );
  }

  return false;
}

function maintenanceGovernanceBoundaryMapHasTrueFieldDeep(value, fields) {
  if (Array.isArray(value)) {
    return value.some((item) =>
      maintenanceGovernanceBoundaryMapHasTrueFieldDeep(item, fields)
    );
  }

  if (!isPlainObjectRecord(value)) {
    return false;
  }

  for (const [key, nested] of Object.entries(value)) {
    if (fields.includes(key) && nested === true) {
      return true;
    }

    if (maintenanceGovernanceBoundaryMapHasTrueFieldDeep(nested, fields)) {
      return true;
    }
  }

  return false;
}

function maintenanceGovernanceBoundaryMapHasPresentFieldDeep(value, fields) {
  if (Array.isArray(value)) {
    return value.some((item) =>
      maintenanceGovernanceBoundaryMapHasPresentFieldDeep(item, fields)
    );
  }

  if (!isPlainObjectRecord(value)) {
    return false;
  }

  for (const [key, nested] of Object.entries(value)) {
    if (
      key === "explicitBlockedAuthorizationFlags" ||
      key === "unsafeMaintenanceGovernanceRuntimeFlags"
    ) {
      continue;
    }

    if (fields.includes(key)) {
      return true;
    }

    if (maintenanceGovernanceBoundaryMapHasPresentFieldDeep(nested, fields)) {
      return true;
    }
  }

  return false;
}

function maintenanceGovernanceBoundaryMapEntriesInput(inputRecord) {
  return Array.isArray(inputRecord?.boundaryEntries)
    ? inputRecord.boundaryEntries
    : null;
}

function maintenanceGovernanceBoundaryMapMalformed(inputRecord) {
  return (
    inputRecord === null ||
    (Object.prototype.hasOwnProperty.call(inputRecord, "reviewedAt") &&
      !isUtcIsoTimestampWithMilliseconds(inputRecord.reviewedAt)) ||
    (Object.prototype.hasOwnProperty.call(inputRecord, "boundaryEntries") &&
      !Array.isArray(inputRecord.boundaryEntries))
  );
}

function maintenanceGovernanceBoundaryMapEntryIssue(entries, predicate) {
  return entries !== null && entries.some((entry) => predicate(entry));
}

function maintenanceGovernanceBoundaryMapMissingRequired(entry) {
  return (
    !isPlainObjectRecord(entry) ||
    MAINTENANCE_GOVERNANCE_REQUIRED_FIELDS.some(
      (field) => !Object.prototype.hasOwnProperty.call(entry, field)
    )
  );
}

function maintenanceGovernanceBoundaryMapEntryMalformed(entry) {
  if (!isPlainObjectRecord(entry)) {
    return true;
  }

  return (
    typeof entry.boundaryId !== "string" ||
    !Array.isArray(entry.allowedCurrentBehavior) ||
    !Array.isArray(entry.forbiddenCurrentBehavior) ||
    typeof entry.requiredFutureContractBeforeImplementation !== "string" ||
    typeof entry.requiredFutureAuthorizationPhaseBeforeRuntime !== "string" ||
    typeof entry.governanceExpectation !== "string" ||
    typeof entry.adrEvidenceExpectation !== "string" ||
    typeof entry.dependencyPolicyExpectation !== "string" ||
    typeof entry.waiverExceptionExpectation !== "string" ||
    typeof entry.reviewOwnershipExpectation !== "string" ||
    typeof entry.releaseVersioningExpectation !== "string" ||
    typeof entry.toolkitEvidenceExpectation !== "string" ||
    typeof entry.graphifyMemoryExpectation !== "string" ||
    typeof entry.externalReferenceProvenanceExpectation !== "string" ||
    typeof entry.locusRoleDescription !== "string" ||
    typeof entry.multiverseRoleDescription !== "string" ||
    typeof entry.fabricRoleDescription !== "string" ||
    !isPlainObjectRecord(entry.explicitBlockedAuthorizationFlags) ||
    !isPlainObjectRecord(entry.unsafeMaintenanceGovernanceRuntimeFlags) ||
    entry.nonAuthorizingProof !== true
  );
}

function maintenanceGovernanceBoundaryMapAuthorizationFlagEnabled(value) {
  if (!isPlainObjectRecord(value)) {
    return false;
  }

  return (
    (isPlainObjectRecord(value.explicitBlockedAuthorizationFlags) &&
      Object.values(value.explicitBlockedAuthorizationFlags).some(
        (flag) => flag !== false
      )) ||
    MAINTENANCE_GOVERNANCE_AUTHORIZATION_FIELDS.some(
      (field) => value[field] === true
    )
  );
}

function maintenanceGovernanceBoundaryMapUnsafeFlagEnabled(value) {
  if (!isPlainObjectRecord(value)) {
    return false;
  }

  return (
    (isPlainObjectRecord(value.unsafeMaintenanceGovernanceRuntimeFlags) &&
      Object.values(value.unsafeMaintenanceGovernanceRuntimeFlags).some(
        (flag) => flag !== false
      )) ||
    maintenanceGovernanceBoundaryMapHasTrueFieldDeep(
      value,
      MAINTENANCE_GOVERNANCE_UNSAFE_FIELDS
    )
  );
}

function maintenanceGovernanceBoundaryMapCanonical(entries) {
  if (entries === null) {
    return true;
  }

  return (
    JSON.stringify(entries) ===
    JSON.stringify(maintenanceGovernanceBoundaryMapEntries())
  );
}

function maintenanceGovernanceBoundaryMapInputClassification(inputRecord) {
  if (maintenanceGovernanceBoundaryMapMalformed(inputRecord)) {
    return MALFORMED_MAINTENANCE_GOVERNANCE_ADR_DEPENDENCY_POLICY_CONTRACT_BOUNDARY_MAP_CLASSIFICATION;
  }

  const entries = maintenanceGovernanceBoundaryMapEntriesInput(inputRecord);

  if (
    maintenanceGovernanceBoundaryMapEntryIssue(
      entries,
      maintenanceGovernanceBoundaryMapMissingRequired
    )
  ) {
    return "missing_required_maintenance_governance_adr_dependency_policy_contract_boundary_entry_rejected";
  }

  if (
    maintenanceGovernanceBoundaryMapEntryIssue(
      entries,
      (entry) =>
        !MAINTENANCE_GOVERNANCE_BOUNDARY_FAMILIES.includes(
          entry.boundaryFamily
        )
    )
  ) {
    return "unknown_boundary_family_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected";
  }

  if (
    maintenanceGovernanceBoundaryMapEntryIssue(
      entries,
      (entry) =>
        !MAINTENANCE_GOVERNANCE_RELATED_SYSTEMS.includes(entry.relatedSystem)
    )
  ) {
    return "unknown_related_system_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected";
  }

  if (
    maintenanceGovernanceBoundaryMapEntryIssue(
      entries,
      (entry) => !MAINTENANCE_GOVERNANCE_STATUSES.includes(entry.currentStatus)
    )
  ) {
    return "unknown_current_status_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected";
  }

  if (
    maintenanceGovernanceBoundaryMapEntryIssue(
      entries,
      maintenanceGovernanceBoundaryMapEntryMalformed
    )
  ) {
    return MALFORMED_MAINTENANCE_GOVERNANCE_ADR_DEPENDENCY_POLICY_CONTRACT_BOUNDARY_MAP_CLASSIFICATION;
  }

  if (
    MAINTENANCE_GOVERNANCE_AUTHORIZATION_FIELDS.some(
      (field) => inputRecord[field] === true
    )
  ) {
    return "runtime_authorization_attempt_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected";
  }

  if (
    maintenanceGovernanceBoundaryMapEntryIssue(
      entries,
      maintenanceGovernanceBoundaryMapAuthorizationFlagEnabled
    ) ||
    maintenanceGovernanceBoundaryMapAuthorizationFlagEnabled(inputRecord)
  ) {
    return "authorization_flags_enabled_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected";
  }

  if (
    maintenanceGovernanceBoundaryMapHasTrueFieldDeep(inputRecord, [
      "reportRunsChecks"
    ])
  ) {
    return "report_runs_checks_true_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected";
  }

  if (
    maintenanceGovernanceBoundaryMapHasTrueFieldDeep(
      inputRecord,
      MAINTENANCE_GOVERNANCE_AUTHORIZATION_FIELDS
    )
  ) {
    return "runtime_authorization_attempt_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected";
  }

  if (
    maintenanceGovernanceBoundaryMapHasTrueFieldDeep(
      inputRecord,
      MAINTENANCE_GOVERNANCE_COMMAND_FIELDS
    )
  ) {
    return "command_exposure_attempt_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected";
  }

  if (
    maintenanceGovernanceBoundaryMapHasTrueFieldDeep(
      inputRecord,
      MAINTENANCE_GOVERNANCE_BLOCKED_CLI_BYPASS_FIELDS
    )
  ) {
    return "blocked_cli_bypass_attempt_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected";
  }

  for (const {
    classification,
    fields
  } of MAINTENANCE_GOVERNANCE_HIDDEN_FIELD_GROUPS) {
    if (
      maintenanceGovernanceBoundaryMapHasPresentFieldDeep(inputRecord, fields)
    ) {
      return classification;
    }
  }

  if (
    maintenanceGovernanceBoundaryMapUnsafeFlagEnabled(inputRecord) ||
    maintenanceGovernanceBoundaryMapEntryIssue(
      entries,
      maintenanceGovernanceBoundaryMapUnsafeFlagEnabled
    )
  ) {
    return "unsafe_maintenance_governance_runtime_flags_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected";
  }

  if (
    maintenanceGovernanceBoundaryMapEntryIssue(entries, (entry) =>
      maintenanceGovernanceBoundaryMapContainsTrue(entry?.runtimeEffect)
    ) ||
    maintenanceGovernanceBoundaryMapContainsTrue(inputRecord?.runtimeEffect)
  ) {
    return "nested_unsafe_flags_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected";
  }

  if (
    Object.keys(inputRecord).some(
      (field) =>
        !MAINTENANCE_GOVERNANCE_ALLOWED_TOP_LEVEL_FIELDS.includes(field)
    )
  ) {
    return "unknown_top_level_field_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected";
  }

  if (!maintenanceGovernanceBoundaryMapCanonical(entries)) {
    return "noncanonical_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected";
  }

  return VALID_MAINTENANCE_GOVERNANCE_ADR_DEPENDENCY_POLICY_CONTRACT_BOUNDARY_MAP_CLASSIFICATION;
}

function maintenanceGovernanceBoundaryMapAuthorizationFlags() {
  return {
    runtimeAuthorizationGranted: false,
    maintenanceGovernanceAuthorizationGranted: false,
    adrGeneratorAuthorizationGranted: false,
    diagramGeneratorAuthorizationGranted: false,
    dependencyUpdateAutomationAuthorizationGranted: false,
    vulnerabilityPatchAutomationAuthorizationGranted: false,
    releasePublishingAuthorizationGranted: false,
    ciModificationAuthorizationGranted: false,
    policyEngineAuthorizationGranted: false,
    waiverAutomationAuthorizationGranted: false,
    graphifyMutationAuthorizationGranted: false,
    codeModeRuntimeAuthorizationGranted: false,
    subagentRuntimeAuthorizationGranted: false,
    julesAutomationAuthorizationGranted: false,
    externalRepoVendoringAuthorizationGranted: false,
    commandExposureAuthorizationGranted: false,
    backendApiServerAuthorizationGranted: false,
    databaseStorageAuthorizationGranted: false,
    fabricRuntimeAuthorizationGranted: false,
    secureDropAuthorizationGranted: false,
    encodedHandoffRuntimeAuthorizationGranted: false,
    approvalDecisionProduced: false,
    approvalGrantProduced: false,
    authorizesRuntime: false
  };
}

function maintenanceGovernanceBoundaryMapFalseRuntimeFields() {
  return Object.fromEntries(
    MAINTENANCE_GOVERNANCE_UNSAFE_FIELDS.map((field) => [field, false])
  );
}

function maintenanceGovernanceBoundaryMapNotes() {
  return {
    authorization:
      "Requires a future explicit authorization phase before any ADR generator, diagram generator, dependency update automation, vulnerability patching, release publishing, CI modification, policy engine, waiver automation, Graphify mutation, Code Mode runtime, subagent runtime, Jules automation, external repo vendoring/copying, package/deployment behavior, backend/API/server behavior, storage write, Fabric, Secure Drop, encoded handoff, Hermes/CUA/computer-use, logger/audit/telemetry, health-check, infrastructure, testing/CI/release automation, filesystem, process, UI, or command behavior.",
    governance:
      "Future governance must define decision authority, owner roles, review cadence, exception handling, release gates, evidence retention, and fail-closed defaults before implementation.",
    adr:
      "Future ADR/evidence handling must define when architecture decisions are required, durable evidence paths, review ownership, supersession rules, and diagram update triggers before any generator or automation.",
    dependency:
      "Future dependency policy must define allowed ecosystems, update cadence, lockfile ownership, audit evidence, vulnerability triage, patch approval, rollback, and no-live-update defaults before automation.",
    waiver:
      "Future waiver/exception policy must define owner, scope, expiry, compensating controls, re-review, release blocking, and public report visibility before any waiver automation.",
    review:
      "Future review ownership must preserve one narrow Codex read-only reviewer by default, allow reuse only after concrete fixes, avoid polling/no-op subagents, and require Jules only for unresolved blockers, major security concerns, or milestone-level review.",
    release:
      "Future release/versioning policy must define semantic versioning, changelog, compatibility, release blocker, publishing, rollback, and consumer notification contracts before any release automation.",
    toolkit:
      "Installed cleanup/security tooling may provide advisory evidence when useful, but this phase does not force every tool every phase and never invokes Fallow Runtime.",
    graphify:
      "Graphify memory is optional outside-repo evidence only unless a future repo pattern explicitly commits it; no secrets, runtime config, or in-repo mutation is authorized.",
    external:
      "External references such as Hermes, CUA driver, GLOSSOPETRAE, fainir prompt guides, Goose, Onyx, OpenClaw-like references, and similar repos are category/provenance references only, never installed, vendored, copied, imported, migrated, or integrated by this phase.",
    locus:
      "Locus may later display governance status after a separate Locus-owned UI/control-surface contract; Ardyn creates no Locus integration or UI.",
    multiverse:
      "Multiverse may later consume governance metadata after a separate Multiverse-owned contract; Ardyn executes no task and creates no bridge.",
    fabric:
      "Content Fabric remains the canonical owner for Fabric coordination and Secure Drop implementation boundaries; Ardyn creates no Fabric, Secure Drop, transport, codec, backend, or task runtime."
  };
}

function maintenanceGovernanceBoundaryMapDefinition(definition) {
  const notes = maintenanceGovernanceBoundaryMapNotes();

  return {
    ...definition,
    governanceExpectation: notes.governance,
    adrEvidenceExpectation: notes.adr,
    dependencyPolicyExpectation: notes.dependency,
    waiverExceptionExpectation: notes.waiver,
    reviewOwnershipExpectation: notes.review,
    releaseVersioningExpectation: notes.release,
    toolkitEvidenceExpectation: notes.toolkit,
    graphifyMemoryExpectation: notes.graphify,
    externalReferenceProvenanceExpectation: notes.external,
    allowedCurrentBehavior: [
      `Describe ${definition.subject} maintenance/governance boundary metadata.`,
      "Reference prior Phase 5 boundary artifacts as review-only metadata.",
      "Keep current behavior review-only, metadata-only, non-authorizing, and runtime-blocked."
    ],
    forbiddenCurrentBehavior:
      maintenanceGovernanceBoundaryMapForbiddenBehavior(),
    requiredFutureContractBeforeImplementation: `A future ${definition.subject} contract must define governance authority, ADR/evidence rules, dependency and waiver policy, release/versioning gates, review ownership, external-reference provenance, operator visibility, audit/evidence retention, deny-path semantics, and explicit no-runtime defaults before implementation.`,
    requiredFutureAuthorizationPhaseBeforeRuntime: notes.authorization,
    locusRoleDescription: notes.locus,
    multiverseRoleDescription: notes.multiverse,
    fabricRoleDescription: notes.fabric
  };
}

function maintenanceGovernanceBoundaryMapDefinitions() {
  const rows = [
    [
      "phase5-71.ardyn.adr_policy.architectural_decision_boundary",
      "adr_contract",
      "ardyn",
      "future_contract_required",
      "ADR policy boundary for architectural decisions"
    ],
    [
      "phase5-71.ardyn.architecture_diagram.update_boundary",
      "architecture_diagram_contract",
      "ardyn",
      "future_contract_required",
      "architecture diagram and update boundary"
    ],
    [
      "phase5-71.repo_family.production_readiness_governance.phase548_through_570_boundary",
      "governance_policy_contract",
      "repo-family",
      "metadata_only",
      "production-readiness governance boundary across Phases 5.48 through 5.70"
    ],
    [
      "phase5-71.ardyn.dependency_update_policy.boundary",
      "dependency_policy_contract",
      "ardyn",
      "future_contract_required",
      "dependency update policy boundary"
    ],
    [
      "phase5-71.ardyn.vulnerability_patch_policy.boundary",
      "vulnerability_patch_policy_contract",
      "ardyn",
      "future_contract_required",
      "vulnerability patch policy boundary"
    ],
    [
      "phase5-71.external_harness.dependency_audit_evidence.phase548_563_569_boundary",
      "dependency_policy_contract",
      "external-harness",
      "covered_by_existing_validation",
      "dependency audit evidence boundary from Phases 5.48, 5.63, and 5.69"
    ],
    [
      "phase5-71.ardyn.waiver_exception_policy.boundary",
      "waiver_policy_contract",
      "ardyn",
      "future_contract_required",
      "waiver and exception policy boundary for known findings"
    ],
    [
      "phase5-71.repo_family.release_governance.boundary",
      "release_governance_contract",
      "repo-family",
      "future_contract_required",
      "release governance boundary"
    ],
    [
      "phase5-71.repo_family.versioning_policy.boundary",
      "versioning_policy_contract",
      "repo-family",
      "future_contract_required",
      "versioning policy boundary"
    ],
    [
      "phase5-71.ardyn.ownership_maintainer.boundary",
      "ownership_contract",
      "ardyn",
      "future_contract_required",
      "ownership and maintainer boundary"
    ],
    [
      "phase5-71.ardyn.review_policy.boundary",
      "review_policy_contract",
      "ardyn",
      "metadata_only",
      "review policy boundary"
    ],
    [
      "phase5-71.external_harness.jules_review.boundary",
      "jules_review_boundary",
      "external-harness",
      "blocked",
      "Jules review boundary"
    ],
    [
      "phase5-71.ardyn_subagent.codex_read_only_review.boundary",
      "subagent_review_boundary",
      "ardyn-subagent",
      "metadata_only",
      "subagent review boundary"
    ],
    [
      "phase5-71.external_harness.cleanup_security_toolkit_usage.boundary",
      "toolkit_usage_boundary",
      "external-harness",
      "metadata_only",
      "toolkit usage boundary for installed cleanup and security tooling"
    ],
    [
      "phase5-71.external_harness.graphify_memory.boundary",
      "graphify_memory_boundary",
      "external-harness",
      "blocked",
      "Graphify memory boundary"
    ],
    [
      "phase5-71.ardyn.code_mode_governance.boundary",
      "code_mode_governance_boundary",
      "ardyn",
      "blocked",
      "Code Mode governance boundary"
    ],
    [
      "phase5-71.hermes_reference.external_reference_policy.boundary",
      "external_reference_policy_contract",
      "hermes-reference",
      "blocked",
      "external reference policy boundary for Hermes-style references"
    ],
    [
      "phase5-71.cua_driver_reference.external_reference_policy.boundary",
      "external_reference_policy_contract",
      "cua-driver-reference",
      "blocked",
      "external reference policy boundary for CUA driver references"
    ],
    [
      "phase5-71.content_fabric.secure_drop_reference_policy.boundary",
      "external_reference_policy_contract",
      "content-fabric",
      "blocked",
      "external reference policy boundary for content-fabric and Secure Drop ownership"
    ],
    [
      "phase5-71.locus.consumer_governance.boundary",
      "ownership_contract",
      "locus",
      "future_contract_required",
      "Locus consumer governance boundary"
    ],
    [
      "phase5-71.multiverse.consumer_governance.boundary",
      "ownership_contract",
      "multiverse",
      "future_contract_required",
      "Multiverse consumer governance boundary"
    ],
    [
      "phase5-71.repo_family.per_repo_model_program.boundary",
      "governance_policy_contract",
      "repo-family",
      "future_contract_required",
      "post-launch Per-Repo Model Program boundary"
    ]
  ];

  return rows.map(
    ([boundaryId, boundaryFamily, relatedSystem, currentStatus, subject]) =>
      maintenanceGovernanceBoundaryMapDefinition({
        boundaryId,
        boundaryFamily,
        relatedSystem,
        currentStatus,
        subject,
        locusRoleDescription:
          relatedSystem === "locus"
            ? "Locus may later own governance display and control-surface status after a separate Locus contract; Ardyn creates no UI, bridge, or Locus integration."
            : maintenanceGovernanceBoundaryMapNotes().locus,
        multiverseRoleDescription:
          relatedSystem === "multiverse"
            ? "Multiverse may later consume governance metadata after a separate Multiverse contract; Ardyn executes no task and creates no bridge."
            : maintenanceGovernanceBoundaryMapNotes().multiverse,
        fabricRoleDescription:
          relatedSystem === "content-fabric"
            ? "Content Fabric remains the canonical owner for Fabric coordination and Secure Drop implementation boundaries; Ardyn creates no Fabric, Secure Drop, transport, codec, backend, or task runtime."
            : maintenanceGovernanceBoundaryMapNotes().fabric
      })
  );
}

function maintenanceGovernanceBoundaryMapEntry(definition) {
  return {
    ...definition,
    productionReadinessAreaReference: {
      phase: "5.48",
      areaNumber: 17,
      areaName: "Maintenance & Governance",
      sourceFixture:
        "tests/fixtures/host-policy/phase5-48/production-readiness-coverage-matrix.json",
      sourceStatus: "deferred",
      representedByPhase571: true,
      authorizesRuntime: false
    },
    maintenanceGovernanceBoundaryMetadataOnly: true,
    noLiveMaintenanceGovernanceRuntimePerformed: true,
    explicitBlockedAuthorizationFlags:
      maintenanceGovernanceBoundaryMapAuthorizationFlags(),
    unsafeMaintenanceGovernanceRuntimeFlags:
      maintenanceGovernanceBoundaryMapFalseRuntimeFields(),
    nonAuthorizingProof: true,
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

function maintenanceGovernanceBoundaryMapEntries() {
  return maintenanceGovernanceBoundaryMapDefinitions().map(
    maintenanceGovernanceBoundaryMapEntry
  );
}

function maintenanceGovernanceBoundaryMapSummary(entries) {
  const countByFamily = Object.fromEntries(
    MAINTENANCE_GOVERNANCE_BOUNDARY_FAMILIES.map((family) => [
      family,
      entries.filter((entry) => entry.boundaryFamily === family).length
    ])
  );
  const countByRelatedSystem = Object.fromEntries(
    MAINTENANCE_GOVERNANCE_RELATED_SYSTEMS.map((system) => [
      system,
      entries.filter((entry) => entry.relatedSystem === system).length
    ])
  );
  const countByStatus = Object.fromEntries(
    MAINTENANCE_GOVERNANCE_STATUSES.map((status) => [
      status,
      entries.filter((entry) => entry.currentStatus === status).length
    ])
  );
  const allBlockedAuthorizationFlagsFalse = entries.every((entry) =>
    Object.values(entry.explicitBlockedAuthorizationFlags).every(
      (value) => value === false
    )
  );
  const allUnsafeMaintenanceGovernanceRuntimeFlagsFalse = entries.every(
    (entry) =>
      Object.values(entry.unsafeMaintenanceGovernanceRuntimeFlags).every(
        (value) => value === false
      )
  );
  const allRuntimeEffectsFalse = entries.every((entry) =>
    Object.values(entry.runtimeEffect).every((value) => value === false)
  );

  return {
    boundaryMapKind:
      MAINTENANCE_GOVERNANCE_ADR_DEPENDENCY_POLICY_CONTRACT_BOUNDARY_MAP_KIND,
    boundaryEntryCount: entries.length,
    countByFamily,
    countByRelatedSystem,
    countByStatus,
    boundaryFamilies: [...MAINTENANCE_GOVERNANCE_BOUNDARY_FAMILIES],
    relatedSystems: [...MAINTENANCE_GOVERNANCE_RELATED_SYSTEMS],
    currentStatusValues: [...MAINTENANCE_GOVERNANCE_STATUSES],
    phase548MaintenanceGovernanceCoverageItemRepresented: true,
    maintenanceGovernanceBoundaryMetadataOnly: true,
    noLiveMaintenanceGovernanceRuntimePerformed: true,
    adrPolicyBoundaryRecorded: true,
    architectureDiagramUpdateBoundaryRecorded: true,
    dependencyUpdatePolicyBoundaryRecorded: true,
    vulnerabilityPatchPolicyBoundaryRecorded: true,
    dependencyAuditEvidenceBoundaryRecorded: true,
    waiverExceptionPolicyBoundaryRecorded: true,
    releaseGovernanceVersioningPolicyBoundaryRecorded: true,
    ownershipMaintainerBoundaryRecorded: true,
    externalReferencePolicyBoundaryRecorded: true,
    toolkitUsageBoundaryRecorded: true,
    subagentReviewBoundaryRecorded: true,
    julesReviewBoundaryRecorded: true,
    graphifyMemoryBoundaryRecorded: true,
    codeModeGovernanceBoundaryRecorded: true,
    productionReadinessGovernanceBoundaryRecorded: true,
    perRepoModelProgramBoundaryRecorded: true,
    noAdrGenerator: true,
    noDiagramGenerator: true,
    noDependencyUpdateBot: true,
    noVulnerabilityPatchAutomation: true,
    noReleasePublishingCiModification: true,
    noWaiverAutomationPolicyEngine: true,
    noGraphifyMutation: true,
    noCodeModeRuntime: true,
    noSubagentRuntimeJulesAutomation: true,
    noExternalRepoVendoringCopying: true,
    noPackageDeploymentBehavior: true,
    noRuntimeIntegrationBackendStorageBehavior: true,
    noFabricSecureDropEncodedHandoffRuntime: true,
    noHermesCuaComputerUseRuntime: true,
    noLoggerAuditTelemetryHealthInfrastructureRuntime: true,
    noTestingCiReleaseAutomation: true,
    noCommandExposure: true,
    noBlockedCliBypass: true,
    allBlockedAuthorizationFlagsFalse,
    allUnsafeMaintenanceGovernanceRuntimeFlagsFalse,
    allRuntimeEffectsFalse,
    allEntriesNonAuthorizing: entries.every(
      (entry) => entry.nonAuthorizingProof === true
    )
  };
}

function maintenanceGovernanceBoundaryMapValidationRules() {
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
    enabledAdrDiagramGeneratorFailClosed: true,
    enabledDependencyUpdatePatchAutomationFailClosed: true,
    enabledReleasePublishingCiModificationFailClosed: true,
    enabledWaiverAutomationPolicyEngineFailClosed: true,
    enabledGraphifyMutationFailClosed: true,
    enabledCodeModeRuntimeFailClosed: true,
    enabledSubagentJulesAutomationFailClosed: true,
    enabledExternalRepoVendoringCopyingFailClosed: true,
    enabledPackageDeploymentRuntimeFailClosed: true,
    hiddenDependencyUpdatePatchExecutionSemanticsFailClosed: true,
    hiddenReleaseCiPublishingAutomationSemanticsFailClosed: true,
    hiddenGraphifyMemoryMutationSemanticsFailClosed: true,
    hiddenCodeModeRuntimeSemanticsFailClosed: true,
    hiddenSubagentJulesAutomationSemanticsFailClosed: true,
    hiddenExternalReferenceVendoringCopyingSemanticsFailClosed: true,
    hiddenBackendApiServerSemanticsFailClosed: true,
    hiddenDatabaseStorageCacheWriteSemanticsFailClosed: true,
    hiddenAuthSessionTokenApiKeySemanticsFailClosed: true,
    hiddenConnectorGrantSemanticsFailClosed: true,
    hiddenFabricWebsocketHttpMcpTaskRuntimeSemanticsFailClosed: true,
    hiddenSecureDropImplementationSemanticsFailClosed: true,
    hiddenEncodedHandoffCodecTranslatorStegoCovertChannelTokenizerExploitBypassSemanticsFailClosed:
      true,
    hiddenHermesCuaComputerUseRuntimeSemanticsFailClosed: true,
    hiddenInfrastructureDeploymentCompliancePiiRetentionExportSemanticsFailClosed:
      true,
    hiddenTestingCiReleaseAutomationSemanticsFailClosed: true,
    nestedUnsafeFlagsFailClosed: true,
    noncanonicalBoundaryEntriesFailClosed: true,
    validationRunsMaintenanceGovernanceRuntime: false,
    validationCreatesAdrGenerator: false,
    validationCreatesDependencyUpdateBot: false,
    validationRunsGraphifyMutation: false,
    validationRunsCodeMode: false,
    validationRequestsJules: false
  };
}

function maintenanceGovernanceBoundaryMapGaps() {
  return [
    "Future governance still needs explicit ADR, architecture diagram, ownership, maintainer, review, release, versioning, waiver, and exception contracts before automation.",
    "Future dependency policy still needs update cadence, vulnerability triage, patch approval, rollback, waiver expiry, and audit evidence ownership before any dependency bot or patch automation.",
    "Future review governance still needs Codex subagent reuse rules, Jules escalation criteria, Graphify memory handling, and no-op/polling prohibitions formalized as contracts.",
    "Future Code Mode governance still needs orchestrator plan loop, self-subagent, optional mini-fusion, judge, front-desk model, human relay, and disabled-model fallback contracts before runtime.",
    "Future secrets-management, key rotation, Fabric/API/backend governance, and Per-Repo Model Program boundaries remain separate phases with no Ardyn training, deployment, or package behavior."
  ];
}

function maintenanceGovernanceBoundaryMapState(reviewedAt) {
  const boundaryEntries = maintenanceGovernanceBoundaryMapEntries();

  return {
    schema:
      MAINTENANCE_GOVERNANCE_ADR_DEPENDENCY_POLICY_CONTRACT_BOUNDARY_MAP_STATE_SCHEMA,
    schemaVersion:
      MAINTENANCE_GOVERNANCE_ADR_DEPENDENCY_POLICY_CONTRACT_BOUNDARY_MAP_VERSION,
    stateKind:
      MAINTENANCE_GOVERNANCE_ADR_DEPENDENCY_POLICY_CONTRACT_BOUNDARY_MAP_KIND,
    stateMode: "review-only",
    reviewedAt,
    sourcePhaseContext: {
      phase548ProductionReadinessCoverageMatrix:
        "tests/fixtures/host-policy/phase5-48/production-readiness-coverage-matrix.json",
      phase548MaintenanceGovernanceAreaNumber: 17,
      phase548MaintenanceGovernanceStatus: "deferred",
      phase559FabricAwareApiBackendBoundary:
        "tests/fixtures/host-policy/phase5-59/fabric-aware-api-backend-contract-boundary-map.json",
      phase560InterAgentEncodedHandoffConformance:
        "tests/fixtures/host-policy/phase5-60/inter-agent-encoded-handoff-conformance.json",
      phase561DatabaseStorageContractBoundary:
        "tests/fixtures/host-policy/phase5-61/database-storage-contract-boundary-map.json",
      phase562AuthPermissionsContractBoundary:
        "tests/fixtures/host-policy/phase5-62/auth-permissions-contract-boundary-map.json",
      phase563SecurityRlsInputSanitizationContractBoundary:
        "tests/fixtures/host-policy/phase5-63/security-rls-input-sanitization-contract-boundary-map.json",
      phase564RateLimitingAbuseControlContractBoundary:
        "tests/fixtures/host-policy/phase5-64/rate-limiting-abuse-control-contract-boundary-map.json",
      phase565ErrorTrackingLoggingAuditIntegrityContractBoundary:
        "tests/fixtures/host-policy/phase5-65/error-tracking-logging-audit-integrity-contract-boundary-map.json",
      phase566AvailabilityRecoveryContractBoundary:
        "tests/fixtures/host-policy/phase5-66/availability-recovery-contract-boundary-map.json",
      phase567InfrastructureComplianceDataRetentionBoundary:
        "tests/fixtures/host-policy/phase5-67/infrastructure-compliance-data-retention-contract-boundary-map.json",
      phase568AgentModeProfileSkillhubCapabilityBoundary:
        "tests/fixtures/host-policy/phase5-68/agent-mode-profile-skillhub-capability-boundary-map.json",
      phase569TestingFrameworksQualityGatesBoundary:
        "tests/fixtures/host-policy/phase5-69/testing-frameworks-quality-gates-contract-boundary-map.json",
      phase570OperationsReliabilityBoundary:
        "tests/fixtures/host-policy/phase5-70/operations-reliability-contract-boundary-map.json",
      maintenanceGovernanceCoverageItemRepresented: true,
      productionReadinessMaintenanceGovernanceItemDeferred: true,
      noMaintenanceGovernanceRuntimeImplemented: true,
      noDependencyUpdatePatchAutomationImplemented: true,
      noReleasePublishingCiModificationImplemented: true,
      noCodeModeRuntimeImplemented: true,
      runtimeStillBlocked: true
    },
    boundaryEntries,
    boundaryMapSummary:
      maintenanceGovernanceBoundaryMapSummary(boundaryEntries),
    invalidBoundaryCasePolicy:
      maintenanceGovernanceBoundaryMapValidationRules(),
    topMaintenanceGovernanceSecretsCodeModeFabricApiBackendGaps:
      maintenanceGovernanceBoundaryMapGaps(),
    recommendedNextPhase:
      "phase-5.72-review-only-secrets-management-key-rotation-contract-boundary-map",
    maintenanceGovernanceAdrDependencyPolicyContractBoundaryMapOnly: true,
    reviewOnly: true,
    metadataOnly: true,
    authoritative: false,
    nonAuthorizingProof: true,
    reportRunsChecks: false,
    ...maintenanceGovernanceBoundaryMapFalseRuntimeFields(),
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

function maintenanceGovernanceBoundaryMapResult({
  reviewedAt,
  reviewedAtDefaulted,
  classification,
  accepted,
  maintenanceGovernanceAdrDependencyPolicyContractBoundaryMap
}) {
  return {
    schema:
      MAINTENANCE_GOVERNANCE_ADR_DEPENDENCY_POLICY_CONTRACT_BOUNDARY_MAP_SCHEMA,
    schemaVersion:
      MAINTENANCE_GOVERNANCE_ADR_DEPENDENCY_POLICY_CONTRACT_BOUNDARY_MAP_VERSION,
    maintenanceGovernanceAdrDependencyPolicyContractBoundaryMapKind:
      MAINTENANCE_GOVERNANCE_ADR_DEPENDENCY_POLICY_CONTRACT_BOUNDARY_MAP_KIND,
    maintenanceGovernanceAdrDependencyPolicyContractBoundaryMapMode:
      "review-only",
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    maintenanceGovernanceAdrDependencyPolicyContractBoundaryMapProduced:
      accepted,
    maintenanceGovernanceAdrDependencyPolicyContractBoundaryMap,
    boundaryMapSummary: accepted
      ? maintenanceGovernanceAdrDependencyPolicyContractBoundaryMap
          .boundaryMapSummary
      : null,
    boundaryEntries: accepted
      ? maintenanceGovernanceAdrDependencyPolicyContractBoundaryMap
          .boundaryEntries
      : [],
    invalidBoundaryCasePolicy: accepted
      ? maintenanceGovernanceAdrDependencyPolicyContractBoundaryMap
          .invalidBoundaryCasePolicy
      : maintenanceGovernanceBoundaryMapValidationRules(),
    topMaintenanceGovernanceSecretsCodeModeFabricApiBackendGaps: accepted
      ? maintenanceGovernanceAdrDependencyPolicyContractBoundaryMap
          .topMaintenanceGovernanceSecretsCodeModeFabricApiBackendGaps
      : [],
    recommendedNextPhase: accepted
      ? maintenanceGovernanceAdrDependencyPolicyContractBoundaryMap
          .recommendedNextPhase
      : null,
    maintenanceGovernanceAdrDependencyPolicyContractBoundaryMapOnly: true,
    reviewOnly: true,
    metadataOnly: true,
    authoritative: false,
    nonAuthorizingProof: true,
    reportRunsChecks: false,
    ...maintenanceGovernanceBoundaryMapFalseRuntimeFields(),
    rejectionReasons: accepted
      ? []
      : [
          {
            classification,
            rejected: true,
            runtimeAuthorized: false,
            maintenanceGovernanceRuntimeAuthorized: false,
            dependencyUpdateAutomationAuthorized: false,
            vulnerabilityPatchAutomationAuthorized: false,
            releasePublishingAuthorized: false,
            codeModeRuntimeAuthorized: false,
            julesAutomationAuthorized: false,
            commandExposureAuthorized: false,
            reportRunsChecks: false
          }
        ],
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

export function createMaintenanceGovernanceAdrDependencyPolicyContractBoundaryMapForReview(
  input = {}
) {
  const inputRecord = maintenanceGovernanceBoundaryMapInputRecord(input);
  const reviewedAt = maintenanceGovernanceBoundaryMapReviewedAt(inputRecord);
  const reviewedAtDefaulted = isReviewedAtDefaulted(inputRecord);
  const classification =
    maintenanceGovernanceBoundaryMapInputClassification(inputRecord);
  const accepted =
    classification ===
    VALID_MAINTENANCE_GOVERNANCE_ADR_DEPENDENCY_POLICY_CONTRACT_BOUNDARY_MAP_CLASSIFICATION;
  const maintenanceGovernanceAdrDependencyPolicyContractBoundaryMap = accepted
    ? maintenanceGovernanceBoundaryMapState(reviewedAt)
    : null;

  return maintenanceGovernanceBoundaryMapResult({
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    accepted,
    maintenanceGovernanceAdrDependencyPolicyContractBoundaryMap
  });
}

const SECRETS_MANAGEMENT_KEY_ROTATION_EXTERNAL_GATEWAY_CREDENTIAL_BOUNDARY_MAP_STATE_SCHEMA =
  "ardyn.phase-5.72.secrets-management-key-rotation-external-gateway-credential-boundary-map-state";
const VALID_SECRETS_MANAGEMENT_KEY_ROTATION_EXTERNAL_GATEWAY_CREDENTIAL_BOUNDARY_MAP_CLASSIFICATION =
  "valid_secrets_management_key_rotation_external_gateway_credential_boundary_map_runtime_still_blocked";
const MALFORMED_SECRETS_MANAGEMENT_KEY_ROTATION_EXTERNAL_GATEWAY_CREDENTIAL_BOUNDARY_MAP_CLASSIFICATION =
  "malformed_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected";

const SECRETS_CREDENTIAL_BOUNDARY_FAMILIES = Object.freeze([
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
const SECRETS_CREDENTIAL_RELATED_SYSTEMS = Object.freeze([
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
const SECRETS_CREDENTIAL_STATUSES = Object.freeze([
  "metadata_only",
  "blocked",
  "future_contract_required"
]);
const SECRETS_CREDENTIAL_REQUIRED_FIELDS = Object.freeze([
  "boundaryId",
  "boundaryFamily",
  "relatedSystem",
  "currentStatus",
  "allowedCurrentBehavior",
  "forbiddenCurrentBehavior",
  "requiredFutureContractBeforeImplementation",
  "requiredFutureAuthorizationPhaseBeforeRuntime",
  "credentialSubjectExpectation",
  "secretSourceProvenanceExpectation",
  "rotationRevocationExpectation",
  "storageNonStorageExpectation",
  "redactionExpectation",
  "auditExpectation",
  "leastPrivilegeExpectation",
  "localOnlyCloudOptInExpectation",
  "locusRoleDescription",
  "multiverseRoleDescription",
  "fabricRoleDescription",
  "secureDropRoleDescription",
  "matrixGatewayRoleDescription",
  "explicitBlockedAuthorizationFlags",
  "unsafeSecretsCredentialRuntimeFlags",
  "nonAuthorizingProof"
]);
const SECRETS_CREDENTIAL_ALLOWED_TOP_LEVEL_FIELDS = Object.freeze([
  "reviewedAt",
  "boundaryEntries"
]);
const SECRETS_CREDENTIAL_UNSAFE_FIELDS = Object.freeze([
  "runtimeExecutionEnabled",
  "runtimeAuthorizationEnabled",
  "runtimeCommandEnabled",
  "commandExposureEnabled",
  "commandRuntimeControlEnabled",
  "connectorGrantProduced",
  "fabricRuntimeImplementedByArdyn",
  "websocketHttpTransportImplementedByArdyn",
  "httpTransportImplementedByArdyn",
  "mcpRuntimeEnabled",
  "mcpToolExposureEnabled",
  "taskExecutionEnabled",
  "secureDropImplemented",
  "serviceDiscoveryEnabled",
  "scheduleEnforcementEnabled",
  "filesystemWriteEnabled",
  "filesystemScanningEnabled",
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
  "pathLookupRuntimeEnabled",
  "executableLookupRuntimeEnabled",
  "shellHistoryRuntimeEnabled",
  "sqliteRuntimeEnabled",
  "embeddedDbRuntimeEnabled",
  "queryEngineRuntimeEnabled",
  "sqliteKeyRuntimeEnabled",
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
  "failoverRuntimeImplemented",
  "infrastructureAutomationImplemented",
  "deploymentAutomationImplemented",
  "complianceEnforcementImplemented",
  "piiProcessingImplemented",
  "retentionJobImplemented",
  "exportJobImplemented",
  "testingCiReleaseAutomationEnabled",
  "hermesRuntimeEnabled",
  "cuaDriverRuntimeEnabled",
  "computerUseRuntimeEnabled",
  "agentModeRuntimeEnabled",
  "profileLoaderEnabled",
  "skillLoaderEnabled",
  "uiFrontendBrowserRenderingImplemented",
  "encodedHandoffRuntimeImplementedByArdyn",
  "codecRuntimeEnabled",
  "translatorRuntimeEnabled",
  "filesystemProcessRuntimeEnabled",
  "blockedCliBypassEnabled"
]);
const SECRETS_CREDENTIAL_AUTHORIZATION_FIELDS = Object.freeze([
  "runtimeAuthorized",
  "runtimeAuthorizationGranted",
  "authorizesRuntime",
  "secretsManagementAuthorizationGranted",
  "envIngestionAuthorizationGranted",
  "secretLoadingAuthorizationGranted",
  "vaultAccessAuthorizationGranted",
  "keyringDidAuthorizationGranted",
  "tokenLoaderAuthorizationGranted",
  "oauthSessionAuthorizationGranted",
  "credentialScannerAuthorizationGranted",
  "secretScannerAuthorizationGranted",
  "rotationJobAuthorizationGranted",
  "revocationJobAuthorizationGranted",
  "credentialExportAuthorizationGranted",
  "secretPersistenceAuthorizationGranted",
  "redactionRuntimeAuthorizationGranted",
  "matrixGatewayAuthorizationGranted",
  "e2eeKeyHandlingAuthorizationGranted",
  "externalGatewayAuthorizationGranted",
  "mcpPluginProviderCredentialAuthorizationGranted",
  "secureDropAuthorizationGranted",
  "fabricRuntimeAuthorizationGranted",
  "encodedHandoffRuntimeAuthorizationGranted",
  "hermesCuaComputerUseAuthorizationGranted",
  "shellRuntimeAuthorizationGranted",
  "sqliteRuntimeAuthorizationGranted",
  "backendApiServerAuthorizationGranted",
  "databaseStorageAuthorizationGranted",
  "commandExposureAuthorizationGranted",
  "connectorGrantAuthorizationGranted",
  "approvalDecisionProduced",
  "approvalGrantProduced"
]);
const SECRETS_CREDENTIAL_COMMAND_FIELDS = Object.freeze([
  "commandExposureEnabled",
  "commandRuntimeControlEnabled",
  "commandsExposed",
  "exposesCommands",
  "runtimeCommandEnabled",
  "cliCommandExposed"
]);
const SECRETS_CREDENTIAL_BLOCKED_CLI_BYPASS_FIELDS = Object.freeze([
  "blockedCliBypassEnabled",
  "dryRunBypassesBlock",
  "serveRuntimeBypassEnabled",
  "bypassBlockedCommandBehavior",
  "blockedCommandOverride"
]);
const SECRETS_CREDENTIAL_HIDDEN_FIELD_GROUPS = Object.freeze([
  {
    classification:
      "hidden_secret_env_vault_access_semantics_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected",
    fields: [
      "secretStore",
      "envSecretLoader",
      "envIngestionRuntime",
      "vaultClient",
      "vaultPath",
      "secretValue",
      "dotenvLoader",
      "secretPersistence"
    ]
  },
  {
    classification:
      "hidden_api_key_token_oauth_session_semantics_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected",
    fields: [
      "apiKey",
      "providerApiKey",
      "accessToken",
      "refreshToken",
      "oauthFlow",
      "oauthClientSecret",
      "sessionCookie",
      "sessionToken",
      "tokenLoader"
    ]
  },
  {
    classification:
      "hidden_matrix_gateway_credential_runtime_semantics_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected",
    fields: [
      "matrixClient",
      "matrixHomeserverUrl",
      "matrixRoomAllowlist",
      "matrixAccessToken",
      "matrixRefreshToken",
      "matrixGatewayRuntime"
    ]
  },
  {
    classification:
      "hidden_e2ee_key_session_handling_semantics_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected",
    fields: [
      "e2eeKey",
      "e2eeSession",
      "olmSession",
      "megolmSession",
      "deviceKeyStore",
      "messageDecryptionRuntime"
    ]
  },
  {
    classification:
      "hidden_mcp_plugin_provider_credential_runtime_semantics_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected",
    fields: [
      "mcpServerCredential",
      "mcpConnector",
      "pluginCredential",
      "providerCredential",
      "toolRegistryCredential",
      "connectorGrant"
    ]
  },
  {
    classification:
      "hidden_skillhub_install_trust_scanner_runtime_semantics_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected",
    fields: [
      "skillhubInstaller",
      "skillInstallRuntime",
      "skillTrustScanner",
      "skillSecurityScan",
      "skillRollbackRuntime",
      "toolInventoryScanner"
    ]
  },
  {
    classification:
      "hidden_secret_scanner_rotation_redaction_runtime_semantics_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected",
    fields: [
      "credentialScanner",
      "secretScanner",
      "rotationJob",
      "revocationJob",
      "redactionRuntime",
      "credentialExport",
      "secretRedactor"
    ]
  },
  {
    classification:
      "hidden_fabric_websocket_http_mcp_task_runtime_semantics_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected",
    fields: [
      "fabricBus",
      "fabricTransport",
      "websocketUrl",
      "httpTransport",
      "mcpRuntime",
      "mcpServer",
      "mcpTool",
      "taskRunner",
      "taskQueue"
    ]
  },
  {
    classification:
      "hidden_secure_drop_implementation_keyring_did_semantics_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected",
    fields: [
      "secureDropKeyring",
      "secureDropCrypto",
      "secureDropTransport",
      "secureDropInbox",
      "didKeyring",
      "recipientPrivateKey",
      "st3ggWrapper"
    ]
  },
  {
    classification:
      "hidden_encoded_handoff_runtime_codec_translator_stego_covert_channel_tokenizer_exploit_bypass_semantics_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected",
    fields: [
      "encodedHandoffRuntime",
      "codecRuntime",
      "translatorRuntime",
      "encoderRuntime",
      "decoderRuntime",
      "stegoChannel",
      "covertChannel",
      "tokenizerExploit",
      "bypassPayload"
    ]
  },
  {
    classification:
      "hidden_hermes_cua_computer_use_runtime_semantics_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected",
    fields: [
      "hermesRuntime",
      "cuaDriverRuntime",
      "computerUseRuntime",
      "desktopControl",
      "browserControl",
      "screenshotCapture",
      "accessibilityTreeAccess",
      "inputAutomation",
      "operatorApprovalSecret"
    ]
  },
  {
    classification:
      "hidden_shell_path_executable_env_history_runtime_semantics_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected",
    fields: [
      "shellRuntime",
      "pathLookup",
      "executableLookup",
      "shellHistory",
      "commandExecution",
      "pipeRuntime",
      "processSpawn"
    ]
  },
  {
    classification:
      "hidden_sqlite_embedded_db_query_key_runtime_semantics_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected",
    fields: [
      "sqliteRuntime",
      "embeddedDb",
      "sqliteKey",
      "databaseFile",
      "sqlParser",
      "queryEngine",
      "walRuntime"
    ]
  },
  {
    classification:
      "hidden_logger_audit_transcript_telemetry_external_sink_semantics_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected",
    fields: [
      "loggerRuntime",
      "auditWriterRuntime",
      "transcriptWriter",
      "telemetryClient",
      "externalSink",
      "errorReporter"
    ]
  },
  {
    classification:
      "hidden_backend_api_server_semantics_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected",
    fields: [
      "backendApiMiddleware",
      "apiRequestHandler",
      "httpServer",
      "serverMiddleware",
      "httpEndpoint",
      "runtimeEndpoint"
    ]
  },
  {
    classification:
      "hidden_database_storage_cache_write_semantics_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected",
    fields: [
      "databaseUrl",
      "databaseDsn",
      "dbConnectionString",
      "storageAdapter",
      "cacheEngine",
      "writeQueue",
      "persistenceLayer",
      "filesystemWrite"
    ]
  },
  {
    classification:
      "hidden_connector_grant_semantics_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected",
    fields: [
      "connectorAccessGrant",
      "connectorCredential",
      "connectorAccessToken",
      "connectorComplianceGrant",
      "providerGrant"
    ]
  },
  {
    classification:
      "hidden_infrastructure_deployment_compliance_pii_retention_export_semantics_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected",
    fields: [
      "terraformPlan",
      "deployCommand",
      "cloudProvider",
      "complianceEnforcer",
      "piiProcessor",
      "retentionScheduler",
      "exportJob",
      "policyEngine"
    ]
  },
  {
    classification:
      "hidden_testing_ci_release_automation_semantics_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected",
    fields: [
      "testRunner",
      "ciPipeline",
      "githubActionsWorkflow",
      "releaseAutomation",
      "artifactUpload",
      "packageExport"
    ]
  }
]);

function secretsCredentialBoundaryMapInputRecord(input) {
  return isPlainObjectRecord(input) ? input : null;
}

function secretsCredentialBoundaryMapReviewedAt(inputRecord) {
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

function secretsCredentialBoundaryMapContainsTrue(value) {
  if (value === true) {
    return true;
  }

  if (Array.isArray(value)) {
    return value.some(secretsCredentialBoundaryMapContainsTrue);
  }

  if (isPlainObjectRecord(value)) {
    return Object.values(value).some(
      secretsCredentialBoundaryMapContainsTrue
    );
  }

  return false;
}

function secretsCredentialBoundaryMapHasTrueFieldDeep(value, fields) {
  if (Array.isArray(value)) {
    return value.some((item) =>
      secretsCredentialBoundaryMapHasTrueFieldDeep(item, fields)
    );
  }

  if (!isPlainObjectRecord(value)) {
    return false;
  }

  for (const [key, nested] of Object.entries(value)) {
    if (fields.includes(key) && nested === true) {
      return true;
    }

    if (secretsCredentialBoundaryMapHasTrueFieldDeep(nested, fields)) {
      return true;
    }
  }

  return false;
}

function secretsCredentialBoundaryMapHasPresentFieldDeep(value, fields) {
  if (Array.isArray(value)) {
    return value.some((item) =>
      secretsCredentialBoundaryMapHasPresentFieldDeep(item, fields)
    );
  }

  if (!isPlainObjectRecord(value)) {
    return false;
  }

  for (const [key, nested] of Object.entries(value)) {
    if (
      key === "explicitBlockedAuthorizationFlags" ||
      key === "unsafeSecretsCredentialRuntimeFlags"
    ) {
      continue;
    }

    if (fields.includes(key)) {
      return true;
    }

    if (secretsCredentialBoundaryMapHasPresentFieldDeep(nested, fields)) {
      return true;
    }
  }

  return false;
}

function secretsCredentialBoundaryMapEntriesInput(inputRecord) {
  return Array.isArray(inputRecord?.boundaryEntries)
    ? inputRecord.boundaryEntries
    : null;
}

function secretsCredentialBoundaryMapMalformed(inputRecord) {
  return (
    inputRecord === null ||
    (Object.prototype.hasOwnProperty.call(inputRecord, "reviewedAt") &&
      !isUtcIsoTimestampWithMilliseconds(inputRecord.reviewedAt)) ||
    (Object.prototype.hasOwnProperty.call(inputRecord, "boundaryEntries") &&
      !Array.isArray(inputRecord.boundaryEntries))
  );
}

function secretsCredentialBoundaryMapEntryIssue(entries, predicate) {
  return entries !== null && entries.some((entry) => predicate(entry));
}

function secretsCredentialBoundaryMapMissingRequired(entry) {
  return (
    !isPlainObjectRecord(entry) ||
    SECRETS_CREDENTIAL_REQUIRED_FIELDS.some(
      (field) => !Object.prototype.hasOwnProperty.call(entry, field)
    )
  );
}

function secretsCredentialBoundaryMapEntryMalformed(entry) {
  if (!isPlainObjectRecord(entry)) {
    return true;
  }

  return (
    typeof entry.boundaryId !== "string" ||
    !Array.isArray(entry.allowedCurrentBehavior) ||
    !Array.isArray(entry.forbiddenCurrentBehavior) ||
    typeof entry.requiredFutureContractBeforeImplementation !== "string" ||
    typeof entry.requiredFutureAuthorizationPhaseBeforeRuntime !== "string" ||
    typeof entry.credentialSubjectExpectation !== "string" ||
    typeof entry.secretSourceProvenanceExpectation !== "string" ||
    typeof entry.rotationRevocationExpectation !== "string" ||
    typeof entry.storageNonStorageExpectation !== "string" ||
    typeof entry.redactionExpectation !== "string" ||
    typeof entry.auditExpectation !== "string" ||
    typeof entry.leastPrivilegeExpectation !== "string" ||
    typeof entry.localOnlyCloudOptInExpectation !== "string" ||
    typeof entry.locusRoleDescription !== "string" ||
    typeof entry.multiverseRoleDescription !== "string" ||
    typeof entry.fabricRoleDescription !== "string" ||
    typeof entry.secureDropRoleDescription !== "string" ||
    typeof entry.matrixGatewayRoleDescription !== "string" ||
    !isPlainObjectRecord(entry.explicitBlockedAuthorizationFlags) ||
    !isPlainObjectRecord(entry.unsafeSecretsCredentialRuntimeFlags) ||
    entry.nonAuthorizingProof !== true
  );
}

function secretsCredentialBoundaryMapAuthorizationFlagEnabled(value) {
  if (!isPlainObjectRecord(value)) {
    return false;
  }

  return (
    (isPlainObjectRecord(value.explicitBlockedAuthorizationFlags) &&
      Object.values(value.explicitBlockedAuthorizationFlags).some(
        (flag) => flag !== false
      )) ||
    SECRETS_CREDENTIAL_AUTHORIZATION_FIELDS.some(
      (field) => value[field] === true
    )
  );
}

function secretsCredentialBoundaryMapUnsafeFlagEnabled(value) {
  if (!isPlainObjectRecord(value)) {
    return false;
  }

  return (
    (isPlainObjectRecord(value.unsafeSecretsCredentialRuntimeFlags) &&
      Object.values(value.unsafeSecretsCredentialRuntimeFlags).some(
        (flag) => flag !== false
      )) ||
    secretsCredentialBoundaryMapHasTrueFieldDeep(
      value,
      SECRETS_CREDENTIAL_UNSAFE_FIELDS
    )
  );
}

function secretsCredentialBoundaryMapCanonical(entries) {
  if (entries === null) {
    return true;
  }

  return (
    JSON.stringify(entries) ===
    JSON.stringify(secretsCredentialBoundaryMapEntries())
  );
}

function secretsCredentialBoundaryMapInputClassification(inputRecord) {
  if (secretsCredentialBoundaryMapMalformed(inputRecord)) {
    return MALFORMED_SECRETS_MANAGEMENT_KEY_ROTATION_EXTERNAL_GATEWAY_CREDENTIAL_BOUNDARY_MAP_CLASSIFICATION;
  }

  const entries = secretsCredentialBoundaryMapEntriesInput(inputRecord);

  if (
    secretsCredentialBoundaryMapEntryIssue(
      entries,
      secretsCredentialBoundaryMapMissingRequired
    )
  ) {
    return "missing_required_secrets_management_key_rotation_external_gateway_credential_boundary_entry_rejected";
  }

  if (
    secretsCredentialBoundaryMapEntryIssue(
      entries,
      (entry) =>
        !SECRETS_CREDENTIAL_BOUNDARY_FAMILIES.includes(entry.boundaryFamily)
    )
  ) {
    return "unknown_boundary_family_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected";
  }

  if (
    secretsCredentialBoundaryMapEntryIssue(
      entries,
      (entry) =>
        !SECRETS_CREDENTIAL_RELATED_SYSTEMS.includes(entry.relatedSystem)
    )
  ) {
    return "unknown_related_system_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected";
  }

  if (
    secretsCredentialBoundaryMapEntryIssue(
      entries,
      (entry) => !SECRETS_CREDENTIAL_STATUSES.includes(entry.currentStatus)
    )
  ) {
    return "unknown_current_status_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected";
  }

  if (
    secretsCredentialBoundaryMapEntryIssue(
      entries,
      secretsCredentialBoundaryMapEntryMalformed
    )
  ) {
    return MALFORMED_SECRETS_MANAGEMENT_KEY_ROTATION_EXTERNAL_GATEWAY_CREDENTIAL_BOUNDARY_MAP_CLASSIFICATION;
  }

  if (
    secretsCredentialBoundaryMapHasTrueFieldDeep(inputRecord, [
      "runtimeAuthorized",
      "authorizesRuntime"
    ])
  ) {
    return "runtime_authorization_attempt_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected";
  }

  if (
    SECRETS_CREDENTIAL_AUTHORIZATION_FIELDS.some(
      (field) => inputRecord?.[field] === true
    ) ||
    secretsCredentialBoundaryMapEntryIssue(
      entries,
      secretsCredentialBoundaryMapAuthorizationFlagEnabled
    ) ||
    secretsCredentialBoundaryMapAuthorizationFlagEnabled(inputRecord)
  ) {
    return "authorization_flags_enabled_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected";
  }

  if (
    secretsCredentialBoundaryMapHasTrueFieldDeep(inputRecord, [
      "reportRunsChecks"
    ])
  ) {
    return "report_runs_checks_true_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected";
  }

  if (
    secretsCredentialBoundaryMapHasTrueFieldDeep(
      inputRecord,
      SECRETS_CREDENTIAL_AUTHORIZATION_FIELDS
    )
  ) {
    return "runtime_authorization_attempt_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected";
  }

  if (
    secretsCredentialBoundaryMapHasTrueFieldDeep(
      inputRecord,
      SECRETS_CREDENTIAL_COMMAND_FIELDS
    )
  ) {
    return "command_exposure_attempt_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected";
  }

  if (
    secretsCredentialBoundaryMapHasTrueFieldDeep(
      inputRecord,
      SECRETS_CREDENTIAL_BLOCKED_CLI_BYPASS_FIELDS
    )
  ) {
    return "blocked_cli_bypass_attempt_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected";
  }

  for (const { classification, fields } of SECRETS_CREDENTIAL_HIDDEN_FIELD_GROUPS) {
    if (secretsCredentialBoundaryMapHasPresentFieldDeep(inputRecord, fields)) {
      return classification;
    }
  }

  if (
    secretsCredentialBoundaryMapUnsafeFlagEnabled(inputRecord) ||
    secretsCredentialBoundaryMapEntryIssue(
      entries,
      secretsCredentialBoundaryMapUnsafeFlagEnabled
    )
  ) {
    return "unsafe_secrets_management_key_rotation_external_gateway_credential_runtime_flags_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected";
  }

  if (
    secretsCredentialBoundaryMapEntryIssue(entries, (entry) =>
      secretsCredentialBoundaryMapContainsTrue(entry?.runtimeEffect)
    ) ||
    secretsCredentialBoundaryMapContainsTrue(inputRecord?.runtimeEffect)
  ) {
    return "nested_unsafe_flags_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected";
  }

  if (
    Object.keys(inputRecord ?? {}).some(
      (field) => !SECRETS_CREDENTIAL_ALLOWED_TOP_LEVEL_FIELDS.includes(field)
    )
  ) {
    return "unknown_top_level_field_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected";
  }

  if (!secretsCredentialBoundaryMapCanonical(entries)) {
    return "noncanonical_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected";
  }

  return VALID_SECRETS_MANAGEMENT_KEY_ROTATION_EXTERNAL_GATEWAY_CREDENTIAL_BOUNDARY_MAP_CLASSIFICATION;
}

function secretsCredentialBoundaryMapAuthorizationFlags() {
  return Object.fromEntries(
    SECRETS_CREDENTIAL_AUTHORIZATION_FIELDS.map((field) => [field, false])
  );
}

function secretsCredentialBoundaryMapFalseRuntimeFields() {
  return Object.fromEntries(
    SECRETS_CREDENTIAL_UNSAFE_FIELDS.map((field) => [field, false])
  );
}

function secretsCredentialBoundaryMapNotes() {
  return {
    locus:
      "Locus may later display local-only sensitive-context and gateway credential status after a separate Locus-owned contract; Ardyn creates no Locus bridge, UI, token loader, scanner, approval runtime, or external harness integration.",
    multiverse:
      "Multiverse may later consume credential-boundary metadata after a separate Multiverse-owned contract; Ardyn creates no cross-harness communication, registry, connector grant, task execution, or external gateway integration.",
    fabric:
      "Content Fabric remains the canonical owner for Fabric coordination-envelope and Secure Drop implementation boundaries; Ardyn creates no Fabric bus, websocket/http transport, MCP exposure, task runtime, Secure Drop crypto, keyring, DID runtime, or ST3GG wrapping.",
    secureDrop:
      "Secure Drop recipient identity, keyring, DID, crypto, transport, stego, send/receive, inbox polling, and file-selection behavior remain canonical to content-fabric and are metadata-only in Ardyn.",
    matrixGateway:
      "Matrix/HiClaw-style gateway support is a future external gateway contract only; Ardyn creates no Matrix client, homeserver connection, room access, device identity, token loader, E2EE key/session handling, ingestion/export, rate-limit runtime, or audit/consent runtime."
  };
}

function secretsCredentialBoundaryMapDefinition(definition) {
  const notes = secretsCredentialBoundaryMapNotes();
  const subject = definition.subject;

  return {
    ...definition,
    credentialSubjectExpectation:
      `Future ${subject} credentials must name the exact actor, system, room, device, provider, recipient, command surface, DB file, or external harness subject before implementation.`,
    secretSourceProvenanceExpectation:
      `Future ${subject} secrets must record source, owner, consent, provenance, issuance time, non-secret evidence pointer, and revocation authority without storing secret values in Ardyn metadata.`,
    rotationRevocationExpectation:
      `Future ${subject} rotation and revocation must define owner, cadence, trigger, revocation proof, break-glass process, stale-token handling, and deny-by-default behavior before any job exists.`,
    storageNonStorageExpectation:
      `Current ${subject} behavior is non-storage metadata only. A future implementation must define whether storage is prohibited, local-only, encrypted, keyring-backed, or external-vault-backed before any read/write path.`,
    redactionExpectation:
      `Future ${subject} reports, logs, transcripts, audit metadata, error reports, and external-harness handoffs must redact secrets and credential-shaped data before any sink or writer exists.`,
    auditExpectation:
      `Future ${subject} audit evidence must prove authorization, least privilege, consent, rotation, revocation, redaction, and local/cloud boundary decisions without exposing credentials.`,
    leastPrivilegeExpectation:
      `Future ${subject} credentials must be scoped to the minimum provider, room, device, command, file, database, task, or gateway permission needed, with deny-path behavior specified first.`,
    localOnlyCloudOptInExpectation:
      `Sensitive ${subject} context remains local-only unless a future phase defines explicit cloud opt-in, operator consent, credential scope, export limits, and revocation proof.`,
    locusRoleDescription: definition.locusRoleDescription ?? notes.locus,
    multiverseRoleDescription:
      definition.multiverseRoleDescription ?? notes.multiverse,
    fabricRoleDescription: definition.fabricRoleDescription ?? notes.fabric,
    secureDropRoleDescription:
      definition.secureDropRoleDescription ?? notes.secureDrop,
    matrixGatewayRoleDescription:
      definition.matrixGatewayRoleDescription ?? notes.matrixGateway,
    allowedCurrentBehavior: [
      `Describe ${subject} secrets-management/key-rotation boundary metadata.`,
      "Reference prior Phase 5 boundary artifacts as review-only metadata.",
      "Keep all credential values absent and keep current behavior review-only, metadata-only, non-authorizing, and runtime-blocked."
    ],
    forbiddenCurrentBehavior: secretsCredentialBoundaryMapForbiddenBehavior(),
    requiredFutureContractBeforeImplementation:
      `A future ${subject} contract must define credential subject, source/provenance, authorization owner, storage/non-storage rule, redaction, audit evidence, rotation/revocation, least privilege, local-only/cloud opt-in, deny-path semantics, and explicit no-runtime defaults before implementation.`,
    requiredFutureAuthorizationPhaseBeforeRuntime:
      `Requires a future explicit authorization phase before any ${subject} secret store, env ingestion, vault access, keyring/DID runtime, token loader, OAuth/session handling, credential scanner, secret scanner, rotation/revocation job, credential export, secret persistence, redaction runtime, Matrix/external gateway, E2EE key handling, MCP/plugin/provider credential path, Secure Drop/Fabric runtime, Hermes/CUA/computer-use runtime, shell runtime, SQLite runtime, backend/API/server behavior, storage write, logger/audit/telemetry, health check, infrastructure, deployment, compliance, testing/CI/release automation, filesystem, process, UI, command, or encoded-handoff behavior.`
  };
}

function secretsCredentialBoundaryMapDefinitions() {
  const notes = secretsCredentialBoundaryMapNotes();
  const rows = [
    [
      "phase5-72.ardyn.secret_management.contract_boundary",
      "secret_management_contract",
      "ardyn",
      "future_contract_required",
      "secret-management contract boundary"
    ],
    [
      "phase5-72.ardyn.key_rotation.revocation_contract_boundary",
      "key_rotation_contract",
      "ardyn",
      "future_contract_required",
      "key rotation and revocation evidence boundary"
    ],
    [
      "phase5-72.repo_family.credential_provenance.inventory_boundary",
      "credential_provenance_contract",
      "repo-family",
      "metadata_only",
      "credential provenance and provider inventory boundary"
    ],
    [
      "phase5-72.ardyn.env_secret.non_ingestion_boundary",
      "env_secret_boundary",
      "ardyn",
      "blocked",
      "environment secret non-ingestion boundary"
    ],
    [
      "phase5-72.external_harness.vault_access.non_access_boundary",
      "vault_access_boundary",
      "external-harness",
      "blocked",
      "vault access non-access boundary"
    ],
    [
      "phase5-72.external_harness.api_key.provider_boundary",
      "api_key_boundary",
      "external-harness",
      "future_contract_required",
      "API key and provider credential boundary"
    ],
    [
      "phase5-72.external_harness.oauth_token.boundary",
      "oauth_token_boundary",
      "external-harness",
      "future_contract_required",
      "OAuth access and refresh token boundary"
    ],
    [
      "phase5-72.ardyn.session_token.boundary",
      "session_token_boundary",
      "ardyn",
      "blocked",
      "session token and cookie boundary"
    ],
    [
      "phase5-72.external_harness.provider_credential.inventory_boundary",
      "provider_credential_boundary",
      "external-harness",
      "future_contract_required",
      "provider credential inventory boundary"
    ],
    [
      "phase5-72.external_harness.mcp_server_credential.boundary",
      "mcp_credential_boundary",
      "external-harness",
      "blocked",
      "MCP server credential boundary"
    ],
    [
      "phase5-72.repo_family.plugin_tool_provider_credential.boundary",
      "plugin_credential_boundary",
      "repo-family",
      "blocked",
      "plugin, tool, and provider credential boundary"
    ],
    [
      "phase5-72.ardyn_subagent.skillhub_trust.provenance_boundary",
      "skillhub_trust_boundary",
      "ardyn-subagent",
      "future_contract_required",
      "SkillHub install trust and provenance boundary"
    ],
    [
      "phase5-72.matrix_reference.gateway_credential.boundary",
      "matrix_gateway_credential_boundary",
      "matrix-reference",
      "future_contract_required",
      "Matrix/HiClaw-style gateway credential boundary"
    ],
    [
      "phase5-72.external_harness.external_gateway_credential.boundary",
      "external_gateway_credential_boundary",
      "external-harness",
      "future_contract_required",
      "Telegram Discord Slack Signal WhatsApp Home Assistant external gateway credential boundary"
    ],
    [
      "phase5-72.content_fabric.coordination_envelope_secret.boundary",
      "fabric_secret_boundary",
      "content-fabric",
      "future_contract_required",
      "Fabric coordination-envelope secret boundary"
    ],
    [
      "phase5-72.content_fabric.secure_drop_recipient_key.boundary",
      "secure_drop_key_boundary",
      "content-fabric",
      "future_contract_required",
      "Secure Drop recipient identity and key boundary"
    ],
    [
      "phase5-72.content_fabric.did_keyring.identity_boundary",
      "did_keyring_boundary",
      "content-fabric",
      "future_contract_required",
      "DID and keyring identity boundary"
    ],
    [
      "phase5-72.cua_driver_reference.driver_trust.boundary",
      "cua_driver_trust_boundary",
      "cua-driver-reference",
      "blocked",
      "CUA driver provenance, version trust, and telemetry opt-in boundary"
    ],
    [
      "phase5-72.hermes_reference.computer_use_permission_secret.boundary",
      "computer_use_permission_secret_boundary",
      "hermes-reference",
      "blocked",
      "computer-use permission secret and operator consent boundary"
    ],
    [
      "phase5-72.multiverse.encoded_handoff_protocol_identity.boundary",
      "encoded_handoff_secret_boundary",
      "multiverse",
      "future_contract_required",
      "encoded handoff protocol and spec identity secret boundary"
    ],
    [
      "phase5-72.external_harness.secret_scanning_evidence.boundary",
      "secret_scanning_contract",
      "external-harness",
      "metadata_only",
      "secret scanning evidence boundary without scanner automation"
    ],
    [
      "phase5-72.locus.redaction_sensitive_context.boundary",
      "secret_redaction_contract",
      "locus",
      "metadata_only",
      "redaction boundary for reports logs audit metadata transcripts and error reports"
    ],
    [
      "phase5-72.repo_family.secret_audit.evidence_boundary",
      "secret_audit_contract",
      "repo-family",
      "metadata_only",
      "secret audit and credential evidence boundary"
    ],
    [
      "phase5-72.codecrafters_shell_reference.command_surface_secret.boundary",
      "env_secret_boundary",
      "codecrafters-shell-reference",
      "future_contract_required",
      "future shell primitive PATH env executable lookup and shell history secrets boundary"
    ],
    [
      "phase5-72.codecrafters_sqlite_reference.embedded_db_secret.boundary",
      "secret_management_contract",
      "codecrafters-sqlite-reference",
      "future_contract_required",
      "future SQLite embedded DB file key credential and query-engine boundary"
    ]
  ];

  return rows.map(
    ([boundaryId, boundaryFamily, relatedSystem, currentStatus, subject]) =>
      secretsCredentialBoundaryMapDefinition({
        boundaryId,
        boundaryFamily,
        relatedSystem,
        currentStatus,
        subject,
        locusRoleDescription:
          relatedSystem === "locus"
            ? "Locus may later display local-only redaction and sensitive-context status after a separate Locus contract; Ardyn creates no UI, bridge, token loader, scanner, or cloud export."
            : notes.locus,
        multiverseRoleDescription:
          relatedSystem === "multiverse"
            ? "Multiverse may later consume encoded-handoff identity and credential-boundary metadata after a separate Multiverse contract; Ardyn creates no cross-harness communication or runtime."
            : notes.multiverse,
        fabricRoleDescription:
          relatedSystem === "content-fabric"
            ? notes.fabric
            : notes.fabric,
        secureDropRoleDescription:
          relatedSystem === "content-fabric"
            ? notes.secureDrop
            : notes.secureDrop,
        matrixGatewayRoleDescription:
          relatedSystem === "matrix-reference"
            ? "Matrix/HiClaw-style gateway metadata must define homeserver URL, room allowlist, user/device identity, access-token and refresh-token handling, E2EE key/session handling, ingestion/export permissions, rate-limit/abuse controls, audit/consent, and Locus-visible status before any runtime."
            : notes.matrixGateway
      })
  );
}

function secretsCredentialBoundaryMapEntry(definition) {
  return {
    ...definition,
    productionReadinessAreaReference: {
      phase: "5.48",
      areaNumber: 18,
      areaName: "Secrets Management",
      sourceFixture:
        "tests/fixtures/host-policy/phase5-48/production-readiness-coverage-matrix.json",
      sourceStatus: "deferred",
      representedByPhase572: true,
      authorizesRuntime: false
    },
    matrixGatewayCredentialExpectation: {
      homeserverUrl: "future contract required, no URL loaded",
      roomAllowlist: "future contract required, no room joined",
      userDeviceIdentity: "future contract required, no identity loaded",
      accessRefreshTokenHandling: "future contract required, no token loader",
      e2eeKeySessionHandling: "future contract required, no E2EE runtime",
      messageIngestionExportPermissions:
        "future contract required, no ingestion or export",
      rateLimitAbuseBoundary: "future contract required, no gateway runtime",
      auditConsentBoundary: "future contract required, no audit writer",
      locusVisibleStatusBoundary: "future contract required, no Locus bridge"
    },
    externalGatewayCredentialExpectation: {
      telegram: "future metadata only",
      discord: "future metadata only",
      slack: "future metadata only",
      signal: "future metadata only",
      whatsapp: "future metadata only",
      homeAssistant: "future metadata only",
      runtimeImplemented: false
    },
    primitiveReferenceExpectation: {
      shellPathEnvExecutableHistoryRuntime: false,
      sqliteEmbeddedDbQueryKeyRuntime: false,
      referencesAreMetadataOnly: true
    },
    phase560EncodedHandoffReference: {
      fixture:
        "tests/fixtures/host-policy/phase5-60/inter-agent-encoded-handoff-conformance.json",
      runtimeAuthorized: false
    },
    phase562AuthPermissionsReference: {
      fixture:
        "tests/fixtures/host-policy/phase5-62/auth-permissions-contract-boundary-map.json",
      runtimeAuthorized: false
    },
    phase563SecurityRlsInputSanitizationReference: {
      fixture:
        "tests/fixtures/host-policy/phase5-63/security-rls-input-sanitization-contract-boundary-map.json",
      runtimeAuthorized: false
    },
    phase565ErrorTrackingLoggingAuditIntegrityReference: {
      fixture:
        "tests/fixtures/host-policy/phase5-65/error-tracking-logging-audit-integrity-contract-boundary-map.json",
      runtimeAuthorized: false
    },
    phase568AgentModeProfileSkillhubReference: {
      fixture:
        "tests/fixtures/host-policy/phase5-68/agent-mode-profile-skillhub-capability-boundary-map.json",
      runtimeAuthorized: false
    },
    phase571MaintenanceGovernanceReference: {
      fixture:
        "tests/fixtures/host-policy/phase5-71/maintenance-governance-adr-dependency-policy-contract-boundary-map.json",
      runtimeAuthorized: false
    },
    secretsCredentialBoundaryMetadataOnly: true,
    noLiveSecretsCredentialRuntimePerformed: true,
    explicitBlockedAuthorizationFlags:
      secretsCredentialBoundaryMapAuthorizationFlags(),
    unsafeSecretsCredentialRuntimeFlags:
      secretsCredentialBoundaryMapFalseRuntimeFields(),
    nonAuthorizingProof: true,
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

function secretsCredentialBoundaryMapEntries() {
  return secretsCredentialBoundaryMapDefinitions().map(
    secretsCredentialBoundaryMapEntry
  );
}

function secretsCredentialBoundaryMapSummary(entries) {
  const countByFamily = Object.fromEntries(
    SECRETS_CREDENTIAL_BOUNDARY_FAMILIES.map((family) => [
      family,
      entries.filter((entry) => entry.boundaryFamily === family).length
    ])
  );
  const countByRelatedSystem = Object.fromEntries(
    SECRETS_CREDENTIAL_RELATED_SYSTEMS.map((system) => [
      system,
      entries.filter((entry) => entry.relatedSystem === system).length
    ])
  );
  const countByStatus = Object.fromEntries(
    SECRETS_CREDENTIAL_STATUSES.map((status) => [
      status,
      entries.filter((entry) => entry.currentStatus === status).length
    ])
  );
  const allBlockedAuthorizationFlagsFalse = entries.every((entry) =>
    Object.values(entry.explicitBlockedAuthorizationFlags).every(
      (value) => value === false
    )
  );
  const allUnsafeSecretsCredentialRuntimeFlagsFalse = entries.every((entry) =>
    Object.values(entry.unsafeSecretsCredentialRuntimeFlags).every(
      (value) => value === false
    )
  );
  const allRuntimeEffectsFalse = entries.every((entry) =>
    Object.values(entry.runtimeEffect).every((value) => value === false)
  );

  return {
    boundaryMapKind:
      SECRETS_MANAGEMENT_KEY_ROTATION_EXTERNAL_GATEWAY_CREDENTIAL_BOUNDARY_MAP_KIND,
    boundaryEntryCount: entries.length,
    countByFamily,
    countByRelatedSystem,
    countByStatus,
    boundaryFamilies: [...SECRETS_CREDENTIAL_BOUNDARY_FAMILIES],
    relatedSystems: [...SECRETS_CREDENTIAL_RELATED_SYSTEMS],
    currentStatusValues: [...SECRETS_CREDENTIAL_STATUSES],
    phase548SecretsManagementCoverageItemRepresented: true,
    secretsCredentialBoundaryMetadataOnly: true,
    noLiveSecretsCredentialRuntimePerformed: true,
    envSecretsVaultBoundaryRecorded: true,
    apiKeyProviderCredentialBoundaryRecorded: true,
    oauthSessionTokenBoundaryRecorded: true,
    mcpPluginProviderCredentialBoundaryRecorded: true,
    skillhubTrustProvenanceBoundaryRecorded: true,
    matrixGatewayCredentialBoundaryRecorded: true,
    externalGatewayCredentialBoundaryRecorded: true,
    fabricCoordinationEnvelopeSecretBoundaryRecorded: true,
    secureDropRecipientIdentityKeyringDidBoundaryRecorded: true,
    encodedHandoffProtocolIdentityBoundaryRecorded: true,
    hermesCuaDriverTrustBoundaryRecorded: true,
    computerUsePermissionSecretBoundaryRecorded: true,
    shellPrimitiveSecretBoundaryRecorded: true,
    sqlitePrimitiveSecretBoundaryRecorded: true,
    secretScanningEvidenceBoundaryRecorded: true,
    rotationRevocationEvidenceBoundaryRecorded: true,
    redactionAuditBoundaryRecorded: true,
    localOnlyCloudOptInBoundaryRecorded: true,
    noSecretStore: true,
    noEnvIngestion: true,
    noVaultAccess: true,
    noKeyringDidRuntime: true,
    noTokenLoaderOauthSessionHandling: true,
    noCredentialScannerSecretScannerRuntime: true,
    noRotationRevocationJobs: true,
    noCredentialExportSecretPersistence: true,
    noRedactionRuntime: true,
    noMatrixGatewayE2eeKeyHandling: true,
    noExternalGatewayRuntime: true,
    noMcpPluginProviderCredentialsRuntime: true,
    noSecureDropFabricRuntime: true,
    noHermesCuaComputerUseRuntime: true,
    noShellRuntime: true,
    noSqliteRuntime: true,
    noBackendApiServerDatabaseStorageCacheRlsMigration: true,
    noTranscriptAuditTelemetryLoggerHealthRuntime: true,
    noInfrastructureDeploymentComplianceAutomation: true,
    noTestingCiReleaseAutomation: true,
    noFilesystemProcessUiRuntime: true,
    noCommandExposure: true,
    noBlockedCliBypass: true,
    allBlockedAuthorizationFlagsFalse,
    allUnsafeSecretsCredentialRuntimeFlagsFalse,
    allRuntimeEffectsFalse,
    allEntriesNonAuthorizing: entries.every(
      (entry) => entry.nonAuthorizingProof === true
    )
  };
}

function secretsCredentialBoundaryMapValidationRules() {
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
    enabledEnvSecretVaultAccessFailClosed: true,
    enabledKeyringDidTokenOauthSessionFailClosed: true,
    enabledCredentialScannerSecretScannerRotationRevocationFailClosed: true,
    enabledCredentialExportSecretPersistenceRedactionRuntimeFailClosed: true,
    enabledMatrixGatewayE2eeExternalGatewayFailClosed: true,
    enabledMcpPluginProviderCredentialRuntimeFailClosed: true,
    enabledSkillhubTrustScannerRuntimeFailClosed: true,
    enabledHermesCuaComputerUseRuntimeFailClosed: true,
    enabledShellPathExecutableEnvHistoryRuntimeFailClosed: true,
    enabledSqliteEmbeddedDbQueryKeyRuntimeFailClosed: true,
    hiddenSecretEnvVaultAccessSemanticsFailClosed: true,
    hiddenApiKeyTokenOauthSessionSemanticsFailClosed: true,
    hiddenMatrixGatewayCredentialRuntimeSemanticsFailClosed: true,
    hiddenE2eeKeySessionHandlingSemanticsFailClosed: true,
    hiddenMcpPluginProviderCredentialRuntimeSemanticsFailClosed: true,
    hiddenSkillhubInstallTrustScannerRuntimeSemanticsFailClosed: true,
    hiddenSecretScannerRotationRedactionRuntimeSemanticsFailClosed: true,
    hiddenFabricWebsocketHttpMcpTaskRuntimeSemanticsFailClosed: true,
    hiddenSecureDropImplementationKeyringDidSemanticsFailClosed: true,
    hiddenEncodedHandoffRuntimeCodecTranslatorStegoCovertChannelTokenizerExploitBypassSemanticsFailClosed:
      true,
    hiddenHermesCuaComputerUseRuntimeSemanticsFailClosed: true,
    hiddenShellPathExecutableEnvHistoryRuntimeSemanticsFailClosed: true,
    hiddenSqliteEmbeddedDbQueryKeyRuntimeSemanticsFailClosed: true,
    hiddenLoggerAuditTranscriptTelemetryExternalSinkSemanticsFailClosed: true,
    hiddenBackendApiServerSemanticsFailClosed: true,
    hiddenDatabaseStorageCacheWriteSemanticsFailClosed: true,
    hiddenConnectorGrantSemanticsFailClosed: true,
    hiddenInfrastructureDeploymentCompliancePiiRetentionExportSemanticsFailClosed:
      true,
    hiddenTestingCiReleaseAutomationSemanticsFailClosed: true,
    nestedUnsafeFlagsFailClosed: true,
    noncanonicalBoundaryEntriesFailClosed: true,
    validationRunsSecretsCredentialRuntime: false,
    validationLoadsSecrets: false,
    validationRequestsVaultAccess: false,
    validationRunsSecretScanner: false,
    validationRunsRotationJob: false,
    validationConnectsMatrixGateway: false,
    validationRunsShellRuntime: false,
    validationRunsSqliteRuntime: false,
    validationRequestsJules: false
  };
}

function secretsCredentialBoundaryMapGaps() {
  return [
    "Future secrets management still needs explicit secret-store, env-ingestion, vault-access, keyring/DID, token-loader, OAuth/session, storage/non-storage, and redaction contracts before runtime.",
    "Future Matrix/HiClaw-style gateway work still needs homeserver URL, room allowlist, user/device identity, token, E2EE key/session, ingestion/export, rate-limit/abuse, audit/consent, and Locus-visible status contracts.",
    "Future shell and SQLite primitive work remains reference-only and still needs PATH/env/executable/history and DB file/key/query-engine boundaries before any runtime.",
    "Future Fabric coordination-envelope and Secure Drop recipient identity/keyring/DID work remains canonical to content-fabric and requires separate authorization before Ardyn can integrate.",
    "Future Code Mode, Fabric, API/backend, provider/MCP/plugin credentials, scanner evidence, rotation evidence, and local-only/cloud opt-in boundaries remain metadata-only until a separate runtime phase."
  ];
}

function secretsCredentialBoundaryMapState(reviewedAt) {
  const boundaryEntries = secretsCredentialBoundaryMapEntries();

  return {
    schema:
      SECRETS_MANAGEMENT_KEY_ROTATION_EXTERNAL_GATEWAY_CREDENTIAL_BOUNDARY_MAP_STATE_SCHEMA,
    schemaVersion:
      SECRETS_MANAGEMENT_KEY_ROTATION_EXTERNAL_GATEWAY_CREDENTIAL_BOUNDARY_MAP_VERSION,
    stateKind:
      SECRETS_MANAGEMENT_KEY_ROTATION_EXTERNAL_GATEWAY_CREDENTIAL_BOUNDARY_MAP_KIND,
    stateMode: "review-only",
    reviewedAt,
    sourcePhaseContext: {
      phase548ProductionReadinessCoverageMatrix:
        "tests/fixtures/host-policy/phase5-48/production-readiness-coverage-matrix.json",
      phase548SecretsManagementAreaNumber: 18,
      phase548SecretsManagementStatus: "deferred",
      phase559FabricAwareApiBackendBoundary:
        "tests/fixtures/host-policy/phase5-59/fabric-aware-api-backend-contract-boundary-map.json",
      phase560InterAgentEncodedHandoffConformance:
        "tests/fixtures/host-policy/phase5-60/inter-agent-encoded-handoff-conformance.json",
      phase561DatabaseStorageContractBoundary:
        "tests/fixtures/host-policy/phase5-61/database-storage-contract-boundary-map.json",
      phase562AuthPermissionsContractBoundary:
        "tests/fixtures/host-policy/phase5-62/auth-permissions-contract-boundary-map.json",
      phase563SecurityRlsInputSanitizationContractBoundary:
        "tests/fixtures/host-policy/phase5-63/security-rls-input-sanitization-contract-boundary-map.json",
      phase565ErrorTrackingLoggingAuditIntegrityContractBoundary:
        "tests/fixtures/host-policy/phase5-65/error-tracking-logging-audit-integrity-contract-boundary-map.json",
      phase567InfrastructureComplianceDataRetentionBoundary:
        "tests/fixtures/host-policy/phase5-67/infrastructure-compliance-data-retention-contract-boundary-map.json",
      phase568AgentModeProfileSkillhubCapabilityBoundary:
        "tests/fixtures/host-policy/phase5-68/agent-mode-profile-skillhub-capability-boundary-map.json",
      phase571MaintenanceGovernanceBoundary:
        "tests/fixtures/host-policy/phase5-71/maintenance-governance-adr-dependency-policy-contract-boundary-map.json",
      secretsManagementCoverageItemRepresented: true,
      productionReadinessSecretsManagementItemDeferred: true,
      noSecretStoreImplemented: true,
      noEnvIngestionVaultAccessImplemented: true,
      noKeyringDidTokenOauthSessionImplemented: true,
      noCredentialScannerSecretScannerRotationRevocationImplemented: true,
      noMatrixExternalGatewayImplemented: true,
      noShellSqliteRuntimeImplemented: true,
      runtimeStillBlocked: true
    },
    boundaryEntries,
    boundaryMapSummary:
      secretsCredentialBoundaryMapSummary(boundaryEntries),
    invalidBoundaryCasePolicy:
      secretsCredentialBoundaryMapValidationRules(),
    topSecretsMatrixShellSqliteCodeModeFabricApiBackendGaps:
      secretsCredentialBoundaryMapGaps(),
    recommendedNextPhase:
      "phase-5.73-review-only-external-gateway-matrix-transport-contract-boundary-map",
    secretsManagementKeyRotationExternalGatewayCredentialBoundaryMapOnly: true,
    reviewOnly: true,
    metadataOnly: true,
    authoritative: false,
    nonAuthorizingProof: true,
    reportRunsChecks: false,
    ...secretsCredentialBoundaryMapFalseRuntimeFields(),
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

function secretsCredentialBoundaryMapResult({
  reviewedAt,
  reviewedAtDefaulted,
  classification,
  accepted,
  secretsManagementKeyRotationExternalGatewayCredentialBoundaryMap
}) {
  return {
    schema:
      SECRETS_MANAGEMENT_KEY_ROTATION_EXTERNAL_GATEWAY_CREDENTIAL_BOUNDARY_MAP_SCHEMA,
    schemaVersion:
      SECRETS_MANAGEMENT_KEY_ROTATION_EXTERNAL_GATEWAY_CREDENTIAL_BOUNDARY_MAP_VERSION,
    secretsManagementKeyRotationExternalGatewayCredentialBoundaryMapKind:
      SECRETS_MANAGEMENT_KEY_ROTATION_EXTERNAL_GATEWAY_CREDENTIAL_BOUNDARY_MAP_KIND,
    secretsManagementKeyRotationExternalGatewayCredentialBoundaryMapMode:
      "review-only",
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    secretsManagementKeyRotationExternalGatewayCredentialBoundaryMapProduced:
      accepted,
    secretsManagementKeyRotationExternalGatewayCredentialBoundaryMap,
    boundaryMapSummary: accepted
      ? secretsManagementKeyRotationExternalGatewayCredentialBoundaryMap
          .boundaryMapSummary
      : null,
    boundaryEntries: accepted
      ? secretsManagementKeyRotationExternalGatewayCredentialBoundaryMap
          .boundaryEntries
      : [],
    invalidBoundaryCasePolicy: accepted
      ? secretsManagementKeyRotationExternalGatewayCredentialBoundaryMap
          .invalidBoundaryCasePolicy
      : secretsCredentialBoundaryMapValidationRules(),
    topSecretsMatrixShellSqliteCodeModeFabricApiBackendGaps: accepted
      ? secretsManagementKeyRotationExternalGatewayCredentialBoundaryMap
          .topSecretsMatrixShellSqliteCodeModeFabricApiBackendGaps
      : [],
    recommendedNextPhase: accepted
      ? secretsManagementKeyRotationExternalGatewayCredentialBoundaryMap
          .recommendedNextPhase
      : null,
    secretsManagementKeyRotationExternalGatewayCredentialBoundaryMapOnly: true,
    reviewOnly: true,
    metadataOnly: true,
    authoritative: false,
    nonAuthorizingProof: true,
    reportRunsChecks: false,
    ...secretsCredentialBoundaryMapFalseRuntimeFields(),
    rejectionReasons: accepted
      ? []
      : [
          {
            classification,
            rejected: true,
            runtimeAuthorized: false,
            secretsCredentialRuntimeAuthorized: false,
            secretStoreAuthorized: false,
            envIngestionAuthorized: false,
            vaultAccessAuthorized: false,
            keyringDidAuthorized: false,
            tokenOauthSessionAuthorized: false,
            matrixGatewayAuthorized: false,
            externalGatewayAuthorized: false,
            shellRuntimeAuthorized: false,
            sqliteRuntimeAuthorized: false,
            commandExposureAuthorized: false,
            reportRunsChecks: false
          }
        ],
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

export function createSecretsManagementKeyRotationExternalGatewayCredentialBoundaryMapForReview(
  input = {}
) {
  const inputRecord = secretsCredentialBoundaryMapInputRecord(input);
  const reviewedAt = secretsCredentialBoundaryMapReviewedAt(inputRecord);
  const reviewedAtDefaulted = isReviewedAtDefaulted(inputRecord);
  const classification =
    secretsCredentialBoundaryMapInputClassification(inputRecord);
  const accepted =
    classification ===
    VALID_SECRETS_MANAGEMENT_KEY_ROTATION_EXTERNAL_GATEWAY_CREDENTIAL_BOUNDARY_MAP_CLASSIFICATION;
  const secretsManagementKeyRotationExternalGatewayCredentialBoundaryMap =
    accepted ? secretsCredentialBoundaryMapState(reviewedAt) : null;

  return secretsCredentialBoundaryMapResult({
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    accepted,
    secretsManagementKeyRotationExternalGatewayCredentialBoundaryMap
  });
}

const EXTERNAL_GATEWAY_MATRIX_TRANSPORT_CONTRACT_BOUNDARY_MAP_STATE_SCHEMA =
  "ardyn.phase-5.73.external-gateway-matrix-transport-contract-boundary-map-state";
const VALID_EXTERNAL_GATEWAY_MATRIX_TRANSPORT_CONTRACT_BOUNDARY_MAP_CLASSIFICATION =
  "valid_external_gateway_matrix_transport_contract_boundary_map_runtime_still_blocked";
const MALFORMED_EXTERNAL_GATEWAY_MATRIX_TRANSPORT_CONTRACT_BOUNDARY_MAP_CLASSIFICATION =
  "malformed_external_gateway_matrix_transport_contract_boundary_map_input_rejected";

const EXTERNAL_GATEWAY_MATRIX_BOUNDARY_FAMILIES = Object.freeze([
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
const EXTERNAL_GATEWAY_MATRIX_RELATED_SYSTEMS = Object.freeze([
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
const EXTERNAL_GATEWAY_MATRIX_STATUSES = Object.freeze([
  "metadata_only",
  "blocked",
  "future_contract_required"
]);
const EXTERNAL_GATEWAY_MATRIX_REQUIRED_FIELDS = Object.freeze([
  "boundaryId",
  "boundaryFamily",
  "relatedSystem",
  "currentStatus",
  "allowedCurrentBehavior",
  "forbiddenCurrentBehavior",
  "requiredFutureContractBeforeImplementation",
  "requiredFutureAuthorizationPhaseBeforeRuntime",
  "gatewayIdentityExpectation",
  "credentialKeyExpectation",
  "roomChannelAllowlistExpectation",
  "messageIngestionExportExpectation",
  "moderationAbuseExpectation",
  "e2eeKeySessionExpectation",
  "rateLimitDeliveryExpectation",
  "auditVisibilityExpectation",
  "largePayloadTransferExpectation",
  "locusRoleDescription",
  "multiverseFabricCoreRoleDescription",
  "secureDropRoleDescription",
  "explicitBlockedAuthorizationFlags",
  "unsafeExternalGatewayMatrixTransportRuntimeFlags",
  "nonAuthorizingProof"
]);
const EXTERNAL_GATEWAY_MATRIX_ALLOWED_TOP_LEVEL_FIELDS = Object.freeze([
  "reviewedAt",
  "boundaryEntries"
]);
const EXTERNAL_GATEWAY_MATRIX_UNSAFE_FIELDS = Object.freeze([
  "runtimeExecutionEnabled",
  "runtimeAuthorizationEnabled",
  "runtimeCommandEnabled",
  "commandExposureEnabled",
  "commandRuntimeControlEnabled",
  "connectorGrantProduced",
  "fabricRuntimeImplementedByArdyn",
  "websocketHttpTransportImplementedByArdyn",
  "httpTransportImplementedByArdyn",
  "mcpRuntimeEnabled",
  "mcpToolExposureEnabled",
  "taskExecutionEnabled",
  "secureDropImplemented",
  "serviceDiscoveryEnabled",
  "scheduleEnforcementEnabled",
  "schedulePollingEnabled",
  "filesystemWriteEnabled",
  "filesystemScanningEnabled",
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
  "externalGatewayRuntimeEnabled",
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
  "envIngestionEnabled",
  "secretLoadingEnabled",
  "vaultAccessEnabled",
  "keyringRuntimeEnabled",
  "didRuntimeEnabled",
  "tokenLoaderEnabled",
  "oauthFlowEnabled",
  "sessionHandlingEnabled",
  "shellRuntimeEnabled",
  "pathLookupRuntimeEnabled",
  "executableLookupRuntimeEnabled",
  "shellHistoryRuntimeEnabled",
  "sqliteRuntimeEnabled",
  "embeddedDbRuntimeEnabled",
  "queryEngineRuntimeEnabled",
  "sqliteKeyRuntimeEnabled",
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
  "failoverRuntimeImplemented",
  "infrastructureAutomationImplemented",
  "deploymentAutomationImplemented",
  "complianceEnforcementImplemented",
  "piiProcessingImplemented",
  "retentionJobImplemented",
  "exportJobImplemented",
  "testingCiReleaseAutomationEnabled",
  "encodedHandoffRuntimeImplementedByArdyn",
  "codecRuntimeEnabled",
  "translatorRuntimeEnabled",
  "filesystemProcessRuntimeEnabled",
  "blockedCliBypassEnabled"
]);
const EXTERNAL_GATEWAY_MATRIX_AUTHORIZATION_FIELDS = Object.freeze([
  "runtimeAuthorized",
  "runtimeAuthorizationGranted",
  "authorizesRuntime",
  "matrixGatewayAuthorizationGranted",
  "matrixClientAuthorizationGranted",
  "homeserverConnectionAuthorizationGranted",
  "roomJoinAuthorizationGranted",
  "messageSendAuthorizationGranted",
  "messageReadAuthorizationGranted",
  "e2eeKeyHandlingAuthorizationGranted",
  "gatewayRuntimeAuthorizationGranted",
  "externalPlatformConnectorAuthorizationGranted",
  "fabricCoreProducerAuthorizationGranted",
  "largePayloadTransferAuthorizationGranted",
  "secureDropAuthorizationGranted",
  "fabricRuntimeAuthorizationGranted",
  "shellRuntimeAuthorizationGranted",
  "sqliteRuntimeAuthorizationGranted",
  "backendApiServerAuthorizationGranted",
  "databaseStorageAuthorizationGranted",
  "commandExposureAuthorizationGranted",
  "connectorGrantAuthorizationGranted",
  "approvalDecisionProduced",
  "approvalGrantProduced"
]);
const EXTERNAL_GATEWAY_MATRIX_COMMAND_FIELDS = Object.freeze([
  "commandExposureEnabled",
  "commandRuntimeControlEnabled",
  "commandsExposed",
  "exposesCommands",
  "runtimeCommandEnabled",
  "cliCommandExposed"
]);
const EXTERNAL_GATEWAY_MATRIX_BLOCKED_CLI_BYPASS_FIELDS = Object.freeze([
  "blockedCliBypassEnabled",
  "dryRunBypassesBlock",
  "serveRuntimeBypassEnabled",
  "bypassBlockedCommandBehavior",
  "blockedCommandOverride"
]);
const EXTERNAL_GATEWAY_MATRIX_HIDDEN_FIELD_GROUPS = Object.freeze([
  {
    classification:
      "hidden_matrix_gateway_runtime_semantics_external_gateway_matrix_transport_contract_boundary_map_input_rejected",
    fields: [
      "matrixClient",
      "matrixRuntime",
      "homeserverConnection",
      "matrixHomeserverUrl",
      "matrixRoomJoin",
      "matrixRoomReader",
      "matrixRoomPoller",
      "matrixMessageSender",
      "matrixTransportRuntime"
    ]
  },
  {
    classification:
      "hidden_external_connector_semantics_external_gateway_matrix_transport_contract_boundary_map_input_rejected",
    fields: [
      "telegramClient",
      "discordClient",
      "slackClient",
      "signalClient",
      "whatsappClient",
      "homeAssistantClient",
      "externalGatewayConnector",
      "externalPlatformConnector"
    ]
  },
  {
    classification:
      "hidden_fabric_websocket_http_mcp_task_runtime_semantics_external_gateway_matrix_transport_contract_boundary_map_input_rejected",
    fields: [
      "fabricBus",
      "fabricTransport",
      "websocketUrl",
      "httpTransport",
      "mcpRuntime",
      "mcpServer",
      "mcpTool",
      "taskRunner",
      "taskQueue"
    ]
  },
  {
    classification:
      "hidden_content_addressed_chunked_resumable_p2p_transport_semantics_external_gateway_matrix_transport_contract_boundary_map_input_rejected",
    fields: [
      "contentAddressedTransport",
      "contentAddressedTransferProtocol",
      "chunkManifest",
      "chunkedTransfer",
      "resumableTransfer",
      "multiSourceTransfer",
      "torrentRuntime",
      "bittorrentRuntime",
      "dhtNode",
      "swarmRuntime",
      "p2pPeer",
      "largePayloadTransport",
      "fabricCoreProducer"
    ]
  },
  {
    classification:
      "hidden_secure_drop_implementation_semantics_external_gateway_matrix_transport_contract_boundary_map_input_rejected",
    fields: [
      "secureDropCrypto",
      "secureDropTransport",
      "secureDropInbox",
      "secureDropSend",
      "secureDropReceive",
      "secureDropConnector",
      "st3ggWrapper"
    ]
  },
  {
    classification:
      "hidden_secret_env_vault_token_keyring_semantics_external_gateway_matrix_transport_contract_boundary_map_input_rejected",
    fields: [
      "secretStore",
      "envSecretLoader",
      "envIngestionRuntime",
      "vaultClient",
      "secretValue",
      "accessToken",
      "refreshToken",
      "tokenLoader",
      "keyringRuntime",
      "didKeyring"
    ]
  },
  {
    classification:
      "hidden_shell_path_executable_env_history_runtime_semantics_external_gateway_matrix_transport_contract_boundary_map_input_rejected",
    fields: [
      "shellRuntime",
      "pathLookup",
      "executableLookup",
      "shellHistory",
      "commandExecution",
      "pipeRuntime",
      "processSpawn"
    ]
  },
  {
    classification:
      "hidden_sqlite_embedded_db_query_key_runtime_semantics_external_gateway_matrix_transport_contract_boundary_map_input_rejected",
    fields: [
      "sqliteRuntime",
      "embeddedDb",
      "sqliteKey",
      "databaseFile",
      "sqlParser",
      "queryEngine",
      "walRuntime"
    ]
  },
  {
    classification:
      "hidden_backend_api_server_semantics_external_gateway_matrix_transport_contract_boundary_map_input_rejected",
    fields: [
      "backendRuntime",
      "apiServer",
      "apiEndpoint",
      "serverMiddleware",
      "httpRoute",
      "webhookHandler"
    ]
  },
  {
    classification:
      "hidden_database_storage_cache_write_semantics_external_gateway_matrix_transport_contract_boundary_map_input_rejected",
    fields: [
      "databaseClient",
      "storageAdapter",
      "cacheEngine",
      "storageWrite",
      "databaseMigration",
      "rlsPolicy"
    ]
  },
  {
    classification:
      "hidden_auth_session_token_api_key_semantics_external_gateway_matrix_transport_contract_boundary_map_input_rejected",
    fields: [
      "authSession",
      "sessionToken",
      "sessionCookie",
      "apiKey",
      "providerApiKey",
      "oauthFlow",
      "oauthClientSecret"
    ]
  },
  {
    classification:
      "hidden_logger_audit_transcript_telemetry_external_sink_semantics_external_gateway_matrix_transport_contract_boundary_map_input_rejected",
    fields: [
      "loggerRuntime",
      "auditWriterRuntime",
      "transcriptWriter",
      "telemetryClient",
      "externalSink",
      "errorReporter"
    ]
  },
  {
    classification:
      "hidden_infrastructure_deployment_compliance_pii_retention_export_semantics_external_gateway_matrix_transport_contract_boundary_map_input_rejected",
    fields: [
      "infrastructureAutomation",
      "deploymentAutomation",
      "deployCommand",
      "cloudProvider",
      "complianceEnforcer",
      "piiProcessor",
      "retentionScheduler",
      "exportJob"
    ]
  },
  {
    classification:
      "hidden_testing_ci_release_automation_semantics_external_gateway_matrix_transport_contract_boundary_map_input_rejected",
    fields: [
      "testRunner",
      "ciPipeline",
      "githubActionsWorkflow",
      "releaseAutomation",
      "artifactUpload",
      "packageExport"
    ]
  }
]);

function externalGatewayMatrixBoundaryMapInputRecord(input) {
  return isPlainObjectRecord(input) ? input : null;
}

function externalGatewayMatrixBoundaryMapReviewedAt(inputRecord) {
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

function externalGatewayMatrixBoundaryMapContainsTrue(value) {
  if (value === true) {
    return true;
  }

  if (Array.isArray(value)) {
    return value.some(externalGatewayMatrixBoundaryMapContainsTrue);
  }

  if (isPlainObjectRecord(value)) {
    return Object.values(value).some(
      externalGatewayMatrixBoundaryMapContainsTrue
    );
  }

  return false;
}

function externalGatewayMatrixBoundaryMapHasTrueFieldDeep(value, fields) {
  if (Array.isArray(value)) {
    return value.some((item) =>
      externalGatewayMatrixBoundaryMapHasTrueFieldDeep(item, fields)
    );
  }

  if (!isPlainObjectRecord(value)) {
    return false;
  }

  for (const [key, nested] of Object.entries(value)) {
    if (fields.includes(key) && nested === true) {
      return true;
    }

    if (externalGatewayMatrixBoundaryMapHasTrueFieldDeep(nested, fields)) {
      return true;
    }
  }

  return false;
}

function externalGatewayMatrixBoundaryMapHasPresentFieldDeep(value, fields) {
  if (Array.isArray(value)) {
    return value.some((item) =>
      externalGatewayMatrixBoundaryMapHasPresentFieldDeep(item, fields)
    );
  }

  if (!isPlainObjectRecord(value)) {
    return false;
  }

  for (const [key, nested] of Object.entries(value)) {
    if (
      key === "explicitBlockedAuthorizationFlags" ||
      key === "unsafeExternalGatewayMatrixTransportRuntimeFlags"
    ) {
      continue;
    }

    if (fields.includes(key)) {
      return true;
    }

    if (externalGatewayMatrixBoundaryMapHasPresentFieldDeep(nested, fields)) {
      return true;
    }
  }

  return false;
}

function externalGatewayMatrixBoundaryMapEntriesInput(inputRecord) {
  return Array.isArray(inputRecord?.boundaryEntries)
    ? inputRecord.boundaryEntries
    : null;
}

function externalGatewayMatrixBoundaryMapMalformed(inputRecord) {
  return (
    inputRecord === null ||
    (Object.prototype.hasOwnProperty.call(inputRecord, "reviewedAt") &&
      !isUtcIsoTimestampWithMilliseconds(inputRecord.reviewedAt)) ||
    (Object.prototype.hasOwnProperty.call(inputRecord, "boundaryEntries") &&
      !Array.isArray(inputRecord.boundaryEntries))
  );
}

function externalGatewayMatrixBoundaryMapEntryIssue(entries, predicate) {
  return entries !== null && entries.some((entry) => predicate(entry));
}

function externalGatewayMatrixBoundaryMapMissingRequired(entry) {
  return (
    !isPlainObjectRecord(entry) ||
    EXTERNAL_GATEWAY_MATRIX_REQUIRED_FIELDS.some(
      (field) => !Object.prototype.hasOwnProperty.call(entry, field)
    )
  );
}

function externalGatewayMatrixBoundaryMapEntryMalformed(entry) {
  if (!isPlainObjectRecord(entry)) {
    return true;
  }

  return (
    typeof entry.boundaryId !== "string" ||
    !Array.isArray(entry.allowedCurrentBehavior) ||
    !Array.isArray(entry.forbiddenCurrentBehavior) ||
    typeof entry.requiredFutureContractBeforeImplementation !== "string" ||
    typeof entry.requiredFutureAuthorizationPhaseBeforeRuntime !== "string" ||
    typeof entry.gatewayIdentityExpectation !== "string" ||
    typeof entry.credentialKeyExpectation !== "string" ||
    typeof entry.roomChannelAllowlistExpectation !== "string" ||
    typeof entry.messageIngestionExportExpectation !== "string" ||
    typeof entry.moderationAbuseExpectation !== "string" ||
    typeof entry.e2eeKeySessionExpectation !== "string" ||
    typeof entry.rateLimitDeliveryExpectation !== "string" ||
    typeof entry.auditVisibilityExpectation !== "string" ||
    typeof entry.largePayloadTransferExpectation !== "string" ||
    typeof entry.locusRoleDescription !== "string" ||
    typeof entry.multiverseFabricCoreRoleDescription !== "string" ||
    typeof entry.secureDropRoleDescription !== "string" ||
    !isPlainObjectRecord(entry.explicitBlockedAuthorizationFlags) ||
    !isPlainObjectRecord(
      entry.unsafeExternalGatewayMatrixTransportRuntimeFlags
    ) ||
    entry.nonAuthorizingProof !== true
  );
}

function externalGatewayMatrixBoundaryMapAuthorizationFlagEnabled(value) {
  if (!isPlainObjectRecord(value)) {
    return false;
  }

  return (
    (isPlainObjectRecord(value.explicitBlockedAuthorizationFlags) &&
      Object.values(value.explicitBlockedAuthorizationFlags).some(
        (flag) => flag !== false
      )) ||
    EXTERNAL_GATEWAY_MATRIX_AUTHORIZATION_FIELDS.some(
      (field) => value[field] === true
    )
  );
}

function externalGatewayMatrixBoundaryMapUnsafeFlagEnabled(value) {
  if (!isPlainObjectRecord(value)) {
    return false;
  }

  return (
    (isPlainObjectRecord(
      value.unsafeExternalGatewayMatrixTransportRuntimeFlags
    ) &&
      Object.values(
        value.unsafeExternalGatewayMatrixTransportRuntimeFlags
      ).some((flag) => flag !== false)) ||
    externalGatewayMatrixBoundaryMapHasTrueFieldDeep(
      value,
      EXTERNAL_GATEWAY_MATRIX_UNSAFE_FIELDS
    )
  );
}

function externalGatewayMatrixBoundaryMapCanonical(entries) {
  if (entries === null) {
    return true;
  }

  return (
    JSON.stringify(entries) ===
    JSON.stringify(externalGatewayMatrixBoundaryMapEntries())
  );
}

function externalGatewayMatrixBoundaryMapInputClassification(inputRecord) {
  if (externalGatewayMatrixBoundaryMapMalformed(inputRecord)) {
    return MALFORMED_EXTERNAL_GATEWAY_MATRIX_TRANSPORT_CONTRACT_BOUNDARY_MAP_CLASSIFICATION;
  }

  const entries = externalGatewayMatrixBoundaryMapEntriesInput(inputRecord);

  if (
    externalGatewayMatrixBoundaryMapEntryIssue(
      entries,
      externalGatewayMatrixBoundaryMapMissingRequired
    )
  ) {
    return "missing_required_external_gateway_matrix_transport_boundary_entry_rejected";
  }

  if (
    externalGatewayMatrixBoundaryMapEntryIssue(
      entries,
      (entry) =>
        !EXTERNAL_GATEWAY_MATRIX_BOUNDARY_FAMILIES.includes(
          entry.boundaryFamily
        )
    )
  ) {
    return "unknown_boundary_family_external_gateway_matrix_transport_contract_boundary_map_input_rejected";
  }

  if (
    externalGatewayMatrixBoundaryMapEntryIssue(
      entries,
      (entry) =>
        !EXTERNAL_GATEWAY_MATRIX_RELATED_SYSTEMS.includes(entry.relatedSystem)
    )
  ) {
    return "unknown_related_system_external_gateway_matrix_transport_contract_boundary_map_input_rejected";
  }

  if (
    externalGatewayMatrixBoundaryMapEntryIssue(
      entries,
      (entry) => !EXTERNAL_GATEWAY_MATRIX_STATUSES.includes(entry.currentStatus)
    )
  ) {
    return "unknown_current_status_external_gateway_matrix_transport_contract_boundary_map_input_rejected";
  }

  if (
    externalGatewayMatrixBoundaryMapEntryIssue(
      entries,
      externalGatewayMatrixBoundaryMapEntryMalformed
    )
  ) {
    return MALFORMED_EXTERNAL_GATEWAY_MATRIX_TRANSPORT_CONTRACT_BOUNDARY_MAP_CLASSIFICATION;
  }

  if (
    externalGatewayMatrixBoundaryMapHasTrueFieldDeep(inputRecord, [
      "runtimeAuthorized",
      "authorizesRuntime"
    ])
  ) {
    return "runtime_authorization_attempt_external_gateway_matrix_transport_contract_boundary_map_input_rejected";
  }

  if (
    EXTERNAL_GATEWAY_MATRIX_AUTHORIZATION_FIELDS.some(
      (field) => inputRecord?.[field] === true
    ) ||
    externalGatewayMatrixBoundaryMapEntryIssue(
      entries,
      externalGatewayMatrixBoundaryMapAuthorizationFlagEnabled
    ) ||
    externalGatewayMatrixBoundaryMapAuthorizationFlagEnabled(inputRecord)
  ) {
    return "authorization_flags_enabled_external_gateway_matrix_transport_contract_boundary_map_input_rejected";
  }

  if (
    externalGatewayMatrixBoundaryMapHasTrueFieldDeep(inputRecord, [
      "reportRunsChecks"
    ])
  ) {
    return "report_runs_checks_true_external_gateway_matrix_transport_contract_boundary_map_input_rejected";
  }

  if (
    externalGatewayMatrixBoundaryMapHasTrueFieldDeep(
      inputRecord,
      EXTERNAL_GATEWAY_MATRIX_AUTHORIZATION_FIELDS
    )
  ) {
    return "runtime_authorization_attempt_external_gateway_matrix_transport_contract_boundary_map_input_rejected";
  }

  if (
    externalGatewayMatrixBoundaryMapHasTrueFieldDeep(
      inputRecord,
      EXTERNAL_GATEWAY_MATRIX_COMMAND_FIELDS
    )
  ) {
    return "command_exposure_attempt_external_gateway_matrix_transport_contract_boundary_map_input_rejected";
  }

  if (
    externalGatewayMatrixBoundaryMapHasTrueFieldDeep(
      inputRecord,
      EXTERNAL_GATEWAY_MATRIX_BLOCKED_CLI_BYPASS_FIELDS
    )
  ) {
    return "blocked_cli_bypass_attempt_external_gateway_matrix_transport_contract_boundary_map_input_rejected";
  }

  for (const { classification, fields } of EXTERNAL_GATEWAY_MATRIX_HIDDEN_FIELD_GROUPS) {
    if (externalGatewayMatrixBoundaryMapHasPresentFieldDeep(inputRecord, fields)) {
      return classification;
    }
  }

  if (
    externalGatewayMatrixBoundaryMapUnsafeFlagEnabled(inputRecord) ||
    externalGatewayMatrixBoundaryMapEntryIssue(
      entries,
      externalGatewayMatrixBoundaryMapUnsafeFlagEnabled
    )
  ) {
    return "unsafe_external_gateway_matrix_transport_runtime_flags_external_gateway_matrix_transport_contract_boundary_map_input_rejected";
  }

  if (
    externalGatewayMatrixBoundaryMapEntryIssue(entries, (entry) =>
      externalGatewayMatrixBoundaryMapContainsTrue(entry?.runtimeEffect)
    ) ||
    externalGatewayMatrixBoundaryMapContainsTrue(inputRecord?.runtimeEffect)
  ) {
    return "nested_unsafe_flags_external_gateway_matrix_transport_contract_boundary_map_input_rejected";
  }

  if (
    Object.keys(inputRecord ?? {}).some(
      (field) =>
        !EXTERNAL_GATEWAY_MATRIX_ALLOWED_TOP_LEVEL_FIELDS.includes(field)
    )
  ) {
    return "unknown_top_level_field_external_gateway_matrix_transport_contract_boundary_map_input_rejected";
  }

  if (!externalGatewayMatrixBoundaryMapCanonical(entries)) {
    return "noncanonical_external_gateway_matrix_transport_contract_boundary_map_input_rejected";
  }

  return VALID_EXTERNAL_GATEWAY_MATRIX_TRANSPORT_CONTRACT_BOUNDARY_MAP_CLASSIFICATION;
}

function externalGatewayMatrixBoundaryMapAuthorizationFlags() {
  return Object.fromEntries(
    EXTERNAL_GATEWAY_MATRIX_AUTHORIZATION_FIELDS.map((field) => [
      field,
      false
    ])
  );
}

function externalGatewayMatrixBoundaryMapFalseRuntimeFields() {
  return Object.fromEntries(
    EXTERNAL_GATEWAY_MATRIX_UNSAFE_FIELDS.map((field) => [field, false])
  );
}

function externalGatewayMatrixBoundaryMapDefinition({
  boundaryId,
  boundaryFamily,
  relatedSystem,
  currentStatus,
  contract,
  gatewayIdentity,
  credentialKey,
  roomChannelAllowlist,
  messageIngestionExport,
  moderationAbuse,
  e2eeKeySession,
  rateLimitDelivery,
  auditVisibility,
  largePayloadTransfer,
  locusRole,
  multiverseFabricCoreRole,
  secureDropRole
}) {
  return {
    boundaryId,
    boundaryFamily,
    relatedSystem,
    currentStatus,
    allowedCurrentBehavior: [
      "record deterministic review-only metadata",
      "reference prior Ardyn boundary fixtures without loading credentials or connecting transports",
      "require a future separately authorized contract before any runtime behavior"
    ],
    forbiddenCurrentBehavior: externalGatewayMatrixBoundaryMapForbiddenBehavior(),
    requiredFutureContractBeforeImplementation: contract,
    requiredFutureAuthorizationPhaseBeforeRuntime:
      "A separate post-5.73 runtime authorization phase must approve implementation, operator consent, credential/key handling, transport ownership, audit visibility, and rollback before any gateway, Matrix, external platform, Fabric, or large-payload runtime can exist.",
    gatewayIdentityExpectation: gatewayIdentity,
    credentialKeyExpectation: credentialKey,
    roomChannelAllowlistExpectation: roomChannelAllowlist,
    messageIngestionExportExpectation: messageIngestionExport,
    moderationAbuseExpectation: moderationAbuse,
    e2eeKeySessionExpectation: e2eeKeySession,
    rateLimitDeliveryExpectation: rateLimitDelivery,
    auditVisibilityExpectation: auditVisibility,
    largePayloadTransferExpectation: largePayloadTransfer,
    locusRoleDescription: locusRole,
    multiverseFabricCoreRoleDescription: multiverseFabricCoreRole,
    secureDropRoleDescription: secureDropRole
  };
}

function externalGatewayMatrixBoundaryMapDefinitions() {
  const defaults = {
    credentialKey:
      "Phase 5.72 records future access-token, refresh-token, provider credential, keyring, and secret provenance expectations; Phase 5.73 loads no token, key, session, env, vault, or credential.",
    roomChannelAllowlist:
      "Future contract must define explicit room/channel allowlists before any join, read, poll, send, or export behavior; current metadata joins no room and reads no channel.",
    messageIngestionExport:
      "Future contract must separate ingestion, export, send, replay, consent, retention, redaction, and audit semantics before runtime; current metadata ingests and sends no message.",
    moderationAbuse:
      "Future contract must define moderation, abuse reporting, spam control, blocked sender handling, and operator escalation before runtime; current metadata performs no moderation.",
    e2eeKeySession:
      "Future contract must define Matrix E2EE key/session handling, device trust, backup, and redaction before runtime; current metadata handles no E2EE key/session.",
    rateLimitDelivery:
      "Future contract must define delivery state, retry ceilings, queue ownership, rate limits, backoff, abuse guardrails, and failure semantics before runtime; current metadata sends no traffic.",
    auditVisibility:
      "Future contract must define Locus-visible status, consent, audit log shape, redaction, transcript boundaries, and external-sink policy before runtime; current metadata writes no audit or transcript.",
    largePayloadTransfer:
      "future_fabric_core_consumer_only: Ardyn must not implement content-addressed, chunked, resumable, multi-source, BitTorrent/DHT/swarm/P2P, large-payload, or file-transfer runtime; any future large payload path is a TODO to consume Ardynai/multiverse packages/fabric-core only after paired security review.",
    locusRole:
      "Locus may later display gateway status and review metadata only after a contract; current Ardyn adds no Locus integration, UI, dashboard, bridge, or runtime status feed.",
    multiverseFabricCoreRole:
      "Multiverse packages/fabric-core is the future producer and single source of truth for large-payload/fabric-core transfer capability; Ardyn is only a future consumer and implements no producer or transfer protocol.",
    secureDropRole:
      "Secure Drop remains canonical to content-fabric; Ardyn records future gateway references only and implements no crypto, transport, stego, inbox polling, file selection, send/receive, or connector ingestion."
  };

  return [
    externalGatewayMatrixBoundaryMapDefinition({
      boundaryId: "phase5-73.matrix_reference.homeserver.gateway_contract",
      boundaryFamily: "matrix_gateway_contract",
      relatedSystem: "matrix-reference",
      currentStatus: "metadata_only",
      contract:
        "Define Matrix homeserver URL provenance, allowed scheme/host policy, operator consent, credential linkage to Phase 5.72, status visibility, and no implicit service discovery before runtime.",
      gatewayIdentity:
        "Future Matrix homeserver URL must be explicit, operator-approved, and provenance-tagged; no homeserver URL is loaded or contacted in Phase 5.73.",
      ...defaults
    }),
    externalGatewayMatrixBoundaryMapDefinition({
      boundaryId: "phase5-73.matrix_reference.room_allowlist.contract",
      boundaryFamily: "matrix_room_contract",
      relatedSystem: "matrix-reference",
      currentStatus: "future_contract_required",
      contract:
        "Define room allowlist source, consent owner, join/read/send/export permissions, redaction, and abuse controls before any Matrix room runtime.",
      gatewayIdentity:
        "Future room membership must bind to an approved Matrix user/device identity and room allowlist; no room join/read/send/poll runtime exists.",
      ...defaults
    }),
    externalGatewayMatrixBoundaryMapDefinition({
      boundaryId: "phase5-73.matrix_reference.user_device_identity.contract",
      boundaryFamily: "matrix_identity_contract",
      relatedSystem: "matrix-reference",
      currentStatus: "future_contract_required",
      contract:
        "Define Matrix user ID, device ID, device trust, provenance, revocation, consent, and Locus-visible identity status before runtime.",
      gatewayIdentity:
        "Future Matrix user/device identity must be explicit, revocable, and least-privilege; Phase 5.73 stores no identity and opens no device session.",
      ...defaults
    }),
    externalGatewayMatrixBoundaryMapDefinition({
      boundaryId: "phase5-73.matrix_reference.e2ee_key_session.boundary",
      boundaryFamily: "matrix_e2ee_boundary",
      relatedSystem: "matrix-reference",
      currentStatus: "blocked",
      contract:
        "Define E2EE key/session ownership, device trust, backup, export prohibition, memory redaction, and audit boundaries before any E2EE handling.",
      gatewayIdentity:
        "Future E2EE handling must bind keys to an approved Matrix device identity; no key store, session, encryption, or decryption runtime exists.",
      ...defaults,
      e2eeKeySession:
        "Blocked: no Olm/Megolm session, device key store, key backup, E2EE export, message decryption, or keyring/DID runtime exists."
    }),
    externalGatewayMatrixBoundaryMapDefinition({
      boundaryId: "phase5-73.hiclaw_reference.room_coordination.transport_contract",
      boundaryFamily: "gateway_transport_contract",
      relatedSystem: "hiclaw-reference",
      currentStatus: "metadata_only",
      contract:
        "Record HiClaw-style room coordination as a future reference only; define transport ownership, trust boundaries, delivery policy, consent, and no hidden runtime before implementation.",
      gatewayIdentity:
        "HiClaw-style coordination remains a reference category only; no HiClaw code, Matrix client, or gateway transport is installed, copied, or integrated.",
      ...defaults
    }),
    externalGatewayMatrixBoundaryMapDefinition({
      boundaryId: "phase5-73.ardyn.gateway_delivery.retry_rate_limit.contract",
      boundaryFamily: "gateway_delivery_contract",
      relatedSystem: "ardyn",
      currentStatus: "future_contract_required",
      contract:
        "Define delivery state, retry ceilings, idempotency, queue ownership, rate limits, backoff, and failure-audit semantics before any gateway delivery runtime.",
      gatewayIdentity:
        "Future delivery must bind to an approved gateway identity and room/channel allowlist; Phase 5.73 sends no messages and schedules no retry.",
      ...defaults
    }),
    externalGatewayMatrixBoundaryMapDefinition({
      boundaryId: "phase5-73.external_harness.message_ingestion.boundary",
      boundaryFamily: "gateway_ingestion_contract",
      relatedSystem: "external-harness",
      currentStatus: "blocked",
      contract:
        "Define message source, consent, schema, size limits, redaction, replay, retention, and operator approval before any external-harness ingestion.",
      gatewayIdentity:
        "Future external-harness ingestion must identify source harness and approved gateway identity; current metadata polls and ingests no message.",
      ...defaults
    }),
    externalGatewayMatrixBoundaryMapDefinition({
      boundaryId: "phase5-73.external_harness.message_export_send.boundary",
      boundaryFamily: "gateway_export_contract",
      relatedSystem: "external-harness",
      currentStatus: "blocked",
      contract:
        "Define export/send permission, destination allowlist, redaction, audit, replay protection, and operator confirmation before any outbound gateway behavior.",
      gatewayIdentity:
        "Future export/send must bind to approved gateway identity, recipient, and room/channel allowlist; current metadata sends and exports nothing.",
      ...defaults
    }),
    externalGatewayMatrixBoundaryMapDefinition({
      boundaryId: "phase5-73.repo_family.gateway_moderation_abuse.contract",
      boundaryFamily: "gateway_moderation_contract",
      relatedSystem: "repo-family",
      currentStatus: "future_contract_required",
      contract:
        "Define moderation, abuse control, spam detection, consent revocation, blocked senders, operator escalation, and audit requirements before runtime.",
      gatewayIdentity:
        "Future moderation decisions must be scoped to an approved gateway identity and platform; current metadata performs no moderation or enforcement.",
      ...defaults
    }),
    externalGatewayMatrixBoundaryMapDefinition({
      boundaryId: "phase5-73.ardyn.gateway_rate_limit_abuse.boundary",
      boundaryFamily: "gateway_rate_limit_contract",
      relatedSystem: "ardyn",
      currentStatus: "future_contract_required",
      contract:
        "Define platform-specific rate limits, abuse backoff, replay protection, queue-free failure posture, and operator escalation before runtime.",
      gatewayIdentity:
        "Future rate-limit policy must bind to gateway identity and destination allowlist; Phase 5.73 opens no queue, scheduler, worker, or transport.",
      ...defaults
    }),
    externalGatewayMatrixBoundaryMapDefinition({
      boundaryId: "phase5-73.repo_family.gateway_audit_visibility.contract",
      boundaryFamily: "gateway_audit_contract",
      relatedSystem: "repo-family",
      currentStatus: "metadata_only",
      contract:
        "Define audit event shape, transcript boundaries, consent records, redaction policy, external sink policy, and non-authorizing status before runtime.",
      gatewayIdentity:
        "Future audit must identify gateway identity without leaking credentials or E2EE material; current metadata writes no audit, transcript, logger, telemetry, or external sink.",
      ...defaults
    }),
    externalGatewayMatrixBoundaryMapDefinition({
      boundaryId: "phase5-73.locus.gateway_status.visibility_contract",
      boundaryFamily: "locus_gateway_visibility_contract",
      relatedSystem: "locus",
      currentStatus: "future_contract_required",
      contract:
        "Define Locus-visible gateway status, allowed fields, freshness, redaction, consent, local-only/cloud-opt-in behavior, and non-authorizing display semantics before integration.",
      gatewayIdentity:
        "Future Locus-visible status must display only approved metadata and no tokens, keys, rooms, message contents, or runtime grants.",
      ...defaults
    }),
    externalGatewayMatrixBoundaryMapDefinition({
      boundaryId: "phase5-73.ardyn_subagent.locus_external_harness_bridge.contract",
      boundaryFamily: "harness_gateway_bridge_contract",
      relatedSystem: "ardyn-subagent",
      currentStatus: "blocked",
      contract:
        "Define Locus-mediated harness bridge and external-harness bridge ownership, consent, status-only metadata, and blocked runtime semantics before any bridge exists.",
      gatewayIdentity:
        "Future bridge identity must be explicit and non-authorizing; Phase 5.73 starts no subagent bridge, Locus bridge, ACP/A2A runtime, or cross-harness communication.",
      ...defaults
    }),
    externalGatewayMatrixBoundaryMapDefinition({
      boundaryId: "phase5-73.fabric_core_reference.future_consumer.boundary",
      boundaryFamily: "fabric_core_consumer_boundary",
      relatedSystem: "fabric-core-reference",
      currentStatus: "future_contract_required",
      contract:
        "Define future Ardyn consumer integration to Ardynai/multiverse packages/fabric-core only after the producer lands and passes paired security review; Ardyn must not implement producer, protocol, transfer, or package seam.",
      gatewayIdentity:
        "Future fabric-core consumer identity must be explicit, least-privilege, and separately authorized; current metadata imports no fabric-core package and creates no Fabric runtime.",
      ...defaults,
      multiverseFabricCoreRole:
        "Ardynai/multiverse packages/fabric-core is the sole future producer for content-addressed/chunked/resumable/multi-source transfer; Ardyn records only future consumer metadata and implements none of it.",
      largePayloadTransfer:
        "future_fabric_core_consumer_only: producer is Ardynai/multiverse packages/fabric-core; Ardyn must not implement content-addressed, chunked, resumable, multi-source, BitTorrent/DHT/swarm/P2P, large-payload, or file-transfer runtime."
    }),
    externalGatewayMatrixBoundaryMapDefinition({
      boundaryId: "phase5-73.multiverse.large_payload_transfer.todo_boundary",
      boundaryFamily: "large_payload_transfer_todo_boundary",
      relatedSystem: "multiverse",
      currentStatus: "blocked",
      contract:
        "Record model weights, large connector packs, large skill packs, and big media only as a TODO for future fabric-core consumer integration after producer readiness and paired security review.",
      gatewayIdentity:
        "Future large-payload movement must be owned by fabric-core consumer integration, not Ardyn gateway identity; current metadata transfers no model, pack, media, file, or payload.",
      ...defaults,
      largePayloadTransfer:
        "future_fabric_core_consumer_only: model weights, large connector packs, large skill packs, and big media are held until a future prompt authorizes consuming packages/fabric-core; no Ardyn transfer runtime exists."
    }),
    externalGatewayMatrixBoundaryMapDefinition({
      boundaryId: "phase5-73.content_fabric.secure_drop_gateway_reference.boundary",
      boundaryFamily: "gateway_transport_contract",
      relatedSystem: "content-fabric",
      currentStatus: "metadata_only",
      contract:
        "Record Secure Drop gateway references only; canonical Secure Drop implementation, crypto, transport, inbox, file selection, and connector ingestion remain in content-fabric.",
      gatewayIdentity:
        "Future Secure Drop gateway reference must identify content-fabric ownership and no Ardyn runtime; current metadata performs no send, receive, transport, crypto, or inbox polling.",
      ...defaults
    }),
    externalGatewayMatrixBoundaryMapDefinition({
      boundaryId: "phase5-73.external_harness.external_platform_gateway.contract",
      boundaryFamily: "external_platform_gateway_contract",
      relatedSystem: "external-harness",
      currentStatus: "future_contract_required",
      contract:
        "Define future Telegram, Discord, Slack, Signal, WhatsApp, and Home Assistant gateway contracts, consent, credentials, allowlists, rate limits, audit, and revocation before any connector runtime.",
      gatewayIdentity:
        "Future external platform gateway identity must be explicit, per-platform, revocable, and least-privilege; current metadata installs no connector and contacts no external platform.",
      ...defaults
    })
  ];
}

function externalGatewayMatrixBoundaryMapEntry(definition) {
  return {
    ...definition,
    phase572CredentialBoundaryReference: {
      fixture:
        "tests/fixtures/host-policy/phase5-72/secrets-management-key-rotation-external-gateway-credential-boundary-map.json",
      matrixAccessRefreshTokenBoundaryRecorded: true,
      credentialRuntimeAuthorized: false
    },
    phase559FabricAwareApiBackendReference: {
      fixture:
        "tests/fixtures/host-policy/phase5-59/fabric-aware-api-backend-contract-boundary-map.json",
      runtimeAuthorized: false
    },
    phase560EncodedHandoffReference: {
      fixture:
        "tests/fixtures/host-policy/phase5-60/inter-agent-encoded-handoff-conformance.json",
      runtimeAuthorized: false
    },
    phase564RateLimitingAbuseControlReference: {
      fixture:
        "tests/fixtures/host-policy/phase5-64/rate-limiting-abuse-control-contract-boundary-map.json",
      runtimeAuthorized: false
    },
    phase565ErrorTrackingLoggingAuditIntegrityReference: {
      fixture:
        "tests/fixtures/host-policy/phase5-65/error-tracking-logging-audit-integrity-contract-boundary-map.json",
      runtimeAuthorized: false
    },
    fabricCoreProducerReference: {
      producerRepository: "Ardynai/multiverse",
      producerPackage: "packages/fabric-core",
      ardynRole: "future-consumer-only-after-paired-security-review",
      producerImplementedByArdyn: false,
      transferProtocolImplementedByArdyn: false
    },
    externalPlatformGatewayExpectation: {
      telegram: "future metadata only",
      discord: "future metadata only",
      slack: "future metadata only",
      signal: "future metadata only",
      whatsapp: "future metadata only",
      homeAssistant: "future metadata only",
      runtimeImplemented: false
    },
    fabricCoreConsumerExpectation: {
      futureFabricCoreConsumerOnly: true,
      contentAddressedTransportImplementedByArdyn: false,
      chunkedTransferImplementedByArdyn: false,
      resumableTransferImplementedByArdyn: false,
      multiSourceTransferImplementedByArdyn: false,
      bittorrentDhtSwarmP2pImplementedByArdyn: false,
      largePayloadTransferRuntimeImplementedByArdyn: false,
      pairedSecurityReviewRequiredBeforeConsumerIntegration: true
    },
    gatewayTransportBoundaryMetadataOnly: true,
    noLiveExternalGatewayMatrixTransportRuntimePerformed: true,
    explicitBlockedAuthorizationFlags:
      externalGatewayMatrixBoundaryMapAuthorizationFlags(),
    unsafeExternalGatewayMatrixTransportRuntimeFlags:
      externalGatewayMatrixBoundaryMapFalseRuntimeFields(),
    nonAuthorizingProof: true,
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

function externalGatewayMatrixBoundaryMapEntries() {
  return externalGatewayMatrixBoundaryMapDefinitions().map(
    externalGatewayMatrixBoundaryMapEntry
  );
}

function externalGatewayMatrixBoundaryMapSummary(entries) {
  const countByFamily = Object.fromEntries(
    EXTERNAL_GATEWAY_MATRIX_BOUNDARY_FAMILIES.map((family) => [
      family,
      entries.filter((entry) => entry.boundaryFamily === family).length
    ])
  );
  const countByRelatedSystem = Object.fromEntries(
    EXTERNAL_GATEWAY_MATRIX_RELATED_SYSTEMS.map((system) => [
      system,
      entries.filter((entry) => entry.relatedSystem === system).length
    ])
  );
  const countByStatus = Object.fromEntries(
    EXTERNAL_GATEWAY_MATRIX_STATUSES.map((status) => [
      status,
      entries.filter((entry) => entry.currentStatus === status).length
    ])
  );
  const allBlockedAuthorizationFlagsFalse = entries.every((entry) =>
    Object.values(entry.explicitBlockedAuthorizationFlags).every(
      (value) => value === false
    )
  );
  const allUnsafeExternalGatewayMatrixTransportRuntimeFlagsFalse =
    entries.every((entry) =>
      Object.values(
        entry.unsafeExternalGatewayMatrixTransportRuntimeFlags
      ).every((value) => value === false)
    );
  const allRuntimeEffectsFalse = entries.every((entry) =>
    Object.values(entry.runtimeEffect).every((value) => value === false)
  );

  return {
    boundaryMapKind:
      EXTERNAL_GATEWAY_MATRIX_TRANSPORT_CONTRACT_BOUNDARY_MAP_KIND,
    boundaryEntryCount: entries.length,
    countByFamily,
    countByRelatedSystem,
    countByStatus,
    boundaryFamilies: [...EXTERNAL_GATEWAY_MATRIX_BOUNDARY_FAMILIES],
    relatedSystems: [...EXTERNAL_GATEWAY_MATRIX_RELATED_SYSTEMS],
    currentStatusValues: [...EXTERNAL_GATEWAY_MATRIX_STATUSES],
    externalGatewayMatrixTransportBoundaryMetadataOnly: true,
    noLiveExternalGatewayMatrixTransportRuntimePerformed: true,
    matrixHomeserverUrlBoundaryRecorded: true,
    matrixRoomAllowlistBoundaryRecorded: true,
    matrixUserDeviceIdentityBoundaryRecorded: true,
    matrixAccessRefreshTokenBoundaryLinkedFromPhase572: true,
    matrixE2eeKeySessionBoundaryRecorded: true,
    matrixMessageIngestionBoundaryRecorded: true,
    matrixMessageExportSendBoundaryRecorded: true,
    matrixDeliveryRetryRateLimitBoundaryRecorded: true,
    matrixModerationAbuseControlBoundaryRecorded: true,
    matrixAuditLoggingBoundaryRecorded: true,
    locusVisibleGatewayStatusBoundaryRecorded: true,
    hiclawRoomCoordinationReferenceBoundaryRecorded: true,
    externalPlatformGatewayBoundaryRecorded: true,
    locusMediatedHarnessBridgeBoundaryRecorded: true,
    externalHarnessGatewayBridgeBoundaryRecorded: true,
    fabricCoordinationEnvelopeGatewayBoundaryRecorded: true,
    fabricCoreFutureConsumerBoundaryRecorded: true,
    largePayloadTodoBoundaryRecorded: true,
    secureDropGatewayReferenceBoundaryRecorded: true,
    noMatrixClientRuntime: true,
    noHomeserverConnection: true,
    noRoomJoinReadSendPollRuntime: true,
    noE2eeKeySessionHandling: true,
    noAccessTokenLoader: true,
    noGatewayRuntime: true,
    noExternalPlatformConnector: true,
    noMessageIngestionExportRuntime: true,
    noServiceDiscoverySchedulePolling: true,
    noContentAddressedChunkedResumableMultiSourceTransfer: true,
    noBitTorrentDhtSwarmP2pBehavior: true,
    noLargePayloadTransferRuntime: true,
    noFabricCoreProducerBehavior: true,
    noFabricWebsocketHttpMcpTaskRuntime: true,
    noSecureDropImplementation: true,
    noShellRuntime: true,
    noSqliteRuntime: true,
    noBackendApiServerDatabaseStorageCacheRlsMigration: true,
    noTranscriptAuditTelemetryLoggerHealthRuntime: true,
    noInfrastructureDeploymentComplianceAutomation: true,
    noTestingCiReleaseAutomation: true,
    noFilesystemProcessUiRuntime: true,
    noCommandExposure: true,
    noBlockedCliBypass: true,
    allBlockedAuthorizationFlagsFalse,
    allUnsafeExternalGatewayMatrixTransportRuntimeFlagsFalse,
    allRuntimeEffectsFalse,
    allEntriesNonAuthorizing: entries.every(
      (entry) => entry.nonAuthorizingProof === true
    )
  };
}

function externalGatewayMatrixBoundaryMapValidationRules() {
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
    enabledMatrixClientRuntimeFailClosed: true,
    enabledHomeserverConnectionFailClosed: true,
    enabledRoomJoinSendReadPollRuntimeFailClosed: true,
    enabledE2eeKeySessionHandlingFailClosed: true,
    enabledAccessTokenLoaderFailClosed: true,
    enabledGatewayRuntimeFailClosed: true,
    enabledExternalPlatformConnectorFailClosed: true,
    enabledMessageIngestionExportRuntimeFailClosed: true,
    enabledServiceDiscoverySchedulePollingFailClosed: true,
    enabledContentAddressedChunkedResumableMultiSourceTransferFailClosed: true,
    enabledBitTorrentDhtSwarmP2pBehaviorFailClosed: true,
    enabledLargePayloadTransferRuntimeFailClosed: true,
    enabledFabricCoreProducerBehaviorFailClosed: true,
    hiddenMatrixGatewayRuntimeSemanticsFailClosed: true,
    hiddenExternalConnectorSemanticsFailClosed: true,
    hiddenFabricWebsocketHttpMcpTaskRuntimeSemanticsFailClosed: true,
    hiddenContentAddressedChunkedResumableP2pTransportSemanticsFailClosed: true,
    hiddenSecureDropImplementationSemanticsFailClosed: true,
    hiddenSecretEnvVaultTokenKeyringSemanticsFailClosed: true,
    hiddenShellPathExecutableEnvHistoryRuntimeSemanticsFailClosed: true,
    hiddenSqliteEmbeddedDbQueryKeyRuntimeSemanticsFailClosed: true,
    hiddenBackendApiServerSemanticsFailClosed: true,
    hiddenDatabaseStorageCacheWriteSemanticsFailClosed: true,
    hiddenAuthSessionTokenApiKeySemanticsFailClosed: true,
    hiddenLoggerAuditTranscriptTelemetryExternalSinkSemanticsFailClosed: true,
    hiddenInfrastructureDeploymentCompliancePiiRetentionExportSemanticsFailClosed:
      true,
    hiddenTestingCiReleaseAutomationSemanticsFailClosed: true,
    nestedUnsafeFlagsFailClosed: true,
    noncanonicalBoundaryEntriesFailClosed: true,
    validationRunsMatrixClient: false,
    validationConnectsHomeserver: false,
    validationHandlesE2eeKeys: false,
    validationPollsOrSendsMessages: false,
    validationRunsGatewayRuntime: false,
    validationRunsFabricCoreProducer: false,
    validationRunsLargePayloadTransfer: false,
    validationRequestsJules: false
  };
}

function externalGatewayMatrixBoundaryMapGaps() {
  return [
    "Future Matrix transport still needs homeserver URL, room allowlist, user/device identity, access-token/refresh-token linkage, E2EE key/session, ingestion/export, delivery, rate-limit, moderation, and audit contracts before runtime.",
    "Future external gateway work still needs per-platform Telegram/Discord/Slack/Signal/WhatsApp/Home Assistant connector contracts, consent, credentials, allowlists, rate limits, redaction, and revocation.",
    "Future Locus-mediated and external-harness bridge work remains status-only metadata until a separate bridge authorization phase defines ownership, consent, and non-authorizing visibility.",
    "Future fabric-core consumer integration is held: Ardynai/multiverse packages/fabric-core must remain the producer, and Ardyn must not implement content-addressed/chunked/resumable/multi-source/P2P or large-payload transfer.",
    "Future shell, SQLite, Code Mode, Fabric/API/backend, Secure Drop, logger/audit, and storage behavior remain separate review-only boundary maps before any runtime authorization."
  ];
}

function externalGatewayMatrixBoundaryMapState(reviewedAt) {
  const boundaryEntries = externalGatewayMatrixBoundaryMapEntries();

  return {
    schema:
      EXTERNAL_GATEWAY_MATRIX_TRANSPORT_CONTRACT_BOUNDARY_MAP_STATE_SCHEMA,
    schemaVersion:
      EXTERNAL_GATEWAY_MATRIX_TRANSPORT_CONTRACT_BOUNDARY_MAP_VERSION,
    stateKind: EXTERNAL_GATEWAY_MATRIX_TRANSPORT_CONTRACT_BOUNDARY_MAP_KIND,
    stateMode: "review-only",
    reviewedAt,
    sourcePhaseContext: {
      phase559FabricAwareApiBackendBoundary:
        "tests/fixtures/host-policy/phase5-59/fabric-aware-api-backend-contract-boundary-map.json",
      phase560InterAgentEncodedHandoffConformance:
        "tests/fixtures/host-policy/phase5-60/inter-agent-encoded-handoff-conformance.json",
      phase562AuthPermissionsContractBoundary:
        "tests/fixtures/host-policy/phase5-62/auth-permissions-contract-boundary-map.json",
      phase564RateLimitingAbuseControlBoundary:
        "tests/fixtures/host-policy/phase5-64/rate-limiting-abuse-control-contract-boundary-map.json",
      phase565ErrorTrackingLoggingAuditIntegrityBoundary:
        "tests/fixtures/host-policy/phase5-65/error-tracking-logging-audit-integrity-contract-boundary-map.json",
      phase568AgentModeProfileSkillhubCapabilityBoundary:
        "tests/fixtures/host-policy/phase5-68/agent-mode-profile-skillhub-capability-boundary-map.json",
      phase572SecretsCredentialBoundary:
        "tests/fixtures/host-policy/phase5-72/secrets-management-key-rotation-external-gateway-credential-boundary-map.json",
      matrixTransportCoverageItemRepresented: true,
      phase572CredentialLinkageRequiredBeforeRuntime: true,
      hiclawStyleRoomCoordinationReferenceOnly: true,
      fabricCoreProducerRepository: "Ardynai/multiverse",
      fabricCoreProducerPackage: "packages/fabric-core",
      ardynFutureFabricCoreRole: "consumer-only-after-paired-security-review",
      noMatrixClientImplemented: true,
      noGatewayRuntimeImplemented: true,
      noFabricCoreProducerImplemented: true,
      noLargePayloadTransferImplemented: true,
      runtimeStillBlocked: true
    },
    boundaryEntries,
    boundaryMapSummary:
      externalGatewayMatrixBoundaryMapSummary(boundaryEntries),
    invalidBoundaryCasePolicy:
      externalGatewayMatrixBoundaryMapValidationRules(),
    topMatrixGatewayFabricCoreConsumerShellSqliteCodeModeFabricApiBackendGaps:
      externalGatewayMatrixBoundaryMapGaps(),
    recommendedNextPhase:
      "phase-5.74-review-only-command-surface-shell-primitive-contract-boundary-map",
    externalGatewayMatrixTransportContractBoundaryMapOnly: true,
    reviewOnly: true,
    metadataOnly: true,
    authoritative: false,
    nonAuthorizingProof: true,
    reportRunsChecks: false,
    ...externalGatewayMatrixBoundaryMapFalseRuntimeFields(),
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

function externalGatewayMatrixBoundaryMapResult({
  reviewedAt,
  reviewedAtDefaulted,
  classification,
  accepted,
  externalGatewayMatrixTransportContractBoundaryMap
}) {
  return {
    schema: EXTERNAL_GATEWAY_MATRIX_TRANSPORT_CONTRACT_BOUNDARY_MAP_SCHEMA,
    schemaVersion:
      EXTERNAL_GATEWAY_MATRIX_TRANSPORT_CONTRACT_BOUNDARY_MAP_VERSION,
    externalGatewayMatrixTransportContractBoundaryMapKind:
      EXTERNAL_GATEWAY_MATRIX_TRANSPORT_CONTRACT_BOUNDARY_MAP_KIND,
    externalGatewayMatrixTransportContractBoundaryMapMode: "review-only",
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    externalGatewayMatrixTransportContractBoundaryMapProduced: accepted,
    externalGatewayMatrixTransportContractBoundaryMap,
    boundaryMapSummary: accepted
      ? externalGatewayMatrixTransportContractBoundaryMap.boundaryMapSummary
      : null,
    boundaryEntries: accepted
      ? externalGatewayMatrixTransportContractBoundaryMap.boundaryEntries
      : [],
    invalidBoundaryCasePolicy: accepted
      ? externalGatewayMatrixTransportContractBoundaryMap
          .invalidBoundaryCasePolicy
      : externalGatewayMatrixBoundaryMapValidationRules(),
    topMatrixGatewayFabricCoreConsumerShellSqliteCodeModeFabricApiBackendGaps:
      accepted
        ? externalGatewayMatrixTransportContractBoundaryMap
            .topMatrixGatewayFabricCoreConsumerShellSqliteCodeModeFabricApiBackendGaps
        : [],
    recommendedNextPhase: accepted
      ? externalGatewayMatrixTransportContractBoundaryMap.recommendedNextPhase
      : null,
    externalGatewayMatrixTransportContractBoundaryMapOnly: true,
    reviewOnly: true,
    metadataOnly: true,
    authoritative: false,
    nonAuthorizingProof: true,
    reportRunsChecks: false,
    ...externalGatewayMatrixBoundaryMapFalseRuntimeFields(),
    rejectionReasons: accepted
      ? []
      : [
          {
            classification,
            rejected: true,
            runtimeAuthorized: false,
            matrixGatewayAuthorized: false,
            matrixClientAuthorized: false,
            homeserverConnectionAuthorized: false,
            e2eeKeyHandlingAuthorized: false,
            gatewayRuntimeAuthorized: false,
            externalPlatformConnectorAuthorized: false,
            fabricCoreProducerAuthorized: false,
            largePayloadTransferAuthorized: false,
            secureDropAuthorized: false,
            commandExposureAuthorized: false,
            reportRunsChecks: false
          }
        ],
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

export function createExternalGatewayMatrixTransportContractBoundaryMapForReview(
  input = {}
) {
  const inputRecord = externalGatewayMatrixBoundaryMapInputRecord(input);
  const reviewedAt =
    externalGatewayMatrixBoundaryMapReviewedAt(inputRecord);
  const reviewedAtDefaulted = isReviewedAtDefaulted(inputRecord);
  const classification =
    externalGatewayMatrixBoundaryMapInputClassification(inputRecord);
  const accepted =
    classification ===
    VALID_EXTERNAL_GATEWAY_MATRIX_TRANSPORT_CONTRACT_BOUNDARY_MAP_CLASSIFICATION;
  const externalGatewayMatrixTransportContractBoundaryMap = accepted
    ? externalGatewayMatrixBoundaryMapState(reviewedAt)
    : null;

  return externalGatewayMatrixBoundaryMapResult({
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    accepted,
    externalGatewayMatrixTransportContractBoundaryMap
  });
}

const COMMAND_SURFACE_SHELL_PRIMITIVE_CONTRACT_BOUNDARY_MAP_STATE_SCHEMA =
  "ardyn.phase-5.74.command-surface-shell-primitive-contract-boundary-map-state";
const VALID_COMMAND_SURFACE_SHELL_PRIMITIVE_CONTRACT_BOUNDARY_MAP_CLASSIFICATION =
  "valid_command_surface_shell_primitive_contract_boundary_map_runtime_still_blocked";
const MALFORMED_COMMAND_SURFACE_SHELL_PRIMITIVE_CONTRACT_BOUNDARY_MAP_CLASSIFICATION =
  "malformed_command_surface_shell_primitive_contract_boundary_map_input_rejected";

const COMMAND_SURFACE_SHELL_BOUNDARY_FAMILIES = Object.freeze([
  "command_surface_contract",
  "repl_contract",
  "prompt_contract",
  "command_parser_contract",
  "builtin_command_contract",
  "path_resolution_contract",
  "external_program_contract",
  "process_spawn_boundary",
  "exit_code_contract",
  "quoting_contract",
  "escaping_contract",
  "redirection_contract",
  "pipeline_contract",
  "completion_contract",
  "programmable_completion_contract",
  "background_job_contract",
  "job_control_contract",
  "history_contract",
  "history_persistence_contract",
  "parameter_expansion_contract",
  "environment_variable_contract",
  "terminal_backend_contract",
  "stdin_stdout_stderr_contract",
  "shell_reference_boundary"
]);
const COMMAND_SURFACE_SHELL_RELATED_SYSTEMS = Object.freeze([
  "ardyn",
  "ardyn-subagent",
  "locus",
  "multiverse",
  "content-fabric",
  "repo-family",
  "external-harness",
  "codecrafters-shell-reference",
  "hermes-reference",
  "cua-driver-reference"
]);
const COMMAND_SURFACE_SHELL_STATUSES = Object.freeze([
  "metadata_only",
  "blocked",
  "future_contract_required"
]);
const COMMAND_SURFACE_SHELL_REQUIRED_FIELDS = Object.freeze([
  "boundaryId",
  "boundaryFamily",
  "relatedSystem",
  "currentStatus",
  "allowedCurrentBehavior",
  "forbiddenCurrentBehavior",
  "requiredFutureContractBeforeImplementation",
  "requiredFutureAuthorizationPhaseBeforeRuntime",
  "commandVisibilityExpectation",
  "commandParsingExpectation",
  "processControlExpectation",
  "stdinStdoutStderrExpectation",
  "filesystemInteractionExpectation",
  "environmentSecretExposureExpectation",
  "operatorApprovalExpectation",
  "locusRoleDescription",
  "fabricRoleDescription",
  "explicitBlockedAuthorizationFlags",
  "unsafeCommandSurfaceShellPrimitiveRuntimeFlags",
  "nonAuthorizingProof"
]);
const COMMAND_SURFACE_SHELL_ALLOWED_TOP_LEVEL_FIELDS = Object.freeze([
  "reviewedAt",
  "boundaryEntries"
]);
const COMMAND_SURFACE_SHELL_UNSAFE_FIELDS = Object.freeze([
  "runtimeExecutionEnabled",
  "runtimeAuthorizationEnabled",
  "runtimeCommandEnabled",
  "commandExposureEnabled",
  "commandRuntimeControlEnabled",
  "commandsExposed",
  "connectorGrantProduced",
  "fabricRuntimeImplementedByArdyn",
  "websocketHttpTransportImplementedByArdyn",
  "httpTransportImplementedByArdyn",
  "mcpRuntimeEnabled",
  "mcpToolExposureEnabled",
  "taskExecutionEnabled",
  "secureDropImplemented",
  "serviceDiscoveryEnabled",
  "scheduleEnforcementEnabled",
  "schedulePollingEnabled",
  "filesystemWriteEnabled",
  "filesystemScanningEnabled",
  "filesystemReadEnabled",
  "processControlEnabled",
  "shellRuntimeEnabled",
  "replRuntimeEnabled",
  "promptLoopEnabled",
  "commandParserRuntimeEnabled",
  "commandTokenizerRuntimeEnabled",
  "builtinExecutionEnabled",
  "pathLookupRuntimeEnabled",
  "executableLookupRuntimeEnabled",
  "externalProgramExecutionEnabled",
  "processSpawnEnabled",
  "stdinLoopEnabled",
  "stdoutWriterEnabled",
  "stderrWriterEnabled",
  "redirectionRuntimeEnabled",
  "pipelineRuntimeEnabled",
  "completionRuntimeEnabled",
  "completerRuntimeEnabled",
  "programmableCompletionRuntimeEnabled",
  "filenameCompletionRuntimeEnabled",
  "backgroundJobRuntimeEnabled",
  "jobControlRuntimeEnabled",
  "commandHistoryRuntimeEnabled",
  "historyPersistenceRuntimeEnabled",
  "environmentVariableExpansionRuntimeEnabled",
  "parameterExpansionRuntimeEnabled",
  "terminalBackendRuntimeEnabled",
  "terminalBackendExecutionEnabled",
  "matrixClientRuntimeEnabled",
  "homeserverConnectionEnabled",
  "matrixRoomPollRuntimeEnabled",
  "matrixRoomSendRuntimeEnabled",
  "e2eeKeySessionHandlingEnabled",
  "gatewayRuntimeEnabled",
  "externalGatewayRuntimeEnabled",
  "contentAddressedTransportEnabled",
  "chunkedTransferEnabled",
  "resumableTransferEnabled",
  "multiSourceTransferEnabled",
  "bittorrentDhtSwarmP2pEnabled",
  "largePayloadTransferRuntimeEnabled",
  "fabricCoreProducerBehaviorEnabled",
  "sqliteRuntimeEnabled",
  "embeddedDbRuntimeEnabled",
  "queryEngineRuntimeEnabled",
  "sqliteKeyRuntimeEnabled",
  "envIngestionEnabled",
  "secretLoadingEnabled",
  "vaultAccessEnabled",
  "tokenLoaderEnabled",
  "oauthFlowEnabled",
  "sessionHandlingEnabled",
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
  "failoverRuntimeImplemented",
  "infrastructureAutomationImplemented",
  "deploymentAutomationImplemented",
  "complianceEnforcementImplemented",
  "piiProcessingImplemented",
  "retentionJobImplemented",
  "exportJobImplemented",
  "testingCiReleaseAutomationEnabled",
  "encodedHandoffRuntimeImplementedByArdyn",
  "codecRuntimeEnabled",
  "translatorRuntimeEnabled",
  "hermesRuntimeEnabled",
  "cuaDriverRuntimeEnabled",
  "computerUseRuntimeEnabled",
  "filesystemProcessRuntimeEnabled",
  "blockedCliBypassEnabled"
]);
const COMMAND_SURFACE_SHELL_AUTHORIZATION_FIELDS = Object.freeze([
  "runtimeAuthorized",
  "runtimeAuthorizationGranted",
  "authorizesRuntime",
  "commandSurfaceAuthorizationGranted",
  "shellRuntimeAuthorizationGranted",
  "replAuthorizationGranted",
  "parserRuntimeAuthorizationGranted",
  "pathLookupAuthorizationGranted",
  "processSpawnAuthorizationGranted",
  "builtinExecutionAuthorizationGranted",
  "redirectionPipelineAuthorizationGranted",
  "completionAuthorizationGranted",
  "jobControlAuthorizationGranted",
  "historyPersistenceAuthorizationGranted",
  "environmentExpansionAuthorizationGranted",
  "terminalBackendAuthorizationGranted",
  "fabricRuntimeAuthorizationGranted",
  "matrixGatewayAuthorizationGranted",
  "sqliteRuntimeAuthorizationGranted",
  "secureDropAuthorizationGranted",
  "backendApiServerAuthorizationGranted",
  "databaseStorageAuthorizationGranted",
  "connectorGrantAuthorizationGranted",
  "approvalDecisionProduced",
  "approvalGrantProduced"
]);
const COMMAND_SURFACE_SHELL_COMMAND_FIELDS = Object.freeze([
  "commandExposureEnabled",
  "commandRuntimeControlEnabled",
  "commandsExposed",
  "exposesCommands",
  "runtimeCommandEnabled",
  "cliCommandExposed",
  "shellCommandExposed",
  "serveRuntimeCommandEnabled"
]);
const COMMAND_SURFACE_SHELL_BLOCKED_CLI_BYPASS_FIELDS = Object.freeze([
  "blockedCliBypassEnabled",
  "dryRunBypassesBlock",
  "serveRuntimeBypassEnabled",
  "bypassBlockedCommandBehavior",
  "blockedCommandOverride"
]);
const COMMAND_SURFACE_SHELL_HIDDEN_FIELD_GROUPS = Object.freeze([
  {
    classification:
      "hidden_shell_repl_process_execution_semantics_command_surface_shell_primitive_contract_boundary_map_input_rejected",
    fields: [
      "shellRuntime",
      "replRuntime",
      "promptLoop",
      "commandParser",
      "commandTokenizer",
      "builtinExecutor",
      "processExecution",
      "processSpawn",
      "commandRunner"
    ]
  },
  {
    classification:
      "hidden_path_executable_lookup_semantics_command_surface_shell_primitive_contract_boundary_map_input_rejected",
    fields: [
      "pathLookup",
      "pathResolver",
      "executableLookup",
      "executableResolver",
      "whichLookup",
      "commandSearchPath"
    ]
  },
  {
    classification:
      "hidden_filesystem_read_write_semantics_command_surface_shell_primitive_contract_boundary_map_input_rejected",
    fields: [
      "filesystemRead",
      "filesystemWrite",
      "fileOpen",
      "fileCreate",
      "directoryScan",
      "globRuntime"
    ]
  },
  {
    classification:
      "hidden_env_secrets_exposure_semantics_command_surface_shell_primitive_contract_boundary_map_input_rejected",
    fields: [
      "envReader",
      "envIngestion",
      "environmentLoader",
      "secretLoader",
      "vaultAccess",
      "tokenLoader",
      "credentialExport"
    ]
  },
  {
    classification:
      "hidden_pipe_redirection_stdio_semantics_command_surface_shell_primitive_contract_boundary_map_input_rejected",
    fields: [
      "pipeRuntime",
      "pipelineRuntime",
      "redirectionRuntime",
      "stdoutWriter",
      "stderrWriter",
      "stdinLoop",
      "appendRedirect"
    ]
  },
  {
    classification:
      "hidden_job_control_background_worker_semantics_command_surface_shell_primitive_contract_boundary_map_input_rejected",
    fields: [
      "backgroundJob",
      "jobControl",
      "jobReaper",
      "processSupervisor",
      "workerRuntime",
      "schedulerRuntime"
    ]
  },
  {
    classification:
      "hidden_command_exposure_or_runtime_authorization_semantics_command_surface_shell_primitive_contract_boundary_map_input_rejected",
    fields: [
      "commandExposure",
      "commandRegistry",
      "runtimeCommand",
      "runtimeAuthorization",
      "approvalGrant",
      "approvalDecision"
    ]
  },
  {
    classification:
      "hidden_backend_api_server_semantics_command_surface_shell_primitive_contract_boundary_map_input_rejected",
    fields: [
      "backendRuntime",
      "apiServer",
      "apiEndpoint",
      "serverMiddleware",
      "httpHandler"
    ]
  },
  {
    classification:
      "hidden_database_storage_cache_write_semantics_command_surface_shell_primitive_contract_boundary_map_input_rejected",
    fields: [
      "databaseClient",
      "storageAdapter",
      "cacheEngine",
      "databaseWrite",
      "migrationRunner",
      "rlsRuntime"
    ]
  },
  {
    classification:
      "hidden_auth_session_token_api_key_semantics_command_surface_shell_primitive_contract_boundary_map_input_rejected",
    fields: [
      "authSession",
      "sessionToken",
      "apiKey",
      "oauthFlow",
      "accessToken",
      "refreshToken"
    ]
  },
  {
    classification:
      "hidden_connector_grant_semantics_command_surface_shell_primitive_contract_boundary_map_input_rejected",
    fields: [
      "connectorGrant",
      "providerGrant",
      "pluginGrant",
      "mcpGrant",
      "toolGrant"
    ]
  },
  {
    classification:
      "hidden_fabric_websocket_http_mcp_task_runtime_semantics_command_surface_shell_primitive_contract_boundary_map_input_rejected",
    fields: [
      "fabricRuntime",
      "fabricBus",
      "websocketTransport",
      "httpTransport",
      "mcpRuntime",
      "mcpTool",
      "taskExecutor"
    ]
  },
  {
    classification:
      "hidden_secure_drop_implementation_semantics_command_surface_shell_primitive_contract_boundary_map_input_rejected",
    fields: [
      "secureDrop",
      "secureDropCrypto",
      "secureDropTransport",
      "secureDropInbox",
      "st3ggWrapper"
    ]
  },
  {
    classification:
      "hidden_matrix_gateway_runtime_semantics_command_surface_shell_primitive_contract_boundary_map_input_rejected",
    fields: [
      "matrixClient",
      "matrixRuntime",
      "homeserverConnection",
      "matrixRoomPoller",
      "matrixMessageSender",
      "externalGateway"
    ]
  },
  {
    classification:
      "hidden_content_addressed_chunked_resumable_p2p_transport_semantics_command_surface_shell_primitive_contract_boundary_map_input_rejected",
    fields: [
      "contentAddressedTransport",
      "chunkedTransfer",
      "resumableTransfer",
      "multiSourceTransfer",
      "bittorrentRuntime",
      "dhtRuntime",
      "swarmRuntime",
      "p2pTransfer"
    ]
  },
  {
    classification:
      "hidden_sqlite_embedded_db_query_runtime_semantics_command_surface_shell_primitive_contract_boundary_map_input_rejected",
    fields: [
      "sqliteRuntime",
      "embeddedDb",
      "queryEngine",
      "sqlParser",
      "btreeTraversal",
      "walRuntime"
    ]
  },
  {
    classification:
      "hidden_hermes_cua_computer_use_runtime_semantics_command_surface_shell_primitive_contract_boundary_map_input_rejected",
    fields: [
      "hermesRuntime",
      "cuaDriver",
      "computerUse",
      "screenshotRuntime",
      "inputAutomation",
      "accessibilityTree"
    ]
  },
  {
    classification:
      "hidden_encoded_handoff_runtime_codec_translator_stego_covert_channel_tokenizer_exploit_bypass_semantics_command_surface_shell_primitive_contract_boundary_map_input_rejected",
    fields: [
      "encodedHandoffRuntime",
      "codecRuntime",
      "translatorRuntime",
      "stegoRuntime",
      "covertChannel",
      "tokenizerExploit",
      "bypassRuntime"
    ]
  }
]);

function commandSurfaceShellBoundaryMapInputRecord(input) {
  return isPlainObjectRecord(input) ? input : null;
}

function commandSurfaceShellBoundaryMapReviewedAt(inputRecord) {
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

function commandSurfaceShellBoundaryMapContainsTrue(value) {
  if (value === true) {
    return true;
  }

  if (Array.isArray(value)) {
    return value.some(commandSurfaceShellBoundaryMapContainsTrue);
  }

  if (isPlainObjectRecord(value)) {
    return Object.values(value).some(commandSurfaceShellBoundaryMapContainsTrue);
  }

  return false;
}

function commandSurfaceShellBoundaryMapHasTrueFieldDeep(value, fields) {
  if (Array.isArray(value)) {
    return value.some((item) =>
      commandSurfaceShellBoundaryMapHasTrueFieldDeep(item, fields)
    );
  }

  if (!isPlainObjectRecord(value)) {
    return false;
  }

  for (const [key, nested] of Object.entries(value)) {
    if (fields.includes(key) && nested === true) {
      return true;
    }

    if (commandSurfaceShellBoundaryMapHasTrueFieldDeep(nested, fields)) {
      return true;
    }
  }

  return false;
}

function commandSurfaceShellBoundaryMapHasPresentFieldDeep(value, fields) {
  if (Array.isArray(value)) {
    return value.some((item) =>
      commandSurfaceShellBoundaryMapHasPresentFieldDeep(item, fields)
    );
  }

  if (!isPlainObjectRecord(value)) {
    return false;
  }

  for (const [key, nested] of Object.entries(value)) {
    if (
      key === "explicitBlockedAuthorizationFlags" ||
      key === "unsafeCommandSurfaceShellPrimitiveRuntimeFlags"
    ) {
      continue;
    }

    if (fields.includes(key)) {
      return true;
    }

    if (commandSurfaceShellBoundaryMapHasPresentFieldDeep(nested, fields)) {
      return true;
    }
  }

  return false;
}

function commandSurfaceShellBoundaryMapEntriesInput(inputRecord) {
  return Array.isArray(inputRecord?.boundaryEntries)
    ? inputRecord.boundaryEntries
    : null;
}

function commandSurfaceShellBoundaryMapMalformed(inputRecord) {
  return (
    inputRecord === null ||
    (Object.prototype.hasOwnProperty.call(inputRecord, "reviewedAt") &&
      !isUtcIsoTimestampWithMilliseconds(inputRecord.reviewedAt)) ||
    (Object.prototype.hasOwnProperty.call(inputRecord, "boundaryEntries") &&
      !Array.isArray(inputRecord.boundaryEntries))
  );
}

function commandSurfaceShellBoundaryMapEntryIssue(entries, predicate) {
  return entries !== null && entries.some((entry) => predicate(entry));
}

function commandSurfaceShellBoundaryMapMissingRequired(entry) {
  return (
    !isPlainObjectRecord(entry) ||
    COMMAND_SURFACE_SHELL_REQUIRED_FIELDS.some(
      (field) => !Object.prototype.hasOwnProperty.call(entry, field)
    )
  );
}

function commandSurfaceShellBoundaryMapEntryMalformed(entry) {
  if (!isPlainObjectRecord(entry)) {
    return true;
  }

  return (
    typeof entry.boundaryId !== "string" ||
    !Array.isArray(entry.allowedCurrentBehavior) ||
    !Array.isArray(entry.forbiddenCurrentBehavior) ||
    typeof entry.requiredFutureContractBeforeImplementation !== "string" ||
    typeof entry.requiredFutureAuthorizationPhaseBeforeRuntime !== "string" ||
    typeof entry.commandVisibilityExpectation !== "string" ||
    typeof entry.commandParsingExpectation !== "string" ||
    typeof entry.processControlExpectation !== "string" ||
    typeof entry.stdinStdoutStderrExpectation !== "string" ||
    typeof entry.filesystemInteractionExpectation !== "string" ||
    typeof entry.environmentSecretExposureExpectation !== "string" ||
    typeof entry.operatorApprovalExpectation !== "string" ||
    typeof entry.locusRoleDescription !== "string" ||
    typeof entry.fabricRoleDescription !== "string" ||
    !isPlainObjectRecord(entry.explicitBlockedAuthorizationFlags) ||
    !isPlainObjectRecord(
      entry.unsafeCommandSurfaceShellPrimitiveRuntimeFlags
    ) ||
    entry.nonAuthorizingProof !== true
  );
}

function commandSurfaceShellBoundaryMapAuthorizationFlagEnabled(value) {
  if (!isPlainObjectRecord(value)) {
    return false;
  }

  return (
    (isPlainObjectRecord(value.explicitBlockedAuthorizationFlags) &&
      Object.values(value.explicitBlockedAuthorizationFlags).some(
        (flag) => flag !== false
      )) ||
    COMMAND_SURFACE_SHELL_AUTHORIZATION_FIELDS.some(
      (field) => value[field] === true
    )
  );
}

function commandSurfaceShellBoundaryMapUnsafeFlagEnabled(value) {
  if (!isPlainObjectRecord(value)) {
    return false;
  }

  return (
    (isPlainObjectRecord(
      value.unsafeCommandSurfaceShellPrimitiveRuntimeFlags
    ) &&
      Object.values(
        value.unsafeCommandSurfaceShellPrimitiveRuntimeFlags
      ).some((flag) => flag !== false)) ||
    commandSurfaceShellBoundaryMapHasTrueFieldDeep(
      value,
      COMMAND_SURFACE_SHELL_UNSAFE_FIELDS
    )
  );
}

function commandSurfaceShellBoundaryMapCanonical(entries) {
  if (entries === null) {
    return true;
  }

  return (
    JSON.stringify(entries) ===
    JSON.stringify(commandSurfaceShellBoundaryMapEntries())
  );
}

function commandSurfaceShellBoundaryMapInputClassification(inputRecord) {
  if (commandSurfaceShellBoundaryMapMalformed(inputRecord)) {
    return MALFORMED_COMMAND_SURFACE_SHELL_PRIMITIVE_CONTRACT_BOUNDARY_MAP_CLASSIFICATION;
  }

  const entries = commandSurfaceShellBoundaryMapEntriesInput(inputRecord);

  if (
    commandSurfaceShellBoundaryMapEntryIssue(
      entries,
      commandSurfaceShellBoundaryMapMissingRequired
    )
  ) {
    return "missing_required_command_surface_shell_primitive_boundary_entry_rejected";
  }

  if (
    commandSurfaceShellBoundaryMapEntryIssue(
      entries,
      (entry) =>
        !COMMAND_SURFACE_SHELL_BOUNDARY_FAMILIES.includes(entry.boundaryFamily)
    )
  ) {
    return "unknown_boundary_family_command_surface_shell_primitive_contract_boundary_map_input_rejected";
  }

  if (
    commandSurfaceShellBoundaryMapEntryIssue(
      entries,
      (entry) =>
        !COMMAND_SURFACE_SHELL_RELATED_SYSTEMS.includes(entry.relatedSystem)
    )
  ) {
    return "unknown_related_system_command_surface_shell_primitive_contract_boundary_map_input_rejected";
  }

  if (
    commandSurfaceShellBoundaryMapEntryIssue(
      entries,
      (entry) => !COMMAND_SURFACE_SHELL_STATUSES.includes(entry.currentStatus)
    )
  ) {
    return "unknown_current_status_command_surface_shell_primitive_contract_boundary_map_input_rejected";
  }

  if (
    commandSurfaceShellBoundaryMapEntryIssue(
      entries,
      commandSurfaceShellBoundaryMapEntryMalformed
    )
  ) {
    return MALFORMED_COMMAND_SURFACE_SHELL_PRIMITIVE_CONTRACT_BOUNDARY_MAP_CLASSIFICATION;
  }

  if (
    commandSurfaceShellBoundaryMapHasTrueFieldDeep(inputRecord, [
      "runtimeAuthorized",
      "authorizesRuntime"
    ])
  ) {
    return "runtime_authorization_attempt_command_surface_shell_primitive_contract_boundary_map_input_rejected";
  }

  if (
    COMMAND_SURFACE_SHELL_AUTHORIZATION_FIELDS.some(
      (field) => inputRecord?.[field] === true
    ) ||
    commandSurfaceShellBoundaryMapEntryIssue(
      entries,
      commandSurfaceShellBoundaryMapAuthorizationFlagEnabled
    ) ||
    commandSurfaceShellBoundaryMapAuthorizationFlagEnabled(inputRecord)
  ) {
    return "authorization_flags_enabled_command_surface_shell_primitive_contract_boundary_map_input_rejected";
  }

  if (
    commandSurfaceShellBoundaryMapHasTrueFieldDeep(inputRecord, [
      "reportRunsChecks"
    ])
  ) {
    return "report_runs_checks_true_command_surface_shell_primitive_contract_boundary_map_input_rejected";
  }

  if (
    commandSurfaceShellBoundaryMapHasTrueFieldDeep(
      inputRecord,
      COMMAND_SURFACE_SHELL_AUTHORIZATION_FIELDS
    )
  ) {
    return "runtime_authorization_attempt_command_surface_shell_primitive_contract_boundary_map_input_rejected";
  }

  if (
    commandSurfaceShellBoundaryMapHasTrueFieldDeep(
      inputRecord,
      COMMAND_SURFACE_SHELL_COMMAND_FIELDS
    )
  ) {
    return "command_exposure_attempt_command_surface_shell_primitive_contract_boundary_map_input_rejected";
  }

  if (
    commandSurfaceShellBoundaryMapHasTrueFieldDeep(
      inputRecord,
      COMMAND_SURFACE_SHELL_BLOCKED_CLI_BYPASS_FIELDS
    )
  ) {
    return "blocked_cli_bypass_attempt_command_surface_shell_primitive_contract_boundary_map_input_rejected";
  }

  for (const { classification, fields } of COMMAND_SURFACE_SHELL_HIDDEN_FIELD_GROUPS) {
    if (commandSurfaceShellBoundaryMapHasPresentFieldDeep(inputRecord, fields)) {
      return classification;
    }
  }

  if (
    commandSurfaceShellBoundaryMapUnsafeFlagEnabled(inputRecord) ||
    commandSurfaceShellBoundaryMapEntryIssue(
      entries,
      commandSurfaceShellBoundaryMapUnsafeFlagEnabled
    )
  ) {
    return "unsafe_command_surface_shell_primitive_runtime_flags_command_surface_shell_primitive_contract_boundary_map_input_rejected";
  }

  if (
    commandSurfaceShellBoundaryMapEntryIssue(entries, (entry) =>
      commandSurfaceShellBoundaryMapContainsTrue(entry?.runtimeEffect)
    ) ||
    commandSurfaceShellBoundaryMapContainsTrue(inputRecord?.runtimeEffect)
  ) {
    return "nested_unsafe_flags_command_surface_shell_primitive_contract_boundary_map_input_rejected";
  }

  if (
    Object.keys(inputRecord ?? {}).some(
      (field) =>
        !COMMAND_SURFACE_SHELL_ALLOWED_TOP_LEVEL_FIELDS.includes(field)
    )
  ) {
    return "unknown_top_level_field_command_surface_shell_primitive_contract_boundary_map_input_rejected";
  }

  if (!commandSurfaceShellBoundaryMapCanonical(entries)) {
    return "noncanonical_command_surface_shell_primitive_contract_boundary_map_input_rejected";
  }

  return VALID_COMMAND_SURFACE_SHELL_PRIMITIVE_CONTRACT_BOUNDARY_MAP_CLASSIFICATION;
}

function commandSurfaceShellBoundaryMapAuthorizationFlags() {
  return Object.fromEntries(
    COMMAND_SURFACE_SHELL_AUTHORIZATION_FIELDS.map((field) => [field, false])
  );
}

function commandSurfaceShellBoundaryMapFalseRuntimeFields() {
  return Object.fromEntries(
    COMMAND_SURFACE_SHELL_UNSAFE_FIELDS.map((field) => [field, false])
  );
}

function commandSurfaceShellBoundaryMapDefinition({
  boundaryId,
  boundaryFamily,
  relatedSystem,
  currentStatus = "metadata_only",
  contract,
  commandVisibility,
  commandParsing,
  processControl,
  stdio,
  filesystem,
  environmentSecret,
  operatorApproval,
  locusRole,
  fabricRole
}) {
  return {
    boundaryId,
    boundaryFamily,
    relatedSystem,
    currentStatus,
    allowedCurrentBehavior: [
      "record deterministic review-only metadata",
      "use shell concepts as a taxonomy for future command handling",
      "reference prior Ardyn boundary fixtures without adding command runtime"
    ],
    forbiddenCurrentBehavior: commandSurfaceShellBoundaryMapForbiddenBehavior(),
    requiredFutureContractBeforeImplementation: contract,
    requiredFutureAuthorizationPhaseBeforeRuntime:
      "A separate post-5.74 runtime authorization phase must approve command ownership, parser semantics, process-control boundaries, stdio policy, filesystem/env exposure, operator consent, audit visibility, rollback, and source guards before any shell or command-surface runtime can exist.",
    commandVisibilityExpectation: commandVisibility,
    commandParsingExpectation: commandParsing,
    processControlExpectation: processControl,
    stdinStdoutStderrExpectation: stdio,
    filesystemInteractionExpectation: filesystem,
    environmentSecretExposureExpectation: environmentSecret,
    operatorApprovalExpectation: operatorApproval,
    locusRoleDescription: locusRole,
    fabricRoleDescription: fabricRole
  };
}

function commandSurfaceShellBoundaryMapDefinitions() {
  const defaults = {
    commandVisibility:
      "Current command visibility remains limited to existing blocked CLI behavior; this metadata exposes no command and registers no command surface.",
    commandParsing:
      "Future contract must define grammar, tokenization, quoting, escaping, expansion order, invalid command errors, and fail-closed parsing before runtime; Phase 5.74 parses no command.",
    processControl:
      "Future contract must define process spawn, exit-code, cancellation, retry, background job, reaping, and kill semantics before runtime; Phase 5.74 starts no process.",
    stdio:
      "Future contract must define stdin/stdout/stderr ownership, buffering, redirection, transcript, error-report, and audit boundaries before runtime; Phase 5.74 opens no stdin loop and writes no runtime stdout/stderr.",
    filesystem:
      "Future contract must define all filesystem reads, writes, PATH/executable lookup, filename completion, history persistence, and shell working-directory behavior before runtime; Phase 5.74 performs no shell filesystem behavior.",
    environmentSecret:
      "Future contract must bind environment-variable handling to Phase 5.72 secret/env provenance, redaction, least-privilege, and local-only/cloud-opt-in policy; Phase 5.74 reads no env and loads no secret.",
    operatorApproval:
      "Future contract must require explicit operator approval, auth/permissions linkage from Phase 5.62, input-sanitization linkage from Phase 5.63, retry/cancellation linkage from Phase 5.70, and audit linkage from Phase 5.65 before runtime.",
    locusRole:
      "Locus may later display command/control-surface status only after a separate contract; Phase 5.74 adds no Locus integration, UI, dashboard, bridge, or runtime status feed.",
    fabricRole:
      "Fabric/API/backend command envelopes remain future metadata only; Phase 5.74 adds no Fabric bus, websocket/http transport, MCP exposure, task execution, backend, persistence, or fabric-core producer behavior."
  };

  return [
    commandSurfaceShellBoundaryMapDefinition({
      boundaryId: "phase5-74.ardyn.cli_command_recognition.command_surface_contract",
      boundaryFamily: "command_surface_contract",
      relatedSystem: "ardyn",
      contract:
        "Define CLI command recognition, allowlist, help/error display, blocked-command behavior, auth boundary, and report-only provenance before any new command is exposed.",
      commandVisibility:
        "Existing blocked CLI probes remain rejected; Phase 5.74 recognizes no new command, exposes no shell command, and cannot make serve-runtime runnable.",
      ...defaults
    }),
    commandSurfaceShellBoundaryMapDefinition({
      boundaryId: "phase5-74.ardyn.serve_runtime.blocked_command_boundary",
      boundaryFamily: "command_surface_contract",
      relatedSystem: "ardyn",
      currentStatus: "blocked",
      contract:
        "Preserve serve-runtime default-blocked behavior until a future runtime approval phase explicitly changes CLI behavior and source guards.",
      commandVisibility:
        "serve-runtime and dry-run variants remain blocked command probes; metadata cannot bypass the blocked CLI matrix.",
      ...defaults
    }),
    commandSurfaceShellBoundaryMapDefinition({
      boundaryId: "phase5-74.ardyn_subagent.future_repl.contract",
      boundaryFamily: "repl_contract",
      relatedSystem: "ardyn-subagent",
      contract:
        "Define any future REPL ownership, input loop, evaluation boundary, cancellation, transcript, and approval semantics before runtime.",
      commandVisibility:
        "No interactive REPL, stdin loop, evaluator, prompt loop, or command session is exposed in Phase 5.74.",
      ...defaults
    }),
    commandSurfaceShellBoundaryMapDefinition({
      boundaryId: "phase5-74.ardyn.prompt.contract",
      boundaryFamily: "prompt_contract",
      relatedSystem: "ardyn",
      contract:
        "Define future prompt rendering, prompt state, current directory display, identity display, and no-secret display policy before runtime.",
      commandVisibility:
        "No prompt text, shell banner, terminal UI, or command input affordance is added by Phase 5.74.",
      ...defaults
    }),
    commandSurfaceShellBoundaryMapDefinition({
      boundaryId: "phase5-74.repo_family.command_parser_tokenizer.contract",
      boundaryFamily: "command_parser_contract",
      relatedSystem: "repo-family",
      contract:
        "Define tokenizer/parser grammar, invalid-command handling, quoting/escaping interaction, expansion order, sanitization, and fuzz/fail-closed tests before runtime.",
      ...defaults
    }),
    commandSurfaceShellBoundaryMapDefinition({
      boundaryId: "phase5-74.ardyn.builtin_command.contract",
      boundaryFamily: "builtin_command_contract",
      relatedSystem: "ardyn",
      contract:
        "Define builtin command inventory, authorization, side effects, help text, error behavior, audit/redaction, and no-op review mode before any builtin can run.",
      commandVisibility:
        "No builtin such as cd, pwd, echo, type, exit, history, jobs, fg, bg, or help is implemented or exposed.",
      ...defaults
    }),
    commandSurfaceShellBoundaryMapDefinition({
      boundaryId: "phase5-74.codecrafters_shell_reference.path_resolution.contract",
      boundaryFamily: "path_resolution_contract",
      relatedSystem: "codecrafters-shell-reference",
      contract:
        "Use CodeCrafters shell concepts only as taxonomy for future PATH/executable lookup boundaries; no repo code, SDK, shell challenge implementation, or lookup runtime is integrated.",
      processControl:
        "PATH and executable lookup are blocked because they are prerequisites to process execution; Phase 5.74 resolves no executable.",
      filesystem:
        "No PATH directory scan, filesystem stat, executable completion, or command search is performed.",
      ...defaults
    }),
    commandSurfaceShellBoundaryMapDefinition({
      boundaryId: "phase5-74.external_harness.external_program.contract",
      boundaryFamily: "external_program_contract",
      relatedSystem: "external-harness",
      contract:
        "Define external program invocation ownership, command handoff, sandbox policy, environment policy, stdio routing, exit-code mapping, and operator approval before runtime.",
      processControl:
        "External harness command handoff is metadata only; Phase 5.74 does not spawn, invoke, supervise, or bridge external programs.",
      ...defaults
    }),
    commandSurfaceShellBoundaryMapDefinition({
      boundaryId: "phase5-74.ardyn.process_spawn.boundary",
      boundaryFamily: "process_spawn_boundary",
      relatedSystem: "ardyn",
      contract:
        "Define process spawn allowlist, argv/env construction, working directory, stdio policy, cancellation, timeout, kill, audit, and rollback before runtime.",
      processControl:
        "Process spawn, process groups, kill, signal handling, supervisors, and child lifecycle management remain entirely blocked.",
      ...defaults
    }),
    commandSurfaceShellBoundaryMapDefinition({
      boundaryId: "phase5-74.repo_family.exit_code_invalid_command.contract",
      boundaryFamily: "exit_code_contract",
      relatedSystem: "repo-family",
      contract:
        "Define invalid-command and child exit-code mapping, retry/cancellation linkage from Phase 5.70, error redaction, and transcript policy before runtime.",
      commandVisibility:
        "Invalid future command names remain rejected by the existing CLI; Phase 5.74 adds no shell-specific error runner.",
      ...defaults
    }),
    commandSurfaceShellBoundaryMapDefinition({
      boundaryId: "phase5-74.codecrafters_shell_reference.quoting.contract",
      boundaryFamily: "quoting_contract",
      relatedSystem: "codecrafters-shell-reference",
      contract:
        "Use shell quoting concepts only as future parser taxonomy; define quote grammar, nesting, literal handling, and error behavior before runtime.",
      ...defaults
    }),
    commandSurfaceShellBoundaryMapDefinition({
      boundaryId: "phase5-74.codecrafters_shell_reference.escaping.contract",
      boundaryFamily: "escaping_contract",
      relatedSystem: "codecrafters-shell-reference",
      contract:
        "Use shell escaping concepts only as future parser taxonomy; define escape grammar, platform differences, and sanitizer interaction before runtime.",
      ...defaults
    }),
    commandSurfaceShellBoundaryMapDefinition({
      boundaryId: "phase5-74.ardyn.stdout_stderr_redirection.contract",
      boundaryFamily: "redirection_contract",
      relatedSystem: "ardyn",
      contract:
        "Define stdout/stderr redirection, append redirection, file target authorization, overwrite policy, redaction, and audit before runtime.",
      stdio:
        "No stdout/stderr writer, redirect target, append mode, file descriptor routing, or runtime transcript writer is implemented.",
      filesystem:
        "Redirection would imply filesystem writes; Phase 5.74 writes no redirected output and opens no file target.",
      ...defaults
    }),
    commandSurfaceShellBoundaryMapDefinition({
      boundaryId: "phase5-74.ardyn.pipeline.contract",
      boundaryFamily: "pipeline_contract",
      relatedSystem: "ardyn",
      contract:
        "Define pipeline parsing, process fanout, pipe ownership, backpressure, exit-code aggregation, cancellation, and redaction before runtime.",
      processControl:
        "Pipelines are blocked because they imply multiple process spawns and pipe IO; Phase 5.74 creates no pipe.",
      ...defaults
    }),
    commandSurfaceShellBoundaryMapDefinition({
      boundaryId: "phase5-74.ardyn.completion_filename.contract",
      boundaryFamily: "completion_contract",
      relatedSystem: "ardyn",
      contract:
        "Define autocomplete and filename completion visibility, filesystem scan policy, secret redaction, latency budget, and consent before runtime.",
      commandVisibility:
        "No completion UI, completer, filename probe, filesystem scan, or suggestion engine is added.",
      filesystem:
        "Filename completion would require filesystem reads; Phase 5.74 performs no completion scan.",
      ...defaults
    }),
    commandSurfaceShellBoundaryMapDefinition({
      boundaryId: "phase5-74.repo_family.programmable_completion.contract",
      boundaryFamily: "programmable_completion_contract",
      relatedSystem: "repo-family",
      contract:
        "Define programmable completion scripts/providers, trust provenance, plugin boundaries, command execution prohibition, and audit before runtime.",
      commandVisibility:
        "No programmable completion hook, script, provider registry, plugin grant, or command-executing completer is exposed.",
      ...defaults
    }),
    commandSurfaceShellBoundaryMapDefinition({
      boundaryId: "phase5-74.ardyn.background_job.contract",
      boundaryFamily: "background_job_contract",
      relatedSystem: "ardyn",
      contract:
        "Define background job launch, listing, reaping, cancellation, output collection, operator approval, and no-orphan guarantees before runtime.",
      processControl:
        "Background jobs, job listing, job reaping, worker runtimes, and process supervisors remain blocked.",
      ...defaults
    }),
    commandSurfaceShellBoundaryMapDefinition({
      boundaryId: "phase5-74.ardyn.job_control.contract",
      boundaryFamily: "job_control_contract",
      relatedSystem: "ardyn",
      contract:
        "Define foreground/background switching, signal policy, terminal ownership, process groups, and audit before any job control exists.",
      processControl:
        "No fg, bg, jobs, wait, signal forwarding, terminal process group, or reaping behavior is implemented.",
      ...defaults
    }),
    commandSurfaceShellBoundaryMapDefinition({
      boundaryId: "phase5-74.ardyn.history.contract",
      boundaryFamily: "history_contract",
      relatedSystem: "ardyn",
      contract:
        "Define command history capture, redaction, retention, secrets handling, search, consent, and local-only policy before runtime.",
      environmentSecret:
        "History may expose secrets and env values; Phase 5.74 records no history and persists no command text.",
      ...defaults
    }),
    commandSurfaceShellBoundaryMapDefinition({
      boundaryId: "phase5-74.ardyn.history_persistence.contract",
      boundaryFamily: "history_persistence_contract",
      relatedSystem: "ardyn",
      contract:
        "Define history persistence path, encryption/keying, deletion, retention, export, cloud opt-in, and redaction before any write.",
      filesystem:
        "History persistence would write storage; Phase 5.74 creates no history file, cache, database, transcript, or audit writer.",
      ...defaults
    }),
    commandSurfaceShellBoundaryMapDefinition({
      boundaryId: "phase5-74.codecrafters_shell_reference.parameter_expansion.contract",
      boundaryFamily: "parameter_expansion_contract",
      relatedSystem: "codecrafters-shell-reference",
      contract:
        "Use shell parameter expansion concepts only as taxonomy; define expansion order, defaults, errors, nested expansion, and secret redaction before runtime.",
      commandParsing:
        "No variable, parameter, command substitution, arithmetic expansion, globbing, or tokenizer exploit path is implemented.",
      ...defaults
    }),
    commandSurfaceShellBoundaryMapDefinition({
      boundaryId: "phase5-74.ardyn.environment_variable.contract",
      boundaryFamily: "environment_variable_contract",
      relatedSystem: "ardyn",
      contract:
        "Define environment-variable expansion, inheritance, redaction, denylist/allowlist, local-only/cloud-opt-in, and Phase 5.72 provenance before runtime.",
      environmentSecret:
        "Environment variables are treated as potential secrets; Phase 5.74 performs no env ingestion, expansion, inheritance, logging, or export.",
      ...defaults
    }),
    commandSurfaceShellBoundaryMapDefinition({
      boundaryId: "phase5-74.hermes_reference.terminal_backend.contract",
      boundaryFamily: "terminal_backend_contract",
      relatedSystem: "hermes-reference",
      contract:
        "Define terminal backend ownership, Hermes/CUA trust boundary from Phase 5.68, telemetry opt-in, input/output access, and no computer-use escalation before runtime.",
      commandVisibility:
        "Terminal backend remains a reference boundary only; Phase 5.74 adds no terminal backend, desktop control, browser control, screenshot, OCR, or accessibility runtime.",
      processControl:
        "No terminal session, PTY, OS window enumeration, input automation, or driver install/update/runtime is implemented.",
      ...defaults
    }),
    commandSurfaceShellBoundaryMapDefinition({
      boundaryId: "phase5-74.cua_driver_reference.stdin_stdout_stderr.contract",
      boundaryFamily: "stdin_stdout_stderr_contract",
      relatedSystem: "cua-driver-reference",
      contract:
        "Define stdin/stdout/stderr ownership, buffering, terminal profile, transcript boundaries, CUA permission secrecy, telemetry opt-in, and approval before runtime.",
      stdio:
        "No CUA driver stdio invocation, stdin loop, stdout/stderr runtime writer, terminal backend writer, transcript writer, or audit writer is implemented.",
      ...defaults
    }),
    commandSurfaceShellBoundaryMapDefinition({
      boundaryId: "phase5-74.locus.command_control_surface_display.contract",
      boundaryFamily: "command_surface_contract",
      relatedSystem: "locus",
      contract:
        "Define future Locus command/control-surface display status, non-authorizing indicators, consent, redaction, and no command grant semantics before runtime.",
      commandVisibility:
        "Locus-visible command status remains future display-only metadata; Phase 5.74 adds no Locus UI, dashboard, bridge, or control command.",
      locusRole:
        "Locus may later display blocked/available command-surface metadata only after a contract; it must not authorize commands or operate a shell.",
      ...defaults
    }),
    commandSurfaceShellBoundaryMapDefinition({
      boundaryId: "phase5-74.multiverse.fabric_api_backend_command_envelope.contract",
      boundaryFamily: "command_surface_contract",
      relatedSystem: "multiverse",
      currentStatus: "future_contract_required",
      contract:
        "Define future Fabric/API/backend command envelope schema, provenance, authorization, queue prohibition or ownership, and consumer boundaries before runtime.",
      fabricRole:
        "Fabric/API/backend command envelopes remain metadata only; Ardyn adds no Fabric bus, backend API, storage, queue, task runtime, or fabric-core producer behavior.",
      ...defaults
    }),
    commandSurfaceShellBoundaryMapDefinition({
      boundaryId: "phase5-74.content_fabric.secure_drop_command_reference.boundary",
      boundaryFamily: "shell_reference_boundary",
      relatedSystem: "content-fabric",
      contract:
        "Record Secure Drop command references only as future review metadata with canonical implementation remaining in content-fabric before any command surface can mention it.",
      commandVisibility:
        "No Secure Drop command, inbox polling, crypto, transport, file selection, ST3GG wrapping, or connector ingestion is added.",
      ...defaults
    })
  ];
}

function commandSurfaceShellBoundaryMapEntry(definition) {
  return {
    ...definition,
    phase562AuthPermissionsCommandAuthorizationReference: {
      fixture:
        "tests/fixtures/host-policy/phase5-62/auth-permissions-contract-boundary-map.json",
      commandAuthorizationRequiredBeforeRuntime: true,
      runtimeAuthorized: false
    },
    phase563SecurityInputSanitizationCommandReference: {
      fixture:
        "tests/fixtures/host-policy/phase5-63/security-rls-input-sanitization-contract-boundary-map.json",
      inputSanitizationRequiredBeforeRuntime: true,
      runtimeAuthorized: false
    },
    phase565LoggingAuditCommandReference: {
      fixture:
        "tests/fixtures/host-policy/phase5-65/error-tracking-logging-audit-integrity-contract-boundary-map.json",
      auditContractRequiredBeforeRuntime: true,
      auditWriterRuntimeImplemented: false
    },
    phase568TerminalBackendReference: {
      fixture:
        "tests/fixtures/host-policy/phase5-68/agent-mode-profile-skillhub-capability-boundary-map.json",
      terminalBackendReferenceOnly: true,
      hermesCuaRuntimeAuthorized: false
    },
    phase570OperationsReliabilityReference: {
      fixture:
        "tests/fixtures/host-policy/phase5-70/operations-reliability-contract-boundary-map.json",
      retryCancellationContractRequiredBeforeRuntime: true,
      retryEngineImplemented: false
    },
    phase572SecretsEnvExposureReference: {
      fixture:
        "tests/fixtures/host-policy/phase5-72/secrets-management-key-rotation-external-gateway-credential-boundary-map.json",
      envSecretExposureBoundaryRequiredBeforeRuntime: true,
      envIngestionEnabled: false
    },
    phase573ExternalGatewayMatrixBoundaryReference: {
      fixture:
        "tests/fixtures/host-policy/phase5-73/external-gateway-matrix-transport-contract-boundary-map.json",
      gatewayRuntimeAuthorized: false,
      matrixRuntimeAuthorized: false
    },
    codecraftersShellReferenceTaxonomy: {
      upstreamReference: "codecrafters-io/build-your-own-shell",
      taxonomyOnly: true,
      repositoryInstalledOrCopied: false,
      courseSdkIntegrated: false
    },
    commandSurfaceBoundaryMetadataOnly: true,
    noLiveCommandSurfaceShellPrimitiveRuntimePerformed: true,
    explicitBlockedAuthorizationFlags:
      commandSurfaceShellBoundaryMapAuthorizationFlags(),
    unsafeCommandSurfaceShellPrimitiveRuntimeFlags:
      commandSurfaceShellBoundaryMapFalseRuntimeFields(),
    nonAuthorizingProof: true,
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

function commandSurfaceShellBoundaryMapEntries() {
  return commandSurfaceShellBoundaryMapDefinitions().map(
    commandSurfaceShellBoundaryMapEntry
  );
}

function commandSurfaceShellBoundaryMapSummary(entries) {
  const countByFamily = Object.fromEntries(
    COMMAND_SURFACE_SHELL_BOUNDARY_FAMILIES.map((family) => [
      family,
      entries.filter((entry) => entry.boundaryFamily === family).length
    ])
  );
  const countByRelatedSystem = Object.fromEntries(
    COMMAND_SURFACE_SHELL_RELATED_SYSTEMS.map((system) => [
      system,
      entries.filter((entry) => entry.relatedSystem === system).length
    ])
  );
  const countByStatus = Object.fromEntries(
    COMMAND_SURFACE_SHELL_STATUSES.map((status) => [
      status,
      entries.filter((entry) => entry.currentStatus === status).length
    ])
  );
  const allBlockedAuthorizationFlagsFalse = entries.every((entry) =>
    Object.values(entry.explicitBlockedAuthorizationFlags).every(
      (value) => value === false
    )
  );
  const allUnsafeCommandSurfaceShellPrimitiveRuntimeFlagsFalse = entries.every(
    (entry) =>
      Object.values(
        entry.unsafeCommandSurfaceShellPrimitiveRuntimeFlags
      ).every((value) => value === false)
  );
  const allRuntimeEffectsFalse = entries.every((entry) =>
    Object.values(entry.runtimeEffect).every((value) => value === false)
  );

  return {
    boundaryMapKind:
      COMMAND_SURFACE_SHELL_PRIMITIVE_CONTRACT_BOUNDARY_MAP_KIND,
    boundaryEntryCount: entries.length,
    countByFamily,
    countByRelatedSystem,
    countByStatus,
    boundaryFamilies: [...COMMAND_SURFACE_SHELL_BOUNDARY_FAMILIES],
    relatedSystems: [...COMMAND_SURFACE_SHELL_RELATED_SYSTEMS],
    currentStatusValues: [...COMMAND_SURFACE_SHELL_STATUSES],
    commandSurfaceShellPrimitiveBoundaryMetadataOnly: true,
    noLiveCommandSurfaceShellPrimitiveRuntimePerformed: true,
    cliCommandRecognitionBoundaryRecorded: true,
    serveRuntimeBlockedCommandBoundaryRecorded: true,
    futureReplPromptBoundaryRecorded: true,
    commandParserTokenizerBoundaryRecorded: true,
    builtinCommandBoundaryRecorded: true,
    invalidCommandErrorHandlingBoundaryRecorded: true,
    pathExecutableLookupBoundaryRecorded: true,
    externalProgramExecutionBoundaryRecorded: true,
    processSpawnExitCodeBoundaryRecorded: true,
    quotingEscapingBoundaryRecorded: true,
    stdoutStderrRedirectionBoundaryRecorded: true,
    appendRedirectionBoundaryRecorded: true,
    pipelineBoundaryRecorded: true,
    completionAutocompleteBoundaryRecorded: true,
    programmableCompletionBoundaryRecorded: true,
    filenameCompletionBoundaryRecorded: true,
    backgroundJobsJobListingReapingBoundaryRecorded: true,
    commandHistoryPersistenceBoundaryRecorded: true,
    parameterExpansionBoundaryRecorded: true,
    environmentVariableExpansionBoundaryRecorded: true,
    terminalBackendBoundaryFromPhase568Recorded: true,
    operationsReliabilityRetryCancellationBoundaryFromPhase570Recorded: true,
    authPermissionsCommandAuthorizationBoundaryFromPhase562Recorded: true,
    securityInputSanitizationCommandBoundaryFromPhase563Recorded: true,
    secretsEnvExposureBoundaryFromPhase572Recorded: true,
    loggingAuditBoundaryFromPhase565Recorded: true,
    locusCommandControlSurfaceDisplayBoundaryRecorded: true,
    fabricApiBackendCommandEnvelopeBoundaryRecorded: true,
    externalHarnessCommandHandoffBoundaryRecorded: true,
    noShellRuntime: true,
    noReplRuntime: true,
    noCommandParserRuntime: true,
    noPathLookupRuntime: true,
    noProcessSpawn: true,
    noBuiltinExecution: true,
    noRedirectionPipelineRuntime: true,
    noCompletionRuntime: true,
    noBackgroundJobRuntime: true,
    noHistoryRuntime: true,
    noEnvironmentParameterExpansionRuntime: true,
    noTerminalBackendRuntime: true,
    noMatrixGatewayRuntime: true,
    noContentAddressedChunkedResumableP2pTransport: true,
    noSqliteRuntime: true,
    noSecureDropImplementation: true,
    noFabricWebsocketHttpMcpTaskRuntime: true,
    noBackendApiServerDatabaseStorageCacheRlsMigration: true,
    noEncodedHandoffRuntimeCodecTranslator: true,
    noHermesCuaComputerUseRuntime: true,
    noLoggerAuditTelemetryHealthRuntime: true,
    noInfrastructureDeploymentComplianceAutomation: true,
    noTestingCiReleaseAutomation: true,
    noFilesystemProcessUiRuntime: true,
    noCommandExposure: true,
    noBlockedCliBypass: true,
    allBlockedAuthorizationFlagsFalse,
    allUnsafeCommandSurfaceShellPrimitiveRuntimeFlagsFalse,
    allRuntimeEffectsFalse,
    allEntriesNonAuthorizing: entries.every(
      (entry) => entry.nonAuthorizingProof === true
    )
  };
}

function commandSurfaceShellBoundaryMapValidationRules() {
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
    enabledShellRuntimeFailClosed: true,
    enabledReplFailClosed: true,
    enabledCommandParserRuntimeFailClosed: true,
    enabledBuiltinExecutionFailClosed: true,
    enabledPathLookupFailClosed: true,
    enabledExternalProgramExecutionFailClosed: true,
    enabledProcessSpawnFailClosed: true,
    enabledStdinLoopFailClosed: true,
    enabledStdoutStderrWriterFailClosed: true,
    enabledRedirectionPipelineRuntimeFailClosed: true,
    enabledCompletionCompleterRuntimeFailClosed: true,
    enabledBackgroundJobRuntimeFailClosed: true,
    enabledJobControlRuntimeFailClosed: true,
    enabledCommandHistoryPersistenceFailClosed: true,
    enabledEnvironmentVariableExpansionRuntimeFailClosed: true,
    enabledParameterExpansionRuntimeFailClosed: true,
    enabledTerminalBackendRuntimeFailClosed: true,
    hiddenShellReplProcessExecutionSemanticsFailClosed: true,
    hiddenPathExecutableLookupSemanticsFailClosed: true,
    hiddenFilesystemReadWriteSemanticsFailClosed: true,
    hiddenEnvSecretsExposureSemanticsFailClosed: true,
    hiddenPipeRedirectionStdioSemanticsFailClosed: true,
    hiddenJobControlBackgroundWorkerSemanticsFailClosed: true,
    hiddenCommandExposureOrRuntimeAuthorizationSemanticsFailClosed: true,
    hiddenBackendApiServerSemanticsFailClosed: true,
    hiddenDatabaseStorageCacheWriteSemanticsFailClosed: true,
    hiddenAuthSessionTokenApiKeySemanticsFailClosed: true,
    hiddenConnectorGrantSemanticsFailClosed: true,
    hiddenFabricWebsocketHttpMcpTaskRuntimeSemanticsFailClosed: true,
    hiddenSecureDropImplementationSemanticsFailClosed: true,
    hiddenMatrixGatewayRuntimeSemanticsFailClosed: true,
    hiddenContentAddressedChunkedResumableP2pTransportSemanticsFailClosed: true,
    hiddenSqliteEmbeddedDbQueryRuntimeSemanticsFailClosed: true,
    hiddenHermesCuaComputerUseRuntimeSemanticsFailClosed: true,
    hiddenEncodedHandoffRuntimeCodecTranslatorStegoCovertChannelTokenizerExploitBypassSemanticsFailClosed:
      true,
    nestedUnsafeFlagsFailClosed: true,
    noncanonicalBoundaryEntriesFailClosed: true,
    validationRunsShell: false,
    validationParsesCommands: false,
    validationSpawnsProcesses: false,
    validationReadsPathOrEnv: false,
    validationWritesFilesystem: false,
    validationRequestsJules: false
  };
}

function commandSurfaceShellBoundaryMapGaps() {
  return [
    "Future command-surface work still needs CLI recognition, allowlist, blocked-command, auth/permissions, input-sanitization, operator-approval, audit, and source-guard contracts before command exposure.",
    "Future shell primitive work still needs REPL, prompt, parser/tokenizer, quoting, escaping, expansion, builtins, PATH/executable lookup, process spawn, exit-code, stdio, redirection, pipeline, completion, job-control, and history contracts before runtime.",
    "Future environment/secret handling remains blocked until Phase 5.72 provenance, redaction, least-privilege, and local-only/cloud-opt-in expectations are implemented in a separately authorized runtime phase.",
    "Future Locus display, external-harness handoff, Fabric/API/backend command envelopes, terminal backend, Hermes/CUA, Matrix/gateway, Secure Drop, encoded handoff, SQLite, and storage behavior remain metadata-only references.",
    "Future embedded DB/query-engine primitive work remains a separate review-only boundary map before any SQLite or DB runtime authorization."
  ];
}

function commandSurfaceShellBoundaryMapState(reviewedAt) {
  const boundaryEntries = commandSurfaceShellBoundaryMapEntries();

  return {
    schema:
      COMMAND_SURFACE_SHELL_PRIMITIVE_CONTRACT_BOUNDARY_MAP_STATE_SCHEMA,
    schemaVersion:
      COMMAND_SURFACE_SHELL_PRIMITIVE_CONTRACT_BOUNDARY_MAP_VERSION,
    stateKind: COMMAND_SURFACE_SHELL_PRIMITIVE_CONTRACT_BOUNDARY_MAP_KIND,
    stateMode: "review-only",
    reviewedAt,
    sourcePhaseContext: {
      phase559FabricAwareApiBackendBoundary:
        "tests/fixtures/host-policy/phase5-59/fabric-aware-api-backend-contract-boundary-map.json",
      phase562AuthPermissionsContractBoundary:
        "tests/fixtures/host-policy/phase5-62/auth-permissions-contract-boundary-map.json",
      phase563SecurityRlsInputSanitizationBoundary:
        "tests/fixtures/host-policy/phase5-63/security-rls-input-sanitization-contract-boundary-map.json",
      phase565ErrorTrackingLoggingAuditIntegrityBoundary:
        "tests/fixtures/host-policy/phase5-65/error-tracking-logging-audit-integrity-contract-boundary-map.json",
      phase568AgentModeProfileSkillhubCapabilityBoundary:
        "tests/fixtures/host-policy/phase5-68/agent-mode-profile-skillhub-capability-boundary-map.json",
      phase570OperationsReliabilityBoundary:
        "tests/fixtures/host-policy/phase5-70/operations-reliability-contract-boundary-map.json",
      phase572SecretsCredentialBoundary:
        "tests/fixtures/host-policy/phase5-72/secrets-management-key-rotation-external-gateway-credential-boundary-map.json",
      phase573ExternalGatewayMatrixTransportBoundary:
        "tests/fixtures/host-policy/phase5-73/external-gateway-matrix-transport-contract-boundary-map.json",
      codecraftersShellReference: "codecrafters-io/build-your-own-shell",
      codecraftersShellReferenceTaxonomyOnly: true,
      codecraftersShellRepoInstalledOrCopied: false,
      commandSurfaceCoverageItemRepresented: true,
      noShellRuntimeImplemented: true,
      noCommandParserImplemented: true,
      noProcessSpawnImplemented: true,
      noTerminalBackendImplemented: true,
      runtimeStillBlocked: true
    },
    boundaryEntries,
    boundaryMapSummary:
      commandSurfaceShellBoundaryMapSummary(boundaryEntries),
    invalidBoundaryCasePolicy:
      commandSurfaceShellBoundaryMapValidationRules(),
    topCommandSurfaceShellSqliteCodeModeFabricApiBackendGaps:
      commandSurfaceShellBoundaryMapGaps(),
    recommendedNextPhase:
      "phase-5.75-review-only-embedded-db-query-engine-primitive-contract-boundary-map",
    commandSurfaceShellPrimitiveContractBoundaryMapOnly: true,
    reviewOnly: true,
    metadataOnly: true,
    authoritative: false,
    nonAuthorizingProof: true,
    reportRunsChecks: false,
    ...commandSurfaceShellBoundaryMapFalseRuntimeFields(),
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

function commandSurfaceShellBoundaryMapResult({
  reviewedAt,
  reviewedAtDefaulted,
  classification,
  accepted,
  commandSurfaceShellPrimitiveContractBoundaryMap
}) {
  return {
    schema: COMMAND_SURFACE_SHELL_PRIMITIVE_CONTRACT_BOUNDARY_MAP_SCHEMA,
    schemaVersion:
      COMMAND_SURFACE_SHELL_PRIMITIVE_CONTRACT_BOUNDARY_MAP_VERSION,
    commandSurfaceShellPrimitiveContractBoundaryMapKind:
      COMMAND_SURFACE_SHELL_PRIMITIVE_CONTRACT_BOUNDARY_MAP_KIND,
    commandSurfaceShellPrimitiveContractBoundaryMapMode: "review-only",
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    commandSurfaceShellPrimitiveContractBoundaryMapProduced: accepted,
    commandSurfaceShellPrimitiveContractBoundaryMap,
    boundaryMapSummary: accepted
      ? commandSurfaceShellPrimitiveContractBoundaryMap.boundaryMapSummary
      : null,
    boundaryEntries: accepted
      ? commandSurfaceShellPrimitiveContractBoundaryMap.boundaryEntries
      : [],
    invalidBoundaryCasePolicy: accepted
      ? commandSurfaceShellPrimitiveContractBoundaryMap.invalidBoundaryCasePolicy
      : commandSurfaceShellBoundaryMapValidationRules(),
    topCommandSurfaceShellSqliteCodeModeFabricApiBackendGaps: accepted
      ? commandSurfaceShellPrimitiveContractBoundaryMap
          .topCommandSurfaceShellSqliteCodeModeFabricApiBackendGaps
      : [],
    recommendedNextPhase: accepted
      ? commandSurfaceShellPrimitiveContractBoundaryMap.recommendedNextPhase
      : null,
    commandSurfaceShellPrimitiveContractBoundaryMapOnly: true,
    reviewOnly: true,
    metadataOnly: true,
    authoritative: false,
    nonAuthorizingProof: true,
    reportRunsChecks: false,
    ...commandSurfaceShellBoundaryMapFalseRuntimeFields(),
    rejectionReasons: accepted
      ? []
      : [
          {
            classification,
            rejected: true,
            runtimeAuthorized: false,
            commandSurfaceAuthorized: false,
            shellRuntimeAuthorized: false,
            processSpawnAuthorized: false,
            pathLookupAuthorized: false,
            terminalBackendAuthorized: false,
            commandExposureAuthorized: false,
            reportRunsChecks: false
          }
        ],
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

export function createCommandSurfaceShellPrimitiveContractBoundaryMapForReview(
  input = {}
) {
  const inputRecord = commandSurfaceShellBoundaryMapInputRecord(input);
  const reviewedAt = commandSurfaceShellBoundaryMapReviewedAt(inputRecord);
  const reviewedAtDefaulted = isReviewedAtDefaulted(inputRecord);
  const classification =
    commandSurfaceShellBoundaryMapInputClassification(inputRecord);
  const accepted =
    classification ===
    VALID_COMMAND_SURFACE_SHELL_PRIMITIVE_CONTRACT_BOUNDARY_MAP_CLASSIFICATION;
  const commandSurfaceShellPrimitiveContractBoundaryMap = accepted
    ? commandSurfaceShellBoundaryMapState(reviewedAt)
    : null;

  return commandSurfaceShellBoundaryMapResult({
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    accepted,
    commandSurfaceShellPrimitiveContractBoundaryMap
  });
}

const FABRIC_CORE_CONSUMER_READINESS_BOUNDARY_UPDATE_STATE_SCHEMA =
  "ardyn.phase-5.75.fabric-core-consumer-integration-readiness-boundary-update-state";
const VALID_FABRIC_CORE_CONSUMER_READINESS_BOUNDARY_UPDATE_CLASSIFICATION =
  "valid_fabric_core_consumer_integration_readiness_boundary_update_runtime_still_blocked";
const MALFORMED_FABRIC_CORE_CONSUMER_READINESS_BOUNDARY_UPDATE_CLASSIFICATION =
  "malformed_fabric_core_consumer_integration_readiness_boundary_update_input_rejected";

const FABRIC_CORE_CONSUMER_READINESS_BOUNDARY_FAMILIES = Object.freeze([
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
const FABRIC_CORE_CONSUMER_READINESS_RELATED_SYSTEMS = Object.freeze([
  "ardyn",
  "multiverse",
  "locus",
  "content-fabric",
  "repo-family",
  "fabric-core-reference",
  "fabric-transport-d-reference"
]);
const FABRIC_CORE_CONSUMER_READINESS_STATUSES = Object.freeze([
  "metadata_only",
  "producer_ready_consumer_pending",
  "blocked",
  "future_contract_required"
]);
const FABRIC_CORE_CONSUMER_READINESS_REQUIRED_FIELDS = Object.freeze([
  "boundaryId",
  "boundaryFamily",
  "relatedSystem",
  "currentStatus",
  "allowedCurrentBehavior",
  "forbiddenCurrentBehavior",
  "requiredFutureContractBeforeImplementation",
  "requiredFutureAuthorizationPhaseBeforeRuntime",
  "producerSourceOfTruthExpectation",
  "jsTsConsumerExpectation",
  "nonJsSidecarConsumerExpectation",
  "contentIdReverificationExpectation",
  "bearerTokenLoopbackExpectation",
  "largePayloadTodoExpectation",
  "pointToPointHoldExpectation",
  "locusByteInteropExpectation",
  "multiverseProducerRole",
  "fabricRoleDescription",
  "explicitBlockedAuthorizationFlags",
  "unsafeFabricCoreConsumerReadinessRuntimeFlags",
  "nonAuthorizingProof"
]);
const FABRIC_CORE_CONSUMER_READINESS_ALLOWED_TOP_LEVEL_FIELDS =
  Object.freeze(["reviewedAt", "boundaryEntries"]);
const FABRIC_CORE_CONSUMER_READINESS_UNSAFE_FIELDS = Object.freeze([
  "runtimeExecutionEnabled",
  "runtimeAuthorizationEnabled",
  "runtimeCommandEnabled",
  "commandExposureEnabled",
  "commandsExposed",
  "connectorGrantProduced",
  "fabricRuntimeImplementedByArdyn",
  "fabricRuntimeEnabled",
  "websocketHttpTransportImplementedByArdyn",
  "websocketRuntimeEnabled",
  "httpTransportImplementedByArdyn",
  "httpRuntimeEnabled",
  "mcpRuntimeEnabled",
  "mcpToolExposureEnabled",
  "taskExecutionEnabled",
  "secureDropImplemented",
  "serviceDiscoveryEnabled",
  "scheduleEnforcementEnabled",
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
  "tokenLoaderEnabled",
  "contentIdVerificationRuntimeEnabled",
  "contentIdHashingRuntimeEnabled",
  "contentAddressedTransportEnabled",
  "chunkedTransferEnabled",
  "resumableTransferEnabled",
  "multiSourceTransferEnabled",
  "bittorrentDhtSwarmP2pEnabled",
  "p2pTransferEnabled",
  "largePayloadTransferRuntimeEnabled",
  "packageJsonDependencyChanged",
  "rustSidecarClientEnabled",
  "fabricCoreProducerBehaviorEnabled",
  "matrixClientRuntimeEnabled",
  "homeserverConnectionEnabled",
  "e2eeKeySessionHandlingEnabled",
  "messagePollingRuntimeEnabled",
  "messageSendingRuntimeEnabled",
  "externalGatewayRuntimeEnabled",
  "shellRuntimeEnabled",
  "commandRuntimeEnabled",
  "sqliteRuntimeEnabled",
  "embeddedDbRuntimeEnabled",
  "queryEngineRuntimeEnabled",
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
  "failoverRuntimeImplemented",
  "infrastructureAutomationImplemented",
  "deploymentAutomationImplemented",
  "complianceEnforcementImplemented",
  "piiProcessingImplemented",
  "retentionJobImplemented",
  "exportJobImplemented",
  "testingCiReleaseAutomationEnabled",
  "encodedHandoffRuntimeImplementedByArdyn",
  "codecRuntimeEnabled",
  "translatorRuntimeEnabled",
  "filesystemProcessRuntimeEnabled",
  "uiRuntimeImplemented",
  "blockedCliBypassEnabled"
]);
const FABRIC_CORE_CONSUMER_READINESS_AUTHORIZATION_FIELDS = Object.freeze([
  "runtimeAuthorized",
  "runtimeAuthorizationGranted",
  "authorizesRuntime",
  "fabricCoreConsumerAuthorizationGranted",
  "fabricCoreJsTsConsumerAuthorizationGranted",
  "fabricTransportSidecarAuthorizationGranted",
  "loopbackHttpAuthorizationGranted",
  "bearerTokenAuthorizationGranted",
  "contentIdVerificationAuthorizationGranted",
  "largePayloadTransferAuthorizationGranted",
  "fabricRuntimeAuthorizationGranted",
  "packageDependencyAuthorizationGranted",
  "rustSidecarClientAuthorizationGranted",
  "secureDropAuthorizationGranted",
  "commandExposureAuthorizationGranted",
  "approvalDecisionProduced",
  "approvalGrantProduced"
]);
const FABRIC_CORE_CONSUMER_READINESS_COMMAND_FIELDS = Object.freeze([
  "commandExposureEnabled",
  "commandRuntimeControlEnabled",
  "commandsExposed",
  "exposesCommands",
  "runtimeCommandEnabled",
  "fabricCoreCommandExposed",
  "sidecarCommandExposed",
  "serveRuntimeCommandEnabled"
]);
const FABRIC_CORE_CONSUMER_READINESS_BLOCKED_CLI_BYPASS_FIELDS =
  Object.freeze([
    "blockedCliBypassEnabled",
    "dryRunBypassesBlock",
    "serveRuntimeBypassEnabled",
    "bypassBlockedCommandBehavior",
    "blockedCommandOverride"
  ]);
const FABRIC_CORE_CONSUMER_READINESS_HIDDEN_FIELD_GROUPS = Object.freeze([
  {
    classification:
      "hidden_fabric_core_import_semantics_fabric_core_consumer_integration_readiness_boundary_update_input_rejected",
    fields: [
      "multiverseFabricCoreImport",
      "fabricCoreImport",
      "fabricCorePackageImport",
      "fabricCoreDependency",
      "fabricCoreNpmImport",
      "fabricCoreClient",
      "@multiverse/fabric-core"
    ]
  },
  {
    classification:
      "hidden_sidecar_http_bearer_token_semantics_fabric_core_consumer_integration_readiness_boundary_update_input_rejected",
    fields: [
      "fabricTransportDSidecar",
      "fabricTransportDClient",
      "sidecarHttpClient",
      "loopbackHttpClient",
      "bearerToken",
      "bearerTokenLoader",
      "sidecarBearerToken"
    ]
  },
  {
    classification:
      "hidden_hashing_content_id_verification_semantics_fabric_core_consumer_integration_readiness_boundary_update_input_rejected",
    fields: [
      "contentIdVerifier",
      "contentIdVerification",
      "contentHash",
      "hashRuntime",
      "contentDigestVerification",
      "blake3Runtime"
    ]
  },
  {
    classification:
      "hidden_content_addressed_chunked_resumable_p2p_transport_semantics_fabric_core_consumer_integration_readiness_boundary_update_input_rejected",
    fields: [
      "contentAddressedTransport",
      "chunkedTransfer",
      "resumableTransfer",
      "multiSourceTransfer",
      "bittorrentRuntime",
      "dhtRuntime",
      "swarmRuntime",
      "p2pTransfer"
    ]
  },
  {
    classification:
      "hidden_large_payload_movement_semantics_fabric_core_consumer_integration_readiness_boundary_update_input_rejected",
    fields: [
      "largePayloadTransfer",
      "modelWeightTransfer",
      "largeConnectorPackTransfer",
      "largeSkillPackTransfer",
      "bigMediaTransfer",
      "fileTransferRuntime"
    ]
  },
  {
    classification:
      "hidden_filesystem_scanning_file_selection_semantics_fabric_core_consumer_integration_readiness_boundary_update_input_rejected",
    fields: [
      "filesystemScanner",
      "fileSelectionRuntime",
      "filesystemScanning",
      "filePicker"
    ]
  },
  {
    classification:
      "hidden_backend_api_server_semantics_fabric_core_consumer_integration_readiness_boundary_update_input_rejected",
    fields: [
      "backendRuntime",
      "apiServer",
      "apiEndpoint",
      "serverMiddleware",
      "httpHandler"
    ]
  },
  {
    classification:
      "hidden_database_storage_cache_write_semantics_fabric_core_consumer_integration_readiness_boundary_update_input_rejected",
    fields: [
      "databaseClient",
      "storageAdapter",
      "cacheEngine",
      "databaseWrite",
      "migrationRunner",
      "rlsRuntime"
    ]
  },
  {
    classification:
      "hidden_auth_session_token_api_key_semantics_fabric_core_consumer_integration_readiness_boundary_update_input_rejected",
    fields: [
      "authSession",
      "sessionToken",
      "apiKey",
      "oauthFlow",
      "accessToken",
      "refreshToken",
      "tokenLoader"
    ]
  },
  {
    classification:
      "hidden_connector_grant_semantics_fabric_core_consumer_integration_readiness_boundary_update_input_rejected",
    fields: [
      "connectorGrant",
      "providerGrant",
      "pluginGrant",
      "mcpGrant",
      "toolGrant"
    ]
  },
  {
    classification:
      "hidden_matrix_gateway_runtime_semantics_fabric_core_consumer_integration_readiness_boundary_update_input_rejected",
    fields: [
      "matrixClient",
      "matrixRuntime",
      "homeserverConnection",
      "matrixRoomPoller",
      "matrixMessageSender",
      "externalGateway"
    ]
  },
  {
    classification:
      "hidden_shell_command_runtime_semantics_fabric_core_consumer_integration_readiness_boundary_update_input_rejected",
    fields: [
      "shellRuntime",
      "commandRuntime",
      "commandParser",
      "pathLookup",
      "processSpawn",
      "commandRunner"
    ]
  },
  {
    classification:
      "hidden_sqlite_embedded_db_query_runtime_semantics_fabric_core_consumer_integration_readiness_boundary_update_input_rejected",
    fields: [
      "sqliteRuntime",
      "embeddedDb",
      "queryEngine",
      "sqlParser",
      "btreeTraversal",
      "walRuntime"
    ]
  },
  {
    classification:
      "hidden_encoded_handoff_runtime_codec_translator_semantics_fabric_core_consumer_integration_readiness_boundary_update_input_rejected",
    fields: [
      "encodedHandoffRuntime",
      "codecRuntime",
      "translatorRuntime",
      "stegoRuntime",
      "covertChannel",
      "tokenizerExploit",
      "bypassRuntime"
    ]
  }
]);

function fabricCoreConsumerReadinessBoundaryUpdateInputRecord(input) {
  return isPlainObjectRecord(input) ? input : null;
}

function fabricCoreConsumerReadinessBoundaryUpdateReviewedAt(inputRecord) {
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

function fabricCoreConsumerReadinessBoundaryUpdateHasTrueFieldDeep(
  value,
  fields
) {
  if (Array.isArray(value)) {
    return value.some((item) =>
      fabricCoreConsumerReadinessBoundaryUpdateHasTrueFieldDeep(item, fields)
    );
  }

  if (!isPlainObjectRecord(value)) {
    return false;
  }

  for (const [key, nested] of Object.entries(value)) {
    if (fields.includes(key) && nested === true) {
      return true;
    }

    if (
      fabricCoreConsumerReadinessBoundaryUpdateHasTrueFieldDeep(nested, fields)
    ) {
      return true;
    }
  }

  return false;
}

function fabricCoreConsumerReadinessBoundaryUpdateHasPresentFieldDeep(
  value,
  fields
) {
  if (Array.isArray(value)) {
    return value.some((item) =>
      fabricCoreConsumerReadinessBoundaryUpdateHasPresentFieldDeep(item, fields)
    );
  }

  if (!isPlainObjectRecord(value)) {
    return false;
  }

  for (const [key, nested] of Object.entries(value)) {
    if (
      key === "explicitBlockedAuthorizationFlags" ||
      key === "unsafeFabricCoreConsumerReadinessRuntimeFlags"
    ) {
      continue;
    }

    if (fields.includes(key)) {
      return true;
    }

    if (
      fabricCoreConsumerReadinessBoundaryUpdateHasPresentFieldDeep(nested, fields)
    ) {
      return true;
    }
  }

  return false;
}

function fabricCoreConsumerReadinessBoundaryUpdateEntriesInput(inputRecord) {
  return Array.isArray(inputRecord?.boundaryEntries)
    ? inputRecord.boundaryEntries
    : null;
}

function fabricCoreConsumerReadinessBoundaryUpdateMalformed(inputRecord) {
  return (
    inputRecord === null ||
    (Object.prototype.hasOwnProperty.call(inputRecord, "reviewedAt") &&
      !isUtcIsoTimestampWithMilliseconds(inputRecord.reviewedAt)) ||
    (Object.prototype.hasOwnProperty.call(inputRecord, "boundaryEntries") &&
      !Array.isArray(inputRecord.boundaryEntries))
  );
}

function fabricCoreConsumerReadinessBoundaryUpdateEntryIssue(
  entries,
  predicate
) {
  return entries !== null && entries.some((entry) => predicate(entry));
}

function fabricCoreConsumerReadinessBoundaryUpdateMissingRequired(entry) {
  return (
    !isPlainObjectRecord(entry) ||
    FABRIC_CORE_CONSUMER_READINESS_REQUIRED_FIELDS.some(
      (field) => !Object.prototype.hasOwnProperty.call(entry, field)
    )
  );
}

function fabricCoreConsumerReadinessBoundaryUpdateEntryMalformed(entry) {
  if (!isPlainObjectRecord(entry)) {
    return true;
  }

  return (
    typeof entry.boundaryId !== "string" ||
    !Array.isArray(entry.allowedCurrentBehavior) ||
    !Array.isArray(entry.forbiddenCurrentBehavior) ||
    typeof entry.requiredFutureContractBeforeImplementation !== "string" ||
    typeof entry.requiredFutureAuthorizationPhaseBeforeRuntime !== "string" ||
    typeof entry.producerSourceOfTruthExpectation !== "string" ||
    typeof entry.jsTsConsumerExpectation !== "string" ||
    typeof entry.nonJsSidecarConsumerExpectation !== "string" ||
    typeof entry.contentIdReverificationExpectation !== "string" ||
    typeof entry.bearerTokenLoopbackExpectation !== "string" ||
    typeof entry.largePayloadTodoExpectation !== "string" ||
    typeof entry.pointToPointHoldExpectation !== "string" ||
    typeof entry.locusByteInteropExpectation !== "string" ||
    typeof entry.multiverseProducerRole !== "string" ||
    typeof entry.fabricRoleDescription !== "string" ||
    !isPlainObjectRecord(entry.explicitBlockedAuthorizationFlags) ||
    !isPlainObjectRecord(
      entry.unsafeFabricCoreConsumerReadinessRuntimeFlags
    ) ||
    entry.nonAuthorizingProof !== true
  );
}

function fabricCoreConsumerReadinessBoundaryUpdateAuthorizationFlagEnabled(
  value
) {
  if (!isPlainObjectRecord(value)) {
    return false;
  }

  return (
    (isPlainObjectRecord(value.explicitBlockedAuthorizationFlags) &&
      Object.values(value.explicitBlockedAuthorizationFlags).some(
        (flag) => flag !== false
      )) ||
    FABRIC_CORE_CONSUMER_READINESS_AUTHORIZATION_FIELDS.some(
      (field) => value[field] === true
    )
  );
}

function fabricCoreConsumerReadinessBoundaryUpdateUnsafeFlagEnabled(value) {
  if (!isPlainObjectRecord(value)) {
    return false;
  }

  return (
    (isPlainObjectRecord(
      value.unsafeFabricCoreConsumerReadinessRuntimeFlags
    ) &&
      Object.values(
        value.unsafeFabricCoreConsumerReadinessRuntimeFlags
      ).some((flag) => flag !== false)) ||
    fabricCoreConsumerReadinessBoundaryUpdateHasTrueFieldDeep(
      value,
      FABRIC_CORE_CONSUMER_READINESS_UNSAFE_FIELDS
    )
  );
}

function fabricCoreConsumerReadinessBoundaryUpdateCanonical(entries) {
  if (entries === null) {
    return true;
  }

  return (
    JSON.stringify(entries) ===
    JSON.stringify(fabricCoreConsumerReadinessBoundaryUpdateEntries())
  );
}

function fabricCoreConsumerReadinessBoundaryUpdateInputClassification(
  inputRecord
) {
  if (fabricCoreConsumerReadinessBoundaryUpdateMalformed(inputRecord)) {
    return MALFORMED_FABRIC_CORE_CONSUMER_READINESS_BOUNDARY_UPDATE_CLASSIFICATION;
  }

  const entries =
    fabricCoreConsumerReadinessBoundaryUpdateEntriesInput(inputRecord);

  if (
    fabricCoreConsumerReadinessBoundaryUpdateEntryIssue(
      entries,
      fabricCoreConsumerReadinessBoundaryUpdateMissingRequired
    )
  ) {
    return "missing_required_fabric_core_consumer_readiness_boundary_entry_rejected";
  }

  if (
    fabricCoreConsumerReadinessBoundaryUpdateEntryIssue(
      entries,
      fabricCoreConsumerReadinessBoundaryUpdateEntryMalformed
    )
  ) {
    return MALFORMED_FABRIC_CORE_CONSUMER_READINESS_BOUNDARY_UPDATE_CLASSIFICATION;
  }

  if (
    fabricCoreConsumerReadinessBoundaryUpdateEntryIssue(
      entries,
      (entry) =>
        !FABRIC_CORE_CONSUMER_READINESS_BOUNDARY_FAMILIES.includes(
          entry.boundaryFamily
        )
    )
  ) {
    return "unknown_boundary_family_fabric_core_consumer_integration_readiness_boundary_update_input_rejected";
  }

  if (
    fabricCoreConsumerReadinessBoundaryUpdateEntryIssue(
      entries,
      (entry) =>
        !FABRIC_CORE_CONSUMER_READINESS_RELATED_SYSTEMS.includes(
          entry.relatedSystem
        )
    )
  ) {
    return "unknown_related_system_fabric_core_consumer_integration_readiness_boundary_update_input_rejected";
  }

  if (
    fabricCoreConsumerReadinessBoundaryUpdateEntryIssue(
      entries,
      (entry) =>
        !FABRIC_CORE_CONSUMER_READINESS_STATUSES.includes(entry.currentStatus)
    )
  ) {
    return "unknown_current_status_fabric_core_consumer_integration_readiness_boundary_update_input_rejected";
  }

  if (
    fabricCoreConsumerReadinessBoundaryUpdateEntryIssue(
      entries,
      fabricCoreConsumerReadinessBoundaryUpdateAuthorizationFlagEnabled
    )
  ) {
    return "authorization_flags_enabled_fabric_core_consumer_integration_readiness_boundary_update_input_rejected";
  }

  if (inputRecord.reportRunsChecks === true) {
    return "report_runs_checks_true_fabric_core_consumer_integration_readiness_boundary_update_input_rejected";
  }

  if (
    fabricCoreConsumerReadinessBoundaryUpdateHasTrueFieldDeep(
      inputRecord,
      FABRIC_CORE_CONSUMER_READINESS_AUTHORIZATION_FIELDS
    )
  ) {
    return "runtime_authorization_attempt_fabric_core_consumer_integration_readiness_boundary_update_input_rejected";
  }

  if (
    fabricCoreConsumerReadinessBoundaryUpdateHasTrueFieldDeep(
      inputRecord,
      FABRIC_CORE_CONSUMER_READINESS_COMMAND_FIELDS
    )
  ) {
    return "command_exposure_attempt_fabric_core_consumer_integration_readiness_boundary_update_input_rejected";
  }

  if (
    fabricCoreConsumerReadinessBoundaryUpdateHasTrueFieldDeep(
      inputRecord,
      FABRIC_CORE_CONSUMER_READINESS_BLOCKED_CLI_BYPASS_FIELDS
    )
  ) {
    return "blocked_cli_bypass_attempt_fabric_core_consumer_integration_readiness_boundary_update_input_rejected";
  }

  for (const {
    classification,
    fields
  } of FABRIC_CORE_CONSUMER_READINESS_HIDDEN_FIELD_GROUPS) {
    if (
      fabricCoreConsumerReadinessBoundaryUpdateHasPresentFieldDeep(
        inputRecord,
        fields
      )
    ) {
      return classification;
    }
  }

  if (fabricCoreConsumerReadinessBoundaryUpdateUnsafeFlagEnabled(inputRecord)) {
    return "unsafe_fabric_core_consumer_readiness_runtime_flags_fabric_core_consumer_integration_readiness_boundary_update_input_rejected";
  }

  if (
    isPlainObjectRecord(inputRecord.runtimeEffect) &&
    commandSurfaceShellBoundaryMapContainsTrue(inputRecord.runtimeEffect)
  ) {
    return "nested_unsafe_flags_fabric_core_consumer_integration_readiness_boundary_update_input_rejected";
  }

  if (
    Object.keys(inputRecord).some(
      (field) =>
        !FABRIC_CORE_CONSUMER_READINESS_ALLOWED_TOP_LEVEL_FIELDS.includes(field)
    )
  ) {
    return "unknown_top_level_field_fabric_core_consumer_integration_readiness_boundary_update_input_rejected";
  }

  if (!fabricCoreConsumerReadinessBoundaryUpdateCanonical(entries)) {
    return "noncanonical_fabric_core_consumer_integration_readiness_boundary_update_input_rejected";
  }

  return VALID_FABRIC_CORE_CONSUMER_READINESS_BOUNDARY_UPDATE_CLASSIFICATION;
}

function fabricCoreConsumerReadinessBoundaryUpdateAuthorizationFlags() {
  return Object.fromEntries(
    FABRIC_CORE_CONSUMER_READINESS_AUTHORIZATION_FIELDS.map((field) => [
      field,
      false
    ])
  );
}

function fabricCoreConsumerReadinessBoundaryUpdateFalseRuntimeFields() {
  return Object.fromEntries(
    FABRIC_CORE_CONSUMER_READINESS_UNSAFE_FIELDS.map((field) => [field, false])
  );
}

function fabricCoreConsumerReadinessBoundaryUpdateDefinition({
  boundaryId,
  boundaryFamily,
  relatedSystem,
  currentStatus = "producer_ready_consumer_pending",
  contract,
  allowed = [],
  forbidden = [],
  jsTs,
  sidecar,
  contentId,
  bearer,
  largePayload,
  pointHold,
  locus,
  multiverseRole,
  fabricRole
}) {
  return {
    boundaryId,
    boundaryFamily,
    relatedSystem,
    currentStatus,
    allowedCurrentBehavior: [
      "Record deterministic review-only Fabric consumer integration readiness metadata.",
      "Keep Ardyn's existing point-to-point transport behavior unchanged.",
      "Wait for a dedicated Multiverse-provided Ardyn consumer prompt before any wiring.",
      ...allowed
    ],
    forbiddenCurrentBehavior: [
      "Import @multiverse/fabric-core or add a package dependency.",
      "Create a fabric-transport-d sidecar client, loopback HTTP client, or bearer-token loader.",
      "Implement content-addressed, chunked, integrity-verified, resumable, multi-source, BitTorrent, DHT, swarm, P2P, or large-payload transfer runtime.",
      "Implement contentId hashing/re-verification runtime in Ardyn.",
      "Implement Secure Drop, Matrix/gateway, shell/command, SQLite/query, backend/API/server, database/storage/cache, filesystem scanning/file selection, or encoded-handoff runtime.",
      ...forbidden
    ],
    requiredFutureContractBeforeImplementation: contract,
    requiredFutureAuthorizationPhaseBeforeRuntime:
      "A later explicit runtime authorization phase must approve the exact consumer integration after the dedicated Multiverse prompt; Phase 5.75 grants no runtime, dependency, token, sidecar, HTTP, Fabric, filesystem, process, or command permission.",
    producerSourceOfTruthExpectation:
      "Ardynai/multiverse packages/fabric-core is the reviewed producer and source of truth; Ardyn is only a future consumer and must not reimplement producer or transport behavior.",
    jsTsConsumerExpectation:
      jsTs ??
      "Future JS/TS code may consume @multiverse/fabric-core only after a dedicated prompt, dependency review, package provenance review, and runtime authorization; this phase adds no import or dependency.",
    nonJsSidecarConsumerExpectation:
      sidecar ??
      "Future non-JS or stdlib-only surfaces may consume fabric-transport-d over loopback HTTP only after a dedicated prompt, bearer-token contract, and local contentId re-verification contract; this phase adds no client.",
    contentIdReverificationExpectation:
      contentId ??
      "Future consumers must locally re-verify contentId values from the producer path, but Phase 5.75 adds no hashing, digest, contentId parsing, verification, filesystem scan, or file-selection runtime.",
    bearerTokenLoopbackExpectation:
      bearer ??
      "Future sidecar access must use a separately authorized loopback bearer-token boundary; this phase adds no token loader, env access, vault access, secret store, HTTP client, or sidecar process.",
    largePayloadTodoExpectation:
      largePayload ??
      "Model weights, large connector packs, large skill packs, and big media remain TODO metadata for future fabric-core consumer integration only.",
    pointToPointHoldExpectation:
      pointHold ??
      "Existing point-to-point transport behavior stays held exactly as-is until a dedicated consumer prompt authorizes a narrower change.",
    locusByteInteropExpectation:
      locus ??
      "Locus byte interop remains future review-only metadata; Phase 5.75 adds no Locus runtime bridge, dashboard, byte transfer, or approval surface.",
    multiverseProducerRole:
      multiverseRole ??
      "Multiverse owns the producer implementation in packages/fabric-core and fabric-transport-d; Ardyn must ask the Multiverse planner for a dedicated consumer prompt before wiring.",
    fabricRoleDescription:
      fabricRole ??
      "Fabric-core is a future externally produced consumer dependency for Ardyn; Phase 5.75 records readiness metadata only.",
    secureDropRelationExpectation:
      "Secure Drop remains canonical outside Ardyn, with content-fabric retaining implementation ownership; Phase 5.75 adds no Secure Drop crypto, transport, stego, send/receive, inbox, file selection, filesystem scanning, connector ingestion, or secret access."
  };
}

function fabricCoreConsumerReadinessBoundaryUpdateDefinitions() {
  return [
    fabricCoreConsumerReadinessBoundaryUpdateDefinition({
      boundaryId:
        "phase5-75.fabric_core_reference.consumer_readiness.contract",
      boundaryFamily: "fabric_core_consumer_readiness_contract",
      relatedSystem: "fabric-core-reference",
      contract:
        "Define the future Ardyn consumer contract against Ardynai/multiverse packages/fabric-core after the dedicated consumer prompt lands.",
      allowed: [
        "Record that the producer is ready and Ardyn consumer integration remains pending."
      ]
    }),
    fabricCoreConsumerReadinessBoundaryUpdateDefinition({
      boundaryId: "phase5-75.ardyn.js_ts_npm_consumer.contract",
      boundaryFamily: "fabric_core_js_ts_consumer_contract",
      relatedSystem: "ardyn",
      contract:
        "Define npm dependency provenance, import surface, version pinning, integrity expectations, and runtime authorization before any @multiverse/fabric-core consumption.",
      jsTs:
        "Future JS/TS consumer surfaces must use @multiverse/fabric-core as the only package source after dedicated prompt, dependency review, and runtime authorization; Phase 5.75 adds no package.json, import, or dependency change."
    }),
    fabricCoreConsumerReadinessBoundaryUpdateDefinition({
      boundaryId:
        "phase5-75.fabric_transport_d_reference.sidecar_consumer.contract",
      boundaryFamily: "fabric_transport_sidecar_consumer_contract",
      relatedSystem: "fabric-transport-d-reference",
      contract:
        "Define loopback sidecar request/response, bearer-token custody, contentId re-verification, failure handling, and local-only constraints before any fabric-transport-d client exists.",
      sidecar:
        "Future non-JS or stdlib-only surfaces may call fabric-transport-d only over local loopback HTTP with a bearer token and local contentId re-verification; Phase 5.75 adds no sidecar client."
    }),
    fabricCoreConsumerReadinessBoundaryUpdateDefinition({
      boundaryId: "phase5-75.repo_family.content_id_reverification.contract",
      boundaryFamily: "fabric_content_id_reverification_contract",
      relatedSystem: "repo-family",
      currentStatus: "metadata_only",
      contract:
        "Define contentId shape, digest algorithm ownership, local re-verification proof, and fail-closed mismatch behavior before runtime.",
      contentId:
        "Future Ardyn consumers must re-verify contentId values locally against producer output, but this phase adds no hashing, digest verification, filesystem scan, or file-selection runtime."
    }),
    fabricCoreConsumerReadinessBoundaryUpdateDefinition({
      boundaryId:
        "phase5-75.fabric_transport_d_reference.sidecar_bearer_token.boundary",
      boundaryFamily: "fabric_sidecar_bearer_token_boundary",
      relatedSystem: "fabric-transport-d-reference",
      currentStatus: "metadata_only",
      contract:
        "Define sidecar bearer-token issuance, storage prohibition, rotation, redaction, least privilege, and local-only scope before any sidecar access.",
      bearer:
        "Future sidecar bearer-token access requires an explicit secret boundary and no env/vault/token loader in this phase."
    }),
    fabricCoreConsumerReadinessBoundaryUpdateDefinition({
      boundaryId:
        "phase5-75.fabric_transport_d_reference.loopback_http.boundary",
      boundaryFamily: "fabric_loopback_http_boundary",
      relatedSystem: "fabric-transport-d-reference",
      currentStatus: "metadata_only",
      contract:
        "Define localhost-only HTTP transport, authentication, request caps, contentId re-verification, logging redaction, and failure behavior before any sidecar client.",
      sidecar:
        "Future sidecar calls must stay loopback-only, bearer-token gated, and contentId re-verified; this phase adds no HTTP client, listener, fetch, websocket, or process."
    }),
    fabricCoreConsumerReadinessBoundaryUpdateDefinition({
      boundaryId: "phase5-75.multiverse.large_payload.todo.contract",
      boundaryFamily: "fabric_large_payload_todo_contract",
      relatedSystem: "multiverse",
      currentStatus: "metadata_only",
      contract:
        "Define a future fabric-core consumer integration for model weights, large connector packs, large skill packs, and big media after paired security review.",
      largePayload:
        "Large payload movement remains a TODO to consume fabric-core later; Phase 5.75 moves no files, weights, packs, media, chunks, manifests, or payloads."
    }),
    fabricCoreConsumerReadinessBoundaryUpdateDefinition({
      boundaryId: "phase5-75.ardyn.point_to_point_transport.hold.contract",
      boundaryFamily: "fabric_existing_point_to_point_hold_contract",
      relatedSystem: "ardyn",
      currentStatus: "blocked",
      contract:
        "Define an explicit migration or coexistence contract before changing any existing point-to-point transport behavior.",
      pointHold:
        "Existing point-to-point behavior remains held exactly as-is; Phase 5.75 changes no transport, envelope, bridge, connector, or file movement behavior."
    }),
    fabricCoreConsumerReadinessBoundaryUpdateDefinition({
      boundaryId:
        "phase5-75.multiverse.dedicated_consumer_prompt_required.contract",
      boundaryFamily: "fabric_dedicated_consumer_prompt_required_contract",
      relatedSystem: "multiverse",
      currentStatus: "future_contract_required",
      contract:
        "Require a dedicated Multiverse-provided Ardyn consumer prompt before any import, sidecar, dependency, token, loopback, contentId, or transport wiring.",
      multiverseRole:
        "Multiverse must provide the dedicated consumer prompt and producer contract; Ardyn records this dependency and holds implementation."
    }),
    fabricCoreConsumerReadinessBoundaryUpdateDefinition({
      boundaryId: "phase5-75.ardyn.no_reimplementation.contract",
      boundaryFamily: "fabric_no_reimplementation_contract",
      relatedSystem: "ardyn",
      currentStatus: "blocked",
      contract:
        "Define hard no-reimplementation checks that keep producer algorithms, transfer protocols, chunk manifests, resumability, multi-source scheduling, and integrity implementation out of Ardyn.",
      forbidden: [
        "Add local content-addressed transfer protocols, chunk manifests, resumable stores, multi-source schedulers, or producer code."
      ]
    }),
    fabricCoreConsumerReadinessBoundaryUpdateDefinition({
      boundaryId: "phase5-75.repo_family.no_p2p_dependency.contract",
      boundaryFamily: "fabric_no_p2p_dependency_contract",
      relatedSystem: "repo-family",
      currentStatus: "blocked",
      contract:
        "Define dependency policy that forbids public DHT, swarm, BitTorrent-style, P2P, or large-payload transfer dependencies in Ardyn.",
      forbidden: [
        "Add P2P, DHT, swarm, BitTorrent, large-payload transfer, or content-addressed transport dependencies."
      ]
    }),
    fabricCoreConsumerReadinessBoundaryUpdateDefinition({
      boundaryId:
        "phase5-75.content_fabric.security_review_dependency.secure_drop_relation.contract",
      boundaryFamily: "fabric_security_review_dependency_contract",
      relatedSystem: "content-fabric",
      currentStatus: "metadata_only",
      contract:
        "Record the security-reviewed producer dependency and Secure Drop relation while keeping Secure Drop canonical outside Ardyn.",
      fabricRole:
        "Fabric-core producer readiness is a dependency for a later Ardyn consumer prompt; Secure Drop remains canonical in content-fabric and is not implemented here."
    }),
    fabricCoreConsumerReadinessBoundaryUpdateDefinition({
      boundaryId: "phase5-75.locus.byte_interop.consumer_readiness.contract",
      boundaryFamily: "fabric_core_consumer_readiness_contract",
      relatedSystem: "locus",
      contract:
        "Define future Locus byte-interop visibility and consent boundaries before Ardyn exposes any fabric-core consumer status or byte movement.",
      locus:
        "Locus byte interop is future display/coordination metadata only; Phase 5.75 adds no Locus bridge, byte transfer, UI, or runtime visibility surface."
    })
  ];
}

function fabricCoreConsumerReadinessBoundaryUpdateEntry(definition) {
  return {
    ...definition,
    phase559FabricAwareApiBackendReference: {
      fixture:
        "tests/fixtures/host-policy/phase5-59/fabric-aware-api-backend-contract-boundary-map.json",
      fabricApiBackendBoundaryReferenced: true,
      implementsFabricRuntime: false
    },
    phase573ExternalGatewayMatrixTransportReference: {
      fixture:
        "tests/fixtures/host-policy/phase5-73/external-gateway-matrix-transport-contract-boundary-map.json",
      fabricCoreFutureConsumerBoundaryWasPreviouslyTodo: true,
      gatewayRuntimeAuthorized: false
    },
    phase574CommandSurfaceShellReference: {
      fixture:
        "tests/fixtures/host-policy/phase5-74/command-surface-shell-primitive-contract-boundary-map.json",
      commandRuntimeAuthorized: false,
      shellRuntimeAuthorized: false
    },
    fabricCoreProducerReference: {
      producerRepository: "Ardynai/multiverse",
      producerPackage: "packages/fabric-core",
      sidecarName: "fabric-transport-d",
      producerSecurityReviewed: true,
      producerImplementedByArdyn: false,
      ardynConsumerIntegrationPendingDedicatedPrompt: true
    },
    fabricCoreConsumerReadinessBoundaryMetadataOnly: true,
    noLiveFabricCoreConsumerIntegrationRuntimePerformed: true,
    explicitBlockedAuthorizationFlags:
      fabricCoreConsumerReadinessBoundaryUpdateAuthorizationFlags(),
    unsafeFabricCoreConsumerReadinessRuntimeFlags:
      fabricCoreConsumerReadinessBoundaryUpdateFalseRuntimeFields(),
    nonAuthorizingProof: true,
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

function fabricCoreConsumerReadinessBoundaryUpdateEntries() {
  return fabricCoreConsumerReadinessBoundaryUpdateDefinitions().map(
    fabricCoreConsumerReadinessBoundaryUpdateEntry
  );
}

function fabricCoreConsumerReadinessBoundaryUpdateSummary(entries) {
  const countByFamily = Object.fromEntries(
    FABRIC_CORE_CONSUMER_READINESS_BOUNDARY_FAMILIES.map((family) => [
      family,
      entries.filter((entry) => entry.boundaryFamily === family).length
    ])
  );
  const countByRelatedSystem = Object.fromEntries(
    FABRIC_CORE_CONSUMER_READINESS_RELATED_SYSTEMS.map((system) => [
      system,
      entries.filter((entry) => entry.relatedSystem === system).length
    ])
  );
  const countByStatus = Object.fromEntries(
    FABRIC_CORE_CONSUMER_READINESS_STATUSES.map((status) => [
      status,
      entries.filter((entry) => entry.currentStatus === status).length
    ])
  );
  const allBlockedAuthorizationFlagsFalse = entries.every((entry) =>
    Object.values(entry.explicitBlockedAuthorizationFlags).every(
      (value) => value === false
    )
  );
  const allUnsafeFabricCoreConsumerReadinessRuntimeFlagsFalse = entries.every(
    (entry) =>
      Object.values(
        entry.unsafeFabricCoreConsumerReadinessRuntimeFlags
      ).every((value) => value === false)
  );
  const allRuntimeEffectsFalse = entries.every((entry) =>
    Object.values(entry.runtimeEffect).every((value) => value === false)
  );

  return {
    boundaryUpdateKind:
      FABRIC_CORE_CONSUMER_INTEGRATION_READINESS_BOUNDARY_UPDATE_KIND,
    boundaryEntryCount: entries.length,
    countByFamily,
    countByRelatedSystem,
    countByStatus,
    boundaryFamilies: [...FABRIC_CORE_CONSUMER_READINESS_BOUNDARY_FAMILIES],
    relatedSystems: [...FABRIC_CORE_CONSUMER_READINESS_RELATED_SYSTEMS],
    currentStatusValues: [...FABRIC_CORE_CONSUMER_READINESS_STATUSES],
    fabricCoreConsumerReadinessBoundaryMetadataOnly: true,
    noLiveFabricCoreConsumerIntegrationRuntimePerformed: true,
    producerReadyConsumerPendingRecorded: true,
    fabricCoreJsTsNpmConsumerBoundaryRecorded: true,
    fabricTransportDSidecarConsumerBoundaryRecorded: true,
    sidecarBearerTokenBoundaryRecorded: true,
    loopbackHttpBoundaryRecorded: true,
    contentIdReverificationBoundaryRecorded: true,
    largePayloadTodoBoundaryRecorded: true,
    existingPointToPointTransportHoldRecorded: true,
    dedicatedConsumerPromptRequiredRecorded: true,
    noReimplementationBoundaryRecorded: true,
    noP2pDependencyBoundaryRecorded: true,
    locusByteInteropBoundaryRecorded: true,
    securityReviewedProducerDependencyRecorded: true,
    secureDropRelationBoundaryRecorded: true,
    noFabricCoreImport: true,
    noFabricTransportDSidecarClient: true,
    noLoopbackHttpClient: true,
    noBearerTokenLoader: true,
    noContentIdHashingVerificationRuntime: true,
    noContentAddressedChunkedResumableMultiSourceTransfer: true,
    noBitTorrentDhtSwarmP2pBehavior: true,
    noLargePayloadTransferRuntime: true,
    noPackageJsonDependencyChange: true,
    noRustSidecarClient: true,
    noFabricCoreProducerBehavior: true,
    noSecureDropImplementation: true,
    noMatrixGatewayRuntime: true,
    noShellCommandRuntime: true,
    noSqliteRuntime: true,
    noBackendApiServerDatabaseStorageCacheRlsMigration: true,
    noEncodedHandoffRuntimeCodecTranslator: true,
    noLoggerAuditTelemetryHealthRuntime: true,
    noInfrastructureDeploymentComplianceAutomation: true,
    noTestingCiReleaseAutomation: true,
    noFilesystemProcessUiRuntime: true,
    noCommandExposure: true,
    noBlockedCliBypass: true,
    allBlockedAuthorizationFlagsFalse,
    allUnsafeFabricCoreConsumerReadinessRuntimeFlagsFalse,
    allRuntimeEffectsFalse,
    allEntriesNonAuthorizing: entries.every(
      (entry) => entry.nonAuthorizingProof === true
    )
  };
}

function fabricCoreConsumerReadinessBoundaryUpdateValidationRules() {
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
    enabledRuntimeCommandConnectorFabricWebsocketHttpMcpTaskSecureDropServiceDiscoveryScheduleFilesystemProcessFlagsFailClosed:
      true,
    enabledMultiverseFabricCoreImportFailClosed: true,
    enabledFabricCoreNpmDependencyFailClosed: true,
    enabledFabricTransportDSidecarClientFailClosed: true,
    enabledLoopbackHttpClientFailClosed: true,
    enabledBearerTokenLoaderFailClosed: true,
    enabledContentIdVerificationRuntimeFailClosed: true,
    enabledContentAddressedChunkedResumableMultiSourceTransferFailClosed: true,
    enabledBitTorrentDhtSwarmP2pBehaviorFailClosed: true,
    enabledLargePayloadTransferRuntimeFailClosed: true,
    enabledPackageJsonDependencyChangeFailClosed: true,
    enabledRustSidecarClientFailClosed: true,
    enabledFabricCoreProducerBehaviorFailClosed: true,
    enabledSecureDropImplementationFailClosed: true,
    hiddenFabricCoreImportSemanticsFailClosed: true,
    hiddenSidecarHttpBearerTokenSemanticsFailClosed: true,
    hiddenHashingContentIdVerificationSemanticsFailClosed: true,
    hiddenContentAddressedChunkedResumableP2pTransportSemanticsFailClosed: true,
    hiddenLargePayloadMovementSemanticsFailClosed: true,
    hiddenFilesystemScanningFileSelectionSemanticsFailClosed: true,
    hiddenBackendApiServerSemanticsFailClosed: true,
    hiddenDatabaseStorageCacheWriteSemanticsFailClosed: true,
    hiddenAuthSessionTokenApiKeySemanticsFailClosed: true,
    hiddenConnectorGrantSemanticsFailClosed: true,
    hiddenMatrixGatewayRuntimeSemanticsFailClosed: true,
    hiddenShellCommandRuntimeSemanticsFailClosed: true,
    hiddenSqliteEmbeddedDbQueryRuntimeSemanticsFailClosed: true,
    hiddenEncodedHandoffRuntimeCodecTranslatorSemanticsFailClosed: true,
    nestedUnsafeFlagsFailClosed: true,
    noncanonicalBoundaryEntriesFailClosed: true,
    validationImportsFabricCore: false,
    validationStartsSidecar: false,
    validationUsesLoopbackHttp: false,
    validationLoadsBearerToken: false,
    validationHashesContentIds: false,
    validationTransfersLargePayloads: false,
    validationChangesPackageJson: false,
    validationRequestsJules: false
  };
}

function fabricCoreConsumerReadinessBoundaryUpdateGaps() {
  return [
    "Future Ardyn fabric-core consumer integration still needs a dedicated Multiverse-provided prompt, dependency provenance, API contract, auth boundary, and paired security review before any @multiverse/fabric-core import.",
    "Future fabric-transport-d sidecar use still needs loopback-only HTTP, bearer-token custody, contentId re-verification, redaction, local-only, and failure-mode contracts before any client or token loader.",
    "Future large-payload movement for model weights, large connector packs, large skill packs, and big media remains a fabric-core consumer TODO; Ardyn must not implement producer, chunking, resumability, multi-source, DHT, swarm, P2P, or file-transfer runtime.",
    "Existing point-to-point behavior remains held while Locus byte-interop, Secure Drop relation, Matrix/gateway, shell command surface, SQLite/query engine, Fabric/API/backend, and storage boundaries remain runtime-blocked.",
    "Future embedded DB/query-engine primitive work remains a separate review-only boundary map before any SQLite or DB runtime authorization."
  ];
}

function fabricCoreConsumerReadinessBoundaryUpdateState(reviewedAt) {
  const boundaryEntries = fabricCoreConsumerReadinessBoundaryUpdateEntries();

  return {
    schema: FABRIC_CORE_CONSUMER_READINESS_BOUNDARY_UPDATE_STATE_SCHEMA,
    schemaVersion:
      FABRIC_CORE_CONSUMER_INTEGRATION_READINESS_BOUNDARY_UPDATE_VERSION,
    stateKind:
      FABRIC_CORE_CONSUMER_INTEGRATION_READINESS_BOUNDARY_UPDATE_KIND,
    stateMode: "review-only",
    reviewedAt,
    sourcePhaseContext: {
      phase559FabricAwareApiBackendBoundary:
        "tests/fixtures/host-policy/phase5-59/fabric-aware-api-backend-contract-boundary-map.json",
      phase573ExternalGatewayMatrixTransportBoundary:
        "tests/fixtures/host-policy/phase5-73/external-gateway-matrix-transport-contract-boundary-map.json",
      phase574CommandSurfaceShellPrimitiveBoundary:
        "tests/fixtures/host-policy/phase5-74/command-surface-shell-primitive-contract-boundary-map.json",
      fabricCoreProducerRepository: "Ardynai/multiverse",
      fabricCoreProducerPackage: "packages/fabric-core",
      fabricCoreProducerSecurityReviewed: true,
      fabricTransportDSidecar: "fabric-transport-d",
      jsTsFuturePackage: "@multiverse/fabric-core",
      ardynRole: "future-consumer-only",
      ardynConsumerIntegrationPendingDedicatedPrompt: true,
      existingPointToPointTransportHeld: true,
      byteInteropWithLocusFutureOnly: true,
      secureDropCanonicalOwner: "content-fabric",
      noRuntimeWiring: true,
      noPackageDependencyAdded: true,
      noFabricCoreImportImplemented: true,
      noSidecarClientImplemented: true,
      noLoopbackHttpClientImplemented: true,
      noBearerTokenLoaderImplemented: true,
      noContentIdVerificationImplemented: true,
      noLargePayloadTransferImplemented: true,
      runtimeStillBlocked: true
    },
    boundaryEntries,
    boundaryMapSummary:
      fabricCoreConsumerReadinessBoundaryUpdateSummary(boundaryEntries),
    invalidBoundaryCasePolicy:
      fabricCoreConsumerReadinessBoundaryUpdateValidationRules(),
    topFabricCoreConsumerSqliteCodeModeFabricApiBackendGaps:
      fabricCoreConsumerReadinessBoundaryUpdateGaps(),
    recommendedNextPhase:
      "phase-5.76-review-only-embedded-db-query-engine-primitive-contract-boundary-map",
    fabricCoreConsumerIntegrationReadinessBoundaryUpdateOnly: true,
    reviewOnly: true,
    metadataOnly: true,
    authoritative: false,
    nonAuthorizingProof: true,
    reportRunsChecks: false,
    ...fabricCoreConsumerReadinessBoundaryUpdateFalseRuntimeFields(),
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

function fabricCoreConsumerReadinessBoundaryUpdateResult({
  reviewedAt,
  reviewedAtDefaulted,
  classification,
  accepted,
  fabricCoreConsumerIntegrationReadinessBoundaryUpdate
}) {
  return {
    schema: FABRIC_CORE_CONSUMER_INTEGRATION_READINESS_BOUNDARY_UPDATE_SCHEMA,
    schemaVersion:
      FABRIC_CORE_CONSUMER_INTEGRATION_READINESS_BOUNDARY_UPDATE_VERSION,
    fabricCoreConsumerIntegrationReadinessBoundaryUpdateKind:
      FABRIC_CORE_CONSUMER_INTEGRATION_READINESS_BOUNDARY_UPDATE_KIND,
    fabricCoreConsumerIntegrationReadinessBoundaryUpdateMode: "review-only",
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    fabricCoreConsumerIntegrationReadinessBoundaryUpdateProduced: accepted,
    fabricCoreConsumerIntegrationReadinessBoundaryUpdate,
    boundaryMapSummary: accepted
      ? fabricCoreConsumerIntegrationReadinessBoundaryUpdate.boundaryMapSummary
      : null,
    boundaryEntries: accepted
      ? fabricCoreConsumerIntegrationReadinessBoundaryUpdate.boundaryEntries
      : [],
    invalidBoundaryCasePolicy: accepted
      ? fabricCoreConsumerIntegrationReadinessBoundaryUpdate
          .invalidBoundaryCasePolicy
      : fabricCoreConsumerReadinessBoundaryUpdateValidationRules(),
    topFabricCoreConsumerSqliteCodeModeFabricApiBackendGaps: accepted
      ? fabricCoreConsumerIntegrationReadinessBoundaryUpdate
          .topFabricCoreConsumerSqliteCodeModeFabricApiBackendGaps
      : [],
    recommendedNextPhase: accepted
      ? fabricCoreConsumerIntegrationReadinessBoundaryUpdate.recommendedNextPhase
      : null,
    fabricCoreConsumerIntegrationReadinessBoundaryUpdateOnly: true,
    reviewOnly: true,
    metadataOnly: true,
    authoritative: false,
    nonAuthorizingProof: true,
    reportRunsChecks: false,
    ...fabricCoreConsumerReadinessBoundaryUpdateFalseRuntimeFields(),
    rejectionReasons: accepted
      ? []
      : [
          {
            classification,
            rejected: true,
            runtimeAuthorized: false,
            fabricCoreConsumerAuthorized: false,
            fabricCoreImportAuthorized: false,
            sidecarClientAuthorized: false,
            loopbackHttpAuthorized: false,
            bearerTokenAuthorized: false,
            contentIdVerificationAuthorized: false,
            largePayloadTransferAuthorized: false,
            commandExposureAuthorized: false,
            reportRunsChecks: false
          }
        ],
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

export function createFabricCoreConsumerIntegrationReadinessBoundaryUpdateForReview(
  input = {}
) {
  const inputRecord =
    fabricCoreConsumerReadinessBoundaryUpdateInputRecord(input);
  const reviewedAt =
    fabricCoreConsumerReadinessBoundaryUpdateReviewedAt(inputRecord);
  const reviewedAtDefaulted = isReviewedAtDefaulted(inputRecord);
  const classification =
    fabricCoreConsumerReadinessBoundaryUpdateInputClassification(inputRecord);
  const accepted =
    classification ===
    VALID_FABRIC_CORE_CONSUMER_READINESS_BOUNDARY_UPDATE_CLASSIFICATION;
  const fabricCoreConsumerIntegrationReadinessBoundaryUpdate = accepted
    ? fabricCoreConsumerReadinessBoundaryUpdateState(reviewedAt)
    : null;

  return fabricCoreConsumerReadinessBoundaryUpdateResult({
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    accepted,
    fabricCoreConsumerIntegrationReadinessBoundaryUpdate
  });
}

const EMBEDDED_DB_QUERY_ENGINE_BOUNDARY_MAP_STATE_SCHEMA =
  "ardyn.phase-5.76.embedded-db-query-engine-primitive-contract-boundary-map-state";
const VALID_EMBEDDED_DB_QUERY_ENGINE_BOUNDARY_MAP_CLASSIFICATION =
  "valid_embedded_db_query_engine_primitive_contract_boundary_map_runtime_still_blocked";
const MALFORMED_EMBEDDED_DB_QUERY_ENGINE_BOUNDARY_MAP_CLASSIFICATION =
  "malformed_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected";

const EMBEDDED_DB_QUERY_ENGINE_BOUNDARY_FAMILIES = Object.freeze([
  "embedded_db_contract",
  "sqlite_reference_boundary",
  "database_file_format_contract",
  "page_header_contract",
  "schema_metadata_contract",
  "table_metadata_contract",
  "sql_parser_contract",
  "read_only_query_contract",
  "select_query_contract",
  "where_filter_contract",
  "full_table_scan_contract",
  "index_lookup_contract",
  "btree_traversal_contract",
  "query_performance_contract",
  "transaction_boundary_contract",
  "wal_boundary_contract",
  "migration_boundary_contract",
  "storage_adapter_boundary",
  "rls_data_isolation_boundary",
  "query_audit_boundary"
]);
const EMBEDDED_DB_QUERY_ENGINE_RELATED_SYSTEMS = Object.freeze([
  "ardyn",
  "ardyn-subagent",
  "locus",
  "multiverse",
  "content-fabric",
  "repo-family",
  "external-harness",
  "codecrafters-sqlite-reference",
  "fabric-core-reference"
]);
const EMBEDDED_DB_QUERY_ENGINE_STATUSES = Object.freeze([
  "metadata_only",
  "blocked",
  "future_contract_required"
]);
const EMBEDDED_DB_QUERY_ENGINE_REQUIRED_FIELDS = Object.freeze([
  "boundaryId",
  "boundaryFamily",
  "relatedSystem",
  "currentStatus",
  "allowedCurrentBehavior",
  "forbiddenCurrentBehavior",
  "requiredFutureContractBeforeImplementation",
  "requiredFutureAuthorizationPhaseBeforeRuntime",
  "databaseFileFormatExpectation",
  "queryParsingExpectation",
  "readOnlyQueryExpectation",
  "dataIsolationExpectation",
  "storageWriteExpectation",
  "auditLoggingExpectation",
  "migrationTransactionExpectation",
  "performanceIndexingExpectation",
  "locusRoleDescription",
  "fabricRoleDescription",
  "secureDropRoleDescription",
  "explicitBlockedAuthorizationFlags",
  "unsafeEmbeddedDbQueryEnginePrimitiveRuntimeFlags",
  "nonAuthorizingProof"
]);
const EMBEDDED_DB_QUERY_ENGINE_ALLOWED_TOP_LEVEL_FIELDS = Object.freeze([
  "reviewedAt",
  "boundaryEntries"
]);
const EMBEDDED_DB_QUERY_ENGINE_UNSAFE_FIELDS = Object.freeze([
  "runtimeExecutionEnabled",
  "runtimeAuthorizationEnabled",
  "runtimeCommandEnabled",
  "commandExposureEnabled",
  "commandsExposed",
  "connectorGrantProduced",
  "fabricRuntimeImplementedByArdyn",
  "fabricRuntimeEnabled",
  "websocketHttpTransportImplementedByArdyn",
  "websocketRuntimeEnabled",
  "httpTransportImplementedByArdyn",
  "httpRuntimeEnabled",
  "mcpRuntimeEnabled",
  "mcpToolExposureEnabled",
  "taskExecutionEnabled",
  "secureDropImplemented",
  "serviceDiscoveryEnabled",
  "scheduleEnforcementEnabled",
  "schedulePollingEnabled",
  "filesystemAccessEnabled",
  "filesystemReadEnabled",
  "filesystemWriteEnabled",
  "filesystemScanningEnabled",
  "processControlEnabled",
  "sqliteRuntimeEnabled",
  "embeddedDbReaderEnabled",
  "embeddedDbRuntimeEnabled",
  "queryEngineRuntimeEnabled",
  "databaseClientImplemented",
  "databaseFileParserEnabled",
  "pageParserEnabled",
  "sqlParserRuntimeEnabled",
  "queryExecutorEnabled",
  "tableScanEnabled",
  "fullTableScanEnabled",
  "indexLookupEnabled",
  "indexScanEnabled",
  "btreeTraversalEnabled",
  "transactionWalRuntimeEnabled",
  "transactionRuntimeEnabled",
  "walRuntimeEnabled",
  "migrationSchemaChangeEnabled",
  "databaseMigrationImplemented",
  "storageAdapterImplemented",
  "dbReadEnabled",
  "dbWriteEnabled",
  "dbReadWriteEnabled",
  "databaseStorageRuntimeWritesEnabled",
  "cacheRuntimeEnabled",
  "cacheEngineImplemented",
  "rlsRuntimeImplemented",
  "queryAuditWriterImplemented",
  "queryAuditRuntimeEnabled",
  "shellRuntimeEnabled",
  "commandRuntimeEnabled",
  "matrixClientRuntimeEnabled",
  "externalGatewayRuntimeEnabled",
  "multiverseFabricCoreImportEnabled",
  "fabricCoreNpmDependencyEnabled",
  "fabricTransportDSidecarClientEnabled",
  "fabricCoreTransportRuntimeEnabled",
  "contentAddressedTransportEnabled",
  "chunkedTransferEnabled",
  "resumableTransferEnabled",
  "multiSourceTransferEnabled",
  "bittorrentDhtSwarmP2pEnabled",
  "largePayloadTransferRuntimeEnabled",
  "backendRuntimeImplementedByArdyn",
  "backendApiServerMiddlewareImplemented",
  "apiEndpointImplementedByArdyn",
  "serverImplementedByArdyn",
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
  "failoverRuntimeImplemented",
  "infrastructureAutomationImplemented",
  "deploymentAutomationImplemented",
  "complianceEnforcementImplemented",
  "piiProcessingImplemented",
  "retentionJobImplemented",
  "exportJobImplemented",
  "testingCiReleaseAutomationEnabled",
  "encodedHandoffRuntimeImplementedByArdyn",
  "codecRuntimeEnabled",
  "translatorRuntimeEnabled",
  "filesystemProcessRuntimeEnabled",
  "uiRuntimeImplemented",
  "blockedCliBypassEnabled"
]);
const EMBEDDED_DB_QUERY_ENGINE_AUTHORIZATION_FIELDS = Object.freeze([
  "runtimeAuthorized",
  "runtimeAuthorizationGranted",
  "authorizesRuntime",
  "sqliteRuntimeAuthorizationGranted",
  "embeddedDbReaderAuthorizationGranted",
  "databaseClientAuthorizationGranted",
  "databaseFileParserAuthorizationGranted",
  "pageParserAuthorizationGranted",
  "sqlParserAuthorizationGranted",
  "queryExecutorAuthorizationGranted",
  "tableScanAuthorizationGranted",
  "indexLookupAuthorizationGranted",
  "btreeTraversalAuthorizationGranted",
  "transactionWalAuthorizationGranted",
  "migrationAuthorizationGranted",
  "storageAdapterAuthorizationGranted",
  "dbReadWriteAuthorizationGranted",
  "filesystemAccessAuthorizationGranted",
  "rlsRuntimeAuthorizationGranted",
  "queryAuditWriterAuthorizationGranted",
  "commandExposureAuthorizationGranted",
  "approvalDecisionProduced",
  "approvalGrantProduced"
]);
const EMBEDDED_DB_QUERY_ENGINE_COMMAND_FIELDS = Object.freeze([
  "commandExposureEnabled",
  "commandRuntimeControlEnabled",
  "commandsExposed",
  "exposesCommands",
  "runtimeCommandEnabled",
  "sqliteCommandExposed",
  "dbInfoCommandExposed",
  "tablesCommandExposed",
  "selectCommandExposed",
  "queryCommandExposed",
  "serveRuntimeCommandEnabled"
]);
const EMBEDDED_DB_QUERY_ENGINE_BLOCKED_CLI_BYPASS_FIELDS = Object.freeze([
  "blockedCliBypassEnabled",
  "dryRunBypassesBlock",
  "serveRuntimeBypassEnabled",
  "bypassBlockedCommandBehavior",
  "blockedCommandOverride"
]);
const EMBEDDED_DB_QUERY_ENGINE_HIDDEN_FIELD_GROUPS = Object.freeze([
  {
    classification:
      "hidden_sqlite_embedded_db_query_runtime_semantics_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected",
    fields: [
      "sqliteRuntime",
      "embeddedDbRuntime",
      "embeddedDbReader",
      "queryEngineRuntime",
      "databaseRuntime",
      "dbRuntime"
    ]
  },
  {
    classification:
      "hidden_database_file_page_parsing_semantics_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected",
    fields: [
      "databaseFileParser",
      "sqliteFileReader",
      "pageParser",
      "pageHeaderParser",
      "dbInfoRuntime",
      "schemaMetadataParser",
      "tableMetadataParser"
    ]
  },
  {
    classification:
      "hidden_sql_query_execution_semantics_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected",
    fields: [
      "sqlParser",
      "sqlTokenizer",
      "selectExecutor",
      "queryExecutor",
      "whereEvaluator",
      "countQueryExecutor",
      "readOnlyQueryRuntime"
    ]
  },
  {
    classification:
      "hidden_btree_index_traversal_semantics_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected",
    fields: [
      "btreeTraversal",
      "btreePageReader",
      "indexLookup",
      "indexScan",
      "fullTableScan",
      "tableScanner"
    ]
  },
  {
    classification:
      "hidden_transaction_wal_migration_semantics_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected",
    fields: [
      "transactionRuntime",
      "walRuntime",
      "walReader",
      "migrationRunner",
      "schemaChangeRuntime",
      "transactionLog"
    ]
  },
  {
    classification:
      "hidden_storage_cache_read_write_semantics_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected",
    fields: [
      "storageAdapter",
      "databaseWrite",
      "databaseRead",
      "dbReadWrite",
      "cacheEngine",
      "persistenceLayer",
      "storageWrite"
    ]
  },
  {
    classification:
      "hidden_filesystem_access_semantics_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected",
    fields: [
      "filesystemRead",
      "filesystemWrite",
      "fileOpen",
      "dbFilePath",
      "fileSystemAccess",
      "fileScanner"
    ]
  },
  {
    classification:
      "hidden_auth_session_token_api_key_semantics_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected",
    fields: [
      "authSession",
      "sessionToken",
      "apiKey",
      "tokenLoader",
      "credentialLoader"
    ]
  },
  {
    classification:
      "hidden_connector_grant_semantics_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected",
    fields: [
      "connectorGrant",
      "providerGrant",
      "mcpConnector",
      "pluginCredential",
      "toolGrant"
    ]
  },
  {
    classification:
      "hidden_fabric_fabric_core_transport_runtime_semantics_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected",
    fields: [
      "fabricRuntime",
      "fabricCoreTransportRuntime",
      "fabricCoreImport",
      "fabricTransportDSidecar",
      "loopbackHttpClient",
      "largePayloadTransfer"
    ]
  },
  {
    classification:
      "hidden_content_addressed_chunked_resumable_p2p_transport_semantics_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected",
    fields: [
      "contentAddressedTransport",
      "chunkedTransfer",
      "resumableTransfer",
      "multiSourceTransfer",
      "bittorrentRuntime",
      "dhtRuntime",
      "swarmRuntime",
      "p2pTransfer"
    ]
  },
  {
    classification:
      "hidden_matrix_gateway_runtime_semantics_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected",
    fields: [
      "matrixClientRuntime",
      "homeserverConnection",
      "messagePollingRuntime",
      "messageSendingRuntime",
      "externalGatewayRuntime"
    ]
  },
  {
    classification:
      "hidden_shell_command_runtime_semantics_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected",
    fields: [
      "shellRuntime",
      "commandRuntime",
      "processSpawn",
      "pathLookup",
      "terminalBackend"
    ]
  },
  {
    classification:
      "hidden_secure_drop_implementation_semantics_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected",
    fields: [
      "secureDropRuntime",
      "secureDropInbox",
      "secureDropTransport",
      "secureDropCrypto",
      "secureDropFileSelection"
    ]
  },
  {
    classification:
      "hidden_backend_api_server_semantics_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected",
    fields: [
      "backendRuntime",
      "apiServer",
      "apiEndpoint",
      "serverMiddleware",
      "httpHandler"
    ]
  },
  {
    classification:
      "hidden_logger_audit_transcript_telemetry_external_sink_semantics_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected",
    fields: [
      "loggerRuntime",
      "auditWriter",
      "queryAuditWriter",
      "transcriptWriter",
      "telemetryClient",
      "externalSink"
    ]
  }
]);

function embeddedDbQueryEngineBoundaryMapInputRecord(input) {
  return isPlainObjectRecord(input) ? input : null;
}

function embeddedDbQueryEngineBoundaryMapReviewedAt(inputRecord) {
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

function embeddedDbQueryEngineBoundaryMapContainsTrue(value) {
  if (value === true) {
    return true;
  }

  if (Array.isArray(value)) {
    return value.some(embeddedDbQueryEngineBoundaryMapContainsTrue);
  }

  if (isPlainObjectRecord(value)) {
    return Object.values(value).some(
      embeddedDbQueryEngineBoundaryMapContainsTrue
    );
  }

  return false;
}

function embeddedDbQueryEngineBoundaryMapHasTrueFieldDeep(value, fields) {
  if (Array.isArray(value)) {
    return value.some((item) =>
      embeddedDbQueryEngineBoundaryMapHasTrueFieldDeep(item, fields)
    );
  }

  if (!isPlainObjectRecord(value)) {
    return false;
  }

  for (const [key, nested] of Object.entries(value)) {
    if (fields.includes(key) && nested === true) {
      return true;
    }

    if (embeddedDbQueryEngineBoundaryMapHasTrueFieldDeep(nested, fields)) {
      return true;
    }
  }

  return false;
}

function embeddedDbQueryEngineBoundaryMapHasPresentFieldDeep(value, fields) {
  if (Array.isArray(value)) {
    return value.some((item) =>
      embeddedDbQueryEngineBoundaryMapHasPresentFieldDeep(item, fields)
    );
  }

  if (!isPlainObjectRecord(value)) {
    return false;
  }

  for (const [key, nested] of Object.entries(value)) {
    if (
      key === "explicitBlockedAuthorizationFlags" ||
      key === "unsafeEmbeddedDbQueryEnginePrimitiveRuntimeFlags"
    ) {
      continue;
    }

    if (fields.includes(key)) {
      return true;
    }

    if (embeddedDbQueryEngineBoundaryMapHasPresentFieldDeep(nested, fields)) {
      return true;
    }
  }

  return false;
}

function embeddedDbQueryEngineBoundaryMapEntriesInput(inputRecord) {
  return Array.isArray(inputRecord?.boundaryEntries)
    ? inputRecord.boundaryEntries
    : null;
}

function embeddedDbQueryEngineBoundaryMapMalformed(inputRecord) {
  return (
    inputRecord === null ||
    (Object.prototype.hasOwnProperty.call(inputRecord, "reviewedAt") &&
      !isUtcIsoTimestampWithMilliseconds(inputRecord.reviewedAt)) ||
    (Object.prototype.hasOwnProperty.call(inputRecord, "boundaryEntries") &&
      !Array.isArray(inputRecord.boundaryEntries))
  );
}

function embeddedDbQueryEngineBoundaryMapEntryIssue(entries, predicate) {
  return entries !== null && entries.some((entry) => predicate(entry));
}

function embeddedDbQueryEngineBoundaryMapMissingRequired(entry) {
  return (
    !isPlainObjectRecord(entry) ||
    EMBEDDED_DB_QUERY_ENGINE_REQUIRED_FIELDS.some(
      (field) => !Object.prototype.hasOwnProperty.call(entry, field)
    )
  );
}

function embeddedDbQueryEngineBoundaryMapEntryMalformed(entry) {
  if (!isPlainObjectRecord(entry)) {
    return true;
  }

  return (
    typeof entry.boundaryId !== "string" ||
    !Array.isArray(entry.allowedCurrentBehavior) ||
    !Array.isArray(entry.forbiddenCurrentBehavior) ||
    typeof entry.requiredFutureContractBeforeImplementation !== "string" ||
    typeof entry.requiredFutureAuthorizationPhaseBeforeRuntime !== "string" ||
    typeof entry.databaseFileFormatExpectation !== "string" ||
    typeof entry.queryParsingExpectation !== "string" ||
    typeof entry.readOnlyQueryExpectation !== "string" ||
    typeof entry.dataIsolationExpectation !== "string" ||
    typeof entry.storageWriteExpectation !== "string" ||
    typeof entry.auditLoggingExpectation !== "string" ||
    typeof entry.migrationTransactionExpectation !== "string" ||
    typeof entry.performanceIndexingExpectation !== "string" ||
    typeof entry.locusRoleDescription !== "string" ||
    typeof entry.fabricRoleDescription !== "string" ||
    typeof entry.secureDropRoleDescription !== "string" ||
    !isPlainObjectRecord(entry.explicitBlockedAuthorizationFlags) ||
    !isPlainObjectRecord(
      entry.unsafeEmbeddedDbQueryEnginePrimitiveRuntimeFlags
    ) ||
    entry.nonAuthorizingProof !== true
  );
}

function embeddedDbQueryEngineBoundaryMapAuthorizationFlagEnabled(value) {
  if (!isPlainObjectRecord(value)) {
    return false;
  }

  return (
    (isPlainObjectRecord(value.explicitBlockedAuthorizationFlags) &&
      Object.values(value.explicitBlockedAuthorizationFlags).some(
        (flag) => flag !== false
      )) ||
    EMBEDDED_DB_QUERY_ENGINE_AUTHORIZATION_FIELDS.some(
      (field) => value[field] === true
    )
  );
}

function embeddedDbQueryEngineBoundaryMapUnsafeFlagEnabled(value) {
  if (!isPlainObjectRecord(value)) {
    return false;
  }

  return (
    (isPlainObjectRecord(
      value.unsafeEmbeddedDbQueryEnginePrimitiveRuntimeFlags
    ) &&
      Object.values(
        value.unsafeEmbeddedDbQueryEnginePrimitiveRuntimeFlags
      ).some((flag) => flag !== false)) ||
    embeddedDbQueryEngineBoundaryMapHasTrueFieldDeep(
      value,
      EMBEDDED_DB_QUERY_ENGINE_UNSAFE_FIELDS
    )
  );
}

function embeddedDbQueryEngineBoundaryMapCanonical(entries) {
  if (entries === null) {
    return true;
  }

  return (
    JSON.stringify(entries) ===
    JSON.stringify(embeddedDbQueryEngineBoundaryMapEntries())
  );
}

function embeddedDbQueryEngineBoundaryMapInputClassification(inputRecord) {
  if (embeddedDbQueryEngineBoundaryMapMalformed(inputRecord)) {
    return MALFORMED_EMBEDDED_DB_QUERY_ENGINE_BOUNDARY_MAP_CLASSIFICATION;
  }

  const entries = embeddedDbQueryEngineBoundaryMapEntriesInput(inputRecord);

  if (
    embeddedDbQueryEngineBoundaryMapEntryIssue(
      entries,
      embeddedDbQueryEngineBoundaryMapMissingRequired
    )
  ) {
    return "missing_required_embedded_db_query_engine_boundary_entry_rejected";
  }

  if (
    embeddedDbQueryEngineBoundaryMapEntryIssue(
      entries,
      (entry) =>
        !EMBEDDED_DB_QUERY_ENGINE_BOUNDARY_FAMILIES.includes(
          entry.boundaryFamily
        )
    )
  ) {
    return "unknown_boundary_family_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected";
  }

  if (
    embeddedDbQueryEngineBoundaryMapEntryIssue(
      entries,
      (entry) =>
        !EMBEDDED_DB_QUERY_ENGINE_RELATED_SYSTEMS.includes(entry.relatedSystem)
    )
  ) {
    return "unknown_related_system_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected";
  }

  if (
    embeddedDbQueryEngineBoundaryMapEntryIssue(
      entries,
      (entry) => !EMBEDDED_DB_QUERY_ENGINE_STATUSES.includes(entry.currentStatus)
    )
  ) {
    return "unknown_current_status_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected";
  }

  if (
    embeddedDbQueryEngineBoundaryMapEntryIssue(
      entries,
      embeddedDbQueryEngineBoundaryMapEntryMalformed
    )
  ) {
    return MALFORMED_EMBEDDED_DB_QUERY_ENGINE_BOUNDARY_MAP_CLASSIFICATION;
  }

  if (
    embeddedDbQueryEngineBoundaryMapHasTrueFieldDeep(inputRecord, [
      "runtimeAuthorized",
      "authorizesRuntime"
    ])
  ) {
    return "runtime_authorization_attempt_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected";
  }

  if (
    EMBEDDED_DB_QUERY_ENGINE_AUTHORIZATION_FIELDS.some(
      (field) => inputRecord?.[field] === true
    ) ||
    embeddedDbQueryEngineBoundaryMapEntryIssue(
      entries,
      embeddedDbQueryEngineBoundaryMapAuthorizationFlagEnabled
    ) ||
    embeddedDbQueryEngineBoundaryMapAuthorizationFlagEnabled(inputRecord)
  ) {
    return "authorization_flags_enabled_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected";
  }

  if (
    embeddedDbQueryEngineBoundaryMapHasTrueFieldDeep(inputRecord, [
      "reportRunsChecks"
    ])
  ) {
    return "report_runs_checks_true_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected";
  }

  if (
    embeddedDbQueryEngineBoundaryMapHasTrueFieldDeep(
      inputRecord,
      EMBEDDED_DB_QUERY_ENGINE_AUTHORIZATION_FIELDS
    )
  ) {
    return "runtime_authorization_attempt_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected";
  }

  if (
    embeddedDbQueryEngineBoundaryMapHasTrueFieldDeep(
      inputRecord,
      EMBEDDED_DB_QUERY_ENGINE_COMMAND_FIELDS
    )
  ) {
    return "command_exposure_attempt_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected";
  }

  if (
    embeddedDbQueryEngineBoundaryMapHasTrueFieldDeep(
      inputRecord,
      EMBEDDED_DB_QUERY_ENGINE_BLOCKED_CLI_BYPASS_FIELDS
    )
  ) {
    return "blocked_cli_bypass_attempt_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected";
  }

  for (const { classification, fields } of EMBEDDED_DB_QUERY_ENGINE_HIDDEN_FIELD_GROUPS) {
    if (
      embeddedDbQueryEngineBoundaryMapHasPresentFieldDeep(inputRecord, fields)
    ) {
      return classification;
    }
  }

  if (
    embeddedDbQueryEngineBoundaryMapUnsafeFlagEnabled(inputRecord) ||
    embeddedDbQueryEngineBoundaryMapEntryIssue(
      entries,
      embeddedDbQueryEngineBoundaryMapUnsafeFlagEnabled
    )
  ) {
    return "unsafe_embedded_db_query_engine_primitive_runtime_flags_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected";
  }

  if (
    embeddedDbQueryEngineBoundaryMapEntryIssue(entries, (entry) =>
      embeddedDbQueryEngineBoundaryMapContainsTrue(entry?.runtimeEffect)
    ) ||
    embeddedDbQueryEngineBoundaryMapContainsTrue(inputRecord?.runtimeEffect)
  ) {
    return "nested_unsafe_flags_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected";
  }

  if (
    Object.keys(inputRecord ?? {}).some(
      (field) =>
        !EMBEDDED_DB_QUERY_ENGINE_ALLOWED_TOP_LEVEL_FIELDS.includes(field)
    )
  ) {
    return "unknown_top_level_field_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected";
  }

  if (!embeddedDbQueryEngineBoundaryMapCanonical(entries)) {
    return "noncanonical_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected";
  }

  return VALID_EMBEDDED_DB_QUERY_ENGINE_BOUNDARY_MAP_CLASSIFICATION;
}

function embeddedDbQueryEngineBoundaryMapAuthorizationFlags() {
  return Object.fromEntries(
    EMBEDDED_DB_QUERY_ENGINE_AUTHORIZATION_FIELDS.map((field) => [
      field,
      false
    ])
  );
}

function embeddedDbQueryEngineBoundaryMapFalseRuntimeFields() {
  return Object.fromEntries(
    EMBEDDED_DB_QUERY_ENGINE_UNSAFE_FIELDS.map((field) => [field, false])
  );
}

function embeddedDbQueryEngineBoundaryDefinition({
  boundaryId,
  boundaryFamily,
  relatedSystem,
  currentStatus = "future_contract_required",
  contract,
  allowed = [],
  forbidden = [],
  databaseFileFormat,
  queryParsing,
  readOnlyQuery,
  dataIsolation,
  storageWrite,
  auditLogging,
  migrationTransaction,
  performanceIndexing,
  locusRole,
  fabricRole,
  secureDropRole
}) {
  return {
    boundaryId,
    boundaryFamily,
    relatedSystem,
    currentStatus,
    allowedCurrentBehavior: [
      "Record deterministic review-only embedded DB/query-engine primitive boundary metadata.",
      "Use SQLite concepts and CodeCrafters SQLite references as taxonomy only.",
      "Keep Ardyn runtime, command, storage, filesystem, and query behavior blocked.",
      ...allowed
    ],
    forbiddenCurrentBehavior: [
      "Install, vendor, import, copy, or integrate CodeCrafters SQLite, course SDK code, SQLite libraries, DB clients, or storage adapters.",
      "Implement SQLite runtime, embedded DB reader, database file parser, page parser, schema/table parser, SQL parser, query executor, table scan, index lookup, B-tree traversal, transaction, WAL, migration, RLS runtime, query audit writer, cache, or persistence behavior.",
      "Read or write database files, scan filesystems, expose commands, start backends, grant connectors, run Fabric/fabric-core transport, or bypass blocked CLI behavior.",
      ...forbidden
    ],
    requiredFutureContractBeforeImplementation: contract,
    requiredFutureAuthorizationPhaseBeforeRuntime:
      "A later explicit runtime authorization phase must approve the exact embedded DB/query-engine implementation after security, storage, auth, audit, and operations contracts exist; Phase 5.76 grants no runtime, filesystem, database, query, command, process, Fabric, or connector permission.",
    databaseFileFormatExpectation:
      databaseFileFormat ??
      "SQLite file format concepts, page size, page headers, schema metadata, and table metadata remain review taxonomy only; Phase 5.76 opens no database file and parses no bytes.",
    queryParsingExpectation:
      queryParsing ??
      "SQL parsing concepts remain future contract metadata only; Phase 5.76 adds no tokenizer, parser, grammar, AST, planner, or execution path.",
    readOnlyQueryExpectation:
      readOnlyQuery ??
      "Read-only query concepts such as .dbinfo, .tables, SELECT COUNT(*), single-column SELECT, multi-column SELECT, and WHERE filters are reference boundaries only.",
    dataIsolationExpectation:
      dataIsolation ??
      "Future data isolation must be defined against Phase 5.63 RLS and auth boundaries before runtime; Phase 5.76 enforces no RLS runtime and touches no records.",
    storageWriteExpectation:
      storageWrite ??
      "Future storage must be separately authorized against Phase 5.61 database/storage boundaries; Phase 5.76 adds no database client, storage adapter, persistence, cache, read, or write.",
    auditLoggingExpectation:
      auditLogging ??
      "Future query audit evidence must be separately designed against Phase 5.65 logging/audit boundaries; Phase 5.76 adds no logger, transcript writer, audit writer, telemetry, or external sink.",
    migrationTransactionExpectation:
      migrationTransaction ??
      "Future transaction, WAL, migration, schema-change, backup, recovery, retention, deletion, and export behavior require separate contracts; Phase 5.76 implements none of them.",
    performanceIndexingExpectation:
      performanceIndexing ??
      "Future performance, full-table scan, index lookup, and B-tree traversal contracts must remain analysis metadata until authorized; Phase 5.76 performs no scan, lookup, traversal, or timing work.",
    locusRoleDescription:
      locusRole ??
      "Locus may later display review-only DB/query readiness state after a separate UI/consent contract; Phase 5.76 adds no Locus integration or UI.",
    fabricRoleDescription:
      fabricRole ??
      "Fabric and fabric-core remain referenced only for future large-payload metadata relationships; Phase 5.76 adds no fabric-core import, sidecar, content-addressed transport, or file transfer.",
    secureDropRoleDescription:
      secureDropRole ??
      "Secure Drop remains canonical outside Ardyn with content-fabric ownership; Phase 5.76 adds no Secure Drop crypto, transport, inbox, file selection, filesystem scanning, or DB integration."
  };
}

function embeddedDbQueryEngineBoundaryDefinitions() {
  return [
    embeddedDbQueryEngineBoundaryDefinition({
      boundaryId: "phase5-76.ardyn.embedded_db.contract",
      boundaryFamily: "embedded_db_contract",
      relatedSystem: "ardyn",
      currentStatus: "blocked",
      contract:
        "Define the full embedded DB responsibility boundary, ownership, threat model, data model, and blocked-runtime approval gates before any DB runtime exists."
    }),
    embeddedDbQueryEngineBoundaryDefinition({
      boundaryId:
        "phase5-76.codecrafters_sqlite_reference.sqlite.taxonomy.boundary",
      boundaryFamily: "sqlite_reference_boundary",
      relatedSystem: "codecrafters-sqlite-reference",
      currentStatus: "metadata_only",
      contract:
        "Keep codecrafters-io/build-your-own-sqlite as architecture taxonomy only; any future implementation must be independently specified, reviewed, and authorized.",
      databaseFileFormat:
        "SQLite file concepts are reference labels only; this phase imports no challenge code, SDK, SQLite library, or database reader."
    }),
    embeddedDbQueryEngineBoundaryDefinition({
      boundaryId:
        "phase5-76.codecrafters_sqlite_reference.file_format.contract",
      boundaryFamily: "database_file_format_contract",
      relatedSystem: "codecrafters-sqlite-reference",
      currentStatus: "metadata_only",
      contract:
        "Define any future database file-format reader contract, byte limits, malformed file handling, and local-only policy before reading a database file.",
      allowed: [
        "Record SQLite file-format, .dbinfo-style metadata, and .tables-style metadata as review-only taxonomy."
      ]
    }),
    embeddedDbQueryEngineBoundaryDefinition({
      boundaryId: "phase5-76.codecrafters_sqlite_reference.page_header.contract",
      boundaryFamily: "page_header_contract",
      relatedSystem: "codecrafters-sqlite-reference",
      currentStatus: "metadata_only",
      contract:
        "Define page size, page header, overflow, malformed page, and byte-order contracts before any page parsing or DB byte inspection."
    }),
    embeddedDbQueryEngineBoundaryDefinition({
      boundaryId: "phase5-76.ardyn.schema_metadata.contract",
      boundaryFamily: "schema_metadata_contract",
      relatedSystem: "ardyn",
      contract:
        "Define schema metadata, .dbinfo-style introspection, schema provenance, and redaction requirements before schema inspection exists.",
      readOnlyQuery:
        ".dbinfo-style metadata inspection is reference-only in Phase 5.76; no schema table, file, page, or metadata parser is added."
    }),
    embeddedDbQueryEngineBoundaryDefinition({
      boundaryId: "phase5-76.ardyn.table_metadata.contract",
      boundaryFamily: "table_metadata_contract",
      relatedSystem: "ardyn",
      contract:
        "Define table metadata listing, .tables-style behavior, table allowlists, and hidden-table policy before table listing exists.",
      readOnlyQuery:
        ".tables-style table listing is reference-only in Phase 5.76; no table catalog reader or filesystem-backed database inspection is added."
    }),
    embeddedDbQueryEngineBoundaryDefinition({
      boundaryId: "phase5-76.ardyn.sql_parser.contract",
      boundaryFamily: "sql_parser_contract",
      relatedSystem: "ardyn",
      currentStatus: "blocked",
      contract:
        "Define parser grammar scope, rejected statement classes, parameter handling, injection boundaries, and fail-closed parse errors before any SQL parser exists.",
      queryParsing:
        "Future SQL parsing must be read-only, allowlisted, and separately authorized; Phase 5.76 adds no SQL tokenizer, grammar, AST, planner, or parser."
    }),
    embeddedDbQueryEngineBoundaryDefinition({
      boundaryId: "phase5-76.ardyn_subagent.read_only_query.contract",
      boundaryFamily: "read_only_query_contract",
      relatedSystem: "ardyn-subagent",
      contract:
        "Define read-only query eligibility, output limits, result redaction, and non-authorizing subagent handoff rules before any query runtime exists.",
      readOnlyQuery:
        "Read-only query concepts are metadata-only; no SELECT, COUNT, projection, filter, scan, or result materialization occurs."
    }),
    embeddedDbQueryEngineBoundaryDefinition({
      boundaryId: "phase5-76.external_harness.select_query.contract",
      boundaryFamily: "select_query_contract",
      relatedSystem: "external-harness",
      contract:
        "Define SELECT COUNT(*), single-column SELECT, multi-column SELECT, projection limits, type handling, and result display contracts before query execution.",
      readOnlyQuery:
        "SELECT COUNT(*), single-column SELECT, and multi-column SELECT are future taxonomy boundaries only; no query executor is present."
    }),
    embeddedDbQueryEngineBoundaryDefinition({
      boundaryId: "phase5-76.external_harness.where_filter.contract",
      boundaryFamily: "where_filter_contract",
      relatedSystem: "external-harness",
      contract:
        "Define WHERE predicate scope, comparison semantics, parameter rules, type coercion, and injection-resistant filter contracts before runtime.",
      queryParsing:
        "WHERE filtering remains a future parser and evaluator contract; Phase 5.76 adds no predicate evaluator or expression runtime."
    }),
    embeddedDbQueryEngineBoundaryDefinition({
      boundaryId: "phase5-76.repo_family.full_table_scan.contract",
      boundaryFamily: "full_table_scan_contract",
      relatedSystem: "repo-family",
      currentStatus: "blocked",
      contract:
        "Define scan authorization, local-only limits, cancellation, abuse controls, performance budgets, and audit evidence before any full-table scan exists.",
      performanceIndexing:
        "Full-table scan is a risk taxonomy entry only; Phase 5.76 scans no table, page, file, or record."
    }),
    embeddedDbQueryEngineBoundaryDefinition({
      boundaryId: "phase5-76.repo_family.index_lookup.contract",
      boundaryFamily: "index_lookup_contract",
      relatedSystem: "repo-family",
      currentStatus: "blocked",
      contract:
        "Define index metadata trust, lookup semantics, malformed index behavior, and performance evidence before any index lookup exists.",
      performanceIndexing:
        "Index lookup remains reference metadata only; no index page, key, cursor, or planner behavior is implemented."
    }),
    embeddedDbQueryEngineBoundaryDefinition({
      boundaryId: "phase5-76.codecrafters_sqlite_reference.btree.contract",
      boundaryFamily: "btree_traversal_contract",
      relatedSystem: "codecrafters-sqlite-reference",
      currentStatus: "blocked",
      contract:
        "Define B-tree page traversal, overflow handling, malformed node handling, recursion limits, and resource budgets before any traversal exists.",
      performanceIndexing:
        "B-tree traversal is a taxonomy boundary only; Phase 5.76 follows no pointers and reads no pages."
    }),
    embeddedDbQueryEngineBoundaryDefinition({
      boundaryId: "phase5-76.multiverse.query_performance.contract",
      boundaryFamily: "query_performance_contract",
      relatedSystem: "multiverse",
      contract:
        "Define performance, cancellation, idempotency, result-size, and quality-gate evidence before query runtime or benchmarking exists.",
      performanceIndexing:
        "Query performance remains metadata-only and linked to Phase 5.69 and Phase 5.70; Phase 5.76 adds no benchmark, retry, scheduler, or worker."
    }),
    embeddedDbQueryEngineBoundaryDefinition({
      boundaryId: "phase5-76.repo_family.transaction.boundary",
      boundaryFamily: "transaction_boundary_contract",
      relatedSystem: "repo-family",
      currentStatus: "blocked",
      contract:
        "Define transaction scope, locking, rollback, idempotency, and write prohibition before any transaction behavior exists.",
      migrationTransaction:
        "Transactions remain future contract metadata only; Phase 5.76 opens no connection, acquires no lock, writes no journal, and changes no state."
    }),
    embeddedDbQueryEngineBoundaryDefinition({
      boundaryId: "phase5-76.content_fabric.wal.boundary",
      boundaryFamily: "wal_boundary_contract",
      relatedSystem: "content-fabric",
      currentStatus: "blocked",
      contract:
        "Define WAL interpretation, checkpoint, recovery, retention, and corruption handling before any WAL behavior or file access exists.",
      migrationTransaction:
        "WAL behavior is reference-only; Phase 5.76 adds no WAL parser, journal reader, recovery job, backup job, restore job, or filesystem access."
    }),
    embeddedDbQueryEngineBoundaryDefinition({
      boundaryId: "phase5-76.repo_family.migration.boundary",
      boundaryFamily: "migration_boundary_contract",
      relatedSystem: "repo-family",
      currentStatus: "blocked",
      contract:
        "Define schema-change, migration, rollback, retention, deletion, export, and compliance contracts before migrations are considered.",
      migrationTransaction:
        "Migration and schema-change behavior remain blocked; Phase 5.76 adds no migration runner, DDL executor, RLS migration, or storage write."
    }),
    embeddedDbQueryEngineBoundaryDefinition({
      boundaryId: "phase5-76.content_fabric.storage_adapter.boundary",
      boundaryFamily: "storage_adapter_boundary",
      relatedSystem: "content-fabric",
      currentStatus: "blocked",
      contract:
        "Define storage adapter ownership, credential boundaries, local-only/cloud-opt-in policy, backup/recovery, and retention before any adapter exists.",
      storageWrite:
        "Storage adapters remain blocked and owned by future explicit contracts; Phase 5.76 adds no database client, adapter, filesystem reader, filesystem writer, cache, or persistence layer."
    }),
    embeddedDbQueryEngineBoundaryDefinition({
      boundaryId: "phase5-76.locus.rls_data_isolation.boundary",
      boundaryFamily: "rls_data_isolation_boundary",
      relatedSystem: "locus",
      contract:
        "Define RLS/data-isolation display expectations, tenant/owner boundaries, and consent before any query result can be shown.",
      dataIsolation:
        "RLS/data isolation references Phase 5.63 only; Phase 5.76 enforces no RLS runtime and exposes no data to Locus."
    }),
    embeddedDbQueryEngineBoundaryDefinition({
      boundaryId: "phase5-76.fabric_core_reference.query_audit.boundary",
      boundaryFamily: "query_audit_boundary",
      relatedSystem: "fabric-core-reference",
      contract:
        "Define query audit, redaction, retention, Fabric large-payload metadata relation, and non-authorizing evidence before any audit writer or fabric-core consumer path.",
      auditLogging:
        "Query audit remains future metadata; Phase 5.76 writes no logs, transcripts, audit records, telemetry, external sink, import, export, or package artifact.",
      fabricRole:
        "Phase 5.75 fabric-core large-payload metadata is referenced only to keep Ardyn a future consumer; Phase 5.76 adds no fabric-core import, sidecar, transport, contentId verification, or payload movement."
    })
  ];
}

function embeddedDbQueryEngineBoundaryMapEntry(definition) {
  return {
    ...definition,
    phase561DatabaseStorageReference: {
      fixture:
        "tests/fixtures/host-policy/phase5-61/database-storage-contract-boundary-map.json",
      databaseStorageRuntimeAuthorized: false,
      storageAdapterAuthorized: false
    },
    phase563RlsDataIsolationReference: {
      fixture:
        "tests/fixtures/host-policy/phase5-63/security-rls-input-sanitization-contract-boundary-map.json",
      rlsRuntimeAuthorized: false,
      inputSanitizationRuntimeAuthorized: false
    },
    phase565AuditLoggingReference: {
      fixture:
        "tests/fixtures/host-policy/phase5-65/error-tracking-logging-audit-integrity-contract-boundary-map.json",
      queryAuditWriterAuthorized: false,
      loggerRuntimeAuthorized: false
    },
    phase566BackupRecoveryReference: {
      fixture:
        "tests/fixtures/host-policy/phase5-66/availability-recovery-contract-boundary-map.json",
      backupJobAuthorized: false,
      restoreJobAuthorized: false
    },
    phase567RetentionDeletionExportReference: {
      fixture:
        "tests/fixtures/host-policy/phase5-67/infrastructure-compliance-data-retention-contract-boundary-map.json",
      retentionJobAuthorized: false,
      exportJobAuthorized: false
    },
    phase569TestingQualityGateReference: {
      fixture:
        "tests/fixtures/host-policy/phase5-69/testing-frameworks-quality-gates-contract-boundary-map.json",
      queryEngineQualityGateRequired: true,
      qualityGateRuntimeAuthorized: false
    },
    phase570OperationsReliabilityReference: {
      fixture:
        "tests/fixtures/host-policy/phase5-70/operations-reliability-contract-boundary-map.json",
      idempotencyRuntimeAuthorized: false,
      retryRuntimeAuthorized: false
    },
    phase572SecretsCredentialReference: {
      fixture:
        "tests/fixtures/host-policy/phase5-72/secrets-management-key-rotation-external-gateway-credential-boundary-map.json",
      embeddedDbKeyCredentialRuntimeAuthorized: false,
      secretStoreAuthorized: false
    },
    phase574CommandSurfaceShellReference: {
      fixture:
        "tests/fixtures/host-policy/phase5-74/command-surface-shell-primitive-contract-boundary-map.json",
      shellRuntimeAuthorized: false,
      commandExposureAuthorized: false
    },
    phase575FabricCoreConsumerReference: {
      fixture:
        "tests/fixtures/host-policy/phase5-75/fabric-core-consumer-integration-readiness-boundary-update.json",
      fabricCoreLargePayloadMetadataRelationOnly: true,
      fabricCoreTransportAuthorized: false
    },
    embeddedDbQueryEnginePrimitiveBoundaryMetadataOnly: true,
    noLiveEmbeddedDbQueryEngineRuntimePerformed: true,
    explicitBlockedAuthorizationFlags:
      embeddedDbQueryEngineBoundaryMapAuthorizationFlags(),
    unsafeEmbeddedDbQueryEnginePrimitiveRuntimeFlags:
      embeddedDbQueryEngineBoundaryMapFalseRuntimeFields(),
    nonAuthorizingProof: true,
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

function embeddedDbQueryEngineBoundaryMapEntries() {
  return embeddedDbQueryEngineBoundaryDefinitions().map(
    embeddedDbQueryEngineBoundaryMapEntry
  );
}

function embeddedDbQueryEngineBoundaryMapSummary(entries) {
  const countByFamily = Object.fromEntries(
    EMBEDDED_DB_QUERY_ENGINE_BOUNDARY_FAMILIES.map((family) => [
      family,
      entries.filter((entry) => entry.boundaryFamily === family).length
    ])
  );
  const countByRelatedSystem = Object.fromEntries(
    EMBEDDED_DB_QUERY_ENGINE_RELATED_SYSTEMS.map((system) => [
      system,
      entries.filter((entry) => entry.relatedSystem === system).length
    ])
  );
  const countByStatus = Object.fromEntries(
    EMBEDDED_DB_QUERY_ENGINE_STATUSES.map((status) => [
      status,
      entries.filter((entry) => entry.currentStatus === status).length
    ])
  );
  const allBlockedAuthorizationFlagsFalse = entries.every((entry) =>
    Object.values(entry.explicitBlockedAuthorizationFlags).every(
      (value) => value === false
    )
  );
  const allUnsafeEmbeddedDbQueryEnginePrimitiveRuntimeFlagsFalse =
    entries.every((entry) =>
      Object.values(
        entry.unsafeEmbeddedDbQueryEnginePrimitiveRuntimeFlags
      ).every((value) => value === false)
    );
  const allRuntimeEffectsFalse = entries.every((entry) =>
    Object.values(entry.runtimeEffect).every((value) => value === false)
  );

  return {
    boundaryMapKind:
      EMBEDDED_DB_QUERY_ENGINE_PRIMITIVE_CONTRACT_BOUNDARY_MAP_KIND,
    boundaryEntryCount: entries.length,
    countByFamily,
    countByRelatedSystem,
    countByStatus,
    boundaryFamilies: [...EMBEDDED_DB_QUERY_ENGINE_BOUNDARY_FAMILIES],
    relatedSystems: [...EMBEDDED_DB_QUERY_ENGINE_RELATED_SYSTEMS],
    currentStatusValues: [...EMBEDDED_DB_QUERY_ENGINE_STATUSES],
    embeddedDbQueryEnginePrimitiveBoundaryMetadataOnly: true,
    noLiveEmbeddedDbQueryEngineRuntimePerformed: true,
    sqliteReferenceBoundaryRecorded: true,
    databaseFileFormatBoundaryRecorded: true,
    pageHeaderBoundaryRecorded: true,
    schemaTableMetadataBoundaryRecorded: true,
    dbinfoStyleMetadataInspectionBoundaryRecorded: true,
    tablesStyleTableListingBoundaryRecorded: true,
    selectCountBoundaryRecorded: true,
    singleColumnSelectBoundaryRecorded: true,
    multiColumnSelectBoundaryRecorded: true,
    whereFilterBoundaryRecorded: true,
    fullTableScanBoundaryRecorded: true,
    indexLookupBoundaryRecorded: true,
    btreeTraversalBoundaryRecorded: true,
    queryPerformanceBoundaryRecorded: true,
    transactionWalBoundaryRecorded: true,
    migrationSchemaChangeBoundaryRecorded: true,
    storageAdapterBoundaryRecorded: true,
    rlsDataIsolationBoundaryRecorded: true,
    queryAuditBoundaryRecorded: true,
    embeddedDbKeyCredentialBoundaryReferenced: true,
    databaseStoragePersistenceBoundaryReferenced: true,
    shellCommandSurfaceRelationshipBoundaryReferenced: true,
    fabricCoreLargePayloadMetadataRelationshipBoundaryReferenced: true,
    noSqliteRuntime: true,
    noEmbeddedDbReader: true,
    noDatabaseClient: true,
    noDatabaseFileParser: true,
    noPageParser: true,
    noSqlParser: true,
    noQueryExecutor: true,
    noTableScan: true,
    noIndexLookup: true,
    noBtreeTraversal: true,
    noTransactionWalRuntime: true,
    noMigrationSchemaChangeRuntime: true,
    noStorageAdapter: true,
    noDbReadWrite: true,
    noFilesystemAccess: true,
    noCacheRuntime: true,
    noRlsRuntime: true,
    noQueryAuditWriter: true,
    noShellRuntime: true,
    noMatrixGatewayRuntime: true,
    noFabricCoreImport: true,
    noFabricCoreTransportRuntime: true,
    noContentAddressedChunkedResumableMultiSourceP2pTransport: true,
    noSecureDropImplementation: true,
    noBackendApiServerBehavior: true,
    noCommandExposure: true,
    noBlockedCliBypass: true,
    allBlockedAuthorizationFlagsFalse,
    allUnsafeEmbeddedDbQueryEnginePrimitiveRuntimeFlagsFalse,
    allRuntimeEffectsFalse,
    allEntriesNonAuthorizing: entries.every(
      (entry) => entry.nonAuthorizingProof === true
    )
  };
}

function embeddedDbQueryEngineBoundaryMapValidationRules() {
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
    enabledRuntimeCommandConnectorFabricWebsocketHttpMcpTaskSecureDropServiceDiscoveryScheduleFilesystemProcessFlagsFailClosed:
      true,
    enabledSqliteRuntimeFailClosed: true,
    enabledEmbeddedDbReaderFailClosed: true,
    enabledDatabaseClientFailClosed: true,
    enabledDatabaseFileParserFailClosed: true,
    enabledPageParserFailClosed: true,
    enabledSqlParserFailClosed: true,
    enabledQueryExecutorFailClosed: true,
    enabledTableScanFailClosed: true,
    enabledIndexLookupFailClosed: true,
    enabledBtreeTraversalFailClosed: true,
    enabledTransactionWalBehaviorFailClosed: true,
    enabledMigrationSchemaChangeFailClosed: true,
    enabledStorageAdapterFailClosed: true,
    enabledDbReadWriteFailClosed: true,
    enabledFilesystemAccessFailClosed: true,
    enabledCacheRuntimeFailClosed: true,
    enabledRlsRuntimeFailClosed: true,
    enabledQueryAuditWriterFailClosed: true,
    hiddenSqliteEmbeddedDbQueryRuntimeSemanticsFailClosed: true,
    hiddenDatabaseFilePageParsingSemanticsFailClosed: true,
    hiddenSqlQueryExecutionSemanticsFailClosed: true,
    hiddenBtreeIndexTraversalSemanticsFailClosed: true,
    hiddenTransactionWalMigrationSemanticsFailClosed: true,
    hiddenStorageCacheReadWriteSemanticsFailClosed: true,
    hiddenFilesystemAccessSemanticsFailClosed: true,
    hiddenAuthSessionTokenApiKeySemanticsFailClosed: true,
    hiddenConnectorGrantSemanticsFailClosed: true,
    hiddenFabricFabricCoreTransportRuntimeSemanticsFailClosed: true,
    hiddenContentAddressedChunkedResumableP2pTransportSemanticsFailClosed: true,
    hiddenMatrixGatewayRuntimeSemanticsFailClosed: true,
    hiddenShellCommandRuntimeSemanticsFailClosed: true,
    hiddenSecureDropImplementationSemanticsFailClosed: true,
    hiddenBackendApiServerSemanticsFailClosed: true,
    hiddenLoggerAuditTranscriptTelemetryExternalSinkSemanticsFailClosed: true,
    nestedUnsafeFlagsFailClosed: true,
    noncanonicalBoundaryEntriesFailClosed: true,
    validationImportsCodeCraftersSqlite: false,
    validationImportsSqliteLibrary: false,
    validationReadsDatabaseFiles: false,
    validationWritesDatabaseFiles: false,
    validationRunsSqlParser: false,
    validationExecutesQueries: false,
    validationChangesPackageJson: false,
    validationRequestsJules: false
  };
}

function embeddedDbQueryEngineBoundaryMapGaps() {
  return [
    "Future embedded DB/query-engine work still needs a dedicated implementation prompt, threat model, file-format contract, parser contract, query authorization model, and security review before any SQLite or DB runtime.",
    "Future read-only query behavior still needs explicit contracts for .dbinfo, .tables, SELECT COUNT(*), single-column SELECT, multi-column SELECT, WHERE filters, result limits, and redaction.",
    "Future storage work still needs Phase 5.61 persistence, Phase 5.63 RLS/data isolation, Phase 5.65 audit, Phase 5.66 backup/recovery, and Phase 5.67 retention/deletion/export contracts before any storage adapter or DB file access.",
    "Future performance work still needs quality gates, idempotency, cancellation, abuse controls, and operations/reliability evidence before table scans, index lookups, B-tree traversal, or query planning.",
    "Code Mode orchestration, Fabric/API-backend wiring, fabric-core large-payload consumption, shell command exposure, and external harness DB handoff remain separate review-only gaps."
  ];
}

function embeddedDbQueryEngineBoundaryMapState(reviewedAt) {
  const boundaryEntries = embeddedDbQueryEngineBoundaryMapEntries();

  return {
    schema: EMBEDDED_DB_QUERY_ENGINE_BOUNDARY_MAP_STATE_SCHEMA,
    schemaVersion:
      EMBEDDED_DB_QUERY_ENGINE_PRIMITIVE_CONTRACT_BOUNDARY_MAP_VERSION,
    stateKind: EMBEDDED_DB_QUERY_ENGINE_PRIMITIVE_CONTRACT_BOUNDARY_MAP_KIND,
    stateMode: "review-only",
    reviewedAt,
    sourcePhaseContext: {
      phase561DatabaseStorageBoundary:
        "tests/fixtures/host-policy/phase5-61/database-storage-contract-boundary-map.json",
      phase563SecurityRlsInputSanitizationBoundary:
        "tests/fixtures/host-policy/phase5-63/security-rls-input-sanitization-contract-boundary-map.json",
      phase565LoggingAuditBoundary:
        "tests/fixtures/host-policy/phase5-65/error-tracking-logging-audit-integrity-contract-boundary-map.json",
      phase566AvailabilityRecoveryBoundary:
        "tests/fixtures/host-policy/phase5-66/availability-recovery-contract-boundary-map.json",
      phase567InfrastructureComplianceRetentionBoundary:
        "tests/fixtures/host-policy/phase5-67/infrastructure-compliance-data-retention-contract-boundary-map.json",
      phase569TestingQualityGateBoundary:
        "tests/fixtures/host-policy/phase5-69/testing-frameworks-quality-gates-contract-boundary-map.json",
      phase570OperationsReliabilityBoundary:
        "tests/fixtures/host-policy/phase5-70/operations-reliability-contract-boundary-map.json",
      phase572SecretsCredentialBoundary:
        "tests/fixtures/host-policy/phase5-72/secrets-management-key-rotation-external-gateway-credential-boundary-map.json",
      phase574CommandSurfaceShellPrimitiveBoundary:
        "tests/fixtures/host-policy/phase5-74/command-surface-shell-primitive-contract-boundary-map.json",
      phase575FabricCoreConsumerReadinessBoundary:
        "tests/fixtures/host-policy/phase5-75/fabric-core-consumer-integration-readiness-boundary-update.json",
      codeCraftersSqliteReference:
        "codecrafters-io/build-your-own-sqlite reference taxonomy only",
      sqliteRuntimeImplemented: false,
      databaseClientImplemented: false,
      filesystemAccessImplemented: false,
      storageAdapterImplemented: false,
      fabricCoreTransportImplemented: false,
      runtimeStillBlocked: true
    },
    boundaryEntries,
    boundaryMapSummary:
      embeddedDbQueryEngineBoundaryMapSummary(boundaryEntries),
    invalidBoundaryCasePolicy:
      embeddedDbQueryEngineBoundaryMapValidationRules(),
    topEmbeddedDbQueryEngineCodeModeFabricApiBackendGaps:
      embeddedDbQueryEngineBoundaryMapGaps(),
    recommendedNextPhase:
      "phase-5.77-review-only-code-mode-orchestration-contract-boundary-map",
    embeddedDbQueryEnginePrimitiveContractBoundaryMapOnly: true,
    reviewOnly: true,
    metadataOnly: true,
    authoritative: false,
    nonAuthorizingProof: true,
    reportRunsChecks: false,
    ...embeddedDbQueryEngineBoundaryMapFalseRuntimeFields(),
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

function embeddedDbQueryEngineBoundaryMapResult({
  reviewedAt,
  reviewedAtDefaulted,
  classification,
  accepted,
  embeddedDbQueryEnginePrimitiveContractBoundaryMap
}) {
  return {
    schema: EMBEDDED_DB_QUERY_ENGINE_PRIMITIVE_CONTRACT_BOUNDARY_MAP_SCHEMA,
    schemaVersion:
      EMBEDDED_DB_QUERY_ENGINE_PRIMITIVE_CONTRACT_BOUNDARY_MAP_VERSION,
    embeddedDbQueryEnginePrimitiveContractBoundaryMapKind:
      EMBEDDED_DB_QUERY_ENGINE_PRIMITIVE_CONTRACT_BOUNDARY_MAP_KIND,
    embeddedDbQueryEnginePrimitiveContractBoundaryMapMode: "review-only",
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    embeddedDbQueryEnginePrimitiveContractBoundaryMapProduced: accepted,
    embeddedDbQueryEnginePrimitiveContractBoundaryMap,
    boundaryMapSummary: accepted
      ? embeddedDbQueryEnginePrimitiveContractBoundaryMap.boundaryMapSummary
      : null,
    boundaryEntries: accepted
      ? embeddedDbQueryEnginePrimitiveContractBoundaryMap.boundaryEntries
      : [],
    invalidBoundaryCasePolicy: accepted
      ? embeddedDbQueryEnginePrimitiveContractBoundaryMap
          .invalidBoundaryCasePolicy
      : embeddedDbQueryEngineBoundaryMapValidationRules(),
    topEmbeddedDbQueryEngineCodeModeFabricApiBackendGaps: accepted
      ? embeddedDbQueryEnginePrimitiveContractBoundaryMap
          .topEmbeddedDbQueryEngineCodeModeFabricApiBackendGaps
      : [],
    recommendedNextPhase: accepted
      ? embeddedDbQueryEnginePrimitiveContractBoundaryMap.recommendedNextPhase
      : null,
    embeddedDbQueryEnginePrimitiveContractBoundaryMapOnly: true,
    reviewOnly: true,
    metadataOnly: true,
    authoritative: false,
    nonAuthorizingProof: true,
    reportRunsChecks: false,
    ...embeddedDbQueryEngineBoundaryMapFalseRuntimeFields(),
    rejectionReasons: accepted
      ? []
      : [
          {
            classification,
            rejected: true,
            runtimeAuthorized: false,
            sqliteRuntimeAuthorized: false,
            embeddedDbReaderAuthorized: false,
            databaseClientAuthorized: false,
            databaseFileParserAuthorized: false,
            pageParserAuthorized: false,
            sqlParserAuthorized: false,
            queryExecutorAuthorized: false,
            storageAdapterAuthorized: false,
            filesystemAccessAuthorized: false,
            commandExposureAuthorized: false,
            reportRunsChecks: false
          }
        ],
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

export function createEmbeddedDbQueryEnginePrimitiveContractBoundaryMapForReview(
  input = {}
) {
  const inputRecord = embeddedDbQueryEngineBoundaryMapInputRecord(input);
  const reviewedAt = embeddedDbQueryEngineBoundaryMapReviewedAt(inputRecord);
  const reviewedAtDefaulted = isReviewedAtDefaulted(inputRecord);
  const classification =
    embeddedDbQueryEngineBoundaryMapInputClassification(inputRecord);
  const accepted =
    classification ===
    VALID_EMBEDDED_DB_QUERY_ENGINE_BOUNDARY_MAP_CLASSIFICATION;
  const embeddedDbQueryEnginePrimitiveContractBoundaryMap = accepted
    ? embeddedDbQueryEngineBoundaryMapState(reviewedAt)
    : null;

  return embeddedDbQueryEngineBoundaryMapResult({
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    accepted,
    embeddedDbQueryEnginePrimitiveContractBoundaryMap
  });
}

