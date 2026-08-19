// M0.1: Verify security.yml has toolchain: stable on the rust-toolchain step
// so the weekly scan doesn't hard-fail.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import test from "node:test";

const securityYmlPath = fileURLToPath(new URL("../.github/workflows/security.yml", import.meta.url));

test("M0.1: security.yml rust-toolchain step specifies toolchain: stable", async () => {
  const content = await readFile(securityYmlPath, "utf8");
  // Must contain dtolnay/rust-toolchain with `with: toolchain: stable`
  assert.match(content, /dtolnay\/rust-toolchain/, "security.yml must use dtolnay/rust-toolchain");
  assert.match(content, /toolchain:\s*stable/, "security.yml rust-toolchain must specify toolchain: stable");
  // Verify the `with:` block is associated with the rust-toolchain step
  const toolchainStepMatch = content.match(
    /- uses:\s*dtolnay\/rust-toolchain[^\n]*\n\s+with:\s*\n\s+toolchain:\s*stable/
  );
  assert.ok(toolchainStepMatch, "rust-toolchain step must have a `with:` block containing `toolchain: stable`");
});

test("M0.1: security.yml installs cargo-audit before running cargo audit", async () => {
  const content = await readFile(securityYmlPath, "utf8");
  // cargo audit is a separate binary, not part of the toolchain — must be installed
  assert.match(content, /cargo[\s-]*install[\s-]*audit|cargo-audit/i,
    "security.yml must install cargo-audit (it's not part of the default toolchain)");
});

test("M0.1: security.yml runs npm audit, cargo audit, and osv-scanner", async () => {
  const content = await readFile(securityYmlPath, "utf8");
  assert.match(content, /npm audit/, "security.yml must run npm audit");
  assert.match(content, /cargo audit/, "security.yml must run cargo audit");
  assert.match(content, /osv-scanner/, "security.yml must run osv-scanner");
});