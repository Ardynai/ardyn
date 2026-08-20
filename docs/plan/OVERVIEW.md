---
tags: [ardyn, project, repo-map]
updated: 2026-07-02
source: Fable 5 review session (read-only mirror of Ardynai/ardyn @ 0986ed68)
---

# Ardyn — Overview

Open-source AI harness/framework. **Posture: metadata-only, review-only, runtime-blocked** (verified 2026-07-02). Latest phase: **5.76** (embedded DB/query-engine boundary map). Main SHA `e84bd875 (5.76B; was 0986ed68 at review)`.

First-class target consumers: [[Locus]] (AI operating system hub, `Ardynai/locus`) and [[Multiverse]] (`Ardynai/multiverse`, owns `packages/fabric-core` — the complete, security-reviewed content-addressed transport Ardyn must consume, never rebuild).

## Repo map

- `packages/core` — the monolith: `src/index.mjs` 69,459 lines / 386 exports; hand-maintained `index.d.ts` 11,404 lines. ~89% is per-phase review-metadata scaffolding.
- `packages/{fabric,mcp,plugin-api,adapters/openclaw}` — inert stubs/validators. `packages/sdk` — metadata only (no src).
- `apps/cli` — 8 read-only commands; `serve-runtime` hard-blocked; single triple-gated `writeFile` (review-artifact export only).
- `crates/ardyn-host` — Rust; private `stdio_runtime` module + compile_fail doctest = strongest inertness guarantee; deps: serde, serde_json, sha2.
- `schemas/` — 5 JSON Schemas (manifest, capability, task, session-event, session-transcript). The ~26 boundary-map result schemas exist only as strings.
- `scripts/report-phase-status.mjs` — 36,393 lines, emits 5.28MB status JSON; honestly `reportRunsChecks: false`.
- `tests/` — 125 test files (~1,068 tests), 208 fixture JSONs (15MB) under `tests/fixtures/host-policy/phase*/`.
- No CI workflows (policy: CI changes require explicit authorization).

## Key invariants

Every phase = doc + fixture + core helper + focused test + report wiring, all fail-closed for supplied input, all runtime/authorization flags false, `nonAuthorizingProof: true`. See [[Ardyn - Standing Guardrails]] and [[Ardyn - Phase Chain]]. Latest deep audit: [[Ardyn - Fable 5 Review 2026-07-02]].



## UPDATE 2026-07-06
Baseline e84bd875 (Phase 5.76B merged). Orchestrator: Hermes (GLM 5.2). Fabric federation client authorized + reconciled + security-audited (safe, unwired). Active queue: [[Ardyn - Recommended Next Phases]] · [[Ardyn - Jules Automation Runbook]] · [[Ardyn - Federation Security Audit 2026-07-06]]. Next: 5.77 Code Mode.
