import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const rustHostSourceUrl = new URL("../crates/ardyn-host/src/lib.rs", import.meta.url);
const phase40DDocUrl = new URL(
  "../docs/phase-4-0d-rust-host-transport-policy-contracts.md",
  import.meta.url
);
const phase40CDocUrl = new URL(
  "../docs/phase-4-0c-pre-runtime-transport-policy.md",
  import.meta.url
);
const dryRunDocUrl = new URL("../docs/phase-4-stdio-dry-run-event-emission.md", import.meta.url);
const sessionContractUrl = new URL("../docs/session-events-stdio-contract.md", import.meta.url);
const hostPolicyUrl = new URL("../docs/host-policy-preconditions.md", import.meta.url);
const architectureUrl = new URL("../docs/architecture.md", import.meta.url);
const readmeUrl = new URL("../README.md", import.meta.url);
const cliReadmeUrl = new URL("../apps/cli/README.md", import.meta.url);
const coreReadmeUrl = new URL("../packages/core/README.md", import.meta.url);
const rustReadmeUrl = new URL("../crates/ardyn-host/README.md", import.meta.url);
const cliSourceUrl = new URL("../apps/cli/src/index.mjs", import.meta.url);

test("Phase 4.0D Rust host exposes inert stdio transport policy contract types", async () => {
  const source = await readFile(rustHostSourceUrl, "utf8");

  for (const requiredSymbol of [
    "ARDYN_STDIO_TRANSPORT_POLICY_PHASE",
    "PolicyImplementationStatus",
    "StdioPolicyOwner",
    "StdioStreamPurpose",
    "StdioLineEnding",
    "StdioCommitUnit",
    "StdioTransportFailureAction",
    "StdioLineFailureKind",
    "StderrDiagnosticClass",
    "RedactionSubject",
    "TranscriptReplayInputPreference",
    "RawJsonlCaptureRole",
    "StdioStreamOwnershipPolicy",
    "StdioJsonlFramingPolicy",
    "StderrDiagnosticPolicy",
    "StderrRedactionPolicy",
    "BackpressurePolicy",
    "PartialWritePolicy",
    "LineIntegrityFailureRule",
    "LineIntegrityPolicy",
    "ExitSemanticsPolicy",
    "TranscriptReplayReadinessPolicy",
    "RuntimeSafetyPolicyFlags",
    "StdioTransportPolicyContract",
    "stdio_transport_policy_contract",
    "is_pre_runtime_fail_closed",
    "all_runtime_flags_disabled"
  ]) {
    assert.match(source, new RegExp(`\\b${requiredSymbol}\\b`));
  }

  for (const requiredDefault of [
    /PolicyImplementationStatus::PolicyOnlyPreRuntime/,
    /current_owner:\s*StdioPolicyOwner::TypescriptDryRunCli/,
    /future_runtime_owner:\s*StdioPolicyOwner::RustHost/,
    /reserved_for:\s*StdioStreamPurpose::ValidatedSessionEventJsonlOnly/,
    /reserved_for:\s*StdioStreamPurpose::RedactedDiagnosticsOnly/,
    /line_ending:\s*StdioLineEnding::LfOnly/,
    /failure_action:\s*StdioTransportFailureAction::RejectAndTerminateTransport/,
    /action:\s*StdioTransportFailureAction::RejectTranscript/,
    /preferred_input:\s*TranscriptReplayInputPreference::NormalizedSessionTranscriptJson/,
    /raw_jsonl_capture_role:\s*RawJsonlCaptureRole::ForensicSourceOnly/
  ]) {
    assert.match(source, requiredDefault);
  }
});

test("Phase 4.0D Rust defaults keep every runtime flag false and fail closed", async () => {
  const source = await readFile(rustHostSourceUrl, "utf8");

  for (const falseField of [
    "runtime_implementation_active",
    "live_stdio_runtime",
    "stdin_command_loop",
    "live_stdio_reader",
    "listener",
    "server",
    "subprocess_spawning",
    "adapter_calls",
    "locus_runtime_dependency",
    "mcp_calls",
    "openclaw_calls",
    "plugin_execution",
    "content_fabric_runtime_behavior",
    "autonomous_loop",
    "secret_handling",
    "production_signing_keys",
    "transcript_persistence_replay_runtime",
    "websocket_http_control_surface",
    "runtime_execution_behavior",
    "transcript_persistence_implemented",
    "replay_runtime_implemented",
    "partial_frames_are_events",
    "duplicate_event_ids_allowed",
    "stdout_diagnostics_allowed",
    "session_events_allowed_on_stderr"
  ]) {
    assert.match(source, new RegExp(`${falseField}: false`));
  }

  for (const mutationTest of [
    /policy\.safety\.live_stdio_runtime = true/,
    /policy\.stdout\.runtime_implementation_active = true/,
    /policy\.jsonl_framing\.partial_frames_are_events = true/,
    /policy\.line_integrity\.duplicate_line\.recovery_defined = true/,
    /policy\.transcript_replay\.replay_runtime_implemented = true/
  ]) {
    assert.match(source, mutationTest);
  }
});

test("Phase 4.0D docs connect Rust contracts to Phase 4.0C without implying runtime", async () => {
  const [
    phase40DDoc,
    phase40CDoc,
    dryRunDoc,
    sessionContract,
    hostPolicy,
    architecture,
    readme,
    cliReadme,
    coreReadme,
    rustReadme
  ] = await Promise.all([
    readFile(phase40DDocUrl, "utf8"),
    readFile(phase40CDocUrl, "utf8"),
    readFile(dryRunDocUrl, "utf8"),
    readFile(sessionContractUrl, "utf8"),
    readFile(hostPolicyUrl, "utf8"),
    readFile(architectureUrl, "utf8"),
    readFile(readmeUrl, "utf8"),
    readFile(cliReadmeUrl, "utf8"),
    readFile(coreReadmeUrl, "utf8"),
    readFile(rustReadmeUrl, "utf8")
  ]);

  for (const requiredPhrase of [
    "Phase 4.0D converts the Phase 4.0C pre-runtime transport policy",
    "StdioTransportPolicyContract",
    "stdio_transport_policy_contract()",
    "RuntimeSafetyPolicyFlags",
    "is_pre_runtime_fail_closed()",
    "does not implement process-level stdio ownership",
    "transcript persistence and replay remain proposal-only",
    "every runtime, network, adapter, plugin, Fabric, secret, and signing flag is false"
  ]) {
    assert.match(phase40DDoc, new RegExp(requiredPhrase.replace(/[()]/g, "\\$&"), "i"));
  }

  for (const indexedDoc of [
    phase40CDoc,
    dryRunDoc,
    sessionContract,
    hostPolicy,
    architecture,
    readme,
    cliReadme,
    coreReadme,
    rustReadme
  ]) {
    assert.match(
      indexedDoc,
      /docs\/phase-4-0d-rust-host-transport-policy-contracts\.md/,
      "Phase 4.0D policy contract doc should be cross-linked"
    );
  }
});

test("Phase 4.0D source guards prevent live Rust and CLI runtime entrypoints", async () => {
  const [rustSource, cliSource] = await Promise.all([
    readFile(rustHostSourceUrl, "utf8"),
    readFile(cliSourceUrl, "utf8")
  ]);
  const rustProductionSource = rustSource.split(/\n#\[cfg\(test\)\]\n/)[0];

  for (const forbiddenRustPattern of [
    /std::io::stdin\b/,
    /std::process::Command\b/,
    /\bCommand::new\b/,
    /std::net::/,
    /\bTcpListener\b/,
    /\bTcpStream\b/,
    /\bUdpSocket\b/,
    /tokio::net/,
    /\breqwest\b/,
    /\bhyper\b/,
    /\baxum\b/,
    /\bwarp\b/,
    /\btungstenite\b/,
    /std::env::var\b/,
    /std::env::vars\b/,
    /load_production_signing_key/i,
    /read_production_signing_key/i
  ]) {
    assert.doesNotMatch(rustProductionSource, forbiddenRustPattern);
  }

  for (const forbiddenCliPattern of [
    /replay-session-transcript/,
    /process\.stdin/,
    /node:readline/,
    /node:child_process/,
    /from\s+["']child_process["']/,
    /require\s*\(\s*["'](?:node:)?child_process["']\s*\)/,
    /node:http/,
    /node:https/,
    /node:net/,
    /node:dgram/,
    /\bfetch\s*\(/,
    /\bWebSocket\b/,
    /\bspawn\s*\(/,
    /\bexecFile\s*\(/,
    /\bcreateServer\s*\(/,
    /\blisten\s*\(/
  ]) {
    assert.doesNotMatch(cliSource, forbiddenCliPattern);
  }
});
