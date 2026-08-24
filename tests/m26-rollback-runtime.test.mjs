// Part 2 — Rollback AUTO-INVOCATION inside the gated runtime:
// real multi-step `serve-runtime --steps` sequences with compensations.
// Windows-safe: step commands are small node scripts written to a temp dir.
import assert from "node:assert/strict";
import test from "node:test";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { mkdtemp, rm, writeFile, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const runCliCapture = async (args) => {
  try {
    const { stdout, stderr } = await promisify(execFile)("node", args, { cwd: process.cwd(), maxBuffer: 4 * 1024 * 1024 });
    return { code: 0, stdout, stderr };
  } catch (error) {
    return { code: error.code ?? 1, stdout: error.stdout ?? "", stderr: error.stderr ?? String(error) };
  }
};

const manifest = "examples/minimal-manifest/ardyn.manifest.json";

async function setup() {
  const dir = await mkdtemp(join(tmpdir(), "ardyn-p2b-"));
  // state file touched by step 1; removed by its compensation
  const stateFile = join(dir, "state-marker.txt");
  const createScript = join(dir, "create.js");
  const removeScript = join(dir, "remove.js");
  const boomScript = join(dir, "boom.js");
  await writeFile(createScript, `require('fs').writeFileSync(${JSON.stringify(stateFile)}, 'deployed'); process.exit(0);`);
  await writeFile(removeScript, `try { require('fs').unlinkSync(${JSON.stringify(stateFile)}); } catch {} process.exit(0);`);
  await writeFile(boomScript, `process.stderr.write('deploy exploded\\n'); process.exit(3);`);
  return { dir, stateFile, createScript, removeScript, boomScript };
}

test("P2B: mid-sequence failure auto-compensates in reverse → last known-good state", async () => {
  const s = await setup();
  try {
    const stepsPath = join(s.dir, "steps.json");
    await writeFile(stepsPath, JSON.stringify({ steps: [
      { label: "create marker", command: `node ${JSON.stringify(s.createScript)}`, compensateCommand: `node ${JSON.stringify(s.removeScript)}` },
      { label: "explode", command: `node ${JSON.stringify(s.boomScript)}` },
    ]}));

    const result = await runCliCapture([
      "apps/cli/src/index.mjs", "serve-runtime",
      "--enable-runtime", "--approve",
      "--manifest", manifest,
      "--steps", stepsPath,
    ]);
    const output = JSON.parse(result.stdout);

    assert.equal(output.multiStep, true);
    assert.equal(output.ok, false, "sequence must report failure");
    assert.equal(output.failedAt, 1, "failure at step index 1");
    assert.equal(output.rolledBackToKnownGood, true, "compensation restored known-good");
    assert.equal(output.partialState, false);

    // REAL behavioral check: the created marker is GONE (compensation ran).
    let exists = true;
    try { await readFile(s.stateFile); } catch { exists = false; }
    assert.equal(exists, false, "compensation must have removed the created file");

    // every step audited
    const actions = output.audit.map((e) => e.action);
    assert.ok(actions.includes("step_ok"), "step 1 audited ok");
    assert.ok(actions.includes("step_failed"), "step 2 audited failed");
    assert.ok(actions.includes("rollback_step"), "rollback audited");
    assert.equal(result.code, 1, "nonzero exit on rolled-back failure");
  } finally {
    await rm(s.dir, { recursive: true, force: true });
  }
});

test("P2B: missing compensation FAILS CLOSED (partialState + rollback_failed)", async () => {
  const s = await setup();
  try {
    const stepsPath = join(s.dir, "steps.json");
    await writeFile(stepsPath, JSON.stringify({ steps: [
      { label: "create marker WITHOUT compensation", command: `node ${JSON.stringify(s.createScript)}` },
      { label: "explode", command: `node ${JSON.stringify(s.boomScript)}` },
    ]}));

    const result = await runCliCapture([
      "apps/cli/src/index.mjs", "serve-runtime",
      "--enable-runtime", "--approve",
      "--manifest", manifest,
      "--steps", stepsPath,
    ]);
    const output = JSON.parse(result.stdout);
    assert.equal(output.partialState, true, "fail-closed: partial state admitted loudly");
    assert.equal(output.rolledBackToKnownGood ?? false, false);
    const rbFail = output.audit.find((e) => e.action === "rollback_failed");
    assert.ok(rbFail, "rollback_failed must be audited");
    assert.match(rbFail.reason, /missing_compensation/);
    let exists = true;
    try { await readFile(s.stateFile); } catch { exists = false; }
    assert.equal(exists, true, "marker honestly left in place (no silent undo)");
  } finally {
    await rm(s.dir, { recursive: true, force: true });
  }
});

test("P2B: whole path refuses without --approve", async () => {
  const s = await setup();
  try {
    const stepsPath = join(s.dir, "steps.json");
    await writeFile(stepsPath, JSON.stringify({ steps: [
      { label: "x", command: `node ${JSON.stringify(s.createScript)}` },
    ]}));
    const result = await runCliCapture([
      "apps/cli/src/index.mjs", "serve-runtime",
      "--enable-runtime",
      "--manifest", manifest,
      "--steps", stepsPath,
    ]);
    assert.equal(result.code, 1);
    assert.doesNotMatch(result.stdout + result.stderr, /"multiStep": true/, "must not execute without approval");
    let exists = false;
    try { await readFile(s.stateFile); exists = true; } catch {}
    assert.equal(exists, false, "nothing ran");
  } finally {
    await rm(s.dir, { recursive: true, force: true });
  }
});
