// Tier 2 closeout tests: U4 (bounded, offset-tailed event buffer) and
// U5 (?token= auth for /api/events so EventSource can connect securely).
import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

const bufferLib = await import("../apps/console/src/lib/event-buffer.js");
const eventsRoute = await import("../apps/console/src/app/api/events/route.js");
const authLib = await import("../apps/console/src/lib/auth.js");

let savedCwd = null;
let savedEnv = null;

async function isolateBufferDir(t, { env = {} } = {}) {
  const dir = await mkdtemp(join(tmpdir(), "u-tier2-"));
  savedCwd = process.cwd();
  savedEnv = { ...process.env };
  process.chdir(dir);
  Object.assign(process.env, env);
  return dir;
}

function restore() {
  if (savedCwd) process.chdir(savedCwd);
  if (savedEnv) {
    for (const k of Object.keys(process.env)) {
      if (!(k in savedEnv)) delete process.env[k];
    }
    Object.assign(process.env, savedEnv);
  }
  savedCwd = null;
  savedEnv = null;
}

// Mirrors m24's proven stream lifecycle verbatim (timer-based abort while the
// read loop is parked, then cancel) — this is the teardown order undici
// handles deterministically.
async function collectFirstFrame(url) {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), 900);
  const request = new Request(url, { signal: controller.signal });
  const res = await eventsRoute.GET(request);
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let raw = "";
  let first = null;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      raw += decoder.decode(value, { stream: true });
      if (!first && raw.includes("event: connected")) first = { value };
    }
  } catch {
    // abort ends the poll loop
  }
  try { await reader.cancel(); } catch {}
  return { res, reader, first: first ?? { timeout: raw.length === 0 } };
}

// ── U4 ──

test("U4: appendEvent appends without rewriting and stays under the byte cap (rotation)", async () => {
  const dir = await isolateBufferDir(null, { env: { ARDYN_EVENTS_MAX_BYTES: "1200" } });
  try {
    for (let i = 0; i < 40; i += 1) {
      await bufferLib.appendEvent({ type: "rotate-check", index: i, filler: "x".repeat(60) });
    }
    const size = (await stat(join(dir, ".ardyn-events", "events.jsonl"))).size;
    assert.ok(size <= 1200, `file must be capped near the limit, got ${size} bytes`);
    // Newest events survive rotation.
    const recent = await bufferLib.readEvents(0);
    assert.ok(recent.length > 0 && recent.length < 40, "rotation keeps a bounded window of newest events");
    assert.equal(recent[recent.length - 1].index, 39, "newest event intact");
  } finally {
    restore();
    await rm(dir, { recursive: true, force: true }).catch(() => {});
  }
});

test("U4: offset tailing delivers every frame exactly once, in order (no drops)", async () => {
  await isolateBufferDir(null);
  try {
    const N = 25;
    let offset = await bufferLib.currentOffset();
    assert.equal(offset, 0, "fresh buffer starts empty");
    const seen = [];
    for (let i = 0; i < N; i += 1) {
      await bufferLib.appendEvent({ type: "ordered", seq: i });
      const { events, nextOffset } = await bufferLib.readEventsFromOffset(offset);
      offset = nextOffset;
      seen.push(...events.map((e) => e.seq));
    }
    assert.deepEqual(seen, Array.from({ length: N }, (_, i) => i), "no dropped or duplicated frames");
  } finally {
    restore();
  }
});

test("U4: an offset captured earlier never replays old events (skip-fix)", async () => {
  await isolateBufferDir(null);
  try {
    await bufferLib.appendEvent({ type: "old", marker: "before" });
    const offsetAtMark = await bufferLib.currentOffset();
    await bufferLib.appendEvent({ type: "new", marker: "after" });
    const { events } = await bufferLib.readEventsFromOffset(offsetAtMark);
    assert.equal(events.length, 1, "exactly the post-offset event");
    assert.equal(events[0].marker, "after");
    // Partial trailing line is left unconsumed, then completed on the next poll.
    const { writeFile: wf, appendFile } = await import("node:fs/promises");
    await wf(join(process.cwd(), ".ardyn-events", "events.jsonl"), "");
    await appendFile(join(process.cwd(), ".ardyn-events", "events.jsonl"), '{"type":"partial"}'); // no newline yet
    let r1 = await bufferLib.readEventsFromOffset(0);
    assert.deepEqual(r1.events, [], "partial line is not emitted early");
    await appendFile(join(process.cwd(), ".ardyn-events", "events.jsonl"), "\n");
    r1 = await bufferLib.readEventsFromOffset(0);
    assert.equal(r1.events.length, 1, "completed line is emitted once newline arrives");
  } finally {
    restore();
  }
});

// ── U5 ──

test("U5: secured events route rejects missing/wrong tokens", async () => {
  await isolateBufferDir(null, { env: { NODE_ENV: "test", ARDYN_CONSOLE_API_KEY: "secret-key-123" } });
  try {
    const noToken = await eventsRoute.GET(new Request("http://127.0.0.1:3000/api/events"));
    assert.equal(noToken.status, 401, "header-less, token-less request must be rejected when a key is set");
    const badToken = await eventsRoute.GET(new Request("http://127.0.0.1:3000/api/events?token=wrong"));
    assert.equal(badToken.status, 401, "wrong token must be rejected");
  } finally {
    restore();
  }
});

test("U5: correct ?token= connects the SSE stream (EventSource-compatible auth)", async () => {
  await isolateBufferDir(null, { env: { NODE_ENV: "test", ARDYN_CONSOLE_API_KEY: "secret-key-123" } });
  try {
    const { res, first } = await collectFirstFrame("http://127.0.0.1:3000/api/events?token=secret-key-123");
    try {
      assert.equal(res.status, 200);
      assert.match(res.headers.get("content-type") ?? "", /text\/event-stream/);
      assert.ok(first && !first.timeout && first.value, "connected frame must arrive");
      assert.match(new TextDecoder().decode(first.value), /event: connected/);
    } finally {
      await new Promise((r) => setTimeout(r, 20));
    }
  } finally {
    restore();
  }
});

test("U5: per-user tokens authenticate with userId attribution", async () => {
  await isolateBufferDir(null, {
    env: {
      NODE_ENV: "test",
      ARDYN_CONSOLE_API_KEY: "admin-key",
      ARDYN_CONSOLE_USER_TOKENS: JSON.stringify({ alice: "alice-user-token" }),
    },
  });
  try {
    const verdict = authLib.verifyEventsToken("alice-user-token");
    assert.equal(verdict.ok, true);
    assert.equal(verdict.mode, "user");
    assert.equal(verdict.userId, "alice");

    // And through the route itself:
    const { res, first } = await collectFirstFrame("http://127.0.0.1:3000/api/events?token=alice-user-token");
    try {
      assert.equal(res.status, 200);
      assert.ok(first && !first.timeout, "per-user token must open the stream");
    } finally {
      await new Promise((r) => setTimeout(r, 20));
    }

    // Garbage user-tokens JSON fails closed rather than crashing.
    process.env.ARDYN_CONSOLE_USER_TOKENS = "{not json";
    assert.equal(authLib.verifyEventsToken("alice-user-token").ok, false);
  } finally {
    restore();
  }
});

test("U5: production without a configured key stays fail-closed even with a guessed token", async () => {
  await isolateBufferDir(null, { env: { NODE_ENV: "production" } });
  delete process.env.ARDYN_CONSOLE_API_KEY;
  try {
    const verdict = authLib.verifyEventsToken("anything");
    assert.equal(verdict.ok, false, "no key configured -> nothing can match");
    const res = await eventsRoute.GET(new Request("http://127.0.0.1:3000/api/events?token=anything"));
    assert.equal(res.status, 401);
  } finally {
    restore();
  }
});
