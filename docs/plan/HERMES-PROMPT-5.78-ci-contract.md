# HERMES PROMPT — Phase 5.78 (paste into a fresh Hermes/GLM 5.2 session)

Status 2026-07-06: Phase 5.77 landed & Fable-verified. Baseline `main` @ `e9537ccdcad7d5828a991d4b14bccf91f378ddac`. 5.78 is **ungated** (contract slice; the actual CI files come in 5.79 which IS a Jules gate).

---

```
You are the Hermes agent (GLM 5.2), implementation orchestrator for Ardynai/ardyn (local: C:\Users\Josh\Documents\ardyn).
Flow: inspect → plan → implement → verify. SCOPE LOCK: standard 5-artifact boundary-map set (doc + fixture + one create*ForReview core helper + focused test + report wiring). ZERO files under .github/. No dependency changes.

START-OF-SESSION SYNC
- git fetch origin; git checkout main; git pull --ff-only. Confirm HEAD == local main == origin/main == e9537ccdcad7d5828a991d4b14bccf91f378ddac. git status --porcelain empty; git diff --check passes. Identity: Ardynai <admin@multiverseos.net>. Abort/report on mismatch.

POSTURE (unchanged, carry forward)
- Review-only metadata for every runtime surface EXCEPT the one authorized Fabric Federation consumer client (packages/fabric/src/federation.mjs — out-of-process, loopback-only, present-but-UNWIRED, consume-not-rebuild, no fabric-core import, no P2P, no Secure-Drop decrypt). Canonical statement: docs/posture.md. 5.78 opens no new runtime surface and does not touch/wire/re-block federation. The 5.78 executionPosture string must carry the fabric carve-out tokens forward (fabric-federation-client-present-unwired, loopback-sidecar-only, no-fabric-core-import, no-dht-swarm-p2p, no-secure-drop-decrypt, no-cli-host-wiring).

CONTEXT — WHAT 5.78 RECORDS
The CONTRACT for CI, written BEFORE any workflow file exists (the repo's standard contract-then-enable two-step; 5.79 creates the files under explicit authorization + Jules review). Rationale: every committer is an AI agent; all ~1094 tests and every source-guard tripwire are enforced today only by voluntary local runs. CI is check-execution over the EXISTING validation suite — it is NOT product runtime and authorizes no runtime surface; the contract must state this explicitly. Note 5.48 area 7 records CI as "not asserted"; 5.69/5.71 list CI modification as forbidden current behavior — this phase is the contract that authorizes 5.79 to lift that.

TASK — boundary families in the fixture (standard shape; all-false authorization/unsafe flags; nonAuthorizingProof:true; reportRunsChecks:false):
 1. ci_workflow_scope — exactly two workflows: ci.yml (triggers: push to main + pull_request; concurrency cancel-in-progress) and security.yml (weekly schedule + workflow_dispatch). No other triggers. permissions: contents: read. No secrets. Allowed third-party actions ONLY: actions/checkout, actions/setup-node, dtolnay/rust-toolchain, Swatinem/rust-cache — each pinned to an exact version or commit SHA recorded in the contract.
 2. ci_job_matrix — ci.yml jobs: node (ubuntu: npm ci; npm test; npm run report:phase-status smoke discarded to null), rust (ubuntu: cargo fmt --check; cargo clippy --workspace --all-targets -- -D warnings; cargo test --workspace), node-windows (windows-latest: npm ci; npm test) — included BECAUSE development happens on Windows and the test-script glob has a known Windows/Node-20 expansion hazard.
 3. security_workflow_scope — security.yml: npm audit --audit-level=high; cargo audit; osv-scanner over both lockfiles. Cron-only, never blocking PRs.
 4. test_invocation_portability — contract requirement: the npm test invocation must run the identical test-file set on ubuntu and windows across the supported Node range; record the current hazard (literal glob on Windows cmd + Node 20) and require 5.79 to fix it and update the report-test's pinned package.json script strings in the same slice.
 5. ci_offline_hermetic_guarantee — CI runs fully OFFLINE. The fabric federation client's tests are hermetic (they inject fetchImpl and use fake tokens/loopback URLs — verified). CI MUST NEVER set or provide ARDYN_FABRIC_* / FABRIC_TRANSPORT_D_* / registry secrets, MUST NEVER contact a live sidecar or registry, and MUST NEVER wire federation into a runtime path. (npm test already passes with NO fabric env set.)
 6. ci_forbidden_behavior — CI must never: publish, deploy, write to the repo, mint tokens, use secrets, run semgrep as a gate (semgrep stays a manual evidence command), auto-merge, or execute any blocked runtime surface. Includes the ci_offline_hermetic_guarantee prohibitions.
 7. branch_protection_expectation — metadata only: main requires the node + rust checks once enabled (enablement is a human console action by Josh, recorded as such).
 8. ci_enablement_authorization — explicit statement: workflow files may be created ONLY by 5.79 under Josh's explicit authorization, with Jules review required before merge.
Rejection cases in the focused test must include: ci-with-secrets rejected, ci-with-write-permissions rejected, extra-workflow rejected, semgrep-as-gate rejected, fabric-secret-in-ci rejected, reportRunsChecks:true rejected, authorization-flag-enabled rejected. Follow the expectedCaseClassifications style of tests/phase5-77-*.test.mjs.

Report wiring: add 5.78 inventory + safety flags to scripts/report-phase-status.mjs and tests/report-phase-status.test.mjs per pattern. Set the 5.78 inventory's recommendedNextPhase to "phase-5.79-ci-enablement". Do NOT edit the 5.76/5.76B/5.77 inventory recommendedNextPhase values (historical — each derives from its own immutable fixture). Only the new current head (5.78 inventory) points forward; update the top-level current-phase block (id 5.78, new executionPosture) in the report and its assertion in the report test.

MUST NOT
- Do NOT create or modify anything under .github/. No dependency changes. No new runtime surface. No edits to prior phase docs/fixtures beyond standard report/test wiring. Do not touch/wire/re-block federation.mjs. Reuse shared core helpers (MALFORMED_INPUT sym, isPlainObjectRecord, the cycle-guarded walker at index.mjs:8163) — no new deep-walker/ReviewedAt clones. Mark shortcuts with `ponytail:`. No force-push/history rewrite.

VALIDATION (all must pass)
- Focused 5.78 tests; adjacent bundle 5-74*, 5-75*, 5-76*, 5-76b*, 5-77*; tests/report-phase-status.test.mjs
- npm test ; npm run test:schemas ; npm run report:phase-status (verify current phase 5.78, its inventory recommendedNextPhase = phase-5.79, reportRunsChecks:false, executionPosture keeps the carve-out)
- cargo fmt --check ; cargo check --workspace ; cargo clippy --workspace -- -D warnings ; cargo test --workspace
- git diff --check ; semgrep --config auto . (0) ; npm audit (0) ; cargo audit ; cargo machete

REVIEW & LANDING (ungated — normal flow)
- One read-only reviewer subagent — instruct it to confirm: (a) no .github/ file created, (b) no historical fixture/doc edited (only phase5-78 + report wiring), (c) no new deep-walker clone, (d) federation untouched, (e) executionPosture tokens all true.
- Branch hermes/phase-5-78-ci-enforcement-contract-boundary; single commit "Add Phase 5.78 CI enforcement contract boundary"; fast-forward main; push branch + main; verify HEAD == local main == origin/main == git ls-remote; clean worktree.
- REPORT BACK: PHASE / BRANCH+SHA / FILES CHANGED / TESTS before→after / VALIDATION / REVIEWER disposition / REFS / NOTES + confirmed current-phase 5.78, next phase-5.79.
```

---
After this lands and I verify, the next prompt (5.79 CI enablement) is the FIRST Jules gate: Hermes will push + open a PR + STOP, and I drive the Jules review + merge automatically per the runbook.
