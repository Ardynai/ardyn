# Phase 5.8 Runtime Command Exposure Approval

Phase 5.8 records the command-exposure approval contract that must exist before
any future runtime command can move beyond default-blocked recognition. It does
not implement command exposure, an approval evaluator, approval grant, live
runtime, new CLI command, stdin loop, stdout/stderr runtime writer, process
control, transcript/audit runtime write, adapter runtime behavior, Content
Fabric runtime behavior, or WebSocket/HTTP runtime surface.

Cross-links:

- Root status: `../README.md`
- CLI status: `../apps/cli/README.md`
- Rust host status: `../crates/ardyn-host/README.md`
- Runtime approval validation: `phase-5-7-runtime-approval-validation.md`
- Runtime enablement preconditions: `phase-5-6-runtime-enable-preconditions.md`
- Default-blocked runtime CLI: `phase-5-5-default-blocked-runtime-cli.md`
- Disabled command exposure plan: `phase-5-4-disabled-command-exposure-plan.md`
- Command-surface approval preflight:
  `phase-5-3-command-surface-approval-preflight.md`

Machine-readable Phase 5.8 artifact path:

`../tests/fixtures/command-surface/phase5-8/runtime-command-exposure-approval-contract.json`

Focused guard path:

`../tests/phase5-8-runtime-command-exposure-approval.test.mjs`

## Approval Cases

The Phase 5.8 contract records four future command-exposure approval cases:

- Missing command-exposure approval is rejected before runtime command exposure.
- Invalid command-exposure approval is rejected before runtime command exposure.
- Revoked command-exposure approval is rejected before runtime command exposure.
- Valid command-exposure approval may be recognized only as a prerequisite
  signal.

A valid command-exposure approval record is necessary but not sufficient. It
must not start runtime, enable runtime, expose runtime execution, create
additional command aliases, create an approval grant, or bypass any remaining
Phase 5.6 runtime enablement preconditions.

## Recognition Versus Exposure

`serve-runtime` is already recognized by the CLI from Phase 5.5, but recognition
is not runtime execution exposure. In Phase 5.8:

- `runtimeEnabled` is `false`.
- `runtimeCommandEnabled` is `false`.
- `runtimeExecutionEnabled` is `false`.
- `validCommandExposureApprovalExposesRuntimeExecution` is `false`.
- `validCommandExposureApprovalExposesUserRuntimeCommand` is `false`.
- `recognizedRuntimeCommandDefaultBlocked` is `true`.
- No additional runtime command is recognized or exposed.

`serve-runtime` and `serve-runtime --dry-run` exit nonzero, write zero stdout,
and emit the deterministic Phase 5.5 runtime-unavailable stderr.

## Forbidden Behavior

Phase 5.8 adds no:

- runtime command exposure
- new runtime command or command alias
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
positive runtime smokes. Phase 5.8 only records the command-exposure approval
contract shape and fail-closed cases.
