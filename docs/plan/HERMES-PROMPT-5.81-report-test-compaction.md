# HERMES PROMPT — Phase 5.81 (paste into a fresh Hermes/GLM 5.2 session)

Status 2026-07-08: Phase 5.80 merged (PR #7 squash) → **main @ `cc5b3bf571`**. Report script is now a 134-line loader over 118 per-phase manifests (byte-identical). CI live + green; branch protection enforces PR + node/rust/node-windows green before merge.

---

```
You are the Hermes agent (GLM 5.2), implementation orchestrator for Ardynai/ardyn (local: C:\Users\Josh\Documents\ardyn).
Flow: inspect → plan → implement → verify. SCOPE LOCK: tests/report-phase-status.test.mjs, the ~28 other test files that spawn the report (memoization only), the 5.81 phase record (doc+fixture+core helper+test), report wiring. Nothing else.

START-OF-SESSION SYNC
- git fetch origin; git checkout main; git pull --ff-only. Confirm HEAD == local main == origin/main == cc5b3bf571. Clean worktree; git diff --check passes; identity Ardynai <admin@multiverseos.net>. Abort/report on mismatch.

POSTURE (unchanged): review-only metadata except the authorized unwired fabric federation client (docs/posture.md); CI check-execution present. Carry the executionPosture tokens forward; do not touch federation or the CI workflow files.

CONTEXT — WHAT 5.81 DOES
tests/report-phase-status.test.mjs is ~33k lines with one hardcoded block per phase, and it re-spawns the report (runReport) fresh in most tests. Now that 5.80 made the report data-driven from scripts/phase-status-manifests/index.json, convert the test to derive per-phase assertions from that SAME manifest index (identical assertions, one source of truth) and memoize the render. Also defuse the maxBuffer time-bomb. This also speeds up CI. The invariant tests are the valuable part and MUST all survive.

TASK
 1. Memoize: one top-level shared render (const reportPromise = runReport()) reused by all tests in the file; keep exactly ONE separate fresh-spawn test asserting clean process behavior (exit 0, empty stderr) independently.
 2. Convert the per-phase hardcoded blocks into one loop over scripts/phase-status-manifests/index.json: for each manifest assert the report inventory matches the manifest (id, name, fixture statuses present, safety flags all false, verification command present, recommendedNextPhase equals the manifest's). Same assertions, derived from the same data the script uses — adding a phase no longer edits this test.
 3. Keep, do NOT weaken: the source-guard test on the script's imports (fs/path/url only); reportRunsChecks/externalCi honesty assertions; exact-string assertions for package.json scripts; the current-phase id/name/executionPosture assertion (derive from the last index entry).
 4. maxBuffer: raise to 64MB AND add a guard test that FAILS when report size exceeds 50% of the configured buffer, with a message telling the maintainer to plan compaction — turn the silent future outage into a loud early warning.
 5. Sweep the other test files that spawn the report (~28 files): where a file spawns it more than once, memoize within that file. Do not restructure unrelated assertions.
 6. Add the Phase 5.81 record per pattern (doc + fixture + core create*ForReview helper + focused test + report wiring — which now means adding one manifest scripts/phase-status-manifests/phase-phase581*.json + index.json entry, NOT editing the report script). Record before/after full-suite wall-clock in the phase doc. Set the 5.81 manifest recommendedNextPhase to "phase-5.82-source-guard-hardening". Update the current-phase (id 5.81) via the manifest/loader. Do NOT edit prior phases' manifests' recommendedNextPhase (historical).

MUST NOT
- No assertion DELETIONS (derivation changes only — the reviewer will diff the assertion inventory), no report script/output changes (byte-identical stays), no new deps, no fixture edits for prior phases, no federation/CI-workflow changes. Reuse shared helpers; no new clones; `ponytail:` on shortcuts.

VALIDATION (all must pass locally before the PR)
- Full suite twice with timings (evidence) ; focused 5.81 tests ; tests/report-phase-status.test.mjs ; npm test ; npm run test:schemas ; npm run report:phase-status
- cargo fmt --check ; cargo check --workspace ; cargo clippy --workspace -- -D warnings ; cargo test --workspace
- git diff --check ; semgrep --config auto . (0) ; npm audit (0) ; cargo audit ; cargo machete

REVIEW & LANDING — PR + STOP (CI-gated)
- One read-only reviewer subagent — instruct it: verify no assertion CLASS was dropped (diff the assertion inventory, not the line count); confirm the manifest-derived loop covers every phase the old hardcoded blocks did; no report-script/output change; federation + CI workflows untouched.
- Branch hermes/phase-5-81-report-test-compaction; commit "Add Phase 5.81 report-test compaction + suite performance"; push branch; open PR (same title); body = before/after suite timing + assertion-inventory note + confirmation invariants preserved. Then STOP. Do NOT merge.
- REPORT BACK: PHASE / BRANCH+SHA / PR URL / FILES CHANGED / TESTS before→after / suite timing delta / VALIDATION / REVIEWER disposition / NOTES. Fable verifies, waits for green CI, squash-merges, hands you 5.82.
```

---
## Roadmap (Fable) — after 5.81
- **5.82 source-guard hardening (expanded):** replace the ~94 `git diff`/`git show`-against-history guards with in-tree sha256 digest-manifest checks (platform/mode/line-ending independent). This (a) removes the CI `core.fileMode false` workaround, (b) restores clippy `--all-targets` (resolves the 5.79 supersession), and (c) folds in escapeRegExp + tests/helpers consolidation. After 5.82, tighten ci.yml back (drop core.fileMode line, add --all-targets) in the same or a follow-up slice.
- **5.83 external-reference policy + dependency allowlist + federation invariants — JULES GATE.** Launch Jules from the jules.google.com console when I hand you that PR; I drive verify + merge.
- then 5.84 fabric pre-wiring hardening · 5.85 fabric-core producer pin · 5.86 consumer contract export pack · 5.87 flag normalization · 5.88 docs front door · 5.89 threat model.
