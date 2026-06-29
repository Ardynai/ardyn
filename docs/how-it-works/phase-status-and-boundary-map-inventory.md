# How This Works: Phase Status And Boundary Map Inventory

## Owns

`scripts/report-phase-status.mjs` builds the local phase-status report. The
report inventories docs, fixtures, tests, validation commands, safety posture,
and Phase 5 boundary-map metadata. It does not run checks.

## Key Files

- `scripts/report-phase-status.mjs`
- `tests/report-phase-status.test.mjs`
- `docs/phase-*.md`
- `tests/fixtures/host-policy/**`
- `tests/fixtures/command-surface/**`

## Main Flow

1. The script reads local package metadata and fixture files.
2. Each phase inventory block declares docs, tests, fixtures, cross-links, and
   forbidden behavior.
3. Boundary-map sections summarize future capability surfaces as review-only
   metadata with explicit false runtime-effect fields.
4. `npm run report:phase-status` prints one deterministic JSON report.
5. `tests/report-phase-status.test.mjs` pins the report shape and critical
   safety fields.

## Gotchas

- `reportRunsChecks` must remain false. The report lists validation commands;
  it does not execute them.
- Many phase blocks repeat similar field names because the fixtures are
  historical contract evidence. Avoid extracting shared helpers unless a task
  explicitly allows behavior risk.
- Strings such as `forbiddenBehavior` and path names are part of report/test
  contracts. Rename only local loop variables or comments in a narrow pass.
- When adding a phase, report script, fixture, focused test, and phase doc move
  together.

## Start Reading

Start near `configuredChecks` and `localInventoryEntry()` for report mechanics,
then jump to the phase block named by the failing test.
