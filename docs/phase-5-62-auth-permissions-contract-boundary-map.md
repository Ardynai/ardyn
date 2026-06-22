# Ardyn Phase 5.62 - Review-only auth/permissions contract boundary map

## Status

Phase 5.62 records deterministic review-only metadata for future auth and permissions contract boundaries. It keeps Ardyn metadata-only, non-authorizing, and runtime-blocked.

This phase addresses the Phase 5.48 production-readiness Auth & Permissions gap by mapping future boundaries only. Ardyn does not add identity verification, identity providers, login flows, sessions, tokens, API keys, role engines, permission evaluators, authorization evaluators, approval decisions, approval grants, connector grants, secret/env/vault access, delegation engines, revocation engines, runtime authorization enforcement, policy enforcement runtime, external identity-provider integration, keyring/DID implementations, or command exposure.

Secure Drop recipient identity, keyring, DID, and access semantics remain canonical future work in `content-fabric`. Ardyn records only metadata references and implements no Secure Drop crypto, transport, stego, send/receive, inbox polling, file selection, connector ingestion, secret/vault/env access, ST3GG wrapping, or runtime behavior.

## Scope

The Phase 5.62 fixture is:

- `tests/fixtures/host-policy/phase5-62/auth-permissions-contract-boundary-map.json`

The fixture is produced by `createAuthPermissionsContractBoundaryMapForReview()` and contains 18 boundary entries:

- operator identity boundary
- subagent identity boundary
- external harness identity boundary through Locus
- Locus control-surface permission boundary
- Multiverse citizen/adapter permission boundary
- Multiverse role/capability badge boundary
- Fabric coordination-envelope authorization boundary
- MCP/tool access permission boundary
- connector grant boundary
- runtime command authorization boundary
- approval-prerequisite metadata boundary
- approval decision/grant boundary
- operator consent boundary
- delegation boundary
- revocation boundary
- Secure Drop recipient identity/keyring/DID reference boundary
- secret/env/vault access boundary
- audit subject and traceability boundary

Each entry records the boundary family, related system, current metadata-only or blocked status, allowed current behavior, forbidden current behavior, future contract prerequisite, future runtime authorization prerequisite, identity subject notes, role and permission expectation, consent and approval expectation, revocation expectation, audit-subject expectation, Locus, Multiverse, Fabric, Secure Drop, blocked authorization flags, unsafe auth/permissions runtime flags, and non-authorizing proof.

## Fail-closed Boundary

Invalid auth/permissions boundary input fails closed for:

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
- enabled identity, authentication, authorization, session, token, API-key, role, permission, grant, secret, delegation, or revocation execution flags
- hidden login, session, token, or API-key semantics
- hidden permission evaluator semantics
- hidden approval decision or grant semantics
- hidden connector grant semantics
- hidden runtime authorization semantics
- hidden secret/env/vault access semantics
- hidden external identity-provider integration semantics
- hidden keyring, DID, or Secure Drop implementation semantics
- hidden database, storage, RLS, or persistence semantics
- hidden Fabric, websocket/http, MCP, task, backend, API, server, or runtime semantics
- nested unsafe runtime flags
- noncanonical boundary entry ordering or content

Accepted output remains non-authorizing and sets every identity, authentication, authorization, session, token, API-key, role, permission, grant, secret, delegation, revocation, connector-grant, runtime-authorization, database, storage, cache, RLS, migration, transcript-write, audit-write, import/export, package, persistence, runtime, command, backend, API, server, Fabric, websocket/http, MCP, task, Secure Drop, encoded-handoff, codec, translator, secrets, connector, service-discovery, schedule, filesystem, process, UI, browser, and rendering flag to false.

## Top Remaining Gaps

- No Ardyn identity provider, login flow, session runtime, token issuer, API-key issuer, role engine, permission evaluator, or authorization evaluator exists.
- Approval decisions, approval grants, runtime command authorization, connector grants, delegation, and revocation remain blocked metadata boundaries only.
- Secrets, env files, vaults, keyrings, DIDs, and Secure Drop recipient identity references are not ingested; Secure Drop remains future `content-fabric` work.
- Auth and permissions are not connected to database/storage, RLS, persistence, transcript/audit writes, backend API/server, Fabric runtime, websocket/http transport, MCP, or task execution.
- Future audit subject traceability needs explicit subject, consent, approval, revocation, storage, and display contracts before runtime.

## Recommended Next Phase

Phase 5.63 should define a review-only security/RLS/input-sanitization contract boundary map, including future input validation, RLS/app-permission, authorization evidence, and security review prerequisites without enabling runtime, commands, identity/auth behavior, connectors, DB/storage, Fabric, Secure Drop, MCP, task, filesystem, process, or UI behavior.
