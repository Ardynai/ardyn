# Phase 4.0F Host Policy Review Records

Phase 4.0F defines static host-policy review-record artifacts for the Phase
4.0E stdio transport policy metadata. It remains pre-runtime and
non-executing. It does not implement process-level stdio ownership, a live
stdin command loop, a live stdio reader, listener, server, subprocess
supervisor, adapter call, Locus runtime dependency, MCP/OpenClaw call, plugin
execution path, Content Fabric runtime path, autonomous loop, secret handling
path, production signing-key path, transcript persistence/replay runtime,
WebSocket surface, HTTP control surface, or runtime execution behavior.

## Rust Review-Record Surface

`crates/ardyn-host/src/lib.rs` exposes the Phase 4.0F review-record surface
through:

- `ARDYN_HOST_POLICY_REVIEW_RECORD_SCHEMA`
- `ARDYN_HOST_POLICY_REVIEW_RECORD_VERSION`
- `ARDYN_HOST_POLICY_REVIEW_RECORD_PHASE`
- `HostPolicyReviewStatus`
- `HostPolicyReviewCompatibility`
- `HostPolicyReviewDecisionMetadata`
- `HostPolicyReviewDiagnostics`
- `HostPolicyReviewRecord`
- `host_policy_review_record_for_stdio_transport_policy_metadata()`
- `rejected_host_policy_review_record_for_stdio_transport_policy_metadata()`
- `validate_host_policy_review_record()`
- `serialize_host_policy_review_record_json()`
- `host_policy_review_record_json_for_stdio_transport_policy_metadata()`
- `parse_host_policy_review_record_json()`
- `classify_host_policy_review_record_json()`

These helpers construct typed review records, validate typed review records,
serialize review records to deterministic JSON strings, parse review records
from strings, or classify review-record compatibility. They do not write files,
print to stdout, read stdin, start a runtime, own process stdio, grant runtime
approval, or load secrets.

## Record Shape

The record schema is `ardyn.host-policy-review-record` at
`schemaVersion: "0.1.0"`. The record phase is
`phase-4.0f-host-policy-review-records`, and the reviewed policy metadata phase
label remains `4.0E`.

Current records include:

- policy metadata schema and version
- SHA-256 digest of the deterministic Phase 4.0E policy metadata JSON bytes
- embedded policy contract version
- runtime status `pre-runtime-policy-only`
- exact non-execution invariants
- compatibility classification
- approval and rejection fields as review metadata only
- warnings and errors as review metadata only

The golden current fixture is
`tests/fixtures/host-policy/phase4-0f/current-host-policy-review-record.json`.
It contains no platform data, user paths, environment values, current time,
production signatures, signing keys, or runtime approval tokens.

## Compatibility Classification

Phase 4.0F defines these compatibility classes:

- `compatible`: exact current schema/version and strict review-record
  validation passes.
- `upgrade_available`: same-major non-current schema version; inert metadata
  display may be possible, but the exact-current validator fails closed.
- `unsupported_major`: unsupported major version; fail closed and do not
  interpret approval, rejection, digest, runtime status, or invariants as
  current semantics.
- `malformed`: invalid JSON, CRLF JSON, missing required fields, non-semver
  version metadata, unknown fields in an exact-current record, invalid digest,
  invariant drift, or runtime-effect fields.
- `rejected_policy`: a static review record for policy metadata that was
  reviewed and rejected as permissive or runtime-like. The rejection is review
  metadata only and has no runtime effect.

`classify_host_policy_review_record_json()` performs a tolerant JSON pre-pass
for `schema` and `schemaVersion` before strict deserialization. This keeps
future same-major and unsupported-major records distinguishable from malformed
exact-current records. `parse_host_policy_review_record_json()` remains strict
and accepts only exact-current compatible or rejected-policy records that pass
fail-closed validation.

## Review Metadata Only

Approval and rejection fields are inert review metadata. A record may say that
a reviewer approved or rejected the static artifact, but
`approvalRuntimeEffectAllowed` and `rejectionRuntimeEffectAllowed` must remain
false. Review records do not grant runtime approval. They do not:

- start or unlock a runtime
- grant permission to read stdin
- grant permission to own stdout or stderr
- grant permission to spawn subprocesses
- grant adapter, Locus, MCP, OpenClaw, plugin, Content Fabric, network, or
  filesystem runtime access
- persist or replay transcripts
- enable production signing keys or secret handling

Future Devin/Codex reviews can compare these records across phases as static
evidence. A future live runtime remains blocked until a separate approved phase
adds explicit host policy, implementation, tests, and runtime enablement.

Phase 4.0G adds TypeScript core display-only comparison helpers and
deterministic comparison fixtures for these records. That comparison layer is
review evidence only; it does not approve runtime behavior, start runtime
behavior, add a CLI command, write files, print stdout, or grant host-policy
enforcement. See `docs/phase-4-0g-host-policy-review-comparison.md`.

## Fixture Set

The Phase 4.0F fixture set is under
`tests/fixtures/host-policy/phase4-0f/`:

- `current-host-policy-review-record.json`
- `same-major-future-minor-host-policy-review-record.json`
- `unsupported-major-host-policy-review-record.json`
- `malformed-missing-schema-version-host-policy-review-record.json`
- `malformed-missing-policy-digest-host-policy-review-record.json`
- `malformed-permissive-approval-runtime-effect-host-policy-review-record.json`
- `rejected-permissive-policy-host-policy-review-record.json`

The fixtures are deterministic, LF-terminated JSON review artifacts. They are
not runtime configuration files and are not consumed by a live host loop.

## Still Forbidden

Phase 4.0F must not be interpreted as permission to:

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
