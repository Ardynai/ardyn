import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";
import {
  CONSUMER_CONTRACT_READINESS_MATRIX_SCHEMA,
  createConsumerContractReadinessMatrixForReview
} from "../packages/core/src/index.mjs";

const execFileAsync = promisify(execFile);
const phase546BaselineCommit = "1e50b36ad77400686e09ba0c3998131d1911d83c";
const reviewedAt = "2026-06-19T00:00:00.000Z";
const repoRootUrl = new URL("../", import.meta.url);
const repoRoot = fileURLToPath(repoRootUrl);
const cliPath = fileURLToPath(new URL("../apps/cli/src/index.mjs", import.meta.url));
const phase545FixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-45/target-consumer-planning-metadata.json",
  import.meta.url
);
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-46/consumer-contract-readiness-matrix.json",
  import.meta.url
);
const phase545Fixture = JSON.parse(
  readFileSync(fileURLToPath(phase545FixtureUrl), "utf8")
);

const expectedCaseClassifications = Object.freeze({
  "missing-consumer-contract-readiness-matrix-input-rejected":
    "missing_consumer_contract_readiness_matrix_input_rejected",
  "malformed-consumer-contract-readiness-matrix-input-rejected":
    "malformed_consumer_contract_readiness_matrix_input_rejected",
  "malformed-consumer-contract-readiness-matrix-invalid-reviewed-at-rejected":
    "malformed_consumer_contract_readiness_matrix_input_rejected",
  "empty-consumer-contract-readiness-matrix-input-rejected":
    "empty_consumer_contract_readiness_matrix_input_rejected",
  "duplicate-invalid-consumer-contract-readiness-matrix-input-rejected":
    "duplicate_invalid_consumer_contract_readiness_matrix_input_rejected",
  "mismatched-source-digest-consumer-contract-readiness-matrix-input-rejected":
    "mismatched_source_digest_consumer_contract_readiness_matrix_input_rejected",
  "reviewer-routing-looking-consumer-contract-readiness-matrix-input-rejected":
    "reviewer_routing_looking_consumer_contract_readiness_matrix_input_rejected",
  "reviewer-assignment-looking-consumer-contract-readiness-matrix-input-rejected":
    "reviewer_assignment_looking_consumer_contract_readiness_matrix_input_rejected",
  "evaluator-execution-looking-consumer-contract-readiness-matrix-input-rejected":
    "evaluator_execution_looking_consumer_contract_readiness_matrix_input_rejected",
  "evaluator-result-looking-consumer-contract-readiness-matrix-input-rejected":
    "evaluator_result_looking_consumer_contract_readiness_matrix_input_rejected",
  "approval-decision-looking-consumer-contract-readiness-matrix-input-rejected":
    "approval_decision_looking_consumer_contract_readiness_matrix_input_rejected",
  "grant-looking-consumer-contract-readiness-matrix-input-rejected":
    "grant_looking_consumer_contract_readiness_matrix_input_rejected",
  "runtime-permission-looking-consumer-contract-readiness-matrix-input-rejected":
    "runtime_permission_looking_consumer_contract_readiness_matrix_input_rejected",
  "command-exposure-looking-consumer-contract-readiness-matrix-input-rejected":
    "command_exposure_looking_consumer_contract_readiness_matrix_input_rejected",
  "runtime-effect-true-consumer-contract-readiness-matrix-input-rejected":
    "runtime_effect_true_consumer_contract_readiness_matrix_input_rejected",
  "process-flag-true-consumer-contract-readiness-matrix-input-rejected":
    "process_flag_true_consumer_contract_readiness_matrix_input_rejected",
  "runtime-execution-signal-looking-consumer-contract-readiness-matrix-input-rejected":
    "execution_signal_looking_consumer_contract_readiness_matrix_input_rejected",
  "valid-consumer-contract-readiness-matrix":
    "valid_consumer_contract_readiness_matrix_runtime_still_blocked"
});

const commandProbes = Object.freeze([
  "consumer-contract-readiness-matrix",
  "create-consumer-contract-readiness-matrix",
  "phase-5-46-consumer-contract-readiness-matrix",
  "locus-consumer-contract-readiness",
  "multiverse-consumer-contract-readiness",
  "secure-drop",
  "fabric-runtime",
  "registry-websocket-runtime",
  "mcp-tool-exposure",
  "task-execution",
  "connector-grant"
]);

const nonAuthorizingResultFields = Object.freeze([
  "consumerContractReadinessMatrixIsReviewerRouting",
  "consumerContractReadinessMatrixIsReviewerAssignment",
  "consumerContractReadinessMatrixIsEvaluatorExecution",
  "consumerContractReadinessMatrixIsEvaluatorResult",
  "consumerContractReadinessMatrixIsApprovalDecision",
  "consumerContractReadinessMatrixIsApprovalGrant",
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

function validSourceState() {
  return clone(phase545Fixture.targetConsumerPlanningMetadata);
}

function sourceWith(overrides = {}) {
  return {
    ...validSourceState(),
    ...overrides
  };
}

function sourceWithRuntimeEffect(overrides = {}) {
  const source = validSourceState();
  source.runtimeEffect = {
    ...source.runtimeEffect,
    ...overrides
  };
  return source;
}

function createResult(entries, options = {}) {
  const input = {
    reviewedAt,
    targetConsumerPlanningMetadataEntries: entries,
    ...options
  };

  if (!Object.prototype.hasOwnProperty.call(input, "sourceTargetConsumerPlanningMetadataDigest")) {
    input.sourceTargetConsumerPlanningMetadataDigest =
      Array.isArray(entries) && entries.length === 1
        ? stableDigest(entries[0])
        : "sha256:0000000000000000000000000000000000000000000000000000000000000000";
  }

  return createConsumerContractReadinessMatrixForReview(input);
}

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

  assertAllFalse(result.runtimeEffect);
}

function assertAuthorizationFlags(flags) {
  assert.equal(flags.documentaryMetadataVisible, true);

  for (const [key, value] of Object.entries(flags)) {
    if (key !== "documentaryMetadataVisible") {
      assert.equal(value, false, `${key} should be false`);
    }
  }
}

test("Phase 5.46 consumer contract readiness matrix fixture is deterministic", async () => {
  const fixture = await readFixture();
  const source = validSourceState();
  const generated = createResult([source], {
    sourceTargetConsumerPlanningMetadataDigest: stableDigest(source)
  });

  assert.equal(fixture.schema, CONSUMER_CONTRACT_READINESS_MATRIX_SCHEMA);
  assert.deepEqual(fixture, generated);
  assert.equal(fixture.classification, expectedCaseClassifications["valid-consumer-contract-readiness-matrix"]);
  assert.equal(fixture.consumerContractReadinessMatrixProduced, true);
  assert.deepEqual(fixture.targetConsumerIds, ["locus", "multiverse"]);
  assert.equal(fixture.matrixSummary.rowCount, 11);
  assert.equal(fixture.matrixSummary.locusRowCount, 5);
  assert.equal(fixture.matrixSummary.multiverseRowCount, 6);
});

test("Phase 5.46 classifies readiness matrix cases without authorization", () => {
  const validSource = validSourceState();
  const cases = [
    [
      "missing-consumer-contract-readiness-matrix-input-rejected",
      createConsumerContractReadinessMatrixForReview({
        reviewedAt,
        sourceTargetConsumerPlanningMetadataDigest: stableDigest(validSource)
      })
    ],
    [
      "malformed-consumer-contract-readiness-matrix-input-rejected",
      createConsumerContractReadinessMatrixForReview(null)
    ],
    [
      "malformed-consumer-contract-readiness-matrix-invalid-reviewed-at-rejected",
      createConsumerContractReadinessMatrixForReview({
        reviewedAt: "2026-06-19",
        targetConsumerPlanningMetadataEntries: [validSource],
        sourceTargetConsumerPlanningMetadataDigest: stableDigest(validSource)
      })
    ],
    ["empty-consumer-contract-readiness-matrix-input-rejected", createResult([])],
    [
      "duplicate-invalid-consumer-contract-readiness-matrix-input-rejected",
      createResult([validSource, validSource])
    ],
    [
      "mismatched-source-digest-consumer-contract-readiness-matrix-input-rejected",
      createResult([validSource], {
        sourceTargetConsumerPlanningMetadataDigest:
          "sha256:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
      })
    ],
    [
      "reviewer-routing-looking-consumer-contract-readiness-matrix-input-rejected",
      createResult([sourceWith({ reviewerRoutingPerformed: true })])
    ],
    [
      "reviewer-assignment-looking-consumer-contract-readiness-matrix-input-rejected",
      createResult([sourceWith({ reviewerAssignmentPerformed: true })])
    ],
    [
      "evaluator-execution-looking-consumer-contract-readiness-matrix-input-rejected",
      createResult([sourceWith({ evaluatorExecutionPerformed: true })])
    ],
    [
      "evaluator-result-looking-consumer-contract-readiness-matrix-input-rejected",
      createResult([sourceWith({ evaluatorResultProduced: true })])
    ],
    [
      "approval-decision-looking-consumer-contract-readiness-matrix-input-rejected",
      createResult([sourceWith({ approvalDecisionProduced: true })])
    ],
    [
      "grant-looking-consumer-contract-readiness-matrix-input-rejected",
      createResult([sourceWith({ connectorGrantProduced: true })])
    ],
    [
      "runtime-permission-looking-consumer-contract-readiness-matrix-input-rejected",
      createResult([sourceWith({ runtimePermissionGranted: true })])
    ],
    [
      "command-exposure-looking-consumer-contract-readiness-matrix-input-rejected",
      createResult([sourceWith({ commandRuntimeControlEnabled: true })])
    ],
    [
      "runtime-effect-true-consumer-contract-readiness-matrix-input-rejected",
      createResult([sourceWithRuntimeEffect({ runtimeExecutionEnabled: true })])
    ],
    [
      "process-flag-true-consumer-contract-readiness-matrix-input-rejected",
      createResult([sourceWith({ processControlEnabled: true })])
    ],
    [
      "runtime-execution-signal-looking-consumer-contract-readiness-matrix-input-rejected",
      createResult([sourceWith({ mcpToolExposureEnabled: true })])
    ],
    ["valid-consumer-contract-readiness-matrix", createResult([validSource])]
  ];

  for (const [caseName, result] of cases) {
    assert.equal(result.classification, expectedCaseClassifications[caseName], caseName);
    assert.equal(result.reviewOnly, true);
    assert.equal(result.authoritative, false);
    assertNonAuthorizing(result);
  }
});

test("Phase 5.46 matrix covers required Locus and Multiverse rows", async () => {
  const fixture = await readFixture();
  const rows = new Map(fixture.matrixRows.map((row) => [row.rowId, row]));

  assert.deepEqual([...rows.keys()], [
    "locus.status-control-surface-display",
    "locus.process-tool-capability-metadata",
    "locus.visible-review-artifacts",
    "locus.future-secure-drop-compose-inbox-surface",
    "locus.command-control-runtime-boundary",
    "multiverse.world-project-orchestration-metadata",
    "multiverse.visible-ai-capability-metadata",
    "multiverse.task-capability-wrapper-metadata",
    "multiverse.review-only-citizen-adapter-candidate-metadata",
    "multiverse.registry-websocket-mcp-task-runtime-boundary",
    "multiverse.fabric-coordination-metadata"
  ]);

  for (const row of rows.values()) {
    assert.equal(row.readinessState, "future-contract-required-runtime-blocked");
    assert.ok(row.requiredFutureContracts.length >= 3);
    assert.ok(row.currentAllowedBehavior.length > 0);
    assert.ok(row.explicitlyForbiddenBehavior.length >= 5);
    assert.ok(row.blockerNotes.length >= 2);
    assertAuthorizationFlags(row.authorizationFlags);
  }

  assert.ok(
    rows
      .get("locus.future-secure-drop-compose-inbox-surface")
      .requiredFutureContracts.includes(
        "content-fabric.secure-drop.compose-consumer-contract"
      )
  );
  assert.ok(
    rows
      .get("locus.future-secure-drop-compose-inbox-surface")
      .explicitlyForbiddenBehavior.includes("ST3GG vendoring")
  );
  assert.ok(
    rows
      .get("multiverse.registry-websocket-mcp-task-runtime-boundary")
      .explicitlyForbiddenBehavior.includes("MCP tool exposure")
  );
  assert.ok(
    rows
      .get("multiverse.fabric-coordination-metadata")
      .explicitlyForbiddenBehavior.includes("Fabric runtime surface")
  );
});

test("Phase 5.46 result remains non-authorizing and runtime blocked", async () => {
  const fixture = await readFixture();

  assert.equal(fixture.reviewOnly, true);
  assert.equal(fixture.authoritative, false);
  assert.equal(fixture.consumerContractReadinessMatrixOnly, true);
  assert.equal(fixture.sourceTargetConsumerPlanningMetadataAccepted, true);
  assertNonAuthorizing(fixture);
  assertNonAuthorizing(fixture.consumerContractReadinessMatrix);
  assert.equal(
    fixture.sourceTargetConsumerPlanningMetadataSummary.schema,
    "ardyn.phase-5.45.target-consumer-planning-metadata-state"
  );
  assert.deepEqual(fixture.sourceTargetConsumerPlanningMetadataSummary.firstClassTargetConsumerIds, [
    "locus",
    "multiverse"
  ]);
  assert.deepEqual(fixture.rejectionReasons, [
    "consumer_contract_readiness_matrix_is_review_only",
    "locus_and_multiverse_touchpoints_mapped_to_future_contracts",
    "runtime_command_connector_fabric_websocket_mcp_task_secure_drop_authorizations_false",
    "secure_drop_is_future_content_fabric_capability_reference_only",
    "fallow_runtime_not_used",
    "runtime_enablement_still_blocked"
  ]);
});

test("serve-runtime remains default-blocked and dry-run cannot bypass Phase 5.46", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-46-runtime-"));

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

test("Phase 5.46 readiness matrix command names remain rejected", async () => {
  for (const command of commandProbes) {
    const failure = await expectCliFailure([command]);

    assert.notEqual(failure.code, 0);
    assert.equal(failure.stdout, "");
    assert.match(failure.stderr, /unknown command|Usage: ardyn/i);
  }
});

test("Phase 5.46 does not change CLI, Rust, or Fabric runtime source", async () => {
  await execFileAsync(
    "git",
    [
      "diff",
      "--exit-code",
      phase546BaselineCommit,
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

  assert.doesNotMatch(currentCliSource, /consumer-contract-readiness-matrix/);
  assert.doesNotMatch(currentCliSource, /phase-5-46/);
});
