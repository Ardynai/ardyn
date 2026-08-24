// Part 1 — Live Session Events: client-facing SSE contract.
// Feeds events through the buffer (what the CLI writes) and asserts the frames
// the EventsFeed EventSource client consumes: `connected` on open, one
// `session_event` per buffered event with JSON payload, and an EMPTY stream
// (zero session_event frames) when nothing has been recorded.
import assert from "node:assert/strict";
import test from "node:test";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const eventsRoute = await import("../apps/console/src/app/api/events/route.js");
const eventBuffer = await import("../apps/console/src/lib/event-buffer.js");

async function withTempCwd(fn) {
  const dir = await mkdtemp(join(tmpdir(), "ardyn-p1-sse-"));
  const prev = process.cwd();
  process.chdir(dir);
  try {
    return await fn(dir);
  } finally {
    process.chdir(prev);
    await rm(dir, { recursive: true, force: true }).catch(() => {});
  }
}

function sseParse(rawText) {
  // Client-side contract parser (mirrors EventSource framing).
  const frames = [];
  for (const block of rawText.split("\n\n")) {
    const lines = block.split("\n").filter(Boolean);
    let event = "message";
    const dataLines = [];
    for (const line of lines) {
      if (line.startsWith("event:")) event = line.slice(6).trim();
      else if (line.startsWith("data:")) dataLines.push(line.slice(5).trim());
    }
    if (dataLines.length) frames.push({ event, data: JSON.parse(dataLines.join("\n")) });
  }
  return frames;
}

async function collectStream(seconds = 2.4) {
  delete process.env.ARDYN_CONSOLE_API_KEY;
  process.env.NODE_ENV = "test";
  const controller = new AbortController();
  setTimeout(() => controller.abort(), seconds * 1000);
  const request = new Request("http://127.0.0.1:3000/api/events", { signal: controller.signal });
  const res = await eventsRoute.GET(request);
  assert.equal(res.status, 200);
  assert.match(res.headers.get("content-type"), /text\/event-stream/);
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let raw = "";
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      raw += decoder.decode(value, { stream: true });
    }
  } catch {
    // abort ends the poll loop
  }
  try { await reader.cancel(); } catch {}
  return sseParse(raw);
}

test("P1: empty buffer → only the connected frame (client shows honest empty state)", async () => {
  await withTempCwd(async () => {
    const frames = await collectStream(2.3);
    assert.ok(frames.length >= 1, "connected frame must arrive");
    assert.equal(frames[0].event, "connected");
    assert.equal(frames[0].data.status, "ok");
    const sessionFrames = frames.filter((f) => f.event === "session_event");
    assert.deepEqual(sessionFrames, [], "no buffered events → zero session_event frames");
  });
});

test("P1: buffered CLI events flow through as session_event frames (live wiring)", async () => {
  await withTempCwd(async () => {
    // The CLI writes exactly this shape via appendEvent (--buffer-events path).
    // SSE semantics: the route TAILS the buffer — events must be written while
    // the client is connected, exactly like a real serve-runtime run.
    const collectPromise = collectStream(2.6);
    await new Promise((r) => setTimeout(r, 500)); // client connected first
    await eventBuffer.appendEvent({ type: "stdout_frame", frame: { event: "start" } });
    await eventBuffer.appendEvent({ type: "session_event", status: "completed", exitCode: 0 });

    const frames = await collectPromise;
    const sessionFrames = frames.filter((f) => f.event === "session_event");
    assert.equal(sessionFrames.length, 2, "both live-buffered events must be delivered");
    assert.equal(sessionFrames[0].data.type, "stdout_frame");
    assert.equal(sessionFrames[1].data.type, "session_event");
    assert.ok(sessionFrames[0].data.buffered_at, "buffer metadata present in payload");
    assert.ok(frames[0].event === "connected", "connected frame still first");
  });
});
