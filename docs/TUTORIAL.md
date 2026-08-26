# ARDYN — Comprehensive Tutorial & Connection Audit

*Generated 2026-08-25 on branch `review/tutorial-2026-08-20` (main @ `822d066`). Companion review: [`../REPO-REVIEW-2026-08-20b.md`](../REPO-REVIEW-2026-08-20b.md).*

Every component below has a card with: **what it is / what it does**, **how to use it**, **VALUE grade**, **USE-CASE grade** (A–F, one-line justification each), a **RECOMMENDATION**, **last-touched date** (git), and **maturity** (`stable` / `partial` / `stub`).

---

## 1. System overview

ARDYN is a **contract-first agent harness**: an approval-gated runtime for executing agent actions (shell commands, SQL, Docker sandboxes) with mandatory consent flags, secret redaction, audit trails, replay/rollback semantics — plus a hardened client for an experimental inter-agent "fabric" federation (signed A2A handoffs between sibling harnesses).

```
                       ┌──────────────────────────────┐
   you ──flags──▶      │  apps/cli (14 commands)       │
                       │    │ @ardyn/core (kernel +    │
                       │    │  extracted modules)      │
                       │    ├── packages/fabric  ◀──▶  Multiverse registry + loopback sidecar
                       │    ├── packages/gateway ◀──▶ Telegram / Slack / HiClaw-Matrix (scaffolds)
                       │    ├── packages/core/…      SQLite stores (users/memory/loop-state)
                       │    └── crates/ardyn-host     Rust validation layer (runtime BLOCKED by design)
                       └──────────────────────────────┘
   browser ──▶ apps/console (Next.js 15): dashboard, federation, runtime,
               trace, fixtures, onboarding + 8 API routes (SSE live events)
```

Three trust tiers (from `docs/posture.md`, `SECURITY.md`):

1. **Always available, never executes anything:** manifest/task planning, review artifacts, transcript validation, doctor/identity.
2. **Executes only behind explicit consent:** every executing surface requires `--enable-*` **and** `--approve`; `--dry-run` plans without side effects. Writes go through path-containment checks; all captured output passes the canonical secret redactor; kill switches and audits are mandatory.
3. **Deliberately blocked:** the Rust stdio runtime skeleton returns "blocked" plans by construction (a source-guard test bans ~50 live-I/O patterns); Secure Drop decryption, P2P/DHT/BitTorrent, and `matrix-js-sdk` are banned outright.

Key invariants enforced by tests: root stays ajv-only; public export surface of `@ardyn/core` frozen at exactly 429 named exports (`tests/export-surface.test.mjs`); no forbidden dependencies (libp2p/bittorrent/torch/matrix-js-sdk/etc.); secrets only via env or gitignored `config/secret/`.

## 2. Get running in 5 minutes

Prereqs: **Node ≥ 22** (README badge; engines says ≥20 but `node:sqlite` needs 22.5+), optional Rust stable toolchain, optional Docker.

```bash
# 1. Install (npm workspaces; root stays ajv-only)
npm ci

# 2. Verify everything
node --test "tests/*.test.mjs"        # 1496 tests
cargo build --workspace               # optional: builds target/debug/session

# 3. First steps — read-only, zero risk
node apps/cli/src/index.mjs doctor --manifest examples/minimal-manifest/ardyn.manifest.json
node apps/cli/src/index.mjs identity
node apps/cli/src/index.mjs plan --manifest examples/minimal-manifest/ardyn.manifest.json \
     --task examples/minimal-task/task.json --summary

# 4. Execute something for real (gated)
node apps/cli/src/index.mjs serve-runtime --enable-runtime --approve \
     --manifest examples/minimal-manifest/ardyn.manifest.json --command "echo hello"

# 5. Console (dev mode is auth-open; production fails closed without a key)
cd apps/console && npx next dev        # http://localhost:3000

# 6. Live events: run in one terminal…
node apps/cli/src/index.mjs serve-runtime --enable-runtime --approve \
     --manifest examples/minimal-manifest/ardyn.manifest.json \
     --command "echo hi" --buffer-events
# …and watch the dashboard EventsFeed go LIVE.
```

Works out of the box: all read-only commands, dry-runs, gated execution once flags are passed, console dev mode.
Needs env vars: federation exchange, console production auth, provider/embedding keys (see §7).
Deliberately blocked without separate approval: Rust stdio runtime, Secure Drop decrypt, P2P transports, Vercel deploy (needs interactive `vercel login`).

---

## 3. Component reference

### 3.1 CLI — `apps/cli/src/index.mjs` · stable-ish · 2026-08-24

Hand-rolled arg parser (no framework), JSON on stdout, errors on stderr with exit 1. Every executing command follows the same gate pattern: `--enable-<x>` ∧ (`--approve` ∨ `--dry-run`).

**VALUE: B+** — narrow, honest, uniformly gated; loses points for hand-rolled parsing and the (now-fixed) cwd-import fragility.
**USE-CASE: A−** — the primary way humans drive everything; works with zero setup.
**RECOMMENDATION: keep.** Consider a real arg parser when the flag count grows further.

#### Command cards (14)

| # | Command | What it does | Flags that matter | Gate | Maturity |
|---|---|---|---|---|---|
| 1 | `doctor` | Readiness report (status/phase/platform, all safety flags false) | — | none | stable |
| 2 | `identity` | Static identity card (`name:"ardyn"` + false capability flags) | — | none | stable |
| 3 | `capabilities` | Introspect manifest capabilities into a static handshake | `--manifest` (req) | none | stable |
| 4 | `plan` | Task→capability planning; can emit an approval-review artifact | `--manifest --task` req; output modes mutually exclusive `--trace\|--summary\|--explain\|--review-artifact`; `--output` only with `--review-artifact`, containment-guarded | non-executing | stable |
| 5 | `review-trace` | Diff two review artifacts | `--left --right` req; `--summary\|--explain` | read-only | stable |
| 6 | `review-artifact` | Inspect artifact version/compat/safety/attestation | `--file` req; one of `--summary\|--explain\|--schema-status\|--attestation-plan` | read-only | stable |
| 7 | `validate-session-transcript` | Validate/classify/explain transcripts | `--file` req; 5 modes | read-only | stable |
| 8 | `emit-session-events` | Deterministic JSONL event emitter | `--dry-run` **mandatory** | dry-run-only | stable |
| 9 | `serve-runtime` | THE runtime: spawn single commands, Rust bridge, `--steps` sequences with auto-rollback, `--replay` divergence reports, SSE `--stream`, `--buffer-events` | `--enable-runtime` req; `--approve` for live; `--kill-after-ms`; `--rust-session` → `target/debug/session` | enable+approve | stable |
| 10 | `computer-use` | Start governed Docker sandbox (Xvfb image config) | `--enable-computer-use` + `--approve`; `--dry-run` prints plan | enable+approve | partial |
| 11 | `federation` | Fabric status/config + gated A2A exchange | subcommands `status\|config\|send-handoff\|receive-handoff`; exchange needs `--enable-federation-exchange --approve` + env creds | env fail-closed | partial |
| 12 | `shell` | Run a shell command under the gate | `--enable-runtime`, `--command` req | enable+approve | partial (POSIX `sh` only) |
| 13 | `sqlite` | Execute SQL via node:sqlite (sqlite3 CLI fallback) | `--enable-runtime`, `--query` req, `--database` opt | enable+approve | partial (single-statement ceiling) |
| 14 | `serve` | Legacy Phase-3 planner handshake | `--dry-run` mandatory | dry-run-only | stable |

(README says both "13" and "14" commands — 14 is correct.)

#### `serve-runtime` deep dive (the flagship)

```bash
# single real command, killed after 5 s, SSE frames streamed
serve-runtime --enable-runtime --approve --manifest m.json \
  --command "node -e \"console.log(JSON.stringify({ok:1}))\"" \
  --kill-after-ms 5000 --stream

# multi-step sequence with AUTO-ROLLBACK on failure
serve-runtime --enable-runtime --approve --manifest m.json --steps steps.json
# steps.json: [{ "label":"create", "command":"node -e \"require('fs').writeFileSync('x','1')\"",
#               "compensateCommand":"node -e \"require('fs').unlinkSync('x')\"" }, ...]

# deterministic dry replay of a recorded transcript with divergence report
serve-runtime --enable-runtime --approve --manifest m.json --replay transcript.json

# feed the console live view
serve-runtime ... --buffer-events   # appends redacted JSONL to .ardyn-events/events.jsonl
```

Behavior: stdout parsed as JSONL frames (max 8), all output redacted, transcript + failure audit emitted, exit code reflects failure; rollback unwinds completed steps' compensations in reverse and fails CLOSED (`partialState:true`, loud `rollback_failed` audit) if any compensation is missing or errors. `--steps`/`--replay` refuse `--dry-run` (fixed 2026-08-25; previously `--dry-run` bypassed approval on the steps path — see review F1).

---

### 3.2 Core runtime — `packages/core/src/index.mjs` ("kernel") · stable · 2026-08-24

**What:** 4,182 measured lines (4,912 physical). Ajv instance + schema registrations at module load, manifest/task/transcript/session-event validation, local-path policy, capability resolution + approval decisions, task planner, stdio dry-run event factory, review-artifact contract factories, host info/static identity/handshake/doctor, plus re-export shims to the extracted modules.
**How to use:** import from `@ardyn/core` (33 symbols consumed by the CLI), or exercise via `doctor/capabilities/plan`.
**VALUE: A−** — the genuine core; a third is review-paperwork generators.
**USE-CASE: B+** — everything flows through it, but direct consumers are limited to the CLI + SDK.
**RECOMMENDATION: keep.**

### 3.3 Extracted core modules (the modularization result)

All verbatim moves with re-export shims; dependency DAG strictly points downward (modules → internal/*, never back into the kernel). Surface frozen at 429 exports.

| Module | Lines | What it is | VALUE / USE-CASE | Recommendation | Touched | Maturity |
|---|---|---|---|---|---|---|
| `session-replay.mjs` | 202 | Replay w/ SHA-256 divergence detection + fail-closed rollback machinery; inert without `approved:true` | **A− / B+** — small, correct, honestly audited. Not exported from @ardyn/core (direct-file import only) | keep | 08-24 | stable |
| `internal/redaction.mjs` | 30 | THE canonical secret redactor (key=value + key:value + JSON-aware + Bearer/sk-/ghp_) | **B+ / B** — single choke point; now covers colon forms (fixed 08-25) | keep | 08-25 | stable |
| `internal/paths.mjs` | 19 | Write-containment guard (drive/UNC/traversal/file:) | **A / A** — tiny and load-bearing | keep | 08-23 | stable |
| `internal/review-shared.mjs` | 1,245 | Shared helpers for the paperwork family (canonical JSON sort, field constants) | **B / n/a** | keep; prune dead kernel imports | 08-24 | stable |
| `internal/diagnostic-redaction.mjs` | 198 | Tracked stderr scrubber, fail-closed classification | **B+ / B** — stronger patterns than canonical in places; reconcile | keep | 08-23 | stable |
| `stdio-framing-redaction.mjs` | 230 | Framing/redaction contract metadata + validators | **C+ / C** — inert documentation-as-code | keep low priority | 08-24 | stable |
| `governance-reports.mjs` | 3,722 | Deterministic builders for governance boundary maps | **C / D** — feeds only its own tests/report script | reconsider (serialize to JSON) | 08-23 | stable |
| `consumer-display.mjs` | 10,465 | Display-accessibility contract maps, fixture conformance handoffs | **D / D** — spec-theater about components that don't render yet | reconsider | 08-23 | stable |
| `review-artifacts.mjs` | 24,817 | 120 review-only artifact factories (prereq readers/preflights/checkpoints) | **D runtime / C as audit trail / D** | reconsider long-term; frozen meanwhile | 08-24 | stable |
| `boundary-maps/*.mjs` (6 files) | 27,990 | Static contract maps: infrastructure (**20,937** alone), auth-permissions, database-storage, fabric-aware-backend, inter-agent-handoff, prod-readiness | **D / D** — 800 KB of data dressed as JS, zero runtime consumers | reconsider (JSON under schemas/) | 08-24 | stable |

**Modularization overall (PRs #26–#28): REAL.** 68,913 → 4,182 measured lines (−93.9%); extraction commits diff as verbatim moves (+2 import lines); zero duplicated definitions; clean DAG. Caveats: "4,182" is the *non-blank* count (4,912 physical), and `runWithRollback`/`replayTranscript` are NOT part of the 429-export surface — consumers import the file directly.

### 3.4 Data & state modules (all real SQLite via `node:sqlite`)

| Card | Notes |
|---|---|
| **multi-user.mjs** · stable · 08-21 · 135 ln | Users/RBAC/per-user sessions/per-user CU sandboxes; deny-by-default permissions; owner-scoped SQL isolation proven cross-user (m10). Password hashing is the caller's job. **VALUE B+ / USE-CASE B+ — keep.** Library-level only (no CLI/console registration flow yet; `/api/login` is an inert stub). |
| **user-memory.mjs** · stable · 08-22 · 178 ln | Per-user key-value memories + profiles; RAG recall = SQL user prefilter → in-process cosine top-k over stored embeddings (BYO embedFn); embedding failure stores nothing (fail-closed). FTS5 table created but never wired (dead schema). O(n)-per-user recall documented ceiling. **VALUE B+ / USE-CASE B+ — keep; drop-or-wire FTS.** |
| **loop-state.mjs** · stable · 08-21 · 157 ln | Goals/todos with atomic claim, gates, atomic quota spend, append-only run history, public/private boundary sniff. Cross-instance safe (BEGIN IMMEDIATE). Boundary regex drifted from canonical redactor. **VALUE B+ / USE-CASE B — keep.** Library control plane; not wired to any default storage location. |
| **data-auth.mjs** · partial · 08-22 · 232 ln | Sessions/audit/permissions store, deny-by-default `checkPermission`, rate limiters, env-only secrets, query sanitizer, delegates redaction. Quirks: embedded node:test tests execute on import; `sqlite` CLI doesn't route through its sanitizer; m3 test file vendors a stale copy instead of testing this module. **VALUE B / USE-CASE B — improve.** |

### 3.5 Processor pipeline — `processor-pipeline.mjs` · stable · 08-22 · 198 ln

Pluggable pre/post chains around actions: sticky deny, broken/missing processor ⇒ deny, transform patches, record-before-act invariant; built-ins: policy-gate, redact-result, audit-record. Post-chain failure suppresses captured output entirely. Best-engineered small module in the repo (16 focused tests).
**VALUE: A− / USE-CASE: A− — keep.**

### 3.6 Computer-use sandbox — `computer-use.mjs` · partial · 08-22 · 436 ln

**What:** Governance model for a Docker GUI sandbox: pinned `ubuntu:22.04` with `--no-new-privileges --cap-drop ALL --read-only --memory 512m --cpus 1.0 --network none` (gVisor via `COMPUTER_RUNTIME=runsc`), per-session random token injected as env, actions (screenshot/click/type/key/scroll/drag/wait) routed through the fail-closed processor pipeline into `docker exec` xdotool/ImageMagick calls, take-the-wheel human override, crash-proof `docker kill/rm` teardown.
**How to use:** `computer-use --enable-computer-use [--dry-run] --manifest m.json` — dry-run prints the sandbox plan; live start() reports true spawned/spawnError/containerId.
**Honest caveats:** stock ubuntu lacks Xvfb/xdotool/ImageMagick so the action loop cannot succeed as shipped (no capable image exists in-repo); containerId resolves before docker run finishes (always the fallback name); CLI starts containers it never stops.
**VALUE: B** (architecture genuinely good) **/ USE-CASE: C+** (not usable end-to-end).
**RECOMMENDATION: improve** — ship a sandbox Dockerfile + argv-safe action params + lifecycle closure; until then treat as governance scaffold.

### 3.7 Gateway — `packages/gateway/src/` · partial (unwired scaffolds) · 08-23

**Core (`gateway.mjs`):** deny-by-default admission (allowlist seeding or `registerUser()` only; unknown ⇒ `unknown_sender`), per-channel HMAC webhook verification, windowed rate limiter ({count,resetAt}, injectable DB limiter cross-instance), Prometheus counters with platform labels minted ONLY for configured adapters.
**Telegram adapter:** parses update.message/callback_query; verification computes HMAC(botToken, body) — *not* Telegram's real header scheme; no outbound send exists anywhere.
**Slack adapter:** `v0:` HMAC + 5-minute replay window (stale AND future rejected) checked before signature; safeCompare denies non-strings. No outbound delivery either.
Nothing binds these to network listeners today — they are honest unit-tested scaffolds.
**VALUE: B− / USE-CASE: C** (no production channel traffic possible yet).
**RECOMMENDATION: improve** — implement Telegram's header scheme + wire delivery, or relabel clearly as contract scaffolds.

### 3.8 HiClaw Matrix adapter — `packages/gateway/src/hiclaw-matrix.mjs` · stable (narrow) · 08-23 · ~230 ln

**What:** Raw-fetch Matrix client (NO matrix-jsdk — enforced by a dependency-scan test): PUT send message with txnId, long-poll `/sync`; outbound deny-by-default (target rooms must exist in configured registry); token resolved env-first (`ARDYN_HICLAW_MATRIX_TOKEN`) with gitignored `config/secret/hiclaw.json` fallback, throws naming the var BEFORE any request; inbound rejects foreign_room/self_echo/unknown_sender/malformed; NO E2EE (encrypted events skipped by design, authorized carve-out in SECURITY-INVARIANTS).
**How to use (library):**
```js
import { createHiClawMatrixAdapter } from "packages/gateway/src/hiclaw-matrix.mjs";
const a = createHiClawMatrixAdapter({ baseUrl: "https://matrix.example.org", rooms: { "!foo:example.org": { alias: "#foo" } } });
await a.sendMessage("!foo:example.org", "hello");   // refused if room not in registry
```
**VALUE: B+ / USE-CASE: B−** — well-hardened and dependency-free; needs an operator-supplied homeserver and wiring to matter.
**RECOMMENDATION: keep.**

### 3.9 Federation A2A + GLOSSOPETRAE — `packages/fabric/src/`

**Federation client (`federation.mjs`, ~1,200 ln) · stable · 08-23.** Closed sibling DID allowlist (default 9, operator-overridable via env), Ed25519 envelope signatures verified against registered sibling keys (node:crypto only), recursive canonical signing, Merkle contentId re-verification over streamed bytes, SSRF hardening (redirect:manual + explicit 3xx rejection, loopback-only sidecar, HTTPS-or-loopback remote, streamed-byte size cap counting actual chunks), self-healing poll receiver (errors surfaced, reschedule in finally), per-envelope DID syntax + recipient match + allowlist membership. Endpoints: registry `/fabric/federation/{allowlist,inbox,inbox/{id}/received,send}`, `/systems/register`; sidecar `/v1/content{,/{id}/descriptor,/{id}}`.
**VALUE: A− / USE-CASE: B−** — excellent hardened client; zero deployed peers today.
**RECOMMENDATION: keep.** Fix poison-message redelivery (U6) and warn-on-empty-keys misconfig (U10).

**Handoff layer (`handoff.mjs` + `handoff-cli.mjs`) · stable · 08-23.** Gated A2A exchange (`--enable-federation-exchange --approve`); missing credentials refused locally naming the exact env vars (never `Bearer unset`); payload GLOSSOPETRAE-encoded into signed envelopes; delivery handler re-verifies transport-layer invariants then decodes.

**GLOSSOPETRAE codec (`packages/core/src/glossopetrae-codec.mjs`) · stable · 08-23.** Despite the name, an **anti**-stego codec: byte→pronounceable-token bijection, output `GL1:<sha256-16>:tokens…`. Decode rejects unknown tokens, checksum mismatch, invalid/non-canonical JSON, and ANY covert-channel character (zero-width, variation selectors FE00-FE0F/E0100-E01EF, bidi isolates 2066-2069, tag chars E0000-E007F, soft hyphen, C0/C1 controls). Round-trip + per-class rejection tests.
**VALUE: B+ / USE-CASE: B** — auditable, injective encoding with stego denial built in.
**RECOMMENDATION: keep.**

### 3.10 Replay & rollback — covered by `session-replay.mjs` + `serve-runtime` flags

See §3.1 flagship section and §3.3. Semantics worth memorizing: **approval required** (library refuses `not_approved`; CLI refuses `--dry-run` combos since 2026-08-25); divergence = exitCode mismatch OR stdout-SHA256 mismatch; rollback unwinds in REVERSE; missing/failing compensation ⇒ `partialState:true` + `rollback_failed` audit + nonzero exit (fail closed, state honestly left partial).

### 3.11 Rust host — `crates/ardyn-host/` · stable-as-scaffold (runtime BLOCKED) · lib.rs 08-20

**What:** 7,543-line crate (≈4.5k production + tests): serde types + validators for manifests/tasks (real semver/capability checks), transport-policy + host-policy review/approval records, transport-harness contracts, stdio-runtime contract gates + frame classification, handshake/host_info. `stdio_runtime/mod.rs` is the phase-4.2a **deliberately blocked skeleton**: every entrypoint returns deterministic blocked plans, and a source-guard UNIT TEST bans ~50 live-API patterns (Command::new, .spawn(, std::fs, sockets, even println!) inside the module — blocking is compile-enforced, not promised. `src/bin/session.rs` emits honest lifecycle JSON (`approved_but_not_executed`).
**How to use:** `cargo build --workspace` → `target/debug/session`; CLI bridges via `serve-runtime --rust-session`.
**VALUE: C+ / USE-CASE: D+** — impressive discipline; mostly static contract JSON today.
**RECOMMENDATION: keep** (declared future host); never describe it as a working runtime.

### 3.12 Console — `apps/console/` (Next.js 15.5 / React 19 / Tailwind 4) · stable · dir 08-23

Auth model: `checkAuth(request)` — dev open when `ARDYN_CONSOLE_API_KEY` unset; **production fails closed** (401 `production_no_key`) — behaviorally tested by flipping NODE_ENV. Per-user tokens optional via `ARDYN_CONSOLE_USER_TOKENS` + `x-user-token`. Pages themselves are unauthenticated shells; API routes gate.

| Route / Page | What it does | VALUE / USE-CASE | Recommendation | Maturity |
|---|---|---|---|---|
| `GET /api/health` | static `{status:"healthy"}`, no auth (probe target) | C / B | keep | stable |
| `GET /api/status` | posture JSON; suite counts ONLY from `ARDYN_CONSOLE_TEST_COUNTS` else `"unavailable"` | A− / A | keep | stable |
| `GET /api/federation` | wired/gated flags + authoritative 9-DID allowlist | B+ / B+ | keep | stable |
| `GET /api/events` | SSE stream tailing `.ardyn-events/events.jsonl`: `connected` frame then `session_event`s; abort cleanup | B+ / A− | improve (heartbeat; EventSource auth story U5; buffer bounds U4) | stable |
| `GET /api/metrics` | Prometheus exposition; optional SQLite active-sessions gauge (hashed ids) | A− / B+ | keep | stable |
| `GET·POST /api/runtime` | GET posture; POST honestly returns `status:"planned"` (control lives in CLI) | C+ / C | keep | partial |
| `GET /api/sessions` | always `{sessions:[]}` (labeled) | D / D | reconsider until wired | stub |
| `GET·POST /api/login` | mints inert tokens, self-labels `stub:true` | D / D | reconsider (wire to USER_TOKENS or delete) | stub |
| Dashboard `page.jsx` | KPI cards, 12-row status list, live `<EventsFeed/>`; fetches /api/status via headers-host URL | B+ / B+ | improve (fallback asserts enabled:true when unreachable — U3) | stable |
| Federation page | hardening checklist + sibling DID table (synced to 9 on 08-25) | B− / B | keep now that data is truthful | stable |
| Runtime page | approval-banner + copy-pasteable CLI block (documentation page by design) | B / B | keep | stable |
| Trace page | empty state + transcript schema doc; buttons present but do nothing | C / C+ | improve (wire or remove buttons) | partial |
| Fixtures page | 6 category cards with hardcoded counts — several wrong/dead paths | D+ / C | improve (count from fs — U8) | partial |
| Onboarding page | 5-step zero-to-live flow with accurate commands | B+ / A− | keep (best tutorial surface) | stable |
| `events-feed.jsx` | real EventSource client; LIVE/RECONNECTING/OFFLINE badges; 3 s reconnect; last-50; aria-live | B+ / A− | keep | stable |

Real screenshots (browser captures, post-mockup-deletion) in `docs/assets/`.

### 3.13 SDK + display components — `packages/sdk/` · partial · 08-19

`loadManifest/createPlan/validateTranscript/getVersion` + accessible React components (SessionTrace with aria-live, StatusBadge role=status, ManifestViewer dl/dt/dd, ApprovalGate aria-disabled gating). Gaps: components unreachable via package exports map; d.ts declares types but zero function signatures; only consumer is its own test; console teaches @ardyn/core instead.
**VALUE: C+ / USE-CASE: C. RECOMMENDATION: improve** (add `./components` export + signatures) or fold into core.

### 3.14 MCP & plugin-api — `packages/mcp`, `packages/plugin-api` · stub · 06-01

Identical frozen metadata-registration objects; all safety flags false; `enabled:false, metadataOnly:true`. No protocol/network/install code exists (by design; READMEs disclaim).
**VALUE: D / USE-CASE: D — keep as cheap placeholders; do not count as features.**

### 3.15 Metrics — `packages/core/src/metrics.mjs` + `/api/metrics` · stable · 08-21 · 107 ln

Zero-dependency Prometheus text registry; series for runtime sessions started/killed, computer-use actions by outcome, gateway messages by platform, auth failures; optional per-user active-sessions gauge with SHA-256-hashed pseudonyms. Unknown platforms never mint labels (enforced pre-count); provider failure degrades gauge to absent rather than breaking scrape; horizontal-scale correctness (DB rate limiting, idempotent grants, atomic quota) proven against two shared-DB instances.
**VALUE: A− / USE-CASE: B+ — keep.**

### 3.16 Schemas — `schemas/` · stable · dir 08-19

Five core schemas validate everything the CLI loads: `ardyn.manifest.schema.json` (schemaVersion/name/version/runtime/capabilities), `capability.schema.json` (id/kind/description/permissions), `task.schema.json` (id/objective/mode/requestedCapabilities), `session-event.schema.json` (strict additionalProperties:false + typed payloads so command-looking fields are rejected), `session-transcript.schema.json` (ordering left to semantic checks deliberately). Plus `schemas/boundary-maps/` — 104 files (103 schemas + registry.json) pinning the paperwork family (`reviewOnly: const true`, `authoritative: const false` baked in).
**VALUE: A− (core) / USE-CASE: A−; boundary-map schemas C. RECOMMENDATION: keep core; freeze boundary set.**

### 3.17 Test suite & CI

179 Node test files / 1496 tests (m-milestones ×39, b-batches ×4, phase5 contract ×86, phase4 ×24, core-phase3 ×13, misc), plus 102 Rust tests. Helpers include digest-based source guards and Windows EBUSY-safe temp SQLite. CI (GitHub Actions, SHA-pinned actions): Node 22 job, Windows job, Rust fmt/clippy(-D warnings)/test job on push+PR; weekly security workflow runs npm audit / cargo audit / osv-scanner. `scripts/report-phase-status.mjs` assembles a byte-deterministic phase report from manifests (runs nothing).
**VALUE: A / USE-CASE: A — keep.** Note: ~half the test mass guards the paperwork family.

---

## 4. Docs map (beyond this tutorial)

Read in this order: `docs/posture.md` (canonical current state) → `docs/ARCHITECTURE.md` (repo map + flows) → `docs/how-it-works/*.md` (9 pages: cli/core/rust-host/fabric/fabric-connect/adapter-scaffolds/schemas-and-tests/session-events-and-transcripts/phase-inventory) → `SECURITY.md` + `docs/plan/autobuild/SECURITY-INVARIANTS.md` (threat model + honesty register) → `DECISIONS.md` (D-001…D-B02) → `docs/ONBOARDING.md`. The remaining 111 `phase-*.md` files are an immutable audit trail — cite, don't read linearly. Known drift: `docs/fabric-glossary.md:52` ("federation not wired into CLI" — stale), `docs/federation-sibling-onboarding.md:53` (documents the pre-fix canonicalization — hazardous, see review U11).

## 5. Examples, fixtures, inventory

- `examples/minimal-manifest/` — smallest valid manifest (1 capability `runtime.describe`, adapters disabled, dry-run-default policies).
- `examples/minimal-task/task.json` — plan-mode task for the manifest above.
- `examples/session-events/*.json` (9) + `examples/session-transcripts/*.json` (7) — valid + intentionally-invalid contract fixtures.
- `tests/fixtures/**` (~218 files) — host-policy/review-artifact/stdio/command-surface fixtures backing the guard tests.
- `repo-inventory/` — historical survey of GitHub org Ardynai (580 repos) used as design references; not product code.

---

## 6. PART C — CONNECTION AUDIT

Everything ardyn connects to, integrates with, or references — discovered from source, not docs. Grades: VALUE (to ardyn) / USE-CASE (as exercisable today).

### 6.1 Federation siblings (closed allowlist, `packages/fabric/src/federation.mjs:7-17`)

Shared mechanics for ALL siblings: ardyn uploads bytes to its **local loopback sidecar**, posts a signed addressing envelope to the **shared Multiverse registry** (`POST /fabric/federation/send`), and the sibling polls its own inbox. Trust = closed-set membership + Ed25519 key registered in `ARDYN_FABRIC_SIBLING_KEYS` (or `config/secret/federation-keys.json`). Per-envelope verification: DID syntax → recipient match → signature → allowlist → Merkle contentId re-check. Exchange is gated OFF by default (`--enable-federation-exchange --approve` + env credentials).

| Sibling | What ardyn knows | Extra evidence beyond the DID list | Trust posture | VALUE / USE-CASE | Verdict |
|---|---|---|---|---|---|
| **ardyn** (self) | Default DID `did:multiverse:ardyn`; registers itself id/name "ardyn" v0.1.0 | federation.mjs:5,524-530 | signs with own PKCS8 key | — | canonical slug per docs/harness-identity.md |
| **locus** | Most-referenced peer: authoritative cross-impl fixture source; "mission control outside ARDYN"; Locus content-fabric impl inspected | content-fabric.md:10-16,99-111; harness-identity.md:25-28 | contract-level only; no keys committed | **C− / D** | clearest future use case (review-evidence exchange); zero live wiring |
| **hub** | Implied Multiverse hub / registry-relay operator | how-it-works/fabric-connect.md:29; fabric-glossary.md:24-31 | name-only | **F+ / F** | cannot assess operationally from this repo |
| **kortex-audio** | Fabric harness id only | content-fabric.md:92 | name-only | **F+ / F** | unassessable |
| **custos** | DID entry only | federation-sibling-onboarding.md:4 | name-only | **F / F** | unassessable |
| **somatic** | Fabric harness id only | content-fabric.md:94 | name-only | **F+ / F** | unassessable |
| **aegis** | DID entry only (an unrelated "Aegis" persona appears in expert-user-panel-review.md) | — | name-only | **F / F** | unassessable |
| **praxis** | DID entry only (unrelated "Praxis" DevOps persona in same panel doc) | — | name-only | **F / F** | unassessable |
| **kybernetes** | DID entry + used as test-key fixture DID | tests/fabric.test.mjs:25 | name-only | **F / F** | unassessable |

**Could NOT verify from this repo:** whether any sibling actually runs; the deployed registry URL; the sidecar binary itself (referenced, not shipped here); per-sibling capabilities. The federation layer is a well-hardened **client awaiting peers**.

### 6.2 External services & endpoints (from source, excluding tests/fixtures)

| Connection | What it does | How ardyn uses it | Wiring (env/file) | Endpoint(s) | Last touched | VALUE / USE-CASE | Recommendation | Security / cost note |
|---|---|---|---|---|---|---|---|---|
| **Multiverse fabric registry** | Sibling discovery + inbox relay for signed A2A envelopes | allowlist fetch, inbox poll/mark-received, system register/keepalive, envelope relay | `ARDYN_FABRIC_REGISTRY_URL` (HTTPS enforced off-loopback) + `ARDYN_FABRIC_REGISTRY_TOKEN` (Bearer, fail-closed); per-endpoint path overrides `ARDYN_FABRIC_REGISTRY_*_PATH` | `<registry>/fabric/federation/*`, `/systems/register` | federation.mjs 08-23 | **B+ / C** (live code, no known deployment) | keep | redirect:manual + size cap + loopback rules mitigate SSRF; bearer token custody is operator's duty |
| **Loopback fabric-transport-d sidecar** | Local content-addressed byte store for handoff payloads (Merkle contentId) | PUT bytes, GET descriptor/content during receive | `ARDYN_FABRIC_SIDECAR_URL` (loopback-only enforced) + `ARDYN_FABRIC_SIDECAR_TOKEN` or `FABRIC_TRANSPORT_D_AUTH_TOKEN` | `http://127.0.0.1:<port>/v1/content*` | 08-23 | **B / D** (binary not in repo) | keep | loopback confinement enforced in code |
| **HiClaw Matrix homeserver** | Chat channel via raw Matrix Client-Server API (no SDK, no E2EE) | send m.room.message (txn PUT), long-poll sync; rooms registry gates targets | constructor `baseUrl` option (no env var) + `ARDYN_HICLAW_MATRIX_TOKEN` (or `config/secret/hiclaw.json`) | `<base>/_matrix/client/v3/rooms/{roomId}/send/…`, `/_matrix/client/v3/sync` | 08-23 | **B+ / B−** | keep | tokens never in URLs; E2EE explicitly out of scope |
| **Telegram Bot API** | Channel adapter scaffold (inbound parse + custom HMAC verify) | parse updates; NO outbound POST exists; nothing binds a listener | comment-only `ARDYN_TELEGRAM_BOT_TOKEN` (gateway.mjs:42) — no code reads it | none referenced in source | 08-22 | **D / F** (verification scheme wouldn't accept real Telegram webhooks) | fix scheme or relabel (review U7) | no cost; latent interop failure |
| **Slack Web API** | Channel adapter scaffold (v0: HMAC + 5-min replay window) | verify signed payloads; no outbound delivery, no listener binding | comment-only `ARDYN_SLACK_SIGNING_SECRET` (gateway.mjs:74) | none referenced | 08-23 | **C / D** | wire delivery or relabel | replay window is real and tested |
| **OpenAI API** | LLM chat completions + embeddings via provider adapter | generation/streaming/embeddings for RAG memory; BYO model mandatory | caller-chosen `apiKeyEnv` var (e.g., OPENAI_API_KEY) or `config/secret/provider-keys.json`; throws naming the var pre-fetch if missing | `https://api.openai.com/v1/chat/completions`, `/v1/embeddings` | 08-22 | **A− / B+** | keep | key in Authorization header only; usage costs are caller-owned |
| **Google Gemini API** | LLM generateContent + streaming (SSE) + embeddings | same abstraction, second provider | caller-chosen `apiKeyEnv`; key sent via `x-goog-api-key` header, never URL | `https://generativelanguage.googleapis.com/v1beta/models/{model}:…` | 08-22 | **A− / B+** | keep | same notes |
| **Docker Engine** | Computer-use sandbox lifecycle (`docker run/exec/kill/rm`) | ephemeral hardened container; gVisor optional | local docker socket via CLI; `COMPUTER_RUNTIME=docker\|runsc` | n/a (local daemon) | 08-22 | **B / C+** (image lacks toolchain — U2) | improve | `--network none` + caps dropped + read-only FS |
| **Vercel** | Console hosting target (config ready, deploy BLOCKED on interactive login) | deploys apps/console Next.js only | `vercel.json` (build cmd, output `.next`, env `ARDYN_CONSOLE_MODE=vercel`); `.vercelignore` | vercel.com platform | 08-19 | **C / D** (unused yet) | complete login when ready | prod requires `ARDYN_CONSOLE_API_KEY` (fails closed) |
| **GitHub Actions / GitHub** | CI (Node+Windows+Rust jobs) + weekly npm-audit/cargo-audit/osv-scanner | push/PR gates; branch protection by convention (no force-push, PR merges) | `.github/workflows/ci.yml`, `security.yml` | github.com/Ardynai/ardyn | ci 07-27, sec 08-19 | **A / A** | keep | all actions SHA-pinned |
| **npm registry** | Dependency installs only (root ajv; console deps) | `npm ci` | package-lock.json | registry.npmjs.org (implicit) | lockfile current | **B / A** | keep | supply chain minimal by design |
| **schemas.ardyn.ai** | Schema ID namespace ONLY — never fetched (schemas registered locally in ajv) | identifier strings | none | `https://schemas.ardyn.ai/*.schema.json` | index.mjs/lib.rs | **n/a** | keep as IDs | no network call exists |

**Not connected (verified absent):** no literal api.telegram.org / slack.com / hooks.slack.com strings anywhere in source; no other outbound URLs besides those tabulated.

### 6.3 Complete `ARDYN_*` / integration environment-variable inventory

| Variable | Read at | Wires | Required? |
|---|---|---|---|
| `ARDYN_FABRIC_REGISTRY_URL` | federation.mjs:73 | Registry base URL (HTTPS off-loopback) | yes for federation ops |
| `ARDYN_FABRIC_REGISTRY_TOKEN` | :74 + handoff-cli gate :39-45 | Registry Bearer token | yes, fail-closed |
| `ARDYN_FABRIC_SIDECAR_URL` | :83 | Loopback sidecar base (loopback-only) | yes |
| `ARDYN_FABRIC_SIDECAR_TOKEN` / `FABRIC_TRANSPORT_D_AUTH_TOKEN` | :84-86 | Sidecar Bearer token | yes (either) |
| `ARDYN_FABRIC_DID` / `FABRIC_TRANSPORT_D_DID` | :67-69 | Local DID (default `did:multiverse:ardyn`) | no |
| `ARDYN_FABRIC_IDENTITY_FILE` | :61 (confined :1152-1175) | DID from file | no |
| `ARDYN_FABRIC_IDENTITY_BASE_DIR` | :1032-1036 | Whitelist base dir for identity file (symlink/traversal-checked) | no |
| `ARDYN_FABRIC_SIBLING_KEYS` | :956-964 | JSON map DID→SPKI-b64 Ed25519 public keys | needed to authenticate any sender |
| `ARDYN_FABRIC_SIGNING_KEY_FILE` | handoff.mjs:54 | PKCS8 private signing key | needed to send |
| `ARDYN_FABRIC_SECRET_KEYS_FILE` | handoff.mjs:59 | Alt keys file (default `config/secret/federation-keys.json`, gitignored) | no |
| `ARDYN_FABRIC_FEDERATION_ALLOWLIST` | :64 | CSV sibling allowlist (registry-route alternative) | no |
| `ARDYN_FABRIC_FEDERATION_CLOSED_SIBLING_DIDS` | :65,:502-507 | Operator override of the closed set (can widen!) | no |
| `ARDYN_FABRIC_FEDERATION_POLL_INTERVAL_MS` | :72,:531-535 | Receiver cadence (default 15000) | no |
| `ARDYN_FABRIC_REGISTRY_{ALLOWLIST,INBOX,KEEPALIVE,MARK_RECEIVED,REGISTER,SEND}_PATH` | :75-82 | Per-endpoint path overrides | no |
| `ARDYN_CONSOLE_API_KEY` | console lib/auth.js:6,40 | API-key middleware (`x-api-key`); **prod fail-closed** | yes in production |
| `ARDYN_CONSOLE_USER_TOKENS` | auth.js:25-27 | JSON per-user tokens (`x-user-token`) | no |
| `ARDYN_CONSOLE_TEST_COUNTS` | api/status/route.js:12 | Honest suite-count JSON (else "unavailable") | no |
| `ARDYN_MULTI_USER_DB_PATH` | api/metrics/route.js:17 | SQLite gauge provider for active-sessions metric | no |
| `ARDYN_HICLAW_MATRIX_TOKEN` | hiclaw-matrix.mjs:28,60 | Homeserver Bearer token (throws pre-fetch if missing) | at adapter use |
| `ARDYN_SESSION_TOKEN` | generated, injected `-e` into sandbox container (computer-use.mjs:210,216) | per-session sandbox token (generated but never verified — honesty-register flag) | auto |
| `COMPUTER_RUNTIME` | computer-use.mjs:51 | `docker`\|`runsc` | no |
| `NODE_ENV` | auth.js:7,39 | flips console fail-closed posture | platform-set |
| *(provider keys)* | provider-adapter.mjs:20 via caller-chosen `apiKeyEnv` | OpenAI/Gemini/custom; `config/secret/provider-keys.json` fallback | at call time |
| *(doc-only)* `ARDYN_TELEGRAM_BOT_TOKEN`, `ARDYN_SLACK_SIGNING_SECRET` | comments gateway.mjs:42,74 | would feed adapters; no reader exists | no |

Secrets convention: env vars first, gitignored `config/secret/*.json` second, never committed (tree-wide scanner test enforces).

---

## 7. Capability matrix

| Component | VALUE | USE-CASE | Maturity | Last touched | Recommendation |
|---|---|---|---|---|---|
| CLI (surface) | B+ | A− | stable-ish | 08-24 | keep |
| ├ doctor / identity / capabilities | C+ | B | stable | 06-02→08-24 | keep |
| ├ plan (+review-artifact export) | A− | A− | stable | 08-24 | keep |
| ├ review-trace / review-artifact / validate-session-transcript | B | B | stable | 08-24 | keep |
| ├ emit-session-events / serve (legacy dry-run) | C+ | B | stable | 08-24 | keep |
| ├ **serve-runtime** (spawn/steps/rollback/replay/stream/buffer) | **A−** | **A−** | stable | 08-25 | keep |
| ├ computer-use (CLI face) | C | C | partial | 08-22 | improve (lifecycle) |
| ├ federation (status/config/exchange) | B | C | partial | 08-23 | keep |
| └ shell / sqlite | B− | B | partial | 08-25 | keep (post-fix) |
| Core kernel (@ardyn/core) | A− | B+ | stable | 08-24 | keep |
| session-replay / rollback | A− | B+ | stable | 08-24 | keep |
| Canonical redactor | B+ | B | stable | 08-25 | keep |
| Path containment | A | A | stable | 08-23 | keep |
| diagnostic-redaction | B+ | B | stable | 08-23 | keep (reconcile patterns) |
| multi-user | B+ | B+ | stable | 08-21 | keep |
| user-memory (+RAG) | B+ | B+ | stable | 08-22 | keep (FTS decision) |
| loop-state | B+ | B | stable | 08-21 | keep |
| data-auth | B | B | partial | 08-22 | improve |
| processor-pipeline | A− | A− | stable | 08-22 | keep |
| metrics | A− | B+ | stable | 08-21 | keep |
| provider-adapter (OpenAI/Gemini) | A− | B+ | stable | 08-22 | keep |
| computer-use (sandbox core) | B | C+ | partial | 08-22 | improve (image + params) |
| gateway core (admission/limits) | B+ | C | partial | 08-23 | keep |
| Telegram adapter | D | F | stub-ish | 08-22 | fix or relabel |
| Slack adapter | C | D | partial | 08-23 | wire or relabel |
| HiClaw Matrix adapter | B+ | B− | stable | 08-23 | keep |
| federation client | A− | B− | stable | 08-23 | keep (fix U6/U10) |
| handoff + GLOSSOPETRAE | B+ | B | stable | 08-23 | keep |
| Rust host (validation layer) | C+ | D+ | stable-scaffold | 08-20 | keep (blocked by design) |
| Console API routes (health/status/federation/events/metrics/runtime) | B+ | A− | stable | 08-20→25 | keep + improve events |
| Console routes (sessions/login) | D | D | stub | 08-20 | reconsider |
| Console dashboard + EventsFeed | B+ | B+ | stable | 08-23 | improve fallback honesty |
| Console federation/runtime/onboarding pages | B | B | stable | 08-25/23 | keep |
| Console trace/fixtures pages | C+/D+ | C | partial | 06→08 | improve |
| @ardyn/sdk + display components | C+ | C | partial | 08-19 | improve exports/types |
| @ardyn/mcp / @ardyn/plugin-api | D | D | stub | 06-01 | keep as placeholders |
| Schemas (5 core) | A− | A− | stable | 06-01→08-19 | keep |
| Boundary-map schemas (104) | C | D | stable | 08-19 | freeze |
| Paperwork family (review-artifacts/consumer-display/governance/boundary-maps ≈40k ln) | D | D | stable | 08-24 | serialize to JSON, demote out of runtime pkg |
| Test suite + CI + security scanning | A | A | stable | 08-25 | keep |

**Bottom line for a newcomer:** start with the CLI's read-only commands and the onboarding page; the runtime is genuinely safe to exercise because consent is structural, not conventional. The federation and channel layers are best understood as production-grade *client libraries awaiting counterparts*. And when you touch `packages/core/src/boundary-maps/`, remember: it's documentation wearing a `.mjs` costume.
