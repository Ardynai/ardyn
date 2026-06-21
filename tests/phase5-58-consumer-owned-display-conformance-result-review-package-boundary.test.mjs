import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";
import {
  CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_PACKAGE_BOUNDARY_SCHEMA,
  createConsumerOwnedDisplayConformanceResultReviewIntakeBoundaryForReview,
  createConsumerOwnedDisplayConformanceResultReviewPackageBoundaryForReview
} from "../packages/core/src/index.mjs";

const execFileAsync = promisify(execFile);
const phase558BaselineCommit = "3f38721d374b4a6ef8c97bfc10b9085cd9a4b79c";
const reviewedAt = "2026-06-21T00:00:00.000Z";
const repoRootUrl = new URL("../", import.meta.url);
const repoRoot = fileURLToPath(repoRootUrl);
const cliPath = fileURLToPath(new URL("../apps/cli/src/index.mjs", import.meta.url));
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-58/consumer-owned-display-conformance-result-review-package-boundary.json",
  import.meta.url
);

const expectedCaseClassifications = Object.freeze({
  "malformed-consumer-owned-display-conformance-result-review-package-boundary-input-rejected":
    "malformed_consumer_owned_display_conformance_result_review_package_boundary_input_rejected",
  "missing-required-consumer-owned-display-conformance-result-review-package-boundary-entry-rejected":
    "missing_required_consumer_owned_display_conformance_result_review_package_boundary_entry_rejected",
  "unknown-consumer-name-consumer-owned-display-conformance-result-review-package-boundary-input-rejected":
    "unknown_consumer_name_consumer_owned_display_conformance_result_review_package_boundary_input_rejected",
  "unknown-review-package-intent-consumer-owned-display-conformance-result-review-package-boundary-input-rejected":
    "unknown_review_package_intent_consumer_owned_display_conformance_result_review_package_boundary_input_rejected",
  "interactive-actionable-intent-consumer-owned-display-conformance-result-review-package-boundary-input-rejected":
    "interactive_actionable_intent_consumer_owned_display_conformance_result_review_package_boundary_input_rejected",
  "authorization-flags-enabled-consumer-owned-display-conformance-result-review-package-boundary-input-rejected":
    "authorization_flags_enabled_consumer_owned_display_conformance_result_review_package_boundary_input_rejected",
  "unsafe-package-import-export-persistence-runner-result-producer-result-collector-validator-review-router-evaluator-approval-test-harness-runtime-flags-consumer-owned-display-conformance-result-review-package-boundary-input-rejected":
    "unsafe_package_import_export_persistence_runner_result_producer_result_collector_validator_review_router_evaluator_approval_test_harness_runtime_flags_consumer_owned_display_conformance_result_review_package_boundary_input_rejected",
  "nested-unsafe-flags-consumer-owned-display-conformance-result-review-package-boundary-input-rejected":
    "nested_unsafe_flags_consumer_owned_display_conformance_result_review_package_boundary_input_rejected",
  "hidden-package-import-export-persistence-runner-result-producer-result-collector-validator-review-router-evaluator-approval-test-harness-runtime-semantics-consumer-owned-display-conformance-result-review-package-boundary-input-rejected":
    "hidden_package_import_export_persistence_runner_result_producer_result_collector_validator_review_router_evaluator_approval_test_harness_runtime_semantics_consumer_owned_display_conformance_result_review_package_boundary_input_rejected",
  "secure-drop-implementation-semantics-consumer-owned-display-conformance-result-review-package-boundary-input-rejected":
    "secure_drop_implementation_semantics_consumer_owned_display_conformance_result_review_package_boundary_input_rejected",
  "websocket-http-fabric-mcp-task-execution-semantics-consumer-owned-display-conformance-result-review-package-boundary-input-rejected":
    "websocket_http_fabric_mcp_task_execution_semantics_consumer_owned_display_conformance_result_review_package_boundary_input_rejected",
  "unknown-reference-consumer-owned-display-conformance-result-review-package-boundary-input-rejected":
    "unknown_reference_consumer_owned_display_conformance_result_review_package_boundary_input_rejected",
  "noncanonical-consumer-owned-display-conformance-result-review-package-boundary-input-rejected":
    "noncanonical_consumer_owned_display_conformance_result_review_package_boundary_input_rejected",
  "package-import-export-persistence-runner-result-producer-result-collector-validator-review-router-evaluator-approval-test-harness-implementation-semantics-consumer-owned-display-conformance-result-review-package-boundary-input-rejected":
    "package_import_export_persistence_runner_result_producer_result_collector_validator_review_router_evaluator_approval_test_harness_implementation_semantics_consumer_owned_display_conformance_result_review_package_boundary_input_rejected",
  "valid-consumer-owned-display-conformance-result-review-package-boundary":
    "valid_consumer_owned_display_conformance_result_review_package_boundary_runtime_still_blocked"
});

const expectedPackageBoundaryIds = Object.freeze([
  "phase5-58.locus.status-control-panel-conformance.result-review-package",
  "phase5-58.locus.review-artifact-panel-conformance.result-review-package",
  "phase5-58.locus.capability-metadata-panel-conformance.result-review-package",
  "phase5-58.locus.blocked-runtime-command-indicator-conformance.result-review-package",
  "phase5-58.locus.future-secure-drop-compose-inbox-placeholder-conformance.result-review-package",
  "phase5-58.locus.accessibility-wcag-display-expectation.result-review-package",
  "phase5-58.multiverse.world-project-status-card-conformance.result-review-package",
  "phase5-58.multiverse.visible-ai-capability-badge-conformance.result-review-package",
  "phase5-58.multiverse.task-capability-wrapper-status-card-conformance.result-review-package",
  "phase5-58.multiverse.citizen-adapter-candidate-badge-conformance.result-review-package",
  "phase5-58.multiverse.registry-websocket-mcp-task-blocked-indicator-conformance.result-review-package",
  "phase5-58.multiverse.accessibility-wcag-display-expectation.result-review-package"
]);

const commandProbes = Object.freeze([
  "consumer-owned-display-conformance-result-review-package-boundary",
  "create-consumer-owned-display-conformance-result-review-package-boundary",
  "phase-5-58-display-conformance-result-review-package-boundary",
  "consumer-display-conformance-result-review-package",
  "consumer-display-conformance-result-package-importer",
  "consumer-display-conformance-result-package-exporter",
  "consumer-display-conformance-result-package-writer",
  "consumer-display-conformance-result-package-reader",
  "consumer-display-conformance-result-package-persistence",
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
  "packageProducedByArdyn",
  "packageExportImplemented",
  "packageImportImplemented",
  "packageWriterImplemented",
  "packageReaderImplemented",
  "packagePersistenceImplemented",
  "packageDiscoveryImplemented",
  "packageDistributionImplemented",
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

function reviewPackageEntryPatch(patch) {
  const [entry] =
    createConsumerOwnedDisplayConformanceResultReviewPackageBoundaryForReview({
      reviewedAt
    }).reviewPackageEntries;

  return [{ ...structuredClone(entry), ...patch }];
}

test("Phase 5.58 review package boundary fixture is deterministic", async () => {
  const fixture = await readFixture();
  const generated =
    createConsumerOwnedDisplayConformanceResultReviewPackageBoundaryForReview({
      reviewedAt
    });

  assert.equal(
    fixture.schema,
    CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_PACKAGE_BOUNDARY_SCHEMA
  );
  assert.deepEqual(fixture, generated);
  assert.equal(
    fixture.classification,
    expectedCaseClassifications[
      "valid-consumer-owned-display-conformance-result-review-package-boundary"
    ]
  );
  assert.equal(
    fixture.consumerOwnedDisplayConformanceResultReviewPackageBoundaryProduced,
    true
  );
  assert.equal(fixture.reviewPackageSummary.reviewPackageEntryCount, 12);
  assert.equal(fixture.reviewPackageSummary.locusReviewPackageEntryCount, 6);
  assert.equal(
    fixture.reviewPackageSummary.multiverseReviewPackageEntryCount,
    6
  );
  assert.equal(
    fixture.reviewPackageSummary.reviewPackageMeansMetadataOnlyCandidatePackageShape,
    true
  );
  assert.deepEqual(
    fixture.reviewPackageSummary.deterministicPackageBoundaryIds,
    expectedPackageBoundaryIds
  );
});

test("Phase 5.58 review package references Phase 5.50 through 5.57 artifacts", async () => {
  const fixture = await readFixture();
  const reviewIntake =
    createConsumerOwnedDisplayConformanceResultReviewIntakeBoundaryForReview({
      reviewedAt
    });
  const reviewIntakeById = new Map(
    reviewIntake.reviewIntakeEntries.map((entry) => [entry.intakeId, entry])
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
  assert.equal(
    fixture.phase557ReviewIntakeBoundaryReference.sourceReviewIntakeBoundarySchema,
    "ardyn.phase-5.57.consumer-owned-display-conformance-result-review-intake-boundary-result"
  );

  for (const entry of fixture.reviewPackageEntries) {
    const intake = reviewIntakeById.get(entry.referencedPhase557ReviewIntakeId);

    assert.ok(intake, entry.packageBoundaryId);
    assert.equal(
      entry.referencedPhase550SchemaBoundaryId,
      intake.referencedPhase550SchemaBoundaryId
    );
    assert.equal(
      entry.referencedPhase551FixtureId,
      intake.referencedPhase551FixtureId
    );
    assert.equal(
      entry.referencedPhase551FixtureGroup,
      intake.referencedPhase551FixtureGroup
    );
    assert.equal(
      entry.referencedPhase552ConformanceHandoffId,
      intake.referencedPhase552ConformanceHandoffId
    );
    assert.equal(
      entry.referencedPhase553RunnerRequirementId,
      intake.referencedPhase553RunnerRequirementId
    );
    assert.equal(
      entry.referencedPhase554TestPlanId,
      intake.referencedPhase554TestPlanId
    );
    assert.equal(
      entry.referencedPhase555ResultSchemaId,
      intake.referencedPhase555ResultSchemaId
    );
    assert.equal(
      entry.referencedPhase556ResultHandoffId,
      intake.referencedPhase556ResultHandoffId
    );
    assert.equal(entry.consumerName, intake.consumerName);
    assert.equal(entry.displaySurfaceId, intake.displaySurfaceId);
    assert.equal(entry.sourceArdynArtifactType, intake.sourceArdynArtifactType);
  }
});

test("Phase 5.58 invalid review-package cases fail closed without authorization", () => {
  const missingIntakeId = reviewPackageEntryPatch({});
  delete missingIntakeId[0].packageBoundaryId;

  const cases = [
    [
      "malformed-consumer-owned-display-conformance-result-review-package-boundary-input-rejected",
      createConsumerOwnedDisplayConformanceResultReviewPackageBoundaryForReview(null)
    ],
    [
      "malformed-consumer-owned-display-conformance-result-review-package-boundary-input-rejected",
      createConsumerOwnedDisplayConformanceResultReviewPackageBoundaryForReview({
        reviewedAt: "2026-06-21"
      })
    ],
    [
      "malformed-consumer-owned-display-conformance-result-review-package-boundary-input-rejected",
      createConsumerOwnedDisplayConformanceResultReviewPackageBoundaryForReview({
        reviewedAt,
        reviewPackageEntries: {}
      })
    ],
    [
      "missing-required-consumer-owned-display-conformance-result-review-package-boundary-entry-rejected",
      createConsumerOwnedDisplayConformanceResultReviewPackageBoundaryForReview({
        reviewedAt,
        reviewPackageEntries: missingIntakeId
      })
    ],
    [
      "unknown-consumer-name-consumer-owned-display-conformance-result-review-package-boundary-input-rejected",
      createConsumerOwnedDisplayConformanceResultReviewPackageBoundaryForReview({
        reviewedAt,
        reviewPackageEntries: reviewPackageEntryPatch({
          consumerName: "content-fabric"
        })
      })
    ],
    [
      "unknown-review-package-intent-consumer-owned-display-conformance-result-review-package-boundary-input-rejected",
      createConsumerOwnedDisplayConformanceResultReviewPackageBoundaryForReview({
        reviewedAt,
        reviewPackageEntries: reviewPackageEntryPatch({
          reviewPackageIntent: "metadata_plus_result_validator"
        })
      })
    ],
    [
      "interactive-actionable-intent-consumer-owned-display-conformance-result-review-package-boundary-input-rejected",
      createConsumerOwnedDisplayConformanceResultReviewPackageBoundaryForReview({
        reviewedAt,
        reviewPackageEntries: reviewPackageEntryPatch({
          reviewPackageIntent: "result_validator"
        })
      })
    ],
    [
      "authorization-flags-enabled-consumer-owned-display-conformance-result-review-package-boundary-input-rejected",
      createConsumerOwnedDisplayConformanceResultReviewPackageBoundaryForReview({
        reviewedAt,
        reviewPackageEntries: reviewPackageEntryPatch({
          explicitBlockedAuthorizationFlags: { runtimeAuthorized: true }
        })
      })
    ],
    [
      "authorization-flags-enabled-consumer-owned-display-conformance-result-review-package-boundary-input-rejected",
      createConsumerOwnedDisplayConformanceResultReviewPackageBoundaryForReview({
        reviewedAt,
        explicitBlockedAuthorizationFlags: { runtimeAuthorized: true }
      })
    ],
    [
      "unsafe-package-import-export-persistence-runner-result-producer-result-collector-validator-review-router-evaluator-approval-test-harness-runtime-flags-consumer-owned-display-conformance-result-review-package-boundary-input-rejected",
      createConsumerOwnedDisplayConformanceResultReviewPackageBoundaryForReview({
        reviewedAt,
        reviewPackageEntries: reviewPackageEntryPatch({
          unsafePackageImportExportPersistenceRunnerResultProducerResultCollectorValidatorReviewRouterEvaluatorApprovalTestHarnessRuntimeFlags:
            {
              packageWriterEnabled: true
            }
        })
      })
    ],
    [
      "nested-unsafe-flags-consumer-owned-display-conformance-result-review-package-boundary-input-rejected",
      createConsumerOwnedDisplayConformanceResultReviewPackageBoundaryForReview({
        reviewedAt,
        reviewPackageEntries: reviewPackageEntryPatch({
          nested: { reviewRouter: { approvalGrantProduced: true } }
        })
      })
    ],
    [
      "hidden-package-import-export-persistence-runner-result-producer-result-collector-validator-review-router-evaluator-approval-test-harness-runtime-semantics-consumer-owned-display-conformance-result-review-package-boundary-input-rejected",
      createConsumerOwnedDisplayConformanceResultReviewPackageBoundaryForReview({
        reviewedAt,
        reviewPackageEntries: reviewPackageEntryPatch({
          packageSemantics: {
            hiddenPackageWriterSemanticsEnabled: true
          }
        })
      })
    ],
    [
      "unsafe-package-import-export-persistence-runner-result-producer-result-collector-validator-review-router-evaluator-approval-test-harness-runtime-flags-consumer-owned-display-conformance-result-review-package-boundary-input-rejected",
      createConsumerOwnedDisplayConformanceResultReviewPackageBoundaryForReview({
        reviewedAt,
        unsafePackageImportExportPersistenceRunnerResultProducerResultCollectorValidatorReviewRouterEvaluatorApprovalTestHarnessRuntimeFlags:
          {
            packagePersistenceEnabled: true
          }
      })
    ],
    [
      "hidden-package-import-export-persistence-runner-result-producer-result-collector-validator-review-router-evaluator-approval-test-harness-runtime-semantics-consumer-owned-display-conformance-result-review-package-boundary-input-rejected",
      createConsumerOwnedDisplayConformanceResultReviewPackageBoundaryForReview({
        reviewedAt,
        hiddenResultReviewPackageSemanticsEnabled: true
      })
    ],
    [
      "secure-drop-implementation-semantics-consumer-owned-display-conformance-result-review-package-boundary-input-rejected",
      createConsumerOwnedDisplayConformanceResultReviewPackageBoundaryForReview({
        reviewedAt,
        reviewPackageEntries: reviewPackageEntryPatch({
          secureDrop: { secureDropCryptoImplemented: true }
        })
      })
    ],
    [
      "secure-drop-implementation-semantics-consumer-owned-display-conformance-result-review-package-boundary-input-rejected",
      createConsumerOwnedDisplayConformanceResultReviewPackageBoundaryForReview({
        reviewedAt,
        secureDrop: { secureDropCryptoImplemented: true }
      })
    ],
    [
      "websocket-http-fabric-mcp-task-execution-semantics-consumer-owned-display-conformance-result-review-package-boundary-input-rejected",
      createConsumerOwnedDisplayConformanceResultReviewPackageBoundaryForReview({
        reviewedAt,
        reviewPackageEntries: reviewPackageEntryPatch({
          runtimeSurfaces: { mcpToolExposureEnabled: true }
        })
      })
    ],
    [
      "websocket-http-fabric-mcp-task-execution-semantics-consumer-owned-display-conformance-result-review-package-boundary-input-rejected",
      createConsumerOwnedDisplayConformanceResultReviewPackageBoundaryForReview({
        reviewedAt,
        runtimeSurfaces: { mcpToolExposureEnabled: true }
      })
    ],
    [
      "package-import-export-persistence-runner-result-producer-result-collector-validator-review-router-evaluator-approval-test-harness-implementation-semantics-consumer-owned-display-conformance-result-review-package-boundary-input-rejected",
      createConsumerOwnedDisplayConformanceResultReviewPackageBoundaryForReview({
        reviewedAt,
        reviewPackageEntries: reviewPackageEntryPatch({
          packageWriterImplemented: true
        })
      })
    ],
    [
      "unknown-reference-consumer-owned-display-conformance-result-review-package-boundary-input-rejected",
      createConsumerOwnedDisplayConformanceResultReviewPackageBoundaryForReview({
        reviewedAt,
        reviewPackageEntries: reviewPackageEntryPatch({
          referencedPhase557ReviewIntakeId:
            "phase5-57.unknown.consumer-display-conformance.result-review-intake"
        })
      })
    ],
    [
      "noncanonical-consumer-owned-display-conformance-result-review-package-boundary-input-rejected",
      createConsumerOwnedDisplayConformanceResultReviewPackageBoundaryForReview({
        reviewedAt,
        reviewPackageEntries: []
      })
    ],
    [
      "noncanonical-consumer-owned-display-conformance-result-review-package-boundary-input-rejected",
      createConsumerOwnedDisplayConformanceResultReviewPackageBoundaryForReview({
        reviewedAt,
        reviewPackageEntries: reviewPackageEntryPatch({
          packageBoundaryId: "phase5-58.locus.noncanonical.result-review-package"
        })
      })
    ],
    [
      "valid-consumer-owned-display-conformance-result-review-package-boundary",
      createConsumerOwnedDisplayConformanceResultReviewPackageBoundaryForReview({
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

test("Phase 5.58 covers consumers, ordering, accessibility, and package fields", async () => {
  const fixture = await readFixture();
  const entries = new Map(
    fixture.reviewPackageEntries.map((entry) => [entry.packageBoundaryId, entry])
  );

  assert.deepEqual(
    fixture.reviewPackageEntries.map((entry) => entry.packageBoundaryId),
    expectedPackageBoundaryIds
  );
  assert.deepEqual(fixture.reviewPackageSummary.consumerNames, [
    "Locus",
    "Multiverse"
  ]);
  assert.equal(
    entries.get(
      "phase5-58.locus.accessibility-wcag-display-expectation.result-review-package"
    ).consumerName,
    "Locus"
  );
  assert.equal(
    entries.get(
      "phase5-58.multiverse.registry-websocket-mcp-task-blocked-indicator-conformance.result-review-package"
    ).consumerName,
    "Multiverse"
  );

  for (const entry of fixture.reviewPackageEntries) {
    assert.ok(["Locus", "Multiverse"].includes(entry.consumerName));
    assert.match(entry.packageBoundaryId, /^phase5-58\./);
    assert.match(entry.referencedPhase550SchemaBoundaryId, /^phase5-50\./);
    assert.match(entry.referencedPhase551FixtureId, /^phase5-51\./);
    assert.match(entry.referencedPhase552ConformanceHandoffId, /^phase5-52\./);
    assert.match(entry.referencedPhase553RunnerRequirementId, /^phase5-53\./);
    assert.match(entry.referencedPhase554TestPlanId, /^phase5-54\./);
    assert.match(entry.referencedPhase555ResultSchemaId, /^phase5-55\./);
    assert.match(entry.referencedPhase556ResultHandoffId, /^phase5-56\./);
    assert.match(entry.referencedPhase557ReviewIntakeId, /^phase5-57\./);
    assert.equal(entry.reviewPackageIntent, "metadata_only");
    assert.equal(entry.consumerTargetOnly, true);
    assert.equal(entry.reviewPackageCandidateMetadataOnly, true);
    assert.equal(entry.packageProducedByArdyn, false);
    assert.equal(entry.packageExportImplemented, false);
    assert.equal(entry.packageImportImplemented, false);
    assert.equal(entry.packageWriterImplemented, false);
    assert.equal(entry.packageReaderImplemented, false);
    assert.equal(entry.packagePersistenceImplemented, false);
    assert.equal(entry.packageDiscoveryImplemented, false);
    assert.equal(entry.packageDistributionImplemented, false);
    assert.equal(entry.runnerImplementedByArdyn, false);
    assert.equal(entry.resultProducerImplementedByArdyn, false);
    assert.equal(entry.resultCollectorImplementedByArdyn, false);
    assert.equal(entry.resultValidatorImplementedByArdyn, false);
    assert.equal(entry.reviewRouterImplementedByArdyn, false);
    assert.equal(entry.evaluatorImplementedByArdyn, false);
    assert.equal(entry.approvalPathImplementedByArdyn, false);
    assert.equal(entry.approvalDecisionProducedByArdyn, false);
    assert.equal(entry.approvalGrantProducedByArdyn, false);
    assert.equal(entry.testHarnessImplementedByArdyn, false);
    assert.equal(entry.importExportCommandImplemented, false);
    assert.equal(entry.browserRenderingHarnessImplemented, false);
    assert.equal(entry.consumerSideCiImplemented, false);
    assert.equal(entry.fixtureDiscoveryRuntimeImplemented, false);
    assert.equal(entry.consumerRepoModifiedByArdyn, false);
    assert.equal(entry.nonAuthorizingProof, true);
    assert.ok(entry.allowedFutureReviewPackageFields.includes("packageBoundaryId"));
    assert.ok(entry.allowedFutureReviewPackageFields.includes("blockedRuntimeProof"));
    assert.ok(
      entry.forbiddenCurrentArdynBehavior.includes("validate conformance results")
    );
    assert.ok(
      entry.forbiddenCurrentArdynBehavior.includes("write review packages")
    );
    assert.ok(
      entry.forbiddenCurrentArdynBehavior.includes("persist review packages")
    );
    assert.equal(
      entry.deterministicOrderingHashExpectations.deterministicPackageBoundaryIdsRequired,
      true
    );
    assert.equal(
      entry.deterministicOrderingHashExpectations.hashDoesNotAuthorizeRuntime,
      true
    );
    assert.equal(
      entry.accessibilityWcagPackageNotes
        .resultReviewPackageMustRemainReadableWithoutColorOrMotion,
      true
    );
    assert.equal(
      entry.accessibilityWcagPackageNotes
        .resultReviewPackageMustNotExposeHiddenActionSemantics,
      true
    );
    assert.match(
      entry.requiredFutureContractBeforePackageProductionImportExportValidationRoutingPersistenceEvaluationApprovalOrCi,
      /separate .*consumer-owned executable package contract/
    );
    assertAllFalse(entry.explicitBlockedAuthorizationFlags);
    assertAllFalse(
      entry
        .unsafePackageImportExportPersistenceRunnerResultProducerResultCollectorValidatorReviewRouterEvaluatorApprovalTestHarnessRuntimeFlags
    );
    assertAllFalse(entry.runtimeEffect);
  }
});

test("Phase 5.58 review package stays non-authorizing and runtime-blocked", async () => {
  const fixture = await readFixture();
  const summary = fixture.reviewPackageSummary;

  assert.equal(summary.referencesPhase550SchemaBoundary, true);
  assert.equal(summary.referencesPhase551ExamplePack, true);
  assert.equal(summary.referencesPhase552ConformanceHandoff, true);
  assert.equal(summary.referencesPhase553RunnerRequirements, true);
  assert.equal(summary.referencesPhase554TestPlan, true);
  assert.equal(summary.referencesPhase555ResultSchemaBoundary, true);
  assert.equal(summary.referencesPhase556ResultHandoff, true);
  assert.equal(summary.referencesPhase557ReviewIntakeBoundary, true);
  assert.equal(summary.reviewPackageMeansMetadataOnlyCandidatePackageShape, true);
  assert.equal(summary.locusAndMultiverseConsumerTargetsOnly, true);
  assert.equal(summary.packageProducedByArdyn, false);
  assert.equal(summary.packageExportImplemented, false);
  assert.equal(summary.packageImportImplemented, false);
  assert.equal(summary.packageWriterImplemented, false);
  assert.equal(summary.packageReaderImplemented, false);
  assert.equal(summary.packagePersistenceImplemented, false);
  assert.equal(summary.packageDiscoveryImplemented, false);
  assert.equal(summary.packageDistributionImplemented, false);
  assert.equal(summary.runnerImplementedByArdyn, false);
  assert.equal(summary.resultProducerImplementedByArdyn, false);
  assert.equal(summary.resultCollectorImplementedByArdyn, false);
  assert.equal(summary.resultValidatorImplementedByArdyn, false);
  assert.equal(summary.reviewRouterImplementedByArdyn, false);
  assert.equal(summary.evaluatorImplementedByArdyn, false);
  assert.equal(summary.approvalDecisionProducedByArdyn, false);
  assert.equal(summary.approvalGrantProducedByArdyn, false);
  assert.equal(summary.testHarnessImplementedByArdyn, false);
  assert.equal(summary.importExportCommandImplemented, false);
  assert.equal(summary.consumerSideCiImplemented, false);
  assert.equal(summary.validationImplementsPackageExport, false);
  assert.equal(summary.validationImplementsPackageImport, false);
  assert.equal(summary.validationImplementsPackageWriter, false);
  assert.equal(summary.validationImplementsPackageReader, false);
  assert.equal(summary.validationImplementsPackagePersistence, false);
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
    fixture.invalidReviewPackageCasePolicy.referencesPhase556ResultHandoffRequired,
    true
  );
  assert.equal(
    fixture.invalidReviewPackageCasePolicy.referencesPhase557ReviewIntakeBoundaryRequired,
    true
  );
  assert.equal(
    fixture.invalidReviewPackageCasePolicy.validationImplementsPackageWriter,
    false
  );
  assert.equal(fixture.invalidReviewPackageCasePolicy.validationImplementsResultValidator, false);
  assert.equal(fixture.invalidReviewPackageCasePolicy.validationImplementsReviewRouter, false);
  assert.equal(fixture.invalidReviewPackageCasePolicy.validationImplementsEvaluator, false);
  assert.equal(
    fixture.invalidReviewPackageCasePolicy.validationImplementsApprovalGrant,
    false
  );
  assertNonAuthorizing(fixture);
  assertNonAuthorizing(
    fixture.consumerOwnedDisplayConformanceResultReviewPackageBoundary
  );
  assert.deepEqual(fixture.rejectionReasons, [
    "consumer_owned_display_conformance_result_review_package_boundary_is_review_only",
    "review_package_entries_are_metadata_only_candidate_package_shapes",
    "references_phase_5_50_schema_boundary",
    "references_phase_5_51_example_pack",
    "references_phase_5_52_conformance_handoff",
    "references_phase_5_53_runner_requirements",
    "references_phase_5_54_test_plan",
    "references_phase_5_55_result_schema_boundary",
    "references_phase_5_56_result_handoff",
    "references_phase_5_57_review_intake_boundary",
    "ardyn_does_not_implement_package_export_import_writer_reader_persistence_runner_result_producer_result_collector_result_validator_review_router_evaluator_approval_test_harness_import_export_ci_ui_browser_rendering_or_consumer_repo_changes",
    "runtime_command_db_storage_secrets_connector_fabric_websocket_http_mcp_task_secure_drop_service_discovery_schedule_filesystem_process_authorizations_false",
    "unsafe_package_import_export_persistence_runner_result_producer_result_collector_validator_review_router_evaluator_approval_test_harness_runtime_flags_fail_closed",
    "fallow_runtime_not_used",
    "runtime_enablement_still_blocked"
  ]);
  assert.ok(
    fixture.topDisplayConformanceResultReviewPackageGaps.some((gap) =>
      gap.includes("no Locus or Multiverse consumer-owned review package producer")
    )
  );
  assert.equal(
    fixture.recommendedNextPhase,
    "phase-5.59-review-only-api-backend-contract-boundary-map"
  );
});

test("serve-runtime remains default-blocked and dry-run cannot bypass Phase 5.58", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-58-runtime-"));

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

test("Phase 5.58 runner/result/import/export/validator/router/evaluator/approval command names remain rejected", async () => {
  for (const command of commandProbes) {
    const failure = await expectCliFailure([command]);

    assert.notEqual(failure.code, 0);
    assert.equal(failure.stdout, "");
    assert.match(failure.stderr, /unknown command|Usage: ardyn/i);
  }
});

test("Phase 5.58 does not change CLI, Rust, Fabric, package, or consumer source", async () => {
  await execFileAsync(
    "git",
    [
      "diff",
      "--exit-code",
      phase558BaselineCommit,
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
    /consumer-owned-display-conformance-result-review-package-boundary/
  );
  assert.doesNotMatch(currentCliSource, /consumer-display-conformance-result-review-package/);
  assert.doesNotMatch(currentCliSource, /consumer-display-conformance-result-package-importer/);
  assert.doesNotMatch(currentCliSource, /consumer-display-conformance-result-package-exporter/);
  assert.doesNotMatch(currentCliSource, /consumer-display-conformance-result-package-writer/);
  assert.doesNotMatch(currentCliSource, /consumer-display-conformance-result-package-reader/);
  assert.doesNotMatch(currentCliSource, /consumer-display-conformance-result-package-persistence/);
  assert.doesNotMatch(currentCliSource, /consumer-display-conformance-result-validator/);
  assert.doesNotMatch(currentCliSource, /consumer-display-conformance-review-router/);
  assert.doesNotMatch(currentCliSource, /consumer-display-conformance-evaluator/);
  assert.doesNotMatch(currentCliSource, /consumer-display-conformance-approval/);
  assert.doesNotMatch(currentCliSource, /display-fixture-test-harness/);
  assert.doesNotMatch(currentCliSource, /consumer-side-ci-test-runner/);
  assert.doesNotMatch(currentCliSource, /browser-wcag-automation/);
  assert.doesNotMatch(currentCliSource, /phase-5-58/);
});
