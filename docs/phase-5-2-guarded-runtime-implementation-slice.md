# Phase 5.2 Guarded Runtime Implementation Slice

Phase 5.2 is the guarded runtime implementation slice after Phase 5.1 recorded
approval to proceed with a separate controlled implementation phase. It adds
private Rust-host guarded planning helpers and deterministic fixture-backed
tests only. It does not add a CLI runtime command, runtime command-surface
enablement, approval grant, approval evaluator, or runtime enablement
approval.

Cross-links:

- Root status: `../README.md`
- CLI status: `../apps/cli/README.md`
- TypeScript core status: `../packages/core/README.md`
- Rust host status: `../crates/ardyn-host/README.md`
- Approval source: `phase-5-1-controlled-runtime-implementation-approval-handoff.md`
- Current command preflight: `phase-5-3-command-surface-approval-preflight.md`
- Current disabled command exposure plan: `phase-5-4-disabled-command-exposure-plan.md`
- Current Jules review disposition: `phase-5-4a-jules-review-disposition.md`
- External-review source: `phase-4-2d-external-review-disposition-phase5-handoff.md`
- Readiness source: `phase-4-2c-runtime-readiness-review-gate.md`

## Scope

Phase 5.2 describes and inventories the first guarded implementation slice for
the private Rust-host stdio runtime path. The implementation remains inside
`crates/ardyn-host/src/stdio_runtime/mod.rs`, which is still a private module
registered as `mod stdio_runtime;` with no public re-export from
`crates/ardyn-host/src/lib.rs`.

Allowed work in this lane:

- record Phase 5.2 as the current local status-report phase
- add private Rust helpers for bounded in-memory loop planning
- add private Rust helpers for planned-only redacted writer data
- add private Rust helpers for fixture-only approval-boundary planning
- add deterministic fixtures and tests proving runtime remains blocked
- cross-link Phase 5.2 from the root, CLI, TypeScript core, Rust host, Phase
  5.1, and relevant Phase 4 documents
- keep `apps/cli/src/index.mjs` unchanged
- keep runtime-like command names rejected until a later command-surface phase
  explicitly changes that behavior
- keep adapter, Locus, MCP, OpenClaw, plugin, WebSocket/HTTP, and Content
  Fabric runtime behavior blocked

Machine-readable Phase 5.2 artifacts:

- Boundary fixture:
  `../tests/fixtures/host-policy/phase5-2/guarded-runtime-default-blocked-boundary.json`
- Candidate command rejection matrix:
  `../tests/fixtures/command-surface/phase5-2/runtime-command-rejection-matrix.json`
- Focused Node guard:
  `../tests/phase5-2-runtime-default-blocked.test.mjs`
- Private Rust helper tests:
  `../crates/ardyn-host/src/stdio_runtime/mod.rs`

## Guarded Runtime Boundary

Phase 5.2 does not grant runtime enablement. The following remain false in the
status report:

- runtime command enabled
- runtime command surface enabled
- runtime enablement approved
- approval command enabled
- CLI source changed
- stdout/stderr writers enabled
- process control enabled
- transcript/audit side effects enabled
- adapter/Fabric runtime behavior enabled

If implementation code exists in this phase, it must stay behind existing
private Rust-host guards and must not become a public runtime command or live
runtime surface through this docs/status lane.

## Required Before Runtime Enablement

Before any live runtime can be enabled, a later phase must still provide:

- explicit runtime command-surface approval
- host-policy enforcement for approved and denied runtime paths
- rollback and kill-switch review
- bounded stdin loop behavior
- redacted stdout JSONL writer and stderr diagnostic writer behavior
- transcript and failure-audit path confinement
- positive and negative runtime smokes for approved and denied paths

## Still Blocked

These command-like names must continue to reject with nonzero exit and zero
stdout until a later approved command-surface phase changes them:

- `serve-runtime`
- `stdio-runtime`
- `phase-5-2-guarded-runtime`
- `guarded-runtime-implementation`
- `runtime-start`
- `runtime-stop`
- `runtime-status`
- `runtime-rollback`
- `runtime-failure-audit`
- `approve-runtime`
- `grant-runtime`
- `enable-runtime`

Phase 5.3 follows this slice as command-surface approval preflight docs/status
metadata only. It still does not expose runtime commands, change
`apps/cli/src/index.mjs`, grant approval, or enable runtime. See
`phase-5-3-command-surface-approval-preflight.md`.

Phase 5.4 follows as a disabled command exposure plan with a future CLI
checklist, Jules/Devin packet, rollback plan, and diff-risk notes only. It
still does not expose runtime commands, change `apps/cli/src/index.mjs`, grant
approval, or enable runtime. See
`phase-5-4-disabled-command-exposure-plan.md`.

Phase 5.2 remains local report/docs status for a guarded implementation slice;
runtime enablement remains blocked.
