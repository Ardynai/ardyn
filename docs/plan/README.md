# docs/plan — Ardyn plan (in-repo source of truth)

The full plan lives here so the operator (Codex/GPT-5.6 Sol), which only sees the repo, can read it. The vault copy (`C:\AI\obsidian-mind\Projects\Ardyn`) is working memory; **this folder is the source of truth.**

## Start here
- **`FABLE5-HANDOFF.md`** — fresh Claude-planner pickup + first-mission spec. Read this first.
- **`OVERVIEW.md`** — repo map + posture + key invariants.
- **`ROADMAP.md`** — recommended next phases (5.84 → 5.89) + infra TODO.
- **`PHASE-CHAIN.md`** — history 1.x → 5.83, sequencing lessons.
- **`STANDING-GUARDRAILS.md`** — the "do not build here" rules (also machine-checked in `docs/external-reference-policy.md` + `tests/fixtures/host-policy/phase5-83/`).
- **`CI-AND-REVIEW-RUNBOOK.md`** — CI routing (self-hosted Mac), branch protection, PR-review flow (Cursor+Grok; Jules via CLI).
- **`FABLE5-REVIEW-2026-07-02.md`** — the seven-lane deep audit that seeded the current roadmap.
- **`FEDERATION-SECURITY-AUDIT.md`** — 2026-07-06 audit of the fabric federation client (feeds Phase 5.84).

## Operator prompt queue
- **`HERMES-PROMPT-QUEUE.md`** — the v2 phase queue (baseline + gates + conventions).
- **`HERMES-PROMPT-5.77…5.83.md`** — the individual per-phase operator prompts already executed (reference for phrasing/structure).

## Archive (superseded — do not use)
- `archive/ARDYN-CODEX-PROMPTS-2026-07.md` — original Codex queue (never issued; Hermes took over).
- `archive/ARDYN-HERMES-PROMPTS-GLM52-2026-07.md` — v1 Hermes queue (superseded by the v2 in `HERMES-PROMPT-QUEUE.md`).
- `archive/DESIGN-BRIEFS-CLAUDE-CODE-SUPERSEDED.md` — old "use Claude Code for visual/design" briefs. **Reversed 2026-07**: design/UI/UX coding now routes to Codex/Sol (see `CLAUDE.md`).

> Keep this folder current: when a phase lands or the plan changes, update the relevant doc here (not only the vault).
