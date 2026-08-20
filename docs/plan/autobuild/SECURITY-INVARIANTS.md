# SECURITY INVARIANTS — the non-negotiable floor (read first, obey always)

Build mode relaxes the *staging* posture (runtime may now be built) but **never** these. If a task would violate any of these, do not do it — log it under "Blocked / needs Josh" in `PROGRESS.md` and move on. These bind every commit.

## 1. Transport & networking
- **No P2P.** No DHT, swarm, gossip, BitTorrent, libp2p, webtorrent, or any peer-to-peer/torrent transport — as a dependency, a reimplementation, or a runtime path.
- **Consume, don't rebuild fabric transport.** Use `@multiverse/fabric-core` (Multiverse-owned, security-reviewed) as a pinned dependency when wiring transport. Never reimplement its content-addressed transport inside Ardyn.
- **Federation client (`packages/fabric/src/federation.mjs`) hardening is a prerequisite to wiring.** Before wiring it into the CLI/host, apply the pre-wiring hardening from `docs/plan/FEDERATION-SECURITY-AUDIT.md`: `redirect:"manual"` (no SSRF via redirects); per-message inbound-auth signature verification (don't trust registry-asserted auth); registry host allowlist; identity-file path confinement + symlink guard; response-size cap. Keep: loopback-only sidecar, HTTPS-only remote registry, closed sibling-DID allowlist, receive-side contentId re-verification. Never join a DHT/swarm.

## 2. Cryptography & covert channels
- **Never implement or decrypt Secure Drop ciphertext.** Ardyn carries ciphertext only; Secure Drop crypto lives outside Ardyn (content-fabric family). No decrypt of payloads.
- **GLOSSOPETRAE stays auditable.** The A2A codec is reference/auditable only — no steganography, covert channels, tokenizer exploits, or bypass mechanisms.
- Use vetted crypto primitives (node:crypto / audited crates); never roll your own. SHA-256 domain-separated Merkle verification stays intact.

## 3. Dependencies
- Build mode **allows** new dependencies where the real product genuinely needs them (e.g. a web framework for the UI, a DB driver) — but each must be: pinned to an exact version, from a reputable source, license-compatible, and **not** on the forbidden list, and checked against typosquat/malware. Prefer stdlib and already-present deps first (ponytail rung ladder).
- **Forbidden patterns (never add):** `libp2p*`, `bittorrent*`, `dht*`, `webtorrent`, `torch`/`tensorflow`/`jax`/`transformers` (no GPU/training deps), `matrix-js-sdk`/`@matrix-org/*`, `hermes*`/`cua*`, `goose`/`onyx`/`fainir`, `openclaw*`. Keep the allowlist test honest — update it deliberately when you add a justified dep; never disable it.

## 4. Secrets & data
- Never commit tokens, keys, or credentials. Secrets come from env + gitignored `config/secret/` only. Never print, log, or persist `GITHUB_TOKEN`, `JULES_API_KEY`, `MAC_MINI_PASSWORD`, or any `ARDYN_FABRIC_*` / `FABRIC_TRANSPORT_D_*` token.
- Redact secrets and PII in logs, transcripts, and error objects. Tokens never appear in URLs or errors.
- CI/tests stay hermetic and offline — no live sidecar/registry, no fabric secrets in any workflow.

## 5. Trust boundaries (the "not lazy about" surfaces)
- Validate all input at trust boundaries: auth, payments, personal data, network ingress, file paths (containment — reject `../` and absolute escapes), deserialization. Fail closed.
- Auth / permissions / RLS / rate-limiting: least privilege, deny by default, real checks (not flags). Approval gates for runtime actions are enforced, not cosmetic.
- **Minor safety & abuse:** never build features whose purpose is to sexualize/endanger minors, generate CSAM, produce malware/exploits, or facilitate abuse. Baseline, absolute.

## 6. Process
- One branch (`hermes/kimi-autobuild`). No force-push, no history rewrite, never push to `main`.
- Runtime that executes code/commands must keep the kill-switch, redaction, replay, and failure-audit semantics the 4.1x contracts specify — build them for real, don't drop them.
- CUA / computer-use runtime stays reference-only unless a separate explicit authorization exists; do not enable a computer-use execution path in this run.

When in doubt about whether something crosses the floor: treat it as blocked, log it, and continue elsewhere.
