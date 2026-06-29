# How This Works: Adapter Scaffolds

## Owns

The adapter scaffold packages describe future integration boundaries without
opening connections or running tools.

Covered packages:

- `packages/mcp`
- `packages/plugin-api`
- `packages/adapters/openclaw`
- `packages/sdk`

## Key Files

- `packages/mcp/src/index.mjs`
- `packages/plugin-api/src/index.mjs`
- `packages/adapters/openclaw/src/index.mjs`
- `packages/*/README.md`
- `tests/adapters-phase3.test.mjs`

## Main Flow

Each implemented scaffold exports:

- an adapter id
- a package name
- frozen safety flags
- one registry-read descriptor capability
- a frozen registration object

The registration data is metadata-only. It can be read by tests and future
registries, but it does not connect to MCP, OpenClaw, plugin runtimes, or any
external service.

## Gotchas

- `enabled` is false and safety flags stay false.
- The OpenClaw package must not copy OpenClaw source.
- The SDK package is currently only a placeholder README and package manifest.
- Adding a real adapter implementation would be a behavior change and needs an
  explicit task, tests, and contract docs.

## Start Reading

Read `tests/adapters-phase3.test.mjs` first, then compare each scaffold's
`src/index.mjs` export shape.
