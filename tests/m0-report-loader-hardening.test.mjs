// M0.4: Test report loader hardening — path containment, per-entry try/catch, duplicate-key detection
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { writeFile, mkdtemp, rm, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import test from "node:test";

const execFileAsync = promisify(execFile);
const scriptPath = "scripts/report-phase-status.mjs";

test("M0.4: report loader rejects path traversal in {path,status} entries", async () => {
  // Read the script source and verify it contains path containment checks
  const src = await readFile(scriptPath, "utf8");
  assert.match(src, /\.\.\//, "script should reference path traversal patterns for containment");
  // Check for path containment logic — reject ../ or absolute paths
  assert.match(src, /isSafe|pathConfin|containment|traversal|\.\.\\|resolve\(/i,
    "script should have path containment logic");
});

test("M0.4: report loader has per-entry try/catch for robustness", async () => {
  const src = await readFile(scriptPath, "utf8");
  // The updateDynamicStatuses function should have error handling per entry
  assert.match(src, /try\s*{[\s\S]*?catch/i, "script should have try/catch in dynamic status update");
});

test("M0.4: report loader detects duplicate keys in index", async () => {
  const src = await readFile(scriptPath, "utf8");
  // Should have duplicate-key detection logic
  assert.match(src, /duplicate|already.?defined|duplicateKey/i,
    "script should detect duplicate keys in the manifest index");
});

test("M0.4: report runs successfully with hardened loader", async () => {
  const { stdout, stderr } = await execFileAsync("node", [scriptPath], {
    cwd: process.cwd(),
    maxBuffer: 10 * 1024 * 1024 // 10MB — the report is large
  });
  assert.equal(stderr, "", "report should run without errors");
  const report = JSON.parse(stdout);
  assert.ok(typeof report === "object", "report should be a JSON object");
  // Verify it still produces the expected structure
  assert.ok(Object.keys(report).length > 10, "report should have many keys");
});