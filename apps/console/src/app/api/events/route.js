// M6: SSE endpoint — reads from event buffer (bridges CLI→console)
import { checkAuth, unauthorizedResponse } from "../../lib/auth.js";
import { readEvents } from "../../lib/event-buffer.js";

export async function GET(request) {
  const auth = checkAuth(request);
  if (!auth.authenticated) return unauthorizedResponse();

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (event, data) => {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      };

      send("connected", { status: "ok", timestamp: new Date().toISOString() });

      // Poll event buffer every 2 seconds for new events
      let lastRead = Date.now();
      const interval = setInterval(async () => {
        try {
          const events = await readEvents(lastRead);
          for (const evt of events) {
            send("session_event", evt);
          }
          lastRead = Date.now();
        } catch {}
      }, 2000);

      request.signal?.addEventListener("abort", () => {
        clearInterval(interval);
        controller.close();
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