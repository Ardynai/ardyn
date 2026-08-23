// M20: GLOSSOPETRAE-pattern handoff codec — Ardyn's OWN auditable implementation.
//
// Provenance: the elder-plinius/GLOSSOPETRAE conlang project is an architecture
// reference only (docs/phase-5-60-inter-agent-encoded-handoff-conformance.md).
// It is NOT vendored, copied, or imported. This module implements the *pattern* —
// deterministic dictionary substitution into pronounceable tokens — as a small,
// fully auditable codec for federation A2A handoffs.
//
// AUDITABILITY FLOOR (SECURITY-INVARIANTS §2): no steganography, no covert
// channels, no tokenizer exploits, no bypass paths. Everything here is:
//   - deterministic (same payload -> same encoding, always)
//   - injective (every byte maps to exactly one token; decode is exact inverse)
//   - self-describing (version header + sha256 checksum)
//   - covert-channel-rejecting on decode:
//       1. every token must be in the dictionary (unknown_token)
//       2. re-encoding the decoded payload must reproduce the input EXACTLY
//          (non_canonical_encoding) — kills whitespace/key-order/format smuggling
//       3. decoded strings are scanned for zero-width / bidi / control
//          characters (covert_chars) — classic stego vectors
import { createHash } from "node:crypto";

export const GLOSSOPETRAE_CODEC_VERSION = "GL1";

// 256 pronounceable tokens, bijective with bytes 0..255. Deterministic tables:
// token(b) = onset[b & 15] + vowel[(b >> 4) & 3] + tail[(b >> 6) & 3].
const ONSETS = ["ba","de","fi","go","ha","ki","lo","mu","na","pe","ri","so","ta","vu","ze","cha"];
const VOWELS = ["a","e","i","o"];
const TAILS = ["","n","l","ra"];

function buildDictionary() {
  const bytesToToken = new Array(256);
  const tokenToBytes = new Map();
  for (let b = 0; b < 256; b++) {
    const token = ONSETS[b & 15] + VOWELS[(b >> 4) & 3] + TAILS[(b >> 6) & 3];
    if (tokenToBytes.has(token)) throw new Error(`codec dictionary collision at byte ${b}`);
    bytesToToken[b] = token;
    tokenToBytes.set(token, b);
  }
  return { bytesToToken, tokenToBytes };
}

const dict = buildDictionary();

export function glossopetraeDictionarySize() {
  return 256;
}

export function isGlossopetraeToken(token) {
  return typeof token === "string" && dict.tokenToBytes.has(token);
}

// Canonical JSON: sorted keys, fixed separators. The single sanctioned form.
export function canonicalJson(value) {
  return JSON.stringify(sortValue(value));
}

function sortValue(value) {
  if (Array.isArray(value)) return value.map(sortValue);
  if (value && typeof value === "object") {
    const out = {};
    for (const k of Object.keys(value).sort()) out[k] = sortValue(value[k]);
    return out;
  }
  return value;
}

function checksumOf(canonical) {
  return createHash("sha256").update(canonical, "utf8").digest("hex").slice(0, 16);
}

// Invisible-character stego vectors (zero-width, bidi controls/overrides/
// isolates, variation selectors, tag characters, C0/C1 except \n\r\t).
// Credibility pass: adds variation selectors (FE00-FE0F), bidi isolates and
// overrides (2066-2069, 202A-202E), and tag chars (E0000-E007F) that were
// previously accepted — each is canonical-stable and therefore a working
// covert channel if allowed through.
const COVERT_CHAR_RE = /[\u200B-\u200F\u202A-\u202E\u205F\u2060-\u2069\uFE00-\uFE0F\uFEFF\u{E0000}-\u{E007F}\u{E0100}-\u{E01EF}\u00AD\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/u;

export function containsCovertChars(text) {
  return COVERT_CHAR_RE.test(String(text ?? ""));
}

function scanForCovertChars(value, path = "$") {
  if (typeof value === "string") {
    if (containsCovertChars(value)) {
      throw new Error(`GLOSSOPETRAE decode rejected: covert-channel characters in ${path}`);
    }
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((v, i) => scanForCovertChars(v, `${path}[${i}]`));
    return;
  }
  if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) {
      if (containsCovertChars(k)) throw new Error(`GLOSSOPETRAE decode rejected: covert-channel characters in key at ${path}`);
      scanForCovertChars(v, `${path}.${k}`);
    }
  }
}

// Encode a JSON-serializable payload into the auditable GL1 form:
//   GL1:<checksum16hex>:<token-token-token...>
export function encodeHandoff(payload) {
  const canonical = canonicalJson(payload ?? null);
  const checksum = checksumOf(canonical);
  const bytes = Buffer.from(canonical, "utf8");
  const tokens = [];
  for (const b of bytes) tokens.push(dict.bytesToToken[b]);
  return `${GLOSSOPETRAE_CODEC_VERSION}:${checksum}:${tokens.join("-")}`;
}

// Decode strictly. Throws (rejects) on ANY deviation from the canonical form.
export function decodeHandoff(encoded) {
  if (typeof encoded !== "string") {
    throw new Error("GLOSSOPETRAE decode rejected: input must be a string");
  }
  const parts = encoded.split(":");
  if (parts.length !== 3 || parts[0] !== GLOSSOPETRAE_CODEC_VERSION) {
    throw new Error(`GLOSSOPETRAE decode rejected: expected header "${GLOSSOPETRAE_CODEC_VERSION}:<checksum>:<tokens>"`);
  }
  const [, checksum, tokenBlob] = parts;

  let bytes;
  if (tokenBlob.length === 0) {
    bytes = Buffer.alloc(0);
  } else {
    bytes = Buffer.alloc(tokenBlob.split("-").length);
    let i = 0;
    for (const token of tokenBlob.split("-")) {
      const b = dict.tokenToBytes.get(token);
      if (b === undefined) {
        throw new Error(`GLOSSOPETRAE decode rejected: unknown_token "${String(token).slice(0, 24)}"`);
      }
      bytes[i++] = b;
    }
  }

  const canonical = bytes.toString("utf8");
  if (checksumOf(canonical) !== checksum) {
    throw new Error("GLOSSOPETRAE decode rejected: checksum mismatch");
  }

  let payload;
  try {
    payload = JSON.parse(canonical);
  } catch {
    throw new Error("GLOSSOPETRAE decode rejected: payload is not valid JSON");
  }

  // Covert-channel guard 1: canonical re-encode must reproduce the input EXACTLY.
  if (encodeHandoff(payload) !== encoded) {
    throw new Error("GLOSSOPETRAE decode rejected: non_canonical_encoding (possible covert channel)");
  }

  // Covert-channel guard 2: invisible/bidi/control characters anywhere.
  scanForCovertChars(payload);

  return payload;
}

// True when `encoded` is a well-formed GL1 envelope that decodes canonically.
export function isAuditableEncoding(encoded) {
  try {
    decodeHandoff(encoded);
    return true;
  } catch {
    return false;
  }
}
