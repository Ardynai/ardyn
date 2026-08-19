// tests/helpers/glob-source-guards.mjs
// M0.2: Glob-based source guards — scans all files matching a glob pattern
// instead of a single hardcoded file. Prevents silent guard bypass when
// index.mjs is modularized into src/phases/*.mjs etc.
import { readFile, readdir, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join, relative } from "node:path";
import assert from "node:assert/strict";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url));

// Recursively collect all .mjs files under a directory
async function collectMjsFiles(dirAbs) {
  const results = [];
  let entries;
  try {
    entries = await readdir(dirAbs, { withFileTypes: true });
  } catch {
    return results;
  }
  for (const entry of entries) {
    const fullPath = join(dirAbs, entry.name);
    if (entry.isDirectory()) {
      results.push(...await collectMjsFiles(fullPath));
    } else if (entry.name.endsWith(".mjs")) {
      results.push(fullPath);
    }
  }
  return results;
}

// Read all .mjs files under a directory relative to repo root, concatenate
// them with filename headers so pattern checks see the full code surface.
async function readGlobSource(dirRel) {
  const dirAbs = join(repoRoot, dirRel);
  const files = await collectMjsFiles(dirAbs);
  if (files.length === 0) {
    // Fall back to direct file read if no .mjs files in dir (e.g., single file)
    const directPath = join(dirAbs);
    try {
      const content = await readFile(directPath, "utf8");
      return { content, files: [directPath] };
    } catch {
      return { content: "", files: [] };
    }
  }
  const parts = [];
  for (const f of files.sort()) {
    const rel = relative(repoRoot, f);
    const content = await readFile(f, "utf8");
    parts.push(`// === ${rel} ===\n${content}`);
  }
  return { content: parts.join("\n"), files };
}

// Assert that a pattern does NOT match any source file in the given directories
async function assertDoesNotMatchGlob(patterns, dirs, label = "") {
  for (const dir of dirs) {
    const { content, files } = await readGlobSource(dir);
    assert.ok(files.length > 0, `No source files found under ${dir} for guard check${label ? ": " + label : ""}`);
    for (const pattern of patterns) {
      assert.doesNotMatch(
        content,
        pattern,
        `Forbidden pattern ${pattern} found in ${dir} (${files.length} files scanned)${label ? ": " + label : ""}`
      );
    }
  }
}

export { collectMjsFiles, readGlobSource, assertDoesNotMatchGlob, repoRoot };