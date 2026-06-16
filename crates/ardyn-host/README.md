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
Phase 5.8 records runtime command-exposure approval cases only. It keeps
`stdio_runtime` private, grants no approval, implements no approval evaluator,
enables no runtime behavior, changes no Rust or CLI source, and records
missing, invalid, revoked, and valid-prerequisite-only command-exposure
approval cases. See
`docs/phase-5-8-runtime-command-exposure-approval.md`.
Phase 5.9 records approval evaluator/grant boundary cases only. It keeps
`stdio_runtime` private, grants no approval, implements or invokes no approval
evaluator, produces or persists no approval grant, enables no runtime behavior,
changes no Rust or CLI source, and records valid runtime approval plus valid
command-exposure approval as prerequisite-only signals. See
`docs/phase-5-9-approval-evaluator-grant-boundary.md`.
Phase 5.10 records runtime host-policy boundary cases only. It keeps
`stdio_runtime` private, grants no approval, implements or activates no
host-policy runtime enforcement, evaluates no runtime policy at execution time,
enables no runtime behavior, changes no Rust or CLI source, and records missing,
invalid, permissive/unbounded, and valid-restrictive-prerequisite-only
host-policy enforcement cases. See
`docs/phase-5-10-runtime-host-policy-boundary.md`.
Phase 5.11 records runtime stdio safety boundary cases only. It keeps
`stdio_runtime` private, grants no approval, implements no runtime I/O, opens no
live stdin loop, enables no runtime stdout/stderr writers, enables no runtime
behavior, changes no Rust or CLI source, and records missing, invalid,
unbounded, and valid-restrictive-prerequisite-only stdio safety cases. See
`docs/phase-5-11-runtime-stdio-safety-boundary.md`.
Phase 5.12 records runtime transcript/audit confinement boundary cases only. It
keeps `stdio_runtime` private, grants no approval, implements no runtime
transcript or audit writes, enables no runtime behavior, changes no Rust or CLI
source, and records missing, invalid, unbounded, and
valid-restrictive-prerequisite-only transcript/audit confinement cases. See
`docs/phase-5-12-runtime-transcript-audit-boundary.md`.
Phase 5.13 records runtime process-control boundary cases only. It keeps
`stdio_runtime` private, grants no approval, implements no process spawning,
termination, or runtime supervision, enables no runtime behavior, changes no
Rust or CLI source, and records missing, invalid, unbounded, and
valid-restrictive-prerequisite-only process-control cases. See
`docs/phase-5-13-runtime-process-control-boundary.md`.
Phase 5.14 records runtime rollback/kill-switch boundary cases only. It keeps
`stdio_runtime` private, grants no approval, implements no runtime shutdown,
runtime rollback, kill-switch activation, process termination, or runtime
supervision, enables no runtime behavior, changes no Rust or CLI source, and
records missing, invalid, non-deterministic/manual-only, and
valid-restrictive-prerequisite-only rollback/kill-switch cases. See
`docs/phase-5-14-runtime-rollback-kill-switch-boundary.md`.
Phase 5.15 records positive runtime smoke requirement cases only. It keeps
`stdio_runtime` private, grants no approval, implements no runtime smoke
execution, live stdin loop, runtime stdout/stderr writer, process spawning,
process supervision, or runtime transcript/audit write, enables no runtime
behavior, changes no Rust or CLI source, and records missing, invalid,
non-guarded/non-deterministic, and valid-prerequisite-only positive runtime
smoke cases. See `docs/phase-5-15-positive-runtime-smoke-requirement.md`.
Phase 5.16 records a runtime enablement readiness checkpoint only. It keeps
`stdio_runtime` private, grants no approval, implements no approval evaluator
or grant, host-policy runtime enforcement, stdio safety, transcript/audit
confinement, process-control boundary, rollback/kill-switch boundary, positive
runtime smoke coverage, or live runtime behavior, enables no runtime behavior,
and changes no Rust or CLI source. See
`docs/phase-5-16-runtime-enable-readiness-checkpoint.md`.
Phase 5.17 records a guarded runtime implementation plan only. It keeps
`stdio_runtime` private, grants no approval, implements no approval evaluator
or grant, host-policy runtime enforcement, stdio safety, transcript/audit
confinement, process-control boundary, rollback/kill-switch boundary, positive
runtime smoke coverage, runtime entrypoint, or live runtime behavior, enables no
runtime behavior, and changes no Rust or CLI source. See
`docs/phase-5-17-guarded-runtime-implementation-plan.md`.
Phase 5.18 records a review-only approval evaluator skeleton in TypeScript core
only. It keeps `stdio_runtime` private, grants no approval, produces no
approval grant, implements no authoritative evaluator, enables no runtime
behavior, changes no Rust or CLI source, and records prerequisite approval
classification as review metadata only. See
`docs/phase-5-18-review-only-approval-evaluator-skeleton.md`.
Phase 5.19 records approval prerequisite reader hardening in TypeScript core
only. It keeps `stdio_runtime` private, grants no approval, produces no
approval grant, implements no authoritative evaluator, enables no runtime
behavior, changes no Rust or CLI source, and records missing, malformed,
revoked, valid, duplicate, stale, and unknown prerequisite records as review
metadata only. See
`docs/phase-5-19-approval-prerequisite-reader-hardening.md`.
Phase 5.20 records approval prerequisite source ingestion preflight in
TypeScript core only. It keeps `stdio_runtime` private, grants no approval,
produces no approval grant, implements no source watcher, external lookup,
secrets/env ingestion, authoritative evaluator, or runtime behavior, changes no
Rust or CLI source, and records missing, malformed, empty, duplicate, stale,
unknown, revoked, and valid in-memory source inputs as review metadata only.
See
`docs/phase-5-20-approval-prerequisite-source-ingestion-preflight.md`.
Phase 5.21 records approval prerequisite source selection in TypeScript core
only. It keeps `stdio_runtime` private, grants no approval, produces no
approval grant, implements no source watcher, external lookup, secrets/env
ingestion, authoritative evaluator, source-selection command, or runtime
behavior, changes no Rust or CLI source, and records missing, multiple valid,
duplicate equivalent, conflicting valid, stale, revoked, unknown, malformed,
and empty in-memory source selection cases as review metadata only. See
`docs/phase-5-21-approval-prerequisite-source-selection.md`.
Phase 5.22 records approval prerequisite source bundling in TypeScript core
only. It keeps `stdio_runtime` private, grants no approval, produces no
approval grant, implements no source watcher, external lookup, secrets/env
ingestion, authoritative evaluator, source-bundle command, or runtime behavior,
changes no Rust or CLI source, and records missing required bundle parts,
malformed bundle parts, duplicate equivalent bundle parts, conflicting bundle
parts, and stale, revoked, unknown, malformed, and empty in-memory source cases
as review metadata only. See
`docs/phase-5-22-approval-prerequisite-source-bundle.md`.
Phase 5.23 records prerequisite bundle consumption checkpointing in TypeScript
core only. It keeps `stdio_runtime` private, grants no approval, produces no
approval grant, implements no source watcher, external lookup, secrets/env
ingestion, authoritative evaluator, bundle-consumption command, or runtime
behavior, changes no Rust or CLI source, and records missing, malformed,
conflicting, and valid in-memory bundle consumption cases as review metadata
only. See
`docs/phase-5-23-prerequisite-bundle-consumption-checkpoint.md`.
Phase 5.24 records prerequisite evaluation integration checkpointing in
TypeScript core only. It keeps `stdio_runtime` private, grants no approval,
produces no approval grant, implements no source watcher, external lookup,
secrets/env ingestion, authoritative evaluator, integration-checkpoint command,
or runtime behavior, changes no Rust or CLI source, and records missing,
malformed, empty, conflicting, stale, revoked, unknown, duplicate, and valid
in-memory prerequisite pipeline cases as review metadata only. See
`docs/phase-5-24-prerequisite-evaluation-integration-checkpoint.md`.

Phase 5.25 records non-authorizing review artifact boundary metadata in
TypeScript core only. It keeps `stdio_runtime` private, grants no approval,
produces or persists no approval grant, implements no source watcher, external
lookup, secrets/env ingestion, authoritative evaluator,
review-artifact-boundary command, runtime permission, command exposure, or
runtime behavior, changes no Rust or CLI source, and records missing,
malformed, empty, conflicting, stale, revoked, unknown, duplicate-invalid, and
valid in-memory prerequisite boundary cases as review metadata only. See
`docs/phase-5-25-non-authorizing-review-artifact-boundary.md`.

Phase 5.26 records review artifact evaluator-input handoff metadata in
TypeScript core only. It keeps `stdio_runtime` private, grants no approval,
produces or persists no approval grant, implements no source watcher, external
lookup, secrets/env ingestion, authoritative evaluator, evaluator-input
handoff command, runtime permission, command exposure permission, or runtime
behavior, changes no Rust or CLI source, and records missing, malformed, empty,
conflicting, stale, revoked, unknown, duplicate-invalid, authorizing-looking,
and valid in-memory review artifact handoff cases as review metadata only. See
`docs/phase-5-26-review-artifact-evaluator-input-handoff.md`.

Phase 5.27 records approval-evaluator candidate intake checkpoint metadata in
TypeScript core only. It keeps `stdio_runtime` private, grants no approval,
produces or persists no approval grant, implements no source watcher, external
lookup, secrets/env ingestion, authoritative evaluator, candidate intake
command, runtime permission, command exposure permission, or runtime behavior,
changes no Rust or CLI source, and records missing, malformed, empty,
conflicting, stale, revoked, unknown, duplicate-invalid, authorizing-looking,
runtime-effect-true, process-flag-true, unsafe, and valid in-memory candidate
intake cases as review metadata only. See
`docs/phase-5-27-approval-evaluator-candidate-intake-checkpoint.md`.

Phase 5.28 records review-only evaluator preflight checkpoint metadata in
TypeScript core only. It keeps `stdio_runtime` private, grants no approval,
produces or persists no approval grant, implements no source watcher, external
lookup, secrets/env ingestion, authoritative evaluator, evaluator execution
path, preflight command, runtime permission, command exposure permission, or
runtime behavior, changes no Rust or CLI source, and records missing,
malformed, empty, conflicting, stale, revoked, unknown, duplicate-invalid,
authorizing-looking, grant-looking, runtime-permission-looking,
command-exposure-looking, runtime-effect-true, process-flag-true, unsafe,
execution-signal-looking, and valid in-memory preflight cases as review
metadata only. See
`docs/phase-5-28-review-only-evaluator-preflight-checkpoint.md`.

Phase 5.29 records non-authorizing evaluator decision-candidate boundary
metadata in TypeScript core only. It keeps `stdio_runtime` private, executes no
evaluator, produces no approval decision, produces or persists no approval
grant, implements no source watcher, external lookup, secrets/env ingestion,
authoritative evaluator, evaluator execution path, decision-candidate command,
runtime permission, command exposure permission, or runtime behavior, changes
no Rust or CLI source, and records missing, malformed, invalid timestamp,
empty, conflicting, stale, revoked, unknown, duplicate-invalid,
authorizing-looking, grant-looking, approval-decision-looking,
approval-grant-looking, runtime-permission-looking, command-exposure-looking,
evaluator-execution-looking, runtime-effect-true, process-flag-true, unsafe,
execution-signal-looking, and valid in-memory decision-candidate cases as
review metadata only. See
`docs/phase-5-29-non-authorizing-evaluator-decision-candidate-boundary.md`.

Phase 5.30 records non-authorizing evaluator decision-candidate inspection
artifact metadata in TypeScript core only. It keeps `stdio_runtime` private,
executes no evaluator, produces no evaluator result, produces no approval
decision, produces or persists no approval grant, implements no source watcher,
external lookup, secrets/env ingestion, authoritative evaluator,
inspection-artifact command, runtime permission, command exposure permission,
or runtime behavior, changes no Rust or CLI source, and records missing,
malformed, invalid timestamp, empty, conflicting, stale, revoked, unknown,
duplicate-invalid, authorizing-looking, grant-looking,
approval-decision-looking, approval-grant-looking, runtime-permission-looking,
command-exposure-looking, evaluator-execution-looking,
evaluator-result-looking, runtime-effect-true, process-flag-true, unsafe,
execution-signal-looking, and valid in-memory inspection cases as review
metadata only. See
`docs/phase-5-30-non-authorizing-evaluator-decision-candidate-inspection-artifact.md`.

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

Phase 5.8 adds no Rust-host runtime implementation. It records a
machine-readable runtime command-exposure approval contract for missing,
invalid, revoked, and valid-prerequisite-only command-exposure approval cases.
Runtime remains disabled, valid command-exposure approval cannot start runtime
or expose runtime execution, `stdio_runtime` remains private, and no Rust source
changes are made. See
`docs/phase-5-8-runtime-command-exposure-approval.md`.

Phase 5.9 adds no Rust-host runtime implementation. It records a
machine-readable approval evaluator/grant boundary contract proving valid
runtime approval and valid command-exposure approval remain prerequisite-only.
No approval evaluator is implemented or invoked, no approval grant is produced
or persisted, runtime remains disabled, `stdio_runtime` remains private, and no
Rust source changes are made. See
`docs/phase-5-9-approval-evaluator-grant-boundary.md`.

Phase 5.10 adds no Rust-host runtime implementation. It records a
machine-readable host-policy enforcement boundary contract proving missing,
invalid, and permissive/unbounded enforcement are rejected while valid
restrictive host-policy enforcement remains prerequisite-only. No host-policy
runtime enforcement is implemented or activated, runtime remains disabled,
`stdio_runtime` remains private, and no Rust source changes are made. See
`docs/phase-5-10-runtime-host-policy-boundary.md`.

Phase 5.11 adds no Rust-host runtime implementation. It records a
machine-readable stdio safety boundary contract proving missing, invalid, and
unbounded stdin/stdout/stderr behavior are rejected while valid restrictive
stdio safety remains prerequisite-only. No runtime I/O is implemented, runtime
remains disabled, `stdio_runtime` remains private, and no Rust source changes
are made. See `docs/phase-5-11-runtime-stdio-safety-boundary.md`.

Phase 5.12 adds no Rust-host runtime implementation. It records a
machine-readable transcript/audit confinement boundary contract proving missing,
invalid, and unbounded runtime transcript/audit writes are rejected while valid
restrictive transcript/audit confinement remains prerequisite-only. No runtime
transcript or audit writes are implemented, runtime remains disabled,
`stdio_runtime` remains private, and no Rust source changes are made. See
`docs/phase-5-12-runtime-transcript-audit-boundary.md`.

Phase 5.13 adds no Rust-host runtime implementation. It records a
machine-readable process-control boundary contract proving missing, invalid,
and unbounded process spawning, termination, or supervision are rejected while
valid restrictive process control remains prerequisite-only. No process
spawning, process termination, or runtime supervision is implemented, runtime
remains disabled, `stdio_runtime` remains private, and no Rust source changes
are made. See `docs/phase-5-13-runtime-process-control-boundary.md`.

Phase 5.14 adds no Rust-host runtime implementation. It records a
machine-readable rollback/kill-switch boundary contract proving missing,
invalid, and non-deterministic or manual-only rollback is rejected while valid
restrictive rollback/kill-switch policy remains prerequisite-only. No runtime
shutdown, runtime rollback, kill-switch activation, process termination, or
runtime supervision is implemented, runtime remains disabled, `stdio_runtime`
remains private, and no Rust source changes are made. See
`docs/phase-5-14-runtime-rollback-kill-switch-boundary.md`.

Phase 5.15 adds no Rust-host runtime implementation. It records a
machine-readable positive runtime smoke requirement contract proving missing,
invalid, and non-guarded or non-deterministic runtime smoke coverage is rejected
while valid positive runtime smoke coverage remains prerequisite-only. No
runtime smoke execution, live stdin loop, runtime stdout/stderr writer, process
spawning, process supervision, or runtime transcript/audit write is
implemented, runtime remains disabled, `stdio_runtime` remains private, and no
Rust source changes are made. See
`docs/phase-5-15-positive-runtime-smoke-requirement.md`.

Phase 5.16 adds no Rust-host runtime implementation. It records a
machine-readable runtime enablement readiness checkpoint proving the Phase 5.6
through Phase 5.15 preconditions are represented as contracts, but none are
implemented as live runtime behavior. No approval evaluator or grant,
host-policy runtime enforcement, stdio safety, transcript/audit confinement,
process control, rollback/kill-switch behavior, positive runtime smoke
execution, live stdin loop, runtime stdout/stderr writer, process spawning,
process supervision, runtime transcript/audit write, adapter/Fabric behavior,
or WebSocket/HTTP surface is implemented. Runtime remains disabled,
`stdio_runtime` remains private, and no Rust source changes are made. See
`docs/phase-5-16-runtime-enable-readiness-checkpoint.md`.

Phase 5.17 adds no Rust-host runtime implementation. It records a
machine-readable guarded runtime implementation plan for future slices, but all
steps are planned-only. No approval evaluator or grant, host-policy runtime
enforcement, stdio safety, transcript/audit confinement, process control,
rollback/kill-switch behavior, positive runtime smoke execution, runtime
entrypoint, live stdin loop, runtime stdout/stderr writer, process spawning,
process supervision, runtime transcript/audit write, adapter/Fabric behavior,
or WebSocket/HTTP surface is implemented. Runtime remains disabled,
`stdio_runtime` remains private, and no Rust source changes are made. See
`docs/phase-5-17-guarded-runtime-implementation-plan.md`.

Phase 5.18 adds no Rust-host runtime implementation. It records a
machine-readable review-only approval evaluator skeleton in TypeScript core and
keeps the Rust host private and fail-closed. No authoritative approval
evaluator, approval grant, host-policy runtime enforcement, runtime I/O,
process control, rollback/kill-switch behavior, positive runtime smoke
execution, runtime entrypoint, live stdin loop, runtime stdout/stderr writer,
process spawning, process supervision, runtime transcript/audit write,
adapter/Fabric behavior, or WebSocket/HTTP surface is implemented. Runtime
remains disabled, `stdio_runtime` remains private, and no Rust source changes
are made. See
`docs/phase-5-18-review-only-approval-evaluator-skeleton.md`.

Phase 5.19 adds no Rust-host runtime implementation. It records a
machine-readable approval prerequisite reader hardening layer in TypeScript core
and keeps the Rust host private and fail-closed. No authoritative approval
evaluator, approval grant, host-policy runtime enforcement, runtime I/O,
process control, rollback/kill-switch behavior, positive runtime smoke
execution, runtime entrypoint, live stdin loop, runtime stdout/stderr writer,
process spawning, process supervision, runtime transcript/audit write,
adapter/Fabric behavior, or WebSocket/HTTP surface is implemented. Runtime
remains disabled, `stdio_runtime` remains private, and no Rust source changes
are made. See
`docs/phase-5-19-approval-prerequisite-reader-hardening.md`.

Phase 5.20 adds no Rust-host runtime implementation. It records a
machine-readable approval prerequisite source ingestion preflight layer in
TypeScript core and keeps the Rust host private and fail-closed. No filesystem
watcher, external source lookup, secrets/env ingestion, authoritative approval
evaluator, approval grant, host-policy runtime enforcement, runtime I/O,
process control, rollback/kill-switch behavior, positive runtime smoke
execution, runtime entrypoint, live stdin loop, runtime stdout/stderr writer,
process spawning, process supervision, runtime transcript/audit write,
adapter/Fabric behavior, or WebSocket/HTTP surface is implemented. Runtime
remains disabled, `stdio_runtime` remains private, and no Rust source changes
are made. See
`docs/phase-5-20-approval-prerequisite-source-ingestion-preflight.md`.

Phase 5.21 adds no Rust-host runtime implementation. It records a
machine-readable approval prerequisite source selection layer in TypeScript core
and keeps the Rust host private and fail-closed. No filesystem watcher,
external source lookup, secrets/env ingestion, source-selection command,
authoritative approval evaluator, approval grant, host-policy runtime
enforcement, runtime I/O, process control, rollback/kill-switch behavior,
positive runtime smoke execution, runtime entrypoint, live stdin loop, runtime
stdout/stderr writer, process spawning, process supervision, runtime
transcript/audit write, adapter/Fabric behavior, or WebSocket/HTTP surface is
implemented. Runtime remains disabled, `stdio_runtime` remains private, and no
Rust source changes are made. See
`docs/phase-5-21-approval-prerequisite-source-selection.md`.

Phase 5.22 adds no Rust-host runtime implementation. It records a
machine-readable approval prerequisite source bundle layer in TypeScript core
and keeps the Rust host private and fail-closed. No filesystem watcher,
external source lookup, secrets/env ingestion, source-bundle command,
authoritative approval evaluator, approval grant, host-policy runtime
enforcement, runtime I/O, process control, rollback/kill-switch behavior,
positive runtime smoke execution, runtime entrypoint, live stdin loop, runtime
stdout/stderr writer, process spawning, process supervision, runtime
transcript/audit write, adapter/Fabric behavior, or WebSocket/HTTP surface is
implemented. Runtime remains disabled, `stdio_runtime` remains private, and no
Rust source changes are made. See
`docs/phase-5-22-approval-prerequisite-source-bundle.md`.

Phase 5.23 adds no Rust-host runtime implementation. It records a
machine-readable prerequisite bundle consumption checkpoint layer in TypeScript
core and keeps the Rust host private and fail-closed. No filesystem watcher,
external source lookup, secrets/env ingestion, bundle-consumption command,
authoritative approval evaluator, approval grant, host-policy runtime
enforcement, runtime I/O, process control, rollback/kill-switch behavior,
positive runtime smoke execution, runtime entrypoint, live stdin loop, runtime
stdout/stderr writer, process spawning, process supervision, runtime
transcript/audit write, adapter/Fabric behavior, or WebSocket/HTTP surface is
implemented. Runtime remains disabled, `stdio_runtime` remains private, and no
Rust source changes are made. See
`docs/phase-5-23-prerequisite-bundle-consumption-checkpoint.md`.

Phase 5.24 adds no Rust-host runtime implementation. It records a
machine-readable prerequisite evaluation integration checkpoint layer in
TypeScript core and keeps the Rust host private and fail-closed. No filesystem
watcher, external source lookup, secrets/env ingestion, integration-checkpoint
command, authoritative approval evaluator, approval grant, host-policy runtime
enforcement, runtime I/O, process control, rollback/kill-switch behavior,
positive runtime smoke execution, runtime entrypoint, live stdin loop, runtime
stdout/stderr writer, process spawning, process supervision, runtime
transcript/audit write, adapter/Fabric behavior, or WebSocket/HTTP surface is
implemented. Runtime remains disabled, `stdio_runtime` remains private, and no
Rust source changes are made. See
`docs/phase-5-24-prerequisite-evaluation-integration-checkpoint.md`.

Phase 5.25 adds no Rust-host runtime implementation. It records a
machine-readable non-authorizing review artifact boundary layer in TypeScript
core and keeps the Rust host private and fail-closed. No filesystem watcher,
external source lookup, secrets/env ingestion, review-artifact-boundary command,
runtime permission, command exposure, authoritative approval evaluator, approval
grant, host-policy runtime enforcement, runtime I/O, process control,
rollback/kill-switch behavior, positive runtime smoke execution, runtime
entrypoint, live stdin loop, runtime stdout/stderr writer, process spawning,
process supervision, runtime transcript/audit write, adapter/Fabric behavior,
or WebSocket/HTTP surface is implemented. Runtime remains disabled,
`stdio_runtime` remains private, and no Rust source changes are made. See
`docs/phase-5-25-non-authorizing-review-artifact-boundary.md`.

Phase 5.26 adds no Rust-host runtime implementation. It records a
machine-readable review artifact evaluator-input handoff layer in TypeScript
core and keeps the Rust host private and fail-closed. No filesystem watcher,
external source lookup, secrets/env ingestion, evaluator-input handoff command,
runtime permission, command exposure permission, authoritative approval
evaluator, approval grant, host-policy runtime enforcement, runtime I/O,
process control, rollback/kill-switch behavior, positive runtime smoke
execution, runtime entrypoint, live stdin loop, runtime stdout/stderr writer,
process spawning, process supervision, runtime transcript/audit write,
adapter/Fabric behavior, or WebSocket/HTTP surface is implemented. Runtime
remains disabled, `stdio_runtime` remains private, and no Rust source changes
are made. See
`docs/phase-5-26-review-artifact-evaluator-input-handoff.md`.

Phase 5.27 adds no Rust-host runtime implementation. It records a
machine-readable approval-evaluator candidate intake checkpoint layer in
TypeScript core and keeps the Rust host private and fail-closed. No filesystem
watcher, external source lookup, secrets/env ingestion, candidate intake
command, runtime permission, command exposure permission, authoritative
approval evaluator, approval grant, host-policy runtime enforcement, runtime
I/O, process control, rollback/kill-switch behavior, positive runtime smoke
execution, runtime entrypoint, live stdin loop, runtime stdout/stderr writer,
process spawning, process supervision, runtime transcript/audit write,
adapter/Fabric behavior, or WebSocket/HTTP surface is implemented. Runtime
remains disabled, `stdio_runtime` remains private, and no Rust source changes
are made. See
`docs/phase-5-27-approval-evaluator-candidate-intake-checkpoint.md`.

Phase 5.28 adds no Rust-host runtime implementation. It records a
machine-readable review-only evaluator preflight checkpoint layer in TypeScript
core and keeps the Rust host private and fail-closed. No filesystem watcher,
external source lookup, secrets/env ingestion, evaluator preflight command,
runtime permission, command exposure permission, authoritative approval
evaluator, evaluator execution, approval grant, host-policy runtime
enforcement, runtime I/O, process control, rollback/kill-switch behavior,
positive runtime smoke execution, runtime entrypoint, live stdin loop, runtime
stdout/stderr writer, process spawning, process supervision, runtime
transcript/audit write, adapter/Fabric behavior, or WebSocket/HTTP surface is
implemented. Runtime remains disabled, `stdio_runtime` remains private, and no
Rust source changes are made. See
`docs/phase-5-28-review-only-evaluator-preflight-checkpoint.md`.

Phase 5.29 adds no Rust-host runtime implementation. It records a
machine-readable non-authorizing evaluator decision-candidate boundary layer in
TypeScript core and keeps the Rust host private and fail-closed. No filesystem
watcher, external source lookup, secrets/env ingestion, evaluator decision
command, approval decision, approval grant, runtime permission, command
exposure permission, authoritative approval evaluator, evaluator execution,
host-policy runtime enforcement, runtime I/O, process control,
rollback/kill-switch behavior, positive runtime smoke execution, runtime
entrypoint, live stdin loop, runtime stdout/stderr writer, process spawning,
process supervision, runtime transcript/audit write, adapter/Fabric behavior,
or WebSocket/HTTP surface is implemented. Runtime remains disabled,
`stdio_runtime` remains private, and no Rust source changes are made. See
`docs/phase-5-29-non-authorizing-evaluator-decision-candidate-boundary.md`.

Phase 5.30 adds no Rust-host runtime implementation. It records a
machine-readable non-authorizing evaluator decision-candidate inspection
artifact layer in TypeScript core and keeps the Rust host private and
fail-closed. No filesystem watcher, external source lookup, secrets/env
ingestion, evaluator result command, approval decision, approval grant, runtime
permission, command exposure permission, authoritative approval evaluator,
evaluator execution, host-policy runtime enforcement, runtime I/O, process
control, rollback/kill-switch behavior, positive runtime smoke execution,
runtime entrypoint, live stdin loop, runtime stdout/stderr writer, process
spawning, process supervision, runtime transcript/audit write, adapter/Fabric
behavior, or WebSocket/HTTP surface is implemented. Runtime remains disabled,
`stdio_runtime` remains private, and no Rust source changes are made. See
`docs/phase-5-30-non-authorizing-evaluator-decision-candidate-inspection-artifact.md`.

Future live stdio work must make the Rust host the owner of process-level
stdout/stderr policy, buffering, flushing, backpressure, partial-write
handling, process exit semantics, redaction enforcement, transcript
persistence/replay runtime behavior, and transport-failure audit records before
any runtime loop exists.
