# Phase 4.0A/4.0B/4.0C/4.0D/4.0E/4.0F/4.0G/4.0H/4.0I/4.1/4.1A/4.1B/4.1C/4.1D/4.1E Stdio Dry-Run Session Event Emission

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

Phase 4.0F defines static host-policy review-record fixtures and compatibility
classification for the Phase 4.0E metadata. It still does not change the finite
TypeScript dry-run emitter or add a review-record CLI command, file writer,
stdout printer, live stdio reader, runtime owner, transcript persistence,
replay command, WebSocket, HTTP, adapter, plugin, Content Fabric runtime,
secret, production signing-key path, or runtime approval grant.

Phase 4.0G adds static display-only comparison helpers and fixtures for
host-policy review records. It still does not change the finite TypeScript
dry-run emitter or add a comparison CLI command, file writer, stdout printer,
live stdio reader, runtime owner, transcript persistence, replay command,
WebSocket, HTTP, adapter, plugin, Content Fabric runtime, secret, production
signing-key path, or runtime approval grant.

Phase 4.0H adds static reviewer handoff/index documentation and deterministic
metadata for Phase 4.0A through Phase 4.0H artifacts. It still does not change
the finite TypeScript dry-run emitter or add a reviewer-index CLI command,
file writer, stdout printer, live stdio reader, runtime owner, transcript
persistence, replay command, WebSocket, HTTP, adapter, plugin, Content Fabric
runtime, secret, production signing-key path, or runtime approval grant.

Phase 4.0I adds static final pre-runtime readiness documentation and
deterministic metadata for Phase 4.0A through Phase 4.0I checklist and
invariant review. It still does not change the finite TypeScript dry-run
emitter or add a readiness CLI command, file writer, stdout printer, live
stdio reader, runtime owner, transcript persistence, replay command,
WebSocket, HTTP, adapter, plugin, Content Fabric runtime, secret, production
signing-key path, runtime approval grant, or Phase 4.1 implementation.

Phase 4.1 adds runtime proposal documentation and deterministic metadata only.
It still does not change the finite TypeScript dry-run emitter or add a
proposal CLI command, live stdio reader, runtime owner, transcript persistence,
replay command, WebSocket, HTTP, adapter, plugin, Content Fabric runtime,
secret, production signing-key path, runtime approval grant, or live runtime
implementation.

Phase 4.1A adds static host-policy approval-record documentation, review-only
Rust helper types, and deterministic operator-consent fixtures only. It still
does not change the finite TypeScript dry-run emitter or add an approval CLI
command, operator-consent CLI command, approval evaluator, host-policy
enforcement path, file writer, stdout printer, live stdio reader, runtime
owner, transcript persistence, replay command, WebSocket, HTTP, adapter,
plugin, Content Fabric runtime, secret, production signing-key path, runtime
approval grant, or live runtime implementation.

Phase 4.1B adds static transport harness contract documentation, review-only
Rust helper types, and deterministic fixtures only. It still does not change
the finite TypeScript dry-run emitter or add a transport harness CLI command,
stdin reader, stdout writer, stderr writer, failure-audit runtime, approval
evaluator, host-policy enforcement path, file writer, stdout printer, live
stdio reader, runtime owner, transcript persistence, replay command,
WebSocket, HTTP, adapter, plugin, Content Fabric runtime, secret, production
signing-key path, runtime approval grant, or live runtime implementation. See
`docs/phase-4-1b-transport-harness-contracts.md`.

Phase 4.1C adds static stdout JSONL whole-line framing and stderr redaction
contract documentation, review-only TypeScript helper functions, and
deterministic fixtures only. It still does not change the finite TypeScript
dry-run emitter or add a framing/redaction CLI command, stdin reader, stdout
writer, stderr writer, live writer, failure-audit runtime, approval evaluator,
host-policy enforcement path, file writer, stdout printer, live stdio reader,
runtime owner, transcript persistence, replay command, WebSocket, HTTP,
adapter, plugin, Content Fabric runtime, secret, production signing-key path,
runtime approval grant, or live runtime implementation. See
`docs/phase-4-1c-framing-redaction-contracts.md`.

Phase 4.1D adds static transcript persistence and replay contract
documentation, review-only TypeScript helper functions, and deterministic
fixtures only. It still does not change the finite TypeScript dry-run emitter
or add a transcript persistence CLI command, replay CLI command, stdin reader,
stdout writer, stderr writer, live writer, failure-audit runtime, approval
evaluator, host-policy enforcement path, file writer, stdout printer, live
stdio reader, runtime owner, transcript persistence runtime, replay runtime,
WebSocket, HTTP, adapter, plugin, Content Fabric runtime, secret, production
signing-key path, runtime approval grant, or live runtime implementation. See
`docs/phase-4-1d-transcript-replay-contracts.md`.

Phase 4.1E adds static failure-audit, terminal-state, cleanup/kill, and
nonzero-exit mapping contract documentation, review-only TypeScript helper
functions, and deterministic fixtures only. It still does not change the
finite TypeScript dry-run emitter or add a failure-audit CLI command, cleanup
CLI command, kill CLI command, stdin reader, stdout writer, stderr writer,
live writer, failure-audit runtime, cleanup runtime, process killing, process
control, signal handling runtime, timeout runtime, approval evaluator,
host-policy enforcement path, file writer, stdout printer, live stdio reader,
runtime owner, transcript persistence runtime, replay runtime, WebSocket,
HTTP, adapter, plugin, Content Fabric runtime, secret, production signing-key
path, runtime approval grant, or live runtime implementation. See
`docs/phase-4-1e-failure-audit-kill-semantics.md`.

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
to the Phase 4.0F host-policy review-record shape. See
`docs/phase-4-0e-rust-host-policy-metadata.md`.

The Phase 4.0E export has a golden fixture at
`tests/fixtures/host-policy/phase4-0e-stdio-transport-policy-metadata.json`.
It is not a CLI command and does not write files or stdout.

## Phase 4.0F Host-Policy Review Records

Phase 4.0F exposes deterministic Rust helpers that turn the Phase 4.0E policy
metadata into static `ardyn.host-policy-review-record` JSON, classify
review-record compatibility, and keep approval/rejection fields inert. See
`docs/phase-4-0f-host-policy-review-records.md`.

The Phase 4.0F fixture set is under
`tests/fixtures/host-policy/phase4-0f/`. It covers current compatible records,
same-major future-minor records, unsupported major records, malformed records,
permissive review metadata, and rejected permissive policy metadata. These
fixtures are static review artifacts, not runtime configuration files.

## Phase 4.0G Host-Policy Review Comparison

Phase 4.0G exposes deterministic TypeScript core helpers that compare static
`ardyn.host-policy-review-record` data for display-only reviewer handoff. See
`docs/phase-4-0g-host-policy-review-comparison.md`.

The Phase 4.0G fixture set is under
`tests/fixtures/host-policy/phase4-0g/`. It covers identical records,
same-major upgrade-available records, unsupported-major fail-closed records,
malformed records, rejected permissive policy records, digest mismatch, and
runtime-status mismatch. These fixtures are static review artifacts, not
runtime configuration files.

## Phase 4.0H Reviewer Handoff Index

Phase 4.0H adds a static reviewer handoff index for Devin/Codex navigation
across Phase 4.0A through Phase 4.0H artifacts. See
`docs/phase-4-0h-reviewer-handoff-index.md`.

The Phase 4.0H metadata fixture is
`tests/fixtures/host-policy/phase4-0h/reviewer-handoff-index.json`. It records
artifact paths, artifact kinds, phase introductions, review purposes, runtime
status, evidence role, and false runtime approval fields. The fixture is
static metadata for review only. It is not runtime configuration and is not
consumed by a live host loop.

## Phase 4.0I Final Pre-Runtime Readiness

Phase 4.0I adds a static final pre-runtime readiness bundle for Devin/Codex
navigation across Phase 4.0A through Phase 4.0I checklist and invariant
evidence. See `docs/phase-4-0i-final-pre-runtime-readiness.md`.

The Phase 4.0I metadata fixture is
`tests/fixtures/host-policy/phase4-0i/final-pre-runtime-readiness.json`. It
records the reviewed starting SHA, Devin milestone summary, phase milestone
coverage, readiness checklist, non-execution invariant matrix, represented
artifacts, and false runtime approval fields. The fixture is static metadata
for review only. It is not runtime configuration, not an approval token, not a
stdout printer, not a file writer, not a Phase 4.1 implementation, and not
consumed by a live host loop.

## Phase 4.1 Runtime Proposal

Phase 4.1 adds a static runtime proposal for Codex review. See
`docs/phase-4-1-runtime-proposal.md`.

The Phase 4.1 metadata fixture is
`tests/fixtures/host-policy/phase4-1/runtime-proposal.json`. It records the
approval boundary, future Rust-host stdio ownership responsibilities, stdout
JSONL emission responsibilities, stderr diagnostic/redaction enforcement,
transcript persistence/replay design, failure audit records, kill/exit
fail-closed semantics, backpressure and partial-write handling,
dropped/duplicate/out-of-order/malformed-line behavior, required tests before
runtime, and phased roadmap. The fixture is static proposal metadata for
review only. It is not runtime configuration, not an approval token, not a
stdout printer, not a file writer, not a replay runtime, and not consumed by a
live host loop.

## Phase 4.1A Host-Policy Approval Records

Phase 4.1A adds static host-policy approval records and operator-consent
fields for Codex review. See
`docs/phase-4-1a-host-policy-approval-records.md`.

The Phase 4.1A fixtures are under
`tests/fixtures/host-policy/phase4-1a/`. They cover a valid-looking
review-only approval record that still cannot enable runtime, missing operator
consent, denied approval, unsupported version, malformed record,
expired/not-yet-valid validity, and a permissive runtime-grant attempt that
fails closed. The fixtures are static review metadata only. They are not
runtime configuration, not approval tokens, not an approval evaluator, not a
stdout printer, not a file writer, not replay runtime, and not consumed by a
live host loop.

## Phase 4.1B Transport Harness Contracts

Phase 4.1B adds static transport harness contracts for Codex review. See
`docs/phase-4-1b-transport-harness-contracts.md`.

The Phase 4.1B fixtures are under
`tests/fixtures/host-policy/phase4-1b/`. They cover a valid static contract
that still cannot enable runtime, missing approval-record references, missing
policy metadata references, missing stderr redaction references, missing
transcript/audit references, unsupported versions, malformed records, and a
runtime-availability attempt that fails closed. The fixtures are static review
metadata only. They are not runtime configuration, not a stdout writer, not a
stderr writer, not a stdin reader, not process stdio ownership, not a file
writer, not failure-audit runtime, not replay runtime, and not consumed by a
live host loop.

## Phase 4.1C Framing and Redaction Contracts

Phase 4.1C adds static stdout JSONL whole-line framing and stderr redaction
contracts for Codex review. See
`docs/phase-4-1c-framing-redaction-contracts.md`.

The Phase 4.1C fixtures are under
`tests/fixtures/host-policy/phase4-1c/`. They cover a valid static contract,
valid whole-line JSONL, blank lines, missing final LF, CRLF, malformed JSON
lines, partial JSON lines, redacted secrets/tokens, redacted absolute paths,
redacted stack traces, and unredactable diagnostics that fail closed. The
fixtures are static review metadata only. They are not runtime configuration,
not a stdout writer, not a stderr writer, not a stdin reader, not process stdio
ownership, not a file writer, not failure-audit runtime, not replay runtime,
and not consumed by a live host loop.

## Phase 4.1D Transcript Replay Contracts

Phase 4.1D adds static transcript persistence and replay contracts for Codex
review. See `docs/phase-4-1d-transcript-replay-contracts.md`.

The Phase 4.1D fixtures are under
`tests/fixtures/host-policy/phase4-1d/`. They cover a valid static transcript
persistence contract, a valid static replay contract, compatible replay
records, same-major upgrade-available records, unsupported major records,
malformed records, digest mismatches, sequence gaps, duplicate sequences,
out-of-order sequences, and permissive replay-runtime availability attempts
that fail closed. The fixtures are static review metadata only. They are not
runtime configuration, not a transcript persistence runtime, not a replay
runtime, not a file writer, not a stdout writer, not a stderr writer, not a
stdin reader, not process stdio ownership, not failure-audit runtime, and not
consumed by a live host loop.

## Phase 4.1E Failure Audit Kill Semantics

Phase 4.1E adds static failure-audit, terminal-state, cleanup/kill, and
nonzero-exit mapping contracts for Codex review. See
`docs/phase-4-1e-failure-audit-kill-semantics.md`.

The Phase 4.1E fixtures are under
`tests/fixtures/host-policy/phase4-1e/`. They cover a valid static
failure-audit record, redacted and unredactable stderr diagnostics, expected
and unexpected nonzero exit mappings, completed/failed/aborted/rejected
terminal states, cleanup-required policy metadata, cleanup-not-available
fail-closed metadata, malformed/unsupported records, and permissive
cleanup/kill runtime availability attempts that fail closed. The fixtures are
static review metadata only. They are not runtime configuration, not a
failure-audit runtime, not a cleanup runtime, not process killing, not process
control, not signal handling runtime, not timeout runtime, not a file writer,
not a stdout writer, not a stderr writer, not a stdin reader, not process
stdio ownership, not replay runtime, and not consumed by a live host loop.

## Deferred Runtime Work

Phase 4.1E intentionally does not implement repo-root confinement, transcript
persistence runtime, replay runtime, failure-audit runtime, cleanup runtime,
process killing, signal handling runtime, timeout runtime, dropped-line
replay, duplicate detection across a live stream, stderr redaction
enforcement, or Rust-host stdout/stderr runtime ownership. It documents review
evidence, operator-consent references, fail-closed transport harness
classifications, fail-closed framing/redaction classifications, fail-closed
transcript replay classifications, fail-closed failure-audit classifications,
terminal-state classifications, and a roadmap for later host-policy phases. A
future live runtime still requires separate explicit host policy,
implementation, tests, and runtime enablement.
