# Onboarding

This guide is for a human contributor starting from a fresh checkout.

## Prerequisites

- Node.js 20 or newer
- npm
- Rust and Cargo for `crates/ardyn-host`
- Git

## Setup

```powershell
cd C:\Users\Josh\Documents\ardyn
npm ci
```

The repo uses npm workspaces from the root `package.json`. It does not use
pnpm or yarn.

## Run The Checks

Start with the fast local checks:

```powershell
npm test
npm run test:schemas
npm run report:phase-status
cargo test -p ardyn-host
cargo check --workspace
cargo fmt --check
git diff --check
```

`npm run report:phase-status` prints deterministic status metadata. It lists
configured checks, but it does not run those checks itself.

For a focused JavaScript test:

```powershell
node --test tests/report-phase-status.test.mjs
```

For the current governance boundary test:

```powershell
node --test tests/phase5-71-maintenance-governance-adr-dependency-policy-contract-boundary-map.test.mjs
```

## Layout

- `apps/cli`: command-line entrypoint.
- `packages/core`: main contract and planning helpers.
- `packages/fabric`: Content Fabric validation and canonicalization.
- `packages/mcp`, `packages/plugin-api`, `packages/adapters/openclaw`: metadata-only adapter scaffolds.
- `packages/sdk`: placeholder SDK package.
- `crates/ardyn-host`: Rust host metadata and blocked runtime skeleton.
- `schemas`: JSON Schema contracts.
- `tests`: Node test files and fixtures.
- `docs`: architecture, phase, policy, and how-it-works docs.
- `scripts`: deterministic report generation.

## Current Safety Boundary

ARDYN is runtime-disabled. Do not add live execution, process spawning, network
listeners, plugin installation, adapter calls, approval grants, database
writes, transcript/audit writers, or CI workflow changes unless a task
explicitly authorizes that behavior.

The recognized `serve-runtime` command remains default-blocked. `--dry-run`
does not bypass that block.

## Safe First Change

1. Pick one narrow area and read its how-it-works page under
   `docs/how-it-works/`.
2. Find the nearest focused test in `tests/`.
3. Make the smallest behavior-preserving change that solves the task.
4. Update the relevant docs when the behavior, contract, phase fixture, or
   reading path changes.
5. Run the focused test first, then the broader checks listed above.

For non-trivial logic, leave one runnable check that fails if the logic breaks.
For docs-only changes, use `git diff --check` and the most relevant report or
schema tests.
