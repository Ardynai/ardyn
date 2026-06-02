import { constants } from "node:fs";
import { access, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("../", import.meta.url));

async function readJson(path) {
  return JSON.parse(await readFile(join(repoRoot, path), "utf8"));
}

async function localStatus(path) {
  try {
    await access(join(repoRoot, path), constants.R_OK);
    return "present";
  } catch {
    return "missing";
  }
}

function configuredCheck(packageJson, name, command) {
  return {
    name,
    command,
    packageScript: packageJson.scripts[name] ?? null,
    ranByReport: false
  };
}

const packageJson = await readJson("package.json");

const report = {
  schemaVersion: "ardyn.phase-status-report.v1",
  phase: {
    id: "3.4",
    name: "Approval review artifacts, host-policy preconditions, and reporting",
    executionPosture: "non-executing"
  },
  reportMode: "local-summary-only",
  reportRunsChecks: false,
  configuredChecks: [
    configuredCheck(packageJson, "test", "npm test"),
    configuredCheck(packageJson, "test:schemas", "npm run test:schemas"),
    configuredCheck(packageJson, "report:phase-status", "npm run report:phase-status")
  ],
  verificationCommands: [
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
  ],
  plannerReviewOutputs: [
    {
      path: "docs/planner-policy-review.md",
      status: await localStatus("docs/planner-policy-review.md"),
      summary: "Documents planning-only policy review boundaries and examples."
    },
    {
      path: "docs/planner-trace-review-workflow.md",
      status: await localStatus("docs/planner-trace-review-workflow.md"),
      summary: "Documents the planner trace and approval artifact review workflow for Phase 3.4."
    },
    {
      path: "tests/core-phase3-1-planner-hardening.test.mjs",
      status: await localStatus("tests/core-phase3-1-planner-hardening.test.mjs"),
      summary: "Covers deterministic planner ranking, approval records, and safety flags."
    },
    {
      path: "tests/core-phase3-3-policy-fixtures.test.mjs",
      status: await localStatus("tests/core-phase3-3-policy-fixtures.test.mjs"),
      summary: "Covers Phase 3.3 policy-review fixture behavior."
    }
  ],
  phase34Artifacts: [
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
          status: await localStatus("tests/fixtures/trace-comparison/left-approval-review-artifact.json")
        },
        {
          path: "tests/fixtures/trace-comparison/right-approval-review-artifact.json",
          status: await localStatus("tests/fixtures/trace-comparison/right-approval-review-artifact.json")
        }
      ],
      summary: "Compares stable approval review artifacts or planner traces without adding a review-trace CLI."
    }
  ],
  phase34Docs: [
    {
      path: "README.md",
      status: await localStatus("README.md"),
      summary: "Documents Phase 3.4 review artifact output, comparison fixtures/API, host-policy preconditions, and non-executing posture."
    },
    {
      path: "docs/planner-policy-review.md",
      status: await localStatus("docs/planner-policy-review.md"),
      summary: "Documents approval review artifact examples and Phase 3.4 policy boundaries."
    },
    {
      path: "docs/planner-trace-review-workflow.md",
      status: await localStatus("docs/planner-trace-review-workflow.md"),
      summary: "Documents reviewer workflow for planner traces, approval artifacts, and comparison fixtures."
    },
    {
      path: "docs/host-policy-preconditions.md",
      status: await localStatus("docs/host-policy-preconditions.md"),
      summary: "Documents future host-policy preconditions without active runtime enforcement."
    },
    {
      path: "packages/core/README.md",
      status: await localStatus("packages/core/README.md"),
      summary: "Documents core-package Phase 3.4 host-policy precondition posture."
    }
  ],
  phase34Tests: [
    {
      path: "tests/core-phase3-4-review-artifacts.test.mjs",
      status: await localStatus("tests/core-phase3-4-review-artifacts.test.mjs"),
      summary: "Pins stable approval review artifact fixtures and safety validation."
    },
    {
      path: "tests/core-phase3-4-trace-comparison.test.mjs",
      status: await localStatus("tests/core-phase3-4-trace-comparison.test.mjs"),
      summary: "Covers approval artifact comparison, planner-trace normalization, and unsafe artifact rejection."
    },
    {
      path: "tests/report-phase-status.test.mjs",
      status: await localStatus("tests/report-phase-status.test.mjs"),
      summary: "Covers the Phase 3.4 local-summary-only status report output."
    },
    {
      path: "tests/host-policy-preconditions.test.mjs",
      status: await localStatus("tests/host-policy-preconditions.test.mjs"),
      summary: "Covers host-policy precondition documentation and report inventory."
    }
  ],
  nextReviewSurface: {
    reviewTraceCliPresent: false,
    note: "A dedicated review-trace CLI was intentionally not added in Phase 3.4; it remains a next reviewed surface."
  },
  safetyPosture: {
    nonExecuting: true,
    noSecrets: true,
    noNetwork: true,
    noProcessSpawn: true,
    flags: {
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
    },
    note: "The report renders local metadata only; it does not execute checks or runtime behavior."
  },
  externalCi: {
    ran: false,
    claimed: false,
    note: "This local report does not query or imply external CI status."
  }
};

process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
