# Phase 5.45 Locus/Multiverse Target Consumer Planning Metadata

Phase 5.45 adds deterministic review-only planning metadata that treats Ardyn
as the primary harness/framework/wrapper layer for the repo family. It records
Locus and Multiverse as first-class target consumers of Ardyn without adding
runtime behavior.

Machine-readable Phase 5.45 artifact path:

`tests/fixtures/host-policy/phase5-45/target-consumer-planning-metadata.json`

Focused Phase 5.45 test path:

`tests/phase5-45-target-consumer-planning-metadata.test.mjs`

Core helper:

`packages/core/src/index.mjs#createTargetConsumerPlanningMetadataForReview`

## Scope

The Phase 5.45 helper consumes one Phase 5.44 review-only consolidation
metadata checkpoint state by digest and may produce only:

- review-only target consumer planning metadata
- a digest-only Phase 5.44 source metadata reference
- Locus first-class target consumer metadata
- Multiverse first-class target consumer metadata
- a future Secure Drop content-fabric capability reference
- negative runtime, command, connector, Fabric, and Secure Drop behavior flags

It does not consume filesystem paths, URLs, environment variables, secrets,
watcher events, stdin/stdout/stderr runtime streams, adapter surfaces, Fabric
runtime surfaces, WebSocket/HTTP surfaces, registry connections, task runtime,
MCP execution, connector grants, or Secure Drop runtime data.

## Locus Target Consumer Metadata

Phase 5.45 records Locus as a first-class target consumer for:

- status/control-surface contracts
- process/tool capability metadata
- Locus-visible review artifacts
- future Secure Drop compose and inbox consumer contract references

This metadata does not grant command control, runtime control, process control,
tool execution, reviewer routing, reviewer assignment, connector grants, or
runtime permission.

## Multiverse Target Consumer Metadata

Phase 5.45 records Multiverse as a first-class target consumer for:

- world/project orchestration contracts
- visible AI capability metadata
- task/capability wrapper contracts
- review-only citizen/adapter candidate metadata
- Fabric coordination metadata

This metadata does not enable live registry access, WebSocket runtime behavior,
HTTP runtime behavior, task execution, MCP execution, adapter runtime behavior,
connector grants, or Fabric runtime behavior.

## Secure Drop Boundary

Secure Drop is represented only as a future canonical `content-fabric`
capability reference. Ardyn may consume that capability only after later
explicit authorization phases.

Phase 5.45 does not implement Secure Drop crypto, transport, stego,
send/receive, compose runtime, inbox polling, file selection, filesystem
scanning, connector ingestion, secret/vault/env access, or ST3GG vendoring.

## Runtime Posture

Phase 5.45 adds no:

- CLI command
- Locus runtime dependency
- Multiverse runtime dependency
- connector grant
- connector ingestion
- live registry connection
- WebSocket, HTTP, task, or MCP runtime surface
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

## Validation

Phase 5.45 records these required validation commands:

- `node --test tests/phase5-45-target-consumer-planning-metadata.test.mjs`
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
