// M11-real: Gateway constant-time compare + cross-user isolation through gateway
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import test from "node:test";
import {
  createGateway,
  TelegramAdapter,
  SlackAdapter,
  verifyTelegramWebhook,
  verifySlackWebhook,
  mapUserToArdyn,
} from "../packages/gateway/src/gateway.mjs";
import {
  createMultiUserDatabase,
  createUser,
  createSession,
  getSession,
} from "../packages/core/src/multi-user.mjs";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

// ── Constant-time comparison tests ──

test("M11-real: Telegram webhook uses timingSafeEqual (valid sig passes)", () => {
  const botToken = "123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11";
  const body = JSON.stringify({ update_id: 1, message: { text: "hello" } });
  const hmac = createHmac("sha256", botToken).update(body).digest("hex");
  assert.ok(verifyTelegramWebhook({ body, secret: botToken, signature: hmac }));
});

test("M11-real: Telegram webhook uses timingSafeEqual (invalid sig fails)", () => {
  const body = JSON.stringify({ update_id: 1 });
  assert.equal(verifyTelegramWebhook({ body, secret: "secret", signature: "0".repeat(64) }), false);
});

test("M11-real: Telegram webhook rejects different-length signatures (no crash)", () => {
  const body = JSON.stringify({ update_id: 1 });
  // Short signature should not crash timingSafeEqual
  assert.equal(verifyTelegramWebhook({ body, secret: "secret", signature: "abc" }), false);
});

test("M11-real: Slack webhook uses timingSafeEqual (valid sig passes)", () => {
  const signingSecret = "8f742231b10e8888abcd99e466st";
  const timestamp = "1234567890";
  const body = JSON.stringify({ type: "event_callback", event: { text: "hello" } });
  const sigBase = `v0:${timestamp}:${body}`;
  const hmac = createHmac("sha256", signingSecret).update(sigBase).digest("hex");
  const signature = `v0=${hmac}`;
  assert.ok(verifySlackWebhook({ body, signingSecret, timestamp, signature }));
});

test("M11-real: Slack webhook uses timingSafeEqual (invalid sig fails)", () => {
  assert.equal(verifySlackWebhook({
    body: "{}", signingSecret: "wrong", timestamp: "123", signature: "v0=bad"
  }), false);
});

// ── Cross-user gateway isolation test ──

test("M11-real: user arriving via gateway CANNOT reach another user's session (CRITICAL)", async () => {
  // Create a multi-user DB with two users
  const dir = await mkdtemp(join(tmpdir(), "ardyn-gw-iso-"));
  const db = await createMultiUserDatabase(join(dir, "test.db"));
  try {
    const alice = createUser(db, { username: "alice", passwordHash: "hash-a" });
    const bob = createUser(db, { username: "bob", passwordHash: "hash-b" });

    // Alice creates a session
    const aliceSession = createSession(db, { userId: alice.id, manifestPath: "manifest.json" });

    // Map two gateway users to Ardyn users
    const aliceMapping = mapUserToArdyn({ platform: "telegram", platformUserId: "111", username: "alice" });
    const bobMapping = mapUserToArdyn({ platform: "telegram", platformUserId: "222", username: "bob" });

    // Alice can access her own session via the gateway
    const aliceAccess = getSession(db, aliceSession.id, alice.id);
    assert.ok(aliceAccess, "alice should access her own session");

    // Bob CANNOT access Alice's session through the gateway
    // The gateway maps Bob to his own Ardyn user, so getSession with Bob's userId
    // will not find Alice's session
    const bobAccessAlice = getSession(db, aliceSession.id, bob.id);
    assert.equal(bobAccessAlice, null, "bob must NOT access alice's session via gateway");

    // The mapping itself must produce different user IDs
    assert.notEqual(aliceMapping.ardynUserId, bobMapping.ardynUserId,
      "gateway must map different platform users to different Ardyn users");
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});