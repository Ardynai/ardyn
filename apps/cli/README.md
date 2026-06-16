# @ardyn/cli

CLI app scaffold for ARDYN.

Phase 5.31 keeps the Phase 5.5 command posture over the same command set as Phase 4.0B, Phase 4.0C, Phase
4.0D, Phase 4.0E, Phase 4.0F, Phase 4.0G, Phase 4.0H, Phase 4.0I, Phase
4.1/4.1A/4.1B/4.1C/4.1D/4.1E, Phase 4.1F, Phase 4.1G, Phase 4.1H, and
Phase 4.1I, Phase 4.1J, Phase 4.1K, Phase 4.1L, Phase 4.2A, Phase 4.2B,
Phase 4.2C, and Phase 4.2D:
`doctor`, `identity`, `capabilities`, `plan`, `review-artifact`,
`review-trace`, `validate-session-transcript`, dry-run `serve`, and dry-run
`emit-session-events`, plus recognized default-blocked `serve-runtime`. Phase 4.2C adds readiness-gate metadata, a Jules/Devin
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
Phase 5.5 adds one recognized default-blocked runtime command:
`serve-runtime`. It always exits nonzero, writes zero stdout, and writes
deterministic runtime-unavailable stderr. `serve-runtime --dry-run` does not
bypass the block. Phase 5.5 adds no runtime execution, approval command,
approval grant/evaluator, live stdin loop, stdout/stderr runtime writer,
process control, transcript/audit side effect, adapter or Content Fabric
runtime behavior, WebSocket/HTTP surface, or Rust source change.
Phase 5.6 adds runtime enablement precondition docs/status metadata only. It
adds no Phase 5.6 CLI command, approval command, approval grant/evaluator,
runtime start path, live stdin loop, stdout/stderr runtime writer, process
control, transcript/audit side effect, adapter or Content Fabric runtime
behavior, WebSocket/HTTP surface, Rust source change, or change to
`apps/cli/src/index.mjs`. `serve-runtime` and `serve-runtime --dry-run` remain
default-blocked.
Phase 5.7 adds runtime approval validation docs/status metadata only. It
records missing, invalid, revoked, and valid-prerequisite-only approval cases,
but adds no Phase 5.7 CLI command, approval command, approval grant/evaluator,
runtime start path, live stdin loop, stdout/stderr runtime writer, process
control, transcript/audit side effect, adapter or Content Fabric runtime
behavior, WebSocket/HTTP surface, Rust source change, or change to
`apps/cli/src/index.mjs`. A valid approval record is only a prerequisite
signal and cannot enable or start runtime. `serve-runtime` and
`serve-runtime --dry-run` remain default-blocked.
Phase 5.8 adds runtime command-exposure approval docs/status metadata only. It
records missing, invalid, revoked, and valid-prerequisite-only
command-exposure approval cases, but adds no Phase 5.8 CLI command, command
exposure approval command, approval grant/evaluator, runtime start path, live
stdin loop, stdout/stderr runtime writer, process control, transcript/audit
side effect, adapter or Content Fabric runtime behavior, WebSocket/HTTP
surface, Rust source change, or change to `apps/cli/src/index.mjs`. A valid
command-exposure approval record is only a prerequisite signal and cannot
enable runtime, start runtime, expose runtime execution, or create command
aliases. `serve-runtime` and `serve-runtime --dry-run` remain default-blocked.
Phase 5.9 adds approval evaluator/grant boundary docs/status metadata only. It
records that valid runtime approval and valid command-exposure approval are
prerequisite signals only, but adds no Phase 5.9 CLI command, approval
evaluator command, approval grant command, runtime start path, live stdin loop,
stdout/stderr runtime writer, process control, transcript/audit side effect,
adapter or Content Fabric runtime behavior, WebSocket/HTTP surface, Rust source
change, or change to `apps/cli/src/index.mjs`. Valid approval signals cannot
create an evaluator, produce a grant, enable runtime, start runtime, or expose
runtime execution. `serve-runtime` and `serve-runtime --dry-run` remain
default-blocked.
Phase 5.10 adds runtime host-policy boundary docs/status metadata only. It
records missing, invalid, and permissive/unbounded host-policy enforcement as
rejected and valid restrictive host-policy enforcement as a prerequisite signal
only, but adds no Phase 5.10 CLI command, host-policy command, approval command,
runtime start path, live stdin loop, stdout/stderr runtime writer, process
control, transcript/audit side effect, adapter or Content Fabric runtime
behavior, WebSocket/HTTP surface, Rust source change, or change to
`apps/cli/src/index.mjs`. Valid restrictive host-policy enforcement cannot
enable runtime, start runtime, or expose runtime execution. `serve-runtime` and
`serve-runtime --dry-run` remain default-blocked.
Phase 5.11 adds runtime stdio safety boundary docs/status metadata only. It
records missing, invalid, and unbounded stdin/stdout/stderr behavior as rejected
and valid restrictive stdio safety as a prerequisite signal only, but adds no
Phase 5.11 CLI command, stdio safety command, approval command, runtime start
path, live stdin loop, stdout/stderr runtime writer, process control,
transcript/audit side effect, adapter or Content Fabric runtime behavior,
WebSocket/HTTP surface, Rust source change, or change to
`apps/cli/src/index.mjs`. Valid restrictive stdio safety cannot enable runtime,
start runtime, or expose runtime execution. `serve-runtime` and
`serve-runtime --dry-run` remain default-blocked.
Phase 5.12 adds runtime transcript/audit confinement boundary docs/status
metadata only. It records missing, invalid, and unbounded runtime
transcript/audit writes as rejected and valid restrictive transcript/audit
confinement as a prerequisite signal only, but adds no Phase 5.12 CLI command,
transcript/audit confinement command, approval command, runtime start path,
live stdin loop, stdout/stderr runtime writer, process control, runtime
transcript/audit write, adapter or Content Fabric runtime behavior,
WebSocket/HTTP surface, Rust source change, or change to
`apps/cli/src/index.mjs`. Valid restrictive transcript/audit confinement cannot
enable runtime, start runtime, or expose runtime execution. `serve-runtime` and
`serve-runtime --dry-run` remain default-blocked.
Phase 5.13 adds runtime process-control boundary docs/status metadata only. It
records missing, invalid, and unbounded process spawning, termination, or
supervision as rejected and valid restrictive process control as a prerequisite
signal only, but adds no Phase 5.13 CLI command, process-control command,
approval command, runtime start path, live stdin loop, stdout/stderr runtime
writer, process spawning, process termination, runtime supervision, runtime
transcript/audit write, adapter or Content Fabric runtime behavior,
WebSocket/HTTP surface, Rust source change, or change to
`apps/cli/src/index.mjs`. Valid restrictive process control cannot enable
runtime, start runtime, or expose runtime execution. `serve-runtime` and
`serve-runtime --dry-run` remain default-blocked.
Phase 5.14 adds runtime rollback/kill-switch boundary docs/status metadata
only. It records missing, invalid, and non-deterministic or manual-only
rollback as rejected and valid restrictive rollback/kill-switch policy as a
prerequisite signal only, but adds no Phase 5.14 CLI command, rollback command,
kill-switch command, shutdown command, stop command, approval command, runtime
start path, live stdin loop, stdout/stderr runtime writer, process spawning,
process termination, runtime supervision, runtime transcript/audit write,
adapter or Content Fabric runtime behavior, WebSocket/HTTP surface, Rust source
change, or change to `apps/cli/src/index.mjs`. Valid restrictive
rollback/kill-switch policy cannot enable runtime, start runtime, expose runtime
execution, shut down runtime, roll back runtime, or activate a kill switch.
`serve-runtime` and `serve-runtime --dry-run` remain default-blocked.
Phase 5.15 adds positive runtime smoke requirement docs/status metadata only.
It records missing, invalid, and non-guarded or non-deterministic runtime smoke
coverage as rejected and valid positive runtime smoke coverage as a prerequisite
signal only, but adds no Phase 5.15 CLI command, smoke command, runtime smoke
command, approval command, runtime start path, live stdin loop, stdout/stderr
runtime writer, process spawning, process supervision, runtime transcript/audit
write, adapter or Content Fabric runtime behavior, WebSocket/HTTP surface, Rust
source change, or change to `apps/cli/src/index.mjs`. Valid positive runtime
smoke coverage cannot enable runtime, start runtime, run runtime, or expose
runtime execution. `serve-runtime` and `serve-runtime --dry-run` remain
default-blocked.
Phase 5.16 adds runtime enablement readiness checkpoint docs/status metadata
only. It summarizes Phase 5.6 through Phase 5.15 contracts, keeps approval
records and command-exposure approvals prerequisite-only, records no approval
evaluator or grant, and adds no Phase 5.16 CLI command, readiness command,
approval command, evaluator, grant, runtime start path, live stdin loop,
stdout/stderr runtime writer, process spawning or supervision, runtime
transcript/audit write, adapter or Content Fabric runtime behavior,
WebSocket/HTTP surface, Rust source change, or change to
`apps/cli/src/index.mjs`. `serve-runtime` and `serve-runtime --dry-run` remain
default-blocked.
Phase 5.17 adds guarded runtime implementation plan docs/status metadata only.
It records a future sequence for approval record readers, a review-only
evaluator design, restrictive host-policy, bounded stdio, transcript/audit
confinement, process-control, rollback/kill-switch, positive runtime smoke
fixtures, and a still default-blocked entrypoint slice, but adds no Phase 5.17
CLI command, plan command, approval command, evaluator, grant, runtime start
path, live stdin loop, stdout/stderr runtime writer, process spawning or
supervision, runtime transcript/audit write, adapter or Content Fabric runtime
behavior, WebSocket/HTTP surface, Rust source change, or change to
`apps/cli/src/index.mjs`. `serve-runtime` and `serve-runtime --dry-run` remain
default-blocked.
Phase 5.18 adds review-only approval evaluator skeleton docs/status metadata
and a core review helper only. It classifies prerequisite records as missing,
invalid, revoked, or valid for review only, but adds no Phase 5.18 CLI command,
approval evaluator command, approval grant command, runtime start path, live
stdin loop, stdout/stderr runtime writer, process spawning or supervision,
runtime transcript/audit write, adapter or Content Fabric runtime behavior,
WebSocket/HTTP surface, Rust source change, or change to
`apps/cli/src/index.mjs`. Valid prerequisite records cannot produce a grant,
enable runtime, expose runtime commands, or start runtime. `serve-runtime` and
`serve-runtime --dry-run` remain default-blocked.
Phase 5.19 adds approval prerequisite reader hardening docs/status metadata
and a core review reader only. It normalizes prerequisite records as missing,
malformed, revoked, valid, duplicate, stale, or unknown for review only, but
adds no Phase 5.19 CLI command, approval prerequisite reader command, approval
evaluator command, approval grant command, runtime start path, live stdin loop,
stdout/stderr runtime writer, process spawning or supervision, runtime
transcript/audit write, adapter or Content Fabric runtime behavior,
WebSocket/HTTP surface, Rust source change, or change to
`apps/cli/src/index.mjs`. Valid prerequisite records still cannot produce a
grant, enable runtime, expose runtime commands, or start runtime.
`serve-runtime` and `serve-runtime --dry-run` remain default-blocked.
Phase 5.20 adds approval prerequisite source ingestion preflight docs/status
metadata and a core review helper only. It classifies caller-provided in-memory
source inputs as missing, malformed, empty, duplicate, stale, unknown, revoked,
or valid for review only, but adds no Phase 5.20 CLI command, source
preflight command, approval prerequisite reader command, approval evaluator
command, approval grant command, runtime start path, live stdin loop,
stdout/stderr runtime writer, process spawning or supervision, runtime
transcript/audit write, filesystem watcher, external source lookup,
secrets/env ingestion, adapter or Content Fabric runtime behavior,
WebSocket/HTTP surface, Rust source change, or change to
`apps/cli/src/index.mjs`. Valid source inputs can only feed the review-only
reader/evaluator path; they cannot produce a grant, enable runtime, expose
runtime commands, or start runtime. `serve-runtime` and
`serve-runtime --dry-run` remain default-blocked.
Phase 5.21 adds approval prerequisite source selection docs/status metadata and
a core review helper only. It selects among acceptable caller-provided
in-memory prerequisite sources deterministically before they may feed the
review-only reader path, but adds no Phase 5.21 CLI command, source-selection
command, approval prerequisite reader command, approval evaluator command,
approval grant command, runtime start path, live stdin loop, stdout/stderr
runtime writer, process spawning or supervision, runtime transcript/audit
write, filesystem watcher, external source lookup, secrets/env ingestion,
adapter or Content Fabric runtime behavior, WebSocket/HTTP surface, Rust source
change, or change to `apps/cli/src/index.mjs`. Selected sources can only feed
the review-only reader/evaluator path; they cannot produce a grant, enable
runtime, expose runtime commands, or start runtime. `serve-runtime` and
`serve-runtime --dry-run` remain default-blocked.
Phase 5.22 adds approval prerequisite source bundle docs/status metadata and a
core review helper only. It bundles selected caller-provided in-memory
prerequisite sources deterministically before they may feed the review-only
reader path, but adds no Phase 5.22 CLI command, source-bundle command,
source-selection command, approval prerequisite reader command, approval
evaluator command, approval grant command, runtime start path, live stdin loop,
stdout/stderr runtime writer, process spawning or supervision, runtime
transcript/audit write, filesystem watcher, external source lookup, secrets/env
ingestion, adapter or Content Fabric runtime behavior, WebSocket/HTTP surface,
Rust source change, or change to `apps/cli/src/index.mjs`. Valid bundles can
only feed the review-only reader/evaluator path; they cannot produce a grant,
enable runtime, expose runtime commands, or start runtime. `serve-runtime` and
`serve-runtime --dry-run` remain default-blocked.
Phase 5.23 adds prerequisite bundle consumption checkpoint docs/status metadata
and a core review helper only. It consumes in-memory Phase 5.22 bundle results
before they may be summarized for the review-only evaluator path, but adds no
Phase 5.23 CLI command, bundle-consumption command, source-bundle command,
approval prerequisite reader command, approval evaluator command, approval
grant command, runtime start path, live stdin loop, stdout/stderr runtime
writer, process spawning or supervision, runtime transcript/audit write,
filesystem watcher, external source lookup, secrets/env ingestion, adapter or
Content Fabric runtime behavior, WebSocket/HTTP surface, Rust source change, or
change to `apps/cli/src/index.mjs`. Valid checkpoints cannot produce a grant,
enable runtime, expose runtime commands, or start runtime. `serve-runtime` and
`serve-runtime --dry-run` remain default-blocked.
Phase 5.24 adds prerequisite evaluation integration checkpoint docs/status
metadata and a core review helper only. It connects in-memory prerequisite
source ingestion, source selection, source bundling, bundle consumption, and the
review-only evaluator summary, but adds no Phase 5.24 CLI command,
integration-checkpoint command, bundle-consumption command, source-bundle
command, approval prerequisite reader command, approval evaluator command,
approval grant command, runtime start path, live stdin loop, stdout/stderr
runtime writer, process spawning or supervision, runtime transcript/audit write,
filesystem watcher, external source lookup, secrets/env ingestion, adapter or
Content Fabric runtime behavior, WebSocket/HTTP surface, Rust source change, or
change to `apps/cli/src/index.mjs`. Valid integration checkpoints cannot produce
a grant, enable runtime, expose runtime commands, or start runtime.
`serve-runtime` and `serve-runtime --dry-run` remain default-blocked.

Phase 5.25 adds non-authorizing review artifact boundary docs/status metadata
and a core review helper only. It represents valid Phase 5.24 integrated review
summaries only as non-authorizing review artifacts, but adds no Phase 5.25 CLI
command, review-artifact-boundary command, approval grant command, runtime
permission command, command-exposure command, runtime start path, live stdin
loop, stdout/stderr runtime writer, process spawning or supervision, runtime
transcript/audit write, filesystem watcher, external source lookup, secrets/env
ingestion, adapter or Content Fabric runtime behavior, WebSocket/HTTP surface,
Rust source change, or change to `apps/cli/src/index.mjs`. Valid review
artifacts cannot produce or persist a grant, grant runtime permission, enable
runtime, expose runtime commands, or start runtime. `serve-runtime` and
`serve-runtime --dry-run` remain default-blocked.
Phase 5.26 adds review artifact evaluator-input handoff docs/status metadata
and a core review helper only. It represents valid Phase 5.25 review artifacts
only as evaluator-input candidates, but adds no Phase 5.26 CLI command,
review-artifact-evaluator-input-handoff command, evaluator-input candidate
command, approval evaluator input command, approval grant command, runtime
permission command, command-exposure command, runtime start path, live stdin
loop, stdout/stderr runtime writer, process spawning or supervision, runtime
transcript/audit write, filesystem watcher, external source lookup, secrets/env
ingestion, adapter or Content Fabric runtime behavior, WebSocket/HTTP surface,
Rust source change, or change to `apps/cli/src/index.mjs`. Evaluator-input
candidates cannot produce or persist a grant, grant runtime or command exposure
permission, enable runtime, expose runtime commands, or start runtime.
`serve-runtime` and `serve-runtime --dry-run` remain default-blocked.
Phase 5.27 adds approval-evaluator candidate intake checkpoint docs/status
metadata and a core review helper only. It represents valid Phase 5.26
evaluator-input candidates only as review-only intake checkpoint state, but adds
no Phase 5.27 CLI command, approval-evaluator-candidate-intake command, approval
grant command, runtime permission command, command-exposure command, runtime
start path, live stdin loop, stdout/stderr runtime writer, process spawning or
supervision, runtime transcript/audit write, filesystem watcher, external
source lookup, secrets/env ingestion, adapter or Content Fabric runtime
behavior, WebSocket/HTTP surface, Rust source change, or change to
`apps/cli/src/index.mjs`. Intake checkpoint state cannot produce or persist a
grant, grant runtime or command exposure permission, enable runtime, expose
runtime commands, or start runtime. `serve-runtime` and
`serve-runtime --dry-run` remain default-blocked.
Phase 5.28 adds review-only evaluator preflight checkpoint docs/status
metadata and a core review helper only. It represents valid Phase 5.27 intake
checkpoint state only as review-only evaluator preflight checkpoint state, but
adds no Phase 5.28 CLI command, review-only-evaluator-preflight command,
approval-evaluator preflight command, approval grant command, runtime
permission command, command-exposure command, evaluator execution path, runtime
start path, live stdin loop, stdout/stderr runtime writer, process spawning or
supervision, runtime transcript/audit write, filesystem watcher, external
source lookup, secrets/env ingestion, adapter or Content Fabric runtime
behavior, WebSocket/HTTP surface, Rust source change, or change to
`apps/cli/src/index.mjs`. Preflight checkpoint state cannot produce or persist
a grant, grant runtime or command exposure permission, enable runtime, expose
runtime commands, start runtime, or execute an evaluator. `serve-runtime` and
`serve-runtime --dry-run` remain default-blocked.
Phase 5.29 adds non-authorizing evaluator decision-candidate boundary
docs/status metadata and a core review helper only. It represents valid Phase
5.28 preflight checkpoint state only as review-only evaluator
decision-candidate state, but adds no Phase 5.29 CLI command,
evaluator-decision-candidate command, approval-evaluator decision command,
approval decision command, approval grant command, runtime permission command,
command-exposure command, evaluator execution path, runtime start path, live
stdin loop, stdout/stderr runtime writer, process spawning or supervision,
runtime transcript/audit write, filesystem watcher, external source lookup,
secrets/env ingestion, adapter or Content Fabric runtime behavior,
WebSocket/HTTP surface, Rust source change, or change to
`apps/cli/src/index.mjs`. Decision-candidate state cannot produce an approval
decision, produce or persist a grant, grant runtime or command exposure
permission, enable runtime, expose runtime commands, start runtime, or execute
an evaluator. `serve-runtime` and `serve-runtime --dry-run` remain
default-blocked.
Phase 5.30 adds non-authorizing evaluator decision-candidate inspection
artifact docs/status metadata and a core review helper only. It represents
valid Phase 5.29 decision-candidate state only as a review-only inspection
artifact, but adds no Phase 5.30 CLI command, inspection-artifact command,
evaluator-result command, approval decision command, approval grant command,
runtime permission command, command-exposure command, evaluator execution path,
runtime start path, live stdin loop, stdout/stderr runtime writer, process
spawning or supervision, runtime transcript/audit write, filesystem watcher,
external source lookup, secrets/env ingestion, adapter or Content Fabric runtime
behavior, WebSocket/HTTP surface, Rust source change, or change to
`apps/cli/src/index.mjs`. Inspection artifacts cannot produce evaluator
results, produce approval decisions, produce or persist grants, grant runtime or
command exposure permission, enable runtime, expose runtime commands, start
runtime, or execute an evaluator. `serve-runtime` and `serve-runtime --dry-run`
remain default-blocked.
Phase 5.31 adds review-only human/tool inspection disposition boundary
docs/status metadata and a core review helper only. It represents valid Phase
5.30 inspection artifacts only as non-authorizing disposition state for later
human/tool inspection, but adds no Phase 5.31 CLI command, disposition-boundary
command, evaluator-result command, approval decision command, approval grant
command, runtime permission command, command-exposure command, evaluator
execution path, runtime start path, live stdin loop, stdout/stderr runtime
writer, process spawning or supervision, runtime transcript/audit write,
filesystem watcher, external source lookup, secrets/env ingestion, adapter or
Content Fabric runtime behavior, WebSocket/HTTP surface, Rust source change, or
change to `apps/cli/src/index.mjs`. Disposition state cannot produce evaluator
results, produce approval decisions, produce or persist grants, grant runtime or
command exposure permission, enable runtime, expose runtime commands, start
runtime, or execute an evaluator. `serve-runtime` and `serve-runtime --dry-run`
remain default-blocked.
See
`docs/phase-4-2a-deliberately-blocked-rust-host-stdio-runtime-skeleton.md` and
`docs/phase-4-2b-blocked-lifecycle-failure-audit-skeleton.md` and
`docs/phase-4-2c-runtime-readiness-review-gate.md` and
`docs/phase-4-2d-external-review-disposition-phase5-handoff.md` and
`docs/phase-5-1-controlled-runtime-implementation-approval-handoff.md`, and
`docs/phase-5-2-guarded-runtime-implementation-slice.md`, and
`docs/phase-5-3-command-surface-approval-preflight.md`, and
`docs/phase-5-4-disabled-command-exposure-plan.md`, and
`docs/phase-5-4a-jules-review-disposition.md`, and
`docs/phase-5-5-default-blocked-runtime-cli.md`, and
`docs/phase-5-6-runtime-enable-preconditions.md`, and
`docs/phase-5-7-runtime-approval-validation.md`, and
`docs/phase-5-8-runtime-command-exposure-approval.md`, and
`docs/phase-5-9-approval-evaluator-grant-boundary.md`, and
`docs/phase-5-10-runtime-host-policy-boundary.md`, and
`docs/phase-5-11-runtime-stdio-safety-boundary.md`, and
`docs/phase-5-12-runtime-transcript-audit-boundary.md`, and
`docs/phase-5-13-runtime-process-control-boundary.md`, and
`docs/phase-5-14-runtime-rollback-kill-switch-boundary.md`, and
`docs/phase-5-15-positive-runtime-smoke-requirement.md`, and
`docs/phase-5-16-runtime-enable-readiness-checkpoint.md`, and
`docs/phase-5-17-guarded-runtime-implementation-plan.md`, and
`docs/phase-5-18-review-only-approval-evaluator-skeleton.md`, and
`docs/phase-5-19-approval-prerequisite-reader-hardening.md`, and
`docs/phase-5-20-approval-prerequisite-source-ingestion-preflight.md`, and
`docs/phase-5-21-approval-prerequisite-source-selection.md`, and
`docs/phase-5-22-approval-prerequisite-source-bundle.md`, and
`docs/phase-5-23-prerequisite-bundle-consumption-checkpoint.md`, and
`docs/phase-5-24-prerequisite-evaluation-integration-checkpoint.md`, and
`docs/phase-5-25-non-authorizing-review-artifact-boundary.md`, and
`docs/phase-5-26-review-artifact-evaluator-input-handoff.md`, and
`docs/phase-5-27-approval-evaluator-candidate-intake-checkpoint.md`, and
`docs/phase-5-28-review-only-evaluator-preflight-checkpoint.md`, and
`docs/phase-5-29-non-authorizing-evaluator-decision-candidate-boundary.md`, and
`docs/phase-5-30-non-authorizing-evaluator-decision-candidate-inspection-artifact.md`, and
`docs/phase-5-31-human-tool-inspection-disposition-boundary.md`.

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

Phase 5.5 recognizes `serve-runtime` as a default-blocked runtime CLI command.
It exits nonzero, keeps stdout empty, and prints deterministic
runtime-unavailable stderr. `--dry-run` is also rejected and cannot bypass the
block. Runtime enablement, approval commands, live stdin loops, stdout/stderr
runtime writers, process control, transcript or audit writes, adapter/Fabric
runtime behavior, WebSocket/HTTP surfaces, and Rust source changes remain
blocked. See `docs/phase-5-5-default-blocked-runtime-cli.md`.

Phase 5.6 records runtime enablement preconditions only. Approval, host-policy,
stdio safety, transcript/audit confinement, process-control, rollback and
kill-switch, and positive runtime smoke requirements are blocked and
unsatisfied. It changes no CLI source and keeps `serve-runtime`
default-blocked. See `docs/phase-5-6-runtime-enable-preconditions.md`.

Phase 5.7 records runtime approval validation cases only. Missing, invalid, and
revoked approval cases are rejected; valid approval is recognized only as a
prerequisite signal and cannot enable runtime. It changes no CLI source and
keeps `serve-runtime` default-blocked. See
`docs/phase-5-7-runtime-approval-validation.md`.

Phase 5.8 records runtime command-exposure approval cases only. Missing,
invalid, and revoked command-exposure approval cases are rejected; valid
command-exposure approval is recognized only as a prerequisite signal and
cannot enable runtime, start runtime, expose runtime execution, or create
command aliases. It changes no CLI source and keeps `serve-runtime`
default-blocked. See
`docs/phase-5-8-runtime-command-exposure-approval.md`.

Phase 5.9 records approval evaluator/grant boundary cases only. Valid runtime
approval and valid command-exposure approval are recognized only as prerequisite
signals and cannot create an approval evaluator, produce or persist an approval
grant, enable runtime, start runtime, or expose runtime execution. It changes
no CLI source and keeps `serve-runtime` default-blocked. See
`docs/phase-5-9-approval-evaluator-grant-boundary.md`.

Phase 5.10 records runtime host-policy boundary cases only. Missing, invalid,
and permissive/unbounded host-policy enforcement are rejected. Valid restrictive
host-policy enforcement is recognized only as a prerequisite signal and cannot
enable runtime, start runtime, or expose runtime execution. It changes no CLI
source and keeps `serve-runtime` default-blocked. See
`docs/phase-5-10-runtime-host-policy-boundary.md`.

Phase 5.11 records runtime stdio safety boundary cases only. Missing, invalid,
and unbounded stdin/stdout/stderr behavior are rejected. Valid restrictive stdio
safety is recognized only as a prerequisite signal and cannot enable runtime,
start runtime, or expose runtime execution. It changes no CLI source and keeps
`serve-runtime` default-blocked. See
`docs/phase-5-11-runtime-stdio-safety-boundary.md`.

Phase 5.12 records runtime transcript/audit confinement boundary cases only.
Missing, invalid, and unbounded runtime transcript/audit writes are rejected.
Valid restrictive transcript/audit confinement is recognized only as a
prerequisite signal and cannot enable runtime, start runtime, or expose runtime
execution. It changes no CLI source and keeps `serve-runtime` default-blocked.
See `docs/phase-5-12-runtime-transcript-audit-boundary.md`.

Phase 5.13 records runtime process-control boundary cases only. Missing,
invalid, and unbounded process spawning, termination, or supervision are
rejected. Valid restrictive process control is recognized only as a prerequisite
signal and cannot enable runtime, start runtime, or expose runtime execution.
It changes no CLI source and keeps `serve-runtime` default-blocked. See
`docs/phase-5-13-runtime-process-control-boundary.md`.

Phase 5.14 records runtime rollback/kill-switch boundary cases only. Missing,
invalid, and non-deterministic or manual-only rollback are rejected. Valid
restrictive rollback/kill-switch policy is recognized only as a prerequisite
signal and cannot enable runtime, start runtime, expose runtime execution, shut
down runtime, roll back runtime, or activate a kill switch. It changes no CLI
source and keeps `serve-runtime` default-blocked. See
`docs/phase-5-14-runtime-rollback-kill-switch-boundary.md`.

Phase 5.15 records positive runtime smoke requirement cases only. Missing,
invalid, and non-guarded or non-deterministic runtime smoke coverage are
rejected. Valid positive runtime smoke coverage is recognized only as a
prerequisite signal and cannot enable runtime, start runtime, run runtime, or
expose runtime execution. It changes no CLI source and keeps `serve-runtime`
default-blocked. See
`docs/phase-5-15-positive-runtime-smoke-requirement.md`.

Phase 5.16 records a runtime enablement readiness checkpoint only. Phase 5.6
through Phase 5.15 preconditions are represented as contracts, but approval
records, command-exposure approvals, host-policy, stdio, transcript/audit,
process-control, rollback/kill-switch, and positive runtime smoke requirements
remain prerequisite-only or contract-only. It changes no CLI source, adds no
readiness or approval command, and keeps `serve-runtime` default-blocked. See
`docs/phase-5-16-runtime-enable-readiness-checkpoint.md`.

Phase 5.17 records a guarded runtime implementation plan only. The planned
sequence remains metadata-only and cannot expose commands, implement an
evaluator or grant, enable runtime, start runtime, or execute runtime. It
changes no CLI source and keeps `serve-runtime` default-blocked. See
`docs/phase-5-17-guarded-runtime-implementation-plan.md`.

Phase 5.18 records a review-only approval evaluator skeleton only. The core
helper can classify prerequisite records for review, but it is not
authoritative, produces no approval grant, enables no runtime, exposes no
runtime command, starts no runtime, and changes no CLI source. `serve-runtime`
remains default-blocked. See
`docs/phase-5-18-review-only-approval-evaluator-skeleton.md`.

Phase 5.19 records approval prerequisite reader hardening only. The core reader
normalizes missing, malformed, revoked, valid, duplicate, stale, and unknown
records for review, but it is not authoritative, produces no approval grant,
enables no runtime, exposes no runtime command, starts no runtime, and changes
no CLI source. `serve-runtime` remains default-blocked. See
`docs/phase-5-19-approval-prerequisite-reader-hardening.md`.

Phase 5.20 records approval prerequisite source ingestion preflight only. The
core helper classifies caller-provided in-memory source inputs before they may
feed the review-only reader, but it is not authoritative, produces no approval
grant, enables no runtime, exposes no runtime command, starts no runtime,
performs no filesystem watching or external lookup, ingests no secrets/env
data, and changes no CLI source. `serve-runtime` remains default-blocked. See
`docs/phase-5-20-approval-prerequisite-source-ingestion-preflight.md`.

Phase 5.21 records approval prerequisite source selection only. The core helper
selects among acceptable caller-provided in-memory prerequisite sources before
they may feed the review-only reader path, but it is not authoritative,
produces no approval grant, enables no runtime, exposes no runtime command,
starts no runtime, performs no filesystem watching or external lookup, ingests
no secrets/env data, and changes no CLI source. `serve-runtime` remains
default-blocked. See
`docs/phase-5-21-approval-prerequisite-source-selection.md`.

Phase 5.22 records approval prerequisite source bundling only. The core helper
bundles selected caller-provided in-memory prerequisite sources before they may
feed the review-only reader path, but it is not authoritative, produces no
approval grant, enables no runtime, exposes no runtime command, starts no
runtime, performs no filesystem watching or external lookup, ingests no
secrets/env data, and changes no CLI source. `serve-runtime` remains
default-blocked. See
`docs/phase-5-22-approval-prerequisite-source-bundle.md`.

Phase 5.23 records prerequisite bundle consumption checkpointing only. The core
helper consumes caller-provided in-memory Phase 5.22 bundle results before they
may be summarized for the review-only evaluator path, but it is not
authoritative, produces no approval grant, enables no runtime, exposes no
runtime command, starts no runtime, performs no filesystem watching or external
lookup, ingests no secrets/env data, and changes no CLI source. `serve-runtime`
remains default-blocked. See
`docs/phase-5-23-prerequisite-bundle-consumption-checkpoint.md`.

Phase 5.24 records prerequisite evaluation integration checkpointing only. The
core helper connects caller-provided in-memory prerequisite source ingestion,
source selection, source bundling, bundle consumption, and the review-only
evaluator summary, but it is not authoritative, produces no approval grant,
enables no runtime, exposes no runtime command, starts no runtime, performs no
filesystem watching or external lookup, ingests no secrets/env data, and changes
no CLI source. `serve-runtime` remains default-blocked. See
`docs/phase-5-24-prerequisite-evaluation-integration-checkpoint.md`.

Phase 5.25 records non-authorizing review artifact boundary metadata only. The
core helper represents valid Phase 5.24 integrated review summaries as
review-only artifacts, but it is not authoritative, produces or persists no
approval grant, grants no runtime permission, enables no runtime, exposes no
runtime command, starts no runtime, performs no filesystem watching or external
lookup, ingests no secrets/env data, and changes no CLI source.
`serve-runtime` remains default-blocked. See
`docs/phase-5-25-non-authorizing-review-artifact-boundary.md`.

Phase 5.26 records review artifact evaluator-input handoff metadata only. The
core helper represents valid Phase 5.25 non-authorizing review artifacts as
review-only evaluator-input candidates, but it is not authoritative, produces
or persists no approval grant, grants no runtime or command exposure
permission, enables no runtime, exposes no runtime command, starts no runtime,
performs no filesystem watching or external lookup, ingests no secrets/env
data, and changes no CLI source. `serve-runtime` remains default-blocked. See
`docs/phase-5-26-review-artifact-evaluator-input-handoff.md`.

Phase 5.27 records approval-evaluator candidate intake checkpoint metadata
only. The core helper represents valid Phase 5.26 evaluator-input candidates as
review-only intake checkpoint state, but it is not authoritative, produces or
persists no approval grant, grants no runtime or command exposure permission,
enables no runtime, exposes no runtime command, starts no runtime, performs no
filesystem watching or external lookup, ingests no secrets/env data, and changes
no CLI source. `serve-runtime` remains default-blocked. See
`docs/phase-5-27-approval-evaluator-candidate-intake-checkpoint.md`.

Phase 5.28 records review-only evaluator preflight checkpoint metadata only.
The core helper represents valid Phase 5.27 intake checkpoint state as
review-only evaluator preflight checkpoint state, but it is not authoritative,
produces or persists no approval grant, grants no runtime or command exposure
permission, enables no runtime, exposes no runtime command, starts no runtime,
executes no evaluator, performs no filesystem watching or external lookup,
ingests no secrets/env data, and changes no CLI source. `serve-runtime` remains
default-blocked. See
`docs/phase-5-28-review-only-evaluator-preflight-checkpoint.md`.

Phase 5.29 records non-authorizing evaluator decision-candidate boundary
metadata only. The core helper represents valid Phase 5.28 preflight checkpoint
state as review-only evaluator decision-candidate state, but it is not an
approval decision, is not an approval grant, produces or persists no approval
grant, grants no runtime or command exposure permission, enables no runtime,
exposes no runtime command, starts no runtime, executes no evaluator, performs
no filesystem watching or external lookup, ingests no secrets/env data, and
changes no CLI source. `serve-runtime` remains default-blocked. See
`docs/phase-5-29-non-authorizing-evaluator-decision-candidate-boundary.md`.

Phase 5.30 records non-authorizing evaluator decision-candidate inspection
artifact metadata only. The core helper represents valid Phase 5.29
decision-candidate state as a review-only inspection artifact, but it is not an
evaluator result, approval decision, approval grant, runtime permission, or
command exposure permission. It executes no evaluator, produces no evaluator
result, produces no approval decision, produces or persists no approval grant,
grants no runtime or command exposure permission, enables no runtime, exposes no
runtime command, starts no runtime, performs no filesystem watching or external
lookup, ingests no secrets/env data, and changes no CLI source. `serve-runtime`
remains default-blocked. See
`docs/phase-5-30-non-authorizing-evaluator-decision-candidate-inspection-artifact.md`.

Phase 5.31 records review-only human/tool inspection disposition boundary
metadata only. The core helper represents valid Phase 5.30 inspection artifacts
as non-authorizing disposition state for later human/tool inspection, but it is
not an evaluator result, approval decision, approval grant, runtime permission,
or command exposure permission. It executes no evaluator, produces no evaluator
result, produces no approval decision, produces or persists no approval grant,
grants no runtime or command exposure permission, enables no runtime, exposes no
runtime command, starts no runtime, performs no filesystem watching or external
lookup, ingests no secrets/env data, and changes no CLI source. `serve-runtime`
remains default-blocked. See
`docs/phase-5-31-human-tool-inspection-disposition-boundary.md`.
