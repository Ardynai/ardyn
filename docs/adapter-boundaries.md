# Adapter Boundaries

ARDYN adapters connect the standalone harness to external systems without making those systems core dependencies.

## OpenClaw Adapter

OpenClaw is a reference and possible interop target. ARDYN may expose or consume compatible gateway and plugin concepts in future phases, but it must not copy OpenClaw source code or depend on OpenClaw at runtime.

Initial adapter location:

- `packages/adapters/openclaw/`

## Locus Adapter

Locus is mission control. It can run, observe, and control ARDYN through public ARDYN APIs.

Locus must remain a peer client, not ARDYN's host app. ARDYN should still run headless or through its own CLI when Locus is absent.

Future adapter responsibilities:

- Connect to ARDYN sessions.
- Subscribe to session events.
- Start and stop tasks through explicit task contracts.
- Display capabilities and health.

## Multiverse Adapter

Multiverse integration is optional and external. ARDYN should be able to register as a Multiverse citizen later, but Multiverse must not own ARDYN's local identity or runtime.

Future adapter responsibilities:

- Publish capability metadata.
- Publish health and endpoint metadata.
- Register trust claims when configured.
- Degrade cleanly when Multiverse is absent.

## MCP Adapter

MCP is a core interoperability boundary. ARDYN should treat MCP as a typed protocol surface with explicit tool manifests and permission grants, not as an unrestricted execution tunnel.

