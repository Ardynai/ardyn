# Phase 5.47 Consumer Contract Gap Index

Phase 5.47 adds deterministic review-only gap-index metadata for the Locus and
Multiverse target consumers. It consumes the Phase 5.46 readiness matrix by
digest and groups each readiness blocker into an explicit future authorization
phase candidate.

Machine-readable Phase 5.47 artifact path:

`tests/fixtures/host-policy/phase5-47/consumer-contract-gap-index.json`

Focused Phase 5.47 test path:

`tests/phase5-47-consumer-contract-gap-index.test.mjs`

Core helper:

`packages/core/src/index.mjs#createConsumerContractGapIndexForReview`

## Scope

The Phase 5.47 helper may produce only:

- review-only consumer contract gap-index metadata
- digest-only Phase 5.46 readiness-matrix source reference
- Locus future authorization candidate buckets
- Multiverse future authorization candidate buckets
- prerequisite contract names copied from the readiness matrix
- allowed-current-behavior and forbidden-current-behavior metadata
- blocker notes for later explicit authorization phases
- negative runtime, command, connector, Fabric, WebSocket, MCP, task, and
  Secure Drop authorization flags

It does not consume filesystem paths, URLs, environment variables, secrets,
watcher events, stdin/stdout/stderr runtime streams, adapter surfaces, Fabric
runtime surfaces, WebSocket/HTTP surfaces, registry connections, task runtime,
MCP execution, connector grants, or Secure Drop runtime data.

## Locus Gap Buckets

The gap index records Locus future authorization candidate buckets for:

- status/control-surface display contract
- process/tool capability metadata contract
- Locus-visible review artifact contract
- future Secure Drop compose/inbox consumer contract
- command/control runtime authorization boundary

These entries are planning metadata only. They do not grant command control,
runtime control, process control, tool execution, reviewer routing, reviewer
assignment, connector grants, Secure Drop access, or runtime permission.

## Multiverse Gap Buckets

The gap index records Multiverse future authorization candidate buckets for:

- world/project orchestration metadata contract
- visible AI capability metadata contract
- task/capability wrapper metadata contract
- review-only citizen/adapter candidate contract
- Fabric coordination metadata contract
- registry/WebSocket/MCP/task runtime authorization boundary

These entries do not enable live registry access, WebSocket runtime behavior,
HTTP runtime behavior, task execution, MCP execution, MCP tool exposure, adapter
runtime behavior, connector grants, or Fabric runtime behavior.

## Secure Drop Boundary

Secure Drop remains only a future canonical `content-fabric` capability
reference. Ardyn may consume that capability only after later explicit
authorization phases.

Phase 5.47 does not implement Secure Drop crypto, transport, stego,
send/receive, compose runtime, inbox polling, file selection, filesystem
scanning, connector ingestion, secret/vault/env access, or ST3GG vendoring.

## Runtime Posture

Phase 5.47 adds no:

- CLI command
- Locus runtime dependency
- Multiverse runtime dependency
- connector grant
- connector ingestion
- live registry connection
- WebSocket, HTTP, task, or MCP runtime surface
- MCP tool exposure
- Fabric runtime surface
- Secure Drop implementation
- filesystem watcher
- file selection or filesystem scan
- env, vault, or secret access
- process control
- stdin loop
- stdout/stderr runtime writer
- transcript or audit runtime write

`serve-runtime` remains default-blocked. `serve-runtime --dry-run` remains
blocked and cannot bypass runtime disablement.

Fallow remains advisory-only evidence. Phase 5.47 does not use Fallow Runtime.

## Validation

Phase 5.47 records these required validation commands:

- `node --test tests/phase5-47-consumer-contract-gap-index.test.mjs`
- `node --test tests/report-phase-status.test.mjs`
- `npm test`
- `npm run test:schemas`
- `npm run report:phase-status`
- `cargo test --workspace`
- `cargo check --workspace`
- `cargo fmt --check`
- `cargo clippy --workspace -- -D warnings`
- `npm audit --json`
- `cargo audit`
- `cargo machete`
- `git diff --check`
- `git diff --cached --check`
- `fallow health --score --hotspots --targets --format json`
- `fallow audit --format json`

Semgrep remains an evidence-only advisory command for this phase:

- `semgrep --config auto .`
