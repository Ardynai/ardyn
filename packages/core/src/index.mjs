import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { isAbsolute, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";

export const ARDYN_SCHEMA_VERSION = "0.1.0";
export const ARDYN_PHASE = "phase-3-task-planning";
export const HOST_CRATE_NAME = "ardyn-host";
export const APPROVAL_REQUIRED = "approval-required";
export const APPROVAL_DENIED = "approval-denied";
export const APPROVAL_GRANTED = "approval-granted";
export const APPROVAL_STATUSES = Object.freeze([
  APPROVAL_REQUIRED,
  APPROVAL_DENIED,
  APPROVAL_GRANTED
]);
export const APPROVAL_DECISION_REQUIRED = "required";
export const APPROVAL_DECISION_DENIED = "denied";
export const APPROVAL_DECISION_GRANTED = "granted";
export const APPROVAL_DECISION_NOT_REQUIRED = "not_required";
export const APPROVAL_DECISION_STATUSES = Object.freeze([
  APPROVAL_DECISION_REQUIRED,
  APPROVAL_DECISION_DENIED,
  APPROVAL_DECISION_GRANTED,
  APPROVAL_DECISION_NOT_REQUIRED
]);

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
const taskValidator = ajv.getSchema("https://schemas.ardyn.ai/task.schema.json");
const supportedPermissionScopes = new Set(
  capabilitySchema.properties.permissions.items.properties.scope.enum
);

const NO_EXECUTION_SAFETY_FLAGS = Object.freeze({
  executionEnabled: false,
  toolExecutionEnabled: false,
  autonomousExecutionEnabled: false,
  productionToolExecutionEnabled: false,
  apiCallsEnabled: false,
  networkListening: false,
  longRunningServicesStarted: false,
  processesSpawned: false,
  pluginInstallEnabled: false,
  torrentDownloadEnabled: false,
  codePackEnablementEnabled: false,
  agentLoopEnabled: false
});

const DEFAULT_APPROVAL_CREATED_AT = "1970-01-01T00:00:00.000Z";
const APPROVAL_DECISION_STATUS_SET = new Set(APPROVAL_DECISION_STATUSES);
const CAPABILITY_MATCH_SCORES = Object.freeze({
  exact: 300,
  tag: 200,
  scope: 100
});
const CAPABILITY_MATCH_ORDER = Object.freeze({
  exact: 0,
  tag: 1,
  scope: 2
});

function compareAscii(left, right) {
  if (left === right) {
    return 0;
  }

  return left < right ? -1 : 1;
}

function requireManifestValidator() {
  if (!manifestValidator) {
    throw new Error("ARDYN manifest schema was not registered.");
  }

  return manifestValidator;
}

function requireTaskValidator() {
  if (!taskValidator) {
    throw new Error("ARDYN task schema was not registered.");
  }

  return taskValidator;
}

function resolveLocalPath(localPath) {
  return isAbsolute(localPath) ? localPath : resolve(process.cwd(), localPath);
}

function resolveManifestPath(manifestPath) {
  return resolveLocalPath(manifestPath);
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

export async function loadTask(taskPath) {
  if (!taskPath) {
    throw new Error("A task path is required.");
  }

  const absolutePath = resolveLocalPath(taskPath);
  const task = JSON.parse(await readFile(absolutePath, "utf8"));
  const result = validateTask(task);

  if (!result.valid) {
    throw new Error(`Invalid ARDYN task: ${formatValidationErrors(result.errors)}`);
  }

  return task;
}

export function validateManifest(manifest) {
  const validate = requireManifestValidator();
  const valid = validate(manifest);

  return {
    valid,
    errors: valid ? [] : [...(validate.errors ?? [])]
  };
}

export function validateTask(task) {
  const validate = requireTaskValidator();
  const valid = validate(task);

  return {
    valid,
    errors: valid ? [] : [...(validate.errors ?? [])]
  };
}

export function createNoExecutionSafetyFlags() {
  return { ...NO_EXECUTION_SAFETY_FLAGS };
}

export function supportedTaskCapabilityScopes() {
  return [...supportedPermissionScopes].sort(compareAscii);
}

export function isSupportedPermissionScope(value) {
  return supportedPermissionScopes.has(value);
}

export function normalizeCapabilities(manifest) {
  return [...manifest.capabilities]
    .sort((left, right) => compareAscii(left.id, right.id))
    .map((capability) => ({
      id: capability.id,
      kind: capability.kind,
      description: capability.description,
      ...(capability.tags === undefined
        ? {}
        : {
            tags: [...capability.tags].sort(compareAscii)
          }),
      permissions: [...capability.permissions]
        .sort((left, right) => {
          const scopeCompare = compareAscii(left.scope, right.scope);
          return scopeCompare === 0 ? compareAscii(left.access, right.access) : scopeCompare;
        })
        .map((permission) => ({
          scope: permission.scope,
          access: permission.access,
          ...(permission.reason === undefined ? {} : { reason: permission.reason })
        }))
    }));
}

function normalizeTask(task) {
  return {
    id: task.id,
    objective: task.objective,
    mode: task.mode,
    requestedCapabilities: [...task.requestedCapabilities],
    ...(task.constraints === undefined
      ? {}
      : {
          constraints: { ...task.constraints }
        }),
    ...(task.inputs === undefined
      ? {}
      : {
          inputs: { ...task.inputs }
        }),
    ...(task.metadata === undefined
      ? {}
      : {
          metadata: { ...task.metadata }
        })
  };
}

function countDuplicates(values) {
  const counts = new Map();

  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }

  return [...counts.entries()]
    .filter(([, count]) => count > 1)
    .map(([value]) => value)
    .sort(compareAscii);
}

function uniqueInRequestOrder(values) {
  const seen = new Set();
  const uniqueValues = [];

  for (const value of values) {
    if (seen.has(value)) {
      continue;
    }

    seen.add(value);
    uniqueValues.push(value);
  }

  return uniqueValues;
}

function capabilityHasScope(capability, scope) {
  return capability.permissions.some((permission) => permission.scope === scope);
}

function capabilityHasTag(capability, tag) {
  return capability.tags?.includes(tag) === true;
}

function compareCapabilityCandidates(left, right) {
  const scoreCompare = right.score - left.score;

  if (scoreCompare !== 0) {
    return scoreCompare;
  }

  const capabilityCompare = compareAscii(left.capabilityId, right.capabilityId);

  if (capabilityCompare !== 0) {
    return capabilityCompare;
  }

  return CAPABILITY_MATCH_ORDER[left.matchType] - CAPABILITY_MATCH_ORDER[right.matchType];
}

function createCapabilityCandidate(capabilityId, matchType, request) {
  if (matchType === "exact") {
    return {
      capabilityId,
      matchType,
      score: CAPABILITY_MATCH_SCORES.exact,
      scope: null,
      tag: null,
      reason: "Matched exact capability id."
    };
  }

  if (matchType === "tag") {
    return {
      capabilityId,
      matchType,
      score: CAPABILITY_MATCH_SCORES.tag,
      scope: null,
      tag: request,
      reason: "Matched capability tag."
    };
  }

  return {
    capabilityId,
    matchType,
    score: CAPABILITY_MATCH_SCORES.scope,
    scope: request,
    tag: null,
    reason: "Matched permission scope."
  };
}

function candidateMatchesForRequest(capability, request) {
  const candidates = [];

  if (capability.id === request) {
    candidates.push(createCapabilityCandidate(capability.id, "exact", request));
  }

  if (capabilityHasTag(capability, request)) {
    candidates.push(createCapabilityCandidate(capability.id, "tag", request));
  }

  if (capabilityHasScope(capability, request)) {
    candidates.push(createCapabilityCandidate(capability.id, "scope", request));
  }

  return candidates;
}

function selectedCapabilityIdsForCandidates(candidates) {
  if (candidates.length === 0) {
    return [];
  }

  const selectedScore = candidates[0].score;
  const selectedIds = new Set();

  for (const candidate of candidates) {
    if (candidate.score !== selectedScore) {
      continue;
    }

    selectedIds.add(candidate.capabilityId);
  }

  return [...selectedIds].sort(compareAscii);
}

function reasonForSelectedMatch(matchType) {
  if (matchType === "exact") {
    return "Matched exact capability id.";
  }

  if (matchType === "tag") {
    return "Matched capability tag.";
  }

  return "Matched permission scope.";
}

function createNoMatchResolution(request) {
  const isScopeRequest = isSupportedPermissionScope(request);

  return {
    request,
    matchType: "no-match",
    scope: isScopeRequest ? request : null,
    capabilityIds: [],
    selectedCapabilityIds: [],
    candidates: [],
    reason: isScopeRequest
      ? "No capabilities declared for requested permission scope."
      : "No exact capability id, capability tag, or supported permission scope matched."
  };
}

export function resolveTaskCapabilities(manifest, requestedCapabilities) {
  const capabilities = normalizeCapabilities(manifest);
  const capabilitiesById = new Map(capabilities.map((capability) => [capability.id, capability]));
  const selectedById = new Map();
  const resolutions = [];
  const unresolvedRequests = [];

  for (const request of uniqueInRequestOrder(requestedCapabilities)) {
    const candidates = capabilities
      .flatMap((capability) => candidateMatchesForRequest(capability, request))
      .sort(compareCapabilityCandidates);
    const selectedCapabilityIds = selectedCapabilityIdsForCandidates(candidates);

    if (selectedCapabilityIds.length === 0) {
      unresolvedRequests.push(request);
      resolutions.push(createNoMatchResolution(request));
      continue;
    }

    for (const capabilityId of selectedCapabilityIds) {
      selectedById.set(capabilityId, capabilitiesById.get(capabilityId));
    }

    const matchType = candidates[0].matchType;

    resolutions.push({
      request,
      matchType,
      scope: matchType === "scope" ? request : null,
      capabilityIds: selectedCapabilityIds,
      selectedCapabilityIds,
      candidates,
      reason: reasonForSelectedMatch(matchType)
    });
  }

  return {
    selectedCapabilities: [...selectedById.values()].sort((left, right) =>
      compareAscii(left.id, right.id)
    ),
    resolutions,
    unresolvedRequests: unresolvedRequests.sort(compareAscii),
    duplicateRequestedCapabilities: countDuplicates(requestedCapabilities)
  };
}

function createApprovalGate(manifest, task, selectedCapabilities) {
  const reasons = [];

  if (task.constraints?.requireHumanApproval === true) {
    reasons.push({
      type: "task-constraint",
      field: "constraints.requireHumanApproval"
    });
  }

  const approvalScopes = new Set(manifest.policies?.requiresApprovalFor ?? []);

  for (const capability of selectedCapabilities) {
    for (const permission of capability.permissions) {
      if (!approvalScopes.has(permission.scope)) {
        continue;
      }

      reasons.push({
        type: "policy-scope",
        capabilityId: capability.id,
        scope: permission.scope,
        access: permission.access
      });
    }
  }

  return {
    required: reasons.length > 0,
    status: reasons.length > 0 ? APPROVAL_REQUIRED : null,
    reasons
  };
}

function stableJsonValue(value) {
  if (Array.isArray(value)) {
    return value.map(stableJsonValue);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, entryValue]) => entryValue !== undefined)
        .sort(([left], [right]) => compareAscii(left, right))
        .map(([key, entryValue]) => [key, stableJsonValue(entryValue)])
    );
  }

  return value;
}

function stableJsonStringify(value) {
  return JSON.stringify(stableJsonValue(value));
}

function approvalDecisionReason(status, approvalRequired) {
  if (status === APPROVAL_DECISION_DENIED) {
    return "Approval was denied by simulated planner input.";
  }

  if (status === APPROVAL_DECISION_GRANTED) {
    return "Approval was granted by simulated planner input; execution remains disabled.";
  }

  if (status === APPROVAL_DECISION_NOT_REQUIRED) {
    return "Approval is not required for this non-executing plan.";
  }

  return approvalRequired
    ? "Approval is required before any future execution."
    : "Approval remains required only when constraints or policies request it.";
}

function createApprovalDecision(task, approval, selectedCapabilities, options) {
  const input = options.approvalDecision;
  const status = input?.status ?? (approval.required ? APPROVAL_DECISION_REQUIRED : APPROVAL_DECISION_NOT_REQUIRED);

  if (!APPROVAL_DECISION_STATUS_SET.has(status)) {
    throw new Error(`Invalid approval decision status: ${status}`);
  }

  if (!approval.required && status !== APPROVAL_DECISION_NOT_REQUIRED) {
    throw new Error(`Cannot apply approval decision status ${status} when approval is not required.`);
  }

  if (approval.required && status === APPROVAL_DECISION_NOT_REQUIRED) {
    throw new Error("Cannot apply approval decision status not_required when approval is required.");
  }

  const selectedCapabilityIds = selectedCapabilities.map((capability) => capability.id).sort(compareAscii);
  const recordWithoutId = {
    taskId: task.id,
    requestedCapabilityIds: selectedCapabilityIds,
    status,
    reason: input?.reason ?? approvalDecisionReason(status, approval.required),
    createdAt: options.createdAt ?? DEFAULT_APPROVAL_CREATED_AT,
    nonExecuting: true
  };
  const preimage = {
    ...recordWithoutId,
    approvalRequired: approval.required,
    approvalReasons: approval.reasons
  };
  const hash = createHash("sha256").update(stableJsonStringify(preimage)).digest("hex");

  return {
    id: `approval.${hash.slice(0, 16)}`,
    ...recordWithoutId
  };
}

function approvalGateStatusForDecision(status) {
  if (status === APPROVAL_DECISION_DENIED) {
    return APPROVAL_DENIED;
  }

  if (status === APPROVAL_DECISION_GRANTED) {
    return APPROVAL_GRANTED;
  }

  if (status === APPROVAL_DECISION_REQUIRED) {
    return APPROVAL_REQUIRED;
  }

  return null;
}

function createPlannerTrace({
  manifest,
  task,
  taskValidation,
  resolution,
  approvalDecision,
  safety
}) {
  return {
    taskIntake: {
      valid: taskValidation.valid,
      errors: taskValidation.errors,
      taskId: task.id,
      requestedCapabilities: [...task.requestedCapabilities]
    },
    manifest: {
      id: manifest.name,
      version: manifest.version,
      schemaVersion: manifest.schemaVersion
    },
    candidateCapabilities: resolution.resolutions.map((taskResolution) => ({
      request: taskResolution.request,
      candidates: taskResolution.candidates
    })),
    selectedCapabilities: resolution.selectedCapabilities.map((capability) => capability.id),
    unresolvedRequests: [...resolution.unresolvedRequests],
    approvalDecision,
    safety: { ...safety }
  };
}

export function createTaskPlan(manifest, task, options = {}) {
  const manifestValidation = validateManifest(manifest);

  if (!manifestValidation.valid) {
    throw new Error(`Invalid ARDYN manifest: ${formatValidationErrors(manifestValidation.errors)}`);
  }

  const taskValidation = validateTask(task);

  if (!taskValidation.valid) {
    throw new Error(`Invalid ARDYN task: ${formatValidationErrors(taskValidation.errors)}`);
  }

  const resolution = resolveTaskCapabilities(manifest, task.requestedCapabilities);
  const approvalGate = createApprovalGate(manifest, task, resolution.selectedCapabilities);
  const approvalDecision = createApprovalDecision(task, approvalGate, resolution.selectedCapabilities, options);
  const approval = {
    ...approvalGate,
    status: approvalGateStatusForDecision(approvalDecision.status)
  };
  const safety = createNoExecutionSafetyFlags();
  const plannerTrace = createPlannerTrace({
    manifest,
    task,
    taskValidation,
    resolution,
    approvalDecision,
    safety
  });

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
    taskPath: options.taskPath ?? null,
    task: normalizeTask(task),
    requestedCapabilities: [...task.requestedCapabilities],
    duplicateRequestedCapabilities: resolution.duplicateRequestedCapabilities,
    matchingPolicy: {
      exactCapabilityId: true,
      permissionScope: true,
      tags: true
    },
    resolutions: resolution.resolutions,
    selectedCapabilities: resolution.selectedCapabilities,
    unresolvedRequests: resolution.unresolvedRequests,
    approval,
    approvalDecision,
    plannerTrace,
    safety
  };
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
    networkListening: false,
    pluginInstallEnabled: false,
    torrentDownloadEnabled: false,
    codePackEnablementEnabled: false,
    agentLoopEnabled: false
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
    processesSpawned: false,
    pluginInstallEnabled: false,
    torrentDownloadEnabled: false,
    codePackEnablementEnabled: false,
    agentLoopEnabled: false
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
    networkListening: false,
    pluginInstallEnabled: false,
    torrentDownloadEnabled: false,
    codePackEnablementEnabled: false,
    agentLoopEnabled: false
  };
}

export function manifestPathToUrl(manifestPath) {
  return pathToFileURL(resolveManifestPath(manifestPath)).href;
}
