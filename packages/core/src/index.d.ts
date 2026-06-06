export const ARDYN_SCHEMA_VERSION: "0.1.0";
export const ARDYN_PHASE: "phase-3-task-planning";
export const ARDYN_STDIO_DRY_RUN_PHASE: "phase-4.0a-stdio-event-dry-run";
export const ARDYN_STDIO_FRAMING_REDACTION_PHASE:
  "phase-4.1c-framing-redaction-contracts";
export const STDIO_FRAMING_REDACTION_CONTRACT_SCHEMA:
  "ardyn.stdio-framing-redaction-contract";
export const STDIO_FRAMING_REDACTION_CONTRACT_VERSION: "0.1.0";
export const JSONL_WHOLE_LINE_BUNDLE_VALID: "valid_whole_line_bundle";
export const JSONL_WHOLE_LINE_BUNDLE_BLANK_LINE_REJECTED: "blank_line_rejected";
export const JSONL_WHOLE_LINE_BUNDLE_MISSING_FINAL_LF: "missing_final_lf";
export const JSONL_WHOLE_LINE_BUNDLE_CRLF_REJECTED: "crlf_rejected";
export const JSONL_WHOLE_LINE_BUNDLE_MALFORMED_JSON_LINE: "malformed_json_line";
export const JSONL_WHOLE_LINE_BUNDLE_PARTIAL_LINE_REJECTED:
  "partial_line_rejected";
export const STDERR_REDACTION_SAFE: "redacted_safe";
export const STDERR_REDACTION_UNREDACTABLE_FAIL_CLOSED:
  "unredactable_fail_closed";
export const STDERR_REDACTION_MALFORMED: "malformed";
export const ARDYN_TRANSCRIPT_REPLAY_CONTRACT_PHASE:
  "phase-4.1d-transcript-replay-contracts";
export const TRANSCRIPT_PERSISTENCE_CONTRACT_SCHEMA:
  "ardyn.transcript-persistence-contract";
export const TRANSCRIPT_REPLAY_CONTRACT_SCHEMA: "ardyn.transcript-replay-contract";
export const TRANSCRIPT_REPLAY_COMPATIBILITY_RECORD_SCHEMA:
  "ardyn.transcript-replay-compatibility-record";
export const TRANSCRIPT_REPLAY_CONTRACT_VERSION: "0.1.0";
export const TRANSCRIPT_REPLAY_CONTRACT_ONLY: "replay_contract_only";
export const TRANSCRIPT_REPLAY_COMPATIBLE: "compatible";
export const TRANSCRIPT_REPLAY_UPGRADE_AVAILABLE: "upgrade_available";
export const TRANSCRIPT_REPLAY_UNSUPPORTED_MAJOR: "unsupported_major";
export const TRANSCRIPT_REPLAY_MALFORMED: "malformed";
export const TRANSCRIPT_REPLAY_DIGEST_MISMATCH: "digest_mismatch";
export const TRANSCRIPT_REPLAY_SEQUENCE_GAP: "sequence_gap";
export const TRANSCRIPT_REPLAY_DUPLICATE_SEQUENCE: "duplicate_sequence";
export const TRANSCRIPT_REPLAY_OUT_OF_ORDER_SEQUENCE: "out_of_order_sequence";
export const TRANSCRIPT_REPLAY_RUNTIME_UNAVAILABLE: "replay_runtime_unavailable";
export const APPROVAL_REVIEW_ARTIFACT_SCHEMA: "ardyn.approval-review-artifact";
export const APPROVAL_REVIEW_ARTIFACT_VERSION: "0.1.0";
export const SCHEMA_MIGRATION_METADATA_SCHEMA: "ardyn.schema-migration-metadata";
export const SCHEMA_MIGRATION_METADATA_VERSION: "0.1.0";
export const REVIEW_ARTIFACT_ATTESTATION_PLAN_SCHEMA:
  "ardyn.review-artifact-attestation-plan";
export const REVIEW_ARTIFACT_ATTESTATION_PLAN_VERSION: "0.1.0";
export const SESSION_TRANSCRIPT_SCHEMA: "ardyn.session-transcript";
export const SESSION_TRANSCRIPT_SCHEMA_VERSION: "0.1.0";
export const SESSION_TRANSCRIPT_SUMMARY_SCHEMA: "ardyn.session-transcript-summary";
export const SESSION_TRANSCRIPT_DISPLAY_SUMMARY_SCHEMA:
  "ardyn.session-transcript-display-summary";
export const SESSION_TRANSCRIPT_MIGRATION_METADATA_SCHEMA:
  "ardyn.session-transcript-migration-metadata";
export const SESSION_TRANSCRIPT_COMPATIBILITY_EXPLANATION_SCHEMA:
  "ardyn.session-transcript-compatibility-explanation";
export const SESSION_TRANSCRIPT_EXPLANATION_SCHEMA: "ardyn.session-transcript-explanation";
export const SESSION_TRANSCRIPT_COMPATIBLE: "compatible";
export const SESSION_TRANSCRIPT_UPGRADE_AVAILABLE: "upgrade_available";
export const SESSION_TRANSCRIPT_UNSUPPORTED_MAJOR: "unsupported_major";
export const SESSION_TRANSCRIPT_MALFORMED: "malformed";
export const HOST_POLICY_REVIEW_RECORD_SCHEMA: "ardyn.host-policy-review-record";
export const HOST_POLICY_REVIEW_RECORD_VERSION: "0.1.0";
export const HOST_POLICY_REVIEW_RECORD_COMPARISON_SCHEMA:
  "ardyn.host-policy-review-record-comparison";
export const HOST_POLICY_REVIEW_RECORD_COMPARISON_VERSION: "0.1.0";
export const ARDYN_HOST_POLICY_REVIEW_COMPARISON_PHASE:
  "phase-4.0g-host-policy-review-comparison";
export const HOST_POLICY_REVIEW_COMPATIBLE: "compatible";
export const HOST_POLICY_REVIEW_UPGRADE_AVAILABLE: "upgrade_available";
export const HOST_POLICY_REVIEW_UNSUPPORTED_MAJOR: "unsupported_major";
export const HOST_POLICY_REVIEW_MALFORMED: "malformed";
export const HOST_POLICY_REVIEW_REJECTED_POLICY: "rejected_policy";
export const HOST_CRATE_NAME: "ardyn-host";
export const APPROVAL_REQUIRED: "approval-required";
export const APPROVAL_DENIED: "approval-denied";
export const APPROVAL_GRANTED: "approval-granted";
export const APPROVAL_STATUSES: readonly [
  "approval-required",
  "approval-denied",
  "approval-granted"
];
export const APPROVAL_DECISION_REQUIRED: "required";
export const APPROVAL_DECISION_DENIED: "denied";
export const APPROVAL_DECISION_GRANTED: "granted";
export const APPROVAL_DECISION_NOT_REQUIRED: "not_required";
export const APPROVAL_DECISION_STATUSES: readonly [
  "required",
  "denied",
  "granted",
  "not_required"
];

export type RuntimeHost = "rust";
export type RuntimeCore = "typescript";
export type CapabilityKind =
  | "adapter"
  | "browser"
  | "desktop"
  | "mcp-client"
  | "mcp-server"
  | "memory"
  | "model-provider"
  | "tool"
  | "workflow";
export type PermissionScope =
  | "browser"
  | "credentials"
  | "desktop"
  | "filesystem"
  | "memory"
  | "network"
  | "process"
  | "provider"
  | "registry";
export type PermissionAccess = "read" | "write" | "connect" | "admin";
export type TaskMode = "plan" | "dry-run";
export type ApprovalStatus = "approval-required" | "approval-denied" | "approval-granted";
export type ApprovalDecisionStatus = "required" | "denied" | "granted" | "not_required";
export type CapabilityMatchType = "exact" | "tag" | "scope" | "no-match";
export type ApprovalReviewArtifactCompatibility =
  | "compatible"
  | "upgrade_available"
  | "unsupported_major"
  | "malformed";
export type SessionTranscriptCompatibility =
  | "compatible"
  | "upgrade_available"
  | "unsupported_major"
  | "malformed";
export type HostPolicyReviewRecordCompatibility =
  | "compatible"
  | "upgrade_available"
  | "unsupported_major"
  | "malformed"
  | "rejected_policy";
export type SchemaMigrationArtifactKind =
  | "manifest"
  | "task"
  | "planner_trace"
  | "approval_review_artifact"
  | "trace_diff"
  | "host_policy";
export type SchemaMigrationCompatibility =
  | "compatible"
  | "upgrade_available"
  | "unsupported_major"
  | "malformed";
export type ReviewArtifactAttestationVerificationStatus =
  | "unsigned"
  | "planned"
  | "test_fixture_only"
  | "unsupported";

export interface ArdynPermission {
  scope: PermissionScope;
  access: PermissionAccess;
  reason?: string;
}

export interface ArdynCapability {
  id: string;
  kind: CapabilityKind;
  description: string;
  tags?: string[];
  permissions: ArdynPermission[];
}

export interface ArdynRuntime {
  host: RuntimeHost;
  core: RuntimeCore;
  entrypoint?: string;
}

export interface ArdynAdapterConfig {
  enabled: boolean;
  external: boolean;
  endpoint?: string;
  notes?: string;
}

export interface ArdynPolicies {
  defaultTaskMode?: TaskMode;
  requiresApprovalFor?: Exclude<PermissionScope, "memory">[];
}

export interface ArdynManifest {
  schemaVersion: "0.1.0";
  name: string;
  version: string;
  description?: string;
  runtime: ArdynRuntime;
  capabilities: ArdynCapability[];
  adapters?: Record<string, ArdynAdapterConfig>;
  policies?: ArdynPolicies;
}

export interface ArdynTaskConstraints {
  requireHumanApproval?: boolean;
  allowNetwork?: boolean;
  maxSteps?: number;
  workspaceRoot?: string;
}

export interface ArdynTask {
  id: string;
  objective: string;
  mode: TaskMode;
  requestedCapabilities: string[];
  constraints?: ArdynTaskConstraints;
  inputs?: Record<string, unknown>;
  metadata?: Record<string, string | number | boolean | null>;
}

export interface ValidationResult {
  valid: boolean;
  errors: unknown[];
}

export interface NoExecutionSafetyFlags {
  executionEnabled: false;
  toolExecutionEnabled: false;
  autonomousExecutionEnabled: false;
  productionToolExecutionEnabled: false;
  apiCallsEnabled: false;
  networkListening: false;
  longRunningServicesStarted: false;
  processesSpawned: false;
  pluginInstallEnabled: false;
  torrentDownloadEnabled: false;
  codePackEnablementEnabled: false;
  agentLoopEnabled: false;
}

export type SessionEventType =
  | "session.started"
  | "session.heartbeat"
  | "session.capabilities"
  | "task.planned"
  | "approval.requested"
  | "approval.recorded"
  | "session.completed"
  | "session.error";

export interface SessionEvent {
  schemaVersion: "0.1.0";
  eventId: string;
  sessionId: string;
  sequence: number;
  createdAt: string;
  sourceHarness: "ardyn";
  eventType: SessionEventType;
  payload: unknown;
  nonExecuting: true;
  safety: NoExecutionSafetyFlags;
}

export interface StdioDryRunSessionEventOptions {
  manifestPath?: string;
  taskPath?: string;
  sessionId?: string;
  createdAt?: string;
  approvalDecision?: ApprovalDecisionInput;
}

export type JsonlWholeLineBundleClassification =
  | "valid_whole_line_bundle"
  | "blank_line_rejected"
  | "missing_final_lf"
  | "crlf_rejected"
  | "malformed_json_line"
  | "partial_line_rejected";

export type StderrRedactionSafetyClassification =
  | "redacted_safe"
  | "unredactable_fail_closed"
  | "malformed";

export interface StaticReviewRuntimeEffect {
  currentContractEnablesRuntime: false;
  processStdioOwnershipAvailable: false;
  stdoutWriterAvailable: false;
  stderrWriterAvailable: false;
  stdinReaderAvailable?: false;
  runtimeCommandAvailable: false;
  writesToStdout?: false;
  writesToStderr?: false;
}

export interface JsonlWholeLineBundleValidation {
  schema: "ardyn.jsonl-whole-line-bundle-validation";
  schemaVersion: "0.1.0";
  phase: "phase-4.1c-framing-redaction-contracts";
  classification: JsonlWholeLineBundleClassification;
  valid: boolean;
  lineCount: number;
  lfOnly: boolean;
  finalLf: boolean;
  blankLinesAllowed: false;
  partialLineEmissionAllowed: false;
  oneJsonObjectPerLine: boolean;
  errors: string[];
  reviewOnly: true;
  runtimeEffect: StaticReviewRuntimeEffect;
}

export interface StaticStderrDiagnosticInput {
  code: string;
  message: string;
}

export interface StaticStderrDiagnosticRedaction {
  kind: string;
  replacement: string;
}

export interface StaticStderrDiagnosticRedactionReview {
  schema: "ardyn.stderr-diagnostic-redaction-review";
  schemaVersion: "0.1.0";
  phase: "phase-4.1c-framing-redaction-contracts";
  classification: StderrRedactionSafetyClassification;
  diagnostic: StaticStderrDiagnosticInput;
  redactions: StaticStderrDiagnosticRedaction[];
  failClosed: boolean;
  reviewOnly: true;
  runtimeEffect: StaticReviewRuntimeEffect;
}

export interface StdioFramingRedactionContract {
  schema: "ardyn.stdio-framing-redaction-contract";
  schemaVersion: "0.1.0";
  contractKind: "stdio-framing-redaction-contract";
  contractPhase: "phase-4.1c-framing-redaction-contracts";
  reviewedPhase: "4.1C";
  runtimeEffect: {
    currentContractEnablesRuntime: false;
    runtimeImplementationAvailable: false;
    runtimeCommandAvailable: false;
    processStdioOwnershipAvailable: false;
    stdinReaderAvailable: false;
    stdoutWriterAvailable: false;
    stderrWriterAvailable: false;
    failureAuditRuntimeAvailable: false;
    approvalEvaluatorAvailable: false;
  };
}

export type TranscriptReplayCompatibilityClassification =
  | "replay_contract_only"
  | "compatible"
  | "upgrade_available"
  | "unsupported_major"
  | "malformed"
  | "digest_mismatch"
  | "sequence_gap"
  | "duplicate_sequence"
  | "out_of_order_sequence"
  | "replay_runtime_unavailable";

export interface TranscriptDigestRecord {
  algorithm: "sha256";
  value: string;
}

export interface TranscriptReplayRuntimeEffect {
  currentContractEnablesRuntime: false;
  runtimeImplementationAvailable: false;
  runtimeCommandAvailable: false;
  replayCommandAvailable: false;
  transcriptPersistenceRuntimeAvailable: false;
  transcriptReplayRuntimeAvailable: false;
  processStdioOwnershipAvailable: false;
  stdinReaderAvailable: false;
  stdoutWriterAvailable: false;
  stderrWriterAvailable: false;
  failureAuditRuntimeAvailable: false;
  approvalEvaluatorAvailable: false;
  writesFiles: false;
  readsFiles: false;
}

export interface TranscriptArtifactReference {
  artifactKind: "ardyn.session-transcript";
  transcriptVersion: string | null;
  sessionId: string | null;
  sourceHarness: string | null;
}

export interface TranscriptSourceEventStreamReference {
  reference: string;
  streamKind: "stdio-jsonl-session-events";
  sourcePhase: "phase-4.0a-stdio-event-dry-run";
  liveStreamReaderAvailable: false;
  replayRuntimeConsumerAvailable: false;
}

export interface TranscriptEventIndexEntry {
  eventId: string | null;
  eventType: string | null;
  sequence: number | null;
  eventDigest: TranscriptDigestRecord;
}

export interface TranscriptSequenceRange {
  first: number | null;
  last: number | null;
}

export interface TranscriptPersistenceContract {
  schema: "ardyn.transcript-persistence-contract";
  schemaVersion: "0.1.0";
  contractKind: "transcript-persistence-contract";
  contractPhase: "phase-4.1d-transcript-replay-contracts";
  reviewedPhase: "4.1D";
  transcriptArtifact: TranscriptArtifactReference;
  sourceEventStreamReference: TranscriptSourceEventStreamReference;
  eventCount: number;
  sequenceRange: TranscriptSequenceRange;
  eventDigest: TranscriptDigestRecord;
  eventIndex: TranscriptEventIndexEntry[];
  persistedAt: string;
  persistedAtIsDeterministicFixtureMetadataOnly: true;
  replayCompatibilityClassification: "replay_contract_only";
  replaySafetyStatus: "static-contract-only";
  nonExecutionInvariantSummary: string[];
  failureReasons: string[];
  runtimeEffect: TranscriptReplayRuntimeEffect;
  audit: Record<string, unknown>;
}

export interface TranscriptReplayContract {
  schema: "ardyn.transcript-replay-contract";
  schemaVersion: "0.1.0";
  contractKind: "transcript-replay-contract";
  contractPhase: "phase-4.1d-transcript-replay-contracts";
  reviewedPhase: "4.1D";
  transcriptArtifact: TranscriptArtifactReference;
  sourceEventStreamReference: TranscriptSourceEventStreamReference;
  eventCount: number;
  sequenceRange: TranscriptSequenceRange;
  eventDigest: TranscriptDigestRecord;
  persistedAt: string;
  replayCompatibilityClassification: "replay_contract_only";
  replaySafetyStatus: "replay-runtime-unavailable";
  replayCommand: {
    name: "replay-session-transcript";
    implemented: false;
    rejectedByCli: true;
  };
  nonExecutionInvariantSummary: string[];
  failureReasons: string[];
  runtimeEffect: TranscriptReplayRuntimeEffect;
  audit: Record<string, unknown>;
}

export interface TranscriptReplayCompatibilityRecord {
  schema: "ardyn.transcript-replay-compatibility-record";
  schemaVersion: "0.1.0";
  recordKind: "transcript-replay-compatibility-record";
  recordPhase: "phase-4.1d-transcript-replay-contracts";
  reviewedPhase: "4.1D";
  transcriptArtifact: TranscriptArtifactReference;
  sourceEventStreamReference: TranscriptSourceEventStreamReference;
  eventCount: number;
  sequenceRange: TranscriptSequenceRange;
  eventDigest: TranscriptDigestRecord;
  eventIndex: TranscriptEventIndexEntry[];
  persistedAt: string;
  replayCompatibilityClassification: TranscriptReplayCompatibilityClassification;
  replaySafetyStatus: "static-compatible-review-only" | "fail-closed";
  nonExecutionInvariantSummary: string[];
  failureReasons: string[];
  runtimeEffect: TranscriptReplayRuntimeEffect;
  audit: Record<string, unknown>;
}

export interface TranscriptReplayCompatibilityClassificationResult {
  schema: "ardyn.transcript-replay-compatibility-classification";
  schemaVersion: "0.1.0";
  phase: "phase-4.1d-transcript-replay-contracts";
  classification: TranscriptReplayCompatibilityClassification;
  valid: boolean;
  failClosed: boolean;
  replayRuntimeAvailable: false;
  replayCommandAvailable: false;
  errors: string[];
  failureReasons: string[];
  reviewOnly: true;
  runtimeEffect: TranscriptReplayRuntimeEffect;
}

export interface SessionTranscript {
  schema: "ardyn.session-transcript";
  schemaVersion: "0.1.0";
  sessionId: string;
  sourceHarness: "ardyn";
  nonExecuting: true;
  safety: NoExecutionSafetyFlags;
  events: SessionEvent[];
}

export type SessionTranscriptClassification = "valid" | "invalid" | "malformed";

export interface SessionTranscriptClassificationResult {
  classification: SessionTranscriptClassification;
  valid: boolean;
  errors: string[];
  nonExecuting: true;
  safety: NoExecutionSafetyFlags;
}

export interface SessionTranscriptSummary {
  schema: "ardyn.session-transcript-summary";
  schemaVersion: "0.1.0";
  classification: SessionTranscriptClassification;
  valid: boolean;
  sessionId: string | null;
  sourceHarness: string | null;
  eventCount: number;
  eventTypes: string[];
  firstEventType: string | null;
  lastEventType: string | null;
  sequence: {
    first: number | null;
    last: number | null;
    contiguous: boolean;
  };
  lifecycle: {
    startsWithSessionStarted: boolean;
    completed: boolean;
    errored: boolean;
  };
  transcriptNonExecuting: boolean;
  transcriptSafetyAllFalse: boolean;
  errors: string[];
  nonExecuting: true;
  safety: NoExecutionSafetyFlags;
}

export interface SessionTranscriptExplanation {
  schema: "ardyn.session-transcript-explanation";
  schemaVersion: "0.1.0";
  classification: SessionTranscriptClassification;
  valid: boolean;
  sessionId: string | null;
  sourceHarness: string | null;
  checks: {
    transcriptSchema: boolean;
    transcriptSchemaVersion: boolean;
    transcriptSessionId: boolean;
    transcriptSourceHarness: boolean;
    transcriptNonExecuting: boolean;
    transcriptSafetyAllFalse: boolean;
    eventsArray: boolean;
    eventsNonEmpty: boolean;
    firstEventStarted: boolean;
    sequencesContiguous: boolean;
    eventSessionIdsMatch: boolean;
    eventSourceHarnessesMatch: boolean;
    eventNonExecuting: boolean;
    eventSafetyAllFalse: boolean;
  };
  errors: string[];
  summary: SessionTranscriptSummary;
  nonExecuting: true;
  safety: NoExecutionSafetyFlags;
}

export interface SessionTranscriptCompatibilityResult {
  schemaId: string | null;
  expectedSchemaId: "ardyn.session-transcript";
  schemaVersion: string | null;
  currentSchemaVersion: "0.1.0";
  compatibility: SessionTranscriptCompatibility;
  valid: boolean;
  structurallyUsable: boolean;
  schemaIdValid: boolean;
  schemaVersionValid: boolean;
  eventsUsable: boolean;
  migrationRequired: boolean;
  migrationAvailable: boolean;
  migrationNotes: string[];
  validationErrors: string[];
  unknownFields: string[];
  unknownFieldCount: number;
  unknownFieldsAreInert: true;
  nonExecuting: true;
  safety: NoExecutionSafetyFlags;
}

export interface SessionTranscriptMigrationMetadata {
  schema: "ardyn.session-transcript-migration-metadata";
  schemaVersion: "0.1.0";
  artifactKind: "session_transcript";
  schemaId: string | null;
  expectedSchemaId: "ardyn.session-transcript";
  artifactSchemaVersion: string | null;
  currentSchemaVersion: "0.1.0";
  compatibility: SessionTranscriptCompatibility;
  migrationRequired: boolean;
  migrationAvailable: boolean;
  migrationNotes: string[];
  notes: string[];
  validationErrors: string[];
  unknownFields: string[];
  unknownFieldsAreInert: true;
  nonExecuting: true;
  safety: NoExecutionSafetyFlags;
}

export type SessionTranscriptDisplayWarningSeverity = "info" | "warning" | "error";

export interface SessionTranscriptDisplayWarning {
  severity: SessionTranscriptDisplayWarningSeverity;
  code: string;
  message: string;
}

export interface SessionTranscriptDisplaySummary {
  schema: "ardyn.session-transcript-display-summary";
  schemaVersion: "0.1.0";
  sessionId: string | null;
  sourceHarness: string | null;
  schemaStatus: {
    schemaId: string | null;
    expectedSchemaId: "ardyn.session-transcript";
    schemaVersion: string | null;
    currentSchemaVersion: "0.1.0";
    compatibility: SessionTranscriptCompatibility;
    valid: boolean;
    migrationRequired: boolean;
    migrationAvailable: boolean;
  };
  eventCount: number;
  firstEventType: string | null;
  lastEventType: string | null;
  sequenceRange: {
    first: number | null;
    last: number | null;
    min: number | null;
    max: number | null;
    contiguous: boolean;
  };
  counts: {
    errors: number;
    approvalEvents: number;
    taskPlannedEvents: number;
    unknownFields: number;
  };
  safetyPosture: {
    nonExecuting: boolean | null;
    allFlagsFalse: boolean;
    flags: Record<keyof NoExecutionSafetyFlags, unknown>;
  };
  warnings: SessionTranscriptDisplayWarning[];
  unknownFields: string[];
  unknownFieldCount: number;
  validationErrors: unknown[];
  nonExecuting: true;
  safety: NoExecutionSafetyFlags;
}

export interface SessionTranscriptCompatibilityExplanation {
  schema: "ardyn.session-transcript-compatibility-explanation";
  schemaVersion: "0.1.0";
  schemaId: string | null;
  schemaVersionStatus: string | null;
  compatibility: SessionTranscriptCompatibility;
  decision: SessionTranscriptCompatibilityResult;
  migrationRequired: boolean;
  migrationAvailable: boolean;
  migrationNotes: string[];
  displayWarnings: SessionTranscriptDisplayWarning[];
  validationErrors: string[];
  unknownFieldsAreInert: true;
  nonExecuting: true;
  safety: NoExecutionSafetyFlags;
}

export interface TaskCapabilityResolution {
  request: string;
  matchType: CapabilityMatchType;
  scope: PermissionScope | null;
  capabilityIds: string[];
  selectedCapabilityIds: string[];
  candidates: TaskCapabilityCandidate[];
  reason: string;
}

export interface TaskCapabilityCandidate {
  capabilityId: string;
  matchType: Exclude<CapabilityMatchType, "no-match">;
  score: 300 | 200 | 100;
  scope: PermissionScope | null;
  tag: string | null;
  reason: string;
}

export interface ResolvedTaskCapabilities {
  selectedCapabilities: ArdynCapability[];
  resolutions: TaskCapabilityResolution[];
  unresolvedRequests: string[];
  duplicateRequestedCapabilities: string[];
}

export interface TaskApprovalReasonConstraint {
  type: "task-constraint";
  field: "constraints.requireHumanApproval";
}

export interface TaskApprovalReasonPolicyScope {
  type: "policy-scope";
  capabilityId: string;
  scope: PermissionScope;
  access: PermissionAccess;
}

export type TaskApprovalReason = TaskApprovalReasonConstraint | TaskApprovalReasonPolicyScope;

export interface TaskApprovalGate {
  required: boolean;
  status: ApprovalStatus | null;
  reasons: TaskApprovalReason[];
}

export interface ApprovalDecisionInput {
  status: ApprovalDecisionStatus;
  reason?: string;
}

export interface ApprovalDecision {
  id: string;
  taskId: string;
  requestedCapabilityIds: string[];
  status: ApprovalDecisionStatus;
  reason: string;
  createdAt: string;
  nonExecuting: true;
}

export interface TaskMatchingPolicy {
  exactCapabilityId: true;
  permissionScope: true;
  tags: true;
}

export interface HostInfo {
  crateName: "ardyn-host";
  responsibilities: string[];
}

export interface PlatformInfo {
  os: string;
  arch: string;
  family: string;
  isWindows: boolean;
  windowsFirst: true;
}

export interface StaticHandshake {
  schemaVersion: "0.1.0";
  phase: "phase-3-task-planning";
  manifest: {
    path: string | null;
    schemaVersion: "0.1.0";
    name: string;
    version: string;
    description: string | null;
  };
  runtime: {
    host: RuntimeHost;
    core: RuntimeCore;
    entrypoint: string | null;
  };
  host: HostInfo;
  platform: PlatformInfo;
  capabilities: ArdynCapability[];
  adapters: Record<string, ArdynAdapterConfig>;
  policies: ArdynPolicies;
  executionEnabled: false;
  toolExecutionEnabled: false;
  autonomousExecutionEnabled: false;
  productionToolExecutionEnabled: false;
  apiCallsEnabled: false;
  networkListening: false;
  longRunningServicesStarted: false;
  processesSpawned: false;
  pluginInstallEnabled: false;
  torrentDownloadEnabled: false;
  codePackEnablementEnabled: false;
  agentLoopEnabled: false;
}

export interface TaskPlan {
  schemaVersion: "0.1.0";
  phase: "phase-3-task-planning";
  manifest: {
    path: string | null;
    schemaVersion: "0.1.0";
    name: string;
    version: string;
    description: string | null;
  };
  taskPath: string | null;
  task: ArdynTask;
  requestedCapabilities: string[];
  duplicateRequestedCapabilities: string[];
  matchingPolicy: TaskMatchingPolicy;
  resolutions: TaskCapabilityResolution[];
  selectedCapabilities: ArdynCapability[];
  unresolvedRequests: string[];
  approval: TaskApprovalGate;
  approvalDecision: ApprovalDecision;
  plannerTrace: PlannerTrace;
  safety: NoExecutionSafetyFlags;
}

export interface PlannerTrace {
  taskIntake: {
    valid: true;
    errors: unknown[];
    taskId: string;
    requestedCapabilities: string[];
  };
  manifest: {
    id: string;
    version: string;
    schemaVersion: "0.1.0";
  };
  candidateCapabilities: Array<{
    request: string;
    candidates: TaskCapabilityCandidate[];
  }>;
  selectedCapabilities: string[];
  unresolvedRequests: string[];
  approvalDecision: ApprovalDecision;
  safety: NoExecutionSafetyFlags;
}

export interface ApprovalReviewArtifactCandidate {
  rank: number;
  capabilityId: string;
  matchType: Exclude<CapabilityMatchType, "no-match">;
  score: 300 | 200 | 100;
  scope: PermissionScope | null;
  tag: string | null;
  reason: string;
}

export interface ApprovalReviewArtifact {
  schema: "ardyn.approval-review-artifact";
  schemaVersion: "0.1.0";
  version: "0.1.0";
  generatedAt: string;
  nonExecuting: true;
  taskId: string;
  manifest: {
    id: string;
    version: string;
    schemaVersion: "0.1.0";
  };
  requestedCapabilityIds: string[];
  candidateRankings: Array<{
    request: string;
    candidates: ApprovalReviewArtifactCandidate[];
  }>;
  selectedCapabilities: string[];
  unresolvedRequests: string[];
  approvalDecision: ApprovalDecision;
  safety: NoExecutionSafetyFlags;
}

export interface ApprovalReviewArtifactOptions {
  generatedAt?: string;
}

export interface ApprovalReviewArtifactVersionValidation {
  valid: boolean;
  compatibility: ApprovalReviewArtifactCompatibility;
  errors: string[];
}

export interface ApprovalReviewArtifactDisplayCandidate {
  rank: unknown;
  capabilityId: string | null;
  matchType: string | null;
  score: unknown;
  scope: unknown;
  tag: unknown;
  reason: string | null;
}

export interface ApprovalReviewArtifactDisplayNormalization {
  compatibility: ApprovalReviewArtifactCompatibility;
  valid: boolean;
  validationErrors: unknown[];
  schema: string | null;
  schemaVersion: string | null;
  version: string | null;
  generatedAt: string | null;
  nonExecuting: boolean | null;
  taskId: string | null;
  manifest: {
    id: string | null;
    version: string | null;
    schemaVersion: string | null;
  };
  requestedCapabilityIds: string[];
  candidateRankings: Array<{
    request: string | null;
    candidates: ApprovalReviewArtifactDisplayCandidate[];
  }>;
  selectedCapabilities: string[];
  unresolvedRequests: string[];
  approvalDecision: {
    id: string | null;
    taskId: string | null;
    requestedCapabilityIds: string[];
    status: string | null;
    reason: string | null;
    createdAt: string | null;
    nonExecuting: boolean | null;
  };
  safety: Record<keyof NoExecutionSafetyFlags, unknown>;
  safetyFlagsAllFalse: boolean;
  unknownFields: string[];
  unknown: Record<string, unknown>;
}

export interface ApprovalReviewArtifactDisplaySummary {
  compatibility: ApprovalReviewArtifactCompatibility;
  valid: boolean;
  schema: string | null;
  schemaVersion: string | null;
  version: string | null;
  generatedAt: string | null;
  taskId: string | null;
  manifest: {
    id: string | null;
    version: string | null;
    schemaVersion: string | null;
  };
  approval: {
    status: string | null;
    reason: string | null;
    createdAt: string | null;
    nonExecuting: boolean | null;
  };
  counts: {
    requestedCapabilities: number;
    selectedCapabilities: number;
    unresolvedRequests: number;
    candidateRankings: number;
    candidates: number;
    unknownFields: number;
  };
  requestedCapabilityIds: string[];
  selectedCapabilities: string[];
  unresolvedRequests: string[];
  candidateRankings: Array<{
    request: string | null;
    candidateCount: number;
    topCandidate: {
      rank: unknown;
      capabilityId: string | null;
      matchType: string | null;
      score: unknown;
    } | null;
  }>;
  unknownFields: string[];
  safety: {
    nonExecuting: boolean | null;
    allFlagsFalse: boolean;
    flags: Record<keyof NoExecutionSafetyFlags, unknown>;
  };
  validationErrors: unknown[];
}

export interface HostPolicyReviewDecisionMetadata {
  status: string | null;
  approvalRecorded: boolean | null;
  rejectionRecorded: boolean | null;
  reviewMetadataOnly: boolean | null;
  approvalRuntimeEffectAllowed: boolean | null;
  rejectionRuntimeEffectAllowed: boolean | null;
}

export interface HostPolicyReviewDiagnosticsDisplay {
  warnings: string[];
  errors: string[];
}

export interface HostPolicyReviewRecordDisplayNormalization {
  schema: string | null;
  schemaVersion: string | null;
  recordPhase: string | null;
  reviewedPhase: string | null;
  policyMetadataSchema: string | null;
  policyMetadataVersion: string | null;
  policyMetadataDigestAlgorithm: string | null;
  policyMetadataDigestHex: string | null;
  policyContractVersion: string | null;
  runtimeStatus: string | null;
  nonExecutionInvariants: string[];
  declaredCompatibility: string | null;
  compatibility: HostPolicyReviewRecordCompatibility;
  valid: boolean;
  failClosed: boolean;
  validationErrors: string[];
  decision: HostPolicyReviewDecisionMetadata;
  diagnostics: HostPolicyReviewDiagnosticsDisplay;
  unknownFields: string[];
  unknown: Record<string, unknown>;
  reviewMetadataOnly: true;
  nonExecuting: true;
  safety: NoExecutionSafetyFlags;
}

export interface HostPolicyReviewRecordDisplaySummary {
  schema: string | null;
  schemaVersion: string | null;
  recordPhase: string | null;
  reviewedPhase: string | null;
  policy: {
    metadataSchema: string | null;
    metadataVersion: string | null;
    metadataDigestAlgorithm: string | null;
    metadataDigestHex: string | null;
    contractVersion: string | null;
  };
  runtimeStatus: string | null;
  nonExecutionInvariants: {
    count: number;
    values: string[];
    requiredValues: string[];
    exactRequiredSet: boolean;
  };
  compatibility: {
    declared: string | null;
    classification: HostPolicyReviewRecordCompatibility;
    valid: boolean;
    failClosed: boolean;
    validationErrors: string[];
  };
  decision: HostPolicyReviewDecisionMetadata;
  diagnostics: {
    warningCount: number;
    errorCount: number;
    warnings: string[];
    errors: string[];
  };
  unknownFields: string[];
  unknownFieldCount: number;
  reviewMetadataOnly: true;
  nonExecuting: true;
  safety: NoExecutionSafetyFlags;
}

export interface SchemaMigrationMetadataRecord {
  schema: "ardyn.schema-migration-metadata";
  schemaVersion: "0.1.0";
  artifactKind: SchemaMigrationArtifactKind;
  schemaId: string | null;
  artifactSchemaVersion: string | null;
  artifactVersion: string | null;
  currentSchemaVersion: "0.1.0";
  currentArtifactVersion: string | null;
  compatibility: SchemaMigrationCompatibility;
  migrationRequired: boolean;
  migrationAvailable: boolean;
  migrationNotes: string[];
  validationErrors: string[];
  nonExecuting: true;
}

export interface ReviewArtifactDigest {
  algorithm: "sha256";
  value: string;
  canonicalization: "ardyn.stable-json-display-v1";
}

export interface ReviewArtifactAttestationPlan {
  schema: "ardyn.review-artifact-attestation-plan";
  schemaVersion: "0.1.0";
  version: "0.1.0";
  nonExecuting: true;
  artifact: {
    kind: "approval_review_artifact";
    schemaId: string | null;
    schemaVersion: string | null;
    version: string | null;
    taskId: string | null;
    digest: ReviewArtifactDigest;
  };
  signer: {
    identity: string;
    placeholder: true;
    productionKeyAvailable: false;
  };
  signing: {
    algorithm: string;
    productionSigningEnabled: false;
    testFixtureOnly: boolean;
    realSigningPerformed: false;
    keysLoaded: false;
    notes: string[];
  };
  verification: {
    status: ReviewArtifactAttestationVerificationStatus;
    verified: false;
    reason: string;
  };
  migration: SchemaMigrationMetadataRecord;
  safety: NoExecutionSafetyFlags;
}

export interface ReviewArtifactAttestationPlanOptions {
  verificationStatus?: ReviewArtifactAttestationVerificationStatus;
  signerIdentity?: string;
  signingAlgorithm?: string;
}

export interface MigrationAttestationDisplaySummary {
  schema: "ardyn.migration-attestation-display-summary";
  schemaVersion: "0.1.0";
  artifactKind: SchemaMigrationArtifactKind;
  compatibility: SchemaMigrationCompatibility;
  migrationRequired: boolean;
  migrationAvailable: boolean;
  migrationNotes: string[];
  attestation: {
    schema: "ardyn.review-artifact-attestation-plan";
    schemaVersion: "0.1.0";
    digest: ReviewArtifactDigest;
    signerIdentity: string;
    verificationStatus: ReviewArtifactAttestationVerificationStatus;
    productionSigningEnabled: false;
    keysLoaded: false;
    realSigningPerformed: false;
  } | null;
  warnings: string[];
  unknownFields: string[];
  nonExecuting: true;
  safety: NoExecutionSafetyFlags;
}

export type ApprovalReviewArtifactDifferenceType =
  | "task-mismatch"
  | "manifest-mismatch"
  | "requested-capabilities-change"
  | "selected-capabilities-change"
  | "unresolved-requests-change"
  | "approval-requested-capabilities-change"
  | "approval-status-change"
  | "candidate-rankings-change";

export interface ApprovalReviewArtifactDifference {
  type: ApprovalReviewArtifactDifferenceType;
  path: string;
  left: unknown;
  right: unknown;
  added?: string[];
  removed?: string[];
}

export interface ApprovalReviewArtifactComparison {
  equal: boolean;
  differenceCount: number;
  differences: ApprovalReviewArtifactDifference[];
  nonExecuting: true;
  safety: NoExecutionSafetyFlags;
}

export type HostPolicyReviewRecordDifferenceType =
  | "record-kind-mismatch"
  | "record-version-mismatch"
  | "record-phase-mismatch"
  | "reviewed-phase-mismatch"
  | "policy-contract-version-mismatch"
  | "policy-metadata-mismatch"
  | "policy-metadata-digest-mismatch"
  | "runtime-status-mismatch"
  | "non-execution-invariants-change"
  | "compatibility-classification-change"
  | "decision-status-change"
  | "decision-metadata-change"
  | "diagnostic-warnings-change"
  | "diagnostic-errors-change";

export interface HostPolicyReviewRecordDifference {
  type: HostPolicyReviewRecordDifferenceType;
  path: string;
  left: unknown;
  right: unknown;
  added?: string[];
  removed?: string[];
  reviewEvidenceOnly: true;
  grantsRuntimeApproval: false;
}

export interface HostPolicyReviewRecordComparison {
  schema: "ardyn.host-policy-review-record-comparison";
  schemaVersion: "0.1.0";
  comparisonPhase: "phase-4.0g-host-policy-review-comparison";
  artifactKind: "host_policy_review_record";
  equal: boolean;
  differenceCount: number;
  failClosed: boolean;
  manualReviewRequired: boolean;
  comparisonDecision: {
    reviewMetadataOnly: true;
    runtimeApprovalGranted: false;
    runtimeApprovalDerivedFromComparison: false;
    approvalMetadataInert: true;
    rejectionMetadataInert: true;
    futureLiveRuntimeBlockedUntilSeparateApprovedPhase: true;
  };
  left: HostPolicyReviewRecordDisplaySummary;
  right: HostPolicyReviewRecordDisplaySummary;
  differences: HostPolicyReviewRecordDifference[];
  nonExecuting: true;
  safety: NoExecutionSafetyFlags;
}

export type ApprovalReviewArtifactComparisonSource =
  | TaskPlan
  | PlannerTrace
  | ApprovalReviewArtifact;

export function assertLocalFilePath(filePath: string, label?: string): void;
export function assertLocalJsonFilePath(filePath: string, label?: string): void;
export function readLocalJsonFile(filePath: string, label?: string): Promise<unknown>;
export function loadManifest(manifestPath: string): Promise<ArdynManifest>;
export function loadTask(taskPath: string): Promise<ArdynTask>;
export function validateManifest(manifest: unknown): ValidationResult;
export function validateTask(task: unknown): ValidationResult;
export function validateSessionEvent(event: unknown): ValidationResult;
export function validateSessionTranscript(transcript: unknown): ValidationResult;
export function classifySessionTranscript(
  transcript: unknown
): SessionTranscriptClassificationResult;
export function buildSessionTranscriptSummary(transcript: unknown): SessionTranscriptSummary;
export function explainSessionTranscript(transcript: unknown): SessionTranscriptExplanation;
export function classifySessionTranscriptCompatibility(
  transcript: unknown
): SessionTranscriptCompatibilityResult;
export function buildSessionTranscriptMigrationMetadata(
  transcript: unknown
): SessionTranscriptMigrationMetadata;
export function buildSessionTranscriptDisplaySummary(
  transcript: unknown
): SessionTranscriptDisplaySummary;
export function explainSessionTranscriptCompatibility(
  transcript: unknown
): SessionTranscriptCompatibilityExplanation;
export function validateApprovalReviewArtifact(artifact: unknown): ValidationResult;
export function validateApprovalReviewArtifactVersion(
  artifact: unknown
): ApprovalReviewArtifactVersionValidation;
export function classifyApprovalReviewArtifactCompatibility(
  artifact: unknown
): ApprovalReviewArtifactCompatibility;
export function normalizeApprovalReviewArtifactForDisplay(
  artifact: unknown
): ApprovalReviewArtifactDisplayNormalization;
export function buildApprovalReviewArtifactDisplaySummary(
  artifact: unknown
): ApprovalReviewArtifactDisplaySummary;
export function classifyHostPolicyReviewRecordCompatibility(
  record: unknown
): HostPolicyReviewRecordCompatibility;
export function normalizeHostPolicyReviewRecordForDisplay(
  record: unknown
): HostPolicyReviewRecordDisplayNormalization;
export function buildHostPolicyReviewRecordDisplaySummary(
  record: unknown
): HostPolicyReviewRecordDisplaySummary;
export function compareHostPolicyReviewRecords(
  left: unknown,
  right: unknown
): HostPolicyReviewRecordComparison;
export function formatHostPolicyReviewRecordComparisonJson(
  comparison: HostPolicyReviewRecordComparison
): string;
export function classifyArtifactSchemaMetadata(
  artifactKind: SchemaMigrationArtifactKind,
  artifact: unknown
): SchemaMigrationCompatibility;
export function buildSchemaMigrationMetadataRecord(
  artifactKind: SchemaMigrationArtifactKind,
  artifact: unknown
): SchemaMigrationMetadataRecord;
export function digestApprovalReviewArtifact(artifact: unknown): ReviewArtifactDigest;
export function buildReviewArtifactAttestationPlan(
  artifact: unknown,
  options?: ReviewArtifactAttestationPlanOptions
): ReviewArtifactAttestationPlan;
export function buildMigrationAttestationDisplaySummary(
  artifactKind: SchemaMigrationArtifactKind,
  artifact: unknown,
  options?: ReviewArtifactAttestationPlanOptions
): MigrationAttestationDisplaySummary;
export function createNoExecutionSafetyFlags(): NoExecutionSafetyFlags;
export function supportedTaskCapabilityScopes(): PermissionScope[];
export function isSupportedPermissionScope(value: string): value is PermissionScope;
export function normalizeCapabilities(manifest: ArdynManifest): ArdynCapability[];
export function resolveTaskCapabilities(
  manifest: ArdynManifest,
  requestedCapabilities: string[]
): ResolvedTaskCapabilities;
export function createTaskPlan(
  manifest: ArdynManifest,
  task: ArdynTask,
  options?: {
    manifestPath?: string;
    taskPath?: string;
    createdAt?: string;
    approvalDecision?: ApprovalDecisionInput;
  }
): TaskPlan;
export function createStdioDryRunSessionEvents(
  manifest: ArdynManifest,
  task: ArdynTask,
  options?: StdioDryRunSessionEventOptions
): SessionEvent[];
export function formatSessionEventsJsonl(events: SessionEvent[]): string;
export function formatJsonlWholeLinesForReview(records: Record<string, unknown>[]): string;
export function validateJsonlWholeLineBundle(jsonl: string): JsonlWholeLineBundleValidation;
export function redactStderrDiagnosticForReview(
  diagnostic: StaticStderrDiagnosticInput
): StaticStderrDiagnosticRedactionReview;
export function classifyRedactionSafety(
  diagnostic: StaticStderrDiagnosticInput
): StderrRedactionSafetyClassification;
export function createStdioFramingRedactionContractForReview(): StdioFramingRedactionContract;
export function formatStdioFramingRedactionContractJsonForReview(): string;
export function createTranscriptPersistenceContractForReview(
  transcript: unknown,
  options?: {
    sourceEventStreamReference?: string;
    persistedAt?: string;
  }
): TranscriptPersistenceContract;
export function createTranscriptReplayContractForReview(
  persistenceContract: TranscriptPersistenceContract
): TranscriptReplayContract;
export function createTranscriptReplayCompatibilityRecordForReview(
  transcript: unknown,
  options?: {
    sourceEventStreamReference?: string;
    persistedAt?: string;
    replayCompatibilityClassification?: TranscriptReplayCompatibilityClassification;
    failureReasons?: string[];
  }
): TranscriptReplayCompatibilityRecord;
export function classifyTranscriptReplayCompatibilityForReview(
  record: unknown
): TranscriptReplayCompatibilityClassificationResult;
export function formatTranscriptPersistenceContractJsonForReview(
  transcript: unknown,
  options?: {
    sourceEventStreamReference?: string;
    persistedAt?: string;
  }
): string;
export function formatTranscriptReplayContractJsonForReview(
  persistenceContract: TranscriptPersistenceContract
): string;
export function formatTranscriptReplayCompatibilityRecordJsonForReview(
  transcript: unknown,
  options?: {
    sourceEventStreamReference?: string;
    persistedAt?: string;
    replayCompatibilityClassification?: TranscriptReplayCompatibilityClassification;
    failureReasons?: string[];
  }
): string;
export function createApprovalReviewArtifact(
  source: TaskPlan | PlannerTrace,
  options?: ApprovalReviewArtifactOptions
): ApprovalReviewArtifact;
export function compareApprovalReviewArtifacts(
  left: ApprovalReviewArtifactComparisonSource,
  right: ApprovalReviewArtifactComparisonSource
): ApprovalReviewArtifactComparison;
export function createHostInfo(): HostInfo;
export function platformFamilyForNodePlatform(platform: string): "windows" | "unix";
export function createPlatformInfo(platform?: string, arch?: string): PlatformInfo;
export function createStaticIdentity(): object;
export function createStaticHandshake(
  manifest: ArdynManifest,
  options?: { manifestPath?: string }
): StaticHandshake;
export function createStaticHandshakeFromPath(manifestPath: string): Promise<StaticHandshake>;
export function createDoctorReport(): object;
export function manifestPathToUrl(manifestPath: string): string;
