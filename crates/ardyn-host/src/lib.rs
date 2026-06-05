//! ARDYN host scaffold.
//!
//! Phase 3 models the native host side of the static identity and handshake.
//! It intentionally does not implement Rust task planning, autonomous execution,
//! tool execution, network listeners, API calls, or long-running services.

use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::collections::BTreeMap;
use std::error::Error;
use std::fs;
use std::io::{Error as IoError, ErrorKind};

pub const HOST_CRATE_NAME: &str = "ardyn-host";
pub const ARDYN_SCHEMA_VERSION: &str = "0.1.0";
pub const ARDYN_PHASE: &str = "phase-3-task-planning";
pub const ARDYN_STDIO_TRANSPORT_POLICY_PHASE: &str =
    "phase-4.0d-rust-host-transport-policy-contracts";
pub const ARDYN_STDIO_TRANSPORT_POLICY_METADATA_SCHEMA: &str =
    "ardyn.stdio-transport-policy-metadata";
pub const ARDYN_STDIO_TRANSPORT_POLICY_METADATA_VERSION: &str = "0.1.0";
pub const ARDYN_STDIO_TRANSPORT_POLICY_METADATA_PHASE: &str =
    "phase-4.0e-rust-host-policy-metadata";
pub const ARDYN_HOST_POLICY_REVIEW_RECORD_SCHEMA: &str = "ardyn.host-policy-review-record";
pub const ARDYN_HOST_POLICY_REVIEW_RECORD_VERSION: &str = "0.1.0";
pub const ARDYN_HOST_POLICY_REVIEW_RECORD_PHASE: &str = "phase-4.0f-host-policy-review-records";
pub const ARDYN_HOST_POLICY_APPROVAL_RECORD_SCHEMA: &str = "ardyn.host-policy-approval-record";
pub const ARDYN_HOST_POLICY_APPROVAL_RECORD_VERSION: &str = "0.1.0";
pub const ARDYN_HOST_POLICY_APPROVAL_RECORD_PHASE: &str = "phase-4.1a-host-policy-approval-records";
pub const ARDYN_HOST_POLICY_APPROVAL_RECORD_KIND: &str = "host-policy-approval-record";
pub const ARDYN_TRANSPORT_HARNESS_CONTRACT_SCHEMA: &str = "ardyn.transport-harness-contract";
pub const ARDYN_TRANSPORT_HARNESS_CONTRACT_VERSION: &str = "0.1.0";
pub const ARDYN_TRANSPORT_HARNESS_CONTRACT_PHASE: &str = "phase-4.1b-transport-harness-contracts";
pub const ARDYN_TRANSPORT_HARNESS_CONTRACT_KIND: &str = "transport-harness-contract";
pub const ARDYN_POLICY_METADATA_DIGEST_ALGORITHM: &str = "sha256";
const ARDYN_REVIEWED_POLICY_METADATA_PHASE_LABEL: &str = "4.0E";
const ARDYN_HOST_POLICY_APPROVAL_REVIEWED_PHASE_LABEL: &str = "4.1A";
const ARDYN_HOST_POLICY_APPROVAL_TARGET_KIND: &str = "future-runtime-surface";
const ARDYN_HOST_POLICY_APPROVAL_TARGET_PHASE: &str =
    "future-separately-approved-runtime-implementation";
const ARDYN_HOST_POLICY_APPROVAL_RUNTIME_CAPABILITY: &str = "live-stdio-runtime";
const ARDYN_TRANSPORT_HARNESS_REVIEWED_PHASE_LABEL: &str = "4.1B";
const ARDYN_TRANSPORT_HARNESS_KIND: &str = "rust-host-stdio-transport-harness-static-contract";
const ARDYN_TRANSPORT_HARNESS_VERSION: &str = "0.1.0";

pub type HostResult<T> = Result<T, Box<dyn Error + Send + Sync>>;

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum PolicyImplementationStatus {
    PolicyOnlyPreRuntime,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum StdioPolicyOwner {
    RustHost,
    TypescriptDryRunCli,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum StdioStreamPurpose {
    ValidatedSessionEventJsonlOnly,
    RedactedDiagnosticsOnly,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum StdioLineEnding {
    LfOnly,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum StdioCommitUnit {
    CompleteLfTerminatedEventLine,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum StdioTransportFailureAction {
    RejectTranscript,
    RejectAndTerminateTransport,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum StdioLineFailureKind {
    DroppedLine,
    DuplicateLine,
    OutOfOrderLine,
    MalformedLine,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum StderrDiagnosticClass {
    UsageError,
    UnknownDuplicateOrMissingArgument,
    LocalPathPolicyLabel,
    UnreadableLocalFile,
    JsonParseSummary,
    SchemaValidationSummary,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum RedactionSubject {
    Secret,
    ProductionSigningKey,
    TokenOrCredential,
    LocalAbsolutePath,
    EnvironmentVariable,
    StackTrace,
    RawJsonParseExcerpt,
    SchemaValidationValue,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum TranscriptReplayInputPreference {
    NormalizedSessionTranscriptJson,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum RawJsonlCaptureRole {
    ForensicSourceOnly,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum PolicyMetadataExportStatus {
    ReviewExportOnly,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum PolicyRuntimeStatus {
    PreRuntimePolicyOnly,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum PolicyJsonSerializationFormat {
    PrettyJsonLfTerminated,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum HostPolicyReviewStatus {
    ReviewPending,
    ReviewApproved,
    ReviewRejected,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum HostPolicyReviewCompatibility {
    Compatible,
    UpgradeAvailable,
    UnsupportedMajor,
    Malformed,
    RejectedPolicy,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum HostPolicyApprovalStatus {
    ReviewPending,
    ReviewApproved,
    ReviewDenied,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum HostPolicyApprovalRecordClassification {
    ValidReviewRecord,
    MissingOperatorConsent,
    ExpiredOrNotYetValid,
    UnsupportedVersion,
    Malformed,
    Denied,
    RuntimeNotAvailable,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum TransportHarnessRuntimeAvailabilityStatus {
    RuntimeUnavailable,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum TransportHarnessContractClassification {
    StaticContractOnly,
    ApprovalMissing,
    PolicyMetadataMissing,
    RedactionPolicyMissing,
    TranscriptPolicyMissing,
    UnsupportedVersion,
    Malformed,
    RuntimeUnavailable,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct StdioStreamOwnershipPolicy {
    pub current_owner: StdioPolicyOwner,
    pub future_runtime_owner: StdioPolicyOwner,
    pub reserved_for: StdioStreamPurpose,
    pub runtime_implementation_active: bool,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct StdioJsonlFramingPolicy {
    pub utf8_only: bool,
    pub line_ending: StdioLineEnding,
    pub crlf_allowed: bool,
    pub blank_lines_allowed: bool,
    pub final_lf_required_for_complete_streams: bool,
    pub one_json_object_per_line: bool,
    pub validates_session_event_schema: bool,
    pub contiguous_sequences_required: bool,
    pub duplicate_event_ids_allowed: bool,
    pub partial_frames_are_events: bool,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct StderrDiagnosticPolicy {
    pub diagnostics_only: bool,
    pub session_events_allowed_on_stderr: bool,
    pub one_diagnostic_record_per_line_before_runtime: bool,
    pub deterministic_severity_required_before_runtime: bool,
    pub deterministic_code_required_before_runtime: bool,
    pub stdout_diagnostics_allowed: bool,
    pub current_dry_run_diagnostics_are_plain_text: bool,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct StderrRedactionPolicy {
    pub enforcement_active: bool,
    pub required_before_live_runtime: bool,
    pub safe_diagnostics_today: Vec<StderrDiagnosticClass>,
    pub must_redact_before_runtime: Vec<RedactionSubject>,
    pub stack_traces_allowed: bool,
    pub environment_dumps_allowed: bool,
    pub secrets_allowed: bool,
    pub production_signing_keys_allowed: bool,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct BackpressurePolicy {
    pub implementation_active: bool,
    pub must_respect_os_pipe_backpressure: bool,
    pub bounded_queue_required_before_runtime: bool,
    pub silent_event_drop_allowed: bool,
    pub autonomous_retry_loop_allowed: bool,
    pub failure_action: StdioTransportFailureAction,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct PartialWritePolicy {
    pub implementation_active: bool,
    pub smallest_commit_unit: StdioCommitUnit,
    pub partial_frames_are_transcript_evidence: bool,
    pub recovery_action: StdioTransportFailureAction,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct LineIntegrityFailureRule {
    pub kind: StdioLineFailureKind,
    pub recovery_defined: bool,
    pub action: StdioTransportFailureAction,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct LineIntegrityPolicy {
    pub dropped_line: LineIntegrityFailureRule,
    pub duplicate_line: LineIntegrityFailureRule,
    pub out_of_order_line: LineIntegrityFailureRule,
    pub malformed_line: LineIntegrityFailureRule,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct ExitSemanticsPolicy {
    pub success_requires_complete_terminal_state: bool,
    pub success_requires_all_committed_frames_written: bool,
    pub nonzero_on_transport_failure: bool,
    pub nonzero_stdout_partial_final_line_allowed: bool,
    pub partial_event_committed_on_failure: bool,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct TranscriptReplayReadinessPolicy {
    pub implementation_status: PolicyImplementationStatus,
    pub preferred_input: TranscriptReplayInputPreference,
    pub raw_jsonl_capture_role: RawJsonlCaptureRole,
    pub compatible_with_existing_transcript_validation: bool,
    pub transcript_persistence_implemented: bool,
    pub replay_runtime_implemented: bool,
    pub future_cli_proposal_only: Vec<String>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct RuntimeSafetyPolicyFlags {
    pub live_stdio_runtime: bool,
    pub stdin_command_loop: bool,
    pub live_stdio_reader: bool,
    pub listener: bool,
    pub server: bool,
    pub subprocess_spawning: bool,
    pub adapter_calls: bool,
    pub locus_runtime_dependency: bool,
    pub mcp_calls: bool,
    pub openclaw_calls: bool,
    pub plugin_execution: bool,
    pub content_fabric_runtime_behavior: bool,
    pub autonomous_loop: bool,
    pub secret_handling: bool,
    pub production_signing_keys: bool,
    pub transcript_persistence_replay_runtime: bool,
    pub websocket_http_control_surface: bool,
    pub runtime_execution_behavior: bool,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct DeterministicPolicyJsonSerialization {
    pub format: PolicyJsonSerializationFormat,
    pub serializer: String,
    pub final_lf_required: bool,
    pub crlf_allowed: bool,
    pub top_level_field_order: Vec<String>,
}

impl RuntimeSafetyPolicyFlags {
    pub fn all_runtime_flags_disabled(&self) -> bool {
        !self.live_stdio_runtime
            && !self.stdin_command_loop
            && !self.live_stdio_reader
            && !self.listener
            && !self.server
            && !self.subprocess_spawning
            && !self.adapter_calls
            && !self.locus_runtime_dependency
            && !self.mcp_calls
            && !self.openclaw_calls
            && !self.plugin_execution
            && !self.content_fabric_runtime_behavior
            && !self.autonomous_loop
            && !self.secret_handling
            && !self.production_signing_keys
            && !self.transcript_persistence_replay_runtime
            && !self.websocket_http_control_surface
            && !self.runtime_execution_behavior
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct StdioTransportPolicyContract {
    pub schema_version: String,
    pub phase: String,
    pub implementation_status: PolicyImplementationStatus,
    pub runtime_implementation_active: bool,
    pub stdout: StdioStreamOwnershipPolicy,
    pub stderr: StdioStreamOwnershipPolicy,
    pub jsonl_framing: StdioJsonlFramingPolicy,
    pub stderr_diagnostics: StderrDiagnosticPolicy,
    pub redaction: StderrRedactionPolicy,
    pub backpressure: BackpressurePolicy,
    pub partial_write: PartialWritePolicy,
    pub line_integrity: LineIntegrityPolicy,
    pub exit_semantics: ExitSemanticsPolicy,
    pub transcript_replay: TranscriptReplayReadinessPolicy,
    pub safety: RuntimeSafetyPolicyFlags,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct HostPolicyReviewRecordMapping {
    pub record_schema: String,
    pub record_schema_version: String,
    pub policy_digest_algorithm: String,
    pub reviewed_phase: String,
    pub runtime_status: PolicyRuntimeStatus,
    pub approval_fields_review_metadata_only: bool,
    pub approval_runtime_effect_allowed: bool,
    pub rejection_runtime_effect_allowed: bool,
    pub non_execution_invariants: Vec<String>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct StdioTransportPolicyMetadata {
    pub schema: String,
    pub schema_version: String,
    pub metadata_phase: String,
    pub contract_phase: String,
    pub export_status: PolicyMetadataExportStatus,
    pub runtime_status: PolicyRuntimeStatus,
    pub review_only: bool,
    pub serialization: DeterministicPolicyJsonSerialization,
    pub policy: StdioTransportPolicyContract,
    pub future_host_policy_review_record: HostPolicyReviewRecordMapping,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct HostPolicyReviewDecisionMetadata {
    pub status: HostPolicyReviewStatus,
    pub approval_recorded: bool,
    pub rejection_recorded: bool,
    pub review_metadata_only: bool,
    pub approval_runtime_effect_allowed: bool,
    pub rejection_runtime_effect_allowed: bool,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct HostPolicyReviewDiagnostics {
    pub warnings: Vec<String>,
    pub errors: Vec<String>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct HostPolicyReviewRecord {
    pub schema: String,
    pub schema_version: String,
    pub record_phase: String,
    pub reviewed_phase: String,
    pub policy_metadata_schema: String,
    pub policy_metadata_version: String,
    pub policy_metadata_digest_algorithm: String,
    pub policy_metadata_digest_hex: String,
    pub policy_contract_version: String,
    pub runtime_status: PolicyRuntimeStatus,
    pub non_execution_invariants: Vec<String>,
    pub compatibility: HostPolicyReviewCompatibility,
    pub decision: HostPolicyReviewDecisionMetadata,
    pub diagnostics: HostPolicyReviewDiagnostics,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct HostPolicyApprovalTarget {
    pub target_kind: String,
    pub target_phase: String,
    pub target_commands: Vec<String>,
    pub requires_separate_implementation_phase: bool,
    pub devin_review_required_before_enablement: bool,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct HostPolicyOperatorConsent {
    pub consent_recorded: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub operator_id: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub consent_version: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub consented_at: Option<String>,
    pub consent_scope: Vec<String>,
    pub process_stdio_ownership_consent: bool,
    pub stdin_lifecycle_control_consent: bool,
    pub stdout_jsonl_ownership_consent: bool,
    pub stderr_diagnostics_ownership_consent: bool,
    pub process_termination_control_consent: bool,
    pub transcript_persistence_review_consent: bool,
    pub failure_audit_record_emission_consent: bool,
    pub understands_necessary_but_not_sufficient: bool,
    pub understands_no_runtime_enabled_in_this_phase: bool,
    pub understands_separate_implementation_required: bool,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct HostPolicyRuntimeCapabilityRequest {
    pub capability: String,
    pub reason: String,
    pub runtime_implementation_available: bool,
    pub serve_runtime_available: bool,
    pub stdio_runtime_available: bool,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct HostPolicyApprovalValidity {
    pub not_before: String,
    pub expires_at: String,
    pub evaluated_at: String,
    pub valid_at_evaluation: bool,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct HostPolicyApprovalRuntimeEffect {
    pub current_record_enables_runtime: bool,
    pub runtime_approval_effect_allowed: bool,
    pub runtime_implementation_available: bool,
    pub runtime_command_available: bool,
    pub requires_separate_runtime_implementation_approval: bool,
    pub operator_consent_necessary_but_not_sufficient: bool,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct HostPolicyApprovalNonExecutionInvariantSummary {
    pub summary: String,
    pub invariants: Vec<String>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct HostPolicyApprovalDenial {
    pub fail_closed_reasons: Vec<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub denial_reason: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct HostPolicyApprovalAuditMetadata {
    pub created_at: String,
    pub created_by: String,
    pub source_phase: String,
    pub reviewer: String,
    pub devin_review_required_now: bool,
    pub preserve_devin_review_for: String,
    pub metadata_only: bool,
    pub writes_files: bool,
    pub runs_runtime: bool,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct HostPolicyApprovalRecord {
    pub schema: String,
    pub schema_version: String,
    pub record_kind: String,
    pub record_phase: String,
    pub reviewed_phase: String,
    pub approval_target: HostPolicyApprovalTarget,
    pub operator_consent: HostPolicyOperatorConsent,
    pub runtime_capability_request: HostPolicyRuntimeCapabilityRequest,
    pub approval_status: HostPolicyApprovalStatus,
    pub validity: HostPolicyApprovalValidity,
    pub runtime_effect: HostPolicyApprovalRuntimeEffect,
    pub current_record_runtime_statement: String,
    pub non_execution_invariant_summary: HostPolicyApprovalNonExecutionInvariantSummary,
    pub classification: HostPolicyApprovalRecordClassification,
    pub denial: HostPolicyApprovalDenial,
    pub audit: HostPolicyApprovalAuditMetadata,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct TransportHarnessModeMetadata {
    pub name: String,
    pub direction: String,
    pub metadata_only: bool,
    pub runtime_implemented: bool,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct TransportHarnessRuntimeAvailability {
    pub status: TransportHarnessRuntimeAvailabilityStatus,
    pub runtime_available: bool,
    pub serve_runtime_available: bool,
    pub stdio_runtime_available: bool,
    pub process_stdio_ownership_available: bool,
    pub stdin_reader_available: bool,
    pub stdin_command_loop_available: bool,
    pub listener_available: bool,
    pub subprocess_spawning_available: bool,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct TransportHarnessApprovalRecordReference {
    pub required: bool,
    pub present: bool,
    pub schema: String,
    pub schema_version: String,
    pub record_phase: String,
    pub classification: HostPolicyApprovalRecordClassification,
    pub runtime_capability: String,
    pub operator_consent_required: bool,
    pub approval_record_grants_runtime: bool,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct TransportHarnessPolicyMetadataReference {
    pub required: bool,
    pub present: bool,
    pub schema: String,
    pub schema_version: String,
    pub metadata_phase: String,
    pub contract_phase: String,
    pub runtime_status: PolicyRuntimeStatus,
    pub review_only: bool,
    pub digest_algorithm: String,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct TransportHarnessStderrRedactionPolicyReference {
    pub required: bool,
    pub present: bool,
    pub source_schema: String,
    pub source_schema_version: String,
    pub source_field: String,
    pub enforcement_active: bool,
    pub required_before_live_runtime: bool,
    pub stack_traces_allowed: bool,
    pub environment_dumps_allowed: bool,
    pub secrets_allowed: bool,
    pub production_signing_keys_allowed: bool,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct TransportHarnessTranscriptAuditOutputPolicyReference {
    pub required: bool,
    pub present: bool,
    pub transcript_schema: String,
    pub session_event_schema: String,
    pub normalized_transcript_required: bool,
    pub failure_audit_record_required_before_runtime: bool,
    pub transcript_persistence_runtime_implemented: bool,
    pub replay_runtime_implemented: bool,
    pub writes_files_in_this_phase: bool,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct TransportHarnessRuntimeEffect {
    pub current_contract_enables_runtime: bool,
    pub runtime_implementation_available: bool,
    pub runtime_command_available: bool,
    pub process_stdio_ownership_available: bool,
    pub stdin_reader_available: bool,
    pub stdout_writer_available: bool,
    pub stderr_writer_available: bool,
    pub approval_record_necessary_but_not_sufficient: bool,
    pub requires_separate_runtime_implementation_approval: bool,
    pub requires_devin_review_before_enablement: bool,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct TransportHarnessNonExecutionInvariantSummary {
    pub summary: String,
    pub invariants: Vec<String>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct TransportHarnessAuditMetadata {
    pub created_at: String,
    pub created_by: String,
    pub source_phase: String,
    pub reviewer: String,
    pub devin_review_required_now: bool,
    pub preserve_devin_review_for: String,
    pub metadata_only: bool,
    pub writes_files: bool,
    pub runs_runtime: bool,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct TransportHarnessContract {
    pub schema: String,
    pub schema_version: String,
    pub contract_kind: String,
    pub contract_phase: String,
    pub reviewed_phase: String,
    pub harness_kind: String,
    pub harness_version: String,
    pub supported_transport_modes: Vec<TransportHarnessModeMetadata>,
    pub runtime_availability: TransportHarnessRuntimeAvailability,
    pub approval_record_reference: TransportHarnessApprovalRecordReference,
    pub policy_metadata_reference: TransportHarnessPolicyMetadataReference,
    pub stderr_redaction_policy_reference: TransportHarnessStderrRedactionPolicyReference,
    pub transcript_audit_output_policy_reference:
        TransportHarnessTranscriptAuditOutputPolicyReference,
    pub fail_closed_startup_preconditions: Vec<String>,
    pub runtime_effect: TransportHarnessRuntimeEffect,
    pub non_execution_invariant_summary: TransportHarnessNonExecutionInvariantSummary,
    pub classification: TransportHarnessContractClassification,
    pub unsupported_runtime_reasons: Vec<String>,
    pub rejected_runtime_reasons: Vec<String>,
    pub audit: TransportHarnessAuditMetadata,
}

impl StdioTransportPolicyContract {
    pub fn is_pre_runtime_fail_closed(&self) -> bool {
        self.implementation_status == PolicyImplementationStatus::PolicyOnlyPreRuntime
            && !self.runtime_implementation_active
            && self.stdout.current_owner == StdioPolicyOwner::TypescriptDryRunCli
            && self.stdout.future_runtime_owner == StdioPolicyOwner::RustHost
            && self.stdout.reserved_for == StdioStreamPurpose::ValidatedSessionEventJsonlOnly
            && !self.stdout.runtime_implementation_active
            && self.stderr.current_owner == StdioPolicyOwner::TypescriptDryRunCli
            && self.stderr.future_runtime_owner == StdioPolicyOwner::RustHost
            && self.stderr.reserved_for == StdioStreamPurpose::RedactedDiagnosticsOnly
            && !self.stderr.runtime_implementation_active
            && self.jsonl_framing.utf8_only
            && self.jsonl_framing.line_ending == StdioLineEnding::LfOnly
            && !self.jsonl_framing.crlf_allowed
            && !self.jsonl_framing.blank_lines_allowed
            && self.jsonl_framing.final_lf_required_for_complete_streams
            && self.jsonl_framing.one_json_object_per_line
            && self.jsonl_framing.validates_session_event_schema
            && self.jsonl_framing.contiguous_sequences_required
            && !self.jsonl_framing.duplicate_event_ids_allowed
            && !self.jsonl_framing.partial_frames_are_events
            && self.stderr_diagnostics.diagnostics_only
            && !self.stderr_diagnostics.session_events_allowed_on_stderr
            && !self.stderr_diagnostics.stdout_diagnostics_allowed
            && !self.redaction.enforcement_active
            && self.redaction.required_before_live_runtime
            && !self.redaction.stack_traces_allowed
            && !self.redaction.environment_dumps_allowed
            && !self.redaction.secrets_allowed
            && !self.redaction.production_signing_keys_allowed
            && !self.backpressure.implementation_active
            && self.backpressure.must_respect_os_pipe_backpressure
            && self.backpressure.bounded_queue_required_before_runtime
            && !self.backpressure.silent_event_drop_allowed
            && !self.backpressure.autonomous_retry_loop_allowed
            && self.backpressure.failure_action
                == StdioTransportFailureAction::RejectAndTerminateTransport
            && !self.partial_write.implementation_active
            && self.partial_write.smallest_commit_unit
                == StdioCommitUnit::CompleteLfTerminatedEventLine
            && !self.partial_write.partial_frames_are_transcript_evidence
            && self.partial_write.recovery_action
                == StdioTransportFailureAction::RejectAndTerminateTransport
            && [
                &self.line_integrity.dropped_line,
                &self.line_integrity.duplicate_line,
                &self.line_integrity.out_of_order_line,
                &self.line_integrity.malformed_line,
            ]
            .iter()
            .all(|rule| {
                !rule.recovery_defined
                    && rule.action == StdioTransportFailureAction::RejectTranscript
            })
            && self.exit_semantics.success_requires_complete_terminal_state
            && self
                .exit_semantics
                .success_requires_all_committed_frames_written
            && self.exit_semantics.nonzero_on_transport_failure
            && !self
                .exit_semantics
                .nonzero_stdout_partial_final_line_allowed
            && !self.exit_semantics.partial_event_committed_on_failure
            && self.transcript_replay.implementation_status
                == PolicyImplementationStatus::PolicyOnlyPreRuntime
            && self.transcript_replay.preferred_input
                == TranscriptReplayInputPreference::NormalizedSessionTranscriptJson
            && self.transcript_replay.raw_jsonl_capture_role
                == RawJsonlCaptureRole::ForensicSourceOnly
            && self
                .transcript_replay
                .compatible_with_existing_transcript_validation
            && !self.transcript_replay.transcript_persistence_implemented
            && !self.transcript_replay.replay_runtime_implemented
            && self.safety.all_runtime_flags_disabled()
    }
}

fn line_failure_rule(kind: StdioLineFailureKind) -> LineIntegrityFailureRule {
    LineIntegrityFailureRule {
        kind,
        recovery_defined: false,
        action: StdioTransportFailureAction::RejectTranscript,
    }
}

fn safe_stderr_diagnostics_today() -> Vec<StderrDiagnosticClass> {
    vec![
        StderrDiagnosticClass::UsageError,
        StderrDiagnosticClass::UnknownDuplicateOrMissingArgument,
        StderrDiagnosticClass::LocalPathPolicyLabel,
        StderrDiagnosticClass::UnreadableLocalFile,
        StderrDiagnosticClass::JsonParseSummary,
        StderrDiagnosticClass::SchemaValidationSummary,
    ]
}

fn required_redaction_subjects_before_runtime() -> Vec<RedactionSubject> {
    vec![
        RedactionSubject::Secret,
        RedactionSubject::ProductionSigningKey,
        RedactionSubject::TokenOrCredential,
        RedactionSubject::LocalAbsolutePath,
        RedactionSubject::EnvironmentVariable,
        RedactionSubject::StackTrace,
        RedactionSubject::RawJsonParseExcerpt,
        RedactionSubject::SchemaValidationValue,
    ]
}

fn transcript_replay_cli_proposals() -> Vec<String> {
    vec![
        "ardyn replay-session-transcript --file <session-transcript.json> --summary".to_string(),
        "ardyn replay-session-transcript --file <session-transcript.json> --explain".to_string(),
    ]
}

pub fn stdio_transport_policy_contract() -> StdioTransportPolicyContract {
    StdioTransportPolicyContract {
        schema_version: ARDYN_SCHEMA_VERSION.to_string(),
        phase: ARDYN_STDIO_TRANSPORT_POLICY_PHASE.to_string(),
        implementation_status: PolicyImplementationStatus::PolicyOnlyPreRuntime,
        runtime_implementation_active: false,
        stdout: StdioStreamOwnershipPolicy {
            current_owner: StdioPolicyOwner::TypescriptDryRunCli,
            future_runtime_owner: StdioPolicyOwner::RustHost,
            reserved_for: StdioStreamPurpose::ValidatedSessionEventJsonlOnly,
            runtime_implementation_active: false,
        },
        stderr: StdioStreamOwnershipPolicy {
            current_owner: StdioPolicyOwner::TypescriptDryRunCli,
            future_runtime_owner: StdioPolicyOwner::RustHost,
            reserved_for: StdioStreamPurpose::RedactedDiagnosticsOnly,
            runtime_implementation_active: false,
        },
        jsonl_framing: StdioJsonlFramingPolicy {
            utf8_only: true,
            line_ending: StdioLineEnding::LfOnly,
            crlf_allowed: false,
            blank_lines_allowed: false,
            final_lf_required_for_complete_streams: true,
            one_json_object_per_line: true,
            validates_session_event_schema: true,
            contiguous_sequences_required: true,
            duplicate_event_ids_allowed: false,
            partial_frames_are_events: false,
        },
        stderr_diagnostics: StderrDiagnosticPolicy {
            diagnostics_only: true,
            session_events_allowed_on_stderr: false,
            one_diagnostic_record_per_line_before_runtime: true,
            deterministic_severity_required_before_runtime: true,
            deterministic_code_required_before_runtime: true,
            stdout_diagnostics_allowed: false,
            current_dry_run_diagnostics_are_plain_text: true,
        },
        redaction: StderrRedactionPolicy {
            enforcement_active: false,
            required_before_live_runtime: true,
            safe_diagnostics_today: safe_stderr_diagnostics_today(),
            must_redact_before_runtime: required_redaction_subjects_before_runtime(),
            stack_traces_allowed: false,
            environment_dumps_allowed: false,
            secrets_allowed: false,
            production_signing_keys_allowed: false,
        },
        backpressure: BackpressurePolicy {
            implementation_active: false,
            must_respect_os_pipe_backpressure: true,
            bounded_queue_required_before_runtime: true,
            silent_event_drop_allowed: false,
            autonomous_retry_loop_allowed: false,
            failure_action: StdioTransportFailureAction::RejectAndTerminateTransport,
        },
        partial_write: PartialWritePolicy {
            implementation_active: false,
            smallest_commit_unit: StdioCommitUnit::CompleteLfTerminatedEventLine,
            partial_frames_are_transcript_evidence: false,
            recovery_action: StdioTransportFailureAction::RejectAndTerminateTransport,
        },
        line_integrity: LineIntegrityPolicy {
            dropped_line: line_failure_rule(StdioLineFailureKind::DroppedLine),
            duplicate_line: line_failure_rule(StdioLineFailureKind::DuplicateLine),
            out_of_order_line: line_failure_rule(StdioLineFailureKind::OutOfOrderLine),
            malformed_line: line_failure_rule(StdioLineFailureKind::MalformedLine),
        },
        exit_semantics: ExitSemanticsPolicy {
            success_requires_complete_terminal_state: true,
            success_requires_all_committed_frames_written: true,
            nonzero_on_transport_failure: true,
            nonzero_stdout_partial_final_line_allowed: false,
            partial_event_committed_on_failure: false,
        },
        transcript_replay: TranscriptReplayReadinessPolicy {
            implementation_status: PolicyImplementationStatus::PolicyOnlyPreRuntime,
            preferred_input: TranscriptReplayInputPreference::NormalizedSessionTranscriptJson,
            raw_jsonl_capture_role: RawJsonlCaptureRole::ForensicSourceOnly,
            compatible_with_existing_transcript_validation: true,
            transcript_persistence_implemented: false,
            replay_runtime_implemented: false,
            future_cli_proposal_only: transcript_replay_cli_proposals(),
        },
        safety: RuntimeSafetyPolicyFlags {
            live_stdio_runtime: false,
            stdin_command_loop: false,
            live_stdio_reader: false,
            listener: false,
            server: false,
            subprocess_spawning: false,
            adapter_calls: false,
            locus_runtime_dependency: false,
            mcp_calls: false,
            openclaw_calls: false,
            plugin_execution: false,
            content_fabric_runtime_behavior: false,
            autonomous_loop: false,
            secret_handling: false,
            production_signing_keys: false,
            transcript_persistence_replay_runtime: false,
            websocket_http_control_surface: false,
            runtime_execution_behavior: false,
        },
    }
}

fn stdio_transport_policy_metadata_top_level_order() -> Vec<String> {
    [
        "schema",
        "schemaVersion",
        "metadataPhase",
        "contractPhase",
        "exportStatus",
        "runtimeStatus",
        "reviewOnly",
        "serialization",
        "policy",
        "futureHostPolicyReviewRecord",
    ]
    .iter()
    .map(|field| (*field).to_string())
    .collect()
}

fn policy_non_execution_invariants() -> Vec<String> {
    [
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
        "no-runtime-execution-behavior",
    ]
    .iter()
    .map(|invariant| (*invariant).to_string())
    .collect()
}

pub fn host_policy_review_record_top_level_order() -> Vec<String> {
    [
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
        "diagnostics",
    ]
    .iter()
    .map(|field| (*field).to_string())
    .collect()
}

fn host_policy_review_record_warnings() -> Vec<String> {
    [
        "review-record-is-static-review-metadata-only",
        "review-record-does-not-grant-runtime-approval",
        "future-live-runtime-remains-blocked-until-separate-approved-phase",
    ]
    .iter()
    .map(|warning| (*warning).to_string())
    .collect()
}

fn semver_parts(version: &str) -> Option<(u64, u64, u64)> {
    let mut parts = version.split('.');
    let major = parts.next()?.parse().ok()?;
    let minor = parts.next()?.parse().ok()?;
    let patch = parts.next()?.parse().ok()?;

    if parts.next().is_some() {
        return None;
    }

    Some((major, minor, patch))
}

fn is_unsupported_major(version: &str, current: &str) -> bool {
    match (semver_parts(version), semver_parts(current)) {
        (Some((major, _, _)), Some((current_major, _, _))) => major > current_major,
        _ => false,
    }
}

fn is_same_major_non_current(version: &str, current: &str) -> bool {
    match (semver_parts(version), semver_parts(current)) {
        (Some((major, minor, patch)), Some((current_major, current_minor, current_patch))) => {
            major == current_major && (minor, patch) != (current_minor, current_patch)
        }
        _ => false,
    }
}

fn has_malformed_semver(version: &str) -> bool {
    semver_parts(version).is_none()
}

fn policy_metadata_json_unchecked(metadata: &StdioTransportPolicyMetadata) -> HostResult<String> {
    let json = serde_json::to_string_pretty(metadata)?;

    Ok(format!("{json}\n"))
}

fn policy_metadata_digest_hex_unchecked(
    metadata: &StdioTransportPolicyMetadata,
) -> HostResult<String> {
    let json = policy_metadata_json_unchecked(metadata)?;

    Ok(fabric_sha256_hex(json.as_bytes()))
}

pub fn stdio_transport_policy_metadata() -> StdioTransportPolicyMetadata {
    StdioTransportPolicyMetadata {
        schema: ARDYN_STDIO_TRANSPORT_POLICY_METADATA_SCHEMA.to_string(),
        schema_version: ARDYN_STDIO_TRANSPORT_POLICY_METADATA_VERSION.to_string(),
        metadata_phase: ARDYN_STDIO_TRANSPORT_POLICY_METADATA_PHASE.to_string(),
        contract_phase: ARDYN_STDIO_TRANSPORT_POLICY_PHASE.to_string(),
        export_status: PolicyMetadataExportStatus::ReviewExportOnly,
        runtime_status: PolicyRuntimeStatus::PreRuntimePolicyOnly,
        review_only: true,
        serialization: DeterministicPolicyJsonSerialization {
            format: PolicyJsonSerializationFormat::PrettyJsonLfTerminated,
            serializer: "serde_json::to_string_pretty".to_string(),
            final_lf_required: true,
            crlf_allowed: false,
            top_level_field_order: stdio_transport_policy_metadata_top_level_order(),
        },
        policy: stdio_transport_policy_contract(),
        future_host_policy_review_record: HostPolicyReviewRecordMapping {
            record_schema: ARDYN_HOST_POLICY_REVIEW_RECORD_SCHEMA.to_string(),
            record_schema_version: ARDYN_HOST_POLICY_REVIEW_RECORD_VERSION.to_string(),
            policy_digest_algorithm: ARDYN_POLICY_METADATA_DIGEST_ALGORITHM.to_string(),
            reviewed_phase: ARDYN_REVIEWED_POLICY_METADATA_PHASE_LABEL.to_string(),
            runtime_status: PolicyRuntimeStatus::PreRuntimePolicyOnly,
            approval_fields_review_metadata_only: true,
            approval_runtime_effect_allowed: false,
            rejection_runtime_effect_allowed: false,
            non_execution_invariants: policy_non_execution_invariants(),
        },
    }
}

pub fn validate_stdio_transport_policy_metadata(
    metadata: &StdioTransportPolicyMetadata,
) -> HostResult<()> {
    if metadata.schema != ARDYN_STDIO_TRANSPORT_POLICY_METADATA_SCHEMA {
        return Err(validation_error("policy metadata schema is unsupported"));
    }
    if metadata.schema_version != ARDYN_STDIO_TRANSPORT_POLICY_METADATA_VERSION {
        return Err(validation_error(
            "policy metadata schemaVersion is unsupported",
        ));
    }
    if metadata.metadata_phase != ARDYN_STDIO_TRANSPORT_POLICY_METADATA_PHASE {
        return Err(validation_error("policy metadata phase is unsupported"));
    }
    if metadata.contract_phase != ARDYN_STDIO_TRANSPORT_POLICY_PHASE {
        return Err(validation_error("policy contract phase is unsupported"));
    }
    if metadata.export_status != PolicyMetadataExportStatus::ReviewExportOnly {
        return Err(validation_error(
            "policy metadata must remain review-export-only",
        ));
    }
    if metadata.runtime_status != PolicyRuntimeStatus::PreRuntimePolicyOnly {
        return Err(validation_error(
            "policy metadata must remain pre-runtime-policy-only",
        ));
    }
    if !metadata.review_only {
        return Err(validation_error("policy metadata must be review-only"));
    }
    if metadata.serialization.format != PolicyJsonSerializationFormat::PrettyJsonLfTerminated {
        return Err(validation_error(
            "policy metadata serializer format is unsupported",
        ));
    }
    if metadata.serialization.serializer != "serde_json::to_string_pretty" {
        return Err(validation_error(
            "policy metadata serializer is unsupported",
        ));
    }
    if !metadata.serialization.final_lf_required || metadata.serialization.crlf_allowed {
        return Err(validation_error(
            "policy metadata must be LF-terminated JSON",
        ));
    }
    if metadata.serialization.top_level_field_order
        != stdio_transport_policy_metadata_top_level_order()
    {
        return Err(validation_error(
            "policy metadata top-level field order is unsupported",
        ));
    }
    if metadata.future_host_policy_review_record.record_schema
        != ARDYN_HOST_POLICY_REVIEW_RECORD_SCHEMA
    {
        return Err(validation_error(
            "host-policy review record schema is unsupported",
        ));
    }
    if metadata
        .future_host_policy_review_record
        .record_schema_version
        != ARDYN_HOST_POLICY_REVIEW_RECORD_VERSION
    {
        return Err(validation_error(
            "host-policy review record schemaVersion is unsupported",
        ));
    }
    if metadata
        .future_host_policy_review_record
        .policy_digest_algorithm
        != ARDYN_POLICY_METADATA_DIGEST_ALGORITHM
    {
        return Err(validation_error(
            "host-policy review record digest algorithm is unsupported",
        ));
    }
    if metadata.future_host_policy_review_record.reviewed_phase
        != ARDYN_REVIEWED_POLICY_METADATA_PHASE_LABEL
    {
        return Err(validation_error(
            "host-policy review record reviewed phase is unsupported",
        ));
    }
    if metadata.future_host_policy_review_record.runtime_status
        != PolicyRuntimeStatus::PreRuntimePolicyOnly
    {
        return Err(validation_error(
            "host-policy review record runtime status is unsupported",
        ));
    }
    if !metadata
        .future_host_policy_review_record
        .approval_fields_review_metadata_only
        || metadata
            .future_host_policy_review_record
            .approval_runtime_effect_allowed
        || metadata
            .future_host_policy_review_record
            .rejection_runtime_effect_allowed
    {
        return Err(validation_error(
            "host-policy review fields must remain metadata-only",
        ));
    }
    if metadata
        .future_host_policy_review_record
        .non_execution_invariants
        != policy_non_execution_invariants()
    {
        return Err(validation_error(
            "host-policy review record invariants are unsupported",
        ));
    }
    if metadata.policy.schema_version != ARDYN_SCHEMA_VERSION {
        return Err(validation_error(
            "policy contract schemaVersion is unsupported",
        ));
    }
    if metadata.policy.phase != ARDYN_STDIO_TRANSPORT_POLICY_PHASE {
        return Err(validation_error("policy contract phase is unsupported"));
    }
    if !metadata
        .policy
        .stderr_diagnostics
        .one_diagnostic_record_per_line_before_runtime
        || !metadata
            .policy
            .stderr_diagnostics
            .deterministic_severity_required_before_runtime
        || !metadata
            .policy
            .stderr_diagnostics
            .deterministic_code_required_before_runtime
        || !metadata
            .policy
            .stderr_diagnostics
            .current_dry_run_diagnostics_are_plain_text
    {
        return Err(validation_error(
            "stderr diagnostic determinism must remain pinned",
        ));
    }
    if metadata.policy.redaction.safe_diagnostics_today != safe_stderr_diagnostics_today()
        || metadata.policy.redaction.must_redact_before_runtime
            != required_redaction_subjects_before_runtime()
    {
        return Err(validation_error(
            "policy redaction categories are unsupported",
        ));
    }
    if metadata.policy.line_integrity.dropped_line.kind != StdioLineFailureKind::DroppedLine
        || metadata.policy.line_integrity.duplicate_line.kind != StdioLineFailureKind::DuplicateLine
        || metadata.policy.line_integrity.out_of_order_line.kind
            != StdioLineFailureKind::OutOfOrderLine
        || metadata.policy.line_integrity.malformed_line.kind != StdioLineFailureKind::MalformedLine
    {
        return Err(validation_error(
            "policy line-integrity kind placement is unsupported",
        ));
    }
    if metadata.policy.transcript_replay.future_cli_proposal_only
        != transcript_replay_cli_proposals()
    {
        return Err(validation_error(
            "policy transcript replay proposal metadata is unsupported",
        ));
    }
    if !metadata.policy.is_pre_runtime_fail_closed() {
        return Err(validation_error(
            "policy metadata contains a runtime-permissive policy",
        ));
    }

    Ok(())
}

pub fn serialize_stdio_transport_policy_metadata_json(
    metadata: &StdioTransportPolicyMetadata,
) -> HostResult<String> {
    validate_stdio_transport_policy_metadata(metadata)?;
    let json = serde_json::to_string_pretty(metadata)?;

    Ok(format!("{json}\n"))
}

pub fn stdio_transport_policy_metadata_json() -> HostResult<String> {
    serialize_stdio_transport_policy_metadata_json(&stdio_transport_policy_metadata())
}

pub fn parse_stdio_transport_policy_metadata_json(
    input: &str,
) -> HostResult<StdioTransportPolicyMetadata> {
    if input.contains('\r') {
        return Err(validation_error("policy metadata must be LF-only JSON"));
    }

    let metadata: StdioTransportPolicyMetadata = serde_json::from_str(input)?;
    validate_stdio_transport_policy_metadata(&metadata)?;
    Ok(metadata)
}

pub fn stdio_transport_policy_metadata_digest_hex(
    metadata: &StdioTransportPolicyMetadata,
) -> HostResult<String> {
    let json = serialize_stdio_transport_policy_metadata_json(metadata)?;

    Ok(fabric_sha256_hex(json.as_bytes()))
}

pub fn host_policy_review_record_for_stdio_transport_policy_metadata(
    metadata: &StdioTransportPolicyMetadata,
) -> HostResult<HostPolicyReviewRecord> {
    validate_stdio_transport_policy_metadata(metadata)?;

    Ok(HostPolicyReviewRecord {
        schema: ARDYN_HOST_POLICY_REVIEW_RECORD_SCHEMA.to_string(),
        schema_version: ARDYN_HOST_POLICY_REVIEW_RECORD_VERSION.to_string(),
        record_phase: ARDYN_HOST_POLICY_REVIEW_RECORD_PHASE.to_string(),
        reviewed_phase: metadata
            .future_host_policy_review_record
            .reviewed_phase
            .clone(),
        policy_metadata_schema: metadata.schema.clone(),
        policy_metadata_version: metadata.schema_version.clone(),
        policy_metadata_digest_algorithm: metadata
            .future_host_policy_review_record
            .policy_digest_algorithm
            .clone(),
        policy_metadata_digest_hex: stdio_transport_policy_metadata_digest_hex(metadata)?,
        policy_contract_version: metadata.policy.schema_version.clone(),
        runtime_status: PolicyRuntimeStatus::PreRuntimePolicyOnly,
        non_execution_invariants: metadata
            .future_host_policy_review_record
            .non_execution_invariants
            .clone(),
        compatibility: HostPolicyReviewCompatibility::Compatible,
        decision: HostPolicyReviewDecisionMetadata {
            status: HostPolicyReviewStatus::ReviewPending,
            approval_recorded: false,
            rejection_recorded: false,
            review_metadata_only: true,
            approval_runtime_effect_allowed: false,
            rejection_runtime_effect_allowed: false,
        },
        diagnostics: HostPolicyReviewDiagnostics {
            warnings: host_policy_review_record_warnings(),
            errors: Vec::new(),
        },
    })
}

pub fn rejected_host_policy_review_record_for_stdio_transport_policy_metadata(
    metadata: &StdioTransportPolicyMetadata,
    errors: Vec<String>,
) -> HostResult<HostPolicyReviewRecord> {
    if errors.is_empty() {
        return Err(validation_error(
            "rejected host-policy review record requires diagnostics",
        ));
    }

    let record = HostPolicyReviewRecord {
        schema: ARDYN_HOST_POLICY_REVIEW_RECORD_SCHEMA.to_string(),
        schema_version: ARDYN_HOST_POLICY_REVIEW_RECORD_VERSION.to_string(),
        record_phase: ARDYN_HOST_POLICY_REVIEW_RECORD_PHASE.to_string(),
        reviewed_phase: ARDYN_REVIEWED_POLICY_METADATA_PHASE_LABEL.to_string(),
        policy_metadata_schema: metadata.schema.clone(),
        policy_metadata_version: metadata.schema_version.clone(),
        policy_metadata_digest_algorithm: ARDYN_POLICY_METADATA_DIGEST_ALGORITHM.to_string(),
        policy_metadata_digest_hex: policy_metadata_digest_hex_unchecked(metadata)?,
        policy_contract_version: metadata.policy.schema_version.clone(),
        runtime_status: PolicyRuntimeStatus::PreRuntimePolicyOnly,
        non_execution_invariants: policy_non_execution_invariants(),
        compatibility: HostPolicyReviewCompatibility::RejectedPolicy,
        decision: HostPolicyReviewDecisionMetadata {
            status: HostPolicyReviewStatus::ReviewRejected,
            approval_recorded: false,
            rejection_recorded: true,
            review_metadata_only: true,
            approval_runtime_effect_allowed: false,
            rejection_runtime_effect_allowed: false,
        },
        diagnostics: HostPolicyReviewDiagnostics {
            warnings: host_policy_review_record_warnings(),
            errors,
        },
    };

    validate_host_policy_review_record(&record)?;
    Ok(record)
}

pub fn validate_host_policy_review_record_common(
    record: &HostPolicyReviewRecord,
) -> HostResult<()> {
    if record.schema != ARDYN_HOST_POLICY_REVIEW_RECORD_SCHEMA {
        return Err(validation_error(
            "host-policy review record schema is unsupported",
        ));
    }
    if record.schema_version != ARDYN_HOST_POLICY_REVIEW_RECORD_VERSION {
        return Err(validation_error(
            "host-policy review record schemaVersion is unsupported",
        ));
    }
    if record.record_phase != ARDYN_HOST_POLICY_REVIEW_RECORD_PHASE {
        return Err(validation_error(
            "host-policy review record phase is unsupported",
        ));
    }
    if record.reviewed_phase != ARDYN_REVIEWED_POLICY_METADATA_PHASE_LABEL {
        return Err(validation_error(
            "host-policy review record reviewed phase is unsupported",
        ));
    }
    if record.policy_metadata_schema != ARDYN_STDIO_TRANSPORT_POLICY_METADATA_SCHEMA {
        return Err(validation_error(
            "host-policy review record metadata schema is unsupported",
        ));
    }
    if record.policy_metadata_version != ARDYN_STDIO_TRANSPORT_POLICY_METADATA_VERSION {
        return Err(validation_error(
            "host-policy review record metadata version is unsupported",
        ));
    }
    if record.policy_contract_version != ARDYN_SCHEMA_VERSION {
        return Err(validation_error(
            "host-policy review record policy contract version is unsupported",
        ));
    }
    if record.policy_metadata_digest_algorithm != ARDYN_POLICY_METADATA_DIGEST_ALGORITHM
        || record.policy_metadata_digest_hex.len() != 64
        || !record
            .policy_metadata_digest_hex
            .bytes()
            .all(|byte| byte.is_ascii_hexdigit() && !byte.is_ascii_uppercase())
    {
        return Err(validation_error(
            "host-policy review record metadata digest is unsupported",
        ));
    }
    if record.runtime_status != PolicyRuntimeStatus::PreRuntimePolicyOnly {
        return Err(validation_error(
            "host-policy review record runtime status is unsupported",
        ));
    }
    if record.non_execution_invariants != policy_non_execution_invariants() {
        return Err(validation_error(
            "host-policy review record invariants are unsupported",
        ));
    }
    if record.diagnostics.warnings != host_policy_review_record_warnings() {
        return Err(validation_error(
            "host-policy review record warnings are unsupported",
        ));
    }
    if !record.decision.review_metadata_only
        || record.decision.approval_runtime_effect_allowed
        || record.decision.rejection_runtime_effect_allowed
    {
        return Err(validation_error(
            "host-policy review record decision must remain metadata-only",
        ));
    }

    Ok(())
}

pub fn validate_host_policy_review_record(record: &HostPolicyReviewRecord) -> HostResult<()> {
    validate_host_policy_review_record_common(record)?;

    match record.compatibility {
        HostPolicyReviewCompatibility::Compatible => {
            let pending = record.decision.status == HostPolicyReviewStatus::ReviewPending
                && !record.decision.approval_recorded
                && !record.decision.rejection_recorded;
            let approved = record.decision.status == HostPolicyReviewStatus::ReviewApproved
                && record.decision.approval_recorded
                && !record.decision.rejection_recorded;

            if !(pending || approved)
                || record.decision.rejection_recorded
                || !record.diagnostics.errors.is_empty()
            {
                return Err(validation_error(
                    "compatible host-policy review record decision must remain inert metadata",
                ));
            }
        }
        HostPolicyReviewCompatibility::RejectedPolicy => {
            if record.decision.status != HostPolicyReviewStatus::ReviewRejected
                || record.decision.approval_recorded
                || !record.decision.rejection_recorded
                || record.diagnostics.errors.is_empty()
            {
                return Err(validation_error(
                    "rejected host-policy review record must remain inert rejection metadata",
                ));
            }
        }
        HostPolicyReviewCompatibility::UpgradeAvailable
        | HostPolicyReviewCompatibility::UnsupportedMajor
        | HostPolicyReviewCompatibility::Malformed => {
            return Err(validation_error(
                "host-policy review record compatibility is not exact-current",
            ));
        }
    }

    Ok(())
}

pub fn serialize_host_policy_review_record_json(
    record: &HostPolicyReviewRecord,
) -> HostResult<String> {
    validate_host_policy_review_record(record)?;
    let json = serde_json::to_string_pretty(record)?;

    Ok(format!("{json}\n"))
}

pub fn host_policy_review_record_json_for_stdio_transport_policy_metadata(
    metadata: &StdioTransportPolicyMetadata,
) -> HostResult<String> {
    let record = host_policy_review_record_for_stdio_transport_policy_metadata(metadata)?;

    serialize_host_policy_review_record_json(&record)
}

pub fn parse_host_policy_review_record_json(input: &str) -> HostResult<HostPolicyReviewRecord> {
    if input.contains('\r') {
        return Err(validation_error(
            "host-policy review record must be LF-only JSON",
        ));
    }

    let record: HostPolicyReviewRecord = serde_json::from_str(input)?;
    validate_host_policy_review_record(&record)?;
    Ok(record)
}

pub fn classify_host_policy_review_record_json(input: &str) -> HostPolicyReviewCompatibility {
    if input.contains('\r') {
        return HostPolicyReviewCompatibility::Malformed;
    }

    let value: serde_json::Value = match serde_json::from_str(input) {
        Ok(value) => value,
        Err(_) => return HostPolicyReviewCompatibility::Malformed,
    };

    let object = match value.as_object() {
        Some(object) => object,
        None => return HostPolicyReviewCompatibility::Malformed,
    };

    let schema = object.get("schema").and_then(serde_json::Value::as_str);
    if schema != Some(ARDYN_HOST_POLICY_REVIEW_RECORD_SCHEMA) {
        return HostPolicyReviewCompatibility::Malformed;
    }

    let schema_version = match object
        .get("schemaVersion")
        .and_then(serde_json::Value::as_str)
    {
        Some(schema_version) => schema_version,
        None => return HostPolicyReviewCompatibility::Malformed,
    };

    if has_malformed_semver(schema_version) {
        return HostPolicyReviewCompatibility::Malformed;
    }

    if is_unsupported_major(schema_version, ARDYN_HOST_POLICY_REVIEW_RECORD_VERSION) {
        return HostPolicyReviewCompatibility::UnsupportedMajor;
    }

    if is_same_major_non_current(schema_version, ARDYN_HOST_POLICY_REVIEW_RECORD_VERSION) {
        return HostPolicyReviewCompatibility::UpgradeAvailable;
    }

    let json = match serde_json::to_string(&value) {
        Ok(json) => json,
        Err(_) => return HostPolicyReviewCompatibility::Malformed,
    };
    let record: HostPolicyReviewRecord = match serde_json::from_str(&json) {
        Ok(record) => record,
        Err(_) => return HostPolicyReviewCompatibility::Malformed,
    };

    match validate_host_policy_review_record(&record) {
        Ok(()) => record.compatibility,
        Err(_) => HostPolicyReviewCompatibility::Malformed,
    }
}

pub fn host_policy_approval_record_top_level_order() -> Vec<String> {
    [
        "schema",
        "schemaVersion",
        "recordKind",
        "recordPhase",
        "reviewedPhase",
        "approvalTarget",
        "operatorConsent",
        "runtimeCapabilityRequest",
        "approvalStatus",
        "validity",
        "runtimeEffect",
        "currentRecordRuntimeStatement",
        "nonExecutionInvariantSummary",
        "classification",
        "denial",
        "audit",
    ]
    .into_iter()
    .map(String::from)
    .collect()
}

fn host_policy_approval_target_commands() -> Vec<String> {
    ["serve-runtime", "stdio-runtime"]
        .into_iter()
        .map(String::from)
        .collect()
}

fn host_policy_approval_consent_scope() -> Vec<String> {
    [
        "process-stdio-ownership",
        "stdin-lifecycle-control",
        "stdout-jsonl-ownership",
        "stderr-diagnostics-ownership",
        "process-termination-control",
        "transcript-persistence-review",
        "failure-audit-record-emission",
    ]
    .into_iter()
    .map(String::from)
    .collect()
}

fn host_policy_approval_runtime_statement() -> String {
    "Current Phase 4.1A approval records are static review/audit artifacts only and do not enable runtime."
        .to_string()
}

fn host_policy_approval_invariant_summary() -> String {
    "Operator consent is necessary but not sufficient; live runtime remains unavailable until a separately approved implementation phase and major runtime-readiness checkpoint."
        .to_string()
}

fn host_policy_approval_validity_window() -> HostPolicyApprovalValidity {
    HostPolicyApprovalValidity {
        not_before: "1970-01-01T00:00:00.000Z".to_string(),
        expires_at: "2099-01-01T00:00:00.000Z".to_string(),
        evaluated_at: "1970-01-01T00:00:00.000Z".to_string(),
        valid_at_evaluation: true,
    }
}

fn host_policy_approval_validity_window_is_active(validity: &HostPolicyApprovalValidity) -> bool {
    validity.valid_at_evaluation
        && validity.not_before.as_str() <= validity.evaluated_at.as_str()
        && validity.evaluated_at.as_str() < validity.expires_at.as_str()
}

fn host_policy_operator_consent_complete(consent: &HostPolicyOperatorConsent) -> bool {
    consent.consent_recorded
        && consent.operator_id.is_some()
        && consent.consent_version.as_deref() == Some(ARDYN_HOST_POLICY_APPROVAL_RECORD_VERSION)
        && consent.consented_at.is_some()
        && consent.consent_scope == host_policy_approval_consent_scope()
        && consent.process_stdio_ownership_consent
        && consent.stdin_lifecycle_control_consent
        && consent.stdout_jsonl_ownership_consent
        && consent.stderr_diagnostics_ownership_consent
        && consent.process_termination_control_consent
        && consent.transcript_persistence_review_consent
        && consent.failure_audit_record_emission_consent
        && consent.understands_necessary_but_not_sufficient
        && consent.understands_no_runtime_enabled_in_this_phase
        && consent.understands_separate_implementation_required
}

fn host_policy_approval_runtime_effect_is_inert(record: &HostPolicyApprovalRecord) -> bool {
    !record.runtime_effect.current_record_enables_runtime
        && !record.runtime_effect.runtime_approval_effect_allowed
        && !record.runtime_effect.runtime_implementation_available
        && !record.runtime_effect.runtime_command_available
        && record
            .runtime_effect
            .requires_separate_runtime_implementation_approval
        && record
            .runtime_effect
            .operator_consent_necessary_but_not_sufficient
        && !record
            .runtime_capability_request
            .runtime_implementation_available
        && !record.runtime_capability_request.serve_runtime_available
        && !record.runtime_capability_request.stdio_runtime_available
        && record
            .approval_target
            .requires_separate_implementation_phase
        && record
            .approval_target
            .devin_review_required_before_enablement
}

pub fn host_policy_approval_record() -> HostPolicyApprovalRecord {
    HostPolicyApprovalRecord {
        schema: ARDYN_HOST_POLICY_APPROVAL_RECORD_SCHEMA.to_string(),
        schema_version: ARDYN_HOST_POLICY_APPROVAL_RECORD_VERSION.to_string(),
        record_kind: ARDYN_HOST_POLICY_APPROVAL_RECORD_KIND.to_string(),
        record_phase: ARDYN_HOST_POLICY_APPROVAL_RECORD_PHASE.to_string(),
        reviewed_phase: ARDYN_HOST_POLICY_APPROVAL_REVIEWED_PHASE_LABEL.to_string(),
        approval_target: HostPolicyApprovalTarget {
            target_kind: ARDYN_HOST_POLICY_APPROVAL_TARGET_KIND.to_string(),
            target_phase: ARDYN_HOST_POLICY_APPROVAL_TARGET_PHASE.to_string(),
            target_commands: host_policy_approval_target_commands(),
            requires_separate_implementation_phase: true,
            devin_review_required_before_enablement: true,
        },
        operator_consent: HostPolicyOperatorConsent {
            consent_recorded: true,
            operator_id: Some("local-operator-reviewer".to_string()),
            consent_version: Some(ARDYN_HOST_POLICY_APPROVAL_RECORD_VERSION.to_string()),
            consented_at: Some("1970-01-01T00:00:00.000Z".to_string()),
            consent_scope: host_policy_approval_consent_scope(),
            process_stdio_ownership_consent: true,
            stdin_lifecycle_control_consent: true,
            stdout_jsonl_ownership_consent: true,
            stderr_diagnostics_ownership_consent: true,
            process_termination_control_consent: true,
            transcript_persistence_review_consent: true,
            failure_audit_record_emission_consent: true,
            understands_necessary_but_not_sufficient: true,
            understands_no_runtime_enabled_in_this_phase: true,
            understands_separate_implementation_required: true,
        },
        runtime_capability_request: HostPolicyRuntimeCapabilityRequest {
            capability: ARDYN_HOST_POLICY_APPROVAL_RUNTIME_CAPABILITY.to_string(),
            reason: "Review the operator-consent boundary required before any future stdio runtime implementation."
                .to_string(),
            runtime_implementation_available: false,
            serve_runtime_available: false,
            stdio_runtime_available: false,
        },
        approval_status: HostPolicyApprovalStatus::ReviewApproved,
        validity: host_policy_approval_validity_window(),
        runtime_effect: HostPolicyApprovalRuntimeEffect {
            current_record_enables_runtime: false,
            runtime_approval_effect_allowed: false,
            runtime_implementation_available: false,
            runtime_command_available: false,
            requires_separate_runtime_implementation_approval: true,
            operator_consent_necessary_but_not_sufficient: true,
        },
        current_record_runtime_statement: host_policy_approval_runtime_statement(),
        non_execution_invariant_summary: HostPolicyApprovalNonExecutionInvariantSummary {
            summary: host_policy_approval_invariant_summary(),
            invariants: policy_non_execution_invariants(),
        },
        classification: HostPolicyApprovalRecordClassification::ValidReviewRecord,
        denial: HostPolicyApprovalDenial {
            fail_closed_reasons: Vec::new(),
            denial_reason: None,
        },
        audit: HostPolicyApprovalAuditMetadata {
            created_at: "1970-01-01T00:00:00.000Z".to_string(),
            created_by: "codex-phase-4.1a".to_string(),
            source_phase: "4.1A".to_string(),
            reviewer: "Codex".to_string(),
            devin_review_required_now: false,
            preserve_devin_review_for: "major-runtime-readiness-checkpoint".to_string(),
            metadata_only: true,
            writes_files: false,
            runs_runtime: false,
        },
    }
}

pub fn denied_host_policy_approval_record(reason: &str) -> HostResult<HostPolicyApprovalRecord> {
    if reason.is_empty() {
        return Err(validation_error(
            "denied host-policy approval record requires a reason",
        ));
    }

    let mut record = host_policy_approval_record();
    record.approval_status = HostPolicyApprovalStatus::ReviewDenied;
    record.classification = HostPolicyApprovalRecordClassification::Denied;
    record.denial.fail_closed_reasons = vec!["operator_denied_runtime_request".to_string()];
    record.denial.denial_reason = Some(reason.to_string());
    validate_host_policy_approval_record(&record)?;
    Ok(record)
}

pub fn classify_host_policy_approval_record(
    record: &HostPolicyApprovalRecord,
) -> HostPolicyApprovalRecordClassification {
    if record.schema != ARDYN_HOST_POLICY_APPROVAL_RECORD_SCHEMA
        || record.schema_version != ARDYN_HOST_POLICY_APPROVAL_RECORD_VERSION
        || record.record_kind != ARDYN_HOST_POLICY_APPROVAL_RECORD_KIND
        || record.record_phase != ARDYN_HOST_POLICY_APPROVAL_RECORD_PHASE
        || record.reviewed_phase != ARDYN_HOST_POLICY_APPROVAL_REVIEWED_PHASE_LABEL
        || record.approval_target.target_kind != ARDYN_HOST_POLICY_APPROVAL_TARGET_KIND
        || record.approval_target.target_phase != ARDYN_HOST_POLICY_APPROVAL_TARGET_PHASE
        || record.approval_target.target_commands != host_policy_approval_target_commands()
        || record.runtime_capability_request.capability
            != ARDYN_HOST_POLICY_APPROVAL_RUNTIME_CAPABILITY
        || record.current_record_runtime_statement != host_policy_approval_runtime_statement()
        || record.non_execution_invariant_summary.summary
            != host_policy_approval_invariant_summary()
        || record.non_execution_invariant_summary.invariants != policy_non_execution_invariants()
        || record.audit.created_at != "1970-01-01T00:00:00.000Z"
        || record.audit.created_by != "codex-phase-4.1a"
        || record.audit.source_phase != "4.1A"
        || record.audit.reviewer != "Codex"
        || record.audit.devin_review_required_now
        || record.audit.preserve_devin_review_for != "major-runtime-readiness-checkpoint"
        || !record.audit.metadata_only
        || record.audit.writes_files
        || record.audit.runs_runtime
    {
        return HostPolicyApprovalRecordClassification::Malformed;
    }

    if !host_policy_approval_runtime_effect_is_inert(record) {
        return HostPolicyApprovalRecordClassification::RuntimeNotAvailable;
    }

    if record.approval_status == HostPolicyApprovalStatus::ReviewDenied {
        return HostPolicyApprovalRecordClassification::Denied;
    }

    if !host_policy_operator_consent_complete(&record.operator_consent) {
        return HostPolicyApprovalRecordClassification::MissingOperatorConsent;
    }

    if !host_policy_approval_validity_window_is_active(&record.validity) {
        return HostPolicyApprovalRecordClassification::ExpiredOrNotYetValid;
    }

    HostPolicyApprovalRecordClassification::ValidReviewRecord
}

pub fn validate_host_policy_approval_record(record: &HostPolicyApprovalRecord) -> HostResult<()> {
    let classification = classify_host_policy_approval_record(record);
    if record.classification != classification {
        return Err(validation_error(
            "host-policy approval record classification is unsupported",
        ));
    }

    match classification {
        HostPolicyApprovalRecordClassification::ValidReviewRecord => {
            if record.approval_status != HostPolicyApprovalStatus::ReviewApproved
                || !record.denial.fail_closed_reasons.is_empty()
                || record.denial.denial_reason.is_some()
            {
                return Err(validation_error(
                    "valid host-policy approval record must remain inert approved review metadata",
                ));
            }
        }
        HostPolicyApprovalRecordClassification::Denied => {
            if record.denial.fail_closed_reasons.is_empty() || record.denial.denial_reason.is_none()
            {
                return Err(validation_error(
                    "denied host-policy approval record requires fail-closed diagnostics",
                ));
            }
        }
        HostPolicyApprovalRecordClassification::MissingOperatorConsent
        | HostPolicyApprovalRecordClassification::ExpiredOrNotYetValid
        | HostPolicyApprovalRecordClassification::UnsupportedVersion
        | HostPolicyApprovalRecordClassification::Malformed
        | HostPolicyApprovalRecordClassification::RuntimeNotAvailable => {
            return Err(validation_error(
                "host-policy approval record is not an exact current review record",
            ));
        }
    }

    Ok(())
}

pub fn serialize_host_policy_approval_record_json(
    record: &HostPolicyApprovalRecord,
) -> HostResult<String> {
    validate_host_policy_approval_record(record)?;
    let json = serde_json::to_string_pretty(record)?;

    Ok(format!("{json}\n"))
}

pub fn host_policy_approval_record_json() -> HostResult<String> {
    serialize_host_policy_approval_record_json(&host_policy_approval_record())
}

pub fn denied_host_policy_approval_record_json(reason: &str) -> HostResult<String> {
    serialize_host_policy_approval_record_json(&denied_host_policy_approval_record(reason)?)
}

pub fn parse_host_policy_approval_record_json(input: &str) -> HostResult<HostPolicyApprovalRecord> {
    if input.contains('\r') {
        return Err(validation_error(
            "host-policy approval record must be LF-only JSON",
        ));
    }

    let record: HostPolicyApprovalRecord = serde_json::from_str(input)?;
    validate_host_policy_approval_record(&record)?;
    Ok(record)
}

pub fn classify_host_policy_approval_record_json(
    input: &str,
) -> HostPolicyApprovalRecordClassification {
    if input.contains('\r') {
        return HostPolicyApprovalRecordClassification::Malformed;
    }

    let value: serde_json::Value = match serde_json::from_str(input) {
        Ok(value) => value,
        Err(_) => return HostPolicyApprovalRecordClassification::Malformed,
    };

    let object = match value.as_object() {
        Some(object) => object,
        None => return HostPolicyApprovalRecordClassification::Malformed,
    };

    let schema = object.get("schema").and_then(serde_json::Value::as_str);
    if schema != Some(ARDYN_HOST_POLICY_APPROVAL_RECORD_SCHEMA) {
        return HostPolicyApprovalRecordClassification::Malformed;
    }

    let schema_version = match object
        .get("schemaVersion")
        .and_then(serde_json::Value::as_str)
    {
        Some(schema_version) => schema_version,
        None => return HostPolicyApprovalRecordClassification::Malformed,
    };

    if has_malformed_semver(schema_version) {
        return HostPolicyApprovalRecordClassification::Malformed;
    }

    if is_unsupported_major(schema_version, ARDYN_HOST_POLICY_APPROVAL_RECORD_VERSION)
        || is_same_major_non_current(schema_version, ARDYN_HOST_POLICY_APPROVAL_RECORD_VERSION)
    {
        return HostPolicyApprovalRecordClassification::UnsupportedVersion;
    }

    let json = match serde_json::to_string(&value) {
        Ok(json) => json,
        Err(_) => return HostPolicyApprovalRecordClassification::Malformed,
    };
    let record: HostPolicyApprovalRecord = match serde_json::from_str(&json) {
        Ok(record) => record,
        Err(_) => return HostPolicyApprovalRecordClassification::Malformed,
    };

    let classification = classify_host_policy_approval_record(&record);
    if record.classification == classification {
        classification
    } else {
        HostPolicyApprovalRecordClassification::Malformed
    }
}

pub fn transport_harness_contract_top_level_order() -> Vec<String> {
    [
        "schema",
        "schemaVersion",
        "contractKind",
        "contractPhase",
        "reviewedPhase",
        "harnessKind",
        "harnessVersion",
        "supportedTransportModes",
        "runtimeAvailability",
        "approvalRecordReference",
        "policyMetadataReference",
        "stderrRedactionPolicyReference",
        "transcriptAuditOutputPolicyReference",
        "failClosedStartupPreconditions",
        "runtimeEffect",
        "nonExecutionInvariantSummary",
        "classification",
        "unsupportedRuntimeReasons",
        "rejectedRuntimeReasons",
        "audit",
    ]
    .into_iter()
    .map(String::from)
    .collect()
}

fn transport_harness_supported_transport_modes() -> Vec<TransportHarnessModeMetadata> {
    [
        ("stdio-jsonl-session-events", "stdout"),
        ("stderr-diagnostics", "stderr"),
        ("stdin-command-stream", "stdin"),
    ]
    .into_iter()
    .map(|(name, direction)| TransportHarnessModeMetadata {
        name: name.to_string(),
        direction: direction.to_string(),
        metadata_only: true,
        runtime_implemented: false,
    })
    .collect()
}

fn transport_harness_fail_closed_startup_preconditions() -> Vec<String> {
    [
        "host-policy-approval-record-reference-present",
        "stdio-transport-policy-metadata-reference-present",
        "stderr-redaction-policy-reference-present",
        "transcript-audit-output-policy-reference-present",
        "runtime-unavailable-until-separate-implementation-approval",
        "major-runtime-readiness-review-required",
        "no-process-stdio-ownership",
        "no-live-stdin-reader",
        "no-runtime-command",
    ]
    .into_iter()
    .map(String::from)
    .collect()
}

fn transport_harness_invariant_summary() -> String {
    "Phase 4.1B transport harness contracts are static Rust-host metadata only; approval references are necessary but not sufficient and live runtime remains unavailable until a separately approved implementation phase and major runtime-readiness checkpoint."
        .to_string()
}

fn transport_harness_unsupported_runtime_reasons() -> Vec<String> {
    [
        "live-stdio-runtime-not-implemented",
        "serve-runtime-command-unavailable",
        "stdio-runtime-command-unavailable",
        "process-stdio-ownership-not-implemented",
        "stdin-reader-not-implemented",
    ]
    .into_iter()
    .map(String::from)
    .collect()
}

fn transport_harness_rejected_runtime_reasons() -> Vec<String> {
    [
        "static-contract-only",
        "approval-record-reference-cannot-grant-runtime",
        "separate-runtime-implementation-approval-required",
        "major-runtime-readiness-review-required",
    ]
    .into_iter()
    .map(String::from)
    .collect()
}

fn transport_harness_runtime_availability() -> TransportHarnessRuntimeAvailability {
    TransportHarnessRuntimeAvailability {
        status: TransportHarnessRuntimeAvailabilityStatus::RuntimeUnavailable,
        runtime_available: false,
        serve_runtime_available: false,
        stdio_runtime_available: false,
        process_stdio_ownership_available: false,
        stdin_reader_available: false,
        stdin_command_loop_available: false,
        listener_available: false,
        subprocess_spawning_available: false,
    }
}

fn transport_harness_approval_record_reference() -> TransportHarnessApprovalRecordReference {
    TransportHarnessApprovalRecordReference {
        required: true,
        present: true,
        schema: ARDYN_HOST_POLICY_APPROVAL_RECORD_SCHEMA.to_string(),
        schema_version: ARDYN_HOST_POLICY_APPROVAL_RECORD_VERSION.to_string(),
        record_phase: ARDYN_HOST_POLICY_APPROVAL_RECORD_PHASE.to_string(),
        classification: HostPolicyApprovalRecordClassification::ValidReviewRecord,
        runtime_capability: ARDYN_HOST_POLICY_APPROVAL_RUNTIME_CAPABILITY.to_string(),
        operator_consent_required: true,
        approval_record_grants_runtime: false,
    }
}

fn transport_harness_policy_metadata_reference() -> TransportHarnessPolicyMetadataReference {
    TransportHarnessPolicyMetadataReference {
        required: true,
        present: true,
        schema: ARDYN_STDIO_TRANSPORT_POLICY_METADATA_SCHEMA.to_string(),
        schema_version: ARDYN_STDIO_TRANSPORT_POLICY_METADATA_VERSION.to_string(),
        metadata_phase: ARDYN_STDIO_TRANSPORT_POLICY_METADATA_PHASE.to_string(),
        contract_phase: ARDYN_STDIO_TRANSPORT_POLICY_PHASE.to_string(),
        runtime_status: PolicyRuntimeStatus::PreRuntimePolicyOnly,
        review_only: true,
        digest_algorithm: ARDYN_POLICY_METADATA_DIGEST_ALGORITHM.to_string(),
    }
}

fn transport_harness_stderr_redaction_reference() -> TransportHarnessStderrRedactionPolicyReference
{
    TransportHarnessStderrRedactionPolicyReference {
        required: true,
        present: true,
        source_schema: ARDYN_STDIO_TRANSPORT_POLICY_METADATA_SCHEMA.to_string(),
        source_schema_version: ARDYN_STDIO_TRANSPORT_POLICY_METADATA_VERSION.to_string(),
        source_field: "policy.redaction".to_string(),
        enforcement_active: false,
        required_before_live_runtime: true,
        stack_traces_allowed: false,
        environment_dumps_allowed: false,
        secrets_allowed: false,
        production_signing_keys_allowed: false,
    }
}

fn transport_harness_transcript_audit_reference(
) -> TransportHarnessTranscriptAuditOutputPolicyReference {
    TransportHarnessTranscriptAuditOutputPolicyReference {
        required: true,
        present: true,
        transcript_schema: "ardyn.session-transcript".to_string(),
        session_event_schema: "https://schemas.ardyn.ai/session-event.schema.json".to_string(),
        normalized_transcript_required: true,
        failure_audit_record_required_before_runtime: true,
        transcript_persistence_runtime_implemented: false,
        replay_runtime_implemented: false,
        writes_files_in_this_phase: false,
    }
}

fn transport_harness_runtime_effect() -> TransportHarnessRuntimeEffect {
    TransportHarnessRuntimeEffect {
        current_contract_enables_runtime: false,
        runtime_implementation_available: false,
        runtime_command_available: false,
        process_stdio_ownership_available: false,
        stdin_reader_available: false,
        stdout_writer_available: false,
        stderr_writer_available: false,
        approval_record_necessary_but_not_sufficient: true,
        requires_separate_runtime_implementation_approval: true,
        requires_devin_review_before_enablement: true,
    }
}

fn transport_harness_runtime_availability_is_unavailable(
    availability: &TransportHarnessRuntimeAvailability,
) -> bool {
    availability.status == TransportHarnessRuntimeAvailabilityStatus::RuntimeUnavailable
        && !availability.runtime_available
        && !availability.serve_runtime_available
        && !availability.stdio_runtime_available
        && !availability.process_stdio_ownership_available
        && !availability.stdin_reader_available
        && !availability.stdin_command_loop_available
        && !availability.listener_available
        && !availability.subprocess_spawning_available
}

fn transport_harness_runtime_effect_is_inert(record: &TransportHarnessContract) -> bool {
    !record.runtime_effect.current_contract_enables_runtime
        && !record.runtime_effect.runtime_implementation_available
        && !record.runtime_effect.runtime_command_available
        && !record.runtime_effect.process_stdio_ownership_available
        && !record.runtime_effect.stdin_reader_available
        && !record.runtime_effect.stdout_writer_available
        && !record.runtime_effect.stderr_writer_available
        && record
            .runtime_effect
            .approval_record_necessary_but_not_sufficient
        && record
            .runtime_effect
            .requires_separate_runtime_implementation_approval
        && record
            .runtime_effect
            .requires_devin_review_before_enablement
        && transport_harness_runtime_availability_is_unavailable(&record.runtime_availability)
        && !record
            .approval_record_reference
            .approval_record_grants_runtime
}

fn transport_harness_references_are_exact(record: &TransportHarnessContract) -> bool {
    record.approval_record_reference.required
        && record.approval_record_reference.schema == ARDYN_HOST_POLICY_APPROVAL_RECORD_SCHEMA
        && record.approval_record_reference.schema_version
            == ARDYN_HOST_POLICY_APPROVAL_RECORD_VERSION
        && record.approval_record_reference.record_phase == ARDYN_HOST_POLICY_APPROVAL_RECORD_PHASE
        && record.approval_record_reference.classification
            == HostPolicyApprovalRecordClassification::ValidReviewRecord
        && record.approval_record_reference.runtime_capability
            == ARDYN_HOST_POLICY_APPROVAL_RUNTIME_CAPABILITY
        && record.approval_record_reference.operator_consent_required
        && record.policy_metadata_reference.required
        && record.policy_metadata_reference.schema == ARDYN_STDIO_TRANSPORT_POLICY_METADATA_SCHEMA
        && record.policy_metadata_reference.schema_version
            == ARDYN_STDIO_TRANSPORT_POLICY_METADATA_VERSION
        && record.policy_metadata_reference.metadata_phase
            == ARDYN_STDIO_TRANSPORT_POLICY_METADATA_PHASE
        && record.policy_metadata_reference.contract_phase == ARDYN_STDIO_TRANSPORT_POLICY_PHASE
        && record.policy_metadata_reference.runtime_status
            == PolicyRuntimeStatus::PreRuntimePolicyOnly
        && record.policy_metadata_reference.review_only
        && record.policy_metadata_reference.digest_algorithm
            == ARDYN_POLICY_METADATA_DIGEST_ALGORITHM
        && record.stderr_redaction_policy_reference.required
        && record.stderr_redaction_policy_reference.source_schema
            == ARDYN_STDIO_TRANSPORT_POLICY_METADATA_SCHEMA
        && record
            .stderr_redaction_policy_reference
            .source_schema_version
            == ARDYN_STDIO_TRANSPORT_POLICY_METADATA_VERSION
        && record.stderr_redaction_policy_reference.source_field == "policy.redaction"
        && !record.stderr_redaction_policy_reference.enforcement_active
        && record
            .stderr_redaction_policy_reference
            .required_before_live_runtime
        && !record
            .stderr_redaction_policy_reference
            .stack_traces_allowed
        && !record
            .stderr_redaction_policy_reference
            .environment_dumps_allowed
        && !record.stderr_redaction_policy_reference.secrets_allowed
        && !record
            .stderr_redaction_policy_reference
            .production_signing_keys_allowed
        && record.transcript_audit_output_policy_reference.required
        && record
            .transcript_audit_output_policy_reference
            .transcript_schema
            == "ardyn.session-transcript"
        && record
            .transcript_audit_output_policy_reference
            .session_event_schema
            == "https://schemas.ardyn.ai/session-event.schema.json"
        && record
            .transcript_audit_output_policy_reference
            .normalized_transcript_required
        && record
            .transcript_audit_output_policy_reference
            .failure_audit_record_required_before_runtime
        && !record
            .transcript_audit_output_policy_reference
            .transcript_persistence_runtime_implemented
        && !record
            .transcript_audit_output_policy_reference
            .replay_runtime_implemented
        && !record
            .transcript_audit_output_policy_reference
            .writes_files_in_this_phase
}

pub fn transport_harness_contract() -> TransportHarnessContract {
    TransportHarnessContract {
        schema: ARDYN_TRANSPORT_HARNESS_CONTRACT_SCHEMA.to_string(),
        schema_version: ARDYN_TRANSPORT_HARNESS_CONTRACT_VERSION.to_string(),
        contract_kind: ARDYN_TRANSPORT_HARNESS_CONTRACT_KIND.to_string(),
        contract_phase: ARDYN_TRANSPORT_HARNESS_CONTRACT_PHASE.to_string(),
        reviewed_phase: ARDYN_TRANSPORT_HARNESS_REVIEWED_PHASE_LABEL.to_string(),
        harness_kind: ARDYN_TRANSPORT_HARNESS_KIND.to_string(),
        harness_version: ARDYN_TRANSPORT_HARNESS_VERSION.to_string(),
        supported_transport_modes: transport_harness_supported_transport_modes(),
        runtime_availability: transport_harness_runtime_availability(),
        approval_record_reference: transport_harness_approval_record_reference(),
        policy_metadata_reference: transport_harness_policy_metadata_reference(),
        stderr_redaction_policy_reference: transport_harness_stderr_redaction_reference(),
        transcript_audit_output_policy_reference: transport_harness_transcript_audit_reference(),
        fail_closed_startup_preconditions: transport_harness_fail_closed_startup_preconditions(),
        runtime_effect: transport_harness_runtime_effect(),
        non_execution_invariant_summary: TransportHarnessNonExecutionInvariantSummary {
            summary: transport_harness_invariant_summary(),
            invariants: policy_non_execution_invariants(),
        },
        classification: TransportHarnessContractClassification::StaticContractOnly,
        unsupported_runtime_reasons: transport_harness_unsupported_runtime_reasons(),
        rejected_runtime_reasons: transport_harness_rejected_runtime_reasons(),
        audit: TransportHarnessAuditMetadata {
            created_at: "1970-01-01T00:00:00.000Z".to_string(),
            created_by: "codex-phase-4.1b".to_string(),
            source_phase: "4.1B".to_string(),
            reviewer: "Codex".to_string(),
            devin_review_required_now: false,
            preserve_devin_review_for: "major-runtime-readiness-checkpoint".to_string(),
            metadata_only: true,
            writes_files: false,
            runs_runtime: false,
        },
    }
}

pub fn classify_transport_harness_contract(
    record: &TransportHarnessContract,
) -> TransportHarnessContractClassification {
    if record.schema != ARDYN_TRANSPORT_HARNESS_CONTRACT_SCHEMA
        || record.schema_version != ARDYN_TRANSPORT_HARNESS_CONTRACT_VERSION
        || record.contract_kind != ARDYN_TRANSPORT_HARNESS_CONTRACT_KIND
        || record.contract_phase != ARDYN_TRANSPORT_HARNESS_CONTRACT_PHASE
        || record.reviewed_phase != ARDYN_TRANSPORT_HARNESS_REVIEWED_PHASE_LABEL
        || record.harness_kind != ARDYN_TRANSPORT_HARNESS_KIND
        || record.harness_version != ARDYN_TRANSPORT_HARNESS_VERSION
        || record.supported_transport_modes != transport_harness_supported_transport_modes()
        || record.fail_closed_startup_preconditions
            != transport_harness_fail_closed_startup_preconditions()
        || record.non_execution_invariant_summary.summary != transport_harness_invariant_summary()
        || record.non_execution_invariant_summary.invariants != policy_non_execution_invariants()
        || record.unsupported_runtime_reasons != transport_harness_unsupported_runtime_reasons()
        || record.rejected_runtime_reasons != transport_harness_rejected_runtime_reasons()
        || record.audit.created_at != "1970-01-01T00:00:00.000Z"
        || record.audit.created_by != "codex-phase-4.1b"
        || record.audit.source_phase != "4.1B"
        || record.audit.reviewer != "Codex"
        || record.audit.devin_review_required_now
        || record.audit.preserve_devin_review_for != "major-runtime-readiness-checkpoint"
        || !record.audit.metadata_only
        || record.audit.writes_files
        || record.audit.runs_runtime
        || !transport_harness_references_are_exact(record)
    {
        return TransportHarnessContractClassification::Malformed;
    }

    if !transport_harness_runtime_effect_is_inert(record) {
        return TransportHarnessContractClassification::RuntimeUnavailable;
    }

    if !record.approval_record_reference.present {
        return TransportHarnessContractClassification::ApprovalMissing;
    }

    if !record.policy_metadata_reference.present {
        return TransportHarnessContractClassification::PolicyMetadataMissing;
    }

    if !record.stderr_redaction_policy_reference.present {
        return TransportHarnessContractClassification::RedactionPolicyMissing;
    }

    if !record.transcript_audit_output_policy_reference.present {
        return TransportHarnessContractClassification::TranscriptPolicyMissing;
    }

    TransportHarnessContractClassification::StaticContractOnly
}

pub fn validate_transport_harness_contract(record: &TransportHarnessContract) -> HostResult<()> {
    let classification = classify_transport_harness_contract(record);
    if record.classification != classification {
        return Err(validation_error(
            "transport harness contract classification is unsupported",
        ));
    }

    if classification != TransportHarnessContractClassification::StaticContractOnly {
        return Err(validation_error(
            "transport harness contract is not an exact current static contract",
        ));
    }

    Ok(())
}

pub fn serialize_transport_harness_contract_json(
    record: &TransportHarnessContract,
) -> HostResult<String> {
    validate_transport_harness_contract(record)?;
    let json = serde_json::to_string_pretty(record)?;

    Ok(format!("{json}\n"))
}

pub fn transport_harness_contract_json() -> HostResult<String> {
    serialize_transport_harness_contract_json(&transport_harness_contract())
}

pub fn parse_transport_harness_contract_json(input: &str) -> HostResult<TransportHarnessContract> {
    if input.contains('\r') {
        return Err(validation_error(
            "transport harness contract must be LF-only JSON",
        ));
    }

    let record: TransportHarnessContract = serde_json::from_str(input)?;
    validate_transport_harness_contract(&record)?;
    Ok(record)
}

pub fn classify_transport_harness_contract_json(
    input: &str,
) -> TransportHarnessContractClassification {
    if input.contains('\r') {
        return TransportHarnessContractClassification::Malformed;
    }

    let value: serde_json::Value = match serde_json::from_str(input) {
        Ok(value) => value,
        Err(_) => return TransportHarnessContractClassification::Malformed,
    };

    let object = match value.as_object() {
        Some(object) => object,
        None => return TransportHarnessContractClassification::Malformed,
    };

    let schema = object.get("schema").and_then(serde_json::Value::as_str);
    if schema != Some(ARDYN_TRANSPORT_HARNESS_CONTRACT_SCHEMA) {
        return TransportHarnessContractClassification::Malformed;
    }

    let schema_version = match object
        .get("schemaVersion")
        .and_then(serde_json::Value::as_str)
    {
        Some(schema_version) => schema_version,
        None => return TransportHarnessContractClassification::Malformed,
    };

    if has_malformed_semver(schema_version) {
        return TransportHarnessContractClassification::Malformed;
    }

    if is_unsupported_major(schema_version, ARDYN_TRANSPORT_HARNESS_CONTRACT_VERSION)
        || is_same_major_non_current(schema_version, ARDYN_TRANSPORT_HARNESS_CONTRACT_VERSION)
    {
        return TransportHarnessContractClassification::UnsupportedVersion;
    }

    let json = match serde_json::to_string(&value) {
        Ok(json) => json,
        Err(_) => return TransportHarnessContractClassification::Malformed,
    };
    let record: TransportHarnessContract = match serde_json::from_str(&json) {
        Ok(record) => record,
        Err(_) => return TransportHarnessContractClassification::Malformed,
    };

    let classification = classify_transport_harness_contract(&record);
    if record.classification == classification {
        classification
    } else {
        TransportHarnessContractClassification::Malformed
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum CapabilityKind {
    Adapter,
    Browser,
    Desktop,
    McpClient,
    McpServer,
    Memory,
    ModelProvider,
    Tool,
    Workflow,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum PermissionScope {
    Browser,
    Credentials,
    Desktop,
    Filesystem,
    Memory,
    Network,
    Process,
    Provider,
    Registry,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum PermissionAccess {
    Read,
    Write,
    Connect,
    Admin,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum TaskMode {
    Plan,
    DryRun,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct ArdynPermission {
    pub scope: PermissionScope,
    pub access: PermissionAccess,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub reason: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct ArdynCapability {
    pub id: String,
    pub kind: CapabilityKind,
    pub description: String,
    pub permissions: Vec<ArdynPermission>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct ArdynRuntime {
    pub host: RuntimeHost,
    pub core: RuntimeCore,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub entrypoint: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum RuntimeHost {
    Rust,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum RuntimeCore {
    Typescript,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct ArdynAdapterConfig {
    pub enabled: bool,
    pub external: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub endpoint: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub notes: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct ArdynPolicies {
    #[serde(rename = "defaultTaskMode")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub default_task_mode: Option<TaskMode>,
    #[serde(rename = "requiresApprovalFor")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub requires_approval_for: Option<Vec<ApprovalScope>>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum ApprovalScope {
    Browser,
    Credentials,
    Desktop,
    Filesystem,
    Network,
    Process,
    Provider,
    Registry,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(untagged)]
pub enum MetadataValue {
    String(String),
    Number(f64),
    Boolean(bool),
    Null,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct ArdynTaskConstraints {
    #[serde(rename = "requireHumanApproval")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub require_human_approval: Option<bool>,
    #[serde(rename = "allowNetwork")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub allow_network: Option<bool>,
    #[serde(rename = "maxSteps")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub max_steps: Option<u16>,
    #[serde(rename = "workspaceRoot")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub workspace_root: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct ArdynTask {
    pub id: String,
    pub objective: String,
    pub mode: TaskMode,
    #[serde(rename = "requestedCapabilities")]
    pub requested_capabilities: Vec<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub constraints: Option<ArdynTaskConstraints>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub inputs: Option<serde_json::Map<String, serde_json::Value>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub metadata: Option<BTreeMap<String, MetadataValue>>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct ArdynManifest {
    #[serde(rename = "schemaVersion")]
    pub schema_version: String,
    pub name: String,
    pub version: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
    pub runtime: ArdynRuntime,
    pub capabilities: Vec<ArdynCapability>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub adapters: Option<BTreeMap<String, ArdynAdapterConfig>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub policies: Option<ArdynPolicies>,
}

fn validation_error(message: impl Into<String>) -> Box<dyn Error + Send + Sync> {
    Box::new(IoError::new(ErrorKind::InvalidData, message.into()))
}

fn is_ascii_lower_or_digit(value: u8) -> bool {
    value.is_ascii_lowercase() || value.is_ascii_digit()
}

fn is_valid_manifest_name(value: &str) -> bool {
    let bytes = value.as_bytes();
    (3..=64).contains(&bytes.len())
        && bytes[0].is_ascii_lowercase()
        && is_ascii_lower_or_digit(bytes[bytes.len() - 1])
        && bytes[1..bytes.len() - 1]
            .iter()
            .all(|byte| is_ascii_lower_or_digit(*byte) || *byte == b'-')
}

fn is_valid_semver(value: &str) -> bool {
    let (core, prerelease) = match value.split_once('-') {
        Some((core, prerelease)) if !prerelease.is_empty() => (core, Some(prerelease)),
        Some(_) => return false,
        None => (value, None),
    };
    let mut parts = core.split('.');

    let has_three_numeric_parts = matches!(
        (parts.next(), parts.next(), parts.next(), parts.next()),
        (Some(major), Some(minor), Some(patch), None)
            if [major, minor, patch]
                .iter()
                .all(|part| !part.is_empty() && part.bytes().all(|byte| byte.is_ascii_digit()))
    );

    has_three_numeric_parts
        && match prerelease {
            Some(prerelease) => prerelease
                .bytes()
                .all(|byte| byte.is_ascii_alphanumeric() || byte == b'.' || byte == b'-'),
            None => true,
        }
}

fn matches_capability_id_pattern(value: &str) -> bool {
    !value.is_empty()
        && value.split('.').all(|segment| {
            !segment.is_empty()
                && segment.as_bytes()[0].is_ascii_lowercase()
                && segment
                    .bytes()
                    .all(|byte| is_ascii_lower_or_digit(byte) || byte == b'-')
        })
}

fn is_valid_capability_id(value: &str) -> bool {
    (3..=96).contains(&value.len()) && matches_capability_id_pattern(value)
}

fn is_valid_task_id(value: &str) -> bool {
    (3..=128).contains(&value.len())
        && value.as_bytes()[0].is_ascii_alphanumeric()
        && value
            .bytes()
            .all(|byte| byte.is_ascii_alphanumeric() || matches!(byte, b'_' | b'.' | b':' | b'-'))
}

fn validate_optional_string(
    field: &str,
    value: Option<&str>,
    min_len: Option<usize>,
    max_len: Option<usize>,
) -> HostResult<()> {
    let Some(value) = value else {
        return Ok(());
    };
    let length = value.chars().count();

    if min_len.is_some_and(|minimum| length < minimum) {
        return Err(validation_error(format!(
            "{field} is shorter than schema minimum"
        )));
    }

    if max_len.is_some_and(|maximum| length > maximum) {
        return Err(validation_error(format!(
            "{field} is longer than schema maximum"
        )));
    }

    Ok(())
}

pub fn validate_task(task: &ArdynTask) -> HostResult<()> {
    if !is_valid_task_id(&task.id) {
        return Err(validation_error("task.id does not match schema pattern"));
    }

    validate_optional_string("task.objective", Some(&task.objective), Some(1), Some(4000))?;

    if task.requested_capabilities.is_empty() {
        return Err(validation_error(
            "task.requestedCapabilities must contain at least one capability",
        ));
    }

    for capability_id in &task.requested_capabilities {
        if !matches_capability_id_pattern(capability_id) {
            return Err(validation_error(
                "task.requestedCapabilities contains an invalid capability id",
            ));
        }
    }

    if let Some(constraints) = &task.constraints {
        if let Some(max_steps) = constraints.max_steps {
            if !(1..=1000).contains(&max_steps) {
                return Err(validation_error(
                    "task.constraints.maxSteps is outside schema bounds",
                ));
            }
        }

        validate_optional_string(
            "task.constraints.workspaceRoot",
            constraints.workspace_root.as_deref(),
            Some(1),
            None,
        )?;
    }

    Ok(())
}

pub fn validate_manifest(manifest: &ArdynManifest) -> HostResult<()> {
    if manifest.schema_version != ARDYN_SCHEMA_VERSION {
        return Err(validation_error("manifest.schemaVersion must be 0.1.0"));
    }

    if !is_valid_manifest_name(&manifest.name) {
        return Err(validation_error(
            "manifest.name does not match schema pattern",
        ));
    }

    if !is_valid_semver(&manifest.version) {
        return Err(validation_error(
            "manifest.version does not match schema pattern",
        ));
    }

    validate_optional_string(
        "manifest.description",
        manifest.description.as_deref(),
        Some(1),
        Some(280),
    )?;

    validate_optional_string(
        "manifest.runtime.entrypoint",
        manifest.runtime.entrypoint.as_deref(),
        Some(1),
        Some(240),
    )?;

    if manifest.capabilities.is_empty() {
        return Err(validation_error(
            "manifest.capabilities must contain at least one capability",
        ));
    }

    for capability in &manifest.capabilities {
        if !is_valid_capability_id(&capability.id) {
            return Err(validation_error(
                "manifest.capabilities[].id does not match schema pattern",
            ));
        }

        validate_optional_string(
            "manifest.capabilities[].description",
            Some(&capability.description),
            Some(1),
            Some(280),
        )?;

        if capability.permissions.is_empty() {
            return Err(validation_error(
                "manifest.capabilities[].permissions must contain at least one permission",
            ));
        }

        for permission in &capability.permissions {
            validate_optional_string(
                "manifest.capabilities[].permissions[].reason",
                permission.reason.as_deref(),
                Some(1),
                Some(240),
            )?;
        }
    }

    if let Some(adapters) = &manifest.adapters {
        for adapter in adapters.values() {
            validate_optional_string(
                "manifest.adapters.*.endpoint",
                adapter.endpoint.as_deref(),
                Some(1),
                Some(240),
            )?;
            validate_optional_string(
                "manifest.adapters.*.notes",
                adapter.notes.as_deref(),
                None,
                Some(400),
            )?;
        }
    }

    Ok(())
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct HostInfo {
    #[serde(rename = "crateName")]
    pub crate_name: String,
    pub responsibilities: Vec<String>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct PlatformInfo {
    pub os: String,
    pub arch: String,
    pub family: String,
    #[serde(rename = "isWindows")]
    pub is_windows: bool,
    #[serde(rename = "windowsFirst")]
    pub windows_first: bool,
    pub notes: Vec<String>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct HostHandshake {
    #[serde(rename = "schemaVersion")]
    pub schema_version: String,
    pub phase: String,
    pub host: HostInfo,
    pub platform: PlatformInfo,
    pub manifest: Option<ArdynManifest>,
    pub capabilities: Vec<ArdynCapability>,
    #[serde(rename = "executionEnabled")]
    pub execution_enabled: bool,
    #[serde(rename = "toolExecutionEnabled")]
    pub tool_execution_enabled: bool,
    #[serde(rename = "autonomousExecutionEnabled")]
    pub autonomous_execution_enabled: bool,
    #[serde(rename = "productionToolExecutionEnabled")]
    pub production_tool_execution_enabled: bool,
    #[serde(rename = "apiCallsEnabled")]
    pub api_calls_enabled: bool,
    #[serde(rename = "networkListening")]
    pub network_listening: bool,
    #[serde(rename = "longRunningServicesStarted")]
    pub long_running_services_started: bool,
    #[serde(rename = "processesSpawned")]
    pub processes_spawned: bool,
}

pub fn host_info() -> HostInfo {
    HostInfo {
        crate_name: HOST_CRATE_NAME.to_string(),
        responsibilities: vec![
            "windows-first-local-host-safety".to_string(),
            "process-supervision-boundary".to_string(),
            "os-integration-boundary".to_string(),
            "packaging-boundary".to_string(),
        ],
    }
}

pub fn platform_info() -> PlatformInfo {
    let is_windows = cfg!(windows);
    PlatformInfo {
        os: std::env::consts::OS.to_string(),
        arch: std::env::consts::ARCH.to_string(),
        family: std::env::consts::FAMILY.to_string(),
        is_windows,
        windows_first: true,
        notes: if is_windows {
            vec!["Windows host safety boundary is active.".to_string()]
        } else {
            vec![
                "Cross-platform compile path; Windows remains the primary host target.".to_string(),
            ]
        },
    }
}

pub fn load_manifest_path(manifest_path: &str) -> HostResult<ArdynManifest> {
    let contents = fs::read_to_string(manifest_path)?;
    let manifest = serde_json::from_str::<ArdynManifest>(&contents)?;
    validate_manifest(&manifest)?;
    Ok(manifest)
}

pub fn host_handshake(manifest_path: Option<&str>) -> HostResult<HostHandshake> {
    let manifest = match manifest_path {
        Some(path) => Some(load_manifest_path(path)?),
        None => None,
    };
    let capabilities = manifest
        .as_ref()
        .map(|manifest| manifest.capabilities.clone())
        .unwrap_or_default();

    Ok(HostHandshake {
        schema_version: ARDYN_SCHEMA_VERSION.to_string(),
        phase: ARDYN_PHASE.to_string(),
        host: host_info(),
        platform: platform_info(),
        manifest,
        capabilities,
        execution_enabled: false,
        tool_execution_enabled: false,
        autonomous_execution_enabled: false,
        production_tool_execution_enabled: false,
        api_calls_enabled: false,
        network_listening: false,
        long_running_services_started: false,
        processes_spawned: false,
    })
}

pub fn fabric_sha256_hex(bytes: &[u8]) -> String {
    let digest = Sha256::digest(bytes);
    let mut output = String::with_capacity(64);

    for byte in digest {
        output.push_str(&format!("{byte:02x}"));
    }

    output
}

pub fn fabric_path_confinement_error(value: &str) -> Option<&'static str> {
    if value.is_empty() {
        return Some("path must not be empty");
    }
    if value.starts_with('/') || value.starts_with('\\') {
        return Some("path must be relative");
    }
    if value.len() >= 2 {
        let bytes = value.as_bytes();
        if bytes[0].is_ascii_alphabetic() && bytes[1] == b':' {
            return Some("path must not contain a Windows drive");
        }
    }
    if value.contains('\\') || value.contains('\0') {
        return Some("path must use POSIX separators and contain no NUL");
    }
    if value
        .split('/')
        .any(|segment| segment.is_empty() || segment == "." || segment == "..")
    {
        return Some("path must not contain empty, . or .. segments");
    }

    None
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::time::{SystemTime, UNIX_EPOCH};

    fn write_temp_manifest(contents: &str) -> std::path::PathBuf {
        let unique = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .expect("system time")
            .as_nanos();
        let path = std::env::temp_dir().join(format!("ardyn-host-invalid-manifest-{unique}.json"));

        std::fs::write(&path, contents).expect("write manifest");

        path
    }

    #[test]
    fn host_handshake_reports_platform_and_disables_execution() {
        let handshake = host_handshake(None).expect("handshake");

        assert_eq!(handshake.phase, "phase-3-task-planning");
        assert_eq!(handshake.host.crate_name, HOST_CRATE_NAME);
        assert_eq!(handshake.platform.os, std::env::consts::OS);
        assert_eq!(handshake.platform.arch, std::env::consts::ARCH);
        assert!(!handshake.execution_enabled);
        assert!(!handshake.tool_execution_enabled);
        assert!(!handshake.network_listening);
    }

    #[test]
    fn host_handshake_loads_manifest_path_when_provided() {
        let manifest_path = concat!(
            env!("CARGO_MANIFEST_DIR"),
            "/../../examples/minimal-manifest/ardyn.manifest.json"
        );

        let handshake = host_handshake(Some(manifest_path)).expect("handshake");

        assert_eq!(handshake.manifest.expect("manifest").name, "minimal-ardyn");
        assert_eq!(handshake.capabilities[0].id, "runtime.describe");
        assert!(!handshake.execution_enabled);
    }

    #[test]
    fn stdio_transport_policy_contract_defaults_are_policy_only_and_fail_closed() {
        let policy = stdio_transport_policy_contract();

        assert_eq!(policy.schema_version, ARDYN_SCHEMA_VERSION);
        assert_eq!(policy.phase, ARDYN_STDIO_TRANSPORT_POLICY_PHASE);
        assert_eq!(
            policy.implementation_status,
            PolicyImplementationStatus::PolicyOnlyPreRuntime
        );
        assert!(!policy.runtime_implementation_active);
        assert!(policy.is_pre_runtime_fail_closed());
        assert!(policy.safety.all_runtime_flags_disabled());
        assert!(!policy.safety.live_stdio_runtime);
        assert!(!policy.safety.stdin_command_loop);
        assert!(!policy.safety.live_stdio_reader);
        assert!(!policy.safety.subprocess_spawning);
        assert!(!policy.safety.adapter_calls);
        assert!(!policy.safety.locus_runtime_dependency);
        assert!(!policy.safety.content_fabric_runtime_behavior);
        assert!(!policy.safety.transcript_persistence_replay_runtime);
        assert!(!policy.safety.websocket_http_control_surface);
    }

    #[test]
    fn stdio_transport_policy_contract_assigns_future_stdio_to_rust_host() {
        let policy = stdio_transport_policy_contract();

        assert_eq!(
            policy.stdout.current_owner,
            StdioPolicyOwner::TypescriptDryRunCli
        );
        assert_eq!(
            policy.stdout.future_runtime_owner,
            StdioPolicyOwner::RustHost
        );
        assert_eq!(
            policy.stdout.reserved_for,
            StdioStreamPurpose::ValidatedSessionEventJsonlOnly
        );
        assert!(!policy.stdout.runtime_implementation_active);

        assert_eq!(
            policy.stderr.current_owner,
            StdioPolicyOwner::TypescriptDryRunCli
        );
        assert_eq!(
            policy.stderr.future_runtime_owner,
            StdioPolicyOwner::RustHost
        );
        assert_eq!(
            policy.stderr.reserved_for,
            StdioStreamPurpose::RedactedDiagnosticsOnly
        );
        assert!(!policy.stderr.runtime_implementation_active);
    }

    #[test]
    fn stdio_transport_policy_contract_pins_jsonl_and_diagnostic_framing() {
        let policy = stdio_transport_policy_contract();

        assert!(policy.jsonl_framing.utf8_only);
        assert_eq!(policy.jsonl_framing.line_ending, StdioLineEnding::LfOnly);
        assert!(!policy.jsonl_framing.crlf_allowed);
        assert!(!policy.jsonl_framing.blank_lines_allowed);
        assert!(policy.jsonl_framing.final_lf_required_for_complete_streams);
        assert!(policy.jsonl_framing.one_json_object_per_line);
        assert!(policy.jsonl_framing.validates_session_event_schema);
        assert!(policy.jsonl_framing.contiguous_sequences_required);
        assert!(!policy.jsonl_framing.duplicate_event_ids_allowed);
        assert!(!policy.jsonl_framing.partial_frames_are_events);

        assert!(policy.stderr_diagnostics.diagnostics_only);
        assert!(!policy.stderr_diagnostics.session_events_allowed_on_stderr);
        assert!(!policy.stderr_diagnostics.stdout_diagnostics_allowed);
        assert!(
            policy
                .stderr_diagnostics
                .one_diagnostic_record_per_line_before_runtime
        );
        assert!(
            policy
                .stderr_diagnostics
                .deterministic_severity_required_before_runtime
        );
        assert!(
            policy
                .stderr_diagnostics
                .deterministic_code_required_before_runtime
        );
    }

    #[test]
    fn stdio_transport_policy_contract_models_redaction_without_secret_handling() {
        let policy = stdio_transport_policy_contract();

        assert!(!policy.redaction.enforcement_active);
        assert!(policy.redaction.required_before_live_runtime);
        assert!(policy
            .redaction
            .safe_diagnostics_today
            .contains(&StderrDiagnosticClass::UsageError));
        assert!(policy
            .redaction
            .safe_diagnostics_today
            .contains(&StderrDiagnosticClass::JsonParseSummary));
        assert!(policy
            .redaction
            .must_redact_before_runtime
            .contains(&RedactionSubject::Secret));
        assert!(policy
            .redaction
            .must_redact_before_runtime
            .contains(&RedactionSubject::LocalAbsolutePath));
        assert!(policy
            .redaction
            .must_redact_before_runtime
            .contains(&RedactionSubject::EnvironmentVariable));
        assert!(!policy.redaction.stack_traces_allowed);
        assert!(!policy.redaction.environment_dumps_allowed);
        assert!(!policy.redaction.secrets_allowed);
        assert!(!policy.redaction.production_signing_keys_allowed);
    }

    #[test]
    fn stdio_transport_policy_contract_rejects_line_failures_by_default() {
        let policy = stdio_transport_policy_contract();

        for (rule, kind) in [
            (
                &policy.line_integrity.dropped_line,
                StdioLineFailureKind::DroppedLine,
            ),
            (
                &policy.line_integrity.duplicate_line,
                StdioLineFailureKind::DuplicateLine,
            ),
            (
                &policy.line_integrity.out_of_order_line,
                StdioLineFailureKind::OutOfOrderLine,
            ),
            (
                &policy.line_integrity.malformed_line,
                StdioLineFailureKind::MalformedLine,
            ),
        ] {
            assert_eq!(rule.kind, kind);
            assert!(!rule.recovery_defined);
            assert_eq!(rule.action, StdioTransportFailureAction::RejectTranscript);
        }
    }

    #[test]
    fn stdio_transport_policy_contract_pins_backpressure_partial_write_and_exit_semantics() {
        let policy = stdio_transport_policy_contract();

        assert!(!policy.backpressure.implementation_active);
        assert!(policy.backpressure.must_respect_os_pipe_backpressure);
        assert!(policy.backpressure.bounded_queue_required_before_runtime);
        assert!(!policy.backpressure.silent_event_drop_allowed);
        assert!(!policy.backpressure.autonomous_retry_loop_allowed);
        assert_eq!(
            policy.backpressure.failure_action,
            StdioTransportFailureAction::RejectAndTerminateTransport
        );

        assert!(!policy.partial_write.implementation_active);
        assert_eq!(
            policy.partial_write.smallest_commit_unit,
            StdioCommitUnit::CompleteLfTerminatedEventLine
        );
        assert!(!policy.partial_write.partial_frames_are_transcript_evidence);
        assert_eq!(
            policy.partial_write.recovery_action,
            StdioTransportFailureAction::RejectAndTerminateTransport
        );

        assert!(
            policy
                .exit_semantics
                .success_requires_complete_terminal_state
        );
        assert!(
            policy
                .exit_semantics
                .success_requires_all_committed_frames_written
        );
        assert!(policy.exit_semantics.nonzero_on_transport_failure);
        assert!(
            !policy
                .exit_semantics
                .nonzero_stdout_partial_final_line_allowed
        );
        assert!(!policy.exit_semantics.partial_event_committed_on_failure);
    }

    #[test]
    fn stdio_transport_policy_contract_keeps_transcript_replay_proposal_only() {
        let policy = stdio_transport_policy_contract();

        assert_eq!(
            policy.transcript_replay.implementation_status,
            PolicyImplementationStatus::PolicyOnlyPreRuntime
        );
        assert_eq!(
            policy.transcript_replay.preferred_input,
            TranscriptReplayInputPreference::NormalizedSessionTranscriptJson
        );
        assert_eq!(
            policy.transcript_replay.raw_jsonl_capture_role,
            RawJsonlCaptureRole::ForensicSourceOnly
        );
        assert!(
            policy
                .transcript_replay
                .compatible_with_existing_transcript_validation
        );
        assert!(!policy.transcript_replay.transcript_persistence_implemented);
        assert!(!policy.transcript_replay.replay_runtime_implemented);
        assert_eq!(policy.transcript_replay.future_cli_proposal_only.len(), 2);
        assert!(policy.transcript_replay.future_cli_proposal_only[0]
            .contains("replay-session-transcript"));
    }

    #[test]
    fn stdio_transport_policy_contract_serializes_as_contract_metadata() {
        let policy = stdio_transport_policy_contract();
        let value = serde_json::to_value(policy).expect("policy json");

        assert_eq!(value["schemaVersion"], ARDYN_SCHEMA_VERSION);
        assert_eq!(value["phase"], ARDYN_STDIO_TRANSPORT_POLICY_PHASE);
        assert_eq!(value["implementationStatus"], "policy-only-pre-runtime");
        assert_eq!(value["stdout"]["futureRuntimeOwner"], "rust-host");
        assert_eq!(
            value["stdout"]["reservedFor"],
            "validated-session-event-jsonl-only"
        );
        assert_eq!(value["stderr"]["reservedFor"], "redacted-diagnostics-only");
        assert_eq!(value["jsonlFraming"]["lineEnding"], "lf-only");
        assert_eq!(
            value["transcriptReplay"]["implementationStatus"],
            "policy-only-pre-runtime"
        );
        assert_eq!(value["safety"]["liveStdioRuntime"], false);
        assert_eq!(value["safety"]["runtimeExecutionBehavior"], false);
    }

    #[test]
    fn stdio_transport_policy_contract_detects_runtime_enabling_mutations() {
        let mut policy = stdio_transport_policy_contract();
        assert!(policy.is_pre_runtime_fail_closed());

        policy.safety.live_stdio_runtime = true;
        assert!(!policy.is_pre_runtime_fail_closed());

        let mut policy = stdio_transport_policy_contract();
        policy.stdout.runtime_implementation_active = true;
        assert!(!policy.is_pre_runtime_fail_closed());

        let mut policy = stdio_transport_policy_contract();
        policy.jsonl_framing.partial_frames_are_events = true;
        assert!(!policy.is_pre_runtime_fail_closed());

        let mut policy = stdio_transport_policy_contract();
        policy.line_integrity.duplicate_line.recovery_defined = true;
        assert!(!policy.is_pre_runtime_fail_closed());

        let mut policy = stdio_transport_policy_contract();
        policy.transcript_replay.replay_runtime_implemented = true;
        assert!(!policy.is_pre_runtime_fail_closed());
    }

    fn policy_metadata_json_value() -> serde_json::Value {
        serde_json::from_str(&stdio_transport_policy_metadata_json().expect("metadata json"))
            .expect("metadata value")
    }

    fn metadata_json_from_value(value: serde_json::Value) -> String {
        format!(
            "{}\n",
            serde_json::to_string_pretty(&value).expect("metadata value json")
        )
    }

    fn assert_policy_metadata_rejected(value: serde_json::Value, label: &str) {
        let json = metadata_json_from_value(value);
        let error = parse_stdio_transport_policy_metadata_json(&json)
            .expect_err("metadata mutation should fail closed");

        assert!(
            !error.to_string().is_empty(),
            "{label} should produce a diagnostic"
        );
    }

    fn review_record_json_from_value(value: serde_json::Value) -> String {
        format!(
            "{}\n",
            serde_json::to_string_pretty(&value).expect("review record value json")
        )
    }

    fn assert_host_policy_review_record_rejected(value: serde_json::Value, label: &str) {
        let json = review_record_json_from_value(value);
        let error = parse_host_policy_review_record_json(&json)
            .expect_err("review record mutation should fail closed");

        assert!(
            !error.to_string().is_empty(),
            "{label} should produce a diagnostic"
        );
    }

    fn approval_record_json_from_value(value: serde_json::Value) -> String {
        format!(
            "{}\n",
            serde_json::to_string_pretty(&value).expect("approval record value json")
        )
    }

    fn assert_host_policy_approval_record_rejected(value: serde_json::Value, label: &str) {
        let json = approval_record_json_from_value(value);
        let error = parse_host_policy_approval_record_json(&json)
            .expect_err("approval record mutation should fail closed");

        assert!(
            !error.to_string().is_empty(),
            "{label} should produce a diagnostic"
        );
    }

    fn transport_harness_contract_json_from_value(value: serde_json::Value) -> String {
        format!(
            "{}\n",
            serde_json::to_string_pretty(&value).expect("transport harness value json")
        )
    }

    fn assert_transport_harness_contract_rejected(value: serde_json::Value, label: &str) {
        let json = transport_harness_contract_json_from_value(value);
        let error = parse_transport_harness_contract_json(&json)
            .expect_err("transport harness mutation should fail closed");

        assert!(
            !error.to_string().is_empty(),
            "{label} should produce a diagnostic"
        );
    }

    #[test]
    fn stdio_transport_policy_metadata_json_is_deterministic_and_matches_golden_fixture() {
        let first = stdio_transport_policy_metadata_json().expect("first metadata json");
        let second = stdio_transport_policy_metadata_json().expect("second metadata json");
        let fixture = include_str!(
            "../../../tests/fixtures/host-policy/phase4-0e-stdio-transport-policy-metadata.json"
        );

        assert_eq!(first, second);
        assert_eq!(first, fixture);
        assert!(first.ends_with('\n'));
        assert!(!first.contains('\r'));
        assert!(parse_stdio_transport_policy_metadata_json(&first).is_ok());
    }

    #[test]
    fn stdio_transport_policy_metadata_top_level_field_order_is_stable() {
        let json = stdio_transport_policy_metadata_json().expect("metadata json");
        let mut previous_index = None;

        for field in stdio_transport_policy_metadata_top_level_order() {
            let needle = format!("  \"{field}\":");
            let index = json.find(&needle).expect("field should exist");

            if let Some(previous_index) = previous_index {
                assert!(
                    previous_index < index,
                    "{field} should appear after the previous field"
                );
            }

            previous_index = Some(index);
        }
    }

    #[test]
    fn stdio_transport_policy_metadata_defaults_and_review_record_mapping_are_review_only() {
        let metadata = stdio_transport_policy_metadata();
        validate_stdio_transport_policy_metadata(&metadata).expect("metadata");

        assert_eq!(
            metadata.schema,
            ARDYN_STDIO_TRANSPORT_POLICY_METADATA_SCHEMA
        );
        assert_eq!(
            metadata.schema_version,
            ARDYN_STDIO_TRANSPORT_POLICY_METADATA_VERSION
        );
        assert_eq!(
            metadata.metadata_phase,
            ARDYN_STDIO_TRANSPORT_POLICY_METADATA_PHASE
        );
        assert_eq!(metadata.contract_phase, ARDYN_STDIO_TRANSPORT_POLICY_PHASE);
        assert_eq!(
            metadata.export_status,
            PolicyMetadataExportStatus::ReviewExportOnly
        );
        assert_eq!(
            metadata.runtime_status,
            PolicyRuntimeStatus::PreRuntimePolicyOnly
        );
        assert!(metadata.review_only);
        assert_eq!(
            metadata.serialization.format,
            PolicyJsonSerializationFormat::PrettyJsonLfTerminated
        );
        assert!(metadata.serialization.final_lf_required);
        assert!(!metadata.serialization.crlf_allowed);
        assert!(metadata.policy.is_pre_runtime_fail_closed());

        let digest = stdio_transport_policy_metadata_digest_hex(&metadata).expect("digest");
        assert_eq!(digest.len(), 64);
        assert!(digest
            .bytes()
            .all(|byte| byte.is_ascii_hexdigit() && !byte.is_ascii_uppercase()));

        let review_record =
            host_policy_review_record_for_stdio_transport_policy_metadata(&metadata)
                .expect("review record");
        validate_host_policy_review_record(&review_record).expect("review record validation");

        assert_eq!(review_record.schema, ARDYN_HOST_POLICY_REVIEW_RECORD_SCHEMA);
        assert_eq!(
            review_record.record_phase,
            ARDYN_HOST_POLICY_REVIEW_RECORD_PHASE
        );
        assert_eq!(
            review_record.reviewed_phase,
            ARDYN_REVIEWED_POLICY_METADATA_PHASE_LABEL
        );
        assert_eq!(review_record.policy_metadata_schema, metadata.schema);
        assert_eq!(
            review_record.policy_metadata_version,
            metadata.schema_version
        );
        assert_eq!(review_record.policy_metadata_digest_algorithm, "sha256");
        assert_eq!(review_record.policy_metadata_digest_hex, digest);
        assert_eq!(
            review_record.policy_contract_version,
            metadata.policy.schema_version
        );
        assert_eq!(
            review_record.runtime_status,
            PolicyRuntimeStatus::PreRuntimePolicyOnly
        );
        assert_eq!(
            review_record.compatibility,
            HostPolicyReviewCompatibility::Compatible
        );
        assert_eq!(
            review_record.decision.status,
            HostPolicyReviewStatus::ReviewPending
        );
        assert!(!review_record.decision.approval_recorded);
        assert!(!review_record.decision.rejection_recorded);
        assert!(review_record.decision.review_metadata_only);
        assert!(!review_record.decision.approval_runtime_effect_allowed);
        assert!(!review_record.decision.rejection_runtime_effect_allowed);
        assert_eq!(
            review_record.diagnostics.warnings,
            host_policy_review_record_warnings()
        );
        assert!(review_record.diagnostics.errors.is_empty());
    }

    #[test]
    fn host_policy_review_record_json_is_deterministic_and_matches_golden_fixture() {
        let metadata = stdio_transport_policy_metadata();
        let first = host_policy_review_record_json_for_stdio_transport_policy_metadata(&metadata)
            .expect("first review record json");
        let second = host_policy_review_record_json_for_stdio_transport_policy_metadata(&metadata)
            .expect("second review record json");
        let fixture = include_str!(
            "../../../tests/fixtures/host-policy/phase4-0f/current-host-policy-review-record.json"
        );

        assert_eq!(first, second);
        assert_eq!(first, fixture);
        assert!(first.ends_with('\n'));
        assert!(!first.contains('\r'));
        assert!(parse_host_policy_review_record_json(&first).is_ok());
        assert_eq!(
            classify_host_policy_review_record_json(&first),
            HostPolicyReviewCompatibility::Compatible
        );
    }

    #[test]
    fn host_policy_review_record_top_level_field_order_is_stable() {
        let metadata = stdio_transport_policy_metadata();
        let json = host_policy_review_record_json_for_stdio_transport_policy_metadata(&metadata)
            .expect("review record json");
        let mut previous_index = None;

        for field in host_policy_review_record_top_level_order() {
            let needle = format!("  \"{field}\":");
            let index = json.find(&needle).expect("field should exist");

            if let Some(previous_index) = previous_index {
                assert!(
                    previous_index < index,
                    "{field} should appear after the previous field"
                );
            }

            previous_index = Some(index);
        }
    }

    #[test]
    fn host_policy_review_record_compatibility_classification_is_deterministic() {
        let cases = [
            (
                include_str!(
                    "../../../tests/fixtures/host-policy/phase4-0f/current-host-policy-review-record.json"
                ),
                HostPolicyReviewCompatibility::Compatible,
            ),
            (
                include_str!(
                    "../../../tests/fixtures/host-policy/phase4-0f/same-major-future-minor-host-policy-review-record.json"
                ),
                HostPolicyReviewCompatibility::UpgradeAvailable,
            ),
            (
                include_str!(
                    "../../../tests/fixtures/host-policy/phase4-0f/unsupported-major-host-policy-review-record.json"
                ),
                HostPolicyReviewCompatibility::UnsupportedMajor,
            ),
            (
                include_str!(
                    "../../../tests/fixtures/host-policy/phase4-0f/malformed-missing-schema-version-host-policy-review-record.json"
                ),
                HostPolicyReviewCompatibility::Malformed,
            ),
            (
                include_str!(
                    "../../../tests/fixtures/host-policy/phase4-0f/malformed-missing-policy-digest-host-policy-review-record.json"
                ),
                HostPolicyReviewCompatibility::Malformed,
            ),
            (
                include_str!(
                    "../../../tests/fixtures/host-policy/phase4-0f/malformed-permissive-approval-runtime-effect-host-policy-review-record.json"
                ),
                HostPolicyReviewCompatibility::Malformed,
            ),
            (
                include_str!(
                    "../../../tests/fixtures/host-policy/phase4-0f/rejected-permissive-policy-host-policy-review-record.json"
                ),
                HostPolicyReviewCompatibility::RejectedPolicy,
            ),
        ];

        for (json, expected) in cases {
            assert_eq!(classify_host_policy_review_record_json(json), expected);
        }
    }

    #[test]
    fn host_policy_review_record_rejects_unsupported_malformed_and_permissive_records() {
        for json in [
            include_str!(
                "../../../tests/fixtures/host-policy/phase4-0f/same-major-future-minor-host-policy-review-record.json"
            ),
            include_str!(
                "../../../tests/fixtures/host-policy/phase4-0f/unsupported-major-host-policy-review-record.json"
            ),
            include_str!(
                "../../../tests/fixtures/host-policy/phase4-0f/malformed-missing-schema-version-host-policy-review-record.json"
            ),
            include_str!(
                "../../../tests/fixtures/host-policy/phase4-0f/malformed-missing-policy-digest-host-policy-review-record.json"
            ),
            include_str!(
                "../../../tests/fixtures/host-policy/phase4-0f/malformed-permissive-approval-runtime-effect-host-policy-review-record.json"
            ),
        ] {
            assert!(parse_host_policy_review_record_json(json).is_err());
        }

        let mut current: serde_json::Value = serde_json::from_str(include_str!(
            "../../../tests/fixtures/host-policy/phase4-0f/current-host-policy-review-record.json"
        ))
        .expect("current review record");
        current["policyMetadataDigestHex"] = serde_json::Value::String("ABCDEF".to_string());
        assert_host_policy_review_record_rejected(current, "uppercase digest");

        let mut current: serde_json::Value = serde_json::from_str(include_str!(
            "../../../tests/fixtures/host-policy/phase4-0f/current-host-policy-review-record.json"
        ))
        .expect("current review record");
        current["nonExecutionInvariants"]
            .as_array_mut()
            .expect("invariants")
            .pop();
        assert_host_policy_review_record_rejected(current, "invariant drift");
    }

    #[test]
    fn host_policy_review_record_approval_fields_are_inert_review_metadata_only() {
        let metadata = stdio_transport_policy_metadata();
        let mut record = host_policy_review_record_for_stdio_transport_policy_metadata(&metadata)
            .expect("review record");

        record.decision.status = HostPolicyReviewStatus::ReviewApproved;
        record.decision.approval_recorded = true;
        validate_host_policy_review_record(&record).expect("inert approval metadata");
        assert_eq!(
            classify_host_policy_review_record_json(
                &serialize_host_policy_review_record_json(&record).expect("approved record json")
            ),
            HostPolicyReviewCompatibility::Compatible
        );
        assert!(record.decision.review_metadata_only);
        assert!(!record.decision.approval_runtime_effect_allowed);
        assert!(!record.decision.rejection_runtime_effect_allowed);

        record.decision.approval_runtime_effect_allowed = true;
        assert!(validate_host_policy_review_record(&record).is_err());
    }

    #[test]
    fn host_policy_review_record_maps_permissive_policy_metadata_to_rejected_policy() {
        let mut metadata = stdio_transport_policy_metadata();
        metadata.policy.safety.live_stdio_runtime = true;
        assert!(validate_stdio_transport_policy_metadata(&metadata).is_err());

        let record = rejected_host_policy_review_record_for_stdio_transport_policy_metadata(
            &metadata,
            vec!["policy metadata contains a runtime-permissive policy".to_string()],
        )
        .expect("rejected policy record");
        let json = serialize_host_policy_review_record_json(&record).expect("rejected record json");
        let fixture = include_str!(
            "../../../tests/fixtures/host-policy/phase4-0f/rejected-permissive-policy-host-policy-review-record.json"
        );

        assert_eq!(json, fixture);
        assert_eq!(
            record.compatibility,
            HostPolicyReviewCompatibility::RejectedPolicy
        );
        assert_eq!(
            record.decision.status,
            HostPolicyReviewStatus::ReviewRejected
        );
        assert!(!record.decision.approval_recorded);
        assert!(record.decision.rejection_recorded);
        assert!(record.decision.review_metadata_only);
        assert!(!record.decision.approval_runtime_effect_allowed);
        assert!(!record.decision.rejection_runtime_effect_allowed);
        assert_eq!(
            classify_host_policy_review_record_json(&json),
            HostPolicyReviewCompatibility::RejectedPolicy
        );
    }

    #[test]
    fn host_policy_approval_record_json_is_deterministic_and_matches_golden_fixture() {
        let first = host_policy_approval_record_json().expect("first approval record json");
        let second = host_policy_approval_record_json().expect("second approval record json");
        let fixture = include_str!(
            "../../../tests/fixtures/host-policy/phase4-1a/valid-review-only-host-policy-approval-record.json"
        );

        assert_eq!(first, second);
        assert_eq!(first, fixture);
        assert!(first.ends_with('\n'));
        assert!(!first.contains('\r'));
        assert!(parse_host_policy_approval_record_json(&first).is_ok());
        assert_eq!(
            classify_host_policy_approval_record_json(&first),
            HostPolicyApprovalRecordClassification::ValidReviewRecord
        );
    }

    #[test]
    fn host_policy_approval_record_top_level_field_order_is_stable() {
        let json = host_policy_approval_record_json().expect("approval record json");
        let mut previous_index = None;

        for field in host_policy_approval_record_top_level_order() {
            let needle = format!("  \"{field}\":");
            let index = json.find(&needle).expect("field should exist");

            if let Some(previous_index) = previous_index {
                assert!(
                    previous_index < index,
                    "{field} should appear after the previous field"
                );
            }

            previous_index = Some(index);
        }
    }

    #[test]
    fn host_policy_approval_record_classification_is_deterministic() {
        let cases = [
            (
                include_str!(
                    "../../../tests/fixtures/host-policy/phase4-1a/valid-review-only-host-policy-approval-record.json"
                ),
                HostPolicyApprovalRecordClassification::ValidReviewRecord,
            ),
            (
                include_str!(
                    "../../../tests/fixtures/host-policy/phase4-1a/missing-operator-consent-host-policy-approval-record.json"
                ),
                HostPolicyApprovalRecordClassification::MissingOperatorConsent,
            ),
            (
                include_str!(
                    "../../../tests/fixtures/host-policy/phase4-1a/denied-host-policy-approval-record.json"
                ),
                HostPolicyApprovalRecordClassification::Denied,
            ),
            (
                include_str!(
                    "../../../tests/fixtures/host-policy/phase4-1a/unsupported-major-host-policy-approval-record.json"
                ),
                HostPolicyApprovalRecordClassification::UnsupportedVersion,
            ),
            (
                include_str!(
                    "../../../tests/fixtures/host-policy/phase4-1a/malformed-missing-record-kind-host-policy-approval-record.json"
                ),
                HostPolicyApprovalRecordClassification::Malformed,
            ),
            (
                include_str!(
                    "../../../tests/fixtures/host-policy/phase4-1a/expired-not-yet-valid-host-policy-approval-record.json"
                ),
                HostPolicyApprovalRecordClassification::ExpiredOrNotYetValid,
            ),
            (
                include_str!(
                    "../../../tests/fixtures/host-policy/phase4-1a/runtime-grant-attempt-host-policy-approval-record.json"
                ),
                HostPolicyApprovalRecordClassification::RuntimeNotAvailable,
            ),
        ];

        for (json, expected) in cases {
            assert_eq!(classify_host_policy_approval_record_json(json), expected);
        }
    }

    #[test]
    fn host_policy_approval_record_rejects_fail_closed_records() {
        for json in [
            include_str!(
                "../../../tests/fixtures/host-policy/phase4-1a/missing-operator-consent-host-policy-approval-record.json"
            ),
            include_str!(
                "../../../tests/fixtures/host-policy/phase4-1a/unsupported-major-host-policy-approval-record.json"
            ),
            include_str!(
                "../../../tests/fixtures/host-policy/phase4-1a/malformed-missing-record-kind-host-policy-approval-record.json"
            ),
            include_str!(
                "../../../tests/fixtures/host-policy/phase4-1a/expired-not-yet-valid-host-policy-approval-record.json"
            ),
            include_str!(
                "../../../tests/fixtures/host-policy/phase4-1a/runtime-grant-attempt-host-policy-approval-record.json"
            ),
        ] {
            assert!(parse_host_policy_approval_record_json(json).is_err());
        }

        assert!(parse_host_policy_approval_record_json(include_str!(
            "../../../tests/fixtures/host-policy/phase4-1a/denied-host-policy-approval-record.json"
        ))
        .is_ok());

        let mut current: serde_json::Value = serde_json::from_str(include_str!(
            "../../../tests/fixtures/host-policy/phase4-1a/valid-review-only-host-policy-approval-record.json"
        ))
        .expect("current approval record");
        current["runtimeEffect"]["runtimeApprovalEffectAllowed"] = serde_json::Value::Bool(true);
        assert_host_policy_approval_record_rejected(current, "runtime approval effect");

        let mut current: serde_json::Value = serde_json::from_str(include_str!(
            "../../../tests/fixtures/host-policy/phase4-1a/valid-review-only-host-policy-approval-record.json"
        ))
        .expect("current approval record");
        current["operatorConsent"]["consentRecorded"] = serde_json::Value::Bool(false);
        assert_host_policy_approval_record_rejected(current, "missing consent");

        let mut current: serde_json::Value = serde_json::from_str(include_str!(
            "../../../tests/fixtures/host-policy/phase4-1a/valid-review-only-host-policy-approval-record.json"
        ))
        .expect("current approval record");
        current["nonExecutionInvariantSummary"]["invariants"]
            .as_array_mut()
            .expect("invariants")
            .pop();
        assert_host_policy_approval_record_rejected(current, "invariant drift");
    }

    #[test]
    fn host_policy_approval_record_operator_consent_is_necessary_but_not_sufficient() {
        let record = host_policy_approval_record();

        validate_host_policy_approval_record(&record).expect("approval record");
        assert!(record.operator_consent.consent_recorded);
        assert!(record.operator_consent.process_stdio_ownership_consent);
        assert!(record.operator_consent.stdin_lifecycle_control_consent);
        assert!(record.operator_consent.stdout_jsonl_ownership_consent);
        assert!(record.operator_consent.stderr_diagnostics_ownership_consent);
        assert!(record.operator_consent.process_termination_control_consent);
        assert!(
            record
                .operator_consent
                .transcript_persistence_review_consent
        );
        assert!(
            record
                .operator_consent
                .failure_audit_record_emission_consent
        );
        assert!(
            record
                .runtime_effect
                .operator_consent_necessary_but_not_sufficient
        );
        assert!(!record.runtime_effect.current_record_enables_runtime);
        assert!(!record.runtime_effect.runtime_approval_effect_allowed);
        assert!(!record.runtime_effect.runtime_implementation_available);
        assert!(!record.runtime_effect.runtime_command_available);
        assert!(
            !record
                .runtime_capability_request
                .runtime_implementation_available
        );
        assert!(!record.runtime_capability_request.serve_runtime_available);
        assert!(!record.runtime_capability_request.stdio_runtime_available);

        let mut missing_consent = record.clone();
        missing_consent.operator_consent.consent_recorded = false;
        missing_consent.classification =
            HostPolicyApprovalRecordClassification::MissingOperatorConsent;
        missing_consent.denial.fail_closed_reasons = vec!["missing_operator_consent".to_string()];
        assert_eq!(
            classify_host_policy_approval_record(&missing_consent),
            HostPolicyApprovalRecordClassification::MissingOperatorConsent
        );
        assert!(validate_host_policy_approval_record(&missing_consent).is_err());

        let mut runtime_grant = record;
        runtime_grant.runtime_effect.current_record_enables_runtime = true;
        runtime_grant.runtime_effect.runtime_approval_effect_allowed = true;
        runtime_grant.classification = HostPolicyApprovalRecordClassification::RuntimeNotAvailable;
        runtime_grant.denial.fail_closed_reasons = vec![
            "runtime_not_available".to_string(),
            "runtime_effect_flag_true".to_string(),
        ];
        assert_eq!(
            classify_host_policy_approval_record(&runtime_grant),
            HostPolicyApprovalRecordClassification::RuntimeNotAvailable
        );
        assert!(validate_host_policy_approval_record(&runtime_grant).is_err());
    }

    #[test]
    fn denied_host_policy_approval_record_json_is_static_review_metadata() {
        let json = denied_host_policy_approval_record_json("operator denied runtime request")
            .expect("denied approval record json");
        let fixture = include_str!(
            "../../../tests/fixtures/host-policy/phase4-1a/denied-host-policy-approval-record.json"
        );
        let record = parse_host_policy_approval_record_json(&json)
            .expect("denied approval record remains parseable review metadata");

        assert_eq!(json, fixture);
        assert_eq!(
            record.approval_status,
            HostPolicyApprovalStatus::ReviewDenied
        );
        assert_eq!(
            record.classification,
            HostPolicyApprovalRecordClassification::Denied
        );
        assert!(!record.runtime_effect.current_record_enables_runtime);
        assert!(!record.runtime_effect.runtime_approval_effect_allowed);
        assert!(!record.audit.runs_runtime);
        assert_eq!(
            classify_host_policy_approval_record_json(&json),
            HostPolicyApprovalRecordClassification::Denied
        );
    }

    #[test]
    fn transport_harness_contract_json_is_deterministic_and_matches_golden_fixture() {
        let first = transport_harness_contract_json().expect("first transport harness json");
        let second = transport_harness_contract_json().expect("second transport harness json");
        let fixture = include_str!(
            "../../../tests/fixtures/host-policy/phase4-1b/valid-static-transport-harness-contract.json"
        );

        assert_eq!(first, second);
        assert_eq!(first, fixture);
        assert!(first.ends_with('\n'));
        assert!(!first.contains('\r'));
        assert!(parse_transport_harness_contract_json(&first).is_ok());
        assert_eq!(
            classify_transport_harness_contract_json(&first),
            TransportHarnessContractClassification::StaticContractOnly
        );
    }

    #[test]
    fn transport_harness_contract_top_level_field_order_is_stable() {
        let json = transport_harness_contract_json().expect("transport harness json");
        let mut previous_index = None;

        for field in transport_harness_contract_top_level_order() {
            let needle = format!("\n  \"{field}\":");
            let index = json.find(&needle).expect("field should exist");

            if let Some(previous_index) = previous_index {
                assert!(
                    previous_index < index,
                    "{field} should appear after the previous field"
                );
            }

            previous_index = Some(index);
        }
    }

    #[test]
    fn transport_harness_contract_classification_is_deterministic() {
        let cases = [
            (
                include_str!(
                    "../../../tests/fixtures/host-policy/phase4-1b/valid-static-transport-harness-contract.json"
                ),
                TransportHarnessContractClassification::StaticContractOnly,
            ),
            (
                include_str!(
                    "../../../tests/fixtures/host-policy/phase4-1b/missing-approval-reference-transport-harness-contract.json"
                ),
                TransportHarnessContractClassification::ApprovalMissing,
            ),
            (
                include_str!(
                    "../../../tests/fixtures/host-policy/phase4-1b/missing-policy-metadata-reference-transport-harness-contract.json"
                ),
                TransportHarnessContractClassification::PolicyMetadataMissing,
            ),
            (
                include_str!(
                    "../../../tests/fixtures/host-policy/phase4-1b/missing-redaction-policy-reference-transport-harness-contract.json"
                ),
                TransportHarnessContractClassification::RedactionPolicyMissing,
            ),
            (
                include_str!(
                    "../../../tests/fixtures/host-policy/phase4-1b/missing-transcript-audit-policy-reference-transport-harness-contract.json"
                ),
                TransportHarnessContractClassification::TranscriptPolicyMissing,
            ),
            (
                include_str!(
                    "../../../tests/fixtures/host-policy/phase4-1b/unsupported-major-transport-harness-contract.json"
                ),
                TransportHarnessContractClassification::UnsupportedVersion,
            ),
            (
                include_str!(
                    "../../../tests/fixtures/host-policy/phase4-1b/malformed-missing-contract-kind-transport-harness-contract.json"
                ),
                TransportHarnessContractClassification::Malformed,
            ),
            (
                include_str!(
                    "../../../tests/fixtures/host-policy/phase4-1b/runtime-available-attempt-transport-harness-contract.json"
                ),
                TransportHarnessContractClassification::RuntimeUnavailable,
            ),
        ];

        for (json, expected) in cases {
            assert_eq!(classify_transport_harness_contract_json(json), expected);
        }
    }

    #[test]
    fn transport_harness_contract_rejects_fail_closed_records() {
        for json in [
            include_str!(
                "../../../tests/fixtures/host-policy/phase4-1b/missing-approval-reference-transport-harness-contract.json"
            ),
            include_str!(
                "../../../tests/fixtures/host-policy/phase4-1b/missing-policy-metadata-reference-transport-harness-contract.json"
            ),
            include_str!(
                "../../../tests/fixtures/host-policy/phase4-1b/missing-redaction-policy-reference-transport-harness-contract.json"
            ),
            include_str!(
                "../../../tests/fixtures/host-policy/phase4-1b/missing-transcript-audit-policy-reference-transport-harness-contract.json"
            ),
            include_str!(
                "../../../tests/fixtures/host-policy/phase4-1b/unsupported-major-transport-harness-contract.json"
            ),
            include_str!(
                "../../../tests/fixtures/host-policy/phase4-1b/malformed-missing-contract-kind-transport-harness-contract.json"
            ),
            include_str!(
                "../../../tests/fixtures/host-policy/phase4-1b/runtime-available-attempt-transport-harness-contract.json"
            ),
        ] {
            assert!(parse_transport_harness_contract_json(json).is_err());
        }

        let mut current: serde_json::Value = serde_json::from_str(include_str!(
            "../../../tests/fixtures/host-policy/phase4-1b/valid-static-transport-harness-contract.json"
        ))
        .expect("current harness contract");
        current["runtimeEffect"]["currentContractEnablesRuntime"] = serde_json::Value::Bool(true);
        assert_transport_harness_contract_rejected(current, "runtime effect");

        let mut current: serde_json::Value = serde_json::from_str(include_str!(
            "../../../tests/fixtures/host-policy/phase4-1b/valid-static-transport-harness-contract.json"
        ))
        .expect("current harness contract");
        current["approvalRecordReference"]["present"] = serde_json::Value::Bool(false);
        current["classification"] = serde_json::Value::String("approval_missing".to_string());
        assert_transport_harness_contract_rejected(current, "missing approval reference");

        let mut current: serde_json::Value = serde_json::from_str(include_str!(
            "../../../tests/fixtures/host-policy/phase4-1b/valid-static-transport-harness-contract.json"
        ))
        .expect("current harness contract");
        current["nonExecutionInvariantSummary"]["invariants"]
            .as_array_mut()
            .expect("invariants")
            .pop();
        assert_transport_harness_contract_rejected(current, "invariant drift");
    }

    #[test]
    fn transport_harness_contract_references_are_necessary_but_not_sufficient() {
        let record = transport_harness_contract();

        validate_transport_harness_contract(&record).expect("transport harness contract");
        assert!(record.approval_record_reference.required);
        assert!(record.approval_record_reference.present);
        assert!(record.approval_record_reference.operator_consent_required);
        assert!(
            !record
                .approval_record_reference
                .approval_record_grants_runtime
        );
        assert!(record.policy_metadata_reference.required);
        assert!(record.policy_metadata_reference.present);
        assert!(record.stderr_redaction_policy_reference.required);
        assert!(record.stderr_redaction_policy_reference.present);
        assert!(record.transcript_audit_output_policy_reference.required);
        assert!(record.transcript_audit_output_policy_reference.present);
        assert!(!record.runtime_availability.runtime_available);
        assert!(!record.runtime_availability.serve_runtime_available);
        assert!(!record.runtime_availability.stdio_runtime_available);
        assert!(
            !record
                .runtime_availability
                .process_stdio_ownership_available
        );
        assert!(!record.runtime_availability.stdin_reader_available);
        assert!(!record.runtime_effect.current_contract_enables_runtime);
        assert!(!record.runtime_effect.runtime_implementation_available);
        assert!(!record.runtime_effect.runtime_command_available);
        assert!(!record.runtime_effect.process_stdio_ownership_available);
        assert!(!record.runtime_effect.stdin_reader_available);
        assert!(!record.runtime_effect.stdout_writer_available);
        assert!(!record.runtime_effect.stderr_writer_available);
        assert!(
            record
                .runtime_effect
                .approval_record_necessary_but_not_sufficient
        );
        assert!(
            record
                .runtime_effect
                .requires_separate_runtime_implementation_approval
        );
        assert!(
            record
                .runtime_effect
                .requires_devin_review_before_enablement
        );

        let mut runtime_attempt = record;
        runtime_attempt.runtime_availability.runtime_available = true;
        runtime_attempt.runtime_availability.stdio_runtime_available = true;
        runtime_attempt
            .runtime_effect
            .current_contract_enables_runtime = true;
        runtime_attempt
            .runtime_effect
            .runtime_implementation_available = true;
        runtime_attempt.runtime_effect.runtime_command_available = true;
        runtime_attempt
            .approval_record_reference
            .approval_record_grants_runtime = true;
        runtime_attempt.classification = TransportHarnessContractClassification::RuntimeUnavailable;
        assert_eq!(
            classify_transport_harness_contract(&runtime_attempt),
            TransportHarnessContractClassification::RuntimeUnavailable
        );
        assert!(validate_transport_harness_contract(&runtime_attempt).is_err());
    }

    #[test]
    fn stdio_transport_policy_metadata_rejects_unknown_and_unsupported_versions() {
        let mut value = policy_metadata_json_value();
        value["schemaVersion"] = serde_json::Value::String("9.9.9".to_string());
        assert_policy_metadata_rejected(value, "unknown metadata version");

        let mut value = policy_metadata_json_value();
        value["policy"]["schemaVersion"] = serde_json::Value::String("9.9.9".to_string());
        assert_policy_metadata_rejected(value, "unknown policy version");

        let mut value = policy_metadata_json_value();
        value["metadataPhase"] = serde_json::Value::String("phase-4.1-runtime".to_string());
        assert_policy_metadata_rejected(value, "unsupported metadata phase");
    }

    #[test]
    fn stdio_transport_policy_metadata_rejects_missing_or_malformed_fields() {
        let mut value = policy_metadata_json_value();
        value
            .as_object_mut()
            .expect("metadata object")
            .remove("policy");
        assert_policy_metadata_rejected(value, "missing policy");

        let invalid_json = "{ invalid metadata\n";
        assert!(parse_stdio_transport_policy_metadata_json(invalid_json).is_err());

        let crlf_json = stdio_transport_policy_metadata_json()
            .expect("metadata json")
            .replace('\n', "\r\n");
        assert!(parse_stdio_transport_policy_metadata_json(&crlf_json).is_err());
    }

    #[test]
    fn stdio_transport_policy_metadata_rejects_invalid_stdio_ownership_values() {
        let mut value = policy_metadata_json_value();
        value["policy"]["stdout"]["currentOwner"] =
            serde_json::Value::String("live-runtime".to_string());
        assert_policy_metadata_rejected(value, "invalid stdout owner");

        let mut value = policy_metadata_json_value();
        value["policy"]["stderr"]["futureRuntimeOwner"] =
            serde_json::Value::String("typescript-runtime-loop".to_string());
        assert_policy_metadata_rejected(value, "invalid stderr owner");
    }

    #[test]
    fn stdio_transport_policy_metadata_rejects_permissive_live_runtime_modes() {
        let mut value = policy_metadata_json_value();
        value["reviewOnly"] = serde_json::Value::Bool(false);
        assert_policy_metadata_rejected(value, "review-only disabled");

        let mut value = policy_metadata_json_value();
        value["policy"]["runtimeImplementationActive"] = serde_json::Value::Bool(true);
        assert_policy_metadata_rejected(value, "runtime implementation active");

        let mut value = policy_metadata_json_value();
        value["policy"]["safety"]["liveStdioRuntime"] = serde_json::Value::Bool(true);
        assert_policy_metadata_rejected(value, "live stdio runtime");

        let mut value = policy_metadata_json_value();
        value["futureHostPolicyReviewRecord"]["approvalRuntimeEffectAllowed"] =
            serde_json::Value::Bool(true);
        assert_policy_metadata_rejected(value, "approval runtime effect");
    }

    #[test]
    fn stdio_transport_policy_metadata_rejects_malformed_redaction_line_and_exit_policy() {
        let mut value = policy_metadata_json_value();
        value["policy"]["redaction"]["secretsAllowed"] = serde_json::Value::Bool(true);
        assert_policy_metadata_rejected(value, "malformed redaction policy");

        let mut value = policy_metadata_json_value();
        value["policy"]["redaction"]["safeDiagnosticsToday"]
            .as_array_mut()
            .expect("safe diagnostics")
            .remove(0);
        assert_policy_metadata_rejected(value, "redaction category drift");

        let mut value = policy_metadata_json_value();
        value["policy"]["lineIntegrity"]["duplicateLine"]["recoveryDefined"] =
            serde_json::Value::Bool(true);
        assert_policy_metadata_rejected(value, "malformed line-integrity policy");

        let mut value = policy_metadata_json_value();
        value["policy"]["lineIntegrity"]["droppedLine"]["kind"] =
            serde_json::Value::String("duplicate-line".to_string());
        assert_policy_metadata_rejected(value, "line-integrity kind drift");

        let mut value = policy_metadata_json_value();
        value["policy"]["exitSemantics"]["nonzeroOnTransportFailure"] =
            serde_json::Value::Bool(false);
        assert_policy_metadata_rejected(value, "malformed exit semantics");

        let mut value = policy_metadata_json_value();
        value["policy"]["transcriptReplay"]["futureCliProposalOnly"]
            .as_array_mut()
            .expect("replay proposals")
            .push(serde_json::Value::String(
                "ardyn replay-session-transcript --execute".to_string(),
            ));
        assert_policy_metadata_rejected(value, "transcript replay proposal drift");
    }

    #[test]
    fn load_manifest_path_rejects_invalid_schema_version() {
        let manifest = r#"{
            "schemaVersion": "9.9.9",
            "name": "invalid-version",
            "version": "0.1.0",
            "runtime": { "host": "rust", "core": "typescript" },
            "capabilities": [
                {
                    "id": "runtime.describe",
                    "kind": "tool",
                    "description": "Describe runtime metadata.",
                    "permissions": [
                        { "scope": "registry", "access": "read" }
                    ]
                }
            ]
        }"#;

        let path = write_temp_manifest(manifest);
        let error =
            load_manifest_path(path.to_str().expect("manifest path")).expect_err("schema version");
        std::fs::remove_file(path).expect("remove manifest");

        assert!(error.to_string().contains("schemaVersion"));
    }

    #[test]
    fn load_manifest_path_rejects_empty_capabilities() {
        let manifest = r#"{
            "schemaVersion": "0.1.0",
            "name": "empty-capabilities",
            "version": "0.1.0",
            "runtime": { "host": "rust", "core": "typescript" },
            "capabilities": []
        }"#;

        let path = write_temp_manifest(manifest);
        let error = load_manifest_path(path.to_str().expect("manifest path"))
            .expect_err("empty capabilities");
        std::fs::remove_file(path).expect("remove manifest");

        assert!(error.to_string().contains("capabilities"));
    }

    fn valid_task_with_objective(objective: String) -> ArdynTask {
        ArdynTask {
            id: "task_01".to_string(),
            objective,
            mode: TaskMode::DryRun,
            requested_capabilities: vec!["runtime.describe".to_string()],
            constraints: None,
            inputs: None,
            metadata: None,
        }
    }

    fn valid_manifest_with_capability_description(description: String) -> ArdynManifest {
        ArdynManifest {
            schema_version: ARDYN_SCHEMA_VERSION.to_string(),
            name: "valid-manifest".to_string(),
            version: "0.1.0".to_string(),
            description: None,
            runtime: ArdynRuntime {
                host: RuntimeHost::Rust,
                core: RuntimeCore::Typescript,
                entrypoint: None,
            },
            capabilities: vec![ArdynCapability {
                id: "runtime.describe".to_string(),
                kind: CapabilityKind::Tool,
                description,
                permissions: vec![ArdynPermission {
                    scope: PermissionScope::Registry,
                    access: PermissionAccess::Read,
                    reason: None,
                }],
            }],
            adapters: None,
            policies: None,
        }
    }

    #[test]
    fn validate_task_accepts_multibyte_objective_at_schema_boundary() {
        let task = valid_task_with_objective("é".repeat(4000));

        validate_task(&task).expect("4000 character objective should pass");
    }

    #[test]
    fn validate_task_rejects_multibyte_objective_beyond_schema_boundary() {
        let task = valid_task_with_objective("é".repeat(4001));

        let error = validate_task(&task).expect_err("4001 character objective should fail");

        assert!(error.to_string().contains("objective"));
    }

    #[test]
    fn validate_manifest_accepts_multibyte_capability_description_at_schema_boundary() {
        let manifest = valid_manifest_with_capability_description("é".repeat(280));

        validate_manifest(&manifest).expect("280 character capability description should pass");
    }

    #[test]
    fn validate_manifest_rejects_multibyte_capability_description_beyond_schema_boundary() {
        let manifest = valid_manifest_with_capability_description("é".repeat(281));

        let error = validate_manifest(&manifest)
            .expect_err("281 character capability description should fail");

        assert!(error.to_string().contains("description"));
    }

    #[test]
    fn validate_task_rejects_invalid_constraint_bounds() {
        let task = ArdynTask {
            id: "task_01".to_string(),
            objective: "Describe runtime metadata without executing tools.".to_string(),
            mode: TaskMode::DryRun,
            requested_capabilities: vec!["runtime.describe".to_string()],
            constraints: Some(ArdynTaskConstraints {
                require_human_approval: Some(true),
                allow_network: Some(false),
                max_steps: Some(1001),
                workspace_root: None,
            }),
            inputs: None,
            metadata: None,
        };

        let error = validate_task(&task).expect_err("maxSteps should fail");

        assert!(error.to_string().contains("maxSteps"));
    }

    #[test]
    fn fabric_sha256_hex_matches_content_fabric_fixture_payload() {
        let digest = fabric_sha256_hex(
            b"Hello from Locus Content Fabric cross-implementation fixture v1.\n",
        );

        assert_eq!(
            digest,
            "7cb83d246d67fa50abea10b3fd1a21d97c690bcd2d16ad28cef5c26f6cc27945"
        );
    }

    #[test]
    fn fabric_path_confinement_rejects_escape_paths() {
        for candidate in [
            "../secret.txt",
            "payload/../secret.txt",
            "/absolute/file.txt",
            "\\absolute\\file.txt",
            "payload\\file.txt",
            "C:/temp/file.txt",
            "C:\\temp\\file.txt",
            "payload//file.txt",
            "payload/./file.txt",
        ] {
            assert!(
                fabric_path_confinement_error(candidate).is_some(),
                "{candidate} should be rejected"
            );
        }

        assert!(fabric_path_confinement_error("payload/hello.txt").is_none());
    }
}
