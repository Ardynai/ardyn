# Production Readiness Report — Ardyn

**Date:** 2026-08-19
**Assessed by:** Kimi K3 autobuild operator
**Branch:** `hermes/kimi-autobuild`

## Assessment

| # | Category | Status | Evidence / gap |
|---|----------|--------|----------------|
| 1 | Front-End Development | partial | Console UI scaffolded (6 views), not deployed; empty/loading/error states present; a11y (focus-visible, lang, semantic nav) |
| 2 | API & Backend Logic | partial | CLI commands work (10 commands); serve-runtime produces dry-run plan; no API server yet |
| 3 | Database & Storage | not-started | BLOCKED — needs DB engine decision (D-B01) |
| 4 | Auth & Permissions | partial | CLI path containment enforced; approval gates enforced; no user auth/RLS yet |
| 5 | Hosting & Deployment | planned | Console deployable on Vercel (Next.js standalone output); CLI is local-only |
| 6 | Cloud & Compute | not-applicable | Local-only / user-hardware mode |
| 7 | CI/CD & Version Control | ready | CI workflows exist (ci.yml, security.yml); branch protection on main; no PR self-merge |
| 8 | Security & RLS | partial | Security invariants enforced (no P2P, no decrypt, no forbidden deps); federation hardened; no RLS (no DB) |
| 9 | Rate Limiting | not-applicable | No API server; CLI is local |
| 10 | Caching & CDN | not-applicable | No web deployment yet |
| 11 | Load Balancing & Scaling | not-applicable | Local-only |
| 12 | Error Tracking & Logs | partial | CLI errors to stderr; redaction (fail-closed); no structured logging/monitoring |
| 13 | Availability & Recovery | planned | Kill switch + rollback configured in runtime plan; no backup (no DB) |
| 14 | Infrastructure Management & Compliance | not-applicable | Local-only |
| 15 | Testing Frameworks | ready | 1236 Node tests (all green), 98 Rust tests (all green); no e2e or stress tests |
| 16 | Operations & Reliability | partial | Kill switch, redaction, transcript audit, failure audit configured; no circuit breakers |
| 17 | Maintenance & Governance | ready | DECISIONS.md exists; AGENTS.md (ponytail rules); architecture docs; dependency allowlist |
| 18 | Secrets Management | ready | No secrets committed; env-only; never logged; gitignored config/secret/ |
| 19 | System Discovery | partial | Repo structure documented; service registry not applicable (local-only) |

## Critical gates

- ✅ API & Backend Logic: CLI commands work, tested
- ⚠️ Database & Storage: BLOCKED (D-B01)
- ⚠️ Auth & Permissions: CLI auth (path containment, approval gates) but no user auth
- ✅ CI/CD & Version Control: CI exists, branch protection
- ✅ Error Tracking & Logs: stderr + redaction
- ⚠️ Availability & Recovery: kill switch configured, no backup (no DB)
- ✅ Testing Frameworks: 1236 + 98 tests green
- ✅ Secrets Management: env-only, never committed
- ⚠️ Security & RLS: invariants enforced, no RLS (no DB)

## Prelaunch hardening checklist

- [x] Build/test baseline complete (1236 Node + 98 Rust)
- [ ] Cleanup/static hardening report — see docs/cleanup-report.md
- [x] Auth/permissions reviewed (CLI path containment, approval gates)
- [x] Input validation reviewed (assertLocalFilePath, fail-closed)
- [x] Secrets/log redaction reviewed (env-only, redaction fail-closed)
- [ ] Rate limits reviewed — not applicable (local CLI)
- [ ] RLS/data isolation — not applicable (no DB)
- [ ] OWASP/ZAP — not applicable (no web deployment)
- [x] Observability/logging reviewed (stderr, redaction)
- [x] Backup/restore/rollback documented (kill switch, no DB to back up)
- [x] Production-readiness checklist updated (this document)
- [ ] Critical/high blockers resolved or release blocked

## Conclusion

Ardyn is **alpha — build mode**. The review-only specification is complete and serves as the system's spec. The runtime is enabled under explicit flags. The federation client is hardened but not wired. The console UI is scaffolded but not deployed. M3 (Data & auth) is blocked pending a DB engine decision.

**Not production-ready.** Suitable for development, testing, and integration evaluation.