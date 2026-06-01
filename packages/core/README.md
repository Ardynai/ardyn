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
