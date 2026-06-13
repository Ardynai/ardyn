# Phase 5.14 Runtime Rollback/Kill-Switch Boundary

Phase 5.14 records the boundary that any future live runtime rollback and
kill-switch path must satisfy before runtime can be enabled. It does not
implement runtime shutdown, runtime rollback, kill-switch activation, process
termination, runtime supervision, runtime I/O, runtime transcript or audit
writes, runtime enablement, runtime start, runtime execution exposure, a CLI
command, a live stdin loop, stdout/stderr runtime writers, adapter behavior,
Content Fabric runtime behavior, WebSocket behavior, or HTTP runtime behavior.

Cross-links:

- Root status: `../README.md`
- CLI status: `../apps/cli/README.md`
- Rust host status: `../crates/ardyn-host/README.md`
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

Machine-readable Phase 5.14 artifact path:

`../tests/fixtures/host-policy/phase5-14/runtime-rollback-kill-switch-boundary-contract.json`

Focused guard path:

`../tests/phase5-14-runtime-rollback-kill-switch-boundary.test.mjs`

## Boundary Cases

The Phase 5.14 contract records four rollback/kill-switch cases:

- Missing rollback/kill-switch boundary is rejected.
- Invalid rollback/kill-switch boundary is rejected.
- Non-deterministic or manual-only rollback is rejected.
- Valid restrictive rollback/kill-switch boundary is prerequisite-only.

Valid restrictive rollback/kill-switch policy is necessary but not sufficient.
It must not authorize runtime enablement, enable a runtime command, start
runtime, expose runtime execution, shut down runtime, roll back runtime, activate
a kill switch, verify rollback through runtime side effects, terminate a
process, bypass process-control boundaries, bypass transcript/audit
confinement, bypass stdio safety, bypass host-policy enforcement, bypass
approval evaluator/grant requirements, or bypass any remaining Phase 5.6
preconditions.

## Runtime Posture

Runtime remains disabled:

- `runtimeEnabled` is `false`.
- `runtimeCommandEnabled` is `false`.
- `runtimeExecutionEnabled` is `false`.
- `rollbackKillSwitchBoundaryImplemented` is `false`.
- `rollbackKillSwitchBoundaryActive` is `false`.
- `rollbackKillSwitchBoundaryEvaluated` is `false`.
- `rollbackCommandEnabled` is `false`.
- `killSwitchCommandEnabled` is `false`.
- `runtimeShutdownEnabled` is `false`.
- `runtimeRollbackPerformed` is `false`.
- `killSwitchActivated` is `false`.
- `rollbackVerificationPerformed` is `false`.
- `processTerminationEnabled` is `false`.
- `serve-runtime` remains default-blocked.
- `serve-runtime --dry-run` does not bypass the block.

`serve-runtime` and `serve-runtime --dry-run` exit nonzero, write zero stdout,
and emit the deterministic Phase 5.5 runtime-unavailable stderr.

## Forbidden Behavior

Phase 5.14 adds no:

- rollback/kill-switch boundary implementation or evaluation
- rollback, kill-switch, shutdown, stop, or runtime-control CLI command
- runtime command exposure
- runtime shutdown
- runtime rollback
- kill-switch activation
- rollback verification runtime side effect
- process spawning
- process termination
- runtime supervision
- child-process management
- process signal, poll, wait, or cleanup behavior
- runtime transcript or audit write side effect
- live stdin loop
- runtime stdout/stderr writer
- adapter or Content Fabric runtime execution
- WebSocket or HTTP runtime surface
- runtime enablement flag

## Handoff

A later phase still needs separately reviewed rollback/kill-switch runtime
implementation, deterministic disable path, bounded kill-switch activation
policy, rollback-state restoration policy, operator-visible status policy,
rollback verification smoke, process-control runtime implementation,
transcript/audit runtime implementation, stdio safety implementation,
host-policy runtime enforcement, approval evaluator/grant implementation,
remaining Phase 5.6 preconditions, and positive runtime smokes. Phase 5.14 only
records the rollback/kill-switch boundary contract and fail-closed cases.
