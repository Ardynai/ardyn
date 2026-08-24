import { isPlainObjectRecord, isReviewedAtDefaulted, isUtcIsoTimestampWithMilliseconds } from "../internal/utils.mjs";
import { APPROVAL_PREREQUISITE_SOURCE_PREFLIGHT_DEFAULT_REVIEWED_AT, REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE, interAgentEncodedHandoffConformanceForbiddenBehavior } from "../internal/review-shared.mjs";


export const INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_SCHEMA =
  "ardyn.phase-5.60.inter-agent-encoded-handoff-conformance-result";
export const INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_VERSION = "0.1.0";
export const INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_KIND =
  "inter-agent-encoded-handoff-conformance";
const INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_STATE_SCHEMA =
  "ardyn.phase-5.60.inter-agent-encoded-handoff-conformance-state";
const VALID_INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_CLASSIFICATION =
  "valid_inter_agent_encoded_handoff_conformance_runtime_still_blocked";
const MALFORMED_INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_CLASSIFICATION =
  "malformed_inter_agent_encoded_handoff_conformance_input_rejected";
const INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_FAMILIES = Object.freeze([
  "subagent_encoded_handoff",
  "locus_harness_bridge",
  "fabric_coordination_envelope",
  "operator_translation_bridge",
  "handoff_audit_visibility",
  "protocol_reference_layer"
]);
const INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_ACTORS = Object.freeze([
  "ardyn",
  "ardyn-subagent",
  "locus",
  "external-harness",
  "multiverse",
  "content-fabric"
]);
const INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_STATUSES = Object.freeze([
  "metadata_only",
  "blocked",
  "future_contract_required"
]);
const INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_MODES = Object.freeze([
  "plaintext",
  "structured_metadata",
  "encoded_candidate_metadata",
  "operator_translation_required"
]);
const INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_REQUIRED_FIELDS = Object.freeze([
  "handoffId",
  "handoffFamily",
  "sourceActor",
  "targetActor",
  "currentStatus",
  "encodedHandoffMode",
  "allowedCurrentBehavior",
  "forbiddenCurrentBehavior",
  "requiredFutureContractBeforeImplementation",
  "requiredFutureAuthorizationPhaseBeforeRuntime",
  "translatorFinalOutputRequirement",
  "oneClickOperatorOptionMetadata",
  "rawProtocolAuditVisibilityRequirement",
  "locusRoleDescription",
  "fabricRoleDescription",
  "secureDropRoleDescription",
  "explicitBlockedAuthorizationFlags",
  "unsafeEncodedHandoffRuntimeFlags",
  "nonAuthorizingProof"
]);
const INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_OPTION_REQUIRED_FIELDS =
  Object.freeze([
    "optionId",
    "label",
    "optionIntent",
    "allowedFuturePreference",
    "forbiddenCurrentBehavior",
    "nonExecutable",
    "changesRuntimeBehavior",
    "changesReportRunsChecks",
    "exposesCommands",
    "authorizesRuntime",
    "producesApprovalGrant",
    "connectorGrantProduced",
    "nonAuthorizingProof"
  ]);
const INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_UNSAFE_FIELDS = Object.freeze([
  "encodedHandoffRuntimeEnabled",
  "runtimeCommunicationChannelEnabled",
  "protocolRuntimeImplemented",
  "codecImplemented",
  "translatorRuntimeImplemented",
  "encoderImplemented",
  "decoderImplemented",
  "conlangGeneratorImplemented",
  "seedGeneratorImplemented",
  "protocolNegotiatorImplemented",
  "messageRouterImplemented",
  "messageBusImplemented",
  "covertChannelImplemented",
  "stegoLayerImplemented",
  "semanticStegoImplemented",
  "steganographyEngineImplemented",
  "tokenizerExploitImplemented",
  "tokenExploiterImplemented",
  "guardrailEvasionImplemented",
  "bypassPathImplemented",
  "hiddenPayloadPathImplemented",
  "transportImplementedByArdyn",
  "fabricRuntimeImplementedByArdyn",
  "fabricBusImplementedByArdyn",
  "backendRuntimeImplementedByArdyn",
  "apiEndpointImplementedByArdyn",
  "serverImplementedByArdyn",
  "websocketHttpTransportImplementedByArdyn",
  "grpcTransportImplementedByArdyn",
  "mqttTransportImplementedByArdyn",
  "libp2pTransportImplementedByArdyn",
  "a2aRuntimeImplementedByArdyn",
  "acpRuntimeImplementedByArdyn",
  "ampRuntimeImplementedByArdyn",
  "anpRuntimeImplementedByArdyn",
  "importExportPathImplementedByArdyn",
  "packageDistributionImplementedByArdyn",
  "packageWriterImplementedByArdyn",
  "packageReaderImplementedByArdyn",
  "persistenceImplementedByArdyn",
  "databaseStorageRuntimeWritesEnabled",
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
  "secureDropFileSelectionEnabled",
  "st3ggVendored",
  "serviceDiscoveryEnabled",
  "scheduleEnforcementEnabled",
  "backgroundPollingEnabled",
  "filesystemScanningEnabled",
  "processControlEnabled",
  "uiFrontendBrowserRenderingImplemented",
  "commandExposureEnabled",
  "commandRuntimeControlEnabled",
  "runtimeExecutionEnabled",
  "changesRuntimeBehavior",
  "changesReportRunsChecks",
  "reportRunsChecks",
  "blockedCliBypassEnabled"
]);
const INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_AUTHORIZATION_FIELDS =
  Object.freeze([
    "runtimeAuthorized",
    "runtimeAuthorizationGranted",
    "runtimeApprovalGranted",
    "fabricRuntimeAuthorizationGranted",
    "encodedHandoffRuntimeAuthorizationGranted",
    "codecRuntimeAuthorizationGranted",
    "translatorRuntimeAuthorizationGranted",
    "commandExposureAuthorizationGranted",
    "connectorGrantAuthorizationGranted",
    "authorizesRuntime",
    "approvalGrantProduced",
    "approvalDecisionProduced",
    "producesApprovalGrant"
  ]);
const INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_COMMAND_FIELDS = Object.freeze([
  "commandExposureEnabled",
  "commandRuntimeControlEnabled",
  "commandsExposed",
  "exposesCommands",
  "runtimeCommandEnabled",
  "cliCommandExposed"
]);
const INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_BLOCKED_CLI_BYPASS_FIELDS =
  Object.freeze([
    "blockedCliBypassEnabled",
    "dryRunBypassesBlock",
    "serveRuntimeBypassEnabled",
    "bypassBlockedCommandBehavior",
    "blockedCommandOverride"
  ]);
const INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_CODEC_TRUE_FIELDS = Object.freeze([
  "codecImplemented",
  "translatorRuntimeImplemented",
  "encoderImplemented",
  "decoderImplemented",
  "conlangGeneratorImplemented",
  "seedGeneratorImplemented",
  "protocolRuntimeImplemented",
  "protocolNegotiatorImplemented",
  "messageRouterImplemented",
  "messageBusImplemented"
]);
const INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_CODEC_PRESENT_FIELDS =
  Object.freeze([
    "codecModulePath",
    "codecCommand",
    "translatorEntrypoint",
    "encoderEntrypoint",
    "decoderEntrypoint",
    "conlangGeneratorCommand",
    "seedGeneratorCommand",
    "protocolRuntimeEntrypoint",
    "messageRouterEndpoint",
    "messageBusTopic"
  ]);
const INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_STEGO_TRUE_FIELDS =
  Object.freeze([
    "covertChannelImplemented",
    "stegoLayerImplemented",
    "semanticStegoImplemented",
    "steganographyEngineImplemented",
    "tokenizerExploitImplemented",
    "tokenExploiterImplemented",
    "guardrailEvasionImplemented",
    "bypassPathImplemented",
    "hiddenPayloadPathImplemented",
    "monitorBypassEnabled",
    "zeroWidthPayloadEnabled",
    "unicodeHomoglyphPayloadEnabled",
    "st3ggPayloadWrappingEnabled"
  ]);
const INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_STEGO_PRESENT_FIELDS =
  Object.freeze([
    "SemanticStego",
    "SteganographyEngine",
    "TokenExploiter",
    "tokenizerExploit",
    "covertChannel",
    "hiddenPayloadPath",
    "semanticStegoPayload",
    "zeroWidthPayload",
    "unicodeHomoglyphPayload",
    "st3ggPayloadWrapper",
    "stealthAttribute",
    "adversarialAttribute",
    "phantomAttribute"
  ]);
const INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_IMPORT_PRESENT_FIELDS =
  Object.freeze([
    "importCommand",
    "exportCommand",
    "packagePath",
    "packageWriterPath",
    "packageReaderPath",
    "packageDistributionPath",
    "persistenceDsn",
    "dbWriteTarget",
    "storageWriteTarget",
    "secretVaultPath",
    "envSecretName"
  ]);
const INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_FABRIC_PRESENT_FIELDS =
  Object.freeze([
    "fabricBusTopic",
    "fabricBrokerUrl",
    "fabricTransportUrl",
    "fabricAdapterEndpoint",
    "websocketRoute",
    "httpRoute",
    "grpcEndpoint",
    "mqttTopic",
    "libp2pPeer",
    "a2aEndpoint",
    "acpEndpoint",
    "ampEndpoint",
    "anpEndpoint",
    "mcpToolName",
    "taskExecutor",
    "serverEndpointUrl",
    "apiEndpointUrl",
    "runtimeEntrypoint"
  ]);
const INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_FABRIC_TRUE_FIELDS =
  Object.freeze([
    "transportImplementedByArdyn",
    "fabricRuntimeImplementedByArdyn",
    "fabricBusImplementedByArdyn",
    "backendRuntimeImplementedByArdyn",
    "apiEndpointImplementedByArdyn",
    "serverImplementedByArdyn",
    "websocketHttpTransportImplementedByArdyn",
    "grpcTransportImplementedByArdyn",
    "mqttTransportImplementedByArdyn",
    "libp2pTransportImplementedByArdyn",
    "mcpToolExposureEnabled",
    "taskExecutionEnabled"
  ]);
const INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_SECURE_DROP_TRUE_FIELDS =
  Object.freeze([
    "secureDropImplemented",
    "secureDropCryptoImplemented",
    "secureDropTransportImplemented",
    "secureDropStegoImplemented",
    "secureDropSendReceiveImplemented",
    "secureDropInboxPollingEnabled",
    "secureDropFileSelectionEnabled",
    "secureDropConnectorIngestionEnabled",
    "st3ggVendored"
  ]);
function interAgentEncodedHandoffConformanceInputRecord(input) {
  return isPlainObjectRecord(input) ? input : null;
}
function interAgentEncodedHandoffConformanceReviewedAt(inputRecord) {
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
function interAgentEncodedHandoffConformanceInputMalformed(inputRecord) {
  return (
    inputRecord === null ||
    (Object.prototype.hasOwnProperty.call(inputRecord, "reviewedAt") &&
      !isUtcIsoTimestampWithMilliseconds(inputRecord.reviewedAt)) ||
    (Object.prototype.hasOwnProperty.call(inputRecord, "handoffEntries") &&
      !Array.isArray(inputRecord.handoffEntries)) ||
    (Object.prototype.hasOwnProperty.call(inputRecord, "oneClickOptions") &&
      !Array.isArray(inputRecord.oneClickOptions))
  );
}
function interAgentEncodedHandoffConformanceInputEntries(inputRecord) {
  return Array.isArray(inputRecord?.handoffEntries)
    ? inputRecord.handoffEntries
    : null;
}
function interAgentEncodedHandoffConformanceInputOptions(inputRecord) {
  return Array.isArray(inputRecord?.oneClickOptions)
    ? inputRecord.oneClickOptions
    : null;
}
function interAgentEncodedHandoffConformanceContainsTrue(value) {
  if (value === true) {
    return true;
  }

  if (Array.isArray(value)) {
    return value.some(interAgentEncodedHandoffConformanceContainsTrue);
  }

  if (isPlainObjectRecord(value)) {
    return Object.values(value).some(
      interAgentEncodedHandoffConformanceContainsTrue
    );
  }

  return false;
}
function interAgentEncodedHandoffConformanceHasTrueFieldDeep(value, fields) {
  if (Array.isArray(value)) {
    return value.some((item) =>
      interAgentEncodedHandoffConformanceHasTrueFieldDeep(item, fields)
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
      interAgentEncodedHandoffConformanceHasTrueFieldDeep(nested, fields)
    ) {
      return true;
    }
  }

  return false;
}
function interAgentEncodedHandoffConformanceHasPresentFieldDeep(value, fields) {
  if (Array.isArray(value)) {
    return value.some((item) =>
      interAgentEncodedHandoffConformanceHasPresentFieldDeep(item, fields)
    );
  }

  if (!isPlainObjectRecord(value)) {
    return false;
  }

  for (const [key, nested] of Object.entries(value)) {
    if (fields.includes(key)) {
      return true;
    }

    if (
      interAgentEncodedHandoffConformanceHasPresentFieldDeep(nested, fields)
    ) {
      return true;
    }
  }

  return false;
}
function interAgentEncodedHandoffConformanceContainsEntryIssue(
  entries,
  predicate
) {
  return entries !== null && entries.some((entry) => predicate(entry));
}
function interAgentEncodedHandoffConformanceContainsOptionIssue(
  options,
  predicate
) {
  return options !== null && options.some((option) => predicate(option));
}
function interAgentEncodedHandoffConformanceMissingRequiredField(entry) {
  if (!isPlainObjectRecord(entry)) {
    return true;
  }

  return INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_REQUIRED_FIELDS.some(
    (field) => !Object.prototype.hasOwnProperty.call(entry, field)
  );
}
function interAgentEncodedHandoffConformanceOptionMissingRequiredField(option) {
  if (!isPlainObjectRecord(option)) {
    return true;
  }

  return INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_OPTION_REQUIRED_FIELDS.some(
    (field) => !Object.prototype.hasOwnProperty.call(option, field)
  );
}
function interAgentEncodedHandoffConformanceEntryMalformed(entry) {
  return (
    interAgentEncodedHandoffConformanceMissingRequiredField(entry) ||
    typeof entry.handoffId !== "string" ||
    entry.handoffId.length === 0 ||
    !Array.isArray(entry.allowedCurrentBehavior) ||
    entry.allowedCurrentBehavior.length < 2 ||
    entry.allowedCurrentBehavior.some(
      (behavior) => typeof behavior !== "string" || behavior.length === 0
    ) ||
    !Array.isArray(entry.forbiddenCurrentBehavior) ||
    entry.forbiddenCurrentBehavior.length < 25 ||
    entry.forbiddenCurrentBehavior.some(
      (behavior) => typeof behavior !== "string" || behavior.length === 0
    ) ||
    typeof entry.requiredFutureContractBeforeImplementation !== "string" ||
    entry.requiredFutureContractBeforeImplementation.length === 0 ||
    typeof entry.requiredFutureAuthorizationPhaseBeforeRuntime !== "string" ||
    entry.requiredFutureAuthorizationPhaseBeforeRuntime.length === 0 ||
    typeof entry.translatorFinalOutputRequirement !== "string" ||
    entry.translatorFinalOutputRequirement.length === 0 ||
    !isPlainObjectRecord(entry.oneClickOperatorOptionMetadata) ||
    !Array.isArray(entry.oneClickOperatorOptionMetadata.availableOptionIds) ||
    entry.oneClickOperatorOptionMetadata.availableOptionIds.length !==
      interAgentEncodedHandoffConformanceOneClickOptions().length ||
    typeof entry.rawProtocolAuditVisibilityRequirement !== "string" ||
    entry.rawProtocolAuditVisibilityRequirement.length === 0 ||
    typeof entry.locusRoleDescription !== "string" ||
    entry.locusRoleDescription.length === 0 ||
    typeof entry.fabricRoleDescription !== "string" ||
    entry.fabricRoleDescription.length === 0 ||
    typeof entry.secureDropRoleDescription !== "string" ||
    entry.secureDropRoleDescription.length === 0 ||
    !isPlainObjectRecord(entry.explicitBlockedAuthorizationFlags) ||
    !isPlainObjectRecord(entry.unsafeEncodedHandoffRuntimeFlags) ||
    entry.nonAuthorizingProof !== true
  );
}
function interAgentEncodedHandoffConformanceOptionMalformed(option) {
  return (
    interAgentEncodedHandoffConformanceOptionMissingRequiredField(option) ||
    typeof option.optionId !== "string" ||
    option.optionId.length === 0 ||
    typeof option.label !== "string" ||
    option.label.length === 0 ||
    option.optionIntent !== "metadata_only" ||
    typeof option.allowedFuturePreference !== "string" ||
    option.allowedFuturePreference.length === 0 ||
    !Array.isArray(option.forbiddenCurrentBehavior) ||
    option.forbiddenCurrentBehavior.length < 4 ||
    option.nonExecutable !== true ||
    option.changesRuntimeBehavior !== false ||
    option.changesReportRunsChecks !== false ||
    option.exposesCommands !== false ||
    option.authorizesRuntime !== false ||
    option.producesApprovalGrant !== false ||
    option.connectorGrantProduced !== false ||
    option.nonAuthorizingProof !== true ||
    !isPlainObjectRecord(option.runtimeEffect) ||
    interAgentEncodedHandoffConformanceContainsTrue(option.runtimeEffect)
  );
}
function interAgentEncodedHandoffConformanceAuthorizationFlagEnabled(value) {
  return (
    interAgentEncodedHandoffConformanceContainsTrue(
      value?.explicitBlockedAuthorizationFlags
    ) ||
    interAgentEncodedHandoffConformanceContainsTrue(value?.authorizationFlags)
  );
}
function interAgentEncodedHandoffConformanceUnsafeFlagEnabled(value) {
  return (
    interAgentEncodedHandoffConformanceContainsTrue(
      value?.unsafeEncodedHandoffRuntimeFlags
    ) ||
    interAgentEncodedHandoffConformanceHasTrueFieldDeep(
      value,
      INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_UNSAFE_FIELDS
    )
  );
}
function interAgentEncodedHandoffConformanceEntriesCanonical(entries) {
  if (entries === null) {
    return true;
  }

  return (
    JSON.stringify(entries) ===
    JSON.stringify(interAgentEncodedHandoffConformanceEntries())
  );
}
function interAgentEncodedHandoffConformanceOptionsCanonical(options) {
  if (options === null) {
    return true;
  }

  return (
    JSON.stringify(options) ===
    JSON.stringify(interAgentEncodedHandoffConformanceOneClickOptions())
  );
}
function interAgentEncodedHandoffConformanceInputClassification(inputRecord) {
  if (interAgentEncodedHandoffConformanceInputMalformed(inputRecord)) {
    return MALFORMED_INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_CLASSIFICATION;
  }

  const entries =
    interAgentEncodedHandoffConformanceInputEntries(inputRecord);
  const options =
    interAgentEncodedHandoffConformanceInputOptions(inputRecord);

  if (
    interAgentEncodedHandoffConformanceContainsEntryIssue(
      entries,
      interAgentEncodedHandoffConformanceMissingRequiredField
    ) ||
    interAgentEncodedHandoffConformanceContainsOptionIssue(
      options,
      interAgentEncodedHandoffConformanceOptionMissingRequiredField
    )
  ) {
    return "missing_required_inter_agent_encoded_handoff_conformance_entry_rejected";
  }

  if (
    interAgentEncodedHandoffConformanceContainsEntryIssue(
      entries,
      (entry) =>
        !INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_FAMILIES.includes(
          entry.handoffFamily
        )
    )
  ) {
    return "unknown_handoff_family_inter_agent_encoded_handoff_conformance_input_rejected";
  }

  if (
    interAgentEncodedHandoffConformanceContainsEntryIssue(
      entries,
      (entry) =>
        !INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_ACTORS.includes(
          entry.sourceActor
        ) ||
        !INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_ACTORS.includes(
          entry.targetActor
        )
    )
  ) {
    return "unknown_source_or_target_actor_inter_agent_encoded_handoff_conformance_input_rejected";
  }

  if (
    interAgentEncodedHandoffConformanceContainsEntryIssue(
      entries,
      (entry) =>
        !INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_MODES.includes(
          entry.encodedHandoffMode
        )
    )
  ) {
    return "unknown_encoded_handoff_mode_inter_agent_encoded_handoff_conformance_input_rejected";
  }

  if (
    interAgentEncodedHandoffConformanceContainsEntryIssue(
      entries,
      (entry) =>
        !INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_STATUSES.includes(
          entry.currentStatus
        )
    )
  ) {
    return "unknown_current_status_inter_agent_encoded_handoff_conformance_input_rejected";
  }

  if (
    interAgentEncodedHandoffConformanceContainsEntryIssue(
      entries,
      interAgentEncodedHandoffConformanceEntryMalformed
    ) ||
    interAgentEncodedHandoffConformanceContainsOptionIssue(
      options,
      interAgentEncodedHandoffConformanceOptionMalformed
    )
  ) {
    return MALFORMED_INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_CLASSIFICATION;
  }

  if (
    interAgentEncodedHandoffConformanceContainsEntryIssue(
      entries,
      interAgentEncodedHandoffConformanceAuthorizationFlagEnabled
    ) ||
    interAgentEncodedHandoffConformanceContainsOptionIssue(
      options,
      interAgentEncodedHandoffConformanceAuthorizationFlagEnabled
    ) ||
    interAgentEncodedHandoffConformanceAuthorizationFlagEnabled(inputRecord)
  ) {
    return "authorization_flags_enabled_inter_agent_encoded_handoff_conformance_input_rejected";
  }

  if (
    interAgentEncodedHandoffConformanceHasTrueFieldDeep(inputRecord, [
      "reportRunsChecks"
    ])
  ) {
    return "report_runs_checks_true_inter_agent_encoded_handoff_conformance_input_rejected";
  }

  if (
    interAgentEncodedHandoffConformanceHasTrueFieldDeep(
      inputRecord,
      INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_AUTHORIZATION_FIELDS
    )
  ) {
    return "runtime_authorization_attempt_inter_agent_encoded_handoff_conformance_input_rejected";
  }

  if (
    interAgentEncodedHandoffConformanceHasTrueFieldDeep(
      inputRecord,
      INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_COMMAND_FIELDS
    )
  ) {
    return "command_exposure_attempt_inter_agent_encoded_handoff_conformance_input_rejected";
  }

  if (
    interAgentEncodedHandoffConformanceHasTrueFieldDeep(
      inputRecord,
      INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_BLOCKED_CLI_BYPASS_FIELDS
    )
  ) {
    return "blocked_cli_bypass_attempt_inter_agent_encoded_handoff_conformance_input_rejected";
  }

  if (
    interAgentEncodedHandoffConformanceHasTrueFieldDeep(
      inputRecord,
      INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_CODEC_TRUE_FIELDS
    ) ||
    interAgentEncodedHandoffConformanceHasPresentFieldDeep(
      inputRecord,
      INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_CODEC_PRESENT_FIELDS
    )
  ) {
    return "hidden_codec_translator_encoder_decoder_conlang_execution_semantics_inter_agent_encoded_handoff_conformance_input_rejected";
  }

  if (
    interAgentEncodedHandoffConformanceHasTrueFieldDeep(
      inputRecord,
      INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_STEGO_TRUE_FIELDS
    ) ||
    interAgentEncodedHandoffConformanceHasPresentFieldDeep(
      inputRecord,
      INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_STEGO_PRESENT_FIELDS
    )
  ) {
    return "hidden_steganography_covert_channel_tokenizer_exploit_guardrail_evasion_bypass_semantics_inter_agent_encoded_handoff_conformance_input_rejected";
  }

  if (
    interAgentEncodedHandoffConformanceHasPresentFieldDeep(
      inputRecord,
      INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_IMPORT_PRESENT_FIELDS
    )
  ) {
    return "hidden_import_export_package_persistence_semantics_inter_agent_encoded_handoff_conformance_input_rejected";
  }

  if (
    interAgentEncodedHandoffConformanceHasTrueFieldDeep(
      inputRecord,
      INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_SECURE_DROP_TRUE_FIELDS
    )
  ) {
    return "secure_drop_implementation_semantics_inter_agent_encoded_handoff_conformance_input_rejected";
  }

  if (
    interAgentEncodedHandoffConformanceHasTrueFieldDeep(
      inputRecord,
      INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_FABRIC_TRUE_FIELDS
    ) ||
    interAgentEncodedHandoffConformanceHasPresentFieldDeep(
      inputRecord,
      INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_FABRIC_PRESENT_FIELDS
    )
  ) {
    return "hidden_fabric_websocket_http_mcp_task_runtime_semantics_inter_agent_encoded_handoff_conformance_input_rejected";
  }

  if (
    interAgentEncodedHandoffConformanceUnsafeFlagEnabled(inputRecord) ||
    interAgentEncodedHandoffConformanceContainsEntryIssue(
      entries,
      interAgentEncodedHandoffConformanceUnsafeFlagEnabled
    ) ||
    interAgentEncodedHandoffConformanceContainsOptionIssue(
      options,
      interAgentEncodedHandoffConformanceUnsafeFlagEnabled
    )
  ) {
    return "unsafe_runtime_command_connector_fabric_websocket_http_mcp_task_secure_drop_service_discovery_schedule_filesystem_process_flags_inter_agent_encoded_handoff_conformance_input_rejected";
  }

  if (
    interAgentEncodedHandoffConformanceContainsEntryIssue(entries, (entry) =>
      interAgentEncodedHandoffConformanceContainsTrue(entry?.runtimeEffect)
    ) ||
    interAgentEncodedHandoffConformanceContainsOptionIssue(options, (option) =>
      interAgentEncodedHandoffConformanceContainsTrue(option?.runtimeEffect)
    ) ||
    interAgentEncodedHandoffConformanceContainsTrue(inputRecord?.runtimeEffect)
  ) {
    return "nested_unsafe_flags_inter_agent_encoded_handoff_conformance_input_rejected";
  }

  if (
    !interAgentEncodedHandoffConformanceEntriesCanonical(entries) ||
    !interAgentEncodedHandoffConformanceOptionsCanonical(options)
  ) {
    return "noncanonical_inter_agent_encoded_handoff_conformance_input_rejected";
  }

  return VALID_INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_CLASSIFICATION;
}
function interAgentEncodedHandoffConformanceAuthorizationFlags() {
  return {
    encodedHandoffRuntimeAuthorizationGranted: false,
    codecRuntimeAuthorizationGranted: false,
    translatorRuntimeAuthorizationGranted: false,
    encoderDecoderRuntimeAuthorizationGranted: false,
    conlangRuntimeAuthorizationGranted: false,
    protocolRuntimeAuthorizationGranted: false,
    covertChannelAuthorizationGranted: false,
    transportAuthorizationGranted: false,
    fabricRuntimeAuthorizationGranted: false,
    backendApiServerAuthorizationGranted: false,
    importExportAuthorizationGranted: false,
    packagePersistenceAuthorizationGranted: false,
    databaseStorageAuthorizationGranted: false,
    secretsAuthorizationGranted: false,
    connectorGrantProduced: false,
    mcpToolExposureAuthorizationGranted: false,
    taskExecutionAuthorizationGranted: false,
    secureDropAuthorizationGranted: false,
    serviceDiscoveryAuthorizationGranted: false,
    scheduleEnforcementAuthorizationGranted: false,
    filesystemProcessAuthorizationGranted: false,
    commandExposureAuthorizationGranted: false,
    approvalGrantProduced: false
  };
}
function interAgentEncodedHandoffConformanceUnsafeFlags() {
  return Object.fromEntries(
    INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_UNSAFE_FIELDS.map((field) => [
      field,
      false
    ])
  );
}
function interAgentEncodedHandoffConformanceOptionIds() {
  return [
    "phase5-60.option.force-plaintext-final-output",
    "phase5-60.option.require-final-operator-translation",
    "phase5-60.option.show-raw-encoded-handoff-transcript",
    "phase5-60.option.hide-raw-transcript-keep-audit-digest",
    "phase5-60.option.allow-structured-metadata-handoff-candidate",
    "phase5-60.option.allow-encoded-handoff-candidate-after-future-authorization",
    "phase5-60.option.disable-encoded-handoff-candidate"
  ];
}
function interAgentEncodedHandoffConformanceOneClickOption({
  optionId,
  label,
  allowedFuturePreference
}) {
  return {
    optionId,
    label,
    optionIntent: "metadata_only",
    allowedFuturePreference,
    forbiddenCurrentBehavior: [
      "Do not change runtime behavior.",
      "Do not change reportRunsChecks.",
      "Do not expose commands or approvals.",
      "Do not send hidden traffic, covert transfer, stego, bypass, no-audit opaque output, tokenizer exploitation, Secure Drop implementation, or connector/runtime state."
    ],
    nonExecutable: true,
    changesRuntimeBehavior: false,
    changesReportRunsChecks: false,
    exposesCommands: false,
    authorizesRuntime: false,
    producesApprovalGrant: false,
    connectorGrantProduced: false,
    nonAuthorizingProof: true,
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}
function interAgentEncodedHandoffConformanceOneClickOptions() {
  return [
    interAgentEncodedHandoffConformanceOneClickOption({
      optionId: "phase5-60.option.force-plaintext-final-output",
      label: "Force plaintext final output",
      allowedFuturePreference:
        "Future Locus or operator controls may prefer plaintext final output, but Phase 5.60 records preference metadata only."
    }),
    interAgentEncodedHandoffConformanceOneClickOption({
      optionId: "phase5-60.option.require-final-operator-translation",
      label: "Require final operator translation",
      allowedFuturePreference:
        "Future controls may require an operator-readable final translation before display, but no translator runtime is implemented."
    }),
    interAgentEncodedHandoffConformanceOneClickOption({
      optionId: "phase5-60.option.show-raw-encoded-handoff-transcript",
      label: "Show raw encoded transcript",
      allowedFuturePreference:
        "Future displays may show raw encoded handoff transcript metadata for audit review."
    }),
    interAgentEncodedHandoffConformanceOneClickOption({
      optionId: "phase5-60.option.hide-raw-transcript-keep-audit-digest",
      label: "Hide raw transcript, keep audit digest",
      allowedFuturePreference:
        "Future displays may hide raw transcript text while keeping a visible audit digest; no opaque no-audit output is allowed."
    }),
    interAgentEncodedHandoffConformanceOneClickOption({
      optionId: "phase5-60.option.allow-structured-metadata-handoff-candidate",
      label: "Allow structured metadata candidate",
      allowedFuturePreference:
        "Future controls may allow structured metadata handoff candidates after a separate contract authorizes consumer-owned handling."
    }),
    interAgentEncodedHandoffConformanceOneClickOption({
      optionId:
        "phase5-60.option.allow-encoded-handoff-candidate-after-future-authorization",
      label: "Allow encoded candidate after authorization",
      allowedFuturePreference:
        "Future controls may allow encoded handoff candidates only after a later authorization phase; this option is non-executable now."
    }),
    interAgentEncodedHandoffConformanceOneClickOption({
      optionId: "phase5-60.option.disable-encoded-handoff-candidate",
      label: "Disable encoded candidate",
      allowedFuturePreference:
        "Future controls may disable encoded handoff candidates and keep plaintext or structured metadata only."
    })
  ];
}
function interAgentEncodedHandoffConformanceEntryBase(definition) {
  return {
    handoffId: definition.handoffId,
    handoffFamily: definition.handoffFamily,
    sourceActor: definition.sourceActor,
    targetActor: definition.targetActor,
    currentStatus: definition.currentStatus,
    encodedHandoffMode: definition.encodedHandoffMode,
    allowedCurrentBehavior: definition.allowedCurrentBehavior,
    forbiddenCurrentBehavior:
      interAgentEncodedHandoffConformanceForbiddenBehavior(),
    requiredFutureContractBeforeImplementation:
      definition.requiredFutureContractBeforeImplementation,
    requiredFutureAuthorizationPhaseBeforeRuntime:
      definition.requiredFutureAuthorizationPhaseBeforeRuntime,
    translatorFinalOutputRequirement:
      definition.translatorFinalOutputRequirement,
    oneClickOperatorOptionMetadata: {
      availableOptionIds: interAgentEncodedHandoffConformanceOptionIds(),
      optionsNonExecutable: true,
      optionsDoNotChangeReportRunsChecks: true,
      optionsDoNotAuthorizeRuntime: true,
      optionsDoNotExposeCommands: true
    },
    rawProtocolAuditVisibilityRequirement:
      definition.rawProtocolAuditVisibilityRequirement,
    locusRoleDescription: definition.locusRoleDescription,
    fabricRoleDescription: definition.fabricRoleDescription,
    secureDropRoleDescription: definition.secureDropRoleDescription,
    glossopetraeArchitectureReferenceOnly: true,
    glossopetraeCopiedVendoredInstalledImportedIntegrated: false,
    futureProtocolReferences: [
      "A2A",
      "ACP",
      "AMP",
      "ANP",
      "Agora",
      "LMOS",
      "MCP",
      "Fabric",
      "Matrix",
      "gRPC",
      "MQTT",
      "libp2p"
    ],
    futureProtocolReferencesMetadataOnly: true,
    encodedHandoffConformanceMetadataOnly: true,
    operatorPlaintextFinalOutputRequired:
      definition.encodedHandoffMode === "operator_translation_required",
    rawProtocolAuditVisibleOrDigestRequired: true,
    explicitBlockedAuthorizationFlags:
      interAgentEncodedHandoffConformanceAuthorizationFlags(),
    unsafeEncodedHandoffRuntimeFlags:
      interAgentEncodedHandoffConformanceUnsafeFlags(),
    nonAuthorizingProof: true,
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}
function interAgentEncodedHandoffConformanceDefinitions() {
  return [
    {
      handoffId: "phase5-60.ardyn-to-subagent.plaintext-handoff-metadata",
      handoffFamily: "subagent_encoded_handoff",
      sourceActor: "ardyn",
      targetActor: "ardyn-subagent",
      currentStatus: "metadata_only",
      encodedHandoffMode: "plaintext",
      allowedCurrentBehavior: [
        "Describe plaintext Ardyn-to-subagent handoff metadata for review.",
        "Require final operator-readable output with no hidden payload path."
      ],
      requiredFutureContractBeforeImplementation:
        "A future subagent handoff contract must define identity, transcript format, audit visibility, and command/runtime non-authority before any executable path.",
      requiredFutureAuthorizationPhaseBeforeRuntime:
        "Requires a later runtime, command exposure, transport, process-control, and approval-grant authorization phase.",
      translatorFinalOutputRequirement:
        "Final output to the operator must remain plaintext and human-readable; no translator runtime is implemented.",
      rawProtocolAuditVisibilityRequirement:
        "Raw handoff metadata and audit digest must remain inspectable in future consumer-owned displays.",
      locusRoleDescription:
        "Locus has no role for this current metadata entry beyond future display of Ardyn review artifacts.",
      fabricRoleDescription:
        "Fabric may later envelope subagent handoff references, but Phase 5.60 defines no Fabric bus or transport.",
      secureDropRoleDescription:
        "Not applicable; Secure Drop remains content-fabric-only future metadata."
    },
    {
      handoffId: "phase5-60.subagent-to-ardyn.structured-metadata-handoff",
      handoffFamily: "subagent_encoded_handoff",
      sourceActor: "ardyn-subagent",
      targetActor: "ardyn",
      currentStatus: "metadata_only",
      encodedHandoffMode: "structured_metadata",
      allowedCurrentBehavior: [
        "Describe subagent-to-Ardyn structured metadata handoff shape.",
        "Keep subagent output review-only and non-authorizing."
      ],
      requiredFutureContractBeforeImplementation:
        "A future contract must define subagent provenance, canonical ordering, replay/audit semantics, and explicit non-execution boundaries.",
      requiredFutureAuthorizationPhaseBeforeRuntime:
        "Requires a later subagent execution, audit, routing, and approval-boundary authorization phase.",
      translatorFinalOutputRequirement:
        "Structured metadata must include an operator-readable summary; no automatic translator is available.",
      rawProtocolAuditVisibilityRequirement:
        "Structured handoff payloads must remain visible as raw metadata or digest-backed audit metadata.",
      locusRoleDescription:
        "Locus may later display subagent handoff status metadata but owns no runner here.",
      fabricRoleDescription:
        "Fabric may later carry a coordination envelope reference only.",
      secureDropRoleDescription:
        "Not applicable; Secure Drop remains content-fabric-only future metadata."
    },
    {
      handoffId:
        "phase5-60.ardyn-subagent.encoded-candidate-metadata-boundary",
      handoffFamily: "subagent_encoded_handoff",
      sourceActor: "ardyn",
      targetActor: "ardyn-subagent",
      currentStatus: "future_contract_required",
      encodedHandoffMode: "encoded_candidate_metadata",
      allowedCurrentBehavior: [
        "Describe that encoded handoff candidates require future authorization.",
        "Keep encoded candidate references metadata-only and audit-visible."
      ],
      requiredFutureContractBeforeImplementation:
        "A future encoded handoff contract must define safe encoding semantics, plaintext translation, raw audit visibility, and explicit prohibition of stego, bypass, and hidden payloads.",
      requiredFutureAuthorizationPhaseBeforeRuntime:
        "Requires a later explicit encoded-handoff runtime authorization phase and separate command/transport authorization.",
      translatorFinalOutputRequirement:
        "Any future encoded candidate must have a plaintext final-output translation requirement before operator presentation.",
      rawProtocolAuditVisibilityRequirement:
        "Raw encoded candidate metadata must be reviewable or digest-backed; opaque no-audit output is forbidden.",
      locusRoleDescription:
        "Locus may later expose a disabled metadata option for encoded candidates after future authorization.",
      fabricRoleDescription:
        "Fabric may later envelope encoded candidate identity metadata only.",
      secureDropRoleDescription:
        "Secure Drop is not implemented here; any future Secure Drop content path remains content-fabric-owned."
    },
    {
      handoffId: "phase5-60.ardyn-to-locus.harness-bridge-metadata",
      handoffFamily: "locus_harness_bridge",
      sourceActor: "ardyn",
      targetActor: "locus",
      currentStatus: "metadata_only",
      encodedHandoffMode: "structured_metadata",
      allowedCurrentBehavior: [
        "Describe Locus-mediated harness bridge display metadata.",
        "Keep Locus a consumer target only with no runtime integration."
      ],
      requiredFutureContractBeforeImplementation:
        "A future Locus-owned bridge contract must define display-only import responsibility, accessibility, audit visibility, and no hidden action semantics.",
      requiredFutureAuthorizationPhaseBeforeRuntime:
        "Requires future Locus-owned runtime, UI, import, and command-control authorization outside Ardyn.",
      translatorFinalOutputRequirement:
        "Locus-facing handoff summaries must remain operator-readable and color-independent.",
      rawProtocolAuditVisibilityRequirement:
        "Locus displays must expose raw protocol metadata or digest evidence without executing it.",
      locusRoleDescription:
        "Locus is a future first-class display/control-surface consumer target only.",
      fabricRoleDescription:
        "Fabric may later envelope Locus bridge metadata but provides no runtime transport in this phase.",
      secureDropRoleDescription:
        "Future Secure Drop indicators are metadata-only placeholders and remain content-fabric-owned."
    },
    {
      handoffId:
        "phase5-60.locus-to-external-harness.bridge-candidate-metadata",
      handoffFamily: "locus_harness_bridge",
      sourceActor: "locus",
      targetActor: "external-harness",
      currentStatus: "future_contract_required",
      encodedHandoffMode: "encoded_candidate_metadata",
      allowedCurrentBehavior: [
        "Describe a future Locus-mediated bridge candidate for other harnesses.",
        "Require Ardyn to treat the external harness as metadata only."
      ],
      requiredFutureContractBeforeImplementation:
        "A future bridge contract must define external harness identity, protocol identity, operator translation, audit transcript handling, and consumer-owned execution boundaries.",
      requiredFutureAuthorizationPhaseBeforeRuntime:
        "Requires future Locus/external-harness authorization and no Ardyn runtime authority.",
      translatorFinalOutputRequirement:
        "Any bridge candidate must have a plaintext operator translation requirement before display.",
      rawProtocolAuditVisibilityRequirement:
        "External harness references require raw transcript visibility or digest-backed audit metadata.",
      locusRoleDescription:
        "Locus may later mediate bridge metadata but cannot send, route, or execute through Ardyn.",
      fabricRoleDescription:
        "Fabric may later coordinate bridge envelope identity metadata only.",
      secureDropRoleDescription:
        "Not applicable; Secure Drop remains content-fabric-only future metadata."
    },
    {
      handoffId: "phase5-60.locus-to-multiverse.harness-bridge-metadata",
      handoffFamily: "locus_harness_bridge",
      sourceActor: "locus",
      targetActor: "multiverse",
      currentStatus: "metadata_only",
      encodedHandoffMode: "structured_metadata",
      allowedCurrentBehavior: [
        "Describe Locus-to-Multiverse harness bridge metadata for review.",
        "Keep Multiverse a consumer target only."
      ],
      requiredFutureContractBeforeImplementation:
        "A future bridge contract must define Multiverse-owned display and orchestration boundaries before any executable relationship.",
      requiredFutureAuthorizationPhaseBeforeRuntime:
        "Requires future Multiverse-owned orchestration and adapter authorization outside Ardyn.",
      translatorFinalOutputRequirement:
        "Bridge metadata must be renderable as plaintext operator output.",
      rawProtocolAuditVisibilityRequirement:
        "Bridge metadata requires visible raw protocol metadata or audit digest.",
      locusRoleDescription:
        "Locus is a future display bridge target and does not gain control authority from Ardyn.",
      fabricRoleDescription:
        "Fabric may later coordinate Locus and Multiverse envelope metadata only.",
      secureDropRoleDescription:
        "Not applicable; Secure Drop remains content-fabric-only future metadata."
    },
    {
      handoffId:
        "phase5-60.ardyn-family.fabric-coordination-envelope-metadata",
      handoffFamily: "fabric_coordination_envelope",
      sourceActor: "ardyn",
      targetActor: "multiverse",
      currentStatus: "metadata_only",
      encodedHandoffMode: "structured_metadata",
      allowedCurrentBehavior: [
        "Describe future Fabric coordination envelope metadata.",
        "Reference Phase 5.59 Fabric-aware API/backend boundary metadata."
      ],
      requiredFutureContractBeforeImplementation:
        "A future Fabric envelope contract must define schema identity, repo ownership, authorization, and transport exclusions before implementation.",
      requiredFutureAuthorizationPhaseBeforeRuntime:
        "Requires future Fabric runtime, transport, task, registry, and adapter authorization.",
      translatorFinalOutputRequirement:
        "Fabric envelope handoff status must be explainable as plaintext final output.",
      rawProtocolAuditVisibilityRequirement:
        "Fabric envelope metadata must remain raw-visible or digest-backed for audit.",
      locusRoleDescription:
        "Locus may later display Fabric envelope status metadata only.",
      fabricRoleDescription:
        "Fabric is a future cross-repo coordination contract/envelope layer, not a runtime bus, service, broker, transport, adapter, connector, registry, scheduler, importer, exporter, package distributor, or task executor.",
      secureDropRoleDescription:
        "Not applicable; Secure Drop remains content-fabric-only future metadata."
    },
    {
      handoffId:
        "phase5-60.ardyn-to-content-fabric.secure-drop-reference-metadata",
      handoffFamily: "fabric_coordination_envelope",
      sourceActor: "ardyn",
      targetActor: "content-fabric",
      currentStatus: "future_contract_required",
      encodedHandoffMode: "structured_metadata",
      allowedCurrentBehavior: [
        "Describe future Secure Drop reference metadata owned by content-fabric.",
        "Keep Ardyn free of Secure Drop implementation behavior."
      ],
      requiredFutureContractBeforeImplementation:
        "A future content-fabric-owned Secure Drop contract must define canonical ownership, crypto/transport scope, display references, and Ardyn non-implementation boundaries.",
      requiredFutureAuthorizationPhaseBeforeRuntime:
        "Requires future content-fabric authorization; Ardyn remains non-authorizing.",
      translatorFinalOutputRequirement:
        "Secure Drop references must be plaintext metadata in Ardyn review artifacts.",
      rawProtocolAuditVisibilityRequirement:
        "Secure Drop reference metadata must be auditable without exposing or moving content.",
      locusRoleDescription:
        "Locus may later show Secure Drop placeholder indicators only.",
      fabricRoleDescription:
        "Fabric may later envelope Secure Drop reference metadata but cannot transport or route Secure Drop content here.",
      secureDropRoleDescription:
        "content-fabric remains the only future canonical Secure Drop owner; Ardyn implements no crypto, transport, stego, send/receive, inbox polling, file selection, connector ingestion, secret/vault/env access, or ST3GG behavior."
    },
    {
      handoffId: "phase5-60.operator.final-output-translation-bridge",
      handoffFamily: "operator_translation_bridge",
      sourceActor: "ardyn-subagent",
      targetActor: "ardyn",
      currentStatus: "metadata_only",
      encodedHandoffMode: "operator_translation_required",
      allowedCurrentBehavior: [
        "Describe the requirement for plaintext final output to the operator.",
        "Keep translation a requirement, not an implemented translator runtime."
      ],
      requiredFutureContractBeforeImplementation:
        "A future operator translation contract must define who produces plaintext, how raw transcript/audit remains visible, and how encoded content stays non-authorizing.",
      requiredFutureAuthorizationPhaseBeforeRuntime:
        "Requires a separate translator/runtime authorization phase before any executable translation path.",
      translatorFinalOutputRequirement:
        "The operator-facing final output must be plaintext, inspectable, and free of hidden command or runtime semantics.",
      rawProtocolAuditVisibilityRequirement:
        "Raw protocol transcript or digest must remain reviewable alongside plaintext output.",
      locusRoleDescription:
        "Locus may later offer display preferences for plaintext and raw transcript visibility.",
      fabricRoleDescription:
        "Fabric may later carry translation-requirement metadata only.",
      secureDropRoleDescription:
        "Not applicable; Secure Drop remains content-fabric-only future metadata."
    },
    {
      handoffId: "phase5-60.locus.operator-translation-preference-metadata",
      handoffFamily: "operator_translation_bridge",
      sourceActor: "locus",
      targetActor: "ardyn",
      currentStatus: "metadata_only",
      encodedHandoffMode: "operator_translation_required",
      allowedCurrentBehavior: [
        "Describe future Locus/operator plaintext and encoded display preferences.",
        "Keep one-click options non-executable metadata."
      ],
      requiredFutureContractBeforeImplementation:
        "A future preference contract must define display-only control semantics, audit digest visibility, and explicit no-action behavior.",
      requiredFutureAuthorizationPhaseBeforeRuntime:
        "Requires future Locus UI/control authorization and no Ardyn runtime effect.",
      translatorFinalOutputRequirement:
        "Preferences may require final operator translation but cannot implement a translator.",
      rawProtocolAuditVisibilityRequirement:
        "Preferences may describe raw transcript visibility or audit digest display only.",
      locusRoleDescription:
        "Locus may later own one-click display controls; Phase 5.60 only records their metadata.",
      fabricRoleDescription:
        "Fabric may later envelope operator preference metadata only.",
      secureDropRoleDescription:
        "Secure Drop placeholders must remain metadata-only and content-fabric-owned."
    },
    {
      handoffId: "phase5-60.raw-protocol.audit-visibility-metadata",
      handoffFamily: "handoff_audit_visibility",
      sourceActor: "ardyn",
      targetActor: "locus",
      currentStatus: "metadata_only",
      encodedHandoffMode: "structured_metadata",
      allowedCurrentBehavior: [
        "Describe raw protocol transcript and audit digest visibility expectations.",
        "Keep raw/audit visibility metadata non-executable."
      ],
      requiredFutureContractBeforeImplementation:
        "A future audit visibility contract must define raw transcript retention, digest calculation, redaction, and display ownership before implementation.",
      requiredFutureAuthorizationPhaseBeforeRuntime:
        "Requires future transcript/audit persistence, UI, and storage authorization before any runtime path.",
      translatorFinalOutputRequirement:
        "Audit displays must make final operator-visible meaning available as plaintext.",
      rawProtocolAuditVisibilityRequirement:
        "Raw protocol transcript visibility or digest-backed audit visibility is mandatory for any future encoded handoff.",
      locusRoleDescription:
        "Locus may later display raw transcript or digest state but cannot collect or persist it through Ardyn.",
      fabricRoleDescription:
        "Fabric may later coordinate audit envelope references only.",
      secureDropRoleDescription:
        "Not applicable; Secure Drop remains content-fabric-only future metadata."
    },
    {
      handoffId: "phase5-60.future-protocol.reference-layer-metadata",
      handoffFamily: "protocol_reference_layer",
      sourceActor: "ardyn",
      targetActor: "external-harness",
      currentStatus: "metadata_only",
      encodedHandoffMode: "structured_metadata",
      allowedCurrentBehavior: [
        "List future protocol references as metadata-only architecture context.",
        "Keep A2A, ACP, AMP, ANP, Agora, LMOS, MCP, Fabric, Matrix, gRPC, MQTT, and libp2p references non-runtime."
      ],
      requiredFutureContractBeforeImplementation:
        "Each future protocol reference requires a separate contract, threat model, authorization, audit, and runtime isolation phase before implementation.",
      requiredFutureAuthorizationPhaseBeforeRuntime:
        "Requires future transport/runtime authorization for each protocol family; Phase 5.60 grants none.",
      translatorFinalOutputRequirement:
        "Protocol reference summaries must remain operator-readable plaintext.",
      rawProtocolAuditVisibilityRequirement:
        "Any future protocol handoff must provide raw transcript visibility or digest-backed audit metadata.",
      locusRoleDescription:
        "Locus may later display protocol reference metadata only.",
      fabricRoleDescription:
        "Fabric is one referenced future envelope family and remains metadata-only here.",
      secureDropRoleDescription:
        "Not applicable; Secure Drop remains content-fabric-only future metadata."
    }
  ];
}
function interAgentEncodedHandoffConformanceEntries() {
  return interAgentEncodedHandoffConformanceDefinitions().map(
    interAgentEncodedHandoffConformanceEntryBase
  );
}
function interAgentEncodedHandoffConformanceSummary(entries, options) {
  const countByFamily = Object.fromEntries(
    INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_FAMILIES.map((family) => [
      family,
      entries.filter((entry) => entry.handoffFamily === family).length
    ])
  );
  const countBySourceActor = Object.fromEntries(
    INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_ACTORS.map((actor) => [
      actor,
      entries.filter((entry) => entry.sourceActor === actor).length
    ])
  );
  const countByTargetActor = Object.fromEntries(
    INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_ACTORS.map((actor) => [
      actor,
      entries.filter((entry) => entry.targetActor === actor).length
    ])
  );
  const countByEncodedHandoffMode = Object.fromEntries(
    INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_MODES.map((mode) => [
      mode,
      entries.filter((entry) => entry.encodedHandoffMode === mode).length
    ])
  );

  return {
    interAgentEncodedHandoffConformanceKind:
      INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_KIND,
    handoffEntryCount: entries.length,
    handoffIds: entries.map((entry) => entry.handoffId),
    oneClickOptionCount: options.length,
    oneClickOptionIds: options.map((option) => option.optionId),
    handoffFamilies: [...INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_FAMILIES],
    sourceTargetActors: [...INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_ACTORS],
    currentStatusValues: [...INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_STATUSES],
    encodedHandoffModes: [...INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_MODES],
    countByFamily,
    countBySourceActor,
    countByTargetActor,
    countByEncodedHandoffMode,
    glossopetraeArchitectureReferenceOnly: true,
    glossopetraeCopiedVendoredInstalledImportedIntegrated: false,
    interAgentEncodedHandoffMetadataOnly: true,
    deterministicProtocolSpecIdentityMetadataRecorded: true,
    sharedHandoffConformanceExpectationsRecorded: true,
    locusMediatedHarnessBridgeMetadataOnly: true,
    fabricCoordinationEnvelopeMetadataOnly: true,
    operatorPlaintextFinalOutputTranslatorRequirementRecorded: true,
    oneClickOperatorOptionMetadataOnly: true,
    rawProtocolAuditVisibilityRequired: true,
    futureProtocolReferencesMetadataOnly: true,
    encodedContentCannotChangeReportRunsChecks: true,
    encodedContentCannotAuthorizeRuntime: true,
    encodedContentCannotExposeCommands: true,
    encodedContentCannotBypassBlockedCliBehavior: true,
    allBlockedAuthorizationFlagsFalse: true,
    allUnsafeEncodedHandoffRuntimeFlagsFalse: true,
    allRuntimeEffectsFalse: true,
    allEntriesNonAuthorizing: true
  };
}
function interAgentEncodedHandoffConformanceValidationRules() {
  return {
    missingRequiredFieldsFailClosed: true,
    unknownHandoffFamiliesFailClosed: true,
    unknownSourceTargetActorsFailClosed: true,
    unknownEncodedHandoffModesFailClosed: true,
    unknownCurrentStatusesFailClosed: true,
    enabledAuthorizationFlagsFailClosed: true,
    reportRunsChecksTrueFailClosed: true,
    runtimeAuthorizationAttemptsFailClosed: true,
    commandExposureAttemptsFailClosed: true,
    blockedCliBypassAttemptsFailClosed: true,
    hiddenCodecTranslatorEncoderDecoderConlangExecutionSemanticsFailClosed:
      true,
    hiddenSteganographyCovertChannelTokenizerExploitGuardrailEvasionBypassSemanticsFailClosed:
      true,
    hiddenImportExportPackagePersistenceSemanticsFailClosed: true,
    hiddenFabricWebsocketHttpMcpTaskRuntimeSemanticsFailClosed: true,
    secureDropImplementationSemanticsFailClosed: true,
    unsafeRuntimeCommandConnectorFabricWebsocketHttpMcpTaskSecureDropServiceDiscoveryScheduleFilesystemProcessFlagsFailClosed:
      true,
    nestedUnsafeFlagsFailClosed: true,
    noncanonicalHandoffEntriesFailClosed: true,
    validationImplementsEncodedHandoffRuntime: false,
    validationImplementsCodec: false,
    validationImplementsTranslatorRuntime: false,
    validationImplementsEncoderDecoder: false,
    validationImplementsConlangGenerator: false,
    validationImplementsStegoOrCovertChannel: false,
    validationImplementsTransport: false,
    validationImplementsFabricRuntime: false,
    validationImplementsBackendApiServer: false,
    validationImplementsImportExport: false,
    validationImplementsPackagePersistence: false,
    validationRunsRuntime: false
  };
}
function interAgentEncodedHandoffConformanceGaps() {
  return [
    "No encoded handoff protocol schema has been promoted into an executable codec, translator, encoder, decoder, conlang generator, or protocol runtime.",
    "Locus-mediated harness bridge behavior is metadata-only; no Locus integration, display controls, command exposure, runtime channel, or external harness bridge exists.",
    "Fabric remains a future coordination envelope only and has no bus, broker, transport, adapter, connector, registry, scheduler, importer, exporter, package distributor, or task executor.",
    "Operator plaintext final-output translation and raw protocol/audit visibility are requirements only; no translator runtime, transcript persistence, audit writer, or UI exists.",
    "Future protocol references such as A2A, ACP, AMP, ANP, Agora, LMOS, MCP, Fabric, Matrix, gRPC, MQTT, and libp2p remain metadata-only and require separate authorization."
  ];
}
function interAgentEncodedHandoffConformanceState(reviewedAt) {
  const handoffEntries = interAgentEncodedHandoffConformanceEntries();
  const oneClickOptions = interAgentEncodedHandoffConformanceOneClickOptions();

  return {
    schema: INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_STATE_SCHEMA,
    schemaVersion: INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_VERSION,
    stateKind: INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_KIND,
    stateMode: "review-only",
    reviewedAt,
    sourcePhaseContext: {
      phase559FabricAwareApiBackendContractBoundaryMap:
        "tests/fixtures/host-policy/phase5-59/fabric-aware-api-backend-contract-boundary-map.json",
      glossopetraeArchitectureReferenceOnly: true,
      glossopetraeCopiedVendoredInstalledImportedIntegrated: false,
      locusMediatedCommunicationWithOtherHarnessesMetadataOnly: true,
      fabricCoordinationEnvelopeMetadataOnly: true,
      secureDropCanonicalOwner: "content-fabric",
      futureProtocolReferencesMetadataOnly: true,
      runtimeStillBlocked: true
    },
    handoffEntries,
    oneClickOptions,
    handoffConformanceSummary:
      interAgentEncodedHandoffConformanceSummary(handoffEntries, oneClickOptions),
    invalidHandoffCasePolicy:
      interAgentEncodedHandoffConformanceValidationRules(),
    topInterAgentHandoffFabricApiBackendGaps:
      interAgentEncodedHandoffConformanceGaps(),
    recommendedNextPhase:
      "phase-5.61-review-only-database-storage-contract-boundary-map",
    interAgentEncodedHandoffConformanceOnly: true,
    reviewOnly: true,
    metadataOnly: true,
    authoritative: false,
    nonAuthorizingProof: true,
    reportRunsChecks: false,
    encodedHandoffRuntimeImplementedByArdyn: false,
    codecImplemented: false,
    translatorRuntimeImplemented: false,
    encoderImplemented: false,
    decoderImplemented: false,
    conlangGeneratorImplemented: false,
    seedGeneratorImplemented: false,
    protocolRuntimeImplemented: false,
    covertChannelImplemented: false,
    stegoLayerImplemented: false,
    semanticStegoImplemented: false,
    tokenExploiterImplemented: false,
    guardrailEvasionImplemented: false,
    bypassPathImplemented: false,
    hiddenPayloadPathImplemented: false,
    transportImplementedByArdyn: false,
    fabricRuntimeImplementedByArdyn: false,
    backendRuntimeImplementedByArdyn: false,
    apiEndpointImplementedByArdyn: false,
    serverImplementedByArdyn: false,
    importExportPathImplementedByArdyn: false,
    packageDistributionImplementedByArdyn: false,
    persistenceImplementedByArdyn: false,
    commandExposureEnabled: false,
    commandRuntimeControlEnabled: false,
    runtimeExecutionEnabled: false,
    databaseStorageRuntimeWritesEnabled: false,
    secretsRuntimeIngestionEnabled: false,
    connectorGrantProduced: false,
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
function interAgentEncodedHandoffConformanceResult({
  reviewedAt,
  reviewedAtDefaulted,
  classification,
  accepted,
  interAgentEncodedHandoffConformance
}) {
  return {
    schema: INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_SCHEMA,
    schemaVersion: INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_VERSION,
    interAgentEncodedHandoffConformanceKind:
      INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_KIND,
    interAgentEncodedHandoffConformanceMode: "review-only",
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    interAgentEncodedHandoffConformanceProduced: accepted,
    interAgentEncodedHandoffConformance,
    handoffConformanceSummary: accepted
      ? interAgentEncodedHandoffConformance.handoffConformanceSummary
      : null,
    handoffEntries: accepted
      ? interAgentEncodedHandoffConformance.handoffEntries
      : [],
    oneClickOptions: accepted
      ? interAgentEncodedHandoffConformance.oneClickOptions
      : [],
    invalidHandoffCasePolicy: accepted
      ? interAgentEncodedHandoffConformance.invalidHandoffCasePolicy
      : interAgentEncodedHandoffConformanceValidationRules(),
    topInterAgentHandoffFabricApiBackendGaps: accepted
      ? interAgentEncodedHandoffConformance
          .topInterAgentHandoffFabricApiBackendGaps
      : [],
    recommendedNextPhase: accepted
      ? interAgentEncodedHandoffConformance.recommendedNextPhase
      : null,
    interAgentEncodedHandoffConformanceOnly: true,
    reviewOnly: true,
    metadataOnly: true,
    authoritative: false,
    nonAuthorizingProof: true,
    reportRunsChecks: false,
    encodedHandoffRuntimeImplementedByArdyn: false,
    codecImplemented: false,
    translatorRuntimeImplemented: false,
    encoderImplemented: false,
    decoderImplemented: false,
    conlangGeneratorImplemented: false,
    seedGeneratorImplemented: false,
    protocolRuntimeImplemented: false,
    covertChannelImplemented: false,
    stegoLayerImplemented: false,
    semanticStegoImplemented: false,
    tokenExploiterImplemented: false,
    guardrailEvasionImplemented: false,
    bypassPathImplemented: false,
    hiddenPayloadPathImplemented: false,
    transportImplementedByArdyn: false,
    fabricRuntimeImplementedByArdyn: false,
    backendRuntimeImplementedByArdyn: false,
    apiEndpointImplementedByArdyn: false,
    serverImplementedByArdyn: false,
    importExportPathImplementedByArdyn: false,
    packageDistributionImplementedByArdyn: false,
    persistenceImplementedByArdyn: false,
    commandExposureEnabled: false,
    commandRuntimeControlEnabled: false,
    runtimeExecutionEnabled: false,
    databaseStorageRuntimeWritesEnabled: false,
    secretsRuntimeIngestionEnabled: false,
    connectorGrantProduced: false,
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
            encodedHandoffRuntimeAuthorized: false,
            commandExposureAuthorized: false,
            reportRunsChecks: false
          }
        ],
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}
export function createInterAgentEncodedHandoffConformanceForReview(
  input = {}
) {
  const inputRecord =
    interAgentEncodedHandoffConformanceInputRecord(input);
  const reviewedAt =
    interAgentEncodedHandoffConformanceReviewedAt(inputRecord);
  const reviewedAtDefaulted = isReviewedAtDefaulted(inputRecord);
  const classification =
    interAgentEncodedHandoffConformanceInputClassification(inputRecord);
  const accepted =
    classification ===
    VALID_INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_CLASSIFICATION;
  const interAgentEncodedHandoffConformance = accepted
    ? interAgentEncodedHandoffConformanceState(reviewedAt)
    : null;

  return interAgentEncodedHandoffConformanceResult({
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    accepted,
    interAgentEncodedHandoffConformance
  });
}