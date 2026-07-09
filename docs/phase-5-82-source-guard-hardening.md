# Phase 5.82 — Source-guard hardening (sha256 digest-based guards)

**Date:** 2026-07-09
**Status:** review-only, metadata-only, non-authorizing, runtime-blocked
**Preceding phase:** Phase 5.81 (report-test compaction + suite performance)
**Recommended next phase:** `phase-5.83-external-reference-policy`

## What this phase records

The conversion of git-baseline (commit-hash) source guards to sha256
digest-based guards, the restoration of `cargo clippy --all-targets` in CI,
the removal of the `core.fileMode false` CI workaround, and a clippy
`explicit_counter_loop` lint fix in `crates/ardyn-host/src/lib.rs`.

## Changes

1. **Digest-based source guards**: 53 test files converted from git-baseline
   guards to `assertUnchanged` via `tests/helpers/source-digests.mjs`, backed
   by `tests/fixtures/source-guards/digests.json` (sha256 manifest for 9
   guarded paths).
2. **Clippy `--all-targets` restored**: The verification command in
   `header.json` and `.github/workflows/ci.yml` is now
   `cargo clippy --workspace --all-targets -- -D warnings`. This supersedes
   the Phase 5.79 clippy scope limitation.
3. **`core.fileMode` workaround removed**: The `git config core.fileMode false`
   line is removed from `.github/workflows/ci.yml`.
4. **lib.rs lint fixed**: The `explicit_counter_loop` clippy lint in
   `crates/ardyn-host/src/lib.rs` is resolved by using `enumerate()` instead
   of a manual index counter. Behavior-preserving.

## What this phase does NOT do

- Does not open any runtime surface — all runtime flags remain false.
- Does not authorize any runtime — all authorization flags remain false.
- Does not change federation behavior.
- Does not add new npm or cargo dependencies.
- Does not run checks from the report (`reportRunsChecks: false`).
- Does not alter the Fabric carve-out posture — all existing tokens carry
  forward from 5.81.

## Posture

This phase carries forward all executionPosture tokens from 5.81 and adds
`clippy-all-targets-restored core-filemode-workaround-removed
source-guards-digest-based`.

## Artifacts

- Fixture: `tests/fixtures/host-policy/phase5-82/source-guard-hardening.json`
- Core helper: `createSourceGuardHardeningForReview` in `packages/core/src/index.mjs`
- Focused test: `tests/phase5-82-source-guard-hardening.test.mjs`
- Manifest: `scripts/phase-status-manifests/phase-phase582SourceGuardHardeningBoundaryMap.json`