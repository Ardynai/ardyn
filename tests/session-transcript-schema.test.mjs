import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";
import Ajv2020 from "ajv/dist/2020.js";

const root = process.cwd();
const examplesDir = join(root, "examples", "session-transcripts");
const eventSchemaId = "https://schemas.ardyn.ai/session-event.schema.json";
const transcriptSchemaId = "https://schemas.ardyn.ai/session-transcript.schema.json";

async function readJson(path) {
  return JSON.parse(await readFile(join(root, path), "utf8"));
}

async function readExample(name) {
  return JSON.parse(await readFile(join(examplesDir, name), "utf8"));
}

async function createAjv() {
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  const eventSchema = await readJson("schemas/session-event.schema.json");
  const transcriptSchema = await readJson("schemas/session-transcript.schema.json");
  ajv.addSchema(eventSchema);
  ajv.addSchema(transcriptSchema);
  return ajv;
}

test("session transcript schema validates every valid transcript fixture", async () => {
  const ajv = await createAjv();
  const validate = ajv.getSchema(transcriptSchemaId);
  const files = (await readdir(examplesDir))
    .filter((name) => name.endsWith(".json") && name.startsWith("valid-"))
    .sort();

  assert.deepEqual(files, [
    "valid-error.json",
    "valid-minimal.json",
    "valid-task-approval.json"
  ]);

  for (const file of files) {
    const example = await readExample(file);
    assert.equal(validate(example), true, `${file}\n${JSON.stringify(validate.errors, null, 2)}`);
  }
});

test("session transcript fixtures keep the transcript and event envelopes non-executing", async () => {
  const files = (await readdir(examplesDir))
    .filter((name) => name.endsWith(".json") && name.startsWith("valid-"))
    .sort();

  for (const file of files) {
    const example = await readExample(file);
    assert.equal(example.nonExecuting, true, `${file} must keep transcript nonExecuting true`);
    for (const [flag, value] of Object.entries(example.safety)) {
      assert.equal(value, false, `${file} transcript safety.${flag} must remain false`);
    }

    for (const event of example.events) {
      assert.equal(event.nonExecuting, true, `${file} event ${event.eventId} must keep nonExecuting true`);
      for (const [flag, value] of Object.entries(event.safety)) {
        assert.equal(value, false, `${file} event ${event.eventId} safety.${flag} must remain false`);
      }
    }
  }
});

test("session transcript schema rejects invalid sourceHarness and unsafe transcript safety flags", async () => {
  const ajv = await createAjv();
  const validate = ajv.getSchema(transcriptSchemaId);

  const invalidSourceHarness = await readExample("invalid-source-harness.json");
  assert.equal(validate(invalidSourceHarness), false);
  assert.match(JSON.stringify(validate.errors), /sourceHarness/);

  const invalidSafetyFlag = await readExample("invalid-safety-flag.json");
  assert.equal(validate(invalidSafetyFlag), false);
  assert.match(JSON.stringify(validate.errors), /executionEnabled/);
});

test("session transcript schema leaves event ordering and first-event semantics to higher-level validation", async () => {
  const ajv = await createAjv();
  const validate = ajv.getSchema(transcriptSchemaId);

  const outOfOrder = await readExample("invalid-out-of-order-sequence.json");
  assert.equal(validate(outOfOrder), true, JSON.stringify(validate.errors, null, 2));

  const missingStarted = await readExample("invalid-missing-session-started.json");
  assert.equal(validate(missingStarted), true, JSON.stringify(validate.errors, null, 2));
});

test("session transcript schema composes the session-event schema for nested events", async () => {
  const ajv = await createAjv();
  const eventValidate = ajv.getSchema(eventSchemaId);
  const transcriptValidate = ajv.getSchema(transcriptSchemaId);
  const invalid = await readExample("valid-minimal.json");

  invalid.events[0].payload = {
    status: "planning"
  };

  assert.equal(eventValidate(invalid.events[0]), false);
  assert.equal(transcriptValidate(invalid), false);
  assert.match(JSON.stringify(transcriptValidate.errors), /phase/);
});
