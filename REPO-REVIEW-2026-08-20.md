# Ardynai/ardyn — Full Repo Review (2026-08-20)

**Scope:** complete read-only review at `main` — note: task brief said `0895511`, actual HEAD reviewed is **`b6ff4dc`** ("feat(M20): gated federation A2A handoff exchange…", PR #20 already merged). Everything below is verified against source; docs/PROGRESS.md claims were checked against code. Method: seven parallel review lanes (architecture, security, cost/scale, correctness, tests, docs/product/monetization, bold ideas) + independent spot-verification of every headline claim by the lead reviewer.

**Hard rule compliance:** read-only except this report file.

---

## Executive verdict

Ardyn contains a small, genuinely good product trying to get out of a very large wrapper: ~8–10k lines of real, sometimes excellent engineering (fail-closed approval gates, real Ed25519 federation crypto with Merkle re-verification, per-user SQL isolation, an auditable codec, disciplined metrics cardinality, multi-instance-correct SQLite primitives) buried under **~60k+ lines of self-referential review-only metadata builders**, a console that renders hardcoded numbers as "live data" (three mutually contradictory test counts on one screen), screenshots that are AI-generated mockups rather than the real UI, and documentation that contradicts shipped code on its single most important fact (federation exchange is now wired; README/posture still say "UNWIRED"). The pattern across every lane is identical: **crypto and data-isolation cores are production-grade; orchestration-layer claims routinely outrun the code wherever a boolean gets printed instead of an invariant enforced.** Code-health grade: **C− overall (D+ architecture / C+ security / B− cost-scale / C+ correctness / C+ tests / C− docs-product).**

---

## Prioritized findings

Format: **what / why it matters / severity / effort / fix / real-or-cosmetic / [over-claimed?]**

### Critical

1. **Docs contradict shipped runtime surface: federation exchange is wired but README/posture say UNWIRED.**
   README.md:23,84,122 and posture.md declare content exchange "UNWIRED / NOT wired"; `apps/cli/src/index.mjs` ships `federation send-handoff/receive-handoff` behind `--enable-federation-exchange --approve`, merged via PR #20. posture.md claims to be canonical ("no other file may contradict it") and is contradicted by five files. / Trust: any integrator or auditor reading the floor docs will believe the A2A path is inert. It is not. / **High / S / one-pass truth sync of README + posture + CONTRIBUTING + DECISIONS + SECURITY to post-M20 reality. / REAL. [OVER-CLAIMED in the dangerous direction.]**

2. **Ed25519 signature does not cover nested envelope fields.**
   `canonicalSignedPayload` (federation.mjs:959–962, duplicated handoff.mjs:74–77) uses `JSON.stringify(rest, Object.keys(rest).sort())` — an array replacer filters keys at **every** nesting level, so any nested object contributes nothing to signed bytes unless its keys collide with top-level names. Today's envelopes are flat (payload rides top-level as a GL1 string), impact latent; the moment anyone nests context, tampering stops breaking verification. Also two drifting copies with no cross-module pinning test. / Silent loss of integrity guarantee. / **High / M / recursive canonicalization (sorted keys at all depths — the GL1 codec's `sortValue` already does this); pin both copies with a test. / REAL (latent).**

3. **Federation receiver dies silently after one transient error.**
   `startFabricFederationReceiver` (federation.mjs:192–208): the rescheduling `setTimeout` sits inside `tick()` *after* both awaits; any throw propagates before scheduling and `.catch(() => undefined)` swallows it → receive loop permanently dead, zero output. First-tick failure also leaves `handoff-cli.mjs` holding a zombie process (never calls `stop()`, keeps SIGINT handler). / Availability of the only live receive path. / **High / S / move reschedule into `try/finally`; log swallowed errors; stop receiver on ready-failure. / REAL.**

### High

4. **Console "live data" is fake, with three contradictory test counts on one screen.**
   api/status/route.js:15 hardcodes `totalTests/passingTests: 1270` under a "live data" comment; page.jsx:13 fallback = **1364**; layout.jsx:96 footer = **"1364 tests green"**; README badge = 1367; actual = **1447**. The dashboard's live-fetch path (`fetch("/api/status")` relative URL in an RSC) throws → fallback always renders. "Live SSE event feed" is fake UI — `EventSource` appears nowhere client-side. Screenshots in README are AI-generated mockups with garbled text, not captures. / Credibility: nobody adopts a harness whose own dashboard lies to itself. / **High / M / wire routes to real numbers, absolute fetch URL, real EventSource client, reshoot screenshots from the running app. / REAL + OVER-CLAIMED.**

5. **Gateway "deny-by-default unknown senders" is auto-registration plus dead magic-string logic — and its test asserts a tautology.**
   gateway.mjs:181–190 registers *every* signature-valid sender on first contact; the sole deny branch requires the magic pair `platformUserId==="unknown-user" && signature==="invalid"` which is unreachable after the earlier invalid-signature return; m13-gateway.test feeds exactly those magic strings, so its "denies unknown senders by default" assertion passes vacuously. / A claimed admission control does not exist. / **High / S / implement a real allowlist policy for senders; rewrite the test with a non-magic stranger. / REAL + OVER-CLAIMED.**

6. **Gateway rate limiter has no time window — a lifetime ban masquerading as rate limiting.**
   gateway.mjs:240–249 increments `userRequestCounts` forever with no resetAt (the sibling data-auth limiter rolls windows correctly — unused here); four Maps/Sets grow without eviction (`userMap`, `userRequestCounts`, `knownUsers`, module-level caches). Day-one deployment = user #101 locked out permanently until restart. / Correctness failure framed as a control. / **High / S / reuse data-auth's `{count,resetAt}` shape + sweep expired entries. / REAL (its own ponytail comment under-acknowledges).**

7. **CLI computer-use reports `sandboxSpawned: true` for a session it never started.**
   apps/cli/src/index.mjs computer-use live path creates `createSandboxSession({dryRun:false})`, never calls `start()`, then prints `sandboxSpawned:true` + approved gate status; `alive` getter returns true pre-start when `approved` is undefined. Related: `killSwitchActivated:false`, audit shown empty. / The flagship "governed sandbox" demo output misstates reality. / **High / S / call start() (or print honest `started:false`) and derive fields from session state. / REAL + OVER-CLAIMED.**

8. **Unredacted stdout frames flow into transcripts, SSE, and the events file.**
   Only stderr is masked (weak copy: token=/Bearer only, missing `sk-`/`ghp_` patterns the pipeline redactor has). stdout_frame events are recorded verbatim (index.mjs:987–1030) and stream verbatim through `/api/events`. Combined with dev-open console auth (finding 9) this is a secret-exfil channel. / Direct secret leak path. / **High / S / route stdout frames through the strongest redactor; unify redaction (4 drifting copies today — see finding 20). / REAL.**

9. **Console auth: fail-closed-in-prod is real but untested; dev-open default + plain `===` compares + decorative login.**
   auth.js prod check exists (auth.js:10–12) but the only "test" greps for the word `checkAuth`; API key/user-token compared non-timing-safe; `api/login` issues predictable tokens to anyone with no credential check and no registration anywhere; health+login are the only unauthenticated routes besides everything in dev-open mode. / Misleading auth theater on an HTTP trust boundary. / **High / M / behavioral route tests (none exist for all 8 routes), timing-safe compare, delete or implement login. / REAL; "fail-closed" claim itself is accurate.**

10. **Sandbox teardown can crash the process; kill success never verified.**
    computer-use.mjs kill()/end() fire `_spawn("docker",…)` fire-and-forget: `try{}catch{}` catches sync throw only, **no `'error'` listener** → ENOENT (docker missing) crashes Node during kill-switch/teardown; docker failures swallowed entirely → orphaned live container while audit says `kill_switch_activated`. Also `spawnAndWait` resolves on first `'spawn'` event so containerId capture races stdout. / Reliability of the safety mechanism. / **High / S / attach `.on("error",()=>{})`, await + verify exit codes, resolve on close. / REAL.**

11. **GLOSSOPETRAE covert-char scanner has a real stego hole.**
    COVERT_CHAR_RE misses variation selectors U+FE00–FE0F, bidi isolates U+2066–2069, tag chars U+E0000–E007F — all canonical-stable, pass re-encode equality, reach handlers intact. Violates the §2 auditable-codec floor while the doc-level claim ("rejects covert channels") is test-backed only for implemented classes. / Working stego channel inside the auditable-codec invariant. / **High / S / extend regex + add mutation fuzzer (see bold idea #10). / REAL.**

12. **HiClaw outbound bypasses the deny-by-default room registry.**
    hiclaw-matrix.mjs resolveTarget accepts any `{roomId}` object or raw `!roomId` string without checking `byRoomId` — only worker-name targets hit the allowlist; error text implies restriction that isn't enforced. Enables posting to arbitrary rooms with the bot token. / Asymmetric with the strict inbound floor. / **Medium-High / S / require registry membership for all target forms. / REAL.**

13. **handoff-cli sends literal `Bearer unset` when env tokens are missing.**
    handoff-cli.mjs:37–38 `?? "unset"` defeats the fail-closed `requireText` design everywhere else; failures surface as confusing remote 401s instead of local config refusal. / Fail-open config on a live surface. / **Medium / S / omit Authorization or refuse locally. / REAL.**

14. **`minimalManifestPath` ReferenceError on valid invocations.**
    index.mjs:1238,1280 use an identifier defined nowhere; `shell`/`sqlite` without `--manifest` crash with "minimalManifestPath is not defined" (accidentally fail-closed). Usage string omits `--manifest` for those commands. Plus dead refs: empty `DEFAULT_BLOCKED_RUNTIME_COMMANDS` Set feeding a source-grep test; dead `manifestPath` assignments. / Polish/trust; brittle-by-design guard coupling. / **Medium / S / define or remove. / REAL.**

15. **Slack webhook replay window infinite; safeCompare throws on undefined.**
    gateway.mjs Slack verify ignores timestamp freshness entirely (Telegram n/a); `safeCompare(undefined,…)` throws TypeError→500 instead of denying. / Standard webhook hardening absent. / **Medium / S / enforce `<5min` skew; null-guard. / REAL.**

16. **Identity-file confinement misses Windows absolute paths.**
    federation.mjs absoluteness test is `startsWith("/")` only; base-dir `"."` branch accepts drive-letter paths on win32 (repo runs Windows-first). Env-gated feature. / Containment hole on the primary dev OS. / **Medium / S / reject `/^[A-Za-z]:[\\/]/` (regex already exists in report-phase-status.mjs). / REAL.**

17. **loop-state lazy INSERT race + no busy_timeout.**
    loop-state.mjs spendQuota/checkQuota plain `INSERT` (not OR IGNORE) → second cold instance throws PK violation; createLoopStateDatabase sets no busy_timeout (data-auth does). UPDATE core is genuinely atomic. Negative `amount` reduces spent (quota bypass); releaseTodo lacks ownership param. / Multi-instance edge crashes. / **Medium / S / INSERT OR IGNORE + busy_timeout + amount>0 assert. / REAL.**

18. **Metrics counter minting before validation (latent cardinality faucet).**
    gateway.mjs increments `platform`-labeled counter before adapter lookup — attacker-controlled junk strings become permanent series once wired to raw HTTP. Otherwise metrics discipline is exemplary (hashed user ids, scrape-time gauge provider, bounded labels). / Latent DoS-ish cardinality growth. / **Low-Medium / S / normalize label against adapter keyset. / REAL (latent).**

19. **provider-adapter streams leak readers and ignore cancellation.**
    No try/finally `reader.cancel()` on early break; no AbortSignal accepted anywhere (paid connections hang); SSE multi-line `data:` frames not joined; missing final decoder flush. hiclaw sync has no backoff (fast-fail → hot spin when wired) and calls extractEvents twice per poll. / $-shaped resource leaks. / **Medium / S-M / finally-cancel + signal threading + backoff. / REAL.**

### Medium / structural

20. **Redaction duplicated 4× with divergent strength** (index.mjs internal strong version; data-auth 2-regex; CLI verbatim copy of the weak one; processor-pipeline superset). serve-runtime gets weaker masking than computer-use. Canonical `internal/redaction.mjs`, delete copies. **High-value, S.**
21. **Modularization over-claimed**: internal/utils.mjs=33 lines (barrel), validation.js=23 (re-export), create-review-helpers.js=74 (re-export); undisclosed barrels too; monolith intact at **69,080 lines / 427 exports** (README says 73k/DECISIONS says 422 — stale three ways). Real extraction remains open debt. **Medium, L.**
22. **cwd-relative deep imports bypass package boundaries** (cli → `join(process.cwd(),"packages/...")`; handoff-cli likewise incl. core/data-auth). Breaks installed/other-cwd usage; bypasses exports maps. **Medium, S-M.**
23. **packages/gateway has no package.json** → outside workspace protocol despite root `workspaces:["packages/*"]`; consumed by tests via relative paths. *(Correction to lane report: it is NOT orphaned/dead — tests import it directly — but packaging hygiene gap stands.)* **Medium, S.**
24. **SDK is the weakest package yet the only publishable-looking one**: 4 functions, naive loadManifest (string check, no ajv), `.d.ts` present but no `types` export condition, React components unreachable (no components export, no peerDep, zero CSS), contracts registry paths unresolvable from package. Stranger-integrator readiness: no. **Medium, M.**
25. **sanitizeQuery is security theater and dead code** (prefix blacklist allowing INSERT/UPDATE/DELETE; zero production callers — sqlite command takes raw SQL under --approve by design). data-auth.mjs also ships 11 inline node:test blocks in src. **Low-Medium, S.**
26. **Transcript persistence/replay + failureAudit rollback flags are CLAIMED-ONLY**: `transcriptPath:null`, events echo-once, `replayEnabled/rollbackOnFailure` booleans printed with no machinery behind them. **Medium honesty debt, M to build or remove from output.**
27. **Per-session sandbox token secures nothing**: generated, injected as env var, never verified by any container-API client (which doesn't exist). Comment claims "required for all container API calls." **Medium, M (build verification or drop the claim).**
28. **event-buffer O(file²)**: appendEvent rewrites whole file per event (currently dead code — CLI appends directly), readEvents parses whole file per 2s-per-client poll, never truncated; SSE lastRead timestamp set after await → permanent event-skip window; no cancel handler. **Medium, S-M.**
29. **Monolith import tax measured**: ~125 ms warm parse × ~3k subprocess spawns per suite run ≈ half the serial budget; `NODE_COMPILE_CACHE` unset anywhere. **Medium, S (cache) / L (real split).**
30. **Digest guards amplify change**: 76 files import assertUnchanged; ~25 re-pin the same Rust files; legit dependency bumps break ~15 tests at once. Consolidate to one dedicated guard file. **Low-Medium, S.**
31. **Suite composition over-claimed as quality signal**: ~50% behavioral (m-era ≈75%, phase5 ≈30%); fixture↔generator deepEqual is circular; report-phase-status.test.mjs alone is 33,871 lines. Loose `/REDACTED|masked|\*\*\*/i` assertions (worst: m1-runtime-execution:83) accept any masking including wrong implementations. Zero skipped/todo tests though — genuine green, no skip-rot. **Medium, ongoing.**
32. **Zero behavioral coverage on console API routes (all 8)** — the HTTP trust boundaries; also CLI parser edges (NaN `--kill-after-ms abc`→silent 0, naive space-split breaking quoted `--command`), `--stream` wire format untested. **High-priority coverage gap, M.**
33. **Secrets invariant has NO enforcing test** (only invariant of the floor without one): nothing walks tracked files for token patterns or asserts config/secret/ untracked. One small scanner test closes it. **Medium-High, S.**
34. **sqlite-temp EBUSY helper sound but rollout incomplete**: m16 opens 7 DBs raw (inline close inside try — assertion throw reproduces original bug), m19 carries an ad-hoc copy; helper leaks dir if openDatabase throws. **Low-Medium, S.**
35. **Rust host mirrors the metadata disease at smaller scale** (≈8.3k LOC, mostly blocked-status scaffolding; honest inertness tests), Node↔Rust seam spawns `target/debug/session` by relative path and loosely `JSON.parse`s stdout (silently degrades to rustStatus:"unknown"). Fake `"frame-N"` timestamps; O(n²) cumulative-buffer planning; malformed lines silently dropped. **Low-Medium, M.**
36. **Docs sprawl**: 170 .md under docs/, 111 phase docs at root, no index; Node-version stated three ways; DECISIONS numbers stale. **Low, S.**
37. **Onboarding doc incomplete for source-free interop**: GL1 token dictionary (onset/vowel/tail tables), checksum derivation, descriptor pieceSize rules all absent — a sibling cannot implement without reading Ardyn source. **Medium, S.**
38. **Console login issues fake tokens to anyone** (predictable `token-${username}-${Date.now()}`, registered nowhere) — decorative-but-deceptive auth surface, no rate limit. **Medium, S (delete or implement).**

---

## Ranked table (impact ÷ effort)

| # | Fix | Impact | Effort | Ratio |
|---|-----|--------|--------|-------|
| 1 | Truth-sync README/posture/CONTRIBUTING/DECISIONS/SECURITY to post-M20 reality | 5 | S | ★★★★★ |
| 2 | Unify redaction into one internal module; redact stdout frames | 5 | S | ★★★★★ |
| 3 | Gateway sender allowlist done for real (+ rewrite vacuous test) | 5 | S | ★★★★★ |
| 4 | Gateway limiter: windowed reset + eviction | 4 | S | ★★★★★ |
| 5 | Recursive canonical signing + pin test across both copies | 5 | M | ★★★★ |
| 6 | Receiver reschedule in finally + logging; stop zombie on ready-failure | 4 | S | ★★★★ |
| 7 | Console: real numbers, absolute fetch, real EventSource, reshoot screenshots | 4 | M | ★★★★ |
| 8 | HiClaw outbound room allowlist enforcement | 3 | S | ★★★★ |
| 9 | Sandbox teardown: 'error' listeners + verified kills; honest CLI computer-use output | 4 | S | ★★★★ |
| 10 | Secrets-scanner invariant test (tracked-tree token sweep) | 4 | S | ★★★★ |
| 11 | GL1 covert-char regex extension + differential fuzzer | 4 | S | ★★★☆ |
| 12 | Behavioral console API route tests (8 routes incl. auth fail-closed) | 4 | M | ★★★☆ |
| 13 | minimalManifestPath + dead-ref cleanup | 2 | S | ★★★☆ |
| 14 | Bearer-unset fail-open fix; identity-file Windows abs-path rejection; Slack replay window | 3 | S | ★★★☆ |
| 15 | Onboarding doc: embed GL1 dictionary/checksum/descriptor spec | 3 | S | ★★★☆ |
| 16 | NODE_COMPILE_CACHE in CI; stop installing console in test jobs | 3 | S | ★★★☆ |
| 17 | Provider stream reader.cancel/finally + AbortSignal threading | 3 | S-M | ★★★ |
| 18 | Digest guards consolidated to one file | 2 | S | ★★★ |
| 19 | loop-state INSERT OR IGNORE + busy_timeout + amount>0 | 2 | S | ★★★ |
| 20 | Metrics label normalization before increment | 2 | S | ★★☆ |

## Top 10 must-fix

1. Truth-sync all posture docs to post-M20 reality (federation IS wired).
2. Single canonical redactor; apply to stdout frames end-to-end.
3. Gateway sender allowlist implemented for real; vacuous m13 test replaced.
4. Windowed, evicting gateway rate limiter.
5. Recursive canonical JSON for signatures; pin test across federation.mjs/handoff.mjs.
6. Federation receiver self-healing loop (finally-reschedule + logs).
7. Console truth pass: real metrics, working live path, real screenshots.
8. HiClaw outbound restricted to registry rooms.
9. Honest CLI computer-use output + crash-proof sandbox teardown.
10. Secrets-scanner test added to the invariant floor; console API route tests (behavioral).

## Over-claimed / not-actually-done list

- **README/posture: "content exchange UNWIRED"** — false since PR #20 (send/receive wired behind gates).
- **gateway "deny-by-default unknown senders"** — auto-register + dead magic-string branch; m13 test tautological.
- **CLI computer-use `sandboxSpawned:true`** — session never started; `alive` true pre-start.
- **`transcriptPath` persistence / `replayEnabled` / `rollbackOnFailure`** — printed flags with no machinery.
- **Per-session sandbox token "required for all container API calls"** — no container API client exists; token never verified.
- **Console "live data" / "Live SSE event feed"** — hardcoded values; EventSource appears only as literal text; screenshots are AI mockups with garbled text.
- **"absent-input rejection"** (phase builders) — shape/grant-field rejection is real; absence-of-evidence defaults to acceptance-shaped fabricated records (by design, but over-claimed as rejection).
- **"13 CLI commands" / "73k-line monolith" / "101 Rust tests" / badge counts** — stale drift (14 commands; 69,080 lines; 81 `#[test]` attrs found; 1447 actual vs 1270/1364/1367 displayed).
- **"modularization" modules** — barrels/re-exports, not extractions.
- **SDK consumability** — types/components not reachable via exports; would fail for any stranger.
- **Corrected lane claims (in review's favor):** packages/gateway is NOT dead code (tests import it); O(phases²) edit-coupling is FALSE (linear-with-hotspots); gateway userMap/metrics-singleton "races" rebutted; GLOSSOPETRAE codec survived adversarial edge probes; Rust side has no JSON-input surface to misuse.

## Per-lane summaries

1. **Architecture & code quality — D+.** ~64k of 69k lines in core/index.mjs are review-only artifact builders; "modules" are barrels; boundaries bypassed via cwd-relative imports; redaction 4×; sdk weakest-yet-publishable; Rust host repeats the metadata pattern at 8k lines; console static. Embedded cores (ajv validators, diagnostic redaction engine, processor pipeline, federation client) are good.
2. **Security & abuse-resistance — C+.** Crypto/isolation floors real and behaviorally tested (Ed25519 fail-closed, Merkle re-verify before handler, streamed cap, SQL-level per-user scoping, BEGIN IMMEDIATE limiter, HiClaw inbound allowlists + token hygiene, record-before-act with fallback). Claims outrun code at the orchestration layer (findings 5,7,8,26,27,38) plus concrete holes: nested-field signing (2), stego char classes (11), outbound room bypass (12), Bearer-unset (13), Slack replay (15), Windows path confinement (16), stdout exfil chain via open console (8+9). Best attacks: open-console telemetry w/ unredacted stdout; registry-mediated recipient confusion via OR'd recipient check; sandbox-internal command substitution beyond declared semantics + unverified kills.
3. **Cost & scale — B−.** CI runs everything twice on two OSes; suite wall-clock 35s despite 1447 tests; horizontal-scale primitives real and two-instance-tested; metrics cardinality disciplined. Costs: monolith import tax (~125ms × ~3k spawns/run), lifetime-cap limiter, unevicted maps/tables (no prune paths, sessions never closed → active-sessions gauge drifts), O(file²) event buffer, accretion compounding in one 34k-line test file + shared probe arrays.
4. **Correctness & latent bugs — C+.** Confirmed Highs: silent-death receiver loop, nested-field signature hole, teardown crash path; confirmed mediums: stdin-less payload edge, SSE event-loss window, canned-data contradictions, hiclaw outbound bypass, INSERT race. Rebutted several briefed leads (userMap race, metrics bleed, codec fragility, Rust JSON handling) — codec is solid within implemented classes.
5. **Tests & verification — C+.** ~50% behavioral overall (m-era exemplary — m15/m19/m20 A- grade; phase5 metadata-pinning drags). Digest guards: defensible tripwire for 2 runtime files, change-amplification at 76 call sites. Security-invariant matrix: all enforced except secrets-committed (gap) and behavioral console-auth. EBUSY fix sound, rollout incomplete (m16/m19 raw). Weakened-to-green is rare; brittleness lives in fixture pinning instead. Zero coverage: console routes, CLI arg edges, --stream format.
6. **Docs, product & monetization — C−.** Quickstart honest and reproducible; SECURITY-INVARIANTS best governance artifact; onboarding doc strong but not source-free-complete (GL1 dictionary/checksum/descriptor spec missing). README/posture contradictions systemic post-M20; screenshots synthetic; SDK not consumable; npm publishing absent. Product = governance layer + audit plane under agent fleets (not another agent framework). Monetization ranking: (1) verifiable-audit compliance tier (open-core), (2) managed federation hub, (3) hosted control-plane/computer-use, (4) enterprise adapters, (5) dual-license later. Precondition: credibility repair.
7. **Bold net-new ideas (top of 12):** (a) **Policy simulator + dry-run diffs** — evaluateAction decision-mode makes this glue-cheap and daily-useful; (b) **Merkle-notarized audit exports** (→ hash-chained ledger) — converts existing record-before-act + Ed25519 + Merkle assets into an externally verifiable compliance artifact; (c) **Adapter SDK + conformance suite** — three adapters already share one interface; make third parties target it; plus capability-escrowed envelopes (least-privilege inside signed handoffs), handoff reputation ledger from structured rejection codes, GL1 differential fuzzer, GitHub Action running ardyn offline gates in strangers' CI.

## Overall code-health grade

**C−** (architecture D+, security C+, cost/scale B−, correctness C+, tests C+, docs/product C−). The floor is real and mostly test-enforced; the claims layer is not yet trustworthy; the mass is scaffolding.

## Finished-product simulation — experienced AI-harness integrator, day one

*"I clone, `npm ci`, run the quickstart — doctor/capabilities/federation status work, tests green in ~30s. Impressive discipline. I wire my model key into the provider adapter — clean. I try the console: pretty shell, but the dashboard tells me 1,364 tests while the badge said 1,367 and the status route says 1,270; the 'live' feed doesn't update; two buttons do nothing. I read SECURITY-INVARIANTS (good!) then README says federation is unwired — but the CLI just listed send-handoff. Which is true? I try Telegram webhooks: fine. I ask about shipping this: there's no published package, no changelog, SDK types don't resolve, onboarding assumes I'll read their source for the codec alphabet. Verdict: promising governance plane, not integrable today."*

Grades: **Safety B+** · **Functionality C+** (runtime/computer-use/memory/A2A real but young) · **Contract clarity C−** (docs contradict code) · **Docs C−** · **Maintainability D+** · **Overall C.** Missing for product: truth-synced docs, published packages + changelog, real console data, behavioral route tests, sibling conformance kit, eval/benchmark story, second maintainer.

## Single highest-leverage recommendation

**Run the credibility pass before any feature:** one PR that (a) truth-syncs README/posture/CONTRIBUTING/DECISIONS/SECURITY/PROGRESS to post-M20 reality, (b) replaces console mockups with the real numbers and real screenshots, (c) lands the four S-effort correctness fixes (redactor unification + stdout redaction, gateway allowlist + windowed limiter, receiver finally-loop, recursive canonical signing). Together ≈2–3 days of work; it converts the repo's genuine differentiator — *enforcement you can verify* — into something every reader can trust within ten minutes of cloning, which is precisely what the current claims-layer undermines. Nothing else in this report matters if the docs keep lying about the code.

*Review complete. STOP.*
