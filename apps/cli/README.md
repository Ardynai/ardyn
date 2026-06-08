# @ardyn/cli

CLI app scaffold for ARDYN.

Phase 5.4A exposes the same command set as Phase 4.0B, Phase 4.0C, Phase
4.0D, Phase 4.0E, Phase 4.0F, Phase 4.0G, Phase 4.0H, Phase 4.0I, Phase
4.1/4.1A/4.1B/4.1C/4.1D/4.1E, Phase 4.1F, Phase 4.1G, Phase 4.1H, and
Phase 4.1I, Phase 4.1J, Phase 4.1K, Phase 4.1L, Phase 4.2A, Phase 4.2B,
Phase 4.2C, and Phase 4.2D:
`doctor`, `identity`, `capabilities`, `plan`, `review-artifact`,
`review-trace`, `validate-session-transcript`, dry-run `serve`, and dry-run
`emit-session-events`. Phase 4.2C adds readiness-gate metadata, a Jules/Devin
review packet, blocker burn-down, external-review status rules, tests, docs,
and report inventory only. Phase 4.2D records Jules's post-merge Phase 4.2C
`APPROVE` verdict as external-review disposition plus a Phase 5.1 handoff only;
it does not add a runtime-implementation-readiness CLI command, 4.2A
runtime-skeleton CLI command, 4.2B lifecycle CLI command, 4.2C readiness-gate
CLI command, 4.2D disposition CLI command, Phase 5.1 handoff CLI command,
runtime implementation approval CLI command, runtime command-surface review CLI
command, external-review completion CLI command,
rust-host-stdio-harness CLI command, stdio-harness CLI command, runtime-harness
CLI command, fixture-backed-stdio-boundary CLI command, stdio-boundary CLI
command, public-runtime-contract CLI command, runtime-contract-gates CLI
command, stdio-runtime-contract CLI command, review-disposition CLI command,
review-packet CLI command, runtime-readiness CLI command, checkpoint CLI
command, failure-audit CLI command, cleanup CLI command, kill CLI command,
process-control CLI command, signal-handler CLI command, exit-handler CLI
command, transcript persistence CLI command, replay CLI command,
framing/redaction CLI command, transport harness CLI command, approval-record
CLI command, operator-consent CLI command, `approve-runtime-implementation`,
`approve-runtime-command`, `approve-runtime`, `grant-runtime`,
`enable-runtime`, `phase-5-runtime`, `phase-5-1-runtime`, proposal CLI command,
readiness CLI command, live stdio reader, stdout writer, stderr writer,
failure-audit command, listener, server, subprocess supervisor, adapter call,
Locus dependency, MCP/OpenClaw call, plugin execution path, Content Fabric
runtime path, runtime approval grant, live runtime implementation, or agent
loop. Phase 4.2B is not runtime readiness, Phase 4.2C is not runtime approval
or runtime enablement, and Phase 4.2D does not grant runtime implementation
approval or command-surface approval. Phase 4.2C itself recorded no fresh
external, Devin, or Jules review; Phase 4.2D records Jules's external review
disposition while keeping CLI source and runtime behavior unchanged. Phase 5.1
records approval to proceed with a separate future implementation phase only.
Phase 5.2 adds private Rust-host guarded planning helpers and fixture-backed
blocked-runtime tests only; it does not add runtime command exposure, live
runtime implementation, approval commands, stdout/stderr writers, process
control, transcript/audit side effects, adapter/Fabric runtime behavior, or
changes to `apps/cli/src/index.mjs`. Phase 5.3 adds command-surface approval
preflight docs/status metadata only; it does not add a Phase 5.3 CLI command,
command-surface approval CLI command, runtime command, approval command,
stdout/stderr writer, process control, transcript/audit side effect, adapter
or Content Fabric runtime behavior, or changes to `apps/cli/src/index.mjs`.
Phase 5.4 adds disabled command exposure plan docs/status metadata only; it
does not add a Phase 5.4 CLI command, disabled-command-exposure CLI command,
command-surface approval CLI command, runtime command, approval command,
stdout/stderr writer, process control, transcript/audit side effect, adapter
or Content Fabric runtime behavior, Rust source change, or change to
`apps/cli/src/index.mjs`.
Phase 5.4A records Jules's Phase 5.4 `APPROVE` review disposition only; it
does not add a Phase 5.4A CLI command, review-disposition CLI command, runtime
command, approval command, runtime command exposure, stdout/stderr writer,
process control, transcript/audit side effect, adapter or Content Fabric
runtime behavior, Rust source change, chmod change, or content change to
`apps/cli/src/index.mjs`.
See
`docs/phase-4-2a-deliberately-blocked-rust-host-stdio-runtime-skeleton.md` and
`docs/phase-4-2b-blocked-lifecycle-failure-audit-skeleton.md` and
`docs/phase-4-2c-runtime-readiness-review-gate.md` and
`docs/phase-4-2d-external-review-disposition-phase5-handoff.md` and
`docs/phase-5-1-controlled-runtime-implementation-approval-handoff.md`, and
`docs/phase-5-2-guarded-runtime-implementation-slice.md`, and
`docs/phase-5-3-command-surface-approval-preflight.md`, and
`docs/phase-5-4-disabled-command-exposure-plan.md`, and
`docs/phase-5-4a-jules-review-disposition.md`.

Phase 4.0C adds pre-runtime transport policy only as the historical predecessor
to Phase 4.0D; it adds no replay or live runtime CLI.

```powershell
node apps/cli/src/index.mjs plan --manifest examples/minimal-manifest/ardyn.manifest.json --task examples/minimal-task/task.json
node apps/cli/src/index.mjs plan --trace --manifest examples/minimal-manifest/ardyn.manifest.json --task examples/minimal-task/task.json
node apps/cli/src/index.mjs plan --summary --manifest examples/minimal-manifest/ardyn.manifest.json --task examples/minimal-task/task.json
node apps/cli/src/index.mjs plan --explain --manifest examples/minimal-manifest/ardyn.manifest.json --task examples/minimal-task/task.json
node apps/cli/src/index.mjs plan --review-artifact --manifest examples/minimal-manifest/ardyn.manifest.json --task examples/minimal-task/task.json
node apps/cli/src/index.mjs plan --review-artifact --manifest examples/minimal-manifest/ardyn.manifest.json --task examples/minimal-task/task.json --output approval-review-artifact.json
node apps/cli/src/index.mjs review-artifact --file tests/fixtures/review-artifacts/phase3-6/current-compatible-v1.json --summary
node apps/cli/src/index.mjs review-artifact --file tests/fixtures/review-artifacts/phase3-6/compatible-unknown-fields.json --explain
node apps/cli/src/index.mjs review-artifact --file tests/fixtures/review-artifacts/phase3-7/older-compatible-review-artifact.json --schema-status
node apps/cli/src/index.mjs review-artifact --file tests/fixtures/review-artifacts/phase3-7/current-compatible-review-artifact.json --attestation-plan
node apps/cli/src/index.mjs review-trace --left tests/fixtures/trace-comparison/left-approval-review-artifact.json --right tests/fixtures/trace-comparison/right-approval-review-artifact.json
node apps/cli/src/index.mjs review-trace --summary --left tests/fixtures/trace-comparison/left-approval-review-artifact.json --right tests/fixtures/trace-comparison/right-approval-review-artifact.json
node apps/cli/src/index.mjs review-trace --explain --left tests/fixtures/trace-comparison/left-approval-review-artifact.json --right tests/fixtures/trace-comparison/right-approval-review-artifact.json
node apps/cli/src/index.mjs validate-session-transcript --file examples/session-transcripts/valid-minimal.json
node apps/cli/src/index.mjs validate-session-transcript --file examples/session-transcripts/valid-task-approval.json --summary
node apps/cli/src/index.mjs validate-session-transcript --file tests/fixtures/session-transcripts/phase3-10/older-compatible-upgrade-available.json --schema-status
node apps/cli/src/index.mjs validate-session-transcript --file tests/fixtures/session-transcripts/phase3-10/display-summary.json --display-summary
node apps/cli/src/index.mjs validate-session-transcript --file tests/fixtures/session-transcripts/phase3-10/unsupported-major.json --compatibility-explain
node apps/cli/src/index.mjs emit-session-events --dry-run --manifest examples/minimal-manifest/ardyn.manifest.json --task examples/minimal-task/task.json
```

`plan` keeps the full default JSON plan unless exactly one output mode is passed. `--trace` prints the full planner trace wrapper, `--summary` prints selected IDs, unresolved requests, approval, and safety flags, `--explain` prints deterministic candidate ranking and approval reasons, and `--review-artifact` prints the stable approval review artifact. Mode flags are mutually exclusive.

For planner review workflows:

- Use default `plan` when an existing consumer needs the full Phase 3 plan JSON.
- Use `--trace` to inspect the retained planner trace without the rest of the plan envelope.
- Use `--summary` for approval-gate checks that only need selected ids, unresolved requests, approval, and safety.
- Use `--explain` when reviewing why a capability tier won and which lower-ranked candidates were retained.
- Use `--review-artifact` when an approval reviewer needs the stable non-executing artifact with candidate rankings, selected ids, unresolved requests, approval decision, and false safety flags.
- Add `--output <file>` only with `--review-artifact` to write the same formatted artifact JSON bytes to that file. The command prints a compact JSON export summary to stdout and writes no other files.

All plan output modes are JSON-only renderings of the same non-executing plan data.
`--output` is rejected unless `--review-artifact` is selected, and a missing output path fails with plain stderr and no JSON stdout.

`review-artifact --file <file> --summary|--explain|--schema-status|--attestation-plan` reads one local `.json` approval review artifact and renders deterministic display JSON with Phase 3.6 compatibility classification plus Phase 3.7 schema migration and attestation planning metadata. URLs, `file:` URLs, and UNC/network-style paths are rejected.

For review artifact display workflows:

- Use `--summary` when a reviewer needs the compact core display summary plus compatibility.
- Use `--explain` when a reviewer needs version validation details, compatibility, approval status, safety flags, inert unknown-field handling, display guidance, and the normalized display view.
- Use `--schema-status` when a reviewer needs schema id/version, compatibility, migration availability, migration notes, and a compact migration/attestation display summary. Unsupported major and malformed artifacts are classified rather than executed.
- Use `--attestation-plan` when a reviewer needs the unsigned Phase 3.7 attestation planning record with deterministic artifact digest metadata, placeholder signer identity, planned signing algorithm, verification status, and false safety flags.

Unsupported major versions and malformed version metadata fail for `--summary` and `--explain`, and are classified for `--schema-status` and `--attestation-plan`. Unknown fields are preserved only as inert display data; the CLI does not execute or interpret them. `review-artifact` performs no writes, network calls, process spawning, adapter connections, plugin installation, Content Fabric runtime work, code-pack enablement, autonomous loops, key loading, or production signing.

`review-trace --left <file> --right <file>` reads two local `.json` files and compares them with the core approval review artifact comparator. Default output includes equality, difference count, full deterministic differences, left/right schema-version-task-manifest summaries, `nonExecuting: true`, and false safety flags.

For trace review workflows:

- Use default `review-trace` when a consumer needs the full deterministic difference list.
- Use `--summary` when a reviewer only needs equality, count, changed difference types, source summaries, and safety flags.
- Use `--explain` when a reviewer needs deterministic reasons and details for each difference.

`--summary` and `--explain` are mutually exclusive. `review-trace` performs no writes, network calls, process spawning, adapter connections, plugin installation, Content Fabric runtime work, code-pack enablement, or autonomous loops.

`validate-session-transcript --file <file>` reads one local `.json` session transcript and renders deterministic validation JSON. Default output and the existing `--summary` and `--explain` modes are preserved. Phase 3.10 adds `--schema-status`, `--display-summary`, and `--compatibility-explain` as mutually exclusive read-only output modes.

For session transcript display workflows:

- Use default output for strict Phase 3.9 validation plus classification.
- Use `--summary` for the existing compact transcript summary.
- Use `--explain` for the existing validation checklist and summary explanation.
- Use `--schema-status` for transcript schema id/version compatibility and migration metadata.
- Use `--display-summary` for Locus-facing read-only counts, warnings, unknown-field metadata, and safety posture.
- Use `--compatibility-explain` for compatibility reasoning, migration notes, display warnings, and inert unknown-field policy.

Older same-major transcripts may be classified as `upgrade_available` for display-only review. Unsupported major and malformed transcripts are classified and explained without execution. Unknown root fields are surfaced only as inert display metadata. URLs, `file:` URLs, and UNC/network-style paths are rejected; the command performs no writes, network calls, process spawning, adapter connections, plugin installation, Content Fabric runtime work, code-pack enablement, or autonomous loops.

`emit-session-events --dry-run --manifest <file> --task <file>` reads one local
manifest JSON file and one local task JSON file, constructs the deterministic
non-executing plan, and writes Phase 4.0A session events as JSONL to stdout.
Phase 4.0B hardens the parser: unknown flags, duplicate flags, missing flag
values, and extra positional arguments fail before any file reads. Errors use
plain stderr and no JSON stdout. The command has no stdin command loop,
listener, server, subprocess spawning, adapter calls, Locus dependency,
MCP/OpenClaw calls, plugin execution, Content Fabric download/install/enable
behavior, or file writes.

Phase 4.0C documents future stdout/stderr ownership, JSONL framing, stderr
redaction, backpressure, partial-write, line-integrity, process-exit, and
transcript replay policy. It intentionally adds no replay or live runtime CLI.

Phase 4.0D codifies that policy as Rust-host contract types in
`crates/ardyn-host/src/lib.rs` and leaves CLI behavior unchanged. It
intentionally adds no replay, live stdio, WebSocket, HTTP, subprocess,
adapter, plugin, Content Fabric, secret, or production signing-key command.
See `docs/phase-4-0d-rust-host-transport-policy-contracts.md`.

Phase 4.0E exports those Rust-host policy contracts as deterministic
review-only JSON metadata from Rust helpers and still leaves CLI behavior
unchanged. It adds no policy metadata CLI command, no file writer, no stdout
printer, and no runtime command. See
`docs/phase-4-0e-rust-host-policy-metadata.md`.

Phase 4.0F makes host-policy review records current static artifacts in the
Rust host and still leaves CLI behavior unchanged. It adds no review-record CLI
command, no file writer, no stdout printer, no runtime command, and no runtime
approval grant. See `docs/phase-4-0f-host-policy-review-records.md`.

Phase 4.0G adds display-only comparison helpers for those review records in
`@ardyn/core` and still leaves CLI behavior unchanged. It adds no comparison
CLI command, no file writer, no stdout printer, no runtime command, and no
runtime approval grant. See
`docs/phase-4-0g-host-policy-review-comparison.md`.

Phase 4.0H adds a static reviewer handoff index and still leaves CLI behavior
unchanged. It adds no reviewer-index CLI command, no file writer, no stdout
printer, no runtime command, and no runtime approval grant. See
`docs/phase-4-0h-reviewer-handoff-index.md`.

Phase 4.0I adds a static final pre-runtime readiness bundle and still leaves
CLI behavior unchanged. It adds no readiness CLI command, no reviewer-index CLI
command, no file writer, no stdout printer, no runtime command, no Phase 4.1
implementation, and no runtime approval grant. See
`docs/phase-4-0i-final-pre-runtime-readiness.md`.

Phase 4.1 adds a static runtime proposal bundle and still leaves CLI behavior
unchanged. It adds no proposal CLI command, no runtime command, no
`replay-session-transcript`, no `serve-runtime`, no `stdio-runtime`, no file
writer, no stdout printer, no live stdio reader, no process stdio ownership,
no transcript persistence/replay runtime, and no runtime approval grant. See
`docs/phase-4-1-runtime-proposal.md`.

Phase 4.1A adds static host-policy approval records and still leaves CLI
behavior unchanged. It adds no approval-record CLI command, no
operator-consent CLI command, no `approve-runtime`, no `grant-runtime`, no
`enable-runtime`, no `serve-runtime`, no `stdio-runtime`, no file writer, no
stdout printer, no live stdio reader, no process stdio ownership, no
host-policy enforcement path, no approval evaluator, and no runtime approval
grant. See `docs/phase-4-1a-host-policy-approval-records.md`.

Phase 4.1B adds static transport harness contracts and still leaves CLI
behavior unchanged. It adds no transport-harness CLI command, no
`transport-harness-contract`, no `stdio-harness`, no `stdin-reader`, no
`stdout-writer`, no `stderr-writer`, no `failure-audit`, no
`emit-failure-audit`, no `serve-runtime`, no `stdio-runtime`, no file writer,
no stdout printer, no live stdio reader, no process stdio ownership, no
host-policy enforcement path, no approval evaluator, and no runtime approval
grant. See `docs/phase-4-1b-transport-harness-contracts.md`.

Phase 4.1C adds static stdout JSONL framing and stderr redaction contracts and
still leaves CLI behavior unchanged. It adds no framing-redaction CLI command,
no `stdout-framing`, no `stderr-redaction`, no `redact-stderr`, no
`validate-jsonl-framing`, no `stdout-writer`, no `stderr-writer`, no
`serve-runtime`, no `stdio-runtime`, no file writer, no stdout printer, no
live stdio reader, no process stdio ownership, no host-policy enforcement
path, no approval evaluator, and no runtime approval grant. See
`docs/phase-4-1c-framing-redaction-contracts.md`.

Phase 4.1D adds static transcript persistence and replay contracts and still
leaves CLI behavior unchanged. It adds no transcript persistence CLI command,
no replay CLI command, no `replay-session-transcript`, no
`persist-session-transcript`, no `transcript-replay`, no
`transcript-persistence`, no `transcript-replay-contract`, no
`transcript-persistence-contract`, no `transcript-sidecar`, no
`sidecar-writer`, no `replay-transcript`, no `serve-runtime`, no
`stdio-runtime`, no file writer, no stdout printer, no live stdio reader, no
process stdio ownership, no host-policy enforcement path, no approval
evaluator, and no runtime approval grant. See
`docs/phase-4-1d-transcript-replay-contracts.md`.

Phase 4.1E adds static failure-audit, terminal-state, cleanup/kill, and
nonzero-exit mapping contracts and still leaves CLI behavior unchanged. It
adds no failure-audit CLI command, no cleanup CLI command, no kill CLI command,
no process-control CLI command, no signal-handler CLI command, no exit-handler
CLI command, no `failure-audit`, no `failure-audit-record`, no
`emit-failure-audit`, no `failure-audit-runtime`, no `cleanup-runtime`, no
`run-cleanup`, no `kill-runtime`, no `kill-process`, no
`terminate-process`, no `process-kill`, no `exit-runtime`, no
`exit-handler`, no `signal-handler`, no `handle-signal`, no
`approval-evaluator`, no `evaluate-approval`, no `serve-runtime`, no
`stdio-runtime`, no file writer, no stdout printer, no live stdio reader, no
process stdio ownership, no host-policy enforcement path, no approval
evaluator, and no runtime approval grant. See
`docs/phase-4-1e-failure-audit-kill-semantics.md`.

Phase 4.1F adds a static runtime-readiness checkpoint and still leaves CLI
behavior unchanged. It adds no runtime-readiness CLI command, no checkpoint
CLI command, no `runtime-readiness-checkpoint`, no `approve-runtime`, no
`grant-runtime`, no `enable-runtime`, no `serve-runtime`, no `stdio-runtime`,
no `replay-session-transcript`, no file writer, no stdout printer, no live
stdio reader, no process stdio ownership, no host-policy enforcement path, no
approval evaluator, and no runtime approval grant. See
`docs/phase-4-1f-runtime-readiness-checkpoint.md`.

Phase 4.1G adds a static external review packet and still leaves CLI behavior
unchanged. It adds no external-review-packet CLI command, no review-packet CLI
command, no runtime-readiness-review CLI command, no `approve-runtime`, no
`grant-runtime`, no `enable-runtime`, no `serve-runtime`, no `stdio-runtime`,
no `replay-session-transcript`, no `policy-metadata`, no `host-policy-export`,
no file writer, no stdout printer, no live stdio reader, no process stdio
ownership, no host-policy enforcement path, no approval evaluator, and no
runtime approval grant. See `docs/phase-4-1g-external-review-packet.md`.

Phase 4.1H adds a static external review disposition record and still leaves
CLI behavior unchanged. It adds no external-review-disposition CLI command, no
review-disposition CLI command, no external-review-packet CLI command, no
review-packet CLI command, no runtime-readiness-review CLI command, no
`approve-runtime`, no `grant-runtime`, no `enable-runtime`, no
`serve-runtime`, no `stdio-runtime`, no `replay-session-transcript`, no
`policy-metadata`, no `host-policy-export`, no file writer, no stdout printer,
no live stdio reader, no process stdio ownership, no host-policy enforcement
path, no approval evaluator, and no runtime approval grant. It is not a fresh
Devin re-review and only records the targeted-fix disposition. See
`docs/phase-4-1h-external-review-disposition.md`.

Phase 4.1I adds private Rust-host stdio test harness coverage plus
documentation and report inventory, and still leaves CLI behavior unchanged. It
adds no
rust-host-stdio-harness CLI command, no stdio-harness CLI command, no
runtime-harness CLI command, no review-disposition CLI command, no
external-review-packet CLI command, no review-packet CLI command, no
runtime-readiness-review CLI command, no `approve-runtime`, no
`grant-runtime`, no `enable-runtime`, no `serve-runtime`, no `stdio-runtime`,
no `replay-session-transcript`, no `policy-metadata`, no `host-policy-export`,
no file writer, no stdout printer, no live stdio reader, no process stdio
ownership, no host-policy enforcement path, no approval evaluator, and no
runtime approval grant. It is test infrastructure only, is not a fresh Devin
review, changes no CLI source, and leaves runtime blocked. See
`docs/phase-4-1i-rust-host-stdio-harness.md`.

Phase 4.1J adds fixture-backed Rust-host stdio boundary documentation and still
leaves CLI behavior unchanged. It adds no fixture-backed-stdio-boundary CLI
command, no stdio-boundary CLI command, no public-runtime-contract CLI command,
no rust-host-stdio-harness CLI command, no stdio-harness CLI command, no
runtime-harness CLI command, no runtime-readiness CLI command, no
`runtime-readiness-checkpoint`, no `approve-runtime`, no `grant-runtime`, no
`enable-runtime`, no `serve-runtime`, no `stdio-runtime`, no
`replay-session-transcript`, no file writer, no stdout printer, no live stdio
reader, no process stdio ownership, no host-policy enforcement path, no
approval evaluator, and no runtime approval grant. It is not runtime readiness,
is not a fresh external review, changes no CLI source, does not define a public
runtime contract, and leaves runtime blocked. See
`docs/phase-4-1j-fixture-backed-stdio-boundaries.md`.

Phase 4.1K adds approval-gated Rust-host stdio runtime contract-gate
documentation and still leaves CLI behavior unchanged. It adds no
runtime-contract-gates CLI command, no stdio-runtime-contract CLI command, no
public-runtime-contract CLI command, no `approve-runtime`, no `grant-runtime`,
no `enable-runtime`, no `serve-runtime`, no `stdio-runtime`, no
`replay-session-transcript`, no file writer, no stdout printer, no live stdio
reader, no process stdio ownership, no host-policy enforcement path, no
approval evaluator, and no runtime approval grant. It is contract-gate-only,
records no fresh external or Devin review, changes no CLI source, and leaves
runtime blocked. See `docs/phase-4-1k-stdio-runtime-contract-gates.md`.

Phase 4.1L adds runtime implementation-readiness documentation, a
deterministic readiness/checklist fixture, blocker burn-down, 4.2A handoff,
tests, and report inventory while leaving CLI behavior unchanged. It adds no
runtime-implementation-readiness CLI command, no 4.2A skeleton CLI command, no
`serve-runtime`, no `stdio-runtime`, no `replay-session-transcript`, no live
stdio reader or writer, no process stdio ownership, no approval evaluator, and
no runtime approval grant. It does not change `apps/cli/src/index.mjs`. See
`docs/phase-4-1l-runtime-implementation-readiness.md`.

Phase 4.2A adds an internal blocked Rust-host stdio runtime skeleton, fixture
expectations, focused tests, and report inventory while leaving CLI behavior
unchanged. It adds no CLI command, no runtime command, no live stdin loop, no
live stdout/stderr writer, no process control, no approval evaluator, and no
runtime approval grant. See
`docs/phase-4-2a-deliberately-blocked-rust-host-stdio-runtime-skeleton.md`.

Phase 4.2B adds internal blocked Rust-host lifecycle, transcript-plan,
failure-audit, and kill-semantics planning helpers, fixture expectations,
focused tests, and report inventory while leaving CLI behavior unchanged. It
adds no lifecycle CLI command, no failure-audit CLI command, no cleanup CLI
command, no kill CLI command, no process control, no transcript write side
effect, no audit write side effect, no approval evaluator, and no runtime
approval grant. See
`docs/phase-4-2b-blocked-lifecycle-failure-audit-skeleton.md`.

Phase 4.2C adds a runtime readiness review gate, Jules/Devin review packet,
blocker burn-down, external-review status rules, focused tests, and report
inventory while leaving CLI behavior unchanged. It adds no readiness-gate CLI
command, no external-review-packet CLI command, no review-packet CLI command,
no runtime-readiness-review CLI command, no approval command, no runtime
command, no process control, no transcript or audit write side effect, and no
runtime approval grant. See
`docs/phase-4-2c-runtime-readiness-review-gate.md`.

Phase 4.2D records Jules's post-merge Phase 4.2C `APPROVE` disposition and
the Phase 5.1 approval-record/design handoff while leaving CLI behavior
unchanged. It adds no Phase 4.2D disposition CLI command, no Phase 5.1 handoff
CLI command, no runtime implementation approval CLI command, no runtime
command-surface review CLI command, no approval command, no runtime command,
no process control, no transcript or audit write side effect, and no runtime
approval grant. See
`docs/phase-4-2d-external-review-disposition-phase5-handoff.md` and
`docs/phase-5-1-controlled-runtime-implementation-approval-handoff.md`.

Phase 5.2 adds private Rust-host guarded planning helpers and fixture-backed
blocked-runtime tests while leaving CLI behavior unchanged. It adds no Phase
5.2 CLI command, no guarded-runtime CLI command, no approval command, no
runtime command, no live stdin loop, no stdout/stderr writer, no process
control, no transcript or audit write side effect, and no runtime approval
grant. See `docs/phase-5-2-guarded-runtime-implementation-slice.md`.

Phase 5.3 adds command-surface approval preflight documentation and report
metadata while leaving CLI behavior unchanged. It adds no Phase 5.3 CLI
command, no command-surface approval CLI command, no approval command, no
runtime command, no live stdin loop, no stdout/stderr writer, no process
control, no transcript or audit write side effect, and no runtime approval
grant. See `docs/phase-5-3-command-surface-approval-preflight.md`.

Phase 5.4 adds disabled command exposure plan documentation and report
metadata while leaving CLI behavior unchanged. It adds no Phase 5.4 CLI
command, no disabled-command-exposure CLI command, no command-surface approval
CLI command, no approval command, no runtime command, no live stdin loop, no
stdout/stderr writer, no process control, no transcript or audit write side
effect, and no runtime approval grant. See
`docs/phase-5-4-disabled-command-exposure-plan.md`.

Phase 5.4A records Jules's Phase 5.4 `APPROVE` review disposition while leaving
CLI behavior unchanged. It adds no Phase 5.4A CLI command, no review
disposition CLI command, no approval command, no runtime command, no live stdin
loop, no stdout/stderr writer, no process control, no transcript or audit write
side effect, and no runtime approval grant. Current `main` already tracks
`apps/cli/src/index.mjs` as mode `100644`, so Phase 5.4A applies no chmod
correction and no content change. See
`docs/phase-5-4a-jules-review-disposition.md`.
