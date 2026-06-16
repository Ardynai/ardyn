# Phase 5.27 Approval-Evaluator Candidate Intake Checkpoint

Phase 5.27 adds a deterministic review-only intake checkpoint for Phase 5.26
`review-artifact-evaluator-input-candidate` objects. A valid candidate may
produce only an in-memory `approval-evaluator-candidate-intake-state`.
Phase 5.28 consumes that state as review-only evaluator preflight input without
granting approval or executing an evaluator.

Machine-readable Phase 5.27 artifact path:

`../tests/fixtures/host-policy/phase5-27/approval-evaluator-candidate-intake-checkpoint.json`

Focused Phase 5.27 test path:

`../tests/phase5-27-approval-evaluator-candidate-intake-checkpoint.test.mjs`

## Boundary

The checkpoint consumes only caller-provided evaluator-input candidates. It does
not read files, watch directories, perform external lookup, ingest environment
variables or secrets, open network transports, start a process, or expose a
runtime command.

Valid candidate intake records:

- candidate schema, kind, mode, timestamp, and digest
- source review artifact summary
- Phase 5.24 integrated review summary metadata
- review-only checkpoint state metadata
- explicit false approval, runtime, command exposure, and execution flags

Missing, malformed, empty, conflicting, stale, revoked, unknown,
duplicate-invalid, authorizing-looking, runtime-effect-true, process-flag-true,
and otherwise unsafe candidates fail closed before checkpoint state is produced.

## Non-Authorizing State

The Phase 5.27 checkpoint state is not an approval grant. It cannot persist an
approval grant, grant runtime permission, grant command exposure permission,
enable `serve-runtime`, start runtime, execute runtime, write runtime
transcripts, or write runtime audit output.

The helper continues to return the blocked approval grant stub. The runtime
effect object remains all false.

## CLI And Rust

Phase 5.27 adds no:

- CLI approval-evaluator-candidate-intake command
- CLI runtime command exposure
- Rust host runtime implementation
- live runtime, process control, stdin loop, stdout/stderr runtime writer,
  transcript/audit runtime writer, adapter runtime behavior, Content Fabric
  runtime behavior, WebSocket surface, or HTTP surface

`serve-runtime` and `serve-runtime --dry-run` remain default-blocked. `--dry-run`
does not bypass blocking.

## Validation

Phase 5.27 records these validation commands:

- `node --test tests/phase5-27-approval-evaluator-candidate-intake-checkpoint.test.mjs`
- `node --test tests/phase5-26-review-artifact-evaluator-input-handoff.test.mjs`
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
