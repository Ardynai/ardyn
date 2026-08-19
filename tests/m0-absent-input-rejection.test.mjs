// M0.3: Test that absent/invalid reviewedAt input carries an explicit defaulted:true flag
import assert from "node:assert/strict";
import test from "node:test";
import {
  createExternalReferencePolicyForReview,
  createSourceGuardHardeningForReview,
  createCodeModeOrchestrationForReview,
  createCiEnforcementContractForReview,
  preflightApprovalPrerequisiteSourcesForReview,
  createConsumerDisplayFixtureSchemaBoundaryForReview,
  createProductionReadinessCoverageMatrixForReview
} from "../packages/core/src/index.mjs";

const validReviewedAt = "2026-07-09T00:00:00.000Z";

test("M0.3: valid reviewedAt produces reviewedAtDefaulted: false", () => {
  const r = createExternalReferencePolicyForReview({ reviewedAt: validReviewedAt });
  assert.equal(r.reviewedAtDefaulted, false);
  assert.equal(r.reviewedAt, validReviewedAt);
});

test("M0.3: absent reviewedAt produces reviewedAtDefaulted: true (explicit, not fabricated)", () => {
  const r = createExternalReferencePolicyForReview({});
  assert.equal(r.reviewedAtDefaulted, true);
  // The backfilled value is still present (for backward compat) but now explicitly marked
  assert.ok(r.reviewedAt, "reviewedAt should still have a value (the default)");
});

test("M0.3: invalid reviewedAt produces reviewedAtDefaulted: true", () => {
  const r = createExternalReferencePolicyForReview({ reviewedAt: "not-a-date" });
  assert.equal(r.reviewedAtDefaulted, true);
});

test("M0.3: null input produces reviewedAtDefaulted: true", () => {
  const r = createSourceGuardHardeningForReview(null);
  assert.equal(r.reviewedAtDefaulted, true);
});

test("M0.3: Pattern A helpers (hasOwnProperty check) carry reviewedAtDefaulted", () => {
  const valid = createSourceGuardHardeningForReview({ reviewedAt: "2026-07-09T00:00:00.000Z" });
  assert.equal(valid.reviewedAtDefaulted, false);

  const absent = createSourceGuardHardeningForReview({});
  assert.equal(absent.reviewedAtDefaulted, true);

  const invalid = createSourceGuardHardeningForReview({ reviewedAt: "bad" });
  assert.equal(invalid.reviewedAtDefaulted, true);
});

test("M0.3: Pattern B helpers (MALFORMED_INPUT check) carry reviewedAtDefaulted", () => {
  const valid = createCodeModeOrchestrationForReview({ reviewedAt: "2026-07-06T00:00:00.000Z", maxIterationsPerLoop: 5 });
  assert.equal(valid.reviewedAtDefaulted, false);

  const absent = createCodeModeOrchestrationForReview({ maxIterationsPerLoop: 5 });
  assert.equal(absent.reviewedAtDefaulted, true);
});

test("M0.3: Pattern C helpers (typeof check) carry reviewedAtDefaulted", () => {
  const valid = preflightApprovalPrerequisiteSourcesForReview({ reviewedAt: "2026-07-09T00:00:00.000Z" });
  assert.equal(valid.reviewedAtDefaulted, false);

  const absent = preflightApprovalPrerequisiteSourcesForReview({});
  assert.equal(absent.reviewedAtDefaulted, true);
});

test("M0.3: reviewedAtDefaulted is present across multiple helper families", () => {
  const helpers = [
    [createCiEnforcementContractForReview, "2026-07-06T00:00:00.000Z"],
    [createConsumerDisplayFixtureSchemaBoundaryForReview, "2026-06-20T00:00:00.000Z"],
    [createProductionReadinessCoverageMatrixForReview, "2026-06-20T00:00:00.000Z"]
  ];

  for (const [fn, date] of helpers) {
    const valid = fn({ reviewedAt: date });
    assert.equal(valid.reviewedAtDefaulted, false, `${fn.name}: valid should be false`);
    const absent = fn({});
    assert.equal(absent.reviewedAtDefaulted, true, `${fn.name}: absent should be true`);
  }
});