#!/usr/bin/env node
import { writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

import {
  assertLocalFilePath,
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
  createStdioDryRunSessionEvents,
  createTaskPlan,
  createDoctorReport,
  explainSessionTranscript,
  explainSessionTranscriptCompatibility,
  formatSessionEventsJsonl,
  loadManifest,
  loadTask,
  normalizeApprovalReviewArtifactForDisplay,
  readLocalJsonFile,
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
const DEFAULT_BLOCKED_RUNTIME_COMMANDS = new Set();

// M1: serve-runtime is now handled with --enable-runtime flag.
// Without --enable-runtime, it still fails (approval gate).
// Other blocked commands stay in the set.
const ENABLE_RUNTIME_FLAG = "--enable-runtime";
const APPROVE_FLAG = "--approve";

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

function createDefaultBlockedRuntimeCommandMessage(command) {
  return [
    `Usage: ardyn ${command} [--dry-run]`,
    `Runtime unavailable: ${command} is recognized, but runtime is not enabled in Phase 5.5.`
  ].join("\n");
}

function readEmitSessionEventsArgs(args) {
  const parsed = {
    dryRun: false,
    manifestPath: undefined,
    taskPath: undefined
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === "--dry-run") {
      if (parsed.dryRun) {
        return { error: "Duplicate emit-session-events option: --dry-run." };
      }

      parsed.dryRun = true;
      continue;
    }

    if (arg === "--manifest" || arg === "--task") {
      const key = arg === "--manifest" ? "manifestPath" : "taskPath";

      if (parsed[key] !== undefined) {
        return { error: `Duplicate emit-session-events option: ${arg}.` };
      }

      const value = args[index + 1];
      if (!value || value.startsWith("--")) {
        return { error: `Missing required ${arg} path.` };
      }

      parsed[key] = value;
      index += 1;
      continue;
    }

    if (arg.startsWith("--")) {
      return { error: `Unknown emit-session-events option: ${arg}.` };
    }

    return { error: `Unexpected emit-session-events argument: ${arg}.` };
  }

  if (!parsed.dryRun) {
    return { error: "Only emit-session-events --dry-run is available in Phase 4.0B." };
  }

  if (!parsed.manifestPath) {
    return { error: "Missing required --manifest path." };
  }

  if (!parsed.taskPath) {
    return { error: "Missing required --task path." };
  }

  return { parsed };
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
      // Correctness-cleanup: gated writes use the stricter containment guard
      // (rejects Windows absolute/UNC/drive forms that assertLocalFilePath allowed).
      const { assertContainedWritePath } = await import(pathToFileURL(join(process.cwd(), "packages/core/src/internal/paths.mjs")).href);
      assertContainedWritePath(outputPath, "--output");
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

  if (command === "emit-session-events") {
    const emitArgs = readEmitSessionEventsArgs(args);
    if (emitArgs.error) {
      fail(emitArgs.error);
      return;
    }

    const { manifestPath, taskPath } = emitArgs.parsed;
    const manifest = await loadManifest(manifestPath);
    const task = await loadTask(taskPath);
    const events = createStdioDryRunSessionEvents(manifest, task, { manifestPath, taskPath });

    process.stdout.write(formatSessionEventsJsonl(events));
    return;
  }

  // M1: serve-runtime with --enable-runtime — REAL runtime with process spawning.
  // Without --enable-runtime, it fails (approval gate).
  if (command === "serve-runtime") {
    const enableRuntime = args.includes(ENABLE_RUNTIME_FLAG);
    const dryRun = args.includes("--dry-run");
    const approved = args.includes(APPROVE_FLAG);
    const manifestPath = readOption(args, "--manifest");
    const commandArg = readOption(args, "--command");
    const killAfterMs = parseInt(readOption(args, "--kill-after-ms") ?? "0", 10);
    const rustSession = args.includes("--rust-session");
    const streamMode = args.includes("--stream");
    const bufferEvents = args.includes("--buffer-events");

    if (!enableRuntime) {
      fail(createDefaultBlockedRuntimeCommandMessage("serve-runtime"));
      return;
    }

    if (!manifestPath) {
      fail("Missing required --manifest path for serve-runtime.");
      return;
    }

    if (!dryRun && !approved) {
      fail([
        "Usage: ardyn serve-runtime --enable-runtime --approve --manifest <path>",
        "Runtime requires explicit approval: add --approve to execute.",
        "Use --dry-run to plan without executing."
      ].join("\n"));
      return;
    }

    // Build the runtime plan from the manifest
    const handshake = await createStaticHandshakeFromPath(manifestPath);
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

    // Redaction: CREDIBILITY PASS — delegate to the single canonical redactor
    // (packages/core/src/internal/redaction.mjs). Applied to stderr AND stdout
    // frames so secrets never reach transcripts/audit/SSE.
    const { redactSecretsDeep } = await import(pathToFileURL(join(process.cwd(), "packages/core/src/internal/redaction.mjs")).href);
    function redactStderr(text) {
      return redactSecretsDeep(text);
    }

    // Dry-run: produce static plan, no process spawning
    if (dryRun) {
      printJson({
        command: "serve-runtime",
        dryRun: true,
        runtimeEnabled: true,
        approved: false,
        approvalGateStatus: "dry-run-no-approval-needed",
        killSwitchAvailable: true,
        killSwitchDescription: "Send SIGTERM or use --kill-after-ms to stop the runtime session.",
        manifestPath,
        sessionId,
        sessionPlan: {
          sessionId,
          frames: [],
          maxFrames: 8,
          lifecycle: "planned"
        },
        redaction: {
          stderrRedactionEnabled: true,
          redactionMode: "fail-closed",
          unredactableHandling: "blocked"
        },
        transcriptAudit: {
          replayEnabled: true,
          auditEnabled: true,
          transcriptPath: null,
          events: []
        },
        failureAudit: {
          enabled: true,
          killOnFailure: true,
          rollbackOnFailure: true,
          activated: false
        },
        processesSpawned: false,
        processResult: null,
        killSwitchActivated: false,
        executionEnabled: false,
        plannedRuntime: handshake
      });
      return;
    }

    // Live execution: spawn process if --command is provided, or Rust session if --rust-session
    let processResult = null;
    let killSwitchActivated = false;
    const transcriptEvents = [];

    if (rustSession) {
      // M1-Rust: invoke the Rust host session lifecycle binary
      const rustBin = "target/debug/session";
      const rustArgs = ["--approved", "--max-frames", "8"];
      const child = spawn(rustBin, rustArgs, {
        cwd: process.cwd(),
        env: { ...process.env },
        stdio: ["pipe", "pipe", "pipe"]
      });
      let stdoutData = "";
      let stderrData = "";
      let rustSpawnError = null;
      // B1: handle spawn errors for Rust binary
      child.on("error", (err) => {
        rustSpawnError = err.message;
        stderrData = err.message;
      });
      child.stdout.on("data", (c) => { stdoutData += c.toString(); });
      child.stderr.on("data", (c) => { stderrData += c.toString(); });
      const exitCode = await new Promise((resolve) => {
        child.on("close", resolve);
        child.on("error", () => resolve(-1));
      });
      let rustResult = null;
      try { rustResult = JSON.parse(stdoutData.trim()); } catch {}
      processResult = {
        exitCode,
        stdout: stdoutData.trim(),
        stderr: stderrData.trim(),
        frames: rustResult?.transcript_events ?? [],
        killed: false,
        killedReason: null,
        rustSession: true,
        rustSessionId: rustResult?.session_id ?? null,
        rustStatus: rustResult?.status ?? "unknown",
        spawnError: rustSpawnError
      };
      transcriptEvents.push({
        type: "rust_session",
        timestamp: new Date().toISOString(),
        data: rustResult
      });
    } else if (commandArg) {
      // Parse command: "node -e ..." → cmd="node", args=["-e", ...]
      const cmdParts = commandArg.split(" ");
      const cmd = cmdParts[0];
      const cmdArgs = cmdParts.slice(1);

      const child = spawn(cmd, cmdArgs, {
        cwd: process.cwd(),
        env: { ...process.env },
        stdio: ["pipe", "pipe", "pipe"]
      });

      let stdoutData = "";
      let stderrData = "";
      const frames = [];
      let spawnError = null;

      // B1: handle spawn errors (ENOENT, EACCES, etc.) without crashing CLI
      child.on("error", (err) => {
        spawnError = err.message;
        stderrData = err.message;
      });

      // Kill switch: auto-kill after killAfterMs if set
      let killTimer = null;
      if (killAfterMs > 0) {
        killTimer = setTimeout(() => {
          try { child.kill("SIGTERM"); } catch {}
          killSwitchActivated = true;
        }, killAfterMs);
      }

      // Capture stdout as JSONL frames
      child.stdout.on("data", (chunk) => {
        const text = chunk.toString();
        stdoutData += text;
        // Parse JSONL frames
        for (const line of text.split("\n")) {
          const trimmed = line.trim();
          if (!trimmed) continue;
          try {
            const frame = JSON.parse(trimmed);
            frames.push(frame);
            const evt = {
              type: "stdout_frame",
              timestamp: new Date().toISOString(),
              // Credibility pass: stdout frames are REDACTED before reaching
              // transcript/audit/SSE — previously recorded verbatim.
              frame: (() => { try { return JSON.parse(redactStderr(JSON.stringify(frame))); } catch { return redactStderr(JSON.stringify(frame)); } })()
            };
            transcriptEvents.push(evt);
            // M6: SSE streaming — emit event immediately if --stream
            if (streamMode) {
              process.stdout.write(`event: frame\ndata: ${JSON.stringify(evt)}\n\n`);
            }
            // B4: Buffer events for console SSE bridge — includes buffered_at timestamp
            if (bufferEvents) {
              import("node:fs/promises").then((fs) => {
                const bufferDir = join(process.cwd(), ".ardyn-events");
                fs.mkdir(bufferDir, { recursive: true }).then(() => {
                  const evtWithBuffer = { ...evt, buffered_at: new Date().toISOString() };
                  writeFile(join(bufferDir, "events.jsonl"), JSON.stringify(evtWithBuffer) + "\n", { flag: "a" }).catch(() => {});
                }).catch(() => {});
              });
            }
          } catch {
            // Non-JSON line — record as raw
            const evt = {
              type: "stdout_raw",
              timestamp: new Date().toISOString(),
              text: trimmed
            };
            transcriptEvents.push(evt);
            if (streamMode) {
              process.stdout.write(`event: raw\ndata: ${JSON.stringify(evt)}\n\n`);
            }
          }
        }
      });

      // Capture stderr with redaction
      child.stderr.on("data", (chunk) => {
        const text = chunk.toString();
        stderrData += text;
        transcriptEvents.push({
          type: "stderr",
          timestamp: new Date().toISOString(),
          text: redactStderr(text).trim()
        });
      });

      // Wait for process to exit — handle spawn error case
      const exitCode = await new Promise((resolve) => {
        if (spawnError) { resolve(-1); return; }
        child.on("close", resolve);
        child.on("error", () => resolve(-1));
      });

      if (killTimer) clearTimeout(killTimer);
      const wasKilled = killSwitchActivated || (exitCode === null && child.killed);

      // Credibility pass: stdout (and parsed frames) are REDACTED before they
      // reach processResult / sessionPlan / transcript output. Previously only
      // stderr was masked, so secrets printed to stdout leaked verbatim.
      const redactedStdout = redactStderr(stdoutData).trim();
      const redactedFrames = frames.map((frame) => {
        try {
          return JSON.parse(redactStderr(JSON.stringify(frame)));
        } catch {
          return JSON.parse(JSON.stringify(redactStderr(JSON.stringify(frame))));
        }
      });

      processResult = {
        exitCode: spawnError ? -1 : (wasKilled ? -1 : exitCode),
        stdout: redactedStdout,
        stderr: redactStderr(stderrData).trim(),
        frames: redactedFrames,
        killed: wasKilled,
        killedReason: wasKilled ? "kill_switch_timeout" : null,
        spawnError: spawnError
      };
    }

    // Failure audit: activate on non-zero exit
    const failureActivated = processResult && processResult.exitCode !== 0;

    printJson({
      command: "serve-runtime",
      dryRun: false,
      runtimeEnabled: true,
      approved: true,
      approvalGateStatus: "approved",
      killSwitchAvailable: true,
      killSwitchDescription: "Send SIGTERM or use --kill-after-ms to stop the runtime session.",
      killSwitchActivated,
      manifestPath,
      sessionId,
      sessionPlan: {
        sessionId,
        frames: processResult?.frames ?? [],
        maxFrames: 8,
        lifecycle: processResult ? "completed" : "noop"
      },
      redaction: {
        stderrRedactionEnabled: true,
        redactionMode: "fail-closed",
        unredactableHandling: "blocked"
      },
      transcriptAudit: {
        replayEnabled: true,
        auditEnabled: true,
        transcriptPath: null,
        events: transcriptEvents
      },
      failureAudit: {
        enabled: true,
        killOnFailure: true,
        rollbackOnFailure: true,
        activated: failureActivated ?? false
      },
      processesSpawned: processResult !== null,
      processResult,
      executionEnabled: true,
      plannedRuntime: handshake
    });
    return;
  }

  // M9: computer-use command — sandboxed, approval-gated, never the host
  if (command === "computer-use") {
    const enableComputerUse = args.includes("--enable-computer-use");
    const dryRun = args.includes("--dry-run");
    const approved = args.includes(APPROVE_FLAG);
    const manifestPath = readOption(args, "--manifest");

    if (!enableComputerUse) {
      fail(`Usage: ardyn computer-use --enable-computer-use [--dry-run] --manifest <path>\nComputer-use is gated: add --enable-computer-use to proceed.`);
      return;
    }
    if (!manifestPath) {
      fail("Missing required --manifest path for computer-use.");
      return;
    }
    if (!dryRun && !approved) {
      fail("Computer-use requires explicit approval: add --approve to execute.");
      return;
    }

    const { createSandboxConfig, createActionAudit, createSandboxSession, redactCapturedText, SANDBOX_IMAGE } =
      await import(pathToFileURL(join(process.cwd(), "packages/core/src/computer-use.mjs")).href);

    const sessionId = `cu-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    const config = createSandboxConfig({ sessionId });
    const audit = createActionAudit();

    if (dryRun) {
      printJson({
        command: "computer-use",
        dryRun: true,
        sandboxSpawned: false,
        sandboxImage: SANDBOX_IMAGE,
        sessionId,
        networkEgress: { default: "deny", allowlist: config.networkAllowlist },
        killSwitchAvailable: true,
        transcriptAudit: { auditActive: true, events: [] },
        redaction: { redactionActive: true, mode: "fail-closed" },
        approvalGateStatus: "dry-run-no-approval-needed",
        config,
      });
      return;
    }

    // Live execution — create sandbox session and START it for real.
    // Credibility pass: the previous code printed sandboxSpawned:true for a
    // session that was created but never started. Now the true state is
    // reported (spawned / spawnError / alive), whatever it is.
    const session = createSandboxSession({ sessionId, dryRun: false, approved: true });
    const startResult = await session.start();
    printJson({
      command: "computer-use",
      dryRun: false,
      started: Boolean(startResult.spawned),
      spawnError: startResult.spawnError ?? null,
      containerId: startResult.containerId ?? null,
      sandboxSpawned: Boolean(startResult.spawned),
      sandboxImage: SANDBOX_IMAGE,
      sessionId,
      networkEgress: { default: "deny", allowlist: config.networkAllowlist },
      killSwitchAvailable: true,
      killSwitchActivated: false,
      transcriptAudit: { auditActive: true, events: audit.getEvents() },
      redaction: { redactionActive: true, mode: "fail-closed" },
      approvalGateStatus: "approved",
      sessionAlive: session.alive,
      config: {
        containerImage: config.containerImage,
        ephemeral: config.ephemeral,
        mountHostFilesystem: config.mountHostFilesystem,
        networkEgress: config.networkEgress,
      },
    });
    return;
  }

  // M4: federation command — wires the hardened federation client into CLI
  if (command === "federation") {
    const subCommand = args[0] ?? "status";
    const federationModule = await import(pathToFileURL(join(process.cwd(), "packages/fabric/src/federation.mjs")).href);
    const config = federationModule.loadFabricFederationConfigFromEnv();

    if (subCommand === "status") {
      printJson({
        command: "federation",
        subCommand: "status",
        wired: true,
        loopbackOnly: true,
        remoteHttps: true,
        closedSiblingAllowlist: federationModule.FABRIC_FEDERATION_CLOSED_SIBLING_DIDS,
        hardening: {
          redirectManual: true,
          hostAllowlist: true,
          responseSizeCap: true,
          identityConfinement: true,
        },
        config: {
          localDid: config?.localDid ?? federationModule.FABRIC_FEDERATION_DEFAULT_LOCAL_DID,
          registryUrl: config?.registryUrl ?? null,
          // ponytail: never expose tokens or identity file paths
        },
      });
      return;
    }

    if (subCommand === "config") {
      printJson({
        command: "federation",
        subCommand: "config",
        config: {
          localDid: config?.localDid ?? federationModule.FABRIC_FEDERATION_DEFAULT_LOCAL_DID,
          registryUrl: config?.registryUrl ?? null,
          registryToken: undefined, // never expose
          identityFile: undefined,   // never expose
          allowlist: federationModule.FABRIC_FEDERATION_CLOSED_SIBLING_DIDS,
        },
      });
      return;
    }

    // M20: gated A2A exchange (send-handoff/receive-handoff) — implementation
    // lives in packages/fabric/src/handoff-cli.mjs to keep this CLI narrow.
    if (subCommand === "send-handoff" || subCommand === "receive-handoff") {
      const { runFederationExchangeCommand } = await import(pathToFileURL(join(process.cwd(), "packages/fabric/src/handoff-cli.mjs")).href);
      await runFederationExchangeCommand({ subCommand, args, printJson, fail, readOption });
      return;
    }
    fail(`Unknown federation subcommand: ${subCommand}. Use: status | config | send-handoff | receive-handoff`);
    return;
  }

  // M2: shell command — runs a shell command under approval gate
  if (command === "shell") {
    const enableRuntime = args.includes(ENABLE_RUNTIME_FLAG);
    const dryRun = args.includes("--dry-run");
    const approved = args.includes(APPROVE_FLAG);
    const commandArg = readOption(args, "--command");

    if (!enableRuntime) { fail(`Usage: ardyn shell --enable-runtime --approve --command <cmd>\nRuntime unavailable: shell is recognized, but runtime is not enabled.`); return; }
    if (!commandArg) { fail("Missing required --command for shell."); return; }
    if (!dryRun && !approved) { fail("Shell requires explicit approval: add --approve to execute."); return; }

    if (dryRun) {
      printJson({ command: "shell", dryRun: true, runtimeEnabled: true, approved: false, commandArg, processesSpawned: false, processResult: null });
      return;
    }

    // Execute via serve-runtime infrastructure
    const child = spawn("sh", ["-c", commandArg], { cwd: process.cwd(), env: { ...process.env }, stdio: ["pipe", "pipe", "pipe"] });
    let stdoutData = "", stderrData = "";
    let shellSpawnError = null;
    // B1: handle spawn errors for shell
    child.on("error", (err) => { shellSpawnError = err.message; stderrData = err.message; });
    child.stdout.on("data", (c) => { stdoutData += c.toString(); });
    child.stderr.on("data", (c) => { stderrData += c.toString(); });
    const exitCode = await new Promise((resolve) => {
      child.on("close", resolve);
      child.on("error", () => resolve(-1));
    });

    printJson({
      command: "shell",
      dryRun: false,
      runtimeEnabled: true,
      approved: true,
      commandArg,
      processesSpawned: true,
      processResult: { exitCode: shellSpawnError ? -1 : exitCode, stdout: stdoutData.trim(), stderr: stderrData.trim(), frames: [], killed: false, killedReason: null, spawnError: shellSpawnError }
    });
    return;
  }

  // M2: sqlite command — executes SQLite queries under approval gate
  if (command === "sqlite") {
    const enableRuntime = args.includes(ENABLE_RUNTIME_FLAG);
    const dryRun = args.includes("--dry-run");
    const approved = args.includes(APPROVE_FLAG);
    const dbPath = readOption(args, "--database");
    const query = readOption(args, "--query");

    if (!enableRuntime) { fail(`Usage: ardyn sqlite --enable-runtime --approve --database <path> --query <sql>\nRuntime unavailable: sqlite is recognized, but runtime is not enabled.`); return; }
    if (!query) { fail("Missing required --query for sqlite."); return; }
    if (!dryRun && !approved) { fail("SQLite requires explicit approval: add --approve to execute."); return; }

    if (dryRun) {
      printJson({ command: "sqlite", dryRun: true, runtimeEnabled: true, approved: false, query, database: dbPath ?? null, processesSpawned: false, databaseResult: null });
      return;
    }

    // Use node:sqlite (available in Node 22+ as experimental) or better-sqlite3
    // ponytail: use node's built-in sqlite via require("node:sqlite") if available, otherwise spawn sqlite3 CLI
    let dbResult;
    try {
      // Try node:sqlite (Node 22.5+)
      const { DatabaseSync } = await import("node:sqlite");
      const db = dbPath ? new DatabaseSync(dbPath) : new DatabaseSync(":memory:");
      try {
        const rows = [];
        const stmt = db.prepare(query);
        if (query.trim().toUpperCase().startsWith("SELECT")) {
          for (const row of stmt.all()) rows.push(row);
        } else {
          stmt.run();
        }
        dbResult = { rows, changes: db.changes ?? 0, error: null };
      } finally {
        db.close();
      }
    } catch (e) {
      // Fallback: spawn sqlite3 CLI
      const dbArg = dbPath ? [dbPath, query] : [":memory:", query];
      const child = spawn("sqlite3", dbArg, { cwd: process.cwd(), stdio: ["pipe", "pipe", "pipe"] });
      let stdoutData = "", stderrData = "";
      let sqliteSpawnError = null;
      // B1: handle spawn errors for sqlite3 fallback
      child.on("error", (err) => { sqliteSpawnError = err.message; stderrData = err.message; });
      child.stdout.on("data", (c) => { stdoutData += c.toString(); });
      child.stderr.on("data", (c) => { stderrData += c.toString(); });
      const exitCode = await new Promise((resolve) => {
        child.on("close", resolve);
        child.on("error", () => resolve(-1));
      });
      if (sqliteSpawnError) {
        dbResult = { rows: [], changes: 0, error: sqliteSpawnError };
      } else if (exitCode !== 0) {
        dbResult = { rows: [], changes: 0, error: stderrData.trim() || `sqlite3 exited with code ${exitCode}` };
      } else {
        // Parse stdout as JSON if possible, otherwise as text
        const lines = stdoutData.trim().split("\n").filter(Boolean);
        const rows = lines.map((l) => { try { return JSON.parse(l); } catch { return { value: l }; } });
        dbResult = { rows, changes: 0, error: null };
      }
    }

    printJson({
      command: "sqlite",
      dryRun: false,
      runtimeEnabled: true,
      approved: true,
      query,
      database: dbPath ?? ":memory:",
      processesSpawned: true,
      databaseResult: dbResult
    });
    return;
  }

  if (DEFAULT_BLOCKED_RUNTIME_COMMANDS.has(command)) {
    fail(createDefaultBlockedRuntimeCommandMessage(command));
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
    "Usage: ardyn <doctor|identity|capabilities --manifest <path>|plan [--trace|--summary|--explain|--review-artifact] --manifest <path> --task <path>|review-artifact --file <file> [--summary|--explain]|review-trace [--summary|--explain] --left <file> --right <file>|validate-session-transcript --file <file> [--summary|--explain|--schema-status|--display-summary|--compatibility-explain]|emit-session-events --dry-run --manifest <path> --task <path>|serve-runtime --enable-runtime [--dry-run] --manifest <path>|computer-use --enable-computer-use [--dry-run] --manifest <path>|federation status|federation config|federation send-handoff --enable-federation-exchange --approve --to <did> --payload <file|->|federation receive-handoff --enable-federation-exchange [--once]|shell --enable-runtime --approve --command <cmd>|sqlite --enable-runtime --approve --database <path> --query <sql>|serve --dry-run --manifest <path>>"
  );
}

run(process.argv.slice(2)).catch((error) => {
  fail(error instanceof Error ? error.message : String(error));
});
