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
            safe_diagnostics_today: vec![
                StderrDiagnosticClass::UsageError,
                StderrDiagnosticClass::UnknownDuplicateOrMissingArgument,
                StderrDiagnosticClass::LocalPathPolicyLabel,
                StderrDiagnosticClass::UnreadableLocalFile,
                StderrDiagnosticClass::JsonParseSummary,
                StderrDiagnosticClass::SchemaValidationSummary,
            ],
            must_redact_before_runtime: vec![
                RedactionSubject::Secret,
                RedactionSubject::ProductionSigningKey,
                RedactionSubject::TokenOrCredential,
                RedactionSubject::LocalAbsolutePath,
                RedactionSubject::EnvironmentVariable,
                RedactionSubject::StackTrace,
                RedactionSubject::RawJsonParseExcerpt,
                RedactionSubject::SchemaValidationValue,
            ],
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
            future_cli_proposal_only: vec![
                "ardyn replay-session-transcript --file <session-transcript.json> --summary"
                    .to_string(),
                "ardyn replay-session-transcript --file <session-transcript.json> --explain"
                    .to_string(),
            ],
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
