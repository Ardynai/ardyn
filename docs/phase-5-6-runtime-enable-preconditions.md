# Phase 5.6 Runtime Enablement Preconditions

Phase 5.6 records the precondition gate that must pass before any future
runtime enablement. It does not enable runtime behavior, expose a new command,
change `serve-runtime`, implement approval grants, or add any live runtime
surface.

Cross-links:

- Root status: `../README.md`
- CLI status: `../apps/cli/README.md`
- Rust host status: `../crates/ardyn-host/README.md`
- Default-blocked runtime CLI: `phase-5-5-default-blocked-runtime-cli.md`
- Runtime approval validation contract: `phase-5-7-runtime-approval-validation.md`
- Jules review disposition: `phase-5-4a-jules-review-disposition.md`

Machine-readable Phase 5.6 artifact path:

- Runtime enablement precondition gate fixture:
  `../tests/fixtures/host-policy/phase5-6/runtime-enable-precondition-gate.json`
- Focused precondition gate test:
  `../tests/phase5-6-runtime-enable-preconditions.test.mjs`

## Gate Contract

The Phase 5.6 gate is recorded but not satisfied. A future runtime enablement
phase must satisfy every required precondition before runtime can be enabled:

- runtime enablement approval
- runtime command exposure approval
- approval-record validation and revocation
- host-policy runtime enforcement
- stdio safety boundary review
- transcript and failure-audit confinement
- process-control boundary review
- rollback and kill-switch behavior
- approved positive runtime smokes

All of those preconditions are currently `blocked` and `satisfied: false`.
Therefore `runtimeEnabled`, `runtimeCommandEnabled`, `runtimeExecutionEnabled`,
and `canEnableRuntime` remain false.

## Still Blocked

Phase 5.6 preserves the Phase 5.5 default-blocked CLI behavior:
`serve-runtime` and `serve-runtime --dry-run` exit nonzero, write zero stdout,
and write deterministic runtime-unavailable stderr.

Phase 5.6 adds no:

- runtime start path
- live stdin loop
- runtime stdout/stderr writer
- process control
- transcript or audit runtime write
- adapter or Content Fabric runtime behavior
- WebSocket or HTTP runtime control surface
- approval grant or approval evaluator
- Rust-host runtime source change

Phase 5.7 follows this gate by recording runtime approval validation and
rejection cases only. It does not satisfy the full Phase 5.6 gate, enable
runtime, or change `serve-runtime` behavior.

A later runtime enablement phase may only proceed toward runtime enablement
after it explicitly changes one or more preconditions from blocked to satisfied
with corresponding review evidence and tests.
