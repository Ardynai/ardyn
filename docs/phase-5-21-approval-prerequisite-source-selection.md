# Phase 5.21 Approval Prerequisite Source Selection

Phase 5.21 adds deterministic source selection after the Phase 5.20 approval
prerequisite source-ingestion preflight. It handles multiple acceptable
caller-provided in-memory prerequisite sources before any selected source may
feed the Phase 5.19 review-only prerequisite reader.

This phase is not runtime enablement.

## Artifact

Machine-readable Phase 5.21 artifact path:

`../tests/fixtures/host-policy/phase5-21/approval-prerequisite-source-selection-contract.json`

Focused test path:

`../tests/phase5-21-approval-prerequisite-source-selection.test.mjs`

Core review-only selection helper:

`../packages/core/src/index.mjs`

The helper is `selectApprovalPrerequisiteSourcesForReview`. It consumes only
caller-provided in-memory source wrappers already constrained by the Phase 5.20
preflight shape. It does not read files, inspect environment variables, fetch
external data, watch directories, or resolve sources by side effect.

## Selection Cases

The Phase 5.21 fixture and focused tests pin these source-selection cases:

- missing sources
- single valid source selected
- multiple equivalent valid sources selected deterministically
- duplicate equivalent valid sources selected deterministically
- conflicting valid sources rejected fail-closed
- duplicate source id rejected
- stale source rejected
- revoked source rejected
- unknown source rejected
- malformed source rejected
- empty source rejected

When equivalent valid sources are present, selection is deterministic by lowest
`sourceId`. When valid sources conflict, the selection result fails closed and
does not forward any reader input.

The selected-source case is still blocked. It may produce a selected reader
input for review, but the selection helper, preflight helper, reader, and
evaluator cannot produce or persist an approval grant, enable runtime, expose
runtime commands, or start runtime.

## Runtime Boundary

Phase 5.21 adds no:

- filesystem watcher
- external source lookup
- secrets or environment ingestion
- CLI source-selection command
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
does not bypass any source-selection, source-ingestion, reader, evaluator,
grant, command-exposure, or runtime block.

## Handoff

Phase 5.21 creates deterministic source selection only. A future phase may
define a still-review-only approval prerequisite source bundle or source
attestation contract, but any such phase must still keep runtime unavailable
until a separate reviewed grant and runtime enablement boundary exists.

Recommended next slice:

`phase-5.22-approval-prerequisite-source-bundle-contract`
