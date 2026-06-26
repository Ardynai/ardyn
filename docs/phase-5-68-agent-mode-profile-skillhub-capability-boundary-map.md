# Ardyn Phase 5.68 - Review-only Hermes/CUA agent mode-profile-skillhub capability boundary map

Phase 5.68 records deterministic review-only metadata for future Ardyn agent modes, profiles, personality/session concepts, background subagents, conversation continuity, front-desk fallback, prompt/context-to-skill loading, Skills Hub-style install boundaries, visible skill/MCP/plugin/provider/tool inventories, CUA-driver computer-use boundaries, gateway bridges, scheduled automation, terminal backends, ACP/A2A adapters, Locus/external-harness bridges, and diffusion/Sakana/fusion/judge orchestration boundaries.

Hermes, CUA driver files, and the prompt-guide repository are architecture/category references only. Ardyn does not install, vendor, copy, import, migrate from, execute, or integrate Hermes, `cua-driver`, CUA driver source, or the prompt guide.

The Phase 5.68 fixture is:

- `tests/fixtures/host-policy/phase5-68/agent-mode-profile-skillhub-capability-boundary-map.json`

The fixture is produced by `createAgentModeProfileSkillhubCapabilityBoundaryMapForReview` and remains metadata-only, non-authorizing, and runtime-blocked. It explicitly keeps `reportRunsChecks` false and records false runtime flags for CUA-driver execution, CUA MCP stdio invocation, driver install/update, computer use, desktop/browser control, screenshot/OCR/accessibility-tree/SOM/indexing, OS window enumeration, input automation, action approval runtime, background subagents, profile/personality/session/context loading, skill loading, SkillHub install, security scan runtime, MCP/plugin/provider/tool scanners, gateway messaging, scheduled automation, terminal backend execution, model routing, fusion/judge/front-desk runtime, ACP/A2A runtime, Locus integration, external harness communication, backend/API/server behavior, storage/cache/RLS/migration, Fabric/websocket/http/MCP/task runtime, Secure Drop implementation, encoded handoff runtime, telemetry, health checks, infrastructure/deployment/compliance behavior, filesystem/process behavior, and UI behavior.

Future runtime work requires a separate authorization phase and explicit contracts for permissions, sandboxing, audit, user confirmation, deny paths, visible sessions, cancellability, prompt-to-skill activation records, inventory provenance, security scans, model routing, gateway pairing, terminal backend allowlists, and artifact trails.

Recommended next phase: Phase 5.69 - review-only testing-frameworks/quality-gates contract boundary map.
