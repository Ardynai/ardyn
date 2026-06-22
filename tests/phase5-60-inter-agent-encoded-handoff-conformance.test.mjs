import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";
import {
  INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_SCHEMA,
  createInterAgentEncodedHandoffConformanceForReview
} from "../packages/core/src/index.mjs";

const execFileAsync = promisify(execFile);
const phase560BaselineCommit = "01c31523de3858c33da4d99cf9d979c0ec4d5821";
const reviewedAt = "2026-06-22T00:00:00.000Z";
const repoRootUrl = new URL("../", import.meta.url);
const repoRoot = fileURLToPath(repoRootUrl);
const cliPath = fileURLToPath(new URL("../apps/cli/src/index.mjs", import.meta.url));
const fixtureUrl = new URL(
  "../tests/fixtures/host-policy/phase5-60/inter-agent-encoded-handoff-conformance.json",
  import.meta.url
);

const expectedCaseClassifications = Object.freeze({
  "valid-inter-agent-encoded-handoff-conformance":
    "valid_inter_agent_encoded_handoff_conformance_runtime_still_blocked",
  "malformed-inter-agent-encoded-handoff-conformance-input-rejected":
    "malformed_inter_agent_encoded_handoff_conformance_input_rejected",
  "missing-required-inter-agent-encoded-handoff-conformance-entry-rejected":
    "missing_required_inter_agent_encoded_handoff_conformance_entry_rejected",
  "unknown-handoff-family-inter-agent-encoded-handoff-conformance-input-rejected":
    "unknown_handoff_family_inter_agent_encoded_handoff_conformance_input_rejected",
  "unknown-source-or-target-actor-inter-agent-encoded-handoff-conformance-input-rejected":
    "unknown_source_or_target_actor_inter_agent_encoded_handoff_conformance_input_rejected",
  "unknown-encoded-handoff-mode-inter-agent-encoded-handoff-conformance-input-rejected":
    "unknown_encoded_handoff_mode_inter_agent_encoded_handoff_conformance_input_rejected",
  "unknown-current-status-inter-agent-encoded-handoff-conformance-input-rejected":
    "unknown_current_status_inter_agent_encoded_handoff_conformance_input_rejected",
  "authorization-flags-enabled-inter-agent-encoded-handoff-conformance-input-rejected":
    "authorization_flags_enabled_inter_agent_encoded_handoff_conformance_input_rejected",
  "report-runs-checks-true-inter-agent-encoded-handoff-conformance-input-rejected":
    "report_runs_checks_true_inter_agent_encoded_handoff_conformance_input_rejected",
  "runtime-authorization-attempt-inter-agent-encoded-handoff-conformance-input-rejected":
    "runtime_authorization_attempt_inter_agent_encoded_handoff_conformance_input_rejected",
  "command-exposure-attempt-inter-agent-encoded-handoff-conformance-input-rejected":
    "command_exposure_attempt_inter_agent_encoded_handoff_conformance_input_rejected",
  "blocked-cli-bypass-attempt-inter-agent-encoded-handoff-conformance-input-rejected":
    "blocked_cli_bypass_attempt_inter_agent_encoded_handoff_conformance_input_rejected",
  "hidden-codec-translator-encoder-decoder-conlang-execution-semantics-inter-agent-encoded-handoff-conformance-input-rejected":
    "hidden_codec_translator_encoder_decoder_conlang_execution_semantics_inter_agent_encoded_handoff_conformance_input_rejected",
  "hidden-steganography-covert-channel-tokenizer-exploit-guardrail-evasion-bypass-semantics-inter-agent-encoded-handoff-conformance-input-rejected":
    "hidden_steganography_covert_channel_tokenizer_exploit_guardrail_evasion_bypass_semantics_inter_agent_encoded_handoff_conformance_input_rejected",
  "hidden-import-export-package-persistence-semantics-inter-agent-encoded-handoff-conformance-input-rejected":
    "hidden_import_export_package_persistence_semantics_inter_agent_encoded_handoff_conformance_input_rejected",
  "secure-drop-implementation-semantics-inter-agent-encoded-handoff-conformance-input-rejected":
    "secure_drop_implementation_semantics_inter_agent_encoded_handoff_conformance_input_rejected",
  "hidden-fabric-websocket-http-mcp-task-runtime-semantics-inter-agent-encoded-handoff-conformance-input-rejected":
    "hidden_fabric_websocket_http_mcp_task_runtime_semantics_inter_agent_encoded_handoff_conformance_input_rejected",
  "unsafe-runtime-command-connector-fabric-websocket-http-mcp-task-secure-drop-service-discovery-schedule-filesystem-process-flags-inter-agent-encoded-handoff-conformance-input-rejected":
    "unsafe_runtime_command_connector_fabric_websocket_http_mcp_task_secure_drop_service_discovery_schedule_filesystem_process_flags_inter_agent_encoded_handoff_conformance_input_rejected",
  "nested-unsafe-flags-inter-agent-encoded-handoff-conformance-input-rejected":
    "nested_unsafe_flags_inter_agent_encoded_handoff_conformance_input_rejected",
  "noncanonical-inter-agent-encoded-handoff-conformance-input-rejected":
    "noncanonical_inter_agent_encoded_handoff_conformance_input_rejected"
});

const expectedHandoffIds = Object.freeze([
  "phase5-60.ardyn-to-subagent.plaintext-handoff-metadata",
  "phase5-60.subagent-to-ardyn.structured-metadata-handoff",
  "phase5-60.ardyn-subagent.encoded-candidate-metadata-boundary",
  "phase5-60.ardyn-to-locus.harness-bridge-metadata",
  "phase5-60.locus-to-external-harness.bridge-candidate-metadata",
  "phase5-60.locus-to-multiverse.harness-bridge-metadata",
  "phase5-60.ardyn-family.fabric-coordination-envelope-metadata",
  "phase5-60.ardyn-to-content-fabric.secure-drop-reference-metadata",
  "phase5-60.operator.final-output-translation-bridge",
  "phase5-60.locus.operator-translation-preference-metadata",
  "phase5-60.raw-protocol.audit-visibility-metadata",
  "phase5-60.future-protocol.reference-layer-metadata"
]);

const expectedOneClickOptionIds = Object.freeze([
  "phase5-60.option.force-plaintext-final-output",
  "phase5-60.option.require-final-operator-translation",
  "phase5-60.option.show-raw-encoded-handoff-transcript",
  "phase5-60.option.hide-raw-transcript-keep-audit-digest",
  "phase5-60.option.allow-structured-metadata-handoff-candidate",
  "phase5-60.option.allow-encoded-handoff-candidate-after-future-authorization",
  "phase5-60.option.disable-encoded-handoff-candidate"
]);

const commandProbes = Object.freeze([
  "inter-agent-encoded-handoff-conformance",
  "encoded-handoff-runtime",
  "glossopetrae",
  "glossopetrae-codec",
  "encoded-handoff-codec",
  "encoded-handoff-translator",
  "encoded-handoff-encoder",
  "encoded-handoff-decoder",
  "conlang-generator",
  "semantic-stego",
  "steganography-engine",
  "token-exploiter",
  "covert-channel",
  "guardrail-bypass",
  "hidden-payload",
  "fabric-message-bus",
  "a2a-runtime",
  "mcp-handoff-runtime"
]);

const nonAuthorizingResultFields = Object.freeze([
  "reportRunsChecks",
  "encodedHandoffRuntimeImplementedByArdyn",
  "codecImplemented",
  "translatorRuntimeImplemented",
  "encoderImplemented",
  "decoderImplemented",
  "conlangGeneratorImplemented",
  "seedGeneratorImplemented",
  "protocolRuntimeImplemented",
  "covertChannelImplemented",
  "stegoLayerImplemented",
  "semanticStegoImplemented",
  "tokenExploiterImplemented",
  "guardrailEvasionImplemented",
  "bypassPathImplemented",
  "hiddenPayloadPathImplemented",
  "transportImplementedByArdyn",
  "fabricRuntimeImplementedByArdyn",
  "backendRuntimeImplementedByArdyn",
  "apiEndpointImplementedByArdyn",
  "serverImplementedByArdyn",
  "importExportPathImplementedByArdyn",
  "packageDistributionImplementedByArdyn",
  "persistenceImplementedByArdyn",
  "commandExposureEnabled",
  "commandRuntimeControlEnabled",
  "runtimeExecutionEnabled",
  "databaseStorageRuntimeWritesEnabled",
  "secretsRuntimeIngestionEnabled",
  "connectorGrantProduced",
  "mcpToolExposureEnabled",
  "taskExecutionEnabled",
  "secureDropImplemented",
  "st3ggVendored",
  "serviceDiscoveryEnabled",
  "scheduleEnforcementEnabled",
  "backgroundPollingEnabled",
  "filesystemScanningEnabled",
  "processControlEnabled",
  "uiFrontendBrowserRenderingImplemented",
  "blockedCliBypassEnabled"
]);

async function readFixture() {
  return JSON.parse(await readFile(fixtureUrl, "utf8"));
}

async function expectCliFailure(args) {
  try {
    await execFileAsync(process.execPath, [cliPath, ...args], {
      cwd: repoRoot,
      env: { ...process.env, NO_COLOR: "1" }
    });
  } catch (error) {
    return error;
  }

  assert.fail(`expected CLI command to fail: ${args.join(" ")}`);
}

function assertAllFalse(record) {
  for (const [key, value] of Object.entries(record)) {
    assert.equal(value, false, `${key} should be false`);
  }
}

function assertNonAuthorizing(result) {
  for (const field of nonAuthorizingResultFields) {
    assert.equal(result[field], false, `${field} should be false`);
  }

  assert.equal(result.nonAuthorizingProof, true);
  assertAllFalse(result.runtimeEffect);
}

function handoffEntryPatch(patch) {
  const [entry] = createInterAgentEncodedHandoffConformanceForReview({
    reviewedAt
  }).handoffEntries;

  return [{ ...structuredClone(entry), ...patch }];
}

function oneClickOptionPatch(patch) {
  const [option] = createInterAgentEncodedHandoffConformanceForReview({
    reviewedAt
  }).oneClickOptions;

  return [{ ...structuredClone(option), ...patch }];
}

test("Phase 5.60 inter-agent encoded handoff conformance fixture is deterministic", async () => {
  const fixture = await readFixture();
  const generated = createInterAgentEncodedHandoffConformanceForReview({
    reviewedAt
  });

  assert.equal(fixture.schema, INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_SCHEMA);
  assert.deepEqual(fixture, generated);
  assert.equal(
    fixture.classification,
    expectedCaseClassifications[
      "valid-inter-agent-encoded-handoff-conformance"
    ]
  );
  assert.equal(fixture.interAgentEncodedHandoffConformanceProduced, true);
  assert.deepEqual(
    fixture.handoffConformanceSummary.handoffIds,
    expectedHandoffIds
  );
  assert.deepEqual(
    fixture.handoffConformanceSummary.oneClickOptionIds,
    expectedOneClickOptionIds
  );
  assert.equal(fixture.handoffConformanceSummary.handoffEntryCount, 12);
  assert.equal(fixture.handoffConformanceSummary.oneClickOptionCount, 7);
});

test("Phase 5.60 captures GLOSSOPETRAE and future protocol references as metadata only", async () => {
  const fixture = await readFixture();
  const state = fixture.interAgentEncodedHandoffConformance;

  assert.equal(
    state.sourcePhaseContext.phase559FabricAwareApiBackendContractBoundaryMap,
    "tests/fixtures/host-policy/phase5-59/fabric-aware-api-backend-contract-boundary-map.json"
  );
  assert.equal(state.sourcePhaseContext.glossopetraeArchitectureReferenceOnly, true);
  assert.equal(
    state.sourcePhaseContext.glossopetraeCopiedVendoredInstalledImportedIntegrated,
    false
  );
  assert.equal(
    fixture.handoffConformanceSummary.glossopetraeArchitectureReferenceOnly,
    true
  );
  assert.equal(
    fixture.handoffConformanceSummary
      .glossopetraeCopiedVendoredInstalledImportedIntegrated,
    false
  );
  assert.equal(
    fixture.handoffConformanceSummary.futureProtocolReferencesMetadataOnly,
    true
  );
  assert.ok(
    fixture.handoffEntries.some((entry) =>
      entry.futureProtocolReferences.includes("libp2p")
    )
  );
});

test("Phase 5.60 invalid encoded handoff conformance cases fail closed", () => {
  const canonical =
    createInterAgentEncodedHandoffConformanceForReview({ reviewedAt });
  const firstEntry = structuredClone(canonical.handoffEntries[0]);
  const missingFieldEntry = structuredClone(firstEntry);

  delete missingFieldEntry.handoffId;

  const cases = [
    {
      name: "malformed-inter-agent-encoded-handoff-conformance-input-rejected",
      input: null
    },
    {
      name: "malformed-inter-agent-encoded-handoff-conformance-input-rejected",
      input: { reviewedAt: "not-a-timestamp" }
    },
    {
      name: "missing-required-inter-agent-encoded-handoff-conformance-entry-rejected",
      input: { reviewedAt, handoffEntries: [missingFieldEntry] }
    },
    {
      name: "unknown-handoff-family-inter-agent-encoded-handoff-conformance-input-rejected",
      input: {
        reviewedAt,
        handoffEntries: handoffEntryPatch({ handoffFamily: "runtime_channel" })
      }
    },
    {
      name: "unknown-source-or-target-actor-inter-agent-encoded-handoff-conformance-input-rejected",
      input: {
        reviewedAt,
        handoffEntries: handoffEntryPatch({ sourceActor: "jules" })
      }
    },
    {
      name: "unknown-encoded-handoff-mode-inter-agent-encoded-handoff-conformance-input-rejected",
      input: {
        reviewedAt,
        handoffEntries: handoffEntryPatch({ encodedHandoffMode: "covert" })
      }
    },
    {
      name: "unknown-current-status-inter-agent-encoded-handoff-conformance-input-rejected",
      input: {
        reviewedAt,
        handoffEntries: handoffEntryPatch({ currentStatus: "implemented" })
      }
    },
    {
      name: "authorization-flags-enabled-inter-agent-encoded-handoff-conformance-input-rejected",
      input: {
        reviewedAt,
        handoffEntries: handoffEntryPatch({
          explicitBlockedAuthorizationFlags: {
            ...firstEntry.explicitBlockedAuthorizationFlags,
            encodedHandoffRuntimeAuthorizationGranted: true
          }
        })
      }
    },
    {
      name: "report-runs-checks-true-inter-agent-encoded-handoff-conformance-input-rejected",
      input: { reviewedAt, reportRunsChecks: true }
    },
    {
      name: "runtime-authorization-attempt-inter-agent-encoded-handoff-conformance-input-rejected",
      input: { reviewedAt, runtimeAuthorizationGranted: true }
    },
    {
      name: "command-exposure-attempt-inter-agent-encoded-handoff-conformance-input-rejected",
      input: { reviewedAt, commandExposureEnabled: true }
    },
    {
      name: "blocked-cli-bypass-attempt-inter-agent-encoded-handoff-conformance-input-rejected",
      input: { reviewedAt, blockedCliBypassEnabled: true }
    },
    {
      name: "hidden-codec-translator-encoder-decoder-conlang-execution-semantics-inter-agent-encoded-handoff-conformance-input-rejected",
      input: { reviewedAt, handoffEntries: handoffEntryPatch({ codecImplemented: true }) }
    },
    {
      name: "hidden-steganography-covert-channel-tokenizer-exploit-guardrail-evasion-bypass-semantics-inter-agent-encoded-handoff-conformance-input-rejected",
      input: {
        reviewedAt,
        oneClickOptions: oneClickOptionPatch({ SteganographyEngine: {} })
      }
    },
    {
      name: "hidden-import-export-package-persistence-semantics-inter-agent-encoded-handoff-conformance-input-rejected",
      input: {
        reviewedAt,
        handoffEntries: handoffEntryPatch({ importCommand: "ardyn import" })
      }
    },
    {
      name: "secure-drop-implementation-semantics-inter-agent-encoded-handoff-conformance-input-rejected",
      input: {
        reviewedAt,
        handoffEntries: handoffEntryPatch({ secureDropCryptoImplemented: true })
      }
    },
    {
      name: "hidden-fabric-websocket-http-mcp-task-runtime-semantics-inter-agent-encoded-handoff-conformance-input-rejected",
      input: {
        reviewedAt,
        handoffEntries: handoffEntryPatch({ fabricBusTopic: "blocked.topic" })
      }
    },
    {
      name: "unsafe-runtime-command-connector-fabric-websocket-http-mcp-task-secure-drop-service-discovery-schedule-filesystem-process-flags-inter-agent-encoded-handoff-conformance-input-rejected",
      input: {
        reviewedAt,
        handoffEntries: handoffEntryPatch({
          unsafeEncodedHandoffRuntimeFlags: {
            ...firstEntry.unsafeEncodedHandoffRuntimeFlags,
            serviceDiscoveryEnabled: true
          }
        })
      }
    },
    {
      name: "nested-unsafe-flags-inter-agent-encoded-handoff-conformance-input-rejected",
      input: {
        reviewedAt,
        handoffEntries: handoffEntryPatch({
          runtimeEffect: { unexpectedRuntimeEffect: true }
        })
      }
    },
    {
      name: "noncanonical-inter-agent-encoded-handoff-conformance-input-rejected",
      input: {
        reviewedAt,
        handoffEntries: [...canonical.handoffEntries].reverse()
      }
    },
    {
      name: "noncanonical-inter-agent-encoded-handoff-conformance-input-rejected",
      input: {
        reviewedAt,
        oneClickOptions: [...canonical.oneClickOptions].reverse()
      }
    }
  ];

  for (const { name, input } of cases) {
    const result = createInterAgentEncodedHandoffConformanceForReview(input);

    assert.equal(result.classification, expectedCaseClassifications[name], name);
    assert.equal(result.interAgentEncodedHandoffConformanceProduced, false);
    assert.equal(result.interAgentEncodedHandoffConformance, null);
    assertNonAuthorizing(result);
  }
});

test("Phase 5.60 handoff entries cover required families, actors, modes, and blocked semantics", async () => {
  const fixture = await readFixture();
  const families = new Set();
  const actors = new Set();
  const modes = new Set();

  for (const entry of fixture.handoffEntries) {
    families.add(entry.handoffFamily);
    actors.add(entry.sourceActor);
    actors.add(entry.targetActor);
    modes.add(entry.encodedHandoffMode);
    assert.match(entry.handoffId, /^phase5-60\./);
    assert.equal(entry.encodedHandoffConformanceMetadataOnly, true);
    assert.equal(entry.glossopetraeArchitectureReferenceOnly, true);
    assert.equal(
      entry.glossopetraeCopiedVendoredInstalledImportedIntegrated,
      false
    );
    assert.equal(entry.futureProtocolReferencesMetadataOnly, true);
    assert.equal(entry.rawProtocolAuditVisibleOrDigestRequired, true);
    assert.ok(entry.allowedCurrentBehavior.length >= 2);
    assert.ok(entry.forbiddenCurrentBehavior.includes("codec implementation"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("translator runtime"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("Fabric runtime bus"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("websocket/http transport"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("command exposure"));
    assert.ok(entry.forbiddenCurrentBehavior.includes("service discovery"));
    assertAllFalse(entry.explicitBlockedAuthorizationFlags);
    assertAllFalse(entry.unsafeEncodedHandoffRuntimeFlags);
    assertAllFalse(entry.runtimeEffect);
    assert.equal(entry.nonAuthorizingProof, true);
  }

  assert.deepEqual([...families].sort(), [
    "fabric_coordination_envelope",
    "handoff_audit_visibility",
    "locus_harness_bridge",
    "operator_translation_bridge",
    "protocol_reference_layer",
    "subagent_encoded_handoff"
  ]);
  assert.deepEqual([...actors].sort(), [
    "ardyn",
    "ardyn-subagent",
    "content-fabric",
    "external-harness",
    "locus",
    "multiverse"
  ]);
  assert.deepEqual([...modes].sort(), [
    "encoded_candidate_metadata",
    "operator_translation_required",
    "plaintext",
    "structured_metadata"
  ]);
});

test("Phase 5.60 one-click options are metadata-only and non-executable", async () => {
  const fixture = await readFixture();

  assert.deepEqual(
    fixture.oneClickOptions.map((option) => option.optionId),
    expectedOneClickOptionIds
  );

  for (const option of fixture.oneClickOptions) {
    assert.equal(option.optionIntent, "metadata_only");
    assert.equal(option.nonExecutable, true);
    assert.equal(option.changesRuntimeBehavior, false);
    assert.equal(option.changesReportRunsChecks, false);
    assert.equal(option.exposesCommands, false);
    assert.equal(option.authorizesRuntime, false);
    assert.equal(option.producesApprovalGrant, false);
    assert.equal(option.connectorGrantProduced, false);
    assert.equal(option.nonAuthorizingProof, true);
    assertAllFalse(option.runtimeEffect);
  }

  assert.equal(
    fixture.handoffConformanceSummary.oneClickOperatorOptionMetadataOnly,
    true
  );
  assert.equal(
    fixture.handoffConformanceSummary.encodedContentCannotChangeReportRunsChecks,
    true
  );
  assert.equal(
    fixture.handoffConformanceSummary.encodedContentCannotAuthorizeRuntime,
    true
  );
  assert.equal(
    fixture.handoffConformanceSummary.encodedContentCannotExposeCommands,
    true
  );
  assert.equal(
    fixture.handoffConformanceSummary
      .encodedContentCannotBypassBlockedCliBehavior,
    true
  );
});

test("Phase 5.60 conformance result stays non-authorizing and runtime-blocked", async () => {
  const fixture = await readFixture();
  const summary = fixture.handoffConformanceSummary;

  assert.equal(summary.interAgentEncodedHandoffMetadataOnly, true);
  assert.equal(summary.locusMediatedHarnessBridgeMetadataOnly, true);
  assert.equal(summary.fabricCoordinationEnvelopeMetadataOnly, true);
  assert.equal(
    summary.operatorPlaintextFinalOutputTranslatorRequirementRecorded,
    true
  );
  assert.equal(summary.rawProtocolAuditVisibilityRequired, true);
  assert.equal(summary.allBlockedAuthorizationFlagsFalse, true);
  assert.equal(summary.allUnsafeEncodedHandoffRuntimeFlagsFalse, true);
  assert.equal(summary.allRuntimeEffectsFalse, true);
  assert.equal(summary.allEntriesNonAuthorizing, true);
  assert.equal(
    fixture.invalidHandoffCasePolicy.validationImplementsEncodedHandoffRuntime,
    false
  );
  assert.equal(fixture.invalidHandoffCasePolicy.validationImplementsCodec, false);
  assert.equal(
    fixture.invalidHandoffCasePolicy.validationImplementsTranslatorRuntime,
    false
  );
  assert.equal(
    fixture.invalidHandoffCasePolicy.validationImplementsStegoOrCovertChannel,
    false
  );
  assert.equal(
    fixture.invalidHandoffCasePolicy.validationImplementsTransport,
    false
  );
  assert.equal(
    fixture.invalidHandoffCasePolicy.validationImplementsFabricRuntime,
    false
  );
  assert.equal(
    fixture.invalidHandoffCasePolicy.validationImplementsBackendApiServer,
    false
  );
  assert.equal(fixture.invalidHandoffCasePolicy.validationRunsRuntime, false);
  assertNonAuthorizing(fixture);
  assertNonAuthorizing(fixture.interAgentEncodedHandoffConformance);
  assert.ok(
    fixture.topInterAgentHandoffFabricApiBackendGaps.some((gap) =>
      gap.includes("No encoded handoff protocol schema")
    )
  );
  assert.equal(
    fixture.recommendedNextPhase,
    "phase-5.61-review-only-database-storage-contract-boundary-map"
  );
});

test("serve-runtime remains default-blocked and dry-run cannot bypass Phase 5.60", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-phase5-60-runtime-"));

  try {
    for (const args of [["serve-runtime"], ["serve-runtime", "--dry-run"]]) {
      const failure = await expectCliFailure(args);

      assert.equal(failure.code, 1);
      assert.equal(failure.stdout, "");
      assert.match(failure.stderr, /runtime unavailable/i);
    }
  } finally {
    await rm(scratch, { recursive: true, force: true });
  }
});

test("Phase 5.60 encoded handoff/runtime command names remain rejected", async () => {
  for (const command of commandProbes) {
    const failure = await expectCliFailure([command]);

    assert.notEqual(failure.code, 0);
    assert.equal(failure.stdout, "");
    assert.match(failure.stderr, /unknown command|Usage: ardyn/i);
  }
});

test("Phase 5.60 does not change CLI, Rust, Fabric, package, or consumer source", async () => {
  await execFileAsync(
    "git",
    [
      "diff",
      "--exit-code",
      phase560BaselineCommit,
      "--",
      "apps/cli/src/index.mjs",
      "crates/ardyn-host/src/lib.rs",
      "crates/ardyn-host/src/stdio_runtime/mod.rs",
      "packages/fabric/src/index.mjs",
      "package.json"
    ],
    {
      cwd: repoRoot
    }
  );

  const currentCliSource = await readFile(cliPath, "utf8");

  assert.doesNotMatch(currentCliSource, /inter-agent-encoded-handoff-conformance/);
  assert.doesNotMatch(currentCliSource, /encoded-handoff-runtime/);
  assert.doesNotMatch(currentCliSource, /glossopetrae/);
  assert.doesNotMatch(currentCliSource, /encoded-handoff-codec/);
  assert.doesNotMatch(currentCliSource, /encoded-handoff-translator/);
  assert.doesNotMatch(currentCliSource, /conlang-generator/);
  assert.doesNotMatch(currentCliSource, /semantic-stego/);
  assert.doesNotMatch(currentCliSource, /token-exploiter/);
  assert.doesNotMatch(currentCliSource, /covert-channel/);
  assert.doesNotMatch(currentCliSource, /guardrail-bypass/);
  assert.doesNotMatch(currentCliSource, /hidden-payload/);
  assert.doesNotMatch(currentCliSource, /fabric-message-bus/);
  assert.doesNotMatch(currentCliSource, /a2a-runtime/);
  assert.doesNotMatch(currentCliSource, /mcp-handoff-runtime/);
  assert.doesNotMatch(currentCliSource, /phase-5-60/);
});
