# ardyn-host

Rust host scaffold for ARDYN.

Phase 4.1B still exposes static Rust host identity, handshake data, policy-only
stdio transport contract metadata, deterministic review-only JSON export
helpers, static host-policy review-record helpers, and static host-policy
approval-record/operator-consent helpers plus static transport harness
contract helpers. Rust task planning, runtime
execution, live stdio reading, process-level stdio ownership, tool execution,
network serving, plugin installation, torrent download, code-pack enablement,
runtime approval grants, host-policy enforcement, approval evaluation, and
agent-loop behavior are not implemented here.

The Phase 4.0D contract surface is `stdio_transport_policy_contract()` plus the
serializable `StdioTransportPolicyContract` and `RuntimeSafetyPolicyFlags`
types in `src/lib.rs`. They codify the Phase 4.0C stdout/stderr ownership,
JSONL framing, stderr diagnostics, redaction, backpressure, partial-write,
line-integrity, exit, and transcript replay policies as inactive pre-runtime
metadata. `is_pre_runtime_fail_closed()` verifies the disabled default. See
`docs/phase-4-0d-rust-host-transport-policy-contracts.md`.

The Phase 4.0E metadata surface is `stdio_transport_policy_metadata_json()`,
`parse_stdio_transport_policy_metadata_json()`,
`stdio_transport_policy_metadata_digest_hex()`, and
`host_policy_review_record_for_stdio_transport_policy_metadata()`. These
helpers return strings or typed metadata only; they do not write files, print to
stdout, read stdin, start a runtime, own stdio, or load secrets. See
`docs/phase-4-0e-rust-host-policy-metadata.md`.

The Phase 4.0F review-record surface is
`host_policy_review_record_json_for_stdio_transport_policy_metadata()`,
`parse_host_policy_review_record_json()`,
`classify_host_policy_review_record_json()`, and
`rejected_host_policy_review_record_for_stdio_transport_policy_metadata()`.
These helpers return strings, typed review metadata, or compatibility classes
only; they do not write files, print to stdout, read stdin, start a runtime,
own stdio, grant runtime approval, or load secrets. See
`docs/phase-4-0f-host-policy-review-records.md`.

The Phase 4.1A approval-record surface is
`host_policy_approval_record_json()`,
`denied_host_policy_approval_record_json()`,
`parse_host_policy_approval_record_json()`, and
`classify_host_policy_approval_record_json()`. These helpers return strings,
typed review metadata, or classification values only; they do not write files,
print to stdout, read stdin, start a runtime, own stdio, enforce host policy,
evaluate live approval, grant runtime approval, or load secrets. See
`docs/phase-4-1a-host-policy-approval-records.md`.

The Phase 4.1B transport harness contract surface is
`transport_harness_contract_json()`,
`parse_transport_harness_contract_json()`, and
`classify_transport_harness_contract_json()`. These helpers return strings,
typed static metadata, or classification values only; they do not write files,
print to stdout, read stdin, start a runtime, own stdio, enforce host policy,
evaluate live approval, grant runtime approval, emit failure audits, or load
secrets. See `docs/phase-4-1b-transport-harness-contracts.md`.

Future live stdio work must make the Rust host the owner of process-level
stdout/stderr policy, buffering, flushing, backpressure, partial-write
handling, process exit semantics, redaction enforcement, and transport-failure
audit records before any runtime loop exists.
