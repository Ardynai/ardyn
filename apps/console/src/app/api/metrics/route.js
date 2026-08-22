// M16: Prometheus metrics endpoint for production ops.
// Emits text/plain exposition format from the process-wide registry.
//
// PRIVACY: aggregate series + structural labels only (platform, outcome,
// pseudonymous hashed user ids). Never usernames, message/action text,
// tokens/secrets. The per-user gauge hashes user ids one-way before render.
import { checkAuth, unauthorizedResponse } from "../../../lib/auth.js";
import { metrics } from "@ardyn/core/metrics";

export async function GET(request) {
  const auth = checkAuth(request);
  if (!auth.authenticated) return unauthorizedResponse();

  // Optional DB-backed gauge: active sessions per user (pseudonymized at render).
  // Set ARDYN_MULTI_USER_DB_PATH to the shared multi-user SQLite file to enable;
  // without it the gauge is simply absent — never an error, never a secret leak.
  const dbPath = process.env.ARDYN_MULTI_USER_DB_PATH ?? "";
  if (dbPath) {
    try {
      const { DatabaseSync } = await import("node:sqlite");
      let db;
      metrics.setActiveSessionProvider(() => {
        db = db ?? new DatabaseSync(dbPath);
        return db.prepare(
          "SELECT user_id AS userId, COUNT(*) AS count FROM user_sessions WHERE status = 'active' GROUP BY user_id"
        ).all();
      });
    } catch {
      metrics.setActiveSessionProvider(null);
    }
  } else {
    metrics.setActiveSessionProvider(null);
  }

  return new Response(metrics.render(), {
    status: 200,
    headers: { "content-type": "text/plain; version=0.0.4; charset=utf-8" },
  });
}
