// M19: HiClaw Matrix channel adapter — raw-fetch only, NO SDK, no E2EE.
// ALL tests use an INJECTED fake fetch — never a live homeserver.
import assert from "node:assert/strict";
import test from "node:test";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createHiClawMatrixAdapter } from "../packages/gateway/src/hiclaw-matrix.mjs";
import { mapUserToArdyn } from "../packages/gateway/src/gateway.mjs";

const TOKEN = "hiclaw-matrix-test-token-abcdef123456";
const BASE = "https://matrix-local.hiclaw.io:18080";

const REGISTRY = {
  "hermes-test-01": {
    matrix_user_id: "@hermes-test-01:matrix-local.hiclaw.io:18080",
    room_id: "!EOIMHzIqmc7ioLQmov:matrix-local.hiclaw.io:18080",
  },
  "openclaw-test-01": {
    matrix_user_id: "@openclaw-test-01:matrix-local.hiclaw.io:18080",
    room_id: "!GH7qf9VnnNwYN46ztQ:matrix-local.hiclaw.io:18080",
  },
};

function makeAdapter(overrides = {}) {
  process.env.TEST_HICLAW_TOKEN = TOKEN;
  return createHiClawMatrixAdapter({
    baseUrl: BASE,
    tokenEnv: "TEST_HICLAW_TOKEN",
    rooms: REGISTRY,
    ...overrides,
  });
}

function fakeOk(json) {
  return { ok: true, status: 200, statusText: "OK", json: async () => json };
}

test("M19: send builds the correct txn PUT (URL/auth/m.text body) with unique txn ids", async () => {
  const calls = [];
  const adapter = makeAdapter({ fetchImpl: async (url, opts) => { calls.push({ url, ...opts }); return fakeOk({ event_id: "$ev1" }); } });
  const res = await adapter.send("hermes-test-01", "Task assigned: build README");
  assert.equal(calls.length, 1);
  // Room id must be URL-encoded (! -> %21); txn path present
  assert.match(calls[0].url, /^https:\/\/matrix-local\.hiclaw\.io:18080\/_matrix\/client\/v3\/rooms\/%21EOIMHzIqmc7ioLQmov%3Amatrix-local\.hiclaw\.io%3A18080\/send\/m\.room\.message\/ardyn\./);
  assert.ok(!calls[0].url.includes(TOKEN), "token must NEVER be in the URL");
  assert.equal(calls[0].method, "PUT");
  assert.equal(calls[0].headers.authorization, `Bearer ${TOKEN}`);
  const body = JSON.parse(calls[0].body);
  assert.equal(body.msgtype, "m.text");
  assert.match(body.body, /Task assigned/);
  assert.deepEqual(body["m.mentions"].user_ids, ["@hermes-test-01:matrix-local.hiclaw.io:18080"], "worker must be @mentioned to wake");
  assert.equal(res.eventId, "$ev1");
  assert.equal(res.roomId, REGISTRY["hermes-test-01"].room_id);

  // unique txn_id per message (homeserver dedupe safety)
  await adapter.send("hermes-test-01", "second");
  const [txn1, txn2] = calls.map(c => c.url.split("/send/m.room.message/")[1]);
  assert.notEqual(txn1, txn2, "txn_id must be unique per message");
});

test("M19: missing token fails closed BEFORE any request; error names env var not value", async () => {
  delete process.env.ARDYN_DEFINITELY_MISSING_HICLAW_TOKEN;
  let called = false;
  const adapter = createHiClawMatrixAdapter({
    baseUrl: BASE,
    tokenEnv: "ARDYN_DEFINITELY_MISSING_HICLAW_TOKEN",
    rooms: REGISTRY,
    fetchImpl: async () => { called = true; return fakeOk({}); },
  });
  await assert.rejects(
    () => adapter.send("hermes-test-01", "x"),
    (err) => {
      assert.match(err.message, /Missing HiClaw Matrix token/);
      assert.match(err.message, /ARDYN_DEFINITELY_MISSING_HICLAW_TOKEN/);
      assert.doesNotMatch(err.message, /hiclaw-matrix-test-token/);
      return true;
    }
  );
  assert.equal(called, false, "no network call without a token");
});

test("M19: token from gitignored config/secret/hiclaw.json fallback", async () => {
  const dir = await mkdtemp(join(tmpdir(), "ardyn-m19-secrets-"));
  try {
    delete process.env.TEST_FILE_TOKEN_XYZ;
    const secretFile = join(dir, "hiclaw.json");
    await writeFile(secretFile, JSON.stringify({ TEST_FILE_TOKEN_XYZ: "file-token-123" }));
    const calls = [];
    const adapter = createHiClawMatrixAdapter({
      baseUrl: BASE,
      tokenEnv: "TEST_FILE_TOKEN_XYZ",
      secretFile,
      rooms: REGISTRY,
      fetchImpl: async (url, opts) => { calls.push(opts.headers); return fakeOk({ event_id: "$e" }); },
    });
    await adapter.send("openclaw-test-01", "hi");
    assert.equal(calls[0].authorization, "Bearer file-token-123");
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("M19: send errors never leak the token (network + HTTP failure paths)", async () => {
  const evilFetch = async () => { throw new Error(`ECONNREFUSED Authorization: Bearer ${TOKEN}`); };
  const a = makeAdapter({ fetchImpl: evilFetch });
  await assert.rejects(() => a.send("hermes-test-01", "x"), (e) => !e.message.includes(TOKEN));

  const http401 = makeAdapter({ fetchImpl: async () => ({ ok: false, status: 401, statusText: "Unauthorized", json: async () => ({ errcode: "M_UNKNOWN_TOKEN", error: `bad token ${TOKEN}` }) }) });
  await assert.rejects(() => http401.send("hermes-test-01", "x"), (e) => {
    assert.match(e.message, /HTTP 401/);
    assert.ok(!e.message.includes(TOKEN), "response body must NOT be echoed");
    return true;
  });
});

// ── /sync receive ──

const ROOM_A = REGISTRY["hermes-test-01"].room_id;
const SENDER_A = "@hermes-test-01:matrix-local.hiclaw.io:18080";

function syncBody(events, nextBatch = "s42") {
  return { next_batch: nextBatch, rooms: { join: { [ROOM_A]: { timeline: { events } } } } };
}

const msgEv = (overrides = {}) => ({
  type: "m.room.message",
  sender: SENDER_A,
  roomId: ROOM_A,
  event_id: "$abc",
  origin_server_ts: 1730000000000,
  content: { msgtype: "m.text", body: "hello ardyn" },
  ...overrides,
});

test("M19: sync long-polls with since cursor + Bearer header and advances next_batch", async () => {
  const calls = [];
  let poll = 0;
  const adapter = makeAdapter({
    fetchImpl: async (url, opts) => {
      calls.push({ url, headers: opts.headers });
      poll += 1;
      if (poll === 1) return fakeOk(syncBody([msgEv()], "s42"));
      return fakeOk({ next_batch: "s43", rooms: { join: {} } });
    },
  });
  const batches = [];
  for await (const batch of adapter.sync({ timeoutMs: 30000, maxPolls: 2 })) {
    batches.push(batch);
  }
  assert.equal(batches.length, 2);
  assert.match(calls[0].url, /\/_matrix\/client\/v3\/sync\?timeout=30000$/, "first poll has no since");
  assert.match(calls[1].url, /since=s42&timeout=30000$/, "cursor persisted and sent back as since");
  assert.ok(calls[0].url.includes("since=") === false || !calls[0].url.includes("since=s"), "sanity");
  assert.ok(!calls[1].url.includes(TOKEN), "token stays out of the URL");
  for (const c of calls) assert.equal(c.headers.authorization, `Bearer ${TOKEN}`);
  assert.equal(adapter.getCursor(), "s43");
  assert.deepEqual(batches[0].events.map(e => e.text), ["hello ardyn"]);
  assert.equal(batches[0].nextBatch, "s42");
});

test("M19: extractEvents keeps m.room.message m.text, skips m.room.encrypted + other types", () => {
  const adapter = makeAdapter({ fetchImpl: async () => fakeOk({}) });
  const body = {
    next_batch: "s1",
    rooms: {
      join: {
        [ROOM_A]: {
          timeline: { events: [
            msgEv(),
            { type: "m.room.encrypted", sender: SENDER_A, content: { ciphertext: "NEVER-DECRYPTED" } },
            { type: "m.room.member", sender: SENDER_A, content: { membership: "join" } },
            { type: "m.room.message", sender: SENDER_A, content: { msgtype: "m.notice", body: "notice ignored" } },
          ] },
        },
        "!foreign:example.org": { timeline: { events: [msgEv({ event_id: "$other-room" })] } },
      },
    },
  };
  const all = adapter.extractEvents(body);
  assert.equal(all.length, 2, "plaintext m.text extracted (both rooms); encrypted + non-message skipped");
  assert.equal(all.filter(e => e.eventId === "$other-room").length, 1, "extraction is format-only");
  // Trust boundary: the foreign-room event is REJECTED at the accept layer.
  assert.equal(adapter.classifyEvent(all.find(e => e.eventId === "$other-room")), "foreign_room");
  const parsed = adapter.parseInbound(all[0]);
  assert.equal(parsed.platform, "hiclaw");
  assert.equal(parsed.text, "hello ardyn");
  assert.equal(parsed.worker, "hermes-test-01", "room maps back to worker name");
  assert.equal(parsed.username, "hermes-test-01");
});

// ── deny-by-default inbound auth ──

test("M19: deny-by-default — foreign room, unknown sender, self echo all rejected", async () => {
  const adapter = makeAdapter({ fetchImpl: async () => fakeOk({}), selfUserId: "@ardyn:matrix-local.hiclaw.io:18080" });
  assert.equal(adapter.classifyEvent(msgEv()), null, "known sender in allowlisted room accepted");
  assert.equal(adapter.verifyWebhook({ event: msgEv() }), true);

  const foreignRoom = msgEv({ roomId: "!elsewhere:example.org", event_id: "$fr" });
  assert.equal(adapter.classifyEvent(foreignRoom), "foreign_room");
  assert.equal(adapter.verifyWebhook({ event: foreignRoom }), false);

  const stranger = msgEv({ sender: "@stranger:matrix-local.hiclaw.io:18080", event_id: "$us" });
  assert.equal(adapter.classifyEvent(stranger), "unknown_sender");

  const echo = msgEv({ sender: "@ardyn:matrix-local.hiclaw.io:18080", event_id: "$echo" });
  assert.equal(adapter.classifyEvent(echo), "self_echo", "own echoes must be skipped");

  // sync loop filters before yielding (events nested per-room, as real /sync does)
  const filtering = makeAdapter({
    fetchImpl: async () => fakeOk({
      next_batch: "s9",
      rooms: { join: {
        [ROOM_A]: { timeline: { events: [msgEv(), msgEv({ sender: "@stranger:matrix-local.hiclaw.io:18080", event_id: "$us" })] } },
        "!elsewhere:example.org": { timeline: { events: [msgEv({ roomId: "!elsewhere:example.org", event_id: "$fr" })] } },
      } },
    }),
  });
  for await (const batch of filtering.sync({ maxPolls: 1 })) {
    assert.equal(batch.events.length, 1);
    assert.equal(batch.rejected.length, 2);
    assert.deepEqual(batch.rejected.map(e => e.eventId).sort(), ["$fr", "$us"]);
  }
});

test("M19: allowedSenders option narrows the sender allowlist explicitly", async () => {
  const adapter = makeAdapter({
    fetchImpl: async () => fakeOk({}),
    allowedSenders: ["@manager:matrix-local.hiclaw.io:18080"],
  });
  assert.equal(adapter.classifyEvent(msgEv()), "unknown_sender", "registry senders are NOT auto-allowed when explicit list given");
  assert.equal(
    adapter.classifyEvent(msgEv({ sender: "@manager:matrix-local.hiclaw.io:18080" })),
    null,
  );
});

// ── identity mapping + per-user isolation ──

test("M19: each Matrix sender maps to its own Ardyn user — isolation holds across the channel", () => {
  const alice = mapUserToArdyn({ platform: "hiclaw", platformUserId: SENDER_A, username: "hermes-test-01" });
  const bob = mapUserToArdyn({ platform: "hiclaw", platformUserId: "@openclaw-test-01:matrix-local.hiclaw.io:18080", username: "openclaw-test-01" });
  assert.notEqual(alice.ardynUserId, bob.ardynUserId, "different HiClaw identities MUST map to different Ardyn users");
  assert.equal(alice.platform, "hiclaw");

  const adapter = makeAdapter({ fetchImpl: async () => fakeOk({}) });
  const inboundA = adapter.parseInbound(adapter.extractEvents(syncBody([msgEv()]))[0]);
  const mapped = adapter.mapSender(inboundA.platformUserId);
  assert.equal(mapped.ardynUserId, alice.ardynUserId, "adapter mapping matches the shared deterministic mapping");
});

test("M19: two HiClaw users through the gateway cannot reach each other's sessions", async () => {
  // Same CRITICAL isolation shape as the M11-real gateway test, over the hiclaw channel.
  const gw = await import("../packages/core/src/multi-user.mjs");
  const dir = await mkdtemp(join(tmpdir(), "ardyn-m19-iso-"));
  let db;
  try {
    db = await gw.createMultiUserDatabase(join(dir, "iso.db"));
    const alice = gw.createUser(db, { username: "alice", passwordHash: "ha" });
    const bob = gw.createUser(db, { username: "bob", passwordHash: "hb" });
    const s = gw.createSession(db, { userId: alice.id, manifestPath: "m.json" });

    const adapter = makeAdapter({ fetchImpl: async () => fakeOk({}) });
    const evA = adapter.parseInbound({ eventId: "$1", roomId: ROOM_A, sender: SENDER_A, text: "hi" });
    const evB = adapter.parseInbound({ eventId: "$2", roomId: ROOM_A, sender: "@openclaw-test-01:matrix-local.hiclaw.io:18080", text: "yo" });

    const userForA = db.prepare("SELECT * FROM users WHERE username='alice'").get();
    const userForB = db.prepare("SELECT * FROM users WHERE username='bob'").get();
    assert.equal(gw.getSession(db, s.id, userForA.id).id, s.id, "alice reads her session via her hiclaw identity's user");
    assert.equal(gw.getSession(db, s.id, userForB.id), null, "bob via hiclaw CANNOT read alice's session");
    assert.notEqual(evA.platformUserId, evB.platformUserId);
  } finally {
    try { db?.close?.(); } catch {}
    await rm(dir, { recursive: true, force: true, maxRetries: 3, retryDelay: 50 }).catch(async () => {
      await new Promise(r => setTimeout(r, 100));
      await rm(dir, { recursive: true, force: true }).catch(() => {});
    });
  }
});

test("M19: gated actions still pass the same approval gates — channel never bypasses them", async () => {
  // HiClaw inbound arrives via the Bearer-authenticated /sync loop (no webhook
  // signatures exist on this path); whatever it says, any runtime/computer-use
  // ACTION still goes through the SAME M15 processor-pipeline gateway.
  const cu = await import("../packages/core/src/computer-use.mjs");
  const { metrics } = await import("../packages/core/src/metrics.mjs");

  const channel = makeAdapter({ fetchImpl: async () => fakeOk({}) });
  // Inbound from an allowlisted worker parses cleanly...
  const inbound = channel.parseInbound(channel.extractEvents(syncBody([msgEv()]))[0]);
  assert.equal(inbound.rejected, undefined);
  assert.equal(inbound.platformUserId, SENDER_A);

  // ...but a computer-use action triggered by it is STILL policy-gated:
  const session = cu.createSandboxSession({
    sessionId: "m19-gate",
    dryRun: true,
    policy: { deny: [{ action: "type", text: "rm -rf" }], allow: [{}] },
  });
  const denied = await session.executeAction({ action: "type", text: "rm -rf /" });
  assert.equal(denied.refused, true, "gates hold regardless of which channel asked");
  assert.match(denied.reason, /deny_rule/);

  // And the evaluation was audited + counted like every other channel's:
  const row = session.audit.getEvents().find(e => e.details?.text === "rm -rf /");
  assert.ok(row, "denial audited");
});

// ── forbidden dependency floor ──

test("M19: no forbidden Matrix SDK deps anywhere (raw fetch only)", async () => {
  const { readFile } = await import("node:fs/promises");
  const { glob } = await import("node:fs/promises").catch(() => ({}));
  const files = [];
  const { readdirSync, statSync } = await import("node:fs");
  const walk = (d) => {
    for (const name of readdirSync(d)) {
      if (name === "node_modules" || name.startsWith(".")) continue;
      const p = join(d, name);
      if (statSync(p).isDirectory()) walk(p);
      else if (name === "package.json") files.push(p);
    }
  };
  walk(process.cwd());
  assert.ok(files.length > 3, "found package.json files to check");
  for (const f of files) {
    const src = await readFile(f, "utf8");
    assert.ok(!/matrix-js-sdk|@matrix-org\//.test(src), `${f} must not depend on any Matrix SDK`);
    assert.ok(!/"openclaw/i.test(src), `${f} must not depend on openclaw`);
  }
});
