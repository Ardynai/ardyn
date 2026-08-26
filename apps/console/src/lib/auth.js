// B5/M10: API key + per-user middleware for console authentication
// In production (NODE_ENV=production): fails closed — requires ARDYN_CONSOLE_API_KEY or per-user auth
// In dev: open if no key configured

import { timingSafeEqual } from "node:crypto";

function safeEq(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

// U5: EventSource cannot send custom headers, so the live-events feed can
// authenticate with a short-lived `?token=` query parameter instead. The
// token is constant-time compared against the console API key and every
// configured per-user token. Fails closed when nothing is configured.
export function verifyEventsToken(token) {
  const apiKey = process.env.ARDYN_CONSOLE_API_KEY;
  if (!apiKey || typeof token !== "string" || token.length === 0) return { ok: false };
  if (safeEq(token, apiKey)) return { ok: true, mode: "authenticated", userId: null };
  if (process.env.ARDYN_CONSOLE_USER_TOKENS) {
    try {
      const tokens = JSON.parse(process.env.ARDYN_CONSOLE_USER_TOKENS);
      for (const [userId, userToken] of Object.entries(tokens)) {
        if (safeEq(token, userToken)) return { ok: true, mode: "user", userId };
      }
    } catch {}
  }
  return { ok: false };
}

export function checkAuth(request) {
  const apiKey = process.env.ARDYN_CONSOLE_API_KEY;
  const isProduction = process.env.NODE_ENV === "production";

  // B5: In production, fail closed — require an API key or per-user token
  if (isProduction && !apiKey) {
    return { authenticated: false, mode: "production_no_key" };
  }

  if (!apiKey) {
    return { authenticated: true, mode: "open" };
  }

  const provided = request.headers.get("x-api-key") ?? "";
  if (provided === apiKey) {
    return { authenticated: true, mode: "authenticated" };
  }

  // M10: check per-user auth token
  const userToken = request.headers.get("x-user-token") ?? "";
  if (userToken && process.env.ARDYN_CONSOLE_USER_TOKENS) {
    try {
      const tokens = JSON.parse(process.env.ARDYN_CONSOLE_USER_TOKENS);
      const user = Object.entries(tokens).find(([_, token]) => token === userToken);
      if (user) {
        return { authenticated: true, mode: "user", userId: user[0] };
      }
    } catch {}
  }

  return { authenticated: false, mode: "rejected" };
}

export function unauthorizedResponse() {
  const isProduction = process.env.NODE_ENV === "production";
  const message = isProduction && !process.env.ARDYN_CONSOLE_API_KEY
    ? "Production mode requires ARDYN_CONSOLE_API_KEY to be set"
    : "Unauthorized: set x-api-key header or x-user-token header";
  return Response.json(
    { error: message },
    { status: 401 }
  );
}