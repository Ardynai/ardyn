import { createHash, verify as cryptoVerify, createPublicKey, constants } from "node:crypto";
import { readFileSync, realpathSync } from "node:fs";
import { readFile } from "node:fs/promises";

export const FABRIC_FEDERATION_DEFAULT_LOCAL_DID = "did:multiverse:ardyn";

export const FABRIC_FEDERATION_CLOSED_SIBLING_DIDS = Object.freeze([
  "did:multiverse:hub",
  "did:multiverse:kortex-audio",
  "did:multiverse:locus",
  "did:multiverse:custos",
  "did:multiverse:somatic",
  "did:multiverse:aegis",
  "did:multiverse:praxis",
  "did:multiverse:ardyn",
  "did:multiverse:kybernetes",
]);

export const FABRIC_FEDERATION_DEFAULT_PATHS = Object.freeze({
  allowlist: "/fabric/federation/allowlist",
  inbox: "/fabric/federation/inbox",
  keepalive: "/systems/register",
  markReceived: "/fabric/federation/inbox/{id}/received",
  register: "/systems/register",
  send: "/fabric/federation/send",
});

const fabricCaHash = "sha256";
const fabricCaMerkle = "sha256-domain-separated-binary-pair-v1";
const fabricCaSchemaVersion = "1.0.0";
const fabricCaTransport = "fabric-ca";
const hexSha256Pattern = /^[a-f0-9]{64}$/;
const defaultCapabilities = Object.freeze([
  "fabric-ca:put",
  "fabric-ca:get",
  "fabric-federation:send",
  "fabric-federation:receive",
]);

export class FabricFederationError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = "FabricFederationError";
    this.code = details.code ?? "fabric_federation_error";
    this.status = details.status;
  }
}

export function isLoopbackFabricFederationUrl(value) {
  let url;
  try {
    url = new URL(value);
  } catch {
    return false;
  }

  return url.protocol === "http:" && isLoopbackHost(url.hostname);
}

export function loadFabricFederationConfigFromEnv(env = process.env) {
  const identityFile = textEnv(env.ARDYN_FABRIC_IDENTITY_FILE);

  return {
    allowSiblingDids: csvEnv(env.ARDYN_FABRIC_FEDERATION_ALLOWLIST),
    closedSiblingDids: csvEnv(env.ARDYN_FABRIC_FEDERATION_CLOSED_SIBLING_DIDS),
    identityFile,
    localDid:
      textEnv(env.ARDYN_FABRIC_DID) ??
      textEnv(env.FABRIC_TRANSPORT_D_DID) ??
      didFromIdentityFile(identityFile) ??
      FABRIC_FEDERATION_DEFAULT_LOCAL_DID,
    receiverPollIntervalMs: integerEnv(env.ARDYN_FABRIC_FEDERATION_POLL_INTERVAL_MS),
    registryBaseUrl: textEnv(env.ARDYN_FABRIC_REGISTRY_URL),
    registryToken: textEnv(env.ARDYN_FABRIC_REGISTRY_TOKEN),
    registryPaths: {
      allowlist: textEnv(env.ARDYN_FABRIC_REGISTRY_ALLOWLIST_PATH),
      inbox: textEnv(env.ARDYN_FABRIC_REGISTRY_INBOX_PATH),
      keepalive: textEnv(env.ARDYN_FABRIC_REGISTRY_KEEPALIVE_PATH),
      markReceived: textEnv(env.ARDYN_FABRIC_REGISTRY_MARK_RECEIVED_PATH),
      register: textEnv(env.ARDYN_FABRIC_REGISTRY_REGISTER_PATH),
      send: textEnv(env.ARDYN_FABRIC_REGISTRY_SEND_PATH),
    },
    sidecarBaseUrl: textEnv(env.ARDYN_FABRIC_SIDECAR_URL),
    sidecarToken:
      textEnv(env.ARDYN_FABRIC_SIDECAR_TOKEN) ??
      textEnv(env.FABRIC_TRANSPORT_D_AUTH_TOKEN),
  };
}

export function createFabricFederationClient(options = {}) {
  const config = normalizeFederationConfig(options);

  return {
    async fetchAllowlist(requestOptions = {}) {
      return fetchRegistryAllowlist(config, requestOptions);
    },
    async getContent(contentId, requestOptions = {}) {
      return getSidecarContent(config, contentId, requestOptions);
    },
    async getDescriptor(contentId, requestOptions = {}) {
      return getSidecarDescriptor(config, contentId, requestOptions);
    },
    async keepalive(requestOptions = {}) {
      return postReachability(config, config.paths.keepalive, requestOptions);
    },
    async pollInboundOnce(handler, requestOptions = {}) {
      return pollInboundOnce(config, handler, requestOptions);
    },
    async putContent(pathOrBytes, requestOptions = {}) {
      const bytes = await bytesFromPathOrValue(pathOrBytes);
      const uploaded = await putSidecarContent(config, bytes, requestOptions);
      verifyFabricCaContent(bytes, uploaded.descriptor, uploaded.contentId);
      return uploaded;
    },
    async registerReachability(requestOptions = {}) {
      return postReachability(config, config.paths.register, requestOptions);
    },
    async resolveAllowlist(requestOptions = {}) {
      return resolveAllowlist(config, requestOptions);
    },
    async send(toDid, pathOrBytes, options = {}) {
      return sendFabricFederationContent(config, toDid, pathOrBytes, options);
    },
    startReceiver(handler, options = {}) {
      return startFabricFederationReceiver(config, handler, options);
    },
  };
}

export async function sendFabricFederationContent(clientOrConfig, toDid, pathOrBytes, options = {}) {
  const config = normalizeConfigLike(clientOrConfig);
  assertDid(toDid, "recipient DID");
  await assertDidIsAllowed(config, toDid, options);
  const bytes = await bytesFromPathOrValue(pathOrBytes);
  const uploaded = await putSidecarContent(config, bytes, options);
  verifyFabricCaContent(bytes, uploaded.descriptor, uploaded.contentId);

  const body = {
    contentId: uploaded.contentId,
    createdAt: new Date().toISOString(),
    descriptor: uploaded.descriptor,
    encrypted: Boolean(options.secure),
    fromDid: config.localDid,
    secure: Boolean(options.secure),
    toDid,
    transport: fabricCaTransport,
    type: "fabric_content",
  };
  const registry = await requestJson(
    registryUrl(config, config.paths.send),
    {
      body,
      method: "POST",
      token: config.registryToken,
    },
    config,
    options,
  );

  return { ...uploaded, registry, toDid };
}

export function startFabricFederationReceiver(clientOrConfig, handler, options = {}) {
  const config = normalizeConfigLike(clientOrConfig);
  if (typeof handler !== "function") {
    throw new FabricFederationError("Fabric federation receiver handler is required.", {
      code: "invalid_handler",
    });
  }

  const intervalMs = normalizePositiveInteger(
    options.intervalMs ?? config.receiverPollIntervalMs,
    "receiver interval",
    1_000,
  );
  const keepaliveEveryMs = normalizePositiveInteger(
    options.keepaliveEveryMs ?? Math.max(intervalMs, 30_000),
    "keepalive interval",
    1_000,
  );
  const signal = options.signal;
  let stopped = false;
  let timer;
  let lastKeepaliveAt = 0;

  const stop = () => {
    stopped = true;
    if (timer) clearTimeout(timer);
  };
  signal?.addEventListener?.("abort", stop, { once: true });

  const tick = async () => {
    if (stopped || signal?.aborted) return;
    const now = Date.now();
    if (now - lastKeepaliveAt >= keepaliveEveryMs) {
      await postReachability(config, config.paths.keepalive, { signal });
      lastKeepaliveAt = now;
    }
    await pollInboundOnce(config, handler, { signal });
    if (!stopped && !signal?.aborted) {
      timer = setTimeout(() => {
        tick().catch(() => undefined);
      }, intervalMs);
    }
  };

  const ready = postReachability(config, config.paths.register, { signal }).then(() => tick());
  return { ready, stop };
}

export function verifyFabricCaContent(data, descriptor, expectedContentId = undefined) {
  const bytes = normalizeBytes(data);
  const normalized = validateFabricCaDescriptorShape(descriptor);
  if (bytes.byteLength !== normalized.totalSize) {
    throw new FabricFederationError("Fabric CA payload size does not match descriptor.", {
      code: "content_size_mismatch",
    });
  }

  const leaves = [];
  for (const piece of normalized.pieces) {
    const start = piece.offset;
    const end = start + piece.size;
    const actualLeaf = hashLeaf(bytes.subarray(start, end));
    if (actualLeaf !== piece.sha256) {
      throw new FabricFederationError("Fabric CA piece hash mismatch.", {
        code: "piece_hash_mismatch",
      });
    }
    leaves.push(actualLeaf);
  }

  const actualContentId = merkleRootForLeafHashes(leaves);
  const wanted = expectedContentId ?? normalized.contentId;
  if (actualContentId !== normalized.contentId || actualContentId !== wanted) {
    throw new FabricFederationError("Fabric CA contentId re-verification failed.", {
      code: "content_id_mismatch",
    });
  }

  return {
    contentId: actualContentId,
    pieceCount: normalized.pieces.length,
    totalSize: normalized.totalSize,
  };
}

export function fabricCaContentId(data, descriptor) {
  return verifyFabricCaContent(data, descriptor).contentId;
}

async function pollInboundOnce(config, handler, options) {
  if (typeof handler !== "function") {
    throw new FabricFederationError("Fabric federation receiver handler is required.", {
      code: "invalid_handler",
    });
  }

  const inboxUrl = registryUrl(config, config.paths.inbox);
  inboxUrl.searchParams.set("did", config.localDid);
  const payload = await requestJson(
    inboxUrl,
    { method: "GET", token: config.registryToken },
    config,
    options,
  );
  const envelopes = inboundEnvelopes(payload);
  const delivered = [];
  const rejected = [];

  for (const envelope of envelopes) {
    try {
      const result = await receiveInboundEnvelope(config, envelope, handler, options);
      delivered.push(result);
    } catch (error) {
      rejected.push({
        contentId: typeof envelope?.contentId === "string" ? envelope.contentId : undefined,
        error,
        fromDid: didFromEnvelope(envelope),
      });
      if (options.failFast) throw error;
    }
  }

  return { delivered, rejected };
}

async function receiveInboundEnvelope(config, envelope, handler, options) {
  if (!envelope || typeof envelope !== "object" || Array.isArray(envelope)) {
    throw new FabricFederationError("Fabric federation inbox entries must be objects.", {
      code: "invalid_inbox_entry",
    });
  }
  const fromDid = didFromEnvelope(envelope);
  const toDid = envelope.toDid ?? envelope.to_did ?? envelope.recipientDid ?? envelope.recipient_did;
  const contentId = envelope.contentId ?? envelope.content_id;

  assertDid(fromDid, "sender DID");
  if (toDid !== config.localDid) {
    throw new FabricFederationError("Fabric federation inbox entry is not addressed to this DID.", {
      code: "wrong_recipient",
    });
  }
  if (!isInboundAuthenticated(envelope, fromDid)) {
    throw new FabricFederationError("Fabric federation inbox sender is not authenticated.", {
      code: "unauthenticated_sender",
    });
  }
  await assertDidIsAllowed(config, fromDid, options);
  assertContentId(contentId);

  const descriptor = await getSidecarDescriptor(config, contentId, options);
  const bytes = await getSidecarContent(config, contentId, options);
  const verification = verifyFabricCaContent(bytes, descriptor, contentId);
  const delivery = {
    bytes,
    contentId,
    descriptor,
    encrypted: Boolean(envelope.encrypted ?? envelope.secure),
    envelope,
    fromDid,
    secure: Boolean(envelope.secure ?? envelope.encrypted),
    toDid,
    verification,
  };

  await handler(delivery);
  await markReceived(config, envelope, options);
  return { contentId, fromDid, secure: delivery.secure, verification };
}

async function markReceived(config, envelope, options) {
  const id = envelope.id ?? envelope.messageId ?? envelope.message_id;
  if (!id || !config.paths.markReceived) return undefined;
  const path = config.paths.markReceived.replace("{id}", encodeURIComponent(String(id)));
  return requestJson(
    registryUrl(config, path),
    {
      body: { contentId: envelope.contentId ?? envelope.content_id, did: config.localDid },
      method: "POST",
      token: config.registryToken,
    },
    config,
    options,
  );
}

async function putSidecarContent(config, bytes, options) {
  const payload = await requestJson(
    sidecarUrl(config, "/v1/content"),
    {
      body: bytes,
      contentType: "application/octet-stream",
      method: "PUT",
      token: config.sidecarToken,
    },
    config,
    options,
  );
  assertContentId(payload.contentId);
  return {
    contentId: payload.contentId,
    descriptor: validateFabricCaDescriptorShape(payload.descriptor),
  };
}

async function getSidecarDescriptor(config, contentId, options) {
  assertContentId(contentId);
  const payload = await requestJson(
    sidecarUrl(config, `/v1/content/${contentId}/descriptor`),
    { method: "GET", token: config.sidecarToken },
    config,
    options,
  );
  const descriptor = validateFabricCaDescriptorShape(payload.descriptor);
  if (payload.contentId !== contentId || descriptor.contentId !== contentId) {
    throw new FabricFederationError("Fabric CA descriptor contentId mismatch.", {
      code: "descriptor_content_id_mismatch",
    });
  }
  return descriptor;
}

async function getSidecarContent(config, contentId, options) {
  assertContentId(contentId);
  const response = await requestRaw(
    sidecarUrl(config, `/v1/content/${contentId}`),
    { method: "GET", token: config.sidecarToken },
    config,
    options,
  );
  const headerContentId = headerValue(response.headers, "x-fabric-content-id");
  if (headerContentId && headerContentId !== contentId) {
    throw new FabricFederationError("Fabric CA response contentId header mismatch.", {
      code: "response_content_id_mismatch",
    });
  }
  return readBodyCapped(response, config, options);
}

async function postReachability(config, path, options) {
  return requestJson(
    registryUrl(config, path),
    {
      body: {
        capabilities: [...config.capabilities],
        did: config.localDid,
        endpointUrl: config.reachability.endpointUrl ?? config.sidecarBaseUrl,
        id: config.reachability.id,
        name: config.reachability.name,
        ownerDid: config.reachability.ownerDid ?? config.localDid,
        version: config.reachability.version,
      },
      method: "POST",
      token: config.registryToken,
    },
    config,
    options,
  );
}

async function fetchRegistryAllowlist(config, options) {
  const payload = await requestJson(
    registryUrl(config, config.paths.allowlist),
    { method: "GET", token: config.registryToken },
    config,
    options,
  );
  return allowlistFromPayload(payload);
}

async function resolveAllowlist(config, options) {
  try {
    return normalizeAllowlist(config, await fetchRegistryAllowlist(config, options));
  } catch (error) {
    if (!isOptionalRegistryRouteError(error)) throw error;
    return normalizeAllowlist(config, config.allowSiblingDids);
  }
}

async function assertDidIsAllowed(config, did, options) {
  const allowlist = await resolveAllowlist(config, options);
  if (!allowlist.includes(did)) {
    throw new FabricFederationError("Fabric federation DID is not allowlisted.", {
      code: "did_not_allowlisted",
    });
  }
}

function normalizeFederationConfig(options) {
  const sidecarBaseUrl = requireText(options.sidecarBaseUrl, "sidecarBaseUrl");
  if (!isLoopbackFabricFederationUrl(sidecarBaseUrl)) {
    throw new FabricFederationError("Fabric sidecar URL must be loopback HTTP.", {
      code: "non_loopback_sidecar_url",
    });
  }

  const registryBaseUrl = requireText(options.registryBaseUrl, "registryBaseUrl");
  const registryUrlValue = new URL(registryBaseUrl);
  if (registryUrlValue.protocol === "http:" && !isLoopbackHost(registryUrlValue.hostname)) {
    throw new FabricFederationError("Fabric registry HTTP URL must be loopback; use HTTPS for remote registries.", {
      code: "unsafe_registry_url",
    });
  }
  if (registryUrlValue.protocol !== "http:" && registryUrlValue.protocol !== "https:") {
    throw new FabricFederationError("Fabric registry URL must use HTTP or HTTPS.", {
      code: "invalid_registry_url",
    });
  }
  // M4: MEDIUM-1 — registry host allowlist (if configured)
  const registryHostAllowlist = options.registryHostAllowlist;
  if (Array.isArray(registryHostAllowlist) && registryHostAllowlist.length > 0) {
    const host = registryUrlValue.hostname;
    if (!registryHostAllowlist.includes(host)) {
      throw new FabricFederationError(
        `Fabric registry host '${host}' is not in the allowlist: ${registryHostAllowlist.join(", ")}.`,
        { code: "registry_host_not_allowed" }
      );
    }
  }

  const localDid = requireText(options.localDid ?? FABRIC_FEDERATION_DEFAULT_LOCAL_DID, "localDid");
  assertDid(localDid, "local DID");

  const closedSiblingDids = normalizeDidList(
    options.closedSiblingDids?.length
      ? options.closedSiblingDids
      : FABRIC_FEDERATION_CLOSED_SIBLING_DIDS,
    "closed sibling DIDs",
  );
  if (!closedSiblingDids.includes(localDid)) {
    closedSiblingDids.push(localDid);
  }

  const allowSiblingDids = normalizeAllowlist(
    { closedSiblingDids, localDid },
    options.allowSiblingDids?.length ? options.allowSiblingDids : closedSiblingDids,
  );

  return {
    allowSiblingDids,
    capabilities: options.capabilities?.length ? [...options.capabilities] : [...defaultCapabilities],
    closedSiblingDids,
    fetchImpl: options.fetchImpl ?? globalThis.fetch,
    localDid,
    paths: normalizePaths(options.registryPaths),
    reachability: {
      endpointUrl: options.reachability?.endpointUrl,
      id: options.reachability?.id ?? "ardyn",
      name: options.reachability?.name ?? "Ardyn",
      ownerDid: options.reachability?.ownerDid,
      version: options.reachability?.version ?? "0.1.0",
    },
    receiverPollIntervalMs: normalizePositiveInteger(
      options.receiverPollIntervalMs ?? 15_000,
      "receiver poll interval",
      1_000,
    ),
    registryBaseUrl: trimTrailingSlash(registryBaseUrl),
    registryToken: requireText(options.registryToken, "registryToken"),
    sidecarBaseUrl: trimTrailingSlash(sidecarBaseUrl),
    sidecarToken: requireText(options.sidecarToken, "sidecarToken"),
    // M20: honor the configured streamed-response cap (was silently dropped).
    maxResponseBytes: normalizePositiveInteger(options.maxResponseBytes ?? 16 * 1024 * 1024, "maxResponseBytes", 1),
    timeoutMs: normalizePositiveInteger(options.timeoutMs ?? 30_000, "timeout", 1),
  };
}

function normalizeConfigLike(value) {
  if (value?.paths && value?.closedSiblingDids && value?.sidecarBaseUrl && value?.registryBaseUrl) {
    return value;
  }
  return normalizeFederationConfig(value);
}

function normalizePaths(paths = {}) {
  return {
    allowlist: paths.allowlist ?? FABRIC_FEDERATION_DEFAULT_PATHS.allowlist,
    inbox: paths.inbox ?? FABRIC_FEDERATION_DEFAULT_PATHS.inbox,
    keepalive: paths.keepalive ?? FABRIC_FEDERATION_DEFAULT_PATHS.keepalive,
    markReceived: paths.markReceived ?? FABRIC_FEDERATION_DEFAULT_PATHS.markReceived,
    register: paths.register ?? FABRIC_FEDERATION_DEFAULT_PATHS.register,
    send: paths.send ?? FABRIC_FEDERATION_DEFAULT_PATHS.send,
  };
}

function normalizeAllowlist(config, values) {
  const list = normalizeDidList(values, "allowlisted DIDs").filter((did) => did !== config.localDid);
  const closed = new Set(config.closedSiblingDids);
  for (const did of list) {
    if (!closed.has(did)) {
      throw new FabricFederationError("Fabric federation allowlist includes a non-sibling DID.", {
        code: "non_sibling_allowlist_did",
      });
    }
  }
  if (list.length === 0) {
    throw new FabricFederationError("Fabric federation allowlist is empty.", {
      code: "empty_allowlist",
    });
  }
  return list;
}

function normalizeDidList(values, label) {
  if (!Array.isArray(values)) {
    throw new FabricFederationError(`${label} must be an array.`, { code: "invalid_did_list" });
  }
  const result = [];
  const seen = new Set();
  for (const value of values) {
    const did = requireText(value, label);
    assertDid(did, label);
    if (!seen.has(did)) {
      result.push(did);
      seen.add(did);
    }
  }
  return result;
}

function allowlistFromPayload(payload) {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") {
    throw new FabricFederationError("Fabric federation allowlist response must be an object or array.", {
      code: "invalid_allowlist_response",
    });
  }
  if (Array.isArray(payload.allowlist)) return payload.allowlist;
  if (Array.isArray(payload.allowedDids)) return payload.allowedDids;
  if (Array.isArray(payload.allowed_dids)) return payload.allowed_dids;
  if (Array.isArray(payload.siblingDids)) return payload.siblingDids;
  if (Array.isArray(payload.peers)) {
    return payload.peers.map((peer) => peer?.did).filter(Boolean);
  }
  throw new FabricFederationError("Fabric federation allowlist response did not include DIDs.", {
    code: "invalid_allowlist_response",
  });
}

function inboundEnvelopes(payload) {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") {
    throw new FabricFederationError("Fabric federation inbox response must be an object or array.", {
      code: "invalid_inbox_response",
    });
  }
  for (const key of ["items", "messages", "inbound", "entries"]) {
    if (Array.isArray(payload[key])) return payload[key];
  }
  return [];
}

async function requestJson(url, init, config, options = {}) {
  const response = await requestRaw(url, init, config, options);
  const buffer = await readBodyCapped(response, config, options);
  const text = buffer.toString("utf8");
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    throw new FabricFederationError("Fabric federation response was not JSON.", {
      code: "invalid_json_response",
      status: response.status,
    });
  }
}

async function requestRaw(url, init, config, options = {}) {
  const fetchImpl = options.fetchImpl ?? config.fetchImpl;
  if (typeof fetchImpl !== "function") {
    throw new FabricFederationError("Fabric federation fetch implementation is unavailable.", {
      code: "missing_fetch",
    });
  }
  const timeoutMs = normalizePositiveInteger(options.timeoutMs ?? config.timeoutMs, "timeout", 1);
  const abort = new AbortController();
  const timeout = setTimeout(() => abort.abort(), timeoutMs);
  const onAbort = () => abort.abort();
  options.signal?.addEventListener?.("abort", onAbort, { once: true });

  try {
    const headers = {
      authorization: `Bearer ${requireText(init.token, "bearer token")}`,
      ...(init.contentType ? { "content-type": init.contentType } : {}),
      ...(!init.contentType && init.body !== undefined && !isByteBody(init.body)
        ? { "content-type": "application/json" }
        : {}),
    };
    const response = await fetchImpl(url, {
      body: encodeBody(init.body),
      headers,
      method: init.method,
      signal: abort.signal,
      redirect: "manual", // M4: HIGH-1 — no SSRF via redirect following
    });
    // M4: HIGH-1 — treat any 3xx redirect as an error (no auto-following)
    if (response.status >= 300 && response.status < 400) {
      throw new FabricFederationError(
        `Fabric federation redirect rejected (status ${response.status}) — redirect following disabled for SSRF safety.`,
        { code: "redirect_blocked", status: response.status }
      );
    }
    if (!response.ok) {
      throw new FabricFederationError(`Fabric federation HTTP ${response.status}.`, {
        code: "http_error",
        status: response.status,
      });
    }
    // M4: INFO-3 — response-size cap to bound memory from a hostile loopback sidecar
    const contentLength = parseInt(response.headers.get("content-length") ?? "0", 10);
    const maxResponseBytes = normalizePositiveInteger(
      options.maxResponseBytes ?? config.maxResponseBytes ?? 16 * 1024 * 1024,
      "maxResponseBytes", 0
    );
    if (contentLength > 0 && contentLength > maxResponseBytes) {
      throw new FabricFederationError(
        `Fabric federation response exceeds size cap (${contentLength} > ${maxResponseBytes} bytes).`,
        { code: "response_too_large", status: response.status }
      );
    }
    return response;
  } finally {
    clearTimeout(timeout);
    options.signal?.removeEventListener?.("abort", onAbort);
  }
}

function encodeBody(body) {
  if (body === undefined) return undefined;
  if (isByteBody(body)) return body;
  return JSON.stringify(body);
}

function isByteBody(value) {
  return Buffer.isBuffer(value) || value instanceof Uint8Array;
}

// M20: response-size cap must count STREAMED bytes, not just content-length
// (a hostile sidecar can omit or lie about the header). Receive is live now,
// so every raw body read goes through this incremental guard.
function maxResponseCap(options = {}, config = {}) {
  const configured = options.maxResponseBytes ?? config.maxResponseBytes ?? 16 * 1024 * 1024;
  // allow explicit 0 = unlimited? No — fail closed: minimum is 1 byte.
  return normalizePositiveInteger(configured, "maxResponseBytes", 1);
}

async function readBodyCapped(response, config, options = {}) {
  const maxBytes = maxResponseCap(options, config);
  const hasStream = response.body && typeof response.body.getReader === "function";
  if (!hasStream) {
    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.byteLength > maxBytes) {
      throw new FabricFederationError(
        `Fabric federation response exceeds size cap (${buffer.byteLength} > ${maxBytes} bytes).`,
        { code: "response_too_large" }
      );
    }
    return buffer;
  }
  const reader = response.body.getReader();
  const chunks = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value?.byteLength ?? 0;
    if (total > maxBytes) {
      try { reader.cancel(); } catch { /* already errored */ }
      throw new FabricFederationError(
        `Fabric federation streamed response exceeds size cap (${total} > ${maxBytes} bytes).`,
        { code: "response_too_large" }
      );
    }
    chunks.push(Buffer.from(value));
  }
  return Buffer.concat(chunks);
}

function registryUrl(config, path) {
  return new URL(path, `${config.registryBaseUrl}/`);
}

function sidecarUrl(config, path) {
  return new URL(path, `${config.sidecarBaseUrl}/`);
}

async function bytesFromPathOrValue(pathOrBytes) {
  if (typeof pathOrBytes === "string") {
    return readFile(pathOrBytes);
  }
  return normalizeBytes(pathOrBytes);
}

function validateFabricCaDescriptorShape(descriptor) {
  if (!descriptor || typeof descriptor !== "object" || Array.isArray(descriptor)) {
    throw new FabricFederationError("Fabric CA descriptor must be an object.", {
      code: "invalid_descriptor",
    });
  }
  if (
    descriptor.schemaVersion !== fabricCaSchemaVersion ||
    descriptor.transport !== fabricCaTransport ||
    descriptor.hash !== fabricCaHash ||
    descriptor.merkle !== fabricCaMerkle
  ) {
    throw new FabricFederationError("Fabric CA descriptor uses an unsupported contract.", {
      code: "unsupported_descriptor",
    });
  }
  assertContentId(descriptor.contentId);
  if (descriptor.merkleRoot !== descriptor.contentId) {
    throw new FabricFederationError("Fabric CA descriptor contentId must match merkleRoot.", {
      code: "descriptor_merkle_mismatch",
    });
  }
  const pieceSize = safeByteCount(descriptor.pieceSize, "pieceSize");
  if (pieceSize <= 0) {
    throw new FabricFederationError("Fabric CA descriptor pieceSize must be positive.", {
      code: "invalid_descriptor_size",
    });
  }
  const totalSize = safeByteCount(descriptor.totalSize, "totalSize");
  if (!Array.isArray(descriptor.pieces) || descriptor.pieces.length === 0) {
    throw new FabricFederationError("Fabric CA descriptor pieces must be non-empty.", {
      code: "invalid_descriptor_pieces",
    });
  }
  if (descriptor.pieces.length !== expectedPieceCount(totalSize, pieceSize)) {
    throw new FabricFederationError("Fabric CA descriptor piece count does not match size.", {
      code: "invalid_descriptor_pieces",
    });
  }

  let expectedOffset = 0;
  const pieces = descriptor.pieces.map((piece, index) => {
    if (!piece || typeof piece !== "object" || Array.isArray(piece)) {
      throw new FabricFederationError("Fabric CA descriptor pieces must be objects.", {
        code: "invalid_descriptor_piece",
      });
    }
    if (piece.index !== index || piece.offset !== expectedOffset) {
      throw new FabricFederationError("Fabric CA descriptor pieces must be ordered and contiguous.", {
        code: "invalid_descriptor_piece_order",
      });
    }
    const size = safeByteCount(piece.size, "piece.size");
    if (size !== expectedPieceSize(index, totalSize, pieceSize)) {
      throw new FabricFederationError("Fabric CA descriptor piece sizes must match pieceSize except the last piece.", {
        code: "invalid_descriptor_piece_size",
      });
    }
    if (size === 0 && descriptor.pieces.length > 1) {
      throw new FabricFederationError("Only an empty Fabric CA payload may contain a zero-size piece.", {
        code: "invalid_descriptor_piece_size",
      });
    }
    if (!hexSha256Pattern.test(piece.sha256)) {
      throw new FabricFederationError("Fabric CA piece sha256 must be 64 lowercase hex characters.", {
        code: "invalid_descriptor_piece_hash",
      });
    }
    expectedOffset += size;
    return { index, offset: piece.offset, sha256: piece.sha256, size };
  });
  if (expectedOffset !== totalSize) {
    throw new FabricFederationError("Fabric CA descriptor totalSize must equal piece sizes.", {
      code: "invalid_descriptor_total_size",
    });
  }
  const merkleRoot = merkleRootForLeafHashes(pieces.map((piece) => piece.sha256));
  if (merkleRoot !== descriptor.contentId) {
    throw new FabricFederationError("Fabric CA descriptor Merkle root is invalid.", {
      code: "invalid_descriptor_merkle_root",
    });
  }

  return {
    contentId: descriptor.contentId,
    hash: descriptor.hash,
    merkle: descriptor.merkle,
    merkleRoot: descriptor.merkleRoot,
    pieces,
    pieceSize,
    schemaVersion: descriptor.schemaVersion,
    totalSize,
    transport: descriptor.transport,
  };
}

function merkleRootForLeafHashes(pieceHashes) {
  if (pieceHashes.length === 0) {
    throw new FabricFederationError("Fabric CA Merkle root requires at least one piece.", {
      code: "invalid_merkle_tree",
    });
  }
  let level = pieceHashes.map((hash) => {
    if (!hexSha256Pattern.test(hash)) {
      throw new FabricFederationError("Fabric CA Merkle leaves must be SHA-256 hex.", {
        code: "invalid_merkle_leaf",
      });
    }
    return Buffer.from(hash, "hex");
  });
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

function hashLeaf(bytes) {
  return createHash("sha256").update(Buffer.from([0x00])).update(bytes).digest("hex");
}

function expectedPieceCount(totalSize, pieceSize) {
  return totalSize === 0 ? 1 : Math.ceil(totalSize / pieceSize);
}

function expectedPieceSize(pieceIndex, totalSize, pieceSize) {
  const pieceCount = expectedPieceCount(totalSize, pieceSize);
  if (totalSize === 0) return 0;
  if (pieceIndex < pieceCount - 1) return pieceSize;
  return totalSize % pieceSize || pieceSize;
}

function normalizeBytes(value) {
  if (Buffer.isBuffer(value)) return value;
  if (value instanceof Uint8Array) {
    return Buffer.from(value.buffer, value.byteOffset, value.byteLength);
  }
  throw new FabricFederationError("Fabric federation content must be bytes or a filesystem path.", {
    code: "invalid_content_bytes",
  });
}

function safeByteCount(value, label) {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new FabricFederationError(`Fabric CA descriptor ${label} must be a safe byte count.`, {
      code: "invalid_descriptor_size",
    });
  }
  return value;
}

function assertContentId(value) {
  if (typeof value !== "string" || !hexSha256Pattern.test(value)) {
    throw new FabricFederationError("Fabric CA contentId must be 64 lowercase hex characters.", {
      code: "invalid_content_id",
    });
  }
}

function assertDid(value, label) {
  if (typeof value !== "string" || !/^did:[a-z0-9]+:[A-Za-z0-9._:#-]+$/.test(value)) {
    throw new FabricFederationError(`Fabric federation ${label} is invalid.`, {
      code: "invalid_did",
    });
  }
}

function didFromEnvelope(envelope) {
  return envelope?.fromDid ?? envelope?.from_did ?? envelope?.senderDid ?? envelope?.sender_did;
}

// B2-real: Real cryptographic Ed25519 signature verification.
// A message is authenticated only when:
//   1. envelope.authenticated === true
//   2. envelope.authenticatedDid matches the expected fromDid
//   3. A valid Ed25519 signature over the canonical payload verifies against the DID's registered public key
// No field-presence shortcut — crypto.verify must actually pass.

// Load DID → public key map from env (ARDYN_FABRIC_SIBLING_KEYS as JSON)
// or from a gitignored config/secret/federation-keys.json file.
function loadSiblingKeys() {
  // Try env first
  if (process.env.ARDYN_FABRIC_SIBLING_KEYS) {
    try {
      return JSON.parse(process.env.ARDYN_FABRIC_SIBLING_KEYS);
    } catch {
      return {};
    }
  }
  // Try gitignored config file (never committed — config/secret/ is gitignored)
  try {
    const keysPath = "config/secret/federation-keys.json";
    const text = readFileSync(keysPath, "utf8");
    return JSON.parse(text);
  } catch {
    return {};
  }
}

// Canonical payload: stable JSON of the envelope excluding signature fields
function canonicalSignedPayload(envelope) {
  const { signature, signatureDid, ...rest } = envelope;
  return JSON.stringify(rest, Object.keys(rest).sort());
}

function isInboundAuthenticated(envelope, fromDid) {
  if (!envelope || typeof envelope !== "object") return false;
  if (envelope.authenticated !== true) return false;
  const authDid = envelope.authenticatedDid ?? envelope.authenticated_did ?? envelope.auth?.did;
  if (authDid !== fromDid) return false;

  // B2-real: require a real Ed25519 signature — no field-presence shortcut
  if (typeof envelope.signature !== "string" || envelope.signature.trim().length === 0) return false;

  // B2-real: look up the DID's public key from the configured closed map
  const siblingKeys = loadSiblingKeys();
  const registeredKeyBase64 = siblingKeys[fromDid];
  if (!registeredKeyBase64) {
    // Unknown DID — no key registered → fail closed
    return false;
  }

  // B2-real: reconstruct the public key and verify the signature with node:crypto
  try {
    const publicKeyDer = Buffer.from(registeredKeyBase64, "base64");
    const publicKey = createPublicKey({ key: publicKeyDer, format: "der", type: "spki" });
    const payload = Buffer.from(canonicalSignedPayload(envelope), "utf8");
    const signatureBytes = Buffer.from(envelope.signature, "base64");

    const isValid = cryptoVerify(null, payload, publicKey, signatureBytes);
    return isValid === true;
  } catch {
    // Malformed key or signature → fail closed
    return false;
  }
}

// B2: Confine ARDYN_FABRIC_IDENTITY_FILE to an allowed base directory.
// Rejects: absolute paths, ../ traversal, symlinks pointing outside the base dir.
function getAllowedBaseDir() {
  return process.env.ARDYN_FABRIC_IDENTITY_BASE_DIR || ".ardyn";
}

const FABRIC_FEDERATION_IDENTITY_ALLOWED_BASE_DIR = getAllowedBaseDir();

function confineIdentityFilePath(filePath) {
  if (!filePath) return null;

  const allowedBaseDir = getAllowedBaseDir();

  // Reject absolute paths
  if (filePath.startsWith("/")) {
    throw new FabricFederationError(
      "Identity file path must be relative (absolute paths not allowed).",
      { code: "identity_file_path_unconfined" }
    );
  }

  // Reject ../ traversal
  if (filePath.includes("../") || filePath.includes("..\\")) {
    throw new FabricFederationError(
      "Identity file path must not contain parent-directory traversal (../).",
      { code: "identity_file_path_unconfined" }
    );
  }

  // Resolve to a real path and check it stays within the allowed base dir
  let resolved;
  try {
    resolved = realpathSync(filePath);
  } catch {
    // File doesn't exist — check the relative path prefix
    const normalized = filePath.replace(/\\/g, "/");
    if (normalized.startsWith(allowedBaseDir + "/") ||
        normalized === allowedBaseDir ||
        allowedBaseDir === ".") {
      return filePath;
    }
    throw new FabricFederationError(
      `Identity file path must be within ${allowedBaseDir}/ (resolved outside base dir).`,
      { code: "identity_file_path_unconfined" }
    );
  }

  // Check if the realpath is within the allowed base dir
  let baseDirResolved;
  try {
    baseDirResolved = realpathSync(allowedBaseDir).replace(/\\/g, "/");
  } catch {
    // Base dir doesn't exist — use as-is
    baseDirResolved = allowedBaseDir.replace(/\\/g, "/");
  }
  const resolvedNorm = resolved.replace(/\\/g, "/");

  if (allowedBaseDir === "." && !resolvedNorm.startsWith("/")) {
    // "." means current dir — accept relative paths
    return filePath;
  }

  if (!resolvedNorm.startsWith(baseDirResolved + "/") && resolvedNorm !== baseDirResolved) {
    throw new FabricFederationError(
      `Identity file path resolves outside the allowed base directory ${allowedBaseDir} (symlink or traversal detected).`,
      { code: "identity_file_path_unconfined" }
    );
  }

  return filePath;
}

export { isInboundAuthenticated, confineIdentityFilePath, FABRIC_FEDERATION_IDENTITY_ALLOWED_BASE_DIR, getAllowedBaseDir as confineIdentityBaseDir };

function isOptionalRegistryRouteError(error) {
  return error instanceof FabricFederationError && (error.status === 404 || error.status === 501);
}

function isLoopbackHost(hostname) {
  const normalized = hostname.toLowerCase().replace(/^\[|\]$/g, "");
  return normalized === "localhost" || normalized === "::1" || normalized === "127.0.0.1";
}

function trimTrailingSlash(value) {
  return value.replace(/\/+$/, "");
}

function requireText(value, label) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new FabricFederationError(`Fabric federation ${label} is required.`, {
      code: "missing_config",
    });
  }
  return value.trim();
}

function normalizePositiveInteger(value, label, minimum) {
  if (!Number.isSafeInteger(value) || value < minimum) {
    throw new FabricFederationError(`Fabric federation ${label} must be an integer >= ${minimum}.`, {
      code: "invalid_integer",
    });
  }
  return value;
}

function integerEnv(value) {
  const text = textEnv(value);
  if (text === undefined) return undefined;
  const parsed = Number.parseInt(text, 10);
  return Number.isSafeInteger(parsed) ? parsed : undefined;
}

function textEnv(value) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function csvEnv(value) {
  const text = textEnv(value);
  if (!text) return undefined;
  return text.split(",").map((part) => part.trim()).filter(Boolean);
}

function didFromIdentityFile(path) {
  if (!path) return undefined;
  // B2-real: call confineIdentityFilePath to enforce realpathSync + base-dir + symlink checks
  // This replaces the naive ../ substring test with real path confinement.
  confineIdentityFilePath(path);
  let text;
  try {
    text = readFileSync(path, "utf8").trim();
  } catch {
    throw new FabricFederationError("Fabric identity file could not be read.", {
      code: "identity_file_unreadable",
    });
  }
  if (!text) return undefined;
  if (text.startsWith("did:")) return text;
  try {
    const parsed = JSON.parse(text);
    return textEnv(parsed.did ?? parsed.id);
  } catch {
    throw new FabricFederationError("Fabric identity file must contain JSON or a DID string.", {
      code: "identity_file_invalid",
    });
  }
}

function headerValue(headers, name) {
  if (!headers) return undefined;
  if (typeof headers.get === "function") return headers.get(name);
  return headers[name] ?? headers[name.toLowerCase()];
}
