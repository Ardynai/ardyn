# Phase 4.0G Host Policy Review Comparison

Phase 4.0G adds static display-only comparison support for Phase 4.0F
host-policy review records. It exists for Devin/Codex review workflows that
need deterministic handoff evidence across review artifacts. It does not start
or control runtime behavior. This phase does not start runtime behavior and
does not approve runtime behavior.

The comparison helpers are TypeScript core display helpers only:

- `classifyHostPolicyReviewRecordCompatibility(record)`
- `normalizeHostPolicyReviewRecordForDisplay(record)`
- `buildHostPolicyReviewRecordDisplaySummary(record)`
- `compareHostPolicyReviewRecords(left, right)`
- `formatHostPolicyReviewRecordComparisonJson(comparison)`

They do not read files, read stdin, print to stdout, write files, start a
listener, spawn subprocesses, call adapters, connect to Locus, call MCP or
OpenClaw, execute plugins, download or enable Content Fabric packs, handle
secrets, load production signing keys, persist transcripts, replay transcripts,
or run tasks.

## Comparison Output

`compareHostPolicyReviewRecords()` returns deterministic JSON-compatible data
with schema `ardyn.host-policy-review-record-comparison`, schema version
`0.1.0`, and comparison phase
`phase-4.0g-host-policy-review-comparison`.

The comparison records these review fields:

- record kind
- record version
- reviewed phase
- policy contract version
- policy metadata schema and version
- policy metadata digest algorithm and hex value
- runtime status
- non-execution invariant summary
- compatibility classification
- approval and rejection metadata
- warnings metadata
- errors metadata

Every difference is marked as `reviewEvidenceOnly: true` and
`grantsRuntimeApproval: false`. The top-level `comparisonDecision` also keeps
`runtimeApprovalGranted` and `runtimeApprovalDerivedFromComparison` false.
Approval and rejection fields remain inert review metadata even when a static
record says a review was approved or rejected.

## Fail-Closed Cases

The display classifier is intentionally tolerant enough to compare malformed or
unsupported records as inert evidence. It still fails closed for current
review semantics:

- unsupported major records classify as `unsupported_major`
- malformed records classify as `malformed`
- rejected permissive policy records classify as `rejected_policy`
- policy metadata digest mismatches are review evidence only and fail closed
- runtime-status mismatches classify as malformed and fail closed

Same-major future-minor records classify as `upgrade_available`. They may be
displayed as inert metadata, but exact-current validation is not granted.

## Fixtures

Deterministic comparison fixtures live under
`tests/fixtures/host-policy/phase4-0g/`:

- `identical-current-host-policy-review-comparison.json`
- `same-major-future-minor-upgrade-available-host-policy-review-comparison.json`
- `unsupported-major-fail-closed-host-policy-review-comparison.json`
- `malformed-missing-schema-version-host-policy-review-comparison.json`
- `rejected-permissive-policy-host-policy-review-comparison.json`
- `policy-digest-mismatch-host-policy-review-comparison.json`
- `runtime-status-mismatch-host-policy-review-comparison.json`

These fixtures are LF-terminated JSON evidence for tests and handoff review.
They are not runtime configuration files and are not consumed by a live host
loop.

## Still Forbidden

Phase 4.0G adds no CLI command, Rust runtime helper, stdio reader, stdout
printer, file writer, listener, server, subprocess supervisor, adapter call,
Locus runtime dependency, MCP/OpenClaw call, plugin execution path, Content
Fabric runtime behavior, autonomous loop, secret handling path, production
signing-key path, transcript persistence/replay runtime, WebSocket surface,
HTTP control surface, runtime approval grant, or task execution behavior.

A future live runtime remains blocked until a separate approved phase defines
explicit host policy, implementation, tests, and runtime enablement.
