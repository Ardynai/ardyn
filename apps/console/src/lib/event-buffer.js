// M6: Event buffer — bridges CLI SSE output to console API
// CLI writes events to a file-based buffer; console API reads them.
// This is a simple file-based message queue for local dev mode.

import { writeFile, readFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { existsSync } from "node:fs";

const BUFFER_DIR = join(process.cwd(), ".ardyn-events");
const BUFFER_FILE = join(BUFFER_DIR, "events.jsonl");

export async function appendEvent(event) {
  await mkdir(BUFFER_DIR, { recursive: true });
  const line = JSON.stringify({ ...event, buffered_at: new Date().toISOString() }) + "\n";
  try {
    const existing = await readFile(BUFFER_FILE, "utf8").catch(() => "");
    await writeFile(BUFFER_FILE, existing + line);
  } catch {
    await writeFile(BUFFER_FILE, line);
  }
}

export async function readEvents(since = 0) {
  try {
    const content = await readFile(BUFFER_FILE, "utf8");
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
    await writeFile(BUFFER_FILE, "");
  } catch {}
}