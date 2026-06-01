#!/usr/bin/env node
import {
  createTaskPlan,
  createDoctorReport,
  loadManifest,
  loadTask,
  createStaticHandshakeFromPath,
  createStaticIdentity
} from "@ardyn/core";

function printJson(value) {
  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
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

const PLAN_OUTPUT_FLAGS = ["--trace", "--summary", "--explain"];

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

  return {
    command: "plan",
    ...plan
  };
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

    const manifestPath = readOption(args, "--manifest");
    const taskPath = readOption(args, "--task");

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

    printJson(createPlanOutput(plan, outputMode.mode));
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
    "Usage: ardyn <doctor|identity|capabilities --manifest <path>|plan [--trace|--summary|--explain] --manifest <path> --task <path>|serve --dry-run --manifest <path>>"
  );
}

run(process.argv.slice(2)).catch((error) => {
  fail(error instanceof Error ? error.message : String(error));
});
