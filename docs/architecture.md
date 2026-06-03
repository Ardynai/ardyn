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

Phase 4.0C documents future process-level stdio policy only. A later reviewed
Rust host must own stdout/stderr policy, buffering, flushing, backpressure,
partial-write behavior, process exit semantics, redaction enforcement, and
transport-failure audit records before any live stdio runtime exists. The
current Rust host remains static and non-executing, and the current TypeScript
core owns deterministic contract data only.

Phase 4.0D codifies that Phase 4.0C policy as Rust-host contract types in
`crates/ardyn-host/src/lib.rs`. `StdioTransportPolicyContract`,
`RuntimeSafetyPolicyFlags`, and `stdio_transport_policy_contract()` are
serializable metadata only: no process-level stdio ownership is active, no
reader or writer loop exists, and every runtime safety flag remains false. See
`docs/phase-4-0d-rust-host-transport-policy-contracts.md`.

Phase 4.0E exports that Rust-host policy contract as deterministic JSON review
metadata through Rust helpers only. The export is a string/typed-data review
artifact with a golden fixture, digest helper, and future host-policy
review-record mapping; it does not write files, print to stdout, own stdio, or
start runtime behavior. See
`docs/phase-4-0e-rust-host-policy-metadata.md`.

Phase 4.0F makes host-policy review records current static artifacts for that
metadata. The records carry compatibility classification, inert approval or
rejection metadata, warnings, errors, and non-execution invariants; they do not
grant runtime approval or activate host-policy enforcement. See
`docs/phase-4-0f-host-policy-review-records.md`.

## Contract First

Phase 3 keeps ARDYN contract-first before runtime behavior:

- `schemas/ardyn.manifest.schema.json`
- `schemas/capability.schema.json`
- `schemas/task.schema.json`

Current TypeScript support loads manifests and tasks, validates them, resolves requested capabilities into non-executing task plans, and reports approval-gate data. Current Rust support remains a static host identity and handshake boundary. Future code should generate Rust and TypeScript types from these contracts rather than duplicating hand-written model definitions.

## Non-Goals For Phase 3

Phase 3 does not implement:

- Autonomous execution or agent loops.
- Tool execution.
- Browser or desktop control.
- Network serving.
- Plugin installation.
- Torrent download.
- Code-pack enablement.
- Rust task planning or runtime execution.
- Locus live control.
- Multiverse registration.
- Model-provider execution.

Those features should be added only after manifests, capabilities, tasks, permissions, task plans, approval-gate data, and host/core handshake behavior are testable.
