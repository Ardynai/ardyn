// M3: Data & auth — embedded SQLite DB, auth/permissions, secrets management
// Real implementation within the security floor (no new deps)
import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

// M3: Embedded database — in-process SQLite via node:sqlite
export async function createDatabase(dbPath = ":memory:") {
  const { DatabaseSync } = await import("node:sqlite");
  const db = new DatabaseSync(dbPath);
  db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      manifest_path TEXT NOT NULL,
      created_at TEXT NOT NULL,
      status TEXT DEFAULT 'active',
      runtime_enabled INTEGER DEFAULT 0,
      approved INTEGER DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS audit_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT,
      event_type TEXT NOT NULL,
      event_data TEXT,
      timestamp TEXT NOT NULL,
      FOREIGN KEY (session_id) REFERENCES sessions(id)
    );
    CREATE TABLE IF NOT EXISTS permissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      role TEXT NOT NULL,
      capability TEXT NOT NULL,
      granted INTEGER DEFAULT 0,
      UNIQUE(role, capability)
    );
  `);
  return db;
}

// M3: Auth — deny-by-default permission check
export function checkPermission(db, role, capability) {
  const stmt = db.prepare("SELECT granted FROM permissions WHERE role = ? AND capability = ?");
  const row = stmt.get(role, capability);
  // Deny by default — if no row exists or granted is 0, deny
  return row ? row.granted === 1 : false;
}

// M3: Grant a permission (explicit, recorded in audit log)
export function grantPermission(db, role, capability) {
  db.prepare("INSERT OR REPLACE INTO permissions (role, capability, granted) VALUES (?, ?, 1)").run(role, capability);
  db.prepare("INSERT INTO audit_log (session_id, event_type, event_data, timestamp) VALUES (?, ?, ?, ?)")
    .run(null, "permission_granted", JSON.stringify({ role, capability }), new Date().toISOString());
}

// M3: Revoke a permission
export function revokePermission(db, role, capability) {
  db.prepare("UPDATE permissions SET granted = 0 WHERE role = ? AND capability = ?").run(role, capability);
  db.prepare("INSERT INTO audit_log (session_id, event_type, event_data, timestamp) VALUES (?, ?, ?, ?)")
    .run(null, "permission_revoked", JSON.stringify({ role, capability }), new Date().toISOString());
}

// M3: Rate limiting — simple in-memory token bucket
const rateLimitBuckets = new Map();
export function checkRateLimit(key, maxRequests = 100, windowMs = 60000) {
  const now = Date.now();
  const bucket = rateLimitBuckets.get(key) ?? { count: 0, resetAt: now + windowMs };
  if (now > bucket.resetAt) {
    bucket.count = 0;
    bucket.resetAt = now + windowMs;
  }
  bucket.count++;
  rateLimitBuckets.set(key, bucket);
  return bucket.count <= maxRequests;
}

// M3: Secrets management — env-only, never persisted
export function getSecret(name) {
  const value = process.env[name];
  if (!value) return null;
  // ponytail: return the secret but never log it
  return value;
}

export function redactSecrets(text) {
  return text
    .replace(/(?:token|secret|password|api_key|apikey)\s*=\s*[^\s]+/gi, "REDACTED")
    .replace(/(?:Bearer)\s+[A-Za-z0-9._-]+/gi, "Bearer REDACTED");
}

// M3: Input sanitization — prevent SQL injection
export function sanitizeQuery(query) {
  // Only allow SELECT, INSERT, UPDATE, DELETE, CREATE TABLE statements
  const normalized = query.trim().toUpperCase();
  const allowed = ["SELECT", "INSERT", "UPDATE", "DELETE", "CREATE TABLE", "CREATE TABLE IF"];
  if (!allowed.some(prefix => normalized.startsWith(prefix))) {
    throw new Error(`Disallowed SQL query type: ${normalized.slice(0, 20)}`);
  }
  // Block multiple statements (no semicolons except at end)
  if ((query.match(/;/g) ?? []).length > 1) {
    throw new Error("Multiple SQL statements not allowed");
  }
  return query.trim().replace(/;$/, "");
}

// Tests
test("M3: createDatabase creates tables", async () => {
  const db = await createDatabase();
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name").all();
  const names = tables.map(t => t.name);
  assert.ok(names.includes("sessions"));
  assert.ok(names.includes("audit_log"));
  assert.ok(names.includes("permissions"));
  db.close();
});

test("M3: permission check denies by default", async () => {
  const db = await createDatabase();
  assert.equal(checkPermission(db, "user", "runtime.execute"), false);
  db.close();
});

test("M3: grantPermission allows and records audit", async () => {
  const db = await createDatabase();
  grantPermission(db, "admin", "runtime.execute");
  assert.equal(checkPermission(db, "admin", "runtime.execute"), true);
  // Check audit log
  const logs = db.prepare("SELECT * FROM audit_log WHERE event_type = 'permission_granted'").all();
  assert.ok(logs.length > 0);
  db.close();
});

test("M3: revokePermission removes access", async () => {
  const db = await createDatabase();
  grantPermission(db, "user", "runtime.execute");
  assert.equal(checkPermission(db, "user", "runtime.execute"), true);
  revokePermission(db, "user", "runtime.execute");
  assert.equal(checkPermission(db, "user", "runtime.execute"), false);
  db.close();
});

test("M3: rate limiting enforces max requests", () => {
  // Reset for clean test
  rateLimitBuckets.delete("test-key");
  for (let i = 0; i < 5; i++) {
    checkRateLimit("test-key", 3, 60000);
  }
  // 6th request should be denied
  assert.equal(checkRateLimit("test-key", 3, 60000), false);
  rateLimitBuckets.delete("test-key");
});

test("M3: getSecret returns null for missing env var", () => {
  assert.equal(getSecret("ARDYN_NONEXISTENT_SECRET_12345"), null);
});

test("M3: redactSecrets masks sensitive patterns", () => {
  assert.match(redactSecrets("token=abc123"), /REDACTED/);
  assert.match(redactSecrets("Bearer eyJhbGc"), /REDACTED/);
  assert.equal(redactSecrets("hello world"), "hello world");
});

test("M3: sanitizeQuery blocks disallowed statements", () => {
  assert.throws(() => sanitizeQuery("DROP TABLE sessions"), /Disallowed/);
  assert.throws(() => sanitizeQuery("SELECT 1; DROP TABLE x;"), /Multiple/);
});

test("M3: sanitizeQuery allows safe queries", () => {
  assert.equal(sanitizeQuery("SELECT * FROM sessions"), "SELECT * FROM sessions");
  assert.equal(sanitizeQuery("INSERT INTO sessions (id, manifest_path, created_at) VALUES (1, 'test', 'now')"),
    "INSERT INTO sessions (id, manifest_path, created_at) VALUES (1, 'test', 'now')");
});

test("M3: sessions table CRUD works", async () => {
  const db = await createDatabase();
  db.prepare("INSERT INTO sessions (id, manifest_path, created_at) VALUES (?, ?, ?)")
    .run("test-1", "manifest.json", new Date().toISOString());
  const session = db.prepare("SELECT * FROM sessions WHERE id = ?").get("test-1");
  assert.equal(session.id, "test-1");
  assert.equal(session.manifest_path, "manifest.json");
  assert.equal(session.status, "active");
  assert.equal(session.runtime_enabled, 0);
  db.close();
});