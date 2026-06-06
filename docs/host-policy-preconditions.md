# Host Policy Preconditions

Phase 3.9 keeps the Phase 3.4 host-policy preconditions in documentation-only
form and extends them to cover future stdio transcript/runtime boundaries.
These are documentation and contract requirements only. They are not active
runtime enforcement, and they do not enable execution.

ARDYN remains an open-source AI harness/framework. Locus is optional future
mission control, controller, or viewer through public ARDYN APIs only. Locus is
not ARDYN's host app. Multiverse integration remains optional and external.
Content Fabric remains a conformance foundation until a later reviewed runtime
phase explicitly adds runtime behavior.

## Current Boundary

Execution remains disabled. Phase 3.9 does not add a host executor, adapter
connection, plugin installer, Content Fabric runtime, stdio runtime, server,
listener, process runner, autonomous loop, or secrets-aware CI behavior.

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

No task execution may occur without an explicit approval record that is valid
for the requested action and evaluated by the Rust host policy.

### Adapter Permission Declarations

Adapters must declare their permissions before connection. An adapter contract
must list the external system, requested capabilities, permission scopes,
network/process needs, failure modes, audit records, and whether the adapter is
read-only, control-capable, or runtime-affecting.

This applies to Locus, Multiverse, MCP, OpenClaw, plugin APIs, Content Fabric,
and any future adapter-like boundary. Mentioning an adapter in a manifest or
plan must not create a live connection.

No adapter connection may occur unless the adapter has declared permissions and
the Rust host policy has approved that declaration for the specific connection
path.

### Code-Pack Sandbox And Quarantine

Code packs must remain disabled until a future host policy defines quarantine,
sandboxing, signature verification, payload hash verification, explicit user
consent, and an explicit enable flow. Content Fabric conformance data may
describe packs, catalogs, and license gates, but it must not download, install,
enable, or execute code packs in this phase.

No code-pack enablement may occur until Fabric verification, quarantine, and
explicit enable policy are defined and enforced by the Rust host.

### Explicit Network And Process Permissions

Network and process behavior must be denied by default. Future host policy must
require named permission declarations for outbound network access, network
servers, network listeners, process spawning, long-running services, and any
runtime process control.

Each permission must identify its scope, purpose, approval requirement,
sandbox/quarantine relationship when applicable, audit output, and tests that
prove the default-disabled state remains intact when permission is absent.

No process, network, or filesystem access may occur without an explicit Rust
host policy that defines the permission scope, approval gate, audit record, and
default-deny behavior.

### Stdio Output And Framing Semantics

Before any real stdio runtime exists, the Rust host policy must define stdout
and stderr behavior and line-delimited JSON framing semantics.

That policy must specify:

- Whether stdout is reserved for JSON events only.
- Whether stderr may carry diagnostics and in what format.
- The exact line-delimited JSON framing rules.
- How malformed lines are surfaced to review.
- How partial writes, duplicate lines, or out-of-order lines are handled.
- Whether host policy treats framing failures as transcript rejection,
  transport termination, or both.

Phase 4.0B adds only a design note for future ownership. A future live stdio
runtime must make the Rust host the owner of process-level stdout and stderr
policy. Stdout should be reserved for validated session-event JSONL frames,
while stderr should be reserved for diagnostics with an explicit redaction and
classification policy. The Rust host policy must define buffering, backpressure,
partial-write handling, termination behavior, and audit records before any
runtime loop can exist. The current JavaScript CLI remains a finite dry-run
renderer and does not start or supervise a live stdio process.

Phase 4.0C turns that design note into a pre-runtime transport policy in
`docs/phase-4-0c-pre-runtime-transport-policy.md`. The policy is still
documentation and static contract evidence only. It defines future Rust-host
ownership for stdout/stderr, JSONL framing, diagnostic framing, backpressure,
partial writes, dropped/duplicate/out-of-order/malformed-line handling, process
exit semantics, and stderr redaction. It also records a transcript
persistence/replay design that prefers normalized `ardyn.session-transcript`
JSON and remains proposal-only. Phase 4.0C does not add a live stdin command
loop, stdio reader, listener, server, subprocess supervisor, adapter call,
Locus runtime dependency, MCP/OpenClaw call, plugin execution path, Content
Fabric runtime behavior, autonomous loop, secret handling path, or production
signing-key path.

Phase 4.0D codifies the same policy as Rust-host contract types and fail-closed
defaults in `crates/ardyn-host/src/lib.rs`. The
`StdioTransportPolicyContract`, `RuntimeSafetyPolicyFlags`, and
`stdio_transport_policy_contract()` helper remain inactive pre-runtime metadata:
they do not enforce stdio ownership, start a reader, write transcript records,
replay transcripts, handle secrets, or change the finite TypeScript dry-run
emitter. See `docs/phase-4-0d-rust-host-transport-policy-contracts.md`.

Phase 4.0E exports that inactive Rust-host policy contract as deterministic
JSON review metadata and maps it to the Phase 4.0F host-policy review-record
shape.
The export helpers return typed metadata, JSON strings, and SHA-256 digest data
only; they do not write files, print to stdout, start runtime enforcement,
record approvals, deny a running runtime, persist transcripts, replay
transcripts, handle secrets, or change the finite TypeScript dry-run emitter.
See `docs/phase-4-0e-rust-host-policy-metadata.md`.

Phase 4.0F defines versioned static host-policy review records and
compatibility classes for that metadata. The records may describe compatible,
upgrade-available, unsupported-major, malformed, or rejected-policy review
states, but approval and rejection fields remain review metadata only. They do
not grant runtime approval, deny a running runtime, start host-policy
enforcement, persist transcripts, replay transcripts, handle secrets, or change
the finite TypeScript dry-run emitter. See
`docs/phase-4-0f-host-policy-review-records.md`.

Phase 4.0G adds static display-only comparison helpers and fixtures for those
host-policy review records. Comparison output can surface digest mismatches,
runtime-status mismatches, unsupported major records, malformed records, and
rejected permissive-policy records as review evidence, but it remains inert
metadata. It does not grant runtime approval, start host-policy enforcement,
write files, print stdout, add a CLI command, deny a running runtime, persist
transcripts, replay transcripts, handle secrets, or change the finite
TypeScript dry-run emitter. See
`docs/phase-4-0g-host-policy-review-comparison.md`.

Phase 4.0H adds a static reviewer handoff index for Phase 4.0A through
Phase 4.0H artifacts. The index separates normative docs/source surfaces from
fixture, test, metadata, and display-only evidence, but it remains inert
reviewer navigation metadata. It does not grant runtime approval, start
host-policy enforcement, write files, print stdout, add a CLI command, deny a
running runtime, persist transcripts, replay transcripts, handle secrets, or
change the finite TypeScript dry-run emitter. See
`docs/phase-4-0h-reviewer-handoff-index.md`.

Phase 4.0I adds a final static pre-runtime readiness checklist and invariant
matrix for Phase 4.0A through Phase 4.0I review. The readiness bundle is inert
review evidence only. It does not grant runtime approval, start host-policy
enforcement, write files, print stdout, add a CLI command, deny a running
runtime, persist transcripts, replay transcripts, handle secrets, implement
Phase 4.1, or change the finite TypeScript dry-run emitter. See
`docs/phase-4-0i-final-pre-runtime-readiness.md`.

Phase 4.1 adds a proposal-only runtime implementation plan. It defines the
approval boundary and future host-policy responsibilities before live runtime
implementation can begin, but it remains inert review evidence only. It does
not grant runtime approval, start host-policy enforcement, write files, print
stdout, add a CLI command, deny a running runtime, persist transcripts, replay
transcripts, handle secrets, implement live stdio ownership, or change the
finite TypeScript dry-run emitter. See `docs/phase-4-1-runtime-proposal.md`.

Phase 4.1A adds static host-policy approval-record and operator-consent
artifacts. Operator consent is necessary but not sufficient for any future
runtime path, and current records do not enable runtime. The records remain
inert review/audit metadata only. They do not grant runtime approval, start
host-policy enforcement, add an approval evaluator, write files, print stdout,
add a CLI command, deny a running runtime, persist transcripts, replay
transcripts, handle secrets, implement live stdio ownership, or change the
finite TypeScript dry-run emitter. See
`docs/phase-4-1a-host-policy-approval-records.md`.

Phase 4.1B adds static transport harness contract artifacts. Approval
references are necessary but not sufficient for any future runtime path, and
current contracts do not enable runtime. The contracts remain inert review
metadata only. They do not grant runtime approval, start host-policy
enforcement, add an approval evaluator, write files, print stdout, add a CLI
command, deny a running runtime, persist transcripts, replay transcripts,
handle secrets, implement live stdio ownership, own stdout/stderr, emit failure
audits, or change the finite TypeScript dry-run emitter. See
`docs/phase-4-1b-transport-harness-contracts.md`.

Phase 4.1C adds static stdout JSONL framing and stderr redaction contract
artifacts. The rules are necessary preconditions for a future runtime, but no
live writer exists, no process stdio ownership exists, and future runtime must
use these rules but is not implemented yet. The contracts remain inert review
metadata only. They do not grant runtime approval, start host-policy
enforcement, add an approval evaluator, write files, print stdout, add a CLI
command, deny a running runtime, persist transcripts, replay transcripts,
handle secrets, implement live stdio ownership, own stdout/stderr, emit failure
audits, or change the finite TypeScript dry-run emitter. See
`docs/phase-4-1c-framing-redaction-contracts.md`.

Phase 4.1D adds static transcript persistence and replay contract artifacts.
The records define deterministic fixture metadata, digest checks, sequence
classifications, compatibility states, and fail-closed review behavior, but no
transcript persistence runtime exists and no replay runtime exists. The
contracts remain inert review metadata only. They do not grant runtime
approval, start host-policy enforcement, add an approval evaluator, write
files, print stdout, add a CLI command, deny a running runtime, persist
transcripts, replay transcripts, handle secrets, implement live stdio
ownership, own stdout/stderr, emit failure audits, or change the finite
TypeScript dry-run emitter. `replay-session-transcript` remains
proposal-only and rejected. See
`docs/phase-4-1d-transcript-replay-contracts.md`.

Phase 4.1E adds static failure-audit, terminal-state, cleanup/kill, and
nonzero-exit mapping contract artifacts. The records define deterministic
failure categories, terminal states, exit code classifications, stderr
diagnostic classifications, redaction status, cleanup requirement metadata,
kill/interrupt/timeout policy, transcript replay impact, runtime availability
status, and fail-closed reason fields, but no failure-audit runtime exists, no
cleanup runtime exists, no process killing exists, and no live runtime exists.
The contracts remain inert review metadata only. They do not grant runtime
approval, start host-policy enforcement, add an approval evaluator, write
files, print stdout, add a CLI command, deny a running runtime, persist
transcripts, replay transcripts, handle secrets, implement live stdio
ownership, own stdout/stderr, perform cleanup, kill processes, or change the
finite TypeScript dry-run emitter. Failure-audit, cleanup, kill, process
control, signal-handler, exit-handler, and runtime commands remain
proposal-only and rejected. See
`docs/phase-4-1e-failure-audit-kill-semantics.md`.

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
- `stdioLineDelimitedJsonSemantics`: stdout/stderr and line-delimited JSON
  framing requirements for any future stdio runtime.
- `runtimeEnforcementActive`: false until a later reviewed implementation adds
  real enforcement and tests.

`npm run report:phase-status` may list this document as local evidence, but that
report remains local-summary-only. It must not run checks, call network, spawn
processes, connect adapters, or imply that host-policy enforcement is active.

## Behavior Still Forbidden

The following behavior remains forbidden before a later reviewed phase
introduces an explicit policy, implementation, tests, and runtime enablement:

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
- Filesystem access without reviewed Rust host policy.
- Autonomous loops.
- Process spawning outside tests.
- Secrets access or secrets-dependent behavior.
- External CI that depends on real credentials or outside services.

## Future Type Contract Expectations

Future host-policy types should make the disabled default visible. A policy
shape should distinguish precondition metadata from active enforcement, require
explicit approval data, enumerate adapter permission declarations, represent
network and process permissions as named scopes, and represent code-pack
quarantine/sandbox requirements before any enablement field can become true. A
future stdio policy type should also define stdout/stderr behavior and
line-delimited JSON semantics before any session runtime is introduced.

Those future types are also preconditions. Adding a type that describes a
permission must not by itself enable runtime behavior.
