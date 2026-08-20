// M10: API route — user login (per-user authentication)
export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  if (!body.username || !body.passwordHash) {
    return Response.json({ error: "Missing username or passwordHash" }, { status: 400 });
  }
  // ponytail: in production, this would verify against the multi-user DB
  // For now, return a per-user token that can be used with x-user-token header
  const userToken = `token-${body.username}-${Date.now()}`;
  return Response.json({
    status: "ok",
    username: body.username,
    token: userToken,
    message: "Use x-user-token header with this token for per-user API calls",
  });
}