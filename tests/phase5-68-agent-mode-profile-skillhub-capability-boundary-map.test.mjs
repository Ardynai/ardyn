import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";
import {
  AGENT_MODE_PROFILE_SKILLHUB_CAPABILITY_BOUNDARY_MAP_SCHEMA,
  createAgentModeProfileSkillhubCapabilityBoundaryMapForReview
} from "../packages/core/src/index.mjs";

const execFileAsync = promisify(execFile);
const phase568BaselineCommit = "1698d7cadb10d3c57beb4248dba8d3ab9b90cbdb";
const reviewedAt = "2026-06-25T00:00:00.000Z";
const repoRootUrl = new URL("../", import.meta.url);
const repoRoot = fileURLToPath(repoRootUrl);
const cliPath = fileURLToPath(new URL("../apps/cli/src/index.mjs", import.meta.url));
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-68/agent-mode-profile-skillhub-capability-boundary-map.json",
  import.meta.url
);

const expectedCaseClassifications = Object.freeze({
  "valid-agent-mode-profile-skillhub-capability-boundary-map":
    "valid_agent_mode_profile_skillhub_capability_boundary_map_runtime_still_blocked",
  "malformed-agent-mode-profile-skillhub-capability-boundary-map-input-rejected":
    "malformed_agent_mode_profile_skillhub_capability_boundary_map_input_rejected",
  "missing-required-agent-mode-profile-skillhub-capability-boundary-entry-rejected":
    "missing_required_agent_mode_profile_skillhub_capability_boundary_entry_rejected",
  "unknown-top-level-field-agent-mode-profile-skillhub-capability-boundary-map-input-rejected":
    "unknown_top_level_field_agent_mode_profile_skillhub_capability_boundary_map_input_rejected",
  "unknown-boundary-family-agent-mode-profile-skillhub-capability-boundary-map-input-rejected":
    "unknown_boundary_family_agent_mode_profile_skillhub_capability_boundary_map_input_rejected",
  "unknown-related-system-agent-mode-profile-skillhub-capability-boundary-map-input-rejected":
    "unknown_related_system_agent_mode_profile_skillhub_capability_boundary_map_input_rejected",
  "unknown-current-status-agent-mode-profile-skillhub-capability-boundary-map-input-rejected":
    "unknown_current_status_agent_mode_profile_skillhub_capability_boundary_map_input_rejected",
  "authorization-flags-enabled-agent-mode-profile-skillhub-capability-boundary-map-input-rejected":
    "authorization_flags_enabled_agent_mode_profile_skillhub_capability_boundary_map_input_rejected",
  "report-runs-checks-true-agent-mode-profile-skillhub-capability-boundary-map-input-rejected":
    "report_runs_checks_true_agent_mode_profile_skillhub_capability_boundary_map_input_rejected",
  "runtime-authorization-attempt-agent-mode-profile-skillhub-capability-boundary-map-input-rejected":
    "runtime_authorization_attempt_agent_mode_profile_skillhub_capability_boundary_map_input_rejected",
  "command-exposure-attempt-agent-mode-profile-skillhub-capability-boundary-map-input-rejected":
    "command_exposure_attempt_agent_mode_profile_skillhub_capability_boundary_map_input_rejected",
  "blocked-cli-bypass-attempt-agent-mode-profile-skillhub-capability-boundary-map-input-rejected":
    "blocked_cli_bypass_attempt_agent_mode_profile_skillhub_capability_boundary_map_input_rejected",
  "hidden-cua-driver-execution-semantics-agent-mode-profile-skillhub-capability-boundary-map-input-rejected":
    "hidden_cua_driver_execution_semantics_agent_mode_profile_skillhub_capability_boundary_map_input_rejected",
  "hidden-computer-use-semantics-agent-mode-profile-skillhub-capability-boundary-map-input-rejected":
    "hidden_computer_use_semantics_agent_mode_profile_skillhub_capability_boundary_map_input_rejected",
  "hidden-input-automation-semantics-agent-mode-profile-skillhub-capability-boundary-map-input-rejected":
    "hidden_input_automation_semantics_agent_mode_profile_skillhub_capability_boundary_map_input_rejected",
  "hidden-action-approval-semantics-agent-mode-profile-skillhub-capability-boundary-map-input-rejected":
    "hidden_action_approval_semantics_agent_mode_profile_skillhub_capability_boundary_map_input_rejected",
  "hidden-multimodal-return-semantics-agent-mode-profile-skillhub-capability-boundary-map-input-rejected":
    "hidden_multimodal_return_semantics_agent_mode_profile_skillhub_capability_boundary_map_input_rejected",
  "hidden-telemetry-driver-update-semantics-agent-mode-profile-skillhub-capability-boundary-map-input-rejected":
    "hidden_telemetry_driver_update_semantics_agent_mode_profile_skillhub_capability_boundary_map_input_rejected",
  "hidden-background-subagent-execution-semantics-agent-mode-profile-skillhub-capability-boundary-map-input-rejected":
    "hidden_background_subagent_execution_semantics_agent_mode_profile_skillhub_capability_boundary_map_input_rejected",
  "hidden-conversation-concurrency-semantics-agent-mode-profile-skillhub-capability-boundary-map-input-rejected":
    "hidden_conversation_concurrency_semantics_agent_mode_profile_skillhub_capability_boundary_map_input_rejected",
  "hidden-profile-personality-session-context-loading-semantics-agent-mode-profile-skillhub-capability-boundary-map-input-rejected":
    "hidden_profile_personality_session_context_loading_semantics_agent_mode_profile_skillhub_capability_boundary_map_input_rejected",
  "hidden-skill-loading-install-scan-inventory-semantics-agent-mode-profile-skillhub-capability-boundary-map-input-rejected":
    "hidden_skill_loading_install_scan_inventory_semantics_agent_mode_profile_skillhub_capability_boundary_map_input_rejected",
  "hidden-gateway-scheduled-terminal-semantics-agent-mode-profile-skillhub-capability-boundary-map-input-rejected":
    "hidden_gateway_scheduled_terminal_semantics_agent_mode_profile_skillhub_capability_boundary_map_input_rejected",
  "hidden-model-routing-fusion-judge-front-desk-semantics-agent-mode-profile-skillhub-capability-boundary-map-input-rejected":
    "hidden_model_routing_fusion_judge_front_desk_semantics_agent_mode_profile_skillhub_capability_boundary_map_input_rejected",
  "hidden-acp-a2a-adapter-registry-semantics-agent-mode-profile-skillhub-capability-boundary-map-input-rejected":
    "hidden_acp_a2a_adapter_registry_semantics_agent_mode_profile_skillhub_capability_boundary_map_input_rejected",
  "hidden-backend-api-server-storage-auth-connector-semantics-agent-mode-profile-skillhub-capability-boundary-map-input-rejected":
    "hidden_backend_api_server_storage_auth_connector_semantics_agent_mode_profile_skillhub_capability_boundary_map_input_rejected",
  "hidden-fabric-secure-drop-encoded-handoff-runtime-semantics-agent-mode-profile-skillhub-capability-boundary-map-input-rejected":
    "hidden_fabric_secure_drop_encoded_handoff_runtime_semantics_agent_mode_profile_skillhub_capability_boundary_map_input_rejected",
  "hidden-logger-audit-telemetry-health-infrastructure-semantics-agent-mode-profile-skillhub-capability-boundary-map-input-rejected":
    "hidden_logger_audit_telemetry_health_infrastructure_semantics_agent_mode_profile_skillhub_capability_boundary_map_input_rejected",
  "unsafe-agent-mode-profile-skillhub-capability-runtime-flags-agent-mode-profile-skillhub-capability-boundary-map-input-rejected":
    "unsafe_agent_mode_profile_skillhub_capability_runtime_flags_agent_mode_profile_skillhub_capability_boundary_map_input_rejected",
  "nested-unsafe-flags-agent-mode-profile-skillhub-capability-boundary-map-input-rejected":
    "nested_unsafe_flags_agent_mode_profile_skillhub_capability_boundary_map_input_rejected",
  "noncanonical-agent-mode-profile-skillhub-capability-boundary-map-input-rejected":
    "noncanonical_agent_mode_profile_skillhub_capability_boundary_map_input_rejected"
});

const expectedBoundaryFamilies = Object.freeze([
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

const expectedCuaActions = Object.freeze([
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

const commandProbes = Object.freeze([
  "agent-mode-profile-skillhub-capability-boundary-map",
  "cua-driver-runtime",
  "cua-driver-mcp-stdio",
  "cua-driver-install",
  "cua-driver-update",
  "computer-use-runtime",
  "desktop-control-runtime",
  "browser-control-runtime",
  "screenshot-capture-runtime",
  "accessibility-tree-runtime",
  "background-subagent-runtime",
  "profile-loader-runtime",
  "skillhub-install-runtime",
  "mcp-inventory-scanner",
  "plugin-inventory-scanner",
  "provider-inventory-scanner",
  "gateway-messaging-runtime",
  "scheduled-automation-runtime",
  "terminal-backend-runtime",
  "model-router-runtime",
  "fusion-judge-runtime",
  "front-desk-model-runtime",
  "acp-a2a-runtime"
]);

const unsafeFlagCases = Object.freeze([
  "runtimeExecutionEnabled",
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
  const valid = createAgentModeProfileSkillhubCapabilityBoundaryMapForReview({
    reviewedAt
  });
  const runtimeFlagNames = Object.keys(
    valid.boundaryEntries[0].unsafeAgentModeCapabilityRuntimeFlags
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
    createAgentModeProfileSkillhubCapabilityBoundaryMapForReview({
      reviewedAt
    }).boundaryEntries;

  return [{ ...structuredClone(entry), ...patch }];
}

test("Phase 5.68 agent mode/profile/skillhub capability boundary map fixture is deterministic", async () => {
  const fixture = await readFixture();
  const generated =
    createAgentModeProfileSkillhubCapabilityBoundaryMapForReview({
      reviewedAt
    });

  assert.deepEqual(fixture, generated);
  assert.equal(
    fixture.schema,
    AGENT_MODE_PROFILE_SKILLHUB_CAPABILITY_BOUNDARY_MAP_SCHEMA
  );
  assert.equal(fixture.reviewedAt, reviewedAt);
  assert.equal(
    fixture.classification,
    expectedCaseClassifications[
      "valid-agent-mode-profile-skillhub-capability-boundary-map"
    ]
  );
  assert.equal(
    fixture.agentModeProfileSkillhubCapabilityBoundaryMapProduced,
    true
  );
  assert.equal(
    fixture.agentModeProfileSkillhubCapabilityBoundaryMapMode,
    "review-only"
  );
  assert.equal(fixture.boundaryEntries.length, 47);
  assertNonAuthorizing(fixture);
});

test("Phase 5.68 covers requested families, systems, CUA actions, and reference-only sources", async () => {
  const fixture = await readFixture();
  const state = fixture.agentModeProfileSkillhubCapabilityBoundaryMap;
  const summary = fixture.boundaryMapSummary;

  assert.deepEqual(summary.boundaryFamilies, expectedBoundaryFamilies);
  assert.deepEqual(summary.relatedSystems, expectedRelatedSystems);
  assert.deepEqual(summary.futureCuaDriverComputerUseActions, expectedCuaActions);
  assert.equal(state.sourcePhaseContext.hermesReferenceOnly, true);
  assert.equal(state.sourcePhaseContext.cuaDriverReferenceOnly, true);
  assert.equal(state.sourcePhaseContext.promptGuideCategoryOnly, true);
  assert.equal(state.sourcePhaseContext.externalCodeImported, false);
  assert.equal(state.sourcePhaseContext.externalCodeVendored, false);
  assert.equal(state.sourcePhaseContext.externalRepoModified, false);

  for (const family of expectedBoundaryFamilies) {
    assert.ok(summary.countByFamily[family] >= 1, family);
  }

  for (const system of expectedRelatedSystems) {
    assert.ok(summary.countByRelatedSystem[system] >= 1, system);
  }

  for (const entry of fixture.boundaryEntries) {
    assert.match(entry.boundaryId, /^phase5-68\./);
    assert.ok(expectedBoundaryFamilies.includes(entry.boundaryFamily));
    assert.ok(expectedRelatedSystems.includes(entry.relatedSystem));
    assert.ok(
      ["metadata_only", "blocked", "future_contract_required"].includes(
        entry.currentStatus
      )
    );
    assert.deepEqual(entry.futureCuaDriverComputerUseActions, expectedCuaActions);
    assert.equal(
      entry.agentModeProfileSkillhubCapabilityBoundaryMetadataOnly,
      true
    );
    assert.equal(
      entry.noLiveAgentModeProfileSkillhubCapabilityRuntimePerformed,
      true
    );
    assert.equal(entry.architectureReferencePolicy.hermesReferenceOnly, true);
    assert.equal(entry.architectureReferencePolicy.cuaDriverReferenceOnly, true);
    assert.equal(
      entry.architectureReferencePolicy.fainirPromptGuideCategoryOnly,
      true
    );
    assert.equal(entry.architectureReferencePolicy.importsHermes, false);
    assert.equal(entry.architectureReferencePolicy.executesCuaDriver, false);
    assert.equal(entry.architectureReferencePolicy.installsCuaDriver, false);
    assert.equal(entry.nonAuthorizingProof, true);
    assertAllFalse(entry.explicitBlockedAuthorizationFlags);
    assertAllFalse(entry.unsafeAgentModeCapabilityRuntimeFlags);
    assertAllFalse(entry.runtimeEffect);
    assert.ok(
      entry.forbiddenCurrentBehavior.includes("computer-use runtime")
    );
    assert.ok(entry.forbiddenCurrentBehavior.includes("desktop control"));
    assert.ok(
      entry.forbiddenCurrentBehavior.includes("background worker, daemon, queue, scheduler, async executor, or live subagent")
    );
    assert.ok(entry.forbiddenCurrentBehavior.includes("command exposure"));
  }

  const cuaEntry = fixture.boundaryEntries.find(
    (entry) => entry.relatedSystem === "cua-driver-reference"
  );
  assert.match(cuaEntry.cuaDriverRoleDescription, /Windows UI Automation\/SendInput/);
  assert.match(cuaEntry.cuaDriverRoleDescription, /Linux X11\/Wayland\/AT-SPI/);
  assert.match(cuaEntry.cuaDriverRoleDescription, /macOS accessibility\/private-API/);
});

test("Phase 5.68 invalid Hermes/CUA/agent-mode boundary cases fail closed", () => {
  const valid =
    createAgentModeProfileSkillhubCapabilityBoundaryMapForReview({
      reviewedAt
    });
  const firstEntry = valid.boundaryEntries[0];
  const missingBoundaryIdEntry = { ...firstEntry };
  delete missingBoundaryIdEntry.boundaryId;

  const cases = [
    [
      null,
      "malformed-agent-mode-profile-skillhub-capability-boundary-map-input-rejected"
    ],
    [
      { reviewedAt: "not-a-date" },
      "malformed-agent-mode-profile-skillhub-capability-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, boundaryEntries: [missingBoundaryIdEntry] },
      "missing-required-agent-mode-profile-skillhub-capability-boundary-entry-rejected"
    ],
    [
      { reviewedAt, unknownField: true },
      "unknown-top-level-field-agent-mode-profile-skillhub-capability-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, boundaryEntries: boundaryEntryPatch({ boundaryFamily: "agent_runtime" }) },
      "unknown-boundary-family-agent-mode-profile-skillhub-capability-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, boundaryEntries: boundaryEntryPatch({ relatedSystem: "hermes" }) },
      "unknown-related-system-agent-mode-profile-skillhub-capability-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, boundaryEntries: boundaryEntryPatch({ currentStatus: "implemented" }) },
      "unknown-current-status-agent-mode-profile-skillhub-capability-boundary-map-input-rejected"
    ],
    [
      {
        reviewedAt,
        boundaryEntries: boundaryEntryPatch({
          explicitBlockedAuthorizationFlags: {
            ...firstEntry.explicitBlockedAuthorizationFlags,
            computerUseAuthorizationGranted: true
          }
        })
      },
      "authorization-flags-enabled-agent-mode-profile-skillhub-capability-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, reportRunsChecks: true },
      "report-runs-checks-true-agent-mode-profile-skillhub-capability-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, runtimeAuthorized: true },
      "runtime-authorization-attempt-agent-mode-profile-skillhub-capability-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, commandExposureEnabled: true },
      "command-exposure-attempt-agent-mode-profile-skillhub-capability-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, blockedCliBypassEnabled: true },
      "blocked-cli-bypass-attempt-agent-mode-profile-skillhub-capability-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, cuaDriverBinary: { enabled: false } },
      "hidden-cua-driver-execution-semantics-agent-mode-profile-skillhub-capability-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, computerUseTool: { enabled: false } },
      "hidden-computer-use-semantics-agent-mode-profile-skillhub-capability-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, clickAction: { enabled: false } },
      "hidden-input-automation-semantics-agent-mode-profile-skillhub-capability-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, alwaysApprove: false },
      "hidden-action-approval-semantics-agent-mode-profile-skillhub-capability-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, multimodalReturn: { enabled: false } },
      "hidden-multimodal-return-semantics-agent-mode-profile-skillhub-capability-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, telemetryOptIn: false },
      "hidden-telemetry-driver-update-semantics-agent-mode-profile-skillhub-capability-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, backgroundWorker: { enabled: false } },
      "hidden-background-subagent-execution-semantics-agent-mode-profile-skillhub-capability-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, frontDeskResponder: { enabled: false } },
      "hidden-conversation-concurrency-semantics-agent-mode-profile-skillhub-capability-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, profileLoader: { enabled: false } },
      "hidden-profile-personality-session-context-loading-semantics-agent-mode-profile-skillhub-capability-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, skillhubInstaller: { enabled: false } },
      "hidden-skill-loading-install-scan-inventory-semantics-agent-mode-profile-skillhub-capability-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, gatewayRuntime: { enabled: false } },
      "hidden-gateway-scheduled-terminal-semantics-agent-mode-profile-skillhub-capability-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, modelRouter: { enabled: false } },
      "hidden-model-routing-fusion-judge-front-desk-semantics-agent-mode-profile-skillhub-capability-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, acpAdapter: { enabled: false } },
      "hidden-acp-a2a-adapter-registry-semantics-agent-mode-profile-skillhub-capability-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, httpServer: { enabled: false } },
      "hidden-backend-api-server-storage-auth-connector-semantics-agent-mode-profile-skillhub-capability-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, fabricBus: { enabled: false } },
      "hidden-fabric-secure-drop-encoded-handoff-runtime-semantics-agent-mode-profile-skillhub-capability-boundary-map-input-rejected"
    ],
    [
      { reviewedAt, loggerRuntime: { enabled: false } },
      "hidden-logger-audit-telemetry-health-infrastructure-semantics-agent-mode-profile-skillhub-capability-boundary-map-input-rejected"
    ],
    [
      {
        reviewedAt,
        boundaryEntries: boundaryEntryPatch({
          unsafeAgentModeCapabilityRuntimeFlags: {
            ...firstEntry.unsafeAgentModeCapabilityRuntimeFlags,
            computerUseRuntimeEnabled: true
          }
        })
      },
      "unsafe-agent-mode-profile-skillhub-capability-runtime-flags-agent-mode-profile-skillhub-capability-boundary-map-input-rejected"
    ],
    [
      {
        reviewedAt,
        boundaryEntries: boundaryEntryPatch({
          runtimeEffect: { ...firstEntry.runtimeEffect, runtimeReady: true }
        })
      },
      "nested-unsafe-flags-agent-mode-profile-skillhub-capability-boundary-map-input-rejected"
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
      "noncanonical-agent-mode-profile-skillhub-capability-boundary-map-input-rejected"
    ]
  ];

  for (const [input, caseKey] of cases) {
    const result =
      createAgentModeProfileSkillhubCapabilityBoundaryMapForReview(input);
    assert.equal(
      result.classification,
      expectedCaseClassifications[caseKey],
      caseKey
    );
    assert.equal(
      result.agentModeProfileSkillhubCapabilityBoundaryMapProduced,
      false,
      caseKey
    );
    assert.equal(result.boundaryEntries.length, 0, caseKey);
    assertNonAuthorizing(result);
  }
});

test("Phase 5.68 enabled runtime flags cannot authorize capability behavior", () => {
  for (const field of unsafeFlagCases) {
    const result =
      createAgentModeProfileSkillhubCapabilityBoundaryMapForReview({
        reviewedAt,
        [field]: true
      });

    assert.equal(
      result.classification,
      expectedCaseClassifications[
        "unsafe-agent-mode-profile-skillhub-capability-runtime-flags-agent-mode-profile-skillhub-capability-boundary-map-input-rejected"
      ],
      field
    );
    assert.equal(
      result.agentModeProfileSkillhubCapabilityBoundaryMapProduced,
      false,
      field
    );
    assertNonAuthorizing(result);
  }
});

test("Phase 5.68 boundary map stays non-authorizing and runtime-blocked", async () => {
  const fixture = await readFixture();
  const summary = fixture.boundaryMapSummary;

  for (const field of [
    "hermesReferenceOnly",
    "cuaDriverReferenceOnly",
    "fainirPromptGuideCategoryOnly",
    "noHermesInstallVendorCopyImportMigrationIntegration",
    "noCuaDriverInstallExecutionMcpStdioManifestDiscoveryBackendStartToolDispatchUpdate",
    "noComputerUseRuntime",
    "noDesktopControl",
    "noBrowserControl",
    "noScreenshotCaptureRuntime",
    "noOcrRuntime",
    "noAccessibilityTreeRuntime",
    "noSomIndexRuntime",
    "noOsWindowEnumeration",
    "noInputAutomationRuntime",
    "noActionApprovalRuntime",
    "noBackgroundSubagentRuntime",
    "noProfilePersonalitySessionContextSkillLoaderRuntime",
    "noSkillhubInstallRuntime",
    "noSecurityScannerRuntime",
    "noMcpPluginProviderToolInventoryScannerRuntime",
    "noGatewayMessagingRuntime",
    "noScheduledAutomationRuntime",
    "noTerminalBackendRuntime",
    "noModelRouterFusionJudgeFrontDeskRuntime",
    "noAcpA2aRuntime",
    "noLocusIntegration",
    "noExternalHarnessIntegration",
    "noBackendApiServerStorageCacheRlsMigrationRuntime",
    "noFabricWebsocketHttpMcpTaskRuntime",
    "noSecureDropRuntime",
    "noEncodedHandoffRuntime",
    "noLoggerAuditTelemetryHealthInfrastructureRuntime",
    "noCommandExposure",
    "noBlockedCliBypass",
    "allBlockedAuthorizationFlagsFalse",
    "allUnsafeAgentModeCapabilityRuntimeFlagsFalse",
    "allRuntimeEffectsFalse",
    "allEntriesNonAuthorizing"
  ]) {
    assert.equal(summary[field], true, `${field} should be true`);
  }

  assertNonAuthorizing(fixture);
  assert.equal(
    fixture.recommendedNextPhase,
    "phase-5.69-review-only-testing-frameworks-quality-gates-contract-boundary-map"
  );
});

test("serve-runtime remains default-blocked and dry-run cannot bypass Phase 5.68", async () => {
  const direct = await expectCliFailure(["serve-runtime"]);
  assert.notEqual(direct.code, 0);
  assert.equal(direct.stdout, "");

  const dryRun = await expectCliFailure(["serve-runtime", "--dry-run"]);
  assert.notEqual(dryRun.code, 0);
  assert.equal(dryRun.stdout, "");
});

test("Phase 5.68 agent mode/CUA/skillhub command names remain rejected", async () => {
  for (const command of commandProbes) {
    const error = await expectCliFailure([command]);
    assert.notEqual(error.code, 0, command);
    assert.equal(error.stdout, "", command);
  }
});

test("Phase 5.68 does not change CLI, Rust, Fabric, package, or consumer source", async () => {
  const files = [
    "apps/cli/src/index.mjs",
    "crates/ardyn-host/src/lib.rs",
    "crates/ardyn-host/src/stdio_runtime/mod.rs",
    "packages/fabric/src/index.mjs",
    "package.json"
  ];

  for (const file of files) {
    const [baseline, current] = await Promise.all([
      execFileAsync("git", ["show", `${phase568BaselineCommit}:${file}`], {
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
