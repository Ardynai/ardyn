import { createHash } from "node:crypto";
// P3a: diagnostic-redaction family extracted from this file
// (public surface preserved via identical re-exports below).
import {
  ARDYN_STDIO_FRAMING_REDACTION_PHASE,
  STDERR_REDACTION_SAFE,
  STDERR_REDACTION_UNREDACTABLE_FAIL_CLOSED,
  STDERR_REDACTION_MALFORMED,
  redactStderrDiagnosticForReview,
  classifyRedactionSafety,
} from "./internal/diagnostic-redaction.mjs";
import { readFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { isAbsolute, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";
import { UTC_ISO_TIMESTAMP_WITH_MILLISECONDS_PATTERN, isPlainObjectRecord, isUtcIsoTimestampWithMilliseconds, isReviewedAtDefaulted } from "./internal/utils.mjs";

export const ARDYN_SCHEMA_VERSION = "0.1.0";
export const ARDYN_PHASE = "phase-3-task-planning";
export const ARDYN_STDIO_DRY_RUN_PHASE = "phase-4.0a-stdio-event-dry-run";


export { ARDYN_STDIO_FRAMING_REDACTION_PHASE, STDERR_REDACTION_SAFE, STDERR_REDACTION_UNREDACTABLE_FAIL_CLOSED, STDERR_REDACTION_MALFORMED } from "./internal/diagnostic-redaction.mjs";
export { redactStderrDiagnosticForReview, classifyRedactionSafety } from "./internal/diagnostic-redaction.mjs";
export const ARDYN_TRANSCRIPT_REPLAY_CONTRACT_PHASE =
  "phase-4.1d-transcript-replay-contracts";
export const TRANSCRIPT_PERSISTENCE_CONTRACT_SCHEMA =
  "ardyn.transcript-persistence-contract";
export const TRANSCRIPT_REPLAY_CONTRACT_SCHEMA = "ardyn.transcript-replay-contract";
export const TRANSCRIPT_REPLAY_COMPATIBILITY_RECORD_SCHEMA =
  "ardyn.transcript-replay-compatibility-record";
export const TRANSCRIPT_REPLAY_CONTRACT_VERSION = "0.1.0";
export const TRANSCRIPT_REPLAY_CONTRACT_ONLY = "replay_contract_only";
export const TRANSCRIPT_REPLAY_COMPATIBLE = "compatible";
export const TRANSCRIPT_REPLAY_UPGRADE_AVAILABLE = "upgrade_available";
export const TRANSCRIPT_REPLAY_UNSUPPORTED_MAJOR = "unsupported_major";
export const TRANSCRIPT_REPLAY_MALFORMED = "malformed";
export const TRANSCRIPT_REPLAY_DIGEST_MISMATCH = "digest_mismatch";
export const TRANSCRIPT_REPLAY_SEQUENCE_GAP = "sequence_gap";
export const TRANSCRIPT_REPLAY_DUPLICATE_SEQUENCE = "duplicate_sequence";
export const TRANSCRIPT_REPLAY_OUT_OF_ORDER_SEQUENCE = "out_of_order_sequence";
export const TRANSCRIPT_REPLAY_RUNTIME_UNAVAILABLE = "replay_runtime_unavailable";
export const ARDYN_FAILURE_AUDIT_CONTRACT_PHASE =
  "phase-4.1e-failure-audit-kill-semantics";
export const FAILURE_AUDIT_RECORD_SCHEMA = "ardyn.failure-audit-record";
export const FAILURE_AUDIT_CONTRACT_VERSION = "0.1.0";
export const FAILURE_AUDIT_STATIC_CONTRACT_ONLY = "static_contract_only";
export const FAILURE_AUDIT_CLEAN_FAILURE = "clean_failure";
export const FAILURE_AUDIT_REDACTED_FAILURE = "redacted_failure";
export const FAILURE_AUDIT_UNREDACTABLE_FAILURE = "unredactable_failure";
export const FAILURE_AUDIT_TERMINAL_COMPLETED = "terminal_completed";
export const FAILURE_AUDIT_TERMINAL_FAILED = "terminal_failed";
export const FAILURE_AUDIT_TERMINAL_ABORTED = "terminal_aborted";
export const FAILURE_AUDIT_TERMINAL_REJECTED = "terminal_rejected";
export const FAILURE_AUDIT_NONZERO_EXIT_EXPECTED = "nonzero_exit_expected";
export const FAILURE_AUDIT_NONZERO_EXIT_UNEXPECTED = "nonzero_exit_unexpected";
export const FAILURE_AUDIT_CLEANUP_REQUIRED = "cleanup_required";
export const FAILURE_AUDIT_CLEANUP_NOT_AVAILABLE = "cleanup_not_available";
export const FAILURE_AUDIT_RUNTIME_UNAVAILABLE = "runtime_unavailable";
export const FAILURE_AUDIT_MALFORMED = "malformed";
export const FAILURE_AUDIT_UNSUPPORTED_MAJOR = "unsupported_major";
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
export const AUTH_PERMISSIONS_CONTRACT_BOUNDARY_MAP_SCHEMA =
  "ardyn.phase-5.62.auth-permissions-contract-boundary-map-result";
export const AUTH_PERMISSIONS_CONTRACT_BOUNDARY_MAP_VERSION = "0.1.0";
export const AUTH_PERMISSIONS_CONTRACT_BOUNDARY_MAP_KIND =
  "auth-permissions-contract-boundary-map";
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

  // S1: reject ../ traversal
  if (filePath.includes("../") || filePath.includes("..\\") || filePath === "..") {
    return `${label} must not contain parent-directory traversal (../).`;
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
  // S1: validate path — skip for internally-resolved absolute paths (from resolveLocalJsonPath)
  // but still validate UNC paths (//) and protocol-relative paths
  const isResolvedAbsolute = (filePath.startsWith("/") && !filePath.startsWith("//")) ||
    (/^[A-Za-z]:[\\/]/.test(filePath) && !filePath.startsWith("//"));
  if (!isResolvedAbsolute) {
    assertLocalJsonFilePath(filePath, label);
  }

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










const TRANSCRIPT_REPLAY_CLASSIFICATIONS = Object.freeze([
  TRANSCRIPT_REPLAY_CONTRACT_ONLY,
  TRANSCRIPT_REPLAY_COMPATIBLE,
  TRANSCRIPT_REPLAY_UPGRADE_AVAILABLE,
  TRANSCRIPT_REPLAY_UNSUPPORTED_MAJOR,
  TRANSCRIPT_REPLAY_MALFORMED,
  TRANSCRIPT_REPLAY_DIGEST_MISMATCH,
  TRANSCRIPT_REPLAY_SEQUENCE_GAP,
  TRANSCRIPT_REPLAY_DUPLICATE_SEQUENCE,
  TRANSCRIPT_REPLAY_OUT_OF_ORDER_SEQUENCE,
  TRANSCRIPT_REPLAY_RUNTIME_UNAVAILABLE
]);
const TRANSCRIPT_REPLAY_CLASSIFICATION_SET = new Set(TRANSCRIPT_REPLAY_CLASSIFICATIONS);
const STATIC_TRANSCRIPT_REPLAY_PERSISTED_AT = "1970-01-01T00:00:00.000Z";

function transcriptReplayRuntimeEffect() {
  return {
    currentContractEnablesRuntime: false,
    runtimeImplementationAvailable: false,
    runtimeCommandAvailable: false,
    replayCommandAvailable: false,
    transcriptPersistenceRuntimeAvailable: false,
    transcriptReplayRuntimeAvailable: false,
    processStdioOwnershipAvailable: false,
    stdinReaderAvailable: false,
    stdoutWriterAvailable: false,
    stderrWriterAvailable: false,
    failureAuditRuntimeAvailable: false,
    approvalEvaluatorAvailable: false,
    writesFiles: false,
    readsFiles: false
  };
}

function transcriptReplayInvariantSummary() {
  return [...HOST_POLICY_REVIEW_REQUIRED_INVARIANTS].sort(compareAscii);
}

function sha256StableJson(value) {
  return createHash("sha256").update(stableJsonStringify(value)).digest("hex");
}

function eventDigestRecord(value) {
  return {
    algorithm: "sha256",
    value: `sha256:${sha256StableJson(value)}`
  };
}

function transcriptEventIndex(transcript) {
  const events = Array.isArray(transcript?.events) ? transcript.events : [];

  return events.map((event) => ({
    eventId: typeof event?.eventId === "string" ? event.eventId : null,
    eventType: typeof event?.eventType === "string" ? event.eventType : null,
    sequence: Number.isInteger(event?.sequence) ? event.sequence : null,
    eventDigest: eventDigestRecord(event)
  }));
}

function sequenceRangeFromEventIndex(eventIndex) {
  const sequences = eventIndex
    .map((event) => event.sequence)
    .filter((sequence) => Number.isInteger(sequence));

  return {
    first: sequences.length > 0 ? sequences[0] : null,
    last: sequences.length > 0 ? sequences.at(-1) : null
  };
}

function transcriptReplaySourceReference(options = {}) {
  return {
    reference: options.sourceEventStreamReference ?? "stdio-jsonl-session-events.phase4.static",
    streamKind: "stdio-jsonl-session-events",
    sourcePhase: ARDYN_STDIO_DRY_RUN_PHASE,
    liveStreamReaderAvailable: false,
    replayRuntimeConsumerAvailable: false
  };
}

function transcriptReplayAudit(createdBy) {
  return {
    createdAt: STATIC_TRANSCRIPT_REPLAY_PERSISTED_AT,
    createdBy,
    reviewer: "Codex",
    devinReviewRequiredNow: false,
    preserveDevinReviewFor: "major-runtime-readiness-checkpoint",
    metadataOnly: true,
    writesFiles: false,
    runsRuntime: false
  };
}

function transcriptArtifactFromTranscript(transcript) {
  return {
    artifactKind: "ardyn.session-transcript",
    transcriptVersion:
      typeof transcript?.schemaVersion === "string" ? transcript.schemaVersion : null,
    sessionId: typeof transcript?.sessionId === "string" ? transcript.sessionId : null,
    sourceHarness: typeof transcript?.sourceHarness === "string" ? transcript.sourceHarness : null
  };
}

function transcriptReplayFailureReasons(classification, reasons = []) {
  if (classification === TRANSCRIPT_REPLAY_COMPATIBLE) {
    return [...reasons];
  }

  if (classification === TRANSCRIPT_REPLAY_UPGRADE_AVAILABLE) {
    return [
      ...reasons,
      "same-major transcript upgrade is display-only and cannot run replay in Phase 4.1D"
    ];
  }

  if (classification === TRANSCRIPT_REPLAY_CONTRACT_ONLY) {
    return [...reasons, "contract metadata is review-only and cannot run replay in Phase 4.1D"];
  }

  if (classification === TRANSCRIPT_REPLAY_RUNTIME_UNAVAILABLE) {
    return [...reasons, "replay runtime remains unavailable in Phase 4.1D"];
  }

  return [...reasons];
}

export function createTranscriptPersistenceContractForReview(transcript, options = {}) {
  const compatibility = classifySessionTranscriptCompatibility(transcript);

  if (
    compatibility.compatibility !== SESSION_TRANSCRIPT_COMPATIBLE &&
    compatibility.compatibility !== SESSION_TRANSCRIPT_UPGRADE_AVAILABLE
  ) {
    throw new Error(
      `transcript must be compatible for static persistence review: ${compatibility.compatibility}`
    );
  }

  const eventIndex = transcriptEventIndex(transcript);
  const sequenceRange = sequenceRangeFromEventIndex(eventIndex);

  return {
    schema: TRANSCRIPT_PERSISTENCE_CONTRACT_SCHEMA,
    schemaVersion: TRANSCRIPT_REPLAY_CONTRACT_VERSION,
    contractKind: "transcript-persistence-contract",
    contractPhase: ARDYN_TRANSCRIPT_REPLAY_CONTRACT_PHASE,
    reviewedPhase: "4.1D",
    transcriptArtifact: transcriptArtifactFromTranscript(transcript),
    sourceEventStreamReference: transcriptReplaySourceReference(options),
    eventCount: eventIndex.length,
    sequenceRange,
    eventDigest: eventDigestRecord(eventIndex),
    eventIndex,
    persistedAt: options.persistedAt ?? STATIC_TRANSCRIPT_REPLAY_PERSISTED_AT,
    persistedAtIsDeterministicFixtureMetadataOnly: true,
    replayCompatibilityClassification: TRANSCRIPT_REPLAY_CONTRACT_ONLY,
    replaySafetyStatus: "static-contract-only",
    nonExecutionInvariantSummary: transcriptReplayInvariantSummary(),
    failureReasons: transcriptReplayFailureReasons(TRANSCRIPT_REPLAY_CONTRACT_ONLY),
    runtimeEffect: transcriptReplayRuntimeEffect(),
    audit: transcriptReplayAudit("codex-phase-4.1d")
  };
}

export function createTranscriptReplayContractForReview(persistenceContract) {
  if (
    !isPlainObjectRecord(persistenceContract) ||
    persistenceContract.schema !== TRANSCRIPT_PERSISTENCE_CONTRACT_SCHEMA
  ) {
    throw new Error("persistenceContract must be a static transcript persistence contract.");
  }

  return {
    schema: TRANSCRIPT_REPLAY_CONTRACT_SCHEMA,
    schemaVersion: TRANSCRIPT_REPLAY_CONTRACT_VERSION,
    contractKind: "transcript-replay-contract",
    contractPhase: ARDYN_TRANSCRIPT_REPLAY_CONTRACT_PHASE,
    reviewedPhase: "4.1D",
    transcriptArtifact: persistenceContract.transcriptArtifact,
    sourceEventStreamReference: persistenceContract.sourceEventStreamReference,
    eventCount: persistenceContract.eventCount,
    sequenceRange: persistenceContract.sequenceRange,
    eventDigest: persistenceContract.eventDigest,
    persistedAt: persistenceContract.persistedAt,
    replayCompatibilityClassification: TRANSCRIPT_REPLAY_CONTRACT_ONLY,
    replaySafetyStatus: "replay-runtime-unavailable",
    replayCommand: {
      name: "replay-session-transcript",
      implemented: false,
      rejectedByCli: true
    },
    nonExecutionInvariantSummary: transcriptReplayInvariantSummary(),
    failureReasons: transcriptReplayFailureReasons(TRANSCRIPT_REPLAY_CONTRACT_ONLY),
    runtimeEffect: transcriptReplayRuntimeEffect(),
    audit: transcriptReplayAudit("codex-phase-4.1d")
  };
}

export function createTranscriptReplayCompatibilityRecordForReview(transcript, options = {}) {
  const persistenceContract = createTranscriptPersistenceContractForReview(transcript, options);
  const classification =
    options.replayCompatibilityClassification ??
    (persistenceContract.transcriptArtifact.transcriptVersion === SESSION_TRANSCRIPT_SCHEMA_VERSION
      ? TRANSCRIPT_REPLAY_COMPATIBLE
      : TRANSCRIPT_REPLAY_UPGRADE_AVAILABLE);
  const failClosed =
    classification !== TRANSCRIPT_REPLAY_COMPATIBLE &&
    classification !== TRANSCRIPT_REPLAY_UPGRADE_AVAILABLE;

  return {
    schema: TRANSCRIPT_REPLAY_COMPATIBILITY_RECORD_SCHEMA,
    schemaVersion: TRANSCRIPT_REPLAY_CONTRACT_VERSION,
    recordKind: "transcript-replay-compatibility-record",
    recordPhase: ARDYN_TRANSCRIPT_REPLAY_CONTRACT_PHASE,
    reviewedPhase: "4.1D",
    transcriptArtifact: persistenceContract.transcriptArtifact,
    sourceEventStreamReference: persistenceContract.sourceEventStreamReference,
    eventCount: persistenceContract.eventCount,
    sequenceRange: persistenceContract.sequenceRange,
    eventDigest: persistenceContract.eventDigest,
    eventIndex: persistenceContract.eventIndex,
    persistedAt: persistenceContract.persistedAt,
    replayCompatibilityClassification: classification,
    replaySafetyStatus: failClosed ? "fail-closed" : "static-compatible-review-only",
    nonExecutionInvariantSummary: transcriptReplayInvariantSummary(),
    failureReasons: transcriptReplayFailureReasons(classification, options.failureReasons),
    runtimeEffect: transcriptReplayRuntimeEffect(),
    audit: transcriptReplayAudit("codex-phase-4.1d")
  };
}

function transcriptReplayClassificationRecord(classification, fields = {}) {
  const failClosed = ![
    TRANSCRIPT_REPLAY_CONTRACT_ONLY,
    TRANSCRIPT_REPLAY_COMPATIBLE,
    TRANSCRIPT_REPLAY_UPGRADE_AVAILABLE
  ].includes(classification);

  return {
    schema: "ardyn.transcript-replay-compatibility-classification",
    schemaVersion: TRANSCRIPT_REPLAY_CONTRACT_VERSION,
    phase: ARDYN_TRANSCRIPT_REPLAY_CONTRACT_PHASE,
    classification,
    valid: fields.valid ?? !failClosed,
    failClosed,
    replayRuntimeAvailable: false,
    replayCommandAvailable: false,
    errors: fields.errors ?? [],
    failureReasons: transcriptReplayFailureReasons(classification, fields.failureReasons),
    reviewOnly: true,
    runtimeEffect: transcriptReplayRuntimeEffect()
  };
}

function runtimeEffectAttemptsTranscriptReplay(runtimeEffect) {
  if (!isPlainObjectRecord(runtimeEffect)) {
    return false;
  }

  return [
    "currentContractEnablesRuntime",
    "runtimeImplementationAvailable",
    "runtimeCommandAvailable",
    "replayCommandAvailable",
    "transcriptPersistenceRuntimeAvailable",
    "transcriptReplayRuntimeAvailable",
    "processStdioOwnershipAvailable",
    "stdinReaderAvailable",
    "stdoutWriterAvailable",
    "stderrWriterAvailable",
    "failureAuditRuntimeAvailable",
    "approvalEvaluatorAvailable",
    "writesFiles",
    "readsFiles"
  ].some((field) => runtimeEffect[field] === true);
}

function transcriptReplayRecordMalformedErrors(record) {
  const errors = [];

  if (!isPlainObjectRecord(record)) {
    return ["record must be an object"];
  }

  if (record.schema !== TRANSCRIPT_REPLAY_COMPATIBILITY_RECORD_SCHEMA) {
    errors.push(`schema must be ${TRANSCRIPT_REPLAY_COMPATIBILITY_RECORD_SCHEMA}`);
  }

  if (record.recordKind !== "transcript-replay-compatibility-record") {
    errors.push("recordKind must be transcript-replay-compatibility-record");
  }

  validateSemverMajor(errors, record.schemaVersion, "schemaVersion");

  if (!isPlainObjectRecord(record.transcriptArtifact)) {
    errors.push("transcriptArtifact must be an object");
  } else {
    if (record.transcriptArtifact.artifactKind !== "ardyn.session-transcript") {
      errors.push("transcriptArtifact.artifactKind must be ardyn.session-transcript");
    }
    validateSemverMajor(errors, record.transcriptArtifact.transcriptVersion, "transcriptVersion");
  }

  if (!Array.isArray(record.eventIndex) || record.eventIndex.length === 0) {
    errors.push("eventIndex must contain at least one event summary");
  }

  if (!Number.isInteger(record.eventCount) || record.eventCount < 1) {
    errors.push("eventCount must be a positive integer");
  } else if (Array.isArray(record.eventIndex) && record.eventCount !== record.eventIndex.length) {
    errors.push("eventCount must match eventIndex length");
  }

  if (!isPlainObjectRecord(record.sequenceRange)) {
    errors.push("sequenceRange must be an object");
  }

  if (
    !isPlainObjectRecord(record.eventDigest) ||
    record.eventDigest.algorithm !== "sha256" ||
    typeof record.eventDigest.value !== "string" ||
    !/^sha256:[0-9a-f]{64}$/.test(record.eventDigest.value)
  ) {
    errors.push("eventDigest must be a sha256 digest record");
  }

  if (!TRANSCRIPT_REPLAY_CLASSIFICATION_SET.has(record.replayCompatibilityClassification)) {
    errors.push("replayCompatibilityClassification must be supported");
  }

  return errors;
}

export function classifyTranscriptReplayCompatibilityForReview(record) {
  if (
    isPlainObjectRecord(record) &&
    record.schema === TRANSCRIPT_REPLAY_CONTRACT_SCHEMA &&
    record.contractKind === "transcript-replay-contract"
  ) {
    if (runtimeEffectAttemptsTranscriptReplay(record.runtimeEffect)) {
      return transcriptReplayClassificationRecord(TRANSCRIPT_REPLAY_RUNTIME_UNAVAILABLE, {
        valid: false,
        failureReasons: ["static replay contract attempted to enable replay runtime"]
      });
    }

    return transcriptReplayClassificationRecord(TRANSCRIPT_REPLAY_CONTRACT_ONLY);
  }

  const malformedErrors = transcriptReplayRecordMalformedErrors(record);
  if (malformedErrors.length > 0) {
    return transcriptReplayClassificationRecord(TRANSCRIPT_REPLAY_MALFORMED, {
      valid: false,
      errors: malformedErrors,
      failureReasons: malformedErrors
    });
  }

  const schemaMajor = semverMajor(record.schemaVersion);
  const transcriptMajor = semverMajor(record.transcriptArtifact.transcriptVersion);
  if (schemaMajor !== 0 || transcriptMajor !== 0) {
    return transcriptReplayClassificationRecord(TRANSCRIPT_REPLAY_UNSUPPORTED_MAJOR, {
      valid: false,
      failureReasons: ["record or transcript major version is unsupported"]
    });
  }

  if (runtimeEffectAttemptsTranscriptReplay(record.runtimeEffect)) {
    return transcriptReplayClassificationRecord(TRANSCRIPT_REPLAY_RUNTIME_UNAVAILABLE, {
      valid: false,
      failureReasons: ["record attempted to enable transcript persistence or replay runtime"]
    });
  }

  const sequences = record.eventIndex.map((event) => event.sequence);
  if (sequences.some((sequence) => !Number.isInteger(sequence))) {
    return transcriptReplayClassificationRecord(TRANSCRIPT_REPLAY_MALFORMED, {
      valid: false,
      failureReasons: ["eventIndex sequence values must be integers"]
    });
  }

  if (new Set(sequences).size !== sequences.length) {
    return transcriptReplayClassificationRecord(TRANSCRIPT_REPLAY_DUPLICATE_SEQUENCE, {
      valid: false,
      failureReasons: ["eventIndex contains duplicate sequence numbers"]
    });
  }

  for (let index = 1; index < sequences.length; index += 1) {
    if (sequences[index] < sequences[index - 1]) {
      return transcriptReplayClassificationRecord(TRANSCRIPT_REPLAY_OUT_OF_ORDER_SEQUENCE, {
        valid: false,
        failureReasons: ["eventIndex sequence numbers are out of order"]
      });
    }
  }

  for (let index = 0; index < sequences.length; index += 1) {
    if (sequences[index] !== index + 1) {
      return transcriptReplayClassificationRecord(TRANSCRIPT_REPLAY_SEQUENCE_GAP, {
        valid: false,
        failureReasons: ["eventIndex sequence numbers must be contiguous from 1"]
      });
    }
  }

  const expectedDigest = eventDigestRecord(record.eventIndex).value;
  if (record.eventDigest.value !== expectedDigest) {
    return transcriptReplayClassificationRecord(TRANSCRIPT_REPLAY_DIGEST_MISMATCH, {
      valid: false,
      failureReasons: ["eventDigest does not match the deterministic eventIndex digest"]
    });
  }

  if (record.transcriptArtifact.transcriptVersion !== SESSION_TRANSCRIPT_SCHEMA_VERSION) {
    return transcriptReplayClassificationRecord(TRANSCRIPT_REPLAY_UPGRADE_AVAILABLE);
  }

  return transcriptReplayClassificationRecord(TRANSCRIPT_REPLAY_COMPATIBLE);
}

export function formatTranscriptPersistenceContractJsonForReview(transcript, options = {}) {
  return `${JSON.stringify(createTranscriptPersistenceContractForReview(transcript, options), null, 2)}\n`;
}

export function formatTranscriptReplayContractJsonForReview(persistenceContract) {
  return `${JSON.stringify(createTranscriptReplayContractForReview(persistenceContract), null, 2)}\n`;
}

export function formatTranscriptReplayCompatibilityRecordJsonForReview(transcript, options = {}) {
  return `${JSON.stringify(createTranscriptReplayCompatibilityRecordForReview(transcript, options), null, 2)}\n`;
}

const FAILURE_AUDIT_CLASSIFICATIONS = Object.freeze([
  FAILURE_AUDIT_STATIC_CONTRACT_ONLY,
  FAILURE_AUDIT_CLEAN_FAILURE,
  FAILURE_AUDIT_REDACTED_FAILURE,
  FAILURE_AUDIT_UNREDACTABLE_FAILURE,
  FAILURE_AUDIT_TERMINAL_COMPLETED,
  FAILURE_AUDIT_TERMINAL_FAILED,
  FAILURE_AUDIT_TERMINAL_ABORTED,
  FAILURE_AUDIT_TERMINAL_REJECTED,
  FAILURE_AUDIT_NONZERO_EXIT_EXPECTED,
  FAILURE_AUDIT_NONZERO_EXIT_UNEXPECTED,
  FAILURE_AUDIT_CLEANUP_REQUIRED,
  FAILURE_AUDIT_CLEANUP_NOT_AVAILABLE,
  FAILURE_AUDIT_RUNTIME_UNAVAILABLE,
  FAILURE_AUDIT_MALFORMED,
  FAILURE_AUDIT_UNSUPPORTED_MAJOR
]);
const FAILURE_AUDIT_CLASSIFICATION_SET = new Set(FAILURE_AUDIT_CLASSIFICATIONS);
const FAILURE_AUDIT_FAIL_CLOSED_CLASSIFICATIONS = new Set([
  FAILURE_AUDIT_UNREDACTABLE_FAILURE,
  FAILURE_AUDIT_NONZERO_EXIT_UNEXPECTED,
  FAILURE_AUDIT_CLEANUP_NOT_AVAILABLE,
  FAILURE_AUDIT_RUNTIME_UNAVAILABLE,
  FAILURE_AUDIT_MALFORMED,
  FAILURE_AUDIT_UNSUPPORTED_MAJOR
]);
const STATIC_FAILURE_AUDIT_CREATED_AT = "1970-01-01T00:00:00.000Z";

function failureAuditRuntimeAvailability() {
  return {
    currentContractEnablesRuntime: false,
    runtimeImplementationAvailable: false,
    runtimeCommandAvailable: false,
    failureAuditCommandAvailable: false,
    failureAuditRuntimeAvailable: false,
    cleanupRuntimeAvailable: false,
    processKillAvailable: false,
    processControlAvailable: false,
    signalHandlerAvailable: false,
    signalHandlingRuntimeAvailable: false,
    exitHandlerAvailable: false,
    exitMappingRuntimeAvailable: false,
    timeoutRuntimeAvailable: false,
    processStdioOwnershipAvailable: false,
    stdinReaderAvailable: false,
    stdoutWriterAvailable: false,
    stderrWriterAvailable: false,
    transcriptPersistenceRuntimeAvailable: false,
    transcriptReplayRuntimeAvailable: false,
    approvalEvaluatorAvailable: false,
    listenerAvailable: false,
    serverAvailable: false,
    subprocessSpawningAvailable: false,
    writesFiles: false,
    readsFiles: false,
    runsRuntime: false,
    consumedByLiveHostLoop: false,
    grantsRuntimeApproval: false
  };
}

function failureAuditInvariantSummary() {
  return [...HOST_POLICY_REVIEW_REQUIRED_INVARIANTS].sort(compareAscii);
}

function failureAuditRecordAudit(createdBy) {
  return {
    createdAt: STATIC_FAILURE_AUDIT_CREATED_AT,
    createdBy,
    reviewer: "Codex",
    devinReviewRequiredNow: false,
    preserveDevinReviewFor: "major-runtime-readiness-checkpoint",
    metadataOnly: true,
    writesFiles: false,
    runsRuntime: false
  };
}

function failureAuditTerminalState(classification) {
  if (classification === FAILURE_AUDIT_TERMINAL_COMPLETED) {
    return "completed";
  }

  if (
    classification === FAILURE_AUDIT_TERMINAL_ABORTED ||
    classification === FAILURE_AUDIT_CLEANUP_REQUIRED ||
    classification === FAILURE_AUDIT_CLEANUP_NOT_AVAILABLE
  ) {
    return "aborted";
  }

  if (classification === FAILURE_AUDIT_TERMINAL_REJECTED) {
    return "rejected";
  }

  if (classification === FAILURE_AUDIT_STATIC_CONTRACT_ONLY) {
    return "not-run";
  }

  return "failed";
}

function failureAuditExitCodeClassification(classification) {
  if (classification === FAILURE_AUDIT_TERMINAL_COMPLETED) {
    return "zero_exit";
  }

  if (
    classification === FAILURE_AUDIT_NONZERO_EXIT_UNEXPECTED ||
    classification === FAILURE_AUDIT_UNREDACTABLE_FAILURE ||
    classification === FAILURE_AUDIT_CLEANUP_NOT_AVAILABLE
  ) {
    return FAILURE_AUDIT_NONZERO_EXIT_UNEXPECTED;
  }

  if (classification === FAILURE_AUDIT_STATIC_CONTRACT_ONLY) {
    return "not-applicable";
  }

  return FAILURE_AUDIT_NONZERO_EXIT_EXPECTED;
}

function failureAuditFailureCategory(classification) {
  if (classification === FAILURE_AUDIT_TERMINAL_COMPLETED) {
    return "terminal-success";
  }

  if (
    classification === FAILURE_AUDIT_TERMINAL_ABORTED ||
    classification === FAILURE_AUDIT_TERMINAL_REJECTED
  ) {
    return "terminal-state";
  }

  if (
    classification === FAILURE_AUDIT_CLEANUP_REQUIRED ||
    classification === FAILURE_AUDIT_CLEANUP_NOT_AVAILABLE
  ) {
    return "cleanup-policy";
  }

  if (
    classification === FAILURE_AUDIT_NONZERO_EXIT_EXPECTED ||
    classification === FAILURE_AUDIT_NONZERO_EXIT_UNEXPECTED
  ) {
    return "exit-code";
  }

  if (
    classification === FAILURE_AUDIT_UNREDACTABLE_FAILURE ||
    classification === FAILURE_AUDIT_REDACTED_FAILURE ||
    classification === FAILURE_AUDIT_CLEAN_FAILURE
  ) {
    return "stderr-diagnostic";
  }

  if (classification === FAILURE_AUDIT_STATIC_CONTRACT_ONLY) {
    return "contract-definition";
  }

  return "invalid-record";
}

function failureAuditDiagnostic(classification, diagnostic) {
  if (diagnostic) {
    return diagnostic;
  }

  if (classification === FAILURE_AUDIT_REDACTED_FAILURE) {
    return {
      code: "failure.audit.redacted",
      message: "Runtime failed with bearer token sk-live-redacted-example in diagnostic."
    };
  }

  if (classification === FAILURE_AUDIT_UNREDACTABLE_FAILURE) {
    return {
      code: "failure.audit.unredactable",
      message: "Runtime failed before redaction\nraw diagnostic continued"
    };
  }

  return {
    code: "failure.audit.static",
    message: "Static failure audit contract fixture."
  };
}

function failureAuditStderrDiagnosticClassification(classification, redactionReview) {
  if (classification === FAILURE_AUDIT_UNREDACTABLE_FAILURE) {
    return FAILURE_AUDIT_UNREDACTABLE_FAILURE;
  }

  if (
    redactionReview.classification === STDERR_REDACTION_SAFE &&
    Array.isArray(redactionReview.redactions) &&
    redactionReview.redactions.length > 0
  ) {
    return FAILURE_AUDIT_REDACTED_FAILURE;
  }

  if (redactionReview.classification !== STDERR_REDACTION_SAFE) {
    return FAILURE_AUDIT_UNREDACTABLE_FAILURE;
  }

  return FAILURE_AUDIT_CLEAN_FAILURE;
}

function failureAuditCleanupRequirement(classification, fields = {}) {
  const cleanupRequired =
    fields.required ?? classification === FAILURE_AUDIT_CLEANUP_REQUIRED;

  return {
    required: cleanupRequired,
    reason:
      fields.reason ??
      (cleanupRequired
        ? "future runtime cleanup would be required by policy"
        : "no cleanup required for this static fixture"),
    policyOnly: true,
    cleanupRuntimeAvailable: false,
    processKillAvailable: false,
    processControlAvailable: false,
    signalHandlerAvailable: false,
    signalHandlingRuntimeAvailable: false,
    exitHandlerAvailable: false,
    timeoutRuntimeAvailable: false
  };
}

function failureAuditKillInterruptTimeoutSemantics(fields = {}) {
  return {
    policyOnly: true,
    killRuntimeAvailable: false,
    interruptRuntimeAvailable: false,
    timeoutRuntimeAvailable: false,
    signalHandlingRuntimeAvailable: false,
    processControlAvailable: false,
    killMaySynthesizeTerminalEvent: false,
    partialOutputMayBecomeTranscriptEvidence: false,
    failClosedOnUnsafeCleanup: true,
    expectedPolicy:
      fields.expectedPolicy ??
      "future Rust-host runtime must fail closed on kill, interrupt, timeout, or cleanup uncertainty"
  };
}

function failureAuditTranscriptImpact() {
  return {
    policyOnly: true,
    transcriptPersistenceRuntimeAvailable: false,
    transcriptReplayRuntimeAvailable: false,
    partialTranscriptMayBePersisted: false,
    replayPermitted: false,
    normalizedTranscriptRequiredBeforeReplay: true
  };
}

function failureAuditTerminalStateRules() {
  return {
    deterministic: true,
    terminalCompletedRequiresSessionCompletedLast: true,
    terminalFailedMayUseSessionError: true,
    terminalAbortedRequiresFutureHostPolicyEvidence: true,
    terminalRejectedRequiresHostPolicyDenial: true,
    missingTerminalEventFailsClosed: true,
    terminalEventNotLastFailsClosed: true,
    duplicateTerminalEventFailsClosed: true,
    synthesizedTerminalEventsAllowed: false,
    partialOutputMayBecomeTranscriptEvidence: false
  };
}

function failureAuditStdoutCommitBoundary(classification, terminalState, options = {}) {
  return {
    policyOnly: true,
    committedEventCount: options.committedEventCount ?? 0,
    committedSequenceRange: options.committedSequenceRange ?? { first: null, last: null },
    terminalEventObserved:
      options.terminalEventObserved ?? ["completed", "failed", "aborted", "rejected"].includes(terminalState),
    stdoutEndedWithFinalLf:
      options.stdoutEndedWithFinalLf ?? classification === FAILURE_AUDIT_TERMINAL_COMPLETED,
    partialFinalLineObserved: options.partialFinalLineObserved ?? false,
    partialOutputMayBecomeTranscriptEvidence: false,
    synthesizedTerminalEventAllowed: false
  };
}

function failureAuditNonzeroExitMappingRules() {
  return {
    deterministic: true,
    osSignalBehaviorEvaluated: false,
    exitZeroRequiresTerminalCompleted: true,
    sessionErrorMapsToNonzero: true,
    missingTerminalEventMapsToNonzero: true,
    redactionFailureMapsToNonzero: true,
    cleanupFailureMapsToNonzero: true,
    unexpectedNonzeroFailsClosed: true
  };
}

function failureAuditFailureReasons(classification, reasons = []) {
  if (classification === FAILURE_AUDIT_STATIC_CONTRACT_ONLY) {
    return [...reasons, "failure-audit contract metadata is review-only in Phase 4.1E"];
  }

  if (classification === FAILURE_AUDIT_UNREDACTABLE_FAILURE) {
    return [...reasons, "stderr diagnostic cannot be safely redacted and must fail closed"];
  }

  if (classification === FAILURE_AUDIT_NONZERO_EXIT_UNEXPECTED) {
    return [...reasons, "nonzero exit code was not expected by the static mapping"];
  }

  if (classification === FAILURE_AUDIT_CLEANUP_NOT_AVAILABLE) {
    return [...reasons, "cleanup is required but no cleanup runtime exists in Phase 4.1E"];
  }

  if (classification === FAILURE_AUDIT_RUNTIME_UNAVAILABLE) {
    return [...reasons, "record attempted to enable runtime cleanup, kill, or failure audit behavior"];
  }

  if (classification === FAILURE_AUDIT_MALFORMED) {
    return [...reasons, "failure-audit record is malformed"];
  }

  if (classification === FAILURE_AUDIT_UNSUPPORTED_MAJOR) {
    return [...reasons, "failure-audit record major version is unsupported"];
  }

  return [...reasons];
}

export function createFailureAuditRecordForReview(options = {}) {
  const classification = options.classification ?? FAILURE_AUDIT_STATIC_CONTRACT_ONLY;
  const diagnostic = failureAuditDiagnostic(classification, options.diagnostic);
  const redactionReview = redactStderrDiagnosticForReview(diagnostic);
  const stderrDiagnosticClassification =
    options.stderrDiagnosticClassification ??
    failureAuditStderrDiagnosticClassification(classification, redactionReview);
  const exitCodeClassification =
    options.exitCodeClassification ?? failureAuditExitCodeClassification(classification);
  const terminalState = options.terminalState ?? failureAuditTerminalState(classification);

  return {
    schema: FAILURE_AUDIT_RECORD_SCHEMA,
    schemaVersion: options.schemaVersion ?? FAILURE_AUDIT_CONTRACT_VERSION,
    recordKind: "failure-audit-record",
    recordPhase: ARDYN_FAILURE_AUDIT_CONTRACT_PHASE,
    reviewedPhase: "4.1E",
    sourcePhase: options.sourcePhase ?? ARDYN_TRANSCRIPT_REPLAY_CONTRACT_PHASE,
    classification,
    failureCategory: options.failureCategory ?? failureAuditFailureCategory(classification),
    terminalState,
    exitCodeClassification,
    exitCodeMapping: {
      code: options.exitCode ?? (exitCodeClassification === "zero_exit" ? 0 : 1),
      classification: exitCodeClassification,
      deterministic: true,
      policyOnly: true
    },
    terminalStateRules: failureAuditTerminalStateRules(),
    stdoutCommitBoundary: failureAuditStdoutCommitBoundary(
      classification,
      terminalState,
      options.stdoutCommitBoundary
    ),
    nonzeroExitMappingRules: failureAuditNonzeroExitMappingRules(),
    stderrDiagnosticClassification,
    stderrDiagnostic: {
      code: diagnostic.code,
      message: redactionReview.diagnostic.message
    },
    redactionStatus: redactionReview.classification,
    redactions: redactionReview.redactions,
    cleanupRequirement: failureAuditCleanupRequirement(classification, options.cleanupRequirement),
    killInterruptTimeoutSemantics: failureAuditKillInterruptTimeoutSemantics(
      options.killInterruptTimeoutSemantics
    ),
    transcriptPersistenceReplayImpact: failureAuditTranscriptImpact(),
    runtimeAvailabilityStatus: FAILURE_AUDIT_RUNTIME_UNAVAILABLE,
    runtimeEffect: failureAuditRuntimeAvailability(),
    nonExecutionInvariantSummary: failureAuditInvariantSummary(),
    failClosed: FAILURE_AUDIT_FAIL_CLOSED_CLASSIFICATIONS.has(classification),
    failureReasons: failureAuditFailureReasons(classification, options.failureReasons),
    recordDigest: eventDigestRecord({
      classification,
      terminalState,
      exitCodeClassification,
      stderrDiagnosticClassification,
      redactionStatus: redactionReview.classification
    }),
    audit: failureAuditRecordAudit("codex-phase-4.1e")
  };
}

function failureAuditClassificationRecord(classification, fields = {}) {
  const failClosed = FAILURE_AUDIT_FAIL_CLOSED_CLASSIFICATIONS.has(classification);

  return {
    schema: "ardyn.failure-audit-classification",
    schemaVersion: FAILURE_AUDIT_CONTRACT_VERSION,
    phase: ARDYN_FAILURE_AUDIT_CONTRACT_PHASE,
    classification,
    valid: fields.valid ?? !failClosed,
    failClosed,
    failureAuditRuntimeAvailable: false,
    cleanupRuntimeAvailable: false,
    processKillAvailable: false,
    processControlAvailable: false,
    runtimeCommandAvailable: false,
    errors: fields.errors ?? [],
    failureReasons: failureAuditFailureReasons(classification, fields.failureReasons),
    reviewOnly: true,
    runtimeEffect: failureAuditRuntimeAvailability()
  };
}

function runtimeEffectAttemptsFailureAuditRuntime(runtimeEffect) {
  if (!isPlainObjectRecord(runtimeEffect)) {
    return false;
  }

  return [
    "currentContractEnablesRuntime",
    "runtimeImplementationAvailable",
    "runtimeCommandAvailable",
    "failureAuditCommandAvailable",
    "failureAuditRuntimeAvailable",
    "cleanupRuntimeAvailable",
    "processKillAvailable",
    "processControlAvailable",
    "signalHandlerAvailable",
    "signalHandlingRuntimeAvailable",
    "exitHandlerAvailable",
    "exitMappingRuntimeAvailable",
    "timeoutRuntimeAvailable",
    "processStdioOwnershipAvailable",
    "stdinReaderAvailable",
    "stdoutWriterAvailable",
    "stderrWriterAvailable",
    "transcriptPersistenceRuntimeAvailable",
    "transcriptReplayRuntimeAvailable",
    "approvalEvaluatorAvailable",
    "listenerAvailable",
    "serverAvailable",
    "subprocessSpawningAvailable",
    "writesFiles",
    "readsFiles",
    "runsRuntime",
    "consumedByLiveHostLoop",
    "grantsRuntimeApproval"
  ].some((field) => runtimeEffect[field] === true);
}

function cleanupOrKillAttemptsRuntime(record) {
  const cleanup = record?.cleanupRequirement;
  const kill = record?.killInterruptTimeoutSemantics;

  return [
    cleanup?.cleanupRuntimeAvailable,
    cleanup?.processKillAvailable,
    cleanup?.processControlAvailable,
    cleanup?.signalHandlerAvailable,
    cleanup?.signalHandlingRuntimeAvailable,
    cleanup?.exitHandlerAvailable,
    cleanup?.timeoutRuntimeAvailable,
    kill?.killRuntimeAvailable,
    kill?.interruptRuntimeAvailable,
    kill?.timeoutRuntimeAvailable,
    kill?.signalHandlingRuntimeAvailable,
    kill?.processControlAvailable,
    kill?.killMaySynthesizeTerminalEvent,
    kill?.partialOutputMayBecomeTranscriptEvidence
  ].some((value) => value === true);
}

function failureAuditRecordMalformedErrors(record) {
  const errors = [];

  if (!isPlainObjectRecord(record)) {
    return ["record must be an object"];
  }

  if (record.schema !== FAILURE_AUDIT_RECORD_SCHEMA) {
    errors.push(`schema must be ${FAILURE_AUDIT_RECORD_SCHEMA}`);
  }

  if (record.recordKind !== "failure-audit-record") {
    errors.push("recordKind must be failure-audit-record");
  }

  validateSemverMajor(errors, record.schemaVersion, "schemaVersion");

  if (!FAILURE_AUDIT_CLASSIFICATION_SET.has(record.classification)) {
    errors.push("classification must be supported");
  }

  for (const [field, value] of [
    ["sourcePhase", record.sourcePhase],
    ["failureCategory", record.failureCategory],
    ["terminalState", record.terminalState],
    ["exitCodeClassification", record.exitCodeClassification],
    ["stderrDiagnosticClassification", record.stderrDiagnosticClassification],
    ["redactionStatus", record.redactionStatus],
    ["runtimeAvailabilityStatus", record.runtimeAvailabilityStatus]
  ]) {
    if (typeof value !== "string" || value.length === 0) {
      errors.push(`${field} must be a non-empty string`);
    }
  }

  if (
    !isPlainObjectRecord(record.exitCodeMapping) ||
    !Number.isInteger(record.exitCodeMapping.code) ||
    record.exitCodeMapping.deterministic !== true ||
    record.exitCodeMapping.policyOnly !== true
  ) {
    errors.push("exitCodeMapping must be deterministic policy-only metadata");
  }

  if (!isPlainObjectRecord(record.stderrDiagnostic)) {
    errors.push("stderrDiagnostic must be an object");
  }

  if (!isPlainObjectRecord(record.cleanupRequirement)) {
    errors.push("cleanupRequirement must be an object");
  }

  if (!isPlainObjectRecord(record.killInterruptTimeoutSemantics)) {
    errors.push("killInterruptTimeoutSemantics must be an object");
  }

  if (!isPlainObjectRecord(record.transcriptPersistenceReplayImpact)) {
    errors.push("transcriptPersistenceReplayImpact must be an object");
  }

  if (!isPlainObjectRecord(record.runtimeEffect)) {
    errors.push("runtimeEffect must be an object");
  }

  return errors;
}

export function classifyFailureAuditRecordForReview(record) {
  const malformedErrors = failureAuditRecordMalformedErrors(record);
  if (malformedErrors.length > 0) {
    return failureAuditClassificationRecord(FAILURE_AUDIT_MALFORMED, {
      valid: false,
      errors: malformedErrors,
      failureReasons: malformedErrors
    });
  }

  if (semverMajor(record.schemaVersion) !== 0) {
    return failureAuditClassificationRecord(FAILURE_AUDIT_UNSUPPORTED_MAJOR, {
      valid: false,
      failureReasons: ["failure-audit record major version is unsupported"]
    });
  }

  if (
    runtimeEffectAttemptsFailureAuditRuntime(record.runtimeEffect) ||
    cleanupOrKillAttemptsRuntime(record)
  ) {
    return failureAuditClassificationRecord(FAILURE_AUDIT_RUNTIME_UNAVAILABLE, {
      valid: false,
      failureReasons: ["record attempted to enable cleanup, kill, process control, or runtime"]
    });
  }

  if (
    record.redactionStatus === STDERR_REDACTION_UNREDACTABLE_FAIL_CLOSED ||
    record.classification === FAILURE_AUDIT_UNREDACTABLE_FAILURE
  ) {
    return failureAuditClassificationRecord(FAILURE_AUDIT_UNREDACTABLE_FAILURE, {
      valid: false,
      failureReasons: ["stderr diagnostic cannot be safely redacted"]
    });
  }

  if (record.classification === FAILURE_AUDIT_NONZERO_EXIT_UNEXPECTED) {
    return failureAuditClassificationRecord(FAILURE_AUDIT_NONZERO_EXIT_UNEXPECTED, {
      valid: false,
      failureReasons: ["unexpected nonzero exit code must fail closed"]
    });
  }

  if (record.classification === FAILURE_AUDIT_CLEANUP_NOT_AVAILABLE) {
    return failureAuditClassificationRecord(FAILURE_AUDIT_CLEANUP_NOT_AVAILABLE, {
      valid: false,
      failureReasons: ["cleanup requirement cannot be satisfied because runtime cleanup is unavailable"]
    });
  }

  return failureAuditClassificationRecord(record.classification);
}

export function formatFailureAuditRecordJsonForReview(options = {}) {
  return `${JSON.stringify(createFailureAuditRecordForReview(options), null, 2)}\n`;
}

function reviewOnlyInspectionHandoffMetadataBoundaryPathValue(record, path) {
  return path.reduce(
    (current, key) =>
      isPlainObjectRecord(current) &&
      Object.prototype.hasOwnProperty.call(current, key)
        ? current[key]
        : undefined,
    record
  );
}















































































































const AUTH_PERMISSIONS_CONTRACT_BOUNDARY_MAP_STATE_SCHEMA =
  "ardyn.phase-5.62.auth-permissions-contract-boundary-map-state";
const VALID_AUTH_PERMISSIONS_CONTRACT_BOUNDARY_MAP_CLASSIFICATION =
  "valid_auth_permissions_contract_boundary_map_runtime_still_blocked";
const MALFORMED_AUTH_PERMISSIONS_CONTRACT_BOUNDARY_MAP_CLASSIFICATION =
  "malformed_auth_permissions_contract_boundary_map_input_rejected";

const AUTH_PERMISSIONS_CONTRACT_BOUNDARY_FAMILIES = Object.freeze([
  "identity_contract",
  "authentication_contract",
  "authorization_contract",
  "permission_contract",
  "role_contract",
  "operator_consent_contract",
  "approval_prerequisite_contract",
  "runtime_authorization_boundary",
  "connector_grant_boundary",
  "secret_access_boundary",
  "delegation_boundary",
  "revocation_boundary",
  "audit_subject_boundary"
]);
const AUTH_PERMISSIONS_CONTRACT_BOUNDARY_RELATED_SYSTEMS = Object.freeze([
  "ardyn",
  "ardyn-subagent",
  "locus",
  "multiverse",
  "content-fabric",
  "repo-family"
]);
const AUTH_PERMISSIONS_CONTRACT_BOUNDARY_STATUSES = Object.freeze([
  "metadata_only",
  "blocked",
  "future_contract_required"
]);
const AUTH_PERMISSIONS_CONTRACT_BOUNDARY_REQUIRED_FIELDS = Object.freeze([
  "boundaryId",
  "boundaryFamily",
  "relatedSystem",
  "currentStatus",
  "allowedCurrentBehavior",
  "forbiddenCurrentBehavior",
  "requiredFutureContractBeforeImplementation",
  "requiredFutureAuthorizationPhaseBeforeRuntime",
  "identitySubjectNotes",
  "rolePermissionExpectation",
  "consentApprovalExpectation",
  "revocationExpectation",
  "auditSubjectExpectation",
  "locusRoleDescription",
  "multiverseRoleDescription",
  "fabricRoleDescription",
  "secureDropRoleDescription",
  "explicitBlockedAuthorizationFlags",
  "unsafeAuthPermissionsRuntimeFlags",
  "nonAuthorizingProof"
]);
const AUTH_PERMISSIONS_CONTRACT_BOUNDARY_ALLOWED_TOP_LEVEL_FIELDS =
  Object.freeze(["reviewedAt", "boundaryEntries"]);
const AUTH_PERMISSIONS_CONTRACT_BOUNDARY_UNSAFE_FIELDS = Object.freeze([
  "identityProviderImplemented",
  "identityProviderRuntimeEnabled",
  "authenticationRuntimeImplemented",
  "loginFlowImplemented",
  "sessionRuntimeImplemented",
  "tokenIssuerImplemented",
  "apiKeyIssuerImplemented",
  "roleEngineImplemented",
  "permissionEvaluatorImplemented",
  "authorizationEvaluatorImplemented",
  "grantProducerImplemented",
  "approvalDecisionProduced",
  "approvalGrantProduced",
  "operatorConsentRuntimeImplemented",
  "secretVaultEnvAccessEnabled",
  "secretRuntimeIngestionEnabled",
  "connectorGrantProduced",
  "connectorGrantRuntimeImplemented",
  "delegationEngineImplemented",
  "revocationEngineImplemented",
  "runtimeAuthorizationEnabled",
  "runtimeAuthorizationEnforcementImplemented",
  "policyEnforcementRuntimeImplemented",
  "externalIdentityProviderIntegrated",
  "keyringImplemented",
  "didImplemented",
  "keyringDidImplemented",
  "secureDropImplemented",
  "secureDropCryptoImplemented",
  "secureDropTransportImplemented",
  "secureDropStegoImplemented",
  "secureDropSendReceiveImplemented",
  "secureDropInboxPollingEnabled",
  "st3ggVendored",
  "databaseClientImplemented",
  "databaseSchemaImplemented",
  "databaseMigrationImplemented",
  "rlsPolicyImplemented",
  "storageAdapterImplemented",
  "cacheEngineImplemented",
  "cacheInvalidationRuntimeImplemented",
  "transcriptWriterImplemented",
  "auditWriterImplemented",
  "filesystemWriteEnabled",
  "importExportPathImplementedByArdyn",
  "packageDistributionImplementedByArdyn",
  "persistenceImplementedByArdyn",
  "backendRuntimeImplementedByArdyn",
  "apiEndpointImplementedByArdyn",
  "serverImplementedByArdyn",
  "websocketHttpTransportImplementedByArdyn",
  "fabricRuntimeImplementedByArdyn",
  "encodedHandoffRuntimeImplementedByArdyn",
  "codecImplemented",
  "translatorRuntimeImplemented",
  "mcpToolExposureEnabled",
  "taskExecutionEnabled",
  "serviceDiscoveryEnabled",
  "scheduleEnforcementEnabled",
  "backgroundPollingEnabled",
  "filesystemScanningEnabled",
  "processControlEnabled",
  "uiFrontendBrowserRenderingImplemented",
  "commandExposureEnabled",
  "commandRuntimeControlEnabled",
  "runtimeExecutionEnabled",
  "databaseStorageRuntimeWritesEnabled",
  "reportRunsChecks",
  "blockedCliBypassEnabled"
]);
const AUTH_PERMISSIONS_CONTRACT_BOUNDARY_AUTHORIZATION_FIELDS = Object.freeze([
  "runtimeAuthorized",
  "runtimeAuthorizationGranted",
  "authRuntimeAuthorizationGranted",
  "identityAuthorizationGranted",
  "authenticationAuthorizationGranted",
  "authorizationEvaluatorGranted",
  "permissionEvaluatorAuthorized",
  "roleEngineAuthorized",
  "grantAuthorizationGranted",
  "secretAccessAuthorizationGranted",
  "connectorGrantAuthorizationGranted",
  "delegationAuthorizationGranted",
  "revocationAuthorizationGranted",
  "secureDropAuthorizationGranted",
  "approvalDecisionProduced",
  "approvalGrantProduced",
  "authorizesRuntime"
]);
const AUTH_PERMISSIONS_CONTRACT_BOUNDARY_COMMAND_FIELDS = Object.freeze([
  "commandExposureEnabled",
  "commandRuntimeControlEnabled",
  "commandsExposed",
  "exposesCommands",
  "runtimeCommandEnabled",
  "cliCommandExposed"
]);
const AUTH_PERMISSIONS_CONTRACT_BOUNDARY_BLOCKED_CLI_BYPASS_FIELDS =
  Object.freeze([
    "blockedCliBypassEnabled",
    "dryRunBypassesBlock",
    "serveRuntimeBypassEnabled",
    "bypassBlockedCommandBehavior",
    "blockedCommandOverride"
  ]);
const AUTH_PERMISSIONS_CONTRACT_BOUNDARY_LOGIN_SESSION_TOKEN_FIELDS =
  Object.freeze([
    "loginUrl",
    "loginFlow",
    "loginHandler",
    "sessionCookie",
    "sessionStore",
    "sessionToken",
    "tokenIssuer",
    "accessToken",
    "refreshToken",
    "idToken",
    "apiKey",
    "apiKeySecret",
    "apiKeyIssuer",
    "bearerToken"
  ]);
const AUTH_PERMISSIONS_CONTRACT_BOUNDARY_PERMISSION_EVALUATOR_FIELDS =
  Object.freeze([
    "permissionEvaluator",
    "permissionEngine",
    "evaluatePermission",
    "roleEngine",
    "policyEngine",
    "policyEvaluator",
    "rbacEngine",
    "abacEngine",
    "permissionDecision"
  ]);
const AUTH_PERMISSIONS_CONTRACT_BOUNDARY_APPROVAL_GRANT_FIELDS =
  Object.freeze([
    "approvalDecision",
    "approvalGrant",
    "approvalGrantToken",
    "grantRuntime",
    "grantProducer",
    "runtimeGrant",
    "decisionEvaluator",
    "evaluatorResult"
  ]);
const AUTH_PERMISSIONS_CONTRACT_BOUNDARY_CONNECTOR_GRANT_FIELDS =
  Object.freeze([
    "connectorGrant",
    "connectorGrantToken",
    "connectorCredential",
    "connectorAccessToken",
    "connectorIngestionGrant"
  ]);
const AUTH_PERMISSIONS_CONTRACT_BOUNDARY_RUNTIME_AUTH_FIELDS = Object.freeze([
  "runtimeAuthorizationGrant",
  "runtimeAuthorizationToken",
  "runtimeAuthorizationHeader",
  "authorizationHeader",
  "authorizationMiddleware",
  "authzRuntime",
  "enforceRuntimeAuthorization"
]);
const AUTH_PERMISSIONS_CONTRACT_BOUNDARY_SECRET_FIELDS = Object.freeze([
  "secretVaultPath",
  "envSecretName",
  "vaultClient",
  "secretProvider",
  "secretManager",
  "dotenvPath",
  "envFilePath",
  "apiSecret",
  "privateKeyPath"
]);
const AUTH_PERMISSIONS_CONTRACT_BOUNDARY_EXTERNAL_IDP_FIELDS = Object.freeze([
  "identityProviderUrl",
  "oidcIssuer",
  "samlMetadata",
  "oauthClientId",
  "oauthClientSecret",
  "idpClient",
  "openidConfiguration",
  "jwksUri"
]);
const AUTH_PERMISSIONS_CONTRACT_BOUNDARY_KEYRING_DID_SECURE_DROP_FIELDS =
  Object.freeze([
    "keyringPath",
    "keyringProvider",
    "didDocument",
    "didResolver",
    "recipientKey",
    "secureDropPayloadPath",
    "secureDropKeyring",
    "secureDropDid",
    "secureDropCryptoImplemented",
    "secureDropTransportImplemented",
    "secureDropSendReceiveImplemented"
  ]);
const AUTH_PERMISSIONS_CONTRACT_BOUNDARY_DATABASE_STORAGE_FIELDS =
  Object.freeze([
    "databaseUrl",
    "databaseDsn",
    "dbConnectionString",
    "rlsPolicy",
    "rlsRule",
    "storageAdapter",
    "persistenceLayer",
    "migrationCommand",
    "schemaMigration",
    "auditWriter",
    "transcriptWriter"
  ]);
const AUTH_PERMISSIONS_CONTRACT_BOUNDARY_FABRIC_RUNTIME_FIELDS =
  Object.freeze([
    "fabricBusTopic",
    "fabricBrokerUrl",
    "websocketUrl",
    "httpEndpoint",
    "mcpToolName",
    "mcpServerUrl",
    "taskExecutor",
    "taskRunner",
    "runtimeEndpoint",
    "adapterRuntime"
  ]);

function authPermissionsContractBoundaryMapInputRecord(input) {
  return isPlainObjectRecord(input) ? input : null;
}

function authPermissionsContractBoundaryMapReviewedAt(inputRecord) {
  if (
    inputRecord === null ||
    !Object.prototype.hasOwnProperty.call(inputRecord, "reviewedAt")
  ) {
    return APPROVAL_PREREQUISITE_SOURCE_PREFLIGHT_DEFAULT_REVIEWED_AT;
  }

  return isUtcIsoTimestampWithMilliseconds(inputRecord.reviewedAt)
    ? inputRecord.reviewedAt
    : APPROVAL_PREREQUISITE_SOURCE_PREFLIGHT_DEFAULT_REVIEWED_AT;
}

function authPermissionsContractBoundaryMapInputMalformed(inputRecord) {
  return (
    inputRecord === null ||
    (Object.prototype.hasOwnProperty.call(inputRecord, "reviewedAt") &&
      !isUtcIsoTimestampWithMilliseconds(inputRecord.reviewedAt)) ||
    (Object.prototype.hasOwnProperty.call(inputRecord, "boundaryEntries") &&
      !Array.isArray(inputRecord.boundaryEntries))
  );
}

function authPermissionsContractBoundaryMapInputEntries(inputRecord) {
  return Array.isArray(inputRecord?.boundaryEntries)
    ? inputRecord.boundaryEntries
    : null;
}

function authPermissionsContractBoundaryMapContainsTrue(value) {
  if (value === true) {
    return true;
  }

  if (Array.isArray(value)) {
    return value.some(authPermissionsContractBoundaryMapContainsTrue);
  }

  if (isPlainObjectRecord(value)) {
    return Object.values(value).some(
      authPermissionsContractBoundaryMapContainsTrue
    );
  }

  return false;
}

function authPermissionsContractBoundaryMapHasTrueFieldDeep(value, fields) {
  if (Array.isArray(value)) {
    return value.some((item) =>
      authPermissionsContractBoundaryMapHasTrueFieldDeep(item, fields)
    );
  }

  if (!isPlainObjectRecord(value)) {
    return false;
  }

  for (const [key, nested] of Object.entries(value)) {
    if (fields.includes(key) && nested === true) {
      return true;
    }

    if (authPermissionsContractBoundaryMapHasTrueFieldDeep(nested, fields)) {
      return true;
    }
  }

  return false;
}

function authPermissionsContractBoundaryMapHasPresentFieldDeep(value, fields) {
  if (Array.isArray(value)) {
    return value.some((item) =>
      authPermissionsContractBoundaryMapHasPresentFieldDeep(item, fields)
    );
  }

  if (!isPlainObjectRecord(value)) {
    return false;
  }

  for (const [key, nested] of Object.entries(value)) {
    if (
      key === "explicitBlockedAuthorizationFlags" ||
      key === "unsafeAuthPermissionsRuntimeFlags"
    ) {
      continue;
    }

    if (fields.includes(key)) {
      return true;
    }

    if (authPermissionsContractBoundaryMapHasPresentFieldDeep(nested, fields)) {
      return true;
    }
  }

  return false;
}

function authPermissionsContractBoundaryMapContainsEntryIssue(
  entries,
  predicate
) {
  return entries !== null && entries.some((entry) => predicate(entry));
}

function authPermissionsContractBoundaryMapMissingRequiredField(entry) {
  if (!isPlainObjectRecord(entry)) {
    return true;
  }

  return AUTH_PERMISSIONS_CONTRACT_BOUNDARY_REQUIRED_FIELDS.some(
    (field) => !Object.prototype.hasOwnProperty.call(entry, field)
  );
}

function authPermissionsContractBoundaryMapEntryMalformed(entry) {
  if (!isPlainObjectRecord(entry)) {
    return true;
  }

  return (
    typeof entry.boundaryId !== "string" ||
    !Array.isArray(entry.allowedCurrentBehavior) ||
    !Array.isArray(entry.forbiddenCurrentBehavior) ||
    typeof entry.requiredFutureContractBeforeImplementation !== "string" ||
    typeof entry.requiredFutureAuthorizationPhaseBeforeRuntime !== "string" ||
    typeof entry.identitySubjectNotes !== "string" ||
    typeof entry.rolePermissionExpectation !== "string" ||
    typeof entry.consentApprovalExpectation !== "string" ||
    typeof entry.revocationExpectation !== "string" ||
    typeof entry.auditSubjectExpectation !== "string" ||
    typeof entry.locusRoleDescription !== "string" ||
    typeof entry.multiverseRoleDescription !== "string" ||
    typeof entry.fabricRoleDescription !== "string" ||
    typeof entry.secureDropRoleDescription !== "string" ||
    !isPlainObjectRecord(entry.explicitBlockedAuthorizationFlags) ||
    !isPlainObjectRecord(entry.unsafeAuthPermissionsRuntimeFlags) ||
    entry.nonAuthorizingProof !== true
  );
}

function authPermissionsContractBoundaryMapAuthorizationFlagEnabled(value) {
  if (!isPlainObjectRecord(value)) {
    return false;
  }

  return (
    (isPlainObjectRecord(value.explicitBlockedAuthorizationFlags) &&
      Object.values(value.explicitBlockedAuthorizationFlags).some(
        (flag) => flag !== false
      )) ||
    AUTH_PERMISSIONS_CONTRACT_BOUNDARY_AUTHORIZATION_FIELDS.some(
      (field) => value[field] === true
    )
  );
}

function authPermissionsContractBoundaryMapUnsafeFlagEnabled(value) {
  if (!isPlainObjectRecord(value)) {
    return false;
  }

  return (
    (isPlainObjectRecord(value.unsafeAuthPermissionsRuntimeFlags) &&
      Object.values(value.unsafeAuthPermissionsRuntimeFlags).some(
        (flag) => flag !== false
      )) ||
    authPermissionsContractBoundaryMapHasTrueFieldDeep(
      value,
      AUTH_PERMISSIONS_CONTRACT_BOUNDARY_UNSAFE_FIELDS
    )
  );
}

function authPermissionsContractBoundaryMapHasUnknownTopLevelField(
  inputRecord
) {
  if (inputRecord === null) {
    return false;
  }

  return Object.keys(inputRecord).some(
    (field) =>
      !AUTH_PERMISSIONS_CONTRACT_BOUNDARY_ALLOWED_TOP_LEVEL_FIELDS.includes(
        field
      )
  );
}

function authPermissionsContractBoundaryMapCanonical(entries) {
  if (entries === null) {
    return true;
  }

  return (
    JSON.stringify(entries) ===
    JSON.stringify(authPermissionsContractBoundaryMapEntries())
  );
}

function authPermissionsContractBoundaryMapInputClassification(inputRecord) {
  if (authPermissionsContractBoundaryMapInputMalformed(inputRecord)) {
    return MALFORMED_AUTH_PERMISSIONS_CONTRACT_BOUNDARY_MAP_CLASSIFICATION;
  }

  const entries = authPermissionsContractBoundaryMapInputEntries(inputRecord);

  if (
    authPermissionsContractBoundaryMapContainsEntryIssue(
      entries,
      authPermissionsContractBoundaryMapMissingRequiredField
    )
  ) {
    return "missing_required_auth_permissions_contract_boundary_entry_rejected";
  }

  if (
    authPermissionsContractBoundaryMapContainsEntryIssue(
      entries,
      (entry) =>
        !AUTH_PERMISSIONS_CONTRACT_BOUNDARY_FAMILIES.includes(
          entry.boundaryFamily
        )
    )
  ) {
    return "unknown_boundary_family_auth_permissions_contract_boundary_map_input_rejected";
  }

  if (
    authPermissionsContractBoundaryMapContainsEntryIssue(
      entries,
      (entry) =>
        !AUTH_PERMISSIONS_CONTRACT_BOUNDARY_RELATED_SYSTEMS.includes(
          entry.relatedSystem
        )
    )
  ) {
    return "unknown_related_system_auth_permissions_contract_boundary_map_input_rejected";
  }

  if (
    authPermissionsContractBoundaryMapContainsEntryIssue(
      entries,
      (entry) =>
        !AUTH_PERMISSIONS_CONTRACT_BOUNDARY_STATUSES.includes(
          entry.currentStatus
        )
    )
  ) {
    return "unknown_current_status_auth_permissions_contract_boundary_map_input_rejected";
  }

  if (
    authPermissionsContractBoundaryMapContainsEntryIssue(
      entries,
      authPermissionsContractBoundaryMapEntryMalformed
    )
  ) {
    return MALFORMED_AUTH_PERMISSIONS_CONTRACT_BOUNDARY_MAP_CLASSIFICATION;
  }

  if (
    authPermissionsContractBoundaryMapContainsEntryIssue(
      entries,
      authPermissionsContractBoundaryMapAuthorizationFlagEnabled
    ) ||
    authPermissionsContractBoundaryMapAuthorizationFlagEnabled(inputRecord)
  ) {
    return "authorization_flags_enabled_auth_permissions_contract_boundary_map_input_rejected";
  }

  if (
    authPermissionsContractBoundaryMapHasTrueFieldDeep(inputRecord, [
      "reportRunsChecks"
    ])
  ) {
    return "report_runs_checks_true_auth_permissions_contract_boundary_map_input_rejected";
  }

  if (
    authPermissionsContractBoundaryMapHasTrueFieldDeep(
      inputRecord,
      AUTH_PERMISSIONS_CONTRACT_BOUNDARY_AUTHORIZATION_FIELDS
    )
  ) {
    return "runtime_authorization_attempt_auth_permissions_contract_boundary_map_input_rejected";
  }

  if (
    authPermissionsContractBoundaryMapHasTrueFieldDeep(
      inputRecord,
      AUTH_PERMISSIONS_CONTRACT_BOUNDARY_COMMAND_FIELDS
    )
  ) {
    return "command_exposure_attempt_auth_permissions_contract_boundary_map_input_rejected";
  }

  if (
    authPermissionsContractBoundaryMapHasTrueFieldDeep(
      inputRecord,
      AUTH_PERMISSIONS_CONTRACT_BOUNDARY_BLOCKED_CLI_BYPASS_FIELDS
    )
  ) {
    return "blocked_cli_bypass_attempt_auth_permissions_contract_boundary_map_input_rejected";
  }

  if (
    authPermissionsContractBoundaryMapHasPresentFieldDeep(
      inputRecord,
      AUTH_PERMISSIONS_CONTRACT_BOUNDARY_LOGIN_SESSION_TOKEN_FIELDS
    )
  ) {
    return "hidden_login_session_token_api_key_semantics_auth_permissions_contract_boundary_map_input_rejected";
  }

  if (
    authPermissionsContractBoundaryMapHasPresentFieldDeep(
      inputRecord,
      AUTH_PERMISSIONS_CONTRACT_BOUNDARY_PERMISSION_EVALUATOR_FIELDS
    )
  ) {
    return "hidden_permission_evaluator_semantics_auth_permissions_contract_boundary_map_input_rejected";
  }

  if (
    authPermissionsContractBoundaryMapHasPresentFieldDeep(
      inputRecord,
      AUTH_PERMISSIONS_CONTRACT_BOUNDARY_APPROVAL_GRANT_FIELDS
    )
  ) {
    return "hidden_approval_decision_grant_semantics_auth_permissions_contract_boundary_map_input_rejected";
  }

  if (
    authPermissionsContractBoundaryMapHasPresentFieldDeep(
      inputRecord,
      AUTH_PERMISSIONS_CONTRACT_BOUNDARY_CONNECTOR_GRANT_FIELDS
    )
  ) {
    return "hidden_connector_grant_semantics_auth_permissions_contract_boundary_map_input_rejected";
  }

  if (
    authPermissionsContractBoundaryMapHasPresentFieldDeep(
      inputRecord,
      AUTH_PERMISSIONS_CONTRACT_BOUNDARY_RUNTIME_AUTH_FIELDS
    )
  ) {
    return "hidden_runtime_authorization_semantics_auth_permissions_contract_boundary_map_input_rejected";
  }

  if (
    authPermissionsContractBoundaryMapHasPresentFieldDeep(
      inputRecord,
      AUTH_PERMISSIONS_CONTRACT_BOUNDARY_SECRET_FIELDS
    )
  ) {
    return "hidden_secret_env_vault_access_semantics_auth_permissions_contract_boundary_map_input_rejected";
  }

  if (
    authPermissionsContractBoundaryMapHasPresentFieldDeep(
      inputRecord,
      AUTH_PERMISSIONS_CONTRACT_BOUNDARY_EXTERNAL_IDP_FIELDS
    )
  ) {
    return "hidden_external_identity_provider_integration_semantics_auth_permissions_contract_boundary_map_input_rejected";
  }

  if (
    authPermissionsContractBoundaryMapHasPresentFieldDeep(
      inputRecord,
      AUTH_PERMISSIONS_CONTRACT_BOUNDARY_KEYRING_DID_SECURE_DROP_FIELDS
    )
  ) {
    return "hidden_keyring_did_secure_drop_implementation_semantics_auth_permissions_contract_boundary_map_input_rejected";
  }

  if (
    authPermissionsContractBoundaryMapHasPresentFieldDeep(
      inputRecord,
      AUTH_PERMISSIONS_CONTRACT_BOUNDARY_DATABASE_STORAGE_FIELDS
    )
  ) {
    return "hidden_database_storage_rls_persistence_semantics_auth_permissions_contract_boundary_map_input_rejected";
  }

  if (
    authPermissionsContractBoundaryMapHasPresentFieldDeep(
      inputRecord,
      AUTH_PERMISSIONS_CONTRACT_BOUNDARY_FABRIC_RUNTIME_FIELDS
    )
  ) {
    return "hidden_fabric_websocket_http_mcp_task_runtime_semantics_auth_permissions_contract_boundary_map_input_rejected";
  }

  if (
    authPermissionsContractBoundaryMapUnsafeFlagEnabled(inputRecord) ||
    authPermissionsContractBoundaryMapContainsEntryIssue(
      entries,
      authPermissionsContractBoundaryMapUnsafeFlagEnabled
    )
  ) {
    return "unsafe_identity_authentication_authorization_session_token_api_key_role_permission_grant_secret_delegation_revocation_runtime_flags_auth_permissions_contract_boundary_map_input_rejected";
  }

  if (
    authPermissionsContractBoundaryMapContainsEntryIssue(entries, (entry) =>
      authPermissionsContractBoundaryMapContainsTrue(entry?.runtimeEffect)
    ) ||
    authPermissionsContractBoundaryMapContainsTrue(inputRecord?.runtimeEffect)
  ) {
    return "nested_unsafe_flags_auth_permissions_contract_boundary_map_input_rejected";
  }

  if (authPermissionsContractBoundaryMapHasUnknownTopLevelField(inputRecord)) {
    return "unknown_top_level_field_auth_permissions_contract_boundary_map_input_rejected";
  }

  if (!authPermissionsContractBoundaryMapCanonical(entries)) {
    return "noncanonical_auth_permissions_contract_boundary_map_input_rejected";
  }

  return VALID_AUTH_PERMISSIONS_CONTRACT_BOUNDARY_MAP_CLASSIFICATION;
}

function authPermissionsContractBoundaryMapAuthorizationFlags() {
  return {
    identityRuntimeAuthorizationGranted: false,
    authenticationRuntimeAuthorizationGranted: false,
    authorizationRuntimeAuthorizationGranted: false,
    rolePermissionRuntimeAuthorizationGranted: false,
    operatorConsentRuntimeAuthorizationGranted: false,
    approvalPrerequisiteRuntimeAuthorizationGranted: false,
    runtimeCommandAuthorizationGranted: false,
    connectorGrantAuthorizationGranted: false,
    secretAccessAuthorizationGranted: false,
    delegationAuthorizationGranted: false,
    revocationAuthorizationGranted: false,
    auditSubjectRuntimeAuthorizationGranted: false,
    fabricRuntimeAuthorizationGranted: false,
    mcpToolExposureAuthorizationGranted: false,
    taskExecutionAuthorizationGranted: false,
    secureDropAuthorizationGranted: false,
    databaseStorageAuthorizationGranted: false,
    commandExposureAuthorizationGranted: false,
    approvalDecisionProduced: false,
    approvalGrantProduced: false,
    connectorGrantProduced: false,
    authorizesRuntime: false
  };
}

function authPermissionsContractBoundaryMapUnsafeFlags() {
  return Object.fromEntries(
    AUTH_PERMISSIONS_CONTRACT_BOUNDARY_UNSAFE_FIELDS.map((field) => [
      field,
      false
    ])
  );
}

function authPermissionsContractBoundaryMapEntry(definition) {
  return {
    boundaryId: definition.boundaryId,
    boundaryFamily: definition.boundaryFamily,
    relatedSystem: definition.relatedSystem,
    currentStatus: definition.currentStatus,
    allowedCurrentBehavior: definition.allowedCurrentBehavior,
    forbiddenCurrentBehavior: authPermissionsContractBoundaryMapForbiddenBehavior(),
    requiredFutureContractBeforeImplementation:
      definition.requiredFutureContractBeforeImplementation,
    requiredFutureAuthorizationPhaseBeforeRuntime:
      definition.requiredFutureAuthorizationPhaseBeforeRuntime,
    identitySubjectNotes: definition.identitySubjectNotes,
    rolePermissionExpectation: definition.rolePermissionExpectation,
    consentApprovalExpectation: definition.consentApprovalExpectation,
    revocationExpectation: definition.revocationExpectation,
    auditSubjectExpectation: definition.auditSubjectExpectation,
    locusRoleDescription: definition.locusRoleDescription,
    multiverseRoleDescription: definition.multiverseRoleDescription,
    fabricRoleDescription: definition.fabricRoleDescription,
    secureDropRoleDescription: definition.secureDropRoleDescription,
    productionReadinessAreaReference: {
      phase: "5.48",
      areaNumber: 4,
      areaName: "Auth & Permissions",
      sourceFixture:
        "tests/fixtures/host-policy/phase5-48/production-readiness-coverage-matrix.json",
      sourceStatus: "deferred",
      representedByPhase562: true,
      authorizesRuntime: false
    },
    phase559FabricAwareApiBackendReference: {
      phase: "5.59",
      sourceFixture:
        "tests/fixtures/host-policy/phase5-59/fabric-aware-api-backend-contract-boundary-map.json",
      fabricBoundaryReferenced: true,
      implementsFabricRuntime: false,
      authorizesRuntime: false
    },
    phase560EncodedHandoffConformanceReference: {
      phase: "5.60",
      sourceFixture:
        "tests/fixtures/host-policy/phase5-60/inter-agent-encoded-handoff-conformance.json",
      encodedHandoffConformanceReferenced: true,
      implementsEncodedHandoffRuntime: false,
      authorizesRuntime: false
    },
    phase561DatabaseStorageContractBoundaryReference: {
      phase: "5.61",
      sourceFixture:
        "tests/fixtures/host-policy/phase5-61/database-storage-contract-boundary-map.json",
      databaseStorageBoundaryReferenced: true,
      implementsDatabaseStorageRuntime: false,
      authorizesRuntime: false
    },
    authPermissionsBoundaryMetadataOnly: true,
    noIdentityVerificationPerformed: true,
    explicitBlockedAuthorizationFlags:
      authPermissionsContractBoundaryMapAuthorizationFlags(),
    unsafeAuthPermissionsRuntimeFlags:
      authPermissionsContractBoundaryMapUnsafeFlags(),
    nonAuthorizingProof: true,
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

function authPermissionsContractBoundaryMapDefinitions() {
  const currentAuthorization =
    "Requires a future auth, permission, runtime, command exposure, connector, storage, secrets, audit, and process-control authorization phase before any executable behavior.";
  const noConsumerRole =
    "No current role; future consumers may inspect metadata only.";
  const contentFabricSecureDrop =
    "Secure Drop recipient identity, keyring, DID, and access semantics remain canonically owned by content-fabric; Ardyn records metadata references only and implements no crypto, transport, stego, send/receive, inbox polling, file selection, connector ingestion, secret/vault/env access, or ST3GG wrapping.";

  return [
    {
      boundaryId: "phase5-62.ardyn.operator-identity.identity-boundary",
      boundaryFamily: "identity_contract",
      relatedSystem: "ardyn",
      currentStatus: "metadata_only",
      allowedCurrentBehavior: [
        "Describe future operator identity subject requirements.",
        "Keep operator identity metadata non-verifying and non-authorizing."
      ],
      requiredFutureContractBeforeImplementation:
        "A future identity contract must define operator subject shape, verification source, trust boundary, display semantics, audit traceability, and denial states.",
      requiredFutureAuthorizationPhaseBeforeRuntime: currentAuthorization,
      identitySubjectNotes:
        "Current operator identity is planning metadata only; no login, session, token, API key, or external identity-provider verification exists.",
      rolePermissionExpectation:
        "Future operator roles must be separately contracted before any permission evaluation.",
      consentApprovalExpectation:
        "Operator consent remains metadata and cannot produce approval decisions or grants.",
      revocationExpectation:
        "Future operator identity must include revocation semantics before runtime use.",
      auditSubjectExpectation:
        "Future audit subjects must be stable and reviewable without exposing secrets.",
      locusRoleDescription: noConsumerRole,
      multiverseRoleDescription: noConsumerRole,
      fabricRoleDescription:
        "Fabric may later envelope operator subject metadata only.",
      secureDropRoleDescription: "Not applicable."
    },
    {
      boundaryId:
        "phase5-62.ardyn-subagent.subagent-identity.identity-boundary",
      boundaryFamily: "identity_contract",
      relatedSystem: "ardyn-subagent",
      currentStatus: "metadata_only",
      allowedCurrentBehavior: [
        "Describe future subagent identity subject requirements.",
        "Keep subagent identity metadata non-executing and non-delegating."
      ],
      requiredFutureContractBeforeImplementation:
        "A future subagent identity contract must define subject identity, parent task linkage, delegation limits, audit labels, and revocation behavior.",
      requiredFutureAuthorizationPhaseBeforeRuntime: currentAuthorization,
      identitySubjectNotes:
        "Subagent identity is metadata only and cannot authenticate, receive tokens, or inherit operator grants.",
      rolePermissionExpectation:
        "Future subagent permissions must be strictly scoped and never inferred from metadata.",
      consentApprovalExpectation:
        "Subagents cannot provide operator consent or approval grants.",
      revocationExpectation:
        "Future subagent identity must be revocable independently of operator metadata.",
      auditSubjectExpectation:
        "Future subagent audit subjects must remain traceable to explicit review metadata.",
      locusRoleDescription: noConsumerRole,
      multiverseRoleDescription: noConsumerRole,
      fabricRoleDescription:
        "Fabric may later carry subagent subject references only.",
      secureDropRoleDescription: "Not applicable."
    },
    {
      boundaryId:
        "phase5-62.locus.external-harness-identity.authentication-boundary",
      boundaryFamily: "authentication_contract",
      relatedSystem: "locus",
      currentStatus: "future_contract_required",
      allowedCurrentBehavior: [
        "Describe future Locus-mediated external harness identity metadata.",
        "Keep external harness authentication as a consumer-owned future contract."
      ],
      requiredFutureContractBeforeImplementation:
        "Future external harness authentication requires a Locus-owned contract for subject proof, bridge trust, denial states, audit visibility, and no implicit Ardyn grants.",
      requiredFutureAuthorizationPhaseBeforeRuntime: currentAuthorization,
      identitySubjectNotes:
        "External harness identity through Locus is a future metadata target only.",
      rolePermissionExpectation:
        "Future harness roles must be consumer-owned and cannot grant Ardyn runtime behavior.",
      consentApprovalExpectation:
        "Locus bridge metadata cannot substitute for operator consent or approval.",
      revocationExpectation:
        "Future bridge authentication must include revocation before any interop.",
      auditSubjectExpectation:
        "Future external harness subjects must remain visible in review artifacts.",
      locusRoleDescription:
        "Locus may later own external harness identity display and verification.",
      multiverseRoleDescription: noConsumerRole,
      fabricRoleDescription:
        "Fabric may later envelope bridge identity references only.",
      secureDropRoleDescription: "Not applicable."
    },
    {
      boundaryId:
        "phase5-62.locus.control-surface-permission.permission-boundary",
      boundaryFamily: "permission_contract",
      relatedSystem: "locus",
      currentStatus: "future_contract_required",
      allowedCurrentBehavior: [
        "Describe future Locus control-surface permission metadata.",
        "Keep current control surfaces display-only and non-interactive."
      ],
      requiredFutureContractBeforeImplementation:
        "Future Locus control permissions require a consumer-owned contract for available actions, disabled states, approval prerequisites, audit traceability, and command-blocked defaults.",
      requiredFutureAuthorizationPhaseBeforeRuntime: currentAuthorization,
      identitySubjectNotes:
        "No authenticated Locus subject exists in Ardyn.",
      rolePermissionExpectation:
        "Future Locus control permissions must be explicit and color-independent in display surfaces.",
      consentApprovalExpectation:
        "Control-surface display cannot approve runtime or expose commands.",
      revocationExpectation:
        "Future Locus permissions must define revocation before interactivity.",
      auditSubjectExpectation:
        "Future control actions must carry explicit subject metadata.",
      locusRoleDescription:
        "Locus may later own display and permission checks for its controls.",
      multiverseRoleDescription: noConsumerRole,
      fabricRoleDescription:
        "Fabric may later coordinate control metadata envelopes only.",
      secureDropRoleDescription: "Not applicable."
    },
    {
      boundaryId:
        "phase5-62.multiverse.citizen-adapter-permission.permission-boundary",
      boundaryFamily: "permission_contract",
      relatedSystem: "multiverse",
      currentStatus: "future_contract_required",
      allowedCurrentBehavior: [
        "Describe future Multiverse citizen and adapter candidate permission metadata.",
        "Keep Multiverse targets as consumer-owned planning metadata only."
      ],
      requiredFutureContractBeforeImplementation:
        "Future Multiverse permissions require a consumer-owned contract for citizen subjects, adapter candidates, task wrappers, denial states, and audit evidence.",
      requiredFutureAuthorizationPhaseBeforeRuntime: currentAuthorization,
      identitySubjectNotes:
        "No Multiverse citizen or adapter identity is authenticated by Ardyn.",
      rolePermissionExpectation:
        "Future Multiverse permissions must not grant connector or adapter runtime from Ardyn metadata.",
      consentApprovalExpectation:
        "Multiverse metadata cannot produce Ardyn approval decisions or grants.",
      revocationExpectation:
        "Future citizen and adapter permissions must be revocable before runtime.",
      auditSubjectExpectation:
        "Future Multiverse subjects must remain traceable in review metadata.",
      locusRoleDescription: noConsumerRole,
      multiverseRoleDescription:
        "Multiverse may later own citizen and adapter permission checks.",
      fabricRoleDescription:
        "Fabric may later coordinate Multiverse permission references only.",
      secureDropRoleDescription: "Not applicable."
    },
    {
      boundaryId:
        "phase5-62.multiverse.role-capability-badge.role-boundary",
      boundaryFamily: "role_contract",
      relatedSystem: "multiverse",
      currentStatus: "metadata_only",
      allowedCurrentBehavior: [
        "Describe future role and capability badge metadata.",
        "Keep role labels non-authorizing and display-only."
      ],
      requiredFutureContractBeforeImplementation:
        "A future role contract must distinguish visible role labels from executable permissions, grants, connector access, and runtime authorization.",
      requiredFutureAuthorizationPhaseBeforeRuntime: currentAuthorization,
      identitySubjectNotes:
        "Role labels do not verify identity or authenticate subjects.",
      rolePermissionExpectation:
        "Future role labels must never imply permissions without a separate evaluator contract.",
      consentApprovalExpectation:
        "Role labels cannot represent consent, approval decisions, or grants.",
      revocationExpectation:
        "Future role metadata must define revocation and stale badge display.",
      auditSubjectExpectation:
        "Future role assertions must remain auditable as metadata claims.",
      locusRoleDescription: noConsumerRole,
      multiverseRoleDescription:
        "Multiverse may later display role metadata without enabling actions.",
      fabricRoleDescription:
        "Fabric may later envelope role references only.",
      secureDropRoleDescription: "Not applicable."
    },
    {
      boundaryId:
        "phase5-62.repo-family.fabric-envelope-authorization.authorization-boundary",
      boundaryFamily: "authorization_contract",
      relatedSystem: "repo-family",
      currentStatus: "future_contract_required",
      allowedCurrentBehavior: [
        "Describe future Fabric coordination-envelope authorization metadata.",
        "Keep Fabric authorization as a future cross-repo contract only."
      ],
      requiredFutureContractBeforeImplementation:
        "Future Fabric authorization requires a cross-repo contract for envelope subjects, scopes, denial semantics, audit digests, replay handling, and explicit runtime authorization gates.",
      requiredFutureAuthorizationPhaseBeforeRuntime: currentAuthorization,
      identitySubjectNotes:
        "Fabric envelope subjects are metadata references only.",
      rolePermissionExpectation:
        "Fabric authorization metadata cannot grant bus, broker, transport, connector, or task runtime.",
      consentApprovalExpectation:
        "Fabric envelopes cannot substitute for operator consent or Ardyn approval.",
      revocationExpectation:
        "Future Fabric authorization must define revocation and stale-envelope handling.",
      auditSubjectExpectation:
        "Future Fabric envelopes must preserve subject traceability.",
      locusRoleDescription:
        "Locus may later inspect Fabric authorization metadata only.",
      multiverseRoleDescription:
        "Multiverse may later inspect Fabric authorization metadata only.",
      fabricRoleDescription:
        "Fabric remains a future coordination envelope, not a runtime bus.",
      secureDropRoleDescription: "Not applicable."
    },
    {
      boundaryId: "phase5-62.ardyn.mcp-tool-access.permission-boundary",
      boundaryFamily: "permission_contract",
      relatedSystem: "ardyn",
      currentStatus: "blocked",
      allowedCurrentBehavior: [
        "Describe future MCP/tool access permission prerequisites.",
        "Keep MCP/tool access fully blocked in Ardyn."
      ],
      requiredFutureContractBeforeImplementation:
        "Future MCP/tool access requires a permission contract covering subject identity, allowed tools, denial states, audit, revocation, and runtime isolation.",
      requiredFutureAuthorizationPhaseBeforeRuntime: currentAuthorization,
      identitySubjectNotes:
        "No MCP/tool subject is authenticated or authorized by Ardyn.",
      rolePermissionExpectation:
        "Future MCP permissions must be explicit and cannot be inferred from fixture metadata.",
      consentApprovalExpectation:
        "No tool access can be approved by current metadata.",
      revocationExpectation:
        "Future MCP/tool grants must be revocable and auditable.",
      auditSubjectExpectation:
        "Future tool calls must carry a stable subject and approval record.",
      locusRoleDescription: noConsumerRole,
      multiverseRoleDescription: noConsumerRole,
      fabricRoleDescription:
        "Fabric may later reference MCP/tool permissions only as metadata.",
      secureDropRoleDescription: "Not applicable."
    },
    {
      boundaryId:
        "phase5-62.repo-family.connector-grant.connector-grant-boundary",
      boundaryFamily: "connector_grant_boundary",
      relatedSystem: "repo-family",
      currentStatus: "blocked",
      allowedCurrentBehavior: [
        "Describe future connector grant prerequisites.",
        "Keep connector grants unavailable and non-authorizing."
      ],
      requiredFutureContractBeforeImplementation:
        "Future connector grants require explicit subject identity, connector scope, secret handling, approval record, revocation, and audit contract.",
      requiredFutureAuthorizationPhaseBeforeRuntime: currentAuthorization,
      identitySubjectNotes:
        "No connector subject or credential exists in Ardyn.",
      rolePermissionExpectation:
        "Future connector permissions must be explicitly scoped and denied by default.",
      consentApprovalExpectation:
        "Connector grants require future operator consent and approval records.",
      revocationExpectation:
        "Future connector grants must be revocable before use.",
      auditSubjectExpectation:
        "Future connector grant attempts must record subject and scope.",
      locusRoleDescription:
        "Locus may later display connector grant status metadata only.",
      multiverseRoleDescription:
        "Multiverse may later display connector candidate metadata only.",
      fabricRoleDescription:
        "Fabric may later coordinate connector grant metadata only.",
      secureDropRoleDescription: "Not applicable."
    },
    {
      boundaryId:
        "phase5-62.ardyn.runtime-command-authorization.runtime-authorization-boundary",
      boundaryFamily: "runtime_authorization_boundary",
      relatedSystem: "ardyn",
      currentStatus: "blocked",
      allowedCurrentBehavior: [
        "Describe future runtime command authorization prerequisites.",
        "Keep runtime commands default-blocked with zero stdout on rejection."
      ],
      requiredFutureContractBeforeImplementation:
        "Future runtime command authorization requires explicit subject identity, consent, approval prerequisite records, command exposure authorization, revocation, and audit policy.",
      requiredFutureAuthorizationPhaseBeforeRuntime: currentAuthorization,
      identitySubjectNotes:
        "No runtime command subject is authenticated or authorized.",
      rolePermissionExpectation:
        "Future command permissions must be explicit and command-specific.",
      consentApprovalExpectation:
        "Current metadata cannot authorize runtime commands or approval grants.",
      revocationExpectation:
        "Future command authorization must define revocation before execution.",
      auditSubjectExpectation:
        "Future runtime command attempts must be subject-traceable.",
      locusRoleDescription:
        "Locus may later display blocked command status metadata only.",
      multiverseRoleDescription:
        "Multiverse may later display blocked task capability status only.",
      fabricRoleDescription:
        "Fabric may later envelope command authorization references only.",
      secureDropRoleDescription: "Not applicable."
    },
    {
      boundaryId:
        "phase5-62.ardyn.approval-prerequisite-metadata.approval-prerequisite-boundary",
      boundaryFamily: "approval_prerequisite_contract",
      relatedSystem: "ardyn",
      currentStatus: "metadata_only",
      allowedCurrentBehavior: [
        "Describe approval-prerequisite metadata boundaries.",
        "Keep prerequisite metadata necessary but not sufficient for runtime."
      ],
      requiredFutureContractBeforeImplementation:
        "Future approval prerequisites require an explicit source contract, freshness, denial semantics, subject identity, and non-forgeable audit references.",
      requiredFutureAuthorizationPhaseBeforeRuntime: currentAuthorization,
      identitySubjectNotes:
        "Approval prerequisite metadata does not authenticate an operator.",
      rolePermissionExpectation:
        "Prerequisite records cannot grant permissions without a future evaluator.",
      consentApprovalExpectation:
        "Prerequisite metadata is not an approval decision or grant.",
      revocationExpectation:
        "Future prerequisites must expire or revoke cleanly.",
      auditSubjectExpectation:
        "Future prerequisite records must identify source and subject.",
      locusRoleDescription:
        "Locus may later display prerequisite status metadata only.",
      multiverseRoleDescription:
        "Multiverse may later display prerequisite status metadata only.",
      fabricRoleDescription:
        "Fabric may later carry prerequisite references only.",
      secureDropRoleDescription: "Not applicable."
    },
    {
      boundaryId:
        "phase5-62.ardyn.approval-decision-grant.authorization-boundary",
      boundaryFamily: "authorization_contract",
      relatedSystem: "ardyn",
      currentStatus: "blocked",
      allowedCurrentBehavior: [
        "Describe future approval decision and grant boundaries.",
        "Keep current approval decision and grant behavior unimplemented."
      ],
      requiredFutureContractBeforeImplementation:
        "Future approval decisions and grants require a separate evaluator contract, subject identity, denial handling, revocation, audit trail, and runtime enablement approval.",
      requiredFutureAuthorizationPhaseBeforeRuntime: currentAuthorization,
      identitySubjectNotes:
        "No authenticated approval decision subject exists.",
      rolePermissionExpectation:
        "Approval grants cannot be inferred from roles or metadata.",
      consentApprovalExpectation:
        "Current metadata cannot decide, grant, or expose commands.",
      revocationExpectation:
        "Future grants must define expiry and revocation.",
      auditSubjectExpectation:
        "Future grants must bind operator, evaluator, and command subject metadata.",
      locusRoleDescription:
        "Locus may later display approval status metadata only.",
      multiverseRoleDescription:
        "Multiverse may later display approval status metadata only.",
      fabricRoleDescription:
        "Fabric may later envelope approval references only.",
      secureDropRoleDescription: "Not applicable."
    },
    {
      boundaryId: "phase5-62.ardyn.operator_consent.operator_consent_boundary",
      boundaryFamily: "operator_consent_contract",
      relatedSystem: "ardyn",
      currentStatus: "metadata_only",
      allowedCurrentBehavior: [
        "Describe future operator consent metadata requirements.",
        "Keep consent metadata non-executable and non-granting."
      ],
      requiredFutureContractBeforeImplementation:
        "Future operator consent requires subject identity, explicit scope, duration, revocation, denial, audit, and UI display requirements before any runtime use.",
      requiredFutureAuthorizationPhaseBeforeRuntime: currentAuthorization,
      identitySubjectNotes:
        "Current consent metadata does not verify the operator.",
      rolePermissionExpectation:
        "Consent cannot imply role, permission, connector, or runtime access.",
      consentApprovalExpectation:
        "Consent metadata remains separate from approval decisions and grants.",
      revocationExpectation:
        "Future consent must be revocable and time-bound.",
      auditSubjectExpectation:
        "Future consent must be traceable to a reviewable subject.",
      locusRoleDescription:
        "Locus may later display operator consent metadata only.",
      multiverseRoleDescription: noConsumerRole,
      fabricRoleDescription:
        "Fabric may later carry consent references only.",
      secureDropRoleDescription: "Not applicable."
    },
    {
      boundaryId:
        "phase5-62.repo-family.delegation-candidate.delegation-boundary",
      boundaryFamily: "delegation_boundary",
      relatedSystem: "repo-family",
      currentStatus: "future_contract_required",
      allowedCurrentBehavior: [
        "Describe future delegation metadata requirements.",
        "Keep delegation non-executable and non-inheriting."
      ],
      requiredFutureContractBeforeImplementation:
        "Future delegation requires explicit delegator, delegate, scope, duration, revocation, audit, and no implicit runtime inheritance.",
      requiredFutureAuthorizationPhaseBeforeRuntime: currentAuthorization,
      identitySubjectNotes:
        "Delegation candidates do not authenticate or authorize delegate subjects.",
      rolePermissionExpectation:
        "Future delegation must not broaden permissions beyond explicit scope.",
      consentApprovalExpectation:
        "Delegation requires separate operator consent and approval prerequisites.",
      revocationExpectation:
        "Future delegation must be revocable before runtime.",
      auditSubjectExpectation:
        "Future delegation must preserve delegator and delegate traceability.",
      locusRoleDescription:
        "Locus may later display delegation metadata only.",
      multiverseRoleDescription:
        "Multiverse may later display delegation metadata only.",
      fabricRoleDescription:
        "Fabric may later coordinate delegation references only.",
      secureDropRoleDescription: "Not applicable."
    },
    {
      boundaryId:
        "phase5-62.repo-family.revocation-candidate.revocation-boundary",
      boundaryFamily: "revocation_boundary",
      relatedSystem: "repo-family",
      currentStatus: "future_contract_required",
      allowedCurrentBehavior: [
        "Describe future revocation metadata requirements.",
        "Keep revocation planning separate from runtime enforcement."
      ],
      requiredFutureContractBeforeImplementation:
        "Future revocation requires subject identity, grant linkage, stale state handling, audit visibility, and fail-closed runtime enforcement.",
      requiredFutureAuthorizationPhaseBeforeRuntime: currentAuthorization,
      identitySubjectNotes:
        "Revocation candidates do not authenticate or revoke live grants.",
      rolePermissionExpectation:
        "Future revocation must invalidate role, permission, connector, and runtime grants by explicit reference.",
      consentApprovalExpectation:
        "Revocation metadata cannot produce approval decisions.",
      revocationExpectation:
        "Revocation is a future contract and is not currently enforced.",
      auditSubjectExpectation:
        "Future revocation must be traceable to subject and grant metadata.",
      locusRoleDescription:
        "Locus may later display revocation metadata only.",
      multiverseRoleDescription:
        "Multiverse may later display revocation metadata only.",
      fabricRoleDescription:
        "Fabric may later coordinate revocation references only.",
      secureDropRoleDescription:
        "Secure Drop revocation remains content-fabric-owned future work."
    },
    {
      boundaryId:
        "phase5-62.content-fabric.secure-drop-recipient-keyring-did.secret-access-boundary",
      boundaryFamily: "secret_access_boundary",
      relatedSystem: "content-fabric",
      currentStatus: "future_contract_required",
      allowedCurrentBehavior: [
        "Describe future Secure Drop recipient identity, keyring, and DID reference metadata.",
        "Keep Secure Drop canonical implementation outside Ardyn."
      ],
      requiredFutureContractBeforeImplementation:
        "Future Secure Drop identity references require content-fabric-owned recipient identity, keyring, DID, consent, revocation, audit, and secret-handling contracts.",
      requiredFutureAuthorizationPhaseBeforeRuntime: currentAuthorization,
      identitySubjectNotes:
        "Secure Drop recipient identity, keyring, and DID references are metadata only.",
      rolePermissionExpectation:
        "Ardyn cannot grant Secure Drop recipient access or keyring permissions.",
      consentApprovalExpectation:
        "Secure Drop consent and approvals remain future content-fabric-owned work.",
      revocationExpectation:
        "Future Secure Drop recipient references must include revocation semantics.",
      auditSubjectExpectation:
        "Future Secure Drop references must preserve recipient traceability without exposing secrets.",
      locusRoleDescription:
        "Locus may later display Secure Drop status metadata only.",
      multiverseRoleDescription: noConsumerRole,
      fabricRoleDescription:
        "Fabric may later carry Secure Drop reference metadata only.",
      secureDropRoleDescription: contentFabricSecureDrop
    },
    {
      boundaryId:
        "phase5-62.ardyn.secret-env-vault-access.secret-access-boundary",
      boundaryFamily: "secret_access_boundary",
      relatedSystem: "ardyn",
      currentStatus: "blocked",
      allowedCurrentBehavior: [
        "Describe future secret/env/vault access prerequisites.",
        "Keep secrets, env files, vaults, and API keys inaccessible."
      ],
      requiredFutureContractBeforeImplementation:
        "Future secret access requires explicit subject identity, secret scope, storage ownership, audit, revocation, environment handling, and runtime authorization.",
      requiredFutureAuthorizationPhaseBeforeRuntime: currentAuthorization,
      identitySubjectNotes:
        "No secret access subject is authenticated or authorized.",
      rolePermissionExpectation:
        "Future secret permissions must be explicit, minimal, and denied by default.",
      consentApprovalExpectation:
        "Secret access requires separate operator consent and approval records.",
      revocationExpectation:
        "Future secret access must be revocable and rotated.",
      auditSubjectExpectation:
        "Future secret access attempts must be auditable without exposing secret values.",
      locusRoleDescription: noConsumerRole,
      multiverseRoleDescription: noConsumerRole,
      fabricRoleDescription:
        "Fabric may later reference secret access prerequisites only.",
      secureDropRoleDescription:
        "Secure Drop secret handling remains content-fabric-owned future work."
    },
    {
      boundaryId:
        "phase5-62.repo-family.audit-subject-traceability.audit-subject-boundary",
      boundaryFamily: "audit_subject_boundary",
      relatedSystem: "repo-family",
      currentStatus: "metadata_only",
      allowedCurrentBehavior: [
        "Describe future audit subject and traceability metadata.",
        "Keep audit subjects review-only without runtime audit writers."
      ],
      requiredFutureContractBeforeImplementation:
        "Future audit subjects require stable identity, action, consent, approval, revocation, and storage contracts before runtime audit persistence.",
      requiredFutureAuthorizationPhaseBeforeRuntime: currentAuthorization,
      identitySubjectNotes:
        "Audit subject metadata does not authenticate or authorize subjects.",
      rolePermissionExpectation:
        "Audit subject labels cannot grant permissions.",
      consentApprovalExpectation:
        "Audit subject metadata can reference consent and approval only after future contracts exist.",
      revocationExpectation:
        "Future audit subjects must record revoked and expired states.",
      auditSubjectExpectation:
        "Future traceability must cover operator, subagent, consumer, connector, and Secure Drop subjects without secrets.",
      locusRoleDescription:
        "Locus may later display audit subject metadata only.",
      multiverseRoleDescription:
        "Multiverse may later display audit subject metadata only.",
      fabricRoleDescription:
        "Fabric may later coordinate audit subject references only.",
      secureDropRoleDescription:
        "Secure Drop audit subjects remain content-fabric-owned future work."
    }
  ];
}

function authPermissionsContractBoundaryMapEntries() {
  return authPermissionsContractBoundaryMapDefinitions().map(
    authPermissionsContractBoundaryMapEntry
  );
}

function authPermissionsContractBoundaryMapSummary(entries) {
  const countByFamily = Object.fromEntries(
    AUTH_PERMISSIONS_CONTRACT_BOUNDARY_FAMILIES.map((family) => [
      family,
      entries.filter((entry) => entry.boundaryFamily === family).length
    ])
  );
  const countByRelatedSystem = Object.fromEntries(
    AUTH_PERMISSIONS_CONTRACT_BOUNDARY_RELATED_SYSTEMS.map((system) => [
      system,
      entries.filter((entry) => entry.relatedSystem === system).length
    ])
  );

  return {
    authPermissionsContractBoundaryMapKind:
      AUTH_PERMISSIONS_CONTRACT_BOUNDARY_MAP_KIND,
    boundaryEntryCount: entries.length,
    boundaryIds: entries.map((entry) => entry.boundaryId),
    boundaryFamilies: [...AUTH_PERMISSIONS_CONTRACT_BOUNDARY_FAMILIES],
    relatedSystems: [...AUTH_PERMISSIONS_CONTRACT_BOUNDARY_RELATED_SYSTEMS],
    currentStatusValues: [...AUTH_PERMISSIONS_CONTRACT_BOUNDARY_STATUSES],
    countByFamily,
    countByRelatedSystem,
    phase548AuthPermissionsCoverageItemRepresented: true,
    phase559FabricAwareApiBackendBoundaryReferenced: true,
    phase560EncodedHandoffConformanceReferenced: true,
    phase561DatabaseStorageContractBoundaryReferenced: true,
    authPermissionsBoundaryMetadataOnly: true,
    noIdentityVerificationPerformed: true,
    noLoginSessionTokenApiKeyRuntime: true,
    noRolePermissionEvaluatorRuntime: true,
    noApprovalDecisionGrantRuntime: true,
    noConnectorGrants: true,
    noSecretEnvVaultAccess: true,
    noDelegationRevocationRuntime: true,
    contentFabricCanonicalSecureDropOwnerOnly: true,
    allBlockedAuthorizationFlagsFalse: true,
    allUnsafeAuthPermissionsRuntimeFlagsFalse: true,
    allRuntimeEffectsFalse: true,
    allEntriesNonAuthorizing: true
  };
}

function authPermissionsContractBoundaryMapValidationRules() {
  return {
    missingRequiredFieldsFailClosed: true,
    unknownTopLevelFieldsFailClosed: true,
    unknownBoundaryFamiliesFailClosed: true,
    unknownRelatedSystemsFailClosed: true,
    unknownCurrentStatusesFailClosed: true,
    enabledAuthorizationFlagsFailClosed: true,
    reportRunsChecksTrueFailClosed: true,
    runtimeAuthorizationAttemptsFailClosed: true,
    commandExposureAttemptsFailClosed: true,
    blockedCliBypassAttemptsFailClosed: true,
    unsafeRuntimeCommandConnectorFabricWebsocketHttpMcpTaskSecureDropServiceDiscoveryScheduleFilesystemProcessFlagsFailClosed:
      true,
    unsafeIdentityAuthenticationAuthorizationSessionTokenApiKeyRolePermissionGrantSecretDelegationRevocationExecutionFlagsFailClosed:
      true,
    hiddenLoginSessionTokenApiKeySemanticsFailClosed: true,
    hiddenPermissionEvaluatorSemanticsFailClosed: true,
    hiddenApprovalDecisionGrantSemanticsFailClosed: true,
    hiddenConnectorGrantSemanticsFailClosed: true,
    hiddenRuntimeAuthorizationSemanticsFailClosed: true,
    hiddenSecretEnvVaultAccessSemanticsFailClosed: true,
    hiddenExternalIdentityProviderIntegrationSemanticsFailClosed: true,
    hiddenKeyringDidSecureDropImplementationSemanticsFailClosed: true,
    hiddenDatabaseStorageRlsPersistenceSemanticsFailClosed: true,
    hiddenFabricWebsocketHttpMcpTaskRuntimeSemanticsFailClosed: true,
    nestedUnsafeFlagsFailClosed: true,
    noncanonicalBoundaryEntriesFailClosed: true,
    validationImplementsIdentityProvider: false,
    validationImplementsAuthenticationRuntime: false,
    validationImplementsSessionRuntime: false,
    validationIssuesTokens: false,
    validationIssuesApiKeys: false,
    validationImplementsRoleEngine: false,
    validationImplementsPermissionEvaluator: false,
    validationProducesApprovalDecision: false,
    validationProducesApprovalGrant: false,
    validationProducesConnectorGrant: false,
    validationAccessesSecrets: false,
    validationImplementsDelegationRevocation: false,
    validationRunsRuntime: false
  };
}

function authPermissionsContractBoundaryMapGaps() {
  return [
    "No identity provider, login flow, session runtime, token issuer, API-key issuer, role engine, permission evaluator, or authorization evaluator exists in Ardyn.",
    "Approval decisions, approval grants, runtime command authorization, connector grants, delegation, and revocation remain blocked metadata boundaries only.",
    "Secrets, env files, vaults, keyrings, DIDs, and Secure Drop recipient identity references are not ingested; Secure Drop remains future content-fabric-owned work.",
    "Auth and permissions are not connected to database/storage, RLS, persistence, transcript/audit writes, backend API/server, Fabric runtime, websocket/http transport, MCP, or task execution.",
    "Future audit subject traceability needs explicit subject, consent, approval, revocation, storage, and display contracts before runtime."
  ];
}

function authPermissionsContractBoundaryMapState(reviewedAt) {
  const boundaryEntries = authPermissionsContractBoundaryMapEntries();

  return {
    schema: AUTH_PERMISSIONS_CONTRACT_BOUNDARY_MAP_STATE_SCHEMA,
    schemaVersion: AUTH_PERMISSIONS_CONTRACT_BOUNDARY_MAP_VERSION,
    stateKind: AUTH_PERMISSIONS_CONTRACT_BOUNDARY_MAP_KIND,
    stateMode: "review-only",
    reviewedAt,
    sourcePhaseContext: {
      phase548ProductionReadinessCoverageMatrix:
        "tests/fixtures/host-policy/phase5-48/production-readiness-coverage-matrix.json",
      phase548AuthPermissionsAreaNumber: 4,
      phase548AuthPermissionsStatus: "deferred",
      phase559FabricAwareApiBackendBoundary:
        "tests/fixtures/host-policy/phase5-59/fabric-aware-api-backend-contract-boundary-map.json",
      phase560InterAgentEncodedHandoffConformance:
        "tests/fixtures/host-policy/phase5-60/inter-agent-encoded-handoff-conformance.json",
      phase561DatabaseStorageContractBoundary:
        "tests/fixtures/host-policy/phase5-61/database-storage-contract-boundary-map.json",
      secureDropCanonicalOwner: "content-fabric",
      runtimeStillBlocked: true
    },
    boundaryEntries,
    boundaryMapSummary:
      authPermissionsContractBoundaryMapSummary(boundaryEntries),
    invalidBoundaryCasePolicy:
      authPermissionsContractBoundaryMapValidationRules(),
    topAuthPermissionsDatabaseStorageFabricApiBackendGaps:
      authPermissionsContractBoundaryMapGaps(),
    recommendedNextPhase:
      "phase-5.63-review-only-security-rls-input-sanitization-contract-boundary-map",
    authPermissionsContractBoundaryMapOnly: true,
    reviewOnly: true,
    metadataOnly: true,
    authoritative: false,
    nonAuthorizingProof: true,
    reportRunsChecks: false,
    identityProviderImplemented: false,
    authenticationRuntimeImplemented: false,
    loginFlowImplemented: false,
    sessionRuntimeImplemented: false,
    tokenIssuerImplemented: false,
    apiKeyIssuerImplemented: false,
    roleEngineImplemented: false,
    permissionEvaluatorImplemented: false,
    authorizationEvaluatorImplemented: false,
    grantProducerImplemented: false,
    approvalDecisionProduced: false,
    approvalGrantProduced: false,
    secretVaultEnvAccessEnabled: false,
    connectorGrantProduced: false,
    delegationEngineImplemented: false,
    revocationEngineImplemented: false,
    runtimeAuthorizationEnabled: false,
    policyEnforcementRuntimeImplemented: false,
    externalIdentityProviderIntegrated: false,
    keyringDidImplemented: false,
    databaseClientImplemented: false,
    databaseSchemaImplemented: false,
    databaseMigrationImplemented: false,
    rlsPolicyImplemented: false,
    storageAdapterImplemented: false,
    cacheEngineImplemented: false,
    cacheInvalidationRuntimeImplemented: false,
    transcriptWriterImplemented: false,
    auditWriterImplemented: false,
    filesystemWriteEnabled: false,
    importExportPathImplementedByArdyn: false,
    packageDistributionImplementedByArdyn: false,
    persistenceImplementedByArdyn: false,
    backendRuntimeImplementedByArdyn: false,
    apiEndpointImplementedByArdyn: false,
    serverImplementedByArdyn: false,
    websocketHttpTransportImplementedByArdyn: false,
    fabricRuntimeImplementedByArdyn: false,
    encodedHandoffRuntimeImplementedByArdyn: false,
    codecImplemented: false,
    translatorRuntimeImplemented: false,
    commandExposureEnabled: false,
    commandRuntimeControlEnabled: false,
    runtimeExecutionEnabled: false,
    databaseStorageRuntimeWritesEnabled: false,
    secretsRuntimeIngestionEnabled: false,
    mcpToolExposureEnabled: false,
    taskExecutionEnabled: false,
    secureDropImplemented: false,
    st3ggVendored: false,
    serviceDiscoveryEnabled: false,
    scheduleEnforcementEnabled: false,
    backgroundPollingEnabled: false,
    filesystemScanningEnabled: false,
    processControlEnabled: false,
    uiFrontendBrowserRenderingImplemented: false,
    blockedCliBypassEnabled: false,
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

function authPermissionsContractBoundaryMapResult({
  reviewedAt,
  reviewedAtDefaulted,
  classification,
  accepted,
  authPermissionsContractBoundaryMap
}) {
  return {
    schema: AUTH_PERMISSIONS_CONTRACT_BOUNDARY_MAP_SCHEMA,
    schemaVersion: AUTH_PERMISSIONS_CONTRACT_BOUNDARY_MAP_VERSION,
    authPermissionsContractBoundaryMapKind:
      AUTH_PERMISSIONS_CONTRACT_BOUNDARY_MAP_KIND,
    authPermissionsContractBoundaryMapMode: "review-only",
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    authPermissionsContractBoundaryMapProduced: accepted,
    authPermissionsContractBoundaryMap,
    boundaryMapSummary: accepted
      ? authPermissionsContractBoundaryMap.boundaryMapSummary
      : null,
    boundaryEntries: accepted
      ? authPermissionsContractBoundaryMap.boundaryEntries
      : [],
    invalidBoundaryCasePolicy: accepted
      ? authPermissionsContractBoundaryMap.invalidBoundaryCasePolicy
      : authPermissionsContractBoundaryMapValidationRules(),
    topAuthPermissionsDatabaseStorageFabricApiBackendGaps: accepted
      ? authPermissionsContractBoundaryMap
          .topAuthPermissionsDatabaseStorageFabricApiBackendGaps
      : [],
    recommendedNextPhase: accepted
      ? authPermissionsContractBoundaryMap.recommendedNextPhase
      : null,
    authPermissionsContractBoundaryMapOnly: true,
    reviewOnly: true,
    metadataOnly: true,
    authoritative: false,
    nonAuthorizingProof: true,
    reportRunsChecks: false,
    identityProviderImplemented: false,
    authenticationRuntimeImplemented: false,
    loginFlowImplemented: false,
    sessionRuntimeImplemented: false,
    tokenIssuerImplemented: false,
    apiKeyIssuerImplemented: false,
    roleEngineImplemented: false,
    permissionEvaluatorImplemented: false,
    authorizationEvaluatorImplemented: false,
    grantProducerImplemented: false,
    approvalDecisionProduced: false,
    approvalGrantProduced: false,
    secretVaultEnvAccessEnabled: false,
    connectorGrantProduced: false,
    delegationEngineImplemented: false,
    revocationEngineImplemented: false,
    runtimeAuthorizationEnabled: false,
    policyEnforcementRuntimeImplemented: false,
    externalIdentityProviderIntegrated: false,
    keyringDidImplemented: false,
    databaseClientImplemented: false,
    databaseSchemaImplemented: false,
    databaseMigrationImplemented: false,
    rlsPolicyImplemented: false,
    storageAdapterImplemented: false,
    cacheEngineImplemented: false,
    cacheInvalidationRuntimeImplemented: false,
    transcriptWriterImplemented: false,
    auditWriterImplemented: false,
    filesystemWriteEnabled: false,
    importExportPathImplementedByArdyn: false,
    packageDistributionImplementedByArdyn: false,
    persistenceImplementedByArdyn: false,
    backendRuntimeImplementedByArdyn: false,
    apiEndpointImplementedByArdyn: false,
    serverImplementedByArdyn: false,
    websocketHttpTransportImplementedByArdyn: false,
    fabricRuntimeImplementedByArdyn: false,
    encodedHandoffRuntimeImplementedByArdyn: false,
    codecImplemented: false,
    translatorRuntimeImplemented: false,
    commandExposureEnabled: false,
    commandRuntimeControlEnabled: false,
    runtimeExecutionEnabled: false,
    databaseStorageRuntimeWritesEnabled: false,
    secretsRuntimeIngestionEnabled: false,
    mcpToolExposureEnabled: false,
    taskExecutionEnabled: false,
    secureDropImplemented: false,
    st3ggVendored: false,
    serviceDiscoveryEnabled: false,
    scheduleEnforcementEnabled: false,
    backgroundPollingEnabled: false,
    filesystemScanningEnabled: false,
    processControlEnabled: false,
    uiFrontendBrowserRenderingImplemented: false,
    blockedCliBypassEnabled: false,
    rejectionReasons: accepted
      ? []
      : [
          {
            classification,
            rejected: true,
            runtimeAuthorized: false,
            authPermissionsRuntimeAuthorized: false,
            commandExposureAuthorized: false,
            reportRunsChecks: false
          }
        ],
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

export function createAuthPermissionsContractBoundaryMapForReview(input = {}) {
  const inputRecord =
    authPermissionsContractBoundaryMapInputRecord(input);
  const reviewedAt =
    authPermissionsContractBoundaryMapReviewedAt(inputRecord);
  const reviewedAtDefaulted = isReviewedAtDefaulted(inputRecord);
  const classification =
    authPermissionsContractBoundaryMapInputClassification(inputRecord);
  const accepted =
    classification ===
    VALID_AUTH_PERMISSIONS_CONTRACT_BOUNDARY_MAP_CLASSIFICATION;
  const authPermissionsContractBoundaryMap = accepted
    ? authPermissionsContractBoundaryMapState(reviewedAt)
    : null;

  return authPermissionsContractBoundaryMapResult({
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    accepted,
    authPermissionsContractBoundaryMap
  });
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

// ─── Phase 5.76B: Fabric Federation Reconciliation ───────────────────────────
// ponytail: side phase (precedent: 5.38A, 5.44A) — single-surface reconciliation,
// not a chain phase. The helper is small because federation is one surface, not
// 20 boundary families. Ceiling: if more surfaces need reconciliation, copy this
// pattern rather than generalizing.

export { isPlainObjectRecord, isUtcIsoTimestampWithMilliseconds, isReviewedAtDefaulted };
import { compareAscii, stableJsonValue, stableJsonStringify, dataProperty, REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE, APPROVAL_PREREQUISITE_READER_DEFAULT_REVIEWED_AT, APPROVAL_PREREQUISITE_SOURCE_PREFLIGHT_DEFAULT_REVIEWED_AT, reviewOnlyRuntimeEffectAllFalse, approvalEvaluatorCandidateNestedTrueClaim, REVIEW_ONLY_EVALUATOR_PREFLIGHT_PROTOTYPE_POLLUTION_PATH_FIELDS, REVIEW_ONLY_INSPECTION_HANDOFF_METADATA_BOUNDARY_GRANT_KEY_PATTERN, reviewOnlyInspectionHandoffMetadataBoundaryKeyTruePresent, reviewOnlyInspectionHandoffMetadataBoundaryRuntimeEffectAllFalse, REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_DIGEST_PATTERN, commandSurfaceShellBoundaryMapForbiddenBehavior, externalGatewayMatrixBoundaryMapForbiddenBehavior, secretsCredentialBoundaryMapForbiddenBehavior, maintenanceGovernanceBoundaryMapForbiddenBehavior, operationsReliabilityBoundaryMapForbiddenBehavior, testingFrameworksQualityGatesBoundaryMapForbiddenBehavior, agentModeProfileSkillhubCapabilityBoundaryMapForbiddenBehavior, infrastructureComplianceDataRetentionBoundaryMapForbiddenBehavior, availabilityRecoveryBoundaryMapForbiddenBehavior, errorTrackingLoggingAuditIntegrityBoundaryMapForbiddenBehavior, rateLimitingAbuseControlBoundaryMapForbiddenBehavior, securityRlsInputSanitizationBoundaryMapForbiddenBehavior, authPermissionsContractBoundaryMapForbiddenBehavior, databaseStorageContractBoundaryMapForbiddenBehavior, interAgentEncodedHandoffConformanceForbiddenBehavior, fabricAwareApiBackendContractBoundaryMapForbiddenBehavior, productionReadinessCoverageMatrixForbiddenBehavior, consumerContractGapIndexForbiddenBehavior, consumerContractReadinessMatrixForbiddenBehavior, targetConsumerPlanningMetadataForbiddenBehavior, REVIEW_ONLY_EVALUATOR_PREFLIGHT_REQUIRED_FALSE_FIELDS, NON_AUTHORIZING_EVALUATOR_DECISION_REQUIRED_FALSE_FIELDS, REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_DECISION_CANDIDATE_SUMMARY_FIELDS, REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_CLEANUP_EVIDENCE_FIELDS, REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_RUNTIME_EFFECT_FIELDS, REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_CLEANUP_EVIDENCE_FIELDS, REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_RUNTIME_EFFECT_FIELDS, approvalPrerequisiteSourceSelectionSignature, approvalPrerequisiteStableValue, approvalPrerequisiteBundleConsumptionAcceptedSummary, APPROVAL_PREREQUISITE_INTEGRATION_CLASSIFICATION_BY_BUNDLE, APPROVAL_PREREQUISITE_INTEGRATION_CLASSIFICATION_BY_CONSUMPTION, approvalPrerequisiteIntegrationReviewSummary, MALFORMED_HUMAN_TOOL_INSPECTION_DISPOSITION_CLASSIFICATION, hasOwn, MALFORMED_REVIEW_ONLY_DISPOSITION_AGGREGATION_CLASSIFICATION, MALFORMED_REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_CLASSIFICATION, MALFORMED_REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_CLASSIFICATION, REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_REVIEWER_ROUTING_FALSE_PATHS, REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_REVIEWER_ROUTING_NULL_PATHS, MALFORMED_REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_CLASSIFICATION, MALFORMED_REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_CLASSIFICATION, MALFORMED_REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_CLASSIFICATION, REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_EXTERNAL_SYSTEM_KEYS } from "./internal/review-shared.mjs";
export { CI_ENABLEMENT_BOUNDARY_MAP_KIND, CI_ENABLEMENT_BOUNDARY_MAP_SCHEMA, CI_ENABLEMENT_BOUNDARY_MAP_VERSION, CI_ENFORCEMENT_CONTRACT_BOUNDARY_MAP_KIND, CI_ENFORCEMENT_CONTRACT_BOUNDARY_MAP_SCHEMA, CI_ENFORCEMENT_CONTRACT_BOUNDARY_MAP_VERSION, CODE_MODE_ORCHESTRATION_BOUNDARY_MAP_KIND, CODE_MODE_ORCHESTRATION_BOUNDARY_MAP_SCHEMA, CODE_MODE_ORCHESTRATION_BOUNDARY_MAP_VERSION, EXTERNAL_REFERENCE_POLICY_BOUNDARY_MAP_KIND, EXTERNAL_REFERENCE_POLICY_BOUNDARY_MAP_SCHEMA, EXTERNAL_REFERENCE_POLICY_BOUNDARY_MAP_VERSION, FABRIC_FEDERATION_RECONCILIATION_KIND, FABRIC_FEDERATION_RECONCILIATION_SCHEMA, FABRIC_FEDERATION_RECONCILIATION_VERSION, REPORT_SCRIPT_COMPACTION_BOUNDARY_MAP_KIND, REPORT_SCRIPT_COMPACTION_BOUNDARY_MAP_SCHEMA, REPORT_SCRIPT_COMPACTION_BOUNDARY_MAP_VERSION, REPORT_TEST_COMPACTION_BOUNDARY_MAP_KIND, REPORT_TEST_COMPACTION_BOUNDARY_MAP_SCHEMA, REPORT_TEST_COMPACTION_BOUNDARY_MAP_VERSION, SOURCE_GUARD_HARDENING_BOUNDARY_MAP_KIND, SOURCE_GUARD_HARDENING_BOUNDARY_MAP_SCHEMA, SOURCE_GUARD_HARDENING_BOUNDARY_MAP_VERSION, VALID_CI_ENABLEMENT_BOUNDARY_MAP_CLASSIFICATION, VALID_CI_ENFORCEMENT_CONTRACT_BOUNDARY_MAP_CLASSIFICATION, VALID_CODE_MODE_ORCHESTRATION_BOUNDARY_MAP_CLASSIFICATION, VALID_EXTERNAL_REFERENCE_POLICY_BOUNDARY_MAP_CLASSIFICATION, VALID_FABRIC_FEDERATION_RECONCILIATION_CLASSIFICATION, VALID_REPORT_SCRIPT_COMPACTION_BOUNDARY_MAP_CLASSIFICATION, VALID_REPORT_TEST_COMPACTION_BOUNDARY_MAP_CLASSIFICATION, VALID_SOURCE_GUARD_HARDENING_BOUNDARY_MAP_CLASSIFICATION, createCiEnablementForReview, createCiEnforcementContractForReview, createCodeModeOrchestrationForReview, createExternalReferencePolicyForReview, createFabricFederationReconciliationForReview, createReportScriptCompactionForReview, createReportTestCompactionForReview, createSourceGuardHardeningForReview } from "./governance-reports.mjs";
export { CONSUMER_DISPLAY_ACCESSIBILITY_CONTRACT_MAP_KIND, CONSUMER_DISPLAY_ACCESSIBILITY_CONTRACT_MAP_SCHEMA, CONSUMER_DISPLAY_ACCESSIBILITY_CONTRACT_MAP_VERSION, CONSUMER_DISPLAY_FIXTURE_CONFORMANCE_HANDOFF_KIND, CONSUMER_DISPLAY_FIXTURE_CONFORMANCE_HANDOFF_SCHEMA, CONSUMER_DISPLAY_FIXTURE_CONFORMANCE_HANDOFF_VERSION, CONSUMER_DISPLAY_FIXTURE_EXAMPLE_PACK_KIND, CONSUMER_DISPLAY_FIXTURE_EXAMPLE_PACK_SCHEMA, CONSUMER_DISPLAY_FIXTURE_EXAMPLE_PACK_VERSION, CONSUMER_DISPLAY_FIXTURE_SCHEMA_BOUNDARY_KIND, CONSUMER_DISPLAY_FIXTURE_SCHEMA_BOUNDARY_SCHEMA, CONSUMER_DISPLAY_FIXTURE_SCHEMA_BOUNDARY_VERSION, CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_HANDOFF_KIND, CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_HANDOFF_SCHEMA, CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_HANDOFF_VERSION, CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_INTAKE_BOUNDARY_KIND, CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_INTAKE_BOUNDARY_SCHEMA, CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_INTAKE_BOUNDARY_VERSION, CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_PACKAGE_BOUNDARY_KIND, CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_PACKAGE_BOUNDARY_SCHEMA, CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_PACKAGE_BOUNDARY_VERSION, CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_REQUIREMENTS_KIND, CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_REQUIREMENTS_SCHEMA, CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_REQUIREMENTS_VERSION, CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_RESULT_SCHEMA_BOUNDARY_KIND, CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_RESULT_SCHEMA_BOUNDARY_SCHEMA, CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_RESULT_SCHEMA_BOUNDARY_VERSION, CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_TEST_PLAN_KIND, CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_TEST_PLAN_SCHEMA, CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_TEST_PLAN_VERSION, createConsumerDisplayAccessibilityContractMapForReview, createConsumerDisplayFixtureConformanceHandoffForReview, createConsumerDisplayFixtureExamplePackForReview, createConsumerDisplayFixtureSchemaBoundaryForReview, createConsumerOwnedDisplayConformanceResultHandoffForReview, createConsumerOwnedDisplayConformanceResultReviewIntakeBoundaryForReview, createConsumerOwnedDisplayConformanceResultReviewPackageBoundaryForReview, createConsumerOwnedDisplayConformanceRunnerRequirementsForReview, createConsumerOwnedDisplayConformanceRunnerResultSchemaBoundaryForReview, createConsumerOwnedDisplayConformanceRunnerTestPlanForReview } from "./consumer-display.mjs";
export { APPROVAL_EVALUATOR_CANDIDATE_INTAKE_CHECKPOINT_KIND, APPROVAL_EVALUATOR_CANDIDATE_INTAKE_CHECKPOINT_SCHEMA, APPROVAL_EVALUATOR_CANDIDATE_INTAKE_CHECKPOINT_VERSION, APPROVAL_PREREQUISITE_BUNDLE_CONSUMPTION_CHECKPOINT_KIND, APPROVAL_PREREQUISITE_BUNDLE_CONSUMPTION_CHECKPOINT_SCHEMA, APPROVAL_PREREQUISITE_BUNDLE_CONSUMPTION_CHECKPOINT_VERSION, APPROVAL_PREREQUISITE_INTEGRATION_CHECKPOINT_KIND, APPROVAL_PREREQUISITE_INTEGRATION_CHECKPOINT_SCHEMA, APPROVAL_PREREQUISITE_INTEGRATION_CHECKPOINT_VERSION, APPROVAL_PREREQUISITE_READER_KIND, APPROVAL_PREREQUISITE_READER_SCHEMA, APPROVAL_PREREQUISITE_READER_VERSION, APPROVAL_PREREQUISITE_SOURCE_BUNDLE_KIND, APPROVAL_PREREQUISITE_SOURCE_BUNDLE_SCHEMA, APPROVAL_PREREQUISITE_SOURCE_BUNDLE_VERSION, APPROVAL_PREREQUISITE_SOURCE_PREFLIGHT_KIND, APPROVAL_PREREQUISITE_SOURCE_PREFLIGHT_SCHEMA, APPROVAL_PREREQUISITE_SOURCE_PREFLIGHT_VERSION, APPROVAL_PREREQUISITE_SOURCE_SELECTION_KIND, APPROVAL_PREREQUISITE_SOURCE_SELECTION_SCHEMA, APPROVAL_PREREQUISITE_SOURCE_SELECTION_VERSION, CONSUMER_CONTRACT_GAP_INDEX_KIND, CONSUMER_CONTRACT_GAP_INDEX_SCHEMA, CONSUMER_CONTRACT_GAP_INDEX_VERSION, CONSUMER_CONTRACT_READINESS_MATRIX_KIND, CONSUMER_CONTRACT_READINESS_MATRIX_SCHEMA, CONSUMER_CONTRACT_READINESS_MATRIX_VERSION, HUMAN_TOOL_INSPECTION_DISPOSITION_BOUNDARY_KIND, HUMAN_TOOL_INSPECTION_DISPOSITION_BOUNDARY_SCHEMA, HUMAN_TOOL_INSPECTION_DISPOSITION_BOUNDARY_VERSION, NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_BOUNDARY_KIND, NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_BOUNDARY_SCHEMA, NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_BOUNDARY_VERSION, NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_ARTIFACT_KIND, NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_ARTIFACT_SCHEMA, NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_ARTIFACT_VERSION, PREREQUISITE_REVIEW_ARTIFACT_BOUNDARY_KIND, PREREQUISITE_REVIEW_ARTIFACT_BOUNDARY_SCHEMA, PREREQUISITE_REVIEW_ARTIFACT_BOUNDARY_VERSION, PREREQUISITE_REVIEW_ARTIFACT_EVALUATOR_INPUT_HANDOFF_KIND, PREREQUISITE_REVIEW_ARTIFACT_EVALUATOR_INPUT_HANDOFF_SCHEMA, PREREQUISITE_REVIEW_ARTIFACT_EVALUATOR_INPUT_HANDOFF_VERSION, REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_KIND, REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_SCHEMA, REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_VERSION, REVIEW_ONLY_CHECKPOINT_HANDOFF_LAYER_KIND, REVIEW_ONLY_CHECKPOINT_HANDOFF_LAYER_SCHEMA, REVIEW_ONLY_CHECKPOINT_HANDOFF_LAYER_VERSION, REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_KIND, REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_SCHEMA, REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_VERSION, REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_KIND, REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_SCHEMA, REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_VERSION, REVIEW_ONLY_DISPOSITION_AGGREGATION_CHECKPOINT_KIND, REVIEW_ONLY_DISPOSITION_AGGREGATION_CHECKPOINT_SCHEMA, REVIEW_ONLY_DISPOSITION_AGGREGATION_CHECKPOINT_VERSION, REVIEW_ONLY_EVALUATOR_PREFLIGHT_CHECKPOINT_KIND, REVIEW_ONLY_EVALUATOR_PREFLIGHT_CHECKPOINT_SCHEMA, REVIEW_ONLY_EVALUATOR_PREFLIGHT_CHECKPOINT_VERSION, REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_KIND, REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_SCHEMA, REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_VERSION, REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_KIND, REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_SCHEMA, REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_VERSION, REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_KIND, REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_SCHEMA, REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_VERSION, REVIEW_ONLY_INSPECTION_HANDOFF_CHECKPOINT_KIND, REVIEW_ONLY_INSPECTION_HANDOFF_CHECKPOINT_SCHEMA, REVIEW_ONLY_INSPECTION_HANDOFF_CHECKPOINT_VERSION, REVIEW_ONLY_INSPECTION_HANDOFF_METADATA_BOUNDARY_KIND, REVIEW_ONLY_INSPECTION_HANDOFF_METADATA_BOUNDARY_SCHEMA, REVIEW_ONLY_INSPECTION_HANDOFF_METADATA_BOUNDARY_VERSION, REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_KIND, REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_SCHEMA, REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_VERSION, REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_BOUNDARY_KIND, REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_BOUNDARY_SCHEMA, REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_BOUNDARY_VERSION, REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_KIND, REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_SCHEMA, REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_VERSION, REVIEW_ONLY_RUNTIME_APPROVAL_EVALUATOR_KIND, REVIEW_ONLY_RUNTIME_APPROVAL_EVALUATOR_SCHEMA, REVIEW_ONLY_RUNTIME_APPROVAL_EVALUATOR_VERSION, TARGET_CONSUMER_PLANNING_METADATA_KIND, TARGET_CONSUMER_PLANNING_METADATA_SCHEMA, TARGET_CONSUMER_PLANNING_METADATA_VERSION, bundleApprovalPrerequisiteSourcesForReview, consumeApprovalPrerequisiteBundleForReview, createApprovalEvaluatorCandidateIntakeCheckpointForReview, createConsumerContractGapIndexForReview, createConsumerContractReadinessMatrixForReview, createHumanToolInspectionDispositionBoundaryForReview, createNonAuthorizingEvaluatorDecisionCandidateBoundaryForReview, createNonAuthorizingEvaluatorDecisionCandidateInspectionArtifactForReview, createPrerequisiteReviewArtifactBoundaryForReview, createReviewArtifactEvaluatorInputHandoffForReview, createReviewOnlyAggregationInspectionHandoffForReview, createReviewOnlyCheckpointHandoffLayerForReview, createReviewOnlyConsolidationCheckpointHandoffForReview, createReviewOnlyConsolidationMetadataCheckpointForReview, createReviewOnlyDispositionAggregationCheckpointForReview, createReviewOnlyEvaluatorPreflightCheckpointForReview, createReviewOnlyHandoffDispositionInspectionCheckpointForReview, createReviewOnlyHandoffMetadataConsolidationLayerForReview, createReviewOnlyHandoffReadinessArtifactForReview, createReviewOnlyInspectionHandoffCheckpointForReview, createReviewOnlyInspectionHandoffMetadataBoundaryForReview, createReviewOnlyMetadataHandoffCheckpointForReview, createReviewOnlyReadinessHandoffDispositionBoundaryForReview, createReviewOnlyReadinessInspectionCheckpointForReview, createTargetConsumerPlanningMetadataForReview, evaluatePrerequisiteIntegrationCheckpointForReview, evaluateRuntimeApprovalPrerequisitesForReview, preflightApprovalPrerequisiteSourcesForReview, readApprovalPrerequisiteRecordsForReview, selectApprovalPrerequisiteSourcesForReview } from "./review-artifacts.mjs";
import { CONSUMER_CONTRACT_GAP_INDEX_UNSAFE_RUNTIME_TRUE_FIELDS } from "./review-artifacts.mjs";
export { AGENT_MODE_PROFILE_SKILLHUB_CAPABILITY_BOUNDARY_MAP_KIND, AGENT_MODE_PROFILE_SKILLHUB_CAPABILITY_BOUNDARY_MAP_SCHEMA, AGENT_MODE_PROFILE_SKILLHUB_CAPABILITY_BOUNDARY_MAP_VERSION, AVAILABILITY_RECOVERY_CONTRACT_BOUNDARY_MAP_KIND, AVAILABILITY_RECOVERY_CONTRACT_BOUNDARY_MAP_SCHEMA, AVAILABILITY_RECOVERY_CONTRACT_BOUNDARY_MAP_VERSION, COMMAND_SURFACE_SHELL_PRIMITIVE_CONTRACT_BOUNDARY_MAP_KIND, COMMAND_SURFACE_SHELL_PRIMITIVE_CONTRACT_BOUNDARY_MAP_SCHEMA, COMMAND_SURFACE_SHELL_PRIMITIVE_CONTRACT_BOUNDARY_MAP_VERSION, EMBEDDED_DB_QUERY_ENGINE_PRIMITIVE_CONTRACT_BOUNDARY_MAP_KIND, EMBEDDED_DB_QUERY_ENGINE_PRIMITIVE_CONTRACT_BOUNDARY_MAP_SCHEMA, EMBEDDED_DB_QUERY_ENGINE_PRIMITIVE_CONTRACT_BOUNDARY_MAP_VERSION, ERROR_TRACKING_LOGGING_AUDIT_INTEGRITY_CONTRACT_BOUNDARY_MAP_KIND, ERROR_TRACKING_LOGGING_AUDIT_INTEGRITY_CONTRACT_BOUNDARY_MAP_SCHEMA, ERROR_TRACKING_LOGGING_AUDIT_INTEGRITY_CONTRACT_BOUNDARY_MAP_VERSION, EXTERNAL_GATEWAY_MATRIX_TRANSPORT_CONTRACT_BOUNDARY_MAP_KIND, EXTERNAL_GATEWAY_MATRIX_TRANSPORT_CONTRACT_BOUNDARY_MAP_SCHEMA, EXTERNAL_GATEWAY_MATRIX_TRANSPORT_CONTRACT_BOUNDARY_MAP_VERSION, FABRIC_CORE_CONSUMER_INTEGRATION_READINESS_BOUNDARY_UPDATE_KIND, FABRIC_CORE_CONSUMER_INTEGRATION_READINESS_BOUNDARY_UPDATE_SCHEMA, FABRIC_CORE_CONSUMER_INTEGRATION_READINESS_BOUNDARY_UPDATE_VERSION, INFRASTRUCTURE_COMPLIANCE_DATA_RETENTION_CONTRACT_BOUNDARY_MAP_KIND, INFRASTRUCTURE_COMPLIANCE_DATA_RETENTION_CONTRACT_BOUNDARY_MAP_SCHEMA, INFRASTRUCTURE_COMPLIANCE_DATA_RETENTION_CONTRACT_BOUNDARY_MAP_VERSION, MAINTENANCE_GOVERNANCE_ADR_DEPENDENCY_POLICY_CONTRACT_BOUNDARY_MAP_KIND, MAINTENANCE_GOVERNANCE_ADR_DEPENDENCY_POLICY_CONTRACT_BOUNDARY_MAP_SCHEMA, MAINTENANCE_GOVERNANCE_ADR_DEPENDENCY_POLICY_CONTRACT_BOUNDARY_MAP_VERSION, OPERATIONS_RELIABILITY_CONTRACT_BOUNDARY_MAP_KIND, OPERATIONS_RELIABILITY_CONTRACT_BOUNDARY_MAP_SCHEMA, OPERATIONS_RELIABILITY_CONTRACT_BOUNDARY_MAP_VERSION, RATE_LIMITING_ABUSE_CONTROL_CONTRACT_BOUNDARY_MAP_KIND, RATE_LIMITING_ABUSE_CONTROL_CONTRACT_BOUNDARY_MAP_SCHEMA, RATE_LIMITING_ABUSE_CONTROL_CONTRACT_BOUNDARY_MAP_VERSION, SECRETS_MANAGEMENT_KEY_ROTATION_EXTERNAL_GATEWAY_CREDENTIAL_BOUNDARY_MAP_KIND, SECRETS_MANAGEMENT_KEY_ROTATION_EXTERNAL_GATEWAY_CREDENTIAL_BOUNDARY_MAP_SCHEMA, SECRETS_MANAGEMENT_KEY_ROTATION_EXTERNAL_GATEWAY_CREDENTIAL_BOUNDARY_MAP_VERSION, SECURITY_RLS_INPUT_SANITIZATION_CONTRACT_BOUNDARY_MAP_KIND, SECURITY_RLS_INPUT_SANITIZATION_CONTRACT_BOUNDARY_MAP_SCHEMA, SECURITY_RLS_INPUT_SANITIZATION_CONTRACT_BOUNDARY_MAP_VERSION, TESTING_FRAMEWORKS_QUALITY_GATES_CONTRACT_BOUNDARY_MAP_KIND, TESTING_FRAMEWORKS_QUALITY_GATES_CONTRACT_BOUNDARY_MAP_SCHEMA, TESTING_FRAMEWORKS_QUALITY_GATES_CONTRACT_BOUNDARY_MAP_VERSION, createAgentModeProfileSkillhubCapabilityBoundaryMapForReview, createAvailabilityRecoveryContractBoundaryMapForReview, createCommandSurfaceShellPrimitiveContractBoundaryMapForReview, createEmbeddedDbQueryEnginePrimitiveContractBoundaryMapForReview, createErrorTrackingLoggingAuditIntegrityContractBoundaryMapForReview, createExternalGatewayMatrixTransportContractBoundaryMapForReview, createFabricCoreConsumerIntegrationReadinessBoundaryUpdateForReview, createInfrastructureComplianceDataRetentionContractBoundaryMapForReview, createMaintenanceGovernanceAdrDependencyPolicyContractBoundaryMapForReview, createOperationsReliabilityContractBoundaryMapForReview, createRateLimitingAbuseControlContractBoundaryMapForReview, createSecretsManagementKeyRotationExternalGatewayCredentialBoundaryMapForReview, createSecurityRlsInputSanitizationContractBoundaryMapForReview, createTestingFrameworksQualityGatesContractBoundaryMapForReview } from "./boundary-maps/infrastructure.mjs";
export { JSONL_WHOLE_LINE_BUNDLE_BLANK_LINE_REJECTED, JSONL_WHOLE_LINE_BUNDLE_CRLF_REJECTED, JSONL_WHOLE_LINE_BUNDLE_MALFORMED_JSON_LINE, JSONL_WHOLE_LINE_BUNDLE_MISSING_FINAL_LF, JSONL_WHOLE_LINE_BUNDLE_PARTIAL_LINE_REJECTED, JSONL_WHOLE_LINE_BUNDLE_VALID, STDIO_FRAMING_REDACTION_CONTRACT_SCHEMA, STDIO_FRAMING_REDACTION_CONTRACT_VERSION, createStdioFramingRedactionContractForReview, formatJsonlWholeLinesForReview, formatStdioFramingRedactionContractJsonForReview, validateJsonlWholeLineBundle } from "./stdio-framing-redaction.mjs";
export { PRODUCTION_READINESS_COVERAGE_MATRIX_KIND, PRODUCTION_READINESS_COVERAGE_MATRIX_SCHEMA, PRODUCTION_READINESS_COVERAGE_MATRIX_VERSION, createProductionReadinessCoverageMatrixForReview } from "./boundary-maps/production-readiness-coverage.mjs";
export { FABRIC_AWARE_API_BACKEND_CONTRACT_BOUNDARY_MAP_KIND, FABRIC_AWARE_API_BACKEND_CONTRACT_BOUNDARY_MAP_SCHEMA, FABRIC_AWARE_API_BACKEND_CONTRACT_BOUNDARY_MAP_VERSION, createFabricAwareApiBackendContractBoundaryMapForReview } from "./boundary-maps/fabric-aware-api-backend.mjs";
export { INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_KIND, INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_SCHEMA, INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_VERSION, createInterAgentEncodedHandoffConformanceForReview } from "./boundary-maps/inter-agent-handoff-conformance.mjs";
export { DATABASE_STORAGE_CONTRACT_BOUNDARY_MAP_KIND, DATABASE_STORAGE_CONTRACT_BOUNDARY_MAP_SCHEMA, DATABASE_STORAGE_CONTRACT_BOUNDARY_MAP_VERSION, createDatabaseStorageContractBoundaryMapForReview } from "./boundary-maps/database-storage.mjs";
