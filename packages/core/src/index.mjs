import { readFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { isAbsolute, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";

export const ARDYN_SCHEMA_VERSION = "0.1.0";
export const ARDYN_PHASE = "phase-2-schema-handshake";
export const HOST_CRATE_NAME = "ardyn-host";

const manifestSchemaUrl = new URL("../../../schemas/ardyn.manifest.schema.json", import.meta.url);
const capabilitySchemaUrl = new URL("../../../schemas/capability.schema.json", import.meta.url);
const taskSchemaUrl = new URL("../../../schemas/task.schema.json", import.meta.url);

function readJsonUrl(url) {
  return JSON.parse(readFileSync(fileURLToPath(url), "utf8"));
}

const ajv = new Ajv2020({ allErrors: true, strict: true });
const capabilitySchema = readJsonUrl(capabilitySchemaUrl);
const taskSchema = readJsonUrl(taskSchemaUrl);
const manifestSchema = readJsonUrl(manifestSchemaUrl);

ajv.addSchema(capabilitySchema);
ajv.addSchema(taskSchema);
ajv.addSchema(manifestSchema);

const manifestValidator = ajv.getSchema("https://schemas.ardyn.ai/ardyn.manifest.schema.json");

function requireManifestValidator() {
  if (!manifestValidator) {
    throw new Error("ARDYN manifest schema was not registered.");
  }

  return manifestValidator;
}

function resolveManifestPath(manifestPath) {
  return isAbsolute(manifestPath) ? manifestPath : resolve(process.cwd(), manifestPath);
}

function formatValidationErrors(errors) {
  return (errors ?? [])
    .map((error) => {
      const path = error.instancePath || "/";
      return `${path} ${error.message ?? "failed validation"}`;
    })
    .join("; ");
}

export async function loadManifest(manifestPath) {
  if (!manifestPath) {
    throw new Error("A manifest path is required.");
  }

  const absolutePath = resolveManifestPath(manifestPath);
  const manifest = JSON.parse(await readFile(absolutePath, "utf8"));
  const result = validateManifest(manifest);

  if (!result.valid) {
    throw new Error(`Invalid ARDYN manifest: ${formatValidationErrors(result.errors)}`);
  }

  return manifest;
}

export function validateManifest(manifest) {
  const validate = requireManifestValidator();
  const valid = validate(manifest);

  return {
    valid,
    errors: valid ? [] : [...(validate.errors ?? [])]
  };
}

export function normalizeCapabilities(manifest) {
  return [...manifest.capabilities]
    .sort((left, right) => left.id.localeCompare(right.id))
    .map((capability) => ({
      id: capability.id,
      kind: capability.kind,
      description: capability.description,
      permissions: [...capability.permissions]
        .sort((left, right) => {
          const scopeCompare = left.scope.localeCompare(right.scope);
          return scopeCompare === 0 ? left.access.localeCompare(right.access) : scopeCompare;
        })
        .map((permission) => ({
          scope: permission.scope,
          access: permission.access,
          ...(permission.reason === undefined ? {} : { reason: permission.reason })
        }))
    }));
}

export function createHostInfo() {
  return {
    crateName: HOST_CRATE_NAME,
    responsibilities: [
      "windows-first-local-host-safety",
      "process-supervision-boundary",
      "os-integration-boundary",
      "packaging-boundary"
    ]
  };
}

export function platformFamilyForNodePlatform(platform) {
  return platform === "win32" ? "windows" : "unix";
}

export function createPlatformInfo(platform = process.platform, arch = process.arch) {
  return {
    os: platform,
    arch,
    family: platformFamilyForNodePlatform(platform),
    isWindows: platform === "win32",
    windowsFirst: true
  };
}

export function createStaticIdentity() {
  return {
    name: "ardyn",
    schemaVersion: ARDYN_SCHEMA_VERSION,
    phase: ARDYN_PHASE,
    host: createHostInfo(),
    platform: createPlatformInfo(),
    executionEnabled: false,
    toolExecutionEnabled: false,
    autonomousExecutionEnabled: false,
    productionToolExecutionEnabled: false,
    networkListening: false
  };
}

export function createStaticHandshake(manifest, options = {}) {
  const validation = validateManifest(manifest);

  if (!validation.valid) {
    throw new Error(`Invalid ARDYN manifest: ${formatValidationErrors(validation.errors)}`);
  }

  return {
    schemaVersion: ARDYN_SCHEMA_VERSION,
    phase: ARDYN_PHASE,
    manifest: {
      path: options.manifestPath ?? null,
      schemaVersion: manifest.schemaVersion,
      name: manifest.name,
      version: manifest.version,
      description: manifest.description ?? null
    },
    runtime: {
      host: manifest.runtime.host,
      core: manifest.runtime.core,
      entrypoint: manifest.runtime.entrypoint ?? null
    },
    host: createHostInfo(),
    platform: createPlatformInfo(),
    capabilities: normalizeCapabilities(manifest),
    adapters: manifest.adapters ?? {},
    policies: manifest.policies ?? {},
    executionEnabled: false,
    toolExecutionEnabled: false,
    autonomousExecutionEnabled: false,
    productionToolExecutionEnabled: false,
    apiCallsEnabled: false,
    networkListening: false,
    longRunningServicesStarted: false,
    processesSpawned: false
  };
}

export async function createStaticHandshakeFromPath(manifestPath) {
  const manifest = await loadManifest(manifestPath);

  return createStaticHandshake(manifest, { manifestPath });
}

export function createDoctorReport() {
  const identity = createStaticIdentity();

  return {
    status: "ok",
    phase: identity.phase,
    host: identity.host,
    platform: identity.platform,
    executionEnabled: false,
    toolExecutionEnabled: false,
    networkListening: false
  };
}

export function manifestPathToUrl(manifestPath) {
  return pathToFileURL(resolveManifestPath(manifestPath)).href;
}
