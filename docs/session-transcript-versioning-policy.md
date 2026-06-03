# Session Transcript Versioning Policy

Phase 3.10 defines versioning and read-only display policy for ARDYN session
transcripts. It does not add a live stdio runtime, command execution semantics,
network behavior, process control, plugin installation, torrent behavior,
Content Fabric runtime behavior, code-pack enablement, or a Locus runtime
dependency.

## Current Transcript Contract

The current transcript identity is:

| Field | Current value | Meaning |
| --- | --- | --- |
| `schema` | `ardyn.session-transcript` | Stable session-transcript schema id. Inputs without this value are not ARDYN session transcripts. |
| `schemaVersion` | `0.1.0` | Transcript contract version for envelope, safety, and event semantics. |

`schemaVersion` is a semantic version string. The strict schema validator for
the current JSON Schema pins it to `0.1.0`, but Phase 3.10 display
compatibility is same-major and read-only.

`schema` identifies the transcript family and must match
`ardyn.session-transcript` exactly. `schemaVersion` identifies the transcript
contract that produced the envelope and event stream. It is not a runtime
permission, transport declaration, or execution capability.

## Compatibility Classes

Transcript display compatibility uses these classes:

| Class | Severity | Display behavior |
| --- | --- | --- |
| `compatible` | `ok` or `warning` | Schema id is correct and the transcript has the current supported major. Display known fields and keep unknown fields inert. Same-major older versions may show warnings when strict validation does not accept the exact current schema. |
| `upgrade_available` | `warning` | Schema id is correct, the major is supported, and the transcript is same-major but older than the current contract. Display known fields as inert review evidence and show that a future migration may be available. |
| `unsupported_major` | `critical` | Schema id is correct but the major version is unsupported. Display identity, version, warnings, and raw inert metadata only. Do not interpret event or safety semantics as current. |
| `malformed` | `critical` | Input is not an object, schema id is missing or wrong, `schemaVersion` is missing or not semver, or required review structure is absent. Display validation errors and raw inert metadata only. |

Same-major patch and minor versions are display-compatible only. They must not
be treated as authorization to execute, connect, install, enable, serve, call
MCP/OpenClaw, contact Locus, run external CI, open network listeners, spawn
processes, or change ARDYN state.

Older same-major transcripts may be classified as `upgrade_available` when the
known metadata indicates a migration path. The migration record is review
metadata only. Phase 3.10 does not rewrite transcripts.

Unsupported major transcripts must fail closed for current semantics. A viewer
may show their identity and raw metadata, but it must not compute approval,
safety, sequence, or lifecycle meaning as if the transcript were current.

Malformed transcripts are not ARDYN review evidence. They may be shown only as
invalid local JSON or invalid metadata for diagnostic review.

## Unknown Field Policy

Unknown fields are inert for compatibility and display. They must not be
interpreted as commands, approvals, adapter instructions, network targets,
process handles, plugin install requests, torrent instructions, Content Fabric
pack operations, code-pack enablement, secrets, or runtime hints.

Display policy:

- Count unknown fields and list their JSON paths when available.
- Preserve unknown values only as inert review metadata.
- Redact previews according to the viewer's local secret policy.
- Do not create action controls, links, connections, installs, or approvals from
  unknown fields.

The current strict transcript JSON Schema uses `additionalProperties: false`.
That means current-schema validation may still reject extra top-level fields
even though the display compatibility policy treats unknown fields as inert
metadata. A strict validation rejection is a review warning or error, not an
instruction to execute or migrate.

## Deterministic Timestamp Policy

Migration, schema-status, display-summary, compatibility-explain, and status
report records must be deterministic.

Do not use live wall-clock timestamps for generated migration or status records
unless the timestamp is supplied by a committed fixture or explicit test input.
Tests should use fixed metadata such as:

- `createdAt: "1970-01-01T00:00:00.000Z"` for deterministic event fixtures.
- `generatedAt: "2026-06-02T00:00:00.000Z"` for committed review metadata when
  a generated-at field is required by a fixture.

The Phase 3.10 status report is local metadata only. It must not call clocks to
invent freshness, query external CI, or imply live runtime state.

## Locus Display Summary Fields

A Locus-facing or peer viewer summary for a session transcript should include:

- Session id.
- Source harness.
- Schema id and schema/version status.
- Event count.
- First event type.
- Last event type.
- Sequence range.
- Error event count.
- Approval event count.
- `task.planned` event count.
- Safety posture.
- Warnings and severity list.
- Unknown field count.

The summary remains local review evidence. It must not add controls that run,
connect, install, enable, call, serve, seed, or fetch anything.

## Runtime Boundary

Phase 3.10 does not add:

- Live stdio runtime.
- Command execution semantics.
- Network calls or listeners.
- Process spawning or process control.
- Runtime adapter connections.
- Locus SDK imports or Locus API calls.
- MCP, OpenClaw, plugin, or Multiverse calls.
- Plugin installation.
- Torrent download or seeding.
- Content Fabric download, install, catalog serving, or execution.
- Code-pack verification, quarantine, or enablement runtime.
- Autonomous loops or production tool execution.

`validate-session-transcript` remains a local JSON review flow. Any future
flags such as `--schema-status`, `--display-summary`, and
`--compatibility-explain` must stay local-file-only unless a later phase adds a
separate reviewed transport contract.

## Preconditions For Future Execution-Adjacent Phases

Before any future execution-adjacent transcript or transport phase, ARDYN must
have reviewed, versioned, and tested:

- Rust host policy for filesystem, process, network, stdout, stderr, and
  line-delimited JSON framing.
- Explicit approval gates before task or tool execution.
- Adapter permission declarations and review UI boundaries.
- Malformed-line, dropped-event, duplicate-event, and out-of-order-event
  handling.
- Secrets policy and redaction behavior.
- Content Fabric code-pack verification, quarantine, and explicit enablement
  policy before any code-pack path exists.
- Locus role and control boundaries that keep Locus external to ARDYN unless a
  later public ARDYN API contract says otherwise.
- Negative tests proving transcript metadata cannot start runtimes, connect
  adapters, install plugins, download torrents, enable code packs, or execute
  tools.
