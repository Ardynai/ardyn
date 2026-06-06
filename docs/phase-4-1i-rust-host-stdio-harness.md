# Phase 4.1I Rust-Host Stdio Harness

Phase 4.1I records and tests the first Rust-host stdio harness layer as
in-memory test infrastructure. It adds private Rust `#[cfg(test)]` coverage,
docs, and report inventory only. It does not implement live stdio runtime
behavior, does not add a CLI command, does not change process stdio ownership,
and cannot grant runtime approval.

This is not a fresh Devin review. Devin credits are not available for a new
check in this phase, so Phase 4.1I carries forward the Phase 4.1H disposition:
the Phase 4.1G targeted SHA metadata blocker is recorded as fixed, but runtime
implementation remains blocked until a separate approved implementation phase.

## Harness Layer Summary

| Field | Value |
| --- | --- |
| Layer | First Rust-host stdio test harness layer |
| Scope | Static test infrastructure only |
| Runtime enabled | No |
| Fresh Devin review | No |
| Production runtime source changes | No |
| Rust test harness source | `crates/ardyn-host/src/lib.rs` under `#[cfg(test)]` |
| CLI command changes | No |
| Runtime approval grant | No |

Phase 4.1I includes private Rust unit-test helpers that exercise deterministic
in-memory stdin/stdout framing behavior, LF-only output, final LF, JSONL event
framing, stderr isolation, malformed input rejection, early EOF behavior,
oversized/invalid payload rejection, runtime/approval request rejection, and
deterministic failure reporting. Those helpers do not read process stdin, write
process stdout or stderr, spawn processes, open sockets, run a command loop, or
persist transcripts.

## Owned Files

Phase 4.1I owns one Rust source touch for private test infrastructure:

- `crates/ardyn-host/src/lib.rs`

That touch is limited to `#[cfg(test)]` in-memory harness helpers and Rust unit
tests. It is not a production runtime API, does not add a runtime command, and
does not make the Rust host own process stdio.

Phase 4.1I does not own or modify CLI runtime source such as:

- `apps/cli/src/index.mjs`

Any later live Rust-host stdio runtime implementation must be a separate
approved phase with explicit source ownership, tests, and review.

## Runtime Boundary

Phase 4.1I keeps these surfaces blocked:

- `serve-runtime`
- `stdio-runtime`
- `replay-session-transcript`
- `external-review-disposition`
- `review-disposition`
- `external-review-packet`
- `review-packet`
- `runtime-readiness-review`
- approval evaluator and host-policy enforcement runtime
- process stdio ownership, live stdin loop, stdout writer, and stderr writer
- transcript persistence and replay runtime
- failure audit, cleanup, kill, signal, timeout, and fail-closed runtime
- adapter, Locus runtime, MCP/OpenClaw, plugin, and Content Fabric runtime
  integrations
- WebSocket/HTTP control surfaces
- any runtime approval grant or runtime enablement token

The finite TypeScript dry-run emitter remains the only stdio-adjacent command
path. Phase 4.1I does not add runtime commands, does not add a review command,
does not write files from the report, and does not start a live host loop.

## Approval Boundary

Phase 4.1I may record that the repo is ready to plan expansion from private
in-memory harness tests toward an implementation-reviewed Rust-host stdio
runtime harness. It cannot approve runtime implementation, runtime enablement,
runtime commands, process stdio ownership, host-policy enforcement runtime,
adapter calls, Locus runtime dependency, MCP/OpenClaw calls, plugin execution,
Content Fabric download/install/enable behavior, secret handling, production
signing-key usage, or any runtime approval grant.

## Phase 4.1J Follow-Up

Phase 4.1J extends this private harness with fixture-backed stdio boundary
replay tests and a deterministic fixture suite. It does not make the private
`#[cfg(test)]` helpers a public runtime contract, does not add runtime
readiness, and does not record a fresh external review. See
`docs/phase-4-1j-fixture-backed-stdio-boundaries.md`.
