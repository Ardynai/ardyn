# ARDYN

ARDYN is an open-source AI harness/framework for defining local and networked agent-system contracts with explicit manifests, capabilities, task contracts, and adapter boundaries.

ARDYN is not Locus and is not Multiverse.

- Future Locus integrations may run, observe, or control ARDYN through versioned public ARDYN APIs and adapters after explicit host-policy, approval, and permission semantics exist.
- Multiverse is an external closed-source product/network. ARDYN can optionally register with Multiverse through an adapter, but Multiverse is not required to run ARDYN.
- OpenClaw, Hermes, Agent Zero, Space Agent, HiClaw, AgentScope, and related systems are references only. ARDYN does not copy their source code.

## Phase 3 through Phase 5.10 Scope

This repository is currently in Phase 5.10 runtime host-policy boundary
mode. The goal is to load and validate ARDYN manifests and tasks, resolve
requested capabilities into deterministic non-executing plans, report static
TypeScript/Rust host identity, expose dry-run handshake data, emit finite
dry-run session-event JSONL, define the stdout/stderr, redaction, transcript
persistence, replay, failure-audit, terminal-state, cleanup/kill, and exit
mapping policies required before any live stdio runtime can exist, codify those
Phase 4.0C policies as inert Rust-host contract types, and export those
contracts as deterministic review-only JSON metadata with static host-policy
review-record fixtures, compatibility classification, and display-only
comparison records plus a static reviewer handoff index for Devin/Codex review
workflows, a final static readiness checklist, a proposal-only runtime
implementation plan, and static host-policy approval records/operator-consent
fields plus static Rust-host transport harness contracts plus static stdout
JSONL framing, stderr redaction, transcript persistence/replay, and
failure-audit/kill-semantics review helpers, a static runtime-readiness
checkpoint, and an external review packet for Devin/human reviewer handoff
plus a static external review disposition record for the Devin targeted fix
plus private Rust `#[cfg(test)]` in-memory tests and docs/report inventory for
the first Rust-host stdio test harness layer plus fixture-backed boundary
fixtures and replay tests that keep the private harness out of the public
runtime contract plus approval-gated public Rust-host stdio runtime contract
gates that keep runtime implementation approval, runtime enablement, process
stdio ownership, and CLI source changes blocked plus a runtime
implementation-readiness design, blocker burn-down, and Phase 4.2A handoff
record that allows planning only a deliberately blocked Rust-host stdio
skeleton while runtime enablement remains blocked plus an internal Rust
library skeleton that plans frames and gate state but always returns blocked
or `runtime_unavailable` plus a blocked lifecycle/failure-audit skeleton that
plans start, stop, kill, execute, transcript, and audit outcomes without
process control or write side effects plus a readiness gate and Jules/Devin
review packet that consolidates 4.1I through 4.2B evidence, records open
runtime enablement blockers, and allows external review preparation without
runtime approval plus a Jules post-merge APPROVE disposition for Phase 4.2C
and a Phase 5.1 controlled runtime implementation approval record that approves
proceeding to a separate future implementation phase only plus Phase 5.2
private Rust-host guarded runtime planning helpers, fixture-backed blocked
runtime checks, and report metadata plus Phase 5.3 command surface approval
preflight documentation and status metadata plus Phase 5.4 disabled command
exposure planning, future CLI checklist, Jules/Devin review packet, rollback
plan, command-surface diff-risk notes, and report metadata plus Phase 5.4A
Jules `APPROVE` review disposition metadata plus Phase 5.5 default-blocked
`serve-runtime` CLI recognition plus Phase 5.6 runtime enablement precondition
gate metadata plus Phase 5.7 runtime approval validation/rejection contract
metadata for missing, invalid, revoked, and valid-prerequisite-only approval
records plus Phase 5.8 runtime command-exposure approval/rejection contract
metadata for missing, invalid, revoked, and valid-prerequisite-only
command-exposure approval records plus Phase 5.9 approval evaluator/grant
boundary metadata proving valid runtime approval and command-exposure approval
signals remain prerequisite-only and do not create an evaluator, produce a
grant, enable runtime, start runtime, or expose runtime execution plus Phase
5.10 runtime host-policy enforcement boundary metadata proving missing,
invalid, and permissive/unbounded host-policy enforcement is rejected while a
valid restrictive host-policy enforcement record remains prerequisite-only and
cannot enable runtime, start runtime, or expose runtime execution. Phase 5.10
is not runtime enablement.
Runtime command enablement, live runtime behavior,
adapter/Fabric runtime behavior, stdout/stderr writers, process control,
transcript/audit side effects, and CLI runtime commands remain blocked before
any separately approved live runtime work.

Included now:

- Architecture and adapter-boundary documentation.
- Content Fabric v1.0.0 conformance foundation.
- JSON Schemas for ARDYN manifests, capabilities, and tasks.
- Schema-matching TypeScript and Rust contract types.
- Minimal TypeScript core functions for manifest loading, validation, capability normalization, and static handshakes.
- Minimal task loading, validation, deterministic ranked capability resolution, approval-gate data, approval-decision records, and planner traces.
- Stable approval review artifacts for planning review and trace comparison.
- Local `review-trace` comparison for JSON approval review artifacts.
- Review-artifact version validation, display normalization, and display
  summary helpers for Phase 3.6 viewer contracts.
- Schema migration metadata and review-artifact attestation planning helpers
  for Phase 3.7 review workflows.
- Phase 3.8 harness identity alignment with canonical slug `ardyn`, Locus
  read-only display contract freeze, Content Fabric family reconciliation, and
  stdio-first session-event schemas/examples.
- Phase 3.9 static session-transcript review contracts, host-policy
  preconditions for future stdio framing, and local-only reporting metadata for
  transcript validation.
- Phase 3.10 session-transcript versioning policy, read-only Locus display
  summary fields, and local-only report metadata for compatibility examples.
- Phase 4.0A finite stdio dry-run session-event emission to stdout as JSONL,
  with diagnostics on stderr and no live stdin command loop.
- Phase 4.0B strict `emit-session-events` argument validation, negative input
  diagnostics, golden JSONL fixture coverage, and future Rust-host stdio
  ownership design notes.
- Phase 4.0C pre-runtime transport policy for stdout/stderr ownership, JSONL
  framing, stderr redaction, backpressure, partial writes, line-integrity
  failures, process exit semantics, and proposal-only transcript replay design.
- Phase 4.0D Rust-host stdio transport policy contract types, fail-closed
  defaults, and unit/static tests that keep all runtime ownership inactive.
- Phase 4.0E deterministic Rust-host policy metadata JSON export, golden
  fixture, fail-closed deserialization tests, digest helper, and future
  host-policy review-record mapping.
- Phase 4.0F versioned host-policy review-record fixtures, compatibility
  classification, fail-closed malformed/unsupported/rejected policy handling,
  and inert approval/rejection review metadata.
- Phase 4.0G TypeScript core display-only comparison helpers, deterministic
  comparison fixtures, fail-closed digest/runtime-status evidence, and inert
  approval/rejection comparison metadata.
- Phase 4.0H static reviewer handoff/index documentation and deterministic
  metadata for Phase 4.0A through 4.0H artifacts, with normative versus
  evidence-only roles and no runtime approval grant.
- Phase 4.0I final pre-runtime readiness documentation and deterministic
  metadata for Phase 4.0A through 4.0I checklist and invariant review, with
  Phase 4.1 still blocked unless separately approved.
- Phase 4.1 runtime proposal documentation and deterministic metadata for the
  approval boundary, future Rust-host stdio ownership responsibilities, stdout
  JSONL emission responsibilities, stderr diagnostic/redaction enforcement,
  transcript persistence/replay design, failure audit records, kill/exit
  fail-closed semantics, backpressure and partial-write handling,
  dropped/duplicate/out-of-order/malformed-line behavior, required tests, and
  phased roadmap. It is proposal-only and grants no runtime approval.
- Phase 4.1A static host-policy approval-record helpers, deterministic
  operator-consent fixtures, compatibility classification, denial/fail-closed
  reason coverage, and report metadata. Approval records are review/audit
  artifacts only; operator consent is necessary but not sufficient and grants
  no runtime approval.
- Phase 4.1B static Rust-host transport harness contracts, deterministic
  fixtures, fail-closed classification coverage, and report metadata. The
  contracts are review metadata only; approval references are necessary but not
  sufficient and current contracts do not enable runtime. See
  `docs/phase-4-1b-transport-harness-contracts.md`.
- Phase 4.1C static TypeScript stdout JSONL whole-line framing and stderr
  redaction review helpers, deterministic fixtures, fail-closed classification
  coverage, and report metadata. The contracts are review metadata only; no
  live writer exists, no process stdio ownership exists, and future runtime
  must use these rules but is not implemented yet. See
  `docs/phase-4-1c-framing-redaction-contracts.md`.
- Phase 4.1D static TypeScript transcript persistence and replay contract
  review helpers, deterministic fixtures, fail-closed compatibility
  classification coverage, and report metadata. The contracts are review
  metadata only; no transcript persistence runtime exists, no replay runtime
  exists, and `replay-session-transcript` remains rejected. See
  `docs/phase-4-1d-transcript-replay-contracts.md`.
- Phase 4.1E static TypeScript failure-audit, terminal-state, cleanup/kill,
  and nonzero-exit mapping review helpers, deterministic fixtures, fail-closed
  classification coverage, and report metadata. The contracts are review
  metadata only; no failure-audit runtime exists, no cleanup runtime exists, no
  process killing exists, and failure-audit/cleanup/kill/runtime commands
  remain rejected. See
  `docs/phase-4-1e-failure-audit-kill-semantics.md`.
- Phase 4.1F static runtime-readiness checkpoint documentation, deterministic
  fixture metadata, blocker inventory, validation bundle, and report metadata.
  The checkpoint is review metadata only; no runtime-readiness command,
  checkpoint command, runtime command, or runtime approval grant exists. See
  `docs/phase-4-1f-runtime-readiness-checkpoint.md`.
- Phase 4.1G static external review packet documentation, deterministic
  fixture metadata, reviewer questions, blocked runtime surfaces, packet-only
  outcomes, and report metadata. The packet is review metadata only; no
  external-review-packet command, review-packet command, runtime-readiness
  review command, runtime command, or runtime approval grant exists. See
  `docs/phase-4-1g-external-review-packet.md`.
- Phase 4.1H static external review disposition documentation, deterministic
  fixture metadata, Devin targeted-fix evidence, validation/smoke summaries,
  and report metadata. The disposition is review metadata only; it is not a
  fresh Devin re-review, cannot grant runtime approval, and only allows
  planning the first Rust-host stdio runtime test harness as a separate next
  step. See `docs/phase-4-1h-external-review-disposition.md`.
- Phase 4.1I private Rust-host stdio test harness tests plus documentation and
  report inventory. The harness layer is test infrastructure only; it records
  no fresh Devin review, adds no runtime command, changes no production
  runtime source, and leaves runtime blocked. See
  `docs/phase-4-1i-rust-host-stdio-harness.md`.
- Phase 4.1J fixture-backed Rust-host stdio boundary fixtures, private Rust
  replay tests, documentation, and report inventory. It is not runtime
  readiness, records no fresh external review, keeps the private harness from
  becoming a public runtime contract, and leaves runtime blocked. See
  `docs/phase-4-1j-fixture-backed-stdio-boundaries.md`.
- Phase 4.1K approval-gated public Rust-host stdio runtime contract gates,
  documentation, and report inventory. The public Rust contract surface is
  recorded as review-only contract metadata; runtime implementation approval,
  runtime enablement, process stdio ownership, CLI source changes, fresh
  external review, and fresh Devin review remain false. See
  `docs/phase-4-1k-stdio-runtime-contract-gates.md`.
- Phase 4.1L runtime implementation-readiness documentation, deterministic
  readiness/checklist fixture, blocker burn-down, 4.2A handoff, focused tests,
  and report inventory. It records that 4.2A skeleton entry may be planned
  while runtime enablement remains blocked; it adds no runtime command and
  does not change `apps/cli/src/index.mjs`. See
  `docs/phase-4-1l-runtime-implementation-readiness.md`.
- Phase 4.2A deliberately blocked Rust-host stdio runtime skeleton code,
  fixture expectations, documentation, focused Rust tests, focused Node
  source guards, and report inventory. The skeleton is internal library code
  only; valid frames map to blocked plans, runtime/approval requests remain
  rejected, and no CLI command or live runtime path is added. See
  `docs/phase-4-2a-deliberately-blocked-rust-host-stdio-runtime-skeleton.md`.
- Phase 4.2B deliberately blocked Rust-host lifecycle/failure-audit skeleton
  code, fixture expectations, documentation, focused Rust tests, focused Node
  source guards, and report inventory. It plans start, stop, kill, execute,
  transcript, and audit outcomes in memory while process control, transcript
  writes, failure-audit writes, runtime commands, approval grants, and CLI
  source changes remain blocked. See
  `docs/phase-4-2b-blocked-lifecycle-failure-audit-skeleton.md`.
- Phase 4.2C runtime readiness review gate documentation, deterministic
  fixture metadata, Jules/Devin review packet, blocker burn-down, external
  review status rules, focused tests, and report inventory. It is ready for
  external review only before the Phase 4.2D disposition; it is not runtime
  approval, does not change CLI source, and keeps runtime blocked. See
  `docs/phase-4-2c-runtime-readiness-review-gate.md`.
- Phase 4.2D external review disposition documentation, deterministic fixture
  metadata, focused tests, and report inventory recording Jules's post-merge
  Phase 4.2C `APPROVE` verdict as external-review disposition only. It closes
  the fresh Jules/Devin external-review blocker, creates the Phase 5.1 handoff,
  does not approve runtime implementation or command surfaces, does not change
  CLI source, and keeps runtime blocked. See
  `docs/phase-4-2d-external-review-disposition-phase5-handoff.md` and
  `docs/phase-5-1-controlled-runtime-implementation-approval-handoff.md`.
- Phase 5.1 controlled runtime implementation approval documentation and
  report metadata plus the approval-boundary fixture
  `tests/fixtures/host-policy/phase5-1/controlled-runtime-implementation-approval-boundary.json`
  and command-surface review matrix
  `tests/fixtures/command-surface/phase5-1/runtime-command-surface-review-matrix.json`.
  These record approval to proceed with a separate future implementation phase
  only. They do not enable runtime, approve runtime command exposure, add
  stdout/stderr writers, add process control, add transcript/audit side
  effects, change `apps/cli/src/index.mjs`, or alter adapter/Fabric runtime
  behavior. See
  `docs/phase-5-1-controlled-runtime-implementation-approval-handoff.md`.
- Phase 5.2 guarded runtime implementation slice documentation and report
  metadata. This records the guarded implementation-slice status while
  runtime command exposure, runtime enablement, approval commands, process
  control, transcript/audit write side effects, adapter/Fabric runtime
  behavior, and changes to `apps/cli/src/index.mjs` remain blocked. See
  `docs/phase-5-2-guarded-runtime-implementation-slice.md`.
- Phase 5.3 command surface approval preflight documentation and report
  metadata. This records the current command-surface preflight status and the
  future command contract/review-packet checklist while runtime command
  exposure, runtime enablement, approval commands, process control,
  transcript/audit write side effects, adapter/Fabric runtime behavior, and
  changes to `apps/cli/src/index.mjs` remain blocked. It inventories
  `tests/fixtures/command-surface/phase5-3/command-surface-approval-preflight.json`.
  See `docs/phase-5-3-command-surface-approval-preflight.md`.
- Phase 5.4 disabled command exposure plan documentation and report metadata.
  This records the reviewed disabled command exposure plan, future CLI
  implementation checklist, Jules/Devin review packet, rollback plan, and
  command-surface diff-risk notes while runtime command exposure, runtime
  enablement, approval commands, process control, transcript/audit write side
  effects, adapter/Fabric runtime behavior, Rust source changes, and changes
  to `apps/cli/src/index.mjs` remain blocked. See
  `docs/phase-5-4-disabled-command-exposure-plan.md`.
- Phase 5.4A Jules review disposition documentation and report metadata. This
  records Jules's `APPROVE` verdict for Phase 5.4, confirms no accidental
  command/runtime exposure, confirms `apps/cli/src/index.mjs` content stayed
  identical to the reviewed base, confirms current `main` already tracks that
  file as mode `100644`, and keeps runtime and command exposure blocked. See
  `docs/phase-5-4a-jules-review-disposition.md`.
- Phase 5.5 default-blocked runtime CLI documentation, fixture, and report
  metadata. This recognizes `serve-runtime` as a CLI command that always fails
  closed with nonzero exit, empty stdout, and deterministic runtime-unavailable
  stderr. `serve-runtime --dry-run` has the same blocked result. Runtime
  enablement, runtime execution, approval commands, process control,
  transcript/audit side effects, adapter/Fabric runtime behavior, and Rust
  source changes remain blocked. See
  `docs/phase-5-5-default-blocked-runtime-cli.md`.
- Phase 5.6 runtime enablement precondition gate documentation, fixture, and
  report metadata. This records the required approval, host-policy, stdio
  safety, transcript/audit confinement, process-control, rollback/kill-switch,
  and positive runtime smoke preconditions before any future runtime
  enablement. Every precondition is currently blocked and unsatisfied, and
  `serve-runtime` remains default-blocked. See
  `docs/phase-5-6-runtime-enable-preconditions.md`.
- Phase 5.7 runtime approval validation contract documentation, fixture, and
  report metadata. This records missing, invalid, revoked, and valid
  prerequisite-only approval cases. Valid approval remains necessary but not
  sufficient, cannot enable or start runtime, and `serve-runtime` remains
  default-blocked. See `docs/phase-5-7-runtime-approval-validation.md`.
- Phase 5.8 runtime command exposure approval contract documentation,
  fixture, and report metadata. This records missing, invalid, revoked, and
  valid prerequisite-only command-exposure approval cases. Valid
  command-exposure approval remains necessary but not sufficient, cannot enable
  or start runtime, cannot expose runtime execution, cannot add command
  aliases, and `serve-runtime` remains default-blocked. See
  `docs/phase-5-8-runtime-command-exposure-approval.md`.
- Phase 5.9 approval evaluator/grant boundary documentation, fixture, and
  report metadata. This records that valid runtime approval and valid
  command-exposure approval are prerequisite signals only. They do not create
  an approval evaluator, do not produce or persist an approval grant, cannot
  enable or start runtime, cannot expose runtime execution, and `serve-runtime`
  remains default-blocked. See
  `docs/phase-5-9-approval-evaluator-grant-boundary.md`.
- Phase 5.10 runtime host-policy boundary documentation, fixture, and report
  metadata. This records missing, invalid, and permissive/unbounded
  host-policy enforcement as rejected, and records valid restrictive
  host-policy enforcement as a prerequisite-only signal. It does not implement
  or activate host-policy runtime enforcement, cannot enable or start runtime,
  cannot expose runtime execution, and `serve-runtime` remains
  default-blocked. See `docs/phase-5-10-runtime-host-policy-boundary.md`.
- Metadata-only adapter registration stubs for OpenClaw, MCP, and the plugin API.
- Minimal Rust host functions for host info, platform info, optional manifest loading, and non-executing host handshakes.
- CLI commands for doctor, identity, capabilities, task planning, review-artifact display review, review-trace comparison, and dry-run serve planning.
- Schema, core, CLI, and Rust host tests.

Not included yet:

- Autonomous agent execution.
- Tool execution.
- Credential vaulting.
- Live Locus control.
- Multiverse registration.
- Browser or desktop automation.
- Production tool execution.
- A serving mode that opens ports, starts agents, calls APIs, or spawns long-running services.
- Content Fabric download, install, seed, enable, catalog serving, or execution.
- Plugin installation, torrent download, code-pack enablement, or agent loops.
- Production signing keys, secret handling, or runtime attestation trust gates.
- Live stdio session-event runtime, session-transcript runtime, WebSocket transport,
  HTTP transport, live Locus connector behavior, runtime transcript migration,
  plugin install, torrent behavior, or code-pack enablement behavior.

## Architecture

The preferred architecture is a Rust host plus TypeScript core.

- The Rust host owns local process supervision, OS integration, Windows-first packaging, policy enforcement, and safe host boundaries.
- The TypeScript core owns orchestration contracts, SDK surfaces, MCP integration, adapter interfaces, and developer-facing plugin APIs.
- JSON Schemas are the shared contract source for manifests, capabilities, and tasks.
- Content Fabric support is currently conformance-only under `packages/fabric`; runtime pack handling is future work.

## Testing

This repo uses npm workspaces; `package-lock.json` is the authoritative Node workspace lockfile.

```powershell
npm test
cargo test -p ardyn-host
```

The current test suite validates schema behavior, TypeScript manifest/handshake behavior, CLI output, and Rust host handshake behavior.

A `typecheck` script is deferred for now. The repository currently has JavaScript modules plus `.d.ts` contract files and a shared `tsconfig.base.json`, but no TypeScript compiler dependency or TypeScript source compilation path to check.

## Phase 3 and Phase 4.2D CLI Usage

Run non-executing commands directly from source through Phase 4.2D:

```powershell
node apps/cli/src/index.mjs doctor
node apps/cli/src/index.mjs identity
node apps/cli/src/index.mjs capabilities --manifest examples/minimal-manifest/ardyn.manifest.json
node apps/cli/src/index.mjs plan --manifest examples/minimal-manifest/ardyn.manifest.json --task examples/minimal-task/task.json
node apps/cli/src/index.mjs plan --review-artifact --manifest examples/minimal-manifest/ardyn.manifest.json --task examples/minimal-task/task.json
node apps/cli/src/index.mjs plan --review-artifact --manifest examples/minimal-manifest/ardyn.manifest.json --task examples/minimal-task/task.json --output approval-review-artifact.json
node apps/cli/src/index.mjs emit-session-events --dry-run --manifest examples/minimal-manifest/ardyn.manifest.json --task examples/minimal-task/task.json
npm exec ardyn -- review-artifact --file tests/fixtures/review-artifacts/phase3-6/current-compatible-v1.json --summary
npm exec ardyn -- review-artifact --file tests/fixtures/review-artifacts/phase3-6/compatible-unknown-fields.json --explain
npm exec ardyn -- review-artifact --file tests/fixtures/review-artifacts/phase3-7/older-compatible-review-artifact.json --schema-status
npm exec ardyn -- review-artifact --file tests/fixtures/review-artifacts/phase3-7/current-compatible-review-artifact.json --attestation-plan
node apps/cli/src/index.mjs review-trace --left tests/fixtures/trace-review/equal-left-approval-review-artifact.json --right tests/fixtures/trace-review/equal-right-approval-review-artifact.json
node apps/cli/src/index.mjs serve --dry-run --manifest examples/minimal-manifest/ardyn.manifest.json
```

Successful commands print JSON. Failure cases write plain text to stderr and do not print JSON to stdout. The `plan` command validates the task, scores candidate capabilities deterministically, and includes `plannerTrace` automatically unless a focused output mode is selected. Exact capability IDs score 300, capability tags score 200, and permission scopes score 100. Exact matches outrank tag matches, tag matches outrank scope matches, ties are sorted by capability ID, and no-match resolutions include empty candidates and selected capability IDs.

`plan --review-artifact --output <file>` is the only Phase 3.5 CLI path that
writes a file. It writes the formatted approval review artifact JSON only to
the requested output path and prints a compact JSON export summary to stdout.
It does not write adjacent files, open directories, contact services, or change
the plan data.

`review-trace --left <file> --right <file>` reads two local JSON review
artifacts and prints deterministic JSON. Default output reports the full diff;
`--summary` reports compact changed types and counts; `--explain` reports
review-oriented reasons and details. `--summary` and `--explain` are mutually
exclusive.

`review-artifact --file <file> --summary|--explain|--schema-status|--attestation-plan`
reads one local JSON approval review artifact and prints deterministic display
JSON. It validates a local file path only; URLs, `file:` URLs, and
network-style paths are rejected. It performs no writes, does not call
adapters, does not connect to Locus, does not load signing keys, and does not
produce production signatures.

The `plan`, `plan --trace`, `plan --summary`, `plan --explain`,
`plan --review-artifact`, `review-artifact`, `review-trace`,
`emit-session-events --dry-run`, and `serve --dry-run` commands are
intentionally non-executing: they do not open
network ports, execute tools, start agents, call APIs, install plugins,
download torrents, enable code packs, run agent loops, connect adapters, call
MCP/OpenClaw, connect to Locus, serve Content Fabric catalogs, or spawn
long-running services. Their output includes explicit false values for the
safety flags that cover those behaviors.

Phase 3.3-3.8 review examples:

```powershell
node apps/cli/src/index.mjs plan --manifest tests/fixtures/planning-manifest.json --task tests/fixtures/tasks/exact-match.json
node apps/cli/src/index.mjs plan --manifest tests/fixtures/planning-manifest.json --task tests/fixtures/tasks/tag-match.json
node apps/cli/src/index.mjs plan --manifest tests/fixtures/planning-manifest.json --task tests/fixtures/tasks/scope-match.json
node apps/cli/src/index.mjs plan --manifest tests/fixtures/planning-manifest.json --task tests/fixtures/tasks/no-match.json
node apps/cli/src/index.mjs plan --manifest tests/fixtures/planning-manifest.json --task tests/fixtures/tasks/approval-required.json
node apps/cli/src/index.mjs plan --trace --manifest tests/fixtures/planning-manifest.json --task tests/fixtures/tasks/tag-match.json
node apps/cli/src/index.mjs plan --summary --manifest tests/fixtures/planning-manifest.json --task tests/fixtures/tasks/approval-required.json
node apps/cli/src/index.mjs plan --explain --manifest tests/fixtures/planning-manifest.json --task tests/fixtures/tasks/exact-match.json
node apps/cli/src/index.mjs plan --review-artifact --manifest tests/fixtures/planning-manifest.json --task tests/fixtures/tasks/approval-required.json
node apps/cli/src/index.mjs plan --review-artifact --manifest tests/fixtures/planning-manifest.json --task tests/fixtures/tasks/approval-required.json --output approval-review-artifact.json
npm exec ardyn -- review-artifact --file tests/fixtures/review-artifacts/phase3-6/current-compatible-v1.json --summary
npm exec ardyn -- review-artifact --file tests/fixtures/review-artifacts/phase3-6/compatible-unknown-fields.json --explain
npm exec ardyn -- review-artifact --file tests/fixtures/review-artifacts/phase3-7/older-compatible-review-artifact.json --schema-status
npm exec ardyn -- review-artifact --file tests/fixtures/review-artifacts/phase3-7/current-compatible-review-artifact.json --attestation-plan
node apps/cli/src/index.mjs review-trace --left tests/fixtures/trace-review/equal-left-approval-review-artifact.json --right tests/fixtures/trace-review/equal-right-approval-review-artifact.json
node apps/cli/src/index.mjs review-trace --summary --left tests/fixtures/trace-review/equal-left-approval-review-artifact.json --right tests/fixtures/trace-review/selected-capability-changed-approval-review-artifact.json
node apps/cli/src/index.mjs review-trace --explain --left tests/fixtures/trace-review/equal-left-approval-review-artifact.json --right tests/fixtures/trace-review/approval-status-changed-approval-review-artifact.json
```

Review outcomes:

- Exact match: `exact-match.json` requests `network`, selects `network` by exact id with score `300`, and leaves lower-ranked tag and scope candidates visible for review.
- Tag match: `tag-match.json` requests `filesystem`, selects `alpha.tag` and `beta.tag` by tag with score `200`, and leaves the lower-ranked scope candidate visible.
- Scope match: `scope-match.json` requests `memory`, selects `network` by permission scope with score `100`, and does so only because no exact id or tag candidate exists for `memory`.
- No match: `no-match.json` requests `missing.capability`, selects nothing, and records the request in `unresolvedRequests`.
- Approval required: `approval-required.json` selects `secure.registry`, records task and policy approval reasons, reports `approval.status: "approval-required"`, and keeps `approvalDecision.nonExecuting: true`.
- Denied review simulation: a simulated planner decision with `approvalDecision.status: "denied"` is review metadata only. It may produce `approval.status: "approval-denied"` when approval is required, but it must not call cancellation hooks, run tools, connect adapters, spawn processes, or change safety flags.
- Trace: `plan --trace` prints the planner trace wrapper for intake, candidates, selected capabilities, unresolved requests, approval decision, and safety review.
- Summary: `plan --summary` prints selected capability ids, unresolved requests, approval data, and safety flags without the full trace.
- Explain: `plan --explain` prints deterministic candidate ranking, match reasons, approval reasons, and the same non-executing safety flags.
- Review artifact: `plan --review-artifact` prints a stable
  `ardyn.approval-review-artifact` JSON document with requested capability ids,
  deterministic candidate rankings, selected capability ids, unresolved
  requests, the approval decision, `nonExecuting: true`, and false safety flags.
- Review artifact export: `plan --review-artifact --output <file>` writes only
  that artifact JSON to the requested file path and prints a compact export
  summary to stdout.
- Review artifact display: `review-artifact --file <file> --summary|--explain`
  reads one local JSON artifact, renders deterministic display review JSON, and
  does not write files, connect adapters, or contact Locus.
- Schema status: `review-artifact --file <file> --schema-status` classifies
  schema migration metadata as `compatible`, `upgrade_available`,
  `unsupported_major`, or `malformed`, and reports whether a future migration is
  available or manual review is required.
- Attestation plan: `review-artifact --file <file> --attestation-plan` prints
  unsigned review-artifact attestation planning metadata with a deterministic
  digest, placeholder signer identity, planned algorithm field, no production
  signing keys, and false safety flags.
- Trace diff: `review-trace` compares local review artifacts. Reviewers should
  inspect selected capability changes, approval status changes, unresolved
  request changes, candidate ranking changes, and confirm all safety flags
  remain false.

The Phase 5.10 runtime host-policy boundary status report command is:

```powershell
npm run report:phase-status
```

That report must assemble local planning evidence only: docs, fixtures, tests,
review artifact APIs, versioning/display contract posture, migration metadata,
attestation planning posture, trace-comparison or trace-review artifacts,
host-policy precondition references, Phase 3.8 harness identity, Fabric family,
Phase 3.9 session-event and session-transcript contract evidence, Phase 3.10
session-transcript versioning/display metadata, Phase 4.0A dry-run event
emission metadata, Phase 4.0B hardening metadata, Phase 4.0C pre-runtime
transport policy metadata, Phase 4.0D Rust-host policy contract metadata,
Phase 4.0E policy metadata export/review-record mapping metadata, Phase 4.0F
static host-policy review-record metadata, Phase 4.0G display-only comparison
metadata, Phase 4.0H static reviewer handoff index metadata, Phase 4.0I final
pre-runtime readiness metadata, Phase 4.1 runtime proposal metadata, and
Phase 4.1A host-policy approval-record metadata, Phase 4.1B transport harness
contract metadata, Phase 4.1C framing/redaction contract metadata, Phase 4.1D
transcript persistence/replay contract metadata, Phase 4.1E failure-audit
kill-semantics contract metadata, Phase 4.1F runtime-readiness checkpoint
metadata, Phase 4.1G external review packet metadata, and safety posture.
Phase 4.1H external review disposition metadata, Phase 4.1I Rust-host stdio
test harness inventory, Phase 4.1J fixture-backed stdio boundary inventory,
Phase 4.1K approval-gated public Rust-host stdio runtime contract-gate
inventory, Phase 4.1L runtime implementation-readiness and 4.2A handoff
inventory, Phase 4.2A/4.2B blocked runtime skeleton inventories, Phase 4.2C
readiness gate inventory, Phase 4.2D Jules disposition/Phase 5 handoff
inventory, Phase 5.1 future-implementation-approval docs/status inventory,
Phase 5.2 guarded runtime implementation-slice fixture/test/Rust-private
helper inventory, Phase 5.3 command-surface approval preflight metadata, and
Phase 5.4 disabled command exposure plan metadata, Phase 5.4A Jules review
disposition metadata, Phase 5.5 default-blocked runtime CLI metadata, and
Phase 5.6 runtime enablement precondition gate metadata, Phase 5.7 runtime
approval validation contract metadata, and Phase 5.8 runtime command exposure
approval contract metadata, and Phase 5.9 approval evaluator/grant boundary
contract metadata, and Phase 5.10 runtime host-policy enforcement boundary
contract metadata
are included as the current static audit layers.
It must not run checks, start servers, spawn long-running processes, call
adapters, execute tools, write files, use secrets, call external CI, or imply
active Locus, Multiverse, MCP, OpenClaw, plugin, or Content Fabric runtime
integration.

Phase 4.1F is documented in
`docs/phase-4-1f-runtime-readiness-checkpoint.md`. It is a static
runtime-readiness checkpoint only: it cannot grant runtime approval, cannot
enable `serve-runtime`, `stdio-runtime`, or `replay-session-transcript`, and
future live runtime work must be a separate approved phase.

Phase 4.1G is documented in
`docs/phase-4-1g-external-review-packet.md`. It is an external review packet
only for Devin/human reviewer questions, evidence mapping, blocked runtime
surfaces, and packet-only outcomes. It cannot grant runtime approval, approve
runtime implementation, or enable runtime commands.

Phase 4.1H is documented in
`docs/phase-4-1h-external-review-disposition.md`. It records Devin's prior
targeted-fix disposition and the fixed Phase 4.1G SHA metadata evidence. It is
not a fresh Devin re-review, cannot grant runtime approval, and leaves runtime
blocked while allowing only a separate plan for the first Rust-host stdio
runtime test harness.

Phase 4.1I is documented in
`docs/phase-4-1i-rust-host-stdio-harness.md`. It records the first Rust-host
stdio test harness layer as private `#[cfg(test)]` in-memory Rust test
infrastructure plus docs/report inventory. It is not a fresh Devin review,
adds no runtime command, changes no production runtime source, and leaves
runtime blocked.

Phase 4.1J is documented in
`docs/phase-4-1j-fixture-backed-stdio-boundaries.md`. It records
fixture-backed Rust-host stdio boundary coverage for the private Phase 4.1I
harness and remains test infrastructure only.

Phase 4.1K is documented in
`docs/phase-4-1k-stdio-runtime-contract-gates.md`. It records approval-gated
public Rust-host stdio runtime contract gates only; runtime implementation
approval, runtime enablement, process stdio ownership, CLI source changes, and
runtime approval grants remain blocked.

Phase 4.1L is documented in
`docs/phase-4-1l-runtime-implementation-readiness.md`. It records runtime
implementation-readiness design, blocker burn-down, a deterministic
readiness/checklist fixture, and a concrete Phase 4.2A handoff. It is not a
fresh Devin or external re-review, does not change `apps/cli/src/index.mjs`,
does not enable runtime commands, and keeps runtime blocked.

Phase 4.2A is documented in
`docs/phase-4-2a-deliberately-blocked-rust-host-stdio-runtime-skeleton.md`.
It adds an internal Rust-host stdio skeleton that classifies and plans frames
in memory but returns blocked/unavailable results for every entrypoint. It is
not runtime readiness, does not change `apps/cli/src/index.mjs`, does not
enable runtime commands, and keeps runtime blocked.

Phase 4.2B is documented in
`docs/phase-4-2b-blocked-lifecycle-failure-audit-skeleton.md`. It adds
planned-only lifecycle, transcript, failure-audit, and kill-semantics helpers
inside the private Rust-host skeleton. It is not runtime readiness, does not
change `apps/cli/src/index.mjs`, does not enable runtime commands, and keeps
runtime blocked.

Phase 4.2C is documented in
`docs/phase-4-2c-runtime-readiness-review-gate.md`. It adds a readiness gate,
Jules/Devin review packet, blocker burn-down, and external-review status rules.
It was ready for external review before Phase 4.2D; it does not grant runtime
approval, does not change `apps/cli/src/index.mjs`, does not enable runtime
commands, and keeps runtime blocked.

Phase 4.2D is documented in
`docs/phase-4-2d-external-review-disposition-phase5-handoff.md`, with the next
handoff in
`docs/phase-5-1-controlled-runtime-implementation-approval-handoff.md`. It
records Jules's post-merge Phase 4.2C `APPROVE` verdict as external-review
disposition only, closes the fresh Jules/Devin review blocker, and creates a
Phase 5.1 approval-record/design handoff. It does not grant runtime
implementation approval, does not approve the runtime command surface, does not
change `apps/cli/src/index.mjs`, does not enable runtime commands, and keeps
runtime blocked.

Phase 5.1 is documented in
`docs/phase-5-1-controlled-runtime-implementation-approval-handoff.md`. It
records approval to proceed with a separate future controlled runtime
implementation phase only. It does not expose a runtime command, does not
enable runtime, does not add stdout/stderr writers or process control, does
not add transcript or audit write side effects, does not change
`apps/cli/src/index.mjs`, and does not alter adapter or Content Fabric runtime
behavior. The Phase 4.2D disposition remains the historical external-review
source for this boundary.

Phase 5.2 is documented in
`docs/phase-5-2-guarded-runtime-implementation-slice.md`. It adds private
Rust-host guarded planning helpers inside `crates/ardyn-host/src/stdio_runtime`
for bounded in-memory loop planning, planned-only redacted writer planning,
and fixture-only approval-boundary planning. The module remains private, the
CLI is unchanged, runtime-like commands still reject, and no live stdin reads,
stdout/stderr writes, process control, transcript/audit writes, approval grant,
adapter runtime behavior, WebSocket/HTTP surface, or Content Fabric runtime
execution is enabled.

Phase 5.3 is documented in
`docs/phase-5-3-command-surface-approval-preflight.md`. It records the
command-surface approval preflight and future command contract checklist only.
It does not expose runtime commands, does not change `apps/cli/src/index.mjs`,
does not grant approval, does not enable runtime, and does not alter adapter
or Content Fabric runtime behavior.

Phase 5.4 is documented in
`docs/phase-5-4-disabled-command-exposure-plan.md`. It records the disabled
command exposure plan, future CLI implementation checklist, Jules/Devin review
packet, rollback plan, and command-surface diff-risk notes only. It does not
expose runtime commands, does not change `apps/cli/src/index.mjs`, does not
change Rust source, does not grant approval, does not enable runtime, and does
not alter adapter or Content Fabric runtime behavior.

Phase 5.4A is documented in
`docs/phase-5-4a-jules-review-disposition.md`. It records Jules's `APPROVE`
disposition for Phase 5.4 and confirms runtime and command exposure remain
blocked. It verified `apps/cli/src/index.mjs` was already mode `100644` on
current `main`, so no chmod correction or content change was applied.

Phase 5.5 is documented in
`docs/phase-5-5-default-blocked-runtime-cli.md`. It recognizes `serve-runtime`
as a default-blocked CLI command that exits nonzero, writes zero stdout, and
reports deterministic runtime-unavailable stderr. It does not enable runtime,
does not bypass the block with `--dry-run`, and does not add Rust-host runtime
execution.

Phase 5.6 is documented in
`docs/phase-5-6-runtime-enable-preconditions.md`. It records a machine-readable
runtime enablement precondition gate covering approval, host policy, stdio
safety, transcript/audit confinement, process-control boundaries,
rollback/kill-switch behavior, and positive runtime smokes. The gate is not
satisfied, runtime remains disabled, and `serve-runtime` remains
default-blocked.

Phase 5.7 is documented in
`docs/phase-5-7-runtime-approval-validation.md`. It records a machine-readable
runtime approval validation contract covering missing, invalid, revoked, and
valid-prerequisite-only approval cases. Valid approval is only a prerequisite
signal; it cannot enable or start runtime, create an approval grant, expose a
command, or bypass the remaining Phase 5.6 blockers.

Phase 5.8 is documented in
`docs/phase-5-8-runtime-command-exposure-approval.md`. It records a
machine-readable runtime command-exposure approval contract covering missing,
invalid, revoked, and valid-prerequisite-only command-exposure approval cases.
Valid command-exposure approval is only a prerequisite signal; it cannot enable
or start runtime, expose runtime execution, add command aliases, create an
approval grant, or bypass the remaining Phase 5.6 blockers.

Phase 5.9 is documented in
`docs/phase-5-9-approval-evaluator-grant-boundary.md`. It records a
machine-readable boundary proving valid runtime approval and valid
command-exposure approval remain prerequisite-only. Their combination still
does not implement or invoke an approval evaluator, produce or persist an
approval grant, enable runtime, start runtime, expose runtime execution, or
bypass the remaining Phase 5.6 blockers.

Phase 5.10 is documented in
`docs/phase-5-10-runtime-host-policy-boundary.md`. It records a
machine-readable boundary proving missing, invalid, and permissive/unbounded
host-policy enforcement is rejected. Valid restrictive host-policy enforcement
is recognized only as a prerequisite signal and still does not implement or
activate host-policy runtime enforcement, enable runtime, start runtime, expose
runtime execution, or bypass the remaining Phase 5.6 blockers.

Example dry-run check:

```powershell
node apps/cli/src/index.mjs serve --dry-run --manifest examples/minimal-manifest/ardyn.manifest.json
```

The dry-run serve plan reports the loaded manifest identity, normalized capabilities, TypeScript core metadata, Rust host boundary, and platform report; it does not start a runtime.

Example Phase 4.0A session-event dry-run emission:

```powershell
node apps/cli/src/index.mjs emit-session-events --dry-run --manifest examples/minimal-manifest/ardyn.manifest.json --task examples/minimal-task/task.json
```

The emitter prints one `schemas/session-event.schema.json` event per LF-delimited
stdout line and a final trailing LF. It does not read stdin, start a listener,
spawn subprocesses, call adapters, connect to Locus, call MCP/OpenClaw, install
plugins, or perform Content Fabric download, install, or enablement behavior.
Phase 4.0B rejects unknown or duplicate `emit-session-events` arguments before
reading files, keeps all failure diagnostics on stderr, and keeps stdout empty
for unreadable files, invalid JSON, schema-invalid JSON, unsafe paths, and
missing `--dry-run`. See `docs/phase-4-stdio-dry-run-event-emission.md`.

Phase 4.0C adds no new CLI command. It documents the transport policy required
before live stdio: stdout JSONL ownership, stderr diagnostic ownership,
backpressure, partial writes, dropped/duplicate/out-of-order/malformed-line
handling, process exit semantics, stderr redaction, and proposal-only
transcript persistence/replay design. See
`docs/phase-4-0c-pre-runtime-transport-policy.md`.

Phase 4.0D also adds no new CLI command and does not change the TypeScript
dry-run emitter. It exposes serializable Rust-host policy contract types and
`stdio_transport_policy_contract()` in `crates/ardyn-host/src/lib.rs`; those
types model the 4.0C stdout/stderr, JSONL framing, diagnostic, redaction,
backpressure, partial-write, line-integrity, exit, and transcript replay
policies as policy-only pre-runtime metadata. See
`docs/phase-4-0d-rust-host-transport-policy-contracts.md`.

Phase 4.0E adds no new CLI command and does not change the TypeScript dry-run
emitter. It exports the Rust-host policy contract as deterministic review-only
JSON metadata through Rust helpers, pins a golden fixture, and maps the
metadata to the Phase 4.0F host-policy review-record shape with
approval/rejection effects kept false. See
`docs/phase-4-0e-rust-host-policy-metadata.md`.

Phase 4.0F also adds no new CLI command and does not change the TypeScript
dry-run emitter. It makes host-policy review records current static artifacts
with deterministic fixtures and compatibility classes: `compatible`,
`upgrade_available`, `unsupported_major`, `malformed`, and `rejected_policy`.
Approval and rejection fields are review metadata only and do not grant runtime
approval. See `docs/phase-4-0f-host-policy-review-records.md`.

Phase 4.0G adds no new CLI command and does not change the finite dry-run
emitter. It adds TypeScript core display-only comparison helpers for
host-policy review records plus deterministic comparison fixtures. Comparison
output is reviewer evidence only: it does not grant runtime approval, start
runtime behavior, write files, print stdout, or add a live host loop. See
`docs/phase-4-0g-host-policy-review-comparison.md`.

Phase 4.0H adds no new CLI command and does not change the finite dry-run
emitter or Phase 4.0G comparison helpers. It adds
`docs/phase-4-0h-reviewer-handoff-index.md` and deterministic index metadata
under `tests/fixtures/host-policy/phase4-0h/` so Devin/Codex reviewers can
navigate Phase 4.0A through 4.0H artifacts. The index is static review
metadata only; it is not runtime configuration, not an approval token, not a
stdout printer, not a file writer, and not consumed by a live host loop.

Phase 4.0I adds no new CLI command and does not change the finite dry-run
emitter, Rust-host policy metadata, review-record helpers, comparison helpers,
or reviewer index. It adds
`docs/phase-4-0i-final-pre-runtime-readiness.md` and deterministic readiness
metadata under `tests/fixtures/host-policy/phase4-0i/` so Devin/Codex
reviewers can inspect final pre-runtime checklist coverage and the explicit
Phase 4.1 approval boundary. The readiness bundle is static review evidence
only; it is not runtime configuration, not an approval token, not a stdout
printer, not a file writer, and not consumed by a live host loop.

Phase 4.1 adds no new CLI command and does not change the finite dry-run
emitter, Rust-host policy metadata, review-record helpers, comparison helpers,
reviewer index, or final readiness bundle. It adds
`docs/phase-4-1-runtime-proposal.md` and deterministic proposal metadata under
`tests/fixtures/host-policy/phase4-1/` so Codex reviewers can inspect the
approval boundary, future Rust-host stdio ownership model, stdout/stderr
responsibilities, transcript persistence/replay design, failure audit records,
kill/exit fail-closed semantics, backpressure and partial-write handling,
line-integrity behavior, required tests, and phased roadmap. The proposal is
static review evidence only; it is not runtime configuration, not an approval
token, not a stdout printer, not a file writer, not a transcript replay
runtime, and not consumed by a live host loop.

Phase 4.1A adds no new CLI command and does not change the finite dry-run
emitter, Rust-host stdio transport policy metadata, host-policy review-record
helpers, comparison helpers, reviewer index, final readiness bundle, or Phase
4.1 proposal bundle. It adds
`docs/phase-4-1a-host-policy-approval-records.md`, review-only Rust helper
types, and deterministic approval-record/operator-consent fixtures under
`tests/fixtures/host-policy/phase4-1a/`. Approval records are static
review/audit artifacts only; they are not runtime configuration, not approval
tokens, not a stdout printer, not a file writer, not an approval evaluator, not
host-policy enforcement, and not consumed by a live host loop.

Phase 4.1B adds no new CLI command and does not change the finite dry-run
emitter, Rust-host stdio transport policy metadata, host-policy review-record
helpers, approval-record helpers, comparison helpers, reviewer index, final
readiness bundle, or Phase 4.1 proposal bundle. It adds
`docs/phase-4-1b-transport-harness-contracts.md`, static Rust-host transport
harness contract helper types, and deterministic fixtures under
`tests/fixtures/host-policy/phase4-1b/`. Transport harness contracts are static
review metadata only; they are not runtime configuration, not a stdout writer,
not a stderr writer, not a file writer, not a stdin reader, not process stdio
ownership, not failure-audit runtime, and not consumed by a live host loop.

Phase 4.1C adds no new CLI command and does not change the finite dry-run
emitter, Rust-host transport harness contracts, host-policy review-record
helpers, approval-record helpers, comparison helpers, reviewer index, final
readiness bundle, or Phase 4.1 proposal bundle. It adds
`docs/phase-4-1c-framing-redaction-contracts.md`, static TypeScript review
helpers, and deterministic fixtures under
`tests/fixtures/host-policy/phase4-1c/`. Framing/redaction contracts are static
review metadata only; they are not runtime configuration, not a stdout writer,
not a stderr writer, not a file writer, not a stdin reader, not process stdio
ownership, not failure-audit runtime, and not consumed by a live host loop.

Phase 4.1D adds no new CLI command and does not change the finite dry-run
emitter, Rust-host transport harness contracts, framing/redaction helpers,
host-policy review-record helpers, approval-record helpers, comparison helpers,
reviewer index, final readiness bundle, or Phase 4.1 proposal bundle. It adds
`docs/phase-4-1d-transcript-replay-contracts.md`, static TypeScript review
helpers, and deterministic fixtures under
`tests/fixtures/host-policy/phase4-1d/`. Transcript persistence/replay
contracts are static review metadata only; they are not runtime configuration,
not a transcript persistence runtime, not a replay runtime, not a file writer,
not a stdin reader, not process stdio ownership, not failure-audit runtime, and
not consumed by a live host loop. `replay-session-transcript` remains
proposal-only and rejected.

Phase 4.1E adds no new CLI command and does not change the finite dry-run
emitter, Rust-host transport harness contracts, framing/redaction helpers,
transcript persistence/replay helpers, host-policy review-record helpers,
approval-record helpers, comparison helpers, reviewer index, final readiness
bundle, or Phase 4.1 proposal bundle. It adds
`docs/phase-4-1e-failure-audit-kill-semantics.md`, static TypeScript review
helpers, and deterministic fixtures under
`tests/fixtures/host-policy/phase4-1e/`. Failure-audit, terminal-state,
cleanup/kill, and nonzero-exit contracts are static review metadata only; they
are not runtime configuration, not a failure-audit runtime, not a cleanup
runtime, not process killing, not signal handling, not timeout runtime, not a
file writer, not a stdin reader, not process stdio ownership, and not consumed
by a live host loop. `failure-audit`, `emit-failure-audit`,
`cleanup-runtime`, `kill-runtime`, `exit-runtime`, `serve-runtime`,
`stdio-runtime`, and `replay-session-transcript` remain proposal-only and
rejected. See `docs/phase-4-1e-failure-audit-kill-semantics.md`.

## Phase 3.3-3.9 Policy Review

Phase 3.3 introduced documentation-only, non-executing planning review. Phase
3.4 adds approval review artifacts and host-policy preconditions. Phase 3.5
adds local trace-diff review and output-path export ergonomics. Phase 3.6 adds
review-artifact versioning and display-summary contracts. Phase 3.7 adds schema
migration metadata and review-artifact attestation planning without production
signing. Phase 3.8 pins the canonical Locus-facing harness slug as `ardyn`,
aligns Content Fabric family membership, freezes the Phase 3.x Locus read-only
display contract, and adds a future stdio session-event schema with examples.
Phase 3.9 adds static session-transcript review, keeps unknown future metadata
inert unless explicitly versioned, and records the host-policy preconditions
required before any real stdio runtime can exist. Phase 3.10 documents
session-transcript compatibility classes, display-summary fields, deterministic
metadata policy, and preconditions before any future execution-adjacent phase.
Planner approval decisions are review records, not runtime grants.
Capability selection uses deterministic tiers: exact capability id score `300`,
tag score `200`, and permission scope score `100`. Exact outranks tag, tag
outranks scope, ties are sorted by bytewise ASCII capability id, all candidates
stay visible in the trace, and only the highest available tier is selected.

See `docs/planner-policy-review.md` for approval, ranking, adapter metadata,
trace, summary, explain, review-artifact export, and trace-diff guidance. See
`docs/planner-trace-review-workflow.md` for the reviewer checklist and future
Locus viewer fields. The adapter boundary remains metadata-only:
ARDYN does not call real MCP/OpenClaw adapters, connect to Locus or Multiverse,
install plugins, download torrents, enable code packs, serve Content Fabric
catalogs, spawn processes, run autonomous loops, or execute tools in Phase
3.3-3.10.

## Phase 3.8-3.10 Harness and Session Alignment

The canonical ARDYN harness slug is `ardyn`. Use that value for package and
keyring namespace, manifest-facing harness identity, Content Fabric family
membership, future Locus connector expected id, and session-event
`sourceHarness`.

The current Content Fabric family set is exactly:

- `*`
- `locus`
- `multiverse`
- `kortex-audio`
- `locus-evolution-lab`
- `somatic`
- `ardyn`

Locus remains mission control outside ARDYN. The Phase 3.x Locus display
contract is frozen for read-only viewing of local planner traces, approval
review artifacts, trace diffs, schema-status summaries, attestation plans, and
session-event fixtures. See `docs/locus-trace-display-contract.md` for the
`PHASE_3_X_LOCUS_DISPLAY_CONTRACT_FROZEN` marker.

Session-event examples live under `examples/session-events/` and validate
against `schemas/session-event.schema.json`. Session-transcript examples live
under `examples/session-transcripts/` and validate against
`schemas/session-transcript.schema.json` plus higher-level transcript checks.
They are future stdio transport fixtures only. Phase 3.9 does not add a stdio
runtime, transcript runtime, WebSocket transport, HTTP transport, live Locus
connector, runtime event loop, or network behavior. See
`docs/harness-identity.md`, `docs/session-events-stdio-contract.md`, and
`docs/host-policy-preconditions.md`.

Phase 3.9 reserves transcript validation command shapes for local review flows:

```powershell
ardyn validate-session-transcript --file <file>
ardyn validate-session-transcript --file <file> --summary
ardyn validate-session-transcript --file <file> --explain
```

Phase 3.10 documents additional local-review metadata examples:

```powershell
ardyn validate-session-transcript --file <file> --schema-status
ardyn validate-session-transcript --file <file> --display-summary
ardyn validate-session-transcript --file <file> --compatibility-explain
```

The Phase 3.10 forms are implemented local read-only CLI review modes. They
are not a shipping runtime, and they perform no writes, no network, no live
stdio, no process spawning, no command execution, and no Locus runtime
dependency.

Transcript compatibility classes are `compatible`, `upgrade_available`,
`unsupported_major`, and `malformed`. Same-major patch and minor transcripts
are compatible for inert display; unsupported major transcripts show only
identity/version and raw metadata; malformed transcripts show validation errors
only. Unknown fields are inert in compatibility and display, although the
current strict schema can still reject extra fields. Migration/status records
must use deterministic fixture metadata and no live timestamps unless supplied
by an explicit fixture or test input.

See `docs/session-transcript-versioning-policy.md` for the Phase 3.10 policy
and `docs/locus-trace-display-contract.md` for the read-only Locus display
summary fields.

## Phase 3.4-3.7 Approval Review Artifacts

Phase 3.4 adds review artifacts and comparison helpers. Phase 3.5 exposes the
local comparison and export flows through the CLI while keeping ARDYN
non-executing. Phase 3.6 adds versioning and display-summary helpers for local
viewer contracts. Phase 3.7 adds migration and attestation planning helpers
without adding runtime behavior. The core API surface is:

- `createApprovalReviewArtifact(planOrTrace, options)` creates the stable
  review artifact from a task plan or planner trace.
- `validateApprovalReviewArtifact(artifact)` checks that the artifact shape is
  valid, `nonExecuting` is true, and every safety flag remains false.
- `compareApprovalReviewArtifacts(left, right)` compares two artifacts, or a
  planner trace and an artifact, through the stable artifact shape.
- `validateApprovalReviewArtifactVersion(artifact)` validates schema id and
  semver compatibility metadata for display gating.
- `classifyApprovalReviewArtifactCompatibility(artifact)` returns the Phase 3.6
  compatibility state: `compatible`, `unsupported_major`, or `malformed`.
- `normalizeApprovalReviewArtifactForDisplay(artifact)` normalizes known fields
  and preserves unknown top-level fields as inert metadata.
- `buildApprovalReviewArtifactDisplaySummary(artifact)` returns a compact local
  display summary for Locus or other UI callers.
- `buildSchemaMigrationMetadataRecord(kind, artifact)` returns deterministic
  schema migration metadata for review-only display.
- `buildReviewArtifactAttestationPlan(artifact)` returns an unsigned
  non-executing attestation planning record with deterministic digest metadata.
- `buildMigrationAttestationDisplaySummary(kind, artifact)` returns compact
  migration and attestation display status.

Example CLI output:

```powershell
node apps/cli/src/index.mjs plan --review-artifact --manifest tests/fixtures/planning-manifest.json --task tests/fixtures/tasks/approval-required.json
```

The output includes:

```json
{
  "schema": "ardyn.approval-review-artifact",
  "nonExecuting": true,
  "selectedCapabilities": ["secure.registry"],
  "approvalDecision": {
    "status": "required",
    "nonExecuting": true
  },
  "safety": {
    "executionEnabled": false,
    "toolExecutionEnabled": false,
    "processesSpawned": false
  }
}
```

Trace comparison and review fixtures live under
`tests/fixtures/trace-comparison/` and `tests/fixtures/trace-review/`. Tests use
`compareApprovalReviewArtifacts` to pin deterministic differences for task id,
manifest version, requested capabilities, selected capabilities, unresolved
requests, approval decision status, and candidate rankings.

Phase 3.5-3.7 CLI examples:

```powershell
node apps/cli/src/index.mjs plan --review-artifact --manifest tests/fixtures/planning-manifest.json --task tests/fixtures/tasks/approval-required.json --output approval-review-artifact.json
npm exec ardyn -- review-artifact --file tests/fixtures/review-artifacts/phase3-6/current-compatible-v1.json --summary
npm exec ardyn -- review-artifact --file tests/fixtures/review-artifacts/phase3-6/compatible-unknown-fields.json --explain
npm exec ardyn -- review-artifact --file tests/fixtures/review-artifacts/phase3-7/older-compatible-review-artifact.json --schema-status
npm exec ardyn -- review-artifact --file tests/fixtures/review-artifacts/phase3-7/current-compatible-review-artifact.json --attestation-plan
node apps/cli/src/index.mjs review-trace --left tests/fixtures/trace-review/equal-left-approval-review-artifact.json --right tests/fixtures/trace-review/selected-capability-changed-approval-review-artifact.json
```

The export command writes exactly one file: the requested output path. The
review-artifact and trace-review commands perform no writes at all. All three
paths remain local, JSON-only, and non-executing. `review-artifact` validates a
single local file path and does not connect to Locus.

The Phase 3.6/3.7 CLI display workflow is a local review renderer over already
produced approval review artifacts. It reports compatibility, validation,
unknown-field handling, approval status, safety flags, migration status, and
unsigned attestation planning without interpreting unknown fields as commands,
approvals, keys, signatures, or runtime instructions.

See `docs/review-artifact-versioning-policy.md` for schema id, `version`
semantics, same-major compatibility behavior, major-version rejection,
unknown-field preservation, and deterministic timestamp guidance. See
`docs/locus-trace-display-contract.md` for Locus-facing display fields,
approval status display rules, warning/severity mapping, and the rule that
ARDYN does not depend on Locus at runtime.
See `docs/schema-migration-policy.md` for Phase 3.7 migration metadata and
`docs/review-artifact-attestation-plan.md` for unsigned/test-fixture-only
attestation planning and Content Fabric signing alignment.

## Phase 3.4 Host Policy Preconditions

`docs/host-policy-preconditions.md` records preconditions for any future
execution-adjacent host policy. These are documentation and contract
requirements only. They do not add runtime enforcement, adapter connections,
network listeners, process spawning, plugin installation, Content Fabric runtime
behavior, code-pack enablement, autonomous loops, real MCP/OpenClaw calls,
secrets access, or external CI behavior.

Future host policy work must require explicit approval, adapter permission
declarations, code-pack sandbox and quarantine requirements, explicit
network/process/filesystem permission scopes, and stdout/stderr line-delimited
JSON semantics before any execution-adjacent behavior can be introduced.

## License

Apache-2.0. See `LICENSE`.
