// Shared temp-SQLite test helper.
// Windows root cause of the EBUSY flakes: node:sqlite keeps the DB file (and
// -wal/-shm journals) locked until EVERY connection is closed, and Windows can
// release handles slightly lazily even after close(). The affected tests never
// closed their handles before rmdir — and assertions that throw skipped any
// close that existed. Fix: always close every opened handle in finally, then
// remove with retries. Assertions are untouched — this fixes cleanup only.

import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

export function safeCloseDb(...dbs) {
  for (const db of dbs) {
    try { db?.close?.(); } catch { /* already closed */ }
  }
}

export async function rmTempDir(dir, tries = 8) {
  for (let i = 0; i < tries; i++) {
    try {
      await rm(dir, { recursive: true, force: true, maxRetries: 3, retryDelay: 50 });
      return;
    } catch (e) {
      if (e.code !== "EBUSY" && e.code !== "ENOTEMPTY" && e.code !== "EPERM") throw e;
      await new Promise(r => setTimeout(r, 50));
    }
  }
  // ponytail: if the dir still won't go after ~8 rounds of backoff, leave it —
  // the OS cleans tmpdir; a leftover temp dir must not fail an otherwise-green suite.
}

// Unique temp dir PER CALL + a database created inside it.
// Usage:
//   const t = await makeTempSqliteDb(createMultiUserDatabase);
//   try { ...assertions using t.db... } finally { await t.cleanup(); }
export async function makeTempSqliteDb(openDatabase, filePrefix = "test") {
  const dir = await mkdtemp(join(tmpdir(), "ardyn-test-"));
  const dbPath = join(dir, `${filePrefix}.db`);
  const db = await openDatabase(dbPath);
  return {
    db,
    dir,
    dbPath,
    async cleanup() {
      safeCloseDb(db);
      await rmTempDir(dir);
    },
  };
}
