import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { readdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import test from "node:test";
import {
  REPORT_SCRIPT_COMPACTION_BOUNDARY_MAP_SCHEMA,
  createReportScriptCompactionForReview
} from "../packages/core/src/index.mjs";

const reviewedAt = "2026-07-08T00:00:00.000Z";
const fixtureUrl = new URL("../tests/fixtures/host-policy/phase5-80/report-script-compaction.json", import.meta.url);
const manifestDir = fileURLToPath(new URL("../scripts/phase-status-manifests/", import.meta.url));

const expectedCaseClassifications = Object.freeze({
  "valid": "valid_report_script_compaction_boundary_map_manifest_driven_byte_identical",
  "malformed": "malformed_report_script_compaction_boundary_map_input_rejected",
  "unknown-field": "unknown_top_level_field_report_script_compaction_boundary_map_input_rejected",
  "authorization-flags": "authorization_flags_enabled_report_script_compaction_boundary_map_input_rejected",
  "report-runs-checks": "report_runs_checks_true_report_script_compaction_boundary_map_input_rejected",
  "unsafe-flags": "unsafe_report_script_compaction_runtime_flags_report_script_compaction_boundary_map_input_rejected",
  "nested-unsafe": "nested_unsafe_flags_report_script_compaction_boundary_map_input_rejected"
});

function assertAllFalse(record) { for (const [k,v] of Object.entries(record)) assert.equal(v, false, `${k} should be false`); }
function assertNonAuthorizing(r) {
  assert.equal(r.reviewOnly, true); assert.equal(r.metadataOnly, true); assert.equal(r.authoritative, false);
  assert.equal(r.nonAuthorizingProof, true); assert.equal(r.reportRunsChecks, false); assertAllFalse(r.runtimeEffect);
}

test("Phase 5.80 fixture is deterministic", async () => {
  const fixture = JSON.parse(await readFile(fixtureUrl, "utf8"));
  const generated = createReportScriptCompactionForReview({ reviewedAt });
  assert.deepEqual(fixture, generated);
  assert.equal(fixture.schema, REPORT_SCRIPT_COMPACTION_BOUNDARY_MAP_SCHEMA);
  assert.equal(fixture.reportScriptCompactionBoundaryMapProduced, true);
  assertNonAuthorizing(fixture);
});

test("Phase 5.80 covers 5 boundary families", async () => {
  const fixture = JSON.parse(await readFile(fixtureUrl, "utf8"));
  const summary = fixture.boundaryMapSummary;
  assert.equal(summary.boundaryEntryCount, 5);
  assert.equal(summary.manifestExtractionRecorded, true);
  assert.equal(summary.genericLoaderRecorded, true);
  assert.equal(summary.byteIdentityVerified, true);
  assert.equal(summary.localStatusPreserved, true);
  assert.equal(summary.contributingUpdated, true);
  assert.equal(summary.hashesIdentical, true);
  assert.equal(summary.goldenSha256, "fb3db82927400187a50c58a36112977f283ffecd0da36b0bd92ac0920bab5125");
  assert.equal(summary.newSha256, "fb3db82927400187a50c58a36112977f283ffecd0da36b0bd92ac0920bab5125");
});

test("Phase 5.80 recommendedNextPhase is phase-5.81", async () => {
  const fixture = JSON.parse(await readFile(fixtureUrl, "utf8"));
  assert.equal(fixture.recommendedNextPhase, "phase-5.81-report-test-compaction");
});

test("Phase 5.80 manifest count equals phase inventory count", async () => {
  const index = JSON.parse(await readFile(new URL("../scripts/phase-status-manifests/index.json", import.meta.url), "utf8"));
  const files = readdirSync(manifestDir).filter(f => f.startsWith("phase-") && f.endsWith(".json") && f !== "index.json");
  // 114 original phase manifests + 1 5.80 + 1 5.81 + 1 5.82 = 117
  // ponytail: updated by 5.82 to account for the new manifest
  assert.equal(index.length, 117);
  assert.equal(files.length, 117);
});

test("Phase 5.80 invalid cases fail closed", () => {
  const cases = [
    { name: "malformed", input: null },
    { name: "malformed", input: { reviewedAt: "not-a-date" } },
    { name: "unknown-field", input: { reviewedAt, commentary: false } },
    { name: "report-runs-checks", input: { reviewedAt, reportRunsChecks: true } },
    { name: "unsafe-flags", input: { reviewedAt, shellRuntimeEnabled: true } },
    { name: "nested-unsafe", input: { reviewedAt, runtimeEffect: { runtimeEnabled: true } } }
  ];
  for (const { name, input } of cases) {
    const result = createReportScriptCompactionForReview(input);
    assert.equal(result.classification, expectedCaseClassifications[name], name);
    assert.equal(result.reportScriptCompactionBoundaryMapProduced, false, name);
    assert.equal(result.boundaryEntries.length, 0, name);
    assertNonAuthorizing(result);
  }
});