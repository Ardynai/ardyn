# Phase 5.22 Approval Prerequisite Source Bundle

Phase 5.22 adds deterministic bundling after the Phase 5.20 approval
prerequisite source-ingestion preflight and Phase 5.21 source selection. It
groups selected in-memory prerequisite sources into a review-only bundle before
any bundled reader input may feed the Phase 5.19 prerequisite reader and Phase
5.18 evaluator path.

This phase is not runtime enablement.

## Artifact

Machine-readable Phase 5.22 artifact path:

`../tests/fixtures/host-policy/phase5-22/approval-prerequisite-source-bundle-contract.json`

Focused test path:

`../tests/phase5-22-approval-prerequisite-source-bundle.test.mjs`

Core review-only bundle helper:

`../packages/core/src/index.mjs`

The helper is `bundleApprovalPrerequisiteSourcesForReview`. It consumes only
caller-provided in-memory bundle parts. Each required bundle part must be a
`selected-prerequisite-source` part containing in-memory source inputs already
constrained by the Phase 5.20 and Phase 5.21 helper chain. It does not read
files, inspect environment variables, fetch external data, watch directories,
or resolve sources by side effect.

## Bundle Cases

The Phase 5.22 fixture and focused tests pin these source-bundle cases:

- missing bundle parts rejected
- missing required bundle part rejected
- malformed bundle part rejected
- single valid bundle accepted for review only
- duplicate equivalent bundle parts handled deterministically
- conflicting bundle parts rejected fail-closed
- stale source bundle rejected
- revoked source bundle rejected
- unknown source bundle rejected
- malformed source bundle rejected
- empty source bundle rejected

When duplicate equivalent bundle parts are present, selection is deterministic
by lowest `partId`. When valid bundle parts conflict, the bundle result fails
closed and does not forward any reader input.

The valid-bundle case is still blocked. It may produce bundled reader input for
review, but the bundle helper, selection helper, preflight helper, reader, and
evaluator cannot produce or persist an approval grant, enable runtime, expose
runtime commands, or start runtime.

## Runtime Boundary

Phase 5.22 adds no:

- filesystem watcher
- external source lookup
- secrets or environment ingestion
- CLI source-bundle command
- approval prerequisite source bundle command
- approval prerequisite source selection command
- approval prerequisite source preflight command
- approval prerequisite reader command
- approval evaluator command
- approval grant command
- runtime command exposure
- runtime enablement
- runtime execution
- live stdin loop
- runtime stdout/stderr writer
- process spawning, termination, or supervision
- runtime transcript or audit writes
- adapter runtime behavior
- Content Fabric runtime behavior
- WebSocket or HTTP runtime surface
- Rust-host runtime implementation

`serve-runtime` and `serve-runtime --dry-run` remain default-blocked. Dry-run
does not bypass any source-bundle, source-selection, source-ingestion, reader,
evaluator, grant, command-exposure, or runtime block.

## Handoff

Phase 5.22 creates deterministic source bundling only. Phase 5.23 adds a
still-review-only prerequisite bundle consumption checkpoint that summarizes
whether a valid bundle can feed the review-only evaluator path. That checkpoint
must still keep runtime unavailable until a separate reviewed grant and runtime
enablement boundary exists.

Recommended next slice:

`phase-5.23-prerequisite-bundle-consumption-checkpoint`
