// U2 integration proof: real sandbox lifecycle against the capable image.
// Skips automatically wherever Docker or the built image is unavailable
// (CI has no docker; build locally with:
//   docker build -t ardyn-sandbox:22.04 -f docker/sandbox.Dockerfile . )
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import test from "node:test";

const run = promisify(execFile);
const cu = await import("../packages/core/src/computer-use.mjs");

let dockerOk = false;
let imageOk = false;
try {
  await run("docker", ["info"], { timeout: 10_000 });
  dockerOk = true;
  await run("docker", ["image", "inspect", cu.SANDBOX_IMAGE], { timeout: 10_000 });
  imageOk = true;
} catch {}

test("U2-integration: governed sandbox spawns, executes a REAL screenshot, tears down", { skip: !dockerOk || !imageOk && "build ardyn-sandbox:22.04 first (see docker/sandbox.Dockerfile)" }, async () => {
  const session = cu.createSandboxSession({
    sessionId: `u2-integ-${Date.now()}`,
    dryRun: false,
    approved: true,
    policy: { allow: [{ action: "screenshot" }, { action: "wait", ms: 200 }] },
  });
  const start = await session.start();
  assert.equal(start.spawned, true, JSON.stringify(start));
  assert.match(String(start.containerId), /^[0-9a-f]{12,64}$/, "must capture the REAL hex container id");

  try {
    // Real Xvfb needs a moment to come up inside the container.
    await new Promise((r) => setTimeout(r, 1500));
    const shot = await session.executeAction({ action: "screenshot" });
    assert.notEqual(shot.refused, true, JSON.stringify(shot));
    assert.equal(shot.status, "executed");
    // A PNG screenshot begins with the base64 of \x89PNG: iVBORw0KGgo
    assert.match(shot.result, /^iVBORw0KGgo/, "screenshot must be a real PNG captured from Xvfb");
  } finally {
    session.end();
    // Give the fire-and-forget rm a beat, then verify the container is gone.
    await new Promise((r) => setTimeout(r, 800));
  }
  const ps = await run("docker", ["ps", "--filter", `name=ardyn-sandbox-${session.sessionId}`, "--format", "{{.ID}}"]);
  assert.equal(ps.stdout.trim(), "", "sandbox container must be removed after end()");
});
