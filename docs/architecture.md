# ARDYN Architecture

ARDYN is a standalone open-source AI harness/framework. It should run locally without Locus or Multiverse, while exposing stable adapters so those systems can connect.

## Runtime Split

ARDYN uses a Rust host plus TypeScript core architecture.

The Rust host is responsible for:

- Native CLI and daemon lifecycle.
- Process supervision.
- Stdio, HTTP, and WebSocket transport ownership.
- Windows-first OS integration.
- Filesystem, process, network, and credential boundary enforcement.
- Starting sandboxed child processes when future phases add execution.

The TypeScript core is responsible for:

- Agent and session contracts.
- Capability loading.
- Task validation.
- Plugin and adapter API shapes.
- MCP client/server integration.
- Locus and Multiverse adapter packages.

The boundary is intentional: Rust answers whether ARDYN may safely do something on this machine; TypeScript answers what ARDYN capabilities and adapters mean.

## Contract First

Phase 1 defines schemas before runtime behavior:

- `schemas/ardyn.manifest.schema.json`
- `schemas/capability.schema.json`
- `schemas/task.schema.json`

Future code should generate Rust and TypeScript types from these contracts rather than duplicating hand-written model definitions.

## Non-Goals For Phase 1

Phase 1 does not implement:

- Autonomous planning.
- Tool execution.
- Browser or desktop control.
- Locus live control.
- Multiverse registration.
- Model-provider execution.

Those features should be added only after manifests, capabilities, tasks, permissions, and host/core handshake behavior are testable.

