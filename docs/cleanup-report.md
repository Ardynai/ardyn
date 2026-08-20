# Cleanup Report

**Date:** 2026-08-19
**Scope:** Autobuild branch `hermes/kimi-autobuild`

## Format pass

- **Node.js**: No formatter configured (ESM, no prettier/eslint in root). Code follows consistent 2-space indent, single quotes, trailing commas.
- **Rust**: `cargo fmt --check` passes. `cargo clippy --workspace --all-targets -- -D warnings` passes.

## Lint pass

- **Rust**: clippy clean (0 warnings, 0 errors)
- **Node.js**: No linter configured. Code style is consistent across the monolith.

## Static analysis

- **Source guards**: digest-based (sha256, line-ending-normalized). 11 files tracked.
- **Glob source guards**: `tests/helpers/glob-source-guards.mjs` scans all `.mjs` files under each directory.
- **Dependency allowlist**: npm = ajv (dev only); cargo = serde, serde_json, sha2. Forbidden patterns checked in package-lock.json.
- **JSON Schema validation**: 103 boundary-map schemas enforce shape + safety invariants.

## Dead code

- `crates/ardyn-host/src/stdio_runtime/mod.rs`: deliberately blocked skeleton (by design — runtime not yet implemented in Rust host)
- `packages/core/src/index.mjs`: 73k lines, ~85% generatable. M0.6 extracted 3 utilities; full modularization deferred.

## Dependency audit

- `npm audit`: 1 high vulnerability (fast-uri transitive — in ajv's dependency tree, not Ardyn's direct dep)
- `cargo audit`: not run (cargo-audit not installed in this environment; security.yml CI step installs it)
- No forbidden dependencies detected in lockfiles

## Security review

- ✅ No secrets committed
- ✅ Path containment on all file inputs (CLI)
- ✅ Federation hardening (5/5 requirements applied)
- ✅ Approval gates enforced (serve-runtime)
- ✅ CUA/computer-use stays gated
- ✅ No P2P/DHT/BitTorrent
- ✅ No Secure Drop decrypt

## ponytail: ceilings

- index.mjs 73k lines — full split deferred (incremental pattern demonstrated)
- serve-runtime dry-run only — no actual process spawning
- Console uses static data — no API routes for live data
- npm audit high (fast-uri) — transitive, not fixable without upgrading ajv