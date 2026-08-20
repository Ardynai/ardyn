// B2-real: Real cryptographic Ed25519 signature verification + identity-file confinement in read path
import assert from "node:assert/strict";
import { generateKeyPairSync, sign, verify } from "node:crypto";
import { mkdtemp, rm, writeFile, symlink, mkdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

// Import the functions under test
const federationModule = await import("../packages/fabric/src/federation.mjs");
const { isInboundAuthenticated, loadFabricFederationConfigFromEnv } = federationModule;

// Helper: generate a real Ed25519 keypair
function genKeyPair() {
  const { publicKey, privateKey } = generateKeyPairSync("ed25519");
  return {
    publicKey: publicKey.export({ type: "spki", format: "der" }).toString("base64"),
    privateKey,
    publicKeyObj: publicKey,
    privateKeyObj: privateKey,
  };
}

// Helper: canonical signed payload (stable JSON of envelope excluding signature fields)
function canonicalPayload(envelope) {
  const { signature, signatureDid, ...rest } = envelope;
  return JSON.stringify(rest, Object.keys(rest).sort());
}

// Helper: sign an envelope with Ed25519
function signEnvelope(envelope, privateKeyObj) {
  const payload = Buffer.from(canonicalPayload(envelope), "utf8");
  const sig = sign(null, payload, privateKeyObj);
  return { ...envelope, signature: sig.toString("base64"), signatureDid: envelope.authenticatedDid };
}

// ── Real crypto verification tests ──

test("B2-real: valid Ed25519 signature verifies", () => {
  const kp = genKeyPair();
  // Register the public key for the DID
  process.env.ARDYN_FABRIC_SIBLING_KEYS = JSON.stringify({
    "did:multiverse:locus": kp.publicKey,
  });
  const envelope = {
    authenticated: true,
    authenticatedDid: "did:multiverse:locus",
    contentId: "abc123",
    fromDid: "did:multiverse:locus",
    toDid: "did:multiverse:ardyn",
  };
  const signed = signEnvelope(envelope, kp.privateKeyObj);
  const result = isInboundAuthenticated(signed, "did:multiverse:locus");
  assert.equal(result, true, "valid Ed25519 signature should verify");
  delete process.env.ARDYN_FABRIC_SIBLING_KEYS;
});

test("B2-real: tampered body fails verification", () => {
  const kp = genKeyPair();
  process.env.ARDYN_FABRIC_SIBLING_KEYS = JSON.stringify({
    "did:multiverse:locus": kp.publicKey,
  });
  const envelope = {
    authenticated: true,
    authenticatedDid: "did:multiverse:locus",
    contentId: "abc123",
    fromDid: "did:multiverse:locus",
    toDid: "did:multiverse:ardyn",
  };
  const signed = signEnvelope(envelope, kp.privateKeyObj);
  // Tamper the body after signing
  const tampered = { ...signed, contentId: "tampered" };
  const result = isInboundAuthenticated(tampered, "did:multiverse:locus");
  assert.equal(result, false, "tampered body should fail verification");
  delete process.env.ARDYN_FABRIC_SIBLING_KEYS;
});

test("B2-real: wrong key (signed with different keypair) fails", () => {
  const kp1 = genKeyPair();
  const kp2 = genKeyPair();
  process.env.ARDYN_FABRIC_SIBLING_KEYS = JSON.stringify({
    "did:multiverse:locus": kp1.publicKey, // registered key is kp1
  });
  const envelope = {
    authenticated: true,
    authenticatedDid: "did:multiverse:locus",
    contentId: "abc123",
    fromDid: "did:multiverse:locus",
    toDid: "did:multiverse:ardyn",
  };
  // Sign with kp2 (wrong key)
  const signed = signEnvelope(envelope, kp2.privateKeyObj);
  const result = isInboundAuthenticated(signed, "did:multiverse:locus");
  assert.equal(result, false, "wrong key should fail verification");
  delete process.env.ARDYN_FABRIC_SIBLING_KEYS;
});

test("B2-real: unknown DID (no key registered) fails", () => {
  process.env.ARDYN_FABRIC_SIBLING_KEYS = JSON.stringify({
    "did:multiverse:locus": "some-key",
  });
  const envelope = {
    authenticated: true,
    authenticatedDid: "did:multiverse:unknown",
    contentId: "abc123",
    fromDid: "did:multiverse:unknown",
    toDid: "did:multiverse:ardyn",
    signature: "fake-sig",
    signatureDid: "did:multiverse:unknown",
  };
  const result = isInboundAuthenticated(envelope, "did:multiverse:unknown");
  assert.equal(result, false, "unknown DID with no registered key should fail");
  delete process.env.ARDYN_FABRIC_SIBLING_KEYS;
});

test("B2-real: missing signature fails (no field-presence shortcut)", () => {
  const kp = genKeyPair();
  process.env.ARDYN_FABRIC_SIBLING_KEYS = JSON.stringify({
    "did:multiverse:locus": kp.publicKey,
  });
  const envelope = {
    authenticated: true,
    authenticatedDid: "did:multiverse:locus",
    contentId: "abc123",
    fromDid: "did:multiverse:locus",
    toDid: "did:multiverse:ardyn",
    // NO signature field
  };
  const result = isInboundAuthenticated(envelope, "did:multiverse:locus");
  assert.equal(result, false, "missing signature must fail");
  delete process.env.ARDYN_FABRIC_SIBLING_KEYS;
});

test("B2-real: garbage signature fails", () => {
  const kp = genKeyPair();
  process.env.ARDYN_FABRIC_SIBRIC_KEYS = JSON.stringify({
    "did:multiverse:locus": kp.publicKey,
  });
  process.env.ARDYN_FABRIC_SIBLING_KEYS = JSON.stringify({
    "did:multiverse:locus": kp.publicKey,
  });
  const envelope = {
    authenticated: true,
    authenticatedDid: "did:multiverse:locus",
    contentId: "abc123",
    fromDid: "did:multiverse:locus",
    toDid: "did:multiverse:ardyn",
    signature: "garbage-not-a-real-signature",
    signatureDid: "did:multiverse:locus",
  };
  const result = isInboundAuthenticated(envelope, "did:multiverse:locus");
  assert.equal(result, false, "garbage signature must fail");
  delete process.env.ARDYN_FABRIC_SIBLING_KEYS;
});

test("B2-real: no keys configured at all fails (fail-closed)", () => {
  delete process.env.ARDYN_FABRIC_SIBLING_KEYS;
  const envelope = {
    authenticated: true,
    authenticatedDid: "did:multiverse:locus",
    contentId: "abc123",
    fromDid: "did:multiverse:locus",
    toDid: "did:multiverse:ardyn",
    signature: "some-sig",
    signatureDid: "did:multiverse:locus",
  };
  const result = isInboundAuthenticated(envelope, "did:multiverse:locus");
  assert.equal(result, false, "no keys configured = fail closed");
});

// ── Identity-file confinement in the real read path ──

test("B2-real: didFromIdentityFile via config loader rejects absolute path", () => {
  assert.throws(
    () => loadFabricFederationConfigFromEnv({
      ...process.env,
      ARDYN_FABRIC_IDENTITY_FILE: "/etc/passwd",
    }),
    /absolute|unconfined/i,
    "absolute path must be rejected in the real read path"
  );
});

test("B2-real: didFromIdentityFile via config loader rejects ../ traversal", () => {
  assert.throws(
    () => loadFabricFederationConfigFromEnv({
      ...process.env,
      ARDYN_FABRIC_IDENTITY_FILE: "../../../etc/passwd",
    }),
    /traversal|unconfined/i,
    "../ traversal must be rejected in the real read path"
  );
});

test("B2-real: didFromIdentityFile via config loader rejects symlink outside base dir", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-b2-symlink-real-"));
  const origCwd = process.cwd();
  try {
    const target = join(tmpdir(), "ardyn-b2-target-real.txt");
    await writeFile(target, "did:multiverse:evil");
    const symlinkPath = join(scratch, "evil-link");
    await symlink(target, symlinkPath);
    process.chdir(scratch);
    process.env.ARDYN_FABRIC_IDENTITY_BASE_DIR = scratch;
    assert.throws(
      () => loadFabricFederationConfigFromEnv({
        ...process.env,
        ARDYN_FABRIC_IDENTITY_FILE: "evil-link",
      }),
      /unconfined|outside/i,
      "symlink outside base dir must be rejected in the real read path"
    );
    delete process.env.ARDYN_FABRIC_IDENTITY_BASE_DIR;
    await rm(target, { force: true });
  } finally {
    process.chdir(origCwd);
    await rm(scratch, { recursive: true, force: true });
  }
});

test("B2-real: didFromIdentityFile via config loader accepts valid relative path in base dir", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-b2-valid-real-"));
  const origCwd = process.cwd();
  try {
    const baseDir = join(scratch, ".ardyn");
    await mkdir(baseDir, { recursive: true });
    const idFile = join(baseDir, "identity.txt");
    await writeFile(idFile, "did:multiverse:ardyn");
    process.chdir(scratch);
    process.env.ARDYN_FABRIC_IDENTITY_BASE_DIR = ".ardyn";
    const config = loadFabricFederationConfigFromEnv({
      ...process.env,
      ARDYN_FABRIC_IDENTITY_FILE: ".ardyn/identity.txt",
    });
    assert.equal(config.localDid, "did:multiverse:ardyn");
    delete process.env.ARDYN_FABRIC_IDENTITY_BASE_DIR;
  } finally {
    process.chdir(origCwd);
    await rm(scratch, { recursive: true, force: true });
  }
});