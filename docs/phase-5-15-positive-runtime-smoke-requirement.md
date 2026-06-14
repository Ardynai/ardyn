# Phase 5.15 Positive Runtime Smoke Requirement

Phase 5.15 records the boundary that any future live runtime enablement must
include positive guarded runtime smoke coverage before runtime can be enabled.
It does not run runtime smoke coverage, implement runtime smoke execution,
implement runtime shutdown, implement process supervision, read live stdin,
write runtime stdout or stderr, write runtime transcripts or audits, enable
runtime, start runtime, expose runtime execution, add a CLI command, adapter
behavior, Content Fabric runtime behavior, WebSocket behavior, or HTTP runtime
behavior.

Cross-links:

- Root status: `../README.md`
- CLI status: `../apps/cli/README.md`
- Rust host status: `../crates/ardyn-host/README.md`
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

Machine-readable Phase 5.15 artifact path:

`../tests/fixtures/host-policy/phase5-15/positive-runtime-smoke-requirement-contract.json`

Focused guard path:

`../tests/phase5-15-positive-runtime-smoke-requirement.test.mjs`

## Requirement Cases

The Phase 5.15 contract records four positive runtime smoke cases:

- Missing positive runtime smoke coverage is rejected.
- Invalid positive runtime smoke coverage is rejected.
- Non-guarded or non-deterministic runtime smoke coverage is rejected.
- Valid positive runtime smoke coverage is prerequisite-only.

Valid guarded deterministic positive runtime smoke coverage is necessary but
not sufficient. It must not authorize runtime enablement, enable a runtime
command, start runtime, run runtime, expose runtime execution, bypass
rollback/kill-switch boundaries, bypass process-control boundaries, bypass
transcript/audit confinement, bypass stdio safety, bypass host-policy
enforcement, bypass approval evaluator/grant requirements, or bypass any
remaining Phase 5.6 preconditions.

## Runtime Posture

Runtime remains disabled:

- `runtimeEnabled` is `false`.
- `runtimeCommandEnabled` is `false`.
- `runtimeExecutionEnabled` is `false`.
- `positiveRuntimeSmokeCoverageImplemented` is `false`.
- `positiveRuntimeSmokeCoverageActive` is `false`.
- `positiveRuntimeSmokeCoverageEvaluated` is `false`.
- `positiveRuntimeSmokeExecuted` is `false`.
- `positiveRuntimeSmokePassed` is `false`.
- `runtimeSmokeCommandEnabled` is `false`.
- `runtimeExecuted` is `false`.
- `serve-runtime` remains default-blocked.
- `serve-runtime --dry-run` does not bypass the block.

`serve-runtime` and `serve-runtime --dry-run` exit nonzero, write zero stdout,
and emit the deterministic Phase 5.5 runtime-unavailable stderr.

## Forbidden Behavior

Phase 5.15 adds no:

- positive runtime smoke implementation, evaluation, execution, or pass signal
- positive runtime smoke CLI command or command alias
- runtime command exposure
- runtime execution
- live stdin loop
- runtime stdout/stderr writer
- process spawning
- process termination
- runtime supervision
- child-process management
- process signal, poll, wait, or cleanup behavior
- runtime transcript or audit write side effect
- adapter or Content Fabric runtime execution
- WebSocket or HTTP runtime surface
- runtime enablement flag

## Handoff

A later phase still needs separately reviewed positive guarded runtime smoke
implementation, deterministic input fixtures, bounded stdout/stderr
assertions, default-blocked negative controls, positive runtime smoke review,
rollback/kill-switch runtime implementation, process-control runtime
implementation, transcript/audit runtime implementation, stdio safety
implementation, host-policy runtime enforcement, approval evaluator/grant
implementation, remaining Phase 5.6 preconditions, and positive runtime smokes
that are actually run in a guarded environment. Phase 5.15 only records the
positive runtime smoke requirement contract and fail-closed cases.
