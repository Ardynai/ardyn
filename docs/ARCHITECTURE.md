# Architecture

## Repo map

Ardyn is a monorepo with Node.js (CLI, core, fabric, SDK, console) and Rust (host scaffold) workspaces.

```
ardyn/
├── apps/cli/src/index.mjs         # CLI entry — 10 commands, path containment
├── apps/console/src/app/          # Next.js web console — 6 views
├── packages/core/src/index.mjs    # Core library — 73k lines, 422 exports, 1920 functions
│   └── internal/utils.mjs         # Extracted shared utilities (M0.6)
├── packages/fabric/src/
│   ├── index.mjs                  # Fabric attestation/validation (review-only)
│   └── federation.mjs             # Federation client (hardened, NOT wired)
├── packages/sdk/src/index.mjs     # Consumer SDK
├── crates/ardyn-host/src/
│   ├── lib.rs                     # Rust host — 293k lines, policy contracts, fixture validation
│   └── stdio_runtime/mod.rs       # Stdio runtime skeleton (deliberately blocked)
├── schemas/                       # 5 core JSON Schemas + 103 boundary-map schemas
├── tests/                         # 1236 Node tests
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
With `--enable-runtime --approve`: would execute (not yet implemented — process spawning is planned).

### 3. Federation flow (hardened, NOT wired)

```
federation.mjs (NOT imported by CLI or host)
  → loadFabricFederationConfigFromEnv()
  → validate: loopback-only sidecar, HTTPS remote, closed sibling-DID allowlist
  → redirect: "manual" (no SSRF)
  → response-size cap (16MB)
  → identity-file path confinement (reject ../ traversal)
  → receive-side SHA-256 contentId re-verification
```

The federation client is present in `packages/fabric/src/federation.mjs` but is NOT imported by the CLI or Rust host. Source-guard tests verify this invariant.

## Trust boundaries

1. **CLI input** — path containment on all file inputs (`assertLocalFilePath`)
2. **Runtime** — approval-gated (`--enable-runtime` + `--approve`), kill switch, redaction
3. **Federation** — loopback-only, redirect:manual, host allowlist, response cap
4. **Consumer SDK** — schema validation, non-authoritative by default
5. **Secrets** — env vars only, never committed/logged/persisted

## Key design decisions

- **Review-only boundary maps as spec**: the ~200 phases of metadata are the specification, not a cage. Build mode realizes the behavior they describe.
- **reviewedAtDefaulted**: absent/invalid `reviewedAt` input now carries an explicit `defaulted: true` flag rather than silently fabricating provenance.
- **Glob source guards**: source-guard tests scan all `.mjs` files under each directory, not just the barrel re-export, preventing silent bypass during modularization.
- **103 real JSON Schemas**: boundary-map artifacts now have real JSON Schema validation (shape + safety invariants) instead of nominal string matching.