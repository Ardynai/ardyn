# ARDYN — Hermes Agent Prompt Queue (GLM 5.2) — lead planner: Fable 5, 2026-07-02

**Orchestrator change:** Hermes agent (GLM 5.2) replaces Codex as the implementation orchestrator for `Ardynai/ardyn`. Same workflow, same posture, same validation bar. Nothing from the Codex queue has been given to Codex — Hermes starts fresh from the verified baseline.

Baseline: `main` @ `0986ed68c5bde3331b23712b47de57b14c3ae8f2` (Phase 5.76), local == origin, clean tree.

## How to use

Paste one prompt per fresh Hermes session, in order. **Prompt 0 must run first** (onboarding + tooling; commits nothing). Each prompt is self-contained. Run the next only after the previous lands and refs verify. Prompt 1 (5.76A) is a side phase and may run in parallel with Prompt 2.

## Workflow deltas vs the Codex era (everything else identical)

- Branch prefix: `hermes/phase-*` (history keeps its `codex/*` branches; the convention change is recorded in each phase doc's provenance line).
- Reviewer: exactly one **read-only reviewer subagent** per narrow slice (fresh context, no edit tools). If the Hermes harness cannot spawn subagents, do a separate adversarial self-review pass in a fresh context and label it `self-review` in the report — never skip it, never run more than one.
- Jules gates (5.79, 5.83): Hermes pushes the branch and **opens a PR, then STOPS**. Fable (lead planner) drives the Jules review request and the merge using Josh's GITHUB_TOKEN. Ungated phases keep the historical pattern: single commit, fast-forward main locally, push, verify refs.
- Environment is Windows. Use PowerShell-safe commands (`$null` not `/dev/null`, `Get-FileHash` for hashes). Scratch space is `C:\AI\hermes-scratch\ardyn\` — goldens, sync reports, and notes go there, **never into the repo**.
- GITHUB_TOKEN (user env var) exists for PR/Jules control. **Never print it, never write it to any file, commit, log, or error message.** Reference it only as `$env:GITHUB_TOKEN` / `[Environment]::GetEnvironmentVariable('GITHUB_TOKEN','User')` when a prompt explicitly calls for it.

## Order and gates I'm holding

0. **P0** — onboarding, tooling install/verify, baseline validation (no commits)
1. **5.76A** (side) — fabric docs contradiction hotfix
2. **5.77** — Code Mode orchestration boundary map
3. **5.78** — CI enforcement contract (review-only)
4. **5.79** — CI enablement — **JULES GATE (PR + stop)**
5. **5.80** — report-script compaction (byte-identical)
6. **5.81** — report-test compaction + suite performance
7. **5.82** — source-guard hardening + shared test helpers
8. **5.83** — external-reference policy + dependency allowlist — **JULES GATE (PR + stop)**

Everything stays metadata-only, review-only, runtime-blocked. CI (5.79) executes the existing validation suite; it is not product runtime and authorizes nothing. No Claude Code work inside the repo — the visual lane runs outside it (`ARDYN-CLAUDE-CODE-BRIEFS.md`).

---

## PROMPT 0 — Hermes onboarding: repo sync, tooling, baseline validation (NO COMMITS)

```
You are the Hermes agent (GLM 5.2), taking over as implementation orchestrator for the Ardyn repo at C:\Users\Josh\Documents\ardyn (GitHub: Ardynai/ardyn). This session is onboarding only: sync, read, install/verify tooling, run the baseline validation suite, and produce a sync report. YOU MUST NOT commit, push, or modify ANY file inside the repo in this session. If you find yourself about to edit a repo file, stop — that is out of scope.

SCOPE LOCK: allowed writes are ONLY under C:\AI\hermes-scratch\ardyn\ (create it). Nothing else.

STEP 1 — REPO SYNC & IDENTITY
1a. cd C:\Users\Josh\Documents\ardyn ; git fetch origin ; git status --porcelain (must be empty) ; git rev-parse HEAD ; git rev-parse origin/main.
    Expected: HEAD == local main == origin/main == 0986ed68c5bde3331b23712b47de57b14c3ae8f2. If ANY mismatch or dirty file: STOP and report — do not "fix" anything.
1b. git config user.name / user.email — record them. Historical commits are authored "Ardynai <admin@multiverseos.net>". If config differs, report it and WAIT for Josh's choice; do not change config yourself.
1c. git branch -a | count — expect ~117 codex/phase-* branches, all ancestors of main. Leave them alone.
1d. Note: .codegraph/ is a local daemon dir, git-excluded via .git/info/exclude, sometimes file-locked. Never touch, never commit, never add to .gitignore.

STEP 2 — REQUIRED READING (in this order; skim where marked)
2a. AGENTS.md (the "ponytail" ruleset — it BINDS you: reuse existing helpers, minimum code, mark intentional shortcuts with `ponytail:` comments).
2b. CONTRIBUTING.md (safety boundaries: no CI changes unless a task explicitly authorizes; how phases are added).
2c. docs/ONBOARDING.md, docs/architecture.md, docs/how-it-works/ (all 8 pages).
2d. The three newest phase docs: docs/phase-5-74-*.md, phase-5-75-*.md, phase-5-76-*.md, plus their fixtures under tests/fixtures/host-policy/phase5-74..76/ and tests/phase5-76-*.test.mjs — this is the boundary-map pattern you will replicate: doc + fixture + one create*ForReview helper in packages/core/src/index.mjs + focused test + wiring in scripts/report-phase-status.mjs and tests/report-phase-status.test.mjs.
2e. Background from the lead planner (read-only, outside repo): C:\AI\obsidian-mind\Projects\Ardyn\ — "Ardyn - Overview.md", "Ardyn - Phase Chain.md", "Ardyn - Standing Guardrails.md", "Ardyn - Fable 5 Review 2026-07-02.md".
2f. Memorize the posture: metadata-only, review-only, runtime-blocked. serve-runtime (with and without --dry-run) is refused; all authorization/unsafe flags are false everywhere; reportRunsChecks is false and honest; every runtime surface (evaluator, approvals, process control, stdio loops, DB, shell, SQLite, Matrix, CUA, Secure Drop, fabric transport, Code Mode) is blocked until an explicit authorization phase.

STEP 3 — TOOLING VERIFY + INSTALL MISSING (installs are machine-level, NEVER into the repo; record every version)
For each tool: check version; if missing, install via winget/scoop/npm -g/cargo install/pipx (pick what exists on this machine); re-check; record.
3a. Core: git; node (>=20 required; RECOMMEND 22+ — there is a known Windows+Node20 test-glob hazard; if you install 22, record it, but do NOT edit package.json engines in this session); npm; rustup + stable toolchain; cargo; rustfmt + clippy components.
3b. Rust security: cargo-audit, cargo-machete, cargo-deny (installed even though deny.toml doesn't exist yet).
3c. Scanners: semgrep (used every phase), osv-scanner, trivy.
3d. JS/docs (verify availability ONLY — the repo has no configs for these; do NOT add configs): prettier, eslint, biome, knip, depcheck, markdownlint(-cli).
3e. Misc: taplo, shellcheck, PSScriptAnalyzer; python tools if present (ruff, mypy, pyright, pip-audit, bandit, vulture) — repo has no Python, presence is enough. mega-linter-runner is known broken (--version errors) — note and skip.
3f. gh CLI (optional but preferred for the PR gates): gh --version; test auth with: $env:GH_TOKEN=[Environment]::GetEnvironmentVariable('GITHUB_TOKEN','User'); gh auth status. NEVER print the token value.
3g. npm ci at repo root (sync node_modules exactly from package-lock; only ajv is expected).

STEP 4 — BASELINE VALIDATION RUN (all read-only; record exact results and wall-clock times)
- npm test                      (expect 1068 passing)
- npm run test:schemas
- npm run report:phase-status   (expect: reports Phase 5.76, reportRunsChecks:false; record output byte size)
- cargo fmt --check ; cargo check --workspace ; cargo clippy --workspace -- -D warnings ; cargo test --workspace (expect ~98 tests)
- git diff --check ; git diff --cached --check
- semgrep --config auto .       (expect 0 findings)
- npm audit --json              (expect 0 vulnerabilities)
- cargo audit ; cargo machete
If anything fails: STOP, record the failure verbatim, report. A dirty baseline must be triaged by Josh/Fable before any phase work.

STEP 5 — CAPABILITY SELF-REPORT
Report: can you spawn a read-only reviewer subagent (fresh context, no edit tools)? What tools do you have (shell, file edit, web)? Context window limits that affect reading the 69k-line packages/core/src/index.mjs (plan to navigate it with grep/offsets, never full reads)? Confirm you can push to origin (git remote -v; do NOT push anything now).

STEP 6 — SYNC REPORT
Write C:\AI\hermes-scratch\ardyn\SYNC-REPORT.md containing: refs verified; git identity; reading-list confirmation with a 10-line summary of the boundary-map pattern IN YOUR OWN WORDS; tool inventory table (tool | version | preinstalled/installed-now | install method); full baseline validation results + timings; capability self-report; any anomalies. Then paste the full report back to Josh in chat.

DONE CRITERIA: refs match baseline; all reading done; all step-3 tools resolve a version or are recorded as unavailable-with-reason; baseline suite fully green; SYNC-REPORT.md written and pasted; ZERO modifications inside the repo (git status --porcelain still empty — prove it at the end).
```

---

## PROMPT 1 — Phase 5.76A (side phase) — Fabric documentation contradiction hotfix + fabric glossary

```
You are the Hermes agent (GLM 5.2), implementation orchestrator for Ardynai/ardyn (local: C:\Users\Josh\Documents\ardyn). Prompt 0 onboarding is complete.
Flow: inspect → plan → implement → verify. Keep the slice small and deterministic. SCOPE LOCK: touch only the files this prompt names or that inspection proves are pinned to them; if you drift, stop and re-plan.

CONTEXT
- Verify before starting: git fetch; HEAD == local main == origin/main == 0986ed68c5bde3331b23712b47de57b14c3ae8f2; clean worktree. Abort and report if not.
- Posture: metadata-only, review-only, runtime-blocked. This is a SIDE phase (5.38A/5.44A pattern): documentation/metadata consistency only. It does NOT continue the numbered chain and must NOT change recommendedNextPhase anywhere.
- Problem (2026-07-02 audit): docs/content-fabric.md contradicts the fabric standing rule. Line ~128 lists "BitTorrent infohash verification" under "Remaining Runtime Requirements" and line ~44 area references torrent-client behavior. Standing rule: the content-addressed/chunked/integrity-verified/resumable/multi-source transport is COMPLETE and security-reviewed in Ardynai/multiverse packages/fabric-core (+ fabric-transport-d loopback sidecar); Ardyn consumes, never rebuilds; BitTorrent/DHT/swarm/P2P deps are permanently banned. Additionally four "fabric" meanings collide in this repo: (1) legacy "Content Fabric v1.0.0" byte-conformance in packages/fabric + docs/content-fabric.md, (2) the Phase 5.59 cross-repo Fabric coordination envelope, (3) @multiverse/fabric-core transport (producer: Multiverse), (4) the content-fabric repo family that owns canonical Secure Drop.

TASK
1. INSPECT FIRST: rg -n "content-fabric|torrent|infohash|magnet|webseed" across docs/ tests/ scripts/ packages/ — find every reference and every test that pins content-fabric.md prose (check tests/host-policy-preconditions.test.mjs and any phase-1.5/fabric conformance tests). List the pinned strings in your plan BEFORE editing.
2. Amend docs/content-fabric.md:
   - Remove BitTorrent/torrent/seeding items from "Remaining Runtime Requirements". Replace with a supersession note: transport is provided by @multiverse/fabric-core / fabric-transport-d (producer: Ardynai/multiverse); Ardyn is future-consumer-only per Phase 5.75; P2P/BitTorrent/DHT/swarm dependencies are permanently out of scope for Ardyn.
   - Relabel the existing infohash/magnet/webseed VALIDATION in packages/fabric as "legacy Content Fabric v1.0.0 byte-conformance only — not a transport roadmap".
   - Replace machine-local provenance paths (C:\AI\obsidian-mind\..., C:\AI\locus\...) with repo-relative or repo-name references.
3. Add docs/fabric-glossary.md: one short section per fabric meaning (the four above): what it is, where it lives, status, what Ardyn may/may not do with it. Link FROM content-fabric.md to the glossary. Do NOT edit any docs/phase-*.md (phase docs are pinned evidence).
4. If a test pins exact prose you must change, update that test minimally and record before/after pinned strings in the phase doc... this side phase gets a short doc: docs/phase-5-76a-fabric-doc-contradiction-hotfix.md recording what changed and why, with the provenance line noting the orchestrator/branch convention change (Hermes agent, GLM 5.2, hermes/* branches).
5. Do NOT touch fixtures, packages/core, or the torrentDownloadEnabled safety-flag vocabulary anywhere (those flags assert false and stay).

MUST NOT
- No dependency changes, no code behavior changes, no fixture changes, no recommendedNextPhase changes, no CI files, no runtime surfaces, no force-push/rebase/history edits, no committing scratch files.

VALIDATION (all must pass; run in this order)
- Focused: any tests touched + tests/host-policy-preconditions.test.mjs
- npm test (expect 1068 passing unless a pinned-prose test legitimately changed a count — explain any delta) ; npm run test:schemas ; npm run report:phase-status
- cargo fmt --check ; cargo check --workspace ; cargo clippy --workspace -- -D warnings ; cargo test --workspace
- git diff --check ; semgrep --config auto . (0 findings) ; npm audit (0) ; cargo audit ; cargo machete

REVIEW & LANDING
- Exactly one read-only reviewer subagent at the end (fresh context, no edit tools); reuse the same reviewer only if it finds a concrete issue you then fix. If subagents are unavailable, one adversarial self-review pass in fresh context, labeled as such. Jules: not required.
- Branch hermes/phase-5-76a-fabric-doc-contradiction-hotfix; single commit "Add Phase 5.76A fabric doc contradiction hotfix"; fast-forward main locally; push branch and main; verify HEAD/main/origin/main and git ls-remote origin refs/heads/main all match; clean worktree.
- REPORT BACK (exact format): PHASE / BRANCH+COMMIT SHA / FILES CHANGED / TESTS before→after / VALIDATION results / REVIEWER disposition / REFS verified / NOTES-DEVIATIONS.
```

---

## PROMPT 2 — Phase 5.77 — Review-only Code Mode orchestration contract boundary map

```
You are the Hermes agent (GLM 5.2), implementation orchestrator for Ardynai/ardyn (local: C:\Users\Josh\Documents\ardyn).
Flow: inspect → plan → implement → verify. SCOPE LOCK: this phase creates the standard 5-artifact set + report wiring; nothing else.

CONTEXT
- Verify: git fetch; clean worktree; local main == origin/main. Valid parents: 5.76 (0986ed68...) or 5.76A if it landed first.
- Posture: metadata-only, review-only, runtime-blocked. Phase 5.77 records deterministic review-only metadata for a FUTURE Code Mode: an orchestrated coding workflow (human request → orchestrator plans → spawns own subagents → optional mini-fusion pass → judge/reviewer comparison → orchestrator synthesis → human receives final output, with a lightweight front-desk responder while the orchestrator is busy). No outside agents unless the human explicitly requests. Loop: plan → implement → test → fix → review. Installed toolkit checks are selected by relevance, never all-tools-every-time. ALL of it stays blocked until a future authorization phase.
- Replicate the boundary-map pattern from phases 5.74/5.75/5.76 exactly (doc + fixture + one create*ForReview core helper + focused test + report wiring). This phase must go DEEPER than 5.68's capability flags: it defines CONTRACT SHAPES (required fields), not just blocked booleans. Cross-reference, don't duplicate: 5.68 (profile/fusion/front-desk capability boundaries), 5.70 (front-desk busy-state, cancellation, leases), 5.71 (code_mode_governance, toolkit evidence, no polling/no-op subagents), 5.60 (inter-agent handoff provenance), 5.62 (permissions), 5.64 (rate limits as budget vocabulary), 5.65 (audit), 5.72 (credential custody), 4.1C (redaction), 4.1D (transcript persistence), 4.1E (failure/kill semantics), 5.18–5.31 evaluator vocabulary for human approval gates, and the existing createTaskPlan/schemas/task.schema.json as the plan-contract anchor.
- Navigating packages/core/src/index.mjs (69k lines): use grep/offsets; NEVER attempt a full read. The 5.76 block starts near line 69324 — study it as your template.

TASK
Create Phase 5.77 with 12 boundary families in the fixture (each with the standard boundaryId/boundaryFamily/relatedSystem/currentStatus:"blocked"/allowedCurrentBehavior/forbiddenCurrentBehavior/requiredFutureContractBeforeImplementation/requiredFutureAuthorizationPhaseBeforeRuntime shape, all-false authorization/unsafe flags, nonAuthorizingProof: true, reportRunsChecks: false):
 1. orchestrator_plan_contract — plan schema: goal, decomposition, role assignments, per-step budgets, expected artifacts, human-approval checkpoints; plan extends the createTaskPlan/task.schema.json shape; a plan is itself a review artifact.
 2. subagent_spawn_role_contract — role taxonomy (planner/implementer/tester/reviewer/judge/front-desk/coordinator, reusing 5.68's profile list); per-role capability manifest MUST be a subset of the orchestrator grant (subagentCapabilitiesSubsetOfParent); spawn-depth cap; per-subagent identity/attribution per docs/harness-identity.md; external agents DEFAULT-DENY, invitable only via explicit human-request flag.
 3. fusion_pass_contract — optional mini-fusion: candidate provenance IDs, deterministic merge requirements, candidateCountCap, fusion output must cite contributing candidates.
 4. judge_comparison_contract — judge context isolated from producers (judgeContextIsolatedFromProducers), candidate pseudonymization, judge never scores a candidate it produced, structured per-criterion verdict with mandatory evidence field, tie-break and escalate-to-human semantics, judge identity+model recorded.
 5. synthesis_result_contract — final output references contributing artifacts; judge dissent carried forward (dissentCarriedForward) and overruled objections enumerated; maps onto session-event/session-transcript schemas.
 6. front_desk_contract — busy-scope allowlist/denylist; every answer carries stateSnapshotSequence + staleness disclosure; zero spawn authority, zero approval authority, no commitments about in-flight work; mandatory hand-back event.
 7. toolkit_check_selection_contract — relevance-based selection of installed toolkit checks with recorded rationale ("not every tool every time"); Fallow advisory only, never Fallow Runtime.
 8. loop_semantics_contract — plan→implement→test→fix→review; maxIterationsPerLoop is a REQUIRED field (input without it is rejected, same as reportRunsChecks:true inputs today); no-progress rule (identical failure signature twice → abort/escalate); loop_budget_exhausted as a first-class terminal classification; per-iteration checkpoint for cancellation (5.70).
 9. failure_abort_contract — abort/partial-result semantics aligned with 4.1E failure-audit/kill semantics.
 10. audit_transcript_contract — every spawn/verdict/fusion/synthesis/hand-back emits session events; redaction per 4.1C; persistence per 4.1D; provenance labels required on all inter-role payloads (cross-ref 5.60).
 11. human_approval_gate_contract — which transitions require human approval (plan release, privilege escalation, external-agent invite, final output), reusing 5.18–5.31 evaluator vocabulary.
 12. code_mode_blocked_runtime_list — standard negative block: no model API calls, no subagent processes, no front-desk responder, no judge/fusion execution, no loop runtime, no toolkit invocation, plus the standard backend/DB/fabric/SecureDrop/Matrix/shell/SQLite blocks, cross-referenced to their owning phases.
Budgets (tokens/calls/wall-clock) are required plan fields using 5.64's vocabulary; running-cost events belong to the audit contract; cost exhaustion fails closed returning partials with an explicit exhausted classification.

Focused test must cover, minimum (expectedCaseClassifications map style of tests/phase5-76-*.test.mjs): valid canonical fixture; malformed input; unknown top-level field; authorization-flag-enabled; reportRunsChecks:true; hidden-runtime-semantics; blocked-CLI-bypass; missing maxIterationsPerLoop rejected; judge-produces-own-candidate rejected; external-agent-default-allow rejected; front-desk-with-approval-authority rejected.

Report wiring: add 5.77 inventory + safety flags to scripts/report-phase-status.mjs and tests/report-phase-status.test.mjs per pattern; set recommendedNextPhase to "phase-5.78-review-only-ci-enforcement-contract-boundary-map" in fixture, report, and report test.

MUST NOT
- No orchestration runtime, no model calls, no subagent spawning IN THE PRODUCT (your own reviewer subagent for this session is fine), no new dependencies, no CI files, no edits to prior phase docs/fixtures beyond the standard report/test wiring, no force-push/history edits.
- Reuse existing shared helpers in packages/core (e.g., the cycle-guarded nested-true-claim walker near index.mjs:8163, isPlainObjectRecord, timestamp validators). Do NOT clone new deep-walker/ReviewedAt helpers — the 2026-07-02 audit found 17 byte-identical clones; do not add an 18th. Keep the new block as small as the pattern allows; mark intentional shortcuts with `ponytail:` comments.

VALIDATION (all must pass)
- Focused 5.77 tests; adjacent bundle tests/phase5-68*, 5-70*, 5-71*, 5-74*, 5-75*, 5-76*; tests/report-phase-status.test.mjs
- npm test ; npm run test:schemas ; npm run report:phase-status (must show 5.77, reportRunsChecks:false)
- cargo fmt --check ; cargo check --workspace ; cargo clippy --workspace -- -D warnings ; cargo test --workspace
- git diff --check ; semgrep --config auto . (0) ; npm audit (0) ; cargo audit ; cargo machete

REVIEW & LANDING
- One read-only reviewer subagent (or labeled self-review); reuse only on a concrete found-and-fixed issue. Jules: not required.
- Branch hermes/phase-5-77-code-mode-orchestration-boundary; single commit "Add Phase 5.77 code mode orchestration boundary"; fast-forward main; push branch + main; verify refs incl. ls-remote; clean worktree.
- REPORT BACK: PHASE / BRANCH+SHA / FILES CHANGED / TESTS before→after / VALIDATION / REVIEWER disposition / REFS / NOTES + confirmed recommendedNextPhase.
```

---

## PROMPT 3 — Phase 5.78 — Review-only CI enforcement contract boundary map

```
You are the Hermes agent (GLM 5.2), implementation orchestrator for Ardynai/ardyn (local: C:\Users\Josh\Documents\ardyn).
Flow: inspect → plan → implement → verify. SCOPE LOCK: standard 5-artifact set + report wiring; ZERO files under .github/.

CONTEXT
- Verify: clean worktree, main == origin/main, parent phase 5.77.
- Posture: metadata-only, review-only, runtime-blocked. Today .github/ contains only copilot-instructions.md; CONTRIBUTING forbids CI workflow changes unless a task explicitly asks; 5.48 area 7 records CI as not asserted; 5.69/5.71 list CI modification as forbidden current behavior. This phase writes the CONTRACT for CI before any workflow file exists — the same contract-then-enable two-step the repo uses everywhere. Rationale (2026-07-02 audit): every committer is an AI agent; all 1,068 tests and every source-guard tripwire are enforced only by voluntary local runs.
- CI is check-execution over the EXISTING validation suite. It is not product runtime; it authorizes no runtime surface. The contract must say this explicitly.

TASK
Create Phase 5.78 per the standard pattern defining the CI enforcement contract with these boundary families:
 1. ci_workflow_scope — exactly two workflows: ci.yml (push to main + pull_request; concurrency cancel-in-progress) and security.yml (weekly schedule + workflow_dispatch). No other triggers. permissions: contents: read. No secrets. Allowed third-party actions ONLY: actions/checkout, actions/setup-node, dtolnay/rust-toolchain, Swatinem/rust-cache — pinned to exact versions or commit SHAs recorded in the contract.
 2. ci_job_matrix — ci.yml jobs: node (ubuntu: npm ci; npm test; npm run report:phase-status smoke discarded to null), rust (ubuntu: cargo fmt --check; cargo clippy --workspace --all-targets -- -D warnings; cargo test --workspace), node-windows (windows-latest: npm ci; npm test) — included BECAUSE development happens on Windows and the test-script glob has a known Windows/Node-20 expansion hazard.
 3. security_workflow_scope — security.yml: npm audit --audit-level=high; cargo audit; osv-scanner over both lockfiles. Cron-only, never blocking PRs.
 4. test_invocation_portability — contract requirement: the npm test invocation must run the identical test-file set on ubuntu and windows under the supported Node range; record the current hazard (literal glob on Windows cmd + Node 20) and require the enablement phase (5.79) to fix it and update the report-test's pinned package.json script strings in the same slice.
 5. ci_forbidden_behavior — CI must never: publish, deploy, write to the repo, mint tokens, use secrets, run semgrep as a gate (semgrep stays a manual evidence command), auto-merge, or execute any blocked runtime surface.
 6. branch_protection_expectation — metadata only: main requires the node + rust checks once enabled (enablement is a human console action by Josh, recorded as such).
 7. ci_enablement_authorization — explicit statement: workflow files may be created ONLY by the next phase (5.79) under Josh's explicit authorization, with Jules review required before merge.
Fixture/test/report wiring per pattern; rejection cases must include: ci-with-secrets rejected, ci-with-write-permissions rejected, extra-workflow rejected, semgrep-as-gate rejected, reportRunsChecks:true rejected. Set recommendedNextPhase to "phase-5.79-ci-enablement".

MUST NOT
- Do NOT create or modify anything under .github/. No dependency changes. No runtime surfaces. No prior-fixture edits. Reuse shared core helpers (no new clones).

VALIDATION (all must pass)
- Focused 5.78 tests; tests/report-phase-status.test.mjs; npm test; npm run test:schemas; npm run report:phase-status
- cargo fmt --check ; cargo check --workspace ; cargo clippy --workspace -- -D warnings ; cargo test --workspace
- git diff --check ; semgrep --config auto . (0) ; npm audit (0) ; cargo audit ; cargo machete

REVIEW & LANDING
- One read-only reviewer subagent (or labeled self-review). Jules: not required for the contract slice (required at 5.79).
- Branch hermes/phase-5-78-ci-enforcement-contract-boundary; single commit; fast-forward main; push; verify refs; clean worktree; standard REPORT BACK.
```

---

## PROMPT 4 — Phase 5.79 — CI enablement (authorized workflow creation) — JULES GATE: PR + STOP

```
You are the Hermes agent (GLM 5.2), implementation orchestrator for Ardynai/ardyn (local: C:\Users\Josh\Documents\ardyn).
Flow: inspect → plan → implement → verify. SCOPE LOCK: only what the 5.78 contract specifies + the 5.79 phase record.

AUTHORIZATION
- This prompt IS Josh's explicit authorization to create CI workflow files, exactly and only as specified by the Phase 5.78 contract fixture. CONTRIBUTING's "no CI changes unless the task explicitly asks" is satisfied by this task. Anything not in the 5.78 contract is out of scope.

CONTEXT
- Verify: clean worktree, main == origin/main, parent phase 5.78. Read the 5.78 contract fixture FIRST and treat it as the spec.
- CI executes the existing validation suite; it is not product runtime and authorizes no runtime surface.
- LANDING IS DIFFERENT FOR THIS PHASE: you will NOT merge to main. You push the branch, open a PR, and STOP. Jules review is required; Fable (lead planner) drives the Jules request and merge via Josh's GITHUB_TOKEN.

TASK
 1. Create .github/workflows/ci.yml and .github/workflows/security.yml exactly per the 5.78 contract (jobs, triggers, permissions: contents: read, pinned action versions, concurrency, no secrets).
 2. Fix test-invocation portability per the 5.78 contract: choose the invocation that provably runs the identical current test-file set on ubuntu and windows across the supported Node range. Verify EMPIRICALLY on this machine: list discovered test files before/after (e.g., node --test with a reporter, or a file-glob dry run) and include both lists' counts in the phase doc. If you change engines or the test script string, update package.json and the pinned script-string assertions in tests/report-phase-status.test.mjs in this same slice, minimally.
 3. Add the Phase 5.79 record per pattern (doc + fixture + focused test + report wiring) documenting: workflows created; a conformance table mapping every workflow line ↔ 5.78 contract field; branch protection as a pending human console step for Josh. Set recommendedNextPhase to "phase-5.80-report-script-compaction".
 4. Run locally everything CI will run (both jobs' full command lists) and record results in the phase doc.
 5. Push: git push -u origin hermes/phase-5-79-ci-enablement. NOTE: pushing workflow files requires the pushing credential to have the `workflow` scope. If the push is rejected for workflow scope, retry the push using the token remote for THIS PUSH ONLY, without ever printing the token:
    $tok=[Environment]::GetEnvironmentVariable('GITHUB_TOKEN','User'); git push https://x-access-token:$tok@github.com/Ardynai/ardyn.git hermes/phase-5-79-ci-enablement
    (Run it in a way that does not echo the command with the token into any log you paste back. Never write the token to disk.)
 6. Open the PR (gh preferred): title "Phase 5.79 — CI enablement per 5.78 contract"; body: contract-conformance table, local run evidence, note that Jules review is required before merge. Then STOP. Do not merge. Report the PR number/URL.

MUST NOT
- No steps, triggers, permissions, or actions beyond the 5.78 contract. No secrets in workflows. No deploy/publish. No semgrep gate. No auto-merge. No merge to main by you. No other repo changes. Never print or persist the token.

VALIDATION (all must pass locally before opening the PR)
- Focused 5.79 tests; tests/report-phase-status.test.mjs; npm test; npm run test:schemas; npm run report:phase-status
- cargo fmt --check ; cargo check --workspace ; cargo clippy --workspace -- -D warnings ; cargo test --workspace
- git diff --check ; semgrep --config auto . (0) ; npm audit (0) ; cargo audit ; cargo machete
- actionlint on both workflow files if available (install via scoop/winget if trivial; otherwise note as unavailable)

REVIEW & LANDING — JULES GATE
- One read-only reviewer subagent BEFORE pushing. Then push branch → open PR → STOP.
- REPORT BACK: PHASE / BRANCH+SHA / PR URL / FILES CHANGED / test-file-set before/after counts / VALIDATION / REVIEWER disposition / NOTES. Fable will trigger Jules on the PR, watch the first Actions runs, and merge on APPROVE; after merge, Josh enables branch protection (require node + rust checks) in the GitHub UI.
```

---

## PROMPT 5 — Phase 5.80 — Report-script compaction (byte-identical, manifest-driven)

```
You are the Hermes agent (GLM 5.2), implementation orchestrator for Ardynai/ardyn (local: C:\Users\Josh\Documents\ardyn).
Flow: inspect → plan → implement → verify. SCOPE LOCK: scripts/report-phase-status.mjs, new scripts/phase-status-manifests/**, the 5.80 phase record, CONTRIBUTING's "add a phase" section — nothing else.

CONTEXT
- Verify: clean worktree, main == origin/main, parent phase 5.79 MERGED (CI green on main — check the Actions tab result via gh run list if available, or ask Josh).
- Problem (2026-07-02 audit): scripts/report-phase-status.mjs is 36,393 lines, ~99.9% hand-appended per-phase data (99 sequential top-level readJson calls at ~lines 45–357; per-phase SafetyFlags literals; one giant report literal from ~line 3091). Output is 5.28MB, superlinear growth. This slice makes the report data-driven with BYTE-IDENTICAL output. Refactor only; no schema or semantic change; reportRunsChecks stays false; the script keeps fs-only imports (a source-guard test asserts the import list — keep it passing).

TASK
 1. Golden snapshot (outside the repo): node scripts/report-phase-status.mjs > C:\AI\hermes-scratch\ardyn\golden-5-80.json ; record (Get-FileHash -Algorithm SHA256 C:\AI\hermes-scratch\ardyn\golden-5-80.json).Hash.
 2. Mechanically extract each phase's data into scripts/phase-status-manifests/phase-<id>.json (id, name, executionPosture tokens, fixtureReads, inventory block, safetyFlags, verificationCommand) plus an explicit ordered scripts/phase-status-manifests/index.json (an array — NOT readdir — key order and phase order must be preserved exactly for byte-identity; JSON.stringify follows insertion order, so manifest field order matters too).
 3. Replace the script body with a small generic loader (~200 lines): read index.json → for each manifest: existence checks preserving the existing localStatus semantics, inline referenced fixture JSON, merge safetyFlags in manifest order, append verificationCommands → emit the identical report object shape with unchanged schemaVersion "ardyn.phase-status-report.v1" and unchanged header/tail notes.
 4. Verify byte-for-byte: SHA256(new output) == SHA256(golden). This is the phase's headline claim — record BOTH hashes in the phase doc. If they differ, diff and fix the LOADER, never the expectation.
 5. tests/report-phase-status.test.mjs must pass UNTOUCHED except its source-guard allowed-imports list if the loader's imports change (keep node:fs / node:path / node:url only). If anything else fails, your refactor changed behavior — fix the refactor, not the test.
 6. Add the Phase 5.80 record per pattern (doc + fixture + focused test asserting: manifest count == phase count; index order == report order; the golden-hash procedure is documented). Update CONTRIBUTING's "how to add a phase": new phases add one manifest + fixtures; zero script edits. Set recommendedNextPhase to "phase-5.81-report-test-compaction".

MUST NOT
- No output changes (bytes!), no schemaVersion bump, no new deps, no error-handling behavior changes (per-fixture try/catch → "unreadable" status is EXPLICITLY deferred — it changes output), no edits to phase fixtures, no committing the golden file or anything from C:\AI\hermes-scratch\.

VALIDATION (all must pass)
- Byte-identity hash check (headline) ; focused 5.80 tests ; tests/report-phase-status.test.mjs ; npm test ; npm run test:schemas ; npm run report:phase-status
- cargo fmt --check ; cargo check --workspace ; cargo clippy --workspace -- -D warnings ; cargo test --workspace
- git diff --check ; semgrep --config auto . (0) ; npm audit (0) ; cargo audit ; cargo machete

REVIEW & LANDING
- One read-only reviewer subagent — instruct it to INDEPENDENTLY re-run the report and verify the hash equality itself. Jules: not required (CI now runs the suite independently).
- Branch hermes/phase-5-80-report-script-compaction; single commit; fast-forward main; push; verify refs + green CI on main; standard REPORT BACK including both hashes.
```

---

## PROMPT 6 — Phase 5.81 — Report-test compaction + suite performance

```
You are the Hermes agent (GLM 5.2), implementation orchestrator for Ardynai/ardyn (local: C:\Users\Josh\Documents\ardyn).
Flow: inspect → plan → implement → verify. SCOPE LOCK: tests/report-phase-status.test.mjs, the ~28 other test files that spawn the report (memoization only), the 5.81 phase record.

CONTEXT
- Verify: clean worktree, main == origin/main, parent phase 5.80, CI green.
- Problem: tests/report-phase-status.test.mjs is 33,462 lines with one hardcoded block per phase, calls runReport() fresh in ~114 of 116 tests (each spawning the script and parsing 5.28MB — ~128 renders per full suite), and caps child stdout at maxBuffer: 16MB (~line 8161) while output grows ~200KB/phase — a scheduled outage. The invariant tests (all safety flags false; statuses ∈ {present,missing}; stderr empty; source-guard on script imports; reportRunsChecks/externalCi honesty) are the valuable part and MUST all survive.

TASK
 1. Memoize: one top-level shared render (const reportPromise = runReport()) reused by all tests in the file; keep exactly ONE separate fresh-spawn test asserting clean process behavior (exit 0, empty stderr) independently.
 2. Convert the per-phase hardcoded blocks into one loop over scripts/phase-status-manifests/index.json (from 5.80): for each manifest assert the report inventory matches the manifest (id, name, fixture statuses present, safety flags all false, verification command present). Same assertions, derived from the same data source the script uses — adding a phase no longer edits this test.
 3. Keep, do not weaken: the source-guard test on script imports; reportRunsChecks/externalCi honesty assertions; exact-string assertions for package.json scripts; the current-phase id/name/executionPosture assertion (now derived from the last index entry).
 4. maxBuffer: raise to 64MB AND add a guard test that FAILS when report size exceeds 50% of the configured buffer, with a message telling the maintainer to plan compaction — turn the silent future outage into a loud early warning.
 5. Sweep the other test files that spawn the report (audit found ~28 files/160 spawns): where a file spawns it more than once, memoize within that file. Do not restructure unrelated assertions.
 6. Add the Phase 5.81 record per pattern; record before/after full-suite wall-clock times in the phase doc. Set recommendedNextPhase to "phase-5.82-source-guard-hardening".

MUST NOT
- No assertion DELETIONS (derivation changes only — the reviewer will diff the assertion inventory), no report script/output changes, no new deps, no fixture edits, no committing scratch files.

VALIDATION (all must pass)
- Full suite twice with timings (evidence) ; focused 5.81 tests ; npm test ; npm run test:schemas ; npm run report:phase-status
- cargo fmt --check ; cargo check --workspace ; cargo clippy --workspace -- -D warnings ; cargo test --workspace
- git diff --check ; semgrep --config auto . (0) ; npm audit (0) ; cargo audit ; cargo machete

REVIEW & LANDING
- One read-only reviewer subagent — instruct it: verify no assertion CLASS was dropped (diff assertion inventory, not line count). Jules: not required.
- Branch hermes/phase-5-81-report-test-compaction; single commit; fast-forward main; push; verify refs + green CI; standard REPORT BACK with timing delta and new test count.
```

---

## PROMPT 7 — Phase 5.82 — Source-guard hardening + shared test helpers

```
You are the Hermes agent (GLM 5.2), implementation orchestrator for Ardynai/ardyn (local: C:\Users\Josh\Documents\ardyn).
Flow: inspect → plan → implement → verify. SCOPE LOCK: apps/cli/src/index.mjs (command table export ONLY — dispatcher behavior byte-identical), tests/helpers/**, the enumerated regex-fix files, CONTRIBUTING, the 5.82 phase record.

CONTEXT
- Verify: clean worktree, main == origin/main, parent phase 5.81, CI green.
- Problems (2026-07-02 audit): (a) ~106 test files enforce invariants by regexing SOURCE TEXT (assert.doesNotMatch over file contents), several building new RegExp(command) from UNESCAPED strings (metacharacter hazard; contrast tests/phase4-1c-framing-redaction-contracts.test.mjs:429 which escapes correctly); a comment containing a blocked word can fail the suite, and refactors are locked out. (b) ~71 test files pin baseline git commits and byte-compare files via git show — breaks on shallow clones/mirrors/forks. (c) tests/helpers/ exists and is EMPTY while ~102 files re-define execFileAsync, ~89 assertAllFalse, ~58 readJson, ~15 runReport. This slice hardens the pattern FORWARD without rewriting history.

TASK
 1. Export the CLI command surface as data: from apps/cli/src/index.mjs export a frozen COMMAND_TABLE (command name → handler kind → blocked|allowed) that the ACTUAL dispatcher consumes (single source of truth — a parallel list that can drift is a fail). CLI behavior must remain byte-identical: same stdout/stderr/exit codes for every existing CLI test.
 2. Escape-hazard fix (mechanical, enumerated): find every new RegExp(<variable>) over source text in tests/; route them through one shared escapeRegExp helper. List every file touched in the phase doc.
 3. Populate tests/helpers/: exec.mjs (execFileAsync), asserts.mjs (assertAllFalse + assertStatusesPresent), json.mjs (readJson), report.mjs (memoized runReport). POLICY (add to CONTRIBUTING): new/modified tests MUST import these; existing untouched tests keep their local copies (historical evidence stays byte-stable). NOTE the npm test glob: confirm the test runner does NOT treat tests/helpers/*.mjs as test files (they contain no test() blocks; verify discovery is unaffected on this machine).
 4. Baseline-commit policy forward (document in CONTRIBUTING + phase doc): new phases stop adding git-show byte-compare pins; each new phase fixture instead carries a sha256 digest manifest of its own files, asserted from the worktree. Do NOT remove existing pins (historical provenance stays); this changes only the forward pattern.
 5. Add the Phase 5.82 record per pattern (doc + fixture + focused test that: imports the helpers; asserts COMMAND_TABLE matches live CLI behavior for every blocked command; asserts the enumerated files use escapeRegExp). Set recommendedNextPhase to "phase-5.83-external-reference-policy".

MUST NOT
- No CLI behavior changes (prove with the full CLI test family), no deletion of existing guards, no prior-fixture edits, no new deps, no history rewrites.

VALIDATION (all must pass)
- Focused 5.82 tests ; full CLI test family ; npm test ; npm run test:schemas ; npm run report:phase-status
- cargo fmt --check ; cargo check --workspace ; cargo clippy --workspace -- -D warnings ; cargo test --workspace
- git diff --check ; semgrep --config auto . (0) ; npm audit (0) ; cargo audit ; cargo machete

REVIEW & LANDING
- One read-only reviewer subagent — instruct it: confirm COMMAND_TABLE is the real dispatch source (not a drift-prone copy) and CLI output is byte-identical. Jules: not required.
- Branch hermes/phase-5-82-source-guard-hardening; single commit; fast-forward main; push; verify refs + green CI; standard REPORT BACK.
```

---

## PROMPT 8 — Phase 5.83 — External-reference policy + dependency allowlist — JULES GATE: PR + STOP

```
You are the Hermes agent (GLM 5.2), implementation orchestrator for Ardynai/ardyn (local: C:\Users\Josh\Documents\ardyn).
Flow: inspect → plan → implement → verify. SCOPE LOCK: the 5.83 artifact set + docs/external-reference-policy.md; no dependency changes of any kind.

CONTEXT
- Verify: clean worktree, main == origin/main, parent phase 5.82, CI green.
- Problem (2026-07-02 audit): several standing guardrails exist only in prose or session lore. Phase 5.60 (GLOSSOPETRAE) is the gold standard — explicit unsafe-field metadata + test-asserted rejections + CLI keyword probes. Phases 5.68 (Hermes/CUA), 5.73 (Matrix), 5.74 (shell), 5.76 (SQLite) have metadata but NO CLI rejection probes or import guards. Lore-only rules with no committed artifact: no training/GPU deps (torch/tensorflow/jax); Goose/Onyx/fainir never imported; OpenClaw reference-only; no P2P/BitTorrent/DHT deps (one negative dep test in 5.75; no allowlist); Fallow advisory-only.
- Note the irony consciously: YOU are a Hermes agent, and hermes-agent-the-repo (NousResearch/hermes-agent) is itself one of the blocked reference families. The policy blocks IMPORTING/VENDORING that code into Ardyn; it does not restrict which harness Josh uses to edit the repo. State this distinction in the policy file so future sessions don't confuse the two.

TASK
 1. Create tests/fixtures/host-policy/phase5-83/external-reference-policy.json: one entry per reference family — glossopetrae, hermes_agent, cua_computer_use, matrix_hiclaw, codecrafters_shell, codecrafters_sqlite, fabric_core_multiverse, secure_drop_content_fabric, openclaw, goose, onyx, fainir, fallow — each with: source, status (architecture_reference_only | taxonomy_reference_only | future_consumer_pending_contract | external_canonical_owner | advisory_only), unsafe families, allowed usage, forbidden usage, owning-phase cross-reference, test-coverage pointer.
 2. Dependency allowlist in the same fixture: npm allowlist (exactly: ajv devDependency) and cargo allowlist (exactly: serde, serde_json, sha2); forbidden pattern list (libp2p*, *bittorrent*, *dht*, webtorrent, torch, tensorflow, jax, transformers, matrix-js-sdk, @matrix-org/*, hermes*, cua*, goose, onyx, fainir, openclaw*).
 3. tests/phase5-83-external-reference-policy.test.mjs (import the 5.82 helpers): (a) package.json dependencies+devDependencies exactly equal the npm allowlist; (b) workspace Cargo.toml [dependencies] exactly equal the cargo allowlist; (c) no forbidden pattern appears as a package NAME in package-lock.json or Cargo.lock; (d) CLI rejection probes (live CLI + 5.82 COMMAND_TABLE) for command families: computer-use, hermes, matrix, shell, sqlite, secure-drop, fabric-transport (mirroring 5.60's probe style); (e) import guards: packages/*/src and apps/cli/src contain no import/require of any forbidden pattern (use the 5.82 escapeRegExp helper); (f) every policy entry's owning-phase fixture exists.
 4. docs/external-reference-policy.md: human-readable mirror; states this file + fixture are the CANONICAL location for "do not build here" rules; future session handoffs cite it instead of restating lore; includes the harness-vs-import distinction from CONTEXT.
 5. Standard phase record + report wiring; core create*ForReview helper per pattern (REUSE shared helpers) with rejection cases including: forbidden-dep-present, allowlist-mismatch, policy-entry-missing-owning-phase, reportRunsChecks:true. Set recommendedNextPhase to "phase-5.84-fabric-core-producer-pin".
 6. LANDING IS PR + STOP (Jules gate): push branch, open PR titled "Phase 5.83 — external-reference policy + dependency allowlist", body summarizing the policy families and allowlists. Do not merge.

MUST NOT
- No dependency changes (the allowlist must match what EXISTS — if reality doesn't match, STOP and report; do not "fix" deps), no runtime surfaces, no prior-fixture edits, no merge to main by you, never print/persist the token.

VALIDATION (all must pass locally before the PR)
- Focused 5.83 tests ; npm test ; npm run test:schemas ; npm run report:phase-status
- cargo fmt --check ; cargo check --workspace ; cargo clippy --workspace -- -D warnings ; cargo test --workspace
- git diff --check ; semgrep --config auto . (0) ; npm audit (0) ; cargo audit ; cargo machete

REVIEW & LANDING — JULES GATE
- One read-only reviewer subagent BEFORE pushing. Then push branch → open PR → STOP.
- REPORT BACK: PHASE / BRANCH+SHA / PR URL / FILES CHANGED / VALIDATION / REVIEWER disposition / NOTES. Fable triggers Jules and merges on APPROVE.
```

---

## Outline for the arc after 5.83 (full Hermes prompts on request)

- **5.84 — fabric-core producer pin + gap-index regeneration.** Pin Multiverse fabric-core (commit SHA, package version, security-review record ID, digests); drift-recheck procedure; consumer-phase entry criteria; regenerate the stale 5.47 gap index (fabric rows reviewedAt 2026-06-19, pre-5.75). Fable will fetch and embed the Multiverse pins into the prompt at that time.
- **5.85 — consumer contract export pack.** Real JSON Schemas for ardyn.approval-review-artifact, planner trace, review-trace diff, ardyn.review-status.snapshot, display-fixture entry, conformance-result; contracts/registry.json (owner/status for all ~40 named contracts); wired into test:schemas. Unblocks Locus machine-validation and feeds the Claude Code prototypes.
- **5.86 — flag-normalization envelope.** Frozen RUNTIME_BLOCKED_POSTURE spread into every result; one polarity convention; schemas/review-result-envelope.schema.json; meta-test validating all 208 fixtures.
- **5.87 — docs front door.** Generated docs/PHASE-INDEX.md (from git + manifests); CURRENT-STATE.md ("no other file may claim the current phase"); README slim-down; ONBOARDING/sub-README de-enumeration; fix the stale ARDYN_PHASE constant or stop pinning it. (Diagram assets produced by Claude Code, committed by Hermes.)
- **5.88 — threat model + SECURITY.md.** Adversaries: malicious skill pack, prompt-injected subagent, compromised connector, colluding judge; maps each boundary phase to the threats it mitigates.
- **Later arc (post-5.88): core boundary-map engine + modularization.** classifyBoundaryInput(record, spec) + per-phase frozen spec data (recent blocks ~60% identical; est. 12–18k LOC removable); then split index.mjs behind the frozen public barrel. Also: absent-input rejection ({} must not classify as valid with defaulted reviewedAt) and cycle-guarded shared walkers — behavior changes, own contract slices.

## Standing rules for every prompt (embedded above; restated once)

Metadata-only / review-only / runtime-blocked · small deterministic slices · one read-only reviewer subagent per slice (reuse only on found-and-fixed; labeled self-review if subagents unavailable) · Jules only at marked gates, via PR+STOP · Fallow advisory only · no broad cleanup folded into unrelated phases · security work in dedicated slices · derive SHAs via git, never hand-type · reuse existing helpers before writing new ones; `ponytail:` comments on intentional shortcuts · no force-push/rebase/history rewrites · nothing from C:\AI\hermes-scratch\ ever committed · GITHUB_TOKEN never printed or persisted.

> [!warning] SUPERSEDED 2026-07-06 by [[ARDYN-HERMES-PROMPTS-GLM52-v2]] — PR #4 (authorized fabric federation client) changed the baseline to 6585ddf and added Phase 5.76B reconciliation.
