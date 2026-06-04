import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  ARDYN_HOST_POLICY_REVIEW_COMPARISON_PHASE,
  HOST_POLICY_REVIEW_RECORD_COMPARISON_SCHEMA,
  compareHostPolicyReviewRecords,
  classifyHostPolicyReviewRecordCompatibility,
  formatHostPolicyReviewRecordComparisonJson
} from "../packages/core/src/index.mjs";

const phase40FFixtureRootUrl = new URL(
  "../tests/fixtures/host-policy/phase4-0f/",
  import.meta.url
);
const phase40GFixtureRootUrl = new URL(
  "../tests/fixtures/host-policy/phase4-0g/",
  import.meta.url
);
const coreSourceUrl = new URL("../packages/core/src/index.mjs", import.meta.url);
const coreTypesUrl = new URL("../packages/core/src/index.d.ts", import.meta.url);
const cliSourceUrl = new URL("../apps/cli/src/index.mjs", import.meta.url);
const reportScriptUrl = new URL("../scripts/report-phase-status.mjs", import.meta.url);
const phase40GDocUrl = new URL(
  "../docs/phase-4-0g-host-policy-review-comparison.md",
  import.meta.url
);
const docUrls = [
  new URL("../README.md", import.meta.url),
  new URL("../apps/cli/README.md", import.meta.url),
  new URL("../packages/core/README.md", import.meta.url),
  new URL("../docs/host-policy-preconditions.md", import.meta.url),
  new URL("../docs/phase-4-0f-host-policy-review-records.md", import.meta.url)
];

const comparisonFixtureFiles = Object.freeze([
  "identical-current-host-policy-review-comparison.json",
  "same-major-future-minor-upgrade-available-host-policy-review-comparison.json",
  "unsupported-major-fail-closed-host-policy-review-comparison.json",
  "malformed-missing-schema-version-host-policy-review-comparison.json",
  "rejected-permissive-policy-host-policy-review-comparison.json",
  "policy-digest-mismatch-host-policy-review-comparison.json",
  "runtime-status-mismatch-host-policy-review-comparison.json"
]);

const comparisonTopLevelOrder = Object.freeze([
  "schema",
  "schemaVersion",
  "comparisonPhase",
  "artifactKind",
  "equal",
  "differenceCount",
  "failClosed",
  "manualReviewRequired",
  "comparisonDecision",
  "left",
  "right",
  "differences",
  "nonExecuting",
  "safety"
]);

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

async function readJson(url) {
  return JSON.parse(await readFile(url, "utf8"));
}

async function readPhase40FRecord(file) {
  return readJson(new URL(file, phase40FFixtureRootUrl));
}

async function readPhase40GFixture(file) {
  const url = new URL(file, phase40GFixtureRootUrl);
  const text = await readFile(url, "utf8");
  return {
    text,
    json: JSON.parse(text)
  };
}

function withDigestMismatch(record) {
  const changed = clone(record);
  changed.policyMetadataDigestHex = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
  return changed;
}

function withRuntimeStatusMismatch(record) {
  const changed = clone(record);
  changed.runtimeStatus = "live-runtime-enabled";
  return changed;
}

function assertNoRuntimeApproval(comparison) {
  assert.equal(comparison.comparisonDecision.reviewMetadataOnly, true);
  assert.equal(comparison.comparisonDecision.runtimeApprovalGranted, false);
  assert.equal(comparison.comparisonDecision.runtimeApprovalDerivedFromComparison, false);
  assert.equal(comparison.comparisonDecision.approvalMetadataInert, true);
  assert.equal(comparison.comparisonDecision.rejectionMetadataInert, true);
  assert.equal(
    comparison.comparisonDecision.futureLiveRuntimeBlockedUntilSeparateApprovedPhase,
    true
  );
  assert.equal(comparison.nonExecuting, true);
  for (const [key, value] of Object.entries(comparison.safety)) {
    assert.equal(value, false, `${key} should remain false`);
  }
  for (const difference of comparison.differences) {
    assert.equal(difference.reviewEvidenceOnly, true);
    assert.equal(difference.grantsRuntimeApproval, false);
  }
}

async function assertMatchesComparisonFixture(file, left, right) {
  const comparison = compareHostPolicyReviewRecords(left, right);
  const text = formatHostPolicyReviewRecordComparisonJson(comparison);
  const fixture = await readPhase40GFixture(file);

  assert.equal(text, fixture.text, `${file} should match helper output`);
  assert.deepEqual(Object.keys(fixture.json), comparisonTopLevelOrder);
  assertNoRuntimeApproval(fixture.json);
  return fixture.json;
}

test("Phase 4.0G core exposes static display-only comparison helpers", async () => {
  const [source, types] = await Promise.all([
    readFile(coreSourceUrl, "utf8"),
    readFile(coreTypesUrl, "utf8")
  ]);

  for (const requiredSymbol of [
    "HOST_POLICY_REVIEW_RECORD_COMPARISON_SCHEMA",
    "ARDYN_HOST_POLICY_REVIEW_COMPARISON_PHASE",
    "classifyHostPolicyReviewRecordCompatibility",
    "normalizeHostPolicyReviewRecordForDisplay",
    "buildHostPolicyReviewRecordDisplaySummary",
    "compareHostPolicyReviewRecords",
    "formatHostPolicyReviewRecordComparisonJson"
  ]) {
    assert.match(source, new RegExp(`\\b${requiredSymbol}\\b`));
    assert.match(types, new RegExp(`\\b${requiredSymbol}\\b`));
  }

  assert.equal(HOST_POLICY_REVIEW_RECORD_COMPARISON_SCHEMA, "ardyn.host-policy-review-record-comparison");
  assert.equal(
    ARDYN_HOST_POLICY_REVIEW_COMPARISON_PHASE,
    "phase-4.0g-host-policy-review-comparison"
  );
});

test("Phase 4.0G comparison fixtures are deterministic LF-only JSON", async () => {
  for (const file of comparisonFixtureFiles) {
    const fixture = await readPhase40GFixture(file);

    assert.equal(fixture.text.endsWith("\n"), true, `${file} should be LF-terminated`);
    assert.equal(fixture.text.includes("\r"), false, `${file} should be LF-only`);
    assert.deepEqual(Object.keys(fixture.json), comparisonTopLevelOrder);
    assert.equal(fixture.json.schema, HOST_POLICY_REVIEW_RECORD_COMPARISON_SCHEMA);
    assert.equal(fixture.json.schemaVersion, "0.1.0");
    assert.equal(fixture.json.comparisonPhase, ARDYN_HOST_POLICY_REVIEW_COMPARISON_PHASE);
    assert.equal(fixture.json.artifactKind, "host_policy_review_record");
    assertNoRuntimeApproval(fixture.json);
  }
});

test("identical host-policy review records compare cleanly", async () => {
  const current = await readPhase40FRecord("current-host-policy-review-record.json");
  const comparison = await assertMatchesComparisonFixture(
    "identical-current-host-policy-review-comparison.json",
    current,
    clone(current)
  );

  assert.equal(comparison.equal, true);
  assert.equal(comparison.differenceCount, 0);
  assert.equal(comparison.failClosed, false);
  assert.equal(comparison.manualReviewRequired, false);
  assert.deepEqual(comparison.differences, []);
  assert.equal(comparison.left.compatibility.classification, "compatible");
  assert.equal(comparison.right.compatibility.classification, "compatible");
});

test("same-major future-minor review records remain display-only upgrade metadata", async () => {
  const current = await readPhase40FRecord("current-host-policy-review-record.json");
  const sameMajor = await readPhase40FRecord(
    "same-major-future-minor-host-policy-review-record.json"
  );
  const comparison = await assertMatchesComparisonFixture(
    "same-major-future-minor-upgrade-available-host-policy-review-comparison.json",
    current,
    sameMajor
  );

  assert.equal(classifyHostPolicyReviewRecordCompatibility(sameMajor), "upgrade_available");
  assert.equal(comparison.failClosed, false);
  assert.equal(comparison.manualReviewRequired, true);
  assert.deepEqual(
    comparison.differences.map((difference) => [difference.type, difference.path]),
    [
      ["record-version-mismatch", "schemaVersion"],
      ["compatibility-classification-change", "compatibility"]
    ]
  );
});

test("unsupported-major and malformed review-record comparisons fail closed", async () => {
  const current = await readPhase40FRecord("current-host-policy-review-record.json");
  const unsupportedMajor = await readPhase40FRecord(
    "unsupported-major-host-policy-review-record.json"
  );
  const malformed = await readPhase40FRecord(
    "malformed-missing-schema-version-host-policy-review-record.json"
  );

  const unsupportedComparison = await assertMatchesComparisonFixture(
    "unsupported-major-fail-closed-host-policy-review-comparison.json",
    current,
    unsupportedMajor
  );
  assert.equal(classifyHostPolicyReviewRecordCompatibility(unsupportedMajor), "unsupported_major");
  assert.equal(unsupportedComparison.failClosed, true);
  assert.equal(unsupportedComparison.right.compatibility.failClosed, true);

  const malformedComparison = await assertMatchesComparisonFixture(
    "malformed-missing-schema-version-host-policy-review-comparison.json",
    current,
    malformed
  );
  assert.equal(classifyHostPolicyReviewRecordCompatibility(malformed), "malformed");
  assert.equal(malformedComparison.failClosed, true);
  assert.equal(malformedComparison.right.compatibility.failClosed, true);
});

test("rejected permissive policy comparison remains inert review metadata", async () => {
  const current = await readPhase40FRecord("current-host-policy-review-record.json");
  const rejected = await readPhase40FRecord(
    "rejected-permissive-policy-host-policy-review-record.json"
  );
  const comparison = await assertMatchesComparisonFixture(
    "rejected-permissive-policy-host-policy-review-comparison.json",
    current,
    rejected
  );

  assert.equal(classifyHostPolicyReviewRecordCompatibility(rejected), "rejected_policy");
  assert.equal(comparison.failClosed, true);
  assert.equal(comparison.right.decision.status, "review-rejected");
  assert.deepEqual(comparison.right.diagnostics.errors, [
    "policy metadata contains a runtime-permissive policy"
  ]);
});

test("digest mismatch is surfaced as review evidence only", async () => {
  const current = await readPhase40FRecord("current-host-policy-review-record.json");
  const digestMismatch = withDigestMismatch(current);
  const comparison = await assertMatchesComparisonFixture(
    "policy-digest-mismatch-host-policy-review-comparison.json",
    current,
    digestMismatch
  );

  assert.equal(classifyHostPolicyReviewRecordCompatibility(digestMismatch), "compatible");
  assert.equal(comparison.failClosed, true);
  assert.equal(comparison.manualReviewRequired, true);
  assert.deepEqual(
    comparison.differences.map((difference) => [difference.type, difference.path]),
    [["policy-metadata-digest-mismatch", "policyMetadataDigestHex"]]
  );
});

test("runtime-status mismatch is malformed and fails closed", async () => {
  const current = await readPhase40FRecord("current-host-policy-review-record.json");
  const runtimeMismatch = withRuntimeStatusMismatch(current);
  const comparison = await assertMatchesComparisonFixture(
    "runtime-status-mismatch-host-policy-review-comparison.json",
    current,
    runtimeMismatch
  );

  assert.equal(classifyHostPolicyReviewRecordCompatibility(runtimeMismatch), "malformed");
  assert.equal(comparison.failClosed, true);
  assert.equal(comparison.right.compatibility.classification, "malformed");
  assert.match(
    comparison.right.compatibility.validationErrors.join("\n"),
    /runtimeStatus must be pre-runtime-policy-only/
  );
});

test("approval metadata remains inert and runtime-effect approval fields are malformed", async () => {
  const current = await readPhase40FRecord("current-host-policy-review-record.json");
  const approved = clone(current);
  approved.decision.status = "review-approved";
  approved.decision.approvalRecorded = true;

  const comparison = compareHostPolicyReviewRecords(current, approved);
  assert.equal(comparison.failClosed, false);
  assert.equal(comparison.manualReviewRequired, true);
  assert.deepEqual(
    comparison.differences.map((difference) => [difference.type, difference.path]),
    [
      ["decision-status-change", "decision.status"],
      ["decision-metadata-change", "decision"]
    ]
  );
  assertNoRuntimeApproval(comparison);

  const permissiveApproval = await readPhase40FRecord(
    "malformed-permissive-approval-runtime-effect-host-policy-review-record.json"
  );
  assert.equal(classifyHostPolicyReviewRecordCompatibility(permissiveApproval), "malformed");
});

test("Phase 4.0G docs and report describe static comparison only", async () => {
  const [phase40GDoc, reportSource, ...indexedDocs] = await Promise.all([
    readFile(phase40GDocUrl, "utf8"),
    readFile(reportScriptUrl, "utf8"),
    ...docUrls.map((url) => readFile(url, "utf8"))
  ]);

  for (const requiredPhrase of [
    "static display-only comparison",
    "Devin/Codex review workflows",
    "does not start runtime behavior",
    "does not approve runtime behavior",
    "future live runtime remains blocked",
    "compareHostPolicyReviewRecords"
  ]) {
    assert.match(phase40GDoc, new RegExp(requiredPhrase.replace(/[()]/g, "\\$&"), "i"));
  }

  for (const source of indexedDocs) {
    assert.match(source, /docs\/phase-4-0g-host-policy-review-comparison\.md/);
  }

  assert.match(reportSource, /phase40GInventory/);
  assert.match(reportSource, /hostPolicyReviewComparison/);
  assert.match(reportSource, /comparisonDoesNotGrantRuntimeApproval/);
});

test("Phase 4.0G source guards do not add live runtime or CLI command surfaces", async () => {
  const [coreSource, cliSource, reportSource] = await Promise.all([
    readFile(coreSourceUrl, "utf8"),
    readFile(cliSourceUrl, "utf8"),
    readFile(reportScriptUrl, "utf8")
  ]);

  for (const forbiddenCorePattern of [
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
    assert.doesNotMatch(coreSource, forbiddenCorePattern);
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
