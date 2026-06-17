# Phase 5.40 Review-Only Checkpoint Handoff Layer

Phase 5.40 adds a deterministic review-only checkpoint handoff layer over the
Phase 5.39 inspection handoff checkpoint. The output is checkpoint/handoff
metadata for later review only.

Machine-readable Phase 5.40 artifact path:

`tests/fixtures/host-policy/phase5-40/review-only-checkpoint-handoff-layer.json`

Focused Phase 5.40 test path:

`tests/phase5-40-review-only-checkpoint-handoff-layer.test.mjs`

Core helper:

`packages/core/src/index.mjs#createReviewOnlyCheckpointHandoffLayerForReview`

## Scope

The Phase 5.40 helper consumes only Phase 5.39 review-only inspection handoff
checkpoint state and may produce only:

- review-only checkpoint handoff layer state
- digest-only source checkpoint references
- non-authorizing checkpoint/handoff summary metadata
- installed cleanup/hardening toolkit validation evidence references

It does not consume filesystem paths, URLs, environment variables, secrets, live
source lookups, watcher events, stdin/stdout/stderr runtime streams, adapter
surfaces, Fabric surfaces, WebSocket/HTTP surfaces, or Rust-host runtime data.

## Fail-Closed Inputs

Phase 5.40 rejects missing, malformed, invalid timestamp, empty, conflicting,
stale, revoked, unknown, duplicate-invalid, authorizing-looking, grant-looking,
approval-decision-looking, approval-grant-looking, evaluator-result-looking,
evaluator-execution-looking, reviewer-routing-looking,
reviewer-assignment-looking, runtime-permission-looking,
command-exposure-looking, runtime-effect-true, process-flag-true, unsafe
top-level, unsafe nested checkpoint/handoff metadata, and
execution-signal-looking checkpoint metadata.

Rejected inputs produce no checkpoint handoff layer state.

## Checkpoint Handoff Layer

The Phase 5.40 layer records:

- the source Phase 5.39 checkpoint schema, kind, review mode, timestamp, and
  digest
- digest-only upstream checkpoint references
- installed cleanup/hardening toolkit validation evidence references
- a checkpoint handoff summary with reviewer routing, reviewer assignment,
  evaluator execution, evaluator result, approval decision, approval grant,
  runtime permission, command exposure permission, and runtime execution all
  false

The checkpoint handoff layer is not:

- reviewer routing
- reviewer assignment
- evaluator execution
- evaluator result
- approval decision
- approval grant
- runtime permission
- command exposure permission
- runtime execution signal

## Runtime Posture

Phase 5.40 adds no:

- CLI command
- cleanup-tool installation
- MegaLinter run
- broad Trunk rewrite
- Rust-host runtime implementation
- live runtime process control
- stdin loop
- stdout/stderr runtime writer
- transcript or audit runtime write
- filesystem watcher
- external lookup
- env or secrets ingestion
- adapter, Fabric, WebSocket, or HTTP runtime surface

`serve-runtime` remains default-blocked. `serve-runtime --dry-run` remains
blocked and cannot bypass runtime disablement.

## Validation

Phase 5.40 records these required validation commands:

- `node --test tests/phase5-40-review-only-checkpoint-handoff-layer.test.mjs`
- `node --test tests/report-phase-status.test.mjs`
- `npm test`
- `npm run test:schemas`
- `npm run report:phase-status`
- `cargo test --workspace`
- `cargo check --workspace`
- `cargo fmt --check`
- `cargo clippy --workspace -- -D warnings`
- `npm audit --json`
- `cargo audit`
- `cargo machete`
- `git diff --check`
- `git diff --cached --check`
- `fallow health --score --hotspots --targets --format json`
- `fallow audit --format json`

Optional advisory checks may run only when they do not require installation,
login, broad rewrites, large image pulls, or non-actionable churn:

- `knip`
- `depcheck`
- `osv-scanner scan .`
- `trivy fs --scanners vuln,secret,misconfig .`
- `semgrep --config auto .`
