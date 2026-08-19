---
tags: [ardyn, review, audit]
date: 2026-07-02
reviewer: Fable 5 (7 parallel lanes, read-only)
---

# Ardyn — Fable 5 Review (2026-07-02)

Full report lives in the session outputs (`ardyn-review-2026-07-02.md`). Companion notes: [[Ardyn - Overview]], [[Ardyn - Phase Chain]], [[Ardyn - Standing Guardrails]].

## Verdict

Blocked posture is **real, fail-closed for supplied input, zero violations found**. The two structural debts: **O(phases²) accretion** (69k-line core with ~60% copy-paste per boundary block; 36k-line report script; 33k-line report test; 5.28MB report vs 16MB test buffer ceiling) and **no CI while every committer is an AI agent** (all 1,068 tests are voluntary).

## Top risks

1. No CI (invariants enforced only by discipline).
2. `docs/content-fabric.md:128` still demands BitTorrent infohash verification — contradicts the no-P2P rule; three colliding "fabric" meanings.
3. 5.75 `producerSecurityReviewed: true` with no producer pin (SHA/version/digest) — fabric-core drift is invisible; 5.47 gap index fabric-stale.
4. `create*ForReview({})` accepted as valid with silently defaulted `reviewedAt` — fabricated provenance path.
5. Brittle guards: 71 tests pin baseline commits, 106 regex source text (some unescaped) — lock the monolith in place.
6. Lore-only guardrails (GPU-dep ban, Goose/Onyx/fainir, etc.).

## Recommended phase order

5.77 Code Mode boundary map (with contract shapes + loop/judge/front-desk invariants) → 5.78 CI contract+enable (Jules) → 5.79 report/test compaction (golden snapshot, manifests) → 5.80 source-guard hardening + tests/helpers → 5.81 external-reference policy + dep allowlist (Jules) → 5.82 fabric nomenclature reconciliation → 5.83 fabric-core producer pin + preflight → 5.84 consumer contract export pack (schemas + registry) → 5.85 flag-normalization envelope → 5.86 docs front door (PHASE-INDEX, CURRENT-STATE, README slim).

Claude Code for visuals later: Locus trace/artifact viewer prototype (display contract is buildable today), status dashboard, fixture gallery. Codex remains repo orchestrator.
