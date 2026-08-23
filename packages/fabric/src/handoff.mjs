// M20: Federation A2A handoff orchestration — encode + sign + send / receive +
// verify + decode, reusing the hardened federation transport (packages/fabric/
// src/federation.mjs). NO transport is implemented here.
//
// Gating lives in the CLI/host surface (--enable-federation-exchange --approve);
// this module refuses to run without an explicit `approved: true` option —
// defense in depth on top of the CLI gate (default OFF).
//
// Envelope contract (receiver-side auth = federation.mjs isInboundAuthenticated):
//   { type:"ardyn_handoff", v:1, codec:"GL1", fromDid, toDid, encoded,
//     authenticated:true, authenticatedDid:<fromDid>, signature:<b64 Ed25519> }
// The signature covers the canonical JSON of the envelope minus signature fields,
// exactly matching federation.mjs canonicalSignedPayload() so the EXISTING
// verifier gates the receive path unchanged.
//
// Sibling floor: recipients/senders must be in the closed sibling DID set
// (hub, kortex-audio, locus, custos, somatic, aegis, praxis, kybernetes + ardyn).
import { sign as cryptoSign } from "node:crypto";
import { readFileSync } from "node:fs";
import {
  FABRIC_FEDERATION_CLOSED_SIBLING_DIDS,
  FABRIC_FEDERATION_DEFAULT_LOCAL_DID,
  FabricFederationError,
  isInboundAuthenticated,
} from "./federation.mjs";
import { decodeHandoff, encodeHandoff } from "../../core/src/glossopetrae-codec.mjs";

const HANDOFF_TYPE = "ardyn_handoff";
const HANDOFF_VERSION = 1;
export const FEDERATION_HANDOFF_SIBLING_DIDS = Object.freeze(
  FABRIC_FEDERATION_CLOSED_SIBLING_DIDS.filter((did) => did !== FABRIC_FEDERATION_DEFAULT_LOCAL_DID),
);

function assertApproved(options) {
  if (!options || options.approved !== true) {
    throw new FabricFederationError(
      "Federation A2A exchange requires explicit approval (--enable-federation-exchange --approve). Nothing was sent or received.",
      { code: "exchange_not_approved" },
    );
  }
}

function requireSibling(did, direction) {
  if (!FABRIC_FEDERATION_CLOSED_SIBLING_DIDS.includes(did)) {
    throw new FabricFederationError(`Federation handoff ${direction} DID is not in the closed sibling allowlist.`, {
      code: "non_sibling_did",
    });
  }
}

// Signing key: env file path or gitignored config/secret/federation-keys.json
// entry "<did>.private" (base64 PKCS8 DER). Never logged, never committed.
function loadSigningKey(localDid) {
  const keyFile = process.env.ARDYN_FABRIC_SIGNING_KEY_FILE;
  if (keyFile) {
    return readFileSync(keyFile, "utf8");
  }
  try {
    const keysPath = process.env.ARDYN_FABRIC_SECRET_KEYS_FILE ?? "config/secret/federation-keys.json";
    const parsed = JSON.parse(readFileSync(keysPath, "utf8"));
    const key = parsed[`${localDid}.private`] ?? parsed.privateKey;
    if (typeof key === "string" && key.length > 0) return key;
  } catch {
    // fall through
  }
  throw new FabricFederationError(
    `No Ed25519 signing key for ${localDid}: set ARDYN_FABRIC_SIGNING_KEY_FILE or add "${localDid}.private" to config/secret/federation-keys.json.`,
    { code: "signing_key_missing" },
  );
}

// Mirror of federation.mjs canonicalSignedPayload(): envelope minus signature
// fields, recursively canonicalized (sorted keys at ALL depths — the old array-
// replacer form left nested fields unsigned). MUST stay byte-identical with the
// federation.mjs copy (pinned by tests/m20-federation-a2a.test.mjs).
function canonicalJson(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (value && typeof value === "object") {
    const body = Object.keys(value).sort()
      .map((k) => `${JSON.stringify(k)}:${canonicalJson(value[k])}`)
      .join(",");
    return `{${body}}`;
  }
  return JSON.stringify(value) ?? "null";
}

function canonicalSignedPayload(envelope) {
  const { signature, signatureDid, ...rest } = envelope;
  return canonicalJson(rest);
}

export function signHandoffEnvelope(envelope, signingKeyPemOrDerBase64) {
  let key = signingKeyPemOrDerBase64;
  if (!key) throw new FabricFederationError("Signing key required.", { code: "signing_key_missing" });
  // base64 DER convenience: if it isn't PEM, wrap raw b64 as PKCS8 DER
  if (!key.includes("-----BEGIN")) {
    key = Buffer.from(key, "base64");
  }
  const payload = Buffer.from(canonicalSignedPayload(envelope), "utf8");
  // Ed25519 (like federation.mjs's verify) uses null digest.
  return cryptoSign(null, payload, key).toString("base64");
}

export function createFederationHandoff({ client, localDid, glossopetrae } = {}) {
  if (!client || typeof client.send !== "function" || typeof client.startReceiver !== "function") {
    throw new FabricFederationError("createFederationHandoff requires the fabric federation client.", {
      code: "invalid_client",
    });
  }
  const did = localDid ?? FABRIC_FEDERATION_DEFAULT_LOCAL_DID;
  const codec = glossopetrae ?? { encode: encodeHandoff, decode: decodeHandoff };
  if (typeof codec.encode !== "function" || typeof codec.decode !== "function") {
    throw new FabricFederationError("glossopetrae codec must provide encode() and decode().", {
      code: "invalid_codec",
    });
  }

  return {
    siblingDids: [...FEDERATION_HANDOFF_SIBLING_DIDS],

    // SEND: payload object -> GL1 encode -> sign -> transport send.
    async sendHandoff({ toDid, payload, signingKey } = {}, options = {}) {
      assertApproved(options);
      requireSibling(toDid, "recipient");
      const encoded = codec.encode(payload ?? null);
      // Sign the EXACT final envelope minus signature fields — this is what
      // federation.mjs isInboundAuthenticated() recomputes on receive.
      const toSign = {
        type: HANDOFF_TYPE,
        v: HANDOFF_VERSION,
        codec: "GL1",
        encoded,
        fromDid: did,
        toDid,
        authenticated: true,
        authenticatedDid: did,
      };
      const signature = signHandoffEnvelope(toSign, signingKey ?? options.signingKey ?? loadSigningKey(did));
      const envelope = {
        ...toSign,
        signature,
        signatureDid: did,
      };
      const sent = await client.send(toDid, Buffer.from(JSON.stringify(envelope), "utf8"), {
        fetchImpl: options.fetchImpl,
      });
      return { contentId: sent.contentId, toDid, encoded };
    },

    // RECEIVE-side handler for the federation receiver loop. The transport layer
    // ALREADY enforces isInboundAuthenticated + allowlist + contentId
    // re-verification; we enforce them AGAIN here (defense in depth), then
    // decode canonically and hand off the plaintext payload.
    async handleDelivery(delivery, options = {}) {
      assertApproved(options);
      let envelope;
      try {
        envelope = JSON.parse(delivery.bytes.toString("utf8"));
      } catch {
        throw new FabricFederationError("Handoff delivery is not valid JSON.", {
          code: "handoff_invalid_json",
        });
      }
      if (envelope?.type !== HANDOFF_TYPE || envelope?.v !== HANDOFF_VERSION) {
        throw new FabricFederationError("Delivery is not an ardyn_handoff envelope.", {
          code: "handoff_unknown_type",
        });
      }
      const fromDid = delivery.fromDid ?? envelope.fromDid;
      requireSibling(fromDid, "sender");
      if (envelope.toDid !== did && delivery.toDid !== did) {
        throw new FabricFederationError("Handoff is not addressed to this DID.", {
          code: "wrong_recipient",
        });
      }
      // Real Ed25519 verification via the EXISTING invariant — no shortcuts.
      if (!isInboundAuthenticated(envelope, fromDid)) {
        throw new FabricFederationError("Handoff sender failed Ed25519 authentication.", {
          code: "unauthenticated_sender",
        });
      }
      // Covert-channel rejection happens inside decode (unknown tokens,
      // non-canonical re-encode, invisible characters).
      const payload = codec.decode(envelope.encoded);
      return { fromDid, payload, contentId: delivery.contentId, verification: delivery.verification };
    },
  };
}
