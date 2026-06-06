# ARDYN Architecture

ARDYN is a standalone open-source AI harness/framework. It should run locally without Locus or Multiverse, while exposing stable adapters so those systems can connect.

## Runtime Split

ARDYN uses a Rust host plus TypeScript core architecture.

The Rust host is responsible for:

- Native CLI and daemon lifecycle.
- Process supervision.
- Stdio, HTTP, and WebSocket transport ownership.
- Windows-first OS integration.
- Filesystem, process, network, and credential boundary enforcement.
- Starting sandboxed child processes when future phases add execution.

The TypeScript core is responsible for:

- Agent and session contracts.
- Capability loading.
- Task validation.
- Plugin and adapter API shapes.
- MCP client/server integration.
- Locus and Multiverse adapter packages.

The boundary is intentional: Rust answers whether ARDYN may safely do something on this machine; TypeScript answers what ARDYN capabilities and adapters mean.

Phase 4.0C documents future process-level stdio policy only. A later reviewed
Rust host must own stdout/stderr policy, buffering, flushing, backpressure,
partial-write behavior, process exit semantics, redaction enforcement, and
transport-failure audit records before any live stdio runtime exists. The
current Rust host remains static and non-executing, and the current TypeScript
core owns deterministic contract data only.

Phase 4.0D codifies that Phase 4.0C policy as Rust-host contract types in
`crates/ardyn-host/src/lib.rs`. `StdioTransportPolicyContract`,
`RuntimeSafetyPolicyFlags`, and `stdio_transport_policy_contract()` are
serializable metadata only: no process-level stdio ownership is active, no
reader or writer loop exists, and every runtime safety flag remains false. See
`docs/phase-4-0d-rust-host-transport-policy-contracts.md`.

Phase 4.0E exports that Rust-host policy contract as deterministic JSON review
metadata through Rust helpers only. The export is a string/typed-data review
artifact with a golden fixture, digest helper, and future host-policy
review-record mapping; it does not write files, print to stdout, own stdio, or
start runtime behavior. See
`docs/phase-4-0e-rust-host-policy-metadata.md`.

Phase 4.0F makes host-policy review records current static artifacts for that
metadata. The records carry compatibility classification, inert approval or
rejection metadata, warnings, errors, and non-execution invariants; they do not
grant runtime approval or activate host-policy enforcement. See
`docs/phase-4-0f-host-policy-review-records.md`.

Phase 4.0G adds TypeScript core display-only comparison helpers for those
review records. The comparison output is deterministic reviewer evidence for
Devin/Codex handoff and cannot grant runtime approval, start runtime behavior,
write files, print stdout, or add a CLI command. See
`docs/phase-4-0g-host-policy-review-comparison.md`.

Phase 4.0H adds static reviewer navigation metadata for Phase 4.0A through
Phase 4.0H artifacts. It does not add a TypeScript core API, Rust runtime
helper, CLI command, stdout printer, file writer, runtime approval grant, or
host-policy enforcement path. See
`docs/phase-4-0h-reviewer-handoff-index.md`.

Phase 4.0I adds a final static pre-runtime readiness bundle for Phase 4.0A
through Phase 4.0I review. It does not add a TypeScript core API, Rust runtime
helper, CLI command, stdout printer, file writer, runtime approval grant,
Phase 4.1 implementation, or host-policy enforcement path. See
`docs/phase-4-0i-final-pre-runtime-readiness.md`.

Phase 4.1 adds a runtime proposal and implementation roadmap only. It defines
the approval boundary before any live runtime work, future Rust-host stdio
ownership responsibilities, stdout JSONL emission responsibilities, stderr
diagnostic/redaction enforcement, transcript persistence/replay design,
failure audit records, kill/exit fail-closed semantics, backpressure and
partial-write handling, line-integrity behavior, required tests, and phased
future implementation sequence. It does not add a TypeScript core API, Rust
runtime helper, CLI command, stdout printer, file writer, live stdio reader,
process stdio ownership, runtime approval grant, or host-policy enforcement
path. See `docs/phase-4-1-runtime-proposal.md`.

Phase 4.1A adds static Rust-host approval-record and operator-consent helper
types for review/audit evidence only. It does not add a TypeScript core API,
Rust runtime helper, approval evaluator, active host-policy enforcement path,
CLI command, stdout printer, file writer, live stdio reader, process stdio
ownership, runtime approval grant, or live host loop. See
`docs/phase-4-1a-host-policy-approval-records.md`.

Phase 4.1B adds static Rust-host transport harness contract helper types for
review metadata only. It does not add a TypeScript core API, Rust runtime
helper, transport harness runtime, stdin reader, stdout writer, stderr writer,
failure audit runtime, approval evaluator, active host-policy enforcement path,
CLI command, process stdio ownership, runtime approval grant, or live host
loop. See `docs/phase-4-1b-transport-harness-contracts.md`.

Phase 4.1C adds static TypeScript stdout JSONL whole-line framing and stderr
redaction review helpers. It does not add a Rust runtime helper, stdout writer,
stderr writer, live writer, live stdio reader, process stdio ownership,
failure audit runtime, approval evaluator, active host-policy enforcement path,
CLI command, runtime approval grant, or live host loop. Future runtime must use
these rules but is not implemented yet. See
`docs/phase-4-1c-framing-redaction-contracts.md`.

Phase 4.1D adds static TypeScript transcript persistence and replay contract
helpers. It does not add a Rust runtime helper, transcript persistence runtime,
replay runtime, file writer, stdout writer, stderr writer, live stdio reader,
process stdio ownership, approval evaluator, active host-policy enforcement
path, CLI command, runtime approval grant, or live host loop.
`replay-session-transcript` remains proposal-only and rejected. See
`docs/phase-4-1d-transcript-replay-contracts.md`.

Phase 4.1E adds static TypeScript failure-audit, terminal-state,
cleanup/kill, and nonzero-exit mapping contract helpers. It does not add a
Rust runtime helper, failure-audit runtime, cleanup runtime, process killing,
process control, signal handling runtime, timeout runtime, stdout writer,
stderr writer, live stdio reader, process stdio ownership, approval evaluator,
active host-policy enforcement path, CLI command, runtime approval grant, or
live host loop. Failure-audit/cleanup/kill/runtime commands remain
proposal-only and rejected. See
`docs/phase-4-1e-failure-audit-kill-semantics.md`.

Phase 4.1F adds a static runtime-readiness checkpoint that consolidates Phase
4.1 through Phase 4.1E artifacts. It does not add a TypeScript core API, Rust
runtime helper, CLI command, stdout printer, file writer, live stdio reader,
process stdio ownership, approval evaluator, active host-policy enforcement
path, runtime approval grant, or live host loop. The checkpoint cannot grant
runtime approval; future live runtime work must be a separate approved phase.
See `docs/phase-4-1f-runtime-readiness-checkpoint.md`.

Phase 4.1G adds a static external review packet for Devin/human runtime
readiness review. It does not add a TypeScript core API, Rust runtime helper,
CLI command, stdout printer, file writer, live stdio reader, process stdio
ownership, approval evaluator, active host-policy enforcement path, runtime
approval grant, or live host loop. The packet cannot grant runtime approval,
approve runtime implementation, or enable runtime commands. See
`docs/phase-4-1g-external-review-packet.md`.

Phase 4.1H adds a static external review disposition record for Devin's
targeted-fix result after Phase 4.1G. It does not add a TypeScript core API,
Rust runtime helper, CLI command, stdout printer, file writer, live stdio
reader, process stdio ownership, approval evaluator, active host-policy
enforcement path, runtime approval grant, or live host loop. The disposition is
not a fresh Devin re-review; it records that the targeted SHA metadata blocker
was fixed and that only planning the first Rust-host stdio runtime test harness
is the next allowed step. See
`docs/phase-4-1h-external-review-disposition.md`.

## Contract First

Phase 3 keeps ARDYN contract-first before runtime behavior:

- `schemas/ardyn.manifest.schema.json`
- `schemas/capability.schema.json`
- `schemas/task.schema.json`

Current TypeScript support loads manifests and tasks, validates them, resolves requested capabilities into non-executing task plans, and reports approval-gate data. Current Rust support remains a static host identity and handshake boundary. Future code should generate Rust and TypeScript types from these contracts rather than duplicating hand-written model definitions.

## Non-Goals For Phase 3

Phase 3 does not implement:

- Autonomous execution or agent loops.
- Tool execution.
- Browser or desktop control.
- Network serving.
- Plugin installation.
- Torrent download.
- Code-pack enablement.
- Rust task planning or runtime execution.
- Locus live control.
- Multiverse registration.
- Model-provider execution.

Those features should be added only after manifests, capabilities, tasks, permissions, task plans, approval-gate data, and host/core handshake behavior are testable.
