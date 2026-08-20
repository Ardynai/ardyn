# Ardyn Autobuild Roadmap — spec → working product

Goal: realize Ardyn as a **real, working AI harness with a UI**, honoring `SECURITY-INVARIANTS.md`. The ~200 review-only phases are the SPEC; implement the behavior they describe and replace "all-flags-false" assertions with real functional tests as each surface goes live.

**Order matters:** foundations first (they de-risk everything after), then runtime up the stack, fabric after hardening, UI once there's state to show, docs/threat-model last. Within each item: test-first → implement → self-review → commit (see `LOOP-PROTOCOL.md`). Milestones are sequential; items inside a milestone can be reordered by dependency.

## Definition of Done (applies to every item)
Builds clean · targeted + integration tests green (`node --test`, `cargo test`) · static analysis clean per language (JS/TS: the repo's linters + `npm audit`; Rust: `cargo fmt --check`, `cargo clippy -D warnings`, `cargo audit`; UI: typecheck + lint + a11y check) · security self-review pass · no forbidden deps · docs + `PROGRESS.md` updated · the behavior is demonstrated by a test, not just asserted present.

---

## M0 — Foundation & de-risk (do first)
The current guards + monolith make real implementation unsafe or intractable; fix that before building on top.
- **Fix `security.yml`**: the rust-toolchain step lacks `with: toolchain: stable` → the weekly scan hard-fails. Add it.
- **De-brittle the source guards**: convert the ~14 whole-file `readFile("…/index.mjs")` regex guards to glob `packages/core/src/**/*.mjs`; add `.github/workflows/*` to `tests/fixtures/source-guards/digests.json`; replace absolute-line-number cross-ref comments with symbol names. (Prevents silent guard bypass once you modularize.)
- **Absent-input rejection**: `create*ForReview({})` currently backfills `reviewedAt` from a constant across ~65 helpers → fabricated provenance. Make absent/invalid input reject (or carry an explicit `defaulted:true`). Uniform across the family.
- **Report loader hardening** (`scripts/report-phase-status.mjs`): narrow the `{path,status}` mutation, add path containment, per-entry try/catch, duplicate-key detection.
- **Real JSON Schemas**: the 119 `ardyn.phase-*` "schemas" are nominal strings; only 5 real schemas exist. Generate real JSON Schemas for the boundary-map artifacts so validation checks shape, not a string match.
- **Modularize `packages/core/src/index.mjs`** (73k lines, ~85% generatable): extract shared internals to `src/internal/`, carve phase blocks into `src/phases/*.mjs`, keep `index.mjs` as a re-export barrel so all imports stay valid; split or regenerate `index.d.ts`. Byte-diff generated output against current before deleting. Dep allowlist lockfile hardening (scan against the positive allowlist; resolve aliases; cover all dep tables) rides here.

## M1 — Runtime core (enable execution)
Realize the stdio runtime the 4.x/5.x contracts describe.
- Rust host (`crates/ardyn-host`): implement the real `stdio_runtime` (currently a deliberately-blocked skeleton) — session/process lifecycle, message framing, redaction, transcript replay, failure audit, kill/rollback semantics. Remove the `compile_fail` inertness doctest as the surface goes live; replace with real behavior tests.
- Node runtime + `serve-runtime`: `serve-runtime` actually serves under an explicit enable flag; host-policy preconditions/approvals become REAL enforced checks (not flags). Positive runtime smoke test (5.15) passes for real.
- Turn the "blocked/all-flags-false" runtime fixtures into functional tests of the built behavior. Keep kill-switch/redaction/replay/audit.

## M2 — Command surface / CLI
- Realize the CLI commands as working: `doctor, identity, capabilities, plan, review-trace, review-artifact, validate-session-transcript, emit-session-events, serve, serve-runtime`. Path containment on every file output.
- Implement the shell / SQLite / command-surface families the taxonomies describe (5.74/5.76) as real, validated commands within the security floor. (CUA/computer-use stays reference-only — see invariants.)

## M3 — Data & auth
- Embedded DB / query engine (5.61/5.76) as a real implementation (SQLite or the specified engine).
- Auth / permissions / RLS / input-sanitization / rate-limiting / error-tracking / audit-integrity (5.62–5.65) as working middleware, deny-by-default, least privilege.
- Secrets management + key rotation + external-gateway credential handling (5.72) real, env/secret-store backed.
- Availability/recovery + infra/compliance/retention (5.66/5.67) as implemented behavior + config.

## M4 — Fabric (after hardening)
- Apply the federation pre-wiring hardening (invariants §1), THEN wire the federation client into CLI/host.
- Consume `@multiverse/fabric-core` for transport (pinned dep; do not rebuild). Realize Content Fabric conformance + the 5.59 coordination envelope. Pin the sidecar/registry contract the client depends on.

## M5 — Consumer packages & SDK
- Consumer contract export pack: real JSON Schemas + `contracts/registry.json`, versioned.
- `packages/sdk` (currently metadata-only) gets a real `src` — the consumer-facing SDK.
- Realize the display/accessibility contracts (5.49–5.58) as real components/APIs Locus/Multiverse can consume.

## M6 — UI/UX (the harness console)
Build per `UI-UX-BRIEF.md`: trace/artifact viewer, phase/status dashboard, fixture gallery, federation monitor, runtime control (approval-gated), consumer onboarding. Deployable on Vercel/Supabase/Cloudflare. Visual self-iteration via screenshots. Accessible.

## M7 — Agent modes & orchestration
- Code Mode (5.77) as a real capability. Hermes agent-mode profiles / skillhub (5.68) realized within the floor. (Computer-use runtime stays gated.)

## M8 — Hardening, docs, threat model (last)
- `SECURITY.md` + threat model (include the federation trust model: loopback trust, token custody, allowlist bypass, registry SSRF, contentId spoofing).
- Docs front door (PHASE-INDEX / CURRENT-STATE / slim README / consumer quickstart), refresh stale review-flow docs, production-readiness + prelaunch checklists.
- Performance passes (suite runtime, report size); add `ponytail:` markers at any remaining known ceilings.

---
When M0–M8 are done (or a budget cap is hit) with the targeted suite green and the invariants honored, write the final `PROGRESS.md` summary + "for Fable's review" section and STOP.


## M9: Computer-use (sandboxed)
- Sandboxed computer-use capability: screenshot → action agent loop
- Actions: screenshot, click, double_click, type, key_press, scroll, mouse_move, drag, wait
- Model-agnostic tool schema (any operator model can drive it)
- Isolated ephemeral Docker container (ubuntu:22.04, Xvfb virtual display)
- One fresh sandbox per session, destroyed on session end
- No host filesystem, host env vars, host credentials, or Ardyn repo access
- Network egress deny-by-default with allowlist
- Approval gate: --enable-computer-use + --approve (default OFF)
- Kill switch, transcript audit, secret redaction over captured text
- Status: complete

## M10: Multi-user
- Per-user accounts and sessions with strict isolation
- Per-user RBAC (deny-by-default permissions, per-user grants)
- One user cannot see or control another user's sessions, sandboxes, or data
- Console per-user login + per-user views + per-user API routes
- Auth fails closed in production (extends B5 fix to per-user)
- Model: Hermes group_sessions_per_user (per-user isolation in shared contexts)
- Status: complete
