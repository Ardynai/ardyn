// M17: Provider adapters — uniform, model-agnostic BYO-model seam over HTTP.
// Pattern adapted from Vision-Agents' native-API-per-provider idea (MIT) — not vendored.
//
// Ardyn does NOT bundle a default model. Consumers plug any provider:
//   createProviderAdapter({ provider: "openai", baseUrl?, apiKeyEnv, fetchImpl? })
//
// Dependency-free: implemented with globalThis.fetch only (inject fetchImpl in
// tests — never call a live API from tests).
//
// SECRET HYGIENE: keys come from env (apiKeyEnv) or the gitignored
// config/secret/provider-keys.json file ("<ENV_NAME>": "<key>"), matching the
// federation-keys convention. Missing key fails CLOSED before any network call.
// Keys are never logged and never appear in error messages (env-var NAME only).
import { readFileSync } from "node:fs";

const PROVIDER_SECRET_FILE = "config/secret/provider-keys.json";

// ── Key resolution: env first, then gitignored secret file. Name-only errors. ──
function resolveApiKey({ apiKeyEnv, secretFile = PROVIDER_SECRET_FILE, provider }) {
  const fromEnv = apiKeyEnv ? process.env[apiKeyEnv] : undefined;
  if (fromEnv) return fromEnv;
  try {
    const file = JSON.parse(readFileSync(secretFile, "utf8"));
    if (apiKeyEnv && typeof file[apiKeyEnv] === "string") return file[apiKeyEnv];
  } catch {
    // absent/unreadable secret file is fine — env is the primary source
  }
  throw new Error(
    `Missing API key for provider "${provider}": set the ${apiKeyEnv ?? "<apiKeyEnv>"} environment variable ` +
    `(or add it to ${PROVIDER_SECRET_FILE}). No requests will be made.`
  );
}

function redact(text, ...secrets) {
  let out = String(text);
  for (const s of secrets) {
    if (s && typeof s === "string" && s.length > 0) out = out.split(s).join("[REDACTED]");
  }
  return out;
}

// ── Uniform request/response shape (model-agnostic) ──
// request:  { model, messages: [{role: "system"|"user"|"assistant", content}], temperature?, maxTokens?, stream? }
// response: { provider, model, text, usage, raw }

// Built-in format: OpenAI-compatible (OpenAI, Azure-style gateways, Ollama, vLLM, …)
const openaiFormat = {
  defaultBaseUrl: "https://api.openai.com/v1",
  buildRequest({ baseUrl, apiKey, request }) {
    return {
      url: `${baseUrl.replace(/\/$/, "")}/chat/completions`,
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`,
      },
      body: {
        model: request.model,
        messages: request.messages,
        ...(request.temperature !== undefined ? { temperature: request.temperature } : {}),
        ...(request.maxTokens !== undefined ? { max_tokens: request.maxTokens } : {}),
        ...(request.stream ? { stream: true } : {}),
      },
    };
  },
  parseResponse(json) {
    return {
      text: json?.choices?.[0]?.message?.content ?? "",
      usage: json?.usage ?? null,
    };
  },
  // SSE frame -> { delta } | null (null = ignore keep-alives/unknown events)
  parseStreamEvent(data) {
    if (!data || data === "[DONE]") return null;
    try {
      const json = JSON.parse(data);
      const delta = json?.choices?.[0]?.delta?.content;
      return delta ? { delta } : null;
    } catch {
      return null;
    }
  },
  // M18 embeddings (RAG memory): uniform embed({model, input}) support
  buildEmbedRequest({ baseUrl, apiKey, request }) {
    return {
      url: `${baseUrl.replace(/\/$/, "")}/embeddings`,
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`,
      },
      body: { model: request.model, input: request.input },
    };
  },
  parseEmbedResponse(json) {
    const data = Array.isArray(json?.data) ? json.data : [];
    const vectors = data.map(d => d.embedding ?? []);
    return { vector: vectors[0] ?? [], vectors };
  },
};

// Built-in format: Google Gemini (Generative Language API)
const geminiFormat = {
  defaultBaseUrl: "https://generativelanguage.googleapis.com/v1beta",
  buildRequest({ baseUrl, apiKey, request }) {
    const system = request.messages.filter(m => m.role === "system").map(m => m.content).join("\n");
    const contents = request.messages
      .filter(m => m.role !== "system")
      .map(m => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] }));
    return {
      url: `${baseUrl.replace(/\/$/, "")}/models/${encodeURIComponent(request.model)}:${request.stream ? "streamGenerateContent?alt=sse" : "generateContent"}`,
      // Key goes in the header (never query string) so URLs stay log-safe.
      headers: {
        "content-type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: {
        ...(system ? { systemInstruction: { parts: [{ text: system }] } } : {}),
        contents,
        ...(request.temperature !== undefined || request.maxTokens !== undefined
          ? { generationConfig: {
              ...(request.temperature !== undefined ? { temperature: request.temperature } : {}),
              ...(request.maxTokens !== undefined ? { maxOutputTokens: request.maxTokens } : {}),
            } }
          : {}),
      },
    };
  },
  parseResponse(json) {
    return {
      text: (json?.candidates?.[0]?.content?.parts ?? []).map(p => p.text ?? "").join(""),
      usage: json?.usageMetadata ?? null,
    };
  },
  parseStreamEvent(data) {
    try {
      const json = JSON.parse(data);
      const text = (json?.candidates?.[0]?.content?.parts ?? []).map(p => p.text ?? "").join("");
      return text ? { delta: text } : null;
    } catch {
      return null;
    }
  },
  buildEmbedRequest({ baseUrl, apiKey, request }) {
    return {
      url: `${baseUrl.replace(/\/$/, "")}/models/${encodeURIComponent(request.model)}:embedContent`,
      headers: {
        "content-type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: { content: { parts: [{ text: request.input }] } },
    };
  },
  parseEmbedResponse(json) {
    const vector = json?.embedding?.values ?? [];
    return { vector, vectors: [vector] };
  },
};

// Pluggable registry: ship 2 built-ins end-to-end, everything else plugs in.
const providerFormats = new Map([
  ["openai", openaiFormat],
  ["openai-compatible", openaiFormat],
  ["gemini", geminiFormat],
]);

export function registerProviderFormat(name, format) {
  if (!name || typeof name !== "string") throw new Error("provider format name required");
  if (typeof format?.buildRequest !== "function" || typeof format?.parseResponse !== "function") {
    throw new Error("provider format requires buildRequest() and parseResponse()");
  }
  providerFormats.set(name, format);
}

export function listProviderFormats() {
  return [...providerFormats.keys()];
}

function readSSEEvents(res) {
  // Parse an SSE body into data-frame strings (dependency-free, incremental).
  const decoder = new TextDecoder();
  const reader = res.body.getReader();
  return async function* () {
    let buffer = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let idx;
      while ((idx = buffer.indexOf("\n")) !== -1) {
        const line = buffer.slice(0, idx).replace(/\r$/, "");
        buffer = buffer.slice(idx + 1);
        if (line.startsWith("data:")) yield line.slice(5).trim();
      }
    }
    const tail = buffer.trim();
    if (tail.startsWith("data:")) yield tail.slice(5).trim();
  };
}

export function createProviderAdapter(options = {}) {
  const { provider, baseUrl, apiKeyEnv, fetchImpl = globalThis.fetch, secretFile, model: defaultModel } = options;
  if (!provider) throw new Error("createProviderAdapter: provider is required");
  const format = providerFormats.get(provider);
  if (!format) {
    throw new Error(`Unknown provider "${provider}". Known: ${listProviderFormats().join(", ")}. Register your own with registerProviderFormat().`);
  }
  if (typeof fetchImpl !== "function") throw new Error("createProviderAdapter: fetchImpl must be a function");

  async function prepare(request) {
    const apiKey = resolveApiKey({ apiKeyEnv, secretFile, provider }); // fails CLOSED pre-fetch
    const req = { model: defaultModel, ...request };
    if (!req.model) throw new Error(`Provider "${provider}" request requires a model (BYO — Ardyn bundles none)`);
    const built = format.buildRequest({
      baseUrl: baseUrl ?? format.defaultBaseUrl,
      apiKey,
      request: req,
    });
    return { apiKey, built, req };
  }

  return {
    provider,
    formatName: provider,

    // Uniform non-streaming call -> { provider, model, text, usage, raw }
    async generate(request) {
      const { apiKey, built, req } = await prepare(request);
      let res;
      try {
        res = await fetchImpl(built.url, {
          method: "POST",
          headers: built.headers,
          body: JSON.stringify(built.body),
        });
      } catch (err) {
        // Network layer failure — never echo headers/body/key material
        throw new Error(redact(`${provider} generate failed: ${err?.message ?? err}`, apiKey));
      }
      if (!res.ok) {
        // Status only on purpose: provider error bodies can echo request content
        throw new Error(redact(`${provider} generate failed: HTTP ${res.status} ${res.statusText ?? ""}`.trim(), apiKey));
      }
      const raw = await res.json();
      const parsed = format.parseResponse(raw);
      return { provider, model: req.model, ...parsed, raw };
    },

    // Uniform embeddings call -> { provider, model, vector, vectors } (M18 RAG)
    async embed(request) {
      if (typeof format.buildEmbedRequest !== "function") {
        throw new Error(`Provider "${provider}" does not support embeddings`);
      }
      const apiKey = resolveApiKey({ apiKeyEnv, secretFile, provider });
      const req = { model: defaultModel, ...request };
      if (!req.model) throw new Error(`Provider "${provider}" embed request requires a model`);
      const built = format.buildEmbedRequest({
        baseUrl: baseUrl ?? format.defaultBaseUrl,
        apiKey,
        request: req,
      });
      let res;
      try {
        res = await fetchImpl(built.url, {
          method: "POST",
          headers: built.headers,
          body: JSON.stringify(built.body),
        });
      } catch (err) {
        throw new Error(redact(`${provider} embed failed: ${err?.message ?? err}`, apiKey));
      }
      if (!res.ok) {
        throw new Error(redact(`${provider} embed failed: HTTP ${res.status} ${res.statusText ?? ""}`.trim(), apiKey));
      }
      const raw = await res.json();
      const parsed = format.parseEmbedResponse(raw);
      return { provider, model: req.model, ...parsed };
    },

    // Uniform streaming call -> async generator of { delta } chunks.
    async *stream(request) {
      const { apiKey, built, req } = await prepare({ ...request, stream: true });
      let res;
      try {
        res = await fetchImpl(built.url, {
          method: "POST",
          headers: built.headers,
          body: JSON.stringify(built.body),
        });
      } catch (err) {
        throw new Error(redact(`${provider} stream failed: ${err?.message ?? err}`, apiKey));
      }
      if (!res.ok) {
        throw new Error(redact(`${provider} stream failed: HTTP ${res.status} ${res.statusText ?? ""}`.trim(), apiKey));
      }
      if (!res.body) throw new Error(`${provider} stream failed: response has no body`);
      for await (const data of readSSEEvents(res)()) {
        const chunk = format.parseStreamEvent(data);
        if (chunk) yield { provider, model: req.model, ...chunk };
      }
    },
  };
}

// Embedder factory for RAG memory: returns async (text) => number[] using the
// adapter's embed() (key from env/secret file — fail-closed, never logged).
export function createAdapterEmbedder({ provider, model, baseUrl, apiKeyEnv, secretFile, fetchImpl } = {}) {
  const adapter = createProviderAdapter({ provider, baseUrl, apiKeyEnv, secretFile, fetchImpl, model });
  return async function embed(text) {
    const res = await adapter.embed({ model, input: String(text ?? "") });
    return res.vector;
  };
}

export default { createProviderAdapter, registerProviderFormat, listProviderFormats };
