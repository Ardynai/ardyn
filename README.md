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
- Minimal task loading, validation, deterministic capability resolution, and approval-gate data.
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

Successful commands print JSON. Failure cases write plain text to stderr and do not print JSON to stdout. The `plan` command validates the task, resolves exact capability IDs first, falls back to permission-scope matching only when the request is a schema-defined permission scope, and reports deterministic no-match resolutions. Tag matching is unsupported because the current capability schema has no tag field.

The `plan` and `serve --dry-run` commands are intentionally non-executing: they do not open network ports, execute tools, start agents, call APIs, install plugins, download torrents, enable code packs, run agent loops, or spawn long-running services. Their output includes explicit false values for the safety flags that cover those behaviors.

Example dry-run check:

```powershell
node apps/cli/src/index.mjs serve --dry-run --manifest examples/minimal-manifest/ardyn.manifest.json
```

The planned runtime includes the loaded manifest identity, normalized capabilities, TypeScript core runtime, Rust host boundary, and platform report.

## License

Apache-2.0. See `LICENSE`.
