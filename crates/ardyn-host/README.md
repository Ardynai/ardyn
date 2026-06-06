# ardyn-host

Rust host scaffold for ARDYN.

Phase 4.1G still exposes static Rust host identity, handshake data, policy-only
stdio transport contract metadata, deterministic review-only JSON export
helpers, static host-policy review-record helpers, and static host-policy
approval-record/operator-consent helpers plus static transport harness
contract helpers. Phase 4.1C adds TypeScript-side static framing/redaction
review helpers only, and Phase 4.1D adds TypeScript-side static transcript
persistence/replay contract helpers only. Phase 4.1E adds TypeScript-side
static failure-audit, terminal-state, cleanup/kill, and nonzero-exit mapping
contract helpers only. None of these phases adds a Rust-host stdio ownership
implementation. Rust
task planning, runtime
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

Phase 4.1C adds static stdout JSONL whole-line framing and stderr redaction
contracts in the TypeScript core, not a Rust-host runtime path. No live writer
exists, no process stdio ownership exists, and future runtime must use these
rules but is not implemented yet. See
`docs/phase-4-1c-framing-redaction-contracts.md`.

Phase 4.1D adds static transcript persistence and replay contracts in the
TypeScript core, not a Rust-host runtime path. No transcript persistence
runtime exists, no replay runtime exists, and `replay-session-transcript`
remains proposal-only and rejected. See
`docs/phase-4-1d-transcript-replay-contracts.md`.

Phase 4.1E adds static failure-audit, terminal-state, cleanup/kill, and
nonzero-exit mapping contracts in the TypeScript core, not a Rust-host runtime
path. No failure-audit runtime exists, no cleanup runtime exists, no process
killing exists, no signal handling runtime exists, no timeout runtime exists,
and failure-audit/cleanup/kill/runtime commands remain proposal-only and
rejected. See `docs/phase-4-1e-failure-audit-kill-semantics.md`.

Phase 4.1F adds a static runtime-readiness checkpoint in docs, fixture
metadata, report inventory, and tests only. It does not add Rust-host process
stdio ownership, live stdin reading, stdout/stderr writers, failure-audit
runtime, cleanup runtime, process killing, signal handling, timeout runtime,
approval evaluation, host-policy enforcement, runtime command enablement, or
runtime approval grant. See
`docs/phase-4-1f-runtime-readiness-checkpoint.md`.

Phase 4.1G adds a static external review packet in docs, fixture metadata,
report inventory, and tests only. It does not add Rust-host process stdio
ownership, live stdin reading, stdout/stderr writers, failure-audit runtime,
cleanup runtime, process killing, signal handling, timeout runtime, approval
evaluation, host-policy enforcement, runtime command enablement, review-packet
command enablement, or runtime approval grant. See
`docs/phase-4-1g-external-review-packet.md`.

Future live stdio work must make the Rust host the owner of process-level
stdout/stderr policy, buffering, flushing, backpressure, partial-write
handling, process exit semantics, redaction enforcement, transcript
persistence/replay runtime behavior, and transport-failure audit records before
any runtime loop exists.
