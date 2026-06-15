# Phase 5.19 Approval Prerequisite Reader Hardening

Phase 5.19 hardens the approval prerequisite reader path used by the Phase 5.18
review-only evaluator. The reader normalizes caller-provided in-memory
prerequisite records and returns deterministic review state only.

This phase is not runtime enablement.

## Artifact

Machine-readable Phase 5.19 artifact path:

`../tests/fixtures/host-policy/phase5-19/approval-prerequisite-reader-hardening.json`

Focused test path:

`../tests/phase5-19-approval-prerequisite-reader-hardening.test.mjs`

Core review-only reader:

`../packages/core/src/index.mjs`

The reader is `readApprovalPrerequisiteRecordsForReview`. It consumes only
caller-provided in-memory objects and returns a review result with:

- `reviewOnly: true`
- `authoritative: false`
- no approval grant
- every runtime-effect field false

Valid prerequisite records must include the required runtime and command-exposure
effect objects with explicit `false` values. Missing, sparse, or non-object
effect data is malformed review input, not a valid prerequisite signal.

The Phase 5.18 helper `evaluateRuntimeApprovalPrerequisitesForReview` now uses
this reader, but remains review-only and non-authorizing.

## Reader Cases

The Phase 5.19 fixture and focused tests pin these reader cases:

- missing prerequisite records
- malformed prerequisite record
- malformed sparse effect record
- revoked prerequisite record
- valid prerequisite records recognized for review only
- duplicate prerequisite record
- stale prerequisite record
- unknown prerequisite record

The valid-prerequisite case is still blocked. It may set
`prerequisiteSignalRecognized: true`, but neither the reader nor the evaluator
can produce or persist an approval grant, enable runtime, expose runtime
commands, or start runtime.

## Runtime Boundary

Phase 5.19 adds no:

- CLI approval prerequisite reader command
- CLI approval evaluator command
- CLI approval grant command
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
does not bypass any approval, grant, command-exposure, reader, evaluator, or
runtime block.

## Handoff

Phase 5.19 creates a deterministic prerequisite reader only. Phase 5.20 adds
source-ingestion preflight for caller-provided in-memory prerequisite sources
while still keeping runtime unavailable. Any later source-selection or
runtime-enablement phase must still keep runtime unavailable until a separate
reviewed grant and runtime enablement boundary exists.

Next source-ingestion preflight doc:

`phase-5.20-approval-prerequisite-source-ingestion-preflight`
