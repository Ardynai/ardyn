// M6: API route — runtime control (authenticated, approval-gated)
import { checkAuth, unauthorizedResponse } from "../../lib/auth.js";

export async function GET(request) {
  const auth = checkAuth(request);
  if (!auth.authenticated) return unauthorizedResponse();
  return Response.json({
    runtimeEnabled: true,
    approvalRequired: true,
    killSwitchAvailable: true,
    redactionEnabled: true,
    transcriptAuditEnabled: true,
    failureAuditEnabled: true,
    posture: "build-mode",
    authMode: auth.mode,
  });
}

export async function POST(request) {
  const auth = checkAuth(request);
  if (!auth.authenticated) return unauthorizedResponse();
  const body = await request.json().catch(() => ({}));
  if (!body.approve) {
    return Response.json({ error: "Approval required: set approve=true" }, { status: 403 });
  }
  return Response.json({
    status: "planned",
    approve: true,
    command: body.command,
    authMode: auth.mode,
    message: "Runtime plan created. Execute via CLI: ardyn serve-runtime --enable-runtime --approve",
  });
}