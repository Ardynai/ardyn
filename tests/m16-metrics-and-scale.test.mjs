// M16: Production-ops posture — Prometheus /metrics + horizontal-scale correctness
import assert from "node:assert/strict";
import test from "node:test";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createMetricsRegistry, pseudonymizeUserId } from "../packages/core/src/metrics.mjs";
import { metrics } from "../packages/core/src/metrics.mjs";
import { createDatabase, createDbRateLimiter, grantPermission, checkPermission } from "../packages/core/src/data-auth.mjs";
import {
  createMultiUserDatabase,
  createUser,
  authenticateUser,
  createSession,
  getSession,
} from "../packages/core/src/multi-user.mjs";
import {
  createLoopStateDatabase,
  createGoal,
  createTodo,
  claimTodo,
  checkQuota,
  spendQuota,
} from "../packages/core/src/loop-state.mjs";

// ── Part A: metrics registry + Prometheus format ──

test("M16: registry renders valid Prometheus text format", () => {
  const r = createMetricsRegistry();
  r.describe("test_things_total", "Things done");
  r.counter("test_things_total", { outcome: "allowed" });
  r.counter("test_things_total", { outcome: "allowed" });
  r.counter("test_things_total", { outcome: "denied" });
  r.setGauge("test_depth", { kind: "a" }, 5);
  const out = r.render();
  assert.match(out, /^# HELP test_things_total Things done$/m);
  assert.match(out, /^# TYPE test_things_total counter$/m);
  assert.match(out, /^test_things_total\{outcome="allowed"\} 2$/m);
  assert.match(out, /^test_things_total\{outcome="denied"\} 1$/m);
  assert.match(out, /^# TYPE test_depth gauge$/m);
  assert.match(out, /^test_depth\{kind="a"\} 5$/m);
});

test("M16: computer-use actions counted as allowed/denied", async () => {
  const { default: cu } = await import("../packages/core/src/computer-use.mjs");
  const gateway = cu.createGateway({ policy: { deny: [{ action: "type", text: "rm -rf" }], allow: [{}] } });
  await gateway.evaluateAction({ action: "screenshot" });           // allowed
  await gateway.evaluateAction({ action: "type", text: "rm -rf /" }); // denied
  const out = metrics.render();
  assert.match(out, /ardyn_computer_use_actions_total\{outcome="allowed"\} \d+/);
  assert.match(out, /ardyn_computer_use_actions_total\{outcome="denied"\} \d+/);
});

test("M16: runtime sessions started/killed counted", async () => {
  const { default: cu } = await import("../packages/core/src/computer-use.mjs");
  const session = cu.createSandboxSession({ sessionId: "m16-metrics", dryRun: false, approved: true, spawnImpl: () => ({ pid: 1, on: (e, cb) => { if (e === "spawn") setTimeout(cb, 0); }, kill: () => {}, stdout: { on: () => {} }, stderr: { on: () => {} } }) });
  await session.start();
  session.kill();
  const out = metrics.render();
  assert.match(out, /ardyn_runtime_sessions_started_total \d+/);
  assert.match(out, /ardyn_runtime_sessions_killed_total \d+/);
});

test("M16: gateway messages counted per channel (platform label only)", async () => {
  const gw = await import("../packages/gateway/src/gateway.mjs");
  const chat = gw.createGateway({
    // Both channels explicitly configured — labels stay bounded by config.
    adapters: {
      telegram: new gw.TelegramAdapter({ botToken: "t" }),
      slack: new gw.SlackAdapter({ signingSecret: "s" }),
    },
  });
  chat.handleInbound({ platform: "telegram", platformUserId: "u1", body: "{}", signature: "bad" });
  chat.handleInbound({ platform: "slack", platformUserId: "u1", body: "{}", signature: "bad" });
  // STRONGER (credibility pass): unknown platforms must NOT mint metric series.
  chat.handleInbound({ platform: "junk-platform-xyz", platformUserId: "u1", body: "{}", signature: "bad" });
  const out = metrics.render();
  assert.match(out, /ardyn_gateway_messages_total\{platform="telegram"\} \d+/);
  assert.match(out, /ardyn_gateway_messages_total\{platform="slack"\} \d+/);
  assert.doesNotMatch(out, /junk-platform-xyz/, "unknown platform must not become a label");
});

test("M16: auth failures counted without username labels", async () => {
  const dir = await mkdtemp(join(tmpdir(), "ardyn-m16-auth-"));
  try {
    const db = await createMultiUserDatabase(join(dir, "auth.db"));
    createUser(db, { username: "alice-secret-name", passwordHash: "h" });
    const before = countSeries(metrics.render(), "ardyn_auth_failures_total");
    authenticateUser(db, "alice-secret-name", "WRONG");
    const out = metrics.render();
    assert.equal(countSeries(out, "ardyn_auth_failures_total"), before + 1, "failure must be counted");
    assert.doesNotMatch(out, /alice-secret-name/, "username must NEVER appear in metrics");
    db.close();
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("M16: active sessions gauge uses pseudonymous hashed user ids", async () => {
  const dir = await mkdtemp(join(tmpdir(), "ardyn-m16-gauge-"));
  try {
    const db = await createMultiUserDatabase(join(dir, "gauge.db"));
    const alice = createUser(db, { username: "alice", passwordHash: "h" });
    createSession(db, { userId: alice.id, manifestPath: "m.json" });
    createSession(db, { userId: alice.id, manifestPath: "m2.json" });
    const r = createMetricsRegistry();
    r.setActiveSessionProvider(() =>
      db.prepare("SELECT user_id AS userId, COUNT(*) AS count FROM user_sessions WHERE status = 'active' GROUP BY user_id").all()
    );
    const out = r.render();
    assert.match(out, /ardyn_active_user_sessions\{user="[0-9a-f]{12}"\} 2/u);
    assert.ok(out.includes(pseudonymizeUserId(alice.id)), "hashed id present");
    assert.doesNotMatch(out, new RegExp(alice.id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), "raw user id must NOT appear");
    db.close();
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

function countSeries(promText, exactSeriesName) {
  let total = 0;
  for (const line of promText.split("\n")) {
    if (line.startsWith(exactSeriesName)) total += Number(line.split(/\s+/).pop());
  }
  return total;
}

// Windows quirk: SQLite handles can lag release briefly after db.close() —
// retry the unlink instead of flaking. Temp dirs are OS-cleaned anyway.
async function rmRetry(dir, tries = 6) {
  for (let i = 0; i < tries; i++) {
    try {
      await rm(dir, { recursive: true, force: true });
      return;
    } catch (e) {
      if (e.code !== "EBUSY") throw e;
      await new Promise(r => setTimeout(r, 50));
    }
  }
}

// ── Part B: horizontal-scale correctness across TWO instances sharing one DB ──

function safeClose(db) {
  try { db?.close(); } catch {}
}

test("M16: two instances sharing one DB keep per-user isolation intact", async () => {
  const dir = await mkdtemp(join(tmpdir(), "ardyn-m16-scale-"));
  let instA, instB;
  try {
    const dbFile = join(dir, "shared.db");
    const seed = await createMultiUserDatabase(dbFile);
    const alice = createUser(seed, { username: "alice", passwordHash: "ha" });
    const bob = createUser(seed, { username: "bob", passwordHash: "hb" });
    safeClose(seed);

    // Two independent DatabaseSync connections = two simulated app instances.
    const { DatabaseSync } = await import("node:sqlite");
    instA = new DatabaseSync(dbFile);
    instB = new DatabaseSync(dbFile);
    // Instance A (acting for alice) creates a session
    const created = createSession(instA, { userId: alice.id, manifestPath: "m.json" });
    // Instance B must respect isolation: bob cannot read alice's session…
    assert.equal(getSession(instB, created.id, bob.id), null, "bob must NOT see alice's session via other instance");
    // …but alice can, through EITHER instance
    assert.ok(getSession(instB, created.id, alice.id), "alice reads her session via instance B");
    assert.ok(getSession(instA, created.id, alice.id), "alice reads her session via instance A");
  } finally {
    safeClose(instA);
    safeClose(instB);
    await rmRetry(dir);
  }
});

test("M16: permission grant is idempotent across instances — no double-grant rows", async () => {
  const dir = await mkdtemp(join(tmpdir(), "ardyn-m16-grant-"));
  let a, b;
  try {
    const dbFile = join(dir, "grants.db");
    const seed = await createDatabase(dbFile);
    safeClose(seed);
    const { DatabaseSync } = await import("node:sqlite");
    a = new DatabaseSync(dbFile);
    b = new DatabaseSync(dbFile);
    grantPermission(a, "admin", "runtime.execute");
    grantPermission(b, "admin", "runtime.execute"); // same grant from other instance
    grantPermission(a, "admin", "runtime.execute"); // and again
    const rows = b.prepare("SELECT * FROM permissions WHERE role='admin' AND capability='runtime.execute'").all();
    assert.equal(rows.length, 1, "UNIQUE(role,capability) forbids duplicate grants");
    assert.equal(checkPermission(b, "admin", "runtime.execute"), true, "grant visible cross-instance");
  } finally {
    safeClose(a);
    safeClose(b);
    await rmRetry(dir);
  }
});

test("M16: DB-backed rate limiter is correct ACROSS instances (in-memory one is documented as per-process)", async () => {
  const dir = await mkdtemp(join(tmpdir(), "ardyn-m16-ratelimit-"));
  let a, b;
  try {
    const dbFile = join(dir, "rl.db");
    const seed = await createDatabase(dbFile);
    safeClose(seed);
    const { DatabaseSync } = await import("node:sqlite");
    a = new DatabaseSync(dbFile);
    b = new DatabaseSync(dbFile);
    const limitA = createDbRateLimiter(a, { maxRequests: 3, windowMs: 60000 });
    const limitB = createDbRateLimiter(b, { maxRequests: 3, windowMs: 60000 });

    assert.equal(limitA("user-x"), true, "instance A: 1");
    assert.equal(limitA("user-x"), true, "instance A: 2");
    assert.equal(limitB("user-x"), true, "instance B: 3 — SHARED window, not reset by other process");
    assert.equal(limitB("user-x"), false, "instance B: 4th request denied — cross-instance counting works");

    // different key unaffected
    assert.equal(limitA("user-y"), true, "other key has its own bucket");
  } finally {
    safeClose(a);
    safeClose(b);
    await rmRetry(dir);
  }
});

test("M16: chat gateway accepts injected cross-instance rate limiter", async () => {
  const gw = await import("../packages/gateway/src/gateway.mjs");
  const calls = [];
  const chat = gw.createGateway({
    adapters: {},
    rateLimitPerUser: 1,
    rateLimiter: (userId, max) => {
      calls.push(userId);
      return calls.filter(u => u === userId).length <= max;
    },
  });
  assert.equal(chat.checkRateLimit("u9"), true);
  assert.equal(chat.checkRateLimit("u9"), false, "injected limiter enforces the cap");
  assert.deepEqual(calls, ["u9", "u9"], "custom limiter is consulted instead of the in-memory Map");
});

test("M16: loop-state todo cannot be double-claimed across instances", async () => {
  const dir = await mkdtemp(join(tmpdir(), "ardyn-m16-loop-"));
  let a, b;
  try {
    const dbFile = join(dir, "loop.db");
    const seed = await createLoopStateDatabase(dbFile);
    const goal = createGoal(seed, { title: "g" });
    const todo = createTodo(seed, { goalId: goal.id, title: "t" });
    safeClose(seed);

    const { DatabaseSync } = await import("node:sqlite");
    a = new DatabaseSync(dbFile);
    b = new DatabaseSync(dbFile);
    // Instance A claims first…
    const claimA = claimTodo(a, { todoId: todo.id, claimedBy: "instance-A-worker" });
    assert.equal(claimA.ok, true, "first claim wins");
    // …instance B tries to claim the SAME todo — must NOT steal or overwrite
    const claimB = claimTodo(b, { todoId: todo.id, claimedBy: "instance-B-worker" });
    assert.equal(claimB.ok, false, "second claim must be rejected");
    assert.equal(claimB.claimedBy, "instance-A-worker", "original claim preserved");
    const row = b.prepare("SELECT status, claimed_by FROM todos WHERE id = ?").get(todo.id);
    assert.equal(row.claimed_by, "instance-A-worker");
  } finally {
    safeClose(a);
    safeClose(b);
    await rmRetry(dir);
  }
});

test("M16: quota spend is atomic across instances — cap can never be exceeded", async () => {
  const dir = await mkdtemp(join(tmpdir(), "ardyn-m16-quota-"));
  let a, b;
  try {
    const dbFile = join(dir, "quota.db");
    const seed = await createLoopStateDatabase(dbFile);
    const goal = createGoal(seed, { title: "g" });
    // Initialize the quota row with an EXPLICIT cap of 3 (default would be 10)
    assert.equal(checkQuota(seed, { goalId: goal.id, maxRuns: 3 }), true);
    safeClose(seed);

    const { DatabaseSync } = await import("node:sqlite");
    a = new DatabaseSync(dbFile);
    b = new DatabaseSync(dbFile);
    let admitted = 0;
    // Two instances race to spend against max=3
    for (let i = 0; i < 5; i++) {
      if (spendQuota(a, { goalId: goal.id })) admitted++;
      if (spendQuota(b, { goalId: goal.id })) admitted++;
    }
    assert.equal(admitted, 3, "exactly max spends admitted across BOTH instances");
    assert.equal(checkQuota(b, { goalId: goal.id }), false, "cap exhausted cross-instance");
    const row = b.prepare("SELECT spent FROM quota WHERE goal_id = ?").get(goal.id);
    assert.equal(row.spent, 3, "spent never overshoots max");
  } finally {
    safeClose(a);
    safeClose(b);
    await rmRetry(dir);
  }
});
