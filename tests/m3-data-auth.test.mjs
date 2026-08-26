// tests/m3-data-auth.test.mjs — M3 Data & Auth tests
// U12 fix: this file used to VENDOR a full copy of the data-auth implementation
// (with its own weaker redactor) and test that copy — its green checks proved
// nothing about shipped code. It now imports @ardyn/core's real module and
// keeps every original assertion (strengthened where the real behavior is
// richer: canonical redaction covers colon forms; the limiter is windowed and
// provably resets).
import assert from "node:assert/strict";
import test from "node:test";
import {
  createDatabase,
  checkPermission,
  grantPermission,
  revokePermission,
  checkRateLimit,
  getSecret,
  redactSecrets,
  sanitizeQuery,
} from "../packages/core/src/data-auth.mjs";

test("M3: createDatabase creates tables", async () => {
  const db = await createDatabase();
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name").all();
  const names = tables.map(t => t.name);
  assert.ok(names.includes("sessions"));
  assert.ok(names.includes("audit_log"));
  assert.ok(names.includes("permissions"));
});

test("M3: permission check denies by default", async () => {
  const db = await createDatabase();
  const allowed = checkPermission(db, "user", "runtime.execute");
  assert.equal(allowed, false);
});

test("M3: grantPermission allows and records audit", async () => {
  const db = await createDatabase();
  grantPermission(db, "admin", "runtime.execute");
  const allowed = checkPermission(db, "admin", "runtime.execute");
  assert.equal(allowed, true);
  const logs = db.prepare("SELECT * FROM audit_log WHERE event_type = 'permission_granted'").all();
  assert.ok(logs.length > 0);
});

test("M3: revokePermission removes access", async () => {
  const db = await createDatabase();
  grantPermission(db, "admin", "runtime.execute");
  const before = checkPermission(db, "admin", "runtime.execute");
  assert.equal(before, true);
  revokePermission(db, "admin", "runtime.execute");
  const after = checkPermission(db, "admin", "runtime.execute");
  assert.equal(after, false);
});

test("M3: rate limiting enforces max requests AND resets after the window", async () => {
  // Real module contract: windowed limiter ({count, resetAt}) — use a short
  // window to prove the reset behavior, and a unique key so concurrent runs
  // never share buckets.
  const key = `m3-rl-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  for (let i = 0; i < 5; i += 1) {
    assert.ok(checkRateLimit(key, 5, 60), `request ${i + 1} within limit`);
  }
  assert.equal(checkRateLimit(key, 5, 60), false, "6th request in-window must be limited");
  await new Promise((r) => setTimeout(r, 80));
  assert.ok(checkRateLimit(key, 5, 60), "window elapsed — requests flow again");
});

test("M3: getSecret returns null for missing env var", () => {
  assert.equal(getSecret("ARDYN_NONEXISTENT_SECRET_12345"), null);
});

test("M3: redactSecrets masks sensitive patterns (canonical redactor)", () => {
  assert.match(redactSecrets("token=abc123"), /REDACTED/);
  assert.doesNotMatch(redactSecrets("token=abc123"), /abc123/);
  assert.match(redactSecrets("Bearer eyJhbGciOiJIUzI1NiJ9.e2e3.sig"), /REDACTED/);
  assert.equal(redactSecrets("hello world"), "hello world");
  // Strengthened (canonical redactor superset): colon-form secrets are covered.
  const maskedJson = redactSecrets('{"password":"hunter2"}');
  assert.doesNotMatch(maskedJson, /hunter2/);
  assert.match(maskedJson, /REDACTED/);
});

test("M3: sanitizeQuery blocks disallowed statements", () => {
  assert.throws(() => sanitizeQuery("DROP TABLE users"), /Disallowed/);
  assert.throws(() => sanitizeQuery("SELECT 1; DROP TABLE x;"), /Multiple/);
});

test("M3: sanitizeQuery allows safe queries", () => {
  assert.equal(sanitizeQuery("SELECT * FROM users"), "SELECT * FROM users");
  assert.equal(sanitizeQuery("SELECT name FROM sessions;"), "SELECT name FROM sessions");
});

test("M3: sessions table CRUD works", async () => {
  const db = await createDatabase();
  const id = `m3-session-${Date.now()}`;
  db.prepare("INSERT INTO sessions (id, manifest_path, created_at) VALUES (?, ?, ?)")
    .run(id, "/tmp/manifest.json", new Date().toISOString());
  const session = db.prepare("SELECT * FROM sessions WHERE id = ?").get(id);
  assert.ok(session.id === id);
  assert.ok(session.manifest_path === "/tmp/manifest.json");
  assert.ok(session.status === "active");
  assert.equal(session.runtime_enabled, 0);
});
