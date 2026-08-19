// M6: API route — federation status (authenticated)
import { checkAuth, unauthorizedResponse } from "../../lib/auth.js";

export async function GET(request) {
  const auth = checkAuth(request);
  if (!auth.authenticated) return unauthorizedResponse();
  return Response.json({
    wired: true,
    loopbackOnly: true,
    remoteHttps: true,
    closedSiblingAllowlist: ["did:multiverse:ardyn", "did:multiverse:locus"],
    hardening: {
      redirectManual: true,
      hostAllowlist: true,
      responseSizeCap: true,
      identityConfinement: true,
    },
    authMode: auth.mode,
  });
}