# Phase 4.0E Rust Host Policy Metadata Export

Phase 4.0E exports the Phase 4.0D Rust-host stdio transport policy contract as
deterministic JSON review metadata. It remains pre-runtime and non-executing.
It does not implement process-level stdio ownership, a live stdin command loop,
a live stdio reader, listener, server, subprocess supervisor, adapter call,
Locus runtime dependency, MCP/OpenClaw call, plugin execution path, Content
Fabric runtime path, autonomous loop, secret handling path, production
signing-key path, transcript persistence/replay runtime, WebSocket surface,
HTTP control surface, or runtime execution behavior.

## Rust Metadata Surface

`crates/ardyn-host/src/lib.rs` exposes the Phase 4.0E metadata surface through:

- `ARDYN_STDIO_TRANSPORT_POLICY_METADATA_SCHEMA`
- `ARDYN_STDIO_TRANSPORT_POLICY_METADATA_VERSION`
- `ARDYN_STDIO_TRANSPORT_POLICY_METADATA_PHASE`
- `ARDYN_HOST_POLICY_REVIEW_RECORD_SCHEMA`
- `ARDYN_HOST_POLICY_REVIEW_RECORD_VERSION`
- `PolicyMetadataExportStatus`
- `PolicyRuntimeStatus`
- `PolicyJsonSerializationFormat`
- `HostPolicyReviewStatus`
- `DeterministicPolicyJsonSerialization`
- `HostPolicyReviewRecordMapping`
- `StdioTransportPolicyMetadata`
- `HostPolicyReviewDecisionMetadata`
- `HostPolicyReviewRecord`
- `stdio_transport_policy_metadata()`
- `validate_stdio_transport_policy_metadata()`
- `serialize_stdio_transport_policy_metadata_json()`
- `stdio_transport_policy_metadata_json()`
- `parse_stdio_transport_policy_metadata_json()`
- `stdio_transport_policy_metadata_digest_hex()`
- `host_policy_review_record_for_stdio_transport_policy_metadata()`
- `validate_host_policy_review_record()`

These helpers return typed metadata, validate typed metadata, serialize metadata
to a string, parse metadata from a string, or compute a digest from deterministic
metadata bytes. They do not write files, print to stdout, read stdin, start a runtime, own process stdio, or load secrets.

## Deterministic JSON

The export schema is `ardyn.stdio-transport-policy-metadata` at
`schemaVersion: "0.1.0"`. The metadata phase is
`phase-4.0e-rust-host-policy-metadata`, and the embedded contract phase remains
`phase-4.0d-rust-host-transport-policy-contracts`.

`stdio_transport_policy_metadata_json()` uses
`serde_json::to_string_pretty` and appends exactly one final LF. CRLF is not
accepted by `parse_stdio_transport_policy_metadata_json()`. The top-level field
order is pinned as:

1. `schema`
2. `schemaVersion`
3. `metadataPhase`
4. `contractPhase`
5. `exportStatus`
6. `runtimeStatus`
7. `reviewOnly`
8. `serialization`
9. `policy`
10. `futureHostPolicyReviewRecord`

The golden fixture is
`tests/fixtures/host-policy/phase4-0e-stdio-transport-policy-metadata.json`.
It contains no platform data, user paths, environment values, current time,
production signatures, or signing keys.

## Fail-Closed Parsing

Phase 4.0E deserialization is typed and fail-closed. Unknown fields are rejected
by serde contracts, and validation rejects:

- unknown metadata or embedded policy versions
- missing required fields
- invalid stdout or stderr ownership values
- live-runtime-like booleans or permissive review metadata
- malformed redaction categories
- malformed line-integrity kinds or recovery behavior
- malformed exit semantics
- CRLF JSON metadata
- replay proposal drift

The validator is intentionally stricter than the Phase 4.0D
`is_pre_runtime_fail_closed()` helper. It also pins stderr diagnostic
determinism booleans, exact redaction category arrays, exact line-integrity kind
placement, exact transcript replay proposal strings, and the embedded policy
`schemaVersion` and `phase`.

## Future Review Records

`host_policy_review_record_for_stdio_transport_policy_metadata()` maps the
metadata export to a future `ardyn.host-policy-review-record` shape. That record
contains:

- policy contract schema and version
- SHA-256 digest of the deterministic metadata JSON
- reviewed phase `4.0E`
- runtime status `pre-runtime-policy-only`
- non-execution invariants
- approval and rejection fields as review metadata only

The default review decision is `review-pending`. `approvalRecorded` and
`rejectionRecorded` are false, and both approval and rejection runtime effects
are false. This mapping is a future review-record design aid only. It does not
grant approval, deny a running runtime, persist transcripts, or enforce host
policy at runtime.

## Still Forbidden

Phase 4.0E must not be interpreted as permission to:

- read stdin as a command loop
- start a live stdio reader or runtime
- open listeners, servers, WebSocket, HTTP, or MCP transports
- spawn or supervise subprocesses
- connect adapters
- depend on Locus at runtime
- call MCP or OpenClaw
- execute plugins
- download, install, or enable Content Fabric packs
- run autonomous loops
- handle secrets or production signing keys
- persist or replay transcripts as runtime behavior
- execute tasks, tools, or model-provider actions
