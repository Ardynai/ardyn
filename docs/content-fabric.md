# Content Fabric v1.0.0

ARDYN adopts the Multiverse Content Fabric Canonical Spec v1.0.0 as an ARDYN-family conformance standard.

Canonical source inspected:

- `C:\AI\obsidian-mind\multiverse os platform\MULTIVERSE_CONTENT_FABRIC.md`

Locus reference implementation inspected:

- `C:\AI\locus\electron\content-fabric\manifest.ts`
- `C:\AI\locus\electron\content-fabric\signing.ts`
- `C:\AI\locus\electron\content-fabric\fixtures\cross-impl\v1\`
- `C:\AI\locus\docs\content-fabric.md`

## ARDYN Phase 1.5 Scope

This phase adds a conformance foundation only:

- Canonical JSON serializer matching Locus byte behavior.
- Integer-only JSON lexeme rejection before parsing.
- Signing payload generation with top-level `signatures` set to `[]`.
- SHA-256 digest helpers.
- Pack manifest shape validation.
- Keyring shape validation.
- Catalog shape validation.
- License gate prechecks.
- Path confinement prechecks.
- Locus cross-implementation fixture mirror.
- ARDYN first-party trust root copied exactly from the Locus-shipped `FIRST_PARTY_KEYRING`.
- Minimal Rust host mirror for SHA-256 and path confinement.

This phase does not verify Ed25519 signatures yet. It preserves the signed bytes and trust-root shape needed for that future verifier.

## Explicit Future Work

ARDYN must not do any of the following in Phase 1.5:

- Download packs.
- Install packs.
- Seed packs.
- Enable code packs.
- Execute code packs.
- Start a torrent client.
- Run an HTTP catalog server.
- Run a WebSocket fabric subscription stream.
- Quarantine or sandbox code.
- Auto-register tools, plugins, connectors, MCP servers, agents, or assets.

Runtime Content Fabric work must be a later phase with explicit consent, sandbox, quarantine, signature verification, and policy gates.

## Canonical Serialization

ARDYN matches the Locus v1 serializer:

- Strings use `JSON.stringify`.
- Object keys use default JavaScript `.sort()` ordering.
- Arrays preserve order.
- `null`, booleans, and integers serialize as JSON literals.
- No insignificant whitespace is emitted.
- Numbers must be safe integers in `[0, 2^53-1]`.
- Floats, exponents, plus signs, negative numbers, and leading-zero numeric lexemes are rejected before JSON parsing.
- Unsupported JSON-adjacent runtime values such as `undefined`, functions, symbols, and bigint are rejected. Matching Locus, non-array JavaScript objects are serialized from their enumerable own keys; fabric callers should pass parsed JSON objects rather than class instances.

Signing payloads are `UTF-8(canonicalize({ ...object, signatures: [] }))`. The `signatures` field is not removed; it is set to the empty array.

## Trust Root

ARDYN embeds the first-party keyring exactly as Locus ships it:

- Root key id: `b7305b9b5d1f99f6075554988945cefddcff46279be2c136d34a0fac8e48a009`
- Public key: `5JA0v8x1iWZOfM6E63AsJM7jJgZtOeFDI/1QG/ccU1s=`
- Root threshold: `1`
- Publisher namespace: `ardyn`
- Publisher display name: `Ardynai`

Stored ARDYN copy:

- `packages/fabric/trust/first-party-keyring.json`

No new production keys were created.

## Harness Namespace Note

The current ARDYN Content Fabric family profile is aligned with the canonical Locus implementation and resolves the earlier harness drift. Supported harness values are exactly:

- `*`
- `locus`
- `multiverse`
- `kortex-audio`
- `locus-evolution-lab`
- `somatic`
- `ardyn`

Legacy ARDYN-OS variants are not accepted as current harness ids. The first-party keyring namespace already remains `ardyn`, and ARDYN uses that canonical family name consistently across local Fabric validation.

## Fixtures

ARDYN mirrors the Locus v1 cross-implementation fixture at:

- `packages/fabric/fixtures/locus-cross-impl-v1/`

Conformance tests reproduce the committed Locus `expected-pack-signing-payload.jcs` byte-for-byte and verify the expected SHA-256 digest from `expected-hashes.json`.

Fixture policy is pinned as follows:

- Locus remains the authoritative byte reference for cross-implementation fixtures.
- ARDYN mirrored fixtures must match the committed Locus fixture hashes in `expected-hashes.json`.
- ARDYN must not silently fork canonical byte vectors; fixture byte changes require regeneration from the Locus source fixture flow.

ARDYN also adds local fixtures for:

- Valid data pack.
- Valid code pack shape, without executable runtime behavior.
- Invalid float, exponent, and leading-zero JSON.
- Invalid path traversal.
- Invalid private-license public catalog/seed case.
- Signing payload fixture metadata.

## Remaining Runtime Requirements

Before ARDYN can run a real Content Fabric runtime, it still needs:

- Ed25519 verification.
- Keyring self-signature and rotation verification.
- Publisher-threshold enforcement.
- Payload hash verification after fetch.
- BitTorrent infohash verification.
- HTTP catalog endpoints.
- WebSocket fabric subscription events.
- Code quarantine.
- Explicit user consent.
- Sandbox policy.
- Explicit enable flow for code packs.
- Cross-repo runtime conformance tests against Locus.
