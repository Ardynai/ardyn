# Phase 5.76B - Review-only Fabric Federation reconciliation boundary record

Phase 5.76B is a side phase (precedent: 5.38A, 5.44A) that reconciles the
repo's advertised posture with the Fabric Federation consumer client
introduced by PR #4 (`packages/fabric/src/federation.mjs`). It does NOT
continue the Phase 5 metadata chain and does NOT change the
`recommendedNextPhase` target, which stays `phase-5.77 code-mode`.

## Problem

The report's `executionPosture` string (Phase 5.76) contained the token
`no-fabric-transport-sidecar`. PR #4 made that token false by adding a live,
out-of-process Fabric Federation consumer client. The repo was internally
contradictory.

## What this phase does

- Corrects the current `executionPosture` string to remove
  `no-fabric-transport-sidecar` and blanket `metadata-only`/`review-only`/
  `runtime-disabled` framing, replacing them with tokens that are true.
- Creates `docs/posture.md` as the single canonical current-posture statement
  with the federation carve-out.
- Records the federation consumer client as an ACTIVE consumer surface (not
  "blocked") with test-checkable invariants.
- Amends `docs/content-fabric.md` to remove BitTorrent/P2P items from
  "Remaining Runtime Requirements" and replace them with the fabric-core/
  sidecar supersession note.
- Adds `docs/fabric-glossary.md` distinguishing the now-five concrete fabric
  things.

## What this phase does NOT do

- Does NOT wire federation into the CLI or Rust host (staying unwired is part
  of the authorized posture).
- Does NOT change `packages/fabric/src/federation.mjs` behavior.
- Does NOT edit historical phase fixtures or docs (5.59, 5.75, etc.) —
  supersession is via forward pointer only.
- Does NOT add dependencies.
- Does NOT add a new runtime surface.
- Does NOT change `recommendedNextPhase` (stays `phase-5.77`).
- Does NOT change CLI source or Rust source.

## Federation consumer client invariants (test-checked)

| Invariant | Value |
|---|---|
| `fabricFederationClientPresent` | true |
| `wiredIntoCli` | false |
| `wiredIntoHost` | false |
| `outOfProcess` | true |
| `sidecarLoopbackEnforced` | true |
| `registryRequiresHttpsWhenRemote` | true |
| `importsFabricCore` | false |
| `joinsDhtSwarmP2p` | false |
| `reimplementsTransport` | false |
| `decryptsSecureDropCiphertext` | false |
| `addsRuntimeDependency` | false |
| `secretsCommittedToRepo` | false |
| `closedSiblingDidAllowlist` | true |
| `receiveSideContentIdReverified` | true |
| `authorizedBy` | "PR#4" |
| `authorizationDate` | "2026-07-05" |

## Cross-references (forward supersession pointers)

- Phase 5.59 `fabricRuntimeImplementedByArdyn: false` framing: clarified —
  Ardyn implements a CLIENT, not the transport.
- Phase 5.75 `producer_ready_consumer_pending` status: now
  `consumer-client-present-unwired`.
- `docs/content-fabric.md`: amended to remove P2P/torrent from remaining
  requirements.
- `docs/posture.md`: the canonical current posture statement.
- `docs/fabric-glossary.md`: the five fabric things.