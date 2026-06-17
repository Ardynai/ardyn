import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readFile, readdir, rm, mkdtemp } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";
import {
  REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_SCHEMA,
  createReviewOnlyHandoffMetadataConsolidationLayerForReview
} from "../packages/core/src/index.mjs";

const execFileAsync = promisify(execFile);
const phase542BaselineCommit = "22a49d4691dd7da3ecb696790dac5e7204263c70";
const reviewedAt = "2026-06-17T00:00:00.000Z";
const repoRootUrl = new URL("../", import.meta.url);
const repoRoot = fileURLToPath(repoRootUrl);
const cliSourceUrl = new URL("../apps/cli/src/index.mjs", import.meta.url);
const cliPath = fileURLToPath(cliSourceUrl);
const rustLibSourceUrl = new URL("../crates/ardyn-host/src/lib.rs", import.meta.url);
const rustStdioSourceUrl = new URL(
  "../crates/ardyn-host/src/stdio_runtime/mod.rs",
  import.meta.url
);
const phase541FixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-41/review-only-metadata-handoff-checkpoint.json",
  import.meta.url
);
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-42/review-only-handoff-metadata-consolidation-layer.json",
  import.meta.url
);
const phase541Fixture = JSON.parse(
  readFileSync(fileURLToPath(phase541FixtureUrl), "utf8")
);

const expectedTopLevelKeys = Object.freeze([
  "schema",
  "schemaVersion",
  "phase",
  "handoffMetadataConsolidationLayerKind",
  "metadataGeneratedAt",
  "sourcePhase",
  "handoffMetadataConsolidationSummary",
  "handoffMetadataConsolidationInputShape",
  "handoffMetadataConsolidationResultShape",
  "handoffMetadataConsolidationCases",
  "nestedSourceRegressionCases",
  "handoffMetadataConsolidationLayer",
  "cleanupHardeningToolkitEvidence",
  "blockedRuntimeEffect",
  "serveRuntimeBlockedBehavior",
  "forbiddenBehavior",
  "filesAllowedToChange",
  "filesForbiddenToChange",
  "validationCommands",
  "optionalAdvisoryCommands"
]);

const expectedCaseIds = Object.freeze([
  "missing-review-only-handoff-metadata-consolidation-layer-input-rejected",
  "malformed-review-only-handoff-metadata-consolidation-layer-input-rejected",
  "malformed-review-only-handoff-metadata-consolidation-layer-invalid-reviewed-at-rejected",
  "empty-review-only-handoff-metadata-consolidation-layer-input-rejected",
  "conflicting-review-only-handoff-metadata-consolidation-layer-input-rejected",
  "stale-review-only-handoff-metadata-consolidation-layer-input-rejected",
  "revoked-review-only-handoff-metadata-consolidation-layer-input-rejected",
  "unknown-review-only-handoff-metadata-consolidation-layer-input-rejected",
  "duplicate-invalid-review-only-handoff-metadata-consolidation-layer-input-rejected",
  "authorizing-looking-review-only-handoff-metadata-consolidation-layer-input-rejected",
  "grant-looking-review-only-handoff-metadata-consolidation-layer-input-rejected",
  "approval-decision-looking-review-only-handoff-metadata-consolidation-layer-input-rejected",
  "approval-grant-looking-review-only-handoff-metadata-consolidation-layer-input-rejected",
  "evaluator-result-looking-review-only-handoff-metadata-consolidation-layer-input-rejected",
  "evaluator-execution-looking-review-only-handoff-metadata-consolidation-layer-input-rejected",
  "reviewer-routing-looking-review-only-handoff-metadata-consolidation-layer-input-rejected",
  "reviewer-assignment-looking-review-only-handoff-metadata-consolidation-layer-input-rejected",
  "runtime-permission-looking-review-only-handoff-metadata-consolidation-layer-input-rejected",
  "command-exposure-looking-review-only-handoff-metadata-consolidation-layer-input-rejected",
  "runtime-effect-true-review-only-handoff-metadata-consolidation-layer-input-rejected",
  "process-flag-true-review-only-handoff-metadata-consolidation-layer-input-rejected",
  "unsafe-top-level-review-only-handoff-metadata-consolidation-layer-input-rejected",
  "unsafe-nested-handoff-checkpoint-consolidation-metadata-review-only-handoff-metadata-consolidation-layer-input-rejected",
  "execution-signal-looking-review-only-handoff-metadata-consolidation-layer-input-rejected",
  "valid-review-only-handoff-metadata-consolidation-layer"
]);

const expectedClassifications = Object.freeze({
  "missing-review-only-handoff-metadata-consolidation-layer-input-rejected":
    "missing_review_only_handoff_metadata_consolidation_layer_input_rejected",
  "malformed-review-only-handoff-metadata-consolidation-layer-input-rejected":
    "malformed_review_only_handoff_metadata_consolidation_layer_input_rejected",
  "malformed-review-only-handoff-metadata-consolidation-layer-invalid-reviewed-at-rejected":
    "malformed_review_only_handoff_metadata_consolidation_layer_input_rejected",
  "empty-review-only-handoff-metadata-consolidation-layer-input-rejected":
    "empty_review_only_handoff_metadata_consolidation_layer_input_rejected",
  "conflicting-review-only-handoff-metadata-consolidation-layer-input-rejected":
    "conflicting_review_only_handoff_metadata_consolidation_layer_input_rejected",
  "stale-review-only-handoff-metadata-consolidation-layer-input-rejected":
    "stale_review_only_handoff_metadata_consolidation_layer_input_rejected",
  "revoked-review-only-handoff-metadata-consolidation-layer-input-rejected":
    "revoked_review_only_handoff_metadata_consolidation_layer_input_rejected",
  "unknown-review-only-handoff-metadata-consolidation-layer-input-rejected":
    "unknown_review_only_handoff_metadata_consolidation_layer_input_rejected",
  "duplicate-invalid-review-only-handoff-metadata-consolidation-layer-input-rejected":
    "duplicate_invalid_review_only_handoff_metadata_consolidation_layer_input_rejected",
  "authorizing-looking-review-only-handoff-metadata-consolidation-layer-input-rejected":
    "authorizing_review_only_handoff_metadata_consolidation_layer_input_rejected",
  "grant-looking-review-only-handoff-metadata-consolidation-layer-input-rejected":
    "grant_looking_review_only_handoff_metadata_consolidation_layer_input_rejected",
  "approval-decision-looking-review-only-handoff-metadata-consolidation-layer-input-rejected":
    "approval_decision_looking_review_only_handoff_metadata_consolidation_layer_input_rejected",
  "approval-grant-looking-review-only-handoff-metadata-consolidation-layer-input-rejected":
    "approval_grant_looking_review_only_handoff_metadata_consolidation_layer_input_rejected",
  "evaluator-result-looking-review-only-handoff-metadata-consolidation-layer-input-rejected":
    "evaluator_result_looking_review_only_handoff_metadata_consolidation_layer_input_rejected",
  "evaluator-execution-looking-review-only-handoff-metadata-consolidation-layer-input-rejected":
    "evaluator_execution_looking_review_only_handoff_metadata_consolidation_layer_input_rejected",
  "reviewer-routing-looking-review-only-handoff-metadata-consolidation-layer-input-rejected":
    "reviewer_routing_looking_review_only_handoff_metadata_consolidation_layer_input_rejected",
  "reviewer-assignment-looking-review-only-handoff-metadata-consolidation-layer-input-rejected":
    "reviewer_assignment_looking_review_only_handoff_metadata_consolidation_layer_input_rejected",
  "runtime-permission-looking-review-only-handoff-metadata-consolidation-layer-input-rejected":
    "runtime_permission_looking_review_only_handoff_metadata_consolidation_layer_input_rejected",
  "command-exposure-looking-review-only-handoff-metadata-consolidation-layer-input-rejected":
    "command_exposure_looking_review_only_handoff_metadata_consolidation_layer_input_rejected",
  "runtime-effect-true-review-only-handoff-metadata-consolidation-layer-input-rejected":
    "runtime_effect_true_review_only_handoff_metadata_consolidation_layer_input_rejected",
  "process-flag-true-review-only-handoff-metadata-consolidation-layer-input-rejected":
    "process_flag_true_review_only_handoff_metadata_consolidation_layer_input_rejected",
  "unsafe-top-level-review-only-handoff-metadata-consolidation-layer-input-rejected":
    "unsafe_review_only_handoff_metadata_consolidation_layer_input_rejected",
  "unsafe-nested-handoff-checkpoint-consolidation-metadata-review-only-handoff-metadata-consolidation-layer-input-rejected":
    "unsafe_review_only_handoff_metadata_consolidation_layer_input_rejected",
  "execution-signal-looking-review-only-handoff-metadata-consolidation-layer-input-rejected":
    "execution_signal_looking_review_only_handoff_metadata_consolidation_layer_input_rejected",
  "valid-review-only-handoff-metadata-consolidation-layer":
    "valid_review_only_handoff_metadata_consolidation_layer_runtime_still_blocked"
});

const consolidationCommandProbes = Object.freeze([
  "review-only-handoff-metadata-consolidation-layer",
  "create-review-only-handoff-metadata-consolidation-layer",
  "handoff-metadata-consolidation-layer",
  "phase-5-42-review-only-handoff-metadata-consolidation-layer",
  "reviewer-routing",
  "reviewer-assignment"
]);

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function validCheckpoint() {
  return clone(phase541Fixture.metadataHandoffCheckpoint);
}

function checkpointWith(overrides = {}) {
  return {
    ...validCheckpoint(),
    ...overrides
  };
}

function checkpointWithNested(objectKey, nestedKey, nestedValue = true) {
  const checkpoint = validCheckpoint();
  checkpoint[objectKey] = {
    ...checkpoint[objectKey],
    [nestedKey]: nestedValue
  };
  return checkpoint;
}

function checkpointWithSourceLayer(nestedKey, nestedValue = true) {
  const checkpoint = validCheckpoint();
  checkpoint.sourceCheckpointHandoffLayer = {
    ...checkpoint.sourceCheckpointHandoffLayer,
    [nestedKey]: nestedValue
  };
  return checkpoint;
}

function createResult(entries, options = {}) {
  return createReviewOnlyHandoffMetadataConsolidationLayerForReview({
    reviewedAt,
    metadataHandoffCheckpointEntries: entries,
    ...options
  });
}

function caseSummary(caseId, result) {
  return {
    caseId,
    classification: result.classification,
    reviewOnly: result.reviewOnly,
    authoritative: result.authoritative,
    reviewArtifactOnly: result.reviewArtifactOnly,
    handoffMetadataConsolidationLayerProduced:
      result.handoffMetadataConsolidationLayerProduced,
    handoffMetadataConsolidationLayerIsReviewerRouting:
      result.handoffMetadataConsolidationLayerIsReviewerRouting,
    handoffMetadataConsolidationLayerIsReviewerAssignment:
      result.handoffMetadataConsolidationLayerIsReviewerAssignment,
    handoffMetadataConsolidationLayerIsEvaluatorExecution:
      result.handoffMetadataConsolidationLayerIsEvaluatorExecution,
    handoffMetadataConsolidationLayerIsEvaluatorResult:
      result.handoffMetadataConsolidationLayerIsEvaluatorResult,
    handoffMetadataConsolidationLayerIsApprovalDecision:
      result.handoffMetadataConsolidationLayerIsApprovalDecision,
    handoffMetadataConsolidationLayerIsApprovalGrant:
      result.handoffMetadataConsolidationLayerIsApprovalGrant,
    reviewerRoutingPerformed: result.reviewerRoutingPerformed,
    reviewerAssignmentPerformed: result.reviewerAssignmentPerformed,
    evaluatorResultProduced: result.evaluatorResultProduced,
    evaluatorResultPersisted: result.evaluatorResultPersisted,
    approvalDecisionProduced: result.approvalDecisionProduced,
    approvalDecisionPersisted: result.approvalDecisionPersisted,
    approvalGrant: result.approvalGrant,
    approvalGrantProduced: result.approvalGrantProduced,
    approvalGrantPersisted: result.approvalGrantPersisted,
    runtimePermissionGranted: result.runtimePermissionGranted,
    commandExposurePermissionGranted: result.commandExposurePermissionGranted,
    runtimeCommandExposureEnabled: result.runtimeCommandExposureEnabled,
    runtimeExecutionEnabled: result.runtimeExecutionEnabled,
    evaluatorExecuted: result.evaluatorExecuted,
    runtimeEffect: result.runtimeEffect
  };
}

function handoffMetadataConsolidationCases() {
  const conflicting = checkpointWith({ reviewedAt: "2026-06-17T00:00:01.000Z" });
  return [
    [
      "missing-review-only-handoff-metadata-consolidation-layer-input-rejected",
      createReviewOnlyHandoffMetadataConsolidationLayerForReview({ reviewedAt })
    ],
    [
      "malformed-review-only-handoff-metadata-consolidation-layer-input-rejected",
      createReviewOnlyHandoffMetadataConsolidationLayerForReview(null)
    ],
    [
      "malformed-review-only-handoff-metadata-consolidation-layer-invalid-reviewed-at-rejected",
      createReviewOnlyHandoffMetadataConsolidationLayerForReview({
        reviewedAt: "not-a-date",
        metadataHandoffCheckpointEntries: [validCheckpoint()]
      })
    ],
    ["empty-review-only-handoff-metadata-consolidation-layer-input-rejected", createResult([])],
    [
      "conflicting-review-only-handoff-metadata-consolidation-layer-input-rejected",
      createResult([validCheckpoint(), conflicting])
    ],
    [
      "stale-review-only-handoff-metadata-consolidation-layer-input-rejected",
      createResult([checkpointWith({ reviewedAt: "2026-06-16T23:59:59.000Z" })])
    ],
    [
      "revoked-review-only-handoff-metadata-consolidation-layer-input-rejected",
      createResult([checkpointWith({ status: "revoked" })])
    ],
    [
      "unknown-review-only-handoff-metadata-consolidation-layer-input-rejected",
      createResult([checkpointWith({ status: "unknown" })])
    ],
    [
      "duplicate-invalid-review-only-handoff-metadata-consolidation-layer-input-rejected",
      createResult([validCheckpoint(), validCheckpoint()])
    ],
    [
      "authorizing-looking-review-only-handoff-metadata-consolidation-layer-input-rejected",
      createResult([
        checkpointWithNested("metadataHandoffCheckpointSummary", "canGrantRuntime")
      ])
    ],
    [
      "grant-looking-review-only-handoff-metadata-consolidation-layer-input-rejected",
      createResult([checkpointWithNested("metadataHandoffCheckpointSummary", "grant")])
    ],
    [
      "approval-decision-looking-review-only-handoff-metadata-consolidation-layer-input-rejected",
      createResult([checkpointWith({ approvalDecisionProduced: true })])
    ],
    [
      "approval-grant-looking-review-only-handoff-metadata-consolidation-layer-input-rejected",
      createResult([checkpointWith({ approvalGrantProduced: true })])
    ],
    [
      "evaluator-result-looking-review-only-handoff-metadata-consolidation-layer-input-rejected",
      createResult([checkpointWith({ evaluatorResultProduced: true })])
    ],
    [
      "evaluator-execution-looking-review-only-handoff-metadata-consolidation-layer-input-rejected",
      createResult([checkpointWith({ evaluatorExecuted: true })])
    ],
    [
      "reviewer-routing-looking-review-only-handoff-metadata-consolidation-layer-input-rejected",
      createResult([checkpointWith({ reviewerRoutingEnabled: true })])
    ],
    [
      "reviewer-assignment-looking-review-only-handoff-metadata-consolidation-layer-input-rejected",
      createResult([checkpointWith({ reviewerAssignmentEnabled: true })])
    ],
    [
      "runtime-permission-looking-review-only-handoff-metadata-consolidation-layer-input-rejected",
      createResult([checkpointWith({ runtimePermissionGranted: true })])
    ],
    [
      "command-exposure-looking-review-only-handoff-metadata-consolidation-layer-input-rejected",
      createResult([checkpointWith({ commandExposurePermissionGranted: true })])
    ],
    [
      "runtime-effect-true-review-only-handoff-metadata-consolidation-layer-input-rejected",
      createResult([
        checkpointWith({
          runtimeEffect: {
            ...validCheckpoint().runtimeEffect,
            runtimeEnabled: true
          }
        })
      ])
    ],
    [
      "process-flag-true-review-only-handoff-metadata-consolidation-layer-input-rejected",
      createResult([
        checkpointWithNested("metadataHandoffCheckpointSummary", "processSpawned")
      ])
    ],
    [
      "unsafe-top-level-review-only-handoff-metadata-consolidation-layer-input-rejected",
      createResult([checkpointWith({ handoffMetadataConsolidationLayer: {} })])
    ],
    [
      "unsafe-nested-handoff-checkpoint-consolidation-metadata-review-only-handoff-metadata-consolidation-layer-input-rejected",
      createResult([
        checkpointWithNested(
          "metadataHandoffCheckpointSummary",
          "consolidationMetadata"
        )
      ])
    ],
    [
      "execution-signal-looking-review-only-handoff-metadata-consolidation-layer-input-rejected",
      createResult([
        checkpointWithNested("metadataHandoffCheckpointSummary", "executionSignal")
      ])
    ],
    [
      "valid-review-only-handoff-metadata-consolidation-layer",
      createResult([validCheckpoint()])
    ]
  ].map(([caseId, result]) => caseSummary(caseId, result));
}

function nestedSourceRegressionCases() {
  const cases = [
    [
      "missing-source-checkpoint-handoff-layer-digest",
      (checkpoint) => {
        delete checkpoint.sourceCheckpointHandoffLayer.stateDigest;
      },
      "malformed_review_only_handoff_metadata_consolidation_layer_input_rejected"
    ],
    [
      "malformed-source-checkpoint-handoff-layer-digest",
      (checkpoint) => {
        checkpoint.sourceCheckpointHandoffLayer.stateDigest = 42;
      },
      "malformed_review_only_handoff_metadata_consolidation_layer_input_rejected"
    ],
    [
      "nested-approval-grant-rejected",
      (checkpoint) => {
        checkpoint.sourceCheckpointHandoffLayer.approvalGrantProduced = true;
      },
      "approval_grant_looking_review_only_handoff_metadata_consolidation_layer_input_rejected"
    ],
    [
      "nested-approval-decision-rejected",
      (checkpoint) => {
        checkpoint.sourceCheckpointHandoffLayer.approvalDecisionProduced = true;
      },
      "approval_decision_looking_review_only_handoff_metadata_consolidation_layer_input_rejected"
    ],
    [
      "nested-reviewer-assignment-rejected",
      (checkpoint) => {
        checkpoint.sourceCheckpointHandoffLayer.reviewerAssignmentPerformed = true;
      },
      "reviewer_assignment_looking_review_only_handoff_metadata_consolidation_layer_input_rejected"
    ],
    [
      "nested-reviewer-routing-rejected",
      (checkpoint) => {
        checkpoint.sourceCheckpointHandoffLayer.reviewerRoutingPerformed = true;
      },
      "reviewer_routing_looking_review_only_handoff_metadata_consolidation_layer_input_rejected"
    ],
    [
      "nested-evaluator-execution-rejected",
      (checkpoint) => {
        checkpoint.sourceCheckpointHandoffLayer.evaluatorExecuted = true;
      },
      "evaluator_execution_looking_review_only_handoff_metadata_consolidation_layer_input_rejected"
    ],
    [
      "nested-evaluator-result-rejected",
      (checkpoint) => {
        checkpoint.sourceCheckpointHandoffLayer.evaluatorResultProduced = true;
      },
      "evaluator_result_looking_review_only_handoff_metadata_consolidation_layer_input_rejected"
    ],
    [
      "nested-runtime-effect-rejected",
      (checkpoint) => {
        checkpoint.sourceCheckpointHandoffLayer.runtimeEffectAllFalse = false;
      },
      "runtime_effect_true_review_only_handoff_metadata_consolidation_layer_input_rejected"
    ],
    [
      "nested-command-exposure-rejected",
      (checkpoint) => {
        checkpoint.sourceCheckpointHandoffLayer.commandExposurePermissionGranted =
          true;
      },
      "command_exposure_looking_review_only_handoff_metadata_consolidation_layer_input_rejected"
    ]
  ];

  return cases.map(([caseId, mutate, expectedClassification]) => {
    const checkpoint = validCheckpoint();
    mutate(checkpoint);
    const result = createResult([checkpoint]);
    return {
      caseId,
      classification: result.classification,
      expectedClassification,
      handoffMetadataConsolidationLayerProduced:
        result.handoffMetadataConsolidationLayerProduced,
      approvalGrantProduced: result.approvalGrantProduced,
      approvalGrantPersisted: result.approvalGrantPersisted,
      runtimeExecutionEnabled: result.runtimeExecutionEnabled,
      commandExposurePermissionGranted: result.commandExposurePermissionGranted,
      runtimeEffect: result.runtimeEffect
    };
  });
}

function expectedFixture() {
  const validResult = createResult([validCheckpoint()]);
  return {
    schema: REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_SCHEMA,
    schemaVersion: "0.1.0",
    phase: "phase-5.42-review-only-handoff-metadata-consolidation-layer",
    handoffMetadataConsolidationLayerKind:
      "review-only-handoff-metadata-consolidation-layer",
    metadataGeneratedAt: reviewedAt,
    sourcePhase: {
      phase: "phase-5.41-review-only-metadata-handoff-checkpoint",
      metadataHandoffCheckpointPath:
        "packages/core/src/index.mjs#createReviewOnlyMetadataHandoffCheckpointForReview",
      handoffMetadataConsolidationLayerPath:
        "packages/core/src/index.mjs#createReviewOnlyHandoffMetadataConsolidationLayerForReview",
      sourceMetadataHandoffCheckpointFixture:
        "tests/fixtures/host-policy/phase5-41/review-only-metadata-handoff-checkpoint.json",
      cleanupHardeningToolkitEvidence: "installed-tools-only-no-installs",
      runtimeEnabled: false,
      reviewerRoutingPerformed: false,
      reviewerAssignmentPerformed: false,
      approvalDecisionProduced: false,
      approvalGrantProduced: false,
      evaluatorExecutionPerformed: false
    },
    handoffMetadataConsolidationSummary: {
      reviewOnlyHandoffMetadataConsolidationLayerRecorded: true,
      handoffMetadataConsolidationLayerKind:
        "review-only-handoff-metadata-consolidation-layer",
      handoffMetadataConsolidationLayerReviewOnly: true,
      handoffMetadataConsolidationLayerAuthoritative: false,
      validMetadataHandoffCheckpointProducesConsolidation: true,
      missingMetadataHandoffCheckpointRejected: true,
      malformedMetadataHandoffCheckpointRejected: true,
      emptyMetadataHandoffCheckpointRejected: true,
      conflictingMetadataHandoffCheckpointRejected: true,
      staleMetadataHandoffCheckpointRejected: true,
      revokedMetadataHandoffCheckpointRejected: true,
      unknownMetadataHandoffCheckpointRejected: true,
      duplicateInvalidMetadataHandoffCheckpointRejected: true,
      authorizingLookingMetadataHandoffCheckpointRejected: true,
      grantLookingMetadataHandoffCheckpointRejected: true,
      approvalDecisionLookingMetadataHandoffCheckpointRejected: true,
      approvalGrantLookingMetadataHandoffCheckpointRejected: true,
      evaluatorResultLookingMetadataHandoffCheckpointRejected: true,
      evaluatorExecutionLookingMetadataHandoffCheckpointRejected: true,
      reviewerRoutingLookingMetadataHandoffCheckpointRejected: true,
      reviewerAssignmentLookingMetadataHandoffCheckpointRejected: true,
      runtimePermissionLookingMetadataHandoffCheckpointRejected: true,
      commandExposureLookingMetadataHandoffCheckpointRejected: true,
      runtimeEffectTrueMetadataHandoffCheckpointRejected: true,
      processFlagTrueMetadataHandoffCheckpointRejected: true,
      unsafeHandoffCheckpointConsolidationMetadataRejected: true,
      executionSignalLookingMetadataHandoffCheckpointRejected: true,
      nestedApprovalGrantRejected: true,
      nestedApprovalDecisionRejected: true,
      nestedReviewerAssignmentRejected: true,
      nestedReviewerRoutingRejected: true,
      nestedEvaluatorExecutionRejected: true,
      nestedEvaluatorResultRejected: true,
      nestedRuntimeEffectRejected: true,
      nestedCommandExposureRejected: true,
      missingOrMalformedSourceDigestRejected: true,
      handoffMetadataConsolidationLayerIsReviewerRouting: false,
      handoffMetadataConsolidationLayerIsReviewerAssignment: false,
      handoffMetadataConsolidationLayerIsEvaluatorExecution: false,
      handoffMetadataConsolidationLayerIsEvaluatorResult: false,
      handoffMetadataConsolidationLayerIsApprovalDecision: false,
      handoffMetadataConsolidationLayerIsApprovalGrant: false,
      reviewerRoutingPerformed: false,
      reviewerAssignmentPerformed: false,
      evaluatorResultProduced: false,
      evaluatorResultPersisted: false,
      approvalDecisionProduced: false,
      approvalDecisionPersisted: false,
      approvalGrantProduced: false,
      approvalGrantPersisted: false,
      runtimePermissionGranted: false,
      commandExposurePermissionGranted: false,
      runtimeEnabled: false,
      runtimeCommandEnabled: false,
      runtimeCommandExposureEnabled: false,
      runtimeExecutionEnabled: false,
      evaluatorExecutionPerformed: false,
      cleanupHardeningToolkitEvidenceOnly: true,
      toolsInstalledByPhase542: false,
      megaLinterRun: false,
      broadTrunkRewriteRun: false,
      fallowRuntimeUsed: false,
      serveRuntimeStillDefaultBlocked: true,
      dryRunBypassesBlock: false,
      canEnableRuntime: false
    },
    handoffMetadataConsolidationInputShape: {
      metadataHandoffCheckpointEntries:
        "exactly one Phase 5.41 review-only metadata handoff checkpoint state",
      metadataHandoffCheckpointSchema:
        "ardyn.phase-5.41.review-only-metadata-handoff-checkpoint-state",
      metadataHandoffCheckpointMode: "review-only",
      validMetadataHandoffCheckpointRequired: true,
      sourceDigestRequired: true,
      authorizingLookingMetadataPolicy: "fail-closed",
      grantLookingMetadataPolicy: "fail-closed",
      reviewerRoutingLookingMetadataPolicy: "fail-closed",
      reviewerAssignmentLookingMetadataPolicy: "fail-closed",
      evaluatorExecutionLookingMetadataPolicy: "fail-closed",
      runtimeEffectTrueMetadataPolicy: "fail-closed",
      processFlagTrueMetadataPolicy: "fail-closed",
      unsafeTopLevelMetadataPolicy: "fail-closed",
      unsafeNestedHandoffCheckpointConsolidationMetadataPolicy: "fail-closed",
      executionSignalLookingMetadataPolicy: "fail-closed",
      filesystemWatcherAllowed: false,
      externalSourceLookupAllowed: false,
      secretsEnvIngestionAllowed: false,
      filePathAllowed: false,
      urlAllowed: false
    },
    handoffMetadataConsolidationResultShape: {
      schema:
        "ardyn.phase-5.42.review-only-handoff-metadata-consolidation-layer-result",
      schemaVersion: "0.1.0",
      handoffMetadataConsolidationLayerKind:
        "review-only-handoff-metadata-consolidation-layer",
      handoffMetadataConsolidationLayerMode: "review-only",
      stateSchema:
        "ardyn.phase-5.42.review-only-handoff-metadata-consolidation-layer-state",
      stateKind: "review-only-handoff-metadata-consolidation-layer-state",
      reviewOnly: true,
      reviewArtifactOnly: true,
      authoritative: false,
      performsReviewerRouting: false,
      assignsReviewers: false,
      executesEvaluator: false,
      producesEvaluatorResult: false,
      producesApprovalDecision: false,
      producesApprovalGrant: false,
      persistsApprovalGrant: false,
      grantsRuntimePermission: false,
      grantsCommandExposurePermission: false,
      enablesRuntimeCommandExposure: false,
      enablesRuntimeExecution: false
    },
    handoffMetadataConsolidationCases: handoffMetadataConsolidationCases(),
    nestedSourceRegressionCases: nestedSourceRegressionCases(),
    handoffMetadataConsolidationLayer:
      validResult.handoffMetadataConsolidationLayer,
    cleanupHardeningToolkitEvidence: validResult.cleanupHardeningToolkitEvidence,
    blockedRuntimeEffect: validResult.runtimeEffect,
    serveRuntimeBlockedBehavior: {
      commandRecognized: true,
      defaultBlocked: true,
      dryRunBlocked: true,
      dryRunBypassesBlock: false,
      stdout: "",
      stderrIncludes: "runtime unavailable",
      exitCode: 1
    },
    forbiddenBehavior: {
      reviewerRoutingPerformed: false,
      reviewerAssignmentPerformed: false,
      evaluatorExecutionPerformed: false,
      evaluatorResultProduced: false,
      approvalDecisionProduced: false,
      approvalGrantProduced: false,
      approvalGrantPersisted: false,
      runtimePermissionGranted: false,
      commandExposurePermissionGranted: false,
      runtimeCommandExposureEnabled: false,
      runtimeExecutionEnabled: false,
      rustHostRuntimeImplemented: false,
      liveRuntimeStarted: false,
      processControlPerformed: false,
      stdinLoopEnabled: false,
      stdoutRuntimeWriterEnabled: false,
      stderrRuntimeWriterEnabled: false,
      transcriptRuntimeWritePerformed: false,
      auditRuntimeWritePerformed: false,
      adapterRuntimeSurfaceEnabled: false,
      fabricRuntimeSurfaceEnabled: false,
      webSocketHttpSurfaceEnabled: false,
      filesystemWatcherEnabled: false,
      externalLookupPerformed: false,
      envSecretsIngested: false
    },
    filesAllowedToChange: [
      "packages/core/src/index.mjs",
      "packages/core/src/index.d.ts",
      "tests/phase5-42-review-only-handoff-metadata-consolidation-layer.test.mjs",
      "tests/fixtures/host-policy/phase5-42/review-only-handoff-metadata-consolidation-layer.json",
      "docs/phase-5-42-review-only-handoff-metadata-consolidation-layer.md",
      "README.md",
      "apps/cli/README.md",
      "crates/ardyn-host/README.md",
      "scripts/report-phase-status.mjs",
      "tests/report-phase-status.test.mjs"
    ],
    filesForbiddenToChange: [
      "apps/cli/src/index.mjs",
      "crates/ardyn-host/src/lib.rs",
      "crates/ardyn-host/src/stdio_runtime/mod.rs",
      "packages/adapters/**",
      "packages/fabric/**",
      ".env",
      ".env.local"
    ],
    validationCommands: [
      "node --test tests/phase5-42-review-only-handoff-metadata-consolidation-layer.test.mjs",
      "node --test tests/report-phase-status.test.mjs",
      "npm test",
      "npm run test:schemas",
      "npm run report:phase-status",
      "cargo test --workspace",
      "cargo check --workspace",
      "cargo fmt --check",
      "cargo clippy --workspace -- -D warnings",
      "npm audit --json",
      "cargo audit",
      "cargo machete",
      "git diff --check",
      "git diff --cached --check",
      "fallow health --score --hotspots --targets --format json",
      "fallow audit --format json"
    ],
    optionalAdvisoryCommands: [
      "knip",
      "depcheck",
      "osv-scanner scan .",
      "trivy fs --scanners vuln,secret,misconfig .",
      "semgrep --config auto ."
    ]
  };
}

function assertAllFalse(record) {
  for (const [field, value] of Object.entries(record)) {
    assert.equal(value, false, field);
  }
}

async function runCliFailure(args, options = {}) {
  try {
    const result = await execFileAsync(process.execPath, [cliPath, ...args], {
      cwd: repoRoot,
      ...options
    });
    return { code: 0, stdout: result.stdout, stderr: result.stderr };
  } catch (error) {
    return {
      code: error.code,
      stdout: error.stdout,
      stderr: error.stderr
    };
  }
}

test("Phase 5.42 handoff metadata consolidation fixture is deterministic metadata", async () => {
  const fixture = JSON.parse(await readFile(fixtureUrl, "utf8"));

  assert.deepEqual(Object.keys(fixture), expectedTopLevelKeys);
  assert.deepEqual(fixture, expectedFixture());
});

test("Phase 5.42 handoff metadata consolidation classifies metadata cases", () => {
  const cases = handoffMetadataConsolidationCases();

  assert.deepEqual(
    cases.map(({ caseId }) => caseId),
    expectedCaseIds
  );
  for (const consolidationCase of cases) {
    assert.equal(
      consolidationCase.classification,
      expectedClassifications[consolidationCase.caseId],
      consolidationCase.caseId
    );
    assert.equal(consolidationCase.reviewOnly, true);
    assert.equal(consolidationCase.authoritative, false);
    assert.equal(consolidationCase.reviewArtifactOnly, true);
    assert.equal(
      consolidationCase.handoffMetadataConsolidationLayerIsReviewerRouting,
      false
    );
    assert.equal(
      consolidationCase.handoffMetadataConsolidationLayerIsReviewerAssignment,
      false
    );
    assert.equal(
      consolidationCase.handoffMetadataConsolidationLayerIsEvaluatorExecution,
      false
    );
    assert.equal(
      consolidationCase.handoffMetadataConsolidationLayerIsEvaluatorResult,
      false
    );
    assert.equal(
      consolidationCase.handoffMetadataConsolidationLayerIsApprovalDecision,
      false
    );
    assert.equal(
      consolidationCase.handoffMetadataConsolidationLayerIsApprovalGrant,
      false
    );
    assert.equal(consolidationCase.approvalGrant.produced, false);
    assert.equal(consolidationCase.approvalGrant.persisted, false);
    assert.equal(consolidationCase.approvalGrant.grantId, null);
    assertAllFalse(consolidationCase.runtimeEffect);
  }
});

test("Phase 5.42 malformed consolidation input fails closed without throwing", () => {
  for (const input of [
    null,
    "bad",
    { reviewedAt: "bad" },
    { reviewedAt, metadataHandoffCheckpointEntries: [null] },
    { reviewedAt, metadataHandoffCheckpointEntries: [undefined] },
    { reviewedAt, metadataHandoffCheckpointEntries: ["bad"] },
    { reviewedAt, metadataHandoffCheckpointEntries: [42] }
  ]) {
    const result = createReviewOnlyHandoffMetadataConsolidationLayerForReview(
      input
    );

    assert.equal(
      result.classification,
      "malformed_review_only_handoff_metadata_consolidation_layer_input_rejected"
    );
    assert.equal(result.handoffMetadataConsolidationLayerProduced, false);
    assert.equal(result.handoffMetadataConsolidationLayer, null);
    assert.equal(result.approvalGrantProduced, false);
    assert.equal(result.runtimeExecutionEnabled, false);
    assertAllFalse(result.runtimeEffect);
  }
});

test("Phase 5.42 valid metadata handoff checkpoint produces only consolidation metadata", () => {
  const result = createResult([validCheckpoint()]);
  const consolidation = result.handoffMetadataConsolidationLayer;

  assert.equal(
    result.classification,
    "valid_review_only_handoff_metadata_consolidation_layer_runtime_still_blocked"
  );
  assert.equal(result.handoffMetadataConsolidationLayerProduced, true);
  assert.equal(
    consolidation.schema,
    "ardyn.phase-5.42.review-only-handoff-metadata-consolidation-layer-state"
  );
  assert.equal(
    consolidation.stateKind,
    "review-only-handoff-metadata-consolidation-layer-state"
  );
  assert.equal(consolidation.stateMode, "review-only");
  assert.equal(consolidation.handoffMetadataConsolidationLayerMetadataOnly, true);
  assert.equal(
    consolidation.sourceMetadataHandoffCheckpoint.metadataHandoffCheckpointMetadataOnly,
    true
  );
  assert.match(
    consolidation.sourceMetadataHandoffCheckpoint.stateDigest,
    /^sha256:[0-9a-f]{64}$/
  );
  assert.match(
    consolidation.sourceMetadataHandoffCheckpoint
      .sourceCheckpointHandoffLayerDigest,
    /^sha256:[0-9a-f]{64}$/
  );
  assert.equal(
    consolidation.handoffMetadataConsolidationLayerIsReviewerRouting,
    false
  );
  assert.equal(
    consolidation.handoffMetadataConsolidationLayerIsReviewerAssignment,
    false
  );
  assert.equal(
    consolidation.handoffMetadataConsolidationLayerIsEvaluatorExecution,
    false
  );
  assert.equal(
    consolidation.handoffMetadataConsolidationLayerIsEvaluatorResult,
    false
  );
  assert.equal(
    consolidation.handoffMetadataConsolidationLayerIsApprovalDecision,
    false
  );
  assert.equal(
    consolidation.handoffMetadataConsolidationLayerIsApprovalGrant,
    false
  );
  assert.equal(consolidation.reviewerRoutingPerformed, false);
  assert.equal(consolidation.reviewerAssignmentPerformed, false);
  assert.equal(consolidation.evaluatorExecuted, false);
  assert.equal(consolidation.evaluatorResultProduced, false);
  assert.equal(consolidation.approvalDecisionProduced, false);
  assert.equal(consolidation.approvalGrantProduced, false);
  assert.equal(consolidation.approvalGrantPersisted, false);
  assert.equal(consolidation.runtimePermissionGranted, false);
  assert.equal(consolidation.commandExposurePermissionGranted, false);
  assert.equal(consolidation.cleanupHardeningToolkitEvidence.cargoAuditRequired, true);
  assert.equal(
    consolidation.cleanupHardeningToolkitEvidence.cargoMacheteRequired,
    true
  );
  assert.equal(
    consolidation.cleanupHardeningToolkitEvidence.toolsInstalledByPhase542,
    false
  );
  assert.equal(consolidation.cleanupHardeningToolkitEvidence.fallowRuntimeUsed, false);
  assertAllFalse(consolidation.runtimeEffect);
});

test("Phase 5.42 rejected metadata handoff checkpoint fails closed before consolidation", () => {
  const result = createResult([
    checkpointWith({ commandExposurePermissionGranted: true })
  ]);

  assert.equal(
    result.classification,
    "command_exposure_looking_review_only_handoff_metadata_consolidation_layer_input_rejected"
  );
  assert.equal(result.metadataHandoffCheckpointAccepted, false);
  assert.equal(result.handoffMetadataConsolidationLayerProduced, false);
  assert.equal(result.handoffMetadataConsolidationLayer, null);
  assert.equal(result.approvalDecisionProduced, false);
  assert.equal(result.approvalGrantProduced, false);
  assert.equal(result.runtimeCommandExposureEnabled, false);
  assert.equal(result.runtimeExecutionEnabled, false);
  assertAllFalse(result.runtimeEffect);
});

test("Phase 5.42 rejects unsafe nested source metadata handoff checkpoint state", () => {
  const regressions = nestedSourceRegressionCases();

  for (const regression of regressions) {
    assert.equal(
      regression.classification,
      regression.expectedClassification,
      regression.caseId
    );
    assert.equal(regression.handoffMetadataConsolidationLayerProduced, false);
    assert.equal(regression.approvalGrantProduced, false);
    assert.equal(regression.approvalGrantPersisted, false);
    assert.equal(regression.runtimeExecutionEnabled, false);
    assert.equal(regression.commandExposurePermissionGranted, false);
    assertAllFalse(regression.runtimeEffect);
  }
});

test("Phase 5.42 fixture mirrors consolidation cases and blocks authorization", async () => {
  const fixture = JSON.parse(await readFile(fixtureUrl, "utf8"));

  assert.deepEqual(
    fixture.handoffMetadataConsolidationCases.map(({ caseId }) => caseId),
    expectedCaseIds
  );
  for (const consolidationCase of fixture.handoffMetadataConsolidationCases) {
    assert.equal(consolidationCase.approvalGrant.produced, false);
    assert.equal(consolidationCase.approvalGrant.persisted, false);
    assert.equal(consolidationCase.approvalGrant.grantId, null);
    assert.equal(consolidationCase.reviewerRoutingPerformed, false);
    assert.equal(consolidationCase.reviewerAssignmentPerformed, false);
    assert.equal(consolidationCase.evaluatorExecuted, false);
    assert.equal(consolidationCase.evaluatorResultProduced, false);
    assert.equal(consolidationCase.approvalDecisionProduced, false);
    assert.equal(consolidationCase.approvalGrantProduced, false);
    assert.equal(consolidationCase.runtimePermissionGranted, false);
    assert.equal(consolidationCase.commandExposurePermissionGranted, false);
    assertAllFalse(consolidationCase.runtimeEffect);
  }
  assert.deepEqual(
    fixture.nestedSourceRegressionCases.map(({ caseId }) => caseId),
    nestedSourceRegressionCases().map(({ caseId }) => caseId)
  );
  assertAllFalse(fixture.blockedRuntimeEffect);
  assert.equal(fixture.serveRuntimeBlockedBehavior.defaultBlocked, true);
  assert.equal(fixture.serveRuntimeBlockedBehavior.dryRunBlocked, true);
  assert.equal(fixture.serveRuntimeBlockedBehavior.dryRunBypassesBlock, false);
  assert.equal(fixture.serveRuntimeBlockedBehavior.stdout, "");
  assert.deepEqual(fixture.handoffMetadataConsolidationResultShape, {
    ...expectedFixture().handoffMetadataConsolidationResultShape
  });
});

test("serve-runtime remains default-blocked and dry-run cannot bypass Phase 5.42", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-42-runtime-"));

  try {
    for (const args of [["serve-runtime"], ["serve-runtime", "--dry-run"]]) {
      const failure = await runCliFailure(args, { cwd: scratch });

      assert.notEqual(failure.code, 0, args.join(" "));
      assert.equal(failure.stdout, "");
      assert.match(failure.stderr, /runtime unavailable/i);
      assert.doesNotMatch(failure.stderr, /stack|secret|process\.env/i);
      assert.deepEqual(await readdir(scratch), []);
    }
  } finally {
    await rm(scratch, { recursive: true, force: true });
  }
});

test("Phase 5.42 consolidation command names remain rejected", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-42-commands-"));

  try {
    for (const command of consolidationCommandProbes) {
      const failure = await runCliFailure([command], { cwd: scratch });

      assert.notEqual(failure.code, 0, command);
      assert.equal(failure.stdout, "", command);
      assert.match(failure.stderr, /^Usage: ardyn /, command);
      assert.doesNotMatch(failure.stderr, /stack|secret|process\.env/i, command);
      assert.deepEqual(await readdir(scratch), [], command);
    }
  } finally {
    await rm(scratch, { recursive: true, force: true });
  }
});

test("Phase 5.42 does not change CLI or Rust runtime source", async () => {
  const currentCliSource = await readFile(cliSourceUrl, "utf8");
  const currentRustLibSource = await readFile(rustLibSourceUrl, "utf8");
  const currentRustStdioSource = await readFile(rustStdioSourceUrl, "utf8");
  const { stdout: baselineCliSource } = await execFileAsync("git", [
    "show",
    `${phase542BaselineCommit}:apps/cli/src/index.mjs`
  ], {
    cwd: repoRoot,
    maxBuffer: 1024 * 1024
  });
  const { stdout: baselineRustLibSource } = await execFileAsync("git", [
    "show",
    `${phase542BaselineCommit}:crates/ardyn-host/src/lib.rs`
  ], {
    cwd: repoRoot,
    maxBuffer: 1024 * 1024
  });
  const { stdout: baselineRustStdioSource } = await execFileAsync("git", [
    "show",
    `${phase542BaselineCommit}:crates/ardyn-host/src/stdio_runtime/mod.rs`
  ], {
    cwd: repoRoot,
    maxBuffer: 1024 * 1024
  });

  assert.equal(currentCliSource, baselineCliSource);
  assert.equal(currentRustLibSource, baselineRustLibSource);
  assert.equal(currentRustStdioSource, baselineRustStdioSource);
  assert.doesNotMatch(
    currentCliSource,
    /createReviewOnlyHandoffMetadataConsolidationLayerForReview/
  );
  assert.doesNotMatch(currentCliSource, /handoff-metadata-consolidation-layer/);
});
