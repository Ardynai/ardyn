import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";
import {
  COMMAND_SURFACE_SHELL_PRIMITIVE_CONTRACT_BOUNDARY_MAP_SCHEMA,
  createCommandSurfaceShellPrimitiveContractBoundaryMapForReview
} from "../packages/core/src/index.mjs";

const execFileAsync = promisify(execFile);
const phase574BaselineCommit = "3eb3e015b455c7a68fb3b598f145827fdf2e4428";
const reviewedAt = "2026-06-30T00:00:00.000Z";
const repoRootUrl = new URL("../", import.meta.url);
const repoRoot = fileURLToPath(repoRootUrl);
const cliPath = fileURLToPath(
  new URL("../apps/cli/src/index.mjs", import.meta.url)
);
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-74/command-surface-shell-primitive-contract-boundary-map.json",
  import.meta.url
);

const expectedCaseClassifications = Object.freeze({
  "valid-command-surface-shell-primitive-contract-boundary-map":
    "valid_command_surface_shell_primitive_contract_boundary_map_runtime_still_blocked",
  "malformed-command-surface-shell-primitive-contract-boundary-map-input-rejected":
    "malformed_command_surface_shell_primitive_contract_boundary_map_input_rejected",
  "missing-required-command-surface-shell-primitive-boundary-entry-rejected":
    "missing_required_command_surface_shell_primitive_boundary_entry_rejected",
  "unknown-top-level-field-command-surface-shell-primitive-contract-boundary-map-input-rejected":
    "unknown_top_level_field_command_surface_shell_primitive_contract_boundary_map_input_rejected",
  "unknown-boundary-family-command-surface-shell-primitive-contract-boundary-map-input-rejected":
    "unknown_boundary_family_command_surface_shell_primitive_contract_boundary_map_input_rejected",
  "unknown-related-system-command-surface-shell-primitive-contract-boundary-map-input-rejected":
    "unknown_related_system_command_surface_shell_primitive_contract_boundary_map_input_rejected",
  "unknown-current-status-command-surface-shell-primitive-contract-boundary-map-input-rejected":
    "unknown_current_status_command_surface_shell_primitive_contract_boundary_map_input_rejected",
  "authorization-flags-enabled-command-surface-shell-primitive-contract-boundary-map-input-rejected":
    "authorization_flags_enabled_command_surface_shell_primitive_contract_boundary_map_input_rejected",
  "report-runs-checks-true-command-surface-shell-primitive-contract-boundary-map-input-rejected":
    "report_runs_checks_true_command_surface_shell_primitive_contract_boundary_map_input_rejected",
  "runtime-authorization-attempt-command-surface-shell-primitive-contract-boundary-map-input-rejected":
    "runtime_authorization_attempt_command_surface_shell_primitive_contract_boundary_map_input_rejected",
  "command-exposure-attempt-command-surface-shell-primitive-contract-boundary-map-input-rejected":
    "command_exposure_attempt_command_surface_shell_primitive_contract_boundary_map_input_rejected",
  "blocked-cli-bypass-attempt-command-surface-shell-primitive-contract-boundary-map-input-rejected":
    "blocked_cli_bypass_attempt_command_surface_shell_primitive_contract_boundary_map_input_rejected",
  "hidden-shell-repl-process-execution-semantics-command-surface-shell-primitive-contract-boundary-map-input-rejected":
    "hidden_shell_repl_process_execution_semantics_command_surface_shell_primitive_contract_boundary_map_input_rejected",
  "hidden-path-executable-lookup-semantics-command-surface-shell-primitive-contract-boundary-map-input-rejected":
    "hidden_path_executable_lookup_semantics_command_surface_shell_primitive_contract_boundary_map_input_rejected",
  "hidden-filesystem-read-write-semantics-command-surface-shell-primitive-contract-boundary-map-input-rejected":
    "hidden_filesystem_read_write_semantics_command_surface_shell_primitive_contract_boundary_map_input_rejected",
  "hidden-env-secrets-exposure-semantics-command-surface-shell-primitive-contract-boundary-map-input-rejected":
    "hidden_env_secrets_exposure_semantics_command_surface_shell_primitive_contract_boundary_map_input_rejected",
  "hidden-pipe-redirection-stdio-semantics-command-surface-shell-primitive-contract-boundary-map-input-rejected":
    "hidden_pipe_redirection_stdio_semantics_command_surface_shell_primitive_contract_boundary_map_input_rejected",
  "hidden-job-control-background-worker-semantics-command-surface-shell-primitive-contract-boundary-map-input-rejected":
    "hidden_job_control_background_worker_semantics_command_surface_shell_primitive_contract_boundary_map_input_rejected",
  "hidden-command-exposure-or-runtime-authorization-semantics-command-surface-shell-primitive-contract-boundary-map-input-rejected":
    "hidden_command_exposure_or_runtime_authorization_semantics_command_surface_shell_primitive_contract_boundary_map_input_rejected",
  "hidden-backend-api-server-semantics-command-surface-shell-primitive-contract-boundary-map-input-rejected":
    "hidden_backend_api_server_semantics_command_surface_shell_primitive_contract_boundary_map_input_rejected",
  "hidden-database-storage-cache-write-semantics-command-surface-shell-primitive-contract-boundary-map-input-rejected":
    "hidden_database_storage_cache_write_semantics_command_surface_shell_primitive_contract_boundary_map_input_rejected",
  "hidden-auth-session-token-api-key-semantics-command-surface-shell-primitive-contract-boundary-map-input-rejected":
    "hidden_auth_session_token_api_key_semantics_command_surface_shell_primitive_contract_boundary_map_input_rejected",
  "hidden-connector-grant-semantics-command-surface-shell-primitive-contract-boundary-map-input-rejected":
    "hidden_connector_grant_semantics_command_surface_shell_primitive_contract_boundary_map_input_rejected",
  "hidden-fabric-websocket-http-mcp-task-runtime-semantics-command-surface-shell-primitive-contract-boundary-map-input-rejected":
    "hidden_fabric_websocket_http_mcp_task_runtime_semantics_command_surface_shell_primitive_contract_boundary_map_input_rejected",
  "hidden-secure-drop-implementation-semantics-command-surface-shell-primitive-contract-boundary-map-input-rejected":
    "hidden_secure_drop_implementation_semantics_command_surface_shell_primitive_contract_boundary_map_input_rejected",
  "hidden-matrix-gateway-runtime-semantics-command-surface-shell-primitive-contract-boundary-map-input-rejected":
    "hidden_matrix_gateway_runtime_semantics_command_surface_shell_primitive_contract_boundary_map_input_rejected",
  "hidden-content-addressed-chunked-resumable-p2p-transport-semantics-command-surface-shell-primitive-contract-boundary-map-input-rejected":
    "hidden_content_addressed_chunked_resumable_p2p_transport_semantics_command_surface_shell_primitive_contract_boundary_map_input_rejected",
  "hidden-sqlite-embedded-db-query-runtime-semantics-command-surface-shell-primitive-contract-boundary-map-input-rejected":
    "hidden_sqlite_embedded_db_query_runtime_semantics_command_surface_shell_primitive_contract_boundary_map_input_rejected",
  "hidden-hermes-cua-computer-use-runtime-semantics-command-surface-shell-primitive-contract-boundary-map-input-rejected":
    "hidden_hermes_cua_computer_use_runtime_semantics_command_surface_shell_primitive_contract_boundary_map_input_rejected",
  "hidden-encoded-handoff-runtime-codec-translator-stego-covert-channel-tokenizer-exploit-bypass-semantics-command-surface-shell-primitive-contract-boundary-map-input-rejected":
    "hidden_encoded_handoff_runtime_codec_translator_stego_covert_channel_tokenizer_exploit_bypass_semantics_command_surface_shell_primitive_contract_boundary_map_input_rejected",
  "unsafe-command-surface-shell-primitive-runtime-flags-command-surface-shell-primitive-contract-boundary-map-input-rejected":
    "unsafe_command_surface_shell_primitive_runtime_flags_command_surface_shell_primitive_contract_boundary_map_input_rejected",
  "nested-unsafe-flags-command-surface-shell-primitive-contract-boundary-map-input-rejected":
    "nested_unsafe_flags_command_surface_shell_primitive_contract_boundary_map_input_rejected",
  "noncanonical-command-surface-shell-primitive-contract-boundary-map-input-rejected":
    "noncanonical_command_surface_shell_primitive_contract_boundary_map_input_rejected"
});

const expectedBoundaryFamilies = Object.freeze([
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

const expectedRelatedSystems = Object.freeze([
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

const expectedStatusValues = Object.freeze([
  "metadata_only",
  "blocked",
  "future_contract_required"
]);

const commandProbes = Object.freeze([
  "command-surface-shell-primitive-contract-boundary-map",
  "shell-runtime",
  "shell-repl",
  "command-parser-runtime",
  "command-tokenizer-runtime",
  "builtin-command-runtime",
  "path-lookup-runtime",
  "executable-lookup-runtime",
  "external-program-runtime",
  "process-spawn-runtime",
  "stdout-redirection-runtime",
  "stderr-redirection-runtime",
  "append-redirection-runtime",
  "pipeline-runtime",
  "completion-runtime",
  "programmable-completion-runtime",
  "filename-completion-runtime",
  "background-job-runtime",
  "job-control-runtime",
  "command-history-runtime",
  "history-persistence-runtime",
  "parameter-expansion-runtime",
  "environment-expansion-runtime",
  "terminal-backend-runtime"
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
  "schedulePollingEnabled",
  "filesystemWriteEnabled",
  "processControlEnabled",
  "shellRuntimeEnabled",
  "replRuntimeEnabled",
  "commandParserRuntimeEnabled",
  "builtinExecutionEnabled",
  "pathLookupRuntimeEnabled",
  "externalProgramExecutionEnabled",
  "processSpawnEnabled",
  "stdinLoopEnabled",
  "stdoutWriterEnabled",
  "stderrWriterEnabled",
  "redirectionRuntimeEnabled",
  "pipelineRuntimeEnabled",
  "completionRuntimeEnabled",
  "backgroundJobRuntimeEnabled",
  "jobControlRuntimeEnabled",
  "commandHistoryRuntimeEnabled",
  "historyPersistenceRuntimeEnabled",
  "environmentVariableExpansionRuntimeEnabled",
  "parameterExpansionRuntimeEnabled",
  "terminalBackendRuntimeEnabled",
  "matrixClientRuntimeEnabled",
  "contentAddressedTransportEnabled",
  "sqliteRuntimeEnabled",
  "backendRuntimeImplementedByArdyn",
  "loggerRuntimeImplemented",
  "auditWriterRuntimeImplemented",
  "telemetryClientImplemented",
  "healthCheckRuntimeImplemented",
  "hermesRuntimeEnabled",
  "cuaDriverRuntimeEnabled",
  "computerUseRuntimeEnabled"
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
  const valid = createCommandSurfaceShellPrimitiveContractBoundaryMapForReview({
    reviewedAt
  });
  const runtimeFlagNames = Object.keys(
    valid.boundaryEntries[0].unsafeCommandSurfaceShellPrimitiveRuntimeFlags
  );

  for (const field of runtimeFlagNames) {
    assert.equal(result[field], false, `${field} should be false`);
  }

  assert.equal(result.reportRunsChecks, false);
  assert.equal(result.nonAuthorizingProof, true);
  assertAllFalse(result.runtimeEffect);
}

function boundaryEntryPatch(patch) {
  const [entry] = createCommandSurfaceShellPrimitiveContractBoundaryMapForReview({
    reviewedAt
  }).boundaryEntries;

  return [{ ...structuredClone(entry), ...patch }];
}

test("Phase 5.74 command-surface/shell boundary map fixture is deterministic", async () => {
  const fixture = await readFixture();
  const generated = createCommandSurfaceShellPrimitiveContractBoundaryMapForReview({
    reviewedAt
  });

  assert.deepEqual(fixture, generated);
  assert.equal(
    fixture.schema,
    COMMAND_SURFACE_SHELL_PRIMITIVE_CONTRACT_BOUNDARY_MAP_SCHEMA
  );
  assert.equal(fixture.reviewedAt, reviewedAt);
  assert.equal(
    fixture.classification,
    expectedCaseClassifications[
      "valid-command-surface-shell-primitive-contract-boundary-map"
    ]
  );
  assert.equal(
    fixture.commandSurfaceShellPrimitiveContractBoundaryMapProduced,
    true
  );
  assert.equal(
    fixture.commandSurfaceShellPrimitiveContractBoundaryMapMode,
    "review-only"
  );
});

test("Phase 5.74 covers requested command-surface and shell primitive boundaries", async () => {
  const fixture = await readFixture();
  const state = fixture.commandSurfaceShellPrimitiveContractBoundaryMap;
  const entries = state.boundaryEntries;
  const families = new Set(entries.map((entry) => entry.boundaryFamily));
  const systems = new Set(entries.map((entry) => entry.relatedSystem));
  const statuses = new Set(entries.map((entry) => entry.currentStatus));

  assert.equal(fixture.boundaryEntries.length, 27);
  assert.deepEqual([...families].sort(), [...expectedBoundaryFamilies].sort());
  assert.deepEqual([...systems].sort(), [...expectedRelatedSystems].sort());
  assert.deepEqual([...statuses].sort(), [...expectedStatusValues].sort());
  assert.equal(state.sourcePhaseContext.codecraftersShellReferenceTaxonomyOnly, true);
  assert.equal(state.sourcePhaseContext.codecraftersShellRepoInstalledOrCopied, false);
  assert.equal(state.sourcePhaseContext.noShellRuntimeImplemented, true);
  assert.equal(state.sourcePhaseContext.runtimeStillBlocked, true);

  for (const entry of entries) {
    assert.match(entry.boundaryId, /^phase5-74\./);
    assert.equal(entry.commandSurfaceBoundaryMetadataOnly, true);
    assert.equal(entry.noLiveCommandSurfaceShellPrimitiveRuntimePerformed, true);
    assert.equal(entry.codecraftersShellReferenceTaxonomy.taxonomyOnly, true);
    assert.equal(
      entry.codecraftersShellReferenceTaxonomy.repositoryInstalledOrCopied,
      false
    );
    assert.equal(entry.explicitBlockedAuthorizationFlagsAllFalse, undefined);
    assertAllFalse(entry.explicitBlockedAuthorizationFlags);
    assertAllFalse(entry.unsafeCommandSurfaceShellPrimitiveRuntimeFlags);
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
    "cliCommandRecognitionBoundaryRecorded",
    "serveRuntimeBlockedCommandBoundaryRecorded",
    "futureReplPromptBoundaryRecorded",
    "commandParserTokenizerBoundaryRecorded",
    "builtinCommandBoundaryRecorded",
    "invalidCommandErrorHandlingBoundaryRecorded",
    "pathExecutableLookupBoundaryRecorded",
    "externalProgramExecutionBoundaryRecorded",
    "processSpawnExitCodeBoundaryRecorded",
    "quotingEscapingBoundaryRecorded",
    "stdoutStderrRedirectionBoundaryRecorded",
    "appendRedirectionBoundaryRecorded",
    "pipelineBoundaryRecorded",
    "completionAutocompleteBoundaryRecorded",
    "programmableCompletionBoundaryRecorded",
    "filenameCompletionBoundaryRecorded",
    "backgroundJobsJobListingReapingBoundaryRecorded",
    "commandHistoryPersistenceBoundaryRecorded",
    "parameterExpansionBoundaryRecorded",
    "environmentVariableExpansionBoundaryRecorded",
    "terminalBackendBoundaryFromPhase568Recorded",
    "operationsReliabilityRetryCancellationBoundaryFromPhase570Recorded",
    "authPermissionsCommandAuthorizationBoundaryFromPhase562Recorded",
    "securityInputSanitizationCommandBoundaryFromPhase563Recorded",
    "secretsEnvExposureBoundaryFromPhase572Recorded",
    "loggingAuditBoundaryFromPhase565Recorded",
    "locusCommandControlSurfaceDisplayBoundaryRecorded",
    "fabricApiBackendCommandEnvelopeBoundaryRecorded",
    "externalHarnessCommandHandoffBoundaryRecorded",
    "noShellRuntime",
    "noReplRuntime",
    "noCommandParserRuntime",
    "noPathLookupRuntime",
    "noProcessSpawn",
    "noBuiltinExecution",
    "noRedirectionPipelineRuntime",
    "noCompletionRuntime",
    "noBackgroundJobRuntime",
    "noHistoryRuntime",
    "noEnvironmentParameterExpansionRuntime",
    "noTerminalBackendRuntime",
    "noMatrixGatewayRuntime",
    "noContentAddressedChunkedResumableP2pTransport",
    "noSqliteRuntime",
    "noSecureDropImplementation",
    "noFabricWebsocketHttpMcpTaskRuntime",
    "noBackendApiServerDatabaseStorageCacheRlsMigration",
    "noEncodedHandoffRuntimeCodecTranslator",
    "noHermesCuaComputerUseRuntime",
    "noLoggerAuditTelemetryHealthRuntime",
    "noInfrastructureDeploymentComplianceAutomation",
    "noTestingCiReleaseAutomation",
    "noFilesystemProcessUiRuntime",
    "noCommandExposure",
    "noBlockedCliBypass",
    "allBlockedAuthorizationFlagsFalse",
    "allUnsafeCommandSurfaceShellPrimitiveRuntimeFlagsFalse",
    "allRuntimeEffectsFalse",
    "allEntriesNonAuthorizing"
  ]) {
    assert.equal(summary[field], true, `${field} should be true`);
  }

  assertNonAuthorizing(fixture);
  assert.equal(
    fixture.recommendedNextPhase,
    "phase-5.75-review-only-embedded-db-query-engine-primitive-contract-boundary-map"
  );
});

test("Phase 5.74 invalid command-surface/shell cases fail closed", () => {
  const valid = createCommandSurfaceShellPrimitiveContractBoundaryMapForReview({
    reviewedAt
  });
  const [firstEntry] = valid.boundaryEntries;
  const invalidCases = [
    {
      name: "malformed-command-surface-shell-primitive-contract-boundary-map-input-rejected",
      input: null
    },
    {
      name: "malformed-command-surface-shell-primitive-contract-boundary-map-input-rejected",
      input: { reviewedAt: "not-a-date" }
    },
    {
      name: "malformed-command-surface-shell-primitive-contract-boundary-map-input-rejected",
      input: { reviewedAt, boundaryEntries: "not-array" }
    },
    {
      name: "missing-required-command-surface-shell-primitive-boundary-entry-rejected",
      input: { reviewedAt, boundaryEntries: [{}] }
    },
    {
      name: "unknown-boundary-family-command-surface-shell-primitive-contract-boundary-map-input-rejected",
      input: {
        reviewedAt,
        boundaryEntries: boundaryEntryPatch({ boundaryFamily: "unknown" })
      }
    },
    {
      name: "unknown-related-system-command-surface-shell-primitive-contract-boundary-map-input-rejected",
      input: {
        reviewedAt,
        boundaryEntries: boundaryEntryPatch({ relatedSystem: "unknown" })
      }
    },
    {
      name: "unknown-current-status-command-surface-shell-primitive-contract-boundary-map-input-rejected",
      input: {
        reviewedAt,
        boundaryEntries: boundaryEntryPatch({ currentStatus: "enabled" })
      }
    },
    {
      name: "authorization-flags-enabled-command-surface-shell-primitive-contract-boundary-map-input-rejected",
      input: {
        reviewedAt,
        boundaryEntries: [
          {
            ...structuredClone(firstEntry),
            explicitBlockedAuthorizationFlags: {
              ...firstEntry.explicitBlockedAuthorizationFlags,
              shellRuntimeAuthorizationGranted: true
            }
          }
        ]
      }
    },
    {
      name: "report-runs-checks-true-command-surface-shell-primitive-contract-boundary-map-input-rejected",
      input: { reviewedAt, reportRunsChecks: true }
    },
    {
      name: "runtime-authorization-attempt-command-surface-shell-primitive-contract-boundary-map-input-rejected",
      input: { reviewedAt, authorizesRuntime: true }
    },
    {
      name: "command-exposure-attempt-command-surface-shell-primitive-contract-boundary-map-input-rejected",
      input: { reviewedAt, commandExposureEnabled: true }
    },
    {
      name: "blocked-cli-bypass-attempt-command-surface-shell-primitive-contract-boundary-map-input-rejected",
      input: { reviewedAt, blockedCliBypassEnabled: true }
    },
    {
      name: "hidden-shell-repl-process-execution-semantics-command-surface-shell-primitive-contract-boundary-map-input-rejected",
      input: { reviewedAt, shellRuntime: {} }
    },
    {
      name: "hidden-path-executable-lookup-semantics-command-surface-shell-primitive-contract-boundary-map-input-rejected",
      input: { reviewedAt, pathLookup: {} }
    },
    {
      name: "hidden-filesystem-read-write-semantics-command-surface-shell-primitive-contract-boundary-map-input-rejected",
      input: { reviewedAt, filesystemRead: {} }
    },
    {
      name: "hidden-env-secrets-exposure-semantics-command-surface-shell-primitive-contract-boundary-map-input-rejected",
      input: { reviewedAt, envReader: {} }
    },
    {
      name: "hidden-pipe-redirection-stdio-semantics-command-surface-shell-primitive-contract-boundary-map-input-rejected",
      input: { reviewedAt, redirectionRuntime: {} }
    },
    {
      name: "hidden-job-control-background-worker-semantics-command-surface-shell-primitive-contract-boundary-map-input-rejected",
      input: { reviewedAt, backgroundJob: {} }
    },
    {
      name: "hidden-command-exposure-or-runtime-authorization-semantics-command-surface-shell-primitive-contract-boundary-map-input-rejected",
      input: { reviewedAt, commandRegistry: {} }
    },
    {
      name: "hidden-backend-api-server-semantics-command-surface-shell-primitive-contract-boundary-map-input-rejected",
      input: { reviewedAt, apiServer: {} }
    },
    {
      name: "hidden-database-storage-cache-write-semantics-command-surface-shell-primitive-contract-boundary-map-input-rejected",
      input: { reviewedAt, databaseClient: {} }
    },
    {
      name: "hidden-auth-session-token-api-key-semantics-command-surface-shell-primitive-contract-boundary-map-input-rejected",
      input: { reviewedAt, apiKey: {} }
    },
    {
      name: "hidden-connector-grant-semantics-command-surface-shell-primitive-contract-boundary-map-input-rejected",
      input: { reviewedAt, connectorGrant: {} }
    },
    {
      name: "hidden-fabric-websocket-http-mcp-task-runtime-semantics-command-surface-shell-primitive-contract-boundary-map-input-rejected",
      input: { reviewedAt, fabricRuntime: {} }
    },
    {
      name: "hidden-secure-drop-implementation-semantics-command-surface-shell-primitive-contract-boundary-map-input-rejected",
      input: { reviewedAt, secureDrop: {} }
    },
    {
      name: "hidden-matrix-gateway-runtime-semantics-command-surface-shell-primitive-contract-boundary-map-input-rejected",
      input: { reviewedAt, matrixClient: {} }
    },
    {
      name: "hidden-content-addressed-chunked-resumable-p2p-transport-semantics-command-surface-shell-primitive-contract-boundary-map-input-rejected",
      input: { reviewedAt, contentAddressedTransport: {} }
    },
    {
      name: "hidden-sqlite-embedded-db-query-runtime-semantics-command-surface-shell-primitive-contract-boundary-map-input-rejected",
      input: { reviewedAt, sqliteRuntime: {} }
    },
    {
      name: "hidden-hermes-cua-computer-use-runtime-semantics-command-surface-shell-primitive-contract-boundary-map-input-rejected",
      input: { reviewedAt, cuaDriver: {} }
    },
    {
      name: "hidden-encoded-handoff-runtime-codec-translator-stego-covert-channel-tokenizer-exploit-bypass-semantics-command-surface-shell-primitive-contract-boundary-map-input-rejected",
      input: { reviewedAt, encodedHandoffRuntime: {} }
    },
    {
      name: "unsafe-command-surface-shell-primitive-runtime-flags-command-surface-shell-primitive-contract-boundary-map-input-rejected",
      input: { reviewedAt, shellRuntimeEnabled: true }
    },
    {
      name: "unsafe-command-surface-shell-primitive-runtime-flags-command-surface-shell-primitive-contract-boundary-map-input-rejected",
      input: {
        reviewedAt,
        boundaryEntries: [
          {
            ...structuredClone(firstEntry),
            unsafeCommandSurfaceShellPrimitiveRuntimeFlags: {
              ...firstEntry.unsafeCommandSurfaceShellPrimitiveRuntimeFlags,
              processSpawnEnabled: true
            }
          }
        ]
      }
    },
    {
      name: "nested-unsafe-flags-command-surface-shell-primitive-contract-boundary-map-input-rejected",
      input: { reviewedAt, runtimeEffect: { sideEffect: true } }
    },
    {
      name: "unknown-top-level-field-command-surface-shell-primitive-contract-boundary-map-input-rejected",
      input: { reviewedAt, unknownField: "not allowed" }
    },
    {
      name: "noncanonical-command-surface-shell-primitive-contract-boundary-map-input-rejected",
      input: {
        reviewedAt,
        boundaryEntries: boundaryEntryPatch({
          boundaryId: "phase5-74.modified.noncanonical"
        })
      }
    }
  ];

  for (const { name, input } of invalidCases) {
    const result = createCommandSurfaceShellPrimitiveContractBoundaryMapForReview(input);
    assert.equal(result.classification, expectedCaseClassifications[name], name);
    assert.equal(result.commandSurfaceShellPrimitiveContractBoundaryMapProduced, false);
    assert.equal(result.commandSurfaceShellPrimitiveContractBoundaryMap, null);
    assert.deepEqual(result.boundaryEntries, []);
    assert.equal(result.reportRunsChecks, false);
    assert.equal(result.nonAuthorizingProof, true);
    assertAllFalse(result.runtimeEffect);
  }
});

test("Phase 5.74 enabled runtime flags cannot authorize shell behavior", () => {
  for (const field of unsafeFlagCases) {
    const result = createCommandSurfaceShellPrimitiveContractBoundaryMapForReview({
      reviewedAt,
      [field]: true
    });

    assert.equal(
      result.classification,
      "unsafe_command_surface_shell_primitive_runtime_flags_command_surface_shell_primitive_contract_boundary_map_input_rejected",
      field
    );
    assert.equal(result.commandSurfaceShellPrimitiveContractBoundaryMapProduced, false);
    assert.equal(result[field], false, field);
    assert.equal(result.reportRunsChecks, false);
  }
});

test("Phase 5.74 boundary map stays non-authorizing and runtime-blocked", async () => {
  const fixture = await readFixture();
  const summary = fixture.boundaryMapSummary;

  for (const field of [
    "commandSurfaceShellPrimitiveBoundaryMetadataOnly",
    "noLiveCommandSurfaceShellPrimitiveRuntimePerformed",
    "allBlockedAuthorizationFlagsFalse",
    "allUnsafeCommandSurfaceShellPrimitiveRuntimeFlagsFalse",
    "allRuntimeEffectsFalse",
    "allEntriesNonAuthorizing"
  ]) {
    assert.equal(summary[field], true, `${field} should be true`);
  }

  assert.equal(fixture.reviewOnly, true);
  assert.equal(fixture.metadataOnly, true);
  assert.equal(fixture.authoritative, false);
  assert.equal(fixture.commandSurfaceShellPrimitiveContractBoundaryMapOnly, true);
  assert.equal(fixture.commandSurfaceShellPrimitiveContractBoundaryMapProduced, true);
  assert.equal(fixture.reportRunsChecks, false);
  assertNonAuthorizing(fixture);
});

test("serve-runtime remains default-blocked and dry-run cannot bypass Phase 5.74", async () => {
  const direct = await expectCliFailure(["serve-runtime"]);
  assert.notEqual(direct.code, 0);
  assert.equal(direct.stdout, "");

  const dryRun = await expectCliFailure(["serve-runtime", "--dry-run"]);
  assert.notEqual(dryRun.code, 0);
  assert.equal(dryRun.stdout, "");
});

test("Phase 5.74 shell and command-surface command names remain rejected", async () => {
  for (const command of commandProbes) {
    const error = await expectCliFailure([command]);
    assert.notEqual(error.code, 0, command);
    assert.equal(error.stdout, "", command);
  }
});

test("Phase 5.74 does not change CLI, Rust, Fabric, package, or consumer source", async () => {
  const files = [
    "apps/cli/src/index.mjs",
    "crates/ardyn-host/src/lib.rs",
    "crates/ardyn-host/src/stdio_runtime/mod.rs",
    "packages/fabric/src/index.mjs",
    "package.json"
  ];

  for (const file of files) {
    const [baseline, current] = await Promise.all([
      execFileAsync("git", ["show", `${phase574BaselineCommit}:${file}`], {
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
