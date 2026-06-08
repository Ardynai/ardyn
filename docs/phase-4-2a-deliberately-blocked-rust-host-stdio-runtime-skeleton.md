# Phase 4.2A Deliberately Blocked Rust-Host Stdio Runtime Skeleton

Phase 4.2A adds the first internal Rust-host stdio runtime skeleton while
keeping runtime execution unavailable by construction. The skeleton is library
code under `crates/ardyn-host`; it classifies and plans fixture-shaped stdio
frames in memory, records unavailable lifecycle and approval paths, and returns
deterministic `runtime_unavailable` or blocked results.

It does not add or enable a CLI runtime command, live stdin loop, live stdout
or stderr writer, process control, approval evaluator, runtime approval grant,
adapter behavior, Locus/MCP/OpenClaw/plugin behavior, WebSocket/HTTP control
surface, or Content Fabric runtime behavior.

## Boundary Summary

| Field | Value |
| --- | --- |
| Phase | 4.2A |
| Scope | Internal Rust blocked stdio runtime skeleton |
| Skeleton module | `crates/ardyn-host/src/stdio_runtime/mod.rs` |
| Skeleton fixture | `tests/fixtures/host-policy/phase4-2a/blocked-stdio-runtime-skeleton-plan.json` |
| Focused Node guard | `tests/phase4-2a-blocked-rust-stdio-runtime-skeleton.test.mjs` |
| CLI source changed | No |
| Runtime enabled | No |
| Runtime execution | No |
| Runtime approval granted | No |
| Process stdio ownership | No |
| Live stdin loop | No |
| Live stdout/stderr writer | No |
| External review performed | No |
| Runtime blocked | Yes |

## Skeleton Boundary

The skeleton reuses the Phase 4.1J and 4.1K Rust frame and gate helpers:

- `classify_stdio_runtime_input_stream`
- `parse_stdio_runtime_input_frame_json`
- `stdio_runtime_error_category_for_frame_class`
- `stdio_runtime_stderr_diagnostic_for_error`
- `stdio_runtime_contract_gates`
- `validate_stdio_runtime_contract_gates`

The new internal module adds state, frame-plan, gate-plan, unavailable-error,
blocked-entrypoint, blocked-approval, blocked-execution, and future lifecycle
hook placeholder types. These are pure data and in-memory planning helpers.

Accepted static probe frames may produce a blocked plan, but that plan records
`runtimeEnabled: false`, `approvalGranted: false`, `executionAllowed: false`,
and the entrypoint returns `runtime_unavailable`.

Rejected frames produce deterministic diagnostics as data only. No diagnostic
is written to a live stream by this phase.

## Fixtures

Phase 4.2A reuses:

- `tests/fixtures/stdio-harness/phase4-1j/expected-outcomes.json`
- `tests/fixtures/stdio-harness/phase4-1j/valid-single-event.jsonl`
- `tests/fixtures/stdio-harness/phase4-1j/valid-multiple-events.jsonl`
- `tests/fixtures/stdio-harness/phase4-1j/runtime-approval-request-rejected.jsonl`
- `tests/fixtures/host-policy/phase4-1k/stdio-runtime-contract-gates.json`
- `tests/fixtures/host-policy/phase4-1l/runtime-implementation-readiness.json`

The new 4.2A fixture pins the blocked-skeleton expectation over those inputs
instead of introducing another JSONL frame dialect.

## Still Blocked

The following remain unavailable after Phase 4.2A:

- `serve-runtime`
- `stdio-runtime`
- `replay-session-transcript`
- `external-review-packet`
- `review-packet`
- `runtime-readiness-review`
- `runtime-implementation-readiness`
- `phase-4-2a-runtime-skeleton`
- `runtime-skeleton`
- live stdin reader or command loop
- live stdout/stderr runtime writer
- process stdio ownership, process control, cleanup, or kill behavior
- approval evaluator, host-policy runtime enforcement, or runtime approval grant
- transcript persistence/replay runtime
- failure-audit runtime
- adapter, Locus, MCP, OpenClaw, plugin, WebSocket/HTTP, or Content Fabric
  runtime behavior

## Smoke Probes

The existing dry-run event smoke remains the only successful stdio-shaped CLI
smoke:

```powershell
node apps/cli/src/index.mjs emit-session-events --dry-run --manifest examples/minimal-manifest/ardyn.manifest.json --task examples/minimal-task/task.json
```

Expected shape: exit 0, JSONL-only stdout, LF-only, final LF, six events, and
zero stderr.

Runtime-like commands must continue to fail with nonzero exit and zero stdout.

## Review Note

The targeted external review packet for Devin or Jules should ask whether this
diff accidentally enables runtime behavior, adds a CLI runtime command or live
stdio loop/writer, introduces process control, grants approval, changes adapter
behavior, or leaves the blocked tests insufficient.

No fresh Devin or Jules review is claimed for Phase 4.2A unless that review is
actually performed against this diff.

## Phase 4.2B Follow-Up

Phase 4.2B is documented in
`docs/phase-4-2b-blocked-lifecycle-failure-audit-skeleton.md`. It extends this
private blocked skeleton with planned-only lifecycle, transcript-plan,
failure-audit, and kill-semantics helpers while preserving the same no-runtime,
no-CLI-command, no-process-control, no-write-side-effect boundary.

## Phase 4.2C Follow-Up

Phase 4.2C is documented in
`docs/phase-4-2c-runtime-readiness-review-gate.md`. It uses this blocked
skeleton as evidence for a readiness review gate and Jules/Devin packet, but
does not approve runtime, complete external review, publish the private module,
or enable a CLI runtime command.
