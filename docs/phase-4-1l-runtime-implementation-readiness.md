# Phase 4.1L Runtime Implementation Readiness

Phase 4.1L records the approval-reviewed implementation-readiness design,
test plan, blocker burn-down, and Phase 4.2A handoff for the first deliberately
blocked Rust-host stdio runtime skeleton.

This is readiness inventory only and non-executing. It does not approve or
enable runtime implementation, does not add process stdio ownership, does not
add a CLI command, does not change `apps/cli/src/index.mjs`, does not add a
live stdin loop, does not add stdout or stderr runtime writers, does not add
approval evaluation, does not enforce host policy at runtime, and does not
grant runtime approval. It is not a fresh Devin or external re-review.

4.2A skeleton entry may be ready while runtime enablement remains blocked.

## Boundary Summary

| Field | Value |
| --- | --- |
| Phase | 4.1L |
| Scope | Runtime implementation-readiness design, blocker burn-down, and 4.2A handoff |
| Readiness fixture | `tests/fixtures/host-policy/phase4-1l/runtime-implementation-readiness.json` |
| Focused test inventory | `tests/phase4-1l-runtime-implementation-readiness.test.mjs` |
| Rust design-facing checks | `crates/ardyn-host/src/lib.rs` `#[cfg(test)]` only |
| CLI source inventory | `apps/cli/src/index.mjs` |
| CLI source changed | No |
| Runtime implementation approved | No |
| Runtime enablement approved | No |
| Runtime enabled | No |
| Process stdio ownership | No |
| Live stdin loop | No |
| Live stdout/stderr writer | No |
| Approval evaluator | No |
| Report runs checks | No |
| Fresh external review | No |
| Fresh Devin review | No |
| Runtime blocked | Yes |

## Design Boundary

Phase 4.1L allows the next phase to plan a deliberately blocked Rust-host
stdio runtime skeleton. That skeleton may define private Rust modules,
in-memory test doubles, fail-closed state transitions, and pure parser reuse
around the existing Phase 4.1J fixture-backed frame coverage and Phase 4.1K
contract gates.

The proposed Phase 4.2A skeleton boundary is:

- `stdio_runtime::frames`: reuse existing JSONL frame validation and Phase
  4.1J fixture expectations.
- `stdio_runtime::diagnostics`: model deterministic redacted stderr diagnostic
  records with in-memory sinks only.
- `stdio_runtime::session`: model terminal-state and sequence bookkeeping
  without process stdio ownership.
- `stdio_runtime::approval_gate`: return runtime-unavailable until a later
  explicit approval evaluator phase.

Phase 4.1L does not add those modules. It records the handoff so Phase 4.2A can
add them as an inert skeleton without also enabling runtime.

## Test Plan

The Phase 4.2A skeleton should begin with tests for:

- Valid fixture streams entering the blocked skeleton and returning a
  deterministic runtime-unavailable result.
- Malformed JSON, CRLF, missing final LF, oversized input, early EOF, invalid
  payloads, and runtime approval requests remaining rejected.
- Stdout and stderr sinks staying in-memory test doubles.
- Missing approval records failing closed.
- No CLI runtime-like command being introduced.
- Source guards proving no live stdin, stdout, stderr, process, thread,
  network, or async runtime APIs are used.

Phase 4.1L adds static Node and Rust checks for the readiness matrix, the
blocked-runtime distinction, unchanged CLI command surface, and absent
production Rust runtime APIs.

## Blocker Burn-Down

| Blocker | Classification | Phase 4.1L Status |
| --- | --- | --- |
| Bounded skeleton module layout | Must solve before skeleton | Ready for 4.2A planning |
| Stdin loop shape | Can solve during skeleton | Planned only; no live read loop |
| Stdout/stderr writer ownership | Can solve during skeleton | Planned only; in-memory test doubles only |
| Process lifecycle hooks | Can solve during skeleton | Planned only; no process control |
| Failure-audit and transcript hooks | Can solve during skeleton | Planned only; no persistence runtime |
| Runtime command surface | Must remain blocked until runtime enablement review | Blocked |
| Approval evaluator and grant | Must remain blocked until runtime enablement review | Blocked |
| External runtime integrations | Must remain blocked until runtime enablement review | Blocked |

## Still Blocked

The following remain unavailable after Phase 4.1L:

- `serve-runtime`
- `stdio-runtime`
- `replay-session-transcript`
- `external-review-packet`
- `review-packet`
- `runtime-readiness-review`
- `runtime-implementation-readiness`
- `phase-4-2a-runtime-skeleton`
- live stdin reader or command loop
- live stdout/stderr runtime writer
- process stdio ownership, process control, cleanup, or kill behavior
- approval evaluator, host-policy runtime enforcement, or runtime approval grant
- transcript persistence/replay runtime
- failure-audit runtime
- adapter, Locus, MCP, OpenClaw, plugin, WebSocket/HTTP, or Content Fabric
  runtime behavior

## Review Note

Codex 5.5 subagents reviewed the 4.1I through 4.1K lineage and converged on the
same boundary: Phase 4.2A should be a library-only, deliberately blocked Rust
skeleton with in-memory test doubles and no CLI command. Phase 4.1L records
that design and the required validation posture. It does not claim runtime
readiness and cannot grant runtime approval.

## Recommended 4.2A Prompt

Implement Phase 4.2A as a deliberately blocked Rust-host stdio runtime skeleton
only. Add private Rust skeleton modules and tests under `crates/ardyn-host`,
reuse existing Phase 4.1J/4.1K frame and gate helpers, return
runtime-unavailable for all approval/runtime paths, and keep `apps/cli/src/index.mjs`
unchanged. Do not add live stdin reads, live stdout/stderr writers, process
control, runtime commands, approval grants/evaluators, WebSocket/HTTP surfaces,
adapters, Locus/MCP/OpenClaw/plugin runtime behavior, or Content Fabric runtime
behavior.

## Phase 4.2A Follow-Up

Phase 4.2A is documented in
`docs/phase-4-2a-deliberately-blocked-rust-host-stdio-runtime-skeleton.md`.
It implements the deliberately blocked skeleton described above while keeping
runtime enablement, CLI runtime commands, process stdio ownership, approval
grants, external integrations, and live execution unavailable.
