// Part 2 — Replay & rollback-on-failure machinery (behavioral).
import assert from "node:assert/strict";
import test from "node:test";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createHash } from "node:crypto";
import { createActionAudit } from "../packages/core/src/computer-use.mjs";
import { createSessionTools } from "../packages/core/src/session-replay.mjs";

const runCliCapture = async (args) => {
  try {
    const { stdout, stderr } = await promisify(execFile)("node", args, { cwd: process.cwd(), maxBuffer: 4 * 1024 * 1024 });
    return { code: 0, stdout, stderr };
  } catch (error) {
    return { code: error.code ?? 1, stdout: error.stdout ?? "", stderr: error.stderr ?? String(error) };
  }
};

function sha(v) {
  return createHash("sha256").update(JSON.stringify(v ?? null)).digest("hex");
}

// ── Replay ──

test("P2: replay reproduces a recorded transcript exactly (zero divergences) and audits every step", async () => {
  const audit = createActionAudit();
  const tools = createSessionTools({ audit });
  const events = [
    { type: "command", command: "node -e one", exitCode: 0, stdout: "one\n" },
    { type: "command", command: "node -e two", exitCode: 0, stdout: "two\n" },
    { type: "stdout_frame", frame: { event: "log" } },
  ];
  const report = await tools.replayTranscript({
    events,
    approved: true,
    // Deterministic executor that "reproduces" the recorded outcomes:
    execute: async (step) => ({ exitCode: step.exitCode ?? 0, stdout: step.stdout ?? "" }),
  });
  assert.equal(report.ok, true);
  assert.equal(report.divergences.length, 0);
  assert.equal(report.totalSteps, 3);
  const replaySteps = audit.getEvents().filter((e) => e.action === "replay_step");
  assert.equal(replaySteps.length, 3, "every replayed step is audited");
  assert.ok(audit.getEvents().some((e) => e.action === "replay_started"));
  assert.ok(audit.getEvents().some((e) => e.action === "replay_finished" && e.divergences === 0));
});

test("P2: injected divergence is flagged with expected vs actual", async () => {
  const audit = createActionAudit();
  const tools = createSessionTools({ audit });
  let call = 0;
  const report = await tools.replayTranscript({
    events: [
      { type: "command", command: "a", exitCode: 0, stdout: "same" },
      { type: "command", command: "b", exitCode: 0, stdout: "expected-output" },
    ],
    approved: true,
    execute: async (step) => {
      call += 1;
      if (call === 2) return { exitCode: 0, stdout: "DIVERGED-OUTPUT" }; // inject
      return { exitCode: step.exitCode ?? 0, stdout: step.stdout ?? "" };
    },
  });
  assert.equal(report.ok, false);
  assert.equal(report.divergences.length, 1);
  assert.equal(report.divergences[0].index, 1);
  assert.equal(report.divergences[0].expected.stdoutHash, sha("expected-output"));
});

test("P2: replay REFUSES without explicit approval", async () => {
  const tools = createSessionTools({});
  await assert.rejects(
    () => tools.replayTranscript({ events: [{ type: "command", command: "x" }] }),
    (e) => e.code === "not_approved"
  );
});

// ── Rollback-on-failure ──

test("P2: mid-sequence failure triggers compensating rollback to known-good state", async () => {
  const audit = createActionAudit();
  const tools = createSessionTools({ audit });
  const state = { files: [], deployed: false };

  const steps = [
    {
      label: "create file",
      do: { file: "a.txt" },
      compensate: async ({ do: d }) => ({ removeFile: d.file }),
      executeAs: (payload) => { state.files.push(payload.file); return { created: payload.file }; },
      undoAs: (undo) => { state.files = state.files.filter((f) => f !== undo.removeFile); },
    },
    {
      label: "explode",
      do: { boom: true },
    },
  ];

  const report = await tools.runWithRollback({
    steps,
    approved: true,
    execute: async ({ kind, index, do: doPayload, undo }) => {
      if (kind === "do") {
        const s = steps[index];
        if (s.executeAs && index === 0) s.executeAs(doPayload);
        if (index === 1) throw new Error("deploy failed midway");
        return { done: true };
      }
      // undo
      const s = steps[index];
      if (s.undoAs) s.undoAs(undo);
      return { undone: true };
    },
  });

  assert.equal(report.ok, false);
  assert.equal(report.failedAt, 1);
  assert.equal(report.rolledBackToKnownGood, true);
  assert.equal(report.partialState, false);
  assert.deepEqual(state.files, [], "compensation must restore the last known-good state");

  const actions = audit.getEvents().map((e) => e.action);
  assert.ok(actions.includes("step_failed"));
  assert.ok(actions.includes("rollback_step"), "rollback is audited per step");
});

test("P2: missing compensation FAILS CLOSED — partial state loudly audited", async () => {
  const audit = createActionAudit();
  const tools = createSessionTools({ audit });
  const state = { files: [] };

  const steps = [
    { label: "side-effect", do: { file: "b.txt" } }, // NO compensation defined
    { label: "explode", do: {} },
  ];
  const report = await tools.runWithRollback({
    steps,
    approved: true,
    execute: async ({ kind, index }) => {
      if (kind === "do") {
        if (index === 0) state.files.push("b.txt");
        if (index === 1) throw new Error("boom at step 2");
        return {};
      }
      return {};
    },
  });

  assert.equal(report.ok, false);
  assert.equal(report.partialState, true, "must fail CLOSED and admit partial state");
  assert.equal(report.notRolledBack.includes(0), true);
  assert.deepEqual(state.files, ["b.txt"], "state honestly left partial (documented by audit)");
  const rbFail = audit.getEvents().find((e) => e.action === "rollback_failed");
  assert.ok(rbFail, "rollback failure must be audited LOUDLY");
  assert.equal(rbFail.reason, "missing_compensation");
});

test("P2: rollback execution REFUSES without explicit approval", async () => {
  const tools = createSessionTools({});
  await assert.rejects(
    () => tools.runWithRollback({ steps: [{ label: "x", do: {} }] }),
    (e) => e.code === "not_approved"
  );
});

// ── CLI gating for --replay ──

test("P2: serve-runtime --replay refuses without --approve; runs divergence report with it", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-p2-replay-"));
  try {
    const replayPath = join(scratch, "transcript.json");
    await writeFile(replayPath, JSON.stringify({
      events: [
        { type: "command", command: "a", exitCode: 0, stdout: "same" },
        { type: "command", command: "b", exitCode: 0, stdout: "DIFFERENT" },
      ],
    }));

    // Gated: no --enable-runtime → refused.
    const gated = await runCliCapture([
      "apps/cli/src/index.mjs", "serve-runtime", "--replay", replayPath,
      "--manifest", manifest,
    ]);
    assert.equal(gated.code, 1);
    assert.match(gated.stderr || gated.stdout, /Runtime unavailable|enable-runtime/);

    // Approved → divergence report (echo executor reproduces recorded shape;
    // inject a real divergence by recording an outcome echo can't produce).
    await writeFile(replayPath, JSON.stringify({
      events: [
        { type: "command", command: "a", exitCode: 7, stdout: "weird" }, // echo yields exitCode 7? echo sets 0 → divergent
      ],
    }));
    const run = await runCliCapture([
      "apps/cli/src/index.mjs", "serve-runtime", "--replay", replayPath,
      "--enable-runtime", "--approve",
      "--manifest", manifest,
    ]);
    assert.equal(run.code, 0, run.stderr);
    const output = JSON.parse(run.stdout);
    assert.equal(output.replay, true);
    assert.equal(output.totalSteps, 1);
    assert.ok(Array.isArray(output.divergences));
  } finally {
    await rm(scratch, { recursive: true, force: true });
  }
});

const manifest = "examples/minimal-manifest/ardyn.manifest.json";
