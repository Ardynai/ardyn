import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { isAbsolute, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";

export const ARDYN_SCHEMA_VERSION = "0.1.0";
export const ARDYN_PHASE = "phase-3-task-planning";
export const APPROVAL_REVIEW_ARTIFACT_SCHEMA = "ardyn.approval-review-artifact";
export const APPROVAL_REVIEW_ARTIFACT_VERSION = "0.1.0";
export const SCHEMA_MIGRATION_METADATA_SCHEMA = "ardyn.schema-migration-metadata";
export const SCHEMA_MIGRATION_METADATA_VERSION = "0.1.0";
export const REVIEW_ARTIFACT_ATTESTATION_PLAN_SCHEMA =
  "ardyn.review-artifact-attestation-plan";
export const REVIEW_ARTIFACT_ATTESTATION_PLAN_VERSION = "0.1.0";
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
const DEFAULT_APPROVAL_REVIEW_GENERATED_AT = "1970-01-01T00:00:00.000Z";
const APPROVAL_DECISION_STATUS_SET = new Set(APPROVAL_DECISION_STATUSES);
const APPROVAL_REVIEW_ARTIFACT_COMPATIBLE = "compatible";
const APPROVAL_REVIEW_ARTIFACT_UPGRADE_AVAILABLE = "upgrade_available";
const APPROVAL_REVIEW_ARTIFACT_UNSUPPORTED_MAJOR = "unsupported_major";
const APPROVAL_REVIEW_ARTIFACT_MALFORMED = "malformed";
const SCHEMA_MIGRATION_ARTIFACT_KINDS = Object.freeze([
  "manifest",
  "task",
  "planner_trace",
  "approval_review_artifact",
  "trace_diff",
  "host_policy"
]);
const SCHEMA_MIGRATION_ARTIFACT_KIND_SET = new Set(SCHEMA_MIGRATION_ARTIFACT_KINDS);
const SCHEMA_COMPATIBILITY_STATES = Object.freeze([
  APPROVAL_REVIEW_ARTIFACT_COMPATIBLE,
  APPROVAL_REVIEW_ARTIFACT_UPGRADE_AVAILABLE,
  APPROVAL_REVIEW_ARTIFACT_UNSUPPORTED_MAJOR,
  APPROVAL_REVIEW_ARTIFACT_MALFORMED
]);
const REVIEW_ARTIFACT_ATTESTATION_STATUSES = Object.freeze([
  "unsigned",
  "planned",
  "test_fixture_only",
  "unsupported"
]);
const REVIEW_ARTIFACT_ATTESTATION_STATUS_SET = new Set(REVIEW_ARTIFACT_ATTESTATION_STATUSES);
const APPROVAL_REVIEW_ARTIFACT_SUPPORTED_SCHEMA_MAJOR = 0;
const APPROVAL_REVIEW_ARTIFACT_SUPPORTED_VERSION_MAJOR = 0;
const APPROVAL_REVIEW_ARTIFACT_KNOWN_FIELDS = Object.freeze([
  "schema",
  "schemaVersion",
  "version",
  "generatedAt",
  "nonExecuting",
  "taskId",
  "manifest",
  "requestedCapabilityIds",
  "candidateRankings",
  "selectedCapabilities",
  "unresolvedRequests",
  "approvalDecision",
  "safety"
]);
const APPROVAL_REVIEW_ARTIFACT_KNOWN_FIELD_SET = new Set(APPROVAL_REVIEW_ARTIFACT_KNOWN_FIELDS);
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

const SCHEMA_METADATA_BY_ARTIFACT_KIND = Object.freeze({
  manifest: {
    schemaId: "https://schemas.ardyn.ai/ardyn.manifest.schema.json",
    currentSchemaVersion: ARDYN_SCHEMA_VERSION
  },
  task: {
    schemaId: "https://schemas.ardyn.ai/task.schema.json",
    currentSchemaVersion: ARDYN_SCHEMA_VERSION
  },
  planner_trace: {
    schemaId: "ardyn.planner-trace",
    currentSchemaVersion: ARDYN_SCHEMA_VERSION
  },
  approval_review_artifact: {
    schemaId: APPROVAL_REVIEW_ARTIFACT_SCHEMA,
    currentSchemaVersion: ARDYN_SCHEMA_VERSION,
    currentArtifactVersion: APPROVAL_REVIEW_ARTIFACT_VERSION
  },
  trace_diff: {
    schemaId: "ardyn.trace-diff",
    currentSchemaVersion: ARDYN_SCHEMA_VERSION
  },
  host_policy: {
    schemaId: "ardyn.host-policy",
    currentSchemaVersion: ARDYN_SCHEMA_VERSION
  }
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

function semverMajor(value) {
  if (typeof value !== "string") {
    return null;
  }

  const match = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/.exec(value);
  return match ? Number(match[1]) : null;
}

function validateSemverMajor(errors, value, path) {
  const major = semverMajor(value);

  if (major === null) {
    errors.push(`${path} must be a semantic version string`);
  }

  return major;
}

function dataProperty(source, key) {
  if (!source || typeof source !== "object") {
    return undefined;
  }

  const descriptor = Object.getOwnPropertyDescriptor(source, key);
  return descriptor && "value" in descriptor ? descriptor.value : undefined;
}

function safeDisplayValue(value, seen = new WeakSet()) {
  if (value === null || typeof value === "string" || typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : String(value);
  }

  if (typeof value === "bigint") {
    return value.toString();
  }

  if (Array.isArray(value)) {
    return value.map((entry) => safeDisplayValue(entry, seen));
  }

  if (value && typeof value === "object") {
    if (seen.has(value)) {
      return "[circular]";
    }

    seen.add(value);

    const descriptors = Object.getOwnPropertyDescriptors(value);
    const result = Object.fromEntries(
      Object.entries(descriptors)
        .filter(([, descriptor]) => descriptor.enumerable)
        .filter(([, descriptor]) => "value" in descriptor && descriptor.value !== undefined)
        .sort(([left], [right]) => compareAscii(left, right))
        .map(([key, descriptor]) => [key, safeDisplayValue(descriptor.value, seen)])
    );

    seen.delete(value);
    return result;
  }

  if (typeof value === "undefined") {
    return null;
  }

  return `[${typeof value}]`;
}

function displayString(value) {
  return typeof value === "string" ? value : null;
}

function displayBoolean(value) {
  return typeof value === "boolean" ? value : null;
}

function displayStringArray(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((entry) => safeDisplayValue(entry))
    .filter((entry) => typeof entry === "string")
    .sort(compareAscii);
}

function displaySafetyFlags(safety) {
  const flags = {};

  for (const key of Object.keys(NO_EXECUTION_SAFETY_FLAGS)) {
    const value = dataProperty(safety, key);
    flags[key] = value === undefined ? null : safeDisplayValue(value);
  }

  return flags;
}

function allDisplaySafetyFlagsFalse(flags) {
  return Object.keys(NO_EXECUTION_SAFETY_FLAGS).every((key) => flags[key] === false);
}

function normalizeDisplayManifest(manifest) {
  return {
    id: displayString(dataProperty(manifest, "id")),
    version: displayString(dataProperty(manifest, "version")),
    schemaVersion: displayString(dataProperty(manifest, "schemaVersion"))
  };
}

function normalizeDisplayApprovalDecision(approvalDecision) {
  return {
    id: displayString(dataProperty(approvalDecision, "id")),
    taskId: displayString(dataProperty(approvalDecision, "taskId")),
    requestedCapabilityIds: displayStringArray(
      dataProperty(approvalDecision, "requestedCapabilityIds")
    ),
    status: displayString(dataProperty(approvalDecision, "status")),
    reason: displayString(dataProperty(approvalDecision, "reason")),
    createdAt: displayString(dataProperty(approvalDecision, "createdAt")),
    nonExecuting: displayBoolean(dataProperty(approvalDecision, "nonExecuting"))
  };
}

function normalizeDisplayCandidate(candidate) {
  return {
    rank: safeDisplayValue(dataProperty(candidate, "rank")),
    capabilityId: displayString(dataProperty(candidate, "capabilityId")),
    matchType: displayString(dataProperty(candidate, "matchType")),
    score: safeDisplayValue(dataProperty(candidate, "score")),
    scope: safeDisplayValue(dataProperty(candidate, "scope")),
    tag: safeDisplayValue(dataProperty(candidate, "tag")),
    reason: displayString(dataProperty(candidate, "reason"))
  };
}

function displayRank(candidate) {
  return typeof candidate.rank === "number" ? candidate.rank : Number.MAX_SAFE_INTEGER;
}

function normalizeDisplayCandidateRankings(candidateRankings) {
  if (!Array.isArray(candidateRankings)) {
    return [];
  }

  return candidateRankings
    .map((ranking) => {
      const candidates = Array.isArray(dataProperty(ranking, "candidates"))
        ? dataProperty(ranking, "candidates").map(normalizeDisplayCandidate)
        : [];

      return {
        request: displayString(dataProperty(ranking, "request")),
        candidates: candidates.sort((left, right) => {
          const rankCompare = displayRank(left) - displayRank(right);
          return rankCompare === 0
            ? compareAscii(left.capabilityId ?? "", right.capabilityId ?? "")
            : rankCompare;
        })
      };
    })
    .sort((left, right) => compareAscii(left.request ?? "", right.request ?? ""));
}

function displayUnknownFields(artifact) {
  if (!validationObject(artifact)) {
    return {
      unknownFields: [],
      unknown: {}
    };
  }

  const descriptors = Object.getOwnPropertyDescriptors(artifact);
  const unknownFields = Object.entries(descriptors)
    .filter(([key, descriptor]) => descriptor.enumerable && !APPROVAL_REVIEW_ARTIFACT_KNOWN_FIELD_SET.has(key))
    .map(([key]) => key)
    .sort(compareAscii);
  const unknown = Object.fromEntries(
    unknownFields.map((key) => {
      const descriptor = descriptors[key];
      return [key, "value" in descriptor ? safeDisplayValue(descriptor.value) : "[accessor omitted]"];
    })
  );

  return {
    unknownFields,
    unknown
  };
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

function copyApprovalDecision(approvalDecision) {
  return {
    id: approvalDecision.id,
    taskId: approvalDecision.taskId,
    requestedCapabilityIds: [...approvalDecision.requestedCapabilityIds],
    status: approvalDecision.status,
    reason: approvalDecision.reason,
    createdAt: approvalDecision.createdAt,
    nonExecuting: approvalDecision.nonExecuting
  };
}

function copySafetyFlags(safety) {
  return {
    executionEnabled: safety.executionEnabled,
    toolExecutionEnabled: safety.toolExecutionEnabled,
    autonomousExecutionEnabled: safety.autonomousExecutionEnabled,
    productionToolExecutionEnabled: safety.productionToolExecutionEnabled,
    apiCallsEnabled: safety.apiCallsEnabled,
    networkListening: safety.networkListening,
    longRunningServicesStarted: safety.longRunningServicesStarted,
    processesSpawned: safety.processesSpawned,
    pluginInstallEnabled: safety.pluginInstallEnabled,
    torrentDownloadEnabled: safety.torrentDownloadEnabled,
    codePackEnablementEnabled: safety.codePackEnablementEnabled,
    agentLoopEnabled: safety.agentLoopEnabled
  };
}

function plannerTraceFromReviewSource(source) {
  const trace = source?.plannerTrace ?? source;

  if (!trace || typeof trace !== "object" || !trace.taskIntake || !trace.manifest) {
    throw new Error("A TaskPlan or PlannerTrace is required to create an approval review artifact.");
  }

  return trace;
}

function createCandidateRankings(trace) {
  return trace.candidateCapabilities.map((ranking) => ({
    request: ranking.request,
    candidates: ranking.candidates.map((candidate, index) => ({
      rank: index + 1,
      capabilityId: candidate.capabilityId,
      matchType: candidate.matchType,
      score: candidate.score,
      scope: candidate.scope,
      tag: candidate.tag,
      reason: candidate.reason
    }))
  }));
}

export function createApprovalReviewArtifact(source, options = {}) {
  const trace = plannerTraceFromReviewSource(source);

  return {
    schema: APPROVAL_REVIEW_ARTIFACT_SCHEMA,
    schemaVersion: ARDYN_SCHEMA_VERSION,
    version: APPROVAL_REVIEW_ARTIFACT_VERSION,
    generatedAt: options.generatedAt ?? DEFAULT_APPROVAL_REVIEW_GENERATED_AT,
    nonExecuting: true,
    taskId: trace.taskIntake.taskId,
    manifest: {
      id: trace.manifest.id,
      version: trace.manifest.version,
      schemaVersion: trace.manifest.schemaVersion
    },
    requestedCapabilityIds: [...trace.taskIntake.requestedCapabilities],
    candidateRankings: createCandidateRankings(trace),
    selectedCapabilities: [...trace.selectedCapabilities],
    unresolvedRequests: [...trace.unresolvedRequests],
    approvalDecision: copyApprovalDecision(trace.approvalDecision),
    safety: copySafetyFlags(trace.safety)
  };
}

export function validateApprovalReviewArtifactVersion(artifact) {
  const errors = [];

  if (!validationObject(artifact)) {
    return {
      valid: false,
      compatibility: APPROVAL_REVIEW_ARTIFACT_MALFORMED,
      errors: ["artifact must be an object"]
    };
  }

  if (dataProperty(artifact, "schema") !== APPROVAL_REVIEW_ARTIFACT_SCHEMA) {
    errors.push(`schema must be ${APPROVAL_REVIEW_ARTIFACT_SCHEMA}`);
  }

  const schemaVersionMajor = validateSemverMajor(
    errors,
    dataProperty(artifact, "schemaVersion"),
    "schemaVersion"
  );
  const versionMajor = validateSemverMajor(errors, dataProperty(artifact, "version"), "version");

  if (errors.length > 0) {
    return {
      valid: false,
      compatibility: APPROVAL_REVIEW_ARTIFACT_MALFORMED,
      errors
    };
  }

  if (
    schemaVersionMajor !== APPROVAL_REVIEW_ARTIFACT_SUPPORTED_SCHEMA_MAJOR ||
    versionMajor !== APPROVAL_REVIEW_ARTIFACT_SUPPORTED_VERSION_MAJOR
  ) {
    const unsupportedErrors = [];

    if (schemaVersionMajor !== APPROVAL_REVIEW_ARTIFACT_SUPPORTED_SCHEMA_MAJOR) {
      unsupportedErrors.push(
        `schemaVersion major ${schemaVersionMajor} is unsupported; supported major is ${APPROVAL_REVIEW_ARTIFACT_SUPPORTED_SCHEMA_MAJOR}`
      );
    }

    if (versionMajor !== APPROVAL_REVIEW_ARTIFACT_SUPPORTED_VERSION_MAJOR) {
      unsupportedErrors.push(
        `version major ${versionMajor} is unsupported; supported major is ${APPROVAL_REVIEW_ARTIFACT_SUPPORTED_VERSION_MAJOR}`
      );
    }

    return {
      valid: false,
      compatibility: APPROVAL_REVIEW_ARTIFACT_UNSUPPORTED_MAJOR,
      errors: unsupportedErrors
    };
  }

  return {
    valid: true,
    compatibility: APPROVAL_REVIEW_ARTIFACT_COMPATIBLE,
    errors: []
  };
}

export function classifyApprovalReviewArtifactCompatibility(artifact) {
  return validateApprovalReviewArtifactVersion(artifact).compatibility;
}

function schemaMetadataForArtifactKind(artifactKind) {
  if (!SCHEMA_MIGRATION_ARTIFACT_KIND_SET.has(artifactKind)) {
    throw new Error(`Unsupported schema migration artifact kind: ${artifactKind}`);
  }

  return SCHEMA_METADATA_BY_ARTIFACT_KIND[artifactKind];
}

function artifactSchemaIdForKind(artifactKind, artifact, metadata) {
  const explicitSchema = displayString(dataProperty(artifact, "schema"));

  if (artifactKind === "approval_review_artifact") {
    return explicitSchema ?? null;
  }

  return explicitSchema ?? metadata.schemaId;
}

function artifactSchemaVersionForKind(artifactKind, artifact) {
  const explicitSchemaVersion = displayString(dataProperty(artifact, "schemaVersion"));

  if (explicitSchemaVersion) {
    return explicitSchemaVersion;
  }

  if (artifactKind === "planner_trace") {
    return displayString(dataProperty(dataProperty(artifact, "manifest"), "schemaVersion"));
  }

  return null;
}

function artifactVersionForKind(artifactKind, artifact) {
  return artifactKind === "approval_review_artifact"
    ? displayString(dataProperty(artifact, "version"))
    : null;
}

function filteredApprovalReviewValidationErrors(validationErrors) {
  return validationErrors.filter(
    (error) =>
      error !== `schemaVersion must be ${ARDYN_SCHEMA_VERSION}` &&
      error !== `version must be ${APPROVAL_REVIEW_ARTIFACT_VERSION}`
  );
}

function classifyApprovalReviewArtifactSchemaMetadata(artifact) {
  const versionValidation = validateApprovalReviewArtifactVersion(artifact);

  if (!versionValidation.valid) {
    return {
      compatibility: versionValidation.compatibility,
      errors: versionValidation.errors
    };
  }

  const validation = validateApprovalReviewArtifact(artifact);
  const nonVersionErrors = filteredApprovalReviewValidationErrors(validation.errors);

  if (nonVersionErrors.length > 0) {
    return {
      compatibility: APPROVAL_REVIEW_ARTIFACT_MALFORMED,
      errors: nonVersionErrors
    };
  }

  if (!validation.valid) {
    return {
      compatibility: APPROVAL_REVIEW_ARTIFACT_UPGRADE_AVAILABLE,
      errors: []
    };
  }

  return {
    compatibility: APPROVAL_REVIEW_ARTIFACT_COMPATIBLE,
    errors: []
  };
}

function classifyGenericSchemaMetadata(artifactKind, artifact, metadata) {
  if (!validationObject(artifact)) {
    return {
      compatibility: APPROVAL_REVIEW_ARTIFACT_MALFORMED,
      errors: ["artifact must be an object"]
    };
  }

  const explicitSchema = displayString(dataProperty(artifact, "schema"));
  if (explicitSchema && explicitSchema !== metadata.schemaId) {
    return {
      compatibility: APPROVAL_REVIEW_ARTIFACT_MALFORMED,
      errors: [`schema must be ${metadata.schemaId}`]
    };
  }

  const schemaVersion = artifactSchemaVersionForKind(artifactKind, artifact);
  const schemaVersionMajor = semverMajor(schemaVersion);
  if (schemaVersionMajor === null) {
    return {
      compatibility: APPROVAL_REVIEW_ARTIFACT_MALFORMED,
      errors: ["schemaVersion must be a semantic version string"]
    };
  }

  const currentMajor = semverMajor(metadata.currentSchemaVersion);
  if (schemaVersionMajor !== currentMajor) {
    return {
      compatibility: APPROVAL_REVIEW_ARTIFACT_UNSUPPORTED_MAJOR,
      errors: [
        `schemaVersion major ${schemaVersionMajor} is unsupported; supported major is ${currentMajor}`
      ]
    };
  }

  if (schemaVersion !== metadata.currentSchemaVersion) {
    return {
      compatibility: APPROVAL_REVIEW_ARTIFACT_UPGRADE_AVAILABLE,
      errors: []
    };
  }

  return {
    compatibility: APPROVAL_REVIEW_ARTIFACT_COMPATIBLE,
    errors: []
  };
}

function schemaMetadataClassification(artifactKind, artifact) {
  const metadata = schemaMetadataForArtifactKind(artifactKind);

  return artifactKind === "approval_review_artifact"
    ? classifyApprovalReviewArtifactSchemaMetadata(artifact)
    : classifyGenericSchemaMetadata(artifactKind, artifact, metadata);
}

function migrationNotesForCompatibility(compatibility, metadata, schemaVersion, artifactVersion, errors) {
  if (compatibility === APPROVAL_REVIEW_ARTIFACT_COMPATIBLE) {
    return ["Artifact schema metadata is current; no migration is required."];
  }

  if (compatibility === APPROVAL_REVIEW_ARTIFACT_UPGRADE_AVAILABLE) {
    return [
      `Artifact shares the supported major schema version and can be displayed without execution.`,
      `A future migration may normalize schemaVersion to ${metadata.currentSchemaVersion}.`,
      ...(artifactVersion && metadata.currentArtifactVersion
        ? [`A future migration may normalize artifact version to ${metadata.currentArtifactVersion}.`]
        : [])
    ];
  }

  if (compatibility === APPROVAL_REVIEW_ARTIFACT_UNSUPPORTED_MAJOR) {
    return [
      "Artifact uses an unsupported major schema version and requires manual review before display trust.",
      ...errors
    ];
  }

  return [
    "Artifact schema metadata is malformed and requires manual review.",
    ...errors
  ];
}

export function classifyArtifactSchemaMetadata(artifactKind, artifact) {
  return schemaMetadataClassification(artifactKind, artifact).compatibility;
}

export function buildSchemaMigrationMetadataRecord(artifactKind, artifact) {
  const metadata = schemaMetadataForArtifactKind(artifactKind);
  const classification = schemaMetadataClassification(artifactKind, artifact);
  const schemaVersion = artifactSchemaVersionForKind(artifactKind, artifact);
  const artifactVersion = artifactVersionForKind(artifactKind, artifact);
  const compatibility = classification.compatibility;

  return {
    schema: SCHEMA_MIGRATION_METADATA_SCHEMA,
    schemaVersion: SCHEMA_MIGRATION_METADATA_VERSION,
    artifactKind,
    schemaId: artifactSchemaIdForKind(artifactKind, artifact, metadata),
    artifactSchemaVersion: schemaVersion,
    artifactVersion,
    currentSchemaVersion: metadata.currentSchemaVersion,
    currentArtifactVersion: metadata.currentArtifactVersion ?? null,
    compatibility,
    migrationRequired:
      compatibility === APPROVAL_REVIEW_ARTIFACT_UNSUPPORTED_MAJOR ||
      compatibility === APPROVAL_REVIEW_ARTIFACT_MALFORMED,
    migrationAvailable: compatibility === APPROVAL_REVIEW_ARTIFACT_UPGRADE_AVAILABLE,
    migrationNotes: migrationNotesForCompatibility(
      compatibility,
      metadata,
      schemaVersion,
      artifactVersion,
      classification.errors
    ),
    validationErrors: classification.errors,
    nonExecuting: true
  };
}

export function digestApprovalReviewArtifact(artifact) {
  const digest = createHash("sha256")
    .update(stableJsonStringify(safeDisplayValue(artifact)))
    .digest("hex");

  return {
    algorithm: "sha256",
    value: `sha256:${digest}`,
    canonicalization: "ardyn.stable-json-display-v1"
  };
}

function attestationVerificationReason(status) {
  if (status === "test_fixture_only") {
    return "Verification status is a deterministic test fixture marker; no production signature was checked.";
  }

  if (status === "planned") {
    return "Signing and verification are planned for a future phase; no production signature was checked.";
  }

  if (status === "unsupported") {
    return "Artifact compatibility is unsupported or malformed; attestation remains unsupported.";
  }

  return "Artifact is unsigned in Phase 3.7; no production signature was checked.";
}

export function buildReviewArtifactAttestationPlan(artifact, options = {}) {
  const migration = buildSchemaMigrationMetadataRecord("approval_review_artifact", artifact);
  const requestedStatus = options.verificationStatus;
  const defaultStatus =
    migration.compatibility === APPROVAL_REVIEW_ARTIFACT_COMPATIBLE ||
    migration.compatibility === APPROVAL_REVIEW_ARTIFACT_UPGRADE_AVAILABLE
      ? "unsigned"
      : "unsupported";
  const verificationStatus = requestedStatus ?? defaultStatus;

  if (!REVIEW_ARTIFACT_ATTESTATION_STATUS_SET.has(verificationStatus)) {
    throw new Error(`Unsupported review artifact attestation status: ${verificationStatus}`);
  }

  return {
    schema: REVIEW_ARTIFACT_ATTESTATION_PLAN_SCHEMA,
    schemaVersion: REVIEW_ARTIFACT_ATTESTATION_PLAN_VERSION,
    version: REVIEW_ARTIFACT_ATTESTATION_PLAN_VERSION,
    nonExecuting: true,
    artifact: {
      kind: "approval_review_artifact",
      schemaId: migration.schemaId,
      schemaVersion: migration.artifactSchemaVersion,
      version: migration.artifactVersion,
      taskId: displayString(dataProperty(artifact, "taskId")),
      digest: digestApprovalReviewArtifact(artifact)
    },
    signer: {
      identity: options.signerIdentity ?? "placeholder:unsigned-review-artifact",
      placeholder: true,
      productionKeyAvailable: false
    },
    signing: {
      algorithm: options.signingAlgorithm ?? "ed25519-planned",
      productionSigningEnabled: false,
      testFixtureOnly: verificationStatus === "test_fixture_only",
      realSigningPerformed: false,
      keysLoaded: false,
      notes: [
        "Phase 3.7 records signing intent only.",
        "No production signing keys are generated, loaded, stored, or required.",
        "No cryptographic signature is produced by this helper."
      ]
    },
    verification: {
      status: verificationStatus,
      verified: false,
      reason: attestationVerificationReason(verificationStatus)
    },
    migration,
    safety: createNoExecutionSafetyFlags()
  };
}

export function buildMigrationAttestationDisplaySummary(
  artifactKind,
  artifact,
  options = {}
) {
  const migration = buildSchemaMigrationMetadataRecord(artifactKind, artifact);
  const attestation =
    artifactKind === "approval_review_artifact"
      ? buildReviewArtifactAttestationPlan(artifact, options)
      : null;
  const warnings = [
    ...(migration.compatibility === APPROVAL_REVIEW_ARTIFACT_UPGRADE_AVAILABLE
      ? ["upgrade_available"]
      : []),
    ...(migration.compatibility === APPROVAL_REVIEW_ARTIFACT_UNSUPPORTED_MAJOR
      ? ["unsupported_major"]
      : []),
    ...(migration.compatibility === APPROVAL_REVIEW_ARTIFACT_MALFORMED
      ? ["malformed"]
      : []),
    ...(attestation?.verification.status === "unsigned" ? ["unsigned"] : []),
    ...(attestation?.verification.status === "test_fixture_only" ? ["test_fixture_only"] : [])
  ].sort(compareAscii);

  return {
    schema: "ardyn.migration-attestation-display-summary",
    schemaVersion: "0.1.0",
    artifactKind,
    compatibility: migration.compatibility,
    migrationRequired: migration.migrationRequired,
    migrationAvailable: migration.migrationAvailable,
    migrationNotes: migration.migrationNotes,
    attestation: attestation
      ? {
          schema: attestation.schema,
          schemaVersion: attestation.schemaVersion,
          digest: attestation.artifact.digest,
          signerIdentity: attestation.signer.identity,
          verificationStatus: attestation.verification.status,
          productionSigningEnabled: attestation.signing.productionSigningEnabled,
          keysLoaded: attestation.signing.keysLoaded,
          realSigningPerformed: attestation.signing.realSigningPerformed
        }
      : null,
    warnings,
    unknownFields:
      artifactKind === "approval_review_artifact"
        ? normalizeApprovalReviewArtifactForDisplay(artifact).unknownFields
        : [],
    nonExecuting: true,
    safety: createNoExecutionSafetyFlags()
  };
}

export function normalizeApprovalReviewArtifactForDisplay(artifact) {
  const versionValidation = validateApprovalReviewArtifactVersion(artifact);
  const validation = validateApprovalReviewArtifact(artifact);
  const safety = displaySafetyFlags(dataProperty(artifact, "safety"));
  const { unknownFields, unknown } = displayUnknownFields(artifact);

  return {
    compatibility: versionValidation.compatibility,
    valid: validation.valid,
    validationErrors: [...validation.errors],
    schema: displayString(dataProperty(artifact, "schema")),
    schemaVersion: displayString(dataProperty(artifact, "schemaVersion")),
    version: displayString(dataProperty(artifact, "version")),
    generatedAt: displayString(dataProperty(artifact, "generatedAt")),
    nonExecuting: displayBoolean(dataProperty(artifact, "nonExecuting")),
    taskId: displayString(dataProperty(artifact, "taskId")),
    manifest: normalizeDisplayManifest(dataProperty(artifact, "manifest")),
    requestedCapabilityIds: displayStringArray(dataProperty(artifact, "requestedCapabilityIds")),
    candidateRankings: normalizeDisplayCandidateRankings(dataProperty(artifact, "candidateRankings")),
    selectedCapabilities: displayStringArray(dataProperty(artifact, "selectedCapabilities")),
    unresolvedRequests: displayStringArray(dataProperty(artifact, "unresolvedRequests")),
    approvalDecision: normalizeDisplayApprovalDecision(dataProperty(artifact, "approvalDecision")),
    safety,
    safetyFlagsAllFalse: allDisplaySafetyFlagsFalse(safety),
    unknownFields,
    unknown
  };
}

export function buildApprovalReviewArtifactDisplaySummary(artifact) {
  const normalized = normalizeApprovalReviewArtifactForDisplay(artifact);
  const candidateSummaries = normalized.candidateRankings.map((ranking) => {
    const topCandidate = ranking.candidates[0] ?? null;

    return {
      request: ranking.request,
      candidateCount: ranking.candidates.length,
      topCandidate: topCandidate
        ? {
            rank: topCandidate.rank,
            capabilityId: topCandidate.capabilityId,
            matchType: topCandidate.matchType,
            score: topCandidate.score
          }
        : null
    };
  });

  return {
    compatibility: normalized.compatibility,
    valid: normalized.valid,
    schema: normalized.schema,
    schemaVersion: normalized.schemaVersion,
    version: normalized.version,
    generatedAt: normalized.generatedAt,
    taskId: normalized.taskId,
    manifest: normalized.manifest,
    approval: {
      status: normalized.approvalDecision.status,
      reason: normalized.approvalDecision.reason,
      createdAt: normalized.approvalDecision.createdAt,
      nonExecuting: normalized.approvalDecision.nonExecuting
    },
    counts: {
      requestedCapabilities: normalized.requestedCapabilityIds.length,
      selectedCapabilities: normalized.selectedCapabilities.length,
      unresolvedRequests: normalized.unresolvedRequests.length,
      candidateRankings: normalized.candidateRankings.length,
      candidates: normalized.candidateRankings.reduce(
        (count, ranking) => count + ranking.candidates.length,
        0
      ),
      unknownFields: normalized.unknownFields.length
    },
    requestedCapabilityIds: normalized.requestedCapabilityIds,
    selectedCapabilities: normalized.selectedCapabilities,
    unresolvedRequests: normalized.unresolvedRequests,
    candidateRankings: candidateSummaries,
    unknownFields: normalized.unknownFields,
    safety: {
      nonExecuting: normalized.nonExecuting,
      allFlagsFalse: normalized.safetyFlagsAllFalse,
      flags: normalized.safety
    },
    validationErrors: normalized.validationErrors
  };
}

function validationObject(value) {
  return value && typeof value === "object" && !Array.isArray(value);
}

function pushRequiredString(errors, value, path) {
  if (typeof value !== "string" || value.length === 0) {
    errors.push(`${path} must be a non-empty string`);
  }
}

function pushRequiredArray(errors, value, path) {
  if (!Array.isArray(value)) {
    errors.push(`${path} must be an array`);
  }
}

export function validateApprovalReviewArtifact(artifact) {
  const errors = [];

  if (!validationObject(artifact)) {
    return {
      valid: false,
      errors: ["artifact must be an object"]
    };
  }

  if (artifact.schema !== APPROVAL_REVIEW_ARTIFACT_SCHEMA) {
    errors.push(`schema must be ${APPROVAL_REVIEW_ARTIFACT_SCHEMA}`);
  }

  if (artifact.schemaVersion !== ARDYN_SCHEMA_VERSION) {
    errors.push(`schemaVersion must be ${ARDYN_SCHEMA_VERSION}`);
  }

  if (artifact.version !== APPROVAL_REVIEW_ARTIFACT_VERSION) {
    errors.push(`version must be ${APPROVAL_REVIEW_ARTIFACT_VERSION}`);
  }

  pushRequiredString(errors, artifact.generatedAt, "generatedAt");

  if (artifact.nonExecuting !== true) {
    errors.push("nonExecuting must be true");
  }

  pushRequiredString(errors, artifact.taskId, "taskId");

  if (!validationObject(artifact.manifest)) {
    errors.push("manifest must be an object");
  } else {
    pushRequiredString(errors, artifact.manifest.id, "manifest.id");
    pushRequiredString(errors, artifact.manifest.version, "manifest.version");
    if (artifact.manifest.schemaVersion !== ARDYN_SCHEMA_VERSION) {
      errors.push(`manifest.schemaVersion must be ${ARDYN_SCHEMA_VERSION}`);
    }
  }

  pushRequiredArray(errors, artifact.requestedCapabilityIds, "requestedCapabilityIds");
  pushRequiredArray(errors, artifact.candidateRankings, "candidateRankings");
  pushRequiredArray(errors, artifact.selectedCapabilities, "selectedCapabilities");
  pushRequiredArray(errors, artifact.unresolvedRequests, "unresolvedRequests");

  if (!validationObject(artifact.approvalDecision)) {
    errors.push("approvalDecision must be an object");
  } else {
    pushRequiredString(errors, artifact.approvalDecision.id, "approvalDecision.id");
    pushRequiredString(errors, artifact.approvalDecision.taskId, "approvalDecision.taskId");
    pushRequiredArray(
      errors,
      artifact.approvalDecision.requestedCapabilityIds,
      "approvalDecision.requestedCapabilityIds"
    );
    if (!APPROVAL_DECISION_STATUS_SET.has(artifact.approvalDecision.status)) {
      errors.push("approvalDecision.status must be a supported approval decision status");
    }
    pushRequiredString(errors, artifact.approvalDecision.reason, "approvalDecision.reason");
    pushRequiredString(errors, artifact.approvalDecision.createdAt, "approvalDecision.createdAt");
    if (artifact.approvalDecision.nonExecuting !== true) {
      errors.push("approvalDecision.nonExecuting must be true");
    }
  }

  if (!validationObject(artifact.safety)) {
    errors.push("safety must be an object");
  } else {
    for (const key of Object.keys(NO_EXECUTION_SAFETY_FLAGS)) {
      if (artifact.safety[key] !== false) {
        errors.push(`safety.${key} must be false`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

function comparisonApprovalReviewArtifact(source, side) {
  const artifact =
    source?.schema === APPROVAL_REVIEW_ARTIFACT_SCHEMA
      ? source
      : createApprovalReviewArtifact(source);
  const validation = validateApprovalReviewArtifact(artifact);

  if (!validation.valid) {
    throw new Error(
      `${side} approval review artifact is invalid: ${validation.errors.join("; ")}`
    );
  }

  return artifact;
}

function uniqueSortedStrings(values) {
  return [...new Set(values)].sort(compareAscii);
}

function stringArrayDifference(left, right) {
  const leftSet = new Set(left);
  const rightSet = new Set(right);

  return {
    added: uniqueSortedStrings(right.filter((value) => !leftSet.has(value))),
    removed: uniqueSortedStrings(left.filter((value) => !rightSet.has(value)))
  };
}

function pushValueDifference(differences, type, path, left, right) {
  if (stableJsonStringify(left) === stableJsonStringify(right)) {
    return;
  }

  differences.push({
    type,
    path,
    left: stableJsonValue(left),
    right: stableJsonValue(right)
  });
}

function pushStringArrayDifference(differences, type, path, left, right) {
  if (stableJsonStringify(left) === stableJsonStringify(right)) {
    return;
  }

  differences.push({
    type,
    path,
    left: [...left],
    right: [...right],
    ...stringArrayDifference(left, right)
  });
}

function comparisonCandidateRankings(artifact) {
  return artifact.candidateRankings
    .map((ranking) => ({
      request: ranking.request,
      candidates: ranking.candidates
        .map((candidate) => ({
          rank: candidate.rank,
          capabilityId: candidate.capabilityId,
          matchType: candidate.matchType,
          score: candidate.score,
          scope: candidate.scope,
          tag: candidate.tag,
          reason: candidate.reason
        }))
        .sort((left, right) => {
          const rankCompare = left.rank - right.rank;
          return rankCompare === 0
            ? compareAscii(left.capabilityId, right.capabilityId)
            : rankCompare;
        })
    }))
    .sort((left, right) => compareAscii(left.request, right.request));
}

export function compareApprovalReviewArtifacts(leftSource, rightSource) {
  const left = comparisonApprovalReviewArtifact(leftSource, "left");
  const right = comparisonApprovalReviewArtifact(rightSource, "right");
  const differences = [];

  pushValueDifference(differences, "task-mismatch", "taskId", left.taskId, right.taskId);
  pushValueDifference(
    differences,
    "manifest-mismatch",
    "manifest.id",
    left.manifest.id,
    right.manifest.id
  );
  pushValueDifference(
    differences,
    "manifest-mismatch",
    "manifest.version",
    left.manifest.version,
    right.manifest.version
  );
  pushValueDifference(
    differences,
    "manifest-mismatch",
    "manifest.schemaVersion",
    left.manifest.schemaVersion,
    right.manifest.schemaVersion
  );
  pushStringArrayDifference(
    differences,
    "requested-capabilities-change",
    "requestedCapabilityIds",
    left.requestedCapabilityIds,
    right.requestedCapabilityIds
  );
  pushStringArrayDifference(
    differences,
    "selected-capabilities-change",
    "selectedCapabilities",
    left.selectedCapabilities,
    right.selectedCapabilities
  );
  pushStringArrayDifference(
    differences,
    "unresolved-requests-change",
    "unresolvedRequests",
    left.unresolvedRequests,
    right.unresolvedRequests
  );
  pushStringArrayDifference(
    differences,
    "approval-requested-capabilities-change",
    "approvalDecision.requestedCapabilityIds",
    left.approvalDecision.requestedCapabilityIds,
    right.approvalDecision.requestedCapabilityIds
  );
  pushValueDifference(
    differences,
    "approval-status-change",
    "approvalDecision.status",
    left.approvalDecision.status,
    right.approvalDecision.status
  );
  pushValueDifference(
    differences,
    "candidate-rankings-change",
    "candidateRankings",
    comparisonCandidateRankings(left),
    comparisonCandidateRankings(right)
  );

  return {
    equal: differences.length === 0,
    differenceCount: differences.length,
    differences,
    nonExecuting: true,
    safety: createNoExecutionSafetyFlags()
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
