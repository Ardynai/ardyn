# Ardyn

**Open-source AI harness for defining and running local agent-system contracts with explicit manifests, capabilities, task contracts, and approval-gated runtime.**

![License: Apache-2.0](https://img.shields.io/badge/license-Apache--2.0-blue)
![Node](https://img.shields.io/badge/node-%3E%3D22-brightgreen)
![Rust](https://img.shields.io/badge/rust-stable-orange)
![Tests](https://img.shields.io/badge/tests-1279%20Node%20%2B%20101%20Rust-brightgreen)
![Status](https://img.shields.io/badge/status-alpha--build-yellow)

![Ardyn Architecture](docs/diagrams/architecture.svg)

*Architecture diagram: CLI → Core → Fabric → SDK, with Rust host, console, schemas, and trust boundaries.*

## What it is

Ardyn is an AI harness/framework that lets you define agent-system contracts — manifests, capabilities, tasks — and execute them under approval-gated runtime with kill-switch, redaction, transcript audit, and failure rollback. It includes a CLI (12 commands), a Rust host with real session lifecycle, a fabric federation client (hardened + wired), a consumer SDK with TypeScript types and React display components, an embedded SQLite DB with auth/permissions, and a web console with API routes and SSE streaming.

## Why it matters

AI agents need guardrails that don't depend on the agent itself being safe. Ardyn provides the infrastructure layer: manifest-driven capability declarations, review-only boundary maps that document every phase of the system's evolution, and a runtime that can only execute under explicit approval with full audit trail. It's the harness, not the agent.

## Status

**Alpha — build mode.** The review-only specification (~200 phases of boundary maps, fixtures, and metadata) is complete and serves as the spec. The runtime is now enabled under explicit flags with real process spawning. The federation client is hardened and wired. The console builds and has API routes with auth.

| Surface | Status |
|---------|--------|
| CLI (12 commands: doctor, identity, capabilities, plan, serve, serve-runtime, shell, sqlite, federation, review-trace, review-artifact, validate-session-transcript) | ✅ Working |
| Runtime (serve-runtime --enable-runtime --approve --command) | ✅ Real process spawning |
| Runtime (serve-runtime --rust-session) | ✅ Rust host subprocess bridge |
| Kill switch (--kill-after-ms) | ✅ Functional (auto-SIGTERM) |
| Stderr redaction | ✅ Masks token=/secret=/Bearer patterns |
| Transcript audit + failure audit | ✅ Per-session events + non-zero exit detection |
| SSE streaming (--stream) | ✅ CLI emits SSE events |
| Shell command (shell --enable-runtime --approve --command) | ✅ Real shell execution |
| SQLite command (sqlite --enable-runtime --approve --database --query) | ✅ Real SQLite via node:sqlite |
| Embedded DB (SQLite: sessions, audit_log, permissions) | ✅ Working |
| Auth (deny-by-default permissions, rate limiting, SQL injection prevention) | ✅ Working |
| Fabric federation hardening (5/5) | ✅ redirect:manual, host allowlist, response cap, identity confinement |
| Fabric federation wiring (federation status/config) | ✅ Wired into CLI |
| Consumer SDK (loadManifest, createPlan, validateTranscript) | ✅ Working |
| Display components (SessionTrace, StatusBadge, ManifestViewer, ApprovalGate) | ✅ Accessible (aria attributes) |
| TypeScript types (index.d.ts) | ✅ 15+ interfaces |
| Console UI (6 views + 4 API routes) | ✅ Builds, has auth + health + SSE |
| Console deployment (Vercel config) | ✅ Config ready |
| Dockerfile | ✅ Multi-stage build |
| Rust host session lifecycle | ✅ run_session_lifecycle() with approval gate |
| JSON Schema validation | ✅ 103 boundary-map schemas |
| Test suite | ✅ 1279 Node + 101 Rust tests |
| index.mjs modularization | ⚠️ In progress (73k lines, barrel re-export + 2 modules extracted) |

## Demo / Screenshots

### CLI Runtime Execution

```bash
$ node apps/cli/src/index.mjs serve-runtime --enable-runtime --approve \
    --manifest examples/minimal-manifest/ardyn.manifest.json \
    --command "node -e process.stdout.write(JSON.stringify({event:'start'})+'\n')"

{
  "command": "serve-runtime",
  "runtimeEnabled": true,
  "approved": true,
  "processesSpawned": true,
  "processResult": {
    "exitCode": 0,
    "frames": [{ "event": "start" }],
    "killed": false
  },
  "killSwitchActivated": false,
  "transcriptAudit": { "events": [...] },
  "failureAudit": { "activated": false }
}
```

### Console UI

The Ardyn Harness Console is a Next.js 15 / React 19 web app with 6 views:

- **Dashboard** — KPI cards (tests, phases, runtime status, federation status)
- **Trace Viewer** — Session trace with JSONL frame viewer (empty/loading/error states)
- **Fixture Gallery** — Browse boundary-map fixtures by category
- **Federation Monitor** — Read-only federation hardening status
- **Runtime Control** — Approval-gated runtime control (never bypasses CLI gates)
- **Onboarding** — 10-minute consumer integrator guide

API routes: `/api/status`, `/api/runtime`, `/api/federation`, `/api/health`, `/api/events` (SSE)

### SSE Streaming

```bash
$ node apps/cli/src/index.mjs serve-runtime --enable-runtime --approve \
    --manifest examples/minimal-manifest/ardyn.manifest.json \
    --command "node -e process.stdout.write(JSON.stringify({event:'start'})+'\n')" \
    --stream

event: frame
data: {"type":"stdout_frame","frame":{"event":"start"}}
```

## Features

- **Manifest-driven contracts** — declare capabilities, tasks, and adapter boundaries in JSON
- **Approval-gated runtime** — `serve-runtime` requires `--enable-runtime` and `--approve`; no implicit execution
- **Real process spawning** — `--command` spawns a child process, captures JSONL stdout frames, applies stderr redaction
- **Kill switch** — `--kill-after-ms` auto-SIGTERM after timeout
- **Rust host bridge** — `--rust-session` invokes the Rust host `run_session_lifecycle()` binary
- **Shell + SQLite commands** — `shell --command` and `sqlite --database --query` under the same approval gate
- **Embedded DB** — SQLite via `node:sqlite` with sessions, audit_log, permissions tables
- **Deny-by-default auth** — permissions, rate limiting, SQL injection prevention, env-only secrets
- **SSE streaming** — `--stream` flag emits Server-Sent Events as frames arrive
- **Review-only boundary maps** — 119 phases of metadata documenting every trust boundary
- **Fabric federation** — loopback-only, hardened (5/5), wired into CLI (`federation status/config`)
- **Consumer SDK** — `@ardyn/sdk` with TypeScript types and accessible React display components
- **Web console** — Next.js with 6 views, 4 API routes, auth middleware, health endpoint
- **Security invariants** — no P2P/DHT, no Secure Drop decrypt, no forbidden deps, CUA stays gated

## Quickstart

```bash
# Clone
git clone https://github.com/Ardynai/ardyn.git
cd ardyn

# Install dependencies
npm install

# Run tests
npm test

# CLI commands
node apps/cli/src/index.mjs doctor
node apps/cli/src/index.mjs identity
node apps/cli/src/index.mjs capabilities --manifest examples/minimal-manifest/ardyn.manifest.json
node apps/cli/src/index.mjs serve --dry-run --manifest examples/minimal-manifest/ardyn.manifest.json

# Runtime (dry-run plan)
node apps/cli/src/index.mjs serve-runtime --enable-runtime --dry-run --manifest examples/minimal-manifest/ardyn.manifest.json

# Runtime (real execution)
node apps/cli/src/index.mjs serve-runtime --enable-runtime --approve --manifest examples/minimal-manifest/ardyn.manifest.json --command "echo hello"

# Runtime (Rust host session)
cargo build --manifest-path crates/ardyn-host/Cargo.toml --bin session
node apps/cli/src/index.mjs serve-runtime --enable-runtime --approve --manifest examples/minimal-manifest/ardyn.manifest.json --rust-session

# Shell command
node apps/cli/src/index.mjs shell --enable-runtime --approve --command "echo hello"

# SQLite query
node apps/cli/src/index.mjs sqlite --enable-runtime --approve --database test.db --query "CREATE TABLE test (id INTEGER)"

# Federation status
node apps/cli/src/index.mjs federation status

# SSE streaming
node apps/cli/src/index.mjs serve-runtime --enable-runtime --approve --manifest examples/minimal-manifest/ardyn.manifest.json --command "echo hello" --stream

# Console dev
cd apps/console && npm install && npm run dev
```

## Architecture

![Ardyn Architecture](docs/diagrams/architecture.svg)

*Architecture: CLI → Core → Fabric → SDK, with Rust host, console, schemas, and trust boundaries.*

```
ardyn/
├── apps/
│   ├── cli/           # CLI entry point (12 commands, Node.js)
│   └── console/       # Web UI (Next.js 15 + React 19, 6 views + 4 API routes)
├── packages/
│   ├── core/          # Core library (73k lines, modularization in progress)
│   │   ├── src/index.mjs          # Monolith (74 create*ForReview helpers)
│   │   ├── src/index.js           # Barrel re-export (modularization entry)
│   │   ├── src/internal/utils.mjs # Extracted shared utilities
│   │   └── src/data-auth.mjs      # M3: DB, auth, permissions, secrets
│   ├── fabric/        # Fabric federation client (hardened + wired)
│   ├── sdk/           # Consumer SDK + TypeScript types + React components
│   └── adapters/      # Adapter scaffolds
├── crates/
│   └── ardyn-host/    # Rust host (101 tests, session lifecycle binary)
│       ├── src/lib.rs             # Host scaffold (pub mod stdio_runtime)
│       ├── src/stdio_runtime/     # Session lifecycle, contract gates
│       └── src/bin/session.rs     # M1-Rust: session lifecycle binary
├── schemas/           # 103 JSON Schemas (manifest, task, capability, session)
├── tests/             # 1279 Node tests
├── docs/              # Architecture, onboarding, how-it-works, phase docs
├── Dockerfile         # Multi-stage build (Rust + Node + console)
└── vercel.json        # Vercel deployment config
```

**Main flows:**
1. **Plan flow**: `CLI → loadManifest → loadTask → createTaskPlan → JSON output`
2. **Runtime flow**: `CLI serve-runtime → --enable-runtime → --approve → spawn process → JSONL frames → kill switch → transcript audit → failure audit → JSON output`
3. **Rust flow**: `CLI --rust-session → spawn target/debug/session → run_session_lifecycle() → JSON output`
4. **Federation flow**: `CLI federation status → loadFabricFederationConfigFromEnv() → hardening status → JSON output`
5. **SSE flow**: `CLI --stream → process.stdout.write("event: frame\ndata: ...") → console /api/events SSE endpoint`

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the full architecture map.

## Configuration

Ardyn uses environment variables for secrets and runtime config. No secrets are committed.

| Variable | Purpose | Default |
|----------|---------|---------|
| `ARDYN_FABRIC_DID` | Local DID for federation | `did:multiverse:ardyn` |
| `ARDYN_FABRIC_REGISTRY_URL` | Registry base URL | (none) |
| `ARDYN_FABRIC_REGISTRY_TOKEN` | Bearer token for registry | (none — env only) |
| `ARDYN_FABRIC_IDENTITY_FILE` | Path to identity file | (none) |
| `ARDYN_FABRIC_FEDERATION_ALLOWLIST` | Comma-separated sibling DIDs | (none) |
| `ARDYN_CONSOLE_API_KEY` | API key for console auth (if set, routes require `x-api-key` header) | (none — open in local dev) |

## Development

```bash
# Node tests
npm test

# Rust tests
cargo test --manifest-path crates/ardyn-host/Cargo.toml

# Lint (Rust)
cargo clippy --manifest-path crates/ardyn-host/Cargo.toml --all-targets -- -D warnings
cargo fmt --check --manifest-path crates/ardyn-host/Cargo.toml

# Build Rust session binary
cargo build --manifest-path crates/ardyn-host/Cargo.toml --bin session

# Report
npm run report:phase-status

# Console dev
cd apps/console && npm install && npm run dev

# Console build
cd apps/console && npx next build

# Docker build
docker build -t ardyn .
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for the phase cadence and safety boundaries.

## Security / Privacy

- **No P2P/DHT/BitTorrent** — never, not as dependency or runtime path
- **No Secure Drop decryption** — Ardyn carries ciphertext only
- **No forbidden dependencies** — no libp2p, torch, tensorflow, transformers, hermes, cua, etc.
- **Secrets from env only** — never committed, never logged, never in URLs
- **Approval gates enforced** — runtime cannot execute without `--enable-runtime` + `--approve`
- **Kill switch functional** — `--kill-after-ms` auto-SIGTERM after timeout
- **Stderr redaction** — masks `token=`/`secret=`/`password=`/`Bearer` patterns
- **Deny-by-default permissions** — DB auth layer denies all capabilities by default
- **SQL injection prevention** — statement allowlist + multi-statement block
- **Rate limiting** — in-memory token bucket (100 requests / 60s default)
- **Federation stays loopback** — sidecar on localhost, HTTPS for remote, closed sibling-DID allowlist
- **CUA/computer-use stays gated** — reference-only unless separately authorized
- **Console auth** — API key middleware (`ARDYN_CONSOLE_API_KEY` env var)

See [SECURITY.md](SECURITY.md) for the full threat model.

## Phase documentation index

Ardyn's review-only specification spans ~200 phases. Key phase docs:

- [Phase 4.0C: Pre-runtime transport policy](docs/phase-4-0c-pre-runtime-transport-policy.md)
- [Phase 4.0D: Rust host transport policy contracts](docs/phase-4-0d-rust-host-transport-policy-contracts.md)
- [Phase 4.0E: Rust host policy metadata](docs/phase-4-0e-rust-host-policy-metadata.md)
- [Phase 4.0F: Host policy review records](docs/phase-4-0f-host-policy-review-records.md)
- [Phase 4.0G: Host policy review comparison](docs/phase-4-0g-host-policy-review-comparison.md)
- [Phase 4.0H: Reviewer handoff index](docs/phase-4-0h-reviewer-handoff-index.md)
- [Phase 4.0I: Final pre-runtime readiness](docs/phase-4-0i-final-pre-runtime-readiness.md)
- [Phase 4.1: Runtime proposal](docs/phase-4-1-runtime-proposal.md)
- [Phase 4.1A: Host policy approval records](docs/phase-4-1a-host-policy-approval-records.md)
- [Phase 4.1B: Transport harness contracts](docs/phase-4-1b-transport-harness-contracts.md)
- [Phase 4.1C: Framing/redaction contracts](docs/phase-4-1c-framing-redaction-contracts.md)
- [Phase 4.1D: Transcript replay contracts](docs/phase-4-1d-transcript-replay-contracts.md)
- [Phase 4.1E: Failure-audit/kill semantics](docs/phase-4-1e-failure-audit-kill-semantics.md)
- [Phase 4.1F: Runtime readiness checkpoint](docs/phase-4-1f-runtime-readiness-checkpoint.md)
- [Phase 4.1G: External review packet](docs/phase-4-1g-external-review-packet.md)
- [Phase 4.1H: External review disposition](docs/phase-4-1h-external-review-disposition.md)
- [Phase 4.1I: Rust host stdio harness](docs/phase-4-1i-rust-host-stdio-harness.md)
- [Phase 5.1: Controlled runtime implementation approval](docs/phase-5-1-controlled-runtime-implementation-approval-handoff.md)
- [Phase 5.5: Default blocked runtime CLI](docs/phase-5-5-default-blocked-runtime-cli.md)
- [Phase 5.15: Positive runtime smoke requirement](docs/phase-5-15-positive-runtime-smoke-requirement.md)
- [Phase 5.77: Code mode orchestration](docs/phase-5-77-code-mode-orchestration-boundary.md)
- [Phase 5.83: External-reference policy](docs/external-reference-policy.md)

See `docs/plan/autobuild/PROGRESS.md` for the full autobuild progress log.

## Roadmap

| Item | Status |
|------|--------|
| M0: Foundation & de-risk | ✅ Complete |
| M1: Runtime core (serve-runtime + process spawning + Rust bridge) | ✅ Complete |
| M2: CLI command surface (12 commands including shell + sqlite) | ✅ Complete |
| M3: Data & auth (embedded SQLite, permissions, rate limiting, secrets) | ✅ Complete |
| M4: Fabric federation (hardened + wired into CLI) | ✅ Complete |
| M5: Consumer SDK (TypeScript types + display components) | ✅ Complete |
| M6: Console UI (6 views, 4 API routes, auth, SSE, health) | ✅ Complete |
| M7: Agent modes (Code Mode verified) | ✅ Complete |
| M8: Hardening & docs (threat model, expert panel, cleanup report) | ✅ Complete |
| Full index.mjs modularization | ⚠️ In progress (barrel re-export + 2 modules extracted, path documented) |
| Console Vercel deployment | ⚠️ Config ready, needs `vercel deploy` with auth |
| End-to-end SSE CLI→console connection | ⚠️ Both sides implemented, not connected via message queue |

## License

Apache-2.0. See [LICENSE](LICENSE).