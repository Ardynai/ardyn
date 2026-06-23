import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";
import {
  ERROR_TRACKING_LOGGING_AUDIT_INTEGRITY_CONTRACT_BOUNDARY_MAP_SCHEMA,
  createErrorTrackingLoggingAuditIntegrityContractBoundaryMapForReview
} from "../packages/core/src/index.mjs";

const execFileAsync = promisify(execFile);
const phase565BaselineCommit = "726cb46938fad1b4c788e1b6ab4e971091947511";
const reviewedAt = "2026-06-23T00:00:00.000Z";
const repoRootUrl = new URL("../", import.meta.url);
const repoRoot = fileURLToPath(repoRootUrl);
const cliPath = fileURLToPath(new URL("../apps/cli/src/index.mjs", import.meta.url));
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-65/error-tracking-logging-audit-integrity-contract-boundary-map.json",
  import.meta.url
);

const expectedCaseClassifications = Object.freeze({
  "valid-error-tracking-logging-audit-integrity-contract-boundary-map":
    "valid_error_tracking_logging_audit_integrity_contract_boundary_map_runtime_still_blocked",
  "malformed-error-tracking-logging-audit-integrity-contract-boundary-map-input-rejected":
    "malformed_error_tracking_logging_audit_integrity_contract_boundary_map_input_rejected",
  "missing-required-error-tracking-logging-audit-integrity-contract-boundary-entry-rejected":
    "missing_required_error_tracking_logging_audit_integrity_contract_boundary_entry_rejected",
  "unknown-top-level-field-error-tracking-logging-audit-integrity-contract-boundary-map-input-rejected":
    "unknown_top_level_field_error_tracking_logging_audit_integrity_contract_boundary_map_input_rejected",
  "unknown-boundary-family-error-tracking-logging-audit-integrity-contract-boundary-map-input-rejected":
    "unknown_boundary_family_error_tracking_logging_audit_integrity_contract_boundary_map_input_rejected",
  "unknown-related-system-error-tracking-logging-audit-integrity-contract-boundary-map-input-rejected":
    "unknown_related_system_error_tracking_logging_audit_integrity_contract_boundary_map_input_rejected",
  "unknown-current-status-error-tracking-logging-audit-integrity-contract-boundary-map-input-rejected":
    "unknown_current_status_error_tracking_logging_audit_integrity_contract_boundary_map_input_rejected",
  "authorization-flags-enabled-error-tracking-logging-audit-integrity-contract-boundary-map-input-rejected":
    "authorization_flags_enabled_error_tracking_logging_audit_integrity_contract_boundary_map_input_rejected",
  "report-runs-checks-true-error-tracking-logging-audit-integrity-contract-boundary-map-input-rejected":
    "report_runs_checks_true_error_tracking_logging_audit_integrity_contract_boundary_map_input_rejected",
  "runtime-authorization-attempt-error-tracking-logging-audit-integrity-contract-boundary-map-input-rejected":
    "runtime_authorization_attempt_error_tracking_logging_audit_integrity_contract_boundary_map_input_rejected",
  "command-exposure-attempt-error-tracking-logging-audit-integrity-contract-boundary-map-input-rejected":
    "command_exposure_attempt_error_tracking_logging_audit_integrity_contract_boundary_map_input_rejected",
  "blocked-cli-bypass-attempt-error-tracking-logging-audit-integrity-contract-boundary-map-input-rejected":
    "blocked_cli_bypass_attempt_error_tracking_logging_audit_integrity_contract_boundary_map_input_rejected",
  "hidden-log-writer-semantics-error-tracking-logging-audit-integrity-contract-boundary-map-input-rejected":
    "hidden_log_writer_semantics_error_tracking_logging_audit_integrity_contract_boundary_map_input_rejected",
  "hidden-audit-transcript-write-semantics-error-tracking-logging-audit-integrity-contract-boundary-map-input-rejected":
    "hidden_audit_transcript_write_semantics_error_tracking_logging_audit_integrity_contract_boundary_map_input_rejected",
  "hidden-telemetry-export-external-sink-semantics-error-tracking-logging-audit-integrity-contract-boundary-map-input-rejected":
    "hidden_telemetry_export_external_sink_semantics_error_tracking_logging_audit_integrity_contract_boundary_map_input_rejected",
  "hidden-tamper-evident-chain-writer-semantics-error-tracking-logging-audit-integrity-contract-boundary-map-input-rejected":
    "hidden_tamper_evident_chain_writer_semantics_error_tracking_logging_audit_integrity_contract_boundary_map_input_rejected",
  "hidden-redaction-runtime-semantics-error-tracking-logging-audit-integrity-contract-boundary-map-input-rejected":
    "hidden_redaction_runtime_semantics_error_tracking_logging_audit_integrity_contract_boundary_map_input_rejected",
  "hidden-backend-api-server-semantics-error-tracking-logging-audit-integrity-contract-boundary-map-input-rejected":
    "hidden_backend_api_server_semantics_error_tracking_logging_audit_integrity_contract_boundary_map_input_rejected",
  "hidden-database-storage-cache-write-semantics-error-tracking-logging-audit-integrity-contract-boundary-map-input-rejected":
    "hidden_database_storage_cache_write_semantics_error_tracking_logging_audit_integrity_contract_boundary_map_input_rejected",
  "hidden-auth-session-token-api-key-semantics-error-tracking-logging-audit-integrity-contract-boundary-map-input-rejected":
    "hidden_auth_session_token_api_key_semantics_error_tracking_logging_audit_integrity_contract_boundary_map_input_rejected",
  "hidden-connector-grant-semantics-error-tracking-logging-audit-integrity-contract-boundary-map-input-rejected":
    "hidden_connector_grant_semantics_error_tracking_logging_audit_integrity_contract_boundary_map_input_rejected",
  "hidden-fabric-websocket-http-mcp-task-runtime-semantics-error-tracking-logging-audit-integrity-contract-boundary-map-input-rejected":
    "hidden_fabric_websocket_http_mcp_task_runtime_semantics_error_tracking_logging_audit_integrity_contract_boundary_map_input_rejected",
  "hidden-secure-drop-implementation-semantics-error-tracking-logging-audit-integrity-contract-boundary-map-input-rejected":
    "hidden_secure_drop_implementation_semantics_error_tracking_logging_audit_integrity_contract_boundary_map_input_rejected",
  "hidden-encoded-handoff-codec-translator-stego-covert-channel-tokenizer-exploit-bypass-semantics-error-tracking-logging-audit-integrity-contract-boundary-map-input-rejected":
    "hidden_encoded_handoff_codec_translator_stego_covert_channel_tokenizer_exploit_bypass_semantics_error_tracking_logging_audit_integrity_contract_boundary_map_input_rejected",
  "unsafe-logger-audit-transcript-telemetry-error-external-sink-tamper-redaction-trace-alerting-backend-storage-runtime-flags-error-tracking-logging-audit-integrity-contract-boundary-map-input-rejected":
    "unsafe_logger_audit_transcript_telemetry_error_external_sink_tamper_redaction_trace_alerting_backend_storage_runtime_flags_error_tracking_logging_audit_integrity_contract_boundary_map_input_rejected",
  "nested-unsafe-flags-error-tracking-logging-audit-integrity-contract-boundary-map-input-rejected":
    "nested_unsafe_flags_error_tracking_logging_audit_integrity_contract_boundary_map_input_rejected",
  "noncanonical-error-tracking-logging-audit-integrity-contract-boundary-map-input-rejected":
    "noncanonical_error_tracking_logging_audit_integrity_contract_boundary_map_input_rejected"
});

const expectedBoundaryIds = Object.freeze([
  "phase5-65.repo_family.backend_api_error_tracking.error_tracking_boundary",
  "phase5-65.ardyn.database_storage_audit_transcript.transcript_observability_boundary",
  "phase5-65.ardyn.auth_permissions_audit_subject.audit_integrity_boundary",
  "phase5-65.ardyn.security_rls_input_audit_integrity.audit_integrity_boundary",
  "phase5-65.ardyn.rate_limit_abuse_event_observability.abuse_event_boundary",
  "phase5-65.ardyn.cli_runtime_command_error_tracking.error_tracking_boundary",
  "phase5-65.ardyn.process_stdio_failure_logging.logging_boundary",
  "phase5-65.ardyn_subagent.encoded_handoff_raw_audit_visibility.encoded_handoff_audit_boundary",
  "phase5-65.repo_family.fabric_coordination_envelope_observability.fabric_observability_boundary",
  "phase5-65.locus.status_error_audit_display.redaction_boundary",
  "phase5-65.multiverse.capability_task_error_status.trace_correlation_boundary",
  "phase5-65.ardyn.mcp_tool_exposure_audit.audit_integrity_boundary",
  "phase5-65.repo_family.connector_grant_audit.audit_integrity_boundary",
  "phase5-65.content_fabric.secure_drop_metadata_audit.secure_drop_audit_boundary",
  "phase5-65.repo_family.external_sink_export.external_sink_boundary",
  "phase5-65.repo_family.retention_deletion_export_policy.retention_boundary",
  "phase5-65.repo_family.tamper_evident_digest_hash_chaining.tamper_evidence_boundary"
]);

const commandProbes = Object.freeze([
  "error-tracking-logging-audit-integrity-contract-boundary-map",
  "logger-runtime",
  "log-writer-runtime",
  "audit-writer-runtime",
  "transcript-writer-runtime",
  "telemetry-client-runtime",
  "error-collector-runtime",
  "external-sink-runtime",
  "log-export-runtime",
  "tamper-evident-writer",
  "digest-writer-runtime",
  "hash-chain-writer",
  "redaction-runtime",
  "trace-collector-runtime",
  "alerting-runtime",
  "backend-observability-runtime",
  "fabric-observability-runtime",
  "encoded-handoff-audit-runtime",
  "secure-drop-audit-runtime",
  "connector-audit-runtime",
  "mcp-audit-runtime",
  "task-audit-runtime"
]);

const nonAuthorizingResultFields = Object.freeze([
  "reportRunsChecks",
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
  const [entry] =
    createErrorTrackingLoggingAuditIntegrityContractBoundaryMapForReview({
      reviewedAt
    }).boundaryEntries;

  return [{ ...structuredClone(entry), ...patch }];
}

test("Phase 5.65 error/logging/audit-integrity boundary map fixture is deterministic", async () => {
  const fixture = await readFixture();
  const generated =
    createErrorTrackingLoggingAuditIntegrityContractBoundaryMapForReview({
      reviewedAt
    });

  assert.deepEqual(fixture, generated);
  assert.equal(
    fixture.schema,
    ERROR_TRACKING_LOGGING_AUDIT_INTEGRITY_CONTRACT_BOUNDARY_MAP_SCHEMA
  );
  assert.equal(fixture.reviewedAt, reviewedAt);
  assert.equal(
    fixture.classification,
    expectedCaseClassifications[
      "valid-error-tracking-logging-audit-integrity-contract-boundary-map"
    ]
  );
  assert.equal(
    fixture.errorTrackingLoggingAuditIntegrityContractBoundaryMapProduced,
    true
  );
  assert.equal(
    fixture.errorTrackingLoggingAuditIntegrityContractBoundaryMapMode,
    "review-only"
  );
  assert.equal(fixture.boundaryEntries.length, 17);
  assert.deepEqual(
    fixture.boundaryEntries.map(({ boundaryId }) => boundaryId),
    expectedBoundaryIds
  );
  assertNonAuthorizing(fixture);
});

test("Phase 5.65 references Phase 5.48 through 5.64 and content-fabric ownership", async () => {
  const fixture = await readFixture();
  const state = fixture.errorTrackingLoggingAuditIntegrityContractBoundaryMap;

  assert.equal(state.sourcePhaseContext.phase548ErrorTrackingLogsAreaNumber, 12);
  assert.equal(state.sourcePhaseContext.phase548ErrorTrackingLogsStatus, "deferred");
  assert.equal(state.sourcePhaseContext.secureDropCanonicalOwner, "content-fabric");
  assert.equal(state.sourcePhaseContext.runtimeStillBlocked, true);
  assert.equal(
    fixture.boundaryMapSummary.phase548ErrorTrackingLogsCoverageItemRepresented,
    true
  );
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
  assert.equal(
    fixture.boundaryMapSummary
      .phase563SecurityRlsInputSanitizationBoundaryReferenced,
    true
  );
  assert.equal(
    fixture.boundaryMapSummary.phase564RateLimitingAbuseControlBoundaryReferenced,
    true
  );

  for (const entry of fixture.boundaryEntries) {
    assert.equal(entry.productionReadinessAreaReference.areaNumber, 12);
    assert.equal(entry.productionReadinessAreaReference.authorizesRuntime, false);
    assert.equal(
      entry.phase559FabricAwareApiBackendReference.implementsFabricRuntime,
      false
    );
    assert.equal(
      entry.phase560InterAgentEncodedHandoffConformanceReference
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
    assert.equal(
      entry.phase563SecurityRlsInputSanitizationBoundaryReference
        .implementsSecurityRuntime,
      false
    );
    assert.equal(
      entry.phase564RateLimitingAbuseControlBoundaryReference
        .implementsAbuseRuntime,
      false
    );
  }
});

test("Phase 5.65 invalid error/logging/audit-integrity boundary cases fail closed", () => {
  const valid =
    createErrorTrackingLoggingAuditIntegrityContractBoundaryMapForReview({
      reviewedAt
    });
  const firstEntry = valid.boundaryEntries[0];
  const missingBoundaryIdEntry = { ...firstEntry };
  delete missingBoundaryIdEntry.boundaryId;

  const cases = [
    [
      null,
      "malformed-error-tracking-logging-audit-integrity-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt: "not-a-date" },
      "malformed-error-tracking-logging-audit-integrity-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, boundaryEntries: [missingBoundaryIdEntry] },
      "missing-required-error-tracking-logging-audit-integrity-contract-boundary-entry-rejected"
    ],
    [
      { reviewedAt, unknownField: true },
      "unknown-top-level-field-error-tracking-logging-audit-integrity-contract-boundary-map-input-rejected"
    ],
    [
      {
        reviewedAt,
        boundaryEntries: boundaryEntryPatch({ boundaryFamily: "logger_runtime" })
      },
      "unknown-boundary-family-error-tracking-logging-audit-integrity-contract-boundary-map-input-rejected"
    ],
    [
      {
        reviewedAt,
        boundaryEntries: boundaryEntryPatch({ relatedSystem: "external-repo" })
      },
      "unknown-related-system-error-tracking-logging-audit-integrity-contract-boundary-map-input-rejected"
    ],
    [
      {
        reviewedAt,
        boundaryEntries: boundaryEntryPatch({ currentStatus: "implemented" })
      },
      "unknown-current-status-error-tracking-logging-audit-integrity-contract-boundary-map-input-rejected"
    ],
    [
      {
        reviewedAt,
        boundaryEntries: boundaryEntryPatch({
          explicitBlockedAuthorizationFlags: {
            ...firstEntry.explicitBlockedAuthorizationFlags,
            auditWriterAuthorizationGranted: true
          }
        })
      },
      "authorization-flags-enabled-error-tracking-logging-audit-integrity-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, reportRunsChecks: true },
      "report-runs-checks-true-error-tracking-logging-audit-integrity-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, runtimeAuthorized: true },
      "runtime-authorization-attempt-error-tracking-logging-audit-integrity-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, commandExposureEnabled: true },
      "command-exposure-attempt-error-tracking-logging-audit-integrity-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, blockedCliBypassEnabled: true },
      "blocked-cli-bypass-attempt-error-tracking-logging-audit-integrity-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, logWriter: { path: "audit.log" } },
      "hidden-log-writer-semantics-error-tracking-logging-audit-integrity-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, auditWriter: { path: "audit.jsonl" } },
      "hidden-audit-transcript-write-semantics-error-tracking-logging-audit-integrity-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, telemetryClient: { dsn: "https://example.invalid" } },
      "hidden-telemetry-export-external-sink-semantics-error-tracking-logging-audit-integrity-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, tamperEvidentWriter: { enabled: false } },
      "hidden-tamper-evident-chain-writer-semantics-error-tracking-logging-audit-integrity-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, redactionRuntime: { enabled: false } },
      "hidden-redaction-runtime-semantics-error-tracking-logging-audit-integrity-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, httpServer: { enabled: false } },
      "hidden-backend-api-server-semantics-error-tracking-logging-audit-integrity-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, databaseUrl: "postgres://example" },
      "hidden-database-storage-cache-write-semantics-error-tracking-logging-audit-integrity-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, sessionToken: "token" },
      "hidden-auth-session-token-api-key-semantics-error-tracking-logging-audit-integrity-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, connectorGrant: { enabled: false } },
      "hidden-connector-grant-semantics-error-tracking-logging-audit-integrity-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, websocketUrl: "wss://example.invalid" },
      "hidden-fabric-websocket-http-mcp-task-runtime-semantics-error-tracking-logging-audit-integrity-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, secureDropKeyring: { enabled: false } },
      "hidden-secure-drop-implementation-semantics-error-tracking-logging-audit-integrity-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, codecImplemented: false },
      "hidden-encoded-handoff-codec-translator-stego-covert-channel-tokenizer-exploit-bypass-semantics-error-tracking-logging-audit-integrity-contract-boundary-map-input-rejected"
    ],
    [
      {
        reviewedAt,
        boundaryEntries: boundaryEntryPatch({
          unsafeErrorLoggingAuditRuntimeFlags: {
            ...firstEntry.unsafeErrorLoggingAuditRuntimeFlags,
            loggerRuntimeImplemented: true
          }
        })
      },
      "unsafe-logger-audit-transcript-telemetry-error-external-sink-tamper-redaction-trace-alerting-backend-storage-runtime-flags-error-tracking-logging-audit-integrity-contract-boundary-map-input-rejected"
    ],
    [
      {
        reviewedAt,
        boundaryEntries: boundaryEntryPatch({
          runtimeEffect: { ...firstEntry.runtimeEffect, writesFilesystem: true }
        })
      },
      "nested-unsafe-flags-error-tracking-logging-audit-integrity-contract-boundary-map-input-rejected"
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
      "noncanonical-error-tracking-logging-audit-integrity-contract-boundary-map-input-rejected"
    ]
  ];

  for (const [input, caseKey] of cases) {
    const result =
      createErrorTrackingLoggingAuditIntegrityContractBoundaryMapForReview(
        input
      );
    assert.equal(
      result.classification,
      expectedCaseClassifications[caseKey],
      caseKey
    );
    assert.equal(
      result.errorTrackingLoggingAuditIntegrityContractBoundaryMapProduced,
      false,
      caseKey
    );
    assert.equal(result.boundaryEntries.length, 0, caseKey);
    assertNonAuthorizing(result);
  }
});

test("Phase 5.65 boundary entries cover required families, systems, and blocked observability semantics", async () => {
  const fixture = await readFixture();
  const summary = fixture.boundaryMapSummary;

  assert.deepEqual(summary.countByFamily, {
    error_tracking_contract: 2,
    logging_contract: 1,
    audit_integrity_contract: 4,
    tamper_evidence_contract: 1,
    trace_correlation_contract: 1,
    transcript_observability_contract: 1,
    redaction_contract: 1,
    retention_contract: 1,
    external_sink_boundary: 1,
    abuse_event_observability_contract: 1,
    encoded_handoff_audit_contract: 1,
    fabric_observability_contract: 1,
    secure_drop_audit_boundary: 1
  });
  assert.deepEqual(summary.countByRelatedSystem, {
    ardyn: 7,
    "ardyn-subagent": 1,
    locus: 1,
    multiverse: 1,
    "content-fabric": 1,
    "repo-family": 6
  });

  for (const entry of fixture.boundaryEntries) {
    assert.match(entry.boundaryId, /^phase5-65\./);
    assert.equal(entry.errorTrackingLoggingAuditIntegrityBoundaryMetadataOnly, true);
    assert.equal(entry.noLiveObservabilityPerformed, true);
    assert.equal(entry.nonAuthorizingProof, true);
    assert.equal(typeof entry.errorClassificationExpectation, "string");
    assert.equal(typeof entry.logEventShapeExpectation, "string");
    assert.equal(typeof entry.auditSubjectExpectation, "string");
    assert.equal(typeof entry.tamperEvidenceExpectation, "string");
    assert.equal(typeof entry.redactionExpectation, "string");
    assert.equal(typeof entry.retentionDeletionExpectation, "string");
    assert.equal(typeof entry.correlationIdempotencyExpectation, "string");
    assertAllFalse(entry.explicitBlockedAuthorizationFlags);
    assertAllFalse(entry.unsafeErrorLoggingAuditRuntimeFlags);
    assertAllFalse(entry.runtimeEffect);
    assert.ok(entry.forbiddenCurrentBehavior.includes("logger runtime"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("audit writer"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("telemetry client"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("external sink"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("websocket/http transport"));
  }
});

test("Phase 5.65 boundary map stays non-authorizing and runtime-blocked", async () => {
  const fixture = await readFixture();
  const summary = fixture.boundaryMapSummary;

  assert.equal(summary.errorTrackingLoggingAuditIntegrityBoundaryMetadataOnly, true);
  assert.equal(summary.noLiveObservabilityPerformed, true);
  assert.equal(summary.noLoggerRuntimeImplemented, true);
  assert.equal(summary.noAuditWriterImplemented, true);
  assert.equal(summary.noTranscriptWriterImplemented, true);
  assert.equal(summary.noTelemetryClientImplemented, true);
  assert.equal(summary.noErrorCollectorImplemented, true);
  assert.equal(summary.noExternalSinkImplemented, true);
  assert.equal(summary.noTamperEvidentWriterImplemented, true);
  assert.equal(summary.noRedactionRuntimeImplemented, true);
  assert.equal(summary.noTraceCollectorImplemented, true);
  assert.equal(summary.noAlertingRuntimeImplemented, true);
  assert.equal(summary.noBackendApiServerImplemented, true);
  assert.equal(summary.noStorageWrites, true);
  assert.equal(summary.noConnectorGrants, true);
  assert.equal(summary.allBlockedAuthorizationFlagsFalse, true);
  assert.equal(summary.allUnsafeErrorLoggingAuditRuntimeFlagsFalse, true);
  assert.equal(summary.allRuntimeEffectsFalse, true);
  assert.equal(summary.allEntriesNonAuthorizing, true);
  assertNonAuthorizing(fixture);
  assert.equal(
    fixture.recommendedNextPhase,
    "phase-5.66-review-only-availability-recovery-contract-boundary-map"
  );
});

test("serve-runtime remains default-blocked and dry-run cannot bypass Phase 5.65", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-65-runtime-"));
  try {
    const direct = await expectCliFailure(["serve-runtime"]);
    assert.notEqual(direct.code, 0);
    assert.equal(direct.stdout, "");

    const dryRun = await expectCliFailure(["serve-runtime", "--dry-run"]);
    assert.notEqual(dryRun.code, 0);
    assert.equal(dryRun.stdout, "");
  } finally {
    await rm(scratch, { force: true, recursive: true });
  }
});

test("Phase 5.65 logging/audit/runtime command names remain rejected", async () => {
  for (const command of commandProbes) {
    const error = await expectCliFailure([command]);
    assert.notEqual(error.code, 0, command);
    assert.equal(error.stdout, "", command);
  }
});

test("Phase 5.65 does not change CLI, Rust, Fabric, package, or consumer source", async () => {
  const files = [
    "apps/cli/src/index.mjs",
    "crates/ardyn-host/src/lib.rs",
    "crates/ardyn-host/src/stdio_runtime/mod.rs",
    "packages/fabric/src/index.mjs",
    "package.json"
  ];

  for (const file of files) {
    const [baseline, current] = await Promise.all([
      execFileAsync("git", ["show", `${phase565BaselineCommit}:${file}`], {
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
  assert.doesNotMatch(
    currentCliSource,
    /error-tracking-logging-audit-integrity-contract-boundary-map/
  );
  assert.doesNotMatch(currentCliSource, /logger-runtime/);
  assert.doesNotMatch(currentCliSource, /audit-writer-runtime/);
  assert.doesNotMatch(currentCliSource, /telemetry-client-runtime/);
  assert.doesNotMatch(currentCliSource, /external-sink-runtime/);
});
