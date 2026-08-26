// M6: Event buffer — bridges CLI SSE output to console API.
// CLI appends events to a file-based buffer; console API tails them.
//
// U4 fixes:
//  - appendEvent uses fs.appendFile (no more whole-file read-modify-write,
//    which was O(file) per append and could interleave concurrent writers).
//  - The file is SIZE-CAPPED: when it grows past ARDYN_EVENTS_MAX_BYTES
//    (default 1 MiB) it is rotated down to its newest half, so local disks
//    never fill with stale session noise.
//  - Byte-offset tailing (readEventsFromOffset) replaces wall-clock filtering
//    for live streams: an offset can never skip events written between two
//    Date.now() reads. readEvents(since) remains for compatibility.

import { appendFile, readFile, writeFile, mkdir, stat } from "node:fs/promises";
import { join } from "node:path";

const DEFAULT_MAX_BYTES = 1_000_000;

function maxBytes() {
  const raw = Number(process.env.ARDYN_EVENTS_MAX_BYTES);
  return Number.isFinite(raw) && raw > 0 ? raw : DEFAULT_MAX_BYTES;
}

// Lazy-evaluate buffer paths so process.cwd() changes are respected
function getBufferDir() { return join(process.cwd(), ".ardyn-events"); }
function getBufferFile() { return join(getBufferDir(), "events.jsonl"); }

function encodeLine(event) {
  return JSON.stringify({ ...event, buffered_at: new Date().toISOString() }) + "\n";
}

export async function appendEvent(event) {
  const bufferDir = getBufferDir();
  await mkdir(bufferDir, { recursive: true });
  const line = encodeLine(event);
  await appendFile(getBufferFile(), line, "utf8");
  await rotateIfOversized();
}

// Keep the newest content under the byte cap by dropping the oldest half.
async function rotateIfOversized() {
  const file = getBufferFile();
  let size = 0;
  try { size = (await stat(file)).size; } catch { return; }
  const cap = maxBytes();
  if (size <= cap) return;
  const content = await readFile(file, "utf8").catch(() => "");
  const lines = content.split("\n");
  // Drop oldest lines until we are under ~half the cap.
  let kept = [];
  let bytes = 0;
  const budget = Math.floor(cap / 2);
  for (let i = lines.length - 1; i >= 0; i -= 1) {
    const candidate = lines[i];
    bytes += Buffer.byteLength(candidate, "utf8") + 1;
    if (bytes > budget) break;
    kept.unshift(candidate);
  }
  const keptText = kept.filter(Boolean).join("\n");
  await writeFile(file, keptText ? keptText + "\n" : "", "utf8");
}

function parseLines(text) {
  return text
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      try { return JSON.parse(line); } catch { return null; }
    })
    .filter(Boolean);
}

// Legacy keyword-style read: whole file, filtered by buffered_at timestamp.
export async function readEvents(since = 0) {
  try {
    const content = await readFile(getBufferFile(), "utf8");
    return parseLines(content).filter((e) => new Date(e.buffered_at).getTime() > since);
  } catch {
    return [];
  }
}

// Current end-of-file byte offset (0 if the buffer does not exist yet).
export async function currentOffset() {
  try { return (await stat(getBufferFile())).size; } catch { return 0; }
}

// U4: offset-based tail. Reads only COMPLETE jsonl lines at or after
// `offset`; returns the parsed events plus the new offset (end of the last
// consumed newline). A trailing partial line is left unconsumed. If the file
// shrank below the offset (rotation/truncation), the reader resets to 0 so
// events written after rotation are still delivered.
export async function readEventsFromOffset(offset = 0) {
  let content;
  try { content = await readFile(getBufferFile(), "utf8"); } catch { return { events: [], nextOffset: 0 }; }
  const safeOffset = Number.isFinite(offset) && offset >= 0 && offset <= Buffer.byteLength(content, "utf8")
    ? Math.floor(offset)
    : 0;
  const slice = content.slice(safeOffset);
  const lastNewline = slice.lastIndexOf("\n");
  if (lastNewline === -1) return { events: [], nextOffset: safeOffset };
  const complete = slice.slice(0, lastNewline + 1);
  return {
    events: parseLines(complete),
    nextOffset: safeOffset + Buffer.byteLength(complete, "utf8"),
  };
}

export async function clearEvents() {
  try { await writeFile(getBufferFile(), ""); } catch {}
}
