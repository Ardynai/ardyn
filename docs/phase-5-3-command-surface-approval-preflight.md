# Phase 5.3 Command Surface Approval Preflight

Phase 5.3 is the command-surface preflight docs/status boundary after the Phase
5.2 guarded runtime implementation slice. It prepares the command-surface approval record
for a possible later runtime command exposure phase. It does not add a CLI
command, expose a runtime command surface, grant approval, or enable runtime
behavior.

Cross-links:

- Root status: `../README.md`
- CLI status: `../apps/cli/README.md`
- Rust host status: `../crates/ardyn-host/README.md`
- Approval source: `phase-5-1-controlled-runtime-implementation-approval-handoff.md`
- Guarded implementation slice: `phase-5-2-guarded-runtime-implementation-slice.md`
- Current disabled command exposure plan: `phase-5-4-disabled-command-exposure-plan.md`

Machine-readable Phase 5.3 artifact path:

- Command-surface approval preflight fixture:
  `../tests/fixtures/command-surface/phase5-3/command-surface-approval-preflight.json`
- Focused command-surface preflight guard:
  `../tests/phase5-3-command-surface-preflight.test.mjs`

## Scope

Phase 5.3 is preflight documentation and status metadata for a future command
contract review. It records the proposed approval boundary without changing
the command surface.

Allowed work in this lane:

- record Phase 5.3 as the local status-report phase for that preflight slice
- document future command contract fields that must exist before exposure
- inventory the Phase 5.3 command-surface fixture path in report metadata
- cross-link Phase 5.3 from the root README, CLI README, Rust host README,
  Phase 5.1 handoff, and Phase 5.2 guarded slice docs
- keep `apps/cli/src/index.mjs` unchanged
- keep runtime-like command names rejected until a later approved exposure
  phase explicitly changes that behavior

## Future Command Contract

If command exposure is proposed later, the proposal must define the command
contract before any implementation changes:

- exact command names, aliases, and denied-by-default behavior
- required approval-grant fields, scope, expiration, revocation, and audit
  semantics
- host-policy enforcement points for approved and denied runtime paths
- stdout JSONL and stderr diagnostic ownership
- transcript and failure-audit write confinement
- rollback, kill-switch, and terminal-state behavior
- positive and negative CLI smokes for approved, missing, expired, revoked,
  malformed, and out-of-scope approval records

This contract is not approved by Phase 5.3. It is the checklist a later command
exposure phase must satisfy before changing CLI behavior.

## Jules/Devin Review Packet If Command Exposure Is Proposed Later

If a later phase proposes runtime command exposure, the review packet for
Jules, Devin, or a human reviewer must include:

- the exact diff that changes the command surface
- the Phase 5.3 preflight fixture and any updated command-surface approval
  fixture
- focused tests proving denied runtime paths still fail closed
- focused tests proving approved runtime paths are bounded and audited
- evidence that `apps/cli/src/index.mjs` changed only in the approved command
  lane
- evidence that runtime enablement remains separate from adapter, Locus, MCP,
  OpenClaw, plugin, WebSocket/HTTP, and Content Fabric runtime behavior

Until that packet is produced and approved in a later phase, the runtime
command surface remains blocked.

## Still Blocked

Phase 5.3 leaves these surfaces disabled:

- runtime command exposure
- runtime command-surface enablement
- runtime enablement approval
- approval command exposure
- stdout/stderr writers
- process control
- transcript/audit write side effects
- adapter or Content Fabric runtime behavior
- changes to `apps/cli/src/index.mjs`

Phase 5.4 follows this preflight as a disabled command exposure plan. It
documents the future CLI checklist, Jules/Devin review packet, rollback plan,
and command-surface diff-risk notes only. It still does not expose runtime
commands, change `apps/cli/src/index.mjs`, grant approval, or enable runtime.
See `phase-5-4-disabled-command-exposure-plan.md`.
