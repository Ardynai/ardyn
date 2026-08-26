# ARDY Repo Review — 2026-08-25 (b)

**Reviewer:** ox-alpha (opencode), branch `review/tutorial-2026-08-20` (== main @ `822d066`).
**Method:** four parallel review lanes (core+CLI, fabric/federation/gateway, console/SDK/Rust host, tutorial data), every claim verified against actual source with file:line evidence; key security claims re-verified and *empirically reproduced* by the lead reviewer. Companion document: [`docs/TUTORIAL.md`](docs/TUTORIAL.md) (tutorial + full connection audit).

**Verdict up front:** the repo's engineering culture is real and unusually honest — but PRs #22–#28 shipped **one genuine approval-gate bypass**, two **unredacted output paths**, and a handful of smaller correctness bugs, all of which are **fixed in this branch with behavioral tests**. Docs are now largely truthful; the largest remaining honesty debt is ~40k lines of "contract boundary map" code-as-paperwork that has no runtime consumer.

---

## 1. PR-by-PR verification (#22–#28)

Legend: **REAL** = verified in code + behaviorally tested · **PARTIAL** = true with material caveats · **OVER-CLAIMED** = claim does not match code.

| PR | Claim | Verdict | Evidence |
|---|---|---|---|
| #22 | Recursive canonical signing at ALL depths (federation.mjs + handoff.mjs) | **REAL** | Byte-identical recursive `canonicalJson` (`Object.keys().sort()` each level, order-preserving arrays) at `federation.mjs:982-996` and `handoff.mjs:76-90`; nested tamper + key-order tests `m21:25-73`. Note: array-element *tampering* is not directly tested (nested-object only). |
| #22 | Unified redactor used by processor-pipeline + data-auth + CLI stderr/stdout | **PARTIAL → fixed here** | Delegation confirmed (`processor-pipeline.mjs:16`, `data-auth.mjs:8`, serve-runtime CLI paths). BUT `shell`/`sqlite` printed child output verbatim (reproduced: `echo token=supersecret123` leaked), and the "strongest-pattern superset" missed colon-form secrets (`{"password":"hunter2"}` passed through). **Both fixed in this branch** (§3 F2/F3). |
| #22 | Gateway deny-by-default sender allowlist | **REAL** (unit level) | Admission only via `options.allowedSenders`/`registerUser()` (`gateway.mjs:173-178,289-291`); unknown ⇒ `unknown_sender`; m13 rewritten stronger. Caveat: nothing binds these adapters to a network surface yet — "the gateway admits nobody in production" today. |
| #22 | Windowed rate limiter | **REAL** | `{count,resetAt}` buckets + lazy sweep (`gateway.mjs:183-189,267-286`), DB-backed cross-instance variant, m13 tested. |
| #22 | Self-healing federation receiver | **REAL** | Reschedule in `finally`, onError surfacing, initial-register failure tolerated (`federation.mjs:163-226`); flaky-fetch test `m21:107-137`. |
| #22 | GL1 stego classes rejected | **REAL, reframed** | GLOSSOPETRAE is an *anti*-stego codec (dictionary substitution, zero invisible chars); covert-char scanner covers VS1-2 (FE00-FE0F, E0100-E01EF), bidi isolates (2066-2069), tags (E0000-E007F), plus ZW/BOM/C0 — `glossopetrae-codec.mjs:77-100`; per-class tests m21. Anywhere it's described as "stego encoding" is inverted framing. |
| #22 | HiClaw outbound allowlist | **REAL** | Raw `!roomId` and object targets must resolve in rooms registry pre-fetch (`hiclaw-matrix.mjs:88-114`); zero-transport proof `m21:188-204`. |
| #23 | Real console screenshots replace mockups | **REAL** | Git forensics: mockup-era PNGs deleted `9a8af89` (2026-08-22), re-added `fa9642c` (2026-08-23) at capture-typical sizes (58–127 KB, 1600 px wide). Leftover static HTML mockup still at `docs/assets/console-dashboard.html`. |
| #24 | minimalManifestPath crash fix | **REAL** | Dead assignments removed (`635a50c`); regression-guarded `m23:28-52`. |
| #24 | Bearer "unset" fail-closed | **REAL** | Missing/empty/whitespace tokens refused locally naming the vars (`handoff-cli.mjs:36-47`). |
| #24 | Slack replay window before HMAC | **REAL** | `SLACK_REPLAY_WINDOW_SECONDS=300`, rejects stale AND future timestamps, freshness checked first (`gateway.mjs:28-34,100,145`); safeCompare denies non-string. |
| #24 | Windows write containment | **REAL** | `internal/paths.mjs` rejects drive-absolute/bare-drive/UNC/POSIX-abs/backslash-traversal/`file:`; applied at `plan --output` (CLI:708→729); 9-case matrix m23 CC-4. Reads stay absolute-allowed by design (documented asymmetry). |
| #25 | Real EventSource SSE client (STUB removed) | **REAL** | `events-feed.jsx`: real `EventSource("/api/events")`, LIVE/RECONNECTING/OFFLINE badges, 3 s reconnect, last-50 cap, honest empty state; end-to-end buffer→route→client test m24. |
| #25 | Real replay + rollback library | **REAL** | `session-replay.mjs`: `assertApproved` (:19-25), exitCode+stdout-SHA256 divergence (:70-82), reverse unwind ([...completed].reverse() :147), missing/failing compensation ⇒ `rollback_failed`+`partialState:true` fail-closed (:151-179); fs-effect assertions m25/m26 incl. marker honestly left on missing compensation. |
| #26/#27/#28 | Modularization: index.mjs → kernel-only, 4,182 lines | **REAL (number is non-blank count)** | Measured: exactly 4,182 non-blank / 4,912 physical lines. Kernel imports only 12 extracted modules + node builtins; extraction commit diff shows verbatim moves (+2 import lines per family); zero duplicated top-level defs across all modules; clean downward DAG. Docs say "measured"; unqualified "4,182" circulates as if physical. |
| #26/#27/#28 | Public surface frozen at 429 exports | **REAL** | Runtime `Object.keys(@ardyn/core).length === 429`; fixture byte-equal; guard fires on injected mutation (verified by simulation); origin/main diff leg silently skips when git unavailable (test:48-51) and is currently a self-comparison (branch==main). |
| #26 | Rollback auto-invocation live in serve-runtime `--steps` | **PARTIAL → gate fixed here** | Real children via same spawn/redaction path, compensations reverse, fail-closed — BUT the `--steps` branch was reachable with `--dry-run` and no `--approve` (`approved:true` hardcoded, comment falsely claimed the gate enforced it). Reproduced empirically. **Fixed in this branch (F1).** |
| #28 | SSE row "Complete (events-feed.jsx)" | **REAL** | Confirmed client + stream contract tests. |
| #28 | docs truth-sync ("no doc claims anything the code doesn't do") | **MOSTLY REAL** | Big improvement, but residual drift found and partly fixed here: fixtures page hardcodes wrong counts/dead paths; federation page showed 2-of-9 siblings + "exchange unwired" (both fixed); dashboard fallback asserts `runtimeEnabled:true,federationWired:true` when /api/status is unreachable (NOT fixed — see §5); `docs/fabric-glossary.md:52` still says federation "not wired into the CLI" (stale); `federation-sibling-onboarding.md:53` documents the OLD top-level-keys canonicalization — a sibling implementing the doc would fail every handshake with nested fields. |

## 2. What actually exists vs what is paperwork

Real, load-bearing runtime code (~10k lines): CLI surface, core kernel validators/planner, session-replay/rollback, multi-user + user-memory (real SQLite via node:sqlite, SQL-scoped isolation, RAG cosine recall with BYO embeddings), loop-state control plane, processor pipeline, metrics, computer-use governance, fabric federation/handoff/GLOSSOPETRAE, gateway adapters, provider adapter (OpenAI/Gemini raw fetch), console app + API routes, Rust host validation layer.

Contract paperwork dressed as code (~40k lines): `review-artifacts.mjs` (24.8k), `boundary-maps/*.mjs` (28.0k, of which `infrastructure.mjs` alone is 20.9k / 800 KB), `consumer-display.mjs` (10.5k), `governance-reports.mjs` (3.7k), plus 86 phase5-* tests and 104 boundary-map schemas. All `runtimeEffect:false` by construction, consumed only by their own tests and the report script. Harmless to runtime safety, expensive to maintain, and inflating every "lines of code" metric.

Honest stubs (labeled as such): `/api/sessions` (always []), `/api/login` (mints inert tokens), `@ardyn/mcp`, `@ardyn/plugin-api` (metadata-only), Telegram outbound delivery (none), computer-use interaction primitives (stock ubuntu:22.04 lacks Xvfb/xdotool/ImageMagick).

## 3. Fixes made IN THIS BRANCH (each with a behavioral test in `tests/r1-review-fixes.test.mjs`)

| ID | Severity | Fix | Proof test |
|---|---|---|---|
| **F1** | **High (security gate bypass)** | `serve-runtime --steps` executed REAL child processes when invoked with `--dry-run` and no `--approve` (gate at CLI:846 passes on dry-run; steps branch hardcoded `approved:true`). Now both `--steps` and `--replay` refuse `--dry-run` explicitly, and `approved` is threaded from the actual flag instead of hardcoded. No assertion weakened; m26 controls unchanged. | R1-1a refusal without execution leak; R1-1b approved-path control still executes |
| **F2** | **High** | `shell` and `sqlite` printed child stdout/stderr (and echoed command/query) **verbatim** — violating the canonical-redactor invariant while serve-runtime redacts the identical case. All five output fields now pass through `redactSecretsDeep`. | R1-2a shell secret absent + REDACTED present; R1-2b sqlite error-surface redaction |
| **F3** | Medium-High | Canonical redactor missed colon-form secrets (`{"password":"hunter2"}`, YAML `password: x`) despite its "strongest-pattern superset" header. Added JSON-aware quoted-key rule (keeps JSON parseable for frame re-parse) + bare `key:value` rule + prefixed/suffixed key names (`access_token`, `x-api-key`). Lookalike keys (`tokenizer=bpe`) survive; legacy `=` form unchanged in spirit; idempotent. | R1-3a/b/c |
| **F4** | Medium | sqlite row-detection string-matched `"SELECT"`: `WITH…SELECT` and `PRAGMA` ran but silently discarded rows; change counts were always 0 (`db.changes` doesn't exist on DatabaseSync). Now leading-keyword detection (select/with/pragma/explain/values/table) routes to `.all()`, writes take `.run()` and report real `changes`. Ceiling documented: multi-statement strings execute first statement only; `INSERT … RETURNING` misclassifies. An intermediate `db.exec` approach was rejected because it trips the phase5-9 no-new-primitives source guard (guard left intact). | R1-4a WITH…SELECT returns rows; R1-4b INSERT reports changes:1 |
| **F5** | Low | `federation status/config` always printed `registryUrl:null` — loader field is `registryBaseUrl`. Both sites corrected; env-set case proven. | R1-5 |
| **F6** | Medium | Nine lazy internal imports resolved via `join(process.cwd(), …)` — the CLI crashed with ERR_MODULE_NOT_FOUND from any other working directory (even `serve-runtime --dry-run`). All sites now resolve relative to `import.meta.url`. | R1-6 doctor from unrelated cwd |
| **F7** | Low (test quality) | m22 federation-route assertion was a tautology (flag compared against recomputation of itself). Strengthened to explicit `wired===true && gated===true && allowlist.length===9`. | m22 (strengthened) |
| **F8** | Low (truth-sync) | Console federation page showed 2 of 9 siblings and claimed "content exchange stays unwired". Sibling list synced to the authoritative closed set; description updated to wired-and-gated reality. | m6 structure tests still green |

**Local green gate on this branch:** `npm ci` ✓ · Node suite **1496/1496** ✓ (1484 prior + 12 new R1 tests) · `cargo build` ✓ · `cargo fmt --check` ✓ · `cargo clippy --workspace --all-targets -- -D warnings` ✓ · `cargo test --workspace` **102/102** ✓.

## 4. Prioritized findings NOT fixed here (what / why / severity / effort / fix / real-vs-cosmetic)

| ID | Finding | Why it matters | Sev | Effort | Suggested fix | Class |
|---|---|---|---|---|---|---|
| U1 | Computer-use action params interpolated raw into container `sh -c` (`computer-use.mjs:241-262`); policy gate never validates numeric/string action fields | Arbitrary command construction inside sandbox defeats action-level policy; contained by `--network none` + ephemeral FS, but defense-in-depth breach | **High** | M | Validate x/y/ms as integers, keys against allowlist regex, pass text base64-encoded and decode inside container | Real |
| U2 | Sandbox image is stock `ubuntu:22.04` with no Xvfb/xdotool/ImageMagick and no Dockerfile builds a capable image; `start()` reports alive while every action would fail; also `containerId` resolves on the `'spawn'` event so it's always the fallback name, and spawn success is reported before docker run exits (`computer-use.mjs:271-284,320-322`) | Feature dead-on-arrival in real mode despite README "M11 ✅ Complete — real spawn" | **High** (feature) | M | Ship sandbox Dockerfile (xvfb/xdotool/imagemagick), pin SANDBOX_IMAGE, resolve on `'close'`, verify exit code | Real + over-claim |
| U3 | Dashboard fetch-failure fallback hardcodes `runtimeEnabled:true, federationWired:true` presented identically to verified posture (`apps/console/src/app/page.jsx:20-27`); internal fetch sends no `x-api-key` so secured deployments ALWAYS hit the fallback; sync `headers()` deprecated in Next 15 | Violates the repo's own "never invent values" rule in the most visible surface | Medium | S | `await headers()`, forward api key, render "unknown" on failure | Real over-claim |
| U4 | `.ardyn-events/events.jsonl` buffer unbounded: read-modify-write append grows forever; each SSE client re-reads whole file every 2 s; wall-clock `since` can skip events | Slow-burn perf/disk + dropped-frame risk | Medium | S | Cap/rotate in `appendEvent`, switch to appendFile, track byte offsets | Real |
| U5 | `EventSource` cannot send `x-api-key` ⇒ with a console API key set, the live feed can never connect (401 → infinite retry) | Live view broken in any secured deployment | Medium | S | Short-lived `?token=` or cookie auth for /api/events | Real |
| U6 | Federation receiver never marks poison messages received (`federation.mjs:288-303,349-363`) ⇒ permanently-invalid envelopes are re-fetched and re-rejected every poll forever | Log noise, wasted sidecar fetches | Medium | M | markReceived-with-rejection for permanent failure classes, or local dead-letter set | Real |
| U7 | Telegram webhook verification computes `HMAC-SHA256(botToken, body)` — real Telegram delivers `X-Telegram-Bot-Api-Secret-Token` header; a genuine webhook would be rejected 100% of the time; no outbound send exists for either Telegram or Slack (nothing POSTs to their APIs, no listener binds) | Adapters are parse/verify scaffolds, not channel integrations; docs should not imply production readiness | Medium (latent) | M | Header-based secret compare; wire delivery or label clearly | Real over-claim |
| U8 | Fixtures page hardcodes wrong counts pointing at nonexistent dirs (`fixtures/page.jsx:4-11`): "Schema Validation 103 → tests/fixtures/schemas" (absent), Source Guards 24 (actual 1 file), Manifests 12 (actual 4 example dirs), Federation 8 (20 files) | Honesty regression in UI | Medium | S | Count via fs at request time (needs browser-render smoke per project convention) | Real numbers, cosmetic UI |
| U9 | `computer-use` live path starts a detached container and never tears down; output advertises `killSwitchAvailable:true` but offers no switch (`apps/cli` computer-use command) | Orphaned containers until manual docker rm | Medium | M | `--kill` subcommand or finally-teardown | Real |
| U10 | Keys-file resolution CWD-relative (`config/secret/federation-keys.json`); running elsewhere silently yields empty sibling keys → every inbound rejected with `unauthenticated_sender`, no hint why; malformed `ARDYN_FABRIC_SIBLING_KEYS` JSON silently becomes `{}` | Fail-closed but silent-misconfig footgun | Low-Med | S | Warn loudly when receiver active with zero keys; anchor path to repo root | Real |
| U11 | Onboarding doc `federation-sibling-onboarding.md:53` documents the pre-fix canonicalization (`sortedTopLevelKeys`) — implementing the doc verbatim fails handshake on any nested field; `fabric-glossary.md:52` says federation not wired into CLI (stale) | Interop hazard for the exact audience the doc targets | Low-Med | S | Update §4 to recursive canonical form; refresh glossary | Doc drift |
| U12 | `tests/m3-data-auth.test.mjs` copy-pastes the entire data-auth implementation (incl. its own weaker redactor) instead of importing it; its green checks prove nothing about shipped code | False confidence; only m16 exercises the real module | Low | M | Delete copies, import `@ardyn/core` | Test hygiene |
| U13 | `user-memory.mjs:43-46` creates an FTS5 table with no writers/readers (search uses LIKE); dead schema + doc over-claim | Confusion; minor maintenance | Low | S | Drop table or add triggers + FTS query path | Real |
| U14 | SDK components unreachable (`exports` map exposes only `"."`), d.ts declares types but zero function signatures; only consumer is its own test | Advertised consumer surface partially unusable | Low | S | Add `./components` export + signatures | Real DX |
| U15 | `loop-state.mjs:152` boundary check keeps a drifted inline regex (misses Bearer/sk-/ghp_) instead of canonical redactor; kernel imports ~11 unused review-shared symbols; empty `DEFAULT_BLOCKED_RUNTIME_COMMANDS` unreachable; `ARDN_CONSOLE_TEST_COUNTS` comment typo (status route); duplicated sibling DID list in console route; gateway counts rejected junk toward messages_total; HiClaw extractEvents runs twice; b2 test helpers sign with old canonicalizer; b2-real-signatures sets `ARDYN_FABRIC_SIBRIC_KEYS` typo env | Small rot items of the same class this repo usually cleans aggressively | Low | S each | Mechanical cleanups | Cosmetic/test hygiene |
| U16 | `shell` spawns `sh -c` unconditionally — feature dead on stock Windows (spawnError path) though repo is Windows-first | Availability gap, graceful failure | Low | S | Platform-appropriate shell or documented POSIX-only | Real |
| U17 | Case-duplicate `docs/ARCHITECTURE.md` + `docs/architecture.md` cannot materialize cleanly on NTFS checkouts — one always shows phantom-modified (observed during this review; PROGRESS notes plumbing was needed to land it) | Every Windows contributor sees a dirty tree forever | Low | S | Collapse to one path | Real (env) |

## 5. Top must-fix list (if you do nothing else)

1. **U1 + U2 — computer-use sandbox**: either make it real (capable image + argv-safe actions) or demote README M11 to "governance scaffold".
2. **U3/U4/U5 — console honesty & live-view trio**: unknown-not-true fallbacks, bounded event buffer, EventSource auth story.
3. **U7 — Telegram/Slack**: implement real verification schemes or relabel as contract scaffolds.
4. **U11 — sibling onboarding canonicalization section**: guaranteed handshake failures for new federations.
5. **Decide the paperwork question**: serialize boundary maps to JSON data + one builder; move review-artifacts out of the runtime package. This single decision deletes ~40k lines of maintenance surface without losing the audit trail.

## 6. Overall health grade

**B− overall** —
- **Security posture: A−.** Deny-by-default everywhere, recursive signing, replay windows, fail-closed credentials, prod auth that is *tested as behavior*, a compiled-in blocked skeleton in Rust, and a frozen public surface with a mutation-proven guard. The one gate bypass found (F1) was inherited from #26 and is fixed here.
- **Correctness: B.** The fixes above close the real ones; ceilings are mostly documented inline.
- **Docs truthfulness: B+.** Dramatically improved across #22–#28; residuals listed (U3, U8, U11, U16-adjacent README framing).
- **Product completeness: C+.** Federation is a hardened client awaiting peers; channels are unwired scaffolds; computer-use can't run actions; console control plane is read-only by design; SDK has no consumers.
- **Maintainability: C.** 1496 passing tests give real confidence, but ~40k lines of self-referential contract paperwork tax every future change (the modularization itself was largely moving paperwork between files).

## 7. Strengths worth keeping

- Behavior-first credibility testing (m21-style): vacuous checks replaced with tamper/flaky-fetch/no-token-no-network proofs; fs-effect rollback assertions.
- Zero-dependency crypto/transport discipline (node:crypto Ed25519 + fetch; ajv-only root; serde/sha2 in Rust) — supply chain near-nil.
- Fail-closed credential handling with named-variable refusals, values never echoed.
- SSRF hardening with receipts: redirect-manual + explicit 3xx rejection, loopback-only sidecar, HTTPS-or-loopback registry, streamed-byte size cap counting actual chunks.
- Honesty culture visible in git history (mockups deleted → real captures; fake `sandboxSpawned:true` fixed to truthful states; stubs labeled stubs).
- Metrics privacy/cardinality rules written into the registry itself; horizontal-scale semantics proven against two shared-DB instances.
