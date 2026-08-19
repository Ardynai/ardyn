---
tags: [ardyn, roadmap, phases]
updated: 2026-07-06
maintainer: Fable 5 (lead planner)
---

# Ardyn — Recommended Next Phases

Baseline `main` @ `e84bd875` (Phase 5.76B merged). Prompts live in [[HERMES-PROMPT-5.77-code-mode]] / [[ARDYN-HERMES-PROMPTS-GLM52-v2]]. Gate procedure in [[Ardyn - Jules Automation Runbook]].

| Phase | What | Gate |
|---|---|---|
| ✅ 5.76B | Fabric federation reconciliation (posture carve-out; superseded stale stances; content-fabric BitTorrent hotfix + glossary) | merged e84bd875 |
| ▶ 5.77 | Code Mode orchestration boundary map (12 contract families) | ungated |
| 5.78 | CI enforcement contract (2 workflows; offline-hermetic; no fabric secrets) | ungated |
| 5.79 | CI enablement (create workflows; fix Windows/Node glob) | **JULES** |
| 5.80 | Report-script compaction → manifests, byte-identical | ungated |
| 5.81 | Report-test compaction + suite perf (memoize; maxBuffer 64MB + warning) | ungated |
| 5.82 | Source-guard hardening (COMMAND_TABLE, escapeRegExp, tests/helpers); scope net-guards to CLI/host | ungated |
| 5.83 | External-reference policy + dependency allowlist + federation invariants | **JULES** |
| 5.84 | Fabric federation PRE-WIRING hardening requirements (records the 2026-07-06 audit: HIGH-1 redirect:manual, HIGH-2 inbound-auth signatures, MEDIUM-1 registry host allowlist, MEDIUM-2 identity-file confinement, INFO-3 response cap) — review-only, NOT urgent (unwired) | ungated (Jules optional) |
| 5.85 | fabric-core producer pin + regen 5.47 gap index | ungated |
| 5.86 | Consumer contract export pack (schemas + contracts/registry.json) | Jules optional |
| 5.87 | Flag-normalization envelope + fixture-wide schema validation | ungated |
| 5.88 | Docs front door (PHASE-INDEX, CURRENT-STATE, README slim, fix stale ARDYN_PHASE) | ungated |
| 5.89 | Threat model + SECURITY.md (incl. federation trust model) | Jules optional |
| later | Core boundary-map engine + modularization; absent-input rejection; cycle-guarded shared walkers | milestone → Jules |

Ordering principle (Josh's): fits-now → fold into next prompt; important-but-premature → backlog; risky/runtime-enabling → review-only until explicit authorization; brainstorming → note, don't advance. Claude Code owns visual/UI prototypes OUTSIDE the repo ([[ARDYN-CLAUDE-CODE-BRIEFS]]).


> 2026-07-06: 5.77 ✅ landed (e9537ccd). Active: 5.78 CI contract (ungated). Next Jules gate: 5.79.

## 2026-07-08 — CI live; 5.82 scope expanded; Jules mechanism
- CI is live on main (ci.yml: node ubuntu+windows, rust; security.yml weekly). Every push/PR runs it.
- **5.82 now also**: de-brittle the git-baseline source-guards (sha256 digest manifests instead of git diff/show against history) — removes the need for CI core.fileMode workaround and restores clippy --all-targets (resolves the 5.79 clippy supersession).
- **Jules trigger**: appears console-launched (jules.google.com), not reliably GitHub-@mention automatable via token. For 5.83, Josh launches Jules from console when handed the PR; Fable drives verify+merge. 5.79 was merged on green-CI + Fable verification (CI-enablement phase is self-validating).
- Branch-protection on main (require node+rust checks) is still a pending one-time Josh UI step.

- 2026-07-08: Branch protection DONE. Ruleset 'ardyn' active on main: require PR (0 approvals), require status checks node+rust+node-windows, restrict deletions, block force pushes, no bypass. PR+CI flow now enforced. Automated token merges still work (0 approvals).

- 2026-07-09: Mac mini self-hosted runner LIVE. moltclaw@100.103.125.120 (2012 Intel i5, 2-core, Sonoma/OCLP). Installed Node v22.23.1 + Rust 1.97.0 (rustup, clippy/rustfmt) + actions-runner osx-x64 2.335.1 (labels self-hosted,macOS,X64,intel,ardyn), running via nohup ./run.sh (NOT yet a launchd service - dies on reboot; TODO svc.sh install). PR #9 routes node+rust -> Mac (free), node-windows stays GitHub-hosted. SSH via Posh-SSH + MAC_MINI_PASSWORD env var. Mac runs jobs SERIALLY (2 cores) so CI ~20-30min/run cold. Scale answer for 10+ repos: register Windows box futurecube + GitHub org for shared runners.
