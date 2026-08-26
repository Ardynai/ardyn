// M12: Loop-state control plane — durable, governed, reviewable
// Pattern adapted from loopx (Apache-2.0, huangruiteng/loopx) — not vendored.
// Lifetime goals, user gates, todo ownership (claimed_by), quota/should-run + spend,
// append-only run history + evidence, public/private boundary checks.

import { redactSecretsDeep } from "./internal/redaction.mjs";

export async function createLoopStateDatabase(dbPath = ":memory:") {
  const { DatabaseSync } = await import("node:sqlite");
  const db = new DatabaseSync(dbPath);
  db.exec(`
    CREATE TABLE IF NOT EXISTS goals (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'active',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS todos (
      id TEXT PRIMARY KEY,
      goal_id TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'pending',
      claimed_by TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (goal_id) REFERENCES goals(id)
    );
    CREATE TABLE IF NOT EXISTS gates (
      id TEXT PRIMARY KEY,
      goal_id TEXT NOT NULL,
      name TEXT NOT NULL,
      type TEXT DEFAULT 'user',
      satisfied INTEGER DEFAULT 0,
      created_at TEXT NOT NULL,
      FOREIGN KEY (goal_id) REFERENCES goals(id)
    );
    CREATE TABLE IF NOT EXISTS run_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      goal_id TEXT NOT NULL,
      run_id TEXT NOT NULL,
      evidence TEXT,
      outcome TEXT,
      is_public INTEGER DEFAULT 0,
      created_at TEXT NOT NULL,
      FOREIGN KEY (goal_id) REFERENCES goals(id)
    );
    CREATE TABLE IF NOT EXISTS quota (
      goal_id TEXT PRIMARY KEY,
      spent INTEGER DEFAULT 0,
      max INTEGER DEFAULT 10,
      FOREIGN KEY (goal_id) REFERENCES goals(id)
    );
  `);
  return db;
}

export function createGoal(db, { title, description }) {
  const id = `goal-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const now = new Date().toISOString();
  db.prepare("INSERT INTO goals (id, title, description, status, created_at, updated_at) VALUES (?, ?, ?, 'active', ?, ?)")
    .run(id, title, description ?? "", now, now);
  return { id, title, description, status: "active" };
}

export function getGoal(db, { goalId }) {
  return db.prepare("SELECT * FROM goals WHERE id = ?").get(goalId);
}

export function listGoals(db) {
  return db.prepare("SELECT * FROM goals WHERE status = 'active' ORDER BY created_at DESC").all();
}

export function createTodo(db, { goalId, title, description }) {
  const id = `todo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const now = new Date().toISOString();
  db.prepare("INSERT INTO todos (id, goal_id, title, description, status, claimed_by, created_at, updated_at) VALUES (?, ?, ?, ?, 'pending', NULL, ?, ?)")
    .run(id, goalId, title, description ?? "", now, now);
  return { id, goalId, title, description, status: "pending", claimedBy: null };
}

export function claimTodo(db, { todoId, claimedBy }) {
  const now = new Date().toISOString();
  // M16: ATOMIC claim — only succeeds when the todo is unclaimed. Two instances
  // sharing one DB can never both win; the loser gets ok:false, not a silent
  // overwrite of someone else's claim.
  const result = db.prepare(
    "UPDATE todos SET status = 'claimed', claimed_by = ?, updated_at = ? WHERE id = ? AND (status = 'pending' OR claimed_by IS NULL)"
  ).run(claimedBy, now, todoId);
  if (result.changes === 0) {
    const current = db.prepare("SELECT claimed_by FROM todos WHERE id = ?").get(todoId);
    return { id: todoId, status: "claimed", claimedBy: current?.claimed_by ?? null, ok: false };
  }
  return { id: todoId, status: "claimed", claimedBy: claimedBy, ok: true };
}

export function releaseTodo(db, { todoId }) {
  const now = new Date().toISOString();
  db.prepare("UPDATE todos SET status = 'pending', claimed_by = NULL, updated_at = ? WHERE id = ?").run(now, todoId);
  const row = db.prepare("SELECT * FROM todos WHERE id = ?").get(todoId);
  return { id: row.id, status: row.status, claimedBy: null };
}

export function createGate(db, { goalId, name, type = "user" }) {
  const id = `gate-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  db.prepare("INSERT INTO gates (id, goal_id, name, type, satisfied, created_at) VALUES (?, ?, ?, ?, 0, ?)")
    .run(id, goalId, name, type, new Date().toISOString());
  return { id, goalId, name, type, satisfied: false };
}

export function checkGate(db, { gateId }) {
  const row = db.prepare("SELECT satisfied FROM gates WHERE id = ?").get(gateId);
  return row ? row.satisfied === 1 : false;
}

export function recordRun(db, { goalId, runId, evidence, outcome, isPublic = false }) {
  db.prepare("INSERT INTO run_history (goal_id, run_id, evidence, outcome, is_public, created_at) VALUES (?, ?, ?, ?, ?, ?)")
    .run(goalId, runId, evidence ?? "", outcome ?? "unknown", isPublic ? 1 : 0, new Date().toISOString());
}

export function getRunHistory(db, { goalId }) {
  return db.prepare("SELECT * FROM run_history WHERE goal_id = ? ORDER BY created_at ASC").all(goalId)
    .map(r => ({ runId: r.run_id, evidence: r.evidence, outcome: r.outcome, isPublic: r.is_public === 1 }));
}

export function checkQuota(db, { goalId, maxRuns }) {
  let row = db.prepare("SELECT spent, max FROM quota WHERE goal_id = ?").get(goalId);
  if (!row) {
    db.prepare("INSERT INTO quota (goal_id, spent, max) VALUES (?, 0, ?)").run(goalId, maxRuns ?? 10);
    row = { spent: 0, max: maxRuns ?? 10 };
  }
  const cap = maxRuns ?? row.max;
  return row.spent < cap;
}

export function spendQuota(db, { goalId, amount = 1 }) {
  let row = db.prepare("SELECT spent FROM quota WHERE goal_id = ?").get(goalId);
  if (!row) {
    db.prepare("INSERT INTO quota (goal_id, spent, max) VALUES (?, 0, 10)").run(goalId);
  }
  // M16: ATOMIC conditional spend — admitted only when spent+amount <= max.
  // Two instances racing on the same goal can never overshoot the cap; the
  // loser's UPDATE matches zero rows. Returns whether the spend was admitted.
  const result = db.prepare("UPDATE quota SET spent = spent + ? WHERE goal_id = ? AND spent + ? <= max").run(amount, goalId, amount);
  return result.changes > 0;
}

export function checkPublicPrivateBoundary(db, { goalId }) {
  // Check if any public run has private-looking data (secrets in evidence).
  // U15: delegate to THE canonical redactor instead of a drifted inline
  // regex — the old copy missed Bearer/sk-/ghp_ secret forms entirely.
  const publicRuns = db.prepare("SELECT * FROM run_history WHERE goal_id = ? AND is_public = 1").all(goalId);
  for (const run of publicRuns) {
    const evidence = typeof run.evidence === "string" ? run.evidence : String(run.evidence ?? "");
    if (redactSecretsDeep(evidence) !== evidence) {
      return { ok: false, violation: "secret_in_public_run", runId: run.run_id };
    }
  }
  return { ok: true };
}