# How This Works: CLI

## Owns

`apps/cli` owns the local command-line surface. It parses arguments, loads local
files through `@ardyn/core`, and prints JSON or JSONL. It does not implement
runtime behavior itself.

## Key Files

- `apps/cli/src/index.mjs`: command parser and output builders.
- `apps/cli/package.json`: package export and binary entrypoint.
- `tests/cli-*.test.mjs`: CLI behavior tests.
- `examples/minimal-manifest/README.md`: simple input example.

## Main Flow

1. `run(argv)` reads the command and flags.
2. File-taking commands use `loadManifest`, `loadTask`, or `readLocalJsonFile`
   from `@ardyn/core`.
3. Core helpers build the plan, review output, transcript output, or session
   events.
4. The CLI prints formatted JSON to stdout or writes deterministic diagnostics
   to stderr on failure.

## Command Families

- `doctor` and `identity`: static local metadata.
- `capabilities`: manifest capability summary.
- `plan`: non-executing task plan with optional trace, summary, explanation, or
  review artifact output.
- `review-artifact` and `review-trace`: display and compare local review JSON.
- `validate-session-transcript`: classify and summarize local transcript JSON.
- `emit-session-events --dry-run`: emit finite JSONL dry-run events.
- `serve --dry-run`: dry-run only.
- `serve-runtime`: recognized, but always default-blocked.

## Gotchas

- Output flags are mutually exclusive by command.
- `--output` is only valid with `plan --review-artifact`.
- Local path policy rejects URLs, UNC paths, drive paths, stdin markers, and
  unsafe file forms.
- `serve-runtime --dry-run` still fails; that is intentional.

## Start Reading

Start at `run(argv)` in `apps/cli/src/index.mjs`, then jump to the helper that
builds the output object for the command you care about.
