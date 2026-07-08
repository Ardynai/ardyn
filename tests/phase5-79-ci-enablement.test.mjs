import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { existsSync, readdirSync } from "node:fs";
import test from "node:test";
import {
  CI_ENABLEMENT_BOUNDARY_MAP_SCHEMA,
  createCiEnablementForReview
} from "../packages/core/src/index.mjs";

const reviewedAt = "2026-07-07T00:00:00.000Z";
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-79/ci-enablement.json",
  import.meta.url
);
const workflowsDir = fileURLToPath(
  new URL("../.github/workflows/", import.meta.url)
);

const expectedCaseClassifications = Object.freeze({
  "valid-ci-enablement-boundary-map":
    "valid_ci_enablement_boundary_map_workflows_present_ci_runtime_still_blocked",
  "malformed-ci-enablement-boundary-map-input-rejected":
    "malformed_ci_enablement_boundary_map_input_rejected",
  "unknown-top-level-field-ci-enablement-boundary-map-input-rejected":
    "unknown_top_level_field_ci_enablement_boundary_map_input_rejected",
  "authorization-flags-enabled-ci-enablement-boundary-map-input-rejected":
    "authorization_flags_enabled_ci_enablement_boundary_map_input_rejected",
  "report-runs-checks-true-ci-enablement-boundary-map-input-rejected":
    "report_runs_checks_true_ci_enablement_boundary_map_input_rejected",
  "blocked-cli-bypass-attempt-ci-enablement-boundary-map-input-rejected":
    "blocked_cli_bypass_attempt_ci_enablement_boundary_map_input_rejected",
  "ci-with-secrets-ci-enablement-boundary-map-input-rejected":
    "ci_with_secrets_ci_enablement_boundary_map_input_rejected",
  "ci-with-write-permissions-ci-enablement-boundary-map-input-rejected":
    "ci_with_write_permissions_ci_enablement_boundary_map_input_rejected",
  "extra-workflow-ci-enablement-boundary-map-input-rejected":
    "extra_workflow_ci_enablement_boundary_map_input_rejected",
  "semgrep-as-gate-ci-enablement-boundary-map-input-rejected":
    "semgrep_as_gate_ci_enablement_boundary_map_input_rejected",
  "fabric-secret-in-ci-ci-enablement-boundary-map-input-rejected":
    "fabric_secret_in_ci_ci_enablement_boundary_map_input_rejected",
  "fabric-sidecar-contact-ci-enablement-boundary-map-input-rejected":
    "fabric_sidecar_contact_ci_enablement_boundary_map_input_rejected",
  "unsafe-ci-enablement-runtime-flags-ci-enablement-boundary-map-input-rejected":
    "unsafe_ci_enablement_runtime_flags_ci_enablement_boundary_map_input_rejected",
  "nested-unsafe-flags-ci-enablement-boundary-map-input-rejected":
    "nested_unsafe_flags_ci_enablement_boundary_map_input_rejected",
  "noncanonical-ci-enablement-boundary-map-input-rejected":
    "noncanonical_ci_enablement_boundary_map_input_rejected"
});

const expectedBoundaryFamilies = Object.freeze([
  "ci_workflow_files_created",
  "ci_job_matrix_enabled",
  "security_workflow_enabled",
  "test_invocation_portability_fixed",
  "ci_offline_hermetic_verified",
  "ci_forbidden_behavior_absent",
  "branch_protection_pending",
  "ci_enablement_authorized"
]);

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
  if (!result.ciEnablementBoundaryMapProduced) {
    const valid = createCiEnablementForReview({ reviewedAt });
    const runtimeFlagNames = Object.keys(
      valid.boundaryEntries[0].unsafeCiEnablementRuntimeFlags
    );
    for (const key of runtimeFlagNames) {
      assert.equal(result[key], false, `${key} should stay false`);
    }
  }
  assertAllFalse(result.runtimeEffect);
}

function withBoundaryEntries(mutator) {
  const valid = createCiEnablementForReview({ reviewedAt });
  const boundaryEntries = structuredClone(valid.boundaryEntries);
  mutator(boundaryEntries);
  return { reviewedAt, boundaryEntries };
}

async function readFixture() {
  return JSON.parse(await readFile(fixtureUrl, "utf8"));
}

test("Phase 5.79 CI enablement fixture is deterministic", async () => {
  const fixture = await readFixture();
  const generated = createCiEnablementForReview({ reviewedAt });
  assert.deepEqual(fixture, generated);
  assert.equal(fixture.schema, CI_ENABLEMENT_BOUNDARY_MAP_SCHEMA);
  assert.equal(
    fixture.classification,
    expectedCaseClassifications["valid-ci-enablement-boundary-map"]
  );
  assert.equal(fixture.ciEnablementBoundaryMapProduced, true);
  assert.equal(fixture.reviewedAt, reviewedAt);
  assertNonAuthorizing(fixture);
});

test("Phase 5.79 covers 8 CI enablement boundary families", async () => {
  const fixture = await readFixture();
  const summary = fixture.boundaryMapSummary;
  assert.equal(summary.boundaryEntryCount, expectedBoundaryFamilies.length);
  assert.deepEqual(summary.boundaryFamilies, expectedBoundaryFamilies);
  for (const family of expectedBoundaryFamilies) {
    assert.equal(summary.countByFamily[family], 1, `${family} recorded once`);
  }
  assert.equal(summary.ciWorkflowFilesCreated, true);
  assert.equal(summary.ciJobMatrixEnabled, true);
  assert.equal(summary.securityWorkflowEnabled, true);
  assert.equal(summary.testInvocationPortabilityFixed, true);
  assert.equal(summary.ciOfflineHermeticVerified, true);
  assert.equal(summary.ciForbiddenBehaviorAbsent, true);
  assert.equal(summary.branchProtectionPending, true);
  assert.equal(summary.ciEnablementAuthorized, true);
  assert.equal(summary.noSecretsInCi, true);
  assert.equal(summary.noWritePermissions, true);
  assert.equal(summary.noPublishDeploy, true);
  assert.equal(summary.noAutoMerge, true);
  assert.equal(summary.semgrepStaysManual, true);
  assert.equal(summary.fabricEnvProhibited, true);
  assert.equal(summary.noLiveSidecarContact, true);
  assert.equal(summary.authorizedByJosh, true);
  assert.equal(summary.julesReviewRequired, true);
  for (const entry of fixture.boundaryEntries) {
    assert.match(entry.boundaryId, /^phase5-79\./);
    assert.ok(expectedBoundaryFamilies.includes(entry.boundaryFamily));
    assert.ok(Array.isArray(entry.allowedCurrentBehavior));
    assert.ok(Array.isArray(entry.forbiddenCurrentBehavior));
    assert.equal(entry.ciEnablementBoundaryMetadataOnly, true);
    assert.equal(entry.noLiveCiEnablementRuntimePerformed, true);
    assert.equal(entry.nonAuthorizingProof, true);
    assertAllFalse(entry.explicitBlockedAuthorizationFlags);
    assertAllFalse(entry.unsafeCiEnablementRuntimeFlags);
    assertAllFalse(entry.runtimeEffect);
  }
  const allText = JSON.stringify(fixture);
  assert.match(allText, /5\.78/);
  assert.match(allText, /5\.76B/);
  assert.match(allText, /docs\/posture\.md/);
  assert.match(allText, /Josh/);
  assert.match(allText, /Jules/);
  assert.match(allText, /phase-5\.80/);
});

test("Phase 5.79 recommendedNextPhase is phase-5.80", async () => {
  const fixture = await readFixture();
  assert.equal(fixture.recommendedNextPhase, "phase-5.80-report-script-compaction");
});

test("Phase 5.79 .github/workflows/ contains exactly ci.yml and security.yml", () => {
  assert.equal(existsSync(workflowsDir), true, ".github/workflows/ should exist");
  const files = readdirSync(workflowsDir).filter((f) => f.endsWith(".yml"));
  assert.ok(files.includes("ci.yml"), "ci.yml should exist");
  assert.ok(files.includes("security.yml"), "security.yml should exist");
  assert.equal(files.length, 2, "exactly two workflow files");
});

test("Phase 5.79 ci.yml conforms to 5.78 contract", async () => {
  const ciYml = await readFile(fileURLToPath(new URL("../.github/workflows/ci.yml", import.meta.url)), "utf8");
  assert.match(ciYml, /push:\s*\n\s*branches:\s*\[main\]/);
  assert.match(ciYml, /pull_request:/);
  assert.match(ciYml, /cancel-in-progress:\s*true/);
  assert.match(ciYml, /contents:\s*read/);
  // ponytail: actions pinned to commit SHAs (semgrep-clean)
  assert.match(ciYml, /actions\/checkout@34e114876b0b11c390a56381ad16ebd13914f8d5/);
  assert.match(ciYml, /actions\/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020/);
  assert.match(ciYml, /dtolnay\/rust-toolchain@e97e2d8cc328f1b50210efc529dca0028893a2d9/);
  assert.match(ciYml, /Swatinem\/rust-cache@42dc69e1aa15d09112580998cf2ef0119e2e91ae/);
  assert.match(ciYml, /npm ci/);
  assert.match(ciYml, /node --test/);
  assert.match(ciYml, /cargo fmt --check/);
  assert.match(ciYml, /cargo clippy/);
  assert.match(ciYml, /cargo test --workspace/);
  assert.match(ciYml, /windows-latest/);
  assert.doesNotMatch(ciYml, /secrets\./);
  assert.doesNotMatch(ciYml, /publish/);
  assert.doesNotMatch(ciYml, /deploy/);
  assert.doesNotMatch(ciYml, /auto.?merge/);
  assert.doesNotMatch(ciYml, /semgrep/);
  assert.doesNotMatch(ciYml, /ARDYN_FABRIC/);
  assert.doesNotMatch(ciYml, /FABRIC_TRANSPORT/);
});

test("Phase 5.79 security.yml conforms to 5.78 contract", async () => {
  const secYml = await readFile(fileURLToPath(new URL("../.github/workflows/security.yml", import.meta.url)), "utf8");
  assert.match(secYml, /schedule:/);
  assert.match(secYml, /cron:/);
  assert.match(secYml, /workflow_dispatch:/);
  assert.match(secYml, /contents:\s*read/);
  assert.match(secYml, /npm audit/);
  assert.match(secYml, /cargo audit/);
  assert.match(secYml, /osv-scanner/);
  assert.doesNotMatch(secYml, /secrets\./);
  assert.doesNotMatch(secYml, /publish/);
  assert.doesNotMatch(secYml, /deploy/);
  assert.doesNotMatch(secYml, /ARDYN_FABRIC/);
  assert.doesNotMatch(secYml, /FABRIC_TRANSPORT/);
});

test("Phase 5.79 invalid CI enablement cases fail closed", () => {
  const cases = [
    { name: "malformed-ci-enablement-boundary-map-input-rejected", input: null },
    { name: "malformed-ci-enablement-boundary-map-input-rejected", input: { reviewedAt: "not-a-date" } },
    { name: "unknown-top-level-field-ci-enablement-boundary-map-input-rejected", input: { reviewedAt, ciCommentary: false } },
    { name: "authorization-flags-enabled-ci-enablement-boundary-map-input-rejected", input: withBoundaryEntries((e) => { e[0].explicitBlockedAuthorizationFlags.ciExecutionAuthorizationGranted = true; }) },
    { name: "report-runs-checks-true-ci-enablement-boundary-map-input-rejected", input: { reviewedAt, reportRunsChecks: true } },
    { name: "blocked-cli-bypass-attempt-ci-enablement-boundary-map-input-rejected", input: { reviewedAt, blockedCliBypassEnabled: true } },
    { name: "ci-with-secrets-ci-enablement-boundary-map-input-rejected", input: { reviewedAt, ciSecrets: {} } },
    { name: "ci-with-write-permissions-ci-enablement-boundary-map-input-rejected", input: { reviewedAt, ciWritePermissions: true } },
    { name: "extra-workflow-ci-enablement-boundary-map-input-rejected", input: { reviewedAt, extraWorkflow: {} } },
    { name: "semgrep-as-gate-ci-enablement-boundary-map-input-rejected", input: { reviewedAt, semgrepAsGate: true } },
    { name: "fabric-secret-in-ci-ci-enablement-boundary-map-input-rejected", input: { reviewedAt, fabricSecretInCi: true } },
    { name: "fabric-sidecar-contact-ci-enablement-boundary-map-input-rejected", input: { reviewedAt, fabricSidecarContact: true } },
    { name: "unsafe-ci-enablement-runtime-flags-ci-enablement-boundary-map-input-rejected", input: { reviewedAt, ciRuntimeEnabled: true } },
    { name: "nested-unsafe-flags-ci-enablement-boundary-map-input-rejected", input: { reviewedAt, runtimeEffect: { runtimeEnabled: true } } },
    { name: "noncanonical-ci-enablement-boundary-map-input-rejected", input: withBoundaryEntries((e) => { e[0].boundaryId = "phase5-79.modified.noncanonical"; }) }
  ];
  for (const { name, input } of cases) {
    const result = createCiEnablementForReview(input);
    assert.equal(result.classification, expectedCaseClassifications[name], name);
    assert.equal(result.ciEnablementBoundaryMapProduced, false, name);
    assert.equal(result.boundaryEntries.length, 0, name);
    assertNonAuthorizing(result);
  }
});

test("Phase 5.79 boundary map stays non-authorizing and runtime-blocked", async () => {
  const fixture = await readFixture();
  assert.equal(fixture.reviewOnly, true);
  assert.equal(fixture.metadataOnly, true);
  assert.equal(fixture.authoritative, false);
  assert.equal(fixture.reportRunsChecks, false);
  assert.equal(fixture.nonAuthorizingProof, true);
  for (const entry of fixture.boundaryEntries) {
    assertAllFalse(entry.unsafeCiEnablementRuntimeFlags);
    assertAllFalse(entry.explicitBlockedAuthorizationFlags);
    assertAllFalse(entry.runtimeEffect);
  }
  assertNonAuthorizing(fixture);
});