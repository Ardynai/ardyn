#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";

import {
  buildMigrationAttestationDisplaySummary,
  buildApprovalReviewArtifactDisplaySummary,
  buildSessionTranscriptDisplaySummary,
  buildSessionTranscriptMigrationMetadata,
  buildSessionTranscriptSummary,
  buildReviewArtifactAttestationPlan,
  buildSchemaMigrationMetadataRecord,
  classifyApprovalReviewArtifactCompatibility,
  classifySessionTranscriptCompatibility,
  classifySessionTranscript,
  compareApprovalReviewArtifacts,
  createApprovalReviewArtifact,
  createTaskPlan,
  createDoctorReport,
  explainSessionTranscript,
  explainSessionTranscriptCompatibility,
  loadManifest,
  loadTask,
  normalizeApprovalReviewArtifactForDisplay,
  validateSessionTranscript,
  validateApprovalReviewArtifactVersion,
  createStaticHandshakeFromPath,
  createStaticIdentity
} from "@ardyn/core";

function printJson(value) {
  process.stdout.write(formatJson(value));
}

function formatJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
}

function readOption(args, name) {
  const index = args.indexOf(name);
  if (index === -1) {
    return undefined;
  }

  return args[index + 1];
}

const PLAN_OUTPUT_FLAGS = ["--trace", "--summary", "--explain", "--review-artifact"];
const REVIEW_TRACE_OUTPUT_FLAGS = ["--summary", "--explain"];
const REVIEW_ARTIFACT_OUTPUT_FLAGS = [
  "--summary",
  "--explain",
  "--schema-status",
  "--attestation-plan"
];
const SESSION_TRANSCRIPT_OUTPUT_FLAGS = [
  "--summary",
  "--explain",
  "--schema-status",
  "--display-summary",
  "--compatibility-explain"
];

function readPlanOutputMode(args) {
  const selectedFlags = PLAN_OUTPUT_FLAGS.filter((flag) => args.includes(flag));

  if (selectedFlags.length > 1) {
    return {
      error: `Plan output flags are mutually exclusive: ${selectedFlags.join(", ")}.`
    };
  }

  return {
    mode: selectedFlags[0]?.slice(2) ?? "default"
  };
}

function readReviewTraceOutputMode(args) {
  const selectedFlags = REVIEW_TRACE_OUTPUT_FLAGS.filter((flag) => args.includes(flag));

  if (selectedFlags.length > 1) {
    return {
      error: `Review trace output flags are mutually exclusive: ${selectedFlags.join(", ")}.`
    };
  }

  return {
    mode: selectedFlags[0]?.slice(2) ?? "default"
  };
}

function readReviewArtifactOutputMode(args) {
  const selectedFlags = REVIEW_ARTIFACT_OUTPUT_FLAGS.filter((flag) => args.includes(flag));

  if (selectedFlags.length > 1) {
    return {
      error: `Review artifact output flags are mutually exclusive: ${selectedFlags.join(", ")}.`
    };
  }

  if (selectedFlags.length === 0) {
    return {
      error: "Review artifact output flag is required: --summary or --explain."
    };
  }

  return {
    mode: selectedFlags[0].slice(2)
  };
}

function readSessionTranscriptOutputMode(args) {
  const selectedFlags = SESSION_TRANSCRIPT_OUTPUT_FLAGS.filter((flag) => args.includes(flag));

  if (selectedFlags.length > 1) {
    return {
      error: `Session transcript output flags are mutually exclusive: ${selectedFlags.join(", ")}.`
    };
  }

  return {
    mode: selectedFlags[0]?.slice(2) ?? "default"
  };
}

function readRequiredPathOption(args, name) {
  const index = args.indexOf(name);
  if (index === -1) {
    return undefined;
  }

  const value = args[index + 1];
  if (!value || value.startsWith("--")) {
    return "";
  }

  return value;
}

function createPlanTraceOutput(plan) {
  return {
    command: "plan",
    output: "trace",
    manifest: plan.plannerTrace.manifest,
    taskId: plan.task.id,
    trace: plan.plannerTrace,
    safety: plan.safety
  };
}

function createPlanSummaryOutput(plan) {
  return {
    command: "plan",
    output: "summary",
    manifest: plan.plannerTrace.manifest,
    taskId: plan.task.id,
    selectedCapabilities: plan.plannerTrace.selectedCapabilities,
    unresolvedRequests: plan.plannerTrace.unresolvedRequests,
    approval: {
      required: plan.approval.required,
      status: plan.approval.status,
      reasons: plan.approval.reasons,
      decision: plan.approvalDecision
    },
    safety: plan.safety
  };
}

function createPlanExplainOutput(plan) {
  return {
    command: "plan",
    output: "explain",
    manifest: plan.plannerTrace.manifest,
    taskId: plan.task.id,
    matchingPolicy: plan.matchingPolicy,
    requests: plan.resolutions.map((resolution) => ({
      request: resolution.request,
      matchType: resolution.matchType,
      scope: resolution.scope,
      reason: resolution.reason,
      selectedCapabilityIds: resolution.selectedCapabilityIds,
      candidates: resolution.candidates.map((candidate) => ({
        capabilityId: candidate.capabilityId,
        matchType: candidate.matchType,
        score: candidate.score,
        scope: candidate.scope,
        tag: candidate.tag,
        reason: candidate.reason
      }))
    })),
    unresolvedRequests: plan.plannerTrace.unresolvedRequests,
    approval: {
      required: plan.approval.required,
      status: plan.approval.status,
      reasons: plan.approval.reasons,
      decision: plan.approvalDecision
    },
    safety: plan.safety
  };
}

function createPlanReviewArtifactOutput(plan) {
  return createApprovalReviewArtifact(plan);
}

function createPlanReviewArtifactExportSummary(outputPath, artifactText, artifact) {
  return {
    command: "plan",
    output: "review-artifact-export",
    path: outputPath,
    bytes: Buffer.byteLength(artifactText, "utf8"),
    nonExecuting: artifact.nonExecuting,
    safety: artifact.safety
  };
}

function createPlanOutput(plan, mode) {
  if (mode === "trace") {
    return createPlanTraceOutput(plan);
  }

  if (mode === "summary") {
    return createPlanSummaryOutput(plan);
  }

  if (mode === "explain") {
    return createPlanExplainOutput(plan);
  }

  if (mode === "review-artifact") {
    return createPlanReviewArtifactOutput(plan);
  }

  return {
    command: "plan",
    ...plan
  };
}

function createManifestSummary(manifest) {
  return {
    id: manifest?.id ?? null,
    version: manifest?.version ?? null,
    schemaVersion: manifest?.schemaVersion ?? null
  };
}

function createReviewTraceSourceSummary(source) {
  return {
    schema: source?.schema ?? null,
    schemaVersion: source?.schemaVersion ?? null,
    version: source?.version ?? null,
    task: {
      id: source?.taskId ?? source?.taskIntake?.taskId ?? source?.task?.id ?? null
    },
    manifest: createManifestSummary(source?.manifest)
  };
}

function createReviewTraceSummary(left, right, comparison) {
  return {
    command: "review-trace",
    output: "summary",
    equal: comparison.equal,
    differenceCount: comparison.differenceCount,
    differenceTypes: comparison.differences.map((difference) => ({
      type: difference.type,
      path: difference.path
    })),
    left: createReviewTraceSourceSummary(left),
    right: createReviewTraceSourceSummary(right),
    nonExecuting: comparison.nonExecuting,
    safety: comparison.safety
  };
}

function formatReviewTraceValue(value) {
  return JSON.stringify(value);
}

function formatAddedRemovedDetail(difference) {
  return `${difference.path} added ${formatReviewTraceValue(
    difference.added
  )} and removed ${formatReviewTraceValue(difference.removed)}.`;
}

function explainReviewTraceDifference(difference) {
  if (difference.type === "task-mismatch") {
    return {
      reason: "Task identifiers differ.",
      detail: `${difference.path} changed from ${formatReviewTraceValue(
        difference.left
      )} to ${formatReviewTraceValue(difference.right)}.`
    };
  }

  if (difference.type === "manifest-mismatch") {
    return {
      reason: "Manifest summary fields differ.",
      detail: `${difference.path} changed from ${formatReviewTraceValue(
        difference.left
      )} to ${formatReviewTraceValue(difference.right)}.`
    };
  }

  if (difference.type === "requested-capabilities-change") {
    return {
      reason: "Requested capability ids differ.",
      detail: formatAddedRemovedDetail(difference)
    };
  }

  if (difference.type === "selected-capabilities-change") {
    return {
      reason: "Selected capability ids differ.",
      detail: formatAddedRemovedDetail(difference)
    };
  }

  if (difference.type === "unresolved-requests-change") {
    return {
      reason: "Unresolved request ids differ.",
      detail: formatAddedRemovedDetail(difference)
    };
  }

  if (difference.type === "approval-requested-capabilities-change") {
    return {
      reason: "Approval requested capability ids differ.",
      detail: formatAddedRemovedDetail(difference)
    };
  }

  if (difference.type === "approval-status-change") {
    return {
      reason: "Approval status differs.",
      detail: `${difference.path} changed from ${formatReviewTraceValue(
        difference.left
      )} to ${formatReviewTraceValue(difference.right)}.`
    };
  }

  if (difference.type === "candidate-rankings-change") {
    return {
      reason: "Candidate rankings differ.",
      detail: `${difference.path} changed between left and right artifacts.`
    };
  }

  return {
    reason: "Review trace fields differ.",
    detail: `${difference.path} differs between left and right artifacts.`
  };
}

function createReviewTraceExplain(left, right, comparison) {
  return {
    command: "review-trace",
    output: "explain",
    equal: comparison.equal,
    differenceCount: comparison.differenceCount,
    differences: comparison.differences.map((difference) => ({
      ...difference,
      ...explainReviewTraceDifference(difference)
    })),
    left: createReviewTraceSourceSummary(left),
    right: createReviewTraceSourceSummary(right),
    nonExecuting: comparison.nonExecuting,
    safety: comparison.safety
  };
}

function createReviewTraceDefault(left, right, comparison) {
  return {
    command: "review-trace",
    output: "default",
    equal: comparison.equal,
    differenceCount: comparison.differenceCount,
    differences: comparison.differences,
    left: createReviewTraceSourceSummary(left),
    right: createReviewTraceSourceSummary(right),
    nonExecuting: comparison.nonExecuting,
    safety: comparison.safety
  };
}

function createReviewTraceOutput(left, right, comparison, mode) {
  if (mode === "summary") {
    return createReviewTraceSummary(left, right, comparison);
  }

  if (mode === "explain") {
    return createReviewTraceExplain(left, right, comparison);
  }

  return createReviewTraceDefault(left, right, comparison);
}

function assertCompatibleReviewArtifact(artifact) {
  const versionValidation = validateApprovalReviewArtifactVersion(artifact);

  if (!versionValidation.valid) {
    throw new Error(
      `review artifact compatibility ${versionValidation.compatibility}: ${versionValidation.errors.join("; ")}`
    );
  }

  return versionValidation;
}

function createReviewArtifactSafetyDisplay(normalized) {
  return {
    nonExecuting: normalized.nonExecuting,
    allFlagsFalse: normalized.safetyFlagsAllFalse,
    flags: normalized.safety
  };
}

function createReviewArtifactSummary(filePath, artifact) {
  return {
    command: "review-artifact",
    output: "summary",
    file: filePath,
    compatibility: classifyApprovalReviewArtifactCompatibility(artifact),
    displaySummary: buildApprovalReviewArtifactDisplaySummary(artifact)
  };
}

function createReviewArtifactExplain(filePath, artifact, versionValidation) {
  const normalized = normalizeApprovalReviewArtifactForDisplay(artifact);

  return {
    command: "review-artifact",
    output: "explain",
    file: filePath,
    compatibility: classifyApprovalReviewArtifactCompatibility(artifact),
    versionValidation,
    approval: normalized.approvalDecision,
    safety: createReviewArtifactSafetyDisplay(normalized),
    unknownFields: {
      handling: "preserve_as_inert_display_data",
      names: normalized.unknownFields,
      values: normalized.unknown
    },
    displayGuidance: {
      useSummaryForCompactDisplay: true,
      preserveUnknownFieldsAsInertData: true,
      doNotExecuteOrInterpretUnknownFields: true,
      summary: buildApprovalReviewArtifactDisplaySummary(artifact)
    },
    normalized
  };
}

function createReviewArtifactOutput(filePath, artifact, mode, versionValidation) {
  if (mode === "summary") {
    return createReviewArtifactSummary(filePath, artifact);
  }

  if (mode === "schema-status") {
    return {
      command: "review-artifact",
      output: "schema-status",
      file: filePath,
      schemaStatus: buildSchemaMigrationMetadataRecord("approval_review_artifact", artifact),
      displaySummary: buildMigrationAttestationDisplaySummary("approval_review_artifact", artifact)
    };
  }

  if (mode === "attestation-plan") {
    return {
      command: "review-artifact",
      output: "attestation-plan",
      file: filePath,
      attestationPlan: buildReviewArtifactAttestationPlan(artifact)
    };
  }

  return createReviewArtifactExplain(filePath, artifact, versionValidation);
}

function createSessionTranscriptDefault(filePath, transcript) {
  const validation = validateSessionTranscript(transcript);
  const classification = classifySessionTranscript(transcript);

  return {
    command: "validate-session-transcript",
    output: "default",
    file: filePath,
    validation,
    classification,
    nonExecuting: true,
    safety: classification.safety
  };
}

function createSessionTranscriptSummary(filePath, transcript) {
  return {
    command: "validate-session-transcript",
    output: "summary",
    file: filePath,
    summary: buildSessionTranscriptSummary(transcript)
  };
}

function createSessionTranscriptExplain(filePath, transcript) {
  return {
    command: "validate-session-transcript",
    output: "explain",
    file: filePath,
    explanation: explainSessionTranscript(transcript)
  };
}

function createSessionTranscriptSchemaStatus(filePath, transcript) {
  return {
    command: "validate-session-transcript",
    output: "schema-status",
    file: filePath,
    schemaStatus: classifySessionTranscriptCompatibility(transcript),
    migrationMetadata: buildSessionTranscriptMigrationMetadata(transcript)
  };
}

function createSessionTranscriptDisplaySummary(filePath, transcript) {
  return {
    command: "validate-session-transcript",
    output: "display-summary",
    file: filePath,
    displaySummary: buildSessionTranscriptDisplaySummary(transcript)
  };
}

function createSessionTranscriptCompatibilityExplain(filePath, transcript) {
  return {
    command: "validate-session-transcript",
    output: "compatibility-explain",
    file: filePath,
    explanation: explainSessionTranscriptCompatibility(transcript)
  };
}

function createSessionTranscriptOutput(filePath, transcript, mode) {
  if (mode === "summary") {
    return createSessionTranscriptSummary(filePath, transcript);
  }

  if (mode === "explain") {
    return createSessionTranscriptExplain(filePath, transcript);
  }

  if (mode === "schema-status") {
    return createSessionTranscriptSchemaStatus(filePath, transcript);
  }

  if (mode === "display-summary") {
    return createSessionTranscriptDisplaySummary(filePath, transcript);
  }

  if (mode === "compatibility-explain") {
    return createSessionTranscriptCompatibilityExplain(filePath, transcript);
  }

  return createSessionTranscriptDefault(filePath, transcript);
}

function assertLocalFilePath(filePath, label) {
  if (/^[a-z][a-z\d+.-]*:\/\//i.test(filePath) || /^file:/i.test(filePath)) {
    throw new Error(`${label} must be a local file path.`);
  }

  if (/^[\\/]{2}/.test(filePath)) {
    throw new Error(`${label} must be a local file path.`);
  }
}

function assertLocalJsonPath(filePath, label) {
  try {
    assertLocalFilePath(filePath, label);
  } catch {
    throw new Error(`${label} must be a local JSON file path.`);
  }

  if (!filePath.toLowerCase().endsWith(".json")) {
    throw new Error(`${label} must point to a .json file.`);
  }
}

async function readLocalJsonFile(filePath, label) {
  assertLocalJsonPath(filePath, label);

  let text;
  try {
    text = await readFile(filePath, "utf8");
  } catch (error) {
    throw new Error(`${label} could not be read: ${error instanceof Error ? error.message : String(error)}`);
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(`${label} is not valid JSON: ${error instanceof Error ? error.message : String(error)}`);
  }
}

async function run(argv) {
  const [command, ...args] = argv;

  if (command === "doctor") {
    printJson(createDoctorReport());
    return;
  }

  if (command === "identity") {
    printJson(createStaticIdentity());
    return;
  }

  if (command === "capabilities") {
    const manifestPath = readOption(args, "--manifest");
    if (!manifestPath) {
      fail("Missing required --manifest path.");
      return;
    }

    const handshake = await createStaticHandshakeFromPath(manifestPath);
    printJson({
      command: "capabilities",
      manifest: handshake.manifest,
      capabilities: handshake.capabilities,
      executionEnabled: false,
      toolExecutionEnabled: false,
      networkListening: false
    });
    return;
  }

  if (command === "plan") {
    const outputMode = readPlanOutputMode(args);
    if (outputMode.error) {
      fail(outputMode.error);
      return;
    }

    const hasOutputPathFlag = args.includes("--output");
    const outputPath = readRequiredPathOption(args, "--output");
    const manifestPath = readOption(args, "--manifest");
    const taskPath = readOption(args, "--task");

    if (hasOutputPathFlag && !outputPath) {
      fail("Missing required --output path.");
      return;
    }

    if (hasOutputPathFlag && outputMode.mode !== "review-artifact") {
      fail("--output requires --review-artifact.");
      return;
    }

    if (outputPath) {
      assertLocalFilePath(outputPath, "--output");
    }

    if (!manifestPath) {
      fail("Missing required --manifest path.");
      return;
    }

    if (!taskPath) {
      fail("Missing required --task path.");
      return;
    }

    const manifest = await loadManifest(manifestPath);
    const task = await loadTask(taskPath);
    const plan = createTaskPlan(manifest, task, { manifestPath, taskPath });
    const planOutput = createPlanOutput(plan, outputMode.mode);

    if (outputPath) {
      const artifactText = formatJson(planOutput);
      await writeFile(outputPath, artifactText, "utf8");
      printJson(createPlanReviewArtifactExportSummary(outputPath, artifactText, planOutput));
      return;
    }

    printJson(planOutput);
    return;
  }

  if (command === "review-trace") {
    const outputMode = readReviewTraceOutputMode(args);
    if (outputMode.error) {
      fail(outputMode.error);
      return;
    }

    const leftPath = readRequiredPathOption(args, "--left");
    const rightPath = readRequiredPathOption(args, "--right");

    if (!leftPath) {
      fail("Missing required --left path.");
      return;
    }

    if (!rightPath) {
      fail("Missing required --right path.");
      return;
    }

    const left = await readLocalJsonFile(leftPath, "left");
    const right = await readLocalJsonFile(rightPath, "right");
    const comparison = compareApprovalReviewArtifacts(left, right);

    printJson(createReviewTraceOutput(left, right, comparison, outputMode.mode));
    return;
  }

  if (command === "review-artifact") {
    const outputMode = readReviewArtifactOutputMode(args);
    if (outputMode.error) {
      fail(outputMode.error);
      return;
    }

    const filePath = readRequiredPathOption(args, "--file");
    if (!filePath) {
      fail("Missing required --file path.");
      return;
    }

    const artifact = await readLocalJsonFile(filePath, "--file");
    const versionValidation =
      outputMode.mode === "schema-status" || outputMode.mode === "attestation-plan"
        ? validateApprovalReviewArtifactVersion(artifact)
        : assertCompatibleReviewArtifact(artifact);

    printJson(createReviewArtifactOutput(filePath, artifact, outputMode.mode, versionValidation));
    return;
  }

  if (command === "validate-session-transcript") {
    const outputMode = readSessionTranscriptOutputMode(args);
    if (outputMode.error) {
      fail(outputMode.error);
      return;
    }

    const filePath = readRequiredPathOption(args, "--file");
    if (!filePath) {
      fail("Missing required --file path.");
      return;
    }

    const transcript = await readLocalJsonFile(filePath, "--file");
    printJson(createSessionTranscriptOutput(filePath, transcript, outputMode.mode));
    return;
  }

  if (command === "serve") {
    const dryRun = args.includes("--dry-run");
    const manifestPath = readOption(args, "--manifest");

    if (!dryRun) {
      fail("Only ardyn serve --dry-run is available in Phase 3.");
      return;
    }

    if (!manifestPath) {
      fail("Missing required --manifest path.");
      return;
    }

    const handshake = await createStaticHandshakeFromPath(manifestPath);
    printJson({
      command: "serve",
      dryRun: true,
      plannedRuntime: handshake,
      executionEnabled: false,
      toolExecutionEnabled: false,
      autonomousExecutionEnabled: false,
      productionToolExecutionEnabled: false,
      apiCallsEnabled: false,
      networkListening: false,
      longRunningServicesStarted: false,
      processesSpawned: false
    });
    return;
  }

  fail(
    "Usage: ardyn <doctor|identity|capabilities --manifest <path>|plan [--trace|--summary|--explain|--review-artifact] --manifest <path> --task <path>|review-artifact --file <file> [--summary|--explain]|review-trace [--summary|--explain] --left <file> --right <file>|validate-session-transcript --file <file> [--summary|--explain|--schema-status|--display-summary|--compatibility-explain]|serve --dry-run --manifest <path>>"
  );
}

run(process.argv.slice(2)).catch((error) => {
  fail(error instanceof Error ? error.message : String(error));
});
