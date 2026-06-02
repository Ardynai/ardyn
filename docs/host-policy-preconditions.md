# Host Policy Preconditions

Phase 3.4 records the preconditions ARDYN must satisfy before any future
execution-adjacent phase. These are documentation and contract requirements
only. They are not active runtime enforcement, and they do not enable execution.

ARDYN remains an open-source AI harness/framework. Locus is optional future
mission control, controller, or viewer through public ARDYN APIs only. Locus is
not ARDYN's host app. Multiverse integration remains optional and external.
Content Fabric remains a conformance foundation until a later reviewed runtime
phase explicitly adds runtime behavior.

## Current Boundary

Execution remains disabled. Phase 3.4 does not add a host executor, adapter
connection, plugin installer, Content Fabric runtime, server, listener, process
runner, autonomous loop, or secrets-aware CI behavior.

Approval records and policy review data are still evidence for reviewers. They
must not be treated as permission to execute. A future host policy must connect
approval records to a real explicit approval flow before any execution-adjacent
behavior can exist.

## Required Preconditions

Before any future phase can introduce execution-adjacent behavior, ARDYN must
define and review a host policy that requires all of the following.

### Explicit Approval

Every execution-adjacent action must require an explicit approval boundary. The
approval record must identify the requested action, selected capabilities,
permission scopes, approving actor or policy source, denial behavior, timestamp,
and audit trail. A simulated or planning-only approval decision is not enough.

### Adapter Permission Declarations

Adapters must declare their permissions before connection. An adapter contract
must list the external system, requested capabilities, permission scopes,
network/process needs, failure modes, audit records, and whether the adapter is
read-only, control-capable, or runtime-affecting.

This applies to Locus, Multiverse, MCP, OpenClaw, plugin APIs, Content Fabric,
and any future adapter-like boundary. Mentioning an adapter in a manifest or
plan must not create a live connection.

### Code-Pack Sandbox And Quarantine

Code packs must remain disabled until a future host policy defines quarantine,
sandboxing, signature verification, payload hash verification, explicit user
consent, and an explicit enable flow. Content Fabric conformance data may
describe packs, catalogs, and license gates, but it must not download, install,
enable, or execute code packs in this phase.

### Explicit Network And Process Permissions

Network and process behavior must be denied by default. Future host policy must
require named permission declarations for outbound network access, network
servers, network listeners, process spawning, long-running services, and any
runtime process control.

Each permission must identify its scope, purpose, approval requirement,
sandbox/quarantine relationship when applicable, audit output, and tests that
prove the default-disabled state remains intact when permission is absent.

## Documentation Model

Phase 3.4 tracks host-policy preconditions as documentation and reporting
metadata, not active runtime enforcement. Any future model should include these
precondition groups before an implementation can flip any runtime capability:

- `explicitApproval`: the consent boundary and audit record for any
  execution-adjacent action.
- `adapterPermissionDeclarations`: the declared permissions, scopes, failure
  modes, and audit outputs for adapter connections.
- `codePackSandboxAndQuarantine`: the quarantine, sandbox, signature, hash, and
  explicit enablement requirements for code packs.
- `networkProcessPermissions`: named outbound network, listener, server,
  process, and long-running service permissions.
- `runtimeEnforcementActive`: false until a later reviewed implementation adds
  real enforcement and tests.

`npm run report:phase-status` may list this document as local evidence, but that
report remains local-summary-only. It must not run checks, call network, spawn
processes, connect adapters, or imply that host-policy enforcement is active.

## Behavior Still Forbidden

The following behavior remains forbidden before a later reviewed phase
introduces an explicit policy, implementation, tests, and approval flow:

- Runtime execution.
- Network server or listener creation.
- Adapter connections.
- Real MCP calls.
- Real OpenClaw calls.
- Plugin install.
- Torrent download.
- Content Fabric runtime behavior.
- Content Fabric download, install, or enable flows.
- Code-pack enablement.
- Autonomous loops.
- Process spawning outside tests.
- Secrets access or secrets-dependent behavior.
- External CI that depends on real credentials or outside services.

## Future Type Contract Expectations

Future host-policy types should make the disabled default visible. A policy
shape should distinguish precondition metadata from active enforcement, require
explicit approval data, enumerate adapter permission declarations, represent
network and process permissions as named scopes, and represent code-pack
quarantine/sandbox requirements before any enablement field can become true.

Those future types are also preconditions. Adding a type that describes a
permission must not by itself enable runtime behavior.
