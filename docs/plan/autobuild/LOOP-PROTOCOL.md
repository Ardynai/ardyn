# Autonomous Loop Protocol — how to operate

You run continuously and self-sufficiently. No external reviewer, no back-and-forth with the planner mid-run. A human (Fable 5) reviews the whole branch only when you report done.

## The loop (repeat until roadmap done or budget cap hit)
1. **Pick** the next roadmap item (top-down through `AUTOBUILD-ROADMAP.md`, respecting dependencies). One item at a time.
2. **Define done with a test.** Write or adjust the test(s) that will prove the item works BEFORE implementing. If you can't express "done" as a test, you don't understand it yet — clarify from the spec (the boundary-map docs/fixtures) first.
3. **Implement** the smallest correct change that satisfies the test and the Definition of Done. Reuse before writing (ponytail ladder). Obey `SECURITY-INVARIANTS.md`.
4. **Validate for real.** Run build + the targeted tests + lint/format + security checks. READ THE ACTUAL OUTPUT — tools report "Done" on failure; trust the logs, not the banner.
5. **Self-review** against the rubric below. Read your own diff. Fix every finding before committing.
6. **Commit** (small, descriptive) and **update `PROGRESS.md`**.
7. **Continue** to the next item. Do NOT stop after one item.

## Self-review rubric (this replaces external review — run it every item)
- **Correctness** — meets the test + Definition of Done; edge cases handled; no symptom-only fixes (fix the shared function, grep its callers).
- **Security** — trust-boundary validation, fail-closed, no secrets committed/logged, authz/injection safe, and nothing crosses `SECURITY-INVARIANTS.md`. For auth/payments/personal-data/new-network surfaces, do a dedicated security pass.
- **Tests** — a runnable check exists for non-trivial logic; test-first was honored; full targeted suite green.
- **Ponytail discipline** — smallest correct diff; no unrequested abstractions/deps/boilerplate; shortcuts marked `ponytail:` with their ceiling + upgrade path.
- **Deps** — no forbidden patterns; any new dep pinned, justified, license-ok, allowlist updated deliberately.
- **Docs** — affected docs updated; `PROGRESS.md` current.

## Budget caps (set these before the run; stop cleanly when hit)
- Per work-item: a max tool-calls and max-minutes ceiling — if exceeded, checkpoint (commit + PROGRESS note) and either simplify or mark the item Blocked.
- Whole run: a wall-clock + total-token budget. On hitting it, finish the current item to a clean commit, write the final summary, and STOP.
- Reasoning: run at **max** effort, temperature **1.0**, agentic top-p **1.0** (Kimi K3 guidance).

## Blocked handling (never stall the loop)
If an item is blocked — missing external dependency, genuinely ambiguous spec, needs a founder decision (spend, external service, scope), or can only be done by violating the security floor — **log it in `PROGRESS.md` under "Blocked / needs Josh," skip it, and move to the next unblocked item.** Never work around the security floor. Never spin in place.

## Anti-drift
- Tests are your "done/broken" signal — re-run the targeted suite before every commit; keep the tree green.
- Prefer many small green commits over one large risky one.
- Don't gold-plate: build what the roadmap item needs, not a speculative framework.

## Commit & branch hygiene
- Branch: `hermes/kimi-autobuild` only. Never `main`. No force-push, no history rewrite. No PR self-merge.
- Do not invoke or wait on Cursor/Bugbot/Jules/CodeRabbit or GitHub CI. Your local build + tests + self-review are the gate.
- Set git identity to `Ardynai <admin@multiverseos.net>` (matches history).

## `PROGRESS.md` entry format (append one per item)
```
### <UTC datetime> — <milestone>.<item>
- Changed: <files / surfaces>
- Tests: <before> → <after> (targeted suite result)
- Self-review: <pass / findings fixed>
- Commit: <sha>
- Notes / deviations: <…>
```
Plus keep two running sections at the top: **"Blocked / needs Josh"** and **"For Fable's review"** (risky areas, posture changes, anything to scrutinize).

## Done / handoff
When M0–M8 are complete (or a budget cap forces a stop): targeted suite green, `SECURITY-INVARIANTS.md` honored, `PROGRESS.md` finalized with a summary + the "For Fable's review" section (what's done, what's blocked, what's risky). Then STOP and hand the branch to Fable 5. Do not merge.
