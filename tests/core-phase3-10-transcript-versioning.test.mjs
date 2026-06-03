import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  buildSessionTranscriptDisplaySummary,
  buildSessionTranscriptMigrationMetadata,
  classifySessionTranscriptCompatibility,
  explainSessionTranscriptCompatibility,
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

const fixtureRoot = "tests/fixtures/session-transcripts/phase3-10";
const currentCompatiblePath = `${fixtureRoot}/current-compatible.json`;
const olderCompatiblePath = `${fixtureRoot}/older-compatible-upgrade-available.json`;
const unsupportedMajorPath = `${fixtureRoot}/unsupported-major.json`;
const malformedPath = `${fixtureRoot}/malformed.json`;
const inertUnknownFieldsPath = `${fixtureRoot}/inert-unknown-fields.json`;
const displaySummaryPath = `${fixtureRoot}/display-summary.json`;
const migrationMetadataPath = `${fixtureRoot}/migration-metadata.json`;

async function readJsonFixture(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

function assertAllFalse(flags) {
  for (const [flag, value] of Object.entries(flags)) {
    assert.equal(value, false, `${flag} must remain false`);
  }
}

test("phase 3.10 classifies current transcripts as compatible and strictly valid", async () => {
  const transcript = await readJsonFixture(currentCompatiblePath);

  assert.deepEqual(validateSessionTranscript(transcript), {
    valid: true,
    errors: []
  });
  assert.deepEqual(classifySessionTranscriptCompatibility(transcript), {
    schemaId: "ardyn.session-transcript",
    expectedSchemaId: "ardyn.session-transcript",
    schemaVersion: "0.1.0",
    currentSchemaVersion: "0.1.0",
    compatibility: "compatible",
    valid: true,
    structurallyUsable: true,
    schemaIdValid: true,
    schemaVersionValid: true,
    eventsUsable: true,
    migrationRequired: false,
    migrationAvailable: false,
    migrationNotes: [
      "Session transcript schema metadata is current; no migration is required."
    ],
    validationErrors: [],
    unknownFields: [],
    unknownFieldCount: 0,
    unknownFieldsAreInert: true,
    nonExecuting: true,
    safety: { ...SAFETY }
  });
});

test("phase 3.10 classifies older same-major transcripts as upgrade_available", async () => {
  const transcript = await readJsonFixture(olderCompatiblePath);
  const compatibility = classifySessionTranscriptCompatibility(transcript);

  assert.equal(validateSessionTranscript(transcript).valid, false);
  assert.deepEqual(compatibility, {
    schemaId: "ardyn.session-transcript",
    expectedSchemaId: "ardyn.session-transcript",
    schemaVersion: "0.0.9",
    currentSchemaVersion: "0.1.0",
    compatibility: "upgrade_available",
    valid: false,
    structurallyUsable: true,
    schemaIdValid: true,
    schemaVersionValid: true,
    eventsUsable: true,
    migrationRequired: false,
    migrationAvailable: true,
    migrationNotes: [
      "Session transcript shares the supported major schema version and can be displayed read-only without execution.",
      "A future migration may normalize schemaVersion to 0.1.0."
    ],
    validationErrors: [
      "schemaVersion must be 0.1.0",
      "events[0].schemaVersion must be 0.1.0",
      "events[1].schemaVersion must be 0.1.0",
      "events[2].schemaVersion must be 0.1.0",
      "events[3].schemaVersion must be 0.1.0",
      "events[4].schemaVersion must be 0.1.0"
    ],
    unknownFields: [],
    unknownFieldCount: 0,
    unknownFieldsAreInert: true,
    nonExecuting: true,
    safety: { ...SAFETY }
  });
  assertAllFalse(compatibility.safety);
});

test("phase 3.10 classifies unsupported major transcripts deterministically", async () => {
  const transcript = await readJsonFixture(unsupportedMajorPath);
  const compatibility = classifySessionTranscriptCompatibility(transcript);

  assert.equal(compatibility.compatibility, "unsupported_major");
  assert.equal(compatibility.schemaVersion, "2.0.0");
  assert.equal(compatibility.currentSchemaVersion, "0.1.0");
  assert.equal(compatibility.structurallyUsable, true);
  assert.equal(compatibility.eventsUsable, true);
  assert.equal(compatibility.migrationRequired, true);
  assert.equal(compatibility.migrationAvailable, false);
  assert.deepEqual(compatibility.validationErrors, [
    "schemaVersion major 2 is unsupported; supported major is 0"
  ]);
  assert.deepEqual(compatibility.migrationNotes, [
    "Session transcript uses an unsupported major schema version and requires manual review before display trust.",
    "schemaVersion major 2 is unsupported; supported major is 0"
  ]);
  assertAllFalse(compatibility.safety);
});

test("phase 3.10 classifies malformed transcripts deterministically", async () => {
  const transcript = await readJsonFixture(malformedPath);
  const compatibility = classifySessionTranscriptCompatibility(transcript);

  assert.equal(compatibility.compatibility, "malformed");
  assert.equal(compatibility.schemaVersion, "not-semver");
  assert.equal(compatibility.schemaVersionValid, false);
  assert.equal(compatibility.structurallyUsable, false);
  assert.equal(compatibility.eventsUsable, false);
  assert.equal(compatibility.migrationRequired, true);
  assert.equal(compatibility.migrationAvailable, false);
  assert.deepEqual(compatibility.validationErrors, [
    "schemaVersion must be a semantic version string",
    "events must be an array"
  ]);
  assertAllFalse(compatibility.safety);
});

test("phase 3.10 surfaces unknown transcript fields as inert display metadata", async () => {
  const transcript = await readJsonFixture(inertUnknownFieldsPath);
  const compatibility = classifySessionTranscriptCompatibility(transcript);
  const display = buildSessionTranscriptDisplaySummary(transcript);

  assert.equal(compatibility.compatibility, "compatible");
  assert.equal(compatibility.valid, true);
  assert.deepEqual(compatibility.unknownFields, [
    "displayOnlyNote",
    "futureTranscriptMetadata"
  ]);
  assert.equal(compatibility.unknownFieldCount, 2);
  assert.equal(compatibility.unknownFieldsAreInert, true);
  assert.equal(display.counts.unknownFields, 2);
  assert.deepEqual(display.warnings, [
    {
      severity: "info",
      code: "unknown_root_fields",
      message: "2 unknown root field(s) are treated as inert for display."
    }
  ]);
  assertAllFalse(display.safety);
});

test("phase 3.10 display summary counts approvals, planned tasks, errors, and safety posture", async () => {
  const transcript = await readJsonFixture(displaySummaryPath);

  assert.deepEqual(buildSessionTranscriptDisplaySummary(transcript), {
    schema: "ardyn.session-transcript-display-summary",
    schemaVersion: "0.1.0",
    sessionId: "session.phase3.10.current",
    sourceHarness: "ardyn",
    schemaStatus: {
      schemaId: "ardyn.session-transcript",
      expectedSchemaId: "ardyn.session-transcript",
      schemaVersion: "0.1.0",
      currentSchemaVersion: "0.1.0",
      compatibility: "compatible",
      valid: true,
      migrationRequired: false,
      migrationAvailable: false
    },
    eventCount: 5,
    firstEventType: "session.started",
    lastEventType: "session.error",
    sequenceRange: {
      first: 1,
      last: 5,
      min: 1,
      max: 5,
      contiguous: true
    },
    counts: {
      errors: 1,
      approvalEvents: 2,
      taskPlannedEvents: 1,
      unknownFields: 1
    },
    safetyPosture: {
      nonExecuting: true,
      allFlagsFalse: true,
      flags: { ...SAFETY }
    },
    warnings: [
      {
        severity: "info",
        code: "unknown_root_fields",
        message: "1 unknown root field(s) are treated as inert for display."
      },
      {
        severity: "warning",
        code: "session_errors_present",
        message: "1 session error event(s) are present."
      }
    ],
    unknownFields: ["displayOnlyNote"],
    unknownFieldCount: 1,
    validationErrors: [],
    nonExecuting: true,
    safety: { ...SAFETY }
  });
});

test("phase 3.10 migration metadata is deterministic and non-executing", async () => {
  const transcript = await readJsonFixture(migrationMetadataPath);

  assert.deepEqual(buildSessionTranscriptMigrationMetadata(transcript), {
    schema: "ardyn.session-transcript-migration-metadata",
    schemaVersion: "0.1.0",
    artifactKind: "session_transcript",
    schemaId: "ardyn.session-transcript",
    expectedSchemaId: "ardyn.session-transcript",
    artifactSchemaVersion: "0.0.9",
    currentSchemaVersion: "0.1.0",
    compatibility: "upgrade_available",
    migrationRequired: false,
    migrationAvailable: true,
    migrationNotes: [
      "Session transcript shares the supported major schema version and can be displayed read-only without execution.",
      "A future migration may normalize schemaVersion to 0.1.0."
    ],
    notes: [
      "Session transcript shares the supported major schema version and can be displayed read-only without execution.",
      "A future migration may normalize schemaVersion to 0.1.0."
    ],
    validationErrors: [
      "schemaVersion must be 0.1.0",
      "events[0].schemaVersion must be 0.1.0"
    ],
    unknownFields: ["futureTranscriptMetadata"],
    unknownFieldsAreInert: true,
    nonExecuting: true,
    safety: { ...SAFETY }
  });
});

test("phase 3.10 compatibility explanation composes decision, migration, and display warnings", async () => {
  const transcript = await readJsonFixture(unsupportedMajorPath);
  const explanation = explainSessionTranscriptCompatibility(transcript);

  assert.equal(explanation.schema, "ardyn.session-transcript-compatibility-explanation");
  assert.equal(explanation.schemaVersion, "0.1.0");
  assert.equal(explanation.schemaId, "ardyn.session-transcript");
  assert.equal(explanation.schemaVersionStatus, "2.0.0");
  assert.equal(explanation.compatibility, "unsupported_major");
  assert.equal(explanation.migrationRequired, true);
  assert.equal(explanation.migrationAvailable, false);
  assert.deepEqual(explanation.displayWarnings, [
    {
      severity: "error",
      code: "unsupported_major",
      message: "Transcript uses an unsupported major schema version."
    },
    {
      severity: "warning",
      code: "strict_validation_failed",
      message: "2 strict validation issue(s) were found."
    }
  ]);
  assert.deepEqual(explanation.validationErrors, [
    "schemaVersion major 2 is unsupported; supported major is 0"
  ]);
  assert.equal(explanation.unknownFieldsAreInert, true);
  assert.equal(explanation.nonExecuting, true);
  assertAllFalse(explanation.safety);
});

test("phase 3.10 helper safety flags remain false across compatibility outputs", async () => {
  const transcript = await readJsonFixture(displaySummaryPath);

  for (const result of [
    classifySessionTranscriptCompatibility(transcript),
    buildSessionTranscriptMigrationMetadata(transcript),
    buildSessionTranscriptDisplaySummary(transcript),
    explainSessionTranscriptCompatibility(transcript)
  ]) {
    assert.equal(result.nonExecuting, true);
    assertAllFalse(result.safety);
  }
});
