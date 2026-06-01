# Planner Policy Review

Phase 3.2 documents how ARDYN reviews task plans before any execution-adjacent
phase exists. ARDYN is an open-source AI harness/framework. It is not Locus,
not Multiverse, and not a runtime installer.

Locus remains mission control that may later observe or control ARDYN through
public ARDYN APIs. Multiverse integration remains optional and external. The
Content Fabric foundation remains conformance-only and non-runtime.

## Scope

Policy review is planning-only. It can validate a task, rank declared
capabilities, report unresolved requests, emit approval records, and explain why
a plan is or is not ready for a future approval boundary.

Policy review does not:

- Execute tools.
- Start autonomous loops.
- Open network listeners.
- Call Locus, Multiverse, MCP, OpenClaw, or other adapters.
- Install plugins.
- Download torrents.
- Enable code packs.
- Serve Content Fabric catalogs.
- Connect to real external systems.

## Planning-Only Approval Decisions

`approvalDecision` is a review record, not an execution grant. It is created
during planning so reviewers can see whether human approval would be required
before a future runtime phase.

Approval can be required by:

- A task constraint such as `constraints.requireHumanApproval: true`.
- A manifest policy such as `policies.requiresApprovalFor` matching a selected
  capability permission scope.

The current decision record is deterministic and non-executing. Even an
approval decision with a granted status in a future caller context must not be
treated as permission to execute in Phase 3.2. It only records what the planner
was told for review purposes.

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

## Adapter Metadata Boundary

Adapters are metadata-only in Phase 3.2. Adapter packages and manifest adapter
entries can describe identity, capability, permission, or future integration
shape, but they must not create live connections or call external services.

This boundary applies to OpenClaw, MCP, Locus, Multiverse, plugin APIs, and any
other adapter-like surface. A plan may mention adapter metadata, but no adapter
connection exists because of that mention.

## Why Execution Remains Deferred

Execution is deferred because ARDYN is still making the contract layer stable:
schemas, manifests, task inputs, capability resolution, approval records,
planner traces, static host identity, and dry-run handshakes must be predictable
before any runtime behavior can be made safe.

Keeping Phase 3.2 non-executing prevents policy review from being confused with
tool execution. It also keeps Locus, Multiverse, Content Fabric, MCP, OpenClaw,
and plugin concepts as explicit boundaries instead of hidden runtime
dependencies.

## Before Any Execution-Adjacent Phase

Before ARDYN adds execution-adjacent behavior, all of the following must be
true:

- Execution must be explicitly scoped, documented, and opt-in.
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
  autonomous loops, MCP calls, OpenClaw calls, and external adapter connections
  must each be introduced as separate reviewed phases.

## Examples

Run planner examples from the repository root:

```powershell
node apps/cli/src/index.mjs plan --manifest tests/fixtures/planning-manifest.json --task tests/fixtures/tasks/exact-match.json
node apps/cli/src/index.mjs plan --manifest tests/fixtures/planning-manifest.json --task tests/fixtures/tasks/tag-match.json
node apps/cli/src/index.mjs plan --manifest tests/fixtures/planning-manifest.json --task tests/fixtures/tasks/no-match.json
node apps/cli/src/index.mjs plan --manifest tests/fixtures/planning-manifest.json --task tests/fixtures/tasks/approval-required.json
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
- `approvalDecision.nonExecuting` is `true`.

Trace usage:

- The `plan` command includes `plannerTrace` automatically.
- Use `plannerTrace.taskIntake` to review task validity and requested
  capabilities.
- Use `plannerTrace.candidateCapabilities` to inspect retained candidates and
  scores.
- Use `plannerTrace.selectedCapabilities` and
  `plannerTrace.unresolvedRequests` to compare selected and unresolved work.
- Use `plannerTrace.approvalDecision` and `plannerTrace.safety` to confirm the
  plan remains non-executing.

Summary usage:

- A summary view should be derived from the same `plan` JSON.
- It should include the task id, selected capability ids, unresolved requests,
  approval status, and safety flags.
- It must not imply that any tool ran or any adapter connected.

Explain usage:

- An explanation view should cite `resolutions[].reason`,
  `resolutions[].candidates[].matchType`, and candidate scores.
- It should describe why the selected tier won and which lower tiers were only
  retained for review.
- It should state that execution remains deferred.

Phase 3.2 documentation does not add separate CLI flags for summary or explain
views. If a later phase adds them, they should be pure renderings of the same
non-executing plan data.
