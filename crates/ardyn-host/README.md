# ardyn-host

Rust host scaffold for ARDYN.

Phase 4.2A still exposes static Rust host identity, handshake data, policy-only
stdio transport contract metadata, deterministic review-only JSON export
helpers, static host-policy review-record helpers, and static host-policy
approval-record/operator-consent helpers plus static transport harness
contract helpers. Phase 4.1C adds TypeScript-side static framing/redaction
review helpers only, and Phase 4.1D adds TypeScript-side static transcript
persistence/replay contract helpers only. Phase 4.1E adds TypeScript-side
static failure-audit, terminal-state, cleanup/kill, and nonzero-exit mapping
contract helpers only. Phase 4.1I adds private `#[cfg(test)]` in-memory
Rust-host stdio test harness coverage plus documentation and report inventory.
Phase 4.1J adds fixture-backed stdio boundary fixtures and private Rust replay
tests plus documentation and report inventory; it does not add public Rust
harness APIs or public runtime contracts.
Phase 4.1K records approval-gated public Rust-host stdio runtime contract
gates as review-only contract metadata. It does not approve or enable runtime
implementation, own process stdio, add stdout/stderr writers, evaluate runtime
approval, enforce host policy at runtime, change CLI source, or record fresh
external or Devin review.
Phase 4.1L records runtime implementation-readiness design, blocker burn-down,
a deterministic readiness/checklist fixture, 4.2A handoff, and test-only Rust
design-facing checks. It does not add a live runtime module, own process stdio,
add stdout/stderr writers, add a stdin loop, evaluate runtime approval, enforce
host policy at runtime, change CLI source, or record fresh external or Devin
review.
Phase 4.2A adds an internal blocked Rust-host stdio runtime skeleton module,
blocked frame/gate planning helpers, unavailable entrypoint results, lifecycle
placeholders, and tests. It does not add a public runtime module, own process
stdio, add live stdout/stderr writers, add a stdin loop, evaluate runtime
approval, enforce host policy at runtime, change CLI source, or record fresh
external or Devin review.
None of these phases adds a Rust-host stdio ownership implementation. Rust
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

Phase 4.1H adds a static external review disposition record in docs, fixture
metadata, report inventory, and tests only. It records Devin's targeted-fix
disposition and the corrected Phase 4.1G SHA metadata evidence. It is not a
fresh Devin re-review and does not add Rust-host process stdio ownership, live
stdin reading, stdout/stderr writers, failure-audit runtime, cleanup runtime,
process killing, signal handling, timeout runtime, approval evaluation,
host-policy enforcement, runtime command enablement, review-disposition command
enablement, or runtime approval grant. See
`docs/phase-4-1h-external-review-disposition.md`.

Phase 4.1I adds a private `#[cfg(test)]` in-memory Rust-host stdio test harness
layer plus docs and report inventory. It is test infrastructure only, is not a
fresh Devin review, changes no production Rust runtime source, and does not add
Rust-host process stdio ownership, live stdin reading, stdout/stderr writers,
failure-audit runtime, cleanup runtime, process killing, signal handling,
timeout runtime, approval evaluation, host-policy enforcement, runtime command
enablement, harness command enablement, or runtime approval grant. See
`docs/phase-4-1i-rust-host-stdio-harness.md`.

Phase 4.1J adds fixture-backed Rust-host stdio boundary fixtures and private
Rust replay tests plus documentation and report inventory. It extends the
private Phase 4.1I in-memory harness coverage, but it is not runtime
readiness, is not a fresh external review, does not define a public runtime
contract, does not add public Rust harness APIs, and does not add Rust-host
process stdio ownership, live stdin reading, stdout/stderr writers,
failure-audit runtime, cleanup runtime, process killing, signal handling,
timeout runtime, approval evaluation, host-policy enforcement, runtime command
enablement, boundary command enablement, or runtime approval grant. See
`docs/phase-4-1j-fixture-backed-stdio-boundaries.md`.

Phase 4.1K adds approval-gated public Rust-host stdio runtime contract gates
plus documentation and report inventory. The public Rust contract surface is
contractual review metadata only: runtime implementation approval, runtime
enablement, process stdio ownership, stdin reading, stdout/stderr writing,
approval evaluation, active host-policy enforcement, CLI source changes,
runtime command enablement, contract-gate command enablement, fresh external
review, fresh Devin review, and runtime approval grants all remain blocked.
See `docs/phase-4-1k-stdio-runtime-contract-gates.md`.

Phase 4.1L adds runtime implementation-readiness documentation, a
deterministic readiness/checklist fixture, blocker burn-down, 4.2A handoff,
and `#[cfg(test)]` design-facing checks only. It permits planning the next
deliberately blocked Rust-host stdio runtime skeleton, but it does not add that
skeleton, a live stdin loop, live stdout/stderr writers, process control,
approval evaluation, CLI command enablement, fresh review, or runtime approval
grant. See `docs/phase-4-1l-runtime-implementation-readiness.md`.

Phase 4.2A adds the first internal Rust-host stdio runtime skeleton while
keeping runtime unavailable. The skeleton can classify and plan fixture-shaped
frames and gates in memory, but blocked entrypoints, blocked approval requests,
and blocked execution requests all return unavailable results with no stream,
process, adapter, or approval effect. See
`docs/phase-4-2a-deliberately-blocked-rust-host-stdio-runtime-skeleton.md`.

Future live stdio work must make the Rust host the owner of process-level
stdout/stderr policy, buffering, flushing, backpressure, partial-write
handling, process exit semantics, redaction enforcement, transcript
persistence/replay runtime behavior, and transport-failure audit records before
any runtime loop exists.
