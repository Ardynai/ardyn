# Phase 4.0A Stdio Dry-Run Session Event Emission

Phase 4.0A introduces the first non-executing stdio session-event emission
path. It emits deterministic session events as JSON Lines to stdout for local
review and keeps diagnostics on stderr. It is not a live stdio runtime.

## CLI Surface

The Phase 4.0A command is:

```powershell
node apps/cli/src/index.mjs emit-session-events --dry-run --manifest <manifest.json> --task <task.json>
```

Successful output is LF-delimited JSONL. Each line is one complete
`schemas/session-event.schema.json` event. There is a final trailing LF and no
pretty-printed multiline JSON.

Failures print plain diagnostics to stderr and print no JSON to stdout.

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

## Deferred Hardening

Phase 4.0A intentionally does not implement repo-root confinement,
transcript persistence, dropped-line replay, duplicate detection across a live
stream, stderr redaction policy, or Rust-host stdout/stderr ownership. Those
belong to a later reviewed host-policy phase before any live stdio runtime can
exist.
