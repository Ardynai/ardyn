// M0.5: Real JSON Schema validation for boundary-map artifacts
// Validates that every fixture with a "schema" field passes its generated JSON Schema,
// checking shape + safety invariants (reviewOnly: true, authoritative: false, etc.)
import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import Ajv2020 from "ajv/dist/2020.js";

const repoRoot = fileURLToPath(new URL("../", import.meta.url));
const fixtureRoot = join(repoRoot, "tests", "fixtures", "host-policy");
const schemaDir = join(repoRoot, "schemas", "boundary-maps");

async function readJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

// Recursively find all .json fixture files
async function findFixtures(dir) {
  const results = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return results;
  }
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...await findFixtures(fullPath));
    } else if (entry.name.endsWith(".json")) {
      results.push(fullPath);
    }
  }
  return results;
}

// Build an ajv instance with all boundary-map schemas loaded
async function createBoundaryMapAjv() {
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  const registry = await readJson(join(schemaDir, "registry.json"));

  for (const [schemaName, schemaFile] of Object.entries(registry)) {
    const schema = await readJson(join(repoRoot, schemaFile));
    try {
      ajv.addSchema(schema);
    } catch (e) {
      // If schema already added, skip
      if (!e.message.includes("already exists")) throw e;
    }
  }
  return ajv;
}

test("M0.5: boundary-map schemas directory exists and has schemas", async () => {
  const files = await readdir(schemaDir);
  const schemaFiles = files.filter(f => f.endsWith(".schema.json"));
  assert.ok(schemaFiles.length >= 90, `Expected >= 90 schema files, found ${schemaFiles.length}`);
});

test("M0.5: registry maps schema names to schema files", async () => {
  const registry = await readJson(join(schemaDir, "registry.json"));
  assert.ok(Object.keys(registry).length >= 90, "registry should have >= 90 entries");
});

test("M0.5: all valid (non-malformed) fixtures validate against their boundary-map schemas", async () => {
  const ajv = await createBoundaryMapAjv();
  const fixtures = await findFixtures(fixtureRoot);

  let validated = 0;
  let skipped = 0;
  const errors = [];

  for (const fixturePath of fixtures) {
    const fixture = await readJson(fixturePath);
    if (!fixture.schema || typeof fixture.schema !== "string") {
      skipped++;
      continue;
    }

    // Skip malformed/negative-test fixtures — they're intentionally invalid
    const basename = relative(repoRoot, fixturePath);
    if (basename.includes("malformed") || basename.includes("missing-") ||
        basename.includes("redacted-") || basename.includes("invalid-") ||
        basename.includes("blocked-") || basename.includes("fail-closed") ||
        basename.includes("unredactable")) {
      skipped++;
      continue;
    }

    // Find the schema by its $id
    const schemaId = `https://schemas.ardyn.ai/boundary-maps/${fixture.schema}.schema.json`;
    const validate = ajv.getSchema(schemaId);

    if (!validate) {
      skipped++;
      continue;
    }

    const valid = validate(fixture);
    if (!valid) {
      errors.push({
        fixture: basename,
        schema: fixture.schema,
        errors: validate.errors
      });
    } else {
      validated++;
    }
  }

  assert.equal(errors.length, 0,
    `${errors.length} fixtures failed schema validation:\n` +
    errors.slice(0, 5).map(e =>
      `  ${e.fixture} (${e.schema}): ${JSON.stringify(e.errors?.slice(0, 3))}`
    ).join("\n")
  );
  assert.ok(validated >= 80, `Expected >= 80 validated fixtures, got ${validated}`);
});

test("M0.5: schemas enforce safety invariants (reviewOnly: true, authoritative: false)", async () => {
  const ajv = await createBoundaryMapAjv();
  const registry = await readJson(join(schemaDir, "registry.json"));

  // Pick a representative schema and test that safety violations are caught
  const testSchemaName = Object.keys(registry)[0];
  const schemaId = `https://schemas.ardyn.ai/boundary-maps/${testSchemaName}.schema.json`;
  const validate = ajv.getSchema(schemaId);
  assert.ok(validate, `Schema ${testSchemaName} should be loaded`);

  // Load a fixture and violate safety invariants
  const fixturePath = join(repoRoot, registry[testSchemaName].replace("schemas/boundary-maps/", "").replace(".schema.json", ""));
  // Actually, just test with a minimal object
  const testSchema = await readJson(join(repoRoot, registry[testSchemaName]));
  const minimalValid = {};
  for (const req of testSchema.required) {
    if (req === "schema") minimalValid.schema = testSchemaName;
    else if (req === "reviewOnly") minimalValid.reviewOnly = true;
    else if (req === "authoritative") minimalValid.authoritative = false;
    else if (req === "metadataOnly") minimalValid.metadataOnly = true;
    else if (req === "reviewArtifactOnly") minimalValid.reviewArtifactOnly = true;
    else if (req === "reviewedAtDefaulted") minimalValid.reviewedAtDefaulted = false;
    else if (req === "schemaVersion") minimalValid.schemaVersion = "0.1.0";
    else if (req === "reviewedAt") minimalValid.reviewedAt = "2026-07-09T00:00:00.000Z";
    else if (req === "classification") minimalValid.classification = "test";
    else minimalValid[req] = "";
  }

  // Test that authoritative: true is rejected
  const violated = { ...minimalValid, authoritative: true };
  const validResult = validate(violated);
  assert.equal(validResult, false, "authoritative: true should be rejected by schema");

  // Test that reviewOnly: false is rejected
  const violated2 = { ...minimalValid, reviewOnly: false };
  const validResult2 = validate(violated2);
  assert.equal(validResult2, false, "reviewOnly: false should be rejected by schema");
});