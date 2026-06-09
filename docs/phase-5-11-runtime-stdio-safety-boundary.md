# Phase 5.11 Runtime Stdio Safety Boundary

Phase 5.11 records the boundary that any future live runtime stdin, stdout, and
stderr behavior must satisfy before runtime can be enabled. It does not
implement runtime I/O, enable runtime, start runtime, expose runtime execution,
add a CLI command, add a live stdin loop, add stdout/stderr runtime writers, add
process control, write transcripts or audit files, or add adapter, Content
Fabric, WebSocket, or HTTP runtime behavior.

Cross-links:

- Root status: `../README.md`
- CLI status: `../apps/cli/README.md`
- Rust host status: `../crates/ardyn-host/README.md`
- Runtime host-policy boundary: `phase-5-10-runtime-host-policy-boundary.md`
- Approval evaluator/grant boundary:
  `phase-5-9-approval-evaluator-grant-boundary.md`
- Runtime command exposure approval:
  `phase-5-8-runtime-command-exposure-approval.md`
- Runtime approval validation: `phase-5-7-runtime-approval-validation.md`
- Runtime enablement preconditions: `phase-5-6-runtime-enable-preconditions.md`
- Default-blocked runtime CLI: `phase-5-5-default-blocked-runtime-cli.md`
- Runtime transcript/audit boundary:
  `phase-5-12-runtime-transcript-audit-boundary.md`

Machine-readable Phase 5.11 artifact path:

`../tests/fixtures/host-policy/phase5-11/runtime-stdio-safety-boundary-contract.json`

Focused guard path:

`../tests/phase5-11-runtime-stdio-safety-boundary.test.mjs`

## Boundary Cases

The Phase 5.11 contract records four stdio safety cases:

- Missing stdio safety is rejected.
- Invalid stdio safety is rejected.
- Unbounded stdin, stdout, or stderr behavior is rejected.
- Valid restrictive stdio safety is prerequisite-only.

Valid restrictive stdio safety is necessary but not sufficient. It must not
authorize runtime enablement, enable a runtime command, start runtime, expose
runtime execution, bypass host-policy enforcement, bypass approval
evaluator/grant requirements, or bypass any remaining Phase 5.6 preconditions.

## Runtime Posture

Runtime remains disabled:

- `runtimeEnabled` is `false`.
- `runtimeCommandEnabled` is `false`.
- `runtimeExecutionEnabled` is `false`.
- `stdioSafetyImplemented` is `false`.
- `stdioSafetyActive` is `false`.
- `liveStdinLoopEnabled` is `false`.
- `runtimeStdoutWriterEnabled` is `false`.
- `runtimeStderrWriterEnabled` is `false`.
- `serve-runtime` remains default-blocked.
- `serve-runtime --dry-run` does not bypass the block.

`serve-runtime` and `serve-runtime --dry-run` exit nonzero, write zero stdout,
and emit the deterministic Phase 5.5 runtime-unavailable stderr.

## Forbidden Behavior

Phase 5.11 adds no:

- runtime stdio safety implementation or evaluation
- stdio safety CLI command or command alias
- runtime command exposure
- live stdin loop
- runtime stdout writer
- runtime stderr writer
- process spawn, kill, signal, poll, wait, or other process control
- transcript or audit runtime write
- adapter or Content Fabric runtime execution
- WebSocket or HTTP runtime surface
- runtime enablement flag

## Handoff

A later phase still needs separately reviewed stdio runtime implementation,
bounded stdin read policy, stdout/stderr framing and flushing policy, stderr
redaction policy, backpressure and partial-write handling, host-policy runtime
enforcement, approval evaluator/grant implementation, remaining Phase 5.6
preconditions, rollback/kill-switch binding, and positive runtime smokes. Phase
5.11 only records the stdio safety boundary contract and fail-closed cases.
Phase 5.12 follows by recording runtime transcript/audit confinement as a
separate prerequisite-only boundary.
