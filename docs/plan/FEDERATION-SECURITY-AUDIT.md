---
tags: [ardyn, security, audit, fabric]
date: 2026-07-06
reviewer: Fable 5 (focused subagent audit, read-only)
target: packages/fabric/src/federation.mjs (PR #4, merged Jul 5)
verdict: SAFE to keep merged as an unwired consumer surface
---

# Ardyn — Fabric Federation Client Security Audit (2026-07-06)

Audited because PR #4 landed a live network client (globalThis.fetch → fabric-transport-d sidecar loopback + Multiverse registry HTTPS; bearer tokens + DID from env/config/secret; closed sibling-DID allowlist; receive-side Fabric CA contentId re-verification) **without independent review**. See [[Ardyn - Standing Guardrails]] for the carve-out.

## Verdict

**Safe to keep merged, unwired.** Confirmed not reachable from CLI or Rust host (only `tests/fabric.test.mjs` imports it; `packages/core` has an attestation validator ~index.mjs:69595 that REJECTS any record flipping `wiredIntoCli`/`wiredIntoHost` to true). `config/secret/` gitignored. Tests hermetic (inject `fetchImpl`, fake tokens, no live net). The two hardest properties are tight: receive-side SHA-256 domain-separated Merkle/contentId re-verification (no TOCTOU; tampered bytes → `piece_hash_mismatch`, handler never runs) and the closed-sibling allowlist ceiling (a rogue registry cannot introduce a non-sibling DID). Tokens never appear in URLs, logs, or error objects. Secure Drop payloads are pure ciphertext passthrough — never decrypted. No prototype pollution; crypto correct; loopback IP-format tricks (decimal/hex/octal/short) all normalize to real loopback and are safe; 0.0.0.0 / `127.0.0.1.evil.com` / mapped-v6 correctly rejected.

## Pre-wiring hardening requirements (become Phase 5.84, review-only — NOT urgent while unwired)

- **HIGH-1 — redirect-following SSRF.** `requestRaw` (federation.mjs:635) sets no `redirect` option, so fetch follows up to 20 hops. A compromised/MITM'd loopback sidecar or registry can `302` the client to an arbitrary internal/external host (e.g. 169.254.169.254 metadata, internal ports). undici strips `Authorization` on cross-origin redirects, so NOT a token-exfil — but a real request-forgery/SSRF primitive. Fix: `redirect:"manual"`, treat 3xx as error. Highest-priority pre-wiring change.
- **HIGH-2 — inbound auth is registry-asserted only.** `isInboundAuthenticated` (:855) trusts `envelope.authenticated`/`authenticatedDid` from the registry JSON — no signature check. Blast radius bounded to the 9 closed siblings (rogue registry can impersonate a sibling, not an arbitrary DID). Trust model = "registry + sidecar trusted; siblings mutually trust." Document it; add per-message signature verification if sibling-impersonation is in scope before wiring.
- **MEDIUM-1 — registry token host trust.** Registry token sent to whatever `ARDYN_FABRIC_REGISTRY_URL` names (any HTTPS host); no host allowlist/cert pin. Config-trust issue. Add expected-host allowlist before wiring.
- **MEDIUM-2 — identity-file read unconfined.** `ARDYN_FABRIC_IDENTITY_FILE` → `readFileSync` with no path confinement/symlink guard (:912). Env-trust boundary; not remote. Apply the repo's existing `pathConfinementError` posture before wiring. (Only reads a DID/id — never surfaces private-key material; test asserts `privateKey===undefined`.)
- **INFO-3 (optional) — response-size cap** in `requestRaw` to bound memory from a hostile loopback sidecar.

## What is genuinely fine (don't re-litigate)

contentId/Merkle re-verification, SHA-256 usage, token non-leakage, Secure Drop passthrough, JSON/prototype-pollution resistance, DID handling, numeric bounds (`safeByteCount`), test hermeticity. Key refs: loopback :49-58/:868; redirect gap :635; identity read :912; allowlist ceiling :534-550; inbound auth :855/:304; Merkle/verify :211-246/:679-799; token header :629; wiring guard core index.mjs:69595.
