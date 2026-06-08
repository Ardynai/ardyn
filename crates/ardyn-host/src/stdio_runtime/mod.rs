//! Deliberately blocked Rust-host stdio runtime skeleton.
//!
//! Phase 4.2A is library-only planning code. It classifies fixture-shaped
//! frames and records unavailable lifecycle hooks, but every entrypoint returns
//! a blocked result. It does not own process streams, control processes,
//! evaluate approval, call adapters, or expose a command surface.

#![allow(dead_code)]

use crate::{
    classify_stdio_runtime_contract_gates, classify_stdio_runtime_input_stream,
    parse_stdio_runtime_input_frame_json, stdio_runtime_contract_gates,
    stdio_runtime_error_category_for_frame_class, stdio_runtime_stderr_diagnostic_for_error,
    stdio_runtime_stdout_frame_for_input, validate_stdio_runtime_contract_gates,
    StdioRuntimeContractGateBundle, StdioRuntimeContractGateBundleClassification,
    StdioRuntimeFrameClass, StdioRuntimeInputFrame, StdioRuntimeStderrDiagnostic,
    StdioRuntimeStdoutFrame,
};
use serde::{Deserialize, Serialize};

pub const BLOCKED_STDIO_RUNTIME_SKELETON_PHASE: &str = "phase-4.2a-blocked-stdio-runtime-skeleton";
pub const BLOCKED_STDIO_RUNTIME_SKELETON_ERROR_CODE: &str = "runtime_unavailable";
pub const BLOCKED_STDIO_RUNTIME_SKELETON_ERROR_MESSAGE: &str =
    "Phase 4.2A stdio runtime skeleton is deliberately blocked and cannot execute.";

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum StdioRuntimeSkeletonStatus {
    RuntimeUnavailable,
    FrameRejected,
    GateBlocked,
    ApprovalBlocked,
    ExecutionBlocked,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum StdioRuntimeSkeletonBlockReason {
    RuntimeUnavailable,
    FrameRejected,
    GateMissingOrRejected,
    ApprovalUnavailable,
    ExecutionUnavailable,
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
pub struct BlockedStdioRuntimeEntrypointResult {
    pub phase: String,
    pub status: StdioRuntimeSkeletonStatus,
    pub state: StdioRuntimeSkeletonState,
    pub frame_plan: Option<StdioRuntimeFramePlan>,
    pub gate_plan: StdioRuntimeGatePlan,
    pub error: StdioRuntimeUnavailableError,
    pub executed: bool,
    pub runtime_enabled: bool,
    pub approval_granted: bool,
    pub stdout_written: bool,
    pub stderr_written: bool,
    pub process_control_used: bool,
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
            && self.error.runtime_available == false
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
        StdioRuntimeSkeletonBlockReason::RuntimeUnavailable,
    )
}

pub fn blocked_stdio_runtime_approval_request() -> BlockedStdioRuntimeEntrypointResult {
    blocked_stdio_runtime_result(
        StdioRuntimeSkeletonStatus::ApprovalBlocked,
        None,
        StdioRuntimeSkeletonBlockReason::ApprovalUnavailable,
    )
}

pub fn blocked_stdio_runtime_execution_request(
    plan: StdioRuntimeFramePlan,
) -> BlockedStdioRuntimeEntrypointResult {
    blocked_stdio_runtime_result(
        StdioRuntimeSkeletonStatus::ExecutionBlocked,
        Some(plan),
        StdioRuntimeSkeletonBlockReason::ExecutionUnavailable,
    )
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
    reason: StdioRuntimeSkeletonBlockReason,
) -> BlockedStdioRuntimeEntrypointResult {
    BlockedStdioRuntimeEntrypointResult {
        phase: BLOCKED_STDIO_RUNTIME_SKELETON_PHASE.to_string(),
        status,
        state: stdio_runtime_skeleton_state(),
        frame_plan,
        gate_plan: plan_stdio_runtime_gates(),
        error: stdio_runtime_unavailable_error(reason),
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
            "std::process",
            "Command::new",
            "TcpListener",
            "UdpSocket",
            "thread::spawn",
            "tokio::",
            "async_std::",
            "println!",
            "eprintln!",
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
