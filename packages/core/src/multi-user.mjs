// M10: Multi-user support — per-user accounts, sessions, isolation
// Built on data-auth.mjs pattern. Per-user RBAC + strict session/sandbox isolation.
// Model: Hermes group_sessions_per_user — each user gets their own isolated sessions.
// One user can never see or control another user's sessions, sandboxes, or data.

import { metrics } from "./metrics.mjs";

export async function createMultiUserDatabase(dbPath = ":memory:") {
  const { DatabaseSync } = await import("node:sqlite");
  const db = new DatabaseSync(dbPath);
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL,
      role TEXT DEFAULT 'user'
    );
    CREATE TABLE IF NOT EXISTS user_sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      manifest_path TEXT NOT NULL,
      created_at TEXT NOT NULL,
      status TEXT DEFAULT 'active',
      runtime_enabled INTEGER DEFAULT 0,
      approved INTEGER DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
    CREATE TABLE IF NOT EXISTS user_permissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      capability TEXT NOT NULL,
      granted INTEGER DEFAULT 0,
      UNIQUE(user_id, capability),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
    CREATE TABLE IF NOT EXISTS user_sandboxes (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      session_id TEXT NOT NULL,
      container_id TEXT,
      status TEXT DEFAULT 'created',
      created_at TEXT NOT NULL,
      destroyed_at TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
    CREATE TABLE IF NOT EXISTS user_audit_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT,
      session_id TEXT,
      event_type TEXT NOT NULL,
      event_data TEXT,
      timestamp TEXT NOT NULL
    );
  `);
  return db;
}

// User management
export function createUser(db, { username, passwordHash, role = "user" }) {
  const id = `user-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  db.prepare("INSERT INTO users (id, username, password_hash, created_at, role) VALUES (?, ?, ?, ?, ?)")
    .run(id, username, passwordHash, new Date().toISOString(), role);
  return { id, username, role, createdAt: new Date().toISOString() };
}

export function authenticateUser(db, username, passwordHash) {
  const row = db.prepare("SELECT * FROM users WHERE username = ? AND password_hash = ?").get(username, passwordHash);
  if (!row) {
    // M16 metrics — aggregate failure count only; never label with username
    metrics.counter("ardyn_auth_failures_total");
    return null;
  }
  return { id: row.id, username: row.username, role: row.role };
}

// Per-user permissions (deny-by-default RBAC)
export function checkUserPermission(db, userId, capability) {
  const row = db.prepare("SELECT granted FROM user_permissions WHERE user_id = ? AND capability = ?").get(userId, capability);
  return row ? row.granted === 1 : false;
}

export function grantUserPermission(db, userId, capability) {
  db.prepare("INSERT OR REPLACE INTO user_permissions (user_id, capability, granted) VALUES (?, ?, 1)").run(userId, capability);
  db.prepare("INSERT INTO user_audit_log (user_id, event_type, event_data, timestamp) VALUES (?, ?, ?, ?)")
    .run(userId, "permission_granted", JSON.stringify({ capability }), new Date().toISOString());
}

// Per-user sessions (scoped to owner — one user cannot see another's sessions)
export function createSession(db, { userId, manifestPath }) {
  const id = `session-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  db.prepare("INSERT INTO user_sessions (id, user_id, manifest_path, created_at) VALUES (?, ?, ?, ?)")
    .run(id, userId, manifestPath, new Date().toISOString());
  return { id, userId, manifestPath };
}

export function getSession(db, sessionId, userId) {
  // M10 CRITICAL: sessions are scoped to the requesting user
  // A user can only retrieve their OWN session
  const row = db.prepare("SELECT * FROM user_sessions WHERE id = ? AND user_id = ?").get(sessionId, userId);
  if (!row) return null;
  return { id: row.id, userId: row.user_id, manifestPath: row.manifest_path, status: row.status };
}

export function listUserSessions(db, userId) {
  const rows = db.prepare("SELECT * FROM user_sessions WHERE user_id = ? ORDER BY created_at DESC").all(userId);
  return rows.map(r => ({ id: r.id, userId: r.user_id, manifestPath: r.manifest_path, status: r.status }));
}

// Per-user computer-use sandboxes (scoped to owner)
export function createComputerUseSandbox(db, { userId, sessionId, containerId }) {
  const id = `sandbox-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  db.prepare("INSERT INTO user_sandboxes (id, user_id, session_id, container_id, created_at) VALUES (?, ?, ?, ?, ?)")
    .run(id, userId, sessionId, containerId, new Date().toISOString());
  return { id, userId, sessionId, containerId };
}

export function getSandbox(db, sandboxId, userId) {
  // M10 CRITICAL: sandboxes are scoped to the requesting user
  const row = db.prepare("SELECT * FROM user_sandboxes WHERE id = ? AND user_id = ?").get(sandboxId, userId);
  if (!row) return null;
  return { id: row.id, userId: row.user_id, sessionId: row.session_id, containerId: row.container_id, status: row.status };
}

export function listUserSandboxes(db, userId) {
  const rows = db.prepare("SELECT * FROM user_sandboxes WHERE user_id = ? ORDER BY created_at DESC").all(userId);
  return rows.map(r => ({ id: r.id, userId: r.user_id, sessionId: r.session_id, containerId: r.container_id, status: r.status }));
}

export function destroySandbox(db, sandboxId, userId) {
  // M10: only the owner can destroy their sandbox
  const result = db.prepare("UPDATE user_sandboxes SET status = 'destroyed', destroyed_at = ? WHERE id = ? AND user_id = ?")
    .run(new Date().toISOString(), sandboxId, userId);
  return result.changes > 0;
}