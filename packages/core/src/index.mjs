import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { isAbsolute, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";

export const ARDYN_SCHEMA_VERSION = "0.1.0";
export const ARDYN_PHASE = "phase-3-task-planning";
export const ARDYN_STDIO_DRY_RUN_PHASE = "phase-4.0a-stdio-event-dry-run";
export const ARDYN_STDIO_FRAMING_REDACTION_PHASE =
  "phase-4.1c-framing-redaction-contracts";
export const STDIO_FRAMING_REDACTION_CONTRACT_SCHEMA =
  "ardyn.stdio-framing-redaction-contract";
export const STDIO_FRAMING_REDACTION_CONTRACT_VERSION = "0.1.0";
export const JSONL_WHOLE_LINE_BUNDLE_VALID = "valid_whole_line_bundle";
export const JSONL_WHOLE_LINE_BUNDLE_BLANK_LINE_REJECTED = "blank_line_rejected";
export const JSONL_WHOLE_LINE_BUNDLE_MISSING_FINAL_LF = "missing_final_lf";
export const JSONL_WHOLE_LINE_BUNDLE_CRLF_REJECTED = "crlf_rejected";
export const JSONL_WHOLE_LINE_BUNDLE_MALFORMED_JSON_LINE = "malformed_json_line";
export const JSONL_WHOLE_LINE_BUNDLE_PARTIAL_LINE_REJECTED = "partial_line_rejected";
export const STDERR_REDACTION_SAFE = "redacted_safe";
export const STDERR_REDACTION_UNREDACTABLE_FAIL_CLOSED = "unredactable_fail_closed";
export const STDERR_REDACTION_MALFORMED = "malformed";
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
export const SESSION_TRANSCRIPT_SCHEMA = "ardyn.session-transcript";
export const SESSION_TRANSCRIPT_SCHEMA_VERSION = "0.1.0";
export const SESSION_TRANSCRIPT_SUMMARY_SCHEMA = "ardyn.session-transcript-summary";
export const SESSION_TRANSCRIPT_DISPLAY_SUMMARY_SCHEMA =
  "ardyn.session-transcript-display-summary";
export const SESSION_TRANSCRIPT_MIGRATION_METADATA_SCHEMA =
  "ardyn.session-transcript-migration-metadata";
export const SESSION_TRANSCRIPT_COMPATIBILITY_EXPLANATION_SCHEMA =
  "ardyn.session-transcript-compatibility-explanation";
export const SESSION_TRANSCRIPT_EXPLANATION_SCHEMA = "ardyn.session-transcript-explanation";
export const SESSION_TRANSCRIPT_COMPATIBLE = "compatible";
export const SESSION_TRANSCRIPT_UPGRADE_AVAILABLE = "upgrade_available";
export const SESSION_TRANSCRIPT_UNSUPPORTED_MAJOR = "unsupported_major";
export const SESSION_TRANSCRIPT_MALFORMED = "malformed";
export const HOST_POLICY_REVIEW_RECORD_SCHEMA = "ardyn.host-policy-review-record";
export const HOST_POLICY_REVIEW_RECORD_VERSION = "0.1.0";
export const HOST_POLICY_REVIEW_RECORD_COMPARISON_SCHEMA =
  "ardyn.host-policy-review-record-comparison";
export const HOST_POLICY_REVIEW_RECORD_COMPARISON_VERSION = "0.1.0";
export const ARDYN_HOST_POLICY_REVIEW_COMPARISON_PHASE =
  "phase-4.0g-host-policy-review-comparison";
export const HOST_POLICY_REVIEW_COMPATIBLE = "compatible";
export const HOST_POLICY_REVIEW_UPGRADE_AVAILABLE = "upgrade_available";
export const HOST_POLICY_REVIEW_UNSUPPORTED_MAJOR = "unsupported_major";
export const HOST_POLICY_REVIEW_MALFORMED = "malformed";
export const HOST_POLICY_REVIEW_REJECTED_POLICY = "rejected_policy";
const SESSION_EVENT_TYPES = Object.freeze([
  "session.started",
  "session.heartbeat",
  "session.capabilities",
  "task.planned",
  "approval.requested",
  "approval.recorded",
  "session.completed",
  "session.error"
]);
const SESSION_EVENT_TYPE_SET = new Set(SESSION_EVENT_TYPES);
const SESSION_EVENT_KNOWN_FIELDS = Object.freeze([
  "schemaVersion",
  "eventId",
  "sessionId",
  "sequence",
  "createdAt",
  "sourceHarness",
  "eventType",
  "payload",
  "nonExecuting",
  "safety"
]);
const SESSION_TRANSCRIPT_KNOWN_FIELDS = Object.freeze([
  "schema",
  "schemaVersion",
  "sessionId",
  "sourceHarness",
  "nonExecuting",
  "safety",
  "events"
]);
const SESSION_TRANSCRIPT_KNOWN_FIELD_SET = new Set(SESSION_TRANSCRIPT_KNOWN_FIELDS);
const OPAQUE_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9_.:-]{2,127}$/;
const CAPABILITY_ID_PATTERN = /^[a-z][a-z0-9-]*(\.[a-z][a-z0-9-]*)*$/;
const EVENT_CREATED_AT_PATTERN = /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}Z$/;
const SESSION_ERROR_CODE_PATTERN = /^[a-z][a-z0-9_.-]{2,63}$/;

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
const SESSION_TRANSCRIPT_SUPPORTED_SCHEMA_MAJOR = 0;
const HOST_POLICY_REVIEW_RECORD_SUPPORTED_SCHEMA_MAJOR = 0;
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
const HOST_POLICY_REVIEW_RECORD_KNOWN_FIELDS = Object.freeze([
  "schema",
  "schemaVersion",
  "recordPhase",
  "reviewedPhase",
  "policyMetadataSchema",
  "policyMetadataVersion",
  "policyMetadataDigestAlgorithm",
  "policyMetadataDigestHex",
  "policyContractVersion",
  "runtimeStatus",
  "nonExecutionInvariants",
  "compatibility",
  "decision",
  "diagnostics"
]);
const HOST_POLICY_REVIEW_RECORD_KNOWN_FIELD_SET = new Set(HOST_POLICY_REVIEW_RECORD_KNOWN_FIELDS);
const HOST_POLICY_REVIEW_COMPATIBILITIES = Object.freeze([
  HOST_POLICY_REVIEW_COMPATIBLE,
  HOST_POLICY_REVIEW_UPGRADE_AVAILABLE,
  HOST_POLICY_REVIEW_UNSUPPORTED_MAJOR,
  HOST_POLICY_REVIEW_MALFORMED,
  HOST_POLICY_REVIEW_REJECTED_POLICY
]);
const HOST_POLICY_REVIEW_COMPATIBILITY_SET = new Set(HOST_POLICY_REVIEW_COMPATIBILITIES);
const HOST_POLICY_REVIEW_DECISION_STATUSES = Object.freeze([
  "review-pending",
  "review-approved",
  "review-rejected"
]);
const HOST_POLICY_REVIEW_DECISION_STATUS_SET = new Set(HOST_POLICY_REVIEW_DECISION_STATUSES);
const HOST_POLICY_REVIEW_REQUIRED_INVARIANTS = Object.freeze([
  "no-live-stdio-runtime",
  "no-stdin-command-loop",
  "no-live-stdio-reader",
  "no-listener",
  "no-server",
  "no-subprocess-spawning",
  "no-adapter-calls",
  "no-locus-runtime-dependency",
  "no-mcp-calls",
  "no-openclaw-calls",
  "no-plugin-execution",
  "no-content-fabric-runtime-behavior",
  "no-autonomous-loop",
  "no-secret-handling",
  "no-production-signing-keys",
  "no-transcript-persistence-replay-runtime",
  "no-websocket-http-control-surface",
  "no-runtime-execution-behavior"
]);
const HOST_POLICY_REVIEW_FAIL_CLOSED_COMPATIBILITIES = new Set([
  HOST_POLICY_REVIEW_UNSUPPORTED_MAJOR,
  HOST_POLICY_REVIEW_MALFORMED,
  HOST_POLICY_REVIEW_REJECTED_POLICY
]);
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

function localPathPolicyFailure(filePath, label, expectedKind) {
  const expected = expectedKind === "json" ? "local JSON file path" : "local file path";

  if (typeof filePath !== "string" || filePath.length === 0) {
    return `${label} must be a ${expected}.`;
  }

  if (filePath === "-") {
    return `${label} must be a ${expected}.`;
  }

  if (/[\0\r\n]/.test(filePath)) {
    return `${label} must be a ${expected}.`;
  }

  if (/^file:/i.test(filePath)) {
    return `${label} must be a ${expected}.`;
  }

  if (/^[\\/]{2}/.test(filePath)) {
    return `${label} must be a ${expected}.`;
  }

  if (/^[A-Za-z]:(?![\\/])/.test(filePath)) {
    return `${label} must be a ${expected}.`;
  }

  if (/^[A-Za-z][A-Za-z\d+.-]*:/.test(filePath) && !/^[A-Za-z]:[\\/]/.test(filePath)) {
    return `${label} must be a ${expected}.`;
  }

  if (expectedKind === "json" && !filePath.toLowerCase().endsWith(".json")) {
    return `${label} must point to a .json file.`;
  }

  return null;
}

export function assertLocalFilePath(filePath, label = "path") {
  const failure = localPathPolicyFailure(filePath, label, "file");

  if (failure) {
    throw new Error(failure);
  }
}

export function assertLocalJsonFilePath(filePath, label = "path") {
  const failure = localPathPolicyFailure(filePath, label, "json");

  if (failure) {
    throw new Error(failure);
  }
}

function resolveLocalJsonPath(localPath, label) {
  assertLocalJsonFilePath(localPath, label);

  return isAbsolute(localPath) ? localPath : resolve(process.cwd(), localPath);
}

function resolveManifestPath(manifestPath) {
  return resolveLocalJsonPath(manifestPath, "manifest");
}

export async function readLocalJsonFile(filePath, label = "path") {
  assertLocalJsonFilePath(filePath, label);

  let text;
  try {
    text = await readFile(filePath, "utf8");
  } catch (error) {
    throw new Error(`${label} could not be read: ${error instanceof Error ? error.message : String(error)}`);
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(`${label} is not valid JSON: ${error instanceof Error ? error.message : String(error)}`);
  }
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
  const manifest = await readLocalJsonFile(absolutePath, "manifest");
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

  const absolutePath = resolveLocalJsonPath(taskPath, "task");
  const task = await readLocalJsonFile(absolutePath, "task");
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

function displayUnknownFieldsForKnownFields(source, knownFieldSet) {
  if (!validationObject(source)) {
    return {
      unknownFields: [],
      unknown: {}
    };
  }

  const descriptors = Object.getOwnPropertyDescriptors(source);
  const unknownFields = Object.entries(descriptors)
    .filter(([key, descriptor]) => descriptor.enumerable && !knownFieldSet.has(key))
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

function displayUnknownFields(artifact) {
  return displayUnknownFieldsForKnownFields(artifact, APPROVAL_REVIEW_ARTIFACT_KNOWN_FIELD_SET);
}

function displaySessionTranscriptUnknownFields(transcript) {
  return displayUnknownFieldsForKnownFields(transcript, SESSION_TRANSCRIPT_KNOWN_FIELD_SET);
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

function hasOwn(source, key) {
  return Object.prototype.hasOwnProperty.call(source, key);
}

function pushRequiredObject(errors, value, path) {
  if (!validationObject(value)) {
    errors.push(`${path} must be an object`);
  }
}

function pushFalseSafetyErrors(errors, safety, path) {
  if (!validationObject(safety)) {
    errors.push(`${path} must be an object`);
    return;
  }

  for (const key of Object.keys(NO_EXECUTION_SAFETY_FLAGS)) {
    if (safety[key] !== false) {
      errors.push(`${path}.${key} must be false`);
    }
  }
}

function pushOpaqueId(errors, value, path) {
  if (typeof value !== "string" || value.length === 0) {
    errors.push(`${path} must be a non-empty string`);
    return;
  }

  if (!OPAQUE_ID_PATTERN.test(value)) {
    errors.push(`${path} must match opaque id pattern`);
  }
}

function pushCapabilityId(errors, value, path) {
  if (typeof value !== "string" || value.length < 3 || value.length > 96) {
    errors.push(`${path} must be a capability id string`);
    return;
  }

  if (!CAPABILITY_ID_PATTERN.test(value)) {
    errors.push(`${path} must be a capability id string`);
  }
}

function pushStringMax(errors, value, path, maxLength) {
  if (typeof value !== "string" || value.length === 0 || value.length > maxLength) {
    errors.push(`${path} must be a non-empty string with maximum length ${maxLength}`);
  }
}

function pushOptionalStringMax(errors, value, path, maxLength) {
  if (value === undefined) {
    return;
  }

  if (typeof value !== "string" || value.length > maxLength) {
    errors.push(`${path} must be a string with maximum length ${maxLength}`);
  }
}

function pushEnum(errors, value, path, allowedValues, reason = "must be a supported value") {
  if (typeof value !== "string" || !allowedValues.includes(value)) {
    errors.push(`${path} ${reason}`);
  }
}

function pushNoAdditionalProperties(errors, value, path, allowedKeys) {
  if (!validationObject(value)) {
    return;
  }

  for (const key of Object.keys(value).sort(compareAscii)) {
    if (!allowedKeys.includes(key)) {
      errors.push(`${path}.${key} is not allowed`);
    }
  }
}

function pushStringArray(errors, value, path, { minItems = 0, unique = false, itemValidator = null } = {}) {
  if (!Array.isArray(value)) {
    errors.push(`${path} must be an array`);
    return;
  }

  if (value.length < minItems) {
    errors.push(`${path} must contain at least ${minItems} item${minItems === 1 ? "" : "s"}`);
  }

  if (unique) {
    const seen = new Set();

    for (const entry of value) {
      if (seen.has(entry)) {
        errors.push(`${path} must not contain duplicate values`);
        break;
      }
      seen.add(entry);
    }
  }

  value.forEach((entry, index) => {
    if (itemValidator) {
      itemValidator(errors, entry, `${path}[${index}]`);
    } else if (typeof entry !== "string") {
      errors.push(`${path}[${index}] must be a string`);
    }
  });
}

function sessionEventPayloadErrors(payload, eventType, path) {
  const errors = [];

  if (!validationObject(payload)) {
    errors.push(`${path} must be an object`);
    return errors;
  }

  if (eventType === "session.started") {
    pushNoAdditionalProperties(errors, payload, path, ["manifestName", "mode", "phase"]);
    pushStringMax(errors, payload.phase, `${path}.phase`, 96);
    pushEnum(errors, payload.mode, `${path}.mode`, ["plan", "dry-run"]);
    pushOptionalStringMax(errors, payload.manifestName, `${path}.manifestName`, 64);
    return errors;
  }

  if (eventType === "session.heartbeat") {
    pushNoAdditionalProperties(errors, payload, path, ["activeTaskId", "note", "status"]);
    pushEnum(
      errors,
      payload.status,
      `${path}.status`,
      ["idle", "planning", "awaiting-approval", "completed", "error"]
    );
    if (payload.activeTaskId !== undefined) {
      pushOpaqueId(errors, payload.activeTaskId, `${path}.activeTaskId`);
    }
    pushOptionalStringMax(errors, payload.note, `${path}.note`, 240);
    return errors;
  }

  if (eventType === "session.capabilities") {
    pushNoAdditionalProperties(errors, payload, path, ["capabilityIds"]);
    pushStringArray(errors, payload.capabilityIds, `${path}.capabilityIds`, {
      minItems: 1,
      unique: true,
      itemValidator: pushCapabilityId
    });
    return errors;
  }

  if (eventType === "task.planned") {
    pushNoAdditionalProperties(errors, payload, path, [
      "requestedCapabilityIds",
      "selectedCapabilityIds",
      "taskId",
      "unresolvedRequests"
    ]);
    pushOpaqueId(errors, payload.taskId, `${path}.taskId`);
    pushStringArray(errors, payload.requestedCapabilityIds, `${path}.requestedCapabilityIds`, {
      minItems: 1,
      itemValidator: pushCapabilityId
    });
    if (payload.selectedCapabilityIds !== undefined) {
      pushStringArray(errors, payload.selectedCapabilityIds, `${path}.selectedCapabilityIds`, {
        itemValidator: pushCapabilityId
      });
    }
    pushStringArray(errors, payload.unresolvedRequests, `${path}.unresolvedRequests`);
    return errors;
  }

  if (eventType === "approval.requested") {
    pushNoAdditionalProperties(errors, payload, path, [
      "approvalId",
      "reason",
      "requestedCapabilityIds",
      "taskId"
    ]);
    pushOpaqueId(errors, payload.approvalId, `${path}.approvalId`);
    pushOpaqueId(errors, payload.taskId, `${path}.taskId`);
    pushStringArray(errors, payload.requestedCapabilityIds, `${path}.requestedCapabilityIds`, {
      minItems: 1,
      itemValidator: pushCapabilityId
    });
    pushStringMax(errors, payload.reason, `${path}.reason`, 400);
    return errors;
  }

  if (eventType === "approval.recorded") {
    pushNoAdditionalProperties(errors, payload, path, [
      "approvalId",
      "nonExecuting",
      "reason",
      "status",
      "taskId"
    ]);
    pushOpaqueId(errors, payload.approvalId, `${path}.approvalId`);
    pushOpaqueId(errors, payload.taskId, `${path}.taskId`);
    pushEnum(
      errors,
      payload.status,
      `${path}.status`,
      ["required", "granted", "denied", "not_required"]
    );
    pushStringMax(errors, payload.reason, `${path}.reason`, 400);
    if (payload.nonExecuting !== true) {
      errors.push(`${path}.nonExecuting must be true`);
    }
    return errors;
  }

  if (eventType === "session.completed") {
    pushNoAdditionalProperties(errors, payload, path, ["outcome", "summary"]);
    pushEnum(
      errors,
      payload.outcome,
      `${path}.outcome`,
      ["success", "approval_pending", "no_match", "cancelled"]
    );
    pushOptionalStringMax(errors, payload.summary, `${path}.summary`, 400);
    return errors;
  }

  if (eventType === "session.error") {
    pushNoAdditionalProperties(errors, payload, path, ["code", "message", "retryable"]);
    if (typeof payload.code !== "string" || !SESSION_ERROR_CODE_PATTERN.test(payload.code)) {
      errors.push(`${path}.code must match session error code pattern`);
    }
    pushStringMax(errors, payload.message, `${path}.message`, 400);
    if (typeof payload.retryable !== "boolean") {
      errors.push(`${path}.retryable must be a boolean`);
    }
  }

  return errors;
}

function validateSessionEventAtPath(event, path) {
  const errors = [];

  if (!validationObject(event)) {
    return {
      valid: false,
      errors: [`${path} must be an object`]
    };
  }

  pushNoAdditionalProperties(errors, event, path, SESSION_EVENT_KNOWN_FIELDS);

  if (event.schemaVersion !== ARDYN_SCHEMA_VERSION) {
    errors.push(`${path}.schemaVersion must be ${ARDYN_SCHEMA_VERSION}`);
  }

  pushOpaqueId(errors, event.eventId, `${path}.eventId`);
  pushOpaqueId(errors, event.sessionId, `${path}.sessionId`);

  if (!Number.isInteger(event.sequence)) {
    errors.push(`${path}.sequence must be an integer`);
  } else if (event.sequence < 1) {
    errors.push(`${path}.sequence must be greater than or equal to 1`);
  }

  if (typeof event.createdAt !== "string" || !EVENT_CREATED_AT_PATTERN.test(event.createdAt)) {
    errors.push(`${path}.createdAt must be an RFC3339 UTC timestamp with whole seconds`);
  }

  if (event.sourceHarness !== "ardyn") {
    errors.push(`${path}.sourceHarness must be ardyn`);
  }

  if (typeof event.eventType !== "string" || !SESSION_EVENT_TYPE_SET.has(event.eventType)) {
    errors.push(`${path}.eventType must be a supported session event type`);
  }

  if (!hasOwn(event, "payload")) {
    errors.push(`${path}.payload is required`);
  } else if (typeof event.eventType === "string" && SESSION_EVENT_TYPE_SET.has(event.eventType)) {
    errors.push(...sessionEventPayloadErrors(event.payload, event.eventType, `${path}.payload`));
  }

  if (event.nonExecuting !== true) {
    errors.push(`${path}.nonExecuting must be true`);
  }

  pushFalseSafetyErrors(errors, event.safety, `${path}.safety`);

  return {
    valid: errors.length === 0,
    errors
  };
}

function sessionTranscriptMalformedErrors(transcript) {
  if (!validationObject(transcript)) {
    return ["transcript must be an object"];
  }

  const errors = [];

  if (transcript.schema !== SESSION_TRANSCRIPT_SCHEMA) {
    errors.push(`schema must be ${SESSION_TRANSCRIPT_SCHEMA}`);
  }

  if (!Array.isArray(transcript.events)) {
    errors.push("events must be an array");
  }

  if (!hasOwn(transcript, "schemaVersion")) {
    errors.push("schemaVersion is required");
  }

  return errors;
}

function transcriptEventTypes(events) {
  const seen = new Set();
  const types = [];

  for (const event of events) {
    if (typeof event?.eventType !== "string" || seen.has(event.eventType)) {
      continue;
    }

    seen.add(event.eventType);
    types.push(event.eventType);
  }

  return types;
}

function transcriptSafetyAllFalse(safety) {
  return (
    validationObject(safety) &&
    Object.keys(NO_EXECUTION_SAFETY_FLAGS).every((key) => safety[key] === false)
  );
}

function transcriptChecks(transcript, validation, classification) {
  const events = Array.isArray(transcript?.events) ? transcript.events : [];

  return {
    transcriptSchema: transcript?.schema === SESSION_TRANSCRIPT_SCHEMA,
    transcriptSchemaVersion: transcript?.schemaVersion === ARDYN_SCHEMA_VERSION,
    transcriptSessionId:
      typeof transcript?.sessionId === "string" && transcript.sessionId.length > 0,
    transcriptSourceHarness: transcript?.sourceHarness === "ardyn",
    transcriptNonExecuting: transcript?.nonExecuting === true,
    transcriptSafetyAllFalse: transcriptSafetyAllFalse(transcript?.safety),
    eventsArray: Array.isArray(transcript?.events),
    eventsNonEmpty: events.length > 0,
    firstEventStarted: events[0]?.eventType === "session.started",
    sequencesContiguous:
      validation.errors.findIndex((error) => /events\[\d+\]\.sequence/.test(error)) === -1 &&
      events.length > 0,
    eventSessionIdsMatch:
      validation.errors.findIndex((error) => error.includes("sessionId must match")) === -1 &&
      classification !== "malformed",
    eventSourceHarnessesMatch:
      validation.errors.findIndex((error) => error.includes(".sourceHarness must be ardyn")) === -1 &&
      classification !== "malformed",
    eventNonExecuting:
      validation.errors.findIndex((error) => error.includes(".nonExecuting must be true")) === -1 &&
      classification !== "malformed",
    eventSafetyAllFalse:
      validation.errors.findIndex((error) => error.includes(".safety.")) === -1 &&
      classification !== "malformed"
  };
}

export function validateSessionEvent(event) {
  const result = validateSessionEventAtPath(event, "event");

  return {
    valid: result.valid,
    errors: result.errors.map((error) => error.replace(/^event\./, ""))
  };
}

export function validateSessionTranscript(transcript) {
  const errors = [];

  if (!validationObject(transcript)) {
    return {
      valid: false,
      errors: ["transcript must be an object"]
    };
  }

  if (transcript.schema !== SESSION_TRANSCRIPT_SCHEMA) {
    errors.push(`schema must be ${SESSION_TRANSCRIPT_SCHEMA}`);
  }

  if (transcript.schemaVersion !== ARDYN_SCHEMA_VERSION) {
    errors.push(`schemaVersion must be ${ARDYN_SCHEMA_VERSION}`);
  }

  pushOpaqueId(errors, transcript.sessionId, "sessionId");

  if (transcript.sourceHarness !== "ardyn") {
    errors.push("sourceHarness must be ardyn");
  }

  if (transcript.nonExecuting !== true) {
    errors.push("nonExecuting must be true");
  }

  pushFalseSafetyErrors(errors, transcript.safety, "safety");

  if (!Array.isArray(transcript.events)) {
    errors.push("events must be an array");
  } else if (transcript.events.length === 0) {
    errors.push("events must contain at least one event");
  } else {
    if (transcript.events[0]?.eventType !== "session.started") {
      errors.push("events[0].eventType must be session.started");
    }

    let previousSequence = null;

    transcript.events.forEach((event, index) => {
      const eventResult = validateSessionEventAtPath(event, `events[${index}]`);
      errors.push(...eventResult.errors);

      if (validationObject(event) && event.sessionId !== transcript.sessionId) {
        errors.push(`events[${index}].sessionId must match transcript.sessionId`);
      }

      if (validationObject(event) && Number.isInteger(event.sequence)) {
        if (index === 0) {
          if (event.sequence !== 1) {
            errors.push("events[0].sequence must be 1");
          }
        } else if (previousSequence !== null && event.sequence !== previousSequence + 1) {
          errors.push(`events[${index}].sequence must be ${previousSequence + 1}`);
        }

        previousSequence = event.sequence;
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

export function classifySessionTranscript(transcript) {
  const malformedErrors = sessionTranscriptMalformedErrors(transcript);

  if (malformedErrors.length > 0) {
    return {
      classification: "malformed",
      valid: false,
      errors: malformedErrors,
      nonExecuting: true,
      safety: createNoExecutionSafetyFlags()
    };
  }

  const validation = validateSessionTranscript(transcript);

  return {
    classification: validation.valid ? "valid" : "invalid",
    valid: validation.valid,
    errors: [...validation.errors],
    nonExecuting: true,
    safety: createNoExecutionSafetyFlags()
  };
}

export function buildSessionTranscriptSummary(transcript) {
  const classification = classifySessionTranscript(transcript);
  const events = Array.isArray(transcript?.events) ? transcript.events : [];
  const firstSequence = Number.isInteger(events[0]?.sequence) ? events[0].sequence : null;
  const lastSequence = Number.isInteger(events.at(-1)?.sequence) ? events.at(-1).sequence : null;

  return {
    schema: SESSION_TRANSCRIPT_SUMMARY_SCHEMA,
    schemaVersion: ARDYN_SCHEMA_VERSION,
    classification: classification.classification,
    valid: classification.valid,
    sessionId: typeof transcript?.sessionId === "string" ? transcript.sessionId : null,
    sourceHarness: typeof transcript?.sourceHarness === "string" ? transcript.sourceHarness : null,
    eventCount: events.length,
    eventTypes: transcriptEventTypes(events),
    firstEventType: typeof events[0]?.eventType === "string" ? events[0].eventType : null,
    lastEventType:
      typeof events.at(-1)?.eventType === "string" ? events.at(-1).eventType : null,
    sequence: {
      first: firstSequence,
      last: lastSequence,
      contiguous:
        classification.errors.findIndex((error) => /events\[\d+\]\.sequence/.test(error)) === -1 &&
        events.length > 0
    },
    lifecycle: {
      startsWithSessionStarted: events[0]?.eventType === "session.started",
      completed: events.some((event) => event?.eventType === "session.completed"),
      errored: events.some((event) => event?.eventType === "session.error")
    },
    transcriptNonExecuting: transcript?.nonExecuting === true,
    transcriptSafetyAllFalse: transcriptSafetyAllFalse(transcript?.safety),
    errors: [...classification.errors],
    nonExecuting: true,
    safety: createNoExecutionSafetyFlags()
  };
}

export function explainSessionTranscript(transcript) {
  const classification = classifySessionTranscript(transcript);
  const validation =
    classification.classification === "malformed"
      ? {
          valid: false,
          errors: [...classification.errors]
        }
      : validateSessionTranscript(transcript);
  const summary = buildSessionTranscriptSummary(transcript);

  return {
    schema: SESSION_TRANSCRIPT_EXPLANATION_SCHEMA,
    schemaVersion: ARDYN_SCHEMA_VERSION,
    classification: classification.classification,
    valid: classification.valid,
    sessionId: typeof transcript?.sessionId === "string" ? transcript.sessionId : null,
    sourceHarness: typeof transcript?.sourceHarness === "string" ? transcript.sourceHarness : null,
    checks: transcriptChecks(transcript, validation, classification.classification),
    errors: [...classification.errors],
    summary,
    nonExecuting: true,
    safety: createNoExecutionSafetyFlags()
  };
}

function sessionTranscriptStructuralErrors(transcript) {
  if (!validationObject(transcript)) {
    return ["transcript must be an object"];
  }

  const errors = [];

  if (dataProperty(transcript, "schema") !== SESSION_TRANSCRIPT_SCHEMA) {
    errors.push(`schema must be ${SESSION_TRANSCRIPT_SCHEMA}`);
  }

  validateSemverMajor(errors, dataProperty(transcript, "schemaVersion"), "schemaVersion");

  const events = dataProperty(transcript, "events");
  if (!Array.isArray(events)) {
    errors.push("events must be an array");
  } else if (events.length === 0) {
    errors.push("events must contain at least one event");
  } else {
    events.forEach((event, index) => {
      if (!validationObject(event)) {
        errors.push(`events[${index}] must be an object`);
        return;
      }

      if (!Number.isInteger(dataProperty(event, "sequence"))) {
        errors.push(`events[${index}].sequence must be an integer`);
      }

      if (typeof dataProperty(event, "eventType") !== "string") {
        errors.push(`events[${index}].eventType must be a string`);
      }
    });
  }

  return errors;
}

function filteredSessionTranscriptValidationErrors(validationErrors, transcript) {
  const transcriptVersion = displayString(dataProperty(transcript, "schemaVersion"));

  return validationErrors.filter((error) => {
    if (error === `schemaVersion must be ${ARDYN_SCHEMA_VERSION}`) {
      return false;
    }

    if (
      transcriptVersion &&
      /^events\[\d+\]\.schemaVersion must be /.test(error)
    ) {
      return false;
    }

    return true;
  });
}

function sessionTranscriptMigrationNotes(compatibility, schemaVersion, errors) {
  if (compatibility === SESSION_TRANSCRIPT_COMPATIBLE) {
    return ["Session transcript schema metadata is current; no migration is required."];
  }

  if (compatibility === SESSION_TRANSCRIPT_UPGRADE_AVAILABLE) {
    return [
      "Session transcript shares the supported major schema version and can be displayed read-only without execution.",
      `A future migration may normalize schemaVersion to ${SESSION_TRANSCRIPT_SCHEMA_VERSION}.`
    ];
  }

  if (compatibility === SESSION_TRANSCRIPT_UNSUPPORTED_MAJOR) {
    return [
      "Session transcript uses an unsupported major schema version and requires manual review before display trust.",
      ...errors
    ];
  }

  return [
    "Session transcript schema metadata is malformed or events are unusable and require manual review.",
    ...errors
  ];
}

function classifySessionTranscriptCompatibilityInternal(transcript) {
  const structuralErrors = sessionTranscriptStructuralErrors(transcript);
  const schemaVersion = displayString(dataProperty(transcript, "schemaVersion"));
  const schemaVersionMajor = semverMajor(schemaVersion);
  const unknown = displaySessionTranscriptUnknownFields(transcript);

  if (structuralErrors.length > 0 || schemaVersionMajor === null) {
    return {
      compatibility: SESSION_TRANSCRIPT_MALFORMED,
      schemaVersion,
      validationErrors: structuralErrors,
      structurallyUsable: false,
      schemaVersionMajor,
      unknownFields: unknown.unknownFields
    };
  }

  if (schemaVersionMajor !== SESSION_TRANSCRIPT_SUPPORTED_SCHEMA_MAJOR) {
    const errors = [
      `schemaVersion major ${schemaVersionMajor} is unsupported; supported major is ${SESSION_TRANSCRIPT_SUPPORTED_SCHEMA_MAJOR}`
    ];

    return {
      compatibility: SESSION_TRANSCRIPT_UNSUPPORTED_MAJOR,
      schemaVersion,
      validationErrors: errors,
      structurallyUsable: true,
      schemaVersionMajor,
      unknownFields: unknown.unknownFields
    };
  }

  const validation = validateSessionTranscript(transcript);
  const nonVersionErrors = filteredSessionTranscriptValidationErrors(
    validation.errors,
    transcript
  );

  if (nonVersionErrors.length > 0 && schemaVersion !== SESSION_TRANSCRIPT_SCHEMA_VERSION) {
    return {
      compatibility: SESSION_TRANSCRIPT_MALFORMED,
      schemaVersion,
      validationErrors: nonVersionErrors,
      structurallyUsable: false,
      schemaVersionMajor,
      unknownFields: unknown.unknownFields
    };
  }

  if (schemaVersion !== SESSION_TRANSCRIPT_SCHEMA_VERSION) {
    return {
      compatibility: SESSION_TRANSCRIPT_UPGRADE_AVAILABLE,
      schemaVersion,
      validationErrors: [],
      structurallyUsable: true,
      schemaVersionMajor,
      unknownFields: unknown.unknownFields
    };
  }

  return {
    compatibility: SESSION_TRANSCRIPT_COMPATIBLE,
    schemaVersion,
    validationErrors: validation.errors,
    structurallyUsable: true,
    schemaVersionMajor,
    unknownFields: unknown.unknownFields
  };
}

export function classifySessionTranscriptCompatibility(transcript) {
  const classification = classifySessionTranscriptCompatibilityInternal(transcript);
  const validation = validationObject(transcript)
    ? validateSessionTranscript(transcript)
    : {
        valid: false,
        errors: ["transcript must be an object"]
      };
  const compatibility = classification.compatibility;
  const migrationNotes = sessionTranscriptMigrationNotes(
    compatibility,
    classification.schemaVersion,
    classification.validationErrors
  );

  return {
    schemaId: displayString(dataProperty(transcript, "schema")),
    expectedSchemaId: SESSION_TRANSCRIPT_SCHEMA,
    schemaVersion: classification.schemaVersion,
    currentSchemaVersion: SESSION_TRANSCRIPT_SCHEMA_VERSION,
    compatibility,
    valid: validation.valid,
    structurallyUsable: classification.structurallyUsable,
    schemaIdValid: dataProperty(transcript, "schema") === SESSION_TRANSCRIPT_SCHEMA,
    schemaVersionValid: classification.schemaVersionMajor !== null,
    eventsUsable:
      classification.structurallyUsable &&
      Array.isArray(dataProperty(transcript, "events")) &&
      dataProperty(transcript, "events").length > 0,
    migrationRequired:
      compatibility === SESSION_TRANSCRIPT_UNSUPPORTED_MAJOR ||
      compatibility === SESSION_TRANSCRIPT_MALFORMED,
    migrationAvailable: compatibility === SESSION_TRANSCRIPT_UPGRADE_AVAILABLE,
    migrationNotes,
    validationErrors:
      compatibility === SESSION_TRANSCRIPT_MALFORMED ||
      compatibility === SESSION_TRANSCRIPT_UNSUPPORTED_MAJOR
        ? [...classification.validationErrors]
        : [...validation.errors],
    unknownFields: [...classification.unknownFields],
    unknownFieldCount: classification.unknownFields.length,
    unknownFieldsAreInert: true,
    nonExecuting: true,
    safety: createNoExecutionSafetyFlags()
  };
}

export function buildSessionTranscriptMigrationMetadata(transcript) {
  const compatibility = classifySessionTranscriptCompatibility(transcript);

  return {
    schema: SESSION_TRANSCRIPT_MIGRATION_METADATA_SCHEMA,
    schemaVersion: SESSION_TRANSCRIPT_SCHEMA_VERSION,
    artifactKind: "session_transcript",
    schemaId: compatibility.schemaId,
    expectedSchemaId: compatibility.expectedSchemaId,
    artifactSchemaVersion: compatibility.schemaVersion,
    currentSchemaVersion: compatibility.currentSchemaVersion,
    compatibility: compatibility.compatibility,
    migrationRequired: compatibility.migrationRequired,
    migrationAvailable: compatibility.migrationAvailable,
    migrationNotes: [...compatibility.migrationNotes],
    notes: [...compatibility.migrationNotes],
    validationErrors: [...compatibility.validationErrors],
    unknownFields: [...compatibility.unknownFields],
    unknownFieldsAreInert: true,
    nonExecuting: true,
    safety: createNoExecutionSafetyFlags()
  };
}

function sessionTranscriptEventsForDisplay(transcript) {
  const events = dataProperty(transcript, "events");
  return Array.isArray(events) ? events : [];
}

function sessionTranscriptSequenceRange(events, validationErrors) {
  const sequences = events
    .map((event) => dataProperty(event, "sequence"))
    .filter((sequence) => Number.isInteger(sequence));

  return {
    first: Number.isInteger(dataProperty(events[0], "sequence"))
      ? dataProperty(events[0], "sequence")
      : null,
    last: Number.isInteger(dataProperty(events.at(-1), "sequence"))
      ? dataProperty(events.at(-1), "sequence")
      : null,
    min: sequences.length > 0 ? Math.min(...sequences) : null,
    max: sequences.length > 0 ? Math.max(...sequences) : null,
    contiguous:
      validationErrors.findIndex((error) => /events\[\d+\]\.sequence/.test(error)) === -1 &&
      events.length > 0
  };
}

function countSessionTranscriptEvents(events, predicate) {
  return events.reduce((count, event) => (predicate(dataProperty(event, "eventType")) ? count + 1 : count), 0);
}

function sessionTranscriptDisplayWarnings({
  compatibility,
  validationErrors,
  unknownFields,
  safetyPosture,
  errorCount
}) {
  const warnings = [];

  if (compatibility.compatibility === SESSION_TRANSCRIPT_UPGRADE_AVAILABLE) {
    warnings.push({
      severity: "info",
      code: "upgrade_available",
      message: "Transcript uses an older compatible schema version and can be displayed read-only."
    });
  }

  if (compatibility.compatibility === SESSION_TRANSCRIPT_UNSUPPORTED_MAJOR) {
    warnings.push({
      severity: "error",
      code: "unsupported_major",
      message: "Transcript uses an unsupported major schema version."
    });
  }

  if (compatibility.compatibility === SESSION_TRANSCRIPT_MALFORMED) {
    warnings.push({
      severity: "error",
      code: "malformed",
      message: "Transcript is malformed or has unusable events."
    });
  }

  if (validationErrors.length > 0) {
    warnings.push({
      severity: "warning",
      code: "strict_validation_failed",
      message: `${validationErrors.length} strict validation issue(s) were found.`
    });
  }

  if (safetyPosture.nonExecuting !== true || safetyPosture.allFlagsFalse !== true) {
    warnings.push({
      severity: "error",
      code: "safety_posture_not_false",
      message: "Transcript safety posture is not fully non-executing."
    });
  }

  if (unknownFields.length > 0) {
    warnings.push({
      severity: "info",
      code: "unknown_root_fields",
      message: `${unknownFields.length} unknown root field(s) are treated as inert for display.`
    });
  }

  if (errorCount > 0) {
    warnings.push({
      severity: "warning",
      code: "session_errors_present",
      message: `${errorCount} session error event(s) are present.`
    });
  }

  return warnings;
}

export function buildSessionTranscriptDisplaySummary(transcript) {
  const compatibility = classifySessionTranscriptCompatibility(transcript);
  const validation = validationObject(transcript)
    ? validateSessionTranscript(transcript)
    : {
        valid: false,
        errors: ["transcript must be an object"]
      };
  const events = sessionTranscriptEventsForDisplay(transcript);
  const safety = displaySafetyFlags(dataProperty(transcript, "safety"));
  const safetyPosture = {
    nonExecuting: displayBoolean(dataProperty(transcript, "nonExecuting")),
    allFlagsFalse: allDisplaySafetyFlagsFalse(safety),
    flags: safety
  };
  const errorCount = countSessionTranscriptEvents(
    events,
    (eventType) => eventType === "session.error"
  );
  const unknownFields = [...compatibility.unknownFields];
  const validationErrors =
    compatibility.compatibility === SESSION_TRANSCRIPT_UPGRADE_AVAILABLE
      ? filteredSessionTranscriptValidationErrors(validation.errors, transcript)
      : validation.errors;

  return {
    schema: SESSION_TRANSCRIPT_DISPLAY_SUMMARY_SCHEMA,
    schemaVersion: SESSION_TRANSCRIPT_SCHEMA_VERSION,
    sessionId: displayString(dataProperty(transcript, "sessionId")),
    sourceHarness: displayString(dataProperty(transcript, "sourceHarness")),
    schemaStatus: {
      schemaId: compatibility.schemaId,
      expectedSchemaId: compatibility.expectedSchemaId,
      schemaVersion: compatibility.schemaVersion,
      currentSchemaVersion: compatibility.currentSchemaVersion,
      compatibility: compatibility.compatibility,
      valid: compatibility.valid,
      migrationRequired: compatibility.migrationRequired,
      migrationAvailable: compatibility.migrationAvailable
    },
    eventCount: events.length,
    firstEventType: displayString(dataProperty(events[0], "eventType")),
    lastEventType: displayString(dataProperty(events.at(-1), "eventType")),
    sequenceRange: sessionTranscriptSequenceRange(events, validation.errors),
    counts: {
      errors: errorCount,
      approvalEvents: countSessionTranscriptEvents(
        events,
        (eventType) => typeof eventType === "string" && eventType.startsWith("approval.")
      ),
      taskPlannedEvents: countSessionTranscriptEvents(
        events,
        (eventType) => eventType === "task.planned"
      ),
      unknownFields: unknownFields.length
    },
    safetyPosture,
    warnings: sessionTranscriptDisplayWarnings({
      compatibility,
      validationErrors,
      unknownFields,
      safetyPosture,
      errorCount
    }),
    unknownFields,
    unknownFieldCount: unknownFields.length,
    validationErrors: [...validationErrors],
    nonExecuting: true,
    safety: createNoExecutionSafetyFlags()
  };
}

export function explainSessionTranscriptCompatibility(transcript) {
  const compatibility = classifySessionTranscriptCompatibility(transcript);
  const migration = buildSessionTranscriptMigrationMetadata(transcript);
  const display = buildSessionTranscriptDisplaySummary(transcript);

  return {
    schema: SESSION_TRANSCRIPT_COMPATIBILITY_EXPLANATION_SCHEMA,
    schemaVersion: SESSION_TRANSCRIPT_SCHEMA_VERSION,
    schemaId: compatibility.schemaId,
    schemaVersionStatus: compatibility.schemaVersion,
    compatibility: compatibility.compatibility,
    decision: compatibility,
    migrationRequired: compatibility.migrationRequired,
    migrationAvailable: compatibility.migrationAvailable,
    migrationNotes: [...migration.migrationNotes],
    displayWarnings: [...display.warnings],
    validationErrors: [...compatibility.validationErrors],
    unknownFieldsAreInert: true,
    nonExecuting: true,
    safety: createNoExecutionSafetyFlags()
  };
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

function hostPolicyReviewRecordValidationDetails(record) {
  const errors = [];
  const schema = dataProperty(record, "schema");
  const schemaVersion = dataProperty(record, "schemaVersion");
  const declaredCompatibility = dataProperty(record, "compatibility");

  if (!validationObject(record)) {
    return {
      compatibility: HOST_POLICY_REVIEW_MALFORMED,
      valid: false,
      failClosed: true,
      validationErrors: ["record must be an object"],
      schema: null,
      schemaVersion: null,
      declaredCompatibility: null
    };
  }

  if (schema !== HOST_POLICY_REVIEW_RECORD_SCHEMA) {
    errors.push(`schema must be ${HOST_POLICY_REVIEW_RECORD_SCHEMA}`);
  }

  const schemaMajor = validateSemverMajor(errors, schemaVersion, "schemaVersion");
  const schemaVersionKnown = typeof schemaVersion === "string" && schemaMajor !== null;

  if (!schemaVersionKnown || errors.length > 0) {
    return {
      compatibility: HOST_POLICY_REVIEW_MALFORMED,
      valid: false,
      failClosed: true,
      validationErrors: errors,
      schema: displayString(schema),
      schemaVersion: displayString(schemaVersion),
      declaredCompatibility: displayString(declaredCompatibility)
    };
  }

  if (schemaMajor > HOST_POLICY_REVIEW_RECORD_SUPPORTED_SCHEMA_MAJOR) {
    return {
      compatibility: HOST_POLICY_REVIEW_UNSUPPORTED_MAJOR,
      valid: false,
      failClosed: true,
      validationErrors: [],
      schema: displayString(schema),
      schemaVersion,
      declaredCompatibility: displayString(declaredCompatibility)
    };
  }

  if (schemaVersion !== HOST_POLICY_REVIEW_RECORD_VERSION) {
    return {
      compatibility: HOST_POLICY_REVIEW_UPGRADE_AVAILABLE,
      valid: false,
      failClosed: false,
      validationErrors: [],
      schema: displayString(schema),
      schemaVersion,
      declaredCompatibility: displayString(declaredCompatibility)
    };
  }

  if (!HOST_POLICY_REVIEW_COMPATIBILITY_SET.has(declaredCompatibility)) {
    errors.push("compatibility must be a supported host-policy review compatibility");
  }

  if (
    declaredCompatibility === HOST_POLICY_REVIEW_UNSUPPORTED_MAJOR ||
    declaredCompatibility === HOST_POLICY_REVIEW_UPGRADE_AVAILABLE
  ) {
    errors.push("exact-current records must not declare version-gated compatibility");
  }

  for (const [field, expected] of [
    ["recordPhase", "phase-4.0f-host-policy-review-records"],
    ["reviewedPhase", "4.0E"],
    ["policyMetadataSchema", "ardyn.stdio-transport-policy-metadata"],
    ["policyMetadataVersion", HOST_POLICY_REVIEW_RECORD_VERSION],
    ["policyMetadataDigestAlgorithm", "sha256"],
    ["policyContractVersion", HOST_POLICY_REVIEW_RECORD_VERSION],
    ["runtimeStatus", "pre-runtime-policy-only"]
  ]) {
    if (dataProperty(record, field) !== expected) {
      errors.push(`${field} must be ${expected}`);
    }
  }

  const digestHex = dataProperty(record, "policyMetadataDigestHex");
  if (typeof digestHex !== "string" || !/^[0-9a-f]{64}$/.test(digestHex)) {
    errors.push("policyMetadataDigestHex must be a lowercase sha256 digest");
  }

  const invariants = displayStringArray(dataProperty(record, "nonExecutionInvariants"));
  const requiredInvariants = [...HOST_POLICY_REVIEW_REQUIRED_INVARIANTS].sort(compareAscii);
  if (stableJsonStringify(invariants) !== stableJsonStringify(requiredInvariants)) {
    errors.push("nonExecutionInvariants must match the required no-runtime invariant set");
  }

  const decision = dataProperty(record, "decision");
  if (!validationObject(decision)) {
    errors.push("decision must be an object");
  } else {
    const status = dataProperty(decision, "status");
    if (!HOST_POLICY_REVIEW_DECISION_STATUS_SET.has(status)) {
      errors.push("decision.status must be a supported review status");
    }

    for (const [field, expected] of [
      ["reviewMetadataOnly", true],
      ["approvalRuntimeEffectAllowed", false],
      ["rejectionRuntimeEffectAllowed", false]
    ]) {
      if (dataProperty(decision, field) !== expected) {
        errors.push(`decision.${field} must be ${String(expected)}`);
      }
    }

    for (const field of ["approvalRecorded", "rejectionRecorded"]) {
      if (typeof dataProperty(decision, field) !== "boolean") {
        errors.push(`decision.${field} must be boolean`);
      }
    }
  }

  const diagnostics = dataProperty(record, "diagnostics");
  if (!validationObject(diagnostics)) {
    errors.push("diagnostics must be an object");
  } else {
    if (!Array.isArray(dataProperty(diagnostics, "warnings"))) {
      errors.push("diagnostics.warnings must be an array");
    }

    if (!Array.isArray(dataProperty(diagnostics, "errors"))) {
      errors.push("diagnostics.errors must be an array");
    }
  }

  const unknownFields = displayUnknownFieldsForKnownFields(
    record,
    HOST_POLICY_REVIEW_RECORD_KNOWN_FIELD_SET
  ).unknownFields;
  if (unknownFields.length > 0) {
    errors.push(`unknown fields are not allowed: ${unknownFields.join(", ")}`);
  }

  if (errors.length > 0) {
    return {
      compatibility: HOST_POLICY_REVIEW_MALFORMED,
      valid: false,
      failClosed: true,
      validationErrors: errors,
      schema: displayString(schema),
      schemaVersion,
      declaredCompatibility: displayString(declaredCompatibility)
    };
  }

  const compatibility =
    declaredCompatibility === HOST_POLICY_REVIEW_REJECTED_POLICY
      ? HOST_POLICY_REVIEW_REJECTED_POLICY
      : HOST_POLICY_REVIEW_COMPATIBLE;

  return {
    compatibility,
    valid: compatibility === HOST_POLICY_REVIEW_COMPATIBLE,
    failClosed: HOST_POLICY_REVIEW_FAIL_CLOSED_COMPATIBILITIES.has(compatibility),
    validationErrors: [],
    schema: displayString(schema),
    schemaVersion,
    declaredCompatibility: displayString(declaredCompatibility)
  };
}

export function classifyHostPolicyReviewRecordCompatibility(record) {
  return hostPolicyReviewRecordValidationDetails(record).compatibility;
}

function normalizeHostPolicyReviewDecision(decision) {
  return {
    status: displayString(dataProperty(decision, "status")),
    approvalRecorded: displayBoolean(dataProperty(decision, "approvalRecorded")),
    rejectionRecorded: displayBoolean(dataProperty(decision, "rejectionRecorded")),
    reviewMetadataOnly: displayBoolean(dataProperty(decision, "reviewMetadataOnly")),
    approvalRuntimeEffectAllowed: displayBoolean(
      dataProperty(decision, "approvalRuntimeEffectAllowed")
    ),
    rejectionRuntimeEffectAllowed: displayBoolean(
      dataProperty(decision, "rejectionRuntimeEffectAllowed")
    )
  };
}

function normalizeHostPolicyReviewDiagnostics(diagnostics) {
  return {
    warnings: displayStringArray(dataProperty(diagnostics, "warnings")),
    errors: displayStringArray(dataProperty(diagnostics, "errors"))
  };
}

export function normalizeHostPolicyReviewRecordForDisplay(record) {
  const classification = hostPolicyReviewRecordValidationDetails(record);
  const unknown = displayUnknownFieldsForKnownFields(
    record,
    HOST_POLICY_REVIEW_RECORD_KNOWN_FIELD_SET
  );

  return {
    schema: displayString(dataProperty(record, "schema")),
    schemaVersion: displayString(dataProperty(record, "schemaVersion")),
    recordPhase: displayString(dataProperty(record, "recordPhase")),
    reviewedPhase: displayString(dataProperty(record, "reviewedPhase")),
    policyMetadataSchema: displayString(dataProperty(record, "policyMetadataSchema")),
    policyMetadataVersion: displayString(dataProperty(record, "policyMetadataVersion")),
    policyMetadataDigestAlgorithm: displayString(
      dataProperty(record, "policyMetadataDigestAlgorithm")
    ),
    policyMetadataDigestHex: displayString(dataProperty(record, "policyMetadataDigestHex")),
    policyContractVersion: displayString(dataProperty(record, "policyContractVersion")),
    runtimeStatus: displayString(dataProperty(record, "runtimeStatus")),
    nonExecutionInvariants: displayStringArray(dataProperty(record, "nonExecutionInvariants")),
    declaredCompatibility: displayString(dataProperty(record, "compatibility")),
    compatibility: classification.compatibility,
    valid: classification.valid,
    failClosed: classification.failClosed,
    validationErrors: [...classification.validationErrors],
    decision: normalizeHostPolicyReviewDecision(dataProperty(record, "decision")),
    diagnostics: normalizeHostPolicyReviewDiagnostics(dataProperty(record, "diagnostics")),
    unknownFields: [...unknown.unknownFields],
    unknown: unknown.unknown,
    reviewMetadataOnly: true,
    nonExecuting: true,
    safety: createNoExecutionSafetyFlags()
  };
}

export function buildHostPolicyReviewRecordDisplaySummary(record) {
  const normalized = normalizeHostPolicyReviewRecordForDisplay(record);
  const requiredInvariants = [...HOST_POLICY_REVIEW_REQUIRED_INVARIANTS].sort(compareAscii);

  return {
    schema: normalized.schema,
    schemaVersion: normalized.schemaVersion,
    recordPhase: normalized.recordPhase,
    reviewedPhase: normalized.reviewedPhase,
    policy: {
      metadataSchema: normalized.policyMetadataSchema,
      metadataVersion: normalized.policyMetadataVersion,
      metadataDigestAlgorithm: normalized.policyMetadataDigestAlgorithm,
      metadataDigestHex: normalized.policyMetadataDigestHex,
      contractVersion: normalized.policyContractVersion
    },
    runtimeStatus: normalized.runtimeStatus,
    nonExecutionInvariants: {
      count: normalized.nonExecutionInvariants.length,
      values: [...normalized.nonExecutionInvariants],
      requiredValues: requiredInvariants,
      exactRequiredSet:
        stableJsonStringify(normalized.nonExecutionInvariants) ===
        stableJsonStringify(requiredInvariants)
    },
    compatibility: {
      declared: normalized.declaredCompatibility,
      classification: normalized.compatibility,
      valid: normalized.valid,
      failClosed: normalized.failClosed,
      validationErrors: [...normalized.validationErrors]
    },
    decision: normalized.decision,
    diagnostics: {
      warningCount: normalized.diagnostics.warnings.length,
      errorCount: normalized.diagnostics.errors.length,
      warnings: [...normalized.diagnostics.warnings],
      errors: [...normalized.diagnostics.errors]
    },
    unknownFields: [...normalized.unknownFields],
    unknownFieldCount: normalized.unknownFields.length,
    reviewMetadataOnly: true,
    nonExecuting: true,
    safety: createNoExecutionSafetyFlags()
  };
}

function pushHostPolicyReviewValueDifference(differences, type, path, left, right) {
  if (stableJsonStringify(left) === stableJsonStringify(right)) {
    return;
  }

  differences.push({
    type,
    path,
    left: stableJsonValue(left),
    right: stableJsonValue(right),
    reviewEvidenceOnly: true,
    grantsRuntimeApproval: false
  });
}

function pushHostPolicyReviewStringArrayDifference(differences, type, path, left, right) {
  if (stableJsonStringify(left) === stableJsonStringify(right)) {
    return;
  }

  differences.push({
    type,
    path,
    left: [...left],
    right: [...right],
    ...stringArrayDifference(left, right),
    reviewEvidenceOnly: true,
    grantsRuntimeApproval: false
  });
}

function hostPolicyReviewDecisionMetadataForComparison(decision) {
  return {
    approvalRecorded: decision.approvalRecorded,
    rejectionRecorded: decision.rejectionRecorded,
    reviewMetadataOnly: decision.reviewMetadataOnly,
    approvalRuntimeEffectAllowed: decision.approvalRuntimeEffectAllowed,
    rejectionRuntimeEffectAllowed: decision.rejectionRuntimeEffectAllowed
  };
}

export function compareHostPolicyReviewRecords(leftRecord, rightRecord) {
  const left = normalizeHostPolicyReviewRecordForDisplay(leftRecord);
  const right = normalizeHostPolicyReviewRecordForDisplay(rightRecord);
  const differences = [];

  pushHostPolicyReviewValueDifference(
    differences,
    "record-kind-mismatch",
    "schema",
    left.schema,
    right.schema
  );
  pushHostPolicyReviewValueDifference(
    differences,
    "record-version-mismatch",
    "schemaVersion",
    left.schemaVersion,
    right.schemaVersion
  );
  pushHostPolicyReviewValueDifference(
    differences,
    "record-phase-mismatch",
    "recordPhase",
    left.recordPhase,
    right.recordPhase
  );
  pushHostPolicyReviewValueDifference(
    differences,
    "reviewed-phase-mismatch",
    "reviewedPhase",
    left.reviewedPhase,
    right.reviewedPhase
  );
  pushHostPolicyReviewValueDifference(
    differences,
    "policy-contract-version-mismatch",
    "policyContractVersion",
    left.policyContractVersion,
    right.policyContractVersion
  );
  pushHostPolicyReviewValueDifference(
    differences,
    "policy-metadata-mismatch",
    "policyMetadataSchema",
    left.policyMetadataSchema,
    right.policyMetadataSchema
  );
  pushHostPolicyReviewValueDifference(
    differences,
    "policy-metadata-mismatch",
    "policyMetadataVersion",
    left.policyMetadataVersion,
    right.policyMetadataVersion
  );
  pushHostPolicyReviewValueDifference(
    differences,
    "policy-metadata-digest-mismatch",
    "policyMetadataDigestAlgorithm",
    left.policyMetadataDigestAlgorithm,
    right.policyMetadataDigestAlgorithm
  );
  pushHostPolicyReviewValueDifference(
    differences,
    "policy-metadata-digest-mismatch",
    "policyMetadataDigestHex",
    left.policyMetadataDigestHex,
    right.policyMetadataDigestHex
  );
  pushHostPolicyReviewValueDifference(
    differences,
    "runtime-status-mismatch",
    "runtimeStatus",
    left.runtimeStatus,
    right.runtimeStatus
  );
  pushHostPolicyReviewStringArrayDifference(
    differences,
    "non-execution-invariants-change",
    "nonExecutionInvariants",
    left.nonExecutionInvariants,
    right.nonExecutionInvariants
  );
  pushHostPolicyReviewValueDifference(
    differences,
    "compatibility-classification-change",
    "compatibility",
    left.compatibility,
    right.compatibility
  );
  pushHostPolicyReviewValueDifference(
    differences,
    "decision-status-change",
    "decision.status",
    left.decision.status,
    right.decision.status
  );
  pushHostPolicyReviewValueDifference(
    differences,
    "decision-metadata-change",
    "decision",
    hostPolicyReviewDecisionMetadataForComparison(left.decision),
    hostPolicyReviewDecisionMetadataForComparison(right.decision)
  );
  pushHostPolicyReviewStringArrayDifference(
    differences,
    "diagnostic-warnings-change",
    "diagnostics.warnings",
    left.diagnostics.warnings,
    right.diagnostics.warnings
  );
  pushHostPolicyReviewStringArrayDifference(
    differences,
    "diagnostic-errors-change",
    "diagnostics.errors",
    left.diagnostics.errors,
    right.diagnostics.errors
  );

  const failClosed =
    left.failClosed ||
    right.failClosed ||
    differences.some((difference) =>
      ["policy-metadata-digest-mismatch", "runtime-status-mismatch"].includes(difference.type)
    );

  return {
    schema: HOST_POLICY_REVIEW_RECORD_COMPARISON_SCHEMA,
    schemaVersion: HOST_POLICY_REVIEW_RECORD_COMPARISON_VERSION,
    comparisonPhase: ARDYN_HOST_POLICY_REVIEW_COMPARISON_PHASE,
    artifactKind: "host_policy_review_record",
    equal: differences.length === 0,
    differenceCount: differences.length,
    failClosed,
    manualReviewRequired: failClosed || differences.length > 0,
    comparisonDecision: {
      reviewMetadataOnly: true,
      runtimeApprovalGranted: false,
      runtimeApprovalDerivedFromComparison: false,
      approvalMetadataInert: true,
      rejectionMetadataInert: true,
      futureLiveRuntimeBlockedUntilSeparateApprovedPhase: true
    },
    left: buildHostPolicyReviewRecordDisplaySummary(leftRecord),
    right: buildHostPolicyReviewRecordDisplaySummary(rightRecord),
    differences,
    nonExecuting: true,
    safety: createNoExecutionSafetyFlags()
  };
}

export function formatHostPolicyReviewRecordComparisonJson(comparison) {
  return `${JSON.stringify(comparison, null, 2)}\n`;
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

function stdioDryRunSessionId(manifest, task) {
  const hash = createHash("sha256")
    .update(
      stableJsonStringify({
        phase: ARDYN_STDIO_DRY_RUN_PHASE,
        manifest: {
          name: manifest.name,
          version: manifest.version,
          schemaVersion: manifest.schemaVersion
        },
        task: normalizeTask(task)
      })
    )
    .digest("hex");

  return `session.phase4-0a.${hash.slice(0, 16)}`;
}

function stdioDryRunCreatedAt(sequence) {
  return `1970-01-01T00:00:${String(sequence).padStart(2, "0")}Z`;
}

function stdioDryRunEventId(sessionId, eventType, sequence, payload) {
  const slug = eventType.replaceAll(".", "-");
  const hash = createHash("sha256")
    .update(
      stableJsonStringify({
        sessionId,
        eventType,
        sequence,
        payload
      })
    )
    .digest("hex");

  return `evt.phase4-0a.${String(sequence).padStart(3, "0")}.${slug}.${hash.slice(0, 12)}`;
}

function createStdioDryRunEvent(sessionId, sequence, eventType, payload) {
  return {
    schemaVersion: ARDYN_SCHEMA_VERSION,
    eventId: stdioDryRunEventId(sessionId, eventType, sequence, payload),
    sessionId,
    sequence,
    createdAt: stdioDryRunCreatedAt(sequence),
    sourceHarness: "ardyn",
    eventType,
    payload,
    nonExecuting: true,
    safety: createNoExecutionSafetyFlags()
  };
}

function stdioDryRunOutcome(plan) {
  if (plan.unresolvedRequests.length > 0) {
    return {
      outcome: "no_match",
      summary:
        "Dry-run planning completed with unresolved capability requests; execution remains disabled."
    };
  }

  if (plan.approvalDecision.status === APPROVAL_DECISION_REQUIRED) {
    return {
      outcome: "approval_pending",
      summary: "Dry-run planning completed with approval pending; execution remains disabled."
    };
  }

  if (plan.approvalDecision.status === APPROVAL_DECISION_DENIED) {
    return {
      outcome: "cancelled",
      summary: "Dry-run planning recorded a denial; execution remains disabled."
    };
  }

  return {
    outcome: "success",
    summary: "Dry-run session event emission completed without execution."
  };
}

function assertSessionEventValidForEmission(event) {
  const validation = validateSessionEventAtPath(event, "event");

  if (!validation.valid) {
    throw new Error(`session event ${event?.sequence ?? "unknown"} is invalid: ${validation.errors.join("; ")}`);
  }
}

export function createStdioDryRunSessionEvents(manifest, task, options = {}) {
  const plan = createTaskPlan(manifest, task, options);
  const sessionId = options.sessionId ?? stdioDryRunSessionId(manifest, task);
  const descriptors = [
    {
      eventType: "session.started",
      payload: {
        phase: ARDYN_STDIO_DRY_RUN_PHASE,
        mode: "dry-run",
        manifestName: manifest.name
      }
    },
    {
      eventType: "session.heartbeat",
      payload: {
        status: "planning",
        activeTaskId: task.id,
        note: "Dry-run emission only; no runtime loop is active."
      }
    },
    {
      eventType: "session.capabilities",
      payload: {
        capabilityIds: normalizeCapabilities(manifest).map((capability) => capability.id)
      }
    },
    {
      eventType: "task.planned",
      payload: {
        taskId: task.id,
        requestedCapabilityIds: [...plan.requestedCapabilities],
        selectedCapabilityIds: plan.selectedCapabilities.map((capability) => capability.id),
        unresolvedRequests: [...plan.unresolvedRequests]
      }
    }
  ];

  if (
    plan.approval.required &&
    Array.isArray(plan.approvalDecision.requestedCapabilityIds) &&
    plan.approvalDecision.requestedCapabilityIds.length > 0
  ) {
    descriptors.push({
      eventType: "approval.requested",
      payload: {
        approvalId: plan.approvalDecision.id,
        taskId: task.id,
        requestedCapabilityIds: [...plan.approvalDecision.requestedCapabilityIds],
        reason: plan.approvalDecision.reason
      }
    });
  }

  descriptors.push(
    {
      eventType: "approval.recorded",
      payload: {
        approvalId: plan.approvalDecision.id,
        taskId: task.id,
        status: plan.approvalDecision.status,
        reason: plan.approvalDecision.reason,
        nonExecuting: true
      }
    },
    {
      eventType: "session.completed",
      payload: stdioDryRunOutcome(plan)
    }
  );

  const events = descriptors.map((descriptor, index) =>
    createStdioDryRunEvent(sessionId, index + 1, descriptor.eventType, descriptor.payload)
  );

  for (const event of events) {
    assertSessionEventValidForEmission(event);
  }

  return events;
}

export function formatSessionEventsJsonl(events) {
  if (!Array.isArray(events) || events.length === 0) {
    throw new Error("events must contain at least one session event.");
  }

  const lines = [];

  for (let index = 0; index < events.length; index += 1) {
    if (!Object.prototype.hasOwnProperty.call(events, index)) {
      throw new Error(`session event ${index + 1} is missing.`);
    }

    const event = events[index];
    const validation = validateSessionEventAtPath(event, "event");

    if (!validation.valid) {
      throw new Error(`session event ${index + 1} is invalid: ${validation.errors.join("; ")}`);
    }

    lines.push(JSON.stringify(event));
  }

  return `${lines.join("\n")}\n`;
}

function isPlainObjectRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function jsonlRuntimeEffect() {
  return {
    currentContractEnablesRuntime: false,
    processStdioOwnershipAvailable: false,
    stdoutWriterAvailable: false,
    stderrWriterAvailable: false,
    stdinReaderAvailable: false,
    runtimeCommandAvailable: false,
    writesToStdout: false,
    writesToStderr: false
  };
}

function framingValidationRecord(classification, fields = {}) {
  const valid = classification === JSONL_WHOLE_LINE_BUNDLE_VALID;

  return {
    schema: "ardyn.jsonl-whole-line-bundle-validation",
    schemaVersion: "0.1.0",
    phase: ARDYN_STDIO_FRAMING_REDACTION_PHASE,
    classification,
    valid,
    lineCount: fields.lineCount ?? 0,
    lfOnly: fields.lfOnly ?? true,
    finalLf: fields.finalLf ?? false,
    blankLinesAllowed: false,
    partialLineEmissionAllowed: false,
    oneJsonObjectPerLine: valid,
    errors: fields.errors ?? [],
    reviewOnly: true,
    runtimeEffect: jsonlRuntimeEffect()
  };
}

export function formatJsonlWholeLinesForReview(records) {
  if (!Array.isArray(records) || records.length === 0) {
    throw new Error("review JSONL records must contain at least one object.");
  }

  const lines = [];

  for (let index = 0; index < records.length; index += 1) {
    if (!Object.prototype.hasOwnProperty.call(records, index)) {
      throw new Error(`review JSONL record ${index + 1} is missing.`);
    }

    const record = records[index];

    if (!isPlainObjectRecord(record)) {
      throw new Error(`review JSONL record ${index + 1} must be a JSON object.`);
    }

    lines.push(stableJsonStringify(record));
  }

  return `${lines.join("\n")}\n`;
}

export function validateJsonlWholeLineBundle(jsonl) {
  if (typeof jsonl !== "string") {
    return framingValidationRecord(JSONL_WHOLE_LINE_BUNDLE_MALFORMED_JSON_LINE, {
      errors: ["bundle must be a string"]
    });
  }

  if (jsonl.includes("\r")) {
    return framingValidationRecord(JSONL_WHOLE_LINE_BUNDLE_CRLF_REJECTED, {
      lfOnly: false,
      finalLf: jsonl.endsWith("\n"),
      errors: ["bundle must be LF-only and must not contain CR or CRLF"]
    });
  }

  if (!jsonl.endsWith("\n")) {
    return framingValidationRecord(JSONL_WHOLE_LINE_BUNDLE_MISSING_FINAL_LF, {
      finalLf: false,
      errors: ["bundle must end with a final LF"]
    });
  }

  const lines = jsonl.split("\n");
  const contentLines = lines.slice(0, -1);

  for (let index = 0; index < contentLines.length; index += 1) {
    if (contentLines[index] === "") {
      return framingValidationRecord(JSONL_WHOLE_LINE_BUNDLE_BLANK_LINE_REJECTED, {
        lineCount: contentLines.length,
        finalLf: true,
        errors: [`line ${index + 1} must not be blank`]
      });
    }
  }

  for (let index = 0; index < contentLines.length; index += 1) {
    const line = contentLines[index];
    const trimmed = line.trim();

    if (trimmed !== line) {
      return framingValidationRecord(JSONL_WHOLE_LINE_BUNDLE_MALFORMED_JSON_LINE, {
        lineCount: contentLines.length,
        finalLf: true,
        errors: [`line ${index + 1} must not contain leading or trailing whitespace`]
      });
    }

    if (trimmed.startsWith("{") && !trimmed.endsWith("}")) {
      return framingValidationRecord(JSONL_WHOLE_LINE_BUNDLE_PARTIAL_LINE_REJECTED, {
        lineCount: contentLines.length,
        finalLf: true,
        errors: [`line ${index + 1} is a partial JSON object`]
      });
    }

    let parsed;
    try {
      parsed = JSON.parse(line);
    } catch {
      return framingValidationRecord(JSONL_WHOLE_LINE_BUNDLE_MALFORMED_JSON_LINE, {
        lineCount: contentLines.length,
        finalLf: true,
        errors: [`line ${index + 1} must contain exactly one valid JSON object`]
      });
    }

    if (!isPlainObjectRecord(parsed)) {
      return framingValidationRecord(JSONL_WHOLE_LINE_BUNDLE_MALFORMED_JSON_LINE, {
        lineCount: contentLines.length,
        finalLf: true,
        errors: [`line ${index + 1} must contain a JSON object`]
      });
    }
  }

  return framingValidationRecord(JSONL_WHOLE_LINE_BUNDLE_VALID, {
    lineCount: contentLines.length,
    finalLf: true
  });
}

function diagnosticCodeIsDeterministic(code) {
  return typeof code === "string" && /^[a-z][a-z0-9_.-]{2,63}$/.test(code);
}

function replaceAndTrack(message, pattern, replacement, kind, redactions, trackedReplacement = replacement) {
  const matched = pattern.test(message);
  pattern.lastIndex = 0;
  const next = message.replace(pattern, replacement);

  if (matched) {
    redactions.push({ kind, replacement: trackedReplacement });
  }

  return next;
}

function redactSensitiveDiagnosticMessage(message) {
  const redactions = [];

  if (message.includes("\u0000") || /UNREDACTABLE_RAW_BYTES/.test(message)) {
    return {
      message: "[DIAGNOSTIC_REDACTION_FAILED]",
      redactions,
      unredactable: true
    };
  }

  let redacted = message;
  redacted = replaceAndTrack(
    redacted,
    /raw parse detail:\s*.+$/gi,
    "raw parse detail: [REDACTED_RAW_PARSE_DETAIL]",
    "raw_parse_detail",
    redactions
  );
  redacted = replaceAndTrack(
    redacted,
    /stack:\s*[\s\S]+$/gi,
    "stack: [REDACTED_STACK]",
    "stack_trace",
    redactions
  );
  redacted = replaceAndTrack(
    redacted,
    /\n\s*at\s+[\s\S]+$/g,
    " [REDACTED_STACK]",
    "stack_trace",
    redactions
  );
  redacted = replaceAndTrack(
    redacted,
    /[A-Za-z]:\\Users\\[^ "'\n\r]+/g,
    "[REDACTED_HOME_PATH]",
    "user_home_path",
    redactions
  );
  redacted = replaceAndTrack(
    redacted,
    /\/(?:Users|home)\/[^ "'\n\r]+/g,
    "[REDACTED_HOME_PATH]",
    "user_home_path",
    redactions
  );
  redacted = replaceAndTrack(
    redacted,
    /[A-Za-z]:\\(?!Users\\)[^ "'\n\r]+/g,
    "[REDACTED_ABSOLUTE_PATH]",
    "absolute_path",
    redactions
  );
  redacted = replaceAndTrack(
    redacted,
    /\/(?:var|tmp|etc|opt|srv|workspace|mnt)\/[^ "'\n\r]+/g,
    "[REDACTED_ABSOLUTE_PATH]",
    "absolute_path",
    redactions
  );
  redacted = replaceAndTrack(
    redacted,
    /process\.env\.[A-Z0-9_]+(?:=[^ "'\n\r]+)?/g,
    "process.env.[REDACTED_ENV]",
    "environment_variable",
    redactions
  );
  redacted = replaceAndTrack(
    redacted,
    /\b(?:SECRET|TOKEN|API_KEY|APIKEY|PASSWORD|AUTHORIZATION|HOME|USER)=([^ "'\n\r]+)/g,
    "[REDACTED_ENV]=[REDACTED]",
    "environment_variable",
    redactions
  );
  redacted = replaceAndTrack(
    redacted,
    /\b(secret|token|api[_-]?key|password|authorization)\s*[:=]\s*[^ "'\n\r,;]+/gi,
    "$1=[REDACTED_SECRET]",
    "secret_or_token",
    redactions,
    "secret-or-token=[REDACTED_SECRET]"
  );
  redacted = replaceAndTrack(
    redacted,
    /\bBearer\s+[A-Za-z0-9._-]+/g,
    "Bearer [REDACTED_TOKEN]",
    "secret_or_token",
    redactions
  );
  redacted = replaceAndTrack(
    redacted,
    /\bsk-[A-Za-z0-9_-]{8,}\b/g,
    "[REDACTED_API_KEY]",
    "api_key",
    redactions
  );

  if (/[\r\n]/.test(redacted)) {
    return {
      message: "[DIAGNOSTIC_REDACTION_FAILED]",
      redactions,
      unredactable: true
    };
  }

  return {
    message: redacted,
    redactions,
    unredactable: false
  };
}

function redactionRuntimeEffect() {
  return {
    currentContractEnablesRuntime: false,
    processStdioOwnershipAvailable: false,
    stderrWriterAvailable: false,
    stdoutWriterAvailable: false,
    runtimeCommandAvailable: false,
    writesToStdout: false,
    writesToStderr: false
  };
}

function redactionRecord(classification, fields = {}) {
  return {
    schema: "ardyn.stderr-diagnostic-redaction-review",
    schemaVersion: "0.1.0",
    phase: ARDYN_STDIO_FRAMING_REDACTION_PHASE,
    classification,
    diagnostic: {
      code: fields.code ?? "diagnostic.malformed",
      message: fields.message ?? "[DIAGNOSTIC_REDACTION_FAILED]"
    },
    redactions: fields.redactions ?? [],
    failClosed: classification !== STDERR_REDACTION_SAFE,
    reviewOnly: true,
    runtimeEffect: redactionRuntimeEffect()
  };
}

export function redactStderrDiagnosticForReview(diagnostic) {
  if (
    !diagnostic ||
    typeof diagnostic !== "object" ||
    !diagnosticCodeIsDeterministic(diagnostic.code) ||
    typeof diagnostic.message !== "string" ||
    diagnostic.message.length === 0
  ) {
    return redactionRecord(STDERR_REDACTION_MALFORMED);
  }

  const redacted = redactSensitiveDiagnosticMessage(diagnostic.message);

  if (redacted.unredactable) {
    return redactionRecord(STDERR_REDACTION_UNREDACTABLE_FAIL_CLOSED, {
      code: diagnostic.code,
      message: redacted.message,
      redactions: redacted.redactions
    });
  }

  return redactionRecord(STDERR_REDACTION_SAFE, {
    code: diagnostic.code,
    message: redacted.message,
    redactions: redacted.redactions
  });
}

export function classifyRedactionSafety(diagnostic) {
  return redactStderrDiagnosticForReview(diagnostic).classification;
}

export function createStdioFramingRedactionContractForReview() {
  return {
    schema: STDIO_FRAMING_REDACTION_CONTRACT_SCHEMA,
    schemaVersion: STDIO_FRAMING_REDACTION_CONTRACT_VERSION,
    contractKind: "stdio-framing-redaction-contract",
    contractPhase: ARDYN_STDIO_FRAMING_REDACTION_PHASE,
    reviewedPhase: "4.1C",
    jsonlFraming: {
      exactlyOneJsonObjectPerLine: true,
      jsonObjectOnly: true,
      lfOnly: true,
      finalLfRequired: true,
      blankLinesAllowed: false,
      crlfAllowed: false,
      partialLineEmissionAllowed: false,
      deterministicKeyOrder: "ascii-key-order-via-stable-json-display-v1",
      helper: "formatJsonlWholeLinesForReview"
    },
    stderrRedaction: {
      deterministicCodeRequired: true,
      deterministicMessageRequired: true,
      codePattern: "^[a-z][a-z0-9_.-]{2,63}$",
      redactionTokenPolicy: "typed-redaction-placeholders",
      helper: "redactStderrDiagnosticForReview",
      classifier: "classifyRedactionSafety",
      failClosedOnUnredactableDiagnostics: true,
      redactedSubjects: [
        "secrets",
        "environment_variables",
        "absolute_paths",
        "user_home_paths",
        "tokens",
        "api_keys",
        "stack_traces",
        "raw_parse_details"
      ]
    },
    validation: {
      helper: "validateJsonlWholeLineBundle",
      jsonlClassifications: [
        JSONL_WHOLE_LINE_BUNDLE_VALID,
        JSONL_WHOLE_LINE_BUNDLE_BLANK_LINE_REJECTED,
        JSONL_WHOLE_LINE_BUNDLE_MISSING_FINAL_LF,
        JSONL_WHOLE_LINE_BUNDLE_CRLF_REJECTED,
        JSONL_WHOLE_LINE_BUNDLE_MALFORMED_JSON_LINE,
        JSONL_WHOLE_LINE_BUNDLE_PARTIAL_LINE_REJECTED
      ],
      redactionClassifications: [
        STDERR_REDACTION_SAFE,
        STDERR_REDACTION_UNREDACTABLE_FAIL_CLOSED,
        STDERR_REDACTION_MALFORMED
      ]
    },
    runtimeEffect: {
      currentContractEnablesRuntime: false,
      runtimeImplementationAvailable: false,
      runtimeCommandAvailable: false,
      processStdioOwnershipAvailable: false,
      stdinReaderAvailable: false,
      stdoutWriterAvailable: false,
      stderrWriterAvailable: false,
      failureAuditRuntimeAvailable: false,
      approvalEvaluatorAvailable: false
    },
    audit: {
      createdAt: "1970-01-01T00:00:00.000Z",
      createdBy: "codex-phase-4.1c",
      reviewer: "Codex",
      devinReviewRequiredNow: false,
      preserveDevinReviewFor: "major-runtime-readiness-checkpoint",
      metadataOnly: true,
      writesFiles: false,
      runsRuntime: false
    }
  };
}

export function formatStdioFramingRedactionContractJsonForReview() {
  return `${JSON.stringify(createStdioFramingRedactionContractForReview(), null, 2)}\n`;
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
