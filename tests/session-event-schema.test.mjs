import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";
import Ajv2020 from "ajv/dist/2020.js";

const root = process.cwd();
const examplesDir = join(root, "examples", "session-events");
const schemaId = "https://schemas.ardyn.ai/session-event.schema.json";

async function readJson(path) {
  return JSON.parse(await readFile(join(root, path), "utf8"));
}

async function readExample(name) {
  return JSON.parse(await readFile(join(examplesDir, name), "utf8"));
}

async function createAjv() {
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  const schema = await readJson("schemas/session-event.schema.json");
  ajv.addSchema(schema);
  return ajv;
}

test("session event schema validates every valid example fixture", async () => {
  const ajv = await createAjv();
  const validate = ajv.getSchema(schemaId);
  const files = (await readdir(examplesDir))
    .filter((name) => name.endsWith(".json") && !name.startsWith("invalid-"))
    .sort();

  assert.ok(files.length >= 8, "expected at least one valid example per event type");

  for (const file of files) {
    const example = await readExample(file);
    assert.equal(validate(example), true, `${file}\n${JSON.stringify(validate.errors, null, 2)}`);
  }
});

test("session event schema covers all required event types with valid examples", async () => {
  const files = (await readdir(examplesDir))
    .filter((name) => name.endsWith(".json") && !name.startsWith("invalid-"))
    .sort();
  const eventTypes = new Set();

  for (const file of files) {
    const example = await readExample(file);
    eventTypes.add(example.eventType);
    assert.equal(example.nonExecuting, true, `${file} must keep nonExecuting true`);
    for (const [flag, value] of Object.entries(example.safety)) {
      assert.equal(value, false, `${file} safety.${flag} must remain false`);
    }
  }

  assert.deepEqual([...eventTypes].sort(), [
    "approval.recorded",
    "approval.requested",
    "session.capabilities",
    "session.completed",
    "session.error",
    "session.heartbeat",
    "session.started",
    "task.planned"
  ]);
});

test("session event schema rejects invalid source harness and unsafe flags", async () => {
  const ajv = await createAjv();
  const validate = ajv.getSchema(schemaId);

  const invalidSourceHarness = await readExample("invalid-source-harness.json");
  assert.equal(validate(invalidSourceHarness), false);
  assert.match(JSON.stringify(validate.errors), /sourceHarness/);

  const invalidSafetyFlag = await readExample("invalid-safety-flag.json");
  assert.equal(validate(invalidSafetyFlag), false);
  assert.match(JSON.stringify(validate.errors), /executionEnabled/);
});

test("session event schema binds payload shape to event type", async () => {
  const ajv = await createAjv();
  const validate = ajv.getSchema(schemaId);
  const invalid = await readExample("session-started.json");
  invalid.payload = {
    status: "planning"
  };

  assert.equal(validate(invalid), false);
  assert.match(JSON.stringify(validate.errors), /phase/);
});

test("session event schema rejects unknown top-level command fields", async () => {
  const ajv = await createAjv();
  const validate = ajv.getSchema(schemaId);
  const invalid = await readExample("session-started.json");
  invalid.command = {
    argv: ["node", "unsafe.js"]
  };

  assert.equal(validate(invalid), false);
  assert.match(JSON.stringify(validate.errors), /additionalProperties/);
});
