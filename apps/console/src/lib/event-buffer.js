// M6: Event buffer — bridges CLI SSE output to console API
// CLI writes events to a file-based buffer; console API reads them.
// This is a simple file-based message queue for local dev mode.

import { writeFile, readFile, mkdir } from "node:fs/promises";
import { join } from "node:path";

// Lazy-evaluate buffer paths so process.cwd() changes are respected
function getBufferDir() { return join(process.cwd(), ".ardyn-events"); }
function getBufferFile() { return join(getBufferDir(), "events.jsonl"); }

export async function appendEvent(event) {
  const bufferDir = getBufferDir();
  await mkdir(bufferDir, { recursive: true });
  const line = JSON.stringify({ ...event, buffered_at: new Date().toISOString() }) + "\n";
  try {
    const existing = await readFile(getBufferFile(), "utf8").catch(() => "");
    await writeFile(getBufferFile(), existing + line);
  } catch {
    await writeFile(getBufferFile(), line);
  }
}

export async function readEvents(since = 0) {
  try {
    const content = await readFile(getBufferFile(), "utf8");
    return content
      .trim()
      .split("\n")
      .filter(Boolean)
      .map((line) => {
        try { return JSON.parse(line); } catch { return null; }
      })
      .filter(Boolean)
      .filter((e) => new Date(e.buffered_at).getTime() > since);
  } catch {
    return [];
  }
}

export async function clearEvents() {
  try {
    await writeFile(getBufferFile(), "");
  } catch {}
}