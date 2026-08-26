// M11-real: Real sandbox spawn — injectable, gated, killed, isolated
// U2 fix: spawnAndWait now resolves on process CLOSE (never the earlier
// "spawn" event), so the fixtures below emit realistic child-process lifetimes:
// stdout data → close(exitCode). start() must verify the docker run exit code
// and capture the REAL container id before reporting success.
import assert from "node:assert/strict";
import test from "node:test";

// ── Injectable spawn: tests verify spawn IS called with correct args ──

// Fake child whose lifetime matches real child_process semantics: data events,
// then exactly one terminal event (error OR close). Data is delivered via
// process.nextTick so it deterministically precedes the close timer under any
// scheduler (node:test included).
function fakeChild({ exitCode = 0, stdout = "", stderr = "", errorMessage = null } = {}) {
  return {
    pid: errorMessage ? undefined : 12345,
    on(event, cb) {
      if (event === "error" && errorMessage) process.nextTick(() => cb(new Error(errorMessage)));
      if (event === "close" && !errorMessage) process.nextTick(() => cb(exitCode));
    },
    kill: () => {},
    stdout: { on: (_ev, cb) => { if (stdout) process.nextTick(() => cb(Buffer.from(stdout))); } },
    stderr: { on: (_ev, cb) => { if (stderr) process.nextTick(() => cb(Buffer.from(stderr))); } },
  };
}

test("M11-real: createSandboxSession calls spawnImpl on start (not dry-run)", async () => {
  const { default: cu } = await import("../packages/core/src/computer-use.mjs");
  let spawnCalls = [];
  const fakeSpawn = (cmd, args, opts) => {
    const call = { cmd, args, opts };
    spawnCalls.push(call);
    return fakeChild({ stdout: "abc123containerid\n" });
  };
  const session = cu.createSandboxSession({
    sessionId: "test-real-spawn",
    dryRun: false,
    approved: true,
    spawnImpl: fakeSpawn,
  });
  const result = await session.start();
  assert.equal(spawnCalls.length, 1, "spawnImpl must be called exactly once on start");
  const call = spawnCalls[0];
  assert.equal(call.cmd, "docker", "must spawn docker");
  assert.ok(call.args.includes("run"), "must use docker run");
  assert.ok(call.args.includes("--rm"), "must have --rm for ephemeral");
  assert.ok(call.args.includes("--network"), "must restrict network");
  // U2: portable no-new-privileges form (--security-opt) works on legacy
  // engines and Docker 29+ alike, unlike the removed --no-new-privileges flag.
  assert.ok(call.args.includes("--security-opt"), "must drop privileges");
  assert.ok(call.args.includes("no-new-privileges"), "must drop privileges");
  assert.ok(call.args.includes("--cap-drop"), "must drop capabilities");
  assert.ok(call.args.includes("--read-only"), "must be read-only root");
  // U2 fix: success only after docker run exits 0 AND prints a container id.
  assert.equal(result.spawned, true);
  assert.equal(result.containerId, "abc123containerid", "must capture the REAL printed container id");
  assert.equal(session.containerId(), "abc123containerid");
});

test("M11-real: docker run failure (nonzero exit) reports honest spawnError", async () => {
  // U2 fix: a failed pull/bad flag can no longer masquerade as a live sandbox.
  const { default: cu } = await import("../packages/core/src/computer-use.mjs");
  const session = cu.createSandboxSession({
    sessionId: "test-run-failure",
    dryRun: false,
    approved: true,
    spawnImpl: () => fakeChild({ exitCode: 125, stderr: "Unable to find image ardyn-sandbox:22.04" }),
  });
  const result = await session.start();
  assert.equal(result.spawned, undefined, "failed run must not report spawned:true");
  assert.match(result.spawnError, /docker run failed \(exit 125\)/);
  assert.match(result.spawnError, /Unable to find image/);
  assert.equal(session.alive, false);
  const errEvent = session.audit.getEvents().find((e) => e.action === "spawn_error");
  assert.ok(errEvent, "run failure must be audited");
});

test("M11-real: createSandboxSession does NOT spawn without approval", async () => {
  const { default: cu } = await import("../packages/core/src/computer-use.mjs");
  let spawnCalled = false;
  const fakeSpawn = () => { spawnCalled = true; return { pid: 1, on: () => {}, kill: () => {} }; };
  const session = cu.createSandboxSession({
    sessionId: "test-no-approval",
    dryRun: false,
    approved: false,
    spawnImpl: fakeSpawn,
  });
  await session.start();
  assert.equal(spawnCalled, false, "must NOT spawn without approval");
  assert.equal(session.alive, false, "session must not be alive without approval");
});

test("M11-real: createSandboxSession does NOT spawn in dry-run", async () => {
  const { default: cu } = await import("../packages/core/src/computer-use.mjs");
  let spawnCalled = false;
  const fakeSpawn = () => { spawnCalled = true; return { pid: 1, on: () => {}, kill: () => {} }; };
  const session = cu.createSandboxSession({
    sessionId: "test-dry-run",
    dryRun: true,
    approved: true,
    spawnImpl: fakeSpawn,
  });
  await session.start();
  assert.equal(spawnCalled, false, "must NOT spawn in dry-run mode");
});

test("M11-real: kill switch calls spawnImpl to destroy container", async () => {
  const { default: cu } = await import("../packages/core/src/computer-use.mjs");
  let killCalls = [];
  const fakeSpawn = (cmd, args) => {
    if (args && args[0] === "kill") {
      killCalls.push({ cmd, args });
      return fakeChild({});
    }
    if (args && args[0] === "rm") {
      killCalls.push({ cmd, args });
      return fakeChild({});
    }
    return fakeChild({ stdout: "cid-test-kill\n" });
  };
  const session = cu.createSandboxSession({
    sessionId: "test-kill",
    dryRun: false,
    approved: true,
    spawnImpl: fakeSpawn,
  });
  await session.start();
  assert.equal(session.alive, true, "session must be alive after start");
  session.kill();
  assert.equal(session.alive, false, "session must be dead after kill");
  assert.equal(session.killedReason, "kill_switch");
  // Verify docker kill was called
  const killCmd = killCalls.find(c => c.args[0] === "kill");
  assert.ok(killCmd, "must call docker kill on kill switch");
});

test("M11-real: end() calls spawnImpl to remove container", async () => {
  const { default: cu } = await import("../packages/core/src/computer-use.mjs");
  let rmCalls = [];
  const fakeSpawn = (cmd, args) => {
    if (args && args[0] === "rm") {
      rmCalls.push({ cmd, args });
      return fakeChild({});
    }
    return fakeChild({ stdout: "cid-test-end\n" });
  };
  const session = cu.createSandboxSession({
    sessionId: "test-end",
    dryRun: false,
    approved: true,
    spawnImpl: fakeSpawn,
  });
  await session.start();
  session.end();
  assert.equal(session.alive, false, "session must be dead after end");
  assert.equal(session.destroyReason, "session_end");
  const rmCmd = rmCalls.find(c => c.args[0] === "rm");
  assert.ok(rmCmd, "must call docker rm on session end");
});

test("M11-real: spawn error is caught and audited, not crashed", async () => {
  const { default: cu } = await import("../packages/core/src/computer-use.mjs");
  const session = cu.createSandboxSession({
    sessionId: "test-spawn-error",
    dryRun: false,
    approved: true,
    spawnImpl: () => fakeChild({ errorMessage: "docker not found" }),
  });
  const result = await session.start();
  assert.ok(result.spawnError, "must capture spawn error");
  assert.equal(session.alive, false, "session must not be alive after spawn error");
  assert.match(result.spawnError, /docker not found/i, "must capture the error message");
  // Verify error is audited
  const events = session.audit.getEvents();
  const errorEvent = events.find(e => e.action === "spawn_error");
  assert.ok(errorEvent, "spawn error must be audited");
});

test("M11-real: sandbox has per-session token and no host mounts", async () => {
  const { default: cu } = await import("../packages/core/src/computer-use.mjs");
  const session = cu.createSandboxSession({
    sessionId: "test-isolation",
    dryRun: false,
    approved: true,
    spawnImpl: () => fakeChild({ stdout: "cid-isolation\n" }),
  });
  await session.start();
  assert.ok(session.sessionToken, "must have per-session token");
  assert.ok(session.sessionToken.length >= 32, "token must be at least 32 chars");
  // Config must show no host access
  assert.equal(session.config.mountHostFilesystem, false);
  assert.equal(session.config.accessHostEnv, false);
  assert.equal(session.config.accessHostCredentials, false);
  assert.equal(session.config.networkEgress, "deny");
});

test("M11-real: executeAction routes through gateway even in real mode", async () => {
  const { default: cu } = await import("../packages/core/src/computer-use.mjs");
  const fakeSpawn = (cmd, args) => {
    if (args[0] === "exec") {
      return fakeChild({ stdout: "exec-ok-payload" });
    }
    return fakeChild({ stdout: "cid-gateway-real\n" });
  };
  const session = cu.createSandboxSession({
    sessionId: "test-gateway-real",
    dryRun: false,
    approved: true,
    spawnImpl: fakeSpawn,
    policy: { deny: [{ action: "type", text: "rm -rf" }], allow: [{}] },
  });
  await session.start();
  // Allowed action — U2 fix: exec result now carries the captured stdout.
  const ok = await session.executeAction({ action: "screenshot" });
  assert.notEqual(ok.refused, true, "screenshot should be allowed");
  assert.equal(ok.result, "exec-ok-payload", "action result must carry captured stdout (close-resolution)");
  // Denied action
  const denied = await session.executeAction({ action: "type", text: "rm -rf /" });
  assert.equal(denied.refused, true, "rm -rf must be denied by gateway");
});
