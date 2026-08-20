// @ardyn/sdk — consumer-facing SDK
// M5: Real SDK source for consumers (Locus/Multiverse)

export const ARDYN_SDK_VERSION = "0.1.0";

/**
 * Load and validate an Ardyn manifest from a path or URL.
 * @param {string} manifestPath — path to the manifest JSON file
 * @returns {Promise<object>} validated manifest
 */
export async function loadManifest(manifestPath) {
  const { readFile } = await import("node:fs/promises");
  const content = await readFile(manifestPath, "utf8");
  const manifest = JSON.parse(content);
  if (manifest.schema !== "ardyn.manifest") {
    throw new Error(`Invalid manifest schema: ${manifest.schema}`);
  }
  return manifest;
}

/**
 * Create a session plan from a manifest and task.
 * @param {object} manifest — validated Ardyn manifest
 * @param {object} task — task definition
 * @returns {object} session plan
 */
export function createPlan(manifest, task) {
  return {
    schema: "ardyn.session-plan",
    schemaVersion: "0.1.0",
    manifestId: manifest.id ?? "unknown",
    taskId: task.id ?? "unknown",
    objective: task.objective ?? "",
    mode: task.mode ?? "plan",
    capabilities: task.requestedCapabilities ?? [],
    createdAt: new Date().toISOString(),
  };
}

/**
 * Validate a session transcript.
 * @param {object} transcript — session transcript to validate
 * @returns {object} validation result
 */
export function validateTranscript(transcript) {
  if (!transcript || typeof transcript !== "object") {
    return { valid: false, error: "Transcript must be an object" };
  }
  if (transcript.schema !== "ardyn.session-transcript") {
    return { valid: false, error: `Invalid schema: ${transcript.schema}` };
  }
  if (!Array.isArray(transcript.events)) {
    return { valid: false, error: "Transcript must have events array" };
  }
  return { valid: true, error: null };
}

/**
 * Get the Ardyn SDK version.
 * @returns {string} version string
 */
export function getVersion() {
  return ARDYN_SDK_VERSION;
}

// M5: Re-export core utilities — consumers can import these from the SDK
// In a workspace setup, @ardyn/core resolves to packages/core
// For standalone use, consumers import directly from @ardyn/core