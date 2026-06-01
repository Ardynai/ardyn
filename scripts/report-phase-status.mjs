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
    id: "3.3",
    name: "Policy review CI/reporting",
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
      summary: "Documents the planner trace review workflow for Phase 3.3."
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
