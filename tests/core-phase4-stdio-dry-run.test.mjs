import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  assertLocalJsonFilePath,
  createStdioDryRunSessionEvents,
  formatSessionEventsJsonl,
  validateSessionEvent
} from "../packages/core/src/index.mjs";

const minimalManifestPath = "examples/minimal-manifest/ardyn.manifest.json";
const minimalTaskPath = "examples/minimal-task/task.json";
const planningManifestPath = "tests/fixtures/planning-manifest.json";
const approvalTaskPath = "tests/fixtures/tasks/approval-required.json";

async function readJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

function assertAllFalse(flags) {
  for (const [key, value] of Object.entries(flags)) {
    assert.equal(value, false, `${key} should remain false`);
  }
}

test("Phase 4 dry-run core creates deterministic ordered session events", async () => {
  const manifest = await readJson(minimalManifestPath);
  const task = await readJson(minimalTaskPath);
  const events = createStdioDryRunSessionEvents(manifest, task, {
    manifestPath: minimalManifestPath,
    taskPath: minimalTaskPath
  });
  const repeat = createStdioDryRunSessionEvents(manifest, task, {
    manifestPath: minimalManifestPath,
    taskPath: minimalTaskPath
  });

  assert.deepEqual(events, repeat);
  assert.deepEqual(
    events.map((event) => event.eventType),
    [
      "session.started",
      "session.heartbeat",
      "session.capabilities",
      "task.planned",
      "approval.recorded",
      "session.completed"
    ]
  );
  assert.deepEqual(
    events.map((event) => event.sequence),
    [1, 2, 3, 4, 5, 6]
  );
  assert.deepEqual(
    events.map((event) => event.createdAt),
    [
      "1970-01-01T00:00:01Z",
      "1970-01-01T00:00:02Z",
      "1970-01-01T00:00:03Z",
      "1970-01-01T00:00:04Z",
      "1970-01-01T00:00:05Z",
      "1970-01-01T00:00:06Z"
    ]
  );

  assert.equal(events[0].payload.phase, "phase-4.0a-stdio-event-dry-run");
  assert.equal(events[0].payload.mode, "dry-run");
  assert.equal(events[0].payload.manifestName, "minimal-ardyn");
  assert.deepEqual(events[2].payload.capabilityIds, ["runtime.describe"]);
  assert.deepEqual(events[3].payload, {
    taskId: "task.minimal.describe",
    requestedCapabilityIds: ["runtime.describe"],
    selectedCapabilityIds: ["runtime.describe"],
    unresolvedRequests: []
  });
  assert.equal(events[4].payload.status, "not_required");
  assert.equal(events[4].payload.nonExecuting, true);
  assert.equal(events[5].payload.outcome, "success");

  for (const event of events) {
    assert.equal(event.sourceHarness, "ardyn");
    assert.equal(event.nonExecuting, true);
    assertAllFalse(event.safety);
    assert.deepEqual(validateSessionEvent(event), { valid: true, errors: [] });
  }
});

test("Phase 4 dry-run JSONL framing uses LF-only one-object-per-line output", async () => {
  const manifest = await readJson(minimalManifestPath);
  const task = await readJson(minimalTaskPath);
  const events = createStdioDryRunSessionEvents(manifest, task);
  const jsonl = formatSessionEventsJsonl(events);

  assert.equal(jsonl.endsWith("\n"), true);
  assert.doesNotMatch(jsonl, /\r\n/);

  const lines = jsonl.split("\n");
  assert.equal(lines.at(-1), "");
  assert.equal(lines.length, events.length + 1);

  const parsedEvents = lines.slice(0, -1).map((line) => {
    assert.notEqual(line, "");
    assert.doesNotMatch(line, /\s$/);
    return JSON.parse(line);
  });

  assert.deepEqual(parsedEvents, events);
});

test("Phase 4 dry-run inserts approval requested event when approval is required", async () => {
  const manifest = await readJson(planningManifestPath);
  const task = await readJson(approvalTaskPath);
  const events = createStdioDryRunSessionEvents(manifest, task, {
    manifestPath: planningManifestPath,
    taskPath: approvalTaskPath
  });

  assert.deepEqual(
    events.map((event) => event.eventType),
    [
      "session.started",
      "session.heartbeat",
      "session.capabilities",
      "task.planned",
      "approval.requested",
      "approval.recorded",
      "session.completed"
    ]
  );
  assert.deepEqual(
    events.map((event) => event.sequence),
    [1, 2, 3, 4, 5, 6, 7]
  );

  assert.deepEqual(events[4].payload, {
    approvalId: events[5].payload.approvalId,
    taskId: "task.phase3-1.approval",
    requestedCapabilityIds: ["secure.registry"],
    reason: "Approval is required before any future execution."
  });
  assert.equal(events[5].payload.status, "required");
  assert.equal(events[6].payload.outcome, "approval_pending");

  for (const event of events) {
    assert.equal(event.nonExecuting, true);
    assertAllFalse(event.safety);
    assert.deepEqual(validateSessionEvent(event), { valid: true, errors: [] });
  }
});

test("Phase 4 dry-run JSONL serializer rejects malformed session events", async () => {
  const manifest = await readJson(minimalManifestPath);
  const task = await readJson(minimalTaskPath);
  const [event] = createStdioDryRunSessionEvents(manifest, task);

  assert.throws(
    () => formatSessionEventsJsonl([{ ...event, command: { argv: ["unsafe"] } }]),
    /event\.command is not allowed/
  );

  assert.throws(
    () =>
      formatSessionEventsJsonl([
        {
          ...event,
          safety: {
            ...event.safety,
            executionEnabled: true
          }
        }
      ]),
    /event\.safety\.executionEnabled must be false/
  );

  const sparseEvents = new Array(1);
  assert.throws(
    () => formatSessionEventsJsonl(sparseEvents),
    /session event 1 is missing/
  );
});

test("local JSON input path policy rejects URL, file, network, stdin, and unsafe path forms", () => {
  for (const candidate of [
    "https://example.test/manifest.json",
    "ardyn://manifest.json",
    "file:///C:/tmp/manifest.json",
    "\\\\server\\share\\manifest.json",
    "//server/share/manifest.json",
    "C:relative\\manifest.json",
    "-",
    "manifest\u0000.json",
    "manifest\n.json",
    "manifest.json\r"
  ]) {
    assert.throws(
      () => assertLocalJsonFilePath(candidate, "manifest"),
      /manifest must be a local JSON file path/
    );
  }

  assert.doesNotThrow(() => assertLocalJsonFilePath(minimalManifestPath, "manifest"));
  assert.doesNotThrow(() => assertLocalJsonFilePath("C:\\tmp\\manifest.json", "manifest"));
});
