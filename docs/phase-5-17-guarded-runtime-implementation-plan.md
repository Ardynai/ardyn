# Phase 5.17 Guarded Runtime Implementation Plan

Phase 5.17 records a narrow implementation plan for future guarded runtime
work after the Phase 5.6 through Phase 5.16 contracts. It does not implement
runtime behavior, runtime enablement, runtime execution, approval evaluation,
approval grants, host-policy runtime enforcement, stdio runtime I/O,
transcript/audit runtime writes, process control, rollback/kill-switch
behavior, positive runtime smoke execution, a CLI command, adapter behavior,
Content Fabric runtime behavior, WebSocket behavior, or HTTP runtime behavior.

Cross-links:

- Root status: `../README.md`
- CLI status: `../apps/cli/README.md`
- Rust host status: `../crates/ardyn-host/README.md`
- Runtime enablement readiness checkpoint:
  `phase-5-16-runtime-enable-readiness-checkpoint.md`
- Positive runtime smoke requirement:
  `phase-5-15-positive-runtime-smoke-requirement.md`
- Runtime rollback/kill-switch boundary:
  `phase-5-14-runtime-rollback-kill-switch-boundary.md`
- Runtime process-control boundary:
  `phase-5-13-runtime-process-control-boundary.md`
- Runtime transcript/audit boundary:
  `phase-5-12-runtime-transcript-audit-boundary.md`
- Runtime stdio safety boundary: `phase-5-11-runtime-stdio-safety-boundary.md`
- Runtime host-policy boundary: `phase-5-10-runtime-host-policy-boundary.md`
- Approval evaluator/grant boundary:
  `phase-5-9-approval-evaluator-grant-boundary.md`
- Runtime command exposure approval:
  `phase-5-8-runtime-command-exposure-approval.md`
- Runtime approval validation: `phase-5-7-runtime-approval-validation.md`
- Runtime enablement preconditions: `phase-5-6-runtime-enable-preconditions.md`
- Default-blocked runtime CLI: `phase-5-5-default-blocked-runtime-cli.md`

Machine-readable Phase 5.17 artifact path:

`../tests/fixtures/host-policy/phase5-17/guarded-runtime-implementation-plan.json`

Focused guard path:

`../tests/phase5-17-guarded-runtime-implementation-plan.test.mjs`

## Planned Sequence

The plan records this still-default-blocked implementation sequence:

- Confirm approval and command-exposure record readers.
- Add a review-only approval evaluator design.
- Add a restrictive host-policy runtime gate.
- Add a bounded stdio runtime gate.
- Add transcript/audit confinement gates.
- Add process-control boundary gates.
- Add rollback/kill-switch gates.
- Add positive runtime smoke fixtures.
- Prepare a still-default-blocked runtime entrypoint slice.

Every planned step is metadata-only in this phase. Each step has
`implementedInThisPhase` set to `false`, cannot enable runtime, cannot start
runtime, and cannot expose runtime execution.

## Runtime Posture

Runtime remains disabled:

- `runtimeEnabled` is `false`.
- `runtimeCommandEnabled` is `false`.
- `runtimeCommandExposureEnabled` is `false`.
- `runtimeExecutionEnabled` is `false`.
- `approvalEvaluatorImplemented` is `false`.
- `approvalGrantProduced` is `false`.
- `hostPolicyRuntimeEnforcementImplemented` is `false`.
- `stdioSafetyImplemented` is `false`.
- `liveStdinLoopEnabled` is `false`.
- `runtimeStdoutWriterEnabled` is `false`.
- `runtimeStderrWriterEnabled` is `false`.
- `transcriptAuditConfinementImplemented` is `false`.
- `processControlBoundaryImplemented` is `false`.
- `rollbackKillSwitchBoundaryImplemented` is `false`.
- `positiveRuntimeSmokeCoverageImplemented` is `false`.
- `serve-runtime` remains default-blocked.
- `serve-runtime --dry-run` does not bypass the block.

`serve-runtime` and `serve-runtime --dry-run` exit nonzero, write zero stdout,
and emit the deterministic Phase 5.5 runtime-unavailable stderr.

## Forbidden Behavior

Phase 5.17 adds no:

- runtime implementation, enablement, or execution
- approval evaluator or approval grant
- runtime command exposure
- host-policy runtime enforcement
- stdio runtime I/O
- live stdin loop
- runtime stdout/stderr writer
- process spawning, termination, or supervision
- rollback/kill-switch runtime behavior
- positive runtime smoke execution
- runtime transcript or audit write side effect
- adapter or Content Fabric runtime execution
- WebSocket or HTTP runtime surface

## Handoff

The recommended next implementation slice is
`phase-5.18-review-only-approval-evaluator-skeleton`: a still default-blocked
slice that can introduce review-only approval evaluator structure without
producing grants, enabling runtime, exposing runtime commands, or starting
runtime. Phase 5.17 itself is only an implementation plan and keeps runtime
blocked.
