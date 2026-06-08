# Phase 4.2B Blocked Lifecycle And Failure-Audit Skeleton

Phase 4.2B extends the private Rust-host stdio runtime skeleton with
planned-only lifecycle, transcript-plan, failure-audit, and kill-semantics
helpers. The code lives under `crates/ardyn-host` and remains internal to the
crate. It models start, stop, kill, and execute requests as deterministic
blocked plans.

It does not add or enable a CLI runtime command, live stdin loop, live stdout
or stderr writer, child process spawn, process kill, process signal, poll,
wait, transcript write, failure-audit write, approval evaluator, runtime
approval grant, adapter behavior, Locus/MCP/OpenClaw/plugin behavior,
WebSocket/HTTP control surface, or Content Fabric runtime behavior.

## Boundary Summary

| Field | Value |
| --- | --- |
| Phase | 4.2B |
| Scope | Internal Rust blocked lifecycle/failure-audit skeleton |
| Skeleton module | `crates/ardyn-host/src/stdio_runtime/mod.rs` |
| Skeleton fixture | `tests/fixtures/host-policy/phase4-2b/lifecycle-failure-audit-skeleton-plan.json` |
| Focused Node guard | `tests/phase4-2b-blocked-lifecycle-failure-audit-skeleton.test.mjs` |
| CLI source changed | No |
| Runtime enabled | No |
| Runtime execution | No |
| Runtime approval granted | No |
| Process control | No |
| Transcript writes | No |
| Failure-audit writes | No |
| External review performed | No |
| Runtime blocked | Yes |

## Skeleton Boundary

The skeleton reuses the Phase 4.2A frame and gate planning helpers, then adds
planned-only lifecycle data:

- `plan_stdio_runtime_lifecycle_transition`
- `blocked_stdio_runtime_start_request`
- `blocked_stdio_runtime_stop_request`
- `blocked_stdio_runtime_kill_request`
- `blocked_stdio_runtime_execute_request`
- `stdio_runtime_lifecycle_unavailable_error`

Each lifecycle action returns unavailable or blocked state data. The structs
record that no process was started, stopped, killed, signaled, polled, or
waited on. Transcript and failure-audit outputs are plans only; this phase
does not allocate paths or write files.

## Fixtures

Phase 4.2B reuses:

- `tests/fixtures/host-policy/phase4-2a/blocked-stdio-runtime-skeleton-plan.json`
- `tests/fixtures/host-policy/phase4-1e/valid-static-failure-audit-record.json`
- `tests/fixtures/host-policy/phase4-1e/runtime-cleanup-kill-attempt-record.json`
- `tests/fixtures/host-policy/phase4-1d/valid-static-transcript-persistence-contract.json`
- `tests/fixtures/host-policy/phase4-1k/stdio-runtime-contract-gates.json`
- `tests/fixtures/host-policy/phase4-1l/runtime-implementation-readiness.json`

The new 4.2B fixture pins blocked start, stop, kill, and execute expectations,
plus false runtime-effect fields for process control, transcript persistence,
failure-audit emission, cleanup, kill, signal, timeout, and external IO.

## Still Blocked

The following remain unavailable after Phase 4.2B:

- `serve-runtime`
- `stdio-runtime`
- `replay-session-transcript`
- `external-review-packet`
- `review-packet`
- `runtime-readiness-review`
- `runtime-implementation-readiness`
- `phase-4-2a-runtime-skeleton`
- `runtime-skeleton`
- `runtime-lifecycle`
- `phase-4-2b-lifecycle-runtime`
- `phase-4-2b-failure-audit`
- `failure-audit-runtime`
- `cleanup-runtime`
- `kill-runtime`
- live stdin reader or command loop
- live stdout/stderr runtime writer
- process stdio ownership, process spawn, process control, cleanup, signal, or kill behavior
- transcript persistence/replay runtime
- failure-audit runtime or audit-file emission
- approval evaluator, host-policy runtime enforcement, or runtime approval grant
- adapter, Locus, MCP, OpenClaw, plugin, WebSocket/HTTP, or Content Fabric runtime behavior

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
diff accidentally adds live process control, child process management,
kill/signal behavior, runtime execution, runtime command exposure, or write
side effects; whether lifecycle/failure-audit helpers stay planning-only and
fail-closed; and whether blocked-path tests are sufficient for this phase.

No fresh Devin or Jules review is claimed for Phase 4.2B unless that review is
actually performed against this diff.
