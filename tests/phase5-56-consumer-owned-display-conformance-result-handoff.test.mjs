import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";
import {
  CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_HANDOFF_SCHEMA,
  createConsumerDisplayFixtureExamplePackForReview,
  createConsumerDisplayFixtureSchemaBoundaryForReview,
  createConsumerOwnedDisplayConformanceResultHandoffForReview,
  createConsumerOwnedDisplayConformanceRunnerResultSchemaBoundaryForReview
} from "../packages/core/src/index.mjs";

const execFileAsync = promisify(execFile);
const phase556BaselineCommit = "5391602bc0055f1a2bf08215d7f96adc17b1f497";
const reviewedAt = "2026-06-20T00:00:00.000Z";
const repoRootUrl = new URL("../", import.meta.url);
const repoRoot = fileURLToPath(repoRootUrl);
const cliPath = fileURLToPath(new URL("../apps/cli/src/index.mjs", import.meta.url));
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-56/consumer-owned-display-conformance-result-handoff.json",
  import.meta.url
);

const expectedCaseClassifications = Object.freeze({
  "malformed-consumer-owned-display-conformance-result-handoff-input-rejected":
    "malformed_consumer_owned_display_conformance_result_handoff_input_rejected",
  "missing-required-consumer-owned-display-conformance-result-handoff-entry-rejected":
    "missing_required_consumer_owned_display_conformance_result_handoff_entry_rejected",
  "unknown-consumer-name-consumer-owned-display-conformance-result-handoff-input-rejected":
    "unknown_consumer_name_consumer_owned_display_conformance_result_handoff_input_rejected",
  "unknown-result-handoff-intent-consumer-owned-display-conformance-result-handoff-input-rejected":
    "unknown_result_handoff_intent_consumer_owned_display_conformance_result_handoff_input_rejected",
  "interactive-actionable-intent-consumer-owned-display-conformance-result-handoff-input-rejected":
    "interactive_actionable_intent_consumer_owned_display_conformance_result_handoff_input_rejected",
  "authorization-flags-enabled-consumer-owned-display-conformance-result-handoff-input-rejected":
    "authorization_flags_enabled_consumer_owned_display_conformance_result_handoff_input_rejected",
  "unsafe-runner-result-producer-result-collector-import-export-test-harness-runtime-flags-consumer-owned-display-conformance-result-handoff-input-rejected":
    "unsafe_runner_result_producer_result_collector_import_export_test_harness_runtime_flags_consumer_owned_display_conformance_result_handoff_input_rejected",
  "nested-unsafe-flags-consumer-owned-display-conformance-result-handoff-input-rejected":
    "nested_unsafe_flags_consumer_owned_display_conformance_result_handoff_input_rejected",
  "hidden-runner-result-producer-result-collector-import-export-test-harness-runtime-semantics-consumer-owned-display-conformance-result-handoff-input-rejected":
    "hidden_runner_result_producer_result_collector_import_export_test_harness_runtime_semantics_consumer_owned_display_conformance_result_handoff_input_rejected",
  "secure-drop-implementation-semantics-consumer-owned-display-conformance-result-handoff-input-rejected":
    "secure_drop_implementation_semantics_consumer_owned_display_conformance_result_handoff_input_rejected",
  "websocket-http-fabric-mcp-task-execution-semantics-consumer-owned-display-conformance-result-handoff-input-rejected":
    "websocket_http_fabric_mcp_task_execution_semantics_consumer_owned_display_conformance_result_handoff_input_rejected",
  "unknown-reference-consumer-owned-display-conformance-result-handoff-input-rejected":
    "unknown_reference_consumer_owned_display_conformance_result_handoff_input_rejected",
  "noncanonical-consumer-owned-display-conformance-result-handoff-input-rejected":
    "noncanonical_consumer_owned_display_conformance_result_handoff_input_rejected",
  "runner-result-producer-result-collector-import-export-test-harness-implementation-semantics-consumer-owned-display-conformance-result-handoff-input-rejected":
    "runner_result_producer_result_collector_import_export_test_harness_implementation_semantics_consumer_owned_display_conformance_result_handoff_input_rejected",
  "valid-consumer-owned-display-conformance-result-handoff":
    "valid_consumer_owned_display_conformance_result_handoff_runtime_still_blocked"
});

const expectedHandoffIds = Object.freeze([
  "phase5-56.locus.status-control-panel-conformance.result-handoff",
  "phase5-56.locus.review-artifact-panel-conformance.result-handoff",
  "phase5-56.locus.capability-metadata-panel-conformance.result-handoff",
  "phase5-56.locus.blocked-runtime-command-indicator-conformance.result-handoff",
  "phase5-56.locus.future-secure-drop-compose-inbox-placeholder-conformance.result-handoff",
  "phase5-56.locus.accessibility-wcag-display-expectation.result-handoff",
  "phase5-56.multiverse.world-project-status-card-conformance.result-handoff",
  "phase5-56.multiverse.visible-ai-capability-badge-conformance.result-handoff",
  "phase5-56.multiverse.task-capability-wrapper-status-card-conformance.result-handoff",
  "phase5-56.multiverse.citizen-adapter-candidate-badge-conformance.result-handoff",
  "phase5-56.multiverse.registry-websocket-mcp-task-blocked-indicator-conformance.result-handoff",
  "phase5-56.multiverse.accessibility-wcag-display-expectation.result-handoff"
]);

const expectedPhase555ResultSchemaIds = Object.freeze([
  "phase5-55.locus.status-control-panel-conformance.result-schema",
  "phase5-55.locus.review-artifact-panel-conformance.result-schema",
  "phase5-55.locus.capability-metadata-panel-conformance.result-schema",
  "phase5-55.locus.blocked-runtime-command-indicator-conformance.result-schema",
  "phase5-55.locus.future-secure-drop-compose-inbox-placeholder-conformance.result-schema",
  "phase5-55.locus.accessibility-wcag-display-expectation.result-schema",
  "phase5-55.multiverse.world-project-status-card-conformance.result-schema",
  "phase5-55.multiverse.visible-ai-capability-badge-conformance.result-schema",
  "phase5-55.multiverse.task-capability-wrapper-status-card-conformance.result-schema",
  "phase5-55.multiverse.citizen-adapter-candidate-badge-conformance.result-schema",
  "phase5-55.multiverse.registry-websocket-mcp-task-blocked-indicator-conformance.result-schema",
  "phase5-55.multiverse.accessibility-wcag-display-expectation.result-schema"
]);

const commandProbes = Object.freeze([
  "consumer-owned-display-conformance-result-handoff",
  "create-consumer-owned-display-conformance-result-handoff",
  "phase-5-56-display-conformance-result-handoff",
  "consumer-display-conformance-result-producer",
  "consumer-display-conformance-result-collector",
  "consumer-display-conformance-result-importer",
  "consumer-display-conformance-result-exporter",
  "display-fixture-test-harness",
  "consumer-display-fixture-import",
  "display-fixture-export",
  "locus-display-conformance-result-handoff",
  "multiverse-display-conformance-result-handoff",
  "fixture-discovery-runtime",
  "consumer-side-ci-test-runner",
  "browser-wcag-automation"
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
  "resultProducerImplementedByArdyn",
  "resultCollectorImplementedByArdyn",
  "resultImporterImplementedByArdyn",
  "resultExporterImplementedByArdyn",
  "testHarnessImplementedByArdyn",
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
  "browserWcagAutomationImplemented",
  "visualRegressionHarnessImplemented",
  "screenReaderAutomationImplemented",
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

function resultHandoffEntryPatch(patch) {
  const [entry] = createConsumerOwnedDisplayConformanceResultHandoffForReview({
    reviewedAt
  }).resultHandoffEntries;

  return [{ ...structuredClone(entry), ...patch }];
}

test("Phase 5.56 result handoff fixture is deterministic", async () => {
  const fixture = await readFixture();
  const generated = createConsumerOwnedDisplayConformanceResultHandoffForReview({
    reviewedAt
  });

  assert.equal(
    fixture.schema,
    CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_HANDOFF_SCHEMA
  );
  assert.deepEqual(fixture, generated);
  assert.equal(
    fixture.classification,
    expectedCaseClassifications[
      "valid-consumer-owned-display-conformance-result-handoff"
    ]
  );
  assert.equal(
    fixture.consumerOwnedDisplayConformanceResultHandoffProduced,
    true
  );
  assert.equal(fixture.resultHandoffSummary.resultHandoffEntryCount, 12);
  assert.equal(fixture.resultHandoffSummary.locusResultHandoffEntryCount, 6);
  assert.equal(
    fixture.resultHandoffSummary.multiverseResultHandoffEntryCount,
    6
  );
  assert.deepEqual(
    fixture.resultHandoffSummary.deterministicHandoffIds,
    expectedHandoffIds
  );
  assert.deepEqual(
    fixture.resultHandoffSummary.referencedPhase555ResultSchemaIds,
    expectedPhase555ResultSchemaIds
  );
});

test("Phase 5.56 result handoff references Phase 5.50 through 5.55 artifacts", async () => {
  const fixture = await readFixture();
  const resultSchema =
    createConsumerOwnedDisplayConformanceRunnerResultSchemaBoundaryForReview({
      reviewedAt
    });
  const resultSchemaById = new Map(
    resultSchema.resultSchemaEntries.map((entry) => [entry.resultSchemaId, entry])
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
  assert.equal(
    fixture.phase553RunnerRequirementsReference.sourceRunnerRequirementsSchema,
    "ardyn.phase-5.53.consumer-owned-display-conformance-runner-requirements-result"
  );
  assert.equal(
    fixture.phase554TestPlanReference.sourceTestPlanSchema,
    "ardyn.phase-5.54.consumer-owned-display-conformance-runner-test-plan-result"
  );
  assert.equal(
    fixture.phase555ResultSchemaBoundaryReference.sourceResultSchemaBoundarySchema,
    "ardyn.phase-5.55.consumer-owned-display-conformance-runner-result-schema-boundary-result"
  );

  for (const entry of fixture.resultHandoffEntries) {
    const resultSchemaEntry = resultSchemaById.get(
      entry.referencedPhase555ResultSchemaId
    );
    const example = examplesByFixtureId.get(entry.referencedPhase551FixtureId);

    assert.ok(resultSchemaEntry, entry.handoffId);
    assert.ok(example, entry.handoffId);
    assert.equal(
      entry.referencedPhase550SchemaBoundaryId,
      resultSchemaEntry.referencedPhase550SchemaBoundaryId
    );
    assert.equal(
      entry.referencedPhase551FixtureId,
      resultSchemaEntry.referencedPhase551FixtureId
    );
    assert.equal(
      entry.referencedPhase551FixtureGroup,
      resultSchemaEntry.referencedPhase551FixtureGroup
    );
    assert.equal(
      entry.referencedPhase552ConformanceHandoffId,
      resultSchemaEntry.referencedPhase552HandoffId
    );
    assert.equal(
      entry.referencedPhase553RunnerRequirementId,
      resultSchemaEntry.referencedPhase553RunnerRequirementId
    );
    assert.equal(
      entry.referencedPhase554TestPlanId,
      resultSchemaEntry.referencedPhase554TestPlanId
    );
    assert.equal(entry.consumerName, resultSchemaEntry.consumerName);
    assert.equal(entry.displaySurfaceId, resultSchemaEntry.displaySurfaceId);
    assert.equal(
      entry.sourceArdynArtifactType,
      resultSchemaEntry.sourceArdynArtifactType
    );

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

test("Phase 5.56 invalid result-handoff cases fail closed without authorization", () => {
  const missingHandoffId = resultHandoffEntryPatch({});
  delete missingHandoffId[0].handoffId;

  const cases = [
    [
      "malformed-consumer-owned-display-conformance-result-handoff-input-rejected",
      createConsumerOwnedDisplayConformanceResultHandoffForReview(null)
    ],
    [
      "malformed-consumer-owned-display-conformance-result-handoff-input-rejected",
      createConsumerOwnedDisplayConformanceResultHandoffForReview({
        reviewedAt: "2026-06-20"
      })
    ],
    [
      "malformed-consumer-owned-display-conformance-result-handoff-input-rejected",
      createConsumerOwnedDisplayConformanceResultHandoffForReview({
        reviewedAt,
        resultHandoffEntries: {}
      })
    ],
    [
      "missing-required-consumer-owned-display-conformance-result-handoff-entry-rejected",
      createConsumerOwnedDisplayConformanceResultHandoffForReview({
        reviewedAt,
        resultHandoffEntries: missingHandoffId
      })
    ],
    [
      "unknown-consumer-name-consumer-owned-display-conformance-result-handoff-input-rejected",
      createConsumerOwnedDisplayConformanceResultHandoffForReview({
        reviewedAt,
        resultHandoffEntries: resultHandoffEntryPatch({
          consumerName: "content-fabric"
        })
      })
    ],
    [
      "unknown-result-handoff-intent-consumer-owned-display-conformance-result-handoff-input-rejected",
      createConsumerOwnedDisplayConformanceResultHandoffForReview({
        reviewedAt,
        resultHandoffEntries: resultHandoffEntryPatch({
          resultHandoffIntent: "metadata_plus_result_importer"
        })
      })
    ],
    [
      "interactive-actionable-intent-consumer-owned-display-conformance-result-handoff-input-rejected",
      createConsumerOwnedDisplayConformanceResultHandoffForReview({
        reviewedAt,
        resultHandoffEntries: resultHandoffEntryPatch({
          resultHandoffIntent: "result_collector"
        })
      })
    ],
    [
      "authorization-flags-enabled-consumer-owned-display-conformance-result-handoff-input-rejected",
      createConsumerOwnedDisplayConformanceResultHandoffForReview({
        reviewedAt,
        resultHandoffEntries: resultHandoffEntryPatch({
          explicitBlockedAuthorizationFlags: { runtimeAuthorized: true }
        })
      })
    ],
    [
      "unsafe-runner-result-producer-result-collector-import-export-test-harness-runtime-flags-consumer-owned-display-conformance-result-handoff-input-rejected",
      createConsumerOwnedDisplayConformanceResultHandoffForReview({
        reviewedAt,
        resultHandoffEntries: resultHandoffEntryPatch({
          unsafeRunnerResultProducerResultCollectorImportExportTestHarnessRuntimeFlags:
            {
              resultImporterEnabled: true
            }
        })
      })
    ],
    [
      "nested-unsafe-flags-consumer-owned-display-conformance-result-handoff-input-rejected",
      createConsumerOwnedDisplayConformanceResultHandoffForReview({
        reviewedAt,
        resultHandoffEntries: resultHandoffEntryPatch({
          nested: { resultCollector: { approvalGrantProduced: true } }
        })
      })
    ],
    [
      "hidden-runner-result-producer-result-collector-import-export-test-harness-runtime-semantics-consumer-owned-display-conformance-result-handoff-input-rejected",
      createConsumerOwnedDisplayConformanceResultHandoffForReview({
        reviewedAt,
        resultHandoffEntries: resultHandoffEntryPatch({
          resultCollectorSemantics: {
            hiddenResultCollectorSemanticsEnabled: true
          }
        })
      })
    ],
    [
      "hidden-runner-result-producer-result-collector-import-export-test-harness-runtime-semantics-consumer-owned-display-conformance-result-handoff-input-rejected",
      createConsumerOwnedDisplayConformanceResultHandoffForReview({
        reviewedAt,
        hiddenResultHandoffSemanticsEnabled: true
      })
    ],
    [
      "hidden-runner-result-producer-result-collector-import-export-test-harness-runtime-semantics-consumer-owned-display-conformance-result-handoff-input-rejected",
      createConsumerOwnedDisplayConformanceResultHandoffForReview({
        reviewedAt,
        resultImporterSemantics: { hiddenRuntimeSemanticsEnabled: true }
      })
    ],
    [
      "secure-drop-implementation-semantics-consumer-owned-display-conformance-result-handoff-input-rejected",
      createConsumerOwnedDisplayConformanceResultHandoffForReview({
        reviewedAt,
        resultHandoffEntries: resultHandoffEntryPatch({
          secureDrop: { secureDropCryptoImplemented: true }
        })
      })
    ],
    [
      "websocket-http-fabric-mcp-task-execution-semantics-consumer-owned-display-conformance-result-handoff-input-rejected",
      createConsumerOwnedDisplayConformanceResultHandoffForReview({
        reviewedAt,
        resultHandoffEntries: resultHandoffEntryPatch({
          runtimeSurfaces: { mcpToolExposureEnabled: true }
        })
      })
    ],
    [
      "runner-result-producer-result-collector-import-export-test-harness-implementation-semantics-consumer-owned-display-conformance-result-handoff-input-rejected",
      createConsumerOwnedDisplayConformanceResultHandoffForReview({
        reviewedAt,
        resultHandoffEntries: resultHandoffEntryPatch({
          resultExporterImplementedByArdyn: true
        })
      })
    ],
    [
      "unknown-reference-consumer-owned-display-conformance-result-handoff-input-rejected",
      createConsumerOwnedDisplayConformanceResultHandoffForReview({
        reviewedAt,
        resultHandoffEntries: resultHandoffEntryPatch({
          referencedPhase555ResultSchemaId:
            "phase5-55.unknown.consumer-display-conformance.result-schema"
        })
      })
    ],
    [
      "noncanonical-consumer-owned-display-conformance-result-handoff-input-rejected",
      createConsumerOwnedDisplayConformanceResultHandoffForReview({
        reviewedAt,
        resultHandoffEntries: []
      })
    ],
    [
      "noncanonical-consumer-owned-display-conformance-result-handoff-input-rejected",
      createConsumerOwnedDisplayConformanceResultHandoffForReview({
        reviewedAt,
        resultHandoffEntries: resultHandoffEntryPatch({
          handoffId: "phase5-56.locus.noncanonical.result-handoff"
        })
      })
    ],
    [
      "noncanonical-consumer-owned-display-conformance-result-handoff-input-rejected",
      createConsumerOwnedDisplayConformanceResultHandoffForReview({
        reviewedAt,
        resultHandoffEntries: resultHandoffEntryPatch({
          forbiddenCurrentArdynBehavior: [
            ...resultHandoffEntryPatch({})[0].forbiddenCurrentArdynBehavior
          ].reverse()
        })
      })
    ],
    [
      "valid-consumer-owned-display-conformance-result-handoff",
      createConsumerOwnedDisplayConformanceResultHandoffForReview({
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

test("Phase 5.56 covers consumers, ordering, accessibility, and handoff fields", async () => {
  const fixture = await readFixture();
  const entries = new Map(
    fixture.resultHandoffEntries.map((entry) => [entry.handoffId, entry])
  );

  assert.deepEqual(
    fixture.resultHandoffEntries.map((entry) => entry.handoffId),
    expectedHandoffIds
  );
  assert.deepEqual(fixture.resultHandoffSummary.consumerNames, [
    "Locus",
    "Multiverse"
  ]);
  assert.equal(
    entries.get("phase5-56.locus.accessibility-wcag-display-expectation.result-handoff")
      .consumerName,
    "Locus"
  );
  assert.equal(
    entries.get(
      "phase5-56.multiverse.registry-websocket-mcp-task-blocked-indicator-conformance.result-handoff"
    ).consumerName,
    "Multiverse"
  );

  for (const entry of fixture.resultHandoffEntries) {
    assert.ok(["Locus", "Multiverse"].includes(entry.consumerName));
    assert.match(entry.handoffId, /^phase5-56\./);
    assert.match(entry.referencedPhase550SchemaBoundaryId, /^phase5-50\./);
    assert.match(entry.referencedPhase551FixtureId, /^phase5-51\./);
    assert.match(entry.referencedPhase552ConformanceHandoffId, /^phase5-52\./);
    assert.match(entry.referencedPhase553RunnerRequirementId, /^phase5-53\./);
    assert.match(entry.referencedPhase554TestPlanId, /^phase5-54\./);
    assert.match(entry.referencedPhase555ResultSchemaId, /^phase5-55\./);
    assert.equal(entry.resultHandoffIntent, "metadata_only");
    assert.equal(entry.consumerTargetOnly, true);
    assert.equal(entry.runnerImplementedByArdyn, false);
    assert.equal(entry.resultProducerImplementedByArdyn, false);
    assert.equal(entry.resultCollectorImplementedByArdyn, false);
    assert.equal(entry.resultImporterImplementedByArdyn, false);
    assert.equal(entry.resultExporterImplementedByArdyn, false);
    assert.equal(entry.testHarnessImplementedByArdyn, false);
    assert.equal(entry.importExportCommandImplemented, false);
    assert.equal(entry.browserRenderingHarnessImplemented, false);
    assert.equal(entry.packageExportImplemented, false);
    assert.equal(entry.consumerSideCiImplemented, false);
    assert.equal(entry.fixtureDiscoveryRuntimeImplemented, false);
    assert.equal(entry.consumerRepoModifiedByArdyn, false);
    assert.equal(entry.nonAuthorizingProof, true);
    assert.ok(
      entry.allowedFutureResultHandoffBehavior.includes("Future consumer-owned tooling")
    );
    assert.ok(
      entry.forbiddenCurrentArdynBehavior.includes("produce conformance results")
    );
    assert.ok(
      entry.forbiddenCurrentArdynBehavior.includes("import conformance results")
    );
    assert.equal(
      entry.deterministicOrderingHashExpectations.deterministicHandoffIdsRequired,
      true
    );
    assert.equal(
      entry.deterministicOrderingHashExpectations.hashDoesNotAuthorizeRuntime,
      true
    );
    assert.equal(
      entry.accessibilityWcagResultHandoffNotes.colorIndependentStatusIndicatorRequired,
      true
    );
    assert.equal(
      entry.accessibilityWcagResultHandoffNotes
        .resultHandoffMustNotExposeHiddenActionSemantics,
      true
    );
    assertAllFalse(entry.explicitBlockedAuthorizationFlags);
    assertAllFalse(
      entry
        .unsafeRunnerResultProducerResultCollectorImportExportTestHarnessRuntimeFlags
    );
    assertAllFalse(entry.runtimeEffect);
  }
});

test("Phase 5.56 result handoff stays non-authorizing and runtime-blocked", async () => {
  const fixture = await readFixture();
  const summary = fixture.resultHandoffSummary;

  assert.equal(summary.referencesPhase550SchemaBoundary, true);
  assert.equal(summary.referencesPhase551ExamplePack, true);
  assert.equal(summary.referencesPhase552ConformanceHandoff, true);
  assert.equal(summary.referencesPhase553RunnerRequirements, true);
  assert.equal(summary.referencesPhase554TestPlan, true);
  assert.equal(summary.referencesPhase555ResultSchemaBoundary, true);
  assert.equal(summary.locusAndMultiverseConsumerTargetsOnly, true);
  assert.equal(summary.runnerImplementedByArdyn, false);
  assert.equal(summary.resultProducerImplementedByArdyn, false);
  assert.equal(summary.resultCollectorImplementedByArdyn, false);
  assert.equal(summary.resultImporterImplementedByArdyn, false);
  assert.equal(summary.resultExporterImplementedByArdyn, false);
  assert.equal(summary.testHarnessImplementedByArdyn, false);
  assert.equal(summary.importExportCommandImplemented, false);
  assert.equal(summary.packageExportImplemented, false);
  assert.equal(summary.consumerSideCiImplemented, false);
  assert.equal(summary.validationImplementsResultProducer, false);
  assert.equal(summary.validationImplementsResultCollector, false);
  assert.equal(summary.validationImplementsResultImporter, false);
  assert.equal(summary.validationImplementsResultExporter, false);
  assert.equal(summary.runtimeExecutionEnabled, false);
  assert.equal(summary.commandRuntimeControlEnabled, false);
  assert.equal(summary.databaseStorageRuntimeWritesEnabled, false);
  assert.equal(summary.secretsRuntimeIngestionEnabled, false);
  assert.equal(summary.connectorGrantProduced, false);
  assert.equal(summary.fabricRuntimeSurfaceEnabled, false);
  assert.equal(summary.webSocketHttpSurfaceEnabled, false);
  assert.equal(summary.mcpToolExposureEnabled, false);
  assert.equal(summary.taskExecutionEnabled, false);
  assert.equal(summary.secureDropImplemented, false);
  assert.equal(summary.serviceDiscoveryEnabled, false);
  assert.equal(summary.scheduleEnforcementEnabled, false);
  assert.equal(summary.filesystemScanningEnabled, false);
  assert.equal(summary.processControlEnabled, false);
  assert.equal(
    fixture.invalidResultHandoffCasePolicy.referencesPhase555ResultSchemaBoundaryRequired,
    true
  );
  assert.equal(fixture.invalidResultHandoffCasePolicy.validationImplementsRunner, false);
  assert.equal(
    fixture.invalidResultHandoffCasePolicy.validationImplementsResultImporter,
    false
  );
  assert.equal(
    fixture.invalidResultHandoffCasePolicy.validationImplementsResultExporter,
    false
  );
  assert.equal(fixture.invalidResultHandoffCasePolicy.validationPerformsRendering, false);
  assert.equal(
    fixture.invalidResultHandoffCasePolicy.validationRunsBrowserWcagAutomation,
    false
  );
  assertNonAuthorizing(fixture);
  assertNonAuthorizing(fixture.consumerOwnedDisplayConformanceResultHandoff);
  assert.deepEqual(fixture.rejectionReasons, [
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
  ]);
  assert.ok(
    fixture.topDisplayConformanceResultHandoffGaps.some((gap) =>
      gap.includes("no Locus or Multiverse consumer-owned result producer")
    )
  );
  assert.equal(
    fixture.recommendedNextPhase,
    "phase-5.57-consumer-owned-display-conformance-result-review-intake-boundary"
  );
});

test("serve-runtime remains default-blocked and dry-run cannot bypass Phase 5.56", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-56-runtime-"));

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

test("Phase 5.56 runner/result/import/export command names remain rejected", async () => {
  for (const command of commandProbes) {
    const failure = await expectCliFailure([command]);

    assert.notEqual(failure.code, 0);
    assert.equal(failure.stdout, "");
    assert.match(failure.stderr, /unknown command|Usage: ardyn/i);
  }
});

test("Phase 5.56 does not change CLI, Rust, Fabric, package, or consumer source", async () => {
  await execFileAsync(
    "git",
    [
      "diff",
      "--exit-code",
      phase556BaselineCommit,
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

  assert.doesNotMatch(
    currentCliSource,
    /consumer-owned-display-conformance-result-handoff/
  );
  assert.doesNotMatch(currentCliSource, /consumer-display-conformance-result-producer/);
  assert.doesNotMatch(currentCliSource, /consumer-display-conformance-result-collector/);
  assert.doesNotMatch(currentCliSource, /consumer-display-conformance-result-importer/);
  assert.doesNotMatch(currentCliSource, /consumer-display-conformance-result-exporter/);
  assert.doesNotMatch(currentCliSource, /display-fixture-test-harness/);
  assert.doesNotMatch(currentCliSource, /fixture-discovery-runtime/);
  assert.doesNotMatch(currentCliSource, /consumer-side-ci-test-runner/);
  assert.doesNotMatch(currentCliSource, /browser-wcag-automation/);
  assert.doesNotMatch(currentCliSource, /phase-5-56/);
});
