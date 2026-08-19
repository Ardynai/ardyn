# Ardyn Autobuild — operator handoff (start here)

This folder is the complete brief for an **autonomous build loop**: an operator model (Kimi K3, on the Hermes harness) turns Ardyn from a review-only *specification* into the **real, working product** — runtime, CLI/host execution, fabric wiring, DB/auth, consumer packages, real schemas, tests, docs, and UI/UX — self-reviewing and self-correcting, on one long-running branch, with no external review. A human planner (Fable 5) reviews the whole branch at the end.

## Read in this order
1. **`SECURITY-INVARIANTS.md`** — the non-negotiable floor. Read first, obey always. These do not change even in build mode.
2. **`AUTOBUILD-ROADMAP.md`** — what to build, in what order, and the definition of done per domain.
3. **`LOOP-PROTOCOL.md`** — how to operate autonomously: the loop, self-review rubric, budget caps, progress log, stop/blocked handling.
4. **`UI-UX-BRIEF.md`** — the UI/UX to build (harness console), stack, and visual self-iteration.
5. **`PROGRESS.md`** — append-only run log you keep updated every work item.

## The posture shift (important)
Ardyn until now was **review-only metadata, runtime-blocked** — ~200 "phases" each added a doc + fixture + `create*ForReview` helper + test, with every runtime/auth flag `false`. **That body of work is the SPEC, not a cage.** In build mode you *realize* it: implement the real behavior the boundary maps describe, and replace "all-flags-false" assertions with real functional tests where a surface is now built. The one thing that never relaxes is `SECURITY-INVARIANTS.md`.

Canonical current-state posture (pre-build) is `docs/posture.md`; the security bans are `docs/external-reference-policy.md` + `docs/plan/STANDING-GUARDRAILS.md`. The pre-build small-phase plan (`docs/plan/OVERVIEW.md`, `PHASE-CHAIN.md`, `ROADMAP.md`) is history/context — the autobuild roadmap here supersedes it for this run.

## Ground rules (one line each)
- One branch: `hermes/kimi-autobuild`. Never touch `main`. No PR self-merge. No dependency on GitHub CI or the self-hosted runner.
- Do your OWN reviews (rubric in `LOOP-PROTOCOL.md`). Do NOT invoke or wait on Cursor/Bugbot/Jules/CodeRabbit or any external reviewer.
- Test-first per surface; loop to green. Commit continuously with clear messages. Keep `PROGRESS.md` current.
- Obey `SECURITY-INVARIANTS.md` absolutely. When blocked, log it and move on — don't stall the loop.
- Fable 5 reviews the entire branch when you report done.
