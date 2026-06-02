# Locus Trace Display Contract

Phase 3.6 defines a display contract for Locus, or any other UI, to present
ARDYN planner traces, approval review artifacts, and trace diffs. This is a
viewer contract only. ARDYN adds no Locus runtime dependency, does not import a
Locus SDK, does not call Locus APIs, and does not connect to Locus.

The contract exists so an external UI can render local ARDYN JSON evidence with
consistent labels, severity, and compatibility warnings. It does not add
execution, adapter connections, network behavior, Content Fabric runtime
behavior, install flows, or external CI.

## Contract Boundary

ARDYN is the open-source AI harness/framework. Locus is mission control outside
ARDYN. Multiverse integration remains optional and external. Content Fabric
foundation data remains non-runtime conformance data.

An implementation of this display contract must consume already-produced ARDYN
JSON as inert review evidence. It must not cause ARDYN to start, connect,
install, execute, or fetch anything.

Forbidden behavior:

- Runtime execution.
- Network server or listener startup.
- Adapter connections.
- Real MCP calls.
- Real OpenClaw calls.
- Plugin install.
- Torrent, download, install, or enable flows.
- Content Fabric runtime behavior.
- Code-pack enablement.
- Autonomous loops.
- Secrets collection, secret display, or secret transmission.
- External CI calls or status checks.

Do not display action controls or wording that implies any forbidden behavior.
Acceptable display actions are local viewer actions such as inspect, compare,
filter, collapse, expand, copy inert JSON, export already-rendered evidence, or
open a local review file selected by the user.

## Planner Trace Fields

A UI should display these planner trace fields when present:

| Field | Display purpose |
| --- | --- |
| `command` and `output` | CLI context, such as `plan`, `trace`, `summary`, or `explain`. |
| `schemaVersion` and `phase` | ARDYN contract version and planning phase when viewing a full task plan. |
| `manifest.path` | Local source path when provided by the full task plan wrapper. |
| `manifest.id` | Manifest identity from `plannerTrace.manifest.id`. |
| `manifest.version` | Manifest producer version from `plannerTrace.manifest.version`. |
| `manifest.schemaVersion` | Manifest schema version from `plannerTrace.manifest.schemaVersion`. |
| `taskPath` | Local task source path when provided by the full task plan wrapper. |
| `taskIntake.valid` | Whether task intake was accepted for review. |
| `taskIntake.errors` | Validation errors as review findings, not execution instructions. |
| `taskIntake.taskId` | Reviewed task identifier. |
| `taskIntake.requestedCapabilities` | Requested capability strings in review order. |
| `candidateCapabilities[].request` | Capability request currently being resolved. |
| `candidateCapabilities[].candidates[].capabilityId` | Candidate capability id. |
| `candidateCapabilities[].candidates[].matchType` | `exact`, `tag`, or `scope`. |
| `candidateCapabilities[].candidates[].score` | Ranking score: `300`, `200`, or `100`. |
| `candidateCapabilities[].candidates[].scope` | Permission scope that matched, or `null`. |
| `candidateCapabilities[].candidates[].tag` | Tag that matched, or `null`. |
| `candidateCapabilities[].candidates[].reason` | Deterministic reason for the candidate match. |
| `selectedCapabilities` | Capability ids selected by the highest available tier. |
| `unresolvedRequests` | Requests with no selected capability. |
| `approval.required` | Approval gate summary when viewing the full task plan wrapper. |
| `approval.status` | Planning approval status when viewing the full task plan wrapper. |
| `approval.reasons` | Task or policy reasons requiring approval. |
| `approvalDecision.id` | Review decision id. |
| `approvalDecision.taskId` | Task id attached to the decision. |
| `approvalDecision.requestedCapabilityIds` | Capability ids covered by the decision. |
| `approvalDecision.status` | `required`, `denied`, `granted`, or `not_required`. |
| `approvalDecision.reason` | Deterministic review reason. |
| `approvalDecision.createdAt` | Decision timestamp. |
| `approvalDecision.nonExecuting` | Must display as true; false is a critical error. |
| `safety.*` | Every no-execution safety flag and whether it remains false. |

Candidate lists must preserve lower-ranked candidates. A UI must not hide tag
or scope matches simply because an exact match won. Empty candidates and
unresolved requests are valid review evidence and should be displayed as
unresolved, not treated as a crash.

## Review Artifact Fields

Display these approval review artifact fields:

| Field | Display purpose |
| --- | --- |
| `schema` | Must be `ardyn.approval-review-artifact`. |
| `schemaVersion` | Artifact schema contract version. |
| `version` | Review artifact format version. |
| `generatedAt` | Artifact generation timestamp. |
| `nonExecuting` | Must be true; false is a critical safety violation. |
| `taskId` | Reviewed task identifier. |
| `manifest.id` | Manifest identity. |
| `manifest.version` | Manifest producer version. |
| `manifest.schemaVersion` | Manifest schema contract version. |
| `requestedCapabilityIds` | Capability ids requested by the source plan or trace. |
| `candidateRankings[].request` | Request represented by this ranking group. |
| `candidateRankings[].candidates[].rank` | Deterministic display rank. |
| `candidateRankings[].candidates[].capabilityId` | Candidate capability id. |
| `candidateRankings[].candidates[].matchType` | `exact`, `tag`, or `scope`. |
| `candidateRankings[].candidates[].score` | Ranking score: `300`, `200`, or `100`. |
| `candidateRankings[].candidates[].scope` | Permission scope that matched, or `null`. |
| `candidateRankings[].candidates[].tag` | Tag that matched, or `null`. |
| `candidateRankings[].candidates[].reason` | Deterministic match reason. |
| `selectedCapabilities` | Selected capability ids. |
| `unresolvedRequests` | Requests that remained unresolved. |
| `approvalDecision.id` | Review decision id. |
| `approvalDecision.taskId` | Task id attached to the decision. |
| `approvalDecision.requestedCapabilityIds` | Capability ids covered by the decision. |
| `approvalDecision.status` | `required`, `denied`, `granted`, or `not_required`. |
| `approvalDecision.reason` | Deterministic review reason. |
| `approvalDecision.createdAt` | Decision timestamp. |
| `approvalDecision.nonExecuting` | Must be true; false is a critical error. |
| `safety.*` | Every no-execution safety flag and whether it remains false. |

Review artifact displays should include a compatibility badge derived from
`schema`, `schemaVersion`, and `version`. See
`docs/review-artifact-versioning-policy.md` for the artifact versioning policy.
Unknown fields should be shown in a separate inert metadata area described
below.

For the repo-level CLI workflow that renders local artifact summaries and
explanations, see [README.md](../README.md#phase-34-36-approval-review-artifacts).
The CLI reads local JSON files only and does not connect to Locus.

## Trace Diff Fields

Display these trace diff fields from `review-trace` output:

| Field | Display purpose |
| --- | --- |
| `command` | Should be `review-trace` for CLI output. |
| `output` | `default`, `summary`, or `explain`. |
| `equal` | Whether the compared review inputs are equivalent. |
| `differenceCount` | Count of deterministic differences. |
| `differenceTypes[].type` | Summary mode difference type. |
| `differenceTypes[].path` | Summary mode path for the changed field. |
| `differences[].type` | Full or explain mode difference type. |
| `differences[].path` | Stable path for the changed field. |
| `differences[].left` | Left-side value for value differences. |
| `differences[].right` | Right-side value for value differences. |
| `differences[].added` | Strings added on the right side for array differences. |
| `differences[].removed` | Strings removed from the left side for array differences. |
| `differences[].reason` | Explain mode reviewer-facing reason. |
| `differences[].detail` | Explain mode reviewer-facing detail. |
| `left.schema`, `left.schemaVersion`, `left.version` | Left source artifact summary. |
| `left.task.id` | Left source task id. |
| `left.manifest.id`, `left.manifest.version`, `left.manifest.schemaVersion` | Left source manifest summary. |
| `right.schema`, `right.schemaVersion`, `right.version` | Right source artifact summary. |
| `right.task.id` | Right source task id. |
| `right.manifest.id`, `right.manifest.version`, `right.manifest.schemaVersion` | Right source manifest summary. |
| `nonExecuting` | Must display as true. |
| `safety.*` | Must display every no-execution safety flag as false. |

Known difference types are:

- `task-mismatch`.
- `manifest-mismatch`.
- `requested-capabilities-change`.
- `selected-capabilities-change`.
- `unresolved-requests-change`.
- `approval-requested-capabilities-change`.
- `approval-status-change`.
- `candidate-rankings-change`.

Unknown difference types may be displayed as inert metadata with warning
severity. They must not create new behavior.

## Approval Status Display

Display `approvalDecision.status` with these rules:

| Status | Label | Severity | Display rule |
| --- | --- | --- | --- |
| `required` | Approval required | `warning` | Show the task as awaiting human review before any future execution phase. Do not show run, connect, install, or enable controls. |
| `denied` | Denied in review | `critical` | Show the task as blocked by review. Do not call cancellation hooks or adapter cleanup because no runtime action was started. |
| `granted` | Granted for review only | `notice` | Show that the simulated review decision granted the plan, but repeat that execution is still impossible in Phase 3.6. |
| `not_required` | Approval not required | `ok` | Show that this plan has no approval gate, while still displaying `nonExecuting: true` and false safety flags. |

If both `approval.status` and `approvalDecision.status` are present, display
both. `approvalDecision.status` is the stable decision status for review
artifacts. A mismatch between the gate summary and decision status should be a
warning finding unless validation marks the artifact malformed.

## Compatibility Display

Display compatibility as a derived review state. The UI may compute this state
or consume the Phase 3.6 display helper output, but ARDYN does not call the UI
to ask for it.

| Compatibility state | Severity | Display rule |
| --- | --- | --- |
| `compatible` | `ok` | `schema` is `ardyn.approval-review-artifact`, both version fields are semver, and both major versions are supported. Interpret known fields normally, preserve unknown fields as inert metadata, and show validation warnings if exact full validation does not accept the version. |
| `unsupported_major` | `critical` | At least one version major is unsupported. Show identity, version, and raw inert metadata only. Do not interpret approval, safety, or candidate semantics as current. |
| `malformed` | `critical` | The input is not an object, `schema` is missing or wrong, or a version field is absent or not semver. Show validation errors and raw inert metadata only. |

Current artifacts use `schemaVersion: "0.1.0"` and `version: "0.1.0"`.
Consumers should use the documented support matrix rather than assuming that
future artifacts are safe to execute or connect. Same-major patch and minor
compatibility is an inert display policy only; full artifact validation remains
exact-version until a future phase updates that contract.

## Severity Mapping

Use a small display severity set: `critical`, `warning`, `notice`, `ok`, and
`metadata`.

| Condition | Severity | Display rule |
| --- | --- | --- |
| Exact current compatible artifact or trace | `ok` | Render normal review fields. |
| Compatible same-major artifact with exact-version validation warnings | `warning` | Render known fields only, preserve unknown fields, and warn that display may be incomplete. |
| Unsupported major version | `critical` | Do not interpret review semantics beyond identity/version. |
| Malformed artifact or invalid JSON | `critical` | Show validation errors and raw inert metadata only. |
| Missing or wrong `schema` | `critical` | Do not treat the object as an ARDYN review artifact. |
| `nonExecuting` is not true | `critical` | Treat as a safety violation. |
| Any safety flag is not false | `critical` | Treat as a safety violation. |
| Required safety flag is missing | `critical` | Treat as malformed because the no-execution proof is incomplete. |
| `approvalDecision.status: "denied"` | `critical` | Show as blocked in review only. |
| `approvalDecision.status: "required"` | `warning` | Show as awaiting human approval before any future execution phase. |
| `approvalDecision.status: "granted"` | `notice` | Show as granted for review only, with no runtime permission. |
| `approvalDecision.status: "not_required"` | `ok` | Show as no approval gate required. |
| `unresolvedRequests` is non-empty | `warning` | Show every unresolved request and keep review incomplete until explained. |
| New unresolved request in a trace diff | `warning` | Highlight as a review finding. |
| Removed unresolved request in a trace diff | `notice` | Highlight as changed review evidence. |
| Selected capability change | `warning` | Highlight as a review finding requiring explanation. |
| Candidate ranking change | `warning` | Highlight as a review finding requiring explanation. |
| Approval status change | `warning` | Highlight as a review finding; keep denied as `critical` when the resulting status is denied. |
| Unknown top-level or nested field | `metadata` | Preserve and display under inert metadata. Do not interpret as a command. |
| Unknown difference type | `warning` | Display as an unrecognized diff record and do not create behavior. |

Safety flags currently include `executionEnabled`, `toolExecutionEnabled`,
`autonomousExecutionEnabled`, `productionToolExecutionEnabled`,
`apiCallsEnabled`, `networkListening`, `longRunningServicesStarted`,
`processesSpawned`, `pluginInstallEnabled`, `torrentDownloadEnabled`,
`codePackEnablementEnabled`, and `agentLoopEnabled`. All must remain false in
Phase 3.6 display evidence.

## Unknown Field Policy

Unknown fields must be preserved and displayed as inert metadata. They must not
be interpreted as commands, permissions, approvals, adapter instructions,
install requests, network targets, secrets, or execution hints.

Display unknown fields separately from known review fields:

- Show the JSON path.
- Show the JSON type.
- Show a bounded value preview, redacted by the UI if it matches local secret
  redaction policy.
- Keep the original value available only as inert metadata for review export.

Unknown fields with names such as `execute`, `run`, `connect`, `install`,
`download`, `enable`, `mcp`, `openclaw`, `plugin`, `torrent`, `secret`,
`token`, or `ci` are still metadata only. They do not authorize UI controls,
network calls, adapter calls, installation, secret handling, external CI, or
ARDYN runtime behavior.

## Display Wording

Use wording that keeps review separate from execution:

- Prefer "review", "display", "compare", "artifact", "trace", "finding", and
  "approval record".
- Avoid "run", "start", "connect", "install", "enable", "serve", "seed",
  "call MCP", "call OpenClaw", "execute", "deploy", or "trigger CI".
- When showing `granted`, say "granted for review only" rather than "approved
  to run".
- When showing Content Fabric references, say "conformance metadata" or
  "non-runtime fixture evidence" rather than "available to install".

The display contract is complete when a UI can inspect ARDYN evidence without
changing ARDYN state or implying that a later execution-adjacent phase already
exists.
