# Phase 5.18 Review-Only Approval Evaluator Skeleton

Phase 5.18 adds the first review-only approval evaluator skeleton for future
runtime enablement. The evaluator can inspect in-memory prerequisite records
and return deterministic review metadata, but it cannot produce approval
grants, authorize runtime, enable command exposure, start runtime, or execute
runtime behavior.

This phase is not runtime enablement.

## Artifact

Machine-readable Phase 5.18 artifact path:

`../tests/fixtures/host-policy/phase5-18/review-only-approval-evaluator-skeleton.json`

Focused test path:

`../tests/phase5-18-review-only-approval-evaluator-skeleton.test.mjs`

Core review-only helper:

`../packages/core/src/index.mjs`

The helper is `evaluateRuntimeApprovalPrerequisitesForReview`. It consumes only
caller-provided in-memory objects and returns a review result with:

- `reviewOnly: true`
- `authoritative: false`
- no approval grant
- every runtime-effect field false

## Review Cases

The Phase 5.18 fixture and focused tests pin four cases:

- missing prerequisite records
- invalid runtime approval record
- revoked runtime approval record
- valid prerequisite records recognized for review only

The valid-prerequisite case is still blocked. It may set
`prerequisiteSignalRecognized: true`, but the evaluator result remains
non-authorizing and cannot produce or persist an approval grant.

## Runtime Boundary

Phase 5.18 adds no:

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
does not bypass any approval, grant, command-exposure, or runtime block.

## Handoff

Phase 5.18 creates a review-only evaluator shape only. A future phase may add
more prerequisite readers or preflight gates, but any such phase must still keep
the runtime unavailable until a separate reviewed grant and enablement boundary
exists.

Recommended next slice:

`phase-5.19-approval-prerequisite-reader-hardening`

Phase 5.19 is recorded in
`docs/phase-5-19-approval-prerequisite-reader-hardening.md`. It hardens the
reader used by this review-only evaluator while keeping approval grants,
runtime command exposure, and runtime execution blocked.
