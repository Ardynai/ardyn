# How This Works: Core

## Owns

`packages/core` is ARDYN's contract engine. It validates input JSON, resolves
capability requests, builds non-executing plans, creates review artifacts,
normalizes display metadata, validates transcripts, emits dry-run session
events, and records Phase 5 review-only boundary maps.

## Key Files

- `packages/core/src/index.mjs`: implementation.
- `packages/core/src/index.d.ts`: public TypeScript declarations.
- `packages/core/README.md`: phase posture and exported helper overview.
- `schemas/*.schema.json`: external JSON contract shapes.
- `tests/core-*.test.mjs` and `tests/phase*.test.mjs`: behavior and fixture
  checks.

## Main Flow

For planning:

1. `loadManifest()` and `loadTask()` read local JSON and validate it.
2. `resolveTaskCapabilities()` ranks requested capabilities.
3. `createTaskPlan()` builds selected capabilities, unresolved requests,
   approval metadata, planner trace, and safety flags.
4. CLI output helpers render that plan in default, trace, summary, explanation,
   or review-artifact shape.

For review display:

1. Local JSON is read with `readLocalJsonFile()`.
2. Compatibility and schema helpers classify it.
3. Display helpers normalize known fields and preserve unknown fields as inert
   display metadata.

## Gotchas

- The file is large because each phase added deterministic review helpers rather
  than separate runtime services.
- Many helpers intentionally return metadata with every runtime effect set to
  false.
- Approval-related values are prerequisites or review evidence, not grants.
- Unknown fields are shown for review, not executed.
- Do not move large sections or reformat this file during a narrow change.

## Start Reading

Start with the exported helper you need. Common anchors:

- `loadManifest`
- `loadTask`
- `resolveTaskCapabilities`
- `createTaskPlan`
- `createApprovalReviewArtifact`
- `validateSessionTranscript`
- `createStdioDryRunSessionEvents`
- `createDoctorReport`
