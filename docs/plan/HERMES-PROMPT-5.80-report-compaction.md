# HERMES PROMPT — Phase 5.80 (paste into a fresh Hermes/GLM 5.2 session)

Status 2026-07-08: Phase 5.79 CI enablement **merged** (squash, PR #6) → **main @ `54de5f763e`**. CI is now LIVE and green (node ubuntu + node windows + rust) on every push and PR. Fable applied the CI-config fixes to get it green (fetch-depth 0, PR-head-sha checkout, rust toolchain:stable, core.fileMode false for the npm-bin chmod); those are in main now.

**WORKFLOW CHANGE (applies from 5.80 onward):** now that CI exists, every phase — even ungated ones — lands via **PR + STOP**, so CI validates before merge. Hermes does NOT fast-forward main anymore. Fable verifies the diff, waits for green CI, and squash-merges. Jules is reserved for the hard gate (5.83).

---

```
You are the Hermes agent (GLM 5.2), implementation orchestrator for Ardynai/ardyn (local: C:\Users\Josh\Documents\ardyn).
Flow: inspect → plan → implement → verify. SCOPE LOCK: scripts/report-phase-status.mjs, new scripts/phase-status-manifests/**, the 5.80 phase record (doc+fixture+core helper+test), and CONTRIBUTING's "add a phase" section. Nothing else.

START-OF-SESSION SYNC (important — you are behind main)
- git fetch origin; git checkout main; git pull --ff-only. Confirm HEAD == local main == origin/main == 54de5f763e. This pulls Fable's merged 5.79 (CI workflows + the CI-config fixes). git status --porcelain empty; git diff --check passes. Identity Ardynai <admin@multiverseos.net>. Abort/report on mismatch.

POSTURE (unchanged, carry forward): review-only metadata for every runtime surface EXCEPT the authorized unwired fabric federation consumer client (docs/posture.md). Since 5.79, CI check-execution exists — keep the executionPosture tokens `ci-check-execution-present no-release-deploy-publish-automation` and the fabric carve-out tokens. 5.80 opens no runtime surface and does not touch federation.

CONTEXT — WHAT 5.80 DOES
Refactor scripts/report-phase-status.mjs (36k+ lines, ~99.9% hand-appended per-phase data) into a DATA-DRIVEN loader over per-phase JSON manifests, with BYTE-IDENTICAL output. Pure refactor: no schema/semantic change; reportRunsChecks stays false; the script keeps fs-only imports (a source-guard test asserts the import list — keep it passing). The report test must keep passing unchanged (except its allowed-imports list if the loader's imports change — keep node:fs/node:path/node:url only).

TASK
 1. Golden snapshot (outside the repo): node scripts/report-phase-status.mjs > C:\AI\hermes-scratch\ardyn\golden-5-80.json ; record (Get-FileHash -Algorithm SHA256 <that>).Hash.
 2. Mechanically extract each phase's data into scripts/phase-status-manifests/phase-<id>.json (id, name, executionPosture tokens, fixtureReads, inventory block, safetyFlags, verificationCommand) + an explicit ordered scripts/phase-status-manifests/index.json (an array — NOT readdir; key AND phase order must be preserved exactly for byte-identity; manifest field order matters since JSON.stringify follows insertion order).
 3. Replace the script body with a small generic loader (~200 lines): read index.json → for each manifest: existence checks preserving the current localStatus semantics, inline referenced fixture JSON, merge safetyFlags in manifest order, append verificationCommands → emit the identical report object shape with unchanged schemaVersion "ardyn.phase-status-report.v1" and unchanged header/tail notes.
 4. Verify byte-for-byte: SHA256(new output) == SHA256(golden). Headline claim — record BOTH hashes in the phase doc. If they differ, fix the LOADER, never the expectation.
 5. tests/report-phase-status.test.mjs must pass UNTOUCHED (except the source-guard allowed-imports list if needed — keep fs/path/url only). If anything else fails, the refactor changed behavior — fix the refactor.
 6. Add the Phase 5.80 record per pattern (doc + fixture + focused test asserting: manifest count == phase count; index order == report order; the golden-hash procedure documented). Update CONTRIBUTING "how to add a phase": new phases add one manifest + fixtures; zero script edits. Set the 5.80 inventory recommendedNextPhase to "phase-5.81-report-test-compaction". Update the top-level current-phase block (id 5.80) in report + report test. Do NOT edit the 5.76/5.76B/5.77/5.78/5.79 inventory pointers (historical).

MUST NOT
- No output changes (bytes!), no schemaVersion bump, no new deps, no error-handling behavior changes (per-fixture try/catch → "unreadable" is EXPLICITLY deferred), no phase-fixture edits, no committing anything under C:\AI\hermes-scratch\. Do not touch federation or the CI workflow files. Reuse shared helpers; no new clones; `ponytail:` on shortcuts.

VALIDATION (all must pass locally before the PR)
- Byte-identity hash check (headline) ; focused 5.80 tests ; tests/report-phase-status.test.mjs ; npm test ; npm run test:schemas ; npm run report:phase-status
- cargo fmt --check ; cargo check --workspace ; cargo clippy --workspace -- -D warnings ; cargo test --workspace
- git diff --check ; semgrep --config auto . (0) ; npm audit (0) ; cargo audit ; cargo machete

REVIEW & LANDING — PR + STOP (CI-gated; ungated by Jules)
- One read-only reviewer subagent — instruct it to INDEPENDENTLY re-run the report and verify the hash equality itself; confirm no phase fixture edited, no federation/CI-workflow change, no new clone.
- Branch hermes/phase-5-80-report-script-compaction; commit "Add Phase 5.80 report-script compaction (byte-identical, manifest-driven)"; push branch; open PR titled the same; body = both SHA256 hashes + confirmation the report test passes untouched. Then STOP. Do NOT merge, do NOT fast-forward main.
- REPORT BACK: PHASE / BRANCH+SHA / PR URL / FILES CHANGED / TESTS before→after / VALIDATION / both hashes / REVIEWER disposition / NOTES. Fable verifies the diff, waits for green CI on the PR, squash-merges, and hands you 5.81.
```

---
## Roadmap note (Fable)
- 5.80 (this) → 5.81 report-test compaction → **5.82 source-guard hardening — now expanded**: de-brittle the git-baseline guards (replace `git diff`/`git show`-against-history with in-tree sha256 digest manifests — platform/mode/line-ending independent), which also lets CI drop the `core.fileMode false` workaround AND restore `clippy --all-targets` (the 5.79 clippy supersession resolves here). Plus escapeRegExp + tests/helpers.
- Jules hard gate remains 5.83. For 5.83, if you want a real Jules pass, launch it from the jules.google.com console when I hand you the PR (the GitHub @mention trigger looks console-based, not reliably API-automatable) — I'll drive verify + merge either way.
