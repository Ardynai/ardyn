# Ardyn Security — Threat Model

## Overview

Ardyn is an open-source AI harness/framework with a review-only metadata posture (now transitioning to build mode with runtime enabled under explicit flags). This document captures the threat model, trust boundaries, and security invariants.

## Trust Boundaries

### 1. CLI / Host (user-controlled)
- **Trust level:** High — user runs the CLI locally
- **Threats:** Path traversal in file inputs, malicious manifest/task files
- **Mitigations:** `assertLocalFilePath` path containment, input validation at every boundary, fail-closed on invalid input

### 2. Runtime (approval-gated)
- **Trust level:** Medium — requires `--enable-runtime` + `--approve` flags
- **Threats:** Unauthorized execution, process escape, data exfiltration
- **Mitigations:** Kill switch, redaction (fail-closed), transcript audit, failure audit with rollback

### 3. Federation Client (loopback-only sidecar + HTTPS remote registry)
- **Trust level:** Low — network-facing, untrusted remote
- **Threats:** SSRF via redirects, registry spoofing, identity-file traversal, response bombing
- **Mitigations:** `redirect: "manual"` (no redirect following), registry host allowlist, identity-file path confinement, response-size cap (16MB), closed sibling-DID allowlist, receive-side contentId re-verification

### 4. Consumer SDK (third-party consumers)
- **Trust level:** Medium — consumers run SDK in their own environment
- **Threats:** Malformed transcripts, invalid manifests
- **Mitigations:** Schema validation, input validation, non-authoritative by default

## Federation Trust Model

- **Loopback trust:** The sidecar runs on localhost only. `isLoopbackFabricFederationUrl` rejects non-loopback URLs.
- **Token custody:** Bearer tokens come from env vars (`ARDYN_FABRIC_REGISTRY_TOKEN`), never in URLs or logs.
- **Allowlist bypass:** A rogue registry cannot introduce a non-sibling DID (closed sibling-DID allowlist enforced).
- **Registry SSRF:** `redirect: "manual"` prevents SSRF via redirect following. Registry host allowlist available if configured.
- **ContentId spoofing:** Receive-side SHA-256 domain-separated Merkle/contentId re-verification prevents tampered content.

## Security Invariants (never relaxed)

1. **No P2P/DHT/BitTorrent** — no peer-to-peer transport as dependency or runtime path
2. **Consume, don't rebuild fabric transport** — use `@multiverse/fabric-core` as pinned dependency (not yet wired)
3. **Never decrypt Secure Drop ciphertext** — Ardyn carries ciphertext only
4. **GLOSSOPETRAE stays auditable** — no steganography, covert channels, or bypass mechanisms
5. **Forbidden dependencies** — no libp2p, bittorrent, dht, torch, tensorflow, transformers, hermes, cua, etc.
6. **Never commit/print secrets** — tokens from env + gitignored config/secret/ only
7. **Validate at trust boundaries** — fail closed on invalid input
8. **Minor safety** — never build features that endanger minors or produce malware
9. **CUA/computer-use stays gated** — reference-only unless separately authorized

## Dependency Allowlist

### npm (devDependencies only)
- `ajv` ^8.17.1

### cargo
- `serde` 1 (features: derive)
- `serde_json` 1
- `sha2` 0.10

### Console (apps/console)
- `next` 15.1.6
- `react` 19.0.0
- `react-dom` 19.0.0
- `tailwindcss` 4.0.0 (dev)

## Incident Response

1. Kill switch: `SIGTERM` or `--kill` stops the runtime session
2. Rollback: failure audit with rollback-on-failure enabled
3. Redaction: stderr redaction (fail-closed) prevents leaking sensitive data
4. Transcript audit: replay-enabled for post-incident analysis