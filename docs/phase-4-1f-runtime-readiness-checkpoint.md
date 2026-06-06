# Phase 4.1F Runtime Readiness Checkpoint

Phase 4.1F is a review checkpoint, not runtime. It consolidates the Phase 4.1
through Phase 4.1E static proposal, approval, transport, framing/redaction,
transcript, failure-audit, kill, cleanup, and exit-semantics evidence into one
runtime-readiness checkpoint bundle. No live runtime implementation is included.

The deterministic checkpoint fixture is
`tests/fixtures/host-policy/phase4-1f/runtime-readiness-checkpoint.json`.
That fixture is review metadata only. It is not a runtime configuration, not an
approval token, not host-policy enforcement, not a CLI command, not a file
writer, not a stdout printer, and not consumed by a live host loop. The
checkpoint cannot grant runtime approval, cannot approve runtime enablement,
and cannot approve runtime implementation. Future live runtime work must be a
separate approved phase.

Devin review should happen after this if Josh wants an external
runtime-readiness review. This checkpoint records the Codex validation bundle
and preserves the external review for the major runtime-readiness decision
before live runtime can be implemented or enabled.

Phase 4.1G follows this checkpoint with an external review packet for
Devin/human handoff. See `docs/phase-4-1g-external-review-packet.md`. The
Phase 4.1G packet is review metadata only: it cannot grant runtime approval,
cannot approve runtime implementation, cannot enable runtime commands, and
cannot unblock any live runtime surface.

## Consolidated Evidence

Phase 4.1F consolidates these static artifacts:

| Phase | Scope | Primary Evidence |
| --- | --- | --- |
| 4.1 | Runtime proposal and implementation plan. | `docs/phase-4-1-runtime-proposal.md`, `tests/fixtures/host-policy/phase4-1/runtime-proposal.json` |
| 4.1A | Host-policy approval records and operator consent. | `docs/phase-4-1a-host-policy-approval-records.md`, `tests/fixtures/host-policy/phase4-1a/valid-review-only-host-policy-approval-record.json` |
| 4.1B | Rust-host transport harness contracts. | `docs/phase-4-1b-transport-harness-contracts.md`, `tests/fixtures/host-policy/phase4-1b/valid-static-transport-harness-contract.json` |
| 4.1C | Stdout JSONL framing and stderr redaction contracts. | `docs/phase-4-1c-framing-redaction-contracts.md`, `tests/fixtures/host-policy/phase4-1c/valid-static-framing-redaction-contract.json` |
| 4.1D | Transcript persistence and replay contracts. | `docs/phase-4-1d-transcript-replay-contracts.md`, `tests/fixtures/host-policy/phase4-1d/valid-static-transcript-replay-contract.json` |
| 4.1E | Failure-audit, terminal-state, kill, cleanup, and nonzero-exit contracts. | `docs/phase-4-1e-failure-audit-kill-semantics.md`, `tests/fixtures/host-policy/phase4-1e/valid-static-failure-audit-record.json` |

All evidence remains static. None of the artifacts starts a stdin command loop,
owns process stdio, writes live stdout or stderr, persists transcripts, replays
transcripts, runs cleanup, kills a process, evaluates host-policy approval, or
executes runtime behavior.

## Readiness Matrix

The checkpoint matrix uses two statuses:

- `ready-for-checkpoint`: static evidence is present and suitable for Codex
  checkpoint validation.
- `blocked-before-runtime`: the item remains a live-runtime blocker until a
  later approved phase resolves it.

Readiness rows:

- `runtime-proposal-boundary-readiness`
- `host-policy-approval-record-readiness`
- `transport-harness-contract-readiness`
- `framing-redaction-contract-readiness`
- `transcript-persistence-replay-contract-readiness`
- `failure-audit-kill-semantics-readiness`
- `runtime-effect-false-across-phase-4-1`
- `report-inventory-checkpoint-readiness`
- `runtime-command-negative-probe-readiness`
- `source-guard-no-runtime-surface-readiness`
- `devin-major-runtime-review-required`
- `separate-runtime-implementation-approval-required`

Every row has `grantsRuntimeApproval: false` and
`runtimeBehaviorIntroduced: false`.

## Approval Boundary

The Phase 4.1F checkpoint may approve only static checkpoint completeness. It
may record Codex validation evidence, identify blockers before runtime
implementation, and preserve the external runtime-readiness review for later.

It cannot approve:

- runtime implementation
- runtime command enablement
- process stdio ownership implementation
- host-policy enforcement runtime
- adapter calls
- Locus runtime dependency
- MCP/OpenClaw calls
- plugin execution
- Content Fabric download/install/enable behavior
- secret handling
- production signing-key usage

Before runtime implementation, ARDYN still requires a separately approved
implementation phase, a recorded Devin checkpoint review if Josh requests
external runtime-readiness review, a host-policy approval record bound to the
exact runtime scope, and operator consent bound to that exact scope.

Before runtime enablement, ARDYN still requires Rust-host stdio ownership,
stdout JSONL live writer tests, stderr diagnostic redaction enforcement tests,
transcript persistence/replay runtime tests, failure-audit runtime tests,
kill/cleanup/fail-closed runtime tests, backpressure and partial-write tests,
and dropped/duplicate/out-of-order/malformed-line tests.

## Blockers Before Runtime

The checkpoint keeps these live-runtime blockers open:

- `devin-major-runtime-readiness-review-not-recorded`
- `explicit-runtime-implementation-approval-not-recorded`
- `rust-host-live-stdio-runtime-not-implemented`
- `stdout-jsonl-live-writer-tests-missing`
- `stderr-redaction-live-enforcement-tests-missing`
- `transcript-persistence-replay-runtime-not-implemented`
- `failure-audit-cleanup-kill-runtime-not-implemented`
- `backpressure-partial-write-runtime-tests-missing`
- `line-integrity-runtime-tests-missing`
- `runtime-command-surface-not-approved`
- `approval-evaluator-host-policy-enforcement-not-implemented`
- `external-runtime-integrations-not-approved`

Each blocker requires separate approval before it can unblock runtime. None
grants runtime approval and none introduces runtime behavior.

## Non-Runtime Boundary

Phase 4.1F adds no live stdin command loop, no live stdio reader, no process
stdio ownership implementation, no listener/server, no subprocess spawning, no
adapter call, no Locus runtime dependency, no MCP/OpenClaw call, no plugin
execution, no Content Fabric download/install/enable behavior, no autonomous
loop, no secret handling, no production signing-key usage, no transcript
persistence/replay runtime, no WebSocket/HTTP control surface, and no actual
runtime execution behavior.

It does not implement `serve-runtime`, `stdio-runtime`,
`replay-session-transcript`, `runtime-readiness-checkpoint`, or any checkpoint
CLI command. Those names remain rejected as unknown commands with zero stdout.

The existing finite `emit-session-events --dry-run` CLI remains unchanged:
successful output is deterministic LF-only JSONL on stdout, and diagnostics
remain on stderr.

## Required Verification

Before merging Phase 4.1F, run:

- `npm test`
- `npm run test:schemas`
- `cargo test --workspace`
- `cargo check --workspace`
- `cargo fmt --check`
- `git diff --check`
- `npm run report:phase-status`

The status report remains local summary metadata only. It does not run checks,
start servers, spawn processes, write files, call network APIs, read secrets,
or imply external CI status.
