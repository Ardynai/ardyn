// M14: Per-user memory — persistent profile + cross-session recall
// Pattern adapted from hermes-agent (MIT, NousResearch/hermes-agent) — not vendored.
// Each user gets an evolving MEMORY/USER record with cross-session recall (searchable history).
// Strictly per-user isolated: one user's memory/profile is never visible to another.

export async function createUserMemoryDatabase(dbPath = ":memory:") {
  const { DatabaseSync } = await import("node:sqlite");
  const db = new DatabaseSync(dbPath);
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_memories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      key TEXT NOT NULL,
      value TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      UNIQUE(user_id, key)
    );
    CREATE TABLE IF NOT EXISTS user_profiles (
      user_id TEXT PRIMARY KEY,
      profile TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS user_memory_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      event_type TEXT NOT NULL,
      event_data TEXT,
      created_at TEXT NOT NULL
    );
    -- FTS5 virtual table for cross-session search (per-user scoped)
    CREATE VIRTUAL TABLE IF NOT EXISTS user_memory_fts USING fts5(
      user_id, key, value, content='user_memories', content_rowid='id'
    );
  `);
  return db;
}

export function saveMemory(db, { userId, key, value }) {
  const now = new Date().toISOString();
  db.prepare("INSERT OR REPLACE INTO user_memories (user_id, key, value, created_at, updated_at) VALUES (?, ?, ?, ?, ?)")
    .run(userId, key, value, now, now);
  db.prepare("INSERT INTO user_memory_events (user_id, event_type, event_data, created_at) VALUES (?, 'memory_saved', ?, ?)")
    .run(userId, JSON.stringify({ key }), now);
}

export function getMemory(db, { userId, key }) {
  const row = db.prepare("SELECT * FROM user_memories WHERE user_id = ? AND key = ?").get(userId, key);
  if (!row) return null;
  return { userId: row.user_id, key: row.key, value: row.value };
}

export function searchMemory(db, { userId, query }) {
  // Per-user scoped search — one user cannot search another's memories
  const rows = db.prepare("SELECT * FROM user_memories WHERE user_id = ? AND value LIKE ?").all(userId, `%${query}%`);
  return rows.map(r => ({ userId: r.user_id, key: r.key, value: r.value }));
}

export function saveUserProfile(db, { userId, profile }) {
  const now = new Date().toISOString();
  const profileJson = typeof profile === "string" ? profile : JSON.stringify(profile);
  db.prepare("INSERT OR REPLACE INTO user_profiles (user_id, profile, created_at, updated_at) VALUES (?, ?, ?, ?)")
    .run(userId, profileJson, now, now);
}

export function getUserProfile(db, { userId }) {
  const row = db.prepare("SELECT * FROM user_profiles WHERE user_id = ?").get(userId);
  if (!row) return null;
  try { return JSON.parse(row.profile); } catch { return null; }
}

export function summarizeMemory(db, { userId }) {
  const rows = db.prepare("SELECT key, value FROM user_memories WHERE user_id = ?").all(userId);
  return {
    totalMemories: rows.length,
    keys: rows.map(r => r.key),
    summary: `${rows.length} memories for user ${userId}`,
  };
}

export function listUserMemories(db, { userId }) {
  const rows = db.prepare("SELECT * FROM user_memories WHERE user_id = ? ORDER BY updated_at DESC").all(userId);
  return rows.map(r => ({ userId: r.user_id, key: r.key, value: r.value }));
}