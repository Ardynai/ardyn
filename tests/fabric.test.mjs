import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
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
import {
  createFabricFederationClient,
  isLoopbackFabricFederationUrl,
  loadFabricFederationConfigFromEnv,
  verifyFabricCaContent,
} from "../packages/fabric/src/federation.mjs";

const root = process.cwd();
const fixtureRoot = "packages/fabric/fixtures";
const locusFixtureRoot = `${fixtureRoot}/locus-cross-impl-v1`;

test("fabric federation helpers are exposed through a package subpath", async () => {
  const exposed = await import("@ardyn/fabric/federation");

  assert.equal(typeof exposed.createFabricFederationClient, "function");
  assert.equal(typeof exposed.startFabricFederationReceiver, "function");
});

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

test("fabric federation client accepts loopback sidecar URLs and rejects remote sidecars", () => {
  assert.equal(isLoopbackFabricFederationUrl("http://127.0.0.1:37877"), true);
  assert.equal(isLoopbackFabricFederationUrl("http://localhost:37877"), true);
  assert.equal(isLoopbackFabricFederationUrl("http://[::1]:37877"), true);
  assert.equal(isLoopbackFabricFederationUrl("https://127.0.0.1:37877"), false);
  assert.equal(isLoopbackFabricFederationUrl("http://0.0.0.0:37877"), false);
  assert.equal(isLoopbackFabricFederationUrl("http://example.com:37877"), false);

  assert.throws(
    () =>
      createFabricFederationClient({
        localDid: "did:multiverse:ardyn",
        registryBaseUrl: "https://registry.example.test",
        registryToken: "registry-token",
        sidecarBaseUrl: "http://example.com:37877",
        sidecarToken: "sidecar-token",
      }),
    /loopback HTTP/,
  );
});

test("fabric federation env config reads the local secret identity DID without logging key material", async () => {
  const dir = await mkdtemp(join(tmpdir(), "ardyn-fabric-identity-"));
  const identityPath = join(dir, "identity.json");
  await writeFile(
    identityPath,
    JSON.stringify({
      did: "did:multiverse:ardyn",
      privateKey: "do-not-log-or-commit",
    }),
  );

  try {
    const config = loadFabricFederationConfigFromEnv({
      ARDYN_FABRIC_IDENTITY_FILE: identityPath,
      ARDYN_FABRIC_REGISTRY_TOKEN: "registry-token",
      ARDYN_FABRIC_REGISTRY_URL: "https://registry.example.test",
      ARDYN_FABRIC_SIDECAR_TOKEN: "sidecar-token",
      ARDYN_FABRIC_SIDECAR_URL: "http://127.0.0.1:37877",
    });

    assert.equal(config.localDid, "did:multiverse:ardyn");
    assert.equal(config.privateKey, undefined);
  } finally {
    await rm(dir, { force: true, recursive: true });
  }
});

test("fabric federation send authenticates with registry and reaches an allowlisted sibling", async () => {
  const calls = [];
  const fetchImpl = async (url, init) => {
    calls.push({ body: init.body, headers: init.headers, method: init.method, path: new URL(url).pathname });
    const path = new URL(url).pathname;
    if (path === "/fabric/federation/allowlist") {
      return jsonResponse({ allowlist: ["did:multiverse:locus"] });
    }
    if (path === "/v1/content" && init.method === "PUT") {
      const bytes = Buffer.from(init.body);
      const descriptor = testDescriptor(bytes, 4);
      return jsonResponse({ contentId: descriptor.contentId, descriptor });
    }
    if (path === "/fabric/federation/send") {
      const body = JSON.parse(init.body);
      assert.equal(body.toDid, "did:multiverse:locus");
      assert.equal(body.fromDid, "did:multiverse:ardyn");
      assert.equal(body.transport, "fabric-ca");
      return jsonResponse({ delivered: true, toDid: body.toDid });
    }
    if (path === "/systems/register") {
      return jsonResponse({ registered: true });
    }
    return jsonResponse({ error: "not found" }, 404);
  };
  const client = createFabricFederationClient(testFederationConfig({ fetchImpl }));

  await client.registerReachability();
  const sent = await client.send("did:multiverse:locus", Buffer.from("shared-content"));

  assert.equal(sent.registry.delivered, true);
  assert.equal(calls.find((call) => call.path === "/systems/register").headers.authorization, "Bearer registry-token");
  assert.equal(calls.find((call) => call.path === "/fabric/federation/send").headers.authorization, "Bearer registry-token");
  assert.equal(calls.find((call) => call.path === "/v1/content").headers.authorization, "Bearer sidecar-token");
});

test("fabric federation client preserves custom registry send paths after normalization", async () => {
  const calls = [];
  const fetchImpl = async (url, init) => {
    calls.push({ body: init.body, method: init.method, path: new URL(url).pathname });
    const path = new URL(url).pathname;
    if (path === "/custom/allowlist") return jsonResponse({ allowlist: ["did:multiverse:locus"] });
    if (path === "/v1/content" && init.method === "PUT") {
      const bytes = Buffer.from(init.body);
      const descriptor = testDescriptor(bytes, 4);
      return jsonResponse({ contentId: descriptor.contentId, descriptor });
    }
    if (path === "/custom/send") return jsonResponse({ delivered: true });
    return jsonResponse({ error: "not found" }, 404);
  };
  const client = createFabricFederationClient(
    testFederationConfig({
      fetchImpl,
      registryPaths: { allowlist: "/custom/allowlist", send: "/custom/send" },
    }),
  );

  const sent = await client.send("did:multiverse:locus", Buffer.from("shared-content"));

  assert.equal(sent.registry.delivered, true);
  assert.equal(calls.some((call) => call.path === "/custom/send"), true);
  assert.equal(calls.some((call) => call.path === "/fabric/federation/send"), false);
});

test("fabric federation receiver accepts allowlisted authenticated siblings and rejects non-allowlisted DIDs", async () => {
  const bytes = Buffer.from("ciphertext:opaque-secure-drop-payload");
  const descriptor = testDescriptor(bytes, 8);
  const delivered = [];
  const fetchImpl = async (url) => {
    const path = new URL(url).pathname;
    if (path === "/fabric/federation/allowlist") {
      return jsonResponse({ allowlist: ["did:multiverse:locus"] });
    }
    if (path === "/fabric/federation/inbox") {
      return jsonResponse({
        items: [
          {
            authenticated: true,
            contentId: descriptor.contentId,
            encrypted: true,
            fromDid: "did:multiverse:locus",
            id: "message-1",
            secure: true,
            toDid: "did:multiverse:ardyn",
          },
          {
            authenticated: true,
            contentId: descriptor.contentId,
            fromDid: "did:multiverse:kybernetes",
            id: "message-2",
            toDid: "did:multiverse:ardyn",
          },
        ],
      });
    }
    if (path === `/v1/content/${descriptor.contentId}/descriptor`) {
      return jsonResponse({ contentId: descriptor.contentId, descriptor });
    }
    if (path === `/v1/content/${descriptor.contentId}`) {
      return bytesResponse(bytes, { "x-fabric-content-id": descriptor.contentId });
    }
    if (path.endsWith("/received")) {
      return jsonResponse({ ok: true });
    }
    return jsonResponse({ error: "not found" }, 404);
  };
  const client = createFabricFederationClient(testFederationConfig({ fetchImpl }));

  const result = await client.pollInboundOnce((delivery) => {
    delivered.push(delivery);
  });

  assert.equal(result.delivered.length, 1);
  assert.equal(result.rejected.length, 1);
  assert.equal(result.rejected[0].fromDid, "did:multiverse:kybernetes");
  assert.equal(result.rejected[0].error.code, "did_not_allowlisted");
  assert.equal(delivered[0].fromDid, "did:multiverse:locus");
  assert.equal(delivered[0].encrypted, true);
  assert.equal(delivered[0].bytes.toString("utf8"), "ciphertext:opaque-secure-drop-payload");
});

test("fabric federation receive re-verifies contentId and catches tampered bytes", async () => {
  const original = Buffer.from("verified-content");
  const descriptor = testDescriptor(original, 6);
  const fetchImpl = async (url) => {
    const path = new URL(url).pathname;
    if (path === "/fabric/federation/allowlist") {
      return jsonResponse({ allowlist: ["did:multiverse:locus"] });
    }
    if (path === "/fabric/federation/inbox") {
      return jsonResponse({
        items: [
          {
            authenticated: true,
            contentId: descriptor.contentId,
            fromDid: "did:multiverse:locus",
            toDid: "did:multiverse:ardyn",
          },
        ],
      });
    }
    if (path === `/v1/content/${descriptor.contentId}/descriptor`) {
      return jsonResponse({ contentId: descriptor.contentId, descriptor });
    }
    if (path === `/v1/content/${descriptor.contentId}`) {
      return bytesResponse(Buffer.from("tampered-content"), { "x-fabric-content-id": descriptor.contentId });
    }
    return jsonResponse({ error: "not found" }, 404);
  };
  const client = createFabricFederationClient(testFederationConfig({ fetchImpl }));

  const result = await client.pollInboundOnce(() => {
    throw new Error("handler should not receive tampered bytes");
  });

  assert.equal(result.delivered.length, 0);
  assert.equal(result.rejected.length, 1);
  assert.equal(result.rejected[0].error.code, "piece_hash_mismatch");
});

test("fabric CA verifier catches a tampered byte against the sidecar descriptor contract", () => {
  const original = Buffer.from("piece-order-matters");
  const descriptor = testDescriptor(original, 5);

  assert.equal(verifyFabricCaContent(original, descriptor).contentId, descriptor.contentId);
  assert.throws(
    () => verifyFabricCaContent(Buffer.from("piece-order-matterz"), descriptor),
    /piece hash mismatch/i,
  );
});

function testFederationConfig(overrides = {}) {
  return {
    allowSiblingDids: ["did:multiverse:locus"],
    localDid: "did:multiverse:ardyn",
    registryBaseUrl: "https://registry.example.test",
    registryToken: "registry-token",
    sidecarBaseUrl: "http://127.0.0.1:37877",
    sidecarToken: "sidecar-token",
    timeoutMs: 1_000,
    ...overrides,
  };
}

function testDescriptor(bytes, pieceSize) {
  const pieces = [];
  for (let offset = 0; offset < bytes.byteLength || pieces.length === 0; offset += pieceSize) {
    const chunk = bytes.subarray(offset, Math.min(offset + pieceSize, bytes.byteLength));
    pieces.push({
      index: pieces.length,
      offset,
      sha256: leafHash(chunk),
      size: chunk.byteLength,
    });
    if (bytes.byteLength === 0) break;
  }
  const contentId = merkleRoot(pieces.map((piece) => piece.sha256));
  return {
    contentId,
    hash: "sha256",
    merkle: "sha256-domain-separated-binary-pair-v1",
    merkleRoot: contentId,
    pieces,
    pieceSize,
    schemaVersion: "1.0.0",
    totalSize: bytes.byteLength,
    transport: "fabric-ca",
  };
}

function leafHash(bytes) {
  return createHash("sha256").update(Buffer.from([0x00])).update(bytes).digest("hex");
}

function merkleRoot(pieceHashes) {
  let level = pieceHashes.map((hash) => Buffer.from(hash, "hex"));
  while (level.length > 1) {
    const next = [];
    for (let index = 0; index < level.length; index += 2) {
      const left = level[index];
      const right = level[index + 1] ?? left;
      next.push(createHash("sha256").update(Buffer.from([0x01])).update(left).update(right).digest());
    }
    level = next;
  }
  return Buffer.from(level[0]).toString("hex");
}

function jsonResponse(body, status = 200) {
  return response(Buffer.from(JSON.stringify(body), "utf8"), status, { "content-type": "application/json" });
}

function bytesResponse(body, headers = {}) {
  return response(Buffer.from(body), 200, headers);
}

function response(body, status, headers) {
  const normalizedHeaders = new Map(
    Object.entries(headers).map(([key, value]) => [key.toLowerCase(), String(value)]),
  );
  return {
    headers: {
      get(name) {
        return normalizedHeaders.get(name.toLowerCase()) ?? null;
      },
    },
    ok: status >= 200 && status < 300,
    status,
    async arrayBuffer() {
      return body.buffer.slice(body.byteOffset, body.byteOffset + body.byteLength);
    },
    async text() {
      return body.toString("utf8");
    },
  };
}
