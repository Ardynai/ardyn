// tests/phase5-83-external-reference-policy.test.mjs
// Phase 5.83: External-reference policy + dependency allowlist + federation invariants
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";
import { assertUnchanged } from "./helpers/source-digests.mjs";
import {
  EXTERNAL_REFERENCE_POLICY_BOUNDARY_MAP_SCHEMA,
  createExternalReferencePolicyForReview
} from "../packages/core/src/index.mjs";

const execFileAsync = promisify(execFile);
const repoRootUrl = new URL("../", import.meta.url);
const repoRoot = fileURLToPath(repoRootUrl);
const reviewedAt = "2026-07-09T00:00:00.000Z";
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-83/external-reference-policy.json",
  import.meta.url
);

const NPM_ALLOWLIST = Object.freeze(["ajv"]);
const CARGO_ALLOWLIST = Object.freeze(["serde", "serde_json", "sha2"]);
const FORBIDDEN_PATTERNS = Object.freeze([
  "libp2p", "bittorrent", "dht", "webtorrent",
  "torch", "tensorflow", "jax", "transformers",
  "matrix-js-sdk", "@matrix-org", "hermes", "cua-",
  "goose", "onyx", "fainir", "openclaw"
]);

// ponytail: escapeRegExp inline (no separate helper import needed — same logic as tests/helpers/regex.mjs)
function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function readJson(url) {
  return readFile(fileURLToPath(url), "utf8").then(JSON.parse);
}

async function runCliFailure(args, opts = {}) {
  const cliPath = fileURLToPath(new URL("../apps/cli/src/index.mjs", import.meta.url));
  try {
    const { stdout } = await execFileAsync(process.execPath, [cliPath, ...args], {
      cwd: opts.cwd ?? repoRoot,
      encoding: "utf8",
      timeout: 10000,
      ...opts
    });
    return { code: 0, stdout };
  } catch (e) {
    return { code: e.code ?? 1, stdout: e.stdout ?? "", stderr: e.stderr ?? "" };
  }
}

// ─── Fixture + helper deepEqual ─────────────────────────────────────────────

test("Phase 5.83 fixture equals generated helper output", async () => {
  const fixture = await readJson(fixtureUrl);
  const generated = createExternalReferencePolicyForReview({ reviewedAt });
  assert.deepEqual(fixture, generated);
});

test("Phase 5.83 schema and metadata are correct", async () => {
  const result = createExternalReferencePolicyForReview({ reviewedAt });
  assert.equal(result.schema, EXTERNAL_REFERENCE_POLICY_BOUNDARY_MAP_SCHEMA);
  assert.equal(result.schemaVersion, "0.1.0");
  assert.equal(result.reviewOnly, true);
  assert.equal(result.metadataOnly, true);
  assert.equal(result.authoritative, false);
  assert.equal(result.nonAuthorizingProof, true);
  assert.equal(result.reportRunsChecks, false);
  assert.equal(result.recommendedNextPhase, "phase-5.84-fabric-federation-prewiring-hardening");
});

test("Phase 5.83 all authorization and runtime flags are false", async () => {
  const result = createExternalReferencePolicyForReview({ reviewedAt });
  for (const entry of result.boundaryEntries) {
    assert.equal(entry.nonAuthorizingProof, true);
    const authFlags = entry.explicitBlockedAuthorizationFlags;
    for (const [k, v] of Object.entries(authFlags)) assert.equal(v, false, `${k} must be false`);
    const unsafeFlags = entry.unsafeExternalReferencePolicyRuntimeFlags;
    for (const [k, v] of Object.entries(unsafeFlags)) assert.equal(v, false, `${k} must be false`);
  }
  assert.equal(result.boundaryMapSummary.allBlockedAuthorizationFlagsFalse, true);
  assert.equal(result.boundaryMapSummary.allUnsafeExternalReferencePolicyRuntimeFlagsFalse, true);
  assert.equal(result.boundaryMapSummary.allRuntimeEffectsFalse, true);
  assert.equal(result.boundaryMapSummary.allEntriesNonAuthorizing, true);
});

test("Phase 5.83 has 16 boundary entries across 14 reference families + 2 policy entries", async () => {
  const result = createExternalReferencePolicyForReview({ reviewedAt });
  assert.equal(result.boundaryEntries.length, 16);
  const families = new Set(result.boundaryEntries.map(e => e.boundaryFamily));
  assert.ok(families.size >= 14, `expected >=14 families, got ${families.size}`);
});

// ─── Dependency allowlist ────────────────────────────────────────────────────

test("Phase 5.83 npm dependencies+devDependencies exactly equal allowlist", async () => {
  const pkg = JSON.parse(await readFile(fileURLToPath(new URL("../package.json", import.meta.url)), "utf8"));
  const allDeps = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies }).sort();
  assert.deepEqual(allDeps, [...NPM_ALLOWLIST].sort());
});

test("Phase 5.83 cargo dependencies exactly equal allowlist", async () => {
  const cargoToml = await readFile(fileURLToPath(new URL("../crates/ardyn-host/Cargo.toml", import.meta.url)), "utf8");
  // Extract [dependencies] section — normalize CRLF first
  const normalized = cargoToml.replace(/\r\n/g, "\n");
  const depMatch = normalized.match(/\[dependencies\]\n([\s\S]*?)(?:\n\[|\n$|$)/);
  assert.ok(depMatch, "Cargo.toml must have [dependencies] section");
  const depLines = depMatch[1].trim().split("\n").map(l => l.trim()).filter(Boolean);
  const cargoDeps = depLines.map(l => l.split("=")[0].trim().split(" ")[0]);
  assert.deepEqual(cargoDeps.sort(), [...CARGO_ALLOWLIST].sort());
});

// ─── Forbidden-pattern scan ──────────────────────────────────────────────────

test("Phase 5.83 no forbidden pattern appears as package name in package-lock.json", async () => {
  const lockfile = JSON.parse(await readFile(fileURLToPath(new URL("../package-lock.json", import.meta.url)), "utf8"));
  const allPkgNames = new Set();
  if (lockfile.packages) {
    for (const key of Object.keys(lockfile.packages)) {
      if (key === "") continue;
      const name = key.startsWith("node_modules/") ? key.slice("node_modules/".length) : key;
      allPkgNames.add(name);
    }
  }
  if (lockfile.dependencies) {
    for (const name of Object.keys(lockfile.dependencies)) allPkgNames.add(name);
  }
  for (const pattern of FORBIDDEN_PATTERNS) {
    const re = new RegExp(escapeRegExp(pattern), "i");
    for (const name of allPkgNames) {
      // ponytail: skip @ardyn/* workspace packages and packages/* workspace paths —
      // "openclaw" appears as @ardyn/adapter-openclaw and packages/adapters/openclaw
      // which are Ardyn-internal taxonomy references, not external forbidden dependencies.
      if (name.startsWith("@ardyn/") || name.startsWith("packages/")) continue;
      assert.doesNotMatch(name, re, `Forbidden pattern "${pattern}" found in package name: ${name}`);
    }
  }
});

test("Phase 5.83 no forbidden pattern appears as package name in Cargo.lock", async () => {
  const cargoLock = await readFile(fileURLToPath(new URL("../Cargo.lock", import.meta.url)), "utf8");
  // Extract package names from [[package]] sections
  const pkgMatches = [...cargoLock.matchAll(/name = "([^"]+)"/g)];
  const cargoPkgNames = pkgMatches.map(m => m[1]);
  for (const pattern of FORBIDDEN_PATTERNS) {
    const re = new RegExp(escapeRegExp(pattern), "i");
    for (const name of cargoPkgNames) {
      assert.doesNotMatch(name, re, `Forbidden pattern "${pattern}" found in cargo package: ${name}`);
    }
  }
});

// ─── CLI rejection probes ────────────────────────────────────────────────────

test("Phase 5.83 CLI rejects computer-use, hermes, matrix, shell, sqlite, secure-drop, fabric-transport commands", async () => {
  const cliPath = fileURLToPath(new URL("../apps/cli/src/index.mjs", import.meta.url));
  const probeCommands = [
    "computer-use", "hermes", "matrix", "shell",
    "sqlite", "secure-drop", "fabric-transport"
  ];
  for (const cmd of probeCommands) {
    const failure = await runCliFailure([cmd]);
    assert.notEqual(failure.code, 0, `${cmd} should fail (non-zero exit)`);
    assert.equal(failure.stdout, "", `${cmd} should produce empty stdout`);
  }
});

// ─── Import guards ───────────────────────────────────────────────────────────

test("Phase 5.83 no import/require of forbidden patterns in packages/*/src or apps/cli/src", async () => {
  const sourceDirs = [
    fileURLToPath(new URL("../packages/", import.meta.url)),
    fileURLToPath(new URL("../apps/cli/src/", import.meta.url))
  ];

  async function collectMjsFiles(dir) {
    const entries = await readdir(dir, { withFileTypes: true });
    const files = [];
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...await collectMjsFiles(fullPath));
      } else if (entry.name.endsWith(".mjs") || entry.name.endsWith(".js")) {
        files.push(fullPath);
      }
    }
    return files;
  }

  const importPatterns = FORBIDDEN_PATTERNS.map(p => escapeRegExp(p));
  // Also check for @multiverse/fabric-core specifically
  importPatterns.push("@multiverse/fabric-core");

  for (const dir of sourceDirs) {
    let files;
    try { files = await collectMjsFiles(dir); } catch { continue; }
    for (const file of files) {
      const content = await readFile(file, "utf8");
      // Check import/require statements
      const importRegex = /(?:import\s+.*?\s+from\s+|require\s*\(\s*)["']([^"']+)["']/g;
      let match;
      while ((match = importRegex.exec(content)) !== null) {
        const importPath = match[1];
        for (const pattern of importPatterns) {
          const re = new RegExp(pattern, "i");
          assert.doesNotMatch(importPath, re,
            `Forbidden import "${pattern}" found in ${file}: import "${importPath}"`);
        }
      }
    }
  }
});

// ─── Federation invariants ───────────────────────────────────────────────────

test("Phase 5.83 federation_invariants: isLoopbackFabricFederationUrl rejects non-loopback", async () => {
  const { isLoopbackFabricFederationUrl } = await import("../packages/fabric/src/federation.mjs");
  assert.equal(isLoopbackFabricFederationUrl("http://localhost:7600/path"), true);
  assert.equal(isLoopbackFabricFederationUrl("http://127.0.0.1:7600/path"), true);
  assert.equal(isLoopbackFabricFederationUrl("http://[::1]:7600/path"), true);
  // Non-loopback must be rejected
  assert.equal(isLoopbackFabricFederationUrl("http://example.com:7600/path"), false);
  assert.equal(isLoopbackFabricFederationUrl("http://10.0.0.1:7600/path"), false);
  assert.equal(isLoopbackFabricFederationUrl("https://registry.fabric.io/path"), false);
  assert.equal(isLoopbackFabricFederationUrl("not-a-url"), false);
});

test("Phase 5.83 federation_invariants: federation.mjs not imported by CLI or host", async () => {
  const cliSource = await readFile(fileURLToPath(new URL("../apps/cli/src/index.mjs", import.meta.url)), "utf8");
  assert.doesNotMatch(cliSource, /federation\.mjs/i, "CLI must not import federation.mjs");
  // Check host (lib.rs doesn't import JS — check index.mjs in packages/core doesn't import federation)
  const coreSource = await readFile(fileURLToPath(new URL("../packages/core/src/index.mjs", import.meta.url)), "utf8");
  assert.doesNotMatch(coreSource, /from\s+["'].*federation\.mjs["']/i, "core must not import federation.mjs");
});

test("Phase 5.83 federation_invariants: no @multiverse/fabric-core import anywhere", async () => {
  const fabricSource = await readFile(fileURLToPath(new URL("../packages/fabric/src/federation.mjs", import.meta.url)), "utf8");
  assert.doesNotMatch(fabricSource, /@multiverse\/fabric-core/i, "federation.mjs must not import @multiverse/fabric-core");
});

test("Phase 5.83 federation_invariants: no DHT/swarm/P2P/BitTorrent in federation source", async () => {
  const fabricSource = await readFile(fileURLToPath(new URL("../packages/fabric/src/federation.mjs", import.meta.url)), "utf8");
  assert.doesNotMatch(fabricSource, /libp2p|bittorrent|dht|swarm|p2p/i, "federation.mjs must not reference DHT/swarm/P2P");
});

test("Phase 5.83 federation_invariants: federation adds no npm deps", async () => {
  const pkg = JSON.parse(await readFile(fileURLToPath(new URL("../package.json", import.meta.url)), "utf8"));
  const allDeps = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies });
  assert.deepEqual(allDeps.sort(), ["ajv"], "federation must not add deps — only ajv allowed");
});

test("Phase 5.83 federation_invariants: no crypto decrypt of payloads in federation source", async () => {
  const fabricSource = await readFile(fileURLToPath(new URL("../packages/fabric/src/federation.mjs", import.meta.url)), "utf8");
  assert.doesNotMatch(fabricSource, /\.decrypt\s*\(/i, "federation.mjs must not call decrypt");
  assert.doesNotMatch(fabricSource, /createDecipheriv/i, "federation.mjs must not use createDecipheriv");
});

test("Phase 5.83 federation_invariants: no hardcoded secrets in federation source", async () => {
  const fabricSource = await readFile(fileURLToPath(new URL("../packages/fabric/src/federation.mjs", import.meta.url)), "utf8");
  assert.doesNotMatch(fabricSource, /(?:token|secret|password|api_key|apikey)\s*=\s*["'][^"']{8,}["']/i,
    "federation.mjs must not contain hardcoded secrets");
});

// ─── Owning-phase fixture existence ──────────────────────────────────────────

test("Phase 5.83 every policy entry's owning-phase fixture or manifest exists", async () => {
  const result = createExternalReferencePolicyForReview({ reviewedAt });
  const phaseFixtureMap = {
    "5.60": "tests/fixtures/host-policy/phase5-60/inter-agent-encoded-handoff-conformance.json",
    "5.68": "tests/fixtures/host-policy/phase5-68/agent-mode-profile-skillhub-capability-boundary-map.json",
    "5.73": "tests/fixtures/host-policy/phase5-73/external-gateway-matrix-transport-contract-boundary-map.json",
    "5.74": "tests/fixtures/host-policy/phase5-74/command-surface-shell-primitive-contract-boundary-map.json",
    "5.75": "tests/fixtures/host-policy/phase5-75/fabric-core-consumer-integration-readiness-boundary-update.json",
    "5.76": "tests/fixtures/host-policy/phase5-76/embedded-db-query-engine-primitive-contract-boundary-map.json",
    "5.76B": "tests/fixtures/host-policy/phase5-76B/fabric-federation-reconciliation.json",
    "5.83": "tests/fixtures/host-policy/phase5-83/external-reference-policy.json"
  };
  const fs = await import("node:fs/promises");
  for (const entry of result.boundaryEntries) {
    const expectedPath = phaseFixtureMap[entry.owningPhase];
    if (!expectedPath) continue; // skip if no mapping
    try {
      await fs.access(fileURLToPath(new URL(`../${expectedPath}`, import.meta.url)));
    } catch {
      assert.fail(`Owning-phase fixture missing for ${entry.referenceFamily} (phase ${entry.owningPhase}): ${expectedPath}`);
    }
  }
});

// ─── Source guard (assertUnchanged) ──────────────────────────────────────────

test("Phase 5.83 does not change CLI, Rust, Fabric, or package source", async () => {
  await assertUnchanged([
    "apps/cli/src/index.mjs",
    "crates/ardyn-host/src/lib.rs",
    "crates/ardyn-host/src/stdio_runtime/mod.rs",
    "packages/fabric/src/index.mjs",
    "packages/fabric/src/federation.mjs",
    "package.json",
    "package-lock.json",
    "Cargo.toml",
    "Cargo.lock"
  ]);
});

// ─── Rejection cases ─────────────────────────────────────────────────────────

test("Phase 5.83 rejection: reportRunsChecks:true rejected", async () => {
  const result = createExternalReferencePolicyForReview({ reviewedAt, reportRunsChecks: true });
  assert.equal(result.externalReferencePolicyBoundaryMapProduced, false);
  assert.match(result.classification, /report_runs_checks_true/);
});

test("Phase 5.83 rejection: authorizesRuntime:true rejected", async () => {
  const result = createExternalReferencePolicyForReview({ reviewedAt, authorizesRuntime: true });
  assert.equal(result.externalReferencePolicyBoundaryMapProduced, false);
  assert.match(result.classification, /runtime_authorization_attempt/);
});

test("Phase 5.83 rejection: unknown top-level field rejected", async () => {
  const result = createExternalReferencePolicyForReview({ reviewedAt, unexpectedField: true });
  assert.equal(result.externalReferencePolicyBoundaryMapProduced, false);
  assert.match(result.classification, /unknown_top_level_field/);
});

test("Phase 5.83 rejection: unsafe runtime flag rejected", async () => {
  const result = createExternalReferencePolicyForReview({ reviewedAt, shellRuntimeEnabled: true });
  assert.equal(result.externalReferencePolicyBoundaryMapProduced, false);
  assert.match(result.classification, /unsafe_external_reference_policy_runtime_flags/);
});

test("Phase 5.83 rejection: malformed input rejected", async () => {
  const result = createExternalReferencePolicyForReview(null);
  assert.equal(result.externalReferencePolicyBoundaryMapProduced, false);
  assert.match(result.classification, /malformed/);
});

test("Phase 5.83 rejection: invalid reviewedAt rejected", async () => {
  const result = createExternalReferencePolicyForReview({ reviewedAt: "not-a-date" });
  assert.equal(result.externalReferencePolicyBoundaryMapProduced, false);
  assert.match(result.classification, /malformed/);
});
