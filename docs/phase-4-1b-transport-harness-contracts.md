# Phase 4.1B Transport Harness Contracts

Phase 4.1B defines static Rust-host metadata only for a future stdio transport
harness. The contract records what a later approved runtime implementation
would need to own, but it does not own process stdio, read stdin, write stdout,
write stderr, persist transcripts, emit failure audits, spawn subprocesses, or
start any runtime control path.

The Rust helpers live in `crates/ardyn-host/src/lib.rs` and expose
`TransportHarnessContract`, `TransportHarnessRuntimeAvailability`,
`TransportHarnessContractClassification`,
`transport_harness_contract_json`,
`parse_transport_harness_contract_json`, and
`classify_transport_harness_contract_json`. These helpers serialize and inspect
deterministic local JSON review artifacts. They are not consumed by a live host
loop.

The deterministic fixture set is under
`tests/fixtures/host-policy/phase4-1b/`:

- `valid-static-transport-harness-contract.json`
- `missing-approval-reference-transport-harness-contract.json`
- `missing-policy-metadata-reference-transport-harness-contract.json`
- `missing-redaction-policy-reference-transport-harness-contract.json`
- `missing-transcript-audit-policy-reference-transport-harness-contract.json`
- `unsupported-major-transport-harness-contract.json`
- `malformed-missing-contract-kind-transport-harness-contract.json`
- `runtime-available-attempt-transport-harness-contract.json`

## Static Classification States

Phase 4.1B classifies transport harness contracts into static review states:

- `static_contract_only`
- `approval_missing`
- `policy_metadata_missing`
- `redaction_policy_missing`
- `transcript_policy_missing`
- `unsupported_version`
- `malformed`
- `runtime_unavailable`

Only the exact current `static_contract_only` artifact validates. The
fail-closed fixtures classify missing references, unsupported versions,
malformed records, and runtime-availability attempts without enabling runtime.

## Required References

The valid contract references four earlier or proposed gates:

- Phase 4.1A host-policy approval records.
- Phase 4.0E stdio transport policy metadata.
- Stderr redaction policy metadata.
- Transcript and failure-audit output policy metadata.

These approval references are necessary but not sufficient. Current contracts
do not enable runtime, do not grant runtime approval, and do not make operator
consent executable. A future implementation must still pass a separate approval
phase, blocking tests, and the major runtime-readiness checkpoint.

## Runtime Availability

Phase 4.1B records the future transport modes as metadata:

- `stdio-jsonl-session-events`
- `stderr-diagnostics`
- `stdin-command-stream`

Each mode is marked `metadataOnly: true` and `runtimeImplemented: false`.
Runtime availability remains `runtime-unavailable`, with `serve-runtime`,
`stdio-runtime`, process stdio ownership, stdin readers, stdout writers, stderr
writers, listeners, and subprocess spawning all unavailable.

## Non-Runtime Boundary

Phase 4.1B adds no live stdin command loop, live stdio reader, process stdio
ownership implementation, stdout JSONL writer, stderr diagnostic writer,
listener, server, subprocess runtime path, adapter call, Locus runtime
dependency, MCP/OpenClaw call, plugin execution, Content Fabric
download/install/enable behavior, autonomous loop, secret handling, production
signing-key usage, transcript persistence/replay runtime, failure audit runtime,
WebSocket or HTTP control surface, `serve-runtime`, `stdio-runtime`, or actual
runtime execution behavior.

The existing finite `emit-session-events --dry-run` CLI remains unchanged.
Transport harness command names such as `transport-harness`,
`transport-harness-contract`, `stdio-harness`, `stdin-reader`,
`stdout-writer`, `stderr-writer`, and `failure-audit` remain rejected as
unknown commands.

## Review Boundary

Devin review should remain reserved for the major runtime-readiness checkpoint.
Phase 4.1B is Codex-validated static evidence only. A later runtime phase must
bring separate implementation approval, Rust-host ownership tests, stdout JSONL
framing tests, stderr redaction tests, transcript persistence/replay tests,
failure audit tests, kill/exit/fail-closed tests, backpressure tests, and
dropped/duplicate/out-of-order/malformed-line tests before any live runtime
path can exist.

Phase 4.1C follows this contract with static stdout JSONL whole-line framing
and stderr redaction review helpers only. No live writer exists, no process
stdio ownership exists, and future runtime must use these rules but is not
implemented yet. See `docs/phase-4-1c-framing-redaction-contracts.md`.

## Cross-Links

Phase 4.1B builds on:

- `docs/phase-4-1-runtime-proposal.md`
- `docs/phase-4-1a-host-policy-approval-records.md`
- `docs/phase-4-1c-framing-redaction-contracts.md`
- `docs/phase-4-stdio-dry-run-event-emission.md`
- `docs/session-events-stdio-contract.md`
- `docs/host-policy-preconditions.md`
- `docs/architecture.md`
