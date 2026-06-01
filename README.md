# ARDYN

ARDYN is an open-source AI harness/framework for running local and networked agent systems with explicit manifests, capabilities, task contracts, and adapter boundaries.

ARDYN is not Locus and is not Multiverse.

- Locus is mission control. It can run, observe, and control ARDYN through public ARDYN APIs and adapters.
- Multiverse is an external closed-source product/network. ARDYN can optionally register with Multiverse through an adapter, but Multiverse is not required to run ARDYN.
- OpenClaw, Hermes, Agent Zero, Space Agent, HiClaw, AgentScope, and related systems are references only. ARDYN does not copy their source code.

## Phase 3 Scope

This repository is currently in Phase 3 task-planning mode. The goal is to load and validate ARDYN manifests and tasks, resolve requested capabilities into deterministic non-executing plans, report static TypeScript/Rust host identity, and expose dry-run handshake data before autonomous execution exists.

Included now:

- Architecture and adapter-boundary documentation.
- Content Fabric v1.0.0 conformance foundation.
- JSON Schemas for ARDYN manifests, capabilities, and tasks.
- Schema-matching TypeScript and Rust contract types.
- Minimal TypeScript core functions for manifest loading, validation, capability normalization, and static handshakes.
- Minimal task loading, validation, deterministic ranked capability resolution, approval-gate data, approval-decision records, and planner traces.
- Metadata-only adapter registration stubs for OpenClaw, MCP, and the plugin API.
- Minimal Rust host functions for host info, platform info, optional manifest loading, and non-executing host handshakes.
- CLI commands for doctor, identity, capabilities, task planning, and dry-run serve planning.
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

## Phase 3 CLI Usage

Run commands directly from source during Phase 3:

```powershell
node apps/cli/src/index.mjs doctor
node apps/cli/src/index.mjs identity
node apps/cli/src/index.mjs capabilities --manifest examples/minimal-manifest/ardyn.manifest.json
node apps/cli/src/index.mjs plan --manifest examples/minimal-manifest/ardyn.manifest.json --task examples/minimal-task/task.json
node apps/cli/src/index.mjs serve --dry-run --manifest examples/minimal-manifest/ardyn.manifest.json
```

Successful commands print JSON. Failure cases write plain text to stderr and do not print JSON to stdout. The `plan` command validates the task, scores candidate capabilities deterministically, and includes `plannerTrace` automatically unless a focused output mode is selected. Exact capability IDs score 300, capability tags score 200, and permission scopes score 100. Exact matches outrank tag matches, tag matches outrank scope matches, ties are sorted by capability ID, and no-match resolutions include empty candidates and selected capability IDs.

The `plan`, `plan --trace`, `plan --summary`, `plan --explain`, and `serve --dry-run` commands are intentionally non-executing: they do not open network ports, execute tools, start agents, call APIs, install plugins, download torrents, enable code packs, run agent loops, connect adapters, call MCP/OpenClaw, serve Content Fabric catalogs, or spawn long-running services. Their output includes explicit false values for the safety flags that cover those behaviors.

Phase 3.3 review examples:

```powershell
node apps/cli/src/index.mjs plan --manifest tests/fixtures/planning-manifest.json --task tests/fixtures/tasks/exact-match.json
node apps/cli/src/index.mjs plan --manifest tests/fixtures/planning-manifest.json --task tests/fixtures/tasks/tag-match.json
node apps/cli/src/index.mjs plan --manifest tests/fixtures/planning-manifest.json --task tests/fixtures/tasks/scope-match.json
node apps/cli/src/index.mjs plan --manifest tests/fixtures/planning-manifest.json --task tests/fixtures/tasks/no-match.json
node apps/cli/src/index.mjs plan --manifest tests/fixtures/planning-manifest.json --task tests/fixtures/tasks/approval-required.json
node apps/cli/src/index.mjs plan --trace --manifest tests/fixtures/planning-manifest.json --task tests/fixtures/tasks/tag-match.json
node apps/cli/src/index.mjs plan --summary --manifest tests/fixtures/planning-manifest.json --task tests/fixtures/tasks/approval-required.json
node apps/cli/src/index.mjs plan --explain --manifest tests/fixtures/planning-manifest.json --task tests/fixtures/tasks/exact-match.json
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

The Phase 3.3 status report command is:

```powershell
npm run report:phase-status
```

That report must assemble planning evidence only: manifest and task identifiers, selected capability ids, unresolved requests, approval status, approval-decision status, and safety flags. It must not start servers, spawn long-running processes, call adapters, execute tools, or imply active Locus, Multiverse, MCP, OpenClaw, plugin, or Content Fabric runtime integration.

Example dry-run check:

```powershell
node apps/cli/src/index.mjs serve --dry-run --manifest examples/minimal-manifest/ardyn.manifest.json
```

The planned runtime includes the loaded manifest identity, normalized capabilities, TypeScript core runtime, Rust host boundary, and platform report.

## Phase 3.3 Policy Review

Phase 3.3 keeps planning review documentation-only and non-executing. Planner
approval decisions are review records, not runtime grants. Capability selection
uses deterministic tiers: exact capability id score `300`, tag score `200`, and
permission scope score `100`. Exact outranks tag, tag outranks scope, ties are
sorted by bytewise ASCII capability id, all candidates stay visible in the trace,
and only the highest available tier is selected.

See `docs/planner-policy-review.md` for approval, ranking, adapter metadata,
trace, summary, and explain guidance. See
`docs/planner-trace-review-workflow.md` for the Phase 3.3 reviewer checklist and
future Locus UI display fields. The adapter boundary remains metadata-only:
ARDYN does not call real MCP/OpenClaw adapters, connect to Locus or Multiverse,
install plugins, download torrents, enable code packs, serve Content Fabric
catalogs, spawn processes, run autonomous loops, or execute tools in Phase 3.3.

## License

Apache-2.0. See `LICENSE`.
