# ARDYN — Codex Prompt Queue (lead planner: Fable 5, 2026-07-02)

Baseline: `main` @ `0986ed68c5bde3331b23712b47de57b14c3ae8f2` (Phase 5.76 landed, verified local == origin).
Derived from the 2026-07-02 seven-lane audit (`ardyn-review-2026-07-02.md`).

## How to use

Paste one prompt per fresh Codex session, in order. Each prompt is self-contained. Run the next only after the previous lands and refs verify. 5.76A is a side phase and can run any time (including in parallel with 5.77).

## Order and gates I'm holding

1. **5.76A** (side) — fabric docs contradiction hotfix — run first or in parallel
2. **5.77** — Code Mode orchestration boundary map (chain-pinned next)
3. **5.78** — CI enforcement contract (review-only)
4. **5.79** — CI enablement — **GATE: Jules review required before merge**
5. **5.80** — report-script compaction (byte-identical)
6. **5.81** — report-test compaction + suite performance
7. **5.82** — source-guard hardening + shared test helpers
8. **5.83** — external-reference policy + dependency allowlist — **GATE: Jules review required before merge**

No Claude Code work inside the Ardyn repo (UI/rendering stays blocked). Claude Code runs the parallel prototype lane outside the repo — see `ARDYN-CLAUDE-CODE-BRIEFS.md`. Everything stays metadata-only, review-only, runtime-blocked. 5.79 CI executes the existing validation suite; it is not product runtime and authorizes nothing.

---

## PROMPT 1 — Phase 5.76A (side phase) — Fabric documentation contradiction hotfix + fabric glossary

```
You are Codex, implementation orchestrator for Ardynai/ardyn (local: C:\Users\Josh\Documents\ardyn).
Flow: inspect → plan → implement → verify. Keep the slice small and deterministic.

CONTEXT
- Verify before starting: HEAD == local main == origin/main == 0986ed68c5bde3331b23712b47de57b14c3ae8f2, clean worktree. Abort and report if not.
- Posture: metadata-only, review-only, runtime-blocked. This side phase (5.38A/5.44A pattern) changes documentation/metadata consistency only. It does NOT continue the numbered chain and must NOT change recommendedNextPhase anywhere.
- Problem (from the 2026-07-02 audit): docs/content-fabric.md contradicts the fabric standing rule. Line ~128 lists "BitTorrent infohash verification" under "Remaining Runtime Requirements" and line ~44 area references torrent-client behavior. Standing rule: the content-addressed/chunked/resumable/multi-source transport is COMPLETE in Ardynai/multiverse packages/fabric-core (+ fabric-transport-d loopback sidecar); Ardyn consumes, never rebuilds; BitTorrent/DHT/swarm/P2P deps are permanently banned. Additionally, four "fabric" meanings collide in this repo: (1) legacy "Content Fabric v1.0.0" byte-conformance in packages/fabric + docs/content-fabric.md, (2) the Phase 5.59 cross-repo Fabric coordination envelope, (3) @multiverse/fabric-core transport (producer: Multiverse), (4) the content-fabric repo family that owns canonical Secure Drop.

TASK
1. INSPECT first: rg -n "content-fabric|torrent|infohash|magnet|webseed" across docs/ tests/ scripts/ packages/ to find every reference and every test that pins content-fabric.md prose (check tests/host-policy-preconditions.test.mjs and any phase-1.5/fabric conformance tests). List what is pinned before editing.
2. Amend docs/content-fabric.md:
   - Remove BitTorrent/torrent/seeding items from "Remaining Runtime Requirements". Replace with a supersession note: transport is provided by @multiverse/fabric-core / fabric-transport-d (producer: Ardynai/multiverse); Ardyn is future-consumer-only per Phase 5.75; P2P/BitTorrent/DHT/swarm dependencies are permanently out of scope for Ardyn.
   - Explicitly relabel the existing infohash/magnet/webseed VALIDATION in packages/fabric as "legacy Content Fabric v1.0.0 byte-conformance only — not a transport roadmap".
   - Replace machine-local provenance paths (C:\AI\obsidian-mind\..., C:\AI\locus\...) with repo-relative or repo-name references.
3. Add docs/fabric-glossary.md: one short section per fabric meaning (the four above), each stating what it is, where it lives, its status, and what Ardyn may/may not do with it. Cross-link from content-fabric.md and docs/phase-5-75-*.md is NOT edited (phase docs are pinned evidence) — link only FROM content-fabric.md and the glossary.
4. Do NOT edit any docs/phase-*.md, fixtures, or packages/core. If a test pins the exact prose you must change, update that test minimally and record the pinned-string evidence in your plan. Do not touch the torrentDownloadEnabled safety-flag vocabulary anywhere (those flags assert false and stay).

MUST NOT
- No dependency changes, no code behavior changes, no fixture changes, no recommendedNextPhase changes, no CI files, no runtime surfaces.

VALIDATION (all must pass)
- Focused: any tests touched + tests/host-policy-preconditions.test.mjs
- npm test (expect 1068 passing unless a pinned-prose test legitimately changed count) ; npm run test:schemas ; npm run report:phase-status
- cargo fmt --check ; cargo check --workspace ; cargo clippy --workspace -- -D warnings ; cargo test --workspace
- git diff --check ; semgrep --config auto . (0 findings) ; npm audit (0) ; cargo audit ; cargo machete

REVIEW & LANDING
- Exactly one Codex 5.5 read-only reviewer at the end; reuse the same reviewer only if it finds a concrete issue you then fix. Jules: not required.
- Branch codex/phase-5-76a-fabric-doc-contradiction-hotfix; land as a single commit "Add Phase 5.76A fabric doc contradiction hotfix"; fast-forward main; verify HEAD/main/origin/main/ls-remote all match; clean worktree.
- Report: files changed, pinned strings updated (with before/after), validation results, reviewer disposition.
```

---

## PROMPT 2 — Phase 5.77 — Review-only Code Mode orchestration contract boundary map

```
You are Codex, implementation orchestrator for Ardynai/ardyn (local: C:\Users\Josh\Documents\ardyn).
Flow: inspect → plan → implement → verify.

CONTEXT
- Verify before starting: clean worktree, local main == origin/main. Parent phase: 5.76 (0986ed68...) or 5.76 + side phase 5.76A if it landed first — both are valid parents.
- Posture: metadata-only, review-only, runtime-blocked. Phase 5.77 records deterministic review-only metadata for a FUTURE Code Mode: an orchestrated coding workflow (human request → orchestrator plans → spawns own subagents → optional mini-fusion pass → judge/reviewer comparison → orchestrator synthesis → human receives final output, with a lightweight front-desk responder while the orchestrator is busy). No outside agents unless the human explicitly requests. Loop: plan → implement → test → fix → review. Installed toolkit checks are selected by relevance, never all-tools-every-time. All of it stays blocked until a future authorization phase.
- Follow the established boundary-map pattern exactly (see phase 5.74/5.75/5.76 artifacts): doc + fixture + one create*ForReview core helper + focused test + report wiring. This phase must go DEEPER than Phase 5.68's capability flags: it defines CONTRACT SHAPES (required fields), not just blocked booleans. Anchor points to cross-reference, not duplicate: 5.68 (profile/fusion/front-desk capability boundaries), 5.70 (front-desk busy-state, cancellation, leases), 5.71 (code_mode_governance, toolkit evidence, no polling/no-op subagents), 5.60 (inter-agent handoff provenance), 5.62 (permissions), 5.64 (rate limits as budget vocabulary), 5.65 (audit), 5.72 (credential custody), 4.1C (redaction), 4.1D (transcript persistence), 4.1E (failure/kill semantics), 5.18–5.31 evaluator vocabulary for human approval gates, and the existing createTaskPlan/schemas/task.schema.json as the plan-contract anchor.

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
 12. code_mode_blocked_runtime_list — the standard negative block: no model API calls, no subagent processes, no front-desk responder, no judge/fusion execution, no loop runtime, no toolkit invocation, plus the standard backend/DB/fabric/SecureDrop/Matrix/shell/SQLite blocks, cross-referenced to their owning phases.
Also: budgets (tokens/calls/wall-clock) are required plan fields using 5.64's vocabulary; running-cost events belong to the audit contract; cost exhaustion fails closed returning partials with an explicit exhausted classification.

Test must cover, minimum: valid canonical fixture; malformed input; unknown top-level field; authorization-flag-enabled; reportRunsChecks:true; hidden-runtime-semantics; blocked-CLI-bypass; missing maxIterationsPerLoop rejected; judge-produces-own-candidate flag rejected; external-agent-default-allow rejected; front-desk-with-approval-authority rejected. Follow the expectedCaseClassifications map style of tests/phase5-76-*.test.mjs.

Report wiring: add the 5.77 inventory + safety flags to scripts/report-phase-status.mjs and tests/report-phase-status.test.mjs per the established pattern; set recommendedNextPhase to "phase-5.78-review-only-ci-enforcement-contract-boundary-map" in the fixture, report, and report test.

MUST NOT
- No orchestration runtime, no model calls, no subagent spawning, no new dependencies, no CI files, no edits to prior phase docs/fixtures beyond the standard report/test wiring.
- Do not clone new deep-walker helpers if an equivalent shared helper already exists in packages/core/src/index.mjs (e.g., the cycle-guarded nested-true-claim walker near line 8163); reuse it. Keep the new core block as small as the pattern allows.

VALIDATION (all must pass)
- Focused 5.77 tests; adjacent bundle tests/phase5-68*, 5-70*, 5-71*, 5-74*..5-76*; tests/report-phase-status.test.mjs
- npm test ; npm run test:schemas ; npm run report:phase-status (must show 5.77, reportRunsChecks:false)
- cargo fmt --check ; cargo check --workspace ; cargo clippy --workspace -- -D warnings ; cargo test --workspace
- git diff --check ; semgrep --config auto . (0) ; npm audit (0) ; cargo audit ; cargo machete

REVIEW & LANDING
- Exactly one Codex 5.5 read-only reviewer; reuse only on a concrete found-and-fixed issue. Jules: not required.
- Branch codex/phase-5-77-code-mode-orchestration-boundary; single commit "Add Phase 5.77 code mode orchestration boundary"; fast-forward main; verify refs; clean worktree.
- Report: files changed, test count delta, validation results, reviewer disposition, confirmed recommendedNextPhase.
```

---

## PROMPT 3 — Phase 5.78 — Review-only CI enforcement contract boundary map

```
You are Codex, implementation orchestrator for Ardynai/ardyn (local: C:\Users\Josh\Documents\ardyn).
Flow: inspect → plan → implement → verify.

CONTEXT
- Verify: clean worktree, main == origin/main, parent phase 5.77.
- Posture: metadata-only, review-only, runtime-blocked. Today .github/ contains only copilot-instructions.md; CONTRIBUTING forbids CI workflow changes unless a task explicitly asks; 5.48 area 7 records CI as not asserted; 5.69/5.71 list CI modification as forbidden current behavior. This phase writes the CONTRACT for CI before any workflow file exists — the same contract-then-enable two-step the repo uses everywhere else. Rationale (2026-07-02 audit): every committer is an AI agent; all 1,068 tests and every source-guard tripwire are enforced only by voluntary local runs.
- CI is check-execution over the EXISTING validation suite. It is not product runtime; it authorizes no runtime surface. The contract must say this explicitly.

TASK
Create Phase 5.78 per the standard pattern (doc + fixture + core helper + focused test + report wiring) defining the CI enforcement contract:
 1. ci_workflow_scope — exactly two workflows: ci.yml (push to main + pull_request; concurrency cancel-in-progress) and security.yml (weekly schedule + workflow_dispatch). No other triggers. permissions: contents: read. No secrets. No third-party actions beyond: actions/checkout, actions/setup-node, dtolnay/rust-toolchain, Swatinem/rust-cache (pin exact versions or SHAs in the contract).
 2. ci_job_matrix — ci.yml jobs: node (ubuntu; npm ci; npm test; npm run test:schemas if not already covered; npm run report:phase-status smoke to /dev/null), rust (ubuntu; cargo fmt --check; cargo clippy --workspace --all-targets -- -D warnings; cargo test --workspace), node-windows (windows-latest; npm ci; npm test) — included BECAUSE development happens on Windows and the test-script glob has a known Windows/Node-20 expansion hazard.
 3. security_workflow_scope — security.yml: npm audit --audit-level=high; cargo audit; osv-scanner over both lockfiles. Cron-only, never blocking PRs.
 4. test_invocation_portability — contract requirement: the npm test invocation must run the identical test-file set on ubuntu and windows under the supported Node range; record the current hazard (literal glob on Windows cmd + Node 20) and require the enablement phase to fix it and update the report-test's pinned package.json script strings in the same slice.
 5. ci_forbidden_behavior — CI must never: publish, deploy, write to the repo, mint tokens, use secrets, run semgrep as a gate (semgrep stays a manual evidence command), auto-merge, or execute any blocked runtime surface.
 6. branch_protection_expectation — metadata only: main requires the node + rust checks once enabled (the enablement is a human console action by Josh, recorded as such).
 7. ci_enablement_authorization — the explicit statement that workflow files may be created ONLY by the next phase (5.79) under Josh's explicit authorization, with Jules review required before merge.
Fixture/test/report wiring per pattern; rejection cases must include: ci-with-secrets rejected, ci-with-write-permissions rejected, extra-workflow rejected, semgrep-as-gate rejected, reportRunsChecks:true rejected. Set recommendedNextPhase to "phase-5.79-ci-enablement".

MUST NOT
- Do NOT create or modify any .github/workflows/ files in this phase. No dependency changes. No runtime surfaces.

VALIDATION (all must pass)
- Focused 5.78 tests; tests/report-phase-status.test.mjs; npm test; npm run test:schemas; npm run report:phase-status
- cargo fmt --check ; cargo check --workspace ; cargo clippy --workspace -- -D warnings ; cargo test --workspace
- git diff --check ; semgrep --config auto . (0) ; npm audit (0) ; cargo audit ; cargo machete

REVIEW & LANDING
- One Codex 5.5 read-only reviewer. Jules: not required for the contract slice (required for 5.79).
- Branch codex/phase-5-78-ci-enforcement-contract-boundary; single commit; fast-forward main; verify refs; clean worktree; report back.
```

---

## PROMPT 4 — Phase 5.79 — CI enablement (authorized workflow creation) — JULES GATE

```
You are Codex, implementation orchestrator for Ardynai/ardyn (local: C:\Users\Josh\Documents\ardyn).
Flow: inspect → plan → implement → verify.

AUTHORIZATION
- This prompt IS Josh's explicit authorization to create CI workflow files, exactly and only as specified by the Phase 5.78 contract fixture. CONTRIBUTING's "no CI changes unless the task explicitly asks" is satisfied by this task. Anything not in the 5.78 contract is out of scope.

CONTEXT
- Verify: clean worktree, main == origin/main, parent phase 5.78. Read the 5.78 contract fixture first and treat it as the spec.
- CI executes the existing validation suite; it is not product runtime and authorizes no runtime surface.

TASK
 1. Create .github/workflows/ci.yml and .github/workflows/security.yml exactly per the 5.78 contract (jobs, triggers, permissions: contents: read, pinned action versions, concurrency, no secrets).
 2. Fix test-invocation portability per the 5.78 contract: choose the invocation that provably runs the identical current test-file set on ubuntu and windows across the supported Node range (verify by listing discovered test files on this machine before/after; if you change engines or the script string, update package.json and the pinned script-string assertions in tests/report-phase-status.test.mjs in this same slice, minimally).
 3. Add the Phase 5.79 record per pattern (doc + fixture + focused test + report wiring) documenting: workflows created, contract conformance mapping (each workflow line ↔ contract field), and that branch protection is a pending human console step for Josh. Set recommendedNextPhase to "phase-5.80-report-script-compaction".
 4. Run the full suite locally as CI would (both jobs' command lists) and record results in the phase doc.

MUST NOT
- No steps, triggers, permissions, or actions beyond the 5.78 contract. No secrets. No deploy/publish. No semgrep gate. No auto-merge. No other repo changes.

VALIDATION (all must pass)
- Focused 5.79 tests; tests/report-phase-status.test.mjs; npm test; npm run test:schemas; npm run report:phase-status
- cargo fmt --check ; cargo check --workspace ; cargo clippy --workspace -- -D warnings ; cargo test --workspace
- git diff --check ; semgrep --config auto . (0) ; npm audit (0) ; cargo audit ; cargo machete
- actionlint if available (report if not installed; do not install new global tooling without noting it)

REVIEW & LANDING — JULES GATE
- One Codex 5.5 read-only reviewer first. THEN request Jules review before merge (security-governance change: CI workflow creation). Do not fast-forward main until Jules disposition is APPROVE.
- Branch codex/phase-5-79-ci-enablement; single commit; after Jules approval fast-forward main; verify refs; confirm the first GitHub Actions run goes green on push; report back including the Actions run URL and remind Josh to enable branch protection (require node + rust checks).
```

---

## PROMPT 5 — Phase 5.80 — Report-script compaction (byte-identical, manifest-driven)

```
You are Codex, implementation orchestrator for Ardynai/ardyn (local: C:\Users\Josh\Documents\ardyn).
Flow: inspect → plan → implement → verify.

CONTEXT
- Verify: clean worktree, main == origin/main, parent phase 5.79 (CI green).
- Problem (2026-07-02 audit): scripts/report-phase-status.mjs is 36,393 lines, ~99.9% hand-appended per-phase data (99 sequential top-level readJson calls at lines ~45–357; per-phase SafetyFlags literals; one giant report literal from line ~3091). Output is 5.28MB and growing superlinearly (per-phase sections cross-reference all prior phases); adding a phase means editing the script by hand. This slice makes the report data-driven with BYTE-IDENTICAL output. This is refactor-only; no schema or semantic change; reportRunsChecks stays false; the script keeps fs-only imports (a source-guard test asserts this — keep it passing).

TASK
 1. Golden snapshot: run node scripts/report-phase-status.mjs > /tmp/golden.json (or repo-external path); record sha256.
 2. Mechanically extract each phase's data into scripts/phase-status-manifests/phase-<id>.json (id, name, executionPosture tokens, fixtureReads, inventory block, safetyFlags, verificationCommand) plus an explicit ordered scripts/phase-status-manifests/index.json (array, not readdir — key order and phase order must be preserved exactly for byte-identity).
 3. Replace the script body with a small generic loader (~200 lines): read index.json → for each manifest: existence checks via the existing localStatus helper semantics, inline referenced fixture JSON, merge safetyFlags in manifest order, append verificationCommands → emit the identical report object shape with unchanged schemaVersion "ardyn.phase-status-report.v1" and unchanged header/tail notes.
 4. Verify byte-for-byte: sha256(new output) == sha256(golden). This is the phase's headline claim — record both hashes in the phase doc.
 5. tests/report-phase-status.test.mjs must pass UNTOUCHED except (a) its source-guard list of allowed imports if the loader's imports change (keep fs/path/url only) and (b) nothing else. If anything else fails, your refactor changed behavior — fix the refactor, not the test.
 6. Add the Phase 5.80 record per pattern (doc + fixture + focused test asserting: manifest count == phase count, index order == report order, golden-hash equality procedure documented). Update CONTRIBUTING's "how to add a phase" section: new phases now add one manifest + fixtures; zero script edits. Set recommendedNextPhase to "phase-5.81-report-test-compaction".

MUST NOT
- No output changes (bytes!), no schemaVersion bump, no new deps, no error-handling behavior changes in this slice (per-fixture try/catch → "unreadable" status is EXPLICITLY deferred to a future slice because it changes output), no edits to phase fixtures.

VALIDATION (all must pass)
- Byte-identity hash check (headline) ; focused 5.80 tests ; tests/report-phase-status.test.mjs ; npm test ; npm run test:schemas ; npm run report:phase-status
- cargo fmt --check ; cargo check --workspace ; cargo clippy --workspace -- -D warnings ; cargo test --workspace
- git diff --check ; semgrep --config auto . (0) ; npm audit (0) ; cargo audit ; cargo machete

REVIEW & LANDING
- One Codex 5.5 read-only reviewer (instruct it to independently verify the hash equality). Jules: not required (CI now independently runs the suite).
- Branch codex/phase-5-80-report-script-compaction; single commit; fast-forward main after review + green CI; verify refs; report back with both hashes.
```

---

## PROMPT 6 — Phase 5.81 — Report-test compaction + suite performance

```
You are Codex, implementation orchestrator for Ardynai/ardyn (local: C:\Users\Josh\Documents\ardyn).
Flow: inspect → plan → implement → verify.

CONTEXT
- Verify: clean worktree, main == origin/main, parent phase 5.80.
- Problem: tests/report-phase-status.test.mjs is 33,462 lines with one hardcoded block per phase, calls runReport() fresh in ~114 of 116 tests (each spawning the script and parsing 5.28MB — ~128 renders per full suite), and caps child stdout at maxBuffer: 16MB (line ~8161) while output grows ~200KB/phase — a scheduled outage. The invariant tests (all safety flags false; statuses ∈ {present,missing}; stderr empty; source-guard on script imports; reportRunsChecks/externalCi honesty) are the valuable part and MUST all survive.

TASK
 1. Memoize: one top-level shared render (const reportPromise = runReport()) reused by all tests in the file; keep exactly ONE separate fresh-spawn test that asserts clean process behavior (exit 0, empty stderr) independently.
 2. Convert the per-phase hardcoded blocks into one loop over scripts/phase-status-manifests/index.json (from 5.80): for each manifest assert the report inventory matches the manifest (id, name, fixture statuses present, safety flags all false, verification command present). Net effect: same assertions, derived from the same data source the script uses, so adding a phase no longer edits this test.
 3. Keep (do not weaken): the source-guard test on the script's imports; the reportRunsChecks/externalCi honesty assertions; the exact-string assertions for package.json scripts; the current-phase id/name/executionPosture assertion (now derived from the last index entry).
 4. maxBuffer: raise to 64MB AND add a guard test that fails when report size exceeds 50% of the configured buffer, with a message telling the maintainer to plan compaction — turn the silent future outage into a loud early warning.
 5. Sweep other test files that spawn the report (audit found ~28 files/160 spawns): where a file spawns the report more than once, memoize within that file. Do not restructure unrelated assertions.
 6. Add the Phase 5.81 record per pattern; record before/after full-suite wall-clock time in the phase doc. Set recommendedNextPhase to "phase-5.82-source-guard-hardening".

MUST NOT
- No assertion deletions (only derivation changes), no report script/output changes, no new deps, no fixture edits.

VALIDATION (all must pass)
- Full suite twice (timing evidence) ; focused 5.81 tests ; npm test ; npm run test:schemas ; npm run report:phase-status
- cargo suite as standard ; git diff --check ; semgrep (0) ; npm audit (0) ; cargo audit ; cargo machete

REVIEW & LANDING
- One Codex 5.5 read-only reviewer (instruct: verify no assertion class was dropped — diff the assertion inventory, not just the line count). Jules: not required.
- Branch codex/phase-5-81-report-test-compaction; single commit; fast-forward after review + green CI; report back with timing delta and new test count.
```

---

## PROMPT 7 — Phase 5.82 — Source-guard hardening + shared test helpers

```
You are Codex, implementation orchestrator for Ardynai/ardyn (local: C:\Users\Josh\Documents\ardyn).
Flow: inspect → plan → implement → verify.

CONTEXT
- Verify: clean worktree, main == origin/main, parent phase 5.81.
- Problems (2026-07-02 audit): (a) ~106 test files enforce invariants by regexing SOURCE TEXT (assert.doesNotMatch over file contents), several building new RegExp(command) from UNESCAPED strings (metacharacter hazard; contrast tests/phase4-1c-framing-redaction-contracts.test.mjs:429 which escapes correctly); a comment containing a blocked word can fail the suite, and refactors are locked out. (b) ~71 test files pin baseline git commits and byte-compare files via git show — breaks on shallow clones/mirrors/forks. (c) tests/helpers/ exists and is EMPTY while ~102 files re-define execFileAsync, ~89 assertAllFalse, ~58 readJson, ~15 runReport. This slice hardens the pattern FORWARD without rewriting history.

TASK
 1. Export the CLI command surface as data: from apps/cli/src/index.mjs export a frozen COMMAND_TABLE (command name → handler kind → blocked|allowed) used by the actual dispatcher, so behavior probes replace source greps. Blocked-command tests can then assert (a) table membership and (b) live CLI rejection (they already do (b) — keep it).
 2. Escape hazard fix (mechanical, enumerated): find every new RegExp(<variable>) over source text in tests/; route them through one shared escapeRegExp helper. List every file touched in the phase doc.
 3. Populate tests/helpers/ with: exec.mjs (execFileAsync), asserts.mjs (assertAllFalse + assertStatusesPresent), json.mjs (readJson), report.mjs (memoized runReport). POLICY (add to CONTRIBUTING): new/modified tests MUST import these; existing untouched tests keep their local copies (historical evidence stays byte-stable).
 4. Baseline-commit policy going forward (metadata decision, document in CONTRIBUTING + phase doc): new phases stop adding git-show byte-compare pins; instead each new phase fixture carries a sha256 digest manifest of its own files, asserted from the worktree. Do NOT remove existing pins (historical phases keep their provenance); this only changes the forward pattern.
 5. Add the Phase 5.82 record per pattern (doc + fixture + focused test that: imports the helpers, asserts COMMAND_TABLE matches live CLI behavior for every blocked command, and asserts escapeRegExp is used by the files enumerated). Set recommendedNextPhase to "phase-5.83-external-reference-policy".

MUST NOT
- No CLI behavior changes (the dispatcher must produce byte-identical stdout/stderr/exit codes — verify with the existing CLI tests), no deletion of existing guards, no fixture edits for prior phases, no new deps.

VALIDATION (all must pass)
- Focused 5.82 tests ; full CLI test family ; npm test ; npm run test:schemas ; npm run report:phase-status
- cargo suite standard ; git diff --check ; semgrep (0) ; npm audit (0) ; cargo audit ; cargo machete

REVIEW & LANDING
- One Codex 5.5 read-only reviewer (instruct: confirm COMMAND_TABLE is the real dispatch source, not a parallel list that can drift). Jules: not required.
- Branch codex/phase-5-82-source-guard-hardening; single commit; fast-forward after review + green CI; report back.
```

---

## PROMPT 8 — Phase 5.83 — External-reference policy + dependency allowlist — JULES GATE

```
You are Codex, implementation orchestrator for Ardynai/ardyn (local: C:\Users\Josh\Documents\ardyn).
Flow: inspect → plan → implement → verify.

CONTEXT
- Verify: clean worktree, main == origin/main, parent phase 5.82.
- Problem (2026-07-02 audit): several standing guardrails exist only in prose or session lore. Phase 5.60 (GLOSSOPETRAE) is the gold standard — explicit unsafe-field metadata + test-asserted rejections + CLI keyword probes. Phases 5.68 (Hermes/CUA), 5.73 (Matrix), 5.74 (shell), 5.76 (SQLite) have metadata but NO CLI rejection probes or import guards. Lore-only rules with no committed artifact: no training/GPU deps (torch/tensorflow/jax); Goose/Onyx/fainir never imported; OpenClaw reference-only (adapter-boundaries prose); no P2P/BitTorrent/DHT deps (one negative dep test exists in 5.75; no allowlist); Fallow advisory-only.

TASK
 1. Create tests/fixtures/host-policy/phase5-83/external-reference-policy.json: one entry per reference family — glossopetrae, hermes_agent, cua_computer_use, matrix_hiclaw, codecrafters_shell, codecrafters_sqlite, fabric_core_multiverse, secure_drop_content_fabric, openclaw, goose, onyx, fainir, fallow — each with: source, status (architecture_reference_only | taxonomy_reference_only | future_consumer_pending_contract | external_canonical_owner | advisory_only), unsafe families, allowed usage, forbidden usage, owning phase cross-reference, test coverage pointer.
 2. Dependency allowlist in the same fixture: npm allowlist (exactly: ajv devDependency) and cargo allowlist (exactly: serde, serde_json, sha2); forbidden pattern list (libp2p*, *bittorrent*, *dht*, webtorrent, torch, tensorflow, jax, transformers, matrix-js-sdk, @matrix-org/*, hermes*, cua*, goose, onyx, fainir, openclaw*).
 3. tests/phase5-83-external-reference-policy.test.mjs: (a) package.json dependencies+devDependencies exactly equal the npm allowlist; (b) Cargo.toml [dependencies] across the workspace exactly equal the cargo allowlist; (c) no forbidden pattern appears in package-lock.json or Cargo.lock package names; (d) CLI rejection probes (via the live CLI + 5.82 COMMAND_TABLE) for command families: computer-use, hermes, matrix, shell, sqlite, secure-drop, fabric-transport (mirroring 5.60's probe style); (e) import guards: packages/*/src and apps/cli/src contain no import/require of any forbidden pattern (use the 5.82 escapeRegExp helper); (f) every policy entry's owning-phase fixture exists.
 4. docs/external-reference-policy.md: human-readable mirror, stating this file + fixture are the canonical location for "do not build here" rules and that session handoffs should cite it rather than restate lore.
 5. Standard phase record + report wiring; add the core create*ForReview helper per pattern with rejection cases including: forbidden-dep-present, allowlist-mismatch, policy-entry-missing-owning-phase, reportRunsChecks:true. Set recommendedNextPhase to "phase-5.84-fabric-core-producer-pin".

MUST NOT
- No dependency changes (the allowlist must match what EXISTS — if it doesn't, stop and report, don't "fix" deps), no runtime surfaces, no prior-fixture edits.

VALIDATION (all must pass)
- Focused 5.83 tests ; npm test ; npm run test:schemas ; npm run report:phase-status
- cargo suite standard ; git diff --check ; semgrep (0) ; npm audit (0) ; cargo audit ; cargo machete

REVIEW & LANDING — JULES GATE
- One Codex 5.5 read-only reviewer first; THEN Jules review before merge (security-guardrail codification). Do not fast-forward until Jules disposition is APPROVE.
- Branch codex/phase-5-83-external-reference-policy; single commit; fast-forward after approvals + green CI; report back.
```

---

## Outline for the arc after 5.83 (full prompts on request)

- **5.84 — fabric-core producer pin + gap-index regeneration.** Pin Multiverse fabric-core (commit SHA, package version, security-review record ID, digests) in a fixture; define the drift-recheck procedure and consumer-phase entry criteria; regenerate the 5.47 consumer-contract gap index (fabric rows currently reviewedAt 2026-06-19, pre-5.75). Needs a fresh read of Ardynai/multiverse at prompt time — I'll fetch and embed the pins when we get there.
- **5.85 — consumer contract export pack.** Real JSON Schemas for ardyn.approval-review-artifact, planner trace, review-trace diff, ardyn.review-status.snapshot (small, versioned, distilled from the report), display-fixture entry, conformance-result; contracts/registry.json tracking all ~40 named contracts (owner/status); wire into test:schemas. This is what unblocks Locus consuming anything machine-validatable — and what the Claude Code prototypes will validate against.
- **5.86 — flag-normalization envelope.** Frozen RUNTIME_BLOCKED_POSTURE spread into every result (precedent: ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE ×138); one polarity convention; schemas/review-result-envelope.schema.json; meta-test validating all 208 fixtures against it.
- **5.87 — docs front door.** Generated docs/PHASE-INDEX.md (from git + manifests, never hand-typed); CURRENT-STATE.md with the rule "no other file may claim the current phase"; README slim-down (move the 908-line scope blob to docs/history/); ONBOARDING/sub-README de-enumeration; fix ARDYN_PHASE constant or stop pinning it.
- **5.88 — threat model + SECURITY.md.** Adversaries: malicious skill pack, prompt-injected subagent, compromised connector, colluding judge; maps each existing boundary phase to the threats it mitigates.
- **Later arc (post-5.88): core boundary-map engine + modularization.** classifyBoundaryInput(record, spec) + per-phase frozen spec data (recent blocks are ~60% identical; est. 12–18k LOC removable); then split index.mjs into internal modules behind the frozen public barrel. Only safe after 5.82 (guards) and with CI green. Also fold in: absent-input rejection (empty {} must not classify as valid with defaulted reviewedAt) and cycle-guarded shared walkers — both are behavior changes, so they get their own contract slice.

## Standing rules for every prompt (already embedded above)

Metadata-only / review-only / runtime-blocked; small deterministic slices; one Codex 5.5 read-only reviewer per narrow slice (reuse only on found-and-fixed); Jules only at the marked gates; Fallow advisory only; no broad cleanup folded into unrelated phases; security work in dedicated slices; derive SHAs via git, never hand-type; reuse existing helpers before writing new ones (and mark intentional shortcuts with `ponytail:` comments — the ruleset is currently aspirational, zero instances in repo).

> [!warning] SUPERSEDED 2026-07-02: orchestrator switched to Hermes agent (GLM 5.2). Active queue: [[ARDYN-HERMES-PROMPTS-GLM52-2026-07]]. Nothing from this Codex queue was ever given to Codex.
