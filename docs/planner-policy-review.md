# Planner Policy Review

Phase 3.3 introduced ARDYN task-plan review before any execution-adjacent phase
exists. Phase 3.4 adds stable approval review artifacts, trace comparison
helpers, and host-policy precondition documentation. Phase 3.5 adds the local
`review-trace` CLI and `plan --review-artifact --output <file>` export
ergonomics without changing the non-executing posture. ARDYN is an open-source
AI harness/framework. It is not Locus, not Multiverse, and not a runtime
installer.

Locus remains mission control that may later observe or control ARDYN through
public ARDYN APIs. Multiverse integration remains optional and external. MCP,
OpenClaw, plugin APIs, and Content Fabric remain boundaries only. No integration
is active because a plan mentions one.

## Scope

Policy review is planning-only. It can validate a task, rank declared
capabilities, report unresolved requests, emit approval records, and explain why
a plan is or is not ready for a future approval boundary.

Policy review does not:

- Execute tools.
- Start autonomous loops.
- Open network listeners.
- Spawn processes or long-running services.
- Call Locus, Multiverse, MCP, OpenClaw, or other adapters.
- Install plugins.
- Download torrents.
- Enable code packs.
- Serve Content Fabric catalogs.
- Connect to real external systems.

## Approval Statuses

`approvalDecision` is a review record, not an execution grant. It is created
during planning so reviewers can see whether human approval would be required
before a future runtime phase.

There are two related status surfaces:

| Surface | Status | Meaning |
| --- | --- | --- |
| `approval.status` | `null` | No approval gate is required for this plan. |
| `approval.status` | `approval-required` | Planning found at least one task or policy reason requiring approval. |
| `approval.status` | `approval-denied` | A simulated planner review decision denied the plan. Execution is still impossible. |
| `approval.status` | `approval-granted` | A simulated planner review decision granted the plan. Execution is still impossible. |
| `approvalDecision.status` | `not_required` | The plan does not require approval. |
| `approvalDecision.status` | `required` | The plan requires approval and no simulated decision has granted or denied it. |
| `approvalDecision.status` | `denied` | A simulated decision denied the plan for review purposes only. |
| `approvalDecision.status` | `granted` | A simulated decision granted the plan for review purposes only. |

Approval can be required by:

- A task constraint such as `constraints.requireHumanApproval: true`.
- A manifest policy such as `policies.requiresApprovalFor` matching a selected
  capability permission scope.

Every current approval decision is deterministic and non-executing. Even a
simulated `granted` decision must not be treated as permission to execute in
Phase 3.3-3.5. A simulated `denied` decision is useful for UI and reporting
review, but it also does not invoke cancellation hooks, adapter calls, process
control, or any other runtime behavior.

## Capability Ranking Policy

For each unique requested capability string, the planner evaluates every
declared manifest capability and retains every candidate match in the trace.
Candidates are ranked deterministically:

| Match type | Meaning | Score |
| --- | --- | ---: |
| `exact` | Requested string equals `capability.id`. | `300` |
| `tag` | Requested string appears in `capability.tags`. | `200` |
| `scope` | Requested string equals a declared permission scope. | `100` |

Selection uses the highest available tier only:

- Exact matches outrank tag matches.
- Tag matches outrank scope matches.
- Scope matches are selected only when no exact or tag tier exists.
- All candidate tiers remain visible in `resolutions[].candidates` and
  `plannerTrace.candidateCapabilities`.
- Ties inside the selected tier are sorted by capability id using bytewise ASCII
  order and all tied capability ids are selected.
- Requests with no candidate are retained as no-match resolutions with empty
  `candidates`, empty `selectedCapabilityIds`, and an entry in
  `unresolvedRequests`.

This policy makes planning reviewable without hiding lower-ranked candidates.
Reviewers can see why the planner selected a capability and what it deliberately
did not select.

## Trace Review

The default `plan` output includes `plannerTrace`. The `plan --trace` mode
prints the same trace in a focused wrapper. Reviewers should use the trace to
answer five questions:

1. Did task intake succeed, and are the requested capabilities expected?
2. Did the manifest identity, version, and schema version match the review
   target?
3. Did each request select the expected highest-ranked tier while preserving
   lower-ranked candidates?
4. Did unresolved requests stay visible without throwing away review context?
5. Do approval and safety records still prove that the plan is non-executing?

The trace is evidence, not a runtime command. A trace may describe future
capabilities, adapters, or permission scopes, but it must not imply that ARDYN
connected to those systems.

## Phase 3.4/3.5 Approval Review Artifacts

Phase 3.4 adds a stable review artifact over planner output. Phase 3.5 makes
artifact export and artifact comparison available through local CLI workflows.
Both are still planning-only evidence and still cannot grant runtime
permission.

Core APIs:

- `createApprovalReviewArtifact(planOrTrace, options)` creates an
  `ardyn.approval-review-artifact` document from a task plan or planner trace.
- `validateApprovalReviewArtifact(artifact)` validates the artifact shape and
  rejects artifacts where `nonExecuting` is not true or any safety flag is not
  false.
- `compareApprovalReviewArtifacts(left, right)` compares two artifacts, or a
  planner trace and an artifact, after normalizing through the stable artifact
  shape.

CLI example:

```powershell
node apps/cli/src/index.mjs plan --review-artifact --manifest tests/fixtures/planning-manifest.json --task tests/fixtures/tasks/approval-required.json
```

The review artifact includes task and manifest identity, requested capability
ids, deterministic candidate rankings, selected capability ids, unresolved
requests, the approval decision, `nonExecuting: true`, and safety flags that all
remain false.

Trace comparison fixtures live at:

- `tests/fixtures/trace-comparison/left-approval-review-artifact.json`
- `tests/fixtures/trace-comparison/right-approval-review-artifact.json`
- `tests/fixtures/trace-review/equal-left-approval-review-artifact.json`
- `tests/fixtures/trace-review/selected-capability-changed-approval-review-artifact.json`

Use `compareApprovalReviewArtifacts` for core comparison behavior. Use
`review-trace --left <file> --right <file>` for the Phase 3.5 CLI review
workflow over two local JSON approval review artifacts.

## Export and Trace Diff Review

`plan --review-artifact --output <file>` writes the stable artifact JSON only to
the requested output path and prints a compact JSON export summary to stdout.
This is the single allowed output-path write for Phase 3.5 planner review. It
must not write sidecar files, reports, caches, lockfiles, directories, or
comparison outputs. `--output` is valid only with `--review-artifact`.

`review-trace --left <file> --right <file>` reads local JSON review artifacts
and prints deterministic JSON. Default output includes the full difference
list. `--summary` returns compact equality, counts, changed types, source
summaries, and safety flags. `--explain` returns deterministic reasons and
details for each difference. `--summary` and `--explain` are mutually exclusive.
`review-trace` performs no writes.

Before approval, reviewers should check:

- Selected capability changes.
- Approval status or approval-decision status changes.
- Unresolved request changes.
- Candidate ranking changes.
- Any safety flag that is not false.

Those differences are policy review findings until explained. They are not
runtime instructions and must not trigger execution, adapter connections,
process spawning, network calls, plugin installation, torrent download, Content
Fabric runtime behavior, code-pack enablement, autonomous loops, or external CI.

## Future Locus UI Display Fields

A future Locus UI may display ARDYN review data, but Locus integration is not
active in Phase 3.3-3.5. The UI should be a viewer or reviewer of ARDYN plan
JSON, approval review artifacts, and trace diffs until a later integration
phase explicitly adds a connection contract.

A planning review UI should display:

- Output mode: default plan, `trace`, `summary`, `explain`,
  `review-artifact`, or `review-trace`.
- Manifest identity: `manifest.id`, `manifest.version`, and
  `manifest.schemaVersion`.
- Task intake: task id, mode, objective, requested capabilities, validity, and
  validation errors.
- Resolution summary: selected capability ids and unresolved requests.
- Per-request decision: request string, `matchType`, selected capability ids,
  reason, and candidate count.
- Candidate details: capability id, match type, score, permission scope, tag,
  and reason.
- Approval review artifact fields: artifact schema, generated timestamp,
  requested capability ids, candidate rankings, selected capability ids,
  unresolved requests, and comparison differences when present.
- Trace diff fields: equality, difference count, difference type, before and
  after values, source artifact summaries, and reviewer explanation.
- Approval gate: `approval.required`, `approval.status`, and
  `approval.reasons`.
- Approval decision: id, status, reason, requested capability ids, timestamp,
  and `nonExecuting`.
- Safety flags: every flag that proves execution, network serving, adapter
  calls, plugin installation, torrent download, code-pack enablement,
  autonomous loops, Content Fabric runtime behavior, and tool execution remain
  disabled.
- Source context when available: manifest path and task path from trace
  metadata.

The UI must not display buttons or wording that imply "run", "connect",
"install", "serve", "seed", "enable", "call MCP", "call OpenClaw", or
"execute" before those actions exist as separate reviewed phases. A Locus trace
diff screen in Phase 3.5 would be a viewer only, not an active ARDYN
integration.

## Adapter Metadata Boundary

Adapters are metadata-only in Phase 3.3-3.5. Adapter packages and manifest
adapter entries can describe identity, capability, permission, or future
integration shape, but they must not create live connections or call external
services.

This boundary applies to OpenClaw, MCP, Locus, Multiverse, plugin APIs, and any
other adapter-like surface. A plan may mention adapter metadata, but no adapter
connection exists because of that mention.

## Why Execution Remains Deferred

Execution is deferred because ARDYN is still making the contract layer stable:
schemas, manifests, task inputs, capability resolution, approval records,
planner traces, static host identity, and dry-run handshakes must be predictable
before any runtime behavior can be made safe.

Keeping Phase 3.3-3.5 non-executing prevents policy review from being
confused with tool execution. It also keeps Locus, Multiverse, Content Fabric,
MCP, OpenClaw, and plugin concepts as explicit boundaries instead of hidden
runtime dependencies.

## Before Any Execution-Adjacent Phase

Before ARDYN adds execution-adjacent behavior, all of the following must be
true:

- Execution must be explicitly scoped, documented, tested, and opt-in.
- The Rust host policy boundary must define filesystem, process, network, and
  credential enforcement.
- Approval records must be connected to a real consent flow, not just planning
  output.
- Runtime safety flags must change only with tests proving the new behavior.
- Adapters must have explicit connection contracts, permission checks, failure
  modes, and audit records.
- Content Fabric runtime work must add signature verification, payload hash
  verification, quarantine, sandboxing, and explicit enablement.
- Plugin install, torrent download, code-pack enablement, network serving,
  process spawning, autonomous loops, MCP calls, OpenClaw calls, and external
  adapter connections must each be introduced as separate reviewed phases.

See `docs/host-policy-preconditions.md` for the Phase 3.4 host-policy
preconditions that must exist before any future execution-adjacent phase.

## Examples

Run planner examples from the repository root:

```powershell
node apps/cli/src/index.mjs plan --manifest tests/fixtures/planning-manifest.json --task tests/fixtures/tasks/exact-match.json
node apps/cli/src/index.mjs plan --manifest tests/fixtures/planning-manifest.json --task tests/fixtures/tasks/tag-match.json
node apps/cli/src/index.mjs plan --manifest tests/fixtures/planning-manifest.json --task tests/fixtures/tasks/scope-match.json
node apps/cli/src/index.mjs plan --manifest tests/fixtures/planning-manifest.json --task tests/fixtures/tasks/no-match.json
node apps/cli/src/index.mjs plan --manifest tests/fixtures/planning-manifest.json --task tests/fixtures/tasks/approval-required.json
node apps/cli/src/index.mjs plan --trace --manifest tests/fixtures/planning-manifest.json --task tests/fixtures/tasks/tag-match.json
node apps/cli/src/index.mjs plan --summary --manifest tests/fixtures/planning-manifest.json --task tests/fixtures/tasks/approval-required.json
node apps/cli/src/index.mjs plan --explain --manifest tests/fixtures/planning-manifest.json --task tests/fixtures/tasks/exact-match.json
node apps/cli/src/index.mjs plan --review-artifact --manifest tests/fixtures/planning-manifest.json --task tests/fixtures/tasks/approval-required.json
node apps/cli/src/index.mjs plan --review-artifact --manifest tests/fixtures/planning-manifest.json --task tests/fixtures/tasks/approval-required.json --output approval-review-artifact.json
node apps/cli/src/index.mjs review-trace --left tests/fixtures/trace-review/equal-left-approval-review-artifact.json --right tests/fixtures/trace-review/selected-capability-changed-approval-review-artifact.json
node apps/cli/src/index.mjs review-trace --summary --left tests/fixtures/trace-review/equal-left-approval-review-artifact.json --right tests/fixtures/trace-review/unresolved-request-changed-approval-review-artifact.json
node apps/cli/src/index.mjs review-trace --explain --left tests/fixtures/trace-review/equal-left-approval-review-artifact.json --right tests/fixtures/trace-review/approval-status-changed-approval-review-artifact.json
```

Exact-match review:

- Request: `network`.
- Selected tier: `exact`, score `300`.
- Selected capability: `network`.
- Lower-ranked tag and scope candidates remain visible in the candidate list.

Tag-match review:

- Request: `filesystem`.
- Selected tier: `tag`, score `200`.
- Selected capabilities: `alpha.tag`, `beta.tag`.
- The scope candidate remains visible but is not selected.

Scope-match review:

- Task fixture: `tests/fixtures/tasks/scope-match.json`.
- Request: `memory`.
- Selected tier: `scope`, score `100`.
- Selected capability: `network`, because it declares the `memory` permission
  scope and no exact id or tag candidate exists for `memory`.
- If a future manifest adds an exact id or tag candidate for the same request,
  that higher tier must win.

No-match review:

- Request: `missing.capability`.
- Selected capabilities: none.
- `unresolvedRequests` includes `missing.capability`.
- The no-match result is a valid planning outcome, not an exception.

Approval-required review:

- Request: `secure.registry`.
- The selected capability declares the `registry` scope.
- The task also requires human approval.
- `approval.required` is `true`.
- `approval.status` is `approval-required`.
- `approvalDecision.status` is `required`.
- `approvalDecision.nonExecuting` is `true`.

Denied review simulation:

- Simulated denied decisions are planner review inputs, not CLI execution
  commands.
- A denied decision produces `approval.status: "approval-denied"` and
  `approvalDecision.status: "denied"` only when approval is otherwise required.
- Safety flags remain false and no cancellation hook, tool call, adapter call,
  network listener, or process control is invoked.

Trace usage:

- `plan --trace` prints `{ command, output: "trace", manifest, taskId, trace,
  safety }`.
- Use `trace.taskIntake` to review task validity and requested capabilities.
- Use `trace.candidateCapabilities` to inspect retained candidates and scores.
- Use `trace.selectedCapabilities` and `trace.unresolvedRequests` to compare
  selected and unresolved work.
- Use `trace.approvalDecision` and `trace.safety` to confirm the plan remains
  non-executing.

Summary usage:

- `plan --summary` prints selected capability ids, unresolved requests,
  approval data, and safety flags without the full trace.
- It must be derived from the same non-executing plan data.
- It must not imply that any tool ran or any adapter connected.

Explain usage:

- `plan --explain` prints deterministic candidate ranking and approval reasons.
- It cites request-level reasons, candidate match types, scores, scopes, and
  tags.
- It should state that execution remains deferred when presented in reports or
  future UI.

Review artifact usage:

- `plan --review-artifact` prints the stable approval review artifact.
- `plan --review-artifact --output <file>` writes that artifact JSON only to
  the requested output path and prints a compact export summary.
- Fixtures under `tests/fixtures/review-artifacts/` pin exact-match,
  approval-required, no-match, and invalid safety-flag examples.
- Comparison fixtures under `tests/fixtures/trace-comparison/` and
  `tests/fixtures/trace-review/` pin deterministic artifact differences for
  reviewers.
- Review artifacts must keep `nonExecuting: true`; every safety flag must remain
  false.

Trace diff usage:

- `review-trace --left <file> --right <file>` reads local JSON artifacts and
  prints deterministic comparison JSON.
- `review-trace --summary` is for compact changed-type review.
- `review-trace --explain` is for reviewer-facing reasons and details.
- `--summary` and `--explain` are mutually exclusive.
- The command writes no files and must keep every safety flag false.
