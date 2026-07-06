# Phase 5.77 — Review-only Code Mode orchestration contract boundary map

**Date:** 2026-07-06
**Status:** review-only, metadata-only, non-authorizing, runtime-blocked
**Preceding phase:** Phase 5.76 (embedded DB/query-engine primitive contract boundary map)
**Side phase 5.76B:** Fabric Federation reconciliation (consumer client present, unwired — carve-out recorded in `docs/posture.md`)
**Recommended next phase:** `phase-5.78-review-only-ci-enforcement-contract-boundary-map`

## What this phase records

Deterministic review-only metadata for a **future** Code Mode: an orchestrated
coding workflow in which a human request is received by an orchestrator that
plans, spawns its own subagents, optionally runs a mini-fusion pass, invokes a
judge/reviewer comparison, synthesizes results, and returns the final output to
the human. A lightweight front-desk responder answers the user while the
orchestrator is busy. No outside agents participate unless the human explicitly
requests them.

The workflow loop is: **plan → implement → test → fix → review**. Installed
toolkit checks are selected by relevance — never all-tools-every-time.

**All of this stays blocked** until a future authorization phase. This phase
adds **no runtime surface**, opens **no model API calls**, spawns **no product
subagents**, and introduces **no new dependencies**.

## Boundary families (12)

1. **orchestrator_plan_contract** — plan schema with goal, decomposition, role
   assignments, per-step budgets, expected artifacts, and human-approval
   checkpoints. A plan extends `createTaskPlan` / `schemas/task.schema.json` and
   is itself a review artifact.
2. **subagent_spawn_role_contract** — roles (planner, implementer, tester,
   reviewer, judge, front-desk, coordinator) reusing Phase 5.68 profiles.
   Per-role capability manifest MUST be a subset of the orchestrator grant
   (`subagentCapabilitiesSubsetOfParent`). Spawn-depth cap. Per-subagent
   identity/attribution per `docs/harness-identity.md`. External agents are
   default-deny, invitable only via an explicit human-request flag.
3. **fusion_pass_contract** — optional mini-fusion: candidate provenance IDs,
   deterministic merge requirements, `candidateCountCap`, output cites
   contributing candidates.
4. **judge_comparison_contract** — judge context isolated from producers;
   candidate pseudonymization; judge never scores a candidate it produced;
   structured per-criterion verdict with mandatory evidence field; tie-break +
   escalate-to-human; judge identity + model recorded.
5. **synthesis_result_contract** — final output references contributing
   artifacts; `dissentCarriedForward` + overruled objections enumerated; maps
   onto session-event / session-transcript schemas.
6. **front_desk_contract** — busy-scope allowlist/denylist; every answer carries
   `stateSnapshotSequence` + staleness disclosure; zero spawn authority, zero
   approval authority, no commitments about in-flight work; mandatory hand-back
   event.
7. **toolkit_check_selection_contract** — relevance-based selection of installed
   toolkit checks with recorded rationale ("not every tool every time"). Fallow
   advisory only, never Fallow Runtime.
8. **loop_semantics_contract** — plan→implement→test→fix→review;
   `maxIterationsPerLoop` REQUIRED (input without it is rejected, like
   `reportRunsChecks:true` today); no-progress rule (identical failure signature
   twice → abort/escalate); `loop_budget_exhausted` as a first-class terminal
   classification; per-iteration checkpoint for cancellation (cross-ref 5.70).
9. **failure_abort_contract** — abort/partial-result semantics aligned with 4.1E
   failure-audit/kill semantics.
10. **audit_transcript_contract** — every spawn/verdict/fusion/synthesis/hand-back
    emits session events; redaction per 4.1C; persistence per 4.1D; provenance
    labels required on all inter-role payloads (cross-ref 5.60).
11. **human_approval_gate_contract** — which transitions require human approval
    (plan release, privilege escalation, external-agent invite, final output),
    reusing 5.18–5.31 evaluator vocabulary.
12. **code_mode_blocked_runtime_list** — no model API calls, no subagent
    processes, no front-desk responder, no judge/fusion execution, no loop
    runtime, no toolkit invocation, plus standard backend/DB/Matrix/shell/SQLite
    blocks, cross-referenced to owning phases. For fabric: references
    `docs/posture.md`'s carve-out (fabric federation is the one authorized
    surface; Code Mode still may not invoke it) — does NOT assert a blanket "no
    fabric transport".

## Contract shapes (deeper than 5.68 capability flags)

Where Phase 5.68 recorded capability-level booleans ("front_desk_ready: false"),
this phase defines **required contract fields** for each surface — the shape a
future implementation must conform to before authorization. Examples:

- Plan contract requires: `goal`, `decomposition[]`, `roleAssignments[]`,
  `perStepBudgets[]`, `expectedArtifacts[]`, `humanApprovalCheckpoints[]`.
- Subagent spawn contract requires: `role`, `capabilityManifest` (subset of
  parent grant), `spawnDepth`, `identityLabel`, `attributionRecord`.
- Loop contract requires: `maxIterationsPerLoop` (MUST be present — its absence
  is a rejection-class, not a default).
- Judge contract requires: `candidateProvenanceIds[]`, `pseudonymizationEnabled`,
  `perCriterionVerdicts[]` (each with mandatory `evidence` field),
  `judgeIdentity`, `judgeModel`.

## Budget vocabulary

Budgets (tokens, calls, wall-clock) are required plan fields using Phase 5.64
rate-limit / budget vocabulary. Running-cost events belong to the audit contract
(family 10). Cost exhaustion fails closed, returning partials with an explicit
`loop_budget_exhausted` classification.

## Cross-references (not duplicated)

| Phase | Relationship |
|---|---|
| 5.68 | Profile / fusion / front-desk capability boundaries (this phase deepens to contract shapes) |
| 5.70 | Front-desk busy-state, cancellation, leases |
| 5.71 | Code-mode governance, toolkit evidence, no polling / no-op subagents |
| 5.60 | Inter-agent handoff provenance |
| 5.62 | Permissions |
| 5.64 | Rate limits as budget vocabulary |
| 5.65 | Audit |
| 5.72 | Credential custody |
| 4.1C | Redaction |
| 4.1D | Transcript persistence |
| 4.1E | Failure / kill semantics |
| 5.18–5.31 | Evaluator vocabulary for approval gates |
| `createTaskPlan` / `schemas/task.schema.json` | Plan-contract anchor |
| `docs/posture.md` | Fabric federation carve-out (Code Mode may not invoke it) |

## Posture

This phase is **metadata-only, review-only, non-authorizing, runtime-blocked**.
`reportRunsChecks` is `false`. The Fabric Federation consumer client carve-out
from `docs/posture.md` is carried forward — Code Mode may not invoke the
federation client, and this phase does not re-block or re-authorize it.

## Artifacts

- Fixture: `tests/fixtures/host-policy/phase5-77/code-mode-orchestration.json`
- Core helper: `createCodeModeOrchestrationForReview` in `packages/core/src/index.mjs`
- Focused test: `tests/phase5-77-code-mode-orchestration.test.mjs`
- Report wiring: `scripts/report-phase-status.mjs` + `tests/report-phase-status.test.mjs`