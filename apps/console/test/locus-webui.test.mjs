import assert from "node:assert/strict";
import { test } from "node:test";
import { createHash, generateKeyPairSync, randomBytes, sign } from "node:crypto";
import { readFileSync, readdirSync, mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as p from "@multiverse/fabric-hub-protocol";
import { createLocusEmbedServer, capabilities, embedPath, systemId } from "../src/lib/locus-embed/server.mjs";
import config from "../next.config.mjs";

const packageRoot = join(dirname(fileURLToPath(import.meta.resolve("@multiverse/fabric-hub-protocol"))), "..");
const provenance = JSON.parse(readFileSync(new URL("../../../vendor/fabric-hub-protocol/fabric-hub-protocol.provenance.json", import.meta.url)));
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const fixture = (path) => JSON.parse(readFileSync(join(packageRoot, "vectors", path)));

test("same immutable shared artifact and all vector bytes", () => {
  assert.equal(hash(readFileSync(new URL("../../../vendor/fabric-hub-protocol/multiverse-fabric-hub-protocol-0.2.0.tgz", import.meta.url))),
    "8405d90ec1cb823dec0943938b6afc7ea985f99d3abd2400f77269c108602fdd");
  for (const [path, expected] of Object.entries(provenance.sourceSha256)) {
    if (path.startsWith("vectors/")) assert.equal(hash(readFileSync(join(packageRoot, path))), expected, path);
  }
});

test("six frozen v1 vectors have exact results, and runtime refuses v1", () => {
  const manifest = fixture("webui-v1/manifests.json").manifestV1;
  for (const entry of fixture("webui-v1/index.json").vectors) {
    const vector = fixture(`webui-v1/${entry.file}`);
    const result = p.evaluateWebUiV1Vector(vector, { manifest, trustedRootDids: manifest.signers,
      currentManifestVersion: 0, now: Date.parse("2026-09-10T12:00:00Z") });
    assert.deepEqual(result.problems, vector.expected.problems, entry.file);
    if (entry.name !== "bad-signature") assert.ok(!result.problems.includes("signature-invalid"));
    assert.deepEqual(p.verifyWebUiMessage(vector.envelope, {}).problems, ["webui_version_refused"]);
  }
});

test("seven v2 registration vectors have exact reasons and genuinely signed semantic rejects", () => {
  for (const file of readdirSync(join(packageRoot, "vectors/webui-v2"))) {
    const vector = fixture(`webui-v2/${file}`);
    const result = p.verifyWebUiRegistration(vector.input, vector.trust);
    assert.deepEqual(result.problems, vector.expected.problems, file);
    assert.equal(result.verdict, vector.expected.verdict, file);
    if (file !== "reject-bad-signature.json") {
      assert.ok(!result.problems.includes("signature-invalid"));
      assert.equal(p.verifyDidKeySignature(vector.input.envelope.payload,
        vector.input.envelope.signature.value, vector.input.envelope.payload.did), true);
    }
  }
});

function identity() {
  const key = generateKeyPairSync("ed25519");
  return { ...key, did: p.didKeyFromPublicKey(key.publicKey.export({ type: "spki", format: "der" }).subarray(-32)) };
}
const signPayload = (payload, key) => sign(null, Buffer.from(p.canonicalizeJcs(payload)), key.privateKey).toString("base64url");

test("real composition replies only to a current host ticket; browser pins source and origin", async () => {
  const root = identity(), repo = identity(), host = identity();
  const now = Date.now();
  const unsigned = { version: 2, signers: [root.did], threshold: 1, entries: [
    { systemId: "ardyn", currentDid: repo.did, category: "webui" },
    { systemId: "locus", currentDid: host.did, category: "hub" },
  ] };
  const manifest = { ...unsigned, signatures: [{ signer: root.did, value: signPayload(unsigned, root) }] };
  const payload = { systemId: "ardyn", did: repo.did, category: "webui",
    endpoints: { sidecarUrl: "https://ardyn.example.invalid/fabric" }, origin: "https://ardyn.example.invalid",
    embedUrl: "https://ardyn.example.invalid/", capabilities: ["open"],
    issuedAt: new Date(now - 1000).toISOString(), expiresAt: new Date(now + 120000).toISOString(),
    nonce: randomBytes(16).toString("base64url") };
  const envelope = { payload, signature: { alg: "Ed25519", kid: repo.did, value: signPayload(payload, repo) } };
  const recordId = p.fabricHubRecordId(envelope);
  const trust = { manifest, trustedRootDids: [root.did], currentManifestVersion: 1, now };
  const registration = { systemId: "ardyn", envelope, recordId };
  const verified = p.verifyWebUiRegistration(registration, trust);
  assert.equal(verified.verdict, "accept");
  assert.deepEqual(p.webUiEmbedAllowed({ ...verified.value, origin: p.LOCUS_WEBUI_ORIGIN }).problems, ["webui_same_origin_refused"]);
  const directory = mkdtempSync(join(tmpdir(), "ardyn-webui-synthetic-"));
  try {
    const keyPath = join(directory, "test-only.pk8");
    writeFileSync(keyPath, repo.privateKey.export({ type: "pkcs8", format: "pem" }));
    const env = { LOCUS_WEBUI_REGISTRY_ORIGIN: "https://registry.example.invalid",
      FABRIC_HUB_TRUSTED_ROOT_DIDS: root.did, LOCUS_WEBUI_MIN_MANIFEST_VERSION: "1",
      LOCUS_WEBUI_SYSTEM_KEY_FILE: keyPath };
    let fetches = 0;
    const fetcher = async (url, options) => {
      assert.equal(url, "https://registry.example.invalid/systems/ardyn/webui");
      assert.equal(options.redirect, "error");
      fetches++;
      return Response.json({ manifest, envelope, recordId });
    };
    const server = createLocusEmbedServer(env, fetcher);
    assert.equal((await server.GET()).status, 200);
    const ticketPayload = { contractVersion: 2, messageType: "locus-webui/request", systemId: "locus", did: host.did,
      recipientSystemId: "ardyn", recipientDid: repo.did, origin: p.LOCUS_WEBUI_ORIGIN,
      channelId: randomBytes(16).toString("base64url"), manifestId: verified.value.manifestId, registrationRecordId: recordId,
      capability: "open", consent: "granted", issuedAt: new Date(now).toISOString(),
      expiresAt: new Date(now + 60000).toISOString(), nonce: randomBytes(16).toString("base64url"), request: { action: "open" } };
    const ticket = { payload: ticketPayload, signature: { alg: "Ed25519", kid: host.did, value: signPayload(ticketPayload, host) } };
    const request = (body) => new Request("https://ardyn.example.invalid/api/locus-webui", {
      method: "POST", headers: { origin: "https://ardyn.example.invalid" }, body: JSON.stringify(body) });
    const response = await server.POST(request(ticket));
    assert.equal(response.status, 200);
    const reply = await response.json();
    assert.deepEqual(reply.payload.request, { action: "open", path: "/" });
    assert.equal(p.verifyDidKeySignature(reply.payload, reply.signature.value, repo.did), true);
    assert.equal(reply.payload.requestNonce, ticketPayload.nonce);
    const unavailable = createLocusEmbedServer({ ...env, LOCUS_WEBUI_SYSTEM_KEY_FILE: "" }, fetcher);
    const missingKey = await unavailable.POST(request(ticket));
    assert.equal(missingKey.status, 503);
    assert.deepEqual(await missingKey.json(), { error: "webui_signer_unavailable" });
    const wrongKeyPath = join(directory, "wrong-existing-fixture.pk8");
    writeFileSync(wrongKeyPath, host.privateKey.export({ type: "pkcs8", format: "pem" }));
    const mismatched = createLocusEmbedServer({ ...env, LOCUS_WEBUI_SYSTEM_KEY_FILE: wrongKeyPath }, fetcher);
    const mismatch = await mismatched.POST(request(ticket));
    assert.equal(mismatch.status, 503);
    assert.deepEqual(await mismatch.json(), { error: "webui_signer_mismatch" });
    assert.deepEqual(await (await server.POST(request(ticket))).json(), { error: "nonce-replayed" });
    const before = fetches;
    const badOrigin = await server.POST(new Request("https://ardyn.example.invalid/api/locus-webui", {
      method: "POST", headers: { origin: "https://evil.example.invalid" }, body: "{}" }));
    assert.equal(badOrigin.status, 403);
    assert.equal(fetches, before);

    let listener, loaded = 0;
    const posted = [];
    const parent = { postMessage: (...args) => posted.push(args) };
    const window = { parent, location: { origin: payload.origin }, addEventListener: (_, cb) => { listener = cb; },
      removeEventListener: (_, cb) => { assert.equal(cb, listener); } };
    const errors = [];
    const disconnect = p.connectWebUiBrowser({ window, load: async () => { loaded++; return { registration, trust }; },
      reply: async () => reply, onError: reason => errors.push(reason) });
    listener({ origin: "null", source: parent, data: ticket });
    listener({ origin: p.LOCUS_WEBUI_ORIGIN, source: {}, data: ticket });
    await new Promise(resolve => setTimeout(resolve, 0));
    assert.equal(loaded, 0);
    listener({ origin: p.LOCUS_WEBUI_ORIGIN, source: parent, data: ticket });
    await new Promise(resolve => setTimeout(resolve, 30));
    assert.deepEqual(errors, []);
    assert.deepEqual(posted, [[reply, p.LOCUS_WEBUI_ORIGIN]]);
    disconnect();
  } finally {
    assert.equal(dirname(directory), tmpdir());
    rmSync(directory, { recursive: true, force: true });
  }
});

test("missing configuration and oversized/invalid requests fail closed; capability and CSP stay minimal", async () => {
  const server = createLocusEmbedServer({}, () => { throw new Error("must not fetch"); });
  assert.deepEqual(await (await server.GET()).json(), { error: "webui_trust_unavailable" });
  const oversized = new Request("https://ardyn.example.invalid/api/locus-webui", { method: "POST",
    headers: { origin: "https://ardyn.example.invalid" }, body: "x".repeat(65537) });
  assert.equal((await server.POST(oversized)).status, 413);
  assert.deepEqual(capabilities, ["open"]);
  assert.equal(systemId, "ardyn");
  assert.equal(embedPath, "/");
  assert.deepEqual(await config.headers(), [{ source: "/:path*", headers: [{ key: "Content-Security-Policy",
    value: `frame-ancestors ${p.LOCUS_WEBUI_ORIGIN}` }] }]);
});
