# Phase 5.13 Runtime Process-Control Boundary

Phase 5.13 records the boundary that any future live runtime process control
must satisfy before runtime can be enabled. It does not implement process
spawning, process termination, runtime supervision, runtime I/O, runtime
transcript or audit writes, runtime enablement, runtime start, runtime
execution exposure, a CLI command, a live stdin loop, stdout/stderr runtime
writers, adapter behavior, Content Fabric runtime behavior, WebSocket behavior,
or HTTP runtime behavior.

Cross-links:

- Root status: `../README.md`
- CLI status: `../apps/cli/README.md`
- Rust host status: `../crates/ardyn-host/README.md`
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

Machine-readable Phase 5.13 artifact path:

`../tests/fixtures/host-policy/phase5-13/runtime-process-control-boundary-contract.json`

Focused guard path:

`../tests/phase5-13-runtime-process-control-boundary.test.mjs`

## Boundary Cases

The Phase 5.13 contract records four process-control cases:

- Missing process-control boundary is rejected.
- Invalid process-control boundary is rejected.
- Unbounded process spawning, termination, or supervision is rejected.
- Valid restrictive process-control boundary is prerequisite-only.

Valid restrictive process control is necessary but not sufficient. It must not
authorize runtime enablement, enable a runtime command, start runtime, expose
runtime execution, spawn a process, terminate a process, supervise a runtime
process, manage a child process, signal a process, wait on a process, bypass
transcript/audit confinement, bypass stdio safety, bypass host-policy
enforcement, bypass approval evaluator/grant requirements, or bypass any
remaining Phase 5.6 preconditions.

## Runtime Posture

Runtime remains disabled:

- `runtimeEnabled` is `false`.
- `runtimeCommandEnabled` is `false`.
- `runtimeExecutionEnabled` is `false`.
- `processControlBoundaryImplemented` is `false`.
- `processControlBoundaryActive` is `false`.
- `processSpawnEnabled` is `false`.
- `processTerminationEnabled` is `false`.
- `runtimeSupervisionEnabled` is `false`.
- `childProcessManaged` is `false`.
- `processSignalSent` is `false`.
- `processWaitPerformed` is `false`.
- `serve-runtime` remains default-blocked.
- `serve-runtime --dry-run` does not bypass the block.

`serve-runtime` and `serve-runtime --dry-run` exit nonzero, write zero stdout,
and emit the deterministic Phase 5.5 runtime-unavailable stderr.

## Forbidden Behavior

Phase 5.13 adds no:

- process-control boundary implementation or evaluation
- process-control CLI command or command alias
- runtime command exposure
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

A later phase still needs separately reviewed process-control runtime
implementation, bounded command/argv/env/cwd policy, child-process identity and
ownership, timeout/resource limits, signal and cleanup semantics, deterministic
process-failure classification, transcript/audit runtime implementation, stdio
safety implementation, host-policy runtime enforcement, approval
evaluator/grant implementation, remaining Phase 5.6 preconditions,
rollback/kill-switch binding, and positive runtime smokes. Phase 5.13 only
records the process-control boundary contract and fail-closed cases.
