# Planner Trace Review Workflow

This workflow is for Phase 3.3 planning review only. It reviews ARDYN planner
JSON and must not execute tools, connect adapters, open listeners, spawn
processes, install plugins, download torrents, enable code packs, run agent
loops, serve Content Fabric catalogs, call MCP, call OpenClaw, or connect to
Locus or Multiverse.

## Reviewer Inputs

Use committed fixtures or other planning-only manifest and task JSON:

```powershell
node apps/cli/src/index.mjs plan --manifest tests/fixtures/planning-manifest.json --task tests/fixtures/tasks/scope-match.json
node apps/cli/src/index.mjs plan --trace --manifest tests/fixtures/planning-manifest.json --task tests/fixtures/tasks/tag-match.json
node apps/cli/src/index.mjs plan --summary --manifest tests/fixtures/planning-manifest.json --task tests/fixtures/tasks/approval-required.json
node apps/cli/src/index.mjs plan --explain --manifest tests/fixtures/planning-manifest.json --task tests/fixtures/tasks/exact-match.json
npm run report:phase-status
```

The mode flags are render choices over the same non-executing plan data. They
are mutually exclusive.

## Review Checklist

1. Confirm the command output is planner JSON only.
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
10. Confirm all safety flags are false.

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

## Future UI Review Fields

A future Locus UI may render this workflow, but Locus is not connected in Phase
3.3. Treat the UI as a viewer until a later phase adds explicit connection
contracts.

Display these fields:

- Manifest id, version, and schema version.
- Task id, mode, objective, requested capabilities, validity, and validation
  errors.
- Per-request match type, selected capability ids, reason, unresolved state, and
  candidate count.
- Candidate capability id, match type, score, scope, tag, and reason.
- Approval required flag, approval status, approval reasons, decision id,
  decision status, decision reason, requested capability ids, timestamp, and
  `nonExecuting`.
- Safety flags proving no execution, network serving, adapter calls, plugin
  installation, torrent download, code-pack enablement, autonomous loops,
  Content Fabric runtime behavior, or tool execution occurred.

Do not display execution controls before execution phases exist. Acceptable
Phase 3.3 actions are review-oriented actions such as inspect, compare, export,
or report.

## Reporting

A Phase 3.3 report should include:

- The command and output mode used to produce the evidence.
- The manifest and task identifiers.
- Selected capability ids and unresolved requests.
- Approval status and approval-decision status.
- A statement that safety flags stayed false.
- Any reviewer concern about ranking, approval, missing candidates, or wording
  that could imply active integrations.

The root `report:phase-status` script should assemble the same planning
evidence without starting servers, spawning long-running processes, calling
adapters, or enabling runtime behavior.
