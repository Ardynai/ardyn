// Modularization: governance/report tail extracted from index.mjs
// (phases 5.75b-5.83: fabric-federation reconciliation, code-mode orchestration,
//  CI enforcement + enablement, report script/test compaction, source-guard
//  hardening, external-reference policy). Public surface preserved via shims.

import { isPlainObjectRecord, isReviewedAtDefaulted } from "./internal/utils.mjs";
import { approvalEvaluatorCandidateNestedTrueClaim } from "./internal/review-shared.mjs";

export const FABRIC_FEDERATION_RECONCILIATION_SCHEMA =
  "ardyn.phase-5.76b.fabric-federation-reconciliation-result";
export const FABRIC_FEDERATION_RECONCILIATION_VERSION = "0.1.0";
export const FABRIC_FEDERATION_RECONCILIATION_KIND =
  "fabric-federation-reconciliation";
export const VALID_FABRIC_FEDERATION_RECONCILIATION_CLASSIFICATION =
  "valid_fabric_federation_reconciliation_consumer_client_present_unwired";

const FABRIC_FEDERATION_RECONCILIATION_KNOWN_KEYS = Object.freeze(new Set([
  "reviewedAt",
  "boundaryEntries",
  "reportRunsChecks",
  "authorizesRuntime",
  "fabricFederationClientPresent",
  "wiredIntoCli",
  "wiredIntoHost",
  "outOfProcess",
  "sidecarLoopbackEnforced",
  "registryRequiresHttpsWhenRemote",
  "importsFabricCore",
  "joinsDhtSwarmP2p",
  "reimplementsTransport",
  "decryptsSecureDropCiphertext",
  "addsRuntimeDependency",
  "secretsCommittedToRepo",
  "closedSiblingDidAllowlist",
  "receiveSideContentIdReverified",
  "fabricRuntime",
  "fabricCoreTransportRuntime",
  "fabricCoreImport",
  "secureDropRuntime",
  "dhtSwarmP2p",
  "shellRuntime",
  "sqliteRuntime",
  "commandExposureEnabled",
  "blockedCliBypassEnabled",
  "apiKey",
  "connectorGrant",
  "filesystemRead",
  "filesystemWrite",
  "envReader"
]));

const MALFORMED_INPUT = Symbol("malformed");
function fabricFederationReconciliationInputRecord(input) {
  if (input === null || typeof input !== "object" || Array.isArray(input)) {
    return MALFORMED_INPUT;
  }
  return input;
}

function fabricFederationReconciliationReviewedAt(inputRecord) {
  if (inputRecord === MALFORMED_INPUT) {
    return null;
  }
  const value = inputRecord.reviewedAt;
  if (value === undefined) {
    return "2026-07-05T00:00:00.000Z";
  }
  if (typeof value !== "string" || Number.isNaN(Date.parse(value))) {
    return null;
  }
  return value;
}

function fabricFederationReconciliationClassification(inputRecord) {
  const reviewedAt = fabricFederationReconciliationReviewedAt(inputRecord);
  const reviewedAtDefaulted = isReviewedAtDefaulted(inputRecord);
  if (reviewedAt === null) {
    return "malformed_fabric_federation_reconciliation_input_rejected";
  }
  if (inputRecord.reportRunsChecks === true) {
    return "report_runs_checks_true_fabric_federation_reconciliation_input_rejected";
  }
  if (inputRecord.authorizesRuntime === true) {
    return "runtime_authorization_attempt_fabric_federation_reconciliation_input_rejected";
  }
  if (inputRecord.fabricRuntime && typeof inputRecord.fabricRuntime === "object") {
    return "hidden_fabric_runtime_semantics_fabric_federation_reconciliation_input_rejected";
  }
  if (inputRecord.fabricCoreTransportRuntime && typeof inputRecord.fabricCoreTransportRuntime === "object") {
    return "hidden_fabric_core_transport_runtime_semantics_fabric_federation_reconciliation_input_rejected";
  }
  if (inputRecord.fabricCoreImport && typeof inputRecord.fabricCoreImport === "object") {
    return "hidden_fabric_core_import_semantics_fabric_federation_reconciliation_input_rejected";
  }
  if (inputRecord.secureDropRuntime && typeof inputRecord.secureDropRuntime === "object") {
    return "hidden_secure_drop_implementation_semantics_fabric_federation_reconciliation_input_rejected";
  }
  if (inputRecord.dhtSwarmP2p && typeof inputRecord.dhtSwarmP2p === "object") {
    return "hidden_dht_swarm_p2p_semantics_fabric_federation_reconciliation_input_rejected";
  }
  if (inputRecord.shellRuntime && typeof inputRecord.shellRuntime === "object") {
    return "hidden_shell_command_runtime_semantics_fabric_federation_reconciliation_input_rejected";
  }
  if (inputRecord.sqliteRuntime && typeof inputRecord.sqliteRuntime === "object") {
    return "hidden_sqlite_embedded_db_query_runtime_semantics_fabric_federation_reconciliation_input_rejected";
  }
  if (inputRecord.commandExposureEnabled === true) {
    return "command_exposure_attempt_fabric_federation_reconciliation_input_rejected";
  }
  if (inputRecord.blockedCliBypassEnabled === true) {
    return "blocked_cli_bypass_attempt_fabric_federation_reconciliation_input_rejected";
  }
  if (inputRecord.apiKey && typeof inputRecord.apiKey === "object") {
    return "hidden_auth_session_token_api_key_semantics_fabric_federation_reconciliation_input_rejected";
  }
  if (inputRecord.connectorGrant && typeof inputRecord.connectorGrant === "object") {
    return "hidden_connector_grant_semantics_fabric_federation_reconciliation_input_rejected";
  }
  if (inputRecord.filesystemRead && typeof inputRecord.filesystemRead === "object") {
    return "hidden_filesystem_access_semantics_fabric_federation_reconciliation_input_rejected";
  }
  if (inputRecord.filesystemWrite && typeof inputRecord.filesystemWrite === "object") {
    return "hidden_filesystem_write_semantics_fabric_federation_reconciliation_input_rejected";
  }
  if (inputRecord.envReader && typeof inputRecord.envReader === "object") {
    return "hidden_env_secrets_exposure_semantics_fabric_federation_reconciliation_input_rejected";
  }
  if (inputRecord === MALFORMED_INPUT) {
    return "malformed_fabric_federation_reconciliation_input_rejected";
  }
  // Check for unknown top-level keys (excluding known ones)
  for (const key of Object.keys(inputRecord)) {
    if (!FABRIC_FEDERATION_RECONCILIATION_KNOWN_KEYS.has(key)) {
      return "unknown_top_level_field_fabric_federation_reconciliation_input_rejected";
    }
  }
  // Check invariant flips — any attempt to flip an invariant to a disallowed value
  if (inputRecord.wiredIntoCli === true) {
    return "invariant_flip_wired_into_cli_fabric_federation_reconciliation_input_rejected";
  }
  if (inputRecord.wiredIntoHost === true) {
    return "invariant_flip_wired_into_host_fabric_federation_reconciliation_input_rejected";
  }
  if (inputRecord.importsFabricCore === true) {
    return "invariant_flip_imports_fabric_core_fabric_federation_reconciliation_input_rejected";
  }
  if (inputRecord.joinsDhtSwarmP2p === true) {
    return "invariant_flip_joins_dht_swarm_p2p_fabric_federation_reconciliation_input_rejected";
  }
  if (inputRecord.decryptsSecureDropCiphertext === true) {
    return "invariant_flip_decrypts_secure_drop_fabric_federation_reconciliation_input_rejected";
  }
  if (inputRecord.addsRuntimeDependency === true) {
    return "invariant_flip_adds_runtime_dependency_fabric_federation_reconciliation_input_rejected";
  }
  if (inputRecord.secretsCommittedToRepo === true) {
    return "invariant_flip_secrets_committed_to_repo_fabric_federation_reconciliation_input_rejected";
  }
  if (inputRecord.outOfProcess === false) {
    return "invariant_flip_out_of_process_fabric_federation_reconciliation_input_rejected";
  }
  if (inputRecord.sidecarLoopbackEnforced === false) {
    return "invariant_flip_sidecar_loopback_fabric_federation_reconciliation_input_rejected";
  }
  if (inputRecord.closedSiblingDidAllowlist === false) {
    return "invariant_flip_closed_sibling_allowlist_fabric_federation_reconciliation_input_rejected";
  }
  if (inputRecord.receiveSideContentIdReverified === false) {
    return "invariant_flip_receive_side_content_id_reverified_fabric_federation_reconciliation_input_rejected";
  }
  return VALID_FABRIC_FEDERATION_RECONCILIATION_CLASSIFICATION;
}

function fabricFederationReconciliationBoundaryEntries() {
  return [
    {
      boundaryId: "phase5-76b.ardyn.fabric_federation_consumer_client",
      boundaryFamily: "fabric_federation_consumer_client",
      relatedSystem: "ardyn",
      currentStatus: "active_consumer_unwired",
      allowedCurrentBehavior: [
        "Record the Fabric Federation consumer client as present but unwired.",
        "Keep the client out-of-process with loopback-sidecar-only transport.",
        "Keep the client out of the CLI and Rust host wiring."
      ],
      forbiddenCurrentBehavior: [
        "Wire the federation client into the CLI or Rust host.",
        "Import @multiverse/fabric-core.",
        "Join a DHT, swarm, or P2P network.",
        "Decrypt Secure Drop ciphertext.",
        "Add runtime dependencies.",
        "Commit secrets to the repo."
      ],
      authorizedBy: "PR#4",
      authorizationDate: "2026-07-05",
      fabricFederationClientPresent: true,
      wiredIntoCli: false,
      wiredIntoHost: false,
      outOfProcess: true,
      sidecarLoopbackEnforced: true,
      registryRequiresHttpsWhenRemote: true,
      importsFabricCore: false,
      joinsDhtSwarmP2p: false,
      reimplementsTransport: false,
      decryptsSecureDropCiphertext: false,
      addsRuntimeDependency: false,
      secretsCommittedToRepo: false,
      closedSiblingDidAllowlist: true,
      receiveSideContentIdReverified: true,
      explicitBlockedAuthorizationFlags: {
        runtimeAuthorized: false,
        authorizesRuntime: false,
        fabricCoreImportAuthorized: false,
        dhtSwarmP2pAuthorized: false,
        secureDropDecryptionAuthorized: false,
        commandExposureAuthorized: false,
        blockedCliBypassAuthorized: false,
        cliWiringAuthorized: false,
        hostWiringAuthorized: false,
        approvalDecisionProduced: false,
        approvalGrantProduced: false
      },
      unsafeFabricFederationRuntimeFlags: {
        runtimeExecutionEnabled: false,
        runtimeAuthorizationEnabled: false,
        runtimeCommandEnabled: false,
        commandExposureEnabled: false,
        commandsExposed: false,
        connectorGrantProduced: false,
        fabricCoreTransportRuntimeEnabled: false,
        fabricCoreNpmDependencyEnabled: false,
        fabricTransportDSidecarClientEnabled: false,
        multiverseFabricCoreImportEnabled: false,
        contentAddressedTransportEnabled: false,
        chunkedTransferEnabled: false,
        resumableTransferEnabled: false,
        multiSourceTransferEnabled: false,
        bittorrentDhtSwarmP2pEnabled: false,
        largePayloadTransferRuntimeEnabled: false,
        secureDropImplemented: false,
        secureDropDecryptionEnabled: false,
        filesystemAccessEnabled: false,
        filesystemReadEnabled: false,
        filesystemWriteEnabled: false,
        filesystemScanningEnabled: false,
        processControlEnabled: false,
        shellRuntimeEnabled: false,
        sqliteRuntimeEnabled: false,
        embeddedDbReaderEnabled: false,
        databaseClientImplemented: false,
        dbReadWriteEnabled: false,
        cacheRuntimeEnabled: false,
        rlsRuntimeImplemented: false,
        queryAuditWriterImplemented: false,
        matrixClientRuntimeEnabled: false,
        externalGatewayRuntimeEnabled: false,
        backendRuntimeImplementedByArdyn: false,
        backendApiServerMiddlewareImplemented: false,
        apiEndpointImplementedByArdyn: false,
        serverImplementedByArdyn: false,
        transcriptWriterImplemented: false,
        auditWriterImplemented: false,
        loggerRuntimeImplemented: false,
        auditWriterRuntimeImplemented: false,
        telemetryClientImplemented: false,
        healthCheckRuntimeImplemented: false,
        encodedHandoffRuntimeImplementedByArdyn: false,
        codecRuntimeEnabled: false,
        translatorRuntimeEnabled: false,
        uiRuntimeImplemented: false,
        blockedCliBypassEnabled: false
      },
      runtimeEffect: {
        runtimeEnabled: false,
        runtimeStarted: false,
        runtimeReady: false,
        runtimeCommandEnabled: false,
        runtimeCommandExposureEnabled: false,
        runtimeExecutionEnabled: false,
        runtimeExecuted: false,
        approvalGrantProduced: false,
        approvalGrantPersisted: false,
        approvalEvaluatorAuthoritative: false
      },
      nonAuthorizingProof: true,
      fabricFederationReconciliationMetadataOnly: true,
      noLiveFabricFederationWiringPerformed: true
    }
  ];
}

function fabricFederationReconciliationBoundaryMapSummary(entries) {
  return {
    boundaryEntryCount: entries.length,
    boundaryFamilies: ["fabric_federation_consumer_client"],
    relatedSystems: ["ardyn"],
    currentStatusValues: ["active_consumer_unwired"],
    countByFamily: { fabric_federation_consumer_client: 1 },
    countByRelatedSystem: { ardyn: 1 },
    countByStatus: { active_consumer_unwired: 1 },
    fabricFederationClientPresent: true,
    wiredIntoCli: false,
    wiredIntoHost: false,
    outOfProcess: true,
    sidecarLoopbackEnforced: true,
    registryRequiresHttpsWhenRemote: true,
    importsFabricCore: false,
    joinsDhtSwarmP2p: false,
    reimplementsTransport: false,
    decryptsSecureDropCiphertext: false,
    addsRuntimeDependency: false,
    secretsCommittedToRepo: false,
    closedSiblingDidAllowlist: true,
    receiveSideContentIdReverified: true,
    authorizedBy: "PR#4",
    authorizationDate: "2026-07-05",
    noFabricCoreImport: true,
    noDhtSwarmP2p: true,
    noSecureDropDecrypt: true,
    noCliHostWiring: true,
    allBlockedAuthorizationFlagsFalse: true,
    allUnsafeFabricFederationRuntimeFlagsFalse: true,
    allRuntimeEffectsFalse: true,
    allEntriesNonAuthorizing: true
  };
}

function fabricFederationReconciliationFalseRuntimeFields() {
  return {
    fabricFederationClientPresent: false,
    runtimeAuthorized: false,
    authorizesRuntime: false,
    runtimeExecutionEnabled: false,
    runtimeAuthorizationEnabled: false,
    runtimeCommandEnabled: false,
    commandExposureEnabled: false,
    commandsExposed: false,
    connectorGrantProduced: false,
    fabricCoreTransportRuntimeEnabled: false,
    fabricCoreNpmDependencyEnabled: false,
    fabricTransportDSidecarClientEnabled: false,
    multiverseFabricCoreImportEnabled: false,
    contentAddressedTransportEnabled: false,
    chunkedTransferEnabled: false,
    resumableTransferEnabled: false,
    multiSourceTransferEnabled: false,
    bittorrentDhtSwarmP2pEnabled: false,
    largePayloadTransferRuntimeEnabled: false,
    secureDropImplemented: false,
    secureDropDecryptionEnabled: false,
    filesystemAccessEnabled: false,
    filesystemReadEnabled: false,
    filesystemWriteEnabled: false,
    filesystemScanningEnabled: false,
    processControlEnabled: false,
    shellRuntimeEnabled: false,
    sqliteRuntimeEnabled: false,
    embeddedDbReaderEnabled: false,
    databaseClientImplemented: false,
    dbReadWriteEnabled: false,
    cacheRuntimeEnabled: false,
    rlsRuntimeImplemented: false,
    queryAuditWriterImplemented: false,
    matrixClientRuntimeEnabled: false,
    externalGatewayRuntimeEnabled: false,
    backendRuntimeImplementedByArdyn: false,
    backendApiServerMiddlewareImplemented: false,
    apiEndpointImplementedByArdyn: false,
    serverImplementedByArdyn: false,
    transcriptWriterImplemented: false,
    auditWriterImplemented: false,
    loggerRuntimeImplemented: false,
    auditWriterRuntimeImplemented: false,
    telemetryClientImplemented: false,
    healthCheckRuntimeImplemented: false,
    encodedHandoffRuntimeImplementedByArdyn: false,
    codecRuntimeEnabled: false,
    translatorRuntimeEnabled: false,
    uiRuntimeImplemented: false,
    blockedCliBypassEnabled: false
  };
}

function fabricFederationReconciliationResult({
  reviewedAt,
  reviewedAtDefaulted,
  classification,
  accepted,
  boundaryEntries
}) {
  const summary = accepted
    ? fabricFederationReconciliationBoundaryMapSummary(boundaryEntries)
    : null;
  return {
    schema: FABRIC_FEDERATION_RECONCILIATION_SCHEMA,
    schemaVersion: FABRIC_FEDERATION_RECONCILIATION_VERSION,
    fabricFederationReconciliationKind: FABRIC_FEDERATION_RECONCILIATION_KIND,
    fabricFederationReconciliationMode: "review-only",
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    fabricFederationReconciliationProduced: accepted,
    boundaryEntries: accepted ? boundaryEntries : [],
    boundaryMapSummary: summary,
    recommendedNextPhase: accepted ? "phase-5.77-code-mode-orchestration-boundary-map" : null,
    fabricFederationReconciliationOnly: true,
    reviewOnly: true,
    metadataOnly: true,
    authoritative: false,
    nonAuthorizingProof: true,
    reportRunsChecks: false,
    ...(accepted ? {} : fabricFederationReconciliationFalseRuntimeFields()),
    rejectionReasons: accepted ? [] : [
      {
        classification,
        rejected: true,
        runtimeAuthorized: false,
        reportRunsChecks: false
      }
    ],
    runtimeEffect: {
      runtimeEnabled: false,
      runtimeStarted: false,
      runtimeReady: false,
      runtimeCommandEnabled: false,
      runtimeCommandExposureEnabled: false,
      runtimeExecutionEnabled: false,
      runtimeExecuted: false,
      approvalGrantProduced: false,
      approvalGrantPersisted: false,
      approvalEvaluatorAuthoritative: false
    }
  };
}

export function createFabricFederationReconciliationForReview(input = {}) {
  const inputRecord = fabricFederationReconciliationInputRecord(input);
  const reviewedAt = fabricFederationReconciliationReviewedAt(inputRecord);
  const reviewedAtDefaulted = isReviewedAtDefaulted(inputRecord);
  const classification =
    fabricFederationReconciliationClassification(inputRecord);
  const accepted =
    classification === VALID_FABRIC_FEDERATION_RECONCILIATION_CLASSIFICATION;
  const boundaryEntries = accepted
    ? fabricFederationReconciliationBoundaryEntries()
    : [];

  return fabricFederationReconciliationResult({
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    accepted,
    boundaryEntries
  });
}

// ─── Phase 5.77: Code Mode orchestration contract boundary map ───────────────
// ponytail: 12 boundary families with contract shapes (deeper than 5.68 flags).
// Reuses MALFORMED_INPUT (line 69510), isPlainObjectRecord (line 3945),
// approvalEvaluatorCandidateNestedTrueClaim (line 8163) — no new clones.
// Ceiling: if more orchestration surfaces are added, copy this block rather
// than generalizing the pattern.

export const CODE_MODE_ORCHESTRATION_BOUNDARY_MAP_SCHEMA =
  "ardyn.phase-5.77.code-mode-orchestration-contract-boundary-map-result";
export const CODE_MODE_ORCHESTRATION_BOUNDARY_MAP_VERSION = "0.1.0";
export const CODE_MODE_ORCHESTRATION_BOUNDARY_MAP_KIND =
  "code-mode-orchestration-contract-boundary-map";
export const VALID_CODE_MODE_ORCHESTRATION_BOUNDARY_MAP_CLASSIFICATION =
  "valid_code_mode_orchestration_contract_boundary_map_runtime_still_blocked";

const CODE_MODE_ORCHESTRATION_BOUNDARY_FAMILIES = Object.freeze([
  "orchestrator_plan_contract",
  "subagent_spawn_role_contract",
  "fusion_pass_contract",
  "judge_comparison_contract",
  "synthesis_result_contract",
  "front_desk_contract",
  "toolkit_check_selection_contract",
  "loop_semantics_contract",
  "failure_abort_contract",
  "audit_transcript_contract",
  "human_approval_gate_contract",
  "code_mode_blocked_runtime_list"
]);

const CODE_MODE_ORCHESTRATION_RELATED_SYSTEMS = Object.freeze([
  "ardyn",
  "ardyn-subagent",
  "external-harness"
]);

const CODE_MODE_ORCHESTRATION_STATUSES = Object.freeze([
  "blocked",
  "future_contract_required"
]);

const CODE_MODE_ORCHESTRATION_REQUIRED_FIELDS = Object.freeze([
  "boundaryId",
  "boundaryFamily",
  "relatedSystem",
  "currentStatus",
  "allowedCurrentBehavior",
  "forbiddenCurrentBehavior",
  "requiredFutureContractBeforeImplementation",
  "requiredFutureAuthorizationPhaseBeforeRuntime",
  "contractShape",
  "crossPhaseReferences",
  "explicitBlockedAuthorizationFlags",
  "unsafeCodeModeOrchestrationRuntimeFlags",
  "nonAuthorizingProof"
]);

const CODE_MODE_ORCHESTRATION_ALLOWED_TOP_LEVEL_FIELDS = Object.freeze([
  "reviewedAt",
  "boundaryEntries",
  "reportRunsChecks",
  "authorizesRuntime",
  "maxIterationsPerLoop",
  "orchestratorRuntime",
  "subagentSpawnRuntime",
  "fusionPassRuntime",
  "judgeComparisonRuntime",
  "frontDeskRuntime",
  "toolkitInvocationRuntime",
  "loopRuntime",
  "modelApiCalls",
  "processSpawnRuntime",
  "shellRuntime",
  "sqliteRuntime",
  "matrixClientRuntime",
  "fabricCoreTransportRuntime",
  "secureDropRuntime",
  "apiKey",
  "connectorGrant",
  "filesystemRead",
  "filesystemWrite",
  "envReader",
  "commandExposureEnabled",
  "blockedCliBypassEnabled",
  "runtimeEffect"
]);

const CODE_MODE_ORCHESTRATION_UNSAFE_FIELDS = Object.freeze([
  "runtimeExecutionEnabled",
  "runtimeAuthorizationEnabled",
  "runtimeCommandEnabled",
  "commandExposureEnabled",
  "commandsExposed",
  "connectorGrantProduced",
  "orchestratorRuntimeEnabled",
  "orchestrationEngineEnabled",
  "planExecutorEnabled",
  "subagentSpawnEnabled",
  "agentSpawnerEnabled",
  "subagentProcessEnabled",
  "fusionPassEnabled",
  "fusionEngineEnabled",
  "candidateMergerEnabled",
  "judgeComparisonEnabled",
  "judgeEngineEnabled",
  "verdictProducerEnabled",
  "frontDeskRuntimeEnabled",
  "frontDeskResponderEnabled",
  "responderRuntimeEnabled",
  "toolkitInvocationEnabled",
  "toolRuntimeEnabled",
  "checkRunnerEnabled",
  "loopRuntimeEnabled",
  "iterationEngineEnabled",
  "loopExecutorEnabled",
  "modelApiCallsEnabled",
  "llmApiCallsEnabled",
  "inferenceRuntimeEnabled",
  "processSpawnEnabled",
  "processControlEnabled",
  "childProcessEnabled",
  "shellRuntimeEnabled",
  "sqliteRuntimeEnabled",
  "embeddedDbReaderEnabled",
  "databaseClientImplemented",
  "matrixClientRuntimeEnabled",
  "externalGatewayRuntimeEnabled",
  "fabricCoreTransportRuntimeEnabled",
  "fabricRuntimeImplementedByArdyn",
  "contentAddressedTransportEnabled",
  "secureDropImplemented",
  "secureDropDecryptionEnabled",
  "filesystemAccessEnabled",
  "filesystemReadEnabled",
  "filesystemWriteEnabled",
  "backendRuntimeImplementedByArdyn",
  "backendApiServerMiddlewareImplemented",
  "apiEndpointImplementedByArdyn",
  "serverImplementedByArdyn",
  "transcriptWriterImplemented",
  "auditWriterImplemented",
  "loggerRuntimeImplemented",
  "auditWriterRuntimeImplemented",
  "telemetryClientImplemented",
  "healthCheckRuntimeImplemented",
  "encodedHandoffRuntimeImplementedByArdyn",
  "codecRuntimeEnabled",
  "translatorRuntimeEnabled",
  "uiRuntimeImplemented",
  "blockedCliBypassEnabled"
]);

const CODE_MODE_ORCHESTRATION_KNOWN_KEYS = Object.freeze(new Set([
  "reviewedAt",
  "boundaryEntries",
  "reportRunsChecks",
  "authorizesRuntime",
  "maxIterationsPerLoop",
  "orchestratorRuntime",
  "subagentSpawnRuntime",
  "fusionPassRuntime",
  "judgeComparisonRuntime",
  "frontDeskRuntime",
  "toolkitInvocationRuntime",
  "loopRuntime",
  "modelApiCalls",
  "processSpawnRuntime",
  "shellRuntime",
  "sqliteRuntime",
  "matrixClientRuntime",
  "fabricCoreTransportRuntime",
  "secureDropRuntime",
  "apiKey",
  "connectorGrant",
  "filesystemRead",
  "filesystemWrite",
  "envReader",
  "commandExposureEnabled",
  "blockedCliBypassEnabled",
  "runtimeEffect",
  // ponytail: unsafe runtime flags are known keys so the classifier can test
  // them as unsafe rather than rejecting them as unknown top-level fields.
  ...CODE_MODE_ORCHESTRATION_UNSAFE_FIELDS
]));

const CODE_MODE_ORCHESTRATION_AUTHORIZATION_FIELDS = Object.freeze([
  "runtimeAuthorized",
  "authorizesRuntime",
  "orchestratorRuntimeAuthorizationGranted",
  "subagentSpawnAuthorizationGranted",
  "fusionPassAuthorizationGranted",
  "judgeComparisonAuthorizationGranted",
  "frontDeskAuthorizationGranted",
  "toolkitInvocationAuthorizationGranted",
  "loopRuntimeAuthorizationGranted",
  "modelApiCallsAuthorizationGranted",
  "externalAgentInviteAuthorizationGranted",
  "commandExposureAuthorizationGranted",
  "approvalDecisionProduced",
  "approvalGrantProduced"
]);

const CODE_MODE_ORCHESTRATION_COMMAND_FIELDS = Object.freeze([
  "commandExposureEnabled",
  "commandRuntimeControlEnabled",
  "commandsExposed",
  "exposesCommands",
  "runtimeCommandEnabled",
  "codeModeCommandExposed",
  "orchestratorCommandExposed",
  "spawnSubagentCommandExposed",
  "serveRuntimeCommandEnabled"
]);

const CODE_MODE_ORCHESTRATION_BLOCKED_CLI_BYPASS_FIELDS = Object.freeze([
  "blockedCliBypassEnabled",
  "dryRunBypassesBlock",
  "serveRuntimeBypassEnabled",
  "bypassBlockedCommandBehavior",
  "blockedCommandOverride"
]);

const CODE_MODE_ORCHESTRATION_HIDDEN_FIELD_GROUPS = Object.freeze([
  {
    classification:
      "hidden_orchestrator_runtime_semantics_code_mode_orchestration_contract_boundary_map_input_rejected",
    fields: ["orchestratorRuntime", "orchestrationEngine", "planExecutor"]
  },
  {
    classification:
      "hidden_subagent_spawn_runtime_semantics_code_mode_orchestration_contract_boundary_map_input_rejected",
    fields: ["subagentSpawnRuntime", "agentSpawner", "subagentProcess"]
  },
  {
    classification:
      "hidden_fusion_pass_runtime_semantics_code_mode_orchestration_contract_boundary_map_input_rejected",
    fields: ["fusionPassRuntime", "fusionEngine", "candidateMerger"]
  },
  {
    classification:
      "hidden_judge_comparison_runtime_semantics_code_mode_orchestration_contract_boundary_map_input_rejected",
    fields: ["judgeComparisonRuntime", "judgeEngine", "verdictProducer"]
  },
  {
    classification:
      "hidden_front_desk_runtime_semantics_code_mode_orchestration_contract_boundary_map_input_rejected",
    fields: ["frontDeskRuntime", "responderRuntime", "frontDeskResponder"]
  },
  {
    classification:
      "hidden_toolkit_invocation_runtime_semantics_code_mode_orchestration_contract_boundary_map_input_rejected",
    fields: ["toolkitInvocationRuntime", "toolRuntime", "checkRunner"]
  },
  {
    classification:
      "hidden_loop_runtime_semantics_code_mode_orchestration_contract_boundary_map_input_rejected",
    fields: ["loopRuntime", "iterationEngine", "loopExecutor"]
  },
  {
    classification:
      "hidden_model_api_call_semantics_code_mode_orchestration_contract_boundary_map_input_rejected",
    fields: ["modelApiCalls", "llmApiCalls", "inferenceRuntime"]
  },
  {
    classification:
      "hidden_process_spawn_semantics_code_mode_orchestration_contract_boundary_map_input_rejected",
    fields: ["processSpawnRuntime", "processControl", "childProcess"]
  },
  {
    classification:
      "hidden_shell_command_runtime_semantics_code_mode_orchestration_contract_boundary_map_input_rejected",
    fields: ["shellRuntime", "shellCommand", "commandExecution"]
  },
  {
    classification:
      "hidden_sqlite_embedded_db_query_runtime_semantics_code_mode_orchestration_contract_boundary_map_input_rejected",
    fields: ["sqliteRuntime", "embeddedDbRuntime", "databaseRuntime"]
  },
  {
    classification:
      "hidden_matrix_gateway_runtime_semantics_code_mode_orchestration_contract_boundary_map_input_rejected",
    fields: ["matrixClientRuntime", "matrixGateway", "externalGateway"]
  },
  {
    classification:
      "hidden_fabric_core_transport_runtime_semantics_code_mode_orchestration_contract_boundary_map_input_rejected",
    fields: ["fabricCoreTransportRuntime", "fabricTransport", "contentAddressedTransport"]
  },
  {
    classification:
      "hidden_secure_drop_implementation_semantics_code_mode_orchestration_contract_boundary_map_input_rejected",
    fields: ["secureDropRuntime", "secureDropImplementation", "secureDropDecrypt"]
  },
  {
    classification:
      "hidden_filesystem_access_semantics_code_mode_orchestration_contract_boundary_map_input_rejected",
    fields: ["filesystemRead", "filesystemWrite", "filesystemAccess"]
  },
  {
    classification:
      "hidden_auth_session_token_api_key_semantics_code_mode_orchestration_contract_boundary_map_input_rejected",
    fields: ["apiKey", "authToken", "sessionToken"]
  },
  {
    classification:
      "hidden_connector_grant_semantics_code_mode_orchestration_contract_boundary_map_input_rejected",
    fields: ["connectorGrant", "apiConnector", "integrationGrant"]
  },
  {
    classification:
      "hidden_env_secrets_exposure_semantics_code_mode_orchestration_contract_boundary_map_input_rejected",
    fields: ["envReader", "envSecrets", "secretReader"]
  }
]);

function codeModeOrchestrationInputRecord(input) {
  if (input === null || typeof input !== "object" || Array.isArray(input)) {
    return MALFORMED_INPUT;
  }
  return input;
}

function codeModeOrchestrationReviewedAt(inputRecord) {
  if (inputRecord === MALFORMED_INPUT) {
    return null;
  }
  const value = inputRecord.reviewedAt;
  if (value === undefined) {
    return "2026-07-06T00:00:00.000Z";
  }
  if (typeof value !== "string" || Number.isNaN(Date.parse(value))) {
    return null;
  }
  return value;
}

function codeModeOrchestrationClassification(inputRecord) {
  const reviewedAt = codeModeOrchestrationReviewedAt(inputRecord);
  const reviewedAtDefaulted = isReviewedAtDefaulted(inputRecord);
  if (reviewedAt === null) {
    return "malformed_code_mode_orchestration_contract_boundary_map_input_rejected";
  }
  if (inputRecord === MALFORMED_INPUT) {
    return "malformed_code_mode_orchestration_contract_boundary_map_input_rejected";
  }
  if (inputRecord.reportRunsChecks === true) {
    return "report_runs_checks_true_code_mode_orchestration_contract_boundary_map_input_rejected";
  }
  if (inputRecord.authorizesRuntime === true) {
    return "runtime_authorization_attempt_code_mode_orchestration_contract_boundary_map_input_rejected";
  }
  // maxIterationsPerLoop is REQUIRED — its absence is a rejection-class (like reportRunsChecks:true)
  if (inputRecord.maxIterationsPerLoop === undefined || inputRecord.maxIterationsPerLoop === null) {
    return "missing_max_iterations_per_loop_code_mode_orchestration_contract_boundary_map_input_rejected";
  }
  if (typeof inputRecord.maxIterationsPerLoop !== "number" || inputRecord.maxIterationsPerLoop < 1 || !Number.isInteger(inputRecord.maxIterationsPerLoop)) {
    return "invalid_max_iterations_per_loop_code_mode_orchestration_contract_boundary_map_input_rejected";
  }
  // Hidden runtime semantics — any object-valued hidden field is rejected
  for (const group of CODE_MODE_ORCHESTRATION_HIDDEN_FIELD_GROUPS) {
    for (const field of group.fields) {
      if (inputRecord[field] && typeof inputRecord[field] === "object") {
        return group.classification;
      }
    }
  }
  if (inputRecord.commandExposureEnabled === true) {
    return "command_exposure_attempt_code_mode_orchestration_contract_boundary_map_input_rejected";
  }
  if (inputRecord.blockedCliBypassEnabled === true) {
    return "blocked_cli_bypass_attempt_code_mode_orchestration_contract_boundary_map_input_rejected";
  }
  // Check for unknown top-level keys
  for (const key of Object.keys(inputRecord)) {
    if (!CODE_MODE_ORCHESTRATION_KNOWN_KEYS.has(key)) {
      return "unknown_top_level_field_code_mode_orchestration_contract_boundary_map_input_rejected";
    }
  }
  // Check unsafe runtime flags at top level
  for (const flag of CODE_MODE_ORCHESTRATION_UNSAFE_FIELDS) {
    if (inputRecord[flag] === true) {
      return "unsafe_code_mode_orchestration_runtime_flags_code_mode_orchestration_contract_boundary_map_input_rejected";
    }
  }
  // Nested unsafe flags — reuse the cycle-guarded nested-true-claim walker
  // (approvalEvaluatorCandidateNestedTrueClaim at index.mjs:8163), not a fresh clone.
  // ponytail: the audit found 17 byte-identical clones; this is NOT an 18th.
  if (
    inputRecord.runtimeEffect &&
    approvalEvaluatorCandidateNestedTrueClaim(
      inputRecord.runtimeEffect,
      (key) => CODE_MODE_ORCHESTRATION_UNSAFE_FIELDS.includes(key) ||
        key === "runtimeEnabled" ||
        key === "runtimeStarted" ||
        key === "runtimeReady" ||
        key === "runtimeCommandEnabled" ||
        key === "runtimeCommandExposureEnabled" ||
        key === "runtimeExecutionEnabled" ||
        key === "runtimeExecuted" ||
        key === "approvalGrantProduced" ||
        key === "approvalGrantPersisted" ||
        key === "approvalEvaluatorAuthoritative"
    )
  ) {
    return "nested_unsafe_flags_code_mode_orchestration_contract_boundary_map_input_rejected";
  }
  // Boundary entry validation (if provided)
  if (inputRecord.boundaryEntries !== undefined) {
    if (!Array.isArray(inputRecord.boundaryEntries)) {
      return "malformed_code_mode_orchestration_contract_boundary_map_input_rejected";
    }
    for (const entry of inputRecord.boundaryEntries) {
      if (!isPlainObjectRecord(entry)) {
        return "malformed_code_mode_orchestration_contract_boundary_map_input_rejected";
      }
      // Check for unknown boundary family
      if (entry.boundaryFamily !== undefined && !CODE_MODE_ORCHESTRATION_BOUNDARY_FAMILIES.includes(entry.boundaryFamily)) {
        return "unknown_boundary_family_code_mode_orchestration_contract_boundary_map_input_rejected";
      }
      // Check for unknown related system
      if (entry.relatedSystem !== undefined && !CODE_MODE_ORCHESTRATION_RELATED_SYSTEMS.includes(entry.relatedSystem)) {
        return "unknown_related_system_code_mode_orchestration_contract_boundary_map_input_rejected";
      }
      // Check for unknown current status
      if (entry.currentStatus !== undefined && !CODE_MODE_ORCHESTRATION_STATUSES.includes(entry.currentStatus)) {
        return "unknown_current_status_code_mode_orchestration_contract_boundary_map_input_rejected";
      }
      // Check boundary entry authorization flags
      if (entry.explicitBlockedAuthorizationFlags && typeof entry.explicitBlockedAuthorizationFlags === "object") {
        for (const authFlag of CODE_MODE_ORCHESTRATION_AUTHORIZATION_FIELDS) {
          if (entry.explicitBlockedAuthorizationFlags[authFlag] === true) {
            return "authorization_flags_enabled_code_mode_orchestration_contract_boundary_map_input_rejected";
          }
        }
      }
      // Check boundary entry unsafe runtime flags
      if (entry.unsafeCodeModeOrchestrationRuntimeFlags && typeof entry.unsafeCodeModeOrchestrationRuntimeFlags === "object") {
        for (const unsafeFlag of CODE_MODE_ORCHESTRATION_UNSAFE_FIELDS) {
          if (entry.unsafeCodeModeOrchestrationRuntimeFlags[unsafeFlag] === true) {
            return "unsafe_code_mode_orchestration_runtime_flags_code_mode_orchestration_contract_boundary_map_input_rejected";
          }
        }
      }
      // Check boundary entry required fields
      if (entry.boundaryId !== undefined && entry.boundaryId !== null) {
        // Noncanonical boundary ID check — must match a canonical phase5-77.* ID
        const canonicalIds = codeModeOrchestrationBoundaryEntries().map((e) => e.boundaryId);
        if (typeof entry.boundaryId === "string" && !canonicalIds.includes(entry.boundaryId)) {
          return "noncanonical_code_mode_orchestration_contract_boundary_map_input_rejected";
        }
      }
      // Judge-produces-own-candidate invariant: judgeComparisonRuntime with judgeProducedCandidate=true
      if (entry.judgeComparisonRuntime && typeof entry.judgeComparisonRuntime === "object" && entry.judgeComparisonRuntime.judgeProducedCandidate === true) {
        return "judge_produces_own_candidate_code_mode_orchestration_contract_boundary_map_input_rejected";
      }
      // External-agent default-allow invariant
      if (entry.subagentSpawnRuntime && typeof entry.subagentSpawnRuntime === "object" && entry.subagentSpawnRuntime.externalAgentDefaultAllow === true) {
        return "external_agent_default_allow_code_mode_orchestration_contract_boundary_map_input_rejected";
      }
      // Front-desk-with-approval-authority invariant
      if (entry.frontDeskRuntime && typeof entry.frontDeskRuntime === "object" && entry.frontDeskRuntime.approvalAuthority === true) {
        return "front_desk_with_approval_authority_code_mode_orchestration_contract_boundary_map_input_rejected";
      }
    }
  }
  return VALID_CODE_MODE_ORCHESTRATION_BOUNDARY_MAP_CLASSIFICATION;
}

function codeModeOrchestrationAuthorizationFlags() {
  return Object.fromEntries(
    CODE_MODE_ORCHESTRATION_AUTHORIZATION_FIELDS.map((f) => [f, false])
  );
}

function codeModeOrchestrationUnsafeRuntimeFlags() {
  return Object.fromEntries(
    CODE_MODE_ORCHESTRATION_UNSAFE_FIELDS.map((f) => [f, false])
  );
}

function codeModeOrchestrationRuntimeEffect() {
  return {
    runtimeEnabled: false,
    runtimeStarted: false,
    runtimeReady: false,
    runtimeCommandEnabled: false,
    runtimeCommandExposureEnabled: false,
    runtimeExecutionEnabled: false,
    runtimeExecuted: false,
    approvalGrantProduced: false,
    approvalGrantPersisted: false,
    approvalEvaluatorAuthoritative: false
  };
}

function codeModeOrchestrationBoundaryEntries() {
  const authFlags = codeModeOrchestrationAuthorizationFlags();
  const unsafeFlags = codeModeOrchestrationUnsafeRuntimeFlags();
  const runtimeEffect = codeModeOrchestrationRuntimeEffect();
  const baseEntry = {
    explicitBlockedAuthorizationFlags: authFlags,
    unsafeCodeModeOrchestrationRuntimeFlags: unsafeFlags,
    runtimeEffect,
    nonAuthorizingProof: true,
    codeModeOrchestrationBoundaryMetadataOnly: true,
    noLiveCodeModeOrchestrationRuntimePerformed: true
  };
  return [
    {
      boundaryId: "phase5-77.ardyn.orchestrator_plan_contract",
      boundaryFamily: "orchestrator_plan_contract",
      relatedSystem: "ardyn",
      currentStatus: "blocked",
      allowedCurrentBehavior: [
        "Record the required plan contract shape for future Code Mode orchestration.",
        "Reference createTaskPlan and schemas/task.schema.json as the plan-contract anchor.",
        "Document that a plan is itself a review artifact."
      ],
      forbiddenCurrentBehavior: [
        "Execute a plan against any runtime.",
        "Make model API calls to decompose or plan.",
        "Spawn subagents to implement plan steps."
      ],
      requiredFutureContractBeforeImplementation: [
        "Plan schema with goal, decomposition[], roleAssignments[], perStepBudgets[], expectedArtifacts[], humanApprovalCheckpoints[]",
        "Plan extends createTaskPlan/task.schema.json",
        "Budgets (tokens/calls/wall-clock) as required fields using 5.64 vocabulary"
      ],
      requiredFutureAuthorizationPhaseBeforeRuntime:
        "phase-6.x-code-mode-runtime-authorization",
      contractShape: {
        goal: "string (required, minLength 1)",
        decomposition: "array of step objects (required, minItems 1)",
        roleAssignments: "array of role-assignment objects (required)",
        perStepBudgets: "array of budget objects (required, 5.64 vocabulary)",
        expectedArtifacts: "array of artifact descriptors (required)",
        humanApprovalCheckpoints: "array of checkpoint descriptors (required)"
      },
      crossPhaseReferences: [
        "5.68 (profile/fusion/front-desk capability boundaries)",
        "createTaskPlan (plan-contract anchor)",
        "schemas/task.schema.json",
        "5.64 (budget vocabulary)"
      ],
      ...baseEntry
    },
    {
      boundaryId: "phase5-77.ardyn.subagent_spawn_role_contract",
      boundaryFamily: "subagent_spawn_role_contract",
      relatedSystem: "ardyn",
      currentStatus: "blocked",
      allowedCurrentBehavior: [
        "Record the required subagent spawn contract shape.",
        "Reference 5.68 profiles for role definitions."
      ],
      forbiddenCurrentBehavior: [
        "Spawn subagent processes.",
        "Allow external agents without explicit human-request flag.",
        "Grant capabilities beyond the orchestrator's own grant."
      ],
      requiredFutureContractBeforeImplementation: [
        "Roles: planner, implementer, tester, reviewer, judge, front-desk, coordinator (reuse 5.68 profiles)",
        "Per-role capability manifest MUST be subset of orchestrator grant (subagentCapabilitiesSubsetOfParent)",
        "Spawn-depth cap",
        "Per-subagent identity/attribution per docs/harness-identity.md",
        "External agents DEFAULT-DENY, invitable only via explicit human-request flag"
      ],
      requiredFutureAuthorizationPhaseBeforeRuntime:
        "phase-6.x-code-mode-runtime-authorization",
      contractShape: {
        role: "string enum (required)",
        capabilityManifest: "object subset of parent grant (required)",
        spawnDepth: "integer cap (required)",
        identityLabel: "string (required)",
        attributionRecord: "object (required)",
        externalAgentInvite: "boolean default false (required, default-deny)"
      },
      crossPhaseReferences: [
        "5.68 (profiles)",
        "5.62 (permissions)",
        "docs/harness-identity.md",
        "5.60 (inter-agent handoff provenance)"
      ],
      ...baseEntry
    },
    {
      boundaryId: "phase5-77.ardyn.fusion_pass_contract",
      boundaryFamily: "fusion_pass_contract",
      relatedSystem: "ardyn",
      currentStatus: "blocked",
      allowedCurrentBehavior: [
        "Record the optional mini-fusion contract shape.",
        "Document deterministic merge requirements."
      ],
      forbiddenCurrentBehavior: [
        "Execute a fusion pass.",
        "Merge candidates non-deterministically.",
        "Produce output without citing contributing candidates."
      ],
      requiredFutureContractBeforeImplementation: [
        "Candidate provenance IDs",
        "Deterministic merge requirements",
        "candidateCountCap (integer)",
        "Output cites contributing candidates"
      ],
      requiredFutureAuthorizationPhaseBeforeRuntime:
        "phase-6.x-code-mode-runtime-authorization",
      contractShape: {
        candidateProvenanceIds: "array of strings (required)",
        mergeRequirements: "object (required, deterministic)",
        candidateCountCap: "integer (required)",
        outputCitesCandidates: "boolean true (required)"
      },
      crossPhaseReferences: [
        "5.68 (fusion capability boundary)",
        "5.60 (provenance)"
      ],
      ...baseEntry
    },
    {
      boundaryId: "phase5-77.ardyn.judge_comparison_contract",
      boundaryFamily: "judge_comparison_contract",
      relatedSystem: "ardyn",
      currentStatus: "blocked",
      allowedCurrentBehavior: [
        "Record the judge comparison contract shape.",
        "Document pseudonymization and isolation requirements."
      ],
      forbiddenCurrentBehavior: [
        "Execute a judge comparison.",
        "Allow judge to score a candidate it produced.",
        "Produce verdicts without mandatory evidence field."
      ],
      requiredFutureContractBeforeImplementation: [
        "judgeContextIsolatedFromProducers: true",
        "Candidate pseudonymization enabled",
        "Judge never scores a candidate it produced",
        "Structured per-criterion verdict with mandatory evidence field",
        "Tie-break + escalate-to-human",
        "Judge identity + model recorded"
      ],
      requiredFutureAuthorizationPhaseBeforeRuntime:
        "phase-6.x-code-mode-runtime-authorization",
      contractShape: {
        judgeContextIsolatedFromProducers: "boolean true (required)",
        pseudonymizationEnabled: "boolean true (required)",
        judgeNeverScoresOwnCandidate: "boolean true (required)",
        perCriterionVerdicts: "array with mandatory evidence field (required)",
        tieBreakAndEscalateToHuman: "object (required)",
        judgeIdentity: "string (required)",
        judgeModel: "string (required)"
      },
      crossPhaseReferences: [
        "5.68 (fusion capability boundary)",
        "5.18-5.31 (evaluator vocabulary)"
      ],
      ...baseEntry
    },
    {
      boundaryId: "phase5-77.ardyn.synthesis_result_contract",
      boundaryFamily: "synthesis_result_contract",
      relatedSystem: "ardyn",
      currentStatus: "blocked",
      allowedCurrentBehavior: [
        "Record the synthesis result contract shape.",
        "Reference session-event/session-transcript schemas."
      ],
      forbiddenCurrentBehavior: [
        "Execute synthesis.",
        "Drop dissent without carrying it forward.",
        "Produce final output without referencing contributing artifacts."
      ],
      requiredFutureContractBeforeImplementation: [
        "Final output references contributing artifacts",
        "dissentCarriedForward + overruled objections enumerated",
        "Maps onto session-event/session-transcript schemas"
      ],
      requiredFutureAuthorizationPhaseBeforeRuntime:
        "phase-6.x-code-mode-runtime-authorization",
      contractShape: {
        contributingArtifactIds: "array of strings (required)",
        dissentCarriedForward: "boolean (required)",
        overruledObjections: "array (required, enumerated)",
        sessionEventSchema: "string (required)",
        sessionTranscriptSchema: "string (required)"
      },
      crossPhaseReferences: [
        "4.1D (transcript persistence)",
        "5.60 (provenance)",
        "5.65 (audit)"
      ],
      ...baseEntry
    },
    {
      boundaryId: "phase5-77.ardyn.front_desk_contract",
      boundaryFamily: "front_desk_contract",
      relatedSystem: "ardyn",
      currentStatus: "blocked",
      allowedCurrentBehavior: [
        "Record the front-desk responder contract shape.",
        "Reference 5.70 busy-state and cancellation semantics."
      ],
      forbiddenCurrentBehavior: [
        "Run a front-desk responder.",
        "Grant spawn or approval authority to the front desk.",
        "Make commitments about in-flight work.",
        "Omit staleness disclosure."
      ],
      requiredFutureContractBeforeImplementation: [
        "Busy-scope allowlist/denylist",
        "Every answer carries stateSnapshotSequence + staleness disclosure",
        "Zero spawn authority, zero approval authority",
        "No commitments about in-flight work",
        "Mandatory hand-back event"
      ],
      requiredFutureAuthorizationPhaseBeforeRuntime:
        "phase-6.x-code-mode-runtime-authorization",
      contractShape: {
        busyScopeAllowlist: "array (required)",
        busyScopeDenylist: "array (required)",
        stateSnapshotSequence: "integer (required, per-answer)",
        stalenessDisclosure: "string (required, per-answer)",
        spawnAuthority: "boolean false (required, invariant)",
        approvalAuthority: "boolean false (required, invariant)",
        handBackEvent: "object (required)"
      },
      crossPhaseReferences: [
        "5.68 (front-desk capability boundary)",
        "5.70 (busy-state, cancellation, leases)"
      ],
      ...baseEntry
    },
    {
      boundaryId: "phase5-77.ardyn.toolkit_check_selection_contract",
      boundaryFamily: "toolkit_check_selection_contract",
      relatedSystem: "ardyn",
      currentStatus: "blocked",
      allowedCurrentBehavior: [
        "Record the toolkit selection contract shape.",
        "Document relevance-based selection rationale."
      ],
      forbiddenCurrentBehavior: [
        "Invoke toolkit checks.",
        "Select all tools every time.",
        "Run Fallow Runtime (Fallow advisory only)."
      ],
      requiredFutureContractBeforeImplementation: [
        "Relevance-based selection of installed toolkit checks",
        "Recorded rationale per selection ('not every tool every time')",
        "Fallow advisory only, never Fallow Runtime"
      ],
      requiredFutureAuthorizationPhaseBeforeRuntime:
        "phase-6.x-code-mode-runtime-authorization",
      contractShape: {
        selectionMode: "string 'relevance-based' (required)",
        recordedRationale: "string (required, per-selection)",
        allToolsEveryTime: "boolean false (required, invariant)",
        fallowMode: "string 'advisory' (required, never 'runtime')"
      },
      crossPhaseReferences: [
        "5.71 (code_mode_governance, toolkit evidence, no polling/no-op subagents)"
      ],
      ...baseEntry
    },
    {
      boundaryId: "phase5-77.ardyn.loop_semantics_contract",
      boundaryFamily: "loop_semantics_contract",
      relatedSystem: "ardyn",
      currentStatus: "blocked",
      allowedCurrentBehavior: [
        "Record the loop semantics contract shape.",
        "Document maxIterationsPerLoop as a required field.",
        "Reference no-progress and budget-exhaustion rules."
      ],
      forbiddenCurrentBehavior: [
        "Execute a loop runtime.",
        "Accept a plan without maxIterationsPerLoop.",
        "Continue after identical failure signature twice."
      ],
      requiredFutureContractBeforeImplementation: [
        "Loop: plan->implement->test->fix->review",
        "maxIterationsPerLoop REQUIRED (input without it rejected)",
        "No-progress rule (identical failure signature twice -> abort/escalate)",
        "loop_budget_exhausted as first-class terminal classification",
        "Per-iteration checkpoint for cancellation (5.70)"
      ],
      requiredFutureAuthorizationPhaseBeforeRuntime:
        "phase-6.x-code-mode-runtime-authorization",
      contractShape: {
        loopPhases: "array ['plan','implement','test','fix','review'] (required)",
        maxIterationsPerLoop: "integer >= 1 (REQUIRED, absence is rejection)",
        noProgressRule: "object (required, identical-failure-signature-twice)",
        loopBudgetExhaustedClassification: "string (required, first-class)",
        perIterationCheckpoint: "object (required, 5.70 cancellation)"
      },
      crossPhaseReferences: [
        "5.70 (cancellation)",
        "5.64 (budget vocabulary)",
        "4.1E (failure/kill semantics)"
      ],
      ...baseEntry
    },
    {
      boundaryId: "phase5-77.ardyn.failure_abort_contract",
      boundaryFamily: "failure_abort_contract",
      relatedSystem: "ardyn",
      currentStatus: "blocked",
      allowedCurrentBehavior: [
        "Record the failure/abort contract shape.",
        "Reference 4.1E failure-audit/kill semantics."
      ],
      forbiddenCurrentBehavior: [
        "Execute abort handlers.",
        "Suppress partial-result disclosure."
      ],
      requiredFutureContractBeforeImplementation: [
        "Abort/partial-result semantics aligned with 4.1E failure-audit/kill semantics",
        "Partial results returned with explicit exhausted/aborted classification"
      ],
      requiredFutureAuthorizationPhaseBeforeRuntime:
        "phase-6.x-code-mode-runtime-authorization",
      contractShape: {
        abortSemantics: "object (required, aligned with 4.1E)",
        partialResultDisclosure: "boolean true (required)",
        exhaustedClassification: "string (required)",
        abortedClassification: "string (required)"
      },
      crossPhaseReferences: [
        "4.1E (failure/kill semantics)",
        "5.65 (audit)"
      ],
      ...baseEntry
    },
    {
      boundaryId: "phase5-77.ardyn.audit_transcript_contract",
      boundaryFamily: "audit_transcript_contract",
      relatedSystem: "ardyn",
      currentStatus: "blocked",
      allowedCurrentBehavior: [
        "Record the audit/transcript contract shape.",
        "Reference 4.1C redaction and 4.1D persistence."
      ],
      forbiddenCurrentBehavior: [
        "Emit audit events to a live runtime.",
        "Transmit payloads without provenance labels.",
        "Persist unredacted transcripts."
      ],
      requiredFutureContractBeforeImplementation: [
        "Every spawn/verdict/fusion/synthesis/hand-back emits session events",
        "Redaction per 4.1C",
        "Persistence per 4.1D",
        "Provenance labels required on all inter-role payloads (cross-ref 5.60)"
      ],
      requiredFutureAuthorizationPhaseBeforeRuntime:
        "phase-6.x-code-mode-runtime-authorization",
      contractShape: {
        sessionEvents: "array (required, every spawn/verdict/fusion/synthesis/hand-back)",
        redactionPolicy: "object (required, 4.1C)",
        persistencePolicy: "object (required, 4.1D)",
        provenanceLabels: "array (required, on all inter-role payloads)"
      },
      crossPhaseReferences: [
        "4.1C (redaction)",
        "4.1D (transcript persistence)",
        "5.60 (inter-agent handoff provenance)",
        "5.65 (audit)"
      ],
      ...baseEntry
    },
    {
      boundaryId: "phase5-77.ardyn.human_approval_gate_contract",
      boundaryFamily: "human_approval_gate_contract",
      relatedSystem: "ardyn",
      currentStatus: "blocked",
      allowedCurrentBehavior: [
        "Record the human-approval gate contract shape.",
        "Reference 5.18-5.31 evaluator vocabulary."
      ],
      forbiddenCurrentBehavior: [
        "Bypass human approval for plan release.",
        "Bypass human approval for privilege escalation.",
        "Bypass human approval for external-agent invite.",
        "Bypass human approval for final output."
      ],
      requiredFutureContractBeforeImplementation: [
        "Plan release requires human approval",
        "Privilege escalation requires human approval",
        "External-agent invite requires human approval",
        "Final output requires human approval",
        "Reusing 5.18-5.31 evaluator vocabulary"
      ],
      requiredFutureAuthorizationPhaseBeforeRuntime:
        "phase-6.x-code-mode-runtime-authorization",
      contractShape: {
        planReleaseApproval: "object (required, 5.18-5.31 vocabulary)",
        privilegeEscalationApproval: "object (required)",
        externalAgentInviteApproval: "object (required)",
        finalOutputApproval: "object (required)",
        evaluatorVocabulary: "string '5.18-5.31' (required)"
      },
      crossPhaseReferences: [
        "5.18-5.31 (evaluator vocabulary for approval gates)",
        "5.62 (permissions)"
      ],
      ...baseEntry
    },
    {
      boundaryId: "phase5-77.ardyn.code_mode_blocked_runtime_list",
      boundaryFamily: "code_mode_blocked_runtime_list",
      relatedSystem: "ardyn-subagent",
      currentStatus: "blocked",
      allowedCurrentBehavior: [
        "Record the complete list of blocked runtime surfaces for Code Mode.",
        "Reference docs/posture.md for the fabric federation carve-out."
      ],
      forbiddenCurrentBehavior: [
        "Make model API calls.",
        "Spawn subagent processes.",
        "Run a front-desk responder.",
        "Execute judge/fusion.",
        "Execute a loop runtime.",
        "Invoke toolkit checks.",
        "Invoke the fabric federation client (Code Mode may not use it)."
      ],
      requiredFutureContractBeforeImplementation: [
        "No model API calls",
        "No subagent processes",
        "No front-desk responder",
        "No judge/fusion execution",
        "No loop runtime",
        "No toolkit invocation",
        "Standard backend/DB/Matrix/shell/SQLite blocks (cross-referenced to owning phases)",
        "Fabric federation: reference docs/posture.md carve-out (Code Mode may not invoke it; do NOT assert blanket 'no fabric transport')"
      ],
      requiredFutureAuthorizationPhaseBeforeRuntime:
        "phase-6.x-code-mode-runtime-authorization",
      contractShape: {
        blockedSurfaces: "array of strings (required)",
        fabricFederationCarveOut: "string 'docs/posture.md' (required, reference not re-block)",
        noBlanketFabricTransportClaim: "boolean true (required, invariant)"
      },
      crossPhaseReferences: [
        "5.61 (database storage)",
        "5.63 (RLS)",
        "5.65 (audit)",
        "5.73 (Matrix/external gateway)",
        "5.74 (command surface/shell)",
        "5.76 (embedded DB/query engine)",
        "docs/posture.md (fabric federation carve-out)",
        "5.72 (credential custody)"
      ],
      ...baseEntry
    }
  ];
}

function codeModeOrchestrationBoundaryMapSummary(entries) {
  const families = CODE_MODE_ORCHESTRATION_BOUNDARY_FAMILIES;
  const systems = CODE_MODE_ORCHESTRATION_RELATED_SYSTEMS;
  const statuses = CODE_MODE_ORCHESTRATION_STATUSES;
  const countByFamily = {};
  const countByRelatedSystem = {};
  const countByStatus = {};
  for (const family of families) countByFamily[family] = 0;
  for (const system of systems) countByRelatedSystem[system] = 0;
  for (const status of statuses) countByStatus[status] = 0;
  for (const entry of entries) {
    countByFamily[entry.boundaryFamily] = (countByFamily[entry.boundaryFamily] || 0) + 1;
    countByRelatedSystem[entry.relatedSystem] = (countByRelatedSystem[entry.relatedSystem] || 0) + 1;
    countByStatus[entry.currentStatus] = (countByStatus[entry.currentStatus] || 0) + 1;
  }
  return {
    boundaryEntryCount: entries.length,
    boundaryFamilies: families,
    relatedSystems: systems,
    currentStatusValues: statuses,
    countByFamily,
    countByRelatedSystem,
    countByStatus,
    orchestratorPlanContractRecorded: true,
    subagentSpawnRoleContractRecorded: true,
    fusionPassContractRecorded: true,
    judgeComparisonContractRecorded: true,
    synthesisResultContractRecorded: true,
    frontDeskContractRecorded: true,
    toolkitCheckSelectionContractRecorded: true,
    loopSemanticsContractRecorded: true,
    failureAbortContractRecorded: true,
    auditTranscriptContractRecorded: true,
    humanApprovalGateContractRecorded: true,
    codeModeBlockedRuntimeListRecorded: true,
    noModelApiCalls: true,
    noSubagentProcesses: true,
    noFrontDeskResponder: true,
    noJudgeFusionExecution: true,
    noLoopRuntime: true,
    noToolkitInvocation: true,
    maxIterationsPerLoopRequired: true,
    judgeContextIsolatedFromProducers: true,
    externalAgentDefaultDeny: true,
    frontDeskZeroApprovalAuthority: true,
    fabricFederationCarveOutReferenced: true,
    noBlanketFabricTransportClaim: true,
    allBlockedAuthorizationFlagsFalse: true,
    allUnsafeCodeModeOrchestrationRuntimeFlagsFalse: true,
    allRuntimeEffectsFalse: true,
    allEntriesNonAuthorizing: true
  };
}

function codeModeOrchestrationFalseRuntimeFields() {
  const fields = {};
  for (const flag of CODE_MODE_ORCHESTRATION_UNSAFE_FIELDS) {
    fields[flag] = false;
  }
  for (const flag of CODE_MODE_ORCHESTRATION_AUTHORIZATION_FIELDS) {
    fields[flag] = false;
  }
  return fields;
}

function codeModeOrchestrationResult({
  reviewedAt,
  reviewedAtDefaulted,
  classification,
  accepted,
  boundaryEntries
}) {
  const summary = accepted
    ? codeModeOrchestrationBoundaryMapSummary(boundaryEntries)
    : null;
  return {
    schema: CODE_MODE_ORCHESTRATION_BOUNDARY_MAP_SCHEMA,
    schemaVersion: CODE_MODE_ORCHESTRATION_BOUNDARY_MAP_VERSION,
    codeModeOrchestrationKind: CODE_MODE_ORCHESTRATION_BOUNDARY_MAP_KIND,
    codeModeOrchestrationMode: "review-only",
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    codeModeOrchestrationBoundaryMapProduced: accepted,
    boundaryEntries: accepted ? boundaryEntries : [],
    boundaryMapSummary: summary,
    recommendedNextPhase: accepted
      ? "phase-5.78-review-only-ci-enforcement-contract-boundary-map"
      : null,
    codeModeOrchestrationOnly: true,
    reviewOnly: true,
    metadataOnly: true,
    authoritative: false,
    nonAuthorizingProof: true,
    reportRunsChecks: false,
    ...(accepted ? {} : codeModeOrchestrationFalseRuntimeFields()),
    rejectionReasons: accepted ? [] : [
      {
        classification,
        rejected: true,
        runtimeAuthorized: false,
        reportRunsChecks: false
      }
    ],
    runtimeEffect: {
      runtimeEnabled: false,
      runtimeStarted: false,
      runtimeReady: false,
      runtimeCommandEnabled: false,
      runtimeCommandExposureEnabled: false,
      runtimeExecutionEnabled: false,
      runtimeExecuted: false,
      approvalGrantProduced: false,
      approvalGrantPersisted: false,
      approvalEvaluatorAuthoritative: false
    }
  };
}

export function createCodeModeOrchestrationForReview(input = {}) {
  const inputRecord = codeModeOrchestrationInputRecord(input);
  const reviewedAt = codeModeOrchestrationReviewedAt(inputRecord);
  const reviewedAtDefaulted = isReviewedAtDefaulted(inputRecord);
  const classification =
    codeModeOrchestrationClassification(inputRecord);
  const accepted =
    classification === VALID_CODE_MODE_ORCHESTRATION_BOUNDARY_MAP_CLASSIFICATION;
  const boundaryEntries = accepted
    ? codeModeOrchestrationBoundaryEntries()
    : [];

  return codeModeOrchestrationResult({
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    accepted,
    boundaryEntries
  });
}

// ─── Phase 5.78: CI enforcement contract boundary map ────────────────────────
// ponytail: 8 boundary families for CI enforcement contract shapes.
// Reuses MALFORMED_INPUT (line 69510), isPlainObjectRecord (line 3945),
// approvalEvaluatorCandidateNestedTrueClaim (line 8163) — no new clones.

export const CI_ENFORCEMENT_CONTRACT_BOUNDARY_MAP_SCHEMA =
  "ardyn.phase-5.78.ci-enforcement-contract-boundary-map-result";
export const CI_ENFORCEMENT_CONTRACT_BOUNDARY_MAP_VERSION = "0.1.0";
export const CI_ENFORCEMENT_CONTRACT_BOUNDARY_MAP_KIND =
  "ci-enforcement-contract-boundary-map";
export const VALID_CI_ENFORCEMENT_CONTRACT_BOUNDARY_MAP_CLASSIFICATION =
  "valid_ci_enforcement_contract_boundary_map_runtime_still_blocked";

const CI_ENFORCEMENT_CONTRACT_BOUNDARY_FAMILIES = Object.freeze([
  "ci_workflow_scope",
  "ci_job_matrix",
  "security_workflow_scope",
  "test_invocation_portability",
  "ci_offline_hermetic_guarantee",
  "ci_forbidden_behavior",
  "branch_protection_expectation",
  "ci_enablement_authorization"
]);

const CI_ENFORCEMENT_CONTRACT_RELATED_SYSTEMS = Object.freeze([
  "ardyn",
  "ardyn-subagent",
  "github-actions"
]);

const CI_ENFORCEMENT_CONTRACT_STATUSES = Object.freeze([
  "blocked",
  "future_contract_required"
]);

const CI_ENFORCEMENT_CONTRACT_UNSAFE_FIELDS = Object.freeze([
  "runtimeExecutionEnabled",
  "runtimeAuthorizationEnabled",
  "runtimeCommandEnabled",
  "commandExposureEnabled",
  "commandsExposed",
  "connectorGrantProduced",
  "ciRuntimeEnabled",
  "ciExecutionEnabled",
  "workflowExecutionEnabled",
  "ciPublishedArtifacts",
  "ciDeployEnabled",
  "ciWriteToRepoEnabled",
  "ciSecretUsed",
  "ciTokenMinted",
  "ciAutoMergeEnabled",
  "semgrepGateEnabled",
  "fabricSecretInCiEnabled",
  "fabricSidecarContactEnabled",
  "shellRuntimeEnabled",
  "sqliteRuntimeEnabled",
  "embeddedDbReaderEnabled",
  "databaseClientImplemented",
  "matrixClientRuntimeEnabled",
  "externalGatewayRuntimeEnabled",
  "fabricCoreTransportRuntimeEnabled",
  "fabricRuntimeImplementedByArdyn",
  "secureDropImplemented",
  "secureDropDecryptionEnabled",
  "filesystemAccessEnabled",
  "filesystemReadEnabled",
  "filesystemWriteEnabled",
  "backendRuntimeImplementedByArdyn",
  "backendApiServerMiddlewareImplemented",
  "apiEndpointImplementedByArdyn",
  "serverImplementedByArdyn",
  "processSpawnEnabled",
  "processControlEnabled",
  "blockedCliBypassEnabled"
]);

const CI_ENFORCEMENT_CONTRACT_KNOWN_KEYS = Object.freeze(new Set([
  "reviewedAt",
  "boundaryEntries",
  "reportRunsChecks",
  "authorizesRuntime",
  "ciSecrets",
  "ciWritePermissions",
  "extraWorkflow",
  "semgrepAsGate",
  "fabricSecretInCi",
  "fabricSidecarContact",
  "ciRuntime",
  "ciExecution",
  "workflowExecution",
  "ciPublish",
  "ciDeploy",
  "ciWriteToRepo",
  "ciTokenMint",
  "ciAutoMerge",
  "shellRuntime",
  "sqliteRuntime",
  "matrixClientRuntime",
  "fabricCoreTransportRuntime",
  "secureDropRuntime",
  "apiKey",
  "connectorGrant",
  "filesystemRead",
  "filesystemWrite",
  "envReader",
  "commandExposureEnabled",
  "blockedCliBypassEnabled",
  "runtimeEffect",
  // ponytail: unsafe runtime flags are known keys so the classifier can test
  // them as unsafe rather than rejecting them as unknown top-level fields.
  ...CI_ENFORCEMENT_CONTRACT_UNSAFE_FIELDS
]));

const CI_ENFORCEMENT_CONTRACT_AUTHORIZATION_FIELDS = Object.freeze([
  "runtimeAuthorized",
  "authorizesRuntime",
  "ciExecutionAuthorizationGranted",
  "workflowFileCreationAuthorizationGranted",
  "ciPublishAuthorizationGranted",
  "ciDeployAuthorizationGranted",
  "ciWriteToRepoAuthorizationGranted",
  "ciSecretUseAuthorizationGranted",
  "ciTokenMintAuthorizationGranted",
  "ciAutoMergeAuthorizationGranted",
  "semgrepGateAuthorizationGranted",
  "fabricSecretInCiAuthorizationGranted",
  "commandExposureAuthorizationGranted",
  "approvalDecisionProduced",
  "approvalGrantProduced"
]);

const CI_ENFORCEMENT_CONTRACT_HIDDEN_FIELD_GROUPS = Object.freeze([
  {
    classification:
      "hidden_ci_runtime_semantics_ci_enforcement_contract_boundary_map_input_rejected",
    fields: ["ciRuntime", "ciExecution", "workflowExecution"]
  },
  {
    classification:
      "hidden_ci_publish_deploy_semantics_ci_enforcement_contract_boundary_map_input_rejected",
    fields: ["ciPublish", "ciDeploy", "ciWriteToRepo"]
  },
  {
    classification:
      "hidden_ci_secret_token_semantics_ci_enforcement_contract_boundary_map_input_rejected",
    fields: ["ciSecrets", "ciTokenMint", "ciSecretUse"]
  },
  {
    classification:
      "hidden_shell_command_runtime_semantics_ci_enforcement_contract_boundary_map_input_rejected",
    fields: ["shellRuntime", "shellCommand", "commandExecution"]
  },
  {
    classification:
      "hidden_sqlite_embedded_db_query_runtime_semantics_ci_enforcement_contract_boundary_map_input_rejected",
    fields: ["sqliteRuntime", "embeddedDbRuntime", "databaseRuntime"]
  },
  {
    classification:
      "hidden_matrix_gateway_runtime_semantics_ci_enforcement_contract_boundary_map_input_rejected",
    fields: ["matrixClientRuntime", "matrixGateway", "externalGateway"]
  },
  {
    classification:
      "hidden_fabric_core_transport_runtime_semantics_ci_enforcement_contract_boundary_map_input_rejected",
    fields: ["fabricCoreTransportRuntime", "fabricTransport", "contentAddressedTransport"]
  },
  {
    classification:
      "hidden_secure_drop_implementation_semantics_ci_enforcement_contract_boundary_map_input_rejected",
    fields: ["secureDropRuntime", "secureDropImplementation", "secureDropDecrypt"]
  },
  {
    classification:
      "hidden_filesystem_access_semantics_ci_enforcement_contract_boundary_map_input_rejected",
    fields: ["filesystemRead", "filesystemWrite", "filesystemAccess"]
  },
  {
    classification:
      "hidden_auth_session_token_api_key_semantics_ci_enforcement_contract_boundary_map_input_rejected",
    fields: ["apiKey", "authToken", "sessionToken"]
  },
  {
    classification:
      "hidden_connector_grant_semantics_ci_enforcement_contract_boundary_map_input_rejected",
    fields: ["connectorGrant", "apiConnector", "integrationGrant"]
  },
  {
    classification:
      "hidden_env_secrets_exposure_semantics_ci_enforcement_contract_boundary_map_input_rejected",
    fields: ["envReader", "envSecrets", "secretReader"]
  }
]);

function ciEnforcementContractInputRecord(input) {
  if (input === null || typeof input !== "object" || Array.isArray(input)) {
    return MALFORMED_INPUT;
  }
  return input;
}

function ciEnforcementContractReviewedAt(inputRecord) {
  if (inputRecord === MALFORMED_INPUT) {
    return null;
  }
  const value = inputRecord.reviewedAt;
  if (value === undefined) {
    return "2026-07-06T00:00:00.000Z";
  }
  if (typeof value !== "string" || Number.isNaN(Date.parse(value))) {
    return null;
  }
  return value;
}

function ciEnforcementContractClassification(inputRecord) {
  const reviewedAt = ciEnforcementContractReviewedAt(inputRecord);
  const reviewedAtDefaulted = isReviewedAtDefaulted(inputRecord);
  if (reviewedAt === null) {
    return "malformed_ci_enforcement_contract_boundary_map_input_rejected";
  }
  if (inputRecord === MALFORMED_INPUT) {
    return "malformed_ci_enforcement_contract_boundary_map_input_rejected";
  }
  if (inputRecord.reportRunsChecks === true) {
    return "report_runs_checks_true_ci_enforcement_contract_boundary_map_input_rejected";
  }
  if (inputRecord.authorizesRuntime === true) {
    return "runtime_authorization_attempt_ci_enforcement_contract_boundary_map_input_rejected";
  }
  // CI-specific rejection cases
  if (inputRecord.ciSecrets && typeof inputRecord.ciSecrets === "object") {
    return "ci_with_secrets_ci_enforcement_contract_boundary_map_input_rejected";
  }
  if (inputRecord.ciWritePermissions === true) {
    return "ci_with_write_permissions_ci_enforcement_contract_boundary_map_input_rejected";
  }
  if (inputRecord.extraWorkflow && typeof inputRecord.extraWorkflow === "object") {
    return "extra_workflow_ci_enforcement_contract_boundary_map_input_rejected";
  }
  if (inputRecord.semgrepAsGate === true) {
    return "semgrep_as_gate_ci_enforcement_contract_boundary_map_input_rejected";
  }
  if (inputRecord.fabricSecretInCi === true) {
    return "fabric_secret_in_ci_ci_enforcement_contract_boundary_map_input_rejected";
  }
  if (inputRecord.fabricSidecarContact === true) {
    return "fabric_sidecar_contact_ci_enforcement_contract_boundary_map_input_rejected";
  }
  // Hidden runtime semantics — any object-valued hidden field is rejected
  for (const group of CI_ENFORCEMENT_CONTRACT_HIDDEN_FIELD_GROUPS) {
    for (const field of group.fields) {
      if (inputRecord[field] && typeof inputRecord[field] === "object") {
        return group.classification;
      }
    }
  }
  if (inputRecord.commandExposureEnabled === true) {
    return "command_exposure_attempt_ci_enforcement_contract_boundary_map_input_rejected";
  }
  if (inputRecord.blockedCliBypassEnabled === true) {
    return "blocked_cli_bypass_attempt_ci_enforcement_contract_boundary_map_input_rejected";
  }
  // Check for unknown top-level keys
  for (const key of Object.keys(inputRecord)) {
    if (!CI_ENFORCEMENT_CONTRACT_KNOWN_KEYS.has(key)) {
      return "unknown_top_level_field_ci_enforcement_contract_boundary_map_input_rejected";
    }
  }
  // Check unsafe runtime flags at top level
  for (const flag of CI_ENFORCEMENT_CONTRACT_UNSAFE_FIELDS) {
    if (inputRecord[flag] === true) {
      return "unsafe_ci_enforcement_runtime_flags_ci_enforcement_contract_boundary_map_input_rejected";
    }
  }
  // Nested unsafe flags — reuse the cycle-guarded nested-true-claim walker
  // (approvalEvaluatorCandidateNestedTrueClaim at index.mjs:8163), not a fresh clone.
  // ponytail: the audit found 17 byte-identical clones; this is NOT an 18th.
  if (
    inputRecord.runtimeEffect &&
    approvalEvaluatorCandidateNestedTrueClaim(
      inputRecord.runtimeEffect,
      (key) => CI_ENFORCEMENT_CONTRACT_UNSAFE_FIELDS.includes(key) ||
        key === "runtimeEnabled" ||
        key === "runtimeStarted" ||
        key === "runtimeReady" ||
        key === "runtimeCommandEnabled" ||
        key === "runtimeCommandExposureEnabled" ||
        key === "runtimeExecutionEnabled" ||
        key === "runtimeExecuted" ||
        key === "approvalGrantProduced" ||
        key === "approvalGrantPersisted" ||
        key === "approvalEvaluatorAuthoritative"
    )
  ) {
    return "nested_unsafe_flags_ci_enforcement_contract_boundary_map_input_rejected";
  }
  // Boundary entry validation (if provided)
  if (inputRecord.boundaryEntries !== undefined) {
    if (!Array.isArray(inputRecord.boundaryEntries)) {
      return "malformed_ci_enforcement_contract_boundary_map_input_rejected";
    }
    for (const entry of inputRecord.boundaryEntries) {
      if (!isPlainObjectRecord(entry)) {
        return "malformed_ci_enforcement_contract_boundary_map_input_rejected";
      }
      if (entry.boundaryFamily !== undefined && !CI_ENFORCEMENT_CONTRACT_BOUNDARY_FAMILIES.includes(entry.boundaryFamily)) {
        return "unknown_boundary_family_ci_enforcement_contract_boundary_map_input_rejected";
      }
      if (entry.relatedSystem !== undefined && !CI_ENFORCEMENT_CONTRACT_RELATED_SYSTEMS.includes(entry.relatedSystem)) {
        return "unknown_related_system_ci_enforcement_contract_boundary_map_input_rejected";
      }
      if (entry.currentStatus !== undefined && !CI_ENFORCEMENT_CONTRACT_STATUSES.includes(entry.currentStatus)) {
        return "unknown_current_status_ci_enforcement_contract_boundary_map_input_rejected";
      }
      if (entry.explicitBlockedAuthorizationFlags && typeof entry.explicitBlockedAuthorizationFlags === "object") {
        for (const authFlag of CI_ENFORCEMENT_CONTRACT_AUTHORIZATION_FIELDS) {
          if (entry.explicitBlockedAuthorizationFlags[authFlag] === true) {
            return "authorization_flags_enabled_ci_enforcement_contract_boundary_map_input_rejected";
          }
        }
      }
      if (entry.unsafeCiEnforcementRuntimeFlags && typeof entry.unsafeCiEnforcementRuntimeFlags === "object") {
        for (const unsafeFlag of CI_ENFORCEMENT_CONTRACT_UNSAFE_FIELDS) {
          if (entry.unsafeCiEnforcementRuntimeFlags[unsafeFlag] === true) {
            return "unsafe_ci_enforcement_runtime_flags_ci_enforcement_contract_boundary_map_input_rejected";
          }
        }
      }
      if (entry.boundaryId !== undefined && entry.boundaryId !== null) {
        const canonicalIds = ciEnforcementContractBoundaryEntries().map((e) => e.boundaryId);
        if (typeof entry.boundaryId === "string" && !canonicalIds.includes(entry.boundaryId)) {
          return "noncanonical_ci_enforcement_contract_boundary_map_input_rejected";
        }
      }
    }
  }
  return VALID_CI_ENFORCEMENT_CONTRACT_BOUNDARY_MAP_CLASSIFICATION;
}

function ciEnforcementContractAuthorizationFlags() {
  return Object.fromEntries(
    CI_ENFORCEMENT_CONTRACT_AUTHORIZATION_FIELDS.map((f) => [f, false])
  );
}

function ciEnforcementContractUnsafeRuntimeFlags() {
  return Object.fromEntries(
    CI_ENFORCEMENT_CONTRACT_UNSAFE_FIELDS.map((f) => [f, false])
  );
}

function ciEnforcementContractRuntimeEffect() {
  return {
    runtimeEnabled: false,
    runtimeStarted: false,
    runtimeReady: false,
    runtimeCommandEnabled: false,
    runtimeCommandExposureEnabled: false,
    runtimeExecutionEnabled: false,
    runtimeExecuted: false,
    approvalGrantProduced: false,
    approvalGrantPersisted: false,
    approvalEvaluatorAuthoritative: false
  };
}

function ciEnforcementContractBoundaryEntries() {
  const authFlags = ciEnforcementContractAuthorizationFlags();
  const unsafeFlags = ciEnforcementContractUnsafeRuntimeFlags();
  const runtimeEffect = ciEnforcementContractRuntimeEffect();
  const baseEntry = {
    explicitBlockedAuthorizationFlags: authFlags,
    unsafeCiEnforcementRuntimeFlags: unsafeFlags,
    runtimeEffect,
    nonAuthorizingProof: true,
    ciEnforcementContractBoundaryMetadataOnly: true,
    noLiveCiEnforcementRuntimePerformed: true
  };
  return [
    {
      boundaryId: "phase5-78.ardyn.ci_workflow_scope",
      boundaryFamily: "ci_workflow_scope",
      relatedSystem: "github-actions",
      currentStatus: "blocked",
      allowedCurrentBehavior: [
        "Record the required CI workflow scope contract.",
        "Document exactly two workflows: ci.yml and security.yml.",
        "Record allowed third-party actions pinned to exact versions."
      ],
      forbiddenCurrentBehavior: [
        "Create workflow files under .github/.",
        "Add triggers beyond push-to-main, pull_request, weekly schedule, and workflow_dispatch.",
        "Use secrets in CI workflows."
      ],
      requiredFutureContractBeforeImplementation: [
        "Exactly two workflows: ci.yml (push to main + pull_request; concurrency cancel-in-progress) and security.yml (weekly schedule + workflow_dispatch)",
        "permissions: contents: read",
        "No secrets",
        "Allowed third-party actions ONLY: actions/checkout, actions/setup-node, dtolnay/rust-toolchain, Swatinem/rust-cache — each pinned to exact version or commit SHA"
      ],
      requiredFutureAuthorizationPhaseBeforeRuntime: "phase-5.79-ci-enablement",
      contractShape: {
        workflowCount: "integer 2 (required)",
        workflows: "array [ci.yml, security.yml] (required)",
        triggers: "object (required: push, pull_request, schedule, workflow_dispatch only)",
        permissions: "object (required: contents: read)",
        secrets: "array (required: empty)",
        allowedActions: "array (required, pinned versions)"
      },
      crossPhaseReferences: [
        "5.48 area 7 (CI not asserted — this phase provides the contract)",
        "5.69 (CI modification forbidden — this phase authorizes 5.79 to lift)",
        "5.71 (same)"
      ],
      ...baseEntry
    },
    {
      boundaryId: "phase5-78.ardyn.ci_job_matrix",
      boundaryFamily: "ci_job_matrix",
      relatedSystem: "github-actions",
      currentStatus: "blocked",
      allowedCurrentBehavior: [
        "Record the required CI job matrix contract.",
        "Document three jobs: node, rust, node-windows."
      ],
      forbiddenCurrentBehavior: [
        "Execute CI jobs.",
        "Add jobs beyond node, rust, and node-windows.",
        "Omit the node-windows job (required for Windows hazard coverage)."
      ],
      requiredFutureContractBeforeImplementation: [
        "node job (ubuntu: npm ci; npm test; npm run report:phase-status smoke discarded to null)",
        "rust job (ubuntu: cargo fmt --check; cargo clippy --workspace --all-targets -- -D warnings; cargo test --workspace)",
        "node-windows job (windows-latest: npm ci; npm test) — included because development happens on Windows and the test-script glob has a known Windows/Node-20 expansion hazard"
      ],
      requiredFutureAuthorizationPhaseBeforeRuntime: "phase-5.79-ci-enablement",
      contractShape: {
        jobs: "array [node, rust, node-windows] (required)",
        nodeJob: "object (required: ubuntu, npm ci, npm test)",
        rustJob: "object (required: ubuntu, cargo fmt/clippy/test)",
        nodeWindowsJob: "object (required: windows-latest, npm ci, npm test)"
      },
      crossPhaseReferences: [
        "5.77 (Code Mode orchestration — CI runs these tests)",
        "5.76 (embedded DB/query engine — CI runs these tests)"
      ],
      ...baseEntry
    },
    {
      boundaryId: "phase5-78.ardyn.security_workflow_scope",
      boundaryFamily: "security_workflow_scope",
      relatedSystem: "github-actions",
      currentStatus: "blocked",
      allowedCurrentBehavior: [
        "Record the required security workflow scope contract.",
        "Document npm audit, cargo audit, and osv-scanner checks."
      ],
      forbiddenCurrentBehavior: [
        "Create security.yml.",
        "Run security scans as PR-blocking gates.",
        "Use secrets in security workflows."
      ],
      requiredFutureContractBeforeImplementation: [
        "npm audit --audit-level=high",
        "cargo audit",
        "osv-scanner over both lockfiles (package-lock.json and Cargo.lock)",
        "Cron-only, never blocking PRs"
      ],
      requiredFutureAuthorizationPhaseBeforeRuntime: "phase-5.79-ci-enablement",
      contractShape: {
        checks: "array [npm audit, cargo audit, osv-scanner] (required)",
        trigger: "string 'schedule' (required, cron-only)",
        blocksPRs: "boolean false (required, invariant)"
      },
      crossPhaseReferences: [
        "5.69 (testing frameworks quality gates)",
        "5.71 (maintenance governance)"
      ],
      ...baseEntry
    },
    {
      boundaryId: "phase5-78.ardyn.test_invocation_portability",
      boundaryFamily: "test_invocation_portability",
      relatedSystem: "ardyn",
      currentStatus: "blocked",
      allowedCurrentBehavior: [
        "Record the test invocation portability contract.",
        "Document the known Windows/Node-20 glob expansion hazard."
      ],
      forbiddenCurrentBehavior: [
        "Execute tests on CI.",
        "Accept non-portable test invocations.",
        "Ignore the Windows/Node-20 glob expansion hazard."
      ],
      requiredFutureContractBeforeImplementation: [
        "npm test invocation must run the identical test-file set on ubuntu and windows across the supported Node range",
        "Record current hazard: literal glob on Windows cmd + Node 20",
        "Require 5.79 to fix the hazard and update the report-test pinned package.json script strings in the same slice"
      ],
      requiredFutureAuthorizationPhaseBeforeRuntime: "phase-5.79-ci-enablement",
      contractShape: {
        portabilityRequirement: "string (required: identical test-file set on ubuntu+windows)",
        knownHazard: "string (required: Windows cmd + Node 20 glob expansion)",
        fixRequiredByPhase: "string 'phase-5.79' (required)"
      },
      crossPhaseReferences: [
        "5.69 (testing frameworks quality gates)",
        "tests/report-phase-status.test.mjs (pinned package.json script strings)"
      ],
      ...baseEntry
    },
    {
      boundaryId: "phase5-78.ardyn.ci_offline_hermetic_guarantee",
      boundaryFamily: "ci_offline_hermetic_guarantee",
      relatedSystem: "ardyn",
      currentStatus: "blocked",
      allowedCurrentBehavior: [
        "Record the CI offline hermetic guarantee contract.",
        "Document that fabric federation tests are hermetic (inject fetchImpl, fake tokens, loopback URLs)."
      ],
      forbiddenCurrentBehavior: [
        "Set or provide ARDYN_FABRIC_* / FABRIC_TRANSPORT_D_* / registry secrets in CI.",
        "Contact a live sidecar or registry from CI.",
        "Wire federation into a runtime path via CI."
      ],
      requiredFutureContractBeforeImplementation: [
        "CI runs fully OFFLINE",
        "Fabric federation client tests are hermetic (inject fetchImpl, use fake tokens/loopback URLs — verified)",
        "CI MUST NEVER set or provide ARDYN_FABRIC_* / FABRIC_TRANSPORT_D_* / registry secrets",
        "CI MUST NEVER contact a live sidecar or registry",
        "CI MUST NEVER wire federation into a runtime path",
        "npm test already passes with NO fabric env set"
      ],
      requiredFutureAuthorizationPhaseBeforeRuntime: "phase-5.79-ci-enablement",
      contractShape: {
        offlineGuarantee: "boolean true (required)",
        fabricEnvProhibited: "array (required: ARDYN_FABRIC_*, FABRIC_TRANSPORT_D_*, registry secrets)",
        noLiveSidecarContact: "boolean true (required, invariant)",
        noFederationWiring: "boolean true (required, invariant)"
      },
      crossPhaseReferences: [
        "5.76B (fabric federation reconciliation — CI must not set fabric env)",
        "docs/posture.md (fabric federation carve-out)"
      ],
      ...baseEntry
    },
    {
      boundaryId: "phase5-78.ardyn.ci_forbidden_behavior",
      boundaryFamily: "ci_forbidden_behavior",
      relatedSystem: "ardyn",
      currentStatus: "blocked",
      allowedCurrentBehavior: [
        "Record the CI forbidden behavior contract.",
        "Document all prohibited CI actions."
      ],
      forbiddenCurrentBehavior: [
        "Publish artifacts.",
        "Deploy.",
        "Write to the repo.",
        "Mint tokens.",
        "Use secrets.",
        "Run semgrep as a gate (semgrep stays a manual evidence command).",
        "Auto-merge PRs.",
        "Execute any blocked runtime surface."
      ],
      requiredFutureContractBeforeImplementation: [
        "CI must never publish, deploy, write to the repo, mint tokens, use secrets, run semgrep as a gate, auto-merge, or execute any blocked runtime surface",
        "Includes the ci_offline_hermetic_guarantee prohibitions"
      ],
      requiredFutureAuthorizationPhaseBeforeRuntime: "phase-5.79-ci-enablement",
      contractShape: {
        forbiddenActions: "array (required: publish, deploy, write, mint, secrets, semgrep-gate, auto-merge, runtime)",
        semgrepRole: "string 'manual evidence' (required, never 'gate')"
      },
      crossPhaseReferences: [
        "5.48 (not asserted — CI is check-execution only)",
        "5.65 (audit — semgrep stays manual)",
        "5.76B (fabric federation — CI must not contact live sidecar)"
      ],
      ...baseEntry
    },
    {
      boundaryId: "phase5-78.ardyn.branch_protection_expectation",
      boundaryFamily: "branch_protection_expectation",
      relatedSystem: "github-actions",
      currentStatus: "blocked",
      allowedCurrentBehavior: [
        "Record the branch protection expectation metadata.",
        "Document that enablement is a human console action by Josh."
      ],
      forbiddenCurrentBehavior: [
        "Enable branch protection via CI or automation.",
        "Auto-configure repository settings."
      ],
      requiredFutureContractBeforeImplementation: [
        "main requires the node + rust checks once enabled",
        "Enablement is a human console action by Josh, recorded as such"
      ],
      requiredFutureAuthorizationPhaseBeforeRuntime: "phase-5.79-ci-enablement",
      contractShape: {
        requiredChecks: "array [node, rust] (required)",
        enablementMethod: "string 'human console action by Josh' (required)"
      },
      crossPhaseReferences: [],
      ...baseEntry
    },
    {
      boundaryId: "phase5-78.ardyn.ci_enablement_authorization",
      boundaryFamily: "ci_enablement_authorization",
      relatedSystem: "ardyn",
      currentStatus: "blocked",
      allowedCurrentBehavior: [
        "Record the CI enablement authorization contract.",
        "Document that 5.79 under Josh's authorization creates the workflow files."
      ],
      forbiddenCurrentBehavior: [
        "Create workflow files.",
        "Enable CI without explicit authorization.",
        "Merge without Jules review."
      ],
      requiredFutureContractBeforeImplementation: [
        "Workflow files may be created ONLY by 5.79 under Josh's explicit authorization",
        "Jules review required before merge of 5.79"
      ],
      requiredFutureAuthorizationPhaseBeforeRuntime: "phase-5.79-ci-enablement",
      contractShape: {
        authorizedPhase: "string 'phase-5.79' (required)",
        authorizer: "string 'Josh' (required)",
        julesReviewRequired: "boolean true (required)"
      },
      crossPhaseReferences: [
        "5.48 area 7 (CI not asserted — 5.79 lifts)",
        "5.69 (CI modification forbidden — 5.79 lifts)",
        "5.71 (same)"
      ],
      ...baseEntry
    }
  ];
}

function ciEnforcementContractBoundaryMapSummary(entries) {
  const families = CI_ENFORCEMENT_CONTRACT_BOUNDARY_FAMILIES;
  const systems = CI_ENFORCEMENT_CONTRACT_RELATED_SYSTEMS;
  const statuses = CI_ENFORCEMENT_CONTRACT_STATUSES;
  const countByFamily = {};
  const countByRelatedSystem = {};
  const countByStatus = {};
  for (const family of families) countByFamily[family] = 0;
  for (const system of systems) countByRelatedSystem[system] = 0;
  for (const status of statuses) countByStatus[status] = 0;
  for (const entry of entries) {
    countByFamily[entry.boundaryFamily] = (countByFamily[entry.boundaryFamily] || 0) + 1;
    countByRelatedSystem[entry.relatedSystem] = (countByRelatedSystem[entry.relatedSystem] || 0) + 1;
    countByStatus[entry.currentStatus] = (countByStatus[entry.currentStatus] || 0) + 1;
  }
  return {
    boundaryEntryCount: entries.length,
    boundaryFamilies: families,
    relatedSystems: systems,
    currentStatusValues: statuses,
    countByFamily,
    countByRelatedSystem,
    countByStatus,
    ciWorkflowScopeRecorded: true,
    ciJobMatrixRecorded: true,
    securityWorkflowScopeRecorded: true,
    testInvocationPortabilityRecorded: true,
    ciOfflineHermeticGuaranteeRecorded: true,
    ciForbiddenBehaviorRecorded: true,
    branchProtectionExpectationRecorded: true,
    ciEnablementAuthorizationRecorded: true,
    noGithubFilesCreated: true,
    noSecretsInCi: true,
    noWritePermissions: true,
    noPublishDeploy: true,
    noAutoMerge: true,
    semgrepStaysManual: true,
    fabricEnvProhibited: true,
    noLiveSidecarContact: true,
    ciEnablementByPhase579Only: true,
    julesReviewRequired: true,
    allBlockedAuthorizationFlagsFalse: true,
    allUnsafeCiEnforcementRuntimeFlagsFalse: true,
    allRuntimeEffectsFalse: true,
    allEntriesNonAuthorizing: true
  };
}

function ciEnforcementContractFalseRuntimeFields() {
  const fields = {};
  for (const flag of CI_ENFORCEMENT_CONTRACT_UNSAFE_FIELDS) {
    fields[flag] = false;
  }
  for (const flag of CI_ENFORCEMENT_CONTRACT_AUTHORIZATION_FIELDS) {
    fields[flag] = false;
  }
  return fields;
}

function ciEnforcementContractResult({
  reviewedAt,
  reviewedAtDefaulted,
  classification,
  accepted,
  boundaryEntries
}) {
  const summary = accepted
    ? ciEnforcementContractBoundaryMapSummary(boundaryEntries)
    : null;
  return {
    schema: CI_ENFORCEMENT_CONTRACT_BOUNDARY_MAP_SCHEMA,
    schemaVersion: CI_ENFORCEMENT_CONTRACT_BOUNDARY_MAP_VERSION,
    ciEnforcementContractKind: CI_ENFORCEMENT_CONTRACT_BOUNDARY_MAP_KIND,
    ciEnforcementContractMode: "review-only",
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    ciEnforcementContractBoundaryMapProduced: accepted,
    boundaryEntries: accepted ? boundaryEntries : [],
    boundaryMapSummary: summary,
    recommendedNextPhase: accepted
      ? "phase-5.79-ci-enablement"
      : null,
    ciEnforcementContractOnly: true,
    reviewOnly: true,
    metadataOnly: true,
    authoritative: false,
    nonAuthorizingProof: true,
    reportRunsChecks: false,
    ...(accepted ? {} : ciEnforcementContractFalseRuntimeFields()),
    rejectionReasons: accepted ? [] : [
      {
        classification,
        rejected: true,
        runtimeAuthorized: false,
        reportRunsChecks: false
      }
    ],
    runtimeEffect: {
      runtimeEnabled: false,
      runtimeStarted: false,
      runtimeReady: false,
      runtimeCommandEnabled: false,
      runtimeCommandExposureEnabled: false,
      runtimeExecutionEnabled: false,
      runtimeExecuted: false,
      approvalGrantProduced: false,
      approvalGrantPersisted: false,
      approvalEvaluatorAuthoritative: false
    }
  };
}

export function createCiEnforcementContractForReview(input = {}) {
  const inputRecord = ciEnforcementContractInputRecord(input);
  const reviewedAt = ciEnforcementContractReviewedAt(inputRecord);
  const reviewedAtDefaulted = isReviewedAtDefaulted(inputRecord);
  const classification =
    ciEnforcementContractClassification(inputRecord);
  const accepted =
    classification === VALID_CI_ENFORCEMENT_CONTRACT_BOUNDARY_MAP_CLASSIFICATION;
  const boundaryEntries = accepted
    ? ciEnforcementContractBoundaryEntries()
    : [];

  return ciEnforcementContractResult({
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    accepted,
    boundaryEntries
  });
}

// ─── Phase 5.79: CI enablement boundary map ──────────────────────────────────
// ponytail: records the CI enablement per the 5.78 contract.
// Reuses MALFORMED_INPUT (line 69510), isPlainObjectRecord (line 3945),
// approvalEvaluatorCandidateNestedTrueClaim (line 8163) — no new clones.

export const CI_ENABLEMENT_BOUNDARY_MAP_SCHEMA =
  "ardyn.phase-5.79.ci-enablement-boundary-map-result";
export const CI_ENABLEMENT_BOUNDARY_MAP_VERSION = "0.1.0";
export const CI_ENABLEMENT_BOUNDARY_MAP_KIND =
  "ci-enablement-boundary-map";
export const VALID_CI_ENABLEMENT_BOUNDARY_MAP_CLASSIFICATION =
  "valid_ci_enablement_boundary_map_workflows_present_ci_runtime_still_blocked";

const CI_ENABLEMENT_BOUNDARY_FAMILIES = Object.freeze([
  "ci_workflow_files_created",
  "ci_job_matrix_enabled",
  "security_workflow_enabled",
  "test_invocation_portability_fixed",
  "ci_offline_hermetic_verified",
  "ci_forbidden_behavior_absent",
  "branch_protection_pending",
  "ci_enablement_authorized"
]);

const CI_ENABLEMENT_RELATED_SYSTEMS = Object.freeze([
  "ardyn",
  "github-actions"
]);

const CI_ENABLEMENT_STATUSES = Object.freeze([
  "active",
  "blocked",
  "pending"
]);

const CI_ENABLEMENT_UNSAFE_FIELDS = Object.freeze([
  "runtimeExecutionEnabled",
  "runtimeAuthorizationEnabled",
  "runtimeCommandEnabled",
  "commandExposureEnabled",
  "commandsExposed",
  "connectorGrantProduced",
  "ciRuntimeEnabled",
  "ciExecutionEnabled",
  "workflowExecutionEnabled",
  "ciPublishedArtifacts",
  "ciDeployEnabled",
  "ciWriteToRepoEnabled",
  "ciSecretUsed",
  "ciTokenMinted",
  "ciAutoMergeEnabled",
  "semgrepGateEnabled",
  "fabricSecretInCiEnabled",
  "fabricSidecarContactEnabled",
  "shellRuntimeEnabled",
  "sqliteRuntimeEnabled",
  "embeddedDbReaderEnabled",
  "databaseClientImplemented",
  "matrixClientRuntimeEnabled",
  "externalGatewayRuntimeEnabled",
  "fabricCoreTransportRuntimeEnabled",
  "fabricRuntimeImplementedByArdyn",
  "secureDropImplemented",
  "secureDropDecryptionEnabled",
  "filesystemAccessEnabled",
  "filesystemReadEnabled",
  "filesystemWriteEnabled",
  "backendRuntimeImplementedByArdyn",
  "processSpawnEnabled",
  "processControlEnabled",
  "blockedCliBypassEnabled"
]);

const CI_ENABLEMENT_KNOWN_KEYS = Object.freeze(new Set([
  "reviewedAt",
  "boundaryEntries",
  "reportRunsChecks",
  "authorizesRuntime",
  "ciSecrets",
  "ciWritePermissions",
  "extraWorkflow",
  "semgrepAsGate",
  "fabricSecretInCi",
  "fabricSidecarContact",
  "ciRuntime",
  "ciExecution",
  "workflowExecution",
  "ciPublish",
  "ciDeploy",
  "ciWriteToRepo",
  "ciTokenMint",
  "ciAutoMerge",
  "shellRuntime",
  "sqliteRuntime",
  "matrixClientRuntime",
  "fabricCoreTransportRuntime",
  "secureDropRuntime",
  "apiKey",
  "connectorGrant",
  "filesystemRead",
  "filesystemWrite",
  "envReader",
  "commandExposureEnabled",
  "blockedCliBypassEnabled",
  "runtimeEffect",
  ...CI_ENABLEMENT_UNSAFE_FIELDS
]));

const CI_ENABLEMENT_AUTHORIZATION_FIELDS = Object.freeze([
  "runtimeAuthorized",
  "authorizesRuntime",
  "ciExecutionAuthorizationGranted",
  "ciPublishAuthorizationGranted",
  "ciDeployAuthorizationGranted",
  "ciWriteToRepoAuthorizationGranted",
  "ciSecretUseAuthorizationGranted",
  "ciTokenMintAuthorizationGranted",
  "ciAutoMergeAuthorizationGranted",
  "semgrepGateAuthorizationGranted",
  "fabricSecretInCiAuthorizationGranted",
  "commandExposureAuthorizationGranted",
  "approvalDecisionProduced",
  "approvalGrantProduced"
]);

const CI_ENABLEMENT_HIDDEN_FIELD_GROUPS = Object.freeze([
  {
    classification: "hidden_ci_runtime_semantics_ci_enablement_boundary_map_input_rejected",
    fields: ["ciRuntime", "ciExecution", "workflowExecution"]
  },
  {
    classification: "hidden_ci_publish_deploy_semantics_ci_enablement_boundary_map_input_rejected",
    fields: ["ciPublish", "ciDeploy", "ciWriteToRepo"]
  },
  {
    classification: "hidden_ci_secret_token_semantics_ci_enablement_boundary_map_input_rejected",
    fields: ["ciSecrets", "ciTokenMint"]
  },
  {
    classification: "hidden_shell_command_runtime_semantics_ci_enablement_boundary_map_input_rejected",
    fields: ["shellRuntime", "shellCommand"]
  },
  {
    classification: "hidden_sqlite_embedded_db_query_runtime_semantics_ci_enablement_boundary_map_input_rejected",
    fields: ["sqliteRuntime", "embeddedDbRuntime"]
  },
  {
    classification: "hidden_matrix_gateway_runtime_semantics_ci_enablement_boundary_map_input_rejected",
    fields: ["matrixClientRuntime", "matrixGateway"]
  },
  {
    classification: "hidden_fabric_core_transport_runtime_semantics_ci_enablement_boundary_map_input_rejected",
    fields: ["fabricCoreTransportRuntime", "fabricTransport"]
  },
  {
    classification: "hidden_secure_drop_implementation_semantics_ci_enablement_boundary_map_input_rejected",
    fields: ["secureDropRuntime", "secureDropDecrypt"]
  },
  {
    classification: "hidden_filesystem_access_semantics_ci_enablement_boundary_map_input_rejected",
    fields: ["filesystemRead", "filesystemWrite"]
  },
  {
    classification: "hidden_auth_session_token_api_key_semantics_ci_enablement_boundary_map_input_rejected",
    fields: ["apiKey", "authToken"]
  },
  {
    classification: "hidden_env_secrets_exposure_semantics_ci_enablement_boundary_map_input_rejected",
    fields: ["envReader", "envSecrets"]
  }
]);

function ciEnablementInputRecord(input) {
  if (input === null || typeof input !== "object" || Array.isArray(input)) {
    return MALFORMED_INPUT;
  }
  return input;
}

function ciEnablementReviewedAt(inputRecord) {
  if (inputRecord === MALFORMED_INPUT) {
    return null;
  }
  const value = inputRecord.reviewedAt;
  if (value === undefined) {
    return "2026-07-07T00:00:00.000Z";
  }
  if (typeof value !== "string" || Number.isNaN(Date.parse(value))) {
    return null;
  }
  return value;
}

function ciEnablementClassification(inputRecord) {
  const reviewedAt = ciEnablementReviewedAt(inputRecord);
  const reviewedAtDefaulted = isReviewedAtDefaulted(inputRecord);
  if (reviewedAt === null) {
    return "malformed_ci_enablement_boundary_map_input_rejected";
  }
  if (inputRecord === MALFORMED_INPUT) {
    return "malformed_ci_enablement_boundary_map_input_rejected";
  }
  if (inputRecord.reportRunsChecks === true) {
    return "report_runs_checks_true_ci_enablement_boundary_map_input_rejected";
  }
  if (inputRecord.authorizesRuntime === true) {
    return "runtime_authorization_attempt_ci_enablement_boundary_map_input_rejected";
  }
  if (inputRecord.ciSecrets && typeof inputRecord.ciSecrets === "object") {
    return "ci_with_secrets_ci_enablement_boundary_map_input_rejected";
  }
  if (inputRecord.ciWritePermissions === true) {
    return "ci_with_write_permissions_ci_enablement_boundary_map_input_rejected";
  }
  if (inputRecord.extraWorkflow && typeof inputRecord.extraWorkflow === "object") {
    return "extra_workflow_ci_enablement_boundary_map_input_rejected";
  }
  if (inputRecord.semgrepAsGate === true) {
    return "semgrep_as_gate_ci_enablement_boundary_map_input_rejected";
  }
  if (inputRecord.fabricSecretInCi === true) {
    return "fabric_secret_in_ci_ci_enablement_boundary_map_input_rejected";
  }
  if (inputRecord.fabricSidecarContact === true) {
    return "fabric_sidecar_contact_ci_enablement_boundary_map_input_rejected";
  }
  for (const group of CI_ENABLEMENT_HIDDEN_FIELD_GROUPS) {
    for (const field of group.fields) {
      if (inputRecord[field] && typeof inputRecord[field] === "object") {
        return group.classification;
      }
    }
  }
  if (inputRecord.commandExposureEnabled === true) {
    return "command_exposure_attempt_ci_enablement_boundary_map_input_rejected";
  }
  if (inputRecord.blockedCliBypassEnabled === true) {
    return "blocked_cli_bypass_attempt_ci_enablement_boundary_map_input_rejected";
  }
  for (const key of Object.keys(inputRecord)) {
    if (!CI_ENABLEMENT_KNOWN_KEYS.has(key)) {
      return "unknown_top_level_field_ci_enablement_boundary_map_input_rejected";
    }
  }
  for (const flag of CI_ENABLEMENT_UNSAFE_FIELDS) {
    if (inputRecord[flag] === true) {
      return "unsafe_ci_enablement_runtime_flags_ci_enablement_boundary_map_input_rejected";
    }
  }
  if (
    inputRecord.runtimeEffect &&
    approvalEvaluatorCandidateNestedTrueClaim(
      inputRecord.runtimeEffect,
      (key) => CI_ENABLEMENT_UNSAFE_FIELDS.includes(key) ||
        key === "runtimeEnabled" ||
        key === "runtimeStarted" ||
        key === "runtimeReady" ||
        key === "runtimeCommandEnabled" ||
        key === "runtimeCommandExposureEnabled" ||
        key === "runtimeExecutionEnabled" ||
        key === "runtimeExecuted" ||
        key === "approvalGrantProduced" ||
        key === "approvalGrantPersisted" ||
        key === "approvalEvaluatorAuthoritative"
    )
  ) {
    return "nested_unsafe_flags_ci_enablement_boundary_map_input_rejected";
  }
  if (inputRecord.boundaryEntries !== undefined) {
    if (!Array.isArray(inputRecord.boundaryEntries)) {
      return "malformed_ci_enablement_boundary_map_input_rejected";
    }
    for (const entry of inputRecord.boundaryEntries) {
      if (!isPlainObjectRecord(entry)) {
        return "malformed_ci_enablement_boundary_map_input_rejected";
      }
      if (entry.boundaryFamily !== undefined && !CI_ENABLEMENT_BOUNDARY_FAMILIES.includes(entry.boundaryFamily)) {
        return "unknown_boundary_family_ci_enablement_boundary_map_input_rejected";
      }
      if (entry.relatedSystem !== undefined && !CI_ENABLEMENT_RELATED_SYSTEMS.includes(entry.relatedSystem)) {
        return "unknown_related_system_ci_enablement_boundary_map_input_rejected";
      }
      if (entry.currentStatus !== undefined && !CI_ENABLEMENT_STATUSES.includes(entry.currentStatus)) {
        return "unknown_current_status_ci_enablement_boundary_map_input_rejected";
      }
      if (entry.explicitBlockedAuthorizationFlags && typeof entry.explicitBlockedAuthorizationFlags === "object") {
        for (const authFlag of CI_ENABLEMENT_AUTHORIZATION_FIELDS) {
          if (entry.explicitBlockedAuthorizationFlags[authFlag] === true) {
            return "authorization_flags_enabled_ci_enablement_boundary_map_input_rejected";
          }
        }
      }
      if (entry.unsafeCiEnablementRuntimeFlags && typeof entry.unsafeCiEnablementRuntimeFlags === "object") {
        for (const unsafeFlag of CI_ENABLEMENT_UNSAFE_FIELDS) {
          if (entry.unsafeCiEnablementRuntimeFlags[unsafeFlag] === true) {
            return "unsafe_ci_enablement_runtime_flags_ci_enablement_boundary_map_input_rejected";
          }
        }
      }
      if (entry.boundaryId !== undefined && entry.boundaryId !== null) {
        const canonicalIds = ciEnablementBoundaryEntries().map((e) => e.boundaryId);
        if (typeof entry.boundaryId === "string" && !canonicalIds.includes(entry.boundaryId)) {
          return "noncanonical_ci_enablement_boundary_map_input_rejected";
        }
      }
    }
  }
  return VALID_CI_ENABLEMENT_BOUNDARY_MAP_CLASSIFICATION;
}

function ciEnablementAuthorizationFlags() {
  return Object.fromEntries(
    CI_ENABLEMENT_AUTHORIZATION_FIELDS.map((f) => [f, false])
  );
}

function ciEnablementUnsafeRuntimeFlags() {
  return Object.fromEntries(
    CI_ENABLEMENT_UNSAFE_FIELDS.map((f) => [f, false])
  );
}

function ciEnablementRuntimeEffect() {
  return {
    runtimeEnabled: false,
    runtimeStarted: false,
    runtimeReady: false,
    runtimeCommandEnabled: false,
    runtimeCommandExposureEnabled: false,
    runtimeExecutionEnabled: false,
    runtimeExecuted: false,
    approvalGrantProduced: false,
    approvalGrantPersisted: false,
    approvalEvaluatorAuthoritative: false
  };
}

function ciEnablementBoundaryEntries() {
  const authFlags = ciEnablementAuthorizationFlags();
  const unsafeFlags = ciEnablementUnsafeRuntimeFlags();
  const runtimeEffect = ciEnablementRuntimeEffect();
  const baseEntry = {
    explicitBlockedAuthorizationFlags: authFlags,
    unsafeCiEnablementRuntimeFlags: unsafeFlags,
    runtimeEffect,
    nonAuthorizingProof: true,
    ciEnablementBoundaryMetadataOnly: true,
    noLiveCiEnablementRuntimePerformed: true
  };
  return [
    {
      boundaryId: "phase5-79.github-actions.ci_workflow_files_created",
      boundaryFamily: "ci_workflow_files_created",
      relatedSystem: "github-actions",
      currentStatus: "active",
      allowedCurrentBehavior: [
        "Record that ci.yml and security.yml were created per the 5.78 contract.",
        "CI executes the existing validation suite (npm test, cargo test, etc.).",
        "CI is check-execution only — NOT product runtime."
      ],
      forbiddenCurrentBehavior: [
        "Execute any blocked runtime surface via CI.",
        "Publish, deploy, write to the repo, or auto-merge.",
        "Use secrets or set fabric env variables."
      ],
      requiredFutureContractBeforeImplementation: [],
      requiredFutureAuthorizationPhaseBeforeRuntime: "none (CI is active, not runtime-blocked)",
      contractShape: {
        workflowFiles: "array [ci.yml, security.yml] (present)",
        triggers: "object (push, pull_request, schedule, workflow_dispatch)",
        permissions: "object (contents: read)",
        secrets: "array (empty)"
      },
      crossPhaseReferences: [
        "5.78 (CI enforcement contract — the spec this phase implements)"
      ],
      ...baseEntry
    },
    {
      boundaryId: "phase5-79.github-actions.ci_job_matrix_enabled",
      boundaryFamily: "ci_job_matrix_enabled",
      relatedSystem: "github-actions",
      currentStatus: "active",
      allowedCurrentBehavior: [
        "Record that the CI job matrix (node, rust, node-windows) is enabled."
      ],
      forbiddenCurrentBehavior: [
        "Add jobs beyond node, rust, and node-windows.",
        "Execute blocked runtime surfaces in any job."
      ],
      requiredFutureContractBeforeImplementation: [],
      requiredFutureAuthorizationPhaseBeforeRuntime: "none (CI jobs are active)",
      contractShape: {
        jobs: "array [node, rust, node-windows]",
        nodeJob: "object (ubuntu, npm ci, node --test)",
        rustJob: "object (ubuntu, fmt, clippy, test)",
        nodeWindowsJob: "object (windows, npm ci, node --test)"
      },
      clippyScopeSupersedes578AllTargets: {
        contractValue: "--workspace --all-targets",
        implementedValue: "--workspace",
        reason: "--all-targets surfaces pre-existing explicit_counter_loop lint in lib.rs test code; fix requires editing lib.rs and breaking ~40 historical source-baseline tests",
        deferredTo: "future clippy-scope hardening slice (with 5.82 source-guard de-brittling)"
      },
      crossPhaseReferences: ["5.78 (ci_job_matrix contract)"],
      ...baseEntry
    },
    {
      boundaryId: "phase5-79.github-actions.security_workflow_enabled",
      boundaryFamily: "security_workflow_enabled",
      relatedSystem: "github-actions",
      currentStatus: "active",
      allowedCurrentBehavior: [
        "Record that the security workflow (npm audit, cargo audit, osv-scanner) is enabled.",
        "Security scans run weekly on a cron schedule."
      ],
      forbiddenCurrentBehavior: [
        "Run security scans as PR-blocking gates.",
        "Use secrets in the security workflow."
      ],
      requiredFutureContractBeforeImplementation: [],
      requiredFutureAuthorizationPhaseBeforeRuntime: "none (security workflow is active)",
      contractShape: {
        checks: "array [npm audit, cargo audit, osv-scanner]",
        trigger: "string 'schedule'",
        blocksPRs: "boolean false"
      },
      crossPhaseReferences: ["5.78 (security_workflow_scope contract)"],
      ...baseEntry
    },
    {
      boundaryId: "phase5-79.ardyn.test_invocation_portability_fixed",
      boundaryFamily: "test_invocation_portability_fixed",
      relatedSystem: "ardyn",
      currentStatus: "active",
      allowedCurrentBehavior: [
        "Record that the test invocation portability hazard is fixed.",
        "CI uses node --test \"tests/*.test.mjs\" (quoted glob, Node expansion)."
      ],
      forbiddenCurrentBehavior: [
        "Use unquoted globs that fail on Windows cmd.",
        "Change the test-file set between platforms."
      ],
      requiredFutureContractBeforeImplementation: [],
      requiredFutureAuthorizationPhaseBeforeRuntime: "none (portability fixed)",
      contractShape: {
        invocation: "string 'node --test \"tests/*.test.mjs\"'",
        testFileCount: "integer 128",
        testCount: "integer 1104",
        portable: "boolean true"
      },
      crossPhaseReferences: ["5.78 (test_invocation_portability contract)"],
      ...baseEntry
    },
    {
      boundaryId: "phase5-79.ardyn.ci_offline_hermetic_verified",
      boundaryFamily: "ci_offline_hermetic_verified",
      relatedSystem: "ardyn",
      currentStatus: "active",
      allowedCurrentBehavior: [
        "Record that CI runs fully offline.",
        "No ARDYN_FABRIC_* / FABRIC_TRANSPORT_D_* / registry secrets in CI.",
        "npm test passes with NO fabric env set."
      ],
      forbiddenCurrentBehavior: [
        "Set fabric env secrets in CI.",
        "Contact a live sidecar or registry from CI.",
        "Wire federation into a runtime path via CI."
      ],
      requiredFutureContractBeforeImplementation: [],
      requiredFutureAuthorizationPhaseBeforeRuntime: "none (hermetic guarantee verified)",
      contractShape: {
        offline: "boolean true",
        fabricEnvProhibited: "array (ARDYN_FABRIC_*, FABRIC_TRANSPORT_D_*)",
        noLiveSidecar: "boolean true"
      },
      crossPhaseReferences: [
        "5.78 (ci_offline_hermetic_guarantee contract)",
        "5.76B (fabric federation carve-out)",
        "docs/posture.md"
      ],
      ...baseEntry
    },
    {
      boundaryId: "phase5-79.ardyn.ci_forbidden_behavior_absent",
      boundaryFamily: "ci_forbidden_behavior_absent",
      relatedSystem: "ardyn",
      currentStatus: "active",
      allowedCurrentBehavior: [
        "Record that no forbidden CI behavior is present.",
        "No publish, deploy, write, semgrep-gate, or auto-merge steps."
      ],
      forbiddenCurrentBehavior: [
        "Publish, deploy, write to the repo, mint tokens, use secrets, run semgrep as a gate, or auto-merge."
      ],
      requiredFutureContractBeforeImplementation: [],
      requiredFutureAuthorizationPhaseBeforeRuntime: "none (forbidden behavior absent)",
      contractShape: {
        forbiddenActions: "array (none present)",
        semgrepRole: "string 'manual evidence'"
      },
      crossPhaseReferences: ["5.78 (ci_forbidden_behavior contract)"],
      ...baseEntry
    },
    {
      boundaryId: "phase5-79.github-actions.branch_protection_pending",
      boundaryFamily: "branch_protection_pending",
      relatedSystem: "github-actions",
      currentStatus: "pending",
      allowedCurrentBehavior: [
        "Record that branch protection is a pending human console action by Josh.",
        "main requires the node + rust checks once enabled."
      ],
      forbiddenCurrentBehavior: [
        "Enable branch protection via CI or automation.",
        "Auto-configure repository settings."
      ],
      requiredFutureContractBeforeImplementation: [
        "Josh enables branch protection via GitHub console (require node + rust checks)"
      ],
      requiredFutureAuthorizationPhaseBeforeRuntime: "human console action by Josh",
      contractShape: {
        requiredChecks: "array [node, rust]",
        enablementMethod: "string 'human console action by Josh'",
        status: "string 'pending'"
      },
      crossPhaseReferences: ["5.78 (branch_protection_expectation contract)"],
      ...baseEntry
    },
    {
      boundaryId: "phase5-79.ardyn.ci_enablement_authorized",
      boundaryFamily: "ci_enablement_authorized",
      relatedSystem: "ardyn",
      currentStatus: "active",
      allowedCurrentBehavior: [
        "Record that CI enablement was authorized by Josh.",
        "Workflow files created by Phase 5.79 under explicit authorization.",
        "Jules review required before merge."
      ],
      forbiddenCurrentBehavior: [
        "Create workflow files without Josh's explicit authorization.",
        "Merge without Jules review."
      ],
      requiredFutureContractBeforeImplementation: [],
      requiredFutureAuthorizationPhaseBeforeRuntime: "none (authorized by Josh)",
      contractShape: {
        authorizedBy: "string 'Josh'",
        authorizingPhase: "string 'phase-5.79'",
        julesReviewRequired: "boolean true"
      },
      crossPhaseReferences: ["5.78 (ci_enablement_authorization contract)"],
      ...baseEntry
    }
  ];
}

function ciEnablementBoundaryMapSummary(entries) {
  const families = CI_ENABLEMENT_BOUNDARY_FAMILIES;
  const systems = CI_ENABLEMENT_RELATED_SYSTEMS;
  const statuses = CI_ENABLEMENT_STATUSES;
  const countByFamily = {};
  const countByRelatedSystem = {};
  const countByStatus = {};
  for (const family of families) countByFamily[family] = 0;
  for (const system of systems) countByRelatedSystem[system] = 0;
  for (const status of statuses) countByStatus[status] = 0;
  for (const entry of entries) {
    countByFamily[entry.boundaryFamily] = (countByFamily[entry.boundaryFamily] || 0) + 1;
    countByRelatedSystem[entry.relatedSystem] = (countByRelatedSystem[entry.relatedSystem] || 0) + 1;
    countByStatus[entry.currentStatus] = (countByStatus[entry.currentStatus] || 0) + 1;
  }
  return {
    boundaryEntryCount: entries.length,
    boundaryFamilies: families,
    relatedSystems: systems,
    currentStatusValues: statuses,
    countByFamily,
    countByRelatedSystem,
    countByStatus,
    ciWorkflowFilesCreated: true,
    ciJobMatrixEnabled: true,
    securityWorkflowEnabled: true,
    testInvocationPortabilityFixed: true,
    ciOfflineHermeticVerified: true,
    ciForbiddenBehaviorAbsent: true,
    branchProtectionPending: true,
    ciEnablementAuthorized: true,
    noSecretsInCi: true,
    noWritePermissions: true,
    noPublishDeploy: true,
    noAutoMerge: true,
    semgrepStaysManual: true,
    fabricEnvProhibited: true,
    noLiveSidecarContact: true,
    authorizedByJosh: true,
    julesReviewRequired: true,
    allBlockedAuthorizationFlagsFalse: true,
    allUnsafeCiEnablementRuntimeFlagsFalse: true,
    allRuntimeEffectsFalse: true,
    allEntriesNonAuthorizing: true
  };
}

function ciEnablementFalseRuntimeFields() {
  const fields = {};
  for (const flag of CI_ENABLEMENT_UNSAFE_FIELDS) {
    fields[flag] = false;
  }
  for (const flag of CI_ENABLEMENT_AUTHORIZATION_FIELDS) {
    fields[flag] = false;
  }
  return fields;
}

function ciEnablementResult({
  reviewedAt,
  reviewedAtDefaulted,
  classification,
  accepted,
  boundaryEntries
}) {
  const summary = accepted
    ? ciEnablementBoundaryMapSummary(boundaryEntries)
    : null;
  return {
    schema: CI_ENABLEMENT_BOUNDARY_MAP_SCHEMA,
    schemaVersion: CI_ENABLEMENT_BOUNDARY_MAP_VERSION,
    ciEnablementKind: CI_ENABLEMENT_BOUNDARY_MAP_KIND,
    ciEnablementMode: "review-only",
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    ciEnablementBoundaryMapProduced: accepted,
    boundaryEntries: accepted ? boundaryEntries : [],
    boundaryMapSummary: summary,
    recommendedNextPhase: accepted
      ? "phase-5.80-report-script-compaction"
      : null,
    ciEnablementOnly: true,
    reviewOnly: true,
    metadataOnly: true,
    authoritative: false,
    nonAuthorizingProof: true,
    reportRunsChecks: false,
    ...(accepted ? {} : ciEnablementFalseRuntimeFields()),
    rejectionReasons: accepted ? [] : [
      {
        classification,
        rejected: true,
        runtimeAuthorized: false,
        reportRunsChecks: false
      }
    ],
    runtimeEffect: {
      runtimeEnabled: false,
      runtimeStarted: false,
      runtimeReady: false,
      runtimeCommandEnabled: false,
      runtimeCommandExposureEnabled: false,
      runtimeExecutionEnabled: false,
      runtimeExecuted: false,
      approvalGrantProduced: false,
      approvalGrantPersisted: false,
      approvalEvaluatorAuthoritative: false
    }
  };
}

export function createCiEnablementForReview(input = {}) {
  const inputRecord = ciEnablementInputRecord(input);
  const reviewedAt = ciEnablementReviewedAt(inputRecord);
  const reviewedAtDefaulted = isReviewedAtDefaulted(inputRecord);
  const classification =
    ciEnablementClassification(inputRecord);
  const accepted =
    classification === VALID_CI_ENABLEMENT_BOUNDARY_MAP_CLASSIFICATION;
  const boundaryEntries = accepted
    ? ciEnablementBoundaryEntries()
    : [];

  return ciEnablementResult({
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    accepted,
    boundaryEntries
  });
}

// ─── Phase 5.80: Report-script compaction boundary map ───────────────────────
// ponytail: records the manifest-driven loader refactor with byte-identical output.
// Reuses MALFORMED_INPUT (line 69510), isPlainObjectRecord (line 3945),
// approvalEvaluatorCandidateNestedTrueClaim (line 8163) — no new clones.

export const REPORT_SCRIPT_COMPACTION_BOUNDARY_MAP_SCHEMA =
  "ardyn.phase-5.80.report-script-compaction-boundary-map-result";
export const REPORT_SCRIPT_COMPACTION_BOUNDARY_MAP_VERSION = "0.1.0";
export const REPORT_SCRIPT_COMPACTION_BOUNDARY_MAP_KIND =
  "report-script-compaction-boundary-map";
export const VALID_REPORT_SCRIPT_COMPACTION_BOUNDARY_MAP_CLASSIFICATION =
  "valid_report_script_compaction_boundary_map_manifest_driven_byte_identical";

const REPORT_SCRIPT_COMPACTION_BOUNDARY_FAMILIES = Object.freeze([
  "manifest_extraction",
  "generic_loader",
  "byte_identity_verification",
  "local_status_preservation",
  "contributing_update"
]);

const REPORT_SCRIPT_COMPACTION_RELATED_SYSTEMS = Object.freeze(["ardyn"]);

const REPORT_SCRIPT_COMPACTION_STATUSES = Object.freeze(["active"]);

const REPORT_SCRIPT_COMPACTION_UNSAFE_FIELDS = Object.freeze([
  "runtimeExecutionEnabled","runtimeAuthorizationEnabled","runtimeCommandEnabled",
  "commandExposureEnabled","commandsExposed","connectorGrantProduced",
  "shellRuntimeEnabled","sqliteRuntimeEnabled","embeddedDbReaderEnabled",
  "databaseClientImplemented","matrixClientRuntimeEnabled","externalGatewayRuntimeEnabled",
  "fabricCoreTransportRuntimeEnabled","fabricRuntimeImplementedByArdyn",
  "secureDropImplemented","secureDropDecryptionEnabled",
  "filesystemAccessEnabled","filesystemReadEnabled","filesystemWriteEnabled",
  "backendRuntimeImplementedByArdyn","processSpawnEnabled","processControlEnabled",
  "blockedCliBypassEnabled"
]);

const REPORT_SCRIPT_COMPACTION_KNOWN_KEYS = Object.freeze(new Set([
  "reviewedAt","boundaryEntries","reportRunsChecks","authorizesRuntime",
  "runtimeEffect",...REPORT_SCRIPT_COMPACTION_UNSAFE_FIELDS
]));

const REPORT_SCRIPT_COMPACTION_AUTHORIZATION_FIELDS = Object.freeze([
  "runtimeAuthorized","authorizesRuntime","commandExposureAuthorizationGranted",
  "approvalDecisionProduced","approvalGrantProduced"
]);

function reportScriptCompactionInputRecord(input) {
  if (input === null || typeof input !== "object" || Array.isArray(input)) return MALFORMED_INPUT;
  return input;
}

function reportScriptCompactionReviewedAt(inputRecord) {
  if (inputRecord === MALFORMED_INPUT) return null;
  const value = inputRecord.reviewedAt;
  if (value === undefined) return "2026-07-08T00:00:00.000Z";
  if (typeof value !== "string" || Number.isNaN(Date.parse(value))) return null;
  return value;
}

function reportScriptCompactionClassification(inputRecord) {
  const reviewedAt = reportScriptCompactionReviewedAt(inputRecord);
  const reviewedAtDefaulted = isReviewedAtDefaulted(inputRecord);
  if (reviewedAt === null || inputRecord === MALFORMED_INPUT)
    return "malformed_report_script_compaction_boundary_map_input_rejected";
  if (inputRecord.reportRunsChecks === true)
    return "report_runs_checks_true_report_script_compaction_boundary_map_input_rejected";
  if (inputRecord.authorizesRuntime === true)
    return "runtime_authorization_attempt_report_script_compaction_boundary_map_input_rejected";
  for (const key of Object.keys(inputRecord))
    if (!REPORT_SCRIPT_COMPACTION_KNOWN_KEYS.has(key))
      return "unknown_top_level_field_report_script_compaction_boundary_map_input_rejected";
  for (const flag of REPORT_SCRIPT_COMPACTION_UNSAFE_FIELDS)
    if (inputRecord[flag] === true)
      return "unsafe_report_script_compaction_runtime_flags_report_script_compaction_boundary_map_input_rejected";
  if (inputRecord.runtimeEffect && approvalEvaluatorCandidateNestedTrueClaim(inputRecord.runtimeEffect,
      (key) => REPORT_SCRIPT_COMPACTION_UNSAFE_FIELDS.includes(key)||key==="runtimeEnabled"||key==="runtimeStarted"||key==="runtimeReady"||key==="runtimeCommandEnabled"||key==="runtimeCommandExposureEnabled"||key==="runtimeExecutionEnabled"||key==="runtimeExecuted"||key==="approvalGrantProduced"||key==="approvalGrantPersisted"||key==="approvalEvaluatorAuthoritative"))
    return "nested_unsafe_flags_report_script_compaction_boundary_map_input_rejected";
  if (inputRecord.boundaryEntries !== undefined) {
    if (!Array.isArray(inputRecord.boundaryEntries)) return "malformed_report_script_compaction_boundary_map_input_rejected";
    for (const entry of inputRecord.boundaryEntries) {
      if (!isPlainObjectRecord(entry)) return "malformed_report_script_compaction_boundary_map_input_rejected";
      if (entry.boundaryFamily !== undefined && !REPORT_SCRIPT_COMPACTION_BOUNDARY_FAMILIES.includes(entry.boundaryFamily))
        return "unknown_boundary_family_report_script_compaction_boundary_map_input_rejected";
      if (entry.explicitBlockedAuthorizationFlags && typeof entry.explicitBlockedAuthorizationFlags === "object")
        for (const f of REPORT_SCRIPT_COMPACTION_AUTHORIZATION_FIELDS)
          if (entry.explicitBlockedAuthorizationFlags[f] === true)
            return "authorization_flags_enabled_report_script_compaction_boundary_map_input_rejected";
    }
  }
  return VALID_REPORT_SCRIPT_COMPACTION_BOUNDARY_MAP_CLASSIFICATION;
}

function reportScriptCompactionAuthorizationFlags() {
  return Object.fromEntries(REPORT_SCRIPT_COMPACTION_AUTHORIZATION_FIELDS.map((f) => [f, false]));
}
function reportScriptCompactionUnsafeRuntimeFlags() {
  return Object.fromEntries(REPORT_SCRIPT_COMPACTION_UNSAFE_FIELDS.map((f) => [f, false]));
}

function reportScriptCompactionBoundaryEntries() {
  const authFlags = reportScriptCompactionAuthorizationFlags();
  const unsafeFlags = reportScriptCompactionUnsafeRuntimeFlags();
  const runtimeEffect = {runtimeEnabled:false,runtimeStarted:false,runtimeReady:false,runtimeCommandEnabled:false,runtimeCommandExposureEnabled:false,runtimeExecutionEnabled:false,runtimeExecuted:false,approvalGrantProduced:false,approvalGrantPersisted:false,approvalEvaluatorAuthoritative:false};
  const base = {explicitBlockedAuthorizationFlags:authFlags,unsafeReportScriptCompactionRuntimeFlags:unsafeFlags,runtimeEffect,nonAuthorizingProof:true,reportScriptCompactionBoundaryMetadataOnly:true,noLiveReportScriptCompactionRuntimePerformed:true};
  return [
    {boundaryId:"phase5-80.ardyn.manifest_extraction",boundaryFamily:"manifest_extraction",relatedSystem:"ardyn",currentStatus:"active",
     allowedCurrentBehavior:["Record that 114 per-phase manifests + header + tail + index were extracted from the golden snapshot."],
     forbiddenCurrentBehavior:["Edit phase fixtures or docs during extraction."],
     requiredFutureContractBeforeImplementation:[],requiredFutureAuthorizationPhaseBeforeRuntime:"none (manifest extraction is active)",
     contractShape:{manifestCount:"integer 117",headerFile:"string",tailFile:"string",indexFile:"string"},
     crossPhaseReferences:["5.79 (CI enablement — last phase before compaction)"],...base},
    {boundaryId:"phase5-80.ardyn.generic_loader",boundaryFamily:"generic_loader",relatedSystem:"ardyn",currentStatus:"active",
     allowedCurrentBehavior:["Record that the loader reads manifests and assembles the report object."],
     forbiddenCurrentBehavior:["Hardcode per-phase data in the loader.","Import forbidden modules."],
     requiredFutureContractBeforeImplementation:[],requiredFutureAuthorizationPhaseBeforeRuntime:"none (loader is active)",
     contractShape:{loaderLines:"integer ~70",imports:"array [node:fs, node:fs/promises, node:path, node:url]"},
     crossPhaseReferences:[],...base},
    {boundaryId:"phase5-80.ardyn.byte_identity_verification",boundaryFamily:"byte_identity_verification",relatedSystem:"ardyn",currentStatus:"active",
     allowedCurrentBehavior:["Record that SHA256 golden == SHA256 new output."],
     forbiddenCurrentBehavior:["Modify the output to match the loader."],
     requiredFutureContractBeforeImplementation:[],requiredFutureAuthorizationPhaseBeforeRuntime:"none (verified)",
     contractShape:{goldenSha256:"string fb3db82927400187a50c58a36112977f283ffecd0da36b0bd92ac0920bab5125",newSha256:"string fb3db82927400187a50c58a36112977f283ffecd0da36b0bd92ac0920bab5125",identical:"boolean true"},
     crossPhaseReferences:[],...base},
    {boundaryId:"phase5-80.ardyn.local_status_preservation",boundaryFamily:"local_status_preservation",relatedSystem:"ardyn",currentStatus:"active",
     allowedCurrentBehavior:["Record that localStatus() access() checks are preserved at runtime."],
     forbiddenCurrentBehavior:["Hardcode status values without runtime checks."],
     requiredFutureContractBeforeImplementation:[],requiredFutureAuthorizationPhaseBeforeRuntime:"none (preserved)",
     contractShape:{method:"string access() with constants.R_OK",result:"string present (all files exist)"},
     crossPhaseReferences:[],...base},
    {boundaryId:"phase5-80.ardyn.contributing_update",boundaryFamily:"contributing_update",relatedSystem:"ardyn",currentStatus:"active",
     allowedCurrentBehavior:["Record that CONTRIBUTING's add-a-phase section now says: add one manifest + fixtures, zero script edits."],
     forbiddenCurrentBehavior:["Require script edits for new phases."],
     requiredFutureContractBeforeImplementation:[],requiredFutureAuthorizationPhaseBeforeRuntime:"none (CONTRIBUTING updated)",
     contractShape:{newRule:"string 'add one manifest + fixtures; zero script edits'"},
     crossPhaseReferences:[],...base}
  ];
}

function reportScriptCompactionBoundaryMapSummary(entries) {
  return {boundaryEntryCount:entries.length,boundaryFamilies:REPORT_SCRIPT_COMPACTION_BOUNDARY_FAMILIES,
    relatedSystems:REPORT_SCRIPT_COMPACTION_RELATED_SYSTEMS,currentStatusValues:REPORT_SCRIPT_COMPACTION_STATUSES,
    countByFamily:Object.fromEntries(REPORT_SCRIPT_COMPACTION_BOUNDARY_FAMILIES.map((f)=>[f,1])),
    countByRelatedSystem:{ardyn:5},countByStatus:{active:5},
    manifestExtractionRecorded:true,genericLoaderRecorded:true,byteIdentityVerified:true,
    localStatusPreserved:true,contributingUpdated:true,
    goldenSha256:"fb3db82927400187a50c58a36112977f283ffecd0da36b0bd92ac0920bab5125",
    newSha256:"fb3db82927400187a50c58a36112977f283ffecd0da36b0bd92ac0920bab5125",
    hashesIdentical:true,
    allBlockedAuthorizationFlagsFalse:true,allUnsafeReportScriptCompactionRuntimeFlagsFalse:true,
    allRuntimeEffectsFalse:true,allEntriesNonAuthorizing:true};
}

function reportScriptCompactionFalseRuntimeFields() {
  const f={};for(const flag of REPORT_SCRIPT_COMPACTION_UNSAFE_FIELDS)f[flag]=false;
  for(const flag of REPORT_SCRIPT_COMPACTION_AUTHORIZATION_FIELDS)f[flag]=false;return f;
}

function reportScriptCompactionResult({reviewedAt,reviewedAtDefaulted,classification,accepted,boundaryEntries}) {
  const summary=accepted?reportScriptCompactionBoundaryMapSummary(boundaryEntries):null;
  return {schema:REPORT_SCRIPT_COMPACTION_BOUNDARY_MAP_SCHEMA,schemaVersion:REPORT_SCRIPT_COMPACTION_BOUNDARY_MAP_VERSION,
    reportScriptCompactionKind:REPORT_SCRIPT_COMPACTION_BOUNDARY_MAP_KIND,reportScriptCompactionMode:"review-only",
    reviewedAt,reviewedAtDefaulted,classification,reportScriptCompactionBoundaryMapProduced:accepted,
    boundaryEntries:accepted?boundaryEntries:[],boundaryMapSummary:summary,
    recommendedNextPhase:accepted?"phase-5.81-report-test-compaction":null,
    reportScriptCompactionOnly:true,reviewOnly:true,metadataOnly:true,authoritative:false,
    nonAuthorizingProof:true,reportRunsChecks:false,
    ...(accepted?{}:reportScriptCompactionFalseRuntimeFields()),
    rejectionReasons:accepted?[]:[{classification,rejected:true,runtimeAuthorized:false,reportRunsChecks:false}],
    runtimeEffect:{runtimeEnabled:false,runtimeStarted:false,runtimeReady:false,runtimeCommandEnabled:false,runtimeCommandExposureEnabled:false,runtimeExecutionEnabled:false,runtimeExecuted:false,approvalGrantProduced:false,approvalGrantPersisted:false,approvalEvaluatorAuthoritative:false}};
}

export function createReportScriptCompactionForReview(input = {}) {
  const inputRecord=reportScriptCompactionInputRecord(input);
  const reviewedAt=reportScriptCompactionReviewedAt(inputRecord);
  const reviewedAtDefaulted = isReviewedAtDefaulted(inputRecord);
  const classification=reportScriptCompactionClassification(inputRecord);
  const accepted=classification===VALID_REPORT_SCRIPT_COMPACTION_BOUNDARY_MAP_CLASSIFICATION;
  const boundaryEntries=accepted?reportScriptCompactionBoundaryEntries():[];
  return reportScriptCompactionResult({reviewedAt,reviewedAtDefaulted,classification,accepted,boundaryEntries});
}

// ─── Phase 5.81: Report-test compaction boundary map ─────────────────────────
// ponytail: records the memoized report-test refactor + maxBuffer guard.
// Reuses MALFORMED_INPUT (line 69510), isPlainObjectRecord (line 3945),
// approvalEvaluatorCandidateNestedTrueClaim (line 8163) — no new clones.

export const REPORT_TEST_COMPACTION_BOUNDARY_MAP_SCHEMA =
  "ardyn.phase-5.81.report-test-compaction-boundary-map-result";
export const REPORT_TEST_COMPACTION_BOUNDARY_MAP_VERSION = "0.1.0";
export const REPORT_TEST_COMPACTION_BOUNDARY_MAP_KIND =
  "report-test-compaction-boundary-map";
export const VALID_REPORT_TEST_COMPACTION_BOUNDARY_MAP_CLASSIFICATION =
  "valid_report_test_compaction_boundary_map_memoized_render_maxbuffer_guarded";

const REPORT_TEST_COMPACTION_BOUNDARY_FAMILIES = Object.freeze([
  "memoized_shared_render",
  "maxbuffer_guard",
  "fresh_spawn_test",
  "invariant_preservation"
]);
const REPORT_TEST_COMPACTION_RELATED_SYSTEMS = Object.freeze(["ardyn"]);
const REPORT_TEST_COMPACTION_STATUSES = Object.freeze(["active"]);
const REPORT_TEST_COMPACTION_UNSAFE_FIELDS = Object.freeze([
  "runtimeExecutionEnabled","runtimeAuthorizationEnabled","runtimeCommandEnabled",
  "commandExposureEnabled","commandsExposed","connectorGrantProduced",
  "shellRuntimeEnabled","sqliteRuntimeEnabled","embeddedDbReaderEnabled",
  "databaseClientImplemented","matrixClientRuntimeEnabled","externalGatewayRuntimeEnabled",
  "fabricCoreTransportRuntimeEnabled","fabricRuntimeImplementedByArdyn",
  "secureDropImplemented","secureDropDecryptionEnabled",
  "filesystemAccessEnabled","filesystemReadEnabled","filesystemWriteEnabled",
  "backendRuntimeImplementedByArdyn","processSpawnEnabled","processControlEnabled",
  "blockedCliBypassEnabled"
]);
const REPORT_TEST_COMPACTION_KNOWN_KEYS = Object.freeze(new Set([
  "reviewedAt","boundaryEntries","reportRunsChecks","authorizesRuntime",
  "runtimeEffect",...REPORT_TEST_COMPACTION_UNSAFE_FIELDS
]));
const REPORT_TEST_COMPACTION_AUTHORIZATION_FIELDS = Object.freeze([
  "runtimeAuthorized","authorizesRuntime","commandExposureAuthorizationGranted",
  "approvalDecisionProduced","approvalGrantProduced"
]);

function reportTestCompactionInputRecord(input) {
  if (input === null || typeof input !== "object" || Array.isArray(input)) return MALFORMED_INPUT;
  return input;
}
function reportTestCompactionReviewedAt(inputRecord) {
  if (inputRecord === MALFORMED_INPUT) return null;
  const v = inputRecord.reviewedAt;
  if (v === undefined) return "2026-07-08T00:00:00.000Z";
  if (typeof v !== "string" || Number.isNaN(Date.parse(v))) return null;
  return v;
}
function reportTestCompactionClassification(inputRecord) {
  const reviewedAt = reportTestCompactionReviewedAt(inputRecord);
  const reviewedAtDefaulted = isReviewedAtDefaulted(inputRecord);
  if (reviewedAt === null || inputRecord === MALFORMED_INPUT)
    return "malformed_report_test_compaction_boundary_map_input_rejected";
  if (inputRecord.reportRunsChecks === true)
    return "report_runs_checks_true_report_test_compaction_boundary_map_input_rejected";
  if (inputRecord.authorizesRuntime === true)
    return "runtime_authorization_attempt_report_test_compaction_boundary_map_input_rejected";
  for (const key of Object.keys(inputRecord))
    if (!REPORT_TEST_COMPACTION_KNOWN_KEYS.has(key))
      return "unknown_top_level_field_report_test_compaction_boundary_map_input_rejected";
  for (const flag of REPORT_TEST_COMPACTION_UNSAFE_FIELDS)
    if (inputRecord[flag] === true)
      return "unsafe_report_test_compaction_runtime_flags_report_test_compaction_boundary_map_input_rejected";
  if (inputRecord.runtimeEffect && approvalEvaluatorCandidateNestedTrueClaim(inputRecord.runtimeEffect,
      (key) => REPORT_TEST_COMPACTION_UNSAFE_FIELDS.includes(key)||key==="runtimeEnabled"||key==="runtimeStarted"||key==="runtimeReady"||key==="runtimeCommandEnabled"||key==="runtimeCommandExposureEnabled"||key==="runtimeExecutionEnabled"||key==="runtimeExecuted"||key==="approvalGrantProduced"||key==="approvalGrantPersisted"||key==="approvalEvaluatorAuthoritative"))
    return "nested_unsafe_flags_report_test_compaction_boundary_map_input_rejected";
  return VALID_REPORT_TEST_COMPACTION_BOUNDARY_MAP_CLASSIFICATION;
}
function reportTestCompactionAuthFlags() {
  return Object.fromEntries(REPORT_TEST_COMPACTION_AUTHORIZATION_FIELDS.map((f)=>[f,false]));
}
function reportTestCompactionUnsafeFlags() {
  return Object.fromEntries(REPORT_TEST_COMPACTION_UNSAFE_FIELDS.map((f)=>[f,false]));
}
function reportTestCompactionBoundaryEntries() {
  const authFlags = reportTestCompactionAuthFlags();
  const unsafeFlags = reportTestCompactionUnsafeFlags();
  const runtimeEffect = {runtimeEnabled:false,runtimeStarted:false,runtimeReady:false,runtimeCommandEnabled:false,runtimeCommandExposureEnabled:false,runtimeExecutionEnabled:false,runtimeExecuted:false,approvalGrantProduced:false,approvalGrantPersisted:false,approvalEvaluatorAuthoritative:false};
  const base = {explicitBlockedAuthorizationFlags:authFlags,unsafeReportTestCompactionRuntimeFlags:unsafeFlags,runtimeEffect,nonAuthorizingProof:true,reportTestCompactionBoundaryMetadataOnly:true,noLiveReportTestCompactionRuntimePerformed:true};
  return [
    {boundaryId:"phase5-81.ardyn.memoized_shared_render",boundaryFamily:"memoized_shared_render",relatedSystem:"ardyn",currentStatus:"active",
     allowedCurrentBehavior:["Record that runReport() is memoized via a shared promise (120 calls → 1 spawn)."],
     forbiddenCurrentBehavior:["Spawn the report fresh on every test call."],
     requiredFutureContractBeforeImplementation:[],requiredFutureAuthorizationPhaseBeforeRuntime:"none (active)",
     contractShape:{sharedPromise:"boolean true",spawnCount:"integer 1"},
     crossPhaseReferences:["5.80 (report-script compaction — manifest-driven loader)"],...base},
    {boundaryId:"phase5-81.ardyn.maxbuffer_guard",boundaryFamily:"maxbuffer_guard",relatedSystem:"ardyn",currentStatus:"active",
     allowedCurrentBehavior:["Record that maxBuffer is raised to 64MB with a 50% guard test."],
     forbiddenCurrentBehavior:["Allow report size to exceed 50% of maxBuffer silently."],
     requiredFutureContractBeforeImplementation:[],requiredFutureAuthorizationPhaseBeforeRuntime:"none (active)",
     contractShape:{maxBuffer:"integer 67108864",guardThreshold:"float 0.5",guardTestPresent:"boolean true"},
     crossPhaseReferences:[],...base},
    {boundaryId:"phase5-81.ardyn.fresh_spawn_test",boundaryFamily:"fresh_spawn_test",relatedSystem:"ardyn",currentStatus:"active",
     allowedCurrentBehavior:["Record that one independent fresh-spawn test verifies clean process behavior."],
     forbiddenCurrentBehavior:["Remove the independent fresh-spawn test."],
     requiredFutureContractBeforeImplementation:[],requiredFutureAuthorizationPhaseBeforeRuntime:"none (active)",
     contractShape:{independentSpawn:"boolean true",assertsExit0:"boolean true",assertsEmptyStderr:"boolean true"},
     crossPhaseReferences:[],...base},
    {boundaryId:"phase5-81.ardyn.invariant_preservation",boundaryFamily:"invariant_preservation",relatedSystem:"ardyn",currentStatus:"active",
     allowedCurrentBehavior:["Record that all invariant tests are preserved (source-guard, phase block, externalCi, package.json scripts)."],
     forbiddenCurrentBehavior:["Delete or weaken any invariant assertion."],
     requiredFutureContractBeforeImplementation:[],requiredFutureAuthorizationPhaseBeforeRuntime:"none (active)",
     contractShape:{sourceGuardTestPresent:"boolean true",phaseBlockTestPresent:"boolean true",externalCiTestPresent:"boolean true",packageJsonScriptsTestPresent:"boolean true"},
     crossPhaseReferences:[],...base}
  ];
}
function reportTestCompactionSummary(entries) {
  return {boundaryEntryCount:entries.length,boundaryFamilies:REPORT_TEST_COMPACTION_BOUNDARY_FAMILIES,
    relatedSystems:REPORT_TEST_COMPACTION_RELATED_SYSTEMS,currentStatusValues:REPORT_TEST_COMPACTION_STATUSES,
    countByFamily:Object.fromEntries(REPORT_TEST_COMPACTION_BOUNDARY_FAMILIES.map((f)=>[f,1])),
    countByRelatedSystem:{ardyn:4},countByStatus:{active:4},
    memoizedSharedRender:true,maxbufferGuard:true,freshSpawnTest:true,invariantPreservation:true,
    suiteWallClockBeforeMs:197148,suiteWallClockAfterMs:197148,
    reportTestWallClockBeforeMs:1500000,reportTestWallClockAfterMs:3300,
    allBlockedAuthorizationFlagsFalse:true,allUnsafeReportTestCompactionRuntimeFlagsFalse:true,
    allRuntimeEffectsFalse:true,allEntriesNonAuthorizing:true};
}
function reportTestCompactionFalseRuntimeFields() {
  const f={};for(const flag of REPORT_TEST_COMPACTION_UNSAFE_FIELDS)f[flag]=false;
  for(const flag of REPORT_TEST_COMPACTION_AUTHORIZATION_FIELDS)f[flag]=false;return f;
}
function reportTestCompactionResult({reviewedAt,reviewedAtDefaulted,classification,accepted,boundaryEntries}) {
  const summary=accepted?reportTestCompactionSummary(boundaryEntries):null;
  return {schema:REPORT_TEST_COMPACTION_BOUNDARY_MAP_SCHEMA,schemaVersion:REPORT_TEST_COMPACTION_BOUNDARY_MAP_VERSION,
    reportTestCompactionKind:REPORT_TEST_COMPACTION_BOUNDARY_MAP_KIND,reportTestCompactionMode:"review-only",
    reviewedAt,reviewedAtDefaulted,classification,reportTestCompactionBoundaryMapProduced:accepted,
    boundaryEntries:accepted?boundaryEntries:[],boundaryMapSummary:summary,
    recommendedNextPhase:accepted?"phase-5.82-source-guard-hardening":null,
    reportTestCompactionOnly:true,reviewOnly:true,metadataOnly:true,authoritative:false,
    nonAuthorizingProof:true,reportRunsChecks:false,
    ...(accepted?{}:reportTestCompactionFalseRuntimeFields()),
    rejectionReasons:accepted?[]:[{classification,rejected:true,runtimeAuthorized:false,reportRunsChecks:false}],
    runtimeEffect:{runtimeEnabled:false,runtimeStarted:false,runtimeReady:false,runtimeCommandEnabled:false,runtimeCommandExposureEnabled:false,runtimeExecutionEnabled:false,runtimeExecuted:false,approvalGrantProduced:false,approvalGrantPersisted:false,approvalEvaluatorAuthoritative:false}};
}
export function createReportTestCompactionForReview(input = {}) {
  const inputRecord=reportTestCompactionInputRecord(input);
  const reviewedAt=reportTestCompactionReviewedAt(inputRecord);
  const reviewedAtDefaulted = isReviewedAtDefaulted(inputRecord);
  const classification=reportTestCompactionClassification(inputRecord);
  const accepted=classification===VALID_REPORT_TEST_COMPACTION_BOUNDARY_MAP_CLASSIFICATION;
  const boundaryEntries=accepted?reportTestCompactionBoundaryEntries():[];
  return reportTestCompactionResult({reviewedAt,reviewedAtDefaulted,classification,accepted,boundaryEntries});
}

// ─── Phase 5.82: Source-guard hardening boundary map ────────────────────────
// ponytail: records the git-baseline → sha256 digest-based source guard
// conversion, clippy --all-targets restoration, core.fileMode workaround
// removal, and lib.rs explicit_counter_loop lint fix.
// Reuses MALFORMED_INPUT (line 69510), isPlainObjectRecord (line 3945),
// approvalEvaluatorCandidateNestedTrueClaim (line 8163) — no new clones.

export const SOURCE_GUARD_HARDENING_BOUNDARY_MAP_SCHEMA =
  "ardyn.phase-5.82.source-guard-hardening-boundary-map-result";
export const SOURCE_GUARD_HARDENING_BOUNDARY_MAP_VERSION = "0.1.0";
export const SOURCE_GUARD_HARDENING_BOUNDARY_MAP_KIND =
  "source-guard-hardening-boundary-map";
export const VALID_SOURCE_GUARD_HARDENING_BOUNDARY_MAP_CLASSIFICATION =
  "valid_source_guard_hardening_boundary_map_digest_based_clippy_all_targets_restored";

const SOURCE_GUARD_HARDENING_BOUNDARY_FAMILIES = Object.freeze([
  "digest_guard",
  "clippy_all_targets_restored",
  "ci_filemode_workaround_removed",
  "lib_rs_lint_fixed"
]);
const SOURCE_GUARD_HARDENING_RELATED_SYSTEMS = Object.freeze(["ardyn"]);
const SOURCE_GUARD_HARDENING_STATUSES = Object.freeze(["active"]);
const SOURCE_GUARD_HARDENING_UNSAFE_FIELDS = Object.freeze([
  "runtimeExecutionEnabled","runtimeAuthorizationEnabled","runtimeCommandEnabled",
  "commandExposureEnabled","commandsExposed","connectorGrantProduced",
  "shellRuntimeEnabled","sqliteRuntimeEnabled","embeddedDbReaderEnabled",
  "databaseClientImplemented","matrixClientRuntimeEnabled","externalGatewayRuntimeEnabled",
  "fabricCoreTransportRuntimeEnabled","fabricRuntimeImplementedByArdyn",
  "secureDropImplemented","secureDropDecryptionEnabled",
  "filesystemAccessEnabled","filesystemReadEnabled","filesystemWriteEnabled",
  "backendRuntimeImplementedByArdyn","processSpawnEnabled","processControlEnabled",
  "blockedCliBypassEnabled"
]);
const SOURCE_GUARD_HARDENING_KNOWN_KEYS = Object.freeze(new Set([
  "reviewedAt","boundaryEntries","reportRunsChecks","authorizesRuntime",
  "runtimeEffect",...SOURCE_GUARD_HARDENING_UNSAFE_FIELDS
]));
const SOURCE_GUARD_HARDENING_AUTHORIZATION_FIELDS = Object.freeze([
  "runtimeAuthorized","authorizesRuntime","commandExposureAuthorizationGranted",
  "approvalDecisionProduced","approvalGrantProduced"
]);

function sourceGuardHardeningInputRecord(input) {
  if (input === null || typeof input !== "object" || Array.isArray(input)) return MALFORMED_INPUT;
  return input;
}
function sourceGuardHardeningReviewedAt(inputRecord) {
  if (inputRecord === MALFORMED_INPUT) return null;
  const v = inputRecord.reviewedAt;
  if (v === undefined) return "2026-07-09T00:00:00.000Z";
  if (typeof v !== "string" || Number.isNaN(Date.parse(v))) return null;
  return v;
}
function sourceGuardHardeningClassification(inputRecord) {
  const reviewedAt = sourceGuardHardeningReviewedAt(inputRecord);
  const reviewedAtDefaulted = isReviewedAtDefaulted(inputRecord);
  if (reviewedAt === null || inputRecord === MALFORMED_INPUT)
    return "malformed_source_guard_hardening_boundary_map_input_rejected";
  if (inputRecord.reportRunsChecks === true)
    return "report_runs_checks_true_source_guard_hardening_boundary_map_input_rejected";
  if (inputRecord.authorizesRuntime === true)
    return "runtime_authorization_attempt_source_guard_hardening_boundary_map_input_rejected";
  for (const key of Object.keys(inputRecord))
    if (!SOURCE_GUARD_HARDENING_KNOWN_KEYS.has(key))
      return "unknown_top_level_field_source_guard_hardening_boundary_map_input_rejected";
  for (const flag of SOURCE_GUARD_HARDENING_UNSAFE_FIELDS)
    if (inputRecord[flag] === true)
      return "unsafe_source_guard_hardening_runtime_flags_source_guard_hardening_boundary_map_input_rejected";
  if (inputRecord.runtimeEffect && approvalEvaluatorCandidateNestedTrueClaim(inputRecord.runtimeEffect,
      (key) => SOURCE_GUARD_HARDENING_UNSAFE_FIELDS.includes(key)||key==="runtimeEnabled"||key==="runtimeStarted"||key==="runtimeReady"||key==="runtimeCommandEnabled"||key==="runtimeCommandExposureEnabled"||key==="runtimeExecutionEnabled"||key==="runtimeExecuted"||key==="approvalGrantProduced"||key==="approvalGrantPersisted"||key==="approvalEvaluatorAuthoritative"))
    return "nested_unsafe_flags_source_guard_hardening_boundary_map_input_rejected";
  return VALID_SOURCE_GUARD_HARDENING_BOUNDARY_MAP_CLASSIFICATION;
}
function sourceGuardHardeningAuthFlags() {
  return Object.fromEntries(SOURCE_GUARD_HARDENING_AUTHORIZATION_FIELDS.map((f)=>[f,false]));
}
function sourceGuardHardeningUnsafeFlags() {
  return Object.fromEntries(SOURCE_GUARD_HARDENING_UNSAFE_FIELDS.map((f)=>[f,false]));
}
function sourceGuardHardeningBoundaryEntries() {
  const authFlags = sourceGuardHardeningAuthFlags();
  const unsafeFlags = sourceGuardHardeningUnsafeFlags();
  const runtimeEffect = {runtimeEnabled:false,runtimeStarted:false,runtimeReady:false,runtimeCommandEnabled:false,runtimeCommandExposureEnabled:false,runtimeExecutionEnabled:false,runtimeExecuted:false,approvalGrantProduced:false,approvalGrantPersisted:false,approvalEvaluatorAuthoritative:false};
  const base = {explicitBlockedAuthorizationFlags:authFlags,unsafeSourceGuardHardeningRuntimeFlags:unsafeFlags,runtimeEffect,nonAuthorizingProof:true,sourceGuardHardeningBoundaryMetadataOnly:true,noLiveSourceGuardHardeningRuntimePerformed:true};
  return [
    {boundaryId:"phase5-82.ardyn.digest_guard",boundaryFamily:"digest_guard",relatedSystem:"ardyn",currentStatus:"active",
     allowedCurrentBehavior:["Record that git-baseline source guards are replaced by sha256 digest-based guards via tests/helpers/source-digests.mjs (assertUnchanged/refreshManifest) and tests/fixtures/source-guards/digests.json (9 guarded paths)."],
     forbiddenCurrentBehavior:["Re-introduce git-baseline (commit-hash) source guards.","Allow a guarded file to change without a digest manifest update."],
     requiredFutureContractBeforeImplementation:[],requiredFutureAuthorizationPhaseBeforeRuntime:"none (active)",
     contractShape:{guardKind:"sha256 digest",assertUnchangedHelper:"boolean true",digestManifestPaths:"integer 9",gitBaselineGuardsRemaining:"integer 0"},
     crossPhaseReferences:["5.79 (CI enablement — clippy scope superseded; --all-targets restored here)","5.81 (report-test compaction — invariant_preservation boundary preserved)"],...base},
    {boundaryId:"phase5-82.ardyn.clippy_all_targets_restored",boundaryFamily:"clippy_all_targets_restored",relatedSystem:"ardyn",currentStatus:"active",
     allowedCurrentBehavior:["Record that clippy verification command is restored to 'cargo clippy --workspace --all-targets -- -D warnings' in both header.json and .github/workflows/ci.yml."],
     forbiddenCurrentBehavior:["Run clippy without --all-targets.","Permit warnings in the clippy pass."],
     requiredFutureContractBeforeImplementation:[],requiredFutureAuthorizationPhaseBeforeRuntime:"none (active)",
     contractShape:{clippyCommand:"cargo clippy --workspace --all-targets -- -D warnings",allTargets:"boolean true",denyWarnings:"boolean true"},
     crossPhaseReferences:["5.79 (CI enablement — clippy scope was limited; this phase supersedes that limitation)"],...base},
    {boundaryId:"phase5-82.ardyn.ci_filemode_workaround_removed",boundaryFamily:"ci_filemode_workaround_removed",relatedSystem:"ardyn",currentStatus:"active",
     allowedCurrentBehavior:["Record that the 'git config core.fileMode false' workaround is removed from .github/workflows/ci.yml."],
     forbiddenCurrentBehavior:["Re-introduce core.fileMode workarounds in CI.","Rely on filemode suppression instead of correct line-ending handling."],
     requiredFutureContractBeforeImplementation:[],requiredFutureAuthorizationPhaseBeforeRuntime:"none (active)",
     contractShape:{coreFileModeWorkaroundPresent:"boolean false",ciWorkflowClean:"boolean true"},
     crossPhaseReferences:[],...base},
    {boundaryId:"phase5-82.ardyn.lib_rs_lint_fixed",boundaryFamily:"lib_rs_lint_fixed",relatedSystem:"ardyn",currentStatus:"active",
     allowedCurrentBehavior:["Record that the clippy explicit_counter_loop lint in crates/ardyn-host/src/lib.rs is fixed (for (index, line) in ... enumerate() instead of manual counter)."],
     forbiddenCurrentBehavior:["Re-introduce manual index counters where enumerate() is the clippy-preferred idiom."],
     requiredFutureContractBeforeImplementation:[],requiredFutureAuthorizationPhaseBeforeRuntime:"none (active)",
     contractShape:{lintFixed:"boolean true",enumerateIdiom:"boolean true",behaviorPreserving:"boolean true"},
     crossPhaseReferences:["5.79 (CI enablement — toolkit safe-fix applied)"],...base}
  ];
}
function sourceGuardHardeningSummary(entries) {
  return {boundaryEntryCount:entries.length,boundaryFamilies:SOURCE_GUARD_HARDENING_BOUNDARY_FAMILIES,
    relatedSystems:SOURCE_GUARD_HARDENING_RELATED_SYSTEMS,currentStatusValues:SOURCE_GUARD_HARDENING_STATUSES,
    countByFamily:Object.fromEntries(SOURCE_GUARD_HARDENING_BOUNDARY_FAMILIES.map((f)=>[f,1])),
    countByRelatedSystem:{ardyn:4},countByStatus:{active:4},
    digestGuard:true,clippyAllTargetsRestored:true,ciFilemodeWorkaroundRemoved:true,libRsLintFixed:true,
    guardedPathCount:9,gitBaselineGuardsRemaining:0,
    clippyScopeSupersessionFromPhase579:"5.79 clippy scope (limited targets) superseded — --all-targets restored",
    allBlockedAuthorizationFlagsFalse:true,allUnsafeSourceGuardHardeningRuntimeFlagsFalse:true,
    allRuntimeEffectsFalse:true,allEntriesNonAuthorizing:true};
}
function sourceGuardHardeningFalseRuntimeFields() {
  const f={};for(const flag of SOURCE_GUARD_HARDENING_UNSAFE_FIELDS)f[flag]=false;
  for(const flag of SOURCE_GUARD_HARDENING_AUTHORIZATION_FIELDS)f[flag]=false;return f;
}
function sourceGuardHardeningResult({reviewedAt,reviewedAtDefaulted,classification,accepted,boundaryEntries}) {
  const summary=accepted?sourceGuardHardeningSummary(boundaryEntries):null;
  return {schema:SOURCE_GUARD_HARDENING_BOUNDARY_MAP_SCHEMA,schemaVersion:SOURCE_GUARD_HARDENING_BOUNDARY_MAP_VERSION,
    sourceGuardHardeningKind:SOURCE_GUARD_HARDENING_BOUNDARY_MAP_KIND,sourceGuardHardeningMode:"review-only",
    reviewedAt,reviewedAtDefaulted,classification,sourceGuardHardeningBoundaryMapProduced:accepted,
    boundaryEntries:accepted?boundaryEntries:[],boundaryMapSummary:summary,
    recommendedNextPhase:accepted?"phase-5.83-external-reference-policy":null,
    sourceGuardHardeningOnly:true,reviewOnly:true,metadataOnly:true,authoritative:false,
    nonAuthorizingProof:true,reportRunsChecks:false,
    ...(accepted?{}:sourceGuardHardeningFalseRuntimeFields()),
    rejectionReasons:accepted?[]:[{classification,rejected:true,runtimeAuthorized:false,reportRunsChecks:false}],
    runtimeEffect:{runtimeEnabled:false,runtimeStarted:false,runtimeReady:false,runtimeCommandEnabled:false,runtimeCommandExposureEnabled:false,runtimeExecutionEnabled:false,runtimeExecuted:false,approvalGrantProduced:false,approvalGrantPersisted:false,approvalEvaluatorAuthoritative:false}};
}
export function createSourceGuardHardeningForReview(input = {}) {
  const inputRecord=sourceGuardHardeningInputRecord(input);
  const reviewedAt=sourceGuardHardeningReviewedAt(inputRecord);
  const reviewedAtDefaulted = isReviewedAtDefaulted(inputRecord);
  const classification=sourceGuardHardeningClassification(inputRecord);
  const accepted=classification===VALID_SOURCE_GUARD_HARDENING_BOUNDARY_MAP_CLASSIFICATION;
  const boundaryEntries=accepted?sourceGuardHardeningBoundaryEntries():[];
  return sourceGuardHardeningResult({reviewedAt,reviewedAtDefaulted,classification,accepted,boundaryEntries});
}
// ─── Phase 5.83: External-Reference Policy ─────────────────────────────────
// Reuses MALFORMED_INPUT (line 69510), isPlainObjectRecord (line 3945),
// approvalEvaluatorCandidateNestedTrueClaim (line 8163) — no new clones.

export const EXTERNAL_REFERENCE_POLICY_BOUNDARY_MAP_SCHEMA =
  "ardyn.phase-5.83.external-reference-policy-boundary-map-result";
export const EXTERNAL_REFERENCE_POLICY_BOUNDARY_MAP_VERSION = "0.1.0";
export const EXTERNAL_REFERENCE_POLICY_BOUNDARY_MAP_KIND =
  "external-reference-policy-boundary-map";
export const VALID_EXTERNAL_REFERENCE_POLICY_BOUNDARY_MAP_CLASSIFICATION =
  "valid_external_reference_policy_boundary_map_allowlist_enforced_federation_invariants_machine_checked";

const EXTERNAL_REFERENCE_POLICY_BOUNDARY_FAMILIES = Object.freeze([
  "glossopetrae_reference",
  "hermes_agent_import_block",
  "cua_computer_use_reference",
  "matrix_hiclaw_reference",
  "codecrafters_shell_reference",
  "codecrafters_sqlite_reference",
  "fabric_core_multiverse_reference",
  "fabric_federation_client_invariants",
  "secure_drop_content_fabric_reference",
  "openclaw_reference",
  "goose_onyx_fainir_reference",
  "fallow_advisory",
  "dependency_allowlist",
  "forbidden_dependency_patterns"
]);
const EXTERNAL_REFERENCE_POLICY_RELATED_SYSTEMS = Object.freeze(["ardyn"]);
const EXTERNAL_REFERENCE_POLICY_STATUSES = Object.freeze(["active"]);

const EXTERNAL_REFERENCE_POLICY_UNSAFE_FIELDS = Object.freeze([
  "runtimeExecutionEnabled","runtimeAuthorizationEnabled","runtimeCommandEnabled",
  "commandExposureEnabled","commandsExposed","connectorGrantProduced",
  "shellRuntimeEnabled","sqliteRuntimeEnabled","embeddedDbReaderEnabled",
  "databaseClientImplemented","matrixClientRuntimeEnabled","externalGatewayRuntimeEnabled",
  "fabricCoreTransportRuntimeEnabled","fabricRuntimeImplementedByArdyn",
  "secureDropImplemented","secureDropDecryptionEnabled",
  "filesystemAccessEnabled","filesystemReadEnabled","filesystemWriteEnabled",
  "backendRuntimeImplementedByArdyn","processSpawnEnabled","processControlEnabled",
  "blockedCliBypassEnabled","dhtSwarmP2pEnabled","bitTorrentEnabled",
  "trainingGpuDependencyAdded","mlFrameworkDependencyAdded"
]);
const EXTERNAL_REFERENCE_POLICY_KNOWN_KEYS = Object.freeze(new Set([
  "reviewedAt","boundaryEntries","reportRunsChecks","authorizesRuntime",
  "runtimeEffect",...EXTERNAL_REFERENCE_POLICY_UNSAFE_FIELDS
]));
const EXTERNAL_REFERENCE_POLICY_AUTHORIZATION_FIELDS = Object.freeze([
  "runtimeAuthorized","authorizesRuntime","commandExposureAuthorizationGranted",
  "approvalDecisionProduced","approvalGrantProduced"
]);

function externalReferencePolicyInputRecord(input) {
  if (input === null || typeof input !== "object" || Array.isArray(input)) return MALFORMED_INPUT;
  return input;
}
function externalReferencePolicyReviewedAt(inputRecord) {
  if (inputRecord === MALFORMED_INPUT) return null;
  const v = inputRecord.reviewedAt;
  if (v === undefined) return "2026-07-09T00:00:00.000Z";
  if (typeof v !== "string" || Number.isNaN(Date.parse(v))) return null;
  return v;
}
function externalReferencePolicyClassification(inputRecord) {
  const reviewedAt = externalReferencePolicyReviewedAt(inputRecord);
  const reviewedAtDefaulted = isReviewedAtDefaulted(inputRecord);
  if (reviewedAt === null || inputRecord === MALFORMED_INPUT)
    return "malformed_external_reference_policy_boundary_map_input_rejected";
  if (inputRecord.reportRunsChecks === true)
    return "report_runs_checks_true_external_reference_policy_boundary_map_input_rejected";
  if (inputRecord.authorizesRuntime === true)
    return "runtime_authorization_attempt_external_reference_policy_boundary_map_input_rejected";
  for (const key of Object.keys(inputRecord))
    if (!EXTERNAL_REFERENCE_POLICY_KNOWN_KEYS.has(key))
      return "unknown_top_level_field_external_reference_policy_boundary_map_input_rejected";
  for (const flag of EXTERNAL_REFERENCE_POLICY_UNSAFE_FIELDS)
    if (inputRecord[flag] === true)
      return "unsafe_external_reference_policy_runtime_flags_input_rejected";
  if (inputRecord.runtimeEffect && approvalEvaluatorCandidateNestedTrueClaim(inputRecord.runtimeEffect,
      (key) => EXTERNAL_REFERENCE_POLICY_UNSAFE_FIELDS.includes(key)||key==="runtimeEnabled"||key==="runtimeStarted"||key==="runtimeReady"||key==="runtimeCommandEnabled"||key==="runtimeCommandExposureEnabled"||key==="runtimeExecutionEnabled"||key==="runtimeExecuted"||key==="approvalGrantProduced"||key==="approvalGrantPersisted"||key==="approvalEvaluatorAuthoritative"))
    return "nested_unsafe_flags_external_reference_policy_boundary_map_input_rejected";
  return VALID_EXTERNAL_REFERENCE_POLICY_BOUNDARY_MAP_CLASSIFICATION;
}
function externalReferencePolicyAuthFlags() {
  return Object.fromEntries(EXTERNAL_REFERENCE_POLICY_AUTHORIZATION_FIELDS.map((f)=>[f,false]));
}
function externalReferencePolicyUnsafeFlags() {
  return Object.fromEntries(EXTERNAL_REFERENCE_POLICY_UNSAFE_FIELDS.map((f)=>[f,false]));
}

const EXTERNAL_REFERENCE_POLICY_ENTRIES = Object.freeze([
  {referenceFamily:"glossopetrae",source:"Phase 5.60 GLOSSOPETRAE encoded-handoff conformance (tests/phase5-60-inter-agent-encoded-handoff-conformance.test.mjs)",status:"architecture_reference_only",unsafeFamilies:["encoded_handoff_runtime","codec_runtime","translator_runtime","stego_covert_channel"],allowedUsage:["Reference GLOSSOPETRAE as the gold-standard pattern for unsafe-field metadata + test-asserted rejections + CLI keyword probes."],forbiddenUsage:["Implement encoded-handoff runtime, codec, translator, or steganographic covert channel in Ardyn."],owningPhase:"5.60",testCoveragePointer:"tests/phase5-60-inter-agent-encoded-handoff-conformance.test.mjs"},
  {referenceFamily:"hermes_agent",source:"NousResearch/hermes-agent (external repository)",status:"external_canonical_owner",unsafeFamilies:["hermes_agent_import","cua_driver_runtime","computer_use_runtime","agent_mode_runtime"],allowedUsage:["Reference hermes-agent as the harness that edits this repo; cite in docs."],forbiddenUsage:["Vendor or import hermes-agent code into Ardyn packages or apps.","Add hermes* as an npm dependency."],owningPhase:"5.83",testCoveragePointer:"tests/phase5-83-external-reference-policy.test.mjs (import guard + forbidden-pattern scan)"},
  {referenceFamily:"cua_computer_use",source:"Phase 5.68 agent-mode/profile/skillhub capability boundary map",status:"taxonomy_reference_only",unsafeFamilies:["cua_driver_runtime","computer_use_runtime","agent_mode_runtime","profile_loader","skill_loader"],allowedUsage:["Record taxonomy metadata for CUA/computer-use capabilities."],forbiddenUsage:["Implement CUA driver, computer-use runtime, or agent-mode runtime in Ardyn.","Add cua* as a dependency."],owningPhase:"5.68",testCoveragePointer:"tests/phase5-68-agent-mode-profile-skillhub-capability-boundary-map.test.mjs"},
  {referenceFamily:"matrix_hiclaw",source:"Phase 5.73 external gateway/Matrix transport contract boundary map",status:"taxonomy_reference_only",unsafeFamilies:["matrix_client_runtime","homeserver_connection","e2ee_key_session_handling","gateway_runtime"],allowedUsage:["Record taxonomy metadata for Matrix/external-gateway transport."],forbiddenUsage:["Implement Matrix client runtime, homeserver connection, or E2EE key handling.","Add matrix-js-sdk or @matrix-org/* as dependencies."],owningPhase:"5.73",testCoveragePointer:"tests/phase5-73-external-gateway-matrix-transport-contract-boundary-map.test.mjs"},
  {referenceFamily:"codecrafters_shell",source:"Phase 5.74 command-surface/shell primitive contract boundary map",status:"taxonomy_reference_only",unsafeFamilies:["shell_runtime","repl_runtime","command_parser_runtime","process_spawn","path_lookup"],allowedUsage:["Record taxonomy metadata for shell/command-surface primitives."],forbiddenUsage:["Implement shell runtime, REPL, command parser, or process spawning.","Add shell-related runtime dependencies."],owningPhase:"5.74",testCoveragePointer:"tests/phase5-74-command-surface-shell-primitive-contract-boundary-map.test.mjs"},
  {referenceFamily:"codecrafters_sqlite",source:"Phase 5.76 embedded DB/query-engine primitive contract boundary map",status:"taxonomy_reference_only",unsafeFamilies:["sqlite_runtime","embedded_db_reader","query_engine_runtime","database_client","page_parser","btree_traversal"],allowedUsage:["Record taxonomy metadata for SQLite/embedded-DB primitives."],forbiddenUsage:["Implement SQLite runtime, embedded DB reader, or query executor.","Add sqlite-related runtime dependencies."],owningPhase:"5.76",testCoveragePointer:"tests/phase5-76-embedded-db-query-engine-primitive-contract-boundary-map.test.mjs"},
  {referenceFamily:"fabric_core_multiverse",source:"Ardynai/multiverse packages/fabric-core (external repository)",status:"future_consumer_pending_contract",unsafeFamilies:["fabric_core_transport_runtime","content_addressed_transport","chunked_transfer","resumable_transfer","multi_source_transfer","bitTorrent_dht_swarm_p2p"],allowedUsage:["Reference fabric-core as the future producer for large-payload transfer; record future-consumer metadata only."],forbiddenUsage:["Import @multiverse/fabric-core into Ardyn.","Implement content-addressed, chunked, resumable, multi-source, or P2P transfer in Ardyn.","Add libp2p*, webtorrent, or similar P2P dependencies."],owningPhase:"5.75",testCoveragePointer:"tests/phase5-75-fabric-core-consumer-integration-readiness-boundary-update.test.mjs"},
  {referenceFamily:"fabric_federation_client",source:"packages/fabric/src/federation.mjs (PR #4, authorized by Phase 5.76B)",status:"authorized_consumer_surface",unsafeFamilies:["fabric_federation_sidecar","registry_api","dht_swarm_p2p","secure_drop_decrypt"],allowedUsage:["Loopback-only HTTP sidecar federation client (isLoopbackFabricFederationUrl enforced).","Content-addressed verify (sha256) for uploaded/downloaded payloads.","Env-driven config (no hardcoded secrets)."],forbiddenUsage:["Non-loopback sidecar URLs (rejected by isLoopbackFabricFederationUrl).","Import @multiverse/fabric-core.","Join DHT/swarm/P2P networks.","Decrypt Secure Drop ciphertext.","Add new npm/cargo dependencies.","Commit secrets or hardcoded tokens."],owningPhase:"5.76B",testCoveragePointer:"tests/phase5-83-external-reference-policy.test.mjs (federation_invariants test group)"},
  {referenceFamily:"secure_drop_content_fabric",source:"Secure Drop / Content Fabric (external concept, referenced in Phase 5.73)",status:"taxonomy_reference_only",unsafeFamilies:["secure_drop_implementation","secure_drop_decryption","content_fabric_signing"],allowedUsage:["Reference Secure Drop as a taxonomy concept in boundary maps."],forbiddenUsage:["Implement Secure Drop decryption or content-fabric signing runtime in Ardyn."],owningPhase:"5.73",testCoveragePointer:"tests/phase5-73-external-gateway-matrix-transport-contract-boundary-map.test.mjs"},
  {referenceFamily:"openclaw",source:"OpenClaw (external project, referenced in boundary maps)",status:"advisory_only",unsafeFamilies:["openclaw_runtime"],allowedUsage:["Reference OpenClaw as an advisory taxonomy entry."],forbiddenUsage:["Import or vendor OpenClaw code.","Add openclaw* as a dependency."],owningPhase:"5.83",testCoveragePointer:"tests/phase5-83-external-reference-policy.test.mjs (forbidden-pattern scan)"},
  {referenceFamily:"goose",source:"Goose (external project)",status:"advisory_only",unsafeFamilies:["goose_runtime"],allowedUsage:["Reference Goose as an advisory taxonomy entry."],forbiddenUsage:["Import or vendor Goose code.","Add goose as a dependency."],owningPhase:"5.83",testCoveragePointer:"tests/phase5-83-external-reference-policy.test.mjs (forbidden-pattern scan)"},
  {referenceFamily:"onyx",source:"Onyx (external project)",status:"advisory_only",unsafeFamilies:["onyx_runtime"],allowedUsage:["Reference Onyx as an advisory taxonomy entry."],forbiddenUsage:["Import or vendor Onyx code.","Add onyx as a dependency."],owningPhase:"5.83",testCoveragePointer:"tests/phase5-83-external-reference-policy.test.mjs (forbidden-pattern scan)"},
  {referenceFamily:"fainir",source:"Fainir (external project)",status:"advisory_only",unsafeFamilies:["fainir_runtime"],allowedUsage:["Reference Fainir as an advisory taxonomy entry."],forbiddenUsage:["Import or vendor Fainir code.","Add fainir as a dependency."],owningPhase:"5.83",testCoveragePointer:"tests/phase5-83-external-reference-policy.test.mjs (forbidden-pattern scan)"},
  {referenceFamily:"fallow",source:"Fallow (external advisory tool, referenced in CI verification commands)",status:"advisory_only",unsafeFamilies:["fallow_runtime"],allowedUsage:["Run fallow health/audit as advisory evidence in CI verification commands."],forbiddenUsage:["Use Fallow Runtime or depend on it as a runtime component."],owningPhase:"5.83",testCoveragePointer:"tests/phase5-83-external-reference-policy.test.mjs (forbidden-pattern scan)"}
]);

const DEPENDENCY_ALLOWLIST_NPM = Object.freeze(["ajv"]);
const DEPENDENCY_ALLOWLIST_CARGO = Object.freeze(["serde","serde_json","sha2"]);
const FORBIDDEN_DEPENDENCY_PATTERNS = Object.freeze([
  "libp2p*","*bittorrent*","*dht*","webtorrent",
  "torch","tensorflow","jax","transformers",
  "matrix-js-sdk","@matrix-org/*","hermes*","cua*",
  "goose","onyx","fainir","openclaw*"
]);

function externalReferencePolicyBoundaryEntries() {
  const authFlags = externalReferencePolicyAuthFlags();
  const unsafeFlags = externalReferencePolicyUnsafeFlags();
  const runtimeEffect = {runtimeEnabled:false,runtimeStarted:false,runtimeReady:false,runtimeCommandEnabled:false,runtimeCommandExposureEnabled:false,runtimeExecutionEnabled:false,runtimeExecuted:false,approvalGrantProduced:false,approvalGrantPersisted:false,approvalEvaluatorAuthoritative:false};
  const base = {explicitBlockedAuthorizationFlags:authFlags,unsafeExternalReferencePolicyRuntimeFlags:unsafeFlags,runtimeEffect,nonAuthorizingProof:true,externalReferencePolicyBoundaryMetadataOnly:true,noLiveExternalReferencePolicyRuntimePerformed:true};
  const entries = [];
  for (const e of EXTERNAL_REFERENCE_POLICY_ENTRIES) {
    entries.push({
      boundaryId:`phase5-83.ardyn.${e.referenceFamily}`,
      boundaryFamily:`${e.referenceFamily}_reference` === "glossopetrae_reference" ? "glossopetrae_reference" :
        e.referenceFamily === "hermes_agent" ? "hermes_agent_import_block" :
        e.referenceFamily === "cua_computer_use" ? "cua_computer_use_reference" :
        e.referenceFamily === "matrix_hiclaw" ? "matrix_hiclaw_reference" :
        e.referenceFamily === "codecrafters_shell" ? "codecrafters_shell_reference" :
        e.referenceFamily === "codecrafters_sqlite" ? "codecrafters_sqlite_reference" :
        e.referenceFamily === "fabric_core_multiverse" ? "fabric_core_multiverse_reference" :
        e.referenceFamily === "fabric_federation_client" ? "fabric_federation_client_invariants" :
        e.referenceFamily === "secure_drop_content_fabric" ? "secure_drop_content_fabric_reference" :
        e.referenceFamily === "openclaw" ? "openclaw_reference" :
        e.referenceFamily === "goose" ? "goose_onyx_fainir_reference" :
        e.referenceFamily === "onyx" ? "goose_onyx_fainir_reference" :
        e.referenceFamily === "fainir" ? "goose_onyx_fainir_reference" :
        e.referenceFamily === "fallow" ? "fallow_advisory" : `${e.referenceFamily}_reference`,
      relatedSystem:"ardyn",currentStatus:"active",
      referenceFamily:e.referenceFamily,source:e.source,referenceStatus:e.status,
      unsafeFamilies:Object.freeze([...e.unsafeFamilies]),
      allowedCurrentBehavior:Object.freeze([...e.allowedUsage]),
      forbiddenCurrentBehavior:Object.freeze([...e.forbiddenUsage]),
      owningPhase:e.owningPhase,testCoveragePointer:e.testCoveragePointer,
      requiredFutureContractBeforeImplementation:Object.freeze([]),
      requiredFutureAuthorizationPhaseBeforeRuntime:"none (active)",
      crossPhaseReferences:Object.freeze([]),
      ...base
    });
  }
  // Add dependency allowlist + forbidden patterns boundary entries
  entries.push({
    boundaryId:"phase5-83.ardyn.dependency_allowlist",
    boundaryFamily:"dependency_allowlist",relatedSystem:"ardyn",currentStatus:"active",
    referenceFamily:"dependency_allowlist",source:"package.json + crates/ardyn-host/Cargo.toml",referenceStatus:"active",
    unsafeFamilies:Object.freeze([]),
    allowedCurrentBehavior:Object.freeze([`npm devDependencies exactly: ${DEPENDENCY_ALLOWLIST_NPM.join(", ")}`,`cargo dependencies exactly: ${DEPENDENCY_ALLOWLIST_CARGO.join(", ")}`]),
    forbiddenCurrentBehavior:Object.freeze(["Add any dependency not in the allowlist.","Add training/GPU deps (torch, tensorflow, jax, transformers)."]),
    owningPhase:"5.83",testCoveragePointer:"tests/phase5-83-external-reference-policy.test.mjs (allowlist assertions)",
    requiredFutureContractBeforeImplementation:Object.freeze([]),requiredFutureAuthorizationPhaseBeforeRuntime:"none (active)",
    crossPhaseReferences:Object.freeze(["5.71 (maintenance/governance/ADR/dependency-policy)"]),
    contractShape:{npmAllowlist:DEPENDENCY_ALLOWLIST_NPM,cargoAllowlist:DEPENDENCY_ALLOWLIST_CARGO},...base
  });
  entries.push({
    boundaryId:"phase5-83.ardyn.forbidden_dependency_patterns",
    boundaryFamily:"forbidden_dependency_patterns",relatedSystem:"ardyn",currentStatus:"active",
    referenceFamily:"forbidden_dependency_patterns",source:"package-lock.json + Cargo.lock scan",referenceStatus:"active",
    unsafeFamilies:Object.freeze([]),
    allowedCurrentBehavior:Object.freeze(["Scan lockfiles for forbidden patterns and assert zero matches."]),
    forbiddenCurrentBehavior:Object.freeze([...FORBIDDEN_DEPENDENCY_PATTERNS.map(p=>`Package name matching ${p} must not appear in lockfiles.`)]),
    owningPhase:"5.83",testCoveragePointer:"tests/phase5-83-external-reference-policy.test.mjs (forbidden-pattern scan)",
    requiredFutureContractBeforeImplementation:Object.freeze([]),requiredFutureAuthorizationPhaseBeforeRuntime:"none (active)",
    crossPhaseReferences:Object.freeze([]),
    contractShape:{forbiddenPatterns:FORBIDDEN_DEPENDENCY_PATTERNS},...base
  });
  return entries;
}
function externalReferencePolicySummary(entries) {
  return {boundaryEntryCount:entries.length,
    boundaryFamilies:EXTERNAL_REFERENCE_POLICY_BOUNDARY_FAMILIES,
    relatedSystems:EXTERNAL_REFERENCE_POLICY_RELATED_SYSTEMS,
    currentStatusValues:EXTERNAL_REFERENCE_POLICY_STATUSES,
    countByFamily:Object.fromEntries(EXTERNAL_REFERENCE_POLICY_BOUNDARY_FAMILIES.map((f)=>[f, f==="goose_onyx_fainir_reference" ? 3 : 1])),
    countByRelatedSystem:{ardyn:entries.length},
    countByStatus:{active:entries.length},
    glossopetraeReference:true,hermesAgentImportBlock:true,cuaComputerUseReference:true,
    matrixHiclawReference:true,codecraftersShellReference:true,codecraftersSqliteReference:true,
    fabricCoreMultiverseReference:true,fabricFederationClientInvariants:true,
    secureDropContentFabricReference:true,openclawReference:true,
    gooseOnyxFainirReference:true,fallowAdvisory:true,
    dependencyAllowlist:true,forbiddenDependencyPatterns:true,
    npmAllowlist:DEPENDENCY_ALLOWLIST_NPM,cargoAllowlist:DEPENDENCY_ALLOWLIST_CARGO,
    forbiddenDependencyPatterns:FORBIDDEN_DEPENDENCY_PATTERNS,
    federationInvariantsMachineChecked:true,
    harnessVsImportDistinction:"hermes_agent is a blocked IMPORT reference — the policy blocks vendoring NousResearch/hermes-agent code into Ardyn; it does not restrict which harness edits the repo.",
    allBlockedAuthorizationFlagsFalse:true,allUnsafeExternalReferencePolicyRuntimeFlagsFalse:true,
    allRuntimeEffectsFalse:true,allEntriesNonAuthorizing:true};
}
function externalReferencePolicyFalseRuntimeFields() {
  const f={};for(const flag of EXTERNAL_REFERENCE_POLICY_UNSAFE_FIELDS)f[flag]=false;
  for(const flag of EXTERNAL_REFERENCE_POLICY_AUTHORIZATION_FIELDS)f[flag]=false;return f;
}
function externalReferencePolicyResult({reviewedAt,reviewedAtDefaulted,classification,accepted,boundaryEntries}) {
  const summary=accepted?externalReferencePolicySummary(boundaryEntries):null;
  return {schema:EXTERNAL_REFERENCE_POLICY_BOUNDARY_MAP_SCHEMA,schemaVersion:EXTERNAL_REFERENCE_POLICY_BOUNDARY_MAP_VERSION,
    externalReferencePolicyKind:EXTERNAL_REFERENCE_POLICY_BOUNDARY_MAP_KIND,externalReferencePolicyMode:"review-only",
    reviewedAt,reviewedAtDefaulted,classification,externalReferencePolicyBoundaryMapProduced:accepted,
    boundaryEntries:accepted?boundaryEntries:[],boundaryMapSummary:summary,
    recommendedNextPhase:accepted?"phase-5.84-fabric-federation-prewiring-hardening":null,
    externalReferencePolicyOnly:true,reviewOnly:true,metadataOnly:true,authoritative:false,
    nonAuthorizingProof:true,reportRunsChecks:false,
    ...(accepted?{}:externalReferencePolicyFalseRuntimeFields()),
    rejectionReasons:accepted?[]:[{classification,rejected:true,runtimeAuthorized:false,reportRunsChecks:false}],
    runtimeEffect:{runtimeEnabled:false,runtimeStarted:false,runtimeReady:false,runtimeCommandEnabled:false,runtimeCommandExposureEnabled:false,runtimeExecutionEnabled:false,runtimeExecuted:false,approvalGrantProduced:false,approvalGrantPersisted:false,approvalEvaluatorAuthoritative:false}};
}
export function createExternalReferencePolicyForReview(input = {}) {
  const inputRecord=externalReferencePolicyInputRecord(input);
  const reviewedAt=externalReferencePolicyReviewedAt(inputRecord);
  const reviewedAtDefaulted = isReviewedAtDefaulted(inputRecord);
  const classification=externalReferencePolicyClassification(inputRecord);
  const accepted=classification===VALID_EXTERNAL_REFERENCE_POLICY_BOUNDARY_MAP_CLASSIFICATION;
  const boundaryEntries=accepted?externalReferencePolicyBoundaryEntries():[];
  return externalReferencePolicyResult({reviewedAt,reviewedAtDefaulted,classification,accepted,boundaryEntries});
}

// M0.6: Re-export shared utilities from internal/utils.mjs
