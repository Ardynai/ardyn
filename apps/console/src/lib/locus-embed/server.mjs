import { randomBytes, createPrivateKey, sign } from "node:crypto";
import { readFile } from "node:fs/promises";
import { createWebUiDirectoryLoader, createWebUiReplyHandler, verifyWebUiRegistration, } from "@multiverse/fabric-hub-protocol";
export const systemId = "ardyn";
export const capabilities = ["open"];
export const embedPath = "/";
/** Composition only: canonicalization and all signature verification live in the shared artifact. */
export function createLocusEmbedServer(env = process.env, fetcher = fetch) {
    const directory = createWebUiDirectoryLoader({
        systemId,
        registryOrigin: env.LOCUS_WEBUI_REGISTRY_ORIGIN ?? "",
        trustedRootDids: (env.FABRIC_HUB_TRUSTED_ROOT_DIDS ?? "")
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        minimumManifestVersion: Number(env.LOCUS_WEBUI_MIN_MANIFEST_VERSION),
        fetch: fetcher,
    });
    const load = async () => {
        const snapshot = await directory();
        const result = verifyWebUiRegistration(snapshot.registration, {
            ...snapshot.trust,
            now: Date.now(),
        });
        if (result.verdict === "reject")
            throw new Error(result.problems[0]);
        if (result.value.capabilities.some((cap) => !capabilities.includes(cap)) ||
            new URL(result.value.embedUrl).pathname !== embedPath)
            throw new Error("webui_deployment_mismatch");
        return snapshot;
    };
    const reply = createWebUiReplyHandler({
        load,
        allowedPaths: [embedPath],
        now: Date.now,
        nonce: () => randomBytes(16).toString("base64url"),
        sign: async (canonical) => {
            if (!env.LOCUS_WEBUI_SYSTEM_KEY_FILE)
                throw new Error("webui_signer_unavailable");
            try {
                const bytes = await readFile(env.LOCUS_WEBUI_SYSTEM_KEY_FILE);
                if (bytes.length > 16_384)
                    throw new Error("invalid key");
                const key = createPrivateKey(bytes);
                if (key.asymmetricKeyType !== "ed25519")
                    throw new Error("invalid key");
                return sign(null, Buffer.from(canonical), key).toString("base64url");
            }
            catch {
                throw new Error("webui_signer_unavailable");
            }
        },
    });
    const json = (value, status = 200) => Response.json(value, { status, headers: { "Cache-Control": "no-store" } });
    return {
        async GET() {
            try {
                return json(await load());
            }
            catch {
                return json({ error: "webui_trust_unavailable" }, 503);
            }
        },
        async POST(request) {
            if (request.headers.get("origin") !== new URL(request.url).origin)
                return json({ error: "origin-not-pinned" }, 403);
            try {
                const reader = request.body?.getReader();
                if (!reader)
                    return json({ error: "webui_message_invalid" }, 400);
                const chunks = [];
                let size = 0;
                try {
                    for (;;) {
                        const item = await reader.read();
                        if (item.done)
                            break;
                        size += item.value.length;
                        if (size > 65_536)
                            return json({ error: "webui_message_too_large" }, 413);
                        chunks.push(item.value);
                    }
                }
                finally {
                    await reader.cancel();
                }
                const bytes = new Uint8Array(size);
                let offset = 0;
                for (const chunk of chunks) {
                    bytes.set(chunk, offset);
                    offset += chunk.length;
                }
                return json(await reply(JSON.parse(new TextDecoder().decode(bytes))));
            }
            catch (error) {
                const code = error instanceof Error &&
                    /^(?:webui_[a-z_]+|signature-invalid|nonce-replayed|consent-denied|origin-not-pinned)$/.test(error.message)
                    ? error.message
                    : "webui_message_invalid";
                return json({ error: code }, code.endsWith("unavailable") || code === "webui_signer_mismatch" ? 503 : 400);
            }
        },
    };
}
