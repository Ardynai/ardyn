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
  CONSUMER_CONTRACT_GAP_INDEX_SCHEMA,
  createConsumerContractGapIndexForReview
} from "../packages/core/src/index.mjs";

const execFileAsync = promisify(execFile);
const phase547BaselineCommit = "2a59909a61810b662babfe933ca1bd533a85f8e8";
const reviewedAt = "2026-06-19T00:00:00.000Z";
const repoRootUrl = new URL("../", import.meta.url);
const repoRoot = fileURLToPath(repoRootUrl);
const cliPath = fileURLToPath(new URL("../apps/cli/src/index.mjs", import.meta.url));
const phase546FixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-46/consumer-contract-readiness-matrix.json",
  import.meta.url
);
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-47/consumer-contract-gap-index.json",
  import.meta.url
);
const phase546Fixture = JSON.parse(
  readFileSync(fileURLToPath(phase546FixtureUrl), "utf8")
);

const expectedCaseClassifications = Object.freeze({
  "missing-consumer-contract-gap-index-input-rejected":
    "missing_consumer_contract_gap_index_input_rejected",
  "malformed-consumer-contract-gap-index-input-rejected":
    "malformed_consumer_contract_gap_index_input_rejected",
  "malformed-consumer-contract-gap-index-invalid-reviewed-at-rejected":
    "malformed_consumer_contract_gap_index_input_rejected",
  "empty-consumer-contract-gap-index-input-rejected":
    "empty_consumer_contract_gap_index_input_rejected",
  "duplicate-invalid-consumer-contract-gap-index-input-rejected":
    "duplicate_invalid_consumer_contract_gap_index_input_rejected",
  "mismatched-source-digest-consumer-contract-gap-index-input-rejected":
    "mismatched_source_digest_consumer_contract_gap_index_input_rejected",
  "reviewer-routing-looking-consumer-contract-gap-index-input-rejected":
    "reviewer_routing_looking_consumer_contract_gap_index_input_rejected",
  "reviewer-assignment-looking-consumer-contract-gap-index-input-rejected":
    "reviewer_assignment_looking_consumer_contract_gap_index_input_rejected",
  "evaluator-execution-looking-consumer-contract-gap-index-input-rejected":
    "evaluator_execution_looking_consumer_contract_gap_index_input_rejected",
  "evaluator-result-looking-consumer-contract-gap-index-input-rejected":
    "evaluator_result_looking_consumer_contract_gap_index_input_rejected",
  "approval-decision-looking-consumer-contract-gap-index-input-rejected":
    "approval_decision_looking_consumer_contract_gap_index_input_rejected",
  "grant-looking-consumer-contract-gap-index-input-rejected":
    "grant_looking_consumer_contract_gap_index_input_rejected",
  "runtime-permission-looking-consumer-contract-gap-index-input-rejected":
    "runtime_permission_looking_consumer_contract_gap_index_input_rejected",
  "command-exposure-looking-consumer-contract-gap-index-input-rejected":
    "command_exposure_looking_consumer_contract_gap_index_input_rejected",
  "runtime-effect-true-consumer-contract-gap-index-input-rejected":
    "runtime_effect_true_consumer_contract_gap_index_input_rejected",
  "process-flag-true-consumer-contract-gap-index-input-rejected":
    "process_flag_true_consumer_contract_gap_index_input_rejected",
  "runtime-execution-signal-looking-consumer-contract-gap-index-input-rejected":
    "execution_signal_looking_consumer_contract_gap_index_input_rejected",
  "valid-consumer-contract-gap-index":
    "valid_consumer_contract_gap_index_runtime_still_blocked"
});

const commandProbes = Object.freeze([
  "consumer-contract-gap-index",
  "create-consumer-contract-gap-index",
  "phase-5-47-consumer-contract-gap-index",
  "locus-consumer-contract-gap",
  "multiverse-consumer-contract-gap",
  "secure-drop",
  "fabric-runtime",
  "registry-websocket-runtime",
  "mcp-tool-exposure",
  "task-execution",
  "connector-grant"
]);

const expectedGapIds = Object.freeze([
  "locus.status-control-surface-display-contract-gap",
  "locus.process-tool-capability-metadata-contract-gap",
  "locus.visible-review-artifact-contract-gap",
  "locus.future-secure-drop-compose-inbox-consumer-contract-gap",
  "locus.command-control-runtime-authorization-boundary-gap",
  "multiverse.world-project-orchestration-metadata-contract-gap",
  "multiverse.visible-ai-capability-metadata-contract-gap",
  "multiverse.task-capability-wrapper-metadata-contract-gap",
  "multiverse.review-only-citizen-adapter-candidate-contract-gap",
  "multiverse.fabric-coordination-metadata-contract-gap",
  "multiverse.registry-websocket-mcp-task-runtime-authorization-boundary-gap"
]);

const nonAuthorizingResultFields = Object.freeze([
  "consumerContractGapIndexIsReviewerRouting",
  "consumerContractGapIndexIsReviewerAssignment",
  "consumerContractGapIndexIsEvaluatorExecution",
  "consumerContractGapIndexIsEvaluatorResult",
  "consumerContractGapIndexIsApprovalDecision",
  "consumerContractGapIndexIsApprovalGrant",
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
  "httpRuntimeSurfaceEnabled",
  "webSocketHttpSurfaceEnabled"
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
  return clone(phase546Fixture.consumerContractReadinessMatrix);
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
    consumerContractReadinessMatrixEntries: entries,
    ...options
  };

  if (
    !Object.prototype.hasOwnProperty.call(
      input,
      "sourceConsumerContractReadinessMatrixDigest"
    )
  ) {
    input.sourceConsumerContractReadinessMatrixDigest =
      Array.isArray(entries) && entries.length === 1
        ? stableDigest(entries[0])
        : "sha256:0000000000000000000000000000000000000000000000000000000000000000";
  }

  return createConsumerContractGapIndexForReview(input);
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

function assertAuthorizationStatusFlags(flags) {
  for (const [key, value] of Object.entries(flags)) {
    assert.equal(value, false, `${key} should be false`);
  }
}

test("Phase 5.47 consumer contract gap index fixture is deterministic", async () => {
  const fixture = await readFixture();
  const source = validSourceState();
  const generated = createResult([source], {
    sourceConsumerContractReadinessMatrixDigest: stableDigest(source)
  });

  assert.equal(fixture.schema, CONSUMER_CONTRACT_GAP_INDEX_SCHEMA);
  assert.deepEqual(fixture, generated);
  assert.equal(
    fixture.classification,
    expectedCaseClassifications["valid-consumer-contract-gap-index"]
  );
  assert.equal(fixture.consumerContractGapIndexProduced, true);
  assert.deepEqual(fixture.targetConsumerIds, ["locus", "multiverse"]);
  assert.equal(fixture.gapIndexSummary.gapEntryCount, 11);
  assert.equal(fixture.gapIndexSummary.locusGapCount, 5);
  assert.equal(fixture.gapIndexSummary.multiverseGapCount, 6);
});

test("Phase 5.47 classifies gap index cases without authorization", () => {
  const validSource = validSourceState();
  const cases = [
    [
      "missing-consumer-contract-gap-index-input-rejected",
      createConsumerContractGapIndexForReview({
        reviewedAt,
        sourceConsumerContractReadinessMatrixDigest: stableDigest(validSource)
      })
    ],
    [
      "malformed-consumer-contract-gap-index-input-rejected",
      createConsumerContractGapIndexForReview(null)
    ],
    [
      "malformed-consumer-contract-gap-index-invalid-reviewed-at-rejected",
      createConsumerContractGapIndexForReview({
        reviewedAt: "2026-06-19",
        consumerContractReadinessMatrixEntries: [validSource],
        sourceConsumerContractReadinessMatrixDigest: stableDigest(validSource)
      })
    ],
    ["empty-consumer-contract-gap-index-input-rejected", createResult([])],
    [
      "duplicate-invalid-consumer-contract-gap-index-input-rejected",
      createResult([validSource, validSource])
    ],
    [
      "mismatched-source-digest-consumer-contract-gap-index-input-rejected",
      createResult([validSource], {
        sourceConsumerContractReadinessMatrixDigest:
          "sha256:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
      })
    ],
    [
      "reviewer-routing-looking-consumer-contract-gap-index-input-rejected",
      createResult([sourceWith({ reviewerRoutingPerformed: true })])
    ],
    [
      "reviewer-assignment-looking-consumer-contract-gap-index-input-rejected",
      createResult([sourceWith({ reviewerAssignmentPerformed: true })])
    ],
    [
      "evaluator-execution-looking-consumer-contract-gap-index-input-rejected",
      createResult([sourceWith({ evaluatorExecutionPerformed: true })])
    ],
    [
      "evaluator-result-looking-consumer-contract-gap-index-input-rejected",
      createResult([sourceWith({ evaluatorResultProduced: true })])
    ],
    [
      "approval-decision-looking-consumer-contract-gap-index-input-rejected",
      createResult([sourceWith({ approvalDecisionProduced: true })])
    ],
    [
      "grant-looking-consumer-contract-gap-index-input-rejected",
      createResult([sourceWith({ connectorGrantProduced: true })])
    ],
    [
      "runtime-permission-looking-consumer-contract-gap-index-input-rejected",
      createResult([sourceWith({ runtimePermissionGranted: true })])
    ],
    [
      "command-exposure-looking-consumer-contract-gap-index-input-rejected",
      createResult([sourceWith({ commandRuntimeControlEnabled: true })])
    ],
    [
      "runtime-effect-true-consumer-contract-gap-index-input-rejected",
      createResult([sourceWithRuntimeEffect({ runtimeExecutionEnabled: true })])
    ],
    [
      "process-flag-true-consumer-contract-gap-index-input-rejected",
      createResult([sourceWith({ processControlEnabled: true })])
    ],
    [
      "runtime-execution-signal-looking-consumer-contract-gap-index-input-rejected",
      createResult([sourceWith({ mcpToolExposureEnabled: true })])
    ],
    ["valid-consumer-contract-gap-index", createResult([validSource])]
  ];

  for (const [caseName, result] of cases) {
    assert.equal(result.classification, expectedCaseClassifications[caseName], caseName);
    assert.equal(result.reviewOnly, true);
    assert.equal(result.authoritative, false);
    assertNonAuthorizing(result);
  }
});

test("Phase 5.47 gap index covers required Locus and Multiverse buckets", async () => {
  const fixture = await readFixture();
  const sourceRows = new Map(
    validSourceState().matrixRows.map((row) => [row.rowId, row])
  );

  assert.deepEqual(
    fixture.gapEntries.map((entry) => entry.gapId),
    expectedGapIds
  );
  assert.deepEqual(
    fixture.gapGroups.map((group) => [
      group.consumerId,
      group.futureAuthorizationCandidateBuckets
    ]),
    [
      [
        "locus",
        [
          "status/control-surface display contract",
          "process/tool capability metadata contract",
          "Locus-visible review artifact contract",
          "future Secure Drop compose/inbox consumer contract",
          "command/control runtime authorization boundary"
        ]
      ],
      [
        "multiverse",
        [
          "world/project orchestration metadata contract",
          "visible AI capability metadata contract",
          "task/capability wrapper metadata contract",
          "review-only citizen/adapter candidate contract",
          "Fabric coordination metadata contract",
          "registry/websocket/MCP/task runtime authorization boundary"
        ]
      ]
    ]
  );

  for (const entry of fixture.gapEntries) {
    const sourceRow = sourceRows.get(entry.sourceReadinessMatrixRowId);

    assert.ok(sourceRow, entry.sourceReadinessMatrixRowId);
    assert.equal(entry.sourceReadinessMatrixTouchpoint, sourceRow.touchpointName);
    assert.deepEqual(
      entry.requiredPrerequisiteContracts,
      sourceRow.requiredFutureContracts
    );
    assert.equal(entry.allowedCurrentBehavior, sourceRow.currentAllowedBehavior);
    assert.deepEqual(
      entry.forbiddenCurrentBehavior,
      sourceRow.explicitlyForbiddenBehavior
    );
    assert.ok(entry.blockerNotes.length >= 2);
    assertAuthorizationStatusFlags(entry.authorizationStatusFlags);
    assert.equal(entry.planningMetadataEvidence.planningMetadataOnly, true);
    assert.equal(entry.planningMetadataEvidence.reviewOnly, true);
    assert.equal(entry.planningMetadataEvidence.authoritative, false);
    assert.equal(entry.planningMetadataEvidence.sourcePhase, "5.46");
    assert.equal(entry.planningMetadataEvidence.runtimeEffectAllFalse, true);
    assert.equal(entry.planningMetadataEvidence.noSecureDropRuntime, true);
  }

  assert.ok(
    fixture.gapEntries
      .find((entry) =>
        entry.gapId.includes("future-secure-drop-compose-inbox")
      )
      .requiredPrerequisiteContracts.includes(
        "content-fabric.secure-drop.compose-consumer-contract"
      )
  );
  assert.ok(
    fixture.gapEntries
      .find((entry) => entry.gapId.includes("fabric-coordination"))
      .forbiddenCurrentBehavior.includes("Fabric runtime surface")
  );
  assert.ok(
    fixture.gapEntries
      .find((entry) => entry.gapId.includes("registry-websocket-mcp-task"))
      .forbiddenCurrentBehavior.includes("MCP tool exposure")
  );
});

test("Phase 5.47 result remains non-authorizing and runtime blocked", async () => {
  const fixture = await readFixture();

  assert.equal(fixture.reviewOnly, true);
  assert.equal(fixture.authoritative, false);
  assert.equal(fixture.consumerContractGapIndexOnly, true);
  assert.equal(fixture.sourceConsumerContractReadinessMatrixAccepted, true);
  assertNonAuthorizing(fixture);
  assertNonAuthorizing(fixture.consumerContractGapIndex);
  assert.equal(
    fixture.sourceConsumerContractReadinessMatrixSummary.schema,
    "ardyn.phase-5.46.consumer-contract-readiness-matrix-state"
  );
  assert.deepEqual(fixture.sourceConsumerContractReadinessMatrixSummary.targetConsumerIds, [
    "locus",
    "multiverse"
  ]);
  assert.deepEqual(fixture.rejectionReasons, [
    "consumer_contract_gap_index_is_review_only",
    "locus_and_multiverse_gaps_grouped_for_future_authorization_planning",
    "runtime_command_connector_fabric_websocket_mcp_task_secure_drop_authorizations_false",
    "secure_drop_is_future_content_fabric_capability_reference_only",
    "fallow_runtime_not_used",
    "runtime_enablement_still_blocked"
  ]);
});

test("serve-runtime remains default-blocked and dry-run cannot bypass Phase 5.47", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-47-runtime-"));

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

test("Phase 5.47 gap index command names remain rejected", async () => {
  for (const command of commandProbes) {
    const failure = await expectCliFailure([command]);

    assert.notEqual(failure.code, 0);
    assert.equal(failure.stdout, "");
    assert.match(failure.stderr, /unknown command|Usage: ardyn/i);
  }
});

test("Phase 5.47 does not change CLI, Rust, or Fabric runtime source", async () => {
  await execFileAsync(
    "git",
    [
      "diff",
      "--exit-code",
      phase547BaselineCommit,
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

  assert.doesNotMatch(currentCliSource, /consumer-contract-gap-index/);
  assert.doesNotMatch(currentCliSource, /phase-5-47/);
});
