// B5/M10: API key + per-user middleware for console authentication
// In production (NODE_ENV=production): fails closed — requires ARDYN_CONSOLE_API_KEY or per-user auth
// In dev: open if no key configured

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