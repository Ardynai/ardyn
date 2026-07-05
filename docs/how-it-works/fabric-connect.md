# How This Works: Fabric Connect

## Owns

`packages/fabric/src/federation.mjs` owns ARDYN's live Multiverse Fabric
federation client. It is intentionally out-of-process: ARDYN talks to the
`fabric-transport-d` sidecar over loopback HTTP and talks to the Multiverse
registry over its authenticated API. It does not import
`@multiverse/fabric-core`, join a DHT, open a swarm, decrypt Secure Drop
ciphertext, or reimplement transport.

## Configuration

Keep the ARDYN DID and any local key material under `config/secret/`; that
directory is gitignored. The client reads configuration from explicit options or
from `loadFabricFederationConfigFromEnv()`:

- `ARDYN_FABRIC_DID` or `FABRIC_TRANSPORT_D_DID`: local DID.
- `ARDYN_FABRIC_SIDECAR_URL`: loopback sidecar URL such as
  `http://127.0.0.1:37877`.
- `ARDYN_FABRIC_SIDECAR_TOKEN` or `FABRIC_TRANSPORT_D_AUTH_TOKEN`: sidecar
  bearer token.
- `ARDYN_FABRIC_REGISTRY_URL`: Multiverse registry URL. Plain HTTP is accepted
  only for loopback; remote registries must use HTTPS.
- `ARDYN_FABRIC_REGISTRY_TOKEN`: registry bearer token.
- `ARDYN_FABRIC_FEDERATION_ALLOWLIST`: comma-separated sibling DID allowlist
  when the registry allowlist route is not exposed.

The default closed sibling set is Multiverse hub, kortex-audio, locus, custos,
somatic, aegis, praxis, ardyn, and kybernetes. Inbound content from any DID
outside the resolved allowlist is rejected before bytes are fetched.

## Send Flow

1. `send(toDid, pathOrBytes, { secure })` verifies `toDid` is allowlisted.
2. The client `PUT`s raw bytes to `fabric-transport-d` at `/v1/content`.
3. The sidecar returns the Fabric CA descriptor and `contentId`.
4. ARDYN recomputes the SHA-256 domain-separated Merkle root over the local
   bytes and descriptor before announcing anything.
5. The client posts an authenticated registry addressing envelope with
   `fromDid`, `toDid`, `contentId`, descriptor, `transport: "fabric-ca"`, and
   `secure`/`encrypted` flags.

## Receive Flow

`startReceiver(handler)` registers ARDYN reachability with
`POST /systems/register`, sends keepalives, and polls the configured inbox path.
For each inbound envelope it requires:

- the envelope is addressed to ARDYN's DID;
- the sender DID is authenticated by registry metadata;
- the sender DID is in the resolved sibling allowlist.

Only after those checks does ARDYN fetch the descriptor and bytes from the
sidecar. It recomputes:

- leaf: `sha256(0x00 || piece)`;
- node: `sha256(0x01 || left || right)`, duplicating the left node for an odd
  final pair;
- the root over descriptor order, where only the last piece may be short.

The handler receives bytes only after the recomputed root matches `contentId`.
Secure Drop payloads remain ciphertext; ARDYN does not decrypt them or expect the
transport to decrypt them.

## Gotchas

- Sidecar URLs must be loopback HTTP. Non-loopback sidecars fail closed.
- Registry requests always use bearer auth; tokens are never logged or included
  in request bodies.
- If the registry allowlist route returns 404/501, the client falls back to the
  configured allowlist. Other registry failures do not fall back.
- This is a client surface, not a package installer, sandbox, pack executor,
  DHT, swarm, or public relay.
