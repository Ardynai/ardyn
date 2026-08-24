// Part 2 — Replay & rollback-on-failure for gated multi-step actions.
//
// REPLAY: deterministically re-run a recorded action sequence in DRY/ECHO mode
// (no live side effects unless the caller's executor explicitly performs them),
// surfacing any divergence from the recorded outcome.
//
// ROLLBACK-ON-FAILURE: run a gated multi-step sequence where each step may
// carry a compensation; on mid-sequence failure the completed steps are undone
// in reverse order back to the last known-good state. If ANY compensation is
// missing or itself fails, we FAIL CLOSED and audit loudly rather than leaving
// partial state.
//
// GATING: both operations are inert without an explicit `approved: true`
// option — same posture as serve-runtime/computer-use/federation-exchange.
// Every executed/replayed/compensated step is written to the provided audit
// sink (createActionAudit()-shaped: .record(event)).
import { createHash } from "node:crypto";

function assertApproved(approved, what) {
  if (!approved) {
    const err = new Error(`${what} requires explicit approval (approved:true). Nothing was executed.`);
    err.code = "not_approved";
    throw err;
  }
}

function hashOutcome(value) {
  return createHash("sha256").update(JSON.stringify(value ?? null)).digest("hex");
}

// Deterministic default executor: ECHO mode. Produces no side effects; the
// "actual outcome" is a stable echo of the step so divergence checks compare
// shape/content against the recording.
export function echoExecutor(step) {
  return { echo: true, step, exitCode: 0 };
}

function normalizeSteps(events) {
  if (!Array.isArray(events)) {
    throw Object.assign(new Error("replay requires events: array of recorded steps"), { code: "invalid_input" });
  }
  return events;
}

export function createSessionTools({ audit } = {}) {
  const sink = audit && typeof audit.record === "function" ? audit : null;

  const record = (event) => {
    if (sink) sink.record({ timestamp: new Date().toISOString(), ...event });
  };

  return {
    // ── REPLAY ──
    // events: recorded transcript steps. Recognized shapes:
    //   { type:"stdout_frame"|"session_event"|..., frame:{...}, ... }
    //   { type:"command", command, exitCode?, stdout? }
    // Any event with `command` is treated as an executable step in dry mode.
    async replayTranscript({ events, approved, execute = echoExecutor } = {}) {
      assertApproved(approved, "Transcript replay");
      if (typeof execute !== "function") {
        throw Object.assign(new Error("replay execute must be a function"), { code: "invalid_input" });
      }
      const steps = normalizeSteps(events);
      record({ action: "replay_started", totalSteps: steps.length });

      const results = [];
      const divergences = [];
      let index = 0;
      for (const step of steps) {
        const expectedExit = step.exitCode ?? (step.type === "command" ? 0 : undefined);
        const expectedStdout = typeof step.stdout === "string" ? hashOutcome(step.stdout) : undefined;

        let actual;
        try {
          actual = await execute(step);
        } catch (err) {
          actual = { error: err?.message ?? String(err), exitCode: -1 };
        }

        const divergent =
          (expectedExit !== undefined && actual.exitCode !== expectedExit) ||
          (expectedStdout !== undefined && hashOutcome(actual.stdout) !== expectedStdout);

        const entry = {
          index,
          status: divergent ? "divergent" : "match",
          step,
          actual,
          ...(divergent ? { expected: { exitCode: expectedExit, stdoutHash: expectedStdout } } : {}),
        };
        results.push(entry);
        if (divergent) divergences.push(entry);
        record({
          action: "replay_step",
          index,
          status: entry.status,
          stepType: step.type ?? "unknown",
          command: typeof step.command === "string" ? step.command : undefined,
        });
        index += 1;
      }

      record({ action: "replay_finished", totalSteps: steps.length, divergences: divergences.length });
      return {
        ok: divergences.length === 0,
        totalSteps: steps.length,
        steps: results,
        divergences,
      };
    },

    // ── ROLLBACK-ON-FAILURE ──
    // steps: [{ do: <payload>, compensate?: ({ do }) => any, label? }]
    // execute({ do, kind:"do"|"undo", label }) -> any (throws on failure)
    async runWithRollback({ steps, approved, execute } = {}) {
      assertApproved(approved, "Rollback-on-failure execution");
      if (typeof execute !== "function") {
        throw Object.assign(new Error("rollback execute must be a function"), { code: "invalid_input" });
      }
      if (!Array.isArray(steps)) {
        throw Object.assign(new Error("runWithRollback requires steps: array"), { code: "invalid_input" });
      }

      const completed = []; // [{ index, label, do, undoResult }]
      const results = [];

      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        record({ action: "step_start", index: i, label: step.label });
        try {
          const result = await execute({ kind: "do", index: i, do: step.do, label: step.label });
          results.push({ index: i, label: step.label, ok: true, result });
          completed.push({ index: i, label: step.label, do: step.do, compensate: step.compensate });
          record({ action: "step_ok", index: i, label: step.label });
        } catch (error) {
          record({
            action: "step_failed",
            index: i,
            label: step.label,
            error: error?.message ?? String(error),
            rollingBack: true,
          });

          // Roll back completed steps in REVERSE order to the last known-good state.
          const undone = [];
          let failedRollback = false;
          for (const done of [...completed].reverse()) {
            if (typeof done.compensate !== "function") {
              record({
                action: "rollback_failed",
                index: done.index,
                label: done.label,
                reason: "missing_compensation",
                partialState: true,
              });
              failedRollback = true;
              break;
            }
            try {
              const prevResult = results.find((r) => r.index === done.index)?.result;
              const undoPayload = await done.compensate({ do: done.do, result: prevResult });
              await execute({ kind: "undo", index: done.index, undo: undoPayload, label: done.label });
              undone.push(done);
              record({ action: "rollback_step", index: done.index, label: done.label });
            } catch (undoError) {
              record({
                action: "rollback_failed",
                index: done.index,
                label: done.label,
                reason: undoError?.message ?? String(undoError),
                partialState: true,
              });
              failedRollback = true;
              break;
            }
          }

          return {
            ok: false,
            failedAt: i,
            failureError: error?.message ?? String(error),
            rolledBack: undone.map((u) => u.index),
            notRolledBack: completed.filter((c) => !undone.includes(c)).map((c) => c.index),
            results,
            // FAIL CLOSED: when any compensation is missing/failing we say so loudly.
            rolledBackToKnownGood: !failedRollback && undone.length === completed.length,
            partialState: failedRollback,
          };
        }
      }
      record({ action: "sequence_complete", totalSteps: steps.length });
      return { ok: true, results };
    },
  };
}

export default { createSessionTools, echoExecutor };
