import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";
import {
  CONSUMER_DISPLAY_FIXTURE_EXAMPLE_PACK_SCHEMA,
  createConsumerDisplayFixtureExamplePackForReview,
  createConsumerDisplayFixtureSchemaBoundaryForReview
} from "../packages/core/src/index.mjs";

const execFileAsync = promisify(execFile);
const phase551BaselineCommit = "f3149cc717adc9a9a9a502038a661d1d596dcd58";
const reviewedAt = "2026-06-20T00:00:00.000Z";
const repoRootUrl = new URL("../", import.meta.url);
const repoRoot = fileURLToPath(repoRootUrl);
const cliPath = fileURLToPath(new URL("../apps/cli/src/index.mjs", import.meta.url));
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-51/consumer-display-fixture-example-pack.json",
  import.meta.url
);

const expectedCaseClassifications = Object.freeze({
  "malformed-consumer-display-fixture-example-pack-input-rejected":
    "malformed_consumer_display_fixture_example_pack_input_rejected",
  "malformed-consumer-display-fixture-example-pack-invalid-reviewed-at-rejected":
    "malformed_consumer_display_fixture_example_pack_input_rejected",
  "malformed-consumer-display-fixture-example-pack-fixture-examples-rejected":
    "malformed_consumer_display_fixture_example_pack_input_rejected",
  "missing-required-consumer-display-fixture-example-rejected":
    "missing_required_consumer_display_fixture_example_rejected",
  "unknown-consumer-name-consumer-display-fixture-example-rejected":
    "unknown_consumer_name_consumer_display_fixture_example_rejected",
  "unknown-display-intent-consumer-display-fixture-example-rejected":
    "unknown_display_intent_consumer_display_fixture_example_rejected",
  "interactive-actionable-intent-consumer-display-fixture-example-rejected":
    "interactive_actionable_intent_consumer_display_fixture_example_rejected",
  "authorization-flags-enabled-consumer-display-fixture-example-rejected":
    "authorization_flags_enabled_consumer_display_fixture_example_rejected",
  "nested-unsafe-flags-consumer-display-fixture-example-rejected":
    "nested_unsafe_flags_consumer_display_fixture_example_rejected",
  "hidden-command-runtime-semantics-consumer-display-fixture-example-rejected":
    "hidden_command_runtime_semantics_consumer_display_fixture_example_rejected",
  "secure-drop-implementation-semantics-consumer-display-fixture-example-rejected":
    "secure_drop_implementation_semantics_consumer_display_fixture_example_rejected",
  "websocket-http-fabric-mcp-task-execution-semantics-consumer-display-fixture-example-rejected":
    "websocket_http_fabric_mcp_task_execution_semantics_consumer_display_fixture_example_rejected",
  "valid-consumer-display-fixture-example-pack":
    "valid_consumer_display_fixture_example_pack_runtime_still_blocked"
});

const expectedFixtureIds = Object.freeze([
  "phase5-51.locus.status-control-panel.metadata-card",
  "phase5-51.locus.review-artifact-panel.metadata-card",
  "phase5-51.locus.capability-metadata-panel.card",
  "phase5-51.locus.blocked-runtime-command.indicator",
  "phase5-51.locus.future-secure-drop-compose-inbox.placeholder-indicator",
  "phase5-51.multiverse.world-project-status.card",
  "phase5-51.multiverse.visible-ai-capability.badge",
  "phase5-51.multiverse.task-capability-wrapper-status.card",
  "phase5-51.multiverse.citizen-adapter-candidate.badge",
  "phase5-51.multiverse.registry-websocket-mcp-task-blocked.indicator"
]);

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
  "consumer-display-fixture-example-pack",
  "create-consumer-display-fixture-example-pack",
  "phase-5-51-display-fixture-example-pack",
  "locus-status-control-panel-display-fixture",
  "multiverse-world-project-status-fixture",
  "render-consumer-display-fixture",
  "secure-drop-compose-example-fixture",
  "websocket-mcp-task-example-fixture",
  "display-fixture-example-action"
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
  "backgroundPollingEnabled",
  "externalLookupsEnabled"
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

function fixtureExamplePatch(patch) {
  const [entry] = createConsumerDisplayFixtureExamplePackForReview({
    reviewedAt
  }).fixtureExamples;

  return [{ ...structuredClone(entry), ...patch }];
}

test("Phase 5.51 consumer display fixture example pack fixture is deterministic", async () => {
  const fixture = await readFixture();
  const generated = createConsumerDisplayFixtureExamplePackForReview({
    reviewedAt
  });

  assert.equal(fixture.schema, CONSUMER_DISPLAY_FIXTURE_EXAMPLE_PACK_SCHEMA);
  assert.deepEqual(fixture, generated);
  assert.equal(
    fixture.classification,
    expectedCaseClassifications["valid-consumer-display-fixture-example-pack"]
  );
  assert.equal(fixture.consumerDisplayFixtureExamplePackProduced, true);
  assert.equal(fixture.examplePackSummary.fixtureExampleCount, 10);
  assert.equal(fixture.examplePackSummary.locusExampleCount, 5);
  assert.equal(fixture.examplePackSummary.multiverseExampleCount, 5);
});

test("Phase 5.51 example fixtures conform to the Phase 5.50 schema boundary", async () => {
  const fixture = await readFixture();

  for (const example of fixture.fixtureExamples) {
    const boundaryResult = createConsumerDisplayFixtureSchemaBoundaryForReview({
      reviewedAt,
      fixtureEntries: [example]
    });

    assert.equal(
      boundaryResult.classification,
      "valid_consumer_display_fixture_schema_boundary_runtime_still_blocked",
      example.fixtureId
    );
    assert.equal(boundaryResult.consumerDisplayFixtureSchemaBoundaryProduced, true);
  }

  assert.equal(
    fixture.phase550BoundaryConformance.allExamplesConformToPhase550Boundary,
    true
  );
});

test("Phase 5.51 invalid example fixture cases fail closed without authorization", () => {
  const missingFixtureId = fixtureExamplePatch({});
  delete missingFixtureId[0].fixtureId;

  const cases = [
    [
      "malformed-consumer-display-fixture-example-pack-input-rejected",
      createConsumerDisplayFixtureExamplePackForReview(null)
    ],
    [
      "malformed-consumer-display-fixture-example-pack-invalid-reviewed-at-rejected",
      createConsumerDisplayFixtureExamplePackForReview({ reviewedAt: "2026-06-20" })
    ],
    [
      "malformed-consumer-display-fixture-example-pack-fixture-examples-rejected",
      createConsumerDisplayFixtureExamplePackForReview({
        reviewedAt,
        fixtureExamples: {}
      })
    ],
    [
      "missing-required-consumer-display-fixture-example-rejected",
      createConsumerDisplayFixtureExamplePackForReview({
        reviewedAt,
        fixtureExamples: missingFixtureId
      })
    ],
    [
      "unknown-consumer-name-consumer-display-fixture-example-rejected",
      createConsumerDisplayFixtureExamplePackForReview({
        reviewedAt,
        fixtureExamples: fixtureExamplePatch({ consumerName: "content-fabric" })
      })
    ],
    [
      "unknown-display-intent-consumer-display-fixture-example-rejected",
      createConsumerDisplayFixtureExamplePackForReview({
        reviewedAt,
        fixtureExamples: fixtureExamplePatch({ displayIntent: "animated_metadata" })
      })
    ],
    [
      "interactive-actionable-intent-consumer-display-fixture-example-rejected",
      createConsumerDisplayFixtureExamplePackForReview({
        reviewedAt,
        fixtureExamples: fixtureExamplePatch({ displayIntent: "interactive" })
      })
    ],
    [
      "authorization-flags-enabled-consumer-display-fixture-example-rejected",
      createConsumerDisplayFixtureExamplePackForReview({
        reviewedAt,
        fixtureExamples: fixtureExamplePatch({
          explicitBlockedAuthorizationFlags: { runtimeAuthorized: true }
        })
      })
    ],
    [
      "nested-unsafe-flags-consumer-display-fixture-example-rejected",
      createConsumerDisplayFixtureExamplePackForReview({
        reviewedAt,
        fixtureExamples: fixtureExamplePatch({
          nested: { display: { approvalGrantProduced: true } }
        })
      })
    ],
    [
      "hidden-command-runtime-semantics-consumer-display-fixture-example-rejected",
      createConsumerDisplayFixtureExamplePackForReview({
        reviewedAt,
        fixtureExamples: fixtureExamplePatch({
          displaySemantics: { hiddenCommandSemanticsEnabled: true }
        })
      })
    ],
    [
      "secure-drop-implementation-semantics-consumer-display-fixture-example-rejected",
      createConsumerDisplayFixtureExamplePackForReview({
        reviewedAt,
        fixtureExamples: fixtureExamplePatch({
          secureDrop: { secureDropTransportImplemented: true }
        })
      })
    ],
    [
      "websocket-http-fabric-mcp-task-execution-semantics-consumer-display-fixture-example-rejected",
      createConsumerDisplayFixtureExamplePackForReview({
        reviewedAt,
        fixtureExamples: fixtureExamplePatch({
          runtimeSurfaces: { webSocketRuntimeEnabled: true }
        })
      })
    ],
    [
      "valid-consumer-display-fixture-example-pack",
      createConsumerDisplayFixtureExamplePackForReview({ reviewedAt })
    ]
  ];

  for (const [caseName, result] of cases) {
    assert.equal(result.classification, expectedCaseClassifications[caseName], caseName);
    assert.equal(result.reviewOnly, true);
    assert.equal(result.authoritative, false);
    assertNonAuthorizing(result);
  }
});

test("Phase 5.51 example fixtures cover required surfaces, ordering, IDs, and static accessibility fields", async () => {
  const fixture = await readFixture();
  const entries = new Map(
    fixture.fixtureExamples.map((entry) => [entry.displaySurfaceId, entry])
  );

  assert.deepEqual(
    fixture.fixtureExamples.map((entry) => entry.fixtureId),
    expectedFixtureIds
  );
  assert.deepEqual(
    fixture.fixtureExamples.map((entry) => entry.displaySurfaceId),
    expectedDisplaySurfaceIds
  );
  assert.deepEqual(fixture.examplePackSummary.consumerNames, [
    "Locus",
    "Multiverse"
  ]);

  for (const entry of fixture.fixtureExamples) {
    assert.ok(["Locus", "Multiverse"].includes(entry.consumerName));
    assert.match(entry.fixtureId, /^phase5-51\./);
    assert.match(entry.phase550SchemaBoundaryFixtureId, /^phase5-50\./);
    assert.equal(entry.displayIntent, "metadata_only");
    assert.equal(entry.exampleKind, "consumer-display-fixture-example");
    assert.ok(entry.sourceArdynArtifactType.length > 0, entry.fixtureId);
    assert.ok(entry.readableLabel.length > 0, entry.fixtureId);
    assert.ok(entry.shortDescription.length > 0, entry.fixtureId);
    assert.ok(entry.longDescription.length > 0, entry.fixtureId);
    assert.ok(entry.exampleScenario.length > 0, entry.fixtureId);
    assert.ok(entry.statusSeverityVocabulary.length >= 4, entry.fixtureId);
    assert.ok(entry.allowedDisplayBehavior.length > 0, entry.fixtureId);
    assert.ok(entry.forbiddenDisplayBehavior.length >= 6, entry.fixtureId);
    assert.ok(
      entry.requiredFutureContractBeforeInteractivity.length > 0,
      entry.fixtureId
    );
    assert.equal(entry.conformsToPhase550Boundary, true, entry.fixtureId);
    assert.equal(entry.nonAuthorizingProof, true, entry.fixtureId);
    assertAllFalse(entry.blockedAuthorizationFlags);
    assertAllFalse(entry.explicitBlockedAuthorizationFlags);
    assertAllFalse(entry.recursiveUnsafeInputFlags);
    assertAllFalse(entry.runtimeEffect);

    const accessibility = entry.accessibilityNotes;
    assert.ok(accessibility.keyboardScreenReaderDisplayNotes.length > 0);
    assert.equal(accessibility.colorIndependentStatusIndicatorRequired, true);
    assert.equal(accessibility.reducedMotionDefaultStaticDisplayRequired, true);
    assert.equal(accessibility.noAutoExecutionNoHiddenActionSemantics, true);
    assert.equal(accessibility.colorOnlyStatusForbidden, true);
    assert.equal(accessibility.motionRequiredForStatusForbidden, true);
    assert.deepEqual(entry.accessibilityFields, entry.accessibilityNotes);
    assert.equal(
      entry.displayFixtureExamplePayload.hiddenActionPolicy,
      "no auto-execution and no hidden action semantics"
    );
  }

  assert.ok(
    entries
      .get("locus.future-secure-drop-compose-inbox-indicators")
      .displayFixtureExamplePayload.primaryStatus.includes("secure_drop")
  );
  assert.ok(
    entries
      .get("multiverse.registry-websocket-mcp-task-runtime-blocked-indicators")
      .displayFixtureExamplePayload.primaryStatus.includes("mcp")
  );
});

test("Phase 5.51 result remains non-authorizing, metadata-only, and runtime blocked", async () => {
  const fixture = await readFixture();

  assert.equal(fixture.reviewOnly, true);
  assert.equal(fixture.authoritative, false);
  assert.equal(fixture.consumerDisplayFixtureExamplePackOnly, true);
  assert.equal(fixture.examplePackSummary.metadataOnlyDisplayIntentForAllExamples, true);
  assert.equal(fixture.examplePackSummary.allExamplesConformToPhase550Boundary, true);
  assert.equal(fixture.examplePackSummary.uiFrontendBrowserCodeImplemented, false);
  assert.equal(fixture.examplePackSummary.renderingCodeImplemented, false);
  assert.equal(fixture.examplePackSummary.consumerRuntimeIntegrationAdded, false);
  assert.equal(fixture.examplePackSummary.runtimeExecutionEnabled, false);
  assert.equal(fixture.examplePackSummary.commandRuntimeControlEnabled, false);
  assert.equal(fixture.examplePackSummary.secureDropImplemented, false);
  assert.equal(fixture.examplePackSummary.serviceDiscoveryEnabled, false);
  assert.equal(fixture.examplePackSummary.scheduleEnforcementEnabled, false);
  assert.equal(fixture.invalidExampleCasePolicy.examplesMustConformToPhase550Boundary, true);
  assert.equal(fixture.invalidExampleCasePolicy.nestedUnsafeInputFlagsFailClosed, true);
  assert.equal(fixture.invalidExampleCasePolicy.validationPerformsRendering, false);
  assert.equal(fixture.invalidExampleCasePolicy.validationStartsRuntime, false);
  assert.equal(fixture.invalidExampleCasePolicy.validationWritesDbStorage, false);
  assert.equal(fixture.invalidExampleCasePolicy.validationReadsSecrets, false);
  assert.equal(fixture.invalidExampleCasePolicy.validationCallsExternalConsumers, false);
  assert.equal(fixture.invalidExampleCasePolicy.validationPerformsExternalLookups, false);
  assertNonAuthorizing(fixture);
  assertNonAuthorizing(fixture.consumerDisplayFixtureExamplePack);
  assert.deepEqual(fixture.rejectionReasons, [
    "consumer_display_fixture_example_pack_is_review_only",
    "fixture_examples_are_metadata_only",
    "examples_conform_to_phase_5_50_schema_boundary",
    "ardyn_does_not_implement_ui_frontend_browser_or_rendering",
    "ui_rendering_runtime_command_db_storage_secrets_connector_fabric_websocket_http_mcp_task_secure_drop_authorizations_false",
    "recursive_unsafe_input_flags_fail_closed",
    "fallow_runtime_not_used",
    "runtime_enablement_still_blocked"
  ]);
  assert.ok(
    fixture.topDisplayFixtureExampleGaps.some((gap) =>
      gap.includes("No browser, rendering, WCAG automation")
    )
  );
  assert.equal(
    fixture.recommendedNextPhase,
    "phase-5.52-consumer-display-fixture-conformance-handoff"
  );
});

test("serve-runtime remains default-blocked and dry-run cannot bypass Phase 5.51", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-51-runtime-"));

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

test("Phase 5.51 display fixture example command names remain rejected", async () => {
  for (const command of commandProbes) {
    const failure = await expectCliFailure([command]);

    assert.notEqual(failure.code, 0);
    assert.equal(failure.stdout, "");
    assert.match(failure.stderr, /unknown command|Usage: ardyn/i);
  }
});

test("Phase 5.51 does not change CLI, Rust, Fabric, or package runtime source", async () => {
  await execFileAsync(
    "git",
    [
      "diff",
      "--exit-code",
      phase551BaselineCommit,
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

  assert.doesNotMatch(currentCliSource, /consumer-display-fixture-example-pack/);
  assert.doesNotMatch(currentCliSource, /phase-5-51/);
});
