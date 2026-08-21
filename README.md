# Ardyn

**Open-source AI harness for defining and running local agent-system contracts with explicit manifests, capabilities, task contracts, and approval-gated runtime.**

![License: Apache-2.0](https://img.shields.io/badge/license-Apache--2.0-blue)
![Node](https://img.shields.io/badge/node-%3E%3D22-brightgreen)
![Rust](https://img.shields.io/badge/rust-stable-orange)
![Tests](https://img.shields.io/badge/tests-1367%20Node%20%2B%20101%20Rust-brightgreen)
![Status](https://img.shields.io/badge/status-alpha--build-yellow)

![Ardyn Architecture](docs/diagrams/architecture.svg)

*Architecture: CLI → Core → Fabric → SDK, with Rust host, console, schemas, and trust boundaries.*

**Additional diagrams:** [User Flow](docs/diagrams/user-flow.svg) | [Data Flow](docs/diagrams/data-flow.svg) | [Deployment](docs/diagrams/deployment.svg) | [Security Boundaries](docs/diagrams/security-boundaries.svg)

## What it is

Ardyn is an AI harness/framework that lets you define agent-system contracts — manifests, capabilities, tasks — and execute them under approval-gated runtime with kill-switch, redaction, transcript audit, and failure rollback. It includes a CLI (13 commands), a Rust host with real session lifecycle, a fabric federation client (hardened + wired), a consumer SDK with TypeScript types and React display components, an embedded SQLite DB with auth/permissions, multi-user support with per-user isolation, a multi-interface gateway (Telegram + Slack), a loop-state control plane, per-user memory, and a web console with API routes and SSE streaming.

## Why it matters

Agent systems need more than prompts — they need contracts, approval gates, audit trails, and kill switches. Ardyn provides the infrastructure to run agents safely: every action is decided before it happens and recorded after. Computer-use runs in isolated sandboxes, never on the host. Federation is hardened but content exchange stays unwired until explicitly authorized.

## Console

The Ardyn Harness Console is a Next.js 15 / React 19 web UI for operating and observing the harness. It features a distinctive "command-room" design with signal-cyan accent, deep void backgrounds, monospace data, and real loading/empty/error states.

![Dashboard](docs/assets/console-dashboard.png)
*Dashboard — KPI cards, system status, live SSE event feed*

![Federation](docs/assets/console-federation.png)
*Federation — hardening checklist, sibling DID allowlist*

![Runtime](docs/assets/console-runtime.png)
*Runtime — approval gate, kill switch, sandbox features*

![Onboarding](docs/assets/console-onboarding.png)
*Onboarding — 5-step integrator flow with SDK quickstart*

![Trace Viewer](docs/assets/console-trace.png)
*Trace Viewer — session transcript schema and replay*

![Fixtures](docs/assets/console-fixtures.png)
*Fixtures — boundary maps, phase records, test fixtures*

## Quickstart

```bash
# Install
npm ci

# Run tests (local green gate — replaces CI)
node --test tests/*.test.mjs          # 1367 Node tests
cargo test --manifest-path crates/ardyn-host/Cargo.toml  # 101 Rust tests

# CLI usage
node apps/cli/src/index.mjs doctor --manifest examples/minimal-manifest/ardyn.manifest.json
node apps/cli/src/index.mjs capabilities --manifest examples/minimal-manifest/ardyn.manifest.json
node apps/cli/src/index.mjs serve-runtime --enable-runtime --approve --manifest examples/minimal-manifest/ardyn.manifest.json
node apps/cli/src/index.mjs computer-use --enable-computer-use --approve --dry-run --manifest examples/minimal-manifest/ardyn.manifest.json
node apps/cli/src/index.mjs federation status

# Console
cd apps/console && npm ci && npx next build && npx next start -p 3000
# Open http://localhost:3000

# Docker
docker build -t ardyn . && docker run -p 3000:3000 ardyn
```

## Architecture

| Component | Path | Description |
|---|---|---|
| CLI | `apps/cli/src/index.mjs` | 13 commands: doctor, identity, capabilities, plan, review-trace, review-artifact, validate-session-transcript, emit-session-events, serve-runtime, computer-use, federation, shell, sqlite |
| Core | `packages/core/src/index.mjs` | 73k-line monolith with 128+ exports. Modularized into barrel re-exports: validation.js, create-review-helpers.js, data-helpers.js, schema-helpers.js |
| Computer-use | `packages/core/src/computer-use.mjs` | Governed sandbox (Docker, ubuntu:22.04, Xvfb). Record-before-act gateway, take-the-wheel, per-session token |
| Multi-user | `packages/core/src/multi-user.mjs` | Per-user accounts, sessions, sandboxes. Strict isolation (tested) |
| Loop-state | `packages/core/src/loop-state.mjs` | Goals, todos (claimed_by), gates, quota, append-only run history |
| User memory | `packages/core/src/user-memory.mjs` | Per-user memory + profile, cross-session search, strict isolation |
| Gateway | `packages/gateway/src/gateway.mjs` | Telegram + Slack adapters, webhook verification (constant-time), per-user mapping |
| Data/auth | `packages/core/src/data-auth.mjs` | SQLite DB, permissions, rate limiting, SQL injection prevention |
| Federation | `packages/fabric/src/federation.mjs` | Hardened client (8/8 checks), real Ed25519 signature verification, content exchange UNWIRED |
| Rust host | `crates/ardyn-host/` | Session lifecycle, stdio runtime, subprocess bridge binary |
| Console | `apps/console/` | Next.js 15 / React 19 web UI with 6 pages + 7 API routes |
| SDK | `packages/sdk/` | TypeScript types (15+ interfaces) |
| Display components | `packages/sdk/src/components/` | SessionTrace, StatusBadge, ManifestViewer, ApprovalGate |

## Configuration

| Variable | Description | Default |
|---|---|---|
| `ARDYN_CONSOLE_API_KEY` | Console API key (required in production) | unset (open in dev) |
| `ARDYN_CONSOLE_USER_TOKENS` | Per-user auth tokens (JSON) | unset |
| `ARDYN_FABRIC_SIBLING_KEYS` | Federation sibling DID→public-key map (JSON) | unset |
| `ARDYN_FABRIC_IDENTITY_FILE` | Local federation identity file | unset |
| `COMPUTER_RUNTIME` | Computer-use runtime: `docker` or `runsc` (gVisor) | `docker` |
| `NODE_ENV` | Set to `production` to enforce auth | `development` |

## Status

| Milestone | Status | Description |
|---|---|---|
| M0–M8 | ✅ Complete | Runtime, console, federation hardening, docs |
| M9 | ✅ Complete | Computer-use (sandboxed, governed, real spawn) |
| M10 | ✅ Complete | Multi-user support (per-user isolation, tested) |
| M11 | ✅ Complete | Governed computer-use (real sandbox spawn, gateway, take-the-wheel) |
| M12 | ✅ Complete | Loop-state control plane (goals, gates, todos, quota) |
| M13 | ✅ Complete | Multi-interface gateway (Telegram + Slack adapters) |
| M14 | ✅ Complete | Per-user memory (cross-session recall, isolated) |
| Modularization | ✅ Complete | Barrel re-export modules (validation, helpers, data, schema) |
| SSE CLI→console | ✅ Complete | Event buffer round-trip tested, live events on dashboard |
| Vercel deployment | ⚠️ Blocked on Josh | Config ready (`vercel.json`, `.vercelignore`), needs `vercel login` (interactive browser auth) |
| Console UI redesign | ✅ Complete | Command-room design with signal-cyan, real states, screenshots |

## Security

- Computer-use runs ONLY in isolated Docker containers, never the host
- Every session is approval-gated + kill-switchable + audited + secret-redacted
- Per-user isolation enforced AND tested (sessions, sandboxes, memory)
- Federation content-exchange stays UNWIRED
- Real Ed25519 signature verification for inbound federation messages
- Constant-time HMAC comparison for gateway webhook verification
- No secrets committed; all tokens from env / gitignored `config/secret/`

## Roadmap

- Federation content exchange (requires explicit authorization)
- Real container interaction (docker exec with xdotool/import)
- Additional gateway adapters (Discord, WhatsApp, Signal, Email)
- Adaptive per-user UI evolution
- Website scroll experience

## License

Apache-2.0