# HERMES PROMPT — Phase 5.83 (paste into a fresh Hermes/GLM 5.2 session) — JULES GATE

Status 2026-07-09: Phase 5.82 merged → main `d6d8a3af` (digest guards; clippy --all-targets restored; core.fileMode workaround gone). A CI-routing PR (#11) may land after this is written — **sync to the latest main at session start** regardless of exact SHA.

**This is a JULES GATE.** Hermes pushes a branch + opens a PR + STOPS. Do NOT merge. Fable drives Jules review + merge. (Jules is launched from the jules.google.com console — Josh triggers it when Fable hands over the PR.)

---

```
You are the Hermes agent (GLM 5.2), implementation orchestrator for Ardynai/ardyn (local: C:\Users\Josh\Documents\ardyn).
Flow: inspect → plan → implement → verify. SCOPE LOCK: the 5.83 artifact set (doc + fixture + core helper + focused test + manifest/report wiring) + docs/external-reference-policy.md. NO dependency changes of any kind.

START-OF-SESSION SYNC
- git fetch origin; git checkout main; git pull --ff-only. Record HEAD; confirm == origin/main. Clean worktree; git diff --check passes; identity Ardynai <admin@multiverseos.net>. Abort/report on mismatch.

POSTURE (unchanged): review-only metadata EXCEPT the authorized unwired fabric federation client (docs/posture.md); CI check-execution present. Carry executionPosture tokens forward. Reuse tests/helpers/ (exec, asserts, json, report, regex, source-digests) from 5.82 — do NOT re-define helpers.

CONTEXT — WHY
Several standing guardrails live only in prose/session-lore. Phase 5.60 (GLOSSOPETRAE) is the gold standard: explicit unsafe-field metadata + test-asserted rejections + CLI keyword probes. Phases 5.68 (Hermes/CUA), 5.73 (Matrix), 5.74 (shell), 5.76 (SQLite) have metadata but NO CLI rejection probes or import guards. Lore-only: no training/GPU deps (torch/tensorflow/jax); Goose/Onyx/fainir never imported; OpenClaw reference-only; no P2P/BitTorrent/DHT deps; Fallow advisory-only. Also: the fabric FEDERATION client (packages/fabric/src/federation.mjs, PR #4, authorized) has invariants (loopback-only, no fabric-core import, no P2P, no Secure-Drop decrypt, unwired, no new deps, secrets uncommitted) that are only asserted informally — this phase makes them machine-checked policy. Note: YOU are a Hermes agent, but "hermes_agent" (NousResearch/hermes-agent) is a blocked IMPORT reference — the policy blocks vendoring that code into Ardyn; it does not restrict which harness edits the repo. State this distinction in the policy doc.

TASK
1. tests/fixtures/host-policy/phase5-83/external-reference-policy.json: one entry per reference family — glossopetrae, hermes_agent, cua_computer_use, matrix_hiclaw, codecrafters_shell, codecrafters_sqlite, fabric_core_multiverse, fabric_federation_client, secure_drop_content_fabric, openclaw, goose, onyx, fainir, fallow — each with: source, status (architecture_reference_only | taxonomy_reference_only | future_consumer_pending_contract | authorized_consumer_surface | external_canonical_owner | advisory_only), unsafe families, allowed usage, forbidden usage, owning-phase cross-reference, test-coverage pointer.
2. Dependency allowlist in the same fixture: npm allowlist (exactly: ajv devDependency) and cargo allowlist (exactly: serde, serde_json, sha2). Forbidden-pattern list: libp2p*, *bittorrent*, *dht*, webtorrent, torch, tensorflow, jax, transformers, matrix-js-sdk, @matrix-org/*, hermes*, cua*, goose, onyx, fainir, openclaw*.
3. tests/phase5-83-external-reference-policy.test.mjs (import 5.82 helpers): (a) package.json dependencies+devDependencies exactly equal the npm allowlist; (b) every workspace Cargo.toml [dependencies] equals the cargo allowlist; (c) no forbidden pattern appears as a package NAME in package-lock.json or Cargo.lock; (d) CLI rejection probes (live CLI, via the exported COMMAND_TABLE if present, else the CLI dispatcher) for command families: computer-use, hermes, matrix, shell, sqlite, secure-drop, fabric-transport — all refused; (e) import guards: packages/*/src and apps/cli/src contain no import/require of any forbidden pattern (use the escapeRegExp helper); (f) every policy entry's owning-phase fixture/manifest exists.
4. NEW test group federation_invariants (formalize 5.76B, content-based): federation.mjs is loopback-enforced (exercise isLoopbackFabricFederationUrl — non-loopback sidecar rejected), NOT imported by CLI/host (grep with escaped pattern), imports no @multiverse/fabric-core, joins no DHT/swarm/P2P, adds no deps, decrypts no Secure Drop ciphertext (no crypto decrypt of payloads), commits no secrets (config/secret gitignored; no hardcoded tokens in source).
5. docs/external-reference-policy.md: human-readable mirror; states this file + fixture are the CANONICAL "do not build here" location; future session handoffs cite it instead of restating lore; include the harness-vs-import distinction.
6. Standard phase record + wiring: doc + fixture + core create*ForReview helper (reuse shared helpers/walkers; no clones) with rejection cases incl. forbidden-dep-present, allowlist-mismatch, policy-entry-missing-owning-phase, reportRunsChecks:true; add scripts/phase-status-manifests/phase-phase583*.json + index.json entry; update current-phase to 5.83; set the 5.83 manifest recommendedNextPhase to "phase-5.84-fabric-federation-prewiring-hardening".

MUST NOT
- No dependency changes (the allowlist must match what EXISTS — if reality differs, STOP and report, do not "fix" deps). No runtime surfaces. No federation behavior change. No prior-fixture edits. No merge to main by you. No new deps. `ponytail:` on shortcuts.

VALIDATION (all must pass locally before the PR)
- Focused 5.83 tests ; npm test ; npm run test:schemas ; npm run report:phase-status
- cargo fmt --check ; cargo check --workspace ; cargo clippy --workspace --all-targets -- -D warnings ; cargo test --workspace
- git diff --check ; semgrep --config auto . (0) ; npm audit (0) ; cargo audit ; cargo machete

REVIEW & LANDING — JULES GATE (PR + STOP)
- One read-only reviewer subagent first — confirm: allowlist matches actual deps; forbidden-pattern scan covers lockfiles; CLI probes refuse each family; federation invariants asserted content-based (not git); no dep change; no historical fixture edited.
- Branch hermes/phase-5-83-external-reference-policy; commit "Add Phase 5.83 external-reference policy + dependency allowlist + federation invariants"; push; open PR (same title); body = policy families + allowlists + federation-invariant list. Then STOP. Do NOT merge.
- REPORT BACK: standard format + PR URL. Fable verifies, waits for green CI, has Josh launch Jules from the console, and merges on Jules APPROVE.
```

---
## Sequencing note (Fable)
- Ideal: run this AFTER PR #11 (Mac routing) merges, so node+rust CI runs FREE on the Mac. Parent = latest main (the sync step handles it).
- Jules mechanism: when Hermes stops with the 5.83 PR, Josh launches Jules from jules.google.com pointed at that PR; Fable watches for Jules's verdict + merges on APPROVE (or relays findings to Hermes).
- After 5.83: 5.84 fabric pre-wiring hardening (records the 2026-07-06 federation audit findings — redirect:manual, inbound-auth signatures, registry host allowlist, identity-file confinement) · 5.85 fabric-core producer pin · 5.86 consumer contract export pack · 5.87 flag normalization · 5.88 docs front door · 5.89 threat model.
