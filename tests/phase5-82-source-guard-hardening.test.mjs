import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import test from "node:test";
import {
  SOURCE_GUARD_HARDENING_BOUNDARY_MAP_SCHEMA,
  createSourceGuardHardeningForReview
} from "../packages/core/src/index.mjs";

const reviewedAt = "2026-07-09T00:00:00.000Z";
const fixtureUrl = new URL("../tests/fixtures/host-policy/phase5-82/source-guard-hardening.json", import.meta.url);

function assertAllFalse(record) { for (const [k,v] of Object.entries(record)) assert.equal(v, false, `${k}`); }
function assertNonAuthorizing(r) {
  assert.equal(r.reviewOnly, true); assert.equal(r.metadataOnly, true); assert.equal(r.authoritative, false);
  assert.equal(r.nonAuthorizingProof, true); assert.equal(r.reportRunsChecks, false); assertAllFalse(r.runtimeEffect);
}

test("Phase 5.82 fixture is deterministic", async () => {
  const fixture = JSON.parse(await readFile(fixtureUrl, "utf8"));
  const generated = createSourceGuardHardeningForReview({ reviewedAt });
  assert.deepEqual(fixture, generated);
  assert.equal(fixture.schema, SOURCE_GUARD_HARDENING_BOUNDARY_MAP_SCHEMA);
  assert.equal(fixture.sourceGuardHardeningBoundaryMapProduced, true);
  assertNonAuthorizing(fixture);
});

test("Phase 5.82 covers 4 boundary families", async () => {
  const fixture = JSON.parse(await readFile(fixtureUrl, "utf8"));
  const s = fixture.boundaryMapSummary;
  assert.equal(s.boundaryEntryCount, 4);
  assert.equal(s.digestGuard, true);
  assert.equal(s.clippyAllTargetsRestored, true);
  assert.equal(s.ciFilemodeWorkaroundRemoved, true);
  assert.equal(s.libRsLintFixed, true);
  assert.equal(s.guardedPathCount, 9);
  assert.equal(s.gitBaselineGuardsRemaining, 0);
});

test("Phase 5.82 records 5.79 clippy scope supersession", async () => {
  const fixture = JSON.parse(await readFile(fixtureUrl, "utf8"));
  assert.ok(fixture.boundaryMapSummary.clippyScopeSupersessionFromPhase579.includes("5.79"));
  assert.ok(fixture.boundaryMapSummary.clippyScopeSupersessionFromPhase579.includes("--all-targets"));
});

test("Phase 5.82 recommendedNextPhase is phase-5.83", async () => {
  const fixture = JSON.parse(await readFile(fixtureUrl, "utf8"));
  assert.equal(fixture.recommendedNextPhase, "phase-5.83-external-reference-policy");
});

test("Phase 5.82 all boundary entries non-authorizing with all flags false", async () => {
  const fixture = JSON.parse(await readFile(fixtureUrl, "utf8"));
  for (const entry of fixture.boundaryEntries) {
    assert.equal(entry.nonAuthorizingProof, true);
    assertAllFalse(entry.explicitBlockedAuthorizationFlags);
    assertAllFalse(entry.unsafeSourceGuardHardeningRuntimeFlags);
    assertAllFalse(entry.runtimeEffect);
  }
});

test("Phase 5.82 invalid cases fail closed", () => {
  for (const [name, input] of [
    ["malformed", null],
    ["malformed", { reviewedAt: "not-a-date" }],
    ["report-runs-checks", { reviewedAt, reportRunsChecks: true }],
    ["unsafe-flags", { reviewedAt, shellRuntimeEnabled: true }],
    ["nested-unsafe", { reviewedAt, runtimeEffect: { runtimeEnabled: true } }]
  ]) {
    const result = createSourceGuardHardeningForReview(input);
    assert.equal(result.sourceGuardHardeningBoundaryMapProduced, false, name);
    assert.equal(result.boundaryEntries.length, 0, name);
    assertNonAuthorizing(result);
  }
});