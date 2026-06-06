# Phase 4.1D Transcript Replay Contracts

Phase 4.1D is static contract/fixture work only. It defines deterministic
transcript persistence and replay review artifacts so later runtime work has a
stable contract to implement against. The transcript persistence runtime is not
implemented, the replay runtime is not implemented, and
replay-session-transcript remains proposal-only/rejected.

The TypeScript helpers live in `packages/core/src/index.mjs` and expose
`createTranscriptPersistenceContractForReview`,
`createTranscriptReplayContractForReview`,
`createTranscriptReplayCompatibilityRecordForReview`,
`classifyTranscriptReplayCompatibilityForReview`,
`formatTranscriptPersistenceContractJsonForReview`,
`formatTranscriptReplayContractJsonForReview`, and
`formatTranscriptReplayCompatibilityRecordJsonForReview`. These helpers create
and classify deterministic local review artifacts. They do not read files,
write files, read stdin, write stdout, write stderr, persist transcripts,
replay transcripts, own process stdio, or start a runtime loop.

The deterministic fixture set is under
`tests/fixtures/host-policy/phase4-1d/`:

- `valid-static-transcript-persistence-contract.json`
- `valid-static-transcript-replay-contract.json`
- `compatible-transcript-replay-record.json`
- `upgrade-available-transcript-replay-record.json`
- `unsupported-major-transcript-replay-record.json`
- `malformed-transcript-replay-record.json`
- `digest-mismatch-transcript-replay-record.json`
- `sequence-gap-transcript-replay-record.json`
- `duplicate-sequence-transcript-replay-record.json`
- `out-of-order-sequence-transcript-replay-record.json`
- `runtime-available-attempt-transcript-replay-record.json`

## Static Persistence Contract

The persistence contract is a static review record with:

- transcript artifact kind and transcript version
- source event stream reference
- event count
- sequence range
- event index
- event digest/hash
- persisted-at metadata as deterministic/static fixture metadata only
- replay compatibility classification
- replay safety status
- non-execution invariant summary
- failure/fail-closed reason fields
- runtime-effect fields that all remain false

The contract never writes a transcript to disk. The `persistedAt` value is a
fixture timestamp used for deterministic review output, not evidence that a
runtime persistence path exists.

## Static Replay Contract

The replay contract points at the static persistence contract and records the
future `replay-session-transcript` command name as unavailable. It is review
metadata only. It does not define a CLI command, does not open a transcript,
does not execute replay, does not call adapters, and does not connect to Locus,
MCP, OpenClaw, plugins, or Content Fabric.

## Compatibility States

Phase 4.1D classifies transcript replay review records into:

- `replay_contract_only`
- `compatible`
- `upgrade_available`
- `unsupported_major`
- `malformed`
- `digest_mismatch`
- `sequence_gap`
- `duplicate_sequence`
- `out_of_order_sequence`
- `replay_runtime_unavailable`

`compatible`, `upgrade_available`, and `replay_contract_only` are display-only
states. `unsupported_major`, `malformed`, `digest_mismatch`, `sequence_gap`,
`duplicate_sequence`, `out_of_order_sequence`, and
`replay_runtime_unavailable` fail closed. A record that attempts to set
transcript persistence or replay runtime availability to true is classified as
`replay_runtime_unavailable`.

## Non-Runtime Boundary

Phase 4.1D adds no live stdin command loop, live stdio reader, process stdio
ownership implementation, transcript persistence runtime, replay runtime,
runtime stdout writer, runtime stderr writer, approval evaluator, listener,
server, subprocess runtime path, adapter call, Locus runtime dependency,
MCP/OpenClaw call, plugin execution, Content Fabric download/install/enable
behavior, autonomous loop, secret handling, production signing-key usage,
failure-audit runtime, WebSocket or HTTP control surface, `serve-runtime`,
`stdio-runtime`, or actual runtime execution behavior.

The existing finite `emit-session-events --dry-run` CLI remains unchanged.
Transcript and replay command names such as `replay-session-transcript`,
`persist-session-transcript`, `transcript-replay`,
`transcript-persistence`, `transcript-replay-contract`,
`transcript-persistence-contract`, `transcript-sidecar`, `sidecar-writer`, and
`replay-transcript` remain rejected as unknown commands.

## Review Boundary

Future live transcript/replay behavior requires separate approval and Devin
review. A later implementation phase must bring Rust-host stdio ownership,
explicit host-policy approval, operator consent, transcript persistence tests,
replay validation tests, failure audit tests, kill/exit/fail-closed tests,
backpressure tests, partial-write tests, and
dropped/duplicate/out-of-order/malformed-line tests before any live runtime
path can exist.

## Cross-Links

Phase 4.1D builds on:

- `docs/phase-4-1-runtime-proposal.md`
- `docs/phase-4-1a-host-policy-approval-records.md`
- `docs/phase-4-1b-transport-harness-contracts.md`
- `docs/phase-4-1c-framing-redaction-contracts.md`
- `docs/phase-4-1e-failure-audit-kill-semantics.md`
- `docs/phase-4-stdio-dry-run-event-emission.md`
- `docs/session-events-stdio-contract.md`
- `docs/host-policy-preconditions.md`
- `docs/architecture.md`
