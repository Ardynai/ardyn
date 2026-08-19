// M4: Fabric federation pre-wiring hardening tests
// Tests the 5 hardening requirements from FEDERATION-SECURITY-AUDIT.md
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import test from "node:test";

const federationSrc = await readFile(
  fileURLToPath(new URL("../packages/fabric/src/federation.mjs", import.meta.url)),
  "utf8"
);

test("M4 HIGH-1: requestRaw uses redirect:manual (no SSRF via redirects)", () => {
  assert.match(federationSrc, /redirect:\s*["']manual["']/, "must set redirect:manual");
  assert.match(federationSrc, /redirect_blocked/, "must have redirect_blocked error code");
});

test("M4 INFO-3: response-size cap is present", () => {
  assert.match(federationSrc, /maxResponseBytes/, "must have maxResponseBytes cap");
  assert.match(federationSrc, /response_too_large/, "must have response_too_large error code");
});

test("M4 MEDIUM-1: registry host allowlist is present", () => {
  assert.match(federationSrc, /registryHostAllowlist/, "must support registry host allowlist");
  assert.match(federationSrc, /registry_host_not_allowed/, "must have registry_host_not_allowed error code");
});

test("M4 MEDIUM-2: identity-file path confinement is present", () => {
  assert.match(federationSrc, /identity_file_path_unconfined/, "must reject unconfined identity file paths");
  assert.match(federationSrc, /\.\.\//, "must check for ../ traversal");
});

test("M4: federation source does not add forbidden dependencies", async () => {
  assert.doesNotMatch(federationSrc, /@multiverse\/fabric-core/i, "must not import fabric-core");
  assert.doesNotMatch(federationSrc, /libp2p|bittorrent|dht|swarm|p2p/i, "must not reference P2P/DHT");
  assert.doesNotMatch(federationSrc, /\.decrypt\s*\(/i, "must not decrypt payloads");
});