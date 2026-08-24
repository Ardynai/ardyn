// Export-surface guard (Part 1 durability requirement):
// 1) the sorted set of named exports from packages/core/src/index.mjs must be
//    byte-identical to the committed fixture (tests/fixtures/export-surface.json);
// 2) when git metadata is available, it must ALSO match origin/main's set
//    (the surface is FROZEN for the modularization refactor).
// Adding/removing an export requires a deliberate fixture update + review.
import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("../", import.meta.url));
const indexPath = new URL("../packages/core/src/index.mjs", import.meta.url);
const fixturePath = new URL("./fixtures/export-surface.json", import.meta.url);

export function extractExportNames(source) {
  const names = new Set();
  for (const m of source.matchAll(/^export (?:async )?(?:function|const|class) ([A-Za-z_$][\w$]*)/gm)) {
    names.add(m[1]);
  }
  for (const m of source.matchAll(/^export \{([^}]+)\}/gm)) {
    for (let part of m[1].split(",")) {
      part = part.trim();
      if (!part) continue;
      const as = part.match(/as\s+([A-Za-z_$][\w$]*)\s*$/);
      names.add(as ? as[1] : part.split(/\s+as\s+/)[0].trim());
    }
  }
  return [...names].sort();
}

test("export surface matches the frozen fixture", async () => {
  const source = await readFile(indexPath, "utf8");
  const actual = extractExportNames(source);
  const expected = JSON.parse(await readFile(fixturePath, "utf8"));
  assert.deepEqual(actual, expected, "named export set changed — update fixtures/export-surface.json deliberately");
});

test("export surface matches origin/main (frozen during modularization)", async () => {
  let base;
  try {
    base = execFileSync("git", ["show", "origin/main:packages/core/src/index.mjs"], {
      cwd: repoRoot,
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024,
    });
  } catch {
    // no git / no origin/main available → skip rather than fail hermetic runs
    return;
  }
  const actual = extractExportNames(await readFile(indexPath, "utf8"));
  const expected = extractExportNames(base);
  assert.deepEqual(actual, expected, "PUBLIC SURFACE CHANGED vs origin/main — not allowed without explicit authorization");
});
