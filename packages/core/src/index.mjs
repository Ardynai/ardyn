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
export const REVIEW_ONLY_RUNTIME_APPROVAL_EVALUATOR_SCHEMA =
  "ardyn.phase-5.18.review-only-approval-evaluator-result";
export const REVIEW_ONLY_RUNTIME_APPROVAL_EVALUATOR_VERSION = "0.1.0";
export const REVIEW_ONLY_RUNTIME_APPROVAL_EVALUATOR_KIND =
  "review-only-runtime-approval-evaluator";
export const APPROVAL_PREREQUISITE_READER_SCHEMA =
  "ardyn.phase-5.19.approval-prerequisite-reader-result";
export const APPROVAL_PREREQUISITE_READER_VERSION = "0.1.0";
export const APPROVAL_PREREQUISITE_READER_KIND = "approval-prerequisite-reader";
export const APPROVAL_PREREQUISITE_SOURCE_PREFLIGHT_SCHEMA =
  "ardyn.phase-5.20.approval-prerequisite-source-preflight-result";
export const APPROVAL_PREREQUISITE_SOURCE_PREFLIGHT_VERSION = "0.1.0";
export const APPROVAL_PREREQUISITE_SOURCE_PREFLIGHT_KIND =
  "approval-prerequisite-source-ingestion-preflight";
export const APPROVAL_PREREQUISITE_SOURCE_SELECTION_SCHEMA =
  "ardyn.phase-5.21.approval-prerequisite-source-selection-result";
export const APPROVAL_PREREQUISITE_SOURCE_SELECTION_VERSION = "0.1.0";
export const APPROVAL_PREREQUISITE_SOURCE_SELECTION_KIND =
  "approval-prerequisite-source-selection";
export const APPROVAL_PREREQUISITE_SOURCE_BUNDLE_SCHEMA =
  "ardyn.phase-5.22.approval-prerequisite-source-bundle-result";
export const APPROVAL_PREREQUISITE_SOURCE_BUNDLE_VERSION = "0.1.0";
export const APPROVAL_PREREQUISITE_SOURCE_BUNDLE_KIND =
  "approval-prerequisite-source-bundle";
export const APPROVAL_PREREQUISITE_BUNDLE_CONSUMPTION_CHECKPOINT_SCHEMA =
  "ardyn.phase-5.23.approval-prerequisite-bundle-consumption-checkpoint-result";
export const APPROVAL_PREREQUISITE_BUNDLE_CONSUMPTION_CHECKPOINT_VERSION =
  "0.1.0";
export const APPROVAL_PREREQUISITE_BUNDLE_CONSUMPTION_CHECKPOINT_KIND =
  "approval-prerequisite-bundle-consumption-checkpoint";
export const APPROVAL_PREREQUISITE_INTEGRATION_CHECKPOINT_SCHEMA =
  "ardyn.phase-5.24.approval-prerequisite-integration-checkpoint-result";
export const APPROVAL_PREREQUISITE_INTEGRATION_CHECKPOINT_VERSION = "0.1.0";
export const APPROVAL_PREREQUISITE_INTEGRATION_CHECKPOINT_KIND =
  "approval-prerequisite-evaluation-integration-checkpoint";
export const PREREQUISITE_REVIEW_ARTIFACT_BOUNDARY_SCHEMA =
  "ardyn.phase-5.25.prerequisite-review-artifact-boundary-result";
export const PREREQUISITE_REVIEW_ARTIFACT_BOUNDARY_VERSION = "0.1.0";
export const PREREQUISITE_REVIEW_ARTIFACT_BOUNDARY_KIND =
  "non-authorizing-prerequisite-review-artifact-boundary";
export const PREREQUISITE_REVIEW_ARTIFACT_EVALUATOR_INPUT_HANDOFF_SCHEMA =
  "ardyn.phase-5.26.prerequisite-review-artifact-evaluator-input-handoff-result";
export const PREREQUISITE_REVIEW_ARTIFACT_EVALUATOR_INPUT_HANDOFF_VERSION =
  "0.1.0";
export const PREREQUISITE_REVIEW_ARTIFACT_EVALUATOR_INPUT_HANDOFF_KIND =
  "review-artifact-evaluator-input-handoff";
export const APPROVAL_EVALUATOR_CANDIDATE_INTAKE_CHECKPOINT_SCHEMA =
  "ardyn.phase-5.27.approval-evaluator-candidate-intake-checkpoint-result";
export const APPROVAL_EVALUATOR_CANDIDATE_INTAKE_CHECKPOINT_VERSION = "0.1.0";
export const APPROVAL_EVALUATOR_CANDIDATE_INTAKE_CHECKPOINT_KIND =
  "approval-evaluator-candidate-intake-checkpoint";
export const REVIEW_ONLY_EVALUATOR_PREFLIGHT_CHECKPOINT_SCHEMA =
  "ardyn.phase-5.28.review-only-evaluator-preflight-checkpoint-result";
export const REVIEW_ONLY_EVALUATOR_PREFLIGHT_CHECKPOINT_VERSION = "0.1.0";
export const REVIEW_ONLY_EVALUATOR_PREFLIGHT_CHECKPOINT_KIND =
  "review-only-evaluator-preflight-checkpoint";

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

const REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE = Object.freeze({
  runtimeEnabled: false,
  runtimeStarted: false,
  runtimeReady: false,
  runtimeCommandEnabled: false,
  runtimeCommandExposureEnabled: false,
  runtimeExecutionEnabled: false,
  runtimeExecuted: false,
  approvalGrantProduced: false,
  approvalGrantPersisted: false,
  approvalEvaluatorAuthoritative: false
});

const APPROVAL_PREREQUISITE_READER_DEFAULT_REVIEWED_AT =
  "1970-01-01T00:00:00.000Z";

const APPROVAL_PREREQUISITE_RECORD_EXPECTATIONS = Object.freeze([
  Object.freeze({
    key: "runtimeApprovalRecord",
    label: "runtime_approval_record",
    schema: "ardyn.runtime-approval-record",
    recordKind: "runtime-approval-record",
    runtimeEffectFalseFields: Object.freeze([
      "currentRecordEnablesRuntime",
      "runtimeStarts",
      "runtimeEnabled",
      "runtimeCommandEnabled",
      "runtimeExecutionEnabled",
      "approvalGrantCreated"
    ]),
    commandExposureEffectFalseFields: Object.freeze([])
  }),
  Object.freeze({
    key: "commandExposureApprovalRecord",
    label: "command_exposure_approval_record",
    schema: "ardyn.runtime-command-exposure-approval-record",
    recordKind: "runtime-command-exposure-approval-record",
    runtimeEffectFalseFields: Object.freeze([
      "currentRecordEnablesRuntime",
      "runtimeStarts",
      "runtimeEnabled",
      "runtimeCommandEnabled",
      "runtimeExecutionEnabled",
      "approvalGrantCreated"
    ]),
    commandExposureEffectFalseFields: Object.freeze([
      "currentRecordExposesUserRuntimeCommand",
      "currentRecordEnablesRuntimeCommand",
      "currentRecordExposesRuntimeExecution",
      "additionalRuntimeCommandsRecognized",
      "commandAliasCreated"
    ])
  })
]);

const APPROVAL_READER_CLASSIFICATION_BY_STATUS = Object.freeze({
  missing: "missing_prerequisite_record_rejected",
  malformed: "malformed_prerequisite_record_rejected",
  revoked: "revoked_prerequisite_record_rejected",
  duplicate: "duplicate_prerequisite_record_rejected",
  stale: "stale_prerequisite_record_rejected"
});

const EVALUATOR_CLASSIFICATION_BY_READER_CLASSIFICATION = Object.freeze({
  missing_prerequisite_record_rejected: "missing_prerequisite_record_rejected",
  malformed_prerequisite_record_rejected: "invalid_prerequisite_record_rejected",
  duplicate_prerequisite_record_rejected: "invalid_prerequisite_record_rejected",
  stale_prerequisite_record_rejected: "invalid_prerequisite_record_rejected",
  unknown_prerequisite_record_rejected: "invalid_prerequisite_record_rejected",
  revoked_prerequisite_record_rejected: "revoked_prerequisite_record_rejected",
  valid_prerequisite_records_review_only_runtime_still_blocked:
    "valid_prerequisites_review_only_runtime_still_blocked"
});

function approvalPrerequisiteEffectMalformed(record, effectKey, requiredFalseFields) {
  const effect = record?.[effectKey];
  if (effect == null) {
    return requiredFalseFields.length > 0;
  }

  if (!isPlainObjectRecord(effect)) {
    return true;
  }

  return [
    requiredFalseFields.some((field) => effect[field] !== false),
    Object.values(effect).some((value) => value !== false)
  ].some(Boolean);
}

function recordRuntimeEffectClaims(record, expected) {
  return approvalPrerequisiteEffectMalformed(
    record,
    "runtimeEffect",
    expected.runtimeEffectFalseFields
  );
}

function recordCommandExposureEffectClaims(record, expected) {
  return approvalPrerequisiteEffectMalformed(
    record,
    "commandExposureEffect",
    expected.commandExposureEffectFalseFields
  );
}

function approvalPrerequisiteRecordInvalid(record, expected) {
  const expectedFields = [
    ["schema", expected.schema],
    ["schemaVersion", "0.1.0"],
    ["recordKind", expected.recordKind],
    ["approvalStatus", "approved"]
  ];

  return (
    !isPlainObjectRecord(record) ||
    expectedFields.some(([field, value]) => record[field] !== value) ||
    recordRuntimeEffectClaims(record, expected)
  );
}

function approvalPrerequisiteRecordMalformed(record, expected) {
  return (
    approvalPrerequisiteRecordInvalid(record, expected) ||
    recordCommandExposureEffectClaims(record, expected)
  );
}

function approvalPrerequisiteRecordRevoked(record) {
  return !isPlainObjectRecord(record?.revocation) || record.revocation.revoked === true;
}

function approvalPrerequisiteTimestampAtOrBefore(value, boundary) {
  return typeof value === "string" && value <= boundary;
}

function approvalPrerequisiteTimestampAfter(value, boundary) {
  return typeof value === "string" && value > boundary;
}

function approvalPrerequisiteRecordStale(record, reviewedAt) {
  const validity = record?.validity;
  if (!isPlainObjectRecord(validity)) {
    return false;
  }

  return [
    validity.validAtEvaluation === false,
    approvalPrerequisiteTimestampAtOrBefore(validity.expiresAt, reviewedAt),
    approvalPrerequisiteTimestampAfter(validity.notBefore, reviewedAt)
  ].some(Boolean);
}

const APPROVAL_PREREQUISITE_RECORD_STATUS = Object.freeze({
  missing: Object.freeze({
    present: false,
    valid: false,
    revoked: false,
    stale: false,
    duplicate: false,
    malformed: false,
    reason: "missing"
  }),
  malformed: Object.freeze({
    present: true,
    valid: false,
    revoked: false,
    stale: false,
    duplicate: false,
    malformed: true,
    reason: "malformed"
  }),
  revoked: Object.freeze({
    present: true,
    valid: false,
    revoked: true,
    stale: false,
    duplicate: false,
    malformed: false,
    reason: "revoked"
  }),
  duplicate: Object.freeze({
    present: true,
    valid: false,
    revoked: false,
    stale: false,
    duplicate: true,
    malformed: false,
    reason: "duplicate"
  }),
  stale: Object.freeze({
    present: true,
    valid: false,
    revoked: false,
    stale: true,
    duplicate: false,
    malformed: false,
    reason: "stale"
  }),
  valid: Object.freeze({
    present: true,
    valid: true,
    revoked: false,
    stale: false,
    duplicate: false,
    malformed: false,
    reason: null
  })
});

function approvalPrerequisiteRecordStatus(record, expected, reviewedAt) {
  const statusChecks = [
    ["missing", record == null],
    ["malformed", approvalPrerequisiteRecordMalformed(record, expected)],
    ["revoked", approvalPrerequisiteRecordRevoked(record)],
    ["stale", approvalPrerequisiteRecordStale(record, reviewedAt)]
  ];

  return statusChecks.find(([, matches]) => matches)?.[0] ?? "valid";
}

function approvalPrerequisiteRecordId(record, fallback) {
  return isPlainObjectRecord(record) && typeof record.recordId === "string"
    ? record.recordId
    : fallback;
}

function approvalPrerequisiteRecordSourceIndex(source, fallback) {
  return Number.isInteger(source.index) ? source.index : fallback;
}

function approvalPrerequisiteRecordStringField(record, field) {
  if (!isPlainObjectRecord(record)) {
    return null;
  }

  const value = record[field];
  return typeof value === "string" ? value : null;
}

function approvalPrerequisiteUnknownRecord(source, fallback) {
  const record = source.record;
  return {
    index: approvalPrerequisiteRecordSourceIndex(source, fallback),
    schema: approvalPrerequisiteRecordStringField(record, "schema"),
    recordKind: approvalPrerequisiteRecordStringField(record, "recordKind"),
    reason: "unknown_prerequisite_record"
  };
}

function classifyApprovalPrerequisiteRecord(record, expected, reviewedAt) {
  const status = approvalPrerequisiteRecordStatus(record, expected, reviewedAt);
  const details = APPROVAL_PREREQUISITE_RECORD_STATUS[status];
  const rejectionReasons =
    details.reason == null ? [] : [`${expected.label}_${details.reason}`];
  return {
    status,
    present: details.present,
    valid: details.valid,
    revoked: details.revoked,
    stale: details.stale,
    duplicate: details.duplicate,
    malformed: details.malformed,
    sourceIndexes: [],
    recordIds: record == null ? [] : [approvalPrerequisiteRecordId(record, null)].filter(Boolean),
    rejectionReasons
  };
}

function approvalPrerequisiteListRecords(input) {
  const records = isPlainObjectRecord(input) ? input.prerequisiteRecords : null;
  return Array.isArray(records) ? records : [];
}

function approvalPrerequisiteSourceForExpected(input, expected) {
  if (!isPlainObjectRecord(input) || !Object.hasOwn(input, expected.key)) {
    return null;
  }

  return { record: input[expected.key], index: null, expected };
}

function approvalPrerequisiteSources(input) {
  const listSources = approvalPrerequisiteListRecords(input).map((record, index) => ({
    record,
    index,
    expected: null
  }));
  const keyedSources = APPROVAL_PREREQUISITE_RECORD_EXPECTATIONS.map((expected) =>
    approvalPrerequisiteSourceForExpected(input, expected)
  ).filter(Boolean);
  return [...listSources, ...keyedSources];
}

function expectedApprovalPrerequisiteRecord(record) {
  if (!isPlainObjectRecord(record)) {
    return null;
  }

  return (
    APPROVAL_PREREQUISITE_RECORD_EXPECTATIONS.find(
      (expected) =>
        record.schema === expected.schema || record.recordKind === expected.recordKind
    ) ?? null
  );
}

function emptyApprovalPrerequisiteBuckets() {
  return Object.fromEntries(
    APPROVAL_PREREQUISITE_RECORD_EXPECTATIONS.map((expected) => [expected.key, []])
  );
}

function approvalPrerequisiteBuckets(input) {
  const buckets = emptyApprovalPrerequisiteBuckets();
  const unknownRecords = [];

  approvalPrerequisiteSources(input).forEach((source, fallbackIndex) => {
    const expected = source.expected ?? expectedApprovalPrerequisiteRecord(source.record);
    if (expected == null) {
      unknownRecords.push(approvalPrerequisiteUnknownRecord(source, fallbackIndex));
      return;
    }

    buckets[expected.key].push({ ...source, expected, fallbackIndex });
  });

  return { buckets, unknownRecords };
}

function duplicateApprovalPrerequisiteRecordStatus(records, expected) {
  return {
    status: "duplicate",
    present: true,
    valid: false,
    revoked: false,
    stale: false,
    duplicate: true,
    malformed: false,
    sourceIndexes: records.map((record, index) =>
      approvalPrerequisiteRecordSourceIndex(record, index)
    ),
    recordIds: records.map((record, index) =>
      approvalPrerequisiteRecordId(record.record, `${expected.key}-${index}`)
    ),
    rejectionReasons: [`${expected.label}_duplicate`]
  };
}

function readExpectedApprovalPrerequisiteRecord(records, expected, reviewedAt) {
  if (records.length === 0) {
    return classifyApprovalPrerequisiteRecord(null, expected, reviewedAt);
  }

  if (records.length > 1) {
    return duplicateApprovalPrerequisiteRecordStatus(records, expected);
  }

  const [source] = records;
  return {
    ...classifyApprovalPrerequisiteRecord(source.record, expected, reviewedAt),
    sourceIndexes: [approvalPrerequisiteRecordSourceIndex(source, source.fallbackIndex)],
    recordIds: [approvalPrerequisiteRecordId(source.record, expected.key)]
  };
}

function approvalPrerequisiteReaderClassification(recordStatuses, unknownRecords) {
  if (unknownRecords.length > 0) {
    return "unknown_prerequisite_record_rejected";
  }

  const statuses = recordStatuses.map((record) => record.status);
  const blockingStatus = ["duplicate", "malformed", "stale", "revoked", "missing"].find(
    (status) => statuses.includes(status)
  );

  return (
    APPROVAL_READER_CLASSIFICATION_BY_STATUS[blockingStatus] ??
    "valid_prerequisite_records_review_only_runtime_still_blocked"
  );
}

function approvalPrerequisiteReaderCounts(records, unknownRecords) {
  const statuses = records.map((record) => record.status);
  const countStatus = (status) => statuses.filter((entry) => entry === status).length;
  return {
    total:
      records.reduce((count, record) => count + record.recordIds.length, 0) +
      unknownRecords.length,
    known: records.reduce((count, record) => count + record.recordIds.length, 0),
    unknown: unknownRecords.length,
    malformed: countStatus("malformed"),
    duplicate: countStatus("duplicate"),
    stale: countStatus("stale"),
    revoked: countStatus("revoked"),
    valid: countStatus("valid"),
    missing: countStatus("missing")
  };
}

function approvalPrerequisiteEvidence(records, status) {
  return records
    .filter((record) => record.status === status)
    .map((record) => ({
      expectedRecord: record.expectedRecord,
      recordId: record.recordIds[0] ?? null,
      recordIds: record.recordIds
    }));
}

function approvalPrerequisiteRejectionReasons(records, unknownRecords) {
  return [
    ...records.flatMap((record) => record.rejectionReasons),
    ...unknownRecords.map((record) => record.reason),
    "approval_grant_not_implemented",
    "runtime_enablement_still_blocked"
  ];
}

export function readApprovalPrerequisiteRecordsForReview(input = {}) {
  const reviewedAt =
    typeof input.reviewedAt === "string"
      ? input.reviewedAt
      : APPROVAL_PREREQUISITE_READER_DEFAULT_REVIEWED_AT;
  const { buckets, unknownRecords } = approvalPrerequisiteBuckets(input);
  const recordEntries = APPROVAL_PREREQUISITE_RECORD_EXPECTATIONS.map((expected) => [
    expected.key,
    {
      expectedRecord: expected.key,
      ...readExpectedApprovalPrerequisiteRecord(buckets[expected.key], expected, reviewedAt)
    }
  ]);
  const prerequisiteRecords = Object.fromEntries(recordEntries);
  const records = Object.values(prerequisiteRecords);
  const classification = approvalPrerequisiteReaderClassification(records, unknownRecords);
  const prerequisiteSignalRecognized =
    classification === "valid_prerequisite_records_review_only_runtime_still_blocked";

  return {
    schema: APPROVAL_PREREQUISITE_READER_SCHEMA,
    schemaVersion: APPROVAL_PREREQUISITE_READER_VERSION,
    readerKind: APPROVAL_PREREQUISITE_READER_KIND,
    readerMode: "review-only",
    reviewedAt,
    classification,
    prerequisiteSignalRecognized,
    reviewOnly: true,
    authoritative: false,
    recordCounts: approvalPrerequisiteReaderCounts(records, unknownRecords),
    prerequisiteRecords,
    unknownRecords,
    malformedRecords: approvalPrerequisiteEvidence(records, "malformed"),
    duplicateRecords: approvalPrerequisiteEvidence(records, "duplicate"),
    staleRecords: approvalPrerequisiteEvidence(records, "stale"),
    revokedRecords: approvalPrerequisiteEvidence(records, "revoked"),
    rejectionReasons: approvalPrerequisiteRejectionReasons(records, unknownRecords),
    approvalGrant: {
      produced: false,
      persisted: false,
      grantId: null,
      schema: "ardyn.runtime-approval-grant",
      schemaVersion: "not-implemented"
    },
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

function evaluatorPrerequisiteRecordStatus(readerRecord) {
  const status =
    {
      malformed: "invalid",
      duplicate: "invalid",
      stale: "invalid"
    }[readerRecord.status] ?? readerRecord.status;

  return {
    status,
    present: readerRecord.present,
    valid: readerRecord.valid,
    revoked: readerRecord.revoked,
    rejectionReasons: readerRecord.rejectionReasons
  };
}

export function evaluateRuntimeApprovalPrerequisitesForReview(input = {}) {
  const approvalPrerequisiteReader = readApprovalPrerequisiteRecordsForReview(input);
  const runtimeApprovalRecord = evaluatorPrerequisiteRecordStatus(
    approvalPrerequisiteReader.prerequisiteRecords.runtimeApprovalRecord
  );
  const commandExposureApprovalRecord = evaluatorPrerequisiteRecordStatus(
    approvalPrerequisiteReader.prerequisiteRecords.commandExposureApprovalRecord
  );
  const classification =
    EVALUATOR_CLASSIFICATION_BY_READER_CLASSIFICATION[
      approvalPrerequisiteReader.classification
    ];

  return {
    schema: REVIEW_ONLY_RUNTIME_APPROVAL_EVALUATOR_SCHEMA,
    schemaVersion: REVIEW_ONLY_RUNTIME_APPROVAL_EVALUATOR_VERSION,
    evaluatorKind: REVIEW_ONLY_RUNTIME_APPROVAL_EVALUATOR_KIND,
    evaluationMode: "review-only",
    classification,
    prerequisiteSignalRecognized:
      approvalPrerequisiteReader.prerequisiteSignalRecognized,
    reviewOnly: true,
    authoritative: false,
    approvalPrerequisiteReader,
    prerequisiteRecords: {
      runtimeApprovalRecord,
      commandExposureApprovalRecord
    },
    rejectionReasons: approvalPrerequisiteReader.rejectionReasons,
    approvalGrant: {
      produced: false,
      persisted: false,
      grantId: null,
      schema: "ardyn.runtime-approval-grant",
      schemaVersion: "not-implemented"
    },
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

const APPROVAL_PREREQUISITE_SOURCE_PREFLIGHT_DEFAULT_REVIEWED_AT =
  APPROVAL_PREREQUISITE_READER_DEFAULT_REVIEWED_AT;

const APPROVAL_PREREQUISITE_SOURCE_KIND = "inline-prerequisite-records";
const APPROVAL_PREREQUISITE_SOURCE_MODE = "in-memory";

const APPROVAL_PREREQUISITE_SOURCE_FORBIDDEN_FIELDS = Object.freeze([
  "path",
  "file",
  "filePath",
  "url",
  "href",
  "endpoint",
  "env",
  "envVar",
  "secret",
  "secrets",
  "watch",
  "watcher"
]);

const APPROVAL_PREREQUISITE_SOURCE_CLASSIFICATION_BY_READER = Object.freeze({
  missing_prerequisite_record_rejected: "malformed_prerequisite_source_input_rejected",
  malformed_prerequisite_record_rejected: "malformed_prerequisite_source_input_rejected",
  duplicate_prerequisite_record_rejected: "duplicate_prerequisite_source_input_rejected",
  stale_prerequisite_record_rejected: "stale_prerequisite_source_input_rejected",
  unknown_prerequisite_record_rejected: "unknown_prerequisite_source_input_rejected",
  revoked_prerequisite_record_rejected: "revoked_prerequisite_source_input_rejected",
  valid_prerequisite_records_review_only_runtime_still_blocked:
    "valid_prerequisite_source_input_review_only_runtime_still_blocked"
});

function approvalPrerequisiteSourceHasForbiddenDescriptor(source) {
  return APPROVAL_PREREQUISITE_SOURCE_FORBIDDEN_FIELDS.some((field) =>
    Object.hasOwn(source, field)
  );
}

function approvalPrerequisiteSourceHasStringId(source) {
  return typeof source.sourceId === "string" && source.sourceId.length > 0;
}

function approvalPrerequisiteSourceMalformed(source) {
  if (!isPlainObjectRecord(source)) {
    return true;
  }

  return [
    !approvalPrerequisiteSourceHasStringId(source),
    source.sourceKind !== APPROVAL_PREREQUISITE_SOURCE_KIND,
    source.sourceMode !== APPROVAL_PREREQUISITE_SOURCE_MODE,
    !Array.isArray(source.records),
    approvalPrerequisiteSourceHasForbiddenDescriptor(source)
  ].some(Boolean);
}

function approvalPrerequisiteSourceReports(sourceInputs) {
  return sourceInputs.map((source, index) => {
    const malformed = approvalPrerequisiteSourceMalformed(source);
    const sourceId =
      isPlainObjectRecord(source) && typeof source.sourceId === "string"
        ? source.sourceId
        : null;
    const recordCount =
      isPlainObjectRecord(source) && Array.isArray(source.records)
        ? source.records.length
        : 0;

    return {
      index,
      sourceId,
      sourceKind: isPlainObjectRecord(source) ? source.sourceKind ?? null : null,
      sourceMode: isPlainObjectRecord(source) ? source.sourceMode ?? null : null,
      malformed,
      empty: !malformed && recordCount === 0,
      duplicate: false,
      recordCount
    };
  });
}

function markDuplicateApprovalPrerequisiteSources(sourceReports) {
  const sourceIdCounts = sourceReports.reduce((counts, report) => {
    if (report.sourceId != null) {
      counts.set(report.sourceId, (counts.get(report.sourceId) ?? 0) + 1);
    }

    return counts;
  }, new Map());

  for (const report of sourceReports) {
    report.duplicate = (sourceIdCounts.get(report.sourceId) ?? 0) > 1;
  }
}

function sourcePreflightGrantBlocked() {
  return {
    produced: false,
    persisted: false,
    grantId: null,
    schema: "ardyn.runtime-approval-grant",
    schemaVersion: "not-implemented"
  };
}

function sourcePreflightRejectionReasons(classification, sourceReports, readerResult) {
  const sourceReasons =
    {
      missing_prerequisite_source_input_rejected: [
        "missing_prerequisite_source_input"
      ],
      malformed_prerequisite_source_input_rejected: [
        "malformed_prerequisite_source_input"
      ],
      empty_prerequisite_source_input_rejected: ["empty_prerequisite_source_input"],
      duplicate_prerequisite_source_input_rejected: [
        "duplicate_prerequisite_source_input"
      ],
      stale_prerequisite_source_input_rejected: ["stale_prerequisite_source_input"],
      unknown_prerequisite_source_input_rejected: [
        "unknown_prerequisite_source_input"
      ],
      revoked_prerequisite_source_input_rejected: [
        "revoked_prerequisite_source_input"
      ]
    }[classification] ?? [];

  const detailReasons = sourceReports.flatMap((report) => [
    ...(report.malformed ? [`source_${report.index}_malformed`] : []),
    ...(report.empty ? [`source_${report.index}_empty`] : []),
    ...(report.duplicate ? [`source_${report.index}_duplicate`] : [])
  ]);
  const readerReasons = readerResult?.rejectionReasons ?? [];

  return [
    ...sourceReasons,
    ...detailReasons,
    ...readerReasons,
    "approval_grant_not_implemented",
    "runtime_enablement_still_blocked"
  ];
}

function approvalPrerequisiteSourcePreflightResult({
  reviewedAt,
  classification,
  sourceInputs,
  sourceReports,
  acceptedReaderInput,
  approvalPrerequisiteReader
}) {
  const sourceInputsAccepted =
    classification === "valid_prerequisite_source_input_review_only_runtime_still_blocked";
  const forwardedReaderInput = sourceInputsAccepted ? acceptedReaderInput : null;
  const forwardedReader = sourceInputsAccepted ? approvalPrerequisiteReader : null;
  const sourceInputCounts = approvalPrerequisiteSourceInputCounts(
    sourceInputs,
    sourceReports,
    sourceInputsAccepted
  );

  return {
    schema: APPROVAL_PREREQUISITE_SOURCE_PREFLIGHT_SCHEMA,
    schemaVersion: APPROVAL_PREREQUISITE_SOURCE_PREFLIGHT_VERSION,
    preflightKind: APPROVAL_PREREQUISITE_SOURCE_PREFLIGHT_KIND,
    preflightMode: "review-only",
    reviewedAt,
    classification,
    sourceInputsAccepted,
    readerInputForwarded: sourceInputsAccepted,
    reviewOnly: true,
    authoritative: false,
    sourceInputCounts,
    sourceInputs: sourceReports,
    acceptedReaderInput: forwardedReaderInput,
    approvalPrerequisiteReader: forwardedReader,
    rejectionReasons: sourcePreflightRejectionReasons(
      classification,
      sourceReports,
      approvalPrerequisiteReader
    ),
    approvalGrant: sourcePreflightGrantBlocked(),
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

function approvalPrerequisiteSourceInputCounts(
  sourceInputs,
  sourceReports,
  sourceInputsAccepted
) {
  return {
    total: sourceInputs.length,
    malformed: sourceReports.filter((report) => report.malformed).length,
    empty: sourceReports.filter((report) => report.empty).length,
    duplicate: sourceReports.filter((report) => report.duplicate).length,
    accepted: sourceInputsAccepted ? sourceInputs.length : 0,
    rejected: sourceInputsAccepted ? 0 : sourceInputs.length
  };
}

function approvalPrerequisiteAcceptedReaderInput(sourceInputs, reviewedAt) {
  return {
    reviewedAt,
    prerequisiteRecords: sourceInputs.flatMap((source) => source.records)
  };
}

function approvalPrerequisiteSourceReviewedAt(input) {
  return typeof input.reviewedAt === "string"
    ? input.reviewedAt
    : APPROVAL_PREREQUISITE_SOURCE_PREFLIGHT_DEFAULT_REVIEWED_AT;
}

function approvalPrerequisiteSourceInputArray(input) {
  return Array.isArray(input.sourceInputs) ? input.sourceInputs : [];
}

function approvalPrerequisiteSourceBlockingClassification(sourceReports) {
  return (
    [
      ["malformed_prerequisite_source_input_rejected", "malformed"],
      ["empty_prerequisite_source_input_rejected", "empty"],
      ["duplicate_prerequisite_source_input_rejected", "duplicate"]
    ].find(([, field]) => sourceReports.some((report) => report[field]))?.[0] ??
    null
  );
}

function approvalPrerequisiteSourceReaderClassification(readerResult) {
  return (
    APPROVAL_PREREQUISITE_SOURCE_CLASSIFICATION_BY_READER[
      readerResult.classification
    ] ?? "malformed_prerequisite_source_input_rejected"
  );
}

export function preflightApprovalPrerequisiteSourcesForReview(input = {}) {
  const reviewedAt = approvalPrerequisiteSourceReviewedAt(input);
  const sourceInputs = approvalPrerequisiteSourceInputArray(input);

  if (sourceInputs.length === 0) {
    return approvalPrerequisiteSourcePreflightResult({
      reviewedAt,
      classification: "missing_prerequisite_source_input_rejected",
      sourceInputs,
      sourceReports: [],
      acceptedReaderInput: null,
      approvalPrerequisiteReader: null
    });
  }

  const sourceReports = approvalPrerequisiteSourceReports(sourceInputs);
  markDuplicateApprovalPrerequisiteSources(sourceReports);

  const sourceBlockingClassification =
    approvalPrerequisiteSourceBlockingClassification(sourceReports);

  if (sourceBlockingClassification != null) {
    return approvalPrerequisiteSourcePreflightResult({
      reviewedAt,
      classification: sourceBlockingClassification,
      sourceInputs,
      sourceReports,
      acceptedReaderInput: null,
      approvalPrerequisiteReader: null
    });
  }

  const acceptedReaderInput = approvalPrerequisiteAcceptedReaderInput(
    sourceInputs,
    reviewedAt
  );
  const approvalPrerequisiteReader =
    readApprovalPrerequisiteRecordsForReview(acceptedReaderInput);
  const classification =
    approvalPrerequisiteSourceReaderClassification(approvalPrerequisiteReader);

  return approvalPrerequisiteSourcePreflightResult({
    reviewedAt,
    classification,
    sourceInputs,
    sourceReports,
    acceptedReaderInput,
    approvalPrerequisiteReader
  });
}

const APPROVAL_PREREQUISITE_SOURCE_SELECTION_CLASSIFICATION_BY_PREFLIGHT =
  Object.freeze({
    missing_prerequisite_source_input_rejected:
      "missing_prerequisite_source_selection_rejected",
    malformed_prerequisite_source_input_rejected:
      "malformed_prerequisite_source_selection_rejected",
    empty_prerequisite_source_input_rejected:
      "empty_prerequisite_source_selection_rejected",
    duplicate_prerequisite_source_input_rejected:
      "duplicate_prerequisite_source_selection_rejected",
    stale_prerequisite_source_input_rejected:
      "stale_prerequisite_source_selection_rejected",
    unknown_prerequisite_source_input_rejected:
      "unknown_prerequisite_source_selection_rejected",
    revoked_prerequisite_source_input_rejected:
      "revoked_prerequisite_source_selection_rejected"
  });

const APPROVAL_PREREQUISITE_SOURCE_SELECTION_ACCEPTED_CLASSIFICATIONS =
  Object.freeze([
    "valid_prerequisite_source_selected_review_only_runtime_still_blocked",
    "equivalent_prerequisite_sources_selected_review_only_runtime_still_blocked"
  ]);

function approvalPrerequisiteStableValue(value) {
  if (Array.isArray(value)) {
    return value.map((entry) => approvalPrerequisiteStableValue(entry));
  }

  if (!isPlainObjectRecord(value)) {
    return value;
  }

  return Object.fromEntries(
    Object.keys(value)
      .sort()
      .map((key) => [key, approvalPrerequisiteStableValue(value[key])])
  );
}

function approvalPrerequisiteSourceSelectionSignature(readerInput) {
  return JSON.stringify(
    approvalPrerequisiteStableValue(readerInput?.prerequisiteRecords ?? [])
  );
}

function approvalPrerequisiteSourceSelectionReport(source, index, reviewedAt) {
  const sourceId =
    isPlainObjectRecord(source) && typeof source.sourceId === "string"
      ? source.sourceId
      : null;
  const preflightResult = preflightApprovalPrerequisiteSourcesForReview({
    reviewedAt,
    sourceInputs: [source]
  });
  const signature = preflightResult.sourceInputsAccepted
    ? approvalPrerequisiteSourceSelectionSignature(preflightResult.acceptedReaderInput)
    : null;

  return {
    index,
    sourceId,
    preflightClassification: preflightResult.classification,
    preflightAccepted: preflightResult.sourceInputsAccepted,
    acceptedReaderInput: preflightResult.acceptedReaderInput,
    approvalPrerequisiteReader: preflightResult.approvalPrerequisiteReader,
    rejectionReasons: preflightResult.rejectionReasons,
    signature
  };
}

function approvalPrerequisiteSourceSelectionReports(sourceInputs, reviewedAt) {
  return sourceInputs.map((source, index) =>
    approvalPrerequisiteSourceSelectionReport(source, index, reviewedAt)
  );
}

function approvalPrerequisiteDuplicateSourceIds(sourceReports) {
  const sourceIdCounts = sourceReports.reduce((counts, report) => {
    if (report.sourceId != null) {
      counts.set(report.sourceId, (counts.get(report.sourceId) ?? 0) + 1);
    }

    return counts;
  }, new Map());

  return [...sourceIdCounts]
    .filter(([, count]) => count > 1)
    .map(([sourceId]) => sourceId)
    .sort();
}

function approvalPrerequisiteSourceReportOrder(left, right) {
  return (
    String(left.sourceId).localeCompare(String(right.sourceId)) ||
    left.index - right.index
  );
}

function approvalPrerequisiteSortedSourceReports(sourceReports) {
  return [...sourceReports].sort(approvalPrerequisiteSourceReportOrder);
}

function approvalPrerequisiteSelectionAccepted(classification) {
  return APPROVAL_PREREQUISITE_SOURCE_SELECTION_ACCEPTED_CLASSIFICATIONS.includes(
    classification
  );
}

function approvalPrerequisiteSourceIds(sourceReports) {
  return approvalPrerequisiteSortedSourceReports(sourceReports).map(
    (report) => report.sourceId
  );
}

function approvalPrerequisiteInvalidSourceReport(sourceReports) {
  return sourceReports.find((report) => !report.preflightAccepted) ?? null;
}

function approvalPrerequisiteSelectionClassificationForInvalid(report) {
  return (
    APPROVAL_PREREQUISITE_SOURCE_SELECTION_CLASSIFICATION_BY_PREFLIGHT[
      report.preflightClassification
    ] ?? "malformed_prerequisite_source_selection_rejected"
  );
}

function approvalPrerequisiteUniqueSignatures(sourceReports) {
  return new Set(sourceReports.map((report) => report.signature));
}

function approvalPrerequisiteSourceSelectionClassification(sourceReports) {
  return sourceReports.length > 1
    ? "equivalent_prerequisite_sources_selected_review_only_runtime_still_blocked"
    : "valid_prerequisite_source_selected_review_only_runtime_still_blocked";
}

function approvalPrerequisitePublicSelectionReports(
  sourceReports,
  selectedSourceId,
  accepted
) {
  return approvalPrerequisiteSortedSourceReports(sourceReports).map((report) => ({
    index: report.index,
    sourceId: report.sourceId,
    preflightClassification: report.preflightClassification,
    preflightAccepted: report.preflightAccepted,
    selected: accepted && report.sourceId === selectedSourceId,
    rejected: !accepted,
    equivalentToSelected: accepted && report.preflightAccepted,
    rejectionReasons: accepted ? [] : report.rejectionReasons
  }));
}

function approvalPrerequisiteSourceSelectionCounts(
  sourceReports,
  accepted,
  conflictingSourceIds,
  duplicateSourceIds
) {
  return {
    total: sourceReports.length,
    acceptedCandidates: sourceReports.filter((report) => report.preflightAccepted).length,
    rejectedCandidates: sourceReports.filter((report) => !report.preflightAccepted).length,
    equivalentCandidates: accepted ? sourceReports.length : 0,
    conflictingCandidates: conflictingSourceIds.length,
    duplicateSourceIds: duplicateSourceIds.length
  };
}

function approvalPrerequisiteSourceSelectionRejectionReasons({
  classification,
  sourceReports,
  conflictingSourceIds,
  duplicateSourceIds
}) {
  const classificationReasons =
    {
      missing_prerequisite_source_selection_rejected: [
        "missing_prerequisite_source_selection"
      ],
      duplicate_prerequisite_source_selection_rejected: [
        "duplicate_prerequisite_source_selection"
      ],
      conflicting_valid_prerequisite_sources_rejected: [
        "conflicting_valid_prerequisite_sources"
      ]
    }[classification] ?? [];
  const duplicateReasons = duplicateSourceIds.map(
    (sourceId) => `duplicate_source_id_${sourceId}`
  );
  const conflictReasons = conflictingSourceIds.map(
    (sourceId) => `conflicting_source_${sourceId}`
  );

  return [
    ...classificationReasons,
    ...duplicateReasons,
    ...conflictReasons,
    ...sourceReports.flatMap((report) => report.rejectionReasons),
    "approval_grant_not_implemented",
    "runtime_enablement_still_blocked"
  ];
}

function approvalPrerequisiteSourceSelectionSelectedState({
  sourceReports,
  selectedReport,
  accepted
}) {
  if (!accepted) {
    return {
      selectedSourceId: null,
      selectedSourceIds: [],
      equivalentSourceIds: [],
      rejectedSourceIds: approvalPrerequisiteSourceIds(sourceReports),
      selectedReaderInput: null,
      approvalPrerequisiteReader: null
    };
  }

  return {
    selectedSourceId: selectedReport.sourceId,
    selectedSourceIds: [selectedReport.sourceId],
    equivalentSourceIds: approvalPrerequisiteSourceIds(sourceReports),
    rejectedSourceIds: [],
    selectedReaderInput: selectedReport.acceptedReaderInput,
    approvalPrerequisiteReader: selectedReport.approvalPrerequisiteReader
  };
}

function approvalPrerequisiteSourceSelectionResult({
  reviewedAt,
  classification,
  sourceReports,
  selectedReport,
  conflictingSourceIds = [],
  duplicateSourceIds = []
}) {
  const accepted = approvalPrerequisiteSelectionAccepted(classification);
  const selectedState = approvalPrerequisiteSourceSelectionSelectedState({
    sourceReports,
    selectedReport,
    accepted
  });

  return {
    schema: APPROVAL_PREREQUISITE_SOURCE_SELECTION_SCHEMA,
    schemaVersion: APPROVAL_PREREQUISITE_SOURCE_SELECTION_VERSION,
    selectionKind: APPROVAL_PREREQUISITE_SOURCE_SELECTION_KIND,
    selectionMode: "review-only",
    reviewedAt,
    classification,
    sourceSelectionAccepted: accepted,
    readerInputForwarded: accepted,
    selectedSourceId: selectedState.selectedSourceId,
    selectedSourceIds: selectedState.selectedSourceIds,
    equivalentSourceIds: selectedState.equivalentSourceIds,
    rejectedSourceIds: selectedState.rejectedSourceIds,
    conflictingSourceIds,
    duplicateSourceIds,
    reviewOnly: true,
    authoritative: false,
    sourceInputCounts: approvalPrerequisiteSourceSelectionCounts(
      sourceReports,
      accepted,
      conflictingSourceIds,
      duplicateSourceIds
    ),
    sourceSelectionReports: approvalPrerequisitePublicSelectionReports(
      sourceReports,
      selectedState.selectedSourceId,
      accepted
    ),
    selectedReaderInput: selectedState.selectedReaderInput,
    approvalPrerequisiteReader: selectedState.approvalPrerequisiteReader,
    rejectionReasons: approvalPrerequisiteSourceSelectionRejectionReasons({
      classification,
      sourceReports,
      conflictingSourceIds,
      duplicateSourceIds
    }),
    approvalGrant: sourcePreflightGrantBlocked(),
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

function approvalPrerequisiteSourceSelectionDecision(sourceReports) {
  const duplicateSourceIds = approvalPrerequisiteDuplicateSourceIds(sourceReports);

  if (duplicateSourceIds.length > 0) {
    return {
      classification: "duplicate_prerequisite_source_selection_rejected",
      selectedReport: null,
      duplicateSourceIds
    };
  }

  const invalidReport = approvalPrerequisiteInvalidSourceReport(sourceReports);
  if (invalidReport != null) {
    return {
      classification: approvalPrerequisiteSelectionClassificationForInvalid(
        invalidReport
      ),
      selectedReport: null
    };
  }

  if (approvalPrerequisiteUniqueSignatures(sourceReports).size > 1) {
    return {
      classification: "conflicting_valid_prerequisite_sources_rejected",
      selectedReport: null,
      conflictingSourceIds: approvalPrerequisiteSourceIds(sourceReports)
    };
  }

  const sortedReports = approvalPrerequisiteSortedSourceReports(sourceReports);
  const [selectedReport] = sortedReports;

  return {
    classification: approvalPrerequisiteSourceSelectionClassification(sourceReports),
    selectedReport
  };
}

export function selectApprovalPrerequisiteSourcesForReview(input = {}) {
  const reviewedAt = approvalPrerequisiteSourceReviewedAt(input);
  const sourceInputs = approvalPrerequisiteSourceInputArray(input);

  if (sourceInputs.length === 0) {
    return approvalPrerequisiteSourceSelectionResult({
      reviewedAt,
      classification: "missing_prerequisite_source_selection_rejected",
      sourceReports: [],
      selectedReport: null
    });
  }

  const sourceReports = approvalPrerequisiteSourceSelectionReports(
    sourceInputs,
    reviewedAt
  );
  const decision = approvalPrerequisiteSourceSelectionDecision(sourceReports);

  return approvalPrerequisiteSourceSelectionResult({
    reviewedAt,
    sourceReports,
    ...decision
  });
}

const APPROVAL_PREREQUISITE_SOURCE_BUNDLE_PART_KIND =
  "selected-prerequisite-source";
const APPROVAL_PREREQUISITE_SOURCE_BUNDLE_PART_MODE = "in-memory";

const APPROVAL_PREREQUISITE_SOURCE_BUNDLE_CLASSIFICATION_BY_SELECTION =
  Object.freeze({
    missing_prerequisite_source_selection_rejected:
      "missing_required_prerequisite_source_bundle_part_rejected",
    malformed_prerequisite_source_selection_rejected:
      "malformed_prerequisite_source_bundle_rejected",
    empty_prerequisite_source_selection_rejected:
      "empty_prerequisite_source_bundle_rejected",
    duplicate_prerequisite_source_selection_rejected:
      "malformed_prerequisite_source_bundle_rejected",
    stale_prerequisite_source_selection_rejected:
      "stale_prerequisite_source_bundle_rejected",
    unknown_prerequisite_source_selection_rejected:
      "unknown_prerequisite_source_bundle_rejected",
    revoked_prerequisite_source_selection_rejected:
      "revoked_prerequisite_source_bundle_rejected",
    conflicting_valid_prerequisite_sources_rejected:
      "conflicting_prerequisite_source_bundle_parts_rejected"
  });

const APPROVAL_PREREQUISITE_SOURCE_BUNDLE_ACCEPTED_CLASSIFICATIONS =
  Object.freeze([
    "valid_prerequisite_source_bundle_review_only_runtime_still_blocked",
    "duplicate_equivalent_prerequisite_source_bundle_parts_review_only_runtime_still_blocked"
  ]);

function approvalPrerequisiteSourceBundleParts(input) {
  return Array.isArray(input.bundleParts) ? input.bundleParts : [];
}

function approvalPrerequisiteBundlePartId(part) {
  return isPlainObjectRecord(part) && typeof part.partId === "string"
    ? part.partId
    : null;
}

function approvalPrerequisiteBundlePartMalformed(part) {
  if (!isPlainObjectRecord(part)) {
    return true;
  }

  return [
    typeof part.partId !== "string" || part.partId.length === 0,
    part.partKind !== APPROVAL_PREREQUISITE_SOURCE_BUNDLE_PART_KIND,
    part.partMode !== APPROVAL_PREREQUISITE_SOURCE_BUNDLE_PART_MODE,
    !Array.isArray(part.sourceInputs)
  ].some(Boolean);
}

function approvalPrerequisiteBundlePartField(part, fieldName) {
  return isPlainObjectRecord(part) ? part[fieldName] ?? null : null;
}

function approvalPrerequisiteBundlePartSourceInputs(part) {
  return isPlainObjectRecord(part) && Array.isArray(part.sourceInputs)
    ? part.sourceInputs
    : [];
}

function approvalPrerequisiteBundlePartSourceSelection({
  part,
  malformed,
  reviewedAt
}) {
  return malformed
    ? null
    : selectApprovalPrerequisiteSourcesForReview({
        reviewedAt,
        sourceInputs: approvalPrerequisiteBundlePartSourceInputs(part)
      });
}

function approvalPrerequisiteBundlePartSignature(sourceSelection) {
  return sourceSelection?.sourceSelectionAccepted === true
    ? approvalPrerequisiteSourceSelectionSignature(
        sourceSelection.selectedReaderInput
      )
    : null;
}

function approvalPrerequisiteBundlePartSelectionState(sourceSelection) {
  if (sourceSelection == null) {
    return {
      sourceSelectionAccepted: false,
      selectedReaderInput: null,
      approvalPrerequisiteReader: null,
      rejectionReasons: []
    };
  }

  return {
    sourceSelectionAccepted: sourceSelection.sourceSelectionAccepted === true,
    selectedReaderInput: sourceSelection.selectedReaderInput ?? null,
    approvalPrerequisiteReader: sourceSelection.approvalPrerequisiteReader ?? null,
    rejectionReasons: sourceSelection.rejectionReasons ?? []
  };
}

function approvalPrerequisiteSourceBundlePartReport(part, index, reviewedAt) {
  const malformed = approvalPrerequisiteBundlePartMalformed(part);
  const partId = approvalPrerequisiteBundlePartId(part);
  const sourceSelection = approvalPrerequisiteBundlePartSourceSelection({
    part,
    malformed,
    reviewedAt
  });
  const signature = approvalPrerequisiteBundlePartSignature(sourceSelection);
  const selectionState =
    approvalPrerequisiteBundlePartSelectionState(sourceSelection);

  return {
    index,
    partId,
    partKind: approvalPrerequisiteBundlePartField(part, "partKind"),
    partMode: approvalPrerequisiteBundlePartField(part, "partMode"),
    malformed,
    sourceSelection,
    sourceSelectionAccepted: selectionState.sourceSelectionAccepted,
    selectedReaderInput: selectionState.selectedReaderInput,
    approvalPrerequisiteReader: selectionState.approvalPrerequisiteReader,
    rejectionReasons: selectionState.rejectionReasons,
    signature
  };
}

function approvalPrerequisiteSourceBundlePartReports(bundleParts, reviewedAt) {
  return bundleParts.map((part, index) =>
    approvalPrerequisiteSourceBundlePartReport(part, index, reviewedAt)
  );
}

function approvalPrerequisiteBundlePartOrder(left, right) {
  return (
    String(left.partId).localeCompare(String(right.partId)) ||
    left.index - right.index
  );
}

function approvalPrerequisiteSortedBundlePartReports(partReports) {
  return [...partReports].sort(approvalPrerequisiteBundlePartOrder);
}

function approvalPrerequisiteBundlePartIds(partReports) {
  return approvalPrerequisiteSortedBundlePartReports(partReports).map(
    (report) => report.partId
  );
}

function approvalPrerequisiteBundlePartSelectionAccepted(classification) {
  return APPROVAL_PREREQUISITE_SOURCE_BUNDLE_ACCEPTED_CLASSIFICATIONS.includes(
    classification
  );
}

function approvalPrerequisiteMalformedBundlePart(partReports) {
  return partReports.find((report) => report.malformed) ?? null;
}

function approvalPrerequisiteInvalidBundleSourceSelection(partReports) {
  return partReports.find((report) => !report.sourceSelectionAccepted) ?? null;
}

function approvalPrerequisiteBundleClassificationForInvalid(report) {
  return (
    APPROVAL_PREREQUISITE_SOURCE_BUNDLE_CLASSIFICATION_BY_SELECTION[
      report.sourceSelection?.classification
    ] ?? "malformed_prerequisite_source_bundle_rejected"
  );
}

function approvalPrerequisiteBundleUniqueSignatures(partReports) {
  return new Set(partReports.map((report) => report.signature));
}

function approvalPrerequisiteBundleSelectionClassification(partReports) {
  return partReports.length > 1
    ? "duplicate_equivalent_prerequisite_source_bundle_parts_review_only_runtime_still_blocked"
    : "valid_prerequisite_source_bundle_review_only_runtime_still_blocked";
}

function approvalPrerequisiteSourceBundleDecision(partReports) {
  const malformedPart = approvalPrerequisiteMalformedBundlePart(partReports);
  if (malformedPart != null) {
    const missingRequired = malformedPart.partKind !==
      APPROVAL_PREREQUISITE_SOURCE_BUNDLE_PART_KIND;

    return {
      classification: missingRequired
        ? "missing_required_prerequisite_source_bundle_part_rejected"
        : "malformed_prerequisite_source_bundle_part_rejected",
      selectedReport: null
    };
  }

  const invalidSelection =
    approvalPrerequisiteInvalidBundleSourceSelection(partReports);
  if (invalidSelection != null) {
    return {
      classification:
        approvalPrerequisiteBundleClassificationForInvalid(invalidSelection),
      selectedReport: null
    };
  }

  if (approvalPrerequisiteBundleUniqueSignatures(partReports).size > 1) {
    return {
      classification: "conflicting_prerequisite_source_bundle_parts_rejected",
      selectedReport: null,
      conflictingBundlePartIds: approvalPrerequisiteBundlePartIds(partReports)
    };
  }

  const sortedReports = approvalPrerequisiteSortedBundlePartReports(partReports);
  const [selectedReport] = sortedReports;

  return {
    classification: approvalPrerequisiteBundleSelectionClassification(partReports),
    selectedReport
  };
}

function approvalPrerequisiteBundleSelectedState({
  partReports,
  selectedReport,
  accepted
}) {
  if (!accepted) {
    return {
      selectedBundlePartId: null,
      selectedBundlePartIds: [],
      equivalentBundlePartIds: [],
      rejectedBundlePartIds: approvalPrerequisiteBundlePartIds(partReports),
      bundledReaderInput: null,
      approvalPrerequisiteReader: null
    };
  }

  return {
    selectedBundlePartId: selectedReport.partId,
    selectedBundlePartIds: [selectedReport.partId],
    equivalentBundlePartIds: approvalPrerequisiteBundlePartIds(partReports),
    rejectedBundlePartIds: [],
    bundledReaderInput: selectedReport.selectedReaderInput,
    approvalPrerequisiteReader: selectedReport.approvalPrerequisiteReader
  };
}

function approvalPrerequisitePublicBundlePartReports(
  partReports,
  selectedBundlePartId,
  accepted
) {
  return approvalPrerequisiteSortedBundlePartReports(partReports).map((report) => ({
    index: report.index,
    partId: report.partId,
    partKind: report.partKind,
    partMode: report.partMode,
    malformed: report.malformed,
    sourceSelectionClassification: report.sourceSelection?.classification ?? null,
    sourceSelectionAccepted: report.sourceSelectionAccepted,
    selected: accepted && report.partId === selectedBundlePartId,
    rejected: !accepted,
    equivalentToSelected: accepted && report.sourceSelectionAccepted,
    rejectionReasons: accepted ? [] : report.rejectionReasons
  }));
}

function approvalPrerequisiteSourceBundleCounts({
  partReports,
  accepted,
  conflictingBundlePartIds
}) {
  return {
    total: partReports.length,
    malformed: partReports.filter((report) => report.malformed).length,
    acceptedCandidates: partReports.filter(
      (report) => report.sourceSelectionAccepted
    ).length,
    rejectedCandidates: partReports.filter(
      (report) => !report.sourceSelectionAccepted
    ).length,
    equivalentCandidates: accepted ? partReports.length : 0,
    conflictingCandidates: conflictingBundlePartIds.length
  };
}

function approvalPrerequisiteSourceBundleRejectionReasons({
  classification,
  partReports,
  conflictingBundlePartIds
}) {
  const classificationReasons =
    {
      missing_prerequisite_source_bundle_parts_rejected: [
        "missing_prerequisite_source_bundle_parts"
      ],
      missing_required_prerequisite_source_bundle_part_rejected: [
        "missing_required_prerequisite_source_bundle_part"
      ],
      malformed_prerequisite_source_bundle_part_rejected: [
        "malformed_prerequisite_source_bundle_part"
      ],
      conflicting_prerequisite_source_bundle_parts_rejected: [
        "conflicting_prerequisite_source_bundle_parts"
      ]
    }[classification] ?? [];
  const conflictReasons = conflictingBundlePartIds.map(
    (partId) => `conflicting_bundle_part_${partId}`
  );
  const malformedReasons = partReports.flatMap((report) =>
    report.malformed ? [`bundle_part_${report.index}_malformed`] : []
  );

  return [
    ...classificationReasons,
    ...conflictReasons,
    ...malformedReasons,
    ...partReports.flatMap((report) => report.rejectionReasons),
    "approval_grant_not_implemented",
    "runtime_enablement_still_blocked"
  ];
}

function approvalPrerequisiteSourceBundleResult({
  reviewedAt,
  classification,
  partReports,
  selectedReport,
  conflictingBundlePartIds = []
}) {
  const accepted = approvalPrerequisiteBundlePartSelectionAccepted(classification);
  const selectedState = approvalPrerequisiteBundleSelectedState({
    partReports,
    selectedReport,
    accepted
  });

  return {
    schema: APPROVAL_PREREQUISITE_SOURCE_BUNDLE_SCHEMA,
    schemaVersion: APPROVAL_PREREQUISITE_SOURCE_BUNDLE_VERSION,
    bundleKind: APPROVAL_PREREQUISITE_SOURCE_BUNDLE_KIND,
    bundleMode: "review-only",
    reviewedAt,
    classification,
    sourceBundleAccepted: accepted,
    readerInputForwarded: accepted,
    selectedBundlePartId: selectedState.selectedBundlePartId,
    selectedBundlePartIds: selectedState.selectedBundlePartIds,
    equivalentBundlePartIds: selectedState.equivalentBundlePartIds,
    rejectedBundlePartIds: selectedState.rejectedBundlePartIds,
    conflictingBundlePartIds,
    reviewOnly: true,
    authoritative: false,
    bundlePartCounts: approvalPrerequisiteSourceBundleCounts({
      partReports,
      accepted,
      conflictingBundlePartIds
    }),
    bundlePartReports: approvalPrerequisitePublicBundlePartReports(
      partReports,
      selectedState.selectedBundlePartId,
      accepted
    ),
    bundledReaderInput: selectedState.bundledReaderInput,
    approvalPrerequisiteReader: selectedState.approvalPrerequisiteReader,
    rejectionReasons: approvalPrerequisiteSourceBundleRejectionReasons({
      classification,
      partReports,
      conflictingBundlePartIds
    }),
    approvalGrant: sourcePreflightGrantBlocked(),
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

export function bundleApprovalPrerequisiteSourcesForReview(input = {}) {
  const reviewedAt = approvalPrerequisiteSourceReviewedAt(input);
  const bundleParts = approvalPrerequisiteSourceBundleParts(input);

  if (bundleParts.length === 0) {
    return approvalPrerequisiteSourceBundleResult({
      reviewedAt,
      classification: "missing_prerequisite_source_bundle_parts_rejected",
      partReports: [],
      selectedReport: null
    });
  }

  const partReports = approvalPrerequisiteSourceBundlePartReports(
    bundleParts,
    reviewedAt
  );
  const decision = approvalPrerequisiteSourceBundleDecision(partReports);

  return approvalPrerequisiteSourceBundleResult({
    reviewedAt,
    partReports,
    ...decision
  });
}

const APPROVAL_PREREQUISITE_BUNDLE_CONSUMPTION_ACCEPTED_CLASSIFICATIONS =
  Object.freeze([
    "valid_prerequisite_bundle_consumed_for_review_only_runtime_still_blocked"
  ]);

function approvalPrerequisiteBundleConsumptionSourceBundle(input) {
  return isPlainObjectRecord(input) ? input.sourceBundle : null;
}

function approvalPrerequisiteSourceBundleRuntimeEffectBlocked(sourceBundle) {
  if (!isPlainObjectRecord(sourceBundle?.runtimeEffect)) {
    return false;
  }

  return Object.keys(REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE).every(
    (key) => sourceBundle.runtimeEffect[key] === false
  );
}

function approvalPrerequisiteSourceBundleGrantBlocked(sourceBundle) {
  return (
    isPlainObjectRecord(sourceBundle?.approvalGrant) &&
    sourceBundle.approvalGrant.produced === false &&
    sourceBundle.approvalGrant.persisted === false &&
    sourceBundle.approvalGrant.grantId === null
  );
}

function approvalPrerequisiteBundleConsumptionMalformed(sourceBundle) {
  return [
    sourceBundle.schema !== APPROVAL_PREREQUISITE_SOURCE_BUNDLE_SCHEMA,
    sourceBundle.schemaVersion !== APPROVAL_PREREQUISITE_SOURCE_BUNDLE_VERSION,
    sourceBundle.bundleKind !== APPROVAL_PREREQUISITE_SOURCE_BUNDLE_KIND,
    sourceBundle.bundleMode !== "review-only",
    sourceBundle.reviewOnly !== true,
    sourceBundle.authoritative !== false,
    !approvalPrerequisiteSourceBundleGrantBlocked(sourceBundle),
    !approvalPrerequisiteSourceBundleRuntimeEffectBlocked(sourceBundle)
  ].some(Boolean);
}

function approvalPrerequisiteBundleConsumptionConflict(sourceBundle) {
  return (
    sourceBundle.classification ===
      "conflicting_prerequisite_source_bundle_parts_rejected" ||
    approvalPrerequisiteBundleConsumptionArrayField(
      sourceBundle,
      "conflictingBundlePartIds"
    ).length > 0
  );
}

function approvalPrerequisiteBundleConsumptionForwardable(sourceBundle) {
  return (
    sourceBundle.sourceBundleAccepted === true &&
    sourceBundle.readerInputForwarded === true &&
    isPlainObjectRecord(sourceBundle.bundledReaderInput) &&
    Array.isArray(sourceBundle.bundledReaderInput.prerequisiteRecords)
  );
}

function approvalPrerequisiteBundleConsumptionClassificationForPresentBundle(
  sourceBundle
) {
  if (approvalPrerequisiteBundleConsumptionMalformed(sourceBundle)) {
    return "malformed_prerequisite_bundle_consumption_rejected";
  }

  if (approvalPrerequisiteBundleConsumptionConflict(sourceBundle)) {
    return "conflicting_prerequisite_bundle_consumption_rejected";
  }

  return approvalPrerequisiteBundleConsumptionForwardable(sourceBundle)
    ? "valid_prerequisite_bundle_consumed_for_review_only_runtime_still_blocked"
    : "malformed_prerequisite_bundle_consumption_rejected";
}

function approvalPrerequisiteBundleConsumptionClassification(sourceBundle) {
  return isPlainObjectRecord(sourceBundle)
    ? approvalPrerequisiteBundleConsumptionClassificationForPresentBundle(
        sourceBundle
      )
    : "missing_prerequisite_bundle_consumption_rejected";
}

function approvalPrerequisiteBundleConsumptionAccepted(classification) {
  return APPROVAL_PREREQUISITE_BUNDLE_CONSUMPTION_ACCEPTED_CLASSIFICATIONS.includes(
    classification
  );
}

function approvalPrerequisiteBundleConsumptionEvaluator({
  accepted,
  reviewedAt,
  sourceBundle
}) {
  if (!accepted) {
    return null;
  }

  return evaluateRuntimeApprovalPrerequisitesForReview({
    reviewedAt,
    prerequisiteRecords: sourceBundle.bundledReaderInput.prerequisiteRecords
  });
}

function approvalPrerequisiteBundleConsumptionArrayField(sourceBundle, fieldName) {
  return Array.isArray(sourceBundle?.[fieldName]) ? sourceBundle[fieldName] : [];
}

function approvalPrerequisiteBundleConsumptionMissingSourceSummary() {
  return {
    sourceBundleSchema: null,
    sourceBundleClassification: null,
    sourceBundleAccepted: false,
    selectedBundlePartId: null,
    equivalentBundlePartIds: [],
    rejectedBundlePartIds: [],
    conflictingBundlePartIds: []
  };
}

function approvalPrerequisiteBundleConsumptionPresentSourceSummary(sourceBundle) {
  return {
    sourceBundleSchema: sourceBundle.schema ?? null,
    sourceBundleClassification: sourceBundle.classification ?? null,
    sourceBundleAccepted: sourceBundle.sourceBundleAccepted === true,
    selectedBundlePartId: sourceBundle.selectedBundlePartId ?? null,
    equivalentBundlePartIds: approvalPrerequisiteBundleConsumptionArrayField(
      sourceBundle,
      "equivalentBundlePartIds"
    ),
    rejectedBundlePartIds: approvalPrerequisiteBundleConsumptionArrayField(
      sourceBundle,
      "rejectedBundlePartIds"
    ),
    conflictingBundlePartIds: approvalPrerequisiteBundleConsumptionArrayField(
      sourceBundle,
      "conflictingBundlePartIds"
    )
  };
}

function approvalPrerequisiteBundleConsumptionSourceSummary(sourceBundle) {
  return isPlainObjectRecord(sourceBundle)
    ? approvalPrerequisiteBundleConsumptionPresentSourceSummary(sourceBundle)
    : approvalPrerequisiteBundleConsumptionMissingSourceSummary();
}

function approvalPrerequisiteBundleConsumptionRejectedSummary() {
  return {
    selectedBundlePartId: null,
    readerRecordCount: 0,
    evaluatorClassification: null,
    prerequisiteSignalRecognized: false,
    evaluatorReviewOnly: false,
    evaluatorAuthoritative: false
  };
}

function approvalPrerequisiteBundleConsumptionAcceptedSummary({
  sourceBundle,
  evaluator
}) {
  return {
    selectedBundlePartId: sourceBundle.selectedBundlePartId,
    readerRecordCount: sourceBundle.bundledReaderInput.prerequisiteRecords.length,
    evaluatorClassification: evaluator.classification,
    prerequisiteSignalRecognized: evaluator.prerequisiteSignalRecognized,
    evaluatorReviewOnly: evaluator.reviewOnly,
    evaluatorAuthoritative: evaluator.authoritative
  };
}

function approvalPrerequisiteBundleConsumptionSummary({
  accepted,
  sourceBundle,
  evaluator
}) {
  return accepted
    ? approvalPrerequisiteBundleConsumptionAcceptedSummary({
        sourceBundle,
        evaluator
      })
    : approvalPrerequisiteBundleConsumptionRejectedSummary();
}

function approvalPrerequisiteBundleConsumptionRejectionReasons({
  classification,
  sourceBundle
}) {
  const classificationReasons =
    {
      missing_prerequisite_bundle_consumption_rejected: [
        "missing_prerequisite_source_bundle"
      ],
      malformed_prerequisite_bundle_consumption_rejected: [
        "malformed_prerequisite_source_bundle"
      ],
      conflicting_prerequisite_bundle_consumption_rejected: [
        "conflicting_prerequisite_source_bundle_parts"
      ]
    }[classification] ?? [];
  const bundleReasons = Array.isArray(sourceBundle?.rejectionReasons)
    ? sourceBundle.rejectionReasons
    : [];

  return [
    ...classificationReasons,
    ...bundleReasons,
    "approval_grant_not_implemented",
    "runtime_enablement_still_blocked"
  ];
}

function approvalPrerequisiteBundleConsumptionResult({
  reviewedAt,
  sourceBundle,
  classification
}) {
  const accepted =
    approvalPrerequisiteBundleConsumptionAccepted(classification);
  const evaluator = approvalPrerequisiteBundleConsumptionEvaluator({
    accepted,
    reviewedAt,
    sourceBundle
  });

  return {
    schema: APPROVAL_PREREQUISITE_BUNDLE_CONSUMPTION_CHECKPOINT_SCHEMA,
    schemaVersion: APPROVAL_PREREQUISITE_BUNDLE_CONSUMPTION_CHECKPOINT_VERSION,
    checkpointKind: APPROVAL_PREREQUISITE_BUNDLE_CONSUMPTION_CHECKPOINT_KIND,
    checkpointMode: "review-only",
    reviewedAt,
    classification,
    bundleConsumedForReview: accepted,
    evaluatorInputForwarded: accepted,
    reviewOnly: true,
    authoritative: false,
    sourceBundleSummary:
      approvalPrerequisiteBundleConsumptionSourceSummary(sourceBundle),
    consumedBundleSummary: approvalPrerequisiteBundleConsumptionSummary({
      accepted,
      sourceBundle,
      evaluator
    }),
    approvalPrerequisiteEvaluator: evaluator,
    rejectionReasons: approvalPrerequisiteBundleConsumptionRejectionReasons({
      classification,
      sourceBundle
    }),
    approvalGrant: sourcePreflightGrantBlocked(),
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

export function consumeApprovalPrerequisiteBundleForReview(input = {}) {
  const reviewedAt = approvalPrerequisiteSourceReviewedAt(input);
  const sourceBundle = approvalPrerequisiteBundleConsumptionSourceBundle(input);
  const classification =
    approvalPrerequisiteBundleConsumptionClassification(sourceBundle);

  return approvalPrerequisiteBundleConsumptionResult({
    reviewedAt,
    sourceBundle,
    classification
  });
}

const APPROVAL_PREREQUISITE_INTEGRATION_ACCEPTED_CLASSIFICATIONS = Object.freeze([
  "valid_prerequisite_integration_review_summary_runtime_still_blocked"
]);

const APPROVAL_PREREQUISITE_INTEGRATION_CLASSIFICATION_BY_SELECTION =
  Object.freeze({
    missing_prerequisite_source_selection_rejected:
      "missing_prerequisite_integration_input_rejected",
    malformed_prerequisite_source_selection_rejected:
      "malformed_prerequisite_integration_input_rejected",
    empty_prerequisite_source_selection_rejected:
      "empty_prerequisite_integration_input_rejected",
    duplicate_prerequisite_source_selection_rejected:
      "duplicate_prerequisite_integration_input_rejected",
    stale_prerequisite_source_selection_rejected:
      "stale_prerequisite_integration_input_rejected",
    unknown_prerequisite_source_selection_rejected:
      "unknown_prerequisite_integration_input_rejected",
    revoked_prerequisite_source_selection_rejected:
      "revoked_prerequisite_integration_input_rejected",
    conflicting_valid_prerequisite_sources_rejected:
      "conflicting_prerequisite_integration_input_rejected"
  });

const APPROVAL_PREREQUISITE_INTEGRATION_CLASSIFICATION_BY_BUNDLE =
  Object.freeze({
    missing_prerequisite_source_bundle_parts_rejected:
      "missing_prerequisite_integration_input_rejected",
    missing_required_prerequisite_source_bundle_part_rejected:
      "malformed_prerequisite_integration_input_rejected",
    malformed_prerequisite_source_bundle_part_rejected:
      "malformed_prerequisite_integration_input_rejected",
    conflicting_prerequisite_source_bundle_parts_rejected:
      "conflicting_prerequisite_integration_input_rejected",
    stale_prerequisite_source_bundle_rejected:
      "stale_prerequisite_integration_input_rejected",
    revoked_prerequisite_source_bundle_rejected:
      "revoked_prerequisite_integration_input_rejected",
    unknown_prerequisite_source_bundle_rejected:
      "unknown_prerequisite_integration_input_rejected",
    malformed_prerequisite_source_bundle_rejected:
      "malformed_prerequisite_integration_input_rejected",
    empty_prerequisite_source_bundle_rejected:
      "empty_prerequisite_integration_input_rejected"
  });

const APPROVAL_PREREQUISITE_INTEGRATION_CLASSIFICATION_BY_CONSUMPTION =
  Object.freeze({
    missing_prerequisite_bundle_consumption_rejected:
      "missing_prerequisite_integration_input_rejected",
    malformed_prerequisite_bundle_consumption_rejected:
      "malformed_prerequisite_integration_input_rejected",
    conflicting_prerequisite_bundle_consumption_rejected:
      "conflicting_prerequisite_integration_input_rejected",
    valid_prerequisite_bundle_consumed_for_review_only_runtime_still_blocked:
      "valid_prerequisite_integration_review_summary_runtime_still_blocked"
  });

function approvalPrerequisiteIntegrationSourceInputs(input) {
  return Array.isArray(input.sourceInputs) ? input.sourceInputs : [];
}

function approvalPrerequisiteIntegrationBundleParts(sourceInputs) {
  return sourceInputs.length === 0
    ? []
    : [
        {
          partId: "phase-5.24-selected-prerequisite-sources",
          partKind: APPROVAL_PREREQUISITE_SOURCE_BUNDLE_PART_KIND,
          partMode: APPROVAL_PREREQUISITE_SOURCE_BUNDLE_PART_MODE,
          sourceInputs
        }
      ];
}

function approvalPrerequisiteIntegrationSourceIngestionResults({
  reviewedAt,
  sourceInputs
}) {
  return sourceInputs.map((source, index) => {
    const result = preflightApprovalPrerequisiteSourcesForReview({
      reviewedAt,
      sourceInputs: [source]
    });
    const sourceReport = result.sourceInputs[0] ?? null;

    return {
      index,
      sourceId: sourceReport?.sourceId ?? null,
      classification: result.classification,
      sourceInputsAccepted: result.sourceInputsAccepted,
      readerInputForwarded: result.readerInputForwarded,
      prerequisiteSignalRecognized:
        result.approvalPrerequisiteReader?.prerequisiteSignalRecognized ?? false,
      reviewOnly: result.reviewOnly,
      authoritative: result.authoritative,
      approvalGrantProduced: result.approvalGrant.produced,
      runtimeEffectAllFalse: reviewOnlyRuntimeEffectAllFalse(result.runtimeEffect)
    };
  });
}

function reviewOnlyRuntimeEffectAllFalse(runtimeEffect) {
  return (
    isPlainObjectRecord(runtimeEffect) &&
    Object.keys(REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE).every(
      (key) => runtimeEffect[key] === false
    ) &&
    Object.values(runtimeEffect).every(
      (value) => value === false
    )
  );
}

function approvalPrerequisiteIntegrationSelectionSummary(sourceSelection) {
  return {
    classification: sourceSelection.classification,
    sourceSelectionAccepted: sourceSelection.sourceSelectionAccepted,
    readerInputForwarded: sourceSelection.readerInputForwarded,
    selectedSourceId: sourceSelection.selectedSourceId,
    equivalentSourceIds: sourceSelection.equivalentSourceIds,
    rejectedSourceIds: sourceSelection.rejectedSourceIds,
    conflictingSourceIds: sourceSelection.conflictingSourceIds,
    duplicateSourceIds: sourceSelection.duplicateSourceIds,
    approvalGrantProduced: sourceSelection.approvalGrant.produced,
    runtimeEffectAllFalse: reviewOnlyRuntimeEffectAllFalse(sourceSelection.runtimeEffect)
  };
}

function approvalPrerequisiteIntegrationBundleSummary(sourceBundle) {
  return {
    classification: sourceBundle.classification,
    sourceBundleAccepted: sourceBundle.sourceBundleAccepted,
    readerInputForwarded: sourceBundle.readerInputForwarded,
    selectedBundlePartId: sourceBundle.selectedBundlePartId,
    equivalentBundlePartIds: sourceBundle.equivalentBundlePartIds,
    rejectedBundlePartIds: sourceBundle.rejectedBundlePartIds,
    conflictingBundlePartIds: sourceBundle.conflictingBundlePartIds,
    approvalGrantProduced: sourceBundle.approvalGrant.produced,
    runtimeEffectAllFalse: reviewOnlyRuntimeEffectAllFalse(sourceBundle.runtimeEffect)
  };
}

function approvalPrerequisiteIntegrationConsumptionSummary(bundleConsumption) {
  return {
    classification: bundleConsumption.classification,
    bundleConsumedForReview: bundleConsumption.bundleConsumedForReview,
    evaluatorInputForwarded: bundleConsumption.evaluatorInputForwarded,
    selectedBundlePartId:
      bundleConsumption.consumedBundleSummary.selectedBundlePartId,
    readerRecordCount: bundleConsumption.consumedBundleSummary.readerRecordCount,
    evaluatorClassification:
      bundleConsumption.consumedBundleSummary.evaluatorClassification,
    prerequisiteSignalRecognized:
      bundleConsumption.consumedBundleSummary.prerequisiteSignalRecognized,
    approvalGrantProduced: bundleConsumption.approvalGrant.produced,
    runtimeEffectAllFalse: reviewOnlyRuntimeEffectAllFalse(
      bundleConsumption.runtimeEffect
    )
  };
}

function approvalPrerequisiteIntegrationReviewSummary(evaluator) {
  if (evaluator == null) {
    return null;
  }

  return {
    schema: evaluator.schema,
    evaluatorKind: evaluator.evaluatorKind,
    evaluationMode: evaluator.evaluationMode,
    classification: evaluator.classification,
    prerequisiteSignalRecognized: evaluator.prerequisiteSignalRecognized,
    reviewOnly: evaluator.reviewOnly,
    authoritative: evaluator.authoritative,
    reviewSummaryIsApprovalGrant: false,
    approvalGrantProduced: evaluator.approvalGrant.produced,
    approvalGrantPersisted: evaluator.approvalGrant.persisted,
    approvalGrantId: evaluator.approvalGrant.grantId,
    runtimeEffectAllFalse: reviewOnlyRuntimeEffectAllFalse(evaluator.runtimeEffect)
  };
}

function approvalPrerequisiteIntegrationClassification({
  sourceSelection,
  sourceBundle,
  bundleConsumption
}) {
  return (
    APPROVAL_PREREQUISITE_INTEGRATION_CLASSIFICATION_BY_SELECTION[
      sourceSelection.classification
    ] ??
    APPROVAL_PREREQUISITE_INTEGRATION_CLASSIFICATION_BY_BUNDLE[
      sourceBundle.classification
    ] ??
    APPROVAL_PREREQUISITE_INTEGRATION_CLASSIFICATION_BY_CONSUMPTION[
      bundleConsumption.classification
    ] ??
    "malformed_prerequisite_integration_input_rejected"
  );
}

function approvalPrerequisiteIntegrationAccepted(classification) {
  return APPROVAL_PREREQUISITE_INTEGRATION_ACCEPTED_CLASSIFICATIONS.includes(
    classification
  );
}

function approvalPrerequisiteIntegrationRejectionReasons({
  accepted,
  sourceSelection,
  sourceBundle,
  bundleConsumption
}) {
  if (accepted) {
    return [
      "review_summary_is_not_approval_grant",
      "approval_grant_not_implemented",
      "runtime_enablement_still_blocked"
    ];
  }

  return [
    ...sourceSelection.rejectionReasons,
    ...sourceBundle.rejectionReasons,
    ...bundleConsumption.rejectionReasons,
    "review_summary_not_produced",
    "approval_grant_not_implemented",
    "runtime_enablement_still_blocked"
  ];
}

export function evaluatePrerequisiteIntegrationCheckpointForReview(
  input = {}
) {
  const reviewedAt = approvalPrerequisiteSourceReviewedAt(input);
  const sourceInputs = approvalPrerequisiteIntegrationSourceInputs(input);
  const sourceIngestionResults =
    approvalPrerequisiteIntegrationSourceIngestionResults({
      reviewedAt,
      sourceInputs
    });
  const sourceSelection = selectApprovalPrerequisiteSourcesForReview({
    reviewedAt,
    sourceInputs
  });
  const sourceBundle = bundleApprovalPrerequisiteSourcesForReview({
    reviewedAt,
    bundleParts: approvalPrerequisiteIntegrationBundleParts(sourceInputs)
  });
  const bundleConsumption = consumeApprovalPrerequisiteBundleForReview({
    reviewedAt,
    sourceBundle
  });
  const classification = approvalPrerequisiteIntegrationClassification({
    sourceSelection,
    sourceBundle,
    bundleConsumption
  });
  const accepted = approvalPrerequisiteIntegrationAccepted(classification);
  const reviewOnlyEvaluatorSummary = accepted
    ? approvalPrerequisiteIntegrationReviewSummary(
        bundleConsumption.approvalPrerequisiteEvaluator
      )
    : null;

  return {
    schema: APPROVAL_PREREQUISITE_INTEGRATION_CHECKPOINT_SCHEMA,
    schemaVersion: APPROVAL_PREREQUISITE_INTEGRATION_CHECKPOINT_VERSION,
    checkpointKind: APPROVAL_PREREQUISITE_INTEGRATION_CHECKPOINT_KIND,
    checkpointMode: "review-only",
    reviewedAt,
    classification,
    reviewSummaryProduced: accepted,
    reviewSummaryIsApprovalGrant: false,
    reviewOnly: true,
    authoritative: false,
    sourceIngestion: {
      sourceCount: sourceInputs.length,
      sourcePreflightResults: sourceIngestionResults
    },
    sourceSelection: approvalPrerequisiteIntegrationSelectionSummary(
      sourceSelection
    ),
    sourceBundle: approvalPrerequisiteIntegrationBundleSummary(sourceBundle),
    bundleConsumption:
      approvalPrerequisiteIntegrationConsumptionSummary(bundleConsumption),
    reviewOnlyEvaluatorSummary,
    rejectionReasons: approvalPrerequisiteIntegrationRejectionReasons({
      accepted,
      sourceSelection,
      sourceBundle,
      bundleConsumption
    }),
    approvalGrant: sourcePreflightGrantBlocked(),
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

const PREREQUISITE_REVIEW_ARTIFACT_SCHEMA =
  "ardyn.phase-5.25.non-authorizing-prerequisite-review-artifact";

const PREREQUISITE_REVIEW_ARTIFACT_ACCEPTED_CLASSIFICATIONS = Object.freeze([
  "valid_prerequisite_review_artifact_non_authorizing_runtime_still_blocked"
]);

const PREREQUISITE_REVIEW_ARTIFACT_CLASSIFICATION_BY_INTEGRATION =
  Object.freeze({
    missing_prerequisite_integration_input_rejected:
      "missing_prerequisite_review_artifact_input_rejected",
    malformed_prerequisite_integration_input_rejected:
      "malformed_prerequisite_review_artifact_input_rejected",
    empty_prerequisite_integration_input_rejected:
      "empty_prerequisite_review_artifact_input_rejected",
    duplicate_prerequisite_integration_input_rejected:
      "duplicate_invalid_prerequisite_review_artifact_input_rejected",
    conflicting_prerequisite_integration_input_rejected:
      "conflicting_prerequisite_review_artifact_input_rejected",
    stale_prerequisite_integration_input_rejected:
      "stale_prerequisite_review_artifact_input_rejected",
    revoked_prerequisite_integration_input_rejected:
      "revoked_prerequisite_review_artifact_input_rejected",
    unknown_prerequisite_integration_input_rejected:
      "unknown_prerequisite_review_artifact_input_rejected",
    valid_prerequisite_integration_review_summary_runtime_still_blocked:
      "valid_prerequisite_review_artifact_non_authorizing_runtime_still_blocked"
  });

function prerequisiteReviewArtifactAccepted(classification) {
  return PREREQUISITE_REVIEW_ARTIFACT_ACCEPTED_CLASSIFICATIONS.includes(
    classification
  );
}

function prerequisiteReviewArtifactClassification(integratedReview) {
  return (
    PREREQUISITE_REVIEW_ARTIFACT_CLASSIFICATION_BY_INTEGRATION[
      integratedReview.classification
    ] ?? "malformed_prerequisite_review_artifact_input_rejected"
  );
}

function prerequisiteReviewArtifactFromIntegratedReview(integratedReview) {
  return {
    schema: PREREQUISITE_REVIEW_ARTIFACT_SCHEMA,
    schemaVersion: PREREQUISITE_REVIEW_ARTIFACT_BOUNDARY_VERSION,
    artifactKind: "non-authorizing-prerequisite-review-artifact",
    artifactMode: "review-only",
    reviewedAt: integratedReview.reviewedAt,
    sourceIntegrationCheckpoint: {
      schema: integratedReview.schema,
      checkpointKind: integratedReview.checkpointKind,
      classification: integratedReview.classification,
      reviewSummaryProduced: integratedReview.reviewSummaryProduced,
      reviewSummaryIsApprovalGrant: false
    },
    pipelineSummary: {
      sourceCount: integratedReview.sourceIngestion.sourceCount,
      selectedSourceId: integratedReview.sourceSelection.selectedSourceId,
      selectedBundlePartId: integratedReview.sourceBundle.selectedBundlePartId,
      readerRecordCount: integratedReview.bundleConsumption.readerRecordCount,
      evaluatorClassification:
        integratedReview.bundleConsumption.evaluatorClassification,
      prerequisiteSignalRecognized:
        integratedReview.bundleConsumption.prerequisiteSignalRecognized
    },
    integratedReviewSummary: integratedReview.reviewOnlyEvaluatorSummary,
    reviewArtifactIsApprovalGrant: false,
    approvalGrantProduced: false,
    approvalGrantPersisted: false,
    approvalGrantId: null,
    runtimePermissionGranted: false,
    commandExposurePermissionGranted: false,
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

function prerequisiteReviewArtifactBoundaryIntegratedSummary(integratedReview) {
  return {
    schema: integratedReview.schema,
    checkpointKind: integratedReview.checkpointKind,
    classification: integratedReview.classification,
    reviewSummaryProduced: integratedReview.reviewSummaryProduced,
    reviewSummaryIsApprovalGrant: integratedReview.reviewSummaryIsApprovalGrant,
    approvalGrantProduced: integratedReview.approvalGrant.produced,
    runtimeEffectAllFalse: reviewOnlyRuntimeEffectAllFalse(
      integratedReview.runtimeEffect
    )
  };
}

function prerequisiteReviewArtifactBoundaryRejectionReasons({
  accepted,
  integratedReview
}) {
  if (accepted) {
    return [
      "review_artifact_is_not_approval_grant",
      "approval_grant_not_implemented",
      "runtime_enablement_still_blocked"
    ];
  }

  return [
    ...integratedReview.rejectionReasons,
    "review_artifact_not_produced",
    "approval_grant_not_implemented",
    "runtime_enablement_still_blocked"
  ];
}

export function createPrerequisiteReviewArtifactBoundaryForReview(input = {}) {
  const integratedReview = evaluatePrerequisiteIntegrationCheckpointForReview(input);
  const classification =
    prerequisiteReviewArtifactClassification(integratedReview);
  const accepted = prerequisiteReviewArtifactAccepted(classification);
  const reviewArtifact = accepted
    ? prerequisiteReviewArtifactFromIntegratedReview(integratedReview)
    : null;

  return {
    schema: PREREQUISITE_REVIEW_ARTIFACT_BOUNDARY_SCHEMA,
    schemaVersion: PREREQUISITE_REVIEW_ARTIFACT_BOUNDARY_VERSION,
    boundaryKind: PREREQUISITE_REVIEW_ARTIFACT_BOUNDARY_KIND,
    boundaryMode: "review-only",
    reviewedAt: integratedReview.reviewedAt,
    classification,
    reviewArtifactProduced: accepted,
    reviewArtifactIsApprovalGrant: false,
    reviewArtifact,
    integratedReviewSummary:
      prerequisiteReviewArtifactBoundaryIntegratedSummary(integratedReview),
    reviewOnly: true,
    authoritative: false,
    approvalGrant: sourcePreflightGrantBlocked(),
    runtimePermissionGranted: false,
    commandExposurePermissionGranted: false,
    rejectionReasons: prerequisiteReviewArtifactBoundaryRejectionReasons({
      accepted,
      integratedReview
    }),
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

const PREREQUISITE_REVIEW_ARTIFACT_EVALUATOR_INPUT_CANDIDATE_SCHEMA =
  "ardyn.phase-5.26.review-artifact-evaluator-input-candidate";

const PREREQUISITE_REVIEW_ARTIFACT_EVALUATOR_INPUT_MIN_REVIEWED_AT =
  "2026-06-15T00:00:00.000Z";

const VALID_REVIEW_ARTIFACT_EVALUATOR_INPUT_HANDOFF_CLASSIFICATION =
  "valid_review_artifact_evaluator_input_candidate_runtime_still_blocked";

const PREREQUISITE_REVIEW_ARTIFACT_REQUIRED_FALSE_FIELDS = Object.freeze([
  "reviewArtifactIsApprovalGrant",
  "approvalGrantProduced",
  "approvalGrantPersisted",
  "runtimePermissionGranted",
  "commandExposurePermissionGranted"
]);

const PREREQUISITE_REVIEW_ARTIFACT_REQUIRED_FIELDS = Object.freeze([
  ...PREREQUISITE_REVIEW_ARTIFACT_REQUIRED_FALSE_FIELDS,
  "approvalGrantId"
]);

const PREREQUISITE_REVIEW_ARTIFACT_TRUE_RUNTIME_FIELDS = Object.freeze([
  "authoritative",
  "runtimeEnabled",
  "runtimeStarted",
  "runtimeExecuted"
]);

const PREREQUISITE_REVIEW_ARTIFACT_AUTHORITATIVE_TRUE_FIELD_PATTERN =
  /(runtime|process|command|approvalGrant|watcher|lookup|secrets|env|stdin|stdout|stderr|writer|reader|webSocket|http|adapter|contentFabric)/i;

const UTC_ISO_TIMESTAMP_WITH_MILLISECONDS_PATTERN =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

function isUtcIsoTimestampWithMilliseconds(value) {
  const timestamp = Date.parse(value);

  return (
    typeof value === "string" &&
    UTC_ISO_TIMESTAMP_WITH_MILLISECONDS_PATTERN.test(value) &&
    Number.isFinite(timestamp) &&
    new Date(timestamp).toISOString() === value
  );
}

function reviewArtifactHandoffTopLevelTrueRuntimeClaim(artifact) {
  return Object.entries(artifact).some(
    ([key, value]) =>
      value === true &&
      PREREQUISITE_REVIEW_ARTIFACT_AUTHORITATIVE_TRUE_FIELD_PATTERN.test(key)
  );
}

const PREREQUISITE_REVIEW_ARTIFACT_CORE_SHAPE_CHECKS = Object.freeze([
  ["schema", (value) => value === PREREQUISITE_REVIEW_ARTIFACT_SCHEMA],
  [
    "schemaVersion",
    (value) => value === PREREQUISITE_REVIEW_ARTIFACT_BOUNDARY_VERSION
  ],
  [
    "artifactKind",
    (value) => value === "non-authorizing-prerequisite-review-artifact"
  ],
  ["artifactMode", (value) => value === "review-only"],
  ["reviewedAt", isUtcIsoTimestampWithMilliseconds],
  ["sourceIntegrationCheckpoint", isPlainObjectRecord],
  ["pipelineSummary", isPlainObjectRecord],
  ["integratedReviewSummary", isPlainObjectRecord],
  ["runtimeEffect", isPlainObjectRecord]
]);

const PREREQUISITE_REVIEW_ARTIFACT_CHECKPOINT_CHECKS = Object.freeze([
  [
    "schema",
    (value) => value === APPROVAL_PREREQUISITE_INTEGRATION_CHECKPOINT_SCHEMA
  ],
  [
    "checkpointKind",
    (value) => value === APPROVAL_PREREQUISITE_INTEGRATION_CHECKPOINT_KIND
  ],
  [
    "classification",
    (value) =>
      value ===
      "valid_prerequisite_integration_review_summary_runtime_still_blocked"
  ],
  ["reviewSummaryProduced", (value) => value === true],
  ["reviewSummaryIsApprovalGrant", (value) => value === false]
]);

const PREREQUISITE_REVIEW_ARTIFACT_PIPELINE_CHECKS = Object.freeze([
  ["sourceCount", (value) => typeof value === "number"],
  ["selectedSourceId", (value) => typeof value === "string" || value === null],
  [
    "selectedBundlePartId",
    (value) => typeof value === "string" || value === null
  ],
  ["readerRecordCount", (value) => typeof value === "number"],
  ["evaluatorClassification", (value) => typeof value === "string"],
  ["prerequisiteSignalRecognized", (value) => value === true]
]);

const PREREQUISITE_REVIEW_ARTIFACT_SUMMARY_CHECKS = Object.freeze([
  ["schema", (value) => value === REVIEW_ONLY_RUNTIME_APPROVAL_EVALUATOR_SCHEMA],
  ["evaluatorKind", (value) => value === REVIEW_ONLY_RUNTIME_APPROVAL_EVALUATOR_KIND],
  ["evaluationMode", (value) => value === "review-only"],
  ["prerequisiteSignalRecognized", (value) => value === true],
  ["reviewOnly", (value) => value === true],
  ["authoritative", (value) => value === false],
  ["reviewSummaryIsApprovalGrant", (value) => value === false],
  ["approvalGrantProduced", (value) => value === false],
  ["approvalGrantPersisted", (value) => value === false],
  ["approvalGrantId", (value) => value === null],
  ["runtimeEffectAllFalse", (value) => value === true]
]);

function recordPassesChecks(record, checks) {
  return checks.every(([key, predicate]) => predicate(record[key]));
}

function recordHasFields(record, fields) {
  return fields.every((field) => Object.prototype.hasOwnProperty.call(record, field));
}

function reviewArtifactHandoffDigest(value) {
  return `sha256:${createHash("sha256")
    .update(stableJsonStringify(value))
    .digest("hex")}`;
}

function reviewArtifactHandoffUnknown(artifact) {
  return (
    (typeof artifact.schema === "string" &&
      artifact.schema !== PREREQUISITE_REVIEW_ARTIFACT_SCHEMA) ||
    (typeof artifact.artifactKind === "string" &&
      artifact.artifactKind !== "non-authorizing-prerequisite-review-artifact")
  );
}

function reviewArtifactHandoffRevoked(artifact) {
  return (
    artifact.revoked === true ||
    (isPlainObjectRecord(artifact.revocation) &&
      artifact.revocation.revoked === true)
  );
}

function reviewArtifactHandoffStale(artifact) {
  return (
    isUtcIsoTimestampWithMilliseconds(artifact.reviewedAt) &&
    artifact.reviewedAt < PREREQUISITE_REVIEW_ARTIFACT_EVALUATOR_INPUT_MIN_REVIEWED_AT
  );
}

const PREREQUISITE_REVIEW_ARTIFACT_AUTHORIZING_CHECKS = Object.freeze([
  (artifact) =>
    PREREQUISITE_REVIEW_ARTIFACT_REQUIRED_FALSE_FIELDS.some(
      (field) => artifact[field] !== false
    ),
  (artifact) => artifact.approvalGrantId !== null,
  (artifact) => artifact.approvalGrant?.produced === true,
  (artifact) => artifact.approvalGrant?.persisted === true,
  (artifact) => !reviewOnlyRuntimeEffectAllFalse(artifact.runtimeEffect),
  reviewArtifactHandoffTopLevelTrueRuntimeClaim,
  (artifact) =>
    PREREQUISITE_REVIEW_ARTIFACT_TRUE_RUNTIME_FIELDS.some(
      (field) => artifact[field] === true
    )
]);

function reviewArtifactHandoffAuthorizing(artifact) {
  return PREREQUISITE_REVIEW_ARTIFACT_AUTHORIZING_CHECKS.some((predicate) =>
    predicate(artifact)
  );
}

const PREREQUISITE_REVIEW_ARTIFACT_MALFORMED_CHECKS = Object.freeze([
  (artifact) =>
    !recordPassesChecks(
      artifact,
      PREREQUISITE_REVIEW_ARTIFACT_CORE_SHAPE_CHECKS
    ),
  (artifact) =>
    !recordHasFields(artifact, PREREQUISITE_REVIEW_ARTIFACT_REQUIRED_FIELDS),
  (artifact) =>
    !recordPassesChecks(
      artifact.sourceIntegrationCheckpoint,
      PREREQUISITE_REVIEW_ARTIFACT_CHECKPOINT_CHECKS
    ),
  (artifact) =>
    !recordPassesChecks(
      artifact.pipelineSummary,
      PREREQUISITE_REVIEW_ARTIFACT_PIPELINE_CHECKS
    ),
  (artifact) =>
    !recordPassesChecks(
      artifact.integratedReviewSummary,
      PREREQUISITE_REVIEW_ARTIFACT_SUMMARY_CHECKS
    )
]);

function reviewArtifactHandoffMalformed(artifact) {
  return PREREQUISITE_REVIEW_ARTIFACT_MALFORMED_CHECKS.some((predicate) =>
    predicate(artifact)
  );
}

const REVIEW_ARTIFACT_EVALUATOR_INPUT_SINGLE_REJECTION_CHECKS = Object.freeze([
  [
    (artifact) => !isPlainObjectRecord(artifact),
    "malformed_review_artifact_evaluator_input_handoff_rejected"
  ],
  [
    reviewArtifactHandoffUnknown,
    "unknown_review_artifact_evaluator_input_handoff_rejected"
  ],
  [
    reviewArtifactHandoffRevoked,
    "revoked_review_artifact_evaluator_input_handoff_rejected"
  ],
  [
    reviewArtifactHandoffStale,
    "stale_review_artifact_evaluator_input_handoff_rejected"
  ],
  [
    reviewArtifactHandoffMalformed,
    "malformed_review_artifact_evaluator_input_handoff_rejected"
  ],
  [
    reviewArtifactHandoffAuthorizing,
    "authorizing_review_artifact_evaluator_input_handoff_rejected"
  ]
]);

function reviewArtifactEvaluatorInputHandoffSingleClassification(artifact) {
  return (
    REVIEW_ARTIFACT_EVALUATOR_INPUT_SINGLE_REJECTION_CHECKS.find(
      ([predicate]) => predicate(artifact)
    )?.[1] ?? VALID_REVIEW_ARTIFACT_EVALUATOR_INPUT_HANDOFF_CLASSIFICATION
  );
}

function firstReviewArtifactHandoffRejection(reviewArtifacts) {
  return (
    reviewArtifacts
      .map(reviewArtifactEvaluatorInputHandoffSingleClassification)
      .find(
        (classification) =>
          classification !==
          VALID_REVIEW_ARTIFACT_EVALUATOR_INPUT_HANDOFF_CLASSIFICATION
      ) ?? null
  );
}

function reviewArtifactsContainDuplicate(reviewArtifacts) {
  const digests = reviewArtifacts.map((artifact) =>
    reviewArtifactHandoffDigest(artifact)
  );

  return new Set(digests).size !== digests.length;
}

const REVIEW_ARTIFACT_EVALUATOR_INPUT_HANDOFF_RESOLVERS = Object.freeze([
  (reviewArtifacts) =>
    reviewArtifacts === undefined
      ? "missing_review_artifact_evaluator_input_handoff_rejected"
      : null,
  (reviewArtifacts) =>
    !Array.isArray(reviewArtifacts)
      ? "malformed_review_artifact_evaluator_input_handoff_rejected"
      : null,
  (reviewArtifacts) =>
    reviewArtifacts.length === 0
      ? "empty_review_artifact_evaluator_input_handoff_rejected"
      : null,
  firstReviewArtifactHandoffRejection,
  (reviewArtifacts) =>
    reviewArtifactsContainDuplicate(reviewArtifacts)
      ? "duplicate_invalid_review_artifact_evaluator_input_handoff_rejected"
      : null,
  (reviewArtifacts) =>
    reviewArtifacts.length > 1
      ? "conflicting_review_artifact_evaluator_input_handoff_rejected"
      : null
]);

function reviewArtifactEvaluatorInputHandoffClassification(reviewArtifacts) {
  let classification = null;

  REVIEW_ARTIFACT_EVALUATOR_INPUT_HANDOFF_RESOLVERS.some((resolver) => {
    classification = resolver(reviewArtifacts);
    return classification !== null;
  });

  return classification ?? VALID_REVIEW_ARTIFACT_EVALUATOR_INPUT_HANDOFF_CLASSIFICATION;
}

function reviewArtifactEvaluatorInputCandidateFromArtifact(reviewArtifact, reviewedAt) {
  return {
    schema: PREREQUISITE_REVIEW_ARTIFACT_EVALUATOR_INPUT_CANDIDATE_SCHEMA,
    schemaVersion:
      PREREQUISITE_REVIEW_ARTIFACT_EVALUATOR_INPUT_HANDOFF_VERSION,
    candidateKind: "review-artifact-evaluator-input-candidate",
    candidateMode: "review-only",
    reviewedAt,
    sourceReviewArtifact: {
      schema: reviewArtifact.schema,
      artifactKind: reviewArtifact.artifactKind,
      artifactMode: reviewArtifact.artifactMode,
      reviewedAt: reviewArtifact.reviewedAt,
      artifactDigest: reviewArtifactHandoffDigest(reviewArtifact),
      sourceIntegrationCheckpoint: reviewArtifact.sourceIntegrationCheckpoint,
      reviewArtifactIsApprovalGrant: false,
      approvalGrantProduced: false,
      runtimeEffectAllFalse: true
    },
    pipelineSummary: reviewArtifact.pipelineSummary,
    integratedReviewSummary: reviewArtifact.integratedReviewSummary,
    evaluatorInputCandidateIsApprovalGrant: false,
    candidateIsApprovalGrant: false,
    approvalGrantProduced: false,
    approvalGrantPersisted: false,
    approvalGrantId: null,
    runtimePermissionGranted: false,
    commandExposurePermissionGranted: false,
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

function reviewArtifactEvaluatorInputHandoffRejectionReasons({ accepted, classification }) {
  if (accepted) {
    return [
      "evaluator_input_candidate_is_not_approval_grant",
      "approval_grant_not_implemented",
      "runtime_enablement_still_blocked"
    ];
  }

  return [
    classification,
    "evaluator_input_candidate_not_produced",
    "approval_grant_not_implemented",
    "runtime_enablement_still_blocked"
  ];
}

export function createReviewArtifactEvaluatorInputHandoffForReview(input = {}) {
  const reviewedAt = approvalPrerequisiteSourceReviewedAt(input);
  const reviewArtifacts = input.reviewArtifacts;
  const classification =
    reviewArtifactEvaluatorInputHandoffClassification(reviewArtifacts);
  const accepted =
    classification === VALID_REVIEW_ARTIFACT_EVALUATOR_INPUT_HANDOFF_CLASSIFICATION;
  const reviewArtifact = accepted ? reviewArtifacts[0] : null;
  const evaluatorInputCandidate = accepted
    ? reviewArtifactEvaluatorInputCandidateFromArtifact(reviewArtifact, reviewedAt)
    : null;

  return {
    schema: PREREQUISITE_REVIEW_ARTIFACT_EVALUATOR_INPUT_HANDOFF_SCHEMA,
    schemaVersion:
      PREREQUISITE_REVIEW_ARTIFACT_EVALUATOR_INPUT_HANDOFF_VERSION,
    handoffKind: PREREQUISITE_REVIEW_ARTIFACT_EVALUATOR_INPUT_HANDOFF_KIND,
    handoffMode: "review-only",
    reviewedAt,
    classification,
    reviewArtifactAccepted: accepted,
    evaluatorInputCandidateProduced: accepted,
    evaluatorInputCandidateIsApprovalGrant: false,
    evaluatorInputCandidate,
    reviewArtifactSummary: accepted
      ? {
          schema: reviewArtifact.schema,
          artifactKind: reviewArtifact.artifactKind,
          artifactMode: reviewArtifact.artifactMode,
          reviewedAt: reviewArtifact.reviewedAt,
          artifactDigest: reviewArtifactHandoffDigest(reviewArtifact),
          reviewArtifactIsApprovalGrant: false,
          approvalGrantProduced: false,
          runtimeEffectAllFalse: true
        }
      : null,
    reviewOnly: true,
    authoritative: false,
    approvalGrant: sourcePreflightGrantBlocked(),
    runtimePermissionGranted: false,
    commandExposurePermissionGranted: false,
    rejectionReasons: reviewArtifactEvaluatorInputHandoffRejectionReasons({
      accepted,
      classification
    }),
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

const APPROVAL_EVALUATOR_CANDIDATE_INTAKE_STATE_SCHEMA =
  "ardyn.phase-5.27.approval-evaluator-candidate-intake-state";

const APPROVAL_EVALUATOR_CANDIDATE_MIN_REVIEWED_AT =
  "2026-06-15T00:00:00.000Z";

const VALID_APPROVAL_EVALUATOR_CANDIDATE_INTAKE_CLASSIFICATION =
  "valid_approval_evaluator_candidate_intake_checkpoint_runtime_still_blocked";

const APPROVAL_EVALUATOR_CANDIDATE_REQUIRED_FALSE_FIELDS = Object.freeze([
  "evaluatorInputCandidateIsApprovalGrant",
  "candidateIsApprovalGrant",
  "approvalGrantProduced",
  "approvalGrantPersisted",
  "runtimePermissionGranted",
  "commandExposurePermissionGranted"
]);

const APPROVAL_EVALUATOR_CANDIDATE_REQUIRED_FIELDS = Object.freeze([
  ...APPROVAL_EVALUATOR_CANDIDATE_REQUIRED_FALSE_FIELDS,
  "approvalGrantId"
]);

const APPROVAL_EVALUATOR_CANDIDATE_TRUE_RUNTIME_FIELDS = Object.freeze([
  "authoritative",
  "runtimeEnabled",
  "runtimeStarted",
  "runtimeExecuted",
  "runtimeCommandExposureEnabled",
  "runtimeExecutionEnabled"
]);

const APPROVAL_EVALUATOR_CANDIDATE_PROCESS_TRUE_FIELDS = Object.freeze([
  "processSpawnEnabled",
  "processTerminationEnabled",
  "processControlEnabled",
  "runtimeSupervisionEnabled"
]);

const APPROVAL_EVALUATOR_CANDIDATE_UNSAFE_TRUE_FIELD_PATTERN =
  /(watcher|lookup|secrets|env|stdin|stdout|stderr|writer|reader|webSocket|http|adapter|contentFabric|filePath|url)/i;

const REVIEW_ARTIFACT_EVALUATOR_INPUT_CANDIDATE_CORE_CHECKS = Object.freeze([
  [
    "schema",
    (value) =>
      value === PREREQUISITE_REVIEW_ARTIFACT_EVALUATOR_INPUT_CANDIDATE_SCHEMA
  ],
  [
    "schemaVersion",
    (value) =>
      value === PREREQUISITE_REVIEW_ARTIFACT_EVALUATOR_INPUT_HANDOFF_VERSION
  ],
  [
    "candidateKind",
    (value) => value === "review-artifact-evaluator-input-candidate"
  ],
  ["candidateMode", (value) => value === "review-only"],
  ["reviewedAt", isUtcIsoTimestampWithMilliseconds],
  ["sourceReviewArtifact", isPlainObjectRecord],
  ["pipelineSummary", isPlainObjectRecord],
  ["integratedReviewSummary", isPlainObjectRecord],
  ["runtimeEffect", isPlainObjectRecord]
]);

const REVIEW_ARTIFACT_EVALUATOR_INPUT_CANDIDATE_SOURCE_CHECKS =
  Object.freeze([
    ["schema", (value) => value === PREREQUISITE_REVIEW_ARTIFACT_SCHEMA],
    [
      "artifactKind",
      (value) => value === "non-authorizing-prerequisite-review-artifact"
    ],
    ["artifactMode", (value) => value === "review-only"],
    ["reviewedAt", isUtcIsoTimestampWithMilliseconds],
    [
      "artifactDigest",
      (value) =>
        typeof value === "string" && /^sha256:[0-9a-f]{64}$/.test(value)
    ],
    ["sourceIntegrationCheckpoint", isPlainObjectRecord],
    ["reviewArtifactIsApprovalGrant", (value) => value === false],
    ["approvalGrantProduced", (value) => value === false],
    ["runtimeEffectAllFalse", (value) => value === true]
  ]);

function approvalEvaluatorCandidateTopLevelTrueClaim(candidate, fields) {
  return fields.some((field) => candidate[field] === true);
}

function approvalEvaluatorCandidateNestedTrueClaim(value, keyPredicate, seen = new Set()) {
  if (Array.isArray(value)) {
    return value.some((entry) =>
      approvalEvaluatorCandidateNestedTrueClaim(entry, keyPredicate, seen)
    );
  }

  if (!isPlainObjectRecord(value) || seen.has(value)) {
    return false;
  }

  seen.add(value);

  return Object.entries(value).some(
    ([key, value]) =>
      (value === true && keyPredicate(key)) ||
      approvalEvaluatorCandidateNestedTrueClaim(value, keyPredicate, seen)
  );
}

function approvalEvaluatorCandidateUnknown(candidate) {
  return (
    (typeof candidate.schema === "string" &&
      candidate.schema !==
        PREREQUISITE_REVIEW_ARTIFACT_EVALUATOR_INPUT_CANDIDATE_SCHEMA) ||
    (typeof candidate.candidateKind === "string" &&
      candidate.candidateKind !== "review-artifact-evaluator-input-candidate")
  );
}

function approvalEvaluatorCandidateRevoked(candidate) {
  return (
    candidate.revoked === true ||
    (isPlainObjectRecord(candidate.revocation) &&
      candidate.revocation.revoked === true)
  );
}

function approvalEvaluatorCandidateStale(candidate) {
  return (
    isUtcIsoTimestampWithMilliseconds(candidate.reviewedAt) &&
    candidate.reviewedAt < APPROVAL_EVALUATOR_CANDIDATE_MIN_REVIEWED_AT
  );
}

const REVIEW_ARTIFACT_EVALUATOR_INPUT_CANDIDATE_MALFORMED_CHECKS =
  Object.freeze([
    (candidate) =>
      !recordPassesChecks(
        candidate,
        REVIEW_ARTIFACT_EVALUATOR_INPUT_CANDIDATE_CORE_CHECKS
      ),
    (candidate) =>
      !recordHasFields(
        candidate,
        APPROVAL_EVALUATOR_CANDIDATE_REQUIRED_FIELDS
      ),
    (candidate) =>
      !recordPassesChecks(
        candidate.sourceReviewArtifact,
        REVIEW_ARTIFACT_EVALUATOR_INPUT_CANDIDATE_SOURCE_CHECKS
      ),
    (candidate) =>
      !recordPassesChecks(
        candidate.sourceReviewArtifact.sourceIntegrationCheckpoint,
        PREREQUISITE_REVIEW_ARTIFACT_CHECKPOINT_CHECKS
      ),
    (candidate) =>
      !recordPassesChecks(
        candidate.pipelineSummary,
        PREREQUISITE_REVIEW_ARTIFACT_PIPELINE_CHECKS
      ),
    (candidate) =>
      !recordPassesChecks(
        candidate.integratedReviewSummary,
        PREREQUISITE_REVIEW_ARTIFACT_SUMMARY_CHECKS
      )
  ]);

function approvalEvaluatorCandidateMalformed(candidate) {
  return REVIEW_ARTIFACT_EVALUATOR_INPUT_CANDIDATE_MALFORMED_CHECKS.some(
    (predicate) => predicate(candidate)
  );
}

function approvalEvaluatorCandidateRuntimeEffectTrue(value, seen = new Set()) {
  if (Array.isArray(value)) {
    return value.some((entry) =>
      approvalEvaluatorCandidateRuntimeEffectTrue(entry, seen)
    );
  }

  if (!isPlainObjectRecord(value) || seen.has(value)) {
    return false;
  }

  seen.add(value);

  return Object.entries(value).some(
    ([key, entry]) =>
      (key === "runtimeEffect" &&
        isPlainObjectRecord(entry) &&
        !reviewOnlyRuntimeEffectAllFalse(entry)) ||
      approvalEvaluatorCandidateRuntimeEffectTrue(entry, seen)
  );
}

function approvalEvaluatorCandidateProcessFlagTrue(candidate) {
  return approvalEvaluatorCandidateNestedTrueClaim(
    candidate,
    (key) => APPROVAL_EVALUATOR_CANDIDATE_PROCESS_TRUE_FIELDS.includes(key)
  );
}

function approvalEvaluatorCandidateUnsafeTrueSurface(candidate) {
  return approvalEvaluatorCandidateNestedTrueClaim(
    candidate,
    (key) => APPROVAL_EVALUATOR_CANDIDATE_UNSAFE_TRUE_FIELD_PATTERN.test(key)
  );
}

const APPROVAL_EVALUATOR_CANDIDATE_AUTHORIZING_CHECKS = Object.freeze([
  (candidate) =>
    APPROVAL_EVALUATOR_CANDIDATE_REQUIRED_FALSE_FIELDS.some(
      (field) => candidate[field] !== false
    ),
  (candidate) => candidate.approvalGrantId !== null,
  (candidate) => candidate.approvalGrant?.produced === true,
  (candidate) => candidate.approvalGrant?.persisted === true,
  (candidate) =>
    candidate.sourceReviewArtifact?.reviewArtifactIsApprovalGrant !== false,
  (candidate) =>
    candidate.sourceReviewArtifact?.approvalGrantProduced !== false,
  (candidate) =>
    candidate.integratedReviewSummary?.reviewSummaryIsApprovalGrant !== false,
  (candidate) => candidate.integratedReviewSummary?.approvalGrantProduced !== false,
  (candidate) => candidate.integratedReviewSummary?.approvalGrantPersisted !== false,
  (candidate) => candidate.integratedReviewSummary?.approvalGrantId !== null,
  (candidate) =>
    approvalEvaluatorCandidateTopLevelTrueClaim(
      candidate,
      APPROVAL_EVALUATOR_CANDIDATE_TRUE_RUNTIME_FIELDS
    )
]);

function approvalEvaluatorCandidateAuthorizing(candidate) {
  return APPROVAL_EVALUATOR_CANDIDATE_AUTHORIZING_CHECKS.some((predicate) =>
    predicate(candidate)
  );
}

const APPROVAL_EVALUATOR_CANDIDATE_SINGLE_REJECTION_CHECKS = Object.freeze([
  [
    (candidate) => !isPlainObjectRecord(candidate),
    "malformed_approval_evaluator_candidate_intake_input_rejected"
  ],
  [
    approvalEvaluatorCandidateUnknown,
    "unknown_approval_evaluator_candidate_intake_input_rejected"
  ],
  [
    approvalEvaluatorCandidateRevoked,
    "revoked_approval_evaluator_candidate_intake_input_rejected"
  ],
  [
    approvalEvaluatorCandidateStale,
    "stale_approval_evaluator_candidate_intake_input_rejected"
  ],
  [
    approvalEvaluatorCandidateMalformed,
    "malformed_approval_evaluator_candidate_intake_input_rejected"
  ],
  [
    approvalEvaluatorCandidateRuntimeEffectTrue,
    "runtime_effect_true_approval_evaluator_candidate_intake_input_rejected"
  ],
  [
    approvalEvaluatorCandidateProcessFlagTrue,
    "process_flag_true_approval_evaluator_candidate_intake_input_rejected"
  ],
  [
    approvalEvaluatorCandidateUnsafeTrueSurface,
    "unsafe_approval_evaluator_candidate_intake_input_rejected"
  ],
  [
    approvalEvaluatorCandidateAuthorizing,
    "authorizing_approval_evaluator_candidate_intake_input_rejected"
  ]
]);

function approvalEvaluatorCandidateSingleClassification(candidate) {
  return (
    APPROVAL_EVALUATOR_CANDIDATE_SINGLE_REJECTION_CHECKS.find(
      ([predicate]) => predicate(candidate)
    )?.[1] ?? VALID_APPROVAL_EVALUATOR_CANDIDATE_INTAKE_CLASSIFICATION
  );
}

function firstApprovalEvaluatorCandidateRejection(candidates) {
  return (
    candidates
      .map(approvalEvaluatorCandidateSingleClassification)
      .find(
        (classification) =>
          classification !==
          VALID_APPROVAL_EVALUATOR_CANDIDATE_INTAKE_CLASSIFICATION
      ) ?? null
  );
}

function approvalEvaluatorCandidatesContainDuplicate(candidates) {
  const digests = candidates.map((candidate) =>
    reviewArtifactHandoffDigest(candidate)
  );

  return new Set(digests).size !== digests.length;
}

const APPROVAL_EVALUATOR_CANDIDATE_INTAKE_RESOLVERS = Object.freeze([
  (candidates) =>
    candidates === undefined
      ? "missing_approval_evaluator_candidate_intake_input_rejected"
      : null,
  (candidates) =>
    !Array.isArray(candidates)
      ? "malformed_approval_evaluator_candidate_intake_input_rejected"
      : null,
  (candidates) =>
    candidates.length === 0
      ? "empty_approval_evaluator_candidate_intake_input_rejected"
      : null,
  firstApprovalEvaluatorCandidateRejection,
  (candidates) =>
    approvalEvaluatorCandidatesContainDuplicate(candidates)
      ? "duplicate_invalid_approval_evaluator_candidate_intake_input_rejected"
      : null,
  (candidates) =>
    candidates.length > 1
      ? "conflicting_approval_evaluator_candidate_intake_input_rejected"
      : null
]);

function approvalEvaluatorCandidateIntakeClassification(candidates) {
  let classification = null;

  APPROVAL_EVALUATOR_CANDIDATE_INTAKE_RESOLVERS.some((resolver) => {
    classification = resolver(candidates);
    return classification !== null;
  });

  return (
    classification ?? VALID_APPROVAL_EVALUATOR_CANDIDATE_INTAKE_CLASSIFICATION
  );
}

function approvalEvaluatorCandidateIntakeStateFromCandidate(
  candidate,
  reviewedAt
) {
  return {
    schema: APPROVAL_EVALUATOR_CANDIDATE_INTAKE_STATE_SCHEMA,
    schemaVersion: APPROVAL_EVALUATOR_CANDIDATE_INTAKE_CHECKPOINT_VERSION,
    stateKind: "approval-evaluator-candidate-intake-state",
    stateMode: "review-only",
    reviewedAt,
    sourceEvaluatorInputCandidate: {
      schema: candidate.schema,
      candidateKind: candidate.candidateKind,
      candidateMode: candidate.candidateMode,
      reviewedAt: candidate.reviewedAt,
      candidateDigest: reviewArtifactHandoffDigest(candidate),
      sourceReviewArtifact: candidate.sourceReviewArtifact,
      evaluatorInputCandidateIsApprovalGrant: false,
      approvalGrantProduced: false,
      runtimeEffectAllFalse: true
    },
    pipelineSummary: candidate.pipelineSummary,
    integratedReviewSummary: candidate.integratedReviewSummary,
    approvalEvaluatorInputCandidateAccepted: true,
    intakeCheckpointStateIsApprovalGrant: false,
    approvalGrantProduced: false,
    approvalGrantPersisted: false,
    approvalGrantId: null,
    runtimePermissionGranted: false,
    commandExposurePermissionGranted: false,
    runtimeCommandExposureEnabled: false,
    runtimeExecutionEnabled: false,
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

function approvalEvaluatorCandidateIntakeRejectionReasons({
  accepted,
  classification
}) {
  if (accepted) {
    return [
      "intake_checkpoint_state_is_not_approval_grant",
      "approval_grant_not_implemented",
      "runtime_enablement_still_blocked"
    ];
  }

  return [
    classification,
    "intake_checkpoint_state_not_produced",
    "approval_grant_not_implemented",
    "runtime_enablement_still_blocked"
  ];
}

export function createApprovalEvaluatorCandidateIntakeCheckpointForReview(
  input = {}
) {
  const reviewedAt = approvalPrerequisiteSourceReviewedAt(input);
  const evaluatorInputCandidates = input.evaluatorInputCandidates;
  const classification = approvalEvaluatorCandidateIntakeClassification(
    evaluatorInputCandidates
  );
  const accepted =
    classification ===
    VALID_APPROVAL_EVALUATOR_CANDIDATE_INTAKE_CLASSIFICATION;
  const evaluatorInputCandidate = accepted ? evaluatorInputCandidates[0] : null;
  const intakeCheckpointState = accepted
    ? approvalEvaluatorCandidateIntakeStateFromCandidate(
        evaluatorInputCandidate,
        reviewedAt
      )
    : null;

  return {
    schema: APPROVAL_EVALUATOR_CANDIDATE_INTAKE_CHECKPOINT_SCHEMA,
    schemaVersion: APPROVAL_EVALUATOR_CANDIDATE_INTAKE_CHECKPOINT_VERSION,
    checkpointKind: APPROVAL_EVALUATOR_CANDIDATE_INTAKE_CHECKPOINT_KIND,
    checkpointMode: "review-only",
    reviewedAt,
    classification,
    evaluatorInputCandidateAccepted: accepted,
    intakeCheckpointStateProduced: accepted,
    intakeCheckpointStateIsApprovalGrant: false,
    intakeCheckpointState,
    candidateSummary: accepted
      ? {
          schema: evaluatorInputCandidate.schema,
          candidateKind: evaluatorInputCandidate.candidateKind,
          candidateMode: evaluatorInputCandidate.candidateMode,
          reviewedAt: evaluatorInputCandidate.reviewedAt,
          candidateDigest: reviewArtifactHandoffDigest(evaluatorInputCandidate),
          evaluatorInputCandidateIsApprovalGrant: false,
          approvalGrantProduced: false,
          runtimeEffectAllFalse: true
        }
      : null,
    reviewOnly: true,
    authoritative: false,
    approvalGrant: sourcePreflightGrantBlocked(),
    approvalGrantProduced: false,
    approvalGrantPersisted: false,
    approvalGrantId: null,
    runtimePermissionGranted: false,
    commandExposurePermissionGranted: false,
    runtimeCommandExposureEnabled: false,
    runtimeExecutionEnabled: false,
    rejectionReasons: approvalEvaluatorCandidateIntakeRejectionReasons({
      accepted,
      classification
    }),
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

const REVIEW_ONLY_EVALUATOR_PREFLIGHT_STATE_SCHEMA =
  "ardyn.phase-5.28.review-only-evaluator-preflight-state";

const REVIEW_ONLY_EVALUATOR_PREFLIGHT_MIN_REVIEWED_AT =
  "2026-06-16T00:00:00.000Z";

const VALID_REVIEW_ONLY_EVALUATOR_PREFLIGHT_CLASSIFICATION =
  "valid_review_only_evaluator_preflight_checkpoint_runtime_still_blocked";

const REVIEW_ONLY_EVALUATOR_PREFLIGHT_REQUIRED_FALSE_FIELDS = Object.freeze([
  "intakeCheckpointStateIsApprovalGrant",
  "approvalGrantProduced",
  "approvalGrantPersisted",
  "runtimePermissionGranted",
  "commandExposurePermissionGranted",
  "runtimeCommandExposureEnabled",
  "runtimeExecutionEnabled"
]);

const REVIEW_ONLY_EVALUATOR_PREFLIGHT_REQUIRED_FIELDS = Object.freeze([
  ...REVIEW_ONLY_EVALUATOR_PREFLIGHT_REQUIRED_FALSE_FIELDS,
  "approvalGrantId"
]);

const REVIEW_ONLY_EVALUATOR_PREFLIGHT_AUTHORITATIVE_TRUE_FIELDS =
  Object.freeze([
    "authoritative",
    "approvalEvaluatorAuthoritative",
    "evaluatorAuthoritative"
  ]);

const REVIEW_ONLY_EVALUATOR_PREFLIGHT_RUNTIME_PERMISSION_TRUE_FIELDS =
  Object.freeze([
    "runtimePermissionGranted",
    "runtimeApprovalPermissionGranted",
    "canEnableRuntime",
    "runtimeAllowed"
  ]);

const REVIEW_ONLY_EVALUATOR_PREFLIGHT_COMMAND_EXPOSURE_TRUE_FIELDS =
  Object.freeze([
    "commandExposurePermissionGranted",
    "runtimeCommandExposureEnabled",
    "runtimeCommandEnabled",
    "commandAliasCreated",
    "additionalRuntimeCommandsRecognized"
  ]);

const REVIEW_ONLY_EVALUATOR_PREFLIGHT_EXECUTION_SIGNAL_TRUE_FIELDS =
  Object.freeze([
    "evaluatorExecutionRequested",
    "evaluatorExecutionStarted",
    "evaluatorExecutionEnabled",
    "evaluatorExecuted",
    "executionRequested",
    "executionStarted",
    "executionEnabled",
    "executionPermitted",
    "executionSignal",
    "runtimeExecutionRequested",
    "runtimeExecutionEnabled",
    "runtimeExecuted"
  ]);

const REVIEW_ONLY_EVALUATOR_PREFLIGHT_SOURCE_CANDIDATE_CHECKS = Object.freeze([
  [
    "schema",
    (value) =>
      value === PREREQUISITE_REVIEW_ARTIFACT_EVALUATOR_INPUT_CANDIDATE_SCHEMA
  ],
  [
    "candidateKind",
    (value) => value === "review-artifact-evaluator-input-candidate"
  ],
  ["candidateMode", (value) => value === "review-only"],
  ["reviewedAt", isUtcIsoTimestampWithMilliseconds],
  [
    "candidateDigest",
    (value) =>
      typeof value === "string" && /^sha256:[0-9a-f]{64}$/.test(value)
  ],
  ["sourceReviewArtifact", isPlainObjectRecord],
  ["evaluatorInputCandidateIsApprovalGrant", (value) => value === false],
  ["approvalGrantProduced", (value) => value === false],
  ["runtimeEffectAllFalse", (value) => value === true]
]);

const REVIEW_ONLY_EVALUATOR_PREFLIGHT_STATE_FIELDS = Object.freeze([
  "schema",
  "schemaVersion",
  "stateKind",
  "stateMode",
  "reviewedAt",
  "sourceEvaluatorInputCandidate",
  "pipelineSummary",
  "integratedReviewSummary",
  "approvalEvaluatorInputCandidateAccepted",
  "intakeCheckpointStateIsApprovalGrant",
  "approvalGrantProduced",
  "approvalGrantPersisted",
  "approvalGrantId",
  "runtimePermissionGranted",
  "commandExposurePermissionGranted",
  "runtimeCommandExposureEnabled",
  "runtimeExecutionEnabled",
  "runtimeEffect"
]);

const REVIEW_ONLY_EVALUATOR_PREFLIGHT_SOURCE_CANDIDATE_FIELDS = Object.freeze([
  "schema",
  "candidateKind",
  "candidateMode",
  "reviewedAt",
  "candidateDigest",
  "sourceReviewArtifact",
  "evaluatorInputCandidateIsApprovalGrant",
  "approvalGrantProduced",
  "runtimeEffectAllFalse"
]);

const REVIEW_ONLY_EVALUATOR_PREFLIGHT_SOURCE_ARTIFACT_FIELDS = Object.freeze([
  "schema",
  "artifactKind",
  "artifactMode",
  "reviewedAt",
  "artifactDigest",
  "sourceIntegrationCheckpoint",
  "reviewArtifactIsApprovalGrant",
  "approvalGrantProduced",
  "runtimeEffectAllFalse"
]);

const REVIEW_ONLY_EVALUATOR_PREFLIGHT_SOURCE_CHECKPOINT_FIELDS = Object.freeze([
  "schema",
  "checkpointKind",
  "classification",
  "reviewSummaryProduced",
  "reviewSummaryIsApprovalGrant"
]);

const REVIEW_ONLY_EVALUATOR_PREFLIGHT_PIPELINE_SUMMARY_FIELDS = Object.freeze([
  "sourceCount",
  "selectedSourceId",
  "selectedBundlePartId",
  "readerRecordCount",
  "evaluatorClassification",
  "prerequisiteSignalRecognized"
]);

const REVIEW_ONLY_EVALUATOR_PREFLIGHT_INTEGRATED_SUMMARY_FIELDS = Object.freeze([
  "schema",
  "evaluatorKind",
  "evaluationMode",
  "classification",
  "prerequisiteSignalRecognized",
  "reviewOnly",
  "authoritative",
  "reviewSummaryIsApprovalGrant",
  "approvalGrantProduced",
  "approvalGrantPersisted",
  "approvalGrantId",
  "runtimeEffectAllFalse"
]);

const REVIEW_ONLY_EVALUATOR_PREFLIGHT_ALLOWED_FIELDS = new Set([
  ...REVIEW_ONLY_EVALUATOR_PREFLIGHT_STATE_FIELDS,
  ...REVIEW_ONLY_EVALUATOR_PREFLIGHT_SOURCE_CANDIDATE_FIELDS,
  ...REVIEW_ONLY_EVALUATOR_PREFLIGHT_SOURCE_ARTIFACT_FIELDS,
  ...REVIEW_ONLY_EVALUATOR_PREFLIGHT_SOURCE_CHECKPOINT_FIELDS,
  ...REVIEW_ONLY_EVALUATOR_PREFLIGHT_PIPELINE_SUMMARY_FIELDS,
  ...REVIEW_ONLY_EVALUATOR_PREFLIGHT_INTEGRATED_SUMMARY_FIELDS
]);

const REVIEW_ONLY_EVALUATOR_PREFLIGHT_STATE_CHECKS = Object.freeze([
  ["schema", (value) => value === APPROVAL_EVALUATOR_CANDIDATE_INTAKE_STATE_SCHEMA],
  [
    "schemaVersion",
    (value) => value === APPROVAL_EVALUATOR_CANDIDATE_INTAKE_CHECKPOINT_VERSION
  ],
  ["stateKind", (value) => value === "approval-evaluator-candidate-intake-state"],
  ["stateMode", (value) => value === "review-only"],
  ["reviewedAt", isUtcIsoTimestampWithMilliseconds],
  ["sourceEvaluatorInputCandidate", isPlainObjectRecord],
  ["pipelineSummary", isPlainObjectRecord],
  ["integratedReviewSummary", isPlainObjectRecord],
  ["approvalEvaluatorInputCandidateAccepted", (value) => value === true],
  ["runtimeEffect", isPlainObjectRecord]
]);

function recordHasExactFields(record, fields) {
  return (
    isPlainObjectRecord(record) &&
    Object.keys(record).length === fields.length &&
    recordHasFields(record, fields)
  );
}

function reviewOnlyEvaluatorPreflightUnexpectedUnsafeField(
  value,
  seen = new Set()
) {
  if (Array.isArray(value)) {
    return value.some((entry) =>
      reviewOnlyEvaluatorPreflightUnexpectedUnsafeField(entry, seen)
    );
  }

  if (!isPlainObjectRecord(value) || seen.has(value)) {
    return false;
  }

  seen.add(value);

  return Object.entries(value).some(
    ([key, entry]) =>
      (!REVIEW_ONLY_EVALUATOR_PREFLIGHT_ALLOWED_FIELDS.has(key) &&
        APPROVAL_EVALUATOR_CANDIDATE_UNSAFE_TRUE_FIELD_PATTERN.test(key)) ||
      reviewOnlyEvaluatorPreflightUnexpectedUnsafeField(entry, seen)
  );
}

function reviewOnlyEvaluatorPreflightUnknown(checkpointState) {
  return (
    (typeof checkpointState.schema === "string" &&
      checkpointState.schema !== APPROVAL_EVALUATOR_CANDIDATE_INTAKE_STATE_SCHEMA) ||
    (typeof checkpointState.stateKind === "string" &&
      checkpointState.stateKind !== "approval-evaluator-candidate-intake-state")
  );
}

function reviewOnlyEvaluatorPreflightRevoked(checkpointState) {
  return (
    checkpointState.revoked === true ||
    (isPlainObjectRecord(checkpointState.revocation) &&
      checkpointState.revocation.revoked === true)
  );
}

function reviewOnlyEvaluatorPreflightStale(checkpointState) {
  return (
    isUtcIsoTimestampWithMilliseconds(checkpointState.reviewedAt) &&
    checkpointState.reviewedAt < REVIEW_ONLY_EVALUATOR_PREFLIGHT_MIN_REVIEWED_AT
  );
}

const REVIEW_ONLY_EVALUATOR_PREFLIGHT_MALFORMED_CHECKS = Object.freeze([
  (checkpointState) =>
    !recordHasExactFields(
      checkpointState,
      REVIEW_ONLY_EVALUATOR_PREFLIGHT_STATE_FIELDS
    ),
  (checkpointState) =>
    !recordPassesChecks(
      checkpointState,
      REVIEW_ONLY_EVALUATOR_PREFLIGHT_STATE_CHECKS
    ),
  (checkpointState) =>
    !recordHasExactFields(
      checkpointState.sourceEvaluatorInputCandidate,
      REVIEW_ONLY_EVALUATOR_PREFLIGHT_SOURCE_CANDIDATE_FIELDS
    ),
  (checkpointState) =>
    !recordHasFields(
      checkpointState,
      REVIEW_ONLY_EVALUATOR_PREFLIGHT_REQUIRED_FIELDS
    ),
  (checkpointState) =>
    !recordPassesChecks(
      checkpointState.sourceEvaluatorInputCandidate,
      REVIEW_ONLY_EVALUATOR_PREFLIGHT_SOURCE_CANDIDATE_CHECKS
    ),
  (checkpointState) =>
    !recordHasExactFields(
      checkpointState.sourceEvaluatorInputCandidate.sourceReviewArtifact,
      REVIEW_ONLY_EVALUATOR_PREFLIGHT_SOURCE_ARTIFACT_FIELDS
    ),
  (checkpointState) =>
    !recordPassesChecks(
      checkpointState.sourceEvaluatorInputCandidate.sourceReviewArtifact,
      REVIEW_ARTIFACT_EVALUATOR_INPUT_CANDIDATE_SOURCE_CHECKS
    ),
  (checkpointState) =>
    !recordHasExactFields(
      checkpointState.sourceEvaluatorInputCandidate.sourceReviewArtifact
        .sourceIntegrationCheckpoint,
      REVIEW_ONLY_EVALUATOR_PREFLIGHT_SOURCE_CHECKPOINT_FIELDS
    ),
  (checkpointState) =>
    !recordPassesChecks(
      checkpointState.sourceEvaluatorInputCandidate.sourceReviewArtifact
        .sourceIntegrationCheckpoint,
      PREREQUISITE_REVIEW_ARTIFACT_CHECKPOINT_CHECKS
    ),
  (checkpointState) =>
    !recordHasExactFields(
      checkpointState.pipelineSummary,
      REVIEW_ONLY_EVALUATOR_PREFLIGHT_PIPELINE_SUMMARY_FIELDS
    ),
  (checkpointState) =>
    !recordPassesChecks(
      checkpointState.pipelineSummary,
      PREREQUISITE_REVIEW_ARTIFACT_PIPELINE_CHECKS
    ),
  (checkpointState) =>
    !recordHasExactFields(
      checkpointState.integratedReviewSummary,
      REVIEW_ONLY_EVALUATOR_PREFLIGHT_INTEGRATED_SUMMARY_FIELDS
    ),
  (checkpointState) =>
    !recordPassesChecks(
      checkpointState.integratedReviewSummary,
      PREREQUISITE_REVIEW_ARTIFACT_SUMMARY_CHECKS
    )
]);

function reviewOnlyEvaluatorPreflightMalformed(checkpointState) {
  return REVIEW_ONLY_EVALUATOR_PREFLIGHT_MALFORMED_CHECKS.some((predicate) =>
    predicate(checkpointState)
  );
}

const REVIEW_ONLY_EVALUATOR_PREFLIGHT_GRANT_FALSE_PATHS = Object.freeze([
  Object.freeze(["intakeCheckpointStateIsApprovalGrant"]),
  Object.freeze(["approvalGrantProduced"]),
  Object.freeze(["approvalGrantPersisted"]),
  Object.freeze([
    "sourceEvaluatorInputCandidate",
    "evaluatorInputCandidateIsApprovalGrant"
  ]),
  Object.freeze(["sourceEvaluatorInputCandidate", "approvalGrantProduced"]),
  Object.freeze(["integratedReviewSummary", "reviewSummaryIsApprovalGrant"]),
  Object.freeze(["integratedReviewSummary", "approvalGrantProduced"]),
  Object.freeze(["integratedReviewSummary", "approvalGrantPersisted"])
]);

const REVIEW_ONLY_EVALUATOR_PREFLIGHT_GRANT_NULL_PATHS = Object.freeze([
  Object.freeze(["approvalGrantId"]),
  Object.freeze(["integratedReviewSummary", "approvalGrantId"])
]);

const REVIEW_ONLY_EVALUATOR_PREFLIGHT_GRANT_TRUE_PATHS = Object.freeze([
  Object.freeze(["approvalGrant", "produced"]),
  Object.freeze(["approvalGrant", "persisted"])
]);

function reviewOnlyEvaluatorPreflightPathValue(record, path) {
  let current = record;

  for (const field of path) {
    if (!isPlainObjectRecord(current)) {
      return undefined;
    }

    current = current[field];
  }

  return current;
}

function reviewOnlyEvaluatorPreflightPathDoesNotMatch(record, path, expected) {
  return reviewOnlyEvaluatorPreflightPathValue(record, path) !== expected;
}

function reviewOnlyEvaluatorPreflightGrantLooking(checkpointState) {
  return (
    REVIEW_ONLY_EVALUATOR_PREFLIGHT_GRANT_FALSE_PATHS.some((path) =>
      reviewOnlyEvaluatorPreflightPathDoesNotMatch(checkpointState, path, false)
    ) ||
    REVIEW_ONLY_EVALUATOR_PREFLIGHT_GRANT_NULL_PATHS.some((path) =>
      reviewOnlyEvaluatorPreflightPathDoesNotMatch(checkpointState, path, null)
    ) ||
    REVIEW_ONLY_EVALUATOR_PREFLIGHT_GRANT_TRUE_PATHS.some(
      (path) => reviewOnlyEvaluatorPreflightPathValue(checkpointState, path) === true
    )
  );
}

function reviewOnlyEvaluatorPreflightRuntimePermissionLooking(checkpointState) {
  return approvalEvaluatorCandidateNestedTrueClaim(
    checkpointState,
    (key) =>
      REVIEW_ONLY_EVALUATOR_PREFLIGHT_RUNTIME_PERMISSION_TRUE_FIELDS.includes(
        key
      )
  );
}

function reviewOnlyEvaluatorPreflightCommandExposureLooking(checkpointState) {
  return approvalEvaluatorCandidateNestedTrueClaim(
    checkpointState,
    (key) =>
      REVIEW_ONLY_EVALUATOR_PREFLIGHT_COMMAND_EXPOSURE_TRUE_FIELDS.includes(
        key
      )
  );
}

function reviewOnlyEvaluatorPreflightExecutionSignalLooking(checkpointState) {
  return approvalEvaluatorCandidateNestedTrueClaim(
    checkpointState,
    (key) =>
      REVIEW_ONLY_EVALUATOR_PREFLIGHT_EXECUTION_SIGNAL_TRUE_FIELDS.includes(key)
  );
}

function reviewOnlyEvaluatorPreflightRuntimeEffectTrue(checkpointState) {
  return approvalEvaluatorCandidateRuntimeEffectTrue(checkpointState);
}

function reviewOnlyEvaluatorPreflightProcessFlagTrue(checkpointState) {
  return approvalEvaluatorCandidateNestedTrueClaim(
    checkpointState,
    (key) => APPROVAL_EVALUATOR_CANDIDATE_PROCESS_TRUE_FIELDS.includes(key)
  );
}

function reviewOnlyEvaluatorPreflightUnsafeTrueSurface(checkpointState) {
  return approvalEvaluatorCandidateNestedTrueClaim(
    checkpointState,
    (key) => APPROVAL_EVALUATOR_CANDIDATE_UNSAFE_TRUE_FIELD_PATTERN.test(key)
  );
}

function reviewOnlyEvaluatorPreflightAuthorizing(checkpointState) {
  return approvalEvaluatorCandidateNestedTrueClaim(
    checkpointState,
    (key) =>
      REVIEW_ONLY_EVALUATOR_PREFLIGHT_AUTHORITATIVE_TRUE_FIELDS.includes(key)
  );
}

const REVIEW_ONLY_EVALUATOR_PREFLIGHT_SINGLE_REJECTION_CHECKS = Object.freeze([
  [
    (checkpointState) => !isPlainObjectRecord(checkpointState),
    "malformed_review_only_evaluator_preflight_checkpoint_input_rejected"
  ],
  [
    reviewOnlyEvaluatorPreflightUnknown,
    "unknown_review_only_evaluator_preflight_checkpoint_input_rejected"
  ],
  [
    reviewOnlyEvaluatorPreflightRevoked,
    "revoked_review_only_evaluator_preflight_checkpoint_input_rejected"
  ],
  [
    reviewOnlyEvaluatorPreflightStale,
    "stale_review_only_evaluator_preflight_checkpoint_input_rejected"
  ],
  [
    reviewOnlyEvaluatorPreflightUnexpectedUnsafeField,
    "unsafe_review_only_evaluator_preflight_checkpoint_input_rejected"
  ],
  [
    reviewOnlyEvaluatorPreflightGrantLooking,
    "grant_looking_review_only_evaluator_preflight_checkpoint_input_rejected"
  ],
  [
    reviewOnlyEvaluatorPreflightRuntimePermissionLooking,
    "runtime_permission_looking_review_only_evaluator_preflight_checkpoint_input_rejected"
  ],
  [
    reviewOnlyEvaluatorPreflightCommandExposureLooking,
    "command_exposure_looking_review_only_evaluator_preflight_checkpoint_input_rejected"
  ],
  [
    reviewOnlyEvaluatorPreflightExecutionSignalLooking,
    "execution_signal_looking_review_only_evaluator_preflight_checkpoint_input_rejected"
  ],
  [
    reviewOnlyEvaluatorPreflightRuntimeEffectTrue,
    "runtime_effect_true_review_only_evaluator_preflight_checkpoint_input_rejected"
  ],
  [
    reviewOnlyEvaluatorPreflightProcessFlagTrue,
    "process_flag_true_review_only_evaluator_preflight_checkpoint_input_rejected"
  ],
  [
    reviewOnlyEvaluatorPreflightUnsafeTrueSurface,
    "unsafe_review_only_evaluator_preflight_checkpoint_input_rejected"
  ],
  [
    reviewOnlyEvaluatorPreflightAuthorizing,
    "authorizing_review_only_evaluator_preflight_checkpoint_input_rejected"
  ],
  [
    reviewOnlyEvaluatorPreflightMalformed,
    "malformed_review_only_evaluator_preflight_checkpoint_input_rejected"
  ]
]);

function reviewOnlyEvaluatorPreflightSingleClassification(checkpointState) {
  return (
    REVIEW_ONLY_EVALUATOR_PREFLIGHT_SINGLE_REJECTION_CHECKS.find(
      ([predicate]) => predicate(checkpointState)
    )?.[1] ?? VALID_REVIEW_ONLY_EVALUATOR_PREFLIGHT_CLASSIFICATION
  );
}

function firstReviewOnlyEvaluatorPreflightRejection(checkpointStates) {
  return (
    checkpointStates
      .map(reviewOnlyEvaluatorPreflightSingleClassification)
      .find(
        (classification) =>
          classification !== VALID_REVIEW_ONLY_EVALUATOR_PREFLIGHT_CLASSIFICATION
      ) ?? null
  );
}

function reviewOnlyEvaluatorPreflightStatesContainDuplicate(checkpointStates) {
  const digests = checkpointStates.map((checkpointState) =>
    reviewArtifactHandoffDigest(checkpointState)
  );

  return new Set(digests).size !== digests.length;
}

const REVIEW_ONLY_EVALUATOR_PREFLIGHT_RESOLVERS = Object.freeze([
  (checkpointStates) =>
    checkpointStates === undefined
      ? "missing_review_only_evaluator_preflight_checkpoint_input_rejected"
      : null,
  (checkpointStates) =>
    !Array.isArray(checkpointStates)
      ? "malformed_review_only_evaluator_preflight_checkpoint_input_rejected"
      : null,
  (checkpointStates) =>
    checkpointStates.length === 0
      ? "empty_review_only_evaluator_preflight_checkpoint_input_rejected"
      : null,
  firstReviewOnlyEvaluatorPreflightRejection,
  (checkpointStates) =>
    reviewOnlyEvaluatorPreflightStatesContainDuplicate(checkpointStates)
      ? "duplicate_invalid_review_only_evaluator_preflight_checkpoint_input_rejected"
      : null,
  (checkpointStates) =>
    checkpointStates.length > 1
      ? "conflicting_review_only_evaluator_preflight_checkpoint_input_rejected"
      : null
]);

function reviewOnlyEvaluatorPreflightClassification(checkpointStates) {
  let classification = null;

  REVIEW_ONLY_EVALUATOR_PREFLIGHT_RESOLVERS.some((resolver) => {
    classification = resolver(checkpointStates);
    return classification !== null;
  });

  return classification ?? VALID_REVIEW_ONLY_EVALUATOR_PREFLIGHT_CLASSIFICATION;
}

function reviewOnlyEvaluatorPreflightPipelineSummary(pipelineSummary) {
  return {
    sourceCount: pipelineSummary.sourceCount,
    selectedSourceId: pipelineSummary.selectedSourceId,
    selectedBundlePartId: pipelineSummary.selectedBundlePartId,
    readerRecordCount: pipelineSummary.readerRecordCount,
    evaluatorClassification: pipelineSummary.evaluatorClassification,
    prerequisiteSignalRecognized: pipelineSummary.prerequisiteSignalRecognized
  };
}

function reviewOnlyEvaluatorPreflightIntegratedSummary(integratedReviewSummary) {
  return {
    schema: integratedReviewSummary.schema,
    evaluatorKind: integratedReviewSummary.evaluatorKind,
    evaluationMode: integratedReviewSummary.evaluationMode,
    classification: integratedReviewSummary.classification,
    prerequisiteSignalRecognized:
      integratedReviewSummary.prerequisiteSignalRecognized,
    reviewOnly: integratedReviewSummary.reviewOnly,
    authoritative: integratedReviewSummary.authoritative,
    reviewSummaryIsApprovalGrant:
      integratedReviewSummary.reviewSummaryIsApprovalGrant,
    approvalGrantProduced: integratedReviewSummary.approvalGrantProduced,
    approvalGrantPersisted: integratedReviewSummary.approvalGrantPersisted,
    approvalGrantId: integratedReviewSummary.approvalGrantId,
    runtimeEffectAllFalse: integratedReviewSummary.runtimeEffectAllFalse
  };
}

function reviewOnlyEvaluatorPreflightStateFromCheckpointState(
  checkpointState,
  reviewedAt
) {
  return {
    schema: REVIEW_ONLY_EVALUATOR_PREFLIGHT_STATE_SCHEMA,
    schemaVersion: REVIEW_ONLY_EVALUATOR_PREFLIGHT_CHECKPOINT_VERSION,
    stateKind: "review-only-evaluator-preflight-state",
    stateMode: "review-only",
    reviewedAt,
    sourceIntakeCheckpointState: {
      schema: checkpointState.schema,
      stateKind: checkpointState.stateKind,
      stateMode: checkpointState.stateMode,
      reviewedAt: checkpointState.reviewedAt,
      stateDigest: reviewArtifactHandoffDigest(checkpointState),
      sourceEvaluatorInputCandidateDigest:
        checkpointState.sourceEvaluatorInputCandidate.candidateDigest,
      intakeCheckpointStateIsApprovalGrant: false,
      approvalGrantProduced: false,
      approvalGrantPersisted: false,
      runtimeEffectAllFalse: true
    },
    pipelineSummary: reviewOnlyEvaluatorPreflightPipelineSummary(
      checkpointState.pipelineSummary
    ),
    integratedReviewSummary: reviewOnlyEvaluatorPreflightIntegratedSummary(
      checkpointState.integratedReviewSummary
    ),
    evaluatorPreflightAccepted: true,
    evaluatorPreflightCheckpointStateIsApprovalGrant: false,
    approvalGrantProduced: false,
    approvalGrantPersisted: false,
    approvalGrantId: null,
    runtimePermissionGranted: false,
    commandExposurePermissionGranted: false,
    runtimeCommandExposureEnabled: false,
    runtimeExecutionEnabled: false,
    evaluatorExecutionRequested: false,
    evaluatorExecutionStarted: false,
    evaluatorExecutionEnabled: false,
    evaluatorExecuted: false,
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

function reviewOnlyEvaluatorPreflightRejectionReasons({
  accepted,
  classification
}) {
  if (accepted) {
    return [
      "evaluator_preflight_checkpoint_state_is_not_approval_grant",
      "approval_grant_not_implemented",
      "evaluator_execution_not_implemented",
      "runtime_enablement_still_blocked"
    ];
  }

  return [
    classification,
    "evaluator_preflight_checkpoint_state_not_produced",
    "approval_grant_not_implemented",
    "evaluator_execution_not_implemented",
    "runtime_enablement_still_blocked"
  ];
}

export function createReviewOnlyEvaluatorPreflightCheckpointForReview(
  input = {}
) {
  const reviewedAt = approvalPrerequisiteSourceReviewedAt(input);
  const intakeCheckpointStates = input.intakeCheckpointStates;
  const classification = reviewOnlyEvaluatorPreflightClassification(
    intakeCheckpointStates
  );
  const accepted =
    classification === VALID_REVIEW_ONLY_EVALUATOR_PREFLIGHT_CLASSIFICATION;
  const intakeCheckpointState = accepted ? intakeCheckpointStates[0] : null;
  const preflightCheckpointState = accepted
    ? reviewOnlyEvaluatorPreflightStateFromCheckpointState(
        intakeCheckpointState,
        reviewedAt
      )
    : null;

  return {
    schema: REVIEW_ONLY_EVALUATOR_PREFLIGHT_CHECKPOINT_SCHEMA,
    schemaVersion: REVIEW_ONLY_EVALUATOR_PREFLIGHT_CHECKPOINT_VERSION,
    checkpointKind: REVIEW_ONLY_EVALUATOR_PREFLIGHT_CHECKPOINT_KIND,
    checkpointMode: "review-only",
    reviewedAt,
    classification,
    intakeCheckpointStateAccepted: accepted,
    preflightCheckpointStateProduced: accepted,
    preflightCheckpointStateIsApprovalGrant: false,
    preflightCheckpointState,
    checkpointSummary: accepted
      ? {
          schema: intakeCheckpointState.schema,
          stateKind: intakeCheckpointState.stateKind,
          stateMode: intakeCheckpointState.stateMode,
          reviewedAt: intakeCheckpointState.reviewedAt,
          stateDigest: reviewArtifactHandoffDigest(intakeCheckpointState),
          intakeCheckpointStateIsApprovalGrant: false,
          approvalGrantProduced: false,
          approvalGrantPersisted: false,
          runtimeEffectAllFalse: true
        }
      : null,
    reviewOnly: true,
    authoritative: false,
    approvalGrant: sourcePreflightGrantBlocked(),
    approvalGrantProduced: false,
    approvalGrantPersisted: false,
    approvalGrantId: null,
    runtimePermissionGranted: false,
    commandExposurePermissionGranted: false,
    runtimeCommandExposureEnabled: false,
    runtimeExecutionEnabled: false,
    evaluatorExecutionRequested: false,
    evaluatorExecutionStarted: false,
    evaluatorExecutionEnabled: false,
    evaluatorExecuted: false,
    rejectionReasons: reviewOnlyEvaluatorPreflightRejectionReasons({
      accepted,
      classification
    }),
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
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
