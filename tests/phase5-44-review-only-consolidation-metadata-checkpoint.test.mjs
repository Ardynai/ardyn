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
  REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_SCHEMA,
  createReviewOnlyConsolidationMetadataCheckpointForReview
} from "../packages/core/src/index.mjs";

const fixtureOnly = process.env.ARDYN_PHASE544_FIXTURE_ONLY === "1";
const execFileAsync = promisify(execFile);
const phase544BaselineCommit = "f0fe56892d801b25087554b69536de545e6245cc";
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
const phase543FixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-43/review-only-consolidation-checkpoint-handoff.json",
  import.meta.url
);
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-44/review-only-consolidation-metadata-checkpoint.json",
  import.meta.url
);
const phase543Fixture = JSON.parse(
  readFileSync(fileURLToPath(phase543FixtureUrl), "utf8")
);

const expectedTopLevelKeys = Object.freeze([
  "schema",
  "schemaVersion",
  "phase",
  "consolidationMetadataCheckpointKind",
  "metadataGeneratedAt",
  "sourcePhase",
  "consolidationMetadataCheckpointSummary",
  "consolidationMetadataCheckpointInputShape",
  "consolidationMetadataCheckpointResultShape",
  "consolidationMetadataCheckpointCases",
  "nestedSourceRegressionCases",
  "consolidationMetadataCheckpoint",
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
  "missing-review-only-consolidation-metadata-checkpoint-input-rejected",
  "malformed-review-only-consolidation-metadata-checkpoint-input-rejected",
  "malformed-review-only-consolidation-metadata-checkpoint-invalid-reviewed-at-rejected",
  "empty-review-only-consolidation-metadata-checkpoint-input-rejected",
  "conflicting-review-only-consolidation-metadata-checkpoint-input-rejected",
  "stale-review-only-consolidation-metadata-checkpoint-input-rejected",
  "revoked-review-only-consolidation-metadata-checkpoint-input-rejected",
  "unknown-review-only-consolidation-metadata-checkpoint-input-rejected",
  "duplicate-invalid-review-only-consolidation-metadata-checkpoint-input-rejected",
  "authorizing-looking-review-only-consolidation-metadata-checkpoint-input-rejected",
  "grant-looking-review-only-consolidation-metadata-checkpoint-input-rejected",
  "approval-decision-looking-review-only-consolidation-metadata-checkpoint-input-rejected",
  "approval-grant-looking-review-only-consolidation-metadata-checkpoint-input-rejected",
  "evaluator-result-looking-review-only-consolidation-metadata-checkpoint-input-rejected",
  "evaluator-execution-looking-review-only-consolidation-metadata-checkpoint-input-rejected",
  "reviewer-routing-looking-review-only-consolidation-metadata-checkpoint-input-rejected",
  "reviewer-assignment-looking-review-only-consolidation-metadata-checkpoint-input-rejected",
  "runtime-permission-looking-review-only-consolidation-metadata-checkpoint-input-rejected",
  "command-exposure-looking-review-only-consolidation-metadata-checkpoint-input-rejected",
  "runtime-effect-true-review-only-consolidation-metadata-checkpoint-input-rejected",
  "process-flag-true-review-only-consolidation-metadata-checkpoint-input-rejected",
  "unsafe-top-level-review-only-consolidation-metadata-checkpoint-input-rejected",
  "unsafe-nested-consolidation-metadata-checkpoint-input-rejected",
  "malformed-nested-entries-or-arrays-review-only-consolidation-metadata-checkpoint-input-rejected",
  "external-system-looking-review-only-consolidation-metadata-checkpoint-input-rejected",
  "connector-permission-looking-review-only-consolidation-metadata-checkpoint-input-rejected",
  "execution-signal-looking-review-only-consolidation-metadata-checkpoint-input-rejected",
  "mismatched-source-digest-review-only-consolidation-metadata-checkpoint-input-rejected",
  "valid-review-only-consolidation-metadata-checkpoint"
]);

const expectedClassifications = Object.freeze({
  "missing-review-only-consolidation-metadata-checkpoint-input-rejected":
    "missing_review_only_consolidation_metadata_checkpoint_input_rejected",
  "malformed-review-only-consolidation-metadata-checkpoint-input-rejected":
    "malformed_review_only_consolidation_metadata_checkpoint_input_rejected",
  "malformed-review-only-consolidation-metadata-checkpoint-invalid-reviewed-at-rejected":
    "malformed_review_only_consolidation_metadata_checkpoint_input_rejected",
  "empty-review-only-consolidation-metadata-checkpoint-input-rejected":
    "empty_review_only_consolidation_metadata_checkpoint_input_rejected",
  "conflicting-review-only-consolidation-metadata-checkpoint-input-rejected":
    "conflicting_review_only_consolidation_metadata_checkpoint_input_rejected",
  "stale-review-only-consolidation-metadata-checkpoint-input-rejected":
    "stale_review_only_consolidation_metadata_checkpoint_input_rejected",
  "revoked-review-only-consolidation-metadata-checkpoint-input-rejected":
    "revoked_review_only_consolidation_metadata_checkpoint_input_rejected",
  "unknown-review-only-consolidation-metadata-checkpoint-input-rejected":
    "unknown_review_only_consolidation_metadata_checkpoint_input_rejected",
  "duplicate-invalid-review-only-consolidation-metadata-checkpoint-input-rejected":
    "duplicate_invalid_review_only_consolidation_metadata_checkpoint_input_rejected",
  "authorizing-looking-review-only-consolidation-metadata-checkpoint-input-rejected":
    "authorizing_review_only_consolidation_metadata_checkpoint_input_rejected",
  "grant-looking-review-only-consolidation-metadata-checkpoint-input-rejected":
    "grant_looking_review_only_consolidation_metadata_checkpoint_input_rejected",
  "approval-decision-looking-review-only-consolidation-metadata-checkpoint-input-rejected":
    "approval_decision_looking_review_only_consolidation_metadata_checkpoint_input_rejected",
  "approval-grant-looking-review-only-consolidation-metadata-checkpoint-input-rejected":
    "approval_grant_looking_review_only_consolidation_metadata_checkpoint_input_rejected",
  "evaluator-result-looking-review-only-consolidation-metadata-checkpoint-input-rejected":
    "evaluator_result_looking_review_only_consolidation_metadata_checkpoint_input_rejected",
  "evaluator-execution-looking-review-only-consolidation-metadata-checkpoint-input-rejected":
    "evaluator_execution_looking_review_only_consolidation_metadata_checkpoint_input_rejected",
  "reviewer-routing-looking-review-only-consolidation-metadata-checkpoint-input-rejected":
    "reviewer_routing_looking_review_only_consolidation_metadata_checkpoint_input_rejected",
  "reviewer-assignment-looking-review-only-consolidation-metadata-checkpoint-input-rejected":
    "reviewer_assignment_looking_review_only_consolidation_metadata_checkpoint_input_rejected",
  "runtime-permission-looking-review-only-consolidation-metadata-checkpoint-input-rejected":
    "runtime_permission_looking_review_only_consolidation_metadata_checkpoint_input_rejected",
  "command-exposure-looking-review-only-consolidation-metadata-checkpoint-input-rejected":
    "command_exposure_looking_review_only_consolidation_metadata_checkpoint_input_rejected",
  "runtime-effect-true-review-only-consolidation-metadata-checkpoint-input-rejected":
    "runtime_effect_true_review_only_consolidation_metadata_checkpoint_input_rejected",
  "process-flag-true-review-only-consolidation-metadata-checkpoint-input-rejected":
    "process_flag_true_review_only_consolidation_metadata_checkpoint_input_rejected",
  "unsafe-top-level-review-only-consolidation-metadata-checkpoint-input-rejected":
    "unsafe_review_only_consolidation_metadata_checkpoint_input_rejected",
  "unsafe-nested-consolidation-metadata-checkpoint-input-rejected":
    "unsafe_review_only_consolidation_metadata_checkpoint_input_rejected",
  "malformed-nested-entries-or-arrays-review-only-consolidation-metadata-checkpoint-input-rejected":
    "malformed_review_only_consolidation_metadata_checkpoint_input_rejected",
  "external-system-looking-review-only-consolidation-metadata-checkpoint-input-rejected":
    "unsafe_review_only_consolidation_metadata_checkpoint_input_rejected",
  "connector-permission-looking-review-only-consolidation-metadata-checkpoint-input-rejected":
    "grant_looking_review_only_consolidation_metadata_checkpoint_input_rejected",
  "execution-signal-looking-review-only-consolidation-metadata-checkpoint-input-rejected":
    "execution_signal_looking_review_only_consolidation_metadata_checkpoint_input_rejected",
  "mismatched-source-digest-review-only-consolidation-metadata-checkpoint-input-rejected":
    "mismatched_source_digest_review_only_consolidation_metadata_checkpoint_input_rejected",
  "valid-review-only-consolidation-metadata-checkpoint":
    "valid_review_only_consolidation_metadata_checkpoint_runtime_still_blocked"
});

const checkpointCommandProbes = Object.freeze([
  "review-only-consolidation-metadata-checkpoint",
  "create-review-only-consolidation-metadata-checkpoint",
  "consolidation-metadata-checkpoint",
  "phase-5-44-review-only-consolidation-metadata-checkpoint",
  "reviewer-routing",
  "reviewer-assignment",
  "evaluator-execution",
  "approval-grant"
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

function validConsolidationCheckpointHandoff() {
  return clone(phase543Fixture.consolidationCheckpointHandoff);
}

function checkpointWith(overrides = {}) {
  return {
    ...validConsolidationCheckpointHandoff(),
    ...overrides
  };
}

function checkpointWithSummary(nestedKey, nestedValue = true) {
  const checkpoint = validConsolidationCheckpointHandoff();
  checkpoint.consolidationCheckpointHandoffSummary = {
    ...checkpoint.consolidationCheckpointHandoffSummary,
    [nestedKey]: nestedValue
  };
  return checkpoint;
}

function checkpointWithCleanupEvidence(nestedKey, nestedValue = true) {
  const checkpoint = validConsolidationCheckpointHandoff();
  checkpoint.cleanupHardeningToolkitEvidence = {
    ...checkpoint.cleanupHardeningToolkitEvidence,
    [nestedKey]: nestedValue
  };
  return checkpoint;
}

function checkpointWithSourceHandoff(nestedKey, nestedValue = true) {
  const checkpoint = validConsolidationCheckpointHandoff();
  checkpoint.sourceHandoffMetadataConsolidationLayer = {
    ...checkpoint.sourceHandoffMetadataConsolidationLayer,
    [nestedKey]: nestedValue
  };
  return checkpoint;
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
    "sourceConsolidationCheckpointHandoffDigest"
  );
}

function createResult(entries, options = {}) {
  const input = {
    reviewedAt,
    consolidationCheckpointHandoffEntries: entries,
    ...options
  };

  if (inputNeedsSourceDigest(input) && firstEntryDigestable(entries)) {
    input.sourceConsolidationCheckpointHandoffDigest = stableDigest(entries[0]);
  }

  return createReviewOnlyConsolidationMetadataCheckpointForReview(input);
}

function caseSummary(caseId, result) {
  return {
    caseId,
    classification: result.classification,
    reviewOnly: result.reviewOnly,
    authoritative: result.authoritative,
    reviewArtifactOnly: result.reviewArtifactOnly,
    sourceConsolidationCheckpointHandoffAccepted:
      result.sourceConsolidationCheckpointHandoffAccepted,
    consolidationMetadataCheckpointProduced:
      result.consolidationMetadataCheckpointProduced,
    consolidationMetadataCheckpointIsReviewerRouting:
      result.consolidationMetadataCheckpointIsReviewerRouting,
    consolidationMetadataCheckpointIsReviewerAssignment:
      result.consolidationMetadataCheckpointIsReviewerAssignment,
    consolidationMetadataCheckpointIsEvaluatorExecution:
      result.consolidationMetadataCheckpointIsEvaluatorExecution,
    consolidationMetadataCheckpointIsEvaluatorResult:
      result.consolidationMetadataCheckpointIsEvaluatorResult,
    consolidationMetadataCheckpointIsApprovalDecision:
      result.consolidationMetadataCheckpointIsApprovalDecision,
    consolidationMetadataCheckpointIsApprovalGrant:
      result.consolidationMetadataCheckpointIsApprovalGrant,
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

function consolidationMetadataCheckpointCases() {
  const validCheckpoint = validConsolidationCheckpointHandoff();
  const conflicting = checkpointWith({ reviewedAt: "2026-06-18T00:00:01.000Z" });
  return [
    [
      "missing-review-only-consolidation-metadata-checkpoint-input-rejected",
      createReviewOnlyConsolidationMetadataCheckpointForReview({
        reviewedAt,
        sourceConsolidationCheckpointHandoffDigest: stableDigest(validCheckpoint)
      })
    ],
    [
      "malformed-review-only-consolidation-metadata-checkpoint-input-rejected",
      createReviewOnlyConsolidationMetadataCheckpointForReview(null)
    ],
    [
      "malformed-review-only-consolidation-metadata-checkpoint-invalid-reviewed-at-rejected",
      createReviewOnlyConsolidationMetadataCheckpointForReview({
        reviewedAt: "not-a-date",
        sourceConsolidationCheckpointHandoffDigest: stableDigest(validCheckpoint),
        consolidationCheckpointHandoffEntries: [validCheckpoint]
      })
    ],
    ["empty-review-only-consolidation-metadata-checkpoint-input-rejected", createResult([])],
    [
      "conflicting-review-only-consolidation-metadata-checkpoint-input-rejected",
      createResult([validConsolidationCheckpointHandoff(), conflicting])
    ],
    [
      "stale-review-only-consolidation-metadata-checkpoint-input-rejected",
      createResult([checkpointWith({ reviewedAt: "2026-06-17T23:59:59.000Z" })])
    ],
    [
      "revoked-review-only-consolidation-metadata-checkpoint-input-rejected",
      createResult([checkpointWith({ status: "revoked" })])
    ],
    [
      "unknown-review-only-consolidation-metadata-checkpoint-input-rejected",
      createResult([checkpointWith({ status: "unknown" })])
    ],
    [
      "duplicate-invalid-review-only-consolidation-metadata-checkpoint-input-rejected",
      createResult([
        validConsolidationCheckpointHandoff(),
        validConsolidationCheckpointHandoff()
      ])
    ],
    [
      "authorizing-looking-review-only-consolidation-metadata-checkpoint-input-rejected",
      createResult([checkpointWithSummary("canGrantRuntime")])
    ],
    [
      "grant-looking-review-only-consolidation-metadata-checkpoint-input-rejected",
      createResult([checkpointWithSummary("grant")])
    ],
    [
      "approval-decision-looking-review-only-consolidation-metadata-checkpoint-input-rejected",
      createResult([checkpointWith({ approvalDecisionProduced: true })])
    ],
    [
      "approval-grant-looking-review-only-consolidation-metadata-checkpoint-input-rejected",
      createResult([checkpointWith({ approvalGrantProduced: true })])
    ],
    [
      "evaluator-result-looking-review-only-consolidation-metadata-checkpoint-input-rejected",
      createResult([checkpointWith({ evaluatorResultProduced: true })])
    ],
    [
      "evaluator-execution-looking-review-only-consolidation-metadata-checkpoint-input-rejected",
      createResult([checkpointWith({ evaluatorExecuted: true })])
    ],
    [
      "reviewer-routing-looking-review-only-consolidation-metadata-checkpoint-input-rejected",
      createResult([checkpointWith({ reviewerRoutingEnabled: true })])
    ],
    [
      "reviewer-assignment-looking-review-only-consolidation-metadata-checkpoint-input-rejected",
      createResult([checkpointWith({ reviewerAssignmentEnabled: true })])
    ],
    [
      "runtime-permission-looking-review-only-consolidation-metadata-checkpoint-input-rejected",
      createResult([checkpointWith({ runtimePermissionGranted: true })])
    ],
    [
      "command-exposure-looking-review-only-consolidation-metadata-checkpoint-input-rejected",
      createResult([checkpointWith({ commandExposurePermissionGranted: true })])
    ],
    [
      "runtime-effect-true-review-only-consolidation-metadata-checkpoint-input-rejected",
      createResult([
        checkpointWith({
          runtimeEffect: {
            ...validConsolidationCheckpointHandoff().runtimeEffect,
            runtimeEnabled: true
          }
        })
      ])
    ],
    [
      "process-flag-true-review-only-consolidation-metadata-checkpoint-input-rejected",
      createResult([checkpointWithSummary("processControlEnabled")])
    ],
    [
      "unsafe-top-level-review-only-consolidation-metadata-checkpoint-input-rejected",
      createResult([checkpointWith({ consolidationMetadataCheckpoint: {} })])
    ],
    [
      "unsafe-nested-consolidation-metadata-checkpoint-input-rejected",
      createResult([checkpointWithSummary("consolidationMetadataCheckpoint", {})])
    ],
    [
      "malformed-nested-entries-or-arrays-review-only-consolidation-metadata-checkpoint-input-rejected",
      createResult([checkpointWithSummary("entries", [])])
    ],
    [
      "external-system-looking-review-only-consolidation-metadata-checkpoint-input-rejected",
      createResult([checkpointWithSummary("externalSystem", { name: "onyx" })])
    ],
    [
      "connector-permission-looking-review-only-consolidation-metadata-checkpoint-input-rejected",
      createResult([checkpointWithSummary("connectorPermissionGranted")])
    ],
    [
      "execution-signal-looking-review-only-consolidation-metadata-checkpoint-input-rejected",
      createResult([checkpointWithSummary("executionSignal")])
    ],
    [
      "mismatched-source-digest-review-only-consolidation-metadata-checkpoint-input-rejected",
      createResult([validConsolidationCheckpointHandoff()], {
        sourceConsolidationCheckpointHandoffDigest: `sha256:${"0".repeat(64)}`
      })
    ],
    [
      "valid-review-only-consolidation-metadata-checkpoint",
      createResult([validConsolidationCheckpointHandoff()])
    ]
  ].map(([caseId, result]) => caseSummary(caseId, result));
}

function nestedSourceRegressionCases() {
  const cases = [
    [
      "missing-source-consolidation-checkpoint-handoff-digest",
      () =>
        createReviewOnlyConsolidationMetadataCheckpointForReview({
          reviewedAt,
          consolidationCheckpointHandoffEntries: [
            validConsolidationCheckpointHandoff()
          ]
        }),
      "malformed_review_only_consolidation_metadata_checkpoint_input_rejected"
    ],
    [
      "malformed-source-consolidation-checkpoint-handoff-digest",
      () =>
        createReviewOnlyConsolidationMetadataCheckpointForReview({
          reviewedAt,
          sourceConsolidationCheckpointHandoffDigest: "sha256:nothex",
          consolidationCheckpointHandoffEntries: [
            validConsolidationCheckpointHandoff()
          ]
        }),
      "malformed_review_only_consolidation_metadata_checkpoint_input_rejected"
    ],
    [
      "mismatched-source-consolidation-checkpoint-handoff-digest",
      () =>
        createResult([validConsolidationCheckpointHandoff()], {
          sourceConsolidationCheckpointHandoffDigest: `sha256:${"1".repeat(64)}`
        }),
      "mismatched_source_digest_review_only_consolidation_metadata_checkpoint_input_rejected"
    ],
    [
      "missing-nested-source-handoff-metadata-consolidation-layer-digest",
      () => {
        const checkpoint = validConsolidationCheckpointHandoff();
        delete checkpoint.sourceHandoffMetadataConsolidationLayer.stateDigest;
        return createResult([checkpoint]);
      },
      "malformed_review_only_consolidation_metadata_checkpoint_input_rejected"
    ],
    [
      "malformed-nested-source-handoff-metadata-consolidation-layer-digest",
      () => {
        const checkpoint = validConsolidationCheckpointHandoff();
        checkpoint.sourceHandoffMetadataConsolidationLayer.stateDigest = 42;
        return createResult([checkpoint]);
      },
      "malformed_review_only_consolidation_metadata_checkpoint_input_rejected"
    ],
    [
      "nested-approval-grant-rejected",
      () => createResult([checkpointWithSourceHandoff("approvalGrantProduced")]),
      "approval_grant_looking_review_only_consolidation_metadata_checkpoint_input_rejected"
    ],
    [
      "nested-approval-decision-rejected",
      () => createResult([checkpointWithSourceHandoff("approvalDecisionProduced")]),
      "approval_decision_looking_review_only_consolidation_metadata_checkpoint_input_rejected"
    ],
    [
      "nested-reviewer-assignment-rejected",
      () => createResult([checkpointWithSourceHandoff("reviewerAssignmentPerformed")]),
      "reviewer_assignment_looking_review_only_consolidation_metadata_checkpoint_input_rejected"
    ],
    [
      "nested-reviewer-routing-rejected",
      () => createResult([checkpointWithSourceHandoff("reviewerRoutingPerformed")]),
      "reviewer_routing_looking_review_only_consolidation_metadata_checkpoint_input_rejected"
    ],
    [
      "nested-evaluator-execution-rejected",
      () => createResult([checkpointWithSourceHandoff("evaluatorExecuted")]),
      "evaluator_execution_looking_review_only_consolidation_metadata_checkpoint_input_rejected"
    ],
    [
      "nested-evaluator-result-rejected",
      () => createResult([checkpointWithSourceHandoff("evaluatorResultProduced")]),
      "evaluator_result_looking_review_only_consolidation_metadata_checkpoint_input_rejected"
    ],
    [
      "nested-runtime-effect-rejected",
      () =>
        createResult([
          checkpointWithSourceHandoff("runtimeEffectAllFalse", false)
        ]),
      "runtime_effect_true_review_only_consolidation_metadata_checkpoint_input_rejected"
    ],
    [
      "nested-command-exposure-rejected",
      () =>
        createResult([
          checkpointWithSourceHandoff("commandExposurePermissionGranted", true)
        ]),
      "command_exposure_looking_review_only_consolidation_metadata_checkpoint_input_rejected"
    ],
    [
      "nested-external-source-lookup-rejected",
      () => createResult([checkpointWithSummary("externalSourceLookup", true)]),
      "unsafe_review_only_consolidation_metadata_checkpoint_input_rejected"
    ],
    [
      "nested-filesystem-watcher-rejected",
      () => createResult([checkpointWithSummary("filesystemWatcher", true)]),
      "unsafe_review_only_consolidation_metadata_checkpoint_input_rejected"
    ],
    [
      "nested-source-url-rejected",
      () =>
        createResult([
          checkpointWithSourceHandoff("url", "https://example.invalid/source.json")
        ]),
      "unsafe_review_only_consolidation_metadata_checkpoint_input_rejected"
    ],
    [
      "nested-source-file-path-rejected",
      () =>
        createResult([
          checkpointWithSourceHandoff("filePath", "C:\\tmp\\phase-5-44.json")
        ]),
      "unsafe_review_only_consolidation_metadata_checkpoint_input_rejected"
    ],
    [
      "nested-env-field-rejected",
      () => createResult([checkpointWithCleanupEvidence("env", "SECRET=1")]),
      "unsafe_review_only_consolidation_metadata_checkpoint_input_rejected"
    ],
    [
      "nested-secrets-field-rejected",
      () => createResult([checkpointWithCleanupEvidence("secrets", true)]),
      "unsafe_review_only_consolidation_metadata_checkpoint_input_rejected"
    ],
    [
      "nested-process-control-field-rejected",
      () => createResult([checkpointWithSummary("processControlEnabled", true)]),
      "process_flag_true_review_only_consolidation_metadata_checkpoint_input_rejected"
    ],
    [
      "nested-external-system-metadata-rejected",
      () => createResult([checkpointWithSourceHandoff("externalSystem", "goose")]),
      "unsafe_review_only_consolidation_metadata_checkpoint_input_rejected"
    ],
    [
      "nested-connector-permission-grant-rejected",
      () => createResult([checkpointWithSummary("connectorAccessGranted", true)]),
      "grant_looking_review_only_consolidation_metadata_checkpoint_input_rejected"
    ],
    [
      "malformed-source-entry-null-rejected",
      () =>
        createReviewOnlyConsolidationMetadataCheckpointForReview({
          reviewedAt,
          sourceConsolidationCheckpointHandoffDigest: stableDigest(
            validConsolidationCheckpointHandoff()
          ),
          consolidationCheckpointHandoffEntries: [null]
        }),
      "malformed_review_only_consolidation_metadata_checkpoint_input_rejected"
    ],
    [
      "malformed-source-entry-array-rejected",
      () =>
        createReviewOnlyConsolidationMetadataCheckpointForReview({
          reviewedAt,
          sourceConsolidationCheckpointHandoffDigest: stableDigest(
            validConsolidationCheckpointHandoff()
          ),
          consolidationCheckpointHandoffEntries: [
            [validConsolidationCheckpointHandoff()]
          ]
        }),
      "malformed_review_only_consolidation_metadata_checkpoint_input_rejected"
    ],
    [
      "malformed-nested-entry-array-rejected",
      () => createResult([checkpointWithSummary("sourceEntries", [])]),
      "malformed_review_only_consolidation_metadata_checkpoint_input_rejected"
    ]
  ];

  return cases.map(([caseId, produceResult, expectedClassification]) => {
    const result = produceResult();
    return {
      caseId,
      classification: result.classification,
      expectedClassification,
      consolidationMetadataCheckpointProduced:
        result.consolidationMetadataCheckpointProduced,
      approvalGrantProduced: result.approvalGrantProduced,
      approvalGrantPersisted: result.approvalGrantPersisted,
      runtimeExecutionEnabled: result.runtimeExecutionEnabled,
      commandExposurePermissionGranted: result.commandExposurePermissionGranted,
      runtimeEffect: result.runtimeEffect
    };
  });
}

function expectedFixture() {
  const validCheckpoint = validConsolidationCheckpointHandoff();
  const validResult = createResult([validCheckpoint]);
  return {
    schema: REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_SCHEMA,
    schemaVersion: "0.1.0",
    phase: "phase-5.44-review-only-consolidation-metadata-checkpoint",
    consolidationMetadataCheckpointKind:
      "review-only-consolidation-metadata-checkpoint",
    metadataGeneratedAt: reviewedAt,
    sourcePhase: {
      phase: "phase-5.43-review-only-consolidation-checkpoint-handoff",
      consolidationCheckpointHandoffPath:
        "packages/core/src/index.mjs#createReviewOnlyConsolidationCheckpointHandoffForReview",
      consolidationMetadataCheckpointPath:
        "packages/core/src/index.mjs#createReviewOnlyConsolidationMetadataCheckpointForReview",
      sourceConsolidationCheckpointHandoffFixture:
        "tests/fixtures/host-policy/phase5-43/review-only-consolidation-checkpoint-handoff.json",
      cleanupHardeningToolkitEvidence: "installed-tools-only-no-installs",
      runtimeEnabled: false,
      reviewerRoutingPerformed: false,
      reviewerAssignmentPerformed: false,
      approvalDecisionProduced: false,
      approvalGrantProduced: false,
      evaluatorExecutionPerformed: false
    },
    consolidationMetadataCheckpointSummary: {
      reviewOnlyConsolidationMetadataCheckpointRecorded: true,
      consolidationMetadataCheckpointKind:
        "review-only-consolidation-metadata-checkpoint",
      consolidationMetadataCheckpointReviewOnly: true,
      consolidationMetadataCheckpointAuthoritative: false,
      validConsolidationCheckpointHandoffProducesMetadataCheckpoint: true,
      missingConsolidationCheckpointHandoffRejected: true,
      malformedConsolidationCheckpointHandoffRejected: true,
      emptyConsolidationCheckpointHandoffRejected: true,
      conflictingConsolidationCheckpointHandoffRejected: true,
      staleConsolidationCheckpointHandoffRejected: true,
      revokedConsolidationCheckpointHandoffRejected: true,
      unknownConsolidationCheckpointHandoffRejected: true,
      duplicateInvalidConsolidationCheckpointHandoffRejected: true,
      authorizingLookingConsolidationCheckpointHandoffRejected: true,
      grantLookingConsolidationCheckpointHandoffRejected: true,
      approvalDecisionLookingConsolidationCheckpointHandoffRejected: true,
      approvalGrantLookingConsolidationCheckpointHandoffRejected: true,
      evaluatorResultLookingConsolidationCheckpointHandoffRejected: true,
      evaluatorExecutionLookingConsolidationCheckpointHandoffRejected: true,
      reviewerRoutingLookingConsolidationCheckpointHandoffRejected: true,
      reviewerAssignmentLookingConsolidationCheckpointHandoffRejected: true,
      runtimePermissionLookingConsolidationCheckpointHandoffRejected: true,
      commandExposureLookingConsolidationCheckpointHandoffRejected: true,
      runtimeEffectTrueConsolidationCheckpointHandoffRejected: true,
      processFlagTrueConsolidationCheckpointHandoffRejected: true,
      unsafeConsolidationMetadataCheckpointRejected: true,
      malformedNestedEntriesOrArraysRejected: true,
      externalSystemLookingMetadataRejected: true,
      connectorPermissionLookingMetadataRejected: true,
      executionSignalLookingConsolidationCheckpointHandoffRejected: true,
      nestedApprovalGrantRejected: true,
      nestedApprovalDecisionRejected: true,
      nestedReviewerAssignmentRejected: true,
      nestedReviewerRoutingRejected: true,
      nestedEvaluatorExecutionRejected: true,
      nestedEvaluatorResultRejected: true,
      nestedRuntimeEffectRejected: true,
      nestedCommandExposureRejected: true,
      nestedExternalSourceLookupRejected: true,
      nestedFilesystemWatcherRejected: true,
      nestedUrlFilePathEnvSecretsProcessControlRejected: true,
      missingMalformedOrMismatchedSourceDigestRejected: true,
      malformedSourceEntryArraysRejected: true,
      consolidationMetadataCheckpointIsReviewerRouting: false,
      consolidationMetadataCheckpointIsReviewerAssignment: false,
      consolidationMetadataCheckpointIsEvaluatorExecution: false,
      consolidationMetadataCheckpointIsEvaluatorResult: false,
      consolidationMetadataCheckpointIsApprovalDecision: false,
      consolidationMetadataCheckpointIsApprovalGrant: false,
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
      toolsInstalledByPhase544: false,
      megaLinterRun: false,
      broadTrunkRewriteRun: false,
      fallowRuntimeUsed: false,
      serveRuntimeStillDefaultBlocked: true,
      dryRunBypassesBlock: false,
      canEnableRuntime: false
    },
    consolidationMetadataCheckpointInputShape: {
      consolidationCheckpointHandoffEntries:
        "exactly one Phase 5.43 review-only consolidation checkpoint handoff state",
      consolidationCheckpointHandoffSchema:
        "ardyn.phase-5.43.review-only-consolidation-checkpoint-handoff-state",
      consolidationCheckpointHandoffMode: "review-only",
      validConsolidationCheckpointHandoffRequired: true,
      sourceConsolidationCheckpointHandoffDigestRequired: true,
      authorizingLookingMetadataPolicy: "fail-closed",
      grantLookingMetadataPolicy: "fail-closed",
      reviewerRoutingLookingMetadataPolicy: "fail-closed",
      reviewerAssignmentLookingMetadataPolicy: "fail-closed",
      evaluatorExecutionLookingMetadataPolicy: "fail-closed",
      runtimeEffectTrueMetadataPolicy: "fail-closed",
      processFlagTrueMetadataPolicy: "fail-closed",
      unsafeTopLevelMetadataPolicy: "fail-closed",
      unsafeNestedConsolidationMetadataCheckpointPolicy: "fail-closed",
      externalSystemLookingMetadataPolicy: "fail-closed",
      connectorPermissionLookingMetadataPolicy: "fail-closed",
      malformedNestedEntriesOrArraysPolicy: "fail-closed",
      executionSignalLookingMetadataPolicy: "fail-closed",
      filesystemWatcherAllowed: false,
      externalSourceLookupAllowed: false,
      secretsEnvIngestionAllowed: false,
      processControlAllowed: false,
      filePathAllowed: false,
      urlAllowed: false
    },
    consolidationMetadataCheckpointResultShape: {
      schema:
        "ardyn.phase-5.44.review-only-consolidation-metadata-checkpoint-result",
      schemaVersion: "0.1.0",
      consolidationMetadataCheckpointKind:
        "review-only-consolidation-metadata-checkpoint",
      consolidationMetadataCheckpointMode: "review-only",
      stateSchema:
        "ardyn.phase-5.44.review-only-consolidation-metadata-checkpoint-state",
      stateKind: "review-only-consolidation-metadata-checkpoint-state",
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
    consolidationMetadataCheckpointCases: consolidationMetadataCheckpointCases(),
    nestedSourceRegressionCases: nestedSourceRegressionCases(),
    consolidationMetadataCheckpoint:
      validResult.consolidationMetadataCheckpoint,
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
      envSecretsIngested: false,
      connectorIngestionAdded: false,
      externalSystemIntegrated: false
    },
    filesAllowedToChange: [
      "packages/core/src/index.mjs",
      "packages/core/src/index.d.ts",
      "tests/phase5-44-review-only-consolidation-metadata-checkpoint.test.mjs",
      "tests/fixtures/host-policy/phase5-44/review-only-consolidation-metadata-checkpoint.json",
      "docs/phase-5-44-review-only-consolidation-metadata-checkpoint.md",
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
      "node --test tests/phase5-44-review-only-consolidation-metadata-checkpoint.test.mjs",
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
      "depcheck --json",
      "osv-scanner scan .",
      "trivy fs --scanners vuln,secret,misconfig .",
      "semgrep --config auto ."
    ]
  };
}

export { expectedFixture };

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

if (!fixtureOnly) test("Phase 5.44 consolidation metadata checkpoint fixture is deterministic metadata", async () => {
  const fixture = JSON.parse(await readFile(fixtureUrl, "utf8"));

  assert.deepEqual(Object.keys(fixture), expectedTopLevelKeys);
  assert.deepEqual(fixture, expectedFixture());
});

if (!fixtureOnly) test("Phase 5.44 consolidation metadata checkpoint classifies metadata cases", () => {
  const cases = consolidationMetadataCheckpointCases();

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
      checkpointCase.consolidationMetadataCheckpointIsReviewerRouting,
      false
    );
    assert.equal(
      checkpointCase.consolidationMetadataCheckpointIsReviewerAssignment,
      false
    );
    assert.equal(
      checkpointCase.consolidationMetadataCheckpointIsEvaluatorExecution,
      false
    );
    assert.equal(
      checkpointCase.consolidationMetadataCheckpointIsEvaluatorResult,
      false
    );
    assert.equal(
      checkpointCase.consolidationMetadataCheckpointIsApprovalDecision,
      false
    );
    assert.equal(
      checkpointCase.consolidationMetadataCheckpointIsApprovalGrant,
      false
    );
    assert.equal(checkpointCase.approvalGrant.produced, false);
    assert.equal(checkpointCase.approvalGrant.persisted, false);
    assert.equal(checkpointCase.approvalGrant.grantId, null);
    assertAllFalse(checkpointCase.runtimeEffect);
  }
});

if (!fixtureOnly) test("Phase 5.44 malformed metadata checkpoint input fails closed without throwing", () => {
  const digest = stableDigest(validConsolidationCheckpointHandoff());
  for (const input of [
    null,
    "bad",
    { reviewedAt: "bad" },
    {
      reviewedAt,
      sourceConsolidationCheckpointHandoffDigest: digest,
      consolidationCheckpointHandoffEntries: [null]
    },
    {
      reviewedAt,
      sourceConsolidationCheckpointHandoffDigest: digest,
      consolidationCheckpointHandoffEntries: [undefined]
    },
    {
      reviewedAt,
      sourceConsolidationCheckpointHandoffDigest: digest,
      consolidationCheckpointHandoffEntries: ["bad"]
    },
    {
      reviewedAt,
      sourceConsolidationCheckpointHandoffDigest: digest,
      consolidationCheckpointHandoffEntries: [42]
    },
    {
      reviewedAt,
      consolidationCheckpointHandoffEntries: [
        validConsolidationCheckpointHandoff()
      ]
    },
    {
      reviewedAt,
      sourceConsolidationCheckpointHandoffDigest: 42,
      consolidationCheckpointHandoffEntries: [
        validConsolidationCheckpointHandoff()
      ]
    }
  ]) {
    const result =
      createReviewOnlyConsolidationMetadataCheckpointForReview(input);

    assert.equal(
      result.classification,
      "malformed_review_only_consolidation_metadata_checkpoint_input_rejected"
    );
    assert.equal(result.consolidationMetadataCheckpointProduced, false);
    assert.equal(result.consolidationMetadataCheckpoint, null);
    assert.equal(result.approvalGrantProduced, false);
    assert.equal(result.runtimeExecutionEnabled, false);
    assertAllFalse(result.runtimeEffect);
  }
});

if (!fixtureOnly) test("Phase 5.44 valid checkpoint handoff produces only consolidation metadata", () => {
  const sourceCheckpoint = validConsolidationCheckpointHandoff();
  const sourceDigest = stableDigest(sourceCheckpoint);
  const result = createResult([sourceCheckpoint]);
  const checkpoint = result.consolidationMetadataCheckpoint;

  assert.equal(
    result.classification,
    "valid_review_only_consolidation_metadata_checkpoint_runtime_still_blocked"
  );
  assert.equal(result.sourceConsolidationCheckpointHandoffAccepted, true);
  assert.equal(result.consolidationMetadataCheckpointProduced, true);
  assert.equal(
    checkpoint.schema,
    "ardyn.phase-5.44.review-only-consolidation-metadata-checkpoint-state"
  );
  assert.equal(
    checkpoint.stateKind,
    "review-only-consolidation-metadata-checkpoint-state"
  );
  assert.equal(checkpoint.stateMode, "review-only");
  assert.equal(checkpoint.consolidationMetadataCheckpointMetadataOnly, true);
  assert.equal(
    checkpoint.sourceConsolidationCheckpointHandoff.stateDigest,
    sourceDigest
  );
  assert.match(
    checkpoint.sourceConsolidationCheckpointHandoff
      .sourceHandoffMetadataConsolidationLayerDigest,
    /^sha256:[0-9a-f]{64}$/
  );
  assert.equal(checkpoint.consolidationMetadataCheckpointIsReviewerRouting, false);
  assert.equal(
    checkpoint.consolidationMetadataCheckpointIsReviewerAssignment,
    false
  );
  assert.equal(
    checkpoint.consolidationMetadataCheckpointIsEvaluatorExecution,
    false
  );
  assert.equal(checkpoint.consolidationMetadataCheckpointIsEvaluatorResult, false);
  assert.equal(
    checkpoint.consolidationMetadataCheckpointIsApprovalDecision,
    false
  );
  assert.equal(checkpoint.consolidationMetadataCheckpointIsApprovalGrant, false);
  assert.equal(checkpoint.reviewerRoutingPerformed, false);
  assert.equal(checkpoint.reviewerAssignmentPerformed, false);
  assert.equal(checkpoint.evaluatorExecuted, false);
  assert.equal(checkpoint.evaluatorResultProduced, false);
  assert.equal(checkpoint.approvalDecisionProduced, false);
  assert.equal(checkpoint.approvalGrantProduced, false);
  assert.equal(checkpoint.approvalGrantPersisted, false);
  assert.equal(checkpoint.runtimePermissionGranted, false);
  assert.equal(checkpoint.commandExposurePermissionGranted, false);
  assert.equal(checkpoint.cleanupHardeningToolkitEvidence.cargoAuditRequired, true);
  assert.equal(checkpoint.cleanupHardeningToolkitEvidence.cargoMacheteRequired, true);
  assert.equal(
    checkpoint.cleanupHardeningToolkitEvidence.toolsInstalledByPhase544,
    false
  );
  assert.equal(checkpoint.cleanupHardeningToolkitEvidence.fallowRuntimeUsed, false);
  assertAllFalse(checkpoint.runtimeEffect);
});

if (!fixtureOnly) test("Phase 5.44 rejects unsafe nested Phase 5.43 source metadata", () => {
  const regressions = nestedSourceRegressionCases();

  for (const regression of regressions) {
    assert.equal(
      regression.classification,
      regression.expectedClassification,
      regression.caseId
    );
    assert.equal(regression.consolidationMetadataCheckpointProduced, false);
    assert.equal(regression.approvalGrantProduced, false);
    assert.equal(regression.approvalGrantPersisted, false);
    assert.equal(regression.runtimeExecutionEnabled, false);
    assert.equal(regression.commandExposurePermissionGranted, false);
    assertAllFalse(regression.runtimeEffect);
  }
});

if (!fixtureOnly) test("Phase 5.44 fixture mirrors metadata checkpoint cases and blocks authorization", async () => {
  const fixture = JSON.parse(await readFile(fixtureUrl, "utf8"));

  assert.deepEqual(
    fixture.consolidationMetadataCheckpointCases.map(({ caseId }) => caseId),
    expectedCaseIds
  );
  for (const checkpointCase of fixture.consolidationMetadataCheckpointCases) {
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
    fixture.consolidationMetadataCheckpointResultShape,
    expectedFixture().consolidationMetadataCheckpointResultShape
  );
});

if (!fixtureOnly) test("serve-runtime remains default-blocked and dry-run cannot bypass Phase 5.44", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-44-runtime-"));

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

if (!fixtureOnly) test("Phase 5.44 metadata checkpoint command names remain rejected", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-44-commands-"));

  try {
    for (const command of checkpointCommandProbes) {
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

if (!fixtureOnly) test("Phase 5.44 does not change CLI or Rust runtime source", async () => {
  const currentCliSource = await readFile(cliSourceUrl, "utf8");
  const currentRustLibSource = await readFile(rustLibSourceUrl, "utf8");
  const currentRustStdioSource = await readFile(rustStdioSourceUrl, "utf8");
  const { stdout: baselineCliSource } = await execFileAsync("git", [
    "show",
    `${phase544BaselineCommit}:apps/cli/src/index.mjs`
  ], {
    cwd: repoRoot,
    maxBuffer: 1024 * 1024
  });
  const { stdout: baselineRustLibSource } = await execFileAsync("git", [
    "show",
    `${phase544BaselineCommit}:crates/ardyn-host/src/lib.rs`
  ], {
    cwd: repoRoot,
    maxBuffer: 1024 * 1024
  });
  const { stdout: baselineRustStdioSource } = await execFileAsync("git", [
    "show",
    `${phase544BaselineCommit}:crates/ardyn-host/src/stdio_runtime/mod.rs`
  ], {
    cwd: repoRoot,
    maxBuffer: 1024 * 1024
  });

  assert.equal(currentCliSource, baselineCliSource);
  assert.equal(currentRustLibSource, baselineRustLibSource);
  assert.equal(currentRustStdioSource, baselineRustStdioSource);
  assert.doesNotMatch(
    currentCliSource,
    /createReviewOnlyConsolidationMetadataCheckpointForReview/
  );
  assert.doesNotMatch(currentCliSource, /consolidation-metadata-checkpoint/);
});
