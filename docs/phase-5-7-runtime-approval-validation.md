# Phase 5.7 Runtime Approval Validation

Phase 5.7 records the approval validation/rejection contract that must exist
before any future runtime enablement work can proceed. It does not implement an
approval evaluator, approval grant, live runtime, new CLI command, stdin loop,
stdout/stderr runtime writer, process control, transcript/audit runtime write,
adapter runtime behavior, Content Fabric runtime behavior, or WebSocket/HTTP
runtime surface.

Cross-links:

- Root status: `../README.md`
- CLI status: `../apps/cli/README.md`
- Rust host status: `../crates/ardyn-host/README.md`
- Runtime enablement preconditions: `phase-5-6-runtime-enable-preconditions.md`
- Runtime command exposure approval: `phase-5-8-runtime-command-exposure-approval.md`
- Default-blocked runtime CLI: `phase-5-5-default-blocked-runtime-cli.md`
- Disabled command exposure plan: `phase-5-4-disabled-command-exposure-plan.md`
- Command-surface approval preflight:
  `phase-5-3-command-surface-approval-preflight.md`

Machine-readable Phase 5.7 artifact path:

`../tests/fixtures/host-policy/phase5-7/runtime-approval-validation-contract.json`

Focused guard path:

`../tests/phase5-7-runtime-approval-validation.test.mjs`

## Approval Cases

The Phase 5.7 contract records four future approval validation cases:

- Missing approval is rejected before runtime enablement.
- Invalid approval is rejected before runtime enablement.
- Revoked approval is rejected before runtime enablement.
- Valid approval may be recognized only as a prerequisite signal.

A valid approval record is necessary but not sufficient. It must not start
runtime, enable runtime, expose a runtime command, create an approval grant, or
bypass any remaining Phase 5.6 preconditions.

## Runtime Posture

Runtime remains disabled:

- `runtimeEnabled` is `false`.
- `runtimeCommandEnabled` is `false`.
- `runtimeExecutionEnabled` is `false`.
- `approvalGrantCreated` is `false`.
- `approvalEvaluatorImplemented` is `false`.
- `serve-runtime` remains default-blocked.
- `serve-runtime --dry-run` does not bypass the block.

`serve-runtime` and `serve-runtime --dry-run` exit nonzero, write zero stdout,
and emit the deterministic Phase 5.5 runtime-unavailable stderr.

## Forbidden Behavior

Phase 5.7 adds no:

- live stdin loop
- runtime stdout/stderr writer
- process spawn, kill, signal, poll, wait, or other process control
- transcript or audit runtime write
- adapter or Content Fabric runtime execution
- WebSocket or HTTP runtime surface
- approval grant or evaluator implementation
- runtime enablement flag

## Handoff

A later runtime enablement phase still needs an explicit approval evaluator,
host-policy runtime enforcement, stdio safety review, transcript/audit
confinement, process-control boundaries, rollback/kill-switch behavior, and
positive runtime smokes. Phase 5.8 follows by recording the separate command
exposure approval contract. Phase 5.7 only records the approval validation
contract shape and fail-closed cases.
