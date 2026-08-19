// M6: Server-Sent Events endpoint for real-time session streaming
import { checkAuth, unauthorizedResponse } from "../../lib/auth.js";

export async function GET(request) {
  const auth = checkAuth(request);
  if (!auth.authenticated) return unauthorizedResponse();

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      const send = (event, data) => {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      };

      send("connected", { status: "ok", timestamp: new Date().toISOString() });

      // Send periodic status updates
      const interval = setInterval(() => {
        send("status", {
          runtimeEnabled: true,
          approvalRequired: true,
          timestamp: new Date().toISOString(),
        });
      }, 5000);

      // Clean up on close
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