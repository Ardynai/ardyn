// M5: Consumer packages & SDK — tests
import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const repoRoot = fileURLToPath(new URL("../", import.meta.url));

test("M5: SDK package has real source code", async () => {
  const sdkPath = join(repoRoot, "packages/sdk/src/index.mjs");
  const content = await readFile(sdkPath, "utf8");
  assert.ok(content.length > 100, "SDK should have substantial source");
  assert.match(content, /export/, "SDK should export functions");
});

test("M5: SDK exports loadManifest, createPlan, validateTranscript, getVersion", async () => {
  const sdk = await import("../packages/sdk/src/index.mjs");
  assert.equal(typeof sdk.loadManifest, "function");
  assert.equal(typeof sdk.createPlan, "function");
  assert.equal(typeof sdk.validateTranscript, "function");
  assert.equal(typeof sdk.getVersion, "function");
  assert.equal(sdk.getVersion(), "0.1.0");
});

test("M5: SDK createPlan produces valid plan", async () => {
  const sdk = await import("../packages/sdk/src/index.mjs");
  const plan = sdk.createPlan(
    { id: "test-manifest", schema: "ardyn.manifest" },
    { id: "test-task", objective: "Test", mode: "plan", requestedCapabilities: ["test.cap"] }
  );
  assert.equal(plan.schema, "ardyn.session-plan");
  assert.equal(plan.manifestId, "test-manifest");
  assert.equal(plan.taskId, "test-task");
  assert.equal(plan.mode, "plan");
});

test("M5: SDK validateTranscript rejects invalid input", async () => {
  const sdk = await import("../packages/sdk/src/index.mjs");
  assert.equal(sdk.validateTranscript(null).valid, false);
  assert.equal(sdk.validateTranscript({}).valid, false);
  assert.equal(sdk.validateTranscript({ schema: "wrong", events: [] }).valid, false);
  assert.equal(sdk.validateTranscript({ schema: "ardyn.session-transcript", events: [] }).valid, true);
});

test("M5: contracts registry exists with schema entries", async () => {
  const registry = JSON.parse(
    await readFile(join(repoRoot, "packages/sdk/contracts/registry.json"), "utf8")
  );
  assert.equal(registry.schema, "ardyn.contracts.registry");
  assert.ok(registry.contracts.length >= 5, "should have at least 5 contracts");
  const names = registry.contracts.map(c => c.name);
  assert.ok(names.includes("ardyn.manifest"));
  assert.ok(names.includes("ardyn.session-transcript"));
  assert.ok(names.includes("ardyn.boundary-map"));
});

test("M5: SDK package.json is valid", async () => {
  const pkg = JSON.parse(await readFile(join(repoRoot, "packages/sdk/package.json"), "utf8"));
  assert.equal(pkg.name, "@ardyn/sdk");
  assert.equal(pkg.version, "0.1.0");
  assert.equal(pkg.type, "module");
  assert.ok(pkg.exports, "should have exports field");
});