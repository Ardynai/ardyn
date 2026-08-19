# Expert User Panel Review — Ardyn

**Date:** 2026-08-19
**Per:** FINAL_PHASE_EXPERT_USER_PANEL_AND_FULL_STACK_BLUEPRINT.md

## Panel composition

Three expert users simulate real-world usage of Ardyn from different angles:

### Expert 1: AI Agent Developer (integrator)
**Profile:** Developer integrating Ardyn into an existing agent system (Locus/Multiverse)
**Focus:** SDK usability, manifest schema, CLI ergonomics

**Findings:**
- ✅ SDK exports are clean: `loadManifest`, `createPlan`, `validateTranscript`
- ✅ Display components (SessionTrace, StatusBadge, ManifestViewer, ApprovalGate) are accessible with aria attributes
- ✅ CLI commands have consistent flag patterns (`--enable-runtime --approve`)
- ⚠️ SDK lacks TypeScript types — consumers using TS need to write their own
- ⚠️ No error code taxonomy — errors are strings, not structured codes
- ⚠️ Manifest schema doesn't document adapter contract format
- **Missing capability:** No way to stream session events in real-time (only post-hoc replay)

### Expert 2: Security Engineer (Aegis)
**Profile:** Security reviewer checking the trust boundaries and threat model
**Focus:** Approval gates, redaction, federation hardening, secrets

**Findings:**
- ✅ Approval gates are enforced in CLI code (not just documented)
- ✅ Kill switch is functional (--kill-after-ms auto-SIGTERM)
- ✅ Stderr redaction masks token=/secret=/password=/Bearer patterns
- ✅ Federation hardening: redirect:manual, host allowlist, response cap, identity confinement
- ✅ Deny-by-default permissions in DB layer
- ✅ SQL injection prevention (allowlist + multi-stmt block)
- ✅ Rate limiting implemented (token bucket)
- ⚠️ Redaction regex is basic — complex secret patterns (JWT, base64-encoded) may slip through
- ⚠️ No CSRF protection on console API routes (acceptable for local-only, but needs review before deployment)
- ⚠️ `node:sqlite` is experimental — production use should pin Node version
- **Missing capability:** No audit log persistence (audit_log table is in-memory or per-DB, not aggregated)

### Expert 3: DevOps Operator (Praxis)
**Profile:** Operator running Ardyn in a CI/CD pipeline or production environment
**Focus:** Deployment, monitoring, recovery, CI integration

**Findings:**
- ✅ CLI produces structured JSON output (parseable by CI)
- ✅ Console builds successfully (Next.js standalone output for Vercel)
- ✅ API routes return structured JSON with proper status codes
- ✅ 1260 tests provide strong regression protection
- ✅ Architecture diagram and docs are clear
- ⚠️ No health check endpoint (operators need `/api/health` for k8s probes)
- ⚠️ No structured logging (only stderr)
- ⚠️ No metrics/observability (no Prometheus endpoint, no trace IDs)
- ⚠️ Console has no authentication — anyone with the URL can see status
- **Missing capability:** No Dockerfile or deployment manifest

## Capability grading

| Capability | Grade | Notes |
|---|---|---|
| CLI commands | A | 12 commands, all working, approval-gated |
| Runtime execution | B+ | Real process spawning, kill switch, redaction; no streaming |
| Data & auth | B | DB, permissions, rate limiting, secrets; no persistence |
| Federation | B+ | Hardened + wired (status/config); no content exchange |
| SDK | B | Clean API + display components; no TS types |
| Console | B | 6 views + 3 API routes; not deployed, no auth |
| Tests | A | 1260 tests, comprehensive |
| Docs | A | README, ARCHITECTURE, DECISIONS, readiness report, cleanup report |
| Security | A- | Strong floor; redaction could be deeper |
| Deployment | C+ | Builds work; no Dockerfile, no health check |

## Top-3 competitor comparison

| Feature | Ardyn | Hermes Agent | OpenAI Codex |
|---|---|---|---|
| Manifest contracts | ✅ JSON schemas | ❌ Config files | ❌ No contracts |
| Approval gates | ✅ CLI enforced | ⚠️ Config-based | ❌ No gates |
| Kill switch | ✅ --kill-after-ms | ⚠️ Manual | ❌ None |
| Transcript audit | ✅ Per-session | ✅ Built-in | ❌ None |
| Federation | ✅ Hardened (loopback) | ❌ None | ❌ None |
| Web console | ✅ 6 views | ✅ Full TUI | ❌ None |

## Missing-capability backlog

1. **Real-time event streaming** (WebSocket or SSE from CLI to console)
2. **TypeScript types** for SDK consumers
3. **Audit log persistence** (aggregated across sessions)
4. **Health check endpoint** (`/api/health`)
5. **Dockerfile** + deployment manifest
6. **Console authentication** (Supabase auth or similar)
7. **Structured logging** (JSON logs with trace IDs)
8. **Deeper redaction** (JWT, base64, multi-line secrets)

## Launch blockers

1. Console authentication must be added before public deployment
2. `node:sqlite` experimental status should be documented
3. No Dockerfile for containerized deployment

## Post-launch evolution candidates

1. Rust host stdio_runtime implementation (real session lifecycle)
2. Federation content exchange (beyond status/config)
3. Full index.mjs modularization (73k → module-per-phase)
4. Skill/profile loading (per Hermes-class harness parity blueprint)
5. Computer-use infrastructure (browser + desktop session/replay/verify)