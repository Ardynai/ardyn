// M13: Multi-interface gateway — channel adapters, per-user mapping, webhook verification
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

// ── Channel adapter interface ──

test("M13: TelegramAdapter implements channel adapter interface", () => {
  const adapter = new TelegramAdapter({ botToken: "test-token" });
  assert.equal(adapter.platform, "telegram");
  assert.ok(typeof adapter.parseInbound === "function", "must have parseInbound");
  assert.ok(typeof adapter.formatOutbound === "function", "must have formatOutbound");
  assert.ok(typeof adapter.verifyWebhook === "function", "must have verifyWebhook");
});

test("M13: SlackAdapter implements channel adapter interface", () => {
  const adapter = new SlackAdapter({ signingSecret: "test-secret" });
  assert.equal(adapter.platform, "slack");
  assert.ok(typeof adapter.parseInbound === "function");
  assert.ok(typeof adapter.formatOutbound === "function");
  assert.ok(typeof adapter.verifyWebhook === "function");
});

// ── Webhook signature verification ──

test("M13: Telegram webhook verification accepts the real secret-token header", () => {
  // U7 fix: Telegram delivers its setWebhook secret in the
  // X-Telegram-Bot-Api-Secret-Token header; verification constant-compares it.
  const body = JSON.stringify({ update_id: 1, message: { text: "hello" } });
  const secret = "ardyn-webhook-secret-0123456789abcdef";
  assert.ok(verifyTelegramWebhook({ body, secret, headers: { "x-telegram-bot-api-secret-token": secret } }));
});

test("M13: Telegram webhook verification denies wrong/missing/garbage credentials", () => {
  const body = JSON.stringify({ update_id: 1 });
  const secret = "ardyn-webhook-secret-0123456789abcdef";
  assert.equal(verifyTelegramWebhook({ body, secret, headers: { "x-telegram-bot-api-secret-token": "wrong" } }), false);
  assert.equal(verifyTelegramWebhook({ body, secret, headers: {} }), false, "missing header must deny");
  assert.equal(verifyTelegramWebhook({ body, secret, signature: undefined }), false, "no credentials must deny");
});

test("M13: Slack webhook verification accepts valid signature", () => {
  const signingSecret = "8f742231b10e8888abcd99e466st";
  // Correctness-cleanup: fresh timestamp (replay window now enforced).
  const timestamp = String(Math.floor(Date.now() / 1000));
  const body = JSON.stringify({ type: "event_callback", event: { text: "hello" } });
  const sigBase = `v0:${timestamp}:${body}`;
  const hmac = createHmac("sha256", signingSecret).update(sigBase).digest("hex");
  const signature = `v0=${hmac}`;
  assert.ok(verifySlackWebhook({ body, signingSecret, timestamp, signature }));
});

test("M13: Slack webhook verification rejects invalid signature", () => {
  assert.equal(verifySlackWebhook({
    body: "{}", signingSecret: "wrong", timestamp: "123", signature: "v0=bad"
  }), false);
});

// ── Per-user mapping ──

test("M13: mapUserToArdyn maps platform identity to Ardyn user", () => {
  const mapping = mapUserToArdyn({
    platform: "telegram",
    platformUserId: "12345",
    username: "alice",
  });
  assert.ok(mapping.ardynUserId, "must produce an Ardyn user ID");
  assert.equal(mapping.platform, "telegram");
  assert.equal(mapping.platformUserId, "12345");
});

test("M13: mapUserToArdyn is deterministic — same identity maps to same user", () => {
  const m1 = mapUserToArdyn({ platform: "slack", platformUserId: "U123", username: "bob" });
  const m2 = mapUserToArdyn({ platform: "slack", platformUserId: "U123", username: "bob" });
  assert.equal(m1.ardynUserId, m2.ardynUserId, "same identity must map to same user");
});

test("M13: mapUserToArdyn different identities map to different users", () => {
  const m1 = mapUserToArdyn({ platform: "telegram", platformUserId: "111", username: "alice" });
  const m2 = mapUserToArdyn({ platform: "telegram", platformUserId: "222", username: "bob" });
  assert.notEqual(m1.ardynUserId, m2.ardynUserId, "different identities must map to different users");
});

// ── Gateway: deny-by-default on unknown senders ──

test("M13: gateway denies validly-signed senders that are not on the allowlist", () => {
  // CREDIBILITY PASS: the old test fed magic strings ("unknown-user"/"invalid")
  // whose denial came from signature failure — vacuous. Now: real allowlist.
  // U7: Telegram admission now requires the real secret-token header.
  const secret = "tg-webhook-secret-99887766554433221100";
  const gw = createGateway({ adapters: { telegram: new TelegramAdapter({ botToken: "123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11", webhookSecret: secret }) } });
  const body = JSON.stringify({ update_id: 1, message: { text: "hi", from: { id: 777 } } });
  const headers = { "x-telegram-bot-api-secret-token": secret };

  // Authenticated (real header) but NOT registered → unknown_sender.
  const stranger = gw.handleInbound({
    platform: "telegram", platformUserId: "777", body, headers,
  });
  assert.equal(stranger.allowed, false, "validly-authenticated stranger must be denied");
  assert.equal(stranger.reason, "unknown_sender");

  // Registered sender, same authentication → admitted.
  gw.registerUser("telegram", "777");
  const known = gw.handleInbound({
    platform: "telegram", platformUserId: "777", body, headers,
  });
  assert.equal(known.allowed, true, "registered sender admitted");
});

test("M13: allowedSenders option seeds the admission allowlist", () => {
  const secret = "tg-webhook-secret-aabbccddeeff00112233";
  const gw = createGateway({
    adapters: { telegram: new TelegramAdapter({ botToken: "t", webhookSecret: secret }) },
    allowedSenders: [{ platform: "telegram", platformUserId: "42" }],
  });
  const body = JSON.stringify({ update_id: 2, message: {} });
  const headers = { "x-telegram-bot-api-secret-token": secret };
  assert.equal(gw.handleInbound({ platform: "telegram", platformUserId: "42", body, headers }).allowed, true);
  assert.equal(gw.handleInbound({ platform: "telegram", platformUserId: "43", body, headers }).reason, "unknown_sender");
});

test("M13: gateway rate-limits per user (windowed — resets after the window)", () => {
  const gw = createGateway({ adapters: {}, rateLimitPerUser: 2, rateLimitWindowMs: 1000 });
  let t = 1_000_000;
  assert.ok(gw.checkRateLimit("user-1", t), "first request allowed");
  assert.ok(gw.checkRateLimit("user-1", t), "second request allowed");
  assert.equal(gw.checkRateLimit("user-1", t), false, "third request in-window limited");
  t += 1001; // window elapsed → bucket reset
  assert.ok(gw.checkRateLimit("user-1", t), "window reset — requests flow again");
  // different user unaffected
  assert.ok(gw.checkRateLimit("user-2", t), "different user not rate-limited");
});