# Current Posture

This document is the single canonical statement of ARDYN's current runtime
posture. No other file may contradict it. Per-phase historical records under
`docs/phase-*.md` and `tests/fixtures/**` are immutable evidence; they describe
the posture *at the time that phase was recorded* and are superseded by this
document when they conflict.

## The Posture, Restated

ARDYN is review-only and runtime-blocked for every execution surface **except**
the authorized Fabric Federation consumer client introduced by PR #4
(`packages/fabric/src/federation.mjs`).

### What is present (authorized)

- A live, out-of-process Fabric Federation consumer client
  (`packages/fabric/src/federation.mjs`).

### Constraints on the federation consumer client

| Constraint | Value |
|---|---|
| Wired into CLI | false |
| Wired into Rust host | false |
| Out-of-process | true |
| Sidecar loopback enforced | true |
| Registry requires HTTPS when remote | true |
| Imports `@multiverse/fabric-core` | false |
| Joins DHT/swarm/P2P | false |
| Reimplements transport | false |
| Decrypts Secure Drop ciphertext | false |
| Adds runtime dependency | false |
| Secrets committed to repo | false |
| Closed sibling-DID allowlist | true |
| Receive-side contentId re-verification | true |
| Authorized by | PR #4 |
| Authorization date | 2026-07-05 |

### What remains blocked

Every other runtime surface is blocked until an explicit authorization phase:

- `serve-runtime` (with and without `--dry-run`) is refused.
- Evaluator, approvals, process control, stdio loops, DB, SQLite, shell,
  Matrix, CUA, Secure Drop decryption, fabric-core import, P2P/DHT/swarm,
  and Code Mode are all blocked.
- `reportRunsChecks` is false and honest.
- All authorization/unsafe flags are false in every fixture and helper that
  does not explicitly describe the federation carve-out.

## Rule for Future Phases

All future phases inherit this carve-out. No future phase may re-assert a
blanket "no fabric transport sidecar" or "metadata-only" posture without
accounting for the authorized federation consumer client. When a phase needs
to describe the global posture, it must reference this document or repeat the
carved-out framing, not the pre-5.76B blanket.

## History

- Pre-PR #4 (through Phase 5.76): the posture was blanket "review-only,
  runtime-disabled, no fabric transport sidecar." This was true at the time.
- PR #4 (2026-07-05, authorized by Josh): introduced the federation consumer
  client, making "no fabric transport sidecar" false.
- Phase 5.76B (this phase): corrects the advertised posture to match reality
  without reopening any other runtime surface.