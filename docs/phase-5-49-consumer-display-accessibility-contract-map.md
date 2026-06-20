# Phase 5.49 Consumer Display/Accessibility Contract Map

Phase 5.49 adds deterministic review-only metadata that maps how first-class
consumers may display Ardyn artifacts safely. It targets Locus and Multiverse
display surfaces and records accessibility expectations without implementing UI,
browser code, runtime integration, or consumer-side behavior.

Machine-readable Phase 5.49 artifact path:

`tests/fixtures/host-policy/phase5-49/consumer-display-accessibility-contract-map.json`

Focused Phase 5.49 test path:

`tests/phase5-49-consumer-display-accessibility-contract-map.test.mjs`

Core helper:

`packages/core/src/index.mjs#createConsumerDisplayAccessibilityContractMapForReview`

## Scope

The Phase 5.49 helper may produce only:

- review-only consumer display/accessibility contract metadata
- Locus and Multiverse display surface identifiers
- source Ardyn artifact types
- allowed display behavior
- explicitly forbidden display behavior
- accessibility notes for readable labels, short descriptions, long
  descriptions, severity/status vocabulary, keyboard and screen-reader display,
  color-independent status indicators, reduced-motion/default-static display,
  and no auto-execution or hidden action semantics
- future contract requirements before any interactivity
- false authorization flags
- non-authorizing proof flags
- top display/accessibility gaps

It does not implement frontend components, browser state, UI routing, event
handlers, command buttons, runtime controls, DB/storage writes, connector
grants, Fabric or adapter runtime, websocket/http runtime, MCP/task execution,
Secure Drop behavior, service discovery, schedule enforcement, background
polling, or filesystem/process control.

## Locus Display Surfaces

Phase 5.49 maps these Locus surfaces:

1. status/control panels
2. review artifact panels
3. capability metadata panels
4. blocked command/runtime indicators
5. future Secure Drop compose/inbox status indicators as metadata-only
   placeholders

Locus may render Ardyn metadata as static, readable status. It may not treat
metadata as a control, approval, grant, command, runtime action, connector
operation, Secure Drop operation, or hidden interaction.

## Multiverse Display Surfaces

Phase 5.49 maps these Multiverse surfaces:

1. world/project orchestration status cards
2. visible AI capability badges
3. task/capability wrapper status cards
4. citizen/adapter candidate badges
5. registry/websocket/MCP/task runtime blocked indicators

Multiverse may render Ardyn metadata as visible status and blocked-runtime
indicators. It may not start orchestration loops, connect registries, expose MCP
tools, execute tasks, discover adapters, scan services, enforce schedules, poll
in the background, or grant runtime permissions.

## Accessibility Expectations

Every entry records:

- a readable label
- a short description
- a long description
- a severity/status vocabulary
- keyboard and screen-reader display notes
- a color-independent status indicator requirement
- a reduced-motion/default-static display requirement
- a no auto-execution and no hidden action semantics requirement

These are contract expectations only. Phase 5.49 does not certify WCAG
compliance, run browser tests, render UI, or inspect consumer implementations.

## Runtime Posture

Phase 5.49 adds no:

- frontend, browser, or UI code
- interactive display controls
- hidden action semantics
- command exposure
- runtime integration
- DB/storage runtime write
- transcript or audit runtime write
- env, vault, credential, or secret ingestion
- connector grant or connector ingestion
- Fabric, adapter, websocket, HTTP, MCP, or task runtime surface
- Secure Drop crypto, transport, stego, send/receive, compose runtime, inbox
  polling, file selection, filesystem scanning, connector ingestion, secret
  access, or ST3GG vendoring
- live registry connection
- service discovery or service scanning
- schedule enforcement or background polling
- process control
- stdin loop
- stdout/stderr runtime writer
- filesystem/process control

`serve-runtime` remains default-blocked. `serve-runtime --dry-run` remains
blocked and cannot bypass runtime disablement.

Fallow remains advisory-only evidence. Phase 5.49 does not use Fallow Runtime.

## Top Display/Accessibility Gaps

- No Ardyn-owned frontend, browser UI, WCAG test harness, or consumer display
  implementation exists.
- Locus and Multiverse display surfaces are mapped as contracts only;
  consumer-owned UI fixtures and accessibility QA still need future phases.
- Interactive controls, approval actions, command exposure, runtime start, task
  execution, registry connections, and connector grants remain unauthorized.
- Future Secure Drop compose/inbox and Multiverse registry/websocket/MCP/task
  indicators are placeholders only.

Recommended next phase:

`phase-5.50-consumer-display-fixture-schema-boundary`

## Validation

Phase 5.49 records these required validation commands:

- `node --test tests/phase5-49-consumer-display-accessibility-contract-map.test.mjs`
- `node --test tests/report-phase-status.test.mjs`
- `npm test`
- `npm run test:schemas`
- `npm run report:phase-status`
- `cargo test --workspace`
- `cargo check --workspace`
- `cargo fmt --check`
- `cargo clippy --workspace -- -D warnings`
- `npm audit --json`
- `cargo audit`
- `cargo machete`
- `git diff --check`
- `git diff --cached --check`

Semgrep remains an evidence-only advisory command for this phase:

- `semgrep --config auto .`
