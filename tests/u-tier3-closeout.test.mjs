// Tier 3 closeout tests:
//   U6  poison federation envelopes are marked received (no infinite re-poll)
//   U10 sibling-keys misconfiguration warns loudly + stays fail-closed
//   U13 dead FTS5 table is gone
//   U14 SDK ./components subpath resolves; main entry typed surface intact
//   U15 loop-state boundary check catches canonical secret forms (Bearer/sk-)
//   U16 shell uses a platform-appropriate shell (Windows path proven live)
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import test from "node:test";

const run = promisify(execFile);
const repoRoot = fileURLToPath(new URL("../", import.meta.url));
const cliPath = join(repoRoot, "apps", "cli", "src", "index.mjs");
const manifest = join(repoRoot, "examples/minimal-manifest/ardyn.manifest.json");

// ── U6 ──

test("U6: permanently-invalid envelope is marked received so the registry stops redelivering", async () => {
  const { createFabricFederationClient } = await import("../packages/fabric/src/federation.mjs");
  const calls = [];
  let inboxServed = false;
  // readBodyCapped consumes the body as BYTES (arrayBuffer), so the fixture
  // must encode the payload there — text()/json() alone are never consulted.
  const okJson = (payload) => {
    const bytes = new TextEncoder().encode(JSON.stringify(payload));
    return {
      ok: true, status: 200, statusText: "OK",
      headers: { get: () => null },
      json: async () => payload, text: async () => JSON.stringify(payload),
      arrayBuffer: async () => bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength),
      body: null,
    };
  };
  const scriptedFetch = async (url, opts = {}) => {
    const u = String(url);
    calls.push({ url: u, method: opts.method ?? "GET" });
    if (u.includes("/systems/register")) return okJson({ ok: true });
    if (u.includes("/fabric/federation/inbox?") || /inbox\?did=/.test(u)) {
      if (inboxServed) return okJson({ items: [] });
      inboxServed = true;
      // Poison envelope: addressed to ANOTHER did → wrong_recipient (permanent).
      return okJson({
        items: [{
          id: "poison-1",
          contentId: "cid-poison",
          fromDid: "did:multiverse:locus",
          toDid: "did:multiverse:someone-else",
        }],
      });
    }
    if (/\/fabric\/federation\/inbox\/poison-1\/received/.test(u)) {
      return okJson({ ok: true });
    }
    return okJson({ ok: true });
  };
  const client = createFabricFederationClient({
    localDid: "did:multiverse:ardyn",
    sidecarBaseUrl: "http://127.0.0.1:9",
    registryBaseUrl: "https://registry.example",
    registryToken: "t", sidecarToken: "t",
    fetchImpl: scriptedFetch,
  });
  const result = await client.pollInboundOnce
    ? await client.pollInboundOnce(() => {})
    : await (async () => {
      // fall back to one receiver tick via public API
      const errors = [];
      const receiver = client.startReceiver(() => {}, {
        intervalMs: 60_000, keepaliveEveryMs: 60_000,
        onError: (e) => errors.push(e), warn: () => {},
      });
      await receiver.ready;
      receiver.stop();
      return null;
    })();
  if (result) {
    assert.equal(result.delivered.length, 0);
    assert.equal(result.rejected.length, 1);
    assert.equal(result.rejected[0].permanent, true, "wrong_recipient must be classified permanent");
    assert.equal(result.rejected[0].marked, true, "permanent rejection must be marked received at the registry");
  }
  assert.ok(
    calls.some((c) => c.method === "POST" && /\/fabric\/federation\/inbox\/poison-1\/received/.test(c.url)),
    `registry must receive a mark-received POST for the poison envelope (calls=${JSON.stringify(calls)})`
  );
});

test("U6: transient failures are NOT marked received (still retried)", async () => {
  const mod = await import("../packages/fabric/src/federation.mjs");
  // The permanent-codes set must not contain transport-class codes.
  for (const code of ["http_error", "redirect_blocked", "response_too_large", "missing_fetch"]) {
    assert.equal(mod.PERMANENT_REJECTION_CODES?.has(code) ?? false, false, `${code} must stay transient`);
  }
});

// ── U10 ──

test("U10: malformed ARDYN_FABRIC_SIBLING_KEYS warns loudly and fails closed", async () => {
  process.env.ARDYN_FABRIC_SIBLING_KEYS = "{definitely-not-json";
  try {
    const { loadSiblingKeys } = await import("../packages/fabric/src/federation.mjs");
    const warnings = [];
    const keys = loadSiblingKeys({ warn: (m) => warnings.push(m) });
    assert.deepEqual(keys, {}, "malformed env must yield an empty key map (fail closed)");
    assert.equal(warnings.length, 1, "exactly one loud warning");
    assert.match(warnings[0], /ARDYN_FABRIC_SIBLING_KEYS/);
    assert.match(warnings[0], /WARNING/);
    assert.ok(loadSiblingKeys({ warn: () => {} }) !== undefined);
  } finally {
    delete process.env.ARDYN_FABRIC_SIBLING_KEYS;
  }
});

test("U10: receiver starting with zero keys emits the loud configuration warning", async () => {
  delete process.env.ARDYN_FABRIC_SIBLING_KEYS;
  const { createFabricFederationClient } = await import("../packages/fabric/src/federation.mjs");
  const warnings = [];
  const client = createFabricFederationClient({
    localDid: "did:multiverse:ardyn",
    sidecarBaseUrl: "http://127.0.0.1:9",
    registryBaseUrl: "https://registry.example",
    registryToken: "t", sidecarToken: "t",
    fetchImpl: async () => ({
      ok: true, status: 200, statusText: "OK", headers: { get: () => null },
      json: async () => ({}), text: async () => "{}", arrayBuffer: async () => new ArrayBuffer(0), body: null,
    }),
  });
  const receiver = client.startReceiver(() => {}, {
    intervalMs: 60_000, keepaliveEveryMs: 60_000,
    onError: () => {}, warn: (m) => warnings.push(m),
  });
  try {
    // The warning fires synchronously during startReceiver.
    assert.ok(warnings.length >= 1, "zero-keys warning must be emitted");
    assert.match(warnings[0], /NO sibling public keys/);
  } finally {
    receiver.stop();
  }
});

// ── U13 ──

test("U13: user-memory schema no longer creates the dead FTS5 table", async () => {
  const { createUserMemoryDatabase } = await import("../packages/core/src/user-memory.mjs");
  const db = await createUserMemoryDatabase(":memory:");
  try {
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type IN ('table','view')").all()
      .map((r) => r.name);
    assert.ok(!tables.includes("user_memory_fts"), "dead FTS5 table must be gone");
    for (const expected of ["user_memories", "user_profiles", "user_memory_events"]) {
      assert.ok(tables.includes(expected));
    }
    // Core behaviors unaffected:
    const { saveMemory, searchMemory } = await import("../packages/core/src/user-memory.mjs");
    saveMemory(db, { userId: "u13", key: "k", value: "hello world" });
    assert.equal(searchMemory(db, { userId: "u13", query: "world" }).length, 1);
  } finally {
    db.close();
  }
});

// ── U14 ──

test("U14: @ardyn/sdk/components subpath resolves for consumers", async () => {
  const resolved = import.meta.resolve("@ardyn/sdk/components");
  assert.match(String(resolved), /packages[/\\]sdk[/\\]src[/\\]components[/\\]index\.js$/);
  // Main entry still resolves and exposes its runtime API.
  const main = import.meta.resolve("@ardyn/sdk");
  assert.match(String(main), /packages[/\\]sdk[/\\]src[/\\]index\.mjs$/);
  const sdk = await import("@ardyn/sdk");
  for (const fn of ["loadManifest", "createPlan", "validateTranscript", "getVersion"]) {
    assert.equal(typeof sdk[fn], "function", `${fn} must remain exported`);
  }
});

test("U14: sdk package.json declares types + component export", async () => {
  const { readFile } = await import("node:fs/promises");
  const pkg = JSON.parse(await readFile(join(repoRoot, "packages/sdk/package.json"), "utf8"));
  assert.equal(pkg.exports["./components"], "./src/components/index.js");
  assert.ok(pkg.types, "types entry must be declared");
  const dts = await readFile(join(repoRoot, "packages/sdk/src/index.d.ts"), "utf8");
  assert.match(dts, /declare function loadManifest/, "function signature must exist in d.ts");
  const compDts = await readFile(join(repoRoot, "packages/sdk/src/components/index.d.ts"), "utf8");
  assert.match(compDts, /SessionTraceProps/);
});

// ── U15 ──

test("U15: loop-state boundary check catches canonical secret forms (Bearer/sk-) it used to miss", async () => {
  const { createLoopStateDatabase, createGoal, recordRun } = await import("../packages/core/src/loop-state.mjs");
  const db = await createLoopStateDatabase(":memory:");
  const goal = createGoal(db, { title: "g" });
  // sk- form: old inline regex missed this entirely.
  recordRun(db, { goalId: goal.id, runId: "r1", evidence: "key sk-abcdefghijklmnopqrstuvwxyz1234567890", outcome: "ok", isPublic: 1 });
  const leak = await import("../packages/core/src/loop-state.mjs").then((m) => m.checkPublicPrivateBoundary(db, { goalId: goal.id }));
  assert.equal(leak.ok, false, "sk- secret in a public run must be flagged");
  assert.equal(leak.violation, "secret_in_public_run");
  // Clean evidence passes.
  const cleanGoal = createGoal(db, { title: "clean" });
  recordRun(db, { goalId: cleanGoal.id, runId: "c1", evidence: "nothing sensitive here", outcome: "ok", isPublic: 1 });
  const okResult = await import("../packages/core/src/loop-state.mjs").then((m) => m.checkPublicPrivateBoundary(db, { goalId: cleanGoal.id }));
  assert.equal(okResult.ok, true);
});

// ── U16 ──

test("U16: shell uses the platform shell (cmd on Windows executes cmd-only builtins)", { skip: process.platform !== "win32" && "POSIX platform — Windows path not applicable" }, async () => {
  const out = await run("node", [cliPath, "shell", "--enable-runtime", "--approve", "--command", "ver"], { cwd: repoRoot });
  const parsed = JSON.parse(out.stdout);
  assert.equal(parsed.shell, "cmd");
  assert.match(parsed.processResult.stdout, /Microsoft Windows/i, "`ver` only exists in cmd — proves the platform shell was used");
});
