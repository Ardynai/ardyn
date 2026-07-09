# External-Reference Policy

**Phase:** 5.83
**Date:** 2026-07-09
**Status:** review-only, metadata-only, non-authorizing, runtime-blocked
**Canonical source:** This document + `tests/fixtures/host-policy/phase5-83/external-reference-policy.json`

## Purpose

This is the **canonical "do not build here" location** for Ardyn's external-reference policy. Future session handoffs should cite this file instead of restating lore. Every external reference family that Ardyn touches has a machine-checked entry here.

## Harness-vs-Import Distinction

**You are reading this via a Hermes agent.** `hermes_agent` (NousResearch/hermes-agent) is the harness that edits this repo. The policy below blocks **vendoring or importing** `hermes-agent` code into Ardyn packages or apps — it does **not** restrict which harness edits the repository. The distinction is:

- **Harness** (allowed): A Hermes agent may edit, test, and commit to this repo.
- **Import** (blocked): No Ardyn code may `import`/`require` hermes-agent or add `hermes*` as a dependency.

## Reference Families

| Family | Status | Source | Owning Phase |
|---|---|---|---|
| glossopetrae | architecture_reference_only | Phase 5.60 GLOSSOPETRAE | 5.60 |
| hermes_agent | external_canonical_owner | NousResearch/hermes-agent | 5.83 |
| cua_computer_use | taxonomy_reference_only | Phase 5.68 | 5.68 |
| matrix_hiclaw | taxonomy_reference_only | Phase 5.73 | 5.73 |
| codecrafters_shell | taxonomy_reference_only | Phase 5.74 | 5.74 |
| codecrafters_sqlite | taxonomy_reference_only | Phase 5.76 | 5.76 |
| fabric_core_multiverse | future_consumer_pending_contract | Ardynai/multiverse | 5.75 |
| fabric_federation_client | authorized_consumer_surface | packages/fabric/src/federation.mjs (PR #4) | 5.76B |
| secure_drop_content_fabric | taxonomy_reference_only | Phase 5.73 | 5.73 |
| openclaw | advisory_only | OpenClaw | 5.83 |
| goose | advisory_only | Goose | 5.83 |
| onyx | advisory_only | Onyx | 5.83 |
| fainir | advisory_only | Fainir | 5.83 |
| fallow | advisory_only | Fallow | 5.83 |

## Dependency Allowlist

### npm (devDependencies only — no production dependencies)

| Package | Version |
|---|---|
| ajv | ^8.17.1 |

### cargo (crates/ardyn-host/Cargo.toml)

| Package | Version |
|---|---|
| serde | 1 (features: derive) |
| serde_json | 1 |
| sha2 | 0.10 |

## Forbidden Dependency Patterns

No package name matching any of these patterns may appear in `package-lock.json` or `Cargo.lock`:

`libp2p*`, `*bittorrent*`, `*dht*`, `webtorrent`, `torch`, `tensorflow`, `jax`, `transformers`, `matrix-js-sdk`, `@matrix-org/*`, `hermes*`, `cua*`, `goose`, `onyx`, `fainir`, `openclaw*`

## Fabric Federation Client Invariants

The authorized federation client (`packages/fabric/src/federation.mjs`, PR #4, authorized by Phase 5.76B) is subject to machine-checked invariants:

1. **Loopback-enforced**: `isLoopbackFabricFederationUrl` rejects non-loopback sidecar URLs.
2. **Not imported by CLI/host**: No import/require of federation.mjs in `apps/cli/src/` or host code.
3. **No fabric-core import**: No `@multiverse/fabric-core` import anywhere in Ardyn.
4. **No DHT/swarm/P2P**: No libp2p, BitTorrent, DHT, or swarm participation.
5. **No new deps**: Federation client adds no npm/cargo dependencies.
6. **No Secure Drop decrypt**: No crypto decrypt of payload ciphertext.
7. **No committed secrets**: Config/secret paths are gitignored; no hardcoded tokens in source.

## CLI Rejection Probes

The following command families must be refused by the CLI (non-zero exit, empty stdout):

`computer-use`, `hermes`, `matrix`, `shell`, `sqlite`, `secure-drop`, `fabric-transport`

## Negation

This phase does NOT:
- Add, remove, or change any dependency
- Enable any runtime surface
- Change federation behavior
- Edit any prior-phase fixture
- Merge to main

## Recommended Next Phase

`phase-5.84-fabric-federation-prewiring-hardening`