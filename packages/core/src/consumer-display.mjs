function consumerDisplayAccessibilityForbiddenBehavior() {
  return {
    ...productionReadinessCoverageMatrixForbiddenBehavior(),
    uiFrontendBrowserCodeImplemented: false,
    consumerUiImplemented: false,
    displaySurfaceImplemented: false,
    browserRuntimeEnabled: false,
    interactiveControlEnabled: false,
    hiddenActionSemanticsEnabled: false,
    autoExecutionEnabled: false,
    colorOnlyStatusIndicatorAllowed: false,
    motionRequiredForStatusUnderstanding: false,
    accessibilityComplianceCertified: false,
    locusRuntimeDependencyAdded: false,
    multiverseRuntimeDependencyAdded: false,
    consumerRuntimeIntegrationAdded: false
  };
}


// Modularization: consumer-display contract maps & fixtures extracted from index.mjs
// (phases 5.49-5.58). Public surface preserved via index.mjs re-export shims.
const CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_HANDOFF_EXTRA_UNSAFE_FIELDS =
  Object.freeze([
    "resultImporterEnabled",
    "resultImporterImplementedByArdyn",
    "resultExporterEnabled",
    "resultExporterImplementedByArdyn",
    "resultImportCommandImplemented",
    "resultExportCommandImplemented",
    "resultHandoffExecutionEnabled",
    "resultHandoffImportEnabled",
    "resultHandoffExportEnabled",
    "resultHandoffCiEnabled",
    "resultHandoffRuntimeEnabled",
    "consumerResultImporterImplemented",
    "consumerResultExporterImplemented"
  ]);
const CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_INTAKE_BOUNDARY_EXTRA_UNSAFE_FIELDS =
  Object.freeze([
    "resultValidatorEnabled",
    "resultValidatorImplementedByArdyn",
    "reviewRouterEnabled",
    "reviewRouterImplementedByArdyn",
    "evaluatorEnabled",
    "evaluatorImplementedByArdyn",
    "evaluatorExecutionEnabled",
    "approvalPathEnabled",
    "approvalPathImplementedByArdyn",
    "approvalDecisionEnabled",
    "approvalDecisionProduced",
    "approvalDecisionProducedByArdyn",
    "approvalGrantEnabled",
    "approvalGrantProduced",
    "approvalGrantProducedByArdyn",
    "resultReviewIntakeEnabled",
    "resultReviewIntakeImportEnabled",
    "resultReviewIntakeExportEnabled",
    "resultReviewIntakeValidationEnabled",
    "resultReviewIntakeRoutingEnabled",
    "resultReviewIntakeEvaluationEnabled",
    "resultReviewIntakeApprovalEnabled",
    "resultReviewIntakeCiEnabled",
    "resultReviewIntakeRuntimeEnabled",
    "consumerResultValidatorImplemented",
    "consumerReviewRouterImplemented",
    "consumerEvaluatorImplemented",
    "consumerApprovalPathImplemented"
  ]);
const CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_PACKAGE_BOUNDARY_EXTRA_UNSAFE_FIELDS =
  Object.freeze([
    "packageExportEnabled",
    "packageExportImplemented",
    "packageImportEnabled",
    "packageImportImplemented",
    "packageWriterEnabled",
    "packageWriterImplemented",
    "packageReaderEnabled",
    "packageReaderImplemented",
    "packagePersistenceEnabled",
    "packagePersistenceImplemented",
    "packageDiscoveryEnabled",
    "packageDiscoveryImplemented",
    "packageDistributionEnabled",
    "packageDistributionImplemented",
    "packageProducedByArdyn",
    "resultReviewPackageEnabled",
    "resultReviewPackageProduced",
    "resultReviewPackageExportEnabled",
    "resultReviewPackageImportEnabled",
    "resultReviewPackageValidationEnabled",
    "resultReviewPackageRoutingEnabled",
    "resultReviewPackagePersistenceEnabled",
    "resultReviewPackageEvaluationEnabled",
    "resultReviewPackageApprovalEnabled",
    "resultReviewPackageCiEnabled",
    "resultReviewPackageRuntimeEnabled",
    "consumerPackageWriterImplemented",
    "consumerPackageReaderImplemented",
    "consumerPackagePersistenceImplemented"
  ]);




import { isPlainObjectRecord, isUtcIsoTimestampWithMilliseconds, isReviewedAtDefaulted } from "./internal/utils.mjs";
import { APPROVAL_PREREQUISITE_SOURCE_PREFLIGHT_DEFAULT_REVIEWED_AT, productionReadinessCoverageMatrixForbiddenBehavior, REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE } from "./internal/review-shared.mjs";

export const CONSUMER_DISPLAY_ACCESSIBILITY_CONTRACT_MAP_SCHEMA =
  "ardyn.phase-5.49.consumer-display-accessibility-contract-map-result";
export const CONSUMER_DISPLAY_ACCESSIBILITY_CONTRACT_MAP_VERSION = "0.1.0";
export const CONSUMER_DISPLAY_ACCESSIBILITY_CONTRACT_MAP_KIND =
  "consumer-display-accessibility-contract-map";
export const CONSUMER_DISPLAY_FIXTURE_SCHEMA_BOUNDARY_SCHEMA =
  "ardyn.phase-5.50.consumer-display-fixture-schema-boundary-result";
export const CONSUMER_DISPLAY_FIXTURE_SCHEMA_BOUNDARY_VERSION = "0.1.0";
export const CONSUMER_DISPLAY_FIXTURE_SCHEMA_BOUNDARY_KIND =
  "consumer-display-fixture-schema-boundary";
export const CONSUMER_DISPLAY_FIXTURE_EXAMPLE_PACK_SCHEMA =
  "ardyn.phase-5.51.consumer-display-fixture-example-pack-result";
export const CONSUMER_DISPLAY_FIXTURE_EXAMPLE_PACK_VERSION = "0.1.0";
export const CONSUMER_DISPLAY_FIXTURE_EXAMPLE_PACK_KIND =
  "consumer-display-fixture-example-pack";
export const CONSUMER_DISPLAY_FIXTURE_CONFORMANCE_HANDOFF_SCHEMA =
  "ardyn.phase-5.52.consumer-display-fixture-conformance-handoff-result";
export const CONSUMER_DISPLAY_FIXTURE_CONFORMANCE_HANDOFF_VERSION = "0.1.0";
export const CONSUMER_DISPLAY_FIXTURE_CONFORMANCE_HANDOFF_KIND =
  "consumer-display-fixture-conformance-handoff";
export const CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_REQUIREMENTS_SCHEMA =
  "ardyn.phase-5.53.consumer-owned-display-conformance-runner-requirements-result";
export const CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_REQUIREMENTS_VERSION =
  "0.1.0";
export const CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_REQUIREMENTS_KIND =
  "consumer-owned-display-conformance-runner-requirements";
export const CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_TEST_PLAN_SCHEMA =
  "ardyn.phase-5.54.consumer-owned-display-conformance-runner-test-plan-result";
export const CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_TEST_PLAN_VERSION =
  "0.1.0";
export const CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_TEST_PLAN_KIND =
  "consumer-owned-display-conformance-runner-test-plan";
export const CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_RESULT_SCHEMA_BOUNDARY_SCHEMA =
  "ardyn.phase-5.55.consumer-owned-display-conformance-runner-result-schema-boundary-result";
export const CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_RESULT_SCHEMA_BOUNDARY_VERSION =
  "0.1.0";
export const CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_RESULT_SCHEMA_BOUNDARY_KIND =
  "consumer-owned-display-conformance-runner-result-schema-boundary";
export const CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_HANDOFF_SCHEMA =
  "ardyn.phase-5.56.consumer-owned-display-conformance-result-handoff-result";
export const CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_HANDOFF_VERSION =
  "0.1.0";
export const CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_HANDOFF_KIND =
  "consumer-owned-display-conformance-result-handoff";
export const CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_INTAKE_BOUNDARY_SCHEMA =
  "ardyn.phase-5.57.consumer-owned-display-conformance-result-review-intake-boundary-result";
export const CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_INTAKE_BOUNDARY_VERSION =
  "0.1.0";
export const CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_INTAKE_BOUNDARY_KIND =
  "consumer-owned-display-conformance-result-review-intake-boundary";
export const CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_PACKAGE_BOUNDARY_SCHEMA =
  "ardyn.phase-5.58.consumer-owned-display-conformance-result-review-package-boundary-result";
export const CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_PACKAGE_BOUNDARY_VERSION =
  "0.1.0";
export const CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_PACKAGE_BOUNDARY_KIND =
  "consumer-owned-display-conformance-result-review-package-boundary";
const CONSUMER_DISPLAY_ACCESSIBILITY_CONTRACT_MAP_STATE_SCHEMA =
  "ardyn.phase-5.49.consumer-display-accessibility-contract-map-state";
const VALID_CONSUMER_DISPLAY_ACCESSIBILITY_CONTRACT_MAP_CLASSIFICATION =
  "valid_consumer_display_accessibility_contract_map_runtime_still_blocked";
const MALFORMED_CONSUMER_DISPLAY_ACCESSIBILITY_CONTRACT_MAP_CLASSIFICATION =
  "malformed_consumer_display_accessibility_contract_map_input_rejected";

const CONSUMER_DISPLAY_ACCESSIBILITY_CONTRACT_MAP_UNSAFE_FIELD_GROUPS =
  Object.freeze([
    Object.freeze({
      classification:
        "grant_looking_consumer_display_accessibility_contract_map_input_rejected",
      fields: Object.freeze([
        "approvalGrantProduced",
        "approvalGrantPersisted",
        "connectorGrantProduced",
        "runtimeGrantProduced",
        "displayControlGrantProduced"
      ])
    }),
    Object.freeze({
      classification:
        "approval_decision_looking_consumer_display_accessibility_contract_map_input_rejected",
      fields: Object.freeze([
        "approvalDecisionProduced",
        "approvalDecisionPersisted",
        "displayApprovalDecisionProduced"
      ])
    }),
    Object.freeze({
      classification:
        "evaluator_result_looking_consumer_display_accessibility_contract_map_input_rejected",
      fields: Object.freeze([
        "evaluatorResultProduced",
        "displayEvaluatorResultProduced"
      ])
    }),
    Object.freeze({
      classification:
        "evaluator_execution_looking_consumer_display_accessibility_contract_map_input_rejected",
      fields: Object.freeze([
        "evaluatorExecutionPerformed",
        "evaluatorExecuted",
        "displayEvaluatorExecutionPerformed"
      ])
    }),
    Object.freeze({
      classification:
        "reviewer_routing_looking_consumer_display_accessibility_contract_map_input_rejected",
      fields: Object.freeze([
        "reviewerRoutingPerformed",
        "reviewerRoutingEnabled",
        "displayReviewerRoutingPerformed"
      ])
    }),
    Object.freeze({
      classification:
        "reviewer_assignment_looking_consumer_display_accessibility_contract_map_input_rejected",
      fields: Object.freeze([
        "reviewerAssignmentPerformed",
        "reviewerAssignmentEnabled",
        "displayReviewerAssignmentPerformed"
      ])
    }),
    Object.freeze({
      classification:
        "ui_interactivity_looking_consumer_display_accessibility_contract_map_input_rejected",
      fields: Object.freeze([
        "uiInteractivityAuthorized",
        "interactiveControlEnabled",
        "displaySurfaceImplemented",
        "consumerUiImplemented",
        "browserRuntimeEnabled",
        "hiddenActionSemanticsEnabled",
        "autoExecutionEnabled"
      ])
    }),
    Object.freeze({
      classification:
        "runtime_permission_looking_consumer_display_accessibility_contract_map_input_rejected",
      fields: Object.freeze([
        "runtimePermissionGranted",
        "runtimeAuthorized",
        "frontendRuntimeAuthorized",
        "browserRuntimeAuthorized"
      ])
    }),
    Object.freeze({
      classification:
        "command_exposure_looking_consumer_display_accessibility_contract_map_input_rejected",
      fields: Object.freeze([
        "commandExposurePermissionGranted",
        "commandRuntimeControlEnabled",
        "runtimeCommandExposureEnabled",
        "controlPanelActionEnabled"
      ])
    }),
    Object.freeze({
      classification:
        "database_storage_looking_consumer_display_accessibility_contract_map_input_rejected",
      fields: Object.freeze([
        "databaseStorageRuntimeWritesEnabled",
        "runtimeDatabaseWriteEnabled",
        "storageRuntimeWriteEnabled",
        "transcriptRuntimeWritePerformed",
        "auditRuntimeWritePerformed"
      ])
    }),
    Object.freeze({
      classification:
        "secrets_looking_consumer_display_accessibility_contract_map_input_rejected",
      fields: Object.freeze([
        "secretsRuntimeIngestionEnabled",
        "secretVaultEnvAccessEnabled",
        "secretsAuthorized"
      ])
    }),
    Object.freeze({
      classification:
        "connector_fabric_network_looking_consumer_display_accessibility_contract_map_input_rejected",
      fields: Object.freeze([
        "connectorIngestionAdded",
        "connectorAccessGranted",
        "connectorAuthorizationGranted",
        "fabricRuntimeSurfaceEnabled",
        "contentFabricRuntimeBehaviorEnabled",
        "adapterRuntimeBehaviorEnabled",
        "webSocketRuntimeEnabled",
        "httpRuntimeEnabled",
        "webSocketHttpSurfaceEnabled",
        "networkServerEnabled",
        "liveRegistryConnectionEnabled"
      ])
    }),
    Object.freeze({
      classification:
        "secure_drop_looking_consumer_display_accessibility_contract_map_input_rejected",
      fields: Object.freeze([
        "secureDropImplemented",
        "secureDropCryptoImplemented",
        "secureDropTransportImplemented",
        "secureDropStegoImplemented",
        "secureDropSendReceiveImplemented",
        "secureDropInboxPollingEnabled",
        "fileSelectionEnabled",
        "filesystemScanningEnabled",
        "st3ggVendored"
      ])
    }),
    Object.freeze({
      classification:
        "mcp_task_service_discovery_schedule_looking_consumer_display_accessibility_contract_map_input_rejected",
      fields: Object.freeze([
        "mcpRuntimeExecutionEnabled",
        "mcpExecutionEnabled",
        "mcpToolExposureEnabled",
        "taskRuntimeExecutionEnabled",
        "taskExecutionEnabled",
        "serviceDiscoveryEnabled",
        "liveServiceRegistryConnectionEnabled",
        "scheduleEnforcementEnabled",
        "backgroundPollingEnabled"
      ])
    }),
    Object.freeze({
      classification:
        "process_control_looking_consumer_display_accessibility_contract_map_input_rejected",
      fields: Object.freeze([
        "processControlEnabled",
        "filesystemProcessControlEnabled",
        "filesystemWatcherEnabled",
        "liveStdinLoopEnabled",
        "runtimeStdoutWriterEnabled",
        "runtimeStderrWriterEnabled"
      ])
    })
  ]);

function consumerDisplayAccessibilityContractMapInputRecord(input) {
  return isPlainObjectRecord(input) ? input : null;
}

function consumerDisplayAccessibilityContractMapReviewedAt(inputRecord) {
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

function consumerDisplayAccessibilityContractMapInputMalformed(inputRecord) {
  return (
    inputRecord === null ||
    (Object.prototype.hasOwnProperty.call(inputRecord, "reviewedAt") &&
      !isUtcIsoTimestampWithMilliseconds(inputRecord.reviewedAt))
  );
}

function consumerDisplayAccessibilityContractMapContainsTrue(value) {
  if (value === true) {
    return true;
  }

  if (Array.isArray(value)) {
    return value.some((entry) =>
      consumerDisplayAccessibilityContractMapContainsTrue(entry)
    );
  }

  if (isPlainObjectRecord(value)) {
    return Object.values(value).some((entry) =>
      consumerDisplayAccessibilityContractMapContainsTrue(entry)
    );
  }

  return false;
}

function consumerDisplayAccessibilityContractMapKeyTruePresent(
  inputRecord,
  fields
) {
  if (inputRecord === null || !isPlainObjectRecord(inputRecord)) {
    return false;
  }

  return consumerDisplayAccessibilityContractMapFieldTruePresent(
    inputRecord,
    fields
  );
}

function consumerDisplayAccessibilityContractMapFieldTruePresent(value, fields) {
  if (Array.isArray(value)) {
    return value.some((entry) =>
      consumerDisplayAccessibilityContractMapFieldTruePresent(entry, fields)
    );
  }

  if (!isPlainObjectRecord(value)) {
    return false;
  }

  for (const [key, entry] of Object.entries(value)) {
    if (fields.includes(key) && entry === true) {
      return true;
    }

    if (consumerDisplayAccessibilityContractMapFieldTruePresent(entry, fields)) {
      return true;
    }
  }

  return false;
}

function consumerDisplayAccessibilityContractMapInputClassification(inputRecord) {
  if (consumerDisplayAccessibilityContractMapInputMalformed(inputRecord)) {
    return MALFORMED_CONSUMER_DISPLAY_ACCESSIBILITY_CONTRACT_MAP_CLASSIFICATION;
  }

  for (const group of CONSUMER_DISPLAY_ACCESSIBILITY_CONTRACT_MAP_UNSAFE_FIELD_GROUPS) {
    if (
      consumerDisplayAccessibilityContractMapKeyTruePresent(
        inputRecord,
        group.fields
      )
    ) {
      return group.classification;
    }
  }

  if (
    consumerDisplayAccessibilityContractMapContainsTrue(
      inputRecord.runtimeEffect
    ) ||
    consumerDisplayAccessibilityContractMapContainsTrue(
      inputRecord.authorizationFlags
    )
  ) {
    return "runtime_effect_true_consumer_display_accessibility_contract_map_input_rejected";
  }

  return VALID_CONSUMER_DISPLAY_ACCESSIBILITY_CONTRACT_MAP_CLASSIFICATION;
}

function consumerDisplayAccessibilityAuthorizationFlags() {
  return {
    uiInteractivityAuthorized: false,
    frontendRuntimeAuthorized: false,
    browserRuntimeAuthorized: false,
    runtimeAuthorized: false,
    commandControlAuthorized: false,
    databaseStorageAuthorized: false,
    secretsAuthorized: false,
    connectorGrantAuthorized: false,
    fabricRuntimeAuthorized: false,
    webSocketHttpAuthorized: false,
    mcpTaskRuntimeAuthorized: false,
    secureDropRuntimeAuthorized: false,
    serviceDiscoveryScheduleAuthorized: false,
    reviewerRoutingAuthorized: false,
    reviewerAssignmentAuthorized: false,
    evaluatorExecutionAuthorized: false,
    approvalDecisionAuthorized: false,
    approvalGrantAuthorized: false,
    filesystemProcessControlAuthorized: false
  };
}

function consumerDisplayAccessibilityEntry({
  consumerName,
  displaySurfaceId,
  sourceArdynArtifactType,
  readableLabel,
  shortDescription,
  longDescription,
  severityStatusVocabulary,
  keyboardScreenReaderDisplayNotes,
  allowedDisplayBehavior,
  forbiddenDisplayBehavior,
  requiredFutureContractBeforeInteractivity
}) {
  return {
    consumerName,
    displaySurfaceId,
    sourceArdynArtifactType,
    allowedDisplayBehavior,
    forbiddenDisplayBehavior,
    accessibilityRequirementNotes: {
      readableLabel,
      shortDescription,
      longDescription,
      severityStatusVocabulary,
      keyboardScreenReaderDisplayNotes,
      colorIndependentStatusIndicatorRequired: true,
      reducedMotionDefaultStaticDisplayRequired: true,
      noAutoExecutionNoHiddenActionSemantics: true
    },
    requiredFutureContractBeforeInteractivity,
    authorizationFlags: consumerDisplayAccessibilityAuthorizationFlags(),
    nonAuthorizingProof: true
  };
}

function consumerDisplayAccessibilityEntries() {
  return [
    consumerDisplayAccessibilityEntry({
      consumerName: "Locus",
      displaySurfaceId: "locus.status-control-panels",
      sourceArdynArtifactType: "phase-status-report",
      readableLabel: "Ardyn status and control readiness",
      shortDescription: "Shows review-only Ardyn status without controls.",
      longDescription:
        "Locus may display Ardyn phase status, blocked runtime state, and readiness summaries as static review metadata only.",
      severityStatusVocabulary: [
        "review_only",
        "runtime_blocked",
        "needs_future_contract",
        "not_authorized"
      ],
      keyboardScreenReaderDisplayNotes:
        "Expose status text and blocked reason as readable static content; do not attach keyboard activation to blocked controls.",
      allowedDisplayBehavior:
        "Render phase status, current posture, and blocked runtime state as read-only labels.",
      forbiddenDisplayBehavior: [
        "start runtime",
        "enable controls",
        "route reviewer",
        "assign reviewer",
        "persist approval",
        "trigger command"
      ],
      requiredFutureContractBeforeInteractivity:
        "A future Locus control-surface contract plus explicit Ardyn command/runtime authorization."
    }),
    consumerDisplayAccessibilityEntry({
      consumerName: "Locus",
      displaySurfaceId: "locus.review-artifact-panels",
      sourceArdynArtifactType: "review-artifact metadata",
      readableLabel: "Review artifact summary",
      shortDescription: "Displays review artifacts as non-authorizing evidence.",
      longDescription:
        "Locus may show review artifact summaries, classifications, and rejection reasons without treating them as approvals or grants.",
      severityStatusVocabulary: [
        "accepted_for_review",
        "rejected",
        "malformed",
        "non_authorizing"
      ],
      keyboardScreenReaderDisplayNotes:
        "Keep artifact sections navigable by heading and label every rejection reason as text.",
      allowedDisplayBehavior:
        "Render artifact fields, source phase, and non-authorizing proof flags as static evidence.",
      forbiddenDisplayBehavior: [
        "approval decision",
        "approval grant",
        "evaluator execution",
        "reviewer assignment",
        "runtime permission",
        "audit runtime write"
      ],
      requiredFutureContractBeforeInteractivity:
        "A future human review workflow contract with separate approval-decision and grant phases."
    }),
    consumerDisplayAccessibilityEntry({
      consumerName: "Locus",
      displaySurfaceId: "locus.capability-metadata-panels",
      sourceArdynArtifactType: "capability metadata",
      readableLabel: "Capability metadata",
      shortDescription: "Shows capability descriptions without invoking tools.",
      longDescription:
        "Locus may display Ardyn capability names, tags, scopes, and blocked authorization state without adapter calls or tool execution.",
      severityStatusVocabulary: [
        "available_as_metadata",
        "blocked",
        "approval_required",
        "not_executable"
      ],
      keyboardScreenReaderDisplayNotes:
        "Expose capability name, status, and blocked reason in the same focus region.",
      allowedDisplayBehavior:
        "Render capability metadata, requested scopes, and blocked execution status.",
      forbiddenDisplayBehavior: [
        "adapter runtime call",
        "connector grant",
        "MCP execution",
        "task execution",
        "secret ingestion",
        "network fetch"
      ],
      requiredFutureContractBeforeInteractivity:
        "A future capability invocation contract with explicit adapter, connector, MCP/task, and secret boundaries."
    }),
    consumerDisplayAccessibilityEntry({
      consumerName: "Locus",
      displaySurfaceId: "locus.blocked-command-runtime-indicators",
      sourceArdynArtifactType: "blocked runtime command metadata",
      readableLabel: "Runtime unavailable",
      shortDescription: "Shows blocked command/runtime status.",
      longDescription:
        "Locus may display that runtime and command exposure are unavailable, including zero-stdout failure expectations.",
      severityStatusVocabulary: [
        "runtime_unavailable",
        "command_blocked",
        "dry_run_blocked",
        "not_authorized"
      ],
      keyboardScreenReaderDisplayNotes:
        "Announce unavailable status and reason without presenting the indicator as a button.",
      allowedDisplayBehavior:
        "Render blocked command state and static error semantics.",
      forbiddenDisplayBehavior: [
        "command exposure",
        "runtime start",
        "dry-run bypass",
        "process spawn",
        "stdin loop",
        "stdout runtime writer"
      ],
      requiredFutureContractBeforeInteractivity:
        "A future command-exposure approval and runtime-enable contract."
    }),
    consumerDisplayAccessibilityEntry({
      consumerName: "Locus",
      displaySurfaceId: "locus.future-secure-drop-compose-inbox-indicators",
      sourceArdynArtifactType: "future content-fabric secure drop placeholder",
      readableLabel: "Secure Drop placeholder",
      shortDescription: "Shows future compose/inbox status as metadata only.",
      longDescription:
        "Locus may display future Secure Drop compose and inbox placeholders only as unavailable content-fabric capability references.",
      severityStatusVocabulary: [
        "future_placeholder",
        "not_implemented",
        "metadata_only",
        "blocked"
      ],
      keyboardScreenReaderDisplayNotes:
        "Label compose and inbox placeholders as unavailable; do not expose file picker or send semantics.",
      allowedDisplayBehavior:
        "Render unavailable compose/inbox metadata and future-contract notes.",
      forbiddenDisplayBehavior: [
        "Secure Drop crypto",
        "Secure Drop transport",
        "stego",
        "send/receive",
        "inbox polling",
        "file selection",
        "filesystem scanning"
      ],
      requiredFutureContractBeforeInteractivity:
        "A future canonical content-fabric Secure Drop contract with separate crypto, transport, inbox, file, connector, and secret authorization."
    }),
    consumerDisplayAccessibilityEntry({
      consumerName: "Multiverse",
      displaySurfaceId: "multiverse.world-project-orchestration-status-cards",
      sourceArdynArtifactType: "consumer planning and readiness metadata",
      readableLabel: "World/project orchestration status",
      shortDescription: "Shows orchestration readiness without orchestration.",
      longDescription:
        "Multiverse may display project/world readiness cards derived from Ardyn metadata without starting tasks, registry connections, or orchestration loops.",
      severityStatusVocabulary: [
        "planned",
        "blocked",
        "review_only",
        "requires_future_phase"
      ],
      keyboardScreenReaderDisplayNotes:
        "Keep card status, blocked reason, and future contract in text, independent of color.",
      allowedDisplayBehavior:
        "Render world/project readiness status and blocked runtime indicators.",
      forbiddenDisplayBehavior: [
        "orchestration loop",
        "task execution",
        "registry connection",
        "background polling",
        "schedule enforcement",
        "process control"
      ],
      requiredFutureContractBeforeInteractivity:
        "A future Multiverse orchestration contract with explicit task, registry, schedule, and process-control authorization."
    }),
    consumerDisplayAccessibilityEntry({
      consumerName: "Multiverse",
      displaySurfaceId: "multiverse.visible-ai-capability-badges",
      sourceArdynArtifactType: "visible capability badge metadata",
      readableLabel: "AI capability badge",
      shortDescription: "Displays capability badge state without tool use.",
      longDescription:
        "Multiverse may show visible AI capability badges that distinguish metadata availability from executable capability.",
      severityStatusVocabulary: [
        "metadata_available",
        "blocked",
        "not_executable",
        "authorization_required"
      ],
      keyboardScreenReaderDisplayNotes:
        "Badge text must include the status word and not rely on color alone.",
      allowedDisplayBehavior:
        "Render visible badges for capability status and authorization blockers.",
      forbiddenDisplayBehavior: [
        "tool execution",
        "MCP tool exposure",
        "connector grant",
        "adapter runtime",
        "secret access",
        "network request"
      ],
      requiredFutureContractBeforeInteractivity:
        "A future visible capability interaction contract with tool, MCP, connector, and adapter authorization."
    }),
    consumerDisplayAccessibilityEntry({
      consumerName: "Multiverse",
      displaySurfaceId: "multiverse.task-capability-wrapper-status-cards",
      sourceArdynArtifactType: "task/capability wrapper metadata",
      readableLabel: "Task wrapper status",
      shortDescription: "Shows task wrapper state without task execution.",
      longDescription:
        "Multiverse may render task/capability wrapper status cards that show planned, blocked, and authorization-required states only.",
      severityStatusVocabulary: [
        "planned_only",
        "blocked",
        "not_started",
        "non_authorizing"
      ],
      keyboardScreenReaderDisplayNotes:
        "Use static region labels for task status; do not hide activation behind card click handlers.",
      allowedDisplayBehavior:
        "Render task wrapper metadata and blocked task runtime state.",
      forbiddenDisplayBehavior: [
        "task runtime",
        "MCP execution",
        "approval grant",
        "runtime permission",
        "command exposure",
        "transcript runtime write"
      ],
      requiredFutureContractBeforeInteractivity:
        "A future task wrapper execution contract with separate MCP/task, approval, transcript, and audit-write authorization."
    }),
    consumerDisplayAccessibilityEntry({
      consumerName: "Multiverse",
      displaySurfaceId: "multiverse.citizen-adapter-candidate-badges",
      sourceArdynArtifactType: "adapter candidate metadata",
      readableLabel: "Citizen/adapter candidate",
      shortDescription: "Shows candidate adapter status as review metadata.",
      longDescription:
        "Multiverse may display citizen and adapter candidate badges without connector discovery, adapter runtime behavior, or registry scanning.",
      severityStatusVocabulary: [
        "candidate",
        "needs_review",
        "blocked",
        "not_connected"
      ],
      keyboardScreenReaderDisplayNotes:
        "Expose candidate state and blocked connector reason as text adjacent to the badge.",
      allowedDisplayBehavior:
        "Render candidate badge metadata, source artifact type, and blocked connector status.",
      forbiddenDisplayBehavior: [
        "connector discovery",
        "adapter runtime",
        "service scanning",
        "registry write",
        "credential use",
        "filesystem scanning"
      ],
      requiredFutureContractBeforeInteractivity:
        "A future adapter candidate contract with connector discovery, registry, service-scan, and credential boundaries."
    }),
    consumerDisplayAccessibilityEntry({
      consumerName: "Multiverse",
      displaySurfaceId:
        "multiverse.registry-websocket-mcp-task-runtime-blocked-indicators",
      sourceArdynArtifactType: "registry/websocket/MCP/task blocked metadata",
      readableLabel: "Registry and task runtime blocked",
      shortDescription: "Shows registry, websocket, MCP, and task runtime blocks.",
      longDescription:
        "Multiverse may display registry, websocket, MCP, and task runtime indicators only as blocked status metadata.",
      severityStatusVocabulary: [
        "blocked",
        "not_connected",
        "runtime_unavailable",
        "future_contract_required"
      ],
      keyboardScreenReaderDisplayNotes:
        "Announce each blocked runtime category explicitly and keep the indicator static by default.",
      allowedDisplayBehavior:
        "Render blocked registry, websocket, MCP, and task runtime categories.",
      forbiddenDisplayBehavior: [
        "live registry connection",
        "websocket runtime",
        "HTTP runtime",
        "MCP tool exposure",
        "MCP execution",
        "task execution"
      ],
      requiredFutureContractBeforeInteractivity:
        "A future registry/websocket/MCP/task runtime authorization contract."
    })
  ];
}

function consumerDisplayAccessibilitySummary(entries) {
  const locusDisplaySurfaceCount = entries.filter(
    ({ consumerName }) => consumerName === "Locus"
  ).length;
  const multiverseDisplaySurfaceCount = entries.filter(
    ({ consumerName }) => consumerName === "Multiverse"
  ).length;

  return {
    contractMapKind: CONSUMER_DISPLAY_ACCESSIBILITY_CONTRACT_MAP_KIND,
    contractMapMode: "review-only",
    entryCount: entries.length,
    consumerNames: ["Locus", "Multiverse"],
    locusDisplaySurfaceCount,
    multiverseDisplaySurfaceCount,
    accessibilityRequirementFieldsCovered: true,
    readableLabelsPresentForAllEntries: entries.every(
      ({ accessibilityRequirementNotes }) =>
        accessibilityRequirementNotes.readableLabel.length > 0
    ),
    descriptionsPresentForAllEntries: entries.every(
      ({ accessibilityRequirementNotes }) =>
        accessibilityRequirementNotes.shortDescription.length > 0 &&
        accessibilityRequirementNotes.longDescription.length > 0
    ),
    severityStatusVocabularyPresentForAllEntries: entries.every(
      ({ accessibilityRequirementNotes }) =>
        accessibilityRequirementNotes.severityStatusVocabulary.length >= 4
    ),
    keyboardScreenReaderNotesPresentForAllEntries: entries.every(
      ({ accessibilityRequirementNotes }) =>
        accessibilityRequirementNotes.keyboardScreenReaderDisplayNotes.length > 0
    ),
    colorIndependentStatusIndicatorRequiredForAllEntries: entries.every(
      ({ accessibilityRequirementNotes }) =>
        accessibilityRequirementNotes.colorIndependentStatusIndicatorRequired ===
        true
    ),
    reducedMotionDefaultStaticRequiredForAllEntries: entries.every(
      ({ accessibilityRequirementNotes }) =>
        accessibilityRequirementNotes
          .reducedMotionDefaultStaticDisplayRequired === true
    ),
    noAutoExecutionNoHiddenActionSemanticsForAllEntries: entries.every(
      ({ accessibilityRequirementNotes }) =>
        accessibilityRequirementNotes.noAutoExecutionNoHiddenActionSemantics ===
        true
    ),
    allAuthorizationFlagsFalse: entries.every(({ authorizationFlags }) =>
      Object.values(authorizationFlags).every((value) => value === false)
    ),
    allEntriesNonAuthorizing: entries.every(
      ({ nonAuthorizingProof }) => nonAuthorizingProof === true
    ),
    locusSecureDropPlaceholdersMetadataOnly: true,
    multiverseRegistryWebsocketMcpTaskBlockedIndicatorsCovered: true,
    uiFrontendBrowserCodeImplemented: false,
    browserRuntimeEnabled: false,
    consumerRuntimeIntegrationAdded: false,
    runtimeExecutionEnabled: false,
    commandRuntimeControlEnabled: false,
    databaseStorageRuntimeWritesEnabled: false,
    secretsRuntimeIngestionEnabled: false,
    connectorGrantProduced: false,
    fabricRuntimeSurfaceEnabled: false,
    webSocketHttpSurfaceEnabled: false,
    mcpToolExposureEnabled: false,
    taskExecutionEnabled: false,
    secureDropImplemented: false,
    serviceDiscoveryEnabled: false,
    scheduleEnforcementEnabled: false,
    backgroundPollingEnabled: false
  };
}

function consumerDisplayAccessibilityGaps() {
  return [
    "No Ardyn-owned frontend, browser UI, WCAG test harness, or consumer display implementation exists.",
    "Locus and Multiverse display surfaces are mapped as contracts only; consumer-owned UI fixtures and accessibility QA still need future phases.",
    "Interactive controls, approval actions, command exposure, runtime start, task execution, registry connections, and connector grants remain unauthorized.",
    "Future Secure Drop compose/inbox and Multiverse registry/websocket/MCP/task indicators are placeholders only."
  ];
}

function consumerDisplayAccessibilityState(reviewedAt) {
  const entries = consumerDisplayAccessibilityEntries();

  return {
    schema: CONSUMER_DISPLAY_ACCESSIBILITY_CONTRACT_MAP_STATE_SCHEMA,
    schemaVersion: CONSUMER_DISPLAY_ACCESSIBILITY_CONTRACT_MAP_VERSION,
    stateKind: "consumer-display-accessibility-contract-map-state",
    stateMode: "review-only",
    reviewedAt,
    sourcePhaseContext: {
      phase548ProductionReadinessCoverageMatrixIdentifiedFrontendGap: true,
      ardynRole: "harness-framework-contract-layer",
      locusAndMultiverseAreConsumers: true,
      consumerUiImplementedByArdyn: false
    },
    displayContractEntries: entries,
    contractMapSummary: consumerDisplayAccessibilitySummary(entries),
    topDisplayAccessibilityGaps: consumerDisplayAccessibilityGaps(),
    recommendedNextPhase:
      "phase-5.50-consumer-display-fixture-schema-boundary",
    consumerDisplayAccessibilityContractMapOnly: true,
    reviewOnly: true,
    authoritative: false,
    reviewArtifactOnly: true,
    nonAuthorizingProof: true,
    ...consumerDisplayAccessibilityForbiddenBehavior(),
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

function consumerDisplayAccessibilityRejectionReasons({
  accepted,
  classification
}) {
  const reasons = [
    "consumer_display_accessibility_contract_map_is_review_only",
    "ardyn_does_not_implement_consumer_ui_frontend_or_browser_runtime",
    "ui_runtime_command_db_storage_secrets_connector_fabric_websocket_http_mcp_task_secure_drop_authorizations_false",
    "no_auto_execution_no_hidden_action_semantics",
    "fallow_runtime_not_used",
    "runtime_enablement_still_blocked"
  ];

  return accepted
    ? reasons
    : [
        ...reasons,
        `input_classification_${classification}`
      ];
}

function consumerDisplayAccessibilityResult({
  reviewedAt,
  reviewedAtDefaulted,
  classification,
  accepted,
  consumerDisplayAccessibilityContractMap
}) {
  return {
    schema: CONSUMER_DISPLAY_ACCESSIBILITY_CONTRACT_MAP_SCHEMA,
    schemaVersion: CONSUMER_DISPLAY_ACCESSIBILITY_CONTRACT_MAP_VERSION,
    consumerDisplayAccessibilityContractMapKind:
      CONSUMER_DISPLAY_ACCESSIBILITY_CONTRACT_MAP_KIND,
    consumerDisplayAccessibilityContractMapMode: "review-only",
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    consumerDisplayAccessibilityContractMapProduced: accepted,
    consumerDisplayAccessibilityContractMap,
    contractMapSummary: accepted
      ? consumerDisplayAccessibilityContractMap.contractMapSummary
      : null,
    displayContractEntries: accepted
      ? consumerDisplayAccessibilityContractMap.displayContractEntries
      : [],
    topDisplayAccessibilityGaps: accepted
      ? consumerDisplayAccessibilityContractMap.topDisplayAccessibilityGaps
      : [],
    recommendedNextPhase: accepted
      ? consumerDisplayAccessibilityContractMap.recommendedNextPhase
      : null,
    consumerDisplayAccessibilityContractMapOnly: true,
    reviewOnly: true,
    authoritative: false,
    reviewArtifactOnly: true,
    nonAuthorizingProof: true,
    ...consumerDisplayAccessibilityForbiddenBehavior(),
    rejectionReasons: consumerDisplayAccessibilityRejectionReasons({
      accepted,
      classification
    }),
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

export function createConsumerDisplayAccessibilityContractMapForReview(
  input = {}
) {
  const inputRecord =
    consumerDisplayAccessibilityContractMapInputRecord(input);
  const reviewedAt =
    consumerDisplayAccessibilityContractMapReviewedAt(inputRecord);
  const reviewedAtDefaulted = isReviewedAtDefaulted(inputRecord);
  const classification =
    consumerDisplayAccessibilityContractMapInputClassification(inputRecord);
  const accepted =
    classification ===
    VALID_CONSUMER_DISPLAY_ACCESSIBILITY_CONTRACT_MAP_CLASSIFICATION;
  const consumerDisplayAccessibilityContractMap = accepted
    ? consumerDisplayAccessibilityState(reviewedAt)
    : null;

  return consumerDisplayAccessibilityResult({
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    accepted,
    consumerDisplayAccessibilityContractMap
  });
}

const CONSUMER_DISPLAY_FIXTURE_SCHEMA_BOUNDARY_STATE_SCHEMA =
  "ardyn.phase-5.50.consumer-display-fixture-schema-boundary-state";
const VALID_CONSUMER_DISPLAY_FIXTURE_SCHEMA_BOUNDARY_CLASSIFICATION =
  "valid_consumer_display_fixture_schema_boundary_runtime_still_blocked";
const MALFORMED_CONSUMER_DISPLAY_FIXTURE_SCHEMA_BOUNDARY_CLASSIFICATION =
  "malformed_consumer_display_fixture_schema_boundary_input_rejected";
const CONSUMER_DISPLAY_FIXTURE_SCHEMA_BOUNDARY_DISPLAY_INTENT =
  "metadata_only";

const CONSUMER_DISPLAY_FIXTURE_SCHEMA_BOUNDARY_REQUIRED_FIELDS =
  Object.freeze([
    "fixtureId",
    "consumerName",
    "displaySurfaceId",
    "sourceArdynArtifactType",
    "displayIntent",
    "readableLabel",
    "shortDescription",
    "longDescription",
    "statusSeverityVocabulary",
    "accessibilityFields",
    "allowedDisplayBehavior",
    "forbiddenDisplayBehavior",
    "requiredFutureContractBeforeInteractivity",
    "blockedAuthorizationFlags",
    "recursiveUnsafeInputFlags",
    "nonAuthorizingProof"
  ]);

const CONSUMER_DISPLAY_FIXTURE_SCHEMA_BOUNDARY_REQUIRED_ACCESSIBILITY_FIELDS =
  Object.freeze([
    "keyboardScreenReaderDisplayNotes",
    "colorIndependentStatusIndicatorRequired",
    "reducedMotionDefaultStaticDisplayRequired",
    "noAutoExecutionNoHiddenActionSemantics",
    "colorOnlyStatusForbidden",
    "motionRequiredForStatusForbidden"
  ]);

const CONSUMER_DISPLAY_FIXTURE_SCHEMA_BOUNDARY_HIDDEN_SEMANTIC_FIELDS =
  Object.freeze([
    "hiddenActionSemanticsEnabled",
    "hiddenCommandSemanticsEnabled",
    "hiddenRuntimeSemanticsEnabled",
    "commandRuntimeControlEnabled",
    "controlPanelActionEnabled",
    "autoExecutionEnabled",
    "clickToRunEnabled",
    "actionableControlEnabled",
    "interactiveControlEnabled"
  ]);

const CONSUMER_DISPLAY_FIXTURE_SCHEMA_BOUNDARY_SECURE_DROP_FIELDS =
  Object.freeze([
    "secureDropImplemented",
    "secureDropCryptoImplemented",
    "secureDropTransportImplemented",
    "secureDropStegoImplemented",
    "secureDropSendReceiveImplemented",
    "secureDropInboxPollingEnabled",
    "secureDropComposeEnabled",
    "secureDropInboxEnabled",
    "fileSelectionEnabled",
    "filesystemScanningEnabled",
    "st3ggVendored"
  ]);

const CONSUMER_DISPLAY_FIXTURE_SCHEMA_BOUNDARY_RUNTIME_SURFACE_FIELDS =
  Object.freeze([
    "webSocketRuntimeEnabled",
    "httpRuntimeEnabled",
    "webSocketHttpSurfaceEnabled",
    "fabricRuntimeSurfaceEnabled",
    "contentFabricRuntimeBehaviorEnabled",
    "mcpRuntimeExecutionEnabled",
    "mcpExecutionEnabled",
    "mcpToolExposureEnabled",
    "taskRuntimeExecutionEnabled",
    "taskExecutionEnabled",
    "adapterRuntimeBehaviorEnabled"
  ]);

function consumerDisplayFixtureSchemaBoundaryInputRecord(input) {
  return isPlainObjectRecord(input) ? input : null;
}

function consumerDisplayFixtureSchemaBoundaryReviewedAt(inputRecord) {
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

function consumerDisplayFixtureSchemaBoundaryInputMalformed(inputRecord) {
  return (
    inputRecord === null ||
    (Object.prototype.hasOwnProperty.call(inputRecord, "reviewedAt") &&
      !isUtcIsoTimestampWithMilliseconds(inputRecord.reviewedAt)) ||
    (Object.prototype.hasOwnProperty.call(inputRecord, "fixtureEntries") &&
      !Array.isArray(inputRecord.fixtureEntries))
  );
}

function consumerDisplayFixtureSchemaBoundaryInputEntries(inputRecord) {
  return Array.isArray(inputRecord?.fixtureEntries)
    ? inputRecord.fixtureEntries
    : null;
}

function consumerDisplayFixtureSchemaBoundaryEntryMissingRequiredField(entry) {
  if (!isPlainObjectRecord(entry)) {
    return true;
  }

  return CONSUMER_DISPLAY_FIXTURE_SCHEMA_BOUNDARY_REQUIRED_FIELDS.some(
    (field) => !Object.prototype.hasOwnProperty.call(entry, field)
  );
}

function consumerDisplayFixtureSchemaBoundaryAccessibilityMalformed(fields) {
  if (!isPlainObjectRecord(fields)) {
    return true;
  }

  return CONSUMER_DISPLAY_FIXTURE_SCHEMA_BOUNDARY_REQUIRED_ACCESSIBILITY_FIELDS.some(
    (field) => !Object.prototype.hasOwnProperty.call(fields, field)
  );
}

function consumerDisplayFixtureSchemaBoundaryEntryMalformed(entry) {
  return (
    consumerDisplayFixtureSchemaBoundaryEntryMissingRequiredField(entry) ||
    typeof entry.fixtureId !== "string" ||
    entry.fixtureId.length === 0 ||
    typeof entry.displaySurfaceId !== "string" ||
    entry.displaySurfaceId.length === 0 ||
    typeof entry.sourceArdynArtifactType !== "string" ||
    entry.sourceArdynArtifactType.length === 0 ||
    typeof entry.readableLabel !== "string" ||
    entry.readableLabel.length === 0 ||
    typeof entry.shortDescription !== "string" ||
    entry.shortDescription.length === 0 ||
    typeof entry.longDescription !== "string" ||
    entry.longDescription.length === 0 ||
    !Array.isArray(entry.statusSeverityVocabulary) ||
    entry.statusSeverityVocabulary.length < 4 ||
    consumerDisplayFixtureSchemaBoundaryAccessibilityMalformed(
      entry.accessibilityFields
    ) ||
    typeof entry.allowedDisplayBehavior !== "string" ||
    entry.allowedDisplayBehavior.length === 0 ||
    !Array.isArray(entry.forbiddenDisplayBehavior) ||
    entry.forbiddenDisplayBehavior.length < 6 ||
    typeof entry.requiredFutureContractBeforeInteractivity !== "string" ||
    entry.requiredFutureContractBeforeInteractivity.length === 0 ||
    !isPlainObjectRecord(entry.blockedAuthorizationFlags) ||
    !isPlainObjectRecord(entry.recursiveUnsafeInputFlags) ||
    entry.nonAuthorizingProof !== true
  );
}

function consumerDisplayFixtureSchemaBoundaryContainsFixtureIssue(
  entries,
  predicate
) {
  return entries !== null && entries.some((entry) => predicate(entry));
}

function consumerDisplayFixtureSchemaBoundaryAuthorizationFlagEnabled(entry) {
  return consumerDisplayAccessibilityContractMapContainsTrue(
    entry?.blockedAuthorizationFlags
  );
}

function consumerDisplayFixtureSchemaBoundaryRecursiveUnsafeFlagEnabled(entry) {
  return (
    consumerDisplayAccessibilityContractMapContainsTrue(
      entry?.recursiveUnsafeInputFlags
    ) ||
    CONSUMER_DISPLAY_ACCESSIBILITY_CONTRACT_MAP_UNSAFE_FIELD_GROUPS.some(
      ({ fields }) =>
        consumerDisplayAccessibilityContractMapFieldTruePresent(entry, fields)
    ) ||
    consumerDisplayAccessibilityContractMapContainsTrue(entry?.runtimeEffect)
  );
}

function consumerDisplayFixtureSchemaBoundaryInputClassification(inputRecord) {
  if (consumerDisplayFixtureSchemaBoundaryInputMalformed(inputRecord)) {
    return MALFORMED_CONSUMER_DISPLAY_FIXTURE_SCHEMA_BOUNDARY_CLASSIFICATION;
  }

  const entries = consumerDisplayFixtureSchemaBoundaryInputEntries(inputRecord);

  if (
    consumerDisplayFixtureSchemaBoundaryContainsFixtureIssue(
      entries,
      consumerDisplayFixtureSchemaBoundaryEntryMissingRequiredField
    )
  ) {
    return "missing_required_consumer_display_fixture_schema_boundary_entry_rejected";
  }

  if (
    consumerDisplayFixtureSchemaBoundaryContainsFixtureIssue(
      entries,
      (entry) => entry.consumerName !== "Locus" && entry.consumerName !== "Multiverse"
    )
  ) {
    return "unknown_consumer_name_consumer_display_fixture_schema_boundary_input_rejected";
  }

  if (
    consumerDisplayFixtureSchemaBoundaryContainsFixtureIssue(
      entries,
      (entry) =>
        ["interactive", "actionable", "runtime_action", "command_action"].includes(
          entry.displayIntent
        )
    )
  ) {
    return "interactive_actionable_intent_consumer_display_fixture_schema_boundary_input_rejected";
  }

  if (
    consumerDisplayFixtureSchemaBoundaryContainsFixtureIssue(
      entries,
      (entry) =>
        entry.displayIntent !==
        CONSUMER_DISPLAY_FIXTURE_SCHEMA_BOUNDARY_DISPLAY_INTENT
    )
  ) {
    return "unknown_display_intent_consumer_display_fixture_schema_boundary_input_rejected";
  }

  if (
    consumerDisplayFixtureSchemaBoundaryContainsFixtureIssue(
      entries,
      consumerDisplayFixtureSchemaBoundaryEntryMalformed
    )
  ) {
    return MALFORMED_CONSUMER_DISPLAY_FIXTURE_SCHEMA_BOUNDARY_CLASSIFICATION;
  }

  if (
    consumerDisplayFixtureSchemaBoundaryContainsFixtureIssue(
      entries,
      consumerDisplayFixtureSchemaBoundaryAuthorizationFlagEnabled
    )
  ) {
    return "authorization_flags_enabled_consumer_display_fixture_schema_boundary_input_rejected";
  }

  if (
    consumerDisplayFixtureSchemaBoundaryContainsFixtureIssue(
      entries,
      (entry) =>
        consumerDisplayAccessibilityContractMapFieldTruePresent(
          entry,
          CONSUMER_DISPLAY_FIXTURE_SCHEMA_BOUNDARY_HIDDEN_SEMANTIC_FIELDS
        )
    )
  ) {
    return "hidden_command_runtime_semantics_consumer_display_fixture_schema_boundary_input_rejected";
  }

  if (
    consumerDisplayFixtureSchemaBoundaryContainsFixtureIssue(
      entries,
      (entry) =>
        consumerDisplayAccessibilityContractMapFieldTruePresent(
          entry,
          CONSUMER_DISPLAY_FIXTURE_SCHEMA_BOUNDARY_SECURE_DROP_FIELDS
        )
    )
  ) {
    return "secure_drop_implementation_semantics_consumer_display_fixture_schema_boundary_input_rejected";
  }

  if (
    consumerDisplayFixtureSchemaBoundaryContainsFixtureIssue(
      entries,
      (entry) =>
        consumerDisplayAccessibilityContractMapFieldTruePresent(
          entry,
          CONSUMER_DISPLAY_FIXTURE_SCHEMA_BOUNDARY_RUNTIME_SURFACE_FIELDS
        )
    )
  ) {
    return "websocket_http_fabric_mcp_task_execution_semantics_consumer_display_fixture_schema_boundary_input_rejected";
  }

  if (
    consumerDisplayFixtureSchemaBoundaryContainsFixtureIssue(
      entries,
      consumerDisplayFixtureSchemaBoundaryRecursiveUnsafeFlagEnabled
    ) ||
    consumerDisplayFixtureSchemaBoundaryRecursiveUnsafeFlagEnabled(inputRecord)
  ) {
    return "nested_unsafe_flags_consumer_display_fixture_schema_boundary_input_rejected";
  }

  return VALID_CONSUMER_DISPLAY_FIXTURE_SCHEMA_BOUNDARY_CLASSIFICATION;
}

function consumerDisplayFixtureSchemaBoundaryRecursiveUnsafeInputFlags() {
  return {
    unsafeInputFlagsPresent: false,
    nestedUnsafeFlagTruePresent: false,
    nestedAuthorizationFlagTruePresent: false,
    hiddenCommandRuntimeSemanticsPresent: false,
    secureDropImplementationSemanticsPresent: false,
    websocketHttpFabricMcpTaskExecutionSemanticsPresent: false
  };
}

function consumerDisplayFixtureSchemaBoundaryEntry(contractEntry) {
  const {
    readableLabel,
    shortDescription,
    longDescription,
    severityStatusVocabulary,
    keyboardScreenReaderDisplayNotes
  } = contractEntry.accessibilityRequirementNotes;

  return {
    fixtureId: `phase5-50.${contractEntry.displaySurfaceId}.display-fixture`,
    consumerName: contractEntry.consumerName,
    displaySurfaceId: contractEntry.displaySurfaceId,
    sourceArdynArtifactType: contractEntry.sourceArdynArtifactType,
    displayIntent: CONSUMER_DISPLAY_FIXTURE_SCHEMA_BOUNDARY_DISPLAY_INTENT,
    readableLabel,
    shortDescription,
    longDescription,
    statusSeverityVocabulary: severityStatusVocabulary,
    accessibilityFields: {
      keyboardScreenReaderDisplayNotes,
      colorIndependentStatusIndicatorRequired: true,
      reducedMotionDefaultStaticDisplayRequired: true,
      noAutoExecutionNoHiddenActionSemantics: true,
      colorOnlyStatusForbidden: true,
      motionRequiredForStatusForbidden: true
    },
    allowedDisplayBehavior: contractEntry.allowedDisplayBehavior,
    forbiddenDisplayBehavior: contractEntry.forbiddenDisplayBehavior,
    requiredFutureContractBeforeInteractivity:
      contractEntry.requiredFutureContractBeforeInteractivity,
    blockedAuthorizationFlags: consumerDisplayAccessibilityAuthorizationFlags(),
    recursiveUnsafeInputFlags:
      consumerDisplayFixtureSchemaBoundaryRecursiveUnsafeInputFlags(),
    nonAuthorizingProof: true
  };
}

function consumerDisplayFixtureSchemaBoundaryEntries() {
  return consumerDisplayAccessibilityEntries().map(
    consumerDisplayFixtureSchemaBoundaryEntry
  );
}

function consumerDisplayFixtureSchemaBoundarySummary(entries) {
  const locusFixtureCount = entries.filter(
    ({ consumerName }) => consumerName === "Locus"
  ).length;
  const multiverseFixtureCount = entries.filter(
    ({ consumerName }) => consumerName === "Multiverse"
  ).length;

  return {
    schemaBoundaryKind: CONSUMER_DISPLAY_FIXTURE_SCHEMA_BOUNDARY_KIND,
    schemaBoundaryMode: "review-only",
    fixtureCount: entries.length,
    consumerNames: ["Locus", "Multiverse"],
    locusFixtureCount,
    multiverseFixtureCount,
    displayIntent: CONSUMER_DISPLAY_FIXTURE_SCHEMA_BOUNDARY_DISPLAY_INTENT,
    metadataOnlyDisplayIntentForAllFixtures: entries.every(
      ({ displayIntent }) =>
        displayIntent === CONSUMER_DISPLAY_FIXTURE_SCHEMA_BOUNDARY_DISPLAY_INTENT
    ),
    requiredFieldsPresentForAllFixtures: entries.every(
      (entry) =>
        !consumerDisplayFixtureSchemaBoundaryEntryMissingRequiredField(entry)
    ),
    accessibilityFieldsPresentForAllFixtures: entries.every(
      ({ accessibilityFields }) =>
        !consumerDisplayFixtureSchemaBoundaryAccessibilityMalformed(
          accessibilityFields
        )
    ),
    statusSeverityVocabularyPresentForAllFixtures: entries.every(
      ({ statusSeverityVocabulary }) => statusSeverityVocabulary.length >= 4
    ),
    colorIndependentStatusIndicatorRequiredForAllFixtures: entries.every(
      ({ accessibilityFields }) =>
        accessibilityFields.colorIndependentStatusIndicatorRequired === true &&
        accessibilityFields.colorOnlyStatusForbidden === true
    ),
    reducedMotionDefaultStaticRequiredForAllFixtures: entries.every(
      ({ accessibilityFields }) =>
        accessibilityFields.reducedMotionDefaultStaticDisplayRequired === true &&
        accessibilityFields.motionRequiredForStatusForbidden === true
    ),
    noAutoExecutionNoHiddenActionSemanticsForAllFixtures: entries.every(
      ({ accessibilityFields }) =>
        accessibilityFields.noAutoExecutionNoHiddenActionSemantics === true
    ),
    allBlockedAuthorizationFlagsFalse: entries.every(
      ({ blockedAuthorizationFlags }) =>
        Object.values(blockedAuthorizationFlags).every((value) => value === false)
    ),
    allRecursiveUnsafeInputFlagsFalse: entries.every(
      ({ recursiveUnsafeInputFlags }) =>
        Object.values(recursiveUnsafeInputFlags).every(
          (value) => value === false
        )
    ),
    allFixturesNonAuthorizing: entries.every(
      ({ nonAuthorizingProof }) => nonAuthorizingProof === true
    ),
    locusSecureDropPlaceholdersMetadataOnly: true,
    multiverseRegistryWebsocketMcpTaskBlockedIndicatorsCovered: true,
    uiFrontendBrowserCodeImplemented: false,
    renderingCodeImplemented: false,
    browserRuntimeEnabled: false,
    consumerRuntimeIntegrationAdded: false,
    interactiveControlEnabled: false,
    hiddenActionSemanticsEnabled: false,
    autoExecutionEnabled: false,
    runtimeExecutionEnabled: false,
    commandRuntimeControlEnabled: false,
    databaseStorageRuntimeWritesEnabled: false,
    secretsRuntimeIngestionEnabled: false,
    connectorGrantProduced: false,
    fabricRuntimeSurfaceEnabled: false,
    webSocketHttpSurfaceEnabled: false,
    mcpToolExposureEnabled: false,
    taskExecutionEnabled: false,
    secureDropImplemented: false,
    serviceDiscoveryEnabled: false,
    scheduleEnforcementEnabled: false,
    backgroundPollingEnabled: false
  };
}

function consumerDisplayFixtureSchemaBoundaryValidationRules() {
  return {
    missingRequiredFieldsFailClosed: true,
    unknownConsumerNamesFailClosed: true,
    unknownDisplayIntentFailsClosed: true,
    interactiveActionableIntentFailsClosed: true,
    enabledAuthorizationFlagsFailClosed: true,
    nestedUnsafeInputFlagsFailClosed: true,
    hiddenCommandRuntimeSemanticsFailClosed: true,
    secureDropImplementationSemanticsFailClosed: true,
    websocketHttpFabricMcpTaskExecutionSemanticsFailClosed: true,
    malformedFixtureEntriesFailClosed: true,
    validationPerformsRendering: false,
    validationStartsRuntime: false,
    validationWritesDbStorage: false,
    validationReadsSecrets: false,
    validationCallsExternalConsumers: false
  };
}

function consumerDisplayFixtureSchemaBoundaryGaps() {
  return [
    "The boundary defines fixture schema requirements, but no Locus or Multiverse UI fixture files are implemented by Ardyn.",
    "No browser, rendering, WCAG automation, or visual regression harness exists in Ardyn.",
    "No consumer-owned fixture conformance runner, interactive approval contract, or command/runtime control contract exists.",
    "Secure Drop and Multiverse registry/websocket/MCP/task fixture semantics remain metadata-only blocked indicators."
  ];
}

function consumerDisplayFixtureSchemaBoundaryState(reviewedAt) {
  const fixtureEntries = consumerDisplayFixtureSchemaBoundaryEntries();

  return {
    schema: CONSUMER_DISPLAY_FIXTURE_SCHEMA_BOUNDARY_STATE_SCHEMA,
    schemaVersion: CONSUMER_DISPLAY_FIXTURE_SCHEMA_BOUNDARY_VERSION,
    stateKind: "consumer-display-fixture-schema-boundary-state",
    stateMode: "review-only",
    reviewedAt,
    sourcePhaseContext: {
      precedingPhase: "5.49",
      precedingArtifact:
        "tests/fixtures/host-policy/phase5-49/consumer-display-accessibility-contract-map.json",
      phase549ConsumerDisplayAccessibilityContractMapReferenceOnly: true,
      ardynOwnsConsumerUi: false
    },
    displayFixtureEntries: fixtureEntries,
    schemaBoundarySummary:
      consumerDisplayFixtureSchemaBoundarySummary(fixtureEntries),
    invalidFixtureCasePolicy:
      consumerDisplayFixtureSchemaBoundaryValidationRules(),
    topDisplayFixtureSchemaGaps:
      consumerDisplayFixtureSchemaBoundaryGaps(),
    recommendedNextPhase:
      "phase-5.51-consumer-display-fixture-example-pack",
    consumerDisplayFixtureSchemaBoundaryOnly: true,
    reviewOnly: true,
    authoritative: false,
    reviewArtifactOnly: true,
    nonAuthorizingProof: true,
    ...consumerDisplayAccessibilityForbiddenBehavior(),
    renderingCodeImplemented: false,
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

function consumerDisplayFixtureSchemaBoundaryRejectionReasons({
  accepted,
  classification
}) {
  const reasons = [
    "consumer_display_fixture_schema_boundary_is_review_only",
    "display_fixture_entries_are_metadata_only",
    "ardyn_does_not_implement_ui_frontend_browser_or_rendering",
    "ui_rendering_runtime_command_db_storage_secrets_connector_fabric_websocket_http_mcp_task_secure_drop_authorizations_false",
    "recursive_unsafe_input_flags_fail_closed",
    "fallow_runtime_not_used",
    "runtime_enablement_still_blocked"
  ];

  return accepted
    ? reasons
    : [
        ...reasons,
        `input_classification_${classification}`,
        "consumer_display_fixture_schema_boundary_not_produced"
      ];
}

function consumerDisplayFixtureSchemaBoundaryResult({
  reviewedAt,
  reviewedAtDefaulted,
  classification,
  accepted,
  consumerDisplayFixtureSchemaBoundary
}) {
  return {
    schema: CONSUMER_DISPLAY_FIXTURE_SCHEMA_BOUNDARY_SCHEMA,
    schemaVersion: CONSUMER_DISPLAY_FIXTURE_SCHEMA_BOUNDARY_VERSION,
    consumerDisplayFixtureSchemaBoundaryKind:
      CONSUMER_DISPLAY_FIXTURE_SCHEMA_BOUNDARY_KIND,
    consumerDisplayFixtureSchemaBoundaryMode: "review-only",
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    consumerDisplayFixtureSchemaBoundaryProduced: accepted,
    consumerDisplayFixtureSchemaBoundary,
    schemaBoundarySummary: accepted
      ? consumerDisplayFixtureSchemaBoundary.schemaBoundarySummary
      : null,
    displayFixtureEntries: accepted
      ? consumerDisplayFixtureSchemaBoundary.displayFixtureEntries
      : [],
    invalidFixtureCasePolicy: accepted
      ? consumerDisplayFixtureSchemaBoundary.invalidFixtureCasePolicy
      : consumerDisplayFixtureSchemaBoundaryValidationRules(),
    topDisplayFixtureSchemaGaps: accepted
      ? consumerDisplayFixtureSchemaBoundary.topDisplayFixtureSchemaGaps
      : [],
    recommendedNextPhase: accepted
      ? consumerDisplayFixtureSchemaBoundary.recommendedNextPhase
      : null,
    consumerDisplayFixtureSchemaBoundaryOnly: true,
    reviewOnly: true,
    authoritative: false,
    reviewArtifactOnly: true,
    nonAuthorizingProof: true,
    ...consumerDisplayAccessibilityForbiddenBehavior(),
    renderingCodeImplemented: false,
    rejectionReasons: consumerDisplayFixtureSchemaBoundaryRejectionReasons({
      accepted,
      classification
    }),
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

export function createConsumerDisplayFixtureSchemaBoundaryForReview(input = {}) {
  const inputRecord = consumerDisplayFixtureSchemaBoundaryInputRecord(input);
  const reviewedAt =
    consumerDisplayFixtureSchemaBoundaryReviewedAt(inputRecord);
  const reviewedAtDefaulted = isReviewedAtDefaulted(inputRecord);
  const classification =
    consumerDisplayFixtureSchemaBoundaryInputClassification(inputRecord);
  const accepted =
    classification ===
    VALID_CONSUMER_DISPLAY_FIXTURE_SCHEMA_BOUNDARY_CLASSIFICATION;
  const consumerDisplayFixtureSchemaBoundary = accepted
    ? consumerDisplayFixtureSchemaBoundaryState(reviewedAt)
    : null;

  return consumerDisplayFixtureSchemaBoundaryResult({
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    accepted,
    consumerDisplayFixtureSchemaBoundary
  });
}

const CONSUMER_DISPLAY_FIXTURE_EXAMPLE_PACK_STATE_SCHEMA =
  "ardyn.phase-5.51.consumer-display-fixture-example-pack-state";
const VALID_CONSUMER_DISPLAY_FIXTURE_EXAMPLE_PACK_CLASSIFICATION =
  "valid_consumer_display_fixture_example_pack_runtime_still_blocked";
const MALFORMED_CONSUMER_DISPLAY_FIXTURE_EXAMPLE_PACK_CLASSIFICATION =
  "malformed_consumer_display_fixture_example_pack_input_rejected";
const CONSUMER_DISPLAY_FIXTURE_EXAMPLE_PACK_EXAMPLE_KIND =
  "consumer-display-fixture-example";

const CONSUMER_DISPLAY_FIXTURE_EXAMPLE_PACK_REQUIRED_FIELDS = Object.freeze([
  ...CONSUMER_DISPLAY_FIXTURE_SCHEMA_BOUNDARY_REQUIRED_FIELDS,
  "exampleKind",
  "exampleScenario",
  "phase550SchemaBoundaryFixtureId",
  "accessibilityNotes",
  "explicitBlockedAuthorizationFlags",
  "displayFixtureExamplePayload",
  "conformsToPhase550Boundary"
]);

const CONSUMER_DISPLAY_FIXTURE_EXAMPLE_PACK_EXAMPLE_METADATA = Object.freeze({
  "locus.status-control-panels": Object.freeze({
    fixtureId: "phase5-51.locus.status-control-panel.metadata-card",
    exampleScenario: "Locus status and control panel shows Ardyn review posture as static metadata.",
    examplePayloadKind: "static-status-control-panel-metadata-card",
    primaryStatus: "runtime_blocked",
    secondaryStatus: "review_only"
  }),
  "locus.review-artifact-panels": Object.freeze({
    fixtureId: "phase5-51.locus.review-artifact-panel.metadata-card",
    exampleScenario: "Locus review artifact panel summarizes a local Ardyn artifact without controls.",
    examplePayloadKind: "static-review-artifact-panel-metadata-card",
    primaryStatus: "artifact_available_for_review",
    secondaryStatus: "non_authorizing"
  }),
  "locus.capability-metadata-panels": Object.freeze({
    fixtureId: "phase5-51.locus.capability-metadata-panel.card",
    exampleScenario: "Locus capability metadata panel lists blocked Ardyn capability facts.",
    examplePayloadKind: "static-capability-metadata-panel-card",
    primaryStatus: "capability_metadata_only",
    secondaryStatus: "approval_boundary_required"
  }),
  "locus.blocked-command-runtime-indicators": Object.freeze({
    fixtureId: "phase5-51.locus.blocked-runtime-command.indicator",
    exampleScenario: "Locus blocked runtime and command indicator marks execution unavailable.",
    examplePayloadKind: "static-blocked-runtime-command-indicator",
    primaryStatus: "command_runtime_blocked",
    secondaryStatus: "no_control_semantics"
  }),
  "locus.future-secure-drop-compose-inbox-indicators": Object.freeze({
    fixtureId:
      "phase5-51.locus.future-secure-drop-compose-inbox.placeholder-indicator",
    exampleScenario: "Locus Secure Drop compose and inbox status remains a future metadata placeholder.",
    examplePayloadKind: "static-secure-drop-placeholder-indicator",
    primaryStatus: "secure_drop_not_implemented",
    secondaryStatus: "content_fabric_future_capability"
  }),
  "multiverse.world-project-orchestration-status-cards": Object.freeze({
    fixtureId: "phase5-51.multiverse.world-project-status.card",
    exampleScenario: "Multiverse world or project status card shows Ardyn readiness metadata.",
    examplePayloadKind: "static-world-project-status-card",
    primaryStatus: "orchestration_metadata_only",
    secondaryStatus: "no_runtime_binding"
  }),
  "multiverse.visible-ai-capability-badges": Object.freeze({
    fixtureId: "phase5-51.multiverse.visible-ai-capability.badge",
    exampleScenario: "Multiverse visible AI capability badge marks Ardyn capability as display-only.",
    examplePayloadKind: "static-visible-ai-capability-badge",
    primaryStatus: "visible_capability_metadata",
    secondaryStatus: "not_invokable"
  }),
  "multiverse.task-capability-wrapper-status-cards": Object.freeze({
    fixtureId: "phase5-51.multiverse.task-capability-wrapper-status.card",
    exampleScenario: "Multiverse task or capability wrapper card shows blocked Ardyn task semantics.",
    examplePayloadKind: "static-task-capability-wrapper-card",
    primaryStatus: "task_execution_blocked",
    secondaryStatus: "wrapper_metadata_only"
  }),
  "multiverse.citizen-adapter-candidate-badges": Object.freeze({
    fixtureId: "phase5-51.multiverse.citizen-adapter-candidate.badge",
    exampleScenario: "Multiverse citizen or adapter candidate badge marks adapter runtime as absent.",
    examplePayloadKind: "static-citizen-adapter-candidate-badge",
    primaryStatus: "adapter_candidate_metadata",
    secondaryStatus: "adapter_runtime_blocked"
  }),
  "multiverse.registry-websocket-mcp-task-runtime-blocked-indicators":
    Object.freeze({
      fixtureId:
        "phase5-51.multiverse.registry-websocket-mcp-task-blocked.indicator",
      exampleScenario:
        "Multiverse registry, websocket, MCP, and task indicator shows all runtime surfaces blocked.",
      examplePayloadKind: "static-registry-websocket-mcp-task-blocked-indicator",
      primaryStatus: "registry_websocket_mcp_task_blocked",
      secondaryStatus: "no_service_discovery"
    })
});

function consumerDisplayFixtureExamplePackInputRecord(input) {
  return isPlainObjectRecord(input) ? input : null;
}

function consumerDisplayFixtureExamplePackReviewedAt(inputRecord) {
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

function consumerDisplayFixtureExamplePackInputMalformed(inputRecord) {
  return (
    inputRecord === null ||
    (Object.prototype.hasOwnProperty.call(inputRecord, "reviewedAt") &&
      !isUtcIsoTimestampWithMilliseconds(inputRecord.reviewedAt)) ||
    (Object.prototype.hasOwnProperty.call(inputRecord, "fixtureExamples") &&
      !Array.isArray(inputRecord.fixtureExamples))
  );
}

function consumerDisplayFixtureExamplePackInputExamples(inputRecord) {
  return Array.isArray(inputRecord?.fixtureExamples)
    ? inputRecord.fixtureExamples
    : null;
}

function consumerDisplayFixtureExamplePackMissingRequiredField(entry) {
  if (!isPlainObjectRecord(entry)) {
    return true;
  }

  return CONSUMER_DISPLAY_FIXTURE_EXAMPLE_PACK_REQUIRED_FIELDS.some(
    (field) => !Object.prototype.hasOwnProperty.call(entry, field)
  );
}

function consumerDisplayFixtureExamplePackMalformed(entry) {
  return (
    consumerDisplayFixtureExamplePackMissingRequiredField(entry) ||
    consumerDisplayFixtureSchemaBoundaryEntryMalformed(entry) ||
    entry.exampleKind !== CONSUMER_DISPLAY_FIXTURE_EXAMPLE_PACK_EXAMPLE_KIND ||
    typeof entry.exampleScenario !== "string" ||
    entry.exampleScenario.length === 0 ||
    typeof entry.phase550SchemaBoundaryFixtureId !== "string" ||
    entry.phase550SchemaBoundaryFixtureId.length === 0 ||
    consumerDisplayFixtureSchemaBoundaryAccessibilityMalformed(
      entry.accessibilityNotes
    ) ||
    !isPlainObjectRecord(entry.explicitBlockedAuthorizationFlags) ||
    !isPlainObjectRecord(entry.displayFixtureExamplePayload) ||
    entry.conformsToPhase550Boundary !== true
  );
}

function consumerDisplayFixtureExamplePackContainsExampleIssue(
  examples,
  predicate
) {
  return examples !== null && examples.some((example) => predicate(example));
}

function consumerDisplayFixtureExamplePackAuthorizationFlagEnabled(entry) {
  return (
    consumerDisplayAccessibilityContractMapContainsTrue(
      entry?.blockedAuthorizationFlags
    ) ||
    consumerDisplayAccessibilityContractMapContainsTrue(
      entry?.explicitBlockedAuthorizationFlags
    ) ||
    consumerDisplayAccessibilityContractMapContainsTrue(entry?.authorizationFlags)
  );
}

function consumerDisplayFixtureExamplePackRecursiveUnsafeFlagEnabled(entry) {
  return (
    consumerDisplayAccessibilityContractMapContainsTrue(
      entry?.recursiveUnsafeInputFlags
    ) ||
    CONSUMER_DISPLAY_ACCESSIBILITY_CONTRACT_MAP_UNSAFE_FIELD_GROUPS.some(
      ({ fields }) =>
        consumerDisplayAccessibilityContractMapFieldTruePresent(entry, fields)
    ) ||
    consumerDisplayAccessibilityContractMapContainsTrue(entry?.runtimeEffect)
  );
}

function consumerDisplayFixtureExamplePackConformsToPhase550Boundary(
  entry,
  reviewedAt
) {
  const result = createConsumerDisplayFixtureSchemaBoundaryForReview({
    reviewedAt,
    fixtureEntries: [entry]
  });

  return (
    result.classification ===
    VALID_CONSUMER_DISPLAY_FIXTURE_SCHEMA_BOUNDARY_CLASSIFICATION
  );
}

function consumerDisplayFixtureExamplePackInputClassification(inputRecord) {
  if (consumerDisplayFixtureExamplePackInputMalformed(inputRecord)) {
    return MALFORMED_CONSUMER_DISPLAY_FIXTURE_EXAMPLE_PACK_CLASSIFICATION;
  }

  const reviewedAt = consumerDisplayFixtureExamplePackReviewedAt(inputRecord);
  const reviewedAtDefaulted = isReviewedAtDefaulted(inputRecord);
  const examples = consumerDisplayFixtureExamplePackInputExamples(inputRecord);

  if (
    consumerDisplayFixtureExamplePackContainsExampleIssue(
      examples,
      consumerDisplayFixtureExamplePackMissingRequiredField
    )
  ) {
    return "missing_required_consumer_display_fixture_example_rejected";
  }

  if (
    consumerDisplayFixtureExamplePackContainsExampleIssue(
      examples,
      (entry) => entry.consumerName !== "Locus" && entry.consumerName !== "Multiverse"
    )
  ) {
    return "unknown_consumer_name_consumer_display_fixture_example_rejected";
  }

  if (
    consumerDisplayFixtureExamplePackContainsExampleIssue(
      examples,
      (entry) =>
        ["interactive", "actionable", "runtime_action", "command_action"].includes(
          entry.displayIntent
        )
    )
  ) {
    return "interactive_actionable_intent_consumer_display_fixture_example_rejected";
  }

  if (
    consumerDisplayFixtureExamplePackContainsExampleIssue(
      examples,
      (entry) =>
        entry.displayIntent !==
        CONSUMER_DISPLAY_FIXTURE_SCHEMA_BOUNDARY_DISPLAY_INTENT
    )
  ) {
    return "unknown_display_intent_consumer_display_fixture_example_rejected";
  }

  if (
    consumerDisplayFixtureExamplePackContainsExampleIssue(
      examples,
      consumerDisplayFixtureExamplePackMalformed
    )
  ) {
    return MALFORMED_CONSUMER_DISPLAY_FIXTURE_EXAMPLE_PACK_CLASSIFICATION;
  }

  if (
    consumerDisplayFixtureExamplePackContainsExampleIssue(
      examples,
      consumerDisplayFixtureExamplePackAuthorizationFlagEnabled
    )
  ) {
    return "authorization_flags_enabled_consumer_display_fixture_example_rejected";
  }

  if (
    consumerDisplayFixtureExamplePackContainsExampleIssue(
      examples,
      (entry) =>
        consumerDisplayAccessibilityContractMapFieldTruePresent(
          entry,
          CONSUMER_DISPLAY_FIXTURE_SCHEMA_BOUNDARY_HIDDEN_SEMANTIC_FIELDS
        )
    )
  ) {
    return "hidden_command_runtime_semantics_consumer_display_fixture_example_rejected";
  }

  if (
    consumerDisplayFixtureExamplePackContainsExampleIssue(
      examples,
      (entry) =>
        consumerDisplayAccessibilityContractMapFieldTruePresent(
          entry,
          CONSUMER_DISPLAY_FIXTURE_SCHEMA_BOUNDARY_SECURE_DROP_FIELDS
        )
    )
  ) {
    return "secure_drop_implementation_semantics_consumer_display_fixture_example_rejected";
  }

  if (
    consumerDisplayFixtureExamplePackContainsExampleIssue(
      examples,
      (entry) =>
        consumerDisplayAccessibilityContractMapFieldTruePresent(
          entry,
          CONSUMER_DISPLAY_FIXTURE_SCHEMA_BOUNDARY_RUNTIME_SURFACE_FIELDS
        )
    )
  ) {
    return "websocket_http_fabric_mcp_task_execution_semantics_consumer_display_fixture_example_rejected";
  }

  if (
    consumerDisplayFixtureExamplePackContainsExampleIssue(
      examples,
      consumerDisplayFixtureExamplePackRecursiveUnsafeFlagEnabled
    ) ||
    consumerDisplayFixtureExamplePackRecursiveUnsafeFlagEnabled(inputRecord)
  ) {
    return "nested_unsafe_flags_consumer_display_fixture_example_rejected";
  }

  if (
    consumerDisplayFixtureExamplePackContainsExampleIssue(
      examples,
      (entry) =>
        !consumerDisplayFixtureExamplePackConformsToPhase550Boundary(
          entry,
          reviewedAt
        )
    )
  ) {
    return MALFORMED_CONSUMER_DISPLAY_FIXTURE_EXAMPLE_PACK_CLASSIFICATION;
  }

  return VALID_CONSUMER_DISPLAY_FIXTURE_EXAMPLE_PACK_CLASSIFICATION;
}

function consumerDisplayFixtureExamplePayload(boundaryEntry, metadata) {
  return {
    payloadKind: metadata.examplePayloadKind,
    primaryStatus: metadata.primaryStatus,
    secondaryStatus: metadata.secondaryStatus,
    staticTextRows: [
      boundaryEntry.readableLabel,
      boundaryEntry.shortDescription,
      "Review-only metadata. No command, runtime, storage, connector, network, or task behavior is present."
    ],
    statusTokens: [
      "metadata_only",
      "review_only",
      "runtime_blocked",
      "non_authorizing"
    ],
    colorIndependentIndicator: "text plus non-color status token required",
    motionPolicy: "default static; reduced-motion safe",
    hiddenActionPolicy: "no auto-execution and no hidden action semantics"
  };
}

function consumerDisplayFixtureExamplePackEntry(boundaryEntry) {
  const metadata =
    CONSUMER_DISPLAY_FIXTURE_EXAMPLE_PACK_EXAMPLE_METADATA[
      boundaryEntry.displaySurfaceId
    ];

  return {
    fixtureId: metadata.fixtureId,
    phase550SchemaBoundaryFixtureId: boundaryEntry.fixtureId,
    consumerName: boundaryEntry.consumerName,
    displaySurfaceId: boundaryEntry.displaySurfaceId,
    sourceArdynArtifactType: boundaryEntry.sourceArdynArtifactType,
    displayIntent: boundaryEntry.displayIntent,
    exampleKind: CONSUMER_DISPLAY_FIXTURE_EXAMPLE_PACK_EXAMPLE_KIND,
    exampleScenario: metadata.exampleScenario,
    readableLabel: boundaryEntry.readableLabel,
    shortDescription: boundaryEntry.shortDescription,
    longDescription: boundaryEntry.longDescription,
    statusSeverityVocabulary: [...boundaryEntry.statusSeverityVocabulary],
    accessibilityFields: { ...boundaryEntry.accessibilityFields },
    accessibilityNotes: { ...boundaryEntry.accessibilityFields },
    allowedDisplayBehavior: boundaryEntry.allowedDisplayBehavior,
    forbiddenDisplayBehavior: [...boundaryEntry.forbiddenDisplayBehavior],
    requiredFutureContractBeforeInteractivity:
      boundaryEntry.requiredFutureContractBeforeInteractivity,
    blockedAuthorizationFlags: consumerDisplayAccessibilityAuthorizationFlags(),
    explicitBlockedAuthorizationFlags:
      consumerDisplayAccessibilityAuthorizationFlags(),
    recursiveUnsafeInputFlags:
      consumerDisplayFixtureSchemaBoundaryRecursiveUnsafeInputFlags(),
    displayFixtureExamplePayload: consumerDisplayFixtureExamplePayload(
      boundaryEntry,
      metadata
    ),
    conformsToPhase550Boundary: true,
    nonAuthorizingProof: true,
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

function consumerDisplayFixtureExamplePackEntries() {
  return consumerDisplayFixtureSchemaBoundaryEntries().map(
    consumerDisplayFixtureExamplePackEntry
  );
}

function consumerDisplayFixtureExamplePackSummary(entries, reviewedAt) {
  const locusExampleCount = entries.filter(
    ({ consumerName }) => consumerName === "Locus"
  ).length;
  const multiverseExampleCount = entries.filter(
    ({ consumerName }) => consumerName === "Multiverse"
  ).length;

  return {
    examplePackKind: CONSUMER_DISPLAY_FIXTURE_EXAMPLE_PACK_KIND,
    examplePackMode: "review-only",
    fixtureExampleCount: entries.length,
    consumerNames: ["Locus", "Multiverse"],
    locusExampleCount,
    multiverseExampleCount,
    displayIntent: CONSUMER_DISPLAY_FIXTURE_SCHEMA_BOUNDARY_DISPLAY_INTENT,
    metadataOnlyDisplayIntentForAllExamples: entries.every(
      ({ displayIntent }) =>
        displayIntent === CONSUMER_DISPLAY_FIXTURE_SCHEMA_BOUNDARY_DISPLAY_INTENT
    ),
    deterministicFixtureIds: entries.map(({ fixtureId }) => fixtureId),
    deterministicDisplaySurfaceIds: entries.map(
      ({ displaySurfaceId }) => displaySurfaceId
    ),
    allExamplesConformToPhase550Boundary: entries.every((entry) =>
      consumerDisplayFixtureExamplePackConformsToPhase550Boundary(
        entry,
        reviewedAt
      )
    ),
    phase550BoundaryFixtureIds: entries.map(
      ({ phase550SchemaBoundaryFixtureId }) => phase550SchemaBoundaryFixtureId
    ),
    requiredFieldsPresentForAllExamples: entries.every(
      (entry) => !consumerDisplayFixtureExamplePackMissingRequiredField(entry)
    ),
    accessibilityNotesPresentForAllExamples: entries.every(
      ({ accessibilityNotes }) =>
        !consumerDisplayFixtureSchemaBoundaryAccessibilityMalformed(
          accessibilityNotes
        )
    ),
    colorIndependentStatusIndicatorRequiredForAllExamples: entries.every(
      ({ accessibilityNotes }) =>
        accessibilityNotes.colorIndependentStatusIndicatorRequired === true &&
        accessibilityNotes.colorOnlyStatusForbidden === true
    ),
    reducedMotionDefaultStaticRequiredForAllExamples: entries.every(
      ({ accessibilityNotes }) =>
        accessibilityNotes.reducedMotionDefaultStaticDisplayRequired === true &&
        accessibilityNotes.motionRequiredForStatusForbidden === true
    ),
    noAutoExecutionNoHiddenActionSemanticsForAllExamples: entries.every(
      ({ accessibilityNotes }) =>
        accessibilityNotes.noAutoExecutionNoHiddenActionSemantics === true
    ),
    allBlockedAuthorizationFlagsFalse: entries.every(
      ({ blockedAuthorizationFlags }) =>
        Object.values(blockedAuthorizationFlags).every((value) => value === false)
    ),
    allExplicitBlockedAuthorizationFlagsFalse: entries.every(
      ({ explicitBlockedAuthorizationFlags }) =>
        Object.values(explicitBlockedAuthorizationFlags).every(
          (value) => value === false
        )
    ),
    allRecursiveUnsafeInputFlagsFalse: entries.every(
      ({ recursiveUnsafeInputFlags }) =>
        Object.values(recursiveUnsafeInputFlags).every(
          (value) => value === false
        )
    ),
    allRuntimeEffectsFalse: entries.every(({ runtimeEffect }) =>
      Object.values(runtimeEffect).every((value) => value === false)
    ),
    allExamplesNonAuthorizing: entries.every(
      ({ nonAuthorizingProof }) => nonAuthorizingProof === true
    ),
    locusSecureDropPlaceholderExampleMetadataOnly: true,
    multiverseRegistryWebsocketMcpTaskBlockedExampleCovered: true,
    uiFrontendBrowserCodeImplemented: false,
    renderingCodeImplemented: false,
    consumerRuntimeIntegrationAdded: false,
    interactiveControlEnabled: false,
    hiddenActionSemanticsEnabled: false,
    autoExecutionEnabled: false,
    runtimeExecutionEnabled: false,
    commandRuntimeControlEnabled: false,
    databaseStorageRuntimeWritesEnabled: false,
    secretsRuntimeIngestionEnabled: false,
    connectorGrantProduced: false,
    fabricRuntimeSurfaceEnabled: false,
    webSocketHttpSurfaceEnabled: false,
    mcpToolExposureEnabled: false,
    taskExecutionEnabled: false,
    secureDropImplemented: false,
    serviceDiscoveryEnabled: false,
    scheduleEnforcementEnabled: false,
    backgroundPollingEnabled: false,
    externalLookupsEnabled: false
  };
}

function consumerDisplayFixtureExamplePackValidationRules() {
  return {
    examplesMustConformToPhase550Boundary: true,
    missingRequiredFieldsFailClosed: true,
    unknownConsumerNamesFailClosed: true,
    unknownDisplayIntentFailsClosed: true,
    interactiveActionableIntentFailsClosed: true,
    enabledAuthorizationFlagsFailClosed: true,
    nestedUnsafeInputFlagsFailClosed: true,
    hiddenCommandRuntimeSemanticsFailClosed: true,
    secureDropImplementationSemanticsFailClosed: true,
    websocketHttpFabricMcpTaskExecutionSemanticsFailClosed: true,
    malformedFixtureExamplesFailClosed: true,
    validationPerformsRendering: false,
    validationStartsRuntime: false,
    validationWritesDbStorage: false,
    validationReadsSecrets: false,
    validationCallsExternalConsumers: false,
    validationPerformsExternalLookups: false
  };
}

function consumerDisplayFixtureExamplePackGaps() {
  return [
    "The example pack is static metadata only; no Locus or Multiverse consumer rendering implementation exists in Ardyn.",
    "No browser, rendering, WCAG automation, visual regression, or screen-reader QA harness exists in Ardyn.",
    "No consumer-owned fixture import contract, conformance runner, or CI handoff exists for these examples.",
    "No interactive approval/control contract exists; examples cannot expose actions, commands, runtime controls, or hidden semantics.",
    "Secure Drop, registry, websocket, MCP, task execution, service discovery, and scheduling remain blocked metadata indicators."
  ];
}

function consumerDisplayFixtureExamplePackState(reviewedAt) {
  const fixtureExamples = consumerDisplayFixtureExamplePackEntries();

  return {
    schema: CONSUMER_DISPLAY_FIXTURE_EXAMPLE_PACK_STATE_SCHEMA,
    schemaVersion: CONSUMER_DISPLAY_FIXTURE_EXAMPLE_PACK_VERSION,
    stateKind: "consumer-display-fixture-example-pack-state",
    stateMode: "review-only",
    reviewedAt,
    sourcePhaseContext: {
      precedingPhase: "5.50",
      precedingArtifact:
        "tests/fixtures/host-policy/phase5-50/consumer-display-fixture-schema-boundary.json",
      phase550ConsumerDisplayFixtureSchemaBoundaryReferenceOnly: true,
      ardynOwnsConsumerUi: false
    },
    phase550SubagentAuditTrailReconciliation: {
      phase550FinalReportReviewerId: "019ee481-5b68-7082-b9c3-a05128fe6555",
      phase550FinalReportReviewerNickname: "Parfit",
      rejectedFullHistorySpawnAttemptRecordedBeforeReviewer: true,
      rejectedAttemptCreatedReviewer: false,
      phase549ReviewerId: "019ee429-135e-75b2-9dc8-b0d908741d22",
      phase549ReviewerNickname: "Feynman",
      phase551ReviewerLimit:
        "exactly-one-codex-5.5-read-only-reviewer-for-this-phase"
    },
    fixtureExamples,
    examplePackSummary: consumerDisplayFixtureExamplePackSummary(
      fixtureExamples,
      reviewedAt
    ),
    phase550BoundaryConformance: {
      sourceBoundarySchema: CONSUMER_DISPLAY_FIXTURE_SCHEMA_BOUNDARY_SCHEMA,
      sourceBoundaryFixture:
        "tests/fixtures/host-policy/phase5-50/consumer-display-fixture-schema-boundary.json",
      validationHelper:
        "createConsumerDisplayFixtureSchemaBoundaryForReview",
      validatedAgainstPhase550Boundary: true,
      allExamplesConformToPhase550Boundary: fixtureExamples.every((entry) =>
        consumerDisplayFixtureExamplePackConformsToPhase550Boundary(
          entry,
          reviewedAt
        )
      ),
      validationStartsRuntime: false,
      validationPerformsRendering: false,
      validationCallsConsumers: false
    },
    invalidExampleCasePolicy:
      consumerDisplayFixtureExamplePackValidationRules(),
    topDisplayFixtureExampleGaps: consumerDisplayFixtureExamplePackGaps(),
    recommendedNextPhase:
      "phase-5.52-consumer-display-fixture-conformance-handoff",
    consumerDisplayFixtureExamplePackOnly: true,
    reviewOnly: true,
    authoritative: false,
    reviewArtifactOnly: true,
    nonAuthorizingProof: true,
    ...consumerDisplayAccessibilityForbiddenBehavior(),
    renderingCodeImplemented: false,
    externalLookupsEnabled: false,
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

function consumerDisplayFixtureExamplePackRejectionReasons({
  accepted,
  classification
}) {
  const reasons = [
    "consumer_display_fixture_example_pack_is_review_only",
    "fixture_examples_are_metadata_only",
    "examples_conform_to_phase_5_50_schema_boundary",
    "ardyn_does_not_implement_ui_frontend_browser_or_rendering",
    "ui_rendering_runtime_command_db_storage_secrets_connector_fabric_websocket_http_mcp_task_secure_drop_authorizations_false",
    "recursive_unsafe_input_flags_fail_closed",
    "fallow_runtime_not_used",
    "runtime_enablement_still_blocked"
  ];

  return accepted
    ? reasons
    : [
        ...reasons,
        `input_classification_${classification}`,
        "consumer_display_fixture_example_pack_not_produced"
      ];
}

function consumerDisplayFixtureExamplePackResult({
  reviewedAt,
  reviewedAtDefaulted,
  classification,
  accepted,
  consumerDisplayFixtureExamplePack
}) {
  return {
    schema: CONSUMER_DISPLAY_FIXTURE_EXAMPLE_PACK_SCHEMA,
    schemaVersion: CONSUMER_DISPLAY_FIXTURE_EXAMPLE_PACK_VERSION,
    consumerDisplayFixtureExamplePackKind:
      CONSUMER_DISPLAY_FIXTURE_EXAMPLE_PACK_KIND,
    consumerDisplayFixtureExamplePackMode: "review-only",
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    consumerDisplayFixtureExamplePackProduced: accepted,
    consumerDisplayFixtureExamplePack,
    examplePackSummary: accepted
      ? consumerDisplayFixtureExamplePack.examplePackSummary
      : null,
    phase550BoundaryConformance: accepted
      ? consumerDisplayFixtureExamplePack.phase550BoundaryConformance
      : null,
    fixtureExamples: accepted
      ? consumerDisplayFixtureExamplePack.fixtureExamples
      : [],
    invalidExampleCasePolicy: accepted
      ? consumerDisplayFixtureExamplePack.invalidExampleCasePolicy
      : consumerDisplayFixtureExamplePackValidationRules(),
    topDisplayFixtureExampleGaps: accepted
      ? consumerDisplayFixtureExamplePack.topDisplayFixtureExampleGaps
      : [],
    recommendedNextPhase: accepted
      ? consumerDisplayFixtureExamplePack.recommendedNextPhase
      : null,
    consumerDisplayFixtureExamplePackOnly: true,
    reviewOnly: true,
    authoritative: false,
    reviewArtifactOnly: true,
    nonAuthorizingProof: true,
    ...consumerDisplayAccessibilityForbiddenBehavior(),
    renderingCodeImplemented: false,
    externalLookupsEnabled: false,
    rejectionReasons: consumerDisplayFixtureExamplePackRejectionReasons({
      accepted,
      classification
    }),
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

export function createConsumerDisplayFixtureExamplePackForReview(input = {}) {
  const inputRecord = consumerDisplayFixtureExamplePackInputRecord(input);
  const reviewedAt = consumerDisplayFixtureExamplePackReviewedAt(inputRecord);
  const reviewedAtDefaulted = isReviewedAtDefaulted(inputRecord);
  const classification =
    consumerDisplayFixtureExamplePackInputClassification(inputRecord);
  const accepted =
    classification ===
    VALID_CONSUMER_DISPLAY_FIXTURE_EXAMPLE_PACK_CLASSIFICATION;
  const consumerDisplayFixtureExamplePack = accepted
    ? consumerDisplayFixtureExamplePackState(reviewedAt)
    : null;

  return consumerDisplayFixtureExamplePackResult({
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    accepted,
    consumerDisplayFixtureExamplePack
  });
}

const CONSUMER_DISPLAY_FIXTURE_CONFORMANCE_HANDOFF_STATE_SCHEMA =
  "ardyn.phase-5.52.consumer-display-fixture-conformance-handoff-state";
const VALID_CONSUMER_DISPLAY_FIXTURE_CONFORMANCE_HANDOFF_CLASSIFICATION =
  "valid_consumer_display_fixture_conformance_handoff_runtime_still_blocked";
const MALFORMED_CONSUMER_DISPLAY_FIXTURE_CONFORMANCE_HANDOFF_CLASSIFICATION =
  "malformed_consumer_display_fixture_conformance_handoff_input_rejected";
const CONSUMER_DISPLAY_FIXTURE_CONFORMANCE_HANDOFF_INTENT =
  "metadata_only";

const CONSUMER_DISPLAY_FIXTURE_CONFORMANCE_HANDOFF_REQUIRED_FIELDS =
  Object.freeze([
    "handoffId",
    "consumerName",
    "displaySurfaceId",
    "sourceArdynArtifactType",
    "handoffIntent",
    "referencedPhase550SchemaBoundaryId",
    "referencedPhase551FixtureId",
    "referencedFixtureGroup",
    "expectedConsumerSideValidationResponsibility",
    "allowedConsumerBehavior",
    "forbiddenConsumerBehavior",
    "accessibilityConformanceExpectations",
    "requiredFutureContractBeforeInteractivity",
    "explicitBlockedAuthorizationFlags",
    "unsafeImportExecutionFlags",
    "consumerTargetOnly",
    "consumerOwnedRunnerImplemented",
    "fixtureImportCommandImplemented",
    "fixtureExportCommandImplemented",
    "browserRenderingHarnessImplemented",
    "nonAuthorizingProof"
  ]);

const CONSUMER_DISPLAY_FIXTURE_CONFORMANCE_HANDOFF_UNSAFE_IMPORT_EXECUTION_FIELDS =
  Object.freeze([
    "fixtureImportEnabled",
    "fixtureExportEnabled",
    "fixtureImportCommandImplemented",
    "fixtureExportCommandImplemented",
    "fixtureImportCommandEnabled",
    "fixtureExportCommandEnabled",
    "importToolImplemented",
    "exportToolImplemented",
    "consumerConformanceRunnerImplemented",
    "consumerConformanceRunnerEnabled",
    "consumerOwnedRunnerImplemented",
    "consumerRunnerExecutionEnabled",
    "consumerFixtureImportEnabled",
    "consumerFixtureExportEnabled",
    "browserRenderingHarnessImplemented",
    "consumerImportWritesFilesystem",
    "consumerImportCallsExternalRepo"
  ]);

const CONSUMER_DISPLAY_FIXTURE_CONFORMANCE_HANDOFF_IMPORT_EXPORT_IMPLEMENTATION_FIELDS =
  Object.freeze([
    "fixtureImportCommandImplemented",
    "fixtureExportCommandImplemented",
    "importToolImplemented",
    "exportToolImplemented",
    "consumerConformanceRunnerImplemented",
    "consumerConformanceRunnerEnabled",
    "consumerOwnedRunnerImplemented",
    "browserRenderingHarnessImplemented"
  ]);

const CONSUMER_DISPLAY_FIXTURE_CONFORMANCE_HANDOFF_HIDDEN_IMPORT_EXECUTION_FIELDS =
  Object.freeze([
    ...CONSUMER_DISPLAY_FIXTURE_SCHEMA_BOUNDARY_HIDDEN_SEMANTIC_FIELDS,
    "hiddenImportSemanticsEnabled",
    "hiddenExecutionSemanticsEnabled",
    "hiddenRuntimeImportSemanticsEnabled",
    "autoImportEnabled",
    "importOnLoadEnabled",
    "executeOnImportEnabled",
    "fixtureImportTriggersRuntime",
    "fixtureImportTriggersCommand"
  ]);

function consumerDisplayFixtureConformanceHandoffInputRecord(input) {
  return isPlainObjectRecord(input) ? input : null;
}

function consumerDisplayFixtureConformanceHandoffReviewedAt(inputRecord) {
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

function consumerDisplayFixtureConformanceHandoffInputMalformed(inputRecord) {
  return (
    inputRecord === null ||
    (Object.prototype.hasOwnProperty.call(inputRecord, "reviewedAt") &&
      !isUtcIsoTimestampWithMilliseconds(inputRecord.reviewedAt)) ||
    (Object.prototype.hasOwnProperty.call(inputRecord, "handoffEntries") &&
      !Array.isArray(inputRecord.handoffEntries))
  );
}

function consumerDisplayFixtureConformanceHandoffInputEntries(inputRecord) {
  return Array.isArray(inputRecord?.handoffEntries)
    ? inputRecord.handoffEntries
    : null;
}

function consumerDisplayFixtureConformanceHandoffMissingRequiredField(entry) {
  if (!isPlainObjectRecord(entry)) {
    return true;
  }

  return CONSUMER_DISPLAY_FIXTURE_CONFORMANCE_HANDOFF_REQUIRED_FIELDS.some(
    (field) => !Object.prototype.hasOwnProperty.call(entry, field)
  );
}

function consumerDisplayFixtureConformanceHandoffMalformed(entry) {
  return (
    consumerDisplayFixtureConformanceHandoffMissingRequiredField(entry) ||
    typeof entry.handoffId !== "string" ||
    entry.handoffId.length === 0 ||
    typeof entry.displaySurfaceId !== "string" ||
    entry.displaySurfaceId.length === 0 ||
    typeof entry.sourceArdynArtifactType !== "string" ||
    entry.sourceArdynArtifactType.length === 0 ||
    entry.handoffIntent !==
      CONSUMER_DISPLAY_FIXTURE_CONFORMANCE_HANDOFF_INTENT ||
    typeof entry.referencedPhase550SchemaBoundaryId !== "string" ||
    entry.referencedPhase550SchemaBoundaryId.length === 0 ||
    typeof entry.referencedPhase551FixtureId !== "string" ||
    entry.referencedPhase551FixtureId.length === 0 ||
    typeof entry.referencedFixtureGroup !== "string" ||
    entry.referencedFixtureGroup.length === 0 ||
    typeof entry.expectedConsumerSideValidationResponsibility !== "string" ||
    entry.expectedConsumerSideValidationResponsibility.length === 0 ||
    typeof entry.allowedConsumerBehavior !== "string" ||
    entry.allowedConsumerBehavior.length === 0 ||
    !Array.isArray(entry.forbiddenConsumerBehavior) ||
    entry.forbiddenConsumerBehavior.length < 6 ||
    consumerDisplayFixtureSchemaBoundaryAccessibilityMalformed(
      entry.accessibilityConformanceExpectations
    ) ||
    typeof entry.requiredFutureContractBeforeInteractivity !== "string" ||
    entry.requiredFutureContractBeforeInteractivity.length === 0 ||
    !isPlainObjectRecord(entry.explicitBlockedAuthorizationFlags) ||
    !isPlainObjectRecord(entry.unsafeImportExecutionFlags) ||
    entry.consumerTargetOnly !== true ||
    entry.consumerOwnedRunnerImplemented !== false ||
    entry.fixtureImportCommandImplemented !== false ||
    entry.fixtureExportCommandImplemented !== false ||
    entry.browserRenderingHarnessImplemented !== false ||
    entry.nonAuthorizingProof !== true
  );
}

function consumerDisplayFixtureConformanceHandoffContainsEntryIssue(
  entries,
  predicate
) {
  return entries !== null && entries.some((entry) => predicate(entry));
}

function consumerDisplayFixtureConformanceHandoffAuthorizationFlagEnabled(
  entry
) {
  return (
    consumerDisplayAccessibilityContractMapContainsTrue(
      entry?.explicitBlockedAuthorizationFlags
    ) ||
    consumerDisplayAccessibilityContractMapContainsTrue(
      entry?.blockedAuthorizationFlags
    ) ||
    consumerDisplayAccessibilityContractMapContainsTrue(entry?.authorizationFlags)
  );
}

function consumerDisplayFixtureConformanceHandoffUnsafeImportFlagEnabled(
  entry
) {
  return (
    consumerDisplayAccessibilityContractMapContainsTrue(
      entry?.unsafeImportExecutionFlags
    ) ||
    consumerDisplayAccessibilityContractMapFieldTruePresent(
      entry,
      CONSUMER_DISPLAY_FIXTURE_CONFORMANCE_HANDOFF_UNSAFE_IMPORT_EXECUTION_FIELDS
    )
  );
}

function consumerDisplayFixtureConformanceHandoffTopLevelFieldTruePresent(
  entry,
  fields
) {
  return (
    isPlainObjectRecord(entry) &&
    fields.some((field) => entry[field] === true)
  );
}

function consumerDisplayFixtureConformanceHandoffRecursiveUnsafeFlagEnabled(
  entry
) {
  return (
    consumerDisplayFixtureConformanceHandoffUnsafeImportFlagEnabled(entry) ||
    CONSUMER_DISPLAY_ACCESSIBILITY_CONTRACT_MAP_UNSAFE_FIELD_GROUPS.some(
      ({ fields }) =>
        consumerDisplayAccessibilityContractMapFieldTruePresent(entry, fields)
    ) ||
    consumerDisplayAccessibilityContractMapContainsTrue(entry?.runtimeEffect)
  );
}

function consumerDisplayFixtureConformanceHandoffReferenceValid(entry) {
  const example = consumerDisplayFixtureExamplePackEntries().find(
    ({ fixtureId }) => fixtureId === entry?.referencedPhase551FixtureId
  );

  return (
    example !== undefined &&
    example.phase550SchemaBoundaryFixtureId ===
      entry.referencedPhase550SchemaBoundaryId &&
    example.consumerName === entry.consumerName &&
    example.displaySurfaceId === entry.displaySurfaceId &&
    example.sourceArdynArtifactType === entry.sourceArdynArtifactType
  );
}

function consumerDisplayFixtureConformanceHandoffInputClassification(
  inputRecord
) {
  if (consumerDisplayFixtureConformanceHandoffInputMalformed(inputRecord)) {
    return MALFORMED_CONSUMER_DISPLAY_FIXTURE_CONFORMANCE_HANDOFF_CLASSIFICATION;
  }

  const entries =
    consumerDisplayFixtureConformanceHandoffInputEntries(inputRecord);

  if (
    consumerDisplayFixtureConformanceHandoffContainsEntryIssue(
      entries,
      consumerDisplayFixtureConformanceHandoffMissingRequiredField
    )
  ) {
    return "missing_required_consumer_display_fixture_conformance_handoff_entry_rejected";
  }

  if (
    consumerDisplayFixtureConformanceHandoffContainsEntryIssue(
      entries,
      (entry) => entry.consumerName !== "Locus" && entry.consumerName !== "Multiverse"
    )
  ) {
    return "unknown_consumer_name_consumer_display_fixture_conformance_handoff_input_rejected";
  }

  if (
    consumerDisplayFixtureConformanceHandoffContainsEntryIssue(
      entries,
      (entry) =>
        ["interactive", "actionable", "runtime_action", "command_action"].includes(
          entry.handoffIntent
        )
    )
  ) {
    return "interactive_actionable_intent_consumer_display_fixture_conformance_handoff_input_rejected";
  }

  if (
    consumerDisplayFixtureConformanceHandoffContainsEntryIssue(
      entries,
      (entry) =>
        entry.handoffIntent !==
        CONSUMER_DISPLAY_FIXTURE_CONFORMANCE_HANDOFF_INTENT
    )
  ) {
    return "unknown_display_intent_consumer_display_fixture_conformance_handoff_input_rejected";
  }

  if (
    consumerDisplayFixtureConformanceHandoffContainsEntryIssue(
      entries,
      (entry) =>
        consumerDisplayFixtureConformanceHandoffTopLevelFieldTruePresent(
          entry,
          CONSUMER_DISPLAY_FIXTURE_CONFORMANCE_HANDOFF_IMPORT_EXPORT_IMPLEMENTATION_FIELDS
        )
    )
  ) {
    return "consumer_runner_import_export_implementation_semantics_consumer_display_fixture_conformance_handoff_input_rejected";
  }

  if (
    consumerDisplayFixtureConformanceHandoffContainsEntryIssue(
      entries,
      consumerDisplayFixtureConformanceHandoffMalformed
    )
  ) {
    return MALFORMED_CONSUMER_DISPLAY_FIXTURE_CONFORMANCE_HANDOFF_CLASSIFICATION;
  }

  if (
    consumerDisplayFixtureConformanceHandoffContainsEntryIssue(
      entries,
      consumerDisplayFixtureConformanceHandoffAuthorizationFlagEnabled
    )
  ) {
    return "authorization_flags_enabled_consumer_display_fixture_conformance_handoff_input_rejected";
  }

  if (
    consumerDisplayFixtureConformanceHandoffContainsEntryIssue(
      entries,
      consumerDisplayFixtureConformanceHandoffUnsafeImportFlagEnabled
    )
  ) {
    return "unsafe_import_execution_flags_consumer_display_fixture_conformance_handoff_input_rejected";
  }

  if (
    consumerDisplayFixtureConformanceHandoffContainsEntryIssue(
      entries,
      (entry) =>
        consumerDisplayAccessibilityContractMapFieldTruePresent(
          entry,
          CONSUMER_DISPLAY_FIXTURE_CONFORMANCE_HANDOFF_HIDDEN_IMPORT_EXECUTION_FIELDS
        )
    )
  ) {
    return "hidden_import_execution_runtime_semantics_consumer_display_fixture_conformance_handoff_input_rejected";
  }

  if (
    consumerDisplayAccessibilityContractMapFieldTruePresent(
      inputRecord,
      CONSUMER_DISPLAY_FIXTURE_CONFORMANCE_HANDOFF_HIDDEN_IMPORT_EXECUTION_FIELDS
    )
  ) {
    return "hidden_import_execution_runtime_semantics_consumer_display_fixture_conformance_handoff_input_rejected";
  }

  if (
    consumerDisplayFixtureConformanceHandoffContainsEntryIssue(
      entries,
      (entry) =>
        consumerDisplayAccessibilityContractMapFieldTruePresent(
          entry,
          CONSUMER_DISPLAY_FIXTURE_SCHEMA_BOUNDARY_SECURE_DROP_FIELDS
        )
    )
  ) {
    return "secure_drop_implementation_semantics_consumer_display_fixture_conformance_handoff_input_rejected";
  }

  if (
    consumerDisplayFixtureConformanceHandoffContainsEntryIssue(
      entries,
      (entry) =>
        consumerDisplayAccessibilityContractMapFieldTruePresent(
          entry,
          CONSUMER_DISPLAY_FIXTURE_SCHEMA_BOUNDARY_RUNTIME_SURFACE_FIELDS
        )
    )
  ) {
    return "websocket_http_fabric_mcp_task_execution_semantics_consumer_display_fixture_conformance_handoff_input_rejected";
  }

  if (
    consumerDisplayFixtureConformanceHandoffContainsEntryIssue(
      entries,
      (entry) =>
        !consumerDisplayFixtureConformanceHandoffReferenceValid(entry)
    )
  ) {
    return "unknown_reference_consumer_display_fixture_conformance_handoff_input_rejected";
  }

  if (
    consumerDisplayFixtureConformanceHandoffContainsEntryIssue(
      entries,
      consumerDisplayFixtureConformanceHandoffRecursiveUnsafeFlagEnabled
    ) ||
    consumerDisplayFixtureConformanceHandoffRecursiveUnsafeFlagEnabled(
      inputRecord
    )
  ) {
    return "nested_unsafe_flags_consumer_display_fixture_conformance_handoff_input_rejected";
  }

  return VALID_CONSUMER_DISPLAY_FIXTURE_CONFORMANCE_HANDOFF_CLASSIFICATION;
}

function consumerDisplayFixtureConformanceHandoffUnsafeImportExecutionFlags() {
  return {
    fixtureImportEnabled: false,
    fixtureExportEnabled: false,
    fixtureImportCommandImplemented: false,
    fixtureExportCommandImplemented: false,
    importToolImplemented: false,
    exportToolImplemented: false,
    consumerConformanceRunnerImplemented: false,
    consumerConformanceRunnerEnabled: false,
    consumerRunnerExecutionEnabled: false,
    browserRenderingHarnessImplemented: false,
    hiddenImportSemanticsEnabled: false,
    hiddenExecutionSemanticsEnabled: false,
    hiddenRuntimeImportSemanticsEnabled: false,
    externalLookupEnabled: false
  };
}

function consumerDisplayFixtureConformanceHandoffId(example) {
  const compactSurfaceByDisplaySurfaceId = Object.freeze({
    "locus.status-control-panels": "locus.status-control-panel",
    "locus.review-artifact-panels": "locus.review-artifact-panel",
    "locus.capability-metadata-panels": "locus.capability-metadata-panel",
    "locus.blocked-command-runtime-indicators": "locus.blocked-runtime-command",
    "locus.future-secure-drop-compose-inbox-indicators":
      "locus.future-secure-drop-compose-inbox",
    "multiverse.world-project-orchestration-status-cards":
      "multiverse.world-project-status",
    "multiverse.visible-ai-capability-badges":
      "multiverse.visible-ai-capability",
    "multiverse.task-capability-wrapper-status-cards":
      "multiverse.task-capability-wrapper-status",
    "multiverse.citizen-adapter-candidate-badges":
      "multiverse.citizen-adapter-candidate",
    "multiverse.registry-websocket-mcp-task-runtime-blocked-indicators":
      "multiverse.registry-websocket-mcp-task-blocked"
  });

  return `phase5-52.${
    compactSurfaceByDisplaySurfaceId[example.displaySurfaceId]
  }.conformance-handoff`;
}

function consumerDisplayFixtureConformanceHandoffEntry(example) {
  return {
    handoffId: consumerDisplayFixtureConformanceHandoffId(example),
    consumerName: example.consumerName,
    displaySurfaceId: example.displaySurfaceId,
    sourceArdynArtifactType: example.sourceArdynArtifactType,
    handoffIntent: CONSUMER_DISPLAY_FIXTURE_CONFORMANCE_HANDOFF_INTENT,
    referencedPhase550SchemaBoundaryId:
      example.phase550SchemaBoundaryFixtureId,
    referencedPhase551FixtureId: example.fixtureId,
    referencedFixtureGroup: example.displaySurfaceId,
    expectedConsumerSideValidationResponsibility:
      "Future consumer-owned checks must import this as inert metadata, validate the Phase 5.50 schema boundary and Phase 5.51 example fixture reference, and reject any runtime or action semantics.",
    allowedConsumerBehavior:
      "Read, display, and compare the referenced fixture metadata in a consumer-owned review surface after a future contract exists.",
    forbiddenConsumerBehavior: [
      "implement an Ardyn-owned consumer runner",
      "import or export fixtures through an Ardyn command",
      "render UI, browser, or visual output from Ardyn",
      "start runtime or command behavior",
      "grant approval or connector permissions",
      "call external consumer repositories"
    ],
    accessibilityConformanceExpectations: {
      ...example.accessibilityNotes
    },
    requiredFutureContractBeforeInteractivity:
      example.requiredFutureContractBeforeInteractivity,
    explicitBlockedAuthorizationFlags:
      consumerDisplayAccessibilityAuthorizationFlags(),
    unsafeImportExecutionFlags:
      consumerDisplayFixtureConformanceHandoffUnsafeImportExecutionFlags(),
    consumerTargetOnly: true,
    consumerOwnedRunnerImplemented: false,
    fixtureImportCommandImplemented: false,
    fixtureExportCommandImplemented: false,
    browserRenderingHarnessImplemented: false,
    nonAuthorizingProof: true,
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

function consumerDisplayFixtureConformanceHandoffEntries() {
  return consumerDisplayFixtureExamplePackEntries().map(
    consumerDisplayFixtureConformanceHandoffEntry
  );
}

function consumerDisplayFixtureConformanceHandoffSummary(entries) {
  const locusHandoffCount = entries.filter(
    ({ consumerName }) => consumerName === "Locus"
  ).length;
  const multiverseHandoffCount = entries.filter(
    ({ consumerName }) => consumerName === "Multiverse"
  ).length;

  return {
    handoffKind: CONSUMER_DISPLAY_FIXTURE_CONFORMANCE_HANDOFF_KIND,
    handoffMode: "review-only",
    handoffEntryCount: entries.length,
    consumerNames: ["Locus", "Multiverse"],
    locusHandoffCount,
    multiverseHandoffCount,
    handoffIntent: CONSUMER_DISPLAY_FIXTURE_CONFORMANCE_HANDOFF_INTENT,
    deterministicHandoffIds: entries.map(({ handoffId }) => handoffId),
    referencedPhase550SchemaBoundaryIds: entries.map(
      ({ referencedPhase550SchemaBoundaryId }) =>
        referencedPhase550SchemaBoundaryId
    ),
    referencedPhase551FixtureIds: entries.map(
      ({ referencedPhase551FixtureId }) => referencedPhase551FixtureId
    ),
    referencesPhase550SchemaBoundary: entries.every(
      ({ referencedPhase550SchemaBoundaryId }) =>
        referencedPhase550SchemaBoundaryId.startsWith("phase5-50.")
    ),
    referencesPhase551ExamplePack: entries.every(
      ({ referencedPhase551FixtureId }) =>
        referencedPhase551FixtureId.startsWith("phase5-51.")
    ),
    locusAndMultiverseConsumerTargetsOnly: entries.every(
      ({ consumerTargetOnly }) => consumerTargetOnly === true
    ),
    consumerOwnedRunnerImplemented: false,
    fixtureImportExportCommandsImplemented: false,
    uiFrontendBrowserRenderingImplemented: false,
    allBlockedAuthorizationFlagsFalse: entries.every(
      ({ explicitBlockedAuthorizationFlags }) =>
        Object.values(explicitBlockedAuthorizationFlags).every(
          (value) => value === false
        )
    ),
    allUnsafeImportExecutionFlagsFalse: entries.every(
      ({ unsafeImportExecutionFlags }) =>
        Object.values(unsafeImportExecutionFlags).every(
          (value) => value === false
        )
    ),
    allRuntimeEffectsFalse: entries.every(({ runtimeEffect }) =>
      Object.values(runtimeEffect).every((value) => value === false)
    ),
    allEntriesNonAuthorizing: entries.every(
      ({ nonAuthorizingProof }) => nonAuthorizingProof === true
    ),
    validationPerformsRendering: false,
    validationStartsRuntime: false,
    validationWritesDbStorage: false,
    validationReadsSecrets: false,
    validationCallsExternalConsumers: false,
    validationPerformsExternalLookups: false,
    runtimeExecutionEnabled: false,
    commandRuntimeControlEnabled: false,
    databaseStorageRuntimeWritesEnabled: false,
    secretsRuntimeIngestionEnabled: false,
    connectorGrantProduced: false,
    fabricRuntimeSurfaceEnabled: false,
    webSocketHttpSurfaceEnabled: false,
    mcpToolExposureEnabled: false,
    taskExecutionEnabled: false,
    secureDropImplemented: false,
    serviceDiscoveryEnabled: false,
    scheduleEnforcementEnabled: false,
    backgroundPollingEnabled: false
  };
}

function consumerDisplayFixtureConformanceHandoffValidationRules() {
  return {
    referencesPhase550SchemaBoundaryRequired: true,
    referencesPhase551ExamplePackRequired: true,
    missingRequiredFieldsFailClosed: true,
    unknownConsumerNamesFailClosed: true,
    unknownHandoffIntentFailsClosed: true,
    interactiveActionableIntentFailsClosed: true,
    enabledAuthorizationFlagsFailClosed: true,
    unsafeImportExecutionFlagsFailClosed: true,
    nestedUnsafeInputFlagsFailClosed: true,
    hiddenImportExecutionRuntimeSemanticsFailClosed: true,
    secureDropImplementationSemanticsFailClosed: true,
    websocketHttpFabricMcpTaskExecutionSemanticsFailClosed: true,
    unknownReferencesFailClosed: true,
    consumerRunnerImportExportImplementationSemanticsFailClosed: true,
    malformedHandoffEntriesFailClosed: true,
    validationImplementsConsumerRunner: false,
    validationImplementsImportExportCommands: false,
    validationPerformsRendering: false,
    validationStartsRuntime: false,
    validationWritesDbStorage: false,
    validationReadsSecrets: false,
    validationCallsExternalConsumers: false,
    validationPerformsExternalLookups: false
  };
}

function consumerDisplayFixtureConformanceHandoffGaps() {
  return [
    "The handoff is static metadata only; no Locus or Multiverse consumer-owned fixture import or conformance runner exists in Ardyn.",
    "No browser, rendering, WCAG automation, visual regression, or screen-reader QA harness exists in Ardyn.",
    "No consumer-side CI contract, package export, fixture discovery contract, or external repository integration exists.",
    "No interactive approval/control contract exists; handoff entries cannot expose actions, commands, runtime controls, or hidden import semantics.",
    "Secure Drop, registry, websocket, MCP, task execution, service discovery, scheduling, filesystem, process, and external lookup behavior remain blocked."
  ];
}

function consumerDisplayFixtureConformanceHandoffState(reviewedAt) {
  const handoffEntries = consumerDisplayFixtureConformanceHandoffEntries();

  return {
    schema: CONSUMER_DISPLAY_FIXTURE_CONFORMANCE_HANDOFF_STATE_SCHEMA,
    schemaVersion: CONSUMER_DISPLAY_FIXTURE_CONFORMANCE_HANDOFF_VERSION,
    stateKind: "consumer-display-fixture-conformance-handoff-state",
    stateMode: "review-only",
    reviewedAt,
    sourcePhaseContext: {
      precedingSchemaBoundaryPhase: "5.50",
      precedingSchemaBoundaryArtifact:
        "tests/fixtures/host-policy/phase5-50/consumer-display-fixture-schema-boundary.json",
      precedingExamplePackPhase: "5.51",
      precedingExamplePackArtifact:
        "tests/fixtures/host-policy/phase5-51/consumer-display-fixture-example-pack.json",
      phase550ConsumerDisplayFixtureSchemaBoundaryReferenceOnly: true,
      phase551ConsumerDisplayFixtureExamplePackReferenceOnly: true,
      ardynOwnsConsumerUi: false,
      consumerRunnerImplementedByArdyn: false
    },
    handoffEntries,
    handoffSummary:
      consumerDisplayFixtureConformanceHandoffSummary(handoffEntries),
    phase550SchemaBoundaryReference: {
      sourceBoundarySchema: CONSUMER_DISPLAY_FIXTURE_SCHEMA_BOUNDARY_SCHEMA,
      sourceBoundaryFixture:
        "tests/fixtures/host-policy/phase5-50/consumer-display-fixture-schema-boundary.json",
      validationHelper:
        "createConsumerDisplayFixtureSchemaBoundaryForReview",
      referencedByHandoff: true,
      validationStartsRuntime: false,
      validationPerformsRendering: false,
      validationCallsConsumers: false
    },
    phase551ExamplePackReference: {
      sourceExamplePackSchema: CONSUMER_DISPLAY_FIXTURE_EXAMPLE_PACK_SCHEMA,
      sourceExamplePackFixture:
        "tests/fixtures/host-policy/phase5-51/consumer-display-fixture-example-pack.json",
      validationHelper:
        "createConsumerDisplayFixtureExamplePackForReview",
      referencedByHandoff: true,
      validationStartsRuntime: false,
      validationPerformsRendering: false,
      validationCallsConsumers: false
    },
    invalidHandoffCasePolicy:
      consumerDisplayFixtureConformanceHandoffValidationRules(),
    topDisplayConformanceGaps:
      consumerDisplayFixtureConformanceHandoffGaps(),
    recommendedNextPhase:
      "phase-5.53-consumer-owned-display-conformance-runner-requirements",
    consumerDisplayFixtureConformanceHandoffOnly: true,
    reviewOnly: true,
    authoritative: false,
    reviewArtifactOnly: true,
    nonAuthorizingProof: true,
    ...consumerDisplayAccessibilityForbiddenBehavior(),
    renderingCodeImplemented: false,
    browserRenderingHarnessImplemented: false,
    fixtureImportCommandImplemented: false,
    fixtureExportCommandImplemented: false,
    fixtureImportExportCommandsImplemented: false,
    consumerOwnedRunnerImplemented: false,
    consumerConformanceRunnerImplemented: false,
    externalLookupsEnabled: false,
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

function consumerDisplayFixtureConformanceHandoffRejectionReasons({
  accepted,
  classification
}) {
  const reasons = [
    "consumer_display_fixture_conformance_handoff_is_review_only",
    "handoff_entries_are_metadata_only",
    "references_phase_5_50_schema_boundary",
    "references_phase_5_51_example_pack",
    "ardyn_does_not_implement_ui_frontend_browser_rendering_import_export_or_consumer_runner",
    "runtime_command_db_storage_secrets_connector_fabric_websocket_http_mcp_task_secure_drop_service_discovery_schedule_authorizations_false",
    "unsafe_import_execution_flags_fail_closed",
    "fallow_runtime_not_used",
    "runtime_enablement_still_blocked"
  ];

  return accepted
    ? reasons
    : [
        ...reasons,
        `input_classification_${classification}`,
        "consumer_display_fixture_conformance_handoff_not_produced"
      ];
}

function consumerDisplayFixtureConformanceHandoffResult({
  reviewedAt,
  reviewedAtDefaulted,
  classification,
  accepted,
  consumerDisplayFixtureConformanceHandoff
}) {
  return {
    schema: CONSUMER_DISPLAY_FIXTURE_CONFORMANCE_HANDOFF_SCHEMA,
    schemaVersion: CONSUMER_DISPLAY_FIXTURE_CONFORMANCE_HANDOFF_VERSION,
    consumerDisplayFixtureConformanceHandoffKind:
      CONSUMER_DISPLAY_FIXTURE_CONFORMANCE_HANDOFF_KIND,
    consumerDisplayFixtureConformanceHandoffMode: "review-only",
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    consumerDisplayFixtureConformanceHandoffProduced: accepted,
    consumerDisplayFixtureConformanceHandoff,
    handoffSummary: accepted
      ? consumerDisplayFixtureConformanceHandoff.handoffSummary
      : null,
    phase550SchemaBoundaryReference: accepted
      ? consumerDisplayFixtureConformanceHandoff.phase550SchemaBoundaryReference
      : null,
    phase551ExamplePackReference: accepted
      ? consumerDisplayFixtureConformanceHandoff.phase551ExamplePackReference
      : null,
    handoffEntries: accepted
      ? consumerDisplayFixtureConformanceHandoff.handoffEntries
      : [],
    invalidHandoffCasePolicy: accepted
      ? consumerDisplayFixtureConformanceHandoff.invalidHandoffCasePolicy
      : consumerDisplayFixtureConformanceHandoffValidationRules(),
    topDisplayConformanceGaps: accepted
      ? consumerDisplayFixtureConformanceHandoff.topDisplayConformanceGaps
      : [],
    recommendedNextPhase: accepted
      ? consumerDisplayFixtureConformanceHandoff.recommendedNextPhase
      : null,
    consumerDisplayFixtureConformanceHandoffOnly: true,
    reviewOnly: true,
    authoritative: false,
    reviewArtifactOnly: true,
    nonAuthorizingProof: true,
    ...consumerDisplayAccessibilityForbiddenBehavior(),
    renderingCodeImplemented: false,
    browserRenderingHarnessImplemented: false,
    fixtureImportCommandImplemented: false,
    fixtureExportCommandImplemented: false,
    fixtureImportExportCommandsImplemented: false,
    consumerOwnedRunnerImplemented: false,
    consumerConformanceRunnerImplemented: false,
    externalLookupsEnabled: false,
    rejectionReasons:
      consumerDisplayFixtureConformanceHandoffRejectionReasons({
        accepted,
        classification
      }),
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

export function createConsumerDisplayFixtureConformanceHandoffForReview(
  input = {}
) {
  const inputRecord =
    consumerDisplayFixtureConformanceHandoffInputRecord(input);
  const reviewedAt =
    consumerDisplayFixtureConformanceHandoffReviewedAt(inputRecord);
  const reviewedAtDefaulted = isReviewedAtDefaulted(inputRecord);
  const classification =
    consumerDisplayFixtureConformanceHandoffInputClassification(inputRecord);
  const accepted =
    classification ===
    VALID_CONSUMER_DISPLAY_FIXTURE_CONFORMANCE_HANDOFF_CLASSIFICATION;
  const consumerDisplayFixtureConformanceHandoff = accepted
    ? consumerDisplayFixtureConformanceHandoffState(reviewedAt)
    : null;

  return consumerDisplayFixtureConformanceHandoffResult({
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    accepted,
    consumerDisplayFixtureConformanceHandoff
  });
}

const CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_REQUIREMENTS_STATE_SCHEMA =
  "ardyn.phase-5.53.consumer-owned-display-conformance-runner-requirements-state";
const VALID_CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_REQUIREMENTS_CLASSIFICATION =
  "valid_consumer_owned_display_conformance_runner_requirements_runtime_still_blocked";
const MALFORMED_CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_REQUIREMENTS_CLASSIFICATION =
  "malformed_consumer_owned_display_conformance_runner_requirements_input_rejected";
const CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_REQUIREMENTS_INTENT =
  "metadata_only";

const CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_REQUIREMENTS_REQUIRED_FIELDS =
  Object.freeze([
    "requirementId",
    "consumerName",
    "displaySurfaceId",
    "sourceArdynArtifactType",
    "requirementsIntent",
    "referencedPhase550SchemaBoundaryId",
    "referencedPhase551FixtureId",
    "referencedPhase551FixtureGroup",
    "referencedPhase552HandoffId",
    "expectedConsumerOwnedRunnerResponsibility",
    "allowedFutureRunnerBehavior",
    "forbiddenCurrentArdynBehavior",
    "accessibilityWcagValidationExpectations",
    "fixtureDeterminismExpectations",
    "requiredFutureContractBeforeInteractivity",
    "explicitBlockedAuthorizationFlags",
    "unsafeRunnerImportExportRuntimeFlags",
    "consumerTargetOnly",
    "runnerImplementedByArdyn",
    "importExportCommandImplemented",
    "browserRenderingHarnessImplemented",
    "packageExportImplemented",
    "consumerSideCiImplemented",
    "fixtureDiscoveryRuntimeImplemented",
    "consumerRepoModifiedByArdyn",
    "nonAuthorizingProof"
  ]);

const CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_REQUIREMENTS_UNSAFE_FIELDS =
  Object.freeze([
    "runnerEnabled",
    "runnerImplementedByArdyn",
    "runnerExecutesFixtures",
    "consumerConformanceRunnerImplemented",
    "consumerConformanceRunnerEnabled",
    "consumerOwnedRunnerImplemented",
    "consumerOwnedRunnerEnabled",
    "consumerRunnerExecutionEnabled",
    "fixtureImportEnabled",
    "fixtureExportEnabled",
    "fixtureImportCommandImplemented",
    "fixtureExportCommandImplemented",
    "fixtureImportCommandEnabled",
    "fixtureExportCommandEnabled",
    "importToolImplemented",
    "exportToolImplemented",
    "importExportCommandImplemented",
    "packageExportImplemented",
    "consumerSideCiImplemented",
    "fixtureDiscoveryRuntimeImplemented",
    "fixtureDiscoveryRuntimeEnabled",
    "browserRenderingHarnessImplemented",
    "consumerImportWritesFilesystem",
    "consumerImportCallsExternalRepo",
    "consumerRepoModifiedByArdyn",
    "locusRepoModified",
    "multiverseRepoModified",
    "externalLookupEnabled",
    "liveRegistryAccessEnabled",
    "filesystemScanningEnabled",
    "processControlEnabled"
  ]);

const CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_REQUIREMENTS_IMPLEMENTATION_FIELDS =
  Object.freeze([
    "runnerImplementedByArdyn",
    "consumerConformanceRunnerImplemented",
    "consumerOwnedRunnerImplemented",
    "consumerOwnedRunnerEnabled",
    "consumerRunnerExecutionEnabled",
    "fixtureImportCommandImplemented",
    "fixtureExportCommandImplemented",
    "importToolImplemented",
    "exportToolImplemented",
    "importExportCommandImplemented",
    "packageExportImplemented",
    "consumerSideCiImplemented",
    "fixtureDiscoveryRuntimeImplemented",
    "browserRenderingHarnessImplemented",
    "consumerRepoModifiedByArdyn",
    "locusRepoModified",
    "multiverseRepoModified"
  ]);

const CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_REQUIREMENTS_HIDDEN_FIELDS =
  Object.freeze([
    ...CONSUMER_DISPLAY_FIXTURE_CONFORMANCE_HANDOFF_HIDDEN_IMPORT_EXECUTION_FIELDS,
    "hiddenRunnerSemanticsEnabled",
    "hiddenImportSemanticsEnabled",
    "hiddenExportSemanticsEnabled",
    "hiddenRuntimeSemanticsEnabled",
    "hiddenExecutionSemanticsEnabled",
    "autoRunEnabled",
    "runOnImportEnabled",
    "executeOnValidationEnabled",
    "fixtureDiscoveryRuntimeEnabled"
  ]);

function consumerOwnedDisplayConformanceRunnerRequirementsInputRecord(input) {
  return isPlainObjectRecord(input) ? input : null;
}

function consumerOwnedDisplayConformanceRunnerRequirementsReviewedAt(
  inputRecord
) {
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

function consumerOwnedDisplayConformanceRunnerRequirementsInputMalformed(
  inputRecord
) {
  return (
    inputRecord === null ||
    (Object.prototype.hasOwnProperty.call(inputRecord, "reviewedAt") &&
      !isUtcIsoTimestampWithMilliseconds(inputRecord.reviewedAt)) ||
    (Object.prototype.hasOwnProperty.call(inputRecord, "requirementEntries") &&
      !Array.isArray(inputRecord.requirementEntries))
  );
}

function consumerOwnedDisplayConformanceRunnerRequirementsInputEntries(
  inputRecord
) {
  return Array.isArray(inputRecord?.requirementEntries)
    ? inputRecord.requirementEntries
    : null;
}

function consumerOwnedDisplayConformanceRunnerRequirementsMissingRequiredField(
  entry
) {
  if (!isPlainObjectRecord(entry)) {
    return true;
  }

  return CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_REQUIREMENTS_REQUIRED_FIELDS.some(
    (field) => !Object.prototype.hasOwnProperty.call(entry, field)
  );
}

function consumerOwnedDisplayConformanceRunnerRequirementsFixtureDeterminismMalformed(
  expectations
) {
  return (
    !isPlainObjectRecord(expectations) ||
    expectations.deterministicFixtureIdsRequired !== true ||
    expectations.deterministicOrderingRequired !== true ||
    expectations.deterministicStatusVocabularyRequired !== true ||
    expectations.noClockNetworkRandomnessAllowed !== true ||
    expectations.consumerRunnerOutputMustBeReviewOnly !== true
  );
}

function consumerOwnedDisplayConformanceRunnerRequirementsMalformed(entry) {
  return (
    consumerOwnedDisplayConformanceRunnerRequirementsMissingRequiredField(
      entry
    ) ||
    typeof entry.requirementId !== "string" ||
    entry.requirementId.length === 0 ||
    typeof entry.displaySurfaceId !== "string" ||
    entry.displaySurfaceId.length === 0 ||
    typeof entry.sourceArdynArtifactType !== "string" ||
    entry.sourceArdynArtifactType.length === 0 ||
    entry.requirementsIntent !==
      CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_REQUIREMENTS_INTENT ||
    typeof entry.referencedPhase550SchemaBoundaryId !== "string" ||
    entry.referencedPhase550SchemaBoundaryId.length === 0 ||
    typeof entry.referencedPhase551FixtureId !== "string" ||
    entry.referencedPhase551FixtureId.length === 0 ||
    typeof entry.referencedPhase551FixtureGroup !== "string" ||
    entry.referencedPhase551FixtureGroup.length === 0 ||
    typeof entry.referencedPhase552HandoffId !== "string" ||
    entry.referencedPhase552HandoffId.length === 0 ||
    typeof entry.expectedConsumerOwnedRunnerResponsibility !== "string" ||
    entry.expectedConsumerOwnedRunnerResponsibility.length === 0 ||
    typeof entry.allowedFutureRunnerBehavior !== "string" ||
    entry.allowedFutureRunnerBehavior.length === 0 ||
    !Array.isArray(entry.forbiddenCurrentArdynBehavior) ||
    entry.forbiddenCurrentArdynBehavior.length < 8 ||
    consumerDisplayFixtureSchemaBoundaryAccessibilityMalformed(
      entry.accessibilityWcagValidationExpectations
    ) ||
    consumerOwnedDisplayConformanceRunnerRequirementsFixtureDeterminismMalformed(
      entry.fixtureDeterminismExpectations
    ) ||
    typeof entry.requiredFutureContractBeforeInteractivity !== "string" ||
    entry.requiredFutureContractBeforeInteractivity.length === 0 ||
    !isPlainObjectRecord(entry.explicitBlockedAuthorizationFlags) ||
    !isPlainObjectRecord(entry.unsafeRunnerImportExportRuntimeFlags) ||
    entry.consumerTargetOnly !== true ||
    entry.runnerImplementedByArdyn !== false ||
    entry.importExportCommandImplemented !== false ||
    entry.browserRenderingHarnessImplemented !== false ||
    entry.packageExportImplemented !== false ||
    entry.consumerSideCiImplemented !== false ||
    entry.fixtureDiscoveryRuntimeImplemented !== false ||
    entry.consumerRepoModifiedByArdyn !== false ||
    entry.nonAuthorizingProof !== true
  );
}

function consumerOwnedDisplayConformanceRunnerRequirementsContainsEntryIssue(
  entries,
  predicate
) {
  return entries !== null && entries.some((entry) => predicate(entry));
}

function consumerOwnedDisplayConformanceRunnerRequirementsAuthorizationFlagEnabled(
  entry
) {
  return (
    consumerDisplayAccessibilityContractMapContainsTrue(
      entry?.explicitBlockedAuthorizationFlags
    ) ||
    consumerDisplayAccessibilityContractMapContainsTrue(
      entry?.blockedAuthorizationFlags
    ) ||
    consumerDisplayAccessibilityContractMapContainsTrue(entry?.authorizationFlags)
  );
}

function consumerOwnedDisplayConformanceRunnerRequirementsUnsafeFlagEnabled(
  entry
) {
  return (
    consumerDisplayAccessibilityContractMapContainsTrue(
      entry?.unsafeRunnerImportExportRuntimeFlags
    ) ||
    consumerDisplayAccessibilityContractMapFieldTruePresent(
      entry,
      CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_REQUIREMENTS_UNSAFE_FIELDS
    )
  );
}

function consumerOwnedDisplayConformanceRunnerRequirementsTopLevelFieldTruePresent(
  entry,
  fields
) {
  return (
    isPlainObjectRecord(entry) &&
    fields.some((field) => entry[field] === true)
  );
}

function consumerOwnedDisplayConformanceRunnerRequirementsRecursiveUnsafeFlagEnabled(
  entry
) {
  return (
    consumerOwnedDisplayConformanceRunnerRequirementsUnsafeFlagEnabled(entry) ||
    CONSUMER_DISPLAY_ACCESSIBILITY_CONTRACT_MAP_UNSAFE_FIELD_GROUPS.some(
      ({ fields }) =>
        consumerDisplayAccessibilityContractMapFieldTruePresent(entry, fields)
    ) ||
    consumerDisplayAccessibilityContractMapContainsTrue(entry?.runtimeEffect)
  );
}

function consumerOwnedDisplayConformanceRunnerRequirementsReferenceValid(
  entry
) {
  const handoff = consumerDisplayFixtureConformanceHandoffEntries().find(
    ({ handoffId }) => handoffId === entry?.referencedPhase552HandoffId
  );

  return (
    handoff !== undefined &&
    handoff.referencedPhase550SchemaBoundaryId ===
      entry.referencedPhase550SchemaBoundaryId &&
    handoff.referencedPhase551FixtureId ===
      entry.referencedPhase551FixtureId &&
    handoff.referencedFixtureGroup === entry.referencedPhase551FixtureGroup &&
    handoff.consumerName === entry.consumerName &&
    handoff.displaySurfaceId === entry.displaySurfaceId &&
    handoff.sourceArdynArtifactType === entry.sourceArdynArtifactType
  );
}

function consumerOwnedDisplayConformanceRunnerRequirementsInputClassification(
  inputRecord
) {
  if (
    consumerOwnedDisplayConformanceRunnerRequirementsInputMalformed(inputRecord)
  ) {
    return MALFORMED_CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_REQUIREMENTS_CLASSIFICATION;
  }

  const entries =
    consumerOwnedDisplayConformanceRunnerRequirementsInputEntries(inputRecord);

  if (
    consumerOwnedDisplayConformanceRunnerRequirementsContainsEntryIssue(
      entries,
      consumerOwnedDisplayConformanceRunnerRequirementsMissingRequiredField
    )
  ) {
    return "missing_required_consumer_owned_display_conformance_runner_requirement_rejected";
  }

  if (
    consumerOwnedDisplayConformanceRunnerRequirementsContainsEntryIssue(
      entries,
      (entry) => entry.consumerName !== "Locus" && entry.consumerName !== "Multiverse"
    )
  ) {
    return "unknown_consumer_name_consumer_owned_display_conformance_runner_requirements_input_rejected";
  }

  if (
    consumerOwnedDisplayConformanceRunnerRequirementsContainsEntryIssue(
      entries,
      (entry) =>
        ["interactive", "actionable", "runtime_action", "command_action"].includes(
          entry.requirementsIntent
        )
    )
  ) {
    return "interactive_actionable_intent_consumer_owned_display_conformance_runner_requirements_input_rejected";
  }

  if (
    consumerOwnedDisplayConformanceRunnerRequirementsContainsEntryIssue(
      entries,
      (entry) =>
        entry.requirementsIntent !==
        CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_REQUIREMENTS_INTENT
    )
  ) {
    return "unknown_requirements_intent_consumer_owned_display_conformance_runner_requirements_input_rejected";
  }

  if (
    consumerOwnedDisplayConformanceRunnerRequirementsContainsEntryIssue(
      entries,
      (entry) =>
        consumerOwnedDisplayConformanceRunnerRequirementsTopLevelFieldTruePresent(
          entry,
          CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_REQUIREMENTS_IMPLEMENTATION_FIELDS
        )
    )
  ) {
    return "runner_import_export_implementation_semantics_consumer_owned_display_conformance_runner_requirements_input_rejected";
  }

  if (
    consumerOwnedDisplayConformanceRunnerRequirementsContainsEntryIssue(
      entries,
      consumerOwnedDisplayConformanceRunnerRequirementsMalformed
    )
  ) {
    return MALFORMED_CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_REQUIREMENTS_CLASSIFICATION;
  }

  if (
    consumerOwnedDisplayConformanceRunnerRequirementsContainsEntryIssue(
      entries,
      consumerOwnedDisplayConformanceRunnerRequirementsAuthorizationFlagEnabled
    )
  ) {
    return "authorization_flags_enabled_consumer_owned_display_conformance_runner_requirements_input_rejected";
  }

  if (
    consumerOwnedDisplayConformanceRunnerRequirementsContainsEntryIssue(
      entries,
      consumerOwnedDisplayConformanceRunnerRequirementsUnsafeFlagEnabled
    )
  ) {
    return "unsafe_runner_import_export_runtime_flags_consumer_owned_display_conformance_runner_requirements_input_rejected";
  }

  if (
    consumerOwnedDisplayConformanceRunnerRequirementsContainsEntryIssue(
      entries,
      (entry) =>
        consumerDisplayAccessibilityContractMapFieldTruePresent(
          entry,
          CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_REQUIREMENTS_HIDDEN_FIELDS
        )
    )
  ) {
    return "hidden_runner_import_export_runtime_semantics_consumer_owned_display_conformance_runner_requirements_input_rejected";
  }

  if (
    consumerDisplayAccessibilityContractMapFieldTruePresent(
      inputRecord,
      CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_REQUIREMENTS_HIDDEN_FIELDS
    )
  ) {
    return "hidden_runner_import_export_runtime_semantics_consumer_owned_display_conformance_runner_requirements_input_rejected";
  }

  if (
    consumerOwnedDisplayConformanceRunnerRequirementsContainsEntryIssue(
      entries,
      (entry) =>
        consumerDisplayAccessibilityContractMapFieldTruePresent(
          entry,
          CONSUMER_DISPLAY_FIXTURE_SCHEMA_BOUNDARY_SECURE_DROP_FIELDS
        )
    )
  ) {
    return "secure_drop_implementation_semantics_consumer_owned_display_conformance_runner_requirements_input_rejected";
  }

  if (
    consumerOwnedDisplayConformanceRunnerRequirementsContainsEntryIssue(
      entries,
      (entry) =>
        consumerDisplayAccessibilityContractMapFieldTruePresent(
          entry,
          CONSUMER_DISPLAY_FIXTURE_SCHEMA_BOUNDARY_RUNTIME_SURFACE_FIELDS
        )
    )
  ) {
    return "websocket_http_fabric_mcp_task_execution_semantics_consumer_owned_display_conformance_runner_requirements_input_rejected";
  }

  if (
    consumerOwnedDisplayConformanceRunnerRequirementsContainsEntryIssue(
      entries,
      (entry) =>
        !consumerOwnedDisplayConformanceRunnerRequirementsReferenceValid(entry)
    )
  ) {
    return "unknown_reference_consumer_owned_display_conformance_runner_requirements_input_rejected";
  }

  if (
    consumerOwnedDisplayConformanceRunnerRequirementsContainsEntryIssue(
      entries,
      consumerOwnedDisplayConformanceRunnerRequirementsRecursiveUnsafeFlagEnabled
    ) ||
    consumerOwnedDisplayConformanceRunnerRequirementsRecursiveUnsafeFlagEnabled(
      inputRecord
    )
  ) {
    return "nested_unsafe_flags_consumer_owned_display_conformance_runner_requirements_input_rejected";
  }

  return VALID_CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_REQUIREMENTS_CLASSIFICATION;
}

function consumerOwnedDisplayConformanceRunnerRequirementsUnsafeFlags() {
  return {
    runnerEnabled: false,
    runnerImplementedByArdyn: false,
    runnerExecutesFixtures: false,
    fixtureImportEnabled: false,
    fixtureExportEnabled: false,
    importExportCommandImplemented: false,
    packageExportImplemented: false,
    consumerSideCiImplemented: false,
    fixtureDiscoveryRuntimeImplemented: false,
    liveRegistryAccessEnabled: false,
    externalLookupEnabled: false,
    filesystemScanningEnabled: false,
    processControlEnabled: false,
    hiddenRunnerSemanticsEnabled: false,
    hiddenImportSemanticsEnabled: false,
    hiddenExportSemanticsEnabled: false,
    hiddenRuntimeSemanticsEnabled: false
  };
}

function consumerOwnedDisplayConformanceRunnerRequirementId(handoff) {
  return handoff.handoffId
    .replace(/^phase5-52\./, "phase5-53.")
    .replace(/\.conformance-handoff$/, ".runner-requirement");
}

function consumerOwnedDisplayConformanceRunnerRequirementEntry(handoff) {
  return {
    requirementId:
      consumerOwnedDisplayConformanceRunnerRequirementId(handoff),
    consumerName: handoff.consumerName,
    displaySurfaceId: handoff.displaySurfaceId,
    sourceArdynArtifactType: handoff.sourceArdynArtifactType,
    requirementsIntent:
      CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_REQUIREMENTS_INTENT,
    referencedPhase550SchemaBoundaryId:
      handoff.referencedPhase550SchemaBoundaryId,
    referencedPhase551FixtureId: handoff.referencedPhase551FixtureId,
    referencedPhase551FixtureGroup: handoff.referencedFixtureGroup,
    referencedPhase552HandoffId: handoff.handoffId,
    expectedConsumerOwnedRunnerResponsibility:
      "A future Locus or Multiverse owned runner may validate the referenced Ardyn display fixture metadata against Phase 5.50, Phase 5.51, and Phase 5.52 contracts, then emit consumer-owned review results only after a separate consumer contract exists.",
    allowedFutureRunnerBehavior:
      "After a future consumer-owned contract, read deterministic local fixture metadata, check shape, ordering, accessibility/WCAG expectations, and blocked-runtime flags, and report inert conformance findings inside the consumer repo.",
    forbiddenCurrentArdynBehavior: [
      "implement an Ardyn-owned consumer display conformance runner",
      "implement fixture import or export commands",
      "modify Locus or Multiverse repositories",
      "package or publish fixtures for consumer-side CI",
      "render UI, browser, WCAG, visual regression, or screen-reader output",
      "discover fixtures through live registries, filesystem scanning, or external lookups",
      "start runtime, command, connector, Fabric, websocket/http, MCP, or task execution",
      "implement Secure Drop crypto, transport, stego, send/receive, inbox polling, or file selection"
    ],
    accessibilityWcagValidationExpectations: {
      ...handoff.accessibilityConformanceExpectations,
      wcagReferenceLevel:
        "future-consumer-owned-wcag-contract-required-before-certification",
      keyboardTraversalValidationRequired: true,
      screenReaderLabelValidationRequired: true,
      colorIndependentStatusValidationRequired: true,
      reducedMotionStaticDefaultValidationRequired: true,
      noAutoExecutionNoHiddenActionValidationRequired: true
    },
    fixtureDeterminismExpectations: {
      deterministicFixtureIdsRequired: true,
      deterministicOrderingRequired: true,
      deterministicStatusVocabularyRequired: true,
      noClockNetworkRandomnessAllowed: true,
      consumerRunnerOutputMustBeReviewOnly: true
    },
    requiredFutureContractBeforeInteractivity:
      handoff.requiredFutureContractBeforeInteractivity,
    explicitBlockedAuthorizationFlags:
      consumerDisplayAccessibilityAuthorizationFlags(),
    unsafeRunnerImportExportRuntimeFlags:
      consumerOwnedDisplayConformanceRunnerRequirementsUnsafeFlags(),
    consumerTargetOnly: true,
    runnerImplementedByArdyn: false,
    importExportCommandImplemented: false,
    browserRenderingHarnessImplemented: false,
    packageExportImplemented: false,
    consumerSideCiImplemented: false,
    fixtureDiscoveryRuntimeImplemented: false,
    consumerRepoModifiedByArdyn: false,
    nonAuthorizingProof: true,
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

function consumerOwnedDisplayConformanceRunnerRequirementEntries() {
  return consumerDisplayFixtureConformanceHandoffEntries().map(
    consumerOwnedDisplayConformanceRunnerRequirementEntry
  );
}

function consumerOwnedDisplayConformanceRunnerRequirementsSummary(entries) {
  const locusRequirementCount = entries.filter(
    ({ consumerName }) => consumerName === "Locus"
  ).length;
  const multiverseRequirementCount = entries.filter(
    ({ consumerName }) => consumerName === "Multiverse"
  ).length;

  return {
    requirementsKind:
      CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_REQUIREMENTS_KIND,
    requirementsMode: "review-only",
    requirementEntryCount: entries.length,
    consumerNames: ["Locus", "Multiverse"],
    locusRequirementCount,
    multiverseRequirementCount,
    requirementsIntent:
      CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_REQUIREMENTS_INTENT,
    deterministicRequirementIds: entries.map(
      ({ requirementId }) => requirementId
    ),
    referencedPhase550SchemaBoundaryIds: entries.map(
      ({ referencedPhase550SchemaBoundaryId }) =>
        referencedPhase550SchemaBoundaryId
    ),
    referencedPhase551FixtureIds: entries.map(
      ({ referencedPhase551FixtureId }) => referencedPhase551FixtureId
    ),
    referencedPhase552HandoffIds: entries.map(
      ({ referencedPhase552HandoffId }) => referencedPhase552HandoffId
    ),
    referencesPhase550SchemaBoundary: entries.every(
      ({ referencedPhase550SchemaBoundaryId }) =>
        referencedPhase550SchemaBoundaryId.startsWith("phase5-50.")
    ),
    referencesPhase551ExamplePack: entries.every(
      ({ referencedPhase551FixtureId }) =>
        referencedPhase551FixtureId.startsWith("phase5-51.")
    ),
    referencesPhase552ConformanceHandoff: entries.every(
      ({ referencedPhase552HandoffId }) =>
        referencedPhase552HandoffId.startsWith("phase5-52.")
    ),
    locusAndMultiverseConsumerTargetsOnly: entries.every(
      ({ consumerTargetOnly }) => consumerTargetOnly === true
    ),
    consumerRepoModifiedByArdyn: false,
    runnerImplementedByArdyn: false,
    importExportCommandImplemented: false,
    packageExportImplemented: false,
    consumerSideCiImplemented: false,
    fixtureDiscoveryRuntimeImplemented: false,
    browserRenderingHarnessImplemented: false,
    uiFrontendBrowserRenderingImplemented: false,
    allBlockedAuthorizationFlagsFalse: entries.every(
      ({ explicitBlockedAuthorizationFlags }) =>
        Object.values(explicitBlockedAuthorizationFlags).every(
          (value) => value === false
        )
    ),
    allUnsafeRunnerImportExportRuntimeFlagsFalse: entries.every(
      ({ unsafeRunnerImportExportRuntimeFlags }) =>
        Object.values(unsafeRunnerImportExportRuntimeFlags).every(
          (value) => value === false
        )
    ),
    allRuntimeEffectsFalse: entries.every(({ runtimeEffect }) =>
      Object.values(runtimeEffect).every((value) => value === false)
    ),
    allEntriesNonAuthorizing: entries.every(
      ({ nonAuthorizingProof }) => nonAuthorizingProof === true
    ),
    validationPerformsRendering: false,
    validationStartsRuntime: false,
    validationWritesDbStorage: false,
    validationReadsSecrets: false,
    validationCallsExternalConsumers: false,
    validationPerformsExternalLookups: false,
    validationScansFilesystem: false,
    validationControlsProcesses: false,
    runtimeExecutionEnabled: false,
    commandRuntimeControlEnabled: false,
    databaseStorageRuntimeWritesEnabled: false,
    secretsRuntimeIngestionEnabled: false,
    connectorGrantProduced: false,
    fabricRuntimeSurfaceEnabled: false,
    webSocketHttpSurfaceEnabled: false,
    mcpToolExposureEnabled: false,
    taskExecutionEnabled: false,
    secureDropImplemented: false,
    serviceDiscoveryEnabled: false,
    scheduleEnforcementEnabled: false,
    backgroundPollingEnabled: false,
    filesystemScanningEnabled: false,
    processControlEnabled: false
  };
}

function consumerOwnedDisplayConformanceRunnerRequirementsValidationRules() {
  return {
    referencesPhase550SchemaBoundaryRequired: true,
    referencesPhase551ExamplePackRequired: true,
    referencesPhase552ConformanceHandoffRequired: true,
    missingRequiredFieldsFailClosed: true,
    unknownConsumerNamesFailClosed: true,
    unknownRequirementsIntentFailsClosed: true,
    interactiveActionableIntentFailsClosed: true,
    enabledAuthorizationFlagsFailClosed: true,
    unsafeRunnerImportExportRuntimeFlagsFailClosed: true,
    nestedUnsafeInputFlagsFailClosed: true,
    hiddenRunnerImportExportRuntimeSemanticsFailClosed: true,
    secureDropImplementationSemanticsFailClosed: true,
    websocketHttpFabricMcpTaskExecutionSemanticsFailClosed: true,
    unknownReferencesFailClosed: true,
    runnerImportExportImplementationSemanticsFailClosed: true,
    malformedRequirementEntriesFailClosed: true,
    validationImplementsRunner: false,
    validationImplementsImportExportCommands: false,
    validationImplementsPackageExport: false,
    validationImplementsConsumerSideCi: false,
    validationImplementsFixtureDiscoveryRuntime: false,
    validationPerformsRendering: false,
    validationStartsRuntime: false,
    validationWritesDbStorage: false,
    validationReadsSecrets: false,
    validationCallsExternalConsumers: false,
    validationPerformsExternalLookups: false,
    validationScansFilesystem: false,
    validationControlsProcesses: false
  };
}

function consumerOwnedDisplayConformanceRunnerRequirementsGaps() {
  return [
    "The requirements are static metadata only; no Locus or Multiverse consumer-owned display conformance runner exists in Ardyn.",
    "No fixture import/export command, package export, consumer-side CI implementation, or fixture discovery runtime exists.",
    "No browser, rendering, WCAG automation, visual regression, or screen-reader QA harness exists in Ardyn.",
    "No consumer repository integration exists; Locus and Multiverse remain target consumers only.",
    "Secure Drop, registry, websocket, MCP, task execution, service discovery, scheduling, filesystem, process, and external lookup behavior remain blocked."
  ];
}

function phase552SubagentAuditTrailReconciliation() {
  return {
    finalReportActualReviewer:
      "019ee4d4-30eb-7553-b20c-6faa01d972d3 / Goodall",
    localSessionFooterMismatchReported:
      "Feynman / James",
    evidence:
      "Phase 5.52 final report named 019ee4d4-30eb-7553-b20c-6faa01d972d3 / Goodall as the actual reviewer; the user reported the local/session footer showed Feynman / James.",
    phase553ReviewerConstraint:
      "exactly-one-codex-5.5-read-only-reviewer"
  };
}

function consumerOwnedDisplayConformanceRunnerRequirementsState(reviewedAt) {
  const requirementEntries =
    consumerOwnedDisplayConformanceRunnerRequirementEntries();

  return {
    schema: CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_REQUIREMENTS_STATE_SCHEMA,
    schemaVersion:
      CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_REQUIREMENTS_VERSION,
    stateKind:
      "consumer-owned-display-conformance-runner-requirements-state",
    stateMode: "review-only",
    reviewedAt,
    sourcePhaseContext: {
      precedingSchemaBoundaryPhase: "5.50",
      precedingSchemaBoundaryArtifact:
        "tests/fixtures/host-policy/phase5-50/consumer-display-fixture-schema-boundary.json",
      precedingExamplePackPhase: "5.51",
      precedingExamplePackArtifact:
        "tests/fixtures/host-policy/phase5-51/consumer-display-fixture-example-pack.json",
      precedingConformanceHandoffPhase: "5.52",
      precedingConformanceHandoffArtifact:
        "tests/fixtures/host-policy/phase5-52/consumer-display-fixture-conformance-handoff.json",
      phase550ConsumerDisplayFixtureSchemaBoundaryReferenceOnly: true,
      phase551ConsumerDisplayFixtureExamplePackReferenceOnly: true,
      phase552ConsumerDisplayFixtureConformanceHandoffReferenceOnly: true,
      ardynOwnsConsumerUi: false,
      consumerRunnerImplementedByArdyn: false,
      importExportCommandImplementedByArdyn: false,
      packageExportImplementedByArdyn: false,
      consumerSideCiImplementedByArdyn: false,
      consumerRepoModifiedByArdyn: false
    },
    phase552SubagentAuditTrailReconciliation:
      phase552SubagentAuditTrailReconciliation(),
    requirementEntries,
    requirementsSummary:
      consumerOwnedDisplayConformanceRunnerRequirementsSummary(
        requirementEntries
      ),
    phase550SchemaBoundaryReference: {
      sourceBoundarySchema: CONSUMER_DISPLAY_FIXTURE_SCHEMA_BOUNDARY_SCHEMA,
      sourceBoundaryFixture:
        "tests/fixtures/host-policy/phase5-50/consumer-display-fixture-schema-boundary.json",
      validationHelper:
        "createConsumerDisplayFixtureSchemaBoundaryForReview",
      referencedByRequirements: true,
      validationStartsRuntime: false,
      validationPerformsRendering: false,
      validationCallsConsumers: false
    },
    phase551ExamplePackReference: {
      sourceExamplePackSchema: CONSUMER_DISPLAY_FIXTURE_EXAMPLE_PACK_SCHEMA,
      sourceExamplePackFixture:
        "tests/fixtures/host-policy/phase5-51/consumer-display-fixture-example-pack.json",
      validationHelper:
        "createConsumerDisplayFixtureExamplePackForReview",
      referencedByRequirements: true,
      validationStartsRuntime: false,
      validationPerformsRendering: false,
      validationCallsConsumers: false
    },
    phase552ConformanceHandoffReference: {
      sourceHandoffSchema: CONSUMER_DISPLAY_FIXTURE_CONFORMANCE_HANDOFF_SCHEMA,
      sourceHandoffFixture:
        "tests/fixtures/host-policy/phase5-52/consumer-display-fixture-conformance-handoff.json",
      validationHelper:
        "createConsumerDisplayFixtureConformanceHandoffForReview",
      referencedByRequirements: true,
      validationStartsRuntime: false,
      validationPerformsRendering: false,
      validationCallsConsumers: false
    },
    invalidRequirementCasePolicy:
      consumerOwnedDisplayConformanceRunnerRequirementsValidationRules(),
    topDisplayConformanceRunnerRequirementGaps:
      consumerOwnedDisplayConformanceRunnerRequirementsGaps(),
    recommendedNextPhase:
      "phase-5.54-consumer-owned-display-conformance-runner-test-plan",
    consumerOwnedDisplayConformanceRunnerRequirementsOnly: true,
    reviewOnly: true,
    authoritative: false,
    reviewArtifactOnly: true,
    nonAuthorizingProof: true,
    ...consumerDisplayAccessibilityForbiddenBehavior(),
    renderingCodeImplemented: false,
    browserRenderingHarnessImplemented: false,
    runnerImplementedByArdyn: false,
    consumerOwnedRunnerImplemented: false,
    consumerConformanceRunnerImplemented: false,
    fixtureImportCommandImplemented: false,
    fixtureExportCommandImplemented: false,
    fixtureImportExportCommandsImplemented: false,
    importExportCommandImplemented: false,
    packageExportImplemented: false,
    consumerSideCiImplemented: false,
    fixtureDiscoveryRuntimeImplemented: false,
    consumerRepoModifiedByArdyn: false,
    externalLookupsEnabled: false,
    filesystemScanningEnabled: false,
    processControlEnabled: false,
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

function consumerOwnedDisplayConformanceRunnerRequirementsRejectionReasons({
  accepted,
  classification
}) {
  const reasons = [
    "consumer_owned_display_conformance_runner_requirements_are_review_only",
    "requirement_entries_are_metadata_only",
    "references_phase_5_50_schema_boundary",
    "references_phase_5_51_example_pack",
    "references_phase_5_52_conformance_handoff",
    "ardyn_does_not_implement_runner_import_export_package_export_ci_ui_browser_rendering_or_consumer_repo_changes",
    "runtime_command_db_storage_secrets_connector_fabric_websocket_http_mcp_task_secure_drop_service_discovery_schedule_filesystem_process_authorizations_false",
    "unsafe_runner_import_export_runtime_flags_fail_closed",
    "fallow_runtime_not_used",
    "runtime_enablement_still_blocked"
  ];

  return accepted
    ? reasons
    : [
        ...reasons,
        `input_classification_${classification}`,
        "consumer_owned_display_conformance_runner_requirements_not_produced"
      ];
}

function consumerOwnedDisplayConformanceRunnerRequirementsResult({
  reviewedAt,
  reviewedAtDefaulted,
  classification,
  accepted,
  consumerOwnedDisplayConformanceRunnerRequirements
}) {
  return {
    schema:
      CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_REQUIREMENTS_SCHEMA,
    schemaVersion:
      CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_REQUIREMENTS_VERSION,
    consumerOwnedDisplayConformanceRunnerRequirementsKind:
      CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_REQUIREMENTS_KIND,
    consumerOwnedDisplayConformanceRunnerRequirementsMode: "review-only",
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    consumerOwnedDisplayConformanceRunnerRequirementsProduced: accepted,
    consumerOwnedDisplayConformanceRunnerRequirements,
    requirementsSummary: accepted
      ? consumerOwnedDisplayConformanceRunnerRequirements.requirementsSummary
      : null,
    phase550SchemaBoundaryReference: accepted
      ? consumerOwnedDisplayConformanceRunnerRequirements
          .phase550SchemaBoundaryReference
      : null,
    phase551ExamplePackReference: accepted
      ? consumerOwnedDisplayConformanceRunnerRequirements
          .phase551ExamplePackReference
      : null,
    phase552ConformanceHandoffReference: accepted
      ? consumerOwnedDisplayConformanceRunnerRequirements
          .phase552ConformanceHandoffReference
      : null,
    phase552SubagentAuditTrailReconciliation: accepted
      ? consumerOwnedDisplayConformanceRunnerRequirements
          .phase552SubagentAuditTrailReconciliation
      : null,
    requirementEntries: accepted
      ? consumerOwnedDisplayConformanceRunnerRequirements.requirementEntries
      : [],
    invalidRequirementCasePolicy: accepted
      ? consumerOwnedDisplayConformanceRunnerRequirements
          .invalidRequirementCasePolicy
      : consumerOwnedDisplayConformanceRunnerRequirementsValidationRules(),
    topDisplayConformanceRunnerRequirementGaps: accepted
      ? consumerOwnedDisplayConformanceRunnerRequirements
          .topDisplayConformanceRunnerRequirementGaps
      : [],
    recommendedNextPhase: accepted
      ? consumerOwnedDisplayConformanceRunnerRequirements.recommendedNextPhase
      : null,
    consumerOwnedDisplayConformanceRunnerRequirementsOnly: true,
    reviewOnly: true,
    authoritative: false,
    reviewArtifactOnly: true,
    nonAuthorizingProof: true,
    ...consumerDisplayAccessibilityForbiddenBehavior(),
    renderingCodeImplemented: false,
    browserRenderingHarnessImplemented: false,
    runnerImplementedByArdyn: false,
    consumerOwnedRunnerImplemented: false,
    consumerConformanceRunnerImplemented: false,
    fixtureImportCommandImplemented: false,
    fixtureExportCommandImplemented: false,
    fixtureImportExportCommandsImplemented: false,
    importExportCommandImplemented: false,
    packageExportImplemented: false,
    consumerSideCiImplemented: false,
    fixtureDiscoveryRuntimeImplemented: false,
    consumerRepoModifiedByArdyn: false,
    externalLookupsEnabled: false,
    filesystemScanningEnabled: false,
    processControlEnabled: false,
    rejectionReasons:
      consumerOwnedDisplayConformanceRunnerRequirementsRejectionReasons({
        accepted,
        classification
      }),
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

export function createConsumerOwnedDisplayConformanceRunnerRequirementsForReview(
  input = {}
) {
  const inputRecord =
    consumerOwnedDisplayConformanceRunnerRequirementsInputRecord(input);
  const reviewedAt =
    consumerOwnedDisplayConformanceRunnerRequirementsReviewedAt(inputRecord);
  const reviewedAtDefaulted = isReviewedAtDefaulted(inputRecord);
  const classification =
    consumerOwnedDisplayConformanceRunnerRequirementsInputClassification(
      inputRecord
    );
  const accepted =
    classification ===
    VALID_CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_REQUIREMENTS_CLASSIFICATION;
  const consumerOwnedDisplayConformanceRunnerRequirements = accepted
    ? consumerOwnedDisplayConformanceRunnerRequirementsState(reviewedAt)
    : null;

  return consumerOwnedDisplayConformanceRunnerRequirementsResult({
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    accepted,
    consumerOwnedDisplayConformanceRunnerRequirements
  });
}

const CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_TEST_PLAN_STATE_SCHEMA =
  "ardyn.phase-5.54.consumer-owned-display-conformance-runner-test-plan-state";
const VALID_CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_TEST_PLAN_CLASSIFICATION =
  "valid_consumer_owned_display_conformance_runner_test_plan_runtime_still_blocked";
const MALFORMED_CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_TEST_PLAN_CLASSIFICATION =
  "malformed_consumer_owned_display_conformance_runner_test_plan_input_rejected";
const CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_TEST_PLAN_INTENT =
  "metadata_only";

const CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_TEST_PLAN_REQUIRED_FIELDS =
  Object.freeze([
    "testPlanId",
    "consumerName",
    "displaySurfaceId",
    "sourceArdynArtifactType",
    "testPlanIntent",
    "referencedPhase550SchemaBoundaryId",
    "referencedPhase551FixtureId",
    "referencedPhase551FixtureGroup",
    "referencedPhase552HandoffId",
    "referencedPhase553RunnerRequirementId",
    "futureConsumerOwnedTestResponsibility",
    "expectedAssertions",
    "allowedFutureTestBehavior",
    "forbiddenCurrentArdynBehavior",
    "accessibilityWcagAssertionNotes",
    "fixtureDeterminismExpectations",
    "requiredFutureContractBeforeExecutableRunner",
    "explicitBlockedAuthorizationFlags",
    "unsafeRunnerImportExportTestHarnessRuntimeFlags",
    "consumerTargetOnly",
    "runnerImplementedByArdyn",
    "testHarnessImplementedByArdyn",
    "importExportCommandImplemented",
    "browserRenderingHarnessImplemented",
    "packageExportImplemented",
    "consumerSideCiImplemented",
    "fixtureDiscoveryRuntimeImplemented",
    "consumerRepoModifiedByArdyn",
    "nonAuthorizingProof"
  ]);

const CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_TEST_PLAN_UNSAFE_FIELDS =
  Object.freeze([
    ...CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_REQUIREMENTS_UNSAFE_FIELDS,
    "testHarnessEnabled",
    "testHarnessImplementedByArdyn",
    "testHarnessExecutionEnabled",
    "executableTestHarnessImplemented",
    "consumerTestRunnerImplemented",
    "consumerTestRunnerEnabled",
    "testPlanExecutionEnabled",
    "testPlanRunnerEnabled",
    "testHarnessWritesFilesystem",
    "browserWcagAutomationImplemented",
    "visualRegressionHarnessImplemented",
    "screenReaderAutomationImplemented",
    "packageDistributionEnabled",
    "packageExportEnabled",
    "consumerCiImplemented",
    "consumerSideCiRunnerImplemented",
    "fixtureDiscoveryRuntimeStarted"
  ]);

const CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_TEST_PLAN_IMPLEMENTATION_FIELDS =
  Object.freeze([
    ...CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_REQUIREMENTS_IMPLEMENTATION_FIELDS,
    "testHarnessImplementedByArdyn",
    "executableTestHarnessImplemented",
    "consumerTestRunnerImplemented",
    "testHarnessExecutionEnabled",
    "testPlanExecutionEnabled",
    "browserWcagAutomationImplemented",
    "visualRegressionHarnessImplemented",
    "screenReaderAutomationImplemented",
    "packageDistributionEnabled",
    "packageExportEnabled",
    "consumerCiImplemented",
    "consumerSideCiRunnerImplemented",
    "fixtureDiscoveryRuntimeStarted"
  ]);

const CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_TEST_PLAN_HIDDEN_FIELDS =
  Object.freeze([
    ...CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_REQUIREMENTS_HIDDEN_FIELDS,
    "hiddenTestHarnessSemanticsEnabled",
    "hiddenTestExecutionSemanticsEnabled",
    "hiddenRunnerSemanticsEnabled",
    "hiddenImportSemanticsEnabled",
    "hiddenExportSemanticsEnabled",
    "hiddenRuntimeSemanticsEnabled",
    "autoTestExecutionEnabled",
    "executeOnTestPlanValidationEnabled",
    "testHarnessRuntimeEnabled"
  ]);

function consumerOwnedDisplayConformanceRunnerTestPlanInputRecord(input) {
  return isPlainObjectRecord(input) ? input : null;
}

function consumerOwnedDisplayConformanceRunnerTestPlanReviewedAt(inputRecord) {
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

function consumerOwnedDisplayConformanceRunnerTestPlanInputMalformed(
  inputRecord
) {
  return (
    inputRecord === null ||
    (Object.prototype.hasOwnProperty.call(inputRecord, "reviewedAt") &&
      !isUtcIsoTimestampWithMilliseconds(inputRecord.reviewedAt)) ||
    (Object.prototype.hasOwnProperty.call(inputRecord, "testPlanEntries") &&
      !Array.isArray(inputRecord.testPlanEntries))
  );
}

function consumerOwnedDisplayConformanceRunnerTestPlanInputEntries(
  inputRecord
) {
  return Array.isArray(inputRecord?.testPlanEntries)
    ? inputRecord.testPlanEntries
    : null;
}

function consumerOwnedDisplayConformanceRunnerTestPlanMissingRequiredField(
  entry
) {
  if (!isPlainObjectRecord(entry)) {
    return true;
  }

  return CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_TEST_PLAN_REQUIRED_FIELDS.some(
    (field) => !Object.prototype.hasOwnProperty.call(entry, field)
  );
}

function consumerOwnedDisplayConformanceRunnerTestPlanFixtureDeterminismMalformed(
  expectations
) {
  return (
    !isPlainObjectRecord(expectations) ||
    expectations.deterministicFixtureIdsRequired !== true ||
    expectations.deterministicOrderingRequired !== true ||
    expectations.deterministicStatusVocabularyRequired !== true ||
    expectations.deterministicTestPlanIdsRequired !== true ||
    expectations.deterministicExpectedAssertionsRequired !== true ||
    expectations.noClockNetworkRandomnessAllowed !== true ||
    expectations.consumerOwnedTestOutputMustBeReviewOnly !== true
  );
}

function consumerOwnedDisplayConformanceRunnerTestPlanMalformed(entry) {
  return (
    consumerOwnedDisplayConformanceRunnerTestPlanMissingRequiredField(entry) ||
    typeof entry.testPlanId !== "string" ||
    entry.testPlanId.length === 0 ||
    typeof entry.displaySurfaceId !== "string" ||
    entry.displaySurfaceId.length === 0 ||
    typeof entry.sourceArdynArtifactType !== "string" ||
    entry.sourceArdynArtifactType.length === 0 ||
    entry.testPlanIntent !==
      CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_TEST_PLAN_INTENT ||
    typeof entry.referencedPhase550SchemaBoundaryId !== "string" ||
    entry.referencedPhase550SchemaBoundaryId.length === 0 ||
    typeof entry.referencedPhase551FixtureId !== "string" ||
    entry.referencedPhase551FixtureId.length === 0 ||
    typeof entry.referencedPhase551FixtureGroup !== "string" ||
    entry.referencedPhase551FixtureGroup.length === 0 ||
    typeof entry.referencedPhase552HandoffId !== "string" ||
    entry.referencedPhase552HandoffId.length === 0 ||
    typeof entry.referencedPhase553RunnerRequirementId !== "string" ||
    entry.referencedPhase553RunnerRequirementId.length === 0 ||
    typeof entry.futureConsumerOwnedTestResponsibility !== "string" ||
    entry.futureConsumerOwnedTestResponsibility.length === 0 ||
    !Array.isArray(entry.expectedAssertions) ||
    entry.expectedAssertions.length < 6 ||
    entry.expectedAssertions.some((assertion) => typeof assertion !== "string") ||
    typeof entry.allowedFutureTestBehavior !== "string" ||
    entry.allowedFutureTestBehavior.length === 0 ||
    !Array.isArray(entry.forbiddenCurrentArdynBehavior) ||
    entry.forbiddenCurrentArdynBehavior.length < 9 ||
    consumerDisplayFixtureSchemaBoundaryAccessibilityMalformed(
      entry.accessibilityWcagAssertionNotes
    ) ||
    consumerOwnedDisplayConformanceRunnerTestPlanFixtureDeterminismMalformed(
      entry.fixtureDeterminismExpectations
    ) ||
    typeof entry.requiredFutureContractBeforeExecutableRunner !== "string" ||
    entry.requiredFutureContractBeforeExecutableRunner.length === 0 ||
    !isPlainObjectRecord(entry.explicitBlockedAuthorizationFlags) ||
    !isPlainObjectRecord(
      entry.unsafeRunnerImportExportTestHarnessRuntimeFlags
    ) ||
    entry.consumerTargetOnly !== true ||
    entry.runnerImplementedByArdyn !== false ||
    entry.testHarnessImplementedByArdyn !== false ||
    entry.importExportCommandImplemented !== false ||
    entry.browserRenderingHarnessImplemented !== false ||
    entry.packageExportImplemented !== false ||
    entry.consumerSideCiImplemented !== false ||
    entry.fixtureDiscoveryRuntimeImplemented !== false ||
    entry.consumerRepoModifiedByArdyn !== false ||
    entry.nonAuthorizingProof !== true
  );
}

function consumerOwnedDisplayConformanceRunnerTestPlanContainsEntryIssue(
  entries,
  predicate
) {
  return entries !== null && entries.some((entry) => predicate(entry));
}

function consumerOwnedDisplayConformanceRunnerTestPlanAuthorizationFlagEnabled(
  entry
) {
  return (
    consumerDisplayAccessibilityContractMapContainsTrue(
      entry?.explicitBlockedAuthorizationFlags
    ) ||
    consumerDisplayAccessibilityContractMapContainsTrue(
      entry?.blockedAuthorizationFlags
    ) ||
    consumerDisplayAccessibilityContractMapContainsTrue(entry?.authorizationFlags)
  );
}

function consumerOwnedDisplayConformanceRunnerTestPlanUnsafeFlagEnabled(entry) {
  return (
    consumerDisplayAccessibilityContractMapContainsTrue(
      entry?.unsafeRunnerImportExportTestHarnessRuntimeFlags
    ) ||
    consumerDisplayAccessibilityContractMapFieldTruePresent(
      entry,
      CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_TEST_PLAN_UNSAFE_FIELDS
    )
  );
}

function consumerOwnedDisplayConformanceRunnerTestPlanTopLevelFieldTruePresent(
  entry,
  fields
) {
  return (
    isPlainObjectRecord(entry) &&
    fields.some((field) => entry[field] === true)
  );
}

function consumerOwnedDisplayConformanceRunnerTestPlanRecursiveUnsafeFlagEnabled(
  entry
) {
  return (
    consumerOwnedDisplayConformanceRunnerTestPlanUnsafeFlagEnabled(entry) ||
    CONSUMER_DISPLAY_ACCESSIBILITY_CONTRACT_MAP_UNSAFE_FIELD_GROUPS.some(
      ({ fields }) =>
        consumerDisplayAccessibilityContractMapFieldTruePresent(entry, fields)
    ) ||
    consumerDisplayAccessibilityContractMapContainsTrue(entry?.runtimeEffect)
  );
}

function consumerOwnedDisplayConformanceRunnerTestPlanReferenceValid(entry) {
  const requirement =
    consumerOwnedDisplayConformanceRunnerRequirementEntries().find(
      ({ requirementId }) =>
        requirementId === entry?.referencedPhase553RunnerRequirementId
    );

  return (
    requirement !== undefined &&
    requirement.referencedPhase550SchemaBoundaryId ===
      entry.referencedPhase550SchemaBoundaryId &&
    requirement.referencedPhase551FixtureId ===
      entry.referencedPhase551FixtureId &&
    requirement.referencedPhase551FixtureGroup ===
      entry.referencedPhase551FixtureGroup &&
    requirement.referencedPhase552HandoffId ===
      entry.referencedPhase552HandoffId &&
    requirement.consumerName === entry.consumerName &&
    requirement.displaySurfaceId === entry.displaySurfaceId &&
    requirement.sourceArdynArtifactType === entry.sourceArdynArtifactType
  );
}

function consumerOwnedDisplayConformanceRunnerTestPlanEntriesCanonical(entries) {
  if (entries === null) {
    return true;
  }

  return (
    JSON.stringify(entries) ===
    JSON.stringify(consumerOwnedDisplayConformanceRunnerTestPlanEntries())
  );
}

function consumerOwnedDisplayConformanceRunnerTestPlanInputClassification(
  inputRecord
) {
  if (consumerOwnedDisplayConformanceRunnerTestPlanInputMalformed(inputRecord)) {
    return MALFORMED_CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_TEST_PLAN_CLASSIFICATION;
  }

  const entries =
    consumerOwnedDisplayConformanceRunnerTestPlanInputEntries(inputRecord);

  if (
    consumerOwnedDisplayConformanceRunnerTestPlanContainsEntryIssue(
      entries,
      consumerOwnedDisplayConformanceRunnerTestPlanMissingRequiredField
    )
  ) {
    return "missing_required_consumer_owned_display_conformance_runner_test_plan_entry_rejected";
  }

  if (
    consumerOwnedDisplayConformanceRunnerTestPlanContainsEntryIssue(
      entries,
      (entry) => entry.consumerName !== "Locus" && entry.consumerName !== "Multiverse"
    )
  ) {
    return "unknown_consumer_name_consumer_owned_display_conformance_runner_test_plan_input_rejected";
  }

  if (
    consumerOwnedDisplayConformanceRunnerTestPlanContainsEntryIssue(
      entries,
      (entry) =>
        [
          "interactive",
          "actionable",
          "runtime_action",
          "command_action",
          "test_harness",
          "executable_runner"
        ].includes(entry.testPlanIntent)
    )
  ) {
    return "interactive_actionable_intent_consumer_owned_display_conformance_runner_test_plan_input_rejected";
  }

  if (
    consumerOwnedDisplayConformanceRunnerTestPlanContainsEntryIssue(
      entries,
      (entry) =>
        entry.testPlanIntent !==
        CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_TEST_PLAN_INTENT
    )
  ) {
    return "unknown_test_plan_intent_consumer_owned_display_conformance_runner_test_plan_input_rejected";
  }

  if (
    consumerOwnedDisplayConformanceRunnerTestPlanContainsEntryIssue(
      entries,
      (entry) =>
        consumerOwnedDisplayConformanceRunnerTestPlanTopLevelFieldTruePresent(
          entry,
          CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_TEST_PLAN_IMPLEMENTATION_FIELDS
        )
    ) ||
    consumerOwnedDisplayConformanceRunnerTestPlanTopLevelFieldTruePresent(
      inputRecord,
      CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_TEST_PLAN_IMPLEMENTATION_FIELDS
    )
  ) {
    return "runner_test_harness_import_export_implementation_semantics_consumer_owned_display_conformance_runner_test_plan_input_rejected";
  }

  if (
    consumerOwnedDisplayConformanceRunnerTestPlanContainsEntryIssue(
      entries,
      consumerOwnedDisplayConformanceRunnerTestPlanMalformed
    )
  ) {
    return MALFORMED_CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_TEST_PLAN_CLASSIFICATION;
  }

  if (
    consumerOwnedDisplayConformanceRunnerTestPlanContainsEntryIssue(
      entries,
      consumerOwnedDisplayConformanceRunnerTestPlanAuthorizationFlagEnabled
    )
  ) {
    return "authorization_flags_enabled_consumer_owned_display_conformance_runner_test_plan_input_rejected";
  }

  if (
    consumerOwnedDisplayConformanceRunnerTestPlanContainsEntryIssue(
      entries,
      consumerOwnedDisplayConformanceRunnerTestPlanUnsafeFlagEnabled
    )
  ) {
    return "unsafe_runner_import_export_test_harness_runtime_flags_consumer_owned_display_conformance_runner_test_plan_input_rejected";
  }

  if (
    consumerOwnedDisplayConformanceRunnerTestPlanContainsEntryIssue(
      entries,
      (entry) =>
        consumerDisplayAccessibilityContractMapFieldTruePresent(
          entry,
          CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_TEST_PLAN_HIDDEN_FIELDS
        )
    )
  ) {
    return "hidden_runner_import_export_test_harness_runtime_semantics_consumer_owned_display_conformance_runner_test_plan_input_rejected";
  }

  if (
    consumerDisplayAccessibilityContractMapFieldTruePresent(
      inputRecord,
      CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_TEST_PLAN_HIDDEN_FIELDS
    )
  ) {
    return "hidden_runner_import_export_test_harness_runtime_semantics_consumer_owned_display_conformance_runner_test_plan_input_rejected";
  }

  if (
    consumerOwnedDisplayConformanceRunnerTestPlanContainsEntryIssue(
      entries,
      (entry) =>
        consumerDisplayAccessibilityContractMapFieldTruePresent(
          entry,
          CONSUMER_DISPLAY_FIXTURE_SCHEMA_BOUNDARY_SECURE_DROP_FIELDS
        )
    )
  ) {
    return "secure_drop_implementation_semantics_consumer_owned_display_conformance_runner_test_plan_input_rejected";
  }

  if (
    consumerOwnedDisplayConformanceRunnerTestPlanContainsEntryIssue(
      entries,
      (entry) =>
        consumerDisplayAccessibilityContractMapFieldTruePresent(
          entry,
          CONSUMER_DISPLAY_FIXTURE_SCHEMA_BOUNDARY_RUNTIME_SURFACE_FIELDS
        )
    )
  ) {
    return "websocket_http_fabric_mcp_task_execution_semantics_consumer_owned_display_conformance_runner_test_plan_input_rejected";
  }

  if (
    consumerOwnedDisplayConformanceRunnerTestPlanContainsEntryIssue(
      entries,
      (entry) => !consumerOwnedDisplayConformanceRunnerTestPlanReferenceValid(entry)
    )
  ) {
    return "unknown_reference_consumer_owned_display_conformance_runner_test_plan_input_rejected";
  }

  if (
    consumerOwnedDisplayConformanceRunnerTestPlanContainsEntryIssue(
      entries,
      consumerOwnedDisplayConformanceRunnerTestPlanRecursiveUnsafeFlagEnabled
    ) ||
    consumerOwnedDisplayConformanceRunnerTestPlanRecursiveUnsafeFlagEnabled(
      inputRecord
    )
  ) {
    return "nested_unsafe_flags_consumer_owned_display_conformance_runner_test_plan_input_rejected";
  }

  if (
    !consumerOwnedDisplayConformanceRunnerTestPlanEntriesCanonical(entries)
  ) {
    return "noncanonical_consumer_owned_display_conformance_runner_test_plan_input_rejected";
  }

  return VALID_CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_TEST_PLAN_CLASSIFICATION;
}

function consumerOwnedDisplayConformanceRunnerTestPlanUnsafeFlags() {
  return {
    runnerEnabled: false,
    runnerImplementedByArdyn: false,
    runnerExecutesFixtures: false,
    testHarnessEnabled: false,
    testHarnessImplementedByArdyn: false,
    testHarnessExecutionEnabled: false,
    executableTestHarnessImplemented: false,
    consumerTestRunnerImplemented: false,
    testPlanExecutionEnabled: false,
    fixtureImportEnabled: false,
    fixtureExportEnabled: false,
    importExportCommandImplemented: false,
    packageExportImplemented: false,
    consumerSideCiImplemented: false,
    fixtureDiscoveryRuntimeImplemented: false,
    liveRegistryAccessEnabled: false,
    externalLookupEnabled: false,
    filesystemScanningEnabled: false,
    processControlEnabled: false,
    browserWcagAutomationImplemented: false,
    visualRegressionHarnessImplemented: false,
    screenReaderAutomationImplemented: false,
    hiddenRunnerSemanticsEnabled: false,
    hiddenTestHarnessSemanticsEnabled: false,
    hiddenImportSemanticsEnabled: false,
    hiddenExportSemanticsEnabled: false,
    hiddenRuntimeSemanticsEnabled: false
  };
}

function consumerOwnedDisplayConformanceRunnerTestPlanDefinitions() {
  return [
    {
      requirementId:
        "phase5-53.locus.status-control-panel.runner-requirement",
      testPlanId:
        "phase5-54.locus.status-control-panel-fixture-conformance.test-plan",
      responsibility:
        "Future Locus-owned tests should verify that status/control panel display fixtures remain metadata-only, deterministic, non-interactive, and blocked from command/runtime control.",
      accessibilityFocus:
        "Assert keyboard and screen-reader labels, color-independent status tokens, reduced-motion static defaults, and no hidden action semantics for the status/control panel fixture."
    },
    {
      requirementId:
        "phase5-53.locus.review-artifact-panel.runner-requirement",
      testPlanId:
        "phase5-54.locus.review-artifact-panel-fixture-conformance.test-plan",
      responsibility:
        "Future Locus-owned tests should verify that review artifact panel fixtures display Ardyn review metadata without reviewer routing, evaluator execution, approval decisions, or runtime writes.",
      accessibilityFocus:
        "Assert readable artifact labels, non-color-only severity vocabulary, screen-reader-safe descriptions, and static review status rendering."
    },
    {
      requirementId:
        "phase5-53.locus.capability-metadata-panel.runner-requirement",
      testPlanId:
        "phase5-54.locus.capability-metadata-panel-fixture-conformance.test-plan",
      responsibility:
        "Future Locus-owned tests should verify that capability metadata panel fixtures expose capability review status without granting connectors, commands, or runtime adapters.",
      accessibilityFocus:
        "Assert capability labels, short and long descriptions, color-independent blocked indicators, and no hidden activation semantics."
    },
    {
      requirementId:
        "phase5-53.locus.blocked-runtime-command.runner-requirement",
      testPlanId:
        "phase5-54.locus.blocked-runtime-command-indicator-conformance.test-plan",
      responsibility:
        "Future Locus-owned tests should verify that blocked runtime/command indicators remain visible metadata and cannot launch runtime, command, process, stdin, stdout, stderr, transcript, or audit behavior.",
      accessibilityFocus:
        "Assert blocked indicators have explicit text labels, screen-reader status notes, color-independent blocked state, and reduced-motion defaults."
    },
    {
      requirementId:
        "phase5-53.locus.future-secure-drop-compose-inbox.runner-requirement",
      testPlanId:
        "phase5-54.locus.future-secure-drop-compose-inbox-placeholder-indicator-conformance.test-plan",
      responsibility:
        "Future Locus-owned tests should verify that Secure Drop compose/inbox placeholder fixtures remain metadata-only and do not imply crypto, transport, stego, send/receive, inbox polling, file selection, secret access, or ST3GG vendoring.",
      accessibilityFocus:
        "Assert placeholder labels and blocked-state descriptions are available without color-only or motion-only meaning and without hidden compose/inbox action semantics."
    },
    {
      requirementId:
        "phase5-53.locus.status-control-panel.runner-requirement",
      testPlanId:
        "phase5-54.locus.accessibility-wcag-display-expectations.test-plan",
      responsibility:
        "Future Locus-owned accessibility tests should verify WCAG-oriented display expectations across Locus display fixtures after a separate consumer-owned executable runner contract exists.",
      accessibilityFocus:
        "Assert readable labels, short and long descriptions, severity vocabulary, keyboard/screen-reader notes, color-independent indicators, reduced-motion static defaults, and no auto-execution semantics across Locus fixtures."
    },
    {
      requirementId:
        "phase5-53.multiverse.world-project-status.runner-requirement",
      testPlanId:
        "phase5-54.multiverse.world-project-status-card-conformance.test-plan",
      responsibility:
        "Future Multiverse-owned tests should verify that world/project status card fixtures display Ardyn orchestration metadata without runtime orchestration, task execution, service discovery, or scheduling.",
      accessibilityFocus:
        "Assert project status labels, long descriptions, color-independent state, static defaults, and no hidden orchestration action semantics."
    },
    {
      requirementId:
        "phase5-53.multiverse.visible-ai-capability.runner-requirement",
      testPlanId:
        "phase5-54.multiverse.visible-ai-capability-badge-conformance.test-plan",
      responsibility:
        "Future Multiverse-owned tests should verify that visible AI capability badge fixtures show capability metadata without model execution, connector grants, or adapter runtime behavior.",
      accessibilityFocus:
        "Assert badge labels, text-equivalent status vocabulary, screen-reader notes, and no hidden activation semantics."
    },
    {
      requirementId:
        "phase5-53.multiverse.task-capability-wrapper-status.runner-requirement",
      testPlanId:
        "phase5-54.multiverse.task-capability-wrapper-status-card-conformance.test-plan",
      responsibility:
        "Future Multiverse-owned tests should verify that task/capability wrapper status fixtures remain non-executable and do not expose MCP, task, adapter, or process-control paths.",
      accessibilityFocus:
        "Assert wrapper status labels, long descriptions, non-color-only blocked state, keyboard/screen-reader display notes, and default-static behavior."
    },
    {
      requirementId:
        "phase5-53.multiverse.citizen-adapter-candidate.runner-requirement",
      testPlanId:
        "phase5-54.multiverse.citizen-adapter-candidate-badge-conformance.test-plan",
      responsibility:
        "Future Multiverse-owned tests should verify that citizen/adapter candidate badge fixtures remain candidate metadata and cannot register, discover, poll, or run adapters.",
      accessibilityFocus:
        "Assert candidate badge labels, blocked adapter status vocabulary, screen-reader notes, and no hidden registry or adapter action semantics."
    },
    {
      requirementId:
        "phase5-53.multiverse.registry-websocket-mcp-task-blocked.runner-requirement",
      testPlanId:
        "phase5-54.multiverse.registry-websocket-mcp-task-blocked-indicator-conformance.test-plan",
      responsibility:
        "Future Multiverse-owned tests should verify that registry/websocket/MCP/task blocked indicators remain inert metadata and cannot connect to registries, open websocket/http surfaces, expose MCP tools, or execute tasks.",
      accessibilityFocus:
        "Assert blocked runtime labels, color-independent blocked state, screen-reader descriptions, and no hidden registry/websocket/MCP/task action semantics."
    },
    {
      requirementId:
        "phase5-53.multiverse.world-project-status.runner-requirement",
      testPlanId:
        "phase5-54.multiverse.accessibility-wcag-display-expectations.test-plan",
      responsibility:
        "Future Multiverse-owned accessibility tests should verify WCAG-oriented display expectations across Multiverse display fixtures after a separate consumer-owned executable runner contract exists.",
      accessibilityFocus:
        "Assert readable labels, short and long descriptions, severity vocabulary, keyboard/screen-reader notes, color-independent indicators, reduced-motion static defaults, and no auto-execution semantics across Multiverse fixtures."
    }
  ];
}

function consumerOwnedDisplayConformanceRunnerTestPlanExpectedAssertions(
  definition,
  requirement
) {
  return [
    `Validate ${requirement.referencedPhase550SchemaBoundaryId} remains the referenced Phase 5.50 schema boundary for ${definition.testPlanId}.`,
    `Validate ${requirement.referencedPhase551FixtureId} remains the referenced Phase 5.51 fixture or fixture group source for ${definition.testPlanId}.`,
    `Validate ${requirement.referencedPhase552HandoffId} remains the referenced Phase 5.52 conformance handoff for ${definition.testPlanId}.`,
    `Validate ${requirement.requirementId} remains the referenced Phase 5.53 consumer-owned runner requirement for ${definition.testPlanId}.`,
    "Assert fixture ids, ordering, status/severity vocabulary, and expected assertions are deterministic and do not depend on clocks, network, randomness, filesystem scans, or external lookup.",
    "Assert all authorization, runner, import/export, test-harness, runtime, connector, Fabric, websocket/http, MCP/task, Secure Drop, service-discovery, schedule, filesystem, and process flags remain false.",
    "Assert future tests would only read deterministic local metadata after a separate consumer-owned executable runner contract exists.",
    "Assert accessibility/WCAG display notes require readable labels, screen-reader text, keyboard-safe exposure, color-independent status, reduced-motion static defaults, and no auto-execution or hidden action semantics."
  ];
}

function consumerOwnedDisplayConformanceRunnerTestPlanEntry(definition) {
  const requirement =
    consumerOwnedDisplayConformanceRunnerRequirementEntries().find(
      ({ requirementId }) => requirementId === definition.requirementId
    );

  return {
    testPlanId: definition.testPlanId,
    consumerName: requirement.consumerName,
    displaySurfaceId: requirement.displaySurfaceId,
    sourceArdynArtifactType: requirement.sourceArdynArtifactType,
    testPlanIntent:
      CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_TEST_PLAN_INTENT,
    referencedPhase550SchemaBoundaryId:
      requirement.referencedPhase550SchemaBoundaryId,
    referencedPhase551FixtureId: requirement.referencedPhase551FixtureId,
    referencedPhase551FixtureGroup: requirement.referencedPhase551FixtureGroup,
    referencedPhase552HandoffId: requirement.referencedPhase552HandoffId,
    referencedPhase553RunnerRequirementId: requirement.requirementId,
    futureConsumerOwnedTestResponsibility: definition.responsibility,
    expectedAssertions:
      consumerOwnedDisplayConformanceRunnerTestPlanExpectedAssertions(
        definition,
        requirement
      ),
    allowedFutureTestBehavior:
      "After a separate future consumer-owned executable runner contract, the consumer repo may read deterministic local Ardyn metadata fixtures and assert schema, ordering, accessibility notes, and blocked-runtime flags without calling Ardyn runtime behavior.",
    forbiddenCurrentArdynBehavior: [
      "implement an Ardyn-owned consumer display conformance runner",
      "implement a test harness or executable fixture validation runner",
      "implement fixture import or export commands",
      "package or distribute fixtures for consumer-side CI",
      "modify Locus or Multiverse repositories",
      "render UI, browser, WCAG automation, visual regression, or screen-reader output",
      "discover fixtures through live registries, filesystem scanning, polling, or external lookups",
      "start runtime, command, connector, Fabric, websocket/http, MCP, task, service-discovery, schedule, filesystem, or process behavior",
      "implement Secure Drop crypto, transport, stego, send/receive, inbox polling, file selection, secret access, connector ingestion, or ST3GG vendoring"
    ],
    accessibilityWcagAssertionNotes: {
      ...requirement.accessibilityWcagValidationExpectations,
      wcagReferenceLevel:
        "future-consumer-owned-wcag-test-contract-required-before-certification",
      accessibilityTestScope: definition.accessibilityFocus,
      keyboardTraversalAssertionRequired: true,
      screenReaderLabelAssertionRequired: true,
      colorIndependentStatusAssertionRequired: true,
      reducedMotionStaticDefaultAssertionRequired: true,
      noAutoExecutionNoHiddenActionAssertionRequired: true
    },
    fixtureDeterminismExpectations: {
      deterministicFixtureIdsRequired: true,
      deterministicOrderingRequired: true,
      deterministicStatusVocabularyRequired: true,
      deterministicTestPlanIdsRequired: true,
      deterministicExpectedAssertionsRequired: true,
      noClockNetworkRandomnessAllowed: true,
      consumerOwnedTestOutputMustBeReviewOnly: true
    },
    requiredFutureContractBeforeExecutableRunner:
      "A separate consumer-owned executable runner contract must exist before Locus or Multiverse can import fixtures, run tests, render UI/browser/WCAG automation, publish packages, attach consumer CI, or execute any runtime behavior.",
    explicitBlockedAuthorizationFlags:
      consumerDisplayAccessibilityAuthorizationFlags(),
    unsafeRunnerImportExportTestHarnessRuntimeFlags:
      consumerOwnedDisplayConformanceRunnerTestPlanUnsafeFlags(),
    consumerTargetOnly: true,
    runnerImplementedByArdyn: false,
    testHarnessImplementedByArdyn: false,
    importExportCommandImplemented: false,
    browserRenderingHarnessImplemented: false,
    packageExportImplemented: false,
    consumerSideCiImplemented: false,
    fixtureDiscoveryRuntimeImplemented: false,
    consumerRepoModifiedByArdyn: false,
    nonAuthorizingProof: true,
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

function consumerOwnedDisplayConformanceRunnerTestPlanEntries() {
  return consumerOwnedDisplayConformanceRunnerTestPlanDefinitions().map(
    consumerOwnedDisplayConformanceRunnerTestPlanEntry
  );
}

function consumerOwnedDisplayConformanceRunnerTestPlanSummary(entries) {
  const locusTestPlanEntryCount = entries.filter(
    ({ consumerName }) => consumerName === "Locus"
  ).length;
  const multiverseTestPlanEntryCount = entries.filter(
    ({ consumerName }) => consumerName === "Multiverse"
  ).length;

  return {
    testPlanKind: CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_TEST_PLAN_KIND,
    testPlanMode: "review-only",
    testPlanEntryCount: entries.length,
    consumerNames: ["Locus", "Multiverse"],
    locusTestPlanEntryCount,
    multiverseTestPlanEntryCount,
    testPlanIntent: CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_TEST_PLAN_INTENT,
    deterministicTestPlanIds: entries.map(({ testPlanId }) => testPlanId),
    referencedPhase550SchemaBoundaryIds: entries.map(
      ({ referencedPhase550SchemaBoundaryId }) =>
        referencedPhase550SchemaBoundaryId
    ),
    referencedPhase551FixtureIds: entries.map(
      ({ referencedPhase551FixtureId }) => referencedPhase551FixtureId
    ),
    referencedPhase551FixtureGroups: entries.map(
      ({ referencedPhase551FixtureGroup }) => referencedPhase551FixtureGroup
    ),
    referencedPhase552HandoffIds: entries.map(
      ({ referencedPhase552HandoffId }) => referencedPhase552HandoffId
    ),
    referencedPhase553RunnerRequirementIds: entries.map(
      ({ referencedPhase553RunnerRequirementId }) =>
        referencedPhase553RunnerRequirementId
    ),
    referencesPhase550SchemaBoundary: entries.every(
      ({ referencedPhase550SchemaBoundaryId }) =>
        referencedPhase550SchemaBoundaryId.startsWith("phase5-50.")
    ),
    referencesPhase551ExamplePack: entries.every(
      ({ referencedPhase551FixtureId }) =>
        referencedPhase551FixtureId.startsWith("phase5-51.")
    ),
    referencesPhase552ConformanceHandoff: entries.every(
      ({ referencedPhase552HandoffId }) =>
        referencedPhase552HandoffId.startsWith("phase5-52.")
    ),
    referencesPhase553RunnerRequirements: entries.every(
      ({ referencedPhase553RunnerRequirementId }) =>
        referencedPhase553RunnerRequirementId.startsWith("phase5-53.")
    ),
    locusAndMultiverseConsumerTargetsOnly: entries.every(
      ({ consumerTargetOnly }) => consumerTargetOnly === true
    ),
    consumerRepoModifiedByArdyn: false,
    runnerImplementedByArdyn: false,
    testHarnessImplementedByArdyn: false,
    importExportCommandImplemented: false,
    packageExportImplemented: false,
    consumerSideCiImplemented: false,
    fixtureDiscoveryRuntimeImplemented: false,
    browserRenderingHarnessImplemented: false,
    browserWcagAutomationImplemented: false,
    visualRegressionHarnessImplemented: false,
    screenReaderAutomationImplemented: false,
    uiFrontendBrowserRenderingImplemented: false,
    allBlockedAuthorizationFlagsFalse: entries.every(
      ({ explicitBlockedAuthorizationFlags }) =>
        Object.values(explicitBlockedAuthorizationFlags).every(
          (value) => value === false
        )
    ),
    allUnsafeRunnerImportExportTestHarnessRuntimeFlagsFalse: entries.every(
      ({ unsafeRunnerImportExportTestHarnessRuntimeFlags }) =>
        Object.values(unsafeRunnerImportExportTestHarnessRuntimeFlags).every(
          (value) => value === false
        )
    ),
    allRuntimeEffectsFalse: entries.every(({ runtimeEffect }) =>
      Object.values(runtimeEffect).every((value) => value === false)
    ),
    allEntriesNonAuthorizing: entries.every(
      ({ nonAuthorizingProof }) => nonAuthorizingProof === true
    ),
    validationImplementsRunner: false,
    validationImplementsTestHarness: false,
    validationImplementsImportExportCommands: false,
    validationImplementsPackageExport: false,
    validationImplementsConsumerSideCi: false,
    validationImplementsFixtureDiscoveryRuntime: false,
    validationPerformsRendering: false,
    validationRunsBrowserWcagAutomation: false,
    validationCallsExternalConsumers: false,
    validationPerformsExternalLookups: false,
    validationScansFilesystem: false,
    validationControlsProcesses: false,
    runtimeExecutionEnabled: false,
    commandRuntimeControlEnabled: false,
    databaseStorageRuntimeWritesEnabled: false,
    secretsRuntimeIngestionEnabled: false,
    connectorGrantProduced: false,
    fabricRuntimeSurfaceEnabled: false,
    webSocketHttpSurfaceEnabled: false,
    mcpToolExposureEnabled: false,
    taskExecutionEnabled: false,
    secureDropImplemented: false,
    serviceDiscoveryEnabled: false,
    scheduleEnforcementEnabled: false,
    backgroundPollingEnabled: false,
    filesystemScanningEnabled: false,
    processControlEnabled: false
  };
}

function consumerOwnedDisplayConformanceRunnerTestPlanValidationRules() {
  return {
    referencesPhase550SchemaBoundaryRequired: true,
    referencesPhase551ExamplePackRequired: true,
    referencesPhase552ConformanceHandoffRequired: true,
    referencesPhase553RunnerRequirementsRequired: true,
    missingRequiredFieldsFailClosed: true,
    unknownConsumerNamesFailClosed: true,
    unknownTestPlanIntentFailsClosed: true,
    interactiveActionableIntentFailsClosed: true,
    enabledAuthorizationFlagsFailClosed: true,
    unsafeRunnerImportExportTestHarnessRuntimeFlagsFailClosed: true,
    nestedUnsafeInputFlagsFailClosed: true,
    hiddenRunnerImportExportTestHarnessRuntimeSemanticsFailClosed: true,
    secureDropImplementationSemanticsFailClosed: true,
    websocketHttpFabricMcpTaskExecutionSemanticsFailClosed: true,
    unknownReferencesFailClosed: true,
    runnerTestHarnessImportExportImplementationSemanticsFailClosed: true,
    canonicalTestPlanEntriesRequired: true,
    malformedTestPlanEntriesFailClosed: true,
    validationImplementsRunner: false,
    validationImplementsTestHarness: false,
    validationImplementsImportExportCommands: false,
    validationImplementsPackageExport: false,
    validationImplementsConsumerSideCi: false,
    validationImplementsFixtureDiscoveryRuntime: false,
    validationPerformsRendering: false,
    validationRunsBrowserWcagAutomation: false,
    validationCallsExternalConsumers: false,
    validationPerformsExternalLookups: false,
    validationScansFilesystem: false,
    validationControlsProcesses: false
  };
}

function consumerOwnedDisplayConformanceRunnerTestPlanGaps() {
  return [
    "The test plan is static metadata only; no Locus or Multiverse consumer-owned runner or test harness exists in Ardyn.",
    "No fixture import/export command, package export, consumer-side CI implementation, or fixture discovery runtime exists.",
    "No browser, rendering, WCAG automation, visual regression, or screen-reader QA harness exists in Ardyn.",
    "No consumer repository integration exists; Locus and Multiverse remain target consumers only.",
    "Secure Drop, registry, websocket/http, Fabric, MCP, task execution, service discovery, scheduling, filesystem, process, and external lookup behavior remain blocked."
  ];
}

function consumerOwnedDisplayConformanceRunnerTestPlanState(reviewedAt) {
  const testPlanEntries = consumerOwnedDisplayConformanceRunnerTestPlanEntries();

  return {
    schema: CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_TEST_PLAN_STATE_SCHEMA,
    schemaVersion:
      CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_TEST_PLAN_VERSION,
    stateKind:
      "consumer-owned-display-conformance-runner-test-plan-state",
    stateMode: "review-only",
    reviewedAt,
    sourcePhaseContext: {
      precedingSchemaBoundaryPhase: "5.50",
      precedingSchemaBoundaryArtifact:
        "tests/fixtures/host-policy/phase5-50/consumer-display-fixture-schema-boundary.json",
      precedingExamplePackPhase: "5.51",
      precedingExamplePackArtifact:
        "tests/fixtures/host-policy/phase5-51/consumer-display-fixture-example-pack.json",
      precedingConformanceHandoffPhase: "5.52",
      precedingConformanceHandoffArtifact:
        "tests/fixtures/host-policy/phase5-52/consumer-display-fixture-conformance-handoff.json",
      precedingRunnerRequirementsPhase: "5.53",
      precedingRunnerRequirementsArtifact:
        "tests/fixtures/host-policy/phase5-53/consumer-owned-display-conformance-runner-requirements.json",
      phase550ConsumerDisplayFixtureSchemaBoundaryReferenceOnly: true,
      phase551ConsumerDisplayFixtureExamplePackReferenceOnly: true,
      phase552ConsumerDisplayFixtureConformanceHandoffReferenceOnly: true,
      phase553ConsumerOwnedDisplayConformanceRunnerRequirementsReferenceOnly: true,
      ardynOwnsConsumerUi: false,
      consumerRunnerImplementedByArdyn: false,
      testHarnessImplementedByArdyn: false,
      importExportCommandImplementedByArdyn: false,
      packageExportImplementedByArdyn: false,
      consumerSideCiImplementedByArdyn: false,
      consumerRepoModifiedByArdyn: false
    },
    testPlanEntries,
    testPlanSummary:
      consumerOwnedDisplayConformanceRunnerTestPlanSummary(testPlanEntries),
    phase550SchemaBoundaryReference: {
      sourceBoundarySchema: CONSUMER_DISPLAY_FIXTURE_SCHEMA_BOUNDARY_SCHEMA,
      sourceBoundaryFixture:
        "tests/fixtures/host-policy/phase5-50/consumer-display-fixture-schema-boundary.json",
      validationHelper:
        "createConsumerDisplayFixtureSchemaBoundaryForReview",
      referencedByTestPlan: true,
      validationStartsRuntime: false,
      validationPerformsRendering: false,
      validationCallsConsumers: false
    },
    phase551ExamplePackReference: {
      sourceExamplePackSchema: CONSUMER_DISPLAY_FIXTURE_EXAMPLE_PACK_SCHEMA,
      sourceExamplePackFixture:
        "tests/fixtures/host-policy/phase5-51/consumer-display-fixture-example-pack.json",
      validationHelper:
        "createConsumerDisplayFixtureExamplePackForReview",
      referencedByTestPlan: true,
      validationStartsRuntime: false,
      validationPerformsRendering: false,
      validationCallsConsumers: false
    },
    phase552ConformanceHandoffReference: {
      sourceHandoffSchema: CONSUMER_DISPLAY_FIXTURE_CONFORMANCE_HANDOFF_SCHEMA,
      sourceHandoffFixture:
        "tests/fixtures/host-policy/phase5-52/consumer-display-fixture-conformance-handoff.json",
      validationHelper:
        "createConsumerDisplayFixtureConformanceHandoffForReview",
      referencedByTestPlan: true,
      validationStartsRuntime: false,
      validationPerformsRendering: false,
      validationCallsConsumers: false
    },
    phase553RunnerRequirementsReference: {
      sourceRunnerRequirementsSchema:
        CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_REQUIREMENTS_SCHEMA,
      sourceRunnerRequirementsFixture:
        "tests/fixtures/host-policy/phase5-53/consumer-owned-display-conformance-runner-requirements.json",
      validationHelper:
        "createConsumerOwnedDisplayConformanceRunnerRequirementsForReview",
      referencedByTestPlan: true,
      validationStartsRuntime: false,
      validationPerformsRendering: false,
      validationCallsConsumers: false
    },
    invalidTestPlanCasePolicy:
      consumerOwnedDisplayConformanceRunnerTestPlanValidationRules(),
    topDisplayConformanceRunnerTestPlanGaps:
      consumerOwnedDisplayConformanceRunnerTestPlanGaps(),
    recommendedNextPhase:
      "phase-5.55-consumer-owned-display-conformance-runner-result-schema-boundary",
    consumerOwnedDisplayConformanceRunnerTestPlanOnly: true,
    reviewOnly: true,
    authoritative: false,
    reviewArtifactOnly: true,
    nonAuthorizingProof: true,
    ...consumerDisplayAccessibilityForbiddenBehavior(),
    renderingCodeImplemented: false,
    browserRenderingHarnessImplemented: false,
    runnerImplementedByArdyn: false,
    testHarnessImplementedByArdyn: false,
    consumerOwnedRunnerImplemented: false,
    consumerConformanceRunnerImplemented: false,
    fixtureImportCommandImplemented: false,
    fixtureExportCommandImplemented: false,
    fixtureImportExportCommandsImplemented: false,
    importExportCommandImplemented: false,
    packageExportImplemented: false,
    consumerSideCiImplemented: false,
    fixtureDiscoveryRuntimeImplemented: false,
    consumerRepoModifiedByArdyn: false,
    browserWcagAutomationImplemented: false,
    visualRegressionHarnessImplemented: false,
    screenReaderAutomationImplemented: false,
    externalLookupsEnabled: false,
    filesystemScanningEnabled: false,
    processControlEnabled: false,
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

function consumerOwnedDisplayConformanceRunnerTestPlanRejectionReasons({
  accepted,
  classification
}) {
  const reasons = [
    "consumer_owned_display_conformance_runner_test_plan_is_review_only",
    "test_plan_entries_are_metadata_only",
    "references_phase_5_50_schema_boundary",
    "references_phase_5_51_example_pack",
    "references_phase_5_52_conformance_handoff",
    "references_phase_5_53_runner_requirements",
    "ardyn_does_not_implement_runner_test_harness_import_export_package_export_ci_ui_browser_rendering_or_consumer_repo_changes",
    "runtime_command_db_storage_secrets_connector_fabric_websocket_http_mcp_task_secure_drop_service_discovery_schedule_filesystem_process_authorizations_false",
    "unsafe_runner_import_export_test_harness_runtime_flags_fail_closed",
    "fallow_runtime_not_used",
    "runtime_enablement_still_blocked"
  ];

  return accepted
    ? reasons
    : [
        ...reasons,
        `input_classification_${classification}`,
        "consumer_owned_display_conformance_runner_test_plan_not_produced"
      ];
}

function consumerOwnedDisplayConformanceRunnerTestPlanResult({
  reviewedAt,
  reviewedAtDefaulted,
  classification,
  accepted,
  consumerOwnedDisplayConformanceRunnerTestPlan
}) {
  return {
    schema: CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_TEST_PLAN_SCHEMA,
    schemaVersion:
      CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_TEST_PLAN_VERSION,
    consumerOwnedDisplayConformanceRunnerTestPlanKind:
      CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_TEST_PLAN_KIND,
    consumerOwnedDisplayConformanceRunnerTestPlanMode: "review-only",
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    consumerOwnedDisplayConformanceRunnerTestPlanProduced: accepted,
    consumerOwnedDisplayConformanceRunnerTestPlan,
    testPlanSummary: accepted
      ? consumerOwnedDisplayConformanceRunnerTestPlan.testPlanSummary
      : null,
    phase550SchemaBoundaryReference: accepted
      ? consumerOwnedDisplayConformanceRunnerTestPlan
          .phase550SchemaBoundaryReference
      : null,
    phase551ExamplePackReference: accepted
      ? consumerOwnedDisplayConformanceRunnerTestPlan
          .phase551ExamplePackReference
      : null,
    phase552ConformanceHandoffReference: accepted
      ? consumerOwnedDisplayConformanceRunnerTestPlan
          .phase552ConformanceHandoffReference
      : null,
    phase553RunnerRequirementsReference: accepted
      ? consumerOwnedDisplayConformanceRunnerTestPlan
          .phase553RunnerRequirementsReference
      : null,
    testPlanEntries: accepted
      ? consumerOwnedDisplayConformanceRunnerTestPlan.testPlanEntries
      : [],
    invalidTestPlanCasePolicy: accepted
      ? consumerOwnedDisplayConformanceRunnerTestPlan.invalidTestPlanCasePolicy
      : consumerOwnedDisplayConformanceRunnerTestPlanValidationRules(),
    topDisplayConformanceRunnerTestPlanGaps: accepted
      ? consumerOwnedDisplayConformanceRunnerTestPlan
          .topDisplayConformanceRunnerTestPlanGaps
      : [],
    recommendedNextPhase: accepted
      ? consumerOwnedDisplayConformanceRunnerTestPlan.recommendedNextPhase
      : null,
    consumerOwnedDisplayConformanceRunnerTestPlanOnly: true,
    reviewOnly: true,
    authoritative: false,
    reviewArtifactOnly: true,
    nonAuthorizingProof: true,
    ...consumerDisplayAccessibilityForbiddenBehavior(),
    renderingCodeImplemented: false,
    browserRenderingHarnessImplemented: false,
    runnerImplementedByArdyn: false,
    testHarnessImplementedByArdyn: false,
    consumerOwnedRunnerImplemented: false,
    consumerConformanceRunnerImplemented: false,
    fixtureImportCommandImplemented: false,
    fixtureExportCommandImplemented: false,
    fixtureImportExportCommandsImplemented: false,
    importExportCommandImplemented: false,
    packageExportImplemented: false,
    consumerSideCiImplemented: false,
    fixtureDiscoveryRuntimeImplemented: false,
    consumerRepoModifiedByArdyn: false,
    browserWcagAutomationImplemented: false,
    visualRegressionHarnessImplemented: false,
    screenReaderAutomationImplemented: false,
    externalLookupsEnabled: false,
    filesystemScanningEnabled: false,
    processControlEnabled: false,
    rejectionReasons:
      consumerOwnedDisplayConformanceRunnerTestPlanRejectionReasons({
        accepted,
        classification
      }),
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

export function createConsumerOwnedDisplayConformanceRunnerTestPlanForReview(
  input = {}
) {
  const inputRecord =
    consumerOwnedDisplayConformanceRunnerTestPlanInputRecord(input);
  const reviewedAt =
    consumerOwnedDisplayConformanceRunnerTestPlanReviewedAt(inputRecord);
  const reviewedAtDefaulted = isReviewedAtDefaulted(inputRecord);
  const classification =
    consumerOwnedDisplayConformanceRunnerTestPlanInputClassification(inputRecord);
  const accepted =
    classification ===
    VALID_CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_TEST_PLAN_CLASSIFICATION;
  const consumerOwnedDisplayConformanceRunnerTestPlan = accepted
    ? consumerOwnedDisplayConformanceRunnerTestPlanState(reviewedAt)
    : null;

  return consumerOwnedDisplayConformanceRunnerTestPlanResult({
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    accepted,
    consumerOwnedDisplayConformanceRunnerTestPlan
  });
}

const CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_RESULT_SCHEMA_BOUNDARY_STATE_SCHEMA =
  "ardyn.phase-5.55.consumer-owned-display-conformance-runner-result-schema-boundary-state";
const VALID_CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_RESULT_SCHEMA_BOUNDARY_CLASSIFICATION =
  "valid_consumer_owned_display_conformance_runner_result_schema_boundary_runtime_still_blocked";
const MALFORMED_CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_RESULT_SCHEMA_BOUNDARY_CLASSIFICATION =
  "malformed_consumer_owned_display_conformance_runner_result_schema_boundary_input_rejected";
const CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_RESULT_SCHEMA_BOUNDARY_INTENT =
  "metadata_only";

const CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_RESULT_SCHEMA_BOUNDARY_REQUIRED_FIELDS =
  Object.freeze([
    "resultSchemaId",
    "consumerName",
    "displaySurfaceId",
    "sourceArdynArtifactType",
    "resultSchemaIntent",
    "referencedPhase550SchemaBoundaryId",
    "referencedPhase551FixtureId",
    "referencedPhase551FixtureGroup",
    "referencedPhase552HandoffId",
    "referencedPhase553RunnerRequirementId",
    "referencedPhase554TestPlanId",
    "futureConsumerOwnedResultResponsibility",
    "allowedResultFields",
    "forbiddenResultFields",
    "deterministicOrderingHashExpectations",
    "accessibilityWcagResultNotes",
    "requiredFutureContractBeforeExecutableResultProduction",
    "explicitBlockedAuthorizationFlags",
    "unsafeRunnerResultProducerImportExportTestHarnessRuntimeFlags",
    "consumerTargetOnly",
    "runnerImplementedByArdyn",
    "resultProducerImplementedByArdyn",
    "resultCollectorImplementedByArdyn",
    "testHarnessImplementedByArdyn",
    "importExportCommandImplemented",
    "browserRenderingHarnessImplemented",
    "packageExportImplemented",
    "consumerSideCiImplemented",
    "fixtureDiscoveryRuntimeImplemented",
    "consumerRepoModifiedByArdyn",
    "nonAuthorizingProof"
  ]);

const CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_RESULT_SCHEMA_BOUNDARY_UNSAFE_FIELDS =
  Object.freeze([
    ...CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_TEST_PLAN_UNSAFE_FIELDS,
    "resultProducerEnabled",
    "resultProducerImplementedByArdyn",
    "resultCollectorEnabled",
    "resultCollectorImplementedByArdyn",
    "resultProductionEnabled",
    "resultCollectionEnabled",
    "resultEmissionEnabled",
    "resultWriteEnabled",
    "resultExportEnabled",
    "resultImportEnabled",
    "resultStorageWritesEnabled",
    "conformanceResultProducerImplemented",
    "conformanceResultCollectorImplemented",
    "consumerResultProducerImplemented",
    "consumerResultCollectorImplemented",
    "resultSchemaExecutionEnabled"
  ]);

const CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_RESULT_SCHEMA_BOUNDARY_IMPLEMENTATION_FIELDS =
  Object.freeze([
    ...CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_TEST_PLAN_IMPLEMENTATION_FIELDS,
    "resultProducerEnabled",
    "resultProducerImplementedByArdyn",
    "resultCollectorEnabled",
    "resultCollectorImplementedByArdyn",
    "resultProductionEnabled",
    "resultCollectionEnabled",
    "resultEmissionEnabled",
    "resultWriteEnabled",
    "resultExportEnabled",
    "resultImportEnabled",
    "resultStorageWritesEnabled",
    "conformanceResultProducerImplemented",
    "conformanceResultCollectorImplemented",
    "consumerResultProducerImplemented",
    "consumerResultCollectorImplemented",
    "resultSchemaExecutionEnabled"
  ]);

const CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_RESULT_SCHEMA_BOUNDARY_HIDDEN_FIELDS =
  Object.freeze([
    ...CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_TEST_PLAN_HIDDEN_FIELDS,
    "hiddenResultProducerSemanticsEnabled",
    "hiddenResultCollectorSemanticsEnabled",
    "hiddenResultProductionSemanticsEnabled",
    "hiddenResultCollectionSemanticsEnabled",
    "hiddenResultWriteSemanticsEnabled",
    "hiddenResultRuntimeSemanticsEnabled"
  ]);

function consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryInputRecord(
  input
) {
  return isPlainObjectRecord(input) ? input : null;
}

function consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryReviewedAt(
  inputRecord
) {
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

function consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryInputMalformed(
  inputRecord
) {
  return (
    inputRecord === null ||
    (Object.prototype.hasOwnProperty.call(inputRecord, "reviewedAt") &&
      !isUtcIsoTimestampWithMilliseconds(inputRecord.reviewedAt)) ||
    (Object.prototype.hasOwnProperty.call(inputRecord, "resultSchemaEntries") &&
      !Array.isArray(inputRecord.resultSchemaEntries))
  );
}

function consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryInputEntries(
  inputRecord
) {
  return Array.isArray(inputRecord?.resultSchemaEntries)
    ? inputRecord.resultSchemaEntries
    : null;
}

function consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryMissingRequiredField(
  entry
) {
  if (!isPlainObjectRecord(entry)) {
    return true;
  }

  return CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_RESULT_SCHEMA_BOUNDARY_REQUIRED_FIELDS.some(
    (field) => !Object.prototype.hasOwnProperty.call(entry, field)
  );
}

function consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryDeterminismMalformed(
  expectations
) {
  return (
    !isPlainObjectRecord(expectations) ||
    expectations.deterministicResultSchemaIdsRequired !== true ||
    expectations.deterministicOrderingRequired !== true ||
    expectations.deterministicAllowedResultFieldOrderingRequired !== true ||
    expectations.deterministicForbiddenResultFieldOrderingRequired !== true ||
    expectations.deterministicHashInputOrderingRequired !== true ||
    expectations.noClockNetworkRandomnessAllowed !== true ||
    expectations.consumerOwnedResultOutputMustBeReviewOnly !== true ||
    expectations.hashDoesNotAuthorizeRuntime !== true
  );
}

function consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryMalformed(
  entry
) {
  return (
    consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryMissingRequiredField(
      entry
    ) ||
    typeof entry.resultSchemaId !== "string" ||
    entry.resultSchemaId.length === 0 ||
    typeof entry.displaySurfaceId !== "string" ||
    entry.displaySurfaceId.length === 0 ||
    typeof entry.sourceArdynArtifactType !== "string" ||
    entry.sourceArdynArtifactType.length === 0 ||
    entry.resultSchemaIntent !==
      CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_RESULT_SCHEMA_BOUNDARY_INTENT ||
    typeof entry.referencedPhase550SchemaBoundaryId !== "string" ||
    entry.referencedPhase550SchemaBoundaryId.length === 0 ||
    typeof entry.referencedPhase551FixtureId !== "string" ||
    entry.referencedPhase551FixtureId.length === 0 ||
    typeof entry.referencedPhase551FixtureGroup !== "string" ||
    entry.referencedPhase551FixtureGroup.length === 0 ||
    typeof entry.referencedPhase552HandoffId !== "string" ||
    entry.referencedPhase552HandoffId.length === 0 ||
    typeof entry.referencedPhase553RunnerRequirementId !== "string" ||
    entry.referencedPhase553RunnerRequirementId.length === 0 ||
    typeof entry.referencedPhase554TestPlanId !== "string" ||
    entry.referencedPhase554TestPlanId.length === 0 ||
    typeof entry.futureConsumerOwnedResultResponsibility !== "string" ||
    entry.futureConsumerOwnedResultResponsibility.length === 0 ||
    !Array.isArray(entry.allowedResultFields) ||
    entry.allowedResultFields.length < 8 ||
    entry.allowedResultFields.some((field) => typeof field !== "string") ||
    !Array.isArray(entry.forbiddenResultFields) ||
    entry.forbiddenResultFields.length < 10 ||
    entry.forbiddenResultFields.some((field) => typeof field !== "string") ||
    consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryDeterminismMalformed(
      entry.deterministicOrderingHashExpectations
    ) ||
    consumerDisplayFixtureSchemaBoundaryAccessibilityMalformed(
      entry.accessibilityWcagResultNotes
    ) ||
    typeof entry.requiredFutureContractBeforeExecutableResultProduction !==
      "string" ||
    entry.requiredFutureContractBeforeExecutableResultProduction.length === 0 ||
    !isPlainObjectRecord(entry.explicitBlockedAuthorizationFlags) ||
    !isPlainObjectRecord(
      entry.unsafeRunnerResultProducerImportExportTestHarnessRuntimeFlags
    ) ||
    entry.consumerTargetOnly !== true ||
    entry.runnerImplementedByArdyn !== false ||
    entry.resultProducerImplementedByArdyn !== false ||
    entry.resultCollectorImplementedByArdyn !== false ||
    entry.testHarnessImplementedByArdyn !== false ||
    entry.importExportCommandImplemented !== false ||
    entry.browserRenderingHarnessImplemented !== false ||
    entry.packageExportImplemented !== false ||
    entry.consumerSideCiImplemented !== false ||
    entry.fixtureDiscoveryRuntimeImplemented !== false ||
    entry.consumerRepoModifiedByArdyn !== false ||
    entry.nonAuthorizingProof !== true
  );
}

function consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryContainsEntryIssue(
  entries,
  predicate
) {
  return entries !== null && entries.some((entry) => predicate(entry));
}

function consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryAuthorizationFlagEnabled(
  entry
) {
  return (
    consumerDisplayAccessibilityContractMapContainsTrue(
      entry?.explicitBlockedAuthorizationFlags
    ) ||
    consumerDisplayAccessibilityContractMapContainsTrue(
      entry?.blockedAuthorizationFlags
    ) ||
    consumerDisplayAccessibilityContractMapContainsTrue(entry?.authorizationFlags)
  );
}

function consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryUnsafeFlagEnabled(
  entry
) {
  return (
    consumerDisplayAccessibilityContractMapContainsTrue(
      entry?.unsafeRunnerResultProducerImportExportTestHarnessRuntimeFlags
    ) ||
    consumerDisplayAccessibilityContractMapFieldTruePresent(
      entry,
      CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_RESULT_SCHEMA_BOUNDARY_UNSAFE_FIELDS
    )
  );
}

function consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryTopLevelFieldTruePresent(
  entry,
  fields
) {
  return (
    isPlainObjectRecord(entry) &&
    fields.some((field) => entry[field] === true)
  );
}

function consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryRecursiveUnsafeFlagEnabled(
  entry
) {
  return (
    consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryUnsafeFlagEnabled(
      entry
    ) ||
    CONSUMER_DISPLAY_ACCESSIBILITY_CONTRACT_MAP_UNSAFE_FIELD_GROUPS.some(
      ({ fields }) =>
        consumerDisplayAccessibilityContractMapFieldTruePresent(entry, fields)
    ) ||
    consumerDisplayAccessibilityContractMapContainsTrue(entry?.runtimeEffect)
  );
}

function consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryReferenceValid(
  entry
) {
  const testPlan = consumerOwnedDisplayConformanceRunnerTestPlanEntries().find(
    ({ testPlanId }) => testPlanId === entry?.referencedPhase554TestPlanId
  );

  return (
    testPlan !== undefined &&
    testPlan.referencedPhase550SchemaBoundaryId ===
      entry.referencedPhase550SchemaBoundaryId &&
    testPlan.referencedPhase551FixtureId ===
      entry.referencedPhase551FixtureId &&
    testPlan.referencedPhase551FixtureGroup ===
      entry.referencedPhase551FixtureGroup &&
    testPlan.referencedPhase552HandoffId ===
      entry.referencedPhase552HandoffId &&
    testPlan.referencedPhase553RunnerRequirementId ===
      entry.referencedPhase553RunnerRequirementId &&
    testPlan.consumerName === entry.consumerName &&
    testPlan.displaySurfaceId === entry.displaySurfaceId &&
    testPlan.sourceArdynArtifactType === entry.sourceArdynArtifactType
  );
}

function consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryEntriesCanonical(
  entries
) {
  if (entries === null) {
    return true;
  }

  return (
    JSON.stringify(entries) ===
    JSON.stringify(consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryEntries())
  );
}

function consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryInputClassification(
  inputRecord
) {
  if (
    consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryInputMalformed(
      inputRecord
    )
  ) {
    return MALFORMED_CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_RESULT_SCHEMA_BOUNDARY_CLASSIFICATION;
  }

  const entries =
    consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryInputEntries(
      inputRecord
    );

  if (
    consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryContainsEntryIssue(
      entries,
      consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryMissingRequiredField
    )
  ) {
    return "missing_required_consumer_owned_display_conformance_runner_result_schema_boundary_entry_rejected";
  }

  if (
    consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryContainsEntryIssue(
      entries,
      (entry) => entry.consumerName !== "Locus" && entry.consumerName !== "Multiverse"
    )
  ) {
    return "unknown_consumer_name_consumer_owned_display_conformance_runner_result_schema_boundary_input_rejected";
  }

  if (
    consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryContainsEntryIssue(
      entries,
      (entry) =>
        [
          "interactive",
          "actionable",
          "runtime_action",
          "command_action",
          "result_producer",
          "result_collector",
          "test_harness",
          "executable_runner",
          "executable_result"
        ].includes(entry.resultSchemaIntent)
    )
  ) {
    return "interactive_actionable_intent_consumer_owned_display_conformance_runner_result_schema_boundary_input_rejected";
  }

  if (
    consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryContainsEntryIssue(
      entries,
      (entry) =>
        entry.resultSchemaIntent !==
        CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_RESULT_SCHEMA_BOUNDARY_INTENT
    )
  ) {
    return "unknown_result_schema_intent_consumer_owned_display_conformance_runner_result_schema_boundary_input_rejected";
  }

  if (
    consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryContainsEntryIssue(
      entries,
      (entry) =>
        consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryTopLevelFieldTruePresent(
          entry,
          CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_RESULT_SCHEMA_BOUNDARY_IMPLEMENTATION_FIELDS
        )
    ) ||
    consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryTopLevelFieldTruePresent(
      inputRecord,
      CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_RESULT_SCHEMA_BOUNDARY_IMPLEMENTATION_FIELDS
    )
  ) {
    return "runner_result_producer_import_export_test_harness_implementation_semantics_consumer_owned_display_conformance_runner_result_schema_boundary_input_rejected";
  }

  if (
    consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryContainsEntryIssue(
      entries,
      consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryMalformed
    )
  ) {
    return MALFORMED_CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_RESULT_SCHEMA_BOUNDARY_CLASSIFICATION;
  }

  if (
    consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryContainsEntryIssue(
      entries,
      consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryAuthorizationFlagEnabled
    )
  ) {
    return "authorization_flags_enabled_consumer_owned_display_conformance_runner_result_schema_boundary_input_rejected";
  }

  if (
    consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryContainsEntryIssue(
      entries,
      consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryUnsafeFlagEnabled
    )
  ) {
    return "unsafe_runner_result_producer_import_export_test_harness_runtime_flags_consumer_owned_display_conformance_runner_result_schema_boundary_input_rejected";
  }

  if (
    consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryContainsEntryIssue(
      entries,
      (entry) =>
        consumerDisplayAccessibilityContractMapFieldTruePresent(
          entry,
          CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_RESULT_SCHEMA_BOUNDARY_HIDDEN_FIELDS
        )
    )
  ) {
    return "hidden_runner_result_producer_import_export_test_harness_runtime_semantics_consumer_owned_display_conformance_runner_result_schema_boundary_input_rejected";
  }

  if (
    consumerDisplayAccessibilityContractMapFieldTruePresent(
      inputRecord,
      CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_RESULT_SCHEMA_BOUNDARY_HIDDEN_FIELDS
    )
  ) {
    return "hidden_runner_result_producer_import_export_test_harness_runtime_semantics_consumer_owned_display_conformance_runner_result_schema_boundary_input_rejected";
  }

  if (
    consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryContainsEntryIssue(
      entries,
      (entry) =>
        consumerDisplayAccessibilityContractMapFieldTruePresent(
          entry,
          CONSUMER_DISPLAY_FIXTURE_SCHEMA_BOUNDARY_SECURE_DROP_FIELDS
        )
    )
  ) {
    return "secure_drop_implementation_semantics_consumer_owned_display_conformance_runner_result_schema_boundary_input_rejected";
  }

  if (
    consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryContainsEntryIssue(
      entries,
      (entry) =>
        consumerDisplayAccessibilityContractMapFieldTruePresent(
          entry,
          CONSUMER_DISPLAY_FIXTURE_SCHEMA_BOUNDARY_RUNTIME_SURFACE_FIELDS
        )
    )
  ) {
    return "websocket_http_fabric_mcp_task_execution_semantics_consumer_owned_display_conformance_runner_result_schema_boundary_input_rejected";
  }

  if (
    consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryContainsEntryIssue(
      entries,
      (entry) =>
        !consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryReferenceValid(
          entry
        )
    )
  ) {
    return "unknown_reference_consumer_owned_display_conformance_runner_result_schema_boundary_input_rejected";
  }

  if (
    consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryContainsEntryIssue(
      entries,
      consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryRecursiveUnsafeFlagEnabled
    ) ||
    consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryRecursiveUnsafeFlagEnabled(
      inputRecord
    )
  ) {
    return "nested_unsafe_flags_consumer_owned_display_conformance_runner_result_schema_boundary_input_rejected";
  }

  if (
    !consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryEntriesCanonical(
      entries
    )
  ) {
    return "noncanonical_consumer_owned_display_conformance_runner_result_schema_boundary_input_rejected";
  }

  return VALID_CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_RESULT_SCHEMA_BOUNDARY_CLASSIFICATION;
}

function consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryUnsafeFlags() {
  return {
    runnerEnabled: false,
    runnerImplementedByArdyn: false,
    runnerExecutesFixtures: false,
    resultProducerEnabled: false,
    resultProducerImplementedByArdyn: false,
    resultCollectorEnabled: false,
    resultCollectorImplementedByArdyn: false,
    resultProductionEnabled: false,
    resultCollectionEnabled: false,
    resultEmissionEnabled: false,
    resultWriteEnabled: false,
    resultExportEnabled: false,
    resultImportEnabled: false,
    resultStorageWritesEnabled: false,
    testHarnessEnabled: false,
    testHarnessImplementedByArdyn: false,
    testHarnessExecutionEnabled: false,
    executableTestHarnessImplemented: false,
    consumerTestRunnerImplemented: false,
    testPlanExecutionEnabled: false,
    fixtureImportEnabled: false,
    fixtureExportEnabled: false,
    importExportCommandImplemented: false,
    packageExportImplemented: false,
    consumerSideCiImplemented: false,
    fixtureDiscoveryRuntimeImplemented: false,
    liveRegistryAccessEnabled: false,
    externalLookupEnabled: false,
    filesystemScanningEnabled: false,
    processControlEnabled: false,
    browserWcagAutomationImplemented: false,
    visualRegressionHarnessImplemented: false,
    screenReaderAutomationImplemented: false,
    hiddenRunnerSemanticsEnabled: false,
    hiddenResultProducerSemanticsEnabled: false,
    hiddenResultCollectorSemanticsEnabled: false,
    hiddenTestHarnessSemanticsEnabled: false,
    hiddenImportSemanticsEnabled: false,
    hiddenExportSemanticsEnabled: false,
    hiddenRuntimeSemanticsEnabled: false
  };
}

function consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryDefinitions() {
  return [
    {
      testPlanId:
        "phase5-54.locus.status-control-panel-fixture-conformance.test-plan",
      resultSchemaId:
        "phase5-55.locus.status-control-panel-conformance.result-schema",
      responsibility:
        "Future Locus-owned result producers may emit status/control panel conformance results only after a separate executable result-production contract exists."
    },
    {
      testPlanId:
        "phase5-54.locus.review-artifact-panel-fixture-conformance.test-plan",
      resultSchemaId:
        "phase5-55.locus.review-artifact-panel-conformance.result-schema",
      responsibility:
        "Future Locus-owned result producers may emit review artifact panel conformance results only after a separate executable result-production contract exists."
    },
    {
      testPlanId:
        "phase5-54.locus.capability-metadata-panel-fixture-conformance.test-plan",
      resultSchemaId:
        "phase5-55.locus.capability-metadata-panel-conformance.result-schema",
      responsibility:
        "Future Locus-owned result producers may emit capability metadata panel conformance results only after a separate executable result-production contract exists."
    },
    {
      testPlanId:
        "phase5-54.locus.blocked-runtime-command-indicator-conformance.test-plan",
      resultSchemaId:
        "phase5-55.locus.blocked-runtime-command-indicator-conformance.result-schema",
      responsibility:
        "Future Locus-owned result producers may emit blocked runtime/command indicator conformance results only after a separate executable result-production contract exists."
    },
    {
      testPlanId:
        "phase5-54.locus.future-secure-drop-compose-inbox-placeholder-indicator-conformance.test-plan",
      resultSchemaId:
        "phase5-55.locus.future-secure-drop-compose-inbox-placeholder-conformance.result-schema",
      responsibility:
        "Future Locus-owned result producers may emit Secure Drop placeholder conformance results only after a separate executable result-production contract exists and without implying Secure Drop implementation."
    },
    {
      testPlanId:
        "phase5-54.locus.accessibility-wcag-display-expectations.test-plan",
      resultSchemaId:
        "phase5-55.locus.accessibility-wcag-display-expectation.result-schema",
      responsibility:
        "Future Locus-owned result producers may emit accessibility/WCAG display expectation results only after a separate executable result-production contract exists."
    },
    {
      testPlanId:
        "phase5-54.multiverse.world-project-status-card-conformance.test-plan",
      resultSchemaId:
        "phase5-55.multiverse.world-project-status-card-conformance.result-schema",
      responsibility:
        "Future Multiverse-owned result producers may emit world/project status card conformance results only after a separate executable result-production contract exists."
    },
    {
      testPlanId:
        "phase5-54.multiverse.visible-ai-capability-badge-conformance.test-plan",
      resultSchemaId:
        "phase5-55.multiverse.visible-ai-capability-badge-conformance.result-schema",
      responsibility:
        "Future Multiverse-owned result producers may emit visible AI capability badge conformance results only after a separate executable result-production contract exists."
    },
    {
      testPlanId:
        "phase5-54.multiverse.task-capability-wrapper-status-card-conformance.test-plan",
      resultSchemaId:
        "phase5-55.multiverse.task-capability-wrapper-status-card-conformance.result-schema",
      responsibility:
        "Future Multiverse-owned result producers may emit task/capability wrapper status card conformance results only after a separate executable result-production contract exists."
    },
    {
      testPlanId:
        "phase5-54.multiverse.citizen-adapter-candidate-badge-conformance.test-plan",
      resultSchemaId:
        "phase5-55.multiverse.citizen-adapter-candidate-badge-conformance.result-schema",
      responsibility:
        "Future Multiverse-owned result producers may emit citizen/adapter candidate badge conformance results only after a separate executable result-production contract exists."
    },
    {
      testPlanId:
        "phase5-54.multiverse.registry-websocket-mcp-task-blocked-indicator-conformance.test-plan",
      resultSchemaId:
        "phase5-55.multiverse.registry-websocket-mcp-task-blocked-indicator-conformance.result-schema",
      responsibility:
        "Future Multiverse-owned result producers may emit registry/websocket/MCP/task blocked indicator conformance results only after a separate executable result-production contract exists."
    },
    {
      testPlanId:
        "phase5-54.multiverse.accessibility-wcag-display-expectations.test-plan",
      resultSchemaId:
        "phase5-55.multiverse.accessibility-wcag-display-expectation.result-schema",
      responsibility:
        "Future Multiverse-owned result producers may emit accessibility/WCAG display expectation results only after a separate executable result-production contract exists."
    }
  ];
}

function consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryAllowedResultFields(
  resultSchemaId
) {
  return [
    "schema",
    "schemaVersion",
    "resultSchemaId",
    "consumerName",
    "displaySurfaceId",
    "referencedPhase551FixtureId",
    "referencedPhase554TestPlanId",
    "conformanceStatus",
    "assertionResults",
    "accessibilityWcagResultNotes",
    "deterministicInputDigest",
    "runtimeBlockedFlags",
    "nonAuthorizingProof",
    `resultSchemaBoundary:${resultSchemaId}`
  ];
}

function consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryForbiddenResultFields() {
  return [
    "runnerCommand",
    "execute",
    "resultProducerCommand",
    "resultCollectorCommand",
    "testHarnessCommand",
    "approvalDecision",
    "approvalGrant",
    "connectorGrant",
    "secret",
    "vault",
    "env",
    "runtimeStdout",
    "runtimeStderr",
    "databaseWrite",
    "storageWrite",
    "filesystemPath",
    "processId",
    "networkEndpoint",
    "secureDropPayload"
  ];
}

function consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryEntry(
  definition
) {
  const testPlan = consumerOwnedDisplayConformanceRunnerTestPlanEntries().find(
    ({ testPlanId }) => testPlanId === definition.testPlanId
  );

  return {
    resultSchemaId: definition.resultSchemaId,
    consumerName: testPlan.consumerName,
    displaySurfaceId: testPlan.displaySurfaceId,
    sourceArdynArtifactType: testPlan.sourceArdynArtifactType,
    resultSchemaIntent:
      CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_RESULT_SCHEMA_BOUNDARY_INTENT,
    referencedPhase550SchemaBoundaryId:
      testPlan.referencedPhase550SchemaBoundaryId,
    referencedPhase551FixtureId: testPlan.referencedPhase551FixtureId,
    referencedPhase551FixtureGroup: testPlan.referencedPhase551FixtureGroup,
    referencedPhase552HandoffId: testPlan.referencedPhase552HandoffId,
    referencedPhase553RunnerRequirementId:
      testPlan.referencedPhase553RunnerRequirementId,
    referencedPhase554TestPlanId: testPlan.testPlanId,
    futureConsumerOwnedResultResponsibility: definition.responsibility,
    allowedResultFields:
      consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryAllowedResultFields(
        definition.resultSchemaId
      ),
    forbiddenResultFields:
      consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryForbiddenResultFields(),
    deterministicOrderingHashExpectations: {
      deterministicResultSchemaIdsRequired: true,
      deterministicOrderingRequired: true,
      deterministicAllowedResultFieldOrderingRequired: true,
      deterministicForbiddenResultFieldOrderingRequired: true,
      deterministicHashInputOrderingRequired: true,
      noClockNetworkRandomnessAllowed: true,
      consumerOwnedResultOutputMustBeReviewOnly: true,
      hashDoesNotAuthorizeRuntime: true
    },
    accessibilityWcagResultNotes: {
      ...testPlan.accessibilityWcagAssertionNotes,
      resultAccessibilityScope:
        "future-consumer-owned-result-accessibility-contract-required-before-certification",
      resultMustRemainReadableWithoutColorOrMotion: true,
      resultMustExposeScreenReaderSafeStatus: true,
      resultMustNotExposeHiddenActionSemantics: true
    },
    requiredFutureContractBeforeExecutableResultProduction:
      "A separate consumer-owned executable result-production contract must exist before Locus or Multiverse can produce, collect, import, export, package, publish, run CI for, or render conformance results.",
    explicitBlockedAuthorizationFlags:
      consumerDisplayAccessibilityAuthorizationFlags(),
    unsafeRunnerResultProducerImportExportTestHarnessRuntimeFlags:
      consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryUnsafeFlags(),
    consumerTargetOnly: true,
    runnerImplementedByArdyn: false,
    resultProducerImplementedByArdyn: false,
    resultCollectorImplementedByArdyn: false,
    testHarnessImplementedByArdyn: false,
    importExportCommandImplemented: false,
    browserRenderingHarnessImplemented: false,
    packageExportImplemented: false,
    consumerSideCiImplemented: false,
    fixtureDiscoveryRuntimeImplemented: false,
    consumerRepoModifiedByArdyn: false,
    nonAuthorizingProof: true,
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

function consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryEntries() {
  return consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryDefinitions().map(
    consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryEntry
  );
}

function consumerOwnedDisplayConformanceRunnerResultSchemaBoundarySummary(
  entries
) {
  const locusResultSchemaEntryCount = entries.filter(
    ({ consumerName }) => consumerName === "Locus"
  ).length;
  const multiverseResultSchemaEntryCount = entries.filter(
    ({ consumerName }) => consumerName === "Multiverse"
  ).length;

  return {
    resultSchemaBoundaryKind:
      CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_RESULT_SCHEMA_BOUNDARY_KIND,
    resultSchemaBoundaryMode: "review-only",
    resultSchemaEntryCount: entries.length,
    consumerNames: ["Locus", "Multiverse"],
    locusResultSchemaEntryCount,
    multiverseResultSchemaEntryCount,
    resultSchemaIntent:
      CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_RESULT_SCHEMA_BOUNDARY_INTENT,
    deterministicResultSchemaIds: entries.map(
      ({ resultSchemaId }) => resultSchemaId
    ),
    referencedPhase550SchemaBoundaryIds: entries.map(
      ({ referencedPhase550SchemaBoundaryId }) =>
        referencedPhase550SchemaBoundaryId
    ),
    referencedPhase551FixtureIds: entries.map(
      ({ referencedPhase551FixtureId }) => referencedPhase551FixtureId
    ),
    referencedPhase551FixtureGroups: entries.map(
      ({ referencedPhase551FixtureGroup }) => referencedPhase551FixtureGroup
    ),
    referencedPhase552HandoffIds: entries.map(
      ({ referencedPhase552HandoffId }) => referencedPhase552HandoffId
    ),
    referencedPhase553RunnerRequirementIds: entries.map(
      ({ referencedPhase553RunnerRequirementId }) =>
        referencedPhase553RunnerRequirementId
    ),
    referencedPhase554TestPlanIds: entries.map(
      ({ referencedPhase554TestPlanId }) => referencedPhase554TestPlanId
    ),
    referencesPhase550SchemaBoundary: entries.every(
      ({ referencedPhase550SchemaBoundaryId }) =>
        referencedPhase550SchemaBoundaryId.startsWith("phase5-50.")
    ),
    referencesPhase551ExamplePack: entries.every(
      ({ referencedPhase551FixtureId }) =>
        referencedPhase551FixtureId.startsWith("phase5-51.")
    ),
    referencesPhase552ConformanceHandoff: entries.every(
      ({ referencedPhase552HandoffId }) =>
        referencedPhase552HandoffId.startsWith("phase5-52.")
    ),
    referencesPhase553RunnerRequirements: entries.every(
      ({ referencedPhase553RunnerRequirementId }) =>
        referencedPhase553RunnerRequirementId.startsWith("phase5-53.")
    ),
    referencesPhase554TestPlan: entries.every(
      ({ referencedPhase554TestPlanId }) =>
        referencedPhase554TestPlanId.startsWith("phase5-54.")
    ),
    locusAndMultiverseConsumerTargetsOnly: entries.every(
      ({ consumerTargetOnly }) => consumerTargetOnly === true
    ),
    consumerRepoModifiedByArdyn: false,
    runnerImplementedByArdyn: false,
    resultProducerImplementedByArdyn: false,
    resultCollectorImplementedByArdyn: false,
    testHarnessImplementedByArdyn: false,
    importExportCommandImplemented: false,
    packageExportImplemented: false,
    consumerSideCiImplemented: false,
    fixtureDiscoveryRuntimeImplemented: false,
    browserRenderingHarnessImplemented: false,
    browserWcagAutomationImplemented: false,
    visualRegressionHarnessImplemented: false,
    screenReaderAutomationImplemented: false,
    uiFrontendBrowserRenderingImplemented: false,
    allBlockedAuthorizationFlagsFalse: entries.every(
      ({ explicitBlockedAuthorizationFlags }) =>
        Object.values(explicitBlockedAuthorizationFlags).every(
          (value) => value === false
        )
    ),
    allUnsafeRunnerResultProducerImportExportTestHarnessRuntimeFlagsFalse:
      entries.every(
        ({ unsafeRunnerResultProducerImportExportTestHarnessRuntimeFlags }) =>
          Object.values(
            unsafeRunnerResultProducerImportExportTestHarnessRuntimeFlags
          ).every((value) => value === false)
      ),
    allRuntimeEffectsFalse: entries.every(({ runtimeEffect }) =>
      Object.values(runtimeEffect).every((value) => value === false)
    ),
    allEntriesNonAuthorizing: entries.every(
      ({ nonAuthorizingProof }) => nonAuthorizingProof === true
    ),
    validationImplementsRunner: false,
    validationImplementsResultProducer: false,
    validationImplementsResultCollector: false,
    validationImplementsTestHarness: false,
    validationImplementsImportExportCommands: false,
    validationImplementsPackageExport: false,
    validationImplementsConsumerSideCi: false,
    validationImplementsFixtureDiscoveryRuntime: false,
    validationPerformsRendering: false,
    validationRunsBrowserWcagAutomation: false,
    validationCallsExternalConsumers: false,
    validationPerformsExternalLookups: false,
    validationScansFilesystem: false,
    validationControlsProcesses: false,
    runtimeExecutionEnabled: false,
    commandRuntimeControlEnabled: false,
    databaseStorageRuntimeWritesEnabled: false,
    secretsRuntimeIngestionEnabled: false,
    connectorGrantProduced: false,
    fabricRuntimeSurfaceEnabled: false,
    webSocketHttpSurfaceEnabled: false,
    mcpToolExposureEnabled: false,
    taskExecutionEnabled: false,
    secureDropImplemented: false,
    serviceDiscoveryEnabled: false,
    scheduleEnforcementEnabled: false,
    backgroundPollingEnabled: false,
    filesystemScanningEnabled: false,
    processControlEnabled: false
  };
}

function consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryValidationRules() {
  return {
    referencesPhase550SchemaBoundaryRequired: true,
    referencesPhase551ExamplePackRequired: true,
    referencesPhase552ConformanceHandoffRequired: true,
    referencesPhase553RunnerRequirementsRequired: true,
    referencesPhase554TestPlanRequired: true,
    missingRequiredFieldsFailClosed: true,
    unknownConsumerNamesFailClosed: true,
    unknownResultSchemaIntentFailsClosed: true,
    interactiveActionableIntentFailsClosed: true,
    enabledAuthorizationFlagsFailClosed: true,
    unsafeRunnerResultProducerImportExportTestHarnessRuntimeFlagsFailClosed: true,
    nestedUnsafeInputFlagsFailClosed: true,
    hiddenRunnerResultProducerImportExportTestHarnessRuntimeSemanticsFailClosed:
      true,
    secureDropImplementationSemanticsFailClosed: true,
    websocketHttpFabricMcpTaskExecutionSemanticsFailClosed: true,
    unknownReferencesFailClosed: true,
    runnerResultProducerImportExportTestHarnessImplementationSemanticsFailClosed:
      true,
    canonicalResultSchemaEntriesRequired: true,
    malformedResultSchemaEntriesFailClosed: true,
    validationImplementsRunner: false,
    validationImplementsResultProducer: false,
    validationImplementsResultCollector: false,
    validationImplementsTestHarness: false,
    validationImplementsImportExportCommands: false,
    validationImplementsPackageExport: false,
    validationImplementsConsumerSideCi: false,
    validationImplementsFixtureDiscoveryRuntime: false,
    validationPerformsRendering: false,
    validationRunsBrowserWcagAutomation: false,
    validationCallsExternalConsumers: false,
    validationPerformsExternalLookups: false,
    validationScansFilesystem: false,
    validationControlsProcesses: false
  };
}

function consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryGaps() {
  return [
    "The result schema boundary is static metadata only; no Locus or Multiverse consumer-owned result producer, collector, runner, or test harness exists in Ardyn.",
    "No fixture import/export command, package export, consumer-side CI implementation, result package, or fixture discovery runtime exists.",
    "No browser, rendering, WCAG automation, visual regression, or screen-reader QA harness exists in Ardyn.",
    "No consumer repository integration exists; Locus and Multiverse remain target consumers only.",
    "Secure Drop, registry, websocket/http, Fabric, MCP, task execution, service discovery, scheduling, filesystem, process, and external lookup behavior remain blocked."
  ];
}

function phase554SubagentAuditTrailReconciliation() {
  return {
    finalReportActualReviewer:
      "019ee530-5f95-7ac1-b80d-2967f33f462e / Raman",
    localSessionFooterMismatchReported:
      "Feynman / James",
    evidence:
      "Phase 5.54 final report named 019ee530-5f95-7ac1-b80d-2967f33f462e / Raman as the actual reviewer; the user reported the local/session footer showed Feynman / James.",
    phase555ReviewerConstraint:
      "exactly-one-codex-5.5-read-only-reviewer"
  };
}

function consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryState(
  reviewedAt
) {
  const resultSchemaEntries =
    consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryEntries();

  return {
    schema:
      CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_RESULT_SCHEMA_BOUNDARY_STATE_SCHEMA,
    schemaVersion:
      CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_RESULT_SCHEMA_BOUNDARY_VERSION,
    stateKind:
      "consumer-owned-display-conformance-runner-result-schema-boundary-state",
    stateMode: "review-only",
    reviewedAt,
    sourcePhaseContext: {
      precedingSchemaBoundaryPhase: "5.50",
      precedingSchemaBoundaryArtifact:
        "tests/fixtures/host-policy/phase5-50/consumer-display-fixture-schema-boundary.json",
      precedingExamplePackPhase: "5.51",
      precedingExamplePackArtifact:
        "tests/fixtures/host-policy/phase5-51/consumer-display-fixture-example-pack.json",
      precedingConformanceHandoffPhase: "5.52",
      precedingConformanceHandoffArtifact:
        "tests/fixtures/host-policy/phase5-52/consumer-display-fixture-conformance-handoff.json",
      precedingRunnerRequirementsPhase: "5.53",
      precedingRunnerRequirementsArtifact:
        "tests/fixtures/host-policy/phase5-53/consumer-owned-display-conformance-runner-requirements.json",
      precedingTestPlanPhase: "5.54",
      precedingTestPlanArtifact:
        "tests/fixtures/host-policy/phase5-54/consumer-owned-display-conformance-runner-test-plan.json",
      phase550ConsumerDisplayFixtureSchemaBoundaryReferenceOnly: true,
      phase551ConsumerDisplayFixtureExamplePackReferenceOnly: true,
      phase552ConsumerDisplayFixtureConformanceHandoffReferenceOnly: true,
      phase553ConsumerOwnedDisplayConformanceRunnerRequirementsReferenceOnly: true,
      phase554ConsumerOwnedDisplayConformanceRunnerTestPlanReferenceOnly: true,
      ardynOwnsConsumerUi: false,
      consumerRunnerImplementedByArdyn: false,
      resultProducerImplementedByArdyn: false,
      resultCollectorImplementedByArdyn: false,
      testHarnessImplementedByArdyn: false,
      importExportCommandImplementedByArdyn: false,
      packageExportImplementedByArdyn: false,
      consumerSideCiImplementedByArdyn: false,
      consumerRepoModifiedByArdyn: false
    },
    phase554SubagentAuditTrailReconciliation:
      phase554SubagentAuditTrailReconciliation(),
    resultSchemaEntries,
    resultSchemaBoundarySummary:
      consumerOwnedDisplayConformanceRunnerResultSchemaBoundarySummary(
        resultSchemaEntries
      ),
    phase550SchemaBoundaryReference: {
      sourceBoundarySchema: CONSUMER_DISPLAY_FIXTURE_SCHEMA_BOUNDARY_SCHEMA,
      sourceBoundaryFixture:
        "tests/fixtures/host-policy/phase5-50/consumer-display-fixture-schema-boundary.json",
      validationHelper:
        "createConsumerDisplayFixtureSchemaBoundaryForReview",
      referencedByResultSchemaBoundary: true,
      validationStartsRuntime: false,
      validationPerformsRendering: false,
      validationCallsConsumers: false
    },
    phase551ExamplePackReference: {
      sourceExamplePackSchema: CONSUMER_DISPLAY_FIXTURE_EXAMPLE_PACK_SCHEMA,
      sourceExamplePackFixture:
        "tests/fixtures/host-policy/phase5-51/consumer-display-fixture-example-pack.json",
      validationHelper:
        "createConsumerDisplayFixtureExamplePackForReview",
      referencedByResultSchemaBoundary: true,
      validationStartsRuntime: false,
      validationPerformsRendering: false,
      validationCallsConsumers: false
    },
    phase552ConformanceHandoffReference: {
      sourceHandoffSchema: CONSUMER_DISPLAY_FIXTURE_CONFORMANCE_HANDOFF_SCHEMA,
      sourceHandoffFixture:
        "tests/fixtures/host-policy/phase5-52/consumer-display-fixture-conformance-handoff.json",
      validationHelper:
        "createConsumerDisplayFixtureConformanceHandoffForReview",
      referencedByResultSchemaBoundary: true,
      validationStartsRuntime: false,
      validationPerformsRendering: false,
      validationCallsConsumers: false
    },
    phase553RunnerRequirementsReference: {
      sourceRunnerRequirementsSchema:
        CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_REQUIREMENTS_SCHEMA,
      sourceRunnerRequirementsFixture:
        "tests/fixtures/host-policy/phase5-53/consumer-owned-display-conformance-runner-requirements.json",
      validationHelper:
        "createConsumerOwnedDisplayConformanceRunnerRequirementsForReview",
      referencedByResultSchemaBoundary: true,
      validationStartsRuntime: false,
      validationPerformsRendering: false,
      validationCallsConsumers: false
    },
    phase554TestPlanReference: {
      sourceTestPlanSchema:
        CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_TEST_PLAN_SCHEMA,
      sourceTestPlanFixture:
        "tests/fixtures/host-policy/phase5-54/consumer-owned-display-conformance-runner-test-plan.json",
      validationHelper:
        "createConsumerOwnedDisplayConformanceRunnerTestPlanForReview",
      referencedByResultSchemaBoundary: true,
      validationStartsRuntime: false,
      validationPerformsRendering: false,
      validationCallsConsumers: false
    },
    invalidResultSchemaCasePolicy:
      consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryValidationRules(),
    topDisplayConformanceRunnerResultSchemaGaps:
      consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryGaps(),
    recommendedNextPhase:
      "phase-5.56-consumer-owned-display-conformance-result-handoff",
    consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryOnly: true,
    reviewOnly: true,
    authoritative: false,
    reviewArtifactOnly: true,
    nonAuthorizingProof: true,
    ...consumerDisplayAccessibilityForbiddenBehavior(),
    renderingCodeImplemented: false,
    browserRenderingHarnessImplemented: false,
    runnerImplementedByArdyn: false,
    resultProducerImplementedByArdyn: false,
    resultCollectorImplementedByArdyn: false,
    testHarnessImplementedByArdyn: false,
    consumerOwnedRunnerImplemented: false,
    consumerConformanceRunnerImplemented: false,
    fixtureImportCommandImplemented: false,
    fixtureExportCommandImplemented: false,
    fixtureImportExportCommandsImplemented: false,
    importExportCommandImplemented: false,
    packageExportImplemented: false,
    consumerSideCiImplemented: false,
    fixtureDiscoveryRuntimeImplemented: false,
    consumerRepoModifiedByArdyn: false,
    browserWcagAutomationImplemented: false,
    visualRegressionHarnessImplemented: false,
    screenReaderAutomationImplemented: false,
    externalLookupsEnabled: false,
    filesystemScanningEnabled: false,
    processControlEnabled: false,
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

function consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryRejectionReasons({
  accepted,
  classification
}) {
  const reasons = [
    "consumer_owned_display_conformance_runner_result_schema_boundary_is_review_only",
    "result_schema_entries_are_metadata_only",
    "references_phase_5_50_schema_boundary",
    "references_phase_5_51_example_pack",
    "references_phase_5_52_conformance_handoff",
    "references_phase_5_53_runner_requirements",
    "references_phase_5_54_test_plan",
    "ardyn_does_not_implement_runner_result_producer_result_collector_test_harness_import_export_package_export_ci_ui_browser_rendering_or_consumer_repo_changes",
    "runtime_command_db_storage_secrets_connector_fabric_websocket_http_mcp_task_secure_drop_service_discovery_schedule_filesystem_process_authorizations_false",
    "unsafe_runner_result_producer_import_export_test_harness_runtime_flags_fail_closed",
    "fallow_runtime_not_used",
    "runtime_enablement_still_blocked"
  ];

  return accepted
    ? reasons
    : [
        ...reasons,
        `input_classification_${classification}`,
        "consumer_owned_display_conformance_runner_result_schema_boundary_not_produced"
      ];
}

function consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryResult({
  reviewedAt,
  reviewedAtDefaulted,
  classification,
  accepted,
  consumerOwnedDisplayConformanceRunnerResultSchemaBoundary
}) {
  return {
    schema:
      CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_RESULT_SCHEMA_BOUNDARY_SCHEMA,
    schemaVersion:
      CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_RESULT_SCHEMA_BOUNDARY_VERSION,
    consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryKind:
      CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_RESULT_SCHEMA_BOUNDARY_KIND,
    consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryMode:
      "review-only",
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryProduced: accepted,
    consumerOwnedDisplayConformanceRunnerResultSchemaBoundary,
    resultSchemaBoundarySummary: accepted
      ? consumerOwnedDisplayConformanceRunnerResultSchemaBoundary
          .resultSchemaBoundarySummary
      : null,
    phase550SchemaBoundaryReference: accepted
      ? consumerOwnedDisplayConformanceRunnerResultSchemaBoundary
          .phase550SchemaBoundaryReference
      : null,
    phase551ExamplePackReference: accepted
      ? consumerOwnedDisplayConformanceRunnerResultSchemaBoundary
          .phase551ExamplePackReference
      : null,
    phase552ConformanceHandoffReference: accepted
      ? consumerOwnedDisplayConformanceRunnerResultSchemaBoundary
          .phase552ConformanceHandoffReference
      : null,
    phase553RunnerRequirementsReference: accepted
      ? consumerOwnedDisplayConformanceRunnerResultSchemaBoundary
          .phase553RunnerRequirementsReference
      : null,
    phase554TestPlanReference: accepted
      ? consumerOwnedDisplayConformanceRunnerResultSchemaBoundary
          .phase554TestPlanReference
      : null,
    phase554SubagentAuditTrailReconciliation: accepted
      ? consumerOwnedDisplayConformanceRunnerResultSchemaBoundary
          .phase554SubagentAuditTrailReconciliation
      : null,
    resultSchemaEntries: accepted
      ? consumerOwnedDisplayConformanceRunnerResultSchemaBoundary
          .resultSchemaEntries
      : [],
    invalidResultSchemaCasePolicy: accepted
      ? consumerOwnedDisplayConformanceRunnerResultSchemaBoundary
          .invalidResultSchemaCasePolicy
      : consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryValidationRules(),
    topDisplayConformanceRunnerResultSchemaGaps: accepted
      ? consumerOwnedDisplayConformanceRunnerResultSchemaBoundary
          .topDisplayConformanceRunnerResultSchemaGaps
      : [],
    recommendedNextPhase: accepted
      ? consumerOwnedDisplayConformanceRunnerResultSchemaBoundary
          .recommendedNextPhase
      : null,
    consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryOnly: true,
    reviewOnly: true,
    authoritative: false,
    reviewArtifactOnly: true,
    nonAuthorizingProof: true,
    ...consumerDisplayAccessibilityForbiddenBehavior(),
    renderingCodeImplemented: false,
    browserRenderingHarnessImplemented: false,
    runnerImplementedByArdyn: false,
    resultProducerImplementedByArdyn: false,
    resultCollectorImplementedByArdyn: false,
    testHarnessImplementedByArdyn: false,
    consumerOwnedRunnerImplemented: false,
    consumerConformanceRunnerImplemented: false,
    fixtureImportCommandImplemented: false,
    fixtureExportCommandImplemented: false,
    fixtureImportExportCommandsImplemented: false,
    importExportCommandImplemented: false,
    packageExportImplemented: false,
    consumerSideCiImplemented: false,
    fixtureDiscoveryRuntimeImplemented: false,
    consumerRepoModifiedByArdyn: false,
    browserWcagAutomationImplemented: false,
    visualRegressionHarnessImplemented: false,
    screenReaderAutomationImplemented: false,
    externalLookupsEnabled: false,
    filesystemScanningEnabled: false,
    processControlEnabled: false,
    rejectionReasons:
      consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryRejectionReasons({
        accepted,
        classification
      }),
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

export function createConsumerOwnedDisplayConformanceRunnerResultSchemaBoundaryForReview(
  input = {}
) {
  const inputRecord =
    consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryInputRecord(input);
  const reviewedAt =
    consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryReviewedAt(
      inputRecord
    );
  const reviewedAtDefaulted = isReviewedAtDefaulted(input);
  const classification =
    consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryInputClassification(
      inputRecord
    );
  const accepted =
    classification ===
    VALID_CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_RESULT_SCHEMA_BOUNDARY_CLASSIFICATION;
  const consumerOwnedDisplayConformanceRunnerResultSchemaBoundary = accepted
    ? consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryState(reviewedAt)
    : null;

  return consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryResult({
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    accepted,
    consumerOwnedDisplayConformanceRunnerResultSchemaBoundary
  });
}

const CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_HANDOFF_STATE_SCHEMA =
  "ardyn.phase-5.56.consumer-owned-display-conformance-result-handoff-state";
const VALID_CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_HANDOFF_CLASSIFICATION =
  "valid_consumer_owned_display_conformance_result_handoff_runtime_still_blocked";
const MALFORMED_CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_HANDOFF_CLASSIFICATION =
  "malformed_consumer_owned_display_conformance_result_handoff_input_rejected";
const CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_HANDOFF_INTENT =
  "metadata_only";

const CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_HANDOFF_REQUIRED_FIELDS =
  Object.freeze([
    "handoffId",
    "consumerName",
    "displaySurfaceId",
    "sourceArdynArtifactType",
    "resultHandoffIntent",
    "referencedPhase550SchemaBoundaryId",
    "referencedPhase551FixtureId",
    "referencedPhase551FixtureGroup",
    "referencedPhase552ConformanceHandoffId",
    "referencedPhase553RunnerRequirementId",
    "referencedPhase554TestPlanId",
    "referencedPhase555ResultSchemaId",
    "futureConsumerOwnedResultProducerResponsibility",
    "futureConsumerOwnedResultCollectorResponsibility",
    "allowedFutureResultHandoffBehavior",
    "forbiddenCurrentArdynBehavior",
    "deterministicOrderingHashExpectations",
    "accessibilityWcagResultHandoffNotes",
    "requiredFutureContractBeforeExecutableResultProductionCollectionImportExportOrCi",
    "explicitBlockedAuthorizationFlags",
    "unsafeRunnerResultProducerResultCollectorImportExportTestHarnessRuntimeFlags",
    "consumerTargetOnly",
    "runnerImplementedByArdyn",
    "resultProducerImplementedByArdyn",
    "resultCollectorImplementedByArdyn",
    "resultImporterImplementedByArdyn",
    "resultExporterImplementedByArdyn",
    "testHarnessImplementedByArdyn",
    "importExportCommandImplemented",
    "browserRenderingHarnessImplemented",
    "packageExportImplemented",
    "consumerSideCiImplemented",
    "fixtureDiscoveryRuntimeImplemented",
    "consumerRepoModifiedByArdyn",
    "nonAuthorizingProof"
  ]);

const CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_HANDOFF_UNSAFE_FIELDS =
  Object.freeze([
    ...CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_RESULT_SCHEMA_BOUNDARY_UNSAFE_FIELDS,
    ...CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_HANDOFF_EXTRA_UNSAFE_FIELDS
  ]);

const CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_HANDOFF_IMPLEMENTATION_FIELDS =
  Object.freeze([
    ...CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_RESULT_SCHEMA_BOUNDARY_IMPLEMENTATION_FIELDS,
    ...CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_HANDOFF_EXTRA_UNSAFE_FIELDS
  ]);

const CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_HANDOFF_HIDDEN_FIELDS =
  Object.freeze([
    ...CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_RESULT_SCHEMA_BOUNDARY_HIDDEN_FIELDS,
    "hiddenResultImporterSemanticsEnabled",
    "hiddenResultExporterSemanticsEnabled",
    "hiddenResultHandoffSemanticsEnabled"
  ]);

function consumerOwnedDisplayConformanceResultHandoffInputRecord(input) {
  return isPlainObjectRecord(input) ? input : null;
}

function consumerOwnedDisplayConformanceResultHandoffReviewedAt(inputRecord) {
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

function consumerOwnedDisplayConformanceResultHandoffInputMalformed(
  inputRecord
) {
  return (
    inputRecord === null ||
    (Object.prototype.hasOwnProperty.call(inputRecord, "reviewedAt") &&
      !isUtcIsoTimestampWithMilliseconds(inputRecord.reviewedAt)) ||
    (Object.prototype.hasOwnProperty.call(inputRecord, "resultHandoffEntries") &&
      !Array.isArray(inputRecord.resultHandoffEntries))
  );
}

function consumerOwnedDisplayConformanceResultHandoffInputEntries(inputRecord) {
  return Array.isArray(inputRecord?.resultHandoffEntries)
    ? inputRecord.resultHandoffEntries
    : null;
}

function consumerOwnedDisplayConformanceResultHandoffMissingRequiredField(
  entry
) {
  if (!isPlainObjectRecord(entry)) {
    return true;
  }

  return CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_HANDOFF_REQUIRED_FIELDS.some(
    (field) => !Object.prototype.hasOwnProperty.call(entry, field)
  );
}

function consumerOwnedDisplayConformanceResultHandoffDeterminismMalformed(
  expectations
) {
  return (
    !isPlainObjectRecord(expectations) ||
    expectations.deterministicHandoffIdsRequired !== true ||
    expectations.deterministicOrderingRequired !== true ||
    expectations.deterministicForbiddenBehaviorOrderingRequired !== true ||
    expectations.deterministicHashInputOrderingRequired !== true ||
    expectations.noClockNetworkRandomnessAllowed !== true ||
    expectations.consumerOwnedResultHandoffMustBeReviewOnly !== true ||
    expectations.hashDoesNotAuthorizeRuntime !== true
  );
}

function consumerOwnedDisplayConformanceResultHandoffEntryMalformed(entry) {
  return (
    consumerOwnedDisplayConformanceResultHandoffMissingRequiredField(entry) ||
    typeof entry.handoffId !== "string" ||
    entry.handoffId.length === 0 ||
    typeof entry.displaySurfaceId !== "string" ||
    entry.displaySurfaceId.length === 0 ||
    typeof entry.sourceArdynArtifactType !== "string" ||
    entry.sourceArdynArtifactType.length === 0 ||
    entry.resultHandoffIntent !==
      CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_HANDOFF_INTENT ||
    typeof entry.referencedPhase550SchemaBoundaryId !== "string" ||
    entry.referencedPhase550SchemaBoundaryId.length === 0 ||
    typeof entry.referencedPhase551FixtureId !== "string" ||
    entry.referencedPhase551FixtureId.length === 0 ||
    typeof entry.referencedPhase551FixtureGroup !== "string" ||
    entry.referencedPhase551FixtureGroup.length === 0 ||
    typeof entry.referencedPhase552ConformanceHandoffId !== "string" ||
    entry.referencedPhase552ConformanceHandoffId.length === 0 ||
    typeof entry.referencedPhase553RunnerRequirementId !== "string" ||
    entry.referencedPhase553RunnerRequirementId.length === 0 ||
    typeof entry.referencedPhase554TestPlanId !== "string" ||
    entry.referencedPhase554TestPlanId.length === 0 ||
    typeof entry.referencedPhase555ResultSchemaId !== "string" ||
    entry.referencedPhase555ResultSchemaId.length === 0 ||
    typeof entry.futureConsumerOwnedResultProducerResponsibility !== "string" ||
    entry.futureConsumerOwnedResultProducerResponsibility.length === 0 ||
    typeof entry.futureConsumerOwnedResultCollectorResponsibility !== "string" ||
    entry.futureConsumerOwnedResultCollectorResponsibility.length === 0 ||
    typeof entry.allowedFutureResultHandoffBehavior !== "string" ||
    entry.allowedFutureResultHandoffBehavior.length === 0 ||
    !Array.isArray(entry.forbiddenCurrentArdynBehavior) ||
    entry.forbiddenCurrentArdynBehavior.length < 12 ||
    entry.forbiddenCurrentArdynBehavior.some(
      (behavior) => typeof behavior !== "string"
    ) ||
    consumerOwnedDisplayConformanceResultHandoffDeterminismMalformed(
      entry.deterministicOrderingHashExpectations
    ) ||
    consumerDisplayFixtureSchemaBoundaryAccessibilityMalformed(
      entry.accessibilityWcagResultHandoffNotes
    ) ||
    typeof entry
      .requiredFutureContractBeforeExecutableResultProductionCollectionImportExportOrCi !==
      "string" ||
    entry
      .requiredFutureContractBeforeExecutableResultProductionCollectionImportExportOrCi
      .length === 0 ||
    !isPlainObjectRecord(entry.explicitBlockedAuthorizationFlags) ||
    !isPlainObjectRecord(
      entry
        .unsafeRunnerResultProducerResultCollectorImportExportTestHarnessRuntimeFlags
    ) ||
    entry.consumerTargetOnly !== true ||
    entry.runnerImplementedByArdyn !== false ||
    entry.resultProducerImplementedByArdyn !== false ||
    entry.resultCollectorImplementedByArdyn !== false ||
    entry.resultImporterImplementedByArdyn !== false ||
    entry.resultExporterImplementedByArdyn !== false ||
    entry.testHarnessImplementedByArdyn !== false ||
    entry.importExportCommandImplemented !== false ||
    entry.browserRenderingHarnessImplemented !== false ||
    entry.packageExportImplemented !== false ||
    entry.consumerSideCiImplemented !== false ||
    entry.fixtureDiscoveryRuntimeImplemented !== false ||
    entry.consumerRepoModifiedByArdyn !== false ||
    entry.nonAuthorizingProof !== true
  );
}

function consumerOwnedDisplayConformanceResultHandoffContainsEntryIssue(
  entries,
  predicate
) {
  return entries !== null && entries.some((entry) => predicate(entry));
}

function consumerOwnedDisplayConformanceResultHandoffAuthorizationFlagEnabled(
  entry
) {
  return (
    consumerDisplayAccessibilityContractMapContainsTrue(
      entry?.explicitBlockedAuthorizationFlags
    ) ||
    consumerDisplayAccessibilityContractMapContainsTrue(
      entry?.blockedAuthorizationFlags
    ) ||
    consumerDisplayAccessibilityContractMapContainsTrue(entry?.authorizationFlags)
  );
}

function consumerOwnedDisplayConformanceResultHandoffUnsafeFlagEnabled(entry) {
  return (
    consumerDisplayAccessibilityContractMapContainsTrue(
      entry
        ?.unsafeRunnerResultProducerResultCollectorImportExportTestHarnessRuntimeFlags
    ) ||
    consumerDisplayAccessibilityContractMapFieldTruePresent(
      entry,
      CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_HANDOFF_UNSAFE_FIELDS
    )
  );
}

function consumerOwnedDisplayConformanceResultHandoffTopLevelFieldTruePresent(
  entry,
  fields
) {
  return (
    isPlainObjectRecord(entry) &&
    fields.some((field) => entry[field] === true)
  );
}

function consumerOwnedDisplayConformanceResultHandoffRecursiveUnsafeFlagEnabled(
  entry
) {
  return (
    consumerOwnedDisplayConformanceResultHandoffUnsafeFlagEnabled(entry) ||
    CONSUMER_DISPLAY_ACCESSIBILITY_CONTRACT_MAP_UNSAFE_FIELD_GROUPS.some(
      ({ fields }) =>
        consumerDisplayAccessibilityContractMapFieldTruePresent(entry, fields)
    ) ||
    consumerDisplayAccessibilityContractMapContainsTrue(entry?.runtimeEffect)
  );
}

function consumerOwnedDisplayConformanceResultHandoffReferenceValid(entry) {
  const resultSchemaEntry =
    consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryEntries().find(
      ({ resultSchemaId }) =>
        resultSchemaId === entry?.referencedPhase555ResultSchemaId
    );

  return (
    resultSchemaEntry !== undefined &&
    resultSchemaEntry.referencedPhase550SchemaBoundaryId ===
      entry.referencedPhase550SchemaBoundaryId &&
    resultSchemaEntry.referencedPhase551FixtureId ===
      entry.referencedPhase551FixtureId &&
    resultSchemaEntry.referencedPhase551FixtureGroup ===
      entry.referencedPhase551FixtureGroup &&
    resultSchemaEntry.referencedPhase552HandoffId ===
      entry.referencedPhase552ConformanceHandoffId &&
    resultSchemaEntry.referencedPhase553RunnerRequirementId ===
      entry.referencedPhase553RunnerRequirementId &&
    resultSchemaEntry.referencedPhase554TestPlanId ===
      entry.referencedPhase554TestPlanId &&
    resultSchemaEntry.consumerName === entry.consumerName &&
    resultSchemaEntry.displaySurfaceId === entry.displaySurfaceId &&
    resultSchemaEntry.sourceArdynArtifactType === entry.sourceArdynArtifactType
  );
}

function consumerOwnedDisplayConformanceResultHandoffEntriesCanonical(
  entries
) {
  if (entries === null) {
    return true;
  }

  return (
    JSON.stringify(entries) ===
    JSON.stringify(consumerOwnedDisplayConformanceResultHandoffEntries())
  );
}

function consumerOwnedDisplayConformanceResultHandoffInputClassification(
  inputRecord
) {
  if (consumerOwnedDisplayConformanceResultHandoffInputMalformed(inputRecord)) {
    return MALFORMED_CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_HANDOFF_CLASSIFICATION;
  }

  const entries =
    consumerOwnedDisplayConformanceResultHandoffInputEntries(inputRecord);

  if (
    consumerOwnedDisplayConformanceResultHandoffContainsEntryIssue(
      entries,
      consumerOwnedDisplayConformanceResultHandoffMissingRequiredField
    )
  ) {
    return "missing_required_consumer_owned_display_conformance_result_handoff_entry_rejected";
  }

  if (
    consumerOwnedDisplayConformanceResultHandoffContainsEntryIssue(
      entries,
      (entry) => entry.consumerName !== "Locus" && entry.consumerName !== "Multiverse"
    )
  ) {
    return "unknown_consumer_name_consumer_owned_display_conformance_result_handoff_input_rejected";
  }

  if (
    consumerOwnedDisplayConformanceResultHandoffContainsEntryIssue(
      entries,
      (entry) =>
        [
          "interactive",
          "actionable",
          "runtime_action",
          "command_action",
          "result_producer",
          "result_collector",
          "result_importer",
          "result_exporter",
          "test_harness",
          "executable_runner",
          "executable_result"
        ].includes(entry.resultHandoffIntent)
    )
  ) {
    return "interactive_actionable_intent_consumer_owned_display_conformance_result_handoff_input_rejected";
  }

  if (
    consumerOwnedDisplayConformanceResultHandoffContainsEntryIssue(
      entries,
      (entry) =>
        entry.resultHandoffIntent !==
        CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_HANDOFF_INTENT
    )
  ) {
    return "unknown_result_handoff_intent_consumer_owned_display_conformance_result_handoff_input_rejected";
  }

  if (
    consumerOwnedDisplayConformanceResultHandoffContainsEntryIssue(
      entries,
      (entry) =>
        consumerOwnedDisplayConformanceResultHandoffTopLevelFieldTruePresent(
          entry,
          CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_HANDOFF_IMPLEMENTATION_FIELDS
        )
    ) ||
    consumerOwnedDisplayConformanceResultHandoffTopLevelFieldTruePresent(
      inputRecord,
      CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_HANDOFF_IMPLEMENTATION_FIELDS
    )
  ) {
    return "runner_result_producer_result_collector_import_export_test_harness_implementation_semantics_consumer_owned_display_conformance_result_handoff_input_rejected";
  }

  if (
    consumerOwnedDisplayConformanceResultHandoffContainsEntryIssue(
      entries,
      consumerOwnedDisplayConformanceResultHandoffEntryMalformed
    )
  ) {
    return MALFORMED_CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_HANDOFF_CLASSIFICATION;
  }

  if (
    consumerOwnedDisplayConformanceResultHandoffContainsEntryIssue(
      entries,
      consumerOwnedDisplayConformanceResultHandoffAuthorizationFlagEnabled
    )
  ) {
    return "authorization_flags_enabled_consumer_owned_display_conformance_result_handoff_input_rejected";
  }

  if (
    consumerOwnedDisplayConformanceResultHandoffContainsEntryIssue(
      entries,
      consumerOwnedDisplayConformanceResultHandoffUnsafeFlagEnabled
    )
  ) {
    return "unsafe_runner_result_producer_result_collector_import_export_test_harness_runtime_flags_consumer_owned_display_conformance_result_handoff_input_rejected";
  }

  if (
    consumerOwnedDisplayConformanceResultHandoffContainsEntryIssue(
      entries,
      (entry) =>
        consumerDisplayAccessibilityContractMapFieldTruePresent(
          entry,
          CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_HANDOFF_HIDDEN_FIELDS
        )
    ) ||
    consumerDisplayAccessibilityContractMapFieldTruePresent(
      inputRecord,
      CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_HANDOFF_HIDDEN_FIELDS
    )
  ) {
    return "hidden_runner_result_producer_result_collector_import_export_test_harness_runtime_semantics_consumer_owned_display_conformance_result_handoff_input_rejected";
  }

  if (
    consumerOwnedDisplayConformanceResultHandoffContainsEntryIssue(
      entries,
      (entry) =>
        consumerDisplayAccessibilityContractMapFieldTruePresent(
          entry,
          CONSUMER_DISPLAY_FIXTURE_SCHEMA_BOUNDARY_SECURE_DROP_FIELDS
        )
    )
  ) {
    return "secure_drop_implementation_semantics_consumer_owned_display_conformance_result_handoff_input_rejected";
  }

  if (
    consumerOwnedDisplayConformanceResultHandoffContainsEntryIssue(
      entries,
      (entry) =>
        consumerDisplayAccessibilityContractMapFieldTruePresent(
          entry,
          CONSUMER_DISPLAY_FIXTURE_SCHEMA_BOUNDARY_RUNTIME_SURFACE_FIELDS
        )
    )
  ) {
    return "websocket_http_fabric_mcp_task_execution_semantics_consumer_owned_display_conformance_result_handoff_input_rejected";
  }

  if (
    consumerOwnedDisplayConformanceResultHandoffContainsEntryIssue(
      entries,
      (entry) => !consumerOwnedDisplayConformanceResultHandoffReferenceValid(entry)
    )
  ) {
    return "unknown_reference_consumer_owned_display_conformance_result_handoff_input_rejected";
  }

  if (
    consumerOwnedDisplayConformanceResultHandoffContainsEntryIssue(
      entries,
      consumerOwnedDisplayConformanceResultHandoffRecursiveUnsafeFlagEnabled
    ) ||
    consumerOwnedDisplayConformanceResultHandoffRecursiveUnsafeFlagEnabled(
      inputRecord
    )
  ) {
    return "nested_unsafe_flags_consumer_owned_display_conformance_result_handoff_input_rejected";
  }

  if (!consumerOwnedDisplayConformanceResultHandoffEntriesCanonical(entries)) {
    return "noncanonical_consumer_owned_display_conformance_result_handoff_input_rejected";
  }

  return VALID_CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_HANDOFF_CLASSIFICATION;
}

function consumerOwnedDisplayConformanceResultHandoffUnsafeFlags() {
  return {
    ...consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryUnsafeFlags(),
    resultImporterEnabled: false,
    resultImporterImplementedByArdyn: false,
    resultExporterEnabled: false,
    resultExporterImplementedByArdyn: false,
    resultImportCommandImplemented: false,
    resultExportCommandImplemented: false,
    resultHandoffExecutionEnabled: false,
    resultHandoffImportEnabled: false,
    resultHandoffExportEnabled: false,
    resultHandoffCiEnabled: false,
    resultHandoffRuntimeEnabled: false,
    consumerResultImporterImplemented: false,
    consumerResultExporterImplemented: false,
    hiddenResultImporterSemanticsEnabled: false,
    hiddenResultExporterSemanticsEnabled: false,
    hiddenResultHandoffSemanticsEnabled: false
  };
}

function consumerOwnedDisplayConformanceResultHandoffDefinitions() {
  return [
    {
      resultSchemaId:
        "phase5-55.locus.status-control-panel-conformance.result-schema",
      handoffId: "phase5-56.locus.status-control-panel-conformance.result-handoff",
      producer:
        "Future Locus-owned result producers may create status/control panel conformance result artifacts only after a separate executable result-production contract exists.",
      collector:
        "Future Locus-owned result collectors may gather status/control panel conformance result artifacts only after a separate executable collection contract exists."
    },
    {
      resultSchemaId:
        "phase5-55.locus.review-artifact-panel-conformance.result-schema",
      handoffId: "phase5-56.locus.review-artifact-panel-conformance.result-handoff",
      producer:
        "Future Locus-owned result producers may create review artifact panel conformance result artifacts only after a separate executable result-production contract exists.",
      collector:
        "Future Locus-owned result collectors may gather review artifact panel conformance result artifacts only after a separate executable collection contract exists."
    },
    {
      resultSchemaId:
        "phase5-55.locus.capability-metadata-panel-conformance.result-schema",
      handoffId:
        "phase5-56.locus.capability-metadata-panel-conformance.result-handoff",
      producer:
        "Future Locus-owned result producers may create capability metadata panel conformance result artifacts only after a separate executable result-production contract exists.",
      collector:
        "Future Locus-owned result collectors may gather capability metadata panel conformance result artifacts only after a separate executable collection contract exists."
    },
    {
      resultSchemaId:
        "phase5-55.locus.blocked-runtime-command-indicator-conformance.result-schema",
      handoffId:
        "phase5-56.locus.blocked-runtime-command-indicator-conformance.result-handoff",
      producer:
        "Future Locus-owned result producers may create blocked runtime/command indicator conformance result artifacts only after a separate executable result-production contract exists.",
      collector:
        "Future Locus-owned result collectors may gather blocked runtime/command indicator conformance result artifacts only after a separate executable collection contract exists."
    },
    {
      resultSchemaId:
        "phase5-55.locus.future-secure-drop-compose-inbox-placeholder-conformance.result-schema",
      handoffId:
        "phase5-56.locus.future-secure-drop-compose-inbox-placeholder-conformance.result-handoff",
      producer:
        "Future Locus-owned result producers may create Secure Drop placeholder conformance result artifacts only after a separate executable result-production contract exists and without implying Secure Drop implementation.",
      collector:
        "Future Locus-owned result collectors may gather Secure Drop placeholder conformance result artifacts only after a separate executable collection contract exists and without polling or transport behavior."
    },
    {
      resultSchemaId:
        "phase5-55.locus.accessibility-wcag-display-expectation.result-schema",
      handoffId:
        "phase5-56.locus.accessibility-wcag-display-expectation.result-handoff",
      producer:
        "Future Locus-owned result producers may create accessibility/WCAG display expectation result artifacts only after a separate executable result-production contract exists.",
      collector:
        "Future Locus-owned result collectors may gather accessibility/WCAG display expectation result artifacts only after a separate executable collection contract exists."
    },
    {
      resultSchemaId:
        "phase5-55.multiverse.world-project-status-card-conformance.result-schema",
      handoffId:
        "phase5-56.multiverse.world-project-status-card-conformance.result-handoff",
      producer:
        "Future Multiverse-owned result producers may create world/project status card conformance result artifacts only after a separate executable result-production contract exists.",
      collector:
        "Future Multiverse-owned result collectors may gather world/project status card conformance result artifacts only after a separate executable collection contract exists."
    },
    {
      resultSchemaId:
        "phase5-55.multiverse.visible-ai-capability-badge-conformance.result-schema",
      handoffId:
        "phase5-56.multiverse.visible-ai-capability-badge-conformance.result-handoff",
      producer:
        "Future Multiverse-owned result producers may create visible AI capability badge conformance result artifacts only after a separate executable result-production contract exists.",
      collector:
        "Future Multiverse-owned result collectors may gather visible AI capability badge conformance result artifacts only after a separate executable collection contract exists."
    },
    {
      resultSchemaId:
        "phase5-55.multiverse.task-capability-wrapper-status-card-conformance.result-schema",
      handoffId:
        "phase5-56.multiverse.task-capability-wrapper-status-card-conformance.result-handoff",
      producer:
        "Future Multiverse-owned result producers may create task/capability wrapper status card conformance result artifacts only after a separate executable result-production contract exists.",
      collector:
        "Future Multiverse-owned result collectors may gather task/capability wrapper status card conformance result artifacts only after a separate executable collection contract exists."
    },
    {
      resultSchemaId:
        "phase5-55.multiverse.citizen-adapter-candidate-badge-conformance.result-schema",
      handoffId:
        "phase5-56.multiverse.citizen-adapter-candidate-badge-conformance.result-handoff",
      producer:
        "Future Multiverse-owned result producers may create citizen/adapter candidate badge conformance result artifacts only after a separate executable result-production contract exists.",
      collector:
        "Future Multiverse-owned result collectors may gather citizen/adapter candidate badge conformance result artifacts only after a separate executable collection contract exists."
    },
    {
      resultSchemaId:
        "phase5-55.multiverse.registry-websocket-mcp-task-blocked-indicator-conformance.result-schema",
      handoffId:
        "phase5-56.multiverse.registry-websocket-mcp-task-blocked-indicator-conformance.result-handoff",
      producer:
        "Future Multiverse-owned result producers may create registry/websocket/MCP/task blocked indicator conformance result artifacts only after a separate executable result-production contract exists.",
      collector:
        "Future Multiverse-owned result collectors may gather registry/websocket/MCP/task blocked indicator conformance result artifacts only after a separate executable collection contract exists."
    },
    {
      resultSchemaId:
        "phase5-55.multiverse.accessibility-wcag-display-expectation.result-schema",
      handoffId:
        "phase5-56.multiverse.accessibility-wcag-display-expectation.result-handoff",
      producer:
        "Future Multiverse-owned result producers may create accessibility/WCAG display expectation result artifacts only after a separate executable result-production contract exists.",
      collector:
        "Future Multiverse-owned result collectors may gather accessibility/WCAG display expectation result artifacts only after a separate executable collection contract exists."
    }
  ];
}

function consumerOwnedDisplayConformanceResultHandoffForbiddenCurrentArdynBehavior() {
  return [
    "implement a consumer-owned display conformance runner",
    "produce conformance results",
    "collect conformance results",
    "import conformance results",
    "export conformance results",
    "run a test harness",
    "publish a package export",
    "run consumer-side CI",
    "implement UI/frontend/browser/rendering or WCAG automation",
    "modify Locus or Multiverse repositories",
    "open command or runtime control",
    "write DB/storage/transcript/audit runtime data",
    "ingest secrets, vault, or env data",
    "grant connector, Fabric, websocket/http, MCP, or task execution access",
    "implement Secure Drop crypto, transport, stego, send/receive, inbox polling, or file selection",
    "perform service discovery, schedule enforcement, polling, filesystem scanning, or process control"
  ];
}

function consumerOwnedDisplayConformanceResultHandoffEntry(definition) {
  const resultSchemaEntry =
    consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryEntries().find(
      ({ resultSchemaId }) => resultSchemaId === definition.resultSchemaId
    );

  return {
    handoffId: definition.handoffId,
    consumerName: resultSchemaEntry.consumerName,
    displaySurfaceId: resultSchemaEntry.displaySurfaceId,
    sourceArdynArtifactType: resultSchemaEntry.sourceArdynArtifactType,
    resultHandoffIntent:
      CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_HANDOFF_INTENT,
    referencedPhase550SchemaBoundaryId:
      resultSchemaEntry.referencedPhase550SchemaBoundaryId,
    referencedPhase551FixtureId: resultSchemaEntry.referencedPhase551FixtureId,
    referencedPhase551FixtureGroup:
      resultSchemaEntry.referencedPhase551FixtureGroup,
    referencedPhase552ConformanceHandoffId:
      resultSchemaEntry.referencedPhase552HandoffId,
    referencedPhase553RunnerRequirementId:
      resultSchemaEntry.referencedPhase553RunnerRequirementId,
    referencedPhase554TestPlanId:
      resultSchemaEntry.referencedPhase554TestPlanId,
    referencedPhase555ResultSchemaId: resultSchemaEntry.resultSchemaId,
    futureConsumerOwnedResultProducerResponsibility: definition.producer,
    futureConsumerOwnedResultCollectorResponsibility: definition.collector,
    allowedFutureResultHandoffBehavior:
      "Future consumer-owned tooling may hand an inert conformance result artifact to Ardyn review workflows only after a separate result-production, collection, import/export, and CI contract exists; current Ardyn may only describe this handoff as metadata.",
    forbiddenCurrentArdynBehavior:
      consumerOwnedDisplayConformanceResultHandoffForbiddenCurrentArdynBehavior(),
    deterministicOrderingHashExpectations: {
      deterministicHandoffIdsRequired: true,
      deterministicOrderingRequired: true,
      deterministicForbiddenBehaviorOrderingRequired: true,
      deterministicHashInputOrderingRequired: true,
      noClockNetworkRandomnessAllowed: true,
      consumerOwnedResultHandoffMustBeReviewOnly: true,
      hashDoesNotAuthorizeRuntime: true
    },
    accessibilityWcagResultHandoffNotes: {
      ...resultSchemaEntry.accessibilityWcagResultNotes,
      resultHandoffAccessibilityScope:
        "future-consumer-owned-result-handoff-accessibility-contract-required-before-certification",
      resultHandoffMustRemainReadableWithoutColorOrMotion: true,
      resultHandoffMustExposeScreenReaderSafeStatus: true,
      resultHandoffMustNotExposeHiddenActionSemantics: true
    },
    requiredFutureContractBeforeExecutableResultProductionCollectionImportExportOrCi:
      "A separate consumer-owned executable result-production, collection, import/export, package distribution, and CI contract must exist before Locus or Multiverse can produce, collect, import, export, package, publish, run CI for, or render conformance results.",
    explicitBlockedAuthorizationFlags:
      consumerDisplayAccessibilityAuthorizationFlags(),
    unsafeRunnerResultProducerResultCollectorImportExportTestHarnessRuntimeFlags:
      consumerOwnedDisplayConformanceResultHandoffUnsafeFlags(),
    consumerTargetOnly: true,
    runnerImplementedByArdyn: false,
    resultProducerImplementedByArdyn: false,
    resultCollectorImplementedByArdyn: false,
    resultImporterImplementedByArdyn: false,
    resultExporterImplementedByArdyn: false,
    testHarnessImplementedByArdyn: false,
    importExportCommandImplemented: false,
    browserRenderingHarnessImplemented: false,
    packageExportImplemented: false,
    consumerSideCiImplemented: false,
    fixtureDiscoveryRuntimeImplemented: false,
    consumerRepoModifiedByArdyn: false,
    nonAuthorizingProof: true,
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

function consumerOwnedDisplayConformanceResultHandoffEntries() {
  return consumerOwnedDisplayConformanceResultHandoffDefinitions().map(
    consumerOwnedDisplayConformanceResultHandoffEntry
  );
}

function consumerOwnedDisplayConformanceResultHandoffSummary(entries) {
  const locusResultHandoffEntryCount = entries.filter(
    ({ consumerName }) => consumerName === "Locus"
  ).length;
  const multiverseResultHandoffEntryCount = entries.filter(
    ({ consumerName }) => consumerName === "Multiverse"
  ).length;

  return {
    resultHandoffKind: CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_HANDOFF_KIND,
    resultHandoffMode: "review-only",
    resultHandoffEntryCount: entries.length,
    consumerNames: ["Locus", "Multiverse"],
    locusResultHandoffEntryCount,
    multiverseResultHandoffEntryCount,
    resultHandoffIntent:
      CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_HANDOFF_INTENT,
    deterministicHandoffIds: entries.map(({ handoffId }) => handoffId),
    referencedPhase550SchemaBoundaryIds: entries.map(
      ({ referencedPhase550SchemaBoundaryId }) =>
        referencedPhase550SchemaBoundaryId
    ),
    referencedPhase551FixtureIds: entries.map(
      ({ referencedPhase551FixtureId }) => referencedPhase551FixtureId
    ),
    referencedPhase551FixtureGroups: entries.map(
      ({ referencedPhase551FixtureGroup }) => referencedPhase551FixtureGroup
    ),
    referencedPhase552ConformanceHandoffIds: entries.map(
      ({ referencedPhase552ConformanceHandoffId }) =>
        referencedPhase552ConformanceHandoffId
    ),
    referencedPhase553RunnerRequirementIds: entries.map(
      ({ referencedPhase553RunnerRequirementId }) =>
        referencedPhase553RunnerRequirementId
    ),
    referencedPhase554TestPlanIds: entries.map(
      ({ referencedPhase554TestPlanId }) => referencedPhase554TestPlanId
    ),
    referencedPhase555ResultSchemaIds: entries.map(
      ({ referencedPhase555ResultSchemaId }) => referencedPhase555ResultSchemaId
    ),
    referencesPhase550SchemaBoundary: entries.every(
      ({ referencedPhase550SchemaBoundaryId }) =>
        referencedPhase550SchemaBoundaryId.startsWith("phase5-50.")
    ),
    referencesPhase551ExamplePack: entries.every(
      ({ referencedPhase551FixtureId }) =>
        referencedPhase551FixtureId.startsWith("phase5-51.")
    ),
    referencesPhase552ConformanceHandoff: entries.every(
      ({ referencedPhase552ConformanceHandoffId }) =>
        referencedPhase552ConformanceHandoffId.startsWith("phase5-52.")
    ),
    referencesPhase553RunnerRequirements: entries.every(
      ({ referencedPhase553RunnerRequirementId }) =>
        referencedPhase553RunnerRequirementId.startsWith("phase5-53.")
    ),
    referencesPhase554TestPlan: entries.every(
      ({ referencedPhase554TestPlanId }) =>
        referencedPhase554TestPlanId.startsWith("phase5-54.")
    ),
    referencesPhase555ResultSchemaBoundary: entries.every(
      ({ referencedPhase555ResultSchemaId }) =>
        referencedPhase555ResultSchemaId.startsWith("phase5-55.")
    ),
    locusAndMultiverseConsumerTargetsOnly: entries.every(
      ({ consumerTargetOnly }) => consumerTargetOnly === true
    ),
    consumerRepoModifiedByArdyn: false,
    runnerImplementedByArdyn: false,
    resultProducerImplementedByArdyn: false,
    resultCollectorImplementedByArdyn: false,
    resultImporterImplementedByArdyn: false,
    resultExporterImplementedByArdyn: false,
    testHarnessImplementedByArdyn: false,
    importExportCommandImplemented: false,
    packageExportImplemented: false,
    consumerSideCiImplemented: false,
    fixtureDiscoveryRuntimeImplemented: false,
    browserRenderingHarnessImplemented: false,
    browserWcagAutomationImplemented: false,
    visualRegressionHarnessImplemented: false,
    screenReaderAutomationImplemented: false,
    uiFrontendBrowserRenderingImplemented: false,
    allBlockedAuthorizationFlagsFalse: entries.every(
      ({ explicitBlockedAuthorizationFlags }) =>
        Object.values(explicitBlockedAuthorizationFlags).every(
          (value) => value === false
        )
    ),
    allUnsafeRunnerResultProducerResultCollectorImportExportTestHarnessRuntimeFlagsFalse:
      entries.every(
        ({
          unsafeRunnerResultProducerResultCollectorImportExportTestHarnessRuntimeFlags
        }) =>
          Object.values(
            unsafeRunnerResultProducerResultCollectorImportExportTestHarnessRuntimeFlags
          ).every((value) => value === false)
      ),
    allRuntimeEffectsFalse: entries.every(({ runtimeEffect }) =>
      Object.values(runtimeEffect).every((value) => value === false)
    ),
    allEntriesNonAuthorizing: entries.every(
      ({ nonAuthorizingProof }) => nonAuthorizingProof === true
    ),
    validationImplementsRunner: false,
    validationImplementsResultProducer: false,
    validationImplementsResultCollector: false,
    validationImplementsResultImporter: false,
    validationImplementsResultExporter: false,
    validationImplementsTestHarness: false,
    validationImplementsImportExportCommands: false,
    validationImplementsPackageExport: false,
    validationImplementsConsumerSideCi: false,
    validationImplementsFixtureDiscoveryRuntime: false,
    validationPerformsRendering: false,
    validationRunsBrowserWcagAutomation: false,
    validationCallsExternalConsumers: false,
    validationPerformsExternalLookups: false,
    validationScansFilesystem: false,
    validationControlsProcesses: false,
    runtimeExecutionEnabled: false,
    commandRuntimeControlEnabled: false,
    databaseStorageRuntimeWritesEnabled: false,
    secretsRuntimeIngestionEnabled: false,
    connectorGrantProduced: false,
    fabricRuntimeSurfaceEnabled: false,
    webSocketHttpSurfaceEnabled: false,
    mcpToolExposureEnabled: false,
    taskExecutionEnabled: false,
    secureDropImplemented: false,
    serviceDiscoveryEnabled: false,
    scheduleEnforcementEnabled: false,
    backgroundPollingEnabled: false,
    filesystemScanningEnabled: false,
    processControlEnabled: false
  };
}

function consumerOwnedDisplayConformanceResultHandoffValidationRules() {
  return {
    referencesPhase550SchemaBoundaryRequired: true,
    referencesPhase551ExamplePackRequired: true,
    referencesPhase552ConformanceHandoffRequired: true,
    referencesPhase553RunnerRequirementsRequired: true,
    referencesPhase554TestPlanRequired: true,
    referencesPhase555ResultSchemaBoundaryRequired: true,
    missingRequiredFieldsFailClosed: true,
    unknownConsumerNamesFailClosed: true,
    unknownResultHandoffIntentFailsClosed: true,
    interactiveActionableIntentFailsClosed: true,
    enabledAuthorizationFlagsFailClosed: true,
    unsafeRunnerResultProducerResultCollectorImportExportTestHarnessRuntimeFlagsFailClosed:
      true,
    nestedUnsafeInputFlagsFailClosed: true,
    hiddenRunnerResultProducerResultCollectorImportExportTestHarnessRuntimeSemanticsFailClosed:
      true,
    secureDropImplementationSemanticsFailClosed: true,
    websocketHttpFabricMcpTaskExecutionSemanticsFailClosed: true,
    unknownReferencesFailClosed: true,
    runnerResultProducerResultCollectorImportExportTestHarnessImplementationSemanticsFailClosed:
      true,
    canonicalResultHandoffEntriesRequired: true,
    malformedResultHandoffEntriesFailClosed: true,
    validationImplementsRunner: false,
    validationImplementsResultProducer: false,
    validationImplementsResultCollector: false,
    validationImplementsResultImporter: false,
    validationImplementsResultExporter: false,
    validationImplementsTestHarness: false,
    validationImplementsImportExportCommands: false,
    validationImplementsPackageExport: false,
    validationImplementsConsumerSideCi: false,
    validationImplementsFixtureDiscoveryRuntime: false,
    validationPerformsRendering: false,
    validationRunsBrowserWcagAutomation: false,
    validationCallsExternalConsumers: false,
    validationPerformsExternalLookups: false,
    validationScansFilesystem: false,
    validationControlsProcesses: false
  };
}

function consumerOwnedDisplayConformanceResultHandoffGaps() {
  return [
    "The result handoff is static metadata only; no Locus or Multiverse consumer-owned result producer, collector, importer, exporter, runner, or test harness exists in Ardyn.",
    "No result import/export command, package export, consumer-side CI implementation, result package, or fixture discovery runtime exists.",
    "No browser, rendering, WCAG automation, visual regression, or screen-reader QA harness exists in Ardyn.",
    "No consumer repository integration exists; Locus and Multiverse remain target consumers only.",
    "Secure Drop, registry, websocket/http, Fabric, MCP, task execution, service discovery, scheduling, filesystem, process, and external lookup behavior remain blocked."
  ];
}

function consumerOwnedDisplayConformanceResultHandoffState(reviewedAt) {
  const resultHandoffEntries =
    consumerOwnedDisplayConformanceResultHandoffEntries();

  return {
    schema: CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_HANDOFF_STATE_SCHEMA,
    schemaVersion: CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_HANDOFF_VERSION,
    stateKind: "consumer-owned-display-conformance-result-handoff-state",
    stateMode: "review-only",
    reviewedAt,
    sourcePhaseContext: {
      precedingSchemaBoundaryPhase: "5.50",
      precedingSchemaBoundaryArtifact:
        "tests/fixtures/host-policy/phase5-50/consumer-display-fixture-schema-boundary.json",
      precedingExamplePackPhase: "5.51",
      precedingExamplePackArtifact:
        "tests/fixtures/host-policy/phase5-51/consumer-display-fixture-example-pack.json",
      precedingConformanceHandoffPhase: "5.52",
      precedingConformanceHandoffArtifact:
        "tests/fixtures/host-policy/phase5-52/consumer-display-fixture-conformance-handoff.json",
      precedingRunnerRequirementsPhase: "5.53",
      precedingRunnerRequirementsArtifact:
        "tests/fixtures/host-policy/phase5-53/consumer-owned-display-conformance-runner-requirements.json",
      precedingTestPlanPhase: "5.54",
      precedingTestPlanArtifact:
        "tests/fixtures/host-policy/phase5-54/consumer-owned-display-conformance-runner-test-plan.json",
      precedingResultSchemaBoundaryPhase: "5.55",
      precedingResultSchemaBoundaryArtifact:
        "tests/fixtures/host-policy/phase5-55/consumer-owned-display-conformance-runner-result-schema-boundary.json",
      phase550ConsumerDisplayFixtureSchemaBoundaryReferenceOnly: true,
      phase551ConsumerDisplayFixtureExamplePackReferenceOnly: true,
      phase552ConsumerDisplayFixtureConformanceHandoffReferenceOnly: true,
      phase553ConsumerOwnedDisplayConformanceRunnerRequirementsReferenceOnly: true,
      phase554ConsumerOwnedDisplayConformanceRunnerTestPlanReferenceOnly: true,
      phase555ConsumerOwnedDisplayConformanceRunnerResultSchemaBoundaryReferenceOnly:
        true,
      ardynOwnsConsumerUi: false,
      consumerRunnerImplementedByArdyn: false,
      resultProducerImplementedByArdyn: false,
      resultCollectorImplementedByArdyn: false,
      resultImporterImplementedByArdyn: false,
      resultExporterImplementedByArdyn: false,
      testHarnessImplementedByArdyn: false,
      importExportCommandImplementedByArdyn: false,
      packageExportImplementedByArdyn: false,
      consumerSideCiImplementedByArdyn: false,
      consumerRepoModifiedByArdyn: false
    },
    resultHandoffEntries,
    resultHandoffSummary:
      consumerOwnedDisplayConformanceResultHandoffSummary(resultHandoffEntries),
    phase550SchemaBoundaryReference: {
      sourceBoundarySchema: CONSUMER_DISPLAY_FIXTURE_SCHEMA_BOUNDARY_SCHEMA,
      sourceBoundaryFixture:
        "tests/fixtures/host-policy/phase5-50/consumer-display-fixture-schema-boundary.json",
      validationHelper:
        "createConsumerDisplayFixtureSchemaBoundaryForReview",
      referencedByResultHandoff: true,
      validationStartsRuntime: false,
      validationPerformsRendering: false,
      validationCallsConsumers: false
    },
    phase551ExamplePackReference: {
      sourceExamplePackSchema: CONSUMER_DISPLAY_FIXTURE_EXAMPLE_PACK_SCHEMA,
      sourceExamplePackFixture:
        "tests/fixtures/host-policy/phase5-51/consumer-display-fixture-example-pack.json",
      validationHelper:
        "createConsumerDisplayFixtureExamplePackForReview",
      referencedByResultHandoff: true,
      validationStartsRuntime: false,
      validationPerformsRendering: false,
      validationCallsConsumers: false
    },
    phase552ConformanceHandoffReference: {
      sourceHandoffSchema: CONSUMER_DISPLAY_FIXTURE_CONFORMANCE_HANDOFF_SCHEMA,
      sourceHandoffFixture:
        "tests/fixtures/host-policy/phase5-52/consumer-display-fixture-conformance-handoff.json",
      validationHelper:
        "createConsumerDisplayFixtureConformanceHandoffForReview",
      referencedByResultHandoff: true,
      validationStartsRuntime: false,
      validationPerformsRendering: false,
      validationCallsConsumers: false
    },
    phase553RunnerRequirementsReference: {
      sourceRunnerRequirementsSchema:
        CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_REQUIREMENTS_SCHEMA,
      sourceRunnerRequirementsFixture:
        "tests/fixtures/host-policy/phase5-53/consumer-owned-display-conformance-runner-requirements.json",
      validationHelper:
        "createConsumerOwnedDisplayConformanceRunnerRequirementsForReview",
      referencedByResultHandoff: true,
      validationStartsRuntime: false,
      validationPerformsRendering: false,
      validationCallsConsumers: false
    },
    phase554TestPlanReference: {
      sourceTestPlanSchema:
        CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_TEST_PLAN_SCHEMA,
      sourceTestPlanFixture:
        "tests/fixtures/host-policy/phase5-54/consumer-owned-display-conformance-runner-test-plan.json",
      validationHelper:
        "createConsumerOwnedDisplayConformanceRunnerTestPlanForReview",
      referencedByResultHandoff: true,
      validationStartsRuntime: false,
      validationPerformsRendering: false,
      validationCallsConsumers: false
    },
    phase555ResultSchemaBoundaryReference: {
      sourceResultSchemaBoundarySchema:
        CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_RESULT_SCHEMA_BOUNDARY_SCHEMA,
      sourceResultSchemaBoundaryFixture:
        "tests/fixtures/host-policy/phase5-55/consumer-owned-display-conformance-runner-result-schema-boundary.json",
      validationHelper:
        "createConsumerOwnedDisplayConformanceRunnerResultSchemaBoundaryForReview",
      referencedByResultHandoff: true,
      validationStartsRuntime: false,
      validationProducesResults: false,
      validationCollectsResults: false,
      validationImportsExportsResults: false,
      validationPerformsRendering: false,
      validationCallsConsumers: false
    },
    invalidResultHandoffCasePolicy:
      consumerOwnedDisplayConformanceResultHandoffValidationRules(),
    topDisplayConformanceResultHandoffGaps:
      consumerOwnedDisplayConformanceResultHandoffGaps(),
    recommendedNextPhase:
      "phase-5.57-consumer-owned-display-conformance-result-review-intake-boundary",
    consumerOwnedDisplayConformanceResultHandoffOnly: true,
    reviewOnly: true,
    authoritative: false,
    reviewArtifactOnly: true,
    nonAuthorizingProof: true,
    ...consumerDisplayAccessibilityForbiddenBehavior(),
    renderingCodeImplemented: false,
    browserRenderingHarnessImplemented: false,
    runnerImplementedByArdyn: false,
    resultProducerImplementedByArdyn: false,
    resultCollectorImplementedByArdyn: false,
    resultImporterImplementedByArdyn: false,
    resultExporterImplementedByArdyn: false,
    testHarnessImplementedByArdyn: false,
    consumerOwnedRunnerImplemented: false,
    consumerConformanceRunnerImplemented: false,
    fixtureImportCommandImplemented: false,
    fixtureExportCommandImplemented: false,
    fixtureImportExportCommandsImplemented: false,
    importExportCommandImplemented: false,
    packageExportImplemented: false,
    consumerSideCiImplemented: false,
    fixtureDiscoveryRuntimeImplemented: false,
    consumerRepoModifiedByArdyn: false,
    browserWcagAutomationImplemented: false,
    visualRegressionHarnessImplemented: false,
    screenReaderAutomationImplemented: false,
    externalLookupsEnabled: false,
    filesystemScanningEnabled: false,
    processControlEnabled: false,
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

function consumerOwnedDisplayConformanceResultHandoffRejectionReasons({
  accepted,
  classification
}) {
  const reasons = [
    "consumer_owned_display_conformance_result_handoff_is_review_only",
    "result_handoff_entries_are_metadata_only",
    "references_phase_5_50_schema_boundary",
    "references_phase_5_51_example_pack",
    "references_phase_5_52_conformance_handoff",
    "references_phase_5_53_runner_requirements",
    "references_phase_5_54_test_plan",
    "references_phase_5_55_result_schema_boundary",
    "ardyn_does_not_implement_runner_result_producer_result_collector_result_importer_result_exporter_test_harness_import_export_package_export_ci_ui_browser_rendering_or_consumer_repo_changes",
    "runtime_command_db_storage_secrets_connector_fabric_websocket_http_mcp_task_secure_drop_service_discovery_schedule_filesystem_process_authorizations_false",
    "unsafe_runner_result_producer_result_collector_import_export_test_harness_runtime_flags_fail_closed",
    "fallow_runtime_not_used",
    "runtime_enablement_still_blocked"
  ];

  return accepted
    ? reasons
    : [
        ...reasons,
        `input_classification_${classification}`,
        "consumer_owned_display_conformance_result_handoff_not_produced"
      ];
}

function consumerOwnedDisplayConformanceResultHandoffResult({
  reviewedAt,
  reviewedAtDefaulted,
  classification,
  accepted,
  consumerOwnedDisplayConformanceResultHandoff
}) {
  return {
    schema: CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_HANDOFF_SCHEMA,
    schemaVersion: CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_HANDOFF_VERSION,
    consumerOwnedDisplayConformanceResultHandoffKind:
      CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_HANDOFF_KIND,
    consumerOwnedDisplayConformanceResultHandoffMode: "review-only",
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    consumerOwnedDisplayConformanceResultHandoffProduced: accepted,
    consumerOwnedDisplayConformanceResultHandoff,
    resultHandoffSummary: accepted
      ? consumerOwnedDisplayConformanceResultHandoff.resultHandoffSummary
      : null,
    phase550SchemaBoundaryReference: accepted
      ? consumerOwnedDisplayConformanceResultHandoff
          .phase550SchemaBoundaryReference
      : null,
    phase551ExamplePackReference: accepted
      ? consumerOwnedDisplayConformanceResultHandoff
          .phase551ExamplePackReference
      : null,
    phase552ConformanceHandoffReference: accepted
      ? consumerOwnedDisplayConformanceResultHandoff
          .phase552ConformanceHandoffReference
      : null,
    phase553RunnerRequirementsReference: accepted
      ? consumerOwnedDisplayConformanceResultHandoff
          .phase553RunnerRequirementsReference
      : null,
    phase554TestPlanReference: accepted
      ? consumerOwnedDisplayConformanceResultHandoff.phase554TestPlanReference
      : null,
    phase555ResultSchemaBoundaryReference: accepted
      ? consumerOwnedDisplayConformanceResultHandoff
          .phase555ResultSchemaBoundaryReference
      : null,
    resultHandoffEntries: accepted
      ? consumerOwnedDisplayConformanceResultHandoff.resultHandoffEntries
      : [],
    invalidResultHandoffCasePolicy: accepted
      ? consumerOwnedDisplayConformanceResultHandoff
          .invalidResultHandoffCasePolicy
      : consumerOwnedDisplayConformanceResultHandoffValidationRules(),
    topDisplayConformanceResultHandoffGaps: accepted
      ? consumerOwnedDisplayConformanceResultHandoff
          .topDisplayConformanceResultHandoffGaps
      : [],
    recommendedNextPhase: accepted
      ? consumerOwnedDisplayConformanceResultHandoff.recommendedNextPhase
      : null,
    consumerOwnedDisplayConformanceResultHandoffOnly: true,
    reviewOnly: true,
    authoritative: false,
    reviewArtifactOnly: true,
    nonAuthorizingProof: true,
    ...consumerDisplayAccessibilityForbiddenBehavior(),
    renderingCodeImplemented: false,
    browserRenderingHarnessImplemented: false,
    runnerImplementedByArdyn: false,
    resultProducerImplementedByArdyn: false,
    resultCollectorImplementedByArdyn: false,
    resultImporterImplementedByArdyn: false,
    resultExporterImplementedByArdyn: false,
    testHarnessImplementedByArdyn: false,
    consumerOwnedRunnerImplemented: false,
    consumerConformanceRunnerImplemented: false,
    fixtureImportCommandImplemented: false,
    fixtureExportCommandImplemented: false,
    fixtureImportExportCommandsImplemented: false,
    importExportCommandImplemented: false,
    packageExportImplemented: false,
    consumerSideCiImplemented: false,
    fixtureDiscoveryRuntimeImplemented: false,
    consumerRepoModifiedByArdyn: false,
    browserWcagAutomationImplemented: false,
    visualRegressionHarnessImplemented: false,
    screenReaderAutomationImplemented: false,
    externalLookupsEnabled: false,
    filesystemScanningEnabled: false,
    processControlEnabled: false,
    rejectionReasons:
      consumerOwnedDisplayConformanceResultHandoffRejectionReasons({
        accepted,
        classification
      }),
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

export function createConsumerOwnedDisplayConformanceResultHandoffForReview(
  input = {}
) {
  const inputRecord =
    consumerOwnedDisplayConformanceResultHandoffInputRecord(input);
  const reviewedAt =
    consumerOwnedDisplayConformanceResultHandoffReviewedAt(inputRecord);
  const reviewedAtDefaulted = isReviewedAtDefaulted(inputRecord);
  const classification =
    consumerOwnedDisplayConformanceResultHandoffInputClassification(
      inputRecord
    );
  const accepted =
    classification ===
    VALID_CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_HANDOFF_CLASSIFICATION;
  const consumerOwnedDisplayConformanceResultHandoff = accepted
    ? consumerOwnedDisplayConformanceResultHandoffState(reviewedAt)
    : null;

  return consumerOwnedDisplayConformanceResultHandoffResult({
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    accepted,
    consumerOwnedDisplayConformanceResultHandoff
  });
}

const CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_INTAKE_BOUNDARY_STATE_SCHEMA =
  "ardyn.phase-5.57.consumer-owned-display-conformance-result-review-intake-boundary-state";
const VALID_CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_INTAKE_BOUNDARY_CLASSIFICATION =
  "valid_consumer_owned_display_conformance_result_review_intake_boundary_runtime_still_blocked";
const MALFORMED_CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_INTAKE_BOUNDARY_CLASSIFICATION =
  "malformed_consumer_owned_display_conformance_result_review_intake_boundary_input_rejected";
const CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_INTAKE_BOUNDARY_INTENT =
  "metadata_only";

const CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_INTAKE_BOUNDARY_REQUIRED_FIELDS =
  Object.freeze([
    "intakeId",
    "consumerName",
    "displaySurfaceId",
    "sourceArdynArtifactType",
    "reviewIntakeIntent",
    "referencedPhase550SchemaBoundaryId",
    "referencedPhase551FixtureId",
    "referencedPhase551FixtureGroup",
    "referencedPhase552ConformanceHandoffId",
    "referencedPhase553RunnerRequirementId",
    "referencedPhase554TestPlanId",
    "referencedPhase555ResultSchemaId",
    "referencedPhase556ResultHandoffId",
    "futureConsumerOwnedResultArtifactResponsibility",
    "allowedFutureIntakeCandidateBehavior",
    "forbiddenCurrentArdynBehavior",
    "deterministicOrderingHashExpectations",
    "accessibilityWcagIntakeNotes",
    "requiredFutureContractBeforeExecutableResultIntakeImportValidationRoutingEvaluationApprovalExportOrCi",
    "explicitBlockedAuthorizationFlags",
    "unsafeRunnerResultProducerResultCollectorImportExportValidatorReviewRouterEvaluatorApprovalTestHarnessRuntimeFlags",
    "consumerTargetOnly",
    "reviewIntakeCandidateMetadataOnly",
    "runnerImplementedByArdyn",
    "resultProducerImplementedByArdyn",
    "resultCollectorImplementedByArdyn",
    "resultImporterImplementedByArdyn",
    "resultExporterImplementedByArdyn",
    "resultValidatorImplementedByArdyn",
    "reviewRouterImplementedByArdyn",
    "evaluatorImplementedByArdyn",
    "approvalPathImplementedByArdyn",
    "approvalDecisionProducedByArdyn",
    "approvalGrantProducedByArdyn",
    "testHarnessImplementedByArdyn",
    "importExportCommandImplemented",
    "browserRenderingHarnessImplemented",
    "packageExportImplemented",
    "consumerSideCiImplemented",
    "fixtureDiscoveryRuntimeImplemented",
    "consumerRepoModifiedByArdyn",
    "nonAuthorizingProof"
  ]);

const CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_INTAKE_BOUNDARY_UNSAFE_FIELDS =
  Object.freeze([
    ...CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_HANDOFF_UNSAFE_FIELDS,
    ...CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_INTAKE_BOUNDARY_EXTRA_UNSAFE_FIELDS
  ]);

const CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_INTAKE_BOUNDARY_IMPLEMENTATION_FIELDS =
  Object.freeze([
    ...CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_HANDOFF_IMPLEMENTATION_FIELDS,
    ...CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_INTAKE_BOUNDARY_EXTRA_UNSAFE_FIELDS
  ]);

const CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_INTAKE_BOUNDARY_HIDDEN_FIELDS =
  Object.freeze([
    ...CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_HANDOFF_HIDDEN_FIELDS,
    "hiddenResultValidatorSemanticsEnabled",
    "hiddenReviewRouterSemanticsEnabled",
    "hiddenEvaluatorSemanticsEnabled",
    "hiddenApprovalSemanticsEnabled",
    "hiddenResultReviewIntakeSemanticsEnabled"
  ]);

function consumerOwnedDisplayConformanceResultReviewIntakeBoundaryInputRecord(
  input
) {
  return isPlainObjectRecord(input) ? input : null;
}

function consumerOwnedDisplayConformanceResultReviewIntakeBoundaryReviewedAt(
  inputRecord
) {
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

function consumerOwnedDisplayConformanceResultReviewIntakeBoundaryInputMalformed(
  inputRecord
) {
  return (
    inputRecord === null ||
    (Object.prototype.hasOwnProperty.call(inputRecord, "reviewedAt") &&
      !isUtcIsoTimestampWithMilliseconds(inputRecord.reviewedAt)) ||
    (Object.prototype.hasOwnProperty.call(inputRecord, "reviewIntakeEntries") &&
      !Array.isArray(inputRecord.reviewIntakeEntries))
  );
}

function consumerOwnedDisplayConformanceResultReviewIntakeBoundaryInputEntries(
  inputRecord
) {
  return Array.isArray(inputRecord?.reviewIntakeEntries)
    ? inputRecord.reviewIntakeEntries
    : null;
}

function consumerOwnedDisplayConformanceResultReviewIntakeBoundaryMissingRequiredField(
  entry
) {
  if (!isPlainObjectRecord(entry)) {
    return true;
  }

  return CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_INTAKE_BOUNDARY_REQUIRED_FIELDS.some(
    (field) => !Object.prototype.hasOwnProperty.call(entry, field)
  );
}

function consumerOwnedDisplayConformanceResultReviewIntakeBoundaryDeterminismMalformed(
  expectations
) {
  return (
    !isPlainObjectRecord(expectations) ||
    expectations.deterministicIntakeIdsRequired !== true ||
    expectations.deterministicOrderingRequired !== true ||
    expectations.deterministicForbiddenBehaviorOrderingRequired !== true ||
    expectations.deterministicHashInputOrderingRequired !== true ||
    expectations.noClockNetworkRandomnessAllowed !== true ||
    expectations.consumerOwnedResultReviewIntakeMustBeReviewOnly !== true ||
    expectations.hashDoesNotAuthorizeRuntime !== true
  );
}

function consumerOwnedDisplayConformanceResultReviewIntakeBoundaryEntryMalformed(
  entry
) {
  return (
    consumerOwnedDisplayConformanceResultReviewIntakeBoundaryMissingRequiredField(
      entry
    ) ||
    typeof entry.intakeId !== "string" ||
    entry.intakeId.length === 0 ||
    typeof entry.displaySurfaceId !== "string" ||
    entry.displaySurfaceId.length === 0 ||
    typeof entry.sourceArdynArtifactType !== "string" ||
    entry.sourceArdynArtifactType.length === 0 ||
    entry.reviewIntakeIntent !==
      CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_INTAKE_BOUNDARY_INTENT ||
    typeof entry.referencedPhase550SchemaBoundaryId !== "string" ||
    entry.referencedPhase550SchemaBoundaryId.length === 0 ||
    typeof entry.referencedPhase551FixtureId !== "string" ||
    entry.referencedPhase551FixtureId.length === 0 ||
    typeof entry.referencedPhase551FixtureGroup !== "string" ||
    entry.referencedPhase551FixtureGroup.length === 0 ||
    typeof entry.referencedPhase552ConformanceHandoffId !== "string" ||
    entry.referencedPhase552ConformanceHandoffId.length === 0 ||
    typeof entry.referencedPhase553RunnerRequirementId !== "string" ||
    entry.referencedPhase553RunnerRequirementId.length === 0 ||
    typeof entry.referencedPhase554TestPlanId !== "string" ||
    entry.referencedPhase554TestPlanId.length === 0 ||
    typeof entry.referencedPhase555ResultSchemaId !== "string" ||
    entry.referencedPhase555ResultSchemaId.length === 0 ||
    typeof entry.referencedPhase556ResultHandoffId !== "string" ||
    entry.referencedPhase556ResultHandoffId.length === 0 ||
    typeof entry.futureConsumerOwnedResultArtifactResponsibility !== "string" ||
    entry.futureConsumerOwnedResultArtifactResponsibility.length === 0 ||
    typeof entry.allowedFutureIntakeCandidateBehavior !== "string" ||
    entry.allowedFutureIntakeCandidateBehavior.length === 0 ||
    !Array.isArray(entry.forbiddenCurrentArdynBehavior) ||
    entry.forbiddenCurrentArdynBehavior.length < 15 ||
    entry.forbiddenCurrentArdynBehavior.some(
      (behavior) => typeof behavior !== "string"
    ) ||
    consumerOwnedDisplayConformanceResultReviewIntakeBoundaryDeterminismMalformed(
      entry.deterministicOrderingHashExpectations
    ) ||
    consumerDisplayFixtureSchemaBoundaryAccessibilityMalformed(
      entry.accessibilityWcagIntakeNotes
    ) ||
    typeof entry
      .requiredFutureContractBeforeExecutableResultIntakeImportValidationRoutingEvaluationApprovalExportOrCi !==
      "string" ||
    entry
      .requiredFutureContractBeforeExecutableResultIntakeImportValidationRoutingEvaluationApprovalExportOrCi
      .length === 0 ||
    !isPlainObjectRecord(entry.explicitBlockedAuthorizationFlags) ||
    !isPlainObjectRecord(
      entry
        .unsafeRunnerResultProducerResultCollectorImportExportValidatorReviewRouterEvaluatorApprovalTestHarnessRuntimeFlags
    ) ||
    entry.consumerTargetOnly !== true ||
    entry.reviewIntakeCandidateMetadataOnly !== true ||
    entry.runnerImplementedByArdyn !== false ||
    entry.resultProducerImplementedByArdyn !== false ||
    entry.resultCollectorImplementedByArdyn !== false ||
    entry.resultImporterImplementedByArdyn !== false ||
    entry.resultExporterImplementedByArdyn !== false ||
    entry.resultValidatorImplementedByArdyn !== false ||
    entry.reviewRouterImplementedByArdyn !== false ||
    entry.evaluatorImplementedByArdyn !== false ||
    entry.approvalPathImplementedByArdyn !== false ||
    entry.approvalDecisionProducedByArdyn !== false ||
    entry.approvalGrantProducedByArdyn !== false ||
    entry.testHarnessImplementedByArdyn !== false ||
    entry.importExportCommandImplemented !== false ||
    entry.browserRenderingHarnessImplemented !== false ||
    entry.packageExportImplemented !== false ||
    entry.consumerSideCiImplemented !== false ||
    entry.fixtureDiscoveryRuntimeImplemented !== false ||
    entry.consumerRepoModifiedByArdyn !== false ||
    entry.nonAuthorizingProof !== true
  );
}

function consumerOwnedDisplayConformanceResultReviewIntakeBoundaryContainsEntryIssue(
  entries,
  predicate
) {
  return entries !== null && entries.some((entry) => predicate(entry));
}

function consumerOwnedDisplayConformanceResultReviewIntakeBoundaryAuthorizationFlagEnabled(
  entry
) {
  return (
    consumerDisplayAccessibilityContractMapContainsTrue(
      entry?.explicitBlockedAuthorizationFlags
    ) ||
    consumerDisplayAccessibilityContractMapContainsTrue(
      entry?.blockedAuthorizationFlags
    ) ||
    consumerDisplayAccessibilityContractMapContainsTrue(entry?.authorizationFlags)
  );
}

function consumerOwnedDisplayConformanceResultReviewIntakeBoundaryUnsafeFlagEnabled(
  entry
) {
  return (
    consumerDisplayAccessibilityContractMapContainsTrue(
      entry
        ?.unsafeRunnerResultProducerResultCollectorImportExportValidatorReviewRouterEvaluatorApprovalTestHarnessRuntimeFlags
    ) ||
    consumerDisplayAccessibilityContractMapFieldTruePresent(
      entry,
      CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_INTAKE_BOUNDARY_UNSAFE_FIELDS
    )
  );
}

function consumerOwnedDisplayConformanceResultReviewIntakeBoundaryTopLevelFieldTruePresent(
  entry,
  fields
) {
  return (
    isPlainObjectRecord(entry) &&
    fields.some((field) => entry[field] === true)
  );
}

function consumerOwnedDisplayConformanceResultReviewIntakeBoundaryRecursiveUnsafeFlagEnabled(
  entry
) {
  return (
    CONSUMER_DISPLAY_ACCESSIBILITY_CONTRACT_MAP_UNSAFE_FIELD_GROUPS.some(
      ({ fields }) =>
        consumerDisplayAccessibilityContractMapFieldTruePresent(entry, fields)
    ) ||
    consumerDisplayAccessibilityContractMapContainsTrue(entry?.runtimeEffect)
  );
}

function consumerOwnedDisplayConformanceResultReviewIntakeBoundaryReferenceValid(
  entry
) {
  const resultHandoffEntry =
    consumerOwnedDisplayConformanceResultHandoffEntries().find(
      ({ handoffId }) =>
        handoffId === entry?.referencedPhase556ResultHandoffId
    );

  return (
    resultHandoffEntry !== undefined &&
    resultHandoffEntry.referencedPhase550SchemaBoundaryId ===
      entry.referencedPhase550SchemaBoundaryId &&
    resultHandoffEntry.referencedPhase551FixtureId ===
      entry.referencedPhase551FixtureId &&
    resultHandoffEntry.referencedPhase551FixtureGroup ===
      entry.referencedPhase551FixtureGroup &&
    resultHandoffEntry.referencedPhase552ConformanceHandoffId ===
      entry.referencedPhase552ConformanceHandoffId &&
    resultHandoffEntry.referencedPhase553RunnerRequirementId ===
      entry.referencedPhase553RunnerRequirementId &&
    resultHandoffEntry.referencedPhase554TestPlanId ===
      entry.referencedPhase554TestPlanId &&
    resultHandoffEntry.referencedPhase555ResultSchemaId ===
      entry.referencedPhase555ResultSchemaId &&
    resultHandoffEntry.consumerName === entry.consumerName &&
    resultHandoffEntry.displaySurfaceId === entry.displaySurfaceId &&
    resultHandoffEntry.sourceArdynArtifactType === entry.sourceArdynArtifactType
  );
}

function consumerOwnedDisplayConformanceResultReviewIntakeBoundaryEntriesCanonical(
  entries
) {
  if (entries === null) {
    return true;
  }

  return (
    JSON.stringify(entries) ===
    JSON.stringify(consumerOwnedDisplayConformanceResultReviewIntakeBoundaryEntries())
  );
}

function consumerOwnedDisplayConformanceResultReviewIntakeBoundaryInputClassification(
  inputRecord
) {
  if (
    consumerOwnedDisplayConformanceResultReviewIntakeBoundaryInputMalformed(
      inputRecord
    )
  ) {
    return MALFORMED_CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_INTAKE_BOUNDARY_CLASSIFICATION;
  }

  const entries =
    consumerOwnedDisplayConformanceResultReviewIntakeBoundaryInputEntries(
      inputRecord
    );

  if (
    consumerOwnedDisplayConformanceResultReviewIntakeBoundaryContainsEntryIssue(
      entries,
      consumerOwnedDisplayConformanceResultReviewIntakeBoundaryMissingRequiredField
    )
  ) {
    return "missing_required_consumer_owned_display_conformance_result_review_intake_boundary_entry_rejected";
  }

  if (
    consumerOwnedDisplayConformanceResultReviewIntakeBoundaryContainsEntryIssue(
      entries,
      (entry) => entry.consumerName !== "Locus" && entry.consumerName !== "Multiverse"
    )
  ) {
    return "unknown_consumer_name_consumer_owned_display_conformance_result_review_intake_boundary_input_rejected";
  }

  if (
    consumerOwnedDisplayConformanceResultReviewIntakeBoundaryContainsEntryIssue(
      entries,
      (entry) =>
        [
          "interactive",
          "actionable",
          "runtime_action",
          "command_action",
          "result_producer",
          "result_collector",
          "result_importer",
          "result_exporter",
          "result_validator",
          "review_router",
          "evaluator",
          "approval_decision",
          "approval_grant",
          "test_harness",
          "executable_runner",
          "executable_result",
          "result_intake"
        ].includes(entry.reviewIntakeIntent)
    )
  ) {
    return "interactive_actionable_intent_consumer_owned_display_conformance_result_review_intake_boundary_input_rejected";
  }

  if (
    consumerOwnedDisplayConformanceResultReviewIntakeBoundaryContainsEntryIssue(
      entries,
      (entry) =>
        entry.reviewIntakeIntent !==
        CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_INTAKE_BOUNDARY_INTENT
    )
  ) {
    return "unknown_review_intake_intent_consumer_owned_display_conformance_result_review_intake_boundary_input_rejected";
  }

  if (
    consumerOwnedDisplayConformanceResultReviewIntakeBoundaryContainsEntryIssue(
      entries,
      (entry) =>
        consumerOwnedDisplayConformanceResultReviewIntakeBoundaryTopLevelFieldTruePresent(
          entry,
          CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_INTAKE_BOUNDARY_IMPLEMENTATION_FIELDS
        )
    ) ||
    consumerOwnedDisplayConformanceResultReviewIntakeBoundaryTopLevelFieldTruePresent(
      inputRecord,
      CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_INTAKE_BOUNDARY_IMPLEMENTATION_FIELDS
    )
  ) {
    return "runner_result_producer_result_collector_import_export_validator_review_router_evaluator_approval_test_harness_implementation_semantics_consumer_owned_display_conformance_result_review_intake_boundary_input_rejected";
  }

  if (
    consumerOwnedDisplayConformanceResultReviewIntakeBoundaryContainsEntryIssue(
      entries,
      consumerOwnedDisplayConformanceResultReviewIntakeBoundaryEntryMalformed
    )
  ) {
    return MALFORMED_CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_INTAKE_BOUNDARY_CLASSIFICATION;
  }

  if (
    consumerOwnedDisplayConformanceResultReviewIntakeBoundaryContainsEntryIssue(
      entries,
      consumerOwnedDisplayConformanceResultReviewIntakeBoundaryAuthorizationFlagEnabled
    ) ||
    consumerOwnedDisplayConformanceResultReviewIntakeBoundaryAuthorizationFlagEnabled(
      inputRecord
    )
  ) {
    return "authorization_flags_enabled_consumer_owned_display_conformance_result_review_intake_boundary_input_rejected";
  }

  if (
    consumerOwnedDisplayConformanceResultReviewIntakeBoundaryContainsEntryIssue(
      entries,
      (entry) =>
        consumerDisplayAccessibilityContractMapFieldTruePresent(
          entry,
          CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_INTAKE_BOUNDARY_HIDDEN_FIELDS
        )
    ) ||
    consumerDisplayAccessibilityContractMapFieldTruePresent(
      inputRecord,
      CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_INTAKE_BOUNDARY_HIDDEN_FIELDS
    )
  ) {
    return "hidden_runner_result_producer_result_collector_import_export_validator_review_router_evaluator_approval_test_harness_runtime_semantics_consumer_owned_display_conformance_result_review_intake_boundary_input_rejected";
  }

  if (
    consumerOwnedDisplayConformanceResultReviewIntakeBoundaryContainsEntryIssue(
      entries,
      (entry) =>
        consumerDisplayAccessibilityContractMapFieldTruePresent(
          entry,
          CONSUMER_DISPLAY_FIXTURE_SCHEMA_BOUNDARY_SECURE_DROP_FIELDS
        )
    ) ||
    consumerDisplayAccessibilityContractMapFieldTruePresent(
      inputRecord,
      CONSUMER_DISPLAY_FIXTURE_SCHEMA_BOUNDARY_SECURE_DROP_FIELDS
    )
  ) {
    return "secure_drop_implementation_semantics_consumer_owned_display_conformance_result_review_intake_boundary_input_rejected";
  }

  if (
    consumerOwnedDisplayConformanceResultReviewIntakeBoundaryContainsEntryIssue(
      entries,
      (entry) =>
        consumerDisplayAccessibilityContractMapFieldTruePresent(
          entry,
          CONSUMER_DISPLAY_FIXTURE_SCHEMA_BOUNDARY_RUNTIME_SURFACE_FIELDS
        )
    ) ||
    consumerDisplayAccessibilityContractMapFieldTruePresent(
      inputRecord,
      CONSUMER_DISPLAY_FIXTURE_SCHEMA_BOUNDARY_RUNTIME_SURFACE_FIELDS
    )
  ) {
    return "websocket_http_fabric_mcp_task_execution_semantics_consumer_owned_display_conformance_result_review_intake_boundary_input_rejected";
  }

  if (
    consumerOwnedDisplayConformanceResultReviewIntakeBoundaryContainsEntryIssue(
      entries,
      consumerOwnedDisplayConformanceResultReviewIntakeBoundaryRecursiveUnsafeFlagEnabled
    ) ||
    consumerOwnedDisplayConformanceResultReviewIntakeBoundaryRecursiveUnsafeFlagEnabled(
      inputRecord
    )
  ) {
    return "nested_unsafe_flags_consumer_owned_display_conformance_result_review_intake_boundary_input_rejected";
  }

  if (
    consumerOwnedDisplayConformanceResultReviewIntakeBoundaryContainsEntryIssue(
      entries,
      consumerOwnedDisplayConformanceResultReviewIntakeBoundaryUnsafeFlagEnabled
    ) ||
    consumerOwnedDisplayConformanceResultReviewIntakeBoundaryUnsafeFlagEnabled(
      inputRecord
    )
  ) {
    return "unsafe_runner_result_producer_result_collector_import_export_validator_review_router_evaluator_approval_test_harness_runtime_flags_consumer_owned_display_conformance_result_review_intake_boundary_input_rejected";
  }

  if (
    consumerOwnedDisplayConformanceResultReviewIntakeBoundaryContainsEntryIssue(
      entries,
      (entry) =>
        !consumerOwnedDisplayConformanceResultReviewIntakeBoundaryReferenceValid(
          entry
        )
    )
  ) {
    return "unknown_reference_consumer_owned_display_conformance_result_review_intake_boundary_input_rejected";
  }

  if (
    !consumerOwnedDisplayConformanceResultReviewIntakeBoundaryEntriesCanonical(
      entries
    )
  ) {
    return "noncanonical_consumer_owned_display_conformance_result_review_intake_boundary_input_rejected";
  }

  return VALID_CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_INTAKE_BOUNDARY_CLASSIFICATION;
}

function consumerOwnedDisplayConformanceResultReviewIntakeBoundaryUnsafeFlags() {
  return {
    ...consumerOwnedDisplayConformanceResultHandoffUnsafeFlags(),
    resultValidatorEnabled: false,
    resultValidatorImplementedByArdyn: false,
    reviewRouterEnabled: false,
    reviewRouterImplementedByArdyn: false,
    evaluatorEnabled: false,
    evaluatorImplementedByArdyn: false,
    evaluatorExecutionEnabled: false,
    approvalPathEnabled: false,
    approvalPathImplementedByArdyn: false,
    approvalDecisionEnabled: false,
    approvalDecisionProduced: false,
    approvalDecisionProducedByArdyn: false,
    approvalGrantEnabled: false,
    approvalGrantProduced: false,
    approvalGrantProducedByArdyn: false,
    resultReviewIntakeEnabled: false,
    resultReviewIntakeImportEnabled: false,
    resultReviewIntakeExportEnabled: false,
    resultReviewIntakeValidationEnabled: false,
    resultReviewIntakeRoutingEnabled: false,
    resultReviewIntakeEvaluationEnabled: false,
    resultReviewIntakeApprovalEnabled: false,
    resultReviewIntakeCiEnabled: false,
    resultReviewIntakeRuntimeEnabled: false,
    consumerResultValidatorImplemented: false,
    consumerReviewRouterImplemented: false,
    consumerEvaluatorImplemented: false,
    consumerApprovalPathImplemented: false,
    hiddenResultValidatorSemanticsEnabled: false,
    hiddenReviewRouterSemanticsEnabled: false,
    hiddenEvaluatorSemanticsEnabled: false,
    hiddenApprovalSemanticsEnabled: false,
    hiddenResultReviewIntakeSemanticsEnabled: false
  };
}

function consumerOwnedDisplayConformanceResultReviewIntakeBoundaryDefinitions() {
  return consumerOwnedDisplayConformanceResultHandoffEntries().map(
    (resultHandoffEntry) => ({
      resultHandoffEntry,
      intakeId: resultHandoffEntry.handoffId
        .replace("phase5-56.", "phase5-57.")
        .replace(".result-handoff", ".result-review-intake")
    })
  );
}

function consumerOwnedDisplayConformanceResultReviewIntakeBoundaryForbiddenCurrentArdynBehavior() {
  return [
    "produce conformance results",
    "collect conformance results",
    "import conformance results",
    "export conformance results",
    "validate conformance results",
    "route review intake candidates",
    "assign reviewers",
    "execute evaluators",
    "produce evaluator results",
    "produce approval decisions",
    "produce approval grants",
    "persist approval grants",
    "run test harnesses",
    "run consumer-side CI",
    "render UI/browser/WCAG automation",
    "modify Locus or Multiverse repositories",
    "start runtime, command, connector, Fabric, websocket/http, MCP, task, Secure Drop, service-discovery, schedule, filesystem, process, or external lookup behavior"
  ];
}

function consumerOwnedDisplayConformanceResultReviewIntakeBoundaryEntry({
  resultHandoffEntry,
  intakeId
}) {
  const consumerSlug = resultHandoffEntry.consumerName.toLowerCase();

  return {
    intakeId,
    consumerName: resultHandoffEntry.consumerName,
    displaySurfaceId: resultHandoffEntry.displaySurfaceId,
    sourceArdynArtifactType: resultHandoffEntry.sourceArdynArtifactType,
    reviewIntakeIntent:
      CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_INTAKE_BOUNDARY_INTENT,
    referencedPhase550SchemaBoundaryId:
      resultHandoffEntry.referencedPhase550SchemaBoundaryId,
    referencedPhase551FixtureId: resultHandoffEntry.referencedPhase551FixtureId,
    referencedPhase551FixtureGroup:
      resultHandoffEntry.referencedPhase551FixtureGroup,
    referencedPhase552ConformanceHandoffId:
      resultHandoffEntry.referencedPhase552ConformanceHandoffId,
    referencedPhase553RunnerRequirementId:
      resultHandoffEntry.referencedPhase553RunnerRequirementId,
    referencedPhase554TestPlanId:
      resultHandoffEntry.referencedPhase554TestPlanId,
    referencedPhase555ResultSchemaId:
      resultHandoffEntry.referencedPhase555ResultSchemaId,
    referencedPhase556ResultHandoffId: resultHandoffEntry.handoffId,
    futureConsumerOwnedResultArtifactResponsibility:
      `Future ${resultHandoffEntry.consumerName}-owned result artifacts for ${resultHandoffEntry.displaySurfaceId} may be named as Ardyn review intake candidates only as static metadata after a separate package, provenance, and review-intake contract exists.`,
    allowedFutureIntakeCandidateBehavior:
      `Future ${consumerSlug}-owned tooling may hand off deterministic result artifact metadata for human review-intake planning after a separate authorization phase; Ardyn may only describe the candidate boundary here.`,
    forbiddenCurrentArdynBehavior:
      consumerOwnedDisplayConformanceResultReviewIntakeBoundaryForbiddenCurrentArdynBehavior(),
    deterministicOrderingHashExpectations: {
      deterministicIntakeIdsRequired: true,
      deterministicOrderingRequired: true,
      deterministicForbiddenBehaviorOrderingRequired: true,
      deterministicHashInputOrderingRequired: true,
      noClockNetworkRandomnessAllowed: true,
      consumerOwnedResultReviewIntakeMustBeReviewOnly: true,
      hashDoesNotAuthorizeRuntime: true
    },
    accessibilityWcagIntakeNotes: {
      ...resultHandoffEntry.accessibilityWcagResultHandoffNotes,
      resultReviewIntakeMustRemainReadableWithoutColorOrMotion: true,
      resultReviewIntakeMustUseStaticAccessibleLabels: true,
      resultReviewIntakeMustNotExposeHiddenActionSemantics: true,
      reviewIntakeCandidateMustStayMetadataOnly: true
    },
    requiredFutureContractBeforeExecutableResultIntakeImportValidationRoutingEvaluationApprovalExportOrCi:
      "A separate consumer-owned executable result-intake, import, validation, routing, evaluation, approval, export, package, and CI contract is required before any live behavior exists outside this review-only boundary.",
    explicitBlockedAuthorizationFlags:
      consumerDisplayAccessibilityAuthorizationFlags(),
    unsafeRunnerResultProducerResultCollectorImportExportValidatorReviewRouterEvaluatorApprovalTestHarnessRuntimeFlags:
      consumerOwnedDisplayConformanceResultReviewIntakeBoundaryUnsafeFlags(),
    consumerTargetOnly: true,
    reviewIntakeCandidateMetadataOnly: true,
    runnerImplementedByArdyn: false,
    resultProducerImplementedByArdyn: false,
    resultCollectorImplementedByArdyn: false,
    resultImporterImplementedByArdyn: false,
    resultExporterImplementedByArdyn: false,
    resultValidatorImplementedByArdyn: false,
    reviewRouterImplementedByArdyn: false,
    evaluatorImplementedByArdyn: false,
    approvalPathImplementedByArdyn: false,
    approvalDecisionProducedByArdyn: false,
    approvalGrantProducedByArdyn: false,
    testHarnessImplementedByArdyn: false,
    importExportCommandImplemented: false,
    browserRenderingHarnessImplemented: false,
    packageExportImplemented: false,
    consumerSideCiImplemented: false,
    fixtureDiscoveryRuntimeImplemented: false,
    consumerRepoModifiedByArdyn: false,
    nonAuthorizingProof: true,
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

function consumerOwnedDisplayConformanceResultReviewIntakeBoundaryEntries() {
  return consumerOwnedDisplayConformanceResultReviewIntakeBoundaryDefinitions().map(
    consumerOwnedDisplayConformanceResultReviewIntakeBoundaryEntry
  );
}

function consumerOwnedDisplayConformanceResultReviewIntakeBoundarySummary(
  entries
) {
  const locusReviewIntakeEntryCount = entries.filter(
    ({ consumerName }) => consumerName === "Locus"
  ).length;
  const multiverseReviewIntakeEntryCount = entries.filter(
    ({ consumerName }) => consumerName === "Multiverse"
  ).length;

  return {
    reviewIntakeBoundaryKind:
      CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_INTAKE_BOUNDARY_KIND,
    reviewIntakeEntryCount: entries.length,
    locusReviewIntakeEntryCount,
    multiverseReviewIntakeEntryCount,
    consumerNames: ["Locus", "Multiverse"],
    reviewIntakeIntent:
      CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_INTAKE_BOUNDARY_INTENT,
    reviewIntakeMeansMetadataCandidateStateOnly: true,
    deterministicIntakeIds: entries.map(({ intakeId }) => intakeId),
    referencedPhase556ResultHandoffIds: entries.map(
      ({ referencedPhase556ResultHandoffId }) =>
        referencedPhase556ResultHandoffId
    ),
    referencedPhase555ResultSchemaIds: entries.map(
      ({ referencedPhase555ResultSchemaId }) => referencedPhase555ResultSchemaId
    ),
    referencesPhase550SchemaBoundary: entries.every(
      ({ referencedPhase550SchemaBoundaryId }) =>
        referencedPhase550SchemaBoundaryId.startsWith("phase5-50.")
    ),
    referencesPhase551ExamplePack: entries.every(
      ({ referencedPhase551FixtureId }) =>
        referencedPhase551FixtureId.startsWith("phase5-51.")
    ),
    referencesPhase552ConformanceHandoff: entries.every(
      ({ referencedPhase552ConformanceHandoffId }) =>
        referencedPhase552ConformanceHandoffId.startsWith("phase5-52.")
    ),
    referencesPhase553RunnerRequirements: entries.every(
      ({ referencedPhase553RunnerRequirementId }) =>
        referencedPhase553RunnerRequirementId.startsWith("phase5-53.")
    ),
    referencesPhase554TestPlan: entries.every(
      ({ referencedPhase554TestPlanId }) =>
        referencedPhase554TestPlanId.startsWith("phase5-54.")
    ),
    referencesPhase555ResultSchemaBoundary: entries.every(
      ({ referencedPhase555ResultSchemaId }) =>
        referencedPhase555ResultSchemaId.startsWith("phase5-55.")
    ),
    referencesPhase556ResultHandoff: entries.every(
      ({ referencedPhase556ResultHandoffId }) =>
        referencedPhase556ResultHandoffId.startsWith("phase5-56.")
    ),
    locusAndMultiverseConsumerTargetsOnly: entries.every(
      ({ consumerTargetOnly }) => consumerTargetOnly === true
    ),
    consumerRepoModifiedByArdyn: false,
    runnerImplementedByArdyn: false,
    resultProducerImplementedByArdyn: false,
    resultCollectorImplementedByArdyn: false,
    resultImporterImplementedByArdyn: false,
    resultExporterImplementedByArdyn: false,
    resultValidatorImplementedByArdyn: false,
    reviewRouterImplementedByArdyn: false,
    evaluatorImplementedByArdyn: false,
    approvalPathImplementedByArdyn: false,
    approvalDecisionProducedByArdyn: false,
    approvalGrantProducedByArdyn: false,
    testHarnessImplementedByArdyn: false,
    importExportCommandImplemented: false,
    packageExportImplemented: false,
    consumerSideCiImplemented: false,
    fixtureDiscoveryRuntimeImplemented: false,
    browserRenderingHarnessImplemented: false,
    browserWcagAutomationImplemented: false,
    visualRegressionHarnessImplemented: false,
    screenReaderAutomationImplemented: false,
    uiFrontendBrowserRenderingImplemented: false,
    allBlockedAuthorizationFlagsFalse: entries.every(
      ({ explicitBlockedAuthorizationFlags }) =>
        Object.values(explicitBlockedAuthorizationFlags).every(
          (value) => value === false
        )
    ),
    allUnsafeRunnerResultProducerResultCollectorImportExportValidatorReviewRouterEvaluatorApprovalTestHarnessRuntimeFlagsFalse:
      entries.every(
        ({
          unsafeRunnerResultProducerResultCollectorImportExportValidatorReviewRouterEvaluatorApprovalTestHarnessRuntimeFlags
        }) =>
          Object.values(
            unsafeRunnerResultProducerResultCollectorImportExportValidatorReviewRouterEvaluatorApprovalTestHarnessRuntimeFlags
          ).every((value) => value === false)
      ),
    allRuntimeEffectsFalse: entries.every(({ runtimeEffect }) =>
      Object.values(runtimeEffect).every((value) => value === false)
    ),
    allEntriesNonAuthorizing: entries.every(
      ({ nonAuthorizingProof }) => nonAuthorizingProof === true
    ),
    validationImplementsRunner: false,
    validationImplementsResultProducer: false,
    validationImplementsResultCollector: false,
    validationImplementsResultImporter: false,
    validationImplementsResultExporter: false,
    validationImplementsResultValidator: false,
    validationImplementsReviewRouter: false,
    validationImplementsEvaluator: false,
    validationImplementsApprovalDecision: false,
    validationImplementsApprovalGrant: false,
    validationImplementsTestHarness: false,
    validationImplementsImportExportCommands: false,
    validationImplementsPackageExport: false,
    validationImplementsConsumerSideCi: false,
    validationImplementsFixtureDiscoveryRuntime: false,
    validationPerformsRendering: false,
    validationRunsBrowserWcagAutomation: false,
    validationCallsExternalConsumers: false,
    validationPerformsExternalLookups: false,
    validationScansFilesystem: false,
    validationControlsProcesses: false,
    runtimeExecutionEnabled: false,
    commandRuntimeControlEnabled: false,
    databaseStorageRuntimeWritesEnabled: false,
    secretsRuntimeIngestionEnabled: false,
    connectorGrantProduced: false,
    fabricRuntimeSurfaceEnabled: false,
    webSocketHttpSurfaceEnabled: false,
    mcpToolExposureEnabled: false,
    taskExecutionEnabled: false,
    secureDropImplemented: false,
    serviceDiscoveryEnabled: false,
    scheduleEnforcementEnabled: false,
    backgroundPollingEnabled: false,
    filesystemScanningEnabled: false,
    processControlEnabled: false
  };
}

function consumerOwnedDisplayConformanceResultReviewIntakeBoundaryValidationRules() {
  return {
    referencesPhase550SchemaBoundaryRequired: true,
    referencesPhase551ExamplePackRequired: true,
    referencesPhase552ConformanceHandoffRequired: true,
    referencesPhase553RunnerRequirementsRequired: true,
    referencesPhase554TestPlanRequired: true,
    referencesPhase555ResultSchemaBoundaryRequired: true,
    referencesPhase556ResultHandoffRequired: true,
    missingRequiredFieldsFailClosed: true,
    unknownConsumerNamesFailClosed: true,
    unknownReviewIntakeIntentFailsClosed: true,
    interactiveActionableIntentFailsClosed: true,
    enabledAuthorizationFlagsFailClosed: true,
    unsafeRunnerResultProducerResultCollectorImportExportValidatorReviewRouterEvaluatorApprovalTestHarnessRuntimeFlagsFailClosed:
      true,
    nestedUnsafeInputFlagsFailClosed: true,
    hiddenRunnerResultProducerResultCollectorImportExportValidatorReviewRouterEvaluatorApprovalTestHarnessRuntimeSemanticsFailClosed:
      true,
    secureDropImplementationSemanticsFailClosed: true,
    websocketHttpFabricMcpTaskExecutionSemanticsFailClosed: true,
    unknownReferencesFailClosed: true,
    runnerResultProducerResultCollectorImportExportValidatorReviewRouterEvaluatorApprovalTestHarnessImplementationSemanticsFailClosed:
      true,
    canonicalReviewIntakeEntriesRequired: true,
    malformedReviewIntakeEntriesFailClosed: true,
    validationImplementsRunner: false,
    validationImplementsResultProducer: false,
    validationImplementsResultCollector: false,
    validationImplementsResultImporter: false,
    validationImplementsResultExporter: false,
    validationImplementsResultValidator: false,
    validationImplementsReviewRouter: false,
    validationImplementsEvaluator: false,
    validationImplementsApprovalDecision: false,
    validationImplementsApprovalGrant: false,
    validationImplementsTestHarness: false,
    validationImplementsImportExportCommands: false,
    validationImplementsPackageExport: false,
    validationImplementsConsumerSideCi: false,
    validationImplementsFixtureDiscoveryRuntime: false,
    validationPerformsRendering: false,
    validationRunsBrowserWcagAutomation: false,
    validationCallsExternalConsumers: false,
    validationPerformsExternalLookups: false,
    validationScansFilesystem: false,
    validationControlsProcesses: false
  };
}

function consumerOwnedDisplayConformanceResultReviewIntakeBoundaryGaps() {
  return [
    "The review intake boundary is static metadata only; no Locus or Multiverse consumer-owned result artifact package, importer, validator, router, evaluator, approval path, runner, or test harness exists in Ardyn.",
    "No result intake/import/export command, package export, consumer-side CI implementation, result package, or fixture discovery runtime exists.",
    "No browser, rendering, WCAG automation, visual regression, or screen-reader QA harness exists in Ardyn.",
    "No consumer repository integration exists; Locus and Multiverse remain target consumers only.",
    "Secure Drop, registry, websocket/http, Fabric, MCP, task execution, service discovery, scheduling, filesystem, process, and external lookup behavior remain blocked."
  ];
}

function consumerOwnedDisplayConformanceResultReviewIntakeBoundaryState(
  reviewedAt
) {
  const reviewIntakeEntries =
    consumerOwnedDisplayConformanceResultReviewIntakeBoundaryEntries();

  return {
    schema:
      CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_INTAKE_BOUNDARY_STATE_SCHEMA,
    schemaVersion:
      CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_INTAKE_BOUNDARY_VERSION,
    stateKind:
      "consumer-owned-display-conformance-result-review-intake-boundary-state",
    stateMode: "review-only",
    reviewedAt,
    sourcePhaseContext: {
      precedingSchemaBoundaryPhase: "5.50",
      precedingSchemaBoundaryArtifact:
        "tests/fixtures/host-policy/phase5-50/consumer-display-fixture-schema-boundary.json",
      precedingExamplePackPhase: "5.51",
      precedingExamplePackArtifact:
        "tests/fixtures/host-policy/phase5-51/consumer-display-fixture-example-pack.json",
      precedingConformanceHandoffPhase: "5.52",
      precedingConformanceHandoffArtifact:
        "tests/fixtures/host-policy/phase5-52/consumer-display-fixture-conformance-handoff.json",
      precedingRunnerRequirementsPhase: "5.53",
      precedingRunnerRequirementsArtifact:
        "tests/fixtures/host-policy/phase5-53/consumer-owned-display-conformance-runner-requirements.json",
      precedingTestPlanPhase: "5.54",
      precedingTestPlanArtifact:
        "tests/fixtures/host-policy/phase5-54/consumer-owned-display-conformance-runner-test-plan.json",
      precedingResultSchemaBoundaryPhase: "5.55",
      precedingResultSchemaBoundaryArtifact:
        "tests/fixtures/host-policy/phase5-55/consumer-owned-display-conformance-runner-result-schema-boundary.json",
      precedingResultHandoffPhase: "5.56",
      precedingResultHandoffArtifact:
        "tests/fixtures/host-policy/phase5-56/consumer-owned-display-conformance-result-handoff.json",
      phase550ConsumerDisplayFixtureSchemaBoundaryReferenceOnly: true,
      phase551ConsumerDisplayFixtureExamplePackReferenceOnly: true,
      phase552ConsumerDisplayFixtureConformanceHandoffReferenceOnly: true,
      phase553ConsumerOwnedDisplayConformanceRunnerRequirementsReferenceOnly: true,
      phase554ConsumerOwnedDisplayConformanceRunnerTestPlanReferenceOnly: true,
      phase555ConsumerOwnedDisplayConformanceRunnerResultSchemaBoundaryReferenceOnly:
        true,
      phase556ConsumerOwnedDisplayConformanceResultHandoffReferenceOnly: true,
      reviewIntakeMeansMetadataCandidateStateOnly: true,
      ardynOwnsConsumerUi: false,
      consumerRunnerImplementedByArdyn: false,
      resultProducerImplementedByArdyn: false,
      resultCollectorImplementedByArdyn: false,
      resultImporterImplementedByArdyn: false,
      resultExporterImplementedByArdyn: false,
      resultValidatorImplementedByArdyn: false,
      reviewRouterImplementedByArdyn: false,
      evaluatorImplementedByArdyn: false,
      approvalPathImplementedByArdyn: false,
      testHarnessImplementedByArdyn: false,
      importExportCommandImplementedByArdyn: false,
      packageExportImplementedByArdyn: false,
      consumerSideCiImplementedByArdyn: false,
      consumerRepoModifiedByArdyn: false
    },
    reviewIntakeEntries,
    reviewIntakeSummary:
      consumerOwnedDisplayConformanceResultReviewIntakeBoundarySummary(
        reviewIntakeEntries
      ),
    phase550SchemaBoundaryReference: {
      sourceBoundarySchema: CONSUMER_DISPLAY_FIXTURE_SCHEMA_BOUNDARY_SCHEMA,
      sourceBoundaryFixture:
        "tests/fixtures/host-policy/phase5-50/consumer-display-fixture-schema-boundary.json",
      validationHelper:
        "createConsumerDisplayFixtureSchemaBoundaryForReview",
      referencedByReviewIntakeBoundary: true,
      validationStartsRuntime: false,
      validationPerformsRendering: false,
      validationCallsConsumers: false
    },
    phase551ExamplePackReference: {
      sourceExamplePackSchema: CONSUMER_DISPLAY_FIXTURE_EXAMPLE_PACK_SCHEMA,
      sourceExamplePackFixture:
        "tests/fixtures/host-policy/phase5-51/consumer-display-fixture-example-pack.json",
      validationHelper:
        "createConsumerDisplayFixtureExamplePackForReview",
      referencedByReviewIntakeBoundary: true,
      validationStartsRuntime: false,
      validationPerformsRendering: false,
      validationCallsConsumers: false
    },
    phase552ConformanceHandoffReference: {
      sourceHandoffSchema: CONSUMER_DISPLAY_FIXTURE_CONFORMANCE_HANDOFF_SCHEMA,
      sourceHandoffFixture:
        "tests/fixtures/host-policy/phase5-52/consumer-display-fixture-conformance-handoff.json",
      validationHelper:
        "createConsumerDisplayFixtureConformanceHandoffForReview",
      referencedByReviewIntakeBoundary: true,
      validationStartsRuntime: false,
      validationPerformsRendering: false,
      validationCallsConsumers: false
    },
    phase553RunnerRequirementsReference: {
      sourceRunnerRequirementsSchema:
        CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_REQUIREMENTS_SCHEMA,
      sourceRunnerRequirementsFixture:
        "tests/fixtures/host-policy/phase5-53/consumer-owned-display-conformance-runner-requirements.json",
      validationHelper:
        "createConsumerOwnedDisplayConformanceRunnerRequirementsForReview",
      referencedByReviewIntakeBoundary: true,
      validationStartsRuntime: false,
      validationPerformsRendering: false,
      validationCallsConsumers: false
    },
    phase554TestPlanReference: {
      sourceTestPlanSchema:
        CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_TEST_PLAN_SCHEMA,
      sourceTestPlanFixture:
        "tests/fixtures/host-policy/phase5-54/consumer-owned-display-conformance-runner-test-plan.json",
      validationHelper:
        "createConsumerOwnedDisplayConformanceRunnerTestPlanForReview",
      referencedByReviewIntakeBoundary: true,
      validationStartsRuntime: false,
      validationPerformsRendering: false,
      validationCallsConsumers: false
    },
    phase555ResultSchemaBoundaryReference: {
      sourceResultSchemaBoundarySchema:
        CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_RESULT_SCHEMA_BOUNDARY_SCHEMA,
      sourceResultSchemaBoundaryFixture:
        "tests/fixtures/host-policy/phase5-55/consumer-owned-display-conformance-runner-result-schema-boundary.json",
      validationHelper:
        "createConsumerOwnedDisplayConformanceRunnerResultSchemaBoundaryForReview",
      referencedByReviewIntakeBoundary: true,
      validationStartsRuntime: false,
      validationProducesResults: false,
      validationCollectsResults: false,
      validationImportsExportsResults: false,
      validationValidatesResults: false,
      validationRoutesReview: false,
      validationRunsEvaluators: false,
      validationApprovesResults: false,
      validationPerformsRendering: false,
      validationCallsConsumers: false
    },
    phase556ResultHandoffReference: {
      sourceResultHandoffSchema:
        CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_HANDOFF_SCHEMA,
      sourceResultHandoffFixture:
        "tests/fixtures/host-policy/phase5-56/consumer-owned-display-conformance-result-handoff.json",
      validationHelper:
        "createConsumerOwnedDisplayConformanceResultHandoffForReview",
      referencedByReviewIntakeBoundary: true,
      validationStartsRuntime: false,
      validationProducesResults: false,
      validationCollectsResults: false,
      validationImportsExportsResults: false,
      validationValidatesResults: false,
      validationRoutesReview: false,
      validationRunsEvaluators: false,
      validationApprovesResults: false,
      validationPerformsRendering: false,
      validationCallsConsumers: false
    },
    invalidReviewIntakeCasePolicy:
      consumerOwnedDisplayConformanceResultReviewIntakeBoundaryValidationRules(),
    topDisplayConformanceResultReviewIntakeGaps:
      consumerOwnedDisplayConformanceResultReviewIntakeBoundaryGaps(),
    recommendedNextPhase:
      "phase-5.58-consumer-owned-display-conformance-result-review-package-boundary",
    consumerOwnedDisplayConformanceResultReviewIntakeBoundaryOnly: true,
    reviewIntakeCandidateMetadataOnly: true,
    reviewOnly: true,
    authoritative: false,
    reviewArtifactOnly: true,
    nonAuthorizingProof: true,
    ...consumerDisplayAccessibilityForbiddenBehavior(),
    renderingCodeImplemented: false,
    browserRenderingHarnessImplemented: false,
    runnerImplementedByArdyn: false,
    resultProducerImplementedByArdyn: false,
    resultCollectorImplementedByArdyn: false,
    resultImporterImplementedByArdyn: false,
    resultExporterImplementedByArdyn: false,
    resultValidatorImplementedByArdyn: false,
    reviewRouterImplementedByArdyn: false,
    evaluatorImplementedByArdyn: false,
    approvalPathImplementedByArdyn: false,
    approvalDecisionProducedByArdyn: false,
    approvalGrantProducedByArdyn: false,
    testHarnessImplementedByArdyn: false,
    consumerOwnedRunnerImplemented: false,
    consumerConformanceRunnerImplemented: false,
    fixtureImportCommandImplemented: false,
    fixtureExportCommandImplemented: false,
    fixtureImportExportCommandsImplemented: false,
    importExportCommandImplemented: false,
    packageExportImplemented: false,
    consumerSideCiImplemented: false,
    fixtureDiscoveryRuntimeImplemented: false,
    consumerRepoModifiedByArdyn: false,
    browserWcagAutomationImplemented: false,
    visualRegressionHarnessImplemented: false,
    screenReaderAutomationImplemented: false,
    reviewerRoutingPerformed: false,
    reviewerAssignmentPerformed: false,
    evaluatorExecutionPerformed: false,
    evaluatorResultProduced: false,
    approvalDecisionProduced: false,
    approvalGrantProduced: false,
    approvalGrantPersisted: false,
    externalLookupsEnabled: false,
    filesystemScanningEnabled: false,
    processControlEnabled: false,
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

function consumerOwnedDisplayConformanceResultReviewIntakeBoundaryRejectionReasons({
  accepted,
  classification
}) {
  const reasons = [
    "consumer_owned_display_conformance_result_review_intake_boundary_is_review_only",
    "review_intake_entries_are_metadata_candidate_state_only",
    "references_phase_5_50_schema_boundary",
    "references_phase_5_51_example_pack",
    "references_phase_5_52_conformance_handoff",
    "references_phase_5_53_runner_requirements",
    "references_phase_5_54_test_plan",
    "references_phase_5_55_result_schema_boundary",
    "references_phase_5_56_result_handoff",
    "ardyn_does_not_implement_runner_result_producer_result_collector_result_importer_result_exporter_result_validator_review_router_evaluator_approval_test_harness_import_export_package_export_ci_ui_browser_rendering_or_consumer_repo_changes",
    "runtime_command_db_storage_secrets_connector_fabric_websocket_http_mcp_task_secure_drop_service_discovery_schedule_filesystem_process_authorizations_false",
    "unsafe_runner_result_producer_result_collector_import_export_validator_review_router_evaluator_approval_test_harness_runtime_flags_fail_closed",
    "fallow_runtime_not_used",
    "runtime_enablement_still_blocked"
  ];

  return accepted
    ? reasons
    : [
        ...reasons,
        `input_classification_${classification}`,
        "consumer_owned_display_conformance_result_review_intake_boundary_not_produced"
      ];
}

function consumerOwnedDisplayConformanceResultReviewIntakeBoundaryResult({
  reviewedAt,
  reviewedAtDefaulted,
  classification,
  accepted,
  consumerOwnedDisplayConformanceResultReviewIntakeBoundary
}) {
  return {
    schema:
      CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_INTAKE_BOUNDARY_SCHEMA,
    schemaVersion:
      CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_INTAKE_BOUNDARY_VERSION,
    consumerOwnedDisplayConformanceResultReviewIntakeBoundaryKind:
      CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_INTAKE_BOUNDARY_KIND,
    consumerOwnedDisplayConformanceResultReviewIntakeBoundaryMode:
      "review-only",
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    consumerOwnedDisplayConformanceResultReviewIntakeBoundaryProduced: accepted,
    consumerOwnedDisplayConformanceResultReviewIntakeBoundary,
    reviewIntakeSummary: accepted
      ? consumerOwnedDisplayConformanceResultReviewIntakeBoundary.reviewIntakeSummary
      : null,
    phase550SchemaBoundaryReference: accepted
      ? consumerOwnedDisplayConformanceResultReviewIntakeBoundary
          .phase550SchemaBoundaryReference
      : null,
    phase551ExamplePackReference: accepted
      ? consumerOwnedDisplayConformanceResultReviewIntakeBoundary
          .phase551ExamplePackReference
      : null,
    phase552ConformanceHandoffReference: accepted
      ? consumerOwnedDisplayConformanceResultReviewIntakeBoundary
          .phase552ConformanceHandoffReference
      : null,
    phase553RunnerRequirementsReference: accepted
      ? consumerOwnedDisplayConformanceResultReviewIntakeBoundary
          .phase553RunnerRequirementsReference
      : null,
    phase554TestPlanReference: accepted
      ? consumerOwnedDisplayConformanceResultReviewIntakeBoundary
          .phase554TestPlanReference
      : null,
    phase555ResultSchemaBoundaryReference: accepted
      ? consumerOwnedDisplayConformanceResultReviewIntakeBoundary
          .phase555ResultSchemaBoundaryReference
      : null,
    phase556ResultHandoffReference: accepted
      ? consumerOwnedDisplayConformanceResultReviewIntakeBoundary
          .phase556ResultHandoffReference
      : null,
    reviewIntakeEntries: accepted
      ? consumerOwnedDisplayConformanceResultReviewIntakeBoundary
          .reviewIntakeEntries
      : [],
    invalidReviewIntakeCasePolicy: accepted
      ? consumerOwnedDisplayConformanceResultReviewIntakeBoundary
          .invalidReviewIntakeCasePolicy
      : consumerOwnedDisplayConformanceResultReviewIntakeBoundaryValidationRules(),
    topDisplayConformanceResultReviewIntakeGaps: accepted
      ? consumerOwnedDisplayConformanceResultReviewIntakeBoundary
          .topDisplayConformanceResultReviewIntakeGaps
      : [],
    recommendedNextPhase: accepted
      ? consumerOwnedDisplayConformanceResultReviewIntakeBoundary
          .recommendedNextPhase
      : null,
    consumerOwnedDisplayConformanceResultReviewIntakeBoundaryOnly: true,
    reviewIntakeCandidateMetadataOnly: true,
    reviewOnly: true,
    authoritative: false,
    reviewArtifactOnly: true,
    nonAuthorizingProof: true,
    ...consumerDisplayAccessibilityForbiddenBehavior(),
    renderingCodeImplemented: false,
    browserRenderingHarnessImplemented: false,
    runnerImplementedByArdyn: false,
    resultProducerImplementedByArdyn: false,
    resultCollectorImplementedByArdyn: false,
    resultImporterImplementedByArdyn: false,
    resultExporterImplementedByArdyn: false,
    resultValidatorImplementedByArdyn: false,
    reviewRouterImplementedByArdyn: false,
    evaluatorImplementedByArdyn: false,
    approvalPathImplementedByArdyn: false,
    approvalDecisionProducedByArdyn: false,
    approvalGrantProducedByArdyn: false,
    testHarnessImplementedByArdyn: false,
    consumerOwnedRunnerImplemented: false,
    consumerConformanceRunnerImplemented: false,
    fixtureImportCommandImplemented: false,
    fixtureExportCommandImplemented: false,
    fixtureImportExportCommandsImplemented: false,
    importExportCommandImplemented: false,
    packageExportImplemented: false,
    consumerSideCiImplemented: false,
    fixtureDiscoveryRuntimeImplemented: false,
    consumerRepoModifiedByArdyn: false,
    browserWcagAutomationImplemented: false,
    visualRegressionHarnessImplemented: false,
    screenReaderAutomationImplemented: false,
    reviewerRoutingPerformed: false,
    reviewerAssignmentPerformed: false,
    evaluatorExecutionPerformed: false,
    evaluatorResultProduced: false,
    approvalDecisionProduced: false,
    approvalGrantProduced: false,
    approvalGrantPersisted: false,
    externalLookupsEnabled: false,
    filesystemScanningEnabled: false,
    processControlEnabled: false,
    rejectionReasons:
      consumerOwnedDisplayConformanceResultReviewIntakeBoundaryRejectionReasons({
        accepted,
        classification
      }),
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

export function createConsumerOwnedDisplayConformanceResultReviewIntakeBoundaryForReview(
  input = {}
) {
  const inputRecord =
    consumerOwnedDisplayConformanceResultReviewIntakeBoundaryInputRecord(input);
  const reviewedAt =
    consumerOwnedDisplayConformanceResultReviewIntakeBoundaryReviewedAt(
      inputRecord
    );
  const reviewedAtDefaulted = isReviewedAtDefaulted(input);
  const classification =
    consumerOwnedDisplayConformanceResultReviewIntakeBoundaryInputClassification(
      inputRecord
    );
  const accepted =
    classification ===
    VALID_CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_INTAKE_BOUNDARY_CLASSIFICATION;
  const consumerOwnedDisplayConformanceResultReviewIntakeBoundary = accepted
    ? consumerOwnedDisplayConformanceResultReviewIntakeBoundaryState(reviewedAt)
    : null;

  return consumerOwnedDisplayConformanceResultReviewIntakeBoundaryResult({
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    accepted,
    consumerOwnedDisplayConformanceResultReviewIntakeBoundary
  });
}

const CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_PACKAGE_BOUNDARY_STATE_SCHEMA =
  "ardyn.phase-5.58.consumer-owned-display-conformance-result-review-package-boundary-state";
const VALID_CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_PACKAGE_BOUNDARY_CLASSIFICATION =
  "valid_consumer_owned_display_conformance_result_review_package_boundary_runtime_still_blocked";
const MALFORMED_CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_PACKAGE_BOUNDARY_CLASSIFICATION =
  "malformed_consumer_owned_display_conformance_result_review_package_boundary_input_rejected";
const CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_PACKAGE_BOUNDARY_INTENT =
  "metadata_only";

const CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_PACKAGE_BOUNDARY_REQUIRED_FIELDS =
  Object.freeze([
    "packageBoundaryId",
    "consumerName",
    "displaySurfaceId",
    "sourceArdynArtifactType",
    "reviewPackageIntent",
    "referencedPhase550SchemaBoundaryId",
    "referencedPhase551FixtureId",
    "referencedPhase551FixtureGroup",
    "referencedPhase552ConformanceHandoffId",
    "referencedPhase553RunnerRequirementId",
    "referencedPhase554TestPlanId",
    "referencedPhase555ResultSchemaId",
    "referencedPhase556ResultHandoffId",
    "referencedPhase557ReviewIntakeId",
    "futureConsumerOwnedPackageResponsibility",
    "allowedFutureReviewPackageFields",
    "forbiddenCurrentArdynBehavior",
    "deterministicOrderingHashExpectations",
    "accessibilityWcagPackageNotes",
    "requiredFutureContractBeforePackageProductionImportExportValidationRoutingPersistenceEvaluationApprovalOrCi",
    "explicitBlockedAuthorizationFlags",
    "unsafePackageImportExportPersistenceRunnerResultProducerResultCollectorValidatorReviewRouterEvaluatorApprovalTestHarnessRuntimeFlags",
    "consumerTargetOnly",
    "reviewPackageCandidateMetadataOnly",
    "packageProducedByArdyn",
    "packageExportImplemented",
    "packageImportImplemented",
    "packageWriterImplemented",
    "packageReaderImplemented",
    "packagePersistenceImplemented",
    "packageDiscoveryImplemented",
    "packageDistributionImplemented",
    "runnerImplementedByArdyn",
    "resultProducerImplementedByArdyn",
    "resultCollectorImplementedByArdyn",
    "resultValidatorImplementedByArdyn",
    "reviewRouterImplementedByArdyn",
    "evaluatorImplementedByArdyn",
    "approvalPathImplementedByArdyn",
    "approvalDecisionProducedByArdyn",
    "approvalGrantProducedByArdyn",
    "testHarnessImplementedByArdyn",
    "importExportCommandImplemented",
    "browserRenderingHarnessImplemented",
    "consumerSideCiImplemented",
    "fixtureDiscoveryRuntimeImplemented",
    "consumerRepoModifiedByArdyn",
    "nonAuthorizingProof"
  ]);

const CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_PACKAGE_BOUNDARY_UNSAFE_FIELDS =
  Object.freeze([
    ...CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_INTAKE_BOUNDARY_UNSAFE_FIELDS,
    ...CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_PACKAGE_BOUNDARY_EXTRA_UNSAFE_FIELDS
  ]);

const CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_PACKAGE_BOUNDARY_IMPLEMENTATION_FIELDS =
  Object.freeze([
    ...CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_INTAKE_BOUNDARY_IMPLEMENTATION_FIELDS,
    ...CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_PACKAGE_BOUNDARY_EXTRA_UNSAFE_FIELDS
  ]);

const CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_PACKAGE_BOUNDARY_HIDDEN_FIELDS =
  Object.freeze([
    ...CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_INTAKE_BOUNDARY_HIDDEN_FIELDS,
    "hiddenPackageSemanticsEnabled",
    "hiddenPackageImportSemanticsEnabled",
    "hiddenPackageExportSemanticsEnabled",
    "hiddenPackagePersistenceSemanticsEnabled",
    "hiddenPackageWriterSemanticsEnabled",
    "hiddenPackageReaderSemanticsEnabled",
    "hiddenResultReviewPackageSemanticsEnabled"
  ]);

function consumerOwnedDisplayConformanceResultReviewPackageBoundaryInputRecord(
  input
) {
  return isPlainObjectRecord(input) ? input : null;
}

function consumerOwnedDisplayConformanceResultReviewPackageBoundaryReviewedAt(
  inputRecord
) {
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

function consumerOwnedDisplayConformanceResultReviewPackageBoundaryInputMalformed(
  inputRecord
) {
  return (
    inputRecord === null ||
    (Object.prototype.hasOwnProperty.call(inputRecord, "reviewedAt") &&
      !isUtcIsoTimestampWithMilliseconds(inputRecord.reviewedAt)) ||
    (Object.prototype.hasOwnProperty.call(inputRecord, "reviewPackageEntries") &&
      !Array.isArray(inputRecord.reviewPackageEntries))
  );
}

function consumerOwnedDisplayConformanceResultReviewPackageBoundaryInputEntries(
  inputRecord
) {
  return Array.isArray(inputRecord?.reviewPackageEntries)
    ? inputRecord.reviewPackageEntries
    : null;
}

function consumerOwnedDisplayConformanceResultReviewPackageBoundaryMissingRequiredField(
  entry
) {
  if (!isPlainObjectRecord(entry)) {
    return true;
  }

  return CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_PACKAGE_BOUNDARY_REQUIRED_FIELDS.some(
    (field) => !Object.prototype.hasOwnProperty.call(entry, field)
  );
}

function consumerOwnedDisplayConformanceResultReviewPackageBoundaryDeterminismMalformed(
  expectations
) {
  return (
    !isPlainObjectRecord(expectations) ||
    expectations.deterministicPackageBoundaryIdsRequired !== true ||
    expectations.deterministicOrderingRequired !== true ||
    expectations.deterministicAllowedFieldOrderingRequired !== true ||
    expectations.deterministicForbiddenBehaviorOrderingRequired !== true ||
    expectations.deterministicHashInputOrderingRequired !== true ||
    expectations.noClockNetworkRandomnessAllowed !== true ||
    expectations.consumerOwnedResultReviewPackageMustBeReviewOnly !== true ||
    expectations.hashDoesNotAuthorizeRuntime !== true
  );
}

function consumerOwnedDisplayConformanceResultReviewPackageBoundaryEntryMalformed(
  entry
) {
  return (
    consumerOwnedDisplayConformanceResultReviewPackageBoundaryMissingRequiredField(
      entry
    ) ||
    typeof entry.packageBoundaryId !== "string" ||
    entry.packageBoundaryId.length === 0 ||
    typeof entry.displaySurfaceId !== "string" ||
    entry.displaySurfaceId.length === 0 ||
    typeof entry.sourceArdynArtifactType !== "string" ||
    entry.sourceArdynArtifactType.length === 0 ||
    entry.reviewPackageIntent !==
      CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_PACKAGE_BOUNDARY_INTENT ||
    typeof entry.referencedPhase550SchemaBoundaryId !== "string" ||
    entry.referencedPhase550SchemaBoundaryId.length === 0 ||
    typeof entry.referencedPhase551FixtureId !== "string" ||
    entry.referencedPhase551FixtureId.length === 0 ||
    typeof entry.referencedPhase551FixtureGroup !== "string" ||
    entry.referencedPhase551FixtureGroup.length === 0 ||
    typeof entry.referencedPhase552ConformanceHandoffId !== "string" ||
    entry.referencedPhase552ConformanceHandoffId.length === 0 ||
    typeof entry.referencedPhase553RunnerRequirementId !== "string" ||
    entry.referencedPhase553RunnerRequirementId.length === 0 ||
    typeof entry.referencedPhase554TestPlanId !== "string" ||
    entry.referencedPhase554TestPlanId.length === 0 ||
    typeof entry.referencedPhase555ResultSchemaId !== "string" ||
    entry.referencedPhase555ResultSchemaId.length === 0 ||
    typeof entry.referencedPhase556ResultHandoffId !== "string" ||
    entry.referencedPhase556ResultHandoffId.length === 0 ||
    typeof entry.referencedPhase557ReviewIntakeId !== "string" ||
    entry.referencedPhase557ReviewIntakeId.length === 0 ||
    typeof entry.futureConsumerOwnedPackageResponsibility !== "string" ||
    entry.futureConsumerOwnedPackageResponsibility.length === 0 ||
    !Array.isArray(entry.allowedFutureReviewPackageFields) ||
    entry.allowedFutureReviewPackageFields.length < 8 ||
    entry.allowedFutureReviewPackageFields.some(
      (field) => typeof field !== "string" || field.length === 0
    ) ||
    !Array.isArray(entry.forbiddenCurrentArdynBehavior) ||
    entry.forbiddenCurrentArdynBehavior.length < 20 ||
    entry.forbiddenCurrentArdynBehavior.some(
      (behavior) => typeof behavior !== "string"
    ) ||
    consumerOwnedDisplayConformanceResultReviewPackageBoundaryDeterminismMalformed(
      entry.deterministicOrderingHashExpectations
    ) ||
    consumerDisplayFixtureSchemaBoundaryAccessibilityMalformed(
      entry.accessibilityWcagPackageNotes
    ) ||
    typeof entry
      .requiredFutureContractBeforePackageProductionImportExportValidationRoutingPersistenceEvaluationApprovalOrCi !==
      "string" ||
    entry
      .requiredFutureContractBeforePackageProductionImportExportValidationRoutingPersistenceEvaluationApprovalOrCi
      .length === 0 ||
    !isPlainObjectRecord(entry.explicitBlockedAuthorizationFlags) ||
    !isPlainObjectRecord(
      entry
        .unsafePackageImportExportPersistenceRunnerResultProducerResultCollectorValidatorReviewRouterEvaluatorApprovalTestHarnessRuntimeFlags
    ) ||
    entry.consumerTargetOnly !== true ||
    entry.reviewPackageCandidateMetadataOnly !== true ||
    entry.packageProducedByArdyn !== false ||
    entry.packageExportImplemented !== false ||
    entry.packageImportImplemented !== false ||
    entry.packageWriterImplemented !== false ||
    entry.packageReaderImplemented !== false ||
    entry.packagePersistenceImplemented !== false ||
    entry.packageDiscoveryImplemented !== false ||
    entry.packageDistributionImplemented !== false ||
    entry.runnerImplementedByArdyn !== false ||
    entry.resultProducerImplementedByArdyn !== false ||
    entry.resultCollectorImplementedByArdyn !== false ||
    entry.resultValidatorImplementedByArdyn !== false ||
    entry.reviewRouterImplementedByArdyn !== false ||
    entry.evaluatorImplementedByArdyn !== false ||
    entry.approvalPathImplementedByArdyn !== false ||
    entry.approvalDecisionProducedByArdyn !== false ||
    entry.approvalGrantProducedByArdyn !== false ||
    entry.testHarnessImplementedByArdyn !== false ||
    entry.importExportCommandImplemented !== false ||
    entry.browserRenderingHarnessImplemented !== false ||
    entry.consumerSideCiImplemented !== false ||
    entry.fixtureDiscoveryRuntimeImplemented !== false ||
    entry.consumerRepoModifiedByArdyn !== false ||
    entry.nonAuthorizingProof !== true
  );
}

function consumerOwnedDisplayConformanceResultReviewPackageBoundaryContainsEntryIssue(
  entries,
  predicate
) {
  return entries !== null && entries.some((entry) => predicate(entry));
}

function consumerOwnedDisplayConformanceResultReviewPackageBoundaryAuthorizationFlagEnabled(
  entry
) {
  return (
    consumerDisplayAccessibilityContractMapContainsTrue(
      entry?.explicitBlockedAuthorizationFlags
    ) ||
    consumerDisplayAccessibilityContractMapContainsTrue(
      entry?.blockedAuthorizationFlags
    ) ||
    consumerDisplayAccessibilityContractMapContainsTrue(entry?.authorizationFlags)
  );
}

function consumerOwnedDisplayConformanceResultReviewPackageBoundaryUnsafeFlagEnabled(
  entry
) {
  return (
    consumerDisplayAccessibilityContractMapContainsTrue(
      entry
        ?.unsafePackageImportExportPersistenceRunnerResultProducerResultCollectorValidatorReviewRouterEvaluatorApprovalTestHarnessRuntimeFlags
    ) ||
    consumerDisplayAccessibilityContractMapFieldTruePresent(
      entry,
      CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_PACKAGE_BOUNDARY_UNSAFE_FIELDS
    )
  );
}

function consumerOwnedDisplayConformanceResultReviewPackageBoundaryTopLevelFieldTruePresent(
  entry,
  fields
) {
  return (
    isPlainObjectRecord(entry) &&
    fields.some((field) => entry[field] === true)
  );
}

function consumerOwnedDisplayConformanceResultReviewPackageBoundaryRecursiveUnsafeFlagEnabled(
  entry
) {
  return (
    CONSUMER_DISPLAY_ACCESSIBILITY_CONTRACT_MAP_UNSAFE_FIELD_GROUPS.some(
      ({ fields }) =>
        consumerDisplayAccessibilityContractMapFieldTruePresent(entry, fields)
    ) ||
    consumerDisplayAccessibilityContractMapContainsTrue(entry?.runtimeEffect)
  );
}

function consumerOwnedDisplayConformanceResultReviewPackageBoundaryReferenceValid(
  entry
) {
  const reviewIntakeEntry =
    consumerOwnedDisplayConformanceResultReviewIntakeBoundaryEntries().find(
      ({ intakeId }) => intakeId === entry?.referencedPhase557ReviewIntakeId
    );

  return (
    reviewIntakeEntry !== undefined &&
    reviewIntakeEntry.referencedPhase550SchemaBoundaryId ===
      entry.referencedPhase550SchemaBoundaryId &&
    reviewIntakeEntry.referencedPhase551FixtureId ===
      entry.referencedPhase551FixtureId &&
    reviewIntakeEntry.referencedPhase551FixtureGroup ===
      entry.referencedPhase551FixtureGroup &&
    reviewIntakeEntry.referencedPhase552ConformanceHandoffId ===
      entry.referencedPhase552ConformanceHandoffId &&
    reviewIntakeEntry.referencedPhase553RunnerRequirementId ===
      entry.referencedPhase553RunnerRequirementId &&
    reviewIntakeEntry.referencedPhase554TestPlanId ===
      entry.referencedPhase554TestPlanId &&
    reviewIntakeEntry.referencedPhase555ResultSchemaId ===
      entry.referencedPhase555ResultSchemaId &&
    reviewIntakeEntry.referencedPhase556ResultHandoffId ===
      entry.referencedPhase556ResultHandoffId &&
    reviewIntakeEntry.consumerName === entry.consumerName &&
    reviewIntakeEntry.displaySurfaceId === entry.displaySurfaceId &&
    reviewIntakeEntry.sourceArdynArtifactType === entry.sourceArdynArtifactType
  );
}

function consumerOwnedDisplayConformanceResultReviewPackageBoundaryEntriesCanonical(
  entries
) {
  if (entries === null) {
    return true;
  }

  return (
    JSON.stringify(entries) ===
    JSON.stringify(consumerOwnedDisplayConformanceResultReviewPackageBoundaryEntries())
  );
}

function consumerOwnedDisplayConformanceResultReviewPackageBoundaryInputClassification(
  inputRecord
) {
  if (
    consumerOwnedDisplayConformanceResultReviewPackageBoundaryInputMalformed(
      inputRecord
    )
  ) {
    return MALFORMED_CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_PACKAGE_BOUNDARY_CLASSIFICATION;
  }

  const entries =
    consumerOwnedDisplayConformanceResultReviewPackageBoundaryInputEntries(
      inputRecord
    );

  if (
    consumerOwnedDisplayConformanceResultReviewPackageBoundaryContainsEntryIssue(
      entries,
      consumerOwnedDisplayConformanceResultReviewPackageBoundaryMissingRequiredField
    )
  ) {
    return "missing_required_consumer_owned_display_conformance_result_review_package_boundary_entry_rejected";
  }

  if (
    consumerOwnedDisplayConformanceResultReviewPackageBoundaryContainsEntryIssue(
      entries,
      (entry) => entry.consumerName !== "Locus" && entry.consumerName !== "Multiverse"
    )
  ) {
    return "unknown_consumer_name_consumer_owned_display_conformance_result_review_package_boundary_input_rejected";
  }

  if (
    consumerOwnedDisplayConformanceResultReviewPackageBoundaryContainsEntryIssue(
      entries,
      (entry) =>
        [
          "interactive",
          "actionable",
          "runtime_action",
          "command_action",
          "package_export",
          "package_import",
          "package_writer",
          "package_reader",
          "package_persistence",
          "package_discovery",
          "package_distribution",
          "result_package",
          "result_producer",
          "result_collector",
          "result_validator",
          "review_router",
          "evaluator",
          "approval_decision",
          "approval_grant",
          "test_harness",
          "executable_runner",
          "executable_result",
          "executable_package",
          "result_intake"
        ].includes(entry.reviewPackageIntent)
    )
  ) {
    return "interactive_actionable_intent_consumer_owned_display_conformance_result_review_package_boundary_input_rejected";
  }

  if (
    consumerOwnedDisplayConformanceResultReviewPackageBoundaryContainsEntryIssue(
      entries,
      (entry) =>
        entry.reviewPackageIntent !==
        CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_PACKAGE_BOUNDARY_INTENT
    )
  ) {
    return "unknown_review_package_intent_consumer_owned_display_conformance_result_review_package_boundary_input_rejected";
  }

  if (
    consumerOwnedDisplayConformanceResultReviewPackageBoundaryContainsEntryIssue(
      entries,
      (entry) =>
        consumerOwnedDisplayConformanceResultReviewPackageBoundaryTopLevelFieldTruePresent(
          entry,
          CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_PACKAGE_BOUNDARY_IMPLEMENTATION_FIELDS
        )
    ) ||
    consumerOwnedDisplayConformanceResultReviewPackageBoundaryTopLevelFieldTruePresent(
      inputRecord,
      CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_PACKAGE_BOUNDARY_IMPLEMENTATION_FIELDS
    )
  ) {
    return "package_import_export_persistence_runner_result_producer_result_collector_validator_review_router_evaluator_approval_test_harness_implementation_semantics_consumer_owned_display_conformance_result_review_package_boundary_input_rejected";
  }

  if (
    consumerOwnedDisplayConformanceResultReviewPackageBoundaryContainsEntryIssue(
      entries,
      consumerOwnedDisplayConformanceResultReviewPackageBoundaryEntryMalformed
    )
  ) {
    return MALFORMED_CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_PACKAGE_BOUNDARY_CLASSIFICATION;
  }

  if (
    consumerOwnedDisplayConformanceResultReviewPackageBoundaryContainsEntryIssue(
      entries,
      consumerOwnedDisplayConformanceResultReviewPackageBoundaryAuthorizationFlagEnabled
    ) ||
    consumerOwnedDisplayConformanceResultReviewPackageBoundaryAuthorizationFlagEnabled(
      inputRecord
    )
  ) {
    return "authorization_flags_enabled_consumer_owned_display_conformance_result_review_package_boundary_input_rejected";
  }

  if (
    consumerOwnedDisplayConformanceResultReviewPackageBoundaryContainsEntryIssue(
      entries,
      (entry) =>
        consumerDisplayAccessibilityContractMapFieldTruePresent(
          entry,
          CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_PACKAGE_BOUNDARY_HIDDEN_FIELDS
        )
    ) ||
    consumerDisplayAccessibilityContractMapFieldTruePresent(
      inputRecord,
      CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_PACKAGE_BOUNDARY_HIDDEN_FIELDS
    )
  ) {
    return "hidden_package_import_export_persistence_runner_result_producer_result_collector_validator_review_router_evaluator_approval_test_harness_runtime_semantics_consumer_owned_display_conformance_result_review_package_boundary_input_rejected";
  }

  if (
    consumerOwnedDisplayConformanceResultReviewPackageBoundaryContainsEntryIssue(
      entries,
      (entry) =>
        consumerDisplayAccessibilityContractMapFieldTruePresent(
          entry,
          CONSUMER_DISPLAY_FIXTURE_SCHEMA_BOUNDARY_SECURE_DROP_FIELDS
        )
    ) ||
    consumerDisplayAccessibilityContractMapFieldTruePresent(
      inputRecord,
      CONSUMER_DISPLAY_FIXTURE_SCHEMA_BOUNDARY_SECURE_DROP_FIELDS
    )
  ) {
    return "secure_drop_implementation_semantics_consumer_owned_display_conformance_result_review_package_boundary_input_rejected";
  }

  if (
    consumerOwnedDisplayConformanceResultReviewPackageBoundaryContainsEntryIssue(
      entries,
      (entry) =>
        consumerDisplayAccessibilityContractMapFieldTruePresent(
          entry,
          CONSUMER_DISPLAY_FIXTURE_SCHEMA_BOUNDARY_RUNTIME_SURFACE_FIELDS
        )
    ) ||
    consumerDisplayAccessibilityContractMapFieldTruePresent(
      inputRecord,
      CONSUMER_DISPLAY_FIXTURE_SCHEMA_BOUNDARY_RUNTIME_SURFACE_FIELDS
    )
  ) {
    return "websocket_http_fabric_mcp_task_execution_semantics_consumer_owned_display_conformance_result_review_package_boundary_input_rejected";
  }

  if (
    consumerOwnedDisplayConformanceResultReviewPackageBoundaryContainsEntryIssue(
      entries,
      consumerOwnedDisplayConformanceResultReviewPackageBoundaryRecursiveUnsafeFlagEnabled
    ) ||
    consumerOwnedDisplayConformanceResultReviewPackageBoundaryRecursiveUnsafeFlagEnabled(
      inputRecord
    )
  ) {
    return "nested_unsafe_flags_consumer_owned_display_conformance_result_review_package_boundary_input_rejected";
  }

  if (
    consumerOwnedDisplayConformanceResultReviewPackageBoundaryContainsEntryIssue(
      entries,
      consumerOwnedDisplayConformanceResultReviewPackageBoundaryUnsafeFlagEnabled
    ) ||
    consumerOwnedDisplayConformanceResultReviewPackageBoundaryUnsafeFlagEnabled(
      inputRecord
    )
  ) {
    return "unsafe_package_import_export_persistence_runner_result_producer_result_collector_validator_review_router_evaluator_approval_test_harness_runtime_flags_consumer_owned_display_conformance_result_review_package_boundary_input_rejected";
  }

  if (
    consumerOwnedDisplayConformanceResultReviewPackageBoundaryContainsEntryIssue(
      entries,
      (entry) =>
        !consumerOwnedDisplayConformanceResultReviewPackageBoundaryReferenceValid(
          entry
        )
    )
  ) {
    return "unknown_reference_consumer_owned_display_conformance_result_review_package_boundary_input_rejected";
  }

  if (
    !consumerOwnedDisplayConformanceResultReviewPackageBoundaryEntriesCanonical(
      entries
    )
  ) {
    return "noncanonical_consumer_owned_display_conformance_result_review_package_boundary_input_rejected";
  }

  return VALID_CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_PACKAGE_BOUNDARY_CLASSIFICATION;
}

function consumerOwnedDisplayConformanceResultReviewPackageBoundaryUnsafeFlags() {
  return {
    ...consumerOwnedDisplayConformanceResultReviewIntakeBoundaryUnsafeFlags(),
    packageExportEnabled: false,
    packageExportImplemented: false,
    packageImportEnabled: false,
    packageImportImplemented: false,
    packageWriterEnabled: false,
    packageWriterImplemented: false,
    packageReaderEnabled: false,
    packageReaderImplemented: false,
    packagePersistenceEnabled: false,
    packagePersistenceImplemented: false,
    packageDiscoveryEnabled: false,
    packageDiscoveryImplemented: false,
    packageDistributionEnabled: false,
    packageDistributionImplemented: false,
    packageProducedByArdyn: false,
    resultReviewPackageEnabled: false,
    resultReviewPackageProduced: false,
    resultReviewPackageExportEnabled: false,
    resultReviewPackageImportEnabled: false,
    resultReviewPackageValidationEnabled: false,
    resultReviewPackageRoutingEnabled: false,
    resultReviewPackagePersistenceEnabled: false,
    resultReviewPackageEvaluationEnabled: false,
    resultReviewPackageApprovalEnabled: false,
    resultReviewPackageCiEnabled: false,
    resultReviewPackageRuntimeEnabled: false,
    consumerPackageWriterImplemented: false,
    consumerPackageReaderImplemented: false,
    consumerPackagePersistenceImplemented: false,
    hiddenPackageSemanticsEnabled: false,
    hiddenPackageImportSemanticsEnabled: false,
    hiddenPackageExportSemanticsEnabled: false,
    hiddenPackagePersistenceSemanticsEnabled: false,
    hiddenPackageWriterSemanticsEnabled: false,
    hiddenPackageReaderSemanticsEnabled: false,
    hiddenResultReviewPackageSemanticsEnabled: false
  };
}

function consumerOwnedDisplayConformanceResultReviewPackageBoundaryDefinitions() {
  return consumerOwnedDisplayConformanceResultReviewIntakeBoundaryEntries().map(
    (reviewIntakeEntry) => ({
      reviewIntakeEntry,
      packageBoundaryId: reviewIntakeEntry.intakeId
        .replace("phase5-57.", "phase5-58.")
        .replace(".result-review-intake", ".result-review-package")
    })
  );
}

function consumerOwnedDisplayConformanceResultReviewPackageBoundaryAllowedFields() {
  return [
    "packageBoundaryId",
    "consumerName",
    "displaySurfaceId",
    "sourceArdynArtifactType",
    "referencedPhase557ReviewIntakeId",
    "resultConformanceSummary",
    "accessibilityWcagSummary",
    "deterministicHashInput",
    "nonAuthorizingProof",
    "blockedRuntimeProof"
  ];
}

function consumerOwnedDisplayConformanceResultReviewPackageBoundaryForbiddenCurrentArdynBehavior() {
  return [
    "produce review packages",
    "write review packages",
    "read review packages",
    "persist review packages",
    "discover review packages",
    "distribute review packages",
    "import review packages",
    "export review packages",
    "validate review packages",
    "route review packages",
    "produce conformance results",
    "collect conformance results",
    "validate conformance results",
    "execute evaluators",
    "produce approval decisions",
    "produce approval grants",
    "run test harnesses",
    "run consumer-side CI",
    "render UI/browser/WCAG automation",
    "modify Locus or Multiverse repositories",
    "start runtime, command, connector, Fabric, websocket/http, MCP, task, Secure Drop, service-discovery, schedule, filesystem, process, or external lookup behavior"
  ];
}

function consumerOwnedDisplayConformanceResultReviewPackageBoundaryEntry({
  reviewIntakeEntry,
  packageBoundaryId
}) {
  const consumerSlug = reviewIntakeEntry.consumerName.toLowerCase();

  return {
    packageBoundaryId,
    consumerName: reviewIntakeEntry.consumerName,
    displaySurfaceId: reviewIntakeEntry.displaySurfaceId,
    sourceArdynArtifactType: reviewIntakeEntry.sourceArdynArtifactType,
    reviewPackageIntent:
      CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_PACKAGE_BOUNDARY_INTENT,
    referencedPhase550SchemaBoundaryId:
      reviewIntakeEntry.referencedPhase550SchemaBoundaryId,
    referencedPhase551FixtureId: reviewIntakeEntry.referencedPhase551FixtureId,
    referencedPhase551FixtureGroup:
      reviewIntakeEntry.referencedPhase551FixtureGroup,
    referencedPhase552ConformanceHandoffId:
      reviewIntakeEntry.referencedPhase552ConformanceHandoffId,
    referencedPhase553RunnerRequirementId:
      reviewIntakeEntry.referencedPhase553RunnerRequirementId,
    referencedPhase554TestPlanId:
      reviewIntakeEntry.referencedPhase554TestPlanId,
    referencedPhase555ResultSchemaId:
      reviewIntakeEntry.referencedPhase555ResultSchemaId,
    referencedPhase556ResultHandoffId:
      reviewIntakeEntry.referencedPhase556ResultHandoffId,
    referencedPhase557ReviewIntakeId: reviewIntakeEntry.intakeId,
    futureConsumerOwnedPackageResponsibility:
      `Future ${reviewIntakeEntry.consumerName}-owned package tooling may define a deterministic review package shape for ${reviewIntakeEntry.displaySurfaceId} only after a separate consumer-owned package, provenance, validation, persistence, routing, and CI contract exists outside Ardyn.`,
    allowedFutureReviewPackageFields:
      consumerOwnedDisplayConformanceResultReviewPackageBoundaryAllowedFields(),
    forbiddenCurrentArdynBehavior:
      consumerOwnedDisplayConformanceResultReviewPackageBoundaryForbiddenCurrentArdynBehavior(),
    deterministicOrderingHashExpectations: {
      deterministicPackageBoundaryIdsRequired: true,
      deterministicOrderingRequired: true,
      deterministicAllowedFieldOrderingRequired: true,
      deterministicForbiddenBehaviorOrderingRequired: true,
      deterministicHashInputOrderingRequired: true,
      noClockNetworkRandomnessAllowed: true,
      consumerOwnedResultReviewPackageMustBeReviewOnly: true,
      hashDoesNotAuthorizeRuntime: true
    },
    accessibilityWcagPackageNotes: {
      ...reviewIntakeEntry.accessibilityWcagIntakeNotes,
      resultReviewPackageMustRemainReadableWithoutColorOrMotion: true,
      resultReviewPackageMustUseStaticAccessibleLabels: true,
      resultReviewPackageMustNotExposeHiddenActionSemantics: true,
      reviewPackageCandidateMustStayMetadataOnly: true
    },
    requiredFutureContractBeforePackageProductionImportExportValidationRoutingPersistenceEvaluationApprovalOrCi:
      `A separate consumer-owned executable package contract for ${consumerSlug} is required before package production, import, export, validation, routing, persistence, evaluation, approval, package distribution, or CI exists outside this review-only boundary.`,
    explicitBlockedAuthorizationFlags:
      consumerDisplayAccessibilityAuthorizationFlags(),
    unsafePackageImportExportPersistenceRunnerResultProducerResultCollectorValidatorReviewRouterEvaluatorApprovalTestHarnessRuntimeFlags:
      consumerOwnedDisplayConformanceResultReviewPackageBoundaryUnsafeFlags(),
    consumerTargetOnly: true,
    reviewPackageCandidateMetadataOnly: true,
    packageProducedByArdyn: false,
    packageExportImplemented: false,
    packageImportImplemented: false,
    packageWriterImplemented: false,
    packageReaderImplemented: false,
    packagePersistenceImplemented: false,
    packageDiscoveryImplemented: false,
    packageDistributionImplemented: false,
    runnerImplementedByArdyn: false,
    resultProducerImplementedByArdyn: false,
    resultCollectorImplementedByArdyn: false,
    resultImporterImplementedByArdyn: false,
    resultExporterImplementedByArdyn: false,
    resultValidatorImplementedByArdyn: false,
    reviewRouterImplementedByArdyn: false,
    evaluatorImplementedByArdyn: false,
    approvalPathImplementedByArdyn: false,
    approvalDecisionProducedByArdyn: false,
    approvalGrantProducedByArdyn: false,
    testHarnessImplementedByArdyn: false,
    importExportCommandImplemented: false,
    browserRenderingHarnessImplemented: false,
    consumerSideCiImplemented: false,
    fixtureDiscoveryRuntimeImplemented: false,
    consumerRepoModifiedByArdyn: false,
    nonAuthorizingProof: true,
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

function consumerOwnedDisplayConformanceResultReviewPackageBoundaryEntries() {
  return consumerOwnedDisplayConformanceResultReviewPackageBoundaryDefinitions().map(
    consumerOwnedDisplayConformanceResultReviewPackageBoundaryEntry
  );
}

function consumerOwnedDisplayConformanceResultReviewPackageBoundarySummary(
  entries
) {
  const locusReviewPackageEntryCount = entries.filter(
    ({ consumerName }) => consumerName === "Locus"
  ).length;
  const multiverseReviewPackageEntryCount = entries.filter(
    ({ consumerName }) => consumerName === "Multiverse"
  ).length;

  return {
    reviewPackageBoundaryKind:
      CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_PACKAGE_BOUNDARY_KIND,
    reviewPackageEntryCount: entries.length,
    locusReviewPackageEntryCount,
    multiverseReviewPackageEntryCount,
    consumerNames: ["Locus", "Multiverse"],
    reviewPackageIntent:
      CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_PACKAGE_BOUNDARY_INTENT,
    reviewPackageMeansMetadataOnlyCandidatePackageShape: true,
    deterministicPackageBoundaryIds: entries.map(
      ({ packageBoundaryId }) => packageBoundaryId
    ),
    referencedPhase557ReviewIntakeIds: entries.map(
      ({ referencedPhase557ReviewIntakeId }) => referencedPhase557ReviewIntakeId
    ),
    referencedPhase556ResultHandoffIds: entries.map(
      ({ referencedPhase556ResultHandoffId }) =>
        referencedPhase556ResultHandoffId
    ),
    referencedPhase555ResultSchemaIds: entries.map(
      ({ referencedPhase555ResultSchemaId }) => referencedPhase555ResultSchemaId
    ),
    referencesPhase550SchemaBoundary: entries.every(
      ({ referencedPhase550SchemaBoundaryId }) =>
        referencedPhase550SchemaBoundaryId.startsWith("phase5-50.")
    ),
    referencesPhase551ExamplePack: entries.every(
      ({ referencedPhase551FixtureId }) =>
        referencedPhase551FixtureId.startsWith("phase5-51.")
    ),
    referencesPhase552ConformanceHandoff: entries.every(
      ({ referencedPhase552ConformanceHandoffId }) =>
        referencedPhase552ConformanceHandoffId.startsWith("phase5-52.")
    ),
    referencesPhase553RunnerRequirements: entries.every(
      ({ referencedPhase553RunnerRequirementId }) =>
        referencedPhase553RunnerRequirementId.startsWith("phase5-53.")
    ),
    referencesPhase554TestPlan: entries.every(
      ({ referencedPhase554TestPlanId }) =>
        referencedPhase554TestPlanId.startsWith("phase5-54.")
    ),
    referencesPhase555ResultSchemaBoundary: entries.every(
      ({ referencedPhase555ResultSchemaId }) =>
        referencedPhase555ResultSchemaId.startsWith("phase5-55.")
    ),
    referencesPhase556ResultHandoff: entries.every(
      ({ referencedPhase556ResultHandoffId }) =>
        referencedPhase556ResultHandoffId.startsWith("phase5-56.")
    ),
    referencesPhase557ReviewIntakeBoundary: entries.every(
      ({ referencedPhase557ReviewIntakeId }) =>
        referencedPhase557ReviewIntakeId.startsWith("phase5-57.")
    ),
    locusAndMultiverseConsumerTargetsOnly: entries.every(
      ({ consumerTargetOnly }) => consumerTargetOnly === true
    ),
    consumerRepoModifiedByArdyn: false,
    packageProducedByArdyn: false,
    packageExportImplemented: false,
    packageImportImplemented: false,
    packageWriterImplemented: false,
    packageReaderImplemented: false,
    packagePersistenceImplemented: false,
    packageDiscoveryImplemented: false,
    packageDistributionImplemented: false,
    runnerImplementedByArdyn: false,
    resultProducerImplementedByArdyn: false,
    resultCollectorImplementedByArdyn: false,
    resultImporterImplementedByArdyn: false,
    resultExporterImplementedByArdyn: false,
    resultValidatorImplementedByArdyn: false,
    reviewRouterImplementedByArdyn: false,
    evaluatorImplementedByArdyn: false,
    approvalPathImplementedByArdyn: false,
    approvalDecisionProducedByArdyn: false,
    approvalGrantProducedByArdyn: false,
    testHarnessImplementedByArdyn: false,
    importExportCommandImplemented: false,
    consumerSideCiImplemented: false,
    fixtureDiscoveryRuntimeImplemented: false,
    browserRenderingHarnessImplemented: false,
    browserWcagAutomationImplemented: false,
    visualRegressionHarnessImplemented: false,
    screenReaderAutomationImplemented: false,
    uiFrontendBrowserRenderingImplemented: false,
    allBlockedAuthorizationFlagsFalse: entries.every(
      ({ explicitBlockedAuthorizationFlags }) =>
        Object.values(explicitBlockedAuthorizationFlags).every(
          (value) => value === false
        )
    ),
    allUnsafePackageImportExportPersistenceRunnerResultProducerResultCollectorValidatorReviewRouterEvaluatorApprovalTestHarnessRuntimeFlagsFalse:
      entries.every(
        ({
          unsafePackageImportExportPersistenceRunnerResultProducerResultCollectorValidatorReviewRouterEvaluatorApprovalTestHarnessRuntimeFlags
        }) =>
          Object.values(
            unsafePackageImportExportPersistenceRunnerResultProducerResultCollectorValidatorReviewRouterEvaluatorApprovalTestHarnessRuntimeFlags
          ).every((value) => value === false)
      ),
    allRuntimeEffectsFalse: entries.every(({ runtimeEffect }) =>
      Object.values(runtimeEffect).every((value) => value === false)
    ),
    allEntriesNonAuthorizing: entries.every(
      ({ nonAuthorizingProof }) => nonAuthorizingProof === true
    ),
    validationImplementsPackageExport: false,
    validationImplementsPackageImport: false,
    validationImplementsPackageWriter: false,
    validationImplementsPackageReader: false,
    validationImplementsPackagePersistence: false,
    validationImplementsRunner: false,
    validationImplementsResultProducer: false,
    validationImplementsResultCollector: false,
    validationImplementsResultValidator: false,
    validationImplementsReviewRouter: false,
    validationImplementsEvaluator: false,
    validationImplementsApprovalDecision: false,
    validationImplementsApprovalGrant: false,
    validationImplementsTestHarness: false,
    validationImplementsImportExportCommands: false,
    validationImplementsConsumerSideCi: false,
    validationImplementsFixtureDiscoveryRuntime: false,
    validationPerformsRendering: false,
    validationRunsBrowserWcagAutomation: false,
    validationCallsExternalConsumers: false,
    validationPerformsExternalLookups: false,
    validationScansFilesystem: false,
    validationControlsProcesses: false,
    runtimeExecutionEnabled: false,
    commandRuntimeControlEnabled: false,
    databaseStorageRuntimeWritesEnabled: false,
    secretsRuntimeIngestionEnabled: false,
    connectorGrantProduced: false,
    fabricRuntimeSurfaceEnabled: false,
    webSocketHttpSurfaceEnabled: false,
    mcpToolExposureEnabled: false,
    taskExecutionEnabled: false,
    secureDropImplemented: false,
    serviceDiscoveryEnabled: false,
    scheduleEnforcementEnabled: false,
    backgroundPollingEnabled: false,
    filesystemScanningEnabled: false,
    processControlEnabled: false
  };
}

function consumerOwnedDisplayConformanceResultReviewPackageBoundaryValidationRules() {
  return {
    referencesPhase550SchemaBoundaryRequired: true,
    referencesPhase551ExamplePackRequired: true,
    referencesPhase552ConformanceHandoffRequired: true,
    referencesPhase553RunnerRequirementsRequired: true,
    referencesPhase554TestPlanRequired: true,
    referencesPhase555ResultSchemaBoundaryRequired: true,
    referencesPhase556ResultHandoffRequired: true,
    referencesPhase557ReviewIntakeBoundaryRequired: true,
    missingRequiredFieldsFailClosed: true,
    unknownConsumerNamesFailClosed: true,
    unknownReviewPackageIntentFailsClosed: true,
    interactiveActionableIntentFailsClosed: true,
    enabledAuthorizationFlagsFailClosed: true,
    unsafePackageImportExportPersistenceRunnerResultProducerResultCollectorValidatorReviewRouterEvaluatorApprovalTestHarnessRuntimeFlagsFailClosed:
      true,
    nestedUnsafeInputFlagsFailClosed: true,
    hiddenPackageImportExportPersistenceRunnerResultProducerResultCollectorValidatorReviewRouterEvaluatorApprovalTestHarnessRuntimeSemanticsFailClosed:
      true,
    secureDropImplementationSemanticsFailClosed: true,
    websocketHttpFabricMcpTaskExecutionSemanticsFailClosed: true,
    unknownReferencesFailClosed: true,
    packageImportExportPersistenceRunnerResultProducerResultCollectorValidatorReviewRouterEvaluatorApprovalTestHarnessImplementationSemanticsFailClosed:
      true,
    canonicalReviewPackageEntriesRequired: true,
    malformedReviewPackageEntriesFailClosed: true,
    validationImplementsPackageExport: false,
    validationImplementsPackageImport: false,
    validationImplementsPackageWriter: false,
    validationImplementsPackageReader: false,
    validationImplementsPackagePersistence: false,
    validationImplementsRunner: false,
    validationImplementsResultProducer: false,
    validationImplementsResultCollector: false,
    validationImplementsResultValidator: false,
    validationImplementsReviewRouter: false,
    validationImplementsEvaluator: false,
    validationImplementsApprovalDecision: false,
    validationImplementsApprovalGrant: false,
    validationImplementsTestHarness: false,
    validationImplementsImportExportCommands: false,
    validationImplementsConsumerSideCi: false,
    validationImplementsFixtureDiscoveryRuntime: false,
    validationPerformsRendering: false,
    validationRunsBrowserWcagAutomation: false,
    validationCallsExternalConsumers: false,
    validationPerformsExternalLookups: false,
    validationScansFilesystem: false,
    validationControlsProcesses: false
  };
}

function consumerOwnedDisplayConformanceResultReviewPackageBoundaryGaps() {
  return [
    "The review package boundary is static metadata only; no Locus or Multiverse consumer-owned review package producer, importer, exporter, validator, router, persistence layer, evaluator, approval path, runner, or test harness exists in Ardyn.",
    "No package writer, package reader, package export, package import, package discovery, package distribution, consumer-side CI implementation, or fixture discovery runtime exists.",
    "No browser, rendering, WCAG automation, visual regression, or screen-reader QA harness exists in Ardyn.",
    "No consumer repository integration exists; Locus and Multiverse remain target consumers only.",
    "Secure Drop, registry, websocket/http, Fabric, MCP, task execution, service discovery, scheduling, filesystem, process, and external lookup behavior remain blocked."
  ];
}

function consumerOwnedDisplayConformanceResultReviewPackageBoundaryState(
  reviewedAt
) {
  const reviewPackageEntries =
    consumerOwnedDisplayConformanceResultReviewPackageBoundaryEntries();

  return {
    schema:
      CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_PACKAGE_BOUNDARY_STATE_SCHEMA,
    schemaVersion:
      CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_PACKAGE_BOUNDARY_VERSION,
    stateKind:
      "consumer-owned-display-conformance-result-review-package-boundary-state",
    stateMode: "review-only",
    reviewedAt,
    sourcePhaseContext: {
      precedingSchemaBoundaryPhase: "5.50",
      precedingSchemaBoundaryArtifact:
        "tests/fixtures/host-policy/phase5-50/consumer-display-fixture-schema-boundary.json",
      precedingExamplePackPhase: "5.51",
      precedingExamplePackArtifact:
        "tests/fixtures/host-policy/phase5-51/consumer-display-fixture-example-pack.json",
      precedingConformanceHandoffPhase: "5.52",
      precedingConformanceHandoffArtifact:
        "tests/fixtures/host-policy/phase5-52/consumer-display-fixture-conformance-handoff.json",
      precedingRunnerRequirementsPhase: "5.53",
      precedingRunnerRequirementsArtifact:
        "tests/fixtures/host-policy/phase5-53/consumer-owned-display-conformance-runner-requirements.json",
      precedingTestPlanPhase: "5.54",
      precedingTestPlanArtifact:
        "tests/fixtures/host-policy/phase5-54/consumer-owned-display-conformance-runner-test-plan.json",
      precedingResultSchemaBoundaryPhase: "5.55",
      precedingResultSchemaBoundaryArtifact:
        "tests/fixtures/host-policy/phase5-55/consumer-owned-display-conformance-runner-result-schema-boundary.json",
      precedingResultHandoffPhase: "5.56",
      precedingResultHandoffArtifact:
        "tests/fixtures/host-policy/phase5-56/consumer-owned-display-conformance-result-handoff.json",
      precedingReviewIntakeBoundaryPhase: "5.57",
      precedingReviewIntakeBoundaryArtifact:
        "tests/fixtures/host-policy/phase5-57/consumer-owned-display-conformance-result-review-intake-boundary.json",
      phase550ConsumerDisplayFixtureSchemaBoundaryReferenceOnly: true,
      phase551ConsumerDisplayFixtureExamplePackReferenceOnly: true,
      phase552ConsumerDisplayFixtureConformanceHandoffReferenceOnly: true,
      phase553ConsumerOwnedDisplayConformanceRunnerRequirementsReferenceOnly: true,
      phase554ConsumerOwnedDisplayConformanceRunnerTestPlanReferenceOnly: true,
      phase555ConsumerOwnedDisplayConformanceRunnerResultSchemaBoundaryReferenceOnly:
        true,
      phase556ConsumerOwnedDisplayConformanceResultHandoffReferenceOnly: true,
      phase557ConsumerOwnedDisplayConformanceResultReviewIntakeBoundaryReferenceOnly:
        true,
      reviewPackageMeansMetadataOnlyCandidatePackageShape: true,
      ardynOwnsConsumerUi: false,
      packageWriterImplementedByArdyn: false,
      packageReaderImplementedByArdyn: false,
      packagePersistenceImplementedByArdyn: false,
      packageExportImplementedByArdyn: false,
      packageImportImplementedByArdyn: false,
      consumerRunnerImplementedByArdyn: false,
      resultProducerImplementedByArdyn: false,
      resultCollectorImplementedByArdyn: false,
      resultValidatorImplementedByArdyn: false,
      reviewRouterImplementedByArdyn: false,
      evaluatorImplementedByArdyn: false,
      approvalPathImplementedByArdyn: false,
      testHarnessImplementedByArdyn: false,
      importExportCommandImplementedByArdyn: false,
      consumerSideCiImplementedByArdyn: false,
      consumerRepoModifiedByArdyn: false
    },
    reviewPackageEntries,
    reviewPackageSummary:
      consumerOwnedDisplayConformanceResultReviewPackageBoundarySummary(
        reviewPackageEntries
      ),
    phase550SchemaBoundaryReference: {
      sourceBoundarySchema: CONSUMER_DISPLAY_FIXTURE_SCHEMA_BOUNDARY_SCHEMA,
      sourceBoundaryFixture:
        "tests/fixtures/host-policy/phase5-50/consumer-display-fixture-schema-boundary.json",
      validationHelper:
        "createConsumerDisplayFixtureSchemaBoundaryForReview",
      referencedByReviewPackageBoundary: true,
      validationStartsRuntime: false,
      validationPerformsRendering: false,
      validationCallsConsumers: false
    },
    phase551ExamplePackReference: {
      sourceExamplePackSchema: CONSUMER_DISPLAY_FIXTURE_EXAMPLE_PACK_SCHEMA,
      sourceExamplePackFixture:
        "tests/fixtures/host-policy/phase5-51/consumer-display-fixture-example-pack.json",
      validationHelper:
        "createConsumerDisplayFixtureExamplePackForReview",
      referencedByReviewPackageBoundary: true,
      validationStartsRuntime: false,
      validationPerformsRendering: false,
      validationCallsConsumers: false
    },
    phase552ConformanceHandoffReference: {
      sourceHandoffSchema: CONSUMER_DISPLAY_FIXTURE_CONFORMANCE_HANDOFF_SCHEMA,
      sourceHandoffFixture:
        "tests/fixtures/host-policy/phase5-52/consumer-display-fixture-conformance-handoff.json",
      validationHelper:
        "createConsumerDisplayFixtureConformanceHandoffForReview",
      referencedByReviewPackageBoundary: true,
      validationStartsRuntime: false,
      validationPerformsRendering: false,
      validationCallsConsumers: false
    },
    phase553RunnerRequirementsReference: {
      sourceRunnerRequirementsSchema:
        CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_REQUIREMENTS_SCHEMA,
      sourceRunnerRequirementsFixture:
        "tests/fixtures/host-policy/phase5-53/consumer-owned-display-conformance-runner-requirements.json",
      validationHelper:
        "createConsumerOwnedDisplayConformanceRunnerRequirementsForReview",
      referencedByReviewPackageBoundary: true,
      validationStartsRuntime: false,
      validationPerformsRendering: false,
      validationCallsConsumers: false
    },
    phase554TestPlanReference: {
      sourceTestPlanSchema:
        CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_TEST_PLAN_SCHEMA,
      sourceTestPlanFixture:
        "tests/fixtures/host-policy/phase5-54/consumer-owned-display-conformance-runner-test-plan.json",
      validationHelper:
        "createConsumerOwnedDisplayConformanceRunnerTestPlanForReview",
      referencedByReviewPackageBoundary: true,
      validationStartsRuntime: false,
      validationPerformsRendering: false,
      validationCallsConsumers: false
    },
    phase555ResultSchemaBoundaryReference: {
      sourceResultSchemaBoundarySchema:
        CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_RESULT_SCHEMA_BOUNDARY_SCHEMA,
      sourceResultSchemaBoundaryFixture:
        "tests/fixtures/host-policy/phase5-55/consumer-owned-display-conformance-runner-result-schema-boundary.json",
      validationHelper:
        "createConsumerOwnedDisplayConformanceRunnerResultSchemaBoundaryForReview",
      referencedByReviewPackageBoundary: true,
      validationStartsRuntime: false,
      validationProducesResults: false,
      validationCollectsResults: false,
      validationValidatesResults: false,
      validationRoutesReview: false,
      validationRunsEvaluators: false,
      validationApprovesResults: false,
      validationPerformsRendering: false,
      validationCallsConsumers: false
    },
    phase556ResultHandoffReference: {
      sourceResultHandoffSchema:
        CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_HANDOFF_SCHEMA,
      sourceResultHandoffFixture:
        "tests/fixtures/host-policy/phase5-56/consumer-owned-display-conformance-result-handoff.json",
      validationHelper:
        "createConsumerOwnedDisplayConformanceResultHandoffForReview",
      referencedByReviewPackageBoundary: true,
      validationStartsRuntime: false,
      validationProducesResults: false,
      validationCollectsResults: false,
      validationImportsExportsResults: false,
      validationValidatesResults: false,
      validationRoutesReview: false,
      validationRunsEvaluators: false,
      validationApprovesResults: false,
      validationPerformsRendering: false,
      validationCallsConsumers: false
    },
    phase557ReviewIntakeBoundaryReference: {
      sourceReviewIntakeBoundarySchema:
        CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_INTAKE_BOUNDARY_SCHEMA,
      sourceReviewIntakeBoundaryFixture:
        "tests/fixtures/host-policy/phase5-57/consumer-owned-display-conformance-result-review-intake-boundary.json",
      validationHelper:
        "createConsumerOwnedDisplayConformanceResultReviewIntakeBoundaryForReview",
      referencedByReviewPackageBoundary: true,
      validationStartsRuntime: false,
      validationProducesPackages: false,
      validationImportsExportsPackages: false,
      validationPersistsPackages: false,
      validationValidatesPackages: false,
      validationRoutesReview: false,
      validationRunsEvaluators: false,
      validationApprovesResults: false,
      validationPerformsRendering: false,
      validationCallsConsumers: false
    },
    invalidReviewPackageCasePolicy:
      consumerOwnedDisplayConformanceResultReviewPackageBoundaryValidationRules(),
    topDisplayConformanceResultReviewPackageGaps:
      consumerOwnedDisplayConformanceResultReviewPackageBoundaryGaps(),
    recommendedNextPhase:
      "phase-5.59-review-only-api-backend-contract-boundary-map",
    consumerOwnedDisplayConformanceResultReviewPackageBoundaryOnly: true,
    reviewPackageCandidateMetadataOnly: true,
    reviewOnly: true,
    authoritative: false,
    reviewArtifactOnly: true,
    nonAuthorizingProof: true,
    ...consumerDisplayAccessibilityForbiddenBehavior(),
    renderingCodeImplemented: false,
    browserRenderingHarnessImplemented: false,
    packageProducedByArdyn: false,
    packageExportImplemented: false,
    packageImportImplemented: false,
    packageWriterImplemented: false,
    packageReaderImplemented: false,
    packagePersistenceImplemented: false,
    packageDiscoveryImplemented: false,
    packageDistributionImplemented: false,
    runnerImplementedByArdyn: false,
    resultProducerImplementedByArdyn: false,
    resultCollectorImplementedByArdyn: false,
    resultImporterImplementedByArdyn: false,
    resultExporterImplementedByArdyn: false,
    resultValidatorImplementedByArdyn: false,
    reviewRouterImplementedByArdyn: false,
    evaluatorImplementedByArdyn: false,
    approvalPathImplementedByArdyn: false,
    approvalDecisionProducedByArdyn: false,
    approvalGrantProducedByArdyn: false,
    testHarnessImplementedByArdyn: false,
    consumerOwnedRunnerImplemented: false,
    consumerConformanceRunnerImplemented: false,
    fixtureImportCommandImplemented: false,
    fixtureExportCommandImplemented: false,
    fixtureImportExportCommandsImplemented: false,
    importExportCommandImplemented: false,
    consumerSideCiImplemented: false,
    fixtureDiscoveryRuntimeImplemented: false,
    consumerRepoModifiedByArdyn: false,
    browserWcagAutomationImplemented: false,
    visualRegressionHarnessImplemented: false,
    screenReaderAutomationImplemented: false,
    reviewerRoutingPerformed: false,
    reviewerAssignmentPerformed: false,
    evaluatorExecutionPerformed: false,
    evaluatorResultProduced: false,
    approvalDecisionProduced: false,
    approvalGrantProduced: false,
    approvalGrantPersisted: false,
    externalLookupsEnabled: false,
    filesystemScanningEnabled: false,
    processControlEnabled: false,
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

function consumerOwnedDisplayConformanceResultReviewPackageBoundaryRejectionReasons({
  accepted,
  classification
}) {
  const reasons = [
    "consumer_owned_display_conformance_result_review_package_boundary_is_review_only",
    "review_package_entries_are_metadata_only_candidate_package_shapes",
    "references_phase_5_50_schema_boundary",
    "references_phase_5_51_example_pack",
    "references_phase_5_52_conformance_handoff",
    "references_phase_5_53_runner_requirements",
    "references_phase_5_54_test_plan",
    "references_phase_5_55_result_schema_boundary",
    "references_phase_5_56_result_handoff",
    "references_phase_5_57_review_intake_boundary",
    "ardyn_does_not_implement_package_export_import_writer_reader_persistence_runner_result_producer_result_collector_result_validator_review_router_evaluator_approval_test_harness_import_export_ci_ui_browser_rendering_or_consumer_repo_changes",
    "runtime_command_db_storage_secrets_connector_fabric_websocket_http_mcp_task_secure_drop_service_discovery_schedule_filesystem_process_authorizations_false",
    "unsafe_package_import_export_persistence_runner_result_producer_result_collector_validator_review_router_evaluator_approval_test_harness_runtime_flags_fail_closed",
    "fallow_runtime_not_used",
    "runtime_enablement_still_blocked"
  ];

  return accepted
    ? reasons
    : [
        ...reasons,
        `input_classification_${classification}`,
        "consumer_owned_display_conformance_result_review_package_boundary_not_produced"
      ];
}

function consumerOwnedDisplayConformanceResultReviewPackageBoundaryResult({
  reviewedAt,
  reviewedAtDefaulted,
  classification,
  accepted,
  consumerOwnedDisplayConformanceResultReviewPackageBoundary
}) {
  return {
    schema:
      CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_PACKAGE_BOUNDARY_SCHEMA,
    schemaVersion:
      CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_PACKAGE_BOUNDARY_VERSION,
    consumerOwnedDisplayConformanceResultReviewPackageBoundaryKind:
      CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_PACKAGE_BOUNDARY_KIND,
    consumerOwnedDisplayConformanceResultReviewPackageBoundaryMode:
      "review-only",
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    consumerOwnedDisplayConformanceResultReviewPackageBoundaryProduced: accepted,
    consumerOwnedDisplayConformanceResultReviewPackageBoundary,
    reviewPackageSummary: accepted
      ? consumerOwnedDisplayConformanceResultReviewPackageBoundary.reviewPackageSummary
      : null,
    phase550SchemaBoundaryReference: accepted
      ? consumerOwnedDisplayConformanceResultReviewPackageBoundary
          .phase550SchemaBoundaryReference
      : null,
    phase551ExamplePackReference: accepted
      ? consumerOwnedDisplayConformanceResultReviewPackageBoundary
          .phase551ExamplePackReference
      : null,
    phase552ConformanceHandoffReference: accepted
      ? consumerOwnedDisplayConformanceResultReviewPackageBoundary
          .phase552ConformanceHandoffReference
      : null,
    phase553RunnerRequirementsReference: accepted
      ? consumerOwnedDisplayConformanceResultReviewPackageBoundary
          .phase553RunnerRequirementsReference
      : null,
    phase554TestPlanReference: accepted
      ? consumerOwnedDisplayConformanceResultReviewPackageBoundary
          .phase554TestPlanReference
      : null,
    phase555ResultSchemaBoundaryReference: accepted
      ? consumerOwnedDisplayConformanceResultReviewPackageBoundary
          .phase555ResultSchemaBoundaryReference
      : null,
    phase556ResultHandoffReference: accepted
      ? consumerOwnedDisplayConformanceResultReviewPackageBoundary
          .phase556ResultHandoffReference
      : null,
    phase557ReviewIntakeBoundaryReference: accepted
      ? consumerOwnedDisplayConformanceResultReviewPackageBoundary
          .phase557ReviewIntakeBoundaryReference
      : null,
    reviewPackageEntries: accepted
      ? consumerOwnedDisplayConformanceResultReviewPackageBoundary
          .reviewPackageEntries
      : [],
    invalidReviewPackageCasePolicy: accepted
      ? consumerOwnedDisplayConformanceResultReviewPackageBoundary
          .invalidReviewPackageCasePolicy
      : consumerOwnedDisplayConformanceResultReviewPackageBoundaryValidationRules(),
    topDisplayConformanceResultReviewPackageGaps: accepted
      ? consumerOwnedDisplayConformanceResultReviewPackageBoundary
          .topDisplayConformanceResultReviewPackageGaps
      : [],
    recommendedNextPhase: accepted
      ? consumerOwnedDisplayConformanceResultReviewPackageBoundary
          .recommendedNextPhase
      : null,
    consumerOwnedDisplayConformanceResultReviewPackageBoundaryOnly: true,
    reviewPackageCandidateMetadataOnly: true,
    reviewOnly: true,
    authoritative: false,
    reviewArtifactOnly: true,
    nonAuthorizingProof: true,
    ...consumerDisplayAccessibilityForbiddenBehavior(),
    renderingCodeImplemented: false,
    browserRenderingHarnessImplemented: false,
    packageProducedByArdyn: false,
    packageExportImplemented: false,
    packageImportImplemented: false,
    packageWriterImplemented: false,
    packageReaderImplemented: false,
    packagePersistenceImplemented: false,
    packageDiscoveryImplemented: false,
    packageDistributionImplemented: false,
    runnerImplementedByArdyn: false,
    resultProducerImplementedByArdyn: false,
    resultCollectorImplementedByArdyn: false,
    resultImporterImplementedByArdyn: false,
    resultExporterImplementedByArdyn: false,
    resultValidatorImplementedByArdyn: false,
    reviewRouterImplementedByArdyn: false,
    evaluatorImplementedByArdyn: false,
    approvalPathImplementedByArdyn: false,
    approvalDecisionProducedByArdyn: false,
    approvalGrantProducedByArdyn: false,
    testHarnessImplementedByArdyn: false,
    consumerOwnedRunnerImplemented: false,
    consumerConformanceRunnerImplemented: false,
    fixtureImportCommandImplemented: false,
    fixtureExportCommandImplemented: false,
    fixtureImportExportCommandsImplemented: false,
    importExportCommandImplemented: false,
    consumerSideCiImplemented: false,
    fixtureDiscoveryRuntimeImplemented: false,
    consumerRepoModifiedByArdyn: false,
    browserWcagAutomationImplemented: false,
    visualRegressionHarnessImplemented: false,
    screenReaderAutomationImplemented: false,
    reviewerRoutingPerformed: false,
    reviewerAssignmentPerformed: false,
    evaluatorExecutionPerformed: false,
    evaluatorResultProduced: false,
    approvalDecisionProduced: false,
    approvalGrantProduced: false,
    approvalGrantPersisted: false,
    externalLookupsEnabled: false,
    filesystemScanningEnabled: false,
    processControlEnabled: false,
    rejectionReasons:
      consumerOwnedDisplayConformanceResultReviewPackageBoundaryRejectionReasons(
        {
          accepted,
          classification
        }
      ),
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

export function createConsumerOwnedDisplayConformanceResultReviewPackageBoundaryForReview(
  input = {}
) {
  const inputRecord =
    consumerOwnedDisplayConformanceResultReviewPackageBoundaryInputRecord(input);
  const reviewedAt =
    consumerOwnedDisplayConformanceResultReviewPackageBoundaryReviewedAt(
      inputRecord
    );
  const reviewedAtDefaulted = isReviewedAtDefaulted(input);
  const classification =
    consumerOwnedDisplayConformanceResultReviewPackageBoundaryInputClassification(
      inputRecord
    );
  const accepted =
    classification ===
    VALID_CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_PACKAGE_BOUNDARY_CLASSIFICATION;
  const consumerOwnedDisplayConformanceResultReviewPackageBoundary = accepted
    ? consumerOwnedDisplayConformanceResultReviewPackageBoundaryState(reviewedAt)
    : null;

  return consumerOwnedDisplayConformanceResultReviewPackageBoundaryResult({
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    accepted,
    consumerOwnedDisplayConformanceResultReviewPackageBoundary
  });
}

