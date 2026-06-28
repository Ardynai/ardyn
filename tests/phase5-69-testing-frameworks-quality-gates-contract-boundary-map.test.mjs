import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";
import {
  TESTING_FRAMEWORKS_QUALITY_GATES_CONTRACT_BOUNDARY_MAP_SCHEMA,
  createTestingFrameworksQualityGatesContractBoundaryMapForReview
} from "../packages/core/src/index.mjs";

const execFileAsync = promisify(execFile);
const phase569BaselineCommit = "7794cddf5d3ee31748fcab881a1b91e70847351d";
const reviewedAt = "2026-06-27T00:00:00.000Z";
const repoRootUrl = new URL("../", import.meta.url);
const repoRoot = fileURLToPath(repoRootUrl);
const cliPath = fileURLToPath(new URL("../apps/cli/src/index.mjs", import.meta.url));
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-69/testing-frameworks-quality-gates-contract-boundary-map.json",
  import.meta.url
);

const expectedCaseClassifications = Object.freeze({
  "valid-testing-frameworks-quality-gates-contract-boundary-map":
    "valid_testing_frameworks_quality_gates_contract_boundary_map_runtime_still_blocked",
  "malformed-testing-frameworks-quality-gates-contract-boundary-map-input-rejected":
    "malformed_testing_frameworks_quality_gates_contract_boundary_map_input_rejected",
  "missing-required-testing-frameworks-quality-gates-contract-boundary-entry-rejected":
    "missing_required_testing_frameworks_quality_gates_contract_boundary_entry_rejected",
  "unknown-top-level-field-testing-frameworks-quality-gates-contract-boundary-map-input-rejected":
    "unknown_top_level_field_testing_frameworks_quality_gates_contract_boundary_map_input_rejected",
  "unknown-boundary-family-testing-frameworks-quality-gates-contract-boundary-map-input-rejected":
    "unknown_boundary_family_testing_frameworks_quality_gates_contract_boundary_map_input_rejected",
  "unknown-related-system-testing-frameworks-quality-gates-contract-boundary-map-input-rejected":
    "unknown_related_system_testing_frameworks_quality_gates_contract_boundary_map_input_rejected",
  "unknown-current-status-testing-frameworks-quality-gates-contract-boundary-map-input-rejected":
    "unknown_current_status_testing_frameworks_quality_gates_contract_boundary_map_input_rejected",
  "authorization-flags-enabled-testing-frameworks-quality-gates-contract-boundary-map-input-rejected":
    "authorization_flags_enabled_testing_frameworks_quality_gates_contract_boundary_map_input_rejected",
  "report-runs-checks-true-testing-frameworks-quality-gates-contract-boundary-map-input-rejected":
    "report_runs_checks_true_testing_frameworks_quality_gates_contract_boundary_map_input_rejected",
  "runtime-authorization-attempt-testing-frameworks-quality-gates-contract-boundary-map-input-rejected":
    "runtime_authorization_attempt_testing_frameworks_quality_gates_contract_boundary_map_input_rejected",
  "command-exposure-attempt-testing-frameworks-quality-gates-contract-boundary-map-input-rejected":
    "command_exposure_attempt_testing_frameworks_quality_gates_contract_boundary_map_input_rejected",
  "blocked-cli-bypass-attempt-testing-frameworks-quality-gates-contract-boundary-map-input-rejected":
    "blocked_cli_bypass_attempt_testing_frameworks_quality_gates_contract_boundary_map_input_rejected",
  "hidden-test-harness-execution-semantics-testing-frameworks-quality-gates-contract-boundary-map-input-rejected":
    "hidden_test_harness_execution_semantics_testing_frameworks_quality_gates_contract_boundary_map_input_rejected",
  "hidden-ci-release-automation-semantics-testing-frameworks-quality-gates-contract-boundary-map-input-rejected":
    "hidden_ci_release_automation_semantics_testing_frameworks_quality_gates_contract_boundary_map_input_rejected",
  "hidden-browser-computer-use-cua-driver-execution-semantics-testing-frameworks-quality-gates-contract-boundary-map-input-rejected":
    "hidden_browser_computer_use_cua_driver_execution_semantics_testing_frameworks_quality_gates_contract_boundary_map_input_rejected",
  "hidden-model-eval-training-finetuning-semantics-testing-frameworks-quality-gates-contract-boundary-map-input-rejected":
    "hidden_model_eval_training_finetuning_semantics_testing_frameworks_quality_gates_contract_boundary_map_input_rejected",
  "hidden-external-service-lookup-semantics-testing-frameworks-quality-gates-contract-boundary-map-input-rejected":
    "hidden_external_service_lookup_semantics_testing_frameworks_quality_gates_contract_boundary_map_input_rejected",
  "hidden-backend-api-server-semantics-testing-frameworks-quality-gates-contract-boundary-map-input-rejected":
    "hidden_backend_api_server_semantics_testing_frameworks_quality_gates_contract_boundary_map_input_rejected",
  "hidden-database-storage-cache-write-semantics-testing-frameworks-quality-gates-contract-boundary-map-input-rejected":
    "hidden_database_storage_cache_write_semantics_testing_frameworks_quality_gates_contract_boundary_map_input_rejected",
  "hidden-auth-session-token-api-key-semantics-testing-frameworks-quality-gates-contract-boundary-map-input-rejected":
    "hidden_auth_session_token_api_key_semantics_testing_frameworks_quality_gates_contract_boundary_map_input_rejected",
  "hidden-connector-grant-semantics-testing-frameworks-quality-gates-contract-boundary-map-input-rejected":
    "hidden_connector_grant_semantics_testing_frameworks_quality_gates_contract_boundary_map_input_rejected",
  "hidden-fabric-websocket-http-mcp-task-runtime-semantics-testing-frameworks-quality-gates-contract-boundary-map-input-rejected":
    "hidden_fabric_websocket_http_mcp_task_runtime_semantics_testing_frameworks_quality_gates_contract_boundary_map_input_rejected",
  "hidden-secure-drop-implementation-semantics-testing-frameworks-quality-gates-contract-boundary-map-input-rejected":
    "hidden_secure_drop_implementation_semantics_testing_frameworks_quality_gates_contract_boundary_map_input_rejected",
  "hidden-encoded-handoff-codec-translator-stego-covert-channel-tokenizer-exploit-bypass-semantics-testing-frameworks-quality-gates-contract-boundary-map-input-rejected":
    "hidden_encoded_handoff_codec_translator_stego_covert_channel_tokenizer_exploit_bypass_semantics_testing_frameworks_quality_gates_contract_boundary_map_input_rejected",
  "hidden-logger-audit-transcript-telemetry-external-sink-semantics-testing-frameworks-quality-gates-contract-boundary-map-input-rejected":
    "hidden_logger_audit_transcript_telemetry_external_sink_semantics_testing_frameworks_quality_gates_contract_boundary_map_input_rejected",
  "hidden-health-backup-restore-failover-scheduler-process-supervisor-semantics-testing-frameworks-quality-gates-contract-boundary-map-input-rejected":
    "hidden_health_backup_restore_failover_scheduler_process_supervisor_semantics_testing_frameworks_quality_gates_contract_boundary_map_input_rejected",
  "hidden-infrastructure-deployment-compliance-pii-retention-export-semantics-testing-frameworks-quality-gates-contract-boundary-map-input-rejected":
    "hidden_infrastructure_deployment_compliance_pii_retention_export_semantics_testing_frameworks_quality_gates_contract_boundary_map_input_rejected",
  "hidden-agent-mode-profile-skillhub-background-subagent-fusion-front-desk-semantics-testing-frameworks-quality-gates-contract-boundary-map-input-rejected":
    "hidden_agent_mode_profile_skillhub_background_subagent_fusion_front_desk_semantics_testing_frameworks_quality_gates_contract_boundary_map_input_rejected",
  "unsafe-testing-frameworks-quality-gates-runtime-flags-testing-frameworks-quality-gates-contract-boundary-map-input-rejected":
    "unsafe_testing_frameworks_quality_gates_runtime_flags_testing_frameworks_quality_gates_contract_boundary_map_input_rejected",
  "nested-unsafe-flags-testing-frameworks-quality-gates-contract-boundary-map-input-rejected":
    "nested_unsafe_flags_testing_frameworks_quality_gates_contract_boundary_map_input_rejected",
  "noncanonical-testing-frameworks-quality-gates-contract-boundary-map-input-rejected":
    "noncanonical_testing_frameworks_quality_gates_contract_boundary_map_input_rejected"
});

const expectedBoundaryFamilies = Object.freeze([
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

const expectedRelatedSystems = Object.freeze([
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

const expectedStatusValues = Object.freeze([
  "metadata_only",
  "covered_by_existing_validation",
  "blocked",
  "future_contract_required"
]);

const commandProbes = Object.freeze([
  "testing-frameworks-quality-gates-contract-boundary-map",
  "test-runner-runtime",
  "integration-test-runner",
  "e2e-runner",
  "browser-test-runner",
  "computer-use-test-runner",
  "cua-driver-test-runtime",
  "chaos-runner",
  "stress-runner",
  "model-eval-runtime",
  "ci-pipeline-runtime",
  "release-automation-runtime",
  "artifact-upload-runtime",
  "package-export-runtime",
  "external-service-test-runtime",
  "live-dependency-update-runtime",
  "patch-automation-runtime"
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
  "uiFrontendBrowserRenderingImplemented"
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
    createTestingFrameworksQualityGatesContractBoundaryMapForReview({
      reviewedAt
    });
  const runtimeFlagNames = Object.keys(
    valid.boundaryEntries[0].unsafeTestingQualityGateRuntimeFlags
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
    createTestingFrameworksQualityGatesContractBoundaryMapForReview({
      reviewedAt
    }).boundaryEntries;

  return [{ ...structuredClone(entry), ...patch }];
}

test("Phase 5.69 testing-frameworks/quality-gates boundary map fixture is deterministic", async () => {
  const fixture = await readFixture();
  const generated =
    createTestingFrameworksQualityGatesContractBoundaryMapForReview({
      reviewedAt
    });

  assert.deepEqual(fixture, generated);
  assert.equal(
    fixture.schema,
    TESTING_FRAMEWORKS_QUALITY_GATES_CONTRACT_BOUNDARY_MAP_SCHEMA
  );
  assert.equal(fixture.reviewedAt, reviewedAt);
  assert.equal(
    fixture.classification,
    expectedCaseClassifications[
      "valid-testing-frameworks-quality-gates-contract-boundary-map"
    ]
  );
  assert.equal(
    fixture.testingFrameworksQualityGatesContractBoundaryMapProduced,
    true
  );
  assert.equal(
    fixture.testingFrameworksQualityGatesContractBoundaryMapMode,
    "review-only"
  );
  assert.equal(fixture.boundaryEntries.length, 31);
  assertNonAuthorizing(fixture);
});

test("Phase 5.69 covers requested families, systems, statuses, and evidence boundaries", async () => {
  const fixture = await readFixture();
  const state = fixture.testingFrameworksQualityGatesContractBoundaryMap;
  const summary = fixture.boundaryMapSummary;

  assert.deepEqual(summary.boundaryFamilies, expectedBoundaryFamilies);
  assert.deepEqual(summary.relatedSystems, expectedRelatedSystems);
  assert.deepEqual(summary.currentStatusValues, expectedStatusValues);
  assert.equal(
    state.sourcePhaseContext.productionReadinessTestingFrameworksItemDeferred,
    true
  );
  assert.equal(state.sourcePhaseContext.noNewTestRunnerImplemented, true);
  assert.equal(state.sourcePhaseContext.noCiReleaseAutomationImplemented, true);
  assert.equal(state.sourcePhaseContext.noRuntimeHarnessImplemented, true);

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
    assert.match(entry.boundaryId, /^phase5-69\./);
    assert.ok(expectedBoundaryFamilies.includes(entry.boundaryFamily));
    assert.ok(expectedRelatedSystems.includes(entry.relatedSystem));
    assert.ok(expectedStatusValues.includes(entry.currentStatus));
    assert.equal(entry.testingFrameworksQualityGatesBoundaryMetadataOnly, true);
    assert.equal(
      entry.noLiveTestingFrameworksQualityGatesRuntimePerformed,
      true
    );
    assert.equal(entry.nonAuthorizingProof, true);
    assertAllFalse(entry.explicitBlockedAuthorizationFlags);
    assertAllFalse(entry.unsafeTestingQualityGateRuntimeFlags);
    assertAllFalse(entry.runtimeEffect);
    assert.ok(entry.forbiddenCurrentBehavior.includes("new test runner"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("CI pipeline creation"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("model-eval runtime"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("command exposure"));
  }

  assert.ok(
    fixture.boundaryEntries.some(
      (entry) =>
        entry.boundaryFamily === "computer_use_test_contract" &&
        entry.relatedSystem === "cua-driver-reference" &&
        entry.currentStatus === "blocked"
    )
  );
  assert.ok(
    fixture.boundaryEntries.some(
      (entry) =>
        entry.boundaryFamily === "model_eval_contract" &&
        entry.currentStatus === "future_contract_required" &&
        /post-launch\/advisory/.test(entry.modelEvalExpectation)
    )
  );
});

test("Phase 5.69 invalid testing-frameworks/quality-gates cases fail closed", () => {
  const valid =
    createTestingFrameworksQualityGatesContractBoundaryMapForReview({
      reviewedAt
    });
  const firstEntry = valid.boundaryEntries[0];
  const missingBoundaryIdEntry = { ...firstEntry };
  delete missingBoundaryIdEntry.boundaryId;

  const cases = [
    [
      null,
      "malformed-testing-frameworks-quality-gates-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt: "not-a-date" },
      "malformed-testing-frameworks-quality-gates-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, boundaryEntries: [missingBoundaryIdEntry] },
      "missing-required-testing-frameworks-quality-gates-contract-boundary-entry-rejected"
    ],
    [
      { reviewedAt, unknownField: true },
      "unknown-top-level-field-testing-frameworks-quality-gates-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, boundaryEntries: boundaryEntryPatch({ boundaryFamily: "test_runner" }) },
      "unknown-boundary-family-testing-frameworks-quality-gates-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, boundaryEntries: boundaryEntryPatch({ relatedSystem: "ci" }) },
      "unknown-related-system-testing-frameworks-quality-gates-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, boundaryEntries: boundaryEntryPatch({ currentStatus: "enabled" }) },
      "unknown-current-status-testing-frameworks-quality-gates-contract-boundary-map-input-rejected"
    ],
    [
      {
        reviewedAt,
        boundaryEntries: boundaryEntryPatch({
          explicitBlockedAuthorizationFlags: {
            ...firstEntry.explicitBlockedAuthorizationFlags,
            testRunnerAuthorizationGranted: true
          }
        })
      },
      "authorization-flags-enabled-testing-frameworks-quality-gates-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, reportRunsChecks: true },
      "report-runs-checks-true-testing-frameworks-quality-gates-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, runtimeAuthorized: true },
      "runtime-authorization-attempt-testing-frameworks-quality-gates-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, commandExposureEnabled: true },
      "command-exposure-attempt-testing-frameworks-quality-gates-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, blockedCliBypassEnabled: true },
      "blocked-cli-bypass-attempt-testing-frameworks-quality-gates-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, testRunner: { enabled: false } },
      "hidden-test-harness-execution-semantics-testing-frameworks-quality-gates-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, ciPipeline: { enabled: false } },
      "hidden-ci-release-automation-semantics-testing-frameworks-quality-gates-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, browserRunner: { enabled: false } },
      "hidden-browser-computer-use-cua-driver-execution-semantics-testing-frameworks-quality-gates-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, modelEvalRunner: { enabled: false } },
      "hidden-model-eval-training-finetuning-semantics-testing-frameworks-quality-gates-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, externalServiceTest: { enabled: false } },
      "hidden-external-service-lookup-semantics-testing-frameworks-quality-gates-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, httpServer: { enabled: false } },
      "hidden-backend-api-server-semantics-testing-frameworks-quality-gates-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, databaseUrl: "postgres://example.invalid/db" },
      "hidden-database-storage-cache-write-semantics-testing-frameworks-quality-gates-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, sessionToken: "token" },
      "hidden-auth-session-token-api-key-semantics-testing-frameworks-quality-gates-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, connectorGrant: { enabled: false } },
      "hidden-connector-grant-semantics-testing-frameworks-quality-gates-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, fabricBus: { enabled: false } },
      "hidden-fabric-websocket-http-mcp-task-runtime-semantics-testing-frameworks-quality-gates-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, secureDropKeyring: { enabled: false } },
      "hidden-secure-drop-implementation-semantics-testing-frameworks-quality-gates-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, encodedHandoffRuntime: { enabled: false } },
      "hidden-encoded-handoff-codec-translator-stego-covert-channel-tokenizer-exploit-bypass-semantics-testing-frameworks-quality-gates-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, loggerRuntime: { enabled: false } },
      "hidden-logger-audit-transcript-telemetry-external-sink-semantics-testing-frameworks-quality-gates-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, healthChecker: { enabled: false } },
      "hidden-health-backup-restore-failover-scheduler-process-supervisor-semantics-testing-frameworks-quality-gates-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, terraformPlan: { enabled: false } },
      "hidden-infrastructure-deployment-compliance-pii-retention-export-semantics-testing-frameworks-quality-gates-contract-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, agentModeRuntime: { enabled: false } },
      "hidden-agent-mode-profile-skillhub-background-subagent-fusion-front-desk-semantics-testing-frameworks-quality-gates-contract-boundary-map-input-rejected"
    ],
    [
      {
        reviewedAt,
        boundaryEntries: boundaryEntryPatch({
          unsafeTestingQualityGateRuntimeFlags: {
            ...firstEntry.unsafeTestingQualityGateRuntimeFlags,
            testRunnerEnabled: true
          }
        })
      },
      "unsafe-testing-frameworks-quality-gates-runtime-flags-testing-frameworks-quality-gates-contract-boundary-map-input-rejected"
    ],
    [
      {
        reviewedAt,
        boundaryEntries: boundaryEntryPatch({
          runtimeEffect: { ...firstEntry.runtimeEffect, runtimeReady: true }
        })
      },
      "nested-unsafe-flags-testing-frameworks-quality-gates-contract-boundary-map-input-rejected"
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
      "noncanonical-testing-frameworks-quality-gates-contract-boundary-map-input-rejected"
    ]
  ];

  for (const [input, caseKey] of cases) {
    const result =
      createTestingFrameworksQualityGatesContractBoundaryMapForReview(input);
    assert.equal(
      result.classification,
      expectedCaseClassifications[caseKey],
      caseKey
    );
    assert.equal(
      result.testingFrameworksQualityGatesContractBoundaryMapProduced,
      false,
      caseKey
    );
    assert.equal(result.boundaryEntries.length, 0, caseKey);
    assertNonAuthorizing(result);
  }
});

test("Phase 5.69 enabled runtime flags cannot authorize quality-gate behavior", () => {
  for (const field of unsafeFlagCases) {
    const result =
      createTestingFrameworksQualityGatesContractBoundaryMapForReview({
        reviewedAt,
        [field]: true
      });

    assert.equal(
      result.classification,
      expectedCaseClassifications[
        "unsafe-testing-frameworks-quality-gates-runtime-flags-testing-frameworks-quality-gates-contract-boundary-map-input-rejected"
      ],
      field
    );
    assert.equal(
      result.testingFrameworksQualityGatesContractBoundaryMapProduced,
      false,
      field
    );
    assertNonAuthorizing(result);
  }
});

test("Phase 5.69 boundary map stays non-authorizing and runtime-blocked", async () => {
  const fixture = await readFixture();
  const summary = fixture.boundaryMapSummary;

  for (const field of [
    "phase548TestingFrameworksCoverageItemRepresented",
    "testingFrameworksQualityGatesBoundaryMetadataOnly",
    "noLiveTestingFrameworksQualityGatesRuntimePerformed",
    "currentUnitSchemaReportStatusValidationEvidenceRecorded",
    "currentNpmCargoValidationEvidenceRecorded",
    "currentSemgrepNpmAuditCargoAuditCargoMacheteEvidenceRecorded",
    "focusedFixtureConformanceBoundaryRecorded",
    "adjacentRegressionGateBoundaryRecorded",
    "runtimeBlockedGateBoundaryRecorded",
    "blockedCommandMatrixBoundaryRecorded",
    "ciReleaseGateBoundaryRecorded",
    "noNewTestRunner",
    "noCiPipelineCreation",
    "noReleaseAutomation",
    "noBrowserComputerUseCuaDriverTestRuntime",
    "noModelEvalTrainingFinetuningRuntime",
    "noChaosStressE2eRuntime",
    "noExternalServiceTestRuntime",
    "noPackageExportArtifactUploadLiveDependencyUpdatePatchAutomation",
    "noRuntimeIntegrationBackendStorageBehavior",
    "noFabricSecureDropEncodedHandoffRuntime",
    "noHermesCuaAgentModeProfileSkillhubBackgroundFusionFrontDeskRuntime",
    "noLoggerAuditTelemetryHealthInfrastructureRuntime",
    "noCommandExposure",
    "noBlockedCliBypass",
    "allBlockedAuthorizationFlagsFalse",
    "allUnsafeTestingQualityGateRuntimeFlagsFalse",
    "allRuntimeEffectsFalse",
    "allEntriesNonAuthorizing"
  ]) {
    assert.equal(summary[field], true, `${field} should be true`);
  }

  assertNonAuthorizing(fixture);
  assert.equal(
    fixture.recommendedNextPhase,
    "phase-5.70-review-only-operations-reliability-contract-boundary-map"
  );
});

test("serve-runtime remains default-blocked and dry-run cannot bypass Phase 5.69", async () => {
  const direct = await expectCliFailure(["serve-runtime"]);
  assert.notEqual(direct.code, 0);
  assert.equal(direct.stdout, "");

  const dryRun = await expectCliFailure(["serve-runtime", "--dry-run"]);
  assert.notEqual(dryRun.code, 0);
  assert.equal(dryRun.stdout, "");
});

test("Phase 5.69 testing/quality-gate command names remain rejected", async () => {
  for (const command of commandProbes) {
    const error = await expectCliFailure([command]);
    assert.notEqual(error.code, 0, command);
    assert.equal(error.stdout, "", command);
  }
});

test("Phase 5.69 does not change CLI, Rust, Fabric, package, or consumer source", async () => {
  const files = [
    "apps/cli/src/index.mjs",
    "crates/ardyn-host/src/lib.rs",
    "crates/ardyn-host/src/stdio_runtime/mod.rs",
    "packages/fabric/src/index.mjs",
    "package.json"
  ];

  for (const file of files) {
    const [baseline, current] = await Promise.all([
      execFileAsync("git", ["show", `${phase569BaselineCommit}:${file}`], {
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
