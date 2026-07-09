import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import test from "node:test";
import {
  REPORT_TEST_COMPACTION_BOUNDARY_MAP_SCHEMA,
  createReportTestCompactionForReview
} from "../packages/core/src/index.mjs";

const reviewedAt = "2026-07-08T00:00:00.000Z";
const fixtureUrl = new URL("../tests/fixtures/host-policy/phase5-81/report-test-compaction.json", import.meta.url);

function assertAllFalse(record) { for (const [k,v] of Object.entries(record)) assert.equal(v, false, `${k}`); }
function assertNonAuthorizing(r) {
  assert.equal(r.reviewOnly, true); assert.equal(r.metadataOnly, true); assert.equal(r.authoritative, false);
  assert.equal(r.nonAuthorizingProof, true); assert.equal(r.reportRunsChecks, false); assertAllFalse(r.runtimeEffect);
}

test("Phase 5.81 fixture is deterministic", async () => {
  const fixture = JSON.parse(await readFile(fixtureUrl, "utf8"));
  const generated = createReportTestCompactionForReview({ reviewedAt });
  assert.deepEqual(fixture, generated);
  assert.equal(fixture.schema, REPORT_TEST_COMPACTION_BOUNDARY_MAP_SCHEMA);
  assert.equal(fixture.reportTestCompactionBoundaryMapProduced, true);
  assertNonAuthorizing(fixture);
});

test("Phase 5.81 covers 4 boundary families", async () => {
  const fixture = JSON.parse(await readFile(fixtureUrl, "utf8"));
  const s = fixture.boundaryMapSummary;
  assert.equal(s.boundaryEntryCount, 4);
  assert.equal(s.memoizedSharedRender, true);
  assert.equal(s.maxbufferGuard, true);
  assert.equal(s.freshSpawnTest, true);
  assert.equal(s.invariantPreservation, true);
});

test("Phase 5.81 recommendedNextPhase is phase-5.82", async () => {
  const fixture = JSON.parse(await readFile(fixtureUrl, "utf8"));
  assert.equal(fixture.recommendedNextPhase, "phase-5.82-source-guard-hardening");
});

test("Phase 5.81 invalid cases fail closed", () => {
  for (const [name, input] of [
    ["malformed", null],
    ["malformed", { reviewedAt: "not-a-date" }],
    ["report-runs-checks", { reviewedAt, reportRunsChecks: true }],
    ["unsafe-flags", { reviewedAt, shellRuntimeEnabled: true }],
    ["nested-unsafe", { reviewedAt, runtimeEffect: { runtimeEnabled: true } }]
  ]) {
    const result = createReportTestCompactionForReview(input);
    assert.equal(result.reportTestCompactionBoundaryMapProduced, false, name);
    assert.equal(result.boundaryEntries.length, 0, name);
    assertNonAuthorizing(result);
  }
});