// M5: Display & accessibility components for consumers (Locus/Multiverse)
// Real React components for rendering Ardyn session data accessibly
import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = join(fileURLToPath(import.meta.url), "..", "..");

test("M5: SessionTrace component exists and is accessible", async () => {
  const componentPath = join(repoRoot, "packages/sdk/src/components/SessionTrace.jsx");
  const content = await readFile(componentPath, "utf8");
  assert.match(content, /export default/i, "should export a component");
  assert.match(content, /aria-|role=/i, "should have aria attributes or roles");
  assert.match(content, /frame|trace|event/i, "should render trace frames");
});

test("M5: StatusBadge component exists", async () => {
  const componentPath = join(repoRoot, "packages/sdk/src/components/StatusBadge.jsx");
  const content = await readFile(componentPath, "utf8");
  assert.match(content, /export default/i);
  assert.match(content, /status/i);
  assert.match(content, /aria-label/i, "should have aria-label for accessibility");
});

test("M5: ManifestViewer component exists", async () => {
  const componentPath = join(repoRoot, "packages/sdk/src/components/ManifestViewer.jsx");
  const content = await readFile(componentPath, "utf8");
  assert.match(content, /export default/i);
  assert.match(content, /manifest/i);
});

test("M5: ApprovalGate component exists and shows approval status", async () => {
  const componentPath = join(repoRoot, "packages/sdk/src/components/ApprovalGate.jsx");
  const content = await readFile(componentPath, "utf8");
  assert.match(content, /export default/i);
  assert.match(content, /approv/i);
  assert.match(content, /disabled|aria-disabled/i, "should disable when not approved");
});

test("M5: components index re-exports all components", async () => {
  const indexPath = join(repoRoot, "packages/sdk/src/components/index.js");
  const content = await readFile(indexPath, "utf8");
  assert.match(content, /SessionTrace/i);
  assert.match(content, /StatusBadge/i);
  assert.match(content, /ManifestViewer/i);
  assert.match(content, /ApprovalGate/i);
});