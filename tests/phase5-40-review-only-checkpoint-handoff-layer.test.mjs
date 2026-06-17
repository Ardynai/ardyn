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
  REVIEW_ONLY_CHECKPOINT_HANDOFF_LAYER_SCHEMA,
  createReviewOnlyCheckpointHandoffLayerForReview
} from "../packages/core/src/index.mjs";

const execFileAsync = promisify(execFile);
const phase540BaselineCommit = "1b4e85823574a9f2032bb9e804326af329c0dfa4";
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
const phase539FixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-39/review-only-inspection-handoff-checkpoint.json",
  import.meta.url
);
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-40/review-only-checkpoint-handoff-layer.json",
  import.meta.url
);
const phase539Fixture = JSON.parse(
  readFileSync(fileURLToPath(phase539FixtureUrl), "utf8")
);

const expectedTopLevelKeys = Object.freeze([
  "schema",
  "schemaVersion",
  "phase",
  "checkpointHandoffKind",
  "metadataGeneratedAt",
  "sourcePhase",
  "checkpointHandoffLayerSummary",
  "checkpointHandoffLayerInputShape",
  "checkpointHandoffLayerResultShape",
  "checkpointHandoffLayerCases",
  "checkpointHandoffLayer",
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
  "missing-review-only-checkpoint-handoff-layer-input-rejected",
  "malformed-review-only-checkpoint-handoff-layer-input-rejected",
  "malformed-review-only-checkpoint-handoff-layer-invalid-reviewed-at-rejected",
  "empty-review-only-checkpoint-handoff-layer-input-rejected",
  "conflicting-review-only-checkpoint-handoff-layer-input-rejected",
  "stale-review-only-checkpoint-handoff-layer-input-rejected",
  "revoked-review-only-checkpoint-handoff-layer-input-rejected",
  "unknown-review-only-checkpoint-handoff-layer-input-rejected",
  "duplicate-invalid-review-only-checkpoint-handoff-layer-input-rejected",
  "authorizing-looking-review-only-checkpoint-handoff-layer-input-rejected",
  "grant-looking-review-only-checkpoint-handoff-layer-input-rejected",
  "approval-decision-looking-review-only-checkpoint-handoff-layer-input-rejected",
  "approval-grant-looking-review-only-checkpoint-handoff-layer-input-rejected",
  "evaluator-result-looking-review-only-checkpoint-handoff-layer-input-rejected",
  "evaluator-execution-looking-review-only-checkpoint-handoff-layer-input-rejected",
  "reviewer-routing-looking-review-only-checkpoint-handoff-layer-input-rejected",
  "reviewer-assignment-looking-review-only-checkpoint-handoff-layer-input-rejected",
  "runtime-permission-looking-review-only-checkpoint-handoff-layer-input-rejected",
  "command-exposure-looking-review-only-checkpoint-handoff-layer-input-rejected",
  "runtime-effect-true-review-only-checkpoint-handoff-layer-input-rejected",
  "process-flag-true-review-only-checkpoint-handoff-layer-input-rejected",
  "unsafe-top-level-review-only-checkpoint-handoff-layer-input-rejected",
  "unsafe-nested-checkpoint-handoff-metadata-review-only-checkpoint-handoff-layer-input-rejected",
  "execution-signal-looking-review-only-checkpoint-handoff-layer-input-rejected",
  "valid-review-only-checkpoint-handoff-layer"
]);

const expectedClassifications = Object.freeze({
  "missing-review-only-checkpoint-handoff-layer-input-rejected":
    "missing_review_only_checkpoint_handoff_layer_input_rejected",
  "malformed-review-only-checkpoint-handoff-layer-input-rejected":
    "malformed_review_only_checkpoint_handoff_layer_input_rejected",
  "malformed-review-only-checkpoint-handoff-layer-invalid-reviewed-at-rejected":
    "malformed_review_only_checkpoint_handoff_layer_input_rejected",
  "empty-review-only-checkpoint-handoff-layer-input-rejected":
    "empty_review_only_checkpoint_handoff_layer_input_rejected",
  "conflicting-review-only-checkpoint-handoff-layer-input-rejected":
    "conflicting_review_only_checkpoint_handoff_layer_input_rejected",
  "stale-review-only-checkpoint-handoff-layer-input-rejected":
    "stale_review_only_checkpoint_handoff_layer_input_rejected",
  "revoked-review-only-checkpoint-handoff-layer-input-rejected":
    "revoked_review_only_checkpoint_handoff_layer_input_rejected",
  "unknown-review-only-checkpoint-handoff-layer-input-rejected":
    "unknown_review_only_checkpoint_handoff_layer_input_rejected",
  "duplicate-invalid-review-only-checkpoint-handoff-layer-input-rejected":
    "duplicate_invalid_review_only_checkpoint_handoff_layer_input_rejected",
  "authorizing-looking-review-only-checkpoint-handoff-layer-input-rejected":
    "authorizing_review_only_checkpoint_handoff_layer_input_rejected",
  "grant-looking-review-only-checkpoint-handoff-layer-input-rejected":
    "grant_looking_review_only_checkpoint_handoff_layer_input_rejected",
  "approval-decision-looking-review-only-checkpoint-handoff-layer-input-rejected":
    "approval_decision_looking_review_only_checkpoint_handoff_layer_input_rejected",
  "approval-grant-looking-review-only-checkpoint-handoff-layer-input-rejected":
    "approval_grant_looking_review_only_checkpoint_handoff_layer_input_rejected",
  "evaluator-result-looking-review-only-checkpoint-handoff-layer-input-rejected":
    "evaluator_result_looking_review_only_checkpoint_handoff_layer_input_rejected",
  "evaluator-execution-looking-review-only-checkpoint-handoff-layer-input-rejected":
    "evaluator_execution_looking_review_only_checkpoint_handoff_layer_input_rejected",
  "reviewer-routing-looking-review-only-checkpoint-handoff-layer-input-rejected":
    "reviewer_routing_looking_review_only_checkpoint_handoff_layer_input_rejected",
  "reviewer-assignment-looking-review-only-checkpoint-handoff-layer-input-rejected":
    "reviewer_assignment_looking_review_only_checkpoint_handoff_layer_input_rejected",
  "runtime-permission-looking-review-only-checkpoint-handoff-layer-input-rejected":
    "runtime_permission_looking_review_only_checkpoint_handoff_layer_input_rejected",
  "command-exposure-looking-review-only-checkpoint-handoff-layer-input-rejected":
    "command_exposure_looking_review_only_checkpoint_handoff_layer_input_rejected",
  "runtime-effect-true-review-only-checkpoint-handoff-layer-input-rejected":
    "runtime_effect_true_review_only_checkpoint_handoff_layer_input_rejected",
  "process-flag-true-review-only-checkpoint-handoff-layer-input-rejected":
    "process_flag_true_review_only_checkpoint_handoff_layer_input_rejected",
  "unsafe-top-level-review-only-checkpoint-handoff-layer-input-rejected":
    "unsafe_review_only_checkpoint_handoff_layer_input_rejected",
  "unsafe-nested-checkpoint-handoff-metadata-review-only-checkpoint-handoff-layer-input-rejected":
    "unsafe_review_only_checkpoint_handoff_layer_input_rejected",
  "execution-signal-looking-review-only-checkpoint-handoff-layer-input-rejected":
    "execution_signal_looking_review_only_checkpoint_handoff_layer_input_rejected",
  "valid-review-only-checkpoint-handoff-layer":
    "valid_review_only_checkpoint_handoff_layer_runtime_still_blocked"
});

const checkpointHandoffCommandProbes = Object.freeze([
  "review-only-checkpoint-handoff-layer",
  "create-review-only-checkpoint-handoff-layer",
  "checkpoint-handoff-layer",
  "phase-5-40-review-only-checkpoint-handoff-layer",
  "reviewer-routing",
  "reviewer-assignment",
  "serve-runtime"
]);

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function validCheckpoint() {
  return clone(phase539Fixture.inspectionHandoffCheckpoint);
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

function createResult(entries, options = {}) {
  return createReviewOnlyCheckpointHandoffLayerForReview({
    reviewedAt,
    inspectionHandoffCheckpointEntries: entries,
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
    checkpointHandoffLayerProduced: result.checkpointHandoffLayerProduced,
    checkpointHandoffLayerIsReviewerRouting:
      result.checkpointHandoffLayerIsReviewerRouting,
    checkpointHandoffLayerIsReviewerAssignment:
      result.checkpointHandoffLayerIsReviewerAssignment,
    checkpointHandoffLayerIsEvaluatorExecution:
      result.checkpointHandoffLayerIsEvaluatorExecution,
    checkpointHandoffLayerIsEvaluatorResult:
      result.checkpointHandoffLayerIsEvaluatorResult,
    checkpointHandoffLayerIsApprovalDecision:
      result.checkpointHandoffLayerIsApprovalDecision,
    checkpointHandoffLayerIsApprovalGrant:
      result.checkpointHandoffLayerIsApprovalGrant,
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

function checkpointHandoffLayerCases() {
  const conflicting = checkpointWith({
    reviewedAt: "2026-06-17T00:00:01.000Z"
  });
  return [
    [
      "missing-review-only-checkpoint-handoff-layer-input-rejected",
      createReviewOnlyCheckpointHandoffLayerForReview({ reviewedAt })
    ],
    [
      "malformed-review-only-checkpoint-handoff-layer-input-rejected",
      createReviewOnlyCheckpointHandoffLayerForReview(null)
    ],
    [
      "malformed-review-only-checkpoint-handoff-layer-invalid-reviewed-at-rejected",
      createReviewOnlyCheckpointHandoffLayerForReview({
        reviewedAt: "not-a-date",
        inspectionHandoffCheckpointEntries: [validCheckpoint()]
      })
    ],
    ["empty-review-only-checkpoint-handoff-layer-input-rejected", createResult([])],
    [
      "conflicting-review-only-checkpoint-handoff-layer-input-rejected",
      createResult([validCheckpoint(), conflicting])
    ],
    [
      "stale-review-only-checkpoint-handoff-layer-input-rejected",
      createResult([checkpointWith({ reviewedAt: "2026-06-16T23:59:59.000Z" })])
    ],
    [
      "revoked-review-only-checkpoint-handoff-layer-input-rejected",
      createResult([checkpointWith({ status: "revoked" })])
    ],
    [
      "unknown-review-only-checkpoint-handoff-layer-input-rejected",
      createResult([checkpointWith({ status: "unknown" })])
    ],
    [
      "duplicate-invalid-review-only-checkpoint-handoff-layer-input-rejected",
      createResult([validCheckpoint(), validCheckpoint()])
    ],
    [
      "authorizing-looking-review-only-checkpoint-handoff-layer-input-rejected",
      createResult([checkpointWithNested("checkpointSummary", "canGrantRuntime")])
    ],
    [
      "grant-looking-review-only-checkpoint-handoff-layer-input-rejected",
      createResult([checkpointWithNested("checkpointSummary", "grant")])
    ],
    [
      "approval-decision-looking-review-only-checkpoint-handoff-layer-input-rejected",
      createResult([checkpointWith({ approvalDecisionProduced: true })])
    ],
    [
      "approval-grant-looking-review-only-checkpoint-handoff-layer-input-rejected",
      createResult([checkpointWith({ approvalGrantProduced: true })])
    ],
    [
      "evaluator-result-looking-review-only-checkpoint-handoff-layer-input-rejected",
      createResult([checkpointWith({ evaluatorResultProduced: true })])
    ],
    [
      "evaluator-execution-looking-review-only-checkpoint-handoff-layer-input-rejected",
      createResult([checkpointWith({ evaluatorExecuted: true })])
    ],
    [
      "reviewer-routing-looking-review-only-checkpoint-handoff-layer-input-rejected",
      createResult([checkpointWith({ reviewerRoutingEnabled: true })])
    ],
    [
      "reviewer-assignment-looking-review-only-checkpoint-handoff-layer-input-rejected",
      createResult([checkpointWith({ reviewerAssignmentEnabled: true })])
    ],
    [
      "runtime-permission-looking-review-only-checkpoint-handoff-layer-input-rejected",
      createResult([checkpointWith({ runtimePermissionGranted: true })])
    ],
    [
      "command-exposure-looking-review-only-checkpoint-handoff-layer-input-rejected",
      createResult([checkpointWith({ commandExposurePermissionGranted: true })])
    ],
    [
      "runtime-effect-true-review-only-checkpoint-handoff-layer-input-rejected",
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
      "process-flag-true-review-only-checkpoint-handoff-layer-input-rejected",
      createResult([checkpointWithNested("checkpointSummary", "processSpawned")])
    ],
    [
      "unsafe-top-level-review-only-checkpoint-handoff-layer-input-rejected",
      createResult([checkpointWith({ checkpointHandoffLayer: {} })])
    ],
    [
      "unsafe-nested-checkpoint-handoff-metadata-review-only-checkpoint-handoff-layer-input-rejected",
      createResult([
        checkpointWithNested("checkpointSummary", "checkpointHandoffMetadata")
      ])
    ],
    [
      "execution-signal-looking-review-only-checkpoint-handoff-layer-input-rejected",
      createResult([checkpointWithNested("checkpointSummary", "executionSignal")])
    ],
    ["valid-review-only-checkpoint-handoff-layer", createResult([validCheckpoint()])]
  ].map(([caseId, result]) => caseSummary(caseId, result));
}

function expectedFixture() {
  const validResult = createResult([validCheckpoint()]);
  return {
    schema: REVIEW_ONLY_CHECKPOINT_HANDOFF_LAYER_SCHEMA,
    schemaVersion: "0.1.0",
    phase: "phase-5.40-review-only-checkpoint-handoff-layer",
    checkpointHandoffKind: "review-only-checkpoint-handoff-layer",
    metadataGeneratedAt: reviewedAt,
    sourcePhase: {
      phase: "phase-5.39-review-only-inspection-handoff-checkpoint",
      inspectionHandoffCheckpointPath:
        "packages/core/src/index.mjs#createReviewOnlyInspectionHandoffCheckpointForReview",
      checkpointHandoffLayerPath:
        "packages/core/src/index.mjs#createReviewOnlyCheckpointHandoffLayerForReview",
      sourceInspectionHandoffCheckpointFixture:
        "tests/fixtures/host-policy/phase5-39/review-only-inspection-handoff-checkpoint.json",
      cleanupHardeningToolkitEvidence: "installed-tools-only-no-installs",
      runtimeEnabled: false,
      reviewerRoutingPerformed: false,
      reviewerAssignmentPerformed: false,
      approvalDecisionProduced: false,
      approvalGrantProduced: false,
      evaluatorExecutionPerformed: false
    },
    checkpointHandoffLayerSummary: {
      reviewOnlyCheckpointHandoffLayerRecorded: true,
      checkpointHandoffKind: "review-only-checkpoint-handoff-layer",
      checkpointHandoffReviewOnly: true,
      checkpointHandoffAuthoritative: false,
      validInspectionHandoffCheckpointProducesLayer: true,
      missingInspectionHandoffCheckpointRejected: true,
      malformedInspectionHandoffCheckpointRejected: true,
      emptyInspectionHandoffCheckpointRejected: true,
      conflictingInspectionHandoffCheckpointRejected: true,
      staleInspectionHandoffCheckpointRejected: true,
      revokedInspectionHandoffCheckpointRejected: true,
      unknownInspectionHandoffCheckpointRejected: true,
      duplicateInvalidInspectionHandoffCheckpointRejected: true,
      authorizingLookingInspectionHandoffCheckpointRejected: true,
      grantLookingInspectionHandoffCheckpointRejected: true,
      approvalDecisionLookingInspectionHandoffCheckpointRejected: true,
      approvalGrantLookingInspectionHandoffCheckpointRejected: true,
      evaluatorResultLookingInspectionHandoffCheckpointRejected: true,
      evaluatorExecutionLookingInspectionHandoffCheckpointRejected: true,
      reviewerRoutingLookingInspectionHandoffCheckpointRejected: true,
      reviewerAssignmentLookingInspectionHandoffCheckpointRejected: true,
      runtimePermissionLookingInspectionHandoffCheckpointRejected: true,
      commandExposureLookingInspectionHandoffCheckpointRejected: true,
      runtimeEffectTrueInspectionHandoffCheckpointRejected: true,
      processFlagTrueInspectionHandoffCheckpointRejected: true,
      unsafeCheckpointHandoffMetadataRejected: true,
      executionSignalLookingInspectionHandoffCheckpointRejected: true,
      checkpointHandoffLayerIsReviewerRouting: false,
      checkpointHandoffLayerIsReviewerAssignment: false,
      checkpointHandoffLayerIsEvaluatorExecution: false,
      checkpointHandoffLayerIsEvaluatorResult: false,
      checkpointHandoffLayerIsApprovalDecision: false,
      checkpointHandoffLayerIsApprovalGrant: false,
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
      toolsInstalledByPhase540: false,
      megaLinterRun: false,
      broadTrunkRewriteRun: false,
      fallowRuntimeUsed: false,
      serveRuntimeStillDefaultBlocked: true,
      dryRunBypassesBlock: false,
      canEnableRuntime: false
    },
    checkpointHandoffLayerInputShape: {
      inspectionHandoffCheckpointEntries:
        "exactly one Phase 5.39 review-only inspection handoff checkpoint state",
      inspectionHandoffCheckpointSchema:
        "ardyn.phase-5.39.review-only-inspection-handoff-checkpoint-state",
      inspectionHandoffCheckpointMode: "review-only",
      validInspectionHandoffCheckpointRequired: true,
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
    checkpointHandoffLayerResultShape: {
      schema: "ardyn.phase-5.40.review-only-checkpoint-handoff-layer-result",
      schemaVersion: "0.1.0",
      checkpointHandoffKind: "review-only-checkpoint-handoff-layer",
      checkpointHandoffMode: "review-only",
      stateSchema: "ardyn.phase-5.40.review-only-checkpoint-handoff-layer-state",
      stateKind: "review-only-checkpoint-handoff-layer-state",
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
    checkpointHandoffLayerCases: checkpointHandoffLayerCases(),
    checkpointHandoffLayer: validResult.checkpointHandoffLayer,
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
      "tests/phase5-40-review-only-checkpoint-handoff-layer.test.mjs",
      "tests/fixtures/host-policy/phase5-40/review-only-checkpoint-handoff-layer.json",
      "docs/phase-5-40-review-only-checkpoint-handoff-layer.md",
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
      "node --test tests/phase5-40-review-only-checkpoint-handoff-layer.test.mjs",
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

test("Phase 5.40 checkpoint handoff layer fixture is deterministic metadata", async () => {
  const fixture = JSON.parse(await readFile(fixtureUrl, "utf8"));

  assert.deepEqual(Object.keys(fixture), expectedTopLevelKeys);
  assert.deepEqual(fixture, expectedFixture());
});

test("Phase 5.40 checkpoint handoff layer classifies metadata cases", () => {
  const cases = checkpointHandoffLayerCases();

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
    assert.equal(checkpointCase.checkpointHandoffLayerIsReviewerRouting, false);
    assert.equal(
      checkpointCase.checkpointHandoffLayerIsReviewerAssignment,
      false
    );
    assert.equal(
      checkpointCase.checkpointHandoffLayerIsEvaluatorExecution,
      false
    );
    assert.equal(checkpointCase.checkpointHandoffLayerIsEvaluatorResult, false);
    assert.equal(
      checkpointCase.checkpointHandoffLayerIsApprovalDecision,
      false
    );
    assert.equal(checkpointCase.checkpointHandoffLayerIsApprovalGrant, false);
    assert.equal(checkpointCase.approvalGrant.produced, false);
    assert.equal(checkpointCase.approvalGrant.persisted, false);
    assert.equal(checkpointCase.approvalGrant.grantId, null);
    assertAllFalse(checkpointCase.runtimeEffect);
  }
});

test("Phase 5.40 malformed checkpoint handoff input fails closed without throwing", () => {
  for (const input of [null, "bad", { reviewedAt: "bad" }]) {
    const result = createReviewOnlyCheckpointHandoffLayerForReview(input);

    assert.equal(
      result.classification,
      "malformed_review_only_checkpoint_handoff_layer_input_rejected"
    );
    assert.equal(result.checkpointHandoffLayerProduced, false);
    assert.equal(result.checkpointHandoffLayer, null);
    assert.equal(result.approvalGrantProduced, false);
    assert.equal(result.runtimeExecutionEnabled, false);
    assertAllFalse(result.runtimeEffect);
  }
});

test("Phase 5.40 valid checkpoint produces only checkpoint handoff layer", () => {
  const result = createResult([validCheckpoint()]);
  const layer = result.checkpointHandoffLayer;

  assert.equal(
    result.classification,
    "valid_review_only_checkpoint_handoff_layer_runtime_still_blocked"
  );
  assert.equal(result.checkpointHandoffLayerProduced, true);
  assert.equal(
    layer.schema,
    "ardyn.phase-5.40.review-only-checkpoint-handoff-layer-state"
  );
  assert.equal(layer.stateKind, "review-only-checkpoint-handoff-layer-state");
  assert.equal(layer.stateMode, "review-only");
  assert.equal(layer.checkpointHandoffMetadataOnly, true);
  assert.equal(layer.checkpointHandoffLayerIsReviewerRouting, false);
  assert.equal(layer.checkpointHandoffLayerIsReviewerAssignment, false);
  assert.equal(layer.checkpointHandoffLayerIsEvaluatorExecution, false);
  assert.equal(layer.checkpointHandoffLayerIsEvaluatorResult, false);
  assert.equal(layer.checkpointHandoffLayerIsApprovalDecision, false);
  assert.equal(layer.checkpointHandoffLayerIsApprovalGrant, false);
  assert.equal(layer.reviewerRoutingPerformed, false);
  assert.equal(layer.reviewerAssignmentPerformed, false);
  assert.equal(layer.evaluatorExecuted, false);
  assert.equal(layer.evaluatorResultProduced, false);
  assert.equal(layer.approvalDecisionProduced, false);
  assert.equal(layer.approvalGrantProduced, false);
  assert.equal(layer.approvalGrantPersisted, false);
  assert.equal(layer.runtimePermissionGranted, false);
  assert.equal(layer.commandExposurePermissionGranted, false);
  assert.equal(layer.cleanupHardeningToolkitEvidence.cargoAuditRequired, true);
  assert.equal(layer.cleanupHardeningToolkitEvidence.cargoMacheteRequired, true);
  assert.equal(layer.cleanupHardeningToolkitEvidence.toolsInstalledByPhase540, false);
  assert.equal(layer.cleanupHardeningToolkitEvidence.fallowRuntimeUsed, false);
  assertAllFalse(layer.runtimeEffect);
});

test("Phase 5.40 rejected checkpoint fails closed before handoff layer", () => {
  const result = createResult([
    checkpointWith({ commandExposurePermissionGranted: true })
  ]);

  assert.equal(
    result.classification,
    "command_exposure_looking_review_only_checkpoint_handoff_layer_input_rejected"
  );
  assert.equal(result.inspectionHandoffCheckpointAccepted, false);
  assert.equal(result.checkpointHandoffLayerProduced, false);
  assert.equal(result.checkpointHandoffLayer, null);
  assert.equal(result.approvalDecisionProduced, false);
  assert.equal(result.approvalGrantProduced, false);
  assert.equal(result.runtimeCommandExposureEnabled, false);
  assert.equal(result.runtimeExecutionEnabled, false);
  assertAllFalse(result.runtimeEffect);
});

test("Phase 5.40 fixture mirrors checkpoint handoff cases and blocks authorization", async () => {
  const fixture = JSON.parse(await readFile(fixtureUrl, "utf8"));

  assert.deepEqual(
    fixture.checkpointHandoffLayerCases.map(({ caseId }) => caseId),
    expectedCaseIds
  );
  for (const checkpointCase of fixture.checkpointHandoffLayerCases) {
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
  assert.deepEqual(fixture.checkpointHandoffLayerResultShape, {
    ...expectedFixture().checkpointHandoffLayerResultShape
  });
});

test("serve-runtime remains default-blocked and dry-run cannot bypass Phase 5.40", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-40-runtime-"));

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

test("Phase 5.40 checkpoint handoff command names remain rejected", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-40-commands-"));

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

test("Phase 5.40 does not change CLI or Rust runtime source", async () => {
  const currentCliSource = await readFile(cliSourceUrl, "utf8");
  const currentRustLibSource = await readFile(rustLibSourceUrl, "utf8");
  const currentRustStdioSource = await readFile(rustStdioSourceUrl, "utf8");
  const { stdout: baselineCliSource } = await execFileAsync("git", [
    "show",
    `${phase540BaselineCommit}:apps/cli/src/index.mjs`
  ], {
    cwd: repoRoot,
    maxBuffer: 1024 * 1024
  });
  const { stdout: baselineRustLibSource } = await execFileAsync("git", [
    "show",
    `${phase540BaselineCommit}:crates/ardyn-host/src/lib.rs`
  ], {
    cwd: repoRoot,
    maxBuffer: 1024 * 1024
  });
  const { stdout: baselineRustStdioSource } = await execFileAsync("git", [
    "show",
    `${phase540BaselineCommit}:crates/ardyn-host/src/stdio_runtime/mod.rs`
  ], {
    cwd: repoRoot,
    maxBuffer: 1024 * 1024
  });

  assert.equal(currentCliSource, baselineCliSource);
  assert.equal(currentRustLibSource, baselineRustLibSource);
  assert.equal(currentRustStdioSource, baselineRustStdioSource);
  assert.doesNotMatch(
    currentCliSource,
    /createReviewOnlyCheckpointHandoffLayerForReview/
  );
  assert.doesNotMatch(currentCliSource, /checkpoint-handoff-layer/);
});
