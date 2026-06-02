import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";

const execFileAsync = promisify(execFile);
const packageJsonUrl = new URL("../package.json", import.meta.url);
const reportScriptUrl = new URL("../scripts/report-phase-status.mjs", import.meta.url);
const repoRoot = fileURLToPath(new URL("..", import.meta.url));
const reportScriptPath = fileURLToPath(reportScriptUrl);

async function readJson(url) {
  return JSON.parse(await readFile(url, "utf8"));
}

async function runReport() {
  const { stdout, stderr } = await execFileAsync(process.execPath, [reportScriptPath], {
    cwd: repoRoot
  });

  assert.equal(stderr, "");
  return JSON.parse(stdout);
}

test("package exposes report:phase-status without replacing existing test scripts", async () => {
  const packageJson = await readJson(packageJsonUrl);

  assert.equal(packageJson.scripts.test, "node --test tests/*.test.mjs");
  assert.equal(packageJson.scripts["test:schemas"], "node --test tests/schema-validation.test.mjs");
  assert.equal(packageJson.scripts["report:phase-status"], "node scripts/report-phase-status.mjs");
});

test("phase status report is Phase 3.5 local metadata and does not claim to run checks", async () => {
  const report = await runReport();

  assert.equal(report.schemaVersion, "ardyn.phase-status-report.v1");
  assert.deepEqual(report.phase, {
    id: "3.5",
    name: "Review-trace CLI, trace-review fixtures, and export ergonomics",
    executionPosture: "non-executing"
  });
  assert.equal(report.reportMode, "local-summary-only");
  assert.equal(report.reportRunsChecks, false);
  assert.equal(report.externalCi.ran, false);
  assert.equal(report.externalCi.claimed, false);
  assert.match(report.externalCi.note, /does not query or imply external CI/i);
});

test("report lists configured checks and verification commands without running them", async () => {
  const report = await runReport();

  assert.deepEqual(report.configuredChecks, [
    {
      name: "test",
      command: "npm test",
      packageScript: "node --test tests/*.test.mjs",
      ranByReport: false
    },
    {
      name: "test:schemas",
      command: "npm run test:schemas",
      packageScript: "node --test tests/schema-validation.test.mjs",
      ranByReport: false
    },
    {
      name: "report:phase-status",
      command: "npm run report:phase-status",
      packageScript: "node scripts/report-phase-status.mjs",
      ranByReport: false
    }
  ]);

  assert.deepEqual(report.verificationCommands, [
    {
      command: "npm test",
      purpose: "Run the repository node:test suite.",
      ranByReport: false
    },
    {
      command: "cargo test --workspace",
      purpose: "Run Rust workspace tests.",
      ranByReport: false
    },
    {
      command: "cargo check --workspace",
      purpose: "Check Rust workspace compilation without producing binaries.",
      ranByReport: false
    },
    {
      command: "git diff --check",
      purpose: "Check the working diff for whitespace errors.",
      ranByReport: false
    },
    {
      command: "npm run report:phase-status",
      purpose: "Render this deterministic local Phase 3.5 status report.",
      ranByReport: false
    },
    {
      command: "node --test tests/report-phase-status.test.mjs",
      purpose: "Run focused tests for this local Phase 3.5 status report.",
      ranByReport: false
    },
    {
      command: "node --test tests/host-policy-preconditions.test.mjs",
      purpose: "Run focused documentation/report checks for host-policy preconditions.",
      ranByReport: false
    },
    {
      command: "node --test tests/core-phase3-5-trace-fixtures.test.mjs",
      purpose: "Run focused Phase 3.5 trace-review fixture tests.",
      ranByReport: false
    },
    {
      command: "node --test tests/cli-phase3.test.mjs",
      purpose: "Run focused CLI tests covering review-trace and review artifact export ergonomics.",
      ranByReport: false
    }
  ]);

  for (const command of report.verificationCommands) {
    assert.equal(command.ranByReport, false, `${command.command} should not be run by report`);
  }
});

test("report inventories Phase 3.5 review-trace commands and explicit-only output behavior", async () => {
  const report = await runReport();

  assert.deepEqual(report.phase35Inventory.reviewTraceCommands, [
    {
      command: "ardyn review-trace <left> <right>",
      mode: "default",
      writesFiles: false,
      summary: "Renders the non-executing trace review comparison in the default local review format."
    },
    {
      command: "ardyn review-trace --summary <left> <right>",
      mode: "summary",
      writesFiles: false,
      summary: "Renders a concise local summary of trace review changes."
    },
    {
      command: "ardyn review-trace --explain <left> <right>",
      mode: "explain",
      writesFiles: false,
      summary: "Renders reviewer-oriented local explanations for trace review changes."
    }
  ]);

  assert.deepEqual(report.phase35Inventory.exportErgonomics, {
    reportWritesFiles: false,
    reportOutputFileSupport: false,
    reviewTraceWritesFiles: false,
    reviewArtifactOutputCommand: "ardyn plan --review-artifact --output <file>",
    reviewArtifactOutputRequiresExplicitCliFlag: true,
    summary:
      "The report script is stdout-only local metadata; artifact file writes are only available through an explicit plan --review-artifact --output CLI request."
  });
});

test("report inventories Phase 3.5 trace-review fixtures, docs, and tests", async () => {
  const report = await runReport();

  assert.deepEqual(report.phase35Inventory.traceReviewFixtures, [
    {
      path: "tests/fixtures/trace-review/equal-left-approval-review-artifact.json",
      status: "present"
    },
    {
      path: "tests/fixtures/trace-review/equal-right-approval-review-artifact.json",
      status: "present"
    },
    {
      path: "tests/fixtures/trace-review/approval-status-changed-approval-review-artifact.json",
      status: "present"
    },
    {
      path: "tests/fixtures/trace-review/selected-capability-changed-approval-review-artifact.json",
      status: "present"
    },
    {
      path: "tests/fixtures/trace-review/unresolved-request-changed-approval-review-artifact.json",
      status: "present"
    },
    {
      path: "tests/fixtures/trace-review/invalid-review-artifact.json",
      status: "present"
    }
  ]);

  assert.deepEqual(
    report.phase35Inventory.docs.map(({ path, status }) => [path, status]),
    [
      ["README.md", "present"],
      ["apps/cli/README.md", "present"],
      ["docs/planner-policy-review.md", "present"],
      ["docs/planner-trace-review-workflow.md", "present"],
      ["docs/host-policy-preconditions.md", "present"],
      ["packages/core/README.md", "present"]
    ]
  );

  assert.deepEqual(
    report.phase35Inventory.tests.map(({ path, status }) => [path, status]),
    [
      ["tests/cli-phase3.test.mjs", "present"],
      ["tests/core-phase3-4-review-artifacts.test.mjs", "present"],
      ["tests/core-phase3-4-trace-comparison.test.mjs", "present"],
      ["tests/core-phase3-5-trace-fixtures.test.mjs", "present"],
      ["tests/report-phase-status.test.mjs", "present"],
      ["tests/host-policy-preconditions.test.mjs", "present"]
    ]
  );
});

test("safety posture keeps every execution, network, plugin, torrent, and runtime flag false", async () => {
  const report = await runReport();

  assert.equal(report.safetyPosture.nonExecuting, true);
  assert.equal(report.safetyPosture.noSecrets, true);
  assert.equal(report.safetyPosture.noNetwork, true);
  assert.equal(report.safetyPosture.noProcessSpawn, true);

  const falseFlags = {
    runtimeExecution: false,
    networkCalls: false,
    networkListeners: false,
    adapterConnections: false,
    mcpCalls: false,
    openClawCalls: false,
    pluginInstall: false,
    torrentDownload: false,
    codePackEnablement: false,
    autonomousLoops: false,
    contentFabricRuntimeBehavior: false,
    secretsUsed: false,
    processSpawning: false,
    externalCiRan: false
  };

  assert.deepEqual(report.safetyPosture.flags, falseFlags);
});

test("report script source does not import forbidden process, network, write, or runtime modules", async () => {
  const source = await readFile(reportScriptUrl, "utf8");
  const forbiddenPatterns = [
    /node:child_process/,
    /from\s+["']child_process["']/,
    /node:http/,
    /node:https/,
    /node:net/,
    /node:dgram/,
    /\bfetch\s*\(/,
    /\bWebSocket\b/,
    /\bspawn\s*\(/,
    /\bexec(File)?\s*\(/,
    /\bcreateServer\s*\(/,
    /\blisten\s*\(/,
    /\bwriteFile\s*\(/,
    /\bappendFile\s*\(/,
    /\bmkdir\s*\(/,
    /\brm\s*\(/,
    /\bunlink\s*\(/
  ];

  for (const pattern of forbiddenPatterns) {
    assert.doesNotMatch(source, pattern);
  }
});
