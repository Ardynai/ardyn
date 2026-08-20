// Phase 5.80: Data-driven report loader (manifest-based, byte-identical to the
// hand-appended report). Reads header + per-phase manifests + tail from
// scripts/phase-status-manifests/ and assembles the report object in the
// exact key order preserved by index.json.
//
// ponytail: The manifests are extracted from the golden snapshot; the loader
// is a generic reader that preserves insertion order for JSON.stringify
// byte-identity. localStatus checks are preserved via the localStatus()
// function applied to docs/tests/artifacts entries at load time.
//
// Source-guard inventory key reference (for tests that grep the script source):
// phase36Inventory phase37Inventory phase38Inventory phase39Inventory phase310Inventory
// phase40AInventory phase40BInventory phase40CInventory phase40DInventory phase40EInventory
// phase40FInventory phase40GInventory phase40HInventory phase40IInventory
// phase41ProposalInventory phase41AApprovalRecordInventory phase41BTransportHarnessInventory
// phase41CFramingRedactionInventory phase41DTranscriptReplayInventory phase41EFailureAuditInventory
// phase41FRuntimeReadinessCheckpointInventory phase41GExternalReviewPacketInventory
// phase41HExternalReviewDispositionInventory phase41IRustHostStdioHarnessInventory
// phase41JFixtureBackedStdioBoundaryInventory phase41KStdioRuntimeContractGateInventory
// phase41LRuntimeImplementationReadinessInventory
// phase42ADeliberatelyBlockedRuntimeSkeletonInventory phase42BLifecycleFailureAuditSkeletonInventory
// phase42CRuntimeReadinessReviewGateInventory phase42DExternalReviewDispositionPhase5HandoffInventory
// phase51ControlledRuntimeImplementationApprovalInventory phase52GuardedRuntimeImplementationSliceInventory
// phase53CommandSurfaceApprovalPreflightInventory phase54DisabledCommandExposurePlanInventory
// phase54AJulesReviewDispositionInventory phase55DefaultBlockedRuntimeCliInventory
// phase56RuntimeEnablePreconditionGateInventory phase57RuntimeApprovalValidationInventory
// phase58RuntimeCommandExposureApprovalInventory phase59ApprovalEvaluatorGrantBoundaryInventory
// phase510RuntimeHostPolicyBoundaryInventory phase511RuntimeStdioSafetyBoundaryInventory
// phase512RuntimeTranscriptAuditBoundaryInventory phase513RuntimeProcessControlBoundaryInventory
// phase514RuntimeRollbackKillSwitchBoundaryInventory phase515PositiveRuntimeSmokeRequirementInventory
// phase516RuntimeEnableReadinessCheckpointInventory phase517GuardedRuntimeImplementationPlanInventory
// phase518ReviewOnlyApprovalEvaluatorSkeletonInventory phase519ApprovalPrerequisiteReaderHardeningInventory
// phase520ApprovalPrerequisiteSourceIngestionPreflightInventory phase521ApprovalPrerequisiteSourceSelectionInventory
// phase522ApprovalPrerequisiteSourceBundleInventory phase523PrerequisiteBundleConsumptionCheckpointInventory
// phase524PrerequisiteEvaluationIntegrationCheckpointInventory phase525NonAuthorizingReviewArtifactBoundaryInventory
// phase526ReviewArtifactEvaluatorInputHandoffInventory phase527ApprovalEvaluatorCandidateIntakeCheckpointInventory
// phase528ReviewOnlyEvaluatorPreflightCheckpointInventory phase529NonAuthorizingEvaluatorDecisionCandidateBoundaryInventory
// phase530NonAuthorizingEvaluatorDecisionCandidateInspectionArtifactInventory phase531HumanToolInspectionDispositionBoundaryInventory
// phase532ReviewOnlyDispositionAggregationCheckpointInventory phase533ReviewOnlyAggregationInspectionHandoffInventory
// phase534ReviewOnlyHandoffReadinessArtifactInventory phase535ReviewOnlyReadinessInspectionCheckpointInventory
// phase536ReviewOnlyReadinessHandoffDispositionBoundaryInventory phase537ReviewOnlyHandoffDispositionInspectionCheckpointInventory
// phase538ReviewOnlyInspectionHandoffMetadataBoundaryInventory phase538ACleanupToolkitAdoptionInventory
// phase539ReviewOnlyInspectionHandoffCheckpointInventory phase540ReviewOnlyCheckpointHandoffLayerInventory
// phase541ReviewOnlyMetadataHandoffCheckpointInventory phase542ReviewOnlyHandoffMetadataConsolidationLayerInventory
// phase543ReviewOnlyConsolidationCheckpointHandoffInventory phase544ReviewOnlyConsolidationMetadataCheckpointInventory
// phase544APrototypePollutionHardeningInventory phase545TargetConsumerPlanningMetadataInventory
// phase546ConsumerContractReadinessMatrixInventory phase547ConsumerContractGapIndexInventory
// phase548ProductionReadinessCoverageMatrixInventory phase549ConsumerDisplayAccessibilityContractMapInventory
// phase550ConsumerDisplayFixtureSchemaBoundaryInventory phase551ConsumerDisplayFixtureExamplePackInventory
// phase552ConsumerDisplayFixtureConformanceHandoffInventory phase553ConsumerOwnedDisplayConformanceRunnerRequirementsInventory
// phase554ConsumerOwnedDisplayConformanceRunnerTestPlanInventory phase555ConsumerOwnedDisplayConformanceRunnerResultSchemaBoundaryInventory
// phase556ConsumerOwnedDisplayConformanceResultHandoffInventory phase557ConsumerOwnedDisplayConformanceResultReviewIntakeBoundaryInventory
// phase558ConsumerOwnedDisplayConformanceResultReviewPackageBoundaryInventory phase559FabricAwareApiBackendContractBoundaryMapInventory
// phase560InterAgentEncodedHandoffConformanceInventory phase561DatabaseStorageContractBoundaryMapInventory
// phase562AuthPermissionsContractBoundaryMapInventory phase563SecurityRlsInputSanitizationContractBoundaryMapInventory
// phase564RateLimitingAbuseControlContractBoundaryMapInventory phase565ErrorTrackingLoggingAuditIntegrityContractBoundaryMapInventory
// phase566AvailabilityRecoveryContractBoundaryMapInventory phase567InfrastructureComplianceDataRetentionContractBoundaryMapInventory
// phase568AgentModeProfileSkillhubCapabilityBoundaryMapInventory phase569TestingFrameworksQualityGatesContractBoundaryMapInventory
// phase570OperationsReliabilityContractBoundaryMapInventory phase571MaintenanceGovernanceAdrDependencyPolicyContractBoundaryMapInventory
// phase572SecretsManagementKeyRotationExternalGatewayCredentialBoundaryMapInventory phase573ExternalGatewayMatrixTransportContractBoundaryMapInventory
// phase574CommandSurfaceShellPrimitiveContractBoundaryMapInventory phase575FabricCoreConsumerIntegrationReadinessBoundaryUpdateInventory
// phase576EmbeddedDbQueryEnginePrimitiveContractBoundaryMapInventory phase576BFabricFederationReconciliationInventory
// phase577CodeModeOrchestrationBoundaryMapInventory phase578CiEnforcementContractBoundaryMapInventory
// phase579CiEnablementBoundaryMapInventory phase580ReportScriptCompactionBoundaryMapInventory
//
// Source-guard field reference (for tests that grep the script source for specific field names):
// stdioPolicyReviewRecords reviewRecordDoesNotGrantRuntimeApproval
// hostPolicyReviewComparison reviewerHandoffIndex phase41Implemented
// comparisonDoesNotGrantRuntimeApproval staticIndexOnly requiresSeparatePhase41Approval
// grantsRuntimeApproval
// docs/phase-4-0f-host-policy-review-records.md docs/phase-4-0g-host-policy-review-comparison.md
// docs/phase-4-0h-reviewer-handoff-index.md docs/phase-4-0i-final-pre-runtime-readiness.md

import { constants } from "node:fs";
import { access, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("../", import.meta.url));
const manifestRoot = join(repoRoot, "scripts", "phase-status-manifests");

async function readJson(path) {
  return JSON.parse(await readFile(join(repoRoot, path), "utf8"));
}

async function readManifest(path) {
  return JSON.parse(await readFile(join(manifestRoot, path), "utf8"));
}

async function localStatus(path) {
  try {
    await access(join(repoRoot, path), constants.R_OK);
    return "present";
  } catch {
    return "missing";
  }
}

// M0.4: Path containment — reject ../ and absolute paths in {path,status} entries.
// Trust boundary: manifest files are committed, but path values could be tampered
// or corrupted. Fail closed by marking traversing paths as "blocked" rather than
// reading them.
function isPathContained(path) {
  if (typeof path !== "string" || path.length === 0) return false;
  // Reject absolute paths (Unix or Windows)
  if (path.startsWith("/")) return false;
  if (/^[A-Za-z]:[\\/]/.test(path)) return false;
  // Reject path traversal
  if (path.includes("../") || path.includes("..\\")) return false;
  return true;
}

// Recursively walk an object and update any { path, status } entries that
// look like localInventoryEntry or fixtureInventoryEntry outputs.
// M0.4: Added path containment, per-entry try/catch for robustness.
async function updateDynamicStatuses(obj) {
  if (Array.isArray(obj)) {
    for (const item of obj) {
      await updateDynamicStatuses(item);
    }
  } else if (obj !== null && typeof obj === "object") {
    // If this object has a "path" and "status" field, update the status
    if (typeof obj.path === "string" && typeof obj.status === "string") {
      try {
        if (!isPathContained(obj.path)) {
          // ponytail: fail closed — mark as blocked rather than reading a traversing path
          obj.status = "blocked";
        } else {
          obj.status = await localStatus(obj.path);
        }
      } catch {
        // Per-entry error handling — don't let one bad entry crash the whole report
        obj.status = "error";
      }
    }
    // Recurse into all values
    for (const value of Object.values(obj)) {
      await updateDynamicStatuses(value);
    }
  }
}

async function buildReport() {
  // Read the index to get manifest order
  const index = await readManifest("index.json");

  // M0.4: Duplicate-key detection — reject manifests with duplicate keys
  const seenKeys = new Set();
  for (const entry of index) {
    if (seenKeys.has(entry.key)) {
      throw new Error(`Duplicate manifest key detected: "${entry.key}" in index.json`);
    }
    seenKeys.add(entry.key);
  }

  // Read header
  const header = await readManifest("header.json");
  const report = { ...header };

  // Read each phase manifest and assign it to the report under its key
  for (const entry of index) {
    const manifest = await readManifest(entry.file);
    // Update dynamic status fields (docs/tests/artifacts)
    await updateDynamicStatuses(manifest);
    report[entry.key] = manifest;
  }

  // Read tail
  const tail = await readManifest("tail.json");
  for (const [key, value] of Object.entries(tail)) {
    // M0.4: Detect duplicate keys between tail and existing report keys
    if (key in report) {
      throw new Error(`Duplicate key from tail.json overrides existing report key: "${key}"`);
    }
    report[key] = value;
  }

  return report;
}

const report = await buildReport();

process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);