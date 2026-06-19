import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { readFile, readdir, rm, mkdtemp } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";
import {
  REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_SCHEMA,
  createReviewOnlyConsolidationCheckpointHandoffForReview
} from "../packages/core/src/index.mjs";

const execFileAsync = promisify(execFile);
const phase543BaselineCommit = "792596864cddd8a7754eaa11af5e748d99eaf702";
const reviewedAt = "2026-06-18T00:00:00.000Z";
const repoRootUrl = new URL("../", import.meta.url);
const repoRoot = fileURLToPath(repoRootUrl);
const cliSourceUrl = new URL("../apps/cli/src/index.mjs", import.meta.url);
const cliPath = fileURLToPath(cliSourceUrl);
const rustLibSourceUrl = new URL("../crates/ardyn-host/src/lib.rs", import.meta.url);
const rustStdioSourceUrl = new URL(
  "../crates/ardyn-host/src/stdio_runtime/mod.rs",
  import.meta.url
);
const phase542FixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-42/review-only-handoff-metadata-consolidation-layer.json",
  import.meta.url
);
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-43/review-only-consolidation-checkpoint-handoff.json",
  import.meta.url
);
const phase542Fixture = JSON.parse(
  readFileSync(fileURLToPath(phase542FixtureUrl), "utf8")
);

const expectedTopLevelKeys = Object.freeze([
  "schema",
  "schemaVersion",
  "phase",
  "consolidationCheckpointHandoffKind",
  "metadataGeneratedAt",
  "sourcePhase",
  "consolidationCheckpointHandoffSummary",
  "consolidationCheckpointHandoffInputShape",
  "consolidationCheckpointHandoffResultShape",
  "consolidationCheckpointHandoffCases",
  "nestedSourceRegressionCases",
  "consolidationCheckpointHandoff",
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
  "missing-review-only-consolidation-checkpoint-handoff-input-rejected",
  "malformed-review-only-consolidation-checkpoint-handoff-input-rejected",
  "malformed-review-only-consolidation-checkpoint-handoff-invalid-reviewed-at-rejected",
  "empty-review-only-consolidation-checkpoint-handoff-input-rejected",
  "conflicting-review-only-consolidation-checkpoint-handoff-input-rejected",
  "stale-review-only-consolidation-checkpoint-handoff-input-rejected",
  "revoked-review-only-consolidation-checkpoint-handoff-input-rejected",
  "unknown-review-only-consolidation-checkpoint-handoff-input-rejected",
  "duplicate-invalid-review-only-consolidation-checkpoint-handoff-input-rejected",
  "authorizing-looking-review-only-consolidation-checkpoint-handoff-input-rejected",
  "grant-looking-review-only-consolidation-checkpoint-handoff-input-rejected",
  "approval-decision-looking-review-only-consolidation-checkpoint-handoff-input-rejected",
  "approval-grant-looking-review-only-consolidation-checkpoint-handoff-input-rejected",
  "evaluator-result-looking-review-only-consolidation-checkpoint-handoff-input-rejected",
  "evaluator-execution-looking-review-only-consolidation-checkpoint-handoff-input-rejected",
  "reviewer-routing-looking-review-only-consolidation-checkpoint-handoff-input-rejected",
  "reviewer-assignment-looking-review-only-consolidation-checkpoint-handoff-input-rejected",
  "runtime-permission-looking-review-only-consolidation-checkpoint-handoff-input-rejected",
  "command-exposure-looking-review-only-consolidation-checkpoint-handoff-input-rejected",
  "runtime-effect-true-review-only-consolidation-checkpoint-handoff-input-rejected",
  "process-flag-true-review-only-consolidation-checkpoint-handoff-input-rejected",
  "unsafe-top-level-review-only-consolidation-checkpoint-handoff-input-rejected",
  "unsafe-nested-consolidation-checkpoint-handoff-metadata-review-only-consolidation-checkpoint-handoff-input-rejected",
  "malformed-nested-entries-or-arrays-review-only-consolidation-checkpoint-handoff-input-rejected",
  "execution-signal-looking-review-only-consolidation-checkpoint-handoff-input-rejected",
  "mismatched-source-digest-review-only-consolidation-checkpoint-handoff-input-rejected",
  "valid-review-only-consolidation-checkpoint-handoff"
]);

const expectedClassifications = Object.freeze({
  "missing-review-only-consolidation-checkpoint-handoff-input-rejected":
    "missing_review_only_consolidation_checkpoint_handoff_input_rejected",
  "malformed-review-only-consolidation-checkpoint-handoff-input-rejected":
    "malformed_review_only_consolidation_checkpoint_handoff_input_rejected",
  "malformed-review-only-consolidation-checkpoint-handoff-invalid-reviewed-at-rejected":
    "malformed_review_only_consolidation_checkpoint_handoff_input_rejected",
  "empty-review-only-consolidation-checkpoint-handoff-input-rejected":
    "empty_review_only_consolidation_checkpoint_handoff_input_rejected",
  "conflicting-review-only-consolidation-checkpoint-handoff-input-rejected":
    "conflicting_review_only_consolidation_checkpoint_handoff_input_rejected",
  "stale-review-only-consolidation-checkpoint-handoff-input-rejected":
    "stale_review_only_consolidation_checkpoint_handoff_input_rejected",
  "revoked-review-only-consolidation-checkpoint-handoff-input-rejected":
    "revoked_review_only_consolidation_checkpoint_handoff_input_rejected",
  "unknown-review-only-consolidation-checkpoint-handoff-input-rejected":
    "unknown_review_only_consolidation_checkpoint_handoff_input_rejected",
  "duplicate-invalid-review-only-consolidation-checkpoint-handoff-input-rejected":
    "duplicate_invalid_review_only_consolidation_checkpoint_handoff_input_rejected",
  "authorizing-looking-review-only-consolidation-checkpoint-handoff-input-rejected":
    "authorizing_review_only_consolidation_checkpoint_handoff_input_rejected",
  "grant-looking-review-only-consolidation-checkpoint-handoff-input-rejected":
    "grant_looking_review_only_consolidation_checkpoint_handoff_input_rejected",
  "approval-decision-looking-review-only-consolidation-checkpoint-handoff-input-rejected":
    "approval_decision_looking_review_only_consolidation_checkpoint_handoff_input_rejected",
  "approval-grant-looking-review-only-consolidation-checkpoint-handoff-input-rejected":
    "approval_grant_looking_review_only_consolidation_checkpoint_handoff_input_rejected",
  "evaluator-result-looking-review-only-consolidation-checkpoint-handoff-input-rejected":
    "evaluator_result_looking_review_only_consolidation_checkpoint_handoff_input_rejected",
  "evaluator-execution-looking-review-only-consolidation-checkpoint-handoff-input-rejected":
    "evaluator_execution_looking_review_only_consolidation_checkpoint_handoff_input_rejected",
  "reviewer-routing-looking-review-only-consolidation-checkpoint-handoff-input-rejected":
    "reviewer_routing_looking_review_only_consolidation_checkpoint_handoff_input_rejected",
  "reviewer-assignment-looking-review-only-consolidation-checkpoint-handoff-input-rejected":
    "reviewer_assignment_looking_review_only_consolidation_checkpoint_handoff_input_rejected",
  "runtime-permission-looking-review-only-consolidation-checkpoint-handoff-input-rejected":
    "runtime_permission_looking_review_only_consolidation_checkpoint_handoff_input_rejected",
  "command-exposure-looking-review-only-consolidation-checkpoint-handoff-input-rejected":
    "command_exposure_looking_review_only_consolidation_checkpoint_handoff_input_rejected",
  "runtime-effect-true-review-only-consolidation-checkpoint-handoff-input-rejected":
    "runtime_effect_true_review_only_consolidation_checkpoint_handoff_input_rejected",
  "process-flag-true-review-only-consolidation-checkpoint-handoff-input-rejected":
    "process_flag_true_review_only_consolidation_checkpoint_handoff_input_rejected",
  "unsafe-top-level-review-only-consolidation-checkpoint-handoff-input-rejected":
    "unsafe_review_only_consolidation_checkpoint_handoff_input_rejected",
  "unsafe-nested-consolidation-checkpoint-handoff-metadata-review-only-consolidation-checkpoint-handoff-input-rejected":
    "unsafe_review_only_consolidation_checkpoint_handoff_input_rejected",
  "malformed-nested-entries-or-arrays-review-only-consolidation-checkpoint-handoff-input-rejected":
    "malformed_review_only_consolidation_checkpoint_handoff_input_rejected",
  "execution-signal-looking-review-only-consolidation-checkpoint-handoff-input-rejected":
    "execution_signal_looking_review_only_consolidation_checkpoint_handoff_input_rejected",
  "mismatched-source-digest-review-only-consolidation-checkpoint-handoff-input-rejected":
    "mismatched_source_digest_review_only_consolidation_checkpoint_handoff_input_rejected",
  "valid-review-only-consolidation-checkpoint-handoff":
    "valid_review_only_consolidation_checkpoint_handoff_runtime_still_blocked"
});

const checkpointHandoffCommandProbes = Object.freeze([
  "review-only-consolidation-checkpoint-handoff",
  "create-review-only-consolidation-checkpoint-handoff",
  "consolidation-checkpoint-handoff",
  "phase-5-43-review-only-consolidation-checkpoint-handoff",
  "reviewer-routing",
  "reviewer-assignment"
]);

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function compareAscii(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}

function stableJsonValue(value) {
  if (Array.isArray(value)) {
    return value.map(stableJsonValue);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, entryValue]) => entryValue !== undefined)
        .sort(([left], [right]) => compareAscii(left, right))
        .map(([key, entryValue]) => [key, stableJsonValue(entryValue)])
    );
  }

  return value;
}

function stableDigest(value) {
  return `sha256:${createHash("sha256")
    .update(JSON.stringify(stableJsonValue(value)))
    .digest("hex")}`;
}

function validConsolidationLayer() {
  return clone(phase542Fixture.handoffMetadataConsolidationLayer);
}

function layerWith(overrides = {}) {
  return {
    ...validConsolidationLayer(),
    ...overrides
  };
}

function layerWithSummary(nestedKey, nestedValue = true) {
  const layer = validConsolidationLayer();
  layer.handoffMetadataConsolidationSummary = {
    ...layer.handoffMetadataConsolidationSummary,
    [nestedKey]: nestedValue
  };
  return layer;
}

function layerWithCleanupEvidence(nestedKey, nestedValue = true) {
  const layer = validConsolidationLayer();
  layer.cleanupHardeningToolkitEvidence = {
    ...layer.cleanupHardeningToolkitEvidence,
    [nestedKey]: nestedValue
  };
  return layer;
}

function layerWithSourceMetadata(nestedKey, nestedValue = true) {
  const layer = validConsolidationLayer();
  layer.sourceMetadataHandoffCheckpoint = {
    ...layer.sourceMetadataHandoffCheckpoint,
    [nestedKey]: nestedValue
  };
  return layer;
}

function digestableObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function firstEntryDigestable(entries) {
  return Array.isArray(entries) && digestableObject(entries[0]);
}

function inputNeedsSourceDigest(input) {
  return !Object.prototype.hasOwnProperty.call(
    input,
    "sourceHandoffMetadataConsolidationLayerDigest"
  );
}

function createResult(entries, options = {}) {
  const input = {
    reviewedAt,
    handoffMetadataConsolidationLayerEntries: entries,
    ...options
  };

  if (inputNeedsSourceDigest(input) && firstEntryDigestable(entries)) {
    input.sourceHandoffMetadataConsolidationLayerDigest = stableDigest(entries[0]);
  }

  return createReviewOnlyConsolidationCheckpointHandoffForReview(input);
}

function caseSummary(caseId, result) {
  return {
    caseId,
    classification: result.classification,
    reviewOnly: result.reviewOnly,
    authoritative: result.authoritative,
    reviewArtifactOnly: result.reviewArtifactOnly,
    sourceHandoffMetadataConsolidationLayerAccepted:
      result.sourceHandoffMetadataConsolidationLayerAccepted,
    consolidationCheckpointHandoffProduced:
      result.consolidationCheckpointHandoffProduced,
    consolidationCheckpointHandoffIsReviewerRouting:
      result.consolidationCheckpointHandoffIsReviewerRouting,
    consolidationCheckpointHandoffIsReviewerAssignment:
      result.consolidationCheckpointHandoffIsReviewerAssignment,
    consolidationCheckpointHandoffIsEvaluatorExecution:
      result.consolidationCheckpointHandoffIsEvaluatorExecution,
    consolidationCheckpointHandoffIsEvaluatorResult:
      result.consolidationCheckpointHandoffIsEvaluatorResult,
    consolidationCheckpointHandoffIsApprovalDecision:
      result.consolidationCheckpointHandoffIsApprovalDecision,
    consolidationCheckpointHandoffIsApprovalGrant:
      result.consolidationCheckpointHandoffIsApprovalGrant,
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

function consolidationCheckpointHandoffCases() {
  const validLayer = validConsolidationLayer();
  const conflicting = layerWith({ reviewedAt: "2026-06-18T00:00:01.000Z" });
  return [
    [
      "missing-review-only-consolidation-checkpoint-handoff-input-rejected",
      createReviewOnlyConsolidationCheckpointHandoffForReview({
        reviewedAt,
        sourceHandoffMetadataConsolidationLayerDigest: stableDigest(validLayer)
      })
    ],
    [
      "malformed-review-only-consolidation-checkpoint-handoff-input-rejected",
      createReviewOnlyConsolidationCheckpointHandoffForReview(null)
    ],
    [
      "malformed-review-only-consolidation-checkpoint-handoff-invalid-reviewed-at-rejected",
      createReviewOnlyConsolidationCheckpointHandoffForReview({
        reviewedAt: "not-a-date",
        sourceHandoffMetadataConsolidationLayerDigest: stableDigest(validLayer),
        handoffMetadataConsolidationLayerEntries: [validLayer]
      })
    ],
    ["empty-review-only-consolidation-checkpoint-handoff-input-rejected", createResult([])],
    [
      "conflicting-review-only-consolidation-checkpoint-handoff-input-rejected",
      createResult([validConsolidationLayer(), conflicting])
    ],
    [
      "stale-review-only-consolidation-checkpoint-handoff-input-rejected",
      createResult([layerWith({ reviewedAt: "2026-06-16T23:59:59.000Z" })])
    ],
    [
      "revoked-review-only-consolidation-checkpoint-handoff-input-rejected",
      createResult([layerWith({ status: "revoked" })])
    ],
    [
      "unknown-review-only-consolidation-checkpoint-handoff-input-rejected",
      createResult([layerWith({ status: "unknown" })])
    ],
    [
      "duplicate-invalid-review-only-consolidation-checkpoint-handoff-input-rejected",
      createResult([validConsolidationLayer(), validConsolidationLayer()])
    ],
    [
      "authorizing-looking-review-only-consolidation-checkpoint-handoff-input-rejected",
      createResult([layerWithSummary("canGrantRuntime")])
    ],
    [
      "grant-looking-review-only-consolidation-checkpoint-handoff-input-rejected",
      createResult([layerWithSummary("grant")])
    ],
    [
      "approval-decision-looking-review-only-consolidation-checkpoint-handoff-input-rejected",
      createResult([layerWith({ approvalDecisionProduced: true })])
    ],
    [
      "approval-grant-looking-review-only-consolidation-checkpoint-handoff-input-rejected",
      createResult([layerWith({ approvalGrantProduced: true })])
    ],
    [
      "evaluator-result-looking-review-only-consolidation-checkpoint-handoff-input-rejected",
      createResult([layerWith({ evaluatorResultProduced: true })])
    ],
    [
      "evaluator-execution-looking-review-only-consolidation-checkpoint-handoff-input-rejected",
      createResult([layerWith({ evaluatorExecuted: true })])
    ],
    [
      "reviewer-routing-looking-review-only-consolidation-checkpoint-handoff-input-rejected",
      createResult([layerWith({ reviewerRoutingEnabled: true })])
    ],
    [
      "reviewer-assignment-looking-review-only-consolidation-checkpoint-handoff-input-rejected",
      createResult([layerWith({ reviewerAssignmentEnabled: true })])
    ],
    [
      "runtime-permission-looking-review-only-consolidation-checkpoint-handoff-input-rejected",
      createResult([layerWith({ runtimePermissionGranted: true })])
    ],
    [
      "command-exposure-looking-review-only-consolidation-checkpoint-handoff-input-rejected",
      createResult([layerWith({ commandExposurePermissionGranted: true })])
    ],
    [
      "runtime-effect-true-review-only-consolidation-checkpoint-handoff-input-rejected",
      createResult([
        layerWith({
          runtimeEffect: {
            ...validConsolidationLayer().runtimeEffect,
            runtimeEnabled: true
          }
        })
      ])
    ],
    [
      "process-flag-true-review-only-consolidation-checkpoint-handoff-input-rejected",
      createResult([layerWithSummary("processSpawned")])
    ],
    [
      "unsafe-top-level-review-only-consolidation-checkpoint-handoff-input-rejected",
      createResult([layerWith({ consolidationCheckpointHandoff: {} })])
    ],
    [
      "unsafe-nested-consolidation-checkpoint-handoff-metadata-review-only-consolidation-checkpoint-handoff-input-rejected",
      createResult([layerWithSummary("checkpointHandoffMetadata", {})])
    ],
    [
      "malformed-nested-entries-or-arrays-review-only-consolidation-checkpoint-handoff-input-rejected",
      createResult([layerWithSummary("entries", [])])
    ],
    [
      "execution-signal-looking-review-only-consolidation-checkpoint-handoff-input-rejected",
      createResult([layerWithSummary("executionSignal")])
    ],
    [
      "mismatched-source-digest-review-only-consolidation-checkpoint-handoff-input-rejected",
      createResult([validConsolidationLayer()], {
        sourceHandoffMetadataConsolidationLayerDigest: `sha256:${"0".repeat(64)}`
      })
    ],
    [
      "valid-review-only-consolidation-checkpoint-handoff",
      createResult([validConsolidationLayer()])
    ]
  ].map(([caseId, result]) => caseSummary(caseId, result));
}

function nestedSourceRegressionCases() {
  const cases = [
    [
      "missing-source-handoff-metadata-consolidation-layer-digest",
      () =>
        createReviewOnlyConsolidationCheckpointHandoffForReview({
          reviewedAt,
          handoffMetadataConsolidationLayerEntries: [validConsolidationLayer()]
        }),
      "malformed_review_only_consolidation_checkpoint_handoff_input_rejected"
    ],
    [
      "malformed-source-handoff-metadata-consolidation-layer-digest",
      () =>
        createReviewOnlyConsolidationCheckpointHandoffForReview({
          reviewedAt,
          sourceHandoffMetadataConsolidationLayerDigest: "sha256:nothex",
          handoffMetadataConsolidationLayerEntries: [validConsolidationLayer()]
        }),
      "malformed_review_only_consolidation_checkpoint_handoff_input_rejected"
    ],
    [
      "mismatched-source-handoff-metadata-consolidation-layer-digest",
      () =>
        createResult([validConsolidationLayer()], {
          sourceHandoffMetadataConsolidationLayerDigest: `sha256:${"1".repeat(64)}`
        }),
      "mismatched_source_digest_review_only_consolidation_checkpoint_handoff_input_rejected"
    ],
    [
      "missing-nested-source-metadata-handoff-checkpoint-digest",
      () => {
        const layer = validConsolidationLayer();
        delete layer.sourceMetadataHandoffCheckpoint.stateDigest;
        return createResult([layer]);
      },
      "malformed_review_only_consolidation_checkpoint_handoff_input_rejected"
    ],
    [
      "malformed-nested-source-metadata-handoff-checkpoint-digest",
      () => {
        const layer = validConsolidationLayer();
        layer.sourceMetadataHandoffCheckpoint.stateDigest = 42;
        return createResult([layer]);
      },
      "malformed_review_only_consolidation_checkpoint_handoff_input_rejected"
    ],
    [
      "nested-approval-grant-rejected",
      () => createResult([layerWithSourceMetadata("approvalGrantProduced")]),
      "approval_grant_looking_review_only_consolidation_checkpoint_handoff_input_rejected"
    ],
    [
      "nested-approval-decision-rejected",
      () => createResult([layerWithSourceMetadata("approvalDecisionProduced")]),
      "approval_decision_looking_review_only_consolidation_checkpoint_handoff_input_rejected"
    ],
    [
      "nested-reviewer-assignment-rejected",
      () => createResult([layerWithSourceMetadata("reviewerAssignmentPerformed")]),
      "reviewer_assignment_looking_review_only_consolidation_checkpoint_handoff_input_rejected"
    ],
    [
      "nested-reviewer-routing-rejected",
      () => createResult([layerWithSourceMetadata("reviewerRoutingPerformed")]),
      "reviewer_routing_looking_review_only_consolidation_checkpoint_handoff_input_rejected"
    ],
    [
      "nested-evaluator-execution-rejected",
      () => createResult([layerWithSourceMetadata("evaluatorExecuted")]),
      "evaluator_execution_looking_review_only_consolidation_checkpoint_handoff_input_rejected"
    ],
    [
      "nested-evaluator-result-rejected",
      () => createResult([layerWithSourceMetadata("evaluatorResultProduced")]),
      "evaluator_result_looking_review_only_consolidation_checkpoint_handoff_input_rejected"
    ],
    [
      "nested-runtime-effect-rejected",
      () => createResult([layerWithSourceMetadata("runtimeEffectAllFalse", false)]),
      "runtime_effect_true_review_only_consolidation_checkpoint_handoff_input_rejected"
    ],
    [
      "nested-command-exposure-rejected",
      () =>
        createResult([
          layerWithSourceMetadata("commandExposurePermissionGranted", true)
        ]),
      "command_exposure_looking_review_only_consolidation_checkpoint_handoff_input_rejected"
    ],
    [
      "nested-source-url-rejected",
      () =>
        createResult([
          layerWithSourceMetadata("url", "https://example.invalid/source.json")
        ]),
      "unsafe_review_only_consolidation_checkpoint_handoff_input_rejected"
    ],
    [
      "nested-source-file-path-rejected",
      () =>
        createResult([
          layerWithSourceMetadata("filePath", "C:\\tmp\\phase-5-43.json")
        ]),
      "unsafe_review_only_consolidation_checkpoint_handoff_input_rejected"
    ],
    [
      "nested-summary-external-source-lookup-rejected",
      () => createResult([layerWithSummary("externalSourceLookup", true)]),
      "unsafe_review_only_consolidation_checkpoint_handoff_input_rejected"
    ],
    [
      "nested-summary-filesystem-watcher-rejected",
      () => createResult([layerWithSummary("filesystemWatcher", true)]),
      "unsafe_review_only_consolidation_checkpoint_handoff_input_rejected"
    ],
    [
      "nested-cleanup-env-secrets-ingested-rejected",
      () =>
        createResult([layerWithCleanupEvidence("envSecretsIngested", true)]),
      "unsafe_review_only_consolidation_checkpoint_handoff_input_rejected"
    ],
    [
      "nested-cleanup-secrets-env-ingestion-rejected",
      () =>
        createResult([layerWithCleanupEvidence("secretsEnvIngestion", true)]),
      "unsafe_review_only_consolidation_checkpoint_handoff_input_rejected"
    ],
    [
      "malformed-source-entry-null-rejected",
      () =>
        createReviewOnlyConsolidationCheckpointHandoffForReview({
          reviewedAt,
          sourceHandoffMetadataConsolidationLayerDigest: stableDigest(
            validConsolidationLayer()
          ),
          handoffMetadataConsolidationLayerEntries: [null]
        }),
      "malformed_review_only_consolidation_checkpoint_handoff_input_rejected"
    ],
    [
      "malformed-source-entry-array-rejected",
      () =>
        createReviewOnlyConsolidationCheckpointHandoffForReview({
          reviewedAt,
          sourceHandoffMetadataConsolidationLayerDigest: stableDigest(
            validConsolidationLayer()
          ),
          handoffMetadataConsolidationLayerEntries: [[validConsolidationLayer()]]
        }),
      "malformed_review_only_consolidation_checkpoint_handoff_input_rejected"
    ],
    [
      "malformed-nested-entry-array-rejected",
      () => createResult([layerWithSummary("sourceEntries", [])]),
      "malformed_review_only_consolidation_checkpoint_handoff_input_rejected"
    ]
  ];

  return cases.map(([caseId, produceResult, expectedClassification]) => {
    const result = produceResult();
    return {
      caseId,
      classification: result.classification,
      expectedClassification,
      consolidationCheckpointHandoffProduced:
        result.consolidationCheckpointHandoffProduced,
      approvalGrantProduced: result.approvalGrantProduced,
      approvalGrantPersisted: result.approvalGrantPersisted,
      runtimeExecutionEnabled: result.runtimeExecutionEnabled,
      commandExposurePermissionGranted: result.commandExposurePermissionGranted,
      runtimeEffect: result.runtimeEffect
    };
  });
}

function expectedFixture() {
  const validLayer = validConsolidationLayer();
  const validResult = createResult([validLayer]);
  return {
    schema: REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_SCHEMA,
    schemaVersion: "0.1.0",
    phase: "phase-5.43-review-only-consolidation-checkpoint-handoff",
    consolidationCheckpointHandoffKind:
      "review-only-consolidation-checkpoint-handoff",
    metadataGeneratedAt: reviewedAt,
    sourcePhase: {
      phase: "phase-5.42-review-only-handoff-metadata-consolidation-layer",
      handoffMetadataConsolidationLayerPath:
        "packages/core/src/index.mjs#createReviewOnlyHandoffMetadataConsolidationLayerForReview",
      consolidationCheckpointHandoffPath:
        "packages/core/src/index.mjs#createReviewOnlyConsolidationCheckpointHandoffForReview",
      sourceHandoffMetadataConsolidationLayerFixture:
        "tests/fixtures/host-policy/phase5-42/review-only-handoff-metadata-consolidation-layer.json",
      cleanupHardeningToolkitEvidence: "installed-tools-only-no-installs",
      runtimeEnabled: false,
      reviewerRoutingPerformed: false,
      reviewerAssignmentPerformed: false,
      approvalDecisionProduced: false,
      approvalGrantProduced: false,
      evaluatorExecutionPerformed: false
    },
    consolidationCheckpointHandoffSummary: {
      reviewOnlyConsolidationCheckpointHandoffRecorded: true,
      consolidationCheckpointHandoffKind:
        "review-only-consolidation-checkpoint-handoff",
      consolidationCheckpointHandoffReviewOnly: true,
      consolidationCheckpointHandoffAuthoritative: false,
      validHandoffMetadataConsolidationLayerProducesCheckpointHandoff: true,
      missingHandoffMetadataConsolidationLayerRejected: true,
      malformedHandoffMetadataConsolidationLayerRejected: true,
      emptyHandoffMetadataConsolidationLayerRejected: true,
      conflictingHandoffMetadataConsolidationLayerRejected: true,
      staleHandoffMetadataConsolidationLayerRejected: true,
      revokedHandoffMetadataConsolidationLayerRejected: true,
      unknownHandoffMetadataConsolidationLayerRejected: true,
      duplicateInvalidHandoffMetadataConsolidationLayerRejected: true,
      authorizingLookingHandoffMetadataConsolidationLayerRejected: true,
      grantLookingHandoffMetadataConsolidationLayerRejected: true,
      approvalDecisionLookingHandoffMetadataConsolidationLayerRejected: true,
      approvalGrantLookingHandoffMetadataConsolidationLayerRejected: true,
      evaluatorResultLookingHandoffMetadataConsolidationLayerRejected: true,
      evaluatorExecutionLookingHandoffMetadataConsolidationLayerRejected: true,
      reviewerRoutingLookingHandoffMetadataConsolidationLayerRejected: true,
      reviewerAssignmentLookingHandoffMetadataConsolidationLayerRejected: true,
      runtimePermissionLookingHandoffMetadataConsolidationLayerRejected: true,
      commandExposureLookingHandoffMetadataConsolidationLayerRejected: true,
      runtimeEffectTrueHandoffMetadataConsolidationLayerRejected: true,
      processFlagTrueHandoffMetadataConsolidationLayerRejected: true,
      unsafeConsolidationCheckpointHandoffMetadataRejected: true,
      malformedNestedEntriesOrArraysRejected: true,
      executionSignalLookingHandoffMetadataConsolidationLayerRejected: true,
      nestedApprovalGrantRejected: true,
      nestedApprovalDecisionRejected: true,
      nestedReviewerAssignmentRejected: true,
      nestedReviewerRoutingRejected: true,
      nestedEvaluatorExecutionRejected: true,
      nestedEvaluatorResultRejected: true,
      nestedRuntimeEffectRejected: true,
      nestedCommandExposureRejected: true,
      missingMalformedOrMismatchedSourceDigestRejected: true,
      malformedSourceEntryArraysRejected: true,
      consolidationCheckpointHandoffIsReviewerRouting: false,
      consolidationCheckpointHandoffIsReviewerAssignment: false,
      consolidationCheckpointHandoffIsEvaluatorExecution: false,
      consolidationCheckpointHandoffIsEvaluatorResult: false,
      consolidationCheckpointHandoffIsApprovalDecision: false,
      consolidationCheckpointHandoffIsApprovalGrant: false,
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
      toolsInstalledByPhase543: false,
      megaLinterRun: false,
      broadTrunkRewriteRun: false,
      fallowRuntimeUsed: false,
      serveRuntimeStillDefaultBlocked: true,
      dryRunBypassesBlock: false,
      canEnableRuntime: false
    },
    consolidationCheckpointHandoffInputShape: {
      handoffMetadataConsolidationLayerEntries:
        "exactly one Phase 5.42 review-only handoff metadata consolidation layer state",
      handoffMetadataConsolidationLayerSchema:
        "ardyn.phase-5.42.review-only-handoff-metadata-consolidation-layer-state",
      handoffMetadataConsolidationLayerMode: "review-only",
      validHandoffMetadataConsolidationLayerRequired: true,
      sourceHandoffMetadataConsolidationLayerDigestRequired: true,
      authorizingLookingMetadataPolicy: "fail-closed",
      grantLookingMetadataPolicy: "fail-closed",
      reviewerRoutingLookingMetadataPolicy: "fail-closed",
      reviewerAssignmentLookingMetadataPolicy: "fail-closed",
      evaluatorExecutionLookingMetadataPolicy: "fail-closed",
      runtimeEffectTrueMetadataPolicy: "fail-closed",
      processFlagTrueMetadataPolicy: "fail-closed",
      unsafeTopLevelMetadataPolicy: "fail-closed",
      unsafeNestedConsolidationCheckpointHandoffMetadataPolicy: "fail-closed",
      malformedNestedEntriesOrArraysPolicy: "fail-closed",
      executionSignalLookingMetadataPolicy: "fail-closed",
      filesystemWatcherAllowed: false,
      externalSourceLookupAllowed: false,
      secretsEnvIngestionAllowed: false,
      filePathAllowed: false,
      urlAllowed: false
    },
    consolidationCheckpointHandoffResultShape: {
      schema:
        "ardyn.phase-5.43.review-only-consolidation-checkpoint-handoff-result",
      schemaVersion: "0.1.0",
      consolidationCheckpointHandoffKind:
        "review-only-consolidation-checkpoint-handoff",
      consolidationCheckpointHandoffMode: "review-only",
      stateSchema:
        "ardyn.phase-5.43.review-only-consolidation-checkpoint-handoff-state",
      stateKind: "review-only-consolidation-checkpoint-handoff-state",
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
    consolidationCheckpointHandoffCases: consolidationCheckpointHandoffCases(),
    nestedSourceRegressionCases: nestedSourceRegressionCases(),
    consolidationCheckpointHandoff:
      validResult.consolidationCheckpointHandoff,
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
      "tests/phase5-43-review-only-consolidation-checkpoint-handoff.test.mjs",
      "tests/fixtures/host-policy/phase5-43/review-only-consolidation-checkpoint-handoff.json",
      "docs/phase-5-43-review-only-consolidation-checkpoint-handoff.md",
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
      "node --test tests/phase5-43-review-only-consolidation-checkpoint-handoff.test.mjs",
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

test("Phase 5.43 consolidation checkpoint handoff fixture is deterministic metadata", async () => {
  const fixture = JSON.parse(await readFile(fixtureUrl, "utf8"));

  assert.deepEqual(Object.keys(fixture), expectedTopLevelKeys);
  assert.deepEqual(fixture, expectedFixture());
});

test("Phase 5.43 consolidation checkpoint handoff classifies metadata cases", () => {
  const cases = consolidationCheckpointHandoffCases();

  assert.deepEqual(
    cases.map(({ caseId }) => caseId),
    expectedCaseIds
  );
  for (const checkpointCase of cases) {
    assert.equal(
      checkpointCase.classification,
      expectedClassifications[checkpointCase.caseId],
      checkpointCase.caseId
    );
    assert.equal(checkpointCase.reviewOnly, true);
    assert.equal(checkpointCase.authoritative, false);
    assert.equal(checkpointCase.reviewArtifactOnly, true);
    assert.equal(
      checkpointCase.consolidationCheckpointHandoffIsReviewerRouting,
      false
    );
    assert.equal(
      checkpointCase.consolidationCheckpointHandoffIsReviewerAssignment,
      false
    );
    assert.equal(
      checkpointCase.consolidationCheckpointHandoffIsEvaluatorExecution,
      false
    );
    assert.equal(
      checkpointCase.consolidationCheckpointHandoffIsEvaluatorResult,
      false
    );
    assert.equal(
      checkpointCase.consolidationCheckpointHandoffIsApprovalDecision,
      false
    );
    assert.equal(
      checkpointCase.consolidationCheckpointHandoffIsApprovalGrant,
      false
    );
    assert.equal(checkpointCase.approvalGrant.produced, false);
    assert.equal(checkpointCase.approvalGrant.persisted, false);
    assert.equal(checkpointCase.approvalGrant.grantId, null);
    assertAllFalse(checkpointCase.runtimeEffect);
  }
});

test("Phase 5.43 malformed checkpoint handoff input fails closed without throwing", () => {
  const digest = stableDigest(validConsolidationLayer());
  for (const input of [
    null,
    "bad",
    { reviewedAt: "bad" },
    {
      reviewedAt,
      sourceHandoffMetadataConsolidationLayerDigest: digest,
      handoffMetadataConsolidationLayerEntries: [null]
    },
    {
      reviewedAt,
      sourceHandoffMetadataConsolidationLayerDigest: digest,
      handoffMetadataConsolidationLayerEntries: [undefined]
    },
    {
      reviewedAt,
      sourceHandoffMetadataConsolidationLayerDigest: digest,
      handoffMetadataConsolidationLayerEntries: ["bad"]
    },
    {
      reviewedAt,
      sourceHandoffMetadataConsolidationLayerDigest: digest,
      handoffMetadataConsolidationLayerEntries: [42]
    },
    {
      reviewedAt,
      handoffMetadataConsolidationLayerEntries: [validConsolidationLayer()]
    },
    {
      reviewedAt,
      sourceHandoffMetadataConsolidationLayerDigest: 42,
      handoffMetadataConsolidationLayerEntries: [validConsolidationLayer()]
    }
  ]) {
    const result =
      createReviewOnlyConsolidationCheckpointHandoffForReview(input);

    assert.equal(
      result.classification,
      "malformed_review_only_consolidation_checkpoint_handoff_input_rejected"
    );
    assert.equal(result.consolidationCheckpointHandoffProduced, false);
    assert.equal(result.consolidationCheckpointHandoff, null);
    assert.equal(result.approvalGrantProduced, false);
    assert.equal(result.runtimeExecutionEnabled, false);
    assertAllFalse(result.runtimeEffect);
  }
});

test("Phase 5.43 valid consolidation metadata produces only checkpoint handoff metadata", () => {
  const sourceLayer = validConsolidationLayer();
  const sourceDigest = stableDigest(sourceLayer);
  const result = createResult([sourceLayer]);
  const handoff = result.consolidationCheckpointHandoff;

  assert.equal(
    result.classification,
    "valid_review_only_consolidation_checkpoint_handoff_runtime_still_blocked"
  );
  assert.equal(result.sourceHandoffMetadataConsolidationLayerAccepted, true);
  assert.equal(result.consolidationCheckpointHandoffProduced, true);
  assert.equal(
    handoff.schema,
    "ardyn.phase-5.43.review-only-consolidation-checkpoint-handoff-state"
  );
  assert.equal(
    handoff.stateKind,
    "review-only-consolidation-checkpoint-handoff-state"
  );
  assert.equal(handoff.stateMode, "review-only");
  assert.equal(handoff.consolidationCheckpointHandoffMetadataOnly, true);
  assert.equal(
    handoff.sourceHandoffMetadataConsolidationLayer.stateDigest,
    sourceDigest
  );
  assert.match(
    handoff.sourceHandoffMetadataConsolidationLayer
      .sourceMetadataHandoffCheckpointDigest,
    /^sha256:[0-9a-f]{64}$/
  );
  assert.match(
    handoff.sourceHandoffMetadataConsolidationLayer
      .sourceCheckpointHandoffLayerDigest,
    /^sha256:[0-9a-f]{64}$/
  );
  assert.equal(handoff.consolidationCheckpointHandoffIsReviewerRouting, false);
  assert.equal(handoff.consolidationCheckpointHandoffIsReviewerAssignment, false);
  assert.equal(handoff.consolidationCheckpointHandoffIsEvaluatorExecution, false);
  assert.equal(handoff.consolidationCheckpointHandoffIsEvaluatorResult, false);
  assert.equal(handoff.consolidationCheckpointHandoffIsApprovalDecision, false);
  assert.equal(handoff.consolidationCheckpointHandoffIsApprovalGrant, false);
  assert.equal(handoff.reviewerRoutingPerformed, false);
  assert.equal(handoff.reviewerAssignmentPerformed, false);
  assert.equal(handoff.evaluatorExecuted, false);
  assert.equal(handoff.evaluatorResultProduced, false);
  assert.equal(handoff.approvalDecisionProduced, false);
  assert.equal(handoff.approvalGrantProduced, false);
  assert.equal(handoff.approvalGrantPersisted, false);
  assert.equal(handoff.runtimePermissionGranted, false);
  assert.equal(handoff.commandExposurePermissionGranted, false);
  assert.equal(handoff.cleanupHardeningToolkitEvidence.cargoAuditRequired, true);
  assert.equal(handoff.cleanupHardeningToolkitEvidence.cargoMacheteRequired, true);
  assert.equal(
    handoff.cleanupHardeningToolkitEvidence.toolsInstalledByPhase543,
    false
  );
  assert.equal(handoff.cleanupHardeningToolkitEvidence.fallowRuntimeUsed, false);
  assertAllFalse(handoff.runtimeEffect);
});

test("Phase 5.43 rejects unsafe nested Phase 5.42 source metadata", () => {
  const regressions = nestedSourceRegressionCases();

  for (const regression of regressions) {
    assert.equal(
      regression.classification,
      regression.expectedClassification,
      regression.caseId
    );
    assert.equal(regression.consolidationCheckpointHandoffProduced, false);
    assert.equal(regression.approvalGrantProduced, false);
    assert.equal(regression.approvalGrantPersisted, false);
    assert.equal(regression.runtimeExecutionEnabled, false);
    assert.equal(regression.commandExposurePermissionGranted, false);
    assertAllFalse(regression.runtimeEffect);
  }
});

test("Phase 5.43 fixture mirrors checkpoint handoff cases and blocks authorization", async () => {
  const fixture = JSON.parse(await readFile(fixtureUrl, "utf8"));

  assert.deepEqual(
    fixture.consolidationCheckpointHandoffCases.map(({ caseId }) => caseId),
    expectedCaseIds
  );
  for (const checkpointCase of fixture.consolidationCheckpointHandoffCases) {
    assert.equal(checkpointCase.approvalGrant.produced, false);
    assert.equal(checkpointCase.approvalGrant.persisted, false);
    assert.equal(checkpointCase.approvalGrant.grantId, null);
    assert.equal(checkpointCase.reviewerRoutingPerformed, false);
    assert.equal(checkpointCase.reviewerAssignmentPerformed, false);
    assert.equal(checkpointCase.evaluatorExecuted, false);
    assert.equal(checkpointCase.evaluatorResultProduced, false);
    assert.equal(checkpointCase.approvalDecisionProduced, false);
    assert.equal(checkpointCase.approvalGrantProduced, false);
    assert.equal(checkpointCase.runtimePermissionGranted, false);
    assert.equal(checkpointCase.commandExposurePermissionGranted, false);
    assertAllFalse(checkpointCase.runtimeEffect);
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
  assert.deepEqual(
    fixture.consolidationCheckpointHandoffResultShape,
    expectedFixture().consolidationCheckpointHandoffResultShape
  );
});

test("serve-runtime remains default-blocked and dry-run cannot bypass Phase 5.43", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-43-runtime-"));

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

test("Phase 5.43 checkpoint handoff command names remain rejected", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-43-commands-"));

  try {
    for (const command of checkpointHandoffCommandProbes) {
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

test("Phase 5.43 does not change CLI or Rust runtime source", async () => {
  const currentCliSource = await readFile(cliSourceUrl, "utf8");
  const currentRustLibSource = await readFile(rustLibSourceUrl, "utf8");
  const currentRustStdioSource = await readFile(rustStdioSourceUrl, "utf8");
  const { stdout: baselineCliSource } = await execFileAsync("git", [
    "show",
    `${phase543BaselineCommit}:apps/cli/src/index.mjs`
  ], {
    cwd: repoRoot,
    maxBuffer: 1024 * 1024
  });
  const { stdout: baselineRustLibSource } = await execFileAsync("git", [
    "show",
    `${phase543BaselineCommit}:crates/ardyn-host/src/lib.rs`
  ], {
    cwd: repoRoot,
    maxBuffer: 1024 * 1024
  });
  const { stdout: baselineRustStdioSource } = await execFileAsync("git", [
    "show",
    `${phase543BaselineCommit}:crates/ardyn-host/src/stdio_runtime/mod.rs`
  ], {
    cwd: repoRoot,
    maxBuffer: 1024 * 1024
  });

  assert.equal(currentCliSource, baselineCliSource);
  assert.equal(currentRustLibSource, baselineRustLibSource);
  assert.equal(currentRustStdioSource, baselineRustStdioSource);
  assert.doesNotMatch(
    currentCliSource,
    /createReviewOnlyConsolidationCheckpointHandoffForReview/
  );
  assert.doesNotMatch(currentCliSource, /consolidation-checkpoint-handoff/);
});
