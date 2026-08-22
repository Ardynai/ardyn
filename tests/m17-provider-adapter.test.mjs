// M17: Provider adapters — uniform BYO-model seam over HTTP (dependency-free).
// ALL tests use an INJECTED fake fetch — never a live API call.
import assert from "node:assert/strict";
import test from "node:test";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  createProviderAdapter,
  registerProviderFormat,
  listProviderFormats,
} from "../packages/core/src/provider-adapter.mjs";

const KEY = "sk-test-secret-value-1234567890";

function jsonResponse(obj, status = 200) {
  return { ok: status < 400, status, statusText: "Status", json: async () => obj };
}

function sseResponse(frames) {
  const encoder = new TextEncoder();
  return {
    ok: true,
    status: 200,
    statusText: "OK",
    body: new ReadableStream({
      start(controller) {
        for (const f of frames) controller.enqueue(encoder.encode(f));
        controller.close();
      },
    }),
  };
}

// ── OpenAI-compatible adapter ──

test("M17: openai adapter builds correct request (URL/headers/body) and parses response", async () => {
  process.env.TEST_OPENAI_KEY = KEY;
  try {
    const calls = [];
    const fetchImpl = async (url, opts) => {
      calls.push({ url, ...opts });
      return jsonResponse({
        choices: [{ message: { content: "Hello from fake model" } }],
        usage: { total_tokens: 7 },
      });
    };
    const adapter = createProviderAdapter({ provider: "openai", apiKeyEnv: "TEST_OPENAI_KEY", fetchImpl });
    const res = await adapter.generate({
      model: "gpt-test",
      messages: [{ role: "user", content: "hi" }],
      maxTokens: 32,
    });
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, "https://api.openai.com/v1/chat/completions");
    assert.equal(calls[0].method, "POST");
    assert.equal(calls[0].headers.authorization, `Bearer ${KEY}`);
    const body = JSON.parse(calls[0].body);
    assert.equal(body.model, "gpt-test");
    assert.deepEqual(body.messages, [{ role: "user", content: "hi" }]);
    assert.equal(body.max_tokens, 32);
    assert.equal(res.text, "Hello from fake model");
    assert.equal(res.provider, "openai");
    assert.equal(res.usage.total_tokens, 7);
  } finally {
    delete process.env.TEST_OPENAI_KEY;
  }
});

test("M17: openai adapter streams SSE deltas via injected fetch", async () => {
  process.env.TEST_OPENAI_KEY = KEY;
  try {
    let seenUrl, seenBody;
    const fetchImpl = async (url, opts) => {
      seenUrl = url;
      seenBody = JSON.parse(opts.body);
      return sseResponse([
        'data: {"choices":[{"delta":{"content":"Hello"}}]}\n\n',
        ": keep-alive comment\n\n",
        'data: {"choices":[{"delta":{"content":" world"}}]}\n\n',
        "data: [DONE]\n\n",
      ]);
    };
    const adapter = createProviderAdapter({ provider: "openai-compatible", baseUrl: "http://localhost:9999/v1", apiKeyEnv: "TEST_OPENAI_KEY", fetchImpl });
    const deltas = [];
    for await (const chunk of adapter.stream({ model: "m", messages: [{ role: "user", content: "hi" }] })) {
      deltas.push(chunk.delta);
    }
    assert.deepEqual(deltas, ["Hello", " world"]);
    assert.equal(seenUrl, "http://localhost:9999/v1/chat/completions");
    assert.equal(seenBody.stream, true);
  } finally {
    delete process.env.TEST_OPENAI_KEY;
  }
});

// ── Gemini adapter ──

test("M17: gemini adapter builds correct request (URL/headers/body) and parses response", async () => {
  process.env.TEST_GEMINI_KEY = KEY;
  try {
    const calls = [];
    const fetchImpl = async (url, opts) => {
      calls.push({ url, ...opts });
      return jsonResponse({
        candidates: [{ content: { parts: [{ text: "Hi " }, { text: "there" }] } }],
        usageMetadata: { totalTokenCount: 5 },
      });
    };
    const adapter = createProviderAdapter({ provider: "gemini", apiKeyEnv: "TEST_GEMINI_KEY", fetchImpl });
    const res = await adapter.generate({
      model: "gemini-pro",
      messages: [
        { role: "system", content: "be brief" },
        { role: "user", content: "hello" },
        { role: "assistant", content: "hi" },
      ],
      temperature: 0.2,
    });
    assert.equal(calls.length, 1);
    assert.match(calls[0].url, /\/v1beta\/models\/gemini-pro:generateContent$/);
    assert.ok(!calls[0].url.includes(KEY), "key must NEVER be in the URL");
    assert.equal(calls[0].headers["x-goog-api-key"], KEY);
    assert.ok(!calls[0].headers.authorization, "no bearer header on gemini");
    const body = JSON.parse(calls[0].body);
    assert.deepEqual(body.systemInstruction, { parts: [{ text: "be brief" }] });
    assert.equal(body.contents.length, 2, "system message excluded from contents");
    assert.equal(body.contents[1].role, "model", "assistant maps to model role");
    assert.deepEqual(body.generationConfig, { temperature: 0.2 });
    assert.equal(res.text, "Hi there");
  } finally {
    delete process.env.TEST_GEMINI_KEY;
  }
});

test("M17: gemini adapter streams via streamGenerateContent alt=sse", async () => {
  process.env.TEST_GEMINI_KEY = KEY;
  try {
    let seenUrl;
    const fetchImpl = async (url) => {
      seenUrl = url;
      return sseResponse([
        'data: {"candidates":[{"content":{"parts":[{"text":"One"}]}}]}\n\n',
        'data: {"candidates":[{"content":{"parts":[{"text":"Two"}]}}]}\n\n',
      ]);
    };
    const adapter = createProviderAdapter({ provider: "gemini", apiKeyEnv: "TEST_GEMINI_KEY", fetchImpl });
    const deltas = [];
    for await (const chunk of adapter.stream({ model: "gemini-pro", messages: [{ role: "user", content: "go" }] })) {
      deltas.push(chunk.delta);
    }
    assert.deepEqual(deltas, ["One", "Two"]);
    assert.match(seenUrl, /models\/gemini-pro:streamGenerateContent\?alt=sse$/);
    assert.ok(!seenUrl.includes(KEY), "key must NEVER be in the stream URL");
  } finally {
    delete process.env.TEST_GEMINI_KEY;
  }
});

// ── Fail-closed key handling + secret hygiene ──

test("M17: missing key fails CLOSED — throws before any network call, names env var not value", async () => {
  delete process.env.ARDYN_DEFINITELY_MISSING_KEY_XYZ;
  let called = false;
  const fetchImpl = async () => { called = true; return jsonResponse({}); };
  const adapter = createProviderAdapter({ provider: "openai", apiKeyEnv: "ARDYN_DEFINITELY_MISSING_KEY_XYZ", fetchImpl });
  await assert.rejects(
    () => adapter.generate({ model: "m", messages: [] }),
    (err) => {
      assert.match(err.message, /Missing API key/);
      assert.match(err.message, /ARDYN_DEFINITELY_MISSING_KEY_XYZ/, "error names the env VAR");
      assert.doesNotMatch(err.message, /sk-/, "no key material in error");
      return true;
    }
  );
  assert.equal(called, false, "fetch must NOT be called without a key");

  await assert.rejects(
    () => Array.fromAsync(adapter.stream({ model: "m", messages: [] })),
    /Missing API key/
  );
  assert.equal(called, false);
});

test("M17: no secret appears in errors (HTTP failure bodies are not echoed)", async () => {
  process.env.TEST_LEAKY_KEY = KEY;
  try {
    const leakyFetch = async () => ({
      ok: false,
      status: 401,
      statusText: "Unauthorized",
      json: async () => ({ error: `invalid key ${KEY}` }), // provider echoes the key
    });
    const adapter = createProviderAdapter({ provider: "openai", apiKeyEnv: "TEST_LEAKY_KEY", fetchImpl: leakyFetch });
    await assert.rejects(
      () => adapter.generate({ model: "m", messages: [] }),
      (err) => {
        assert.match(err.message, /HTTP 401/);
        assert.ok(!err.message.includes(KEY), "key value must NOT appear in error");
        return true;
      }
    );

    // Network-level rejection whose message contains the key gets redacted
    const evilFetch = async () => { throw new Error(`connect ECONNREFUSED token=${KEY}`); };
    const adapter2 = createProviderAdapter({ provider: "openai", apiKeyEnv: "TEST_LEAKY_KEY", fetchImpl: evilFetch });
    await assert.rejects(
      () => adapter2.generate({ model: "m", messages: [] }),
      (err) => !err.message.includes(KEY)
    );
  } finally {
    delete process.env.TEST_LEAKY_KEY;
  }
});

test("M17: keys load from gitignored secret file fallback", async () => {
  const dir = await mkdtemp(join(tmpdir(), "ardyn-m17-secrets-"));
  try {
    const secretFile = join(dir, "provider-keys.json");
    await writeFile(secretFile, JSON.stringify({ TEST_FILE_KEY_ENV: "file-key-abcdef" }));
    delete process.env.TEST_FILE_KEY_ENV;
    const calls = [];
    const fetchImpl = async (url, opts) => {
      calls.push(opts.headers);
      return jsonResponse({ choices: [{ message: { content: "ok" } }] });
    };
    const adapter = createProviderAdapter({ provider: "openai", apiKeyEnv: "TEST_FILE_KEY_ENV", secretFile, fetchImpl });
    const res = await adapter.generate({ model: "m", messages: [{ role: "user", content: "x" }] });
    assert.equal(calls[0].authorization, "Bearer file-key-abcdef");
    assert.equal(res.text, "ok");
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("M17: BYO model is required — Ardyn bundles no default", async () => {
  process.env.TEST_OPENAI_KEY = KEY;
  try {
    const fetchImpl = async () => jsonResponse({});
    const adapter = createProviderAdapter({ provider: "openai", apiKeyEnv: "TEST_OPENAI_KEY", fetchImpl });
    await assert.rejects(() => adapter.generate({ messages: [] }), /requires a model/);
  } finally {
    delete process.env.TEST_OPENAI_KEY;
  }
});

// ── Pluggable interface ──

test("M17: custom providers plug in via registerProviderFormat", async () => {
  registerProviderFormat("acme", {
    defaultBaseUrl: "https://acme.example/api",
    buildRequest({ baseUrl, apiKey, request }) {
      return {
        url: `${baseUrl}/ask`,
        headers: { "content-type": "application/json", "x-acme-key": apiKey },
        body: { q: request.messages.at(-1).content, size: request.maxTokens ?? 10 },
      };
    },
    parseResponse(json) {
      return { text: json.answer ?? "" };
    },
    parseStreamEvent(data) {
      try {
        const j = JSON.parse(data);
        return j.t ? { delta: j.t } : null;
      } catch { return null; }
    },
  });
  assert.ok(listProviderFormats().includes("acme"));

  process.env.TEST_ACME_KEY = "acme-key-123";
  try {
    const calls = [];
    const fetchImpl = async (url, opts) => {
      calls.push({ url, ...opts });
      return jsonResponse({ answer: "42" });
    };
    const adapter = createProviderAdapter({ provider: "acme", apiKeyEnv: "TEST_ACME_KEY", fetchImpl });
    const res = await adapter.generate({ model: "deep-thought", messages: [{ role: "user", content: "?" }] });
    assert.equal(calls[0].url, "https://acme.example/api/ask");
    assert.equal(calls[0].headers["x-acme-key"], "acme-key-123");
    assert.equal(JSON.parse(calls[0].body).size, 10);
    assert.equal(res.text, "42");
  } finally {
    delete process.env.TEST_ACME_KEY;
  }
});

test("M17: unknown provider fails closed with helpful message", () => {
  assert.throws(() => createProviderAdapter({ provider: "not-a-provider" }), /Unknown provider/);
});
