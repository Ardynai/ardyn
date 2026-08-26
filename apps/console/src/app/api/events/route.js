// M6: SSE endpoint — reads from event buffer (bridges CLI→console)
// U4: tails the buffer by BYTE OFFSET (never wall-clock), so events written
// between two polls can no longer be skipped; each connected client starts at
// the current end-of-file and receives only events appended afterwards.
// U5: EventSource cannot send headers, so a valid `?token=` (constant-time
// checked against ARDYN_CONSOLE_API_KEY / per-user tokens) authenticates the
// stream when header auth is unavailable.
import { checkAuth, unauthorizedResponse, verifyEventsToken } from "../../../lib/auth.js";
import { readEventsFromOffset, currentOffset } from "../../../lib/event-buffer.js";

export async function GET(request) {
  const auth = checkAuth(request);
  let effective = auth;
  if (!auth.authenticated) {
    // U5: header-less clients (EventSource) may present ?token= instead.
    try {
      const token = new URL(request.url).searchParams.get("token");
      if (token) {
        const verdict = verifyEventsToken(token);
        if (verdict.ok) {
          effective = {
            authenticated: true,
            mode: verdict.mode === "user" ? "user" : "authenticated",
            userId: verdict.userId ?? null,
          };
        }
      }
    } catch {}
  }
  if (!effective.authenticated) return unauthorizedResponse();

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (event, data) => {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      };

      send("connected", { status: "ok", timestamp: new Date().toISOString() });

      // U4: start tailing at the current end-of-file so a fresh connection
      // receives only NEW events, then advance by consumed byte offsets.
      let offset = await currentOffset();
      const interval = setInterval(async () => {
        try {
          const { events, nextOffset } = await readEventsFromOffset(offset);
          offset = nextOffset;
          for (const evt of events) {
            send("session_event", evt);
          }
        } catch {}
      }, 2000);

      request.signal?.addEventListener("abort", () => {
        clearInterval(interval);
        // The client side (undici) may have already closed or errored the
        // stream by the time our listener runs — closing again throws
        // ERR_INVALID_STATE. Teardown must be idempotent.
        try { controller.close(); } catch {}
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
