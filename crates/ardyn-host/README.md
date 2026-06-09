# ardyn-host

Rust host scaffold for ARDYN.

Phase 5.1 still exposes static Rust host identity, handshake data, policy-only
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
Phase 4.2B extends that private module with blocked lifecycle, transcript-plan,
failure-audit, and kill-semantics planning helpers and tests. It does not
spawn, kill, signal, poll, wait on, or manage child processes; write
transcripts or audit files; change CLI source; approve runtime; or record
fresh external, Devin, or Jules review.
Phase 4.2C adds a runtime readiness review gate, Jules/Devin packet, blocker
burn-down, external-review status rules, and a compile-fail public-boundary
doctest. It keeps `stdio_runtime` private, records no fresh external, Devin,
or Jules review, grants no runtime approval, and enables no runtime behavior.
Phase 4.2D records Jules's post-merge Phase 4.2C `APPROVE` verdict as
external-review disposition only and creates a Phase 5.1 approval-record/design
handoff. It keeps `stdio_runtime` private, grants no runtime implementation
approval or command-surface approval, changes no CLI source, and enables no
runtime behavior.
Phase 5.1 records approval to proceed with a separate future controlled runtime
implementation phase only. It does not enable runtime, expose runtime commands,
add stdout/stderr writers, add process control, add transcript/audit write side
effects, change `apps/cli/src/index.mjs`, or alter adapter/Fabric runtime
behavior.
Phase 5.2 adds private guarded-runtime implementation helpers inside the
already-private Rust-host stdio runtime module: bounded in-memory loop
planning, planned-only redacted writer data, and fixture-only approval-boundary
planning. It still performs no live stdin reads, no live stdout/stderr writes,
no process control, no transcript/audit file writes, no approval grant or
evaluator, no CLI integration, and no adapter/Fabric runtime behavior. See
`docs/phase-5-2-guarded-runtime-implementation-slice.md`.
Phase 5.3 records command-surface approval preflight docs/status metadata only.
It does not expose Rust-host runtime commands, publish `stdio_runtime`, grant
approval, enable runtime behavior, change CLI source, add stdout/stderr
writers, add process control, write transcripts or audit files, or call
adapters/Fabric runtime behavior. See
`docs/phase-5-3-command-surface-approval-preflight.md`.
Phase 5.4 records disabled command exposure plan docs/status metadata only. It
does not expose Rust-host runtime commands, publish `stdio_runtime`, grant
approval, enable runtime behavior, change CLI source, change Rust source, add
stdout/stderr writers, add process control, write transcripts or audit files,
or call adapters/Fabric runtime behavior. See
`docs/phase-5-4-disabled-command-exposure-plan.md`.
Phase 5.4A records Jules's Phase 5.4 `APPROVE` review disposition only. It
does not expose Rust-host runtime commands, publish `stdio_runtime`, grant
approval, enable runtime behavior, change CLI source, change file modes, change
Rust source, add stdout/stderr writers, add process control, write transcripts
or audit files, or call adapters/Fabric runtime behavior. Current `main`
already tracks `apps/cli/src/index.mjs` as mode `100644`. See
`docs/phase-5-4a-jules-review-disposition.md`.
Phase 5.5 adds default-blocked CLI recognition for `serve-runtime` only. It
does not expose Rust-host runtime commands, publish `stdio_runtime`, grant
approval, enable runtime behavior, change Rust source, add stdout/stderr
writers, add process control, write transcripts or audit files, or call
adapters/Fabric runtime behavior. See
`docs/phase-5-5-default-blocked-runtime-cli.md`.
Phase 5.6 records runtime enablement preconditions only. It keeps
`stdio_runtime` private, grants no approval, enables no runtime behavior,
changes no Rust or CLI source, and records approval, host-policy, stdio safety,
transcript/audit confinement, process-control, rollback/kill-switch, and
positive runtime smoke requirements as blocked and unsatisfied. See
`docs/phase-5-6-runtime-enable-preconditions.md`.
Phase 5.7 records runtime approval validation cases only. It keeps
`stdio_runtime` private, grants no approval, implements no approval evaluator,
enables no runtime behavior, changes no Rust or CLI source, and records missing,
invalid, revoked, and valid-prerequisite-only approval cases. See
`docs/phase-5-7-runtime-approval-validation.md`.
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

Phase 4.2B adds planned-only lifecycle, transcript-plan, failure-audit, and
kill-semantics helpers inside the same private module. Start, stop, kill, and
execute requests all return blocked/unavailable data with no process identity,
process control, transcript writes, or failure-audit writes. See
`docs/phase-4-2b-blocked-lifecycle-failure-audit-skeleton.md`.

Phase 4.2C adds no Rust-host runtime implementation. It records the readiness
gate, Jules/Devin packet, blocker burn-down, and external-review status rules,
and it pins that `stdio_runtime` remains private. See
`docs/phase-4-2c-runtime-readiness-review-gate.md`.

Phase 4.2D adds no Rust-host runtime implementation. It records Jules's
post-merge `APPROVE` disposition for Phase 4.2C and hands off Phase 5.1 as an
approval-record/design gate only. Runtime implementation approval,
command-surface approval, process control, stdout/stderr writers, transcript
writes, failure-audit writes, and CLI runtime commands remain blocked. See
`docs/phase-4-2d-external-review-disposition-phase5-handoff.md` and
`docs/phase-5-1-controlled-runtime-implementation-approval-handoff.md`.

Phase 5.1 adds no Rust-host runtime implementation. It records approval to
proceed with a separate future controlled implementation phase only; all
runtime enablement flags remain false, and runtime command exposure,
process-level stdio ownership, stdout/stderr writers, process control,
transcript writes, failure-audit writes, adapter runtime behavior, and Content
Fabric runtime behavior remain blocked. See
`docs/phase-5-1-controlled-runtime-implementation-approval-handoff.md`.

Phase 5.2 starts the controlled implementation slice as private guarded
planning code only. `stdio_runtime` remains private, and its bounded loop,
redacted writer, and approval-boundary helpers consume only in-memory fixtures
and return blocked/unavailable plans. They do not read process stdin, write
process stdout/stderr, spawn or control child processes, persist transcripts or
audit files, evaluate/grant approval, expose CLI commands, or call adapters or
Content Fabric runtime behavior. See
`docs/phase-5-2-guarded-runtime-implementation-slice.md`.

Phase 5.3 adds no Rust-host runtime implementation. It records command-surface
approval preflight documentation and report metadata only; `stdio_runtime`
remains private, runtime command exposure remains blocked, and stdout/stderr
writers, process control, transcript writes, failure-audit writes, adapter
runtime behavior, and Content Fabric runtime behavior remain disabled. See
`docs/phase-5-3-command-surface-approval-preflight.md`.

Phase 5.4 adds no Rust-host runtime implementation. It records disabled command
exposure plan documentation and report metadata only; `stdio_runtime` remains
private, runtime command exposure remains blocked, and stdout/stderr writers,
process control, transcript writes, failure-audit writes, adapter runtime
behavior, Content Fabric runtime behavior, and Rust source changes remain
disabled. See `docs/phase-5-4-disabled-command-exposure-plan.md`.

Phase 5.4A adds no Rust-host runtime implementation. It records Jules's Phase
5.4 `APPROVE` review disposition only; `stdio_runtime` remains private, runtime
command exposure remains blocked, and stdout/stderr writers, process control,
transcript writes, failure-audit writes, adapter runtime behavior, Content
Fabric runtime behavior, Rust source changes, CLI content changes, and chmod
changes remain disabled. See `docs/phase-5-4a-jules-review-disposition.md`.

Phase 5.5 adds no Rust-host runtime implementation. It recognizes
`serve-runtime` in the CLI only to return a default-blocked runtime-unavailable
failure. `stdio_runtime` remains private, runtime execution remains blocked,
and stdout/stderr writers, process control, transcript writes, failure-audit
writes, adapter runtime behavior, Content Fabric runtime behavior, WebSocket or
HTTP runtime surfaces, and Rust source changes remain disabled. See
`docs/phase-5-5-default-blocked-runtime-cli.md`.

Phase 5.6 adds no Rust-host runtime implementation. It records a
machine-readable precondition gate for future runtime enablement and keeps all
preconditions blocked: approval, host-policy enforcement, stdio safety,
transcript/audit confinement, process-control boundaries, rollback/kill-switch,
and positive runtime smokes. Runtime remains disabled, `stdio_runtime` remains
private, and no Rust source changes are made. See
`docs/phase-5-6-runtime-enable-preconditions.md`.

Phase 5.7 adds no Rust-host runtime implementation. It records a
machine-readable runtime approval validation contract for missing, invalid,
revoked, and valid-prerequisite-only approval cases. Runtime remains disabled,
valid approval cannot start runtime, `stdio_runtime` remains private, and no
Rust source changes are made. See
`docs/phase-5-7-runtime-approval-validation.md`.

Future live stdio work must make the Rust host the owner of process-level
stdout/stderr policy, buffering, flushing, backpressure, partial-write
handling, process exit semantics, redaction enforcement, transcript
persistence/replay runtime behavior, and transport-failure audit records before
any runtime loop exists.
