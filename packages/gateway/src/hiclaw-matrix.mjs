// M19: HiClaw Matrix channel adapter — raw-fetch Matrix client-server, NO SDK.
// Authorized relaxation 2026-08-20 (docs/plan/autobuild/SECURITY-INVARIANTS.md):
// minimal raw-HTTP Matrix client to the HiClaw homeserver ONLY (send m.room.message
// m.text via txn PUT; receive via /sync long-poll). STILL BANNED: matrix-js-sdk /
// @matrix-org/* dependencies and any E2EE — m.room.encrypted events are skipped,
// never decrypted.
//
// Interface: same channel-adapter shape as TelegramAdapter/SlackAdapter
// (platform, parseInbound, formatOutbound, verifyWebhook) plus send(target, text)
// and a sync() long-poll loop.
//
// SECURITY FLOOR:
// - Deny-by-default inbound: room AND sender must be allowlisted; unknown
//   sender/room rejected; own echoes skipped; encrypted events skipped.
// - Token from env (tokenEnv) or gitignored config/secret/hiclaw.json. Never
//   logged, never in URLs (Bearer header only), redacted from errors.
// - Identity mapping reuses mapUserToArdyn — per-user isolation identical to
//   every other channel; gated runtime/computer-use actions still pass the same
//   approval + kill + audit + redaction gates (adapter never bypasses them).
import { readFileSync } from "node:fs";
import { randomBytes } from "node:crypto";
import { mapUserToArdyn } from "./gateway.mjs";

const SECRET_FILE = "config/secret/hiclaw.json";
const API = "/_matrix/client/v3";

function resolveToken(tokenEnv, secretFile) {
  const fromEnv = tokenEnv ? process.env[tokenEnv] : undefined;
  if (fromEnv) return fromEnv;
  try {
    const file = JSON.parse(readFileSync(secretFile, "utf8"));
    if (tokenEnv && typeof file[tokenEnv] === "string") return file[tokenEnv];
  } catch {
    // absent/unreadable secret file is fine — env is primary
  }
  throw new Error(`Missing HiClaw Matrix token: set ${tokenEnv ?? "<tokenEnv>"} (or add it to ${secretFile}). No requests will be made.`);
}

function redact(text, ...secrets) {
  let out = String(text);
  for (const s of secrets) {
    if (s && typeof s === "string" && s.length > 0) out = out.split(s).join("[REDACTED]");
  }
  return out;
}

function localpart(userId) {
  return String(userId ?? "").replace(/^@/, "").split(":")[0] || "";
}

// encodeURIComponent leaves "!" unescaped; Matrix room ids start with "!" so
// encode it explicitly for path safety.
function encPath(segment) {
  return encodeURIComponent(String(segment)).replace(/!/g, "%21");
}

export function createHiClawMatrixAdapter(options = {}) {
  const {
    baseUrl,
    tokenEnv = "ARDYN_HICLAW_MATRIX_TOKEN",
    fetchImpl = globalThis.fetch,
    rooms = {},          // { "<workerName>": { matrix_user_id, room_id } } (workers-registry shape)
    allowedSenders,      // optional extra sender allowlist; defaults to mapped matrix_user_ids
    selfUserId,          // Ardyn's own Matrix user id — own echoes are always skipped
    secretFile = SECRET_FILE,
  } = options;
  if (!baseUrl) throw new Error("createHiClawMatrixAdapter: baseUrl is required");
  if (typeof fetchImpl !== "function") throw new Error("createHiClawMatrixAdapter: fetchImpl must be a function");

  // Allowlists built once at construction — deny-by-default thereafter.
  const byName = new Map();
  const byRoomId = new Map();
  for (const [name, entry] of Object.entries(rooms)) {
    const userId = entry?.matrix_user_id;
    const roomId = entry?.room_id;
    if (!userId || !String(userId).startsWith("@")) {
      throw new Error(`rooms["${name}"].matrix_user_id must be a Matrix user id (@localpart:domain)`);
    }
    if (!roomId || !String(roomId).startsWith("!")) {
      throw new Error(`rooms["${name}"].room_id must be a Matrix room id (!opaque:domain)`);
    }
    const e = { name, matrixUserId: String(userId), roomId: String(roomId) };
    byName.set(name, e);
    byRoomId.set(e.roomId, e);
  }
  const senderAllowlist = new Set(allowedSenders ?? [...byRoomId.values()].map(e => e.matrixUserId));

  function resolveTarget(target) {
    // Credibility pass: outbound is now deny-by-default too — every target
    // form must resolve to a room in the configured registry. (Previously the
    // object/raw-room forms bypassed the allowlist entirely.)
    if (target && typeof target === "object") {
      const roomId = target.roomId ?? target.room_id;
      if (!roomId) throw new Error("send target object requires roomId");
      const known = byRoomId.get(String(roomId));
      if (!known) {
        throw new Error(`Refused: room "${String(roomId)}" is not in the configured rooms registry (outbound is deny-by-default).`);
      }
      return { roomId: known.roomId, mentionUserId: target.userId ?? known.matrixUserId };
    }
    const t = String(target ?? "");
    if (byName.has(t)) {
      const e = byName.get(t);
      return { roomId: e.roomId, mentionUserId: e.matrixUserId };
    }
    if (t.startsWith("!")) {
      const known = byRoomId.get(t);
      if (!known) {
        throw new Error(`Refused: room "${t}" is not in the configured rooms registry (outbound is deny-by-default).`);
      }
      return { roomId: known.roomId, mentionUserId: known.matrixUserId };
    }
    throw new Error(`Unknown HiClaw target "${t}": not in the configured rooms registry`);
  }

  // Pure: pull plaintext m.text messages out of a /sync response body.
  // m.room.encrypted events are SKIPPED (never decrypted) per authorized floor.
  function extractEvents(syncBody) {
    const out = [];
    const join = syncBody?.rooms?.join ?? {};
    for (const [roomId, room] of Object.entries(join)) {
      for (const ev of room?.timeline?.events ?? []) {
        if (ev?.type !== "m.room.message") continue;
        if (ev?.content?.msgtype !== "m.text" || typeof ev?.content?.body !== "string") continue;
        out.push({
          eventId: ev.event_id,
          roomId,
          sender: ev.sender,
          text: ev.content.body,
          originServerTs: ev.origin_server_ts,
        });
      }
    }
    return out;
  }

  // Deny-by-default inbound auth: authenticated homeserver stream + allowlists.
  function rejectReason(ev) {
    if (!ev || typeof ev !== "object") return "malformed_event";
    if (!byRoomId.has(ev.roomId)) return "foreign_room";
    if (selfUserId && ev.sender === selfUserId) return "self_echo";
    if (!senderAllowlist.has(ev.sender)) return "unknown_sender";
    return null;
  }

  function accepts(ev) {
    return rejectReason(ev) === null;
  }

  let cursor = null; // next_batch; ponytail: in-memory only — after restart the
                     // timeline resumes from "now". Upgrade path: persist via
                     // restoreCursor() into config/ or the embedded DB.

  const adapter = {
    platform: "hiclaw",
    rooms: byName,

    getCursor() { return cursor; },
    restoreCursor(value) { cursor = value ?? null; },

    // Outbound: PUT txn endpoint with unique txn_id (homeserver-side dedupe).
    async send(target, text) {
      const token = resolveToken(tokenEnv, secretFile); // fail closed pre-fetch
      const { roomId, mentionUserId } = resolveTarget(target);
      const txnId = `ardyn.${Date.now()}.${randomBytes(8).toString("hex")}`;
      const url = `${baseUrl.replace(/\/$/, "")}${API}/rooms/${encPath(roomId)}/send/m.room.message/${encPath(txnId)}`;
      const body = { msgtype: "m.text", body: String(text ?? "") };
      if (mentionUserId && !body.body.includes(mentionUserId)) {
        body["m.mentions"] = { user_ids: [mentionUserId] }; // wake the worker (HiClaw @mention protocol)
      }
      let res;
      try {
        res = await fetchImpl(url, {
          method: "PUT",
          headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
          body: JSON.stringify(body),
        });
      } catch (err) {
        throw new Error(redact(`hiclaw send failed: ${err?.message ?? err}`, token));
      }
      if (!res.ok) {
        // Status only on purpose: response bodies may echo room/message content
        throw new Error(redact(`hiclaw send failed: HTTP ${res.status} ${res.statusText ?? ""}`.trim(), token));
      }
      const json = await res.json().catch(() => ({}));
      return { eventId: json.event_id ?? null, roomId, txnId };
    },

    // Long-poll receive loop. Yields { events (accepted only), nextBatch }.
    // Callers break when done; cursor advances every poll (persist externally
    // via restoreCursor/getCursor if restart-survival is needed).
    async *sync({ since, timeoutMs = 30000, maxPolls = Infinity, signal } = {}) {
      const token = resolveToken(tokenEnv, secretFile); // fail closed pre-fetch
      let from = since ?? adapter.getCursor();
      for (let i = 0; i < maxPolls; i++) {
        const qs = new URLSearchParams();
        if (from) qs.set("since", from);
        qs.set("timeout", String(Math.max(0, Number(timeoutMs) || 0)));
        const url = `${baseUrl.replace(/\/$/, "")}${API}/sync?${qs.toString()}`;
        let res;
        try {
          res = await fetchImpl(url, {
            method: "GET",
            headers: { authorization: `Bearer ${token}` },
            signal,
          });
        } catch (err) {
          throw new Error(redact(`hiclaw sync failed: ${err?.message ?? err}`, token));
        }
        if (!res.ok) {
          throw new Error(redact(`hiclaw sync failed: HTTP ${res.status} ${res.statusText ?? ""}`.trim(), token));
        }
        const body = await res.json();
        cursor = body.next_batch ?? cursor;
        // U15 fix: extract once, partition — extractEvents(body) ran twice.
        const allEvents = extractEvents(body);
        yield {
          events: allEvents.filter(accepts),
          rejected: allEvents.filter((ev) => !accepts(ev)),
          nextBatch: cursor,
        };
        from = cursor;
      }
    },

    // Gateway-standard inbound shape (same fields as Telegram/Slack adapters).
    parseInbound(event) {
      const reason = rejectReason(event);
      if (reason) return { platform: this.platform, rejected: true, reason };
      return {
        platform: this.platform,
        platformUserId: event.sender,
        username: localpart(event.sender),
        text: event.text,
        chatId: event.roomId,
        worker: byRoomId.get(event.roomId)?.name ?? null,
        raw: event,
      };
    },

    // Inbound "auth" for the generic gateway path: an event is authentic iff it
    // arrived over the Bearer-authenticated /sync stream AND passes the
    // deny-by-default allowlists. There is no webhook signature on this path.
    verifyWebhook({ event } = {}) {
      return accepts(event);
    },

    formatOutbound(text) {
      return { msgtype: "m.text", body: String(text ?? "") };
    },

    // Per-user identity mapping — SAME mechanism as Telegram/Slack channels.
    mapSender(sender) {
      return mapUserToArdyn({ platform: "hiclaw", platformUserId: sender, username: localpart(sender) });
    },

    // Exposed for tests/ops; rejects with deny reason instead of throwing.
    classifyEvent(ev) {
      return rejectReason(ev);
    },

    // Pure extraction of plaintext m.text events from a /sync body (exposed
    // for tests and for consumers that drive their own poll loop).
    extractEvents,
  };

  return adapter;
}

export default { createHiClawMatrixAdapter };
