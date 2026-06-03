# Phase 4.0D Rust Host Transport Policy Contracts

Phase 4.0D converts the Phase 4.0C pre-runtime transport policy into concrete
Rust-host contract types and unit tests. It remains a policy-contract phase. It
does not implement process-level stdio ownership, a live stdin command loop, a
live stdio reader, listener, server, subprocess supervisor, adapter call, Locus
runtime dependency, MCP/OpenClaw call, plugin execution path, Content Fabric
runtime path, autonomous loop, secret handling path, production signing-key
path, transcript persistence/replay runtime, WebSocket surface, HTTP control
surface, or runtime execution behavior.

## Rust Contract Surface

`crates/ardyn-host/src/lib.rs` exposes the Phase 4.0D policy contract through:

- `ARDYN_STDIO_TRANSPORT_POLICY_PHASE`
- `PolicyImplementationStatus`
- `StdioPolicyOwner`
- `StdioStreamPurpose`
- `StdioLineEnding`
- `StdioCommitUnit`
- `StdioTransportFailureAction`
- `StdioLineFailureKind`
- `StderrDiagnosticClass`
- `RedactionSubject`
- `TranscriptReplayInputPreference`
- `RawJsonlCaptureRole`
- `StdioStreamOwnershipPolicy`
- `StdioJsonlFramingPolicy`
- `StderrDiagnosticPolicy`
- `StderrRedactionPolicy`
- `BackpressurePolicy`
- `PartialWritePolicy`
- `LineIntegrityFailureRule`
- `LineIntegrityPolicy`
- `ExitSemanticsPolicy`
- `TranscriptReplayReadinessPolicy`
- `RuntimeSafetyPolicyFlags`
- `StdioTransportPolicyContract`
- `stdio_transport_policy_contract()`
- `StdioTransportPolicyContract::is_pre_runtime_fail_closed()`
- `RuntimeSafetyPolicyFlags::all_runtime_flags_disabled()`

These are serializable policy contracts. They are not a runtime loop and they do
not open, read, write, supervise, or own process stdio.

## Default Policy

`stdio_transport_policy_contract()` returns the Phase 4.0D default:

- `implementationStatus: "policy-only-pre-runtime"`
- `runtimeImplementationActive: false`
- current stdout and stderr owner: `typescript-dry-run-cli`
- future runtime stdout and stderr owner: `rust-host`
- stdout reserved for validated session-event JSONL only
- stderr reserved for redacted diagnostics only
- UTF-8 LF-only JSONL framing
- no CRLF, blank lines, duplicate event ids, or partial-frame event semantics
- stderr diagnostics only, with no session events on stderr and no diagnostics
  on stdout
- redaction enforcement not active yet, but required before live runtime
- backpressure and partial-write handling not implemented yet, but modeled as
  fail-closed requirements
- dropped, duplicate, out-of-order, and malformed lines reject transcript
  evidence by default
- exit semantics require a complete valid terminal state before success
- transcript persistence and replay remain proposal-only
- every runtime, network, adapter, plugin, Fabric, secret, and signing flag is false

## Fail-Closed Tests

Rust unit tests pin the default contract and prove that enabling runtime-like
fields makes `is_pre_runtime_fail_closed()` return `false`. The tests cover:

- stdout/stderr ownership split
- JSONL and stderr diagnostic framing
- redaction categories without secret handling
- line-integrity failure rules
- backpressure, partial-write, and exit semantics
- transcript replay readiness as proposal-only
- JSON serialization shape for report and docs review
- negative mutations for live stdio, active stdout ownership, partial-frame
  events, duplicate-line recovery, and replay runtime enablement

## Relationship To Phase 4.0C

Phase 4.0C defined the policy in prose. Phase 4.0D adds Rust-host contract
types so later phases have a typed object to review before any live runtime.

The Phase 4.0D contract intentionally does not enforce host policy at runtime.
A later phase must still define and implement actual Rust-host stdout/stderr
ownership, buffering, flushing, backpressure, partial-write handling, redaction
enforcement, process exit behavior, audit records, transcript persistence, and
replay controls before live stdio can exist.

## Still Forbidden

Phase 4.0D must not be interpreted as permission to:

- read stdin as a command loop
- start a live stdio reader or runtime
- open listeners, servers, WebSocket, HTTP, or MCP transports
- spawn or supervise subprocesses
- connect adapters
- depend on Locus at runtime
- call MCP or OpenClaw
- execute plugins
- download, install, or enable Content Fabric packs
- run autonomous loops
- handle secrets or production signing keys
- persist or replay transcripts as runtime behavior
- execute tasks, tools, or model-provider actions
