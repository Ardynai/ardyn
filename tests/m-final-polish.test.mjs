// Tests for: Dockerfile, Vercel config, console auth, TypeScript types, SSE streaming
import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import test from "node:test";

const repoRoot = join(fileURLToPath(import.meta.url), "..", "..");
const execFileAsync = promisify(execFile);

test("Dockerfile exists and has multi-stage build", async () => {
  const content = await readFile(join(repoRoot, "Dockerfile"), "utf8");
  assert.match(content, /FROM node:22/);
  assert.match(content, /FROM.*AS production/);
  assert.match(content, /cargo build/);
  assert.match(content, /npm run build/);
});

test("Vercel config exists", async () => {
  const content = await readFile(join(repoRoot, "vercel.json"), "utf8");
  const config = JSON.parse(content);
  assert.equal(config.framework, "nextjs");
  assert.ok(config.buildCommand);
});

test("Console auth middleware exists with checkAuth", async () => {
  const content = await readFile(join(repoRoot, "apps/console/src/lib/auth.js"), "utf8");
  assert.match(content, /checkAuth/);
  assert.match(content, /ARDYN_CONSOLE_API_KEY/);
  assert.match(content, /401/);
});

test("Console health endpoint exists", async () => {
  const content = await readFile(join(repoRoot, "apps/console/src/app/api/health/route.js"), "utf8");
  assert.match(content, /healthy/);
});

test("Console SSE events endpoint exists", async () => {
  const content = await readFile(join(repoRoot, "apps/console/src/app/api/events/route.js"), "utf8");
  assert.match(content, /text\/event-stream/);
  assert.match(content, /ReadableStream/);
});

test("TypeScript types file exists with SDK interfaces", async () => {
  const content = await readFile(join(repoRoot, "packages/sdk/src/index.d.ts"), "utf8");
  assert.match(content, /ArdynManifest/);
  assert.match(content, /RuntimePlan/);
  assert.match(content, /SessionTraceProps/);
  assert.match(content, /ApprovalGateProps/);
  assert.match(content, /Permission/);
  assert.match(content, /Database/);
});

test("Core data-auth module exists", async () => {
  const content = await readFile(join(repoRoot, "packages/core/src/data-auth.mjs"), "utf8");
  assert.match(content, /createDatabase/);
  assert.match(content, /checkPermission/);
});

test("CLI serve-runtime --stream flag produces SSE output", async () => {
  const { stdout } = await execFileAsync("node", [
    "apps/cli/src/index.mjs",
    "serve-runtime",
    "--enable-runtime",
    "--approve",
    "--manifest", "examples/minimal-manifest/ardyn.manifest.json",
    "--command", "node -e process.stdout.write(JSON.stringify({event:'test'})+'\\n')",
    "--stream"
  ], { cwd: repoRoot, maxBuffer: 4 * 1024 * 1024 });
  // SSE output should contain event: frame lines
  assert.match(stdout, /event: frame/);
  assert.match(stdout, /data:.*event.*test/);
});

test("Rust session binary exists and is callable", async () => {
  const { stdout } = await execFileAsync("cargo", [
    "run", "--manifest-path", "crates/ardyn-host/Cargo.toml",
    "--bin", "session", "--", "--approved", "--max-frames", "2"
  ], { cwd: repoRoot, maxBuffer: 4 * 1024 * 1024 });
  const result = JSON.parse(stdout.trim());
  assert.equal(result.status, "approved_but_not_executed");
  assert.equal(result.approved, true);
});