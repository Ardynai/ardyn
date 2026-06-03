import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const rustHostSourceUrl = new URL("../crates/ardyn-host/src/lib.rs", import.meta.url);
const cliSourceUrl = new URL("../apps/cli/src/index.mjs", import.meta.url);
const reportScriptUrl = new URL("../scripts/report-phase-status.mjs", import.meta.url);
const fixtureRootUrl = new URL("../tests/fixtures/host-policy/phase4-0f/", import.meta.url);
const phase40FDocUrl = new URL(
  "../docs/phase-4-0f-host-policy-review-records.md",
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
  new URL("../docs/phase-4-0e-rust-host-policy-metadata.md", import.meta.url),
  new URL("../docs/phase-4-0d-rust-host-transport-policy-contracts.md", import.meta.url)
];

const fixtureFiles = [
  "current-host-policy-review-record.json",
  "same-major-future-minor-host-policy-review-record.json",
  "unsupported-major-host-policy-review-record.json",
  "malformed-missing-schema-version-host-policy-review-record.json",
  "malformed-missing-policy-digest-host-policy-review-record.json",
  "malformed-permissive-approval-runtime-effect-host-policy-review-record.json",
  "rejected-permissive-policy-host-policy-review-record.json"
];

function stripRustTests(source) {
  return source.split(/\n#\[cfg\(test\)\]\n/)[0];
}

function phase40FReviewRecordSection(source) {
  const start = source.indexOf("ARDYN_HOST_POLICY_REVIEW_RECORD_PHASE");
  const end = source.indexOf("pub enum CapabilityKind");

  assert.notEqual(start, -1, "Phase 4.0F review-record phase constant should exist");
  assert.notEqual(end, -1, "review-record section end marker should exist");
  assert.ok(start < end, "review-record section should precede capability types");

  return source.slice(start, end);
}

async function readFixture(file) {
  const text = await readFile(new URL(file, fixtureRootUrl), "utf8");
  return { text, json: JSON.parse(text) };
}

test("Phase 4.0F Rust host exposes static review-record helpers", async () => {
  const source = await readFile(rustHostSourceUrl, "utf8");

  for (const requiredSymbol of [
    "ARDYN_HOST_POLICY_REVIEW_RECORD_SCHEMA",
    "ARDYN_HOST_POLICY_REVIEW_RECORD_VERSION",
    "ARDYN_HOST_POLICY_REVIEW_RECORD_PHASE",
    "HostPolicyReviewStatus",
    "HostPolicyReviewCompatibility",
    "HostPolicyReviewDecisionMetadata",
    "HostPolicyReviewDiagnostics",
    "HostPolicyReviewRecord",
    "host_policy_review_record_for_stdio_transport_policy_metadata",
    "rejected_host_policy_review_record_for_stdio_transport_policy_metadata",
    "validate_host_policy_review_record",
    "serialize_host_policy_review_record_json",
    "host_policy_review_record_json_for_stdio_transport_policy_metadata",
    "parse_host_policy_review_record_json",
    "classify_host_policy_review_record_json"
  ]) {
    assert.match(source, new RegExp(`\\b${requiredSymbol}\\b`));
  }

  assert.match(source, /HostPolicyReviewCompatibility::Compatible/);
  assert.match(source, /HostPolicyReviewCompatibility::UpgradeAvailable/);
  assert.match(source, /HostPolicyReviewCompatibility::UnsupportedMajor/);
  assert.match(source, /HostPolicyReviewCompatibility::Malformed/);
  assert.match(source, /HostPolicyReviewCompatibility::RejectedPolicy/);
  assert.match(source, /serde_json::Value/);
  assert.match(source, /input\.contains\('\\r'\)/);
  assert.match(source, /approval_runtime_effect_allowed/);
  assert.match(source, /rejection_runtime_effect_allowed/);
});

test("Phase 4.0F current fixture is deterministic review-only JSON", async () => {
  const { text, json } = await readFixture("current-host-policy-review-record.json");

  assert.equal(text.endsWith("\n"), true);
  assert.equal(text.includes("\r"), false);
  assert.deepEqual(Object.keys(json), [
    "schema",
    "schemaVersion",
    "recordPhase",
    "reviewedPhase",
    "policyMetadataSchema",
    "policyMetadataVersion",
    "policyMetadataDigestAlgorithm",
    "policyMetadataDigestHex",
    "policyContractVersion",
    "runtimeStatus",
    "nonExecutionInvariants",
    "compatibility",
    "decision",
    "diagnostics"
  ]);
  assert.equal(json.schema, "ardyn.host-policy-review-record");
  assert.equal(json.schemaVersion, "0.1.0");
  assert.equal(json.recordPhase, "phase-4.0f-host-policy-review-records");
  assert.equal(json.reviewedPhase, "4.0E");
  assert.equal(json.policyMetadataSchema, "ardyn.stdio-transport-policy-metadata");
  assert.equal(json.policyMetadataVersion, "0.1.0");
  assert.equal(json.policyMetadataDigestAlgorithm, "sha256");
  assert.equal(
    json.policyMetadataDigestHex,
    "91e64ea2ec4b61ef4850501ba4d80d01af5e23def60dd893652bfaa0cd7b494a"
  );
  assert.equal(json.policyContractVersion, "0.1.0");
  assert.equal(json.runtimeStatus, "pre-runtime-policy-only");
  assert.equal(json.compatibility, "compatible");
  assert.equal(json.decision.status, "review-pending");
  assert.equal(json.decision.approvalRecorded, false);
  assert.equal(json.decision.rejectionRecorded, false);
  assert.equal(json.decision.reviewMetadataOnly, true);
  assert.equal(json.decision.approvalRuntimeEffectAllowed, false);
  assert.equal(json.decision.rejectionRuntimeEffectAllowed, false);
  assert.deepEqual(json.diagnostics.warnings, [
    "review-record-is-static-review-metadata-only",
    "review-record-does-not-grant-runtime-approval",
    "future-live-runtime-remains-blocked-until-separate-approved-phase"
  ]);
  assert.deepEqual(json.diagnostics.errors, []);
});

test("Phase 4.0F fixture set covers compatibility and fail-closed cases", async () => {
  const fixtures = Object.fromEntries(
    await Promise.all(
      fixtureFiles.map(async (file) => {
        const fixture = await readFixture(file);
        assert.equal(fixture.text.endsWith("\n"), true, `${file} should be LF-terminated`);
        assert.equal(fixture.text.includes("\r"), false, `${file} should be LF-only`);
        return [file, fixture.json];
      })
    )
  );

  assert.equal(fixtures["current-host-policy-review-record.json"].compatibility, "compatible");
  assert.equal(
    fixtures["same-major-future-minor-host-policy-review-record.json"].compatibility,
    "upgrade_available"
  );
  assert.equal(
    fixtures["unsupported-major-host-policy-review-record.json"].compatibility,
    "unsupported_major"
  );
  assert.equal(
    fixtures["malformed-missing-schema-version-host-policy-review-record.json"].compatibility,
    "malformed"
  );
  assert.equal(
    fixtures["malformed-missing-policy-digest-host-policy-review-record.json"].compatibility,
    "malformed"
  );
  assert.equal(
    fixtures["malformed-permissive-approval-runtime-effect-host-policy-review-record.json"]
      .decision.approvalRuntimeEffectAllowed,
    true
  );
  assert.equal(
    fixtures["rejected-permissive-policy-host-policy-review-record.json"].compatibility,
    "rejected_policy"
  );
  assert.equal(
    fixtures["rejected-permissive-policy-host-policy-review-record.json"].decision.status,
    "review-rejected"
  );
  assert.deepEqual(
    fixtures["rejected-permissive-policy-host-policy-review-record.json"].diagnostics.errors,
    ["policy metadata contains a runtime-permissive policy"]
  );
});

test("Phase 4.0F docs and report describe static review artifacts only", async () => {
  const [phase40FDoc, reportSource, ...indexedDocs] = await Promise.all([
    readFile(phase40FDocUrl, "utf8"),
    readFile(reportScriptUrl, "utf8"),
    ...docUrls.map((url) => readFile(url, "utf8"))
  ]);

  for (const requiredPhrase of [
    "static host-policy review-record artifacts",
    "does not implement process-level stdio ownership",
    "approval and rejection fields are inert review metadata",
    "do not grant runtime approval",
    "future live runtime remains blocked",
    "classify_host_policy_review_record_json()"
  ]) {
    assert.match(phase40FDoc, new RegExp(requiredPhrase.replace(/[()]/g, "\\$&"), "i"));
  }

  for (const source of indexedDocs) {
    assert.match(source, /docs\/phase-4-0f-host-policy-review-records\.md/);
  }

  assert.match(reportSource, /phase40FInventory/);
  assert.match(reportSource, /stdioPolicyReviewRecords/);
  assert.match(reportSource, /reviewRecordDoesNotGrantRuntimeApproval/);
});

test("Phase 4.0F source guards prevent live runtime, stdio, network, write, and approval-grant paths", async () => {
  const [rustSource, cliSource, reportSource] = await Promise.all([
    readFile(rustHostSourceUrl, "utf8"),
    readFile(cliSourceUrl, "utf8"),
    readFile(reportScriptUrl, "utf8")
  ]);
  const nonTestRust = stripRustTests(rustSource);
  const reviewRecordSection = phase40FReviewRecordSection(nonTestRust);

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
    /read_production_signing_key/i,
    /grant_runtime_approval/i,
    /runtime_approval_granted/i
  ]) {
    assert.doesNotMatch(reviewRecordSection, forbiddenRustPattern);
  }

  for (const forbiddenCliPattern of [
    /host-policy-review/i,
    /policy-metadata/i,
    /host-policy-export/i,
    /stdio_transport_policy_metadata/,
    /host_policy_review_record/,
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
