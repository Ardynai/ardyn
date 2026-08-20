# ARDYN — Hermes Agent Prompt Queue v2 (GLM 5.2) — lead planner: Fable 5, 2026-07-06

**v2 supersedes v1.** Reason: PR #4 "Connect Fabric federation sidecar client" merged Jul 5 (after the Jul 2 review), adding a live but unwired Fabric federation consumer client. Josh confirmed it is **authorized**. So: new baseline `6585ddf98b347084a7d2dcf245f376db2447b5fe`; the global posture gains a carve-out; the old 5.76A doc-hotfix is folded into a new **Phase 5.76B — Fabric federation reconciliation** that runs first; downstream prompts get small patches (CI hermetic guardrail; 5.83 reframed to test federation invariants instead of banning fabric).

Baseline: `main` @ `6585ddf98b347084a7d2dcf245f376db2447b5fe`, local == origin. Onboarding (Prompt 0) already ran green (1076 JS + 98 Rust tests). Two housekeeping items to clear at the top of the next session: set `git config user.name/email` to `Ardynai` / `admin@multiverseos.net` (matches history); `git checkout -- .cursor/rules/ponytail.mdc .gitignore` to drop the CRLF-only dirty state so `git diff --check` passes.

## THE POSTURE, RESTATED (use this framing in every prompt)

Ardyn is **review-only metadata for every runtime surface, with exactly ONE authorized exception**: the Fabric Federation consumer client at `packages/fabric/src/federation.mjs` (PR #4). That client is: out-of-process; talks to the `fabric-transport-d` sidecar over **loopback HTTP** and the Multiverse registry over authenticated HTTPS; **present but NOT wired into the CLI or the Rust host**; consumes, does not rebuild (no `@multiverse/fabric-core` import, no DHT/swarm/P2P, no reimplemented transport); does **not** decrypt Secure Drop ciphertext (carries it only); reads tokens/DID from env + gitignored `config/secret/`. **Everything else stays blocked**: serve-runtime, evaluator, approvals, process control, CLI/host runtime, DB/SQLite, shell, Matrix, CUA, Secure Drop crypto, Code Mode, and wiring federation into any command. No NEW runtime surface is opened by any prompt in this queue.

## Order and gates

0. **P0** — DONE (onboarding/tooling/baseline green).
1. **5.76B** — Fabric federation reconciliation (folds in old 5.76A) — **PR + STOP; Jules recommended (posture change), Josh may waive**
2. **5.77** — Code Mode orchestration boundary map
3. **5.78** — CI enforcement contract (review-only)
4. **5.79** — CI enablement — **JULES GATE (PR + STOP)**
5. **5.80** — report-script compaction (byte-identical)
6. **5.81** — report-test compaction + suite performance
7. **5.82** — source-guard hardening + shared test helpers
8. **5.83** — external-reference policy + dependency allowlist (now also formalizes federation invariants) — **JULES GATE (PR + STOP)**

## Workflow (unchanged from v1)

`hermes/phase-*` branches; one read-only reviewer subagent per slice (labeled self-review fallback); Windows/PowerShell-safe commands; scratch only under `C:\AI\hermes-scratch\ardyn\` (never committed); GITHUB_TOKEN never printed/persisted (reference only as `[Environment]::GetEnvironmentVariable('GITHUB_TOKEN','User')`); Jules gates = push branch, open PR, STOP — Fable drives Jules + merge. Standard REPORT-BACK format: PHASE / BRANCH+SHA (or PR URL) / FILES CHANGED / TESTS before→after / VALIDATION / REVIEWER disposition / REFS / NOTES-DEVIATIONS.

---

## PROMPT 1 — Phase 5.76B — Fabric federation reconciliation (folds in old 5.76A) — PR + STOP

```
You are the Hermes agent (GLM 5.2), implementation orchestrator for Ardynai/ardyn (local: C:\Users\Josh\Documents\ardyn). Prompt 0 onboarding is complete.
Flow: inspect → plan → implement → verify. SCOPE LOCK: posture/docs/metadata reconciliation + one new forward boundary record; do NOT wire federation into anything, do NOT edit federation.mjs behavior, do NOT edit historical phase fixtures.

HOUSEKEEPING (do first, once):
- git config user.name "Ardynai" ; git config user.email "admin@multiverseos.net" (matches history; confirm with git log).
- git checkout -- .cursor/rules/ponytail.mdc .gitignore  (drops CRLF-only dirty state). Then git status --porcelain must be empty and git diff --check must pass.
- git fetch; confirm HEAD == local main == origin/main == 6585ddf98b347084a7d2dcf245f376db2447b5fe. Abort/report if not.

CONTEXT — WHY THIS PHASE EXISTS
- PR #4 (merged Jul 5, AUTHORIZED by Josh) added packages/fabric/src/federation.mjs: a live, out-of-process Fabric Federation consumer client (globalThis.fetch → fabric-transport-d sidecar over loopback + Multiverse registry over authenticated HTTPS; bearer tokens + DID from env / gitignored config/secret; closed sibling-DID allowlist; receive-side Fabric CA contentId re-verification). It is present but NOT imported by the CLI or the Rust host, adds NO dependencies (node stdlib only), does NOT import @multiverse/fabric-core, does NOT join a DHT/swarm/P2P, and does NOT decrypt Secure Drop ciphertext.
- Problem this phase fixes: the repo's CURRENT advertised posture still says the opposite. Specifically the report's current executionPosture string (Phase 5.76) contains the tokens "metadata-only review-only ... no-fabric-transport-sidecar" — and "no-fabric-transport-sidecar" is now FALSE. The repo is internally contradictory. This phase makes the metadata tell the truth WITHOUT reopening any other runtime surface and WITHOUT rewriting immutable historical evidence.
- This is a SIDE phase (5.38A/5.44A precedent). It does NOT change the chain's recommendedNextPhase target, which stays phase-5.77 code-mode. Follow the EXACT side-phase precedent for how the report surfaces a side phase (inspect how 5.44A appears in scripts/report-phase-status.mjs and tests/report-phase-status.test.mjs before deciding how 5.76B appears).

INSPECT FIRST (enumerate before editing; put the list in your plan)
1. Find every CURRENT (not historical-per-phase) posture claim that is now false. Start with: the executionPosture string source (report script header and/or the latest phase fixture it derives from), README posture lines, docs/architecture.md, CONTRIBUTING, docs/how-it-works/fabric.md and fabric-connect.md, docs/content-fabric.md. rg for: "no-fabric-transport-sidecar", "metadata-only", "review-only", "runtime-blocked", "runtime-disabled", "future-consumer", "producer_ready_consumer_pending".
2. Distinguish CURRENT posture (must be corrected) from HISTORICAL per-phase records (immutable — leave alone; e.g. phase558/559 flags, the 5.75 fixture). If a claim is a per-phase historical flag, do NOT edit it; supersede it with a forward pointer instead.
3. Confirm federation is unwired: rg "federation" in apps/cli/src and crates/ardyn-host/src returns nothing. Record this as an asserted invariant.

TASK
A. Posture carve-out convention (the core change). Create docs/posture.md as the single canonical current-posture statement using THE POSTURE, RESTATED framing: review-only metadata for all surfaces EXCEPT the authorized Fabric Federation consumer client (out-of-process, loopback-only, unwired, consume-not-rebuild, no fabric-core import, no P2P, no Secure Drop decrypt, secrets via env/config/secret). State that all future phases inherit this carve-out and must not re-assert blanket "no fabric transport sidecar". Add the rule to CONTRIBUTING: the current posture lives in docs/posture.md; no other file may contradict it.
B. Fix the CURRENT executionPosture string so it no longer claims "no-fabric-transport-sidecar" or blanket "metadata-only/review-only/runtime-disabled". Replace with tokens that are TRUE, e.g. "...review-only-metadata-except-authorized-fabric-federation-consumer fabric-federation-client-present-unwired loopback-sidecar-only no-fabric-core-import no-dht-swarm-p2p no-secure-drop-decrypt no-cli-host-wiring...". Keep every still-true "no-*" token. Change ONLY the current posture source, not historical strings.
C. Add the forward boundary record Phase 5.76B per the standard pattern (doc docs/phase-5-76b-fabric-federation-reconciliation.md + fixture tests/fixtures/host-policy/phase5-76b/... + core create*ForReview helper + focused test + report wiring). The fixture records fabric federation as an ACTIVE consumer surface (not "blocked") with its constraints as asserted, test-checkable invariants:
   fabricFederationClientPresent: true, wiredIntoCli: false, wiredIntoHost: false, outOfProcess: true, sidecarLoopbackEnforced: true, registryRequiresHttpsWhenRemote: true, importsFabricCore: false, joinsDhtSwarmP2p: false, reimplementsTransport: false, decryptsSecureDropCiphertext: false, addsRuntimeDependency: false, secretsCommittedToRepo: false, closedSiblingDidAllowlist: true, receiveSideContentIdReverified: true, authorizedBy: "PR#4", authorizationDate: "2026-07-05".
   Cross-reference (forward supersession pointers, do NOT edit the originals): the 5.59 "FabricRuntimeImplementedByArdyn: false" framing (clarify: Ardyn implements a CLIENT, not the transport), the 5.75 "producer_ready_consumer_pending" status (now "consumer-client-present-unwired"), and docs/content-fabric.md.
D. Fold in the old 5.76A doc fix: amend docs/content-fabric.md to remove the BitTorrent/torrent/seeding items from "Remaining Runtime Requirements" (replace with the fabric-core/sidecar supersession note + P2P permanently out of scope), relabel legacy infohash/magnet/webseed validation as "legacy Content Fabric v1.0.0 byte-conformance only", and replace machine-local C:\ paths with repo-relative references. Add docs/fabric-glossary.md distinguishing the now-FIVE concrete fabric things: (1) legacy Content Fabric v1.0.0 byte-conformance (packages/fabric index), (2) 5.59 coordination envelope, (3) @multiverse/fabric-core transport (producer: Multiverse; Ardyn does NOT import it), (4) the content-fabric repo family (Secure Drop owner), (5) the NEW packages/fabric/src/federation.mjs consumer client (PR #4). Link from content-fabric.md.
E. Focused test asserts: the new fixture's invariants; that federation is not imported by CLI/host (grep-based, using an escaped pattern); that federation.mjs imports no @multiverse/fabric-core; that package.json/Cargo added no deps; plus the standard rejection cases (malformed, unknown field, reportRunsChecks:true, an input that tries to flip an invariant like wiredIntoCli:true → rejected).

MUST NOT
- Do NOT wire federation into the CLI or host (staying unwired is part of the authorized posture). Do NOT change federation.mjs behavior. Do NOT edit historical phase fixtures/docs (5.59, 5.75, etc.) — supersede via forward pointer only. No new dependencies. No new runtime surface. No recommendedNextPhase change (stays 5.77). Never print/persist the token. No force-push/history rewrite.

VALIDATION (all must pass locally before the PR)
- Focused 5.76B tests + any tests touched + tests/host-policy-preconditions.test.mjs + tests/fabric.test.mjs + tests/report-phase-status.test.mjs
- npm test ; npm run test:schemas ; npm run report:phase-status (verify the current executionPosture no longer says no-fabric-transport-sidecar and reportRunsChecks stays false)
- cargo fmt --check ; cargo check --workspace ; cargo clippy --workspace -- -D warnings ; cargo test --workspace
- git diff --check ; semgrep --config auto . (0) ; npm audit (0) ; cargo audit ; cargo machete

REVIEW & LANDING — SOFT JULES GATE
- One read-only reviewer subagent first (instruct it: confirm no historical fixture was edited, and that the new posture string contains only true tokens).
- Then push hermes/phase-5-76b-fabric-federation-reconciliation, open a PR titled "Phase 5.76B — Fabric federation reconciliation", body = the contradiction found + how the current posture was corrected + the new invariants. STOP (do not merge). This phase changes the global safety posture, so Jules review is recommended; Fable will decide with Josh whether to run Jules or merge directly.
- REPORT BACK in standard format + the PR URL + the exact before/after of the executionPosture string.
```

---

## PROMPT 2 — Phase 5.77 — Code Mode orchestration contract boundary map

Identical to v1 Prompt 2, with these edits:
- Posture line: use THE POSTURE, RESTATED framing (review-only metadata EXCEPT the authorized fabric federation consumer client). Parent phase is now 5.76B (or 5.76 if 5.76B is still in PR — either is a valid parent, but prefer building on merged 5.76B).
- Family 12 `code_mode_blocked_runtime_list`: when it lists blocked surfaces, do NOT re-assert a blanket "no fabric transport sidecar" — instead reference docs/posture.md's carve-out (fabric federation is the one authorized surface; Code Mode still may not invoke it). 
- Add to MUST NOT: "Do not touch, re-block, wire, or reference-as-blocked the fabric federation client; it is authorized per 5.76B. Its executionPosture string must carry the 5.76B carve-out tokens forward, not the old blanket runtime-disabled claim."
- Everything else (the 12 families, tests, wiring, recommendedNextPhase → 5.78, reviewer, landing) unchanged.

## PROMPT 3 — Phase 5.78 — CI enforcement contract

Identical to v1 Prompt 3, plus one boundary family and one guardrail:
- Add family `ci_offline_hermetic_guarantee`: CI runs fully offline; the fabric federation client's tests are hermetic (they inject fetchImpl and use fake tokens/loopback URLs — verified). CI MUST NEVER set or provide ARDYN_FABRIC_* / FABRIC_TRANSPORT_D_* / registry secrets, MUST NEVER contact a live sidecar or registry, and MUST NEVER wire federation into a runtime path. This is part of ci_forbidden_behavior too.
- Posture framing updated to the carve-out. recommendedNextPhase → 5.79. Everything else unchanged.

## PROMPT 4 — Phase 5.79 — CI enablement — JULES GATE (PR + STOP)

Identical to v1 Prompt 4, plus:
- The workflow files must satisfy the 5.78 `ci_offline_hermetic_guarantee`: no fabric secrets in any workflow, no network egress required by tests, no env for ARDYN_FABRIC_*/FABRIC_TRANSPORT_D_*. Confirm empirically that `npm test` (which includes tests/fabric.test.mjs) passes with NO fabric env set (it does — tests inject fetchImpl).
- Posture framing updated. recommendedNextPhase → 5.80. Landing: PR + STOP (Jules), unchanged.

## PROMPT 5 — Phase 5.80 — Report-script compaction (byte-identical)

Identical to v1 Prompt 5. Note: the 5.76B posture-string change is already in main before this runs, so the golden snapshot naturally includes it — no special handling. Posture framing updated. Parent 5.79 merged, CI green.

## PROMPT 6 — Phase 5.81 — Report-test compaction + suite performance

Identical to v1 Prompt 6. Posture framing updated. Parent 5.80.

## PROMPT 7 — Phase 5.82 — Source-guard hardening + shared test helpers

Identical to v1 Prompt 7, plus one caution:
- When exporting COMMAND_TABLE and writing any "no network / no fetch in the runtime surface" guard, SCOPE IT to the CLI + Rust host (which are still fully blocked). Do NOT write a repo-wide fetch/http ban — packages/fabric/src/federation.mjs legitimately uses globalThis.fetch as the authorized consumer client. Any network-absence guard must explicitly exempt federation.mjs and instead assert it stays UNWIRED (not imported by CLI/host).
- Posture framing updated. recommendedNextPhase → 5.83.

## PROMPT 8 — Phase 5.83 — External-reference policy + dependency allowlist (now formalizes federation invariants) — JULES GATE (PR + STOP)

Identical to v1 Prompt 8, with the fabric entry REFRAMED and one new test group:
- The `fabric_core_multiverse` policy entry status becomes: fabric-core = still-not-imported (banned import: @multiverse/fabric-core), BUT the fabric FEDERATION client (packages/fabric/src/federation.mjs) = `authorized_consumer_surface` per 5.76B/PR#4. Record its invariants as the policy's assertions.
- Dependency allowlist UNCHANGED (federation added no deps: npm allowlist still exactly ajv; cargo still serde/serde_json/sha2). The forbidden-pattern list still bans libp2p*/bittorrent*/dht*/webtorrent/torch/tensorflow/jax/transformers/matrix-js-sdk/@matrix-org/*/hermes*/cua*/goose/onyx/fainir/openclaw* — federation honors all of these.
- Secure Drop entry: still ban IMPLEMENTING Secure Drop crypto/decrypt/stego; ADD a test asserting federation.mjs does NOT decrypt Secure Drop ciphertext (carries ciphertext only) and contains no crypto-decrypt of payloads.
- NEW test group `federation_invariants` (formalizing 5.76B): federation is loopback-enforced (non-loopback sidecar URL rejected — exercise isLoopbackFabricFederationUrl), not imported by CLI/host, imports no fabric-core, joins no DHT/swarm/P2P, adds no deps, commits no secrets (config/secret gitignored; no hardcoded tokens in source). These can reuse/extend the 5.76B tests; 5.83 is their canonical policy home.
- The CLI-rejection probes still assert the CLI refuses computer-use/hermes/matrix/shell/sqlite/secure-drop command families — federation being present does NOT add a CLI command, so those probes stand.
- Posture framing updated. recommendedNextPhase → 5.84. Landing: PR + STOP (Jules).

---

## Arc after 5.83 (unchanged from v1, with fabric now reframed)

- **5.84 — fabric-core producer pin + gap-index regeneration.** Now ALSO reconcile the 5.47 gap index to reflect that the JS consumer surface is partly REALIZED (federation client present) rather than fully pending; pin the sidecar/registry contract shape the client depends on, plus the Multiverse fabric-core producer pin for the still-future fabric-core import path. Fable will fetch Multiverse pins at that time.
- **5.85** consumer contract export pack · **5.86** flag-normalization envelope · **5.87** docs front door · **5.88** threat model + SECURITY.md (add the fabric federation client to the threat model: loopback trust, token custody, allowlist bypass, SSRF via registry URL, contentId spoofing) · later: core boundary-map engine + modularization.

## Standing rules (unchanged; restated)

Review-only metadata EXCEPT the one authorized fabric federation consumer surface · small deterministic slices · one read-only reviewer subagent per slice · Jules at marked gates via PR+STOP · Fallow advisory only · no broad cleanup in unrelated phases · security in dedicated slices · derive SHAs via git · reuse helpers, `ponytail:` on shortcuts · no history rewrites · nothing from hermes-scratch committed · GITHUB_TOKEN never printed/persisted · never open a NEW runtime surface or wire federation into CLI/host.
```
