# Phase 4.1K Stdio Runtime Contract Gates

Phase 4.1K records an approval-gated public Rust-host stdio runtime contract
surface and the blocked gates that must remain false before any live runtime
work can proceed.

This is contract-gate-only and non-executing. It does not approve or enable a
runtime implementation, does not add process stdio ownership, does not add a
CLI command, does not change `apps/cli/src/index.mjs`, does not add stdout or
stderr writers, does not add approval evaluation, does not enforce host policy
at runtime, and does not claim fresh external or Devin review.

## Boundary Summary

| Field | Value |
| --- | --- |
| Phase | 4.1K |
| Scope | Approval-gated public Rust-host stdio runtime contract gates |
| Rust source inventory | `crates/ardyn-host/src/lib.rs` |
| Gate fixture inventory | `tests/fixtures/host-policy/phase4-1k/stdio-runtime-contract-gates.json` |
| Focused test inventory | `tests/phase4-1k-stdio-runtime-contract-gates.test.mjs` |
| Public Rust contract introduced | Yes |
| Runtime implementation approved | No |
| Runtime enabled | No |
| Process stdio ownership | No |
| CLI source changed | No |
| Report runs checks | No |
| Fresh external review | No |
| Fresh Devin review | No |
| Runtime blocked | Yes |

## Contract Defined

Phase 4.1K defines the review boundary for a public Rust contract gate: a Rust
contract may describe the future stdio runtime gate, approval prerequisites,
and blocked state, but it must remain metadata. The contract is allowed to
name required approvals, required implementation review, and runtime-unavailable
classifications. It is not allowed to read stdin, write stdout or stderr, own
process stdio, evaluate approvals for a live runtime, enforce host policy for a
running process, start adapters, spawn subprocesses, or grant runtime approval.

The phase-status report inventories the Rust source path, expected gate fixture
path, expected focused test path, and documentation links. The report remains
local-summary-only and does not run those tests.

## Blocked Gates

The following gates remain blocked and must stay false in report metadata and
focused checks:

- Runtime implementation approved.
- Runtime implementation enabled.
- Live stdio runtime enabled.
- Process stdio ownership available.
- Live stdin reader available.
- Stdout writer available.
- Stderr writer available.
- Approval evaluator available.
- Runtime host-policy enforcement available.
- Runtime command or contract-gate command available.
- Runtime approval grant available.

Runtime-like command names such as `stdio-runtime-contract-gates`,
`runtime-contract-gates`, `stdio-runtime-contract`, `public-stdio-runtime-contract`,
`serve-runtime`, `stdio-runtime`, `approve-runtime`, `grant-runtime`, and
`enable-runtime` remain unavailable unless a later approved implementation
phase deliberately adds and tests them.

## Review Note

Phase 4.1K contractually defines the public Rust-host stdio runtime contract
gate and its blocked approval/runtime states. It does not provide runtime
readiness. A later implementation phase still needs explicit approval, owned
Rust source changes, focused tests, and review evidence before process stdio
ownership or runtime commands can exist.

Phase 4.1L follows this contract-gate layer with runtime implementation
readiness design, blocker burn-down, and a concrete 4.2A handoff while keeping
runtime implementation approval, runtime enablement, CLI source changes, and
process stdio ownership blocked. See
`docs/phase-4-1l-runtime-implementation-readiness.md`.
