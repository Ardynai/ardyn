# Phase 5.31 Human/Tool Inspection Disposition Boundary

Phase 5.31 adds a deterministic review-only disposition boundary over the
Phase 5.30 non-authorizing evaluator decision-candidate inspection artifact.

Machine-readable Phase 5.31 artifact path:

`../tests/fixtures/host-policy/phase5-31/human-tool-inspection-disposition-boundary.json`

Focused Phase 5.31 test path:

`../tests/phase5-31-human-tool-inspection-disposition-boundary.test.mjs`

Core review-only helper:

`packages/core/src/index.mjs#createHumanToolInspectionDispositionBoundaryForReview`

## Scope

Valid Phase 5.30 inspection artifacts may produce only:

- review-only human/tool inspection disposition state
- sanitized source inspection-artifact digests
- false/null evaluator-result, approval-decision, approval-grant, runtime, and
  command-exposure fields
- deterministic rejection reasons and runtime-effect metadata

The disposition state is for later human or tool inspection only. It is not an
approval decision, not an evaluator result, not an approval grant, not runtime
permission, and not command exposure permission.

## Fail-Closed Inputs

Phase 5.31 rejects missing, malformed, invalid timestamp, empty, conflicting,
stale, revoked, unknown, duplicate-invalid, authorizing-looking, grant-looking,
approval-decision-looking, approval-grant-looking, evaluator-result-looking,
evaluator-execution-looking, runtime-permission-looking,
command-exposure-looking, runtime-effect-true, process-flag-true, unsafe
top-level, unsafe nested inspection/artifact/disposition data, and
execution-signal-looking inspection artifacts.

Rejected input produces no disposition state and no evaluator result.

## Non-Authorization Boundary

The Phase 5.31 disposition state records:

- `dispositionStateIsApprovalDecision: false`
- `dispositionStateIsApprovalGrant: false`
- `evaluatorResultProduced: false`
- `evaluatorResultPersisted: false`
- `approvalDecisionProduced: false`
- `approvalDecisionPersisted: false`
- `approvalGrantProduced: false`
- `approvalGrantPersisted: false`
- `runtimePermissionGranted: false`
- `commandExposurePermissionGranted: false`
- `evaluatorExecuted: false`
- all runtime-effect fields false

## Runtime Posture

Phase 5.31 adds no:

- evaluator execution
- evaluator result production
- approval decision production
- approval grant production or persistence
- runtime permission grant
- command exposure permission grant
- CLI disposition command
- `serve-runtime` behavior change
- `serve-runtime --dry-run` bypass
- Rust host runtime implementation
- live runtime, process control, stdio loop, runtime writers, transcript/audit
  runtime writes, adapter/Fabric/WebSocket/HTTP surface, filesystem watcher,
  external lookup, or env/secrets ingestion

## Validation

Phase 5.31 records these validation commands:

- `node --test tests/phase5-31-human-tool-inspection-disposition-boundary.test.mjs`
- `npm test`
- `npm run test:schemas`
- `npm run report:phase-status`
- `cargo test --workspace`
- `cargo check --workspace`
- `cargo fmt --check`
- `git diff --check`
- `git diff --cached --check`
- `fallow health --score --hotspots --targets --format json`
- `fallow audit --format json`

## Phase 5.32 Handoff

Phase 5.32 consumes this review-only disposition boundary state into a
review-only disposition aggregation checkpoint. The handoff remains
non-authorizing: it does not perform reviewer routing, execute an evaluator,
produce evaluator results, produce approval decisions, produce or persist
approval grants, grant runtime permission, expose commands, or enable runtime.
