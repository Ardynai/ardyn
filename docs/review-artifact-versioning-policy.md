# Review Artifact Versioning Policy

Phase 3.6 defines the review-artifact versioning and display policy for
planning evidence. The policy applies to local ARDYN approval review artifacts,
planner trace displays, and trace diffs. It does not add runtime execution,
adapter connections, Locus integration, network behavior, Content Fabric runtime
behavior, plugin installation, process spawning, secrets access, or external CI.

ARDYN remains the open-source AI harness/framework. Locus is mission control
outside ARDYN and may later view ARDYN evidence through public ARDYN contracts,
but ARDYN must not add a Locus runtime dependency.

## Current Artifact Contract

The current approval review artifact identity is:

| Field | Current value | Meaning |
| --- | --- | --- |
| `schema` | `ardyn.approval-review-artifact` | Stable artifact schema id. Inputs without this exact value are not ARDYN approval review artifacts. |
| `schemaVersion` | `0.1.0` | ARDYN planner/review schema contract version. |
| `version` | `0.1.0` | Approval review artifact format version. |

`schemaVersion` and `version` are semantic version strings. The full artifact
validator currently pins both to `0.1.0`. The Phase 3.6 display compatibility
helper uses the major component to decide whether an inert display can preserve
and render known fields.

Known top-level artifact fields are:

- `schema`
- `schemaVersion`
- `version`
- `generatedAt`
- `nonExecuting`
- `taskId`
- `manifest`
- `requestedCapabilityIds`
- `candidateRankings`
- `selectedCapabilities`
- `unresolvedRequests`
- `approvalDecision`
- `safety`

All artifacts must keep `nonExecuting: true`,
`approvalDecision.nonExecuting: true`, and every safety flag false. Any other
value is a critical safety violation for review.

## Version Semantics

`schema` identifies the artifact family. It is not versioned and must match
`ardyn.approval-review-artifact` exactly.

`schemaVersion` identifies the ARDYN planner/review contract that produced the
artifact. A future schema-version change can affect the meaning of manifest,
task, trace, or safety fields.

`version` identifies the approval review artifact format. A future artifact
version can add display metadata or new review fields while preserving the same
planner schema version.

Consumers should treat both version fields as part of the compatibility check.
An artifact is display-compatible only when `schema` is correct and both
`schemaVersion` and `version` are valid semantic versions with a supported
major component.

## Compatible Patch And Minor Behavior

For Phase 3.6, supported major is `0` for both `schemaVersion` and `version`.

The display compatibility helper classifies same-major artifacts as
`compatible`. That includes the current exact `0.1.0` contract and future
`0.x.y` patch or minor artifacts. Same-major compatibility is an inert display
policy only:

- Display known fields normally.
- Preserve unknown fields as inert metadata.
- Keep validation errors visible if full validation does not accept the exact
  version.
- Do not treat compatibility as approval to execute, connect, install, enable,
  serve, call MCP/OpenClaw, run external CI, or change ARDYN state.

The full artifact validator remains stricter than the display compatibility
helper. It accepts only the exact current contract until a future phase updates
the validator and fixtures for a new artifact version.

## Major-Version Rejection

If either `schemaVersion` or `version` has an unsupported major version, the
compatibility state is `unsupported_major`.

For unsupported major artifacts, displays may show only identity, version, raw
inert metadata, and validation errors. They must not interpret approval status,
candidate ranking, safety, or execution posture as current semantics.

If `schema` is missing or not `ardyn.approval-review-artifact`, or if either
version field is absent or not semver, the compatibility state is `malformed`.
Malformed inputs are review metadata only and must not be treated as ARDYN
approval review artifacts.

## Unknown Field Policy

Unknown fields must be preserved and displayed as inert metadata. They must not
be interpreted as commands, permissions, approvals, adapter instructions,
network targets, install requests, Content Fabric enablement, secrets, or CI
instructions.

Display policy:

- Preserve unknown top-level fields by key.
- Sort unknown top-level keys deterministically by ASCII order.
- Show the JSON path, JSON type, and a bounded preview when rendered by a UI.
- Apply local secret redaction policy before showing previews.
- Keep unknown values separate from known review fields.
- Do not use unknown fields to create buttons, links, adapter calls, or runtime
  behavior.

Phase 3.6 display normalization preserves unknown top-level extension blocks.
Forward-compatible producers should put extension data in top-level metadata
objects until the field becomes part of a formally versioned artifact contract.

## Display Summary Policy

The display summary is a compact local review view over an artifact. It should
include:

- Compatibility state and full validation state.
- `schema`, `schemaVersion`, `version`, `generatedAt`, and `taskId`.
- Manifest id, version, and schema version.
- Approval decision status, reason, timestamp, and non-executing flag.
- Counts for requested capabilities, selected capabilities, unresolved
  requests, candidate-ranking groups, total candidates, and unknown fields.
- Requested capability ids, selected capability ids, unresolved requests, and
  per-request top candidates.
- Unknown top-level field names.
- Safety summary with `nonExecuting` and every safety flag.
- Validation errors.

Displays should use the severity and approval-status mapping in
`docs/locus-trace-display-contract.md`. The summary is still evidence only; it
must not create an action path.

For the repo-level CLI workflow that renders this summary from a local artifact
file, see [README.md](../README.md#phase-34-36-approval-review-artifacts).
That workflow is local-file-only and does not connect to Locus.

## Deterministic Timestamp Guidance

Tests and fixtures should use deterministic timestamps so review artifacts and
display summaries stay stable across machines.

Use fixed ISO timestamps in fixtures:

- `generatedAt: "2026-06-02T00:00:00.000Z"` for committed review-artifact
  examples.
- `approvalDecision.createdAt: "1970-01-01T00:00:00.000Z"` for deterministic
  approval decision fixtures.

When calling core helpers in tests, pass an explicit `generatedAt` option or
use committed fixtures. Do not depend on wall-clock time for snapshot-like
review evidence.

## Related Documents

- [README.md](../README.md#phase-34-36-approval-review-artifacts) shows the
  local `review-artifact --summary` and `review-artifact --explain` examples.
- `docs/locus-trace-display-contract.md` defines Locus-facing fields, severity
  mapping, approval status display, and the no-runtime-dependency boundary.
- `docs/planner-policy-review.md` defines planning review policy and approval
  semantics.
- `docs/planner-trace-review-workflow.md` defines the reviewer workflow for
  planner traces, review artifacts, and trace diffs.
