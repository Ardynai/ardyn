# Phase 4.0H Reviewer Handoff Index

Phase 4.0H adds a static reviewer handoff index for Phase 4.0A through
Phase 4.0H artifacts. It is navigation metadata for Devin/Codex review workflows.
It does not start runtime behavior, approve runtime behavior, write
files, print stdout, read stdin, connect adapters, or grant host-policy
runtime approval.

The deterministic machine-readable metadata for this index is
`tests/fixtures/host-policy/phase4-0h/reviewer-handoff-index.json`. That JSON
fixture is evidence for tests and review automation only. It is not runtime
configuration, not an approval token, not a host-policy grant, and not consumed
by a live host loop.

## How Reviewers Use This Index

Use this document as the first navigation layer when reviewing Phase 4 stdio
dry-run, transport-policy, host-policy metadata, review-record, and comparison
artifacts. The index tells reviewers which files are normative, which files are
fixture evidence, and which files are display-only handoff evidence.

Authoritative entries are limited to normative docs and source contract
surfaces. Evidence-only entries include tests, golden fixtures, display-only
comparison fixtures, and the Phase 4.0H metadata index. Evidence-only entries
can prove determinism or review posture, but they do not define or approve live
runtime behavior.

## Indexed Artifacts

| Phase | Artifact Kind | Index Path | Review Purpose | Runtime Status | Evidence Role | Runtime Approval |
| --- | --- | --- | --- | --- | --- | --- |
| 4.0A | stdio contract doc | `docs/session-events-stdio-contract.md` | Session-event schema and stdio contract baseline used by the finite dry-run emitter. | finite-dry-run-only | normative-doc | false |
| 4.0A | dry-run emitter doc | `docs/phase-4-stdio-dry-run-event-emission.md` | Finite dry-run JSONL stdout and stderr diagnostics behavior for `emit-session-events`. | finite-dry-run-only | normative-doc | false |
| 4.0A | session-event schema test | `tests/session-event-schema.test.mjs` | Validates the session-event schema consumed by the dry-run JSONL stream. | finite-dry-run-only | test-evidence | false |
| 4.0A | dry-run core test | `tests/core-phase4-stdio-dry-run.test.mjs` | Pins core event construction, JSONL formatting, path guards, and non-execution flags. | finite-dry-run-only | test-evidence | false |
| 4.0A | dry-run CLI test | `tests/cli-phase4-stdio-dry-run.test.mjs` | Pins CLI stdout/stderr split, safe failure paths, LF JSONL, and no side effects. | finite-dry-run-only | test-evidence | false |
| 4.0B | golden JSONL fixture | `tests/fixtures/stdio-dry-run/phase4-0b-minimal-session-events.jsonl` | Golden LF-only JSONL stream for the minimal successful dry-run emission. | finite-dry-run-only | fixture-evidence | false |
| 4.0C | transport policy doc | `docs/phase-4-0c-pre-runtime-transport-policy.md` | Pre-runtime stdout, stderr, framing, redaction, backpressure, and replay policy. | pre-runtime-policy-only | normative-doc | false |
| 4.0C | transport policy test | `tests/phase4-0c-transport-policy.test.mjs` | Pins static transport policy wording and source guards before live runtime work. | pre-runtime-policy-only | test-evidence | false |
| 4.0D | Rust-host contract doc | `docs/phase-4-0d-rust-host-transport-policy-contracts.md` | Documents inactive Rust-host stdio transport policy contract types. | pre-runtime-policy-only | normative-doc | false |
| 4.0D | Rust-host contract source | `crates/ardyn-host/src/lib.rs` | Static Rust-host contract, policy metadata, and review-record source evidence. | pre-runtime-policy-only | source-evidence | false |
| 4.0D | Rust-host contract test | `tests/phase4-0d-rust-host-policy-contracts.test.mjs` | Pins inactive Rust-host transport policy documentation and source guards. | pre-runtime-policy-only | test-evidence | false |
| 4.0E | policy metadata doc | `docs/phase-4-0e-rust-host-policy-metadata.md` | Documents deterministic review-only Rust-host policy metadata export. | pre-runtime-policy-only | normative-doc | false |
| 4.0E | policy metadata fixture | `tests/fixtures/host-policy/phase4-0e-stdio-transport-policy-metadata.json` | Golden deterministic policy metadata JSON export for review and digest mapping. | pre-runtime-policy-only | fixture-evidence | false |
| 4.0E | policy metadata test | `tests/phase4-0e-policy-metadata.test.mjs` | Pins policy metadata fixture bytes, Rust helpers, report inventory, and source guards. | pre-runtime-policy-only | test-evidence | false |
| 4.0F | review-record doc | `docs/phase-4-0f-host-policy-review-records.md` | Documents static host-policy review records and compatibility classes. | static-review-record-only | normative-doc | false |
| 4.0F | review-record fixtures | `tests/fixtures/host-policy/phase4-0f/*.json` | Static compatible, upgrade, unsupported, malformed, and rejected-policy review-record evidence. | static-review-record-only | fixture-evidence | false |
| 4.0F | review-record test | `tests/phase4-0f-host-policy-review-records.test.mjs` | Pins review-record fixture determinism, compatibility classes, report metadata, and source guards. | static-review-record-only | test-evidence | false |
| 4.0G | comparison doc | `docs/phase-4-0g-host-policy-review-comparison.md` | Documents display-only comparison output for host-policy review records. | static-display-only | normative-doc | false |
| 4.0G | comparison fixtures | `tests/fixtures/host-policy/phase4-0g/*.json` | Display-only comparison fixtures for compatible, upgrade, unsupported, malformed, rejected, digest, and runtime-status evidence. | static-display-only | display-only-evidence | false |
| 4.0G | comparison test | `tests/phase4-0g-host-policy-review-comparison.test.mjs` | Pins comparison helper behavior, fixture determinism, inert approval metadata, and source guards. | static-display-only | test-evidence | false |
| 4.0H | reviewer handoff doc | `docs/phase-4-0h-reviewer-handoff-index.md` | Reviewer navigation document for Phase 4.0A through Phase 4.0H artifacts. | static-reviewer-index-only | normative-doc | false |
| 4.0H | reviewer handoff metadata | `tests/fixtures/host-policy/phase4-0h/reviewer-handoff-index.json` | Deterministic machine-readable metadata for reviewer handoff navigation. | static-reviewer-index-only | metadata-index | false |
| 4.0H | reviewer handoff test | `tests/phase4-0h-reviewer-handoff-index.test.mjs` | Pins index determinism, artifact existence, inert runtime posture, and source guards. | static-reviewer-index-only | test-evidence | false |
| 4.0H | phase status report | `scripts/report-phase-status.mjs` | Local stdout-only status report source updated to inventory Phase 4.0H. | static-reviewer-index-only | metadata-index | false |
| 4.0H | phase status report test | `tests/report-phase-status.test.mjs` | Pins Phase 4.0H report metadata while proving the report does not execute checks. | static-reviewer-index-only | test-evidence | false |

## Authority And Evidence Boundaries

Normative docs describe the current contract and blocked future preconditions.
Source contract entries show checked-in helper/type surfaces. Test and fixture
entries are evidence that the contract remains deterministic and non-executing.
Display-only comparison entries help reviewers inspect differences; they do
not define approval semantics.

The metadata fixture intentionally repeats `grantsRuntimeApproval: false` and
`runtimeBehaviorIntroduced: false` on every entry. Any future artifact that
needs to enable live runtime behavior must be introduced by a separate
approved phase with explicit host policy, implementation, tests, and runtime
enablement.

## Still Forbidden

Phase 4.0H adds no CLI command, live stdin command loop, live stdio reader,
process stdio ownership, listener, server, subprocess supervisor, adapter
call, Locus runtime dependency, MCP/OpenClaw call, plugin execution path,
Content Fabric download/install/enable behavior, autonomous loop, secret
handling path, production signing-key path, transcript persistence/replay
runtime, WebSocket or HTTP control surface, runtime approval grant, or runtime
execution behavior.

Phase 4.0H does not implement Phase 4.0B, Phase 4.1, or any live runtime
proposal. It only makes existing review artifacts easier to inspect.
