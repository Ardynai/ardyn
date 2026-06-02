# @ardyn/core

TypeScript core scaffold for ARDYN orchestration contracts.

Phase 3 owns manifest and task validation, deterministic non-executing task planning, ranked exact/tag/scope capability resolution, approval-gate data, approval-decision records, and planner traces. Autonomous execution, tool execution, plugin installation, network serving, torrent download, code-pack enablement, and agent loops are intentionally out of scope.

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
