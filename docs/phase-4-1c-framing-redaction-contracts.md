# Phase 4.1C Framing and Redaction Contracts

Phase 4.1C is static contract/helper work only. It defines stdout JSONL
whole-line framing rules and stderr diagnostic redaction rules for review, but
no live writer exists, no process stdio ownership exists, and no live runtime
path consumes these helpers.

The TypeScript helpers live in `packages/core/src/index.mjs` and expose
`formatJsonlWholeLinesForReview`, `validateJsonlWholeLineBundle`,
`redactStderrDiagnosticForReview`, `classifyRedactionSafety`,
`createStdioFramingRedactionContractForReview`, and
`formatStdioFramingRedactionContractJsonForReview`. These helpers serialize,
validate, and classify deterministic local review artifacts. They do not write
to stdout, write to stderr, read stdin, persist files, own process stdio, or
start a runtime loop.

The deterministic fixture set is under
`tests/fixtures/host-policy/phase4-1c/`:

- `valid-static-framing-redaction-contract.json`
- `valid-whole-line-jsonl-bundle.json`
- `blank-line-rejected-jsonl-bundle.json`
- `missing-final-lf-rejected-jsonl-bundle.json`
- `crlf-rejected-jsonl-bundle.json`
- `malformed-json-line-rejected-jsonl-bundle.json`
- `partial-line-rejected-jsonl-bundle.json`
- `redacted-secret-token-diagnostic.json`
- `redacted-absolute-path-diagnostic.json`
- `redacted-stack-trace-diagnostic.json`
- `unredactable-diagnostic-fail-closed.json`

## JSONL Framing

Phase 4.1C classifies JSONL bundles into static whole-line framing states:

- `valid_whole_line_bundle`
- `blank_line_rejected`
- `missing_final_lf`
- `crlf_rejected`
- `malformed_json_line`
- `partial_line_rejected`

The review-only contract requires exactly one JSON object per line, LF-only
line endings, a final LF, no blank lines, and no partial-line emission. Key
order is deterministic for review output through the existing stable JSON
display helper. This does not create a stdout writer. A future runtime must use
these rules but is not implemented yet.

## Stderr Redaction

Phase 4.1C classifies stderr diagnostic review records into static redaction
states:

- `redacted_safe`
- `unredactable_fail_closed`
- `malformed`

The review-only redaction helper requires deterministic diagnostic codes and
messages, replaces secrets, environment variables, absolute paths, user home
paths, bearer tokens, API keys, stack traces, and raw parse details with typed
placeholders, and fails closed when a diagnostic cannot be made safe. This does
not create a stderr writer or runtime diagnostic channel.

## Non-Runtime Boundary

Phase 4.1C adds no live stdin command loop, live stdio reader, process stdio
ownership implementation, stdout JSONL writer, stderr diagnostic writer,
listener, server, subprocess runtime path, adapter call, Locus runtime
dependency, MCP/OpenClaw call, plugin execution, Content Fabric
download/install/enable behavior, autonomous loop, secret handling, production
signing-key usage, transcript persistence/replay runtime, failure audit runtime,
WebSocket or HTTP control surface, `serve-runtime`, `stdio-runtime`, or actual
runtime execution behavior.

The existing finite `emit-session-events --dry-run` CLI remains unchanged.
Framing and redaction command names such as `framing-redaction`,
`stdout-framing`, `stderr-redaction`, `redact-stderr`, and
`validate-jsonl-framing` remain rejected as unknown commands.

## Review Boundary

Devin review is still reserved for the major runtime-readiness checkpoint.
Phase 4.1C is Codex-validated static evidence only. A later runtime phase must
bring separate implementation approval, Rust-host stdio ownership tests, stdout
JSONL framing writer tests, stderr redaction enforcement tests, transcript
persistence/replay tests, failure audit tests, kill/exit/fail-closed tests,
backpressure tests, and dropped/duplicate/out-of-order/malformed-line tests
before any live runtime path can exist.

## Cross-Links

Phase 4.1C builds on:

- `docs/phase-4-1-runtime-proposal.md`
- `docs/phase-4-1a-host-policy-approval-records.md`
- `docs/phase-4-1b-transport-harness-contracts.md`
- `docs/phase-4-stdio-dry-run-event-emission.md`
- `docs/session-events-stdio-contract.md`
- `docs/host-policy-preconditions.md`
- `docs/architecture.md`
