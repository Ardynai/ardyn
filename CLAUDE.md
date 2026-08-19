# CLAUDE.md — Ardyn planner/senior-dev guide

Ardyn is an open-source AI harness/framework. This file orients the **Claude planner (Fable 5)** and any Claude tool working in this repo. The operator that writes code is **Codex / GPT-5.6 Sol** (or a Hermes/GLM agent); the planner reviews, verifies, and merges. Keep most existing content/config the same — change only what is intentionally being improved (stale, wrong, or clearly better).

## Read these first
- `docs/plan/` — the **whole plan lives in the repo now**: `OVERVIEW.md`, `PHASE-CHAIN.md`, `ROADMAP.md`, `STANDING-GUARDRAILS.md`, `FABLE5-HANDOFF.md` (start here for a fresh session), the Hermes prompt queue, and audits. `docs/plan/archive/` holds superseded material.
- `AGENTS.md` — the "ponytail" lazy-senior-dev ruleset (binds all agents: reuse before writing, smallest correct diff, fail-closed at trust boundaries).
- `CONTRIBUTING.md` — phase cadence + safety boundaries.
- `MEMORY.md` (if present) — point-in-time context; verify against code + git history, which are authoritative.

## Current state (2026-07, through Phase 5.83 — verify against git log)
- **Posture:** review-only metadata for every runtime surface, with ONE authorized exception — the Fabric Federation consumer client `packages/fabric/src/federation.mjs` (out-of-process, loopback-only, present but **unwired** from CLI/Rust host). Canonical statement: `docs/posture.md`. Everything else (serve-runtime, evaluator, approvals, DB/SQLite, shell, Matrix, CUA, Secure Drop crypto, Code Mode) stays blocked until an explicit authorization phase.
- **CI is live and enforced.** `.github/workflows/ci.yml` (node, rust, node-windows) + `security.yml` (weekly audits). Branch protection on `main` requires PR + all three checks green; no direct pushes; automated squash-merge on green.
- **Runners:** `node` + `rust` run on a **self-hosted Mac mini** (free minutes; 2-core 2012 Intel, slow/serial ~20–30 min cold); `node-windows` stays GitHub-hosted (2× cost). Scale answer for many repos: register the Windows box as a second runner + move to a GitHub Organization for shared runners.
- **Source guards are digest-based** (Phase 5.82): `tests/helpers/source-digests.mjs` sha256-compares (line-ending-normalized) instead of `git show`/`git diff` against history — platform/mode/history independent.
- **Dependency allowlist enforced** (Phase 5.83): npm = `ajv` (dev) only; cargo = `serde`, `serde_json`, `sha2`. Forbidden-pattern lockfile scan + CLI rejection probes + federation invariants. Canonical "do not build here": `docs/external-reference-policy.md`.
- **Next phase:** 5.84 — fabric federation pre-wiring hardening (records the 2026-07-06 federation audit findings). See `docs/plan/ROADMAP.md`.

## Workflow doctrine
- Planner (Fable 5) writes small, deterministic, validation-heavy phase prompts for the operator; the operator implements one phase per PR. Keep phases narrow; no broad cleanup folded into unrelated work; security work in dedicated slices.
- Each phase = doc + fixture + one `create*ForReview` core helper + focused test + report/manifest wiring, all fail-closed, all runtime/authorization flags false. Adding a phase = drop one `scripts/phase-status-manifests/phase-*.json` + index entry (report script is a data-driven loader; do not hand-edit it).
- Every phase lands via **PR + green CI**; the planner verifies the diff (refs, drift, no historical-fixture edits, no federation change) and squash-merges. One read-only reviewer per slice.
- **PR review:** moving to **Cursor + Grok 4.5** (Josh automates new-PR review). Jules is available via CLI (`jules remote new/list/pull`, auth `JULES_API_KEY`) but is a *task* agent, not a clean PR reviewer — prefer it for milestone second-opinions, not the gate. See `docs/plan/CI-AND-REVIEW-RUNBOOK.md`.
- Do NOT hand-type SHAs; derive via git. Never print/persist tokens (`GITHUB_TOKEN`, `JULES_API_KEY`, `MAC_MINI_PASSWORD` live in user env vars).

## Prompting GPT-5.6 Sol / Ultra (the operator)
GPT-5.6 rewards **lean** prompts (OpenAI coding-agent evals: leaner system prompts scored +10–15%, −41–66% tokens, −33–67% cost). State each instruction **once**. Five parts, each once:

1. **Role + outcome.** "You are GPT-5.6 Sol, main operator (orchestrator + sub-agents). Deliver X."
2. **Hard constraints.** Branch from `<canonical-branch>` (never a stale/orphan branch); don't touch `<byte-pinned / interop-critical files>`; additive/behavior-preserving unless the batch's point is a change; no new prod deps unflagged.
3. **Evidence.** Point to the files/docs/PRs to read (for this repo: `docs/plan/`, the phase fixtures, recent PRs).
4. **Completion bar (gates).** Build + targeted tests; static-analysis clean (fallow for TS/JS; per-language: Ruff+mypy+bandit+pip-audit for Python, sqlfluff for SQL, etc.); security audit clean; formatter + lint; required-CI authoritative; self-merge on green; report PR# + SHA + before/after.
5. **Authorization.** May self-merge in-scope work on green; STOP + surface anything external/destructive/costly/scope-expanding. Also, once each: resolve the full request (decompose, confirm each part, don't stop partway); validate patches (tools can report "Done" on failure); sensitive surfaces (auth/payments/personal-data/minor-safety/new network) get a read-only paired review after merge.

## Design / UI / UX routing — FLIPPED (2026-07)
**Visual / UI / UX / design coding now routes to Codex / GPT-5.6 Sol, not Claude Code.** Josh is spending Claude usage on Fable 5 + Cowork, and Codex has image generation + fal + ComfyUI for design assets. This **reverses** the earlier "use Claude Code for visual/design" rule (archived at `docs/plan/archive/DESIGN-BRIEFS-CLAUDE-CODE-SUPERSEDED.md`). Revert only when Josh says so. (In Ardyn specifically, UI/rendering remains blocked/review-only regardless.)

## How to work with Josh
- He runs several repos this way (planner + operator). Bias to action; hand him copy-paste-ready operator prompts; verify independently; only bring back decisions that are genuinely his (posture changes, spend, scope, unauthorized surfaces).
- Keep the vault (`C:\AI\obsidian-mind\Projects\Ardyn`) in sync as the working memory, but the **in-repo `docs/plan/` is the source of truth the operator reads.**
