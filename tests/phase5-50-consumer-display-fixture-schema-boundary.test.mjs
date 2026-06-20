import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";
import {
  CONSUMER_DISPLAY_FIXTURE_SCHEMA_BOUNDARY_SCHEMA,
  createConsumerDisplayFixtureSchemaBoundaryForReview
} from "../packages/core/src/index.mjs";

const execFileAsync = promisify(execFile);
const phase550BaselineCommit = "a95b5041ff451722ee4267da6653e097065d9e00";
const reviewedAt = "2026-06-20T00:00:00.000Z";
const repoRootUrl = new URL("../", import.meta.url);
const repoRoot = fileURLToPath(repoRootUrl);
const cliPath = fileURLToPath(new URL("../apps/cli/src/index.mjs", import.meta.url));
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-50/consumer-display-fixture-schema-boundary.json",
  import.meta.url
);

const expectedCaseClassifications = Object.freeze({
  "malformed-consumer-display-fixture-schema-boundary-input-rejected":
    "malformed_consumer_display_fixture_schema_boundary_input_rejected",
  "malformed-consumer-display-fixture-schema-boundary-invalid-reviewed-at-rejected":
    "malformed_consumer_display_fixture_schema_boundary_input_rejected",
  "malformed-consumer-display-fixture-schema-boundary-fixture-entries-rejected":
    "malformed_consumer_display_fixture_schema_boundary_input_rejected",
  "missing-required-consumer-display-fixture-schema-boundary-entry-rejected":
    "missing_required_consumer_display_fixture_schema_boundary_entry_rejected",
  "unknown-consumer-name-consumer-display-fixture-schema-boundary-input-rejected":
    "unknown_consumer_name_consumer_display_fixture_schema_boundary_input_rejected",
  "unknown-display-intent-consumer-display-fixture-schema-boundary-input-rejected":
    "unknown_display_intent_consumer_display_fixture_schema_boundary_input_rejected",
  "interactive-actionable-intent-consumer-display-fixture-schema-boundary-input-rejected":
    "interactive_actionable_intent_consumer_display_fixture_schema_boundary_input_rejected",
  "authorization-flags-enabled-consumer-display-fixture-schema-boundary-input-rejected":
    "authorization_flags_enabled_consumer_display_fixture_schema_boundary_input_rejected",
  "nested-unsafe-flags-consumer-display-fixture-schema-boundary-input-rejected":
    "nested_unsafe_flags_consumer_display_fixture_schema_boundary_input_rejected",
  "hidden-command-runtime-semantics-consumer-display-fixture-schema-boundary-input-rejected":
    "hidden_command_runtime_semantics_consumer_display_fixture_schema_boundary_input_rejected",
  "secure-drop-implementation-semantics-consumer-display-fixture-schema-boundary-input-rejected":
    "secure_drop_implementation_semantics_consumer_display_fixture_schema_boundary_input_rejected",
  "websocket-http-fabric-mcp-task-execution-semantics-consumer-display-fixture-schema-boundary-input-rejected":
    "websocket_http_fabric_mcp_task_execution_semantics_consumer_display_fixture_schema_boundary_input_rejected",
  "valid-consumer-display-fixture-schema-boundary":
    "valid_consumer_display_fixture_schema_boundary_runtime_still_blocked"
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
  "consumer-display-fixture-schema-boundary",
  "create-consumer-display-fixture-schema-boundary",
  "phase-5-50-display-fixture-schema-boundary",
  "locus-display-fixture",
  "multiverse-display-fixture",
  "render-consumer-display",
  "consumer-fixture-render",
  "secure-drop-compose-fixture",
  "websocket-mcp-task-fixture",
  "display-fixture-action"
]);

const nonAuthorizingResultFields = Object.freeze([
  "uiFrontendBrowserCodeImplemented",
  "consumerUiImplemented",
  "displaySurfaceImplemented",
  "browserRuntimeEnabled",
  "interactiveControlEnabled",
  "hiddenActionSemanticsEnabled",
  "autoExecutionEnabled",
  "renderingCodeImplemented",
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

function fixtureEntryPatch(patch) {
  const [entry] = createConsumerDisplayFixtureSchemaBoundaryForReview({
    reviewedAt
  }).displayFixtureEntries;

  return [{ ...structuredClone(entry), ...patch }];
}

test("Phase 5.50 consumer display fixture schema boundary fixture is deterministic", async () => {
  const fixture = await readFixture();
  const generated = createConsumerDisplayFixtureSchemaBoundaryForReview({
    reviewedAt
  });

  assert.equal(fixture.schema, CONSUMER_DISPLAY_FIXTURE_SCHEMA_BOUNDARY_SCHEMA);
  assert.deepEqual(fixture, generated);
  assert.equal(
    fixture.classification,
    expectedCaseClassifications["valid-consumer-display-fixture-schema-boundary"]
  );
  assert.equal(fixture.consumerDisplayFixtureSchemaBoundaryProduced, true);
  assert.equal(fixture.schemaBoundarySummary.fixtureCount, 10);
  assert.equal(fixture.schemaBoundarySummary.locusFixtureCount, 5);
  assert.equal(fixture.schemaBoundarySummary.multiverseFixtureCount, 5);
});

test("Phase 5.50 invalid display fixture cases fail closed without authorization", () => {
  const missingFixtureId = fixtureEntryPatch({});
  delete missingFixtureId[0].fixtureId;

  const cases = [
    [
      "malformed-consumer-display-fixture-schema-boundary-input-rejected",
      createConsumerDisplayFixtureSchemaBoundaryForReview(null)
    ],
    [
      "malformed-consumer-display-fixture-schema-boundary-invalid-reviewed-at-rejected",
      createConsumerDisplayFixtureSchemaBoundaryForReview({ reviewedAt: "2026-06-20" })
    ],
    [
      "malformed-consumer-display-fixture-schema-boundary-fixture-entries-rejected",
      createConsumerDisplayFixtureSchemaBoundaryForReview({
        reviewedAt,
        fixtureEntries: {}
      })
    ],
    [
      "missing-required-consumer-display-fixture-schema-boundary-entry-rejected",
      createConsumerDisplayFixtureSchemaBoundaryForReview({
        reviewedAt,
        fixtureEntries: missingFixtureId
      })
    ],
    [
      "unknown-consumer-name-consumer-display-fixture-schema-boundary-input-rejected",
      createConsumerDisplayFixtureSchemaBoundaryForReview({
        reviewedAt,
        fixtureEntries: fixtureEntryPatch({ consumerName: "content-fabric" })
      })
    ],
    [
      "unknown-display-intent-consumer-display-fixture-schema-boundary-input-rejected",
      createConsumerDisplayFixtureSchemaBoundaryForReview({
        reviewedAt,
        fixtureEntries: fixtureEntryPatch({ displayIntent: "animated_metadata" })
      })
    ],
    [
      "interactive-actionable-intent-consumer-display-fixture-schema-boundary-input-rejected",
      createConsumerDisplayFixtureSchemaBoundaryForReview({
        reviewedAt,
        fixtureEntries: fixtureEntryPatch({ displayIntent: "interactive" })
      })
    ],
    [
      "authorization-flags-enabled-consumer-display-fixture-schema-boundary-input-rejected",
      createConsumerDisplayFixtureSchemaBoundaryForReview({
        reviewedAt,
        fixtureEntries: fixtureEntryPatch({
          blockedAuthorizationFlags: { runtimeAuthorized: true }
        })
      })
    ],
    [
      "nested-unsafe-flags-consumer-display-fixture-schema-boundary-input-rejected",
      createConsumerDisplayFixtureSchemaBoundaryForReview({
        reviewedAt,
        fixtureEntries: fixtureEntryPatch({
          nested: { display: { approvalGrantProduced: true } }
        })
      })
    ],
    [
      "hidden-command-runtime-semantics-consumer-display-fixture-schema-boundary-input-rejected",
      createConsumerDisplayFixtureSchemaBoundaryForReview({
        reviewedAt,
        fixtureEntries: fixtureEntryPatch({
          displaySemantics: { hiddenActionSemanticsEnabled: true }
        })
      })
    ],
    [
      "secure-drop-implementation-semantics-consumer-display-fixture-schema-boundary-input-rejected",
      createConsumerDisplayFixtureSchemaBoundaryForReview({
        reviewedAt,
        fixtureEntries: fixtureEntryPatch({
          secureDrop: { secureDropSendReceiveImplemented: true }
        })
      })
    ],
    [
      "websocket-http-fabric-mcp-task-execution-semantics-consumer-display-fixture-schema-boundary-input-rejected",
      createConsumerDisplayFixtureSchemaBoundaryForReview({
        reviewedAt,
        fixtureEntries: fixtureEntryPatch({
          runtimeSurfaces: { mcpToolExposureEnabled: true }
        })
      })
    ],
    [
      "valid-consumer-display-fixture-schema-boundary",
      createConsumerDisplayFixtureSchemaBoundaryForReview({ reviewedAt })
    ]
  ];

  for (const [caseName, result] of cases) {
    assert.equal(result.classification, expectedCaseClassifications[caseName], caseName);
    assert.equal(result.reviewOnly, true);
    assert.equal(result.authoritative, false);
    assertNonAuthorizing(result);
  }
});

test("Phase 5.50 fixture entries cover required consumer surfaces and schema fields", async () => {
  const fixture = await readFixture();
  const entries = new Map(
    fixture.displayFixtureEntries.map((entry) => [entry.displaySurfaceId, entry])
  );

  assert.deepEqual(
    fixture.displayFixtureEntries.map((entry) => entry.displaySurfaceId),
    expectedDisplaySurfaceIds
  );
  assert.deepEqual(
    fixture.schemaBoundarySummary.consumerNames,
    ["Locus", "Multiverse"]
  );

  for (const entry of fixture.displayFixtureEntries) {
    assert.ok(["Locus", "Multiverse"].includes(entry.consumerName));
    assert.match(entry.fixtureId, /^phase5-50\./);
    assert.equal(entry.displayIntent, "metadata_only");
    assert.ok(entry.sourceArdynArtifactType.length > 0, entry.displaySurfaceId);
    assert.ok(entry.readableLabel.length > 0, entry.displaySurfaceId);
    assert.ok(entry.shortDescription.length > 0, entry.displaySurfaceId);
    assert.ok(entry.longDescription.length > 0, entry.displaySurfaceId);
    assert.ok(entry.statusSeverityVocabulary.length >= 4, entry.displaySurfaceId);
    assert.ok(entry.allowedDisplayBehavior.length > 0, entry.displaySurfaceId);
    assert.ok(entry.forbiddenDisplayBehavior.length >= 6, entry.displaySurfaceId);
    assert.ok(
      entry.requiredFutureContractBeforeInteractivity.length > 0,
      entry.displaySurfaceId
    );
    assert.equal(entry.nonAuthorizingProof, true, entry.displaySurfaceId);
    assertAllFalse(entry.blockedAuthorizationFlags);
    assertAllFalse(entry.recursiveUnsafeInputFlags);

    const accessibility = entry.accessibilityFields;
    assert.ok(accessibility.keyboardScreenReaderDisplayNotes.length > 0);
    assert.equal(accessibility.colorIndependentStatusIndicatorRequired, true);
    assert.equal(accessibility.reducedMotionDefaultStaticDisplayRequired, true);
    assert.equal(accessibility.noAutoExecutionNoHiddenActionSemantics, true);
    assert.equal(accessibility.colorOnlyStatusForbidden, true);
    assert.equal(accessibility.motionRequiredForStatusForbidden, true);
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
});

test("Phase 5.50 result remains non-authorizing and runtime blocked", async () => {
  const fixture = await readFixture();

  assert.equal(fixture.reviewOnly, true);
  assert.equal(fixture.authoritative, false);
  assert.equal(fixture.consumerDisplayFixtureSchemaBoundaryOnly, true);
  assert.equal(fixture.schemaBoundarySummary.uiFrontendBrowserCodeImplemented, false);
  assert.equal(fixture.schemaBoundarySummary.renderingCodeImplemented, false);
  assert.equal(fixture.schemaBoundarySummary.consumerRuntimeIntegrationAdded, false);
  assert.equal(fixture.schemaBoundarySummary.runtimeExecutionEnabled, false);
  assert.equal(fixture.schemaBoundarySummary.commandRuntimeControlEnabled, false);
  assert.equal(fixture.schemaBoundarySummary.secureDropImplemented, false);
  assert.equal(fixture.schemaBoundarySummary.serviceDiscoveryEnabled, false);
  assert.equal(fixture.schemaBoundarySummary.scheduleEnforcementEnabled, false);
  assert.equal(fixture.invalidFixtureCasePolicy.missingRequiredFieldsFailClosed, true);
  assert.equal(fixture.invalidFixtureCasePolicy.nestedUnsafeInputFlagsFailClosed, true);
  assert.equal(fixture.invalidFixtureCasePolicy.validationPerformsRendering, false);
  assert.equal(fixture.invalidFixtureCasePolicy.validationStartsRuntime, false);
  assert.equal(fixture.invalidFixtureCasePolicy.validationWritesDbStorage, false);
  assert.equal(fixture.invalidFixtureCasePolicy.validationReadsSecrets, false);
  assert.equal(fixture.invalidFixtureCasePolicy.validationCallsExternalConsumers, false);
  assertNonAuthorizing(fixture);
  assertNonAuthorizing(fixture.consumerDisplayFixtureSchemaBoundary);
  assert.deepEqual(fixture.rejectionReasons, [
    "consumer_display_fixture_schema_boundary_is_review_only",
    "display_fixture_entries_are_metadata_only",
    "ardyn_does_not_implement_ui_frontend_browser_or_rendering",
    "ui_rendering_runtime_command_db_storage_secrets_connector_fabric_websocket_http_mcp_task_secure_drop_authorizations_false",
    "recursive_unsafe_input_flags_fail_closed",
    "fallow_runtime_not_used",
    "runtime_enablement_still_blocked"
  ]);
  assert.ok(
    fixture.topDisplayFixtureSchemaGaps.some((gap) =>
      gap.includes("No browser, rendering, WCAG automation")
    )
  );
  assert.equal(
    fixture.recommendedNextPhase,
    "phase-5.51-consumer-display-fixture-example-pack"
  );
});

test("serve-runtime remains default-blocked and dry-run cannot bypass Phase 5.50", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-50-runtime-"));

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

test("Phase 5.50 display fixture command names remain rejected", async () => {
  for (const command of commandProbes) {
    const failure = await expectCliFailure([command]);

    assert.notEqual(failure.code, 0);
    assert.equal(failure.stdout, "");
    assert.match(failure.stderr, /unknown command|Usage: ardyn/i);
  }
});

test("Phase 5.50 does not change CLI, Rust, Fabric, or package runtime source", async () => {
  await execFileAsync(
    "git",
    [
      "diff",
      "--exit-code",
      phase550BaselineCommit,
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

  assert.doesNotMatch(currentCliSource, /consumer-display-fixture-schema-boundary/);
  assert.doesNotMatch(currentCliSource, /phase-5-50/);
});
