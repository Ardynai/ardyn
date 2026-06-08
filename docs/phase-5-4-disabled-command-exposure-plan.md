# Phase 5.4 Disabled Command Exposure Plan

Phase 5.4 is the disabled command exposure plan boundary after the Phase 5.3
command surface approval preflight. It records a disabled command exposure plan for a
possible later CLI implementation phase. It does not add a CLI command, expose
a runtime command surface, approve runtime command exposure, grant approval, or
enable runtime behavior.

Cross-links:

- Root status: `../README.md`
- CLI status: `../apps/cli/README.md`
- Rust host status: `../crates/ardyn-host/README.md`
- Approval source: `phase-5-1-controlled-runtime-implementation-approval-handoff.md`
- Guarded implementation slice: `phase-5-2-guarded-runtime-implementation-slice.md`
- Command-surface preflight: `phase-5-3-command-surface-approval-preflight.md`
- Jules review disposition: `phase-5-4a-jules-review-disposition.md`

## Scope

Phase 5.4 is planning documentation and local status metadata only. It keeps
the guarded Rust-host implementation unexposed and keeps the CLI command
surface unchanged.

Allowed work in this lane:

- record Phase 5.4 as the disabled command exposure plan status-report phase
- document the future CLI implementation checklist required before any command
  exposure
- document the Jules/Devin review packet required if command exposure is
  proposed later
- document rollback and kill-switch expectations for any later exposure phase
- record command-surface diff-risk notes for reviewers
- cross-link Phase 5.4 from the root README, CLI README, Rust host README,
  Phase 5.1 handoff, Phase 5.2 guarded slice, and Phase 5.3 preflight docs
- keep `apps/cli/src/index.mjs` unchanged
- keep Rust source unchanged in this docs/status lane
- keep runtime-like command names rejected until a later approved exposure
  phase explicitly changes that behavior

## Future CLI Implementation Checklist

If a later phase proposes CLI runtime command exposure, the implementation
proposal must include all of the following before changing CLI behavior:

- exact command names, aliases, help text, and denied-by-default behavior
- parser rejection before file reads or runtime work for missing, malformed,
  expired, revoked, or out-of-scope approval records
- approval-record validation for scope, expiration, revocation, operator
  consent, and audit identity
- host-policy enforcement points for approved and denied runtime paths
- bounded stdin loop ownership and stdout JSONL writer ownership
- redacted stderr diagnostics and line-integrity fail-closed behavior
- transcript and failure-audit path confinement
- positive and negative CLI smokes for approved, denied, malformed, expired,
  revoked, and out-of-scope approval records
- rollback, kill-switch, and terminal-state proof

This checklist is not approval to implement or expose those commands.

## Jules/Devin Review Packet

If command exposure is proposed later, the review packet for Jules, Devin, or a
human reviewer must include:

- a short review summary describing the requested exposure and the unchanged
  blocked surfaces
- the exact command-surface diff, including command names, aliases, help text,
  and parser entry points
- evidence for any approved `apps/cli/src/index.mjs` change
- evidence for any Rust-host public-surface diff
- links back to the Phase 5.3 preflight and this Phase 5.4 plan
- denied-path test output proving disabled paths still fail closed
- approved-path test output proving runtime behavior is bounded and audited
- rollback and kill-switch evidence
- explicit non-goals for adapter, Locus, MCP, OpenClaw, plugin, WebSocket/HTTP,
  and Content Fabric runtime behavior

Until this packet is produced and approved in a later phase, runtime command
exposure remains blocked.

## Phase 5.4A Review Disposition

Phase 5.4A records Jules's `APPROVE` disposition for this disabled command
exposure plan. The disposition found no accidental command or runtime exposure,
confirmed `apps/cli/src/index.mjs` content stayed identical to the reviewed
base, confirmed runtime remains blocked, and confirmed the Phase 5.4 tests are
sufficient before the next still-default-blocked CLI command implementation
phase.

Phase 5.4A also verified current `main` already tracks
`apps/cli/src/index.mjs` as mode `100644`, so no chmod correction was applied
by Phase 5.4A. See `phase-5-4a-jules-review-disposition.md`.

## Rollback Plan

Any later exposure phase must be reversible through a reviewed rollback plan:

- provide a single switch or equivalent narrow revert that disables runtime
  command exposure
- remove or disable CLI command registration without changing unrelated review
  commands
- revert any public Rust runtime export if one was introduced
- preserve denied-path stderr shape and empty stdout behavior
- record terminal `aborted` or `rejected` state for blocked rollback paths
- retain transcript and failure-audit confinement
- rerun denied-path smokes after rollback

Phase 5.4 does not add this switch or any runtime registration. It records the
rollback requirements only.

## Command-Surface Diff-Risk Notes

Reviewers should treat the following as high-risk diff areas in any later
command exposure proposal:

- new CLI command registration can accidentally create runtime exposure
- help text or aliases can advertise disabled commands as available
- approval evaluator wiring can confuse implementation approval with runtime
  enablement approval
- stdout/stderr writer ownership can bypass redaction or JSONL framing
- transcript or failure-audit writes can create side effects before approval
- adapter, Locus, MCP, OpenClaw, plugin, WebSocket/HTTP, or Fabric wiring can
  expand the approved scope

## Still Disabled

Phase 5.4 leaves these surfaces disabled:

- runtime command exposure
- runtime command-surface approval
- runtime command-surface enablement
- runtime enablement approval
- approval command exposure
- stdout/stderr writers
- process control
- transcript/audit write side effects
- adapter or Content Fabric runtime behavior
- changes to `apps/cli/src/index.mjs`
- Rust source changes in this docs/status lane
