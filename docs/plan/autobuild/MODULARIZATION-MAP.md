# Modularization Map — packages/core/src/index.mjs

Status as of branch `feat/modularize-and-rollback`. Measured line counts, not estimates.

## RESULTS (measured on feat/finish-modularization)

| | lines |
|---|---|
| `main` before this branch | 73,217 |
| `index.mjs` after extractions | **31,183** |
| reduction | **−40,034 lines (−54.7%)** |

Public surface: FROZEN at 429 named exports (enforced by `tests/export-surface.test.mjs` snapshot + origin/main parity check). Zero added, zero lost.

## Extracted modules (this branch)

| Module | Domain | Phases | Lines out | Exports via shim |
|---|---|---|---|---|
| `internal/review-shared.mjs` | Tier-1 shared helpers (stableJsonStringify chain, reviewedAt defaults, runtime-effect skeletons, boundary patterns) + `*ForbiddenBehavior` family | cross-domain | ~700 | internal-only (imported by kernel + domains) |
| `internal/diagnostic-redaction.mjs` *(prior batch)* | stderr diagnostic-redaction engine | 4.1c | 181 | 6 names |
| `governance-reports.mjs` | fabric-federation reconciliation, code-mode orchestration, CI enforcement/enablement, report script/test compaction, source-guard hardening, external-reference policy | 5.75b–5.83 | ~3,850 | 40 |
| `consumer-display.mjs` | consumer-display accessibility maps, fixture schema boundaries, example packs, conformance handoffs, runner requirements/test-plans/result schemas/handoffs/intake/packages | 5.49–5.58 | ~10,500 | 40 |
| `review-artifacts.mjs` | review-artifact & approval-evaluator pipeline (prerequisite reader/preflight/selection/bundle/consumption/integration checkpoints, evaluator input handoffs, candidate intake, preflight checkpoints, non-authorizing boundaries, inspection artifacts, dispositions, aggregation/readiness/handoff layers, target-consumer planning, consumer contract readiness/gap) | 5.18–5.47 | ~23,100 | 120 |

## Remaining in the monolith (~31,183 lines) and why

| Domain | Est. lines | Status | Reason not yet extracted |
|---|---|---|---|
| Runtime kernel (ajv instance + schema registrations, identity/manifest/task/transcript/session/failure-audit validation, fs/crypto plumbing, host-info) | ~4,600 | INTENTIONAL STAYS | owns module-load side effects (`new Ajv2020()` + addSchema); every domain depends on it transitively; moving it would invert the dependency direction |
| Boundary-map singles: security-RLS (5.63), rate-limiting (5.64), error-tracking (5.65), availability (5.66), infra/compliance retention (5.67), agent-mode/skillhub (5.68), testing gates (5.69), ops reliability (5.70), maintenance/governance (5.71), secrets/credentials (5.72), external-gateway/matrix transport (5.73), command-surface/shell (5.74), embedded-db query (5.76), fabric-aware API backend (5.59) | ~14×~1.2–1.6k ≈ 19k | READY (same shape as shipped extractions) | mechanical band moves; deferred only for batch size — each needs its own gate cycle |
| Inter-agent encoded handoff (5.60) | ~1.6k | READY | same |
| Auth-permissions (5.62) / database-storage (5.61) | ~3.4k combined | READY | same |
| Production-readiness matrix / consumer-contract planning (cid3) + interleaved singletons | ~2k | PARTIALLY BLOCKED | shares `*ForbiddenBehavior` helpers (now in review-shared — unblocked) and a few interleaved schema consts; needs one helper-first pass like Group 1 |
| Dead/orphaned constants between bands | ~1k | DEAD | zero inbound references; deletion candidate, not extraction |

## Method that worked (for future groups)

1. Lexical scan → symbol table (name, start/end line).
2. Cluster by intra-references; peel shared helpers into `internal/review-shared.mjs`.
3. Move verified-pure bands (reverse order) into the new module; auto-wire:
   - `export { …public names… } from "./<module>.mjs";` shims in index.mjs,
   - `import { …still-used internals… } from "./<module>.mjs";` for anything the remaining kernel references.
4. `node --check` both files → full Node suite → parity gate (`tests/export-surface.test.mjs`) → commit.
5. Refresh source-guard digests for `packages/core/src/index.mjs` via sanctioned path when pinned tests demand it.
