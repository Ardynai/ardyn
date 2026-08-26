# Federation Sibling Onboarding — interop requirements for closed-sibling harnesses

Status: **Ardyn-side readiness.** This document defines exactly what a sibling
harness (hub, kortex-audio, locus, custos, somatic, aegis, praxis, kybernetes)
must implement to exchange agent-to-agent handoffs with Ardyn over the Fabric
federation. End-to-end A2A is live only after a sibling adopts this contract.

## 1. Who you are on the network

- Your identity is a DID: `did:multiverse:<name>` where `<name>` is one of the
  closed sibling names registered in `FABRIC_FEDERATION_CLOSED_SIBLING_DIDS`.
  Anything outside this closed set is rejected — send and receive.
- Ardyn's own DID defaults to `did:multiverse:ardyn`.

## 2. Surfaces you must reach

| Surface | Requirement |
|---|---|
| **Loopback sidecar** (Fabric CA content API) | `http://127.0.0.1:<port>` only — never a non-loopback host. Endpoints used by both sides: `PUT /v1/content` (returns `{contentId, descriptor}`), `GET /v1/content/{id}`, `GET /v1/content/{id}/descriptor`. Bearer auth via sidecar token. |
| **Registry** (message relay + allowlist) | HTTPS for any non-loopback registry (loopback HTTP tolerated in dev). Paths: `/fabric/federation/send`, `/fabric/federation/inbox?did=...`, `/fabric/federation/inbox/{id}/received`, `/fabric/federation/allowlist`, `/systems/register` (keepalive/register). Bearer auth via registry token. |

## 3. Keys and registration

- Each sibling generates an **Ed25519** keypair. Register:
  - your **public key** (SPKI DER, base64) under your DID in the shared
    sibling-keys map — distributed to every peer via env
    `ARDYN_FABRIC_SIBLING_KEYS` (`{"<did>": "<spki-base64>", ...}`) or the
    gitignored `config/secret/federation-keys.json` file with the same shape;
  - keep your **private key** local (PKCS8 PEM/DER). Ardyn loads its own from
    `ARDYN_FABRIC_SIGNING_KEY_FILE` or `"<did>.private"` inside
    `config/secret/federation-keys.json`. Private keys are NEVER shared,
    logged, or committed.

## 4. Envelope wire format (what actually crosses the registry)

The content bytes uploaded to the sidecar are a JSON envelope:

```json
{
  "type": "ardyn_handoff",
  "v": 1,
  "codec": "GL1",
  "encoded": "GL1:<sha256-16hex>:<token-token-...>",
  "fromDid": "did:multiverse:<you>",
  "toDid": "did:multiverse:<recipient>",
  "authenticated": true,
  "authenticatedDid": "did:multiverse:<you>",
  "signature": "<base64 Ed25519 over canonicalSignedPayload(envelope)>",
  "signatureDid": "did:multiverse:<you>"
}
```

- `canonicalSignedPayload(envelope)` = recursive canonical JSON of the envelope
  minus `signature`/`signatureDid`: serialize with **object keys sorted at
  EVERY depth** (arrays keep element order; `undefined` fields dropped), no
  whitespace. Reference implementation: `canonicalJson` /
  `canonicalSignedPayload` in `packages/fabric/src/federation.mjs`
  (byte-identical twin in `handoff.mjs`, pinned by tests). Reproduce this
  EXACTLY — verification recomputes it byte-for-byte. (Historical note: an
  earlier top-level-keys-only `JSON.stringify(rest, sortedKeys)` form left
  nested fields unsigned and will FAIL every handshake that carries any
  nested object — do not implement it.)
- The signature must verify with node:crypto `verify(null, payload, publicKey, sig)`
  (Ed25519, no digest). Receivers run the existing `isInboundAuthenticated()`
  invariant — field presence is not enough; crypto must actually pass.

## 5. GLOSSOPETRAE codec (auditable)

`encoded` carries the payload through an auditable dictionary-substitution
codec (Ardyn implementation: `packages/core/src/glossopetrae-codec.mjs`;
reference pattern per `docs/phase-5-60-*`, NOT the elder-plinius project):

- Form: `GL1:<checksum16hex>:<hyphen-separated lowercase tokens>`.
- Deterministic and injective; canonical JSON (sorted keys) is the ONLY input form.
- Decoders reject: unknown tokens, checksum mismatches, non-canonical
  re-encodes (key-order/format smuggling), and zero-width/bidi/control
  characters anywhere in decoded strings (covert-channel attempts).
- A sibling encoder MUST be equally strict. If you cannot re-encode your
  decoded payload to byte-identical output, you are not interoperable.

Invariants (non-negotiable, from SECURITY-INVARIANTS.md): the codec stays
auditable — no steganography, no covert channels, no tokenizer exploits, no
bypass paths.

## 6. Hardening checklist (receivers enforce ALL of it)

- Real Ed25519 signature verification gating receive (no shortcuts).
- Closed sibling-DID allowlist on send AND receive; unknown/non-sibling DIDs rejected.
- Loopback-only sidecar URL; HTTPS-only remote registry; registry host allowlist when configured.
- `redirect: "manual"` everywhere — redirects are errors, never followed.
- Identity-file confinement (relative path inside the allowed base dir; symlink/traversal rejected).
- Receive-side contentId re-verification (Merkle over streamed bytes).
- Response-size cap counting STREAMED bytes (content-length headers lie).
- Audit every message; redact secrets from logs/errors. Tokens live in env /
  gitignored `config/secret/` only — never committed, printed, or placed in URLs.
- No Secure Drop decryption — ciphertext is carried, never opened.
- Exchange runs gated: default OFF; explicit operator approval required before
  anything sends or receives (Ardyn CLI: `--enable-federation-exchange --approve`).

## 7. Interop smoke test

1. Both sides register keys + reach the same registry/sidecar pair.
2. Sibling → Ardyn: send an envelope per §4; expect delivery marked received.
3. Ardyn → Sibling: `ardyn federation send-handoff --to did:multiverse:<you>
   --enable-federation-exchange --approve --payload handoff.json`; expect your
   inbox entry whose content decodes canonically and verifies.
4. Negative probes: wrong signer, stranger DID, oversized body, non-canonical
   encoding — all must be REJECTED on your side exactly as on ours.
