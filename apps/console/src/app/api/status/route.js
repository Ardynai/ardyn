// Credibility pass: phase status route.
// No fabricated numbers. Test counts are only reported when the operator
// provides them via ARDN_CONSOLE_TEST_COUNTS (JSON: {totalTests,passingTests,
// failingTests}); otherwise the field is explicitly "unavailable".
import { checkAuth, unauthorizedResponse } from "../../../lib/auth.js";

export async function GET(request) {
  const auth = checkAuth(request);
  if (!auth.authenticated) return unauthorizedResponse();

  let testSuite = { available: false, note: "set ARDN_CONSOLE_TEST_COUNTS to publish suite results here" };
  const raw = process.env.ARDYN_CONSOLE_TEST_COUNTS;
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (typeof parsed.totalTests === "number" && typeof parsed.passingTests === "number") {
        testSuite = { available: true, ...parsed };
      }
    } catch {
      // malformed env value → stay unavailable, never invent numbers
    }
  }

  return Response.json({
    status: "ok",
    authMode: auth.mode,
    runtimeEnabled: true,
    federationWired: true, // post-M20 reality: send-handoff/receive-handoff are wired (gated)
    milestonesWired: ["M15", "M16", "M17", "M18", "M19", "M20"],
    testSuite,
  });
}
