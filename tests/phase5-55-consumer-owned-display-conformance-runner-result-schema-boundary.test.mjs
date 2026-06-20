import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";
import {
  CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_RESULT_SCHEMA_BOUNDARY_SCHEMA,
  createConsumerDisplayFixtureExamplePackForReview,
  createConsumerDisplayFixtureSchemaBoundaryForReview,
  createConsumerOwnedDisplayConformanceRunnerResultSchemaBoundaryForReview,
  createConsumerOwnedDisplayConformanceRunnerTestPlanForReview
} from "../packages/core/src/index.mjs";

const execFileAsync = promisify(execFile);
const phase555BaselineCommit = "358a90ae2b1cf245912b89e42c18295e6812ba7b";
const reviewedAt = "2026-06-20T00:00:00.000Z";
const repoRootUrl = new URL("../", import.meta.url);
const repoRoot = fileURLToPath(repoRootUrl);
const cliPath = fileURLToPath(new URL("../apps/cli/src/index.mjs", import.meta.url));
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-55/consumer-owned-display-conformance-runner-result-schema-boundary.json",
  import.meta.url
);

const expectedCaseClassifications = Object.freeze({
  "malformed-consumer-owned-display-conformance-runner-result-schema-boundary-input-rejected":
    "malformed_consumer_owned_display_conformance_runner_result_schema_boundary_input_rejected",
  "missing-required-consumer-owned-display-conformance-runner-result-schema-boundary-entry-rejected":
    "missing_required_consumer_owned_display_conformance_runner_result_schema_boundary_entry_rejected",
  "unknown-consumer-name-consumer-owned-display-conformance-runner-result-schema-boundary-input-rejected":
    "unknown_consumer_name_consumer_owned_display_conformance_runner_result_schema_boundary_input_rejected",
  "unknown-result-schema-intent-consumer-owned-display-conformance-runner-result-schema-boundary-input-rejected":
    "unknown_result_schema_intent_consumer_owned_display_conformance_runner_result_schema_boundary_input_rejected",
  "interactive-actionable-intent-consumer-owned-display-conformance-runner-result-schema-boundary-input-rejected":
    "interactive_actionable_intent_consumer_owned_display_conformance_runner_result_schema_boundary_input_rejected",
  "authorization-flags-enabled-consumer-owned-display-conformance-runner-result-schema-boundary-input-rejected":
    "authorization_flags_enabled_consumer_owned_display_conformance_runner_result_schema_boundary_input_rejected",
  "unsafe-runner-result-producer-import-export-test-harness-runtime-flags-consumer-owned-display-conformance-runner-result-schema-boundary-input-rejected":
    "unsafe_runner_result_producer_import_export_test_harness_runtime_flags_consumer_owned_display_conformance_runner_result_schema_boundary_input_rejected",
  "nested-unsafe-flags-consumer-owned-display-conformance-runner-result-schema-boundary-input-rejected":
    "nested_unsafe_flags_consumer_owned_display_conformance_runner_result_schema_boundary_input_rejected",
  "hidden-runner-result-producer-import-export-test-harness-runtime-semantics-consumer-owned-display-conformance-runner-result-schema-boundary-input-rejected":
    "hidden_runner_result_producer_import_export_test_harness_runtime_semantics_consumer_owned_display_conformance_runner_result_schema_boundary_input_rejected",
  "secure-drop-implementation-semantics-consumer-owned-display-conformance-runner-result-schema-boundary-input-rejected":
    "secure_drop_implementation_semantics_consumer_owned_display_conformance_runner_result_schema_boundary_input_rejected",
  "websocket-http-fabric-mcp-task-execution-semantics-consumer-owned-display-conformance-runner-result-schema-boundary-input-rejected":
    "websocket_http_fabric_mcp_task_execution_semantics_consumer_owned_display_conformance_runner_result_schema_boundary_input_rejected",
  "unknown-reference-consumer-owned-display-conformance-runner-result-schema-boundary-input-rejected":
    "unknown_reference_consumer_owned_display_conformance_runner_result_schema_boundary_input_rejected",
  "noncanonical-consumer-owned-display-conformance-runner-result-schema-boundary-input-rejected":
    "noncanonical_consumer_owned_display_conformance_runner_result_schema_boundary_input_rejected",
  "runner-result-producer-import-export-test-harness-implementation-semantics-consumer-owned-display-conformance-runner-result-schema-boundary-input-rejected":
    "runner_result_producer_import_export_test_harness_implementation_semantics_consumer_owned_display_conformance_runner_result_schema_boundary_input_rejected",
  "valid-consumer-owned-display-conformance-runner-result-schema-boundary":
    "valid_consumer_owned_display_conformance_runner_result_schema_boundary_runtime_still_blocked"
});

const expectedResultSchemaIds = Object.freeze([
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

const expectedPhase554TestPlanIds = Object.freeze([
  "phase5-54.locus.status-control-panel-fixture-conformance.test-plan",
  "phase5-54.locus.review-artifact-panel-fixture-conformance.test-plan",
  "phase5-54.locus.capability-metadata-panel-fixture-conformance.test-plan",
  "phase5-54.locus.blocked-runtime-command-indicator-conformance.test-plan",
  "phase5-54.locus.future-secure-drop-compose-inbox-placeholder-indicator-conformance.test-plan",
  "phase5-54.locus.accessibility-wcag-display-expectations.test-plan",
  "phase5-54.multiverse.world-project-status-card-conformance.test-plan",
  "phase5-54.multiverse.visible-ai-capability-badge-conformance.test-plan",
  "phase5-54.multiverse.task-capability-wrapper-status-card-conformance.test-plan",
  "phase5-54.multiverse.citizen-adapter-candidate-badge-conformance.test-plan",
  "phase5-54.multiverse.registry-websocket-mcp-task-blocked-indicator-conformance.test-plan",
  "phase5-54.multiverse.accessibility-wcag-display-expectations.test-plan"
]);

const commandProbes = Object.freeze([
  "consumer-owned-display-conformance-runner-result-schema-boundary",
  "create-consumer-owned-display-conformance-runner-result-schema-boundary",
  "phase-5-55-display-conformance-runner-result-schema-boundary",
  "consumer-display-conformance-result-producer",
  "consumer-display-conformance-result-collector",
  "display-fixture-test-harness",
  "consumer-display-fixture-import",
  "display-fixture-export",
  "locus-display-conformance-result-producer",
  "multiverse-display-conformance-result-producer",
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

function resultSchemaEntryPatch(patch) {
  const [entry] =
    createConsumerOwnedDisplayConformanceRunnerResultSchemaBoundaryForReview({
      reviewedAt
    }).resultSchemaEntries;

  return [{ ...structuredClone(entry), ...patch }];
}

test("Phase 5.55 result schema boundary fixture is deterministic", async () => {
  const fixture = await readFixture();
  const generated =
    createConsumerOwnedDisplayConformanceRunnerResultSchemaBoundaryForReview({
      reviewedAt
    });

  assert.equal(
    fixture.schema,
    CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_RESULT_SCHEMA_BOUNDARY_SCHEMA
  );
  assert.deepEqual(fixture, generated);
  assert.equal(
    fixture.classification,
    expectedCaseClassifications[
      "valid-consumer-owned-display-conformance-runner-result-schema-boundary"
    ]
  );
  assert.equal(
    fixture.consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryProduced,
    true
  );
  assert.equal(fixture.resultSchemaBoundarySummary.resultSchemaEntryCount, 12);
  assert.equal(fixture.resultSchemaBoundarySummary.locusResultSchemaEntryCount, 6);
  assert.equal(
    fixture.resultSchemaBoundarySummary.multiverseResultSchemaEntryCount,
    6
  );
  assert.deepEqual(
    fixture.resultSchemaBoundarySummary.deterministicResultSchemaIds,
    expectedResultSchemaIds
  );
  assert.deepEqual(
    fixture.resultSchemaBoundarySummary.referencedPhase554TestPlanIds,
    expectedPhase554TestPlanIds
  );
});

test("Phase 5.55 result schema boundary references Phase 5.50 through 5.54 artifacts", async () => {
  const fixture = await readFixture();
  const testPlan = createConsumerOwnedDisplayConformanceRunnerTestPlanForReview({
    reviewedAt
  });
  const testPlanById = new Map(
    testPlan.testPlanEntries.map((entry) => [entry.testPlanId, entry])
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
    fixture.phase554SubagentAuditTrailReconciliation.finalReportActualReviewer,
    "019ee530-5f95-7ac1-b80d-2967f33f462e / Raman"
  );
  assert.equal(
    fixture.phase554SubagentAuditTrailReconciliation.localSessionFooterMismatchReported,
    "Feynman / James"
  );

  for (const entry of fixture.resultSchemaEntries) {
    const planEntry = testPlanById.get(entry.referencedPhase554TestPlanId);
    const example = examplesByFixtureId.get(entry.referencedPhase551FixtureId);

    assert.ok(planEntry, entry.resultSchemaId);
    assert.ok(example, entry.resultSchemaId);
    assert.equal(
      entry.referencedPhase550SchemaBoundaryId,
      planEntry.referencedPhase550SchemaBoundaryId
    );
    assert.equal(
      entry.referencedPhase551FixtureId,
      planEntry.referencedPhase551FixtureId
    );
    assert.equal(
      entry.referencedPhase551FixtureGroup,
      planEntry.referencedPhase551FixtureGroup
    );
    assert.equal(
      entry.referencedPhase552HandoffId,
      planEntry.referencedPhase552HandoffId
    );
    assert.equal(
      entry.referencedPhase553RunnerRequirementId,
      planEntry.referencedPhase553RunnerRequirementId
    );
    assert.equal(entry.consumerName, planEntry.consumerName);
    assert.equal(entry.displaySurfaceId, planEntry.displaySurfaceId);
    assert.equal(entry.sourceArdynArtifactType, planEntry.sourceArdynArtifactType);

    const boundaryResult = createConsumerDisplayFixtureSchemaBoundaryForReview({
      reviewedAt,
      fixtureEntries: [example]
    });

    assert.equal(
      boundaryResult.classification,
      "valid_consumer_display_fixture_schema_boundary_runtime_still_blocked",
      entry.resultSchemaId
    );
  }
});

test("Phase 5.55 invalid result-schema cases fail closed without authorization", () => {
  const missingResultSchemaId = resultSchemaEntryPatch({});
  delete missingResultSchemaId[0].resultSchemaId;

  const cases = [
    [
      "malformed-consumer-owned-display-conformance-runner-result-schema-boundary-input-rejected",
      createConsumerOwnedDisplayConformanceRunnerResultSchemaBoundaryForReview(null)
    ],
    [
      "malformed-consumer-owned-display-conformance-runner-result-schema-boundary-input-rejected",
      createConsumerOwnedDisplayConformanceRunnerResultSchemaBoundaryForReview({
        reviewedAt: "2026-06-20"
      })
    ],
    [
      "malformed-consumer-owned-display-conformance-runner-result-schema-boundary-input-rejected",
      createConsumerOwnedDisplayConformanceRunnerResultSchemaBoundaryForReview({
        reviewedAt,
        resultSchemaEntries: {}
      })
    ],
    [
      "missing-required-consumer-owned-display-conformance-runner-result-schema-boundary-entry-rejected",
      createConsumerOwnedDisplayConformanceRunnerResultSchemaBoundaryForReview({
        reviewedAt,
        resultSchemaEntries: missingResultSchemaId
      })
    ],
    [
      "unknown-consumer-name-consumer-owned-display-conformance-runner-result-schema-boundary-input-rejected",
      createConsumerOwnedDisplayConformanceRunnerResultSchemaBoundaryForReview({
        reviewedAt,
        resultSchemaEntries: resultSchemaEntryPatch({ consumerName: "content-fabric" })
      })
    ],
    [
      "unknown-result-schema-intent-consumer-owned-display-conformance-runner-result-schema-boundary-input-rejected",
      createConsumerOwnedDisplayConformanceRunnerResultSchemaBoundaryForReview({
        reviewedAt,
        resultSchemaEntries: resultSchemaEntryPatch({
          resultSchemaIntent: "metadata_plus_result_producer"
        })
      })
    ],
    [
      "interactive-actionable-intent-consumer-owned-display-conformance-runner-result-schema-boundary-input-rejected",
      createConsumerOwnedDisplayConformanceRunnerResultSchemaBoundaryForReview({
        reviewedAt,
        resultSchemaEntries: resultSchemaEntryPatch({
          resultSchemaIntent: "result_producer"
        })
      })
    ],
    [
      "authorization-flags-enabled-consumer-owned-display-conformance-runner-result-schema-boundary-input-rejected",
      createConsumerOwnedDisplayConformanceRunnerResultSchemaBoundaryForReview({
        reviewedAt,
        resultSchemaEntries: resultSchemaEntryPatch({
          explicitBlockedAuthorizationFlags: { runtimeAuthorized: true }
        })
      })
    ],
    [
      "unsafe-runner-result-producer-import-export-test-harness-runtime-flags-consumer-owned-display-conformance-runner-result-schema-boundary-input-rejected",
      createConsumerOwnedDisplayConformanceRunnerResultSchemaBoundaryForReview({
        reviewedAt,
        resultSchemaEntries: resultSchemaEntryPatch({
          unsafeRunnerResultProducerImportExportTestHarnessRuntimeFlags: {
            resultProducerEnabled: true
          }
        })
      })
    ],
    [
      "nested-unsafe-flags-consumer-owned-display-conformance-runner-result-schema-boundary-input-rejected",
      createConsumerOwnedDisplayConformanceRunnerResultSchemaBoundaryForReview({
        reviewedAt,
        resultSchemaEntries: resultSchemaEntryPatch({
          nested: { resultProducer: { approvalGrantProduced: true } }
        })
      })
    ],
    [
      "hidden-runner-result-producer-import-export-test-harness-runtime-semantics-consumer-owned-display-conformance-runner-result-schema-boundary-input-rejected",
      createConsumerOwnedDisplayConformanceRunnerResultSchemaBoundaryForReview({
        reviewedAt,
        resultSchemaEntries: resultSchemaEntryPatch({
          resultProducerSemantics: { hiddenResultProducerSemanticsEnabled: true }
        })
      })
    ],
    [
      "hidden-runner-result-producer-import-export-test-harness-runtime-semantics-consumer-owned-display-conformance-runner-result-schema-boundary-input-rejected",
      createConsumerOwnedDisplayConformanceRunnerResultSchemaBoundaryForReview({
        reviewedAt,
        hiddenResultProducerSemanticsEnabled: true
      })
    ],
    [
      "hidden-runner-result-producer-import-export-test-harness-runtime-semantics-consumer-owned-display-conformance-runner-result-schema-boundary-input-rejected",
      createConsumerOwnedDisplayConformanceRunnerResultSchemaBoundaryForReview({
        reviewedAt,
        resultProducerSemantics: { hiddenRuntimeSemanticsEnabled: true }
      })
    ],
    [
      "secure-drop-implementation-semantics-consumer-owned-display-conformance-runner-result-schema-boundary-input-rejected",
      createConsumerOwnedDisplayConformanceRunnerResultSchemaBoundaryForReview({
        reviewedAt,
        resultSchemaEntries: resultSchemaEntryPatch({
          secureDrop: { secureDropCryptoImplemented: true }
        })
      })
    ],
    [
      "websocket-http-fabric-mcp-task-execution-semantics-consumer-owned-display-conformance-runner-result-schema-boundary-input-rejected",
      createConsumerOwnedDisplayConformanceRunnerResultSchemaBoundaryForReview({
        reviewedAt,
        resultSchemaEntries: resultSchemaEntryPatch({
          runtimeSurfaces: { mcpToolExposureEnabled: true }
        })
      })
    ],
    [
      "runner-result-producer-import-export-test-harness-implementation-semantics-consumer-owned-display-conformance-runner-result-schema-boundary-input-rejected",
      createConsumerOwnedDisplayConformanceRunnerResultSchemaBoundaryForReview({
        reviewedAt,
        resultSchemaEntries: resultSchemaEntryPatch({
          resultProducerImplementedByArdyn: true
        })
      })
    ],
    [
      "unknown-reference-consumer-owned-display-conformance-runner-result-schema-boundary-input-rejected",
      createConsumerOwnedDisplayConformanceRunnerResultSchemaBoundaryForReview({
        reviewedAt,
        resultSchemaEntries: resultSchemaEntryPatch({
          referencedPhase554TestPlanId:
            "phase5-54.unknown.consumer-display-conformance.test-plan"
        })
      })
    ],
    [
      "noncanonical-consumer-owned-display-conformance-runner-result-schema-boundary-input-rejected",
      createConsumerOwnedDisplayConformanceRunnerResultSchemaBoundaryForReview({
        reviewedAt,
        resultSchemaEntries: []
      })
    ],
    [
      "noncanonical-consumer-owned-display-conformance-runner-result-schema-boundary-input-rejected",
      createConsumerOwnedDisplayConformanceRunnerResultSchemaBoundaryForReview({
        reviewedAt,
        resultSchemaEntries: resultSchemaEntryPatch({
          resultSchemaId: "phase5-55.locus.noncanonical.result-schema"
        })
      })
    ],
    [
      "noncanonical-consumer-owned-display-conformance-runner-result-schema-boundary-input-rejected",
      createConsumerOwnedDisplayConformanceRunnerResultSchemaBoundaryForReview({
        reviewedAt,
        resultSchemaEntries: resultSchemaEntryPatch({
          allowedResultFields: [
            ...resultSchemaEntryPatch({})[0].allowedResultFields
          ].reverse()
        })
      })
    ],
    [
      "valid-consumer-owned-display-conformance-runner-result-schema-boundary",
      createConsumerOwnedDisplayConformanceRunnerResultSchemaBoundaryForReview({
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

test("Phase 5.55 covers required consumers, ordering, accessibility, and result schema fields", async () => {
  const fixture = await readFixture();
  const entries = new Map(
    fixture.resultSchemaEntries.map((entry) => [entry.resultSchemaId, entry])
  );

  assert.deepEqual(
    fixture.resultSchemaEntries.map((entry) => entry.resultSchemaId),
    expectedResultSchemaIds
  );
  assert.deepEqual(fixture.resultSchemaBoundarySummary.consumerNames, [
    "Locus",
    "Multiverse"
  ]);
  assert.equal(
    entries.get("phase5-55.locus.accessibility-wcag-display-expectation.result-schema")
      .consumerName,
    "Locus"
  );
  assert.equal(
    entries.get(
      "phase5-55.multiverse.registry-websocket-mcp-task-blocked-indicator-conformance.result-schema"
    ).consumerName,
    "Multiverse"
  );

  for (const entry of fixture.resultSchemaEntries) {
    assert.ok(["Locus", "Multiverse"].includes(entry.consumerName));
    assert.match(entry.resultSchemaId, /^phase5-55\./);
    assert.match(entry.referencedPhase550SchemaBoundaryId, /^phase5-50\./);
    assert.match(entry.referencedPhase551FixtureId, /^phase5-51\./);
    assert.match(entry.referencedPhase552HandoffId, /^phase5-52\./);
    assert.match(entry.referencedPhase553RunnerRequirementId, /^phase5-53\./);
    assert.match(entry.referencedPhase554TestPlanId, /^phase5-54\./);
    assert.equal(entry.resultSchemaIntent, "metadata_only");
    assert.equal(entry.consumerTargetOnly, true);
    assert.equal(entry.runnerImplementedByArdyn, false);
    assert.equal(entry.resultProducerImplementedByArdyn, false);
    assert.equal(entry.resultCollectorImplementedByArdyn, false);
    assert.equal(entry.testHarnessImplementedByArdyn, false);
    assert.equal(entry.importExportCommandImplemented, false);
    assert.equal(entry.browserRenderingHarnessImplemented, false);
    assert.equal(entry.packageExportImplemented, false);
    assert.equal(entry.consumerSideCiImplemented, false);
    assert.equal(entry.fixtureDiscoveryRuntimeImplemented, false);
    assert.equal(entry.consumerRepoModifiedByArdyn, false);
    assert.equal(entry.nonAuthorizingProof, true);
    assert.ok(entry.allowedResultFields.includes("conformanceStatus"));
    assert.ok(entry.allowedResultFields.includes("assertionResults"));
    assert.ok(entry.allowedResultFields.includes(`resultSchemaBoundary:${entry.resultSchemaId}`));
    assert.ok(entry.forbiddenResultFields.includes("resultProducerCommand"));
    assert.ok(entry.forbiddenResultFields.includes("resultCollectorCommand"));
    assert.ok(entry.forbiddenResultFields.includes("filesystemPath"));
    assert.equal(
      entry.deterministicOrderingHashExpectations.deterministicResultSchemaIdsRequired,
      true
    );
    assert.equal(
      entry.deterministicOrderingHashExpectations.hashDoesNotAuthorizeRuntime,
      true
    );
    assert.equal(
      entry.accessibilityWcagResultNotes.colorIndependentStatusIndicatorRequired,
      true
    );
    assert.equal(
      entry.accessibilityWcagResultNotes.reducedMotionDefaultStaticDisplayRequired,
      true
    );
    assert.equal(
      entry.accessibilityWcagResultNotes.resultMustNotExposeHiddenActionSemantics,
      true
    );
    assertAllFalse(entry.explicitBlockedAuthorizationFlags);
    assertAllFalse(
      entry.unsafeRunnerResultProducerImportExportTestHarnessRuntimeFlags
    );
    assertAllFalse(entry.runtimeEffect);
  }
});

test("Phase 5.55 result schema boundary stays non-authorizing and runtime-blocked", async () => {
  const fixture = await readFixture();
  const summary = fixture.resultSchemaBoundarySummary;

  assert.equal(summary.referencesPhase550SchemaBoundary, true);
  assert.equal(summary.referencesPhase551ExamplePack, true);
  assert.equal(summary.referencesPhase552ConformanceHandoff, true);
  assert.equal(summary.referencesPhase553RunnerRequirements, true);
  assert.equal(summary.referencesPhase554TestPlan, true);
  assert.equal(summary.locusAndMultiverseConsumerTargetsOnly, true);
  assert.equal(summary.runnerImplementedByArdyn, false);
  assert.equal(summary.resultProducerImplementedByArdyn, false);
  assert.equal(summary.resultCollectorImplementedByArdyn, false);
  assert.equal(summary.testHarnessImplementedByArdyn, false);
  assert.equal(summary.importExportCommandImplemented, false);
  assert.equal(summary.packageExportImplemented, false);
  assert.equal(summary.consumerSideCiImplemented, false);
  assert.equal(summary.validationImplementsResultProducer, false);
  assert.equal(summary.validationImplementsResultCollector, false);
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
  assert.equal(fixture.invalidResultSchemaCasePolicy.referencesPhase554TestPlanRequired, true);
  assert.equal(fixture.invalidResultSchemaCasePolicy.validationImplementsRunner, false);
  assert.equal(fixture.invalidResultSchemaCasePolicy.validationImplementsResultProducer, false);
  assert.equal(fixture.invalidResultSchemaCasePolicy.validationImplementsResultCollector, false);
  assert.equal(fixture.invalidResultSchemaCasePolicy.validationImplementsTestHarness, false);
  assert.equal(fixture.invalidResultSchemaCasePolicy.validationImplementsImportExportCommands, false);
  assert.equal(fixture.invalidResultSchemaCasePolicy.validationPerformsRendering, false);
  assert.equal(fixture.invalidResultSchemaCasePolicy.validationRunsBrowserWcagAutomation, false);
  assertNonAuthorizing(fixture);
  assertNonAuthorizing(
    fixture.consumerOwnedDisplayConformanceRunnerResultSchemaBoundary
  );
  assert.deepEqual(fixture.rejectionReasons, [
    "consumer_owned_display_conformance_runner_result_schema_boundary_is_review_only",
    "result_schema_entries_are_metadata_only",
    "references_phase_5_50_schema_boundary",
    "references_phase_5_51_example_pack",
    "references_phase_5_52_conformance_handoff",
    "references_phase_5_53_runner_requirements",
    "references_phase_5_54_test_plan",
    "ardyn_does_not_implement_runner_result_producer_result_collector_test_harness_import_export_package_export_ci_ui_browser_rendering_or_consumer_repo_changes",
    "runtime_command_db_storage_secrets_connector_fabric_websocket_http_mcp_task_secure_drop_service_discovery_schedule_filesystem_process_authorizations_false",
    "unsafe_runner_result_producer_import_export_test_harness_runtime_flags_fail_closed",
    "fallow_runtime_not_used",
    "runtime_enablement_still_blocked"
  ]);
  assert.ok(
    fixture.topDisplayConformanceRunnerResultSchemaGaps.some((gap) =>
      gap.includes("no Locus or Multiverse consumer-owned result producer")
    )
  );
  assert.equal(
    fixture.recommendedNextPhase,
    "phase-5.56-consumer-owned-display-conformance-result-handoff"
  );
});

test("serve-runtime remains default-blocked and dry-run cannot bypass Phase 5.55", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-55-runtime-"));

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

test("Phase 5.55 runner/result/import/export command names remain rejected", async () => {
  for (const command of commandProbes) {
    const failure = await expectCliFailure([command]);

    assert.notEqual(failure.code, 0);
    assert.equal(failure.stdout, "");
    assert.match(failure.stderr, /unknown command|Usage: ardyn/i);
  }
});

test("Phase 5.55 does not change CLI, Rust, Fabric, package, or consumer source", async () => {
  await execFileAsync(
    "git",
    [
      "diff",
      "--exit-code",
      phase555BaselineCommit,
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
    /consumer-owned-display-conformance-runner-result-schema-boundary/
  );
  assert.doesNotMatch(currentCliSource, /consumer-display-conformance-result-producer/);
  assert.doesNotMatch(currentCliSource, /consumer-display-conformance-result-collector/);
  assert.doesNotMatch(currentCliSource, /display-fixture-test-harness/);
  assert.doesNotMatch(currentCliSource, /fixture-discovery-runtime/);
  assert.doesNotMatch(currentCliSource, /consumer-side-ci-test-runner/);
  assert.doesNotMatch(currentCliSource, /browser-wcag-automation/);
  assert.doesNotMatch(currentCliSource, /phase-5-55/);
});
