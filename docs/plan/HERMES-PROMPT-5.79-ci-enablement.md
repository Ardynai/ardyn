# HERMES PROMPT — Phase 5.79 CI enablement (paste into a fresh Hermes/GLM 5.2 session)

Status 2026-07-06: Phase 5.78 landed & Fable-verified. Baseline `main` @ `ae910f5ccd79b1787468ef5b260152c1899b1421`.
**This is the FIRST JULES GATE. Hermes pushes + opens a PR + STOPS. Do NOT merge.** Fable drives the Jules review + merge automatically.

---

```
You are the Hermes agent (GLM 5.2), implementation orchestrator for Ardynai/ardyn (local: C:\Users\Josh\Documents\ardyn).
Flow: inspect → plan → implement → verify. SCOPE LOCK: only what the Phase 5.78 contract specifies (two workflow files) + the standard 5.79 phase record + the portability fix. Nothing else.

AUTHORIZATION
- This prompt IS Josh's explicit authorization to create CI workflow files, exactly and only as specified by the Phase 5.78 contract fixture. CONTRIBUTING's "no CI changes unless the task explicitly asks" is satisfied by this task. Anything not in the 5.78 contract is out of scope.

START-OF-SESSION SYNC
- git fetch origin; git checkout main; git pull --ff-only. Confirm HEAD == local main == origin/main == ae910f5ccd79b1787468ef5b260152c1899b1421. Clean worktree; identity Ardynai <admin@multiverseos.net>. Abort/report on mismatch.
- Read the 5.78 contract fixture FIRST (tests/fixtures/host-policy/phase5-78/ci-enforcement-contract.json) and treat it as the spec. Every workflow line must map to a contract field.

POSTURE (unchanged): review-only metadata EXCEPT the authorized unwired fabric federation client. CI executes the EXISTING validation suite; it is not product runtime and authorizes no runtime surface. Carry the fabric carve-out tokens forward in the 5.79 executionPosture string. Do not touch/wire/re-block federation.mjs.

TASK
 1. Create .github/workflows/ci.yml and .github/workflows/security.yml EXACTLY per the 5.78 contract:
    - ci.yml: triggers push→main + pull_request; concurrency cancel-in-progress; permissions: contents: read; NO secrets. Jobs: node (ubuntu: npm ci; npm test; npm run report:phase-status > $null smoke), rust (ubuntu: cargo fmt --check; cargo clippy --workspace --all-targets -- -D warnings; cargo test --workspace), node-windows (windows-latest: npm ci; npm test). Pin actions/checkout, actions/setup-node, dtolnay/rust-toolchain, Swatinem/rust-cache to the exact versions/SHAs named in the contract.
    - security.yml: schedule (weekly) + workflow_dispatch; permissions: contents: read; npm audit --audit-level=high; cargo audit; osv-scanner over package-lock.json and Cargo.lock. Cron-only.
    - HONOR ci_offline_hermetic_guarantee: no ARDYN_FABRIC_* / FABRIC_TRANSPORT_D_* / registry secrets anywhere; no live network; no fabric wiring. Confirm empirically that `npm test` passes with NO fabric env set (it does — federation tests inject fetchImpl).
 2. Fix test-invocation portability per the contract: choose the `npm test` invocation that provably runs the IDENTICAL current test-file set on ubuntu and windows across the supported Node range. Verify EMPIRICALLY on this machine — list the discovered test files before/after your change and record both counts in the phase doc (they must be identical and equal the current suite). If you change engines or the test script string, update package.json AND the pinned script-string assertions in tests/report-phase-status.test.mjs in this same slice, minimally.
 3. Add the Phase 5.79 record per pattern (doc + fixture + focused test + report wiring): document the workflows created; a conformance table mapping every workflow line ↔ 5.78 contract field; branch protection as a pending human console step for Josh. Set the 5.79 inventory's recommendedNextPhase to "phase-5.80-report-script-compaction". Update the top-level current-phase block (id 5.79, new executionPosture) in report + report test. Do NOT edit the 5.76/5.76B/5.77/5.78 inventory pointers (historical).
 4. Run locally everything CI will run (both jobs' full command lists) and record results in the phase doc.
 5. actionlint on both workflow files if available (install via scoop/winget if trivial; otherwise note as unavailable).

MUST NOT
- No steps, triggers, permissions, or actions beyond the 5.78 contract. No secrets in workflows. No deploy/publish. No semgrep gate. No auto-merge. NO MERGE TO MAIN BY YOU. No other repo changes. Do not touch/wire/re-block federation. Never print or persist the GITHUB_TOKEN. No force-push/history rewrite. Reuse shared core helpers (no clones).

VALIDATION (all must pass locally BEFORE opening the PR)
- Focused 5.79 tests; adjacent 5-76*, 5-76b*, 5-77*, 5-78*; tests/report-phase-status.test.mjs
- npm test ; npm run test:schemas ; npm run report:phase-status (current phase 5.79; 5.79 inventory recommendedNextPhase = phase-5.80; reportRunsChecks:false; carve-out kept)
- cargo fmt --check ; cargo check --workspace ; cargo clippy --workspace -- -D warnings ; cargo test --workspace
- git diff --check ; semgrep --config auto . (0) ; npm audit (0) ; cargo audit ; cargo machete

REVIEW & LANDING — JULES GATE (PR + STOP)
- One read-only reviewer subagent FIRST — confirm: (a) only the two workflow files under .github/ (no other .github changes), (b) no secrets/write-permissions/extra-triggers/semgrep-gate in the workflows, (c) no fabric secrets or live-network in CI, (d) no historical fixture edited, (e) no new deep-walker clone, (f) federation untouched, (g) executionPosture tokens true, (h) test-file-set identical before/after.
- Push the branch: git push -u origin hermes/phase-5-79-ci-enablement. If the push is REJECTED for missing `workflow` scope, retry using the token remote for THIS PUSH ONLY (do not echo the token into any output you paste back, never write it to disk):
    $tok=[Environment]::GetEnvironmentVariable('GITHUB_TOKEN','User'); git push "https://x-access-token:$tok@github.com/Ardynai/ardyn.git" hermes/phase-5-79-ci-enablement
- Open the PR (gh preferred): title "Phase 5.79 — CI enablement per 5.78 contract"; body = contract-conformance table + local run evidence + test-file-set before/after counts + "Jules review required before merge; do not merge." Then STOP.
- REPORT BACK: PHASE / BRANCH+SHA / PR URL / FILES CHANGED / test-file-set before/after / VALIDATION / REVIEWER disposition / NOTES. Do NOT merge — Fable takes over: verifies the diff, requests Jules on the PR, polls for the verdict, squash-merges on APPROVE, then watches the first Actions run go green and reminds Josh to enable branch protection (require node + rust checks).
```

---
When Hermes reports the PR URL, send it to me. I'll independently verify the workflow files against the 5.78 contract, then run the Jules gate automatically (request → poll → merge) per the runbook — no action needed from you unless Jules needs a console launch, in which case I'll hand you a one-liner.
