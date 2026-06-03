# Phase 4.0C Pre-Runtime Transport Policy

Phase 4.0C is a policy and design hardening phase before any live stdio
runtime exists. It documents the transport rules ARDYN must satisfy later, but
it does not implement a live stdin command loop, stdio reader, listener,
server, subprocess supervisor, adapter call, Locus dependency, MCP/OpenClaw
call, plugin execution path, Content Fabric runtime path, autonomous loop,
secret handling path, production signing-key path, WebSocket surface, or HTTP
control surface.

The only implemented Phase 4 transport-adjacent command remains the finite
local dry-run emitter:

```powershell
node apps/cli/src/index.mjs emit-session-events --dry-run --manifest <manifest.json> --task <task.json>
```

That command renders deterministic local JSONL to stdout and diagnostics to
stderr. It is not a live transport.

## Ownership Model

Future live stdio policy must split responsibility between the Rust host and
the TypeScript core.

The future Rust host must own process-level stdio policy:

- stdout reservation and writes
- stderr reservation and writes
- buffering, flushing, backpressure, and partial-write behavior
- process exit semantics
- dropped-line, duplicate-line, out-of-order-line, and malformed-line handling
- diagnostic redaction enforcement before bytes leave the process
- audit records for transport failures

The TypeScript core remains responsible for deterministic contract data:

- manifest and task validation
- non-executing planning data
- session-event construction
- session-event JSON Schema validation before serialization
- normalized session transcript validation
- deterministic compatibility, migration, display, and review metadata
- diagnostic classification inputs that the Rust host may later redact and
  frame

The TypeScript core must not own live process supervision, live stdin reads,
listener/server lifecycle, subprocess management, adapter connections, or
runtime permission enforcement.

## Stdout JSONL Framing

Future live stdout must be reserved for session-event JSONL only.

Required stdout framing rules:

- UTF-8 bytes only.
- One complete JSON object per line.
- LF is the only line separator.
- CRLF and bare CR are invalid transport framing.
- No blank lines.
- No pretty-printed multiline JSON.
- A complete stream ends with a final LF.
- Every line must validate against `schemas/session-event.schema.json`.
- Event `sequence` values must be contiguous from `1`.
- `eventId` and `sequence` pairs must be unique inside a session.
- Every event must keep `sourceHarness: "ardyn"`, `nonExecuting: true`, and all
  no-execution safety flags false.

Partial frames are not valid events. A future host may buffer bytes internally
until it can write a whole line, but it must not treat a partial write as a
committed event. If a complete line cannot be written, the future host must fail
closed by terminating or rejecting the transport transcript rather than
inventing, truncating, or retrying event semantics in the TypeScript core.

## Stderr Diagnostic Framing

Stderr is reserved for diagnostics, never session-event JSONL. Current Phase
4.0B diagnostics are plain text on stderr with zero stdout for failures. A
future live runtime must choose and test one stderr diagnostic framing before it
ships.

Minimum future stderr framing requirements:

- one diagnostic record per LF-delimited line
- deterministic severity such as `info`, `warning`, `error`, or `critical`
- deterministic code or category suitable for tests
- redacted message text
- no secrets, production keys, bearer tokens, raw environment dumps, or stack
  traces
- no JSONL session events on stderr
- no stdout diagnostics

Human-readable stderr is acceptable for the current dry-run CLI. Before a live
runtime exists, stderr diagnostics must either become a structured line format
or keep a documented text format with stable categories and redaction rules.

## Backpressure And Partial Writes

Phase 4.0C does not implement backpressure handling. It records preconditions:

- Future host writes must respect OS pipe backpressure.
- The host must bound internal queues or define explicit termination behavior
  when the consumer is not reading.
- The host must never drop validated events silently to relieve pressure.
- The host must not allow TypeScript core code to spin an autonomous retry loop.
- A complete stdout event line is the smallest committable transport unit.
- If a full line cannot be written, the stream must be treated as failed or
  incomplete by host policy.

The dry-run CLI writes a finite string and exits. That does not prove live
backpressure behavior.

## Dropped, Duplicate, Out-Of-Order, And Malformed Lines

Future transport review must treat the following as invalid unless a later
versioned policy explicitly defines a recovery mode:

- Dropped lines: a sequence gap, missing terminal event, or incomplete stream.
- Duplicate lines: repeated `eventId`, repeated `sequence`, or byte-identical
  event replay inside the same session.
- Out-of-order lines: a sequence lower than the previous sequence or not equal
  to the next expected sequence.
- Malformed lines: invalid JSON, non-object JSON, schema-invalid events,
  unsafe safety flags, non-ARDYN source harness, CRLF framing, blank lines, or
  root command-like fields.

The future host may surface these as diagnostic records and transcript
validation findings. It must not auto-correct ordering, synthesize missing
events, or downgrade malformed input into valid review evidence.

## Process Exit Semantics

Phase 4.0C records the future exit contract but does not implement it.

Expected future semantics:

- Exit `0` only after the host has written all committed stdout event frames,
  flushed diagnostics that are safe to show, and produced a complete valid
  terminal state.
- Exit nonzero for malformed stdout framing, schema-invalid events, missing
  terminal events, dropped/duplicate/out-of-order lines, stderr redaction
  failures, backpressure termination, host policy denial, or internal
  transport failure.
- Nonzero exits must not leave stdout with a partial final line.
- If any event has not been fully written, it must not be counted as committed
  transcript evidence.

The existing dry-run emitter already keeps CLI failure stdout empty, but it is
not a live process lifecycle policy.

## Stderr Redaction Policy

Safe diagnostics today:

- command usage errors such as missing `--dry-run`
- unknown, duplicate, or missing CLI option values
- local-only path policy labels such as `manifest must be a local JSON file path`
- unreadable local file summaries for explicitly supplied local files
- JSON parse error summaries for explicitly supplied local files
- schema validation summaries that identify fields and validation keywords

Diagnostic class | Safe today | Future live-runtime redaction
--- | --- | ---
Usage errors | Stable command/flag text. | Keep command/flag text; do not include environment or argv dumps.
Unknown, duplicate, or missing args | Stable option name and failure reason. | Keep option name; redact any value if it resembles a secret, token, path, or connection string.
Local-only path labels | Field label and policy reason. | Do not echo absolute paths, usernames, home directories, or workspace roots.
Unreadable local files | Read failure class for an explicitly supplied local file. | Redact absolute path details and platform-specific internals.
JSON parse errors | Parser summary for an explicitly supplied local file. | Redact raw JSON excerpts and private payload content.
Schema validation errors | Field path, schema keyword, and count-style summaries. | Redact private values and avoid dumping full manifest/task payloads.
Internal stack traces | Not safe as normal diagnostics. | Redact or suppress frames, module paths, dependency internals, and source snippets.

Current dry-run diagnostics may include local paths for explicitly supplied
local files because this is a local developer CLI. Before a live runtime exists,
the future host must define stronger redaction for:

- secrets and production signing keys
- bearer tokens, API keys, cookies, passwords, and connection strings
- local absolute paths, home directories, usernames, and workspace roots
- raw environment variables or environment dumps
- stack traces, frames, module paths, and dependency internals
- raw JSON parse excerpts that may contain private payload content
- schema validation values that may contain private task or manifest content

Future safe live diagnostics should prefer stable labels, error codes, JSON
Pointer-like field locations, validation keywords, and counts. They should not
echo raw private values unless an explicit reviewed diagnostic mode permits it
and the Rust host redacts sensitive substrings first.

## Transcript Persistence And Replay Design

Phase 4.0C does not implement transcript persistence or replay. It only defines
the design boundary.

The preferred replay input is normalized
`ardyn.session-transcript` JSON after validation, not raw process bytes. Raw
JSONL line capture can remain a forensic source, but replay should consume a
normalized transcript envelope so it can reuse existing
`validate-session-transcript` compatibility classes, summary fields, safety
checks, and versioning policy.

Future persisted transcript records should be deterministic:

- `schema: "ardyn.session-transcript"`
- semantic `schemaVersion`
- `sessionId`
- `sourceHarness: "ardyn"`
- `nonExecuting: true`
- false safety flags
- ordered `events` array
- optional inert capture metadata in a later versioned schema

Replay must reject or classify duplicate, dropped, out-of-order, and malformed
events consistently with existing session transcript validation. Replay must
not start adapters, execute tasks, spawn processes, connect to Locus, call
MCP/OpenClaw, install plugins, enable Content Fabric packs, or use secrets.

Replay input condition | Phase 4.0C expectation
--- | ---
Valid normalized transcript | Acceptable for future inert review replay after validation.
Dropped sequence | Invalid unless a later versioned recovery policy exists.
Missing terminal event | Invalid unless a later versioned recovery policy exists.
Duplicate `sequence` | Invalid unless a later versioned recovery policy exists.
Duplicate `eventId` | Invalid unless a later versioned recovery policy exists.
Byte-identical duplicate raw JSONL line | Invalid forensic capture until normalized and reviewed.
Out-of-order sequence | Invalid unless a later versioned recovery policy exists.
Blank line | Invalid raw JSONL capture.
CRLF framing | Invalid raw JSONL capture for the stdout transport.
Non-JSON line | Invalid malformed-line finding.
Non-object JSON line | Invalid malformed-line finding.
Schema-invalid event | Invalid event evidence.
Unsafe safety flag | Invalid event evidence.
Non-ARDYN source harness | Invalid event evidence.

A future CLI proposal may look like:

```powershell
ardyn replay-session-transcript --file <session-transcript.json> --summary
ardyn replay-session-transcript --file <session-transcript.json> --explain
```

Those commands are proposal-only in Phase 4.0C. They must not be implemented as
runtime replay unless a later phase adds explicit persistence, replay, host
policy, redaction, transport failure semantics, implementation, tests, and
runtime enablement.

## Phase 4.0D Typed Contract Follow-Up

Phase 4.0D turns this prose policy into Rust-host contract metadata in
`crates/ardyn-host/src/lib.rs`. The typed surface includes
`StdioTransportPolicyContract`, `RuntimeSafetyPolicyFlags`,
`stdio_transport_policy_contract()`, and
`StdioTransportPolicyContract::is_pre_runtime_fail_closed()`.

Those types remain policy-only and pre-runtime. They do not activate Rust-host
stdio ownership, read stdin, write stdout or stderr, persist transcripts,
replay transcripts, spawn subprocesses, connect adapters, call Locus,
MCP/OpenClaw, plugins, or Content Fabric, handle secrets, or load production
signing keys. See
`docs/phase-4-0d-rust-host-transport-policy-contracts.md`.

## Phase 4.0C Completion Boundary

Phase 4.0C is complete when docs, report metadata, and static tests prove the
transport policy exists and remains pre-runtime. It must leave all runtime
flags false and must not change the existing dry-run emitter into a live
transport.
