import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";
import {
  EMBEDDED_DB_QUERY_ENGINE_PRIMITIVE_CONTRACT_BOUNDARY_MAP_SCHEMA,
  createEmbeddedDbQueryEnginePrimitiveContractBoundaryMapForReview
} from "../packages/core/src/index.mjs";

const execFileAsync = promisify(execFile);
const phase576BaselineCommit = "29a7b98534042eed0c3cade1abcf31b62a562247";
const reviewedAt = "2026-07-01T00:00:00.000Z";
const repoRootUrl = new URL("../", import.meta.url);
const repoRoot = fileURLToPath(repoRootUrl);
const cliPath = fileURLToPath(
  new URL("../apps/cli/src/index.mjs", import.meta.url)
);
const packageJsonUrl = new URL("../package.json", import.meta.url);
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-76/embedded-db-query-engine-primitive-contract-boundary-map.json",
  import.meta.url
);

const expectedCaseClassifications = Object.freeze({
  "valid-embedded-db-query-engine-primitive-contract-boundary-map":
    "valid_embedded_db_query_engine_primitive_contract_boundary_map_runtime_still_blocked",
  "malformed-embedded-db-query-engine-primitive-contract-boundary-map-input-rejected":
    "malformed_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected",
  "missing-required-embedded-db-query-engine-boundary-entry-rejected":
    "missing_required_embedded_db_query_engine_boundary_entry_rejected",
  "unknown-top-level-field-embedded-db-query-engine-primitive-contract-boundary-map-input-rejected":
    "unknown_top_level_field_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected",
  "unknown-boundary-family-embedded-db-query-engine-primitive-contract-boundary-map-input-rejected":
    "unknown_boundary_family_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected",
  "unknown-related-system-embedded-db-query-engine-primitive-contract-boundary-map-input-rejected":
    "unknown_related_system_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected",
  "unknown-current-status-embedded-db-query-engine-primitive-contract-boundary-map-input-rejected":
    "unknown_current_status_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected",
  "authorization-flags-enabled-embedded-db-query-engine-primitive-contract-boundary-map-input-rejected":
    "authorization_flags_enabled_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected",
  "report-runs-checks-true-embedded-db-query-engine-primitive-contract-boundary-map-input-rejected":
    "report_runs_checks_true_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected",
  "runtime-authorization-attempt-embedded-db-query-engine-primitive-contract-boundary-map-input-rejected":
    "runtime_authorization_attempt_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected",
  "command-exposure-attempt-embedded-db-query-engine-primitive-contract-boundary-map-input-rejected":
    "command_exposure_attempt_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected",
  "blocked-cli-bypass-attempt-embedded-db-query-engine-primitive-contract-boundary-map-input-rejected":
    "blocked_cli_bypass_attempt_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected",
  "hidden-sqlite-embedded-db-query-runtime-semantics-embedded-db-query-engine-primitive-contract-boundary-map-input-rejected":
    "hidden_sqlite_embedded_db_query_runtime_semantics_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected",
  "hidden-database-file-page-parsing-semantics-embedded-db-query-engine-primitive-contract-boundary-map-input-rejected":
    "hidden_database_file_page_parsing_semantics_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected",
  "hidden-sql-query-execution-semantics-embedded-db-query-engine-primitive-contract-boundary-map-input-rejected":
    "hidden_sql_query_execution_semantics_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected",
  "hidden-btree-index-traversal-semantics-embedded-db-query-engine-primitive-contract-boundary-map-input-rejected":
    "hidden_btree_index_traversal_semantics_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected",
  "hidden-transaction-wal-migration-semantics-embedded-db-query-engine-primitive-contract-boundary-map-input-rejected":
    "hidden_transaction_wal_migration_semantics_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected",
  "hidden-storage-cache-read-write-semantics-embedded-db-query-engine-primitive-contract-boundary-map-input-rejected":
    "hidden_storage_cache_read_write_semantics_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected",
  "hidden-filesystem-access-semantics-embedded-db-query-engine-primitive-contract-boundary-map-input-rejected":
    "hidden_filesystem_access_semantics_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected",
  "hidden-auth-session-token-api-key-semantics-embedded-db-query-engine-primitive-contract-boundary-map-input-rejected":
    "hidden_auth_session_token_api_key_semantics_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected",
  "hidden-connector-grant-semantics-embedded-db-query-engine-primitive-contract-boundary-map-input-rejected":
    "hidden_connector_grant_semantics_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected",
  "hidden-fabric-fabric-core-transport-runtime-semantics-embedded-db-query-engine-primitive-contract-boundary-map-input-rejected":
    "hidden_fabric_fabric_core_transport_runtime_semantics_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected",
  "hidden-content-addressed-chunked-resumable-p2p-transport-semantics-embedded-db-query-engine-primitive-contract-boundary-map-input-rejected":
    "hidden_content_addressed_chunked_resumable_p2p_transport_semantics_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected",
  "hidden-matrix-gateway-runtime-semantics-embedded-db-query-engine-primitive-contract-boundary-map-input-rejected":
    "hidden_matrix_gateway_runtime_semantics_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected",
  "hidden-shell-command-runtime-semantics-embedded-db-query-engine-primitive-contract-boundary-map-input-rejected":
    "hidden_shell_command_runtime_semantics_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected",
  "hidden-secure-drop-implementation-semantics-embedded-db-query-engine-primitive-contract-boundary-map-input-rejected":
    "hidden_secure_drop_implementation_semantics_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected",
  "hidden-backend-api-server-semantics-embedded-db-query-engine-primitive-contract-boundary-map-input-rejected":
    "hidden_backend_api_server_semantics_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected",
  "hidden-logger-audit-transcript-telemetry-external-sink-semantics-embedded-db-query-engine-primitive-contract-boundary-map-input-rejected":
    "hidden_logger_audit_transcript_telemetry_external_sink_semantics_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected",
  "unsafe-embedded-db-query-engine-primitive-runtime-flags-embedded-db-query-engine-primitive-contract-boundary-map-input-rejected":
    "unsafe_embedded_db_query_engine_primitive_runtime_flags_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected",
  "nested-unsafe-flags-embedded-db-query-engine-primitive-contract-boundary-map-input-rejected":
    "nested_unsafe_flags_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected",
  "noncanonical-embedded-db-query-engine-primitive-contract-boundary-map-input-rejected":
    "noncanonical_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected"
});

const expectedBoundaryFamilies = Object.freeze([
  "embedded_db_contract",
  "sqlite_reference_boundary",
  "database_file_format_contract",
  "page_header_contract",
  "schema_metadata_contract",
  "table_metadata_contract",
  "sql_parser_contract",
  "read_only_query_contract",
  "select_query_contract",
  "where_filter_contract",
  "full_table_scan_contract",
  "index_lookup_contract",
  "btree_traversal_contract",
  "query_performance_contract",
  "transaction_boundary_contract",
  "wal_boundary_contract",
  "migration_boundary_contract",
  "storage_adapter_boundary",
  "rls_data_isolation_boundary",
  "query_audit_boundary"
]);

const expectedRelatedSystems = Object.freeze([
  "ardyn",
  "ardyn-subagent",
  "locus",
  "multiverse",
  "content-fabric",
  "repo-family",
  "external-harness",
  "codecrafters-sqlite-reference",
  "fabric-core-reference"
]);

const expectedStatusValues = Object.freeze([
  "metadata_only",
  "blocked",
  "future_contract_required"
]);

const commandProbes = Object.freeze([
  "embedded-db-query-engine-primitive-contract-boundary-map",
  "sqlite-runtime",
  "embedded-db-reader",
  "database-client",
  "dbinfo-runtime",
  "tables-runtime",
  "sql-parser-runtime",
  "query-executor",
  "select-query-runtime",
  "where-filter-runtime",
  "full-table-scan-runtime",
  "index-lookup-runtime",
  "btree-traversal-runtime",
  "wal-runtime",
  "migration-runner",
  "storage-adapter-runtime",
  "query-audit-writer",
  "shell-runtime",
  "fabric-core-transport-runtime"
]);

const unsafeFlagCases = Object.freeze([
  "runtimeExecutionEnabled",
  "connectorGrantProduced",
  "fabricRuntimeImplementedByArdyn",
  "websocketHttpTransportImplementedByArdyn",
  "httpTransportImplementedByArdyn",
  "mcpRuntimeEnabled",
  "taskExecutionEnabled",
  "secureDropImplemented",
  "serviceDiscoveryEnabled",
  "schedulePollingEnabled",
  "filesystemAccessEnabled",
  "filesystemReadEnabled",
  "filesystemWriteEnabled",
  "processControlEnabled",
  "sqliteRuntimeEnabled",
  "embeddedDbReaderEnabled",
  "databaseClientImplemented",
  "databaseFileParserEnabled",
  "pageParserEnabled",
  "sqlParserRuntimeEnabled",
  "queryExecutorEnabled",
  "tableScanEnabled",
  "indexLookupEnabled",
  "btreeTraversalEnabled",
  "transactionWalRuntimeEnabled",
  "walRuntimeEnabled",
  "migrationSchemaChangeEnabled",
  "storageAdapterImplemented",
  "dbReadWriteEnabled",
  "cacheRuntimeEnabled",
  "rlsRuntimeImplemented",
  "queryAuditWriterImplemented",
  "shellRuntimeEnabled",
  "matrixClientRuntimeEnabled",
  "fabricCoreTransportRuntimeEnabled",
  "contentAddressedTransportEnabled",
  "chunkedTransferEnabled",
  "resumableTransferEnabled",
  "multiSourceTransferEnabled",
  "bittorrentDhtSwarmP2pEnabled",
  "largePayloadTransferRuntimeEnabled",
  "backendRuntimeImplementedByArdyn",
  "loggerRuntimeImplemented",
  "auditWriterRuntimeImplemented",
  "telemetryClientImplemented",
  "healthCheckRuntimeImplemented",
  "encodedHandoffRuntimeImplementedByArdyn",
  "codecRuntimeEnabled",
  "translatorRuntimeEnabled"
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
  const valid =
    createEmbeddedDbQueryEnginePrimitiveContractBoundaryMapForReview({
      reviewedAt
    });
  const runtimeFlagNames = Object.keys(
    valid.boundaryEntries[0].unsafeEmbeddedDbQueryEnginePrimitiveRuntimeFlags
  );

  assert.equal(result.reviewOnly, true);
  assert.equal(result.metadataOnly, true);
  assert.equal(result.authoritative, false);
  assert.equal(result.nonAuthorizingProof, true);
  assert.equal(result.reportRunsChecks, false);
  for (const key of runtimeFlagNames) {
    assert.equal(result[key], false, `${key} should stay false`);
  }
  assertAllFalse(result.runtimeEffect);
}

function withBoundaryEntries(mutator) {
  const valid =
    createEmbeddedDbQueryEnginePrimitiveContractBoundaryMapForReview({
      reviewedAt
    });
  const boundaryEntries = structuredClone(valid.boundaryEntries);
  mutator(boundaryEntries);
  return { reviewedAt, boundaryEntries };
}

test("Phase 5.76 embedded DB/query-engine fixture is deterministic", async () => {
  const fixture = await readFixture();
  const generated =
    createEmbeddedDbQueryEnginePrimitiveContractBoundaryMapForReview({
      reviewedAt
    });

  assert.deepEqual(fixture, generated);
  assert.equal(
    fixture.schema,
    EMBEDDED_DB_QUERY_ENGINE_PRIMITIVE_CONTRACT_BOUNDARY_MAP_SCHEMA
  );
  assert.equal(
    fixture.classification,
    expectedCaseClassifications[
      "valid-embedded-db-query-engine-primitive-contract-boundary-map"
    ]
  );
  assert.equal(
    fixture.embeddedDbQueryEnginePrimitiveContractBoundaryMapProduced,
    true
  );
  assert.equal(fixture.reviewedAt, reviewedAt);
  assertNonAuthorizing(fixture);
});

test("Phase 5.76 covers requested embedded DB/query-engine boundaries", async () => {
  const fixture = await readFixture();
  const summary = fixture.boundaryMapSummary;

  assert.equal(summary.boundaryEntryCount, expectedBoundaryFamilies.length);
  assert.deepEqual(summary.boundaryFamilies, expectedBoundaryFamilies);
  assert.deepEqual(summary.relatedSystems, expectedRelatedSystems);
  assert.deepEqual(summary.currentStatusValues, expectedStatusValues);
  assert.deepEqual(Object.keys(summary.countByFamily), expectedBoundaryFamilies);
  assert.deepEqual(
    Object.keys(summary.countByRelatedSystem),
    expectedRelatedSystems
  );
  assert.deepEqual(Object.keys(summary.countByStatus), expectedStatusValues);

  for (const family of expectedBoundaryFamilies) {
    assert.equal(summary.countByFamily[family], 1, `${family} recorded once`);
  }
  for (const system of expectedRelatedSystems) {
    assert.ok(summary.countByRelatedSystem[system] >= 1, `${system} covered`);
  }
  for (const status of expectedStatusValues) {
    assert.ok(summary.countByStatus[status] >= 1, `${status} covered`);
  }

  assert.equal(summary.sqliteReferenceBoundaryRecorded, true);
  assert.equal(summary.databaseFileFormatBoundaryRecorded, true);
  assert.equal(summary.pageHeaderBoundaryRecorded, true);
  assert.equal(summary.schemaTableMetadataBoundaryRecorded, true);
  assert.equal(summary.dbinfoStyleMetadataInspectionBoundaryRecorded, true);
  assert.equal(summary.tablesStyleTableListingBoundaryRecorded, true);
  assert.equal(summary.selectCountBoundaryRecorded, true);
  assert.equal(summary.singleColumnSelectBoundaryRecorded, true);
  assert.equal(summary.multiColumnSelectBoundaryRecorded, true);
  assert.equal(summary.whereFilterBoundaryRecorded, true);
  assert.equal(summary.fullTableScanBoundaryRecorded, true);
  assert.equal(summary.indexLookupBoundaryRecorded, true);
  assert.equal(summary.btreeTraversalBoundaryRecorded, true);
  assert.equal(summary.transactionWalBoundaryRecorded, true);
  assert.equal(summary.storageAdapterBoundaryRecorded, true);
  assert.equal(summary.rlsDataIsolationBoundaryRecorded, true);
  assert.equal(summary.queryAuditBoundaryRecorded, true);
  assert.equal(summary.embeddedDbKeyCredentialBoundaryReferenced, true);
  assert.equal(summary.databaseStoragePersistenceBoundaryReferenced, true);
  assert.equal(summary.shellCommandSurfaceRelationshipBoundaryReferenced, true);
  assert.equal(
    summary.fabricCoreLargePayloadMetadataRelationshipBoundaryReferenced,
    true
  );

  for (const entry of fixture.boundaryEntries) {
    assert.match(entry.boundaryId, /^phase5-76\./);
    assert.ok(expectedBoundaryFamilies.includes(entry.boundaryFamily));
    assert.ok(expectedRelatedSystems.includes(entry.relatedSystem));
    assert.ok(expectedStatusValues.includes(entry.currentStatus));
    assert.ok(Array.isArray(entry.allowedCurrentBehavior));
    assert.ok(Array.isArray(entry.forbiddenCurrentBehavior));
    assert.equal(entry.embeddedDbQueryEnginePrimitiveBoundaryMetadataOnly, true);
    assert.equal(entry.noLiveEmbeddedDbQueryEngineRuntimePerformed, true);
    assert.equal(entry.nonAuthorizingProof, true);
    assertAllFalse(entry.explicitBlockedAuthorizationFlags);
    assertAllFalse(entry.unsafeEmbeddedDbQueryEnginePrimitiveRuntimeFlags);
    assertAllFalse(entry.runtimeEffect);
    assert.equal(
      entry.phase561DatabaseStorageReference.databaseStorageRuntimeAuthorized,
      false
    );
    assert.equal(entry.phase563RlsDataIsolationReference.rlsRuntimeAuthorized, false);
    assert.equal(entry.phase565AuditLoggingReference.queryAuditWriterAuthorized, false);
    assert.equal(entry.phase566BackupRecoveryReference.backupJobAuthorized, false);
    assert.equal(
      entry.phase567RetentionDeletionExportReference.retentionJobAuthorized,
      false
    );
    assert.equal(
      entry.phase575FabricCoreConsumerReference.fabricCoreTransportAuthorized,
      false
    );
  }

  const allText = JSON.stringify(fixture);
  assert.match(allText, /\.dbinfo/);
  assert.match(allText, /\.tables/);
  assert.match(allText, /SELECT COUNT\(\*\)/);
  assert.match(allText, /single-column SELECT/);
  assert.match(allText, /multi-column SELECT/);
  assert.match(allText, /WHERE/);
  assert.match(allText, /CodeCrafters SQLite/);
  assert.match(allText, /codecrafters-io\/build-your-own-sqlite/);
  assert.match(allText, /fabric-core large-payload metadata/);
});

test("Phase 5.76 invalid embedded DB/query-engine cases fail closed", () => {
  const cases = [
    {
      name: "malformed-embedded-db-query-engine-primitive-contract-boundary-map-input-rejected",
      input: null
    },
    {
      name: "malformed-embedded-db-query-engine-primitive-contract-boundary-map-input-rejected",
      input: { reviewedAt: "not-a-date" }
    },
    {
      name: "missing-required-embedded-db-query-engine-boundary-entry-rejected",
      input: withBoundaryEntries((entries) => {
        delete entries[0].databaseFileFormatExpectation;
      })
    },
    {
      name: "unknown-top-level-field-embedded-db-query-engine-primitive-contract-boundary-map-input-rejected",
      input: { reviewedAt, sqliteRuntimeCommentary: false }
    },
    {
      name: "unknown-boundary-family-embedded-db-query-engine-primitive-contract-boundary-map-input-rejected",
      input: withBoundaryEntries((entries) => {
        entries[0].boundaryFamily = "unknown_family";
      })
    },
    {
      name: "unknown-related-system-embedded-db-query-engine-primitive-contract-boundary-map-input-rejected",
      input: withBoundaryEntries((entries) => {
        entries[0].relatedSystem = "unknown-system";
      })
    },
    {
      name: "unknown-current-status-embedded-db-query-engine-primitive-contract-boundary-map-input-rejected",
      input: withBoundaryEntries((entries) => {
        entries[0].currentStatus = "runtime_enabled";
      })
    },
    {
      name: "authorization-flags-enabled-embedded-db-query-engine-primitive-contract-boundary-map-input-rejected",
      input: withBoundaryEntries((entries) => {
        entries[0].explicitBlockedAuthorizationFlags.sqliteRuntimeAuthorizationGranted =
          true;
      })
    },
    {
      name: "report-runs-checks-true-embedded-db-query-engine-primitive-contract-boundary-map-input-rejected",
      input: { reviewedAt, reportRunsChecks: true }
    },
    {
      name: "runtime-authorization-attempt-embedded-db-query-engine-primitive-contract-boundary-map-input-rejected",
      input: { reviewedAt, authorizesRuntime: true }
    },
    {
      name: "command-exposure-attempt-embedded-db-query-engine-primitive-contract-boundary-map-input-rejected",
      input: { reviewedAt, sqliteCommandExposed: true }
    },
    {
      name: "blocked-cli-bypass-attempt-embedded-db-query-engine-primitive-contract-boundary-map-input-rejected",
      input: { reviewedAt, blockedCliBypassEnabled: true }
    },
    {
      name: "hidden-sqlite-embedded-db-query-runtime-semantics-embedded-db-query-engine-primitive-contract-boundary-map-input-rejected",
      input: { reviewedAt, sqliteRuntime: {} }
    },
    {
      name: "hidden-database-file-page-parsing-semantics-embedded-db-query-engine-primitive-contract-boundary-map-input-rejected",
      input: { reviewedAt, databaseFileParser: {} }
    },
    {
      name: "hidden-sql-query-execution-semantics-embedded-db-query-engine-primitive-contract-boundary-map-input-rejected",
      input: { reviewedAt, sqlParser: {} }
    },
    {
      name: "hidden-btree-index-traversal-semantics-embedded-db-query-engine-primitive-contract-boundary-map-input-rejected",
      input: { reviewedAt, btreeTraversal: {} }
    },
    {
      name: "hidden-transaction-wal-migration-semantics-embedded-db-query-engine-primitive-contract-boundary-map-input-rejected",
      input: { reviewedAt, walRuntime: {} }
    },
    {
      name: "hidden-storage-cache-read-write-semantics-embedded-db-query-engine-primitive-contract-boundary-map-input-rejected",
      input: { reviewedAt, storageAdapter: {} }
    },
    {
      name: "hidden-filesystem-access-semantics-embedded-db-query-engine-primitive-contract-boundary-map-input-rejected",
      input: { reviewedAt, filesystemRead: {} }
    },
    {
      name: "hidden-auth-session-token-api-key-semantics-embedded-db-query-engine-primitive-contract-boundary-map-input-rejected",
      input: { reviewedAt, apiKey: {} }
    },
    {
      name: "hidden-connector-grant-semantics-embedded-db-query-engine-primitive-contract-boundary-map-input-rejected",
      input: { reviewedAt, connectorGrant: {} }
    },
    {
      name: "hidden-fabric-fabric-core-transport-runtime-semantics-embedded-db-query-engine-primitive-contract-boundary-map-input-rejected",
      input: { reviewedAt, fabricCoreTransportRuntime: {} }
    },
    {
      name: "hidden-content-addressed-chunked-resumable-p2p-transport-semantics-embedded-db-query-engine-primitive-contract-boundary-map-input-rejected",
      input: { reviewedAt, contentAddressedTransport: {} }
    },
    {
      name: "hidden-matrix-gateway-runtime-semantics-embedded-db-query-engine-primitive-contract-boundary-map-input-rejected",
      input: { reviewedAt, matrixClientRuntime: {} }
    },
    {
      name: "hidden-shell-command-runtime-semantics-embedded-db-query-engine-primitive-contract-boundary-map-input-rejected",
      input: { reviewedAt, shellRuntime: {} }
    },
    {
      name: "hidden-secure-drop-implementation-semantics-embedded-db-query-engine-primitive-contract-boundary-map-input-rejected",
      input: { reviewedAt, secureDropRuntime: {} }
    },
    {
      name: "hidden-backend-api-server-semantics-embedded-db-query-engine-primitive-contract-boundary-map-input-rejected",
      input: { reviewedAt, apiServer: {} }
    },
    {
      name: "hidden-logger-audit-transcript-telemetry-external-sink-semantics-embedded-db-query-engine-primitive-contract-boundary-map-input-rejected",
      input: { reviewedAt, queryAuditWriter: {} }
    },
    {
      name: "unsafe-embedded-db-query-engine-primitive-runtime-flags-embedded-db-query-engine-primitive-contract-boundary-map-input-rejected",
      input: { reviewedAt, runtimeExecutionEnabled: true }
    },
    {
      name: "nested-unsafe-flags-embedded-db-query-engine-primitive-contract-boundary-map-input-rejected",
      input: { reviewedAt, runtimeEffect: { runtimeEnabled: true } }
    },
    {
      name: "noncanonical-embedded-db-query-engine-primitive-contract-boundary-map-input-rejected",
      input: withBoundaryEntries((entries) => {
        entries[0].boundaryId = "phase5-76.modified.noncanonical";
      })
    }
  ];

  for (const { name, input } of cases) {
    const result =
      createEmbeddedDbQueryEnginePrimitiveContractBoundaryMapForReview(input);
    assert.equal(result.classification, expectedCaseClassifications[name], name);
    assert.equal(
      result.embeddedDbQueryEnginePrimitiveContractBoundaryMapProduced,
      false,
      name
    );
    assert.equal(result.boundaryEntries.length, 0, name);
    assertNonAuthorizing(result);
  }
});

test("Phase 5.76 enabled runtime flags cannot authorize DB/query behavior", () => {
  for (const flag of unsafeFlagCases) {
    const result =
      createEmbeddedDbQueryEnginePrimitiveContractBoundaryMapForReview({
        reviewedAt,
        [flag]: true
      });

    assert.equal(
      result.classification,
      expectedCaseClassifications[
        "unsafe-embedded-db-query-engine-primitive-runtime-flags-embedded-db-query-engine-primitive-contract-boundary-map-input-rejected"
      ],
      flag
    );
    assert.equal(
      result.embeddedDbQueryEnginePrimitiveContractBoundaryMapProduced,
      false,
      flag
    );
    assertNonAuthorizing(result);
  }
});

test("Phase 5.76 boundary map stays non-authorizing and runtime-blocked", async () => {
  const fixture = await readFixture();

  assert.equal(fixture.reviewOnly, true);
  assert.equal(fixture.metadataOnly, true);
  assert.equal(fixture.authoritative, false);
  assert.equal(fixture.reportRunsChecks, false);
  assert.equal(fixture.nonAuthorizingProof, true);
  assert.equal(fixture.sqliteRuntimeEnabled, false);
  assert.equal(fixture.embeddedDbReaderEnabled, false);
  assert.equal(fixture.databaseClientImplemented, false);
  assert.equal(fixture.databaseFileParserEnabled, false);
  assert.equal(fixture.pageParserEnabled, false);
  assert.equal(fixture.sqlParserRuntimeEnabled, false);
  assert.equal(fixture.queryExecutorEnabled, false);
  assert.equal(fixture.tableScanEnabled, false);
  assert.equal(fixture.indexLookupEnabled, false);
  assert.equal(fixture.btreeTraversalEnabled, false);
  assert.equal(fixture.transactionWalRuntimeEnabled, false);
  assert.equal(fixture.migrationSchemaChangeEnabled, false);
  assert.equal(fixture.storageAdapterImplemented, false);
  assert.equal(fixture.dbReadWriteEnabled, false);
  assert.equal(fixture.filesystemAccessEnabled, false);
  assert.equal(fixture.rlsRuntimeImplemented, false);
  assert.equal(fixture.queryAuditWriterImplemented, false);
  assert.equal(fixture.shellRuntimeEnabled, false);
  assert.equal(fixture.fabricCoreTransportRuntimeEnabled, false);
  assert.equal(fixture.secureDropImplemented, false);
  assert.equal(fixture.backendRuntimeImplementedByArdyn, false);
  assert.equal(fixture.commandExposureEnabled, false);
  assert.equal(fixture.blockedCliBypassEnabled, false);
  assertNonAuthorizing(fixture);
});

test("serve-runtime remains default-blocked and dry-run cannot bypass Phase 5.76", async () => {
  for (const args of [["serve-runtime"], ["serve-runtime", "--dry-run"]]) {
    const error = await expectCliFailure(args);
    assert.notEqual(error.code, 0);
    assert.equal(error.stdout, "");
    assert.match(error.stderr, /Runtime unavailable/);
  }
});

test("Phase 5.76 embedded DB/query command names remain rejected", async () => {
  for (const command of commandProbes) {
    const error = await expectCliFailure([command]);
    assert.notEqual(error.code, 0, command);
    assert.equal(error.stdout, "", command);
  }
});

test("Phase 5.76 does not change CLI, Rust, Fabric, package, or dependency source", async () => {
  const files = [
    "apps/cli/src/index.mjs",
    "crates/ardyn-host/src/lib.rs",
    "crates/ardyn-host/src/stdio_runtime/mod.rs",
    "packages/fabric/src/index.mjs",
    "package.json",
    "package-lock.json",
    "Cargo.toml",
    "Cargo.lock"
  ];

  for (const file of files) {
    const [baseline, current] = await Promise.all([
      execFileAsync("git", ["show", `${phase576BaselineCommit}:${file}`], {
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
    "sqlite3",
    "better-sqlite3",
    "sql.js",
    "@sqlite.org/sqlite-wasm",
    "@multiverse/fabric-core"
  ]) {
    assert.equal(Object.hasOwn(dependencies, dependency), false, dependency);
  }

  const currentCliSource = await readFile(cliPath, "utf8");
  for (const command of commandProbes) {
    assert.doesNotMatch(currentCliSource, new RegExp(command));
  }
});
