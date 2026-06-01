import assert from "node:assert/strict";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import {
  createStaticHandshake,
  loadManifest,
  normalizeCapabilities,
  validateManifest
} from "../packages/core/src/index.mjs";

test("loads and validates the minimal manifest from disk", async () => {
  const manifest = await loadManifest("examples/minimal-manifest/ardyn.manifest.json");
  const result = validateManifest(manifest);

  assert.equal(result.valid, true, JSON.stringify(result.errors, null, 2));
  assert.equal(manifest.schemaVersion, "0.1.0");
  assert.equal(manifest.runtime.host, "rust");
  assert.equal(manifest.runtime.core, "typescript");
});

test("rejects invalid manifests with schema errors", () => {
  const result = validateManifest({
    schemaVersion: "0.1.0",
    name: "invalid-empty-agent",
    version: "0.1.0",
    runtime: {
      host: "rust",
      core: "typescript"
    },
    capabilities: []
  });

  assert.equal(result.valid, false);
  assert.match(JSON.stringify(result.errors), /minItems/);
});

test("loadManifest rejects invalid manifest files", async () => {
  const dir = await mkdtemp(join(tmpdir(), "ardyn-invalid-"));
  const manifestPath = join(dir, "ardyn.manifest.json");
  await writeFile(
    manifestPath,
    JSON.stringify({
      schemaVersion: "0.1.0",
      name: "invalid-entry",
      version: "0.1.0",
      runtime: {
        host: "rust",
        core: "typescript"
      },
      capabilities: []
    }),
    "utf8"
  );

  await assert.rejects(() => loadManifest(manifestPath), /Invalid ARDYN manifest/);
});

test("normalizes capabilities into deterministic registry-safe summaries", async () => {
  const manifest = await loadManifest("examples/minimal-manifest/ardyn.manifest.json");
  const capabilities = normalizeCapabilities(manifest);

  assert.deepEqual(capabilities, [
    {
      id: "runtime.describe",
      kind: "tool",
      description: "Describe ARDYN runtime metadata without executing autonomous actions.",
      permissions: [
        {
          scope: "registry",
          access: "read",
          reason: "Read declared capabilities and adapter metadata."
        }
      ]
    }
  ]);
});

test("static handshake disables execution, tool execution, and network listening", async () => {
  const manifest = await loadManifest("examples/minimal-manifest/ardyn.manifest.json");
  const handshake = createStaticHandshake(manifest, {
    manifestPath: "examples/minimal-manifest/ardyn.manifest.json"
  });

  assert.equal(handshake.phase, "phase-2-schema-handshake");
  assert.equal(handshake.executionEnabled, false);
  assert.equal(handshake.toolExecutionEnabled, false);
  assert.equal(handshake.networkListening, false);
  assert.equal(handshake.runtime.host, "rust");
  assert.equal(handshake.runtime.core, "typescript");
  assert.equal(handshake.manifest.path, "examples/minimal-manifest/ardyn.manifest.json");
  assert.deepEqual(handshake.capabilities.map((capability) => capability.id), ["runtime.describe"]);
});
