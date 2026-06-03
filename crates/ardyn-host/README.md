# ardyn-host

Rust host scaffold for ARDYN.

Phase 4.0D still exposes static Rust host identity, handshake data, and
policy-only stdio transport contract metadata. Rust task planning, runtime
execution, live stdio reading, process-level stdio ownership, tool execution,
network serving, plugin installation, torrent download, code-pack enablement,
and agent-loop behavior are not implemented here.

The Phase 4.0D contract surface is `stdio_transport_policy_contract()` plus the
serializable `StdioTransportPolicyContract` and `RuntimeSafetyPolicyFlags`
types in `src/lib.rs`. They codify the Phase 4.0C stdout/stderr ownership,
JSONL framing, stderr diagnostics, redaction, backpressure, partial-write,
line-integrity, exit, and transcript replay policies as inactive pre-runtime
metadata. `is_pre_runtime_fail_closed()` verifies the disabled default. See
`docs/phase-4-0d-rust-host-transport-policy-contracts.md`.

Future live stdio work must make the Rust host the owner of process-level
stdout/stderr policy, buffering, flushing, backpressure, partial-write
handling, process exit semantics, redaction enforcement, and transport-failure
audit records before any runtime loop exists.
