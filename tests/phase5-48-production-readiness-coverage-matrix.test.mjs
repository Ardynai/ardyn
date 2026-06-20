import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";
import {
  PRODUCTION_READINESS_COVERAGE_MATRIX_SCHEMA,
  createProductionReadinessCoverageMatrixForReview
} from "../packages/core/src/index.mjs";

const execFileAsync = promisify(execFile);
const phase548BaselineCommit = "e3efc0b150e188d4849c8e546bb4142e77a3ce7a";
const reviewedAt = "2026-06-20T00:00:00.000Z";
const repoRootUrl = new URL("../", import.meta.url);
const repoRoot = fileURLToPath(repoRootUrl);
const cliPath = fileURLToPath(new URL("../apps/cli/src/index.mjs", import.meta.url));
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-48/production-readiness-coverage-matrix.json",
  import.meta.url
);

const expectedCaseClassifications = Object.freeze({
  "malformed-production-readiness-coverage-matrix-input-rejected":
    "malformed_production_readiness_coverage_matrix_input_rejected",
  "malformed-production-readiness-coverage-matrix-invalid-reviewed-at-rejected":
    "malformed_production_readiness_coverage_matrix_input_rejected",
  "reviewer-routing-looking-production-readiness-coverage-matrix-input-rejected":
    "reviewer_routing_looking_production_readiness_coverage_matrix_input_rejected",
  "reviewer-assignment-looking-production-readiness-coverage-matrix-input-rejected":
    "reviewer_assignment_looking_production_readiness_coverage_matrix_input_rejected",
  "evaluator-execution-looking-production-readiness-coverage-matrix-input-rejected":
    "evaluator_execution_looking_production_readiness_coverage_matrix_input_rejected",
  "evaluator-result-looking-production-readiness-coverage-matrix-input-rejected":
    "evaluator_result_looking_production_readiness_coverage_matrix_input_rejected",
  "approval-decision-looking-production-readiness-coverage-matrix-input-rejected":
    "approval_decision_looking_production_readiness_coverage_matrix_input_rejected",
  "grant-looking-production-readiness-coverage-matrix-input-rejected":
    "grant_looking_production_readiness_coverage_matrix_input_rejected",
  "runtime-permission-looking-production-readiness-coverage-matrix-input-rejected":
    "runtime_permission_looking_production_readiness_coverage_matrix_input_rejected",
  "command-exposure-looking-production-readiness-coverage-matrix-input-rejected":
    "command_exposure_looking_production_readiness_coverage_matrix_input_rejected",
  "runtime-effect-true-production-readiness-coverage-matrix-input-rejected":
    "runtime_effect_true_production_readiness_coverage_matrix_input_rejected",
  "process-flag-true-production-readiness-coverage-matrix-input-rejected":
    "process_flag_true_production_readiness_coverage_matrix_input_rejected",
  "runtime-execution-signal-looking-production-readiness-coverage-matrix-input-rejected":
    "execution_signal_looking_production_readiness_coverage_matrix_input_rejected",
  "valid-production-readiness-coverage-matrix":
    "valid_production_readiness_coverage_matrix_runtime_still_blocked"
});

const expectedAreaNames = Object.freeze([
  "Front-End Development / WCAG / browser state",
  "API & Backend Logic",
  "Database & Storage",
  "Auth & Permissions",
  "Hosting & Deployment",
  "Cloud & Compute",
  "CI/CD & Version Control",
  "Security & RLS",
  "Rate Limiting",
  "Caching & CDN",
  "Load Balancing & Scaling",
  "Error Tracking & Logs",
  "Availability & Recovery",
  "Infrastructure Management & Compliance",
  "Testing Frameworks",
  "Operations & Reliability",
  "Maintenance & Governance",
  "Secrets Management",
  "System Discovery / service registry / schedule enforcement"
]);

const commandProbes = Object.freeze([
  "production-readiness-coverage-matrix",
  "create-production-readiness-coverage-matrix",
  "phase-5-48-production-readiness",
  "service-discovery",
  "schedule-enforcement",
  "secret-vault",
  "secure-drop",
  "fabric-runtime",
  "websocket-http-runtime",
  "mcp-task-execution",
  "connector-grant"
]);

const nonAuthorizingResultFields = Object.freeze([
  "productionInfrastructureImplemented",
  "productionReadinessCoverageMatrixIsReviewerRouting",
  "productionReadinessCoverageMatrixIsReviewerAssignment",
  "productionReadinessCoverageMatrixIsEvaluatorExecution",
  "productionReadinessCoverageMatrixIsEvaluatorResult",
  "productionReadinessCoverageMatrixIsApprovalDecision",
  "productionReadinessCoverageMatrixIsApprovalGrant",
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
  "webSocketHttpSurfaceEnabled",
  "databaseStorageRuntimeWritesEnabled",
  "runtimeDatabaseWriteEnabled",
  "storageRuntimeWriteEnabled",
  "secretsRuntimeIngestionEnabled",
  "externalServicesEnabled",
  "networkServerEnabled",
  "hostingDeploymentProvisioned",
  "cloudComputeProvisioned",
  "rateLimitingRuntimeEnabled",
  "cachingCdnRuntimeEnabled",
  "loadBalancingRuntimeEnabled",
  "runtimeObservabilityEnabled",
  "disasterRecoveryRuntimeEnabled",
  "infrastructureMutationEnabled",
  "complianceAttestationProduced",
  "productionTestRuntimeEnabled",
  "operationsMonitorEnabled",
  "alertDispatchEnabled",
  "retryCircuitBreakerRuntimeEnabled",
  "serviceDiscoveryEnabled",
  "liveServiceRegistryConnectionEnabled",
  "scheduleEnforcementEnabled",
  "backgroundPollingEnabled"
]);

const allowedStatuses = new Set([
  "covered",
  "partial",
  "missing",
  "deferred",
  "not_applicable"
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
  for (const field of nonAuthorizingResultFields) {
    assert.equal(result[field], false, `${field} should be false`);
  }

  assert.equal(result.nonAuthorizingProof, true);
  assertAllFalse(result.runtimeEffect);
}

function assertAuthorizationStatusFlags(flags) {
  for (const [key, value] of Object.entries(flags)) {
    assert.equal(value, false, `${key} should be false`);
  }
}

test("Phase 5.48 production-readiness coverage matrix fixture is deterministic", async () => {
  const fixture = await readFixture();
  const generated = createProductionReadinessCoverageMatrixForReview({
    reviewedAt
  });

  assert.equal(fixture.schema, PRODUCTION_READINESS_COVERAGE_MATRIX_SCHEMA);
  assert.deepEqual(fixture, generated);
  assert.equal(
    fixture.classification,
    expectedCaseClassifications["valid-production-readiness-coverage-matrix"]
  );
  assert.equal(fixture.productionReadinessCoverageMatrixProduced, true);
  assert.equal(fixture.matrixSummary.areaCount, 19);
  assert.equal(fixture.matrixSummary.covered, 3);
  assert.equal(fixture.matrixSummary.partial, 7);
  assert.equal(fixture.matrixSummary.deferred, 9);
  assert.equal(fixture.matrixSummary.missing, 0);
  assert.equal(fixture.matrixSummary.notApplicable, 0);
});

test("Phase 5.48 classifies unsafe production-readiness inputs without authorization", () => {
  const cases = [
    [
      "malformed-production-readiness-coverage-matrix-input-rejected",
      createProductionReadinessCoverageMatrixForReview(null)
    ],
    [
      "malformed-production-readiness-coverage-matrix-invalid-reviewed-at-rejected",
      createProductionReadinessCoverageMatrixForReview({ reviewedAt: "2026-06-20" })
    ],
    [
      "reviewer-routing-looking-production-readiness-coverage-matrix-input-rejected",
      createProductionReadinessCoverageMatrixForReview({
        reviewedAt,
        reviewerRoutingPerformed: true
      })
    ],
    [
      "reviewer-assignment-looking-production-readiness-coverage-matrix-input-rejected",
      createProductionReadinessCoverageMatrixForReview({
        reviewedAt,
        reviewerAssignmentPerformed: true
      })
    ],
    [
      "evaluator-execution-looking-production-readiness-coverage-matrix-input-rejected",
      createProductionReadinessCoverageMatrixForReview({
        reviewedAt,
        evaluatorExecutionPerformed: true
      })
    ],
    [
      "evaluator-result-looking-production-readiness-coverage-matrix-input-rejected",
      createProductionReadinessCoverageMatrixForReview({
        reviewedAt,
        evaluatorResultProduced: true
      })
    ],
    [
      "approval-decision-looking-production-readiness-coverage-matrix-input-rejected",
      createProductionReadinessCoverageMatrixForReview({
        reviewedAt,
        approvalDecisionProduced: true
      })
    ],
    [
      "grant-looking-production-readiness-coverage-matrix-input-rejected",
      createProductionReadinessCoverageMatrixForReview({
        reviewedAt,
        connectorGrantProduced: true
      })
    ],
    [
      "runtime-permission-looking-production-readiness-coverage-matrix-input-rejected",
      createProductionReadinessCoverageMatrixForReview({
        reviewedAt,
        runtimePermissionGranted: true
      })
    ],
    [
      "command-exposure-looking-production-readiness-coverage-matrix-input-rejected",
      createProductionReadinessCoverageMatrixForReview({
        reviewedAt,
        commandRuntimeControlEnabled: true
      })
    ],
    [
      "runtime-effect-true-production-readiness-coverage-matrix-input-rejected",
      createProductionReadinessCoverageMatrixForReview({
        reviewedAt,
        runtimeEffect: { runtimeExecutionEnabled: true }
      })
    ],
    [
      "process-flag-true-production-readiness-coverage-matrix-input-rejected",
      createProductionReadinessCoverageMatrixForReview({
        reviewedAt,
        processControlEnabled: true
      })
    ],
    [
      "runtime-execution-signal-looking-production-readiness-coverage-matrix-input-rejected",
      createProductionReadinessCoverageMatrixForReview({
        reviewedAt,
        serviceDiscoveryEnabled: true
      })
    ],
    [
      "valid-production-readiness-coverage-matrix",
      createProductionReadinessCoverageMatrixForReview({ reviewedAt })
    ]
  ];

  for (const [caseName, result] of cases) {
    assert.equal(result.classification, expectedCaseClassifications[caseName], caseName);
    assert.equal(result.reviewOnly, true);
    assert.equal(result.authoritative, false);
    assertNonAuthorizing(result);
  }
});

test("Phase 5.48 matrix covers all required production-readiness areas", async () => {
  const fixture = await readFixture();
  const rows = new Map(fixture.matrixRows.map((row) => [row.areaNumber, row]));

  assert.deepEqual(
    fixture.matrixRows.map((row) => row.areaName),
    expectedAreaNames
  );
  assert.deepEqual(
    fixture.matrixRows.map((row) => row.areaNumber),
    Array.from({ length: 19 }, (_, index) => index + 1)
  );

  for (const row of fixture.matrixRows) {
    assert.ok(allowedStatuses.has(row.currentStatus), row.areaName);
    assert.ok(row.ardynSpecificInterpretation.length > 0, row.areaName);
    assert.ok(row.currentEvidenceInRepo.length > 0, row.areaName);
    assert.ok(row.productionGap.length > 0, row.areaName);
    assert.match(row.futurePhaseCandidate, /^phase-5\./);
    assert.ok(row.authorizationPrerequisiteNotes.length >= 2, row.areaName);
    assert.ok(row.currentAllowedBehavior.length > 0, row.areaName);
    assert.ok(row.explicitlyForbiddenCurrentBehavior.length >= 5, row.areaName);
    assert.equal(row.nonAuthorizingProof, true, row.areaName);
    assertAuthorizationStatusFlags(row.authorizationStatusFlags);
    for (const value of Object.values(row.productionRuntimeRequirements)) {
      assert.equal(typeof value, "boolean", row.areaName);
    }
  }

  assert.equal(rows.get(1).currentStatus, "deferred");
  assert.match(rows.get(1).productionGap, /No Ardyn-owned UI/);
  assert.equal(rows.get(2).productionRuntimeRequirements.liveRuntimeRequired, true);
  assert.equal(rows.get(2).productionRuntimeRequirements.webSocketHttpRequired, true);
  assert.equal(rows.get(3).productionRuntimeRequirements.databaseStorageRequired, true);
  assert.equal(rows.get(4).currentStatus, "partial");
  assert.equal(rows.get(8).productionRuntimeRequirements.databaseStorageRequired, true);
  assert.equal(rows.get(15).currentStatus, "covered");
  assert.equal(rows.get(18).currentStatus, "covered");
  assert.equal(rows.get(18).productionRuntimeRequirements.secretsRequired, true);
  assert.equal(rows.get(18).productionRuntimeRequirements.secureDropRequired, true);
  assert.ok(rows.get(18).explicitlyForbiddenCurrentBehavior.includes("vault access"));
  assert.equal(
    rows.get(19).productionRuntimeRequirements.serviceDiscoveryScheduleRequired,
    true
  );
  assert.ok(
    rows.get(19).explicitlyForbiddenCurrentBehavior.includes(
      "schedule enforcement"
    )
  );
});

test("Phase 5.48 result remains non-authorizing and runtime blocked", async () => {
  const fixture = await readFixture();

  assert.equal(fixture.reviewOnly, true);
  assert.equal(fixture.authoritative, false);
  assert.equal(fixture.productionReadinessCoverageMatrixOnly, true);
  assert.equal(fixture.productionInfrastructureImplemented, false);
  assert.equal(fixture.matrixSummary.productionInfrastructureImplemented, false);
  assert.equal(fixture.matrixSummary.systemDiscoveryMetadataOnly, true);
  assert.equal(
    fixture.matrixSummary.secureDropFutureContentFabricCapabilityReferenceOnly,
    true
  );
  assertNonAuthorizing(fixture);
  assertNonAuthorizing(fixture.productionReadinessCoverageMatrix);
  assert.deepEqual(fixture.rejectionReasons, [
    "production_readiness_coverage_matrix_is_review_only",
    "ardyn_role_is_harness_framework_contract_layer_not_live_runtime_application",
    "runtime_command_db_storage_secrets_connector_fabric_websocket_http_mcp_task_secure_drop_authorizations_false",
    "system_discovery_service_registry_schedule_enforcement_and_polling_blocked",
    "secure_drop_is_future_content_fabric_capability_reference_only",
    "fallow_runtime_not_used",
    "runtime_enablement_still_blocked"
  ]);
  assert.ok(
    fixture.topProductionReadinessGaps.some((gap) =>
      gap.includes("service discovery")
    )
  );
});

test("serve-runtime remains default-blocked and dry-run cannot bypass Phase 5.48", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-48-runtime-"));

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

test("Phase 5.48 production-readiness command names remain rejected", async () => {
  for (const command of commandProbes) {
    const failure = await expectCliFailure([command]);

    assert.notEqual(failure.code, 0);
    assert.equal(failure.stdout, "");
    assert.match(failure.stderr, /unknown command|Usage: ardyn/i);
  }
});

test("Phase 5.48 does not change CLI, Rust, or Fabric runtime source", async () => {
  await execFileAsync(
    "git",
    [
      "diff",
      "--exit-code",
      phase548BaselineCommit,
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

  assert.doesNotMatch(currentCliSource, /production-readiness-coverage-matrix/);
  assert.doesNotMatch(currentCliSource, /phase-5-48/);
});
