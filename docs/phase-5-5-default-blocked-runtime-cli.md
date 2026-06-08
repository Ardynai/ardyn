# Phase 5.5 Default-Blocked Runtime CLI

Phase 5.5 adds the first CLI-recognized runtime command surface:
`serve-runtime`. The command is recognized only to fail closed by default. It
does not enable runtime behavior, start a runtime, grant approval, or expose an
approved runtime command path.

Cross-links:

- Root status: `../README.md`
- CLI status: `../apps/cli/README.md`
- Rust host status: `../crates/ardyn-host/README.md`
- Approval source: `phase-5-1-controlled-runtime-implementation-approval-handoff.md`
- Guarded implementation slice: `phase-5-2-guarded-runtime-implementation-slice.md`
- Command-surface preflight: `phase-5-3-command-surface-approval-preflight.md`
- Disabled command exposure plan: `phase-5-4-disabled-command-exposure-plan.md`
- Jules review disposition: `phase-5-4a-jules-review-disposition.md`
- Runtime enablement preconditions: `phase-5-6-runtime-enable-preconditions.md`

Machine-readable Phase 5.5 artifact path:

- Default-blocked runtime CLI fixture:
  `../tests/fixtures/command-surface/phase5-5/default-blocked-runtime-cli.json`
- Focused default-blocked CLI guard:
  `../tests/phase5-5-default-blocked-runtime-cli.test.mjs`

## Command Contract

`serve-runtime` is recognized by the CLI and always rejected in Phase 5.5.

Expected behavior:

- exit code: nonzero
- stdout: empty
- stderr: deterministic safe text beginning with
  `Usage: ardyn serve-runtime [--dry-run]`
- runtime state: unavailable and not enabled
- file writes: none
- approval grants: none
- runtime state reads or writes: none

`serve-runtime --dry-run` has the same blocked result. Dry-run mode does not
bypass the runtime-unavailable gate.

## Still Blocked

Phase 5.5 leaves these surfaces disabled:

- runtime enablement
- runtime execution
- runtime command enablement
- approval command exposure
- approval evaluator or grant creation
- live stdin loops
- stdout/stderr runtime writers
- process control
- transcript/audit write side effects
- WebSocket/HTTP runtime control surfaces
- adapter or Content Fabric runtime behavior
- Rust-host runtime source changes

Remaining blockers before any enabled runtime path:

- runtime enablement review
- approved runtime command exposure review
- approval-record validation and revocation
- host-policy runtime enforcement
- bounded stdin loop review
- stdout/stderr writer redaction review
- transcript and failure-audit confinement review
- process-control and terminal-state review
- rollback and kill-switch review
- approved positive runtime smokes

Phase 5.6 records these future runtime enablement requirements as an explicit
machine-readable precondition gate while keeping `serve-runtime`
default-blocked and runtime disabled.
