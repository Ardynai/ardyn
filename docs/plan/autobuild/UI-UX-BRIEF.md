# UI/UX Brief — the Ardyn Harness Console

Ardyn has no frontend today (it's a Node/Rust harness lib + CLI). Build a real web app to operate and observe the harness, end-to-end. You own the UI/UX for this run (design routing to Codex/Sol is suspended here).

## Product
**Ardyn Harness Console** — a web UI over the harness for an operator and for a consumer integrator (Locus/Multiverse). Read-only observation is always safe; any control action goes through the existing approval gates (never bypass them — see `SECURITY-INVARIANTS.md`).

## Core views (build in this priority)
1. **Trace / artifact viewer** — render session transcripts + review artifacts per `docs/locus-trace-display-contract.md` and the display/accessibility contracts (5.49–5.58). This is the flagship view.
2. **Phase / status dashboard** — surface `scripts/report-phase-status.mjs` output: what's built, tests, posture, health. KPI cards + drill-down.
3. **Fixture gallery** — browse the `tests/fixtures/host-policy` boundary maps / phase records; searchable.
4. **Federation monitor** — federation client state, closed sibling-DID allowlist, inbound/outbound, contentId verification status. Read-only, loopback-only.
5. **Runtime control** — start/stop `serve-runtime` sessions; the approval-gate prompts are surfaced and enforced in the UI, not bypassed. Kill-switch visible.
6. **Consumer onboarding / quickstart** — a "10-minute integrator" flow: how to consume the SDK + contracts.

## Stack & deploy
- Modern, mainstream, deployable on Josh's stack: **Vercel** (host), **Supabase** (DB/auth if the console needs persistence/login), **Cloudflare** (edge/DNS as needed). Framework: Next.js/React + Tailwind (or equivalent) — pick one, keep it standard. TypeScript.
- Every dep pinned, non-forbidden, license-ok (invariants §3). Prefer few, well-known libraries. No heavyweight/experimental UI deps.
- **Accessibility** is a first-class requirement (contrast, keyboard nav, focus, ARIA) — realize the accessibility contracts, don't bolt them on.

## Visual self-iteration (use your vision)
For each view: build → run it → **screenshot** → self-critique (visual hierarchy, spacing, clipping, empty/loading/error states, responsive breakpoints, a11y contrast) → fix → repeat until it's clean. Render before you call a view done. Include a screenshot reference in the `PROGRESS.md` entry.

## Constraints
- The console must not weaken the security floor: runtime control surfaces approvals, doesn't skip them; federation stays loopback/read-only in the UI; no secrets in the client bundle; auth on any control action.
- Keep it consumable: a real integrator should be able to run it locally against a dev harness and understand the product in minutes.
