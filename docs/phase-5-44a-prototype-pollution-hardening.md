# Phase 5.44A Prototype-Pollution Hardening

Phase 5.44A is a focused security-hardening slice for the pre-existing Semgrep
prototype-pollution finding in `packages/core/src/index.mjs`.

This phase does not continue the Phase 5 review-only consolidation metadata
chain. It changes only the evaluator preflight nested path lookup used by
review-only metadata classification, adds focused regression coverage, and keeps
all runtime and authorization surfaces blocked.

## Finding

Semgrep rule:

`javascript.lang.security.audit.prototype-pollution.prototype-pollution-loop.prototype-pollution-loop`

Finding before the patch:

`packages/core/src/index.mjs:8709`

The vulnerable pattern was the `reviewOnlyEvaluatorPreflightPathValue` loop:
nested path traversal advanced with `current = current[field]`. That allowed
the lookup to follow inherited prototype properties if a polluted prototype
provided a path segment such as inherited grant-looking metadata.

## Hardening

The lookup now:

- rejects reserved path segments: `__proto__`, `constructor`, and `prototype`
- reads each segment through the existing descriptor-based `dataProperty`
  helper, which returns only own data properties
- preserves normal review-only metadata keys and valid checkpoint behavior
- treats unsafe own metadata keys as malformed input through the existing
  fail-closed shape checks

Regression coverage in
`tests/phase5-28-review-only-evaluator-preflight-checkpoint.test.mjs` proves:

- inherited grant-looking prototype data is ignored
- own `__proto__`, `constructor`, and `prototype` metadata keys fail closed
- `Object.prototype` is not polluted
- normal valid evaluator preflight metadata remains accepted

## Boundaries

Phase 5.44A adds no runtime capability, reviewer routing, reviewer assignment,
evaluator execution, evaluator result, approval decision, approval grant,
runtime permission, command exposure permission, command exposure, connector
ingestion, Secure Drop implementation, filesystem watcher, external lookup,
env/secrets ingestion, process control, or runtime execution.

`serve-runtime` and `serve-runtime --dry-run` remain default-blocked. `--dry-run`
does not bypass blocking.

Validation evidence for this phase includes:

- `semgrep --config auto .`
- `node --test tests/phase5-28-review-only-evaluator-preflight-checkpoint.test.mjs`
- `npm run report:phase-status`
- the full repository validation bundle required by the phase handoff
