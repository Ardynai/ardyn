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
  TARGET_CONSUMER_PLANNING_METADATA_SCHEMA,
  createTargetConsumerPlanningMetadataForReview
} from "../packages/core/src/index.mjs";

const execFileAsync = promisify(execFile);
const phase545BaselineCommit = "e6352e0376db42ed2ee7fe2e4bf2984b79cdd7e4";
const reviewedAt = "2026-06-19T00:00:00.000Z";
const repoRootUrl = new URL("../", import.meta.url);
const repoRoot = fileURLToPath(repoRootUrl);
const cliSourceUrl = new URL("../apps/cli/src/index.mjs", import.meta.url);
const cliPath = fileURLToPath(cliSourceUrl);
const rustLibSourceUrl = new URL("../crates/ardyn-host/src/lib.rs", import.meta.url);
const rustStdioSourceUrl = new URL(
  "../crates/ardyn-host/src/stdio_runtime/mod.rs",
  import.meta.url
);
const fabricSourceUrl = new URL("../packages/fabric/src/index.mjs", import.meta.url);
const phase544FixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-44/review-only-consolidation-metadata-checkpoint.json",
  import.meta.url
);
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-45/target-consumer-planning-metadata.json",
  import.meta.url
);
const phase544Fixture = JSON.parse(
  readFileSync(fileURLToPath(phase544FixtureUrl), "utf8")
);

const expectedTopLevelKeys = Object.freeze([
  "schema",
  "schemaVersion",
  "targetConsumerPlanningMetadataKind",
  "targetConsumerPlanningMetadataMode",
  "reviewedAt",
  "classification",
  "sourceConsolidationMetadataCheckpointAccepted",
  "targetConsumerPlanningMetadataProduced",
  "targetConsumerPlanningMetadata",
  "sourceConsolidationMetadataCheckpointSummary",
  "targetConsumerPlanningSummary",
  "targetConsumers",
  "targetConsumerIds",
  "secureDropFutureCapability",
  "reviewOnly",
  "authoritative",
  "reviewArtifactOnly",
  "targetConsumerPlanningMetadataOnly",
  "targetConsumerPlanningMetadataIsReviewerRouting",
  "targetConsumerPlanningMetadataIsReviewerAssignment",
  "targetConsumerPlanningMetadataIsEvaluatorExecution",
  "targetConsumerPlanningMetadataIsEvaluatorResult",
  "targetConsumerPlanningMetadataIsApprovalDecision",
  "targetConsumerPlanningMetadataIsApprovalGrant",
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
  "mcpRuntimeExecutionEnabled",
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
  "rejectionReasons",
  "runtimeEffect"
]);

const expectedCaseClassifications = Object.freeze({
  "missing-target-consumer-planning-metadata-input-rejected":
    "missing_target_consumer_planning_metadata_input_rejected",
  "malformed-target-consumer-planning-metadata-input-rejected":
    "malformed_target_consumer_planning_metadata_input_rejected",
  "malformed-target-consumer-planning-metadata-invalid-reviewed-at-rejected":
    "malformed_target_consumer_planning_metadata_input_rejected",
  "empty-target-consumer-planning-metadata-input-rejected":
    "empty_target_consumer_planning_metadata_input_rejected",
  "duplicate-invalid-target-consumer-planning-metadata-input-rejected":
    "duplicate_invalid_target_consumer_planning_metadata_input_rejected",
  "mismatched-source-digest-target-consumer-planning-metadata-input-rejected":
    "mismatched_source_digest_target_consumer_planning_metadata_input_rejected",
  "reviewer-routing-looking-target-consumer-planning-metadata-input-rejected":
    "reviewer_routing_looking_target_consumer_planning_metadata_input_rejected",
  "reviewer-assignment-looking-target-consumer-planning-metadata-input-rejected":
    "reviewer_assignment_looking_target_consumer_planning_metadata_input_rejected",
  "evaluator-execution-looking-target-consumer-planning-metadata-input-rejected":
    "evaluator_execution_looking_target_consumer_planning_metadata_input_rejected",
  "evaluator-result-looking-target-consumer-planning-metadata-input-rejected":
    "evaluator_result_looking_target_consumer_planning_metadata_input_rejected",
  "approval-decision-looking-target-consumer-planning-metadata-input-rejected":
    "approval_decision_looking_target_consumer_planning_metadata_input_rejected",
  "grant-looking-target-consumer-planning-metadata-input-rejected":
    "grant_looking_target_consumer_planning_metadata_input_rejected",
  "runtime-permission-looking-target-consumer-planning-metadata-input-rejected":
    "runtime_permission_looking_target_consumer_planning_metadata_input_rejected",
  "command-exposure-looking-target-consumer-planning-metadata-input-rejected":
    "command_exposure_looking_target_consumer_planning_metadata_input_rejected",
  "runtime-effect-true-target-consumer-planning-metadata-input-rejected":
    "runtime_effect_true_target_consumer_planning_metadata_input_rejected",
  "process-flag-true-target-consumer-planning-metadata-input-rejected":
    "process_flag_true_target_consumer_planning_metadata_input_rejected",
  "secure-drop-execution-signal-looking-target-consumer-planning-metadata-input-rejected":
    "execution_signal_looking_target_consumer_planning_metadata_input_rejected",
  "valid-target-consumer-planning-metadata":
    "valid_target_consumer_planning_metadata_runtime_still_blocked"
});

const targetConsumerCommandProbes = Object.freeze([
  "target-consumer-planning-metadata",
  "create-target-consumer-planning-metadata",
  "phase-5-45-target-consumer-planning-metadata",
  "locus-target-consumer",
  "multiverse-target-consumer",
  "secure-drop",
  "fabric-runtime",
  "registry-websocket-runtime",
  "mcp-task-runtime",
  "connector-grant"
]);

const nonAuthorizingResultFields = Object.freeze([
  "targetConsumerPlanningMetadataIsReviewerRouting",
  "targetConsumerPlanningMetadataIsReviewerAssignment",
  "targetConsumerPlanningMetadataIsEvaluatorExecution",
  "targetConsumerPlanningMetadataIsEvaluatorResult",
  "targetConsumerPlanningMetadataIsApprovalDecision",
  "targetConsumerPlanningMetadataIsApprovalGrant",
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
  "mcpRuntimeExecutionEnabled",
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
  "auditRuntimeWritePerformed"
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

function validSourceCheckpoint() {
  return clone(phase544Fixture.consolidationMetadataCheckpoint);
}

function sourceWith(overrides = {}) {
  return {
    ...validSourceCheckpoint(),
    ...overrides
  };
}

function sourceWithRuntimeEffect(overrides = {}) {
  const source = validSourceCheckpoint();
  source.runtimeEffect = {
    ...source.runtimeEffect,
    ...overrides
  };
  return source;
}

function createResult(entries, options = {}) {
  const input = {
    reviewedAt,
    consolidationMetadataCheckpointEntries: entries,
    ...options
  };

  if (
    !Object.prototype.hasOwnProperty.call(
      input,
      "sourceConsolidationMetadataCheckpointDigest"
    ) &&
    Array.isArray(entries) &&
    entries[0] &&
    typeof entries[0] === "object" &&
    !Array.isArray(entries[0])
  ) {
    input.sourceConsolidationMetadataCheckpointDigest = stableDigest(entries[0]);
  }

  return createTargetConsumerPlanningMetadataForReview(input);
}

function expectedFixture() {
  return createResult([validSourceCheckpoint()]);
}

function targetConsumerPlanningCases() {
  const validSource = validSourceCheckpoint();
  return [
    [
      "missing-target-consumer-planning-metadata-input-rejected",
      createTargetConsumerPlanningMetadataForReview({
        reviewedAt,
        sourceConsolidationMetadataCheckpointDigest: stableDigest(validSource)
      })
    ],
    [
      "malformed-target-consumer-planning-metadata-input-rejected",
      createTargetConsumerPlanningMetadataForReview(null)
    ],
    [
      "malformed-target-consumer-planning-metadata-invalid-reviewed-at-rejected",
      createTargetConsumerPlanningMetadataForReview({
        reviewedAt: "not-a-date",
        sourceConsolidationMetadataCheckpointDigest: stableDigest(validSource),
        consolidationMetadataCheckpointEntries: [validSource]
      })
    ],
    ["empty-target-consumer-planning-metadata-input-rejected", createResult([])],
    [
      "duplicate-invalid-target-consumer-planning-metadata-input-rejected",
      createResult([validSourceCheckpoint(), validSourceCheckpoint()])
    ],
    [
      "mismatched-source-digest-target-consumer-planning-metadata-input-rejected",
      createResult([validSourceCheckpoint()], {
        sourceConsolidationMetadataCheckpointDigest:
          "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      })
    ],
    [
      "reviewer-routing-looking-target-consumer-planning-metadata-input-rejected",
      createResult([sourceWith({ reviewerRoutingPerformed: true })])
    ],
    [
      "reviewer-assignment-looking-target-consumer-planning-metadata-input-rejected",
      createResult([sourceWith({ reviewerAssignmentPerformed: true })])
    ],
    [
      "evaluator-execution-looking-target-consumer-planning-metadata-input-rejected",
      createResult([sourceWith({ evaluatorExecuted: true })])
    ],
    [
      "evaluator-result-looking-target-consumer-planning-metadata-input-rejected",
      createResult([sourceWith({ evaluatorResultProduced: true })])
    ],
    [
      "approval-decision-looking-target-consumer-planning-metadata-input-rejected",
      createResult([sourceWith({ approvalDecisionProduced: true })])
    ],
    [
      "grant-looking-target-consumer-planning-metadata-input-rejected",
      createResult([sourceWith({ connectorPermissionGranted: true })])
    ],
    [
      "runtime-permission-looking-target-consumer-planning-metadata-input-rejected",
      createResult([sourceWith({ runtimePermissionGranted: true })])
    ],
    [
      "command-exposure-looking-target-consumer-planning-metadata-input-rejected",
      createResult([sourceWith({ commandExposurePermissionGranted: true })])
    ],
    [
      "runtime-effect-true-target-consumer-planning-metadata-input-rejected",
      createResult([sourceWithRuntimeEffect({ runtimeExecutionEnabled: true })])
    ],
    [
      "process-flag-true-target-consumer-planning-metadata-input-rejected",
      createResult([sourceWith({ processControlEnabled: true })])
    ],
    [
      "secure-drop-execution-signal-looking-target-consumer-planning-metadata-input-rejected",
      createResult([sourceWith({ secureDropImplemented: true })])
    ],
    ["valid-target-consumer-planning-metadata", createResult([validSource])]
  ].map(([caseId, result]) => ({
    caseId,
    classification: result.classification,
    sourceAccepted: result.sourceConsolidationMetadataCheckpointAccepted,
    metadataProduced: result.targetConsumerPlanningMetadataProduced,
    targetConsumerIds: result.targetConsumerIds,
    secureDropImplemented: result.secureDropImplemented,
    connectorGrantProduced: result.connectorGrantProduced,
    fabricRuntimeSurfaceEnabled: result.fabricRuntimeSurfaceEnabled,
    contentFabricRuntimeBehaviorEnabled: result.contentFabricRuntimeBehaviorEnabled,
    runtimeExecutionEnabled: result.runtimeExecutionEnabled,
    runtimeEffect: result.runtimeEffect
  }));
}

function assertAllFalse(record) {
  for (const [field, value] of Object.entries(record)) {
    assert.equal(value, false, field);
  }
}

function assertNonAuthorizingResult(result) {
  for (const field of nonAuthorizingResultFields) {
    assert.equal(result[field], false, field);
  }
  assertAllFalse(result.runtimeEffect);
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

test("Phase 5.45 target-consumer planning fixture is deterministic metadata", async () => {
  const fixture = JSON.parse(await readFile(fixtureUrl, "utf8"));

  assert.deepEqual(Object.keys(fixture), expectedTopLevelKeys);
  assert.deepEqual(fixture, expectedFixture());
  assert.equal(fixture.schema, TARGET_CONSUMER_PLANNING_METADATA_SCHEMA);
});

test("Phase 5.45 classifies planning metadata cases without authorization", () => {
  const cases = targetConsumerPlanningCases();

  assert.deepEqual(
    cases.map(({ caseId }) => caseId),
    Object.keys(expectedCaseClassifications)
  );
  for (const planningCase of cases) {
    assert.equal(
      planningCase.classification,
      expectedCaseClassifications[planningCase.caseId],
      planningCase.caseId
    );
    assert.equal(planningCase.secureDropImplemented, false);
    assert.equal(planningCase.connectorGrantProduced, false);
    assert.equal(planningCase.fabricRuntimeSurfaceEnabled, false);
    assert.equal(planningCase.contentFabricRuntimeBehaviorEnabled, false);
    assert.equal(planningCase.runtimeExecutionEnabled, false);
    assertAllFalse(planningCase.runtimeEffect);
  }
});

test("Phase 5.45 records Locus and Multiverse as first-class target consumers", async () => {
  const fixture = JSON.parse(await readFile(fixtureUrl, "utf8"));
  const metadata = fixture.targetConsumerPlanningMetadata;
  const consumers = new Map(
    metadata.targetConsumers.map((consumer) => [consumer.consumerId, consumer])
  );
  const locus = consumers.get("locus");
  const multiverse = consumers.get("multiverse");

  assert.deepEqual(metadata.primaryHarnessLayer.firstClassTargetConsumers, [
    "locus",
    "multiverse"
  ]);
  assert.deepEqual(metadata.targetConsumerIds, ["locus", "multiverse"]);
  assert.equal(locus.firstClassTargetConsumer, true);
  assert.equal(locus.statusControlSurfaceContracts.statusMetadataVisible, true);
  assert.equal(locus.statusControlSurfaceContracts.commandControlEnabled, false);
  assert.equal(locus.statusControlSurfaceContracts.runtimeControlEnabled, false);
  assert.equal(locus.processToolCapabilityMetadata.processMetadataVisible, true);
  assert.equal(locus.processToolCapabilityMetadata.processControlEnabled, false);
  assert.equal(locus.reviewArtifacts.locusVisibleReviewArtifacts, true);
  assert.equal(locus.reviewArtifacts.reviewerRoutingPerformed, false);
  assert.equal(
    locus.secureDropFutureContractReferences.canonicalCapabilityOwner,
    "content-fabric"
  );
  assert.equal(
    locus.secureDropFutureContractReferences.ardynConsumesNow,
    false
  );
  assertAllFalse(locus.nonAuthorizingBoundary);

  assert.equal(multiverse.firstClassTargetConsumer, true);
  assert.equal(
    multiverse.worldProjectOrchestrationContracts.worldMetadataVisible,
    true
  );
  assert.equal(
    multiverse.worldProjectOrchestrationContracts.liveRegistryConnectionEnabled,
    false
  );
  assert.equal(multiverse.visibleAiCapabilityMetadata.aiCapabilityMetadataVisible, true);
  assert.equal(multiverse.visibleAiCapabilityMetadata.evaluatorExecutionEnabled, false);
  assert.equal(multiverse.taskCapabilityWrapperContracts.taskWrapperMetadataVisible, true);
  assert.equal(multiverse.taskCapabilityWrapperContracts.taskExecutionEnabled, false);
  assert.equal(multiverse.taskCapabilityWrapperContracts.mcpExecutionEnabled, false);
  assert.equal(
    multiverse.citizenAdapterCandidateMetadata.reviewOnlyCandidateMetadataVisible,
    true
  );
  assert.equal(
    multiverse.citizenAdapterCandidateMetadata.adapterRuntimeBehaviorEnabled,
    false
  );
  assert.equal(
    multiverse.fabricCoordinationMetadata.fabricCoordinationMetadataVisible,
    true
  );
  assert.equal(
    multiverse.fabricCoordinationMetadata.fabricRuntimeSurfaceEnabled,
    false
  );
  assert.equal(
    multiverse.fabricCoordinationMetadata.contentFabricRuntimeBehaviorEnabled,
    false
  );
  assertAllFalse(multiverse.nonAuthorizingBoundary);
});

test("Phase 5.45 describes Secure Drop only as future content-fabric capability", async () => {
  const fixture = JSON.parse(await readFile(fixtureUrl, "utf8"));
  const secureDrop = fixture.secureDropFutureCapability;

  assert.equal(secureDrop.canonicalCapability, "content-fabric.secure-drop");
  assert.equal(secureDrop.canonicalCapabilityOwner, "content-fabric");
  assert.equal(
    secureDrop.phaseStatus,
    "future-canonical-content-fabric-capability-reference-only"
  );
  assert.equal(secureDrop.ardynMayConsumeAfterExplicitAuthorization, true);
  assert.equal(secureDrop.ardynConsumesNow, false);
  assert.equal(secureDrop.cryptoImplemented, false);
  assert.equal(secureDrop.transportImplemented, false);
  assert.equal(secureDrop.stegoImplemented, false);
  assert.equal(secureDrop.sendReceiveImplemented, false);
  assert.equal(secureDrop.composeRuntimeImplemented, false);
  assert.equal(secureDrop.inboxPollingImplemented, false);
  assert.equal(secureDrop.fileSelectionImplemented, false);
  assert.equal(secureDrop.filesystemScanningImplemented, false);
  assert.equal(secureDrop.connectorIngestionImplemented, false);
  assert.equal(secureDrop.secretVaultEnvAccessImplemented, false);
  assert.equal(secureDrop.st3ggVendored, false);
  assert.equal(secureDrop.contentFabricRuntimeBehaviorEnabled, false);
});

test("Phase 5.45 result remains non-authorizing and runtime blocked", async () => {
  const fixture = JSON.parse(await readFile(fixtureUrl, "utf8"));

  assert.equal(fixture.reviewOnly, true);
  assert.equal(fixture.authoritative, false);
  assert.equal(fixture.reviewArtifactOnly, true);
  assert.equal(fixture.targetConsumerPlanningMetadataOnly, true);
  assertNonAuthorizingResult(fixture);
  assertNonAuthorizingResult(fixture.targetConsumerPlanningMetadata);
  assert.equal(
    fixture.targetConsumerPlanningSummary.secureDropFutureContentFabricCapabilityReferenceOnly,
    true
  );
  assert.equal(fixture.targetConsumerPlanningSummary.secureDropImplemented, false);
  assert.equal(fixture.targetConsumerPlanningSummary.fabricRuntimeSurfaceEnabled, false);
  assert.equal(
    fixture.targetConsumerPlanningSummary.contentFabricRuntimeBehaviorEnabled,
    false
  );
});

test("serve-runtime remains default-blocked and dry-run cannot bypass Phase 5.45", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-45-runtime-"));

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

test("Phase 5.45 planning command names remain rejected", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-45-commands-"));

  try {
    for (const command of targetConsumerCommandProbes) {
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

test("Phase 5.45 does not change CLI, Rust, or Fabric runtime source", async () => {
  const currentCliSource = await readFile(cliSourceUrl, "utf8");
  const currentRustLibSource = await readFile(rustLibSourceUrl, "utf8");
  const currentRustStdioSource = await readFile(rustStdioSourceUrl, "utf8");
  const fabricSourcePath = fileURLToPath(fabricSourceUrl);
  const { stdout: baselineCliSource } = await execFileAsync("git", [
    "show",
    `${phase545BaselineCommit}:apps/cli/src/index.mjs`
  ], {
    cwd: repoRoot,
    maxBuffer: 1024 * 1024
  });
  const { stdout: baselineRustLibSource } = await execFileAsync("git", [
    "show",
    `${phase545BaselineCommit}:crates/ardyn-host/src/lib.rs`
  ], {
    cwd: repoRoot,
    maxBuffer: 1024 * 1024
  });
  const { stdout: baselineRustStdioSource } = await execFileAsync("git", [
    "show",
    `${phase545BaselineCommit}:crates/ardyn-host/src/stdio_runtime/mod.rs`
  ], {
    cwd: repoRoot,
    maxBuffer: 1024 * 1024
  });
  await execFileAsync("git", ["diff", "--exit-code", "--", fabricSourcePath], {
    cwd: repoRoot,
    maxBuffer: 1024 * 1024
  });

  assert.equal(currentCliSource, baselineCliSource);
  assert.equal(currentRustLibSource, baselineRustLibSource);
  assert.equal(currentRustStdioSource, baselineRustStdioSource);
  assert.doesNotMatch(currentCliSource, /target-consumer-planning-metadata/);
  assert.doesNotMatch(currentCliSource, /secure-drop/);
});
