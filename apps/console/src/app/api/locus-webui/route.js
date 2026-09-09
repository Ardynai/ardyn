import { createLocusEmbedServer } from "../../../lib/locus-embed/server.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const handlers = createLocusEmbedServer();
export const GET = handlers.GET;
export const POST = handlers.POST;
