import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";
import Ajv2020 from "ajv/dist/2020.js";

const root = process.cwd();

async function readJson(path) {
  return JSON.parse(await readFile(join(root, path), "utf8"));
}

async function createAjv() {
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  const capabilitySchema = await readJson("schemas/capability.schema.json");
  const taskSchema = await readJson("schemas/task.schema.json");
  const manifestSchema = await readJson("schemas/ardyn.manifest.schema.json");

  ajv.addSchema(capabilitySchema);
  ajv.addSchema(taskSchema);
  ajv.addSchema(manifestSchema);

  return ajv;
}

test("minimal ARDYN manifest validates against the manifest schema", async () => {
  const ajv = await createAjv();
  const manifest = await readJson("examples/minimal-manifest/ardyn.manifest.json");
  const validate = ajv.getSchema("https://schemas.ardyn.ai/ardyn.manifest.schema.json");

  assert.equal(validate(manifest), true, JSON.stringify(validate.errors, null, 2));
});

test("manifest rejects autonomous execution without declared capabilities", async () => {
  const ajv = await createAjv();
  const validate = ajv.getSchema("https://schemas.ardyn.ai/ardyn.manifest.schema.json");
  const invalid = {
    schemaVersion: "0.1.0",
    name: "invalid-empty-agent",
    version: "0.1.0",
    runtime: {
      host: "rust",
      core: "typescript"
    },
    capabilities: []
  };

  assert.equal(validate(invalid), false);
  assert.match(JSON.stringify(validate.errors), /minItems/);
});

test("manifest rejects execute as the phase 1 default task mode", async () => {
  const ajv = await createAjv();
  const manifest = await readJson("examples/minimal-manifest/ardyn.manifest.json");
  const validate = ajv.getSchema("https://schemas.ardyn.ai/ardyn.manifest.schema.json");
  const invalid = {
    ...manifest,
    policies: {
      ...manifest.policies,
      defaultTaskMode: "execute"
    }
  };

  assert.equal(validate(invalid), false);
  assert.match(JSON.stringify(validate.errors), /defaultTaskMode/);
});

test("capability schema rejects undeclared permission scopes", async () => {
  const ajv = await createAjv();
  const validate = ajv.getSchema("https://schemas.ardyn.ai/capability.schema.json");
  const invalid = {
    id: "filesystem-danger",
    kind: "tool",
    description: "Attempts to request an unknown permission scope.",
    permissions: [
      {
        scope: "rootkit",
        access: "execute"
      }
    ]
  };

  assert.equal(validate(invalid), false);
  assert.match(JSON.stringify(validate.errors), /scope/);
});

test("capability schema rejects execute permissions in phase 1", async () => {
  const ajv = await createAjv();
  const validate = ajv.getSchema("https://schemas.ardyn.ai/capability.schema.json");
  const invalid = {
    id: "process-runner",
    kind: "tool",
    description: "Attempts to execute a process before Phase 1 supports execution.",
    permissions: [
      {
        scope: "process",
        access: "execute"
      }
    ]
  };

  assert.equal(validate(invalid), false);
  assert.match(JSON.stringify(validate.errors), /access/);
});

test("task schema validates dry-run tasks and rejects unknown modes", async () => {
  const ajv = await createAjv();
  const validate = ajv.getSchema("https://schemas.ardyn.ai/task.schema.json");
  const valid = {
    id: "task_01",
    objective: "Describe available ARDYN capabilities without executing tools.",
    mode: "dry-run",
    requestedCapabilities: ["runtime.describe"],
    constraints: {
      requireHumanApproval: true,
      allowNetwork: false
    }
  };

  assert.equal(validate(valid), true, JSON.stringify(validate.errors, null, 2));

  const invalid = { ...valid, mode: "autonomous" };
  assert.equal(validate(invalid), false);
  assert.match(JSON.stringify(validate.errors), /mode/);
});

test("task schema rejects execute mode in phase 1", async () => {
  const ajv = await createAjv();
  const validate = ajv.getSchema("https://schemas.ardyn.ai/task.schema.json");
  const invalid = {
    id: "task_02",
    objective: "Execute a tool before Phase 1 supports execution.",
    mode: "execute",
    requestedCapabilities: ["runtime.describe"]
  };

  assert.equal(validate(invalid), false);
  assert.match(JSON.stringify(validate.errors), /mode/);
});
