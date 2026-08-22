# Autobuild Progress Log

Append one entry per completed work item (format in `LOOP-PROTOCOL.md`). Keep the two running sections below current.

## Blocked / needs Josh
- Federation content exchange: `sendFabricFederationContent` and `startFabricFederationReceiver` exist in the federation module but are NOT wired into the CLI. Only `federation status` and `federation config` work. Content exchange requires explicit authorization.
- Full index.mjs modularization: 73k-line monolith. 4 modules extracted (utils, data-auth, validation re-export, create-review-helpers re-export). Full implementation extraction is incremental.
- Vercel deployment: config ready, needs `vercel login` (interactive browser auth) then `vercel --prod`.

## For Review

### Posture changes
- **Runtime enabled**: `serve-runtime --enable-runtime --approve` spawns real child processes via `node:child_process`. Kill switch (`--kill-after-ms`), stderr redaction, transcript audit, and failure audit are all functional and tested.
- **Federation hardened + wired**: All 5 pre-wiring requirements applied. Federation client wired into CLI via `federation status/config` commands. Content exchange NOT wired (by design).
- **Shell + SQLite commands**: `shell --command` and `sqlite --database --query` execute real commands under approval gates.
- **Embedded DB**: SQLite via `node:sqlite` with sessions, audit_log, permissions tables. Deny-by-default auth, rate limiting, SQL injection prevention.
- **Rust host bridge**: `session.rs` binary calls `run_session_lifecycle()`, CLI `--rust-session` spawns it.
- **SSE streaming**: CLI `--stream` emits SSE, `--buffer-events` writes to file buffer, console `/api/events` reads from buffer.
- **Console**: 6 views + 5 API routes + auth middleware + health endpoint + accessible (aria, loading/empty/error states).

### New dependencies
- `next` 15.1.6, `react` 19.0.0, `react-dom` 19.0.0 (console app only, in apps/console/package.json)
- No new root dependencies. Root package.json stays ajv-only.

### npm audit
- 4 vulnerabilities in console dependency tree (3 high, 1 critical — next.js, sharp)
- These are in the console app's dev dependencies, not the core runtime
- Fix: upgrade to next@15.5.23+ when stable

### ponytail: ceilings left
- index.mjs is 73k lines — 4 modules extracted (utils, data-auth, validation re-export, create-review-helpers re-export). Full implementation extraction deferred.
- Federation content exchange not wired — status/config only
- Console not deployed — Vercel config ready, needs `vercel login`

### Top risks
1. **Runtime process spawning**: verify kill switch actually sends SIGTERM, redaction masks real secrets
2. **Federation wiring**: verify only status/config are wired, content exchange stays blocked
3. **npm audit**: 4 vulnerabilities in console deps — not in core runtime
4. **Console auth**: API key middleware is optional (open in local dev when `ARDYN_CONSOLE_API_KEY` not set)

---

## Log
### 2026-08-19T01:35Z — M0.1: Fix security.yml rust-toolchain
- Changed: `.github/workflows/security.yml`, `tests/m0-security-yml-fix.test.mjs`
- Tests: 1159 → 1162
- Commit: 55874d8

### 2026-08-19T01:45Z — M0.2: De-brittle source guards
- Changed: `tests/helpers/glob-source-guards.mjs`, `tests/m0-glob-source-guards.test.mjs`
- Tests: 1162 → 1167
- Commit: 82cff6e

### 2026-08-19T02:15Z — M0.3: Absent-input rejection
- Changed: `packages/core/src/index.mjs` (reviewedAtDefaulted field), 40 regenerated fixtures
- Tests: 1167 → 1175
- Commit: 96690fa

### 2026-08-19T02:30Z — M0.4: Report loader hardening
- Changed: `scripts/report-phase-status.mjs`, `tests/m0-report-loader-hardening.test.mjs`
- Tests: 1175 → 1179
- Commit: f942461

### 2026-08-19T02:45Z — M0.5: Real JSON Schemas
- Changed: `schemas/boundary-maps/*.schema.json` (103 schemas), `tests/m0-boundary-map-schemas.test.mjs`
- Tests: 1179 → 1183

### 2026-08-19T03:00Z — M0.6: Modularize index.mjs
- Changed: `packages/core/src/internal/utils.mjs`, `tests/m0-modularization.test.mjs`
- Tests: 1183 → 1188

### 2026-08-19T03:30Z — M1: serve-runtime with --enable-runtime
- Changed: `apps/cli/src/index.mjs`, 84 test files for posture change, `tests/m1-runtime-core.test.mjs`
- Tests: 1188 → 1193 (initially 32 failures from posture change)

### 2026-08-19T04:00Z — M1 follow-up: All posture-change failures resolved
- Changed: 9 fixture test files, report-phase-status tests, source-guard tests
- Tests: 1161 → 1193 pass, 0 fail
- Commit: e2be6d0

### 2026-08-19T04:15Z — M2: CLI command surface verified
- Changed: `tests/m2-cli-command-surface.test.mjs` (11 tests)
- Tests: 1193 → 1204
- Commit: 467cb89

### 2026-08-19T04:30Z — M4: Federation pre-wiring hardening
- Changed: `packages/fabric/src/federation.mjs` (5 hardening requirements), `tests/m4-federation-hardening.test.mjs`
- Tests: 1204 → 1209
- Commit: b164f37

### 2026-08-19T04:45Z — M6: Ardyn Harness Console
- Changed: `apps/console/` (6 views), `tests/m6-console-ui.test.mjs`
- Tests: 1209 → 1219
- Commit: 865fea6

### 2026-08-19T05:00Z — M5 SDK + M7 agent modes + M8 hardening/docs
- Changed: `packages/sdk/`, `SECURITY.md`, `tests/m5-consumer-sdk.test.mjs`, `tests/m7-agent-modes.test.mjs`, `tests/m8-hardening-docs.test.mjs`
- Tests: 1219 → 1236
- Commit: ae7fc8b

### 2026-08-19T05:15Z — Docs: Product README + ARCHITECTURE + DECISIONS + reports
- Changed: `README.md`, `docs/ARCHITECTURE.md`, `DECISIONS.md`, `docs/production-readiness-report.md`, `docs/cleanup-report.md`, `CONTRIBUTING.md`
- Tests: 1236 (unchanged)
- Commit: 7414e38

### 2026-08-19T05:30Z — M3: Embedded SQLite DB + auth
- Changed: `packages/core/src/data-auth.mjs` (DB, permissions, rate limiting, secrets, SQL injection prevention), `tests/m3-data-auth.test.mjs`
- Tests: 1236 → 1246
- Commit: e70bfcd

### 2026-08-19T05:45Z — M1 runtime: Real process spawning
- Changed: `apps/cli/src/index.mjs` (spawn, kill switch, redaction, transcript audit, failure audit), `tests/m1-runtime-execution.test.mjs`
- Tests: 1246 → 1253 (7 new runtime execution tests)
- Commit: 3bf5ed6

### 2026-08-19T06:00Z — M2: Shell + SQLite commands
- Changed: `apps/cli/src/index.mjs` (shell, sqlite commands), `tests/m2-shell-sqlite.test.mjs`
- Tests: 1253 → 1260
- Commit: ff73c8a

### 2026-08-19T06:15Z — M4: Federation wiring + M5 display + M6 API + M8 expert panel
- Changed: `apps/cli/src/index.mjs` (federation command), `packages/sdk/src/components/` (4 React components), `apps/console/src/app/api/` (3 API routes), `docs/diagrams/architecture.svg`, `docs/expert-user-panel-review.md`
- Tests: 1260 → 1268
- Commit: a87630e

### 2026-08-19T06:30Z — M1-Rust: Session lifecycle + subprocess bridge
- Changed: `crates/ardyn-host/src/stdio_runtime/mod.rs` (run_session_lifecycle), `crates/ardyn-host/src/bin/session.rs`, `apps/cli/src/index.mjs` (--rust-session flag), `tests/m1-rust-bridge.test.mjs`
- Tests: Node 1268 → 1270, Rust 98 → 101
- Commit: 19aa005

### 2026-08-19T06:45Z — Dockerfile, auth, SSE, TypeScript types, Vercel, modularization
- Changed: `Dockerfile`, `vercel.json`, `apps/console/src/lib/auth.js`, `apps/console/src/app/api/events/route.js`, `packages/sdk/src/index.d.ts`, `packages/core/src/index.js` (barrel), `tests/m-final-polish.test.mjs`
- Tests: 1270 → 1279
- Commit: de36aa5

### 2026-08-19T07:00Z — SSE bridge + modularization modules + README polish
- Changed: `packages/core/src/validation.js`, `packages/core/src/create-review-helpers.js`, `apps/console/src/lib/event-buffer.js`, `apps/cli/src/index.mjs` (--buffer-events), `README.md` (full rewrite to locus-evolution-lab standards)
- Tests: 1279 (unchanged)
- Commit: 50d7573

### 2026-08-19T07:15Z — Console UI upgrade to locus-evolution-lab standards
- Changed: All 6 console pages (aria, loading/empty/error states, breadcrumb nav), layout.jsx (lang, role, nav), API route import path fix, `tests/m6-console-ui.test.mjs`
- Tests: 1279 (unchanged)
- Commit: 59b2e96

### 2026-08-19T07:30Z — Posture.md + PROGRESS.md sync with reality
- Changed: `docs/posture.md` (rewritten to reflect build mode), `docs/plan/autobuild/PROGRESS.md` (this file)
- Tests: 1279 (unchanged)

### 2026-08-19T08:00Z — B2-real: Real cryptographic Ed25519 signature verification
- Changed: `packages/fabric/src/federation.mjs` — real crypto.verify() Ed25519
- Tests: 1292 → 1303

### 2026-08-19T09:00Z — M9: Sandboxed computer-use + M10: Multi-user
- M9: `packages/core/src/computer-use.mjs` — sandboxed computer-use capability
  with screenshot→action loop. Docker container (ubuntu:22.04, Xvfb), ephemeral,
  deny-by-default network, no host access. Approval-gated (--enable-computer-use
  + --approve). Kill switch, action audit, secret redaction. Model-agnostic
  tool schema (9 actions). CLI `computer-use` command added.
  Sandbox mechanism: Docker container with Xvfb virtual display, pinned
  ubuntu:22.04, --no-new-privileges, --cap-drop ALL, --read-only, --network none.
  Tests: 12 new M9 tests.
- M10: `packages/core/src/multi-user.mjs` — per-user accounts, sessions,
  sandboxes with strict isolation. Per-user RBAC (deny-by-default). CRITICAL
  isolation tests prove user A cannot see user B's sessions or sandboxes.
  Console: per-user login API route, per-user sessions API route, auth
  middleware supports per-user tokens (x-user-token header). Production
  fail-closed extended to per-user. Model: Hermes group_sessions_per_user.
  Tests: 4 new M10 tests (including 2 CRITICAL isolation tests).
- Tests: 1303 → 1319 (+16 new). 101 Rust (unchanged).

---

## Final Summary

### Milestones completed
- **M0** (Foundation): ✅ 6 items (security.yml, source guards, absent-input, report loader, schemas, modularization start)
- **M1** (Runtime core): ✅ Real process spawning, kill switch, redaction, transcript audit, failure audit, Rust host bridge
- **M2** (CLI command surface): ✅ 12 commands including shell, sqlite, federation
- **M3** (Data & auth): ✅ Embedded SQLite, permissions, rate limiting, SQL injection prevention, secrets management
- **M4** (Fabric): ✅ Hardened (5/5) + wired into CLI (status/config)
- **M5** (Consumer SDK): ✅ TypeScript types, accessible React display components, contracts registry
- **M6** (Console UI): ✅ 6 views, 5 API routes, auth, health, SSE, accessible
- **M7** (Agent modes): ✅ Code Mode verified, CUA gated
- **M8** (Hardening/docs): ✅ Threat model, expert panel, cleanup report, architecture diagram

### Tests before → after
- **Node tests**: 1159 → 1279 (+120 new tests, all green)
- **Rust tests**: 98 → 101 (+3 new tests, all green)
- **Clippy**: clean

### Remaining items (not blocked, just incremental)
1. Federation content exchange (needs authorization)
2. Full index.mjs implementation extraction (73k → modules)
3. Vercel deployment (needs `vercel login`)
4. npm audit: 4 console dep vulnerabilities (upgrade next.js when stable)

### Branch
- `hermes/kimi-autobuild` — pushed to origin
- Do NOT merge — hand off for review
### 2026-08-20T01:00Z — Plan: M11-M14 (OpenBot/loopx/hermes patterns)

M11 Governed computer-use (OpenBot pattern):
- Upgrade computer-use.mjs to REAL spawn: docker run per session, real docker exec for actions
- Gateway: resolve target → evaluate fail-closed policy → write audit FIRST → then act
- "Take the wheel": login/2FA pause, human control, bot actions refused during human control
- Pattern-adapted from OpenBot (MIT), not vendored

M12 Loop-state control plane (loopx pattern):
- packages/core/src/loop-state.mjs: lifetime goals, user gates, todo ownership (claimed_by),
  quota/should-run + spend, append-only run history + evidence, public/private boundary checks
- Console "Loops" view: read-first management dashboard
- Pattern-adapted from loopx (Apache-2.0), not vendored

M13 Multi-interface gateway (hermes-agent pattern):
- packages/gateway/src/gateway.mjs: pluggable channel-adapter interface
- Telegram + Slack adapters end-to-end; others are adapter stubs
- Per-user mapping, webhook signature verification, rate-limit per user/channel, deny-by-default
- Platform tokens from env/gitignored config/secret/ — never committed
- Pattern-adapted from hermes-agent (MIT), not vendored

M14 Per-user memory (hermes-agent pattern):
- packages/core/src/user-memory.mjs: per-user MEMORY/USER record, cross-session recall (FTS5),
  per-user profile, strict isolation
- Extend M10 isolation tests to cover memory
- Pattern-adapted from hermes-agent (MIT), not vendored

### 2026-08-20T02:00Z — M11-M14 implemented

M11 Governed computer-use (7 tests):
- packages/core/src/computer-use.mjs upgraded with createGateway (record-before-act,
  fail-closed policy, deny-before-allow), takeTheWheel/releaseControl (human handoff),
  per-session token (randomBytes), optional gVisor (COMPUTER_RUNTIME=runsc).
- Sandbox mechanism: Docker container (ubuntu:22.04, Xvfb), --rm, --no-new-privileges,
  --cap-drop ALL, --read-only, --network none, per-session token.
- Pattern adapted from OpenBot (MIT, CopilotKit/OpenBot) — not vendored.

M12 Loop-state control plane (7 tests):
- packages/core/src/loop-state.mjs: goals, todos (claimed_by), gates, quota,
  append-only run_history, public/private boundary checks.
- Pattern adapted from loopx (Apache-2.0, huangruiteng/loopx) — not vendored.

M13 Multi-interface gateway (10 tests):
- packages/gateway/src/gateway.mjs: TelegramAdapter + SlackAdapter (end-to-end),
  Discord/WhatsApp/Signal/Email stubs. verifyTelegramWebhook, verifySlackWebhook,
  mapUserToArdyn (deterministic per-user mapping), createGateway (deny-by-default,
  rate-limit per user).
- Pattern adapted from hermes-agent (MIT, NousResearch/hermes-agent) — not vendored.

M14 Per-user memory (7 tests):
- packages/core/src/user-memory.mjs: per-user memories, profiles, cross-session
  search (LIKE query), summarization. CRITICAL isolation test proves user A
  cannot see user B's memory.
- Pattern adapted from hermes-agent (MIT) — not vendored.

Tests: 1319 → 1350 (+31 new). 101 Rust (unchanged). All green.

### 2026-08-20T03:00Z — M11-real: REAL sandbox spawn + constant-time gateway + cross-user isolation

M11-real gap 1 — REAL sandbox spawn:
- packages/core/src/computer-use.mjs: spawn is now ACTUALLY CALLED via start()
- Injectable spawnImpl (defaults to node:child_process spawn) for testing without Docker
- start() spawns `docker run -d --name ardyn-sandbox-<id> --rm --no-new-privileges
  --cap-drop ALL --read-only --network none -e DISPLAY=:99 -e ARDYN_SESSION_TOKEN=<token>
  ubuntu:22.04 sh -c "Xvfb :99 -screen 0 1280x720x24 & sleep infinity"`
- kill() calls `docker kill ardyn-sandbox-<id>` (REAL)
- end() calls `docker rm -f ardyn-sandbox-<id>` (REAL)
- executeAction() calls `docker exec ardyn-sandbox-<id> ...` with xdotool/import commands (REAL)
- spawn error handling: child.on("error") caught + audited, NOT crashed
- Without approval: no spawn (alive=false, audited as "start_denied_no_approval")
- Dry-run: no spawn (backward compat with M9 tests)
- 8 new tests prove: spawn IS called, NOT called without approval, NOT in dry-run,
  kill calls docker kill, end calls docker rm, spawn error is caught+audited,
  isolation flags present, gateway still routes actions in real mode.

M11-real gap 2 — constant-time HMAC compare:
- packages/gateway/src/gateway.mjs: all webhook verification now uses
  crypto.timingSafeEqual via safeCompare() helper (equal-length buffers).
- Both Telegram and Slack adapters + standalone verify functions updated.
- 6 new tests verify valid/invalid/different-length signatures.

M11-real gap 3 — cross-user gateway isolation:
- New test proves a user arriving via the gateway cannot reach another user's
  session by exercising the actual getSession() access path with mapped userIds.
- Different platform identities map to different Ardyn users, and getSession
  with the wrong userId returns null.

Sandbox mechanism: Docker container (ubuntu:22.04, Xvfb), pinned, ephemeral,
--no-new-privileges, --cap-drop ALL, --read-only, --network none.
Optional gVisor via COMPUTER_RUNTIME=runsc env var.

Tests: 1350 → 1364 (+14 new). 101 Rust (unchanged). All green.
Federation receive/content-exchange stays UNWIRED.

### 2026-08-21T02:00Z — M17: Provider adapters — uniform BYO-model seam

Adapted Vision-Agents' native-API-per-provider idea (MIT — not vendored) into a
thin, dependency-free provider adapter. Ardyn still bundles NO default model.

- packages/core/src/provider-adapter.mjs (new): createProviderAdapter({
  provider, baseUrl?, apiKeyEnv, fetchImpl? }) exposing generate(request) ->
  { provider, model, text, usage, raw } and stream(request) -> async generator
  of { delta } chunks. Uniform request shape { model, messages[{role,content}],
  temperature?, maxTokens? }. Implemented with globalThis.fetch ONLY; fetchImpl
  injectable so tests never touch the network.
- Shipped end-to-end: openai (+openai-compatible alias) and gemini formats —
  correct URLs/headers/bodies per provider (Bearer vs x-goog-api-key header;
  key NEVER in URL/query string); role mapping (assistant->model, system ->
  systemInstruction) for Gemini; SSE parsing for both stream endpoints
  (:streamGenerateContent?alt=sse).
- Pluggable interface for everything else: registerProviderFormat(name,
  { buildRequest, parseResponse, parseStreamEvent }) + listProviderFormats().
- Keys: env var (apiKeyEnv) first, gitignored config/secret/provider-keys.json
  fallback ("<ENV_NAME>": "<key>", same convention as federation-keys.json).
  Missing key FAILS CLOSED before any fetch call. Secrets never logged and
  never appear in errors: errors carry env-var NAME / HTTP status only;
  provider error bodies are NOT echoed; network-error messages are redacted
  against the key value.

Tests: tests/m17-provider-adapter.test.mjs (+10): request construction +
response parsing for both providers via INJECTED fake fetch (no live API),
SSE streaming for both, missing-key fail-closed with fetch-not-called,
no-secret-in-errors (leaky provider body + evil network message), secret-file
fallback, BYO-model required, custom provider registration, unknown provider.
Full suite: 1380 tests — 1376 pass, 4 fail (the pre-existing Windows
node:sqlite EBUSY cleanup failures on m10/m11-cleanup/m12/m14 — reproduce
identically on a clean main worktree). Also ports the Windows pathToFileURL
CLI import fix so m4-federation/m9-computer-use pass on Windows.

### 2026-08-21T03:00Z — M18: RAG per-user memory — semantic recall with strict isolation

Extended M14 per-user memory with real semantic recall, adapting Vision-Agents'
RAG pattern (MIT — not vendored).

Embeddings (no torch/transformers, ever):
- provider-adapter.mjs extended: embed({model, input}) -> { vector, vectors }
  for openai (/embeddings) and gemini (:embedContent, header key) + factory
  createAdapterEmbedder({provider, model, apiKeyEnv, ...}) -> async (text) =>
  number[]. Keys via env / gitignored config/secret/provider-keys.json,
  fail-closed before any fetch, never logged/in errors (same hygiene as M17).
  Tests use INJECTED fake embeddings only — no live API.

Storage + retrieval (documented choice + ceiling):
- user_memories gains embedding / embedding_model columns; idempotent
  ensureMemoryEmbeddingColumns(db) migrates pre-M18 DBs in place and
  self-heals companion tables. Legacy M14 functions unchanged.
- Vectors stored IN the SQLite rows as JSON float arrays; recall prefilters
  WHERE user_id = ? in SQL then ranks by in-process cosineSimilarity.
  ponytail: O(n) over ONE user's items per query — fine at per-user scale;
  upgrade path: sqlite-vec extension or chunked prefilter if ever needed.
  No vector-DB dependency.
- createMemoryStore(db, {embedFn, model}): remember() stores item WITH
  embedding (embedding failure fails closed — no half-ready items);
  recall({userId, query, k}) returns top-k {key, value, score}. Items saved
  without embeddings are skipped by semantic recall (keyword path from M14
  still works).

Isolation floor:
- recall candidates are filtered by user_id BEFORE scoring — cross-user
  leakage is structurally impossible. CRITICAL test proves user A's query
  never returns user B's memory even when B holds a globally higher-ranked
  near-duplicate, both directions, plus a raw SQL scope assertion.

Tests: tests/m18-rag-memory.test.mjs (+11): cosine basics incl. NaN guards;
remember persists embedding+model; embedding failure fails closed; top-k
ordering; missing-embedFn fails loud; legacy rows skipped; CRITICAL isolation;
pre-M18 migration; adapter embed() request/response for openai + gemini;
end-to-end store-on-adapter-embedder isolation roundtrip.
Full suite: 1391 tests — 1387 pass, 4 fail (the documented pre-existing
Windows node:sqlite EBUSY set; unchanged).
