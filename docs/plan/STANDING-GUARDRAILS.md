---
tags: [ardyn, guardrails, security]
updated: 2026-07-02
---

# Ardyn — Standing Guardrails

Status legend: ✅ metadata + test-asserted · ⚠️ metadata, weak/no test · ❌ session-lore only (should be committed as policy fixture — see [[Ardyn - Fable 5 Review 2026-07-02]] §12).

| Rule | Status |
|---|---|
| Runtime blocked (serve-runtime, evaluator, approvals, process control, transports…) | ✅ CLI + Rust + fixtures + tests |
| GLOSSOPETRAE reference-only; stego/covert/tokenizer-exploit/bypass blocked | ✅ 5.60 (68-field unsafe list, test-asserted) — the template |
| Hermes/CUA reference-only; no computer-use runtime | ⚠️ 5.68 metadata; no CLI rejection probes / import guards |
| Matrix/HiClaw gateway future-only; no client/E2EE runtime | ⚠️ 5.73 metadata; no dedicated probes |
| codecrafters shell taxonomy only; no shell runtime | ⚠️ 5.74 metadata; no `shell` command probe |
| codecrafters SQLite taxonomy only; no SQLite runtime | ⚠️ 5.76 metadata; no probe |
| Fabric: consume `@multiverse/fabric-core`/sidecar, never rebuild; no P2P/BitTorrent/DHT deps | ⚠️ 5.75 metadata + one negative dep test; **contradicted by `docs/content-fabric.md:128`** (BitTorrent infohash verification still listed as a remaining runtime requirement — fix) |
| Secure Drop lives outside Ardyn (content-fabric family) | ✅ 5.60/5.71 flags |
| No training/GPU deps (torch/tf/jax); model program post-launch, BYO-consumer only | ❌ prose only |
| Goose / Onyx / fainir / OpenClaw not imported | ❌ lore + adapter-boundaries prose |
| Fallow advisory only; never Fallow Runtime | ❌ lore (5.71 toolkit expectation partially covers) |
| One Codex read-only reviewer per narrow phase; Jules by exception; no polling subagents | process rule (session prompts) |
| Report proves presence, not correctness (`reportRunsChecks: false`) | ✅ structurally + test-enforced |

Top hardening move: commit `external-reference-policy.json` + dependency-allowlist test + CLI rejection probes for the ⚠️/❌ rows.


## UPDATE 2026-07-06 — Fabric federation carve-out
PR #4 (merged Jul 5, AUTHORIZED) added packages/fabric/src/federation.mjs — a live, out-of-process, loopback-only Fabric federation consumer client, later WIRED as a gated A2A exchange by M20 (see UPDATE 2026-08-20 above). Baseline moved past 6585ddf. Posture is 'review-only metadata EXCEPT the authorized fabric federation consumer surface'. Invariants (loopback-only, no fabric-core import, no P2P, no Secure Drop decrypt, no CLI/host wiring, no new deps, secrets uncommitted) are reconciled in Phase 5.76B and formalized as tests in Phase 5.83. Do NOT re-block or wire federation.

## UPDATE 2026-08-20 - HiClaw Matrix raw-HTTP carve-out
AUTHORIZED by Josh: the Matrix/HiClaw gateway future-only rule is RELAXED for one narrow surface. Ardyn may make a minimal, raw-fetch Matrix client-server connection to the HiClaw homeserver only (send m.room.message m.text via txn PUT; receive via /sync long-poll), deny-by-default room/sender allowlists, per-user isolation preserved, all gated actions through the existing approval + kill + audit + redaction gates, token from env / gitignored config/secret/hiclaw.json, never logged or in URLs/errors. STILL BANNED: matrix-js-sdk / @matrix-org/* dependencies (raw fetch only) and Matrix E2EE / encryption-key handling - m.room.encrypted events are skipped, never decrypted. Implemented as packages/gateway/src/hiclaw-matrix.mjs.
