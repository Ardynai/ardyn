# Session Events Stdio Contract

Phase 3.8 adds a schema and examples for future ARDYN session events. This is a
stdio-first contract, not a stdio runtime.

## Current Scope

The current repository includes:

- `schemas/session-event.schema.json`.
- Valid examples under `examples/session-events/`.
- Invalid examples that prove non-ARDYN source harnesses and unsafe safety
  flags are rejected.
- Tests that validate the schema and example set.

The schema requires:

- `schemaVersion: "0.1.0"`.
- `sourceHarness: "ardyn"`.
- `nonExecuting: true`.
- Every no-execution safety flag set to `false`.
- A bounded event payload matching the declared event type.

Supported event types are:

- `session.started`.
- `session.heartbeat`.
- `session.capabilities`.
- `task.planned`.
- `approval.requested`.
- `approval.recorded`.
- `session.completed`.
- `session.error`.

## Future Transport Order

The first future transport should be a local stdio session-event stream. A
future stream must be line-delimited JSON, validate each event against
`schemas/session-event.schema.json`, preserve sequence ordering, and fail closed
on malformed input.

WebSocket and HTTP transports are later work. They must not be added until the
stdio contract is versioned, tested, and reviewed with explicit host-policy
preconditions.

## Locus Boundary

Locus may later display session events as local review evidence, but Phase 3.8
does not add a Locus dependency, Locus SDK import, connector, server, listener,
or callback.

A future manifest field such as `adapters.locus.endpoint` must be introduced in
a later versioned schema before use. It must remain inert until a later phase
adds explicit connection policy, approval gates, local permission review, and
safety tests.

## Forbidden Behavior

The session-event contract must not be interpreted as permission to:

- Execute tasks or tools.
- Start autonomous loops.
- Spawn processes outside tests.
- Start a stdio runtime.
- Open network listeners.
- Connect to WebSocket or HTTP endpoints.
- Call Locus, MCP, OpenClaw, plugins, or Multiverse.
- Download torrents.
- Install or enable Content Fabric packs.
- Load signing keys or secrets.

Phase 3.8 records the event shape only so later phases can build on a stable
review contract.
