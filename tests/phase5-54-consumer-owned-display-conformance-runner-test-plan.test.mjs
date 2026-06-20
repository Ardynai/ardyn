import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";
import {
  CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_TEST_PLAN_SCHEMA,
  createConsumerDisplayFixtureConformanceHandoffForReview,
  createConsumerDisplayFixtureExamplePackForReview,
  createConsumerDisplayFixtureSchemaBoundaryForReview,
  createConsumerOwnedDisplayConformanceRunnerRequirementsForReview,
  createConsumerOwnedDisplayConformanceRunnerTestPlanForReview
} from "../packages/core/src/index.mjs";

const execFileAsync = promisify(execFile);
const phase554BaselineCommit = "b0d9ed69641a78b02476143d5b204bfc80d63644";
const reviewedAt = "2026-06-20T00:00:00.000Z";
const repoRootUrl = new URL("../", import.meta.url);
const repoRoot = fileURLToPath(repoRootUrl);
const cliPath = fileURLToPath(new URL("../apps/cli/src/index.mjs", import.meta.url));
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-54/consumer-owned-display-conformance-runner-test-plan.json",
  import.meta.url
);

const expectedCaseClassifications = Object.freeze({
  "malformed-consumer-owned-display-conformance-runner-test-plan-input-rejected":
    "malformed_consumer_owned_display_conformance_runner_test_plan_input_rejected",
  "malformed-consumer-owned-display-conformance-runner-test-plan-invalid-reviewed-at-rejected":
    "malformed_consumer_owned_display_conformance_runner_test_plan_input_rejected",
  "malformed-consumer-owned-display-conformance-runner-test-plan-test-plan-entries-rejected":
    "malformed_consumer_owned_display_conformance_runner_test_plan_input_rejected",
  "missing-required-consumer-owned-display-conformance-runner-test-plan-entry-rejected":
    "missing_required_consumer_owned_display_conformance_runner_test_plan_entry_rejected",
  "unknown-consumer-name-consumer-owned-display-conformance-runner-test-plan-input-rejected":
    "unknown_consumer_name_consumer_owned_display_conformance_runner_test_plan_input_rejected",
  "unknown-test-plan-intent-consumer-owned-display-conformance-runner-test-plan-input-rejected":
    "unknown_test_plan_intent_consumer_owned_display_conformance_runner_test_plan_input_rejected",
  "interactive-actionable-intent-consumer-owned-display-conformance-runner-test-plan-input-rejected":
    "interactive_actionable_intent_consumer_owned_display_conformance_runner_test_plan_input_rejected",
  "authorization-flags-enabled-consumer-owned-display-conformance-runner-test-plan-input-rejected":
    "authorization_flags_enabled_consumer_owned_display_conformance_runner_test_plan_input_rejected",
  "unsafe-runner-import-export-test-harness-runtime-flags-consumer-owned-display-conformance-runner-test-plan-input-rejected":
    "unsafe_runner_import_export_test_harness_runtime_flags_consumer_owned_display_conformance_runner_test_plan_input_rejected",
  "nested-unsafe-flags-consumer-owned-display-conformance-runner-test-plan-input-rejected":
    "nested_unsafe_flags_consumer_owned_display_conformance_runner_test_plan_input_rejected",
  "hidden-runner-import-export-test-harness-runtime-semantics-consumer-owned-display-conformance-runner-test-plan-input-rejected":
    "hidden_runner_import_export_test_harness_runtime_semantics_consumer_owned_display_conformance_runner_test_plan_input_rejected",
  "secure-drop-implementation-semantics-consumer-owned-display-conformance-runner-test-plan-input-rejected":
    "secure_drop_implementation_semantics_consumer_owned_display_conformance_runner_test_plan_input_rejected",
  "websocket-http-fabric-mcp-task-execution-semantics-consumer-owned-display-conformance-runner-test-plan-input-rejected":
    "websocket_http_fabric_mcp_task_execution_semantics_consumer_owned_display_conformance_runner_test_plan_input_rejected",
  "unknown-reference-consumer-owned-display-conformance-runner-test-plan-input-rejected":
    "unknown_reference_consumer_owned_display_conformance_runner_test_plan_input_rejected",
  "noncanonical-consumer-owned-display-conformance-runner-test-plan-input-rejected":
    "noncanonical_consumer_owned_display_conformance_runner_test_plan_input_rejected",
  "runner-test-harness-import-export-implementation-semantics-consumer-owned-display-conformance-runner-test-plan-input-rejected":
    "runner_test_harness_import_export_implementation_semantics_consumer_owned_display_conformance_runner_test_plan_input_rejected",
  "valid-consumer-owned-display-conformance-runner-test-plan":
    "valid_consumer_owned_display_conformance_runner_test_plan_runtime_still_blocked"
});

const expectedTestPlanIds = Object.freeze([
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

const expectedPhase553RunnerRequirementIds = Object.freeze([
  "phase5-53.locus.status-control-panel.runner-requirement",
  "phase5-53.locus.review-artifact-panel.runner-requirement",
  "phase5-53.locus.capability-metadata-panel.runner-requirement",
  "phase5-53.locus.blocked-runtime-command.runner-requirement",
  "phase5-53.locus.future-secure-drop-compose-inbox.runner-requirement",
  "phase5-53.locus.status-control-panel.runner-requirement",
  "phase5-53.multiverse.world-project-status.runner-requirement",
  "phase5-53.multiverse.visible-ai-capability.runner-requirement",
  "phase5-53.multiverse.task-capability-wrapper-status.runner-requirement",
  "phase5-53.multiverse.citizen-adapter-candidate.runner-requirement",
  "phase5-53.multiverse.registry-websocket-mcp-task-blocked.runner-requirement",
  "phase5-53.multiverse.world-project-status.runner-requirement"
]);

const expectedPhase551FixtureIds = Object.freeze([
  "phase5-51.locus.status-control-panel.metadata-card",
  "phase5-51.locus.review-artifact-panel.metadata-card",
  "phase5-51.locus.capability-metadata-panel.card",
  "phase5-51.locus.blocked-runtime-command.indicator",
  "phase5-51.locus.future-secure-drop-compose-inbox.placeholder-indicator",
  "phase5-51.locus.status-control-panel.metadata-card",
  "phase5-51.multiverse.world-project-status.card",
  "phase5-51.multiverse.visible-ai-capability.badge",
  "phase5-51.multiverse.task-capability-wrapper-status.card",
  "phase5-51.multiverse.citizen-adapter-candidate.badge",
  "phase5-51.multiverse.registry-websocket-mcp-task-blocked.indicator",
  "phase5-51.multiverse.world-project-status.card"
]);

const expectedPhase552HandoffIds = Object.freeze([
  "phase5-52.locus.status-control-panel.conformance-handoff",
  "phase5-52.locus.review-artifact-panel.conformance-handoff",
  "phase5-52.locus.capability-metadata-panel.conformance-handoff",
  "phase5-52.locus.blocked-runtime-command.conformance-handoff",
  "phase5-52.locus.future-secure-drop-compose-inbox.conformance-handoff",
  "phase5-52.locus.status-control-panel.conformance-handoff",
  "phase5-52.multiverse.world-project-status.conformance-handoff",
  "phase5-52.multiverse.visible-ai-capability.conformance-handoff",
  "phase5-52.multiverse.task-capability-wrapper-status.conformance-handoff",
  "phase5-52.multiverse.citizen-adapter-candidate.conformance-handoff",
  "phase5-52.multiverse.registry-websocket-mcp-task-blocked.conformance-handoff",
  "phase5-52.multiverse.world-project-status.conformance-handoff"
]);

const commandProbes = Object.freeze([
  "consumer-owned-display-conformance-runner-test-plan",
  "create-consumer-owned-display-conformance-runner-test-plan",
  "phase-5-54-display-conformance-runner-test-plan",
  "consumer-display-conformance-test-harness",
  "display-fixture-test-harness",
  "consumer-display-fixture-import",
  "display-fixture-export",
  "locus-display-conformance-test-runner",
  "multiverse-display-conformance-test-runner",
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

function testPlanEntryPatch(patch) {
  const [entry] = createConsumerOwnedDisplayConformanceRunnerTestPlanForReview({
    reviewedAt
  }).testPlanEntries;

  return [{ ...structuredClone(entry), ...patch }];
}

test("Phase 5.54 consumer-owned display conformance runner test plan fixture is deterministic", async () => {
  const fixture = await readFixture();
  const generated =
    createConsumerOwnedDisplayConformanceRunnerTestPlanForReview({
      reviewedAt
    });

  assert.equal(
    fixture.schema,
    CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_TEST_PLAN_SCHEMA
  );
  assert.deepEqual(fixture, generated);
  assert.equal(
    fixture.classification,
    expectedCaseClassifications[
      "valid-consumer-owned-display-conformance-runner-test-plan"
    ]
  );
  assert.equal(
    fixture.consumerOwnedDisplayConformanceRunnerTestPlanProduced,
    true
  );
  assert.equal(fixture.testPlanSummary.testPlanEntryCount, 12);
  assert.equal(fixture.testPlanSummary.locusTestPlanEntryCount, 6);
  assert.equal(fixture.testPlanSummary.multiverseTestPlanEntryCount, 6);
  assert.deepEqual(
    fixture.testPlanSummary.deterministicTestPlanIds,
    expectedTestPlanIds
  );
});

test("Phase 5.54 test plan references Phase 5.50, 5.51, 5.52, and 5.53 artifacts", async () => {
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
  const requirements =
    createConsumerOwnedDisplayConformanceRunnerRequirementsForReview({
      reviewedAt
    });
  const requirementsById = new Map(
    requirements.requirementEntries.map((entry) => [entry.requirementId, entry])
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
  assert.deepEqual(
    fixture.testPlanSummary.referencedPhase551FixtureIds,
    expectedPhase551FixtureIds
  );
  assert.deepEqual(
    fixture.testPlanSummary.referencedPhase552HandoffIds,
    expectedPhase552HandoffIds
  );
  assert.deepEqual(
    fixture.testPlanSummary.referencedPhase553RunnerRequirementIds,
    expectedPhase553RunnerRequirementIds
  );

  for (const entry of fixture.testPlanEntries) {
    const requirement = requirementsById.get(
      entry.referencedPhase553RunnerRequirementId
    );
    const handoffEntry = handoffById.get(entry.referencedPhase552HandoffId);
    const example = examplesByFixtureId.get(entry.referencedPhase551FixtureId);

    assert.ok(requirement, entry.testPlanId);
    assert.ok(handoffEntry, entry.testPlanId);
    assert.ok(example, entry.testPlanId);
    assert.equal(
      entry.referencedPhase550SchemaBoundaryId,
      requirement.referencedPhase550SchemaBoundaryId
    );
    assert.equal(
      entry.referencedPhase551FixtureId,
      requirement.referencedPhase551FixtureId
    );
    assert.equal(
      entry.referencedPhase551FixtureGroup,
      requirement.referencedPhase551FixtureGroup
    );
    assert.equal(
      entry.referencedPhase552HandoffId,
      requirement.referencedPhase552HandoffId
    );
    assert.equal(entry.consumerName, requirement.consumerName);
    assert.equal(entry.displaySurfaceId, requirement.displaySurfaceId);
    assert.equal(entry.sourceArdynArtifactType, requirement.sourceArdynArtifactType);
    assert.equal(handoffEntry.consumerName, entry.consumerName);

    const boundaryResult = createConsumerDisplayFixtureSchemaBoundaryForReview({
      reviewedAt,
      fixtureEntries: [example]
    });

    assert.equal(
      boundaryResult.classification,
      "valid_consumer_display_fixture_schema_boundary_runtime_still_blocked",
      entry.testPlanId
    );
  }
});

test("Phase 5.54 invalid test-plan cases fail closed without authorization", () => {
  const missingTestPlanId = testPlanEntryPatch({});
  delete missingTestPlanId[0].testPlanId;

  const cases = [
    [
      "malformed-consumer-owned-display-conformance-runner-test-plan-input-rejected",
      createConsumerOwnedDisplayConformanceRunnerTestPlanForReview(null)
    ],
    [
      "malformed-consumer-owned-display-conformance-runner-test-plan-invalid-reviewed-at-rejected",
      createConsumerOwnedDisplayConformanceRunnerTestPlanForReview({
        reviewedAt: "2026-06-20"
      })
    ],
    [
      "malformed-consumer-owned-display-conformance-runner-test-plan-test-plan-entries-rejected",
      createConsumerOwnedDisplayConformanceRunnerTestPlanForReview({
        reviewedAt,
        testPlanEntries: {}
      })
    ],
    [
      "missing-required-consumer-owned-display-conformance-runner-test-plan-entry-rejected",
      createConsumerOwnedDisplayConformanceRunnerTestPlanForReview({
        reviewedAt,
        testPlanEntries: missingTestPlanId
      })
    ],
    [
      "unknown-consumer-name-consumer-owned-display-conformance-runner-test-plan-input-rejected",
      createConsumerOwnedDisplayConformanceRunnerTestPlanForReview({
        reviewedAt,
        testPlanEntries: testPlanEntryPatch({ consumerName: "content-fabric" })
      })
    ],
    [
      "unknown-test-plan-intent-consumer-owned-display-conformance-runner-test-plan-input-rejected",
      createConsumerOwnedDisplayConformanceRunnerTestPlanForReview({
        reviewedAt,
        testPlanEntries: testPlanEntryPatch({
          testPlanIntent: "metadata_plus_test_harness"
        })
      })
    ],
    [
      "interactive-actionable-intent-consumer-owned-display-conformance-runner-test-plan-input-rejected",
      createConsumerOwnedDisplayConformanceRunnerTestPlanForReview({
        reviewedAt,
        testPlanEntries: testPlanEntryPatch({ testPlanIntent: "test_harness" })
      })
    ],
    [
      "authorization-flags-enabled-consumer-owned-display-conformance-runner-test-plan-input-rejected",
      createConsumerOwnedDisplayConformanceRunnerTestPlanForReview({
        reviewedAt,
        testPlanEntries: testPlanEntryPatch({
          explicitBlockedAuthorizationFlags: { runtimeAuthorized: true }
        })
      })
    ],
    [
      "unsafe-runner-import-export-test-harness-runtime-flags-consumer-owned-display-conformance-runner-test-plan-input-rejected",
      createConsumerOwnedDisplayConformanceRunnerTestPlanForReview({
        reviewedAt,
        testPlanEntries: testPlanEntryPatch({
          unsafeRunnerImportExportTestHarnessRuntimeFlags: {
            testHarnessEnabled: true
          }
        })
      })
    ],
    [
      "nested-unsafe-flags-consumer-owned-display-conformance-runner-test-plan-input-rejected",
      createConsumerOwnedDisplayConformanceRunnerTestPlanForReview({
        reviewedAt,
        testPlanEntries: testPlanEntryPatch({
          nested: { testHarness: { approvalGrantProduced: true } }
        })
      })
    ],
    [
      "hidden-runner-import-export-test-harness-runtime-semantics-consumer-owned-display-conformance-runner-test-plan-input-rejected",
      createConsumerOwnedDisplayConformanceRunnerTestPlanForReview({
        reviewedAt,
        testPlanEntries: testPlanEntryPatch({
          testHarnessSemantics: { hiddenTestHarnessSemanticsEnabled: true }
        })
      })
    ],
    [
      "hidden-runner-import-export-test-harness-runtime-semantics-consumer-owned-display-conformance-runner-test-plan-input-rejected",
      createConsumerOwnedDisplayConformanceRunnerTestPlanForReview({
        reviewedAt,
        hiddenTestHarnessSemanticsEnabled: true
      })
    ],
    [
      "hidden-runner-import-export-test-harness-runtime-semantics-consumer-owned-display-conformance-runner-test-plan-input-rejected",
      createConsumerOwnedDisplayConformanceRunnerTestPlanForReview({
        reviewedAt,
        testHarnessSemantics: { hiddenRuntimeSemanticsEnabled: true }
      })
    ],
    [
      "secure-drop-implementation-semantics-consumer-owned-display-conformance-runner-test-plan-input-rejected",
      createConsumerOwnedDisplayConformanceRunnerTestPlanForReview({
        reviewedAt,
        testPlanEntries: testPlanEntryPatch({
          secureDrop: { secureDropCryptoImplemented: true }
        })
      })
    ],
    [
      "websocket-http-fabric-mcp-task-execution-semantics-consumer-owned-display-conformance-runner-test-plan-input-rejected",
      createConsumerOwnedDisplayConformanceRunnerTestPlanForReview({
        reviewedAt,
        testPlanEntries: testPlanEntryPatch({
          runtimeSurfaces: { mcpToolExposureEnabled: true }
        })
      })
    ],
    [
      "runner-test-harness-import-export-implementation-semantics-consumer-owned-display-conformance-runner-test-plan-input-rejected",
      createConsumerOwnedDisplayConformanceRunnerTestPlanForReview({
        reviewedAt,
        testPlanEntries: testPlanEntryPatch({
          testHarnessImplementedByArdyn: true
        })
      })
    ],
    [
      "unknown-reference-consumer-owned-display-conformance-runner-test-plan-input-rejected",
      createConsumerOwnedDisplayConformanceRunnerTestPlanForReview({
        reviewedAt,
        testPlanEntries: testPlanEntryPatch({
          referencedPhase553RunnerRequirementId:
            "phase5-53.unknown.runner-requirement"
        })
      })
    ],
    [
      "noncanonical-consumer-owned-display-conformance-runner-test-plan-input-rejected",
      createConsumerOwnedDisplayConformanceRunnerTestPlanForReview({
        reviewedAt,
        testPlanEntries: []
      })
    ],
    [
      "noncanonical-consumer-owned-display-conformance-runner-test-plan-input-rejected",
      createConsumerOwnedDisplayConformanceRunnerTestPlanForReview({
        reviewedAt,
        testPlanEntries: testPlanEntryPatch({
          testPlanId: "phase5-54.locus.noncanonical.test-plan"
        })
      })
    ],
    [
      "noncanonical-consumer-owned-display-conformance-runner-test-plan-input-rejected",
      createConsumerOwnedDisplayConformanceRunnerTestPlanForReview({
        reviewedAt,
        testPlanEntries: testPlanEntryPatch({
          expectedAssertions: [
            ...testPlanEntryPatch({})[0].expectedAssertions
          ].reverse()
        })
      })
    ],
    [
      "valid-consumer-owned-display-conformance-runner-test-plan",
      createConsumerOwnedDisplayConformanceRunnerTestPlanForReview({
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

test("Phase 5.54 test plan covers required consumers, ordering, accessibility, and runner/test-harness boundaries", async () => {
  const fixture = await readFixture();
  const entries = new Map(
    fixture.testPlanEntries.map((entry) => [entry.testPlanId, entry])
  );

  assert.deepEqual(
    fixture.testPlanEntries.map((entry) => entry.testPlanId),
    expectedTestPlanIds
  );
  assert.deepEqual(fixture.testPlanSummary.consumerNames, [
    "Locus",
    "Multiverse"
  ]);
  assert.equal(
    entries.get("phase5-54.locus.accessibility-wcag-display-expectations.test-plan")
      .consumerName,
    "Locus"
  );
  assert.equal(
    entries.get(
      "phase5-54.multiverse.registry-websocket-mcp-task-blocked-indicator-conformance.test-plan"
    ).consumerName,
    "Multiverse"
  );
  assert.equal(
    entries.get(
      "phase5-54.multiverse.accessibility-wcag-display-expectations.test-plan"
    ).consumerName,
    "Multiverse"
  );

  for (const entry of fixture.testPlanEntries) {
    assert.ok(["Locus", "Multiverse"].includes(entry.consumerName));
    assert.match(entry.testPlanId, /^phase5-54\./);
    assert.match(entry.referencedPhase550SchemaBoundaryId, /^phase5-50\./);
    assert.match(entry.referencedPhase551FixtureId, /^phase5-51\./);
    assert.match(entry.referencedPhase552HandoffId, /^phase5-52\./);
    assert.match(entry.referencedPhase553RunnerRequirementId, /^phase5-53\./);
    assert.equal(entry.testPlanIntent, "metadata_only");
    assert.equal(entry.consumerTargetOnly, true);
    assert.equal(entry.runnerImplementedByArdyn, false);
    assert.equal(entry.testHarnessImplementedByArdyn, false);
    assert.equal(entry.importExportCommandImplemented, false);
    assert.equal(entry.browserRenderingHarnessImplemented, false);
    assert.equal(entry.packageExportImplemented, false);
    assert.equal(entry.consumerSideCiImplemented, false);
    assert.equal(entry.fixtureDiscoveryRuntimeImplemented, false);
    assert.equal(entry.consumerRepoModifiedByArdyn, false);
    assert.ok(entry.sourceArdynArtifactType.length > 0, entry.testPlanId);
    assert.ok(entry.referencedPhase551FixtureGroup.length > 0, entry.testPlanId);
    assert.ok(entry.futureConsumerOwnedTestResponsibility.length > 0);
    assert.ok(entry.allowedFutureTestBehavior.length > 0);
    assert.ok(entry.expectedAssertions.length >= 8);
    assert.ok(entry.forbiddenCurrentArdynBehavior.length >= 9);
    assert.ok(entry.requiredFutureContractBeforeExecutableRunner.length > 0);
    assert.equal(entry.nonAuthorizingProof, true, entry.testPlanId);
    assertAllFalse(entry.explicitBlockedAuthorizationFlags);
    assertAllFalse(entry.unsafeRunnerImportExportTestHarnessRuntimeFlags);
    assertAllFalse(entry.runtimeEffect);

    const accessibility = entry.accessibilityWcagAssertionNotes;
    assert.ok(accessibility.keyboardScreenReaderDisplayNotes.length > 0);
    assert.equal(accessibility.colorIndependentStatusIndicatorRequired, true);
    assert.equal(accessibility.reducedMotionDefaultStaticDisplayRequired, true);
    assert.equal(accessibility.noAutoExecutionNoHiddenActionSemantics, true);
    assert.equal(accessibility.colorOnlyStatusForbidden, true);
    assert.equal(accessibility.motionRequiredForStatusForbidden, true);
    assert.equal(accessibility.keyboardTraversalAssertionRequired, true);
    assert.equal(accessibility.screenReaderLabelAssertionRequired, true);
    assert.equal(accessibility.colorIndependentStatusAssertionRequired, true);
    assert.equal(accessibility.reducedMotionStaticDefaultAssertionRequired, true);
    assert.equal(accessibility.noAutoExecutionNoHiddenActionAssertionRequired, true);

    assert.equal(entry.fixtureDeterminismExpectations.deterministicFixtureIdsRequired, true);
    assert.equal(entry.fixtureDeterminismExpectations.deterministicOrderingRequired, true);
    assert.equal(entry.fixtureDeterminismExpectations.deterministicTestPlanIdsRequired, true);
    assert.equal(
      entry.fixtureDeterminismExpectations.deterministicExpectedAssertionsRequired,
      true
    );
    assert.equal(
      entry.fixtureDeterminismExpectations.consumerOwnedTestOutputMustBeReviewOnly,
      true
    );
  }
});

test("Phase 5.54 result remains non-authorizing, metadata-only, and runtime blocked", async () => {
  const fixture = await readFixture();

  assert.equal(fixture.reviewOnly, true);
  assert.equal(fixture.authoritative, false);
  assert.equal(fixture.consumerOwnedDisplayConformanceRunnerTestPlanOnly, true);
  assert.equal(fixture.testPlanSummary.referencesPhase550SchemaBoundary, true);
  assert.equal(fixture.testPlanSummary.referencesPhase551ExamplePack, true);
  assert.equal(fixture.testPlanSummary.referencesPhase552ConformanceHandoff, true);
  assert.equal(fixture.testPlanSummary.referencesPhase553RunnerRequirements, true);
  assert.equal(fixture.testPlanSummary.locusAndMultiverseConsumerTargetsOnly, true);
  assert.equal(fixture.testPlanSummary.consumerRepoModifiedByArdyn, false);
  assert.equal(fixture.testPlanSummary.runnerImplementedByArdyn, false);
  assert.equal(fixture.testPlanSummary.testHarnessImplementedByArdyn, false);
  assert.equal(fixture.testPlanSummary.importExportCommandImplemented, false);
  assert.equal(fixture.testPlanSummary.packageExportImplemented, false);
  assert.equal(fixture.testPlanSummary.consumerSideCiImplemented, false);
  assert.equal(fixture.testPlanSummary.fixtureDiscoveryRuntimeImplemented, false);
  assert.equal(fixture.testPlanSummary.uiFrontendBrowserRenderingImplemented, false);
  assert.equal(fixture.testPlanSummary.browserWcagAutomationImplemented, false);
  assert.equal(fixture.testPlanSummary.visualRegressionHarnessImplemented, false);
  assert.equal(fixture.testPlanSummary.screenReaderAutomationImplemented, false);
  assert.equal(fixture.testPlanSummary.validationImplementsRunner, false);
  assert.equal(fixture.testPlanSummary.validationImplementsTestHarness, false);
  assert.equal(fixture.testPlanSummary.validationImplementsImportExportCommands, false);
  assert.equal(fixture.testPlanSummary.validationImplementsPackageExport, false);
  assert.equal(fixture.testPlanSummary.validationImplementsConsumerSideCi, false);
  assert.equal(fixture.testPlanSummary.validationImplementsFixtureDiscoveryRuntime, false);
  assert.equal(fixture.testPlanSummary.validationPerformsRendering, false);
  assert.equal(fixture.testPlanSummary.validationRunsBrowserWcagAutomation, false);
  assert.equal(fixture.testPlanSummary.validationCallsExternalConsumers, false);
  assert.equal(fixture.testPlanSummary.validationPerformsExternalLookups, false);
  assert.equal(fixture.testPlanSummary.validationScansFilesystem, false);
  assert.equal(fixture.testPlanSummary.validationControlsProcesses, false);
  assert.equal(fixture.testPlanSummary.runtimeExecutionEnabled, false);
  assert.equal(fixture.testPlanSummary.commandRuntimeControlEnabled, false);
  assert.equal(fixture.testPlanSummary.secureDropImplemented, false);
  assert.equal(fixture.testPlanSummary.serviceDiscoveryEnabled, false);
  assert.equal(fixture.testPlanSummary.scheduleEnforcementEnabled, false);
  assert.equal(fixture.testPlanSummary.filesystemScanningEnabled, false);
  assert.equal(fixture.testPlanSummary.processControlEnabled, false);
  assert.equal(fixture.invalidTestPlanCasePolicy.referencesPhase550SchemaBoundaryRequired, true);
  assert.equal(fixture.invalidTestPlanCasePolicy.referencesPhase551ExamplePackRequired, true);
  assert.equal(fixture.invalidTestPlanCasePolicy.referencesPhase552ConformanceHandoffRequired, true);
  assert.equal(fixture.invalidTestPlanCasePolicy.referencesPhase553RunnerRequirementsRequired, true);
  assert.equal(fixture.invalidTestPlanCasePolicy.nestedUnsafeInputFlagsFailClosed, true);
  assert.equal(fixture.invalidTestPlanCasePolicy.canonicalTestPlanEntriesRequired, true);
  assert.equal(fixture.invalidTestPlanCasePolicy.validationImplementsRunner, false);
  assert.equal(fixture.invalidTestPlanCasePolicy.validationImplementsTestHarness, false);
  assert.equal(fixture.invalidTestPlanCasePolicy.validationImplementsImportExportCommands, false);
  assert.equal(fixture.invalidTestPlanCasePolicy.validationImplementsPackageExport, false);
  assert.equal(fixture.invalidTestPlanCasePolicy.validationImplementsConsumerSideCi, false);
  assert.equal(fixture.invalidTestPlanCasePolicy.validationImplementsFixtureDiscoveryRuntime, false);
  assert.equal(fixture.invalidTestPlanCasePolicy.validationPerformsRendering, false);
  assert.equal(fixture.invalidTestPlanCasePolicy.validationRunsBrowserWcagAutomation, false);
  assert.equal(fixture.invalidTestPlanCasePolicy.validationCallsExternalConsumers, false);
  assert.equal(fixture.invalidTestPlanCasePolicy.validationPerformsExternalLookups, false);
  assert.equal(fixture.invalidTestPlanCasePolicy.validationScansFilesystem, false);
  assert.equal(fixture.invalidTestPlanCasePolicy.validationControlsProcesses, false);
  assertNonAuthorizing(fixture);
  assertNonAuthorizing(fixture.consumerOwnedDisplayConformanceRunnerTestPlan);
  assert.deepEqual(fixture.rejectionReasons, [
    "consumer_owned_display_conformance_runner_test_plan_is_review_only",
    "test_plan_entries_are_metadata_only",
    "references_phase_5_50_schema_boundary",
    "references_phase_5_51_example_pack",
    "references_phase_5_52_conformance_handoff",
    "references_phase_5_53_runner_requirements",
    "ardyn_does_not_implement_runner_test_harness_import_export_package_export_ci_ui_browser_rendering_or_consumer_repo_changes",
    "runtime_command_db_storage_secrets_connector_fabric_websocket_http_mcp_task_secure_drop_service_discovery_schedule_filesystem_process_authorizations_false",
    "unsafe_runner_import_export_test_harness_runtime_flags_fail_closed",
    "fallow_runtime_not_used",
    "runtime_enablement_still_blocked"
  ]);
  assert.ok(
    fixture.topDisplayConformanceRunnerTestPlanGaps.some((gap) =>
      gap.includes("no Locus or Multiverse consumer-owned runner or test harness")
    )
  );
  assert.equal(
    fixture.recommendedNextPhase,
    "phase-5.55-consumer-owned-display-conformance-runner-result-schema-boundary"
  );
});

test("serve-runtime remains default-blocked and dry-run cannot bypass Phase 5.54", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-54-runtime-"));

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

test("Phase 5.54 runner/test-harness/import/export command names remain rejected", async () => {
  for (const command of commandProbes) {
    const failure = await expectCliFailure([command]);

    assert.notEqual(failure.code, 0);
    assert.equal(failure.stdout, "");
    assert.match(failure.stderr, /unknown command|Usage: ardyn/i);
  }
});

test("Phase 5.54 does not change CLI, Rust, Fabric, package, or consumer source", async () => {
  await execFileAsync(
    "git",
    [
      "diff",
      "--exit-code",
      phase554BaselineCommit,
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

  assert.doesNotMatch(currentCliSource, /consumer-owned-display-conformance-runner-test-plan/);
  assert.doesNotMatch(currentCliSource, /consumer-display-conformance-test-harness/);
  assert.doesNotMatch(currentCliSource, /display-fixture-test-harness/);
  assert.doesNotMatch(currentCliSource, /fixture-discovery-runtime/);
  assert.doesNotMatch(currentCliSource, /consumer-side-ci-test-runner/);
  assert.doesNotMatch(currentCliSource, /browser-wcag-automation/);
  assert.doesNotMatch(currentCliSource, /phase-5-54/);
});
