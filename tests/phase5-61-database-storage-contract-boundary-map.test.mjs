import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";
import {
  DATABASE_STORAGE_CONTRACT_BOUNDARY_MAP_SCHEMA,
  createDatabaseStorageContractBoundaryMapForReview
} from "../packages/core/src/index.mjs";

const execFileAsync = promisify(execFile);
const phase561BaselineCommit = "e7bd4d1a3b1f0e2573926789b5bac84501de6979";
const reviewedAt = "2026-06-22T00:00:00.000Z";
const repoRootUrl = new URL("../", import.meta.url);
const repoRoot = fileURLToPath(repoRootUrl);
const cliPath = fileURLToPath(new URL("../apps/cli/src/index.mjs", import.meta.url));
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-61/database-storage-contract-boundary-map.json",
  import.meta.url
);

const expectedCaseClassifications = Object.freeze({
  "valid-database-storage-contract-boundary-map":
    "valid_database_storage_contract_boundary_map_runtime_still_blocked",
  "malformed-database-storage-contract-boundary-map-input-rejected":
    "malformed_database_storage_contract_boundary_map_input_rejected",
  "missing-required-database-storage-contract-boundary-entry-rejected":
    "missing_required_database_storage_contract_boundary_entry_rejected",
  "unknown-top-level-field-database-storage-contract-boundary-map-input-rejected":
    "unknown_top_level_field_database_storage_contract_boundary_map_input_rejected",
  "unknown-boundary-family-database-storage-contract-boundary-map-input-rejected":
    "unknown_boundary_family_database_storage_contract_boundary_map_input_rejected",
  "unknown-related-system-database-storage-contract-boundary-map-input-rejected":
    "unknown_related_system_database_storage_contract_boundary_map_input_rejected",
  "unknown-current-status-database-storage-contract-boundary-map-input-rejected":
    "unknown_current_status_database_storage_contract_boundary_map_input_rejected",
  "unknown-data-classification-database-storage-contract-boundary-map-input-rejected":
    "unknown_data_classification_database_storage_contract_boundary_map_input_rejected",
  "authorization-flags-enabled-database-storage-contract-boundary-map-input-rejected":
    "authorization_flags_enabled_database_storage_contract_boundary_map_input_rejected",
  "report-runs-checks-true-database-storage-contract-boundary-map-input-rejected":
    "report_runs_checks_true_database_storage_contract_boundary_map_input_rejected",
  "runtime-authorization-attempt-database-storage-contract-boundary-map-input-rejected":
    "runtime_authorization_attempt_database_storage_contract_boundary_map_input_rejected",
  "command-exposure-attempt-database-storage-contract-boundary-map-input-rejected":
    "command_exposure_attempt_database_storage_contract_boundary_map_input_rejected",
  "blocked-cli-bypass-attempt-database-storage-contract-boundary-map-input-rejected":
    "blocked_cli_bypass_attempt_database_storage_contract_boundary_map_input_rejected",
  "hidden-database-connection-semantics-database-storage-contract-boundary-map-input-rejected":
    "hidden_database_connection_semantics_database_storage_contract_boundary_map_input_rejected",
  "hidden-filesystem-write-semantics-database-storage-contract-boundary-map-input-rejected":
    "hidden_filesystem_write_semantics_database_storage_contract_boundary_map_input_rejected",
  "hidden-transcript-audit-write-semantics-database-storage-contract-boundary-map-input-rejected":
    "hidden_transcript_audit_write_semantics_database_storage_contract_boundary_map_input_rejected",
  "hidden-cache-invalidation-runtime-semantics-database-storage-contract-boundary-map-input-rejected":
    "hidden_cache_invalidation_runtime_semantics_database_storage_contract_boundary_map_input_rejected",
  "hidden-migration-schema-change-semantics-database-storage-contract-boundary-map-input-rejected":
    "hidden_migration_schema_change_semantics_database_storage_contract_boundary_map_input_rejected",
  "hidden-import-export-package-persistence-semantics-database-storage-contract-boundary-map-input-rejected":
    "hidden_import_export_package_persistence_semantics_database_storage_contract_boundary_map_input_rejected",
  "hidden-secure-drop-implementation-semantics-database-storage-contract-boundary-map-input-rejected":
    "hidden_secure_drop_implementation_semantics_database_storage_contract_boundary_map_input_rejected",
  "hidden-fabric-websocket-http-mcp-task-runtime-semantics-database-storage-contract-boundary-map-input-rejected":
    "hidden_fabric_websocket_http_mcp_task_runtime_semantics_database_storage_contract_boundary_map_input_rejected",
  "unsafe-database-storage-cache-persistence-write-migration-rls-backup-restore-retention-runtime-flags-database-storage-contract-boundary-map-input-rejected":
    "unsafe_database_storage_cache_persistence_write_migration_rls_backup_restore_retention_runtime_flags_database_storage_contract_boundary_map_input_rejected",
  "nested-unsafe-flags-database-storage-contract-boundary-map-input-rejected":
    "nested_unsafe_flags_database_storage_contract_boundary_map_input_rejected",
  "noncanonical-database-storage-contract-boundary-map-input-rejected":
    "noncanonical_database_storage_contract_boundary_map_input_rejected"
});

const expectedBoundaryIds = Object.freeze([
  "phase5-61.ardyn.manifest-review-artifact-metadata.database-boundary",
  "phase5-61.ardyn.approval-prerequisite-metadata.database-boundary",
  "phase5-61.ardyn.display-conformance-fixture.artifact-storage-boundary",
  "phase5-61.ardyn.encoded-handoff-metadata.storage-boundary",
  "phase5-61.repo-family.fabric-envelope-metadata.storage-boundary",
  "phase5-61.locus.visible-status-review-metadata.storage-boundary",
  "phase5-61.multiverse.capability-task-metadata.artifact-storage-boundary",
  "phase5-61.ardyn.transcript-persistence.transcript-storage-boundary",
  "phase5-61.ardyn.audit-persistence.audit-storage-boundary",
  "phase5-61.content-fabric.secure-drop-reference-metadata.storage-boundary",
  "phase5-61.ardyn.cache-freshness.cache-contract-boundary",
  "phase5-61.ardyn.cache-invalidation.invalidation-contract-boundary",
  "phase5-61.repo-family.data-isolation.data-isolation-boundary",
  "phase5-61.ardyn.retention-deletion-export.retention-policy-boundary",
  "phase5-61.ardyn.backup-recovery-rto-rpo.backup-recovery-boundary"
]);

const commandProbes = Object.freeze([
  "database-storage-contract-boundary-map",
  "db-storage-runtime",
  "database-client",
  "storage-adapter",
  "cache-engine",
  "cache-invalidation-runtime",
  "transcript-writer",
  "audit-writer",
  "database-migration",
  "rls-policy",
  "backup-restore",
  "retention-deletion-job",
  "import-export-path",
  "package-persistence",
  "persistence-runtime",
  "database-write",
  "storage-write",
  "fabric-storage-runtime",
  "secure-drop-storage-runtime",
  "encoded-handoff-storage-runtime"
]);

const nonAuthorizingResultFields = Object.freeze([
  "reportRunsChecks",
  "databaseClientImplemented",
  "databaseSchemaImplemented",
  "databaseMigrationImplemented",
  "rlsPolicyImplemented",
  "storageAdapterImplemented",
  "cacheEngineImplemented",
  "cacheInvalidationRuntimeImplemented",
  "transcriptWriterImplemented",
  "auditWriterImplemented",
  "filesystemWriteEnabled",
  "backupRestoreImplemented",
  "retentionDeletionJobImplemented",
  "importExportPathImplementedByArdyn",
  "packageDistributionImplementedByArdyn",
  "persistenceImplementedByArdyn",
  "backendRuntimeImplementedByArdyn",
  "apiEndpointImplementedByArdyn",
  "serverImplementedByArdyn",
  "websocketHttpTransportImplementedByArdyn",
  "fabricRuntimeImplementedByArdyn",
  "commandExposureEnabled",
  "commandRuntimeControlEnabled",
  "runtimeExecutionEnabled",
  "databaseStorageRuntimeWritesEnabled",
  "secretsRuntimeIngestionEnabled",
  "connectorGrantProduced",
  "mcpToolExposureEnabled",
  "taskExecutionEnabled",
  "secureDropImplemented",
  "st3ggVendored",
  "encodedHandoffRuntimeImplementedByArdyn",
  "codecImplemented",
  "translatorRuntimeImplemented",
  "serviceDiscoveryEnabled",
  "scheduleEnforcementEnabled",
  "backgroundPollingEnabled",
  "filesystemScanningEnabled",
  "processControlEnabled",
  "uiFrontendBrowserRenderingImplemented",
  "blockedCliBypassEnabled"
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

function boundaryEntryPatch(patch) {
  const [entry] = createDatabaseStorageContractBoundaryMapForReview({
    reviewedAt
  }).boundaryEntries;

  return [{ ...structuredClone(entry), ...patch }];
}

test("Phase 5.61 database/storage boundary map fixture is deterministic", async () => {
  const fixture = await readFixture();
  const generated = createDatabaseStorageContractBoundaryMapForReview({
    reviewedAt
  });

  assert.equal(fixture.schema, DATABASE_STORAGE_CONTRACT_BOUNDARY_MAP_SCHEMA);
  assert.deepEqual(fixture, generated);
  assert.equal(
    fixture.classification,
    expectedCaseClassifications[
      "valid-database-storage-contract-boundary-map"
    ]
  );
  assert.equal(fixture.databaseStorageContractBoundaryMapProduced, true);
  assert.equal(fixture.boundaryMapSummary.boundaryEntryCount, 15);
  assert.deepEqual(fixture.boundaryMapSummary.boundaryIds, expectedBoundaryIds);
  assert.deepEqual(fixture.boundaryMapSummary.countByFamily, {
    database_contract: 2,
    storage_contract: 4,
    cache_contract: 1,
    invalidation_contract: 1,
    data_isolation_contract: 1,
    transcript_storage_contract: 1,
    audit_storage_contract: 1,
    artifact_storage_contract: 2,
    retention_policy_contract: 1,
    backup_recovery_contract: 1
  });
  assert.deepEqual(fixture.boundaryMapSummary.countByRelatedSystem, {
    ardyn: 9,
    "ardyn-subagent": 1,
    locus: 1,
    multiverse: 1,
    "content-fabric": 1,
    "repo-family": 2
  });
});

test("Phase 5.61 references Phase 5.48, 5.59, 5.60, and content-fabric ownership", async () => {
  const fixture = await readFixture();
  const state = fixture.databaseStorageContractBoundaryMap;

  assert.equal(state.sourcePhaseContext.phase548DatabaseStorageAreaNumber, 3);
  assert.equal(state.sourcePhaseContext.phase548DatabaseStorageStatus, "deferred");
  assert.match(
    state.sourcePhaseContext.phase548ProductionReadinessCoverageMatrix,
    /phase5-48/
  );
  assert.match(state.sourcePhaseContext.phase559FabricAwareApiBackendBoundary, /phase5-59/);
  assert.match(
    state.sourcePhaseContext.phase560InterAgentEncodedHandoffConformance,
    /phase5-60/
  );
  assert.equal(state.sourcePhaseContext.secureDropCanonicalOwner, "content-fabric");
  assert.equal(fixture.boundaryMapSummary.phase548DatabaseStorageCoverageItemRepresented, true);
  assert.equal(
    fixture.boundaryMapSummary.phase559FabricAwareApiBackendBoundaryReferenced,
    true
  );
  assert.equal(
    fixture.boundaryMapSummary.phase560EncodedHandoffConformanceReferenced,
    true
  );
});

test("Phase 5.61 invalid database/storage boundary cases fail closed", () => {
  const canonical =
    createDatabaseStorageContractBoundaryMapForReview({ reviewedAt });
  const firstEntry = structuredClone(canonical.boundaryEntries[0]);
  const missingFieldEntry = structuredClone(firstEntry);

  delete missingFieldEntry.boundaryId;

  const cases = [
    {
      name: "malformed-database-storage-contract-boundary-map-input-rejected",
      input: null
    },
    {
      name: "malformed-database-storage-contract-boundary-map-input-rejected",
      input: { reviewedAt: "not-a-timestamp" }
    },
    {
      name: "missing-required-database-storage-contract-boundary-entry-rejected",
      input: { reviewedAt, boundaryEntries: [missingFieldEntry] }
    },
    {
      name:
        "unknown-top-level-field-database-storage-contract-boundary-map-input-rejected",
      input: { reviewedAt, secretVaultPath: "C:/blocked/vault" }
    },
    {
      name:
        "unknown-top-level-field-database-storage-contract-boundary-map-input-rejected",
      input: { reviewedAt, secureDropPayloadPath: "C:/blocked/drop" }
    },
    {
      name:
        "unknown-boundary-family-database-storage-contract-boundary-map-input-rejected",
      input: {
        reviewedAt,
        boundaryEntries: boundaryEntryPatch({ boundaryFamily: "runtime_store" })
      }
    },
    {
      name:
        "unknown-related-system-database-storage-contract-boundary-map-input-rejected",
      input: {
        reviewedAt,
        boundaryEntries: boundaryEntryPatch({ relatedSystem: "jules" })
      }
    },
    {
      name:
        "unknown-current-status-database-storage-contract-boundary-map-input-rejected",
      input: {
        reviewedAt,
        boundaryEntries: boundaryEntryPatch({ currentStatus: "implemented" })
      }
    },
    {
      name:
        "unknown-data-classification-database-storage-contract-boundary-map-input-rejected",
      input: {
        reviewedAt,
        boundaryEntries: boundaryEntryPatch({
          dataClassificationNotes: ["live_data"]
        })
      }
    },
    {
      name:
        "authorization-flags-enabled-database-storage-contract-boundary-map-input-rejected",
      input: {
        reviewedAt,
        boundaryEntries: boundaryEntryPatch({
          explicitBlockedAuthorizationFlags: {
            ...firstEntry.explicitBlockedAuthorizationFlags,
            databaseRuntimeAuthorizationGranted: true
          }
        })
      }
    },
    {
      name:
        "report-runs-checks-true-database-storage-contract-boundary-map-input-rejected",
      input: { reviewedAt, reportRunsChecks: true }
    },
    {
      name:
        "runtime-authorization-attempt-database-storage-contract-boundary-map-input-rejected",
      input: { reviewedAt, runtimeAuthorizationGranted: true }
    },
    {
      name:
        "command-exposure-attempt-database-storage-contract-boundary-map-input-rejected",
      input: { reviewedAt, commandExposureEnabled: true }
    },
    {
      name:
        "blocked-cli-bypass-attempt-database-storage-contract-boundary-map-input-rejected",
      input: { reviewedAt, blockedCliBypassEnabled: true }
    },
    {
      name:
        "hidden-database-connection-semantics-database-storage-contract-boundary-map-input-rejected",
      input: { reviewedAt, databaseUrl: "postgres://blocked.invalid/ardyn" }
    },
    {
      name:
        "hidden-filesystem-write-semantics-database-storage-contract-boundary-map-input-rejected",
      input: { reviewedAt, writeFilePath: "C:/blocked/ardyn.json" }
    },
    {
      name:
        "hidden-transcript-audit-write-semantics-database-storage-contract-boundary-map-input-rejected",
      input: { reviewedAt, transcriptWriter: "blocked" }
    },
    {
      name:
        "hidden-cache-invalidation-runtime-semantics-database-storage-contract-boundary-map-input-rejected",
      input: { reviewedAt, cacheUrl: "redis://blocked.invalid" }
    },
    {
      name:
        "hidden-migration-schema-change-semantics-database-storage-contract-boundary-map-input-rejected",
      input: { reviewedAt, migrationCommand: "ardyn migrate" }
    },
    {
      name:
        "hidden-import-export-package-persistence-semantics-database-storage-contract-boundary-map-input-rejected",
      input: { reviewedAt, importCommand: "ardyn import-results" }
    },
    {
      name:
        "hidden-secure-drop-implementation-semantics-database-storage-contract-boundary-map-input-rejected",
      input: { reviewedAt, secureDropCryptoImplemented: true }
    },
    {
      name:
        "hidden-fabric-websocket-http-mcp-task-runtime-semantics-database-storage-contract-boundary-map-input-rejected",
      input: { reviewedAt, fabricBusTopic: "blocked.topic" }
    },
    {
      name:
        "unsafe-database-storage-cache-persistence-write-migration-rls-backup-restore-retention-runtime-flags-database-storage-contract-boundary-map-input-rejected",
      input: {
        reviewedAt,
        boundaryEntries: boundaryEntryPatch({
          unsafeDatabaseStorageRuntimeFlags: {
            ...firstEntry.unsafeDatabaseStorageRuntimeFlags,
            databaseStorageRuntimeWritesEnabled: true
          }
        })
      }
    },
    {
      name:
        "nested-unsafe-flags-database-storage-contract-boundary-map-input-rejected",
      input: {
        reviewedAt,
        boundaryEntries: boundaryEntryPatch({
          runtimeEffect: {
            ...firstEntry.runtimeEffect,
            unexpectedRuntimeEffect: true
          }
        })
      }
    },
    {
      name:
        "noncanonical-database-storage-contract-boundary-map-input-rejected",
      input: {
        reviewedAt,
        boundaryEntries: [...canonical.boundaryEntries].reverse()
      }
    }
  ];

  for (const { name, input } of cases) {
    const result = createDatabaseStorageContractBoundaryMapForReview(input);

    assert.equal(result.classification, expectedCaseClassifications[name], name);
    assert.equal(result.databaseStorageContractBoundaryMapProduced, false);
    assert.equal(result.databaseStorageContractBoundaryMap, null);
    assertNonAuthorizing(result);
  }
});

test("Phase 5.61 boundary entries cover required families, systems, data classes, and blocked semantics", async () => {
  const fixture = await readFixture();
  const families = new Set();
  const systems = new Set();
  const statuses = new Set();
  const dataClassifications = new Set();

  for (const entry of fixture.boundaryEntries) {
    families.add(entry.boundaryFamily);
    systems.add(entry.relatedSystem);
    statuses.add(entry.currentStatus);
    for (const classification of entry.dataClassificationNotes) {
      dataClassifications.add(classification);
    }

    assert.match(entry.boundaryId, /^phase5-61\./);
    assert.equal(entry.databaseStorageBoundaryMetadataOnly, true);
    assert.equal(entry.noLiveDataAccessed, true);
    assert.equal(entry.nonAuthorizingProof, true);
    assert.ok(entry.allowedCurrentBehavior.length >= 2);
    assert.ok(entry.forbiddenCurrentBehavior.includes("database client"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("cache invalidation runtime"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("transcript writer"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("audit writer"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("websocket/http transport"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("Fabric runtime bus"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("command exposure"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("service discovery"));
    assert.equal(entry.productionReadinessAreaReference.areaNumber, 3);
    assert.equal(entry.productionReadinessAreaReference.authorizesRuntime, false);
    assert.equal(
      entry.phase559FabricAwareApiBackendReference.implementsFabricRuntime,
      false
    );
    assert.equal(
      entry.phase560EncodedHandoffConformanceReference
        .implementsEncodedHandoffRuntime,
      false
    );
    assertAllFalse(entry.explicitBlockedAuthorizationFlags);
    assertAllFalse(entry.unsafeDatabaseStorageRuntimeFlags);
    assertAllFalse(entry.runtimeEffect);
  }

  assert.deepEqual([...families].sort(), [
    "artifact_storage_contract",
    "audit_storage_contract",
    "backup_recovery_contract",
    "cache_contract",
    "data_isolation_contract",
    "database_contract",
    "invalidation_contract",
    "retention_policy_contract",
    "storage_contract",
    "transcript_storage_contract"
  ]);
  assert.deepEqual([...systems].sort(), [
    "ardyn",
    "ardyn-subagent",
    "content-fabric",
    "locus",
    "multiverse",
    "repo-family"
  ]);
  assert.deepEqual([...statuses].sort(), [
    "blocked",
    "future_contract_required",
    "metadata_only"
  ]);
  assert.deepEqual([...dataClassifications].sort(), [
    "future_audit_data",
    "future_secure_drop_metadata",
    "future_transcript_data",
    "future_user_content",
    "metadata_only",
    "no_live_data"
  ]);

  const secureDropEntry = fixture.boundaryEntries.find(
    (entry) => entry.relatedSystem === "content-fabric"
  );

  assert.ok(secureDropEntry);
  assert.match(secureDropEntry.secureDropRoleDescription, /content-fabric/);
});

test("Phase 5.61 boundary map stays non-authorizing and runtime-blocked", async () => {
  const fixture = await readFixture();
  const summary = fixture.boundaryMapSummary;

  assert.equal(summary.databaseStorageBoundaryMetadataOnly, true);
  assert.equal(summary.noLiveDataAccessed, true);
  assert.equal(summary.noDbStorageWrites, true);
  assert.equal(summary.noTranscriptAuditWrites, true);
  assert.equal(summary.noCacheInvalidationRuntime, true);
  assert.equal(summary.noMigrationsOrRlsApplied, true);
  assert.equal(summary.contentFabricCanonicalSecureDropOwnerOnly, true);
  assert.equal(summary.allBlockedAuthorizationFlagsFalse, true);
  assert.equal(summary.allUnsafeDatabaseStorageRuntimeFlagsFalse, true);
  assert.equal(summary.allRuntimeEffectsFalse, true);
  assert.equal(summary.allEntriesNonAuthorizing, true);
  assert.equal(fixture.invalidBoundaryCasePolicy.validationImplementsDatabaseClient, false);
  assert.equal(fixture.invalidBoundaryCasePolicy.validationImplementsStorageAdapter, false);
  assert.equal(fixture.invalidBoundaryCasePolicy.validationImplementsCacheEngine, false);
  assert.equal(fixture.invalidBoundaryCasePolicy.validationImplementsPersistence, false);
  assert.equal(fixture.invalidBoundaryCasePolicy.validationWritesTranscript, false);
  assert.equal(fixture.invalidBoundaryCasePolicy.validationWritesAudit, false);
  assert.equal(fixture.invalidBoundaryCasePolicy.validationRunsMigration, false);
  assert.equal(fixture.invalidBoundaryCasePolicy.validationAppliesRls, false);
  assert.equal(fixture.invalidBoundaryCasePolicy.validationImplementsBackupRestore, false);
  assert.equal(fixture.invalidBoundaryCasePolicy.validationRunsRuntime, false);
  assertNonAuthorizing(fixture);
  assertNonAuthorizing(fixture.databaseStorageContractBoundaryMap);
  assert.ok(
    fixture.topDatabaseStorageFabricApiBackendGaps.some((gap) =>
      gap.includes("No database client")
    )
  );
  assert.equal(
    fixture.recommendedNextPhase,
    "phase-5.62-review-only-auth-permissions-contract-boundary-map"
  );
});

test("serve-runtime remains default-blocked and dry-run cannot bypass Phase 5.61", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-61-runtime-"));

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

test("Phase 5.61 database/storage/runtime command names remain rejected", async () => {
  for (const command of commandProbes) {
    const failure = await expectCliFailure([command]);

    assert.notEqual(failure.code, 0);
    assert.equal(failure.stdout, "");
    assert.match(failure.stderr, /unknown command|Usage: ardyn/i);
  }
});

test("Phase 5.61 does not change CLI, Rust, Fabric, package, or consumer source", async () => {
  await execFileAsync(
    "git",
    [
      "diff",
      "--exit-code",
      phase561BaselineCommit,
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

  assert.doesNotMatch(currentCliSource, /database-storage-contract-boundary-map/);
  assert.doesNotMatch(currentCliSource, /db-storage-runtime/);
  assert.doesNotMatch(currentCliSource, /database-client/);
  assert.doesNotMatch(currentCliSource, /storage-adapter/);
  assert.doesNotMatch(currentCliSource, /cache-engine/);
  assert.doesNotMatch(currentCliSource, /cache-invalidation-runtime/);
  assert.doesNotMatch(currentCliSource, /transcript-writer/);
  assert.doesNotMatch(currentCliSource, /audit-writer/);
  assert.doesNotMatch(currentCliSource, /database-migration/);
  assert.doesNotMatch(currentCliSource, /rls-policy/);
  assert.doesNotMatch(currentCliSource, /backup-restore/);
  assert.doesNotMatch(currentCliSource, /retention-deletion-job/);
  assert.doesNotMatch(currentCliSource, /import-export-path/);
  assert.doesNotMatch(currentCliSource, /package-persistence/);
  assert.doesNotMatch(currentCliSource, /persistence-runtime/);
  assert.doesNotMatch(currentCliSource, /fabric-storage-runtime/);
  assert.doesNotMatch(currentCliSource, /secure-drop-storage-runtime/);
  assert.doesNotMatch(currentCliSource, /encoded-handoff-storage-runtime/);
  assert.doesNotMatch(currentCliSource, /phase-5-61/);
});
