# Decisions

Standing decisions for the Ardyn project. These are not relitigated unless explicitly reopened.

## Architecture decisions

### D-001: Node.js core library as monolith (73k lines)
**Date:** pre-build
**Decision:** The core library lives in a single `packages/core/src/index.mjs` (73k lines, 1920 functions, 422 exports).
**Rationale:** The review-only phase system generated the file incrementally; modularization is now in progress (M0.6 extracted 3 utilities to `src/internal/utils.mjs`).
**Status:** Being incrementally modularized. Full split deferred — pattern is demonstrated, future extractions follow the same barrel re-export approach.

### D-002: Approval-gated runtime (serve-runtime)
**Date:** 2026-08-19 (M1)
**Decision:** `serve-runtime` requires `--enable-runtime` flag to produce any output, and `--approve` for non-dry-run execution.
**Rationale:** Security invariant — runtime must never execute implicitly. The approval gate is enforced in the CLI, not just documented.

### D-003: Federation client hardened — later WIRED as a gated A2A surface (superseded by M20)
**Date:** 2026-07-05 (PR #4) + 2026-08-19 (M4 hardening)
**Decision:** `packages/fabric/src/federation.mjs` is present and hardened (redirect:manual, host allowlist, response cap, identity confinement). UPDATE (M20): the CLI now imports it for a GATED A2A exchange (`--enable-federation-exchange --approve`); status/config remain ungated reads.
**Rationale:** Security invariant — the federation client must be hardened before wiring. Hardening is complete; wiring requires explicit authorization.

### D-004: reviewedAtDefaulted field
**Date:** 2026-08-19 (M0.3)
**Decision:** All `create*ForReview` helpers now include a `reviewedAtDefaulted: boolean` field. When `reviewedAt` was absent/invalid and fell back to the default constant, the field is `true`.
**Rationale:** Prevents silent fabrication of provenance. The backfilled value is still present (backward compat) but now explicitly marked.

### D-005: Glob source guards
**Date:** 2026-08-19 (M0.2)
**Decision:** Source-guard tests scan all `.mjs` files under each source directory, not just the barrel re-export file.
**Rationale:** Prevents silent guard bypass when `index.mjs` is modularized into `src/phases/*.mjs`.

### D-006: Real JSON Schemas for boundary maps
**Date:** 2026-08-19 (M0.5)
**Decision:** 103 real JSON Schemas generated from fixture shapes, each enforcing type constraints + safety invariants (reviewOnly: const true, authoritative: const false).
**Rationale:** Replaces nominal string matching with actual shape validation.

## Blocked decisions

### D-B01: Embedded DB engine selection
**Date:** 2026-08-19 (M3)
**Decision:** BLOCKED — needs founder decision on which embedded DB engine to use (SQLite via better-sqlite3, or a different engine).
**Rationale:** The boundary-map specs (5.61/5.76) describe the contract but don't mandate a specific implementation. Adding a DB engine requires a new dependency, which needs explicit approval per the dependency allowlist policy.

### D-B02: Federation client wiring
**Decision:** Originally BLOCKED; M20 authorized wiring behind explicit approval flags with closed sibling allowlists and Ed25519 verification enforced on every message.
**Rationale:** Wiring requires explicit authorization. The pre-wiring hardening (M4) is complete.