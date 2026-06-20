import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";
import {
  CONSUMER_DISPLAY_ACCESSIBILITY_CONTRACT_MAP_SCHEMA,
  createConsumerDisplayAccessibilityContractMapForReview
} from "../packages/core/src/index.mjs";

const execFileAsync = promisify(execFile);
const phase549BaselineCommit = "e23d49b958c448eaa84318a7125f07c7796ff542";
const reviewedAt = "2026-06-20T00:00:00.000Z";
const repoRootUrl = new URL("../", import.meta.url);
const repoRoot = fileURLToPath(repoRootUrl);
const cliPath = fileURLToPath(new URL("../apps/cli/src/index.mjs", import.meta.url));
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-49/consumer-display-accessibility-contract-map.json",
  import.meta.url
);

const expectedCaseClassifications = Object.freeze({
  "malformed-consumer-display-accessibility-contract-map-input-rejected":
    "malformed_consumer_display_accessibility_contract_map_input_rejected",
  "malformed-consumer-display-accessibility-contract-map-invalid-reviewed-at-rejected":
    "malformed_consumer_display_accessibility_contract_map_input_rejected",
  "reviewer-routing-looking-consumer-display-accessibility-contract-map-input-rejected":
    "reviewer_routing_looking_consumer_display_accessibility_contract_map_input_rejected",
  "reviewer-assignment-looking-consumer-display-accessibility-contract-map-input-rejected":
    "reviewer_assignment_looking_consumer_display_accessibility_contract_map_input_rejected",
  "evaluator-execution-looking-consumer-display-accessibility-contract-map-input-rejected":
    "evaluator_execution_looking_consumer_display_accessibility_contract_map_input_rejected",
  "evaluator-result-looking-consumer-display-accessibility-contract-map-input-rejected":
    "evaluator_result_looking_consumer_display_accessibility_contract_map_input_rejected",
  "approval-decision-looking-consumer-display-accessibility-contract-map-input-rejected":
    "approval_decision_looking_consumer_display_accessibility_contract_map_input_rejected",
  "grant-looking-consumer-display-accessibility-contract-map-input-rejected":
    "grant_looking_consumer_display_accessibility_contract_map_input_rejected",
  "nested-grant-looking-consumer-display-accessibility-contract-map-input-rejected":
    "grant_looking_consumer_display_accessibility_contract_map_input_rejected",
  "ui-interactivity-looking-consumer-display-accessibility-contract-map-input-rejected":
    "ui_interactivity_looking_consumer_display_accessibility_contract_map_input_rejected",
  "nested-ui-interactivity-looking-consumer-display-accessibility-contract-map-input-rejected":
    "ui_interactivity_looking_consumer_display_accessibility_contract_map_input_rejected",
  "runtime-permission-looking-consumer-display-accessibility-contract-map-input-rejected":
    "runtime_permission_looking_consumer_display_accessibility_contract_map_input_rejected",
  "command-exposure-looking-consumer-display-accessibility-contract-map-input-rejected":
    "command_exposure_looking_consumer_display_accessibility_contract_map_input_rejected",
  "database-storage-looking-consumer-display-accessibility-contract-map-input-rejected":
    "database_storage_looking_consumer_display_accessibility_contract_map_input_rejected",
  "secrets-looking-consumer-display-accessibility-contract-map-input-rejected":
    "secrets_looking_consumer_display_accessibility_contract_map_input_rejected",
  "connector-fabric-network-looking-consumer-display-accessibility-contract-map-input-rejected":
    "connector_fabric_network_looking_consumer_display_accessibility_contract_map_input_rejected",
  "secure-drop-looking-consumer-display-accessibility-contract-map-input-rejected":
    "secure_drop_looking_consumer_display_accessibility_contract_map_input_rejected",
  "mcp-task-service-discovery-schedule-looking-consumer-display-accessibility-contract-map-input-rejected":
    "mcp_task_service_discovery_schedule_looking_consumer_display_accessibility_contract_map_input_rejected",
  "process-control-looking-consumer-display-accessibility-contract-map-input-rejected":
    "process_control_looking_consumer_display_accessibility_contract_map_input_rejected",
  "runtime-effect-true-consumer-display-accessibility-contract-map-input-rejected":
    "runtime_effect_true_consumer_display_accessibility_contract_map_input_rejected",
  "valid-consumer-display-accessibility-contract-map":
    "valid_consumer_display_accessibility_contract_map_runtime_still_blocked"
});

const expectedDisplaySurfaceIds = Object.freeze([
  "locus.status-control-panels",
  "locus.review-artifact-panels",
  "locus.capability-metadata-panels",
  "locus.blocked-command-runtime-indicators",
  "locus.future-secure-drop-compose-inbox-indicators",
  "multiverse.world-project-orchestration-status-cards",
  "multiverse.visible-ai-capability-badges",
  "multiverse.task-capability-wrapper-status-cards",
  "multiverse.citizen-adapter-candidate-badges",
  "multiverse.registry-websocket-mcp-task-runtime-blocked-indicators"
]);

const commandProbes = Object.freeze([
  "consumer-display-accessibility-contract-map",
  "create-consumer-display-accessibility-contract-map",
  "phase-5-49-display-accessibility",
  "locus-display-control",
  "locus-secure-drop-compose",
  "multiverse-runtime-status",
  "registry-websocket-mcp-task",
  "consumer-ui-runtime",
  "display-control-grant",
  "screen-reader-runtime-action"
]);

const nonAuthorizingResultFields = Object.freeze([
  "uiFrontendBrowserCodeImplemented",
  "consumerUiImplemented",
  "displaySurfaceImplemented",
  "browserRuntimeEnabled",
  "interactiveControlEnabled",
  "hiddenActionSemanticsEnabled",
  "autoExecutionEnabled",
  "accessibilityComplianceCertified",
  "locusRuntimeDependencyAdded",
  "multiverseRuntimeDependencyAdded",
  "consumerRuntimeIntegrationAdded",
  "commandRuntimeControlEnabled",
  "commandExposurePermissionGranted",
  "runtimePermissionGranted",
  "runtimeCommandExposureEnabled",
  "runtimeExecutionEnabled",
  "reviewerRoutingPerformed",
  "reviewerAssignmentPerformed",
  "evaluatorExecutionPerformed",
  "evaluatorResultProduced",
  "approvalDecisionProduced",
  "approvalGrantProduced",
  "approvalGrantPersisted",
  "connectorGrantProduced",
  "connectorIngestionAdded",
  "liveRegistryConnectionEnabled",
  "webSocketRuntimeEnabled",
  "httpRuntimeEnabled",
  "taskRuntimeExecutionEnabled",
  "taskExecutionEnabled",
  "mcpRuntimeExecutionEnabled",
  "mcpExecutionEnabled",
  "mcpToolExposureEnabled",
  "fabricRuntimeSurfaceEnabled",
  "contentFabricRuntimeBehaviorEnabled",
  "adapterRuntimeBehaviorEnabled",
  "secureDropImplemented",
  "secureDropCryptoImplemented",
  "secureDropTransportImplemented",
  "secureDropStegoImplemented",
  "secureDropSendReceiveImplemented",
  "secureDropInboxPollingEnabled",
  "fileSelectionEnabled",
  "filesystemWatcherEnabled",
  "filesystemScanningEnabled",
  "secretVaultEnvAccessEnabled",
  "st3ggVendored",
  "processControlEnabled",
  "liveStdinLoopEnabled",
  "runtimeStdoutWriterEnabled",
  "runtimeStderrWriterEnabled",
  "transcriptRuntimeWritePerformed",
  "auditRuntimeWritePerformed",
  "databaseStorageRuntimeWritesEnabled",
  "runtimeDatabaseWriteEnabled",
  "storageRuntimeWriteEnabled",
  "secretsRuntimeIngestionEnabled",
  "externalServicesEnabled",
  "networkServerEnabled",
  "serviceDiscoveryEnabled",
  "liveServiceRegistryConnectionEnabled",
  "scheduleEnforcementEnabled",
  "backgroundPollingEnabled"
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

function assertAuthorizationFlags(flags) {
  for (const [key, value] of Object.entries(flags)) {
    assert.equal(value, false, `${key} should be false`);
  }
}

test("Phase 5.49 consumer display/accessibility fixture is deterministic", async () => {
  const fixture = await readFixture();
  const generated = createConsumerDisplayAccessibilityContractMapForReview({
    reviewedAt
  });

  assert.equal(fixture.schema, CONSUMER_DISPLAY_ACCESSIBILITY_CONTRACT_MAP_SCHEMA);
  assert.deepEqual(fixture, generated);
  assert.equal(
    fixture.classification,
    expectedCaseClassifications["valid-consumer-display-accessibility-contract-map"]
  );
  assert.equal(fixture.consumerDisplayAccessibilityContractMapProduced, true);
  assert.equal(fixture.contractMapSummary.entryCount, 10);
  assert.equal(fixture.contractMapSummary.locusDisplaySurfaceCount, 5);
  assert.equal(fixture.contractMapSummary.multiverseDisplaySurfaceCount, 5);
});

test("Phase 5.49 classifies unsafe display/accessibility inputs without authorization", () => {
  const cases = [
    [
      "malformed-consumer-display-accessibility-contract-map-input-rejected",
      createConsumerDisplayAccessibilityContractMapForReview(null)
    ],
    [
      "malformed-consumer-display-accessibility-contract-map-invalid-reviewed-at-rejected",
      createConsumerDisplayAccessibilityContractMapForReview({ reviewedAt: "2026-06-20" })
    ],
    [
      "reviewer-routing-looking-consumer-display-accessibility-contract-map-input-rejected",
      createConsumerDisplayAccessibilityContractMapForReview({
        reviewedAt,
        reviewerRoutingPerformed: true
      })
    ],
    [
      "reviewer-assignment-looking-consumer-display-accessibility-contract-map-input-rejected",
      createConsumerDisplayAccessibilityContractMapForReview({
        reviewedAt,
        reviewerAssignmentPerformed: true
      })
    ],
    [
      "evaluator-execution-looking-consumer-display-accessibility-contract-map-input-rejected",
      createConsumerDisplayAccessibilityContractMapForReview({
        reviewedAt,
        evaluatorExecutionPerformed: true
      })
    ],
    [
      "evaluator-result-looking-consumer-display-accessibility-contract-map-input-rejected",
      createConsumerDisplayAccessibilityContractMapForReview({
        reviewedAt,
        evaluatorResultProduced: true
      })
    ],
    [
      "approval-decision-looking-consumer-display-accessibility-contract-map-input-rejected",
      createConsumerDisplayAccessibilityContractMapForReview({
        reviewedAt,
        approvalDecisionProduced: true
      })
    ],
    [
      "grant-looking-consumer-display-accessibility-contract-map-input-rejected",
      createConsumerDisplayAccessibilityContractMapForReview({
        reviewedAt,
        connectorGrantProduced: true
      })
    ],
    [
      "nested-grant-looking-consumer-display-accessibility-contract-map-input-rejected",
      createConsumerDisplayAccessibilityContractMapForReview({
        reviewedAt,
        metadata: { approvalGrantProduced: true }
      })
    ],
    [
      "ui-interactivity-looking-consumer-display-accessibility-contract-map-input-rejected",
      createConsumerDisplayAccessibilityContractMapForReview({
        reviewedAt,
        interactiveControlEnabled: true
      })
    ],
    [
      "nested-ui-interactivity-looking-consumer-display-accessibility-contract-map-input-rejected",
      createConsumerDisplayAccessibilityContractMapForReview({
        reviewedAt,
        metadata: { display: { interactiveControlEnabled: true } }
      })
    ],
    [
      "runtime-permission-looking-consumer-display-accessibility-contract-map-input-rejected",
      createConsumerDisplayAccessibilityContractMapForReview({
        reviewedAt,
        runtimePermissionGranted: true
      })
    ],
    [
      "command-exposure-looking-consumer-display-accessibility-contract-map-input-rejected",
      createConsumerDisplayAccessibilityContractMapForReview({
        reviewedAt,
        commandRuntimeControlEnabled: true
      })
    ],
    [
      "database-storage-looking-consumer-display-accessibility-contract-map-input-rejected",
      createConsumerDisplayAccessibilityContractMapForReview({
        reviewedAt,
        databaseStorageRuntimeWritesEnabled: true
      })
    ],
    [
      "secrets-looking-consumer-display-accessibility-contract-map-input-rejected",
      createConsumerDisplayAccessibilityContractMapForReview({
        reviewedAt,
        secretVaultEnvAccessEnabled: true
      })
    ],
    [
      "connector-fabric-network-looking-consumer-display-accessibility-contract-map-input-rejected",
      createConsumerDisplayAccessibilityContractMapForReview({
        reviewedAt,
        webSocketHttpSurfaceEnabled: true
      })
    ],
    [
      "secure-drop-looking-consumer-display-accessibility-contract-map-input-rejected",
      createConsumerDisplayAccessibilityContractMapForReview({
        reviewedAt,
        secureDropInboxPollingEnabled: true
      })
    ],
    [
      "mcp-task-service-discovery-schedule-looking-consumer-display-accessibility-contract-map-input-rejected",
      createConsumerDisplayAccessibilityContractMapForReview({
        reviewedAt,
        serviceDiscoveryEnabled: true
      })
    ],
    [
      "process-control-looking-consumer-display-accessibility-contract-map-input-rejected",
      createConsumerDisplayAccessibilityContractMapForReview({
        reviewedAt,
        processControlEnabled: true
      })
    ],
    [
      "runtime-effect-true-consumer-display-accessibility-contract-map-input-rejected",
      createConsumerDisplayAccessibilityContractMapForReview({
        reviewedAt,
        runtimeEffect: { runtimeExecutionEnabled: true }
      })
    ],
    [
      "valid-consumer-display-accessibility-contract-map",
      createConsumerDisplayAccessibilityContractMapForReview({ reviewedAt })
    ]
  ];

  for (const [caseName, result] of cases) {
    assert.equal(result.classification, expectedCaseClassifications[caseName], caseName);
    assert.equal(result.reviewOnly, true);
    assert.equal(result.authoritative, false);
    assertNonAuthorizing(result);
  }
});

test("Phase 5.49 map covers required consumer display surfaces and accessibility fields", async () => {
  const fixture = await readFixture();
  const entries = new Map(
    fixture.displayContractEntries.map((entry) => [entry.displaySurfaceId, entry])
  );

  assert.deepEqual(
    fixture.displayContractEntries.map((entry) => entry.displaySurfaceId),
    expectedDisplaySurfaceIds
  );
  assert.deepEqual(
    fixture.contractMapSummary.consumerNames,
    ["Locus", "Multiverse"]
  );

  for (const entry of fixture.displayContractEntries) {
    assert.ok(["Locus", "Multiverse"].includes(entry.consumerName));
    assert.ok(entry.sourceArdynArtifactType.length > 0, entry.displaySurfaceId);
    assert.ok(entry.allowedDisplayBehavior.length > 0, entry.displaySurfaceId);
    assert.ok(entry.forbiddenDisplayBehavior.length >= 6, entry.displaySurfaceId);
    assert.ok(
      entry.requiredFutureContractBeforeInteractivity.length > 0,
      entry.displaySurfaceId
    );
    assert.equal(entry.nonAuthorizingProof, true, entry.displaySurfaceId);
    assertAuthorizationFlags(entry.authorizationFlags);

    const notes = entry.accessibilityRequirementNotes;
    assert.ok(notes.readableLabel.length > 0, entry.displaySurfaceId);
    assert.ok(notes.shortDescription.length > 0, entry.displaySurfaceId);
    assert.ok(notes.longDescription.length > 0, entry.displaySurfaceId);
    assert.ok(notes.severityStatusVocabulary.length >= 4, entry.displaySurfaceId);
    assert.ok(
      notes.keyboardScreenReaderDisplayNotes.length > 0,
      entry.displaySurfaceId
    );
    assert.equal(notes.colorIndependentStatusIndicatorRequired, true);
    assert.equal(notes.reducedMotionDefaultStaticDisplayRequired, true);
    assert.equal(notes.noAutoExecutionNoHiddenActionSemantics, true);
  }

  assert.ok(
    entries
      .get("locus.future-secure-drop-compose-inbox-indicators")
      .forbiddenDisplayBehavior.includes("file selection")
  );
  assert.ok(
    entries
      .get("multiverse.registry-websocket-mcp-task-runtime-blocked-indicators")
      .forbiddenDisplayBehavior.includes("MCP tool exposure")
  );
  assert.equal(
    fixture.contractMapSummary.locusSecureDropPlaceholdersMetadataOnly,
    true
  );
  assert.equal(
    fixture.contractMapSummary
      .multiverseRegistryWebsocketMcpTaskBlockedIndicatorsCovered,
    true
  );
});

test("Phase 5.49 result remains non-authorizing and runtime blocked", async () => {
  const fixture = await readFixture();

  assert.equal(fixture.reviewOnly, true);
  assert.equal(fixture.authoritative, false);
  assert.equal(fixture.consumerDisplayAccessibilityContractMapOnly, true);
  assert.equal(
    fixture.contractMapSummary.uiFrontendBrowserCodeImplemented,
    false
  );
  assert.equal(fixture.contractMapSummary.consumerRuntimeIntegrationAdded, false);
  assert.equal(fixture.contractMapSummary.runtimeExecutionEnabled, false);
  assert.equal(fixture.contractMapSummary.commandRuntimeControlEnabled, false);
  assert.equal(fixture.contractMapSummary.secureDropImplemented, false);
  assert.equal(fixture.contractMapSummary.serviceDiscoveryEnabled, false);
  assert.equal(fixture.contractMapSummary.scheduleEnforcementEnabled, false);
  assertNonAuthorizing(fixture);
  assertNonAuthorizing(fixture.consumerDisplayAccessibilityContractMap);
  assert.deepEqual(fixture.rejectionReasons, [
    "consumer_display_accessibility_contract_map_is_review_only",
    "ardyn_does_not_implement_consumer_ui_frontend_or_browser_runtime",
    "ui_runtime_command_db_storage_secrets_connector_fabric_websocket_http_mcp_task_secure_drop_authorizations_false",
    "no_auto_execution_no_hidden_action_semantics",
    "fallow_runtime_not_used",
    "runtime_enablement_still_blocked"
  ]);
  assert.ok(
    fixture.topDisplayAccessibilityGaps.some((gap) =>
      gap.includes("consumer-owned UI fixtures")
    )
  );
  assert.equal(
    fixture.recommendedNextPhase,
    "phase-5.50-consumer-display-fixture-schema-boundary"
  );
});

test("serve-runtime remains default-blocked and dry-run cannot bypass Phase 5.49", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-49-runtime-"));

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

test("Phase 5.49 display/accessibility command names remain rejected", async () => {
  for (const command of commandProbes) {
    const failure = await expectCliFailure([command]);

    assert.notEqual(failure.code, 0);
    assert.equal(failure.stdout, "");
    assert.match(failure.stderr, /unknown command|Usage: ardyn/i);
  }
});

test("Phase 5.49 does not change CLI, Rust, or Fabric runtime source", async () => {
  await execFileAsync(
    "git",
    [
      "diff",
      "--exit-code",
      phase549BaselineCommit,
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

  assert.doesNotMatch(currentCliSource, /consumer-display-accessibility-contract-map/);
  assert.doesNotMatch(currentCliSource, /phase-5-49/);
});
