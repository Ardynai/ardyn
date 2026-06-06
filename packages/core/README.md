# @ardyn/core

TypeScript core scaffold for ARDYN orchestration contracts.

Phase 4.1G keeps the TypeScript core on deterministic contract and display
data while the Rust host keeps policy-only stdio transport contract metadata
and static host-policy review-record fixtures. The TypeScript core still owns
manifest and task validation, deterministic non-executing task planning,
ranked exact/tag/scope capability resolution, approval-gate data,
approval-decision records, planner traces, shared local-only input path policy,
finite dry-run session-event JSONL construction, formatter hardening, golden
fixture coverage, and display-only host-policy review-record comparison
helpers. Phase 4.0I adds only static final pre-runtime readiness docs and
metadata after the Phase 4.0H reviewer handoff index. Phase 4.1 adds only the
runtime proposal doc and deterministic proposal metadata after that readiness
bundle. Phase 4.1A adds only static host-policy approval-record helpers and
operator-consent fixtures on the Rust-host side. Phase 4.1B adds only static
transport harness contract helpers and fixtures on the Rust-host side. Phase
4.1C adds only static stdout JSONL whole-line framing and stderr redaction
review helpers and fixtures on the TypeScript side. Phase 4.1D adds only
static transcript persistence/replay review helpers and fixtures on the
TypeScript side. Phase 4.1E adds only static failure-audit, terminal-state,
cleanup/kill, and nonzero-exit mapping review helpers and fixtures on the
TypeScript side. Phase 4.1F adds only static runtime-readiness checkpoint
documentation, fixture metadata, report inventory, and tests; it adds no core
runtime helper API and no checkpoint helper API. Phase 4.1G adds only static
external review packet documentation, fixture metadata, report inventory, and
tests; it adds no core runtime helper API and no review-packet helper API. See
`docs/phase-4-1b-transport-harness-contracts.md` and
`docs/phase-4-1c-framing-redaction-contracts.md` and
`docs/phase-4-1d-transcript-replay-contracts.md` and
`docs/phase-4-1e-failure-audit-kill-semantics.md` and
`docs/phase-4-1f-runtime-readiness-checkpoint.md` and
`docs/phase-4-1g-external-review-packet.md`.
Autonomous execution, tool execution, plugin installation, network serving,
torrent download, code-pack enablement, live stdin loops, live replay, runtime
approval grants, and agent loops are intentionally out of scope.

## Phase 4.0A Dry-Run Session Events

The core API exposes `createStdioDryRunSessionEvents(manifest, task, options)`
for deterministic session-event construction and `formatSessionEventsJsonl(events)`
for LF-delimited JSONL serialization after event validation. It also exposes
`assertLocalFilePath`, `assertLocalJsonFilePath`, and `readLocalJsonFile` for
the shared local-only path policy used by manifest, task, transcript, and
review JSON inputs.

This is a finite dry-run renderer. It does not read stdin, start a listener,
spawn subprocesses, call adapters, depend on Locus, call MCP/OpenClaw, execute
plugins, or perform Content Fabric download, install, or enablement behavior.
Phase 4.0B keeps that renderer deterministic with committed JSONL fixture
coverage and fail-closed handling for malformed or sparse event arrays.

Phase 4.0C does not add core runtime APIs. The TypeScript core remains the
owner of deterministic manifests, tasks, planning data, session-event
construction, schema validation, normalized transcript validation, and
diagnostic classification inputs. Future live process stdio ownership,
backpressure, partial writes, line-integrity failures, process exit semantics,
stderr redaction enforcement, and runtime transcript persistence/replay must be
owned by a reviewed Rust-host policy before implementation.

Phase 4.0D also adds no TypeScript core runtime APIs and does not change
`createStdioDryRunSessionEvents()` or `formatSessionEventsJsonl()`. It only
codifies the Phase 4.0C policy in Rust-host metadata through
`stdio_transport_policy_contract()`. See
`docs/phase-4-0d-rust-host-transport-policy-contracts.md`.

Phase 4.0E also adds no TypeScript core runtime APIs and does not change the
finite dry-run event construction or formatter. It only exports the Rust-host
policy metadata as deterministic review JSON and maps it to future host-policy
review records. See `docs/phase-4-0e-rust-host-policy-metadata.md`.

Phase 4.0F also adds no TypeScript core runtime APIs and does not change the
finite dry-run event construction or formatter. It only defines static
host-policy review records and compatibility classes in the Rust host. Approval
and rejection fields are inert review metadata and do not grant runtime
approval. See `docs/phase-4-0f-host-policy-review-records.md`.

Phase 4.0G adds TypeScript core display-only helpers for host-policy review
records:

- `classifyHostPolicyReviewRecordCompatibility(record)`
- `normalizeHostPolicyReviewRecordForDisplay(record)`
- `buildHostPolicyReviewRecordDisplaySummary(record)`
- `compareHostPolicyReviewRecords(left, right)`
- `formatHostPolicyReviewRecordComparisonJson(comparison)`

These helpers compare review evidence deterministically for Devin/Codex handoff.
They do not read files, write files, print stdout, start a runtime, grant
runtime approval, call adapters, connect to Locus, call MCP/OpenClaw, execute
plugins, or perform Content Fabric runtime behavior. See
`docs/phase-4-0g-host-policy-review-comparison.md`.

Phase 4.0H adds no TypeScript core runtime APIs and does not change the
display-only comparison helpers. It adds
`docs/phase-4-0h-reviewer-handoff-index.md` and deterministic metadata for
reviewer navigation across Phase 4.0A through 4.0H artifacts. The index is not
runtime configuration, not an approval token, not a file writer, not a stdout
printer, and not consumed by a live host loop.

Phase 4.0I adds no TypeScript core runtime APIs and does not change the
finite dry-run event construction, formatter, Rust-host policy metadata,
review-record classes, display-only comparison helpers, or reviewer index. It
adds `docs/phase-4-0i-final-pre-runtime-readiness.md` and deterministic
readiness metadata for checklist and invariant review. The readiness bundle is
not runtime configuration, not an approval token, not a file writer, not a
stdout printer, not a Phase 4.1 implementation, and not consumed by a live host
loop.

Phase 4.1 adds no TypeScript core runtime APIs and does not change the finite
dry-run event construction, formatter, Rust-host policy metadata,
review-record classes, display-only comparison helpers, reviewer index, or
final readiness bundle. It adds `docs/phase-4-1-runtime-proposal.md` and
deterministic runtime proposal metadata only. The proposal is not runtime
configuration, not an approval token, not a file writer, not a stdout printer,
not a transcript persistence/replay runtime, not a live host loop, and not a
runtime implementation.

Phase 4.1A adds no TypeScript core runtime APIs, no approval evaluator, and no
host-policy enforcement path. It does not change the finite dry-run event
construction, formatter, Rust-host stdio transport policy metadata,
review-record classes, display-only comparison helpers, reviewer index, final
readiness bundle, or runtime proposal bundle. Approval records are static
review/audit artifacts only and do not grant runtime approval. See
`docs/phase-4-1a-host-policy-approval-records.md`.

Phase 4.1B adds no TypeScript core runtime APIs, no transport harness runtime
API, no approval evaluator, and no host-policy enforcement path. It does not
change the finite dry-run event construction, formatter, Rust-host stdio
transport policy metadata, review-record classes, approval-record classes,
display-only comparison helpers, reviewer index, final readiness bundle, or
runtime proposal bundle. Transport harness contracts are static review metadata
only and do not grant runtime approval. See
`docs/phase-4-1b-transport-harness-contracts.md`.

Phase 4.1C adds static TypeScript review helpers for stdout JSONL whole-line
framing and stderr diagnostic redaction, but still adds no TypeScript core
runtime APIs, no stdout writer, no stderr writer, no approval evaluator, and no
host-policy enforcement path. It does not change the finite dry-run event
construction, formatter, Rust-host stdio transport policy metadata,
transport-harness contracts, review-record classes, approval-record classes,
display-only comparison helpers, reviewer index, final readiness bundle, or
runtime proposal bundle. Framing/redaction contracts are static review metadata
only; no live writer exists, no process stdio ownership exists, and future
runtime must use these rules but is not implemented yet. See
`docs/phase-4-1c-framing-redaction-contracts.md`.

Phase 4.1D adds static TypeScript review helpers for transcript persistence
and replay contracts, but still adds no TypeScript core runtime APIs, no
transcript persistence runtime, no replay runtime, no stdout writer, no stderr
writer, no file writer, no approval evaluator, and no host-policy enforcement
path. It does not change the finite dry-run event construction, formatter,
Rust-host stdio transport policy metadata, transport-harness contracts,
framing/redaction contracts, review-record classes, approval-record classes,
display-only comparison helpers, reviewer index, final readiness bundle, or
runtime proposal bundle. Transcript persistence/replay contracts are static
review metadata only; `replay-session-transcript` remains proposal-only and
rejected. See `docs/phase-4-1d-transcript-replay-contracts.md`.

Phase 4.1E adds static TypeScript review helpers for failure-audit,
terminal-state, cleanup/kill, and nonzero-exit mapping contracts, but still
adds no TypeScript core runtime APIs, no failure-audit runtime, no cleanup
runtime, no process killing, no signal handling runtime, no timeout runtime,
no stdout writer, no stderr writer, no file writer, no approval evaluator, and
no host-policy enforcement path. It does not change the finite dry-run event
construction, formatter, Rust-host stdio transport policy metadata,
transport-harness contracts, framing/redaction contracts, transcript
persistence/replay contracts, review-record classes, approval-record classes,
display-only comparison helpers, reviewer index, final readiness bundle, or
runtime proposal bundle. Failure-audit/kill-semantics contracts are static
review metadata only; `failure-audit`, `emit-failure-audit`,
`cleanup-runtime`, `kill-runtime`, `exit-runtime`, `serve-runtime`, and
`stdio-runtime` remain proposal-only and rejected. See
`docs/phase-4-1e-failure-audit-kill-semantics.md`.

Phase 4.1F adds no TypeScript core runtime APIs and no new TypeScript core
checkpoint helper APIs. It does not change the finite dry-run event
construction, formatter, Rust-host stdio transport policy metadata,
transport-harness contracts, framing/redaction contracts, transcript
persistence/replay contracts, failure-audit contracts, review-record classes,
approval-record classes, display-only comparison helpers, reviewer index,
final readiness bundle, or runtime proposal bundle. The runtime-readiness
checkpoint is static fixture/report/doc/test metadata only; it cannot grant
runtime approval and cannot enable `serve-runtime`, `stdio-runtime`, or
`replay-session-transcript`. See
`docs/phase-4-1f-runtime-readiness-checkpoint.md`.

Phase 4.1G adds no TypeScript core runtime APIs and no new TypeScript core
review-packet helper APIs. It does not change the finite dry-run event
construction, formatter, Rust-host stdio transport policy metadata,
transport-harness contracts, framing/redaction contracts, transcript
persistence/replay contracts, failure-audit contracts, review-record classes,
approval-record classes, display-only comparison helpers, reviewer index,
final readiness bundle, runtime proposal bundle, or runtime-readiness
checkpoint. The external review packet is static fixture/report/doc/test
metadata only; it cannot grant runtime approval, cannot approve runtime
implementation, and cannot enable `serve-runtime`, `stdio-runtime`, or
`replay-session-transcript`. See
`docs/phase-4-1g-external-review-packet.md`.

## Phase 3.2 Policy Review

The core planner remains planning-only. It ranks capability candidates as exact
id score `300`, tag score `200`, and permission scope score `100`; exact
outranks tag, tag outranks scope, bytewise ASCII capability id order breaks ties,
all candidates remain in the trace, and only candidates in the highest available
tier are selected.

`approvalDecision` is metadata for review and must not be treated as an
execution grant. Adapter information is metadata-only in this phase: no MCP,
OpenClaw, Locus, Multiverse, plugin, Content Fabric, network, or tool connection
is made by core planning.

See `../../docs/planner-policy-review.md` for Phase 3.2 examples covering exact
match, tag match, no match, approval-required plans, trace review, summary
views, and explanation views.

## Phase 3.4 Host Policy Preconditions

The core package remains non-executing. Phase 3.4 documents future host-policy
preconditions only; it does not add active runtime enforcement, adapter
connections, network listeners, process spawning, plugin installation, Content
Fabric runtime behavior, code-pack enablement, autonomous loops, real MCP or
OpenClaw calls, secrets access, or external CI behavior.

Any future host policy must require explicit approval, adapter permission
declarations, sandbox and quarantine requirements for code packs, and explicit
network/process permission scopes before execution-adjacent behavior can be
introduced. Locus may be an optional future controller or viewer through public
ARDYN APIs, but ARDYN remains the framework and must not depend on Locus as its
host app. Multiverse integration remains optional and external.

See `../../docs/host-policy-preconditions.md` for the Phase 3.4 precondition
contract.
