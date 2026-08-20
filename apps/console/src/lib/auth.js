// B5: API key middleware for console authentication
// Sets up ARDYN_CONSOLE_API_KEY env var as the required key
// In production (NODE_ENV=production): fails closed — requires ARDYN_CONSOLE_API_KEY
// In dev: open if no key configured

export function checkAuth(request) {
  const apiKey = process.env.ARDYN_CONSOLE_API_KEY;
  const isProduction = process.env.NODE_ENV === "production";

  // B5: In production, fail closed — require an API key
  if (isProduction && !apiKey) {
    return { authenticated: false, mode: "production_no_key" };
  }

  if (!apiKey) {
    // No key configured — local dev mode, allow all
    return { authenticated: true, mode: "open" };
  }

  const provided = request.headers.get("x-api-key") ?? "";
  if (provided === apiKey) {
    return { authenticated: true, mode: "authenticated" };
  }

  return { authenticated: false, mode: "rejected" };
}

export function unauthorizedResponse() {
  const isProduction = process.env.NODE_ENV === "production";
  const message = isProduction && !process.env.ARDYN_CONSOLE_API_KEY
    ? "Production mode requires ARDYN_CONSOLE_API_KEY to be set"
    : "Unauthorized: set x-api-key header";
  return Response.json(
    { error: message },
    { status: 401 }
  );
}