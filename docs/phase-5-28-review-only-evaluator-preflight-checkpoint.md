# Phase 5.28 Review-Only Evaluator Preflight Checkpoint

Phase 5.28 adds a deterministic review-only evaluator preflight checkpoint for
Phase 5.27 `approval-evaluator-candidate-intake-state` objects. A valid intake
checkpoint state may produce only an in-memory
`review-only-evaluator-preflight-state`.

Machine-readable Phase 5.28 artifact path:

`../tests/fixtures/host-policy/phase5-28/review-only-evaluator-preflight-checkpoint.json`

Focused Phase 5.28 test path:

`../tests/phase5-28-review-only-evaluator-preflight-checkpoint.test.mjs`

Phase 5.29 consumes this review-only preflight state as a non-authorizing
evaluator decision-candidate input. The Phase 5.29 boundary still cannot
produce approval decisions, produce approval grants, execute an evaluator, grant
runtime permission, or expose commands.

## Boundary

The checkpoint consumes only caller-provided Phase 5.27 intake checkpoint state.
It does not read files, watch directories, perform external lookup, ingest
environment variables or secrets, open network transports, start a process,
expose a runtime command, or execute an evaluator.

Valid evaluator preflight records:

- intake checkpoint state schema, kind, mode, timestamp, and digest
- source evaluator-input candidate digest
- Phase 5.24 integrated review summary metadata
- review-only evaluator preflight state metadata
- explicit false approval, runtime, command exposure, evaluator execution, and
  runtime execution flags

Missing, malformed, empty, conflicting, stale, revoked, unknown,
duplicate-invalid, authorizing-looking, grant-looking,
runtime-permission-looking, command-exposure-looking, runtime-effect-true,
process-flag-true, unsafe top-level, unsafe nested checkpoint data, and
execution-signal-looking checkpoint states fail closed before preflight state is
produced.

## Non-Authorizing State

The Phase 5.28 preflight checkpoint state is not an approval grant. It cannot
persist an approval grant, grant runtime permission, grant command exposure
permission, enable `serve-runtime`, start runtime, execute runtime, execute an
approval evaluator, write runtime transcripts, or write runtime audit output.

The helper continues to return the blocked approval grant stub. The runtime
effect object remains all false. Evaluator execution flags remain false.

## CLI And Rust

Phase 5.28 adds no:

- CLI review-only-evaluator-preflight command
- CLI approval-evaluator preflight command
- CLI runtime command exposure
- Rust host runtime implementation
- evaluator execution path
- live runtime, process control, stdin loop, stdout/stderr runtime writer,
  transcript/audit runtime writer, adapter runtime behavior, Content Fabric
  runtime behavior, WebSocket surface, or HTTP surface

`serve-runtime` and `serve-runtime --dry-run` remain default-blocked. `--dry-run`
does not bypass blocking.

## Validation

Phase 5.28 records these validation commands:

- `node --test tests/phase5-28-review-only-evaluator-preflight-checkpoint.test.mjs`
- `node --test tests/phase5-27-approval-evaluator-candidate-intake-checkpoint.test.mjs`
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
