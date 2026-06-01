# @ardyn/cli

CLI app scaffold for ARDYN.

Phase 3 exposes `doctor`, `identity`, `capabilities`, `plan`, and dry-run `serve` commands. No command executes tools, opens network listeners, installs plugins, downloads torrents, enables code packs, or starts agent loops.

```powershell
node apps/cli/src/index.mjs plan --manifest examples/minimal-manifest/ardyn.manifest.json --task examples/minimal-task/task.json
```
