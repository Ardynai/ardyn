import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const rustHostSourceUrl = new URL("../crates/ardyn-host/src/lib.rs", import.meta.url);
const cliSourceUrl = new URL("../apps/cli/src/index.mjs", import.meta.url);
const reportScriptUrl = new URL("../scripts/report-phase-status.mjs", import.meta.url);
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase4-0e-stdio-transport-policy-metadata.json",
  import.meta.url
);
const phase40EDocUrl = new URL(
  "../docs/phase-4-0e-rust-host-policy-metadata.md",
  import.meta.url
);
const docUrls = [
  new URL("../README.md", import.meta.url),
  new URL("../apps/cli/README.md", import.meta.url),
  new URL("../packages/core/README.md", import.meta.url),
  new URL("../crates/ardyn-host/README.md", import.meta.url),
  new URL("../docs/architecture.md", import.meta.url),
  new URL("../docs/host-policy-preconditions.md", import.meta.url),
  new URL("../docs/session-events-stdio-contract.md", import.meta.url),
  new URL("../docs/phase-4-stdio-dry-run-event-emission.md", import.meta.url),
  new URL("../docs/phase-4-0d-rust-host-transport-policy-contracts.md", import.meta.url)
];

function stripRustTests(source) {
  return source.split(/\n#\[cfg\(test\)\]\n/)[0];
}

function phase40EMetadataSection(source) {
  const start = source.indexOf("ARDYN_STDIO_TRANSPORT_POLICY_METADATA_SCHEMA");
  const end = source.indexOf("pub enum CapabilityKind");

  assert.notEqual(start, -1, "Phase 4.0E metadata constants should exist");
  assert.notEqual(end, -1, "metadata section end marker should exist");
  assert.ok(start < end, "metadata section should precede capability types");

  return source.slice(start, end);
}

test("Phase 4.0E Rust host exposes deterministic policy metadata helpers", async () => {
  const source = await readFile(rustHostSourceUrl, "utf8");

  for (const requiredSymbol of [
    "ARDYN_STDIO_TRANSPORT_POLICY_METADATA_SCHEMA",
    "ARDYN_STDIO_TRANSPORT_POLICY_METADATA_VERSION",
    "ARDYN_STDIO_TRANSPORT_POLICY_METADATA_PHASE",
    "ARDYN_HOST_POLICY_REVIEW_RECORD_SCHEMA",
    "PolicyMetadataExportStatus",
    "PolicyRuntimeStatus",
    "PolicyJsonSerializationFormat",
    "HostPolicyReviewStatus",
    "DeterministicPolicyJsonSerialization",
    "HostPolicyReviewRecordMapping",
    "StdioTransportPolicyMetadata",
    "HostPolicyReviewDecisionMetadata",
    "HostPolicyReviewRecord",
    "stdio_transport_policy_metadata",
    "validate_stdio_transport_policy_metadata",
    "serialize_stdio_transport_policy_metadata_json",
    "stdio_transport_policy_metadata_json",
    "parse_stdio_transport_policy_metadata_json",
    "stdio_transport_policy_metadata_digest_hex",
    "host_policy_review_record_for_stdio_transport_policy_metadata",
    "validate_host_policy_review_record"
  ]) {
    assert.match(source, new RegExp(`\\b${requiredSymbol}\\b`));
  }

  assert.match(source, /serde_json::to_string_pretty/);
  assert.match(source, /input\.contains\('\\r'\)/);
  assert.match(source, /fabric_sha256_hex\(json\.as_bytes\(\)\)/);
});

test("Phase 4.0E golden fixture is review-only deterministic JSON metadata", async () => {
  const text = await readFile(fixtureUrl, "utf8");
  const fixture = JSON.parse(text);

  assert.equal(text.endsWith("\n"), true);
  assert.equal(text.includes("\r"), false);
  assert.deepEqual(Object.keys(fixture), [
    "schema",
    "schemaVersion",
    "metadataPhase",
    "contractPhase",
    "exportStatus",
    "runtimeStatus",
    "reviewOnly",
    "serialization",
    "policy",
    "futureHostPolicyReviewRecord"
  ]);
  assert.equal(fixture.schema, "ardyn.stdio-transport-policy-metadata");
  assert.equal(fixture.schemaVersion, "0.1.0");
  assert.equal(fixture.metadataPhase, "phase-4.0e-rust-host-policy-metadata");
  assert.equal(fixture.contractPhase, "phase-4.0d-rust-host-transport-policy-contracts");
  assert.equal(fixture.exportStatus, "review-export-only");
  assert.equal(fixture.runtimeStatus, "pre-runtime-policy-only");
  assert.equal(fixture.reviewOnly, true);
  assert.equal(fixture.serialization.serializer, "serde_json::to_string_pretty");
  assert.equal(fixture.serialization.format, "pretty-json-lf-terminated");
  assert.equal(fixture.serialization.finalLfRequired, true);
  assert.equal(fixture.serialization.crlfAllowed, false);
  assert.equal(fixture.policy.runtimeImplementationActive, false);
  assert.equal(fixture.policy.safety.liveStdioRuntime, false);
  assert.equal(fixture.policy.safety.runtimeExecutionBehavior, false);
  assert.equal(
    fixture.futureHostPolicyReviewRecord.recordSchema,
    "ardyn.host-policy-review-record"
  );
  assert.equal(fixture.futureHostPolicyReviewRecord.policyDigestAlgorithm, "sha256");
  assert.equal(fixture.futureHostPolicyReviewRecord.reviewedPhase, "4.0E");
  assert.equal(fixture.futureHostPolicyReviewRecord.approvalFieldsReviewMetadataOnly, true);
  assert.equal(fixture.futureHostPolicyReviewRecord.approvalRuntimeEffectAllowed, false);
  assert.equal(fixture.futureHostPolicyReviewRecord.rejectionRuntimeEffectAllowed, false);
});

test("Phase 4.0E docs are cross-linked and do not imply runtime export behavior", async () => {
  const [phase40EDoc, ...indexedDocs] = await Promise.all([
    readFile(phase40EDocUrl, "utf8"),
    ...docUrls.map((url) => readFile(url, "utf8"))
  ]);

  for (const requiredPhrase of [
    "deterministic JSON review metadata",
    "does not implement process-level stdio ownership",
    "They do not write files, print to stdout, read stdin, start a runtime",
    "parse_stdio_transport_policy_metadata_json()",
    "host_policy_review_record_for_stdio_transport_policy_metadata()",
    "The default review decision is `review-pending`"
  ]) {
    assert.match(phase40EDoc, new RegExp(requiredPhrase.replace(/[()]/g, "\\$&"), "i"));
  }

  for (const source of indexedDocs) {
    assert.match(source, /docs\/phase-4-0e-rust-host-policy-metadata\.md/);
  }
});

test("Phase 4.0E source guards prevent live runtime, stdio, network, and write paths", async () => {
  const [rustSource, cliSource, reportSource] = await Promise.all([
    readFile(rustHostSourceUrl, "utf8"),
    readFile(cliSourceUrl, "utf8"),
    readFile(reportScriptUrl, "utf8")
  ]);
  const nonTestRust = stripRustTests(rustSource);
  const metadataSection = phase40EMetadataSection(nonTestRust);

  for (const forbiddenRustPattern of [
    /std::io::stdin\b/,
    /std::process\b/,
    /\bCommand::new\b/,
    /std::net::/,
    /\bTcpListener\b/,
    /\bTcpStream\b/,
    /\bUdpSocket\b/,
    /tokio::net/,
    /\breqwest\b/,
    /\bhyper\b/,
    /\baxum\b/,
    /\bwarp\b/,
    /\btungstenite\b/,
    /std::env::var\b/,
    /std::env::vars\b/,
    /println!/,
    /eprintln!/,
    /std::fs::write/,
    /\bfs::write/,
    /\bFile::create\b/,
    /\bwrite_all\b/,
    /load_production_signing_key/i,
    /read_production_signing_key/i
  ]) {
    assert.doesNotMatch(metadataSection, forbiddenRustPattern);
  }

  for (const forbiddenCliPattern of [
    /policy-metadata/i,
    /host-policy-export/i,
    /stdio_transport_policy_metadata/,
    /replay-session-transcript/,
    /process\.stdin/,
    /node:readline/,
    /node:child_process/,
    /node:http/,
    /node:https/,
    /node:net/,
    /\bWebSocket\b/,
    /\bspawn\s*\(/,
    /\bcreateServer\s*\(/,
    /\blisten\s*\(/
  ]) {
    assert.doesNotMatch(cliSource, forbiddenCliPattern);
  }

  for (const forbiddenReportPattern of [
    /node:child_process/,
    /node:http/,
    /node:https/,
    /node:net/,
    /\bfetch\s*\(/,
    /\bWebSocket\b/,
    /\bwriteFile\s*\(/,
    /\bappendFile\s*\(/,
    /\bspawn\s*\(/,
    /\blisten\s*\(/
  ]) {
    assert.doesNotMatch(reportSource, forbiddenReportPattern);
  }
});
