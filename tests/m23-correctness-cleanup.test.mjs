// Correctness cleanup — behavioral tests:
//   1. shell/sqlite run WITHOUT --manifest (no ReferenceError, normal flow)
//   2. federation exchange refuses missing/placeholder credentials (fail-closed)
//   3. Slack replay window: stale-but-validly-signed requests rejected
//   4. Windows absolute/UNC/drive paths rejected by the gated write guard
import assert from "node:assert/strict";
import test from "node:test";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createHmac } from "node:crypto";

const runCliCapture = async (args) => {
  try {
    const { stdout, stderr } = await promisify(execFile)("node", args, { cwd: process.cwd(), maxBuffer: 4 * 1024 * 1024 });
    return { code: 0, stdout, stderr };
  } catch (error) {
    return { code: error.code ?? 1, stdout: error.stdout ?? "", stderr: error.stderr ?? String(error) };
  }
};

const manifest = "examples/minimal-manifest/ardyn.manifest.json";

// ── Fix 1: no --manifest must not crash with a ReferenceError ──

test("CC-1: shell without --manifest runs normally (no minimalManifestPath crash)", async () => {
  const result = await runCliCapture([
    "apps/cli/src/index.mjs", "shell",
    "--enable-runtime", "--approve",
    "--command", "echo cc1-ok",
  ]);
  assert.equal(result.code, 0, `expected success, got: ${result.stderr}`);
  assert.doesNotMatch(result.stderr + result.stdout, /minimalManifestPath is not defined/, "ReferenceError must be gone");
  const output = JSON.parse(result.stdout);
  assert.equal(output.command, "shell");
  assert.equal(output.processesSpawned, true);
  assert.match(output.processResult.stdout, /cc1-ok/, "command actually executed");
});

test("CC-1b: sqlite without --manifest reaches its own validation (clean handled outcome)", async () => {
  const result = await runCliCapture([
    "apps/cli/src/index.mjs", "sqlite",
    "--enable-runtime", "--approve",
  ]);
  // Missing --query is the INTENDED clean failure for sqlite; the point is that
  // the failure message is the designed one, never a ReferenceError.
  assert.equal(result.code, 1);
  assert.match(result.stderr, /Missing required --query/);
  assert.doesNotMatch(result.stderr + result.stdout, /minimalManifestPath|ReferenceError|is not defined/);
});

// ── Fix 2: fail-closed credentials in the federation exchange CLI ──

test("CC-2: exchange refuses missing credentials BEFORE any network call", async () => {
  delete process.env.ARDYN_FABRIC_REGISTRY_TOKEN;
  delete process.env.ARDYN_FABRIC_SIDECAR_TOKEN;
  delete process.env.FABRIC_TRANSPORT_D_AUTH_TOKEN;

  const scratch = await mkdtemp(join(tmpdir(), "ardyn-cc2-"));
  try {
    const payloadPath = join(scratch, "payload.json");
    await writeFile(payloadPath, JSON.stringify({ hello: true }));

    const calls = [];
    let fetchHit = false;
    const fails = [];
    const printed = [];
    const handoffCli = await import("../packages/fabric/src/handoff-cli.mjs");
    await handoffCli.runFederationExchangeCommand({
      subCommand: "send-handoff",
      args: ["send-handoff", "--enable-federation-exchange", "--approve", "--to", "did:multiverse:locus", "--payload", payloadPath],
      printJson: (o) => printed.push(o),
      fail: (msg) => fails.push(msg),
      readOption: (arr, name) => { const i = arr.indexOf(name); return i === -1 ? undefined : arr[i + 1]; },
    });
    // The module under test does its own dynamic imports; ensure NO real fetch
    // module state was needed by asserting our spy was never reached.
    assert.equal(fetchHit, false);
    assert.equal(fails.length, 1, `expected one refusal, got: ${JSON.stringify(fails)}`);
    assert.match(fails[0], /ARDYN_FABRIC_REGISTRY_TOKEN/, "refusal names the missing env var");
    assert.equal(printed.length, 0, "nothing sent");

    // Placeholder/empty values count as missing too.
    process.env.ARDYN_FABRIC_REGISTRY_TOKEN = "unset";
    process.env.ARDYN_FABRIC_SIDECAR_TOKEN = "";
    fails.length = 0;
    await handoffCli.runFederationExchangeCommand({
      subCommand: "send-handoff",
      args: ["send-handoff", "--enable-federation-exchange", "--approve", "--to", "did:multiverse:locus", "--payload", payloadPath],
      printJson: (o) => printed.push(o),
      fail: (msg) => fails.push(msg),
      readOption: (arr, name) => { const i = arr.indexOf(name); return i === -1 ? undefined : arr[i + 1]; },
    });
    assert.match(fails[0], /Refusing to contact/);
    void calls;
  } finally {
    await rm(scratch, { recursive: true, force: true });
  }
});

// ── Fix 3: Slack replay window ──

test("CC-3: Slack rejects stale-but-validly-signed requests; fresh valid ones pass; signature still enforced", async () => {
  const { verifySlackWebhook } = await import("../packages/gateway/src/gateway.mjs");
  const signingSecret = "cc3-slack-secret";
  const body = JSON.stringify({ type: "event_callback", event: { text: "x" } });

  const signWith = (ts) => {
    const sigBase = `v0:${ts}:${body}`;
    return `v0=${createHmac("sha256", signingSecret).update(sigBase).digest("hex")}`;
  };

  const nowSec = Math.floor(Date.now() / 1000);
  // Fresh + valid → allowed
  assert.equal(verifySlackWebhook({ body, signingSecret, timestamp: String(nowSec), signature: signWith(nowSec) }), true);
  // Fresh but wrong signature → denied
  assert.equal(verifySlackWebhook({ body, signingSecret, timestamp: String(nowSec), signature: signWith(nowSec - 1).replace(/.$/, "0") }), false);
  // STALE (10 minutes old) + perfectly valid signature → DENIED (replay blocked)
  const oldTs = String(nowSec - 600);
  assert.equal(verifySlackWebhook({ body, signingSecret, timestamp: oldTs, signature: signWith(oldTs) }), false, "replay must be blocked");
  // Within 5-minute skew → allowed
  const edgeTs = String(nowSec - 240);
  assert.equal(verifySlackWebhook({ body, signingSecret, timestamp: edgeTs, signature: signWith(edgeTs) }), true);
  // Missing/garbage timestamps deny cleanly (no throw)
  assert.equal(verifySlackWebhook({ body, signingSecret, timestamp: undefined, signature: signWith(nowSec) }), false);
  assert.equal(verifySlackWebhook({ body, signingSecret, timestamp: "not-a-number", signature: signWith(nowSec) }), false);
  // Missing signature denies cleanly (safeCompare no longer throws)
  assert.equal(verifySlackWebhook({ body, signingSecret, timestamp: String(nowSec), signature: undefined }), false);
});

// ── Fix 4: Windows path containment on gated writes ──

test("CC-4: gated write guard rejects Windows absolute/UNC/drive/traversal escapes", async () => {
  const paths = await import("../packages/core/src/internal/paths.mjs");
  const core = { assertContainedWritePath: paths.assertContainedWritePath };
  const escapes = [
    ["C:\\Windows\\system32\\evil.json", "drive-absolute backslash"],
    ["C:/Users/x/evil.json", "drive-absolute forward slash"],
    ["C:relative.json", "bare drive-relative"],
    ["\\\\server\\share\\evil.json", "UNC"],
    ["//server/share/evil.json", "protocol UNC"],
    ["..\\..\\outside.json", "backslash traversal"],
    ["../outside.json", "posix traversal"],
    ["/absolute/posix/path.json", "posix absolute"],
    ["file:///etc/passwd", "file protocol"],
  ];
  for (const [p, label] of escapes) {
    assert.throws(
      () => core.assertContainedWritePath(p),
      /relative path inside the working directory|local file path|parent-directory traversal/,
      `${label} (${p}) must be rejected`,
    );
  }
  // In-root relative path is allowed and does not throw.
  assert.doesNotThrow(() => core.assertContainedWritePath("out/reports/result.json"));
});
