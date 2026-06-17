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
  REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_SCHEMA,
  createReviewOnlyMetadataHandoffCheckpointForReview
} from "../packages/core/src/index.mjs";

const execFileAsync = promisify(execFile);
const phase541BaselineCommit = "c271f6f03e5d897f2469170aeb2f80a40a8f3e2d";
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
const phase540FixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-40/review-only-checkpoint-handoff-layer.json",
  import.meta.url
);
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-41/review-only-metadata-handoff-checkpoint.json",
  import.meta.url
);
const phase540Fixture = JSON.parse(
  readFileSync(fileURLToPath(phase540FixtureUrl), "utf8")
);

const expectedTopLevelKeys = Object.freeze([
  "schema",
  "schemaVersion",
  "phase",
  "metadataHandoffCheckpointKind",
  "metadataGeneratedAt",
  "sourcePhase",
  "metadataHandoffCheckpointSummary",
  "metadataHandoffCheckpointInputShape",
  "metadataHandoffCheckpointResultShape",
  "metadataHandoffCheckpointCases",
  "metadataHandoffCheckpoint",
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
  "missing-review-only-metadata-handoff-checkpoint-input-rejected",
  "malformed-review-only-metadata-handoff-checkpoint-input-rejected",
  "malformed-review-only-metadata-handoff-checkpoint-invalid-reviewed-at-rejected",
  "empty-review-only-metadata-handoff-checkpoint-input-rejected",
  "conflicting-review-only-metadata-handoff-checkpoint-input-rejected",
  "stale-review-only-metadata-handoff-checkpoint-input-rejected",
  "revoked-review-only-metadata-handoff-checkpoint-input-rejected",
  "unknown-review-only-metadata-handoff-checkpoint-input-rejected",
  "duplicate-invalid-review-only-metadata-handoff-checkpoint-input-rejected",
  "authorizing-looking-review-only-metadata-handoff-checkpoint-input-rejected",
  "grant-looking-review-only-metadata-handoff-checkpoint-input-rejected",
  "approval-decision-looking-review-only-metadata-handoff-checkpoint-input-rejected",
  "approval-grant-looking-review-only-metadata-handoff-checkpoint-input-rejected",
  "evaluator-result-looking-review-only-metadata-handoff-checkpoint-input-rejected",
  "evaluator-execution-looking-review-only-metadata-handoff-checkpoint-input-rejected",
  "reviewer-routing-looking-review-only-metadata-handoff-checkpoint-input-rejected",
  "reviewer-assignment-looking-review-only-metadata-handoff-checkpoint-input-rejected",
  "runtime-permission-looking-review-only-metadata-handoff-checkpoint-input-rejected",
  "command-exposure-looking-review-only-metadata-handoff-checkpoint-input-rejected",
  "runtime-effect-true-review-only-metadata-handoff-checkpoint-input-rejected",
  "process-flag-true-review-only-metadata-handoff-checkpoint-input-rejected",
  "unsafe-top-level-review-only-metadata-handoff-checkpoint-input-rejected",
  "unsafe-nested-checkpoint-handoff-metadata-review-only-metadata-handoff-checkpoint-input-rejected",
  "execution-signal-looking-review-only-metadata-handoff-checkpoint-input-rejected",
  "valid-review-only-metadata-handoff-checkpoint"
]);

const expectedClassifications = Object.freeze({
  "missing-review-only-metadata-handoff-checkpoint-input-rejected":
    "missing_review_only_metadata_handoff_checkpoint_input_rejected",
  "malformed-review-only-metadata-handoff-checkpoint-input-rejected":
    "malformed_review_only_metadata_handoff_checkpoint_input_rejected",
  "malformed-review-only-metadata-handoff-checkpoint-invalid-reviewed-at-rejected":
    "malformed_review_only_metadata_handoff_checkpoint_input_rejected",
  "empty-review-only-metadata-handoff-checkpoint-input-rejected":
    "empty_review_only_metadata_handoff_checkpoint_input_rejected",
  "conflicting-review-only-metadata-handoff-checkpoint-input-rejected":
    "conflicting_review_only_metadata_handoff_checkpoint_input_rejected",
  "stale-review-only-metadata-handoff-checkpoint-input-rejected":
    "stale_review_only_metadata_handoff_checkpoint_input_rejected",
  "revoked-review-only-metadata-handoff-checkpoint-input-rejected":
    "revoked_review_only_metadata_handoff_checkpoint_input_rejected",
  "unknown-review-only-metadata-handoff-checkpoint-input-rejected":
    "unknown_review_only_metadata_handoff_checkpoint_input_rejected",
  "duplicate-invalid-review-only-metadata-handoff-checkpoint-input-rejected":
    "duplicate_invalid_review_only_metadata_handoff_checkpoint_input_rejected",
  "authorizing-looking-review-only-metadata-handoff-checkpoint-input-rejected":
    "authorizing_review_only_metadata_handoff_checkpoint_input_rejected",
  "grant-looking-review-only-metadata-handoff-checkpoint-input-rejected":
    "grant_looking_review_only_metadata_handoff_checkpoint_input_rejected",
  "approval-decision-looking-review-only-metadata-handoff-checkpoint-input-rejected":
    "approval_decision_looking_review_only_metadata_handoff_checkpoint_input_rejected",
  "approval-grant-looking-review-only-metadata-handoff-checkpoint-input-rejected":
    "approval_grant_looking_review_only_metadata_handoff_checkpoint_input_rejected",
  "evaluator-result-looking-review-only-metadata-handoff-checkpoint-input-rejected":
    "evaluator_result_looking_review_only_metadata_handoff_checkpoint_input_rejected",
  "evaluator-execution-looking-review-only-metadata-handoff-checkpoint-input-rejected":
    "evaluator_execution_looking_review_only_metadata_handoff_checkpoint_input_rejected",
  "reviewer-routing-looking-review-only-metadata-handoff-checkpoint-input-rejected":
    "reviewer_routing_looking_review_only_metadata_handoff_checkpoint_input_rejected",
  "reviewer-assignment-looking-review-only-metadata-handoff-checkpoint-input-rejected":
    "reviewer_assignment_looking_review_only_metadata_handoff_checkpoint_input_rejected",
  "runtime-permission-looking-review-only-metadata-handoff-checkpoint-input-rejected":
    "runtime_permission_looking_review_only_metadata_handoff_checkpoint_input_rejected",
  "command-exposure-looking-review-only-metadata-handoff-checkpoint-input-rejected":
    "command_exposure_looking_review_only_metadata_handoff_checkpoint_input_rejected",
  "runtime-effect-true-review-only-metadata-handoff-checkpoint-input-rejected":
    "runtime_effect_true_review_only_metadata_handoff_checkpoint_input_rejected",
  "process-flag-true-review-only-metadata-handoff-checkpoint-input-rejected":
    "process_flag_true_review_only_metadata_handoff_checkpoint_input_rejected",
  "unsafe-top-level-review-only-metadata-handoff-checkpoint-input-rejected":
    "unsafe_review_only_metadata_handoff_checkpoint_input_rejected",
  "unsafe-nested-checkpoint-handoff-metadata-review-only-metadata-handoff-checkpoint-input-rejected":
    "unsafe_review_only_metadata_handoff_checkpoint_input_rejected",
  "execution-signal-looking-review-only-metadata-handoff-checkpoint-input-rejected":
    "execution_signal_looking_review_only_metadata_handoff_checkpoint_input_rejected",
  "valid-review-only-metadata-handoff-checkpoint":
    "valid_review_only_metadata_handoff_checkpoint_runtime_still_blocked"
});

const metadataHandoffCommandProbes = Object.freeze([
  "review-only-metadata-handoff-checkpoint",
  "create-review-only-metadata-handoff-checkpoint",
  "metadata-handoff-checkpoint",
  "phase-5-41-review-only-metadata-handoff-checkpoint",
  "reviewer-routing",
  "reviewer-assignment"
]);

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function validLayer() {
  return clone(phase540Fixture.checkpointHandoffLayer);
}

function layerWith(overrides = {}) {
  return {
    ...validLayer(),
    ...overrides
  };
}

function layerWithNested(objectKey, nestedKey, nestedValue = true) {
  const layer = validLayer();
  layer[objectKey] = {
    ...layer[objectKey],
    [nestedKey]: nestedValue
  };
  return layer;
}

function createResult(entries, options = {}) {
  return createReviewOnlyMetadataHandoffCheckpointForReview({
    reviewedAt,
    checkpointHandoffLayerEntries: entries,
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
    metadataHandoffCheckpointProduced: result.metadataHandoffCheckpointProduced,
    metadataHandoffCheckpointIsReviewerRouting:
      result.metadataHandoffCheckpointIsReviewerRouting,
    metadataHandoffCheckpointIsReviewerAssignment:
      result.metadataHandoffCheckpointIsReviewerAssignment,
    metadataHandoffCheckpointIsEvaluatorExecution:
      result.metadataHandoffCheckpointIsEvaluatorExecution,
    metadataHandoffCheckpointIsEvaluatorResult:
      result.metadataHandoffCheckpointIsEvaluatorResult,
    metadataHandoffCheckpointIsApprovalDecision:
      result.metadataHandoffCheckpointIsApprovalDecision,
    metadataHandoffCheckpointIsApprovalGrant:
      result.metadataHandoffCheckpointIsApprovalGrant,
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

function metadataHandoffCheckpointCases() {
  const conflicting = layerWith({ reviewedAt: "2026-06-17T00:00:01.000Z" });
  return [
    [
      "missing-review-only-metadata-handoff-checkpoint-input-rejected",
      createReviewOnlyMetadataHandoffCheckpointForReview({ reviewedAt })
    ],
    [
      "malformed-review-only-metadata-handoff-checkpoint-input-rejected",
      createReviewOnlyMetadataHandoffCheckpointForReview(null)
    ],
    [
      "malformed-review-only-metadata-handoff-checkpoint-invalid-reviewed-at-rejected",
      createReviewOnlyMetadataHandoffCheckpointForReview({
        reviewedAt: "not-a-date",
        checkpointHandoffLayerEntries: [validLayer()]
      })
    ],
    ["empty-review-only-metadata-handoff-checkpoint-input-rejected", createResult([])],
    [
      "conflicting-review-only-metadata-handoff-checkpoint-input-rejected",
      createResult([validLayer(), conflicting])
    ],
    [
      "stale-review-only-metadata-handoff-checkpoint-input-rejected",
      createResult([layerWith({ reviewedAt: "2026-06-16T23:59:59.000Z" })])
    ],
    [
      "revoked-review-only-metadata-handoff-checkpoint-input-rejected",
      createResult([layerWith({ status: "revoked" })])
    ],
    [
      "unknown-review-only-metadata-handoff-checkpoint-input-rejected",
      createResult([layerWith({ status: "unknown" })])
    ],
    [
      "duplicate-invalid-review-only-metadata-handoff-checkpoint-input-rejected",
      createResult([validLayer(), validLayer()])
    ],
    [
      "authorizing-looking-review-only-metadata-handoff-checkpoint-input-rejected",
      createResult([layerWithNested("checkpointHandoffSummary", "canGrantRuntime")])
    ],
    [
      "grant-looking-review-only-metadata-handoff-checkpoint-input-rejected",
      createResult([layerWithNested("checkpointHandoffSummary", "grant")])
    ],
    [
      "approval-decision-looking-review-only-metadata-handoff-checkpoint-input-rejected",
      createResult([layerWith({ approvalDecisionProduced: true })])
    ],
    [
      "approval-grant-looking-review-only-metadata-handoff-checkpoint-input-rejected",
      createResult([layerWith({ approvalGrantProduced: true })])
    ],
    [
      "evaluator-result-looking-review-only-metadata-handoff-checkpoint-input-rejected",
      createResult([layerWith({ evaluatorResultProduced: true })])
    ],
    [
      "evaluator-execution-looking-review-only-metadata-handoff-checkpoint-input-rejected",
      createResult([layerWith({ evaluatorExecuted: true })])
    ],
    [
      "reviewer-routing-looking-review-only-metadata-handoff-checkpoint-input-rejected",
      createResult([layerWith({ reviewerRoutingEnabled: true })])
    ],
    [
      "reviewer-assignment-looking-review-only-metadata-handoff-checkpoint-input-rejected",
      createResult([layerWith({ reviewerAssignmentEnabled: true })])
    ],
    [
      "runtime-permission-looking-review-only-metadata-handoff-checkpoint-input-rejected",
      createResult([layerWith({ runtimePermissionGranted: true })])
    ],
    [
      "command-exposure-looking-review-only-metadata-handoff-checkpoint-input-rejected",
      createResult([layerWith({ commandExposurePermissionGranted: true })])
    ],
    [
      "runtime-effect-true-review-only-metadata-handoff-checkpoint-input-rejected",
      createResult([
        layerWith({
          runtimeEffect: {
            ...validLayer().runtimeEffect,
            runtimeEnabled: true
          }
        })
      ])
    ],
    [
      "process-flag-true-review-only-metadata-handoff-checkpoint-input-rejected",
      createResult([layerWithNested("checkpointHandoffSummary", "processSpawned")])
    ],
    [
      "unsafe-top-level-review-only-metadata-handoff-checkpoint-input-rejected",
      createResult([layerWith({ metadataHandoffCheckpoint: {} })])
    ],
    [
      "unsafe-nested-checkpoint-handoff-metadata-review-only-metadata-handoff-checkpoint-input-rejected",
      createResult([
        layerWithNested("checkpointHandoffSummary", "checkpointHandoffMetadata")
      ])
    ],
    [
      "execution-signal-looking-review-only-metadata-handoff-checkpoint-input-rejected",
      createResult([layerWithNested("checkpointHandoffSummary", "executionSignal")])
    ],
    ["valid-review-only-metadata-handoff-checkpoint", createResult([validLayer()])]
  ].map(([caseId, result]) => caseSummary(caseId, result));
}

function expectedFixture() {
  const validResult = createResult([validLayer()]);
  return {
    schema: REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_SCHEMA,
    schemaVersion: "0.1.0",
    phase: "phase-5.41-review-only-metadata-handoff-checkpoint",
    metadataHandoffCheckpointKind: "review-only-metadata-handoff-checkpoint",
    metadataGeneratedAt: reviewedAt,
    sourcePhase: {
      phase: "phase-5.40-review-only-checkpoint-handoff-layer",
      checkpointHandoffLayerPath:
        "packages/core/src/index.mjs#createReviewOnlyCheckpointHandoffLayerForReview",
      metadataHandoffCheckpointPath:
        "packages/core/src/index.mjs#createReviewOnlyMetadataHandoffCheckpointForReview",
      sourceCheckpointHandoffLayerFixture:
        "tests/fixtures/host-policy/phase5-40/review-only-checkpoint-handoff-layer.json",
      cleanupHardeningToolkitEvidence: "installed-tools-only-no-installs",
      runtimeEnabled: false,
      reviewerRoutingPerformed: false,
      reviewerAssignmentPerformed: false,
      approvalDecisionProduced: false,
      approvalGrantProduced: false,
      evaluatorExecutionPerformed: false
    },
    metadataHandoffCheckpointSummary: {
      reviewOnlyMetadataHandoffCheckpointRecorded: true,
      metadataHandoffCheckpointKind: "review-only-metadata-handoff-checkpoint",
      metadataHandoffCheckpointReviewOnly: true,
      metadataHandoffCheckpointAuthoritative: false,
      validCheckpointHandoffLayerProducesCheckpoint: true,
      missingCheckpointHandoffLayerRejected: true,
      malformedCheckpointHandoffLayerRejected: true,
      emptyCheckpointHandoffLayerRejected: true,
      conflictingCheckpointHandoffLayerRejected: true,
      staleCheckpointHandoffLayerRejected: true,
      revokedCheckpointHandoffLayerRejected: true,
      unknownCheckpointHandoffLayerRejected: true,
      duplicateInvalidCheckpointHandoffLayerRejected: true,
      authorizingLookingCheckpointHandoffLayerRejected: true,
      grantLookingCheckpointHandoffLayerRejected: true,
      approvalDecisionLookingCheckpointHandoffLayerRejected: true,
      approvalGrantLookingCheckpointHandoffLayerRejected: true,
      evaluatorResultLookingCheckpointHandoffLayerRejected: true,
      evaluatorExecutionLookingCheckpointHandoffLayerRejected: true,
      reviewerRoutingLookingCheckpointHandoffLayerRejected: true,
      reviewerAssignmentLookingCheckpointHandoffLayerRejected: true,
      runtimePermissionLookingCheckpointHandoffLayerRejected: true,
      commandExposureLookingCheckpointHandoffLayerRejected: true,
      runtimeEffectTrueCheckpointHandoffLayerRejected: true,
      processFlagTrueCheckpointHandoffLayerRejected: true,
      unsafeCheckpointHandoffMetadataRejected: true,
      executionSignalLookingCheckpointHandoffLayerRejected: true,
      metadataHandoffCheckpointIsReviewerRouting: false,
      metadataHandoffCheckpointIsReviewerAssignment: false,
      metadataHandoffCheckpointIsEvaluatorExecution: false,
      metadataHandoffCheckpointIsEvaluatorResult: false,
      metadataHandoffCheckpointIsApprovalDecision: false,
      metadataHandoffCheckpointIsApprovalGrant: false,
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
      toolsInstalledByPhase541: false,
      megaLinterRun: false,
      broadTrunkRewriteRun: false,
      fallowRuntimeUsed: false,
      serveRuntimeStillDefaultBlocked: true,
      dryRunBypassesBlock: false,
      canEnableRuntime: false
    },
    metadataHandoffCheckpointInputShape: {
      checkpointHandoffLayerEntries:
        "exactly one Phase 5.40 review-only checkpoint handoff layer state",
      checkpointHandoffLayerSchema:
        "ardyn.phase-5.40.review-only-checkpoint-handoff-layer-state",
      checkpointHandoffLayerMode: "review-only",
      validCheckpointHandoffLayerRequired: true,
      authorizingLookingMetadataPolicy: "fail-closed",
      grantLookingMetadataPolicy: "fail-closed",
      reviewerRoutingLookingMetadataPolicy: "fail-closed",
      reviewerAssignmentLookingMetadataPolicy: "fail-closed",
      evaluatorExecutionLookingMetadataPolicy: "fail-closed",
      runtimeEffectTrueMetadataPolicy: "fail-closed",
      processFlagTrueMetadataPolicy: "fail-closed",
      unsafeTopLevelMetadataPolicy: "fail-closed",
      unsafeNestedCheckpointHandoffMetadataPolicy: "fail-closed",
      executionSignalLookingMetadataPolicy: "fail-closed",
      filesystemWatcherAllowed: false,
      externalSourceLookupAllowed: false,
      secretsEnvIngestionAllowed: false,
      filePathAllowed: false,
      urlAllowed: false
    },
    metadataHandoffCheckpointResultShape: {
      schema: "ardyn.phase-5.41.review-only-metadata-handoff-checkpoint-result",
      schemaVersion: "0.1.0",
      metadataHandoffCheckpointKind: "review-only-metadata-handoff-checkpoint",
      metadataHandoffCheckpointMode: "review-only",
      stateSchema: "ardyn.phase-5.41.review-only-metadata-handoff-checkpoint-state",
      stateKind: "review-only-metadata-handoff-checkpoint-state",
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
    metadataHandoffCheckpointCases: metadataHandoffCheckpointCases(),
    metadataHandoffCheckpoint: validResult.metadataHandoffCheckpoint,
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
      "tests/phase5-41-review-only-metadata-handoff-checkpoint.test.mjs",
      "tests/fixtures/host-policy/phase5-41/review-only-metadata-handoff-checkpoint.json",
      "docs/phase-5-41-review-only-metadata-handoff-checkpoint.md",
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
      "node --test tests/phase5-41-review-only-metadata-handoff-checkpoint.test.mjs",
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

test("Phase 5.41 metadata handoff checkpoint fixture is deterministic metadata", async () => {
  const fixture = JSON.parse(await readFile(fixtureUrl, "utf8"));

  assert.deepEqual(Object.keys(fixture), expectedTopLevelKeys);
  assert.deepEqual(fixture, expectedFixture());
});

test("Phase 5.41 metadata handoff checkpoint classifies metadata cases", () => {
  const cases = metadataHandoffCheckpointCases();

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
      checkpointCase.metadataHandoffCheckpointIsReviewerRouting,
      false
    );
    assert.equal(
      checkpointCase.metadataHandoffCheckpointIsReviewerAssignment,
      false
    );
    assert.equal(
      checkpointCase.metadataHandoffCheckpointIsEvaluatorExecution,
      false
    );
    assert.equal(
      checkpointCase.metadataHandoffCheckpointIsEvaluatorResult,
      false
    );
    assert.equal(
      checkpointCase.metadataHandoffCheckpointIsApprovalDecision,
      false
    );
    assert.equal(
      checkpointCase.metadataHandoffCheckpointIsApprovalGrant,
      false
    );
    assert.equal(checkpointCase.approvalGrant.produced, false);
    assert.equal(checkpointCase.approvalGrant.persisted, false);
    assert.equal(checkpointCase.approvalGrant.grantId, null);
    assertAllFalse(checkpointCase.runtimeEffect);
  }
});

test("Phase 5.41 malformed metadata handoff input fails closed without throwing", () => {
  for (const input of [null, "bad", { reviewedAt: "bad" }]) {
    const result = createReviewOnlyMetadataHandoffCheckpointForReview(input);

    assert.equal(
      result.classification,
      "malformed_review_only_metadata_handoff_checkpoint_input_rejected"
    );
    assert.equal(result.metadataHandoffCheckpointProduced, false);
    assert.equal(result.metadataHandoffCheckpoint, null);
    assert.equal(result.approvalGrantProduced, false);
    assert.equal(result.runtimeExecutionEnabled, false);
    assertAllFalse(result.runtimeEffect);
  }
});

test("Phase 5.41 valid checkpoint handoff layer produces only metadata handoff checkpoint", () => {
  const result = createResult([validLayer()]);
  const checkpoint = result.metadataHandoffCheckpoint;

  assert.equal(
    result.classification,
    "valid_review_only_metadata_handoff_checkpoint_runtime_still_blocked"
  );
  assert.equal(result.metadataHandoffCheckpointProduced, true);
  assert.equal(
    checkpoint.schema,
    "ardyn.phase-5.41.review-only-metadata-handoff-checkpoint-state"
  );
  assert.equal(
    checkpoint.stateKind,
    "review-only-metadata-handoff-checkpoint-state"
  );
  assert.equal(checkpoint.stateMode, "review-only");
  assert.equal(checkpoint.metadataHandoffCheckpointMetadataOnly, true);
  assert.equal(checkpoint.metadataHandoffCheckpointIsReviewerRouting, false);
  assert.equal(checkpoint.metadataHandoffCheckpointIsReviewerAssignment, false);
  assert.equal(checkpoint.metadataHandoffCheckpointIsEvaluatorExecution, false);
  assert.equal(checkpoint.metadataHandoffCheckpointIsEvaluatorResult, false);
  assert.equal(checkpoint.metadataHandoffCheckpointIsApprovalDecision, false);
  assert.equal(checkpoint.metadataHandoffCheckpointIsApprovalGrant, false);
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
  assert.equal(checkpoint.cleanupHardeningToolkitEvidence.toolsInstalledByPhase541, false);
  assert.equal(checkpoint.cleanupHardeningToolkitEvidence.fallowRuntimeUsed, false);
  assertAllFalse(checkpoint.runtimeEffect);
});

test("Phase 5.41 rejected checkpoint handoff layer fails closed before metadata checkpoint", () => {
  const result = createResult([layerWith({ commandExposurePermissionGranted: true })]);

  assert.equal(
    result.classification,
    "command_exposure_looking_review_only_metadata_handoff_checkpoint_input_rejected"
  );
  assert.equal(result.checkpointHandoffLayerAccepted, false);
  assert.equal(result.metadataHandoffCheckpointProduced, false);
  assert.equal(result.metadataHandoffCheckpoint, null);
  assert.equal(result.approvalDecisionProduced, false);
  assert.equal(result.approvalGrantProduced, false);
  assert.equal(result.runtimeCommandExposureEnabled, false);
  assert.equal(result.runtimeExecutionEnabled, false);
  assertAllFalse(result.runtimeEffect);
});

test("Phase 5.41 rejects malformed or unsafe nested source checkpoint metadata", () => {
  const nestedCases = [
    [
      "empty nested source checkpoint",
      (layer) => {
        layer.sourceInspectionHandoffCheckpoint = {};
      },
      "malformed_review_only_metadata_handoff_checkpoint_input_rejected"
    ],
    [
      "missing nested source checkpoint digest",
      (layer) => {
        delete layer.sourceInspectionHandoffCheckpoint.stateDigest;
      },
      "malformed_review_only_metadata_handoff_checkpoint_input_rejected"
    ],
    [
      "bad nested source checkpoint digest type",
      (layer) => {
        layer.sourceInspectionHandoffCheckpoint.stateDigest = 42;
      },
      "malformed_review_only_metadata_handoff_checkpoint_input_rejected"
    ],
    [
      "nested approval grant signal",
      (layer) => {
        layer.sourceInspectionHandoffCheckpoint.approvalGrantProduced = true;
      },
      "approval_grant_looking_review_only_metadata_handoff_checkpoint_input_rejected"
    ],
    [
      "nested reviewer assignment signal",
      (layer) => {
        layer.sourceInspectionHandoffCheckpoint.reviewerAssignmentPerformed = true;
      },
      "reviewer_assignment_looking_review_only_metadata_handoff_checkpoint_input_rejected"
    ],
    [
      "nested runtime effect signal",
      (layer) => {
        layer.sourceInspectionHandoffCheckpoint.runtimeEffectAllFalse = false;
      },
      "runtime_effect_true_review_only_metadata_handoff_checkpoint_input_rejected"
    ]
  ];

  for (const [label, mutate, expectedClassification] of nestedCases) {
    const layer = validLayer();
    mutate(layer);
    const result = createResult([layer]);

    assert.equal(result.classification, expectedClassification, label);
    assert.equal(result.checkpointHandoffLayerAccepted, false, label);
    assert.equal(result.metadataHandoffCheckpointProduced, false, label);
    assert.equal(result.metadataHandoffCheckpoint, null, label);
    assert.equal(result.reviewerAssignmentPerformed, false, label);
    assert.equal(result.approvalGrantProduced, false, label);
    assert.equal(result.approvalGrantPersisted, false, label);
    assert.equal(result.runtimeExecutionEnabled, false, label);
    assertAllFalse(result.runtimeEffect);
  }
});

test("Phase 5.41 fixture mirrors metadata handoff cases and blocks authorization", async () => {
  const fixture = JSON.parse(await readFile(fixtureUrl, "utf8"));

  assert.deepEqual(
    fixture.metadataHandoffCheckpointCases.map(({ caseId }) => caseId),
    expectedCaseIds
  );
  for (const checkpointCase of fixture.metadataHandoffCheckpointCases) {
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
  assertAllFalse(fixture.blockedRuntimeEffect);
  assert.equal(fixture.serveRuntimeBlockedBehavior.defaultBlocked, true);
  assert.equal(fixture.serveRuntimeBlockedBehavior.dryRunBlocked, true);
  assert.equal(fixture.serveRuntimeBlockedBehavior.dryRunBypassesBlock, false);
  assert.equal(fixture.serveRuntimeBlockedBehavior.stdout, "");
  assert.deepEqual(fixture.metadataHandoffCheckpointResultShape, {
    ...expectedFixture().metadataHandoffCheckpointResultShape
  });
});

test("serve-runtime remains default-blocked and dry-run cannot bypass Phase 5.41", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-41-runtime-"));

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

test("Phase 5.41 metadata handoff command names remain rejected", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-41-commands-"));

  try {
    for (const command of metadataHandoffCommandProbes) {
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

test("Phase 5.41 does not change CLI or Rust runtime source", async () => {
  const currentCliSource = await readFile(cliSourceUrl, "utf8");
  const currentRustLibSource = await readFile(rustLibSourceUrl, "utf8");
  const currentRustStdioSource = await readFile(rustStdioSourceUrl, "utf8");
  const { stdout: baselineCliSource } = await execFileAsync("git", [
    "show",
    `${phase541BaselineCommit}:apps/cli/src/index.mjs`
  ], {
    cwd: repoRoot,
    maxBuffer: 1024 * 1024
  });
  const { stdout: baselineRustLibSource } = await execFileAsync("git", [
    "show",
    `${phase541BaselineCommit}:crates/ardyn-host/src/lib.rs`
  ], {
    cwd: repoRoot,
    maxBuffer: 1024 * 1024
  });
  const { stdout: baselineRustStdioSource } = await execFileAsync("git", [
    "show",
    `${phase541BaselineCommit}:crates/ardyn-host/src/stdio_runtime/mod.rs`
  ], {
    cwd: repoRoot,
    maxBuffer: 1024 * 1024
  });

  assert.equal(currentCliSource, baselineCliSource);
  assert.equal(currentRustLibSource, baselineRustLibSource);
  assert.equal(currentRustStdioSource, baselineRustStdioSource);
  assert.doesNotMatch(
    currentCliSource,
    /createReviewOnlyMetadataHandoffCheckpointForReview/
  );
  assert.doesNotMatch(currentCliSource, /metadata-handoff-checkpoint/);
});
