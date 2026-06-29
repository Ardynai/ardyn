# How This Works: Session Events And Transcripts

## Owns

Session event and transcript code records deterministic, non-executing review
evidence. It belongs mostly to `@ardyn/core`, with public shapes in `schemas`.

## Key Files

- `schemas/session-event.schema.json`
- `schemas/session-transcript.schema.json`
- `docs/session-events-stdio-contract.md`
- `docs/session-transcript-versioning-policy.md`
- `packages/core/src/index.mjs`
- `tests/cli-phase4-stdio-dry-run.test.mjs`
- `tests/session-event-schema.test.mjs`
- `tests/session-transcript-schema.test.mjs`
- `tests/core-phase3-9-session-transcripts.test.mjs`
- `tests/core-phase3-10-transcript-versioning.test.mjs`

## Main Flow

For dry-run events:

1. The CLI accepts `emit-session-events --dry-run --manifest M --task T`.
2. Core loads the manifest and task and builds a non-executing task plan.
3. `createStdioDryRunSessionEvents()` creates a finite ordered event list.
4. `formatSessionEventsJsonl()` validates and serializes the events as LF-only
   JSONL.
5. The CLI writes JSONL to stdout only.

For transcripts:

1. `validate-session-transcript --file T` reads local JSON through the shared
   local path policy.
2. Schema checks validate the static shape.
3. Core semantic checks classify ordering, source harness, safety flags, and
   compatibility.
4. Display helpers summarize the transcript without executing anything.

## Gotchas

- `nonExecuting` must stay true and safety flags must stay false.
- Session event schemas reject command-looking unknown fields at the root and
  in typed payloads.
- Transcript ordering is semantic validation, not only JSON Schema validation.
- JSONL is whole-line LF-only output. Missing final LF, CRLF, blank lines, and
  malformed lines are classified deliberately.
- These helpers are not a live stdio runtime.

## Start Reading

Start at `createStdioDryRunSessionEvents()` and `formatSessionEventsJsonl()` in
`packages/core/src/index.mjs`, then read the two session schemas beside their
focused tests.
