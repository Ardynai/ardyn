// M21 — Credibility pass: behavioral tests for the security/correctness fixes.
// Every test here asserts real behavior (no string/flag pinning).
import assert from "node:assert/strict";
import test from "node:test";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { generateKeyPairSync } from "node:crypto";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const runCli = promisify(execFile);
async function runCliCapture(args, opts = {}) {
  try {
    const { stdout, stderr } = await runCli("node", args, { cwd: process.cwd(), maxBuffer: 4 * 1024 * 1024, ...opts });
    return { code: 0, stdout, stderr };
  } catch (error) {
    return { code: error.code ?? 1, stdout: error.stdout ?? "", stderr: error.stderr ?? String(error) };
  }
}
import { encodeHandoff } from "../packages/core/src/glossopetrae-codec.mjs";

// ── Item 1: recursive canonical signing ──

test("M21: signature COVERS nested fields — tampering an inner field fails verification", async () => {
  const fed = await import("../packages/fabric/src/federation.mjs");
  const handoff = await import("../packages/fabric/src/handoff.mjs");
  const LOCAL = "did:multiverse:ardyn";
  const SIBLING = "did:multiverse:locus";
  const k = generateKeyPairSync("ed25519");
  process.env.ARDYN_FABRIC_SIBLING_KEYS = JSON.stringify({
    [SIBLING]: k.publicKey.export({ type: "spki", format: "der" }).toString("base64"),
  });

  const toSign = {
    type: "ardyn_handoff", v: 1, codec: "GL1",
    encoded: encodeHandoff({ plan: ["a"] }),
    context: { depth: { inner: "original-value" } }, // NESTED payload field
    fromDid: SIBLING, toDid: LOCAL, authenticated: true, authenticatedDid: SIBLING,
  };
  const sig = handoff.signHandoffEnvelope(toSign, k.privateKey.export({ type: "pkcs8", format: "pem" }));
  const envelope = { ...toSign, signature: sig, signatureDid: SIBLING };
  assert.equal(fed.isInboundAuthenticated(envelope, SIBLING), true, "baseline verifies");

  // Tamper a NESTED field → verification MUST fail under recursive canonicalization.
  const tampered = { ...envelope, context: { depth: { inner: "TAMPERED" } } };
  assert.equal(fed.isInboundAuthenticated(tampered, SIBLING), false, "nested tampering must break the signature");
});

test("M21: nested payloads verify equal regardless of inner key order", async () => {
  const fed = await import("../packages/fabric/src/federation.mjs");
  const handoff = await import("../packages/fabric/src/handoff.mjs");
  const SIBLING = "did:multiverse:locus";
  const k = generateKeyPairSync("ed25519");
  process.env.ARDYN_FABRIC_SIBLING_KEYS = JSON.stringify({
    [SIBLING]: k.publicKey.export({ type: "spki", format: "der" }).toString("base64"),
  });
  const base = {
    type: "ardyn_handoff", v: 1, codec: "GL1", encoded: encodeHandoff({ ok: true }),
    context: { alpha: 1, beta: { gamma: "g", delta: "d" } },
    fromDid: SIBLING, toDid: "did:multiverse:ardyn", authenticated: true, authenticatedDid: SIBLING,
  };
  const reordered = {
    encoded: base.encoded,
    authenticatedDid: base.authenticatedDid, authenticated: base.authenticated,
    toDid: base.toDid, fromDid: base.fromDid,
    context: { beta: { delta: "d", gamma: "g" }, alpha: 1 },
    codec: base.codec, v: base.v, type: base.type,
  };
  const s1 = handoff.signHandoffEnvelope(base, k.privateKey.export({ type: "pkcs8", format: "pem" }));
  const s2 = handoff.signHandoffEnvelope(reordered, k.privateKey.export({ type: "pkcs8", format: "pem" }));
  assert.equal(s1, s2, "canonicalization must be key-order-insensitive at ALL depths");
});

function encodeHandoffLite(payload) {
  return encodeHandoff(payload);
}

// ── Item 2: stdout frames are redacted end-to-end through serve-runtime ──

test("M21: secret on STDOUT is masked in processResult and transcript frames", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-m21-stdout-"));
  try {
    const scriptPath = join(scratch, "stdout-secret.js");
    await writeFile(
      scriptPath,
      'process.stdout.write(JSON.stringify({event:"log",line:"token=supersecret123 sk-abcdefghijklmnopqrstuvwxyz123456"})+"\\n");process.exit(0)'
    );
    const result = await runCliCapture([
      "apps/cli/src/index.mjs", "serve-runtime",
      "--enable-runtime", "--approve",
      "--manifest", "examples/minimal-manifest/ardyn.manifest.json",
      "--command", `node ${scriptPath}`,
    ]);
    assert.equal(result.code, 0, result.stderr);
    const output = JSON.parse(result.stdout);
    const serialized = JSON.stringify(output);
    assert.doesNotMatch(serialized, /supersecret123/, "raw token value must NOT appear anywhere in CLI output");
    assert.match(serialized, /REDACTED/, "masked marker must be present");
  } finally {
    await rm(scratch, { recursive: true, force: true });
  }
});

// ── Item 5: self-healing federation receiver ──

test("M21: receiver keeps polling after a transient tick failure", async () => {
  const { createFabricFederationClient } = await import("../packages/fabric/src/federation.mjs");
  let polls = 0;
  let failures = 1; // first keepalive/poll attempt fails
  const errors = [];
  const flakyFetch = async () => {
    polls += 1;
    if (failures > 0) { failures -= 1; throw new Error("transient registry outage"); }
    return {
      ok: true, status: 200, statusText: "OK",
      headers: { get: () => null },
      json: async () => ({}), text: async () => "{}", arrayBuffer: async () => new ArrayBuffer(0), body: null,
    };
  };
  const client = createFabricFederationClient({
    localDid: "did:multiverse:ardyn",
    sidecarBaseUrl: "http://127.0.0.1:9",
    registryBaseUrl: "https://registry.example",
    registryToken: "t", sidecarToken: "t",
    fetchImpl: flakyFetch,
  });
  const received = [];
  const receiver = client.startReceiver(
    (delivery) => received.push(delivery),
    { intervalMs: 1000, onError: (e) => errors.push(e) },
  );
  await new Promise((r) => setTimeout(r, 1500));
  receiver.stop();
  assert.ok(errors.length >= 1, "the transient failure must be reported via onError");
  assert.ok(polls >= 3, `loop must keep polling after failure (polls=${polls})`);
});

// ── Item 6: sandbox teardown is crash-proof + audited ──

test("M21: kill()/end() handle docker spawn errors without unhandled rejections", async () => {
  const { default: cu } = await import("../packages/core/src/computer-use.mjs");
  const listeners = [];
  const fakeSpawn = (cmd, args) => ({
    // U2 contract: `docker run` succeeds via a close(0) event carrying the
    // container id; kill/rm fail with ENOENT-style errors on their error path.
    on(event, cb) {
      listeners.push([args?.[0], event]);
      if (event === "error" && args?.[0] !== "run") setImmediate(() => cb(new Error("spawn docker ENOENT")));
      if (event === "close" && args?.[0] === "run") process.nextTick(() => cb(0));
    },
    kill() {},
    // data is registered before close in spawnAndWait, so this nextTick fires
    // before the close nextTick — deterministic data-before-close.
    stdout: { on(_e, cb) { if (args?.[0] === "run") process.nextTick(() => cb(Buffer.from("cid-m21\n"))); } },
    stderr: { on() {} },
  });
  const makeSession = () => cu.createSandboxSession({
    sessionId: `m21-teardown-${Math.random().toString(36).slice(2, 7)}`, dryRun: false, approved: true, spawnImpl: fakeSpawn,
    policy: { deny: [], allow: [{}] },
  });
  const killSession = makeSession();
  await killSession.start();
  // Must not throw / must not produce an unhandled 'error' event rejection.
  killSession.kill();
  const endSession = makeSession();
  await endSession.start();
  endSession.end();
  await new Promise((r) => setTimeout(r, 20));
  assert.ok(killSession.audit.getEvents().map(e => e.action).includes("kill_switch_activated"));
  assert.ok(endSession.audit.getEvents().map(e => e.action).includes("session_ended"));
  assert.ok(listeners.some(([sub, ev]) => ev === "error" && sub !== "run"), "error listener must be attached to teardown spawns");
});

// ── Item 7: GLOSSOPETRAE extended stego classes ──

test("M21: GL1 rejects variation selectors, bidi isolates, tag chars, VS-heavy strings", async () => {
  const { encodeHandoff, decodeHandoff } = await import("../packages/core/src/glossopetrae-codec.mjs");
  const cases = [
    ["variation selector FE0F", { s: "hidden\uFE0F" }],
    ["variation selector E0100", { s: "x\u{E0100}" }],
    ["bidi isolate LRI 2066", { s: "a\u2066b" }],
    ["tag char E0041", { s: "t\u{E0041}ag" }],
  ];
  for (const [label, payload] of cases) {
    assert.throws(() => decodeHandoff(encodeHandoff(payload)), /covert-channel characters/, label);
  }
});

// ── Item 8: HiClaw outbound room allowlist ──

test("M21: HiClaw send REJECTS raw/object rooms outside the configured registry", async () => {
  const { createHiClawMatrixAdapter } = await import("../packages/gateway/src/hiclaw-matrix.mjs");
  process.env.M19_TOKEN_XYZ = "tok";
  let called = false;
  const adapter = createHiClawMatrixAdapter({
    baseUrl: "https://matrix.example",
    tokenEnv: "M19_TOKEN_XYZ",
    rooms: { "worker-1": { matrix_user_id: "@w1:hiclaw", room_id: "!known:hiclaw" } },
    fetchImpl: async () => { called = true; return { ok: true, status: 200, json: async () => ({ event_id: "$e" }) }; },
  });
  await assert.rejects(() => adapter.send("!foreign:hiclaw", "hi"), /not in the configured rooms registry/);
  await assert.rejects(() => adapter.send({ roomId: "!other:hiclaw" }, "hi"), /not in the configured rooms registry/);
  assert.equal(called, false, "no request may leave for non-allowlisted rooms");
  // allowlisted name still works
  const res = await adapter.send("worker-1", "hi");
  assert.equal(res.eventId, "$e");
});

// ── Item 9: secrets-invariant scanner (behavioral, tree-wide) ──

test("M21: no committed file contains real-looking private keys or cloud tokens", async () => {
  const { execFileSync } = await import("node:child_process");
  const files = execFileSync("git", ["ls-files"], { cwd: process.cwd(), encoding: "utf8" })
    .split("\n").filter(Boolean)
    // Intentional FAKE fixtures live in tests/ — the scanner targets everything else.
    .filter((f) => !f.startsWith("tests/fixtures/") && !f.endsWith(".lock") && f !== "package-lock.json");
  assert.ok(files.length > 100, "scanner should cover the tracked tree");
  const patterns = [
    [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, "PEM private key"],
    [/AKIA[0-9A-Z]{16}/, "AWS access key id"],
    [/xox[baprs]-[A-Za-z0-9-]{10,}/, "Slack token"],
    [/ghp_[A-Za-z0-9]{36}/, "GitHub PAT"],
    [/eyJhbGciOi[A-Za-z0-9._-]{40,}/, "JWT-looking credential"],
  ];
  const hits = [];
  const { readFile } = await import("node:fs/promises");
  for (const file of files) {
    let content;
    try { content = await readFile(join(process.cwd(), file), "utf8"); } catch { continue; }
    for (const [re, label] of patterns) {
      if (re.test(content)) hits.push(`${file}: ${label}`);
    }
  }
  assert.deepEqual(hits, [], `real-looking secrets found in committed files: ${hits.join("; ")}`);
});

// Note on the PEM-detection line (handoff.mjs `key.includes("-----BEGIN")`):
// confirmed NOT a false trigger — base64 DER output cannot contain "-" so DER
// keys never look like PEM; real PEMs always carry the sentinel.
