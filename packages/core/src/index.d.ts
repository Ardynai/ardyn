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
export const ARDYN_FAILURE_AUDIT_CONTRACT_PHASE:
  "phase-4.1e-failure-audit-kill-semantics";
export const FAILURE_AUDIT_RECORD_SCHEMA: "ardyn.failure-audit-record";
export const FAILURE_AUDIT_CONTRACT_VERSION: "0.1.0";
export const FAILURE_AUDIT_STATIC_CONTRACT_ONLY: "static_contract_only";
export const FAILURE_AUDIT_CLEAN_FAILURE: "clean_failure";
export const FAILURE_AUDIT_REDACTED_FAILURE: "redacted_failure";
export const FAILURE_AUDIT_UNREDACTABLE_FAILURE: "unredactable_failure";
export const FAILURE_AUDIT_TERMINAL_COMPLETED: "terminal_completed";
export const FAILURE_AUDIT_TERMINAL_FAILED: "terminal_failed";
export const FAILURE_AUDIT_TERMINAL_ABORTED: "terminal_aborted";
export const FAILURE_AUDIT_TERMINAL_REJECTED: "terminal_rejected";
export const FAILURE_AUDIT_NONZERO_EXIT_EXPECTED: "nonzero_exit_expected";
export const FAILURE_AUDIT_NONZERO_EXIT_UNEXPECTED: "nonzero_exit_unexpected";
export const FAILURE_AUDIT_CLEANUP_REQUIRED: "cleanup_required";
export const FAILURE_AUDIT_CLEANUP_NOT_AVAILABLE: "cleanup_not_available";
export const FAILURE_AUDIT_RUNTIME_UNAVAILABLE: "runtime_unavailable";
export const FAILURE_AUDIT_MALFORMED: "malformed";
export const FAILURE_AUDIT_UNSUPPORTED_MAJOR: "unsupported_major";
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
export const REVIEW_ONLY_RUNTIME_APPROVAL_EVALUATOR_SCHEMA:
  "ardyn.phase-5.18.review-only-approval-evaluator-result";
export const REVIEW_ONLY_RUNTIME_APPROVAL_EVALUATOR_VERSION: "0.1.0";
export const REVIEW_ONLY_RUNTIME_APPROVAL_EVALUATOR_KIND:
  "review-only-runtime-approval-evaluator";
export const APPROVAL_PREREQUISITE_READER_SCHEMA:
  "ardyn.phase-5.19.approval-prerequisite-reader-result";
export const APPROVAL_PREREQUISITE_READER_VERSION: "0.1.0";
export const APPROVAL_PREREQUISITE_READER_KIND: "approval-prerequisite-reader";
export const APPROVAL_PREREQUISITE_SOURCE_PREFLIGHT_SCHEMA:
  "ardyn.phase-5.20.approval-prerequisite-source-preflight-result";
export const APPROVAL_PREREQUISITE_SOURCE_PREFLIGHT_VERSION: "0.1.0";
export const APPROVAL_PREREQUISITE_SOURCE_PREFLIGHT_KIND:
  "approval-prerequisite-source-ingestion-preflight";
export const APPROVAL_PREREQUISITE_SOURCE_SELECTION_SCHEMA:
  "ardyn.phase-5.21.approval-prerequisite-source-selection-result";
export const APPROVAL_PREREQUISITE_SOURCE_SELECTION_VERSION: "0.1.0";
export const APPROVAL_PREREQUISITE_SOURCE_SELECTION_KIND:
  "approval-prerequisite-source-selection";
export const APPROVAL_PREREQUISITE_SOURCE_BUNDLE_SCHEMA:
  "ardyn.phase-5.22.approval-prerequisite-source-bundle-result";
export const APPROVAL_PREREQUISITE_SOURCE_BUNDLE_VERSION: "0.1.0";
export const APPROVAL_PREREQUISITE_SOURCE_BUNDLE_KIND:
  "approval-prerequisite-source-bundle";
export const APPROVAL_PREREQUISITE_BUNDLE_CONSUMPTION_CHECKPOINT_SCHEMA:
  "ardyn.phase-5.23.approval-prerequisite-bundle-consumption-checkpoint-result";
export const APPROVAL_PREREQUISITE_BUNDLE_CONSUMPTION_CHECKPOINT_VERSION:
  "0.1.0";
export const APPROVAL_PREREQUISITE_BUNDLE_CONSUMPTION_CHECKPOINT_KIND:
  "approval-prerequisite-bundle-consumption-checkpoint";
export const APPROVAL_PREREQUISITE_INTEGRATION_CHECKPOINT_SCHEMA:
  "ardyn.phase-5.24.approval-prerequisite-integration-checkpoint-result";
export const APPROVAL_PREREQUISITE_INTEGRATION_CHECKPOINT_VERSION: "0.1.0";
export const APPROVAL_PREREQUISITE_INTEGRATION_CHECKPOINT_KIND:
  "approval-prerequisite-evaluation-integration-checkpoint";
export const PREREQUISITE_REVIEW_ARTIFACT_BOUNDARY_SCHEMA:
  "ardyn.phase-5.25.prerequisite-review-artifact-boundary-result";
export const PREREQUISITE_REVIEW_ARTIFACT_BOUNDARY_VERSION: "0.1.0";
export const PREREQUISITE_REVIEW_ARTIFACT_BOUNDARY_KIND:
  "non-authorizing-prerequisite-review-artifact-boundary";
export const PREREQUISITE_REVIEW_ARTIFACT_EVALUATOR_INPUT_HANDOFF_SCHEMA:
  "ardyn.phase-5.26.prerequisite-review-artifact-evaluator-input-handoff-result";
export const PREREQUISITE_REVIEW_ARTIFACT_EVALUATOR_INPUT_HANDOFF_VERSION:
  "0.1.0";
export const PREREQUISITE_REVIEW_ARTIFACT_EVALUATOR_INPUT_HANDOFF_KIND:
  "review-artifact-evaluator-input-handoff";
export const APPROVAL_EVALUATOR_CANDIDATE_INTAKE_CHECKPOINT_SCHEMA:
  "ardyn.phase-5.27.approval-evaluator-candidate-intake-checkpoint-result";
export const APPROVAL_EVALUATOR_CANDIDATE_INTAKE_CHECKPOINT_VERSION: "0.1.0";
export const APPROVAL_EVALUATOR_CANDIDATE_INTAKE_CHECKPOINT_KIND:
  "approval-evaluator-candidate-intake-checkpoint";
export const REVIEW_ONLY_EVALUATOR_PREFLIGHT_CHECKPOINT_SCHEMA:
  "ardyn.phase-5.28.review-only-evaluator-preflight-checkpoint-result";
export const REVIEW_ONLY_EVALUATOR_PREFLIGHT_CHECKPOINT_VERSION: "0.1.0";
export const REVIEW_ONLY_EVALUATOR_PREFLIGHT_CHECKPOINT_KIND:
  "review-only-evaluator-preflight-checkpoint";
export const NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_BOUNDARY_SCHEMA:
  "ardyn.phase-5.29.non-authorizing-evaluator-decision-candidate-boundary-result";
export const NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_BOUNDARY_VERSION:
  "0.1.0";
export const NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_BOUNDARY_KIND:
  "non-authorizing-evaluator-decision-candidate-boundary";
export const NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_ARTIFACT_SCHEMA:
  "ardyn.phase-5.30.non-authorizing-evaluator-decision-candidate-inspection-artifact-result";
export const NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_ARTIFACT_VERSION:
  "0.1.0";
export const NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_ARTIFACT_KIND:
  "non-authorizing-evaluator-decision-candidate-inspection-artifact";
export const HUMAN_TOOL_INSPECTION_DISPOSITION_BOUNDARY_SCHEMA:
  "ardyn.phase-5.31.human-tool-inspection-disposition-boundary-result";
export const HUMAN_TOOL_INSPECTION_DISPOSITION_BOUNDARY_VERSION: "0.1.0";
export const HUMAN_TOOL_INSPECTION_DISPOSITION_BOUNDARY_KIND:
  "human-tool-inspection-disposition-boundary";
export const REVIEW_ONLY_DISPOSITION_AGGREGATION_CHECKPOINT_SCHEMA:
  "ardyn.phase-5.32.review-only-disposition-aggregation-checkpoint-result";
export const REVIEW_ONLY_DISPOSITION_AGGREGATION_CHECKPOINT_VERSION: "0.1.0";
export const REVIEW_ONLY_DISPOSITION_AGGREGATION_CHECKPOINT_KIND:
  "review-only-disposition-aggregation-checkpoint";
export const REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_SCHEMA:
  "ardyn.phase-5.33.review-only-aggregation-inspection-handoff-result";
export const REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_VERSION: "0.1.0";
export const REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_KIND:
  "review-only-aggregation-inspection-handoff";
export const REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_SCHEMA:
  "ardyn.phase-5.34.review-only-handoff-readiness-artifact-result";
export const REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_VERSION: "0.1.0";
export const REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_KIND:
  "review-only-handoff-readiness-artifact";
export const REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_SCHEMA:
  "ardyn.phase-5.35.review-only-readiness-inspection-checkpoint-result";
export const REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_VERSION: "0.1.0";
export const REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_KIND:
  "review-only-readiness-inspection-checkpoint";
export const REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_BOUNDARY_SCHEMA:
  "ardyn.phase-5.36.review-only-readiness-handoff-disposition-boundary-result";
export const REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_BOUNDARY_VERSION:
  "0.1.0";
export const REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_BOUNDARY_KIND:
  "review-only-readiness-handoff-disposition-boundary";
export const REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_SCHEMA:
  "ardyn.phase-5.37.review-only-handoff-disposition-inspection-checkpoint-result";
export const REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_VERSION:
  "0.1.0";
export const REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_KIND:
  "review-only-handoff-disposition-inspection-checkpoint";
export const REVIEW_ONLY_INSPECTION_HANDOFF_METADATA_BOUNDARY_SCHEMA:
  "ardyn.phase-5.38.review-only-inspection-handoff-metadata-boundary-result";
export const REVIEW_ONLY_INSPECTION_HANDOFF_METADATA_BOUNDARY_VERSION:
  "0.1.0";
export const REVIEW_ONLY_INSPECTION_HANDOFF_METADATA_BOUNDARY_KIND:
  "review-only-inspection-handoff-metadata-boundary";
export const REVIEW_ONLY_INSPECTION_HANDOFF_CHECKPOINT_SCHEMA:
  "ardyn.phase-5.39.review-only-inspection-handoff-checkpoint-result";
export const REVIEW_ONLY_INSPECTION_HANDOFF_CHECKPOINT_VERSION: "0.1.0";
export const REVIEW_ONLY_INSPECTION_HANDOFF_CHECKPOINT_KIND:
  "review-only-inspection-handoff-checkpoint";
export const REVIEW_ONLY_CHECKPOINT_HANDOFF_LAYER_SCHEMA:
  "ardyn.phase-5.40.review-only-checkpoint-handoff-layer-result";
export const REVIEW_ONLY_CHECKPOINT_HANDOFF_LAYER_VERSION: "0.1.0";
export const REVIEW_ONLY_CHECKPOINT_HANDOFF_LAYER_KIND:
  "review-only-checkpoint-handoff-layer";
export const REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_SCHEMA:
  "ardyn.phase-5.41.review-only-metadata-handoff-checkpoint-result";
export const REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_VERSION: "0.1.0";
export const REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_KIND:
  "review-only-metadata-handoff-checkpoint";
export const REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_SCHEMA:
  "ardyn.phase-5.42.review-only-handoff-metadata-consolidation-layer-result";
export const REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_VERSION: "0.1.0";
export const REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_KIND:
  "review-only-handoff-metadata-consolidation-layer";
export const REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_SCHEMA:
  "ardyn.phase-5.43.review-only-consolidation-checkpoint-handoff-result";
export const REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_VERSION: "0.1.0";
export const REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_KIND:
  "review-only-consolidation-checkpoint-handoff";
export const REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_SCHEMA:
  "ardyn.phase-5.44.review-only-consolidation-metadata-checkpoint-result";
export const REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_VERSION: "0.1.0";
export const REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_KIND:
  "review-only-consolidation-metadata-checkpoint";
export const TARGET_CONSUMER_PLANNING_METADATA_SCHEMA:
  "ardyn.phase-5.45.target-consumer-planning-metadata-result";
export const TARGET_CONSUMER_PLANNING_METADATA_VERSION: "0.1.0";
export const TARGET_CONSUMER_PLANNING_METADATA_KIND:
  "target-consumer-planning-metadata";
export const CONSUMER_CONTRACT_READINESS_MATRIX_SCHEMA:
  "ardyn.phase-5.46.consumer-contract-readiness-matrix-result";
export const CONSUMER_CONTRACT_READINESS_MATRIX_VERSION: "0.1.0";
export const CONSUMER_CONTRACT_READINESS_MATRIX_KIND:
  "consumer-contract-readiness-matrix";

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

export type FailureAuditClassification =
  | "static_contract_only"
  | "clean_failure"
  | "redacted_failure"
  | "unredactable_failure"
  | "terminal_completed"
  | "terminal_failed"
  | "terminal_aborted"
  | "terminal_rejected"
  | "nonzero_exit_expected"
  | "nonzero_exit_unexpected"
  | "cleanup_required"
  | "cleanup_not_available"
  | "runtime_unavailable"
  | "malformed"
  | "unsupported_major";

export interface FailureAuditRuntimeEffect {
  currentContractEnablesRuntime: false;
  runtimeImplementationAvailable: false;
  runtimeCommandAvailable: false;
  failureAuditCommandAvailable: false;
  failureAuditRuntimeAvailable: false;
  cleanupRuntimeAvailable: false;
  processKillAvailable: false;
  processControlAvailable: false;
  signalHandlerAvailable: false;
  signalHandlingRuntimeAvailable: false;
  exitHandlerAvailable: false;
  exitMappingRuntimeAvailable: false;
  timeoutRuntimeAvailable: false;
  processStdioOwnershipAvailable: false;
  stdinReaderAvailable: false;
  stdoutWriterAvailable: false;
  stderrWriterAvailable: false;
  transcriptPersistenceRuntimeAvailable: false;
  transcriptReplayRuntimeAvailable: false;
  approvalEvaluatorAvailable: false;
  listenerAvailable: false;
  serverAvailable: false;
  subprocessSpawningAvailable: false;
  writesFiles: false;
  readsFiles: false;
  runsRuntime: false;
  consumedByLiveHostLoop: false;
  grantsRuntimeApproval: false;
}

export interface FailureAuditRecord {
  schema: "ardyn.failure-audit-record";
  schemaVersion: string;
  recordKind: "failure-audit-record";
  recordPhase: "phase-4.1e-failure-audit-kill-semantics";
  reviewedPhase: "4.1E";
  sourcePhase: string;
  classification: FailureAuditClassification;
  failureCategory: string;
  terminalState: string;
  exitCodeClassification: string;
  exitCodeMapping: {
    code: number;
    classification: string;
    deterministic: true;
    policyOnly: true;
  };
  terminalStateRules: Record<string, unknown>;
  stdoutCommitBoundary: Record<string, unknown>;
  nonzeroExitMappingRules: Record<string, unknown>;
  stderrDiagnosticClassification: string;
  stderrDiagnostic: {
    code: string;
    message: string;
  };
  redactionStatus: string;
  redactions: StaticStderrDiagnosticRedaction[];
  cleanupRequirement: Record<string, unknown>;
  killInterruptTimeoutSemantics: Record<string, unknown>;
  transcriptPersistenceReplayImpact: Record<string, unknown>;
  runtimeAvailabilityStatus: "runtime_unavailable";
  runtimeEffect: FailureAuditRuntimeEffect;
  nonExecutionInvariantSummary: string[];
  failClosed: boolean;
  failureReasons: string[];
  recordDigest: TranscriptDigestRecord;
  audit: Record<string, unknown>;
}

export interface FailureAuditClassificationResult {
  schema: "ardyn.failure-audit-classification";
  schemaVersion: "0.1.0";
  phase: "phase-4.1e-failure-audit-kill-semantics";
  classification: FailureAuditClassification;
  valid: boolean;
  failClosed: boolean;
  failureAuditRuntimeAvailable: false;
  cleanupRuntimeAvailable: false;
  processKillAvailable: false;
  processControlAvailable: false;
  runtimeCommandAvailable: false;
  errors: string[];
  failureReasons: string[];
  reviewOnly: true;
  runtimeEffect: FailureAuditRuntimeEffect;
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

export type ReviewOnlyApprovalPrerequisiteStatus =
  | "missing"
  | "invalid"
  | "malformed"
  | "revoked"
  | "duplicate"
  | "stale"
  | "valid";
export type ApprovalPrerequisiteReaderClassification =
  | "missing_prerequisite_record_rejected"
  | "malformed_prerequisite_record_rejected"
  | "revoked_prerequisite_record_rejected"
  | "valid_prerequisite_records_review_only_runtime_still_blocked"
  | "duplicate_prerequisite_record_rejected"
  | "stale_prerequisite_record_rejected"
  | "unknown_prerequisite_record_rejected";
export type ReviewOnlyApprovalEvaluatorClassification =
  | "missing_prerequisite_record_rejected"
  | "invalid_prerequisite_record_rejected"
  | "revoked_prerequisite_record_rejected"
  | "valid_prerequisites_review_only_runtime_still_blocked";
export type ApprovalPrerequisiteSourcePreflightClassification =
  | "missing_prerequisite_source_input_rejected"
  | "malformed_prerequisite_source_input_rejected"
  | "empty_prerequisite_source_input_rejected"
  | "duplicate_prerequisite_source_input_rejected"
  | "stale_prerequisite_source_input_rejected"
  | "unknown_prerequisite_source_input_rejected"
  | "revoked_prerequisite_source_input_rejected"
  | "valid_prerequisite_source_input_review_only_runtime_still_blocked";
export type ApprovalPrerequisiteSourceSelectionClassification =
  | "missing_prerequisite_source_selection_rejected"
  | "malformed_prerequisite_source_selection_rejected"
  | "empty_prerequisite_source_selection_rejected"
  | "duplicate_prerequisite_source_selection_rejected"
  | "stale_prerequisite_source_selection_rejected"
  | "unknown_prerequisite_source_selection_rejected"
  | "revoked_prerequisite_source_selection_rejected"
  | "conflicting_valid_prerequisite_sources_rejected"
  | "valid_prerequisite_source_selected_review_only_runtime_still_blocked"
  | "equivalent_prerequisite_sources_selected_review_only_runtime_still_blocked";
export type ApprovalPrerequisiteSourceBundleClassification =
  | "missing_prerequisite_source_bundle_parts_rejected"
  | "missing_required_prerequisite_source_bundle_part_rejected"
  | "malformed_prerequisite_source_bundle_part_rejected"
  | "valid_prerequisite_source_bundle_review_only_runtime_still_blocked"
  | "duplicate_equivalent_prerequisite_source_bundle_parts_review_only_runtime_still_blocked"
  | "conflicting_prerequisite_source_bundle_parts_rejected"
  | "stale_prerequisite_source_bundle_rejected"
  | "revoked_prerequisite_source_bundle_rejected"
  | "unknown_prerequisite_source_bundle_rejected"
  | "malformed_prerequisite_source_bundle_rejected"
  | "empty_prerequisite_source_bundle_rejected";
export type ApprovalPrerequisiteBundleConsumptionCheckpointClassification =
  | "missing_prerequisite_bundle_consumption_rejected"
  | "malformed_prerequisite_bundle_consumption_rejected"
  | "conflicting_prerequisite_bundle_consumption_rejected"
  | "valid_prerequisite_bundle_consumed_for_review_only_runtime_still_blocked";
export type ApprovalPrerequisiteIntegrationCheckpointClassification =
  | "missing_prerequisite_integration_input_rejected"
  | "malformed_prerequisite_integration_input_rejected"
  | "empty_prerequisite_integration_input_rejected"
  | "duplicate_prerequisite_integration_input_rejected"
  | "conflicting_prerequisite_integration_input_rejected"
  | "stale_prerequisite_integration_input_rejected"
  | "revoked_prerequisite_integration_input_rejected"
  | "unknown_prerequisite_integration_input_rejected"
  | "valid_prerequisite_integration_review_summary_runtime_still_blocked";
export type PrerequisiteReviewArtifactBoundaryClassification =
  | "missing_prerequisite_review_artifact_input_rejected"
  | "malformed_prerequisite_review_artifact_input_rejected"
  | "empty_prerequisite_review_artifact_input_rejected"
  | "duplicate_invalid_prerequisite_review_artifact_input_rejected"
  | "conflicting_prerequisite_review_artifact_input_rejected"
  | "stale_prerequisite_review_artifact_input_rejected"
  | "revoked_prerequisite_review_artifact_input_rejected"
  | "unknown_prerequisite_review_artifact_input_rejected"
  | "valid_prerequisite_review_artifact_non_authorizing_runtime_still_blocked";
export type ReviewArtifactEvaluatorInputHandoffClassification =
  | "missing_review_artifact_evaluator_input_handoff_rejected"
  | "malformed_review_artifact_evaluator_input_handoff_rejected"
  | "empty_review_artifact_evaluator_input_handoff_rejected"
  | "conflicting_review_artifact_evaluator_input_handoff_rejected"
  | "stale_review_artifact_evaluator_input_handoff_rejected"
  | "revoked_review_artifact_evaluator_input_handoff_rejected"
  | "unknown_review_artifact_evaluator_input_handoff_rejected"
  | "duplicate_invalid_review_artifact_evaluator_input_handoff_rejected"
  | "authorizing_review_artifact_evaluator_input_handoff_rejected"
  | "valid_review_artifact_evaluator_input_candidate_runtime_still_blocked";
export type ApprovalEvaluatorCandidateIntakeCheckpointClassification =
  | "missing_approval_evaluator_candidate_intake_input_rejected"
  | "malformed_approval_evaluator_candidate_intake_input_rejected"
  | "empty_approval_evaluator_candidate_intake_input_rejected"
  | "conflicting_approval_evaluator_candidate_intake_input_rejected"
  | "stale_approval_evaluator_candidate_intake_input_rejected"
  | "revoked_approval_evaluator_candidate_intake_input_rejected"
  | "unknown_approval_evaluator_candidate_intake_input_rejected"
  | "duplicate_invalid_approval_evaluator_candidate_intake_input_rejected"
  | "authorizing_approval_evaluator_candidate_intake_input_rejected"
  | "runtime_effect_true_approval_evaluator_candidate_intake_input_rejected"
  | "process_flag_true_approval_evaluator_candidate_intake_input_rejected"
  | "unsafe_approval_evaluator_candidate_intake_input_rejected"
  | "valid_approval_evaluator_candidate_intake_checkpoint_runtime_still_blocked";
export type ReviewOnlyEvaluatorPreflightCheckpointClassification =
  | "missing_review_only_evaluator_preflight_checkpoint_input_rejected"
  | "malformed_review_only_evaluator_preflight_checkpoint_input_rejected"
  | "empty_review_only_evaluator_preflight_checkpoint_input_rejected"
  | "conflicting_review_only_evaluator_preflight_checkpoint_input_rejected"
  | "stale_review_only_evaluator_preflight_checkpoint_input_rejected"
  | "revoked_review_only_evaluator_preflight_checkpoint_input_rejected"
  | "unknown_review_only_evaluator_preflight_checkpoint_input_rejected"
  | "duplicate_invalid_review_only_evaluator_preflight_checkpoint_input_rejected"
  | "authorizing_review_only_evaluator_preflight_checkpoint_input_rejected"
  | "grant_looking_review_only_evaluator_preflight_checkpoint_input_rejected"
  | "runtime_permission_looking_review_only_evaluator_preflight_checkpoint_input_rejected"
  | "command_exposure_looking_review_only_evaluator_preflight_checkpoint_input_rejected"
  | "runtime_effect_true_review_only_evaluator_preflight_checkpoint_input_rejected"
  | "process_flag_true_review_only_evaluator_preflight_checkpoint_input_rejected"
  | "unsafe_review_only_evaluator_preflight_checkpoint_input_rejected"
  | "execution_signal_looking_review_only_evaluator_preflight_checkpoint_input_rejected"
  | "valid_review_only_evaluator_preflight_checkpoint_runtime_still_blocked";
export type NonAuthorizingEvaluatorDecisionCandidateClassification =
  | "missing_non_authorizing_evaluator_decision_candidate_input_rejected"
  | "malformed_non_authorizing_evaluator_decision_candidate_input_rejected"
  | "empty_non_authorizing_evaluator_decision_candidate_input_rejected"
  | "conflicting_non_authorizing_evaluator_decision_candidate_input_rejected"
  | "stale_non_authorizing_evaluator_decision_candidate_input_rejected"
  | "revoked_non_authorizing_evaluator_decision_candidate_input_rejected"
  | "unknown_non_authorizing_evaluator_decision_candidate_input_rejected"
  | "duplicate_invalid_non_authorizing_evaluator_decision_candidate_input_rejected"
  | "authorizing_non_authorizing_evaluator_decision_candidate_input_rejected"
  | "grant_looking_non_authorizing_evaluator_decision_candidate_input_rejected"
  | "approval_decision_looking_non_authorizing_evaluator_decision_candidate_input_rejected"
  | "approval_grant_looking_non_authorizing_evaluator_decision_candidate_input_rejected"
  | "runtime_permission_looking_non_authorizing_evaluator_decision_candidate_input_rejected"
  | "command_exposure_looking_non_authorizing_evaluator_decision_candidate_input_rejected"
  | "evaluator_execution_looking_non_authorizing_evaluator_decision_candidate_input_rejected"
  | "runtime_effect_true_non_authorizing_evaluator_decision_candidate_input_rejected"
  | "process_flag_true_non_authorizing_evaluator_decision_candidate_input_rejected"
  | "unsafe_non_authorizing_evaluator_decision_candidate_input_rejected"
  | "execution_signal_looking_non_authorizing_evaluator_decision_candidate_input_rejected"
  | "valid_non_authorizing_evaluator_decision_candidate_runtime_still_blocked";
export type NonAuthorizingEvaluatorDecisionCandidateInspectionArtifactClassification =
  | "missing_non_authorizing_evaluator_decision_candidate_inspection_artifact_input_rejected"
  | "malformed_non_authorizing_evaluator_decision_candidate_inspection_artifact_input_rejected"
  | "empty_non_authorizing_evaluator_decision_candidate_inspection_artifact_input_rejected"
  | "conflicting_non_authorizing_evaluator_decision_candidate_inspection_artifact_input_rejected"
  | "stale_non_authorizing_evaluator_decision_candidate_inspection_artifact_input_rejected"
  | "revoked_non_authorizing_evaluator_decision_candidate_inspection_artifact_input_rejected"
  | "unknown_non_authorizing_evaluator_decision_candidate_inspection_artifact_input_rejected"
  | "duplicate_invalid_non_authorizing_evaluator_decision_candidate_inspection_artifact_input_rejected"
  | "authorizing_non_authorizing_evaluator_decision_candidate_inspection_artifact_input_rejected"
  | "grant_looking_non_authorizing_evaluator_decision_candidate_inspection_artifact_input_rejected"
  | "approval_decision_looking_non_authorizing_evaluator_decision_candidate_inspection_artifact_input_rejected"
  | "approval_grant_looking_non_authorizing_evaluator_decision_candidate_inspection_artifact_input_rejected"
  | "runtime_permission_looking_non_authorizing_evaluator_decision_candidate_inspection_artifact_input_rejected"
  | "command_exposure_looking_non_authorizing_evaluator_decision_candidate_inspection_artifact_input_rejected"
  | "evaluator_execution_looking_non_authorizing_evaluator_decision_candidate_inspection_artifact_input_rejected"
  | "evaluator_result_looking_non_authorizing_evaluator_decision_candidate_inspection_artifact_input_rejected"
  | "runtime_effect_true_non_authorizing_evaluator_decision_candidate_inspection_artifact_input_rejected"
  | "process_flag_true_non_authorizing_evaluator_decision_candidate_inspection_artifact_input_rejected"
  | "unsafe_non_authorizing_evaluator_decision_candidate_inspection_artifact_input_rejected"
  | "execution_signal_looking_non_authorizing_evaluator_decision_candidate_inspection_artifact_input_rejected"
  | "valid_non_authorizing_evaluator_decision_candidate_inspection_artifact_runtime_still_blocked";
export type HumanToolInspectionDispositionBoundaryClassification =
  | "missing_human_tool_inspection_disposition_boundary_input_rejected"
  | "malformed_human_tool_inspection_disposition_boundary_input_rejected"
  | "empty_human_tool_inspection_disposition_boundary_input_rejected"
  | "conflicting_human_tool_inspection_disposition_boundary_input_rejected"
  | "stale_human_tool_inspection_disposition_boundary_input_rejected"
  | "revoked_human_tool_inspection_disposition_boundary_input_rejected"
  | "unknown_human_tool_inspection_disposition_boundary_input_rejected"
  | "duplicate_invalid_human_tool_inspection_disposition_boundary_input_rejected"
  | "authorizing_human_tool_inspection_disposition_boundary_input_rejected"
  | "grant_looking_human_tool_inspection_disposition_boundary_input_rejected"
  | "approval_decision_looking_human_tool_inspection_disposition_boundary_input_rejected"
  | "approval_grant_looking_human_tool_inspection_disposition_boundary_input_rejected"
  | "evaluator_result_looking_human_tool_inspection_disposition_boundary_input_rejected"
  | "evaluator_execution_looking_human_tool_inspection_disposition_boundary_input_rejected"
  | "runtime_permission_looking_human_tool_inspection_disposition_boundary_input_rejected"
  | "command_exposure_looking_human_tool_inspection_disposition_boundary_input_rejected"
  | "runtime_effect_true_human_tool_inspection_disposition_boundary_input_rejected"
  | "process_flag_true_human_tool_inspection_disposition_boundary_input_rejected"
  | "unsafe_human_tool_inspection_disposition_boundary_input_rejected"
  | "execution_signal_looking_human_tool_inspection_disposition_boundary_input_rejected"
  | "valid_human_tool_inspection_disposition_boundary_runtime_still_blocked";
export type ReviewOnlyDispositionAggregationCheckpointClassification =
  | "missing_review_only_disposition_aggregation_checkpoint_input_rejected"
  | "malformed_review_only_disposition_aggregation_checkpoint_input_rejected"
  | "empty_review_only_disposition_aggregation_checkpoint_input_rejected"
  | "conflicting_review_only_disposition_aggregation_checkpoint_input_rejected"
  | "stale_review_only_disposition_aggregation_checkpoint_input_rejected"
  | "revoked_review_only_disposition_aggregation_checkpoint_input_rejected"
  | "unknown_review_only_disposition_aggregation_checkpoint_input_rejected"
  | "duplicate_invalid_review_only_disposition_aggregation_checkpoint_input_rejected"
  | "authorizing_review_only_disposition_aggregation_checkpoint_input_rejected"
  | "grant_looking_review_only_disposition_aggregation_checkpoint_input_rejected"
  | "approval_decision_looking_review_only_disposition_aggregation_checkpoint_input_rejected"
  | "approval_grant_looking_review_only_disposition_aggregation_checkpoint_input_rejected"
  | "evaluator_result_looking_review_only_disposition_aggregation_checkpoint_input_rejected"
  | "evaluator_execution_looking_review_only_disposition_aggregation_checkpoint_input_rejected"
  | "reviewer_routing_looking_review_only_disposition_aggregation_checkpoint_input_rejected"
  | "runtime_permission_looking_review_only_disposition_aggregation_checkpoint_input_rejected"
  | "command_exposure_looking_review_only_disposition_aggregation_checkpoint_input_rejected"
  | "runtime_effect_true_review_only_disposition_aggregation_checkpoint_input_rejected"
  | "process_flag_true_review_only_disposition_aggregation_checkpoint_input_rejected"
  | "unsafe_review_only_disposition_aggregation_checkpoint_input_rejected"
  | "execution_signal_looking_review_only_disposition_aggregation_checkpoint_input_rejected"
  | "valid_review_only_disposition_aggregation_checkpoint_runtime_still_blocked";
export type ReviewOnlyAggregationInspectionHandoffClassification =
  | "missing_review_only_aggregation_inspection_handoff_input_rejected"
  | "malformed_review_only_aggregation_inspection_handoff_input_rejected"
  | "empty_review_only_aggregation_inspection_handoff_input_rejected"
  | "conflicting_review_only_aggregation_inspection_handoff_input_rejected"
  | "stale_review_only_aggregation_inspection_handoff_input_rejected"
  | "revoked_review_only_aggregation_inspection_handoff_input_rejected"
  | "unknown_review_only_aggregation_inspection_handoff_input_rejected"
  | "duplicate_invalid_review_only_aggregation_inspection_handoff_input_rejected"
  | "authorizing_review_only_aggregation_inspection_handoff_input_rejected"
  | "grant_looking_review_only_aggregation_inspection_handoff_input_rejected"
  | "approval_decision_looking_review_only_aggregation_inspection_handoff_input_rejected"
  | "approval_grant_looking_review_only_aggregation_inspection_handoff_input_rejected"
  | "evaluator_result_looking_review_only_aggregation_inspection_handoff_input_rejected"
  | "evaluator_execution_looking_review_only_aggregation_inspection_handoff_input_rejected"
  | "reviewer_routing_looking_review_only_aggregation_inspection_handoff_input_rejected"
  | "runtime_permission_looking_review_only_aggregation_inspection_handoff_input_rejected"
  | "command_exposure_looking_review_only_aggregation_inspection_handoff_input_rejected"
  | "runtime_effect_true_review_only_aggregation_inspection_handoff_input_rejected"
  | "process_flag_true_review_only_aggregation_inspection_handoff_input_rejected"
  | "unsafe_review_only_aggregation_inspection_handoff_input_rejected"
  | "execution_signal_looking_review_only_aggregation_inspection_handoff_input_rejected"
  | "valid_review_only_aggregation_inspection_handoff_runtime_still_blocked";
export type ReviewOnlyHandoffReadinessArtifactClassification =
  | "missing_review_only_handoff_readiness_artifact_input_rejected"
  | "malformed_review_only_handoff_readiness_artifact_input_rejected"
  | "empty_review_only_handoff_readiness_artifact_input_rejected"
  | "conflicting_review_only_handoff_readiness_artifact_input_rejected"
  | "stale_review_only_handoff_readiness_artifact_input_rejected"
  | "revoked_review_only_handoff_readiness_artifact_input_rejected"
  | "unknown_review_only_handoff_readiness_artifact_input_rejected"
  | "duplicate_invalid_review_only_handoff_readiness_artifact_input_rejected"
  | "authorizing_review_only_handoff_readiness_artifact_input_rejected"
  | "grant_looking_review_only_handoff_readiness_artifact_input_rejected"
  | "approval_decision_looking_review_only_handoff_readiness_artifact_input_rejected"
  | "approval_grant_looking_review_only_handoff_readiness_artifact_input_rejected"
  | "evaluator_result_looking_review_only_handoff_readiness_artifact_input_rejected"
  | "evaluator_execution_looking_review_only_handoff_readiness_artifact_input_rejected"
  | "reviewer_routing_looking_review_only_handoff_readiness_artifact_input_rejected"
  | "reviewer_assignment_looking_review_only_handoff_readiness_artifact_input_rejected"
  | "runtime_permission_looking_review_only_handoff_readiness_artifact_input_rejected"
  | "command_exposure_looking_review_only_handoff_readiness_artifact_input_rejected"
  | "runtime_effect_true_review_only_handoff_readiness_artifact_input_rejected"
  | "process_flag_true_review_only_handoff_readiness_artifact_input_rejected"
  | "unsafe_review_only_handoff_readiness_artifact_input_rejected"
  | "execution_signal_looking_review_only_handoff_readiness_artifact_input_rejected"
  | "valid_review_only_handoff_readiness_artifact_runtime_still_blocked";
export type ReviewOnlyReadinessInspectionCheckpointClassification =
  | "missing_review_only_readiness_inspection_checkpoint_input_rejected"
  | "malformed_review_only_readiness_inspection_checkpoint_input_rejected"
  | "empty_review_only_readiness_inspection_checkpoint_input_rejected"
  | "conflicting_review_only_readiness_inspection_checkpoint_input_rejected"
  | "stale_review_only_readiness_inspection_checkpoint_input_rejected"
  | "revoked_review_only_readiness_inspection_checkpoint_input_rejected"
  | "unknown_review_only_readiness_inspection_checkpoint_input_rejected"
  | "duplicate_invalid_review_only_readiness_inspection_checkpoint_input_rejected"
  | "authorizing_review_only_readiness_inspection_checkpoint_input_rejected"
  | "grant_looking_review_only_readiness_inspection_checkpoint_input_rejected"
  | "approval_decision_looking_review_only_readiness_inspection_checkpoint_input_rejected"
  | "approval_grant_looking_review_only_readiness_inspection_checkpoint_input_rejected"
  | "evaluator_result_looking_review_only_readiness_inspection_checkpoint_input_rejected"
  | "evaluator_execution_looking_review_only_readiness_inspection_checkpoint_input_rejected"
  | "reviewer_routing_looking_review_only_readiness_inspection_checkpoint_input_rejected"
  | "reviewer_assignment_looking_review_only_readiness_inspection_checkpoint_input_rejected"
  | "runtime_permission_looking_review_only_readiness_inspection_checkpoint_input_rejected"
  | "command_exposure_looking_review_only_readiness_inspection_checkpoint_input_rejected"
  | "runtime_effect_true_review_only_readiness_inspection_checkpoint_input_rejected"
  | "process_flag_true_review_only_readiness_inspection_checkpoint_input_rejected"
  | "unsafe_review_only_readiness_inspection_checkpoint_input_rejected"
  | "execution_signal_looking_review_only_readiness_inspection_checkpoint_input_rejected"
  | "valid_review_only_readiness_inspection_checkpoint_runtime_still_blocked";
export type ReviewOnlyReadinessHandoffDispositionClassification =
  | "missing_review_only_readiness_handoff_disposition_input_rejected"
  | "malformed_review_only_readiness_handoff_disposition_input_rejected"
  | "empty_review_only_readiness_handoff_disposition_input_rejected"
  | "conflicting_review_only_readiness_handoff_disposition_input_rejected"
  | "stale_review_only_readiness_handoff_disposition_input_rejected"
  | "revoked_review_only_readiness_handoff_disposition_input_rejected"
  | "unknown_review_only_readiness_handoff_disposition_input_rejected"
  | "duplicate_invalid_review_only_readiness_handoff_disposition_input_rejected"
  | "authorizing_review_only_readiness_handoff_disposition_input_rejected"
  | "grant_looking_review_only_readiness_handoff_disposition_input_rejected"
  | "approval_decision_looking_review_only_readiness_handoff_disposition_input_rejected"
  | "approval_grant_looking_review_only_readiness_handoff_disposition_input_rejected"
  | "evaluator_result_looking_review_only_readiness_handoff_disposition_input_rejected"
  | "evaluator_execution_looking_review_only_readiness_handoff_disposition_input_rejected"
  | "reviewer_routing_looking_review_only_readiness_handoff_disposition_input_rejected"
  | "reviewer_assignment_looking_review_only_readiness_handoff_disposition_input_rejected"
  | "runtime_permission_looking_review_only_readiness_handoff_disposition_input_rejected"
  | "command_exposure_looking_review_only_readiness_handoff_disposition_input_rejected"
  | "runtime_effect_true_review_only_readiness_handoff_disposition_input_rejected"
  | "process_flag_true_review_only_readiness_handoff_disposition_input_rejected"
  | "unsafe_review_only_readiness_handoff_disposition_input_rejected"
  | "execution_signal_looking_review_only_readiness_handoff_disposition_input_rejected"
  | "valid_review_only_readiness_handoff_disposition_runtime_still_blocked";
export type ReviewOnlyHandoffDispositionInspectionCheckpointClassification =
  | "missing_review_only_handoff_disposition_inspection_checkpoint_input_rejected"
  | "malformed_review_only_handoff_disposition_inspection_checkpoint_input_rejected"
  | "empty_review_only_handoff_disposition_inspection_checkpoint_input_rejected"
  | "conflicting_review_only_handoff_disposition_inspection_checkpoint_input_rejected"
  | "stale_review_only_handoff_disposition_inspection_checkpoint_input_rejected"
  | "revoked_review_only_handoff_disposition_inspection_checkpoint_input_rejected"
  | "unknown_review_only_handoff_disposition_inspection_checkpoint_input_rejected"
  | "duplicate_invalid_review_only_handoff_disposition_inspection_checkpoint_input_rejected"
  | "authorizing_review_only_handoff_disposition_inspection_checkpoint_input_rejected"
  | "grant_looking_review_only_handoff_disposition_inspection_checkpoint_input_rejected"
  | "approval_decision_looking_review_only_handoff_disposition_inspection_checkpoint_input_rejected"
  | "approval_grant_looking_review_only_handoff_disposition_inspection_checkpoint_input_rejected"
  | "evaluator_result_looking_review_only_handoff_disposition_inspection_checkpoint_input_rejected"
  | "evaluator_execution_looking_review_only_handoff_disposition_inspection_checkpoint_input_rejected"
  | "reviewer_routing_looking_review_only_handoff_disposition_inspection_checkpoint_input_rejected"
  | "reviewer_assignment_looking_review_only_handoff_disposition_inspection_checkpoint_input_rejected"
  | "runtime_permission_looking_review_only_handoff_disposition_inspection_checkpoint_input_rejected"
  | "command_exposure_looking_review_only_handoff_disposition_inspection_checkpoint_input_rejected"
  | "runtime_effect_true_review_only_handoff_disposition_inspection_checkpoint_input_rejected"
  | "process_flag_true_review_only_handoff_disposition_inspection_checkpoint_input_rejected"
  | "unsafe_review_only_handoff_disposition_inspection_checkpoint_input_rejected"
  | "execution_signal_looking_review_only_handoff_disposition_inspection_checkpoint_input_rejected"
  | "valid_review_only_handoff_disposition_inspection_checkpoint_runtime_still_blocked";
export type ReviewOnlyInspectionHandoffMetadataBoundaryClassification =
  | "missing_review_only_inspection_handoff_metadata_boundary_input_rejected"
  | "malformed_review_only_inspection_handoff_metadata_boundary_input_rejected"
  | "empty_review_only_inspection_handoff_metadata_boundary_input_rejected"
  | "conflicting_review_only_inspection_handoff_metadata_boundary_input_rejected"
  | "stale_review_only_inspection_handoff_metadata_boundary_input_rejected"
  | "revoked_review_only_inspection_handoff_metadata_boundary_input_rejected"
  | "unknown_review_only_inspection_handoff_metadata_boundary_input_rejected"
  | "duplicate_invalid_review_only_inspection_handoff_metadata_boundary_input_rejected"
  | "authorizing_review_only_inspection_handoff_metadata_boundary_input_rejected"
  | "grant_looking_review_only_inspection_handoff_metadata_boundary_input_rejected"
  | "approval_decision_looking_review_only_inspection_handoff_metadata_boundary_input_rejected"
  | "approval_grant_looking_review_only_inspection_handoff_metadata_boundary_input_rejected"
  | "evaluator_result_looking_review_only_inspection_handoff_metadata_boundary_input_rejected"
  | "evaluator_execution_looking_review_only_inspection_handoff_metadata_boundary_input_rejected"
  | "reviewer_routing_looking_review_only_inspection_handoff_metadata_boundary_input_rejected"
  | "reviewer_assignment_looking_review_only_inspection_handoff_metadata_boundary_input_rejected"
  | "runtime_permission_looking_review_only_inspection_handoff_metadata_boundary_input_rejected"
  | "command_exposure_looking_review_only_inspection_handoff_metadata_boundary_input_rejected"
  | "runtime_effect_true_review_only_inspection_handoff_metadata_boundary_input_rejected"
  | "process_flag_true_review_only_inspection_handoff_metadata_boundary_input_rejected"
  | "unsafe_review_only_inspection_handoff_metadata_boundary_input_rejected"
  | "execution_signal_looking_review_only_inspection_handoff_metadata_boundary_input_rejected"
  | "valid_review_only_inspection_handoff_metadata_boundary_runtime_still_blocked";
export type ReviewOnlyInspectionHandoffCheckpointClassification =
  | "missing_review_only_inspection_handoff_checkpoint_input_rejected"
  | "malformed_review_only_inspection_handoff_checkpoint_input_rejected"
  | "empty_review_only_inspection_handoff_checkpoint_input_rejected"
  | "conflicting_review_only_inspection_handoff_checkpoint_input_rejected"
  | "stale_review_only_inspection_handoff_checkpoint_input_rejected"
  | "revoked_review_only_inspection_handoff_checkpoint_input_rejected"
  | "unknown_review_only_inspection_handoff_checkpoint_input_rejected"
  | "duplicate_invalid_review_only_inspection_handoff_checkpoint_input_rejected"
  | "authorizing_review_only_inspection_handoff_checkpoint_input_rejected"
  | "grant_looking_review_only_inspection_handoff_checkpoint_input_rejected"
  | "approval_decision_looking_review_only_inspection_handoff_checkpoint_input_rejected"
  | "approval_grant_looking_review_only_inspection_handoff_checkpoint_input_rejected"
  | "evaluator_result_looking_review_only_inspection_handoff_checkpoint_input_rejected"
  | "evaluator_execution_looking_review_only_inspection_handoff_checkpoint_input_rejected"
  | "reviewer_routing_looking_review_only_inspection_handoff_checkpoint_input_rejected"
  | "reviewer_assignment_looking_review_only_inspection_handoff_checkpoint_input_rejected"
  | "runtime_permission_looking_review_only_inspection_handoff_checkpoint_input_rejected"
  | "command_exposure_looking_review_only_inspection_handoff_checkpoint_input_rejected"
  | "runtime_effect_true_review_only_inspection_handoff_checkpoint_input_rejected"
  | "process_flag_true_review_only_inspection_handoff_checkpoint_input_rejected"
  | "unsafe_review_only_inspection_handoff_checkpoint_input_rejected"
  | "execution_signal_looking_review_only_inspection_handoff_checkpoint_input_rejected"
  | "valid_review_only_inspection_handoff_checkpoint_runtime_still_blocked";
export type ReviewOnlyCheckpointHandoffLayerClassification =
  | "missing_review_only_checkpoint_handoff_layer_input_rejected"
  | "malformed_review_only_checkpoint_handoff_layer_input_rejected"
  | "empty_review_only_checkpoint_handoff_layer_input_rejected"
  | "conflicting_review_only_checkpoint_handoff_layer_input_rejected"
  | "stale_review_only_checkpoint_handoff_layer_input_rejected"
  | "revoked_review_only_checkpoint_handoff_layer_input_rejected"
  | "unknown_review_only_checkpoint_handoff_layer_input_rejected"
  | "duplicate_invalid_review_only_checkpoint_handoff_layer_input_rejected"
  | "authorizing_review_only_checkpoint_handoff_layer_input_rejected"
  | "grant_looking_review_only_checkpoint_handoff_layer_input_rejected"
  | "approval_decision_looking_review_only_checkpoint_handoff_layer_input_rejected"
  | "approval_grant_looking_review_only_checkpoint_handoff_layer_input_rejected"
  | "evaluator_result_looking_review_only_checkpoint_handoff_layer_input_rejected"
  | "evaluator_execution_looking_review_only_checkpoint_handoff_layer_input_rejected"
  | "reviewer_routing_looking_review_only_checkpoint_handoff_layer_input_rejected"
  | "reviewer_assignment_looking_review_only_checkpoint_handoff_layer_input_rejected"
  | "runtime_permission_looking_review_only_checkpoint_handoff_layer_input_rejected"
  | "command_exposure_looking_review_only_checkpoint_handoff_layer_input_rejected"
  | "runtime_effect_true_review_only_checkpoint_handoff_layer_input_rejected"
  | "process_flag_true_review_only_checkpoint_handoff_layer_input_rejected"
  | "unsafe_review_only_checkpoint_handoff_layer_input_rejected"
  | "execution_signal_looking_review_only_checkpoint_handoff_layer_input_rejected"
  | "valid_review_only_checkpoint_handoff_layer_runtime_still_blocked";
export type ReviewOnlyMetadataHandoffCheckpointClassification =
  | "missing_review_only_metadata_handoff_checkpoint_input_rejected"
  | "malformed_review_only_metadata_handoff_checkpoint_input_rejected"
  | "empty_review_only_metadata_handoff_checkpoint_input_rejected"
  | "conflicting_review_only_metadata_handoff_checkpoint_input_rejected"
  | "stale_review_only_metadata_handoff_checkpoint_input_rejected"
  | "revoked_review_only_metadata_handoff_checkpoint_input_rejected"
  | "unknown_review_only_metadata_handoff_checkpoint_input_rejected"
  | "duplicate_invalid_review_only_metadata_handoff_checkpoint_input_rejected"
  | "authorizing_review_only_metadata_handoff_checkpoint_input_rejected"
  | "grant_looking_review_only_metadata_handoff_checkpoint_input_rejected"
  | "approval_decision_looking_review_only_metadata_handoff_checkpoint_input_rejected"
  | "approval_grant_looking_review_only_metadata_handoff_checkpoint_input_rejected"
  | "evaluator_result_looking_review_only_metadata_handoff_checkpoint_input_rejected"
  | "evaluator_execution_looking_review_only_metadata_handoff_checkpoint_input_rejected"
  | "reviewer_routing_looking_review_only_metadata_handoff_checkpoint_input_rejected"
  | "reviewer_assignment_looking_review_only_metadata_handoff_checkpoint_input_rejected"
  | "runtime_permission_looking_review_only_metadata_handoff_checkpoint_input_rejected"
  | "command_exposure_looking_review_only_metadata_handoff_checkpoint_input_rejected"
  | "runtime_effect_true_review_only_metadata_handoff_checkpoint_input_rejected"
  | "process_flag_true_review_only_metadata_handoff_checkpoint_input_rejected"
  | "unsafe_review_only_metadata_handoff_checkpoint_input_rejected"
  | "execution_signal_looking_review_only_metadata_handoff_checkpoint_input_rejected"
  | "valid_review_only_metadata_handoff_checkpoint_runtime_still_blocked";
export type ReviewOnlyHandoffMetadataConsolidationLayerClassification =
  | "missing_review_only_handoff_metadata_consolidation_layer_input_rejected"
  | "malformed_review_only_handoff_metadata_consolidation_layer_input_rejected"
  | "empty_review_only_handoff_metadata_consolidation_layer_input_rejected"
  | "conflicting_review_only_handoff_metadata_consolidation_layer_input_rejected"
  | "stale_review_only_handoff_metadata_consolidation_layer_input_rejected"
  | "revoked_review_only_handoff_metadata_consolidation_layer_input_rejected"
  | "unknown_review_only_handoff_metadata_consolidation_layer_input_rejected"
  | "duplicate_invalid_review_only_handoff_metadata_consolidation_layer_input_rejected"
  | "authorizing_review_only_handoff_metadata_consolidation_layer_input_rejected"
  | "grant_looking_review_only_handoff_metadata_consolidation_layer_input_rejected"
  | "approval_decision_looking_review_only_handoff_metadata_consolidation_layer_input_rejected"
  | "approval_grant_looking_review_only_handoff_metadata_consolidation_layer_input_rejected"
  | "evaluator_result_looking_review_only_handoff_metadata_consolidation_layer_input_rejected"
  | "evaluator_execution_looking_review_only_handoff_metadata_consolidation_layer_input_rejected"
  | "reviewer_routing_looking_review_only_handoff_metadata_consolidation_layer_input_rejected"
  | "reviewer_assignment_looking_review_only_handoff_metadata_consolidation_layer_input_rejected"
  | "runtime_permission_looking_review_only_handoff_metadata_consolidation_layer_input_rejected"
  | "command_exposure_looking_review_only_handoff_metadata_consolidation_layer_input_rejected"
  | "runtime_effect_true_review_only_handoff_metadata_consolidation_layer_input_rejected"
  | "process_flag_true_review_only_handoff_metadata_consolidation_layer_input_rejected"
  | "unsafe_review_only_handoff_metadata_consolidation_layer_input_rejected"
  | "execution_signal_looking_review_only_handoff_metadata_consolidation_layer_input_rejected"
  | "valid_review_only_handoff_metadata_consolidation_layer_runtime_still_blocked";
export type ReviewOnlyConsolidationCheckpointHandoffClassification =
  | "missing_review_only_consolidation_checkpoint_handoff_input_rejected"
  | "malformed_review_only_consolidation_checkpoint_handoff_input_rejected"
  | "mismatched_source_digest_review_only_consolidation_checkpoint_handoff_input_rejected"
  | "empty_review_only_consolidation_checkpoint_handoff_input_rejected"
  | "conflicting_review_only_consolidation_checkpoint_handoff_input_rejected"
  | "stale_review_only_consolidation_checkpoint_handoff_input_rejected"
  | "revoked_review_only_consolidation_checkpoint_handoff_input_rejected"
  | "unknown_review_only_consolidation_checkpoint_handoff_input_rejected"
  | "duplicate_invalid_review_only_consolidation_checkpoint_handoff_input_rejected"
  | "authorizing_review_only_consolidation_checkpoint_handoff_input_rejected"
  | "grant_looking_review_only_consolidation_checkpoint_handoff_input_rejected"
  | "approval_decision_looking_review_only_consolidation_checkpoint_handoff_input_rejected"
  | "approval_grant_looking_review_only_consolidation_checkpoint_handoff_input_rejected"
  | "evaluator_result_looking_review_only_consolidation_checkpoint_handoff_input_rejected"
  | "evaluator_execution_looking_review_only_consolidation_checkpoint_handoff_input_rejected"
  | "reviewer_routing_looking_review_only_consolidation_checkpoint_handoff_input_rejected"
  | "reviewer_assignment_looking_review_only_consolidation_checkpoint_handoff_input_rejected"
  | "runtime_permission_looking_review_only_consolidation_checkpoint_handoff_input_rejected"
  | "command_exposure_looking_review_only_consolidation_checkpoint_handoff_input_rejected"
  | "runtime_effect_true_review_only_consolidation_checkpoint_handoff_input_rejected"
  | "process_flag_true_review_only_consolidation_checkpoint_handoff_input_rejected"
  | "unsafe_review_only_consolidation_checkpoint_handoff_input_rejected"
  | "execution_signal_looking_review_only_consolidation_checkpoint_handoff_input_rejected"
  | "valid_review_only_consolidation_checkpoint_handoff_runtime_still_blocked";
export type ReviewOnlyConsolidationMetadataCheckpointClassification =
  | "missing_review_only_consolidation_metadata_checkpoint_input_rejected"
  | "malformed_review_only_consolidation_metadata_checkpoint_input_rejected"
  | "mismatched_source_digest_review_only_consolidation_metadata_checkpoint_input_rejected"
  | "empty_review_only_consolidation_metadata_checkpoint_input_rejected"
  | "conflicting_review_only_consolidation_metadata_checkpoint_input_rejected"
  | "stale_review_only_consolidation_metadata_checkpoint_input_rejected"
  | "revoked_review_only_consolidation_metadata_checkpoint_input_rejected"
  | "unknown_review_only_consolidation_metadata_checkpoint_input_rejected"
  | "duplicate_invalid_review_only_consolidation_metadata_checkpoint_input_rejected"
  | "authorizing_review_only_consolidation_metadata_checkpoint_input_rejected"
  | "grant_looking_review_only_consolidation_metadata_checkpoint_input_rejected"
  | "approval_decision_looking_review_only_consolidation_metadata_checkpoint_input_rejected"
  | "approval_grant_looking_review_only_consolidation_metadata_checkpoint_input_rejected"
  | "evaluator_result_looking_review_only_consolidation_metadata_checkpoint_input_rejected"
  | "evaluator_execution_looking_review_only_consolidation_metadata_checkpoint_input_rejected"
  | "reviewer_routing_looking_review_only_consolidation_metadata_checkpoint_input_rejected"
  | "reviewer_assignment_looking_review_only_consolidation_metadata_checkpoint_input_rejected"
  | "runtime_permission_looking_review_only_consolidation_metadata_checkpoint_input_rejected"
  | "command_exposure_looking_review_only_consolidation_metadata_checkpoint_input_rejected"
  | "runtime_effect_true_review_only_consolidation_metadata_checkpoint_input_rejected"
  | "process_flag_true_review_only_consolidation_metadata_checkpoint_input_rejected"
  | "unsafe_review_only_consolidation_metadata_checkpoint_input_rejected"
  | "execution_signal_looking_review_only_consolidation_metadata_checkpoint_input_rejected"
  | "valid_review_only_consolidation_metadata_checkpoint_runtime_still_blocked";
export type TargetConsumerPlanningMetadataClassification =
  | "missing_target_consumer_planning_metadata_input_rejected"
  | "malformed_target_consumer_planning_metadata_input_rejected"
  | "mismatched_source_digest_target_consumer_planning_metadata_input_rejected"
  | "empty_target_consumer_planning_metadata_input_rejected"
  | "duplicate_invalid_target_consumer_planning_metadata_input_rejected"
  | "grant_looking_target_consumer_planning_metadata_input_rejected"
  | "approval_decision_looking_target_consumer_planning_metadata_input_rejected"
  | "evaluator_result_looking_target_consumer_planning_metadata_input_rejected"
  | "evaluator_execution_looking_target_consumer_planning_metadata_input_rejected"
  | "reviewer_routing_looking_target_consumer_planning_metadata_input_rejected"
  | "reviewer_assignment_looking_target_consumer_planning_metadata_input_rejected"
  | "runtime_permission_looking_target_consumer_planning_metadata_input_rejected"
  | "command_exposure_looking_target_consumer_planning_metadata_input_rejected"
  | "runtime_effect_true_target_consumer_planning_metadata_input_rejected"
  | "process_flag_true_target_consumer_planning_metadata_input_rejected"
  | "execution_signal_looking_target_consumer_planning_metadata_input_rejected"
  | "valid_target_consumer_planning_metadata_runtime_still_blocked";

export interface ReviewOnlyApprovalPrerequisiteRecordStatus {
  status: ReviewOnlyApprovalPrerequisiteStatus;
  present: boolean;
  valid: boolean;
  revoked: boolean;
  stale?: boolean;
  duplicate?: boolean;
  malformed?: boolean;
  sourceIndexes?: number[];
  recordIds?: string[];
  rejectionReasons: string[];
}

export interface ApprovalPrerequisiteReaderRecordStatus
  extends ReviewOnlyApprovalPrerequisiteRecordStatus {
  expectedRecord: "runtimeApprovalRecord" | "commandExposureApprovalRecord";
  status:
    | "missing"
    | "malformed"
    | "revoked"
    | "duplicate"
    | "stale"
    | "valid";
  stale: boolean;
  duplicate: boolean;
  malformed: boolean;
  sourceIndexes: number[];
  recordIds: string[];
}

export interface ApprovalPrerequisiteReaderFinding {
  expectedRecord?: "runtimeApprovalRecord" | "commandExposureApprovalRecord";
  recordId?: string | null;
  recordIds?: string[];
}

export interface ApprovalPrerequisiteReaderUnknownRecord {
  index: number;
  schema: string | null;
  recordKind: string | null;
  reason: "unknown_prerequisite_record";
}

export interface RuntimeApprovalGrantBlocked {
  produced: false;
  persisted: false;
  grantId: null;
  schema: "ardyn.runtime-approval-grant";
  schemaVersion: "not-implemented";
}

export interface ReviewOnlyRuntimeEffectFalse {
  runtimeEnabled: false;
  runtimeStarted: false;
  runtimeReady: false;
  runtimeCommandEnabled: false;
  runtimeCommandExposureEnabled: false;
  runtimeExecutionEnabled: false;
  runtimeExecuted: false;
  approvalGrantProduced: false;
  approvalGrantPersisted: false;
  approvalEvaluatorAuthoritative: false;
}

export interface ApprovalPrerequisiteReaderInputForReview {
  reviewedAt: string;
  prerequisiteRecords: unknown[];
}

export interface ApprovalPrerequisiteReaderResult {
  schema: "ardyn.phase-5.19.approval-prerequisite-reader-result";
  schemaVersion: "0.1.0";
  readerKind: "approval-prerequisite-reader";
  readerMode: "review-only";
  reviewedAt: string;
  classification: ApprovalPrerequisiteReaderClassification;
  prerequisiteSignalRecognized: boolean;
  reviewOnly: true;
  authoritative: false;
  recordCounts: {
    total: number;
    known: number;
    unknown: number;
    malformed: number;
    duplicate: number;
    stale: number;
    revoked: number;
    valid: number;
    missing: number;
  };
  prerequisiteRecords: {
    runtimeApprovalRecord: ApprovalPrerequisiteReaderRecordStatus;
    commandExposureApprovalRecord: ApprovalPrerequisiteReaderRecordStatus;
  };
  unknownRecords: ApprovalPrerequisiteReaderUnknownRecord[];
  malformedRecords: ApprovalPrerequisiteReaderFinding[];
  duplicateRecords: ApprovalPrerequisiteReaderFinding[];
  staleRecords: ApprovalPrerequisiteReaderFinding[];
  revokedRecords: ApprovalPrerequisiteReaderFinding[];
  rejectionReasons: string[];
  approvalGrant: RuntimeApprovalGrantBlocked;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
}

export interface ApprovalPrerequisiteSourcePreflightSourceReport {
  index: number;
  sourceId: string | null;
  sourceKind: unknown;
  sourceMode: unknown;
  malformed: boolean;
  empty: boolean;
  duplicate: boolean;
  recordCount: number;
}

export interface ApprovalPrerequisiteSourcePreflightResult {
  schema: "ardyn.phase-5.20.approval-prerequisite-source-preflight-result";
  schemaVersion: "0.1.0";
  preflightKind: "approval-prerequisite-source-ingestion-preflight";
  preflightMode: "review-only";
  reviewedAt: string;
  classification: ApprovalPrerequisiteSourcePreflightClassification;
  sourceInputsAccepted: boolean;
  readerInputForwarded: boolean;
  reviewOnly: true;
  authoritative: false;
  sourceInputCounts: {
    total: number;
    malformed: number;
    empty: number;
    duplicate: number;
    accepted: number;
    rejected: number;
  };
  sourceInputs: ApprovalPrerequisiteSourcePreflightSourceReport[];
  acceptedReaderInput: ApprovalPrerequisiteReaderInputForReview | null;
  approvalPrerequisiteReader: ApprovalPrerequisiteReaderResult | null;
  rejectionReasons: string[];
  approvalGrant: RuntimeApprovalGrantBlocked;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
}

export interface ApprovalPrerequisiteSourceSelectionSourceReport {
  index: number;
  sourceId: string | null;
  preflightClassification: ApprovalPrerequisiteSourcePreflightClassification;
  preflightAccepted: boolean;
  selected: boolean;
  rejected: boolean;
  equivalentToSelected: boolean;
  rejectionReasons: string[];
}

export interface ApprovalPrerequisiteSourceSelectionResult {
  schema: "ardyn.phase-5.21.approval-prerequisite-source-selection-result";
  schemaVersion: "0.1.0";
  selectionKind: "approval-prerequisite-source-selection";
  selectionMode: "review-only";
  reviewedAt: string;
  classification: ApprovalPrerequisiteSourceSelectionClassification;
  sourceSelectionAccepted: boolean;
  readerInputForwarded: boolean;
  selectedSourceId: string | null;
  selectedSourceIds: string[];
  equivalentSourceIds: string[];
  rejectedSourceIds: (string | null)[];
  conflictingSourceIds: (string | null)[];
  duplicateSourceIds: string[];
  reviewOnly: true;
  authoritative: false;
  sourceInputCounts: {
    total: number;
    acceptedCandidates: number;
    rejectedCandidates: number;
    equivalentCandidates: number;
    conflictingCandidates: number;
    duplicateSourceIds: number;
  };
  sourceSelectionReports: ApprovalPrerequisiteSourceSelectionSourceReport[];
  selectedReaderInput: ApprovalPrerequisiteReaderInputForReview | null;
  approvalPrerequisiteReader: ApprovalPrerequisiteReaderResult | null;
  rejectionReasons: string[];
  approvalGrant: RuntimeApprovalGrantBlocked;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
}

export interface ApprovalPrerequisiteSourceBundlePartReport {
  index: number;
  partId: string | null;
  partKind: unknown;
  partMode: unknown;
  malformed: boolean;
  sourceSelectionClassification:
    | ApprovalPrerequisiteSourceSelectionClassification
    | null;
  sourceSelectionAccepted: boolean;
  selected: boolean;
  rejected: boolean;
  equivalentToSelected: boolean;
  rejectionReasons: string[];
}

export interface ApprovalPrerequisiteSourceBundleResult {
  schema: "ardyn.phase-5.22.approval-prerequisite-source-bundle-result";
  schemaVersion: "0.1.0";
  bundleKind: "approval-prerequisite-source-bundle";
  bundleMode: "review-only";
  reviewedAt: string;
  classification: ApprovalPrerequisiteSourceBundleClassification;
  sourceBundleAccepted: boolean;
  readerInputForwarded: boolean;
  selectedBundlePartId: string | null;
  selectedBundlePartIds: string[];
  equivalentBundlePartIds: string[];
  rejectedBundlePartIds: (string | null)[];
  conflictingBundlePartIds: (string | null)[];
  reviewOnly: true;
  authoritative: false;
  bundlePartCounts: {
    total: number;
    malformed: number;
    acceptedCandidates: number;
    rejectedCandidates: number;
    equivalentCandidates: number;
    conflictingCandidates: number;
  };
  bundlePartReports: ApprovalPrerequisiteSourceBundlePartReport[];
  bundledReaderInput: ApprovalPrerequisiteReaderInputForReview | null;
  approvalPrerequisiteReader: ApprovalPrerequisiteReaderResult | null;
  rejectionReasons: string[];
  approvalGrant: RuntimeApprovalGrantBlocked;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
}

export interface ApprovalPrerequisiteBundleConsumptionSourceSummary {
  sourceBundleSchema: string | null;
  sourceBundleClassification: ApprovalPrerequisiteSourceBundleClassification | null;
  sourceBundleAccepted: boolean;
  selectedBundlePartId: string | null;
  equivalentBundlePartIds: (string | null)[];
  rejectedBundlePartIds: (string | null)[];
  conflictingBundlePartIds: (string | null)[];
}

export interface ApprovalPrerequisiteBundleConsumptionSummary {
  selectedBundlePartId: string | null;
  readerRecordCount: number;
  evaluatorClassification: ReviewOnlyApprovalEvaluatorClassification | null;
  prerequisiteSignalRecognized: boolean;
  evaluatorReviewOnly: boolean;
  evaluatorAuthoritative: boolean;
}

export interface ApprovalPrerequisiteBundleConsumptionCheckpointResult {
  schema: "ardyn.phase-5.23.approval-prerequisite-bundle-consumption-checkpoint-result";
  schemaVersion: "0.1.0";
  checkpointKind: "approval-prerequisite-bundle-consumption-checkpoint";
  checkpointMode: "review-only";
  reviewedAt: string;
  classification: ApprovalPrerequisiteBundleConsumptionCheckpointClassification;
  bundleConsumedForReview: boolean;
  evaluatorInputForwarded: boolean;
  reviewOnly: true;
  authoritative: false;
  sourceBundleSummary: ApprovalPrerequisiteBundleConsumptionSourceSummary;
  consumedBundleSummary: ApprovalPrerequisiteBundleConsumptionSummary;
  approvalPrerequisiteEvaluator: ReviewOnlyRuntimeApprovalEvaluatorResult | null;
  rejectionReasons: string[];
  approvalGrant: RuntimeApprovalGrantBlocked;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
}

export interface ApprovalPrerequisiteIntegrationSourceIngestionResult {
  index: number;
  sourceId: string | null;
  classification: ApprovalPrerequisiteSourcePreflightClassification;
  sourceInputsAccepted: boolean;
  readerInputForwarded: boolean;
  prerequisiteSignalRecognized: boolean;
  reviewOnly: boolean;
  authoritative: boolean;
  approvalGrantProduced: false;
  runtimeEffectAllFalse: boolean;
}

export interface ApprovalPrerequisiteIntegrationSourceSelectionSummary {
  classification: ApprovalPrerequisiteSourceSelectionClassification;
  sourceSelectionAccepted: boolean;
  readerInputForwarded: boolean;
  selectedSourceId: string | null;
  equivalentSourceIds: string[];
  rejectedSourceIds: (string | null)[];
  conflictingSourceIds: (string | null)[];
  duplicateSourceIds: string[];
  approvalGrantProduced: false;
  runtimeEffectAllFalse: boolean;
}

export interface ApprovalPrerequisiteIntegrationSourceBundleSummary {
  classification: ApprovalPrerequisiteSourceBundleClassification;
  sourceBundleAccepted: boolean;
  readerInputForwarded: boolean;
  selectedBundlePartId: string | null;
  equivalentBundlePartIds: string[];
  rejectedBundlePartIds: (string | null)[];
  conflictingBundlePartIds: (string | null)[];
  approvalGrantProduced: false;
  runtimeEffectAllFalse: boolean;
}

export interface ApprovalPrerequisiteIntegrationBundleConsumptionSummary {
  classification: ApprovalPrerequisiteBundleConsumptionCheckpointClassification;
  bundleConsumedForReview: boolean;
  evaluatorInputForwarded: boolean;
  selectedBundlePartId: string | null;
  readerRecordCount: number;
  evaluatorClassification: ReviewOnlyApprovalEvaluatorClassification | null;
  prerequisiteSignalRecognized: boolean;
  approvalGrantProduced: false;
  runtimeEffectAllFalse: boolean;
}

export interface ApprovalPrerequisiteIntegrationReviewOnlyEvaluatorSummary {
  schema: "ardyn.phase-5.18.review-only-approval-evaluator-result";
  evaluatorKind: "review-only-runtime-approval-evaluator";
  evaluationMode: "review-only";
  classification: ReviewOnlyApprovalEvaluatorClassification;
  prerequisiteSignalRecognized: boolean;
  reviewOnly: true;
  authoritative: false;
  reviewSummaryIsApprovalGrant: false;
  approvalGrantProduced: false;
  approvalGrantPersisted: false;
  approvalGrantId: null;
  runtimeEffectAllFalse: boolean;
}

export interface ApprovalPrerequisiteIntegrationCheckpointResult {
  schema: "ardyn.phase-5.24.approval-prerequisite-integration-checkpoint-result";
  schemaVersion: "0.1.0";
  checkpointKind: "approval-prerequisite-evaluation-integration-checkpoint";
  checkpointMode: "review-only";
  reviewedAt: string;
  classification: ApprovalPrerequisiteIntegrationCheckpointClassification;
  reviewSummaryProduced: boolean;
  reviewSummaryIsApprovalGrant: false;
  reviewOnly: true;
  authoritative: false;
  sourceIngestion: {
    sourceCount: number;
    sourcePreflightResults: ApprovalPrerequisiteIntegrationSourceIngestionResult[];
  };
  sourceSelection: ApprovalPrerequisiteIntegrationSourceSelectionSummary;
  sourceBundle: ApprovalPrerequisiteIntegrationSourceBundleSummary;
  bundleConsumption: ApprovalPrerequisiteIntegrationBundleConsumptionSummary;
  reviewOnlyEvaluatorSummary:
    | ApprovalPrerequisiteIntegrationReviewOnlyEvaluatorSummary
    | null;
  rejectionReasons: string[];
  approvalGrant: RuntimeApprovalGrantBlocked;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
}

export interface NonAuthorizingPrerequisiteReviewArtifact {
  schema: "ardyn.phase-5.25.non-authorizing-prerequisite-review-artifact";
  schemaVersion: "0.1.0";
  artifactKind: "non-authorizing-prerequisite-review-artifact";
  artifactMode: "review-only";
  reviewedAt: string;
  sourceIntegrationCheckpoint: {
    schema: "ardyn.phase-5.24.approval-prerequisite-integration-checkpoint-result";
    checkpointKind: "approval-prerequisite-evaluation-integration-checkpoint";
    classification: ApprovalPrerequisiteIntegrationCheckpointClassification;
    reviewSummaryProduced: boolean;
    reviewSummaryIsApprovalGrant: false;
  };
  pipelineSummary: {
    sourceCount: number;
    selectedSourceId: string | null;
    selectedBundlePartId: string | null;
    readerRecordCount: number;
    evaluatorClassification: ReviewOnlyApprovalEvaluatorClassification | null;
    prerequisiteSignalRecognized: boolean;
  };
  integratedReviewSummary: ApprovalPrerequisiteIntegrationReviewOnlyEvaluatorSummary;
  reviewArtifactIsApprovalGrant: false;
  approvalGrantProduced: false;
  approvalGrantPersisted: false;
  approvalGrantId: null;
  runtimePermissionGranted: false;
  commandExposurePermissionGranted: false;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
}

export interface PrerequisiteReviewArtifactBoundaryResult {
  schema: "ardyn.phase-5.25.prerequisite-review-artifact-boundary-result";
  schemaVersion: "0.1.0";
  boundaryKind: "non-authorizing-prerequisite-review-artifact-boundary";
  boundaryMode: "review-only";
  reviewedAt: string;
  classification: PrerequisiteReviewArtifactBoundaryClassification;
  reviewArtifactProduced: boolean;
  reviewArtifactIsApprovalGrant: false;
  reviewArtifact: NonAuthorizingPrerequisiteReviewArtifact | null;
  integratedReviewSummary: {
    schema: "ardyn.phase-5.24.approval-prerequisite-integration-checkpoint-result";
    checkpointKind: "approval-prerequisite-evaluation-integration-checkpoint";
    classification: ApprovalPrerequisiteIntegrationCheckpointClassification;
    reviewSummaryProduced: boolean;
    reviewSummaryIsApprovalGrant: false;
    approvalGrantProduced: false;
    runtimeEffectAllFalse: boolean;
  };
  reviewOnly: true;
  authoritative: false;
  approvalGrant: RuntimeApprovalGrantBlocked;
  runtimePermissionGranted: false;
  commandExposurePermissionGranted: false;
  rejectionReasons: string[];
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
}

export interface ReviewArtifactEvaluatorInputCandidate {
  schema: "ardyn.phase-5.26.review-artifact-evaluator-input-candidate";
  schemaVersion: "0.1.0";
  candidateKind: "review-artifact-evaluator-input-candidate";
  candidateMode: "review-only";
  reviewedAt: string;
  sourceReviewArtifact: {
    schema: "ardyn.phase-5.25.non-authorizing-prerequisite-review-artifact";
    artifactKind: "non-authorizing-prerequisite-review-artifact";
    artifactMode: "review-only";
    reviewedAt: string;
    artifactDigest: string;
    sourceIntegrationCheckpoint:
      NonAuthorizingPrerequisiteReviewArtifact["sourceIntegrationCheckpoint"];
    reviewArtifactIsApprovalGrant: false;
    approvalGrantProduced: false;
    runtimeEffectAllFalse: true;
  };
  pipelineSummary: NonAuthorizingPrerequisiteReviewArtifact["pipelineSummary"];
  integratedReviewSummary:
    NonAuthorizingPrerequisiteReviewArtifact["integratedReviewSummary"];
  evaluatorInputCandidateIsApprovalGrant: false;
  candidateIsApprovalGrant: false;
  approvalGrantProduced: false;
  approvalGrantPersisted: false;
  approvalGrantId: null;
  runtimePermissionGranted: false;
  commandExposurePermissionGranted: false;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
}

export interface ReviewArtifactEvaluatorInputHandoffResult {
  schema: "ardyn.phase-5.26.prerequisite-review-artifact-evaluator-input-handoff-result";
  schemaVersion: "0.1.0";
  handoffKind: "review-artifact-evaluator-input-handoff";
  handoffMode: "review-only";
  reviewedAt: string;
  classification: ReviewArtifactEvaluatorInputHandoffClassification;
  reviewArtifactAccepted: boolean;
  evaluatorInputCandidateProduced: boolean;
  evaluatorInputCandidateIsApprovalGrant: false;
  evaluatorInputCandidate: ReviewArtifactEvaluatorInputCandidate | null;
  reviewArtifactSummary: {
    schema: "ardyn.phase-5.25.non-authorizing-prerequisite-review-artifact";
    artifactKind: "non-authorizing-prerequisite-review-artifact";
    artifactMode: "review-only";
    reviewedAt: string;
    artifactDigest: string;
    reviewArtifactIsApprovalGrant: false;
    approvalGrantProduced: false;
    runtimeEffectAllFalse: true;
  } | null;
  reviewOnly: true;
  authoritative: false;
  approvalGrant: RuntimeApprovalGrantBlocked;
  runtimePermissionGranted: false;
  commandExposurePermissionGranted: false;
  rejectionReasons: string[];
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
}

export interface ApprovalEvaluatorCandidateIntakeCheckpointState {
  schema: "ardyn.phase-5.27.approval-evaluator-candidate-intake-state";
  schemaVersion: "0.1.0";
  stateKind: "approval-evaluator-candidate-intake-state";
  stateMode: "review-only";
  reviewedAt: string;
  sourceEvaluatorInputCandidate: {
    schema: "ardyn.phase-5.26.review-artifact-evaluator-input-candidate";
    candidateKind: "review-artifact-evaluator-input-candidate";
    candidateMode: "review-only";
    reviewedAt: string;
    candidateDigest: string;
    sourceReviewArtifact: ReviewArtifactEvaluatorInputCandidate["sourceReviewArtifact"];
    evaluatorInputCandidateIsApprovalGrant: false;
    approvalGrantProduced: false;
    runtimeEffectAllFalse: true;
  };
  pipelineSummary: ReviewArtifactEvaluatorInputCandidate["pipelineSummary"];
  integratedReviewSummary:
    ReviewArtifactEvaluatorInputCandidate["integratedReviewSummary"];
  approvalEvaluatorInputCandidateAccepted: true;
  intakeCheckpointStateIsApprovalGrant: false;
  approvalGrantProduced: false;
  approvalGrantPersisted: false;
  approvalGrantId: null;
  runtimePermissionGranted: false;
  commandExposurePermissionGranted: false;
  runtimeCommandExposureEnabled: false;
  runtimeExecutionEnabled: false;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
}

export interface ApprovalEvaluatorCandidateIntakeCheckpointResult {
  schema: "ardyn.phase-5.27.approval-evaluator-candidate-intake-checkpoint-result";
  schemaVersion: "0.1.0";
  checkpointKind: "approval-evaluator-candidate-intake-checkpoint";
  checkpointMode: "review-only";
  reviewedAt: string;
  classification: ApprovalEvaluatorCandidateIntakeCheckpointClassification;
  evaluatorInputCandidateAccepted: boolean;
  intakeCheckpointStateProduced: boolean;
  intakeCheckpointStateIsApprovalGrant: false;
  intakeCheckpointState: ApprovalEvaluatorCandidateIntakeCheckpointState | null;
  candidateSummary: {
    schema: "ardyn.phase-5.26.review-artifact-evaluator-input-candidate";
    candidateKind: "review-artifact-evaluator-input-candidate";
    candidateMode: "review-only";
    reviewedAt: string;
    candidateDigest: string;
    evaluatorInputCandidateIsApprovalGrant: false;
    approvalGrantProduced: false;
    runtimeEffectAllFalse: true;
  } | null;
  reviewOnly: true;
  authoritative: false;
  approvalGrant: RuntimeApprovalGrantBlocked;
  approvalGrantProduced: false;
  approvalGrantPersisted: false;
  approvalGrantId: null;
  runtimePermissionGranted: false;
  commandExposurePermissionGranted: false;
  runtimeCommandExposureEnabled: false;
  runtimeExecutionEnabled: false;
  rejectionReasons: string[];
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
}

export interface ReviewOnlyEvaluatorPreflightCheckpointState {
  schema: "ardyn.phase-5.28.review-only-evaluator-preflight-state";
  schemaVersion: "0.1.0";
  stateKind: "review-only-evaluator-preflight-state";
  stateMode: "review-only";
  reviewedAt: string;
  sourceIntakeCheckpointState: {
    schema: "ardyn.phase-5.27.approval-evaluator-candidate-intake-state";
    stateKind: "approval-evaluator-candidate-intake-state";
    stateMode: "review-only";
    reviewedAt: string;
    stateDigest: string;
    sourceEvaluatorInputCandidateDigest: string;
    intakeCheckpointStateIsApprovalGrant: false;
    approvalGrantProduced: false;
    approvalGrantPersisted: false;
    runtimeEffectAllFalse: true;
  };
  pipelineSummary: {
    sourceCount: number;
    selectedSourceId: string | null;
    selectedBundlePartId: string | null;
    readerRecordCount: number;
    evaluatorClassification: string;
    prerequisiteSignalRecognized: true;
  };
  integratedReviewSummary: {
    schema: "ardyn.phase-5.18.review-only-approval-evaluator-result";
    evaluatorKind: "review-only-runtime-approval-evaluator";
    evaluationMode: "review-only";
    classification: string;
    prerequisiteSignalRecognized: true;
    reviewOnly: true;
    authoritative: false;
    reviewSummaryIsApprovalGrant: false;
    approvalGrantProduced: false;
    approvalGrantPersisted: false;
    approvalGrantId: null;
    runtimeEffectAllFalse: true;
  };
  evaluatorPreflightAccepted: true;
  evaluatorPreflightCheckpointStateIsApprovalGrant: false;
  approvalGrantProduced: false;
  approvalGrantPersisted: false;
  approvalGrantId: null;
  runtimePermissionGranted: false;
  commandExposurePermissionGranted: false;
  runtimeCommandExposureEnabled: false;
  runtimeExecutionEnabled: false;
  evaluatorExecutionRequested: false;
  evaluatorExecutionStarted: false;
  evaluatorExecutionEnabled: false;
  evaluatorExecuted: false;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
}

export interface ReviewOnlyEvaluatorPreflightCheckpointResult {
  schema: "ardyn.phase-5.28.review-only-evaluator-preflight-checkpoint-result";
  schemaVersion: "0.1.0";
  checkpointKind: "review-only-evaluator-preflight-checkpoint";
  checkpointMode: "review-only";
  reviewedAt: string;
  classification: ReviewOnlyEvaluatorPreflightCheckpointClassification;
  intakeCheckpointStateAccepted: boolean;
  preflightCheckpointStateProduced: boolean;
  preflightCheckpointStateIsApprovalGrant: false;
  preflightCheckpointState: ReviewOnlyEvaluatorPreflightCheckpointState | null;
  checkpointSummary: {
    schema: "ardyn.phase-5.27.approval-evaluator-candidate-intake-state";
    stateKind: "approval-evaluator-candidate-intake-state";
    stateMode: "review-only";
    reviewedAt: string;
    stateDigest: string;
    intakeCheckpointStateIsApprovalGrant: false;
    approvalGrantProduced: false;
    approvalGrantPersisted: false;
    runtimeEffectAllFalse: true;
  } | null;
  reviewOnly: true;
  authoritative: false;
  approvalGrant: RuntimeApprovalGrantBlocked;
  approvalGrantProduced: false;
  approvalGrantPersisted: false;
  approvalGrantId: null;
  runtimePermissionGranted: false;
  commandExposurePermissionGranted: false;
  runtimeCommandExposureEnabled: false;
  runtimeExecutionEnabled: false;
  evaluatorExecutionRequested: false;
  evaluatorExecutionStarted: false;
  evaluatorExecutionEnabled: false;
  evaluatorExecuted: false;
  rejectionReasons: string[];
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
}

export interface NonAuthorizingEvaluatorDecisionCandidateState {
  schema: "ardyn.phase-5.29.review-only-evaluator-decision-candidate-state";
  schemaVersion: "0.1.0";
  stateKind: "review-only-evaluator-decision-candidate-state";
  stateMode: "review-only";
  reviewedAt: string;
  sourcePreflightCheckpointState: {
    schema: "ardyn.phase-5.28.review-only-evaluator-preflight-state";
    stateKind: "review-only-evaluator-preflight-state";
    stateMode: "review-only";
    reviewedAt: string;
    stateDigest: string;
    sourceIntakeCheckpointStateDigest: string;
    sourceEvaluatorInputCandidateDigest: string;
    preflightCheckpointStateIsApprovalGrant: false;
    approvalDecisionProduced: false;
    approvalGrantProduced: false;
    approvalGrantPersisted: false;
    evaluatorExecuted: false;
    runtimeEffectAllFalse: true;
  };
  pipelineSummary: {
    sourceCount: number;
    selectedSourceId: string | null;
    selectedBundlePartId: string | null;
    readerRecordCount: number;
    evaluatorClassification: string;
    prerequisiteSignalRecognized: true;
  };
  integratedReviewSummary: {
    schema: "ardyn.phase-5.18.review-only-approval-evaluator-result";
    evaluatorKind: "review-only-runtime-approval-evaluator";
    evaluationMode: "review-only";
    classification: string;
    prerequisiteSignalRecognized: true;
    reviewOnly: true;
    authoritative: false;
    reviewSummaryIsApprovalGrant: false;
    approvalGrantProduced: false;
    approvalGrantPersisted: false;
    approvalGrantId: null;
    runtimeEffectAllFalse: true;
  };
  decisionCandidateSummary: {
    candidateKind: "review-only-evaluator-decision-candidate";
    candidateMode: "review-only";
    candidateClassification:
      "valid_non_authorizing_evaluator_decision_candidate_runtime_still_blocked";
    reviewArtifactOnly: true;
    approvalDecisionProduced: false;
    approvalGrantProduced: false;
    runtimePermissionGranted: false;
    commandExposurePermissionGranted: false;
    evaluatorExecuted: false;
    runtimeEffectAllFalse: true;
  };
  decisionCandidateAccepted: true;
  reviewArtifactOnly: true;
  decisionCandidateStateIsApprovalDecision: false;
  decisionCandidateStateIsApprovalGrant: false;
  approvalDecisionProduced: false;
  approvalDecisionPersisted: false;
  approvalDecisionId: null;
  approvalGrantProduced: false;
  approvalGrantPersisted: false;
  approvalGrantId: null;
  runtimePermissionGranted: false;
  commandExposurePermissionGranted: false;
  runtimeCommandExposureEnabled: false;
  runtimeExecutionEnabled: false;
  evaluatorExecutionRequested: false;
  evaluatorExecutionStarted: false;
  evaluatorExecutionEnabled: false;
  evaluatorExecuted: false;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
}

export interface NonAuthorizingEvaluatorDecisionCandidateBoundaryResult {
  schema: "ardyn.phase-5.29.non-authorizing-evaluator-decision-candidate-boundary-result";
  schemaVersion: "0.1.0";
  boundaryKind: "non-authorizing-evaluator-decision-candidate-boundary";
  boundaryMode: "review-only";
  reviewedAt: string;
  classification: NonAuthorizingEvaluatorDecisionCandidateClassification;
  preflightCheckpointStateAccepted: boolean;
  decisionCandidateStateProduced: boolean;
  decisionCandidateStateIsApprovalDecision: false;
  decisionCandidateStateIsApprovalGrant: false;
  decisionCandidateState: NonAuthorizingEvaluatorDecisionCandidateState | null;
  decisionCandidateSummary: {
    schema: "ardyn.phase-5.28.review-only-evaluator-preflight-state";
    stateKind: "review-only-evaluator-preflight-state";
    stateMode: "review-only";
    reviewedAt: string;
    stateDigest: string;
    preflightCheckpointStateIsApprovalGrant: false;
    approvalDecisionProduced: false;
    approvalGrantProduced: false;
    approvalGrantPersisted: false;
    evaluatorExecuted: false;
    runtimeEffectAllFalse: true;
  } | null;
  reviewOnly: true;
  authoritative: false;
  reviewArtifactOnly: true;
  approvalDecisionProduced: false;
  approvalDecisionPersisted: false;
  approvalDecisionId: null;
  approvalGrant: RuntimeApprovalGrantBlocked;
  approvalGrantProduced: false;
  approvalGrantPersisted: false;
  approvalGrantId: null;
  runtimePermissionGranted: false;
  commandExposurePermissionGranted: false;
  runtimeCommandExposureEnabled: false;
  runtimeExecutionEnabled: false;
  evaluatorExecutionRequested: false;
  evaluatorExecutionStarted: false;
  evaluatorExecutionEnabled: false;
  evaluatorExecuted: false;
  rejectionReasons: string[];
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
}

export interface NonAuthorizingEvaluatorDecisionCandidateInspectionArtifact {
  schema: "ardyn.phase-5.30.non-authorizing-evaluator-decision-candidate-inspection-artifact";
  schemaVersion: "0.1.0";
  artifactKind: "non-authorizing-evaluator-decision-candidate-inspection-artifact";
  artifactMode: "review-only";
  reviewedAt: string;
  sourceDecisionCandidateState: {
    schema: "ardyn.phase-5.29.review-only-evaluator-decision-candidate-state";
    stateKind: "review-only-evaluator-decision-candidate-state";
    stateMode: "review-only";
    reviewedAt: string;
    stateDigest: string;
    sourcePreflightCheckpointStateDigest: string;
    sourceIntakeCheckpointStateDigest: string;
    sourceEvaluatorInputCandidateDigest: string;
    decisionCandidateAccepted: true;
    decisionCandidateStateIsApprovalDecision: false;
    decisionCandidateStateIsApprovalGrant: false;
    evaluatorResultProduced: false;
    approvalDecisionProduced: false;
    approvalGrantProduced: false;
    approvalGrantPersisted: false;
    evaluatorExecuted: false;
    runtimeEffectAllFalse: true;
  };
  pipelineSummary: NonAuthorizingEvaluatorDecisionCandidateState["pipelineSummary"];
  integratedReviewSummary: NonAuthorizingEvaluatorDecisionCandidateState["integratedReviewSummary"];
  decisionCandidateSummary: NonAuthorizingEvaluatorDecisionCandidateState["decisionCandidateSummary"];
  inspectionSummary: {
    artifactKind: "non-authorizing-evaluator-decision-candidate-inspection-artifact";
    artifactMode: "review-only";
    sourceDecisionCandidateClassification:
      "valid_non_authorizing_evaluator_decision_candidate_runtime_still_blocked";
    reviewArtifactOnly: true;
    evaluatorResultProduced: false;
    approvalDecisionProduced: false;
    approvalGrantProduced: false;
    runtimePermissionGranted: false;
    commandExposurePermissionGranted: false;
    evaluatorExecuted: false;
    runtimeEffectAllFalse: true;
  };
  inspectionArtifactOnly: true;
  inspectionArtifactIsApprovalDecision: false;
  inspectionArtifactIsApprovalGrant: false;
  evaluatorResultProduced: false;
  evaluatorResultPersisted: false;
  evaluatorResultId: null;
  approvalDecisionProduced: false;
  approvalDecisionPersisted: false;
  approvalDecisionId: null;
  approvalGrantProduced: false;
  approvalGrantPersisted: false;
  approvalGrantId: null;
  runtimePermissionGranted: false;
  commandExposurePermissionGranted: false;
  runtimeCommandExposureEnabled: false;
  runtimeExecutionEnabled: false;
  evaluatorExecutionRequested: false;
  evaluatorExecutionStarted: false;
  evaluatorExecutionEnabled: false;
  evaluatorExecuted: false;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
}

export interface NonAuthorizingEvaluatorDecisionCandidateInspectionArtifactResult {
  schema: "ardyn.phase-5.30.non-authorizing-evaluator-decision-candidate-inspection-artifact-result";
  schemaVersion: "0.1.0";
  artifactKind: "non-authorizing-evaluator-decision-candidate-inspection-artifact";
  artifactMode: "review-only";
  reviewedAt: string;
  classification: NonAuthorizingEvaluatorDecisionCandidateInspectionArtifactClassification;
  decisionCandidateStateAccepted: boolean;
  inspectionArtifactProduced: boolean;
  inspectionArtifactIsApprovalDecision: false;
  inspectionArtifactIsApprovalGrant: false;
  inspectionArtifact: NonAuthorizingEvaluatorDecisionCandidateInspectionArtifact | null;
  inspectionSummary: {
    schema: "ardyn.phase-5.29.review-only-evaluator-decision-candidate-state";
    stateKind: "review-only-evaluator-decision-candidate-state";
    stateMode: "review-only";
    reviewedAt: string;
    stateDigest: string;
    decisionCandidateStateIsApprovalDecision: false;
    decisionCandidateStateIsApprovalGrant: false;
    evaluatorResultProduced: false;
    approvalDecisionProduced: false;
    approvalGrantProduced: false;
    approvalGrantPersisted: false;
    evaluatorExecuted: false;
    runtimeEffectAllFalse: true;
  } | null;
  reviewOnly: true;
  authoritative: false;
  reviewArtifactOnly: true;
  evaluatorResultProduced: false;
  evaluatorResultPersisted: false;
  evaluatorResultId: null;
  approvalDecisionProduced: false;
  approvalDecisionPersisted: false;
  approvalDecisionId: null;
  approvalGrant: RuntimeApprovalGrantBlocked;
  approvalGrantProduced: false;
  approvalGrantPersisted: false;
  approvalGrantId: null;
  runtimePermissionGranted: false;
  commandExposurePermissionGranted: false;
  runtimeCommandExposureEnabled: false;
  runtimeExecutionEnabled: false;
  evaluatorExecutionRequested: false;
  evaluatorExecutionStarted: false;
  evaluatorExecutionEnabled: false;
  evaluatorExecuted: false;
  rejectionReasons: string[];
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
}

export interface HumanToolInspectionDispositionState {
  schema: "ardyn.phase-5.31.review-only-human-tool-inspection-disposition-state";
  schemaVersion: "0.1.0";
  stateKind: "review-only-human-tool-inspection-disposition-state";
  stateMode: "review-only";
  reviewedAt: string;
  sourceInspectionArtifact: {
    schema: "ardyn.phase-5.30.non-authorizing-evaluator-decision-candidate-inspection-artifact";
    artifactKind: "non-authorizing-evaluator-decision-candidate-inspection-artifact";
    artifactMode: "review-only";
    reviewedAt: string;
    artifactDigest: string;
    sourceDecisionCandidateStateDigest: string;
    sourcePreflightCheckpointStateDigest: string;
    sourceIntakeCheckpointStateDigest: string;
    sourceEvaluatorInputCandidateDigest: string;
    inspectionArtifactOnly: true;
    inspectionArtifactIsApprovalDecision: false;
    inspectionArtifactIsApprovalGrant: false;
    evaluatorResultProduced: false;
    approvalDecisionProduced: false;
    approvalGrantProduced: false;
    approvalGrantPersisted: false;
    evaluatorExecuted: false;
    runtimeEffectAllFalse: true;
  };
  pipelineSummary: NonAuthorizingEvaluatorDecisionCandidateInspectionArtifact["pipelineSummary"];
  integratedReviewSummary: NonAuthorizingEvaluatorDecisionCandidateInspectionArtifact["integratedReviewSummary"];
  decisionCandidateSummary: NonAuthorizingEvaluatorDecisionCandidateInspectionArtifact["decisionCandidateSummary"];
  inspectionSummary: NonAuthorizingEvaluatorDecisionCandidateInspectionArtifact["inspectionSummary"];
  dispositionSummary: {
    dispositionKind: "review-only-human-tool-inspection-disposition";
    dispositionMode: "review-only";
    sourceInspectionArtifactClassification:
      "valid_non_authorizing_evaluator_decision_candidate_inspection_artifact_runtime_still_blocked";
    reviewArtifactOnly: true;
    evaluatorResultProduced: false;
    approvalDecisionProduced: false;
    approvalGrantProduced: false;
    runtimePermissionGranted: false;
    commandExposurePermissionGranted: false;
    evaluatorExecuted: false;
    runtimeEffectAllFalse: true;
  };
  inspectionArtifactAccepted: true;
  reviewArtifactOnly: true;
  dispositionStateIsApprovalDecision: false;
  dispositionStateIsApprovalGrant: false;
  evaluatorResultProduced: false;
  evaluatorResultPersisted: false;
  evaluatorResultId: null;
  approvalDecisionProduced: false;
  approvalDecisionPersisted: false;
  approvalDecisionId: null;
  approvalGrantProduced: false;
  approvalGrantPersisted: false;
  approvalGrantId: null;
  runtimePermissionGranted: false;
  commandExposurePermissionGranted: false;
  runtimeCommandExposureEnabled: false;
  runtimeExecutionEnabled: false;
  evaluatorExecutionRequested: false;
  evaluatorExecutionStarted: false;
  evaluatorExecutionEnabled: false;
  evaluatorExecuted: false;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
}

export interface HumanToolInspectionDispositionBoundaryResult {
  schema: "ardyn.phase-5.31.human-tool-inspection-disposition-boundary-result";
  schemaVersion: "0.1.0";
  boundaryKind: "human-tool-inspection-disposition-boundary";
  boundaryMode: "review-only";
  reviewedAt: string;
  classification: HumanToolInspectionDispositionBoundaryClassification;
  inspectionArtifactAccepted: boolean;
  dispositionStateProduced: boolean;
  dispositionStateIsApprovalDecision: false;
  dispositionStateIsApprovalGrant: false;
  dispositionState: HumanToolInspectionDispositionState | null;
  dispositionSummary: {
    schema: "ardyn.phase-5.30.non-authorizing-evaluator-decision-candidate-inspection-artifact";
    artifactKind: "non-authorizing-evaluator-decision-candidate-inspection-artifact";
    artifactMode: "review-only";
    reviewedAt: string;
    artifactDigest: string;
    inspectionArtifactIsApprovalDecision: false;
    inspectionArtifactIsApprovalGrant: false;
    evaluatorResultProduced: false;
    approvalDecisionProduced: false;
    approvalGrantProduced: false;
    approvalGrantPersisted: false;
    evaluatorExecuted: false;
    runtimeEffectAllFalse: true;
  } | null;
  reviewOnly: true;
  authoritative: false;
  reviewArtifactOnly: true;
  evaluatorResultProduced: false;
  evaluatorResultPersisted: false;
  evaluatorResultId: null;
  approvalDecisionProduced: false;
  approvalDecisionPersisted: false;
  approvalDecisionId: null;
  approvalGrant: RuntimeApprovalGrantBlocked;
  approvalGrantProduced: false;
  approvalGrantPersisted: false;
  approvalGrantId: null;
  runtimePermissionGranted: false;
  commandExposurePermissionGranted: false;
  runtimeCommandExposureEnabled: false;
  runtimeExecutionEnabled: false;
  evaluatorExecutionRequested: false;
  evaluatorExecutionStarted: false;
  evaluatorExecutionEnabled: false;
  evaluatorExecuted: false;
  rejectionReasons: string[];
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
}

export interface ReviewOnlyDispositionAggregationState {
  schema: "ardyn.phase-5.32.review-only-disposition-aggregation-state";
  schemaVersion: "0.1.0";
  stateKind: "review-only-disposition-aggregation-state";
  stateMode: "review-only";
  reviewedAt: string;
  sourceDispositionState: {
    schema: "ardyn.phase-5.31.review-only-human-tool-inspection-disposition-state";
    stateKind: "review-only-human-tool-inspection-disposition-state";
    stateMode: "review-only";
    reviewedAt: string;
    stateDigest: string;
    sourceInspectionArtifactDigest: string;
    sourceDecisionCandidateStateDigest: string;
    sourcePreflightCheckpointStateDigest: string;
    sourceIntakeCheckpointStateDigest: string;
    sourceEvaluatorInputCandidateDigest: string;
    inspectionArtifactAccepted: true;
    reviewArtifactOnly: true;
    dispositionStateIsApprovalDecision: false;
    dispositionStateIsApprovalGrant: false;
    evaluatorResultProduced: false;
    approvalDecisionProduced: false;
    approvalGrantProduced: false;
    approvalGrantPersisted: false;
    evaluatorExecuted: false;
    runtimeEffectAllFalse: true;
  };
  pipelineSummary: HumanToolInspectionDispositionState["pipelineSummary"];
  integratedReviewSummary: HumanToolInspectionDispositionState["integratedReviewSummary"];
  decisionCandidateSummary: HumanToolInspectionDispositionState["decisionCandidateSummary"];
  inspectionSummary: HumanToolInspectionDispositionState["inspectionSummary"];
  dispositionSummary: HumanToolInspectionDispositionState["dispositionSummary"];
  aggregationSummary: {
    aggregationKind: "review-only-disposition-aggregation-checkpoint";
    aggregationMode: "review-only";
    sourceDispositionClassification:
      "valid_human_tool_inspection_disposition_boundary_runtime_still_blocked";
    aggregationMetadataOnly: true;
    reviewerRoutingPerformed: false;
    evaluatorResultProduced: false;
    approvalDecisionProduced: false;
    approvalGrantProduced: false;
    runtimePermissionGranted: false;
    commandExposurePermissionGranted: false;
    evaluatorExecuted: false;
    runtimeEffectAllFalse: true;
  };
  dispositionStateAccepted: true;
  aggregationMetadataOnly: true;
  aggregationCheckpointIsReviewerRouting: false;
  aggregationCheckpointIsApprovalDecision: false;
  aggregationCheckpointIsApprovalGrant: false;
  reviewerRoutingPerformed: false;
  reviewerRoutingEnabled: false;
  reviewerRouteId: null;
  evaluatorResultProduced: false;
  evaluatorResultPersisted: false;
  evaluatorResultId: null;
  approvalDecisionProduced: false;
  approvalDecisionPersisted: false;
  approvalDecisionId: null;
  approvalGrantProduced: false;
  approvalGrantPersisted: false;
  approvalGrantId: null;
  runtimePermissionGranted: false;
  commandExposurePermissionGranted: false;
  runtimeCommandExposureEnabled: false;
  runtimeExecutionEnabled: false;
  evaluatorExecutionRequested: false;
  evaluatorExecutionStarted: false;
  evaluatorExecutionEnabled: false;
  evaluatorExecuted: false;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
}

export interface ReviewOnlyDispositionAggregationCheckpointResult {
  schema: "ardyn.phase-5.32.review-only-disposition-aggregation-checkpoint-result";
  schemaVersion: "0.1.0";
  checkpointKind: "review-only-disposition-aggregation-checkpoint";
  checkpointMode: "review-only";
  reviewedAt: string;
  classification: ReviewOnlyDispositionAggregationCheckpointClassification;
  dispositionStateAccepted: boolean;
  aggregationStateProduced: boolean;
  aggregationCheckpointIsReviewerRouting: false;
  aggregationCheckpointIsApprovalDecision: false;
  aggregationCheckpointIsApprovalGrant: false;
  aggregationState: ReviewOnlyDispositionAggregationState | null;
  aggregationSummary: {
    schema: "ardyn.phase-5.31.review-only-human-tool-inspection-disposition-state";
    stateKind: "review-only-human-tool-inspection-disposition-state";
    stateMode: "review-only";
    reviewedAt: string;
    stateDigest: string;
    dispositionStateIsApprovalDecision: false;
    dispositionStateIsApprovalGrant: false;
    reviewerRoutingPerformed: false;
    evaluatorResultProduced: false;
    approvalDecisionProduced: false;
    approvalGrantProduced: false;
    approvalGrantPersisted: false;
    evaluatorExecuted: false;
    runtimeEffectAllFalse: true;
  } | null;
  reviewOnly: true;
  authoritative: false;
  reviewArtifactOnly: true;
  aggregationMetadataOnly: true;
  reviewerRoutingPerformed: false;
  reviewerRoutingEnabled: false;
  reviewerRouteId: null;
  evaluatorResultProduced: false;
  evaluatorResultPersisted: false;
  evaluatorResultId: null;
  approvalDecisionProduced: false;
  approvalDecisionPersisted: false;
  approvalDecisionId: null;
  approvalGrant: RuntimeApprovalGrantBlocked;
  approvalGrantProduced: false;
  approvalGrantPersisted: false;
  approvalGrantId: null;
  runtimePermissionGranted: false;
  commandExposurePermissionGranted: false;
  runtimeCommandExposureEnabled: false;
  runtimeExecutionEnabled: false;
  evaluatorExecutionRequested: false;
  evaluatorExecutionStarted: false;
  evaluatorExecutionEnabled: false;
  evaluatorExecuted: false;
  rejectionReasons: string[];
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
}

export interface ReviewOnlyAggregationInspectionHandoffState {
  schema: "ardyn.phase-5.33.review-only-aggregation-inspection-handoff-state";
  schemaVersion: "0.1.0";
  stateKind: "review-only-aggregation-inspection-handoff-state";
  stateMode: "review-only";
  reviewedAt: string;
  sourceAggregationState: {
    schema: "ardyn.phase-5.32.review-only-disposition-aggregation-state";
    stateKind: "review-only-disposition-aggregation-state";
    stateMode: "review-only";
    reviewedAt: string;
    stateDigest: string;
    sourceDispositionStateDigest: string;
    sourceInspectionArtifactDigest: string;
    sourceDecisionCandidateStateDigest: string;
    sourcePreflightCheckpointStateDigest: string;
    sourceIntakeCheckpointStateDigest: string;
    sourceEvaluatorInputCandidateDigest: string;
    dispositionStateAccepted: true;
    aggregationMetadataOnly: true;
    aggregationCheckpointIsReviewerRouting: false;
    aggregationCheckpointIsApprovalDecision: false;
    aggregationCheckpointIsApprovalGrant: false;
    reviewerRoutingPerformed: false;
    evaluatorResultProduced: false;
    approvalDecisionProduced: false;
    approvalGrantProduced: false;
    approvalGrantPersisted: false;
    evaluatorExecuted: false;
    runtimeEffectAllFalse: true;
  };
  pipelineSummary: ReviewOnlyDispositionAggregationState["pipelineSummary"];
  integratedReviewSummary: ReviewOnlyDispositionAggregationState["integratedReviewSummary"];
  decisionCandidateSummary: ReviewOnlyDispositionAggregationState["decisionCandidateSummary"];
  inspectionSummary: ReviewOnlyDispositionAggregationState["inspectionSummary"];
  dispositionSummary: ReviewOnlyDispositionAggregationState["dispositionSummary"];
  aggregationSummary: ReviewOnlyDispositionAggregationState["aggregationSummary"];
  handoffSummary: {
    handoffKind: "review-only-aggregation-inspection-handoff";
    handoffMode: "review-only";
    sourceAggregationClassification:
      "valid_review_only_disposition_aggregation_checkpoint_runtime_still_blocked";
    inspectionHandoffMetadataOnly: true;
    reviewerRoutingPerformed: false;
    evaluatorExecutionPerformed: false;
    evaluatorResultProduced: false;
    approvalDecisionProduced: false;
    approvalGrantProduced: false;
    runtimePermissionGranted: false;
    commandExposurePermissionGranted: false;
    evaluatorExecuted: false;
    runtimeEffectAllFalse: true;
  };
  aggregationStateAccepted: true;
  inspectionHandoffMetadataOnly: true;
  handoffIsReviewerRouting: false;
  handoffIsEvaluatorExecution: false;
  handoffIsEvaluatorResult: false;
  handoffIsApprovalDecision: false;
  handoffIsApprovalGrant: false;
  reviewerRoutingPerformed: false;
  reviewerRoutingEnabled: false;
  reviewerRouteId: null;
  evaluatorResultProduced: false;
  evaluatorResultPersisted: false;
  evaluatorResultId: null;
  approvalDecisionProduced: false;
  approvalDecisionPersisted: false;
  approvalDecisionId: null;
  approvalGrantProduced: false;
  approvalGrantPersisted: false;
  approvalGrantId: null;
  runtimePermissionGranted: false;
  commandExposurePermissionGranted: false;
  runtimeCommandExposureEnabled: false;
  runtimeExecutionEnabled: false;
  evaluatorExecutionRequested: false;
  evaluatorExecutionStarted: false;
  evaluatorExecutionEnabled: false;
  evaluatorExecuted: false;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
}

export interface ReviewOnlyAggregationInspectionHandoffResult {
  schema: "ardyn.phase-5.33.review-only-aggregation-inspection-handoff-result";
  schemaVersion: "0.1.0";
  handoffKind: "review-only-aggregation-inspection-handoff";
  handoffMode: "review-only";
  reviewedAt: string;
  classification: ReviewOnlyAggregationInspectionHandoffClassification;
  aggregationStateAccepted: boolean;
  inspectionHandoffStateProduced: boolean;
  handoffIsReviewerRouting: false;
  handoffIsEvaluatorExecution: false;
  handoffIsEvaluatorResult: false;
  handoffIsApprovalDecision: false;
  handoffIsApprovalGrant: false;
  inspectionHandoffState: ReviewOnlyAggregationInspectionHandoffState | null;
  aggregationSummary: {
    schema: "ardyn.phase-5.32.review-only-disposition-aggregation-state";
    stateKind: "review-only-disposition-aggregation-state";
    stateMode: "review-only";
    reviewedAt: string;
    stateDigest: string;
    aggregationCheckpointIsReviewerRouting: false;
    aggregationCheckpointIsApprovalDecision: false;
    aggregationCheckpointIsApprovalGrant: false;
    reviewerRoutingPerformed: false;
    evaluatorResultProduced: false;
    approvalDecisionProduced: false;
    approvalGrantProduced: false;
    approvalGrantPersisted: false;
    evaluatorExecuted: false;
    runtimeEffectAllFalse: true;
  } | null;
  reviewOnly: true;
  authoritative: false;
  reviewArtifactOnly: true;
  inspectionHandoffMetadataOnly: true;
  reviewerRoutingPerformed: false;
  reviewerRoutingEnabled: false;
  reviewerRouteId: null;
  evaluatorResultProduced: false;
  evaluatorResultPersisted: false;
  evaluatorResultId: null;
  approvalDecisionProduced: false;
  approvalDecisionPersisted: false;
  approvalDecisionId: null;
  approvalGrant: RuntimeApprovalGrantBlocked;
  approvalGrantProduced: false;
  approvalGrantPersisted: false;
  approvalGrantId: null;
  runtimePermissionGranted: false;
  commandExposurePermissionGranted: false;
  runtimeCommandExposureEnabled: false;
  runtimeExecutionEnabled: false;
  evaluatorExecutionRequested: false;
  evaluatorExecutionStarted: false;
  evaluatorExecutionEnabled: false;
  evaluatorExecuted: false;
  rejectionReasons: string[];
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
}

export interface ReviewOnlyHandoffReadinessArtifactState {
  schema: "ardyn.phase-5.34.review-only-handoff-readiness-artifact-state";
  schemaVersion: "0.1.0";
  stateKind: "review-only-handoff-readiness-artifact-state";
  stateMode: "review-only";
  reviewedAt: string;
  sourceInspectionHandoffState: {
    schema: "ardyn.phase-5.33.review-only-aggregation-inspection-handoff-state";
    stateKind: "review-only-aggregation-inspection-handoff-state";
    stateMode: "review-only";
    reviewedAt: string;
    stateDigest: string;
    sourceAggregationStateDigest: string;
    sourceDispositionStateDigest: string;
    sourceInspectionArtifactDigest: string;
    sourceDecisionCandidateStateDigest: string;
    sourcePreflightCheckpointStateDigest: string;
    sourceIntakeCheckpointStateDigest: string;
    sourceEvaluatorInputCandidateDigest: string;
    aggregationStateAccepted: true;
    inspectionHandoffMetadataOnly: true;
    handoffIsReviewerRouting: false;
    handoffIsEvaluatorExecution: false;
    handoffIsEvaluatorResult: false;
    handoffIsApprovalDecision: false;
    handoffIsApprovalGrant: false;
    reviewerRoutingPerformed: false;
    reviewerAssignmentPerformed: false;
    evaluatorResultProduced: false;
    approvalDecisionProduced: false;
    approvalGrantProduced: false;
    approvalGrantPersisted: false;
    evaluatorExecuted: false;
    runtimeEffectAllFalse: true;
  };
  pipelineSummary: ReviewOnlyAggregationInspectionHandoffState["pipelineSummary"];
  integratedReviewSummary: ReviewOnlyAggregationInspectionHandoffState["integratedReviewSummary"];
  decisionCandidateSummary: ReviewOnlyAggregationInspectionHandoffState["decisionCandidateSummary"];
  inspectionSummary: ReviewOnlyAggregationInspectionHandoffState["inspectionSummary"];
  dispositionSummary: ReviewOnlyAggregationInspectionHandoffState["dispositionSummary"];
  aggregationSummary: ReviewOnlyAggregationInspectionHandoffState["aggregationSummary"];
  handoffSummary: ReviewOnlyAggregationInspectionHandoffState["handoffSummary"];
  readinessSummary: {
    readinessKind: "review-only-handoff-readiness-artifact";
    readinessMode: "review-only";
    sourceHandoffClassification:
      "valid_review_only_aggregation_inspection_handoff_runtime_still_blocked";
    readinessArtifactMetadataOnly: true;
    reviewerRoutingPerformed: false;
    reviewerAssignmentPerformed: false;
    evaluatorExecutionPerformed: false;
    evaluatorResultProduced: false;
    approvalDecisionProduced: false;
    approvalGrantProduced: false;
    runtimePermissionGranted: false;
    commandExposurePermissionGranted: false;
    evaluatorExecuted: false;
    runtimeEffectAllFalse: true;
  };
  handoffStateAccepted: true;
  readinessArtifactMetadataOnly: true;
  readinessArtifactIsReviewerRouting: false;
  readinessArtifactIsReviewerAssignment: false;
  readinessArtifactIsEvaluatorExecution: false;
  readinessArtifactIsEvaluatorResult: false;
  readinessArtifactIsApprovalDecision: false;
  readinessArtifactIsApprovalGrant: false;
  reviewerRoutingPerformed: false;
  reviewerRoutingEnabled: false;
  reviewerRouteId: null;
  reviewerAssignmentPerformed: false;
  reviewerAssignmentEnabled: false;
  reviewerAssignmentId: null;
  reviewerId: null;
  evaluatorResultProduced: false;
  evaluatorResultPersisted: false;
  evaluatorResultId: null;
  approvalDecisionProduced: false;
  approvalDecisionPersisted: false;
  approvalDecisionId: null;
  approvalGrantProduced: false;
  approvalGrantPersisted: false;
  approvalGrantId: null;
  runtimePermissionGranted: false;
  commandExposurePermissionGranted: false;
  runtimeCommandExposureEnabled: false;
  runtimeExecutionEnabled: false;
  evaluatorExecutionRequested: false;
  evaluatorExecutionStarted: false;
  evaluatorExecutionEnabled: false;
  evaluatorExecuted: false;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
}

export interface ReviewOnlyHandoffReadinessArtifactResult {
  schema: "ardyn.phase-5.34.review-only-handoff-readiness-artifact-result";
  schemaVersion: "0.1.0";
  artifactKind: "review-only-handoff-readiness-artifact";
  artifactMode: "review-only";
  reviewedAt: string;
  classification: ReviewOnlyHandoffReadinessArtifactClassification;
  handoffStateAccepted: boolean;
  readinessArtifactProduced: boolean;
  readinessArtifactIsReviewerRouting: false;
  readinessArtifactIsReviewerAssignment: false;
  readinessArtifactIsEvaluatorExecution: false;
  readinessArtifactIsEvaluatorResult: false;
  readinessArtifactIsApprovalDecision: false;
  readinessArtifactIsApprovalGrant: false;
  readinessArtifact: ReviewOnlyHandoffReadinessArtifactState | null;
  handoffSummary: {
    schema: "ardyn.phase-5.33.review-only-aggregation-inspection-handoff-state";
    stateKind: "review-only-aggregation-inspection-handoff-state";
    stateMode: "review-only";
    reviewedAt: string;
    stateDigest: string;
    handoffIsReviewerRouting: false;
    handoffIsEvaluatorExecution: false;
    handoffIsEvaluatorResult: false;
    handoffIsApprovalDecision: false;
    handoffIsApprovalGrant: false;
    reviewerRoutingPerformed: false;
    reviewerAssignmentPerformed: false;
    evaluatorResultProduced: false;
    approvalDecisionProduced: false;
    approvalGrantProduced: false;
    approvalGrantPersisted: false;
    evaluatorExecuted: false;
    runtimeEffectAllFalse: true;
  } | null;
  reviewOnly: true;
  authoritative: false;
  reviewArtifactOnly: true;
  readinessArtifactMetadataOnly: true;
  reviewerRoutingPerformed: false;
  reviewerRoutingEnabled: false;
  reviewerRouteId: null;
  reviewerAssignmentPerformed: false;
  reviewerAssignmentEnabled: false;
  reviewerAssignmentId: null;
  reviewerId: null;
  evaluatorResultProduced: false;
  evaluatorResultPersisted: false;
  evaluatorResultId: null;
  approvalDecisionProduced: false;
  approvalDecisionPersisted: false;
  approvalDecisionId: null;
  approvalGrant: RuntimeApprovalGrantBlocked;
  approvalGrantProduced: false;
  approvalGrantPersisted: false;
  approvalGrantId: null;
  runtimePermissionGranted: false;
  commandExposurePermissionGranted: false;
  runtimeCommandExposureEnabled: false;
  runtimeExecutionEnabled: false;
  evaluatorExecutionRequested: false;
  evaluatorExecutionStarted: false;
  evaluatorExecutionEnabled: false;
  evaluatorExecuted: false;
  rejectionReasons: string[];
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
}

export interface ReviewOnlyReadinessInspectionCheckpointState {
  schema: "ardyn.phase-5.35.review-only-readiness-inspection-checkpoint-state";
  schemaVersion: "0.1.0";
  stateKind: "review-only-readiness-inspection-checkpoint-state";
  stateMode: "review-only";
  reviewedAt: string;
  sourceHandoffReadinessArtifact: {
    schema: "ardyn.phase-5.34.review-only-handoff-readiness-artifact-state";
    stateKind: "review-only-handoff-readiness-artifact-state";
    stateMode: "review-only";
    reviewedAt: string;
    stateDigest: string;
    sourceInspectionHandoffStateDigest: string;
    sourceAggregationStateDigest: string;
    sourceDispositionStateDigest: string;
    sourceInspectionArtifactDigest: string;
    sourceDecisionCandidateStateDigest: string;
    sourcePreflightCheckpointStateDigest: string;
    sourceIntakeCheckpointStateDigest: string;
    sourceEvaluatorInputCandidateDigest: string;
    handoffStateAccepted: true;
    readinessArtifactMetadataOnly: true;
    readinessArtifactIsReviewerRouting: false;
    readinessArtifactIsReviewerAssignment: false;
    readinessArtifactIsEvaluatorExecution: false;
    readinessArtifactIsEvaluatorResult: false;
    readinessArtifactIsApprovalDecision: false;
    readinessArtifactIsApprovalGrant: false;
    reviewerRoutingPerformed: false;
    reviewerAssignmentPerformed: false;
    evaluatorResultProduced: false;
    approvalDecisionProduced: false;
    approvalGrantProduced: false;
    approvalGrantPersisted: false;
    evaluatorExecuted: false;
    runtimeEffectAllFalse: true;
  };
  pipelineSummary: ReviewOnlyHandoffReadinessArtifactState["pipelineSummary"];
  integratedReviewSummary: ReviewOnlyHandoffReadinessArtifactState["integratedReviewSummary"];
  decisionCandidateSummary: ReviewOnlyHandoffReadinessArtifactState["decisionCandidateSummary"];
  inspectionSummary: ReviewOnlyHandoffReadinessArtifactState["inspectionSummary"];
  dispositionSummary: ReviewOnlyHandoffReadinessArtifactState["dispositionSummary"];
  aggregationSummary: ReviewOnlyHandoffReadinessArtifactState["aggregationSummary"];
  handoffSummary: ReviewOnlyHandoffReadinessArtifactState["handoffSummary"];
  readinessSummary: ReviewOnlyHandoffReadinessArtifactState["readinessSummary"];
  inspectionCheckpointSummary: {
    checkpointKind: "review-only-readiness-inspection-checkpoint";
    checkpointMode: "review-only";
    sourceReadinessClassification:
      "valid_review_only_handoff_readiness_artifact_runtime_still_blocked";
    readinessInspectionCheckpointMetadataOnly: true;
    reviewerRoutingPerformed: false;
    reviewerAssignmentPerformed: false;
    evaluatorExecutionPerformed: false;
    evaluatorResultProduced: false;
    approvalDecisionProduced: false;
    approvalGrantProduced: false;
    runtimePermissionGranted: false;
    commandExposurePermissionGranted: false;
    evaluatorExecuted: false;
    runtimeEffectAllFalse: true;
  };
  readinessArtifactAccepted: true;
  readinessInspectionCheckpointMetadataOnly: true;
  readinessInspectionCheckpointIsReviewerRouting: false;
  readinessInspectionCheckpointIsReviewerAssignment: false;
  readinessInspectionCheckpointIsEvaluatorExecution: false;
  readinessInspectionCheckpointIsEvaluatorResult: false;
  readinessInspectionCheckpointIsApprovalDecision: false;
  readinessInspectionCheckpointIsApprovalGrant: false;
  reviewerRoutingPerformed: false;
  reviewerRoutingEnabled: false;
  reviewerRouteId: null;
  reviewerAssignmentPerformed: false;
  reviewerAssignmentEnabled: false;
  reviewerAssignmentId: null;
  reviewerId: null;
  evaluatorResultProduced: false;
  evaluatorResultPersisted: false;
  evaluatorResultId: null;
  approvalDecisionProduced: false;
  approvalDecisionPersisted: false;
  approvalDecisionId: null;
  approvalGrantProduced: false;
  approvalGrantPersisted: false;
  approvalGrantId: null;
  runtimePermissionGranted: false;
  commandExposurePermissionGranted: false;
  runtimeCommandExposureEnabled: false;
  runtimeExecutionEnabled: false;
  evaluatorExecutionRequested: false;
  evaluatorExecutionStarted: false;
  evaluatorExecutionEnabled: false;
  evaluatorExecuted: false;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
}

export interface ReviewOnlyReadinessInspectionCheckpointResult {
  schema: "ardyn.phase-5.35.review-only-readiness-inspection-checkpoint-result";
  schemaVersion: "0.1.0";
  artifactKind: "review-only-readiness-inspection-checkpoint";
  artifactMode: "review-only";
  reviewedAt: string;
  classification: ReviewOnlyReadinessInspectionCheckpointClassification;
  readinessArtifactAccepted: boolean;
  readinessInspectionCheckpointProduced: boolean;
  readinessInspectionCheckpointIsReviewerRouting: false;
  readinessInspectionCheckpointIsReviewerAssignment: false;
  readinessInspectionCheckpointIsEvaluatorExecution: false;
  readinessInspectionCheckpointIsEvaluatorResult: false;
  readinessInspectionCheckpointIsApprovalDecision: false;
  readinessInspectionCheckpointIsApprovalGrant: false;
  readinessInspectionCheckpoint:
    | ReviewOnlyReadinessInspectionCheckpointState
    | null;
  readinessArtifactSummary: {
    schema: "ardyn.phase-5.34.review-only-handoff-readiness-artifact-state";
    stateKind: "review-only-handoff-readiness-artifact-state";
    stateMode: "review-only";
    reviewedAt: string;
    stateDigest: string;
    readinessArtifactIsReviewerRouting: false;
    readinessArtifactIsReviewerAssignment: false;
    readinessArtifactIsEvaluatorExecution: false;
    readinessArtifactIsEvaluatorResult: false;
    readinessArtifactIsApprovalDecision: false;
    readinessArtifactIsApprovalGrant: false;
    reviewerRoutingPerformed: false;
    reviewerAssignmentPerformed: false;
    evaluatorResultProduced: false;
    approvalDecisionProduced: false;
    approvalGrantProduced: false;
    approvalGrantPersisted: false;
    evaluatorExecuted: false;
    runtimeEffectAllFalse: true;
  } | null;
  reviewOnly: true;
  authoritative: false;
  reviewArtifactOnly: true;
  readinessInspectionCheckpointMetadataOnly: true;
  reviewerRoutingPerformed: false;
  reviewerRoutingEnabled: false;
  reviewerRouteId: null;
  reviewerAssignmentPerformed: false;
  reviewerAssignmentEnabled: false;
  reviewerAssignmentId: null;
  reviewerId: null;
  evaluatorResultProduced: false;
  evaluatorResultPersisted: false;
  evaluatorResultId: null;
  approvalDecisionProduced: false;
  approvalDecisionPersisted: false;
  approvalDecisionId: null;
  approvalGrant: RuntimeApprovalGrantBlocked;
  approvalGrantProduced: false;
  approvalGrantPersisted: false;
  approvalGrantId: null;
  runtimePermissionGranted: false;
  commandExposurePermissionGranted: false;
  runtimeCommandExposureEnabled: false;
  runtimeExecutionEnabled: false;
  evaluatorExecutionRequested: false;
  evaluatorExecutionStarted: false;
  evaluatorExecutionEnabled: false;
  evaluatorExecuted: false;
  rejectionReasons: string[];
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
}

export interface ReviewOnlyReadinessHandoffDispositionState {
  schema: "ardyn.phase-5.36.review-only-readiness-handoff-disposition-state";
  schemaVersion: "0.1.0";
  stateKind: "review-only-readiness-handoff-disposition-state";
  stateMode: "review-only";
  reviewedAt: string;
  sourceReadinessInspectionCheckpoint: {
    schema: "ardyn.phase-5.35.review-only-readiness-inspection-checkpoint-state";
    stateKind: "review-only-readiness-inspection-checkpoint-state";
    stateMode: "review-only";
    reviewedAt: string;
    stateDigest: string;
    sourceHandoffReadinessArtifactDigest: string;
    sourceInspectionHandoffStateDigest: string;
    sourceAggregationStateDigest: string;
    sourceDispositionStateDigest: string;
    sourceInspectionArtifactDigest: string;
    sourceDecisionCandidateStateDigest: string;
    sourcePreflightCheckpointStateDigest: string;
    sourceIntakeCheckpointStateDigest: string;
    sourceEvaluatorInputCandidateDigest: string;
    readinessArtifactAccepted: true;
    readinessInspectionCheckpointMetadataOnly: true;
    readinessInspectionCheckpointIsReviewerRouting: false;
    readinessInspectionCheckpointIsReviewerAssignment: false;
    readinessInspectionCheckpointIsEvaluatorExecution: false;
    readinessInspectionCheckpointIsEvaluatorResult: false;
    readinessInspectionCheckpointIsApprovalDecision: false;
    readinessInspectionCheckpointIsApprovalGrant: false;
    reviewerRoutingPerformed: false;
    reviewerAssignmentPerformed: false;
    evaluatorResultProduced: false;
    approvalDecisionProduced: false;
    approvalGrantProduced: false;
    approvalGrantPersisted: false;
    evaluatorExecuted: false;
    runtimeEffectAllFalse: true;
  };
  pipelineSummary: ReviewOnlyReadinessInspectionCheckpointState["pipelineSummary"];
  integratedReviewSummary: ReviewOnlyReadinessInspectionCheckpointState["integratedReviewSummary"];
  decisionCandidateSummary: ReviewOnlyReadinessInspectionCheckpointState["decisionCandidateSummary"];
  inspectionSummary: ReviewOnlyReadinessInspectionCheckpointState["inspectionSummary"];
  dispositionSummary: ReviewOnlyReadinessInspectionCheckpointState["dispositionSummary"];
  aggregationSummary: ReviewOnlyReadinessInspectionCheckpointState["aggregationSummary"];
  handoffSummary: ReviewOnlyReadinessInspectionCheckpointState["handoffSummary"];
  readinessSummary: ReviewOnlyReadinessInspectionCheckpointState["readinessSummary"];
  inspectionCheckpointSummary: ReviewOnlyReadinessInspectionCheckpointState["inspectionCheckpointSummary"];
  readinessHandoffDispositionSummary: {
    dispositionKind: "review-only-readiness-handoff-disposition";
    dispositionMode: "review-only";
    sourceReadinessInspectionClassification:
      "valid_review_only_readiness_inspection_checkpoint_runtime_still_blocked";
    readinessHandoffDispositionMetadataOnly: true;
    reviewerRoutingPerformed: false;
    reviewerAssignmentPerformed: false;
    evaluatorExecutionPerformed: false;
    evaluatorResultProduced: false;
    approvalDecisionProduced: false;
    approvalGrantProduced: false;
    runtimePermissionGranted: false;
    commandExposurePermissionGranted: false;
    evaluatorExecuted: false;
    runtimeEffectAllFalse: true;
  };
  readinessInspectionCheckpointAccepted: true;
  readinessHandoffDispositionMetadataOnly: true;
  readinessHandoffDispositionIsReviewerRouting: false;
  readinessHandoffDispositionIsReviewerAssignment: false;
  readinessHandoffDispositionIsEvaluatorExecution: false;
  readinessHandoffDispositionIsEvaluatorResult: false;
  readinessHandoffDispositionIsApprovalDecision: false;
  readinessHandoffDispositionIsApprovalGrant: false;
  reviewerRoutingPerformed: false;
  reviewerRoutingEnabled: false;
  reviewerRouteId: null;
  reviewerAssignmentPerformed: false;
  reviewerAssignmentEnabled: false;
  reviewerAssignmentId: null;
  reviewerId: null;
  evaluatorResultProduced: false;
  evaluatorResultPersisted: false;
  evaluatorResultId: null;
  approvalDecisionProduced: false;
  approvalDecisionPersisted: false;
  approvalDecisionId: null;
  approvalGrantProduced: false;
  approvalGrantPersisted: false;
  approvalGrantId: null;
  runtimePermissionGranted: false;
  commandExposurePermissionGranted: false;
  runtimeCommandExposureEnabled: false;
  runtimeExecutionEnabled: false;
  evaluatorExecutionRequested: false;
  evaluatorExecutionStarted: false;
  evaluatorExecutionEnabled: false;
  evaluatorExecuted: false;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
}

export interface ReviewOnlyReadinessHandoffDispositionBoundaryResult {
  schema: "ardyn.phase-5.36.review-only-readiness-handoff-disposition-boundary-result";
  schemaVersion: "0.1.0";
  boundaryKind: "review-only-readiness-handoff-disposition-boundary";
  boundaryMode: "review-only";
  reviewedAt: string;
  classification: ReviewOnlyReadinessHandoffDispositionClassification;
  readinessInspectionCheckpointAccepted: boolean;
  readinessHandoffDispositionProduced: boolean;
  readinessHandoffDispositionIsReviewerRouting: false;
  readinessHandoffDispositionIsReviewerAssignment: false;
  readinessHandoffDispositionIsEvaluatorExecution: false;
  readinessHandoffDispositionIsEvaluatorResult: false;
  readinessHandoffDispositionIsApprovalDecision: false;
  readinessHandoffDispositionIsApprovalGrant: false;
  readinessHandoffDisposition:
    | ReviewOnlyReadinessHandoffDispositionState
    | null;
  readinessInspectionCheckpointSummary: {
    schema: "ardyn.phase-5.35.review-only-readiness-inspection-checkpoint-state";
    stateKind: "review-only-readiness-inspection-checkpoint-state";
    stateMode: "review-only";
    reviewedAt: string;
    stateDigest: string;
    readinessInspectionCheckpointIsReviewerRouting: false;
    readinessInspectionCheckpointIsReviewerAssignment: false;
    readinessInspectionCheckpointIsEvaluatorExecution: false;
    readinessInspectionCheckpointIsEvaluatorResult: false;
    readinessInspectionCheckpointIsApprovalDecision: false;
    readinessInspectionCheckpointIsApprovalGrant: false;
    reviewerRoutingPerformed: false;
    reviewerAssignmentPerformed: false;
    evaluatorResultProduced: false;
    approvalDecisionProduced: false;
    approvalGrantProduced: false;
    approvalGrantPersisted: false;
    evaluatorExecuted: false;
    runtimeEffectAllFalse: true;
  } | null;
  reviewOnly: true;
  authoritative: false;
  reviewArtifactOnly: true;
  readinessHandoffDispositionMetadataOnly: true;
  reviewerRoutingPerformed: false;
  reviewerRoutingEnabled: false;
  reviewerRouteId: null;
  reviewerAssignmentPerformed: false;
  reviewerAssignmentEnabled: false;
  reviewerAssignmentId: null;
  reviewerId: null;
  evaluatorResultProduced: false;
  evaluatorResultPersisted: false;
  evaluatorResultId: null;
  approvalDecisionProduced: false;
  approvalDecisionPersisted: false;
  approvalDecisionId: null;
  approvalGrant: RuntimeApprovalGrantBlocked;
  approvalGrantProduced: false;
  approvalGrantPersisted: false;
  approvalGrantId: null;
  runtimePermissionGranted: false;
  commandExposurePermissionGranted: false;
  runtimeCommandExposureEnabled: false;
  runtimeExecutionEnabled: false;
  evaluatorExecutionRequested: false;
  evaluatorExecutionStarted: false;
  evaluatorExecutionEnabled: false;
  evaluatorExecuted: false;
  rejectionReasons: string[];
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
}

export interface ReviewOnlyHandoffDispositionInspectionCheckpointState {
  schema: "ardyn.phase-5.37.review-only-handoff-disposition-inspection-checkpoint-state";
  schemaVersion: "0.1.0";
  stateKind: "review-only-handoff-disposition-inspection-checkpoint-state";
  stateMode: "review-only";
  reviewedAt: string;
  sourceReadinessHandoffDisposition: {
    schema: "ardyn.phase-5.36.review-only-readiness-handoff-disposition-state";
    stateKind: "review-only-readiness-handoff-disposition-state";
    stateMode: "review-only";
    reviewedAt: string;
    stateDigest: string;
    sourceReadinessInspectionCheckpointDigest: string;
    sourceHandoffReadinessArtifactDigest: string;
    sourceInspectionHandoffStateDigest: string;
    sourceAggregationStateDigest: string;
    sourceDispositionStateDigest: string;
    sourceInspectionArtifactDigest: string;
    sourceDecisionCandidateStateDigest: string;
    sourcePreflightCheckpointStateDigest: string;
    sourceIntakeCheckpointStateDigest: string;
    sourceEvaluatorInputCandidateDigest: string;
    readinessInspectionCheckpointAccepted: true;
    readinessHandoffDispositionMetadataOnly: true;
    readinessHandoffDispositionIsReviewerRouting: false;
    readinessHandoffDispositionIsReviewerAssignment: false;
    readinessHandoffDispositionIsEvaluatorExecution: false;
    readinessHandoffDispositionIsEvaluatorResult: false;
    readinessHandoffDispositionIsApprovalDecision: false;
    readinessHandoffDispositionIsApprovalGrant: false;
    reviewerRoutingPerformed: false;
    reviewerAssignmentPerformed: false;
    evaluatorResultProduced: false;
    approvalDecisionProduced: false;
    approvalGrantProduced: false;
    approvalGrantPersisted: false;
    evaluatorExecuted: false;
    runtimeEffectAllFalse: true;
  };
  pipelineSummary: ReviewOnlyReadinessHandoffDispositionState["pipelineSummary"];
  integratedReviewSummary: ReviewOnlyReadinessHandoffDispositionState["integratedReviewSummary"];
  decisionCandidateSummary: ReviewOnlyReadinessHandoffDispositionState["decisionCandidateSummary"];
  inspectionSummary: ReviewOnlyReadinessHandoffDispositionState["inspectionSummary"];
  dispositionSummary: ReviewOnlyReadinessHandoffDispositionState["dispositionSummary"];
  aggregationSummary: ReviewOnlyReadinessHandoffDispositionState["aggregationSummary"];
  handoffSummary: ReviewOnlyReadinessHandoffDispositionState["handoffSummary"];
  readinessSummary: ReviewOnlyReadinessHandoffDispositionState["readinessSummary"];
  inspectionCheckpointSummary: ReviewOnlyReadinessHandoffDispositionState["inspectionCheckpointSummary"];
  readinessHandoffDispositionSummary: ReviewOnlyReadinessHandoffDispositionState["readinessHandoffDispositionSummary"];
  handoffDispositionInspectionCheckpointSummary: {
    checkpointKind: "review-only-handoff-disposition-inspection-checkpoint";
    checkpointMode: "review-only";
    sourceReadinessHandoffDispositionClassification:
      "valid_review_only_readiness_handoff_disposition_runtime_still_blocked";
    handoffDispositionInspectionCheckpointMetadataOnly: true;
    reviewerRoutingPerformed: false;
    reviewerAssignmentPerformed: false;
    evaluatorExecutionPerformed: false;
    evaluatorResultProduced: false;
    approvalDecisionProduced: false;
    approvalGrantProduced: false;
    runtimePermissionGranted: false;
    commandExposurePermissionGranted: false;
    evaluatorExecuted: false;
    runtimeEffectAllFalse: true;
  };
  readinessHandoffDispositionAccepted: true;
  handoffDispositionInspectionCheckpointMetadataOnly: true;
  handoffDispositionInspectionCheckpointIsReviewerRouting: false;
  handoffDispositionInspectionCheckpointIsReviewerAssignment: false;
  handoffDispositionInspectionCheckpointIsEvaluatorExecution: false;
  handoffDispositionInspectionCheckpointIsEvaluatorResult: false;
  handoffDispositionInspectionCheckpointIsApprovalDecision: false;
  handoffDispositionInspectionCheckpointIsApprovalGrant: false;
  reviewerRoutingPerformed: false;
  reviewerRoutingEnabled: false;
  reviewerRouteId: null;
  reviewerAssignmentPerformed: false;
  reviewerAssignmentEnabled: false;
  reviewerAssignmentId: null;
  reviewerId: null;
  evaluatorResultProduced: false;
  evaluatorResultPersisted: false;
  evaluatorResultId: null;
  approvalDecisionProduced: false;
  approvalDecisionPersisted: false;
  approvalDecisionId: null;
  approvalGrantProduced: false;
  approvalGrantPersisted: false;
  approvalGrantId: null;
  runtimePermissionGranted: false;
  commandExposurePermissionGranted: false;
  runtimeCommandExposureEnabled: false;
  runtimeExecutionEnabled: false;
  evaluatorExecutionRequested: false;
  evaluatorExecutionStarted: false;
  evaluatorExecutionEnabled: false;
  evaluatorExecuted: false;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
}

export interface ReviewOnlyHandoffDispositionInspectionCheckpointResult {
  schema: "ardyn.phase-5.37.review-only-handoff-disposition-inspection-checkpoint-result";
  schemaVersion: "0.1.0";
  checkpointKind: "review-only-handoff-disposition-inspection-checkpoint";
  checkpointMode: "review-only";
  reviewedAt: string;
  classification: ReviewOnlyHandoffDispositionInspectionCheckpointClassification;
  readinessHandoffDispositionAccepted: boolean;
  handoffDispositionInspectionCheckpointProduced: boolean;
  handoffDispositionInspectionCheckpointIsReviewerRouting: false;
  handoffDispositionInspectionCheckpointIsReviewerAssignment: false;
  handoffDispositionInspectionCheckpointIsEvaluatorExecution: false;
  handoffDispositionInspectionCheckpointIsEvaluatorResult: false;
  handoffDispositionInspectionCheckpointIsApprovalDecision: false;
  handoffDispositionInspectionCheckpointIsApprovalGrant: false;
  handoffDispositionInspectionCheckpoint:
    | ReviewOnlyHandoffDispositionInspectionCheckpointState
    | null;
  readinessHandoffDispositionSummary: {
    schema: "ardyn.phase-5.36.review-only-readiness-handoff-disposition-state";
    stateKind: "review-only-readiness-handoff-disposition-state";
    stateMode: "review-only";
    reviewedAt: string;
    stateDigest: string;
    readinessHandoffDispositionIsReviewerRouting: false;
    readinessHandoffDispositionIsReviewerAssignment: false;
    readinessHandoffDispositionIsEvaluatorExecution: false;
    readinessHandoffDispositionIsEvaluatorResult: false;
    readinessHandoffDispositionIsApprovalDecision: false;
    readinessHandoffDispositionIsApprovalGrant: false;
    reviewerRoutingPerformed: false;
    reviewerAssignmentPerformed: false;
    evaluatorResultProduced: false;
    approvalDecisionProduced: false;
    approvalGrantProduced: false;
    approvalGrantPersisted: false;
    evaluatorExecuted: false;
    runtimeEffectAllFalse: true;
  } | null;
  reviewOnly: true;
  authoritative: false;
  reviewArtifactOnly: true;
  handoffDispositionInspectionCheckpointMetadataOnly: true;
  reviewerRoutingPerformed: false;
  reviewerRoutingEnabled: false;
  reviewerRouteId: null;
  reviewerAssignmentPerformed: false;
  reviewerAssignmentEnabled: false;
  reviewerAssignmentId: null;
  reviewerId: null;
  evaluatorResultProduced: false;
  evaluatorResultPersisted: false;
  evaluatorResultId: null;
  approvalDecisionProduced: false;
  approvalDecisionPersisted: false;
  approvalDecisionId: null;
  approvalGrant: RuntimeApprovalGrantBlocked;
  approvalGrantProduced: false;
  approvalGrantPersisted: false;
  approvalGrantId: null;
  runtimePermissionGranted: false;
  commandExposurePermissionGranted: false;
  runtimeCommandExposureEnabled: false;
  runtimeExecutionEnabled: false;
  evaluatorExecutionRequested: false;
  evaluatorExecutionStarted: false;
  evaluatorExecutionEnabled: false;
  evaluatorExecuted: false;
  rejectionReasons: string[];
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
}

export interface ReviewOnlyInspectionHandoffMetadataState {
  schema: "ardyn.phase-5.38.review-only-inspection-handoff-metadata-state";
  schemaVersion: "0.1.0";
  stateKind: "review-only-inspection-handoff-metadata-state";
  stateMode: "review-only";
  reviewedAt: string;
  sourceHandoffDispositionInspectionCheckpoint: {
    schema: "ardyn.phase-5.37.review-only-handoff-disposition-inspection-checkpoint-state";
    stateKind: "review-only-handoff-disposition-inspection-checkpoint-state";
    stateMode: "review-only";
    reviewedAt: string;
    stateDigest: string;
    sourceReadinessHandoffDispositionDigest: string;
    handoffDispositionInspectionCheckpointMetadataOnly: true;
    handoffDispositionInspectionCheckpointIsReviewerRouting: false;
    handoffDispositionInspectionCheckpointIsReviewerAssignment: false;
    handoffDispositionInspectionCheckpointIsEvaluatorExecution: false;
    handoffDispositionInspectionCheckpointIsEvaluatorResult: false;
    handoffDispositionInspectionCheckpointIsApprovalDecision: false;
    handoffDispositionInspectionCheckpointIsApprovalGrant: false;
    reviewerRoutingPerformed: false;
    reviewerAssignmentPerformed: false;
    evaluatorResultProduced: false;
    approvalDecisionProduced: false;
    approvalGrantProduced: false;
    approvalGrantPersisted: false;
    evaluatorExecuted: false;
    runtimeEffectAllFalse: true;
  };
  pipelineSummary: ReviewOnlyHandoffDispositionInspectionCheckpointState["pipelineSummary"];
  integratedReviewSummary: ReviewOnlyHandoffDispositionInspectionCheckpointState["integratedReviewSummary"];
  decisionCandidateSummary: ReviewOnlyHandoffDispositionInspectionCheckpointState["decisionCandidateSummary"];
  inspectionSummary: ReviewOnlyHandoffDispositionInspectionCheckpointState["inspectionSummary"];
  dispositionSummary: ReviewOnlyHandoffDispositionInspectionCheckpointState["dispositionSummary"];
  aggregationSummary: ReviewOnlyHandoffDispositionInspectionCheckpointState["aggregationSummary"];
  handoffSummary: ReviewOnlyHandoffDispositionInspectionCheckpointState["handoffSummary"];
  readinessSummary: ReviewOnlyHandoffDispositionInspectionCheckpointState["readinessSummary"];
  inspectionCheckpointSummary: ReviewOnlyHandoffDispositionInspectionCheckpointState["inspectionCheckpointSummary"];
  readinessHandoffDispositionSummary: ReviewOnlyHandoffDispositionInspectionCheckpointState["readinessHandoffDispositionSummary"];
  handoffDispositionInspectionCheckpointSummary: ReviewOnlyHandoffDispositionInspectionCheckpointState["handoffDispositionInspectionCheckpointSummary"];
  inspectionHandoffMetadataSummary: {
    boundaryKind: "review-only-inspection-handoff-metadata-boundary";
    boundaryMode: "review-only";
    sourceHandoffDispositionInspectionCheckpointClassification:
      "valid_review_only_handoff_disposition_inspection_checkpoint_runtime_still_blocked";
    inspectionHandoffMetadataOnly: true;
    reviewerRoutingPerformed: false;
    reviewerAssignmentPerformed: false;
    evaluatorExecutionPerformed: false;
    evaluatorResultProduced: false;
    approvalDecisionProduced: false;
    approvalGrantProduced: false;
    runtimePermissionGranted: false;
    commandExposurePermissionGranted: false;
    evaluatorExecuted: false;
    runtimeEffectAllFalse: true;
  };
  handoffDispositionInspectionCheckpointAccepted: true;
  inspectionHandoffMetadataOnly: true;
  inspectionHandoffMetadataIsReviewerRouting: false;
  inspectionHandoffMetadataIsReviewerAssignment: false;
  inspectionHandoffMetadataIsEvaluatorExecution: false;
  inspectionHandoffMetadataIsEvaluatorResult: false;
  inspectionHandoffMetadataIsApprovalDecision: false;
  inspectionHandoffMetadataIsApprovalGrant: false;
  reviewerRoutingPerformed: false;
  reviewerRoutingEnabled: false;
  reviewerRouteId: null;
  reviewerAssignmentPerformed: false;
  reviewerAssignmentEnabled: false;
  reviewerAssignmentId: null;
  reviewerId: null;
  evaluatorResultProduced: false;
  evaluatorResultPersisted: false;
  evaluatorResultId: null;
  approvalDecisionProduced: false;
  approvalDecisionPersisted: false;
  approvalDecisionId: null;
  approvalGrantProduced: false;
  approvalGrantPersisted: false;
  approvalGrantId: null;
  runtimePermissionGranted: false;
  commandExposurePermissionGranted: false;
  runtimeCommandExposureEnabled: false;
  runtimeExecutionEnabled: false;
  evaluatorExecutionRequested: false;
  evaluatorExecutionStarted: false;
  evaluatorExecutionEnabled: false;
  evaluatorExecuted: false;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
}

export interface ReviewOnlyInspectionHandoffMetadataBoundaryResult {
  schema: "ardyn.phase-5.38.review-only-inspection-handoff-metadata-boundary-result";
  schemaVersion: "0.1.0";
  boundaryKind: "review-only-inspection-handoff-metadata-boundary";
  boundaryMode: "review-only";
  reviewedAt: string;
  classification: ReviewOnlyInspectionHandoffMetadataBoundaryClassification;
  handoffDispositionInspectionCheckpointAccepted: boolean;
  inspectionHandoffMetadataProduced: boolean;
  inspectionHandoffMetadataIsReviewerRouting: false;
  inspectionHandoffMetadataIsReviewerAssignment: false;
  inspectionHandoffMetadataIsEvaluatorExecution: false;
  inspectionHandoffMetadataIsEvaluatorResult: false;
  inspectionHandoffMetadataIsApprovalDecision: false;
  inspectionHandoffMetadataIsApprovalGrant: false;
  inspectionHandoffMetadata: ReviewOnlyInspectionHandoffMetadataState | null;
  handoffDispositionInspectionCheckpointSummary: {
    schema: "ardyn.phase-5.37.review-only-handoff-disposition-inspection-checkpoint-state";
    stateKind: "review-only-handoff-disposition-inspection-checkpoint-state";
    stateMode: "review-only";
    reviewedAt: string;
    stateDigest: string;
    handoffDispositionInspectionCheckpointIsReviewerRouting: false;
    handoffDispositionInspectionCheckpointIsReviewerAssignment: false;
    handoffDispositionInspectionCheckpointIsEvaluatorExecution: false;
    handoffDispositionInspectionCheckpointIsEvaluatorResult: false;
    handoffDispositionInspectionCheckpointIsApprovalDecision: false;
    handoffDispositionInspectionCheckpointIsApprovalGrant: false;
    reviewerRoutingPerformed: false;
    reviewerAssignmentPerformed: false;
    evaluatorResultProduced: false;
    approvalDecisionProduced: false;
    approvalGrantProduced: false;
    approvalGrantPersisted: false;
    evaluatorExecuted: false;
    runtimeEffectAllFalse: true;
  } | null;
  reviewOnly: true;
  authoritative: false;
  reviewArtifactOnly: true;
  inspectionHandoffMetadataOnly: true;
  reviewerRoutingPerformed: false;
  reviewerRoutingEnabled: false;
  reviewerRouteId: null;
  reviewerAssignmentPerformed: false;
  reviewerAssignmentEnabled: false;
  reviewerAssignmentId: null;
  reviewerId: null;
  evaluatorResultProduced: false;
  evaluatorResultPersisted: false;
  evaluatorResultId: null;
  approvalDecisionProduced: false;
  approvalDecisionPersisted: false;
  approvalDecisionId: null;
  approvalGrant: RuntimeApprovalGrantBlocked;
  approvalGrantProduced: false;
  approvalGrantPersisted: false;
  approvalGrantId: null;
  runtimePermissionGranted: false;
  commandExposurePermissionGranted: false;
  runtimeCommandExposureEnabled: false;
  runtimeExecutionEnabled: false;
  evaluatorExecutionRequested: false;
  evaluatorExecutionStarted: false;
  evaluatorExecutionEnabled: false;
  evaluatorExecuted: false;
  rejectionReasons: string[];
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
}

export interface ReviewOnlyInspectionHandoffCheckpointState {
  schema: "ardyn.phase-5.39.review-only-inspection-handoff-checkpoint-state";
  schemaVersion: "0.1.0";
  stateKind: "review-only-inspection-handoff-checkpoint-state";
  stateMode: "review-only";
  reviewedAt: string;
  sourceInspectionHandoffMetadata: {
    schema: "ardyn.phase-5.38.review-only-inspection-handoff-metadata-state";
    stateKind: "review-only-inspection-handoff-metadata-state";
    stateMode: "review-only";
    reviewedAt: string;
    stateDigest: string;
    sourceHandoffDispositionInspectionCheckpointDigest: string;
    inspectionHandoffMetadataOnly: true;
    inspectionHandoffMetadataIsReviewerRouting: false;
    inspectionHandoffMetadataIsReviewerAssignment: false;
    inspectionHandoffMetadataIsEvaluatorExecution: false;
    inspectionHandoffMetadataIsEvaluatorResult: false;
    inspectionHandoffMetadataIsApprovalDecision: false;
    inspectionHandoffMetadataIsApprovalGrant: false;
    reviewerRoutingPerformed: false;
    reviewerAssignmentPerformed: false;
    evaluatorResultProduced: false;
    approvalDecisionProduced: false;
    approvalGrantProduced: false;
    approvalGrantPersisted: false;
    evaluatorExecuted: false;
    runtimeEffectAllFalse: true;
  };
  checkpointSummary: {
    checkpointKind: "review-only-inspection-handoff-checkpoint";
    checkpointMode: "review-only";
    sourceInspectionHandoffMetadataBoundaryClassification:
      "valid_review_only_inspection_handoff_metadata_boundary_runtime_still_blocked";
    inspectionHandoffCheckpointMetadataOnly: true;
    cleanupToolkitBaselineEvidence:
      "phase-5.38a-behavior-preserving-runtime-blocked";
    reviewerRoutingPerformed: false;
    reviewerAssignmentPerformed: false;
    evaluatorExecutionPerformed: false;
    evaluatorResultProduced: false;
    approvalDecisionProduced: false;
    approvalGrantProduced: false;
    runtimePermissionGranted: false;
    commandExposurePermissionGranted: false;
    evaluatorExecuted: false;
    runtimeEffectAllFalse: true;
  };
  cleanupToolkitBaselineEvidence: {
    phase: "phase-5.38a-cleanup-toolkit-adoption";
    document: "docs/phase-5-38a-cleanup-toolkit-adoption.md";
    behaviorPreserving: true;
    serveRuntimeStillDefaultBlocked: true;
    dryRunBypassesBlock: false;
    cleanupToolsInstalledByPhase539: false;
    fallowRuntimeUsed: false;
    runtimeExecutionEnabled: false;
    commandExposurePermissionGranted: false;
  };
  inspectionHandoffMetadataAccepted: true;
  inspectionHandoffCheckpointMetadataOnly: true;
  inspectionHandoffCheckpointIsReviewerRouting: false;
  inspectionHandoffCheckpointIsReviewerAssignment: false;
  inspectionHandoffCheckpointIsEvaluatorExecution: false;
  inspectionHandoffCheckpointIsEvaluatorResult: false;
  inspectionHandoffCheckpointIsApprovalDecision: false;
  inspectionHandoffCheckpointIsApprovalGrant: false;
  reviewerRoutingPerformed: false;
  reviewerRoutingEnabled: false;
  reviewerRouteId: null;
  reviewerAssignmentPerformed: false;
  reviewerAssignmentEnabled: false;
  reviewerAssignmentId: null;
  reviewerId: null;
  evaluatorResultProduced: false;
  evaluatorResultPersisted: false;
  evaluatorResultId: null;
  approvalDecisionProduced: false;
  approvalDecisionPersisted: false;
  approvalDecisionId: null;
  approvalGrantProduced: false;
  approvalGrantPersisted: false;
  approvalGrantId: null;
  runtimePermissionGranted: false;
  commandExposurePermissionGranted: false;
  runtimeCommandExposureEnabled: false;
  runtimeExecutionEnabled: false;
  evaluatorExecutionRequested: false;
  evaluatorExecutionStarted: false;
  evaluatorExecutionEnabled: false;
  evaluatorExecuted: false;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
}

export interface ReviewOnlyInspectionHandoffCheckpointResult {
  schema: "ardyn.phase-5.39.review-only-inspection-handoff-checkpoint-result";
  schemaVersion: "0.1.0";
  checkpointKind: "review-only-inspection-handoff-checkpoint";
  checkpointMode: "review-only";
  reviewedAt: string;
  classification: ReviewOnlyInspectionHandoffCheckpointClassification;
  inspectionHandoffMetadataAccepted: boolean;
  inspectionHandoffCheckpointProduced: boolean;
  inspectionHandoffCheckpointIsReviewerRouting: false;
  inspectionHandoffCheckpointIsReviewerAssignment: false;
  inspectionHandoffCheckpointIsEvaluatorExecution: false;
  inspectionHandoffCheckpointIsEvaluatorResult: false;
  inspectionHandoffCheckpointIsApprovalDecision: false;
  inspectionHandoffCheckpointIsApprovalGrant: false;
  inspectionHandoffCheckpoint: ReviewOnlyInspectionHandoffCheckpointState | null;
  inspectionHandoffMetadataSummary: {
    schema: "ardyn.phase-5.38.review-only-inspection-handoff-metadata-state";
    stateKind: "review-only-inspection-handoff-metadata-state";
    stateMode: "review-only";
    reviewedAt: string;
    stateDigest: string;
    inspectionHandoffMetadataIsReviewerRouting: false;
    inspectionHandoffMetadataIsReviewerAssignment: false;
    inspectionHandoffMetadataIsEvaluatorExecution: false;
    inspectionHandoffMetadataIsEvaluatorResult: false;
    inspectionHandoffMetadataIsApprovalDecision: false;
    inspectionHandoffMetadataIsApprovalGrant: false;
    reviewerRoutingPerformed: false;
    reviewerAssignmentPerformed: false;
    evaluatorResultProduced: false;
    approvalDecisionProduced: false;
    approvalGrantProduced: false;
    approvalGrantPersisted: false;
    evaluatorExecuted: false;
    runtimeEffectAllFalse: true;
  } | null;
  cleanupToolkitBaselineEvidence: ReviewOnlyInspectionHandoffCheckpointState["cleanupToolkitBaselineEvidence"];
  reviewOnly: true;
  authoritative: false;
  reviewArtifactOnly: true;
  inspectionHandoffCheckpointMetadataOnly: true;
  reviewerRoutingPerformed: false;
  reviewerRoutingEnabled: false;
  reviewerRouteId: null;
  reviewerAssignmentPerformed: false;
  reviewerAssignmentEnabled: false;
  reviewerAssignmentId: null;
  reviewerId: null;
  evaluatorResultProduced: false;
  evaluatorResultPersisted: false;
  evaluatorResultId: null;
  approvalDecisionProduced: false;
  approvalDecisionPersisted: false;
  approvalDecisionId: null;
  approvalGrant: RuntimeApprovalGrantBlocked;
  approvalGrantProduced: false;
  approvalGrantPersisted: false;
  approvalGrantId: null;
  runtimePermissionGranted: false;
  commandExposurePermissionGranted: false;
  runtimeCommandExposureEnabled: false;
  runtimeExecutionEnabled: false;
  evaluatorExecutionRequested: false;
  evaluatorExecutionStarted: false;
  evaluatorExecutionEnabled: false;
  evaluatorExecuted: false;
  rejectionReasons: string[];
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
}

export interface ReviewOnlyCheckpointHandoffLayerState {
  schema: "ardyn.phase-5.40.review-only-checkpoint-handoff-layer-state";
  schemaVersion: "0.1.0";
  stateKind: "review-only-checkpoint-handoff-layer-state";
  stateMode: "review-only";
  reviewedAt: string;
  sourceInspectionHandoffCheckpoint: {
    schema: "ardyn.phase-5.39.review-only-inspection-handoff-checkpoint-state";
    stateKind: "review-only-inspection-handoff-checkpoint-state";
    stateMode: "review-only";
    reviewedAt: string;
    stateDigest: string;
    sourceInspectionHandoffMetadataDigest: string;
    inspectionHandoffCheckpointMetadataOnly: true;
    inspectionHandoffCheckpointIsReviewerRouting: false;
    inspectionHandoffCheckpointIsReviewerAssignment: false;
    inspectionHandoffCheckpointIsEvaluatorExecution: false;
    inspectionHandoffCheckpointIsEvaluatorResult: false;
    inspectionHandoffCheckpointIsApprovalDecision: false;
    inspectionHandoffCheckpointIsApprovalGrant: false;
    reviewerRoutingPerformed: false;
    reviewerAssignmentPerformed: false;
    evaluatorResultProduced: false;
    approvalDecisionProduced: false;
    approvalGrantProduced: false;
    approvalGrantPersisted: false;
    evaluatorExecuted: false;
    runtimeEffectAllFalse: true;
  };
  checkpointHandoffSummary: {
    checkpointHandoffKind: "review-only-checkpoint-handoff-layer";
    checkpointHandoffMode: "review-only";
    sourceInspectionHandoffCheckpointClassification:
      "valid_review_only_inspection_handoff_checkpoint_runtime_still_blocked";
    checkpointHandoffMetadataOnly: true;
    cleanupHardeningToolkitEvidence:
      "installed-toolkit-validation-evidence-only";
    reviewerRoutingPerformed: false;
    reviewerAssignmentPerformed: false;
    evaluatorExecutionPerformed: false;
    evaluatorResultProduced: false;
    approvalDecisionProduced: false;
    approvalGrantProduced: false;
    runtimePermissionGranted: false;
    commandExposurePermissionGranted: false;
    evaluatorExecuted: false;
    runtimeEffectAllFalse: true;
  };
  cleanupHardeningToolkitEvidence: {
    phase: "phase-5.40-review-only-checkpoint-handoff-layer";
    evidenceMode: "installed-cleanup-hardening-toolkit-validation-only";
    npmAuditRequired: true;
    cargoAuditRequired: true;
    cargoMacheteRequired: true;
    fallowStaticRequired: true;
    optionalAdvisoryChecksAllowed: true;
    megaLinterRun: false;
    broadTrunkRewriteRun: false;
    toolsInstalledByPhase540: false;
    fallowRuntimeUsed: false;
    runtimeExecutionEnabled: false;
    commandExposurePermissionGranted: false;
  };
  inspectionHandoffCheckpointAccepted: true;
  checkpointHandoffMetadataOnly: true;
  checkpointHandoffLayerIsReviewerRouting: false;
  checkpointHandoffLayerIsReviewerAssignment: false;
  checkpointHandoffLayerIsEvaluatorExecution: false;
  checkpointHandoffLayerIsEvaluatorResult: false;
  checkpointHandoffLayerIsApprovalDecision: false;
  checkpointHandoffLayerIsApprovalGrant: false;
  reviewerRoutingPerformed: false;
  reviewerRoutingEnabled: false;
  reviewerRouteId: null;
  reviewerAssignmentPerformed: false;
  reviewerAssignmentEnabled: false;
  reviewerAssignmentId: null;
  reviewerId: null;
  evaluatorResultProduced: false;
  evaluatorResultPersisted: false;
  evaluatorResultId: null;
  approvalDecisionProduced: false;
  approvalDecisionPersisted: false;
  approvalDecisionId: null;
  approvalGrantProduced: false;
  approvalGrantPersisted: false;
  approvalGrantId: null;
  runtimePermissionGranted: false;
  commandExposurePermissionGranted: false;
  runtimeCommandExposureEnabled: false;
  runtimeExecutionEnabled: false;
  evaluatorExecutionRequested: false;
  evaluatorExecutionStarted: false;
  evaluatorExecutionEnabled: false;
  evaluatorExecuted: false;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
}

export interface ReviewOnlyCheckpointHandoffLayerResult {
  schema: "ardyn.phase-5.40.review-only-checkpoint-handoff-layer-result";
  schemaVersion: "0.1.0";
  checkpointHandoffKind: "review-only-checkpoint-handoff-layer";
  checkpointHandoffMode: "review-only";
  reviewedAt: string;
  classification: ReviewOnlyCheckpointHandoffLayerClassification;
  inspectionHandoffCheckpointAccepted: boolean;
  checkpointHandoffLayerProduced: boolean;
  checkpointHandoffLayerIsReviewerRouting: false;
  checkpointHandoffLayerIsReviewerAssignment: false;
  checkpointHandoffLayerIsEvaluatorExecution: false;
  checkpointHandoffLayerIsEvaluatorResult: false;
  checkpointHandoffLayerIsApprovalDecision: false;
  checkpointHandoffLayerIsApprovalGrant: false;
  checkpointHandoffLayer: ReviewOnlyCheckpointHandoffLayerState | null;
  inspectionHandoffCheckpointSummary: {
    schema: "ardyn.phase-5.39.review-only-inspection-handoff-checkpoint-state";
    stateKind: "review-only-inspection-handoff-checkpoint-state";
    stateMode: "review-only";
    reviewedAt: string;
    stateDigest: string;
    inspectionHandoffCheckpointMetadataOnly: true;
    inspectionHandoffCheckpointIsReviewerRouting: false;
    inspectionHandoffCheckpointIsReviewerAssignment: false;
    inspectionHandoffCheckpointIsEvaluatorExecution: false;
    inspectionHandoffCheckpointIsEvaluatorResult: false;
    inspectionHandoffCheckpointIsApprovalDecision: false;
    inspectionHandoffCheckpointIsApprovalGrant: false;
    reviewerRoutingPerformed: false;
    reviewerAssignmentPerformed: false;
    evaluatorResultProduced: false;
    approvalDecisionProduced: false;
    approvalGrantProduced: false;
    approvalGrantPersisted: false;
    evaluatorExecuted: false;
    runtimeEffectAllFalse: true;
  } | null;
  cleanupHardeningToolkitEvidence: ReviewOnlyCheckpointHandoffLayerState["cleanupHardeningToolkitEvidence"];
  reviewOnly: true;
  authoritative: false;
  reviewArtifactOnly: true;
  checkpointHandoffMetadataOnly: true;
  reviewerRoutingPerformed: false;
  reviewerRoutingEnabled: false;
  reviewerRouteId: null;
  reviewerAssignmentPerformed: false;
  reviewerAssignmentEnabled: false;
  reviewerAssignmentId: null;
  reviewerId: null;
  evaluatorResultProduced: false;
  evaluatorResultPersisted: false;
  evaluatorResultId: null;
  approvalDecisionProduced: false;
  approvalDecisionPersisted: false;
  approvalDecisionId: null;
  approvalGrant: RuntimeApprovalGrantBlocked;
  approvalGrantProduced: false;
  approvalGrantPersisted: false;
  approvalGrantId: null;
  runtimePermissionGranted: false;
  commandExposurePermissionGranted: false;
  runtimeCommandExposureEnabled: false;
  runtimeExecutionEnabled: false;
  evaluatorExecutionRequested: false;
  evaluatorExecutionStarted: false;
  evaluatorExecutionEnabled: false;
  evaluatorExecuted: false;
  rejectionReasons: string[];
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
}

export interface ReviewOnlyMetadataHandoffCheckpointState {
  schema: "ardyn.phase-5.41.review-only-metadata-handoff-checkpoint-state";
  schemaVersion: "0.1.0";
  stateKind: "review-only-metadata-handoff-checkpoint-state";
  stateMode: "review-only";
  reviewedAt: string;
  sourceCheckpointHandoffLayer: {
    schema: "ardyn.phase-5.40.review-only-checkpoint-handoff-layer-state";
    stateKind: "review-only-checkpoint-handoff-layer-state";
    stateMode: "review-only";
    reviewedAt: string;
    stateDigest: string;
    sourceInspectionHandoffCheckpointDigest: string;
    checkpointHandoffMetadataOnly: true;
    checkpointHandoffLayerIsReviewerRouting: false;
    checkpointHandoffLayerIsReviewerAssignment: false;
    checkpointHandoffLayerIsEvaluatorExecution: false;
    checkpointHandoffLayerIsEvaluatorResult: false;
    checkpointHandoffLayerIsApprovalDecision: false;
    checkpointHandoffLayerIsApprovalGrant: false;
    reviewerRoutingPerformed: false;
    reviewerAssignmentPerformed: false;
    evaluatorResultProduced: false;
    approvalDecisionProduced: false;
    approvalGrantProduced: false;
    approvalGrantPersisted: false;
    evaluatorExecuted: false;
    runtimeEffectAllFalse: true;
  };
  metadataHandoffCheckpointSummary: {
    metadataHandoffCheckpointKind: "review-only-metadata-handoff-checkpoint";
    metadataHandoffCheckpointMode: "review-only";
    sourceCheckpointHandoffLayerClassification:
      "valid_review_only_checkpoint_handoff_layer_runtime_still_blocked";
    metadataHandoffCheckpointMetadataOnly: true;
    cleanupHardeningToolkitEvidence:
      "installed-toolkit-validation-evidence-only";
    reviewerRoutingPerformed: false;
    reviewerAssignmentPerformed: false;
    evaluatorExecutionPerformed: false;
    evaluatorResultProduced: false;
    approvalDecisionProduced: false;
    approvalGrantProduced: false;
    runtimePermissionGranted: false;
    commandExposurePermissionGranted: false;
    evaluatorExecuted: false;
    runtimeEffectAllFalse: true;
  };
  cleanupHardeningToolkitEvidence: {
    phase: "phase-5.41-review-only-metadata-handoff-checkpoint";
    evidenceMode: "installed-cleanup-hardening-toolkit-validation-only";
    npmAuditRequired: true;
    cargoAuditRequired: true;
    cargoMacheteRequired: true;
    fallowStaticRequired: true;
    optionalAdvisoryChecksAllowed: true;
    megaLinterRun: false;
    broadTrunkRewriteRun: false;
    toolsInstalledByPhase541: false;
    fallowRuntimeUsed: false;
    runtimeExecutionEnabled: false;
    commandExposurePermissionGranted: false;
  };
  checkpointHandoffLayerAccepted: true;
  metadataHandoffCheckpointMetadataOnly: true;
  metadataHandoffCheckpointIsReviewerRouting: false;
  metadataHandoffCheckpointIsReviewerAssignment: false;
  metadataHandoffCheckpointIsEvaluatorExecution: false;
  metadataHandoffCheckpointIsEvaluatorResult: false;
  metadataHandoffCheckpointIsApprovalDecision: false;
  metadataHandoffCheckpointIsApprovalGrant: false;
  reviewerRoutingPerformed: false;
  reviewerRoutingEnabled: false;
  reviewerRouteId: null;
  reviewerAssignmentPerformed: false;
  reviewerAssignmentEnabled: false;
  reviewerAssignmentId: null;
  reviewerId: null;
  evaluatorResultProduced: false;
  evaluatorResultPersisted: false;
  evaluatorResultId: null;
  approvalDecisionProduced: false;
  approvalDecisionPersisted: false;
  approvalDecisionId: null;
  approvalGrantProduced: false;
  approvalGrantPersisted: false;
  approvalGrantId: null;
  runtimePermissionGranted: false;
  commandExposurePermissionGranted: false;
  runtimeCommandExposureEnabled: false;
  runtimeExecutionEnabled: false;
  evaluatorExecutionRequested: false;
  evaluatorExecutionStarted: false;
  evaluatorExecutionEnabled: false;
  evaluatorExecuted: false;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
}

export interface ReviewOnlyMetadataHandoffCheckpointResult {
  schema: "ardyn.phase-5.41.review-only-metadata-handoff-checkpoint-result";
  schemaVersion: "0.1.0";
  metadataHandoffCheckpointKind: "review-only-metadata-handoff-checkpoint";
  metadataHandoffCheckpointMode: "review-only";
  reviewedAt: string;
  classification: ReviewOnlyMetadataHandoffCheckpointClassification;
  checkpointHandoffLayerAccepted: boolean;
  metadataHandoffCheckpointProduced: boolean;
  metadataHandoffCheckpointIsReviewerRouting: false;
  metadataHandoffCheckpointIsReviewerAssignment: false;
  metadataHandoffCheckpointIsEvaluatorExecution: false;
  metadataHandoffCheckpointIsEvaluatorResult: false;
  metadataHandoffCheckpointIsApprovalDecision: false;
  metadataHandoffCheckpointIsApprovalGrant: false;
  metadataHandoffCheckpoint: ReviewOnlyMetadataHandoffCheckpointState | null;
  checkpointHandoffLayerSummary: {
    schema: "ardyn.phase-5.40.review-only-checkpoint-handoff-layer-state";
    stateKind: "review-only-checkpoint-handoff-layer-state";
    stateMode: "review-only";
    reviewedAt: string;
    stateDigest: string;
    checkpointHandoffMetadataOnly: true;
    checkpointHandoffLayerIsReviewerRouting: false;
    checkpointHandoffLayerIsReviewerAssignment: false;
    checkpointHandoffLayerIsEvaluatorExecution: false;
    checkpointHandoffLayerIsEvaluatorResult: false;
    checkpointHandoffLayerIsApprovalDecision: false;
    checkpointHandoffLayerIsApprovalGrant: false;
    reviewerRoutingPerformed: false;
    reviewerAssignmentPerformed: false;
    evaluatorResultProduced: false;
    approvalDecisionProduced: false;
    approvalGrantProduced: false;
    approvalGrantPersisted: false;
    evaluatorExecuted: false;
    runtimeEffectAllFalse: true;
  } | null;
  cleanupHardeningToolkitEvidence: ReviewOnlyMetadataHandoffCheckpointState["cleanupHardeningToolkitEvidence"];
  reviewOnly: true;
  authoritative: false;
  reviewArtifactOnly: true;
  metadataHandoffCheckpointMetadataOnly: true;
  reviewerRoutingPerformed: false;
  reviewerRoutingEnabled: false;
  reviewerRouteId: null;
  reviewerAssignmentPerformed: false;
  reviewerAssignmentEnabled: false;
  reviewerAssignmentId: null;
  reviewerId: null;
  evaluatorResultProduced: false;
  evaluatorResultPersisted: false;
  evaluatorResultId: null;
  approvalDecisionProduced: false;
  approvalDecisionPersisted: false;
  approvalDecisionId: null;
  approvalGrant: RuntimeApprovalGrantBlocked;
  approvalGrantProduced: false;
  approvalGrantPersisted: false;
  approvalGrantId: null;
  runtimePermissionGranted: false;
  commandExposurePermissionGranted: false;
  runtimeCommandExposureEnabled: false;
  runtimeExecutionEnabled: false;
  evaluatorExecutionRequested: false;
  evaluatorExecutionStarted: false;
  evaluatorExecutionEnabled: false;
  evaluatorExecuted: false;
  rejectionReasons: string[];
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
}

export interface ReviewOnlyHandoffMetadataConsolidationLayerState {
  schema: "ardyn.phase-5.42.review-only-handoff-metadata-consolidation-layer-state";
  schemaVersion: "0.1.0";
  stateKind: "review-only-handoff-metadata-consolidation-layer-state";
  stateMode: "review-only";
  reviewedAt: string;
  sourceMetadataHandoffCheckpoint: {
    schema: "ardyn.phase-5.41.review-only-metadata-handoff-checkpoint-state";
    stateKind: "review-only-metadata-handoff-checkpoint-state";
    stateMode: "review-only";
    reviewedAt: string;
    stateDigest: string;
    sourceCheckpointHandoffLayerDigest: string;
    sourceInspectionHandoffCheckpointDigest: string;
    metadataHandoffCheckpointMetadataOnly: true;
    metadataHandoffCheckpointIsReviewerRouting: false;
    metadataHandoffCheckpointIsReviewerAssignment: false;
    metadataHandoffCheckpointIsEvaluatorExecution: false;
    metadataHandoffCheckpointIsEvaluatorResult: false;
    metadataHandoffCheckpointIsApprovalDecision: false;
    metadataHandoffCheckpointIsApprovalGrant: false;
    reviewerRoutingPerformed: false;
    reviewerAssignmentPerformed: false;
    evaluatorResultProduced: false;
    approvalDecisionProduced: false;
    approvalGrantProduced: false;
    approvalGrantPersisted: false;
    evaluatorExecuted: false;
    runtimeEffectAllFalse: true;
  };
  handoffMetadataConsolidationSummary: {
    handoffMetadataConsolidationLayerKind:
      "review-only-handoff-metadata-consolidation-layer";
    handoffMetadataConsolidationLayerMode: "review-only";
    sourceMetadataHandoffCheckpointClassification:
      "valid_review_only_metadata_handoff_checkpoint_runtime_still_blocked";
    handoffMetadataConsolidationLayerMetadataOnly: true;
    cleanupHardeningToolkitEvidence:
      "installed-toolkit-validation-evidence-only";
    reviewerRoutingPerformed: false;
    reviewerAssignmentPerformed: false;
    evaluatorExecutionPerformed: false;
    evaluatorResultProduced: false;
    approvalDecisionProduced: false;
    approvalGrantProduced: false;
    runtimePermissionGranted: false;
    commandExposurePermissionGranted: false;
    evaluatorExecuted: false;
    runtimeEffectAllFalse: true;
  };
  cleanupHardeningToolkitEvidence: {
    phase: "phase-5.42-review-only-handoff-metadata-consolidation-layer";
    evidenceMode: "installed-cleanup-hardening-toolkit-validation-only";
    npmAuditRequired: true;
    cargoAuditRequired: true;
    cargoMacheteRequired: true;
    fallowStaticRequired: true;
    optionalAdvisoryChecksAllowed: true;
    megaLinterRun: false;
    broadTrunkRewriteRun: false;
    toolsInstalledByPhase542: false;
    fallowRuntimeUsed: false;
    runtimeExecutionEnabled: false;
    commandExposurePermissionGranted: false;
  };
  metadataHandoffCheckpointAccepted: true;
  handoffMetadataConsolidationLayerMetadataOnly: true;
  handoffMetadataConsolidationLayerIsReviewerRouting: false;
  handoffMetadataConsolidationLayerIsReviewerAssignment: false;
  handoffMetadataConsolidationLayerIsEvaluatorExecution: false;
  handoffMetadataConsolidationLayerIsEvaluatorResult: false;
  handoffMetadataConsolidationLayerIsApprovalDecision: false;
  handoffMetadataConsolidationLayerIsApprovalGrant: false;
  reviewerRoutingPerformed: false;
  reviewerRoutingEnabled: false;
  reviewerRouteId: null;
  reviewerAssignmentPerformed: false;
  reviewerAssignmentEnabled: false;
  reviewerAssignmentId: null;
  reviewerId: null;
  evaluatorResultProduced: false;
  evaluatorResultPersisted: false;
  evaluatorResultId: null;
  approvalDecisionProduced: false;
  approvalDecisionPersisted: false;
  approvalDecisionId: null;
  approvalGrantProduced: false;
  approvalGrantPersisted: false;
  approvalGrantId: null;
  runtimePermissionGranted: false;
  commandExposurePermissionGranted: false;
  runtimeCommandExposureEnabled: false;
  runtimeExecutionEnabled: false;
  evaluatorExecutionRequested: false;
  evaluatorExecutionStarted: false;
  evaluatorExecutionEnabled: false;
  evaluatorExecuted: false;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
}

export interface ReviewOnlyHandoffMetadataConsolidationLayerResult {
  schema: "ardyn.phase-5.42.review-only-handoff-metadata-consolidation-layer-result";
  schemaVersion: "0.1.0";
  handoffMetadataConsolidationLayerKind:
    "review-only-handoff-metadata-consolidation-layer";
  handoffMetadataConsolidationLayerMode: "review-only";
  reviewedAt: string;
  classification: ReviewOnlyHandoffMetadataConsolidationLayerClassification;
  metadataHandoffCheckpointAccepted: boolean;
  handoffMetadataConsolidationLayerProduced: boolean;
  handoffMetadataConsolidationLayerIsReviewerRouting: false;
  handoffMetadataConsolidationLayerIsReviewerAssignment: false;
  handoffMetadataConsolidationLayerIsEvaluatorExecution: false;
  handoffMetadataConsolidationLayerIsEvaluatorResult: false;
  handoffMetadataConsolidationLayerIsApprovalDecision: false;
  handoffMetadataConsolidationLayerIsApprovalGrant: false;
  handoffMetadataConsolidationLayer:
    | ReviewOnlyHandoffMetadataConsolidationLayerState
    | null;
  metadataHandoffCheckpointSummary: {
    schema: "ardyn.phase-5.41.review-only-metadata-handoff-checkpoint-state";
    stateKind: "review-only-metadata-handoff-checkpoint-state";
    stateMode: "review-only";
    reviewedAt: string;
    stateDigest: string;
    metadataHandoffCheckpointMetadataOnly: true;
    metadataHandoffCheckpointIsReviewerRouting: false;
    metadataHandoffCheckpointIsReviewerAssignment: false;
    metadataHandoffCheckpointIsEvaluatorExecution: false;
    metadataHandoffCheckpointIsEvaluatorResult: false;
    metadataHandoffCheckpointIsApprovalDecision: false;
    metadataHandoffCheckpointIsApprovalGrant: false;
    reviewerRoutingPerformed: false;
    reviewerAssignmentPerformed: false;
    evaluatorResultProduced: false;
    approvalDecisionProduced: false;
    approvalGrantProduced: false;
    approvalGrantPersisted: false;
    evaluatorExecuted: false;
    runtimeEffectAllFalse: true;
  } | null;
  cleanupHardeningToolkitEvidence:
    ReviewOnlyHandoffMetadataConsolidationLayerState["cleanupHardeningToolkitEvidence"];
  reviewOnly: true;
  authoritative: false;
  reviewArtifactOnly: true;
  handoffMetadataConsolidationLayerMetadataOnly: true;
  reviewerRoutingPerformed: false;
  reviewerRoutingEnabled: false;
  reviewerRouteId: null;
  reviewerAssignmentPerformed: false;
  reviewerAssignmentEnabled: false;
  reviewerAssignmentId: null;
  reviewerId: null;
  evaluatorResultProduced: false;
  evaluatorResultPersisted: false;
  evaluatorResultId: null;
  approvalDecisionProduced: false;
  approvalDecisionPersisted: false;
  approvalDecisionId: null;
  approvalGrant: RuntimeApprovalGrantBlocked;
  approvalGrantProduced: false;
  approvalGrantPersisted: false;
  approvalGrantId: null;
  runtimePermissionGranted: false;
  commandExposurePermissionGranted: false;
  runtimeCommandExposureEnabled: false;
  runtimeExecutionEnabled: false;
  evaluatorExecutionRequested: false;
  evaluatorExecutionStarted: false;
  evaluatorExecutionEnabled: false;
  evaluatorExecuted: false;
  rejectionReasons: string[];
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
}

export interface ReviewOnlyConsolidationCheckpointHandoffState {
  schema: "ardyn.phase-5.43.review-only-consolidation-checkpoint-handoff-state";
  schemaVersion: "0.1.0";
  stateKind: "review-only-consolidation-checkpoint-handoff-state";
  stateMode: "review-only";
  reviewedAt: string;
  sourceHandoffMetadataConsolidationLayer: {
    schema: "ardyn.phase-5.42.review-only-handoff-metadata-consolidation-layer-state";
    stateKind: "review-only-handoff-metadata-consolidation-layer-state";
    stateMode: "review-only";
    reviewedAt: string;
    stateDigest: string;
    sourceMetadataHandoffCheckpointDigest: string;
    sourceCheckpointHandoffLayerDigest: string;
    sourceInspectionHandoffCheckpointDigest: string;
    handoffMetadataConsolidationLayerMetadataOnly: true;
    handoffMetadataConsolidationLayerIsReviewerRouting: false;
    handoffMetadataConsolidationLayerIsReviewerAssignment: false;
    handoffMetadataConsolidationLayerIsEvaluatorExecution: false;
    handoffMetadataConsolidationLayerIsEvaluatorResult: false;
    handoffMetadataConsolidationLayerIsApprovalDecision: false;
    handoffMetadataConsolidationLayerIsApprovalGrant: false;
    reviewerRoutingPerformed: false;
    reviewerAssignmentPerformed: false;
    evaluatorResultProduced: false;
    approvalDecisionProduced: false;
    approvalGrantProduced: false;
    approvalGrantPersisted: false;
    evaluatorExecuted: false;
    runtimeEffectAllFalse: true;
  };
  consolidationCheckpointHandoffSummary: {
    consolidationCheckpointHandoffKind:
      "review-only-consolidation-checkpoint-handoff";
    consolidationCheckpointHandoffMode: "review-only";
    sourceHandoffMetadataConsolidationLayerClassification:
      "valid_review_only_handoff_metadata_consolidation_layer_runtime_still_blocked";
    consolidationCheckpointHandoffMetadataOnly: true;
    cleanupHardeningToolkitEvidence:
      "installed-toolkit-validation-evidence-only";
    reviewerRoutingPerformed: false;
    reviewerAssignmentPerformed: false;
    evaluatorExecutionPerformed: false;
    evaluatorResultProduced: false;
    approvalDecisionProduced: false;
    approvalGrantProduced: false;
    runtimePermissionGranted: false;
    commandExposurePermissionGranted: false;
    evaluatorExecuted: false;
    runtimeEffectAllFalse: true;
  };
  cleanupHardeningToolkitEvidence: {
    phase: "phase-5.43-review-only-consolidation-checkpoint-handoff";
    evidenceMode: "installed-cleanup-hardening-toolkit-validation-only";
    npmAuditRequired: true;
    cargoAuditRequired: true;
    cargoMacheteRequired: true;
    fallowStaticRequired: true;
    optionalAdvisoryChecksAllowed: true;
    megaLinterRun: false;
    broadTrunkRewriteRun: false;
    toolsInstalledByPhase543: false;
    fallowRuntimeUsed: false;
    runtimeExecutionEnabled: false;
    commandExposurePermissionGranted: false;
  };
  sourceHandoffMetadataConsolidationLayerAccepted: true;
  consolidationCheckpointHandoffMetadataOnly: true;
  consolidationCheckpointHandoffIsReviewerRouting: false;
  consolidationCheckpointHandoffIsReviewerAssignment: false;
  consolidationCheckpointHandoffIsEvaluatorExecution: false;
  consolidationCheckpointHandoffIsEvaluatorResult: false;
  consolidationCheckpointHandoffIsApprovalDecision: false;
  consolidationCheckpointHandoffIsApprovalGrant: false;
  reviewerRoutingPerformed: false;
  reviewerRoutingEnabled: false;
  reviewerRouteId: null;
  reviewerAssignmentPerformed: false;
  reviewerAssignmentEnabled: false;
  reviewerAssignmentId: null;
  reviewerId: null;
  evaluatorResultProduced: false;
  evaluatorResultPersisted: false;
  evaluatorResultId: null;
  approvalDecisionProduced: false;
  approvalDecisionPersisted: false;
  approvalDecisionId: null;
  approvalGrantProduced: false;
  approvalGrantPersisted: false;
  approvalGrantId: null;
  runtimePermissionGranted: false;
  commandExposurePermissionGranted: false;
  runtimeCommandExposureEnabled: false;
  runtimeExecutionEnabled: false;
  evaluatorExecutionRequested: false;
  evaluatorExecutionStarted: false;
  evaluatorExecutionEnabled: false;
  evaluatorExecuted: false;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
}

export interface ReviewOnlyConsolidationCheckpointHandoffResult {
  schema: "ardyn.phase-5.43.review-only-consolidation-checkpoint-handoff-result";
  schemaVersion: "0.1.0";
  consolidationCheckpointHandoffKind:
    "review-only-consolidation-checkpoint-handoff";
  consolidationCheckpointHandoffMode: "review-only";
  reviewedAt: string;
  classification: ReviewOnlyConsolidationCheckpointHandoffClassification;
  sourceHandoffMetadataConsolidationLayerAccepted: boolean;
  consolidationCheckpointHandoffProduced: boolean;
  consolidationCheckpointHandoffIsReviewerRouting: false;
  consolidationCheckpointHandoffIsReviewerAssignment: false;
  consolidationCheckpointHandoffIsEvaluatorExecution: false;
  consolidationCheckpointHandoffIsEvaluatorResult: false;
  consolidationCheckpointHandoffIsApprovalDecision: false;
  consolidationCheckpointHandoffIsApprovalGrant: false;
  consolidationCheckpointHandoff:
    | ReviewOnlyConsolidationCheckpointHandoffState
    | null;
  handoffMetadataConsolidationLayerSummary: {
    schema: "ardyn.phase-5.42.review-only-handoff-metadata-consolidation-layer-state";
    stateKind: "review-only-handoff-metadata-consolidation-layer-state";
    stateMode: "review-only";
    reviewedAt: string;
    stateDigest: string;
    handoffMetadataConsolidationLayerMetadataOnly: true;
    handoffMetadataConsolidationLayerIsReviewerRouting: false;
    handoffMetadataConsolidationLayerIsReviewerAssignment: false;
    handoffMetadataConsolidationLayerIsEvaluatorExecution: false;
    handoffMetadataConsolidationLayerIsEvaluatorResult: false;
    handoffMetadataConsolidationLayerIsApprovalDecision: false;
    handoffMetadataConsolidationLayerIsApprovalGrant: false;
    reviewerRoutingPerformed: false;
    reviewerAssignmentPerformed: false;
    evaluatorResultProduced: false;
    approvalDecisionProduced: false;
    approvalGrantProduced: false;
    approvalGrantPersisted: false;
    evaluatorExecuted: false;
    runtimeEffectAllFalse: true;
  } | null;
  cleanupHardeningToolkitEvidence:
    ReviewOnlyConsolidationCheckpointHandoffState["cleanupHardeningToolkitEvidence"];
  reviewOnly: true;
  authoritative: false;
  reviewArtifactOnly: true;
  consolidationCheckpointHandoffMetadataOnly: true;
  reviewerRoutingPerformed: false;
  reviewerRoutingEnabled: false;
  reviewerRouteId: null;
  reviewerAssignmentPerformed: false;
  reviewerAssignmentEnabled: false;
  reviewerAssignmentId: null;
  reviewerId: null;
  evaluatorResultProduced: false;
  evaluatorResultPersisted: false;
  evaluatorResultId: null;
  approvalDecisionProduced: false;
  approvalDecisionPersisted: false;
  approvalDecisionId: null;
  approvalGrant: RuntimeApprovalGrantBlocked;
  approvalGrantProduced: false;
  approvalGrantPersisted: false;
  approvalGrantId: null;
  runtimePermissionGranted: false;
  commandExposurePermissionGranted: false;
  runtimeCommandExposureEnabled: false;
  runtimeExecutionEnabled: false;
  evaluatorExecutionRequested: false;
  evaluatorExecutionStarted: false;
  evaluatorExecutionEnabled: false;
  evaluatorExecuted: false;
  rejectionReasons: string[];
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
}

export interface ReviewOnlyConsolidationMetadataCheckpointState {
  schema: "ardyn.phase-5.44.review-only-consolidation-metadata-checkpoint-state";
  schemaVersion: "0.1.0";
  stateKind: "review-only-consolidation-metadata-checkpoint-state";
  stateMode: "review-only";
  reviewedAt: string;
  sourceConsolidationCheckpointHandoff: {
    schema: "ardyn.phase-5.43.review-only-consolidation-checkpoint-handoff-state";
    stateKind: "review-only-consolidation-checkpoint-handoff-state";
    stateMode: "review-only";
    reviewedAt: string;
    stateDigest: string;
    sourceHandoffMetadataConsolidationLayerDigest: string;
    sourceMetadataHandoffCheckpointDigest: string;
    sourceCheckpointHandoffLayerDigest: string;
    sourceInspectionHandoffCheckpointDigest: string;
    consolidationCheckpointHandoffMetadataOnly: true;
    consolidationCheckpointHandoffIsReviewerRouting: false;
    consolidationCheckpointHandoffIsReviewerAssignment: false;
    consolidationCheckpointHandoffIsEvaluatorExecution: false;
    consolidationCheckpointHandoffIsEvaluatorResult: false;
    consolidationCheckpointHandoffIsApprovalDecision: false;
    consolidationCheckpointHandoffIsApprovalGrant: false;
    reviewerRoutingPerformed: false;
    reviewerAssignmentPerformed: false;
    evaluatorResultProduced: false;
    approvalDecisionProduced: false;
    approvalGrantProduced: false;
    approvalGrantPersisted: false;
    evaluatorExecuted: false;
    runtimeEffectAllFalse: true;
  };
  consolidationMetadataCheckpointSummary: {
    consolidationMetadataCheckpointKind:
      "review-only-consolidation-metadata-checkpoint";
    consolidationMetadataCheckpointMode: "review-only";
    sourceConsolidationCheckpointHandoffClassification:
      "valid_review_only_consolidation_checkpoint_handoff_runtime_still_blocked";
    consolidationMetadataCheckpointMetadataOnly: true;
    cleanupHardeningToolkitEvidence:
      "installed-toolkit-validation-evidence-only";
    reviewerRoutingPerformed: false;
    reviewerAssignmentPerformed: false;
    evaluatorExecutionPerformed: false;
    evaluatorResultProduced: false;
    approvalDecisionProduced: false;
    approvalGrantProduced: false;
    runtimePermissionGranted: false;
    commandExposurePermissionGranted: false;
    evaluatorExecuted: false;
    runtimeEffectAllFalse: true;
  };
  cleanupHardeningToolkitEvidence: {
    phase: "phase-5.44-review-only-consolidation-metadata-checkpoint";
    evidenceMode: "installed-cleanup-hardening-toolkit-validation-only";
    npmAuditRequired: true;
    cargoAuditRequired: true;
    cargoMacheteRequired: true;
    fallowStaticRequired: true;
    optionalAdvisoryChecksAllowed: true;
    megaLinterRun: false;
    broadTrunkRewriteRun: false;
    toolsInstalledByPhase544: false;
    fallowRuntimeUsed: false;
    runtimeExecutionEnabled: false;
    commandExposurePermissionGranted: false;
  };
  sourceConsolidationCheckpointHandoffAccepted: true;
  consolidationMetadataCheckpointMetadataOnly: true;
  consolidationMetadataCheckpointIsReviewerRouting: false;
  consolidationMetadataCheckpointIsReviewerAssignment: false;
  consolidationMetadataCheckpointIsEvaluatorExecution: false;
  consolidationMetadataCheckpointIsEvaluatorResult: false;
  consolidationMetadataCheckpointIsApprovalDecision: false;
  consolidationMetadataCheckpointIsApprovalGrant: false;
  reviewerRoutingPerformed: false;
  reviewerRoutingEnabled: false;
  reviewerRouteId: null;
  reviewerAssignmentPerformed: false;
  reviewerAssignmentEnabled: false;
  reviewerAssignmentId: null;
  reviewerId: null;
  evaluatorResultProduced: false;
  evaluatorResultPersisted: false;
  evaluatorResultId: null;
  approvalDecisionProduced: false;
  approvalDecisionPersisted: false;
  approvalDecisionId: null;
  approvalGrantProduced: false;
  approvalGrantPersisted: false;
  approvalGrantId: null;
  runtimePermissionGranted: false;
  commandExposurePermissionGranted: false;
  runtimeCommandExposureEnabled: false;
  runtimeExecutionEnabled: false;
  evaluatorExecutionRequested: false;
  evaluatorExecutionStarted: false;
  evaluatorExecutionEnabled: false;
  evaluatorExecuted: false;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
}

export interface ReviewOnlyConsolidationMetadataCheckpointResult {
  schema: "ardyn.phase-5.44.review-only-consolidation-metadata-checkpoint-result";
  schemaVersion: "0.1.0";
  consolidationMetadataCheckpointKind:
    "review-only-consolidation-metadata-checkpoint";
  consolidationMetadataCheckpointMode: "review-only";
  reviewedAt: string;
  classification: ReviewOnlyConsolidationMetadataCheckpointClassification;
  sourceConsolidationCheckpointHandoffAccepted: boolean;
  consolidationMetadataCheckpointProduced: boolean;
  consolidationMetadataCheckpointIsReviewerRouting: false;
  consolidationMetadataCheckpointIsReviewerAssignment: false;
  consolidationMetadataCheckpointIsEvaluatorExecution: false;
  consolidationMetadataCheckpointIsEvaluatorResult: false;
  consolidationMetadataCheckpointIsApprovalDecision: false;
  consolidationMetadataCheckpointIsApprovalGrant: false;
  consolidationMetadataCheckpoint:
    | ReviewOnlyConsolidationMetadataCheckpointState
    | null;
  consolidationCheckpointHandoffSummary: {
    schema: "ardyn.phase-5.43.review-only-consolidation-checkpoint-handoff-state";
    stateKind: "review-only-consolidation-checkpoint-handoff-state";
    stateMode: "review-only";
    reviewedAt: string;
    stateDigest: string;
    consolidationCheckpointHandoffMetadataOnly: true;
    consolidationCheckpointHandoffIsReviewerRouting: false;
    consolidationCheckpointHandoffIsReviewerAssignment: false;
    consolidationCheckpointHandoffIsEvaluatorExecution: false;
    consolidationCheckpointHandoffIsEvaluatorResult: false;
    consolidationCheckpointHandoffIsApprovalDecision: false;
    consolidationCheckpointHandoffIsApprovalGrant: false;
    reviewerRoutingPerformed: false;
    reviewerAssignmentPerformed: false;
    evaluatorResultProduced: false;
    approvalDecisionProduced: false;
    approvalGrantProduced: false;
    approvalGrantPersisted: false;
    evaluatorExecuted: false;
    runtimeEffectAllFalse: true;
  } | null;
  cleanupHardeningToolkitEvidence:
    ReviewOnlyConsolidationMetadataCheckpointState["cleanupHardeningToolkitEvidence"];
  reviewOnly: true;
  authoritative: false;
  reviewArtifactOnly: true;
  consolidationMetadataCheckpointMetadataOnly: true;
  reviewerRoutingPerformed: false;
  reviewerRoutingEnabled: false;
  reviewerRouteId: null;
  reviewerAssignmentPerformed: false;
  reviewerAssignmentEnabled: false;
  reviewerAssignmentId: null;
  reviewerId: null;
  evaluatorResultProduced: false;
  evaluatorResultPersisted: false;
  evaluatorResultId: null;
  approvalDecisionProduced: false;
  approvalDecisionPersisted: false;
  approvalDecisionId: null;
  approvalGrant: RuntimeApprovalGrantBlocked;
  approvalGrantProduced: false;
  approvalGrantPersisted: false;
  approvalGrantId: null;
  runtimePermissionGranted: false;
  commandExposurePermissionGranted: false;
  runtimeCommandExposureEnabled: false;
  runtimeExecutionEnabled: false;
  evaluatorExecutionRequested: false;
  evaluatorExecutionStarted: false;
  evaluatorExecutionEnabled: false;
  evaluatorExecuted: false;
  rejectionReasons: string[];
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
}

export interface TargetConsumerPlanningMetadataState {
  schema: "ardyn.phase-5.45.target-consumer-planning-metadata-state";
  schemaVersion: "0.1.0";
  stateKind: "target-consumer-planning-metadata-state";
  stateMode: "review-only";
  reviewedAt: string;
  sourceConsolidationMetadataCheckpoint: {
    schema: "ardyn.phase-5.44.review-only-consolidation-metadata-checkpoint-state";
    stateKind: "review-only-consolidation-metadata-checkpoint-state";
    stateMode: "review-only";
    reviewedAt: string;
    stateDigest: string;
    consolidationMetadataCheckpointMetadataOnly: true;
    consolidationMetadataCheckpointIsReviewerRouting: false;
    consolidationMetadataCheckpointIsReviewerAssignment: false;
    consolidationMetadataCheckpointIsEvaluatorExecution: false;
    consolidationMetadataCheckpointIsEvaluatorResult: false;
    consolidationMetadataCheckpointIsApprovalDecision: false;
    consolidationMetadataCheckpointIsApprovalGrant: false;
    runtimeEffectAllFalse: true;
  };
  primaryHarnessLayer: {
    product: "Ardyn";
    layerKind: "primary-harness-framework-wrapper-layer";
    repoFamilyScope: "ardyn-repo-family";
    primaryHarnessForRepoFamily: true;
    firstClassTargetConsumers: ["locus", "multiverse"];
    planningMetadataOnly: true;
    runtimeBlocked: true;
    secureDropConsumerOnlyAfterExplicitAuthorization: true;
  };
  targetConsumers: Array<{
    consumerId: "locus" | "multiverse";
    consumerName: "Locus" | "Multiverse";
    firstClassTargetConsumer: true;
    consumerRole: string;
    contractCoverage: string[];
    nonAuthorizingBoundary: Record<string, false>;
  } & Record<string, unknown>>;
  secureDropFutureCapability: {
    capabilityName: "Secure Drop";
    canonicalCapability: "content-fabric.secure-drop";
    canonicalCapabilityOwner: "content-fabric";
    phaseStatus: "future-canonical-content-fabric-capability-reference-only";
    ardynMayConsumeAfterExplicitAuthorization: true;
    ardynConsumesNow: false;
    cryptoImplemented: false;
    transportImplemented: false;
    stegoImplemented: false;
    sendReceiveImplemented: false;
    composeRuntimeImplemented: false;
    inboxPollingImplemented: false;
    fileSelectionImplemented: false;
    filesystemScanningImplemented: false;
    connectorIngestionImplemented: false;
    secretVaultEnvAccessImplemented: false;
    st3ggVendored: false;
    contentFabricRuntimeBehaviorEnabled: false;
  };
  targetConsumerPlanningSummary: Record<string, boolean | number | string | string[]>;
  targetConsumerIds: ["locus", "multiverse"];
  targetConsumerPlanningMetadataOnly: true;
  reviewOnly: true;
  authoritative: false;
  reviewArtifactOnly: true;
  targetConsumerPlanningMetadataIsReviewerRouting: false;
  targetConsumerPlanningMetadataIsReviewerAssignment: false;
  targetConsumerPlanningMetadataIsEvaluatorExecution: false;
  targetConsumerPlanningMetadataIsEvaluatorResult: false;
  targetConsumerPlanningMetadataIsApprovalDecision: false;
  targetConsumerPlanningMetadataIsApprovalGrant: false;
  commandRuntimeControlEnabled: false;
  commandExposurePermissionGranted: false;
  runtimePermissionGranted: false;
  runtimeCommandExposureEnabled: false;
  runtimeExecutionEnabled: false;
  reviewerRoutingPerformed: false;
  reviewerAssignmentPerformed: false;
  evaluatorExecutionPerformed: false;
  evaluatorResultProduced: false;
  approvalDecisionProduced: false;
  approvalGrantProduced: false;
  approvalGrantPersisted: false;
  connectorGrantProduced: false;
  connectorIngestionAdded: false;
  liveRegistryConnectionEnabled: false;
  webSocketRuntimeEnabled: false;
  httpRuntimeEnabled: false;
  taskRuntimeExecutionEnabled: false;
  mcpRuntimeExecutionEnabled: false;
  fabricRuntimeSurfaceEnabled: false;
  contentFabricRuntimeBehaviorEnabled: false;
  adapterRuntimeBehaviorEnabled: false;
  secureDropImplemented: false;
  secureDropCryptoImplemented: false;
  secureDropTransportImplemented: false;
  secureDropStegoImplemented: false;
  secureDropSendReceiveImplemented: false;
  secureDropInboxPollingEnabled: false;
  fileSelectionEnabled: false;
  filesystemWatcherEnabled: false;
  filesystemScanningEnabled: false;
  secretVaultEnvAccessEnabled: false;
  st3ggVendored: false;
  processControlEnabled: false;
  liveStdinLoopEnabled: false;
  runtimeStdoutWriterEnabled: false;
  runtimeStderrWriterEnabled: false;
  transcriptRuntimeWritePerformed: false;
  auditRuntimeWritePerformed: false;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
}

export interface TargetConsumerPlanningMetadataResult {
  schema: "ardyn.phase-5.45.target-consumer-planning-metadata-result";
  schemaVersion: "0.1.0";
  targetConsumerPlanningMetadataKind: "target-consumer-planning-metadata";
  targetConsumerPlanningMetadataMode: "review-only";
  reviewedAt: string;
  classification: TargetConsumerPlanningMetadataClassification;
  sourceConsolidationMetadataCheckpointAccepted: boolean;
  targetConsumerPlanningMetadataProduced: boolean;
  targetConsumerPlanningMetadata: TargetConsumerPlanningMetadataState | null;
  sourceConsolidationMetadataCheckpointSummary:
    | TargetConsumerPlanningMetadataState["sourceConsolidationMetadataCheckpoint"]
    | null;
  targetConsumerPlanningSummary:
    | TargetConsumerPlanningMetadataState["targetConsumerPlanningSummary"]
    | null;
  targetConsumers: TargetConsumerPlanningMetadataState["targetConsumers"];
  targetConsumerIds: Array<"locus" | "multiverse">;
  secureDropFutureCapability:
    | TargetConsumerPlanningMetadataState["secureDropFutureCapability"]
    | null;
  reviewOnly: true;
  authoritative: false;
  reviewArtifactOnly: true;
  targetConsumerPlanningMetadataOnly: true;
  targetConsumerPlanningMetadataIsReviewerRouting: false;
  targetConsumerPlanningMetadataIsReviewerAssignment: false;
  targetConsumerPlanningMetadataIsEvaluatorExecution: false;
  targetConsumerPlanningMetadataIsEvaluatorResult: false;
  targetConsumerPlanningMetadataIsApprovalDecision: false;
  targetConsumerPlanningMetadataIsApprovalGrant: false;
  commandRuntimeControlEnabled: false;
  commandExposurePermissionGranted: false;
  runtimePermissionGranted: false;
  runtimeCommandExposureEnabled: false;
  runtimeExecutionEnabled: false;
  reviewerRoutingPerformed: false;
  reviewerAssignmentPerformed: false;
  evaluatorExecutionPerformed: false;
  evaluatorResultProduced: false;
  approvalDecisionProduced: false;
  approvalGrantProduced: false;
  approvalGrantPersisted: false;
  connectorGrantProduced: false;
  connectorIngestionAdded: false;
  liveRegistryConnectionEnabled: false;
  webSocketRuntimeEnabled: false;
  httpRuntimeEnabled: false;
  taskRuntimeExecutionEnabled: false;
  mcpRuntimeExecutionEnabled: false;
  fabricRuntimeSurfaceEnabled: false;
  contentFabricRuntimeBehaviorEnabled: false;
  adapterRuntimeBehaviorEnabled: false;
  secureDropImplemented: false;
  secureDropCryptoImplemented: false;
  secureDropTransportImplemented: false;
  secureDropStegoImplemented: false;
  secureDropSendReceiveImplemented: false;
  secureDropInboxPollingEnabled: false;
  fileSelectionEnabled: false;
  filesystemWatcherEnabled: false;
  filesystemScanningEnabled: false;
  secretVaultEnvAccessEnabled: false;
  st3ggVendored: false;
  processControlEnabled: false;
  liveStdinLoopEnabled: false;
  runtimeStdoutWriterEnabled: false;
  runtimeStderrWriterEnabled: false;
  transcriptRuntimeWritePerformed: false;
  auditRuntimeWritePerformed: false;
  rejectionReasons: string[];
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
}

export type ConsumerContractReadinessMatrixClassification =
  | "missing_consumer_contract_readiness_matrix_input_rejected"
  | "malformed_consumer_contract_readiness_matrix_input_rejected"
  | "empty_consumer_contract_readiness_matrix_input_rejected"
  | "duplicate_invalid_consumer_contract_readiness_matrix_input_rejected"
  | "mismatched_source_digest_consumer_contract_readiness_matrix_input_rejected"
  | "reviewer_routing_looking_consumer_contract_readiness_matrix_input_rejected"
  | "reviewer_assignment_looking_consumer_contract_readiness_matrix_input_rejected"
  | "evaluator_execution_looking_consumer_contract_readiness_matrix_input_rejected"
  | "evaluator_result_looking_consumer_contract_readiness_matrix_input_rejected"
  | "approval_decision_looking_consumer_contract_readiness_matrix_input_rejected"
  | "grant_looking_consumer_contract_readiness_matrix_input_rejected"
  | "runtime_permission_looking_consumer_contract_readiness_matrix_input_rejected"
  | "command_exposure_looking_consumer_contract_readiness_matrix_input_rejected"
  | "runtime_effect_true_consumer_contract_readiness_matrix_input_rejected"
  | "process_flag_true_consumer_contract_readiness_matrix_input_rejected"
  | "execution_signal_looking_consumer_contract_readiness_matrix_input_rejected"
  | "valid_consumer_contract_readiness_matrix_runtime_still_blocked";

export interface ConsumerContractReadinessMatrixRow {
  rowId: string;
  consumerId: "locus" | "multiverse";
  consumerName: "Locus" | "Multiverse";
  touchpointName: string;
  readinessState: "future-contract-required-runtime-blocked";
  requiredFutureContracts: string[];
  currentAllowedBehavior: string;
  explicitlyForbiddenBehavior: string[];
  authorizationFlags: {
    runtimeAuthorizationGranted: false;
    commandAuthorizationGranted: false;
    connectorAuthorizationGranted: false;
    fabricRuntimeAuthorizationGranted: false;
    webSocketRuntimeAuthorizationGranted: false;
    httpRuntimeAuthorizationGranted: false;
    mcpRuntimeAuthorizationGranted: false;
    mcpToolExposureAuthorizationGranted: false;
    taskRuntimeAuthorizationGranted: false;
    secureDropAuthorizationGranted: false;
    approvalGrantProduced: false;
    documentaryMetadataVisible: true;
  };
  blockerNotes: string[];
}

export interface ConsumerContractReadinessMatrixState {
  schema: "ardyn.phase-5.46.consumer-contract-readiness-matrix-state";
  schemaVersion: "0.1.0";
  stateKind: "consumer-contract-readiness-matrix-state";
  stateMode: "review-only";
  reviewedAt: string;
  sourceTargetConsumerPlanningMetadata: {
    schema: "ardyn.phase-5.45.target-consumer-planning-metadata-state";
    stateKind: "target-consumer-planning-metadata-state";
    stateMode: "review-only";
    reviewedAt: string;
    stateDigest: string;
    targetConsumerPlanningMetadataOnly: true;
    firstClassTargetConsumerIds: ["locus", "multiverse"];
    locusFirstClassTargetConsumer: true;
    multiverseFirstClassTargetConsumer: true;
    secureDropFutureContentFabricCapabilityReferenceOnly: true;
    runtimeEffectAllFalse: true;
  };
  matrixRows: ConsumerContractReadinessMatrixRow[];
  matrixSummary: Record<string, boolean | number | string | string[]>;
  targetConsumerIds: ["locus", "multiverse"];
  consumerContractReadinessMatrixOnly: true;
  reviewOnly: true;
  authoritative: false;
  reviewArtifactOnly: true;
  consumerContractReadinessMatrixIsReviewerRouting: false;
  consumerContractReadinessMatrixIsReviewerAssignment: false;
  consumerContractReadinessMatrixIsEvaluatorExecution: false;
  consumerContractReadinessMatrixIsEvaluatorResult: false;
  consumerContractReadinessMatrixIsApprovalDecision: false;
  consumerContractReadinessMatrixIsApprovalGrant: false;
  commandRuntimeControlEnabled: false;
  commandExposurePermissionGranted: false;
  runtimePermissionGranted: false;
  runtimeCommandExposureEnabled: false;
  runtimeExecutionEnabled: false;
  reviewerRoutingPerformed: false;
  reviewerAssignmentPerformed: false;
  evaluatorExecutionPerformed: false;
  evaluatorResultProduced: false;
  approvalDecisionProduced: false;
  approvalGrantProduced: false;
  approvalGrantPersisted: false;
  connectorGrantProduced: false;
  connectorIngestionAdded: false;
  liveRegistryConnectionEnabled: false;
  webSocketRuntimeEnabled: false;
  httpRuntimeEnabled: false;
  taskRuntimeExecutionEnabled: false;
  taskExecutionEnabled: false;
  mcpRuntimeExecutionEnabled: false;
  mcpToolExposureEnabled: false;
  fabricRuntimeSurfaceEnabled: false;
  contentFabricRuntimeBehaviorEnabled: false;
  adapterRuntimeBehaviorEnabled: false;
  secureDropImplemented: false;
  secureDropCryptoImplemented: false;
  secureDropTransportImplemented: false;
  secureDropStegoImplemented: false;
  secureDropSendReceiveImplemented: false;
  secureDropInboxPollingEnabled: false;
  fileSelectionEnabled: false;
  filesystemWatcherEnabled: false;
  filesystemScanningEnabled: false;
  secretVaultEnvAccessEnabled: false;
  st3ggVendored: false;
  processControlEnabled: false;
  liveStdinLoopEnabled: false;
  runtimeStdoutWriterEnabled: false;
  runtimeStderrWriterEnabled: false;
  transcriptRuntimeWritePerformed: false;
  auditRuntimeWritePerformed: false;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
}

export interface ConsumerContractReadinessMatrixResult {
  schema: "ardyn.phase-5.46.consumer-contract-readiness-matrix-result";
  schemaVersion: "0.1.0";
  consumerContractReadinessMatrixKind: "consumer-contract-readiness-matrix";
  consumerContractReadinessMatrixMode: "review-only";
  reviewedAt: string;
  classification: ConsumerContractReadinessMatrixClassification;
  sourceTargetConsumerPlanningMetadataAccepted: boolean;
  consumerContractReadinessMatrixProduced: boolean;
  consumerContractReadinessMatrix: ConsumerContractReadinessMatrixState | null;
  sourceTargetConsumerPlanningMetadataSummary:
    | ConsumerContractReadinessMatrixState["sourceTargetConsumerPlanningMetadata"]
    | null;
  matrixSummary: ConsumerContractReadinessMatrixState["matrixSummary"] | null;
  matrixRows: ConsumerContractReadinessMatrixRow[];
  targetConsumerIds: Array<"locus" | "multiverse">;
  reviewOnly: true;
  authoritative: false;
  reviewArtifactOnly: true;
  consumerContractReadinessMatrixOnly: true;
  consumerContractReadinessMatrixIsReviewerRouting: false;
  consumerContractReadinessMatrixIsReviewerAssignment: false;
  consumerContractReadinessMatrixIsEvaluatorExecution: false;
  consumerContractReadinessMatrixIsEvaluatorResult: false;
  consumerContractReadinessMatrixIsApprovalDecision: false;
  consumerContractReadinessMatrixIsApprovalGrant: false;
  commandRuntimeControlEnabled: false;
  commandExposurePermissionGranted: false;
  runtimePermissionGranted: false;
  runtimeCommandExposureEnabled: false;
  runtimeExecutionEnabled: false;
  reviewerRoutingPerformed: false;
  reviewerAssignmentPerformed: false;
  evaluatorExecutionPerformed: false;
  evaluatorResultProduced: false;
  approvalDecisionProduced: false;
  approvalGrantProduced: false;
  approvalGrantPersisted: false;
  connectorGrantProduced: false;
  connectorIngestionAdded: false;
  liveRegistryConnectionEnabled: false;
  webSocketRuntimeEnabled: false;
  httpRuntimeEnabled: false;
  taskRuntimeExecutionEnabled: false;
  taskExecutionEnabled: false;
  mcpRuntimeExecutionEnabled: false;
  mcpToolExposureEnabled: false;
  fabricRuntimeSurfaceEnabled: false;
  contentFabricRuntimeBehaviorEnabled: false;
  adapterRuntimeBehaviorEnabled: false;
  secureDropImplemented: false;
  secureDropCryptoImplemented: false;
  secureDropTransportImplemented: false;
  secureDropStegoImplemented: false;
  secureDropSendReceiveImplemented: false;
  secureDropInboxPollingEnabled: false;
  fileSelectionEnabled: false;
  filesystemWatcherEnabled: false;
  filesystemScanningEnabled: false;
  secretVaultEnvAccessEnabled: false;
  st3ggVendored: false;
  processControlEnabled: false;
  liveStdinLoopEnabled: false;
  runtimeStdoutWriterEnabled: false;
  runtimeStderrWriterEnabled: false;
  transcriptRuntimeWritePerformed: false;
  auditRuntimeWritePerformed: false;
  rejectionReasons: string[];
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
}

export interface ReviewOnlyRuntimeApprovalEvaluatorResult {
  schema: "ardyn.phase-5.18.review-only-approval-evaluator-result";
  schemaVersion: "0.1.0";
  evaluatorKind: "review-only-runtime-approval-evaluator";
  evaluationMode: "review-only";
  classification: ReviewOnlyApprovalEvaluatorClassification;
  prerequisiteSignalRecognized: boolean;
  reviewOnly: true;
  authoritative: false;
  approvalPrerequisiteReader: ApprovalPrerequisiteReaderResult;
  prerequisiteRecords: {
    runtimeApprovalRecord: ReviewOnlyApprovalPrerequisiteRecordStatus;
    commandExposureApprovalRecord: ReviewOnlyApprovalPrerequisiteRecordStatus;
  };
  rejectionReasons: string[];
  approvalGrant: RuntimeApprovalGrantBlocked;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
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
export function createFailureAuditRecordForReview(options?: {
  classification?: FailureAuditClassification;
  schemaVersion?: string;
  sourcePhase?: string;
  failureCategory?: string;
  terminalState?: string;
  exitCodeClassification?: string;
  exitCode?: number;
  stderrDiagnosticClassification?: string;
  diagnostic?: {
    code: string;
    message: string;
  };
  stdoutCommitBoundary?: Record<string, unknown>;
  cleanupRequirement?: Record<string, unknown>;
  killInterruptTimeoutSemantics?: Record<string, unknown>;
  failureReasons?: string[];
}): FailureAuditRecord;
export function classifyFailureAuditRecordForReview(
  record: unknown
): FailureAuditClassificationResult;
export function formatFailureAuditRecordJsonForReview(options?: {
  classification?: FailureAuditClassification;
  schemaVersion?: string;
  sourcePhase?: string;
  failureCategory?: string;
  terminalState?: string;
  exitCodeClassification?: string;
  exitCode?: number;
  stderrDiagnosticClassification?: string;
  diagnostic?: {
    code: string;
    message: string;
  };
  stdoutCommitBoundary?: Record<string, unknown>;
  cleanupRequirement?: Record<string, unknown>;
  killInterruptTimeoutSemantics?: Record<string, unknown>;
  failureReasons?: string[];
}): string;
export function readApprovalPrerequisiteRecordsForReview(input?: {
  reviewedAt?: string;
  prerequisiteRecords?: unknown[];
  runtimeApprovalRecord?: unknown;
  commandExposureApprovalRecord?: unknown;
}): ApprovalPrerequisiteReaderResult;
export function evaluateRuntimeApprovalPrerequisitesForReview(input?: {
  reviewedAt?: string;
  prerequisiteRecords?: unknown[];
  runtimeApprovalRecord?: unknown;
  commandExposureApprovalRecord?: unknown;
}): ReviewOnlyRuntimeApprovalEvaluatorResult;
export function preflightApprovalPrerequisiteSourcesForReview(input?: {
  reviewedAt?: string;
  sourceInputs?: unknown[];
}): ApprovalPrerequisiteSourcePreflightResult;
export function selectApprovalPrerequisiteSourcesForReview(input?: {
  reviewedAt?: string;
  sourceInputs?: unknown[];
}): ApprovalPrerequisiteSourceSelectionResult;
export function bundleApprovalPrerequisiteSourcesForReview(input?: {
  reviewedAt?: string;
  bundleParts?: unknown[];
}): ApprovalPrerequisiteSourceBundleResult;
export function consumeApprovalPrerequisiteBundleForReview(input?: {
  reviewedAt?: string;
  sourceBundle?: unknown;
}): ApprovalPrerequisiteBundleConsumptionCheckpointResult;
export function evaluatePrerequisiteIntegrationCheckpointForReview(input?: {
  reviewedAt?: string;
  sourceInputs?: unknown[];
}): ApprovalPrerequisiteIntegrationCheckpointResult;
export function createPrerequisiteReviewArtifactBoundaryForReview(input?: {
  reviewedAt?: string;
  sourceInputs?: unknown[];
}): PrerequisiteReviewArtifactBoundaryResult;
export function createReviewArtifactEvaluatorInputHandoffForReview(input?: {
  reviewedAt?: string;
  reviewArtifacts?: unknown[];
}): ReviewArtifactEvaluatorInputHandoffResult;
export function createApprovalEvaluatorCandidateIntakeCheckpointForReview(input?: {
  reviewedAt?: string;
  evaluatorInputCandidates?: unknown[];
}): ApprovalEvaluatorCandidateIntakeCheckpointResult;
export function createReviewOnlyEvaluatorPreflightCheckpointForReview(input?: {
  reviewedAt?: string;
  intakeCheckpointStates?: unknown[];
}): ReviewOnlyEvaluatorPreflightCheckpointResult;
export function createNonAuthorizingEvaluatorDecisionCandidateBoundaryForReview(input?: {
  reviewedAt?: string;
  preflightCheckpointStates?: unknown[];
}): NonAuthorizingEvaluatorDecisionCandidateBoundaryResult;
export function createNonAuthorizingEvaluatorDecisionCandidateInspectionArtifactForReview(input?: {
  reviewedAt?: string;
  decisionCandidateStates?: unknown[];
}): NonAuthorizingEvaluatorDecisionCandidateInspectionArtifactResult;
export function createHumanToolInspectionDispositionBoundaryForReview(input?: {
  reviewedAt?: string;
  inspectionArtifacts?: unknown[];
}): HumanToolInspectionDispositionBoundaryResult;
export function createReviewOnlyDispositionAggregationCheckpointForReview(input?: {
  reviewedAt?: string;
  dispositionStates?: unknown[];
}): ReviewOnlyDispositionAggregationCheckpointResult;
export function createReviewOnlyAggregationInspectionHandoffForReview(input?: {
  reviewedAt?: string;
  aggregationStates?: unknown[];
}): ReviewOnlyAggregationInspectionHandoffResult;
export function createReviewOnlyHandoffReadinessArtifactForReview(input?: {
  reviewedAt?: string;
  handoffStates?: unknown[];
}): ReviewOnlyHandoffReadinessArtifactResult;
export function createReviewOnlyReadinessInspectionCheckpointForReview(input?: {
  reviewedAt?: string;
  readinessArtifacts?: unknown[];
}): ReviewOnlyReadinessInspectionCheckpointResult;
export function createReviewOnlyReadinessHandoffDispositionBoundaryForReview(input?: {
  reviewedAt?: string;
  readinessInspectionCheckpoints?: unknown[];
}): ReviewOnlyReadinessHandoffDispositionBoundaryResult;
export function createReviewOnlyHandoffDispositionInspectionCheckpointForReview(input?: {
  reviewedAt?: string;
  readinessHandoffDispositions?: unknown[];
}): ReviewOnlyHandoffDispositionInspectionCheckpointResult;
export function createReviewOnlyInspectionHandoffMetadataBoundaryForReview(input?: {
  reviewedAt?: string;
  handoffDispositionInspectionCheckpoints?: unknown[];
}): ReviewOnlyInspectionHandoffMetadataBoundaryResult;
export function createReviewOnlyInspectionHandoffCheckpointForReview(input?: {
  reviewedAt?: string;
  inspectionHandoffMetadataEntries?: unknown[];
}): ReviewOnlyInspectionHandoffCheckpointResult;
export function createReviewOnlyCheckpointHandoffLayerForReview(input?: {
  reviewedAt?: string;
  inspectionHandoffCheckpointEntries?: unknown[];
}): ReviewOnlyCheckpointHandoffLayerResult;
export function createReviewOnlyMetadataHandoffCheckpointForReview(input?: {
  reviewedAt?: string;
  checkpointHandoffLayerEntries?: unknown[];
}): ReviewOnlyMetadataHandoffCheckpointResult;
export function createReviewOnlyHandoffMetadataConsolidationLayerForReview(input?: {
  reviewedAt?: string;
  metadataHandoffCheckpointEntries?: unknown[];
}): ReviewOnlyHandoffMetadataConsolidationLayerResult;
export function createReviewOnlyConsolidationCheckpointHandoffForReview(input?: {
  reviewedAt?: string;
  sourceHandoffMetadataConsolidationLayerDigest?: string;
  handoffMetadataConsolidationLayerEntries?: unknown[];
}): ReviewOnlyConsolidationCheckpointHandoffResult;
export function createReviewOnlyConsolidationMetadataCheckpointForReview(input?: {
  reviewedAt?: string;
  sourceConsolidationCheckpointHandoffDigest?: string;
  consolidationCheckpointHandoffEntries?: unknown[];
}): ReviewOnlyConsolidationMetadataCheckpointResult;
export function createTargetConsumerPlanningMetadataForReview(input?: {
  reviewedAt?: string;
  sourceConsolidationMetadataCheckpointDigest?: string;
  consolidationMetadataCheckpointEntries?: unknown[];
}): TargetConsumerPlanningMetadataResult;
export function createConsumerContractReadinessMatrixForReview(input?: {
  reviewedAt?: string;
  sourceTargetConsumerPlanningMetadataDigest?: string;
  targetConsumerPlanningMetadataEntries?: unknown[];
}): ConsumerContractReadinessMatrixResult;
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
