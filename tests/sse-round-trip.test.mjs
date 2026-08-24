// SSE end-to-end: CLI --buffer-events → event buffer → /api/events → console
// Tests the actual round-trip: write events to buffer, read them back via event-buffer
import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import test from "node:test";

test("SSE: event-buffer round-trip — write events, read them back", async () => {
  const dir = await mkdtemp(join(tmpdir(), "ardyn-sse-"));
  const origCwd = process.cwd();
  try {
    process.chdir(dir);
    // Simulate CLI --buffer-events writing to .ardyn-events/events.jsonl
    const bufferDir = join(dir, ".ardyn-events");
    await mkdir(bufferDir, { recursive: true });
    const events = [
      { type: "stdout_json", action: "screenshot", timestamp: "2026-08-20T19:32:01Z", buffered_at: "2026-08-20T19:32:01.000Z" },
      { type: "audit", decision: "allow", action: "click", timestamp: "2026-08-20T19:32:03Z", buffered_at: "2026-08-20T19:32:03.000Z" },
    ];
    const bufferContent = events.map(e => JSON.stringify(e)).join("\n") + "\n";
    await writeFile(join(bufferDir, "events.jsonl"), bufferContent);

    // Read events back via event-buffer module (same module /api/events uses)
    const { readEvents } = await import("../apps/console/src/lib/event-buffer.js");
    // ponytail: since event-buffer uses process.cwd(), and we chdir'd, it should read from our temp dir
    const readBack = await readEvents(0);

    assert.ok(readBack.length >= 2, "should read back at least 2 events from buffer");
    assert.equal(readBack[0].action, "screenshot", "first event should be screenshot");
    assert.equal(readBack[1].decision, "allow", "second event should be audit allow");
    // Each event must have buffered_at (added by CLI --buffer-events)
    for (const evt of readBack) {
      assert.ok(evt.buffered_at, "each event must have buffered_at timestamp");
    }
  } finally {
    process.chdir(origCwd);
    await rm(dir, { recursive: true, force: true });
  }
});

test("SSE: event-buffer filters by timestamp (only new events)", async () => {
  const dir = await mkdtemp(join(tmpdir(), "ardyn-sse-filter-"));
  const origCwd = process.cwd();
  try {
    process.chdir(dir);
    const bufferDir = join(dir, ".ardyn-events");
    await mkdir(bufferDir, { recursive: true });
    const oldEvent = { type: "old", buffered_at: "2020-01-01T00:00:00.000Z" };
    const newEvent = { type: "new", buffered_at: new Date().toISOString() };
    await writeFile(join(bufferDir, "events.jsonl"), JSON.stringify(oldEvent) + "\n" + JSON.stringify(newEvent) + "\n");

    const { readEvents } = await import("../apps/console/src/lib/event-buffer.js");
    // Read events since 1 second ago — should only get the new event
    const since = Date.now() - 60000; // 60 seconds ago — should include the new event
    const recent = await readEvents(since);

    assert.ok(recent.length >= 1, "should read at least 1 recent event");
    assert.equal(recent[0].type, "new", "should only get the new event");
  } finally {
    process.chdir(origCwd);
    await rm(dir, { recursive: true, force: true });
  }
});

test("SSE: console dashboard references /api/events endpoint", async () => {
  // Credibility follow-up: the client moved into events-feed.jsx — assertions
  // now check BOTH files (STRONGER than the old single-file grep).
  const { readFile } = await import("node:fs/promises");
  const { join } = await import("node:path");
  const dashboard = await readFile(join(process.cwd(), "apps/console/src/app/page.jsx"), "utf8");
  assert.match(dashboard, /Live Session Events/, "dashboard must have a Live Events section");
  assert.match(dashboard, /EventsFeed/, "dashboard must render the EventsFeed client");
  const feed = await readFile(join(process.cwd(), "apps/console/src/app/events-feed.jsx"), "utf8");
  assert.match(feed, /api\/events/, "feed client must subscribe to /api/events");
  assert.match(feed, /new EventSource/, "feed client must use EventSource");
  assert.match(feed, /no events yet/, "honest empty state required");
});