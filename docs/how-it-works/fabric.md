# How This Works: Content Fabric

## Owns

`packages/fabric` owns Content Fabric conformance helpers: canonical JSON,
signing payloads, digests, pack and catalog validation, keyring shape checks,
license policy, path confinement, and the out-of-process Multiverse Fabric
federation client.

It does not install, seed, sandbox, execute packs, import private Multiverse
code, join a DHT, or open a public swarm. Live federation uses the
`fabric-transport-d` sidecar and registry over authenticated process boundaries.

## Key Files

- `packages/fabric/src/index.mjs`: implementation.
- `packages/fabric/src/federation.mjs`: loopback sidecar and registry
  federation client.
- `packages/fabric/src/index.d.ts`: public declarations.
- `packages/fabric/fixtures/**`: valid and invalid pack/catalog/keyring
  fixtures.
- `packages/fabric/trust/first-party-keyring.json`: committed first-party trust
  data.
- `tests/fabric.test.mjs`: test coverage.

## Main Flow

1. `parseFabricJson()` rejects non-canonical number forms before JSON parsing.
2. `canonicalize()` serializes JSON values with sorted object keys.
3. Digest helpers hash canonical payloads.
4. Validators collect deterministic error strings for packs, catalogs, and
   keyrings.
5. License and path helpers classify whether a pack can be cataloged,
   installed, published, or seeded.
6. The federation client registers ARDYN reachability, sends content through the
   sidecar, polls inbound registry envelopes, and re-verifies content IDs before
   local handling.

## Gotchas

- Fabric JSON accepts only safe non-negative integers, not floats, exponents,
  negative numbers, or leading-zero numbers.
- Paths must be confined POSIX-relative paths.
- License policy separates public catalog/seed posture from private install
  posture.
- Key ids are derived from raw Ed25519 public keys.
- Federation receives ciphertext as bytes. Secure Drop decryption is not part of
  this package.
- See `docs/how-it-works/fabric-connect.md` for the live federation flow.

## Start Reading

Start at `validatePackManifest()` for pack shape, `validateCatalog()` for
catalog shape, and `canonicalize()` for cross-implementation hashing behavior.
