# How This Works: Schemas And Tests

## Owns

`schemas` defines the public JSON contract shapes. `tests` pins current behavior
with Node's built-in test runner, Rust crate tests, and committed fixtures.

## Key Files

- `schemas/ardyn.manifest.schema.json`
- `schemas/capability.schema.json`
- `schemas/task.schema.json`
- `schemas/session-event.schema.json`
- `schemas/session-transcript.schema.json`
- `tests/schema-validation.test.mjs`
- `tests/session-event-schema.test.mjs`
- `tests/session-transcript-schema.test.mjs`
- `tests/fixtures/**`

## Main Flow

1. Schemas define shape-level constraints for manifest, capability, task,
   session event, and transcript JSON.
2. Core helpers perform semantic checks that schemas cannot express cleanly.
3. Tests load fixtures and assert deterministic output, classification, and
   fail-closed behavior.
4. `scripts/report-phase-status.mjs` inventories the current phase evidence and
   lists validation commands without running them.

## Gotchas

- Schema validation and semantic validation are separate. For example, session
  transcript ordering and cross-event consistency are semantic checks.
- Fixtures are part of the contract. Update them only when the expected contract
  changes.
- Many Phase 5 tests assert that runtime stays blocked. A passing feature must
  preserve those false runtime-effect fields unless the task explicitly changes
  runtime posture.
- The report script is metadata-only. Keep `reportRunsChecks` false.

## Start Reading

Start with the schema that matches your input object, then find the nearest test
by filename. For phase work, also read `tests/report-phase-status.test.mjs`.
