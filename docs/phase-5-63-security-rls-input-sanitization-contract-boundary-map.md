# Ardyn Phase 5.63 - Review-only security/RLS/input-sanitization contract boundary map

## Status

Phase 5.63 records deterministic review-only metadata for future security, RLS, and input-sanitization contract boundaries. It keeps Ardyn metadata-only, non-authorizing, and runtime-blocked.

This phase addresses the Phase 5.48 production-readiness Security & RLS gap by mapping future boundaries only. Ardyn does not add security middleware, runtime sanitizers, validators that authorize runtime, injection-prevention runtime, RLS policies, database clients, schemas, migrations, storage adapters, secret/env/vault access, connector grants, dependency patch automation, live scanners, audit writers, log writers, HTTPS/HSTS server config, backend API/server behavior, Fabric runtime, websocket/http transport, MCP exposure, task execution, service discovery, scheduling, polling, filesystem/process control, or external lookups.

Secure Drop metadata safety remains canonical future work in `content-fabric`. Ardyn records only metadata references and implements no Secure Drop crypto, transport, stego, send/receive, inbox polling, file selection, filesystem scanning, connector ingestion, secret/vault/env access, ST3GG wrapping, or runtime behavior.

## Scope

The Phase 5.63 fixture is:

- `tests/fixtures/host-policy/phase5-63/security-rls-input-sanitization-contract-boundary-map.json`

The fixture is produced by `createSecurityRlsInputSanitizationContractBoundaryMapForReview()` and contains 18 boundary entries:

- manifest/task/review-artifact input sanitization
- encoded handoff input safety
- display/conformance fixture sanitization
- API/backend request validation
- database/storage/RLS boundary from Phase 5.61
- tenant/project/workspace data isolation
- auth/permissions enforcement boundary from Phase 5.62
- Fabric coordination-envelope safety
- Locus control-surface input safety
- Multiverse citizen/adapter input safety
- MCP/tool exposure safety
- connector input safety
- Secure Drop metadata safety with canonical implementation remaining in `content-fabric`
- secret/env/vault exposure
- dependency/security scan evidence
- audit/log integrity
- HTTPS/HSTS secure transport planning
- subagent prompt/output safety

Each entry records the boundary family, related system, current metadata-only or blocked status, allowed current behavior, forbidden current behavior, future contract prerequisite, future runtime authorization prerequisite, input sanitization expectation, injection-prevention expectation, RLS/data-isolation expectation, permission-enforcement expectation, dependency/security-tooling expectation, secure transport expectation, audit-integrity expectation, Locus, Multiverse, Fabric, Secure Drop, blocked authorization flags, unsafe security/RLS/input runtime flags, and non-authorizing proof.

## Fail-closed Boundary

Invalid security/RLS/input-sanitization boundary input fails closed for:

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
- enabled sanitizer runtime, RLS runtime, permission enforcement runtime, secure transport runtime, dependency patch automation, audit/log writer, secret scanner runtime, connector scanner, or external lookup flags
- hidden backend/API/server middleware semantics
- hidden database/RLS/schema/migration semantics
- hidden secret/env/vault access semantics
- hidden connector grant semantics
- hidden Fabric, websocket/http, MCP, task, backend, API, server, or runtime semantics
- hidden Secure Drop implementation semantics
- hidden encoded handoff codec, translator, stego, covert-channel, tokenizer-exploit, or bypass semantics
- hidden audit/log write or tamper-evident writer semantics
- nested unsafe runtime flags
- noncanonical boundary entry ordering or content

Accepted output remains non-authorizing and sets every sanitizer-runtime, RLS, security-middleware, backend, API, server, audit-log-writer, secret-access, connector-grant, database, storage, cache, migration, transcript-write, audit-write, import/export, package, persistence, runtime, command, Fabric, websocket/http, MCP, task, Secure Drop, encoded-handoff, codec, translator, service-discovery, schedule, filesystem, process, UI, browser, and rendering flag to false.

## Top Remaining Gaps

- No security middleware, runtime sanitizer, injection-prevention runtime, RLS runtime, permission enforcement runtime, secure transport runtime, or backend API/server behavior exists in Ardyn.
- Database/storage/RLS, auth/permissions, and Fabric boundaries are referenced as metadata only and still require explicit implementation and runtime authorization contracts.
- Secrets, env files, vaults, connector grants, Secure Drop metadata, encoded handoff content, and audit/log writers remain blocked and cannot be enabled by metadata.
- Dependency and security scan evidence is advisory only; no live scanner, dependency patch automation, external lookup, package write, import/export, or CI behavior is implemented.
- Future UI/display consumers still need consumer-owned sanitization, accessibility, and action-disablement validation before any interactive surface exists.

## Recommended Next Phase

Phase 5.64 should define a review-only rate-limiting/abuse-control contract boundary map, including future throttle, quota, replay, abuse-signal, retry, and lockout planning without enabling runtime, commands, identity/auth behavior, DB/storage, Fabric, Secure Drop, MCP, task, connector, filesystem, process, or UI behavior.
