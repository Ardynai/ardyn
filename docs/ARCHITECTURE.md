# Architecture

## Repo map

Ardyn is a monorepo with Node.js (CLI, core, fabric, SDK, console) and Rust (host scaffold) workspaces.

**Visual diagrams:** [Architecture](diagrams/architecture.svg) | [User Flow](diagrams/user-flow.svg) | [Data Flow](diagrams/data-flow.svg) | [Deployment](diagrams/deployment.svg) | [Security Boundaries](diagrams/security-boundaries.svg)

```
ardyn/
├── apps/cli/src/index.mjs         # CLI entry — 14 commands, path containment
├── apps/console/src/app/          # Next.js web console — 6 views
├── packages/core/src/index.mjs    # Runtime kernel — ~4.2k lines (ajv schema registry + init side effects), 429 exports
│   ├── internal/                  # Shared helpers: utils, review-shared, diagnostic-redaction, paths, redaction
│   ├── review-artifacts.mjs       # Review-artifact & approval-evaluator pipeline (~120 exports)
│   ├── consumer-display.mjs       # Consumer-display maps & conformance artifacts (~40 exports)
│   ├── governance-reports.mjs     # Federation reconciliation, code-mode orchestration, CI/report governance (~40 exports)
│   ├── stdio-framing-redaction.mjs# Stdio framing + stderr redaction contract family
│   └── boundary-maps/             # Infrastructure + contract boundary-map families (auth-permissions, database-storage,
│                                  #   fabric-aware-api-backend, inter-agent-handoff-conformance, production-readiness-coverage)
├── packages/fabric/src/
│   ├── index.mjs                  # Fabric attestation/validation (review-only)
│   └── federation.mjs             # Federation client (hardened; A2A handoff exchange wired behind --enable-federation-exchange --approve)
├── packages/sdk/src/index.mjs     # Consumer SDK
├── crates/ardyn-host/src/
│   ├── lib.rs                     # Rust host — ~6.9k lines, policy contracts, fixture validation
│   └── stdio_runtime/mod.rs       # Stdio runtime skeleton (deliberately blocked)
├── schemas/                       # 5 core JSON Schemas + 104 boundary-map schemas
├── tests/                         # 1484 Node tests across 179 files
├── scripts/                       # Report loader, fixture regenerator
└── docs/                          # Architecture, onboarding, how-it-works, phase docs
```

## Main data flows

### 1. Plan flow (review-only)

```
CLI (plan --manifest X --task Y --summary)
  → loadManifest(X)     # validate JSON manifest against schema
  → loadTask(Y)          # validate JSON task against schema
  → createTaskPlan(manifest, task)  # generate session plan
  → JSON output to stdout
```

No execution, no side effects, no processes spawned.

### 2. Runtime flow (approval-gated)

```
CLI (serve-runtime --enable-runtime --dry-run --manifest X)
  → check --enable-runtime flag    # if missing: fail with "Runtime unavailable"
  → check --approve flag           # if missing and not --dry-run: fail with "approval required"
  → createStaticHandshakeFromPath(X)  # load manifest
  → output runtime plan JSON:
      { sessionId, sessionPlan, redaction, transcriptAudit, failureAudit, killSwitch }
```

Without `--enable-runtime`: CLI rejects with zero stdout and a usage message.
With `--enable-runtime --dry-run`: produces a static plan, no process spawning.
With `--enable-runtime --approve`: spawns the real child process through the
audited/redacted path (kill switch + failure audit), supports multi-step
sequences with automatic rollback-on-failure, and `--replay` re-runs recorded
transcripts deterministically without spawning.

### 3. Federation flow (hardened; exchange gated behind explicit flags)

```
federation.mjs (CLI: federation status/config/send-handoff/receive-handoff)
  → loadFabricFederationConfigFromEnv()
  → validate: loopback-only sidecar, HTTPS remote, closed sibling-DID allowlist
  → redirect: "manual" (no SSRF)
  → response-size cap (16MB)
  → identity-file path confinement (reject ../ traversal)
  → receive-side SHA-256 contentId re-verification
  → Ed25519 signature verification + recursive canonical signing on the A2A handoff exchange
```

The federation client is imported by the CLI only for the `federation`
commands. The handoff exchange is WIRED but denied unless both
`--enable-federation-exchange` and an explicit approval flag are present;
source-guard tests keep the hardening invariants intact.

## Trust boundaries

1. **CLI input** — path containment on all file inputs (`assertLocalFilePath`)
2. **Runtime** — approval-gated (`--enable-runtime` + `--approve`), kill switch, redaction, failure audit, rollback-on-failure compensations
3. **Federation** — loopback-only, redirect:manual, host allowlist, response cap, Ed25519 + canonical signing
4. **Consumer SDK** — schema validation, non-authoritative by default
5. **Secrets** — env vars only, never committed/logged/persisted

## Key design decisions

- **Review-only boundary maps as spec**: the ~200 phases of metadata are the specification, not a cage. Build mode realizes the behavior they describe.
- **reviewedAtDefaulted**: absent/invalid `reviewedAt` input now carries an explicit `defaulted: true` flag rather than silently fabricating provenance.
- **Glob source guards**: source-guard tests scan all `.mjs` files under each directory, not just the barrel re-export, preventing silent bypass during modularization.
- **Modular core, frozen surface**: `packages/core/src/index.mjs` is now the ~4.2k runtime kernel plus re-export shims (429 named exports, snapshot-frozen); extractable families live in real modules (`review-artifacts.mjs`, `consumer-display.mjs`, `governance-reports.mjs`, `stdio-framing-redaction.mjs`, `boundary-maps/*`, `internal/*`). See `docs/plan/autobuild/MODULARIZATION-MAP.md`.
- **109 real JSON Schemas**: boundary-map artifacts now have real JSON Schema validation (shape + safety invariants) instead of nominal string matching.
## Phase contract cross-links

Static phase contracts and their documents (all review-only metadata unless a
section above explicitly says a capability shipped; runtime implementation
approval and stdio ownership remain gated/blocked as documented):

- docs/phase-4-runtime-proposal.md (proposal-only)
- docs/phase-4-1-runtime-proposal.md (proposal-only)
- `docs/phase-4-0d-rust-host-transport-policy-contracts.md`
- `docs/phase-4-0e-rust-host-policy-metadata.md`
- `docs/phase-4-0f-host-policy-review-records.md`
- `docs/phase-4-0g-host-policy-review-comparison.md`
- `docs/phase-4-0h-reviewer-handoff-index.md`
- `docs/phase-4-0i-final-pre-runtime-readiness.md`
- `docs/phase-4-1a-host-policy-approval-records.md`
- `docs/phase-4-1b-transport-harness-contracts.md`
- `docs/phase-4-1c-framing-redaction-contracts.md`
- `docs/phase-4-1d-transcript-replay-contracts.md`
- `docs/phase-4-1e-failure-audit-kill-semantics.md`
- `docs/phase-4-1f-runtime-readiness-checkpoint.md`
- `docs/phase-4-1g-external-review-packet.md`
- `docs/phase-4-1h-external-review-disposition.md`
- `docs/phase-4-1i-rust-host-stdio-harness.md`
- `docs/phase-4-1j-fixture-backed-stdio-boundaries.md`
- `docs/phase-4-1k-stdio-runtime-contract-gates.md`
- `docs/phase-4-1l-runtime-implementation-readiness.md`
- `docs/phase-4-2a-deliberately-blocked-rust-host-stdio-runtime-skeleton.md`
- `docs/phase-4-2b-blocked-lifecycle-failure-audit-skeleton.md`
- `docs/phase-4-2c-runtime-readiness-review-gate.md`
- `docs/phase-4-2d-external-review-disposition-phase5-handoff.md`
- `docs/phase-5-1-controlled-runtime-implementation-approval-handoff.md`
