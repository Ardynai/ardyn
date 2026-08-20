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