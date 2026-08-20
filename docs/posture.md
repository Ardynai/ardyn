# Current Posture

This document is the single canonical statement of ARDYN's current runtime
posture. No other file may contradict it. Per-phase historical records under
`docs/phase-*.md` and `tests/fixtures/**` are immutable evidence; they describe
the posture *at the time that phase was recorded* and are superseded by this
document when they conflict.

## The Posture, Restated

ARDYN is in **build mode**. The runtime is enabled under explicit approval
flags, the federation client is hardened and wired, and the CLI provides
12 working commands including real process spawning, shell execution, and
SQLite queries — all under approval gates.

### What is present (authorized)

- **Runtime core**: `serve-runtime` with `--enable-runtime --approve` spawns
  real child processes, captures JSONL stdout, applies stderr redaction,
  supports kill switch (`--kill-after-ms`), transcript audit, and failure audit.
- **Rust host bridge**: `serve-runtime --rust-session` invokes the Rust host
  `run_session_lifecycle()` binary via subprocess.
- **Shell command**: `shell --enable-runtime --approve --command <cmd>` runs
  shell commands via `spawn('sh', ['-c', cmd])`.
- **SQLite command**: `sqlite --enable-runtime --approve --database <path>
  --query <sql>` executes SQLite queries via `node:sqlite`.
- **Embedded DB**: SQLite with sessions, audit_log, permissions tables.
  Deny-by-default permissions, rate limiting, SQL injection prevention.
- **Fabric Federation consumer client** (`packages/fabric/src/federation.mjs`):
  hardened (5/5 requirements) and wired into CLI via `federation status/config`.
- **SSE streaming**: CLI `--stream` emits SSE events; `--buffer-events` writes
  to file buffer; console `/api/events` reads from buffer.
- **Web console**: Next.js 15 with 6 views, 5 API routes, auth middleware,
  health endpoint, accessible (aria attributes, loading/empty/error states).
- **Consumer SDK**: `@ardyn/sdk` with TypeScript types and accessible React
  display components (SessionTrace, StatusBadge, ManifestViewer, ApprovalGate).
- **Dockerfile**: multi-stage build (Rust + Node + console).
- **Vercel config**: ready for deployment.

### Constraints on the federation consumer client

| Constraint | Value |
|---|---|
| Wired into CLI | true (status/config commands) |
| Wired into Rust host | false |
| Content exchange (send/receive) | not wired (status/config only) |
| Out-of-process | true |
| Sidecar loopback enforced | true |
| Registry requires HTTPS when remote | true |
| redirect:manual (no SSRF) | true |
| Response-size cap (16MB) | true |
| Identity-file path confinement | true |
| Registry host allowlist | true |
| Imports `@multiverse/fabric-core` | false |
| Joins DHT/swarm/P2P | false |
| Reimplements transport | false |
| Decrypts Secure Drop ciphertext | false |
| Adds runtime dependency | false |
| Secrets committed to repo | false |
| Closed sibling-DID allowlist | true |
| Receive-side contentId re-verification | true |
| Authorized by | PR #4 (2026-07-05) + autobuild (2026-08-19) |
| Authorization date | 2026-07-05 (hardening), 2026-08-19 (wiring) |

### Runtime approval gates (enforced in CLI code)

| Gate | Enforced by |
|---|---|
| `--enable-runtime` required | CLI checks flag before any runtime output |
| `--approve` required for execution | CLI checks flag before process spawning |
| `--dry-run` produces plan only | No process spawning, no side effects |
| Kill switch (`--kill-after-ms`) | Auto-SIGTERM after timeout |
| Stderr redaction | Masks token=/secret=/password=/Bearer patterns |
| Transcript audit | Records all stdout/stderr events with timestamps |
| Failure audit | Activates on non-zero exit code |

### What remains blocked

- **Federation content exchange**: `sendFabricFederationContent` and
  `startFabricFederationReceiver` exist in the federation module but are NOT
  wired into the CLI. Only `federation status` and `federation config` work.
  Content exchange requires explicit authorization.
- **CUA/computer-use**: stays gated. Reference-only unless separately authorized.
- **Secure Drop decryption**: never. Ardyn carries ciphertext only.
- **P2P/DHT/BitTorrent/libp2p**: never. Not as dependency or runtime path.
- **`@multiverse/fabric-core` import**: never. Consume, don't rebuild transport.
- **Full index.mjs modularization**: 73k-line monolith. 4 modules extracted
  (utils, data-auth, validation re-export, create-review-helpers re-export).
  Full implementation extraction is incremental.

## Rule for Future Phases

All future phases inherit this posture. The runtime is enabled under explicit
approval gates. The federation client is hardened and wired for status/config
only — content exchange requires separate authorization. No future phase may
re-assert a blanket "review-only" or "runtime-blocked" posture without
accounting for the build-mode state described here.

## History

- Pre-PR #4 (through Phase 5.76): the posture was blanket "review-only,
  runtime-disabled, no fabric transport sidecar." This was true at the time.
- PR #4 (2026-07-05, authorized by Josh): introduced the federation consumer
  client, making "no fabric transport sidecar" false.
- Phase 5.76B: corrected the advertised posture to match reality
  without reopening any other runtime surface.
- Autobuild (2026-08-19, authorized by Josh): transitioned to build mode.
  Runtime enabled with real process spawning, shell/SQLite commands, embedded
  DB, Rust host bridge, SSE streaming, federation wiring (status/config),
  console with API routes + auth, SDK with TypeScript types + display components.