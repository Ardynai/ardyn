# Fabric Glossary

The word "fabric" refers to five distinct concrete things in this repository.
This glossary disambiguates them.

## 1. Legacy Content Fabric v1.0.0 byte-conformance

**Code:** `packages/fabric/src/index.mjs`

The canonical JSON serializer, digest helpers, pack/catalog/keyring
validators, license gates, and path confinement checks that match the Locus
v1 byte behavior. This is the Phase 1.5 conformance foundation. It validates
byte shapes; it does not transport, install, seed, or execute anything.

## 2. Phase 5.59 Fabric coordination envelope

**Doc:** `docs/phase-5-59-fabric-aware-api-backend-contract-boundary-map.md`

A review-only boundary map describing a future API/backend coordination
envelope. It is metadata only — no runtime, no transport, no backend.

## 3. @multiverse/fabric-core transport

**Producer:** Multiverse (`Ardynai/multiverse -> packages/fabric-core`)

The complete, security-reviewed content-addressed transport implementation.
Ardyn is a future consumer of this package. Ardyn does NOT import it.
JS/TS surfaces may consume `@multiverse/fabric-core` only after a dedicated
Multiverse-provided Ardyn consumer prompt, dependency/provenance review, and
runtime authorization. Non-JS surfaces may consume `fabric-transport-d` over
loopback HTTP.

## 4. The content-fabric repo family (Secure Drop owner)

**Owner:** the `content-fabric` repository family within the Ardynai
ecosystem.

Secure Drop (encrypted content delivery) is canonical outside Ardyn and
owned by the content-fabric family. Ardyn never decrypts Secure Drop
ciphertext; the federation consumer client receives ciphertext as bytes and
passes it through without decryption.

## 5. The Fabric Federation consumer client (PR #4)

**Code:** `packages/fabric/src/federation.mjs`

A live, out-of-process Fabric Federation consumer client added by PR #4
(2026-07-05, authorized by Josh). It talks to the `fabric-transport-d`
sidecar over loopback HTTP and the Multiverse registry over authenticated
HTTPS. It does not import `@multiverse/fabric-core`, join a DHT/swarm, open a
public relay, or decrypt Secure Drop ciphertext. It is present but not wired
into the CLI or Rust host. See `docs/posture.md` for the authorized carve-out
and `docs/how-it-works/fabric-connect.md` for the flow.

## Relationship summary

```
1 (byte conformance)  ── validates shapes, no transport
2 (5.59 envelope)      ── review-only metadata, no runtime
3 (fabric-core)        ── produced by Multiverse, NOT imported by Ardyn
4 (content-fabric)     ── owns Secure Drop, outside Ardyn
5 (federation.mjs)     ── Ardyn's consumer client (PR #4), unwired, loopback-only
```