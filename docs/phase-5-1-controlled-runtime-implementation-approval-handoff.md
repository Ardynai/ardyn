# Phase 5.1 Controlled Runtime Implementation Approval Handoff

Phase 5.1 is the next recommended boundary after Jules's Phase 4.2C approval
was recorded in Phase 4.2D. Phase 5.1 must be an approval and design gate. It
must not automatically add or enable live runtime behavior.

## Scope

Phase 5.1 should create explicit approval-record artifacts for reviewing a
future implementation boundary:

- runtime implementation approval boundary
- runtime command surface review
- denied-by-default runtime command policy
- operator consent scope and expiration
- rollback and kill-switch design

Those records are prerequisites for future controlled implementation work. They
are not themselves runtime implementation, runtime command enablement, or live
runtime enablement.

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
