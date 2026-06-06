# Phase 4.1G External Review Packet

Phase 4.1G prepares the external runtime-readiness review packet for Devin or a
human reviewer. It is review packet metadata only. It does not implement
runtime behavior, does not add a CLI command, does not evaluate approval
records, and cannot grant runtime approval.

Current main SHA at packet preparation:
`3a2f28e02494cb2ac0735e6bec32f283f4b616db`.

The deterministic packet fixture is
`tests/fixtures/host-policy/phase4-1g/external-review-packet.json`. That
fixture is not runtime configuration, not an approval token, not host-policy
enforcement, not consumed by a live host loop, not a stdout/stderr writer, and
not a transcript persistence or replay runtime. Future live runtime work still
requires a separately approved implementation phase after review.

## Reviewed Range

This packet reviews the static Phase 4.0A through Phase 4.1F lane:

| Phase | Summary | Primary Evidence |
| --- | --- | --- |
| 4.0A | Finite non-executing stdio dry-run event emitter, local JSON path guards, deterministic JSONL formatting, and stderr diagnostics. | `docs/phase-4-stdio-dry-run-event-emission.md`, `tests/cli-phase4-stdio-dry-run.test.mjs`, `tests/core-phase4-stdio-dry-run.test.mjs` |
| 4.0B | Dry-run hardening and golden JSONL coverage without live stdio runtime. | `docs/phase-4-stdio-dry-run-event-emission.md`, `tests/fixtures/stdio-dry-run/phase4-0b-minimal-session-events.jsonl` |
| 4.0C | Pre-runtime stdout/stderr, redaction, transport failure, replay design, and ownership split policy. | `docs/phase-4-0c-pre-runtime-transport-policy.md`, `tests/phase4-0c-transport-policy.test.mjs` |
| 4.0D | Rust-host transport policy contracts and fail-closed modeling. | `docs/phase-4-0d-rust-host-transport-policy-contracts.md`, `tests/phase4-0d-rust-host-policy-contracts.test.mjs` |
| 4.0E | Static Rust-host policy metadata export and host-policy review-record mapping. | `docs/phase-4-0e-rust-host-policy-metadata.md`, `tests/fixtures/host-policy/phase4-0e-stdio-transport-policy-metadata.json` |
| 4.0F | Static host-policy review records and compatibility classifications. | `docs/phase-4-0f-host-policy-review-records.md`, `tests/phase4-0f-host-policy-review-records.test.mjs` |
| 4.0G | Static host-policy review comparison records and fail-closed comparison behavior. | `docs/phase-4-0g-host-policy-review-comparison.md`, `tests/phase4-0g-host-policy-review-comparison.test.mjs` |
| 4.0H | Reviewer handoff index for static evidence and role boundaries. | `docs/phase-4-0h-reviewer-handoff-index.md`, `tests/fixtures/host-policy/phase4-0h/reviewer-handoff-index.json` |
| 4.0I | Final static pre-runtime readiness checklist and bundle. | `docs/phase-4-0i-final-pre-runtime-readiness.md`, `tests/fixtures/host-policy/phase4-0i/final-pre-runtime-readiness.json` |
| 4.1 | Runtime proposal and phased implementation plan only. | `docs/phase-4-1-runtime-proposal.md`, `tests/fixtures/host-policy/phase4-1/runtime-proposal.json` |
| 4.1A | Static host-policy approval records and operator consent model. | `docs/phase-4-1a-host-policy-approval-records.md`, `tests/fixtures/host-policy/phase4-1a/valid-review-only-host-policy-approval-record.json` |
| 4.1B | Static Rust-host transport harness contracts. | `docs/phase-4-1b-transport-harness-contracts.md`, `tests/fixtures/host-policy/phase4-1b/valid-static-transport-harness-contract.json` |
| 4.1C | Static stdout JSONL framing and stderr redaction contracts. | `docs/phase-4-1c-framing-redaction-contracts.md`, `tests/fixtures/host-policy/phase4-1c/valid-static-framing-redaction-contract.json` |
| 4.1D | Static transcript persistence and replay contracts. | `docs/phase-4-1d-transcript-replay-contracts.md`, `tests/fixtures/host-policy/phase4-1d/valid-static-transcript-replay-contract.json` |
| 4.1E | Static failure-audit, terminal-state, kill, cleanup, and exit semantics contracts. | `docs/phase-4-1e-failure-audit-kill-semantics.md`, `tests/fixtures/host-policy/phase4-1e/valid-static-failure-audit-record.json` |
| 4.1F | Static runtime-readiness checkpoint with readiness matrix, blockers, Codex validation bundle, and runtime still blocked. | `docs/phase-4-1f-runtime-readiness-checkpoint.md`, `tests/fixtures/host-policy/phase4-1f/runtime-readiness-checkpoint.json` |

## Runtime-Readiness Evidence Map

The reviewer should inspect these evidence groups:

| Evidence Group | Phases | Paths |
| --- | --- | --- |
| Finite dry-run emitter | 4.0A, 4.0B | `docs/phase-4-stdio-dry-run-event-emission.md`, `tests/cli-phase4-stdio-dry-run.test.mjs`, `tests/core-phase4-stdio-dry-run.test.mjs` |
| Transport policy and Rust-host contracts | 4.0C, 4.0D, 4.0E | `docs/phase-4-0c-pre-runtime-transport-policy.md`, `docs/phase-4-0d-rust-host-transport-policy-contracts.md`, `docs/phase-4-0e-rust-host-policy-metadata.md` |
| Host-policy review and handoff | 4.0F, 4.0G, 4.0H | `docs/phase-4-0f-host-policy-review-records.md`, `docs/phase-4-0g-host-policy-review-comparison.md`, `docs/phase-4-0h-reviewer-handoff-index.md` |
| Final pre-runtime boundary | 4.0I | `docs/phase-4-0i-final-pre-runtime-readiness.md` |
| Phase 4.1 static planning lane | 4.1 through 4.1F | `docs/phase-4-1-runtime-proposal.md`, `docs/phase-4-1a-host-policy-approval-records.md`, `docs/phase-4-1b-transport-harness-contracts.md`, `docs/phase-4-1c-framing-redaction-contracts.md`, `docs/phase-4-1d-transcript-replay-contracts.md`, `docs/phase-4-1e-failure-audit-kill-semantics.md`, `docs/phase-4-1f-runtime-readiness-checkpoint.md` |
| Local status inventory | 4.0A through 4.1G | `scripts/report-phase-status.mjs`, `tests/report-phase-status.test.mjs` |

## Required Validation And Smoke Commands

Before this packet is sent for review, run:

- `npm test`
- `npm run test:schemas`
- `cargo test --workspace`
- `cargo check --workspace`
- `cargo fmt --check`
- `git diff --check`
- `npm run report:phase-status`

Smoke checks must also confirm:

- `emit-session-events --dry-run` exits 0, writes JSONL only to stdout, uses
  LF-only lines, ends with a final LF, emits six event lines, and writes zero
  stderr.
- Missing `--dry-run`, unknown args, unsafe manifest URLs, invalid JSON
  manifest files, invalid JSON task files, proposal-only commands, and runtime
  command probes fail nonzero with zero stdout and diagnostics on stderr.
- `serve-runtime`, `stdio-runtime`, `replay-session-transcript`,
  `policy-metadata`, `host-policy-export`, approval-evaluator commands,
  transcript replay commands, process-control commands, and review-packet
  command names are rejected unless a later approved phase deliberately adds
  a static command.

## Non-Runtime Invariant Matrix

| Invariant | Phase 4.1G Status |
| --- | --- |
| No live runtime | Preserved |
| No live stdin command loop | Preserved |
| No live stdio reader or writer | Preserved |
| No listener/server or WebSocket/HTTP control surface | Preserved |
| No subprocess spawning or process control | Preserved |
| No adapter call, Locus runtime dependency, MCP/OpenClaw call, plugin execution, or Content Fabric runtime behavior | Preserved |
| No Content Fabric download/install/enable behavior | Preserved |
| No autonomous loop | Preserved |
| No secret handling or production signing-key usage | Preserved |
| No transcript persistence/replay runtime | Preserved |
| No runtime approval grant | Preserved |

## Blocked Runtime Surfaces

Phase 4.1G keeps these surfaces blocked:

- `serve-runtime`
- `stdio-runtime`
- `replay-session-transcript`
- approval evaluator and host-policy enforcement runtime
- process stdio ownership, live stdin loop, stdout writer, and stderr writer
- failure audit, cleanup, kill, signal, timeout, and fail-closed runtime
- transcript persistence and replay runtime
- adapter, Locus runtime, MCP/OpenClaw, plugin, and Content Fabric runtime
  integrations
- WebSocket/HTTP control surfaces
- any runtime approval grant or runtime enablement token

Each blocked surface requires a separate approved implementation phase before
it can be implemented or enabled.

## Reviewer Questions

The packet asks Devin or a human reviewer to answer:

1. Does the packet accurately map the Phase 4.0A through Phase 4.1F evidence
   needed for runtime-readiness review?
2. Are any blocked runtime surfaces missing from the packet before ARDYN starts
   a separately approved runtime implementation phase?
3. Do the non-runtime invariants and probes demonstrate that the current repo
   still contains no live runtime command, approval evaluator, process control,
   or external integration runtime?
4. What exact additional evidence, tests, and approvals are required before any
   live runtime implementation path may exist?
5. Should ARDYN remain blocked from live runtime implementation until a
   separate implementation phase is approved after this packet review?

Question categories in the fixture are `packet-navigation`,
`documentation-consistency`, `evidence-completeness`, `scope-boundary`,
`approval-consent-boundary`, `runtime-negative-surface`,
`transport-stdio-boundary`, `transcript-replay-boundary`,
`failure-audit-kill-boundary`, `external-integration-boundary`, and
`blocker-disposition`.

## Recommended Outcomes

Allowed outcomes are packet-only outcomes:

- `approve-packet-only`: the packet is ready for review handoff; runtime
  remains blocked.
- `deny-runtime`: runtime must remain blocked and no live runtime
  implementation may start.
- `check-again`: add requested static evidence and rerun validation; do not
  implement runtime.

The fixture also records outcome categories for reviewer disposition:
`packet-pass-runtime-still-blocked`,
`packet-pass-with-nits-runtime-still-blocked`,
`needs-clarification-runtime-still-blocked`,
`evidence-gap-runtime-still-blocked`,
`runtime-claim-detected-fail-closed`,
`out-of-scope-runtime-request`, and
`external-review-recorded-runtime-still-blocked`.

Every outcome has `grantsRuntimeApproval: false`,
`runtimeImplementationApproved: false`, `runtimeEnablementApproved: false`,
`runtimeBehaviorIntroduced: false`, and
`runtimeUnblockRequiresSeparateApproval: true`.

## Approval Boundary

Phase 4.1G may approve only the existence of this review packet. It cannot
approve runtime implementation, runtime enablement, runtime commands, process
stdio ownership, host-policy enforcement runtime, adapter calls, Locus runtime
dependency, MCP/OpenClaw calls, plugin execution, Content Fabric
download/install/enable behavior, secret handling, or production signing-key
usage.

If a reviewer finds the packet acceptable, the next step is still a separate
explicit runtime implementation approval. Phase 4.1G itself is not that
approval.

## Phase 4.1H Disposition Follow-Up

Phase 4.1H records Devin's targeted-fix disposition after this packet. See
`docs/phase-4-1h-external-review-disposition.md`. Phase 4.1H is static review
metadata only: it records the fixed `currentMainSha`, the targeted fix commit,
validation and smoke summaries, still-blocked runtime surfaces, and the
planning-only next step. It is not a fresh Devin re-review and cannot grant
runtime approval.
