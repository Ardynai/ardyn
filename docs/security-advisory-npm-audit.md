# Security Advisory — npm audit (Console Dependencies)

**Date:** 2026-08-19
**Scope:** `apps/console/` dependency tree only (not core runtime)

## Current vulnerabilities (3 high)

| Package | Severity | Issue | Fix |
|---------|----------|-------|-----|
| `next` | high | CVE-2025-66478 (SSRF in Server Actions) | Upgrade to next@16.x (breaking change) |
| `postcss` | high | Vulnerability in postcss transitive dep | Fixed by upgrading next |
| `sharp` | high | Inherited libvips vulnerabilities (CVE-2026-33327/33328/35590/35591) | Upgrade to sharp@0.35.0+ |

## Impact assessment

- These vulnerabilities are in the **console web app only** — not in the core runtime, CLI, or Rust host
- The console is a local dev tool / optional deployment — not a production service
- `next` CVE requires Server Actions to be exploitable — our API routes use standard request/response, not Server Actions
- `sharp` is used for Next.js image optimization — we don't use `<Image>` components with external URLs
- `postcss` is a build-time dependency — not present at runtime

## Remediation plan

1. **Short-term (this branch):** Upgraded next from 15.1.6 to 15.5.23 (patched where possible). Sharp upgraded to 0.35.0. Remaining issues require next@16 breaking change.
2. **Next release:** Upgrade to next@16.x when stable. This will resolve all 3 remaining vulnerabilities.
3. **Mitigation:** Set `ARDYN_CONSOLE_API_KEY` env var to require authentication on all API routes. Don't expose the console to the public internet without auth.

## Root package.json (core runtime)

The root `package.json` has **zero vulnerabilities** — its only dependency is `ajv` (dev only, for JSON Schema validation). The core runtime, CLI, Rust host, and SDK are not affected by these console dependency issues.