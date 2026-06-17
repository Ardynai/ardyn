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
  REVIEW_ONLY_INSPECTION_HANDOFF_METADATA_BOUNDARY_SCHEMA,
  createReviewOnlyInspectionHandoffMetadataBoundaryForReview
} from "../packages/core/src/index.mjs";

const execFileAsync = promisify(execFile);
const phase538BaselineCommit = "12b48dd408ab56b04fc546433402e83a84b12f63";
const reviewedAt = "2026-06-17T00:00:00.000Z";
const repoRootUrl = new URL("../", import.meta.url);
const repoRoot = fileURLToPath(repoRootUrl);
const cliSourceUrl = new URL("../apps/cli/src/index.mjs", import.meta.url);
const cliPath = fileURLToPath(cliSourceUrl);
const phase537FixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-37/review-only-handoff-disposition-inspection-checkpoint.json",
  import.meta.url
);
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-38/review-only-inspection-handoff-metadata-boundary.json",
  import.meta.url
);
const phase537Fixture = JSON.parse(
  readFileSync(fileURLToPath(phase537FixtureUrl), "utf8")
);

const expectedTopLevelKeys = Object.freeze([
  "schema",
  "schemaVersion",
  "phase",
  "boundaryKind",
  "metadataGeneratedAt",
  "sourcePhase",
  "inspectionHandoffMetadataSummary",
  "inspectionHandoffMetadataInputShape",
  "inspectionHandoffMetadataResultShape",
  "inspectionHandoffMetadataCases",
  "inspectionHandoffMetadata",
  "blockedRuntimeEffect",
  "serveRuntimeBlockedBehavior",
  "forbiddenBehavior",
  "filesAllowedToChange",
  "filesForbiddenToChange",
  "validationCommands"
]);

const expectedCaseIds = Object.freeze([
  "missing-review-only-inspection-handoff-metadata-boundary-input-rejected",
  "malformed-review-only-inspection-handoff-metadata-boundary-input-rejected",
  "malformed-review-only-inspection-handoff-metadata-boundary-invalid-reviewed-at-rejected",
  "empty-review-only-inspection-handoff-metadata-boundary-input-rejected",
  "conflicting-review-only-inspection-handoff-metadata-boundary-input-rejected",
  "stale-review-only-inspection-handoff-metadata-boundary-input-rejected",
  "revoked-review-only-inspection-handoff-metadata-boundary-input-rejected",
  "unknown-review-only-inspection-handoff-metadata-boundary-input-rejected",
  "duplicate-invalid-review-only-inspection-handoff-metadata-boundary-input-rejected",
  "authorizing-looking-review-only-inspection-handoff-metadata-boundary-input-rejected",
  "grant-looking-review-only-inspection-handoff-metadata-boundary-input-rejected",
  "approval-decision-looking-review-only-inspection-handoff-metadata-boundary-input-rejected",
  "approval-grant-looking-review-only-inspection-handoff-metadata-boundary-input-rejected",
  "evaluator-result-looking-review-only-inspection-handoff-metadata-boundary-input-rejected",
  "evaluator-execution-looking-review-only-inspection-handoff-metadata-boundary-input-rejected",
  "reviewer-routing-looking-review-only-inspection-handoff-metadata-boundary-input-rejected",
  "reviewer-assignment-looking-review-only-inspection-handoff-metadata-boundary-input-rejected",
  "runtime-permission-looking-review-only-inspection-handoff-metadata-boundary-input-rejected",
  "command-exposure-looking-review-only-inspection-handoff-metadata-boundary-input-rejected",
  "runtime-effect-true-review-only-inspection-handoff-metadata-boundary-input-rejected",
  "process-flag-true-review-only-inspection-handoff-metadata-boundary-input-rejected",
  "unsafe-top-level-review-only-inspection-handoff-metadata-boundary-input-rejected",
  "unsafe-nested-checkpoint-inspection-handoff-metadata-review-only-inspection-handoff-metadata-boundary-input-rejected",
  "execution-signal-looking-review-only-inspection-handoff-metadata-boundary-input-rejected",
  "valid-review-only-inspection-handoff-metadata-boundary"
]);

const expectedClassifications = Object.freeze({
  "missing-review-only-inspection-handoff-metadata-boundary-input-rejected":
    "missing_review_only_inspection_handoff_metadata_boundary_input_rejected",
  "malformed-review-only-inspection-handoff-metadata-boundary-input-rejected":
    "malformed_review_only_inspection_handoff_metadata_boundary_input_rejected",
  "malformed-review-only-inspection-handoff-metadata-boundary-invalid-reviewed-at-rejected":
    "malformed_review_only_inspection_handoff_metadata_boundary_input_rejected",
  "empty-review-only-inspection-handoff-metadata-boundary-input-rejected":
    "empty_review_only_inspection_handoff_metadata_boundary_input_rejected",
  "conflicting-review-only-inspection-handoff-metadata-boundary-input-rejected":
    "conflicting_review_only_inspection_handoff_metadata_boundary_input_rejected",
  "stale-review-only-inspection-handoff-metadata-boundary-input-rejected":
    "stale_review_only_inspection_handoff_metadata_boundary_input_rejected",
  "revoked-review-only-inspection-handoff-metadata-boundary-input-rejected":
    "revoked_review_only_inspection_handoff_metadata_boundary_input_rejected",
  "unknown-review-only-inspection-handoff-metadata-boundary-input-rejected":
    "unknown_review_only_inspection_handoff_metadata_boundary_input_rejected",
  "duplicate-invalid-review-only-inspection-handoff-metadata-boundary-input-rejected":
    "duplicate_invalid_review_only_inspection_handoff_metadata_boundary_input_rejected",
  "authorizing-looking-review-only-inspection-handoff-metadata-boundary-input-rejected":
    "authorizing_review_only_inspection_handoff_metadata_boundary_input_rejected",
  "grant-looking-review-only-inspection-handoff-metadata-boundary-input-rejected":
    "grant_looking_review_only_inspection_handoff_metadata_boundary_input_rejected",
  "approval-decision-looking-review-only-inspection-handoff-metadata-boundary-input-rejected":
    "approval_decision_looking_review_only_inspection_handoff_metadata_boundary_input_rejected",
  "approval-grant-looking-review-only-inspection-handoff-metadata-boundary-input-rejected":
    "approval_grant_looking_review_only_inspection_handoff_metadata_boundary_input_rejected",
  "evaluator-result-looking-review-only-inspection-handoff-metadata-boundary-input-rejected":
    "evaluator_result_looking_review_only_inspection_handoff_metadata_boundary_input_rejected",
  "evaluator-execution-looking-review-only-inspection-handoff-metadata-boundary-input-rejected":
    "evaluator_execution_looking_review_only_inspection_handoff_metadata_boundary_input_rejected",
  "reviewer-routing-looking-review-only-inspection-handoff-metadata-boundary-input-rejected":
    "reviewer_routing_looking_review_only_inspection_handoff_metadata_boundary_input_rejected",
  "reviewer-assignment-looking-review-only-inspection-handoff-metadata-boundary-input-rejected":
    "reviewer_assignment_looking_review_only_inspection_handoff_metadata_boundary_input_rejected",
  "runtime-permission-looking-review-only-inspection-handoff-metadata-boundary-input-rejected":
    "runtime_permission_looking_review_only_inspection_handoff_metadata_boundary_input_rejected",
  "command-exposure-looking-review-only-inspection-handoff-metadata-boundary-input-rejected":
    "command_exposure_looking_review_only_inspection_handoff_metadata_boundary_input_rejected",
  "runtime-effect-true-review-only-inspection-handoff-metadata-boundary-input-rejected":
    "runtime_effect_true_review_only_inspection_handoff_metadata_boundary_input_rejected",
  "process-flag-true-review-only-inspection-handoff-metadata-boundary-input-rejected":
    "process_flag_true_review_only_inspection_handoff_metadata_boundary_input_rejected",
  "unsafe-top-level-review-only-inspection-handoff-metadata-boundary-input-rejected":
    "unsafe_review_only_inspection_handoff_metadata_boundary_input_rejected",
  "unsafe-nested-checkpoint-inspection-handoff-metadata-review-only-inspection-handoff-metadata-boundary-input-rejected":
    "unsafe_review_only_inspection_handoff_metadata_boundary_input_rejected",
  "execution-signal-looking-review-only-inspection-handoff-metadata-boundary-input-rejected":
    "execution_signal_looking_review_only_inspection_handoff_metadata_boundary_input_rejected",
  "valid-review-only-inspection-handoff-metadata-boundary":
    "valid_review_only_inspection_handoff_metadata_boundary_runtime_still_blocked"
});

const boundaryCommandProbes = Object.freeze([
  "review-only-inspection-handoff-metadata-boundary",
  "create-review-only-inspection-handoff-metadata-boundary",
  "inspection-handoff-metadata-boundary",
  "phase-5-38-review-only-inspection-handoff-metadata-boundary",
  "reviewer-routing",
  "reviewer-assignment",
  "serve-runtime"
]);

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function validCheckpoint() {
  return clone(phase537Fixture.handoffDispositionInspectionCheckpoint);
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

function createResult(checkpoints, options = {}) {
  return createReviewOnlyInspectionHandoffMetadataBoundaryForReview({
    reviewedAt,
    handoffDispositionInspectionCheckpoints: checkpoints,
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
    inspectionHandoffMetadataProduced: result.inspectionHandoffMetadataProduced,
    inspectionHandoffMetadataIsReviewerRouting:
      result.inspectionHandoffMetadataIsReviewerRouting,
    inspectionHandoffMetadataIsReviewerAssignment:
      result.inspectionHandoffMetadataIsReviewerAssignment,
    inspectionHandoffMetadataIsEvaluatorExecution:
      result.inspectionHandoffMetadataIsEvaluatorExecution,
    inspectionHandoffMetadataIsEvaluatorResult:
      result.inspectionHandoffMetadataIsEvaluatorResult,
    inspectionHandoffMetadataIsApprovalDecision:
      result.inspectionHandoffMetadataIsApprovalDecision,
    inspectionHandoffMetadataIsApprovalGrant:
      result.inspectionHandoffMetadataIsApprovalGrant,
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

function authorizationBoundaryCases() {
  const conflicting = checkpointWith({
    reviewedAt: "2026-06-17T00:00:01.000Z"
  });
  return [
    [
      "missing-review-only-inspection-handoff-metadata-boundary-input-rejected",
      createReviewOnlyInspectionHandoffMetadataBoundaryForReview({ reviewedAt })
    ],
    [
      "malformed-review-only-inspection-handoff-metadata-boundary-input-rejected",
      createReviewOnlyInspectionHandoffMetadataBoundaryForReview(null)
    ],
    [
      "malformed-review-only-inspection-handoff-metadata-boundary-invalid-reviewed-at-rejected",
      createReviewOnlyInspectionHandoffMetadataBoundaryForReview({
        reviewedAt: "not-a-date",
        handoffDispositionInspectionCheckpoints: [validCheckpoint()]
      })
    ],
    [
      "empty-review-only-inspection-handoff-metadata-boundary-input-rejected",
      createResult([])
    ],
    [
      "conflicting-review-only-inspection-handoff-metadata-boundary-input-rejected",
      createResult([validCheckpoint(), conflicting])
    ],
    [
      "stale-review-only-inspection-handoff-metadata-boundary-input-rejected",
      createResult([
        checkpointWith({ reviewedAt: "2026-06-16T23:59:59.000Z" })
      ])
    ],
    [
      "revoked-review-only-inspection-handoff-metadata-boundary-input-rejected",
      createResult([checkpointWith({ status: "revoked" })])
    ],
    [
      "unknown-review-only-inspection-handoff-metadata-boundary-input-rejected",
      createResult([checkpointWith({ status: "unknown" })])
    ],
    [
      "duplicate-invalid-review-only-inspection-handoff-metadata-boundary-input-rejected",
      createResult([validCheckpoint(), validCheckpoint()])
    ],
    [
      "authorizing-looking-review-only-inspection-handoff-metadata-boundary-input-rejected",
      createResult([
        checkpointWithNested(
          "handoffDispositionInspectionCheckpointSummary",
          "canGrantRuntime"
        )
      ])
    ],
    [
      "grant-looking-review-only-inspection-handoff-metadata-boundary-input-rejected",
      createResult([
        checkpointWithNested(
          "handoffDispositionInspectionCheckpointSummary",
          "grant"
        )
      ])
    ],
    [
      "approval-decision-looking-review-only-inspection-handoff-metadata-boundary-input-rejected",
      createResult([checkpointWith({ approvalDecisionProduced: true })])
    ],
    [
      "approval-grant-looking-review-only-inspection-handoff-metadata-boundary-input-rejected",
      createResult([checkpointWith({ approvalGrantProduced: true })])
    ],
    [
      "evaluator-result-looking-review-only-inspection-handoff-metadata-boundary-input-rejected",
      createResult([checkpointWith({ evaluatorResultProduced: true })])
    ],
    [
      "evaluator-execution-looking-review-only-inspection-handoff-metadata-boundary-input-rejected",
      createResult([checkpointWith({ evaluatorExecuted: true })])
    ],
    [
      "reviewer-routing-looking-review-only-inspection-handoff-metadata-boundary-input-rejected",
      createResult([checkpointWith({ reviewerRoutingEnabled: true })])
    ],
    [
      "reviewer-assignment-looking-review-only-inspection-handoff-metadata-boundary-input-rejected",
      createResult([checkpointWith({ reviewerAssignmentEnabled: true })])
    ],
    [
      "runtime-permission-looking-review-only-inspection-handoff-metadata-boundary-input-rejected",
      createResult([checkpointWith({ runtimePermissionGranted: true })])
    ],
    [
      "command-exposure-looking-review-only-inspection-handoff-metadata-boundary-input-rejected",
      createResult([checkpointWith({ commandExposurePermissionGranted: true })])
    ],
    [
      "runtime-effect-true-review-only-inspection-handoff-metadata-boundary-input-rejected",
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
      "process-flag-true-review-only-inspection-handoff-metadata-boundary-input-rejected",
      createResult([
        checkpointWithNested(
          "handoffDispositionInspectionCheckpointSummary",
          "processSpawned"
        )
      ])
    ],
    [
      "unsafe-top-level-review-only-inspection-handoff-metadata-boundary-input-rejected",
      createResult([checkpointWith({ inspectionHandoffMetadata: {} })])
    ],
    [
      "unsafe-nested-checkpoint-inspection-handoff-metadata-review-only-inspection-handoff-metadata-boundary-input-rejected",
      createResult([
        checkpointWithNested(
          "handoffDispositionInspectionCheckpointSummary",
          "inspectionHandoffMetadata"
        )
      ])
    ],
    [
      "execution-signal-looking-review-only-inspection-handoff-metadata-boundary-input-rejected",
      createResult([
        checkpointWithNested(
          "handoffDispositionInspectionCheckpointSummary",
          "executionSignal"
        )
      ])
    ],
    [
      "valid-review-only-inspection-handoff-metadata-boundary",
      createResult([validCheckpoint()])
    ]
  ].map(([caseId, result]) => caseSummary(caseId, result));
}

function expectedFixture() {
  const validResult = createResult([validCheckpoint()]);
  return {
    schema: REVIEW_ONLY_INSPECTION_HANDOFF_METADATA_BOUNDARY_SCHEMA,
    schemaVersion: "0.1.0",
    phase: "phase-5.38-review-only-inspection-handoff-metadata-boundary",
    boundaryKind: "review-only-inspection-handoff-metadata-boundary",
    metadataGeneratedAt: reviewedAt,
    sourcePhase: {
      phase: "phase-5.37-review-only-handoff-disposition-inspection-checkpoint",
      handoffDispositionInspectionCheckpointPath:
        "packages/core/src/index.mjs#createReviewOnlyHandoffDispositionInspectionCheckpointForReview",
      inspectionHandoffMetadataBoundaryPath:
        "packages/core/src/index.mjs#createReviewOnlyInspectionHandoffMetadataBoundaryForReview",
      sourceHandoffDispositionInspectionCheckpointFixture:
        "tests/fixtures/host-policy/phase5-37/review-only-handoff-disposition-inspection-checkpoint.json",
      runtimeEnabled: false,
      reviewerRoutingPerformed: false,
      reviewerAssignmentPerformed: false,
      approvalDecisionProduced: false,
      approvalGrantProduced: false,
      evaluatorExecutionPerformed: false
    },
    inspectionHandoffMetadataSummary: {
      reviewOnlyInspectionHandoffMetadataBoundaryRecorded: true,
      boundaryKind: "review-only-inspection-handoff-metadata-boundary",
      boundaryReviewOnly: true,
      boundaryAuthoritative: false,
      validHandoffDispositionInspectionCheckpointProducesMetadata: true,
      missingHandoffDispositionInspectionCheckpointRejected: true,
      malformedHandoffDispositionInspectionCheckpointRejected: true,
      emptyHandoffDispositionInspectionCheckpointRejected: true,
      conflictingHandoffDispositionInspectionCheckpointRejected: true,
      staleHandoffDispositionInspectionCheckpointRejected: true,
      revokedHandoffDispositionInspectionCheckpointRejected: true,
      unknownHandoffDispositionInspectionCheckpointRejected: true,
      duplicateInvalidHandoffDispositionInspectionCheckpointRejected: true,
      authorizingLookingHandoffDispositionInspectionCheckpointRejected: true,
      grantLookingHandoffDispositionInspectionCheckpointRejected: true,
      approvalDecisionLookingHandoffDispositionInspectionCheckpointRejected: true,
      approvalGrantLookingHandoffDispositionInspectionCheckpointRejected: true,
      evaluatorResultLookingHandoffDispositionInspectionCheckpointRejected: true,
      evaluatorExecutionLookingHandoffDispositionInspectionCheckpointRejected: true,
      reviewerRoutingLookingHandoffDispositionInspectionCheckpointRejected: true,
      reviewerAssignmentLookingHandoffDispositionInspectionCheckpointRejected: true,
      runtimePermissionLookingHandoffDispositionInspectionCheckpointRejected: true,
      commandExposureLookingHandoffDispositionInspectionCheckpointRejected: true,
      runtimeEffectTrueHandoffDispositionInspectionCheckpointRejected: true,
      processFlagTrueHandoffDispositionInspectionCheckpointRejected: true,
      unsafeHandoffDispositionInspectionCheckpointRejected: true,
      executionSignalLookingHandoffDispositionInspectionCheckpointRejected: true,
      inspectionHandoffMetadataIsReviewerRouting: false,
      inspectionHandoffMetadataIsReviewerAssignment: false,
      inspectionHandoffMetadataIsEvaluatorExecution: false,
      inspectionHandoffMetadataIsEvaluatorResult: false,
      inspectionHandoffMetadataIsApprovalDecision: false,
      inspectionHandoffMetadataIsApprovalGrant: false,
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
      serveRuntimeStillDefaultBlocked: true,
      dryRunBypassesBlock: false,
      canEnableRuntime: false
    },
    inspectionHandoffMetadataInputShape: {
      handoffDispositionInspectionCheckpoints:
        "exactly one Phase 5.37 review-only handoff disposition inspection checkpoint state",
      handoffDispositionInspectionCheckpointSchema:
        "ardyn.phase-5.37.review-only-handoff-disposition-inspection-checkpoint-state",
      handoffDispositionInspectionCheckpointMode: "review-only",
      validHandoffDispositionInspectionCheckpointRequired: true,
      authorizingLookingCheckpointPolicy: "fail-closed",
      grantLookingCheckpointPolicy: "fail-closed",
      reviewerRoutingLookingCheckpointPolicy: "fail-closed",
      reviewerAssignmentLookingCheckpointPolicy: "fail-closed",
      evaluatorExecutionLookingCheckpointPolicy: "fail-closed",
      runtimeEffectTrueCheckpointPolicy: "fail-closed",
      processFlagTrueCheckpointPolicy: "fail-closed",
      unsafeTopLevelCheckpointPolicy: "fail-closed",
      unsafeNestedCheckpointInspectionHandoffMetadataPolicy: "fail-closed",
      executionSignalLookingCheckpointPolicy: "fail-closed",
      filesystemWatcherAllowed: false,
      externalSourceLookupAllowed: false,
      secretsEnvIngestionAllowed: false,
      filePathAllowed: false,
      urlAllowed: false
    },
    inspectionHandoffMetadataResultShape: {
      schema:
        "ardyn.phase-5.38.review-only-inspection-handoff-metadata-boundary-result",
      schemaVersion: "0.1.0",
      boundaryKind: "review-only-inspection-handoff-metadata-boundary",
      boundaryMode: "review-only",
      stateSchema:
        "ardyn.phase-5.38.review-only-inspection-handoff-metadata-state",
      stateKind: "review-only-inspection-handoff-metadata-state",
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
    inspectionHandoffMetadataCases: authorizationBoundaryCases(),
    inspectionHandoffMetadata: validResult.inspectionHandoffMetadata,
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
      "tests/phase5-38-review-only-inspection-handoff-metadata-boundary.test.mjs",
      "tests/fixtures/host-policy/phase5-38/review-only-inspection-handoff-metadata-boundary.json",
      "docs/phase-5-38-review-only-inspection-handoff-metadata-boundary.md",
      "docs/phase-5-37-review-only-handoff-disposition-inspection-checkpoint.md",
      "README.md",
      "apps/cli/README.md",
      "crates/ardyn-host/README.md",
      "scripts/report-phase-status.mjs",
      "tests/report-phase-status.test.mjs"
    ],
    filesForbiddenToChange: [
      "apps/cli/src/index.mjs",
      "crates/ardyn-host/src/lib.rs",
      "crates/ardyn-host/src/stdio_runtime.rs",
      "packages/adapters/**",
      "packages/fabric/**",
      ".env",
      ".env.local"
    ],
    validationCommands: [
      "node --test tests/phase5-38-review-only-inspection-handoff-metadata-boundary.test.mjs",
      "node --test tests/report-phase-status.test.mjs",
      "npm test",
      "npm run test:schemas",
      "npm run report:phase-status",
      "cargo test --workspace",
      "cargo check --workspace",
      "cargo fmt --check",
      "git diff --check",
      "git diff --cached --check",
      "fallow health --score --hotspots --targets --format json",
      "fallow audit --format json"
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

test("Phase 5.38 inspection handoff metadata fixture is deterministic metadata", async () => {
  const fixture = JSON.parse(await readFile(fixtureUrl, "utf8"));

  assert.deepEqual(Object.keys(fixture), expectedTopLevelKeys);
  assert.deepEqual(fixture, expectedFixture());
});

test("Phase 5.38 inspection handoff metadata classifies checkpoint cases", () => {
  const cases = authorizationBoundaryCases();

  assert.deepEqual(
    cases.map(({ caseId }) => caseId),
    expectedCaseIds
  );
  for (const boundaryCase of cases) {
    assert.equal(
      boundaryCase.classification,
      expectedClassifications[boundaryCase.caseId],
      boundaryCase.caseId
    );
    assert.equal(boundaryCase.reviewOnly, true);
    assert.equal(boundaryCase.authoritative, false);
    assert.equal(boundaryCase.reviewArtifactOnly, true);
    assert.equal(boundaryCase.inspectionHandoffMetadataIsReviewerRouting, false);
    assert.equal(boundaryCase.inspectionHandoffMetadataIsReviewerAssignment, false);
    assert.equal(boundaryCase.inspectionHandoffMetadataIsEvaluatorExecution, false);
    assert.equal(boundaryCase.inspectionHandoffMetadataIsEvaluatorResult, false);
    assert.equal(boundaryCase.inspectionHandoffMetadataIsApprovalDecision, false);
    assert.equal(boundaryCase.inspectionHandoffMetadataIsApprovalGrant, false);
    assert.equal(boundaryCase.approvalGrant.produced, false);
    assert.equal(boundaryCase.approvalGrant.persisted, false);
    assert.equal(boundaryCase.approvalGrant.grantId, null);
    assertAllFalse(boundaryCase.runtimeEffect);
  }
});

test("Phase 5.38 malformed boundary input fails closed without throwing", () => {
  for (const input of [null, "bad", { reviewedAt: "bad" }]) {
    const result =
      createReviewOnlyInspectionHandoffMetadataBoundaryForReview(input);

    assert.equal(
      result.classification,
      "malformed_review_only_inspection_handoff_metadata_boundary_input_rejected"
    );
    assert.equal(result.inspectionHandoffMetadataProduced, false);
    assert.equal(result.inspectionHandoffMetadata, null);
    assert.equal(result.approvalGrantProduced, false);
    assert.equal(result.runtimeExecutionEnabled, false);
    assertAllFalse(result.runtimeEffect);
  }
});

test("Phase 5.38 valid checkpoint produces only inspection handoff metadata", () => {
  const result = createResult([validCheckpoint()]);
  const metadata = result.inspectionHandoffMetadata;

  assert.equal(
    result.classification,
    "valid_review_only_inspection_handoff_metadata_boundary_runtime_still_blocked"
  );
  assert.equal(result.inspectionHandoffMetadataProduced, true);
  assert.equal(metadata.schema, "ardyn.phase-5.38.review-only-inspection-handoff-metadata-state");
  assert.equal(metadata.stateKind, "review-only-inspection-handoff-metadata-state");
  assert.equal(metadata.stateMode, "review-only");
  assert.equal(metadata.inspectionHandoffMetadataOnly, true);
  assert.equal(metadata.inspectionHandoffMetadataIsReviewerRouting, false);
  assert.equal(metadata.inspectionHandoffMetadataIsReviewerAssignment, false);
  assert.equal(metadata.inspectionHandoffMetadataIsEvaluatorExecution, false);
  assert.equal(metadata.inspectionHandoffMetadataIsEvaluatorResult, false);
  assert.equal(metadata.inspectionHandoffMetadataIsApprovalDecision, false);
  assert.equal(metadata.inspectionHandoffMetadataIsApprovalGrant, false);
  assert.equal(metadata.reviewerRoutingPerformed, false);
  assert.equal(metadata.reviewerAssignmentPerformed, false);
  assert.equal(metadata.evaluatorExecuted, false);
  assert.equal(metadata.evaluatorResultProduced, false);
  assert.equal(metadata.approvalDecisionProduced, false);
  assert.equal(metadata.approvalGrantProduced, false);
  assert.equal(metadata.approvalGrantPersisted, false);
  assert.equal(metadata.runtimePermissionGranted, false);
  assert.equal(metadata.commandExposurePermissionGranted, false);
  assertAllFalse(metadata.runtimeEffect);
});

test("Phase 5.38 rejected checkpoint fails closed before metadata", () => {
  const result = createResult([
    checkpointWith({ commandExposurePermissionGranted: true })
  ]);

  assert.equal(
    result.classification,
    "command_exposure_looking_review_only_inspection_handoff_metadata_boundary_input_rejected"
  );
  assert.equal(result.handoffDispositionInspectionCheckpointAccepted, false);
  assert.equal(result.inspectionHandoffMetadataProduced, false);
  assert.equal(result.inspectionHandoffMetadata, null);
  assert.equal(result.approvalDecisionProduced, false);
  assert.equal(result.approvalGrantProduced, false);
  assert.equal(result.runtimeCommandExposureEnabled, false);
  assert.equal(result.runtimeExecutionEnabled, false);
  assertAllFalse(result.runtimeEffect);
});

test("Phase 5.38 fixture mirrors boundary cases and blocks authorization", async () => {
  const fixture = JSON.parse(await readFile(fixtureUrl, "utf8"));

  assert.deepEqual(
    fixture.inspectionHandoffMetadataCases.map(({ caseId }) => caseId),
    expectedCaseIds
  );
  for (const boundaryCase of fixture.inspectionHandoffMetadataCases) {
    assert.equal(boundaryCase.approvalGrant.produced, false);
    assert.equal(boundaryCase.approvalGrant.persisted, false);
    assert.equal(boundaryCase.approvalGrant.grantId, null);
    assert.equal(boundaryCase.reviewerRoutingPerformed, false);
    assert.equal(boundaryCase.reviewerAssignmentPerformed, false);
    assert.equal(boundaryCase.evaluatorExecuted, false);
    assert.equal(boundaryCase.evaluatorResultProduced, false);
    assert.equal(boundaryCase.approvalDecisionProduced, false);
    assert.equal(boundaryCase.approvalGrantProduced, false);
    assert.equal(boundaryCase.runtimePermissionGranted, false);
    assert.equal(boundaryCase.commandExposurePermissionGranted, false);
    assertAllFalse(boundaryCase.runtimeEffect);
  }
  assertAllFalse(fixture.blockedRuntimeEffect);
  assert.equal(fixture.serveRuntimeBlockedBehavior.defaultBlocked, true);
  assert.equal(fixture.serveRuntimeBlockedBehavior.dryRunBlocked, true);
  assert.equal(fixture.serveRuntimeBlockedBehavior.dryRunBypassesBlock, false);
  assert.equal(fixture.serveRuntimeBlockedBehavior.stdout, "");
  assert.deepEqual(fixture.inspectionHandoffMetadataResultShape, {
    ...expectedFixture().inspectionHandoffMetadataResultShape
  });
});

test("serve-runtime remains default-blocked and dry-run cannot bypass Phase 5.38", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-38-runtime-"));

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

test("Phase 5.38 inspection handoff metadata command names remain rejected", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-38-commands-"));

  try {
    for (const command of boundaryCommandProbes) {
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

test("Phase 5.38 does not change CLI runtime source or add boundary commands", async () => {
  const currentSource = await readFile(cliSourceUrl, "utf8");
  const { stdout: baselineSource } = await execFileAsync("git", [
    "show",
    `${phase538BaselineCommit}:apps/cli/src/index.mjs`
  ], {
    cwd: repoRoot,
    maxBuffer: 1024 * 1024
  });

  assert.equal(currentSource, baselineSource);
  assert.doesNotMatch(currentSource, /createReviewOnlyInspectionHandoffMetadataBoundaryForReview/);
  assert.doesNotMatch(currentSource, /inspection-handoff-metadata-boundary/);
});
