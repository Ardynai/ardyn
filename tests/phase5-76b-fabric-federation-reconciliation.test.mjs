import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";
import {
  FABRIC_FEDERATION_RECONCILIATION_SCHEMA,
  createFabricFederationReconciliationForReview
} from "../packages/core/src/index.mjs";

const execFileAsync = promisify(execFile);
const reviewedAt = "2026-07-05T00:00:00.000Z";
const repoRootUrl = new URL("../", import.meta.url);
const repoRoot = fileURLToPath(repoRootUrl);
const cliPath = fileURLToPath(
  new URL("../apps/cli/src/index.mjs", import.meta.url)
);
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-76b/fabric-federation-reconciliation.json",
  import.meta.url
);
const packageJsonUrl = new URL("../package.json", import.meta.url);
const cargoTomlUrl = new URL("../Cargo.toml", import.meta.url);

async function readFixture() {
  return JSON.parse(await readFile(fixtureUrl, "utf8"));
}

async function readRepoFile(relPath) {
  return readFile(new URL(relPath, import.meta.url), "utf8");
}

async function execGrep(args) {
  try {
    const { stdout } = await execFileAsync(process.execPath, args, {
      cwd: repoRoot
    });
    return stdout;
  } catch {
    return "";
  }
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
  assertAllFalse(result.runtimeEffect);
}

test("Phase 5.76B fixture is deterministic", async () => {
  const fixture = await readFixture();
  const generated = createFabricFederationReconciliationForReview({ reviewedAt });

  assert.deepEqual(fixture, generated);
  assert.equal(fixture.schema, FABRIC_FEDERATION_RECONCILIATION_SCHEMA);
  assert.equal(
    fixture.classification,
    "valid_fabric_federation_reconciliation_consumer_client_present_unwired"
  );
  assert.equal(fixture.fabricFederationReconciliationProduced, true);
  assert.equal(fixture.reviewedAt, reviewedAt);
  assertNonAuthorizing(fixture);
});

test("Phase 5.76B records federation consumer client invariants", async () => {
  const fixture = await readFixture();
  const entry = fixture.boundaryEntries[0];
  const summary = fixture.boundaryMapSummary;

  assert.equal(fixture.boundaryEntries.length, 1);
  assert.match(entry.boundaryId, /^phase5-76b\./);
  assert.equal(entry.boundaryFamily, "fabric_federation_consumer_client");
  assert.equal(entry.relatedSystem, "ardyn");
  assert.equal(entry.currentStatus, "active_consumer_unwired");

  // The core invariants from the task spec
  assert.equal(entry.fabricFederationClientPresent, true);
  assert.equal(entry.wiredIntoCli, false);
  assert.equal(entry.wiredIntoHost, false);
  assert.equal(entry.outOfProcess, true);
  assert.equal(entry.sidecarLoopbackEnforced, true);
  assert.equal(entry.registryRequiresHttpsWhenRemote, true);
  assert.equal(entry.importsFabricCore, false);
  assert.equal(entry.joinsDhtSwarmP2p, false);
  assert.equal(entry.reimplementsTransport, false);
  assert.equal(entry.decryptsSecureDropCiphertext, false);
  assert.equal(entry.addsRuntimeDependency, false);
  assert.equal(entry.secretsCommittedToRepo, false);
  assert.equal(entry.closedSiblingDidAllowlist, true);
  assert.equal(entry.receiveSideContentIdReverified, true);
  assert.equal(entry.authorizedBy, "PR#4");
  assert.equal(entry.authorizationDate, "2026-07-05");

  // All authorization flags false
  assertAllFalse(entry.explicitBlockedAuthorizationFlags);
  assertAllFalse(entry.unsafeFabricFederationRuntimeFlags);
  assertAllFalse(entry.runtimeEffect);
  assert.equal(entry.nonAuthorizingProof, true);
  assert.equal(entry.fabricFederationReconciliationMetadataOnly, true);
  assert.equal(entry.noLiveFabricFederationWiringPerformed, true);

  // Summary checks
  assert.equal(summary.fabricFederationClientPresent, true);
  assert.equal(summary.wiredIntoCli, false);
  assert.equal(summary.noFabricCoreImport, true);
  assert.equal(summary.noDhtSwarmP2p, true);
  assert.equal(summary.noSecureDropDecrypt, true);
  assert.equal(summary.noCliHostWiring, true);

  // recommendedNextPhase stays 5.77
  assert.equal(
    fixture.recommendedNextPhase,
    "phase-5.77-code-mode-orchestration-boundary-map"
  );
});

test("Phase 5.76B federation is M4-wired in CLI, not in Rust host", async () => {
  // M4: federation is now wired into CLI via `federation status/config` command
  const hostSource = await readRepoFile("../crates/ardyn-host/src/lib.rs");

  // Rust host still must not reference federation
  assert.doesNotMatch(
    hostSource,
    /federation/,
    "federation must not be wired into Rust host"
  );
});

test("Phase 5.76B federation.mjs imports no @multiverse/fabric-core", async () => {
  const federationSource = await readRepoFile(
    "../packages/fabric/src/federation.mjs"
  );

  assert.doesNotMatch(
    federationSource,
    /@multiverse\/fabric-core/,
    "federation.mjs must not import @multiverse/fabric-core"
  );
  // Only node: stdlib imports allowed
  assert.match(
    federationSource,
    /import.*from\s+"node:/
  );
});

test("Phase 5.76B package.json and Cargo.toml added no deps for federation", async () => {
  const pkgJson = JSON.parse(await readRepoFile("../package.json"));
  const cargoToml = await readRepoFile("../Cargo.toml");

  // package.json must not have @multiverse/fabric-core as a dependency
  const allDeps = {
    ...(pkgJson.dependencies || {}),
    ...(pkgJson.devDependencies || {})
  };
  assert.equal(
    allDeps["@multiverse/fabric-core"],
    undefined,
    "package.json must not depend on @multiverse/fabric-core"
  );

  // Cargo.toml must not mention fabric-core
  assert.doesNotMatch(
    cargoToml,
    /fabric.core/i,
    "Cargo.toml must not reference fabric-core"
  );
});

test("Phase 5.76B invalid cases fail closed", () => {
  const valid = createFabricFederationReconciliationForReview({ reviewedAt });
  const [firstEntry] = valid.boundaryEntries;

  const cases = [
    {
      name: "malformed-null",
      input: null,
      expectedClassification:
        "malformed_fabric_federation_reconciliation_input_rejected"
    },
    {
      name: "malformed-bad-date",
      input: { reviewedAt: "not-a-date" },
      expectedClassification:
        "malformed_fabric_federation_reconciliation_input_rejected"
    },
    {
      name: "unknown-top-level-field",
      input: { reviewedAt, unexpectedField: true },
      expectedClassification:
        "unknown_top_level_field_fabric_federation_reconciliation_input_rejected"
    },
    {
      name: "report-runs-checks-true",
      input: { reviewedAt, reportRunsChecks: true },
      expectedClassification:
        "report_runs_checks_true_fabric_federation_reconciliation_input_rejected"
    },
    {
      name: "runtime-authorization-attempt",
      input: { reviewedAt, authorizesRuntime: true },
      expectedClassification:
        "runtime_authorization_attempt_fabric_federation_reconciliation_input_rejected"
    },
    {
      name: "command-exposure-attempt",
      input: { reviewedAt, commandExposureEnabled: true },
      expectedClassification:
        "command_exposure_attempt_fabric_federation_reconciliation_input_rejected"
    },
    {
      name: "blocked-cli-bypass-attempt",
      input: { reviewedAt, blockedCliBypassEnabled: true },
      expectedClassification:
        "blocked_cli_bypass_attempt_fabric_federation_reconciliation_input_rejected"
    },
    {
      name: "hidden-fabric-runtime",
      input: { reviewedAt, fabricRuntime: {} },
      expectedClassification:
        "hidden_fabric_runtime_semantics_fabric_federation_reconciliation_input_rejected"
    },
    {
      name: "hidden-fabric-core-transport",
      input: { reviewedAt, fabricCoreTransportRuntime: {} },
      expectedClassification:
        "hidden_fabric_core_transport_runtime_semantics_fabric_federation_reconciliation_input_rejected"
    },
    {
      name: "hidden-fabric-core-import",
      input: { reviewedAt, fabricCoreImport: {} },
      expectedClassification:
        "hidden_fabric_core_import_semantics_fabric_federation_reconciliation_input_rejected"
    },
    {
      name: "hidden-secure-drop",
      input: { reviewedAt, secureDropRuntime: {} },
      expectedClassification:
        "hidden_secure_drop_implementation_semantics_fabric_federation_reconciliation_input_rejected"
    },
    {
      name: "hidden-dht-swarm-p2p",
      input: { reviewedAt, dhtSwarmP2p: {} },
      expectedClassification:
        "hidden_dht_swarm_p2p_semantics_fabric_federation_reconciliation_input_rejected"
    },
    {
      name: "hidden-shell-runtime",
      input: { reviewedAt, shellRuntime: {} },
      expectedClassification:
        "hidden_shell_command_runtime_semantics_fabric_federation_reconciliation_input_rejected"
    },
    {
      name: "hidden-sqlite-runtime",
      input: { reviewedAt, sqliteRuntime: {} },
      expectedClassification:
        "hidden_sqlite_embedded_db_query_runtime_semantics_fabric_federation_reconciliation_input_rejected"
    },
    {
      name: "hidden-api-key",
      input: { reviewedAt, apiKey: {} },
      expectedClassification:
        "hidden_auth_session_token_api_key_semantics_fabric_federation_reconciliation_input_rejected"
    },
    {
      name: "hidden-connector-grant",
      input: { reviewedAt, connectorGrant: {} },
      expectedClassification:
        "hidden_connector_grant_semantics_fabric_federation_reconciliation_input_rejected"
    },
    {
      name: "hidden-filesystem-read",
      input: { reviewedAt, filesystemRead: {} },
      expectedClassification:
        "hidden_filesystem_access_semantics_fabric_federation_reconciliation_input_rejected"
    },
    {
      name: "hidden-filesystem-write",
      input: { reviewedAt, filesystemWrite: {} },
      expectedClassification:
        "hidden_filesystem_write_semantics_fabric_federation_reconciliation_input_rejected"
    },
    {
      name: "hidden-env-reader",
      input: { reviewedAt, envReader: {} },
      expectedClassification:
        "hidden_env_secrets_exposure_semantics_fabric_federation_reconciliation_input_rejected"
    },
    {
      name: "invariant-flip-wired-into-cli",
      input: { reviewedAt, wiredIntoCli: true },
      expectedClassification:
        "invariant_flip_wired_into_cli_fabric_federation_reconciliation_input_rejected"
    },
    {
      name: "invariant-flip-wired-into-host",
      input: { reviewedAt, wiredIntoHost: true },
      expectedClassification:
        "invariant_flip_wired_into_host_fabric_federation_reconciliation_input_rejected"
    },
    {
      name: "invariant-flip-imports-fabric-core",
      input: { reviewedAt, importsFabricCore: true },
      expectedClassification:
        "invariant_flip_imports_fabric_core_fabric_federation_reconciliation_input_rejected"
    },
    {
      name: "invariant-flip-joins-dht-swarm-p2p",
      input: { reviewedAt, joinsDhtSwarmP2p: true },
      expectedClassification:
        "invariant_flip_joins_dht_swarm_p2p_fabric_federation_reconciliation_input_rejected"
    },
    {
      name: "invariant-flip-decrypts-secure-drop",
      input: { reviewedAt, decryptsSecureDropCiphertext: true },
      expectedClassification:
        "invariant_flip_decrypts_secure_drop_fabric_federation_reconciliation_input_rejected"
    },
    {
      name: "invariant-flip-adds-runtime-dependency",
      input: { reviewedAt, addsRuntimeDependency: true },
      expectedClassification:
        "invariant_flip_adds_runtime_dependency_fabric_federation_reconciliation_input_rejected"
    },
    {
      name: "invariant-flip-secrets-committed",
      input: { reviewedAt, secretsCommittedToRepo: true },
      expectedClassification:
        "invariant_flip_secrets_committed_to_repo_fabric_federation_reconciliation_input_rejected"
    },
    {
      name: "invariant-flip-out-of-process",
      input: { reviewedAt, outOfProcess: false },
      expectedClassification:
        "invariant_flip_out_of_process_fabric_federation_reconciliation_input_rejected"
    },
    {
      name: "invariant-flip-sidecar-loopback",
      input: { reviewedAt, sidecarLoopbackEnforced: false },
      expectedClassification:
        "invariant_flip_sidecar_loopback_fabric_federation_reconciliation_input_rejected"
    },
    {
      name: "invariant-flip-closed-sibling-allowlist",
      input: { reviewedAt, closedSiblingDidAllowlist: false },
      expectedClassification:
        "invariant_flip_closed_sibling_allowlist_fabric_federation_reconciliation_input_rejected"
    },
    {
      name: "invariant-flip-receive-side-content-id",
      input: { reviewedAt, receiveSideContentIdReverified: false },
      expectedClassification:
        "invariant_flip_receive_side_content_id_reverified_fabric_federation_reconciliation_input_rejected"
    }
  ];

  for (const { name, input, expectedClassification } of cases) {
    const result = createFabricFederationReconciliationForReview(input);
    assert.equal(
      result.classification,
      expectedClassification,
      `${name}: expected ${expectedClassification}, got ${result.classification}`
    );
    assert.equal(result.fabricFederationReconciliationProduced, false, name);
    assert.equal(result.reportRunsChecks, false, name);
    assert.equal(result.nonAuthorizingProof, true, name);
    assert.deepEqual(result.boundaryEntries, [], name);
    assert.equal(result.rejectionReasons.length, 1, name);
  }
});

test("Phase 5.76B fixture has no secrets committed", async () => {
  const fixtureText = await readFile(fixtureUrl, "utf8");
  // The fixture must not contain actual secrets/tokens
  assert.doesNotMatch(fixtureText, /ghp_[A-Za-z0-9]/);
  assert.doesNotMatch(fixtureText, /Bearer\s+[A-Za-z0-9._-]{20,}/);
  // secretsCommittedToRepo must be false
  const fixture = JSON.parse(fixtureText);
  assert.equal(fixture.boundaryEntries[0].secretsCommittedToRepo, false);
});