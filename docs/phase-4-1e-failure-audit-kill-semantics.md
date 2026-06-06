# Phase 4.1E Failure Audit Kill Semantics

Phase 4.1E is static contract/fixture work only. It defines deterministic
failure-audit records, terminal-state rules, kill/exit cleanup semantics, and
nonzero-exit mapping contracts for later review. No process killing or cleanup
runtime exists, no failure-audit runtime exists, and no live runtime exists.
Future runtime must satisfy these contracts before implementation.

The TypeScript helpers live in `packages/core/src/index.mjs` and expose
`createFailureAuditRecordForReview`,
`classifyFailureAuditRecordForReview`, and
`formatFailureAuditRecordJsonForReview`. These helpers create and classify
deterministic local review artifacts. They do not read files, write files,
read stdin, write stdout, write stderr, own process stdio, send signals, kill
processes, clean up runtime resources, install signal handlers, map a live
process exit, or start a runtime loop.

The deterministic fixture set is under
`tests/fixtures/host-policy/phase4-1e/`:

- `valid-static-failure-audit-record.json`
- `redacted-failure-diagnostic-record.json`
- `unredactable-failure-diagnostic-fail-closed-record.json`
- `expected-nonzero-exit-mapping-record.json`
- `unexpected-nonzero-exit-mapping-record.json`
- `terminal-completed-record.json`
- `terminal-failed-record.json`
- `terminal-aborted-record.json`
- `terminal-rejected-record.json`
- `cleanup-required-policy-only-record.json`
- `cleanup-not-available-record.json`
- `runtime-cleanup-kill-attempt-record.json`
- `malformed-failure-audit-record.json`
- `unsupported-major-failure-audit-record.json`

## Static Failure-Audit Record

The failure-audit record is a static review record with:

- schema and record kind/version
- source phase and reviewed phase
- failure category
- terminal state
- exit code classification and deterministic policy-only exit mapping
- stderr diagnostic classification
- redaction status and redaction metadata
- cleanup requirement metadata
- kill/interrupt/timeout semantics as policy only
- transcript persistence/replay impact as policy only
- runtime availability status
- non-execution invariant summary
- fail-closed reason fields
- deterministic digest and audit metadata

The record never observes a live process, never kills a process, never
performs cleanup, and never persists or replays a transcript. Timestamps in
fixtures are deterministic metadata for review, not evidence that runtime
failure auditing exists.

## Classifications

Phase 4.1E classifies failure-audit review records into:

- `static_contract_only`
- `clean_failure`
- `redacted_failure`
- `unredactable_failure`
- `terminal_completed`
- `terminal_failed`
- `terminal_aborted`
- `terminal_rejected`
- `nonzero_exit_expected`
- `nonzero_exit_unexpected`
- `cleanup_required`
- `cleanup_not_available`
- `runtime_unavailable`
- `malformed`
- `unsupported_major`

`static_contract_only`, `clean_failure`, `redacted_failure`,
`terminal_completed`, `terminal_failed`, `terminal_aborted`,
`terminal_rejected`, `nonzero_exit_expected`, and `cleanup_required` are
review-only classifications. `unredactable_failure`,
`nonzero_exit_unexpected`, `cleanup_not_available`, `runtime_unavailable`,
`malformed`, and `unsupported_major` fail closed. A record that attempts to set
failure-audit runtime, cleanup runtime, process kill, process control, signal
handler, exit handler, stdio writer, file writer, or live host-loop
availability to true is classified as `runtime_unavailable`.

## Terminal And Exit Rules

Terminal-state classification is deterministic policy metadata:

- `terminal_completed` maps to terminal state `completed` and `zero_exit`.
- `terminal_failed` maps to terminal state `failed` and
  `nonzero_exit_expected`.
- `terminal_aborted` maps to terminal state `aborted` and
  `nonzero_exit_expected`.
- `terminal_rejected` maps to terminal state `rejected` and
  `nonzero_exit_expected`.
- missing, duplicate, out-of-order, or non-final terminal event evidence fails
  closed for a future runtime.
- synthesized terminal events are not allowed.
- partial output cannot become transcript evidence.

Nonzero-exit mapping is policy-only and deterministic. Expected nonzero exits
are review classifications. Unexpected nonzero exits fail closed. Phase 4.1E
does not evaluate operating-system signal behavior and does not install a live
exit handler.

## Cleanup And Kill Policy

Cleanup requirement metadata is policy-only. A static record may say a future
runtime would require cleanup, but Phase 4.1E does not provide a cleanup
runtime. Kill, interrupt, timeout, and cleanup uncertainty must fail closed in
a future Rust-host runtime.

Phase 4.1E does not implement process killing, signal handling runtime,
timeout runtime, process control, stdout/stderr ownership, transcript
persistence runtime, replay runtime, approval evaluation, or host-policy
enforcement. The permissive fixture
`runtime-cleanup-kill-attempt-record.json` intentionally sets runtime cleanup
and kill fields to true and must classify as `runtime_unavailable`.

## Non-Runtime Boundary

Phase 4.1E adds no live stdin command loop, live stdio reader, process stdio
ownership implementation, runtime stdout writer, runtime stderr writer,
failure-audit runtime, cleanup runtime, process killing, signal handling
runtime, timeout runtime, transcript persistence runtime, replay runtime,
approval evaluator, listener, server, subprocess runtime path, adapter call,
Locus runtime dependency, MCP/OpenClaw call, plugin execution, Content Fabric
download/install/enable behavior, autonomous loop, secret handling, production
signing-key usage, WebSocket or HTTP control surface, `serve-runtime`,
`stdio-runtime`, `replay-session-transcript`, or actual runtime execution
behavior.

The existing finite `emit-session-events --dry-run` CLI remains unchanged.
Failure-audit, cleanup, kill, process-control, signal-handler, exit-handler,
and runtime command names remain rejected as unknown commands.

## Review Boundary

Phase 4.1F is the static major runtime-readiness checkpoint after this
contract. Devin review remains reserved for the major runtime-readiness
checkpoint, and should happen after Phase 4.1F if Josh requests an external
runtime-readiness review. A later implementation phase must bring Rust-host
stdio ownership, explicit host-policy approval, operator consent,
failure-audit runtime tests, kill/exit/fail-closed tests, cleanup tests, stderr
redaction enforcement tests, transcript persistence/replay tests, backpressure
tests, partial-write tests, and
dropped/duplicate/out-of-order/malformed-line tests before any live runtime
path can exist.

## Cross-Links

Phase 4.1E builds on:

- `docs/phase-4-1-runtime-proposal.md`
- `docs/phase-4-1a-host-policy-approval-records.md`
- `docs/phase-4-1b-transport-harness-contracts.md`
- `docs/phase-4-1c-framing-redaction-contracts.md`
- `docs/phase-4-1d-transcript-replay-contracts.md`
- `docs/phase-4-1f-runtime-readiness-checkpoint.md`
- `docs/phase-4-stdio-dry-run-event-emission.md`
- `docs/session-events-stdio-contract.md`
- `docs/host-policy-preconditions.md`
- `docs/architecture.md`
