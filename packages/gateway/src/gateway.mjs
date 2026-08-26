// M13: Multi-interface gateway — pluggable channel adapters
// Pattern adapted from hermes-agent (MIT, NousResearch/hermes-agent) — not vendored.
// One gateway process, shared slash-command surface across interfaces.
// U7 honesty: Telegram and Slack are REAL verify+send LIBRARIES (Telegram
// verifies its actual secret-token header; both adapters can deliver via
// injectable fetch). They are NOT a running service: nothing here binds an
// HTTP listener, so webhook RECEIPT still requires operator wiring.
//
// Each inbound message is authenticated and mapped to an Ardyn user (M10 multi-user).
// Per-user isolation holds across every channel.
// Platform bot tokens/secrets load from env / gitignored config/secret/ — never committed.
// The gateway is a thin front door: any runtime/computer-use action still goes through
// the SAME approval + kill + audit + redaction gates — the gateway never bypasses them.

import { createHmac, timingSafeEqual } from "node:crypto";
import { runProcessors } from "../../core/src/processor-pipeline.mjs";
import { metrics } from "../../core/src/metrics.mjs";

// ── Constant-time comparison helper ──
function safeCompare(a, b) {
  // Fail-closed: undefined/null/non-string inputs deny instead of throwing.
  if (typeof a !== "string" || typeof b !== "string") return false;
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

// Correctness-cleanup: Slack replay protection. A signed request older than
// SLACK_REPLAY_WINDOW_SECONDS is rejected even with a valid signature.
const SLACK_REPLAY_WINDOW_SECONDS = 5 * 60;

function slackTimestampIsFresh(timestamp, nowMs = Date.now()) {
  const ts = Number(timestamp);
  if (!Number.isFinite(ts)) return false;
  return Math.abs(nowMs / 1000 - ts) <= SLACK_REPLAY_WINDOW_SECONDS;
}

// ── Channel adapter interface ──
// Each adapter implements: platform, parseInbound, formatOutbound, verifyWebhook,
// send (real outbound delivery via injectable fetch).

export class TelegramAdapter {
  constructor({ botToken, webhookSecret, fetchImpl } = {}) {
    this.platform = "telegram";
    this.botToken = botToken; // from env ARDYN_TELEGRAM_BOT_TOKEN — never committed
    // U7: the webhook secret is INDEPENDENT of the bot token — it is the
    // secret_token you generate when calling setWebhook. Falls back to the
    // bot token only if the operator has not configured one.
    this.webhookSecret = webhookSecret ?? botToken;
    // Injectable for tests; defaults to global fetch. Missing token fails at
    // send time with a clear error naming the env var (fail-closed).
    this._fetch = fetchImpl ?? globalThis.fetch?.bind(globalThis) ?? null;
  }

  parseInbound(body) {
    const update = typeof body === "string" ? JSON.parse(body) : body;
    const msg = update.message ?? update.callback_query?.message;
    if (!msg) return null;
    return {
      platform: this.platform,
      platformUserId: String(msg.from?.id ?? ""),
      username: msg.from?.username ?? msg.from?.first_name ?? "",
      text: msg.text ?? "",
      chatId: String(msg.chat?.id ?? ""),
      raw: update,
    };
  }

  formatOutbound(text) {
    return { method: "sendMessage", text, parse_mode: "Markdown" };
  }

  // U7 fix: Telegram authenticates webhooks with the secret token IT generated
  // at setWebhook time, delivered in the X-Telegram-Bot-Api-Secret-Token
  // header — constant-compared against the configured secret. (The previous
  // HMAC-over-body scheme no genuine Telegram delivery would ever satisfy.)
  verifyWebhook({ headers, secret, body, signature }) {
    const headerName = Object.keys(headers ?? {}).find(
      (k) => k.toLowerCase() === "x-telegram-bot-api-secret-token"
    );
    const provided = headerName ? headers[headerName] : signature;
    void body; // Telegram's scheme does not sign the body
    return safeCompare(provided, secret);
  }

  // Real outbound delivery: POST sendMessage to the Telegram Bot API.
  async send(chatId, text) {
    if (!this.botToken || typeof this.botToken !== "string") {
      throw new Error("telegram_send_missing_token: set ARDYN_TELEGRAM_BOT_TOKEN (or pass botToken)");
    }
    if (!this._fetch) throw new Error("telegram_send_no_fetch_implementation");
    const res = await this._fetch(`https://api.telegram.org/bot${this.botToken}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "Markdown" }),
    });
    const payload = await res.json().catch(() => ({}));
    return { ok: res.ok && payload?.ok === true, status: res.status, payload };
  }
}

export class SlackAdapter {
  constructor({ signingSecret, botToken, fetchImpl } = {}) {
    this.platform = "slack";
    this.signingSecret = signingSecret; // from env ARDYN_SLACK_SIGNING_SECRET — never committed
    // U7: real outbound delivery needs a Bot User OAuth Token (xoxb-…).
    this.botToken = botToken;
    this._fetch = fetchImpl ?? globalThis.fetch?.bind(globalThis) ?? null;
  }

  parseInbound(body) {
    const event = typeof body === "string" ? JSON.parse(body) : body;
    if (event.type === "url_verification") {
      return { platform: this.platform, challenge: event.challenge, text: "" };
    }
    const msg = event.event;
    if (!msg) return null;
    return {
      platform: this.platform,
      platformUserId: msg.user ?? "",
      username: msg.user ?? "",
      text: msg.text ?? "",
      channel: msg.channel ?? "",
      raw: event,
    };
  }

  formatOutbound(text) {
    return { text, response_type: "ephemeral" };
  }

  verifyWebhook({ body, signingSecret, timestamp, signature }) {
    // Replay protection: reject stale timestamps before verifying the HMAC.
    if (!slackTimestampIsFresh(timestamp)) return false;
    const sigBase = `v0:${timestamp}:${body}`;
    const expected = `v0=${createHmac("sha256", signingSecret).update(sigBase).digest("hex")}`;
    return safeCompare(expected, signature);
  }

  // Real outbound delivery: POST chat.postMessage to the Slack Web API.
  async send(channelId, text) {
    if (!this.botToken || typeof this.botToken !== "string") {
      throw new Error("slack_send_missing_token: pass botToken (xoxb-…) to SlackAdapter");
    }
    if (!this._fetch) throw new Error("slack_send_no_fetch_implementation");
    const res = await this._fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: {
        "content-type": "application/json; charset=utf-8",
        authorization: `Bearer ${this.botToken}`,
      },
      body: JSON.stringify({ channel: channelId, text }),
    });
    const payload = await res.json().catch(() => ({}));
    return { ok: res.ok && payload?.ok === true, status: res.status, payload };
  }
}

export class DiscordAdapter {
  constructor({ publicKey }) { this.platform = "discord"; this.publicKey = publicKey; }
  parseInbound(body) { return { platform: "discord", platformUserId: "", text: "" }; }
  formatOutbound(text) { return { content: text }; }
  verifyWebhook({ signature, timestamp, body }) { return false; } // stub
}

export class WhatsAppAdapter {
  constructor({ verifyToken }) { this.platform = "whatsapp"; this.verifyToken = verifyToken; }
  parseInbound(body) { return { platform: "whatsapp", platformUserId: "", text: "" }; }
  formatOutbound(text) { return { messaging_product: "whatsapp", text: { body: text } }; }
  verifyWebhook({ signature, body }) { return false; } // stub
}

export class SignalAdapter {
  constructor({ verifyToken }) { this.platform = "signal"; this.verifyToken = verifyToken; }
  parseInbound(body) { return { platform: "signal", platformUserId: "", text: "" }; }
  formatOutbound(text) { return { message: text }; }
  verifyWebhook({ signature, body }) { return false; } // stub
}

export class EmailAdapter {
  constructor({ apiKey }) { this.platform = "email"; this.apiKey = apiKey; }
  parseInbound(body) { return { platform: "email", platformUserId: "", text: "" }; }
  formatOutbound(text) { return { text }; }
  verifyWebhook({ signature, body }) { return false; } // stub
}

// ── Webhook verification functions (callable directly) ──

export function verifyTelegramWebhook({ headers, secret, body, signature }) {
  // U7 fix: real Telegram scheme — constant-compare the
  // X-Telegram-Bot-Api-Secret-Token header against the configured secret.
  const headerName = Object.keys(headers ?? {}).find(
    (k) => k.toLowerCase() === "x-telegram-bot-api-secret-token"
  );
  const provided = headerName ? headers[headerName] : signature;
  void body; // Telegram's scheme does not sign the body
  return safeCompare(provided, secret);
}

export function verifySlackWebhook({ body, signingSecret, timestamp, signature }) {
  // Replay protection (correctness-cleanup): stale timestamps are rejected
  // even when the HMAC is valid. Missing/undefined signature denies cleanly.
  if (!slackTimestampIsFresh(timestamp)) return false;
  const sigBase = `v0:${timestamp}:${body}`;
  const expected = `v0=${createHmac("sha256", signingSecret).update(sigBase).digest("hex")}`;
  return safeCompare(expected, signature);
}

// ── User mapping ──
// Maps a platform identity to a stable Ardyn user ID (deterministic)
const userMap = new Map();

export function mapUserToArdyn({ platform, platformUserId, username }) {
  const key = `${platform}:${platformUserId}`;
  if (!userMap.has(key)) {
    // Generate a deterministic Ardyn user ID
    const ardynUserId = `ardyn-${platform}-${platformUserId}`;
    userMap.set(key, ardynUserId);
  }
  return { ardynUserId: userMap.get(key), platform, platformUserId, username };
}

// ── Gateway ──

export function createGateway(options = {}) {
  const adapters = options.adapters ?? {};
  const rateLimitPerUser = options.rateLimitPerUser ?? 100;
  // Credibility pass: deny-by-default is now REAL. Only explicitly registered
  // senders (via options.allowedSenders or registerUser()) are admitted; every
  // other sender is rejected as unknown_sender. No auto-registration.
  const knownUsers = new Set();
  for (const entry of options.allowedSenders ?? []) {
    knownUsers.add(typeof entry === "string" && entry.includes(":")
      ? entry
      : `${entry.platform ?? ""}:${entry.platformUserId ?? ""}`);
  }
  // M15: pluggable processor chain (same contract as the computer-use gateway).
  const processors = Array.isArray(options.processors) ? options.processors : [];
  // M16: inject a cross-instance rate limiter (e.g. createDbRateLimiter(db)) for
  // multi-instance deployments. Default is per-process only.
  const customRateLimiter = typeof options.rateLimiter === "function" ? options.rateLimiter : null;
  // Credibility pass: windowed limiter (count + resetAt), replacing the old
  // lifetime counter that permanently locked users out. Expired buckets are
  // swept lazily on each call so the map cannot grow unbounded.
  const rateLimitWindowMs = options.rateLimitWindowMs ?? 60_000;
  const rateBuckets = new Map();
  let lastSweep = Date.now();

  return {
    adapters,
    rateLimitPerUser,
    processors,
    knownUsers,

    // Handle an inbound message — deny-by-default on unknown senders
    handleInbound({ platform, platformUserId, body, headers, signature, timestamp }) {
      // M16 metrics — channel label only; never message content. Counted only
      // for KNOWN platforms so junk strings cannot mint Prometheus series.
      if (!adapters[platform]) {
        return { allowed: false, reason: "unknown_platform" };
      }
      const adapter = adapters[platform];

      // Verify webhook signature (Telegram reads the secret-token header and
      // compares against the adapter's configured webhookSecret).
      if (!adapter.verifyWebhook({ body, headers, signature, signingSecret: adapter.signingSecret ?? adapter.webhookSecret ?? adapter.botToken, secret: adapter.webhookSecret ?? adapter.botToken, timestamp })) {
        return { allowed: false, reason: "invalid_signature" };
      }

      // U15 fix: only ADMITTED messages count toward ardyn_gateway_messages_total —
      // rejected junk (bad signature / unregistered sender) no longer mints
      // traffic the gateway never accepted.

      // Deny-by-default on unknown senders: admission requires explicit
      // registration (options.allowedSenders / registerUser()).
      const userKey = `${platform}:${platformUserId}`;
      if (!knownUsers.has(userKey)) {
        return { allowed: false, reason: "unknown_sender" };
      }

      metrics.counter("ardyn_gateway_messages_total", { platform: String(platform) });
      return { allowed: true, adapter, parsed: adapter.parseInbound(body) };
    },

    // M15: Run the pluggable processor chain around inbound message admission.
    // Pre processors can deny/transform the message before the SAME deny-by-default
    // handleInbound checks run; post processors transform the verdict (e.g. mask
    // secrets in outbound text). Fail-closed: a broken processor denies.
    async gateMessage(message) {
      const ctx = {
        phase: "pre",
        action: {
          action: "inbound_message",
          platform: message.platform,
          platformUserId: message.platformUserId,
          text: message.text ?? "",
        },
        target: null,
        result: null,
        allowed: true,
        decision: "allow",
        auditPayloads: [],
      };
      ctx.target = ctx.action;

      const pre = await runProcessors(processors, "pre", ctx);
      if (!pre.allowed) {
        return { allowed: false, refused: true, reason: pre.decision };
      }

      const verdict = this.handleInbound(message); // unchanged, authoritative

      const postCtx = {
        phase: "post",
        action: ctx.action,
        result: verdict,
        target: verdict && typeof verdict === "object" ? verdict : null,
        allowed: true,
        decision: "allow",
        auditPayloads: [],
      };
      const post = await runProcessors(processors, "post", postCtx);
      if (!post.allowed) {
        return { allowed: false, refused: true, reason: post.decision };
      }
      return postCtx.result;
    },

    // Rate limit per user — windowed (count + resetAt), lazily swept.
    checkRateLimit(userId, now = Date.now()) {
      if (customRateLimiter) return customRateLimiter(userId, rateLimitPerUser);
      // ponytail: in-memory per-process limiter — counts are NOT shared across
      // instances; with N instances each user effectively gets N × rateLimitPerUser.
      // Ceiling: single-instance correctness. Upgrade path: pass
      // createDbRateLimiter(db) from data-auth.mjs as options.rateLimiter.
      if (now - lastSweep > rateLimitWindowMs) {
        for (const [key, bucket] of rateBuckets) {
          if (now > bucket.resetAt) rateBuckets.delete(key);
        }
        lastSweep = now;
      }
      const bucket = rateBuckets.get(userId);
      if (!bucket || now > bucket.resetAt) {
        rateBuckets.set(userId, { count: 1, resetAt: now + rateLimitWindowMs });
        return true;
      }
      bucket.count += 1;
      return bucket.count <= rateLimitPerUser;
    },

    // Register a known user (deny-by-default admission allowlist)
    registerUser(platform, platformUserId) {
      knownUsers.add(`${platform}:${platformUserId}`);
    },
  };
}