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
export const FABRIC_AWARE_API_BACKEND_CONTRACT_BOUNDARY_MAP_SCHEMA =
  "ardyn.phase-5.59.fabric-aware-api-backend-contract-boundary-map-result";
export const FABRIC_AWARE_API_BACKEND_CONTRACT_BOUNDARY_MAP_VERSION = "0.1.0";
export const FABRIC_AWARE_API_BACKEND_CONTRACT_BOUNDARY_MAP_KIND =
  "fabric-aware-api-backend-contract-boundary-map";
export const INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_SCHEMA =
  "ardyn.phase-5.60.inter-agent-encoded-handoff-conformance-result";
export const INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_VERSION = "0.1.0";
export const INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_KIND =
  "inter-agent-encoded-handoff-conformance";
export const DATABASE_STORAGE_CONTRACT_BOUNDARY_MAP_SCHEMA =
  "ardyn.phase-5.61.database-storage-contract-boundary-map-result";
export const DATABASE_STORAGE_CONTRACT_BOUNDARY_MAP_VERSION = "0.1.0";
export const DATABASE_STORAGE_CONTRACT_BOUNDARY_MAP_KIND =
  "database-storage-contract-boundary-map";
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




















const FABRIC_AWARE_API_BACKEND_CONTRACT_BOUNDARY_MAP_STATE_SCHEMA =
  "ardyn.phase-5.59.fabric-aware-api-backend-contract-boundary-map-state";
const VALID_FABRIC_AWARE_API_BACKEND_CONTRACT_BOUNDARY_MAP_CLASSIFICATION =
  "valid_fabric_aware_api_backend_contract_boundary_map_runtime_still_blocked";
const MALFORMED_FABRIC_AWARE_API_BACKEND_CONTRACT_BOUNDARY_MAP_CLASSIFICATION =
  "malformed_fabric_aware_api_backend_contract_boundary_map_input_rejected";

const FABRIC_AWARE_API_BACKEND_CONTRACT_BOUNDARY_FAMILIES = Object.freeze([
  "api_contract",
  "backend_contract",
  "fabric_coordination",
  "consumer_boundary"
]);
const FABRIC_AWARE_API_BACKEND_CONTRACT_BOUNDARY_RELATED_REPOS = Object.freeze([
  "ardyn",
  "locus",
  "multiverse",
  "content-fabric",
  "repo-family"
]);
const FABRIC_AWARE_API_BACKEND_CONTRACT_BOUNDARY_CURRENT_STATUSES =
  Object.freeze(["metadata_only", "blocked", "future_contract_required"]);
const FABRIC_AWARE_API_BACKEND_CONTRACT_BOUNDARY_REQUIRED_FIELDS =
  Object.freeze([
    "boundaryId",
    "boundaryFamily",
    "relatedConsumerOrRepo",
    "currentStatus",
    "allowedCurrentBehavior",
    "forbiddenCurrentBehavior",
    "requiredFutureContractBeforeImplementation",
    "requiredFutureAuthorizationPhaseBeforeRuntime",
    "fabricRoleDescription",
    "secureDropRoleDescription",
    "explicitBlockedAuthorizationFlags",
    "unsafeBackendServerApiFabricBusBrokerTransportAdapterConnectorRegistryTaskImportExportPackagePersistenceRuntimeFlags",
    "nonAuthorizingProof"
  ]);
const FABRIC_AWARE_API_BACKEND_CONTRACT_BOUNDARY_UNSAFE_FIELDS = Object.freeze([
  "backendRuntimeEnabled",
  "backendRuntimeImplemented",
  "serverRuntimeEnabled",
  "serverImplemented",
  "endpointImplemented",
  "apiEndpointImplemented",
  "httpServerEnabled",
  "httpEndpointImplemented",
  "websocketServerEnabled",
  "websocketHttpTransportEnabled",
  "fabricRuntimeEnabled",
  "fabricRuntimeImplemented",
  "fabricBusEnabled",
  "fabricBrokerEnabled",
  "fabricTransportEnabled",
  "fabricAdapterEnabled",
  "busEnabled",
  "brokerEnabled",
  "transportEnabled",
  "adapterRuntimeEnabled",
  "connectorGrantEnabled",
  "connectorGrantProduced",
  "connectorIngestionEnabled",
  "registryConnectionEnabled",
  "liveRegistryConnectionEnabled",
  "taskExecutionEnabled",
  "mcpToolExposureEnabled",
  "importPathEnabled",
  "exportPathEnabled",
  "importExportPathImplemented",
  "packageDistributionEnabled",
  "packageWriterImplemented",
  "packageReaderImplemented",
  "packagePersistenceEnabled",
  "persistenceEnabled",
  "databaseStorageRuntimeWritesEnabled",
  "dbStorageWriteEnabled",
  "secretsAccessEnabled",
  "secretVaultEnvAccessEnabled",
  "runtimeExecutionEnabled",
  "commandExposureEnabled",
  "commandRuntimeControlEnabled",
  "evaluatorExecutionEnabled",
  "approvalDecisionProduced",
  "approvalGrantProduced",
  "serviceDiscoveryEnabled",
  "scheduleEnforcementEnabled",
  "backgroundPollingEnabled",
  "filesystemScanningEnabled",
  "processControlEnabled",
  "uiFrontendBrowserRenderingImplemented"
]);
const FABRIC_AWARE_API_BACKEND_CONTRACT_BOUNDARY_HIDDEN_FIELDS = Object.freeze([
  "serverEndpointUrl",
  "apiEndpointUrl",
  "backendServiceUrl",
  "fabricBusTopic",
  "fabricBrokerUrl",
  "fabricTransportUrl",
  "adapterEndpoint",
  "connectorId",
  "registryUrl",
  "taskExecutor",
  "importCommand",
  "exportCommand",
  "packagePath",
  "persistenceDsn",
  "runtimeCommand",
  "runtimeEntrypoint",
  "httpRoute",
  "websocketRoute",
  "mcpToolName"
]);
const FABRIC_AWARE_API_BACKEND_CONTRACT_BOUNDARY_SECURE_DROP_FIELDS =
  Object.freeze([
    "secureDropImplemented",
    "secureDropCryptoImplemented",
    "secureDropTransportImplemented",
    "secureDropStegoImplemented",
    "secureDropSendReceiveImplemented",
    "secureDropInboxPollingEnabled",
    "secureDropFileSelectionEnabled",
    "secureDropConnectorIngestionEnabled",
    "st3ggVendored"
  ]);

function fabricAwareApiBackendContractBoundaryMapInputRecord(input) {
  return isPlainObjectRecord(input) ? input : null;
}

function fabricAwareApiBackendContractBoundaryMapReviewedAt(inputRecord) {
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

function fabricAwareApiBackendContractBoundaryMapInputMalformed(inputRecord) {
  return (
    inputRecord === null ||
    (Object.prototype.hasOwnProperty.call(inputRecord, "reviewedAt") &&
      !isUtcIsoTimestampWithMilliseconds(inputRecord.reviewedAt)) ||
    (Object.prototype.hasOwnProperty.call(inputRecord, "boundaryEntries") &&
      !Array.isArray(inputRecord.boundaryEntries))
  );
}

function fabricAwareApiBackendContractBoundaryMapInputEntries(inputRecord) {
  return Array.isArray(inputRecord?.boundaryEntries)
    ? inputRecord.boundaryEntries
    : null;
}

function fabricAwareApiBackendContractBoundaryMapContainsTrue(value) {
  if (value === true) {
    return true;
  }

  if (Array.isArray(value)) {
    return value.some(fabricAwareApiBackendContractBoundaryMapContainsTrue);
  }

  if (isPlainObjectRecord(value)) {
    return Object.values(value).some(
      fabricAwareApiBackendContractBoundaryMapContainsTrue
    );
  }

  return false;
}

function fabricAwareApiBackendContractBoundaryMapFieldTruePresent(
  record,
  fields
) {
  return isPlainObjectRecord(record) && fields.some((field) => record[field] === true);
}

function fabricAwareApiBackendContractBoundaryMapFieldPresent(record, fields) {
  return (
    isPlainObjectRecord(record) &&
    fields.some((field) => Object.prototype.hasOwnProperty.call(record, field))
  );
}

function fabricAwareApiBackendContractBoundaryMapMissingRequiredField(entry) {
  if (!isPlainObjectRecord(entry)) {
    return true;
  }

  return FABRIC_AWARE_API_BACKEND_CONTRACT_BOUNDARY_REQUIRED_FIELDS.some(
    (field) => !Object.prototype.hasOwnProperty.call(entry, field)
  );
}

function fabricAwareApiBackendContractBoundaryMapEntryMalformed(entry) {
  return (
    fabricAwareApiBackendContractBoundaryMapMissingRequiredField(entry) ||
    typeof entry.boundaryId !== "string" ||
    entry.boundaryId.length === 0 ||
    !Array.isArray(entry.allowedCurrentBehavior) ||
    entry.allowedCurrentBehavior.length < 2 ||
    entry.allowedCurrentBehavior.some(
      (behavior) => typeof behavior !== "string" || behavior.length === 0
    ) ||
    !Array.isArray(entry.forbiddenCurrentBehavior) ||
    entry.forbiddenCurrentBehavior.length < 20 ||
    entry.forbiddenCurrentBehavior.some(
      (behavior) => typeof behavior !== "string" || behavior.length === 0
    ) ||
    typeof entry.requiredFutureContractBeforeImplementation !== "string" ||
    entry.requiredFutureContractBeforeImplementation.length === 0 ||
    typeof entry.requiredFutureAuthorizationPhaseBeforeRuntime !== "string" ||
    entry.requiredFutureAuthorizationPhaseBeforeRuntime.length === 0 ||
    typeof entry.fabricRoleDescription !== "string" ||
    entry.fabricRoleDescription.length === 0 ||
    typeof entry.secureDropRoleDescription !== "string" ||
    entry.secureDropRoleDescription.length === 0 ||
    !isPlainObjectRecord(entry.explicitBlockedAuthorizationFlags) ||
    !isPlainObjectRecord(
      entry
        .unsafeBackendServerApiFabricBusBrokerTransportAdapterConnectorRegistryTaskImportExportPackagePersistenceRuntimeFlags
    ) ||
    entry.nonAuthorizingProof !== true
  );
}

function fabricAwareApiBackendContractBoundaryMapContainsEntryIssue(
  entries,
  predicate
) {
  return entries !== null && entries.some((entry) => predicate(entry));
}

function fabricAwareApiBackendContractBoundaryMapAuthorizationFlagEnabled(entry) {
  return (
    fabricAwareApiBackendContractBoundaryMapContainsTrue(
      entry?.explicitBlockedAuthorizationFlags
    ) ||
    fabricAwareApiBackendContractBoundaryMapContainsTrue(entry?.authorizationFlags)
  );
}

function fabricAwareApiBackendContractBoundaryMapUnsafeFlagEnabled(entry) {
  return (
    fabricAwareApiBackendContractBoundaryMapContainsTrue(
      entry
        ?.unsafeBackendServerApiFabricBusBrokerTransportAdapterConnectorRegistryTaskImportExportPackagePersistenceRuntimeFlags
    ) ||
    fabricAwareApiBackendContractBoundaryMapFieldTruePresent(
      entry,
      FABRIC_AWARE_API_BACKEND_CONTRACT_BOUNDARY_UNSAFE_FIELDS
    )
  );
}

function fabricAwareApiBackendContractBoundaryMapCanonical(entries) {
  if (entries === null) {
    return true;
  }

  return (
    JSON.stringify(entries) ===
    JSON.stringify(fabricAwareApiBackendContractBoundaryMapEntries())
  );
}

function fabricAwareApiBackendContractBoundaryMapInputClassification(inputRecord) {
  if (fabricAwareApiBackendContractBoundaryMapInputMalformed(inputRecord)) {
    return MALFORMED_FABRIC_AWARE_API_BACKEND_CONTRACT_BOUNDARY_MAP_CLASSIFICATION;
  }

  const entries = fabricAwareApiBackendContractBoundaryMapInputEntries(inputRecord);

  if (
    fabricAwareApiBackendContractBoundaryMapContainsEntryIssue(
      entries,
      fabricAwareApiBackendContractBoundaryMapMissingRequiredField
    )
  ) {
    return "missing_required_fabric_aware_api_backend_contract_boundary_entry_rejected";
  }

  if (
    fabricAwareApiBackendContractBoundaryMapContainsEntryIssue(
      entries,
      (entry) =>
        !FABRIC_AWARE_API_BACKEND_CONTRACT_BOUNDARY_FAMILIES.includes(
          entry.boundaryFamily
        )
    )
  ) {
    return "unknown_boundary_family_fabric_aware_api_backend_contract_boundary_map_input_rejected";
  }

  if (
    fabricAwareApiBackendContractBoundaryMapContainsEntryIssue(
      entries,
      (entry) =>
        !FABRIC_AWARE_API_BACKEND_CONTRACT_BOUNDARY_RELATED_REPOS.includes(
          entry.relatedConsumerOrRepo
        )
    )
  ) {
    return "unknown_related_consumer_repo_fabric_aware_api_backend_contract_boundary_map_input_rejected";
  }

  if (
    fabricAwareApiBackendContractBoundaryMapContainsEntryIssue(
      entries,
      (entry) =>
        !FABRIC_AWARE_API_BACKEND_CONTRACT_BOUNDARY_CURRENT_STATUSES.includes(
          entry.currentStatus
        )
    )
  ) {
    return "unknown_current_status_fabric_aware_api_backend_contract_boundary_map_input_rejected";
  }

  if (
    fabricAwareApiBackendContractBoundaryMapContainsEntryIssue(
      entries,
      fabricAwareApiBackendContractBoundaryMapEntryMalformed
    )
  ) {
    return MALFORMED_FABRIC_AWARE_API_BACKEND_CONTRACT_BOUNDARY_MAP_CLASSIFICATION;
  }

  if (
    fabricAwareApiBackendContractBoundaryMapContainsEntryIssue(
      entries,
      fabricAwareApiBackendContractBoundaryMapAuthorizationFlagEnabled
    ) ||
    fabricAwareApiBackendContractBoundaryMapAuthorizationFlagEnabled(inputRecord)
  ) {
    return "authorization_flags_enabled_fabric_aware_api_backend_contract_boundary_map_input_rejected";
  }

  if (
    fabricAwareApiBackendContractBoundaryMapContainsEntryIssue(
      entries,
      (entry) =>
        fabricAwareApiBackendContractBoundaryMapFieldPresent(
          entry,
          FABRIC_AWARE_API_BACKEND_CONTRACT_BOUNDARY_HIDDEN_FIELDS
        )
    ) ||
    fabricAwareApiBackendContractBoundaryMapFieldPresent(
      inputRecord,
      FABRIC_AWARE_API_BACKEND_CONTRACT_BOUNDARY_HIDDEN_FIELDS
    )
  ) {
    return "hidden_backend_server_api_fabric_bus_broker_transport_adapter_connector_registry_task_import_export_package_persistence_runtime_semantics_fabric_aware_api_backend_contract_boundary_map_input_rejected";
  }

  if (
    fabricAwareApiBackendContractBoundaryMapContainsEntryIssue(
      entries,
      (entry) =>
        fabricAwareApiBackendContractBoundaryMapFieldTruePresent(
          entry,
          FABRIC_AWARE_API_BACKEND_CONTRACT_BOUNDARY_SECURE_DROP_FIELDS
        )
    ) ||
    fabricAwareApiBackendContractBoundaryMapFieldTruePresent(
      inputRecord,
      FABRIC_AWARE_API_BACKEND_CONTRACT_BOUNDARY_SECURE_DROP_FIELDS
    )
  ) {
    return "secure_drop_implementation_semantics_fabric_aware_api_backend_contract_boundary_map_input_rejected";
  }

  if (
    fabricAwareApiBackendContractBoundaryMapContainsEntryIssue(
      entries,
      (entry) =>
        fabricAwareApiBackendContractBoundaryMapFieldTruePresent(
          entry,
          FABRIC_AWARE_API_BACKEND_CONTRACT_BOUNDARY_UNSAFE_FIELDS
        )
    ) ||
    fabricAwareApiBackendContractBoundaryMapFieldTruePresent(
      inputRecord,
      FABRIC_AWARE_API_BACKEND_CONTRACT_BOUNDARY_UNSAFE_FIELDS
    )
  ) {
    return "backend_server_api_fabric_bus_broker_transport_adapter_connector_registry_task_import_export_package_persistence_runtime_implementation_semantics_fabric_aware_api_backend_contract_boundary_map_input_rejected";
  }

  if (
    fabricAwareApiBackendContractBoundaryMapContainsEntryIssue(
      entries,
      fabricAwareApiBackendContractBoundaryMapUnsafeFlagEnabled
    ) ||
    fabricAwareApiBackendContractBoundaryMapUnsafeFlagEnabled(inputRecord)
  ) {
    return "unsafe_backend_server_api_fabric_bus_broker_transport_adapter_connector_registry_task_import_export_package_persistence_runtime_flags_fabric_aware_api_backend_contract_boundary_map_input_rejected";
  }

  if (
    fabricAwareApiBackendContractBoundaryMapContainsEntryIssue(entries, (entry) =>
      fabricAwareApiBackendContractBoundaryMapContainsTrue(entry?.runtimeEffect)
    ) ||
    fabricAwareApiBackendContractBoundaryMapContainsTrue(inputRecord?.runtimeEffect)
  ) {
    return "nested_unsafe_flags_fabric_aware_api_backend_contract_boundary_map_input_rejected";
  }

  if (!fabricAwareApiBackendContractBoundaryMapCanonical(entries)) {
    return "noncanonical_fabric_aware_api_backend_contract_boundary_map_input_rejected";
  }

  return VALID_FABRIC_AWARE_API_BACKEND_CONTRACT_BOUNDARY_MAP_CLASSIFICATION;
}

function fabricAwareApiBackendContractBoundaryMapAuthorizationFlags() {
  return {
    backendRuntimeAuthorizationGranted: false,
    serverEndpointAuthorizationGranted: false,
    apiEndpointAuthorizationGranted: false,
    fabricRuntimeAuthorizationGranted: false,
    fabricBusBrokerAuthorizationGranted: false,
    transportAuthorizationGranted: false,
    adapterAuthorizationGranted: false,
    connectorGrantProduced: false,
    registryConnectionAuthorizationGranted: false,
    taskExecutionAuthorizationGranted: false,
    importExportAuthorizationGranted: false,
    packageDistributionAuthorizationGranted: false,
    persistenceAuthorizationGranted: false,
    databaseStorageAuthorizationGranted: false,
    secretsAuthorizationGranted: false,
    mcpToolExposureAuthorizationGranted: false,
    secureDropAuthorizationGranted: false,
    serviceDiscoveryAuthorizationGranted: false,
    scheduleEnforcementAuthorizationGranted: false,
    commandExposureAuthorizationGranted: false,
    evaluatorExecutionAuthorizationGranted: false,
    approvalDecisionAuthorizationGranted: false,
    approvalGrantProduced: false
  };
}

function fabricAwareApiBackendContractBoundaryMapUnsafeFlags() {
  return Object.fromEntries(
    FABRIC_AWARE_API_BACKEND_CONTRACT_BOUNDARY_UNSAFE_FIELDS.map((field) => [
      field,
      false
    ]).concat(
      FABRIC_AWARE_API_BACKEND_CONTRACT_BOUNDARY_SECURE_DROP_FIELDS.map(
        (field) => [field, false]
      )
    )
  );
}

function fabricAwareApiBackendContractBoundaryMapDefinitions() {
  return [
    {
      boundaryId: "phase5-59.ardyn.manifest-schema-validation.api-contract-boundary",
      boundaryFamily: "api_contract",
      relatedConsumerOrRepo: "ardyn",
      currentStatus: "metadata_only",
      allowedCurrentBehavior: [
        "Validate local manifest and schema metadata through existing review-only helpers.",
        "Describe future API contract expectations without serving requests."
      ],
      requiredFutureContractBeforeImplementation:
        "A separate executable API contract must define request lifecycle, auth, error shape, rate limits, storage posture, and runtime ownership.",
      requiredFutureAuthorizationPhaseBeforeRuntime:
        "Requires a future runtime, command exposure, server, and process-control authorization phase.",
      fabricRoleDescription:
        "Fabric may later carry manifest/schema contract envelope references, but Phase 5.59 records metadata only and starts no Fabric surface.",
      secureDropRoleDescription:
        "Not applicable; Secure Drop remains content-fabric-only future metadata."
    },
    {
      boundaryId: "phase5-59.ardyn.review-artifact.api-contract-boundary",
      boundaryFamily: "api_contract",
      relatedConsumerOrRepo: "ardyn",
      currentStatus: "metadata_only",
      allowedCurrentBehavior: [
        "Describe review artifact request/response shapes as static metadata.",
        "Keep review artifact creation local and non-authorizing."
      ],
      requiredFutureContractBeforeImplementation:
        "A future API surface must define artifact read/write authority, caller identity, retention, and non-repudiation before implementation.",
      requiredFutureAuthorizationPhaseBeforeRuntime:
        "Requires future API, storage, audit, auth, and approval-boundary authorization.",
      fabricRoleDescription:
        "Fabric may later envelope review artifact references for cross-repo coordination, but this phase defines no bus, broker, or transport.",
      secureDropRoleDescription:
        "Not applicable; Secure Drop remains content-fabric-only future metadata."
    },
    {
      boundaryId: "phase5-59.ardyn.approval-prerequisite.backend-contract-boundary",
      boundaryFamily: "backend_contract",
      relatedConsumerOrRepo: "ardyn",
      currentStatus: "metadata_only",
      allowedCurrentBehavior: [
        "Record approval prerequisite metadata and fail-closed planning state.",
        "Keep evaluator, grant, and routing semantics non-authorizing."
      ],
      requiredFutureContractBeforeImplementation:
        "A future backend contract must define evaluator isolation, reviewer routing, grant storage, and revocation before any runtime path exists.",
      requiredFutureAuthorizationPhaseBeforeRuntime:
        "Requires future evaluator, approval, storage, command, and runtime authorization.",
      fabricRoleDescription:
        "Fabric may later coordinate approval prerequisite envelope metadata across repos, but Phase 5.59 performs no routing.",
      secureDropRoleDescription:
        "Not applicable; Secure Drop remains content-fabric-only future metadata."
    },
    {
      boundaryId: "phase5-59.ardyn.display-conformance.consumer-boundary",
      boundaryFamily: "consumer_boundary",
      relatedConsumerOrRepo: "ardyn",
      currentStatus: "metadata_only",
      allowedCurrentBehavior: [
        "Reference Phase 5.50 through Phase 5.58 display/conformance metadata.",
        "Describe consumer display handoff expectations without import/export commands."
      ],
      requiredFutureContractBeforeImplementation:
        "Future consumer-owned runners and result package handling require separate executable contracts outside this phase.",
      requiredFutureAuthorizationPhaseBeforeRuntime:
        "Requires future package, runner, result, and consumer-side authorization before any executable handoff.",
      fabricRoleDescription:
        "Fabric may later envelope display conformance package references, but this phase only maps review package boundary metadata.",
      secureDropRoleDescription:
        "Only placeholder Secure Drop display metadata may be referenced; implementation remains content-fabric-owned."
    },
    {
      boundaryId: "phase5-59.ardyn.future-api-surface.api-contract-boundary",
      boundaryFamily: "api_contract",
      relatedConsumerOrRepo: "ardyn",
      currentStatus: "future_contract_required",
      allowedCurrentBehavior: [
        "Name future API surface boundaries as blocked planning metadata.",
        "Require explicit authorization before endpoint implementation."
      ],
      requiredFutureContractBeforeImplementation:
        "A complete future API contract must specify routes, schemas, auth, storage, observability, limits, and rollback behavior.",
      requiredFutureAuthorizationPhaseBeforeRuntime:
        "Requires future API/backend runtime authorization and command exposure approval.",
      fabricRoleDescription:
        "Fabric may later carry API envelope references, but Phase 5.59 does not define an HTTP API, websocket/http transport, or Fabric adapter.",
      secureDropRoleDescription:
        "No Secure Drop endpoint is defined; future Secure Drop APIs remain content-fabric-owned."
    },
    {
      boundaryId: "phase5-59.ardyn.future-backend-service.backend-contract-boundary",
      boundaryFamily: "backend_contract",
      relatedConsumerOrRepo: "ardyn",
      currentStatus: "future_contract_required",
      allowedCurrentBehavior: [
        "Name future backend service boundaries as blocked planning metadata.",
        "Require explicit authorization before service or worker implementation."
      ],
      requiredFutureContractBeforeImplementation:
        "A complete backend service contract must define process ownership, lifecycle, persistence, queueing, secrets, discovery, and failure modes.",
      requiredFutureAuthorizationPhaseBeforeRuntime:
        "Requires future backend runtime, process control, persistence, secrets, and observability authorization.",
      fabricRoleDescription:
        "Fabric may later coordinate backend envelope contracts, but Phase 5.59 creates no service, broker, scheduler, or runtime bus.",
      secureDropRoleDescription:
        "No Secure Drop backend is defined; future Secure Drop services remain content-fabric-owned."
    },
    {
      boundaryId: "phase5-59.locus.display-status.fabric-coordination-boundary",
      boundaryFamily: "fabric_coordination",
      relatedConsumerOrRepo: "locus",
      currentStatus: "metadata_only",
      allowedCurrentBehavior: [
        "Describe Ardyn-to-Locus display/status coordination as static metadata.",
        "Keep Locus a target consumer with no repo modification."
      ],
      requiredFutureContractBeforeImplementation:
        "A future Locus-owned display/status contract must define import ownership, validation, accessibility, and no-hidden-action semantics.",
      requiredFutureAuthorizationPhaseBeforeRuntime:
        "Requires future Locus consumer integration authorization and Ardyn runtime authorization before any live coordination.",
      fabricRoleDescription:
        "Fabric is a future coordination envelope between Ardyn and Locus, not a bus, broker, transport, registry, or adapter in this phase.",
      secureDropRoleDescription:
        "Not applicable except for Locus placeholder display metadata; Secure Drop implementation remains content-fabric-owned."
    },
    {
      boundaryId: "phase5-59.locus.future-control-surface.fabric-coordination-boundary",
      boundaryFamily: "fabric_coordination",
      relatedConsumerOrRepo: "locus",
      currentStatus: "blocked",
      allowedCurrentBehavior: [
        "Name future Locus control-surface contracts as blocked metadata.",
        "Keep all command and interactive control semantics forbidden."
      ],
      requiredFutureContractBeforeImplementation:
        "A future control-surface contract must define capability authority, reviewer approval, runtime gating, and explicit user action semantics.",
      requiredFutureAuthorizationPhaseBeforeRuntime:
        "Requires future control-surface, command exposure, runtime, evaluator, and approval authorization.",
      fabricRoleDescription:
        "Fabric may later envelope control-surface contract state, but Phase 5.59 grants no control path.",
      secureDropRoleDescription:
        "No Secure Drop control action is defined; Secure Drop remains content-fabric-owned."
    },
    {
      boundaryId: "phase5-59.multiverse.world-project-orchestration.fabric-coordination-boundary",
      boundaryFamily: "fabric_coordination",
      relatedConsumerOrRepo: "multiverse",
      currentStatus: "metadata_only",
      allowedCurrentBehavior: [
        "Describe Multiverse world/project orchestration status as metadata.",
        "Keep orchestration, task execution, and scheduling blocked."
      ],
      requiredFutureContractBeforeImplementation:
        "A future Multiverse-owned orchestration contract must define project state import, task authority, registry ownership, and runtime boundaries.",
      requiredFutureAuthorizationPhaseBeforeRuntime:
        "Requires future Multiverse integration, registry, task, schedule, and runtime authorization.",
      fabricRoleDescription:
        "Fabric may later coordinate orchestration envelopes across repos, but Phase 5.59 performs no orchestration or task execution.",
      secureDropRoleDescription:
        "Not applicable; Secure Drop remains content-fabric-only future metadata."
    },
    {
      boundaryId: "phase5-59.multiverse.citizen-adapter-candidate.fabric-coordination-boundary",
      boundaryFamily: "fabric_coordination",
      relatedConsumerOrRepo: "multiverse",
      currentStatus: "metadata_only",
      allowedCurrentBehavior: [
        "Describe citizen/adapter candidates as inert metadata.",
        "Keep adapters, connectors, and registry discovery blocked."
      ],
      requiredFutureContractBeforeImplementation:
        "A future adapter-candidate contract must define adapter lifecycle, connector grants, registry semantics, and revocation before use.",
      requiredFutureAuthorizationPhaseBeforeRuntime:
        "Requires future adapter, connector, registry, task, and runtime authorization.",
      fabricRoleDescription:
        "Fabric may later envelope candidate metadata, but Phase 5.59 creates no adapter runtime or connector discovery.",
      secureDropRoleDescription:
        "Not applicable; Secure Drop remains content-fabric-only future metadata."
    },
    {
      boundaryId: "phase5-59.content-fabric.future-secure-drop-reference.fabric-coordination-boundary",
      boundaryFamily: "fabric_coordination",
      relatedConsumerOrRepo: "content-fabric",
      currentStatus: "future_contract_required",
      allowedCurrentBehavior: [
        "Reference Secure Drop only as future content-fabric-owned metadata.",
        "Keep Ardyn from implementing Secure Drop crypto, transport, inbox, file, connector, or secret behavior."
      ],
      requiredFutureContractBeforeImplementation:
        "A future content-fabric-owned Secure Drop contract must define canonical ownership, crypto, transport, inbox, file, connector, and secret boundaries.",
      requiredFutureAuthorizationPhaseBeforeRuntime:
        "Requires explicit content-fabric Secure Drop authorization before any implementation or Ardyn reference can become executable.",
      fabricRoleDescription:
        "Fabric may later envelope Secure Drop references across repos, but Phase 5.59 starts no Fabric transport or content-fabric runtime behavior.",
      secureDropRoleDescription:
        "content-fabric is the only future canonical Secure Drop owner; Ardyn records references only as non-authorizing metadata."
    },
    {
      boundaryId: "phase5-59.repo-family.coordination-envelope.fabric-coordination-boundary",
      boundaryFamily: "fabric_coordination",
      relatedConsumerOrRepo: "repo-family",
      currentStatus: "metadata_only",
      allowedCurrentBehavior: [
        "Describe the Ardyn/Locus/Multiverse/content-fabric family coordination envelope as metadata.",
        "Keep every cross-repo coordination path review-only and non-executing."
      ],
      requiredFutureContractBeforeImplementation:
        "A future repo-family coordination contract must define envelope schema, ownership, versioning, import/export rules, authorization, and failure handling.",
      requiredFutureAuthorizationPhaseBeforeRuntime:
        "Requires future cross-repo Fabric, import/export, package, registry, task, and runtime authorization.",
      fabricRoleDescription:
        "Fabric is represented as a future cross-repo coordination contract/envelope layer only, not a bus, service, broker, transport, adapter, connector, registry, scheduler, importer, exporter, package distributor, or task executor.",
      secureDropRoleDescription:
        "Secure Drop references in the family envelope remain content-fabric-owned future metadata only."
    }
  ];
}

function fabricAwareApiBackendContractBoundaryMapEntry(definition) {
  return {
    ...definition,
    forbiddenCurrentBehavior:
      fabricAwareApiBackendContractBoundaryMapForbiddenBehavior(),
    productionReadinessAreaReference: {
      phase: "5.48",
      areaNumber: 2,
      areaName: "API & Backend Logic",
      sourceFixture:
        "tests/fixtures/host-policy/phase5-48/production-readiness-coverage-matrix.json",
      sourceStatus: "deferred",
      representedByPhase559: true,
      authorizesRuntime: false
    },
    phase558ReviewPackageBoundaryReference: {
      phase: "5.58",
      sourceFixture:
        "tests/fixtures/host-policy/phase5-58/consumer-owned-display-conformance-result-review-package-boundary.json",
      displayConformanceChainReferenced: true,
      importsPackages: false,
      exportsPackages: false,
      authorizesRuntime: false
    },
    fabricBoundaryMetadataOnly: true,
    apiBackendBoundaryMetadataOnly: true,
    locusAndMultiverseConsumerTargetsOnly:
      definition.relatedConsumerOrRepo === "locus" ||
      definition.relatedConsumerOrRepo === "multiverse"
        ? true
        : false,
    contentFabricCanonicalSecureDropOwnerOnly:
      definition.relatedConsumerOrRepo === "content-fabric" ? true : false,
    explicitBlockedAuthorizationFlags:
      fabricAwareApiBackendContractBoundaryMapAuthorizationFlags(),
    unsafeBackendServerApiFabricBusBrokerTransportAdapterConnectorRegistryTaskImportExportPackagePersistenceRuntimeFlags:
      fabricAwareApiBackendContractBoundaryMapUnsafeFlags(),
    nonAuthorizingProof: true,
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

function fabricAwareApiBackendContractBoundaryMapEntries() {
  return fabricAwareApiBackendContractBoundaryMapDefinitions().map(
    fabricAwareApiBackendContractBoundaryMapEntry
  );
}

function fabricAwareApiBackendContractBoundaryMapSummary(entries) {
  const countByFamily = Object.fromEntries(
    FABRIC_AWARE_API_BACKEND_CONTRACT_BOUNDARY_FAMILIES.map((family) => [
      family,
      entries.filter((entry) => entry.boundaryFamily === family).length
    ])
  );
  const countByRepo = Object.fromEntries(
    FABRIC_AWARE_API_BACKEND_CONTRACT_BOUNDARY_RELATED_REPOS.map((repo) => [
      repo,
      entries.filter((entry) => entry.relatedConsumerOrRepo === repo).length
    ])
  );

  return {
    boundaryMapKind: FABRIC_AWARE_API_BACKEND_CONTRACT_BOUNDARY_MAP_KIND,
    boundaryEntryCount: entries.length,
    boundaryIds: entries.map((entry) => entry.boundaryId),
    boundaryFamilies: [...FABRIC_AWARE_API_BACKEND_CONTRACT_BOUNDARY_FAMILIES],
    relatedConsumerOrRepoValues: [
      ...FABRIC_AWARE_API_BACKEND_CONTRACT_BOUNDARY_RELATED_REPOS
    ],
    currentStatusValues: [
      ...FABRIC_AWARE_API_BACKEND_CONTRACT_BOUNDARY_CURRENT_STATUSES
    ],
    countByFamily,
    countByRepo,
    phase548ApiBackendCoverageItemRepresented: true,
    phase558DisplayConformanceReviewPackageBoundaryReferenced: true,
    fabricFutureCoordinationContractEnvelopeOnly: true,
    fabricRuntimeImplementedByArdyn: false,
    fabricBusBrokerTransportImplementedByArdyn: false,
    backendRuntimeImplementedByArdyn: false,
    apiEndpointImplementedByArdyn: false,
    serverImplementedByArdyn: false,
    websocketHttpTransportImplementedByArdyn: false,
    contentFabricCanonicalSecureDropOwnerOnly: true,
    locusAndMultiverseConsumerTargetsOnly: true,
    allBlockedAuthorizationFlagsFalse: true,
    allUnsafeBackendServerApiFabricBusBrokerTransportAdapterConnectorRegistryTaskImportExportPackagePersistenceRuntimeFlagsFalse:
      true,
    allRuntimeEffectsFalse: true,
    allEntriesNonAuthorizing: true
  };
}

function fabricAwareApiBackendContractBoundaryMapValidationRules() {
  return {
    missingRequiredFieldsFailClosed: true,
    unknownBoundaryFamiliesFailClosed: true,
    unknownRelatedConsumerReposFailClosed: true,
    unknownCurrentStatusesFailClosed: true,
    enabledAuthorizationFlagsFailClosed: true,
    unsafeBackendServerApiFabricBusBrokerTransportAdapterConnectorRegistryTaskImportExportPackagePersistenceRuntimeFlagsFailClosed:
      true,
    nestedUnsafeFlagsFailClosed: true,
    hiddenBackendServerApiFabricBusBrokerTransportAdapterConnectorRegistryTaskImportExportPackagePersistenceRuntimeSemanticsFailClosed:
      true,
    secureDropImplementationSemanticsFailClosed: true,
    noncanonicalBoundaryEntriesFailClosed: true,
    validationImplementsBackendServer: false,
    validationImplementsApiEndpoint: false,
    validationImplementsFabricRuntime: false,
    validationImplementsBusBrokerTransport: false,
    validationImplementsAdapterRuntime: false,
    validationImplementsConnectorGrant: false,
    validationConnectsRegistry: false,
    validationExecutesTasks: false,
    validationImplementsImportExport: false,
    validationImplementsPackageDistribution: false,
    validationImplementsPersistence: false,
    validationRunsRuntime: false
  };
}

function fabricAwareApiBackendContractBoundaryMapGaps() {
  return [
    "No backend server, API endpoint, request lifecycle, auth middleware, live command endpoint, or process-owning service exists in Ardyn.",
    "Fabric is represented only as future cross-repo coordination contract/envelope metadata; no bus, broker, transport, adapter, connector, registry, scheduler, importer, exporter, package distributor, or task executor exists.",
    "Locus and Multiverse remain target consumers only; no consumer repo integration, control surface, orchestration, adapter runtime, or live status path exists.",
    "content-fabric remains the future canonical Secure Drop owner; Ardyn has no Secure Drop crypto, transport, stego, send/receive, inbox polling, file selection, connector ingestion, secret/vault/env access, or ST3GG vendoring.",
    "No DB/storage persistence, secrets access, service discovery, schedule enforcement, filesystem/process control, MCP tool exposure, evaluator execution, approval grant, or UI/browser behavior is authorized."
  ];
}

function fabricAwareApiBackendContractBoundaryMapState(reviewedAt) {
  const boundaryEntries = fabricAwareApiBackendContractBoundaryMapEntries();

  return {
    schema: FABRIC_AWARE_API_BACKEND_CONTRACT_BOUNDARY_MAP_STATE_SCHEMA,
    schemaVersion: FABRIC_AWARE_API_BACKEND_CONTRACT_BOUNDARY_MAP_VERSION,
    stateKind: FABRIC_AWARE_API_BACKEND_CONTRACT_BOUNDARY_MAP_KIND,
    stateMode: "review-only",
    reviewedAt,
    sourcePhaseContext: {
      phase548ProductionReadinessCoverageMatrix:
        "tests/fixtures/host-policy/phase5-48/production-readiness-coverage-matrix.json",
      phase548ApiBackendLogicAreaNumber: 2,
      phase548ApiBackendLogicStatus: "deferred",
      phase558ReviewPackageBoundary:
        "tests/fixtures/host-policy/phase5-58/consumer-owned-display-conformance-result-review-package-boundary.json",
      fabricDesignRepresentedAsFutureContractEnvelopeOnly: true,
      secureDropCanonicalOwner: "content-fabric",
      runtimeStillBlocked: true
    },
    boundaryEntries,
    boundaryMapSummary:
      fabricAwareApiBackendContractBoundaryMapSummary(boundaryEntries),
    invalidBoundaryCasePolicy:
      fabricAwareApiBackendContractBoundaryMapValidationRules(),
    topApiBackendFabricContractGaps:
      fabricAwareApiBackendContractBoundaryMapGaps(),
    recommendedNextPhase:
      "phase-5.60-review-only-database-storage-contract-boundary-map",
    fabricAwareApiBackendContractBoundaryMapOnly: true,
    reviewOnly: true,
    metadataOnly: true,
    authoritative: false,
    nonAuthorizingProof: true,
    backendRuntimeImplementedByArdyn: false,
    serverImplementedByArdyn: false,
    apiEndpointImplementedByArdyn: false,
    endpointImplementedByArdyn: false,
    httpServerImplementedByArdyn: false,
    websocketHttpTransportImplementedByArdyn: false,
    fabricRuntimeImplementedByArdyn: false,
    fabricBusBrokerTransportImplementedByArdyn: false,
    adapterRuntimeImplementedByArdyn: false,
    connectorGrantProduced: false,
    registryConnectionImplementedByArdyn: false,
    liveRegistryConnectionEnabled: false,
    taskExecutionImplementedByArdyn: false,
    taskExecutionEnabled: false,
    importExportPathImplementedByArdyn: false,
    packageDistributionImplementedByArdyn: false,
    packageWriterImplementedByArdyn: false,
    packageReaderImplementedByArdyn: false,
    packagePersistenceImplementedByArdyn: false,
    persistenceImplementedByArdyn: false,
    resultCollectorImplementedByArdyn: false,
    resultValidatorImplementedByArdyn: false,
    reviewRouterImplementedByArdyn: false,
    evaluatorImplementedByArdyn: false,
    evaluatorExecutionPerformed: false,
    approvalPathImplementedByArdyn: false,
    approvalDecisionProducedByArdyn: false,
    approvalGrantProducedByArdyn: false,
    commandExposureEnabled: false,
    commandRuntimeControlEnabled: false,
    runtimeExecutionEnabled: false,
    databaseStorageRuntimeWritesEnabled: false,
    secretsRuntimeIngestionEnabled: false,
    mcpToolExposureEnabled: false,
    secureDropImplemented: false,
    secureDropCryptoImplemented: false,
    secureDropTransportImplemented: false,
    secureDropStegoImplemented: false,
    secureDropSendReceiveImplemented: false,
    secureDropInboxPollingEnabled: false,
    fileSelectionEnabled: false,
    connectorIngestionAdded: false,
    secretVaultEnvAccessEnabled: false,
    st3ggVendored: false,
    serviceDiscoveryEnabled: false,
    scheduleEnforcementEnabled: false,
    backgroundPollingEnabled: false,
    filesystemScanningEnabled: false,
    processControlEnabled: false,
    externalLookupsEnabled: false,
    uiFrontendBrowserRenderingImplemented: false,
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

function fabricAwareApiBackendContractBoundaryMapResult({
  reviewedAt,
  reviewedAtDefaulted,
  classification,
  accepted,
  fabricAwareApiBackendContractBoundaryMap
}) {
  return {
    schema: FABRIC_AWARE_API_BACKEND_CONTRACT_BOUNDARY_MAP_SCHEMA,
    schemaVersion: FABRIC_AWARE_API_BACKEND_CONTRACT_BOUNDARY_MAP_VERSION,
    fabricAwareApiBackendContractBoundaryMapKind:
      FABRIC_AWARE_API_BACKEND_CONTRACT_BOUNDARY_MAP_KIND,
    fabricAwareApiBackendContractBoundaryMapMode: "review-only",
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    fabricAwareApiBackendContractBoundaryMapProduced: accepted,
    fabricAwareApiBackendContractBoundaryMap,
    boundaryMapSummary: accepted
      ? fabricAwareApiBackendContractBoundaryMap.boundaryMapSummary
      : null,
    boundaryEntries: accepted
      ? fabricAwareApiBackendContractBoundaryMap.boundaryEntries
      : [],
    invalidBoundaryCasePolicy: accepted
      ? fabricAwareApiBackendContractBoundaryMap.invalidBoundaryCasePolicy
      : fabricAwareApiBackendContractBoundaryMapValidationRules(),
    topApiBackendFabricContractGaps: accepted
      ? fabricAwareApiBackendContractBoundaryMap.topApiBackendFabricContractGaps
      : [],
    recommendedNextPhase: accepted
      ? fabricAwareApiBackendContractBoundaryMap.recommendedNextPhase
      : null,
    fabricAwareApiBackendContractBoundaryMapOnly: true,
    reviewOnly: true,
    metadataOnly: true,
    authoritative: false,
    nonAuthorizingProof: true,
    backendRuntimeImplementedByArdyn: false,
    serverImplementedByArdyn: false,
    apiEndpointImplementedByArdyn: false,
    endpointImplementedByArdyn: false,
    httpServerImplementedByArdyn: false,
    websocketHttpTransportImplementedByArdyn: false,
    fabricRuntimeImplementedByArdyn: false,
    fabricBusBrokerTransportImplementedByArdyn: false,
    adapterRuntimeImplementedByArdyn: false,
    connectorGrantProduced: false,
    registryConnectionImplementedByArdyn: false,
    liveRegistryConnectionEnabled: false,
    taskExecutionImplementedByArdyn: false,
    taskExecutionEnabled: false,
    importExportPathImplementedByArdyn: false,
    packageDistributionImplementedByArdyn: false,
    packageWriterImplementedByArdyn: false,
    packageReaderImplementedByArdyn: false,
    packagePersistenceImplementedByArdyn: false,
    persistenceImplementedByArdyn: false,
    resultCollectorImplementedByArdyn: false,
    resultValidatorImplementedByArdyn: false,
    reviewRouterImplementedByArdyn: false,
    evaluatorImplementedByArdyn: false,
    evaluatorExecutionPerformed: false,
    approvalPathImplementedByArdyn: false,
    approvalDecisionProducedByArdyn: false,
    approvalGrantProducedByArdyn: false,
    commandExposureEnabled: false,
    commandRuntimeControlEnabled: false,
    runtimeExecutionEnabled: false,
    databaseStorageRuntimeWritesEnabled: false,
    secretsRuntimeIngestionEnabled: false,
    mcpToolExposureEnabled: false,
    secureDropImplemented: false,
    secureDropCryptoImplemented: false,
    secureDropTransportImplemented: false,
    secureDropStegoImplemented: false,
    secureDropSendReceiveImplemented: false,
    secureDropInboxPollingEnabled: false,
    fileSelectionEnabled: false,
    connectorIngestionAdded: false,
    secretVaultEnvAccessEnabled: false,
    st3ggVendored: false,
    serviceDiscoveryEnabled: false,
    scheduleEnforcementEnabled: false,
    backgroundPollingEnabled: false,
    filesystemScanningEnabled: false,
    processControlEnabled: false,
    externalLookupsEnabled: false,
    uiFrontendBrowserRenderingImplemented: false,
    rejectionReasons: accepted
      ? []
      : [
          {
            classification,
            rejected: true,
            runtimeAuthorized: false,
            fabricRuntimeAuthorized: false,
            apiBackendRuntimeAuthorized: false
          }
        ],
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

export function createFabricAwareApiBackendContractBoundaryMapForReview(
  input = {}
) {
  const inputRecord =
    fabricAwareApiBackendContractBoundaryMapInputRecord(input);
  const reviewedAt =
    fabricAwareApiBackendContractBoundaryMapReviewedAt(inputRecord);
  const reviewedAtDefaulted = isReviewedAtDefaulted(inputRecord);
  const classification =
    fabricAwareApiBackendContractBoundaryMapInputClassification(inputRecord);
  const accepted =
    classification ===
    VALID_FABRIC_AWARE_API_BACKEND_CONTRACT_BOUNDARY_MAP_CLASSIFICATION;
  const fabricAwareApiBackendContractBoundaryMap = accepted
    ? fabricAwareApiBackendContractBoundaryMapState(reviewedAt)
    : null;

  return fabricAwareApiBackendContractBoundaryMapResult({
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    accepted,
    fabricAwareApiBackendContractBoundaryMap
  });
}

const INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_STATE_SCHEMA =
  "ardyn.phase-5.60.inter-agent-encoded-handoff-conformance-state";
const VALID_INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_CLASSIFICATION =
  "valid_inter_agent_encoded_handoff_conformance_runtime_still_blocked";
const MALFORMED_INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_CLASSIFICATION =
  "malformed_inter_agent_encoded_handoff_conformance_input_rejected";

const INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_FAMILIES = Object.freeze([
  "subagent_encoded_handoff",
  "locus_harness_bridge",
  "fabric_coordination_envelope",
  "operator_translation_bridge",
  "handoff_audit_visibility",
  "protocol_reference_layer"
]);
const INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_ACTORS = Object.freeze([
  "ardyn",
  "ardyn-subagent",
  "locus",
  "external-harness",
  "multiverse",
  "content-fabric"
]);
const INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_STATUSES = Object.freeze([
  "metadata_only",
  "blocked",
  "future_contract_required"
]);
const INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_MODES = Object.freeze([
  "plaintext",
  "structured_metadata",
  "encoded_candidate_metadata",
  "operator_translation_required"
]);
const INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_REQUIRED_FIELDS = Object.freeze([
  "handoffId",
  "handoffFamily",
  "sourceActor",
  "targetActor",
  "currentStatus",
  "encodedHandoffMode",
  "allowedCurrentBehavior",
  "forbiddenCurrentBehavior",
  "requiredFutureContractBeforeImplementation",
  "requiredFutureAuthorizationPhaseBeforeRuntime",
  "translatorFinalOutputRequirement",
  "oneClickOperatorOptionMetadata",
  "rawProtocolAuditVisibilityRequirement",
  "locusRoleDescription",
  "fabricRoleDescription",
  "secureDropRoleDescription",
  "explicitBlockedAuthorizationFlags",
  "unsafeEncodedHandoffRuntimeFlags",
  "nonAuthorizingProof"
]);
const INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_OPTION_REQUIRED_FIELDS =
  Object.freeze([
    "optionId",
    "label",
    "optionIntent",
    "allowedFuturePreference",
    "forbiddenCurrentBehavior",
    "nonExecutable",
    "changesRuntimeBehavior",
    "changesReportRunsChecks",
    "exposesCommands",
    "authorizesRuntime",
    "producesApprovalGrant",
    "connectorGrantProduced",
    "nonAuthorizingProof"
  ]);
const INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_UNSAFE_FIELDS = Object.freeze([
  "encodedHandoffRuntimeEnabled",
  "runtimeCommunicationChannelEnabled",
  "protocolRuntimeImplemented",
  "codecImplemented",
  "translatorRuntimeImplemented",
  "encoderImplemented",
  "decoderImplemented",
  "conlangGeneratorImplemented",
  "seedGeneratorImplemented",
  "protocolNegotiatorImplemented",
  "messageRouterImplemented",
  "messageBusImplemented",
  "covertChannelImplemented",
  "stegoLayerImplemented",
  "semanticStegoImplemented",
  "steganographyEngineImplemented",
  "tokenizerExploitImplemented",
  "tokenExploiterImplemented",
  "guardrailEvasionImplemented",
  "bypassPathImplemented",
  "hiddenPayloadPathImplemented",
  "transportImplementedByArdyn",
  "fabricRuntimeImplementedByArdyn",
  "fabricBusImplementedByArdyn",
  "backendRuntimeImplementedByArdyn",
  "apiEndpointImplementedByArdyn",
  "serverImplementedByArdyn",
  "websocketHttpTransportImplementedByArdyn",
  "grpcTransportImplementedByArdyn",
  "mqttTransportImplementedByArdyn",
  "libp2pTransportImplementedByArdyn",
  "a2aRuntimeImplementedByArdyn",
  "acpRuntimeImplementedByArdyn",
  "ampRuntimeImplementedByArdyn",
  "anpRuntimeImplementedByArdyn",
  "importExportPathImplementedByArdyn",
  "packageDistributionImplementedByArdyn",
  "packageWriterImplementedByArdyn",
  "packageReaderImplementedByArdyn",
  "persistenceImplementedByArdyn",
  "databaseStorageRuntimeWritesEnabled",
  "secretsRuntimeIngestionEnabled",
  "connectorGrantProduced",
  "mcpToolExposureEnabled",
  "taskExecutionEnabled",
  "secureDropImplemented",
  "secureDropCryptoImplemented",
  "secureDropTransportImplemented",
  "secureDropStegoImplemented",
  "secureDropSendReceiveImplemented",
  "secureDropInboxPollingEnabled",
  "secureDropFileSelectionEnabled",
  "st3ggVendored",
  "serviceDiscoveryEnabled",
  "scheduleEnforcementEnabled",
  "backgroundPollingEnabled",
  "filesystemScanningEnabled",
  "processControlEnabled",
  "uiFrontendBrowserRenderingImplemented",
  "commandExposureEnabled",
  "commandRuntimeControlEnabled",
  "runtimeExecutionEnabled",
  "changesRuntimeBehavior",
  "changesReportRunsChecks",
  "reportRunsChecks",
  "blockedCliBypassEnabled"
]);
const INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_AUTHORIZATION_FIELDS =
  Object.freeze([
    "runtimeAuthorized",
    "runtimeAuthorizationGranted",
    "runtimeApprovalGranted",
    "fabricRuntimeAuthorizationGranted",
    "encodedHandoffRuntimeAuthorizationGranted",
    "codecRuntimeAuthorizationGranted",
    "translatorRuntimeAuthorizationGranted",
    "commandExposureAuthorizationGranted",
    "connectorGrantAuthorizationGranted",
    "authorizesRuntime",
    "approvalGrantProduced",
    "approvalDecisionProduced",
    "producesApprovalGrant"
  ]);
const INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_COMMAND_FIELDS = Object.freeze([
  "commandExposureEnabled",
  "commandRuntimeControlEnabled",
  "commandsExposed",
  "exposesCommands",
  "runtimeCommandEnabled",
  "cliCommandExposed"
]);
const INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_BLOCKED_CLI_BYPASS_FIELDS =
  Object.freeze([
    "blockedCliBypassEnabled",
    "dryRunBypassesBlock",
    "serveRuntimeBypassEnabled",
    "bypassBlockedCommandBehavior",
    "blockedCommandOverride"
  ]);
const INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_CODEC_TRUE_FIELDS = Object.freeze([
  "codecImplemented",
  "translatorRuntimeImplemented",
  "encoderImplemented",
  "decoderImplemented",
  "conlangGeneratorImplemented",
  "seedGeneratorImplemented",
  "protocolRuntimeImplemented",
  "protocolNegotiatorImplemented",
  "messageRouterImplemented",
  "messageBusImplemented"
]);
const INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_CODEC_PRESENT_FIELDS =
  Object.freeze([
    "codecModulePath",
    "codecCommand",
    "translatorEntrypoint",
    "encoderEntrypoint",
    "decoderEntrypoint",
    "conlangGeneratorCommand",
    "seedGeneratorCommand",
    "protocolRuntimeEntrypoint",
    "messageRouterEndpoint",
    "messageBusTopic"
  ]);
const INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_STEGO_TRUE_FIELDS =
  Object.freeze([
    "covertChannelImplemented",
    "stegoLayerImplemented",
    "semanticStegoImplemented",
    "steganographyEngineImplemented",
    "tokenizerExploitImplemented",
    "tokenExploiterImplemented",
    "guardrailEvasionImplemented",
    "bypassPathImplemented",
    "hiddenPayloadPathImplemented",
    "monitorBypassEnabled",
    "zeroWidthPayloadEnabled",
    "unicodeHomoglyphPayloadEnabled",
    "st3ggPayloadWrappingEnabled"
  ]);
const INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_STEGO_PRESENT_FIELDS =
  Object.freeze([
    "SemanticStego",
    "SteganographyEngine",
    "TokenExploiter",
    "tokenizerExploit",
    "covertChannel",
    "hiddenPayloadPath",
    "semanticStegoPayload",
    "zeroWidthPayload",
    "unicodeHomoglyphPayload",
    "st3ggPayloadWrapper",
    "stealthAttribute",
    "adversarialAttribute",
    "phantomAttribute"
  ]);
const INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_IMPORT_PRESENT_FIELDS =
  Object.freeze([
    "importCommand",
    "exportCommand",
    "packagePath",
    "packageWriterPath",
    "packageReaderPath",
    "packageDistributionPath",
    "persistenceDsn",
    "dbWriteTarget",
    "storageWriteTarget",
    "secretVaultPath",
    "envSecretName"
  ]);
const INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_FABRIC_PRESENT_FIELDS =
  Object.freeze([
    "fabricBusTopic",
    "fabricBrokerUrl",
    "fabricTransportUrl",
    "fabricAdapterEndpoint",
    "websocketRoute",
    "httpRoute",
    "grpcEndpoint",
    "mqttTopic",
    "libp2pPeer",
    "a2aEndpoint",
    "acpEndpoint",
    "ampEndpoint",
    "anpEndpoint",
    "mcpToolName",
    "taskExecutor",
    "serverEndpointUrl",
    "apiEndpointUrl",
    "runtimeEntrypoint"
  ]);
const INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_FABRIC_TRUE_FIELDS =
  Object.freeze([
    "transportImplementedByArdyn",
    "fabricRuntimeImplementedByArdyn",
    "fabricBusImplementedByArdyn",
    "backendRuntimeImplementedByArdyn",
    "apiEndpointImplementedByArdyn",
    "serverImplementedByArdyn",
    "websocketHttpTransportImplementedByArdyn",
    "grpcTransportImplementedByArdyn",
    "mqttTransportImplementedByArdyn",
    "libp2pTransportImplementedByArdyn",
    "mcpToolExposureEnabled",
    "taskExecutionEnabled"
  ]);
const INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_SECURE_DROP_TRUE_FIELDS =
  Object.freeze([
    "secureDropImplemented",
    "secureDropCryptoImplemented",
    "secureDropTransportImplemented",
    "secureDropStegoImplemented",
    "secureDropSendReceiveImplemented",
    "secureDropInboxPollingEnabled",
    "secureDropFileSelectionEnabled",
    "secureDropConnectorIngestionEnabled",
    "st3ggVendored"
  ]);

function interAgentEncodedHandoffConformanceInputRecord(input) {
  return isPlainObjectRecord(input) ? input : null;
}

function interAgentEncodedHandoffConformanceReviewedAt(inputRecord) {
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

function interAgentEncodedHandoffConformanceInputMalformed(inputRecord) {
  return (
    inputRecord === null ||
    (Object.prototype.hasOwnProperty.call(inputRecord, "reviewedAt") &&
      !isUtcIsoTimestampWithMilliseconds(inputRecord.reviewedAt)) ||
    (Object.prototype.hasOwnProperty.call(inputRecord, "handoffEntries") &&
      !Array.isArray(inputRecord.handoffEntries)) ||
    (Object.prototype.hasOwnProperty.call(inputRecord, "oneClickOptions") &&
      !Array.isArray(inputRecord.oneClickOptions))
  );
}

function interAgentEncodedHandoffConformanceInputEntries(inputRecord) {
  return Array.isArray(inputRecord?.handoffEntries)
    ? inputRecord.handoffEntries
    : null;
}

function interAgentEncodedHandoffConformanceInputOptions(inputRecord) {
  return Array.isArray(inputRecord?.oneClickOptions)
    ? inputRecord.oneClickOptions
    : null;
}

function interAgentEncodedHandoffConformanceContainsTrue(value) {
  if (value === true) {
    return true;
  }

  if (Array.isArray(value)) {
    return value.some(interAgentEncodedHandoffConformanceContainsTrue);
  }

  if (isPlainObjectRecord(value)) {
    return Object.values(value).some(
      interAgentEncodedHandoffConformanceContainsTrue
    );
  }

  return false;
}

function interAgentEncodedHandoffConformanceHasTrueFieldDeep(value, fields) {
  if (Array.isArray(value)) {
    return value.some((item) =>
      interAgentEncodedHandoffConformanceHasTrueFieldDeep(item, fields)
    );
  }

  if (!isPlainObjectRecord(value)) {
    return false;
  }

  for (const [key, nested] of Object.entries(value)) {
    if (fields.includes(key) && nested === true) {
      return true;
    }

    if (
      interAgentEncodedHandoffConformanceHasTrueFieldDeep(nested, fields)
    ) {
      return true;
    }
  }

  return false;
}

function interAgentEncodedHandoffConformanceHasPresentFieldDeep(value, fields) {
  if (Array.isArray(value)) {
    return value.some((item) =>
      interAgentEncodedHandoffConformanceHasPresentFieldDeep(item, fields)
    );
  }

  if (!isPlainObjectRecord(value)) {
    return false;
  }

  for (const [key, nested] of Object.entries(value)) {
    if (fields.includes(key)) {
      return true;
    }

    if (
      interAgentEncodedHandoffConformanceHasPresentFieldDeep(nested, fields)
    ) {
      return true;
    }
  }

  return false;
}

function interAgentEncodedHandoffConformanceContainsEntryIssue(
  entries,
  predicate
) {
  return entries !== null && entries.some((entry) => predicate(entry));
}

function interAgentEncodedHandoffConformanceContainsOptionIssue(
  options,
  predicate
) {
  return options !== null && options.some((option) => predicate(option));
}

function interAgentEncodedHandoffConformanceMissingRequiredField(entry) {
  if (!isPlainObjectRecord(entry)) {
    return true;
  }

  return INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_REQUIRED_FIELDS.some(
    (field) => !Object.prototype.hasOwnProperty.call(entry, field)
  );
}

function interAgentEncodedHandoffConformanceOptionMissingRequiredField(option) {
  if (!isPlainObjectRecord(option)) {
    return true;
  }

  return INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_OPTION_REQUIRED_FIELDS.some(
    (field) => !Object.prototype.hasOwnProperty.call(option, field)
  );
}

function interAgentEncodedHandoffConformanceEntryMalformed(entry) {
  return (
    interAgentEncodedHandoffConformanceMissingRequiredField(entry) ||
    typeof entry.handoffId !== "string" ||
    entry.handoffId.length === 0 ||
    !Array.isArray(entry.allowedCurrentBehavior) ||
    entry.allowedCurrentBehavior.length < 2 ||
    entry.allowedCurrentBehavior.some(
      (behavior) => typeof behavior !== "string" || behavior.length === 0
    ) ||
    !Array.isArray(entry.forbiddenCurrentBehavior) ||
    entry.forbiddenCurrentBehavior.length < 25 ||
    entry.forbiddenCurrentBehavior.some(
      (behavior) => typeof behavior !== "string" || behavior.length === 0
    ) ||
    typeof entry.requiredFutureContractBeforeImplementation !== "string" ||
    entry.requiredFutureContractBeforeImplementation.length === 0 ||
    typeof entry.requiredFutureAuthorizationPhaseBeforeRuntime !== "string" ||
    entry.requiredFutureAuthorizationPhaseBeforeRuntime.length === 0 ||
    typeof entry.translatorFinalOutputRequirement !== "string" ||
    entry.translatorFinalOutputRequirement.length === 0 ||
    !isPlainObjectRecord(entry.oneClickOperatorOptionMetadata) ||
    !Array.isArray(entry.oneClickOperatorOptionMetadata.availableOptionIds) ||
    entry.oneClickOperatorOptionMetadata.availableOptionIds.length !==
      interAgentEncodedHandoffConformanceOneClickOptions().length ||
    typeof entry.rawProtocolAuditVisibilityRequirement !== "string" ||
    entry.rawProtocolAuditVisibilityRequirement.length === 0 ||
    typeof entry.locusRoleDescription !== "string" ||
    entry.locusRoleDescription.length === 0 ||
    typeof entry.fabricRoleDescription !== "string" ||
    entry.fabricRoleDescription.length === 0 ||
    typeof entry.secureDropRoleDescription !== "string" ||
    entry.secureDropRoleDescription.length === 0 ||
    !isPlainObjectRecord(entry.explicitBlockedAuthorizationFlags) ||
    !isPlainObjectRecord(entry.unsafeEncodedHandoffRuntimeFlags) ||
    entry.nonAuthorizingProof !== true
  );
}

function interAgentEncodedHandoffConformanceOptionMalformed(option) {
  return (
    interAgentEncodedHandoffConformanceOptionMissingRequiredField(option) ||
    typeof option.optionId !== "string" ||
    option.optionId.length === 0 ||
    typeof option.label !== "string" ||
    option.label.length === 0 ||
    option.optionIntent !== "metadata_only" ||
    typeof option.allowedFuturePreference !== "string" ||
    option.allowedFuturePreference.length === 0 ||
    !Array.isArray(option.forbiddenCurrentBehavior) ||
    option.forbiddenCurrentBehavior.length < 4 ||
    option.nonExecutable !== true ||
    option.changesRuntimeBehavior !== false ||
    option.changesReportRunsChecks !== false ||
    option.exposesCommands !== false ||
    option.authorizesRuntime !== false ||
    option.producesApprovalGrant !== false ||
    option.connectorGrantProduced !== false ||
    option.nonAuthorizingProof !== true ||
    !isPlainObjectRecord(option.runtimeEffect) ||
    interAgentEncodedHandoffConformanceContainsTrue(option.runtimeEffect)
  );
}

function interAgentEncodedHandoffConformanceAuthorizationFlagEnabled(value) {
  return (
    interAgentEncodedHandoffConformanceContainsTrue(
      value?.explicitBlockedAuthorizationFlags
    ) ||
    interAgentEncodedHandoffConformanceContainsTrue(value?.authorizationFlags)
  );
}

function interAgentEncodedHandoffConformanceUnsafeFlagEnabled(value) {
  return (
    interAgentEncodedHandoffConformanceContainsTrue(
      value?.unsafeEncodedHandoffRuntimeFlags
    ) ||
    interAgentEncodedHandoffConformanceHasTrueFieldDeep(
      value,
      INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_UNSAFE_FIELDS
    )
  );
}

function interAgentEncodedHandoffConformanceEntriesCanonical(entries) {
  if (entries === null) {
    return true;
  }

  return (
    JSON.stringify(entries) ===
    JSON.stringify(interAgentEncodedHandoffConformanceEntries())
  );
}

function interAgentEncodedHandoffConformanceOptionsCanonical(options) {
  if (options === null) {
    return true;
  }

  return (
    JSON.stringify(options) ===
    JSON.stringify(interAgentEncodedHandoffConformanceOneClickOptions())
  );
}

function interAgentEncodedHandoffConformanceInputClassification(inputRecord) {
  if (interAgentEncodedHandoffConformanceInputMalformed(inputRecord)) {
    return MALFORMED_INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_CLASSIFICATION;
  }

  const entries =
    interAgentEncodedHandoffConformanceInputEntries(inputRecord);
  const options =
    interAgentEncodedHandoffConformanceInputOptions(inputRecord);

  if (
    interAgentEncodedHandoffConformanceContainsEntryIssue(
      entries,
      interAgentEncodedHandoffConformanceMissingRequiredField
    ) ||
    interAgentEncodedHandoffConformanceContainsOptionIssue(
      options,
      interAgentEncodedHandoffConformanceOptionMissingRequiredField
    )
  ) {
    return "missing_required_inter_agent_encoded_handoff_conformance_entry_rejected";
  }

  if (
    interAgentEncodedHandoffConformanceContainsEntryIssue(
      entries,
      (entry) =>
        !INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_FAMILIES.includes(
          entry.handoffFamily
        )
    )
  ) {
    return "unknown_handoff_family_inter_agent_encoded_handoff_conformance_input_rejected";
  }

  if (
    interAgentEncodedHandoffConformanceContainsEntryIssue(
      entries,
      (entry) =>
        !INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_ACTORS.includes(
          entry.sourceActor
        ) ||
        !INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_ACTORS.includes(
          entry.targetActor
        )
    )
  ) {
    return "unknown_source_or_target_actor_inter_agent_encoded_handoff_conformance_input_rejected";
  }

  if (
    interAgentEncodedHandoffConformanceContainsEntryIssue(
      entries,
      (entry) =>
        !INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_MODES.includes(
          entry.encodedHandoffMode
        )
    )
  ) {
    return "unknown_encoded_handoff_mode_inter_agent_encoded_handoff_conformance_input_rejected";
  }

  if (
    interAgentEncodedHandoffConformanceContainsEntryIssue(
      entries,
      (entry) =>
        !INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_STATUSES.includes(
          entry.currentStatus
        )
    )
  ) {
    return "unknown_current_status_inter_agent_encoded_handoff_conformance_input_rejected";
  }

  if (
    interAgentEncodedHandoffConformanceContainsEntryIssue(
      entries,
      interAgentEncodedHandoffConformanceEntryMalformed
    ) ||
    interAgentEncodedHandoffConformanceContainsOptionIssue(
      options,
      interAgentEncodedHandoffConformanceOptionMalformed
    )
  ) {
    return MALFORMED_INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_CLASSIFICATION;
  }

  if (
    interAgentEncodedHandoffConformanceContainsEntryIssue(
      entries,
      interAgentEncodedHandoffConformanceAuthorizationFlagEnabled
    ) ||
    interAgentEncodedHandoffConformanceContainsOptionIssue(
      options,
      interAgentEncodedHandoffConformanceAuthorizationFlagEnabled
    ) ||
    interAgentEncodedHandoffConformanceAuthorizationFlagEnabled(inputRecord)
  ) {
    return "authorization_flags_enabled_inter_agent_encoded_handoff_conformance_input_rejected";
  }

  if (
    interAgentEncodedHandoffConformanceHasTrueFieldDeep(inputRecord, [
      "reportRunsChecks"
    ])
  ) {
    return "report_runs_checks_true_inter_agent_encoded_handoff_conformance_input_rejected";
  }

  if (
    interAgentEncodedHandoffConformanceHasTrueFieldDeep(
      inputRecord,
      INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_AUTHORIZATION_FIELDS
    )
  ) {
    return "runtime_authorization_attempt_inter_agent_encoded_handoff_conformance_input_rejected";
  }

  if (
    interAgentEncodedHandoffConformanceHasTrueFieldDeep(
      inputRecord,
      INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_COMMAND_FIELDS
    )
  ) {
    return "command_exposure_attempt_inter_agent_encoded_handoff_conformance_input_rejected";
  }

  if (
    interAgentEncodedHandoffConformanceHasTrueFieldDeep(
      inputRecord,
      INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_BLOCKED_CLI_BYPASS_FIELDS
    )
  ) {
    return "blocked_cli_bypass_attempt_inter_agent_encoded_handoff_conformance_input_rejected";
  }

  if (
    interAgentEncodedHandoffConformanceHasTrueFieldDeep(
      inputRecord,
      INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_CODEC_TRUE_FIELDS
    ) ||
    interAgentEncodedHandoffConformanceHasPresentFieldDeep(
      inputRecord,
      INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_CODEC_PRESENT_FIELDS
    )
  ) {
    return "hidden_codec_translator_encoder_decoder_conlang_execution_semantics_inter_agent_encoded_handoff_conformance_input_rejected";
  }

  if (
    interAgentEncodedHandoffConformanceHasTrueFieldDeep(
      inputRecord,
      INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_STEGO_TRUE_FIELDS
    ) ||
    interAgentEncodedHandoffConformanceHasPresentFieldDeep(
      inputRecord,
      INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_STEGO_PRESENT_FIELDS
    )
  ) {
    return "hidden_steganography_covert_channel_tokenizer_exploit_guardrail_evasion_bypass_semantics_inter_agent_encoded_handoff_conformance_input_rejected";
  }

  if (
    interAgentEncodedHandoffConformanceHasPresentFieldDeep(
      inputRecord,
      INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_IMPORT_PRESENT_FIELDS
    )
  ) {
    return "hidden_import_export_package_persistence_semantics_inter_agent_encoded_handoff_conformance_input_rejected";
  }

  if (
    interAgentEncodedHandoffConformanceHasTrueFieldDeep(
      inputRecord,
      INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_SECURE_DROP_TRUE_FIELDS
    )
  ) {
    return "secure_drop_implementation_semantics_inter_agent_encoded_handoff_conformance_input_rejected";
  }

  if (
    interAgentEncodedHandoffConformanceHasTrueFieldDeep(
      inputRecord,
      INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_FABRIC_TRUE_FIELDS
    ) ||
    interAgentEncodedHandoffConformanceHasPresentFieldDeep(
      inputRecord,
      INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_FABRIC_PRESENT_FIELDS
    )
  ) {
    return "hidden_fabric_websocket_http_mcp_task_runtime_semantics_inter_agent_encoded_handoff_conformance_input_rejected";
  }

  if (
    interAgentEncodedHandoffConformanceUnsafeFlagEnabled(inputRecord) ||
    interAgentEncodedHandoffConformanceContainsEntryIssue(
      entries,
      interAgentEncodedHandoffConformanceUnsafeFlagEnabled
    ) ||
    interAgentEncodedHandoffConformanceContainsOptionIssue(
      options,
      interAgentEncodedHandoffConformanceUnsafeFlagEnabled
    )
  ) {
    return "unsafe_runtime_command_connector_fabric_websocket_http_mcp_task_secure_drop_service_discovery_schedule_filesystem_process_flags_inter_agent_encoded_handoff_conformance_input_rejected";
  }

  if (
    interAgentEncodedHandoffConformanceContainsEntryIssue(entries, (entry) =>
      interAgentEncodedHandoffConformanceContainsTrue(entry?.runtimeEffect)
    ) ||
    interAgentEncodedHandoffConformanceContainsOptionIssue(options, (option) =>
      interAgentEncodedHandoffConformanceContainsTrue(option?.runtimeEffect)
    ) ||
    interAgentEncodedHandoffConformanceContainsTrue(inputRecord?.runtimeEffect)
  ) {
    return "nested_unsafe_flags_inter_agent_encoded_handoff_conformance_input_rejected";
  }

  if (
    !interAgentEncodedHandoffConformanceEntriesCanonical(entries) ||
    !interAgentEncodedHandoffConformanceOptionsCanonical(options)
  ) {
    return "noncanonical_inter_agent_encoded_handoff_conformance_input_rejected";
  }

  return VALID_INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_CLASSIFICATION;
}

function interAgentEncodedHandoffConformanceAuthorizationFlags() {
  return {
    encodedHandoffRuntimeAuthorizationGranted: false,
    codecRuntimeAuthorizationGranted: false,
    translatorRuntimeAuthorizationGranted: false,
    encoderDecoderRuntimeAuthorizationGranted: false,
    conlangRuntimeAuthorizationGranted: false,
    protocolRuntimeAuthorizationGranted: false,
    covertChannelAuthorizationGranted: false,
    transportAuthorizationGranted: false,
    fabricRuntimeAuthorizationGranted: false,
    backendApiServerAuthorizationGranted: false,
    importExportAuthorizationGranted: false,
    packagePersistenceAuthorizationGranted: false,
    databaseStorageAuthorizationGranted: false,
    secretsAuthorizationGranted: false,
    connectorGrantProduced: false,
    mcpToolExposureAuthorizationGranted: false,
    taskExecutionAuthorizationGranted: false,
    secureDropAuthorizationGranted: false,
    serviceDiscoveryAuthorizationGranted: false,
    scheduleEnforcementAuthorizationGranted: false,
    filesystemProcessAuthorizationGranted: false,
    commandExposureAuthorizationGranted: false,
    approvalGrantProduced: false
  };
}

function interAgentEncodedHandoffConformanceUnsafeFlags() {
  return Object.fromEntries(
    INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_UNSAFE_FIELDS.map((field) => [
      field,
      false
    ])
  );
}

function interAgentEncodedHandoffConformanceOptionIds() {
  return [
    "phase5-60.option.force-plaintext-final-output",
    "phase5-60.option.require-final-operator-translation",
    "phase5-60.option.show-raw-encoded-handoff-transcript",
    "phase5-60.option.hide-raw-transcript-keep-audit-digest",
    "phase5-60.option.allow-structured-metadata-handoff-candidate",
    "phase5-60.option.allow-encoded-handoff-candidate-after-future-authorization",
    "phase5-60.option.disable-encoded-handoff-candidate"
  ];
}

function interAgentEncodedHandoffConformanceOneClickOption({
  optionId,
  label,
  allowedFuturePreference
}) {
  return {
    optionId,
    label,
    optionIntent: "metadata_only",
    allowedFuturePreference,
    forbiddenCurrentBehavior: [
      "Do not change runtime behavior.",
      "Do not change reportRunsChecks.",
      "Do not expose commands or approvals.",
      "Do not send hidden traffic, covert transfer, stego, bypass, no-audit opaque output, tokenizer exploitation, Secure Drop implementation, or connector/runtime state."
    ],
    nonExecutable: true,
    changesRuntimeBehavior: false,
    changesReportRunsChecks: false,
    exposesCommands: false,
    authorizesRuntime: false,
    producesApprovalGrant: false,
    connectorGrantProduced: false,
    nonAuthorizingProof: true,
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

function interAgentEncodedHandoffConformanceOneClickOptions() {
  return [
    interAgentEncodedHandoffConformanceOneClickOption({
      optionId: "phase5-60.option.force-plaintext-final-output",
      label: "Force plaintext final output",
      allowedFuturePreference:
        "Future Locus or operator controls may prefer plaintext final output, but Phase 5.60 records preference metadata only."
    }),
    interAgentEncodedHandoffConformanceOneClickOption({
      optionId: "phase5-60.option.require-final-operator-translation",
      label: "Require final operator translation",
      allowedFuturePreference:
        "Future controls may require an operator-readable final translation before display, but no translator runtime is implemented."
    }),
    interAgentEncodedHandoffConformanceOneClickOption({
      optionId: "phase5-60.option.show-raw-encoded-handoff-transcript",
      label: "Show raw encoded transcript",
      allowedFuturePreference:
        "Future displays may show raw encoded handoff transcript metadata for audit review."
    }),
    interAgentEncodedHandoffConformanceOneClickOption({
      optionId: "phase5-60.option.hide-raw-transcript-keep-audit-digest",
      label: "Hide raw transcript, keep audit digest",
      allowedFuturePreference:
        "Future displays may hide raw transcript text while keeping a visible audit digest; no opaque no-audit output is allowed."
    }),
    interAgentEncodedHandoffConformanceOneClickOption({
      optionId: "phase5-60.option.allow-structured-metadata-handoff-candidate",
      label: "Allow structured metadata candidate",
      allowedFuturePreference:
        "Future controls may allow structured metadata handoff candidates after a separate contract authorizes consumer-owned handling."
    }),
    interAgentEncodedHandoffConformanceOneClickOption({
      optionId:
        "phase5-60.option.allow-encoded-handoff-candidate-after-future-authorization",
      label: "Allow encoded candidate after authorization",
      allowedFuturePreference:
        "Future controls may allow encoded handoff candidates only after a later authorization phase; this option is non-executable now."
    }),
    interAgentEncodedHandoffConformanceOneClickOption({
      optionId: "phase5-60.option.disable-encoded-handoff-candidate",
      label: "Disable encoded candidate",
      allowedFuturePreference:
        "Future controls may disable encoded handoff candidates and keep plaintext or structured metadata only."
    })
  ];
}

function interAgentEncodedHandoffConformanceEntryBase(definition) {
  return {
    handoffId: definition.handoffId,
    handoffFamily: definition.handoffFamily,
    sourceActor: definition.sourceActor,
    targetActor: definition.targetActor,
    currentStatus: definition.currentStatus,
    encodedHandoffMode: definition.encodedHandoffMode,
    allowedCurrentBehavior: definition.allowedCurrentBehavior,
    forbiddenCurrentBehavior:
      interAgentEncodedHandoffConformanceForbiddenBehavior(),
    requiredFutureContractBeforeImplementation:
      definition.requiredFutureContractBeforeImplementation,
    requiredFutureAuthorizationPhaseBeforeRuntime:
      definition.requiredFutureAuthorizationPhaseBeforeRuntime,
    translatorFinalOutputRequirement:
      definition.translatorFinalOutputRequirement,
    oneClickOperatorOptionMetadata: {
      availableOptionIds: interAgentEncodedHandoffConformanceOptionIds(),
      optionsNonExecutable: true,
      optionsDoNotChangeReportRunsChecks: true,
      optionsDoNotAuthorizeRuntime: true,
      optionsDoNotExposeCommands: true
    },
    rawProtocolAuditVisibilityRequirement:
      definition.rawProtocolAuditVisibilityRequirement,
    locusRoleDescription: definition.locusRoleDescription,
    fabricRoleDescription: definition.fabricRoleDescription,
    secureDropRoleDescription: definition.secureDropRoleDescription,
    glossopetraeArchitectureReferenceOnly: true,
    glossopetraeCopiedVendoredInstalledImportedIntegrated: false,
    futureProtocolReferences: [
      "A2A",
      "ACP",
      "AMP",
      "ANP",
      "Agora",
      "LMOS",
      "MCP",
      "Fabric",
      "Matrix",
      "gRPC",
      "MQTT",
      "libp2p"
    ],
    futureProtocolReferencesMetadataOnly: true,
    encodedHandoffConformanceMetadataOnly: true,
    operatorPlaintextFinalOutputRequired:
      definition.encodedHandoffMode === "operator_translation_required",
    rawProtocolAuditVisibleOrDigestRequired: true,
    explicitBlockedAuthorizationFlags:
      interAgentEncodedHandoffConformanceAuthorizationFlags(),
    unsafeEncodedHandoffRuntimeFlags:
      interAgentEncodedHandoffConformanceUnsafeFlags(),
    nonAuthorizingProof: true,
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

function interAgentEncodedHandoffConformanceDefinitions() {
  return [
    {
      handoffId: "phase5-60.ardyn-to-subagent.plaintext-handoff-metadata",
      handoffFamily: "subagent_encoded_handoff",
      sourceActor: "ardyn",
      targetActor: "ardyn-subagent",
      currentStatus: "metadata_only",
      encodedHandoffMode: "plaintext",
      allowedCurrentBehavior: [
        "Describe plaintext Ardyn-to-subagent handoff metadata for review.",
        "Require final operator-readable output with no hidden payload path."
      ],
      requiredFutureContractBeforeImplementation:
        "A future subagent handoff contract must define identity, transcript format, audit visibility, and command/runtime non-authority before any executable path.",
      requiredFutureAuthorizationPhaseBeforeRuntime:
        "Requires a later runtime, command exposure, transport, process-control, and approval-grant authorization phase.",
      translatorFinalOutputRequirement:
        "Final output to the operator must remain plaintext and human-readable; no translator runtime is implemented.",
      rawProtocolAuditVisibilityRequirement:
        "Raw handoff metadata and audit digest must remain inspectable in future consumer-owned displays.",
      locusRoleDescription:
        "Locus has no role for this current metadata entry beyond future display of Ardyn review artifacts.",
      fabricRoleDescription:
        "Fabric may later envelope subagent handoff references, but Phase 5.60 defines no Fabric bus or transport.",
      secureDropRoleDescription:
        "Not applicable; Secure Drop remains content-fabric-only future metadata."
    },
    {
      handoffId: "phase5-60.subagent-to-ardyn.structured-metadata-handoff",
      handoffFamily: "subagent_encoded_handoff",
      sourceActor: "ardyn-subagent",
      targetActor: "ardyn",
      currentStatus: "metadata_only",
      encodedHandoffMode: "structured_metadata",
      allowedCurrentBehavior: [
        "Describe subagent-to-Ardyn structured metadata handoff shape.",
        "Keep subagent output review-only and non-authorizing."
      ],
      requiredFutureContractBeforeImplementation:
        "A future contract must define subagent provenance, canonical ordering, replay/audit semantics, and explicit non-execution boundaries.",
      requiredFutureAuthorizationPhaseBeforeRuntime:
        "Requires a later subagent execution, audit, routing, and approval-boundary authorization phase.",
      translatorFinalOutputRequirement:
        "Structured metadata must include an operator-readable summary; no automatic translator is available.",
      rawProtocolAuditVisibilityRequirement:
        "Structured handoff payloads must remain visible as raw metadata or digest-backed audit metadata.",
      locusRoleDescription:
        "Locus may later display subagent handoff status metadata but owns no runner here.",
      fabricRoleDescription:
        "Fabric may later carry a coordination envelope reference only.",
      secureDropRoleDescription:
        "Not applicable; Secure Drop remains content-fabric-only future metadata."
    },
    {
      handoffId:
        "phase5-60.ardyn-subagent.encoded-candidate-metadata-boundary",
      handoffFamily: "subagent_encoded_handoff",
      sourceActor: "ardyn",
      targetActor: "ardyn-subagent",
      currentStatus: "future_contract_required",
      encodedHandoffMode: "encoded_candidate_metadata",
      allowedCurrentBehavior: [
        "Describe that encoded handoff candidates require future authorization.",
        "Keep encoded candidate references metadata-only and audit-visible."
      ],
      requiredFutureContractBeforeImplementation:
        "A future encoded handoff contract must define safe encoding semantics, plaintext translation, raw audit visibility, and explicit prohibition of stego, bypass, and hidden payloads.",
      requiredFutureAuthorizationPhaseBeforeRuntime:
        "Requires a later explicit encoded-handoff runtime authorization phase and separate command/transport authorization.",
      translatorFinalOutputRequirement:
        "Any future encoded candidate must have a plaintext final-output translation requirement before operator presentation.",
      rawProtocolAuditVisibilityRequirement:
        "Raw encoded candidate metadata must be reviewable or digest-backed; opaque no-audit output is forbidden.",
      locusRoleDescription:
        "Locus may later expose a disabled metadata option for encoded candidates after future authorization.",
      fabricRoleDescription:
        "Fabric may later envelope encoded candidate identity metadata only.",
      secureDropRoleDescription:
        "Secure Drop is not implemented here; any future Secure Drop content path remains content-fabric-owned."
    },
    {
      handoffId: "phase5-60.ardyn-to-locus.harness-bridge-metadata",
      handoffFamily: "locus_harness_bridge",
      sourceActor: "ardyn",
      targetActor: "locus",
      currentStatus: "metadata_only",
      encodedHandoffMode: "structured_metadata",
      allowedCurrentBehavior: [
        "Describe Locus-mediated harness bridge display metadata.",
        "Keep Locus a consumer target only with no runtime integration."
      ],
      requiredFutureContractBeforeImplementation:
        "A future Locus-owned bridge contract must define display-only import responsibility, accessibility, audit visibility, and no hidden action semantics.",
      requiredFutureAuthorizationPhaseBeforeRuntime:
        "Requires future Locus-owned runtime, UI, import, and command-control authorization outside Ardyn.",
      translatorFinalOutputRequirement:
        "Locus-facing handoff summaries must remain operator-readable and color-independent.",
      rawProtocolAuditVisibilityRequirement:
        "Locus displays must expose raw protocol metadata or digest evidence without executing it.",
      locusRoleDescription:
        "Locus is a future first-class display/control-surface consumer target only.",
      fabricRoleDescription:
        "Fabric may later envelope Locus bridge metadata but provides no runtime transport in this phase.",
      secureDropRoleDescription:
        "Future Secure Drop indicators are metadata-only placeholders and remain content-fabric-owned."
    },
    {
      handoffId:
        "phase5-60.locus-to-external-harness.bridge-candidate-metadata",
      handoffFamily: "locus_harness_bridge",
      sourceActor: "locus",
      targetActor: "external-harness",
      currentStatus: "future_contract_required",
      encodedHandoffMode: "encoded_candidate_metadata",
      allowedCurrentBehavior: [
        "Describe a future Locus-mediated bridge candidate for other harnesses.",
        "Require Ardyn to treat the external harness as metadata only."
      ],
      requiredFutureContractBeforeImplementation:
        "A future bridge contract must define external harness identity, protocol identity, operator translation, audit transcript handling, and consumer-owned execution boundaries.",
      requiredFutureAuthorizationPhaseBeforeRuntime:
        "Requires future Locus/external-harness authorization and no Ardyn runtime authority.",
      translatorFinalOutputRequirement:
        "Any bridge candidate must have a plaintext operator translation requirement before display.",
      rawProtocolAuditVisibilityRequirement:
        "External harness references require raw transcript visibility or digest-backed audit metadata.",
      locusRoleDescription:
        "Locus may later mediate bridge metadata but cannot send, route, or execute through Ardyn.",
      fabricRoleDescription:
        "Fabric may later coordinate bridge envelope identity metadata only.",
      secureDropRoleDescription:
        "Not applicable; Secure Drop remains content-fabric-only future metadata."
    },
    {
      handoffId: "phase5-60.locus-to-multiverse.harness-bridge-metadata",
      handoffFamily: "locus_harness_bridge",
      sourceActor: "locus",
      targetActor: "multiverse",
      currentStatus: "metadata_only",
      encodedHandoffMode: "structured_metadata",
      allowedCurrentBehavior: [
        "Describe Locus-to-Multiverse harness bridge metadata for review.",
        "Keep Multiverse a consumer target only."
      ],
      requiredFutureContractBeforeImplementation:
        "A future bridge contract must define Multiverse-owned display and orchestration boundaries before any executable relationship.",
      requiredFutureAuthorizationPhaseBeforeRuntime:
        "Requires future Multiverse-owned orchestration and adapter authorization outside Ardyn.",
      translatorFinalOutputRequirement:
        "Bridge metadata must be renderable as plaintext operator output.",
      rawProtocolAuditVisibilityRequirement:
        "Bridge metadata requires visible raw protocol metadata or audit digest.",
      locusRoleDescription:
        "Locus is a future display bridge target and does not gain control authority from Ardyn.",
      fabricRoleDescription:
        "Fabric may later coordinate Locus and Multiverse envelope metadata only.",
      secureDropRoleDescription:
        "Not applicable; Secure Drop remains content-fabric-only future metadata."
    },
    {
      handoffId:
        "phase5-60.ardyn-family.fabric-coordination-envelope-metadata",
      handoffFamily: "fabric_coordination_envelope",
      sourceActor: "ardyn",
      targetActor: "multiverse",
      currentStatus: "metadata_only",
      encodedHandoffMode: "structured_metadata",
      allowedCurrentBehavior: [
        "Describe future Fabric coordination envelope metadata.",
        "Reference Phase 5.59 Fabric-aware API/backend boundary metadata."
      ],
      requiredFutureContractBeforeImplementation:
        "A future Fabric envelope contract must define schema identity, repo ownership, authorization, and transport exclusions before implementation.",
      requiredFutureAuthorizationPhaseBeforeRuntime:
        "Requires future Fabric runtime, transport, task, registry, and adapter authorization.",
      translatorFinalOutputRequirement:
        "Fabric envelope handoff status must be explainable as plaintext final output.",
      rawProtocolAuditVisibilityRequirement:
        "Fabric envelope metadata must remain raw-visible or digest-backed for audit.",
      locusRoleDescription:
        "Locus may later display Fabric envelope status metadata only.",
      fabricRoleDescription:
        "Fabric is a future cross-repo coordination contract/envelope layer, not a runtime bus, service, broker, transport, adapter, connector, registry, scheduler, importer, exporter, package distributor, or task executor.",
      secureDropRoleDescription:
        "Not applicable; Secure Drop remains content-fabric-only future metadata."
    },
    {
      handoffId:
        "phase5-60.ardyn-to-content-fabric.secure-drop-reference-metadata",
      handoffFamily: "fabric_coordination_envelope",
      sourceActor: "ardyn",
      targetActor: "content-fabric",
      currentStatus: "future_contract_required",
      encodedHandoffMode: "structured_metadata",
      allowedCurrentBehavior: [
        "Describe future Secure Drop reference metadata owned by content-fabric.",
        "Keep Ardyn free of Secure Drop implementation behavior."
      ],
      requiredFutureContractBeforeImplementation:
        "A future content-fabric-owned Secure Drop contract must define canonical ownership, crypto/transport scope, display references, and Ardyn non-implementation boundaries.",
      requiredFutureAuthorizationPhaseBeforeRuntime:
        "Requires future content-fabric authorization; Ardyn remains non-authorizing.",
      translatorFinalOutputRequirement:
        "Secure Drop references must be plaintext metadata in Ardyn review artifacts.",
      rawProtocolAuditVisibilityRequirement:
        "Secure Drop reference metadata must be auditable without exposing or moving content.",
      locusRoleDescription:
        "Locus may later show Secure Drop placeholder indicators only.",
      fabricRoleDescription:
        "Fabric may later envelope Secure Drop reference metadata but cannot transport or route Secure Drop content here.",
      secureDropRoleDescription:
        "content-fabric remains the only future canonical Secure Drop owner; Ardyn implements no crypto, transport, stego, send/receive, inbox polling, file selection, connector ingestion, secret/vault/env access, or ST3GG behavior."
    },
    {
      handoffId: "phase5-60.operator.final-output-translation-bridge",
      handoffFamily: "operator_translation_bridge",
      sourceActor: "ardyn-subagent",
      targetActor: "ardyn",
      currentStatus: "metadata_only",
      encodedHandoffMode: "operator_translation_required",
      allowedCurrentBehavior: [
        "Describe the requirement for plaintext final output to the operator.",
        "Keep translation a requirement, not an implemented translator runtime."
      ],
      requiredFutureContractBeforeImplementation:
        "A future operator translation contract must define who produces plaintext, how raw transcript/audit remains visible, and how encoded content stays non-authorizing.",
      requiredFutureAuthorizationPhaseBeforeRuntime:
        "Requires a separate translator/runtime authorization phase before any executable translation path.",
      translatorFinalOutputRequirement:
        "The operator-facing final output must be plaintext, inspectable, and free of hidden command or runtime semantics.",
      rawProtocolAuditVisibilityRequirement:
        "Raw protocol transcript or digest must remain reviewable alongside plaintext output.",
      locusRoleDescription:
        "Locus may later offer display preferences for plaintext and raw transcript visibility.",
      fabricRoleDescription:
        "Fabric may later carry translation-requirement metadata only.",
      secureDropRoleDescription:
        "Not applicable; Secure Drop remains content-fabric-only future metadata."
    },
    {
      handoffId: "phase5-60.locus.operator-translation-preference-metadata",
      handoffFamily: "operator_translation_bridge",
      sourceActor: "locus",
      targetActor: "ardyn",
      currentStatus: "metadata_only",
      encodedHandoffMode: "operator_translation_required",
      allowedCurrentBehavior: [
        "Describe future Locus/operator plaintext and encoded display preferences.",
        "Keep one-click options non-executable metadata."
      ],
      requiredFutureContractBeforeImplementation:
        "A future preference contract must define display-only control semantics, audit digest visibility, and explicit no-action behavior.",
      requiredFutureAuthorizationPhaseBeforeRuntime:
        "Requires future Locus UI/control authorization and no Ardyn runtime effect.",
      translatorFinalOutputRequirement:
        "Preferences may require final operator translation but cannot implement a translator.",
      rawProtocolAuditVisibilityRequirement:
        "Preferences may describe raw transcript visibility or audit digest display only.",
      locusRoleDescription:
        "Locus may later own one-click display controls; Phase 5.60 only records their metadata.",
      fabricRoleDescription:
        "Fabric may later envelope operator preference metadata only.",
      secureDropRoleDescription:
        "Secure Drop placeholders must remain metadata-only and content-fabric-owned."
    },
    {
      handoffId: "phase5-60.raw-protocol.audit-visibility-metadata",
      handoffFamily: "handoff_audit_visibility",
      sourceActor: "ardyn",
      targetActor: "locus",
      currentStatus: "metadata_only",
      encodedHandoffMode: "structured_metadata",
      allowedCurrentBehavior: [
        "Describe raw protocol transcript and audit digest visibility expectations.",
        "Keep raw/audit visibility metadata non-executable."
      ],
      requiredFutureContractBeforeImplementation:
        "A future audit visibility contract must define raw transcript retention, digest calculation, redaction, and display ownership before implementation.",
      requiredFutureAuthorizationPhaseBeforeRuntime:
        "Requires future transcript/audit persistence, UI, and storage authorization before any runtime path.",
      translatorFinalOutputRequirement:
        "Audit displays must make final operator-visible meaning available as plaintext.",
      rawProtocolAuditVisibilityRequirement:
        "Raw protocol transcript visibility or digest-backed audit visibility is mandatory for any future encoded handoff.",
      locusRoleDescription:
        "Locus may later display raw transcript or digest state but cannot collect or persist it through Ardyn.",
      fabricRoleDescription:
        "Fabric may later coordinate audit envelope references only.",
      secureDropRoleDescription:
        "Not applicable; Secure Drop remains content-fabric-only future metadata."
    },
    {
      handoffId: "phase5-60.future-protocol.reference-layer-metadata",
      handoffFamily: "protocol_reference_layer",
      sourceActor: "ardyn",
      targetActor: "external-harness",
      currentStatus: "metadata_only",
      encodedHandoffMode: "structured_metadata",
      allowedCurrentBehavior: [
        "List future protocol references as metadata-only architecture context.",
        "Keep A2A, ACP, AMP, ANP, Agora, LMOS, MCP, Fabric, Matrix, gRPC, MQTT, and libp2p references non-runtime."
      ],
      requiredFutureContractBeforeImplementation:
        "Each future protocol reference requires a separate contract, threat model, authorization, audit, and runtime isolation phase before implementation.",
      requiredFutureAuthorizationPhaseBeforeRuntime:
        "Requires future transport/runtime authorization for each protocol family; Phase 5.60 grants none.",
      translatorFinalOutputRequirement:
        "Protocol reference summaries must remain operator-readable plaintext.",
      rawProtocolAuditVisibilityRequirement:
        "Any future protocol handoff must provide raw transcript visibility or digest-backed audit metadata.",
      locusRoleDescription:
        "Locus may later display protocol reference metadata only.",
      fabricRoleDescription:
        "Fabric is one referenced future envelope family and remains metadata-only here.",
      secureDropRoleDescription:
        "Not applicable; Secure Drop remains content-fabric-only future metadata."
    }
  ];
}

function interAgentEncodedHandoffConformanceEntries() {
  return interAgentEncodedHandoffConformanceDefinitions().map(
    interAgentEncodedHandoffConformanceEntryBase
  );
}

function interAgentEncodedHandoffConformanceSummary(entries, options) {
  const countByFamily = Object.fromEntries(
    INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_FAMILIES.map((family) => [
      family,
      entries.filter((entry) => entry.handoffFamily === family).length
    ])
  );
  const countBySourceActor = Object.fromEntries(
    INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_ACTORS.map((actor) => [
      actor,
      entries.filter((entry) => entry.sourceActor === actor).length
    ])
  );
  const countByTargetActor = Object.fromEntries(
    INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_ACTORS.map((actor) => [
      actor,
      entries.filter((entry) => entry.targetActor === actor).length
    ])
  );
  const countByEncodedHandoffMode = Object.fromEntries(
    INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_MODES.map((mode) => [
      mode,
      entries.filter((entry) => entry.encodedHandoffMode === mode).length
    ])
  );

  return {
    interAgentEncodedHandoffConformanceKind:
      INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_KIND,
    handoffEntryCount: entries.length,
    handoffIds: entries.map((entry) => entry.handoffId),
    oneClickOptionCount: options.length,
    oneClickOptionIds: options.map((option) => option.optionId),
    handoffFamilies: [...INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_FAMILIES],
    sourceTargetActors: [...INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_ACTORS],
    currentStatusValues: [...INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_STATUSES],
    encodedHandoffModes: [...INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_MODES],
    countByFamily,
    countBySourceActor,
    countByTargetActor,
    countByEncodedHandoffMode,
    glossopetraeArchitectureReferenceOnly: true,
    glossopetraeCopiedVendoredInstalledImportedIntegrated: false,
    interAgentEncodedHandoffMetadataOnly: true,
    deterministicProtocolSpecIdentityMetadataRecorded: true,
    sharedHandoffConformanceExpectationsRecorded: true,
    locusMediatedHarnessBridgeMetadataOnly: true,
    fabricCoordinationEnvelopeMetadataOnly: true,
    operatorPlaintextFinalOutputTranslatorRequirementRecorded: true,
    oneClickOperatorOptionMetadataOnly: true,
    rawProtocolAuditVisibilityRequired: true,
    futureProtocolReferencesMetadataOnly: true,
    encodedContentCannotChangeReportRunsChecks: true,
    encodedContentCannotAuthorizeRuntime: true,
    encodedContentCannotExposeCommands: true,
    encodedContentCannotBypassBlockedCliBehavior: true,
    allBlockedAuthorizationFlagsFalse: true,
    allUnsafeEncodedHandoffRuntimeFlagsFalse: true,
    allRuntimeEffectsFalse: true,
    allEntriesNonAuthorizing: true
  };
}

function interAgentEncodedHandoffConformanceValidationRules() {
  return {
    missingRequiredFieldsFailClosed: true,
    unknownHandoffFamiliesFailClosed: true,
    unknownSourceTargetActorsFailClosed: true,
    unknownEncodedHandoffModesFailClosed: true,
    unknownCurrentStatusesFailClosed: true,
    enabledAuthorizationFlagsFailClosed: true,
    reportRunsChecksTrueFailClosed: true,
    runtimeAuthorizationAttemptsFailClosed: true,
    commandExposureAttemptsFailClosed: true,
    blockedCliBypassAttemptsFailClosed: true,
    hiddenCodecTranslatorEncoderDecoderConlangExecutionSemanticsFailClosed:
      true,
    hiddenSteganographyCovertChannelTokenizerExploitGuardrailEvasionBypassSemanticsFailClosed:
      true,
    hiddenImportExportPackagePersistenceSemanticsFailClosed: true,
    hiddenFabricWebsocketHttpMcpTaskRuntimeSemanticsFailClosed: true,
    secureDropImplementationSemanticsFailClosed: true,
    unsafeRuntimeCommandConnectorFabricWebsocketHttpMcpTaskSecureDropServiceDiscoveryScheduleFilesystemProcessFlagsFailClosed:
      true,
    nestedUnsafeFlagsFailClosed: true,
    noncanonicalHandoffEntriesFailClosed: true,
    validationImplementsEncodedHandoffRuntime: false,
    validationImplementsCodec: false,
    validationImplementsTranslatorRuntime: false,
    validationImplementsEncoderDecoder: false,
    validationImplementsConlangGenerator: false,
    validationImplementsStegoOrCovertChannel: false,
    validationImplementsTransport: false,
    validationImplementsFabricRuntime: false,
    validationImplementsBackendApiServer: false,
    validationImplementsImportExport: false,
    validationImplementsPackagePersistence: false,
    validationRunsRuntime: false
  };
}

function interAgentEncodedHandoffConformanceGaps() {
  return [
    "No encoded handoff protocol schema has been promoted into an executable codec, translator, encoder, decoder, conlang generator, or protocol runtime.",
    "Locus-mediated harness bridge behavior is metadata-only; no Locus integration, display controls, command exposure, runtime channel, or external harness bridge exists.",
    "Fabric remains a future coordination envelope only and has no bus, broker, transport, adapter, connector, registry, scheduler, importer, exporter, package distributor, or task executor.",
    "Operator plaintext final-output translation and raw protocol/audit visibility are requirements only; no translator runtime, transcript persistence, audit writer, or UI exists.",
    "Future protocol references such as A2A, ACP, AMP, ANP, Agora, LMOS, MCP, Fabric, Matrix, gRPC, MQTT, and libp2p remain metadata-only and require separate authorization."
  ];
}

function interAgentEncodedHandoffConformanceState(reviewedAt) {
  const handoffEntries = interAgentEncodedHandoffConformanceEntries();
  const oneClickOptions = interAgentEncodedHandoffConformanceOneClickOptions();

  return {
    schema: INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_STATE_SCHEMA,
    schemaVersion: INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_VERSION,
    stateKind: INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_KIND,
    stateMode: "review-only",
    reviewedAt,
    sourcePhaseContext: {
      phase559FabricAwareApiBackendContractBoundaryMap:
        "tests/fixtures/host-policy/phase5-59/fabric-aware-api-backend-contract-boundary-map.json",
      glossopetraeArchitectureReferenceOnly: true,
      glossopetraeCopiedVendoredInstalledImportedIntegrated: false,
      locusMediatedCommunicationWithOtherHarnessesMetadataOnly: true,
      fabricCoordinationEnvelopeMetadataOnly: true,
      secureDropCanonicalOwner: "content-fabric",
      futureProtocolReferencesMetadataOnly: true,
      runtimeStillBlocked: true
    },
    handoffEntries,
    oneClickOptions,
    handoffConformanceSummary:
      interAgentEncodedHandoffConformanceSummary(handoffEntries, oneClickOptions),
    invalidHandoffCasePolicy:
      interAgentEncodedHandoffConformanceValidationRules(),
    topInterAgentHandoffFabricApiBackendGaps:
      interAgentEncodedHandoffConformanceGaps(),
    recommendedNextPhase:
      "phase-5.61-review-only-database-storage-contract-boundary-map",
    interAgentEncodedHandoffConformanceOnly: true,
    reviewOnly: true,
    metadataOnly: true,
    authoritative: false,
    nonAuthorizingProof: true,
    reportRunsChecks: false,
    encodedHandoffRuntimeImplementedByArdyn: false,
    codecImplemented: false,
    translatorRuntimeImplemented: false,
    encoderImplemented: false,
    decoderImplemented: false,
    conlangGeneratorImplemented: false,
    seedGeneratorImplemented: false,
    protocolRuntimeImplemented: false,
    covertChannelImplemented: false,
    stegoLayerImplemented: false,
    semanticStegoImplemented: false,
    tokenExploiterImplemented: false,
    guardrailEvasionImplemented: false,
    bypassPathImplemented: false,
    hiddenPayloadPathImplemented: false,
    transportImplementedByArdyn: false,
    fabricRuntimeImplementedByArdyn: false,
    backendRuntimeImplementedByArdyn: false,
    apiEndpointImplementedByArdyn: false,
    serverImplementedByArdyn: false,
    importExportPathImplementedByArdyn: false,
    packageDistributionImplementedByArdyn: false,
    persistenceImplementedByArdyn: false,
    commandExposureEnabled: false,
    commandRuntimeControlEnabled: false,
    runtimeExecutionEnabled: false,
    databaseStorageRuntimeWritesEnabled: false,
    secretsRuntimeIngestionEnabled: false,
    connectorGrantProduced: false,
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

function interAgentEncodedHandoffConformanceResult({
  reviewedAt,
  reviewedAtDefaulted,
  classification,
  accepted,
  interAgentEncodedHandoffConformance
}) {
  return {
    schema: INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_SCHEMA,
    schemaVersion: INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_VERSION,
    interAgentEncodedHandoffConformanceKind:
      INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_KIND,
    interAgentEncodedHandoffConformanceMode: "review-only",
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    interAgentEncodedHandoffConformanceProduced: accepted,
    interAgentEncodedHandoffConformance,
    handoffConformanceSummary: accepted
      ? interAgentEncodedHandoffConformance.handoffConformanceSummary
      : null,
    handoffEntries: accepted
      ? interAgentEncodedHandoffConformance.handoffEntries
      : [],
    oneClickOptions: accepted
      ? interAgentEncodedHandoffConformance.oneClickOptions
      : [],
    invalidHandoffCasePolicy: accepted
      ? interAgentEncodedHandoffConformance.invalidHandoffCasePolicy
      : interAgentEncodedHandoffConformanceValidationRules(),
    topInterAgentHandoffFabricApiBackendGaps: accepted
      ? interAgentEncodedHandoffConformance
          .topInterAgentHandoffFabricApiBackendGaps
      : [],
    recommendedNextPhase: accepted
      ? interAgentEncodedHandoffConformance.recommendedNextPhase
      : null,
    interAgentEncodedHandoffConformanceOnly: true,
    reviewOnly: true,
    metadataOnly: true,
    authoritative: false,
    nonAuthorizingProof: true,
    reportRunsChecks: false,
    encodedHandoffRuntimeImplementedByArdyn: false,
    codecImplemented: false,
    translatorRuntimeImplemented: false,
    encoderImplemented: false,
    decoderImplemented: false,
    conlangGeneratorImplemented: false,
    seedGeneratorImplemented: false,
    protocolRuntimeImplemented: false,
    covertChannelImplemented: false,
    stegoLayerImplemented: false,
    semanticStegoImplemented: false,
    tokenExploiterImplemented: false,
    guardrailEvasionImplemented: false,
    bypassPathImplemented: false,
    hiddenPayloadPathImplemented: false,
    transportImplementedByArdyn: false,
    fabricRuntimeImplementedByArdyn: false,
    backendRuntimeImplementedByArdyn: false,
    apiEndpointImplementedByArdyn: false,
    serverImplementedByArdyn: false,
    importExportPathImplementedByArdyn: false,
    packageDistributionImplementedByArdyn: false,
    persistenceImplementedByArdyn: false,
    commandExposureEnabled: false,
    commandRuntimeControlEnabled: false,
    runtimeExecutionEnabled: false,
    databaseStorageRuntimeWritesEnabled: false,
    secretsRuntimeIngestionEnabled: false,
    connectorGrantProduced: false,
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
            encodedHandoffRuntimeAuthorized: false,
            commandExposureAuthorized: false,
            reportRunsChecks: false
          }
        ],
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

export function createInterAgentEncodedHandoffConformanceForReview(
  input = {}
) {
  const inputRecord =
    interAgentEncodedHandoffConformanceInputRecord(input);
  const reviewedAt =
    interAgentEncodedHandoffConformanceReviewedAt(inputRecord);
  const reviewedAtDefaulted = isReviewedAtDefaulted(inputRecord);
  const classification =
    interAgentEncodedHandoffConformanceInputClassification(inputRecord);
  const accepted =
    classification ===
    VALID_INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_CLASSIFICATION;
  const interAgentEncodedHandoffConformance = accepted
    ? interAgentEncodedHandoffConformanceState(reviewedAt)
    : null;

  return interAgentEncodedHandoffConformanceResult({
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    accepted,
    interAgentEncodedHandoffConformance
  });
}

const DATABASE_STORAGE_CONTRACT_BOUNDARY_MAP_STATE_SCHEMA =
  "ardyn.phase-5.61.database-storage-contract-boundary-map-state";
const VALID_DATABASE_STORAGE_CONTRACT_BOUNDARY_MAP_CLASSIFICATION =
  "valid_database_storage_contract_boundary_map_runtime_still_blocked";
const MALFORMED_DATABASE_STORAGE_CONTRACT_BOUNDARY_MAP_CLASSIFICATION =
  "malformed_database_storage_contract_boundary_map_input_rejected";

const DATABASE_STORAGE_CONTRACT_BOUNDARY_FAMILIES = Object.freeze([
  "database_contract",
  "storage_contract",
  "cache_contract",
  "invalidation_contract",
  "data_isolation_contract",
  "transcript_storage_contract",
  "audit_storage_contract",
  "artifact_storage_contract",
  "retention_policy_contract",
  "backup_recovery_contract"
]);
const DATABASE_STORAGE_CONTRACT_BOUNDARY_RELATED_SYSTEMS = Object.freeze([
  "ardyn",
  "ardyn-subagent",
  "locus",
  "multiverse",
  "content-fabric",
  "repo-family"
]);
const DATABASE_STORAGE_CONTRACT_BOUNDARY_STATUSES = Object.freeze([
  "metadata_only",
  "blocked",
  "future_contract_required"
]);
const DATABASE_STORAGE_CONTRACT_BOUNDARY_DATA_CLASSIFICATIONS = Object.freeze([
  "no_live_data",
  "metadata_only",
  "future_transcript_data",
  "future_audit_data",
  "future_user_content",
  "future_secure_drop_metadata"
]);
const DATABASE_STORAGE_CONTRACT_BOUNDARY_REQUIRED_FIELDS = Object.freeze([
  "boundaryId",
  "boundaryFamily",
  "relatedSystem",
  "currentStatus",
  "allowedCurrentBehavior",
  "forbiddenCurrentBehavior",
  "requiredFutureContractBeforeImplementation",
  "requiredFutureAuthorizationPhaseBeforeRuntime",
  "dataClassificationNotes",
  "dataIsolationExpectation",
  "cacheInvalidationExpectation",
  "rlsAppPermissionExpectation",
  "retentionDeletionExpectation",
  "backupRecoveryExpectation",
  "transcriptAuditWriteBoundaryNote",
  "locusRoleDescription",
  "multiverseRoleDescription",
  "fabricRoleDescription",
  "secureDropRoleDescription",
  "explicitBlockedAuthorizationFlags",
  "unsafeDatabaseStorageRuntimeFlags",
  "nonAuthorizingProof"
]);
const DATABASE_STORAGE_CONTRACT_BOUNDARY_ALLOWED_TOP_LEVEL_FIELDS =
  Object.freeze(["reviewedAt", "boundaryEntries"]);
const DATABASE_STORAGE_CONTRACT_BOUNDARY_UNSAFE_FIELDS = Object.freeze([
  "databaseClientImplemented",
  "databaseConnectionEnabled",
  "databaseSchemaImplemented",
  "databaseMigrationImplemented",
  "schemaMigrationExecuted",
  "rlsPolicyImplemented",
  "rlsPolicyApplied",
  "appPermissionPolicyApplied",
  "storageAdapterImplemented",
  "storageWriteEnabled",
  "filesystemWriteEnabled",
  "cacheEngineImplemented",
  "cacheRuntimeEnabled",
  "cacheInvalidationRuntimeImplemented",
  "invalidationJobImplemented",
  "transcriptWriterImplemented",
  "transcriptRuntimeWriteEnabled",
  "auditWriterImplemented",
  "auditRuntimeWriteEnabled",
  "persistenceImplementedByArdyn",
  "persistenceRuntimeEnabled",
  "backupJobImplemented",
  "restoreJobImplemented",
  "retentionDeletionJobImplemented",
  "exportJobImplemented",
  "importJobImplemented",
  "importExportPathImplementedByArdyn",
  "packageDistributionImplementedByArdyn",
  "packageWriterImplementedByArdyn",
  "packageReaderImplementedByArdyn",
  "backendRuntimeImplementedByArdyn",
  "apiEndpointImplementedByArdyn",
  "serverImplementedByArdyn",
  "websocketHttpTransportImplementedByArdyn",
  "fabricRuntimeImplementedByArdyn",
  "fabricBusImplementedByArdyn",
  "connectorGrantProduced",
  "mcpToolExposureEnabled",
  "taskExecutionEnabled",
  "secureDropImplemented",
  "secureDropCryptoImplemented",
  "secureDropTransportImplemented",
  "secureDropStegoImplemented",
  "secureDropSendReceiveImplemented",
  "secureDropInboxPollingEnabled",
  "st3ggVendored",
  "encodedHandoffRuntimeImplementedByArdyn",
  "codecImplemented",
  "translatorRuntimeImplemented",
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
  "secretsRuntimeIngestionEnabled",
  "reportRunsChecks",
  "blockedCliBypassEnabled"
]);
const DATABASE_STORAGE_CONTRACT_BOUNDARY_AUTHORIZATION_FIELDS = Object.freeze([
  "runtimeAuthorized",
  "runtimeAuthorizationGranted",
  "databaseAuthorizationGranted",
  "storageAuthorizationGranted",
  "persistenceAuthorizationGranted",
  "migrationAuthorizationGranted",
  "rlsAuthorizationGranted",
  "backupRestoreAuthorizationGranted",
  "commandExposureAuthorizationGranted",
  "authorizesRuntime",
  "approvalDecisionProduced",
  "approvalGrantProduced"
]);
const DATABASE_STORAGE_CONTRACT_BOUNDARY_COMMAND_FIELDS = Object.freeze([
  "commandExposureEnabled",
  "commandRuntimeControlEnabled",
  "commandsExposed",
  "exposesCommands",
  "runtimeCommandEnabled",
  "cliCommandExposed"
]);
const DATABASE_STORAGE_CONTRACT_BOUNDARY_BLOCKED_CLI_BYPASS_FIELDS =
  Object.freeze([
    "blockedCliBypassEnabled",
    "dryRunBypassesBlock",
    "serveRuntimeBypassEnabled",
    "bypassBlockedCommandBehavior",
    "blockedCommandOverride"
  ]);
const DATABASE_STORAGE_CONTRACT_BOUNDARY_DATABASE_PRESENT_FIELDS =
  Object.freeze([
    "databaseUrl",
    "databaseDsn",
    "dbConnectionString",
    "connectionPool",
    "postgresClient",
    "sqliteDatabasePath",
    "prismaClient",
    "databaseConnectionFactory",
    "storageBucket",
    "s3Bucket",
    "blobStorageContainer"
  ]);
const DATABASE_STORAGE_CONTRACT_BOUNDARY_FILESYSTEM_PRESENT_FIELDS =
  Object.freeze([
    "writeFilePath",
    "appendFilePath",
    "filesystemWritePath",
    "outputPath",
    "storageDirectory",
    "filePersistencePath",
    "filesystemWriter"
  ]);
const DATABASE_STORAGE_CONTRACT_BOUNDARY_TRANSCRIPT_AUDIT_PRESENT_FIELDS =
  Object.freeze([
    "transcriptWriter",
    "auditWriter",
    "transcriptFilePath",
    "auditFilePath",
    "transcriptStoragePath",
    "auditStoragePath",
    "stdoutRuntimeWriter",
    "stderrRuntimeWriter"
  ]);
const DATABASE_STORAGE_CONTRACT_BOUNDARY_CACHE_PRESENT_FIELDS = Object.freeze([
  "cacheUrl",
  "redisUrl",
  "cacheClient",
  "cacheEngine",
  "invalidationTopic",
  "invalidationQueue",
  "cdnPurgeEndpoint"
]);
const DATABASE_STORAGE_CONTRACT_BOUNDARY_MIGRATION_PRESENT_FIELDS =
  Object.freeze([
    "migrationCommand",
    "migrationFile",
    "schemaMigrationPath",
    "ddlStatement",
    "rlsPolicyFile",
    "retentionJobCommand",
    "backupCommand",
    "restoreCommand"
  ]);
const DATABASE_STORAGE_CONTRACT_BOUNDARY_IMPORT_PRESENT_FIELDS = Object.freeze([
  "importCommand",
  "exportCommand",
  "packagePath",
  "packageWriterPath",
  "packageReaderPath",
  "persistenceDsn",
  "dbWriteTarget",
  "storageWriteTarget"
]);
const DATABASE_STORAGE_CONTRACT_BOUNDARY_FABRIC_PRESENT_FIELDS = Object.freeze([
  "fabricBusTopic",
  "fabricBrokerUrl",
  "fabricTransportUrl",
  "websocketRoute",
  "httpRoute",
  "mcpToolName",
  "taskExecutor",
  "serverEndpointUrl",
  "apiEndpointUrl",
  "runtimeEntrypoint"
]);
const DATABASE_STORAGE_CONTRACT_BOUNDARY_SECURE_DROP_TRUE_FIELDS =
  Object.freeze([
    "secureDropImplemented",
    "secureDropCryptoImplemented",
    "secureDropTransportImplemented",
    "secureDropStegoImplemented",
    "secureDropSendReceiveImplemented",
    "secureDropInboxPollingEnabled",
    "secureDropFileSelectionEnabled",
    "secureDropConnectorIngestionEnabled",
    "st3ggVendored"
  ]);

function databaseStorageContractBoundaryMapInputRecord(input) {
  return isPlainObjectRecord(input) ? input : null;
}

function databaseStorageContractBoundaryMapReviewedAt(inputRecord) {
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

function databaseStorageContractBoundaryMapInputMalformed(inputRecord) {
  return (
    inputRecord === null ||
    (Object.prototype.hasOwnProperty.call(inputRecord, "reviewedAt") &&
      !isUtcIsoTimestampWithMilliseconds(inputRecord.reviewedAt)) ||
    (Object.prototype.hasOwnProperty.call(inputRecord, "boundaryEntries") &&
      !Array.isArray(inputRecord.boundaryEntries))
  );
}

function databaseStorageContractBoundaryMapInputEntries(inputRecord) {
  return Array.isArray(inputRecord?.boundaryEntries)
    ? inputRecord.boundaryEntries
    : null;
}

function databaseStorageContractBoundaryMapHasUnknownTopLevelField(
  inputRecord
) {
  if (inputRecord === null) {
    return false;
  }

  return Object.keys(inputRecord).some(
    (field) =>
      !DATABASE_STORAGE_CONTRACT_BOUNDARY_ALLOWED_TOP_LEVEL_FIELDS.includes(
        field
      )
  );
}

function databaseStorageContractBoundaryMapContainsTrue(value) {
  if (value === true) {
    return true;
  }

  if (Array.isArray(value)) {
    return value.some(databaseStorageContractBoundaryMapContainsTrue);
  }

  if (isPlainObjectRecord(value)) {
    return Object.values(value).some(
      databaseStorageContractBoundaryMapContainsTrue
    );
  }

  return false;
}

function databaseStorageContractBoundaryMapHasTrueFieldDeep(value, fields) {
  if (Array.isArray(value)) {
    return value.some((item) =>
      databaseStorageContractBoundaryMapHasTrueFieldDeep(item, fields)
    );
  }

  if (!isPlainObjectRecord(value)) {
    return false;
  }

  for (const [key, nested] of Object.entries(value)) {
    if (fields.includes(key) && nested === true) {
      return true;
    }

    if (databaseStorageContractBoundaryMapHasTrueFieldDeep(nested, fields)) {
      return true;
    }
  }

  return false;
}

function databaseStorageContractBoundaryMapHasPresentFieldDeep(value, fields) {
  if (Array.isArray(value)) {
    return value.some((item) =>
      databaseStorageContractBoundaryMapHasPresentFieldDeep(item, fields)
    );
  }

  if (!isPlainObjectRecord(value)) {
    return false;
  }

  for (const [key, nested] of Object.entries(value)) {
    if (fields.includes(key)) {
      return true;
    }

    if (databaseStorageContractBoundaryMapHasPresentFieldDeep(nested, fields)) {
      return true;
    }
  }

  return false;
}

function databaseStorageContractBoundaryMapContainsEntryIssue(
  entries,
  predicate
) {
  return entries !== null && entries.some((entry) => predicate(entry));
}

function databaseStorageContractBoundaryMapMissingRequiredField(entry) {
  if (!isPlainObjectRecord(entry)) {
    return true;
  }

  return DATABASE_STORAGE_CONTRACT_BOUNDARY_REQUIRED_FIELDS.some(
    (field) => !Object.prototype.hasOwnProperty.call(entry, field)
  );
}

function databaseStorageContractBoundaryMapDataClassificationsMalformed(entry) {
  return (
    !Array.isArray(entry.dataClassificationNotes) ||
    entry.dataClassificationNotes.length === 0 ||
    entry.dataClassificationNotes.some(
      (note) =>
        !DATABASE_STORAGE_CONTRACT_BOUNDARY_DATA_CLASSIFICATIONS.includes(note)
    )
  );
}

function databaseStorageContractBoundaryMapEntryMalformed(entry) {
  return (
    databaseStorageContractBoundaryMapMissingRequiredField(entry) ||
    typeof entry.boundaryId !== "string" ||
    entry.boundaryId.length === 0 ||
    !Array.isArray(entry.allowedCurrentBehavior) ||
    entry.allowedCurrentBehavior.length < 2 ||
    entry.allowedCurrentBehavior.some(
      (behavior) => typeof behavior !== "string" || behavior.length === 0
    ) ||
    !Array.isArray(entry.forbiddenCurrentBehavior) ||
    entry.forbiddenCurrentBehavior.length < 25 ||
    entry.forbiddenCurrentBehavior.some(
      (behavior) => typeof behavior !== "string" || behavior.length === 0
    ) ||
    typeof entry.requiredFutureContractBeforeImplementation !== "string" ||
    entry.requiredFutureContractBeforeImplementation.length === 0 ||
    typeof entry.requiredFutureAuthorizationPhaseBeforeRuntime !== "string" ||
    entry.requiredFutureAuthorizationPhaseBeforeRuntime.length === 0 ||
    databaseStorageContractBoundaryMapDataClassificationsMalformed(entry) ||
    typeof entry.dataIsolationExpectation !== "string" ||
    entry.dataIsolationExpectation.length === 0 ||
    typeof entry.cacheInvalidationExpectation !== "string" ||
    entry.cacheInvalidationExpectation.length === 0 ||
    typeof entry.rlsAppPermissionExpectation !== "string" ||
    entry.rlsAppPermissionExpectation.length === 0 ||
    typeof entry.retentionDeletionExpectation !== "string" ||
    entry.retentionDeletionExpectation.length === 0 ||
    typeof entry.backupRecoveryExpectation !== "string" ||
    entry.backupRecoveryExpectation.length === 0 ||
    typeof entry.transcriptAuditWriteBoundaryNote !== "string" ||
    entry.transcriptAuditWriteBoundaryNote.length === 0 ||
    typeof entry.locusRoleDescription !== "string" ||
    entry.locusRoleDescription.length === 0 ||
    typeof entry.multiverseRoleDescription !== "string" ||
    entry.multiverseRoleDescription.length === 0 ||
    typeof entry.fabricRoleDescription !== "string" ||
    entry.fabricRoleDescription.length === 0 ||
    typeof entry.secureDropRoleDescription !== "string" ||
    entry.secureDropRoleDescription.length === 0 ||
    !isPlainObjectRecord(entry.explicitBlockedAuthorizationFlags) ||
    !isPlainObjectRecord(entry.unsafeDatabaseStorageRuntimeFlags) ||
    entry.nonAuthorizingProof !== true
  );
}

function databaseStorageContractBoundaryMapAuthorizationFlagEnabled(value) {
  return (
    databaseStorageContractBoundaryMapContainsTrue(
      value?.explicitBlockedAuthorizationFlags
    ) ||
    databaseStorageContractBoundaryMapContainsTrue(value?.authorizationFlags)
  );
}

function databaseStorageContractBoundaryMapUnsafeFlagEnabled(value) {
  return (
    databaseStorageContractBoundaryMapContainsTrue(
      value?.unsafeDatabaseStorageRuntimeFlags
    ) ||
    databaseStorageContractBoundaryMapHasTrueFieldDeep(
      value,
      DATABASE_STORAGE_CONTRACT_BOUNDARY_UNSAFE_FIELDS
    )
  );
}

function databaseStorageContractBoundaryMapCanonical(entries) {
  if (entries === null) {
    return true;
  }

  return (
    JSON.stringify(entries) ===
    JSON.stringify(databaseStorageContractBoundaryMapEntries())
  );
}

function databaseStorageContractBoundaryMapInputClassification(inputRecord) {
  if (databaseStorageContractBoundaryMapInputMalformed(inputRecord)) {
    return MALFORMED_DATABASE_STORAGE_CONTRACT_BOUNDARY_MAP_CLASSIFICATION;
  }

  const entries = databaseStorageContractBoundaryMapInputEntries(inputRecord);

  if (
    databaseStorageContractBoundaryMapContainsEntryIssue(
      entries,
      databaseStorageContractBoundaryMapMissingRequiredField
    )
  ) {
    return "missing_required_database_storage_contract_boundary_entry_rejected";
  }

  if (
    databaseStorageContractBoundaryMapContainsEntryIssue(
      entries,
      (entry) =>
        !DATABASE_STORAGE_CONTRACT_BOUNDARY_FAMILIES.includes(
          entry.boundaryFamily
        )
    )
  ) {
    return "unknown_boundary_family_database_storage_contract_boundary_map_input_rejected";
  }

  if (
    databaseStorageContractBoundaryMapContainsEntryIssue(
      entries,
      (entry) =>
        !DATABASE_STORAGE_CONTRACT_BOUNDARY_RELATED_SYSTEMS.includes(
          entry.relatedSystem
        )
    )
  ) {
    return "unknown_related_system_database_storage_contract_boundary_map_input_rejected";
  }

  if (
    databaseStorageContractBoundaryMapContainsEntryIssue(
      entries,
      (entry) =>
        !DATABASE_STORAGE_CONTRACT_BOUNDARY_STATUSES.includes(
          entry.currentStatus
        )
    )
  ) {
    return "unknown_current_status_database_storage_contract_boundary_map_input_rejected";
  }

  if (
    databaseStorageContractBoundaryMapContainsEntryIssue(
      entries,
      (entry) => databaseStorageContractBoundaryMapDataClassificationsMalformed(entry)
    )
  ) {
    return "unknown_data_classification_database_storage_contract_boundary_map_input_rejected";
  }

  if (
    databaseStorageContractBoundaryMapContainsEntryIssue(
      entries,
      databaseStorageContractBoundaryMapEntryMalformed
    )
  ) {
    return MALFORMED_DATABASE_STORAGE_CONTRACT_BOUNDARY_MAP_CLASSIFICATION;
  }

  if (
    databaseStorageContractBoundaryMapContainsEntryIssue(
      entries,
      databaseStorageContractBoundaryMapAuthorizationFlagEnabled
    ) ||
    databaseStorageContractBoundaryMapAuthorizationFlagEnabled(inputRecord)
  ) {
    return "authorization_flags_enabled_database_storage_contract_boundary_map_input_rejected";
  }

  if (
    databaseStorageContractBoundaryMapHasTrueFieldDeep(inputRecord, [
      "reportRunsChecks"
    ])
  ) {
    return "report_runs_checks_true_database_storage_contract_boundary_map_input_rejected";
  }

  if (
    databaseStorageContractBoundaryMapHasTrueFieldDeep(
      inputRecord,
      DATABASE_STORAGE_CONTRACT_BOUNDARY_AUTHORIZATION_FIELDS
    )
  ) {
    return "runtime_authorization_attempt_database_storage_contract_boundary_map_input_rejected";
  }

  if (
    databaseStorageContractBoundaryMapHasTrueFieldDeep(
      inputRecord,
      DATABASE_STORAGE_CONTRACT_BOUNDARY_COMMAND_FIELDS
    )
  ) {
    return "command_exposure_attempt_database_storage_contract_boundary_map_input_rejected";
  }

  if (
    databaseStorageContractBoundaryMapHasTrueFieldDeep(
      inputRecord,
      DATABASE_STORAGE_CONTRACT_BOUNDARY_BLOCKED_CLI_BYPASS_FIELDS
    )
  ) {
    return "blocked_cli_bypass_attempt_database_storage_contract_boundary_map_input_rejected";
  }

  if (
    databaseStorageContractBoundaryMapHasPresentFieldDeep(
      inputRecord,
      DATABASE_STORAGE_CONTRACT_BOUNDARY_DATABASE_PRESENT_FIELDS
    )
  ) {
    return "hidden_database_connection_semantics_database_storage_contract_boundary_map_input_rejected";
  }

  if (
    databaseStorageContractBoundaryMapHasPresentFieldDeep(
      inputRecord,
      DATABASE_STORAGE_CONTRACT_BOUNDARY_FILESYSTEM_PRESENT_FIELDS
    )
  ) {
    return "hidden_filesystem_write_semantics_database_storage_contract_boundary_map_input_rejected";
  }

  if (
    databaseStorageContractBoundaryMapHasPresentFieldDeep(
      inputRecord,
      DATABASE_STORAGE_CONTRACT_BOUNDARY_TRANSCRIPT_AUDIT_PRESENT_FIELDS
    )
  ) {
    return "hidden_transcript_audit_write_semantics_database_storage_contract_boundary_map_input_rejected";
  }

  if (
    databaseStorageContractBoundaryMapHasPresentFieldDeep(
      inputRecord,
      DATABASE_STORAGE_CONTRACT_BOUNDARY_CACHE_PRESENT_FIELDS
    )
  ) {
    return "hidden_cache_invalidation_runtime_semantics_database_storage_contract_boundary_map_input_rejected";
  }

  if (
    databaseStorageContractBoundaryMapHasPresentFieldDeep(
      inputRecord,
      DATABASE_STORAGE_CONTRACT_BOUNDARY_MIGRATION_PRESENT_FIELDS
    )
  ) {
    return "hidden_migration_schema_change_semantics_database_storage_contract_boundary_map_input_rejected";
  }

  if (
    databaseStorageContractBoundaryMapHasPresentFieldDeep(
      inputRecord,
      DATABASE_STORAGE_CONTRACT_BOUNDARY_IMPORT_PRESENT_FIELDS
    )
  ) {
    return "hidden_import_export_package_persistence_semantics_database_storage_contract_boundary_map_input_rejected";
  }

  if (
    databaseStorageContractBoundaryMapHasTrueFieldDeep(
      inputRecord,
      DATABASE_STORAGE_CONTRACT_BOUNDARY_SECURE_DROP_TRUE_FIELDS
    )
  ) {
    return "hidden_secure_drop_implementation_semantics_database_storage_contract_boundary_map_input_rejected";
  }

  if (
    databaseStorageContractBoundaryMapHasPresentFieldDeep(
      inputRecord,
      DATABASE_STORAGE_CONTRACT_BOUNDARY_FABRIC_PRESENT_FIELDS
    )
  ) {
    return "hidden_fabric_websocket_http_mcp_task_runtime_semantics_database_storage_contract_boundary_map_input_rejected";
  }

  if (
    databaseStorageContractBoundaryMapUnsafeFlagEnabled(inputRecord) ||
    databaseStorageContractBoundaryMapContainsEntryIssue(
      entries,
      databaseStorageContractBoundaryMapUnsafeFlagEnabled
    )
  ) {
    return "unsafe_database_storage_cache_persistence_write_migration_rls_backup_restore_retention_runtime_flags_database_storage_contract_boundary_map_input_rejected";
  }

  if (
    databaseStorageContractBoundaryMapContainsEntryIssue(entries, (entry) =>
      databaseStorageContractBoundaryMapContainsTrue(entry?.runtimeEffect)
    ) ||
    databaseStorageContractBoundaryMapContainsTrue(inputRecord?.runtimeEffect)
  ) {
    return "nested_unsafe_flags_database_storage_contract_boundary_map_input_rejected";
  }

  if (databaseStorageContractBoundaryMapHasUnknownTopLevelField(inputRecord)) {
    return "unknown_top_level_field_database_storage_contract_boundary_map_input_rejected";
  }

  if (!databaseStorageContractBoundaryMapCanonical(entries)) {
    return "noncanonical_database_storage_contract_boundary_map_input_rejected";
  }

  return VALID_DATABASE_STORAGE_CONTRACT_BOUNDARY_MAP_CLASSIFICATION;
}

function databaseStorageContractBoundaryMapAuthorizationFlags() {
  return {
    databaseRuntimeAuthorizationGranted: false,
    storageRuntimeAuthorizationGranted: false,
    cacheRuntimeAuthorizationGranted: false,
    migrationAuthorizationGranted: false,
    rlsPolicyAuthorizationGranted: false,
    transcriptWriteAuthorizationGranted: false,
    auditWriteAuthorizationGranted: false,
    backupRestoreAuthorizationGranted: false,
    retentionDeletionAuthorizationGranted: false,
    importExportAuthorizationGranted: false,
    packagePersistenceAuthorizationGranted: false,
    backendApiServerAuthorizationGranted: false,
    fabricRuntimeAuthorizationGranted: false,
    connectorGrantProduced: false,
    mcpToolExposureAuthorizationGranted: false,
    taskExecutionAuthorizationGranted: false,
    secureDropAuthorizationGranted: false,
    encodedHandoffRuntimeAuthorizationGranted: false,
    serviceDiscoveryAuthorizationGranted: false,
    scheduleEnforcementAuthorizationGranted: false,
    filesystemProcessAuthorizationGranted: false,
    commandExposureAuthorizationGranted: false,
    approvalGrantProduced: false
  };
}

function databaseStorageContractBoundaryMapUnsafeFlags() {
  return Object.fromEntries(
    DATABASE_STORAGE_CONTRACT_BOUNDARY_UNSAFE_FIELDS.map((field) => [
      field,
      false
    ])
  );
}

function databaseStorageContractBoundaryMapEntry(definition) {
  return {
    boundaryId: definition.boundaryId,
    boundaryFamily: definition.boundaryFamily,
    relatedSystem: definition.relatedSystem,
    currentStatus: definition.currentStatus,
    allowedCurrentBehavior: definition.allowedCurrentBehavior,
    forbiddenCurrentBehavior: databaseStorageContractBoundaryMapForbiddenBehavior(),
    requiredFutureContractBeforeImplementation:
      definition.requiredFutureContractBeforeImplementation,
    requiredFutureAuthorizationPhaseBeforeRuntime:
      definition.requiredFutureAuthorizationPhaseBeforeRuntime,
    dataClassificationNotes: definition.dataClassificationNotes,
    dataIsolationExpectation: definition.dataIsolationExpectation,
    cacheInvalidationExpectation: definition.cacheInvalidationExpectation,
    rlsAppPermissionExpectation: definition.rlsAppPermissionExpectation,
    retentionDeletionExpectation: definition.retentionDeletionExpectation,
    backupRecoveryExpectation: definition.backupRecoveryExpectation,
    transcriptAuditWriteBoundaryNote:
      definition.transcriptAuditWriteBoundaryNote,
    locusRoleDescription: definition.locusRoleDescription,
    multiverseRoleDescription: definition.multiverseRoleDescription,
    fabricRoleDescription: definition.fabricRoleDescription,
    secureDropRoleDescription: definition.secureDropRoleDescription,
    productionReadinessAreaReference: {
      phase: "5.48",
      areaNumber: 3,
      areaName: "Database & Storage",
      sourceFixture:
        "tests/fixtures/host-policy/phase5-48/production-readiness-coverage-matrix.json",
      sourceStatus: "deferred",
      representedByPhase561: true,
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
    databaseStorageBoundaryMetadataOnly: true,
    noLiveDataAccessed: true,
    explicitBlockedAuthorizationFlags:
      databaseStorageContractBoundaryMapAuthorizationFlags(),
    unsafeDatabaseStorageRuntimeFlags:
      databaseStorageContractBoundaryMapUnsafeFlags(),
    nonAuthorizingProof: true,
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

function databaseStorageContractBoundaryMapDefinitions() {
  const currentAuthorization =
    "Requires a future runtime, command exposure, storage, persistence, auth, audit, secrets, and process-control authorization phase before any executable behavior.";
  const noConsumerRole =
    "No current role; future consumers may inspect metadata only.";
  const contentFabricSecureDrop =
    "Secure Drop remains canonically owned by content-fabric; Ardyn may reference metadata only and implements no crypto, transport, stego, send/receive, inbox polling, file selection, connector ingestion, secret/vault/env access, or ST3GG wrapping.";

  return [
    {
      boundaryId:
        "phase5-61.ardyn.manifest-review-artifact-metadata.database-boundary",
      boundaryFamily: "database_contract",
      relatedSystem: "ardyn",
      currentStatus: "metadata_only",
      dataClassificationNotes: ["metadata_only", "no_live_data"],
      allowedCurrentBehavior: [
        "Describe future manifest and review artifact metadata storage boundaries.",
        "Keep current artifacts local, deterministic, and non-persisting."
      ],
      requiredFutureContractBeforeImplementation:
        "A future database contract must define schema, ownership, write authority, retention, read scopes, audit visibility, and migration controls.",
      requiredFutureAuthorizationPhaseBeforeRuntime: currentAuthorization,
      dataIsolationExpectation:
        "Future rows must isolate repo, workspace, project, and task identity; current metadata has no live tenant data.",
      cacheInvalidationExpectation:
        "No cache exists; future manifest/review caches need deterministic freshness and invalidation policy.",
      rlsAppPermissionExpectation:
        "Future DB-backed storage requires RLS or equivalent app-permission checks before reads or writes.",
      retentionDeletionExpectation:
        "Future retention and deletion must be explicit before storing review artifacts.",
      backupRecoveryExpectation:
        "Future RTO/RPO and restore tests are required before production storage.",
      transcriptAuditWriteBoundaryNote:
        "No transcript or audit runtime writes are performed.",
      locusRoleDescription: noConsumerRole,
      multiverseRoleDescription: noConsumerRole,
      fabricRoleDescription:
        "Fabric may later envelope artifact references, but no Fabric runtime or database write exists.",
      secureDropRoleDescription: "Not applicable."
    },
    {
      boundaryId:
        "phase5-61.ardyn.approval-prerequisite-metadata.database-boundary",
      boundaryFamily: "database_contract",
      relatedSystem: "ardyn",
      currentStatus: "metadata_only",
      dataClassificationNotes: ["metadata_only"],
      allowedCurrentBehavior: [
        "Describe approval-prerequisite metadata storage needs.",
        "Keep approval metadata non-authorizing and file-fixture backed."
      ],
      requiredFutureContractBeforeImplementation:
        "A future contract must define prerequisite record schema, reviewer identity, revocation, stale-state handling, and non-authorizing display semantics.",
      requiredFutureAuthorizationPhaseBeforeRuntime: currentAuthorization,
      dataIsolationExpectation:
        "Future approval metadata must isolate reviewer, workspace, task, and phase context.",
      cacheInvalidationExpectation:
        "Future caches must invalidate on revocation, stale source, or phase boundary changes.",
      rlsAppPermissionExpectation:
        "Future access requires RLS/app permissions that never trust client-claimed role.",
      retentionDeletionExpectation:
        "Future deletion must preserve non-repudiation requirements without retaining unauthorized live data.",
      backupRecoveryExpectation:
        "Future backups need revocation-aware restore semantics.",
      transcriptAuditWriteBoundaryNote:
        "No approval transcript or audit write path is implemented.",
      locusRoleDescription: noConsumerRole,
      multiverseRoleDescription: noConsumerRole,
      fabricRoleDescription:
        "Fabric may later coordinate prerequisite metadata envelope identity only.",
      secureDropRoleDescription: "Not applicable."
    },
    {
      boundaryId:
        "phase5-61.ardyn.display-conformance-fixture.artifact-storage-boundary",
      boundaryFamily: "artifact_storage_contract",
      relatedSystem: "ardyn",
      currentStatus: "metadata_only",
      dataClassificationNotes: ["metadata_only"],
      allowedCurrentBehavior: [
        "Describe storage expectations for display/conformance fixture examples.",
        "Keep fixtures static, local, and committed as review metadata."
      ],
      requiredFutureContractBeforeImplementation:
        "A future artifact storage contract must define immutable fixture identity, consumer-owned import rules, and no hidden executable semantics.",
      requiredFutureAuthorizationPhaseBeforeRuntime: currentAuthorization,
      dataIsolationExpectation:
        "Future fixture storage must isolate repo-family artifact identity from live consumer data.",
      cacheInvalidationExpectation:
        "Future fixture caches must be keyed by fixture hash and invalidated on schema version change.",
      rlsAppPermissionExpectation:
        "Future fixture access requires read-only permissions and no write grants from Ardyn.",
      retentionDeletionExpectation:
        "Future retention must distinguish versioned fixture metadata from live results.",
      backupRecoveryExpectation:
        "Future fixture backups must restore deterministic hashes only.",
      transcriptAuditWriteBoundaryNote:
        "No fixture import/export, transcript, or audit runtime writer exists.",
      locusRoleDescription:
        "Locus may later render fixture metadata through consumer-owned code only.",
      multiverseRoleDescription:
        "Multiverse may later render fixture metadata through consumer-owned code only.",
      fabricRoleDescription:
        "Fabric may later envelope fixture references but does not distribute packages here.",
      secureDropRoleDescription:
        "Secure Drop fixture placeholders remain metadata-only."
    },
    {
      boundaryId:
        "phase5-61.ardyn.encoded-handoff-metadata.storage-boundary",
      boundaryFamily: "storage_contract",
      relatedSystem: "ardyn-subagent",
      currentStatus: "metadata_only",
      dataClassificationNotes: ["metadata_only"],
      allowedCurrentBehavior: [
        "Describe storage boundaries for Phase 5.60 encoded handoff metadata.",
        "Keep encoded handoff metadata non-executable and audit-visible."
      ],
      requiredFutureContractBeforeImplementation:
        "A future storage contract must define protocol identity, plaintext translation, raw transcript/audit visibility, and no hidden payload semantics before storage.",
      requiredFutureAuthorizationPhaseBeforeRuntime: currentAuthorization,
      dataIsolationExpectation:
        "Future encoded handoff records must isolate actor, target, protocol, and operator-visible transcript context.",
      cacheInvalidationExpectation:
        "Future caches must not hide raw transcript or digest updates.",
      rlsAppPermissionExpectation:
        "Future permissions must prevent encoded metadata from authorizing runtime or command exposure.",
      retentionDeletionExpectation:
        "Future retention must define raw transcript and audit digest lifecycle.",
      backupRecoveryExpectation:
        "Future restore must preserve non-authorizing proof flags.",
      transcriptAuditWriteBoundaryNote:
        "Phase 5.61 writes no encoded handoff transcript or audit records.",
      locusRoleDescription:
        "Locus may later display encoded handoff metadata preferences only.",
      multiverseRoleDescription: noConsumerRole,
      fabricRoleDescription:
        "Fabric may later envelope encoded handoff metadata identity only.",
      secureDropRoleDescription: "Not applicable."
    },
    {
      boundaryId:
        "phase5-61.repo-family.fabric-envelope-metadata.storage-boundary",
      boundaryFamily: "storage_contract",
      relatedSystem: "repo-family",
      currentStatus: "metadata_only",
      dataClassificationNotes: ["metadata_only"],
      allowedCurrentBehavior: [
        "Describe future Fabric coordination-envelope metadata storage.",
        "Reference Phase 5.59 without implementing Fabric runtime or persistence."
      ],
      requiredFutureContractBeforeImplementation:
        "A future Fabric storage contract must define envelope schema, repo ownership, write authority, retention, and transport exclusions.",
      requiredFutureAuthorizationPhaseBeforeRuntime: currentAuthorization,
      dataIsolationExpectation:
        "Future Fabric envelope records must isolate repo-family, project, and consumer scope.",
      cacheInvalidationExpectation:
        "Future Fabric envelope caches require deterministic invalidation on envelope version and source digest changes.",
      rlsAppPermissionExpectation:
        "Future access needs repo-family permission boundaries and no connector-derived grants.",
      retentionDeletionExpectation:
        "Future retention must define envelope metadata lifecycle without live transport logs.",
      backupRecoveryExpectation:
        "Future recovery must restore envelope metadata without starting Fabric services.",
      transcriptAuditWriteBoundaryNote:
        "No Fabric transcript or audit runtime writer exists.",
      locusRoleDescription:
        "Locus may later display Fabric envelope status metadata only.",
      multiverseRoleDescription:
        "Multiverse may later display Fabric envelope orchestration metadata only.",
      fabricRoleDescription:
        "Fabric remains a future coordination envelope and is not a bus, broker, transport, adapter, registry, scheduler, importer, exporter, or task executor.",
      secureDropRoleDescription: "Not applicable."
    },
    {
      boundaryId:
        "phase5-61.locus.visible-status-review-metadata.storage-boundary",
      boundaryFamily: "storage_contract",
      relatedSystem: "locus",
      currentStatus: "future_contract_required",
      dataClassificationNotes: ["metadata_only"],
      allowedCurrentBehavior: [
        "Describe Locus-visible status and review metadata storage expectations.",
        "Keep Locus a consumer target only."
      ],
      requiredFutureContractBeforeImplementation:
        "A future Locus-owned storage contract must define display ownership, accessibility, import rules, and no hidden action semantics.",
      requiredFutureAuthorizationPhaseBeforeRuntime:
        "Requires future Locus-owned storage/runtime authorization outside Ardyn.",
      dataIsolationExpectation:
        "Future Locus storage must isolate workspace, project, operator, and review artifact visibility.",
      cacheInvalidationExpectation:
        "Future Locus display caches must update on Ardyn artifact digest changes.",
      rlsAppPermissionExpectation:
        "Future Locus permissions must be consumer-owned and never granted by Ardyn metadata.",
      retentionDeletionExpectation:
        "Future Locus retention must be defined by Locus-owned policy.",
      backupRecoveryExpectation:
        "Future Locus backups are consumer-owned and not triggered by Ardyn.",
      transcriptAuditWriteBoundaryNote:
        "Ardyn writes no Locus transcript, review, or audit storage.",
      locusRoleDescription:
        "Locus is a future first-class display consumer target only.",
      multiverseRoleDescription: noConsumerRole,
      fabricRoleDescription:
        "Fabric may later coordinate display metadata references only.",
      secureDropRoleDescription:
        "Secure Drop placeholders remain metadata-only."
    },
    {
      boundaryId:
        "phase5-61.multiverse.capability-task-metadata.artifact-storage-boundary",
      boundaryFamily: "artifact_storage_contract",
      relatedSystem: "multiverse",
      currentStatus: "future_contract_required",
      dataClassificationNotes: ["metadata_only"],
      allowedCurrentBehavior: [
        "Describe Multiverse-visible capability/task metadata storage expectations.",
        "Keep Multiverse a consumer target only with no orchestration runtime."
      ],
      requiredFutureContractBeforeImplementation:
        "A future Multiverse-owned artifact contract must define capability/task visibility, project isolation, adapter candidate handling, and no execution grants.",
      requiredFutureAuthorizationPhaseBeforeRuntime:
        "Requires future Multiverse-owned storage and orchestration authorization outside Ardyn.",
      dataIsolationExpectation:
        "Future Multiverse storage must isolate world, project, task, and citizen/adapter candidate scopes.",
      cacheInvalidationExpectation:
        "Future caches must invalidate on task capability digest or project boundary changes.",
      rlsAppPermissionExpectation:
        "Future permissions must be Multiverse-owned and no Ardyn metadata may grant adapter or task execution.",
      retentionDeletionExpectation:
        "Future retention must separate candidate metadata from live task results.",
      backupRecoveryExpectation:
        "Future recovery must not restart task execution or adapter runtime.",
      transcriptAuditWriteBoundaryNote:
        "Ardyn writes no Multiverse transcript, task, or audit storage.",
      locusRoleDescription: noConsumerRole,
      multiverseRoleDescription:
        "Multiverse is a future display/orchestration consumer target only.",
      fabricRoleDescription:
        "Fabric may later coordinate Multiverse metadata envelope identity only.",
      secureDropRoleDescription: "Not applicable."
    },
    {
      boundaryId:
        "phase5-61.ardyn.transcript-persistence.transcript-storage-boundary",
      boundaryFamily: "transcript_storage_contract",
      relatedSystem: "ardyn",
      currentStatus: "blocked",
      dataClassificationNotes: ["future_transcript_data"],
      allowedCurrentBehavior: [
        "Describe transcript persistence prerequisites.",
        "Keep transcript persistence unimplemented and runtime-blocked."
      ],
      requiredFutureContractBeforeImplementation:
        "A future transcript contract must define writer ownership, redaction, retention, replay compatibility, storage path, and audit linkage before any write.",
      requiredFutureAuthorizationPhaseBeforeRuntime: currentAuthorization,
      dataIsolationExpectation:
        "Future transcripts must isolate session, operator, workspace, and task identity.",
      cacheInvalidationExpectation:
        "Future transcript caches must preserve ordering and never mask writes.",
      rlsAppPermissionExpectation:
        "Future transcript reads/writes require explicit RLS/app permission boundaries.",
      retentionDeletionExpectation:
        "Future transcript retention and deletion must be explicit before storage.",
      backupRecoveryExpectation:
        "Future transcript backups require restore validation and replay safety.",
      transcriptAuditWriteBoundaryNote:
        "No transcript runtime write, stdout/stderr writer, or replay persistence exists.",
      locusRoleDescription:
        "Locus may later display transcript status metadata only.",
      multiverseRoleDescription: noConsumerRole,
      fabricRoleDescription:
        "Fabric may later envelope transcript references only.",
      secureDropRoleDescription: "Not applicable."
    },
    {
      boundaryId:
        "phase5-61.ardyn.audit-persistence.audit-storage-boundary",
      boundaryFamily: "audit_storage_contract",
      relatedSystem: "ardyn",
      currentStatus: "blocked",
      dataClassificationNotes: ["future_audit_data"],
      allowedCurrentBehavior: [
        "Describe audit persistence prerequisites.",
        "Keep audit writes unimplemented and runtime-blocked."
      ],
      requiredFutureContractBeforeImplementation:
        "A future audit contract must define event taxonomy, writer authority, tamper evidence, retention, and restore semantics before any write.",
      requiredFutureAuthorizationPhaseBeforeRuntime: currentAuthorization,
      dataIsolationExpectation:
        "Future audit records must isolate repo, workspace, task, actor, and authorization context.",
      cacheInvalidationExpectation:
        "Future audit views must not cache stale authorization or deletion state.",
      rlsAppPermissionExpectation:
        "Future audit access requires strict RLS/app permissions and no client-claimed role trust.",
      retentionDeletionExpectation:
        "Future audit retention must balance non-repudiation with deletion policy.",
      backupRecoveryExpectation:
        "Future audit backups must preserve tamper-evidence and revocation context.",
      transcriptAuditWriteBoundaryNote:
        "No audit runtime writer or persisted audit trail exists.",
      locusRoleDescription:
        "Locus may later display audit status metadata only.",
      multiverseRoleDescription: noConsumerRole,
      fabricRoleDescription:
        "Fabric may later envelope audit references only.",
      secureDropRoleDescription: "Not applicable."
    },
    {
      boundaryId:
        "phase5-61.content-fabric.secure-drop-reference-metadata.storage-boundary",
      boundaryFamily: "storage_contract",
      relatedSystem: "content-fabric",
      currentStatus: "future_contract_required",
      dataClassificationNotes: [
        "future_secure_drop_metadata",
        "future_user_content"
      ],
      allowedCurrentBehavior: [
        "Describe future Secure Drop metadata references owned by content-fabric.",
        "Keep Ardyn free of Secure Drop implementation and storage behavior."
      ],
      requiredFutureContractBeforeImplementation:
        "A future content-fabric contract must define canonical Secure Drop metadata ownership, storage references, and Ardyn non-implementation boundaries.",
      requiredFutureAuthorizationPhaseBeforeRuntime:
        "Requires future content-fabric-owned authorization; Ardyn grants nothing.",
      dataIsolationExpectation:
        "Future Secure Drop metadata must isolate content-fabric ownership, sender/recipient scope, and project/workspace context outside Ardyn.",
      cacheInvalidationExpectation:
        "Future Secure Drop metadata caches are content-fabric-owned and not invalidated by Ardyn runtime.",
      rlsAppPermissionExpectation:
        "Future Secure Drop access requires content-fabric-owned permission boundaries.",
      retentionDeletionExpectation:
        "Future Secure Drop retention/deletion must be defined by content-fabric before any reference storage.",
      backupRecoveryExpectation:
        "Future backup/recovery for Secure Drop remains content-fabric-owned.",
      transcriptAuditWriteBoundaryNote:
        "Ardyn writes no Secure Drop transcript, content, metadata, or audit records.",
      locusRoleDescription:
        "Locus may later display Secure Drop metadata placeholders only.",
      multiverseRoleDescription: noConsumerRole,
      fabricRoleDescription:
        "Fabric may later envelope Secure Drop references but cannot route or store content here.",
      secureDropRoleDescription: contentFabricSecureDrop
    },
    {
      boundaryId:
        "phase5-61.ardyn.cache-freshness.cache-contract-boundary",
      boundaryFamily: "cache_contract",
      relatedSystem: "ardyn",
      currentStatus: "future_contract_required",
      dataClassificationNotes: ["metadata_only"],
      allowedCurrentBehavior: [
        "Describe future cache freshness expectations for metadata views.",
        "Keep cache engines and invalidation jobs unimplemented."
      ],
      requiredFutureContractBeforeImplementation:
        "A future cache contract must define keys, TTL, stale-state rules, digest invalidation, and no hidden authorization effects.",
      requiredFutureAuthorizationPhaseBeforeRuntime: currentAuthorization,
      dataIsolationExpectation:
        "Future caches must include workspace, project, repo, and phase identity in keys.",
      cacheInvalidationExpectation:
        "Freshness and invalidation policy must be deterministic before any cache runtime exists.",
      rlsAppPermissionExpectation:
        "Future cache reads must be permission-filtered before serving data.",
      retentionDeletionExpectation:
        "Future cache eviction must honor retention/deletion policy.",
      backupRecoveryExpectation:
        "Future cache data is recoverable only from authoritative storage, not from Ardyn runtime now.",
      transcriptAuditWriteBoundaryNote:
        "No transcript/audit cache writer exists.",
      locusRoleDescription:
        "Locus may later consume cache freshness metadata only.",
      multiverseRoleDescription:
        "Multiverse may later consume cache freshness metadata only.",
      fabricRoleDescription:
        "Fabric may later carry cache freshness envelope metadata only.",
      secureDropRoleDescription: "Not applicable."
    },
    {
      boundaryId:
        "phase5-61.ardyn.cache-invalidation.invalidation-contract-boundary",
      boundaryFamily: "invalidation_contract",
      relatedSystem: "ardyn",
      currentStatus: "future_contract_required",
      dataClassificationNotes: ["metadata_only"],
      allowedCurrentBehavior: [
        "Describe future invalidation policy boundaries.",
        "Keep invalidation jobs, queues, topics, and runtime hooks absent."
      ],
      requiredFutureContractBeforeImplementation:
        "A future invalidation contract must define triggering events, ordering, idempotency, and audit visibility before implementation.",
      requiredFutureAuthorizationPhaseBeforeRuntime: currentAuthorization,
      dataIsolationExpectation:
        "Future invalidation events must isolate workspace/project/repo scopes.",
      cacheInvalidationExpectation:
        "Invalidation remains metadata-only and cannot purge or mutate runtime caches.",
      rlsAppPermissionExpectation:
        "Future invalidation must be guarded by server-side authorization.",
      retentionDeletionExpectation:
        "Future invalidation logs need retention/deletion policy before storage.",
      backupRecoveryExpectation:
        "Future recovery must rebuild invalidation state deterministically.",
      transcriptAuditWriteBoundaryNote:
        "No invalidation audit writer exists.",
      locusRoleDescription:
        "Locus may later display stale/fresh status metadata only.",
      multiverseRoleDescription:
        "Multiverse may later display stale/fresh status metadata only.",
      fabricRoleDescription:
        "Fabric may later envelope invalidation metadata only.",
      secureDropRoleDescription: "Not applicable."
    },
    {
      boundaryId:
        "phase5-61.repo-family.data-isolation.data-isolation-boundary",
      boundaryFamily: "data_isolation_contract",
      relatedSystem: "repo-family",
      currentStatus: "future_contract_required",
      dataClassificationNotes: ["metadata_only", "future_user_content"],
      allowedCurrentBehavior: [
        "Describe tenant, project, workspace, and repo-family isolation expectations.",
        "Keep isolation enforcement as future contract metadata."
      ],
      requiredFutureContractBeforeImplementation:
        "A future isolation contract must define tenant/project/workspace IDs, trust boundaries, RLS/app-permission mapping, and consumer-owned roles.",
      requiredFutureAuthorizationPhaseBeforeRuntime: currentAuthorization,
      dataIsolationExpectation:
        "Future data must be separated by tenant, project, workspace, repo, actor, and artifact class.",
      cacheInvalidationExpectation:
        "Future caches must include isolation keys and invalidate on membership changes.",
      rlsAppPermissionExpectation:
        "Future RLS/app-permission enforcement is mandatory before any DB/storage runtime.",
      retentionDeletionExpectation:
        "Future deletion/export must honor isolation boundaries.",
      backupRecoveryExpectation:
        "Future restore must preserve tenant/project/workspace separation.",
      transcriptAuditWriteBoundaryNote:
        "No isolation-aware transcript or audit writes exist.",
      locusRoleDescription:
        "Locus permissions remain consumer-owned future work.",
      multiverseRoleDescription:
        "Multiverse project/world isolation remains consumer-owned future work.",
      fabricRoleDescription:
        "Fabric may later coordinate isolation metadata only.",
      secureDropRoleDescription:
        "Secure Drop isolation remains content-fabric-owned future work."
    },
    {
      boundaryId:
        "phase5-61.ardyn.retention-deletion-export.retention-policy-boundary",
      boundaryFamily: "retention_policy_contract",
      relatedSystem: "ardyn",
      currentStatus: "future_contract_required",
      dataClassificationNotes: ["metadata_only", "future_user_content"],
      allowedCurrentBehavior: [
        "Describe retention, deletion, and export policy boundaries.",
        "Keep deletion/export jobs and package paths unimplemented."
      ],
      requiredFutureContractBeforeImplementation:
        "A future retention contract must define retention windows, deletion authority, export format, audit, and legal hold behavior before implementation.",
      requiredFutureAuthorizationPhaseBeforeRuntime: currentAuthorization,
      dataIsolationExpectation:
        "Future retention/deletion/export must respect workspace/project/repo and data-class boundaries.",
      cacheInvalidationExpectation:
        "Future deletion/export must invalidate cached metadata and visible status.",
      rlsAppPermissionExpectation:
        "Future retention/export actions require explicit server-side permission checks.",
      retentionDeletionExpectation:
        "Retention/deletion/export is planning metadata only and performs no file, DB, or package writes.",
      backupRecoveryExpectation:
        "Future backups must model deletion and legal hold interactions.",
      transcriptAuditWriteBoundaryNote:
        "No retention/deletion audit writer or export artifact exists.",
      locusRoleDescription:
        "Locus may later display retention/export policy metadata only.",
      multiverseRoleDescription:
        "Multiverse may later display retention/export policy metadata only.",
      fabricRoleDescription:
        "Fabric may later envelope retention policy references only.",
      secureDropRoleDescription:
        "Secure Drop retention/export remains content-fabric-owned future work."
    },
    {
      boundaryId:
        "phase5-61.ardyn.backup-recovery-rto-rpo.backup-recovery-boundary",
      boundaryFamily: "backup_recovery_contract",
      relatedSystem: "ardyn",
      currentStatus: "future_contract_required",
      dataClassificationNotes: [
        "metadata_only",
        "future_transcript_data",
        "future_audit_data"
      ],
      allowedCurrentBehavior: [
        "Describe backup, recovery, RTO, and RPO planning boundaries.",
        "Keep backup/restore code and persistence unimplemented."
      ],
      requiredFutureContractBeforeImplementation:
        "A future recovery contract must define RTO, RPO, backup scope, restore tests, data integrity checks, and no-runtime restore behavior.",
      requiredFutureAuthorizationPhaseBeforeRuntime: currentAuthorization,
      dataIsolationExpectation:
        "Future backup/restore must preserve tenant, project, workspace, artifact, transcript, and audit isolation.",
      cacheInvalidationExpectation:
        "Future restore must invalidate stale caches before serving data.",
      rlsAppPermissionExpectation:
        "Future restore and recovery operations require high-trust server-side authorization.",
      retentionDeletionExpectation:
        "Future backup retention must honor deletion, retention, and legal hold policy.",
      backupRecoveryExpectation:
        "RTO/RPO values are planning metadata only and no backup/restore code is present.",
      transcriptAuditWriteBoundaryNote:
        "No transcript/audit backup, recovery, or runtime write path exists.",
      locusRoleDescription:
        "Locus may later display recovery posture metadata only.",
      multiverseRoleDescription:
        "Multiverse may later display recovery posture metadata only.",
      fabricRoleDescription:
        "Fabric may later coordinate recovery metadata references only.",
      secureDropRoleDescription:
        "Secure Drop backup/recovery remains content-fabric-owned future work."
    }
  ];
}

function databaseStorageContractBoundaryMapEntries() {
  return databaseStorageContractBoundaryMapDefinitions().map(
    databaseStorageContractBoundaryMapEntry
  );
}

function databaseStorageContractBoundaryMapSummary(entries) {
  const countByFamily = Object.fromEntries(
    DATABASE_STORAGE_CONTRACT_BOUNDARY_FAMILIES.map((family) => [
      family,
      entries.filter((entry) => entry.boundaryFamily === family).length
    ])
  );
  const countByRelatedSystem = Object.fromEntries(
    DATABASE_STORAGE_CONTRACT_BOUNDARY_RELATED_SYSTEMS.map((system) => [
      system,
      entries.filter((entry) => entry.relatedSystem === system).length
    ])
  );

  return {
    databaseStorageContractBoundaryMapKind:
      DATABASE_STORAGE_CONTRACT_BOUNDARY_MAP_KIND,
    boundaryEntryCount: entries.length,
    boundaryIds: entries.map((entry) => entry.boundaryId),
    boundaryFamilies: [...DATABASE_STORAGE_CONTRACT_BOUNDARY_FAMILIES],
    relatedSystems: [...DATABASE_STORAGE_CONTRACT_BOUNDARY_RELATED_SYSTEMS],
    currentStatusValues: [...DATABASE_STORAGE_CONTRACT_BOUNDARY_STATUSES],
    dataClassificationValues: [
      ...DATABASE_STORAGE_CONTRACT_BOUNDARY_DATA_CLASSIFICATIONS
    ],
    countByFamily,
    countByRelatedSystem,
    phase548DatabaseStorageCoverageItemRepresented: true,
    phase559FabricAwareApiBackendBoundaryReferenced: true,
    phase560EncodedHandoffConformanceReferenced: true,
    databaseStorageBoundaryMetadataOnly: true,
    noLiveDataAccessed: true,
    noDbStorageWrites: true,
    noTranscriptAuditWrites: true,
    noCacheInvalidationRuntime: true,
    noMigrationsOrRlsApplied: true,
    contentFabricCanonicalSecureDropOwnerOnly: true,
    allBlockedAuthorizationFlagsFalse: true,
    allUnsafeDatabaseStorageRuntimeFlagsFalse: true,
    allRuntimeEffectsFalse: true,
    allEntriesNonAuthorizing: true
  };
}

function databaseStorageContractBoundaryMapValidationRules() {
  return {
    missingRequiredFieldsFailClosed: true,
    unknownTopLevelFieldsFailClosed: true,
    unknownBoundaryFamiliesFailClosed: true,
    unknownRelatedSystemsFailClosed: true,
    unknownCurrentStatusesFailClosed: true,
    unknownDataClassificationsFailClosed: true,
    enabledAuthorizationFlagsFailClosed: true,
    reportRunsChecksTrueFailClosed: true,
    runtimeAuthorizationAttemptsFailClosed: true,
    commandExposureAttemptsFailClosed: true,
    blockedCliBypassAttemptsFailClosed: true,
    unsafeRuntimeCommandConnectorFabricWebsocketHttpMcpTaskSecureDropServiceDiscoveryScheduleFilesystemProcessFlagsFailClosed:
      true,
    unsafeDatabaseStorageCachePersistenceWriteMigrationRlsBackupRestoreRetentionExecutionFlagsFailClosed:
      true,
    hiddenDatabaseConnectionSemanticsFailClosed: true,
    hiddenFilesystemWriteSemanticsFailClosed: true,
    hiddenTranscriptAuditWriteSemanticsFailClosed: true,
    hiddenCacheInvalidationRuntimeSemanticsFailClosed: true,
    hiddenMigrationSchemaChangeSemanticsFailClosed: true,
    hiddenImportExportPackagePersistenceSemanticsFailClosed: true,
    hiddenFabricWebsocketHttpMcpTaskRuntimeSemanticsFailClosed: true,
    hiddenSecureDropImplementationSemanticsFailClosed: true,
    nestedUnsafeFlagsFailClosed: true,
    noncanonicalBoundaryEntriesFailClosed: true,
    validationImplementsDatabaseClient: false,
    validationImplementsStorageAdapter: false,
    validationImplementsCacheEngine: false,
    validationImplementsPersistence: false,
    validationWritesTranscript: false,
    validationWritesAudit: false,
    validationRunsMigration: false,
    validationAppliesRls: false,
    validationImplementsBackupRestore: false,
    validationRunsRuntime: false
  };
}

function databaseStorageContractBoundaryMapGaps() {
  return [
    "No database client, schema, migration, RLS/app-permission policy, storage adapter, cache engine, or invalidation runtime exists in Ardyn.",
    "Transcript and audit persistence remain blocked; there are no runtime writers, stdout/stderr writers, DB/storage writes, filesystem writes, or replay persistence.",
    "Fabric-aware storage remains metadata-only; no Fabric bus, websocket/http transport, backend API/server, MCP/task execution, connector grant, service discovery, or schedule enforcement exists.",
    "Secure Drop metadata references remain future content-fabric-owned work; Ardyn implements no Secure Drop crypto, transport, stego, send/receive, inbox polling, file selection, connector ingestion, secrets, ST3GG, or storage behavior.",
    "Retention/deletion/export and backup/recovery/RTO/RPO are planning boundaries only with no import/export/package/persistence path."
  ];
}

function databaseStorageContractBoundaryMapState(reviewedAt) {
  const boundaryEntries = databaseStorageContractBoundaryMapEntries();

  return {
    schema: DATABASE_STORAGE_CONTRACT_BOUNDARY_MAP_STATE_SCHEMA,
    schemaVersion: DATABASE_STORAGE_CONTRACT_BOUNDARY_MAP_VERSION,
    stateKind: DATABASE_STORAGE_CONTRACT_BOUNDARY_MAP_KIND,
    stateMode: "review-only",
    reviewedAt,
    sourcePhaseContext: {
      phase548ProductionReadinessCoverageMatrix:
        "tests/fixtures/host-policy/phase5-48/production-readiness-coverage-matrix.json",
      phase548DatabaseStorageAreaNumber: 3,
      phase548DatabaseStorageStatus: "deferred",
      phase559FabricAwareApiBackendBoundary:
        "tests/fixtures/host-policy/phase5-59/fabric-aware-api-backend-contract-boundary-map.json",
      phase560InterAgentEncodedHandoffConformance:
        "tests/fixtures/host-policy/phase5-60/inter-agent-encoded-handoff-conformance.json",
      secureDropCanonicalOwner: "content-fabric",
      runtimeStillBlocked: true
    },
    boundaryEntries,
    boundaryMapSummary:
      databaseStorageContractBoundaryMapSummary(boundaryEntries),
    invalidBoundaryCasePolicy:
      databaseStorageContractBoundaryMapValidationRules(),
    topDatabaseStorageFabricApiBackendGaps:
      databaseStorageContractBoundaryMapGaps(),
    recommendedNextPhase:
      "phase-5.62-review-only-auth-permissions-contract-boundary-map",
    databaseStorageContractBoundaryMapOnly: true,
    reviewOnly: true,
    metadataOnly: true,
    authoritative: false,
    nonAuthorizingProof: true,
    reportRunsChecks: false,
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
    backupRestoreImplemented: false,
    retentionDeletionJobImplemented: false,
    importExportPathImplementedByArdyn: false,
    packageDistributionImplementedByArdyn: false,
    persistenceImplementedByArdyn: false,
    backendRuntimeImplementedByArdyn: false,
    apiEndpointImplementedByArdyn: false,
    serverImplementedByArdyn: false,
    websocketHttpTransportImplementedByArdyn: false,
    fabricRuntimeImplementedByArdyn: false,
    commandExposureEnabled: false,
    commandRuntimeControlEnabled: false,
    runtimeExecutionEnabled: false,
    databaseStorageRuntimeWritesEnabled: false,
    secretsRuntimeIngestionEnabled: false,
    connectorGrantProduced: false,
    mcpToolExposureEnabled: false,
    taskExecutionEnabled: false,
    secureDropImplemented: false,
    st3ggVendored: false,
    encodedHandoffRuntimeImplementedByArdyn: false,
    codecImplemented: false,
    translatorRuntimeImplemented: false,
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

function databaseStorageContractBoundaryMapResult({
  reviewedAt,
  reviewedAtDefaulted,
  classification,
  accepted,
  databaseStorageContractBoundaryMap
}) {
  return {
    schema: DATABASE_STORAGE_CONTRACT_BOUNDARY_MAP_SCHEMA,
    schemaVersion: DATABASE_STORAGE_CONTRACT_BOUNDARY_MAP_VERSION,
    databaseStorageContractBoundaryMapKind:
      DATABASE_STORAGE_CONTRACT_BOUNDARY_MAP_KIND,
    databaseStorageContractBoundaryMapMode: "review-only",
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    databaseStorageContractBoundaryMapProduced: accepted,
    databaseStorageContractBoundaryMap,
    boundaryMapSummary: accepted
      ? databaseStorageContractBoundaryMap.boundaryMapSummary
      : null,
    boundaryEntries: accepted
      ? databaseStorageContractBoundaryMap.boundaryEntries
      : [],
    invalidBoundaryCasePolicy: accepted
      ? databaseStorageContractBoundaryMap.invalidBoundaryCasePolicy
      : databaseStorageContractBoundaryMapValidationRules(),
    topDatabaseStorageFabricApiBackendGaps: accepted
      ? databaseStorageContractBoundaryMap.topDatabaseStorageFabricApiBackendGaps
      : [],
    recommendedNextPhase: accepted
      ? databaseStorageContractBoundaryMap.recommendedNextPhase
      : null,
    databaseStorageContractBoundaryMapOnly: true,
    reviewOnly: true,
    metadataOnly: true,
    authoritative: false,
    nonAuthorizingProof: true,
    reportRunsChecks: false,
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
    backupRestoreImplemented: false,
    retentionDeletionJobImplemented: false,
    importExportPathImplementedByArdyn: false,
    packageDistributionImplementedByArdyn: false,
    persistenceImplementedByArdyn: false,
    backendRuntimeImplementedByArdyn: false,
    apiEndpointImplementedByArdyn: false,
    serverImplementedByArdyn: false,
    websocketHttpTransportImplementedByArdyn: false,
    fabricRuntimeImplementedByArdyn: false,
    commandExposureEnabled: false,
    commandRuntimeControlEnabled: false,
    runtimeExecutionEnabled: false,
    databaseStorageRuntimeWritesEnabled: false,
    secretsRuntimeIngestionEnabled: false,
    connectorGrantProduced: false,
    mcpToolExposureEnabled: false,
    taskExecutionEnabled: false,
    secureDropImplemented: false,
    st3ggVendored: false,
    encodedHandoffRuntimeImplementedByArdyn: false,
    codecImplemented: false,
    translatorRuntimeImplemented: false,
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
            databaseStorageRuntimeAuthorized: false,
            commandExposureAuthorized: false,
            reportRunsChecks: false
          }
        ],
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

export function createDatabaseStorageContractBoundaryMapForReview(input = {}) {
  const inputRecord =
    databaseStorageContractBoundaryMapInputRecord(input);
  const reviewedAt =
    databaseStorageContractBoundaryMapReviewedAt(inputRecord);
  const reviewedAtDefaulted = isReviewedAtDefaulted(inputRecord);
  const classification =
    databaseStorageContractBoundaryMapInputClassification(inputRecord);
  const accepted =
    classification ===
    VALID_DATABASE_STORAGE_CONTRACT_BOUNDARY_MAP_CLASSIFICATION;
  const databaseStorageContractBoundaryMap = accepted
    ? databaseStorageContractBoundaryMapState(reviewedAt)
    : null;

  return databaseStorageContractBoundaryMapResult({
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    accepted,
    databaseStorageContractBoundaryMap
  });
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
