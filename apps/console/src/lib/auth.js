// M6: API key middleware for console authentication
// Sets up ARDYN_CONSOLE_API_KEY env var as the required key
// If not set, all API routes are open (local dev mode)

export function checkAuth(request) {
  const apiKey = process.env.ARDYN_CONSOLE_API_KEY;
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
  return Response.json(
    { error: "Unauthorized: set x-api-key header" },
    { status: 401 }
  );
}