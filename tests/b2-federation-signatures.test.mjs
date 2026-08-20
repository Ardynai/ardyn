// B2: Real per-message signature verification + identity-file path confinement
import assert from "node:assert/strict";
import { generateKeyPairSync, sign } from "node:crypto";
import { mkdtemp, writeFile, symlink, rm, mkdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import {
  isInboundAuthenticated,
  confineIdentityFilePath,
  FABRIC_FEDERATION_IDENTITY_ALLOWED_BASE_DIR,
} from "../packages/fabric/src/federation.mjs";

// Helper: generate a real Ed25519 keypair and sign an envelope
function genKeyPair() {
  const { publicKey, privateKey } = generateKeyPairSync("ed25519");
  return {
    publicKey: publicKey.export({ type: "spki", format: "der" }).toString("base64"),
    privateKey,
    publicKeyObj: publicKey,
    privateKeyObj: privateKey,
  };
}

function canonicalPayload(envelope) {
  const { signature, signatureDid, ...rest } = envelope;
  return JSON.stringify(rest, Object.keys(rest).sort());
}

function signEnvelope(envelope, privateKeyObj) {
  const payload = Buffer.from(canonicalPayload(envelope), "utf8");
  const sig = sign(null, payload, privateKeyObj);
  return { ...envelope, signature: sig.toString("base64"), signatureDid: envelope.authenticatedDid };
}

test("B2: isInboundAuthenticated rejects self-asserted authenticated* fields without signature", () => {
  const msg = {
    authenticated: true,
    authenticatedDid: "did:multiverse:ardyn",
  };
  assert.equal(isInboundAuthenticated(msg, "did:multiverse:ardyn"), false);
});

test("B2: isInboundAuthenticated rejects mismatched signature", () => {
  const msg = {
    authenticated: true,
    authenticatedDid: "did:multiverse:ardyn",
    signature: "deadbeef",
    signatureDid: "did:multiverse:locus",
  };
  assert.equal(isInboundAuthenticated(msg, "did:multiverse:ardyn"), false);
});

test("B2: isInboundAuthenticated accepts valid signature from matching DID", () => {
  const kp = genKeyPair();
  process.env.ARDYN_FABRIC_SIBLING_KEYS = JSON.stringify({
    "did:multiverse:ardyn": kp.publicKey,
  });
  const envelope = {
    authenticated: true,
    authenticatedDid: "did:multiverse:ardyn",
    fromDid: "did:multiverse:ardyn",
  };
  const signed = signEnvelope(envelope, kp.privateKeyObj);
  assert.equal(isInboundAuthenticated(signed, "did:multiverse:ardyn"), true);
  delete process.env.ARDYN_FABRIC_SIBLING_KEYS;
});

test("B2: isInboundAuthenticated rejects when authenticated is false", () => {
  const msg = {
    authenticated: false,
    authenticatedDid: "did:multiverse:ardyn",
    signature: "sha256:abc123",
    signatureDid: "did:multiverse:ardyn",
  };
  assert.equal(isInboundAuthenticated(msg, "did:multiverse:ardyn"), false);
});

test("B2: confineIdentityFilePath rejects absolute paths outside allowed base dir", () => {
  assert.throws(
    () => confineIdentityFilePath("/etc/passwd"),
    /absolute.*not.*allowed|outside.*base/i,
    "must reject absolute paths outside allowed base dir"
  );
});

test("B2: confineIdentityFilePath rejects ../ traversal", () => {
  assert.throws(
    () => confineIdentityFilePath("../../../etc/passwd"),
    /traversal|outside.*base/i,
    "must reject ../ traversal"
  );
});

test("B2: confineIdentityFilePath rejects symlinks pointing outside base dir", async () => {
  const scratch = await mkdtemp(join(tmpdir(), "ardyn-b2-symlink-"));
  const origCwd = process.cwd();
  try {
    const target = join(tmpdir(), "ardyn-b2-target.txt");
    await writeFile(target, "secret");
    const symlinkPath = join(scratch, "evil-symlink");
    await symlink(target, symlinkPath);
    process.chdir(scratch);
    process.env.ARDYN_FABRIC_IDENTITY_BASE_DIR = scratch;
    assert.throws(
      () => confineIdentityFilePath("evil-symlink"),
      /unconfined|outside/i,
      "must reject symlinks pointing outside allowed base dir"
    );
    delete process.env.ARDYN_FABRIC_IDENTITY_BASE_DIR;
    await rm(target, { force: true });
  } finally {
    process.chdir(origCwd);
    await rm(scratch, { recursive: true, force: true });
  }
});

test("B2: confineIdentityFilePath accepts relative paths within allowed base dir", () => {
  process.env.ARDYN_FABRIC_IDENTITY_BASE_DIR = ".";
  const result = confineIdentityFilePath("README.md");
  assert.ok(result, "should accept a relative path within base dir");
  delete process.env.ARDYN_FABRIC_IDENTITY_BASE_DIR;
});