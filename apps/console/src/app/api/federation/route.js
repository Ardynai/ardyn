// M6: API route — federation status (authenticated)
import { checkAuth, unauthorizedResponse } from "../../../lib/auth.js";

export async function GET(request) {
  const auth = checkAuth(request);
  if (!auth.authenticated) return unauthorizedResponse();
  return Response.json({
    wired: true,
    gated: true,
    loopbackOnly: true,
    remoteHttps: true,
    closedSiblingAllowlist: [
      "did:multiverse:ardyn",
      "did:multiverse:hub",
      "did:multiverse:kortex-audio",
      "did:multiverse:locus",
      "did:multiverse:custos",
      "did:multiverse:somatic",
      "did:multiverse:aegis",
      "did:multiverse:praxis",
      "did:multiverse:kybernetes",
    ],
    hardening: {
      redirectManual: true,
      hostAllowlist: true,
      responseSizeCap: "streamed-bytes", // credibility pass: cap counts actual bytes
      identityConfinement: true,
    },
    authMode: auth.mode,
  });
}