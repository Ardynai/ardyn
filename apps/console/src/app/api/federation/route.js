// M6: API route — federation status
export async function GET() {
  return Response.json({
    wired: true,
    loopbackOnly: true,
    remoteHttps: true,
    closedSiblingAllowlist: [
      "did:multiverse:ardyn",
      "did:multiverse:locus",
    ],
    hardening: {
      redirectManual: true,
      hostAllowlist: true,
      responseSizeCap: true,
      identityConfinement: true,
    },
  });
}