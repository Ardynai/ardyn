# Phase 5.20 Approval Prerequisite Source Ingestion Preflight

Phase 5.20 adds a deterministic preflight layer for future approval prerequisite
source ingestion. It classifies caller-provided source inputs before they may
feed the Phase 5.19 review-only prerequisite reader.

This phase is not runtime enablement.

## Artifact

Machine-readable Phase 5.20 artifact path:

`../tests/fixtures/host-policy/phase5-20/approval-prerequisite-source-ingestion-preflight.json`

Focused test path:

`../tests/phase5-20-approval-prerequisite-source-ingestion-preflight.test.mjs`

Core review-only preflight helper:

`../packages/core/src/index.mjs`

The helper is `preflightApprovalPrerequisiteSourcesForReview`. It accepts only
caller-provided in-memory source wrappers with:

- `sourceKind: "inline-prerequisite-records"`
- `sourceMode: "in-memory"`
- a non-empty `sourceId`
- a `records` array

It rejects filesystem, URL, environment, secret, watcher, and external lookup
descriptors. It does not read files, inspect environment variables, fetch
external data, watch directories, or resolve sources by side effect.

## Preflight Cases

The Phase 5.20 fixture and focused tests pin these source classifications:

- missing source inputs
- malformed source input
- empty source input
- duplicate source input
- stale prerequisite source input
- unknown prerequisite source input
- revoked prerequisite source input
- valid prerequisite source input for review only

Accepted source inputs may feed only the Phase 5.19
`readApprovalPrerequisiteRecordsForReview` path. Rejected source inputs fail
closed before reader forwarding.

The valid-source case is still blocked. It may produce an accepted reader input
for review, but the preflight helper, reader, and evaluator cannot produce or
persist an approval grant, enable runtime, expose runtime commands, or start
runtime.

## Runtime Boundary

Phase 5.20 adds no:

- filesystem watcher
- external source lookup
- secrets or environment ingestion
- CLI source-ingestion command
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
does not bypass any source-ingestion, reader, evaluator, grant,
command-exposure, or runtime block.

## Handoff

Phase 5.20 creates a deterministic source-ingestion preflight only. A future
phase may define a still-review-only prerequisite source selection or source
bundle contract, but any such phase must still keep runtime unavailable until a
separate reviewed grant and runtime enablement boundary exists.

Recommended next slice:

`phase-5.21-approval-prerequisite-source-selection-contract`
