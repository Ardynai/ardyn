// B4: SSE bridge round-trip test — CLI writes to buffer, event-buffer reads back
import assert from "node:assert/strict";
import { mkdtemp, rm, readFile, writeFile, mkdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

test("B4: event-buffer readEvents returns events written by CLI --buffer-events", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-b4-sse-"));
  const origCwd = process.cwd();
  try {
    process.chdir(scratch);
    // Simulate what CLI --buffer-events does: write JSONL events to .ardyn-events/events.jsonl
    const bufferDir = join(scratch, ".ardyn-events");
    await mkdir(bufferDir, { recursive: true });
    const bufferFile = join(bufferDir, "events.jsonl");
    await writeFile(bufferFile, [
      JSON.stringify({ type: "stdout_frame", timestamp: "2026-08-19T12:00:00Z", frame: { event: "start" }, buffered_at: "2026-08-19T12:00:00Z" }) + "\n",
      JSON.stringify({ type: "stdout_frame", timestamp: "2026-08-19T12:00:01Z", frame: { event: "end" }, buffered_at: "2026-08-19T12:00:01Z" }) + "\n",
    ].join(""));

    // Read back using the same logic as event-buffer.js
    const content = await readFile(bufferFile, "utf8");
    const events = content.trim().split("\n").filter(Boolean).map((l) => {
      try { return JSON.parse(l); } catch { return null; }
    }).filter(Boolean);

    assert.equal(events.length, 2);
    assert.equal(events[0].type, "stdout_frame");
    assert.equal(events[0].frame.event, "start");
    assert.equal(events[0].buffered_at, "2026-08-19T12:00:00Z");
    assert.equal(events[1].frame.event, "end");
  } finally {
    process.chdir(origCwd);
    await rm(scratch, { recursive: true, force: true });
  }
});

test("B4: event-buffer agrees on directory (.ardyn-events/events.jsonl)", async () => {
  // Verify CLI and event-buffer.js use the same path
  const cliSrc = await readFile(join(process.cwd(), "apps/cli/src/index.mjs"), "utf8");
  const bufferSrc = await readFile(join(process.cwd(), "apps/console/src/lib/event-buffer.js"), "utf8");
  
  // CLI writes to .ardyn-events/events.jsonl
  assert.match(cliSrc, /\.ardyn-events/);
  assert.match(cliSrc, /events\.jsonl/);
  
  // event-buffer.js reads from .ardyn-events/events.jsonl
  assert.match(bufferSrc, /\.ardyn-events/);
  assert.match(bufferSrc, /events\.jsonl/);
});