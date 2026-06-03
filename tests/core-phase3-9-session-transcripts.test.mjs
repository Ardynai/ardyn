import assert from "node:assert/strict";
import test from "node:test";

import {
  buildSessionTranscriptSummary,
  classifySessionTranscript,
  explainSessionTranscript,
  validateSessionEvent,
  validateSessionTranscript
} from "../packages/core/src/index.mjs";

const SAFETY = Object.freeze({
  executionEnabled: false,
  toolExecutionEnabled: false,
  autonomousExecutionEnabled: false,
  productionToolExecutionEnabled: false,
  apiCallsEnabled: false,
  networkListening: false,
  longRunningServicesStarted: false,
  processesSpawned: false,
  pluginInstallEnabled: false,
  torrentDownloadEnabled: false,
  codePackEnablementEnabled: false,
  agentLoopEnabled: false
});

function createEvent(sequence, eventType, payload, overrides = {}) {
  return {
    schemaVersion: "0.1.0",
    eventId: `evt.${sequence}`,
    sessionId: "sess.alpha",
    sequence,
    createdAt: `2026-06-02T12:00:0${sequence - 1}Z`,
    sourceHarness: "ardyn",
    eventType,
    payload,
    nonExecuting: true,
    safety: { ...SAFETY },
    ...overrides
  };
}

function createValidTranscript() {
  return {
    schema: "ardyn.session-transcript",
    schemaVersion: "0.1.0",
    sessionId: "sess.alpha",
    sourceHarness: "ardyn",
    nonExecuting: true,
    safety: { ...SAFETY },
    events: [
      createEvent(1, "session.started", {
        phase: "phase-3.9",
        mode: "plan",
        manifestName: "ardyn"
      }),
      createEvent(2, "task.planned", {
        taskId: "task.alpha",
        requestedCapabilityIds: ["tool.review"],
        selectedCapabilityIds: ["tool.review"],
        unresolvedRequests: []
      }),
      createEvent(3, "session.completed", {
        outcome: "success",
        summary: "Read-only validation only."
      })
    ]
  };
}

test("phase 3.9 validates a static non-executing session transcript", () => {
  const transcript = createValidTranscript();

  assert.deepEqual(validateSessionEvent(transcript.events[0]), {
    valid: true,
    errors: []
  });
  assert.deepEqual(validateSessionTranscript(transcript), {
    valid: true,
    errors: []
  });
  assert.deepEqual(classifySessionTranscript(transcript), {
    classification: "valid",
    valid: true,
    errors: [],
    nonExecuting: true,
    safety: { ...SAFETY }
  });
});

test("phase 3.9 transcript validation reports deterministic ordering and lifecycle errors", () => {
  const transcript = createValidTranscript();
  transcript.events[0].eventType = "session.heartbeat";
  transcript.events[0].payload = {
    status: "planning"
  };
  transcript.events[1].sequence = 4;

  assert.deepEqual(validateSessionTranscript(transcript), {
    valid: false,
    errors: [
      "events[0].eventType must be session.started",
      "events[1].sequence must be 2",
      "events[2].sequence must be 5"
    ]
  });
});

test("phase 3.9 transcript validation rejects harness, safety, and session mismatches", () => {
  const transcript = createValidTranscript();
  transcript.events[1].sourceHarness = "locus";
  transcript.events[1].sessionId = "sess.other";
  transcript.events[2].safety.executionEnabled = true;

  assert.deepEqual(validateSessionTranscript(transcript), {
    valid: false,
    errors: [
      "events[1].sourceHarness must be ardyn",
      "events[1].sessionId must match transcript.sessionId",
      "events[2].safety.executionEnabled must be false"
    ]
  });
});

test("phase 3.9 transcript classification distinguishes malformed from invalid", () => {
  assert.deepEqual(classifySessionTranscript(null), {
    classification: "malformed",
    valid: false,
    errors: ["transcript must be an object"],
    nonExecuting: true,
    safety: { ...SAFETY }
  });

  assert.deepEqual(
    classifySessionTranscript({
      schema: "ardyn.other-transcript",
      schemaVersion: "0.1.0",
      events: []
    }),
    {
      classification: "malformed",
      valid: false,
      errors: ["schema must be ardyn.session-transcript"],
      nonExecuting: true,
      safety: { ...SAFETY }
    }
  );

  assert.deepEqual(
    classifySessionTranscript({
      schema: "ardyn.session-transcript",
      sessionId: "sess.alpha",
      sourceHarness: "ardyn",
      nonExecuting: true,
      safety: { ...SAFETY }
    }),
    {
      classification: "malformed",
      valid: false,
      errors: ["events must be an array", "schemaVersion is required"],
      nonExecuting: true,
      safety: { ...SAFETY }
    }
  );

  const invalidTranscript = createValidTranscript();
  invalidTranscript.events[2].nonExecuting = false;

  assert.deepEqual(classifySessionTranscript(invalidTranscript), {
    classification: "invalid",
    valid: false,
    errors: ["events[2].nonExecuting must be true"],
    nonExecuting: true,
    safety: { ...SAFETY }
  });
});

test("phase 3.9 transcript summary is deterministic and viewer-safe", () => {
  const transcript = createValidTranscript();

  assert.deepEqual(buildSessionTranscriptSummary(transcript), {
    schema: "ardyn.session-transcript-summary",
    schemaVersion: "0.1.0",
    classification: "valid",
    valid: true,
    sessionId: "sess.alpha",
    sourceHarness: "ardyn",
    eventCount: 3,
    eventTypes: ["session.started", "task.planned", "session.completed"],
    firstEventType: "session.started",
    lastEventType: "session.completed",
    sequence: {
      first: 1,
      last: 3,
      contiguous: true
    },
    lifecycle: {
      startsWithSessionStarted: true,
      completed: true,
      errored: false
    },
    transcriptNonExecuting: true,
    transcriptSafetyAllFalse: true,
    errors: [],
    nonExecuting: true,
    safety: { ...SAFETY }
  });
});

test("phase 3.9 transcript explanation stays deterministic and all helper safety flags remain false", () => {
  const transcript = createValidTranscript();

  assert.deepEqual(explainSessionTranscript(transcript), {
    schema: "ardyn.session-transcript-explanation",
    schemaVersion: "0.1.0",
    classification: "valid",
    valid: true,
    sessionId: "sess.alpha",
    sourceHarness: "ardyn",
    checks: {
      transcriptSchema: true,
      transcriptSchemaVersion: true,
      transcriptSessionId: true,
      transcriptSourceHarness: true,
      transcriptNonExecuting: true,
      transcriptSafetyAllFalse: true,
      eventsArray: true,
      eventsNonEmpty: true,
      firstEventStarted: true,
      sequencesContiguous: true,
      eventSessionIdsMatch: true,
      eventSourceHarnessesMatch: true,
      eventNonExecuting: true,
      eventSafetyAllFalse: true
    },
    errors: [],
    summary: {
      schema: "ardyn.session-transcript-summary",
      schemaVersion: "0.1.0",
      classification: "valid",
      valid: true,
      sessionId: "sess.alpha",
      sourceHarness: "ardyn",
      eventCount: 3,
      eventTypes: ["session.started", "task.planned", "session.completed"],
      firstEventType: "session.started",
      lastEventType: "session.completed",
      sequence: {
        first: 1,
        last: 3,
        contiguous: true
      },
      lifecycle: {
        startsWithSessionStarted: true,
        completed: true,
        errored: false
      },
      transcriptNonExecuting: true,
      transcriptSafetyAllFalse: true,
      errors: [],
      nonExecuting: true,
      safety: { ...SAFETY }
    },
    nonExecuting: true,
    safety: { ...SAFETY }
  });

  for (const result of [
    classifySessionTranscript(transcript),
    buildSessionTranscriptSummary(transcript),
    explainSessionTranscript(transcript)
  ]) {
    for (const [flag, value] of Object.entries(result.safety)) {
      assert.equal(value, false, `${flag} must remain false`);
    }
  }
});
