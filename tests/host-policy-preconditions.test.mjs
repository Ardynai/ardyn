import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";

const execFileAsync = promisify(execFile);
const repoRoot = fileURLToPath(new URL("..", import.meta.url));
const hostPolicyDocUrl = new URL("../docs/host-policy-preconditions.md", import.meta.url);
const reportScriptPath = fileURLToPath(new URL("../scripts/report-phase-status.mjs", import.meta.url));

async function runReport() {
  const { stdout, stderr } = await execFileAsync(process.execPath, [reportScriptPath], {
    cwd: repoRoot
  });

  assert.equal(stderr, "");
  return JSON.parse(stdout);
}

test("host-policy preconditions doc keeps Phase 3.4 documentation-only posture", async () => {
  const source = await readFile(hostPolicyDocUrl, "utf8");

  assert.match(source, /documentation and contract requirements\s+only/i);
  assert.match(source, /not active runtime enforcement/i);
  assert.match(source, /runtimeEnforcementActive`:\s*false/i);
  assert.match(source, /report remains local-summary-only/i);

  for (const requiredPhrase of [
    "Explicit Approval",
    "Adapter Permission Declarations",
    "Code-Pack Sandbox And Quarantine",
    "Explicit Network And Process Permissions",
    "explicitApproval",
    "adapterPermissionDeclarations",
    "codePackSandboxAndQuarantine",
    "networkProcessPermissions"
  ]) {
    assert.match(source, new RegExp(requiredPhrase), `${requiredPhrase} should be documented`);
  }
});

test("host-policy preconditions doc lists forbidden behavior without requiring runtime enforcement", async () => {
  const source = await readFile(hostPolicyDocUrl, "utf8");

  for (const forbiddenBehavior of [
    "Runtime execution",
    "Network server or listener creation",
    "Adapter connections",
    "Real MCP calls",
    "Real OpenClaw calls",
    "Plugin install",
    "Torrent download",
    "Content Fabric runtime behavior",
    "Code-pack enablement",
    "Autonomous loops",
    "Process spawning outside tests",
    "Secrets access"
  ]) {
    assert.match(source, new RegExp(forbiddenBehavior), `${forbiddenBehavior} should remain forbidden`);
  }

  assert.doesNotMatch(source, /runtimeEnforcementActive`:\s*true/i);
});

test("phase status report inventories host-policy docs and tests as local evidence only", async () => {
  const report = await runReport();

  assert.equal(report.reportMode, "local-summary-only");
  assert.equal(report.reportRunsChecks, false);
  assert.equal(report.safetyPosture.flags.processSpawning, false);
  assert.equal(report.safetyPosture.flags.networkCalls, false);

  assert.deepEqual(
    report.phase34Docs.find((entry) => entry.path === "docs/host-policy-preconditions.md"),
    {
      path: "docs/host-policy-preconditions.md",
      status: "present",
      summary: "Documents future host-policy preconditions without active runtime enforcement."
    }
  );
  assert.deepEqual(
    report.phase34Tests.find((entry) => entry.path === "tests/host-policy-preconditions.test.mjs"),
    {
      path: "tests/host-policy-preconditions.test.mjs",
      status: "present",
      summary: "Covers host-policy precondition documentation and report inventory."
    }
  );
});
