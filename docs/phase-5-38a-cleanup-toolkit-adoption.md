# Phase 5.38A Language-Aware Cleanup Toolkit Adoption

Phase 5.38A records a behavior-preserving cleanup and hardening toolkit pass
over the current Ardyn codebase. It does not continue the Phase 5 review-only
boundary chain and does not add runtime capability.

## Pass Order

The cleanup pass order is:

1. formatter
2. linter
3. dead-code/static analysis
4. security/dependency audit

## Applied Tools

- Rust formatter: `cargo fmt --check`.
- Rust linter/static compiler checks: `cargo clippy --workspace -- -D warnings`
  and `cargo check --workspace`.
- JS/TS/package tests and schemas: `npm test`, `npm run test:schemas`, and
  `npm run report:phase-status`.
- Fallow static evidence: `fallow health --score --hotspots --targets --format
  json` and `fallow audit --format json`.
- Package security audit: `npm audit --json`.

## Skipped Tools

- JS/TS formatters and linters were not added because this repository has no
  configured Prettier, ESLint, or Biome setup.
- Markdown, JSON, and TOML formatters were not added because no configured
  Markdownlint, Taplo, or equivalent repository formatter is present.
- `cargo-audit` and `cargo-machete` were not run because they were not already
  installed in this environment.
- MegaLinter, Trunk, Semgrep, and Trivy were not run because they are not
  configured for this repository and would require broad external tooling.
- Fallow Runtime was not used.

## Safe Fixes

- Preserved the serialized stdio runtime failure audit category names while
  documenting the Clippy exception in code.
- Replaced an explicit `== false` check with a direct negation.
- Replaced a manual sequence counter in stdio runtime input classification with
  an iterator-backed sequence.

## Deferred Findings

- Public enum variant renames suggested by Clippy were not applied because the
  serialized names are contract-like audit metadata.
- Broad dead-code removal was not attempted. Symbols that are reachable through
  tests, fixtures, docs, public APIs, or phase-status reports require separate
  proof before removal.
- Fallow duplication warnings in the phase-status report/test metadata were not
  refactored in this slice. The repeated false safety flags are intentional
  phase inventory evidence, and extracting them should be a separate report
  structure cleanup with compatibility review.
- No package-audit security remediation was bundled into this cleanup slice.

## Runtime Posture

Phase 5.38A does not add reviewer routing, reviewer assignment, evaluator
execution or results, approval decisions, approval grants, runtime permission,
command exposure permission, process control, filesystem watchers, external
lookups, env/secrets ingestion, adapter/Fabric/WebSocket/HTTP surfaces, or
runtime execution.

`serve-runtime` and `serve-runtime --dry-run` remain default-blocked. `--dry-run`
does not bypass blocking.
