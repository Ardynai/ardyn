# Ardyn Phase 5.64 - Review-only rate-limiting/abuse-control contract boundary map

## Status

Phase 5.64 records deterministic review-only metadata for future rate-limiting, quota, throttling, abuse-control, denial-of-service, backpressure, retry-budget, idempotency, and request-cost boundaries. It keeps Ardyn metadata-only, non-authorizing, and runtime-blocked.

This phase addresses the Phase 5.48 production-readiness Rate Limiting gap by mapping future boundaries only. Ardyn does not add limiter libraries, quota engines, throttle runtimes, abuse detectors, queues, schedulers, retry engines, circuit breakers, idempotency stores, cost meters, backend middleware, API/server behavior, live traffic handling, database/storage/cache writes, connector grants, Fabric runtime, websocket/http transport, MCP exposure, task execution, service discovery, scheduling, polling, secrets/env/vault access, filesystem/process control, or external lookups.

Secure Drop abuse-control planning remains canonical future work in `content-fabric`. Ardyn records only metadata references and implements no Secure Drop compose/inbox limiter, crypto, transport, stego, send/receive, inbox polling, file selection, filesystem scanning, connector ingestion, secret/vault/env access, ST3GG wrapping, or runtime behavior.

## Scope

The Phase 5.64 fixture is:

- `tests/fixtures/host-policy/phase5-64/rate-limiting-abuse-control-contract-boundary-map.json`

The fixture is produced by `createRateLimitingAbuseControlContractBoundaryMapForReview()` and contains 16 boundary entries:

- backend/API request rate-limit boundary
- CLI command invocation abuse boundary
- future runtime command throttle boundary
- subagent encoded handoff abuse boundary from Phase 5.60
- Fabric coordination-envelope abuse boundary
- Locus control-surface request throttle boundary
- Multiverse citizen/adapter request throttle boundary
- MCP/tool exposure abuse boundary
- connector grant abuse boundary
- Secure Drop compose/inbox abuse boundary with canonical implementation remaining in `content-fabric`
- storage/write quota boundary from Phase 5.61
- auth/permission subject quota boundary from Phase 5.62
- security/input-sanitization abuse boundary from Phase 5.63
- retry budget planning boundary
- idempotency planning boundary
- backpressure and circuit-breaker planning boundary

Each entry records the boundary family, related system, current metadata-only or blocked status, allowed current behavior, forbidden current behavior, future contract prerequisite, future runtime authorization prerequisite, request identity expectation, quota subject expectation, backpressure expectation, retry/idempotency expectation, abuse-signal expectation, Locus, Multiverse, Fabric, Secure Drop, blocked authorization flags, unsafe rate-limiting/abuse-control runtime flags, and non-authorizing proof.

## Fail-closed Boundary

Invalid rate-limiting/abuse-control boundary input fails closed for:

- missing required fields
- unknown top-level input fields
- unknown boundary families
- unknown related systems
- unknown current statuses
- enabled authorization flags
- metadata attempting to set `reportRunsChecks=true`
- metadata attempting to authorize runtime
- metadata attempting to expose commands
- metadata attempting to bypass blocked CLI behavior
- enabled runtime, command, connector, Fabric, websocket/http, MCP, task, Secure Drop, service-discovery, schedule, filesystem, or process flags
- enabled limiter runtime, quota engine, throttle runtime, abuse detector, queue, scheduler, retry engine, circuit breaker, idempotency store, request cost meter, backend/API/server middleware, or storage write flags
- hidden rate-limit middleware semantics
- hidden quota engine semantics
- hidden abuse detector or runtime scanner semantics
- hidden retry or circuit-breaker execution semantics
- hidden idempotency persistence semantics
- hidden backend/API/server semantics
- hidden database/storage/cache/write semantics
- hidden auth/session/token/API-key semantics
- hidden connector grant semantics
- hidden Fabric, websocket/http, MCP, task, backend, API, server, or runtime semantics
- hidden Secure Drop implementation semantics
- hidden encoded handoff codec, translator, stego, covert-channel, tokenizer-exploit, or bypass semantics
- nested unsafe runtime flags
- noncanonical boundary entry ordering or content

Accepted output remains non-authorizing and sets every limiter-runtime, quota-engine, throttle-runtime, abuse-detector, queue, scheduler, retry-engine, circuit-breaker, idempotency-store, backend, API, server, database, storage, cache, RLS, migration, transcript-write, audit-write, import/export, package, persistence, runtime, command, Fabric, websocket/http, MCP, task, Secure Drop, encoded-handoff, codec, translator, secrets, connector, service-discovery, filesystem, process, UI, browser, and rendering flag to false.

## Top Remaining Gaps

- No limiter runtime, quota engine, throttle runtime, abuse detector, denial-of-service runtime, queue, scheduler, retry engine, circuit breaker, idempotency store, request cost meter, backend middleware, API, or server exists in Ardyn.
- Database/storage/cache/RLS, auth/permissions subject identity, and security/input-sanitization boundaries are referenced as metadata only and still require explicit future contracts.
- Fabric coordination, encoded handoff, MCP/tool exposure, connector grants, and Secure Drop compose/inbox abuse controls remain future metadata boundaries with no runtime transport, task execution, or service discovery.
- No storage writes, counters, buckets, ledgers, retry state, idempotency persistence, audit/transcript writers, import/export paths, packages, filesystem writes, or background polling are implemented.
- Future consumer displays still need Locus/Multiverse-owned abuse-control UI, accessibility, and action-disablement conformance before any interactive control surface.

## Recommended Next Phase

Phase 5.65 should define a review-only error-tracking/logging/audit-integrity contract boundary map without enabling log writers, audit writers, telemetry collectors, backend/API/server behavior, DB/storage writes, Fabric, Secure Drop, MCP/task, connector, filesystem/process, or UI behavior.
