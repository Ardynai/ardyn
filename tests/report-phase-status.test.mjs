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

test("phase status report is deterministic JSON and does not claim to run checks", async () => {
  const report = await runReport();

  assert.equal(report.schemaVersion, "ardyn.phase-status-report.v1");
  assert.deepEqual(report.phase, {
    id: "3.4",
    name: "Approval review artifacts, host-policy preconditions, and reporting",
    executionPosture: "non-executing"
  });
  assert.equal(report.reportMode, "local-summary-only");
  assert.equal(report.reportRunsChecks, false);
  assert.equal(report.externalCi.ran, false);
  assert.equal(report.externalCi.claimed, false);
  assert.match(report.externalCi.note, /does not query or imply external CI/i);
});

test("report lists configured checks, verification commands, and planner review outputs", async () => {
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
      purpose: "Render this deterministic local phase status report.",
      ranByReport: false
    },
    {
      command: "node --test tests/report-phase-status.test.mjs",
      purpose: "Run focused tests for this local phase status report.",
      ranByReport: false
    },
    {
      command: "node --test tests/host-policy-preconditions.test.mjs",
      purpose: "Run focused documentation/report checks for host-policy preconditions.",
      ranByReport: false
    },
    {
      command: "node --test tests/core-phase3-4-review-artifacts.test.mjs tests/core-phase3-4-trace-comparison.test.mjs",
      purpose: "Run focused Phase 3.4 approval artifact and trace comparison tests.",
      ranByReport: false
    }
  ]);
  assert.deepEqual(report.plannerReviewOutputs, [
    {
      path: "docs/planner-policy-review.md",
      status: "present",
      summary: "Documents planning-only policy review boundaries and examples."
    },
    {
      path: "docs/planner-trace-review-workflow.md",
      status: "present",
      summary: "Documents the planner trace and approval artifact review workflow for Phase 3.4."
    },
    {
      path: "tests/core-phase3-1-planner-hardening.test.mjs",
      status: "present",
      summary: "Covers deterministic planner ranking, approval records, and safety flags."
    },
    {
      path: "tests/core-phase3-3-policy-fixtures.test.mjs",
      status: "present",
      summary: "Covers Phase 3.3 policy-review fixture behavior."
    }
  ]);
  for (const command of report.verificationCommands) {
    assert.equal(command.ranByReport, false, `${command.command} should not be run by report`);
  }
});

test("report inventories Phase 3.4 artifacts, docs, tests, and deferred review-trace CLI", async () => {
  const report = await runReport();

  assert.deepEqual(report.phase34Artifacts, [
    {
      api: "createApprovalReviewArtifact",
      cli: "ardyn plan --review-artifact",
      summary: "Creates a stable non-executing approval review artifact from a plan or planner trace."
    },
    {
      api: "validateApprovalReviewArtifact",
      summary: "Rejects artifacts that flip nonExecuting or any approval artifact safety flag away from the disabled posture."
    },
    {
      api: "compareApprovalReviewArtifacts",
      fixtures: [
        {
          path: "tests/fixtures/trace-comparison/left-approval-review-artifact.json",
          status: "present"
        },
        {
          path: "tests/fixtures/trace-comparison/right-approval-review-artifact.json",
          status: "present"
        }
      ],
      summary: "Compares stable approval review artifacts or planner traces without adding a review-trace CLI."
    }
  ]);

  assert.deepEqual(
    report.phase34Docs.map(({ path, status }) => [path, status]),
    [
      ["README.md", "present"],
      ["docs/planner-policy-review.md", "present"],
      ["docs/planner-trace-review-workflow.md", "present"],
      ["docs/host-policy-preconditions.md", "present"],
      ["packages/core/README.md", "present"]
    ]
  );

  assert.deepEqual(
    report.phase34Tests.map(({ path, status }) => [path, status]),
    [
      ["tests/core-phase3-4-review-artifacts.test.mjs", "present"],
      ["tests/core-phase3-4-trace-comparison.test.mjs", "present"],
      ["tests/report-phase-status.test.mjs", "present"],
      ["tests/host-policy-preconditions.test.mjs", "present"]
    ]
  );

  assert.deepEqual(report.nextReviewSurface, {
    reviewTraceCliPresent: false,
    note: "A dedicated review-trace CLI was intentionally not added in Phase 3.4; it remains a next reviewed surface."
  });
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

test("report script source does not import forbidden process, network, or runtime modules", async () => {
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
    /\blisten\s*\(/
  ];

  for (const pattern of forbiddenPatterns) {
    assert.doesNotMatch(source, pattern);
  }
});
