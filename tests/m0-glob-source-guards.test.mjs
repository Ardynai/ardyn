// M0.2: Test the glob-based source guard helper
import assert from "node:assert/strict";
import test from "node:test";
import { readGlobSource, assertDoesNotMatchGlob, repoRoot } from "./helpers/glob-source-guards.mjs";

test("M0.2: readGlobSource finds all .mjs files in a directory", async () => {
  const { content, files } = await readGlobSource("packages/core/src");
  assert.ok(files.length > 0, "should find at least one .mjs file in packages/core/src");
  assert.ok(content.length > 0, "content should not be empty");
  // Currently index.mjs is the only file, but after modularization there will be more
  assert.ok(content.includes("export"), "content should include export statements");
});

test("M0.2: readGlobSource handles directories with no .mjs files gracefully", async () => {
  const { content, files } = await readGlobSource("docs");
  assert.equal(files.length, 0, "docs dir has no .mjs files");
  assert.equal(content, "", "content should be empty");
});

test("M0.2: assertDoesNotMatchGlob catches forbidden patterns", async () => {
  // This should pass — no WebSocket in packages/core/src (it's a forbidden pattern)
  await assertDoesNotMatchGlob([/\bWebSocket\b/], ["packages/core/src"], "test pattern");
});

test("M0.2: assertDoesNotMatchGlob detects patterns when present", async () => {
  // This should fail — 'export' is definitely in the source
  await assert.rejects(
    assertDoesNotMatchGlob([/export/], ["packages/core/src"], "should find export"),
    /Forbidden pattern/
  );
});

test("M0.2: glob guard scans fabric source correctly", async () => {
  const { files } = await readGlobSource("packages/fabric/src");
  assert.ok(files.length >= 2, "fabric/src should have at least 2 .mjs files (index.mjs + federation.mjs)");
});