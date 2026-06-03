import assert from "node:assert/strict";
import { readdir, readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";
import { FABRIC_HARNESSES } from "@ardyn/fabric";

const root = process.cwd();
const allowedLegacySlugFiles = new Set(["tests/fabric.test.mjs"]);

async function readText(path) {
  return readFile(join(root, path), "utf8");
}

async function listRepoFiles(dir = root) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.name === ".git" || entry.name === "node_modules" || entry.name === "target") {
      continue;
    }

    const absolute = join(dir, entry.name);
    const relative = absolute.slice(root.length + 1).replaceAll("\\", "/");

    if (entry.isDirectory()) {
      files.push(...(await listRepoFiles(absolute)));
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    const details = await stat(absolute);
    if (details.size > 1_000_000) {
      continue;
    }

    files.push(relative);
  }

  return files.sort();
}

test("canonical Locus-facing ARDYN slug is documented as ardyn", async () => {
  const doc = await readText("docs/harness-identity.md");

  assert.match(doc, /canonical harness slug is `ardyn`/i);
  assert.match(doc, /Future Locus connector expected id/i);
  assert.match(doc, /Multiverse integration remains optional and external/i);
  assert.doesNotMatch(doc, /\bardynos\b/i);
});

test("Fabric family set is exact and includes Locus-aligned ARDYN families", () => {
  assert.deepEqual([...FABRIC_HARNESSES], [
    "*",
    "locus",
    "multiverse",
    "kortex-audio",
    "locus-evolution-lab",
    "somatic",
    "ardyn"
  ]);
});

test("stale ARDYN harness slug appears only in explicit negative tests", async () => {
  const files = await listRepoFiles();
  const hits = [];

  for (const file of files) {
    const text = await readText(file);
    if (/\bardynos\b/i.test(text)) {
      hits.push(file);
    }
  }

  assert.deepEqual(hits, [...allowedLegacySlugFiles]);
});

test("Locus display contract has a Phase 3.x freeze marker and stays viewer-only", async () => {
  const doc = await readText("docs/locus-trace-display-contract.md");

  assert.match(doc, /PHASE_3_X_LOCUS_DISPLAY_CONTRACT_FROZEN/);
  assert.match(doc, /Phase 3\.x read-only display contract is frozen/i);
  assert.match(doc, /must not cause ARDYN to start, connect,\s+install, execute, or fetch anything/i);
});

test("stdio session-event contract is documented without runtime transport", async () => {
  const doc = await readText("docs/session-events-stdio-contract.md");

  assert.match(doc, /stdio-first contract, not a stdio runtime/i);
  assert.match(doc, /sourceHarness: "ardyn"/);
  assert.match(doc, /WebSocket and HTTP transports are later work/i);
  assert.match(doc, /must not be interpreted as permission/i);
});
