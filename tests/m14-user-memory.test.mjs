// M14: Per-user memory — per-user profile, cross-session recall, strict isolation
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import {
  createUserMemoryDatabase,
  saveMemory,
  getMemory,
  searchMemory,
  saveUserProfile,
  getUserProfile,
  summarizeMemory,
} from "../packages/core/src/user-memory.mjs";

async function makeDb() {
  const dir = await mkdtemp(join(tmpdir(), "ardyn-m14-"));
  const db = await createUserMemoryDatabase(join(dir, "memory.db"));
  return { db, dir, cleanup: () => rm(dir, { recursive: true, force: true }) };
}

// ── Per-user memory save/get ──

test("M14: saveMemory + getMemory — per-user storage", async () => {
  const { db, cleanup } = await makeDb();
  try {
    saveMemory(db, { userId: "alice", key: "preference", value: "prefers concise responses" });
    const mem = getMemory(db, { userId: "alice", key: "preference" });
    assert.ok(mem, "memory should be retrievable");
    assert.equal(mem.value, "prefers concise responses");
  } finally { cleanup(); }
});

// ── CRITICAL: per-user isolation ──

test("M14: user A cannot see user B's memory (CRITICAL isolation test)", async () => {
  const { db, cleanup } = await makeDb();
  try {
    saveMemory(db, { userId: "alice", key: "secret", value: "alice's secret" });
    saveMemory(db, { userId: "bob", key: "secret", value: "bob's secret" });

    // Alice can see her own memory
    const aliceMem = getMemory(db, { userId: "alice", key: "secret" });
    assert.equal(aliceMem.value, "alice's secret");

    // Bob CANNOT see Alice's memory
    const bobSeeingAlice = getMemory(db, { userId: "bob", key: "secret" });
    assert.equal(bobSeeingAlice.value, "bob's secret", "bob must see his own, not alice's");
    assert.notEqual(bobSeeingAlice.value, "alice's secret", "bob must NOT see alice's memory");
  } finally { cleanup(); }
});

// ── Cross-session search ──

test("M14: searchMemory searches across all memories for a user", async () => {
  const { db, cleanup } = await makeDb();
  try {
    saveMemory(db, { userId: "alice", key: "pref1", value: "likes python" });
    saveMemory(db, { userId: "alice", key: "pref2", value: "likes typescript" });
    saveMemory(db, { userId: "alice", key: "note1", value: "uses vim" });
    saveMemory(db, { userId: "bob", key: "pref1", value: "likes java" });

    const results = searchMemory(db, { userId: "alice", query: "likes" });
    assert.ok(results.length >= 2, "should find at least 2 matching memories");
    // Results must be scoped to alice only — no bob memories
    for (const r of results) {
      assert.equal(r.userId, "alice", "search results must be scoped to the user");
    }
  } finally { cleanup(); }
});

// ── User profile ──

test("M14: saveUserProfile + getUserProfile — per-user evolving profile", async () => {
  const { db, cleanup } = await makeDb();
  try {
    saveUserProfile(db, { userId: "alice", profile: { name: "Alice", role: "developer", preferences: { theme: "dark" } } });
    const profile = getUserProfile(db, { userId: "alice" });
    assert.equal(profile.name, "Alice");
    assert.equal(profile.role, "developer");
    assert.equal(profile.preferences.theme, "dark");
  } finally { cleanup(); }
});

test("M14: user profile is isolated per user", async () => {
  const { db, cleanup } = await makeDb();
  try {
    saveUserProfile(db, { userId: "alice", profile: { name: "Alice" } });
    saveUserProfile(db, { userId: "bob", profile: { name: "Bob" } });
    assert.equal(getUserProfile(db, { userId: "alice" }).name, "Alice");
    assert.equal(getUserProfile(db, { userId: "bob" }).name, "Bob");
    assert.notEqual(
      getUserProfile(db, { userId: "alice" }).name,
      getUserProfile(db, { userId: "bob" }).name,
      "profiles must be different"
    );
  } finally { cleanup(); }
});

// ── Memory summarization ──

test("M14: summarizeMemory returns a compact summary of user's memories", async () => {
  const { db, cleanup } = await makeDb();
  try {
    saveMemory(db, { userId: "alice", key: "p1", value: "likes python" });
    saveMemory(db, { userId: "alice", key: "p2", value: "uses vim" });
    const summary = summarizeMemory(db, { userId: "alice" });
    assert.ok(summary.totalMemories >= 2, "summary should count memories");
    assert.ok(summary.keys, "summary should list keys");
  } finally { cleanup(); }
});