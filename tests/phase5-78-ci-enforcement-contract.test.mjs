import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";
import {
  CI_ENFORCEMENT_CONTRACT_BOUNDARY_MAP_SCHEMA,
  createCiEnforcementContractForReview
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
  "../tests/fixtures/host-policy/phase5-78/ci-enforcement-contract.json",
  import.meta.url
);

const expectedCaseClassifications = Object.freeze({
  "valid-ci-enforcement-contract-boundary-map":
    "valid_ci_enforcement_contract_boundary_map_runtime_still_blocked",
  "malformed-ci-enforcement-contract-boundary-map-input-rejected":
    "malformed_ci_enforcement_contract_boundary_map_input_rejected",
  "unknown-top-level-field-ci-enforcement-contract-boundary-map-input-rejected":
    "unknown_top_level_field_ci_enforcement_contract_boundary_map_input_rejected",
  "authorization-flags-enabled-ci-enforcement-contract-boundary-map-input-rejected":
    "authorization_flags_enabled_ci_enforcement_contract_boundary_map_input_rejected",
  "report-runs-checks-true-ci-enforcement-contract-boundary-map-input-rejected":
    "report_runs_checks_true_ci_enforcement_contract_boundary_map_input_rejected",
  "hidden-ci-runtime-semantics-ci-enforcement-contract-boundary-map-input-rejected":
    "hidden_ci_runtime_semantics_ci_enforcement_contract_boundary_map_input_rejected",
  "blocked-cli-bypass-attempt-ci-enforcement-contract-boundary-map-input-rejected":
    "blocked_cli_bypass_attempt_ci_enforcement_contract_boundary_map_input_rejected",
  "ci-with-secrets-ci-enforcement-contract-boundary-map-input-rejected":
    "ci_with_secrets_ci_enforcement_contract_boundary_map_input_rejected",
  "ci-with-write-permissions-ci-enforcement-contract-boundary-map-input-rejected":
    "ci_with_write_permissions_ci_enforcement_contract_boundary_map_input_rejected",
  "extra-workflow-ci-enforcement-contract-boundary-map-input-rejected":
    "extra_workflow_ci_enforcement_contract_boundary_map_input_rejected",
  "semgrep-as-gate-ci-enforcement-contract-boundary-map-input-rejected":
    "semgrep_as_gate_ci_enforcement_contract_boundary_map_input_rejected",
  "fabric-secret-in-ci-ci-enforcement-contract-boundary-map-input-rejected":
    "fabric_secret_in_ci_ci_enforcement_contract_boundary_map_input_rejected",
  "fabric-sidecar-contact-ci-enforcement-contract-boundary-map-input-rejected":
    "fabric_sidecar_contact_ci_enforcement_contract_boundary_map_input_rejected",
  "unsafe-ci-enforcement-runtime-flags-ci-enforcement-contract-boundary-map-input-rejected":
    "unsafe_ci_enforcement_runtime_flags_ci_enforcement_contract_boundary_map_input_rejected",
  "nested-unsafe-flags-ci-enforcement-contract-boundary-map-input-rejected":
    "nested_unsafe_flags_ci_enforcement_contract_boundary_map_input_rejected",
  "noncanonical-ci-enforcement-contract-boundary-map-input-rejected":
    "noncanonical_ci_enforcement_contract_boundary_map_input_rejected"
});

const expectedBoundaryFamilies = Object.freeze([
  "ci_workflow_scope",
  "ci_job_matrix",
  "security_workflow_scope",
  "test_invocation_portability",
  "ci_offline_hermetic_guarantee",
  "ci_forbidden_behavior",
  "branch_protection_expectation",
  "ci_enablement_authorization"
]);

const commandProbes = Object.freeze([
  "ci-enforcement-contract-boundary-map",
  "ci-runtime",
  "ci-execution",
  "workflow-execution",
  "ci-publish",
  "ci-deploy",
  "serve-runtime"
]);

const unsafeFlagCases = Object.freeze([
  "runtimeExecutionEnabled",
  "ciRuntimeEnabled",
  "ciExecutionEnabled",
  "workflowExecutionEnabled",
  "ciPublishedArtifacts",
  "ciDeployEnabled",
  "ciWriteToRepoEnabled",
  "ciSecretUsed",
  "ciTokenMinted",
  "ciAutoMergeEnabled",
  "semgrepGateEnabled",
  "fabricSecretInCiEnabled",
  "fabricSidecarContactEnabled",
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
  // for accepted results they live inside boundaryEntries[].unsafeCiEnforcementRuntimeFlags
  if (!result.ciEnforcementContractBoundaryMapProduced) {
    const valid = createCiEnforcementContractForReview({ reviewedAt });
    const runtimeFlagNames = Object.keys(
      valid.boundaryEntries[0].unsafeCiEnforcementRuntimeFlags
    );
    for (const key of runtimeFlagNames) {
      assert.equal(result[key], false, `${key} should stay false`);
    }
  }
  assertAllFalse(result.runtimeEffect);
}

function withBoundaryEntries(mutator) {
  const valid = createCiEnforcementContractForReview({ reviewedAt });
  const boundaryEntries = structuredClone(valid.boundaryEntries);
  mutator(boundaryEntries);
  return { reviewedAt, boundaryEntries };
}

test("Phase 5.78 CI enforcement contract fixture is deterministic", async () => {
  const fixture = await readFixture();
  const generated = createCiEnforcementContractForReview({ reviewedAt });

  assert.deepEqual(fixture, generated);
  assert.equal(fixture.schema, CI_ENFORCEMENT_CONTRACT_BOUNDARY_MAP_SCHEMA);
  assert.equal(
    fixture.classification,
    expectedCaseClassifications["valid-ci-enforcement-contract-boundary-map"]
  );
  assert.equal(fixture.ciEnforcementContractBoundaryMapProduced, true);
  assert.equal(fixture.reviewedAt, reviewedAt);
  assertNonAuthorizing(fixture);
});

test("Phase 5.78 covers 8 CI enforcement boundary families", async () => {
  const fixture = await readFixture();
  const summary = fixture.boundaryMapSummary;

  assert.equal(summary.boundaryEntryCount, expectedBoundaryFamilies.length);
  assert.deepEqual(summary.boundaryFamilies, expectedBoundaryFamilies);
  assert.deepEqual(Object.keys(summary.countByFamily), expectedBoundaryFamilies);

  for (const family of expectedBoundaryFamilies) {
    assert.equal(summary.countByFamily[family], 1, `${family} recorded once`);
  }

  // CI-specific invariants
  assert.equal(summary.ciWorkflowScopeRecorded, true);
  assert.equal(summary.ciJobMatrixRecorded, true);
  assert.equal(summary.securityWorkflowScopeRecorded, true);
  assert.equal(summary.testInvocationPortabilityRecorded, true);
  assert.equal(summary.ciOfflineHermeticGuaranteeRecorded, true);
  assert.equal(summary.ciForbiddenBehaviorRecorded, true);
  assert.equal(summary.branchProtectionExpectationRecorded, true);
  assert.equal(summary.ciEnablementAuthorizationRecorded, true);
  assert.equal(summary.noGithubFilesCreated, true);
  assert.equal(summary.noSecretsInCi, true);
  assert.equal(summary.noWritePermissions, true);
  assert.equal(summary.noPublishDeploy, true);
  assert.equal(summary.noAutoMerge, true);
  assert.equal(summary.semgrepStaysManual, true);
  assert.equal(summary.fabricEnvProhibited, true);
  assert.equal(summary.noLiveSidecarContact, true);
  assert.equal(summary.ciEnablementByPhase579Only, true);
  assert.equal(summary.julesReviewRequired, true);

  for (const entry of fixture.boundaryEntries) {
    assert.match(entry.boundaryId, /^phase5-78\./);
    assert.ok(expectedBoundaryFamilies.includes(entry.boundaryFamily));
    assert.ok(Array.isArray(entry.allowedCurrentBehavior));
    assert.ok(Array.isArray(entry.forbiddenCurrentBehavior));
    assert.ok(Array.isArray(entry.requiredFutureContractBeforeImplementation));
    assert.ok(typeof entry.requiredFutureAuthorizationPhaseBeforeRuntime === "string");
    assert.ok(typeof entry.contractShape === "object");
    assert.equal(entry.ciEnforcementContractBoundaryMetadataOnly, true);
    assert.equal(entry.noLiveCiEnforcementRuntimePerformed, true);
    assert.equal(entry.nonAuthorizingProof, true);
    assertAllFalse(entry.explicitBlockedAuthorizationFlags);
    assertAllFalse(entry.unsafeCiEnforcementRuntimeFlags);
    assertAllFalse(entry.runtimeEffect);
  }

  // Cross-phase reference content checks
  const allText = JSON.stringify(fixture);
  assert.match(allText, /5\.48/);
  assert.match(allText, /5\.69/);
  assert.match(allText, /5\.71/);
  assert.match(allText, /5\.76B/);
  assert.match(allText, /5\.77/);
  assert.match(allText, /docs\/posture\.md/);
  assert.match(allText, /phase-5\.79/);
  assert.match(allText, /Jules/);
});

test("Phase 5.78 recommendedNextPhase is phase-5.79", async () => {
  const fixture = await readFixture();
  assert.equal(fixture.recommendedNextPhase, "phase-5.79-ci-enablement");
});

test("Phase 5.78 invalid CI enforcement cases fail closed", () => {
  const cases = [
    {
      name: "malformed-ci-enforcement-contract-boundary-map-input-rejected",
      input: null
    },
    {
      name: "malformed-ci-enforcement-contract-boundary-map-input-rejected",
      input: { reviewedAt: "not-a-date" }
    },
    {
      name: "unknown-top-level-field-ci-enforcement-contract-boundary-map-input-rejected",
      input: { reviewedAt, ciRuntimeCommentary: false }
    },
    {
      name: "authorization-flags-enabled-ci-enforcement-contract-boundary-map-input-rejected",
      input: withBoundaryEntries((entries) => {
        entries[0].explicitBlockedAuthorizationFlags.ciExecutionAuthorizationGranted = true;
      })
    },
    {
      name: "report-runs-checks-true-ci-enforcement-contract-boundary-map-input-rejected",
      input: { reviewedAt, reportRunsChecks: true }
    },
    {
      name: "hidden-ci-runtime-semantics-ci-enforcement-contract-boundary-map-input-rejected",
      input: { reviewedAt, ciRuntime: {} }
    },
    {
      name: "blocked-cli-bypass-attempt-ci-enforcement-contract-boundary-map-input-rejected",
      input: { reviewedAt, blockedCliBypassEnabled: true }
    },
    {
      name: "ci-with-secrets-ci-enforcement-contract-boundary-map-input-rejected",
      input: { reviewedAt, ciSecrets: {} }
    },
    {
      name: "ci-with-write-permissions-ci-enforcement-contract-boundary-map-input-rejected",
      input: { reviewedAt, ciWritePermissions: true }
    },
    {
      name: "extra-workflow-ci-enforcement-contract-boundary-map-input-rejected",
      input: { reviewedAt, extraWorkflow: {} }
    },
    {
      name: "semgrep-as-gate-ci-enforcement-contract-boundary-map-input-rejected",
      input: { reviewedAt, semgrepAsGate: true }
    },
    {
      name: "fabric-secret-in-ci-ci-enforcement-contract-boundary-map-input-rejected",
      input: { reviewedAt, fabricSecretInCi: true }
    },
    {
      name: "fabric-sidecar-contact-ci-enforcement-contract-boundary-map-input-rejected",
      input: { reviewedAt, fabricSidecarContact: true }
    },
    {
      name: "unsafe-ci-enforcement-runtime-flags-ci-enforcement-contract-boundary-map-input-rejected",
      input: { reviewedAt, ciRuntimeEnabled: true }
    },
    {
      name: "nested-unsafe-flags-ci-enforcement-contract-boundary-map-input-rejected",
      input: { reviewedAt, runtimeEffect: { runtimeEnabled: true } }
    },
    {
      name: "noncanonical-ci-enforcement-contract-boundary-map-input-rejected",
      input: withBoundaryEntries((entries) => {
        entries[0].boundaryId = "phase5-78.modified.noncanonical";
      })
    }
  ];

  for (const { name, input } of cases) {
    const result = createCiEnforcementContractForReview(input);
    assert.equal(result.classification, expectedCaseClassifications[name], name);
    assert.equal(result.ciEnforcementContractBoundaryMapProduced, false, name);
    assert.equal(result.boundaryEntries.length, 0, name);
    assertNonAuthorizing(result);
  }
});

test("Phase 5.78 enabled runtime flags cannot authorize CI behavior", () => {
  for (const flag of unsafeFlagCases) {
    const result = createCiEnforcementContractForReview({
      reviewedAt,
      [flag]: true
    });

    assert.equal(
      result.classification,
      expectedCaseClassifications[
        "unsafe-ci-enforcement-runtime-flags-ci-enforcement-contract-boundary-map-input-rejected"
      ],
      flag
    );
    assert.equal(result.ciEnforcementContractBoundaryMapProduced, false, flag);
    assertNonAuthorizing(result);
  }
});

test("Phase 5.78 boundary map stays non-authorizing and runtime-blocked", async () => {
  const fixture = await readFixture();

  assert.equal(fixture.reviewOnly, true);
  assert.equal(fixture.metadataOnly, true);
  assert.equal(fixture.authoritative, false);
  assert.equal(fixture.reportRunsChecks, false);
  assert.equal(fixture.nonAuthorizingProof, true);
  // ponytail: unsafe flags live inside boundaryEntries for accepted results
  for (const entry of fixture.boundaryEntries) {
    assertAllFalse(entry.unsafeCiEnforcementRuntimeFlags);
    assertAllFalse(entry.explicitBlockedAuthorizationFlags);
    assertAllFalse(entry.runtimeEffect);
  }
  assertNonAuthorizing(fixture);
});

test("serve-runtime remains default-blocked and dry-run cannot bypass Phase 5.78", async () => {
  for (const args of [["serve-runtime"], ["serve-runtime", "--dry-run"]]) {
    const error = await expectCliFailure(args);
    assert.notEqual(error.code, 0);
    assert.equal(error.stdout, "");
    assert.match(error.stderr, /Runtime unavailable/);
  }
});

test("Phase 5.78 CI command names remain rejected", async () => {
  for (const command of commandProbes) {
    const error = await expectCliFailure([command]);
    assert.notEqual(error.code, 0, command);
    assert.equal(error.stdout, "", command);
  }
});

test("Phase 5.78 does not change CLI, Rust, Fabric, package, or dependency source and creates no .github files", async () => {
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

  for (const file of files) {
    const [baseline, current] = await Promise.all([
      execFileAsync("git", ["show", `e9537ccdcad7d5828a991d4b14bccf91f378ddac:${file}`], {
        cwd: repoRoot,
        maxBuffer: 20 * 1024 * 1024
      }),
      readFile(new URL(`../${file}`, import.meta.url), "utf8")
    ]);

    assert.equal(
      current.replaceAll("\r\n", "\n"),
      baseline.stdout.replaceAll("\r\n", "\n"),
      `${file} should not change`
    );
  }

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

  // Assert no .github/workflows/ directory was created (the contract is about workflow files, not .github/ itself)
  const { existsSync } = await import("node:fs");
  assert.equal(existsSync(fileURLToPath(new URL("../.github/workflows/", import.meta.url))), false, "no .github/workflows/ directory should exist");
});