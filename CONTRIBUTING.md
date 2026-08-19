# Contributing

## Local Setup

```powershell
npm ci
```

Use Node.js 20 or newer. The repo uses npm workspaces from the root
`package.json`.

## Checks

Run the checks that match your change:

```powershell
npm test
npm run test:schemas
npm run report:phase-status
cargo test -p ardyn-host
cargo check --workspace
cargo fmt --check
git diff --check
```

For focused work, run the nearest `node --test tests/<name>.test.mjs` first.

## Docs Upkeep

Every feature PR updates the relevant `docs/how-it-works/*.md` page. If the
change adds or changes a phase/contract, also update the relevant
`docs/phase-*.md`, `tests/fixtures/**`, focused `tests/*.test.mjs`,
`scripts/report-phase-status.mjs`, and `tests/report-phase-status.test.mjs`.

New tests should import from `tests/helpers/` and use `assertUnchanged`
(from `tests/helpers/source-digests.mjs`) instead of git-baseline
(commit-hash) source guards. Digest-based guards are sha256-manifest-backed
and do not require a specific commit hash.

Run a full readability pass after roughly every five merged feature batches.
That pass should refresh `docs/architecture.md`, `docs/ONBOARDING.md`, and the
how-it-works pages while keeping behavior unchanged.

Do not claim `npm run report:phase-status` runs checks. It is a deterministic
metadata report that lists verification commands.

## Safety Boundaries

ARDYN is in build mode: `serve-runtime` is enabled under explicit `--enable-runtime`
and `--approve` flags (see `docs/plan/autobuild/SECURITY-INVARIANTS.md`). The
Fabric Federation consumer client is hardened but NOT wired into CLI/host. Do not
add live process spawning, network listeners, plugin installation, adapter calls,
approval grants, database writes, or CI workflow changes unless the task explicitly
asks for that behavior.

The canonical current posture lives in `docs/posture.md` (review-only, with the
runtime enablement carve-out from the autobuild). No other file may contradict it.

Follow `AGENTS.md`: prefer the smallest correct change, reuse existing patterns,
and leave one runnable check for non-trivial logic.

## Bootstrap Standard Assessment

- Minimal-code ruleset committed (AGENTS.md + agent copies)? **yes**
- Docs scaffold present (ARCHITECTURE / how-it-works / ONBOARDING / DECISIONS)? **yes**
- Docs-upkeep + readability-pass cadence recorded in CONTRIBUTING? **yes** (above)
- Areas found too tangled to document well: `packages/core/src/index.mjs` (73k-line monolith — modularization in progress)
- Next recommended readability/docs action: continue modularizing index.mjs; add architecture diagram (docs/diagrams/)
