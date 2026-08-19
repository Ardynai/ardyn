# HERMES PROMPT — Phase 5.77 (paste into a fresh Hermes/GLM 5.2 session)

Status as of 2026-07-06: Phase 5.76B **merged** (squash). New baseline `main` @ `e84bd8752e1d63f830de2f6f4958ffa3b6b3e754`. Federation security audit done by Fable — safe to keep merged (unwired); 4 pre-wiring hardening requirements recorded for a future Phase 5.84, not needed now. 5.77 is NOT Jules-gated.

---

```
You are the Hermes agent (GLM 5.2), implementation orchestrator for Ardynai/ardyn (local: C:\Users\Josh\Documents\ardyn).
Flow: inspect → plan → implement → verify. SCOPE LOCK: the standard 5-artifact boundary-map set (doc + fixture + one create*ForReview core helper + focused test + report wiring). Nothing else.

START-OF-SESSION SYNC
- git fetch origin; git checkout main; git pull --ff-only. Confirm HEAD == local main == origin/main == e84bd8752e1d63f830de2f6f4958ffa3b6b3e754. (This includes Phase 5.76B, which reconciled the posture — see below.) git status --porcelain must be empty; git diff --check must pass. If identity is unset: git config user.name "Ardynai"; git config user.email "admin@multiverseos.net". Abort/report on any mismatch.

POSTURE (post-5.76B — READ CAREFULLY, this differs from older phase docs)
- Ardyn is review-only metadata for every runtime surface, with EXACTLY ONE authorized exception: the Fabric Federation consumer client at packages/fabric/src/federation.mjs (PR #4) — out-of-process, loopback-sidecar + authenticated-registry HTTP client, PRESENT but NOT wired into the CLI or Rust host, consumes-not-rebuilds (no @multiverse/fabric-core import, no DHT/swarm/P2P, no reimplemented transport), never decrypts Secure Drop ciphertext, secrets via env/config/secret only. The canonical current-posture statement is docs/posture.md (added by 5.76B). Everything ELSE stays blocked: serve-runtime, evaluator, approvals, process control, CLI/host runtime, DB/SQLite, shell, Matrix, CUA, Secure Drop crypto, Code Mode, and wiring federation into anything.
- 5.77 opens NO new runtime surface. Do not touch, re-block, wire, or reference-as-blocked the fabric federation client. Its carve-out tokens (fabric-federation-client-present-unwired, loopback-sidecar-only, no-fabric-core-import, no-dht-swarm-p2p, no-secure-drop-decrypt, no-cli-host-wiring) must be carried FORWARD into the 5.77 executionPosture string — do NOT reintroduce blanket "metadata-only / runtime-disabled / no-fabric-transport-sidecar".

CONTEXT — WHAT 5.77 RECORDS
Deterministic review-only metadata for a FUTURE Code Mode: an orchestrated coding workflow (human request → orchestrator plans → spawns own subagents → optional mini-fusion pass → judge/reviewer comparison → orchestrator synthesis → human receives final output; a lightweight front-desk responder answers the user while the orchestrator is busy). No outside agents unless the human explicitly requests. Loop: plan → implement → test → fix → review. Installed toolkit checks selected by relevance, never all-tools-every-time. ALL of it stays blocked until a future authorization phase. Replicate the boundary-map pattern from 5.74/5.75/5.76 exactly. Go DEEPER than 5.68's capability flags: define CONTRACT SHAPES (required fields), not just blocked booleans. Cross-reference, don't duplicate: 5.68 (profile/fusion/front-desk capability boundaries), 5.70 (front-desk busy-state, cancellation, leases), 5.71 (code_mode_governance, toolkit evidence, no polling/no-op subagents), 5.60 (inter-agent handoff provenance), 5.62 (permissions), 5.64 (rate limits as budget vocabulary), 5.65 (audit), 5.72 (credential custody), 4.1C (redaction), 4.1D (transcript persistence), 4.1E (failure/kill semantics), 5.18–5.31 evaluator vocabulary for approval gates, and existing createTaskPlan / schemas/task.schema.json as the plan-contract anchor. Navigate packages/core/src/index.mjs (69k+ lines) with search/offsets — NEVER full reads; study the 5.76 and new 5.76B create*ForReview blocks as templates.

TASK — 12 boundary families in the fixture (standard boundaryId/boundaryFamily/relatedSystem/currentStatus:"blocked"/allowedCurrentBehavior/forbiddenCurrentBehavior/requiredFutureContractBeforeImplementation/requiredFutureAuthorizationPhaseBeforeRuntime shape; all-false authorization/unsafe flags; nonAuthorizingProof: true; reportRunsChecks: false):
 1. orchestrator_plan_contract — plan schema: goal, decomposition, role assignments, per-step budgets, expected artifacts, human-approval checkpoints; plan extends createTaskPlan/task.schema.json; a plan is itself a review artifact.
 2. subagent_spawn_role_contract — roles (planner/implementer/tester/reviewer/judge/front-desk/coordinator, reuse 5.68 profiles); per-role capability manifest MUST be a subset of the orchestrator grant (subagentCapabilitiesSubsetOfParent); spawn-depth cap; per-subagent identity/attribution per docs/harness-identity.md; external agents DEFAULT-DENY, invitable only via explicit human-request flag.
 3. fusion_pass_contract — optional mini-fusion: candidate provenance IDs, deterministic merge requirements, candidateCountCap, output cites contributing candidates.
 4. judge_comparison_contract — judgeContextIsolatedFromProducers; candidate pseudonymization; judge never scores a candidate it produced; structured per-criterion verdict with mandatory evidence field; tie-break + escalate-to-human; judge identity+model recorded.
 5. synthesis_result_contract — final output references contributing artifacts; dissentCarriedForward + overruled objections enumerated; maps onto session-event/session-transcript schemas.
 6. front_desk_contract — busy-scope allowlist/denylist; every answer carries stateSnapshotSequence + staleness disclosure; zero spawn authority, zero approval authority, no commitments about in-flight work; mandatory hand-back event.
 7. toolkit_check_selection_contract — relevance-based selection of installed toolkit checks with recorded rationale ("not every tool every time"); Fallow advisory only, never Fallow Runtime.
 8. loop_semantics_contract — plan→implement→test→fix→review; maxIterationsPerLoop REQUIRED (input without it rejected, like reportRunsChecks:true today); no-progress rule (identical failure signature twice → abort/escalate); loop_budget_exhausted as a first-class terminal classification; per-iteration checkpoint for cancellation (5.70).
 9. failure_abort_contract — abort/partial-result semantics aligned with 4.1E failure-audit/kill semantics.
 10. audit_transcript_contract — every spawn/verdict/fusion/synthesis/hand-back emits session events; redaction per 4.1C; persistence per 4.1D; provenance labels required on all inter-role payloads (cross-ref 5.60).
 11. human_approval_gate_contract — which transitions require human approval (plan release, privilege escalation, external-agent invite, final output), reusing 5.18–5.31 evaluator vocabulary.
 12. code_mode_blocked_runtime_list — no model API calls, no subagent processes, no front-desk responder, no judge/fusion execution, no loop runtime, no toolkit invocation, plus standard backend/DB/Matrix/shell/SQLite blocks, cross-referenced to owning phases. For fabric: reference docs/posture.md's carve-out (fabric federation is the one authorized surface; Code Mode still may not invoke it) — do NOT assert a blanket "no fabric transport".
Budgets (tokens/calls/wall-clock) are required plan fields using 5.64 vocabulary; running-cost events belong to the audit contract; cost exhaustion fails closed returning partials with an explicit exhausted classification.

Focused test (expectedCaseClassifications map style of tests/phase5-76-*.test.mjs) minimum cases: valid canonical fixture; malformed input; unknown top-level field; authorization-flag-enabled; reportRunsChecks:true; hidden-runtime-semantics; blocked-CLI-bypass; missing maxIterationsPerLoop rejected; judge-produces-own-candidate rejected; external-agent-default-allow rejected; front-desk-with-approval-authority rejected.

Report wiring: add 5.77 inventory + safety flags to scripts/report-phase-status.mjs and tests/report-phase-status.test.mjs per pattern; set recommendedNextPhase to "phase-5.78-review-only-ci-enforcement-contract-boundary-map" in fixture, report, and report test.

MUST NOT
- No orchestration runtime, no model calls, no product subagent spawning (your own review subagent for THIS session is fine), no new dependencies, no CI files, no edits to prior phase docs/fixtures beyond standard report/test wiring, no force-push/history rewrite. Do not touch/wire/re-block federation.mjs. Reuse existing shared core helpers (e.g. the cycle-guarded nested-true-claim walker near index.mjs:8163, isPlainObjectRecord, timestamp validators) — do NOT clone new deep-walker/ReviewedAt helpers (the audit found 17 byte-identical clones; add no 18th). Mark intentional shortcuts with `ponytail:` comments.

VALIDATION (all must pass)
- Focused 5.77 tests; adjacent bundle tests/phase5-68*, 5-70*, 5-71*, 5-74*, 5-75*, 5-76*, and 5-76b*; tests/report-phase-status.test.mjs
- npm test ; npm run test:schemas ; npm run report:phase-status (verify 5.77 present, reportRunsChecks:false, executionPosture keeps the fabric carve-out tokens)
- cargo fmt --check ; cargo check --workspace ; cargo clippy --workspace -- -D warnings ; cargo test --workspace
- git diff --check ; semgrep --config auto . (0) ; npm audit (0) ; cargo audit ; cargo machete

REVIEW & LANDING (ungated — normal flow)
- One read-only reviewer subagent (fresh context, no edit tools); reuse only on a concrete found-and-fixed issue; labeled self-review fallback if subagents unavailable. Jules: not required.
- Branch hermes/phase-5-77-code-mode-orchestration-boundary; single commit "Add Phase 5.77 code mode orchestration boundary"; fast-forward main; push branch + main; verify HEAD/main/origin/main + git ls-remote all match; clean worktree.
- REPORT BACK: PHASE / BRANCH+SHA / FILES CHANGED / TESTS before→after / VALIDATION / REVIEWER disposition / REFS / NOTES + confirmed recommendedNextPhase. (Fable will verify and hand you 5.78.)
```

---

## Roadmap update (Fable maintains)

- **5.77** Code Mode boundary map — THIS PROMPT (ungated).
- **5.78** CI enforcement contract (ungated) → **5.79** CI enablement (**JULES GATE**, PR+STOP; includes offline-hermetic guarantee — CI never provides ARDYN_FABRIC_*/FABRIC_TRANSPORT_D_* secrets, never hits a live sidecar).
- **5.80** report-script compaction (byte-identical) → **5.81** report-test compaction.
- **5.82** source-guard hardening (scope any network-absence guard to CLI/host; federation legitimately uses fetch).
- **5.83** external-reference policy + dependency allowlist + federation invariants (**JULES GATE**).
- **NEW 5.84** fabric federation PRE-WIRING hardening requirements (review-only boundary map) — records the 2026-07-06 audit findings as required-before-wiring contracts: HIGH-1 disable redirect-following (redirect:"manual") in requestRaw; HIGH-2 document/close registry-delegated inbound auth (no signature check today); MEDIUM-1 registry-host allowlist/pin for the registry token; MEDIUM-2 confine ARDYN_FABRIC_IDENTITY_FILE read; INFO-3 optional response-size cap. NOT urgent (client is unwired); metadata-only (records requirements, implements nothing). Optionally precede with a tiny hardening micro-slice for HIGH-1 if Josh wants the redirect:"manual" one-liner landed early.
- **5.85** fabric-core producer pin + gap-index regen · **5.86** consumer contract export pack · **5.87** flag-normalization envelope · **5.88** docs front door · **5.89** threat model + SECURITY.md (include federation: loopback trust, token custody, allowlist/registry trust model, SSRF-via-redirect, contentId spoofing).
