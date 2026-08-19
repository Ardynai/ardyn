# Ardyn

**Open-source AI harness for defining and running local agent-system contracts with explicit manifests, capabilities, task contracts, and approval-gated runtime.**

![License: Apache-2.0](https://img.shields.io/badge/license-Apache--2.0-blue)
![Node](https://img.shields.io/badge/node-%3E%3D20-brightgreen)
![Rust](https://img.shields.io/badge/rust-stable-orange)
![Tests](https://img.shields.io/badge/tests-1236%20%E2%9C%93-brightgreen)
![Status](https://img.shields.io/badge/status-alpha--build-yellow)

## What it is

Ardyn is an AI harness/framework that lets you define agent-system contracts — manifests, capabilities, tasks — and execute them under approval-gated runtime with kill-switch, redaction, transcript audit, and failure rollback. It includes a CLI, a Rust host scaffold, a fabric federation client (hardened, unwired), a consumer SDK, and a web console.

## Why it matters

AI agents need guardrails that don't depend on the agent itself being safe. Ardyn provides the infrastructure layer: manifest-driven capability declarations, review-only boundary maps that document every phase of the system's evolution, and a runtime that can only execute under explicit approval with full audit trail. It's the harness, not the agent.

## Status

**Alpha — build mode.** The review-only specification (~200 phases of boundary maps, fixtures, and metadata) is complete and serves as the spec. The runtime is now enabled under explicit flags (`--enable-runtime --approve`). The federation client is hardened but NOT wired. The console UI is scaffolded but not yet production-deployed.

| Surface | Status |
|---------|--------|
| CLI commands (doctor, identity, capabilities, plan, serve, serve-runtime) | ✅ Working |
| Runtime (serve-runtime --enable-runtime --dry-run) | ✅ Dry-run plan |
| Runtime (actual process spawning) | ⚠️ Planned |
| Fabric federation hardening | ✅ 5/5 applied |
| Fabric federation wiring | ⚠️ Not wired (by design) |
| Consumer SDK | ✅ Basic (loadManifest, createPlan, validateTranscript) |
| Console UI (6 views) | ✅ Scaffolded, not deployed |
| Embedded DB / auth | ⚠️ Blocked (needs DB engine decision) |
| JSON Schema validation | ✅ 103 boundary-map schemas |
| Test suite | ✅ 1236 Node + 98 Rust tests |

## Features

- **Manifest-driven contracts** — declare capabilities, tasks, and adapter boundaries in JSON
- **Approval-gated runtime** — `serve-runtime` requires `--enable-runtime` and `--approve`; no implicit execution
- **Kill switch + redaction + audit** — runtime includes fail-closed stderr redaction, transcript replay, and failure audit with rollback
- **Review-only boundary maps** — 119 phases of metadata documenting every trust boundary, with real JSON Schema validation
- **Fabric federation client** — loopback-only, hardened (redirect:manual, host allowlist, response-size cap, identity-file confinement), NOT wired
- **Consumer SDK** — `@ardyn/sdk` with manifest loading, plan creation, transcript validation
- **Web console** — Next.js dashboard, trace viewer, fixture gallery, federation monitor, runtime control, onboarding
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
node apps/cli/src/index.mjs serve-runtime --enable-runtime --dry-run --manifest examples/minimal-manifest/ardyn.manifest.json
```

## Architecture

```
ardyn/
├── apps/
│   ├── cli/           # CLI entry point (Node.js)
│   └── console/       # Web UI (Next.js 15 + React 19 + Tailwind)
├── packages/
│   ├── core/          # Core library (73k-line monolith, modularization in progress)
│   │   └── src/internal/utils.mjs  # Extracted shared utilities
│   ├── fabric/        # Fabric federation client (hardened, unwired)
│   ├── sdk/           # Consumer-facing SDK
│   └── adapters/      # Adapter scaffolds
├── crates/
│   └── ardyn-host/    # Rust host scaffold (stdio runtime, policy contracts)
├── schemas/           # JSON Schemas (manifest, task, capability, session, boundary-maps)
├── tests/             # 1236 Node tests + helpers
└── docs/              # Architecture, onboarding, phase docs, how-it-works
```

**Main flows:**
1. **Plan flow**: `CLI → loadManifest → loadTask → createTaskPlan → JSON output`
2. **Runtime flow**: `CLI serve-runtime → --enable-runtime → --approve → session plan → (dry-run: stop | live: spawn process with kill-switch)`
3. **Federation flow**: `federation.mjs → loopback sidecar → HTTPS registry → contentId re-verification (NOT WIRED)`

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the full architecture map.

## Configuration

Ardyn uses environment variables for secrets and runtime config. No secrets are committed.

| Variable | Purpose | Default |
|----------|---------|---------|
| `ARDYN_FABRIC_DID` | Local DID for federation | `did:multiverse:ardyn` |
| `ARDYN_FABRIC_REGISTRY_URL` | Registry base URL | (none — unwired) |
| `ARDYN_FABRIC_REGISTRY_TOKEN` | Bearer token for registry | (none — from env only) |
| `ARDYN_FABRIC_IDENTITY_FILE` | Path to identity file | (none) |
| `ARDYN_FABRIC_FEDERATION_ALLOWLIST` | Comma-separated sibling DIDs | (none) |

## Development

```bash
# Node tests
npm test

# Rust tests
cargo test --manifest-path crates/ardyn-host/Cargo.toml

# Lint (Rust)
cargo clippy --manifest-path crates/ardyn-host/Cargo.toml --all-targets -- -D warnings
cargo fmt --check --manifest-path crates/ardyn-host/Cargo.toml

# Report
npm run report:phase-status

# Console dev
cd apps/console && npm install && npm run dev
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for the phase cadence and safety boundaries.

## Security / Privacy

- **No P2P/DHT/BitTorrent** — never, not as dependency or runtime path
- **No Secure Drop decryption** — Ardyn carries ciphertext only
- **No forbidden dependencies** — no libp2p, torch, tensorflow, transformers, hermes, cua, etc.
- **Secrets from env only** — never committed, never logged, never in URLs
- **Approval gates enforced** — runtime cannot execute without `--enable-runtime` + `--approve`
- **Federation stays loopback** — sidecar on localhost, HTTPS for remote, closed sibling-DID allowlist
- **CUA/computer-use stays gated** — reference-only unless separately authorized

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
| M1: Runtime core (serve-runtime) | ✅ Complete (dry-run) |
| M2: CLI command surface | ✅ Complete |
| M3: Data & auth (embedded DB) | ⚠️ Blocked — needs DB engine decision |
| M4: Fabric federation hardening | ✅ Complete (5/5 applied) |
| M5: Consumer SDK | ✅ Basic complete |
| M6: Console UI | ✅ Scaffolded (6 views) |
| M7: Agent modes (Code Mode) | ✅ Verified |
| M8: Hardening & docs | ✅ SECURITY.md, threat model |
| Full index.mjs modularization | ⚠️ Deferred (73k lines → incremental) |
| Console production deploy | ⚠️ Not yet deployed |
| Federation client wiring | ⚠️ Not wired (by design) |

## License

Apache-2.0. See [LICENSE](LICENSE).