# Phase 4.1A Host-Policy Approval Records

Phase 4.1A defines versioned host-policy approval records and operator-consent
fields as static review/audit artifacts only. It does not implement a live
runtime, a runtime command, host-policy enforcement, process stdio ownership,
or any path that can grant runtime approval.

The Phase 4.1A Rust helpers live in `crates/ardyn-host/src/lib.rs` and expose
typed metadata plus deterministic JSON serialization/classification helpers.
They return strings, typed records, and classification values only. They do
not write files, print stdout, read stdin, start a listener/server, spawn a
subprocess, connect adapters, call Locus, call MCP/OpenClaw, execute plugins,
enable Content Fabric, handle secrets, load production signing keys, persist
transcripts, replay transcripts, or consume records in a live host loop.

## Record Shape

The approval-record schema is `ardyn.host-policy-approval-record` at
`schemaVersion` `0.1.0`. The current `recordPhase` is
`phase-4.1a-host-policy-approval-records`, and the record kind is
`host-policy-approval-record`.

Each record contains:

- `recordKind`, `schemaVersion`, `recordPhase`, and `reviewedPhase`.
- `approvalTarget`, including the future runtime target and command names
  `serve-runtime` and `stdio-runtime`.
- `operatorConsent`, including consent identity, consent scope, and explicit
  consent fields for process stdio ownership, stdin lifecycle control, stdout
  JSONL ownership, stderr diagnostic ownership, process termination control,
  transcript persistence review, and failure audit record emission.
- `runtimeCapabilityRequest`, currently limited to `live-stdio-runtime`.
- `approvalStatus`, `validity`, `runtimeEffect`, denial/fail-closed reasons,
  and audit metadata.
- `currentRecordRuntimeStatement`, which explicitly states that current records
  do not enable runtime.
- `nonExecutionInvariantSummary`, which carries the existing no-runtime
  invariant list forward from the Phase 4.0D through Phase 4.1 proposal path.

## Classification States

Phase 4.1A classifies records into these static review states:

- `valid_review_record`: exact-current, deterministic, LF-only review metadata.
  It may record operator consent and an approval status, but it still does not
  enable runtime.
- `missing_operator_consent`: required operator-consent fields are absent,
  incomplete, or false.
- `expired_or_not_yet_valid`: the validity window does not include the
  deterministic evaluation point.
- `unsupported_version`: the schema version is unsupported for exact-current
  review.
- `malformed`: JSON is invalid, CRLF is present, required fields are missing,
  unknown exact-current fields are present, or required constants drift.
- `denied`: the record explicitly denies the request as inert review metadata.
- `runtime_not_available`: the record attempts to claim runtime availability
  or a runtime effect in Phase 4.1A.

Only `valid_review_record` and `denied` parse as accepted static review
records. Every other classification fails closed and cannot be consumed as an
approval record.

## Operator Consent

Operator consent is necessary but not sufficient. A complete consent record
must include the exact consent scope, operator identity, consent version,
timestamp metadata, and every consent boolean for the future dangerous
boundaries. Consent alone cannot start runtime, unlock a command, approve
process stdio ownership, or bypass a future implementation phase.

The current fixtures use deterministic placeholder review metadata. They do
not contain secrets, credentials, private user data, production signing keys,
or raw process output.

## Validity And Denial

The validity boundary is static metadata in this phase. A record outside its
validity window is classified `expired_or_not_yet_valid` and fails closed.
Denial records must carry fail-closed reasons and remain review metadata only.

The denial reason catalog includes:

- `missing_operator_consent`
- `consent_expired`
- `consent_revoked`
- `scope_mismatch`
- `capability_mismatch`
- `permission_scope_mismatch`
- `policy_digest_mismatch`
- `unsupported_schema_major`
- `malformed_record`
- `unknown_exact_current_field`
- `runtime_effect_flag_true`
- `host_policy_not_evaluated_by_rust_host`
- `runtime_scope_not_approved`
- `required_test_gate_missing`
- `major_runtime_readiness_not_completed`
- `runtime_not_available`

## Fixtures

The Phase 4.1A fixture set is under
`tests/fixtures/host-policy/phase4-1a/`:

- `valid-review-only-host-policy-approval-record.json`
- `missing-operator-consent-host-policy-approval-record.json`
- `denied-host-policy-approval-record.json`
- `unsupported-major-host-policy-approval-record.json`
- `malformed-missing-record-kind-host-policy-approval-record.json`
- `expired-not-yet-valid-host-policy-approval-record.json`
- `runtime-grant-attempt-host-policy-approval-record.json`

The valid-looking review-only fixture records complete operator consent and an
approval status, but `currentRecordEnablesRuntime`,
`runtimeApprovalEffectAllowed`, `runtimeImplementationAvailable`, and
`runtimeCommandAvailable` remain false.

## Relationship To Phase 4.1

Phase 4.1 proposed approval records as the first future roadmap step. Phase
4.1A realizes that item as static review artifacts only. It does not complete
the later Rust-host transport harness, stdout/stderr enforcement,
transcript persistence/replay, failure audit runtime, kill handling, or the
major runtime-readiness checkpoint.

Devin review should remain reserved for the major runtime-readiness checkpoint
before any live stdio/runtime surface is enabled.

Phase 4.1B consumes the valid approval-record shape only as a static reference
inside transport harness contract metadata. See
`docs/phase-4-1b-transport-harness-contracts.md`. The reference is necessary
but not sufficient, and current contracts still do not enable runtime.

## Still Forbidden

Phase 4.1A adds no live stdin command loop, live stdio reader, runtime command,
process stdio ownership implementation, listener/server, subprocess runtime
path, adapter call, Locus runtime dependency, MCP/OpenClaw call, plugin
execution, Content Fabric download/install/enable behavior, autonomous loop,
secret handling beyond static review metadata, production signing-key usage,
transcript persistence/replay runtime, WebSocket/HTTP control surface, actual
runtime execution behavior, `serve-runtime`, or `stdio-runtime`.
