# @ardyn/core

TypeScript core scaffold for ARDYN orchestration contracts.

Phase 4.0C documents pre-runtime transport policy while the TypeScript core owns deterministic contract data: manifest and task validation, deterministic non-executing task planning, ranked exact/tag/scope capability resolution, approval-gate data, approval-decision records, planner traces, shared local-only input path policy, finite dry-run session-event JSONL construction, formatter hardening, and golden fixture coverage. Autonomous execution, tool execution, plugin installation, network serving, torrent download, code-pack enablement, live stdin loops, live replay, and agent loops are intentionally out of scope.

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
