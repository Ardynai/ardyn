# ARDYN Fork Inventory

Generated: 2026-06-01

## Scope

- GitHub owner inspected: `Ardynai`
- Target repository: `Ardynai/ardyn`
- Local repository: `C:\Users\Josh\Documents\ardyn`
- Inventory source: `gh api` and GitHub repository metadata
- Repositories cloned: none, beyond using the existing local `ardyn` worktree
- Inspection depth: top-level docs and manifests only for the highest-relevance repos
- Active AI used: Codex subagents only

`Ardynai/ardyn` already exists as a public GitHub repository. The local worktree was empty except for `.git`; `origin` is now set to `https://github.com/Ardynai/ardyn.git`.

## Inventory Count

- Total `Ardynai` repositories found: 580
- Forks: 572
- Non-forks: 8
- Full machine-readable inventory: `repo-inventory/ardyn-fork-inventory.json`

The JSON inventory includes each repo's name, URL, visibility, fork/upstream metadata when available, primary language, default branch, archived status, description, topics, timestamps, and ARDYN relevance metadata.

## Top 30 ARDYN-Relevant Repos

These are grouped by how they should inform ARDYN, not by raw keyword score. Website-only repos, skill packs, duplicated language ports, and non-general references were downgraded even when their names scored highly.

### Core Harness And Agent Frameworks

| Rank | Repo | Upstream | Why it matters | Top-level files inspected |
| ---: | --- | --- | --- | --- |
| 1 | `openclaw` | `openclaw/openclaw` | Primary local gateway/harness reference: channel boundaries, plugin SDK, runtime routing, Docker/sandbox hooks. | `README.md`, `AGENTS.md`, `package.json`, `Dockerfile`, `docker-compose.yml`, `docs/index.md` |
| 2 | `hermes-agent` | `NousResearch/hermes-agent` | Long-running self-improving agent with skills, memory, subagents, RPC tools, terminal backends, and gateway channels. | `README.md`, `AGENTS.md`, `package.json`, `pyproject.toml`, `Dockerfile`, `docker-compose.yml` |
| 3 | `agent-zero` | `agent0ai/agent-zero` | Full-stack agent framework with Linux environment, tool creation, browser use, multi-agent cooperation, and Docker isolation. | `README.md`, `AGENTS.md`, `docs/README.md` |
| 4 | `space-agent` | `agent0ai/space-agent` | Browser-first agent runtime and adaptive workspace model. Useful, but ARDYN should preserve CLI/API control paths. | `README.md`, `AGENTS.md`, `package.json` |
| 5 | `HiClaw` | `agentscope-ai/HiClaw` | Multi-agent runtime platform with manager/workers, shared files, AI gateway, human visibility, and Kubernetes-style deployment. | `README.md`, `AGENTS.md`, `Makefile` |
| 6 | `agentscope-runtime` | `agentscope-ai/agentscope-runtime` | Production runtime layer for sandboxed execution, deployment, observability, MCP, FastAPI, and Docker-based operations. | `README.md`, `pyproject.toml` |
| 7 | `agentscope` | `agentscope-ai/agentscope` | Flexible multi-agent framework with MCP and OpenTelemetry signals. | `README.md`, `pyproject.toml` |
| 8 | `deer-flow` | `bytedance/deer-flow` | Long-horizon super-agent harness with memory, tools, sandboxes, subagents, and MCP server surface. | `README.md`, `Makefile`, `config.example.yaml` |
| 9 | `langgraph` | `langchain-ai/langgraph` | Stateful graph orchestration model for long-running and multi-actor agents. | `README.md`, `AGENTS.md` |
| 10 | `openai-agents-python` | `openai/openai-agents-python` | Lightweight multi-agent workflow SDK: tools, handoffs, guardrails, tracing, and sandbox-agent concepts. | `README.md`, `AGENTS.md`, `pyproject.toml`, `docs/index.md` |

### OpenClaw Ecosystem, Protocols, And Registry

| Rank | Repo | Upstream | Why it matters | Top-level files inspected |
| ---: | --- | --- | --- | --- |
| 11 | `gbrain` | `garrytan/gbrain` | Memory/knowledge graph reference: hybrid search, typed links, health loops, and autonomous remediation jobs. | `README.md`, `AGENTS.md`, `package.json` |
| 12 | `lobster` | `openclaw/lobster` | Deterministic workflow shell for typed JSON pipelines, jobs, resumability, and approval gates. | `README.md`, `AGENTS.md`, `package.json` |
| 13 | `acpx` | `openclaw/acpx` | Headless Agent Client Protocol session client; useful for ARDYN client/protocol interoperability. | `README.md`, `AGENTS.md`, `package.json` |
| 14 | `clawhub` | `openclaw/clawhub` | Skill/plugin registry reference for publishing, versions, APIs, moderation, and catalog behavior. | `README.md`, `AGENTS.md`, `package.json`, `docs/README.md` |
| 15 | `openclaw-windows-node` | `openclaw/openclaw-windows-node` | Windows companion architecture: tray, gateway client library, CLI validator, and WebView2 packaging. | `README.md`, `AGENTS.md` |

### MCP, Tooling, And Orchestration

| Rank | Repo | Upstream | Why it matters | Top-level files inspected |
| ---: | --- | --- | --- | --- |
| 16 | `typescript-sdk` | `modelcontextprotocol/typescript-sdk` | Core MCP server/client SDK for Node, Bun, and Deno. Best fit for TypeScript plugin/tool authoring. | `README.md`, `package.json` |
| 17 | `python-sdk` | `modelcontextprotocol/python-sdk` | MCP Python SDK and FastMCP baseline for Python ecosystem interoperability. | `README.md`, `pyproject.toml` |
| 18 | `fastmcp` | `PrefectHQ/fastmcp` | Production-oriented Python MCP server/client framework. | `README.md`, `pyproject.toml` |
| 19 | `composio` | `ComposioHQ/composio` | Toolkits, provider adapters, auth, sandbox/workbench, and integration catalog patterns. | `README.md`, `package.json`, `pyproject.toml`, `Dockerfile` |
| 20 | `activepieces` | `activepieces/activepieces` | Workflow automation platform where integrations can become MCP-accessible pieces. | `README.md`, `package.json`, `Dockerfile`, `docker-compose.yml` |
| 21 | `apify-mcp-server` | `apify/apify-mcp-server` | Local/hosted MCP access to scraper and actor catalogs. | `README.md`, `package.json`, `Dockerfile`, `manifest.json`, `server.json` |

### Memory And Context

| Rank | Repo | Upstream | Why it matters | Top-level files inspected |
| ---: | --- | --- | --- | --- |
| 22 | `mem0` | `mem0ai/mem0` | Agent memory layer with vector backends and optional Ollama/local-provider support. | `README.md`, `pyproject.toml`, `Makefile` |
| 23 | `zep` | `getzep/zep` | Context assembly and relationship-aware retrieval reference. | `README.md`, `pyproject.toml` |
| 24 | `agentmemory` | `rohitg00/agentmemory` | Persistent coding-agent memory via MCP and Docker/local modes. | `README.md`, `package.json`, `docker-compose.yml` |
| 25 | `GitNexus` | `abhigyanpatwari/GitNexus` | Repository knowledge graph and CLI/MCP code-context layer. | `README.md`, `ARCHITECTURE.md`, `package.json`, `Dockerfile.*`, `docker-compose.yaml` |

### Browser, Desktop, And Windows Control

| Rank | Repo | Upstream | Why it matters | Top-level files inspected |
| ---: | --- | --- | --- | --- |
| 26 | `agent-browser` | `vercel-labs/agent-browser` | Rust browser automation CLI for coding agents; useful precedent for native host plus tool runtime. | `README.md`, `package.json`, `agent-browser.schema.json` |
| 27 | `Windows-MCP` | `CursorTouch/Windows-MCP` | Windows desktop/UI control exposed through MCP. | `README.md`, `pyproject.toml`, `manifest.json`, `server.json` |
| 28 | `crawlee` | `apify/crawlee` | Node scraping/browser automation library with Playwright integration. | `README.md`, `package.json`, `tsconfig.json`, `turbo.json` |

### Local Runtime, Sandboxing, And Evaluation

| Rank | Repo | Upstream | Why it matters | Top-level files inspected |
| ---: | --- | --- | --- | --- |
| 29 | `ollama` | `ollama/ollama` | Local model runtime with Windows, Linux, macOS, and Docker paths. Good model-provider boundary reference. | `README.md`, `go.mod`, `CMakeLists.txt`, `Dockerfile` |
| 30 | `NemoClaw` | `NVIDIA/NemoClaw` | Sandboxed OpenClaw/OpenShell reference stack and controlled runtime packaging signal. | `README.md`, `package.json`, `pyproject.toml`, `Dockerfile`, `Makefile` |

Near misses worth retaining as secondary references: `llama.cpp`, `open-webui`, `promptfoo`, `agent-scan`, `microsoft-mcp`, `onyx`, `screenpipe`, `crawl4ai`, `camofox-browser`, `nix-openclaw`, `clawsweeper`, `agentscope-bricks`, and `agentscopeskills`.

Downgraded despite name relevance: `openclaw.ai` is a website/install surface, `nix-openclaw` is packaging rather than core harness design, `agentscope-bricks` is moving into `agentscope-runtime`, and `autogen` is marked as maintenance-mode in its own top-level docs.

## Proposed ARDYN Architecture

ARDYN should be a standalone open-source harness with optional bridges, not a Locus submodule and not a Multiverse-dependent product.

Recommended split:

- Rust host: native CLI/daemon, process supervision, stdio/HTTP/WebSocket transports, Windows integration, filesystem policy, credential boundary enforcement, install/update flows, sandbox process launching, and local event spool.
- TypeScript core: agent orchestration, session graph, tool registry, MCP adapters, provider abstraction, plugin SDK, memory adapters, workflow policies, Locus adapter, Multiverse adapter, and dashboard/API surfaces.
- Shared contracts: JSON Schema first, with generated TypeScript types and Rust structs later. Contracts should define manifests, capabilities, sessions, events, tool permissions, Locus connection metadata, and Multiverse citizen registration.

Rust host plus TypeScript core is justified if the boundary stays strict: Rust owns "run ARDYN safely on this machine"; TypeScript owns "what ARDYN is as an agent harness." The tradeoff is two toolchains and generated schema discipline. The benefit is a native, Windows-friendly, policy-aware host without forcing plugin authors into Rust.

Key architecture decisions:

- MCP is a typed boundary, not a plugin afterthought.
- Local-first execution must work without Locus or Multiverse.
- Locus is a peer client/control plane that connects to ARDYN; ARDYN must not import Locus internals.
- Multiverse registration is optional citizenship metadata; it must not own ARDYN identity.
- Memory is layered: session scratchpad, durable facts, repo graph context, relationship-aware retrieval, and optional desktop activity traces.
- Browser/desktop automation should have both CLI and service shapes.
- Tool execution requires explicit manifests, permission grants, audit events, and sandbox strategy.
- Provider access should be OpenAI-compatible/local-provider friendly, with Ollama and similar systems as adapters rather than core dependencies.
- Evaluation and security scanning should become standard release gates once production code exists.

## Recommended Initial Repo Layout

This is the recommended scaffold for the first repository pass. It is not created yet, except for this inventory directory.

```text
/
  README.md
  LICENSE
  SECURITY.md
  CONTRIBUTING.md
  CODE_OF_CONDUCT.md
  GOVERNANCE.md
  ROADMAP.md
  AGENTS.md

  docs/
    architecture.md
    product-boundary.md
    runtime-model.md
    security-model.md
    plugin-model.md
    mcp-boundary.md
    locus-integration.md
    multiverse-citizen.md
    packaging.md
    decisions/
      0001-rust-host-typescript-core.md

  schemas/
    ardyn.manifest.schema.json
    plugin.manifest.schema.json
    capability.schema.json
    session-event.schema.json
    tool-permission.schema.json
    locus.connection.schema.json
    citizen.registration.schema.json

  crates/
    ardyn-host/
      README.md
      Cargo.toml
      src/

  packages/
    core/
      README.md
      package.json
      src/
    sdk/
      README.md
      package.json
      src/
    cli/
      README.md
      package.json
      src/

  apps/
    dashboard/
      README.md
      package.json
      src/

  integrations/
    locus/
      README.md
    multiverse/
      README.md
    mcp/
      README.md

  examples/
    minimal-harness/
      README.md
    mcp-tool/
      README.md
    locus-bridge/
      README.md

  docker/
    README.md
    compose.yaml
    docker-bake.hcl

  repo-inventory/
    ardyn-fork-inventory.json
    ardyn-fork-inventory.md
```

## First Coding Phase

Phase 0 should be documentation and scaffold only:

1. Add public project docs: README, product boundary, architecture, security model, plugin model, MCP boundary, Locus integration, Multiverse citizen model, and ADR 0001.
2. Add schema drafts for ARDYN manifest, plugin manifest, capabilities, session events, tool permissions, Locus connection, and citizen registration.
3. Add non-functional Rust and TypeScript workspace scaffolds with placeholder package metadata, but no agent loop and no real tool execution.
4. Add markdown/schema validation CI only.

Phase 1 should be the first real implementation phase:

1. Implement contract validation in TypeScript and Rust from the same schemas.
2. Add a Rust `ardyn` CLI skeleton with `doctor`, `identity`, `capabilities`, and `serve --dry-run`.
3. Add a TypeScript core package that loads an ARDYN manifest and returns static capability metadata.
4. Add a host/core handshake over stdio using the session-event schema.
5. Add tests for schema validation, host/core handshake, and no-network standalone mode.

Explicitly defer autonomous planning, production tool execution, Locus live control, Multiverse registration, Docker images, browser automation, credential vaulting, and model-provider integrations until the contract layer is stable.

## Files Created Or Changed

- `repo-inventory/ardyn-fork-inventory.json`
- `repo-inventory/ardyn-fork-inventory.md`

