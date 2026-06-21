import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";
import {
  CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_INTAKE_BOUNDARY_SCHEMA,
  createConsumerOwnedDisplayConformanceResultHandoffForReview,
  createConsumerOwnedDisplayConformanceResultReviewIntakeBoundaryForReview
} from "../packages/core/src/index.mjs";

const execFileAsync = promisify(execFile);
const phase557BaselineCommit = "1ef4d8c56b50ccbd5bcd7e7e0aff0b4a4733a6e0";
const reviewedAt = "2026-06-21T00:00:00.000Z";
const repoRootUrl = new URL("../", import.meta.url);
const repoRoot = fileURLToPath(repoRootUrl);
const cliPath = fileURLToPath(new URL("../apps/cli/src/index.mjs", import.meta.url));
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-57/consumer-owned-display-conformance-result-review-intake-boundary.json",
  import.meta.url
);

const expectedCaseClassifications = Object.freeze({
  "malformed-consumer-owned-display-conformance-result-review-intake-boundary-input-rejected":
    "malformed_consumer_owned_display_conformance_result_review_intake_boundary_input_rejected",
  "missing-required-consumer-owned-display-conformance-result-review-intake-boundary-entry-rejected":
    "missing_required_consumer_owned_display_conformance_result_review_intake_boundary_entry_rejected",
  "unknown-consumer-name-consumer-owned-display-conformance-result-review-intake-boundary-input-rejected":
    "unknown_consumer_name_consumer_owned_display_conformance_result_review_intake_boundary_input_rejected",
  "unknown-review-intake-intent-consumer-owned-display-conformance-result-review-intake-boundary-input-rejected":
    "unknown_review_intake_intent_consumer_owned_display_conformance_result_review_intake_boundary_input_rejected",
  "interactive-actionable-intent-consumer-owned-display-conformance-result-review-intake-boundary-input-rejected":
    "interactive_actionable_intent_consumer_owned_display_conformance_result_review_intake_boundary_input_rejected",
  "authorization-flags-enabled-consumer-owned-display-conformance-result-review-intake-boundary-input-rejected":
    "authorization_flags_enabled_consumer_owned_display_conformance_result_review_intake_boundary_input_rejected",
  "unsafe-runner-result-producer-result-collector-import-export-validator-review-router-evaluator-approval-test-harness-runtime-flags-consumer-owned-display-conformance-result-review-intake-boundary-input-rejected":
    "unsafe_runner_result_producer_result_collector_import_export_validator_review_router_evaluator_approval_test_harness_runtime_flags_consumer_owned_display_conformance_result_review_intake_boundary_input_rejected",
  "nested-unsafe-flags-consumer-owned-display-conformance-result-review-intake-boundary-input-rejected":
    "nested_unsafe_flags_consumer_owned_display_conformance_result_review_intake_boundary_input_rejected",
  "hidden-runner-result-producer-result-collector-import-export-validator-review-router-evaluator-approval-test-harness-runtime-semantics-consumer-owned-display-conformance-result-review-intake-boundary-input-rejected":
    "hidden_runner_result_producer_result_collector_import_export_validator_review_router_evaluator_approval_test_harness_runtime_semantics_consumer_owned_display_conformance_result_review_intake_boundary_input_rejected",
  "secure-drop-implementation-semantics-consumer-owned-display-conformance-result-review-intake-boundary-input-rejected":
    "secure_drop_implementation_semantics_consumer_owned_display_conformance_result_review_intake_boundary_input_rejected",
  "websocket-http-fabric-mcp-task-execution-semantics-consumer-owned-display-conformance-result-review-intake-boundary-input-rejected":
    "websocket_http_fabric_mcp_task_execution_semantics_consumer_owned_display_conformance_result_review_intake_boundary_input_rejected",
  "unknown-reference-consumer-owned-display-conformance-result-review-intake-boundary-input-rejected":
    "unknown_reference_consumer_owned_display_conformance_result_review_intake_boundary_input_rejected",
  "noncanonical-consumer-owned-display-conformance-result-review-intake-boundary-input-rejected":
    "noncanonical_consumer_owned_display_conformance_result_review_intake_boundary_input_rejected",
  "runner-result-producer-result-collector-import-export-validator-review-router-evaluator-approval-test-harness-implementation-semantics-consumer-owned-display-conformance-result-review-intake-boundary-input-rejected":
    "runner_result_producer_result_collector_import_export_validator_review_router_evaluator_approval_test_harness_implementation_semantics_consumer_owned_display_conformance_result_review_intake_boundary_input_rejected",
  "valid-consumer-owned-display-conformance-result-review-intake-boundary":
    "valid_consumer_owned_display_conformance_result_review_intake_boundary_runtime_still_blocked"
});

const expectedIntakeIds = Object.freeze([
  "phase5-57.locus.status-control-panel-conformance.result-review-intake",
  "phase5-57.locus.review-artifact-panel-conformance.result-review-intake",
  "phase5-57.locus.capability-metadata-panel-conformance.result-review-intake",
  "phase5-57.locus.blocked-runtime-command-indicator-conformance.result-review-intake",
  "phase5-57.locus.future-secure-drop-compose-inbox-placeholder-conformance.result-review-intake",
  "phase5-57.locus.accessibility-wcag-display-expectation.result-review-intake",
  "phase5-57.multiverse.world-project-status-card-conformance.result-review-intake",
  "phase5-57.multiverse.visible-ai-capability-badge-conformance.result-review-intake",
  "phase5-57.multiverse.task-capability-wrapper-status-card-conformance.result-review-intake",
  "phase5-57.multiverse.citizen-adapter-candidate-badge-conformance.result-review-intake",
  "phase5-57.multiverse.registry-websocket-mcp-task-blocked-indicator-conformance.result-review-intake",
  "phase5-57.multiverse.accessibility-wcag-display-expectation.result-review-intake"
]);

const commandProbes = Object.freeze([
  "consumer-owned-display-conformance-result-review-intake-boundary",
  "create-consumer-owned-display-conformance-result-review-intake-boundary",
  "phase-5-57-display-conformance-result-review-intake-boundary",
  "consumer-display-conformance-result-intake",
  "consumer-display-conformance-result-importer",
  "consumer-display-conformance-result-exporter",
  "consumer-display-conformance-result-validator",
  "consumer-display-conformance-review-router",
  "consumer-display-conformance-evaluator",
  "consumer-display-conformance-approval",
  "display-fixture-test-harness",
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
  "resultValidatorImplementedByArdyn",
  "reviewRouterImplementedByArdyn",
  "evaluatorImplementedByArdyn",
  "approvalPathImplementedByArdyn",
  "approvalDecisionProducedByArdyn",
  "approvalGrantProducedByArdyn",
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

function reviewIntakeEntryPatch(patch) {
  const [entry] =
    createConsumerOwnedDisplayConformanceResultReviewIntakeBoundaryForReview({
      reviewedAt
    }).reviewIntakeEntries;

  return [{ ...structuredClone(entry), ...patch }];
}

test("Phase 5.57 review intake boundary fixture is deterministic", async () => {
  const fixture = await readFixture();
  const generated =
    createConsumerOwnedDisplayConformanceResultReviewIntakeBoundaryForReview({
      reviewedAt
    });

  assert.equal(
    fixture.schema,
    CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_INTAKE_BOUNDARY_SCHEMA
  );
  assert.deepEqual(fixture, generated);
  assert.equal(
    fixture.classification,
    expectedCaseClassifications[
      "valid-consumer-owned-display-conformance-result-review-intake-boundary"
    ]
  );
  assert.equal(
    fixture.consumerOwnedDisplayConformanceResultReviewIntakeBoundaryProduced,
    true
  );
  assert.equal(fixture.reviewIntakeSummary.reviewIntakeEntryCount, 12);
  assert.equal(fixture.reviewIntakeSummary.locusReviewIntakeEntryCount, 6);
  assert.equal(
    fixture.reviewIntakeSummary.multiverseReviewIntakeEntryCount,
    6
  );
  assert.equal(
    fixture.reviewIntakeSummary.reviewIntakeMeansMetadataCandidateStateOnly,
    true
  );
  assert.deepEqual(
    fixture.reviewIntakeSummary.deterministicIntakeIds,
    expectedIntakeIds
  );
});

test("Phase 5.57 review intake references Phase 5.50 through 5.56 artifacts", async () => {
  const fixture = await readFixture();
  const resultHandoff =
    createConsumerOwnedDisplayConformanceResultHandoffForReview({ reviewedAt });
  const resultHandoffById = new Map(
    resultHandoff.resultHandoffEntries.map((entry) => [entry.handoffId, entry])
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
  assert.equal(
    fixture.phase556ResultHandoffReference.sourceResultHandoffSchema,
    "ardyn.phase-5.56.consumer-owned-display-conformance-result-handoff-result"
  );

  for (const entry of fixture.reviewIntakeEntries) {
    const handoff = resultHandoffById.get(entry.referencedPhase556ResultHandoffId);

    assert.ok(handoff, entry.intakeId);
    assert.equal(
      entry.referencedPhase550SchemaBoundaryId,
      handoff.referencedPhase550SchemaBoundaryId
    );
    assert.equal(
      entry.referencedPhase551FixtureId,
      handoff.referencedPhase551FixtureId
    );
    assert.equal(
      entry.referencedPhase551FixtureGroup,
      handoff.referencedPhase551FixtureGroup
    );
    assert.equal(
      entry.referencedPhase552ConformanceHandoffId,
      handoff.referencedPhase552ConformanceHandoffId
    );
    assert.equal(
      entry.referencedPhase553RunnerRequirementId,
      handoff.referencedPhase553RunnerRequirementId
    );
    assert.equal(
      entry.referencedPhase554TestPlanId,
      handoff.referencedPhase554TestPlanId
    );
    assert.equal(
      entry.referencedPhase555ResultSchemaId,
      handoff.referencedPhase555ResultSchemaId
    );
    assert.equal(entry.consumerName, handoff.consumerName);
    assert.equal(entry.displaySurfaceId, handoff.displaySurfaceId);
    assert.equal(entry.sourceArdynArtifactType, handoff.sourceArdynArtifactType);
  }
});

test("Phase 5.57 invalid review-intake cases fail closed without authorization", () => {
  const missingIntakeId = reviewIntakeEntryPatch({});
  delete missingIntakeId[0].intakeId;

  const cases = [
    [
      "malformed-consumer-owned-display-conformance-result-review-intake-boundary-input-rejected",
      createConsumerOwnedDisplayConformanceResultReviewIntakeBoundaryForReview(null)
    ],
    [
      "malformed-consumer-owned-display-conformance-result-review-intake-boundary-input-rejected",
      createConsumerOwnedDisplayConformanceResultReviewIntakeBoundaryForReview({
        reviewedAt: "2026-06-21"
      })
    ],
    [
      "malformed-consumer-owned-display-conformance-result-review-intake-boundary-input-rejected",
      createConsumerOwnedDisplayConformanceResultReviewIntakeBoundaryForReview({
        reviewedAt,
        reviewIntakeEntries: {}
      })
    ],
    [
      "missing-required-consumer-owned-display-conformance-result-review-intake-boundary-entry-rejected",
      createConsumerOwnedDisplayConformanceResultReviewIntakeBoundaryForReview({
        reviewedAt,
        reviewIntakeEntries: missingIntakeId
      })
    ],
    [
      "unknown-consumer-name-consumer-owned-display-conformance-result-review-intake-boundary-input-rejected",
      createConsumerOwnedDisplayConformanceResultReviewIntakeBoundaryForReview({
        reviewedAt,
        reviewIntakeEntries: reviewIntakeEntryPatch({
          consumerName: "content-fabric"
        })
      })
    ],
    [
      "unknown-review-intake-intent-consumer-owned-display-conformance-result-review-intake-boundary-input-rejected",
      createConsumerOwnedDisplayConformanceResultReviewIntakeBoundaryForReview({
        reviewedAt,
        reviewIntakeEntries: reviewIntakeEntryPatch({
          reviewIntakeIntent: "metadata_plus_result_validator"
        })
      })
    ],
    [
      "interactive-actionable-intent-consumer-owned-display-conformance-result-review-intake-boundary-input-rejected",
      createConsumerOwnedDisplayConformanceResultReviewIntakeBoundaryForReview({
        reviewedAt,
        reviewIntakeEntries: reviewIntakeEntryPatch({
          reviewIntakeIntent: "result_validator"
        })
      })
    ],
    [
      "authorization-flags-enabled-consumer-owned-display-conformance-result-review-intake-boundary-input-rejected",
      createConsumerOwnedDisplayConformanceResultReviewIntakeBoundaryForReview({
        reviewedAt,
        reviewIntakeEntries: reviewIntakeEntryPatch({
          explicitBlockedAuthorizationFlags: { runtimeAuthorized: true }
        })
      })
    ],
    [
      "authorization-flags-enabled-consumer-owned-display-conformance-result-review-intake-boundary-input-rejected",
      createConsumerOwnedDisplayConformanceResultReviewIntakeBoundaryForReview({
        reviewedAt,
        explicitBlockedAuthorizationFlags: { runtimeAuthorized: true }
      })
    ],
    [
      "unsafe-runner-result-producer-result-collector-import-export-validator-review-router-evaluator-approval-test-harness-runtime-flags-consumer-owned-display-conformance-result-review-intake-boundary-input-rejected",
      createConsumerOwnedDisplayConformanceResultReviewIntakeBoundaryForReview({
        reviewedAt,
        reviewIntakeEntries: reviewIntakeEntryPatch({
          unsafeRunnerResultProducerResultCollectorImportExportValidatorReviewRouterEvaluatorApprovalTestHarnessRuntimeFlags:
            {
              resultValidatorEnabled: true
            }
        })
      })
    ],
    [
      "nested-unsafe-flags-consumer-owned-display-conformance-result-review-intake-boundary-input-rejected",
      createConsumerOwnedDisplayConformanceResultReviewIntakeBoundaryForReview({
        reviewedAt,
        reviewIntakeEntries: reviewIntakeEntryPatch({
          nested: { reviewRouter: { approvalGrantProduced: true } }
        })
      })
    ],
    [
      "hidden-runner-result-producer-result-collector-import-export-validator-review-router-evaluator-approval-test-harness-runtime-semantics-consumer-owned-display-conformance-result-review-intake-boundary-input-rejected",
      createConsumerOwnedDisplayConformanceResultReviewIntakeBoundaryForReview({
        reviewedAt,
        reviewIntakeEntries: reviewIntakeEntryPatch({
          reviewRouterSemantics: {
            hiddenReviewRouterSemanticsEnabled: true
          }
        })
      })
    ],
    [
      "unsafe-runner-result-producer-result-collector-import-export-validator-review-router-evaluator-approval-test-harness-runtime-flags-consumer-owned-display-conformance-result-review-intake-boundary-input-rejected",
      createConsumerOwnedDisplayConformanceResultReviewIntakeBoundaryForReview({
        reviewedAt,
        unsafeRunnerResultProducerResultCollectorImportExportValidatorReviewRouterEvaluatorApprovalTestHarnessRuntimeFlags:
          {
            resultValidatorEnabled: true
          }
      })
    ],
    [
      "hidden-runner-result-producer-result-collector-import-export-validator-review-router-evaluator-approval-test-harness-runtime-semantics-consumer-owned-display-conformance-result-review-intake-boundary-input-rejected",
      createConsumerOwnedDisplayConformanceResultReviewIntakeBoundaryForReview({
        reviewedAt,
        hiddenResultReviewIntakeSemanticsEnabled: true
      })
    ],
    [
      "secure-drop-implementation-semantics-consumer-owned-display-conformance-result-review-intake-boundary-input-rejected",
      createConsumerOwnedDisplayConformanceResultReviewIntakeBoundaryForReview({
        reviewedAt,
        reviewIntakeEntries: reviewIntakeEntryPatch({
          secureDrop: { secureDropCryptoImplemented: true }
        })
      })
    ],
    [
      "secure-drop-implementation-semantics-consumer-owned-display-conformance-result-review-intake-boundary-input-rejected",
      createConsumerOwnedDisplayConformanceResultReviewIntakeBoundaryForReview({
        reviewedAt,
        secureDrop: { secureDropCryptoImplemented: true }
      })
    ],
    [
      "websocket-http-fabric-mcp-task-execution-semantics-consumer-owned-display-conformance-result-review-intake-boundary-input-rejected",
      createConsumerOwnedDisplayConformanceResultReviewIntakeBoundaryForReview({
        reviewedAt,
        reviewIntakeEntries: reviewIntakeEntryPatch({
          runtimeSurfaces: { mcpToolExposureEnabled: true }
        })
      })
    ],
    [
      "websocket-http-fabric-mcp-task-execution-semantics-consumer-owned-display-conformance-result-review-intake-boundary-input-rejected",
      createConsumerOwnedDisplayConformanceResultReviewIntakeBoundaryForReview({
        reviewedAt,
        runtimeSurfaces: { mcpToolExposureEnabled: true }
      })
    ],
    [
      "runner-result-producer-result-collector-import-export-validator-review-router-evaluator-approval-test-harness-implementation-semantics-consumer-owned-display-conformance-result-review-intake-boundary-input-rejected",
      createConsumerOwnedDisplayConformanceResultReviewIntakeBoundaryForReview({
        reviewedAt,
        reviewIntakeEntries: reviewIntakeEntryPatch({
          resultValidatorImplementedByArdyn: true
        })
      })
    ],
    [
      "unknown-reference-consumer-owned-display-conformance-result-review-intake-boundary-input-rejected",
      createConsumerOwnedDisplayConformanceResultReviewIntakeBoundaryForReview({
        reviewedAt,
        reviewIntakeEntries: reviewIntakeEntryPatch({
          referencedPhase556ResultHandoffId:
            "phase5-56.unknown.consumer-display-conformance.result-handoff"
        })
      })
    ],
    [
      "noncanonical-consumer-owned-display-conformance-result-review-intake-boundary-input-rejected",
      createConsumerOwnedDisplayConformanceResultReviewIntakeBoundaryForReview({
        reviewedAt,
        reviewIntakeEntries: []
      })
    ],
    [
      "noncanonical-consumer-owned-display-conformance-result-review-intake-boundary-input-rejected",
      createConsumerOwnedDisplayConformanceResultReviewIntakeBoundaryForReview({
        reviewedAt,
        reviewIntakeEntries: reviewIntakeEntryPatch({
          intakeId: "phase5-57.locus.noncanonical.result-review-intake"
        })
      })
    ],
    [
      "valid-consumer-owned-display-conformance-result-review-intake-boundary",
      createConsumerOwnedDisplayConformanceResultReviewIntakeBoundaryForReview({
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

test("Phase 5.57 covers consumers, ordering, accessibility, and intake fields", async () => {
  const fixture = await readFixture();
  const entries = new Map(
    fixture.reviewIntakeEntries.map((entry) => [entry.intakeId, entry])
  );

  assert.deepEqual(
    fixture.reviewIntakeEntries.map((entry) => entry.intakeId),
    expectedIntakeIds
  );
  assert.deepEqual(fixture.reviewIntakeSummary.consumerNames, [
    "Locus",
    "Multiverse"
  ]);
  assert.equal(
    entries.get(
      "phase5-57.locus.accessibility-wcag-display-expectation.result-review-intake"
    ).consumerName,
    "Locus"
  );
  assert.equal(
    entries.get(
      "phase5-57.multiverse.registry-websocket-mcp-task-blocked-indicator-conformance.result-review-intake"
    ).consumerName,
    "Multiverse"
  );

  for (const entry of fixture.reviewIntakeEntries) {
    assert.ok(["Locus", "Multiverse"].includes(entry.consumerName));
    assert.match(entry.intakeId, /^phase5-57\./);
    assert.match(entry.referencedPhase550SchemaBoundaryId, /^phase5-50\./);
    assert.match(entry.referencedPhase551FixtureId, /^phase5-51\./);
    assert.match(entry.referencedPhase552ConformanceHandoffId, /^phase5-52\./);
    assert.match(entry.referencedPhase553RunnerRequirementId, /^phase5-53\./);
    assert.match(entry.referencedPhase554TestPlanId, /^phase5-54\./);
    assert.match(entry.referencedPhase555ResultSchemaId, /^phase5-55\./);
    assert.match(entry.referencedPhase556ResultHandoffId, /^phase5-56\./);
    assert.equal(entry.reviewIntakeIntent, "metadata_only");
    assert.equal(entry.consumerTargetOnly, true);
    assert.equal(entry.reviewIntakeCandidateMetadataOnly, true);
    assert.equal(entry.runnerImplementedByArdyn, false);
    assert.equal(entry.resultProducerImplementedByArdyn, false);
    assert.equal(entry.resultCollectorImplementedByArdyn, false);
    assert.equal(entry.resultImporterImplementedByArdyn, false);
    assert.equal(entry.resultExporterImplementedByArdyn, false);
    assert.equal(entry.resultValidatorImplementedByArdyn, false);
    assert.equal(entry.reviewRouterImplementedByArdyn, false);
    assert.equal(entry.evaluatorImplementedByArdyn, false);
    assert.equal(entry.approvalPathImplementedByArdyn, false);
    assert.equal(entry.approvalDecisionProducedByArdyn, false);
    assert.equal(entry.approvalGrantProducedByArdyn, false);
    assert.equal(entry.testHarnessImplementedByArdyn, false);
    assert.equal(entry.importExportCommandImplemented, false);
    assert.equal(entry.browserRenderingHarnessImplemented, false);
    assert.equal(entry.packageExportImplemented, false);
    assert.equal(entry.consumerSideCiImplemented, false);
    assert.equal(entry.fixtureDiscoveryRuntimeImplemented, false);
    assert.equal(entry.consumerRepoModifiedByArdyn, false);
    assert.equal(entry.nonAuthorizingProof, true);
    assert.match(entry.allowedFutureIntakeCandidateBehavior, /metadata/);
    assert.ok(
      entry.forbiddenCurrentArdynBehavior.includes("validate conformance results")
    );
    assert.ok(
      entry.forbiddenCurrentArdynBehavior.includes("route review intake candidates")
    );
    assert.ok(
      entry.forbiddenCurrentArdynBehavior.includes("produce approval grants")
    );
    assert.equal(
      entry.deterministicOrderingHashExpectations.deterministicIntakeIdsRequired,
      true
    );
    assert.equal(
      entry.deterministicOrderingHashExpectations.hashDoesNotAuthorizeRuntime,
      true
    );
    assert.equal(
      entry.accessibilityWcagIntakeNotes
        .resultReviewIntakeMustRemainReadableWithoutColorOrMotion,
      true
    );
    assert.equal(
      entry.accessibilityWcagIntakeNotes
        .resultReviewIntakeMustNotExposeHiddenActionSemantics,
      true
    );
    assert.match(
      entry.requiredFutureContractBeforeExecutableResultIntakeImportValidationRoutingEvaluationApprovalExportOrCi,
      /separate consumer-owned executable result-intake/
    );
    assertAllFalse(entry.explicitBlockedAuthorizationFlags);
    assertAllFalse(
      entry
        .unsafeRunnerResultProducerResultCollectorImportExportValidatorReviewRouterEvaluatorApprovalTestHarnessRuntimeFlags
    );
    assertAllFalse(entry.runtimeEffect);
  }
});

test("Phase 5.57 review intake stays non-authorizing and runtime-blocked", async () => {
  const fixture = await readFixture();
  const summary = fixture.reviewIntakeSummary;

  assert.equal(summary.referencesPhase550SchemaBoundary, true);
  assert.equal(summary.referencesPhase551ExamplePack, true);
  assert.equal(summary.referencesPhase552ConformanceHandoff, true);
  assert.equal(summary.referencesPhase553RunnerRequirements, true);
  assert.equal(summary.referencesPhase554TestPlan, true);
  assert.equal(summary.referencesPhase555ResultSchemaBoundary, true);
  assert.equal(summary.referencesPhase556ResultHandoff, true);
  assert.equal(summary.reviewIntakeMeansMetadataCandidateStateOnly, true);
  assert.equal(summary.locusAndMultiverseConsumerTargetsOnly, true);
  assert.equal(summary.runnerImplementedByArdyn, false);
  assert.equal(summary.resultProducerImplementedByArdyn, false);
  assert.equal(summary.resultCollectorImplementedByArdyn, false);
  assert.equal(summary.resultImporterImplementedByArdyn, false);
  assert.equal(summary.resultExporterImplementedByArdyn, false);
  assert.equal(summary.resultValidatorImplementedByArdyn, false);
  assert.equal(summary.reviewRouterImplementedByArdyn, false);
  assert.equal(summary.evaluatorImplementedByArdyn, false);
  assert.equal(summary.approvalDecisionProducedByArdyn, false);
  assert.equal(summary.approvalGrantProducedByArdyn, false);
  assert.equal(summary.testHarnessImplementedByArdyn, false);
  assert.equal(summary.importExportCommandImplemented, false);
  assert.equal(summary.packageExportImplemented, false);
  assert.equal(summary.consumerSideCiImplemented, false);
  assert.equal(summary.validationImplementsResultValidator, false);
  assert.equal(summary.validationImplementsReviewRouter, false);
  assert.equal(summary.validationImplementsEvaluator, false);
  assert.equal(summary.validationImplementsApprovalDecision, false);
  assert.equal(summary.validationImplementsApprovalGrant, false);
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
    fixture.invalidReviewIntakeCasePolicy.referencesPhase556ResultHandoffRequired,
    true
  );
  assert.equal(fixture.invalidReviewIntakeCasePolicy.validationImplementsResultValidator, false);
  assert.equal(fixture.invalidReviewIntakeCasePolicy.validationImplementsReviewRouter, false);
  assert.equal(fixture.invalidReviewIntakeCasePolicy.validationImplementsEvaluator, false);
  assert.equal(
    fixture.invalidReviewIntakeCasePolicy.validationImplementsApprovalGrant,
    false
  );
  assertNonAuthorizing(fixture);
  assertNonAuthorizing(
    fixture.consumerOwnedDisplayConformanceResultReviewIntakeBoundary
  );
  assert.deepEqual(fixture.rejectionReasons, [
    "consumer_owned_display_conformance_result_review_intake_boundary_is_review_only",
    "review_intake_entries_are_metadata_candidate_state_only",
    "references_phase_5_50_schema_boundary",
    "references_phase_5_51_example_pack",
    "references_phase_5_52_conformance_handoff",
    "references_phase_5_53_runner_requirements",
    "references_phase_5_54_test_plan",
    "references_phase_5_55_result_schema_boundary",
    "references_phase_5_56_result_handoff",
    "ardyn_does_not_implement_runner_result_producer_result_collector_result_importer_result_exporter_result_validator_review_router_evaluator_approval_test_harness_import_export_package_export_ci_ui_browser_rendering_or_consumer_repo_changes",
    "runtime_command_db_storage_secrets_connector_fabric_websocket_http_mcp_task_secure_drop_service_discovery_schedule_filesystem_process_authorizations_false",
    "unsafe_runner_result_producer_result_collector_import_export_validator_review_router_evaluator_approval_test_harness_runtime_flags_fail_closed",
    "fallow_runtime_not_used",
    "runtime_enablement_still_blocked"
  ]);
  assert.ok(
    fixture.topDisplayConformanceResultReviewIntakeGaps.some((gap) =>
      gap.includes("no Locus or Multiverse consumer-owned result artifact package")
    )
  );
  assert.equal(
    fixture.recommendedNextPhase,
    "phase-5.58-consumer-owned-display-conformance-result-review-package-boundary"
  );
});

test("serve-runtime remains default-blocked and dry-run cannot bypass Phase 5.57", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-57-runtime-"));

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

test("Phase 5.57 runner/result/import/export/validator/router/evaluator/approval command names remain rejected", async () => {
  for (const command of commandProbes) {
    const failure = await expectCliFailure([command]);

    assert.notEqual(failure.code, 0);
    assert.equal(failure.stdout, "");
    assert.match(failure.stderr, /unknown command|Usage: ardyn/i);
  }
});

test("Phase 5.57 does not change CLI, Rust, Fabric, package, or consumer source", async () => {
  await execFileAsync(
    "git",
    [
      "diff",
      "--exit-code",
      phase557BaselineCommit,
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
    /consumer-owned-display-conformance-result-review-intake-boundary/
  );
  assert.doesNotMatch(currentCliSource, /consumer-display-conformance-result-intake/);
  assert.doesNotMatch(currentCliSource, /consumer-display-conformance-result-validator/);
  assert.doesNotMatch(currentCliSource, /consumer-display-conformance-review-router/);
  assert.doesNotMatch(currentCliSource, /consumer-display-conformance-evaluator/);
  assert.doesNotMatch(currentCliSource, /consumer-display-conformance-approval/);
  assert.doesNotMatch(currentCliSource, /display-fixture-test-harness/);
  assert.doesNotMatch(currentCliSource, /consumer-side-ci-test-runner/);
  assert.doesNotMatch(currentCliSource, /browser-wcag-automation/);
  assert.doesNotMatch(currentCliSource, /phase-5-57/);
});
