// M20: Federation A2A handoff exchange — gated, signed, GLOSSOPETRAE-encoded.
// ALL transport is INJECTED fake fetch — never a live sidecar/registry.
import assert from "node:assert/strict";
import test from "node:test";
import { createHash, generateKeyPairSync } from "node:crypto";
import { encodeHandoff, decodeHandoff } from "../packages/core/src/glossopetrae-codec.mjs";
import {
  FABRIC_FEDERATION_CLOSED_SIBLING_DIDS,
  FabricFederationError,
  createFabricFederationClient,
} from "../packages/fabric/src/federation.mjs";
import {
  createFederationHandoff,
  signHandoffEnvelope,
  FEDERATION_HANDOFF_SIBLING_DIDS,
} from "../packages/fabric/src/handoff.mjs";

const LOCAL = "did:multiverse:ardyn";
const SIBLING = "did:multiverse:locus";
const STRANGER = "did:multiverse:stranger";

// Deterministic Ed25519 keypair for the local signer (tests only).
const { publicKey, privateKey } = generateKeyPairSync("ed25519");
const publicSpkiB64 = publicKey.export({ type: "spki", format: "der" }).toString("base64");

process.env.ARDYN_FABRIC_SIBLING_KEYS = JSON.stringify({
  [LOCAL]: publicSpkiB64,
  [SIBLING]: publicSpkiB64, // test convenience: sibling registered with the same test key
});

function fakeTransport(t) {
  // Records requests; serves sidecar PUT/GET + registry send/inbox.
  const store = new Map();
  const calls = [];
  let idCounter = 0;
  const inbox = [];
  const impl = async (url, init = {}) => {
    const u = String(url instanceof URL ? url : url);
    calls.push({ url: u, method: init.method, headers: init.headers ?? {}, body: init.body });
    if (init.method === "PUT" && u.includes("/v1/content")) {
      const bytes = Buffer.isBuffer(init.body) ? init.body : Buffer.from(init.body);
      const contentId = createContentId(bytes);
      store.set(contentId, { bytes, descriptor: descriptorFor(bytes, contentId) });
      return jsonResponse(200, { contentId, descriptor: descriptorFor(bytes, contentId) });
    }
    if (init.method === "GET" && u.includes("/descriptor")) {
      const contentId = u.split("/v1/content/")[1].split("/")[0];
      const entry = store.get(contentId);
      if (!entry) return jsonResponse(404, {});
      return jsonResponse(200, { contentId, descriptor: entry.descriptor });
    }
    if (init.method === "GET" && u.includes("/v1/content/")) {
      const contentId = u.split("/v1/content/")[1].split("?")[0];
      const entry = store.get(contentId);
      if (!entry) return jsonResponse(404, {});
      return rawResponse(200, entry.bytes, contentId);
    }
    if (init.method === "POST" && u.includes("/fabric/federation/send")) {
      const body = JSON.parse(init.body);
      inbox.push(body);
      return jsonResponse(200, { id: `msg-${++idCounter}`, accepted: true });
    }
    if (init.method === "GET" && u.includes("/fabric/federation/inbox")) {
      return jsonResponse(200, { items: t?.inbox ?? inbox.splice(0, inbox.length) });
    }
    if (init.method === "POST" && u.includes("/received")) return jsonResponse(200, { ok: true });
    if (u.includes("/systems/register") || u.includes("/keepalive")) return jsonResponse(200, { ok: true });
    return jsonResponse(404, {});
  };
  impl.calls = calls;
  impl.store = store;
  impl.inbox = inbox;
  return impl;
}

function createContentId(bytes) {
  // Single-piece payload: federation.mjs's merkleRootForLeafHashes returns the
  // lone leaf as-is, so contentId == sha256(0x00 || bytes).
  return createHash("sha256").update(Buffer.from([0x00])).update(bytes).digest("hex");
}
function descriptorFor(bytes, contentId) {
  return {
    schemaVersion: "1.0.0",
    transport: "fabric-ca",
    hash: "sha256",
    merkle: "sha256-domain-separated-binary-pair-v1",
    contentId,
    merkleRoot: contentId,
    pieceSize: 262144,
    totalSize: bytes.byteLength,
    pieces: [{ index: 0, offset: 0, size: bytes.byteLength, sha256: createHash("sha256").update(Buffer.from([0x00])).update(bytes).digest("hex") }],
  };
}
function jsonResponse(status, obj) {
  const text = JSON.stringify(obj);
  const ab = new TextEncoder().encode(text).buffer;
  return { ok: status < 400, status, statusText: "S", headers: { get: () => null }, json: async () => obj, text: async () => text, arrayBuffer: async () => ab, body: null };
}
function rawResponse(status, bytes, contentId) {
  const buf = Buffer.from(bytes);
  return {
    ok: true, status, statusText: "OK",
    headers: { get: (n) => (n.toLowerCase() === "x-fabric-content-id" ? contentId : null) },
    arrayBuffer: async () => buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength),
    body: null,
  };
}

function makeHandoff(fetchImpl) {
  process.env.ARDYN_FABRIC_REGISTRY_TOKEN = "registry-token-test";
  process.env.ARDYN_FABRIC_SIDECAR_URL = "http://127.0.0.1:9";
  process.env.ARDYN_FABRIC_SIDECAR_TOKEN = "sidecar-token-test";
  const client = createFabricFederationClient({
    localDid: LOCAL,
    sidecarBaseUrl: "http://127.0.0.1:9",
    registryBaseUrl: "https://registry.example",
    registryToken: "registry-token-test",
    sidecarToken: "sidecar-token-test",
    fetchImpl,
  });
  return createFederationHandoff({ client, localDid: LOCAL });
}

test("M20: sibling allowlist is exactly the closed set minus self", () => {
  for (const did of ["hub", "kortex-audio", "locus", "custos", "somatic", "aegis", "praxis", "kybernetes"]) {
    assert.ok(FEDERATION_HANDOFF_SIBLING_DIDS.includes(`did:multiverse:${did}`), did);
  }
  assert.ok(!FEDERATION_HANDOFF_SIBLING_DIDS.includes(LOCAL));
});

test("M20: exchange REFUSES without explicit approval (default OFF)", async () => {
  const handoff = makeHandoff(fakeTransport());
  await assert.rejects(
    () => handoff.sendHandoff({ toDid: SIBLING, payload: { x: 1 } }),
    (e) => e.code === "exchange_not_approved"
  );
  await assert.rejects(
    () => handoff.handleDelivery({}, {}),
    (e) => e.code === "exchange_not_approved"
  );
});

test("M20: send builds a SIGNED + GLOSSOPETRAE-encoded envelope to a sibling", async () => {
  const transport = fakeTransport();
  const handoff = makeHandoff(transport);
  const result = await handoff.sendHandoff(
    { toDid: SIBLING, payload: { task: "review", files: ["a.ts"] }, signingKey: privateKey.export({ type: "pkcs8", format: "pem" }) },
    { approved: true }
  );
  assert.equal(result.toDid, SIBLING);

  // The uploaded CONTENT is the signed envelope:
  const sentCall = transport.calls.find(c => c.method === "POST" && c.url.includes("/send"));
  const envelope = JSON.parse(transport.store.get(result.contentId).bytes.toString("utf8"));
  assert.equal(envelope.type, "ardyn_handoff");
  assert.equal(envelope.fromDid, LOCAL);
  assert.equal(envelope.toDid, SIBLING);
  assert.equal(envelope.authenticated, true);
  assert.equal(envelope.authenticatedDid, LOCAL);
  assert.match(envelope.encoded, /^GL1:[0-9a-f]{16}:/, "payload must be GL1-encoded");

  // Signature verifies with node:crypto against the registered public key
  // through the EXISTING invariant:
  const { isInboundAuthenticated } = await import("../packages/fabric/src/federation.mjs");
  assert.equal(isInboundAuthenticated(envelope, LOCAL), true, "envelope must pass the existing Ed25519 verifier");

  // Registry send call carries the right recipient + contentId:
  const regBody = JSON.parse(sentCall.body);
  assert.equal(regBody.toDid, SIBLING);
  assert.equal(regBody.contentId, result.contentId);
});

test("M20: send REJECTS non-sibling DIDs", async () => {
  const handoff = makeHandoff(fakeTransport());
  await assert.rejects(
    () => handoff.sendHandoff({ toDid: STRANGER, payload: {}, signingKey: privateKey.export({ type: "pkcs8", format: "pem" }) }, { approved: true }),
    (e) => e.code === "non_sibling_did"
  );
});

// ── receive ──

async function deliverValid(handoff, transport, overrides = {}) {
  const payload = { plan: ["step-1"] };
  const encoded = encodeHandoff(payload);
  const toSign = { type: "ardyn_handoff", v: 1, codec: "GL1", encoded, fromDid: SIBLING, toDid: LOCAL, authenticated: true, authenticatedDid: SIBLING };
  const signature = signHandoffEnvelope(toSign, overrides.signerPrivate ?? privateKey.export({ type: "pkcs8", format: "pem" }));
  let envelope = { ...toSign, signature, signatureDid: SIBLING };
  if (overrides.tamper) envelope = overrides.tamper(envelope);
  const bytes = Buffer.from(JSON.stringify(envelope), "utf8");
  const contentId = createContentId(bytes);
  transport.store.set(contentId, { bytes, descriptor: descriptorFor(bytes, contentId) });
  transport.inbox.length = 0;
  return { delivery: {
    bytes, contentId, fromDid: overrides.deliveryFromDid ?? SIBLING, toDid: overrides.deliveryToDid ?? LOCAL,
    descriptor: descriptorFor(bytes, contentId),
    verification: { contentId, pieceCount: 1, totalSize: bytes.byteLength },
    encrypted: false, secure: false, envelope,
  }, payload };
}

test("M20: receive ACCEPTS a valid sibling-signed message and decodes the payload", async () => {
  const transport = fakeTransport();
  const handoff = makeHandoff(transport);
  const { delivery, payload } = await deliverValid(handoff, transport);
  const result = await handoff.handleDelivery(delivery, { approved: true });
  assert.equal(result.fromDid, SIBLING);
  assert.deepEqual(result.payload, payload, "GLOSSOPETRAE round-trip must be exact");
});

test("M20: receive REJECTS unknown DID / bad signature / wrong type / wrong recipient", async () => {
  const transport = fakeTransport();
  const handoff = makeHandoff(transport);
  const signerStranger = generateKeyPairSync("ed25519").privateKey.export({ type: "pkcs8", format: "pem" });

  const unknown = await deliverValid(handoff, transport, {
    tamper: (e) => ({ ...e, fromDid: STRANGER, authenticatedDid: STRANGER }),
    deliveryFromDid: STRANGER,
  });
  await assert.rejects(() => handoff.handleDelivery(unknown.delivery, { approved: true }), (e) => e.code === "non_sibling_did");

  const badSig = await deliverValid(handoff, transport, { tamper: (e) => ({ ...e, encoded: encodeHandoff({ tampered: true }) }) });
  await assert.rejects(() => handoff.handleDelivery(badSig.delivery, { approved: true }), (e) => e.code === "unauthenticated_sender");

  const forged = await deliverValid(handoff, transport, { signerPrivate: signerStranger });
  await assert.rejects(() => handoff.handleDelivery(forged.delivery, { approved: true }), (e) => e.code === "unauthenticated_sender");

  const wrongType = await deliverValid(handoff, transport, { tamper: (e) => ({ ...e, type: "something_else" }) });
  await assert.rejects(() => handoff.handleDelivery(wrongType.delivery, { approved: true }), (e) => e.code === "handoff_unknown_type");

  const otherRecipient = await deliverValid(handoff, transport, {
    tamper: (e) => ({ ...e, toDid: "did:multiverse:hub" }),
    deliveryToDid: "did:multiverse:hub",
  });
  await assert.rejects(() => handoff.handleDelivery(otherRecipient.delivery, { approved: true }), (e) => e.code === "wrong_recipient");
});

// ── GLOSSOPETRAE codec round-trip + covert-channel rejection ──

test("M20: GLOSSOPETRAE round-trips exactly and is deterministic", () => {
  const payload = { z: 1, a: { nested: [true, null, "text"] }, list: [3, 2, 1] };
  const enc1 = encodeHandoff(payload);
  const enc2 = encodeHandoff(payload);
  assert.equal(enc1, enc2, "encoding must be deterministic");
  assert.deepEqual(decodeHandoff(enc1), payload);
  assert.match(enc1, /^GL1:[0-9a-f]{16}:[a-z-]+$/);
});

test("M20: codec rejects covert-channel attempts (unknown token, non-canonical, invisible chars)", () => {
  const good = encodeHandoff({ ok: true });
  // unknown token injected into the stream
  const parts = good.split(":");
  assert.throws(() => decodeHandoff(`${parts[0]}:${parts[1]}:${parts[2]}-zzz`), /unknown_token/);
  // checksum mismatch
  assert.throws(() => decodeHandoff(`GL1:${"0".repeat(16)}:${parts[2]}`), /checksum mismatch/);
  // non-canonical re-encode: keys NOT in sorted order in the raw bytes.
  // JSON.parse keeps insertion order, but encodeHandoff() sorts keys, so the
  // canonical re-encode differs -> decode must reject as a covert channel.
  const sneakyCanonical = '{"b":1,"a":2}';
  const sneakyEncoded = (() => {
    const sum = createHash("sha256").update(sneakyCanonical, "utf8").digest("hex").slice(0, 16);
    const ONSETS = ["ba","de","fi","go","ha","ki","lo","mu","na","pe","ri","so","ta","vu","ze","cha"];
    const VOWELS = ["a","e","i","o"];
    const TAILS = ["","n","l","ra"];
    const toks = [...Buffer.from(sneakyCanonical, "utf8")].map(b => ONSETS[b & 15] + VOWELS[(b >> 4) & 3] + TAILS[(b >> 6) & 3]);
    return `GL1:${sum}:${toks.join("-")}`;
  })();
  assert.throws(() => decodeHandoff(sneakyEncoded), /non_canonical_encoding/, "key-order smuggling must be rejected");
  // invisible characters inside string values
  assert.throws(() => decodeHandoff(encodeHandoff({ s: "hidden\u200Bzero-width" })), /covert-channel characters/);
});

// ── streamed-bytes response-size cap (now that receive is live) ──

test("M20: response-size cap counts STREAMED bytes even when content-length lies/is absent", async () => {
  process.env.ARDYN_FABRIC_REGISTRY_TOKEN = "registry-token-test";
  const bigChunk = Buffer.alloc(1024, 0x41);
  const hostileFetch = async (url) => {
    if (String(url).includes("/v1/content/") && !String(url).includes("/descriptor")) {
      // no content-length header; stream 3 chunks of 1KB while cap says 2KB
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(bigChunk);
          controller.enqueue(bigChunk);
          controller.enqueue(bigChunk); // exceeds cap here
          controller.close();
        },
      });
      return { ok: true, status: 200, statusText: "OK", headers: { get: () => null }, body: stream };
    }
    if (String(url).includes("/descriptor")) {
      return jsonResponse(200, { contentId: "0".repeat(64), descriptor: descriptorFor(Buffer.alloc(3072), "0".repeat(64)) });
    }
    return jsonResponse(200, {});
  };
  const client = createFabricFederationClient({
    localDid: LOCAL,
    sidecarBaseUrl: "http://127.0.0.1:9",
    registryBaseUrl: "https://registry.example",
    registryToken: "t",
    sidecarToken: "t",
    maxResponseBytes: 2048,
    fetchImpl: hostileFetch,
  });
  await assert.rejects(
    () => client.getContent("0".repeat(64)),
    (e) => e.code === "response_too_large" && /streamed/.test(e.message)
  );
});
