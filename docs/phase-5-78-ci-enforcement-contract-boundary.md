# Phase 5.78 — Review-only CI enforcement contract boundary map

**Date:** 2026-07-06
**Status:** review-only, metadata-only, non-authorizing, runtime-blocked
**Preceding phase:** Phase 5.77 (Code Mode orchestration contract boundary map)
**Recommended next phase:** `phase-5.79-ci-enablement`

## What this phase records

Deterministic review-only metadata for a **FUTURE** CI enablement: the
contract for two GitHub Actions workflow files (ci.yml and security.yml),
written BEFORE any workflow file exists. The repo's standard contract-then-
enable two-step means 5.79 will create the actual `.github/workflows/` files
under Josh's explicit authorization, with Jules review required before merge.

**CI is check-execution over the EXISTING validation suite — it is NOT product
runtime and authorizes no runtime surface.** The contract must state this
explicitly.

Rationale: every committer is an AI agent; all ~1094 tests and every source-
guard tripwire are enforced today only by voluntary local runs. CI makes these
checks deterministic and enforced on every push and PR.

Note: Phase 5.48 area 7 records CI as "not asserted"; Phases 5.69/5.71 list CI
modification as forbidden current behavior. This phase is the contract that
authorizes 5.79 to lift that prohibition.

## Boundary families (8)

1. **ci_workflow_scope** — exactly two workflows: ci.yml (triggers: push to
   main + pull_request; concurrency cancel-in-progress) and security.yml
   (weekly schedule + workflow_dispatch). No other triggers.
   `permissions: contents: read`. No secrets. Allowed third-party actions ONLY:
   actions/checkout, actions/setup-node, dtolnay/rust-toolchain,
   Swatinem/rust-cache — each pinned to an exact version or commit SHA recorded
   in the contract.
2. **ci_job_matrix** — ci.yml jobs: node (ubuntu: npm ci; npm test; npm run
   report:phase-status smoke discarded to null), rust (ubuntu: cargo fmt
   --check; cargo clippy --workspace --all-targets -- -D warnings; cargo test
   --workspace), node-windows (windows-latest: npm ci; npm test) — included
   BECAUSE development happens on Windows and the test-script glob has a known
   Windows/Node-20 expansion hazard.
3. **security_workflow_scope** — security.yml: npm audit --audit-level=high;
   cargo audit; osv-scanner over both lockfiles. Cron-only, never blocking PRs.
4. **test_invocation_portability** — contract requirement: the npm test
   invocation must run the identical test-file set on ubuntu and windows across
   the supported Node range; record the current hazard (literal glob on Windows
   cmd + Node 20) and require 5.79 to fix it and update the report-test's pinned
   package.json script strings in the same slice.
5. **ci_offline_hermetic_guarantee** — CI runs fully OFFLINE. The fabric
   federation client's tests are hermetic (they inject fetchImpl and use fake
   tokens/loopback URLs — verified). CI MUST NEVER set or provide
   ARDYN_FABRIC_* / FABRIC_TRANSPORT_D_* / registry secrets, MUST NEVER contact a
   live sidecar or registry, and MUST NEVER wire federation into a runtime
   path. (npm test already passes with NO fabric env set.)
6. **ci_forbidden_behavior** — CI must never: publish, deploy, write to the repo,
   mint tokens, use secrets, run semgrep as a gate (semgrep stays a manual
   evidence command), auto-merge, or execute any blocked runtime surface.
   Includes the ci_offline_hermetic_guarantee prohibitions.
7. **branch_protection_expectation** — metadata only: main requires the node +
   rust checks once enabled (enablement is a human console action by Josh,
   recorded as such).
8. **ci_enablement_authorization** — explicit statement: workflow files may be
   created ONLY by 5.79 under Josh's explicit authorization, with Jules review
   required before merge.

## Cross-references (not duplicated)

| Phase | Relationship |
|---|---|
| 5.48 | Area 7 records CI as "not asserted" (this phase provides the contract) |
| 5.69 | Lists CI modification as forbidden current behavior (this phase authorizes 5.79 to lift) |
| 5.71 | Lists CI modification as forbidden current behavior (same) |
| 5.76 | Embedded DB/query-engine boundary — CI runs these tests |
| 5.76B | Fabric federation reconciliation — CI must NOT set fabric env or contact live sidecar |
| 5.77 | Code Mode orchestration — CI runs these tests; Code Mode itself stays blocked |
| `docs/posture.md` | Fabric federation carve-out (CI must not violate it) |

## Posture

This phase is **metadata-only, review-only, non-authorizing, runtime-blocked**.
`reportRunsChecks` is `false`. The Fabric Federation consumer client carve-out
from `docs/posture.md` is carried forward — CI must not set fabric env secrets
or contact a live sidecar/registry. This phase does not re-block or re-authorize
the federation client.

## Artifacts

- Fixture: `tests/fixtures/host-policy/phase5-78/ci-enforcement-contract.json`
- Core helper: `createCiEnforcementContractForReview` in `packages/core/src/index.mjs`
- Focused test: `tests/phase5-78-ci-enforcement-contract.test.mjs`
- Report wiring: `scripts/report-phase-status.mjs` + `tests/report-phase-status.test.mjs`