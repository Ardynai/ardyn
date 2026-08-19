// M6: API route — runtime control (approval-gated, never bypasses security)
export async function GET() {
  return Response.json({
    runtimeEnabled: true,
    approvalRequired: true,
    killSwitchAvailable: true,
    redactionEnabled: true,
    transcriptAuditEnabled: true,
    failureAuditEnabled: true,
    posture: "build-mode",
    approvalGate: "manual",
  });
}

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  if (!body.approve) {
    return Response.json({ error: "Approval required: set approve=true" }, { status: 403 });
  }
  if (!body.command) {
    return Response.json({ error: "Missing command parameter" }, { status: 400 });
  }
  // ponytail: this API route never bypasses the CLI approval gate
  // It returns the plan only — actual execution goes through the CLI
  return Response.json({
    status: "planned",
    approve: true,
    command: body.command,
    message: "Runtime plan created. Execute via CLI: ardyn serve-runtime --enable-runtime --approve",
  });
}