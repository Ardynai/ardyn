// M15: Pluggable pre/post processor pipeline for action gateways
// Pattern adapted from Vision-Agents pluggable processors — not vendored.
import assert from "node:assert/strict";
import test from "node:test";
import {
  policyGateProcessor,
  auditRecordProcessor,
  redactResultProcessor,
  runProcessors,
  redactCapturedText,
} from "../packages/core/src/processor-pipeline.mjs";
import { createActionAudit } from "../packages/core/src/computer-use.mjs";

async function loadCU() {
  return import("../packages/core/src/computer-use.mjs");
}

// ── Declared-order execution ──

test("M15: processors run in declared order across phases (pre → exec → post)", async () => {
  const cu = await loadCU();
  const order = [];
  const mk = (name, phase) => ({
    name,
    phase,
    async process() {
      order.push(`${name}:${phase}`);
      return { action: "allow" };
    },
  });
  const gateway = cu.createGateway({
    policy: null,
    processors: [mk("a", "pre"), mk("b", "pre"), mk("c", "post")],
  });
  // No audit-record processor on purpose: the gateway's record-before-act fallback must kick in.
  const result = await gateway.evaluateAction(
    { action: "screenshot" },
    async () => {
      order.push("exec");
      return { status: "executed", result: "ok" };
    }
  );
  assert.equal(result.allowed, true);
  assert.deepEqual(order, ["a:pre", "b:pre", "exec", "c:post"], "declared order must hold");
});

// ── Deny processor blocks the action AND writes an audit row ──

test("M15: deny processor blocks execution AND writes an audit row", async () => {
  const cu = await loadCU();
  const audit = createActionAudit();
  let executed = false;
  const gateway = cu.createGateway({
    processors: [
      {
        name: "blocklist",
        phase: "pre",
        async process(ctx) {
          if (ctx.action.text?.includes("rm -rf")) return { action: "deny", reason: "forbidden_command" };
          return { action: "allow" };
        },
      },
      policyGateProcessor({ deny: [], allow: [{}] }),
      auditRecordProcessor(audit),
      redactResultProcessor(),
    ],
  });
  const result = await gateway.evaluateAction(
    { action: "type", text: "rm -rf /" },
    async () => {
      executed = true;
      return { status: "executed" };
    }
  );
  assert.equal(result.allowed, false, "deny processor must block the action");
  assert.equal(executed, false, "executor must NOT be called after denial");
  assert.match(result.decision, /deny/, "decision must be a denial");
  const rows = audit.getEvents();
  const row = rows.find(e => e.details?.text === "rm -rf /");
  assert.ok(row, "an audit row must be written even for denials");
  assert.match(row.decision, /forbidden|deny/, "row must carry the denial");
  assert.equal(row.auditRecordWrittenBefore, true, "row written before acting");
});

// ── Redaction of captured text ──

test("M15: redact-result processor masks tokens/secrets in captured text", async () => {
  const cu = await loadCU();
  const gateway = cu.createGateway({ policy: { deny: [], allow: [{}] } }); // default chain
  const captured = "connect ok token=supersecret123 Bearer eyJhbGciOi sk-abcdefghijklmnopqrstuvwxyz123456";
  const result = await gateway.evaluateAction(
    { action: "screenshot" },
    async () => ({ status: "executed", result: captured })
  );
  assert.doesNotMatch(result.result, /supersecret123/, "token value must be masked");
  assert.match(result.result, /REDACTED/, "masked marker present");
});

test("M15: session executeAction redacts real-mode stdout via post chain", async () => {
  const cu = await loadCU();
  const fakeSpawn = (cmd, args) => {
    if (args[0] === "exec") {
      return {
        pid: 1,
        on: (e, cb) => {
          if (e === "spawn") setTimeout(cb, 0);
          if (e === "close") setTimeout(() => cb(0), 0);
        },
        kill: () => {},
        stdout: {
          on: (e, cb) => {
            if (e === "data") setTimeout(() => cb(Buffer.from("password=hunter2 ghp_" + "a".repeat(36))), 0);
          },
        },
        stderr: { on: () => {} },
      };
    }
    return { pid: 1, on: (e, cb) => { if (e === "spawn") setTimeout(cb, 0); }, kill: () => {}, stdout: { on: () => {} }, stderr: { on: () => {} } };
  };
  const session = cu.createSandboxSession({
    sessionId: "m15-redact-e2e",
    dryRun: false,
    approved: true,
    spawnImpl: fakeSpawn,
    policy: { deny: [], allow: [{}] },
  });
  await session.start();
  const result = await session.executeAction({ action: "screenshot" });
  assert.equal(result.status, "executed");
  assert.doesNotMatch(result.result, /hunter2/, "password must be masked end-to-end");
  assert.match(result.result, /ghp_REDACTED/);
});

// ── Fail-closed on missing/broken processors ──

test("M15: broken/missing processors fail closed (deny)", async () => {
  const cu = await loadCU();
  const cases = [
    ["null entry", [null]],
    ["processor without process fn", [{ name: "nope", phase: "pre" }]],
    ["processor without name", [{ phase: "pre", process: async () => ({ action: "allow" }) }]],
    ["processor with invalid phase", [{ name: "bad-phase", phase: "sideways", process: async () => ({ action: "allow" }) }]],
    ["throwing processor", [{
      name: "boom",
      phase: "pre",
      process() { throw new Error("kaboom"); },
    }]],
    ["processor returning garbage", [{ name: "garbage", phase: "pre", process: async () => "allow" }]],
  ];
  for (const [label, processors] of cases) {
    const gateway = cu.createGateway({ processors });
    let executed = false;
    const result = await gateway.evaluateAction(
      { action: "click", x: 1, y: 2 },
      async () => { executed = true; return { status: "executed" }; }
    );
    assert.equal(result.allowed, false, `${label}: must fail closed`);
    assert.match(result.decision, /deny/, `${label}: decision must contain deny`);
    assert.equal(executed, false, `${label}: executor must not run`);
  }
});

test("M15: broken POST processor fails closed — raw captured output never released", async () => {
  const cu = await loadCU();
  const audit = createActionAudit();
  const secret = "api_key=DO-NOT-LEAK-123";
  const gateway = cu.createGateway({
    policy: { deny: [], allow: [{}] },
    audit,
    processors: [
      policyGateProcessor({ deny: [], allow: [{}] }),
      auditRecordProcessor(audit),
      { name: "broken-post", phase: "post", process() { throw new Error("post kaboom"); } },
    ],
  });
  const result = await gateway.evaluateAction(
    { action: "screenshot" },
    async () => ({ status: "executed", result: secret })
  );
  assert.equal(result.status, "error", "result must be replaced with error");
  assert.match(result.error, /post_processor_fail_closed/);
  assert.doesNotMatch(JSON.stringify(result), /DO-NOT-LEAK/, "raw captured text must not leak");
  const rows = audit.getEvents();
  assert.ok(rows.some(e => e.action === "post_processor_fail_closed"), "fail-closed must be audited");
});

// ── Transform ──

test("M15: transform patches the effective action and the result", async () => {
  const cu = await loadCU();
  const seen = [];
  const gateway = cu.createGateway({
    policy: { deny: [], allow: [{}] },
    processors: [
      {
        name: "normalize",
        phase: "pre",
        process(ctx) {
          return { action: "transform", patch: { text: ctx.action.text.trim().toUpperCase() } };
        },
      },
      {
        name: "annotate",
        phase: "post",
        process() {
          return { action: "transform", patch: { note: "annotated" } };
        },
      },
    ],
  });
  const result = await gateway.evaluateAction(
    { action: "type", text: "  hello  " },
    async (effective) => {
      seen.push(effective);
      return { status: "executed", result: "done" };
    }
  );
  assert.equal(seen[0].text, "HELLO", "executor must receive the patched action");
  assert.equal(result.note, "annotated", "post transform must patch the result");
  assert.equal(result.status, "executed");
});

// ── Legacy decision-only shape stays intact ──

test("M15: evaluateAction without executor keeps M11 decision shape", async () => {
  const cu = await loadCU();
  const gateway = cu.createGateway({ policy: { deny: [{ action: "type", text: "rm -rf" }], allow: [{}] } });
  const ok = await gateway.evaluateAction({ action: "screenshot" });
  assert.equal(ok.allowed, true);
  assert.equal(ok.decision, "allow");
  assert.ok(ok.auditRecord);
  assert.equal(ok.auditRecordWrittenBefore, true);
  const denied = await gateway.evaluateAction({ action: "type", text: "rm -rf /" });
  assert.equal(denied.allowed, false);
  assert.equal(denied.decision, "deny_rule");
});

test("M15: chain without audit-record still gets exactly one audit row (invariant)", async () => {
  const cu = await loadCU();
  const audit = createActionAudit();
  const gateway = cu.createGateway({
    audit,
    policy: { deny: [], allow: [{}] },
    processors: [policyGateProcessor({ deny: [], allow: [{}] })],
  });
  await gateway.evaluateAction({ action: "wait", ms: 5 }, async () => ({ status: "executed" }));
  const rows = audit.getEvents().filter(e => e.action === "wait");
  assert.equal(rows.length, 1, "fallback must write exactly one row");
  assert.equal(rows[0].auditRecordWrittenBefore, true);
});

// ── runProcessors unit semantics ──

test("M15: runProcessors skips other-phase processors but denies invalid shapes", async () => {
  const calls = [];
  const ctx = { allowed: true, decision: "allow", auditPayloads: [] };
  const res = await runProcessors(
    [
      { name: "later", phase: "post", process: async () => { calls.push("later"); return { action: "allow" }; } },
      { name: "now", phase: "pre", process: async () => { calls.push("now"); return { action: "allow" }; } },
    ],
    "pre",
    ctx
  );
  assert.equal(res.allowed, true);
  assert.deepEqual(calls, ["now"], "only matching-phase processors run");
  const bad = await runProcessors([{ name: "x" }], "pre", { ...ctx });
  assert.equal(bad.allowed, false);
  assert.equal(bad.decision, "deny_broken_processor");
});

test("M15: sticky deny — later allows cannot un-deny", async () => {
  const ctx = { allowed: true, decision: "allow", target: null, auditPayloads: [] };
  const res = await runProcessors(
    [
      { name: "d", phase: "pre", process: async () => ({ action: "deny", reason: "first" }) },
      { name: "a", phase: "pre", process: async () => ({ action: "allow" }) },
    ],
    "pre",
    ctx
  );
  assert.equal(res.allowed, false);
  assert.equal(ctx.allowed, false);
  assert.equal(ctx.decision, "deny_first");
});

// ── Built-ins composed from existing logic (no duplication) ──

test("M15: built-in processors expose the required contract shape", () => {
  const policy = policyGateProcessor({ deny: [], allow: [{}] });
  const auditP = auditRecordProcessor(createActionAudit());
  const redactP = redactResultProcessor();
  for (const p of [policy, auditP, redactP]) {
    assert.equal(typeof p.name, "string");
    assert.ok(["pre", "post"].includes(p.phase));
    assert.equal(typeof p.process, "function");
  }
  assert.equal(policy.name, "policy-gate");
  assert.equal(auditP.name, "audit-record");
  assert.equal(redactP.name, "redact-result");
});

test("M15: redactCapturedText still exported from computer-use (back-compat)", async () => {
  const { redactCapturedText: r } = await loadCU();
  assert.equal(typeof r, "function");
  assert.match(redactCapturedText("token=abc123"), /REDACTED/);
});

// ── Chat gateway integration ──

test("M15: chat gateway gateMessage runs processors around inbound checks", async () => {
  const gw = await import("../packages/gateway/src/gateway.mjs");
  const order = [];
  const stubAdapter = {
    platform: "test",
    verifyWebhook: () => true,
    parseInbound: (body) => ({ platform: "test", platformUserId: "u1", text: String(body), raw: body }),
    formatOutbound: (t) => ({ text: t }),
  };
  const chat = gw.createGateway({
    adapters: { test: stubAdapter },
    allowedSenders: [{ platform: "test", platformUserId: "u1" }],
    processors: [
      { name: "log-pre", phase: "pre", process: async () => { order.push("pre"); return { action: "allow" }; } },
      { name: "mask-out", phase: "post", process: async (ctx) => {
        order.push("post");
        if (ctx.target?.parsed?.text) {
          return { action: "transform", patch: { parsed: { ...ctx.target.parsed, text: redactCapturedText(ctx.target.parsed.text) } } };
        }
        return { action: "allow" };
      } },
    ],
  });
  const verdict = await chat.gateMessage({
    platform: "test",
    platformUserId: "u1",
    body: "hello token=shh-dont-leak",
    signature: "sig",
    timestamp: "t",
    text: "hello token=shh-dont-leak",
  });
  assert.equal(verdict.allowed, true, "message admitted");
  assert.doesNotMatch(verdict.parsed.text, /shh-dont-leak/, "outbound text must be masked");
  assert.deepEqual(order, ["pre", "post"], "chat chain runs pre before post");
});

test("M15: chat gateway deny processor blocks admission (handleInbound never reached)", async () => {
  const gw = await import("../packages/gateway/src/gateway.mjs");
  let reachedAdapter = false;
  const stubAdapter = {
    platform: "test",
    verifyWebhook: () => { reachedAdapter = true; return true; },
    parseInbound: (body) => ({ platform: "test", platformUserId: "u1", text: String(body) }),
    formatOutbound: (t) => ({ text: t }),
  };
  const chat = gw.createGateway({
    adapters: { test: stubAdapter },
    allowedSenders: [{ platform: "test", platformUserId: "u1" }],
    processors: [
      { name: "spam-block", phase: "pre", process: async (ctx) =>
        ctx.action.text?.includes("BUY NOW") ? { action: "deny", reason: "spam" } : { action: "allow" }
      },
    ],
  });
  const denied = await chat.gateMessage({
    platform: "test",
    platformUserId: "u1",
    body: "BUY NOW!!!",
    signature: "sig",
    timestamp: "t",
    text: "BUY NOW!!!",
  });
  assert.equal(denied.allowed, false);
  assert.match(denied.reason, /spam/);
  assert.equal(reachedAdapter, false, "denied messages must not reach adapter verification");

  const allowed = await chat.gateMessage({
    platform: "test",
    platformUserId: "u1",
    body: "hi",
    signature: "sig",
    timestamp: "t",
    text: "hi",
  });
  assert.equal(allowed.allowed, true);
});

test("M15: chat gateway fails closed on broken processor", async () => {
  const gw = await import("../packages/gateway/src/gateway.mjs");
  const chat = gw.createGateway({
    adapters: {},
    allowedSenders: [{ platform: "test", platformUserId: "u1" }],
    processors: [{ name: "broken", phase: "pre", process() { throw new Error("nope"); } }],
  });
  const verdict = await chat.gateMessage({ platform: "test", platformUserId: "u1", body: "{}", signature: "s", timestamp: "t", text: "" });
  assert.equal(verdict.allowed, false);
  assert.match(verdict.reason, /deny_broken_processor/);
});
