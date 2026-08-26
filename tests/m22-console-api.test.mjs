// Credibility pass: behavioral tests for the console API routes (previously
// zero coverage) + proof that auth fails closed in production.
// Routes are Next.js handlers — invoked here directly with Request objects
// (Node 20+ provides global Request/Response).
import assert from "node:assert/strict";
import test from "node:test";

const statusRoute = await import("../apps/console/src/app/api/status/route.js");
const sessionsRoute = await import("../apps/console/src/app/api/sessions/route.js");
const healthRoute = await import("../apps/console/src/app/api/health/route.js");
const loginRoute = await import("../apps/console/src/app/api/login/route.js");
const runtimeRoute = await import("../apps/console/src/app/api/runtime/route.js");
const federationRoute = await import("../apps/console/src/app/api/federation/route.js");
const eventsRoute = await import("../apps/console/src/app/api/events/route.js");
const { checkAuth } = await import("../apps/console/src/lib/auth.js");

function req(headers = {}) {
  return new Request("http://127.0.0.1:3000/api/test", { headers });
}

test("M21-B: health endpoint is open and healthy", async () => {
  const res = await healthRoute.GET();
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.status, "healthy");
});

test("M21-B: status route requires auth and returns NO fabricated test counts", async () => {
  // dev-open mode (no key, not production) → authenticated
  delete process.env.ARDYN_CONSOLE_API_KEY;
  process.env.NODE_ENV = "test";
  const res = await statusRoute.GET(req());
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.totalTests, undefined, "must not invent a totalTests number");
  assert.equal(body.testSuite?.available, false, "suite counts explicitly unavailable unless provided");
  assert.equal(body.federationWired, true, "post-M20 reality: federation is wired");
});

test("M21-B: status route publishes suite counts ONLY from ARDN_CONSOLE_TEST_COUNTS", async () => {
  process.env.NODE_ENV = "test";
  delete process.env.ARDYN_CONSOLE_API_KEY;
  process.env.ARDYN_CONSOLE_TEST_COUNTS = JSON.stringify({ totalTests: 3, passingTests: 3, failingTests: 0 });
  try {
    const body = await (await statusRoute.GET(req())).json();
    assert.deepEqual(body.testSuite, { available: true, totalTests: 3, passingTests: 3, failingTests: 0 });
    delete process.env.ARDYN_CONSOLE_TEST_COUNTS;
    const body2 = await (await statusRoute.GET(req())).json();
    assert.equal(body2.testSuite.available, false);
  } finally {
    delete process.env.ARDYN_CONSOLE_TEST_COUNTS;
  }
});

test("M21-B: PROD with unset API key refuses protected routes (fail-closed proven behaviorally)", async () => {
  const prevEnv = process.env.NODE_ENV;
  const prevKey = process.env.ARDYN_CONSOLE_API_KEY;
  process.env.NODE_ENV = "production";
  delete process.env.ARDYN_CONSOLE_API_KEY;
  try {
    for (const route of [statusRoute, sessionsRoute, runtimeRoute, federationRoute]) {
      const res = await route.GET(req());
      assert.equal(res.status, 401, "production without key must 401");
    }
    // direct unit: checkAuth itself fails closed
    const auth = checkAuth(req());
    assert.equal(auth.authenticated, false);
    assert.equal(auth.mode, "production_no_key");
  } finally {
    process.env.NODE_ENV = prevEnv;
    if (prevKey !== undefined) process.env.ARDYN_CONSOLE_API_KEY = prevKey;
  }
});

test("M21-B: PROD with API key admits requests carrying that key", async () => {
  const prevEnv = process.env.NODE_ENV;
  const prevKey = process.env.ARDYN_CONSOLE_API_KEY;
  process.env.NODE_ENV = "production";
  process.env.ARDYN_CONSOLE_API_KEY = "test-console-key";
  try {
    const res = await statusRoute.GET(req({ "x-api-key": "test-console-key" }));
    assert.equal(res.status, 200);
    const denied = await statusRoute.GET(req({ "x-api-key": "wrong" }));
    assert.equal(denied.status, 401);
  } finally {
    process.env.NODE_ENV = prevEnv;
    if (prevKey === undefined) delete process.env.ARDYN_CONSOLE_API_KEY; else process.env.ARDYN_CONSOLE_API_KEY = prevKey;
  }
});

test("M21-B: sessions route returns an honest empty stub (labeled)", async () => {
  process.env.NODE_ENV = "test";
  delete process.env.ARDYN_CONSOLE_API_KEY;
  const res = await sessionsRoute.GET(req());
  const body = await res.json();
  assert.equal(res.status, 200);
  assert.deepEqual(body.sessions, []);
});

test("M21-B: login route is labeled a stub and does not fabricate registered tokens", async () => {
  process.env.NODE_ENV = "test";
  const request = new Request("http://127.0.0.1:3000/api/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ username: "alice", passwordHash: "not-a-real-hash" }),
  });
  const res = await loginRoute.POST(request);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.stub, true, "login must self-identify as stub auth");
});

test("M21-B: federation route reports wired+gated posture (post-M20)", async () => {
  process.env.NODE_ENV = "test";
  delete process.env.ARDYN_CONSOLE_API_KEY;
  const res = await federationRoute.GET(req());
  const body = await res.json();
  // Strengthened (review pass 2026-08-25): previously a tautology — the flag
  // was compared against a recomputation of itself. The post-M20 contract is
  // wired=true; assert it explicitly, and pin the closed sibling set size.
  assert.equal(body.wired, true, "federation exchange is WIRED post-M20");
  assert.equal(body.gated, true, "exchange must be gated");
  assert.ok(Array.isArray(body.closedSiblingAllowlist) && body.closedSiblingAllowlist.length === 9,
    "closed sibling allowlist must list all 9 federation DIDs");
});

test("M21-B: events route streams SSE content-type (behavioral smoke)", async () => {
  process.env.NODE_ENV = "test";
  delete process.env.ARDYN_CONSOLE_API_KEY;
  // U4/U5 closeout: use the m24-proven lifecycle — timer abort while the read
  // loop is parked — so undici tears the request down deterministically (the
  // old single-read-then-abort shape left the socket holding the event loop).
  const controller = new AbortController();
  setTimeout(() => controller.abort(), 700);
  const signal = controller.signal;
  const request = new Request("http://127.0.0.1:3000/api/events", { signal });
  const res = await eventsRoute.GET(request);
  const ct = res.headers.get("content-type") ?? "";
  assert.match(ct, /text\/event-stream/, "events route must speak SSE");
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let raw = "";
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      raw += decoder.decode(value, { stream: true });
      if (raw.includes("event: connected")) break; // got what we came for
    }
  } catch {
    // abort ends the poll loop
  }
  try { await reader.cancel(); } catch {}
  assert.match(raw, /event: connected/, "connected frame must arrive");
});
