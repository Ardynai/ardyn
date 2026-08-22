// M12: Loop-state control plane — goals, gates, todos, quota, evidence
import assert from "node:assert/strict";
import test from "node:test";
import { makeTempSqliteDb } from "./helpers/sqlite-temp.mjs";
import {
  createLoopStateDatabase,
  createGoal,
  getGoal,
  listGoals,
  createTodo,
  claimTodo,
  releaseTodo,
  createGate,
  checkGate,
  recordRun,
  getRunHistory,
  checkQuota,
  spendQuota,
  checkPublicPrivateBoundary,
} from "../packages/core/src/loop-state.mjs";

async function makeDb() {
  // Unique temp dir per call; cleanup() closes the DB handle BEFORE removing
  // the dir (with retries) — fixes the Windows EBUSY flakes. Assertions unchanged.
  return makeTempSqliteDb(createLoopStateDatabase, "loop");
}

test("M12: createGoal creates a lifetime goal with status active", async () => {
  const { db, cleanup } = await makeDb();
  try {
    const goal = createGoal(db, { title: "Ship Ardyn v1", description: "Complete all milestones" });
    assert.ok(goal.id);
    assert.equal(goal.title, "Ship Ardyn v1");
    assert.equal(goal.status, "active");
  } finally { await cleanup(); }
});

test("M12: createTodo + claimTodo assigns claimed_by", async () => {
  const { db, cleanup } = await makeDb();
  try {
    const goal = createGoal(db, { title: "Test goal" });
    const todo = createTodo(db, { goalId: goal.id, title: "Write tests", description: "M12 tests" });
    assert.equal(todo.status, "pending");
    assert.equal(todo.claimedBy, null);
    const claimed = claimTodo(db, { todoId: todo.id, claimedBy: "agent-1" });
    assert.equal(claimed.status, "claimed");
    assert.equal(claimed.claimedBy, "agent-1");
  } finally { await cleanup(); }
});

test("M12: releaseTodo clears claimed_by and sets status to pending", async () => {
  const { db, cleanup } = await makeDb();
  try {
    const goal = createGoal(db, { title: "Test goal" });
    const todo = createTodo(db, { goalId: goal.id, title: "Write tests" });
    claimTodo(db, { todoId: todo.id, claimedBy: "agent-1" });
    const released = releaseTodo(db, { todoId: todo.id });
    assert.equal(released.status, "pending");
    assert.equal(released.claimedBy, null);
  } finally { await cleanup(); }
});

test("M12: createGate + checkGate — deny by default", async () => {
  const { db, cleanup } = await makeDb();
  try {
    const goal = createGoal(db, { title: "Test goal" });
    const gate = createGate(db, { goalId: goal.id, name: "user_approval", type: "user" });
    assert.equal(checkGate(db, { gateId: gate.id }), false, "gate starts closed");
  } finally { await cleanup(); }
});

test("M12: recordRun + getRunHistory — append-only run history", async () => {
  const { db, cleanup } = await makeDb();
  try {
    const goal = createGoal(db, { title: "Test goal" });
    recordRun(db, { goalId: goal.id, runId: "run-1", evidence: "tests passed", outcome: "success" });
    recordRun(db, { goalId: goal.id, runId: "run-2", evidence: "tests failed", outcome: "failure" });
    const history = getRunHistory(db, { goalId: goal.id });
    assert.equal(history.length, 2);
    assert.equal(history[0].runId, "run-1");
    assert.equal(history[1].runId, "run-2");
  } finally { await cleanup(); }
});

test("M12: checkQuota + spendQuota — should-run and spend tracking", async () => {
  const { db, cleanup } = await makeDb();
  try {
    const goal = createGoal(db, { title: "Test goal" });
    assert.ok(checkQuota(db, { goalId: goal.id, maxRuns: 5 }), "should run when under quota");
    spendQuota(db, { goalId: goal.id, amount: 1 });
    spendQuota(db, { goalId: goal.id, amount: 1 });
    spendQuota(db, { goalId: goal.id, amount: 1 });
    spendQuota(db, { goalId: goal.id, amount: 1 });
    spendQuota(db, { goalId: goal.id, amount: 1 });
    assert.equal(checkQuota(db, { goalId: goal.id, maxRuns: 5 }), false, "should not run when quota exhausted");
  } finally { await cleanup(); }
});

test("M12: checkPublicPrivateBoundary — flags private data in public context", async () => {
  const { db, cleanup } = await makeDb();
  try {
    const goal = createGoal(db, { title: "Test goal" });
    recordRun(db, { goalId: goal.id, runId: "run-1", evidence: "public summary", outcome: "success", isPublic: true });
    recordRun(db, { goalId: goal.id, runId: "run-2", evidence: "secret token=abc123", outcome: "success", isPublic: false });
    const boundary = checkPublicPrivateBoundary(db, { goalId: goal.id });
    assert.equal(boundary.ok, true, "no private data in public runs = ok");
    // Record a private evidence as public → boundary violation
    recordRun(db, { goalId: goal.id, runId: "run-3", evidence: "password=hunter2", outcome: "success", isPublic: true });
    const boundary2 = checkPublicPrivateBoundary(db, { goalId: goal.id });
    assert.equal(boundary2.ok, false, "private data in public run = boundary violation");
  } finally { await cleanup(); }
});