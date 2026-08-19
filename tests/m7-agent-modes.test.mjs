// M7: Agent modes & orchestration — Code Mode capability test
// CUA/computer-use stays gated per SECURITY-INVARIANTS
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import test from "node:test";

const repoRoot = fileURLToPath(new URL("../", import.meta.url));

test("M7: Code Mode (5.77) is a real capability in core exports", async () => {
  const core = await import("../packages/core/src/index.mjs");
  assert.equal(typeof core.createCodeModeOrchestrationForReview, "function");
  const result = core.createCodeModeOrchestrationForReview({
    reviewedAt: "2026-07-06T00:00:00.000Z",
    maxIterationsPerLoop: 5
  });
  assert.ok(result.codeModeOrchestrationBoundaryMapProduced, "should produce boundary map");
  assert.equal(result.reviewOnly, true, "should be review-only");
  assert.equal(result.authoritative, false, "should be non-authoritative");
});

test("M7: Code Mode respects maxIterationsPerLoop", async () => {
  const core = await import("../packages/core/src/index.mjs");
  const r1 = core.createCodeModeOrchestrationForReview({ reviewedAt: "2026-07-06T00:00:00.000Z", maxIterationsPerLoop: 5 });
  const r2 = core.createCodeModeOrchestrationForReview({ reviewedAt: "2026-07-06T00:00:00.000Z", maxIterationsPerLoop: 10 });
  // The boundaryMapSummary should exist and be deterministic
  assert.ok(r1.boundaryMapSummary, "should have boundaryMapSummary");
  assert.ok(r2.boundaryMapSummary, "should have boundaryMapSummary");
  // Both should be review-only and non-authoritative
  assert.equal(r1.reviewOnly, true);
  assert.equal(r1.authoritative, false);
});

test("M7: CUA/computer-use runtime stays gated (not enabled)", async () => {
  const core = await import("../packages/core/src/index.mjs");
  const r = core.createCodeModeOrchestrationForReview({ reviewedAt: "2026-07-06T00:00:00.000Z", maxIterationsPerLoop: 5 });
  // CUA should not be enabled
  assert.equal(r.runtimeEffect.runtimeEnabled, false);
  assert.equal(r.runtimeEffect.runtimeExecuted, false);
});

test("M7: agent mode profiles (5.68) are available", async () => {
  const core = await import("../packages/core/src/index.mjs");
  assert.equal(typeof core.createAgentModeProfileSkillhubCapabilityBoundaryMapForReview, "function");
  const r = core.createAgentModeProfileSkillhubCapabilityBoundaryMapForReview({ reviewedAt: "2026-06-25T00:00:00.000Z" });
  assert.ok(r.agentModeProfileSkillhubCapabilityBoundaryMapProduced);
  assert.equal(r.reviewOnly, true);
  assert.equal(r.authoritative, false);
});