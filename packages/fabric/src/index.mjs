import { createHash } from "node:crypto";

export const FABRIC_SCHEMA_VERSION = "1.0.0";

export const DATA_TYPES = new Set([
  "model",
  "asset-3d",
  "asset-audio",
  "asset-video",
  "asset-image",
  "dataset",
  "document",
  "theme",
]);

export const CODE_TYPES = new Set([
  "skill",
  "mcp-server",
  "plugin",
  "connector",
  "agent",
]);

export const FABRIC_HARNESSES = new Set([
  "*",
  "locus",
  "multiverse",
  "kortex-audio",
  "locus-evolution-lab",
  "somatic",
  "ardyn",
]);

export const PUBLIC_LICENSE_ALLOWLIST = new Set([
  "MIT",
  "Apache-2.0",
  "BSD-2-Clause",
  "BSD-3-Clause",
  "ISC",
  "MPL-2.0",
  "LGPL-3.0-or-later",
  "GPL-2.0-or-later",
  "GPL-3.0-or-later",
  "AGPL-3.0-or-later",
  "Unlicense",
  "CC0-1.0",
  "CC-BY-4.0",
  "CC-BY-SA-4.0",
  "CC-BY-NC-4.0",
  "LicenseRef-Multiverse-Open",
]);

const firstPartyRootKey = {
  keyId: "b7305b9b5d1f99f6075554988945cefddcff46279be2c136d34a0fac8e48a009",
  algo: "ed25519",
  publicKey: "5JA0v8x1iWZOfM6E63AsJM7jJgZtOeFDI/1QG/ccU1s=",
  status: "active",
  validFrom: "2026-01-01T00:00:00Z",
  validUntil: null,
};

export const FIRST_PARTY_KEYRING = Object.freeze({
  schemaVersion: "1.0.0",
  version: 1,
  expires: "2027-05-28T00:00:00Z",
  rootKeys: [firstPartyRootKey],
  rootThreshold: 1,
  publishers: [
    {
      namespace: "ardyn",
      displayName: "Ardynai",
      threshold: 1,
      keys: [firstPartyRootKey],
    },
  ],
  signatures: [
    {
      keyId: firstPartyRootKey.keyId,
      algo: "ed25519",
      sig: "vLTR+ncUn+phCtno96d7rmwIKg7cNcmkiuPgKlpUHsjZ6DukpCgovO4/amDjI1/xCkU7lW//cpqcvNX/sXVcAA==",
    },
  ],
});

const idSegmentPattern = /^[a-z0-9](?:[a-z0-9._-]{0,126}[a-z0-9])$/;
const semverPattern =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/;
const sha256Pattern = /^[a-f0-9]{64}$/;
const infohashPattern = /^[a-f0-9]{40}$/;
const infohashV2Pattern = /^[a-f0-9]{64}$/;
const keyIdPattern = /^[a-f0-9]{64}$/;
const rfc3339UtcPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
const spdxOrLicenseRefPattern = /^(?:[A-Za-z0-9.-]+|LicenseRef-[A-Za-z0-9.-]+)$/;

const obligationHints = [
  [/CC-BY/i, "Attribution required."],
  [/-NC/i, "Non-commercial use restriction applies."],
  [/^(?:GPL|AGPL|LGPL)/i, "Copyleft license obligations apply."],
  [/CC-BY-SA/i, "Share-alike obligations apply."],
];

export function parseFabricJson(json) {
  assertIntegerLexemes(json);
  return JSON.parse(json);
}

export function canonicalize(value) {
  return serializeCanonical(value);
}

export function signingPayload(value) {
  if (!isPlainObject(value)) {
    throw new Error("Signed fabric value must be an object.");
  }

  return Buffer.from(canonicalize({ ...value, signatures: [] }), "utf8");
}

export function sha256Hex(value) {
  return createHash("sha256").update(value).digest("hex");
}

export function hashObject(value) {
  return sha256Hex(Buffer.from(canonicalize(value), "utf8"));
}

export function manifestDigest(manifest) {
  return `sha256:${hashObject(manifest)}`;
}

export function keyIdForPublicKey(publicKey) {
  if (!Buffer.isBuffer(publicKey) || publicKey.length !== 32) {
    throw new Error("Ed25519 public key must be raw 32 bytes.");
  }

  return sha256Hex(publicKey);
}

export function validatePackManifest(manifest) {
  const errors = [];

  if (!isPlainObject(manifest)) {
    return { errors: ["manifest must be an object"], valid: false };
  }

  requireString(manifest.schemaVersion, "schemaVersion", errors);
  if (manifest.schemaVersion && !semverPattern.test(manifest.schemaVersion)) {
    errors.push("schemaVersion must be SemVer.");
  }
  if (manifest.schemaVersion && majorOf(manifest.schemaVersion) > 1) {
    errors.push("schemaVersion major is newer than this implementation.");
  }

  validateId(manifest.id, "id", errors);
  requireString(manifest.name, "name", errors);
  if (manifest.name && (manifest.name.length < 1 || manifest.name.length > 200)) {
    errors.push("name must be 1-200 characters.");
  }
  requireString(manifest.version, "version", errors);
  if (manifest.version && !semverPattern.test(manifest.version)) {
    errors.push("version must be SemVer 2.0.0.");
  }
  if (manifest.class !== "data" && manifest.class !== "code") {
    errors.push('class must be "data" or "code".');
  }
  if (
    (manifest.class === "data" && !DATA_TYPES.has(manifest.type)) ||
    (manifest.class === "code" && !CODE_TYPES.has(manifest.type))
  ) {
    errors.push("type must be legal for its class.");
  }
  requireString(manifest.license, "license", errors);
  if (manifest.license && !spdxOrLicenseRefPattern.test(manifest.license)) {
    errors.push("license must be one SPDX id or LicenseRef token.");
  }
  if (typeof manifest.description === "string" && manifest.description.length > 2000) {
    errors.push("description must be 2000 characters or less.");
  }

  validatePublisher(manifest, errors);
  validateHarnesses(manifest.harnesses, errors);
  validateTransport(manifest.transport, errors);
  validateFiles(manifest.files, errors);
  validateDependencies(manifest.dependencies, errors);
  validateTimestamp(manifest.createdAt, "createdAt", errors);
  validateSignatures(manifest.signatures, errors);

  return { errors, valid: errors.length === 0 };
}

export function validateCatalog(catalog) {
  const errors = [];

  if (!isPlainObject(catalog)) {
    return { errors: ["catalog must be an object"], valid: false };
  }
  requireString(catalog.schemaVersion, "catalog.schemaVersion", errors);
  if (catalog.schemaVersion && !semverPattern.test(catalog.schemaVersion)) {
    errors.push("catalog.schemaVersion must be SemVer.");
  }
  if (catalog.schemaVersion && majorOf(catalog.schemaVersion) > 1) {
    errors.push("catalog schemaVersion major is newer than this implementation.");
  }
  if (!FABRIC_HARNESSES.has(catalog.harness) || catalog.harness === "*") {
    errors.push("catalog harness must be a known concrete harness.");
  }
  validateTimestamp(catalog.publishedAt, "publishedAt", errors);
  validateSignatures(catalog.signatures, errors);
  if (!Array.isArray(catalog.packs)) {
    errors.push("packs must be an array.");
  } else {
    let lastKey = "";
    const seen = new Set();
    for (const entry of catalog.packs) {
      if (!isPlainObject(entry)) {
        errors.push("catalog packs entries must be objects.");
        continue;
      }
      validateId(String(entry.id), "pack.id", errors);
      if (!semverPattern.test(String(entry.version))) {
        errors.push("pack.version must be SemVer.");
      }
      if (entry.class !== "data" && entry.class !== "code") {
        errors.push("pack.class must be data or code.");
      }
      if (!DATA_TYPES.has(entry.type) && !CODE_TYPES.has(entry.type)) {
        errors.push("pack.type must be a known fabric type.");
      }
      if (!spdxOrLicenseRefPattern.test(String(entry.license))) {
        errors.push("pack.license must be SPDX or LicenseRef.");
      }
      if (typeof entry.manifestDigest !== "string" || !/^sha256:[a-f0-9]{64}$/.test(entry.manifestDigest)) {
        errors.push("pack.manifestDigest must be sha256:<64hex>.");
      }
      if (typeof entry.infohash !== "string" || !infohashPattern.test(entry.infohash)) {
        errors.push("pack.infohash must be 40 lowercase hex.");
      }
      if (typeof entry.publisherKeyId !== "string" || !keyIdPattern.test(entry.publisherKeyId)) {
        errors.push("pack.publisherKeyId must be 64 lowercase hex.");
      }
      if (!isFabricInteger(entry.size)) {
        errors.push("pack.size must be an integer.");
      }

      const key = `${entry.id}@${entry.version}`;
      if (seen.has(key)) {
        errors.push(`duplicate catalog entry ${key}.`);
      }
      seen.add(key);
      if (lastKey && key.localeCompare(lastKey) < 0) {
        errors.push("packs must be sorted by id/version.");
      }
      lastKey = key;
    }
  }

  return { errors, valid: errors.length === 0 };
}

export function validateKeyringShape(keyring) {
  const errors = validateKeyringErrors(keyring);

  return {
    errors,
    valid: errors.length === 0,
  };
}

export function evaluateLicensePolicy(manifest) {
  const obligation = obligationFor(manifest.license);
  const publicAllowed = PUBLIC_LICENSE_ALLOWLIST.has(manifest.license);
  const privateAllowed = isPrivateOnlyLicenseAllowed(manifest);

  const installAllowed =
    publicAllowed ||
    privateAllowed ||
    /^LicenseRef-Internal-[A-Za-z0-9.-]+$/.test(manifest.license);
  const install = installAllowed
    ? { allowed: true, obligation }
    : {
        allowed: false,
        reason: `License ${manifest.license} is not allowed for install.`,
      };

  if (publicAllowed) {
    return {
      catalog: { allowed: true, obligation },
      install,
      publish: { allowed: true, obligation },
      seed: { allowed: true, obligation },
    };
  }

  if (privateAllowed) {
    return {
      catalog: {
        allowed: false,
        reason: "Private-only licenses must not appear in public catalogs.",
      },
      install,
      publish: { allowed: true, obligation },
      seed: {
        allowed: false,
        reason: "Private-only licenses must not be seeded into public swarms.",
      },
    };
  }

  const reason = `License ${manifest.license} is not redistribution-allowlisted.`;
  return {
    catalog: { allowed: false, reason },
    install,
    publish: { allowed: false, reason },
    seed: { allowed: false, reason },
  };
}

export function packIdNamespace(id) {
  return String(id).split("/", 2)[0] ?? "";
}

export function isPathPayloadSafe(value) {
  return pathConfinementError(value) === null;
}

export function pathConfinementError(value) {
  if (!value) {
    return "path must not be empty";
  }
  if (value.startsWith("/") || value.startsWith("\\")) {
    return "path must be relative";
  }
  if (/^[A-Za-z]:/.test(value)) {
    return "path must not contain a Windows drive";
  }
  if (value.includes("\\") || value.includes("\0")) {
    return "path must use POSIX separators and contain no NUL";
  }
  if (value.split("/").some((segment) => segment === "." || segment === ".." || !segment)) {
    return "path must not contain empty, . or .. segments";
  }
  return null;
}

function assertIntegerLexemes(json) {
  let index = 0;
  let inString = false;
  let escaped = false;

  while (index < json.length) {
    const character = json[index] ?? "";

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (character === "\\") {
        escaped = true;
      } else if (character === '"') {
        inString = false;
      }
      index += 1;
      continue;
    }

    if (character === '"') {
      inString = true;
      index += 1;
      continue;
    }

    if (character === "-" || isDigit(character)) {
      const start = index;
      index += 1;
      while (index < json.length && /[0-9eE.+-]/.test(json[index] ?? "")) {
        index += 1;
      }
      const token = json.slice(start, index);
      if (!/^(?:0|[1-9]\d*)$/.test(token)) {
        throw new Error("Fabric JSON uses integers only with no exponents or leading zeros.");
      }
      continue;
    }

    index += 1;
  }
}

function serializeCanonical(value) {
  if (value === null) {
    return "null";
  }

  if (typeof value === "string") {
    return JSON.stringify(value);
  }

  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }

  if (typeof value === "number") {
    if (!isFabricInteger(value)) {
      throw new Error("Fabric JSON numbers must be integers in [0, 2^53-1].");
    }
    return String(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map((item) => serializeCanonical(item)).join(",")}]`;
  }

  if (isPlainObject(value)) {
    const record = value;
    return `{${Object.keys(record)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${serializeCanonical(record[key])}`)
      .join(",")}}`;
  }

  throw new Error(`Unsupported fabric JSON value: ${typeof value}`);
}

function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isFabricInteger(value) {
  return (
    typeof value === "number" &&
    Number.isSafeInteger(value) &&
    value >= 0 &&
    value <= Number.MAX_SAFE_INTEGER
  );
}

function requireString(value, field, errors) {
  if (typeof value !== "string" || value.length === 0) {
    errors.push(`${field} is required.`);
  }
}

function validateId(value, field, errors) {
  if (typeof value !== "string") {
    errors.push(`${field} must be a string.`);
    return;
  }

  const parts = value.split("/");
  if (
    parts.length !== 2 ||
    !idSegmentPattern.test(parts[0] ?? "") ||
    !idSegmentPattern.test(parts[1] ?? "")
  ) {
    errors.push(`${field} must be <namespace>/<name> with canonical id segments.`);
  }
}

function validatePublisher(manifest, errors) {
  if (!isPlainObject(manifest.publisher)) {
    errors.push("publisher is required.");
    return;
  }

  if (!idSegmentPattern.test(manifest.publisher.namespace)) {
    errors.push("publisher.namespace must be a lowercase id token.");
  }
  if (packIdNamespace(manifest.id) !== manifest.publisher.namespace) {
    errors.push("publisher.namespace must equal the manifest id namespace.");
  }
  requireString(manifest.publisher.displayName, "publisher.displayName", errors);
  if (!keyIdPattern.test(manifest.publisher.keyId)) {
    errors.push("publisher.keyId must be 64 lowercase hex.");
  }
}

function validateHarnesses(value, errors) {
  if (!Array.isArray(value) || value.length === 0) {
    errors.push("harnesses must be a non-empty array.");
    return;
  }

  const seen = new Set();
  for (const harness of value) {
    if (!FABRIC_HARNESSES.has(harness)) {
      errors.push(`unknown harness ${String(harness)}.`);
    }
    if (seen.has(String(harness))) {
      errors.push("harnesses must not contain duplicates.");
    }
    seen.add(String(harness));
  }
  if (seen.has("*") && seen.size > 1) {
    errors.push('harnesses wildcard "*" must appear alone.');
  }
}

function validateTransport(value, errors) {
  if (!isPlainObject(value)) {
    errors.push("transport is required.");
    return;
  }
  if (typeof value.infohash !== "string" || !infohashPattern.test(value.infohash)) {
    errors.push("transport.infohash must be a 40-char lowercase hex BitTorrent v1 infohash.");
  }
  if (typeof value.infohashV2 === "string" && !infohashV2Pattern.test(value.infohashV2)) {
    errors.push("transport.infohashV2 must be 64 lowercase hex.");
  }
  if (typeof value.magnet !== "string" || !value.magnet.startsWith("magnet:?")) {
    errors.push("transport.magnet must be a magnet URI.");
    return;
  }

  const params = new URLSearchParams(value.magnet.slice("magnet:?".length));
  const xt = params.get("xt") ?? "";
  if (value.infohash && xt.toLowerCase() !== `urn:btih:${value.infohash}`) {
    errors.push("transport.magnet xt must match transport.infohash.");
  }
  const webSeeds = params.getAll("ws");
  if (webSeeds.length === 0 || webSeeds.some((seed) => !seed.toLowerCase().startsWith("https://"))) {
    errors.push("transport.magnet must include an https WebSeed ws parameter.");
  }
  const trackers = params.getAll("tr");
  if (trackers.some((tracker) => !tracker.toLowerCase().startsWith("wss://"))) {
    errors.push("transport.magnet tr parameters must use wss://.");
  }
}

function validateFiles(files, errors) {
  if (!Array.isArray(files) || files.length === 0) {
    errors.push("files must be a non-empty array.");
    return;
  }

  const seen = new Set();
  let previous = "";
  for (const file of files) {
    if (!isPlainObject(file)) {
      errors.push("files entries must be objects.");
      continue;
    }
    const path = file.path;
    if (typeof path !== "string" || pathConfinementError(path)) {
      errors.push(`files[].path is invalid: ${pathConfinementError(String(path)) ?? path}`);
    }
    if (typeof path === "string") {
      if (seen.has(path)) {
        errors.push(`duplicate file path ${path}.`);
      }
      if (previous && path.localeCompare(previous) < 0) {
        errors.push("files must be sorted by path ascending.");
      }
      seen.add(path);
      previous = path;
    }
    if (typeof file.sha256 !== "string" || !sha256Pattern.test(file.sha256)) {
      errors.push("files[].sha256 must be 64 lowercase hex.");
    }
    if (!isFabricInteger(file.size)) {
      errors.push("files[].size must be an integer byte count.");
    }
    if (typeof file.installTarget !== "string" || pathConfinementError(file.installTarget)) {
      errors.push("files[].installTarget must be a confined POSIX relative path.");
    }
    if (file.executable !== undefined && typeof file.executable !== "boolean") {
      errors.push("files[].executable must be boolean when present.");
    }
  }
}

function validateDependencies(dependencies, errors) {
  if (dependencies === undefined) {
    return;
  }
  if (!Array.isArray(dependencies)) {
    errors.push("dependencies must be an array.");
    return;
  }
  let previous = "";
  for (const dependency of dependencies) {
    validateId(dependency.id, "dependencies[].id", errors);
    requireString(dependency.version, "dependencies[].version", errors);
    if (previous && dependency.id.localeCompare(previous) < 0) {
      errors.push("dependencies must be sorted by id.");
    }
    previous = dependency.id;
  }
}

function validateTimestamp(value, field, errors) {
  if (typeof value !== "string" || !rfc3339UtcPattern.test(value)) {
    errors.push(`${field} must be RFC 3339 UTC with Z and second precision.`);
  }
}

function validateSignatures(signatures, errors) {
  if (!Array.isArray(signatures)) {
    errors.push("signatures must be an array.");
    return;
  }
  let previous = "";
  for (const signature of signatures) {
    if (!isPlainObject(signature)) {
      errors.push("signatures entries must be objects.");
      continue;
    }
    if (signature.algo !== "ed25519") {
      errors.push("signature algo must be ed25519.");
    }
    if (typeof signature.keyId !== "string" || !keyIdPattern.test(signature.keyId)) {
      errors.push("signature keyId must be 64 lowercase hex.");
    }
    if (typeof signature.sig !== "string" || !/^[A-Za-z0-9+/]{86}==$/.test(signature.sig)) {
      errors.push("signature sig must be base64 standard with padding.");
    }
    if (typeof signature.keyId === "string") {
      if (previous && signature.keyId.localeCompare(previous) < 0) {
        errors.push("signatures must be sorted by keyId.");
      }
      previous = signature.keyId;
    }
  }
}

function validateKeyringErrors(keyring) {
  const errors = [];

  if (!isPlainObject(keyring)) {
    return ["keyring must be an object"];
  }
  if (keyring.schemaVersion !== "1.0.0") {
    errors.push("keyring schemaVersion must be 1.0.0.");
  }
  if (!Number.isSafeInteger(keyring.version) || keyring.version < 1) {
    errors.push("keyring version must be a positive integer.");
  }
  if (typeof keyring.expires !== "string" || !rfc3339UtcPattern.test(keyring.expires)) {
    errors.push("keyring expires must be RFC 3339 UTC.");
  }
  if (!Array.isArray(keyring.rootKeys) || keyring.rootKeys.length === 0) {
    errors.push("keyring rootKeys must be a non-empty array.");
  }
  if (
    !Number.isSafeInteger(keyring.rootThreshold) ||
    keyring.rootThreshold < 1 ||
    keyring.rootThreshold > (keyring.rootKeys?.length ?? 0)
  ) {
    errors.push("keyring rootThreshold must be between 1 and rootKeys.length.");
  }
  validateKeys(keyring.rootKeys, "rootKeys", errors);
  if (!Array.isArray(keyring.publishers)) {
    errors.push("keyring publishers must be an array.");
  } else {
    for (const publisher of keyring.publishers) {
      if (!isPlainObject(publisher)) {
        errors.push("publisher entries must be objects.");
        continue;
      }
      if (typeof publisher.namespace !== "string" || publisher.namespace.length === 0) {
        errors.push("publisher namespace is required.");
      }
      if (!Number.isSafeInteger(publisher.threshold) || publisher.threshold < 1) {
        errors.push("publisher threshold must be a positive integer.");
      }
      if (Array.isArray(publisher.keys) && publisher.threshold > publisher.keys.length) {
        errors.push("publisher threshold must not exceed publisher key count.");
      }
      validateKeys(publisher.keys, `publisher ${publisher.namespace} keys`, errors);
    }
  }
  if (!Array.isArray(keyring.signatures)) {
    errors.push("keyring signatures must be an array.");
  } else {
    for (const signature of keyring.signatures) {
      if (
        !isPlainObject(signature) ||
        signature.algo !== "ed25519" ||
        typeof signature.keyId !== "string" ||
        !keyIdPattern.test(signature.keyId) ||
        typeof signature.sig !== "string"
      ) {
        errors.push("keyring signatures must be ed25519 entries.");
      }
    }
  }

  return errors;
}

function validateKeys(keys, label, errors) {
  if (!Array.isArray(keys)) {
    errors.push(`${label} must be an array.`);
    return;
  }

  const seen = new Set();
  for (const key of keys) {
    if (!isPlainObject(key)) {
      errors.push(`${label} entries must be objects.`);
      continue;
    }
    if (key.algo !== "ed25519") {
      errors.push(`${label} entries must use ed25519.`);
    }
    if (!keyIdPattern.test(key.keyId)) {
      errors.push(`${label} entries must have 64-hex keyId.`);
    }
    if (seen.has(key.keyId)) {
      errors.push(`${label} entries must not duplicate keyId.`);
    }
    seen.add(key.keyId);
    if (key.status !== "active" && key.status !== "revoked") {
      errors.push(`${label} entries must be active or revoked.`);
    }
    if (typeof key.validFrom !== "string" || !rfc3339UtcPattern.test(key.validFrom)) {
      errors.push(`${label} entries need validFrom.`);
    }
    if (key.validUntil !== null && (typeof key.validUntil !== "string" || !rfc3339UtcPattern.test(key.validUntil))) {
      errors.push(`${label} entries need validUntil or null.`);
    }

    const rawPublicKey = Buffer.from(String(key.publicKey ?? ""), "base64");
    if (rawPublicKey.length !== 32 || keyIdForPublicKey(rawPublicKey) !== key.keyId) {
      errors.push(`${label} entries must bind keyId to publicKey.`);
    }
  }
}

function majorOf(version) {
  const value = Number.parseInt(String(version).split(".", 1)[0] ?? "0", 10);
  return Number.isNaN(value) ? Number.MAX_SAFE_INTEGER : value;
}

function isPrivateOnlyLicenseAllowed(manifest) {
  if (
    manifest.license !== "proprietary" &&
    !/^LicenseRef-Internal-[A-Za-z0-9.-]+$/.test(manifest.license)
  ) {
    return false;
  }

  const explicitFirstPartyHarnesses =
    Array.isArray(manifest.harnesses) &&
    manifest.harnesses.length > 0 &&
    !manifest.harnesses.includes("*");
  const magnet = String(manifest.transport?.magnet ?? "");
  const params = new URLSearchParams(magnet.startsWith("magnet:?") ? magnet.slice("magnet:?".length) : "");

  return explicitFirstPartyHarnesses && params.getAll("tr").length === 0 && !manifest.transport?.ipfsCid;
}

function obligationFor(license) {
  return obligationHints
    .filter(([pattern]) => pattern.test(license))
    .map(([, hint]) => hint)
    .join(" ");
}

function isDigit(value) {
  return value >= "0" && value <= "9";
}
