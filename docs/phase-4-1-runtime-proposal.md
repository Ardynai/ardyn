# Phase 4.1 Runtime Proposal

Phase 4.1 is a proposal and implementation-plan phase only. It defines the
approval boundary, ownership model, failure semantics, replay design, test
gates, and roadmap required before any live stdio runtime can be implemented.
It does not implement a live runtime.

This proposal is static review evidence. It is not runtime configuration, not
an approval token, not host-policy enforcement, not a CLI command, not a stdout
printer, not a file writer, and not consumed by a live host loop. It adds no
live stdin command loop, live stdio reader, process stdio ownership,
subprocess runtime path, listener, server, adapter call, Locus runtime
dependency, MCP/OpenClaw call, plugin execution, Content Fabric
download/install/enable behavior, autonomous loop, secret handling, production
signing-key usage, transcript persistence/replay runtime, WebSocket or HTTP
control surface, or actual runtime execution behavior.

The deterministic machine-readable metadata for this proposal is
`tests/fixtures/host-policy/phase4-1/runtime-proposal.json`.

## Review Policy

Devin already reviewed Phase 4.0A through Phase 4.0H and gave PASS. Phase
4.0I added the final pre-runtime readiness bundle. Phase 4.1 uses Codex
validation for this proposal-only planning step and does not require another
Devin review now. The next Devin review should be preserved for the major
runtime-readiness checkpoint before any live runtime surface is enabled.

## Approval Boundary

Live runtime implementation is blocked until a later approved phase provides
all of the following:

- An explicit host-policy approval record naming the live runtime scope.
- Operator consent for process stdio ownership and lifecycle control.
- Rust-host ownership of stdin, stdout, stderr, buffering, flushing,
  backpressure, termination, and audit emission.
- Stdout JSONL framing enforcement before any live stream is accepted.
- Stderr diagnostic redaction enforcement before bytes leave the process.
- Transcript persistence and replay schema/version policy.
- Failure audit record schema and deterministic fixtures.
- Kill, exit, and fail-closed semantics.
- Backpressure and partial-write tests using deterministic simulations.
- Dropped, duplicate, out-of-order, and malformed-line tests.
- Negative tests proving runtime/proposal command names stay unavailable until
  implementation is separately approved.
- A major runtime-readiness review checkpoint.

The Phase 4.1 proposal cannot grant runtime approval. It defines the boundary
that a later implementation phase must satisfy.

## Rust-Host Stdio Ownership

Future Rust-host responsibilities:

- Own process-level stdin, stdout, and stderr lifecycle.
- Own process supervision, termination, flushing, and cleanup.
- Own OS pipe backpressure behavior and bounded queue policy.
- Own whole-line stdout commit behavior.
- Own stderr diagnostic framing and redaction enforcement.
- Own transport failure classification and audit record emission.
- Own kill, exit, and fail-closed mapping.

Future TypeScript-core responsibilities:

- Manifest and task validation.
- Deterministic planning data.
- Session-event construction.
- Session-event schema validation before serialization.
- Normalized session transcript validation.
- Deterministic compatibility, migration, display, and review metadata.
- Diagnostic classification inputs that the Rust host may redact and frame.

The TypeScript core must not own live stdin reads, live process supervision,
listener/server lifecycle, subprocess management, adapter connections, or
runtime permission enforcement.

## Stdout JSONL Emission

Future live stdout is reserved for session-event JSONL only:

- UTF-8 bytes only.
- LF-only line endings.
- One complete JSON object per line.
- No CRLF, bare CR, blank lines, or pretty-printed multiline JSON.
- A complete stream ends with a final LF.
- Every line validates against `schemas/session-event.schema.json`.
- `sequence` values are contiguous from `1`.
- `eventId` and `sequence` pairs are unique inside a session.
- Every event keeps `sourceHarness: "ardyn"`, `nonExecuting: true`, and all
  no-execution safety flags false until a later runtime phase deliberately
  changes the contract under approval.
- No diagnostics are written to stdout.

A full JSONL line is the smallest committed transport unit. Partial frames are
not events and must not become transcript evidence.

## Stderr Diagnostics And Redaction

Future live stderr is reserved for diagnostics, never session-event JSONL.
Before live stderr emits runtime diagnostics, the Rust host must enforce
redaction for:

- Secrets, bearer tokens, API keys, cookies, passwords, and connection strings.
- Production signing keys.
- Raw environment variables and environment dumps.
- Stack traces, source snippets, module paths, and dependency internals.
- Local absolute paths, home directories, usernames, and workspace roots.
- Raw JSON parse excerpts that may contain private payload content.
- Schema validation values that may contain private manifest or task content.

Future diagnostics should prefer stable error codes, categories, counts,
JSON-Pointer-like field locations, and redacted message text. Diagnostics must
not include session-event JSONL, raw private values, or stdout content.

## Transcript Persistence And Replay

Future persistence should store normalized `ardyn.session-transcript` JSON
after validation. Raw JSONL capture may remain forensic evidence, but replay
should consume normalized transcript envelopes so existing transcript
compatibility, migration, display, and safety checks remain the gate.

Future persisted transcript records should include:

- `schema: "ardyn.session-transcript"`.
- Semantic `schemaVersion`.
- `sessionId`.
- `sourceHarness: "ardyn"`.
- `nonExecuting: true` unless a later approved runtime schema changes this.
- False safety flags until separately approved runtime behavior exists.
- Ordered `events`.
- Optional inert capture metadata in a later versioned schema.

Replay must reject or classify duplicate, dropped, out-of-order, and malformed
events consistently with session transcript validation. Replay must not start
adapters, execute tasks, spawn processes, connect to Locus, call MCP/OpenClaw,
install plugins, enable Content Fabric packs, or use secrets.

The existing `replay-session-transcript` name remains proposal-only and must
continue to fail as an unknown command in this phase.

## Failure Audit Records

Future failure audit records should be deterministic local review artifacts.
They should include:

- Schema id and schema version.
- Session id and transport id.
- Failure class and stable error code.
- A redacted diagnostic summary.
- A stdout commit boundary summary.
- Whether a terminal event was observed.
- Whether stdout ended with a complete LF-delimited line.
- Whether stderr redaction passed.
- Whether backpressure or partial-write termination occurred.
- Whether a dropped, duplicate, out-of-order, or malformed line was observed.
- Exit code classification.
- Cleanup/kill outcome.
- False runtime approval fields.

Failure audit records are review artifacts. They must not grant runtime
approval or retroactively make partial events valid transcript evidence.

## Kill, Exit, And Fail-Closed Semantics

Future success requires:

- Exit `0`.
- All committed stdout event frames fully written.
- Final LF on stdout.
- Complete valid terminal state.
- Safe diagnostics flushed.
- No redaction failures.
- No transport failure audit class.

Future failure requires:

- Nonzero exit for malformed stdout framing, schema-invalid events, missing
  terminal events, dropped/duplicate/out-of-order lines, malformed lines,
  stderr redaction failures, backpressure termination, host-policy denial, kill
  timeout, or internal transport failure.
- No partial final stdout line.
- No partial event counted as committed transcript evidence.
- A deterministic failure audit record when the host can safely emit one.
- Cleanup that is idempotent and safe to retry.

Kill behavior must prefer fail-closed cleanup over recovery. A killed runtime
must not synthesize terminal events or convert incomplete output into valid
transcript evidence.

## Backpressure And Partial Writes

Future host writes must:

- Respect OS pipe backpressure.
- Use bounded queues or explicitly terminate.
- Never silently drop validated events to relieve pressure.
- Never let TypeScript core spin an autonomous retry loop.
- Treat a full LF-terminated JSONL event line as the smallest commit unit.
- Reject or terminate when a full line cannot be written safely.

Partial writes may be retried inside Rust-host policy only while they are still
internal and uncommitted. Once failure is observed, partial bytes must not be
counted as event evidence.

## Line Integrity Failures

Future transport treats these as invalid unless a later versioned recovery
policy explicitly changes the behavior:

- Dropped lines: sequence gaps, missing terminal events, or incomplete streams.
- Duplicate lines: repeated `eventId`, repeated `sequence`, or byte-identical
  event replay inside a session.
- Out-of-order lines: sequence lower than the prior sequence or not equal to
  the next expected sequence.
- Malformed lines: invalid JSON, non-object JSON, schema-invalid events,
  unsafe safety flags, non-ARDYN source harness, CRLF framing, blank lines, or
  command-like root fields.

The host may classify and audit these failures. It must not auto-correct
ordering, synthesize missing events, or downgrade malformed input into valid
review evidence.

## Required Tests Before Runtime

A later implementation phase must include blocking tests for:

- Approval boundary and host-policy consent.
- Rust-host stdio ownership.
- Stdout JSONL framing and final LF.
- Stderr diagnostic redaction.
- Transcript persistence and replay validation.
- Failure audit record determinism.
- Kill, exit, and fail-closed behavior.
- Backpressure and partial writes.
- Dropped, duplicate, out-of-order, malformed, CRLF, blank, unsafe,
  non-ARDYN, and command-like event lines.
- Runtime/proposal command negative probes until a command is deliberately
  implemented in an approved phase.

These tests are prerequisites. They are not optional follow-up notes.

## Phased Runtime Roadmap

Proposed future phases:

| Future Phase | Scope | Runtime Enabled Here |
| --- | --- | --- |
| 4.1A | Host-policy approval records, operator consent fields, runtime scope names, denial reasons, and review-only display behavior. See `docs/phase-4-1a-host-policy-approval-records.md`. | false |
| 4.1B | Static Rust-host transport harness contracts and fail-closed contract fixtures. See `docs/phase-4-1b-transport-harness-contracts.md`. | false |
| 4.1C | Static stdout JSONL whole-line framing and stderr redaction contracts with fail-closed fixtures. See `docs/phase-4-1c-framing-redaction-contracts.md`. | false |
| 4.1D | Normalized transcript persistence and inert replay review after schema, compatibility, redaction, and failure-audit tests exist. | false |
| 4.1E | Failure audit records, kill handling, cleanup, terminal-state checks, and nonzero exit mapping. | false |
| 4.1F | Major runtime-readiness checkpoint with full Codex validation and preserved Devin review before enabling any live runtime surface. | false |

Each future phase requires separate approval, implementation, tests, and review
before enabling its runtime surface. Phase 4.1A implements the first roadmap
item as static approval-record review metadata only. Phase 4.1B implements the
second roadmap item as static transport harness contract metadata only. Phase
4.1C implements the third roadmap item as static framing/redaction contract
metadata only. This Phase 4.1 proposal, Phase 4.1A, Phase 4.1B, and Phase 4.1C
implement none of the live runtime surfaces.

## Still Forbidden

Phase 4.1 adds no live stdin command loop, live stdio reader, process stdio
ownership implementation, listener, server, subprocess runtime path, adapter
call, Locus runtime dependency, MCP/OpenClaw call, plugin execution, Content
Fabric download/install/enable behavior, autonomous loop, secret handling
beyond proposal wording, production signing-key usage, transcript
persistence/replay runtime, WebSocket or HTTP control surface, actual runtime
execution behavior, `serve-runtime`, or `stdio-runtime`.

Runtime and proposal command names remain rejected by the CLI until a later
approved implementation phase deliberately adds and tests them.
