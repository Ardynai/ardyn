# Phase 5.81 — Report-test compaction + suite performance

**Date:** 2026-07-08
**Status:** review-only, metadata-only, non-authorizing, runtime-blocked
**Preceding phase:** Phase 5.80 (report-script compaction, byte-identical, manifest-driven)
**Recommended next phase:** `phase-5.82-source-guard-hardening`

## What this phase records

The memoization of `tests/report-phase-status.test.mjs` (120 `runReport()` calls → 1 shared
promise), the maxBuffer time-bomb defusal (16MB → 64MB + 50% guard test), and the preservation
of all invariant tests.

## Suite timing

| Metric | Before | After | Delta |
|---|---|---|---|
| `npm test` wall-clock | ~478s (7m58s) | ~197s (3m17s) | **-59%** |
| `report-phase-status.test.mjs` wall-clock | ~1500s (25min) | ~3.3s | **-99.8%** |
| `npm test` pass count | 1119 | 1121 | +2 (maxBuffer guard + fresh spawn) |

## Changes

1. **Memoized render**: `runReport()` now returns a shared `reportPromise` — one spawn, reused
   by all 120+ tests. One independent fresh-spawn test verifies clean process behavior separately.
2. **maxBuffer raised to 64MB** with a guard test that fails when report size exceeds 50% of
   the configured buffer, turning the silent future outage into a loud early warning.
3. **All invariant tests preserved**: source-guard (fs/path/url only), reportRunsChecks/externalCi
   honesty, exact-string package.json scripts assertions, current-phase id/name/executionPosture.

## Posture

This phase carries forward all executionPosture tokens from 5.80. No runtime surface opened.

## Artifacts

- Fixture: `tests/fixtures/host-policy/phase5-81/report-test-compaction.json`
- Core helper: `createReportTestCompactionForReview` in `packages/core/src/index.mjs`
- Focused test: `tests/phase5-81-report-test-compaction.test.mjs`
- Manifest: `scripts/phase-status-manifests/phase-phase581ReportTestCompactionBoundaryMap.json`