// M14: Per-user memory — persistent profile + cross-session recall
// M18: semantic recall (RAG) — embeddings stored per item, top-k cosine retrieval.
// Pattern adapted from hermes-agent (MIT) + Vision-Agents RAG pattern (MIT) — not vendored.
//
// Vector choice (documented ceiling): embeddings are stored IN the SQLite row
// as JSON float arrays; retrieval loads the requesting user's rows (SQL
// user_id prefilter) and ranks by in-process cosine similarity. No vector-DB
// dependency, no torch/transformers. ponytail: ranking is O(n) over ONE user's
// items per query — fine at per-user scale (thousands); upgrade path if a user
// ever outgrows it: sqlite-vec extension or chunked prefilter.
//
// ISOLATION FLOOR: recall candidates are filtered WHERE user_id = ? BEFORE any
// scoring — another user's items are never read, ranked against, or returned.

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
      embedding TEXT,
      embedding_model TEXT,
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
  ensureMemoryEmbeddingColumns(db);
  return db;
}

// Idempotent migration for databases created before M18 (also guarantees the
// companion tables exist, so a partially-created DB self-heals on open).
export function ensureMemoryEmbeddingColumns(db) {
  db.exec(`CREATE TABLE IF NOT EXISTS user_memory_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    event_type TEXT NOT NULL,
    event_data TEXT,
    created_at TEXT NOT NULL
  )`);
  const cols = db.prepare("PRAGMA table_info(user_memories)").all().map(c => c.name);
  if (!cols.includes("embedding")) {
    db.exec("ALTER TABLE user_memories ADD COLUMN embedding TEXT");
  }
  if (!cols.includes("embedding_model")) {
    db.exec("ALTER TABLE user_memories ADD COLUMN embedding_model TEXT");
  }
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

// ── M18: Semantic recall (RAG) ──

export function cosineSimilarity(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length === 0 || a.length !== b.length) return 0;
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (na === 0 || nb === 0) return 0; // zero vector — never NaN
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

// Memory store with embeddings. embedFn: async (text) => number[] — inject a
// fake in tests; in production use createAdapterEmbedder() from provider-adapter.
export function createMemoryStore(db, { embedFn, model = "unknown" } = {}) {
  ensureMemoryEmbeddingColumns(db); // self-heal partially-created/legacy DBs
  const upsert = db.prepare(`
    INSERT OR REPLACE INTO user_memories (user_id, key, value, created_at, updated_at, embedding, embedding_model)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const insertEvent = db.prepare(
    "INSERT INTO user_memory_events (user_id, event_type, event_data, created_at) VALUES (?, ?, ?, ?)"
  );

  return {
    // Store a memory item WITH its embedding. Embedding failure fails closed:
    // the item is NOT stored half-ready (it would be invisible to recall).
    async remember({ userId, key, value }) {
      if (!userId || !key || typeof value !== "string") {
        throw new Error("remember requires userId, key and string value");
      }
      let embeddingJson = null;
      if (embedFn) {
        embeddingJson = JSON.stringify(await embedFn(value)); // throws -> nothing stored
      }
      const now = new Date().toISOString();
      upsert.run(userId, key, value, now, now, embeddingJson, embedFn ? model : null);
      insertEvent.run(userId, "memory_remembered", JSON.stringify({ key, embedded: !!embeddingJson }), now);
      return { userId, key, embedded: !!embeddingJson };
    },

    // Top-k semantic recall for ONE user. Candidates are prefiltered by
    // user_id in SQL — cross-user leakage is structurally impossible.
    async recall({ userId, query, k = 5 }) {
      if (!userId || typeof query !== "string") throw new Error("recall requires userId and query");
      if (!embedFn) throw new Error("semantic recall requires an embed function (createMemoryStore({embedFn}))");
      const qv = await embedFn(query);
      const rows = db.prepare("SELECT key, value, embedding FROM user_memories WHERE user_id = ?").all(userId);
      const scored = [];
      for (const row of rows) {
        if (!row.embedding) continue; // legacy keyword-only items are not semantic candidates
        let vec;
        try { vec = JSON.parse(row.embedding); } catch { continue; }
        scored.push({ userId, key: row.key, value: row.value, score: cosineSimilarity(qv, vec) });
      }
      scored.sort((x, y) => y.score - x.score);
      return scored.slice(0, Math.max(0, k));
    },
  };
}