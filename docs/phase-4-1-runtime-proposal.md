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
| 4.1D | Static transcript persistence and replay contracts with compatibility, digest, sequence, and fail-closed fixtures. See `docs/phase-4-1d-transcript-replay-contracts.md`. | false |
| 4.1E | Static failure-audit records, kill/cleanup policy, terminal-state checks, and nonzero exit mapping. See `docs/phase-4-1e-failure-audit-kill-semantics.md`. | false |
| 4.1F | Static runtime-readiness checkpoint with full Codex validation evidence, readiness matrix, blocker list, and preserved Devin review before enabling any live runtime surface. See `docs/phase-4-1f-runtime-readiness-checkpoint.md`. | false |
| 4.1G | Static external review packet for Devin/human reviewer questions, evidence mapping, blocked runtime surfaces, and packet-only outcomes. See `docs/phase-4-1g-external-review-packet.md`. | false |
| 4.1H | Static external review disposition record for Devin targeted-fix evidence, validation/smoke summaries, still-blocked runtime surfaces, and planning-only next step. See `docs/phase-4-1h-external-review-disposition.md`. | false |
| 4.1I | Private `#[cfg(test)]` in-memory Rust-host stdio test harness layer plus documentation/report inventory, limited to test infrastructure with runtime still blocked and no fresh Devin review. See `docs/phase-4-1i-rust-host-stdio-harness.md`. | false |
| 4.1J | Fixture-backed Rust-host stdio boundary fixtures and private Rust replay tests, limited to test infrastructure with no runtime readiness claim, no fresh external review, and no public runtime contract. See `docs/phase-4-1j-fixture-backed-stdio-boundaries.md`. | false |
| 4.1K | Approval-gated public Rust-host stdio runtime contract gates plus documentation/report inventory, limited to contract metadata with runtime implementation approval, runtime enablement, process stdio ownership, and CLI source changes still blocked. See `docs/phase-4-1k-stdio-runtime-contract-gates.md`. | false |
| 4.1L | Runtime implementation-readiness design, blocker burn-down, deterministic readiness/checklist fixture, and 4.2A handoff, limited to readiness inventory with runtime enablement, process stdio ownership, and CLI source changes still blocked. See `docs/phase-4-1l-runtime-implementation-readiness.md`. | false |
| 4.2A | Deliberately blocked internal Rust-host stdio runtime skeleton, limited to in-memory frame/gate planning and unavailable entrypoint results with runtime commands, process stdio ownership, approval grants, and CLI source changes still blocked. See `docs/phase-4-2a-deliberately-blocked-rust-host-stdio-runtime-skeleton.md`. | false |
| 4.2B | Deliberately blocked internal Rust-host lifecycle/failure-audit skeleton, limited to in-memory start/stop/kill/execute, transcript-plan, failure-audit, and kill-semantics planning with runtime commands, process control, write side effects, approval grants, and CLI source changes still blocked. See `docs/phase-4-2b-blocked-lifecycle-failure-audit-skeleton.md`. | false |
| 4.2C | Runtime readiness review gate and Jules/Devin review packet, limited to evidence consolidation, blocker burn-down, external-review status rules, and future enablement boundary with runtime approval, external review completion, CLI runtime commands, process control, write side effects, and CLI source changes still blocked. See `docs/phase-4-2c-runtime-readiness-review-gate.md`. | false |

Each future phase requires separate approval, implementation, tests, and review
before enabling its runtime surface. Phase 4.1A implements the first roadmap
item as static approval-record review metadata only. Phase 4.1B implements the
second roadmap item as static transport harness contract metadata only. Phase
4.1C implements the third roadmap item as static framing/redaction contract
metadata only. Phase 4.1D implements the fourth roadmap item as static
transcript persistence/replay contract metadata only. Phase 4.1E implements the
fifth roadmap item as static failure-audit kill-semantics contract metadata
only. Phase 4.1F implements the sixth roadmap item as a static
runtime-readiness checkpoint with deterministic fixture/report/doc/test
metadata only. Phase 4.1G implements the seventh roadmap item as a static
external review packet with deterministic fixture/report/doc/test metadata
only. Phase 4.1H implements the eighth roadmap item as a static external
review disposition record with deterministic fixture/report/doc/test metadata
only. Phase 4.1I implements the ninth roadmap item as a private `#[cfg(test)]`
in-memory Rust-host stdio test harness layer plus docs/report inventory, no
fresh Devin review, and runtime still blocked. Phase 4.1J implements the tenth
roadmap item as fixture-backed stdio boundary fixtures and private Rust replay
tests plus docs/report inventory, no runtime readiness, no fresh external
review, no public runtime contract, and runtime still blocked. Phase 4.1K
implements the eleventh roadmap item as approval-gated public Rust-host stdio
runtime contract gates plus docs/report inventory, with runtime implementation
approval false, runtime enabled false, process stdio ownership false, CLI
source changed false, no fresh external review, no fresh Devin review, and
runtime still blocked. Phase 4.1L implements the twelfth roadmap item as
runtime implementation-readiness design, blocker burn-down, and a 4.2A handoff,
with runtime implementation approval false, runtime enabled false, process
stdio ownership false, CLI source changed false, no fresh external review, no
fresh Devin review, and runtime still blocked. Phase 4.2B implements the next
blocked private skeleton layer for lifecycle/failure-audit planning with no
process control or write side effects. Phase 4.2C implements the next review
gate and Jules/Devin packet with runtime still blocked and external review not
complete. This Phase 4.1 proposal, Phase 4.1A, Phase 4.1B, Phase 4.1C, Phase
4.1D, Phase 4.1E, Phase 4.1F, Phase 4.1G, Phase 4.1H, Phase 4.1I, Phase 4.1J,
Phase 4.1K, Phase 4.1L, Phase 4.2A, Phase 4.2B, and Phase 4.2C implement none
of the live runtime surfaces.

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
