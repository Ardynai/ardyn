import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";

import {
  FIRST_PARTY_KEYRING,
  FABRIC_HARNESSES,
  canonicalize,
  evaluateLicensePolicy,
  manifestDigest,
  parseFabricJson,
  pathConfinementError,
  sha256Hex,
  signingPayload,
  validateCatalog,
  validateKeyringShape,
  validatePackManifest,
} from "../packages/fabric/src/index.mjs";

const root = process.cwd();
const fixtureRoot = "packages/fabric/fixtures";
const locusFixtureRoot = `${fixtureRoot}/locus-cross-impl-v1`;

async function readText(path) {
  return readFile(join(root, path), "utf8");
}

async function readJson(path) {
  return JSON.parse(await readText(path));
}

function sha256Text(value) {
  return createHash("sha256").update(Buffer.from(value, "utf8")).digest("hex");
}

test("fabric harness family matches the current Locus-aligned ARDYN set", () => {
  assert.deepEqual(
    new Set(FABRIC_HARNESSES),
    new Set([
      "*",
      "locus",
      "multiverse",
      "kortex-audio",
      "locus-evolution-lab",
      "somatic",
      "ardyn",
    ]),
  );
  assert.equal(FABRIC_HARNESSES.has("somatic"), true);
  assert.equal(FABRIC_HARNESSES.has("ardyn"), true);
  assert.equal(FABRIC_HARNESSES.has("ardynos"), false);
});

test("canonical serializer output is byte-stable against Locus v1 fixture", async () => {
  const pack = await readJson(`${locusFixtureRoot}/pack.json`);
  const keyring = await readJson(`${locusFixtureRoot}/keyring.json`);
  const catalog = await readJson(`${locusFixtureRoot}/catalog.json`);
  const expectedPack = await readText(`${locusFixtureRoot}/expected-pack-signing-payload.jcs`);
  const expectedKeyring = await readText(`${locusFixtureRoot}/expected-keyring-signing-payload.jcs`);
  const expectedCatalog = await readText(`${locusFixtureRoot}/expected-catalog-signing-payload.jcs`);

  assert.equal(signingPayload(pack).toString("utf8"), expectedPack);
  assert.equal(signingPayload(keyring).toString("utf8"), expectedKeyring);
  assert.equal(signingPayload(catalog).toString("utf8"), expectedCatalog);
  assert.equal(canonicalize({ b: 1, a: [true, null, "x"] }), '{"a":[true,null,"x"],"b":1}');
});

test("signing payload digest matches expected Locus fixture SHA-256", async () => {
  const pack = await readJson(`${locusFixtureRoot}/pack.json`);
  const hashes = await readJson(`${locusFixtureRoot}/expected-hashes.json`);
  const fixture = await readJson(`${fixtureRoot}/signing-payload-fixture.json`);
  const payload = signingPayload(pack);
  const payloadBytes = await readFile(join(root, `${locusFixtureRoot}/payload/hello.txt`));

  assert.equal(fixture.sha256, hashes.expectedJcsSha256["expected-pack-signing-payload.jcs"]);
  assert.equal(sha256Text(payload.toString("utf8")), hashes.expectedJcsSha256["expected-pack-signing-payload.jcs"]);
  assert.equal(sha256Hex(payload), hashes.expectedJcsSha256["expected-pack-signing-payload.jcs"]);
  assert.equal(manifestDigest(pack), hashes.packManifestDigest);
  assert.equal(sha256Hex(payloadBytes), hashes.payload["payload/hello.txt"].sha256);
});

test("mirrored Locus cross-implementation fixture hashes stay canonical", async () => {
  const hashes = await readJson(`${locusFixtureRoot}/expected-hashes.json`);
  const expectedPack = await readFile(join(root, `${locusFixtureRoot}/expected-pack-signing-payload.jcs`));
  const expectedKeyring = await readFile(join(root, `${locusFixtureRoot}/expected-keyring-signing-payload.jcs`));
  const expectedCatalog = await readFile(join(root, `${locusFixtureRoot}/expected-catalog-signing-payload.jcs`));
  const payloadBytes = await readFile(join(root, `${locusFixtureRoot}/payload/hello.txt`));

  assert.equal(
    sha256Hex(expectedPack),
    hashes.expectedJcsSha256["expected-pack-signing-payload.jcs"],
  );
  assert.equal(
    sha256Hex(expectedKeyring),
    hashes.expectedJcsSha256["expected-keyring-signing-payload.jcs"],
  );
  assert.equal(
    sha256Hex(expectedCatalog),
    hashes.expectedJcsSha256["expected-catalog-signing-payload.jcs"],
  );
  assert.equal(sha256Hex(payloadBytes), hashes.payload["payload/hello.txt"].sha256);
});

test("manifests reject floats, exponents, leading-zero, and negative JSON lexemes", async () => {
  for (const name of [
    "float.json",
    "exponent.json",
    "leading-zero.json",
    "negative-integer.json",
    "negative-zero.json",
  ]) {
    const json = await readText(`${fixtureRoot}/invalid-json/${name}`);

    assert.throws(() => parseFabricJson(json), /integers only/i, name);
  }
});

test("path confinement rejects traversal, absolute paths, backslashes, and Windows drive paths", () => {
  const invalidPaths = [
    "../secret.txt",
    "payload/../secret.txt",
    "/absolute/file.txt",
    "\\absolute\\file.txt",
    "payload\\file.txt",
    "C:/temp/file.txt",
    "C:\\temp\\file.txt",
    "payload//file.txt",
    "payload/./file.txt",
  ];

  for (const candidate of invalidPaths) {
    assert.notEqual(pathConfinementError(candidate), null, candidate);
  }

  assert.equal(pathConfinementError("payload/hello.txt"), null);
});

test("pack, keyring, and catalog shape validation accepts valid fixtures", async () => {
  const dataPack = await readJson(`${fixtureRoot}/valid-data-pack.json`);
  const codePack = await readJson(`${fixtureRoot}/valid-code-pack-shape.json`);
  const keyring = await readJson("packages/fabric/trust/first-party-keyring.json");
  const catalog = await readJson(`${fixtureRoot}/valid-catalog.json`);

  assert.deepEqual(validatePackManifest(dataPack), { valid: true, errors: [] });
  assert.deepEqual(validatePackManifest(codePack), { valid: true, errors: [] });
  assert.deepEqual(validateKeyringShape(keyring), { valid: true, errors: [] });
  assert.deepEqual(validateCatalog(catalog), { valid: true, errors: [] });
  assert.deepEqual(keyring, FIRST_PARTY_KEYRING);
});

test("catalog validation rejects missing or malformed schema versions", async () => {
  const catalog = await readJson(`${fixtureRoot}/valid-catalog.json`);

  for (const schemaVersion of [undefined, "1", "1.x", "1.0"]) {
    const invalid = { ...catalog };
    if (schemaVersion === undefined) {
      delete invalid.schemaVersion;
    } else {
      invalid.schemaVersion = schemaVersion;
    }

    const validation = validateCatalog(invalid);
    assert.equal(validation.valid, false, String(schemaVersion));
    assert.match(validation.errors.join("; "), /schemaVersion/);
  }
});

test("catalog validation rejects stale ardynos harness ids", async () => {
  const catalog = await readJson(`${fixtureRoot}/valid-catalog.json`);
  const invalid = { ...catalog, harness: "ardynos" };
  const validation = validateCatalog(invalid);

  assert.equal(validation.valid, false);
  assert.match(validation.errors.join("; "), /known concrete harness/i);
});

test("license gate rejects private-only licenses for public catalog and seed contexts", async () => {
  const manifest = await readJson(`${fixtureRoot}/invalid-private-license-public.json`);
  const policy = evaluateLicensePolicy(manifest);

  assert.equal(policy.catalog.allowed, false);
  assert.match(policy.catalog.reason, /public catalogs/i);
  assert.equal(policy.seed.allowed, false);
  assert.match(policy.seed.reason, /public swarms/i);
});

test("pack manifest validation rejects invalid traversal fixture", async () => {
  const manifest = await readJson(`${fixtureRoot}/invalid-path-traversal.json`);
  const validation = validatePackManifest(manifest);

  assert.equal(validation.valid, false);
  assert.match(validation.errors.join("; "), /path/i);
});

test("unknown fields are preserved in signing payload", async () => {
  const manifest = await readJson(`${fixtureRoot}/valid-data-pack.json`);
  const withUnknown = {
    ...manifest,
    zFutureField: { retained: true, count: 1 },
  };
  const payload = signingPayload(withUnknown).toString("utf8");

  assert.match(payload, /"zFutureField":\{"count":1,"retained":true\}/);
  assert.match(payload, /"signatures":\[\]/);
});
