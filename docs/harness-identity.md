# Harness Identity

Phase 3.8 pins the Locus-facing ARDYN identity before any runtime connector
work exists.

## Canonical Slug

The canonical harness slug is `ardyn`.

Use `ardyn` for:

- The npm package and workspace namespace.
- Manifest-facing harness identity.
- Content Fabric family membership.
- First-party keyring publisher namespace.
- Future Locus connector expected id.

Do not introduce alternate ARDYN harness slugs for Phase 3.x contracts. Legacy
or speculative ARDYN-OS naming must not appear in manifests, Fabric catalog
families, keyring namespaces, session-event sources, or future Locus connector
ids unless a later phase explicitly versions a new public contract.

## Product Boundary

ARDYN is the open-source AI harness/framework. Locus is mission control outside
ARDYN. A future Locus UI may read local ARDYN planner traces, review artifacts,
trace diffs, schema-status summaries, attestation plans, and session-event
fixtures as inert review evidence.

Multiverse integration remains optional and external. ARDYN must not require
Multiverse to load manifests, validate tasks, render local review artifacts, or
validate Content Fabric conformance fixtures.

## Phase 3.x Boundary

Phase 3.x identity work is contract-only. It does not add:

- Runtime execution.
- Tool execution.
- Adapter connections.
- Locus runtime imports or SDK calls.
- Network servers, listeners, WebSocket clients, or HTTP clients.
- MCP/OpenClaw calls.
- Plugin install.
- Torrent download.
- Content Fabric download, install, enablement, serving, or runtime behavior.
- Code-pack enablement.
- Autonomous loops.
- Signing keys, secrets, or production attestations.

Any future execution-adjacent phase must keep this slug stable or introduce a
separate explicit migration document before consuming ARDYN state.
