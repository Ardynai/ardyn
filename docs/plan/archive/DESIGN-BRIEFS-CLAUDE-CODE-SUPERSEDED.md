# ARDYN — Claude Code Briefs (design/visual lane)

Division of labor: **Codex owns all Ardyn repo commits.** Claude Code owns visual/UI/prototype work, which lives **outside the Ardyn repo** because UI/browser/rendering remains blocked and review-only inside it. These briefs have zero coupling to the Codex queue — run them any time, in parallel. Suggested workspace: `C:\AI\prototypes\ardyn\` (new folder; never inside `C:\Users\Josh\Documents\ardyn`).

Natural sync points: prototypes validate against the doc contracts today; once Phase 5.85 (consumer contract export pack) lands, point them at the real JSON Schemas; when Locus is ready to adopt, promote via Locus's own repo process.

---

## CC-1 — Locus trace / review-artifact viewer prototype (highest value, ready today)

```
You are Claude Code working in C:\AI\prototypes\ardyn\trace-viewer (create it). READ-ONLY inputs from C:\Users\Josh\Documents\ardyn — never write, commit, or create files inside that repo.

GOAL
Build a self-contained, single-file HTML prototype (vanilla JS or inline React via CDN; no build step) of the Locus trace/review-artifact viewer, implementing docs/locus-trace-display-contract.md from the Ardyn repo. This is the display surface Locus ("the AI operating system hub") will ship; Ardyn's side is frozen and field-complete, so the contract doc is the spec.

INPUTS (read-only)
- C:\Users\Josh\Documents\ardyn\docs\locus-trace-display-contract.md  (the spec: planner-trace fields, review-artifact fields, trace-diff fields, approval-status labels/severities, compatibility states, unknown-field inertness, transcript summary fields)
- Sample data: generate real artifacts with the Ardyn CLI (read-only commands):
    node apps/cli/src/index.mjs plan --trace          (and --summary, --explain, --review-artifact)
    node apps/cli/src/index.mjs review-artifact --summary
    node apps/cli/src/index.mjs validate-session-transcript --display-summary
  plus example fixtures under tests\fixtures\ and examples\session-events\, examples\session-transcripts\.

REQUIREMENTS
1. File-drop / file-picker loads any artifact JSON; auto-detect artifact kind; render the right view.
2. Views: planner trace (steps, determinism metadata), review artifact (approval status with the contract's labels + severity colors), trace diff, transcript summary (eventCount, sequenceRange, safetyPosture, warnings[]).
3. Honor the contract exactly: display compatibility states (compatible / unsupported_major / malformed) as first-class banners; UNKNOWN FIELDS must be inert (shown in a collapsed "unrecognized fields" drawer, never breaking rendering) — that inertness rule is part of the contract.
4. Safety posture strip: render the all-false safety flags prominently (this is a review tool; "nothing executes" is the headline).
5. Zero network calls, zero telemetry, works from file://. Dark theme default. Accessible (keyboard nav, ARIA on the status labels — Ardyn phase 5.49 made accessibility a contract concern).
6. Ship: index.html, a README with screenshots, and a CONTRACT-COVERAGE.md table mapping every field in the display contract doc → where the UI renders it → any gaps. That table is the deliverable Josh feeds back to the Ardyn/Locus planning loop.

Do NOT invent fields or add controls that imply execution (no run/approve buttons — display only; approval UI is a future phase).
```

## CC-2 — Phase-status dashboard prototype

```
You are Claude Code working in C:\AI\prototypes\ardyn\status-dashboard (create it). READ-ONLY toward C:\Users\Josh\Documents\ardyn.

GOAL
Single-file HTML dashboard over Ardyn's phase-status report. Today the report is a 5MB JSON wall (110+ phase inventories, 5,800+ safety-flag booleans) — make it legible.

INPUT
Generate fresh data: node scripts/report-phase-status.mjs > report.json (run inside the Ardyn repo, output saved to the prototype folder). Parse defensively; the shape is stable (schemaVersion "ardyn.phase-status-report.v1").

REQUIREMENTS
1. Header: current phase, executionPosture, reportRunsChecks:false and externalCi banners (honesty is the product — show "this report proves presence, not correctness" verbatim).
2. Phase timeline: all phases as a scrollable/searchable list (id, name, fixture statuses present/missing rolled up, link-out to doc paths).
3. Safety posture: aggregate the flags object — total count, all-false confirmation, and a red diff view if ANY flag is ever true (that's the alarm this dashboard exists for).
4. Verification commands panel: the 133 commands with ranByReport:false shown as "manual/CI evidence, not executed here".
5. File size + growth: show report byte size and per-phase inventory sizes (top 10 largest) — this visualizes the accretion problem the Codex compaction phases (5.80/5.81) are fixing; after they land, re-run and screenshot the delta.
6. Self-contained (file://, no network). Ship index.html + README. When Ardyn Phase 5.85 lands a versioned ardyn.review-status.snapshot contract, add a second loader for that small snapshot and mark the big-report loader as legacy.
```

## CC-3 — Display-fixture conformance gallery

```
You are Claude Code working in C:\AI\prototypes\ardyn\fixture-gallery (create it). READ-ONLY toward C:\Users\Josh\Documents\ardyn.

GOAL
Gallery page rendering Ardyn's Phase 5.51 example display fixtures (the 10 curated examples under tests\fixtures\host-policy\phase5-51\, plus the 5.50 fixture schema boundary doc as the shape reference). Purpose: (a) visual QA that the fixture shapes actually render into sensible UI, (b) a working head start on the consumer-owned conformance runner that phases 5.53–5.55 spec'd as living in the CONSUMER repo (Locus) — so this prototype is the seed of that runner, not a violation of it.

REQUIREMENTS
1. Load all fixture JSONs (embed them at build time via a small generate step or fetch from local files); render each as a card: fixture id, kind, the display payload rendered per the 5.50 shape, and its expected classification.
2. Valid/invalid twins: where fixtures have rejection cases, show the rejection reason string exactly as the contract names it — the strings ARE the contract.
3. A "conformance checklist" pane generated from the 5.53/5.54 requirement docs (docs\phase-5-53*.md .. 5-55*.md): each requirement → met/unmet/not-applicable toggle, exportable as JSON matching the 5.55 conformance-result shape as closely as the doc allows.
4. Self-contained HTML, dark theme, no network. Ship index.html + README + the exported sample conformance-result JSON — that export is what eventually gets validated by the real 5.55 schema when Phase 5.85 publishes it.
```

## When else to reach for Claude Code (end-steps)

- Approval-gate UI mockups for the 5.77 human_approval_gate_contract (after 5.77 lands — mockups only, outside repo).
- Architecture/phase-chain diagrams (Mermaid/SVG) for the 5.87 docs front door — generate the visuals in Claude Code, hand the final files to Codex to commit as part of 5.87.
- Anything interactive, visual, or exploratory. Codex keeps: all repo commits, phase records, tests, validation, landing.
