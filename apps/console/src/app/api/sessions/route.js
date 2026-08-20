// M10: API route — per-user sessions (list user's own sessions only)
import { checkAuth, unauthorizedResponse } from "../../../lib/auth.js";

export async function GET(request) {
  const auth = checkAuth(request);
  if (!auth.authenticated) return unauthorizedResponse();

  // M10: only return sessions for the authenticated user
  // ponytail: in production, this would query the multi-user DB with userId scoping
  return Response.json({
    status: "ok",
    userId: auth.userId ?? "anonymous",
    authMode: auth.mode,
    sessions: [], // user's own sessions only — never other users'
    message: "Sessions are scoped to the authenticated user",
  });
}