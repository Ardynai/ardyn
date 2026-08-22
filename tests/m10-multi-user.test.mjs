// M10: Multi-user support — per-user isolation tests
import assert from "node:assert/strict";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { makeTempSqliteDb } from "./helpers/sqlite-temp.mjs";
import {
  createMultiUserDatabase,
  createUser,
  authenticateUser,
  createSession,
  getSession,
  listUserSessions,
  checkUserPermission,
  grantUserPermission,
  createComputerUseSandbox,
  getSandbox,
  listUserSandboxes,
} from "../packages/core/src/multi-user.mjs";

async function makeDb() {
  // Unique temp dir per call; cleanup() closes the DB handle BEFORE removing
  // the dir (with retries) — see tests/helpers/sqlite-temp.mjs for the
  // Windows EBUSY root-cause explanation. Assertions are unchanged.
  return makeTempSqliteDb(createMultiUserDatabase);
}

// ── User accounts ──

test("M10: createUser creates a user with deny-by-default permissions", async () => {
  const { db, cleanup } = await makeDb();
  try {
    const user = createUser(db, { username: "alice", passwordHash: "hash-alice" });
    assert.ok(user.id, "user must have an id");
    assert.equal(user.username, "alice");
    // No permissions by default
    assert.equal(checkUserPermission(db, user.id, "runtime.execute"), false);
    assert.equal(checkUserPermission(db, user.id, "computer_use.run"), false);
  } finally { await cleanup(); }
});

test("M10: authenticateUser succeeds with correct credentials, fails with wrong", async () => {
  const { db, cleanup } = await makeDb();
  try {
    createUser(db, { username: "bob", passwordHash: "hash-bob" });
    const ok = authenticateUser(db, "bob", "hash-bob");
    assert.ok(ok, "correct credentials should authenticate");
    const bad = authenticateUser(db, "bob", "wrong-hash");
    assert.equal(bad, null, "wrong credentials should fail");
    const unknown = authenticateUser(db, "eve", "anything");
    assert.equal(unknown, null, "unknown user should fail");
  } finally { await cleanup(); }
});

// ── Per-user session isolation ──

test("M10: user A cannot see user B's sessions (CRITICAL isolation test)", async () => {
  const { db, cleanup } = await makeDb();
  try {
    const alice = createUser(db, { username: "alice", passwordHash: "hash-a" });
    const bob = createUser(db, { username: "bob", passwordHash: "hash-b" });

    const aliceSession = createSession(db, { userId: alice.id, manifestPath: "manifest.json" });
    const bobSession = createSession(db, { userId: bob.id, manifestPath: "manifest.json" });

    // Alice can see her own session
    const aliceSeesAlice = getSession(db, aliceSession.id, alice.id);
    assert.ok(aliceSeesAlice, "alice should see her own session");

    // Alice CANNOT see Bob's session
    const aliceSeesBob = getSession(db, bobSession.id, alice.id);
    assert.equal(aliceSeesBob, null, "alice must NOT see bob's session");

    // Bob CANNOT see Alice's session
    const bobSeesAlice = getSession(db, aliceSession.id, bob.id);
    assert.equal(bobSeesAlice, null, "bob must NOT see alice's session");

    // listUserSessions only returns the user's own sessions
    const aliceSessions = listUserSessions(db, alice.id);
    assert.equal(aliceSessions.length, 1);
    assert.equal(aliceSessions[0].id, aliceSession.id);

    const bobSessions = listUserSessions(db, bob.id);
    assert.equal(bobSessions.length, 1);
    assert.equal(bobSessions[0].id, bobSession.id);
  } finally { await cleanup(); }
});

// ── Per-user computer-use sandbox isolation ──

test("M10: user A cannot access user B's computer-use sandbox (CRITICAL isolation test)", async () => {
  const { db, cleanup } = await makeDb();
  try {
    const alice = createUser(db, { username: "alice", passwordHash: "hash-a" });
    const bob = createUser(db, { username: "bob", passwordHash: "hash-b" });

    const aliceSandbox = createComputerUseSandbox(db, {
      userId: alice.id,
      sessionId: "alice-session-1",
      containerId: "container-alice-1",
    });
    const bobSandbox = createComputerUseSandbox(db, {
      userId: bob.id,
      sessionId: "bob-session-1",
      containerId: "container-bob-1",
    });

    // Alice can access her own sandbox
    const aliceGetsOwn = getSandbox(db, aliceSandbox.id, alice.id);
    assert.ok(aliceGetsOwn, "alice should access her own sandbox");

    // Alice CANNOT access Bob's sandbox
    const aliceGetsBob = getSandbox(db, bobSandbox.id, alice.id);
    assert.equal(aliceGetsBob, null, "alice must NOT access bob's sandbox");

    // Bob CANNOT access Alice's sandbox
    const bobGetsAlice = getSandbox(db, aliceSandbox.id, bob.id);
    assert.equal(bobGetsAlice, null, "bob must NOT access alice's sandbox");

    // listUserSandboxes only returns the user's own sandboxes
    const aliceSandboxes = listUserSandboxes(db, alice.id);
    assert.equal(aliceSandboxes.length, 1);
    const bobSandboxes = listUserSandboxes(db, bob.id);
    assert.equal(bobSandboxes.length, 1);
  } finally { await cleanup(); }
});

// ── Per-user permissions ──

test("M10: per-user RBAC — grant to alice doesn't grant to bob", async () => {
  const { db, cleanup } = await makeDb();
  try {
    const alice = createUser(db, { username: "alice", passwordHash: "hash-a" });
    const bob = createUser(db, { username: "bob", passwordHash: "hash-b" });

    grantUserPermission(db, alice.id, "computer_use.run");
    assert.equal(checkUserPermission(db, alice.id, "computer_use.run"), true);
    assert.equal(checkUserPermission(db, bob.id, "computer_use.run"), false, "bob must not inherit alice's grant");
  } finally { await cleanup(); }
});

// ── Console auth fail-closed in production with per-user ──

test("M10: console auth fail-closed in production requires per-user auth", async () => {
  const { readFile } = await import("node:fs/promises");
  const { join } = await import("node:path");
  const { fileURLToPath } = await import("node:url");
  const authContent = await readFile(
    join(fileURLToPath(import.meta.url), "..", "..", "apps/console/src/lib/auth.js"),
    "utf8"
  );
  // Verify the auth module has production fail-closed logic
  assert.match(authContent, /production.*ARDYN_CONSOLE_API_KEY/i, "must fail closed in production");
  assert.match(authContent, /x-user-token/i, "must support per-user tokens");
});