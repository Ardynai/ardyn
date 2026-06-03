# Review Artifact Attestation Plan

Phase 3.7 introduces review-artifact attestation planning records. These
records describe how future signing could be represented, but they do not
perform production signing, load keys, verify signatures, or trust artifacts at
runtime.

## Planning Record

`buildReviewArtifactAttestationPlan(artifact)` returns
`ardyn.review-artifact-attestation-plan` with:

| Field | Meaning |
| --- | --- |
| `schema` / `schemaVersion` / `version` | Attestation planning schema metadata. |
| `artifact.digest` | Deterministic SHA-256 digest over ARDYN stable JSON display canonicalization. |
| `signer.identity` | Placeholder identity such as `placeholder:unsigned-review-artifact`. |
| `signing.algorithm` | Planning field, currently `ed25519-planned`. |
| `verification.status` | `unsigned`, `planned`, `test_fixture_only`, or `unsupported`. |
| `nonExecuting` | Always `true`. |
| `safety` | All execution, network, plugin, torrent, code-pack, and loop flags remain false. |

The `test_fixture_only` status is for deterministic fixtures only. It must not
be treated as a valid production signature.

## Why Production Signing Is Deferred

Production signing is deferred because ARDYN does not yet have reviewed key
storage, key rotation, trust roots for review artifacts, signer identity policy,
revocation handling, or runtime verification gates. Adding any of those would
be execution-adjacent security work and needs a separate phase.

Phase 3.7 therefore forbids:

- Production signing keys.
- Secret handling.
- Real Ed25519 signatures.
- Signature verification gates.
- Runtime trust decisions.
- Network lookups for signers or certificates.

## Content Fabric Alignment

Content Fabric already has byte-sensitive signing payload and digest rules.
Review-artifact attestation planning must not modify those payloads, reuse
Content Fabric trust roots for a different artifact family, or imply Content
Fabric runtime enablement.

Future review-artifact signing should follow these constraints:

- Keep review-artifact signing payloads separate from Content Fabric pack
  signing payloads.
- Preserve deterministic canonical bytes before signing.
- Record the canonicalization algorithm next to the digest.
- Do not add Content Fabric download, install, enable, seed, or catalog serving
  behavior.
- Treat Content Fabric signing rules as an alignment reference, not as runtime
  authority for review artifacts.

## Locus Display

A future Locus UI may display attestation status as local review metadata:
digest algorithm/value, signer placeholder, planned algorithm, verification
status, and warnings. ARDYN does not connect to Locus, import Locus code, or
depend on Locus to build these records.

## Unknown Fields

Unknown fields in review artifacts remain inert. The attestation plan may digest
their stable JSON display value, but it must not interpret them as signing
instructions, keys, commands, URLs, policies, or runtime behavior.

## Phase 3.7 Boundary

The attestation plan is local JSON metadata only. It must not execute tools,
spawn processes outside tests, open network listeners, call adapters, call MCP
or OpenClaw, install plugins, download torrents, enable code packs, use secrets,
run external CI, or start autonomous loops.
