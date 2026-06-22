import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";
import {
  FABRIC_AWARE_API_BACKEND_CONTRACT_BOUNDARY_MAP_SCHEMA,
  createFabricAwareApiBackendContractBoundaryMapForReview
} from "../packages/core/src/index.mjs";

const execFileAsync = promisify(execFile);
const phase559BaselineCommit = "92109013c8198d5eeaa1f257c5201773b3cdf7d1";
const reviewedAt = "2026-06-22T00:00:00.000Z";
const repoRootUrl = new URL("../", import.meta.url);
const repoRoot = fileURLToPath(repoRootUrl);
const cliPath = fileURLToPath(new URL("../apps/cli/src/index.mjs", import.meta.url));
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-59/fabric-aware-api-backend-contract-boundary-map.json",
  import.meta.url
);

const expectedCaseClassifications = Object.freeze({
  "valid-fabric-aware-api-backend-contract-boundary-map":
    "valid_fabric_aware_api_backend_contract_boundary_map_runtime_still_blocked",
  "malformed-fabric-aware-api-backend-contract-boundary-map-input-rejected":
    "malformed_fabric_aware_api_backend_contract_boundary_map_input_rejected",
  "missing-required-fabric-aware-api-backend-contract-boundary-entry-rejected":
    "missing_required_fabric_aware_api_backend_contract_boundary_entry_rejected",
  "unknown-boundary-family-fabric-aware-api-backend-contract-boundary-map-input-rejected":
    "unknown_boundary_family_fabric_aware_api_backend_contract_boundary_map_input_rejected",
  "unknown-related-consumer-repo-fabric-aware-api-backend-contract-boundary-map-input-rejected":
    "unknown_related_consumer_repo_fabric_aware_api_backend_contract_boundary_map_input_rejected",
  "unknown-current-status-fabric-aware-api-backend-contract-boundary-map-input-rejected":
    "unknown_current_status_fabric_aware_api_backend_contract_boundary_map_input_rejected",
  "authorization-flags-enabled-fabric-aware-api-backend-contract-boundary-map-input-rejected":
    "authorization_flags_enabled_fabric_aware_api_backend_contract_boundary_map_input_rejected",
  "hidden-backend-server-api-fabric-bus-broker-transport-adapter-connector-registry-task-import-export-package-persistence-runtime-semantics-fabric-aware-api-backend-contract-boundary-map-input-rejected":
    "hidden_backend_server_api_fabric_bus_broker_transport_adapter_connector_registry_task_import_export_package_persistence_runtime_semantics_fabric_aware_api_backend_contract_boundary_map_input_rejected",
  "secure-drop-implementation-semantics-fabric-aware-api-backend-contract-boundary-map-input-rejected":
    "secure_drop_implementation_semantics_fabric_aware_api_backend_contract_boundary_map_input_rejected",
  "backend-server-api-fabric-bus-broker-transport-adapter-connector-registry-task-import-export-package-persistence-runtime-implementation-semantics-fabric-aware-api-backend-contract-boundary-map-input-rejected":
    "backend_server_api_fabric_bus_broker_transport_adapter_connector_registry_task_import_export_package_persistence_runtime_implementation_semantics_fabric_aware_api_backend_contract_boundary_map_input_rejected",
  "unsafe-backend-server-api-fabric-bus-broker-transport-adapter-connector-registry-task-import-export-package-persistence-runtime-flags-fabric-aware-api-backend-contract-boundary-map-input-rejected":
    "unsafe_backend_server_api_fabric_bus_broker_transport_adapter_connector_registry_task_import_export_package_persistence_runtime_flags_fabric_aware_api_backend_contract_boundary_map_input_rejected",
  "nested-unsafe-flags-fabric-aware-api-backend-contract-boundary-map-input-rejected":
    "nested_unsafe_flags_fabric_aware_api_backend_contract_boundary_map_input_rejected",
  "noncanonical-fabric-aware-api-backend-contract-boundary-map-input-rejected":
    "noncanonical_fabric_aware_api_backend_contract_boundary_map_input_rejected"
});

const expectedBoundaryIds = Object.freeze([
  "phase5-59.ardyn.manifest-schema-validation.api-contract-boundary",
  "phase5-59.ardyn.review-artifact.api-contract-boundary",
  "phase5-59.ardyn.approval-prerequisite.backend-contract-boundary",
  "phase5-59.ardyn.display-conformance.consumer-boundary",
  "phase5-59.ardyn.future-api-surface.api-contract-boundary",
  "phase5-59.ardyn.future-backend-service.backend-contract-boundary",
  "phase5-59.locus.display-status.fabric-coordination-boundary",
  "phase5-59.locus.future-control-surface.fabric-coordination-boundary",
  "phase5-59.multiverse.world-project-orchestration.fabric-coordination-boundary",
  "phase5-59.multiverse.citizen-adapter-candidate.fabric-coordination-boundary",
  "phase5-59.content-fabric.future-secure-drop-reference.fabric-coordination-boundary",
  "phase5-59.repo-family.coordination-envelope.fabric-coordination-boundary"
]);

const commandProbes = Object.freeze([
  "fabric-aware-api-backend-contract-boundary-map",
  "create-fabric-aware-api-backend-contract-boundary-map",
  "phase-5-59-fabric-aware-api-backend-boundary-map",
  "backend-api-runtime",
  "api-endpoint-server",
  "fabric-runtime-bus",
  "fabric-broker",
  "fabric-transport",
  "adapter-runtime",
  "connector-grant",
  "registry-connection",
  "task-execution",
  "import-export-path",
  "package-distribution",
  "secure-drop-runtime"
]);

const nonAuthorizingResultFields = Object.freeze([
  "backendRuntimeImplementedByArdyn",
  "serverImplementedByArdyn",
  "apiEndpointImplementedByArdyn",
  "endpointImplementedByArdyn",
  "httpServerImplementedByArdyn",
  "websocketHttpTransportImplementedByArdyn",
  "fabricRuntimeImplementedByArdyn",
  "fabricBusBrokerTransportImplementedByArdyn",
  "adapterRuntimeImplementedByArdyn",
  "connectorGrantProduced",
  "registryConnectionImplementedByArdyn",
  "liveRegistryConnectionEnabled",
  "taskExecutionImplementedByArdyn",
  "taskExecutionEnabled",
  "importExportPathImplementedByArdyn",
  "packageDistributionImplementedByArdyn",
  "packageWriterImplementedByArdyn",
  "packageReaderImplementedByArdyn",
  "packagePersistenceImplementedByArdyn",
  "persistenceImplementedByArdyn",
  "resultCollectorImplementedByArdyn",
  "resultValidatorImplementedByArdyn",
  "reviewRouterImplementedByArdyn",
  "evaluatorImplementedByArdyn",
  "evaluatorExecutionPerformed",
  "approvalPathImplementedByArdyn",
  "approvalDecisionProducedByArdyn",
  "approvalGrantProducedByArdyn",
  "commandExposureEnabled",
  "commandRuntimeControlEnabled",
  "runtimeExecutionEnabled",
  "databaseStorageRuntimeWritesEnabled",
  "secretsRuntimeIngestionEnabled",
  "mcpToolExposureEnabled",
  "secureDropImplemented",
  "secureDropCryptoImplemented",
  "secureDropTransportImplemented",
  "secureDropStegoImplemented",
  "secureDropSendReceiveImplemented",
  "secureDropInboxPollingEnabled",
  "fileSelectionEnabled",
  "connectorIngestionAdded",
  "secretVaultEnvAccessEnabled",
  "st3ggVendored",
  "serviceDiscoveryEnabled",
  "scheduleEnforcementEnabled",
  "backgroundPollingEnabled",
  "filesystemScanningEnabled",
  "processControlEnabled",
  "externalLookupsEnabled",
  "uiFrontendBrowserRenderingImplemented"
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
  const [entry] = createFabricAwareApiBackendContractBoundaryMapForReview({
    reviewedAt
  }).boundaryEntries;

  return [{ ...structuredClone(entry), ...patch }];
}

test("Phase 5.59 Fabric-aware API/backend boundary map fixture is deterministic", async () => {
  const fixture = await readFixture();
  const generated = createFabricAwareApiBackendContractBoundaryMapForReview({
    reviewedAt
  });

  assert.equal(
    fixture.schema,
    FABRIC_AWARE_API_BACKEND_CONTRACT_BOUNDARY_MAP_SCHEMA
  );
  assert.deepEqual(fixture, generated);
  assert.equal(
    fixture.classification,
    expectedCaseClassifications[
      "valid-fabric-aware-api-backend-contract-boundary-map"
    ]
  );
  assert.equal(fixture.fabricAwareApiBackendContractBoundaryMapProduced, true);
  assert.equal(fixture.boundaryMapSummary.boundaryEntryCount, 12);
  assert.deepEqual(fixture.boundaryMapSummary.boundaryIds, expectedBoundaryIds);
  assert.deepEqual(fixture.boundaryMapSummary.countByFamily, {
    api_contract: 3,
    backend_contract: 2,
    fabric_coordination: 6,
    consumer_boundary: 1
  });
  assert.deepEqual(fixture.boundaryMapSummary.countByRepo, {
    ardyn: 6,
    locus: 2,
    multiverse: 2,
    "content-fabric": 1,
    "repo-family": 1
  });
});

test("Phase 5.59 references Phase 5.48 API/backend gap and Phase 5.58 display conformance package boundary", async () => {
  const fixture = await readFixture();
  const state = fixture.fabricAwareApiBackendContractBoundaryMap;

  assert.equal(state.sourcePhaseContext.phase548ApiBackendLogicAreaNumber, 2);
  assert.equal(state.sourcePhaseContext.phase548ApiBackendLogicStatus, "deferred");
  assert.match(
    state.sourcePhaseContext.phase548ProductionReadinessCoverageMatrix,
    /phase5-48/
  );
  assert.match(state.sourcePhaseContext.phase558ReviewPackageBoundary, /phase5-58/);
  assert.equal(
    state.sourcePhaseContext.fabricDesignRepresentedAsFutureContractEnvelopeOnly,
    true
  );
  assert.equal(state.sourcePhaseContext.secureDropCanonicalOwner, "content-fabric");
  assert.equal(fixture.boundaryMapSummary.phase548ApiBackendCoverageItemRepresented, true);
  assert.equal(
    fixture.boundaryMapSummary.phase558DisplayConformanceReviewPackageBoundaryReferenced,
    true
  );
});

test("Phase 5.59 invalid Fabric-aware API/backend boundary cases fail closed", () => {
  const canonicalEntries =
    createFabricAwareApiBackendContractBoundaryMapForReview({
      reviewedAt
    }).boundaryEntries;
  const firstEntry = structuredClone(canonicalEntries[0]);
  const missingFieldEntry = structuredClone(firstEntry);

  delete missingFieldEntry.boundaryId;

  const cases = [
    {
      name: "malformed-fabric-aware-api-backend-contract-boundary-map-input-rejected",
      input: null
    },
    {
      name: "malformed-fabric-aware-api-backend-contract-boundary-map-input-rejected",
      input: { reviewedAt: "not-a-timestamp" }
    },
    {
      name:
        "missing-required-fabric-aware-api-backend-contract-boundary-entry-rejected",
      input: { reviewedAt, boundaryEntries: [missingFieldEntry] }
    },
    {
      name:
        "unknown-boundary-family-fabric-aware-api-backend-contract-boundary-map-input-rejected",
      input: {
        reviewedAt,
        boundaryEntries: boundaryEntryPatch({ boundaryFamily: "runtime_bus" })
      }
    },
    {
      name:
        "unknown-related-consumer-repo-fabric-aware-api-backend-contract-boundary-map-input-rejected",
      input: {
        reviewedAt,
        boundaryEntries: boundaryEntryPatch({ relatedConsumerOrRepo: "jules" })
      }
    },
    {
      name:
        "unknown-current-status-fabric-aware-api-backend-contract-boundary-map-input-rejected",
      input: {
        reviewedAt,
        boundaryEntries: boundaryEntryPatch({ currentStatus: "implemented" })
      }
    },
    {
      name:
        "authorization-flags-enabled-fabric-aware-api-backend-contract-boundary-map-input-rejected",
      input: {
        reviewedAt,
        boundaryEntries: boundaryEntryPatch({
          explicitBlockedAuthorizationFlags: {
            ...firstEntry.explicitBlockedAuthorizationFlags,
            backendRuntimeAuthorizationGranted: true
          }
        })
      }
    },
    {
      name:
        "hidden-backend-server-api-fabric-bus-broker-transport-adapter-connector-registry-task-import-export-package-persistence-runtime-semantics-fabric-aware-api-backend-contract-boundary-map-input-rejected",
      input: {
        reviewedAt,
        boundaryEntries: boundaryEntryPatch({
          serverEndpointUrl: "https://example.invalid/blocked"
        })
      }
    },
    {
      name:
        "secure-drop-implementation-semantics-fabric-aware-api-backend-contract-boundary-map-input-rejected",
      input: {
        reviewedAt,
        boundaryEntries: boundaryEntryPatch({ secureDropCryptoImplemented: true })
      }
    },
    {
      name:
        "backend-server-api-fabric-bus-broker-transport-adapter-connector-registry-task-import-export-package-persistence-runtime-implementation-semantics-fabric-aware-api-backend-contract-boundary-map-input-rejected",
      input: {
        reviewedAt,
        boundaryEntries: boundaryEntryPatch({ apiEndpointImplemented: true })
      }
    },
    {
      name:
        "unsafe-backend-server-api-fabric-bus-broker-transport-adapter-connector-registry-task-import-export-package-persistence-runtime-flags-fabric-aware-api-backend-contract-boundary-map-input-rejected",
      input: {
        reviewedAt,
        boundaryEntries: boundaryEntryPatch({
          unsafeBackendServerApiFabricBusBrokerTransportAdapterConnectorRegistryTaskImportExportPackagePersistenceRuntimeFlags:
            {
              ...firstEntry
                .unsafeBackendServerApiFabricBusBrokerTransportAdapterConnectorRegistryTaskImportExportPackagePersistenceRuntimeFlags,
              fabricRuntimeEnabled: true
            }
        })
      }
    },
    {
      name: "nested-unsafe-flags-fabric-aware-api-backend-contract-boundary-map-input-rejected",
      input: {
        reviewedAt,
        boundaryEntries: boundaryEntryPatch({
          runtimeEffect: {
            ...firstEntry.runtimeEffect,
            runtimeExecutionEnabled: true
          }
        })
      }
    },
    {
      name:
        "noncanonical-fabric-aware-api-backend-contract-boundary-map-input-rejected",
      input: { reviewedAt, boundaryEntries: [...canonicalEntries].reverse() }
    }
  ];

  for (const { name, input } of cases) {
    const result = createFabricAwareApiBackendContractBoundaryMapForReview(input);

    assert.equal(result.classification, expectedCaseClassifications[name], name);
    assert.equal(result.fabricAwareApiBackendContractBoundaryMapProduced, false);
    assert.equal(result.fabricAwareApiBackendContractBoundaryMap, null);
    assertNonAuthorizing(result);
  }
});

test("Phase 5.59 boundary entries cover required families, repos, and blocked semantics", async () => {
  const fixture = await readFixture();
  const families = new Set();
  const repos = new Set();
  const statuses = new Set();

  for (const entry of fixture.boundaryEntries) {
    families.add(entry.boundaryFamily);
    repos.add(entry.relatedConsumerOrRepo);
    statuses.add(entry.currentStatus);
    assert.match(entry.boundaryId, /^phase5-59\./);
    assert.equal(entry.fabricBoundaryMetadataOnly, true);
    assert.equal(entry.apiBackendBoundaryMetadataOnly, true);
    assert.equal(entry.nonAuthorizingProof, true);
    assert.ok(entry.allowedCurrentBehavior.length >= 2);
    assert.ok(entry.forbiddenCurrentBehavior.includes("websocket/http transport"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("Fabric runtime bus"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("package distribution"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("command exposure"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("service discovery"));
    assert.equal(entry.productionReadinessAreaReference.areaNumber, 2);
    assert.equal(entry.productionReadinessAreaReference.authorizesRuntime, false);
    assert.equal(
      entry.phase558ReviewPackageBoundaryReference.displayConformanceChainReferenced,
      true
    );
    assert.equal(entry.phase558ReviewPackageBoundaryReference.importsPackages, false);
    assert.equal(entry.phase558ReviewPackageBoundaryReference.exportsPackages, false);
    assertAllFalse(entry.explicitBlockedAuthorizationFlags);
    assertAllFalse(
      entry
        .unsafeBackendServerApiFabricBusBrokerTransportAdapterConnectorRegistryTaskImportExportPackagePersistenceRuntimeFlags
    );
    assertAllFalse(entry.runtimeEffect);
  }

  assert.deepEqual([...families].sort(), [
    "api_contract",
    "backend_contract",
    "consumer_boundary",
    "fabric_coordination"
  ]);
  assert.deepEqual([...repos].sort(), [
    "ardyn",
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

  const contentFabricEntry = fixture.boundaryEntries.find(
    (entry) => entry.relatedConsumerOrRepo === "content-fabric"
  );

  assert.ok(contentFabricEntry);
  assert.equal(contentFabricEntry.contentFabricCanonicalSecureDropOwnerOnly, true);
  assert.match(contentFabricEntry.secureDropRoleDescription, /content-fabric/);
});

test("Phase 5.59 boundary map stays non-authorizing and runtime-blocked", async () => {
  const fixture = await readFixture();
  const summary = fixture.boundaryMapSummary;

  assert.equal(summary.fabricFutureCoordinationContractEnvelopeOnly, true);
  assert.equal(summary.fabricRuntimeImplementedByArdyn, false);
  assert.equal(summary.fabricBusBrokerTransportImplementedByArdyn, false);
  assert.equal(summary.backendRuntimeImplementedByArdyn, false);
  assert.equal(summary.apiEndpointImplementedByArdyn, false);
  assert.equal(summary.serverImplementedByArdyn, false);
  assert.equal(summary.websocketHttpTransportImplementedByArdyn, false);
  assert.equal(summary.contentFabricCanonicalSecureDropOwnerOnly, true);
  assert.equal(summary.locusAndMultiverseConsumerTargetsOnly, true);
  assert.equal(summary.allBlockedAuthorizationFlagsFalse, true);
  assert.equal(
    summary
      .allUnsafeBackendServerApiFabricBusBrokerTransportAdapterConnectorRegistryTaskImportExportPackagePersistenceRuntimeFlagsFalse,
    true
  );
  assert.equal(summary.allRuntimeEffectsFalse, true);
  assert.equal(summary.allEntriesNonAuthorizing, true);
  assert.equal(fixture.invalidBoundaryCasePolicy.validationImplementsBackendServer, false);
  assert.equal(fixture.invalidBoundaryCasePolicy.validationImplementsApiEndpoint, false);
  assert.equal(fixture.invalidBoundaryCasePolicy.validationImplementsFabricRuntime, false);
  assert.equal(
    fixture.invalidBoundaryCasePolicy.validationImplementsBusBrokerTransport,
    false
  );
  assert.equal(fixture.invalidBoundaryCasePolicy.validationConnectsRegistry, false);
  assert.equal(fixture.invalidBoundaryCasePolicy.validationExecutesTasks, false);
  assert.equal(fixture.invalidBoundaryCasePolicy.validationImplementsImportExport, false);
  assert.equal(
    fixture.invalidBoundaryCasePolicy.validationImplementsPackageDistribution,
    false
  );
  assert.equal(fixture.invalidBoundaryCasePolicy.validationImplementsPersistence, false);
  assert.equal(fixture.invalidBoundaryCasePolicy.validationRunsRuntime, false);
  assertNonAuthorizing(fixture);
  assertNonAuthorizing(fixture.fabricAwareApiBackendContractBoundaryMap);
  assert.ok(
    fixture.topApiBackendFabricContractGaps.some((gap) =>
      gap.includes("No backend server, API endpoint")
    )
  );
  assert.equal(
    fixture.recommendedNextPhase,
    "phase-5.60-review-only-database-storage-contract-boundary-map"
  );
});

test("serve-runtime remains default-blocked and dry-run cannot bypass Phase 5.59", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-59-runtime-"));

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

test("Phase 5.59 backend/API/Fabric/runtime command names remain rejected", async () => {
  for (const command of commandProbes) {
    const failure = await expectCliFailure([command]);

    assert.notEqual(failure.code, 0);
    assert.equal(failure.stdout, "");
    assert.match(failure.stderr, /unknown command|Usage: ardyn/i);
  }
});

test("Phase 5.59 does not change CLI, Rust, Fabric, package, or consumer source", async () => {
  await execFileAsync(
    "git",
    [
      "diff",
      "--exit-code",
      phase559BaselineCommit,
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

  assert.doesNotMatch(
    currentCliSource,
    /fabric-aware-api-backend-contract-boundary-map/
  );
  assert.doesNotMatch(currentCliSource, /backend-api-runtime/);
  assert.doesNotMatch(currentCliSource, /api-endpoint-server/);
  assert.doesNotMatch(currentCliSource, /fabric-runtime-bus/);
  assert.doesNotMatch(currentCliSource, /fabric-broker/);
  assert.doesNotMatch(currentCliSource, /fabric-transport/);
  assert.doesNotMatch(currentCliSource, /adapter-runtime/);
  assert.doesNotMatch(currentCliSource, /connector-grant/);
  assert.doesNotMatch(currentCliSource, /registry-connection/);
  assert.doesNotMatch(currentCliSource, /task-execution/);
  assert.doesNotMatch(currentCliSource, /import-export-path/);
  assert.doesNotMatch(currentCliSource, /package-distribution/);
  assert.doesNotMatch(currentCliSource, /secure-drop-runtime/);
  assert.doesNotMatch(currentCliSource, /phase-5-59/);
});
