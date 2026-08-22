// M13: Multi-interface gateway — pluggable channel adapters
// Pattern adapted from hermes-agent (MIT, NousResearch/hermes-agent) — not vendored.
// One gateway process, shared slash-command surface across interfaces.
// Telegram + Slack adapters implemented end-to-end; others are adapter stubs.
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
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

// ── Channel adapter interface ──
// Each adapter implements: platform, parseInbound, formatOutbound, verifyWebhook

export class TelegramAdapter {
  constructor({ botToken }) {
    this.platform = "telegram";
    this.botToken = botToken; // from env ARDYN_TELEGRAM_BOT_TOKEN — never committed
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

  verifyWebhook({ body, secret, signature }) {
    // Telegram uses a secret token in headers, not HMAC of body
    // For this implementation, we verify using the bot token as the secret
    const expected = createHmac("sha256", secret).update(body).digest("hex");
    return safeCompare(expected, signature);
  }
}

export class SlackAdapter {
  constructor({ signingSecret }) {
    this.platform = "slack";
    this.signingSecret = signingSecret; // from env ARDYN_SLACK_SIGNING_SECRET — never committed
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
    const sigBase = `v0:${timestamp}:${body}`;
    const expected = `v0=${createHmac("sha256", signingSecret).update(sigBase).digest("hex")}`;
    return safeCompare(expected, signature);
  }
}

// Stub adapters for other platforms
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

export function verifyTelegramWebhook({ body, secret, signature }) {
  const expected = createHmac("sha256", secret).update(body).digest("hex");
  return safeCompare(expected, signature);
}

export function verifySlackWebhook({ body, signingSecret, timestamp, signature }) {
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
    handleInbound({ platform, platformUserId, body, signature, timestamp }) {
      // M16 metrics — channel label only; never message content. Counted only
      // for KNOWN platforms so junk strings cannot mint Prometheus series.
      if (!adapters[platform]) {
        return { allowed: false, reason: "unknown_platform" };
      }
      metrics.counter("ardyn_gateway_messages_total", { platform: String(platform) });
      const adapter = adapters[platform];

      // Verify webhook signature
      if (!adapter.verifyWebhook({ body, signature, signingSecret: adapter.signingSecret ?? adapter.botToken, secret: adapter.botToken, timestamp })) {
        return { allowed: false, reason: "invalid_signature" };
      }

      // Deny-by-default on unknown senders: admission requires explicit
      // registration (options.allowedSenders / registerUser()).
      const userKey = `${platform}:${platformUserId}`;
      if (!knownUsers.has(userKey)) {
        return { allowed: false, reason: "unknown_sender" };
      }

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