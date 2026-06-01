# @ardyn/cli

CLI app scaffold for ARDYN.

Phase 3 exposes `doctor`, `identity`, `capabilities`, `plan`, and dry-run `serve` commands. No command executes tools, opens network listeners, installs plugins, downloads torrents, enables code packs, or starts agent loops.

```powershell
node apps/cli/src/index.mjs plan --manifest examples/minimal-manifest/ardyn.manifest.json --task examples/minimal-task/task.json
node apps/cli/src/index.mjs plan --trace --manifest examples/minimal-manifest/ardyn.manifest.json --task examples/minimal-task/task.json
node apps/cli/src/index.mjs plan --summary --manifest examples/minimal-manifest/ardyn.manifest.json --task examples/minimal-task/task.json
node apps/cli/src/index.mjs plan --explain --manifest examples/minimal-manifest/ardyn.manifest.json --task examples/minimal-task/task.json
```

`plan` keeps the full default JSON plan unless exactly one output mode is passed. `--trace` prints the full planner trace wrapper, `--summary` prints selected IDs, unresolved requests, approval, and safety flags, and `--explain` prints deterministic candidate ranking and approval reasons. Mode flags are mutually exclusive.
