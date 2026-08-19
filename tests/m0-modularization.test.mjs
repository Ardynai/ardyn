// M0.6: Test that modularization preserves the API surface
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const repoRoot = fileURLToPath(new URL("../", import.meta.url));

test("M0.6: internal/utils.mjs exists and exports shared utilities", async () => {
  const utils = await import("../packages/core/src/internal/utils.mjs");
  assert.equal(typeof utils.isPlainObjectRecord, "function");
  assert.equal(typeof utils.isUtcIsoTimestampWithMilliseconds, "function");
  assert.equal(typeof utils.isReviewedAtDefaulted, "function");
  assert.ok(utils.UTC_ISO_TIMESTAMP_WITH_MILLISECONDS_PATTERN instanceof RegExp);
});

test("M0.6: index.mjs imports from internal/utils.mjs", async () => {
  const src = await readFile(join(repoRoot, "packages/core/src/index.mjs"), "utf8");
  assert.match(src, /from\s+["']\.\/internal\/utils\.mjs["']/, "index.mjs should import from internal/utils.mjs");
});

test("M0.6: index.mjs re-exports the shared utilities", async () => {
  const core = await import("../packages/core/src/index.mjs");
  assert.equal(typeof core.isPlainObjectRecord, "function");
  assert.equal(typeof core.isUtcIsoTimestampWithMilliseconds, "function");
  assert.equal(typeof core.isReviewedAtDefaulted, "function");
});

test("M0.6: extracted utilities work correctly", async () => {
  const { isPlainObjectRecord, isUtcIsoTimestampWithMilliseconds, isReviewedAtDefaulted } =
    await import("../packages/core/src/internal/utils.mjs");

  // isPlainObjectRecord
  assert.equal(isPlainObjectRecord({}), true);
  assert.equal(isPlainObjectRecord(null), false);
  assert.equal(isPlainObjectRecord([]), false);
  assert.equal(isPlainObjectRecord("string"), false);

  // isUtcIsoTimestampWithMilliseconds
  assert.equal(isUtcIsoTimestampWithMilliseconds("2026-07-09T00:00:00.000Z"), true);
  assert.equal(isUtcIsoTimestampWithMilliseconds("not-a-date"), false);
  assert.equal(isUtcIsoTimestampWithMilliseconds("2026-07-09T00:00:00Z"), false); // missing .SSS

  // isReviewedAtDefaulted
  assert.equal(isReviewedAtDefaulted({ reviewedAt: "2026-07-09T00:00:00.000Z" }), false);
  assert.equal(isReviewedAtDefaulted({}), true);
  assert.equal(isReviewedAtDefaulted(null), true);
  assert.equal(isReviewedAtDefaulted({ reviewedAt: "bad" }), true);
});

test("M0.6: index.mjs is smaller than the original 73406 lines", async () => {
  const src = await readFile(join(repoRoot, "packages/core/src/index.mjs"), "utf8");
  const lines = src.split("\n").length;
  // The original was 73406 lines. After extraction it should be smaller.
  assert.ok(lines < 73406, `index.mjs should be < 73406 lines, got ${lines}`);
});