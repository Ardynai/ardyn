# Phase 5.1 Controlled Runtime Implementation Approval Handoff

Phase 5.1 is the docs/status boundary after Jules's Phase 4.2C approval was
recorded in Phase 4.2D. Phase 5.1 records approval to proceed with a separate
future controlled runtime implementation phase only. It is an approval and
design gate; it does not add or enable live runtime behavior.

Cross-links:

- Root status: `../README.md`
- CLI status: `../apps/cli/README.md`
- TypeScript core status: `../packages/core/README.md`
- Rust host status: `../crates/ardyn-host/README.md`
- Source disposition: `phase-4-2d-external-review-disposition-phase5-handoff.md`
- Next guarded slice: `phase-5-2-guarded-runtime-implementation-slice.md`
- Current command preflight: `phase-5-3-command-surface-approval-preflight.md`

Machine-readable Phase 5.1 artifacts:

- Approval-boundary fixture:
  `../tests/fixtures/host-policy/phase5-1/controlled-runtime-implementation-approval-boundary.json`
- Command-surface review matrix:
  `../tests/fixtures/command-surface/phase5-1/runtime-command-surface-review-matrix.json`
- Focused guards:
  `../tests/phase5-1-controlled-runtime-implementation-approval-boundary.test.mjs`
  and `../tests/phase5-1-command-surface-review.test.mjs`

## Scope

Phase 5.1 records explicit approval/design status for reviewing a future
implementation boundary:

- runtime implementation approval boundary
- runtime command surface review
- denied-by-default runtime command policy
- operator consent scope and expiration
- rollback and kill-switch design

Those records are prerequisites for future controlled implementation work. They
are not themselves runtime implementation, runtime command enablement, or live
runtime enablement. All runtime enablement flags remain false.

## Current Non-Runtime Effect

Phase 5.1 permits only a later implementation phase to be planned and started
under a separate scope. It has no runtime side effects:

- no runtime command exposure
- no live runtime implementation
- no adapter or Content Fabric runtime behavior
- no stdout or stderr writer
- no process control
- no transcript write side effect
- no failure-audit write side effect
- no change to `apps/cli/src/index.mjs`

## Blockers To Resolve Before Implementation

Phase 5.1 should resolve these blockers at the approval-record and design level
before any live runtime code is added:

- `runtime-implementation-approval`
- `runtime-command-surface-review`

Required evidence:

- exact runtime command names under review
- exact Rust and CLI files allowed to change in the future implementation
- denied-by-default behavior for every missing or expired approval
- operator consent scope, expiration, revocation, and audit fields
- rollback and kill-switch design review
- negative CLI probes proving runtime-like commands still reject until the
  implementation phase explicitly changes them

## Required Design Before Any Live Loop

The first implementation phase after Phase 5.1 must still design and test:

- bounded stdin loop
- redacted stdout JSONL writer
- redacted stderr diagnostic writer
- runtime host-policy enforcement
- transcript and failure-audit path confinement
- process lifecycle start/stop/timeout/cleanup behavior
- nonzero exit and terminal-state mapping
- positive and negative runtime smokes for approved and denied paths

Phase 5.2 began that implementation work only as private Rust-host guarded
planning helpers and fixture-backed blocked-runtime tests. It did not expose
runtime commands, did not change `apps/cli/src/index.mjs`, and did not enable
runtime. Phase 5.3 records command-surface approval preflight docs/status
metadata only and still does not expose runtime commands, change
`apps/cli/src/index.mjs`, or enable runtime. See
`phase-5-2-guarded-runtime-implementation-slice.md` and
`phase-5-3-command-surface-approval-preflight.md`.

## Guarded After Implementation

Even after a controlled runtime implementation exists, these surfaces must
remain separately guarded:

- adapter runtime behavior
- Locus/MCP/OpenClaw/plugin runtime behavior
- WebSocket/HTTP control surfaces
- Content Fabric runtime behavior
- secrets and production signing keys
- plugin installation, torrent download, and code-pack enablement
- approval grants, which must be scope-bound, time-bound, revocable, and
  auditable
- file writes outside approved transcript and audit locations

## Recommended Phase 5.1 Prompt

```text
Start Phase 5.1 Controlled Runtime Implementation Approval from clean main.
Record explicit runtime implementation approval-boundary and runtime
command-surface review artifacts only. Do not implement or enable a live
runtime, CLI runtime command, stdin loop, stdout/stderr writer, process
control, transcript/audit side effects, adapters, or external control
surfaces.
```
