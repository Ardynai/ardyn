# @ardyn/cli

CLI app scaffold for ARDYN.

Phase 4.1 exposes the same command set as Phase 4.0B, Phase 4.0C, Phase
4.0D, Phase 4.0E, Phase 4.0F, Phase 4.0G, Phase 4.0H, and Phase 4.0I:
`doctor`, `identity`, `capabilities`, `plan`, `review-artifact`,
`review-trace`, `validate-session-transcript`, dry-run `serve`, and dry-run
`emit-session-events`. Phase 4.1 adds runtime proposal documentation and
deterministic metadata only; it does not add a proposal CLI command, readiness
CLI command, reviewer-index CLI command, comparison CLI command, live stdio
reader, replay command, listener, server, subprocess supervisor, adapter call,
Locus dependency, MCP/OpenClaw call, plugin execution path, Content Fabric
runtime path, runtime approval grant, live runtime implementation, or agent
loop. See `docs/phase-4-1-runtime-proposal.md`.

Phase 4.0C adds pre-runtime transport policy only as the historical predecessor
to Phase 4.0D; it adds no replay or live runtime CLI.

```powershell
node apps/cli/src/index.mjs plan --manifest examples/minimal-manifest/ardyn.manifest.json --task examples/minimal-task/task.json
node apps/cli/src/index.mjs plan --trace --manifest examples/minimal-manifest/ardyn.manifest.json --task examples/minimal-task/task.json
node apps/cli/src/index.mjs plan --summary --manifest examples/minimal-manifest/ardyn.manifest.json --task examples/minimal-task/task.json
node apps/cli/src/index.mjs plan --explain --manifest examples/minimal-manifest/ardyn.manifest.json --task examples/minimal-task/task.json
node apps/cli/src/index.mjs plan --review-artifact --manifest examples/minimal-manifest/ardyn.manifest.json --task examples/minimal-task/task.json
node apps/cli/src/index.mjs plan --review-artifact --manifest examples/minimal-manifest/ardyn.manifest.json --task examples/minimal-task/task.json --output approval-review-artifact.json
node apps/cli/src/index.mjs review-artifact --file tests/fixtures/review-artifacts/phase3-6/current-compatible-v1.json --summary
node apps/cli/src/index.mjs review-artifact --file tests/fixtures/review-artifacts/phase3-6/compatible-unknown-fields.json --explain
node apps/cli/src/index.mjs review-artifact --file tests/fixtures/review-artifacts/phase3-7/older-compatible-review-artifact.json --schema-status
node apps/cli/src/index.mjs review-artifact --file tests/fixtures/review-artifacts/phase3-7/current-compatible-review-artifact.json --attestation-plan
node apps/cli/src/index.mjs review-trace --left tests/fixtures/trace-comparison/left-approval-review-artifact.json --right tests/fixtures/trace-comparison/right-approval-review-artifact.json
node apps/cli/src/index.mjs review-trace --summary --left tests/fixtures/trace-comparison/left-approval-review-artifact.json --right tests/fixtures/trace-comparison/right-approval-review-artifact.json
node apps/cli/src/index.mjs review-trace --explain --left tests/fixtures/trace-comparison/left-approval-review-artifact.json --right tests/fixtures/trace-comparison/right-approval-review-artifact.json
node apps/cli/src/index.mjs validate-session-transcript --file examples/session-transcripts/valid-minimal.json
node apps/cli/src/index.mjs validate-session-transcript --file examples/session-transcripts/valid-task-approval.json --summary
node apps/cli/src/index.mjs validate-session-transcript --file tests/fixtures/session-transcripts/phase3-10/older-compatible-upgrade-available.json --schema-status
node apps/cli/src/index.mjs validate-session-transcript --file tests/fixtures/session-transcripts/phase3-10/display-summary.json --display-summary
node apps/cli/src/index.mjs validate-session-transcript --file tests/fixtures/session-transcripts/phase3-10/unsupported-major.json --compatibility-explain
node apps/cli/src/index.mjs emit-session-events --dry-run --manifest examples/minimal-manifest/ardyn.manifest.json --task examples/minimal-task/task.json
```

`plan` keeps the full default JSON plan unless exactly one output mode is passed. `--trace` prints the full planner trace wrapper, `--summary` prints selected IDs, unresolved requests, approval, and safety flags, `--explain` prints deterministic candidate ranking and approval reasons, and `--review-artifact` prints the stable approval review artifact. Mode flags are mutually exclusive.

For planner review workflows:

- Use default `plan` when an existing consumer needs the full Phase 3 plan JSON.
- Use `--trace` to inspect the retained planner trace without the rest of the plan envelope.
- Use `--summary` for approval-gate checks that only need selected ids, unresolved requests, approval, and safety.
- Use `--explain` when reviewing why a capability tier won and which lower-ranked candidates were retained.
- Use `--review-artifact` when an approval reviewer needs the stable non-executing artifact with candidate rankings, selected ids, unresolved requests, approval decision, and false safety flags.
- Add `--output <file>` only with `--review-artifact` to write the same formatted artifact JSON bytes to that file. The command prints a compact JSON export summary to stdout and writes no other files.

All plan output modes are JSON-only renderings of the same non-executing plan data.
`--output` is rejected unless `--review-artifact` is selected, and a missing output path fails with plain stderr and no JSON stdout.

`review-artifact --file <file> --summary|--explain|--schema-status|--attestation-plan` reads one local `.json` approval review artifact and renders deterministic display JSON with Phase 3.6 compatibility classification plus Phase 3.7 schema migration and attestation planning metadata. URLs, `file:` URLs, and UNC/network-style paths are rejected.

For review artifact display workflows:

- Use `--summary` when a reviewer needs the compact core display summary plus compatibility.
- Use `--explain` when a reviewer needs version validation details, compatibility, approval status, safety flags, inert unknown-field handling, display guidance, and the normalized display view.
- Use `--schema-status` when a reviewer needs schema id/version, compatibility, migration availability, migration notes, and a compact migration/attestation display summary. Unsupported major and malformed artifacts are classified rather than executed.
- Use `--attestation-plan` when a reviewer needs the unsigned Phase 3.7 attestation planning record with deterministic artifact digest metadata, placeholder signer identity, planned signing algorithm, verification status, and false safety flags.

Unsupported major versions and malformed version metadata fail for `--summary` and `--explain`, and are classified for `--schema-status` and `--attestation-plan`. Unknown fields are preserved only as inert display data; the CLI does not execute or interpret them. `review-artifact` performs no writes, network calls, process spawning, adapter connections, plugin installation, Content Fabric runtime work, code-pack enablement, autonomous loops, key loading, or production signing.

`review-trace --left <file> --right <file>` reads two local `.json` files and compares them with the core approval review artifact comparator. Default output includes equality, difference count, full deterministic differences, left/right schema-version-task-manifest summaries, `nonExecuting: true`, and false safety flags.

For trace review workflows:

- Use default `review-trace` when a consumer needs the full deterministic difference list.
- Use `--summary` when a reviewer only needs equality, count, changed difference types, source summaries, and safety flags.
- Use `--explain` when a reviewer needs deterministic reasons and details for each difference.

`--summary` and `--explain` are mutually exclusive. `review-trace` performs no writes, network calls, process spawning, adapter connections, plugin installation, Content Fabric runtime work, code-pack enablement, or autonomous loops.

`validate-session-transcript --file <file>` reads one local `.json` session transcript and renders deterministic validation JSON. Default output and the existing `--summary` and `--explain` modes are preserved. Phase 3.10 adds `--schema-status`, `--display-summary`, and `--compatibility-explain` as mutually exclusive read-only output modes.

For session transcript display workflows:

- Use default output for strict Phase 3.9 validation plus classification.
- Use `--summary` for the existing compact transcript summary.
- Use `--explain` for the existing validation checklist and summary explanation.
- Use `--schema-status` for transcript schema id/version compatibility and migration metadata.
- Use `--display-summary` for Locus-facing read-only counts, warnings, unknown-field metadata, and safety posture.
- Use `--compatibility-explain` for compatibility reasoning, migration notes, display warnings, and inert unknown-field policy.

Older same-major transcripts may be classified as `upgrade_available` for display-only review. Unsupported major and malformed transcripts are classified and explained without execution. Unknown root fields are surfaced only as inert display metadata. URLs, `file:` URLs, and UNC/network-style paths are rejected; the command performs no writes, network calls, process spawning, adapter connections, plugin installation, Content Fabric runtime work, code-pack enablement, or autonomous loops.

`emit-session-events --dry-run --manifest <file> --task <file>` reads one local
manifest JSON file and one local task JSON file, constructs the deterministic
non-executing plan, and writes Phase 4.0A session events as JSONL to stdout.
Phase 4.0B hardens the parser: unknown flags, duplicate flags, missing flag
values, and extra positional arguments fail before any file reads. Errors use
plain stderr and no JSON stdout. The command has no stdin command loop,
listener, server, subprocess spawning, adapter calls, Locus dependency,
MCP/OpenClaw calls, plugin execution, Content Fabric download/install/enable
behavior, or file writes.

Phase 4.0C documents future stdout/stderr ownership, JSONL framing, stderr
redaction, backpressure, partial-write, line-integrity, process-exit, and
transcript replay policy. It intentionally adds no replay or live runtime CLI.

Phase 4.0D codifies that policy as Rust-host contract types in
`crates/ardyn-host/src/lib.rs` and leaves CLI behavior unchanged. It
intentionally adds no replay, live stdio, WebSocket, HTTP, subprocess,
adapter, plugin, Content Fabric, secret, or production signing-key command.
See `docs/phase-4-0d-rust-host-transport-policy-contracts.md`.

Phase 4.0E exports those Rust-host policy contracts as deterministic
review-only JSON metadata from Rust helpers and still leaves CLI behavior
unchanged. It adds no policy metadata CLI command, no file writer, no stdout
printer, and no runtime command. See
`docs/phase-4-0e-rust-host-policy-metadata.md`.

Phase 4.0F makes host-policy review records current static artifacts in the
Rust host and still leaves CLI behavior unchanged. It adds no review-record CLI
command, no file writer, no stdout printer, no runtime command, and no runtime
approval grant. See `docs/phase-4-0f-host-policy-review-records.md`.

Phase 4.0G adds display-only comparison helpers for those review records in
`@ardyn/core` and still leaves CLI behavior unchanged. It adds no comparison
CLI command, no file writer, no stdout printer, no runtime command, and no
runtime approval grant. See
`docs/phase-4-0g-host-policy-review-comparison.md`.

Phase 4.0H adds a static reviewer handoff index and still leaves CLI behavior
unchanged. It adds no reviewer-index CLI command, no file writer, no stdout
printer, no runtime command, and no runtime approval grant. See
`docs/phase-4-0h-reviewer-handoff-index.md`.

Phase 4.0I adds a static final pre-runtime readiness bundle and still leaves
CLI behavior unchanged. It adds no readiness CLI command, no reviewer-index CLI
command, no file writer, no stdout printer, no runtime command, no Phase 4.1
implementation, and no runtime approval grant. See
`docs/phase-4-0i-final-pre-runtime-readiness.md`.

Phase 4.1 adds a static runtime proposal bundle and still leaves CLI behavior
unchanged. It adds no proposal CLI command, no runtime command, no
`replay-session-transcript`, no `serve-runtime`, no `stdio-runtime`, no file
writer, no stdout printer, no live stdio reader, no process stdio ownership,
no transcript persistence/replay runtime, and no runtime approval grant. See
`docs/phase-4-1-runtime-proposal.md`.
