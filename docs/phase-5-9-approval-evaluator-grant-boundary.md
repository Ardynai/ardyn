# Phase 5.9 Approval Evaluator/Grant Boundary

Phase 5.9 records the boundary between approval prerequisite records and a
future approval evaluator or runtime approval grant. It does not implement an
approval evaluator, produce an approval grant, enable runtime, expose runtime
execution, add a CLI command, add a stdin loop, add stdout/stderr runtime
writers, add process control, write transcripts or audit files, or add adapter,
Content Fabric, WebSocket, or HTTP runtime behavior.

Cross-links:

- Root status: `../README.md`
- CLI status: `../apps/cli/README.md`
- Rust host status: `../crates/ardyn-host/README.md`
- Runtime command exposure approval:
  `phase-5-8-runtime-command-exposure-approval.md`
- Runtime approval validation: `phase-5-7-runtime-approval-validation.md`
- Runtime enablement preconditions: `phase-5-6-runtime-enable-preconditions.md`
- Default-blocked runtime CLI: `phase-5-5-default-blocked-runtime-cli.md`

Machine-readable Phase 5.9 artifact path:

`../tests/fixtures/host-policy/phase5-9/approval-evaluator-grant-boundary-contract.json`

Focused guard path:

`../tests/phase5-9-approval-evaluator-grant-boundary.test.mjs`

## Boundary Cases

The Phase 5.9 contract records four evaluator/grant boundary cases:

- Valid runtime approval alone remains prerequisite-only.
- Valid command-exposure approval alone remains prerequisite-only.
- Valid runtime approval plus valid command-exposure approval still creates no
  evaluator and no grant.
- A fake grant attempt is rejected because the grant schema and evaluator are
  not implemented.

Approval records and command-exposure approval signals are necessary but not
sufficient. They must not invoke an evaluator, produce or persist a grant,
check grant revocation, authorize runtime enablement, start runtime, expose
runtime execution, or bypass any remaining Phase 5.6 preconditions.

## Runtime Posture

Runtime remains disabled:

- `runtimeEnabled` is `false`.
- `runtimeCommandEnabled` is `false`.
- `runtimeExecutionEnabled` is `false`.
- `approvalEvaluatorImplemented` is `false`.
- `approvalGrantProduced` is `false`.
- `serve-runtime` remains default-blocked.
- `serve-runtime --dry-run` does not bypass the block.

`serve-runtime` and `serve-runtime --dry-run` exit nonzero, write zero stdout,
and emit the deterministic Phase 5.5 runtime-unavailable stderr.

## Forbidden Behavior

Phase 5.9 adds no:

- approval evaluator implementation or invocation
- approval grant production, persistence, or revocation check
- runtime command exposure
- new runtime command or command alias
- live stdin loop
- runtime stdout/stderr writer
- process spawn, kill, signal, poll, wait, or other process control
- transcript or audit runtime write
- adapter or Content Fabric runtime execution
- WebSocket or HTTP runtime surface
- runtime enablement flag

## Handoff

A later phase still needs a separately reviewed approval evaluator design,
grant/revocation semantics, host-policy runtime enforcement, stdio safety
review, transcript/audit confinement, process-control boundaries,
rollback/kill-switch binding, and positive runtime smokes. Phase 5.9 only
records the evaluator/grant boundary contract and fail-closed cases.
