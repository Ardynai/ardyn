# HERMES PROMPT — Phase 5.82 (paste into a fresh Hermes/GLM 5.2 session)

Status 2026-07-09: Phase 5.81 merged → **main @ `02df3e87ca`**. CI live + branch-protection-enforced (node/rust/node-windows must be green). This phase de-brittles the source guards — the thing that made CI fragile — and then re-tightens the two CI workarounds it enables.

---

```
You are the Hermes agent (GLM 5.2), implementation orchestrator for Ardynai/ardyn (local: C:\Users\Josh\Documents\ardyn).
Flow: inspect → plan → implement → verify. SCOPE LOCK: the source-guard test files, tests/helpers/, a new digest-manifest mechanism, lib.rs (one lint fix), .github/workflows/ci.yml (re-tighten only), and the 5.82 phase record. Nothing else.

START-OF-SESSION SYNC
- git fetch origin; git checkout main; git pull --ff-only. Confirm HEAD == local main == origin/main == 02df3e87ca. Clean worktree; git diff --check passes; identity Ardynai <admin@multiverseos.net>. Abort/report on mismatch.

POSTURE (unchanged): review-only metadata except the authorized unwired fabric federation client (docs/posture.md); CI check-execution present. Carry the executionPosture tokens forward; do not touch federation.mjs behavior.

CONTEXT — WHY
The "does not change source" guards shell out to `git show <baseline>:file` and `git diff --exit-code <baseline> -- files` to prove a phase didn't alter runtime source. These are fragile on a clean Linux CI checkout: they broke on shallow clones (fixed with fetch-depth), on the pull_request merge ref (fixed with head-sha), and on npm ci chmod-ing the CLI bin (worked around with core.fileMode false). They also block editing lib.rs (a clippy fix breaks ~40 of them), which forced ci.yml to use `clippy --workspace` instead of the contracted `--all-targets` (recorded as clippyScopeSupersedes578AllTargets in 5.79). This phase replaces the git-history comparison with in-tree sha256 content digests — platform/mode/line-ending/history independent — then removes both CI workarounds.

TASK
1. INSPECT: enumerate every test that uses `git show`/`git diff --exit-code`/execSync-git against a baseline commit to assert "source unchanged". rg for: 'git show', 'git diff --exit-code', 'baselineCommit', 'execSync(.+git'. List them (expect ~90+) grouped by the file-set they guard (CLI source, Rust source, fabric index, package.json, consumer source).
2. Establish a digest mechanism: a committed manifest tests/fixtures/source-guards/digests.json mapping each guarded path -> its expected sha256 (computed from the current in-tree file). A shared helper tests/helpers/source-digests.mjs exposes assertUnchanged(paths) that recomputes sha256 of the worktree files and compares to the manifest — NO git calls, NO mode/line-ending sensitivity (hash the raw bytes; the repo's .gitattributes already normalizes eol=lf on checkout so bytes are stable cross-platform). Provide a small `npm run guards:refresh` (or documented node one-liner) to regenerate the manifest when a phase LEGITIMATELY changes a guarded file (the phase author reviews the delta).
3. Convert the guards: replace the per-phase `git diff/show` "source unchanged" assertions with `assertUnchanged([...])` from the shared helper. Keep the SAME guarantee (runtime source didn't change) and the SAME per-phase test titles. Do NOT delete the assertions — convert them. Historical phase fixtures/docs stay byte-untouched; only the TEST files change.
4. Populate tests/helpers/ (the dir exists but is empty): exec.mjs (execFileAsync), asserts.mjs (assertAllFalse + assertStatusesPresent), json.mjs (readJson), report.mjs (memoized runReport), regex.mjs (escapeRegExp), source-digests.mjs (from step 2). POLICY (add to CONTRIBUTING): new/modified tests import these; untouched historical tests keep their local copies.
5. Escape hazard: route every `new RegExp(<var>)` over source text in tests/ through escapeRegExp. List the files touched.
6. Now that guards are content-based (mode-insensitive), FIX the lib.rs clippy lint: apply the explicit_counter_loop fix (and any other `clippy --all-targets` findings in test code) that previously couldn't be touched. Verify `cargo clippy --workspace --all-targets -- -D warnings` is clean locally.
7. RE-TIGHTEN ci.yml (the payoff): (a) remove the `git config core.fileMode false` steps (no longer needed — guards ignore mode); (b) change the rust job to `cargo clippy --workspace --all-targets -- -D warnings` (restores the 5.78 contract; record that this resolves clippyScopeSupersedes578AllTargets). Keep fetch-depth 0 + head-sha ref + pinned actions + toolchain:stable.
8. Add the Phase 5.82 record per pattern (doc + fixture + core create*ForReview helper + focused test + a new scripts/phase-status-manifests/phase-phase582*.json + index.json entry). The doc must state: guards are now digest-based; both CI workarounds removed; clippy --all-targets restored. Set the 5.82 manifest recommendedNextPhase to "phase-5.83-external-reference-policy". Update current-phase to 5.82 via the manifest/loader.

MUST NOT
- No weakening of any guard's guarantee (reviewer diffs the assertion inventory). No deletion of historical phase fixtures/docs. No federation behavior change. No new npm/cargo deps. No report-script/output change (byte-identical stays). `ponytail:` on shortcuts; reuse shared helpers.

VALIDATION (all must pass locally before the PR)
- Focused 5.82 tests ; the full source-guard family ; npm test ; npm run test:schemas ; npm run report:phase-status
- cargo fmt --check ; cargo check --workspace ; cargo clippy --workspace --all-targets -- -D warnings ; cargo test --workspace
- git diff --check ; semgrep --config auto . (0) ; npm audit (0) ; cargo audit ; cargo machete
- Sanity: temporarily touch a guarded file's whitespace, confirm assertUnchanged FAILS (guard still bites), then revert. Record this in the phase doc.

REVIEW & LANDING — PR + STOP (CI-gated)
- One read-only reviewer subagent — confirm: every git-baseline guard was CONVERTED (not dropped); the digest manifest covers the same path-set; assertUnchanged actually fails on a real change; no historical fixture/doc edited; federation untouched; ci.yml re-tighten matches the 5.78 contract; clippy --all-targets is green.
- Branch hermes/phase-5-82-source-guard-hardening; commit "Add Phase 5.82 source-guard hardening (digest-based guards; restore clippy --all-targets; drop core.fileMode workaround)"; push; open PR (same title); body = guard-conversion count + confirmation both CI workarounds removed + clippy --all-targets green. Then STOP.
- REPORT BACK: standard format + how many guards converted + CI-workaround removals. Fable verifies, waits for green CI, squash-merges, hands you 5.83 (Jules gate).
```

---
## Note on minutes
Each phase PR now burns paid Actions minutes until the Mac mini runner is live. Recommended order: run the Mac runner setup script first (free minutes), then resume phases. But 5.82 can run on paid minutes if you want to keep moving — your call.
