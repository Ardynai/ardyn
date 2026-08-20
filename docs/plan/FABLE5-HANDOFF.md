# Fable 5 Handoff — Ardyn (start here)

You are the fresh **Claude planner (Fable 5)** for `Ardynai/ardyn`, one of several repos Josh runs planner-and-operator. Josh reset sessions; this is your clean pickup. **Guiding principle: keep most existing content/config the same — change only what is intentionally being improved (stale, wrong, or clearly better).** Do not churn.

Your counterpart operator is **Codex / GPT-5.6 Sol** (or a Hermes/GLM agent). You plan, verify, and merge; the operator writes code, one phase per PR.

---

## 1. Current state (verify against `git log` + PRs — authoritative)
- Latest phase landed: **5.83** (external-reference policy + dependency allowlist + federation invariants). Next: **5.84** (fabric federation pre-wiring hardening).
- **Posture:** review-only metadata for all runtime surfaces EXCEPT the authorized, unwired Fabric Federation client (`packages/fabric/src/federation.mjs`). Canonical: `docs/posture.md`.
- **CI live + branch-protected:** PR + `node`+`rust`+`node-windows` green required; auto squash-merge on green. `node`/`rust` on a self-hosted Mac (free, slow); `node-windows` GitHub-hosted.
- **Guards are digest-based** (`tests/helpers/source-digests.mjs`); report is manifest-driven (`scripts/phase-status-manifests/`); dep allowlist enforced.
- Full plan + roadmap: this folder (`docs/plan/`). Standing guardrails: `docs/plan/STANDING-GUARDRAILS.md`. Workflow/CI/review runbook: `docs/plan/CI-AND-REVIEW-RUNBOOK.md`.

## 2. Workflow doctrine (how this repo runs)
- Small, deterministic, validation-heavy phases; each = doc + fixture + one `create*ForReview` helper + focused test + manifest/report wiring; all fail-closed, all runtime/auth flags false.
- One phase per PR → planner verifies (refs, drift, no historical-fixture edits, no federation change) → green CI → squash-merge. One read-only reviewer per slice; a dedicated hardening slice for security findings; no broad cleanup in unrelated phases.
- Operator prompts are lean (5-part Sol structure — see `CLAUDE.md`). Derive SHAs via git; never print/persist tokens.
- Design/UI/UX coding → Codex/Sol (image gen + fal + ComfyUI), NOT Claude Code (flipped 2026-07; see `CLAUDE.md`).

## 3. Open backlog (see `docs/plan/ROADMAP.md` for detail)
- **5.84** fabric federation pre-wiring hardening (records the 2026-07-06 audit: redirect:manual/SSRF, inbound-auth signatures, registry host allowlist, identity-file confinement) · **5.85** fabric-core producer pin + regen 5.47 gap index · **5.86** consumer contract export pack (real JSON Schemas) · **5.87** flag-normalization envelope · **5.88** docs front door (PHASE-INDEX, CURRENT-STATE, README slim) · **5.89** threat model + SECURITY.md.
- **Infra TODO:** make the Mac runner a durable launchd service (currently `nohup`, dies on reboot); optionally add the Windows box as a runner + a GitHub Org for shared runners across repos.
- **Later arc:** core boundary-map engine + modularization (69k-line `packages/core/src/index.mjs` is ~89% per-phase scaffolding); absent-input rejection; enforce the ponytail ruleset (zero `ponytail:` comments today).

## 4. Your first mission (do in order)

### A. Connect and use Josh's dev tools
Wire up and confirm: **Composio (GitHub)**, **Windows MCP** (PowerShell/files), the **Obsidian vault** at `C:\AI\obsidian-mind` (working memory; project notes in `Projects/Ardyn/`), **CodeGraph**, the **`graphify`** skill (knowledge graph over vault + repo), **GitNexus**, **Tailscale** (Mac runner `moltclaw-joshs-mac-mini` @ `100.103.125.120`, SSH via Posh-SSH + `MAC_MINI_PASSWORD`), and the **deploy stack** (Vercel/Supabase/Cloudflare/fal/ComfyUI). Survey installed plugins/skills (e.g. **Superpowers**). Confirm the Mac runner is online and CI is green on `main`.
Read **`Ardynai/locus-evolution-lab`** — the cross-repo methodology/doctrine/scoring/prompts hub. Its `prompts/MODEL_PROMPTING_SOL_AND_FABLE5.md` is the canonical guide for prompting both Fable 5 (planner) and Sol/Ultra (operator); its `scoring/` templates are for grading the finished product.

### B. Load history/context
Read: persistent memory (`MEMORY.md` + files if present — point-in-time, verify against code); the **git + PR history** (authoritative record of what shipped); the whole in-repo plan (`docs/plan/`); and Josh's **Obsidian vault + CodeGraph + `graphify`**. Confirm the vault path with Josh. No need to replay old chat transcripts.

### C. Run a full advisory review of the repo + plan
Coverage (you author your OWN prompt from this — see §5): architecture & code quality; security & abuse-resistance (auth, payments, personal data, minor-safety, multi-instance/horizontal-scale correctness); cost & scale (hot paths, per-user compute/bandwidth, super-linear growth); latent bugs / correctness gaps; monetization model; the rest of the plan (sequencing, risks, dependencies, gaps); bold net-new ideas. Output = one prioritized report: per item what / why it matters / rough effort / risk if ignored / code-batch-or-founder-decision; ranked impact-vs-effort; ending with explicit advice on the rest of the plan.

### D. Optimize your own Claude config for this repo (conservatively)
After the review, tune `CLAUDE.md`, `AGENTS.md`, `docs/*`, and any Claude/Fable config with Fable-5 logic and how the repo actually is. Keep most the same; change only what's stale/wrong/clearly better.

### E. Finished-product simulation
Assume the product is done per the new plan. Role-play an experienced user in this repo's category (an AI-harness/framework consumer — e.g. a Locus/Multiverse integrator). Grade it. List what's missing/desired. (Use `locus-evolution-lab/scoring/` templates.)

### F. Write a repo-specific GPT-5.6 Sol Ultra prompt (tailored, NOT a canned template)
It must: hand Codex the **whole in-repo plan** (`docs/plan/`); ask its opinion on the plan, the code, and fixes/optimizations/security; be **read-only** (findings + recommendations only — no building, no one-shot); tell Sol to **optimize its own Codex config** for the repo (`AGENTS.md`, environment, worktree, any configurable Codex file/folder — conservatively, keep most the same); tell Sol to do the **same finished-product simulation + grade + gaps**; and **include your Fable-5 review + simulation findings** so Sol builds on them. Cover the §C checklist. Output = one prioritized report (same shape as §C).

### G. Triage + continue
Triage all findings (yours + Sol's) into a **one-batch-at-a-time** queue; resume the phase loop (next up: 5.84). The operator changes nothing during a review pass.

---
**Do NOT run the advisory review in the handoff session** — it is left for you (the fresh Fable 5 session) with full context.
