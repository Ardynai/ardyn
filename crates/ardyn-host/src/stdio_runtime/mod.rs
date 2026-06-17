//! Deliberately blocked Rust-host stdio runtime skeleton.
//!
//! Phase 4.2A and 4.2B are library-only planning code. They classify
//! fixture-shaped frames, record unavailable lifecycle hooks, plan blocked
//! lifecycle/failure-audit/transcript outcomes, and always return blocked
//! results. They do not own process streams, control processes, evaluate
//! approval, call adapters, or expose a command surface.

#![allow(dead_code)]

use crate::{
    classify_host_policy_approval_record_json, classify_stdio_runtime_contract_gates,
    classify_stdio_runtime_input_stream, parse_stdio_runtime_input_frame_json,
    stdio_runtime_contract_gates, stdio_runtime_error_category_for_frame_class,
    stdio_runtime_stderr_diagnostic_for_error, stdio_runtime_stdout_frame_for_input,
    validate_stdio_runtime_contract_gates, HostPolicyApprovalRecordClassification,
    StdioRuntimeContractGateBundle, StdioRuntimeContractGateBundleClassification,
    StdioRuntimeFrameClass, StdioRuntimeInputFrame, StdioRuntimeStderrDiagnostic,
    StdioRuntimeStdoutFrame,
};
use serde::{Deserialize, Serialize};

pub const BLOCKED_STDIO_RUNTIME_SKELETON_PHASE: &str = "phase-4.2a-blocked-stdio-runtime-skeleton";
pub const BLOCKED_STDIO_RUNTIME_LIFECYCLE_FAILURE_AUDIT_PHASE: &str =
    "phase-4.2b-blocked-lifecycle-failure-audit-skeleton";
pub const GUARDED_STDIO_RUNTIME_IMPLEMENTATION_SLICE_PHASE: &str =
    "phase-5.2-guarded-runtime-implementation-slice";
pub const BLOCKED_STDIO_RUNTIME_SKELETON_ERROR_CODE: &str = "runtime_unavailable";
pub const BLOCKED_STDIO_RUNTIME_SKELETON_ERROR_MESSAGE: &str =
    "Phase 4.2A stdio runtime skeleton is deliberately blocked and cannot execute.";
pub const BLOCKED_STDIO_RUNTIME_LIFECYCLE_ERROR_MESSAGE: &str =
    "Phase 4.2B lifecycle and failure-audit skeleton is deliberately blocked and cannot control processes.";
pub const GUARDED_STDIO_RUNTIME_LOOP_MAX_FRAMES: u64 = 8;

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum StdioRuntimeSkeletonStatus {
    RuntimeUnavailable,
    FrameRejected,
    GateBlocked,
    ApprovalBlocked,
    StartBlocked,
    StopBlocked,
    KillBlocked,
    ExecutionBlocked,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum StdioRuntimeSkeletonBlockReason {
    RuntimeUnavailable,
    FrameRejected,
    GateMissingOrRejected,
    ApprovalUnavailable,
    StartUnavailable,
    StopUnavailable,
    KillUnavailable,
    ExecutionUnavailable,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum StdioRuntimePlannedWriterStream {
    Stdout,
    Stderr,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum StdioRuntimeLifecycleAction {
    Start,
    Stop,
    Kill,
    Execute,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum StdioRuntimeLifecycleStateKind {
    NotStarted,
    StartBlocked,
    StopBlocked,
    KillBlocked,
    ExecuteBlocked,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
#[allow(clippy::enum_variant_names)]
pub enum StdioRuntimeFailureAuditCategory {
    RuntimeUnavailable,
    LifecycleUnavailable,
    ProcessControlUnavailable,
    TranscriptPersistenceUnavailable,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum StdioRuntimeLifecycleHookKind {
    SessionState,
    FramePlanning,
    DiagnosticPlanning,
    TranscriptHook,
    FailureAuditHook,
    CleanupHook,
    TerminalState,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct StdioRuntimeLifecycleHookPlaceholder {
    pub hook: StdioRuntimeLifecycleHookKind,
    pub planned_only: bool,
    pub runtime_available: bool,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct StdioRuntimeSkeletonState {
    pub phase: String,
    pub runtime_available: bool,
    pub execution_available: bool,
    pub approval_grants_available: bool,
    pub process_control_available: bool,
    pub live_streams_available: bool,
    pub lifecycle_hooks: Vec<StdioRuntimeLifecycleHookPlaceholder>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct StdioRuntimeUnavailableError {
    pub code: String,
    pub phase: String,
    pub message: String,
    pub reason: StdioRuntimeSkeletonBlockReason,
    pub runtime_available: bool,
    pub retryable_in_this_phase: bool,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct StdioRuntimeFramePlan {
    pub phase: String,
    pub frame_class: StdioRuntimeFrameClass,
    pub accepted_static_probe: bool,
    pub input_bytes: u64,
    pub planned_frame_count: u64,
    pub planned_event_ids: Vec<String>,
    pub planned_stdout_frames: Vec<StdioRuntimeStdoutFrame>,
    pub diagnostic: Option<StdioRuntimeStderrDiagnostic>,
    pub runtime_enabled: bool,
    pub approval_granted: bool,
    pub execution_allowed: bool,
    pub block_reason: StdioRuntimeSkeletonBlockReason,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct StdioRuntimeGatePlan {
    pub phase: String,
    pub classification: StdioRuntimeContractGateBundleClassification,
    pub valid_contract_gates: bool,
    pub blocked_gate_ids: Vec<String>,
    pub runtime_available: bool,
    pub approval_granted: bool,
    pub execution_allowed: bool,
    pub block_reason: StdioRuntimeSkeletonBlockReason,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct StdioRuntimeTranscriptPlan {
    pub planned_only: bool,
    pub transcript_persistence_available: bool,
    pub replay_available: bool,
    pub planned_record_ids: Vec<String>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct StdioRuntimeFailureAuditPlan {
    pub planned_only: bool,
    pub category: StdioRuntimeFailureAuditCategory,
    pub deterministic_code: String,
    pub runtime_effect_recorded: bool,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct StdioRuntimeKillSemanticsPlan {
    pub planned_only: bool,
    pub process_identifier_available: bool,
    pub graceful_stop_available: bool,
    pub forced_termination_available: bool,
    pub signal_available: bool,
    pub terminal_state_required: bool,
    pub termination_effect_performed: bool,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct StdioRuntimeLifecycleTransitionPlan {
    pub phase: String,
    pub action: StdioRuntimeLifecycleAction,
    pub from_state: StdioRuntimeLifecycleStateKind,
    pub to_state: StdioRuntimeLifecycleStateKind,
    pub status: StdioRuntimeSkeletonStatus,
    pub block_reason: StdioRuntimeSkeletonBlockReason,
    pub transcript_plan: StdioRuntimeTranscriptPlan,
    pub failure_audit_plan: StdioRuntimeFailureAuditPlan,
    pub kill_semantics_plan: Option<StdioRuntimeKillSemanticsPlan>,
    pub runtime_available: bool,
    pub lifecycle_available: bool,
    pub execution_allowed: bool,
    pub process_started: bool,
    pub process_stopped: bool,
    pub process_killed: bool,
    pub signal_sent: bool,
    pub process_polled: bool,
    pub process_waited: bool,
    pub stdin_read: bool,
    pub stdout_written: bool,
    pub stderr_written: bool,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct BlockedStdioRuntimeEntrypointResult {
    pub phase: String,
    pub status: StdioRuntimeSkeletonStatus,
    pub state: StdioRuntimeSkeletonState,
    pub frame_plan: Option<StdioRuntimeFramePlan>,
    pub gate_plan: StdioRuntimeGatePlan,
    pub lifecycle_plan: Option<StdioRuntimeLifecycleTransitionPlan>,
    pub error: StdioRuntimeUnavailableError,
    pub executed: bool,
    pub runtime_enabled: bool,
    pub approval_granted: bool,
    pub stdout_written: bool,
    pub stderr_written: bool,
    pub process_control_used: bool,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct GuardedStdioRuntimeLoopBudget {
    pub max_input_bytes: u64,
    pub max_frames: u64,
    pub live_stdin_available: bool,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct GuardedStdioRuntimeLoopPlan {
    pub phase: String,
    pub budget: GuardedStdioRuntimeLoopBudget,
    pub input_bytes: u64,
    pub planned_iterations: u64,
    pub frame_plans: Vec<StdioRuntimeFramePlan>,
    pub budget_exceeded: bool,
    pub stdin_read: bool,
    pub runtime_available: bool,
    pub execution_allowed: bool,
    pub block_reason: StdioRuntimeSkeletonBlockReason,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct GuardedStdioRuntimeRedactedWriterPlan {
    pub phase: String,
    pub stream: StdioRuntimePlannedWriterStream,
    pub planned_only: bool,
    pub live_writer_available: bool,
    pub requested_frame_count: u64,
    pub planned_frame_count: u64,
    pub redaction_applied: bool,
    pub raw_payload_retained: bool,
    pub stream_written: bool,
    pub planned_lines: Vec<String>,
    pub block_reason: StdioRuntimeSkeletonBlockReason,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct GuardedStdioRuntimeApprovalBoundaryPlan {
    pub phase: String,
    pub classification: HostPolicyApprovalRecordClassification,
    pub fixture_evidence_satisfied: bool,
    pub approval_boundary_satisfied: bool,
    pub approval_evaluator_available: bool,
    pub approval_granted: bool,
    pub runtime_available: bool,
    pub execution_allowed: bool,
    pub block_reason: StdioRuntimeSkeletonBlockReason,
}

impl StdioRuntimeSkeletonState {
    pub fn all_runtime_paths_blocked(&self) -> bool {
        !self.runtime_available
            && !self.execution_available
            && !self.approval_grants_available
            && !self.process_control_available
            && !self.live_streams_available
            && self
                .lifecycle_hooks
                .iter()
                .all(|hook| hook.planned_only && !hook.runtime_available)
    }
}

impl BlockedStdioRuntimeEntrypointResult {
    pub fn all_effects_blocked(&self) -> bool {
        self.state.all_runtime_paths_blocked()
            && !self.executed
            && !self.runtime_enabled
            && !self.approval_granted
            && !self.stdout_written
            && !self.stderr_written
            && !self.process_control_used
            && !self.gate_plan.runtime_available
            && !self.gate_plan.approval_granted
            && !self.gate_plan.execution_allowed
            && self
                .lifecycle_plan
                .as_ref()
                .map(|plan| plan.all_effects_blocked())
                .unwrap_or(true)
            && !self.error.runtime_available
    }
}

impl StdioRuntimeLifecycleTransitionPlan {
    pub fn all_effects_blocked(&self) -> bool {
        !self.runtime_available
            && !self.lifecycle_available
            && !self.execution_allowed
            && !self.process_started
            && !self.process_stopped
            && !self.process_killed
            && !self.signal_sent
            && !self.process_polled
            && !self.process_waited
            && !self.stdin_read
            && !self.stdout_written
            && !self.stderr_written
            && self.transcript_plan.planned_only
            && !self.transcript_plan.transcript_persistence_available
            && !self.transcript_plan.replay_available
            && self.failure_audit_plan.planned_only
            && !self.failure_audit_plan.runtime_effect_recorded
            && self
                .kill_semantics_plan
                .as_ref()
                .map(|plan| {
                    plan.planned_only
                        && !plan.process_identifier_available
                        && !plan.graceful_stop_available
                        && !plan.forced_termination_available
                        && !plan.signal_available
                        && plan.terminal_state_required
                        && !plan.termination_effect_performed
                })
                .unwrap_or(true)
    }
}

pub fn stdio_runtime_skeleton_state() -> StdioRuntimeSkeletonState {
    StdioRuntimeSkeletonState {
        phase: BLOCKED_STDIO_RUNTIME_SKELETON_PHASE.to_string(),
        runtime_available: false,
        execution_available: false,
        approval_grants_available: false,
        process_control_available: false,
        live_streams_available: false,
        lifecycle_hooks: vec![
            StdioRuntimeLifecycleHookPlaceholder {
                hook: StdioRuntimeLifecycleHookKind::SessionState,
                planned_only: true,
                runtime_available: false,
            },
            StdioRuntimeLifecycleHookPlaceholder {
                hook: StdioRuntimeLifecycleHookKind::FramePlanning,
                planned_only: true,
                runtime_available: false,
            },
            StdioRuntimeLifecycleHookPlaceholder {
                hook: StdioRuntimeLifecycleHookKind::DiagnosticPlanning,
                planned_only: true,
                runtime_available: false,
            },
            StdioRuntimeLifecycleHookPlaceholder {
                hook: StdioRuntimeLifecycleHookKind::TranscriptHook,
                planned_only: true,
                runtime_available: false,
            },
            StdioRuntimeLifecycleHookPlaceholder {
                hook: StdioRuntimeLifecycleHookKind::FailureAuditHook,
                planned_only: true,
                runtime_available: false,
            },
            StdioRuntimeLifecycleHookPlaceholder {
                hook: StdioRuntimeLifecycleHookKind::CleanupHook,
                planned_only: true,
                runtime_available: false,
            },
            StdioRuntimeLifecycleHookPlaceholder {
                hook: StdioRuntimeLifecycleHookKind::TerminalState,
                planned_only: true,
                runtime_available: false,
            },
        ],
    }
}

pub fn stdio_runtime_unavailable_error(
    reason: StdioRuntimeSkeletonBlockReason,
) -> StdioRuntimeUnavailableError {
    StdioRuntimeUnavailableError {
        code: BLOCKED_STDIO_RUNTIME_SKELETON_ERROR_CODE.to_string(),
        phase: BLOCKED_STDIO_RUNTIME_SKELETON_PHASE.to_string(),
        message: BLOCKED_STDIO_RUNTIME_SKELETON_ERROR_MESSAGE.to_string(),
        reason,
        runtime_available: false,
        retryable_in_this_phase: false,
    }
}

pub fn stdio_runtime_lifecycle_unavailable_error(
    reason: StdioRuntimeSkeletonBlockReason,
) -> StdioRuntimeUnavailableError {
    StdioRuntimeUnavailableError {
        code: BLOCKED_STDIO_RUNTIME_SKELETON_ERROR_CODE.to_string(),
        phase: BLOCKED_STDIO_RUNTIME_LIFECYCLE_FAILURE_AUDIT_PHASE.to_string(),
        message: BLOCKED_STDIO_RUNTIME_LIFECYCLE_ERROR_MESSAGE.to_string(),
        reason,
        runtime_available: false,
        retryable_in_this_phase: false,
    }
}

pub fn plan_stdio_runtime_frame(input: &[u8]) -> StdioRuntimeFramePlan {
    let frame_class = classify_stdio_runtime_input_stream(input);
    let accepted_static_probe = frame_class == StdioRuntimeFrameClass::AcceptedStaticProbe;
    let (planned_frame_count, planned_event_ids, planned_stdout_frames) = if accepted_static_probe {
        collect_planned_frames(input)
    } else {
        (0, Vec::new(), Vec::new())
    };
    let diagnostic = stdio_runtime_error_category_for_frame_class(&frame_class).map(|category| {
        stdio_runtime_stderr_diagnostic_for_error(
            category,
            None,
            "blocked skeleton classified frame without runtime execution",
        )
    });
    let block_reason = if accepted_static_probe {
        StdioRuntimeSkeletonBlockReason::RuntimeUnavailable
    } else {
        StdioRuntimeSkeletonBlockReason::FrameRejected
    };

    StdioRuntimeFramePlan {
        phase: BLOCKED_STDIO_RUNTIME_SKELETON_PHASE.to_string(),
        frame_class,
        accepted_static_probe,
        input_bytes: input.len() as u64,
        planned_frame_count,
        planned_event_ids,
        planned_stdout_frames,
        diagnostic,
        runtime_enabled: false,
        approval_granted: false,
        execution_allowed: false,
        block_reason,
    }
}

pub fn plan_stdio_runtime_gates() -> StdioRuntimeGatePlan {
    let gates = stdio_runtime_contract_gates();
    plan_stdio_runtime_gates_from_bundle(&gates)
}

pub fn plan_stdio_runtime_gates_from_bundle(
    gates: &StdioRuntimeContractGateBundle,
) -> StdioRuntimeGatePlan {
    let classification = classify_stdio_runtime_contract_gates(gates);
    let valid_contract_gates = validate_stdio_runtime_contract_gates(gates).is_ok();
    let blocked_gate_ids = gates
        .gate_checklist
        .iter()
        .filter(|gate| gate.status != "evidence-ready")
        .map(|gate| gate.id.clone())
        .collect();

    StdioRuntimeGatePlan {
        phase: BLOCKED_STDIO_RUNTIME_SKELETON_PHASE.to_string(),
        classification,
        valid_contract_gates,
        blocked_gate_ids,
        runtime_available: false,
        approval_granted: false,
        execution_allowed: false,
        block_reason: StdioRuntimeSkeletonBlockReason::GateMissingOrRejected,
    }
}

pub fn blocked_stdio_runtime_entrypoint(input: &[u8]) -> BlockedStdioRuntimeEntrypointResult {
    let frame_plan = plan_stdio_runtime_frame(input);
    blocked_stdio_runtime_result(
        StdioRuntimeSkeletonStatus::RuntimeUnavailable,
        Some(frame_plan),
        None,
        StdioRuntimeSkeletonBlockReason::RuntimeUnavailable,
    )
}

pub fn blocked_stdio_runtime_approval_request() -> BlockedStdioRuntimeEntrypointResult {
    blocked_stdio_runtime_result(
        StdioRuntimeSkeletonStatus::ApprovalBlocked,
        None,
        None,
        StdioRuntimeSkeletonBlockReason::ApprovalUnavailable,
    )
}

pub fn blocked_stdio_runtime_start_request() -> BlockedStdioRuntimeEntrypointResult {
    let lifecycle_plan = plan_stdio_runtime_lifecycle_transition(
        StdioRuntimeLifecycleAction::Start,
        StdioRuntimeLifecycleStateKind::NotStarted,
    );
    blocked_stdio_runtime_result(
        StdioRuntimeSkeletonStatus::StartBlocked,
        None,
        Some(lifecycle_plan),
        StdioRuntimeSkeletonBlockReason::StartUnavailable,
    )
}

pub fn blocked_stdio_runtime_stop_request() -> BlockedStdioRuntimeEntrypointResult {
    let lifecycle_plan = plan_stdio_runtime_lifecycle_transition(
        StdioRuntimeLifecycleAction::Stop,
        StdioRuntimeLifecycleStateKind::StartBlocked,
    );
    blocked_stdio_runtime_result(
        StdioRuntimeSkeletonStatus::StopBlocked,
        None,
        Some(lifecycle_plan),
        StdioRuntimeSkeletonBlockReason::StopUnavailable,
    )
}

pub fn blocked_stdio_runtime_kill_request() -> BlockedStdioRuntimeEntrypointResult {
    let lifecycle_plan = plan_stdio_runtime_lifecycle_transition(
        StdioRuntimeLifecycleAction::Kill,
        StdioRuntimeLifecycleStateKind::StartBlocked,
    );
    blocked_stdio_runtime_result(
        StdioRuntimeSkeletonStatus::KillBlocked,
        None,
        Some(lifecycle_plan),
        StdioRuntimeSkeletonBlockReason::KillUnavailable,
    )
}

pub fn blocked_stdio_runtime_execute_request(
    plan: StdioRuntimeFramePlan,
) -> BlockedStdioRuntimeEntrypointResult {
    let lifecycle_plan = plan_stdio_runtime_lifecycle_transition(
        StdioRuntimeLifecycleAction::Execute,
        StdioRuntimeLifecycleStateKind::StartBlocked,
    );
    blocked_stdio_runtime_result(
        StdioRuntimeSkeletonStatus::ExecutionBlocked,
        Some(plan),
        Some(lifecycle_plan),
        StdioRuntimeSkeletonBlockReason::ExecutionUnavailable,
    )
}

pub fn blocked_stdio_runtime_execution_request(
    plan: StdioRuntimeFramePlan,
) -> BlockedStdioRuntimeEntrypointResult {
    blocked_stdio_runtime_execute_request(plan)
}

pub fn guarded_stdio_runtime_loop_budget() -> GuardedStdioRuntimeLoopBudget {
    GuardedStdioRuntimeLoopBudget {
        max_input_bytes: crate::ARDYN_STDIO_RUNTIME_MAX_INPUT_BYTES,
        max_frames: GUARDED_STDIO_RUNTIME_LOOP_MAX_FRAMES,
        live_stdin_available: false,
    }
}

pub fn plan_guarded_stdio_runtime_loop(input: &[u8]) -> GuardedStdioRuntimeLoopPlan {
    let budget = guarded_stdio_runtime_loop_budget();
    let budget_exceeded = input.len() as u64 > budget.max_input_bytes;
    let frame_plans = if budget_exceeded {
        Vec::new()
    } else {
        let mut cumulative = Vec::new();
        input
            .split_inclusive(|byte| *byte == b'\n')
            .take(budget.max_frames as usize)
            .map(|frame| {
                cumulative.extend_from_slice(frame);
                plan_stdio_runtime_frame(&cumulative)
            })
            .collect::<Vec<_>>()
    };

    GuardedStdioRuntimeLoopPlan {
        phase: GUARDED_STDIO_RUNTIME_IMPLEMENTATION_SLICE_PHASE.to_string(),
        budget,
        input_bytes: input.len() as u64,
        planned_iterations: frame_plans.len() as u64,
        frame_plans,
        budget_exceeded,
        stdin_read: false,
        runtime_available: false,
        execution_allowed: false,
        block_reason: if budget_exceeded {
            StdioRuntimeSkeletonBlockReason::FrameRejected
        } else {
            StdioRuntimeSkeletonBlockReason::RuntimeUnavailable
        },
    }
}

pub fn plan_guarded_redacted_writer(
    stream: StdioRuntimePlannedWriterStream,
    lines: &[String],
) -> GuardedStdioRuntimeRedactedWriterPlan {
    let planned_lines = lines
        .iter()
        .take(GUARDED_STDIO_RUNTIME_LOOP_MAX_FRAMES as usize)
        .map(|line| redact_planned_line(line))
        .collect::<Vec<_>>();
    let redaction_applied = lines
        .iter()
        .zip(planned_lines.iter())
        .any(|(original, redacted)| original != redacted);

    GuardedStdioRuntimeRedactedWriterPlan {
        phase: GUARDED_STDIO_RUNTIME_IMPLEMENTATION_SLICE_PHASE.to_string(),
        stream,
        planned_only: true,
        live_writer_available: false,
        requested_frame_count: lines.len() as u64,
        planned_frame_count: planned_lines.len() as u64,
        redaction_applied,
        raw_payload_retained: false,
        stream_written: false,
        planned_lines,
        block_reason: StdioRuntimeSkeletonBlockReason::RuntimeUnavailable,
    }
}

pub fn plan_stdio_runtime_approval_boundary_from_fixture_json(
    approval_record_json: &str,
) -> GuardedStdioRuntimeApprovalBoundaryPlan {
    let classification = classify_host_policy_approval_record_json(approval_record_json);
    let fixture_evidence_satisfied =
        classification == HostPolicyApprovalRecordClassification::ValidReviewRecord;

    GuardedStdioRuntimeApprovalBoundaryPlan {
        phase: GUARDED_STDIO_RUNTIME_IMPLEMENTATION_SLICE_PHASE.to_string(),
        classification,
        fixture_evidence_satisfied,
        approval_boundary_satisfied: false,
        approval_evaluator_available: false,
        approval_granted: false,
        runtime_available: false,
        execution_allowed: false,
        block_reason: if fixture_evidence_satisfied {
            StdioRuntimeSkeletonBlockReason::ApprovalUnavailable
        } else {
            StdioRuntimeSkeletonBlockReason::GateMissingOrRejected
        },
    }
}

pub fn plan_stdio_runtime_lifecycle_transition(
    action: StdioRuntimeLifecycleAction,
    from_state: StdioRuntimeLifecycleStateKind,
) -> StdioRuntimeLifecycleTransitionPlan {
    let (to_state, status, block_reason) = blocked_lifecycle_outcome(&action);
    let failure_category = match action {
        StdioRuntimeLifecycleAction::Kill => {
            StdioRuntimeFailureAuditCategory::ProcessControlUnavailable
        }
        StdioRuntimeLifecycleAction::Execute => {
            StdioRuntimeFailureAuditCategory::RuntimeUnavailable
        }
        StdioRuntimeLifecycleAction::Start | StdioRuntimeLifecycleAction::Stop => {
            StdioRuntimeFailureAuditCategory::LifecycleUnavailable
        }
    };

    StdioRuntimeLifecycleTransitionPlan {
        phase: BLOCKED_STDIO_RUNTIME_LIFECYCLE_FAILURE_AUDIT_PHASE.to_string(),
        action: action.clone(),
        from_state,
        to_state,
        status,
        block_reason,
        transcript_plan: blocked_transcript_plan(&action),
        failure_audit_plan: blocked_failure_audit_plan(failure_category),
        kill_semantics_plan: if action == StdioRuntimeLifecycleAction::Kill {
            Some(blocked_kill_semantics_plan())
        } else {
            None
        },
        runtime_available: false,
        lifecycle_available: false,
        execution_allowed: false,
        process_started: false,
        process_stopped: false,
        process_killed: false,
        signal_sent: false,
        process_polled: false,
        process_waited: false,
        stdin_read: false,
        stdout_written: false,
        stderr_written: false,
    }
}

fn blocked_lifecycle_outcome(
    action: &StdioRuntimeLifecycleAction,
) -> (
    StdioRuntimeLifecycleStateKind,
    StdioRuntimeSkeletonStatus,
    StdioRuntimeSkeletonBlockReason,
) {
    match action {
        StdioRuntimeLifecycleAction::Start => (
            StdioRuntimeLifecycleStateKind::StartBlocked,
            StdioRuntimeSkeletonStatus::StartBlocked,
            StdioRuntimeSkeletonBlockReason::StartUnavailable,
        ),
        StdioRuntimeLifecycleAction::Stop => (
            StdioRuntimeLifecycleStateKind::StopBlocked,
            StdioRuntimeSkeletonStatus::StopBlocked,
            StdioRuntimeSkeletonBlockReason::StopUnavailable,
        ),
        StdioRuntimeLifecycleAction::Kill => (
            StdioRuntimeLifecycleStateKind::KillBlocked,
            StdioRuntimeSkeletonStatus::KillBlocked,
            StdioRuntimeSkeletonBlockReason::KillUnavailable,
        ),
        StdioRuntimeLifecycleAction::Execute => (
            StdioRuntimeLifecycleStateKind::ExecuteBlocked,
            StdioRuntimeSkeletonStatus::ExecutionBlocked,
            StdioRuntimeSkeletonBlockReason::ExecutionUnavailable,
        ),
    }
}

fn blocked_transcript_plan(action: &StdioRuntimeLifecycleAction) -> StdioRuntimeTranscriptPlan {
    StdioRuntimeTranscriptPlan {
        planned_only: true,
        transcript_persistence_available: false,
        replay_available: false,
        planned_record_ids: vec![
            "phase-4.2b.lifecycle.transition".to_string(),
            format!("phase-4.2b.lifecycle.{}", lifecycle_action_id(action)),
        ],
    }
}

fn blocked_failure_audit_plan(
    category: StdioRuntimeFailureAuditCategory,
) -> StdioRuntimeFailureAuditPlan {
    StdioRuntimeFailureAuditPlan {
        planned_only: true,
        category,
        deterministic_code: BLOCKED_STDIO_RUNTIME_SKELETON_ERROR_CODE.to_string(),
        runtime_effect_recorded: false,
    }
}

fn blocked_kill_semantics_plan() -> StdioRuntimeKillSemanticsPlan {
    StdioRuntimeKillSemanticsPlan {
        planned_only: true,
        process_identifier_available: false,
        graceful_stop_available: false,
        forced_termination_available: false,
        signal_available: false,
        terminal_state_required: true,
        termination_effect_performed: false,
    }
}

fn lifecycle_action_id(action: &StdioRuntimeLifecycleAction) -> &'static str {
    match action {
        StdioRuntimeLifecycleAction::Start => "start",
        StdioRuntimeLifecycleAction::Stop => "stop",
        StdioRuntimeLifecycleAction::Kill => "kill",
        StdioRuntimeLifecycleAction::Execute => "execute",
    }
}

fn redact_planned_line(line: &str) -> String {
    line.split_whitespace()
        .map(|token| {
            if token.starts_with("secret=") {
                "secret=[REDACTED]"
            } else if token.starts_with("token=") {
                "token=[REDACTED]"
            } else if token.starts_with("password=") {
                "password=[REDACTED]"
            } else {
                token
            }
        })
        .collect::<Vec<_>>()
        .join(" ")
}

fn collect_planned_frames(input: &[u8]) -> (u64, Vec<String>, Vec<StdioRuntimeStdoutFrame>) {
    let Some(text) = std::str::from_utf8(input).ok() else {
        return (0, Vec::new(), Vec::new());
    };

    let frames: Vec<StdioRuntimeInputFrame> = text
        .split_terminator('\n')
        .filter_map(|line| parse_stdio_runtime_input_frame_json(line).ok())
        .collect();
    let event_ids = frames
        .iter()
        .map(|frame| frame.event_id.clone())
        .collect::<Vec<_>>();
    let stdout_frames = frames
        .iter()
        .filter_map(|frame| stdio_runtime_stdout_frame_for_input(frame).ok())
        .collect::<Vec<_>>();

    (frames.len() as u64, event_ids, stdout_frames)
}

fn blocked_stdio_runtime_result(
    status: StdioRuntimeSkeletonStatus,
    frame_plan: Option<StdioRuntimeFramePlan>,
    lifecycle_plan: Option<StdioRuntimeLifecycleTransitionPlan>,
    reason: StdioRuntimeSkeletonBlockReason,
) -> BlockedStdioRuntimeEntrypointResult {
    let error = if lifecycle_plan.is_some() {
        stdio_runtime_lifecycle_unavailable_error(reason.clone())
    } else {
        stdio_runtime_unavailable_error(reason.clone())
    };

    BlockedStdioRuntimeEntrypointResult {
        phase: error.phase.clone(),
        status,
        state: stdio_runtime_skeleton_state(),
        frame_plan,
        gate_plan: plan_stdio_runtime_gates(),
        lifecycle_plan,
        error,
        executed: false,
        runtime_enabled: false,
        approval_granted: false,
        stdout_written: false,
        stderr_written: false,
        process_control_used: false,
    }
}

#[cfg(test)]
pub(crate) fn simulate_blocked_stdio_runtime_for_test(
    input: &[u8],
) -> BlockedStdioRuntimeEntrypointResult {
    blocked_stdio_runtime_entrypoint(input)
}

#[cfg(test)]
mod tests {
    use super::*;

    fn valid_probe_line(event_id: &str, sequence: u64) -> String {
        format!(
            "{{\"eventId\":\"{event_id}\",\"eventType\":\"harness.stdin.probe\",\"sequence\":{sequence},\"payload\":{{\"mode\":\"static-harness-probe\",\"runtimeRequested\":false,\"approvalRequested\":false}}}}\n"
        )
    }

    #[test]
    fn valid_frame_planning_stays_runtime_unavailable() {
        let input = valid_probe_line("phase-4-2a-valid", 1);
        let plan = plan_stdio_runtime_frame(input.as_bytes());

        assert_eq!(
            plan.frame_class,
            StdioRuntimeFrameClass::AcceptedStaticProbe
        );
        assert!(plan.accepted_static_probe);
        assert_eq!(plan.planned_frame_count, 1);
        assert_eq!(plan.planned_event_ids, vec!["phase-4-2a-valid"]);
        assert_eq!(plan.planned_stdout_frames.len(), 1);
        assert_eq!(plan.planned_stdout_frames[0].event_id, "phase-4-2a-valid");
        assert!(plan.planned_stdout_frames[0].accepted);
        assert!(!plan.planned_stdout_frames[0].runtime_enabled);
        assert!(!plan.planned_stdout_frames[0].approval_granted);
        assert_eq!(
            plan.block_reason,
            StdioRuntimeSkeletonBlockReason::RuntimeUnavailable
        );
        assert!(!plan.execution_allowed);
        assert!(!plan.runtime_enabled);
        assert!(!plan.approval_granted);
        assert!(plan.diagnostic.is_none());
    }

    #[test]
    fn invalid_frame_rejection_is_deterministic_and_inert() {
        let plan = plan_stdio_runtime_frame(b"{not-json}\n");

        assert_eq!(
            plan.frame_class,
            StdioRuntimeFrameClass::RejectedMalformedInput
        );
        assert!(!plan.accepted_static_probe);
        assert_eq!(plan.planned_frame_count, 0);
        assert!(plan.planned_stdout_frames.is_empty());
        assert_eq!(
            plan.block_reason,
            StdioRuntimeSkeletonBlockReason::FrameRejected
        );
        assert_eq!(
            plan.diagnostic
                .as_ref()
                .map(|diagnostic| diagnostic.code.as_str()),
            Some("malformed_input")
        );
        assert!(!plan.execution_allowed);
        assert!(!plan.runtime_enabled);
        assert!(!plan.approval_granted);
    }

    #[test]
    fn runtime_approval_frame_is_rejected_before_any_grant() {
        let input = concat!(
            "{\"eventId\":\"phase-4-2a-approval\",\"eventType\":\"harness.stdin.probe\",\"sequence\":1,",
            "\"payload\":{\"mode\":\"static-harness-probe\",\"runtimeRequested\":true,\"approvalRequested\":true}}\n"
        );
        let plan = plan_stdio_runtime_frame(input.as_bytes());

        assert_eq!(
            plan.frame_class,
            StdioRuntimeFrameClass::RejectedRuntimeApprovalRequest
        );
        assert_eq!(
            plan.block_reason,
            StdioRuntimeSkeletonBlockReason::FrameRejected
        );
        assert!(!plan.approval_granted);
        assert!(plan.planned_stdout_frames.is_empty());
        assert_eq!(
            plan.diagnostic
                .as_ref()
                .map(|diagnostic| diagnostic.code.as_str()),
            Some("runtime_request_rejected")
        );
    }

    #[test]
    fn gate_planning_preserves_blocked_contract_status() {
        let plan = plan_stdio_runtime_gates();

        assert_eq!(
            plan.classification,
            StdioRuntimeContractGateBundleClassification::ContractOnly
        );
        assert!(plan.valid_contract_gates);
        assert!(plan
            .blocked_gate_ids
            .contains(&"process-lifecycle".to_string()));
        assert!(plan
            .blocked_gate_ids
            .contains(&"cli-surface-review".to_string()));
        assert!(!plan.runtime_available);
        assert!(!plan.approval_granted);
        assert!(!plan.execution_allowed);

        let mut gates = stdio_runtime_contract_gates();
        gates.gate_checklist[0].status = "approved".to_string();
        let rejected = plan_stdio_runtime_gates_from_bundle(&gates);
        assert_eq!(
            rejected.classification,
            StdioRuntimeContractGateBundleClassification::ApprovedGateRejected
        );
        assert!(!rejected.valid_contract_gates);
        assert!(!rejected.runtime_available);
    }

    #[test]
    fn blocked_entrypoint_has_no_execution_or_stream_effects() {
        let input = valid_probe_line("phase-4-2a-entrypoint", 1);
        let result = blocked_stdio_runtime_entrypoint(input.as_bytes());

        assert_eq!(
            result.status,
            StdioRuntimeSkeletonStatus::RuntimeUnavailable
        );
        assert_eq!(result.error.code, BLOCKED_STDIO_RUNTIME_SKELETON_ERROR_CODE);
        assert_eq!(
            result.error.message,
            BLOCKED_STDIO_RUNTIME_SKELETON_ERROR_MESSAGE
        );
        assert!(!result.error.retryable_in_this_phase);
        assert!(
            result
                .frame_plan
                .as_ref()
                .expect("frame plan")
                .accepted_static_probe
        );
        assert!(result.all_effects_blocked());
    }

    #[test]
    fn approval_and_execution_paths_remain_blocked() {
        let approval = blocked_stdio_runtime_approval_request();
        assert_eq!(approval.status, StdioRuntimeSkeletonStatus::ApprovalBlocked);
        assert_eq!(
            approval.error.reason,
            StdioRuntimeSkeletonBlockReason::ApprovalUnavailable
        );
        assert!(approval.all_effects_blocked());

        let input = valid_probe_line("phase-4-2a-execution", 1);
        let execution =
            blocked_stdio_runtime_execution_request(plan_stdio_runtime_frame(input.as_bytes()));
        assert_eq!(
            execution.status,
            StdioRuntimeSkeletonStatus::ExecutionBlocked
        );
        assert_eq!(
            execution.error.reason,
            StdioRuntimeSkeletonBlockReason::ExecutionUnavailable
        );
        assert!(execution.all_effects_blocked());
    }

    #[test]
    fn lifecycle_transition_planning_is_deterministic_and_blocked() {
        let first = plan_stdio_runtime_lifecycle_transition(
            StdioRuntimeLifecycleAction::Start,
            StdioRuntimeLifecycleStateKind::NotStarted,
        );
        let second = plan_stdio_runtime_lifecycle_transition(
            StdioRuntimeLifecycleAction::Start,
            StdioRuntimeLifecycleStateKind::NotStarted,
        );

        assert_eq!(first, second);
        assert_eq!(first.action, StdioRuntimeLifecycleAction::Start);
        assert_eq!(first.from_state, StdioRuntimeLifecycleStateKind::NotStarted);
        assert_eq!(first.to_state, StdioRuntimeLifecycleStateKind::StartBlocked);
        assert_eq!(first.status, StdioRuntimeSkeletonStatus::StartBlocked);
        assert_eq!(
            first.block_reason,
            StdioRuntimeSkeletonBlockReason::StartUnavailable
        );
        assert_eq!(
            first.failure_audit_plan.category,
            StdioRuntimeFailureAuditCategory::LifecycleUnavailable
        );
        assert_eq!(
            first.transcript_plan.planned_record_ids,
            vec![
                "phase-4.2b.lifecycle.transition".to_string(),
                "phase-4.2b.lifecycle.start".to_string()
            ]
        );
        assert!(first.kill_semantics_plan.is_none());
        assert!(first.all_effects_blocked());
    }

    #[test]
    fn start_stop_kill_and_execute_entrypoints_return_unavailable_results() {
        let input = valid_probe_line("phase-4-2b-execute", 1);
        let frame_plan = plan_stdio_runtime_frame(input.as_bytes());
        let results = [
            (
                blocked_stdio_runtime_start_request(),
                StdioRuntimeSkeletonStatus::StartBlocked,
                StdioRuntimeSkeletonBlockReason::StartUnavailable,
                StdioRuntimeLifecycleAction::Start,
                StdioRuntimeLifecycleStateKind::StartBlocked,
            ),
            (
                blocked_stdio_runtime_stop_request(),
                StdioRuntimeSkeletonStatus::StopBlocked,
                StdioRuntimeSkeletonBlockReason::StopUnavailable,
                StdioRuntimeLifecycleAction::Stop,
                StdioRuntimeLifecycleStateKind::StopBlocked,
            ),
            (
                blocked_stdio_runtime_kill_request(),
                StdioRuntimeSkeletonStatus::KillBlocked,
                StdioRuntimeSkeletonBlockReason::KillUnavailable,
                StdioRuntimeLifecycleAction::Kill,
                StdioRuntimeLifecycleStateKind::KillBlocked,
            ),
            (
                blocked_stdio_runtime_execute_request(frame_plan),
                StdioRuntimeSkeletonStatus::ExecutionBlocked,
                StdioRuntimeSkeletonBlockReason::ExecutionUnavailable,
                StdioRuntimeLifecycleAction::Execute,
                StdioRuntimeLifecycleStateKind::ExecuteBlocked,
            ),
        ];

        for (result, status, reason, action, to_state) in results {
            assert_eq!(result.status, status);
            assert_eq!(result.error.reason, reason);
            assert_eq!(result.error.code, BLOCKED_STDIO_RUNTIME_SKELETON_ERROR_CODE);
            assert!(!result.error.runtime_available);
            assert!(!result.error.retryable_in_this_phase);

            let lifecycle_plan = result.lifecycle_plan.as_ref().expect("lifecycle plan");
            assert_eq!(lifecycle_plan.action, action);
            assert_eq!(lifecycle_plan.to_state, to_state);
            assert_eq!(lifecycle_plan.status, status);
            assert_eq!(lifecycle_plan.block_reason, reason);
            assert!(lifecycle_plan.all_effects_blocked());
            assert!(result.all_effects_blocked());
        }
    }

    #[test]
    fn kill_semantics_plan_is_audit_only_and_performs_no_process_control() {
        let kill = blocked_stdio_runtime_kill_request();
        let lifecycle_plan = kill.lifecycle_plan.as_ref().expect("kill lifecycle plan");
        let kill_plan = lifecycle_plan
            .kill_semantics_plan
            .as_ref()
            .expect("kill semantics plan");

        assert_eq!(lifecycle_plan.action, StdioRuntimeLifecycleAction::Kill);
        assert_eq!(
            lifecycle_plan.failure_audit_plan.category,
            StdioRuntimeFailureAuditCategory::ProcessControlUnavailable
        );
        assert_eq!(
            lifecycle_plan.transcript_plan.planned_record_ids,
            vec![
                "phase-4.2b.lifecycle.transition".to_string(),
                "phase-4.2b.lifecycle.kill".to_string()
            ]
        );
        assert!(kill_plan.planned_only);
        assert!(!kill_plan.process_identifier_available);
        assert!(!kill_plan.graceful_stop_available);
        assert!(!kill_plan.forced_termination_available);
        assert!(!kill_plan.signal_available);
        assert!(kill_plan.terminal_state_required);
        assert!(!kill_plan.termination_effect_performed);
        assert!(!lifecycle_plan.process_killed);
        assert!(!lifecycle_plan.signal_sent);
        assert!(!lifecycle_plan.process_polled);
        assert!(!lifecycle_plan.process_waited);
        assert!(kill.all_effects_blocked());
    }

    #[test]
    fn guarded_loop_plans_fixture_bytes_without_live_stdin() {
        let input = format!(
            "{}{}",
            valid_probe_line("phase-5-2-loop-1", 1),
            valid_probe_line("phase-5-2-loop-2", 2)
        );
        let plan = plan_guarded_stdio_runtime_loop(input.as_bytes());

        assert_eq!(plan.phase, GUARDED_STDIO_RUNTIME_IMPLEMENTATION_SLICE_PHASE);
        assert_eq!(
            plan.budget.max_input_bytes,
            crate::ARDYN_STDIO_RUNTIME_MAX_INPUT_BYTES
        );
        assert!(!plan.budget.live_stdin_available);
        assert_eq!(plan.input_bytes, input.len() as u64);
        assert_eq!(plan.planned_iterations, 2);
        assert_eq!(plan.frame_plans.len(), 2);
        assert!(plan
            .frame_plans
            .iter()
            .all(|frame| frame.accepted_static_probe));
        assert!(!plan.budget_exceeded);
        assert!(!plan.stdin_read);
        assert!(!plan.runtime_available);
        assert!(!plan.execution_allowed);
        assert_eq!(
            plan.block_reason,
            StdioRuntimeSkeletonBlockReason::RuntimeUnavailable
        );
    }

    #[test]
    fn guarded_loop_rejects_oversized_fixture_bytes_without_iteration() {
        let input = vec![b'a'; crate::ARDYN_STDIO_RUNTIME_MAX_INPUT_BYTES as usize + 1];
        let plan = plan_guarded_stdio_runtime_loop(&input);

        assert!(plan.budget_exceeded);
        assert_eq!(plan.planned_iterations, 0);
        assert!(plan.frame_plans.is_empty());
        assert!(!plan.stdin_read);
        assert!(!plan.runtime_available);
        assert!(!plan.execution_allowed);
        assert_eq!(
            plan.block_reason,
            StdioRuntimeSkeletonBlockReason::FrameRejected
        );
    }

    #[test]
    fn redacted_writer_plan_sanitizes_in_memory_without_stream_writes() {
        let lines = vec![
            "diagnostic secret=abc token=def password=ghi".to_string(),
            "diagnostic safe".to_string(),
        ];
        let plan = plan_guarded_redacted_writer(StdioRuntimePlannedWriterStream::Stderr, &lines);

        assert_eq!(plan.phase, GUARDED_STDIO_RUNTIME_IMPLEMENTATION_SLICE_PHASE);
        assert_eq!(plan.stream, StdioRuntimePlannedWriterStream::Stderr);
        assert!(plan.planned_only);
        assert!(!plan.live_writer_available);
        assert_eq!(plan.requested_frame_count, 2);
        assert_eq!(plan.planned_frame_count, 2);
        assert!(plan.redaction_applied);
        assert!(!plan.raw_payload_retained);
        assert!(!plan.stream_written);
        assert_eq!(
            plan.planned_lines[0],
            "diagnostic secret=[REDACTED] token=[REDACTED] password=[REDACTED]"
        );
        assert!(!plan.planned_lines[0].contains("abc"));
        assert!(!plan.planned_lines[0].contains("def"));
        assert!(!plan.planned_lines[0].contains("ghi"));
        assert_eq!(plan.planned_lines[1], "diagnostic safe");
    }

    #[test]
    fn approval_boundary_fixture_is_necessary_but_not_sufficient() {
        let valid = include_str!(
            "../../../../tests/fixtures/host-policy/phase4-1a/valid-review-only-host-policy-approval-record.json"
        );
        let plan = plan_stdio_runtime_approval_boundary_from_fixture_json(valid);

        assert_eq!(
            plan.classification,
            HostPolicyApprovalRecordClassification::ValidReviewRecord
        );
        assert!(plan.fixture_evidence_satisfied);
        assert!(!plan.approval_boundary_satisfied);
        assert!(!plan.approval_evaluator_available);
        assert!(!plan.approval_granted);
        assert!(!plan.runtime_available);
        assert!(!plan.execution_allowed);
        assert_eq!(
            plan.block_reason,
            StdioRuntimeSkeletonBlockReason::ApprovalUnavailable
        );
    }

    #[test]
    fn approval_boundary_rejects_non_fixture_grants_and_denials() {
        for (json, classification) in [
            (
                include_str!(
                    "../../../../tests/fixtures/host-policy/phase4-1a/denied-host-policy-approval-record.json"
                ),
                HostPolicyApprovalRecordClassification::Denied,
            ),
            (
                include_str!(
                    "../../../../tests/fixtures/host-policy/phase4-1a/runtime-grant-attempt-host-policy-approval-record.json"
                ),
                HostPolicyApprovalRecordClassification::RuntimeNotAvailable,
            ),
        ] {
            let plan = plan_stdio_runtime_approval_boundary_from_fixture_json(json);

            assert_eq!(plan.classification, classification);
            assert!(!plan.fixture_evidence_satisfied);
            assert!(!plan.approval_boundary_satisfied);
            assert!(!plan.approval_granted);
            assert!(!plan.runtime_available);
            assert!(!plan.execution_allowed);
            assert_eq!(
                plan.block_reason,
                StdioRuntimeSkeletonBlockReason::GateMissingOrRejected
            );
        }
    }

    #[test]
    fn unavailable_errors_are_deterministic_and_non_retryable() {
        let first =
            stdio_runtime_unavailable_error(StdioRuntimeSkeletonBlockReason::RuntimeUnavailable);
        let second =
            stdio_runtime_unavailable_error(StdioRuntimeSkeletonBlockReason::RuntimeUnavailable);
        let approval =
            stdio_runtime_unavailable_error(StdioRuntimeSkeletonBlockReason::ApprovalUnavailable);

        assert_eq!(first, second);
        assert_eq!(first.code, BLOCKED_STDIO_RUNTIME_SKELETON_ERROR_CODE);
        assert_eq!(first.message, BLOCKED_STDIO_RUNTIME_SKELETON_ERROR_MESSAGE);
        assert_eq!(
            first.reason,
            StdioRuntimeSkeletonBlockReason::RuntimeUnavailable
        );
        assert_eq!(
            approval.reason,
            StdioRuntimeSkeletonBlockReason::ApprovalUnavailable
        );
        assert!(!first.runtime_available);
        assert!(!first.retryable_in_this_phase);
        assert!(!approval.runtime_available);
        assert!(!approval.retryable_in_this_phase);
    }

    #[test]
    fn source_guard_has_no_live_runtime_apis() {
        let source = include_str!("mod.rs");
        let production_source = source
            .split("#[cfg(test)]")
            .next()
            .expect("production source before tests");

        for banned in [
            "std::io::stdin",
            "std::io::stdout",
            "std::io::stderr",
            "io::stdin",
            "io::stdout",
            "io::stderr",
            "std::process",
            "process::Command",
            "Command::new",
            "Child::",
            "Stdio::",
            ".spawn(",
            ".kill(",
            ".wait(",
            ".try_wait(",
            ".wait_with_output(",
            "std::fs",
            "fs::write",
            "fs::create",
            "File::create",
            "OpenOptions",
            ".write_all(",
            ".flush(",
            ".sync_all(",
            ".sync_data(",
            "TcpListener",
            "TcpStream",
            "UdpSocket",
            "UnixListener",
            "UnixStream",
            "thread::spawn",
            "tokio::",
            "async_std::",
            "println!",
            "eprintln!",
            "runtime_available: true",
            "execution_available: true",
            "execution_allowed: true",
            "approval_granted: true",
            "approval_grants_available: true",
            "process_control_available: true",
            "live_streams_available: true",
            "stdin_read: true",
            "stdout_written: true",
            "stderr_written: true",
            "process_started: true",
            "process_stopped: true",
            "process_killed: true",
            "signal_sent: true",
            "process_polled: true",
            "process_waited: true",
            "transcript_persistence_available: true",
            "runtime_effect_recorded: true",
            "live_stdin_available: true",
            "live_writer_available: true",
            "approval_boundary_satisfied: true",
            "approval_evaluator_available: true",
        ] {
            assert!(
                !production_source.contains(banned),
                "stdio_runtime module must not contain live runtime API {banned}"
            );
        }
    }

    #[test]
    fn test_only_simulation_uses_same_blocked_entrypoint() {
        let input = valid_probe_line("phase-4-2a-simulated", 1);
        let simulated = simulate_blocked_stdio_runtime_for_test(input.as_bytes());

        assert_eq!(
            simulated.status,
            StdioRuntimeSkeletonStatus::RuntimeUnavailable
        );
        assert!(simulated.all_effects_blocked());
    }
}
