# Phase 4.1J Fixture-Backed Stdio Boundaries

Phase 4.1J adds fixture-backed Rust-host stdio boundary coverage to the
private Phase 4.1I harness and makes the no-runtime invariants explicit in
fixtures, Rust tests, docs, the local phase-status report, and report tests.

This is not runtime readiness. It is not a fresh external review or a fresh
Devin re-review. It does not turn the private Rust `#[cfg(test)]` harness into a
public runtime contract. It does not add or approve a live stdio runtime, a CLI
command, process stdio ownership, host-policy enforcement, approval evaluation,
or runtime approval grant.

## Boundary Summary

| Field | Value |
| --- | --- |
| Phase | 4.1J |
| Scope | Private fixture-backed Rust test infrastructure |
| Fixture suite | `tests/fixtures/stdio-harness/phase4-1j/expected-outcomes.json` |
| Rust replay tests | `crates/ardyn-host/src/lib.rs` under `#[cfg(test)]` |
| Runtime readiness | No |
| Fresh external review | No |
| Fresh Devin review | No |
| Public runtime contract | No |
| Runtime enabled | No |
| Runtime approval grant | No |

The Phase 4.1J fixture-backed harness coverage is private and in-memory. It
covers deterministic LF-only JSONL framing, final-LF behavior, stdout/stderr
separation, deterministic event ordering, malformed JSON rejection, non-object
JSON rejection, missing required fields, invalid event kinds, invalid UTF-8
rejection, CRLF rejection, missing-final-LF rejection, empty input, partial
frame early EOF, oversized payload rejection, oversized input rejection,
runtime request rejection, and approval request rejection.

That evidence is useful for future implementation review, but it is still only
private test infrastructure. It is not a process stdio owner, not a live host
loop, not an approval evaluator, not host-policy enforcement, and not a public
contract for external callers.

## No-Runtime Invariants

Phase 4.1J keeps these surfaces blocked:

- `serve-runtime`
- `stdio-runtime`
- `replay-session-transcript`
- `runtime-readiness`
- `runtime-readiness-checkpoint`
- `runtime-readiness-review`
- `rust-host-stdio-harness`
- `stdio-harness`
- `runtime-harness`
- `fixture-backed-stdio-boundary`
- `stdio-boundary`
- `public-runtime-contract`
- `approve-runtime`
- `grant-runtime`
- `enable-runtime`
- approval evaluator and host-policy enforcement runtime
- process stdio ownership, live stdin loop, stdout writer, and stderr writer
- transcript persistence and replay runtime
- failure audit, cleanup, kill, signal, timeout, and fail-closed runtime
- adapter, Locus runtime, MCP/OpenClaw, plugin, and Content Fabric runtime
  integrations
- WebSocket/HTTP control surfaces
- any runtime approval grant or runtime enablement token

`npm run report:phase-status` may list this document, the fixture suite, and
the private Rust replay coverage, but the report remains local-summary-only. It does
not run checks, write files, spawn processes, call network APIs, start live
stdio, query external CI, or imply runtime readiness.

## Relationship To Phase 4.1I

Phase 4.1I added private Rust `#[cfg(test)]` in-memory harness coverage. Phase
4.1J extends that private test harness with deterministic fixture replay and
adds a static fixture suite for future runtime implementation review. It does
not touch production runtime source, does not add public Rust APIs, and pins
the status report so runtime-like command names remain rejected.

Future live Rust-host stdio runtime work still requires a separate approved
implementation phase with explicit source ownership, tests, and review. That
future phase must define the public runtime contract separately; Phase 4.1J
does not.

Phase 4.1K follows this fixture-backed layer by recording approval-gated
public Rust-host stdio runtime contract gates. That follow-up is still
contract metadata only: runtime implementation approval, runtime enablement,
process stdio ownership, CLI source changes, fresh external review, fresh
Devin review, and runtime approval grants remain blocked. See
`docs/phase-4-1k-stdio-runtime-contract-gates.md`.

## Review Note

Phase 4.1J covers fixture replay for valid JSONL streams, LF-only framing,
final-LF handling, stdout/stderr isolation, deterministic ordering, malformed
and invalid payload rejection, invalid UTF-8, early EOF, empty input, oversized
payloads, oversized streams, and runtime/approval request rejection. The covered
surface remains private Rust `#[cfg(test)]` infrastructure only; runtime command
enablement, live stdio ownership, approval grants, adapters, process control,
network control surfaces, and Content Fabric runtime execution remain blocked.
