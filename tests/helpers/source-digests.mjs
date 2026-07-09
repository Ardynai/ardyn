// tests/helpers/source-digests.mjs
// Phase 5.82: Content-based source guards — replaces git-baseline comparisons
// with sha256 digest checks. Platform/mode/line-ending/history independent.
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url));
const manifestUrl = new URL("../fixtures/source-guards/digests.json", import.meta.url);

async function readDigestManifest() {
  return JSON.parse(await readFile(manifestUrl, "utf8"));
}

async function computeDigest(path) {
  const content = await readFile(new URL(`../../${path}`, import.meta.url), "utf8");
  return createHash("sha256").update(content).digest("hex");
}

// ponytail: assertUnchanged recomputes sha256 of each worktree file and
// compares to the committed manifest. NO git calls, NO mode sensitivity.
async function assertUnchanged(paths) {
  const manifest = await readDigestManifest();
  for (const path of paths) {
    const expected = manifest[path];
    assert.ok(expected, `No digest recorded for ${path} in source-guards manifest`);
    const actual = await computeDigest(path);
    assert.equal(
      actual,
      expected,
      `Source file ${path} has changed (sha256 mismatch). ` +
      `If this change is intentional, run: ` +
      `node -e "import('./tests/helpers/source-digests.mjs').then(m=>m.refreshManifest(['${path}']))" ` +
      `and review the delta.`
    );
  }
}

// Regenerate the manifest for the given paths (or all if undefined)
async function refreshManifest(paths) {
  const manifest = await readDigestManifest().catch(() => ({}));
  const allPaths = paths ?? Object.keys(manifest);
  for (const path of allPaths) {
    manifest[path] = await computeDigest(path);
  }
  return manifest;
}

export { assertUnchanged, refreshManifest, readDigestManifest, computeDigest };