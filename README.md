# ARDYN

ARDYN is an open-source AI harness/framework for running local and networked agent systems with explicit manifests, capabilities, task contracts, and adapter boundaries.

ARDYN is not Locus and is not Multiverse.

- Locus is mission control. It can run, observe, and control ARDYN through public ARDYN APIs and adapters.
- Multiverse is an external closed-source product/network. ARDYN can optionally register with Multiverse through an adapter, but Multiverse is not required to run ARDYN.
- OpenClaw, Hermes, Agent Zero, Space Agent, HiClaw, AgentScope, and related systems are references only. ARDYN does not copy their source code.

## Phase 1 Scope

This repository is currently in Phase 1 scaffold mode. The goal is to define the contract surface before autonomous execution exists.

Included now:

- Architecture and adapter-boundary documentation.
- JSON Schemas for ARDYN manifests, capabilities, and tasks.
- Minimal TypeScript workspace package metadata.
- Minimal Rust workspace/crate metadata for the native host.
- Schema validation tests and a minimal example manifest.

Not included yet:

- Autonomous agent execution.
- Tool execution.
- Credential vaulting.
- Live Locus control.
- Multiverse registration.
- Browser or desktop automation.

## Architecture

The preferred architecture is a Rust host plus TypeScript core.

- The Rust host owns local process supervision, OS integration, Windows-first packaging, policy enforcement, and safe host boundaries.
- The TypeScript core owns orchestration contracts, SDK surfaces, MCP integration, adapter interfaces, and developer-facing plugin APIs.
- JSON Schemas are the shared contract source for manifests, capabilities, and tasks.

## Testing

```powershell
npm test
```

The current test suite validates schema behavior for manifests, capabilities, and tasks.

## License

Apache-2.0. See `LICENSE`.

