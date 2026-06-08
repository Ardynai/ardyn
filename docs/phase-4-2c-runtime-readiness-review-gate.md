# Phase 4.2C Runtime Readiness Review Gate

Phase 4.2C is a review gate for the blocked Rust-host stdio runtime skeleton.
It consolidates evidence from Phase 4.1I through Phase 4.2B, prepares a
Jules/Devin review packet, records blocker burn-down fields, and keeps runtime
enablement blocked until a separate future phase explicitly approves and
implements it.

This phase does not add a runtime command, runtime approval grant, approval
evaluator, live stdin loop, live stdout/stderr writer, process control,
transcript write, failure-audit write, adapter behavior, Locus/MCP/OpenClaw or
plugin behavior, WebSocket/HTTP control surface, or Content Fabric runtime
behavior.

## Boundary Summary

| Field | Value |
| --- | --- |
| Phase | 4.2C |
| Scope | Runtime readiness review gate and external-review packet |
| Gate fixture | `tests/fixtures/host-policy/phase4-2c/runtime-readiness-review-gate.json` |
| Focused Node guard | `tests/phase4-2c-runtime-readiness-review-gate.test.mjs` |
| Rust skeleton module | `crates/ardyn-host/src/stdio_runtime/mod.rs` |
| CLI source changed | No |
| Ready for external review | Yes |
| External review complete | No |
| Runtime readiness approved | No |
| Runtime enablement approved | No |
| Runtime enabled | No |
| Runtime blocked | Yes |

## Phase 4.2D Follow-Up

Phase 4.2D records Jules's post-merge review of this packet with verdict
`APPROVE`. That disposition closes the fresh Jules/Devin external-review
blocker for Phase 4.2C only; it does not grant runtime implementation
approval, approve the runtime command surface, change CLI source, or enable
runtime. The Phase 5.1 handoff is documented in
`docs/phase-5-1-controlled-runtime-implementation-approval-handoff.md`. The
Phase 4.2C fixture remains historical evidence for the packet-ready state.

## Evidence Consolidated

Phase 4.2C links the current blocked runtime evidence instead of reclassifying
it as approval:

- Phase 4.1I private Rust-host stdio test harness.
- Phase 4.1J fixture-backed boundary coverage.
- Phase 4.1K approval-gated stdio runtime contract gates.
- Phase 4.1L implementation-readiness matrix and blocker burn-down.
- Phase 4.2A deliberately blocked Rust-host stdio runtime skeleton.
- Phase 4.2B blocked lifecycle, transcript-plan, failure-audit, and
  kill-semantics skeleton.
- Existing dry-run event smoke shape: exit 0, JSONL-only stdout, LF-only,
  final LF, six events, and zero stderr.
- Runtime-like command rejection probes with nonzero exit and zero stdout.

The gate may report `readyForExternalReview: true`, but that status is not a
runtime approval, runtime implementation approval, runtime enablement approval,
external review completion, or permission to add a runtime command.

## Blocker Classes

Must fix before any runtime enablement:

- Fresh Jules or Devin review for the 4.2C packet and the future enablement
  diff.
- Separate runtime implementation approval.
- Separate runtime enablement approval.
- Explicit CLI runtime command surface review.
- Runtime host-policy enforcement design accepted before execution.
- Rollback and kill-switch plan.
- Negative probes proving missing approval and runtime-like commands fail
  closed.

Must fix during the first enablement implementation:

- Bounded stdin loop.
- stdout JSONL writer and stderr diagnostic writer.
- Process lifecycle ownership and timeout cleanup.
- Runtime approval evaluator and host-policy enforcement.
- Transcript persistence writer with path confinement.
- Failure-audit writer with redaction and terminal-state mapping.
- Backpressure, partial-write, malformed-line, duplicate, dropped, and
  out-of-order handling.
- Positive and negative CLI smokes for approved and denied paths.

Must remain guarded after enablement:

- Adapter, Locus, MCP, OpenClaw, plugin, WebSocket/HTTP, and Content Fabric
  runtime behavior.
- Secrets and production signing keys.
- Plugin installation, torrent download, and code-pack enablement.
- Runtime approval grants, which must be time-bound, scope-bound, revocable,
  and auditable.
- File writes outside approved transcript and audit locations.

## Jules/Devin Review Packet

Send this section and the machine-readable fixture to Jules or Devin when a
reviewer is available. Do not mark external review complete unless a real
review of this branch is recorded.

Review questions:

- Does the blocked stdio runtime skeleton accidentally enable runtime
  behavior?
- Does the lifecycle/failure-audit skeleton accidentally add process control,
  transcript writes, or kill behavior?
- Are CLI runtime commands still unavailable?
- Are the readiness gates sufficient before any runtime enablement phase?
- What blockers must be fixed before controlled runtime enablement?

Required review result fields before this can move beyond packet-ready status:

- Reviewer system is Jules or Devin.
- Reviewed branch is `codex/phase-4-2c-runtime-readiness-review-gate`.
- Reviewed commit is recorded.
- Review record path is present.
- Findings disposition is recorded.
- Runtime approval remains false.
- Runtime enabled remains false.

## External-Review Status Rules

Allowed statuses for this phase:

- `not-requested`
- `packet-ready-runtime-still-blocked`
- `requested-awaiting-review`
- `review-recorded-runtime-still-blocked`
- `needs-clarification-runtime-still-blocked`
- `rejected-runtime-still-blocked`

Packet-ready status cannot be inferred as complete. A forged `complete` status
without Jules/Devin identity, branch, commit, review record path, and
non-runtime approval disposition must fail closed in tests.

## Future Enablement Boundary

The next phase should not enable runtime by editing this gate. A future
enablement phase must explicitly name the runtime command surface, host-policy
approval semantics, process lifecycle ownership, transcript and audit write
locations, rollback behavior, and allowlisted source locations that replace the
current no-runtime source guards.

Until that future phase lands, runtime remains blocked by construction.
