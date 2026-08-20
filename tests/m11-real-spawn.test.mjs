// M11-real: Real sandbox spawn — injectable, gated, killed, isolated
import assert from "node:assert/strict";
import test from "node:test";

// ── Injectable spawn: tests verify spawn IS called with correct args ──

test("M11-real: createSandboxSession calls spawnImpl on start (not dry-run)", async () => {
  const { default: cu } = await import("../packages/core/src/computer-use.mjs");
  let spawnCalls = [];
  const fakeSpawn = (cmd, args, opts) => {
    const call = { cmd, args, opts };
    spawnCalls.push(call);
    // Return a fake child process
    return {
      pid: 12345,
      on: (event, cb) => { if (event === "spawn") setTimeout(cb, 0); },
      kill: () => {},
      stdout: { on: () => {} },
      stderr: { on: () => {} },
    };
  };
  const session = cu.createSandboxSession({
    sessionId: "test-real-spawn",
    dryRun: false,
    approved: true,
    spawnImpl: fakeSpawn,
  });
  await session.start();
  assert.equal(spawnCalls.length, 1, "spawnImpl must be called exactly once on start");
  const call = spawnCalls[0];
  assert.equal(call.cmd, "docker", "must spawn docker");
  assert.ok(call.args.includes("run"), "must use docker run");
  assert.ok(call.args.includes("--rm"), "must have --rm for ephemeral");
  assert.ok(call.args.includes("--network"), "must restrict network");
  assert.ok(call.args.includes("--no-new-privileges"), "must drop privileges");
  assert.ok(call.args.includes("--cap-drop"), "must drop capabilities");
  assert.ok(call.args.includes("--read-only"), "must be read-only root");
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
      return { pid: 1, on: () => {}, kill: () => {} };
    }
    if (args && args[0] === "rm") {
      killCalls.push({ cmd, args });
      return { pid: 1, on: () => {}, kill: () => {} };
    }
    return { pid: 12345, on: (e, cb) => { if (e === "spawn") setTimeout(cb, 0); }, kill: () => {} };
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
      return { pid: 1, on: () => {}, kill: () => {} };
    }
    return { pid: 12345, on: (e, cb) => { if (e === "spawn") setTimeout(cb, 0); }, kill: () => {} };
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
  const fakeSpawn = (cmd, args, opts) => {
    const child = {
      pid: undefined,
      on: (event, cb) => {
        if (event === "error") setTimeout(() => cb(new Error("docker not found")), 0);
      },
      kill: () => {},
      stdout: { on: () => {} },
      stderr: { on: () => {} },
    };
    return child;
  };
  const session = cu.createSandboxSession({
    sessionId: "test-spawn-error",
    dryRun: false,
    approved: true,
    spawnImpl: fakeSpawn,
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
  const fakeSpawn = (cmd, args, opts) => {
    return { pid: 1, on: (e, cb) => { if (e === "spawn") setTimeout(cb, 0); }, kill: () => {}, stdout: { on: () => {} }, stderr: { on: () => {} } };
  };
  const session = cu.createSandboxSession({
    sessionId: "test-isolation",
    dryRun: false,
    approved: true,
    spawnImpl: fakeSpawn,
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
      return { pid: 1, on: (e, cb) => { if (e === "spawn") setTimeout(cb, 0); if (e === "close") setTimeout(() => cb(0), 0); }, kill: () => {}, stdout: { on: () => {}, destroy: () => {} }, stderr: { on: () => {}, destroy: () => {} } };
    }
    return { pid: 1, on: (e, cb) => { if (e === "spawn") setTimeout(cb, 0); }, kill: () => {}, stdout: { on: () => {} }, stderr: { on: () => {} } };
  };
  const session = cu.createSandboxSession({
    sessionId: "test-gateway-real",
    dryRun: false,
    approved: true,
    spawnImpl: fakeSpawn,
    policy: { deny: [{ action: "type", text: "rm -rf" }], allow: [{}] },
  });
  await session.start();
  // Allowed action
  const ok = await session.executeAction({ action: "screenshot" });
  assert.notEqual(ok.refused, true, "screenshot should be allowed");
  // Denied action
  const denied = await session.executeAction({ action: "type", text: "rm -rf /" });
  assert.equal(denied.refused, true, "rm -rf must be denied by gateway");
});