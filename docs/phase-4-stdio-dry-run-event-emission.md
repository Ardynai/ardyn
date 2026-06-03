# Phase 4.0A/4.0B/4.0C/4.0D/4.0E Stdio Dry-Run Session Event Emission

Phase 4.0A introduces the first non-executing stdio session-event emission
path. It emits deterministic session events as JSON Lines to stdout for local
review and keeps diagnostics on stderr. It is not a live stdio runtime.

Phase 4.0B hardens that same finite dry-run path. It does not add a live
runtime, streaming loop, listener, server, adapter connection, or persistence
path.

Phase 4.0C adds pre-runtime transport policy for the future live stdio path.
It is documentation and static contract hardening only. It does not add a
stdio reader, stdin command loop, process supervisor, transcript persistence,
or replay command.

Phase 4.0D codifies the Phase 4.0C policy as Rust-host contract metadata. It
does not change the finite TypeScript dry-run emitter or add a live stdio
reader, stdin command loop, process supervisor, transcript persistence, replay
command, WebSocket, HTTP, adapter, plugin, Content Fabric runtime, secret, or
production signing-key path.

Phase 4.0E exports the Rust-host policy contract as deterministic review-only
JSON metadata. It still does not change the finite TypeScript dry-run emitter
or add a CLI export command, file writer, stdout printer, live stdio reader,
runtime owner, transcript persistence, replay command, WebSocket, HTTP,
adapter, plugin, Content Fabric runtime, secret, or production signing-key path.

## CLI Surface

The Phase 4.0A command is:

```powershell
node apps/cli/src/index.mjs emit-session-events --dry-run --manifest <manifest.json> --task <task.json>
```

Successful output is LF-delimited JSONL. Each line is one complete
`schemas/session-event.schema.json` event. There is a final trailing LF and no
pretty-printed multiline JSON.

Failures print plain diagnostics to stderr and print no JSON to stdout.
Phase 4.0B rejects unknown options, duplicate options, missing option values,
and extra positional arguments before reading files.

## Core API Surface

The TypeScript core exposes:

- `createStdioDryRunSessionEvents(manifest, task, options)` returns a finite
  deterministic array of session events.
- `formatSessionEventsJsonl(events)` validates every event and serializes one
  event per LF-delimited line.
- `assertLocalFilePath(path, label)` and `assertLocalJsonFilePath(path, label)`
  enforce the shared local-only path policy.
- `readLocalJsonFile(path, label)` reads local JSON after that policy passes.

## Event Order

For a task that does not require approval, the emitted event order is:

1. `session.started`
2. `session.heartbeat`
3. `session.capabilities`
4. `task.planned`
5. `approval.recorded`
6. `session.completed`

If approval is required and at least one selected capability exists, an
`approval.requested` event is inserted before `approval.recorded`.

Every event has:

- `schemaVersion: "0.1.0"`
- `sourceHarness: "ardyn"`
- `nonExecuting: true`
- contiguous `sequence` values starting at `1`
- deterministic whole-second timestamps beginning at
  `1970-01-01T00:00:01Z`
- every no-execution safety flag set to `false`

## Local Path Policy

Manifest, task, transcript, and local JSON review inputs are local files only.
The shared policy rejects:

- URL schemes such as `https:`, `ardyn:`, or any non-drive scheme.
- `file:` URLs.
- UNC and network-style paths beginning with `\\` or `//`.
- Windows drive-relative paths such as `C:relative\file.json`.
- stdin marker `-`.
- NUL, CR, or LF characters in the path.
- non-JSON input paths when a JSON file is required.

Absolute local filesystem paths are allowed, including Windows drive-absolute
paths such as `C:\tmp\manifest.json`.

## Forbidden Behavior

Phase 4.0A does not add:

- live stdin command loops or listeners
- servers, sockets, WebSocket, HTTP, or MCP transports
- subprocess spawning
- adapter calls
- Locus runtime dependencies
- MCP or OpenClaw calls
- plugin execution or installation
- Content Fabric download, install, catalog serving, pack enablement, or code
  execution
- filesystem writes from the emitter
- secrets, signing keys, or production attestation behavior

The emitter may read the requested local manifest and task files, construct the
same non-executing plan data used by earlier phases, validate generated events,
and write the JSONL stream to stdout.

## Malformed Event Handling

`formatSessionEventsJsonl(events)` validates every event before serialization.
Malformed events fail closed with an exception and no partial serialization from
the CLI command. Root command-like fields and unsafe safety flags are rejected.
Phase 4.0B also treats sparse or missing event slots as malformed so the
formatter cannot produce blank JSONL lines.

## Phase 4.0B Hardening

Phase 4.0B adds:

- strict `emit-session-events` argument validation
- stderr-only diagnostics for all command failures
- zero stdout for missing `--dry-run`, unknown args, unsafe paths, unreadable
  files, invalid JSON, and schema-invalid JSON
- golden JSONL fixture coverage for the minimal successful stream
- explicit no-blank-line and final-LF formatter assertions
- future Rust-host stdout/stderr ownership notes before any live stdio runtime

This phase still does not implement transcript persistence, replay,
dropped-line handling, duplicate-line handling across a live stream, WebSocket
or HTTP transport, or Rust-host ownership of a live stdio process.

## Phase 4.0C Pre-Runtime Transport Policy

Phase 4.0C defines the policy that must exist before any live stdio runtime:

- future Rust-host ownership of stdout, stderr, buffering, backpressure,
  partial writes, process exit semantics, and transport-failure audit records
- TypeScript core ownership of deterministic manifests, tasks, planning data,
  session-event construction, schema validation, and normalized transcript
  validation
- stdout reservation for UTF-8 LF-delimited session-event JSONL only
- stderr reservation for redacted diagnostics only
- failure classification for dropped, duplicate, out-of-order, and malformed
  lines
- stderr redaction requirements for secrets, local absolute paths, environment
  variables, stack traces, JSON parse errors, and schema validation errors
- transcript persistence/replay design that prefers normalized
  `ardyn.session-transcript` JSON and remains proposal-only

See `docs/phase-4-0c-pre-runtime-transport-policy.md` for the full policy.
Phase 4.0C does not implement live replay, live persistence, a stdin reader, a
transport loop, or a new CLI command.

## Phase 4.0D Rust-Host Policy Contracts

Phase 4.0D exposes `StdioTransportPolicyContract`,
`RuntimeSafetyPolicyFlags`, and `stdio_transport_policy_contract()` from the
Rust host as policy-only metadata. The default contract keeps current stdout
and stderr ownership with the finite TypeScript dry-run CLI, reserves future
runtime ownership for the Rust host, models JSONL framing, diagnostics,
redaction, backpressure, partial writes, line-integrity failures, exit
semantics, and transcript replay readiness, and keeps every runtime flag false.

See `docs/phase-4-0d-rust-host-transport-policy-contracts.md` for the typed
contract. Phase 4.0D does not implement live replay, live persistence, a stdin
reader, a transport loop, or a new CLI command.

## Phase 4.0E Rust-Host Policy Metadata Export

Phase 4.0E exposes deterministic Rust helpers that return the Phase 4.0D policy
contract as review-only JSON metadata, validate that metadata, parse it
fail-closed, compute a SHA-256 digest over the deterministic bytes, and map it
to a future host-policy review-record shape. See
`docs/phase-4-0e-rust-host-policy-metadata.md`.

The Phase 4.0E export has a golden fixture at
`tests/fixtures/host-policy/phase4-0e-stdio-transport-policy-metadata.json`.
It is not a CLI command and does not write files or stdout.

## Deferred Runtime Work

Phase 4.0E intentionally does not implement repo-root confinement, transcript
persistence, dropped-line replay, duplicate detection across a live stream,
stderr redaction enforcement, or Rust-host stdout/stderr runtime ownership.
It documents and types those requirements for a later reviewed host-policy
phase before any live stdio runtime can exist.
