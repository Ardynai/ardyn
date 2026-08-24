# Modularization Map — packages/core/src/index.mjs

Status: **COMPLETE** as of branch `feat/final-closeout`. Measured line counts, not estimates.

## FINAL RESULTS (measured on feat/final-closeout)

| | lines (Measure-Object, non-blank) |
|---|---|
| pre-modularization main (`dcec8de^1`, before PR #26) | 68,913 (73,216 physical incl. blanks) |
| start of this final batch (`origin/main` `1f21872`) | 11,249 |
| `index.mjs` after this batch | **4,182** |
| total reduction vs pre-modularization | **−64,731 lines (−93.9%)** |

Public surface: FROZEN at 429 named exports (enforced by `tests/export-surface.test.mjs`
fixture snapshot + origin/main parity check). Zero added, zero lost. Verified green
after every extraction group.

## What remains in index.mjs and why

| Domain | ~Lines | Status |
|---|---|---|
| Runtime kernel: ajv instance + schema registrations and module-load side effects; identity/manifest/task/transcript/session-event/failure-audit validation plumbing; approval-gate + capability matching core; host-policy review-record comparison family (incl. `formatHostPolicyReviewRecordComparisonJson`, which belongs to that kernel-resident family); fs/crypto path helpers; static identity/doctor builders; re-export barrel for extracted modules | ~4,180 | INTENTIONAL STAYS — owns module-load side effects (`new Ajv2020()` + `addSchema`); every domain depends on it transitively; moving it would invert the dependency direction. Documented end state per plan. |

No undocumented remnants. The only removal outside move-and-re-export was
`reviewOnlyInspectionHandoffMetadataBoundaryPathValue` (10 lines): a dead private
helper duplicated by the live `reviewOnlyInspectionHandoffMetadataBoundaryKeyTruePresent`
in `internal/review-shared.mjs`; zero references repo-wide (grep-verified), not exported,
so the public surface and behavior are unchanged.

## Extracted modules (cumulative across PR #26/#27 + this branch)

| Module | Domain | Exports via re-export shim |
|---|---|---|
| `internal/utils.mjs` | stableJsonStringify chain, reviewedAt defaults, plain-object guards | internal-only |
| `internal/review-shared.mjs` | Tier-1 shared helpers (stable stringify chain, runtime-effect skeletons, boundary patterns) + `*ForbiddenBehavior` family | internal-only |
| `internal/diagnostic-redaction.mjs` | stderr diagnostic-redaction engine (phase 4.1c) | 6 |
| `internal/paths.mjs`, `internal/redaction.mjs` | small shared utilities | internal-only |
| `governance-reports.mjs` | fabric-federation reconciliation, code-mode orchestration, CI enforcement/enablement, report compaction, source-guard hardening, external-reference policy | ~40 |
| `consumer-display.mjs` | consumer-display accessibility maps, fixture schema boundaries, example packs, conformance handoffs, runner requirements/plans/results | ~40 |
| `review-artifacts.mjs` | review-artifact & approval-evaluator pipeline (prerequisite reader/preflight/selection/bundle/consumption/integration checkpoints, intake, dispositions, aggregation/readiness layers, consumer-contract gap/readiness matrices, target-consumer planning) | ~120 |
| `boundary-maps/infrastructure.mjs` | infrastructure boundary-map singles band (security-RLS … embedded-db query, 5.63–5.76 singles) | large barrel |
| `stdio-framing-redaction.mjs` *(this branch)* | stdio framing-redaction contract family: JSONL whole-line bundle validation/classifications + framing/redaction contract builder/formatters | 12 |
| `boundary-maps/production-readiness-coverage.mjs` *(this branch)* | production-readiness coverage matrix (5.48): rows/status counts/top gaps, fail-closed classifications | 4 |
| `boundary-maps/fabric-aware-api-backend.mjs` *(this branch)* | fabric-aware API backend contract boundary map (5.59) | 4 |
| `boundary-maps/inter-agent-handoff-conformance.mjs` *(this branch)* | inter-agent encoded-handoff conformance (5.60): one-click options, fail-closed hidden-semantics checks | 4 |
| `boundary-maps/database-storage.mjs` *(this branch)* | database-storage contract boundary map (5.61) | 4 |
| `boundary-maps/auth-permissions.mjs` *(this branch)* | auth-permissions contract boundary map (5.62) | 4 |

This-branch deltas (measured `Measure-Object -Line` on `index.mjs`):

| Group | Commit | index.mjs lines |
|---|---|---|
| start | `1f21872` (origin/main) | 11,249 |
| gB stdio-framing-redaction | `13852f2` | 11,044 |
| gC production-readiness-coverage | `a0893cf` | 9,895 |
| gD fabric-aware-api-backend | `0c98101` | 8,907 |
| gE inter-agent-handoff-conformance | `250747e` | 7,378 |
| gF database-storage | `143dd1a` | 5,836 |
| gG auth-permissions | `4135c12` | 4,192 |
| gH dead-helper removal | `a020cff` | **4,182** |

## Method that worked

1. Lexical scan → symbol table (name, kind, start/end line) with a string/comment/
   template/regex-aware lexer; union-find over intra-file references → connected
   components. The kernel is one component; every extractable family was a separate,
   fully self-contained component (zero inbound/outbound refs).
2. Cut each family's exact line ranges into a new module (move verbatim, `export`
   keywords intact); auto-resolve free identifiers to imports from `internal/*`,
   sibling modules, or node builtins.
3. Append an `export { … } from "./<module>.mjs";` shim in index.mjs listing exactly
   the family's public names.
4. Per-group gate: `node --check` both files → import smoke (429 exports) →
   `tests/export-surface.test.mjs` parity → full Node suite (1484 tests) →
   `cargo build` + `cargo fmt --check` + `cargo clippy --workspace --all-targets --
   -D warnings` + `cargo test --workspace` → commit naming module + line delta.
5. Source-guard digests: no pinned digest required refresh during this batch — no
   test asserts a digest for `packages/core/src/index.mjs` (the phase-5.82 manifest
   entry is dormant); the glob source guards scan directories and stayed green
   throughout, so the sanctioned `refreshManifest` path was never needed.
