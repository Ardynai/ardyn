import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";
import {
  CONSUMER_DISPLAY_FIXTURE_CONFORMANCE_HANDOFF_SCHEMA,
  createConsumerDisplayFixtureConformanceHandoffForReview,
  createConsumerDisplayFixtureExamplePackForReview,
  createConsumerDisplayFixtureSchemaBoundaryForReview
} from "../packages/core/src/index.mjs";

const execFileAsync = promisify(execFile);
const phase552BaselineCommit = "037773ab55c2c6565c0e392fb460759c2b4f7e4b";
const reviewedAt = "2026-06-20T00:00:00.000Z";
const repoRootUrl = new URL("../", import.meta.url);
const repoRoot = fileURLToPath(repoRootUrl);
const cliPath = fileURLToPath(new URL("../apps/cli/src/index.mjs", import.meta.url));
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-52/consumer-display-fixture-conformance-handoff.json",
  import.meta.url
);

const expectedCaseClassifications = Object.freeze({
  "malformed-consumer-display-fixture-conformance-handoff-input-rejected":
    "malformed_consumer_display_fixture_conformance_handoff_input_rejected",
  "malformed-consumer-display-fixture-conformance-handoff-invalid-reviewed-at-rejected":
    "malformed_consumer_display_fixture_conformance_handoff_input_rejected",
  "malformed-consumer-display-fixture-conformance-handoff-handoff-entries-rejected":
    "malformed_consumer_display_fixture_conformance_handoff_input_rejected",
  "missing-required-consumer-display-fixture-conformance-handoff-entry-rejected":
    "missing_required_consumer_display_fixture_conformance_handoff_entry_rejected",
  "unknown-consumer-name-consumer-display-fixture-conformance-handoff-input-rejected":
    "unknown_consumer_name_consumer_display_fixture_conformance_handoff_input_rejected",
  "unknown-display-intent-consumer-display-fixture-conformance-handoff-input-rejected":
    "unknown_display_intent_consumer_display_fixture_conformance_handoff_input_rejected",
  "interactive-actionable-intent-consumer-display-fixture-conformance-handoff-input-rejected":
    "interactive_actionable_intent_consumer_display_fixture_conformance_handoff_input_rejected",
  "authorization-flags-enabled-consumer-display-fixture-conformance-handoff-input-rejected":
    "authorization_flags_enabled_consumer_display_fixture_conformance_handoff_input_rejected",
  "unsafe-import-execution-flags-consumer-display-fixture-conformance-handoff-input-rejected":
    "unsafe_import_execution_flags_consumer_display_fixture_conformance_handoff_input_rejected",
  "nested-unsafe-flags-consumer-display-fixture-conformance-handoff-input-rejected":
    "nested_unsafe_flags_consumer_display_fixture_conformance_handoff_input_rejected",
  "hidden-import-execution-runtime-semantics-consumer-display-fixture-conformance-handoff-input-rejected":
    "hidden_import_execution_runtime_semantics_consumer_display_fixture_conformance_handoff_input_rejected",
  "secure-drop-implementation-semantics-consumer-display-fixture-conformance-handoff-input-rejected":
    "secure_drop_implementation_semantics_consumer_display_fixture_conformance_handoff_input_rejected",
  "websocket-http-fabric-mcp-task-execution-semantics-consumer-display-fixture-conformance-handoff-input-rejected":
    "websocket_http_fabric_mcp_task_execution_semantics_consumer_display_fixture_conformance_handoff_input_rejected",
  "unknown-reference-consumer-display-fixture-conformance-handoff-input-rejected":
    "unknown_reference_consumer_display_fixture_conformance_handoff_input_rejected",
  "consumer-runner-import-export-implementation-semantics-consumer-display-fixture-conformance-handoff-input-rejected":
    "consumer_runner_import_export_implementation_semantics_consumer_display_fixture_conformance_handoff_input_rejected",
  "valid-consumer-display-fixture-conformance-handoff":
    "valid_consumer_display_fixture_conformance_handoff_runtime_still_blocked"
});

const expectedHandoffIds = Object.freeze([
  "phase5-52.locus.status-control-panel.conformance-handoff",
  "phase5-52.locus.review-artifact-panel.conformance-handoff",
  "phase5-52.locus.capability-metadata-panel.conformance-handoff",
  "phase5-52.locus.blocked-runtime-command.conformance-handoff",
  "phase5-52.locus.future-secure-drop-compose-inbox.conformance-handoff",
  "phase5-52.multiverse.world-project-status.conformance-handoff",
  "phase5-52.multiverse.visible-ai-capability.conformance-handoff",
  "phase5-52.multiverse.task-capability-wrapper-status.conformance-handoff",
  "phase5-52.multiverse.citizen-adapter-candidate.conformance-handoff",
  "phase5-52.multiverse.registry-websocket-mcp-task-blocked.conformance-handoff"
]);

const expectedPhase551FixtureIds = Object.freeze([
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
  "consumer-display-fixture-conformance-handoff",
  "create-consumer-display-fixture-conformance-handoff",
  "phase-5-52-display-fixture-conformance-handoff",
  "consumer-display-fixture-import",
  "display-fixture-import",
  "consumer-conformance-runner",
  "locus-fixture-conformance-runner",
  "multiverse-fixture-conformance-runner",
  "display-fixture-export"
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
  "browserRenderingHarnessImplemented",
  "fixtureImportCommandImplemented",
  "fixtureExportCommandImplemented",
  "fixtureImportExportCommandsImplemented",
  "consumerOwnedRunnerImplemented",
  "consumerConformanceRunnerImplemented",
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

function handoffEntryPatch(patch) {
  const [entry] = createConsumerDisplayFixtureConformanceHandoffForReview({
    reviewedAt
  }).handoffEntries;

  return [{ ...structuredClone(entry), ...patch }];
}

test("Phase 5.52 consumer display fixture conformance handoff fixture is deterministic", async () => {
  const fixture = await readFixture();
  const generated = createConsumerDisplayFixtureConformanceHandoffForReview({
    reviewedAt
  });

  assert.equal(
    fixture.schema,
    CONSUMER_DISPLAY_FIXTURE_CONFORMANCE_HANDOFF_SCHEMA
  );
  assert.deepEqual(fixture, generated);
  assert.equal(
    fixture.classification,
    expectedCaseClassifications[
      "valid-consumer-display-fixture-conformance-handoff"
    ]
  );
  assert.equal(fixture.consumerDisplayFixtureConformanceHandoffProduced, true);
  assert.equal(fixture.handoffSummary.handoffEntryCount, 10);
  assert.equal(fixture.handoffSummary.locusHandoffCount, 5);
  assert.equal(fixture.handoffSummary.multiverseHandoffCount, 5);
});

test("Phase 5.52 handoff references the Phase 5.50 boundary and Phase 5.51 example pack", async () => {
  const fixture = await readFixture();
  const examplePack = createConsumerDisplayFixtureExamplePackForReview({
    reviewedAt
  });
  const examplesByFixtureId = new Map(
    examplePack.fixtureExamples.map((example) => [example.fixtureId, example])
  );

  assert.equal(
    fixture.phase550SchemaBoundaryReference.sourceBoundarySchema,
    "ardyn.phase-5.50.consumer-display-fixture-schema-boundary-result"
  );
  assert.equal(
    fixture.phase551ExamplePackReference.sourceExamplePackSchema,
    "ardyn.phase-5.51.consumer-display-fixture-example-pack-result"
  );
  assert.deepEqual(
    fixture.handoffSummary.referencedPhase551FixtureIds,
    expectedPhase551FixtureIds
  );

  for (const entry of fixture.handoffEntries) {
    const example = examplesByFixtureId.get(entry.referencedPhase551FixtureId);

    assert.ok(example, entry.handoffId);
    assert.equal(
      entry.referencedPhase550SchemaBoundaryId,
      example.phase550SchemaBoundaryFixtureId
    );
    assert.equal(entry.consumerName, example.consumerName);
    assert.equal(entry.displaySurfaceId, example.displaySurfaceId);

    const boundaryResult = createConsumerDisplayFixtureSchemaBoundaryForReview({
      reviewedAt,
      fixtureEntries: [example]
    });

    assert.equal(
      boundaryResult.classification,
      "valid_consumer_display_fixture_schema_boundary_runtime_still_blocked",
      entry.handoffId
    );
  }
});

test("Phase 5.52 invalid conformance handoff cases fail closed without authorization", () => {
  const missingHandoffId = handoffEntryPatch({});
  delete missingHandoffId[0].handoffId;

  const cases = [
    [
      "malformed-consumer-display-fixture-conformance-handoff-input-rejected",
      createConsumerDisplayFixtureConformanceHandoffForReview(null)
    ],
    [
      "malformed-consumer-display-fixture-conformance-handoff-invalid-reviewed-at-rejected",
      createConsumerDisplayFixtureConformanceHandoffForReview({
        reviewedAt: "2026-06-20"
      })
    ],
    [
      "malformed-consumer-display-fixture-conformance-handoff-handoff-entries-rejected",
      createConsumerDisplayFixtureConformanceHandoffForReview({
        reviewedAt,
        handoffEntries: {}
      })
    ],
    [
      "missing-required-consumer-display-fixture-conformance-handoff-entry-rejected",
      createConsumerDisplayFixtureConformanceHandoffForReview({
        reviewedAt,
        handoffEntries: missingHandoffId
      })
    ],
    [
      "unknown-consumer-name-consumer-display-fixture-conformance-handoff-input-rejected",
      createConsumerDisplayFixtureConformanceHandoffForReview({
        reviewedAt,
        handoffEntries: handoffEntryPatch({ consumerName: "content-fabric" })
      })
    ],
    [
      "unknown-display-intent-consumer-display-fixture-conformance-handoff-input-rejected",
      createConsumerDisplayFixtureConformanceHandoffForReview({
        reviewedAt,
        handoffEntries: handoffEntryPatch({ handoffIntent: "metadata_plus_import" })
      })
    ],
    [
      "interactive-actionable-intent-consumer-display-fixture-conformance-handoff-input-rejected",
      createConsumerDisplayFixtureConformanceHandoffForReview({
        reviewedAt,
        handoffEntries: handoffEntryPatch({ handoffIntent: "interactive" })
      })
    ],
    [
      "authorization-flags-enabled-consumer-display-fixture-conformance-handoff-input-rejected",
      createConsumerDisplayFixtureConformanceHandoffForReview({
        reviewedAt,
        handoffEntries: handoffEntryPatch({
          explicitBlockedAuthorizationFlags: { runtimeAuthorized: true }
        })
      })
    ],
    [
      "unsafe-import-execution-flags-consumer-display-fixture-conformance-handoff-input-rejected",
      createConsumerDisplayFixtureConformanceHandoffForReview({
        reviewedAt,
        handoffEntries: handoffEntryPatch({
          unsafeImportExecutionFlags: { consumerRunnerExecutionEnabled: true }
        })
      })
    ],
    [
      "nested-unsafe-flags-consumer-display-fixture-conformance-handoff-input-rejected",
      createConsumerDisplayFixtureConformanceHandoffForReview({
        reviewedAt,
        handoffEntries: handoffEntryPatch({
          nested: { import: { approvalGrantProduced: true } }
        })
      })
    ],
    [
      "hidden-import-execution-runtime-semantics-consumer-display-fixture-conformance-handoff-input-rejected",
      createConsumerDisplayFixtureConformanceHandoffForReview({
        reviewedAt,
        handoffEntries: handoffEntryPatch({
          importSemantics: { hiddenImportSemanticsEnabled: true }
        })
      })
    ],
    [
      "hidden-import-execution-runtime-semantics-consumer-display-fixture-conformance-handoff-input-rejected",
      createConsumerDisplayFixtureConformanceHandoffForReview({
        reviewedAt,
        hiddenImportSemanticsEnabled: true
      })
    ],
    [
      "hidden-import-execution-runtime-semantics-consumer-display-fixture-conformance-handoff-input-rejected",
      createConsumerDisplayFixtureConformanceHandoffForReview({
        reviewedAt,
        importSemantics: { hiddenRuntimeImportSemanticsEnabled: true }
      })
    ],
    [
      "secure-drop-implementation-semantics-consumer-display-fixture-conformance-handoff-input-rejected",
      createConsumerDisplayFixtureConformanceHandoffForReview({
        reviewedAt,
        handoffEntries: handoffEntryPatch({
          secureDrop: { secureDropCryptoImplemented: true }
        })
      })
    ],
    [
      "websocket-http-fabric-mcp-task-execution-semantics-consumer-display-fixture-conformance-handoff-input-rejected",
      createConsumerDisplayFixtureConformanceHandoffForReview({
        reviewedAt,
        handoffEntries: handoffEntryPatch({
          runtimeSurfaces: { mcpToolExposureEnabled: true }
        })
      })
    ],
    [
      "consumer-runner-import-export-implementation-semantics-consumer-display-fixture-conformance-handoff-input-rejected",
      createConsumerDisplayFixtureConformanceHandoffForReview({
        reviewedAt,
        handoffEntries: handoffEntryPatch({ importToolImplemented: true })
      })
    ],
    [
      "unknown-reference-consumer-display-fixture-conformance-handoff-input-rejected",
      createConsumerDisplayFixtureConformanceHandoffForReview({
        reviewedAt,
        handoffEntries: handoffEntryPatch({
          referencedPhase551FixtureId: "phase5-51.unknown.fixture"
        })
      })
    ],
    [
      "valid-consumer-display-fixture-conformance-handoff",
      createConsumerDisplayFixtureConformanceHandoffForReview({ reviewedAt })
    ]
  ];

  for (const [caseName, result] of cases) {
    assert.equal(result.classification, expectedCaseClassifications[caseName], caseName);
    assert.equal(result.reviewOnly, true);
    assert.equal(result.authoritative, false);
    assertNonAuthorizing(result);
  }
});

test("Phase 5.52 handoff covers required consumers, ordering, references, and accessibility expectations", async () => {
  const fixture = await readFixture();
  const entries = new Map(
    fixture.handoffEntries.map((entry) => [entry.displaySurfaceId, entry])
  );

  assert.deepEqual(
    fixture.handoffEntries.map((entry) => entry.handoffId),
    expectedHandoffIds
  );
  assert.deepEqual(
    fixture.handoffEntries.map((entry) => entry.displaySurfaceId),
    expectedDisplaySurfaceIds
  );
  assert.deepEqual(fixture.handoffSummary.consumerNames, [
    "Locus",
    "Multiverse"
  ]);

  for (const entry of fixture.handoffEntries) {
    assert.ok(["Locus", "Multiverse"].includes(entry.consumerName));
    assert.match(entry.handoffId, /^phase5-52\./);
    assert.match(entry.referencedPhase550SchemaBoundaryId, /^phase5-50\./);
    assert.match(entry.referencedPhase551FixtureId, /^phase5-51\./);
    assert.equal(entry.handoffIntent, "metadata_only");
    assert.equal(entry.consumerTargetOnly, true);
    assert.equal(entry.consumerOwnedRunnerImplemented, false);
    assert.equal(entry.fixtureImportCommandImplemented, false);
    assert.equal(entry.fixtureExportCommandImplemented, false);
    assert.equal(entry.browserRenderingHarnessImplemented, false);
    assert.ok(entry.sourceArdynArtifactType.length > 0, entry.handoffId);
    assert.ok(entry.referencedFixtureGroup.length > 0, entry.handoffId);
    assert.ok(
      entry.expectedConsumerSideValidationResponsibility.length > 0,
      entry.handoffId
    );
    assert.ok(entry.allowedConsumerBehavior.length > 0, entry.handoffId);
    assert.ok(entry.forbiddenConsumerBehavior.length >= 6, entry.handoffId);
    assert.ok(
      entry.requiredFutureContractBeforeInteractivity.length > 0,
      entry.handoffId
    );
    assert.equal(entry.nonAuthorizingProof, true, entry.handoffId);
    assertAllFalse(entry.explicitBlockedAuthorizationFlags);
    assertAllFalse(entry.unsafeImportExecutionFlags);
    assertAllFalse(entry.runtimeEffect);

    const accessibility = entry.accessibilityConformanceExpectations;
    assert.ok(accessibility.keyboardScreenReaderDisplayNotes.length > 0);
    assert.equal(accessibility.colorIndependentStatusIndicatorRequired, true);
    assert.equal(accessibility.reducedMotionDefaultStaticDisplayRequired, true);
    assert.equal(accessibility.noAutoExecutionNoHiddenActionSemantics, true);
    assert.equal(accessibility.colorOnlyStatusForbidden, true);
    assert.equal(accessibility.motionRequiredForStatusForbidden, true);
  }

  assert.equal(
    entries.get("locus.future-secure-drop-compose-inbox-indicators").consumerName,
    "Locus"
  );
  assert.equal(
    entries.get("multiverse.registry-websocket-mcp-task-runtime-blocked-indicators")
      .consumerName,
    "Multiverse"
  );
});

test("Phase 5.52 result remains non-authorizing, metadata-only, and runtime blocked", async () => {
  const fixture = await readFixture();

  assert.equal(fixture.reviewOnly, true);
  assert.equal(fixture.authoritative, false);
  assert.equal(fixture.consumerDisplayFixtureConformanceHandoffOnly, true);
  assert.equal(fixture.handoffSummary.referencesPhase550SchemaBoundary, true);
  assert.equal(fixture.handoffSummary.referencesPhase551ExamplePack, true);
  assert.equal(fixture.handoffSummary.locusAndMultiverseConsumerTargetsOnly, true);
  assert.equal(fixture.handoffSummary.consumerOwnedRunnerImplemented, false);
  assert.equal(fixture.handoffSummary.fixtureImportExportCommandsImplemented, false);
  assert.equal(fixture.handoffSummary.uiFrontendBrowserRenderingImplemented, false);
  assert.equal(fixture.handoffSummary.validationPerformsRendering, false);
  assert.equal(fixture.handoffSummary.validationStartsRuntime, false);
  assert.equal(fixture.handoffSummary.validationWritesDbStorage, false);
  assert.equal(fixture.handoffSummary.validationReadsSecrets, false);
  assert.equal(fixture.handoffSummary.validationCallsExternalConsumers, false);
  assert.equal(fixture.handoffSummary.validationPerformsExternalLookups, false);
  assert.equal(fixture.handoffSummary.runtimeExecutionEnabled, false);
  assert.equal(fixture.handoffSummary.commandRuntimeControlEnabled, false);
  assert.equal(fixture.handoffSummary.secureDropImplemented, false);
  assert.equal(fixture.handoffSummary.serviceDiscoveryEnabled, false);
  assert.equal(fixture.handoffSummary.scheduleEnforcementEnabled, false);
  assert.equal(fixture.invalidHandoffCasePolicy.referencesPhase550SchemaBoundaryRequired, true);
  assert.equal(fixture.invalidHandoffCasePolicy.referencesPhase551ExamplePackRequired, true);
  assert.equal(fixture.invalidHandoffCasePolicy.nestedUnsafeInputFlagsFailClosed, true);
  assert.equal(fixture.invalidHandoffCasePolicy.validationImplementsConsumerRunner, false);
  assert.equal(fixture.invalidHandoffCasePolicy.validationImplementsImportExportCommands, false);
  assert.equal(fixture.invalidHandoffCasePolicy.validationPerformsRendering, false);
  assert.equal(fixture.invalidHandoffCasePolicy.validationStartsRuntime, false);
  assert.equal(fixture.invalidHandoffCasePolicy.validationWritesDbStorage, false);
  assert.equal(fixture.invalidHandoffCasePolicy.validationReadsSecrets, false);
  assert.equal(fixture.invalidHandoffCasePolicy.validationCallsExternalConsumers, false);
  assert.equal(fixture.invalidHandoffCasePolicy.validationPerformsExternalLookups, false);
  assertNonAuthorizing(fixture);
  assertNonAuthorizing(fixture.consumerDisplayFixtureConformanceHandoff);
  assert.deepEqual(fixture.rejectionReasons, [
    "consumer_display_fixture_conformance_handoff_is_review_only",
    "handoff_entries_are_metadata_only",
    "references_phase_5_50_schema_boundary",
    "references_phase_5_51_example_pack",
    "ardyn_does_not_implement_ui_frontend_browser_rendering_import_export_or_consumer_runner",
    "runtime_command_db_storage_secrets_connector_fabric_websocket_http_mcp_task_secure_drop_service_discovery_schedule_authorizations_false",
    "unsafe_import_execution_flags_fail_closed",
    "fallow_runtime_not_used",
    "runtime_enablement_still_blocked"
  ]);
  assert.ok(
    fixture.topDisplayConformanceGaps.some((gap) =>
      gap.includes("consumer-owned fixture import or conformance runner")
    )
  );
  assert.equal(
    fixture.recommendedNextPhase,
    "phase-5.53-consumer-owned-display-conformance-runner-requirements"
  );
});

test("serve-runtime remains default-blocked and dry-run cannot bypass Phase 5.52", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-52-runtime-"));

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

test("Phase 5.52 display fixture conformance handoff command names remain rejected", async () => {
  for (const command of commandProbes) {
    const failure = await expectCliFailure([command]);

    assert.notEqual(failure.code, 0);
    assert.equal(failure.stdout, "");
    assert.match(failure.stderr, /unknown command|Usage: ardyn/i);
  }
});

test("Phase 5.52 does not change CLI, Rust, Fabric, or package runtime source", async () => {
  await execFileAsync(
    "git",
    [
      "diff",
      "--exit-code",
      phase552BaselineCommit,
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

  assert.doesNotMatch(currentCliSource, /consumer-display-fixture-conformance-handoff/);
  assert.doesNotMatch(currentCliSource, /consumer-display-fixture-import/);
  assert.doesNotMatch(currentCliSource, /consumer-conformance-runner/);
  assert.doesNotMatch(currentCliSource, /phase-5-52/);
});
