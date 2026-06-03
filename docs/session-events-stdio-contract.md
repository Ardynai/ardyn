# Session Events Stdio Contract

Phase 3.9 hardens the future stdio contract around static session transcript
review. Phase 3.10 adds transcript versioning and read-only display policy.
This remains a stdio-first contract, not a stdio runtime.

## Current Scope

The current repository includes:

- `schemas/session-event.schema.json`.
- `schemas/session-transcript.schema.json`.
- Valid examples under `examples/session-events/` and
  `examples/session-transcripts/`.
- Invalid examples that prove non-ARDYN source harnesses, unsafe safety flags,
  and malformed transcript envelopes are rejected.
- Tests that validate the schema and example sets.

Phase 3.9 defines a static transcript review model for Locus or any other
read-only viewer:

- A transcript is inert local JSON review evidence.
- The transcript envelope records `schema`, `schemaVersion`, `sessionId`,
  `sourceHarness`, `nonExecuting`, `safety`, and an ordered `events` array.
- The schema root uses `additionalProperties: false`, so unknown transcript
  command-like fields are rejected instead of silently accepted.
- Future metadata that is not part of the declared version must remain inert
  until a later schema version explicitly defines it.
- Sequence continuity, first-event semantics, and cross-event consistency stay
  review validation concerns; they are not a runtime permission grant.

The Phase 3.8 session-event schema requires:

- `schemaVersion: "0.1.0"`.
- `sourceHarness: "ardyn"`.
- `nonExecuting: true`.
- Every no-execution safety flag set to `false`.
- A bounded event payload matching the declared event type.

The Phase 3.9 session-transcript schema requires:

- `schema: "ardyn.session-transcript"`.
- `schemaVersion: "0.1.0"`.
- `sourceHarness: "ardyn"`.
- `nonExecuting: true`.
- The transcript safety envelope to keep every no-execution flag false.
- An `events` array whose items validate against
  `schemas/session-event.schema.json`.
- No unknown top-level fields.

Supported event types are:

- `session.started`.
- `session.heartbeat`.
- `session.capabilities`.
- `task.planned`.
- `approval.requested`.
- `approval.recorded`.
- `session.completed`.
- `session.error`.

## Static Review Model

Phase 3.9 does not add a live stdio runtime. The current contract exists so
reviewers can inspect local JSON transcripts and prove that future transport
work has a stable envelope before any process IO exists.

The local validation command shape is:

- `ardyn validate-session-transcript --file <file>`
- `ardyn validate-session-transcript --file <file> --summary`
- `ardyn validate-session-transcript --file <file> --explain`
- `ardyn validate-session-transcript --file <file> --schema-status`
- `ardyn validate-session-transcript --file <file> --display-summary`
- `ardyn validate-session-transcript --file <file> --compatibility-explain`

The Phase 3.10 schema-status, display-summary, and compatibility-explain forms
are implemented local-file review flows with no writes, no network, no stdio
runtime, no command execution semantics, and no process spawning.

## Phase 3.10 Transcript Versioning

The transcript schema id is `ardyn.session-transcript`.
`schemaVersion` is semantic version metadata for the transcript envelope,
safety proof, and event semantics. It is not a runtime permission.

Phase 3.10 display compatibility classes are:

- `compatible`.
- `upgrade_available`.
- `unsupported_major`.
- `malformed`.

Same-major patch and minor transcripts are compatible for inert display. Older
same-major transcripts may be shown as `upgrade_available` when a future
migration path is known. Unsupported major transcripts must be shown as
critical raw metadata only, and malformed transcripts must be shown as invalid
local review evidence only.

Unknown fields are inert for compatibility and display. The strict current
JSON Schema may still reject extra top-level fields because it uses
`additionalProperties: false`; that rejection is a validation finding, not an
execution instruction.

Migration and status records must use deterministic metadata in tests and
fixtures. Do not use live timestamps unless a timestamp is supplied by an
explicit fixture or test input.

See `docs/session-transcript-versioning-policy.md` for the full Phase 3.10
policy.

## Future Transport Order

The first future transport should be a local stdio session-event stream. A
future stream must be line-delimited JSON, validate each event against
`schemas/session-event.schema.json`, preserve sequence ordering, and fail closed
on malformed input.

Before any real stdio runtime exists, the Rust host policy must define all of
the following:

- Allowed stdout behavior.
- Allowed stderr behavior.
- Line-delimited JSON framing semantics.
- Malformed-line handling and termination behavior.
- Review/audit handling for dropped, duplicated, or out-of-order lines.

WebSocket and HTTP transports are later work. They must not be added until the
stdio contract is versioned, tested, and reviewed with explicit host-policy
preconditions.

## Locus Boundary

Locus may later display session events or transcripts as local review evidence,
but Phase 3.9 does not add a Locus dependency, Locus SDK import, connector,
server, listener, callback, or host ownership change.

Locus remains a peer, client, viewer, or future controller through a versioned
contract. It is not the ARDYN host app. Any future control path must stay
outside ARDYN until a later versioned contract adds explicit host-policy,
approval, and permission semantics.

A future manifest field such as `adapters.locus.endpoint` must be introduced in
a later versioned schema before use. It must remain inert until a later phase
adds explicit connection policy, approval gates, local permission review, and
safety tests.

## Forbidden Behavior

The session-event contract must not be interpreted as permission to:

- Execute tasks or tools.
- Execute a task without an explicit approval record.
- Start autonomous loops.
- Spawn processes outside tests.
- Access the filesystem without Rust host policy.
- Access the network without Rust host policy.
- Access process control without Rust host policy.
- Start a stdio runtime.
- Open network listeners.
- Connect to WebSocket or HTTP endpoints.
- Connect an adapter without declared permissions.
- Call Locus, MCP, OpenClaw, plugins, or Multiverse.
- Download torrents.
- Install or enable Content Fabric packs.
- Enable code packs without explicit verification, quarantine, and enablement
  policy.
- Load signing keys or secrets.

Phase 3.9 records the event and transcript shapes only so later phases can
build on a stable review contract.
