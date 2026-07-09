import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";
import { assertUnchanged } from "./helpers/source-digests.mjs";
import {
  CODE_MODE_ORCHESTRATION_BOUNDARY_MAP_SCHEMA,
  createCodeModeOrchestrationForReview
} from "../packages/core/src/index.mjs";

const execFileAsync = promisify(execFile);
const reviewedAt = "2026-07-06T00:00:00.000Z";
const repoRootUrl = new URL("../", import.meta.url);
const repoRoot = fileURLToPath(repoRootUrl);
const cliPath = fileURLToPath(
  new URL("../apps/cli/src/index.mjs", import.meta.url)
);
const packageJsonUrl = new URL("../package.json", import.meta.url);
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-77/code-mode-orchestration.json",
  import.meta.url
);

const expectedCaseClassifications = Object.freeze({
  "valid-code-mode-orchestration-contract-boundary-map":
    "valid_code_mode_orchestration_contract_boundary_map_runtime_still_blocked",
  "malformed-code-mode-orchestration-contract-boundary-map-input-rejected":
    "malformed_code_mode_orchestration_contract_boundary_map_input_rejected",
  "unknown-top-level-field-code-mode-orchestration-contract-boundary-map-input-rejected":
    "unknown_top_level_field_code_mode_orchestration_contract_boundary_map_input_rejected",
  "authorization-flags-enabled-code-mode-orchestration-contract-boundary-map-input-rejected":
    "authorization_flags_enabled_code_mode_orchestration_contract_boundary_map_input_rejected",
  "report-runs-checks-true-code-mode-orchestration-contract-boundary-map-input-rejected":
    "report_runs_checks_true_code_mode_orchestration_contract_boundary_map_input_rejected",
  "hidden-orchestrator-runtime-semantics-code-mode-orchestration-contract-boundary-map-input-rejected":
    "hidden_orchestrator_runtime_semantics_code_mode_orchestration_contract_boundary_map_input_rejected",
  "blocked-cli-bypass-attempt-code-mode-orchestration-contract-boundary-map-input-rejected":
    "blocked_cli_bypass_attempt_code_mode_orchestration_contract_boundary_map_input_rejected",
  "missing-max-iterations-per-loop-code-mode-orchestration-contract-boundary-map-input-rejected":
    "missing_max_iterations_per_loop_code_mode_orchestration_contract_boundary_map_input_rejected",
  "judge-produces-own-candidate-code-mode-orchestration-contract-boundary-map-input-rejected":
    "judge_produces_own_candidate_code_mode_orchestration_contract_boundary_map_input_rejected",
  "external-agent-default-allow-code-mode-orchestration-contract-boundary-map-input-rejected":
    "external_agent_default_allow_code_mode_orchestration_contract_boundary_map_input_rejected",
  "front-desk-with-approval-authority-code-mode-orchestration-contract-boundary-map-input-rejected":
    "front_desk_with_approval_authority_code_mode_orchestration_contract_boundary_map_input_rejected",
  "unsafe-code-mode-orchestration-runtime-flags-code-mode-orchestration-contract-boundary-map-input-rejected":
    "unsafe_code_mode_orchestration_runtime_flags_code_mode_orchestration_contract_boundary_map_input_rejected",
  "nested-unsafe-flags-code-mode-orchestration-contract-boundary-map-input-rejected":
    "nested_unsafe_flags_code_mode_orchestration_contract_boundary_map_input_rejected",
  "unknown-boundary-family-code-mode-orchestration-contract-boundary-map-input-rejected":
    "unknown_boundary_family_code_mode_orchestration_contract_boundary_map_input_rejected",
  "noncanonical-code-mode-orchestration-contract-boundary-map-input-rejected":
    "noncanonical_code_mode_orchestration_contract_boundary_map_input_rejected"
});

const expectedBoundaryFamilies = Object.freeze([
  "orchestrator_plan_contract",
  "subagent_spawn_role_contract",
  "fusion_pass_contract",
  "judge_comparison_contract",
  "synthesis_result_contract",
  "front_desk_contract",
  "toolkit_check_selection_contract",
  "loop_semantics_contract",
  "failure_abort_contract",
  "audit_transcript_contract",
  "human_approval_gate_contract",
  "code_mode_blocked_runtime_list"
]);

const commandProbes = Object.freeze([
  "code-mode-orchestration-contract-boundary-map",
  "orchestrator-runtime",
  "subagent-spawn",
  "fusion-pass",
  "judge-comparison",
  "front-desk-responder",
  "toolkit-invocation",
  "loop-runtime",
  "model-api-calls",
  "serve-runtime"
]);

const unsafeFlagCases = Object.freeze([
  "runtimeExecutionEnabled",
  "orchestratorRuntimeEnabled",
  "subagentSpawnEnabled",
  "fusionPassEnabled",
  "judgeComparisonEnabled",
  "frontDeskRuntimeEnabled",
  "toolkitInvocationEnabled",
  "loopRuntimeEnabled",
  "modelApiCallsEnabled",
  "processSpawnEnabled",
  "shellRuntimeEnabled",
  "sqliteRuntimeEnabled",
  "matrixClientRuntimeEnabled",
  "fabricCoreTransportRuntimeEnabled",
  "secureDropImplemented"
  // ponytail: blockedCliBypassEnabled tested separately as blocked-CLI-bypass case
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
  assert.equal(result.reviewOnly, true);
  assert.equal(result.metadataOnly, true);
  assert.equal(result.authoritative, false);
  assert.equal(result.nonAuthorizingProof, true);
  assert.equal(result.reportRunsChecks, false);
  // ponytail: unsafe flag keys are only spread at top level when rejected;
  // for accepted results they live inside boundaryEntries[].unsafeCodeModeOrchestrationRuntimeFlags
  if (!result.codeModeOrchestrationBoundaryMapProduced) {
    const valid = createCodeModeOrchestrationForReview({
      reviewedAt,
      maxIterationsPerLoop: 5
    });
    const runtimeFlagNames = Object.keys(
      valid.boundaryEntries[0].unsafeCodeModeOrchestrationRuntimeFlags
    );
    for (const key of runtimeFlagNames) {
      assert.equal(result[key], false, `${key} should stay false`);
    }
  }
  assertAllFalse(result.runtimeEffect);
}

function withBoundaryEntries(mutator) {
  const valid = createCodeModeOrchestrationForReview({
    reviewedAt,
    maxIterationsPerLoop: 5
  });
  const boundaryEntries = structuredClone(valid.boundaryEntries);
  mutator(boundaryEntries);
  return { reviewedAt, maxIterationsPerLoop: 5, boundaryEntries };
}

test("Phase 5.77 Code Mode orchestration fixture is deterministic", async () => {
  const fixture = await readFixture();
  const generated = createCodeModeOrchestrationForReview({
    reviewedAt,
    maxIterationsPerLoop: 5
  });

  assert.deepEqual(fixture, generated);
  assert.equal(
    fixture.schema,
    CODE_MODE_ORCHESTRATION_BOUNDARY_MAP_SCHEMA
  );
  assert.equal(
    fixture.classification,
    expectedCaseClassifications[
      "valid-code-mode-orchestration-contract-boundary-map"
    ]
  );
  assert.equal(
    fixture.codeModeOrchestrationBoundaryMapProduced,
    true
  );
  assert.equal(fixture.reviewedAt, reviewedAt);
  assertNonAuthorizing(fixture);
});

test("Phase 5.77 covers 12 Code Mode orchestration boundary families", async () => {
  const fixture = await readFixture();
  const summary = fixture.boundaryMapSummary;

  assert.equal(summary.boundaryEntryCount, expectedBoundaryFamilies.length);
  assert.deepEqual(summary.boundaryFamilies, expectedBoundaryFamilies);
  assert.deepEqual(Object.keys(summary.countByFamily), expectedBoundaryFamilies);

  for (const family of expectedBoundaryFamilies) {
    assert.equal(summary.countByFamily[family], 1, `${family} recorded once`);
  }

  // Contract-shape assertions (deeper than 5.68 capability flags)
  assert.equal(summary.orchestratorPlanContractRecorded, true);
  assert.equal(summary.subagentSpawnRoleContractRecorded, true);
  assert.equal(summary.fusionPassContractRecorded, true);
  assert.equal(summary.judgeComparisonContractRecorded, true);
  assert.equal(summary.synthesisResultContractRecorded, true);
  assert.equal(summary.frontDeskContractRecorded, true);
  assert.equal(summary.toolkitCheckSelectionContractRecorded, true);
  assert.equal(summary.loopSemanticsContractRecorded, true);
  assert.equal(summary.failureAbortContractRecorded, true);
  assert.equal(summary.auditTranscriptContractRecorded, true);
  assert.equal(summary.humanApprovalGateContractRecorded, true);
  assert.equal(summary.codeModeBlockedRuntimeListRecorded, true);

  // Blocked runtime invariants
  assert.equal(summary.noModelApiCalls, true);
  assert.equal(summary.noSubagentProcesses, true);
  assert.equal(summary.noFrontDeskResponder, true);
  assert.equal(summary.noJudgeFusionExecution, true);
  assert.equal(summary.noLoopRuntime, true);
  assert.equal(summary.noToolkitInvocation, true);
  assert.equal(summary.maxIterationsPerLoopRequired, true);
  assert.equal(summary.judgeContextIsolatedFromProducers, true);
  assert.equal(summary.externalAgentDefaultDeny, true);
  assert.equal(summary.frontDeskZeroApprovalAuthority, true);

  // Fabric federation carve-out is referenced, not re-blocked
  assert.equal(summary.fabricFederationCarveOutReferenced, true);
  assert.equal(summary.noBlanketFabricTransportClaim, true);

  for (const entry of fixture.boundaryEntries) {
    assert.match(entry.boundaryId, /^phase5-77\./);
    assert.ok(expectedBoundaryFamilies.includes(entry.boundaryFamily));
    assert.ok(Array.isArray(entry.allowedCurrentBehavior));
    assert.ok(Array.isArray(entry.forbiddenCurrentBehavior));
    assert.ok(Array.isArray(entry.requiredFutureContractBeforeImplementation));
    assert.ok(typeof entry.requiredFutureAuthorizationPhaseBeforeRuntime === "string");
    assert.ok(typeof entry.contractShape === "object");
    assert.ok(Array.isArray(entry.crossPhaseReferences));
    assert.equal(entry.codeModeOrchestrationBoundaryMetadataOnly, true);
    assert.equal(entry.noLiveCodeModeOrchestrationRuntimePerformed, true);
    assert.equal(entry.nonAuthorizingProof, true);
    assertAllFalse(entry.explicitBlockedAuthorizationFlags);
    assertAllFalse(entry.unsafeCodeModeOrchestrationRuntimeFlags);
    assertAllFalse(entry.runtimeEffect);
  }

  // Cross-phase reference content checks
  const allText = JSON.stringify(fixture);
  assert.match(allText, /5\.68/);
  assert.match(allText, /5\.70/);
  assert.match(allText, /5\.71/);
  assert.match(allText, /5\.60/);
  assert.match(allText, /5\.64/);
  assert.match(allText, /5\.65/);
  assert.match(allText, /4\.1C/);
  assert.match(allText, /4\.1D/);
  assert.match(allText, /4\.1E/);
  assert.match(allText, /5\.18-5\.31/);
  assert.match(allText, /createTaskPlan/);
  assert.match(allText, /task\.schema\.json/);
  assert.match(allText, /docs\/posture\.md/);
  assert.match(allText, /harness-identity/);
});

test("Phase 5.77 recommendedNextPhase is phase-5.78", async () => {
  const fixture = await readFixture();
  assert.equal(
    fixture.recommendedNextPhase,
    "phase-5.78-review-only-ci-enforcement-contract-boundary-map"
  );
});

test("Phase 5.77 invalid Code Mode orchestration cases fail closed", () => {
  const cases = [
    {
      name: "malformed-code-mode-orchestration-contract-boundary-map-input-rejected",
      input: null
    },
    {
      name: "malformed-code-mode-orchestration-contract-boundary-map-input-rejected",
      input: { reviewedAt: "not-a-date", maxIterationsPerLoop: 5 }
    },
    {
      name: "unknown-top-level-field-code-mode-orchestration-contract-boundary-map-input-rejected",
      input: { reviewedAt, maxIterationsPerLoop: 5, codeModeRuntimeCommentary: false }
    },
    {
      name: "authorization-flags-enabled-code-mode-orchestration-contract-boundary-map-input-rejected",
      input: withBoundaryEntries((entries) => {
        entries[0].explicitBlockedAuthorizationFlags.orchestratorRuntimeAuthorizationGranted = true;
      })
    },
    {
      name: "report-runs-checks-true-code-mode-orchestration-contract-boundary-map-input-rejected",
      input: { reviewedAt, maxIterationsPerLoop: 5, reportRunsChecks: true }
    },
    {
      name: "hidden-orchestrator-runtime-semantics-code-mode-orchestration-contract-boundary-map-input-rejected",
      input: { reviewedAt, maxIterationsPerLoop: 5, orchestratorRuntime: {} }
    },
    {
      name: "blocked-cli-bypass-attempt-code-mode-orchestration-contract-boundary-map-input-rejected",
      input: { reviewedAt, maxIterationsPerLoop: 5, blockedCliBypassEnabled: true }
    },
    {
      name: "missing-max-iterations-per-loop-code-mode-orchestration-contract-boundary-map-input-rejected",
      input: { reviewedAt }
    },
    {
      name: "missing-max-iterations-per-loop-code-mode-orchestration-contract-boundary-map-input-rejected",
      input: { reviewedAt, maxIterationsPerLoop: null }
    },
    {
      name: "judge-produces-own-candidate-code-mode-orchestration-contract-boundary-map-input-rejected",
      input: withBoundaryEntries((entries) => {
        const judgeEntry = entries.find((e) => e.boundaryFamily === "judge_comparison_contract");
        judgeEntry.judgeComparisonRuntime = { judgeProducedCandidate: true };
      })
    },
    {
      name: "external-agent-default-allow-code-mode-orchestration-contract-boundary-map-input-rejected",
      input: withBoundaryEntries((entries) => {
        const spawnEntry = entries.find((e) => e.boundaryFamily === "subagent_spawn_role_contract");
        spawnEntry.subagentSpawnRuntime = { externalAgentDefaultAllow: true };
      })
    },
    {
      name: "front-desk-with-approval-authority-code-mode-orchestration-contract-boundary-map-input-rejected",
      input: withBoundaryEntries((entries) => {
        const fdEntry = entries.find((e) => e.boundaryFamily === "front_desk_contract");
        fdEntry.frontDeskRuntime = { approvalAuthority: true };
      })
    },
    {
      name: "unsafe-code-mode-orchestration-runtime-flags-code-mode-orchestration-contract-boundary-map-input-rejected",
      input: { reviewedAt, maxIterationsPerLoop: 5, orchestratorRuntimeEnabled: true }
    },
    {
      name: "nested-unsafe-flags-code-mode-orchestration-contract-boundary-map-input-rejected",
      input: { reviewedAt, maxIterationsPerLoop: 5, runtimeEffect: { runtimeEnabled: true } }
    },
    {
      name: "unknown-boundary-family-code-mode-orchestration-contract-boundary-map-input-rejected",
      input: withBoundaryEntries((entries) => {
        entries[0].boundaryFamily = "unknown_family";
      })
    },
    {
      name: "noncanonical-code-mode-orchestration-contract-boundary-map-input-rejected",
      input: withBoundaryEntries((entries) => {
        entries[0].boundaryId = "phase5-77.modified.noncanonical";
      })
    }
  ];

  for (const { name, input } of cases) {
    const result = createCodeModeOrchestrationForReview(input);
    assert.equal(result.classification, expectedCaseClassifications[name], name);
    assert.equal(
      result.codeModeOrchestrationBoundaryMapProduced,
      false,
      name
    );
    assert.equal(result.boundaryEntries.length, 0, name);
    assertNonAuthorizing(result);
  }
});

test("Phase 5.77 enabled runtime flags cannot authorize Code Mode behavior", () => {
  for (const flag of unsafeFlagCases) {
    const result = createCodeModeOrchestrationForReview({
      reviewedAt,
      maxIterationsPerLoop: 5,
      [flag]: true
    });

    assert.equal(
      result.classification,
      expectedCaseClassifications[
        "unsafe-code-mode-orchestration-runtime-flags-code-mode-orchestration-contract-boundary-map-input-rejected"
      ],
      flag
    );
    assert.equal(
      result.codeModeOrchestrationBoundaryMapProduced,
      false,
      flag
    );
    assertNonAuthorizing(result);
  }
});

test("Phase 5.77 boundary map stays non-authorizing and runtime-blocked", async () => {
  const fixture = await readFixture();

  assert.equal(fixture.reviewOnly, true);
  assert.equal(fixture.metadataOnly, true);
  assert.equal(fixture.authoritative, false);
  assert.equal(fixture.reportRunsChecks, false);
  assert.equal(fixture.nonAuthorizingProof, true);
  // ponytail: unsafe flags live inside boundaryEntries for accepted results
  for (const entry of fixture.boundaryEntries) {
    assertAllFalse(entry.unsafeCodeModeOrchestrationRuntimeFlags);
    assertAllFalse(entry.explicitBlockedAuthorizationFlags);
    assertAllFalse(entry.runtimeEffect);
  }
  assert.equal(fixture.commandExposureEnabled, undefined);
  assert.equal(fixture.blockedCliBypassEnabled, undefined);
  assertNonAuthorizing(fixture);
});

test("serve-runtime remains default-blocked and dry-run cannot bypass Phase 5.77", async () => {
  for (const args of [["serve-runtime"], ["serve-runtime", "--dry-run"]]) {
    const error = await expectCliFailure(args);
    assert.notEqual(error.code, 0);
    assert.equal(error.stdout, "");
    assert.match(error.stderr, /Runtime unavailable/);
  }
});

test("Phase 5.77 Code Mode command names remain rejected", async () => {
  for (const command of commandProbes) {
    const error = await expectCliFailure([command]);
    assert.notEqual(error.code, 0, command);
    assert.equal(error.stdout, "", command);
  }
});

test("Phase 5.77 does not change CLI, Rust, Fabric, package, or dependency source", async () => {
  const files = [
    "apps/cli/src/index.mjs",
    "crates/ardyn-host/src/lib.rs",
    "crates/ardyn-host/src/stdio_runtime/mod.rs",
    "packages/fabric/src/index.mjs",
    "packages/fabric/src/federation.mjs",
    "package.json",
    "package-lock.json",
    "Cargo.toml",
    "Cargo.lock"
  ];

  await assertUnchanged(files);

  const packageJson = JSON.parse(await readFile(packageJsonUrl, "utf8"));
  const dependencies = {
    ...(packageJson.dependencies ?? {}),
    ...(packageJson.devDependencies ?? {}),
    ...(packageJson.optionalDependencies ?? {})
  };
  for (const dependency of [
    "@multiverse/fabric-core",
    "openai",
    "anthropic",
    "@anthropic-ai/sdk"
  ]) {
    assert.equal(Object.hasOwn(dependencies, dependency), false, dependency);
  }

  // ponytail: federation.mjs is NOT imported by CLI or host (asserted invariant)
  const cliSource = await readFile(cliPath, "utf8");
  assert.doesNotMatch(cliSource, /federation/);
  for (const command of commandProbes) {
    assert.doesNotMatch(cliSource, new RegExp(command));
  }
});