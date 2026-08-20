// M6: Ardyn Harness Console — structure verification
import assert from "node:assert/strict";
import { readFile, stat, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const repoRoot = fileURLToPath(new URL("../", import.meta.url));
const consoleDir = join(repoRoot, "apps/console");

test("M6: console app directory exists with package.json", async () => {
  const stats = await stat(join(consoleDir, "package.json"));
  assert.ok(stats.isFile(), "package.json should exist");
});

test("M6: console uses Next.js + React + Tailwind", async () => {
  const pkg = JSON.parse(await readFile(join(consoleDir, "package.json"), "utf8"));
  assert.ok(pkg.dependencies.next, "should depend on next");
  assert.ok(pkg.dependencies.react, "should depend on react");
  assert.ok(pkg.devDependencies.tailwindcss, "should depend on tailwindcss");
});

test("M6: console has all 6 required views", async () => {
  const appDir = join(consoleDir, "src/app");
  const expectedPages = ["page.jsx", "trace/page.jsx", "fixtures/page.jsx",
                         "federation/page.jsx", "runtime/page.jsx", "onboarding/page.jsx"];

  for (const page of expectedPages) {
    try {
      await stat(join(appDir, page));
    } catch {
      assert.fail(`Missing page: ${page}`);
    }
  }
});

test("M6: dashboard page has KPI cards and status section", async () => {
  const dashboard = await readFile(join(consoleDir, "src/app/page.jsx"), "utf8");
  assert.match(dashboard, /kpi/i, "should have KPI references");
  assert.match(dashboard, /Total Tests/i, "should show total tests");
  assert.match(dashboard, /Runtime/i, "should show runtime status");
  assert.match(dashboard, /Federation/i, "should show federation status");
});

test("M6: runtime control page has approval gates and kill switch", async () => {
  const runtime = await readFile(join(consoleDir, "src/app/runtime/page.jsx"), "utf8");
  assert.match(runtime, /approv/i, "should mention approval");
  assert.match(runtime, /kill/i, "should have kill switch");
});

test("M6: federation monitor page shows security invariants", async () => {
  const federation = await readFile(join(consoleDir, "src/app/federation/page.jsx"), "utf8");
  assert.match(federation, /loopback/i, "should mention loopback");
  assert.match(federation, /allowlist/i, "should mention allowlist");
  assert.match(federation, /redirect.*manual/i, "should mention redirect:manual");
});

test("M6: console has accessible layout with nav links", async () => {
  const layout = await readFile(join(consoleDir, "src/app/layout.jsx"), "utf8");
  assert.match(layout, /nav/i, "should have navigation");
  assert.match(layout, /Dashboard|Trace|Fixture|Federation|Runtime|Onboarding/i, "should have nav links");
  assert.match(layout, /lang="en"/i, "should set lang attribute");
});

test("M6: console has global CSS with dark theme", async () => {
  const css = await readFile(join(consoleDir, "src/app/globals.css"), "utf8");
  assert.match(css, /--bg-primary/i, "should have CSS custom properties");
  assert.match(css, /dark.theme/i, "should have dark theme comment");
  assert.match(css, /focus-visible/i, "should have focus-visible for a11y");
});

test("M6: trace viewer has empty/loading states", async () => {
  const trace = await readFile(join(consoleDir, "src/app/trace/page.jsx"), "utf8");
  assert.match(trace, /empty|No active/i, "should have empty state");
  assert.match(trace, /error|Error/i, "should have error state");
  assert.match(trace, /loading|Loading|role="status"/i, "should have loading state");
});

test("M6: onboarding page has step-by-step guide", async () => {
  const onboarding = await readFile(join(consoleDir, "src/app/onboarding/page.jsx"), "utf8");
  assert.match(onboarding, /Install|install/i, "should have install step");
  assert.match(onboarding, /manifest/i, "should have manifest step");
  assert.match(onboarding, /doctor|identity|plan|serve/i, "should have CLI commands");
});