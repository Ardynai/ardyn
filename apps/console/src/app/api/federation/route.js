// M6: API route — federation status (authenticated)
import { checkAuth, unauthorizedResponse } from "../../../lib/auth.js";
// U15 fix: single source of truth — the closed sibling set is imported from
// the fabric package instead of a drifted hand-copied literal.
import { FABRIC_FEDERATION_CLOSED_SIBLING_DIDS } from "../../../../../../packages/fabric/src/federation.mjs";

export async function GET(request) {
  const auth = checkAuth(request);
  if (!auth.authenticated) return unauthorizedResponse();
  return Response.json({
    wired: true,
    gated: true,
    loopbackOnly: true,
    remoteHttps: true,
    closedSiblingAllowlist: [...FABRIC_FEDERATION_CLOSED_SIBLING_DIDS],
    hardening: {
      redirectManual: true,
      hostAllowlist: true,
      responseSizeCap: "streamed-bytes", // credibility pass: cap counts actual bytes
      identityConfinement: true,
    },
    authMode: auth.mode,
  });
}