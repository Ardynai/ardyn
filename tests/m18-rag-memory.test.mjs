// M18: RAG per-user memory — semantic recall with strict isolation.
// ALL embeddings are INJECTED fakes — never a live embedding API.
import assert from "node:assert/strict";
import test from "node:test";
import {
  createUserMemoryDatabase,
  ensureMemoryEmbeddingColumns,
  cosineSimilarity,
  createMemoryStore,
} from "../packages/core/src/user-memory.mjs";
import { createAdapterEmbedder } from "../packages/core/src/provider-adapter.mjs";

// Deterministic fake embedder: hashing bag-of-words into a fixed vector.
function fakeEmbed(text) {
  const v = new Array(16).fill(0);
  for (const w of String(text).toLowerCase().split(/\W+/)) {
    if (!w) continue;
    let h = 0;
    for (const ch of w) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    v[h % 16] += 1;
  }
  return v;
}

// ── cosine similarity ──

test("M18: cosineSimilarity basics (identical/orthogonal/opposite/zero/mismatch)", () => {
  assert.ok(Math.abs(cosineSimilarity([1, 0], [1, 0]) - 1) < 1e-9);
  assert.equal(cosineSimilarity([1, 0], [0, 1]), 0);
  assert.ok(Math.abs(cosineSimilarity([1, 0], [-1, 0]) + 1) < 1e-9);
  assert.equal(cosineSimilarity([0, 0], [1, 2]), 0, "zero vector must not produce NaN");
  assert.equal(cosineSimilarity([1, 2, 3], [1, 2]), 0, "length mismatch -> 0");
});

// ── remember stores embeddings ──

test("M18: remember embeds the value and persists it with the model name", async () => {
  const db = await createUserMemoryDatabase(":memory:");
  const seen = [];
  const store = createMemoryStore(db, { embedFn: async (t) => { seen.push(t); return fakeEmbed(t); }, model: "fake-embed-1" });
  const res = await store.remember({ userId: "u1", key: "pref", value: "likes tea" });
  assert.deepEqual(seen, ["likes tea"]);
  assert.equal(res.embedded, true);
  const row = db.prepare("SELECT value, embedding, embedding_model FROM user_memories WHERE user_id='u1' AND key='pref'").get();
  assert.equal(row.value, "likes tea");
  assert.deepEqual(JSON.parse(row.embedding), fakeEmbed("likes tea"));
  assert.equal(row.embedding_model, "fake-embed-1");
});

test("M18: embedding failure fails closed — item is NOT stored", async () => {
  const db = await createUserMemoryDatabase(":memory:");
  const store = createMemoryStore(db, { embedFn: async () => { throw new Error("embedding api down"); } });
  await assert.rejects(() => store.remember({ userId: "u1", key: "k", value: "v" }), /embedding api down/);
  const count = db.prepare("SELECT COUNT(*) AS c FROM user_memories WHERE user_id='u1'").get();
  assert.equal(count.c, 0, "half-ready items must not persist");
});

// ── semantic recall ordering ──

test("M18: recall returns top-k ranked by cosine for the requesting user", async () => {
  const db = await createUserMemoryDatabase(":memory:");
  const store = createMemoryStore(db, { embedFn: fakeEmbed });
  await store.remember({ userId: "u1", key: "a", value: "deploy checklist ardyn production" });
  await store.remember({ userId: "u1", key: "b", value: "favorite color is blue" });
  await store.remember({ userId: "u1", key: "c", value: "deploy rollback plan ardyn" });
  const results = await store.recall({ userId: "u1", query: "ardyn deploy", k: 2 });
  assert.equal(results.length, 2);
  assert.equal(results[0].key, "a", "closest item first");
  assert.equal(results[1].key, "c");
  assert.ok(results[0].score >= results[1].score, "descending scores");
  assert.ok(!results.some(r => r.key === "b"), "irrelevant memory excluded by top-k");
  // every result carries the requesting user's id only
  assert.ok(results.every(r => r.userId === "u1"));
});

test("M18: recall without an embed function fails loud (not silent empty)", async () => {
  const db = await createUserMemoryDatabase(":memory:");
  const store = createMemoryStore(db);
  await assert.rejects(() => store.recall({ userId: "u1", query: "x" }), /requires an embed function/);
});

test("M18: legacy rows without embeddings are skipped gracefully by recall", async () => {
  const db = await createUserMemoryDatabase(":memory:");
  const store = createMemoryStore(db, { embedFn: fakeEmbed });
  await store.remember({ userId: "u1", key: "new", value: "rust toolchain pinning" });
  // simulate an M14-era row saved via legacy saveMemory path (no embedding)
  db.prepare("INSERT INTO user_memories (user_id, key, value, created_at, updated_at) VALUES ('u1','old','rust toolchain pinning','t','t')").run();
  const results = await store.recall({ userId: "u1", query: "rust toolchain", k: 5 });
  assert.equal(results.length, 1);
  assert.equal(results[0].key, "new");
});

// ── CRITICAL: strict per-user isolation in semantic recall ──

test("M18: CRITICAL — user A's query NEVER returns user B's memories (isolation floor)", async () => {
  const db = await createUserMemoryDatabase(":memory:");
  const store = createMemoryStore(db, { embedFn: fakeEmbed });

  // B stores a semantically PERFECT match for A's future query…
  await store.remember({ userId: "user-B", key: "b-secret", value: "wallet recovery phrase for crypto accounts" });
  // …A stores weaker, related-but-different items
  await store.remember({ userId: "user-A", key: "a-1", value: "grocery list apples bananas" });
  await store.remember({ userId: "user-A", key: "a-2", value: "wallet settings theme dark" });

  // A queries something that would rank B's item FIRST globally
  const aResults = await store.recall({ userId: "user-A", query: "crypto wallet recovery phrase", k: 10 });
  assert.equal(aResults.length, 2, "only A's own candidates are considered");
  assert.ok(aResults.every(r => r.userId === "user-A"), "every result belongs to the requesting user");
  assert.ok(!aResults.some(r => r.key === "b-secret"), "B's higher-ranked item must NEVER appear");

  // And symmetrically for B
  const bResults = await store.recall({ userId: "user-B", query: "anything at all", k: 10 });
  assert.equal(bResults.length, 1);
  assert.ok(bResults.every(r => r.userId === "user-B"));
  assert.ok(bResults.every(r => !["a-1", "a-2"].includes(r.key)));

  // Structural proof: the SQL prefilter itself only ever sees the requester's rows
  const rawScope = db.prepare("SELECT COUNT(*) AS c FROM user_memories WHERE user_id = ?").get("user-A");
  assert.equal(rawScope.c, 2, "candidate set for user-A contains exactly A's rows");
});

// ── migration of pre-M18 databases ──

test("M18: ensureMemoryEmbeddingColumns migrates an old M14 database in place", async () => {
  const { DatabaseSync } = await import("node:sqlite");
  const db = new DatabaseSync(":memory:");
  db.exec(`CREATE TABLE user_memories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL, key TEXT NOT NULL, value TEXT NOT NULL,
    created_at TEXT NOT NULL, updated_at TEXT NOT NULL, UNIQUE(user_id, key))`);
  ensureMemoryEmbeddingColumns(db);
  const cols = db.prepare("PRAGMA table_info(user_memories)").all().map(c => c.name);
  assert.ok(cols.includes("embedding") && cols.includes("embedding_model"));
  // migrated DB works with the new store
  const store = createMemoryStore(db, { embedFn: fakeEmbed });
  await store.remember({ userId: "u9", key: "k", value: "migrated ok" });
  const results = await store.recall({ userId: "u9", query: "migrated", k: 3 });
  assert.equal(results[0].key, "k");
});

// ── adapter-backed embedder (API embeddings through Batch-3 provider-adapter) ──

const KEY = "sk-test-embed-key-123";

test("M18: provider adapter embed() builds /embeddings request and parses vectors (openai)", async () => {
  process.env.TEST_EMBED_KEY = KEY;
  try {
    const calls = [];
    const fetchImpl = async (url, opts) => {
      calls.push({ url, ...opts });
      return { ok: true, status: 200, json: async () => ({ data: [{ embedding: [0.1, 0.2, 0.3] }] }) };
    };
    const embed = createAdapterEmbedder({ provider: "openai", model: "text-embedding-fake", apiKeyEnv: "TEST_EMBED_KEY", fetchImpl });
    const v = await embed("hello world");
    assert.deepEqual(v, [0.1, 0.2, 0.3]);
    assert.match(calls[0].url, /\/v1\/embeddings$/);
    const body = JSON.parse(calls[0].body);
    assert.equal(body.model, "text-embedding-fake");
    assert.equal(body.input, "hello world");
    assert.equal(calls[0].headers.authorization, `Bearer ${KEY}`);
  } finally {
    delete process.env.TEST_EMBED_KEY;
  }
});

test("M18: gemini embed() uses :embedContent with header key and parses values", async () => {
  process.env.TEST_EMBED_KEY_G = KEY;
  try {
    const calls = [];
    const fetchImpl = async (url, opts) => {
      calls.push({ url, ...opts });
      return { ok: true, status: 200, json: async () => ({ embedding: { values: [1, 2] } }) };
    };
    const embed = createAdapterEmbedder({ provider: "gemini", model: "embedding-fake", apiKeyEnv: "TEST_EMBED_KEY_G", fetchImpl });
    const v = await embed("hi");
    assert.deepEqual(v, [1, 2]);
    assert.match(calls[0].url, /models\/embedding-fake:embedContent$/);
    assert.equal(calls[0].headers["x-goog-api-key"], KEY);
  } finally {
    delete process.env.TEST_EMBED_KEY_G;
  }
});

test("M18: end-to-end — memory store wired to adapter embedder (fake fetch), isolated recall", async () => {
  process.env.TEST_EMBED_KEY = KEY;
  try {
    // Fake API returns deterministic vectors derived from the input text.
    const fetchImpl = async (url, opts) => {
      const body = JSON.parse(opts.body);
      return { ok: true, status: 200, json: async () => ({ data: [{ embedding: fakeEmbed(body.input) }] }) };
    };
    const embed = createAdapterEmbedder({ provider: "openai", model: "text-embedding-fake", apiKeyEnv: "TEST_EMBED_KEY", fetchImpl });
    const db = await createUserMemoryDatabase(":memory:");
    const store = createMemoryStore(db, { embedFn: embed, model: "text-embedding-fake" });
    await store.remember({ userId: "alice", key: "ops", value: "postgres backup schedule nightly" });
    await store.remember({ userId: "bob", key: "ops", value: "postgres backup schedule hourly" });
    const aHits = await store.recall({ userId: "alice", query: "database backups", k: 5 });
    assert.equal(aHits.length, 1, "alice only ever sees her own row");
    assert.equal(aHits[0].value, "postgres backup schedule nightly");
    assert.ok(!JSON.stringify(aHits).includes("hourly"), "bob's content must not leak");
  } finally {
    delete process.env.TEST_EMBED_KEY;
  }
});
