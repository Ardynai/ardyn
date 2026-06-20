import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";
import {
  CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_REQUIREMENTS_SCHEMA,
  createConsumerDisplayFixtureConformanceHandoffForReview,
  createConsumerDisplayFixtureExamplePackForReview,
  createConsumerDisplayFixtureSchemaBoundaryForReview,
  createConsumerOwnedDisplayConformanceRunnerRequirementsForReview
} from "../packages/core/src/index.mjs";

const execFileAsync = promisify(execFile);
const phase553BaselineCommit = "dba5966fc4743f5203f86583e498ee06bb5450cd";
const reviewedAt = "2026-06-20T00:00:00.000Z";
const repoRootUrl = new URL("../", import.meta.url);
const repoRoot = fileURLToPath(repoRootUrl);
const cliPath = fileURLToPath(new URL("../apps/cli/src/index.mjs", import.meta.url));
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-53/consumer-owned-display-conformance-runner-requirements.json",
  import.meta.url
);

const expectedCaseClassifications = Object.freeze({
  "malformed-consumer-owned-display-conformance-runner-requirements-input-rejected":
    "malformed_consumer_owned_display_conformance_runner_requirements_input_rejected",
  "malformed-consumer-owned-display-conformance-runner-requirements-invalid-reviewed-at-rejected":
    "malformed_consumer_owned_display_conformance_runner_requirements_input_rejected",
  "malformed-consumer-owned-display-conformance-runner-requirements-requirement-entries-rejected":
    "malformed_consumer_owned_display_conformance_runner_requirements_input_rejected",
  "missing-required-consumer-owned-display-conformance-runner-requirement-rejected":
    "missing_required_consumer_owned_display_conformance_runner_requirement_rejected",
  "unknown-consumer-name-consumer-owned-display-conformance-runner-requirements-input-rejected":
    "unknown_consumer_name_consumer_owned_display_conformance_runner_requirements_input_rejected",
  "unknown-requirements-intent-consumer-owned-display-conformance-runner-requirements-input-rejected":
    "unknown_requirements_intent_consumer_owned_display_conformance_runner_requirements_input_rejected",
  "interactive-actionable-intent-consumer-owned-display-conformance-runner-requirements-input-rejected":
    "interactive_actionable_intent_consumer_owned_display_conformance_runner_requirements_input_rejected",
  "authorization-flags-enabled-consumer-owned-display-conformance-runner-requirements-input-rejected":
    "authorization_flags_enabled_consumer_owned_display_conformance_runner_requirements_input_rejected",
  "unsafe-runner-import-export-runtime-flags-consumer-owned-display-conformance-runner-requirements-input-rejected":
    "unsafe_runner_import_export_runtime_flags_consumer_owned_display_conformance_runner_requirements_input_rejected",
  "nested-unsafe-flags-consumer-owned-display-conformance-runner-requirements-input-rejected":
    "nested_unsafe_flags_consumer_owned_display_conformance_runner_requirements_input_rejected",
  "hidden-runner-import-export-runtime-semantics-consumer-owned-display-conformance-runner-requirements-input-rejected":
    "hidden_runner_import_export_runtime_semantics_consumer_owned_display_conformance_runner_requirements_input_rejected",
  "secure-drop-implementation-semantics-consumer-owned-display-conformance-runner-requirements-input-rejected":
    "secure_drop_implementation_semantics_consumer_owned_display_conformance_runner_requirements_input_rejected",
  "websocket-http-fabric-mcp-task-execution-semantics-consumer-owned-display-conformance-runner-requirements-input-rejected":
    "websocket_http_fabric_mcp_task_execution_semantics_consumer_owned_display_conformance_runner_requirements_input_rejected",
  "unknown-reference-consumer-owned-display-conformance-runner-requirements-input-rejected":
    "unknown_reference_consumer_owned_display_conformance_runner_requirements_input_rejected",
  "runner-import-export-implementation-semantics-consumer-owned-display-conformance-runner-requirements-input-rejected":
    "runner_import_export_implementation_semantics_consumer_owned_display_conformance_runner_requirements_input_rejected",
  "valid-consumer-owned-display-conformance-runner-requirements":
    "valid_consumer_owned_display_conformance_runner_requirements_runtime_still_blocked"
});

const expectedRequirementIds = Object.freeze([
  "phase5-53.locus.status-control-panel.runner-requirement",
  "phase5-53.locus.review-artifact-panel.runner-requirement",
  "phase5-53.locus.capability-metadata-panel.runner-requirement",
  "phase5-53.locus.blocked-runtime-command.runner-requirement",
  "phase5-53.locus.future-secure-drop-compose-inbox.runner-requirement",
  "phase5-53.multiverse.world-project-status.runner-requirement",
  "phase5-53.multiverse.visible-ai-capability.runner-requirement",
  "phase5-53.multiverse.task-capability-wrapper-status.runner-requirement",
  "phase5-53.multiverse.citizen-adapter-candidate.runner-requirement",
  "phase5-53.multiverse.registry-websocket-mcp-task-blocked.runner-requirement"
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

const expectedPhase552HandoffIds = Object.freeze([
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
  "consumer-owned-display-conformance-runner-requirements",
  "create-consumer-owned-display-conformance-runner-requirements",
  "phase-5-53-display-conformance-runner-requirements",
  "consumer-display-conformance-runner",
  "display-fixture-runner",
  "consumer-display-fixture-import",
  "display-fixture-export",
  "locus-display-conformance-runner",
  "multiverse-display-conformance-runner",
  "fixture-discovery-runtime",
  "consumer-side-ci-runner"
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
  "runnerImplementedByArdyn",
  "consumerOwnedRunnerImplemented",
  "consumerConformanceRunnerImplemented",
  "fixtureImportCommandImplemented",
  "fixtureExportCommandImplemented",
  "fixtureImportExportCommandsImplemented",
  "importExportCommandImplemented",
  "packageExportImplemented",
  "consumerSideCiImplemented",
  "fixtureDiscoveryRuntimeImplemented",
  "consumerRepoModifiedByArdyn",
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

function requirementEntryPatch(patch) {
  const [entry] =
    createConsumerOwnedDisplayConformanceRunnerRequirementsForReview({
      reviewedAt
    }).requirementEntries;

  return [{ ...structuredClone(entry), ...patch }];
}

test("Phase 5.53 consumer-owned display conformance runner requirements fixture is deterministic", async () => {
  const fixture = await readFixture();
  const generated =
    createConsumerOwnedDisplayConformanceRunnerRequirementsForReview({
      reviewedAt
    });

  assert.equal(
    fixture.schema,
    CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_REQUIREMENTS_SCHEMA
  );
  assert.deepEqual(fixture, generated);
  assert.equal(
    fixture.classification,
    expectedCaseClassifications[
      "valid-consumer-owned-display-conformance-runner-requirements"
    ]
  );
  assert.equal(
    fixture.consumerOwnedDisplayConformanceRunnerRequirementsProduced,
    true
  );
  assert.equal(fixture.requirementsSummary.requirementEntryCount, 10);
  assert.equal(fixture.requirementsSummary.locusRequirementCount, 5);
  assert.equal(fixture.requirementsSummary.multiverseRequirementCount, 5);
});

test("Phase 5.53 requirements reference Phase 5.50, 5.51, and 5.52 artifacts", async () => {
  const fixture = await readFixture();
  const handoff = createConsumerDisplayFixtureConformanceHandoffForReview({
    reviewedAt
  });
  const handoffById = new Map(
    handoff.handoffEntries.map((entry) => [entry.handoffId, entry])
  );
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
  assert.equal(
    fixture.phase552ConformanceHandoffReference.sourceHandoffSchema,
    "ardyn.phase-5.52.consumer-display-fixture-conformance-handoff-result"
  );
  assert.deepEqual(
    fixture.requirementsSummary.referencedPhase551FixtureIds,
    expectedPhase551FixtureIds
  );
  assert.deepEqual(
    fixture.requirementsSummary.referencedPhase552HandoffIds,
    expectedPhase552HandoffIds
  );

  for (const entry of fixture.requirementEntries) {
    const handoffEntry = handoffById.get(entry.referencedPhase552HandoffId);
    const example = examplesByFixtureId.get(entry.referencedPhase551FixtureId);

    assert.ok(handoffEntry, entry.requirementId);
    assert.ok(example, entry.requirementId);
    assert.equal(
      entry.referencedPhase550SchemaBoundaryId,
      handoffEntry.referencedPhase550SchemaBoundaryId
    );
    assert.equal(
      entry.referencedPhase551FixtureId,
      handoffEntry.referencedPhase551FixtureId
    );
    assert.equal(
      entry.referencedPhase551FixtureGroup,
      handoffEntry.referencedFixtureGroup
    );
    assert.equal(entry.consumerName, handoffEntry.consumerName);
    assert.equal(entry.displaySurfaceId, handoffEntry.displaySurfaceId);

    const boundaryResult = createConsumerDisplayFixtureSchemaBoundaryForReview({
      reviewedAt,
      fixtureEntries: [example]
    });

    assert.equal(
      boundaryResult.classification,
      "valid_consumer_display_fixture_schema_boundary_runtime_still_blocked",
      entry.requirementId
    );
  }
});

test("Phase 5.53 invalid runner requirement cases fail closed without authorization", () => {
  const missingRequirementId = requirementEntryPatch({});
  delete missingRequirementId[0].requirementId;

  const cases = [
    [
      "malformed-consumer-owned-display-conformance-runner-requirements-input-rejected",
      createConsumerOwnedDisplayConformanceRunnerRequirementsForReview(null)
    ],
    [
      "malformed-consumer-owned-display-conformance-runner-requirements-invalid-reviewed-at-rejected",
      createConsumerOwnedDisplayConformanceRunnerRequirementsForReview({
        reviewedAt: "2026-06-20"
      })
    ],
    [
      "malformed-consumer-owned-display-conformance-runner-requirements-requirement-entries-rejected",
      createConsumerOwnedDisplayConformanceRunnerRequirementsForReview({
        reviewedAt,
        requirementEntries: {}
      })
    ],
    [
      "missing-required-consumer-owned-display-conformance-runner-requirement-rejected",
      createConsumerOwnedDisplayConformanceRunnerRequirementsForReview({
        reviewedAt,
        requirementEntries: missingRequirementId
      })
    ],
    [
      "unknown-consumer-name-consumer-owned-display-conformance-runner-requirements-input-rejected",
      createConsumerOwnedDisplayConformanceRunnerRequirementsForReview({
        reviewedAt,
        requirementEntries: requirementEntryPatch({ consumerName: "content-fabric" })
      })
    ],
    [
      "unknown-requirements-intent-consumer-owned-display-conformance-runner-requirements-input-rejected",
      createConsumerOwnedDisplayConformanceRunnerRequirementsForReview({
        reviewedAt,
        requirementEntries: requirementEntryPatch({
          requirementsIntent: "metadata_plus_runner"
        })
      })
    ],
    [
      "interactive-actionable-intent-consumer-owned-display-conformance-runner-requirements-input-rejected",
      createConsumerOwnedDisplayConformanceRunnerRequirementsForReview({
        reviewedAt,
        requirementEntries: requirementEntryPatch({ requirementsIntent: "interactive" })
      })
    ],
    [
      "authorization-flags-enabled-consumer-owned-display-conformance-runner-requirements-input-rejected",
      createConsumerOwnedDisplayConformanceRunnerRequirementsForReview({
        reviewedAt,
        requirementEntries: requirementEntryPatch({
          explicitBlockedAuthorizationFlags: { runtimeAuthorized: true }
        })
      })
    ],
    [
      "unsafe-runner-import-export-runtime-flags-consumer-owned-display-conformance-runner-requirements-input-rejected",
      createConsumerOwnedDisplayConformanceRunnerRequirementsForReview({
        reviewedAt,
        requirementEntries: requirementEntryPatch({
          unsafeRunnerImportExportRuntimeFlags: { runnerEnabled: true }
        })
      })
    ],
    [
      "nested-unsafe-flags-consumer-owned-display-conformance-runner-requirements-input-rejected",
      createConsumerOwnedDisplayConformanceRunnerRequirementsForReview({
        reviewedAt,
        requirementEntries: requirementEntryPatch({
          nested: { runner: { approvalGrantProduced: true } }
        })
      })
    ],
    [
      "hidden-runner-import-export-runtime-semantics-consumer-owned-display-conformance-runner-requirements-input-rejected",
      createConsumerOwnedDisplayConformanceRunnerRequirementsForReview({
        reviewedAt,
        requirementEntries: requirementEntryPatch({
          runnerSemantics: { hiddenRunnerSemanticsEnabled: true }
        })
      })
    ],
    [
      "hidden-runner-import-export-runtime-semantics-consumer-owned-display-conformance-runner-requirements-input-rejected",
      createConsumerOwnedDisplayConformanceRunnerRequirementsForReview({
        reviewedAt,
        hiddenRunnerSemanticsEnabled: true
      })
    ],
    [
      "hidden-runner-import-export-runtime-semantics-consumer-owned-display-conformance-runner-requirements-input-rejected",
      createConsumerOwnedDisplayConformanceRunnerRequirementsForReview({
        reviewedAt,
        runnerSemantics: { hiddenRuntimeSemanticsEnabled: true }
      })
    ],
    [
      "secure-drop-implementation-semantics-consumer-owned-display-conformance-runner-requirements-input-rejected",
      createConsumerOwnedDisplayConformanceRunnerRequirementsForReview({
        reviewedAt,
        requirementEntries: requirementEntryPatch({
          secureDrop: { secureDropCryptoImplemented: true }
        })
      })
    ],
    [
      "websocket-http-fabric-mcp-task-execution-semantics-consumer-owned-display-conformance-runner-requirements-input-rejected",
      createConsumerOwnedDisplayConformanceRunnerRequirementsForReview({
        reviewedAt,
        requirementEntries: requirementEntryPatch({
          runtimeSurfaces: { mcpToolExposureEnabled: true }
        })
      })
    ],
    [
      "runner-import-export-implementation-semantics-consumer-owned-display-conformance-runner-requirements-input-rejected",
      createConsumerOwnedDisplayConformanceRunnerRequirementsForReview({
        reviewedAt,
        requirementEntries: requirementEntryPatch({ importToolImplemented: true })
      })
    ],
    [
      "unknown-reference-consumer-owned-display-conformance-runner-requirements-input-rejected",
      createConsumerOwnedDisplayConformanceRunnerRequirementsForReview({
        reviewedAt,
        requirementEntries: requirementEntryPatch({
          referencedPhase552HandoffId: "phase5-52.unknown.handoff"
        })
      })
    ],
    [
      "valid-consumer-owned-display-conformance-runner-requirements",
      createConsumerOwnedDisplayConformanceRunnerRequirementsForReview({
        reviewedAt
      })
    ]
  ];

  for (const [caseName, result] of cases) {
    assert.equal(result.classification, expectedCaseClassifications[caseName], caseName);
    assert.equal(result.reviewOnly, true);
    assert.equal(result.authoritative, false);
    assertNonAuthorizing(result);
  }
});

test("Phase 5.53 requirements cover required consumers, ordering, accessibility, and runner boundaries", async () => {
  const fixture = await readFixture();
  const entries = new Map(
    fixture.requirementEntries.map((entry) => [entry.displaySurfaceId, entry])
  );

  assert.deepEqual(
    fixture.requirementEntries.map((entry) => entry.requirementId),
    expectedRequirementIds
  );
  assert.deepEqual(
    fixture.requirementEntries.map((entry) => entry.displaySurfaceId),
    expectedDisplaySurfaceIds
  );
  assert.deepEqual(fixture.requirementsSummary.consumerNames, [
    "Locus",
    "Multiverse"
  ]);
  assert.equal(
    fixture.phase552SubagentAuditTrailReconciliation.finalReportActualReviewer,
    "019ee4d4-30eb-7553-b20c-6faa01d972d3 / Goodall"
  );
  assert.equal(
    fixture.phase552SubagentAuditTrailReconciliation.localSessionFooterMismatchReported,
    "Feynman / James"
  );

  for (const entry of fixture.requirementEntries) {
    assert.ok(["Locus", "Multiverse"].includes(entry.consumerName));
    assert.match(entry.requirementId, /^phase5-53\./);
    assert.match(entry.referencedPhase550SchemaBoundaryId, /^phase5-50\./);
    assert.match(entry.referencedPhase551FixtureId, /^phase5-51\./);
    assert.match(entry.referencedPhase552HandoffId, /^phase5-52\./);
    assert.equal(entry.requirementsIntent, "metadata_only");
    assert.equal(entry.consumerTargetOnly, true);
    assert.equal(entry.runnerImplementedByArdyn, false);
    assert.equal(entry.importExportCommandImplemented, false);
    assert.equal(entry.browserRenderingHarnessImplemented, false);
    assert.equal(entry.packageExportImplemented, false);
    assert.equal(entry.consumerSideCiImplemented, false);
    assert.equal(entry.fixtureDiscoveryRuntimeImplemented, false);
    assert.equal(entry.consumerRepoModifiedByArdyn, false);
    assert.ok(entry.sourceArdynArtifactType.length > 0, entry.requirementId);
    assert.ok(entry.referencedPhase551FixtureGroup.length > 0, entry.requirementId);
    assert.ok(entry.expectedConsumerOwnedRunnerResponsibility.length > 0);
    assert.ok(entry.allowedFutureRunnerBehavior.length > 0);
    assert.ok(entry.forbiddenCurrentArdynBehavior.length >= 8);
    assert.ok(entry.requiredFutureContractBeforeInteractivity.length > 0);
    assert.equal(entry.nonAuthorizingProof, true, entry.requirementId);
    assertAllFalse(entry.explicitBlockedAuthorizationFlags);
    assertAllFalse(entry.unsafeRunnerImportExportRuntimeFlags);
    assertAllFalse(entry.runtimeEffect);

    const accessibility = entry.accessibilityWcagValidationExpectations;
    assert.ok(accessibility.keyboardScreenReaderDisplayNotes.length > 0);
    assert.equal(accessibility.colorIndependentStatusIndicatorRequired, true);
    assert.equal(accessibility.reducedMotionDefaultStaticDisplayRequired, true);
    assert.equal(accessibility.noAutoExecutionNoHiddenActionSemantics, true);
    assert.equal(accessibility.colorOnlyStatusForbidden, true);
    assert.equal(accessibility.motionRequiredForStatusForbidden, true);
    assert.equal(accessibility.keyboardTraversalValidationRequired, true);
    assert.equal(accessibility.screenReaderLabelValidationRequired, true);
    assert.equal(accessibility.colorIndependentStatusValidationRequired, true);
    assert.equal(accessibility.reducedMotionStaticDefaultValidationRequired, true);
    assert.equal(accessibility.noAutoExecutionNoHiddenActionValidationRequired, true);

    assert.equal(entry.fixtureDeterminismExpectations.deterministicFixtureIdsRequired, true);
    assert.equal(entry.fixtureDeterminismExpectations.deterministicOrderingRequired, true);
    assert.equal(
      entry.fixtureDeterminismExpectations.consumerRunnerOutputMustBeReviewOnly,
      true
    );
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

test("Phase 5.53 result remains non-authorizing, metadata-only, and runtime blocked", async () => {
  const fixture = await readFixture();

  assert.equal(fixture.reviewOnly, true);
  assert.equal(fixture.authoritative, false);
  assert.equal(fixture.consumerOwnedDisplayConformanceRunnerRequirementsOnly, true);
  assert.equal(fixture.requirementsSummary.referencesPhase550SchemaBoundary, true);
  assert.equal(fixture.requirementsSummary.referencesPhase551ExamplePack, true);
  assert.equal(fixture.requirementsSummary.referencesPhase552ConformanceHandoff, true);
  assert.equal(fixture.requirementsSummary.locusAndMultiverseConsumerTargetsOnly, true);
  assert.equal(fixture.requirementsSummary.consumerRepoModifiedByArdyn, false);
  assert.equal(fixture.requirementsSummary.runnerImplementedByArdyn, false);
  assert.equal(fixture.requirementsSummary.importExportCommandImplemented, false);
  assert.equal(fixture.requirementsSummary.packageExportImplemented, false);
  assert.equal(fixture.requirementsSummary.consumerSideCiImplemented, false);
  assert.equal(fixture.requirementsSummary.fixtureDiscoveryRuntimeImplemented, false);
  assert.equal(fixture.requirementsSummary.uiFrontendBrowserRenderingImplemented, false);
  assert.equal(fixture.requirementsSummary.validationPerformsRendering, false);
  assert.equal(fixture.requirementsSummary.validationStartsRuntime, false);
  assert.equal(fixture.requirementsSummary.validationWritesDbStorage, false);
  assert.equal(fixture.requirementsSummary.validationReadsSecrets, false);
  assert.equal(fixture.requirementsSummary.validationCallsExternalConsumers, false);
  assert.equal(fixture.requirementsSummary.validationPerformsExternalLookups, false);
  assert.equal(fixture.requirementsSummary.validationScansFilesystem, false);
  assert.equal(fixture.requirementsSummary.validationControlsProcesses, false);
  assert.equal(fixture.requirementsSummary.runtimeExecutionEnabled, false);
  assert.equal(fixture.requirementsSummary.commandRuntimeControlEnabled, false);
  assert.equal(fixture.requirementsSummary.secureDropImplemented, false);
  assert.equal(fixture.requirementsSummary.serviceDiscoveryEnabled, false);
  assert.equal(fixture.requirementsSummary.scheduleEnforcementEnabled, false);
  assert.equal(fixture.requirementsSummary.filesystemScanningEnabled, false);
  assert.equal(fixture.requirementsSummary.processControlEnabled, false);
  assert.equal(fixture.invalidRequirementCasePolicy.referencesPhase550SchemaBoundaryRequired, true);
  assert.equal(fixture.invalidRequirementCasePolicy.referencesPhase551ExamplePackRequired, true);
  assert.equal(fixture.invalidRequirementCasePolicy.referencesPhase552ConformanceHandoffRequired, true);
  assert.equal(fixture.invalidRequirementCasePolicy.nestedUnsafeInputFlagsFailClosed, true);
  assert.equal(fixture.invalidRequirementCasePolicy.validationImplementsRunner, false);
  assert.equal(fixture.invalidRequirementCasePolicy.validationImplementsImportExportCommands, false);
  assert.equal(fixture.invalidRequirementCasePolicy.validationImplementsPackageExport, false);
  assert.equal(fixture.invalidRequirementCasePolicy.validationImplementsConsumerSideCi, false);
  assert.equal(fixture.invalidRequirementCasePolicy.validationImplementsFixtureDiscoveryRuntime, false);
  assert.equal(fixture.invalidRequirementCasePolicy.validationPerformsRendering, false);
  assert.equal(fixture.invalidRequirementCasePolicy.validationStartsRuntime, false);
  assert.equal(fixture.invalidRequirementCasePolicy.validationWritesDbStorage, false);
  assert.equal(fixture.invalidRequirementCasePolicy.validationReadsSecrets, false);
  assert.equal(fixture.invalidRequirementCasePolicy.validationCallsExternalConsumers, false);
  assert.equal(fixture.invalidRequirementCasePolicy.validationPerformsExternalLookups, false);
  assert.equal(fixture.invalidRequirementCasePolicy.validationScansFilesystem, false);
  assert.equal(fixture.invalidRequirementCasePolicy.validationControlsProcesses, false);
  assertNonAuthorizing(fixture);
  assertNonAuthorizing(
    fixture.consumerOwnedDisplayConformanceRunnerRequirements
  );
  assert.deepEqual(fixture.rejectionReasons, [
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
  ]);
  assert.ok(
    fixture.topDisplayConformanceRunnerRequirementGaps.some((gap) =>
      gap.includes("no Locus or Multiverse consumer-owned display conformance runner")
    )
  );
  assert.equal(
    fixture.recommendedNextPhase,
    "phase-5.54-consumer-owned-display-conformance-runner-test-plan"
  );
});

test("serve-runtime remains default-blocked and dry-run cannot bypass Phase 5.53", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-53-runtime-"));

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

test("Phase 5.53 runner/import/export command names remain rejected", async () => {
  for (const command of commandProbes) {
    const failure = await expectCliFailure([command]);

    assert.notEqual(failure.code, 0);
    assert.equal(failure.stdout, "");
    assert.match(failure.stderr, /unknown command|Usage: ardyn/i);
  }
});

test("Phase 5.53 does not change CLI, Rust, Fabric, package, or consumer source", async () => {
  await execFileAsync(
    "git",
    [
      "diff",
      "--exit-code",
      phase553BaselineCommit,
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

  assert.doesNotMatch(currentCliSource, /consumer-owned-display-conformance-runner-requirements/);
  assert.doesNotMatch(currentCliSource, /consumer-display-conformance-runner/);
  assert.doesNotMatch(currentCliSource, /fixture-discovery-runtime/);
  assert.doesNotMatch(currentCliSource, /consumer-side-ci-runner/);
  assert.doesNotMatch(currentCliSource, /phase-5-53/);
});
