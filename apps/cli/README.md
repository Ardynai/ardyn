# @ardyn/cli

CLI app scaffold for ARDYN.

Phase 3 exposes `doctor`, `identity`, `capabilities`, `plan`, `review-artifact`, `review-trace`, and dry-run `serve` commands. No command executes tools, opens network listeners, installs plugins, downloads torrents, enables code packs, or starts agent loops.

```powershell
node apps/cli/src/index.mjs plan --manifest examples/minimal-manifest/ardyn.manifest.json --task examples/minimal-task/task.json
node apps/cli/src/index.mjs plan --trace --manifest examples/minimal-manifest/ardyn.manifest.json --task examples/minimal-task/task.json
node apps/cli/src/index.mjs plan --summary --manifest examples/minimal-manifest/ardyn.manifest.json --task examples/minimal-task/task.json
node apps/cli/src/index.mjs plan --explain --manifest examples/minimal-manifest/ardyn.manifest.json --task examples/minimal-task/task.json
node apps/cli/src/index.mjs plan --review-artifact --manifest examples/minimal-manifest/ardyn.manifest.json --task examples/minimal-task/task.json
node apps/cli/src/index.mjs plan --review-artifact --manifest examples/minimal-manifest/ardyn.manifest.json --task examples/minimal-task/task.json --output approval-review-artifact.json
node apps/cli/src/index.mjs review-artifact --file tests/fixtures/review-artifacts/phase3-6/current-compatible-v1.json --summary
node apps/cli/src/index.mjs review-artifact --file tests/fixtures/review-artifacts/phase3-6/compatible-unknown-fields.json --explain
node apps/cli/src/index.mjs review-trace --left tests/fixtures/trace-comparison/left-approval-review-artifact.json --right tests/fixtures/trace-comparison/right-approval-review-artifact.json
node apps/cli/src/index.mjs review-trace --summary --left tests/fixtures/trace-comparison/left-approval-review-artifact.json --right tests/fixtures/trace-comparison/right-approval-review-artifact.json
node apps/cli/src/index.mjs review-trace --explain --left tests/fixtures/trace-comparison/left-approval-review-artifact.json --right tests/fixtures/trace-comparison/right-approval-review-artifact.json
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

`review-artifact --file <file> --summary|--explain` reads one local `.json` approval review artifact and renders deterministic display JSON with Phase 3.6 compatibility classification. URLs, `file:` URLs, and UNC/network-style paths are rejected.

For review artifact display workflows:

- Use `--summary` when a reviewer needs the compact core display summary plus compatibility.
- Use `--explain` when a reviewer needs version validation details, compatibility, approval status, safety flags, inert unknown-field handling, display guidance, and the normalized display view.

Unsupported major versions and malformed version metadata fail with plain stderr and no JSON stdout. Unknown fields are preserved only as inert display data; the CLI does not execute or interpret them. `review-artifact` performs no writes, network calls, process spawning, adapter connections, plugin installation, Content Fabric runtime work, code-pack enablement, or autonomous loops.

`review-trace --left <file> --right <file>` reads two local `.json` files and compares them with the core approval review artifact comparator. Default output includes equality, difference count, full deterministic differences, left/right schema-version-task-manifest summaries, `nonExecuting: true`, and false safety flags.

For trace review workflows:

- Use default `review-trace` when a consumer needs the full deterministic difference list.
- Use `--summary` when a reviewer only needs equality, count, changed difference types, source summaries, and safety flags.
- Use `--explain` when a reviewer needs deterministic reasons and details for each difference.

`--summary` and `--explain` are mutually exclusive. `review-trace` performs no writes, network calls, process spawning, adapter connections, plugin installation, Content Fabric runtime work, code-pack enablement, or autonomous loops.
