---
tags: [ardyn, phases, history]
updated: 2026-07-02
---

# Ardyn — Phase Chain (1.x → 5.76)

129 commits, 2026-06-01 → 2026-07-01, linear history, one `codex/phase-*` branch per phase. See [[Ardyn - Overview]].

| Arc | What it accomplished |
|---|---|
| 1.x | Fork inventory (580 repos), scaffold, 1.5 Content Fabric conformance foundation |
| 2.x | TS+Rust schema handshake (+2 review-fix commits) |
| 3.1–3.10 | Non-executing planner, trace ergonomics, policy review, approval artifacts, review-trace CLI, versioning policies, Locus display contract |
| 4.0A–I | Stdio dry-run → pre-runtime transport policy as inert contracts → reviewer handoff → final pre-runtime readiness |
| 4.1–4.1L | Runtime *proposal* + every runtime concern as static contracts (framing, redaction, replay, failure audit, kill semantics); external review packet (Devin); private Rust stdio harness |
| 4.2A–D | Deliberately **blocked** Rust stdio runtime skeleton; Jules APPROVE; Phase 5 handoff |
| 5.1–5.17 | Runtime-enablement preconditions as reject-by-default metadata; `serve-runtime` recognized but default-blocked (5.5); guarded implementation plan |
| 5.18–5.44 | Approval-evaluator skeleton + ~20 checkpoint/handoff wrapper phases. Side: 5.38A cleanup toolkit, 5.44A Semgrep prototype-pollution fix |
| 5.45–5.48 | **Pivot**: Locus/Multiverse first-class consumers; consumer readiness matrix; contract gap index; 19-area production-readiness coverage matrix |
| 5.49–5.58 | Display/accessibility contracts + display fixture conformance pipeline (consumer-owned runner spec) |
| 5.59–5.76 | One review-only boundary map per production domain: API/backend (5.59), encoded handoff/GLOSSOPETRAE (5.60), DB/storage (5.61), auth (5.62), RLS/security (5.63), rate limits (5.64), logging/audit (5.65), availability (5.66), infra/compliance (5.67), Hermes/CUA agent modes (5.68), testing gates (5.69), ops reliability (5.70), governance/ADR/deps (5.71), secrets (5.72), Matrix gateway (5.73), command surface/shell (5.74), fabric-core consumer readiness (5.75), embedded DB/query (5.76) |

Non-phase merges: PR #2 ponytail agent ruleset, PR #3 human readability layer (both 2026-06-28, both invariant-respecting).

**Next:** 5.77 Code Mode orchestration boundary map (chain-pinned in the 5.76 fixture). Roadmap and conditions: [[Ardyn - Fable 5 Review 2026-07-02]].

Sequencing lessons: declare consumers + coverage matrix *before* generating coverage phases (5.45–5.48 would have collapsed much of 5.25–5.44); derive SHAs via git, never hand-type (4.1G double-fix); sub-lettered side phases are a healthy escape valve; adopt current-state docs at arc boundaries, not after 100 phases.

- 5.77 Code Mode orchestration boundary map — LANDED e9537ccd (2026-07-06), Fable-verified. current=5.77 next=5.78. 1094 tests.

- 5.78 CI enforcement contract boundary map — LANDED ae910f5c (2026-07-06), Fable-verified. current=5.78 next=5.79. 1104 tests.

- 5.79 CI enablement — LANDED 54de5f76 (2026-07-08, PR #6 squash). CI now LIVE + green (node ubuntu/windows + rust). Fable drove the CI green-up. current=5.79 next=5.80.
  - Root cause of the CI red: npm ci chmods the CLI bin apps/cli/src/index.mjs to 0755; Linux git (filemode=true) saw a mode change; the 'does not change source' guards use git diff => failed on Linux only (Windows/local filemode=false masked it). Fix: core.fileMode false in CI + fetch-depth 0 + PR-head-sha checkout + rust toolchain:stable. Clippy --all-targets deviated to --workspace (documented supersession).
  - WORKFLOW CHANGE: from 5.80 on, every phase lands via PR + CI-green-before-merge (no more fast-forward-to-main). Jules hard gate = 5.83 only.

- 5.80 report-script compaction — LANDED cc5b3bf5 (2026-07-08, PR #7 squash). report-phase-status.mjs 2525->134 lines + 118 manifests, byte-identical, CI green. current=5.80 next=5.81.

- 5.81 report-test compaction + perf — LANDED 02df3e87 (2026-07-09, PR #8 squash). Memoized render + maxBuffer 64MB guard; suite -61%, report test ~25min->2.8s. current=5.81 next=5.82. NOTE: monthly GitHub Actions minutes (3000) exhausted this day; budget raised to cover overage. Self-hosted Mac mini runner (moltclaw-joshs-mac-mini 100.103.125.120, offline) is the free-minutes fix.

- 5.82 source-guard hardening — LANDED d6d8a3af (2026-07-09, PR #10 squash). ~72 git-baseline guards -> line-ending-normalized sha256 digest guards (tests/helpers/source-digests.mjs + fixtures/source-guards/digests.json); lib.rs clippy fix; RESTORED clippy --all-targets; REMOVED core.fileMode CI workaround. CI caught a CRLF-manifest bug (package.json), fixed via LF normalization. current=5.82 next=5.83. Then PR #11 routes node+rust to the Mac runner.
