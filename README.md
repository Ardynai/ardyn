# ARDYN

ARDYN is an open-source AI harness/framework for running local and networked agent systems with explicit manifests, capabilities, task contracts, and adapter boundaries.

ARDYN is not Locus and is not Multiverse.

- Locus is mission control. It can run, observe, and control ARDYN through public ARDYN APIs and adapters.
- Multiverse is an external closed-source product/network. ARDYN can optionally register with Multiverse through an adapter, but Multiverse is not required to run ARDYN.
- OpenClaw, Hermes, Agent Zero, Space Agent, HiClaw, AgentScope, and related systems are references only. ARDYN does not copy their source code.

## Phase 3 Scope

This repository is currently in Phase 3 task-planning mode. The goal is to load and validate ARDYN manifests and tasks, resolve requested capabilities into deterministic non-executing plans, report static TypeScript/Rust host identity, and expose dry-run handshake data before autonomous execution exists.

Included now:

- Architecture and adapter-boundary documentation.
- Content Fabric v1.0.0 conformance foundation.
- JSON Schemas for ARDYN manifests, capabilities, and tasks.
- Schema-matching TypeScript and Rust contract types.
- Minimal TypeScript core functions for manifest loading, validation, capability normalization, and static handshakes.
- Minimal task loading, validation, deterministic ranked capability resolution, approval-gate data, approval-decision records, and planner traces.
- Stable approval review artifacts for planning review and trace comparison.
- Local `review-trace` comparison for JSON approval review artifacts.
- Review-artifact version validation, display normalization, and display
  summary helpers for Phase 3.6 viewer contracts.
- Schema migration metadata and review-artifact attestation planning helpers
  for Phase 3.7 review workflows.
- Phase 3.8 harness identity alignment with canonical slug `ardyn`, Locus
  read-only display contract freeze, Content Fabric family reconciliation, and
  stdio-first session-event schemas/examples.
- Metadata-only adapter registration stubs for OpenClaw, MCP, and the plugin API.
- Minimal Rust host functions for host info, platform info, optional manifest loading, and non-executing host handshakes.
- CLI commands for doctor, identity, capabilities, task planning, review-artifact display review, review-trace comparison, and dry-run serve planning.
- Schema, core, CLI, and Rust host tests.

Not included yet:

- Autonomous agent execution.
- Tool execution.
- Credential vaulting.
- Live Locus control.
- Multiverse registration.
- Browser or desktop automation.
- Production tool execution.
- A serving mode that opens ports, starts agents, calls APIs, or spawns long-running services.
- Content Fabric download, install, seed, enable, catalog serving, or execution.
- Plugin installation, torrent download, code-pack enablement, or agent loops.
- Production signing keys, secret handling, or runtime attestation trust gates.
- Stdio session-event runtime, WebSocket transport, HTTP transport, or live
  Locus connector behavior.

## Architecture

The preferred architecture is a Rust host plus TypeScript core.

- The Rust host owns local process supervision, OS integration, Windows-first packaging, policy enforcement, and safe host boundaries.
- The TypeScript core owns orchestration contracts, SDK surfaces, MCP integration, adapter interfaces, and developer-facing plugin APIs.
- JSON Schemas are the shared contract source for manifests, capabilities, and tasks.
- Content Fabric support is currently conformance-only under `packages/fabric`; runtime pack handling is future work.

## Testing

This repo uses npm workspaces; `package-lock.json` is the authoritative Node workspace lockfile.

```powershell
npm test
cargo test -p ardyn-host
```

The current test suite validates schema behavior, TypeScript manifest/handshake behavior, CLI output, and Rust host handshake behavior.

A `typecheck` script is deferred for now. The repository currently has JavaScript modules plus `.d.ts` contract files and a shared `tsconfig.base.json`, but no TypeScript compiler dependency or TypeScript source compilation path to check.

## Phase 3 CLI Usage

Run commands directly from source during Phase 3:

```powershell
node apps/cli/src/index.mjs doctor
node apps/cli/src/index.mjs identity
node apps/cli/src/index.mjs capabilities --manifest examples/minimal-manifest/ardyn.manifest.json
node apps/cli/src/index.mjs plan --manifest examples/minimal-manifest/ardyn.manifest.json --task examples/minimal-task/task.json
node apps/cli/src/index.mjs plan --review-artifact --manifest examples/minimal-manifest/ardyn.manifest.json --task examples/minimal-task/task.json
node apps/cli/src/index.mjs plan --review-artifact --manifest examples/minimal-manifest/ardyn.manifest.json --task examples/minimal-task/task.json --output approval-review-artifact.json
npm exec ardyn -- review-artifact --file tests/fixtures/review-artifacts/phase3-6/current-compatible-v1.json --summary
npm exec ardyn -- review-artifact --file tests/fixtures/review-artifacts/phase3-6/compatible-unknown-fields.json --explain
npm exec ardyn -- review-artifact --file tests/fixtures/review-artifacts/phase3-7/older-compatible-review-artifact.json --schema-status
npm exec ardyn -- review-artifact --file tests/fixtures/review-artifacts/phase3-7/current-compatible-review-artifact.json --attestation-plan
node apps/cli/src/index.mjs review-trace --left tests/fixtures/trace-review/equal-left-approval-review-artifact.json --right tests/fixtures/trace-review/equal-right-approval-review-artifact.json
node apps/cli/src/index.mjs serve --dry-run --manifest examples/minimal-manifest/ardyn.manifest.json
```

Successful commands print JSON. Failure cases write plain text to stderr and do not print JSON to stdout. The `plan` command validates the task, scores candidate capabilities deterministically, and includes `plannerTrace` automatically unless a focused output mode is selected. Exact capability IDs score 300, capability tags score 200, and permission scopes score 100. Exact matches outrank tag matches, tag matches outrank scope matches, ties are sorted by capability ID, and no-match resolutions include empty candidates and selected capability IDs.

`plan --review-artifact --output <file>` is the only Phase 3.5 CLI path that
writes a file. It writes the formatted approval review artifact JSON only to
the requested output path and prints a compact JSON export summary to stdout.
It does not write adjacent files, open directories, contact services, or change
the plan data.

`review-trace --left <file> --right <file>` reads two local JSON review
artifacts and prints deterministic JSON. Default output reports the full diff;
`--summary` reports compact changed types and counts; `--explain` reports
review-oriented reasons and details. `--summary` and `--explain` are mutually
exclusive.

`review-artifact --file <file> --summary|--explain|--schema-status|--attestation-plan`
reads one local JSON approval review artifact and prints deterministic display
JSON. It validates a local file path only; URLs, `file:` URLs, and
network-style paths are rejected. It performs no writes, does not call
adapters, does not connect to Locus, does not load signing keys, and does not
produce production signatures.

The `plan`, `plan --trace`, `plan --summary`, `plan --explain`,
`plan --review-artifact`, `review-artifact`, `review-trace`, and
`serve --dry-run` commands are intentionally non-executing: they do not open
network ports, execute tools, start agents, call APIs, install plugins,
download torrents, enable code packs, run agent loops, connect adapters, call
MCP/OpenClaw, connect to Locus, serve Content Fabric catalogs, or spawn
long-running services. Their output includes explicit false values for the
safety flags that cover those behaviors.

Phase 3.3-3.8 review examples:

```powershell
node apps/cli/src/index.mjs plan --manifest tests/fixtures/planning-manifest.json --task tests/fixtures/tasks/exact-match.json
node apps/cli/src/index.mjs plan --manifest tests/fixtures/planning-manifest.json --task tests/fixtures/tasks/tag-match.json
node apps/cli/src/index.mjs plan --manifest tests/fixtures/planning-manifest.json --task tests/fixtures/tasks/scope-match.json
node apps/cli/src/index.mjs plan --manifest tests/fixtures/planning-manifest.json --task tests/fixtures/tasks/no-match.json
node apps/cli/src/index.mjs plan --manifest tests/fixtures/planning-manifest.json --task tests/fixtures/tasks/approval-required.json
node apps/cli/src/index.mjs plan --trace --manifest tests/fixtures/planning-manifest.json --task tests/fixtures/tasks/tag-match.json
node apps/cli/src/index.mjs plan --summary --manifest tests/fixtures/planning-manifest.json --task tests/fixtures/tasks/approval-required.json
node apps/cli/src/index.mjs plan --explain --manifest tests/fixtures/planning-manifest.json --task tests/fixtures/tasks/exact-match.json
node apps/cli/src/index.mjs plan --review-artifact --manifest tests/fixtures/planning-manifest.json --task tests/fixtures/tasks/approval-required.json
node apps/cli/src/index.mjs plan --review-artifact --manifest tests/fixtures/planning-manifest.json --task tests/fixtures/tasks/approval-required.json --output approval-review-artifact.json
npm exec ardyn -- review-artifact --file tests/fixtures/review-artifacts/phase3-6/current-compatible-v1.json --summary
npm exec ardyn -- review-artifact --file tests/fixtures/review-artifacts/phase3-6/compatible-unknown-fields.json --explain
npm exec ardyn -- review-artifact --file tests/fixtures/review-artifacts/phase3-7/older-compatible-review-artifact.json --schema-status
npm exec ardyn -- review-artifact --file tests/fixtures/review-artifacts/phase3-7/current-compatible-review-artifact.json --attestation-plan
node apps/cli/src/index.mjs review-trace --left tests/fixtures/trace-review/equal-left-approval-review-artifact.json --right tests/fixtures/trace-review/equal-right-approval-review-artifact.json
node apps/cli/src/index.mjs review-trace --summary --left tests/fixtures/trace-review/equal-left-approval-review-artifact.json --right tests/fixtures/trace-review/selected-capability-changed-approval-review-artifact.json
node apps/cli/src/index.mjs review-trace --explain --left tests/fixtures/trace-review/equal-left-approval-review-artifact.json --right tests/fixtures/trace-review/approval-status-changed-approval-review-artifact.json
```

Review outcomes:

- Exact match: `exact-match.json` requests `network`, selects `network` by exact id with score `300`, and leaves lower-ranked tag and scope candidates visible for review.
- Tag match: `tag-match.json` requests `filesystem`, selects `alpha.tag` and `beta.tag` by tag with score `200`, and leaves the lower-ranked scope candidate visible.
- Scope match: `scope-match.json` requests `memory`, selects `network` by permission scope with score `100`, and does so only because no exact id or tag candidate exists for `memory`.
- No match: `no-match.json` requests `missing.capability`, selects nothing, and records the request in `unresolvedRequests`.
- Approval required: `approval-required.json` selects `secure.registry`, records task and policy approval reasons, reports `approval.status: "approval-required"`, and keeps `approvalDecision.nonExecuting: true`.
- Denied review simulation: a simulated planner decision with `approvalDecision.status: "denied"` is review metadata only. It may produce `approval.status: "approval-denied"` when approval is required, but it must not call cancellation hooks, run tools, connect adapters, spawn processes, or change safety flags.
- Trace: `plan --trace` prints the planner trace wrapper for intake, candidates, selected capabilities, unresolved requests, approval decision, and safety review.
- Summary: `plan --summary` prints selected capability ids, unresolved requests, approval data, and safety flags without the full trace.
- Explain: `plan --explain` prints deterministic candidate ranking, match reasons, approval reasons, and the same non-executing safety flags.
- Review artifact: `plan --review-artifact` prints a stable
  `ardyn.approval-review-artifact` JSON document with requested capability ids,
  deterministic candidate rankings, selected capability ids, unresolved
  requests, the approval decision, `nonExecuting: true`, and false safety flags.
- Review artifact export: `plan --review-artifact --output <file>` writes only
  that artifact JSON to the requested file path and prints a compact export
  summary to stdout.
- Review artifact display: `review-artifact --file <file> --summary|--explain`
  reads one local JSON artifact, renders deterministic display review JSON, and
  does not write files, connect adapters, or contact Locus.
- Schema status: `review-artifact --file <file> --schema-status` classifies
  schema migration metadata as `compatible`, `upgrade_available`,
  `unsupported_major`, or `malformed`, and reports whether a future migration is
  available or manual review is required.
- Attestation plan: `review-artifact --file <file> --attestation-plan` prints
  unsigned review-artifact attestation planning metadata with a deterministic
  digest, placeholder signer identity, planned algorithm field, no production
  signing keys, and false safety flags.
- Trace diff: `review-trace` compares local review artifacts. Reviewers should
  inspect selected capability changes, approval status changes, unresolved
  request changes, candidate ranking changes, and confirm all safety flags
  remain false.

The Phase 3.8 status report command is:

```powershell
npm run report:phase-status
```

That report must assemble local planning evidence only: docs, fixtures, tests,
review artifact APIs, versioning/display contract posture, migration metadata,
attestation planning posture, trace-comparison or trace-review artifacts,
host-policy precondition references, Phase 3.8 harness identity, Fabric family,
session-event contract evidence, and safety posture.
It must not run checks, start servers, spawn long-running processes, call
adapters, execute tools, write files, use secrets, call external CI, or imply
active Locus, Multiverse, MCP, OpenClaw, plugin, or Content Fabric runtime
integration.

Example dry-run check:

```powershell
node apps/cli/src/index.mjs serve --dry-run --manifest examples/minimal-manifest/ardyn.manifest.json
```

The planned runtime includes the loaded manifest identity, normalized capabilities, TypeScript core runtime, Rust host boundary, and platform report.

## Phase 3.3-3.8 Policy Review

Phase 3.3 introduced documentation-only, non-executing planning review. Phase
3.4 adds approval review artifacts and host-policy preconditions. Phase 3.5 adds
local trace-diff review and output-path export ergonomics. Phase 3.6 adds
review-artifact versioning and display-summary contracts. Phase 3.7 adds schema
migration metadata and review-artifact attestation planning without production
signing. Phase 3.8 pins the canonical Locus-facing harness slug as `ardyn`,
aligns Content Fabric family membership, freezes the Phase 3.x Locus read-only
display contract, and adds a future stdio session-event schema with examples.
Planner approval decisions are review records, not runtime grants.
Capability selection uses deterministic tiers: exact capability id score `300`,
tag score `200`, and permission scope score `100`. Exact outranks tag, tag
outranks scope, ties are sorted by bytewise ASCII capability id, all candidates
stay visible in the trace, and only the highest available tier is selected.

See `docs/planner-policy-review.md` for approval, ranking, adapter metadata,
trace, summary, explain, review-artifact export, and trace-diff guidance. See
`docs/planner-trace-review-workflow.md` for the reviewer checklist and future
Locus viewer fields. The adapter boundary remains metadata-only:
ARDYN does not call real MCP/OpenClaw adapters, connect to Locus or Multiverse,
install plugins, download torrents, enable code packs, serve Content Fabric
catalogs, spawn processes, run autonomous loops, or execute tools in Phase
3.3-3.8.

## Phase 3.8 Harness and Session Alignment

The canonical ARDYN harness slug is `ardyn`. Use that value for package and
keyring namespace, manifest-facing harness identity, Content Fabric family
membership, future Locus connector expected id, and session-event
`sourceHarness`.

The current Content Fabric family set is exactly:

- `*`
- `locus`
- `multiverse`
- `kortex-audio`
- `locus-evolution-lab`
- `somatic`
- `ardyn`

Locus remains mission control outside ARDYN. The Phase 3.x Locus display
contract is frozen for read-only viewing of local planner traces, approval
review artifacts, trace diffs, schema-status summaries, attestation plans, and
session-event fixtures. See `docs/locus-trace-display-contract.md` for the
`PHASE_3_X_LOCUS_DISPLAY_CONTRACT_FROZEN` marker.

Session-event examples live under `examples/session-events/` and validate
against `schemas/session-event.schema.json`. They are future stdio transport
fixtures only. Phase 3.8 does not add a stdio runtime, WebSocket transport, HTTP
transport, live Locus connector, runtime event loop, or network behavior. See
`docs/harness-identity.md` and `docs/session-events-stdio-contract.md`.

## Phase 3.4-3.7 Approval Review Artifacts

Phase 3.4 adds review artifacts and comparison helpers. Phase 3.5 exposes the
local comparison and export flows through the CLI while keeping ARDYN
non-executing. Phase 3.6 adds versioning and display-summary helpers for local
viewer contracts. Phase 3.7 adds migration and attestation planning helpers
without adding runtime behavior. The core API surface is:

- `createApprovalReviewArtifact(planOrTrace, options)` creates the stable
  review artifact from a task plan or planner trace.
- `validateApprovalReviewArtifact(artifact)` checks that the artifact shape is
  valid, `nonExecuting` is true, and every safety flag remains false.
- `compareApprovalReviewArtifacts(left, right)` compares two artifacts, or a
  planner trace and an artifact, through the stable artifact shape.
- `validateApprovalReviewArtifactVersion(artifact)` validates schema id and
  semver compatibility metadata for display gating.
- `classifyApprovalReviewArtifactCompatibility(artifact)` returns the Phase 3.6
  compatibility state: `compatible`, `unsupported_major`, or `malformed`.
- `normalizeApprovalReviewArtifactForDisplay(artifact)` normalizes known fields
  and preserves unknown top-level fields as inert metadata.
- `buildApprovalReviewArtifactDisplaySummary(artifact)` returns a compact local
  display summary for Locus or other UI callers.
- `buildSchemaMigrationMetadataRecord(kind, artifact)` returns deterministic
  schema migration metadata for review-only display.
- `buildReviewArtifactAttestationPlan(artifact)` returns an unsigned
  non-executing attestation planning record with deterministic digest metadata.
- `buildMigrationAttestationDisplaySummary(kind, artifact)` returns compact
  migration and attestation display status.

Example CLI output:

```powershell
node apps/cli/src/index.mjs plan --review-artifact --manifest tests/fixtures/planning-manifest.json --task tests/fixtures/tasks/approval-required.json
```

The output includes:

```json
{
  "schema": "ardyn.approval-review-artifact",
  "nonExecuting": true,
  "selectedCapabilities": ["secure.registry"],
  "approvalDecision": {
    "status": "required",
    "nonExecuting": true
  },
  "safety": {
    "executionEnabled": false,
    "toolExecutionEnabled": false,
    "processesSpawned": false
  }
}
```

Trace comparison and review fixtures live under
`tests/fixtures/trace-comparison/` and `tests/fixtures/trace-review/`. Tests use
`compareApprovalReviewArtifacts` to pin deterministic differences for task id,
manifest version, requested capabilities, selected capabilities, unresolved
requests, approval decision status, and candidate rankings.

Phase 3.5-3.7 CLI examples:

```powershell
node apps/cli/src/index.mjs plan --review-artifact --manifest tests/fixtures/planning-manifest.json --task tests/fixtures/tasks/approval-required.json --output approval-review-artifact.json
npm exec ardyn -- review-artifact --file tests/fixtures/review-artifacts/phase3-6/current-compatible-v1.json --summary
npm exec ardyn -- review-artifact --file tests/fixtures/review-artifacts/phase3-6/compatible-unknown-fields.json --explain
npm exec ardyn -- review-artifact --file tests/fixtures/review-artifacts/phase3-7/older-compatible-review-artifact.json --schema-status
npm exec ardyn -- review-artifact --file tests/fixtures/review-artifacts/phase3-7/current-compatible-review-artifact.json --attestation-plan
node apps/cli/src/index.mjs review-trace --left tests/fixtures/trace-review/equal-left-approval-review-artifact.json --right tests/fixtures/trace-review/selected-capability-changed-approval-review-artifact.json
```

The export command writes exactly one file: the requested output path. The
review-artifact and trace-review commands perform no writes at all. All three
paths remain local, JSON-only, and non-executing. `review-artifact` validates a
single local file path and does not connect to Locus.

The Phase 3.6/3.7 CLI display workflow is a local review renderer over already
produced approval review artifacts. It reports compatibility, validation,
unknown-field handling, approval status, safety flags, migration status, and
unsigned attestation planning without interpreting unknown fields as commands,
approvals, keys, signatures, or runtime instructions.

See `docs/review-artifact-versioning-policy.md` for schema id, `version`
semantics, same-major compatibility behavior, major-version rejection,
unknown-field preservation, and deterministic timestamp guidance. See
`docs/locus-trace-display-contract.md` for Locus-facing display fields,
approval status display rules, warning/severity mapping, and the rule that
ARDYN does not depend on Locus at runtime.
See `docs/schema-migration-policy.md` for Phase 3.7 migration metadata and
`docs/review-artifact-attestation-plan.md` for unsigned/test-fixture-only
attestation planning and Content Fabric signing alignment.

## Phase 3.4 Host Policy Preconditions

`docs/host-policy-preconditions.md` records preconditions for any future
execution-adjacent host policy. These are documentation and contract
requirements only. They do not add runtime enforcement, adapter connections,
network listeners, process spawning, plugin installation, Content Fabric runtime
behavior, code-pack enablement, autonomous loops, real MCP/OpenClaw calls,
secrets access, or external CI behavior.

Future host policy work must require explicit approval, adapter permission
declarations, code-pack sandbox and quarantine requirements, and explicit
network/process permission scopes before any execution-adjacent behavior can be
introduced.

## License

Apache-2.0. See `LICENSE`.
