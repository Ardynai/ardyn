# Planner Trace Review Workflow

This workflow is for Phase 3.3-3.6 planning review only. It reviews ARDYN
planner JSON and must not execute tools, connect adapters, open listeners, spawn
processes, install plugins, download torrents, enable code packs, run agent
loops, serve Content Fabric catalogs, call MCP, call OpenClaw, or connect to
Locus or Multiverse.

Phase 3.4 adds approval review artifacts and trace comparison fixtures on top of
the same non-executing planner data. Phase 3.5 adds the local `review-trace`
CLI and `plan --review-artifact --output <file>` export ergonomics. Phase 3.6
documents the Locus-facing display contract for the same local JSON evidence. It
does not add execution, adapter connections, network behavior, or active Locus
integration.

## Reviewer Inputs

Use committed fixtures or other planning-only manifest and task JSON:

```powershell
node apps/cli/src/index.mjs plan --manifest tests/fixtures/planning-manifest.json --task tests/fixtures/tasks/scope-match.json
node apps/cli/src/index.mjs plan --trace --manifest tests/fixtures/planning-manifest.json --task tests/fixtures/tasks/tag-match.json
node apps/cli/src/index.mjs plan --summary --manifest tests/fixtures/planning-manifest.json --task tests/fixtures/tasks/approval-required.json
node apps/cli/src/index.mjs plan --explain --manifest tests/fixtures/planning-manifest.json --task tests/fixtures/tasks/exact-match.json
node apps/cli/src/index.mjs plan --review-artifact --manifest tests/fixtures/planning-manifest.json --task tests/fixtures/tasks/approval-required.json
node apps/cli/src/index.mjs plan --review-artifact --manifest tests/fixtures/planning-manifest.json --task tests/fixtures/tasks/approval-required.json --output approval-review-artifact.json
node apps/cli/src/index.mjs review-trace --left tests/fixtures/trace-review/equal-left-approval-review-artifact.json --right tests/fixtures/trace-review/equal-right-approval-review-artifact.json
node apps/cli/src/index.mjs review-trace --summary --left tests/fixtures/trace-review/equal-left-approval-review-artifact.json --right tests/fixtures/trace-review/selected-capability-changed-approval-review-artifact.json
node apps/cli/src/index.mjs review-trace --explain --left tests/fixtures/trace-review/equal-left-approval-review-artifact.json --right tests/fixtures/trace-review/approval-status-changed-approval-review-artifact.json
npm run report:phase-status
```

The mode flags are render choices over the same non-executing plan data. They
are mutually exclusive. For `review-trace`, `--summary` and `--explain` are
mutually exclusive and the default mode prints the full deterministic JSON
difference list.

## Review Checklist

1. Confirm the command output is planner, review-artifact, or trace-diff JSON
   only.
2. Confirm `manifest.id`, `manifest.version`, and `manifest.schemaVersion`
   match the intended manifest.
3. Confirm `taskIntake.valid` is true, or capture validation errors without
   proceeding to any execution-adjacent interpretation.
4. Compare requested capabilities to `candidateCapabilities`.
5. Confirm selected capabilities come only from the highest available tier:
   exact id score `300`, tag score `200`, then permission scope score `100`.
6. Confirm lower-ranked candidates remain visible for review.
7. Confirm no-match requests remain in `unresolvedRequests`.
8. Confirm approval reasons explain task constraints and policy-scoped
   capability matches.
9. Confirm `approvalDecision.nonExecuting` is true when present.
10. For `--review-artifact`, confirm the artifact schema is
    `ardyn.approval-review-artifact`.
11. Confirm review artifacts keep `nonExecuting: true` and preserve the same
    approval decision as the source plan or trace.
12. For `plan --review-artifact --output <file>`, confirm the artifact JSON is
    written only to the requested output path and stdout is a compact export
    summary.
13. For `review-trace`, confirm both inputs are local JSON review artifacts and
    no output file is written.
14. Before approval, inspect any selected capability changes, approval status
    changes, unresolved request changes, and candidate ranking changes.
15. Confirm all safety flags are false in both reviewed artifacts and in the
    comparison output.

Any mismatch is a planning review finding. It is not a signal to run a tool or
connect an adapter.

## Example Outcomes

| Example | Request | Expected review outcome |
| --- | --- | --- |
| Exact match | `network` | Selects `network` by exact id with score `300`; tag and scope candidates remain visible. |
| Tag match | `filesystem` | Selects `alpha.tag` and `beta.tag` by tag with score `200`; lower scope candidates remain visible. |
| Scope match | `memory` | Selects `network` by permission scope with score `100` only because no exact or tag candidate exists. |
| No match | `missing.capability` | Selects nothing and records the request in `unresolvedRequests`. |
| Approval required | `secure.registry` | Selects `secure.registry`; records task and policy approval reasons; remains non-executing. |
| Denied simulation | approval decision `denied` | Records denial for review only; all safety flags remain false and no runtime hook fires. |
| Review artifact | `--review-artifact` | Prints stable artifact JSON with candidate rankings, selected ids, unresolved requests, approval decision, and false safety flags. |
| Review artifact export | `--review-artifact --output <file>` | Writes only the requested output file and prints a compact export summary. |
| Trace diff | `review-trace` | Compares local review artifacts and reports deterministic differences without writes or execution. |

## Phase 3.5 Trace Diff Review

Use `review-trace --left <file> --right <file>` when a reviewer needs to
compare two local JSON approval review artifacts through the stable artifact
shape. The command reads local files, validates them, normalizes through the
core approval review artifact comparator, and prints deterministic JSON.

Committed comparison and review fixtures:

- `tests/fixtures/trace-comparison/left-approval-review-artifact.json`
- `tests/fixtures/trace-comparison/right-approval-review-artifact.json`
- `tests/fixtures/trace-review/equal-left-approval-review-artifact.json`
- `tests/fixtures/trace-review/selected-capability-changed-approval-review-artifact.json`
- `tests/fixtures/trace-review/approval-status-changed-approval-review-artifact.json`
- `tests/fixtures/trace-review/unresolved-request-changed-approval-review-artifact.json`

Default `review-trace` output includes equality, difference count, full
deterministic differences, left/right source summaries, `nonExecuting: true`,
and false safety flags. `--summary` returns equality, counts, changed difference
types, source summaries, and safety flags. `--explain` returns deterministic
reasons and details for each difference. `--summary` and `--explain` are
mutually exclusive.

Before approval, reviewers should treat these difference types as mandatory
inspection points:

- Selected capability changes.
- Approval status or approval-decision status changes.
- Unresolved request changes.
- Candidate ranking changes.
- Any safety flag that is not false.

Any such change is a review finding until it is explained. `review-trace` is
read-only and must not be used as a cue to run tools, connect adapters, or apply
a decision.

## Export Ergonomics

Use `plan --review-artifact --output <file>` only when the reviewer needs a
stable artifact file for later comparison. This is the single allowed
output-path write in Phase 3.5.

The command writes only the formatted artifact JSON to the requested output
path. Stdout is a compact JSON export summary. It does not write comparison
files, sidecar metadata, caches, reports, lockfiles, or directories. `--output`
is valid only with `--review-artifact`.

## Future UI Review Fields

A future Locus UI may render this workflow, including `review-trace` diffs, but
Locus is not connected in Phase 3.3-3.6. Treat the UI as a viewer only until a
later phase adds explicit connection contracts.

See `docs/locus-trace-display-contract.md` for the Phase 3.6 display contract,
including compatibility severity, approval status labels, trace diff fields,
unknown-field handling, and the rule that ARDYN adds no Locus runtime
dependency. See `docs/review-artifact-versioning-policy.md` for review-artifact
versioning, unknown-field preservation, and deterministic timestamp guidance.

Display these fields:

- Manifest id, version, and schema version.
- Task id, mode, objective, requested capabilities, validity, and validation
  errors.
- Per-request match type, selected capability ids, reason, unresolved state, and
  candidate count.
- Candidate capability id, match type, score, scope, tag, and reason.
- Trace diff equality, difference count, difference type, before/after values,
  and reviewer explanation.
- Approval required flag, approval status, approval reasons, decision id,
  decision status, decision reason, requested capability ids, timestamp, and
  `nonExecuting`.
- Safety flags proving no execution, network serving, adapter calls, plugin
  installation, torrent download, code-pack enablement, autonomous loops,
  Content Fabric runtime behavior, or tool execution occurred.

Do not display execution controls before execution phases exist. Acceptable
Phase 3.3-3.6 actions are viewer-only actions such as inspect, compare, export,
or report.

## Reporting

A Phase 3.5 report should include:

- The command and output mode used to produce the evidence.
- The manifest and task identifiers.
- Selected capability ids and unresolved requests.
- Approval status and approval-decision status.
- Approval review artifact schema, generated timestamp, candidate rankings, and
  comparison differences when relevant.
- Export path when `plan --review-artifact --output <file>` produced a file.
- Host-policy precondition documentation status.
- A statement that safety flags stayed false.
- Any reviewer concern about ranking, approval, missing candidates, or wording
  that could imply active integrations.

The root `report:phase-status` script should assemble the same planning
evidence as a local summary only. It should inventory docs, artifacts, fixtures,
tests, host-policy preconditions, and safety posture without running checks,
starting servers, spawning long-running processes, calling adapters, or enabling
runtime behavior.
