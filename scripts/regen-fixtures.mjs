// M0.3: Regenerate fixtures with reviewedAtDefaulted field
// This script imports each create*ForReview function, calls it with the same
// input the test uses, and writes the output to the fixture file.
import { writeFile, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve, dirname, join } from "node:path";

const repoRoot = fileURLToPath(new URL("../", import.meta.url));

// Import core
const core = await import("../packages/core/src/index.mjs");

// Map of fixture_path → { createFn, input }
// Simple fixtures: just { reviewedAt }
const simpleFixtures = [
  ["tests/fixtures/host-policy/phase5-48/production-readiness-coverage-matrix.json", "createProductionReadinessCoverageMatrixForReview", "2026-06-20T00:00:00.000Z"],
  ["tests/fixtures/host-policy/phase5-49/consumer-display-accessibility-contract-map.json", "createConsumerDisplayAccessibilityContractMapForReview", "2026-06-20T00:00:00.000Z"],
  ["tests/fixtures/host-policy/phase5-50/consumer-display-fixture-schema-boundary.json", "createConsumerDisplayFixtureSchemaBoundaryForReview", "2026-06-20T00:00:00.000Z"],
  ["tests/fixtures/host-policy/phase5-51/consumer-display-fixture-example-pack.json", "createConsumerDisplayFixtureExamplePackForReview", "2026-06-20T00:00:00.000Z"],
  ["tests/fixtures/host-policy/phase5-52/consumer-display-fixture-conformance-handoff.json", "createConsumerDisplayFixtureConformanceHandoffForReview", "2026-06-20T00:00:00.000Z"],
  ["tests/fixtures/host-policy/phase5-53/consumer-owned-display-conformance-runner-requirements.json", "createConsumerOwnedDisplayConformanceRunnerRequirementsForReview", "2026-06-20T00:00:00.000Z"],
  ["tests/fixtures/host-policy/phase5-54/consumer-owned-display-conformance-runner-test-plan.json", "createConsumerOwnedDisplayConformanceRunnerTestPlanForReview", "2026-06-20T00:00:00.000Z"],
  ["tests/fixtures/host-policy/phase5-55/consumer-owned-display-conformance-runner-result-schema-boundary.json", "createConsumerOwnedDisplayConformanceRunnerResultSchemaBoundaryForReview", "2026-06-20T00:00:00.000Z"],
  ["tests/fixtures/host-policy/phase5-56/consumer-owned-display-conformance-result-handoff.json", "createConsumerOwnedDisplayConformanceResultHandoffForReview", "2026-06-20T00:00:00.000Z"],
  ["tests/fixtures/host-policy/phase5-57/consumer-owned-display-conformance-result-review-intake-boundary.json", "createConsumerOwnedDisplayConformanceResultReviewIntakeBoundaryForReview", "2026-06-21T00:00:00.000Z"],
  ["tests/fixtures/host-policy/phase5-58/consumer-owned-display-conformance-result-review-package-boundary.json", "createConsumerOwnedDisplayConformanceResultReviewPackageBoundaryForReview", "2026-06-21T00:00:00.000Z"],
  ["tests/fixtures/host-policy/phase5-59/fabric-aware-api-backend-contract-boundary-map.json", "createFabricAwareApiBackendContractBoundaryMapForReview", "2026-06-22T00:00:00.000Z"],
  ["tests/fixtures/host-policy/phase5-60/inter-agent-encoded-handoff-conformance.json", "createInterAgentEncodedHandoffConformanceForReview", "2026-06-22T00:00:00.000Z"],
  ["tests/fixtures/host-policy/phase5-61/database-storage-contract-boundary-map.json", "createDatabaseStorageContractBoundaryMapForReview", "2026-06-22T00:00:00.000Z"],
  ["tests/fixtures/host-policy/phase5-62/auth-permissions-contract-boundary-map.json", "createAuthPermissionsContractBoundaryMapForReview", "2026-06-22T00:00:00.000Z"],
  ["tests/fixtures/host-policy/phase5-63/security-rls-input-sanitization-contract-boundary-map.json", "createSecurityRlsInputSanitizationContractBoundaryMapForReview", "2026-06-22T00:00:00.000Z"],
  ["tests/fixtures/host-policy/phase5-64/rate-limiting-abuse-control-contract-boundary-map.json", "createRateLimitingAbuseControlContractBoundaryMapForReview", "2026-06-22T00:00:00.000Z"],
  ["tests/fixtures/host-policy/phase5-65/error-tracking-logging-audit-integrity-contract-boundary-map.json", "createErrorTrackingLoggingAuditIntegrityContractBoundaryMapForReview", "2026-06-23T00:00:00.000Z"],
  ["tests/fixtures/host-policy/phase5-66/availability-recovery-contract-boundary-map.json", "createAvailabilityRecoveryContractBoundaryMapForReview", "2026-06-24T00:00:00.000Z"],
  ["tests/fixtures/host-policy/phase5-67/infrastructure-compliance-data-retention-contract-boundary-map.json", "createInfrastructureComplianceDataRetentionContractBoundaryMapForReview", "2026-06-24T00:00:00.000Z"],
  ["tests/fixtures/host-policy/phase5-68/agent-mode-profile-skillhub-capability-boundary-map.json", "createAgentModeProfileSkillhubCapabilityBoundaryMapForReview", "2026-06-25T00:00:00.000Z"],
  ["tests/fixtures/host-policy/phase5-69/testing-frameworks-quality-gates-contract-boundary-map.json", "createTestingFrameworksQualityGatesContractBoundaryMapForReview", "2026-06-27T00:00:00.000Z"],
  ["tests/fixtures/host-policy/phase5-70/operations-reliability-contract-boundary-map.json", "createOperationsReliabilityContractBoundaryMapForReview", "2026-06-28T00:00:00.000Z"],
  ["tests/fixtures/host-policy/phase5-71/maintenance-governance-adr-dependency-policy-contract-boundary-map.json", "createMaintenanceGovernanceAdrDependencyPolicyContractBoundaryMapForReview", "2026-06-28T00:00:00.000Z"],
  ["tests/fixtures/host-policy/phase5-72/secrets-management-key-rotation-external-gateway-credential-boundary-map.json", "createSecretsManagementKeyRotationExternalGatewayCredentialBoundaryMapForReview", "2026-06-29T00:00:00.000Z"],
  ["tests/fixtures/host-policy/phase5-73/external-gateway-matrix-transport-contract-boundary-map.json", "createExternalGatewayMatrixTransportContractBoundaryMapForReview", "2026-06-29T00:00:00.000Z"],
  ["tests/fixtures/host-policy/phase5-74/command-surface-shell-primitive-contract-boundary-map.json", "createCommandSurfaceShellPrimitiveContractBoundaryMapForReview", "2026-06-30T00:00:00.000Z"],
  ["tests/fixtures/host-policy/phase5-75/fabric-core-consumer-integration-readiness-boundary-update.json", "createFabricCoreConsumerIntegrationReadinessBoundaryUpdateForReview", "2026-07-01T00:00:00.000Z"],
  ["tests/fixtures/host-policy/phase5-76/embedded-db-query-engine-primitive-contract-boundary-map.json", "createEmbeddedDbQueryEnginePrimitiveContractBoundaryMapForReview", "2026-07-01T00:00:00.000Z"],
  ["tests/fixtures/host-policy/phase5-76b/fabric-federation-reconciliation.json", "createFabricFederationReconciliationForReview", "2026-07-05T00:00:00.000Z"],
  ["tests/fixtures/host-policy/phase5-77/code-mode-orchestration.json", "createCodeModeOrchestrationForReview", "2026-07-06T00:00:00.000Z"],
  ["tests/fixtures/host-policy/phase5-78/ci-enforcement-contract.json", "createCiEnforcementContractForReview", "2026-07-06T00:00:00.000Z"],
  ["tests/fixtures/host-policy/phase5-79/ci-enablement.json", "createCiEnablementForReview", "2026-07-07T00:00:00.000Z"],
  ["tests/fixtures/host-policy/phase5-80/report-script-compaction.json", "createReportScriptCompactionForReview", "2026-07-08T00:00:00.000Z"],
  ["tests/fixtures/host-policy/phase5-81/report-test-compaction.json", "createReportTestCompactionForReview", "2026-07-08T00:00:00.000Z"],
  ["tests/fixtures/host-policy/phase5-82/source-guard-hardening.json", "createSourceGuardHardeningForReview", "2026-07-09T00:00:00.000Z"],
  ["tests/fixtures/host-policy/phase5-83/external-reference-policy.json", "createExternalReferencePolicyForReview", "2026-07-09T00:00:00.000Z"],
];

let regenCount = 0;
let skipCount = 0;

for (const [fixturePath, createFn, reviewedAt] of simpleFixtures) {
  const fn = core[createFn];
  if (!fn) {
    console.error(`SKIP: ${createFn} not found in core exports`);
    skipCount++;
    continue;
  }

  // Check if the fixture file exists
  const absPath = resolve(repoRoot, fixturePath);
  try {
    await readFile(absPath, "utf8");
  } catch {
    console.error(`SKIP: fixture ${fixturePath} not found`);
    skipCount++;
    continue;
  }

  // Some functions take extra args — check for codeModeOrchestration
  let input = { reviewedAt };
  if (createFn === "createCodeModeOrchestrationForReview") {
    input = { reviewedAt, maxIterationsPerLoop: 5 };
  }

  try {
    const generated = fn(input);
    await writeFile(absPath, JSON.stringify(generated, null, 2) + "\n");
    console.log(`REGEN: ${fixturePath} (reviewedAtDefaulted: ${generated.reviewedAtDefaulted})`);
    regenCount++;
  } catch (e) {
    console.error(`ERROR: ${createFn} failed: ${e.message}`);
    skipCount++;
  }
}

console.log(`\nRegenerated: ${regenCount}, Skipped: ${skipCount}`);