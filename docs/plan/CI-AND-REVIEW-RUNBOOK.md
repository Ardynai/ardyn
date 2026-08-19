---
tags: [ardyn, jules, automation, workflow]
updated: 2026-07-06
owner: Fable 5 (lead planner) — executes via GITHUB_TOKEN
---

# Ardyn — Jules Automation Runbook

How Fable drives Jules on gated PRs (5.79, 5.83, and any milestone) without handing back to Josh. See [[Ardyn - Overview]].

## Mechanism (observed 2026-07-06)

- Jules = the `google-labs-jules[bot]` GitHub App, installed on Ardynai/ardyn (it posted "reporting for duty" on ardyn PR #1 "Review Phase 5.4 disabled command exposure plan").
- It is brought onto a PR by an **@mention from Ardynai** in a PR comment (ardyn #1 timeline: `mentioned by Ardynai` → bot engages). For phase approvals it also spins its own `jules/approve-phase-*` branch (e.g. somatic #62 `jules/approve-phase-12r-...`). A `chatgpt-codex-connector[bot]` co-exists and leaves COMMENTED reviews.
- Only collaborator is `Ardynai` (the token identity), which has admin+push — so Fable can label, comment, @mention, poll, merge, and delete branches directly.

## Automated gate procedure (Fable runs this at each Jules gate)

1. Hermes pushes the phase branch + opens the PR, then STOPS (per the gated prompts).
2. Fable verifies the PR independently (file surface, diffs, no dep/history drift, invariants) — same trust-but-verify as 5.76B.
3. Fable posts a review-request comment on the PR: `@google-labs-jules please review <Phase N — title>. Scope: <security-sensitive / posture / milestone>. Confirm: <explicit checks>. Review-only; do not merge.`
4. Fable polls the PR timeline/comments (`GET issues/{n}/timeline`, `GET issues/{n}/comments`, `GET pulls/{n}/reviews`) for a `google-labs-jules[bot]` response + verdict, and any `jules/*` branch it opens.
5. On APPROVE / no-blocking-findings → Fable squash-merges via token, deletes the branch, updates baseline SHA, hands Hermes the next prompt. On findings → Fable relays them to Hermes as a fix slice, then re-requests Jules on the updated PR.
6. If Jules does not engage from the @mention within a few minutes (Josh may normally launch from the jules.google.com console), Fable notifies Josh with a one-line console launch: "Point Jules at PR #N on Ardynai/ardyn — task: '<review scope>'." Then resumes automated polling + merge once Jules posts. This is the ONLY step that may need a Josh click; everything else is automated.

## Token hygiene

GITHUB_TOKEN read only as `[Environment]::GetEnvironmentVariable('GITHUB_TOKEN','User')`; never printed, logged, committed, or written to any file. Current token is admin-scoped over all Ardynai repos — consider a fine-grained token scoped to ardyn for this loop.

## Gates on the current queue

- 5.79 CI enablement — first live use of this runbook.
- 5.83 external-reference policy + federation invariants.
- 5.76B was a soft gate — Fable merged it directly after double verification (metadata reconciliation of authorized code); Jules cycle reserved for the harder gates.

## 2026-07-09 — Jules via CLI (headless gate, no console)
- Jules CLI installed: @google/jules@0.1.42; auth via JULES_API_KEY (User env var) — works.
- Launch a review: jules remote new --repo Ardynai/ardyn --session "<review task>"  → returns session ID + URL.
- Poll/collect: jules remote list --session ; jules remote pull --session <id>  (or teleport <id>).
- No --branch flag; reference the PR # + branch name in the task so Jules fetches the right diff.
- 5.83 gate: session 14450280577616525544 launched on PR #12. Merge condition = CI green (Mac) AND Jules no-blocking findings.
- This replaces the console launch in [[Ardyn - Jules Automation Runbook]] — CLI is fully headless.
