# Phase 5.29 Non-Authorizing Evaluator Decision-Candidate Boundary

Phase 5.29 adds a deterministic non-authorizing evaluator decision-candidate
boundary for Phase 5.28 `review-only-evaluator-preflight-state` objects. A
valid preflight checkpoint state may produce only an in-memory
`review-only-evaluator-decision-candidate-state`.

Machine-readable Phase 5.29 artifact path:

`../tests/fixtures/host-policy/phase5-29/non-authorizing-evaluator-decision-candidate-boundary.json`

Focused Phase 5.29 test path:

`../tests/phase5-29-non-authorizing-evaluator-decision-candidate-boundary.test.mjs`

Phase 5.30 consumes the Phase 5.29 decision-candidate state as input to a
non-authorizing inspection artifact. That next artifact remains review-only and
still cannot produce evaluator results, approval decisions, approval grants,
runtime permission, command exposure permission, evaluator execution, or runtime
execution.

## Boundary

The boundary consumes only caller-provided Phase 5.28 preflight checkpoint
state. It does not read files, watch directories, perform external lookup,
ingest environment variables or secrets, open network transports, start a
process, expose a runtime command, or execute an evaluator.

Valid evaluator decision-candidate records:

- preflight checkpoint state schema, kind, mode, timestamp, and digest
- source intake checkpoint digest metadata
- Phase 5.24 integrated review summary metadata
- review-only evaluator decision-candidate state metadata
- explicit false approval decision, approval grant, runtime, command exposure,
  evaluator execution, and runtime execution flags

Missing, malformed, invalid timestamp, empty, conflicting, stale, revoked,
unknown, duplicate-invalid, authorizing-looking, grant-looking,
approval-decision-looking, approval-grant-looking, runtime-permission-looking,
command-exposure-looking, evaluator-execution-looking, runtime-effect-true,
process-flag-true, unsafe top-level, unsafe nested decision/preflight/checkpoint
data, and execution-signal-looking checkpoint states fail closed before
decision-candidate state is produced.

## Non-Authorizing State

The Phase 5.29 decision-candidate state is a review artifact only. It is not an
approval decision, not an approval grant, not runtime authorization, and not
command exposure authorization.

The helper continues to return the blocked approval grant stub. Approval
decision fields remain false or null. Runtime effect remains all false.
Evaluator execution flags remain false.

## CLI And Rust

Phase 5.29 adds no:

- CLI evaluator-decision-candidate command
- CLI approval-evaluator decision command
- CLI approval decision command
- CLI approval grant command
- CLI runtime command exposure
- Rust host runtime implementation
- evaluator execution path
- live runtime, process control, stdin loop, stdout/stderr runtime writer,
  transcript/audit runtime writer, adapter runtime behavior, Content Fabric
  runtime behavior, WebSocket surface, or HTTP surface

`serve-runtime` and `serve-runtime --dry-run` remain default-blocked. `--dry-run`
does not bypass blocking.

## Validation

Phase 5.29 records these validation commands:

- `node --test tests/phase5-29-non-authorizing-evaluator-decision-candidate-boundary.test.mjs`
- `node --test tests/phase5-28-review-only-evaluator-preflight-checkpoint.test.mjs`
- `node --test tests/report-phase-status.test.mjs`
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
