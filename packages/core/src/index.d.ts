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
export const CONSUMER_CONTRACT_GAP_INDEX_SCHEMA:
  "ardyn.phase-5.47.consumer-contract-gap-index-result";
export const CONSUMER_CONTRACT_GAP_INDEX_VERSION: "0.1.0";
export const CONSUMER_CONTRACT_GAP_INDEX_KIND:
  "consumer-contract-gap-index";
export const PRODUCTION_READINESS_COVERAGE_MATRIX_SCHEMA:
  "ardyn.phase-5.48.production-readiness-coverage-matrix-result";
export const PRODUCTION_READINESS_COVERAGE_MATRIX_VERSION: "0.1.0";
export const PRODUCTION_READINESS_COVERAGE_MATRIX_KIND:
  "production-readiness-coverage-matrix";
export const CONSUMER_DISPLAY_ACCESSIBILITY_CONTRACT_MAP_SCHEMA:
  "ardyn.phase-5.49.consumer-display-accessibility-contract-map-result";
export const CONSUMER_DISPLAY_ACCESSIBILITY_CONTRACT_MAP_VERSION: "0.1.0";
export const CONSUMER_DISPLAY_ACCESSIBILITY_CONTRACT_MAP_KIND:
  "consumer-display-accessibility-contract-map";
export const CONSUMER_DISPLAY_FIXTURE_SCHEMA_BOUNDARY_SCHEMA:
  "ardyn.phase-5.50.consumer-display-fixture-schema-boundary-result";
export const CONSUMER_DISPLAY_FIXTURE_SCHEMA_BOUNDARY_VERSION: "0.1.0";
export const CONSUMER_DISPLAY_FIXTURE_SCHEMA_BOUNDARY_KIND:
  "consumer-display-fixture-schema-boundary";
export const CONSUMER_DISPLAY_FIXTURE_EXAMPLE_PACK_SCHEMA:
  "ardyn.phase-5.51.consumer-display-fixture-example-pack-result";
export const CONSUMER_DISPLAY_FIXTURE_EXAMPLE_PACK_VERSION: "0.1.0";
export const CONSUMER_DISPLAY_FIXTURE_EXAMPLE_PACK_KIND:
  "consumer-display-fixture-example-pack";
export const CONSUMER_DISPLAY_FIXTURE_CONFORMANCE_HANDOFF_SCHEMA:
  "ardyn.phase-5.52.consumer-display-fixture-conformance-handoff-result";
export const CONSUMER_DISPLAY_FIXTURE_CONFORMANCE_HANDOFF_VERSION: "0.1.0";
export const CONSUMER_DISPLAY_FIXTURE_CONFORMANCE_HANDOFF_KIND:
  "consumer-display-fixture-conformance-handoff";
export const CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_REQUIREMENTS_SCHEMA:
  "ardyn.phase-5.53.consumer-owned-display-conformance-runner-requirements-result";
export const CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_REQUIREMENTS_VERSION:
  "0.1.0";
export const CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_REQUIREMENTS_KIND:
  "consumer-owned-display-conformance-runner-requirements";
export const CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_TEST_PLAN_SCHEMA:
  "ardyn.phase-5.54.consumer-owned-display-conformance-runner-test-plan-result";
export const CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_TEST_PLAN_VERSION:
  "0.1.0";
export const CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_TEST_PLAN_KIND:
  "consumer-owned-display-conformance-runner-test-plan";
export const CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_RESULT_SCHEMA_BOUNDARY_SCHEMA:
  "ardyn.phase-5.55.consumer-owned-display-conformance-runner-result-schema-boundary-result";
export const CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_RESULT_SCHEMA_BOUNDARY_VERSION:
  "0.1.0";
export const CONSUMER_OWNED_DISPLAY_CONFORMANCE_RUNNER_RESULT_SCHEMA_BOUNDARY_KIND:
  "consumer-owned-display-conformance-runner-result-schema-boundary";
export const CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_HANDOFF_SCHEMA:
  "ardyn.phase-5.56.consumer-owned-display-conformance-result-handoff-result";
export const CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_HANDOFF_VERSION:
  "0.1.0";
export const CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_HANDOFF_KIND:
  "consumer-owned-display-conformance-result-handoff";
export const CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_INTAKE_BOUNDARY_SCHEMA:
  "ardyn.phase-5.57.consumer-owned-display-conformance-result-review-intake-boundary-result";
export const CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_INTAKE_BOUNDARY_VERSION:
  "0.1.0";
export const CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_INTAKE_BOUNDARY_KIND:
  "consumer-owned-display-conformance-result-review-intake-boundary";
export const CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_PACKAGE_BOUNDARY_SCHEMA:
  "ardyn.phase-5.58.consumer-owned-display-conformance-result-review-package-boundary-result";
export const CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_PACKAGE_BOUNDARY_VERSION:
  "0.1.0";
export const CONSUMER_OWNED_DISPLAY_CONFORMANCE_RESULT_REVIEW_PACKAGE_BOUNDARY_KIND:
  "consumer-owned-display-conformance-result-review-package-boundary";
export const FABRIC_AWARE_API_BACKEND_CONTRACT_BOUNDARY_MAP_SCHEMA:
  "ardyn.phase-5.59.fabric-aware-api-backend-contract-boundary-map-result";
export const FABRIC_AWARE_API_BACKEND_CONTRACT_BOUNDARY_MAP_VERSION: "0.1.0";
export const FABRIC_AWARE_API_BACKEND_CONTRACT_BOUNDARY_MAP_KIND:
  "fabric-aware-api-backend-contract-boundary-map";
export const INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_SCHEMA:
  "ardyn.phase-5.60.inter-agent-encoded-handoff-conformance-result";
export const INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_VERSION: "0.1.0";
export const INTER_AGENT_ENCODED_HANDOFF_CONFORMANCE_KIND:
  "inter-agent-encoded-handoff-conformance";
export const DATABASE_STORAGE_CONTRACT_BOUNDARY_MAP_SCHEMA:
  "ardyn.phase-5.61.database-storage-contract-boundary-map-result";
export const DATABASE_STORAGE_CONTRACT_BOUNDARY_MAP_VERSION: "0.1.0";
export const DATABASE_STORAGE_CONTRACT_BOUNDARY_MAP_KIND:
  "database-storage-contract-boundary-map";
export const AUTH_PERMISSIONS_CONTRACT_BOUNDARY_MAP_SCHEMA:
  "ardyn.phase-5.62.auth-permissions-contract-boundary-map-result";
export const AUTH_PERMISSIONS_CONTRACT_BOUNDARY_MAP_VERSION: "0.1.0";
export const AUTH_PERMISSIONS_CONTRACT_BOUNDARY_MAP_KIND:
  "auth-permissions-contract-boundary-map";
export const SECURITY_RLS_INPUT_SANITIZATION_CONTRACT_BOUNDARY_MAP_SCHEMA:
  "ardyn.phase-5.63.security-rls-input-sanitization-contract-boundary-map-result";
export const SECURITY_RLS_INPUT_SANITIZATION_CONTRACT_BOUNDARY_MAP_VERSION:
  "0.1.0";
export const SECURITY_RLS_INPUT_SANITIZATION_CONTRACT_BOUNDARY_MAP_KIND:
  "security-rls-input-sanitization-contract-boundary-map";
export const RATE_LIMITING_ABUSE_CONTROL_CONTRACT_BOUNDARY_MAP_SCHEMA:
  "ardyn.phase-5.64.rate-limiting-abuse-control-contract-boundary-map-result";
export const RATE_LIMITING_ABUSE_CONTROL_CONTRACT_BOUNDARY_MAP_VERSION:
  "0.1.0";
export const RATE_LIMITING_ABUSE_CONTROL_CONTRACT_BOUNDARY_MAP_KIND:
  "rate-limiting-abuse-control-contract-boundary-map";
export const ERROR_TRACKING_LOGGING_AUDIT_INTEGRITY_CONTRACT_BOUNDARY_MAP_SCHEMA:
  "ardyn.phase-5.65.error-tracking-logging-audit-integrity-contract-boundary-map-result";
export const ERROR_TRACKING_LOGGING_AUDIT_INTEGRITY_CONTRACT_BOUNDARY_MAP_VERSION:
  "0.1.0";
export const ERROR_TRACKING_LOGGING_AUDIT_INTEGRITY_CONTRACT_BOUNDARY_MAP_KIND:
  "error-tracking-logging-audit-integrity-contract-boundary-map";
export const AVAILABILITY_RECOVERY_CONTRACT_BOUNDARY_MAP_SCHEMA:
  "ardyn.phase-5.66.availability-recovery-contract-boundary-map-result";
export const AVAILABILITY_RECOVERY_CONTRACT_BOUNDARY_MAP_VERSION: "0.1.0";
export const AVAILABILITY_RECOVERY_CONTRACT_BOUNDARY_MAP_KIND:
  "availability-recovery-contract-boundary-map";
export const INFRASTRUCTURE_COMPLIANCE_DATA_RETENTION_CONTRACT_BOUNDARY_MAP_SCHEMA:
  "ardyn.phase-5.67.infrastructure-compliance-data-retention-contract-boundary-map-result";
export const INFRASTRUCTURE_COMPLIANCE_DATA_RETENTION_CONTRACT_BOUNDARY_MAP_VERSION:
  "0.1.0";
export const INFRASTRUCTURE_COMPLIANCE_DATA_RETENTION_CONTRACT_BOUNDARY_MAP_KIND:
  "infrastructure-compliance-data-retention-contract-boundary-map";
export const AGENT_MODE_PROFILE_SKILLHUB_CAPABILITY_BOUNDARY_MAP_SCHEMA:
  "ardyn.phase-5.68.agent-mode-profile-skillhub-capability-boundary-map-result";
export const AGENT_MODE_PROFILE_SKILLHUB_CAPABILITY_BOUNDARY_MAP_VERSION:
  "0.1.0";
export const AGENT_MODE_PROFILE_SKILLHUB_CAPABILITY_BOUNDARY_MAP_KIND:
  "agent-mode-profile-skillhub-capability-boundary-map";
export const TESTING_FRAMEWORKS_QUALITY_GATES_CONTRACT_BOUNDARY_MAP_SCHEMA:
  "ardyn.phase-5.69.testing-frameworks-quality-gates-contract-boundary-map-result";
export const TESTING_FRAMEWORKS_QUALITY_GATES_CONTRACT_BOUNDARY_MAP_VERSION:
  "0.1.0";
export const TESTING_FRAMEWORKS_QUALITY_GATES_CONTRACT_BOUNDARY_MAP_KIND:
  "testing-frameworks-quality-gates-contract-boundary-map";
export const OPERATIONS_RELIABILITY_CONTRACT_BOUNDARY_MAP_SCHEMA:
  "ardyn.phase-5.70.operations-reliability-contract-boundary-map-result";
export const OPERATIONS_RELIABILITY_CONTRACT_BOUNDARY_MAP_VERSION: "0.1.0";
export const OPERATIONS_RELIABILITY_CONTRACT_BOUNDARY_MAP_KIND:
  "operations-reliability-contract-boundary-map";
export const MAINTENANCE_GOVERNANCE_ADR_DEPENDENCY_POLICY_CONTRACT_BOUNDARY_MAP_SCHEMA:
  "ardyn.phase-5.71.maintenance-governance-adr-dependency-policy-contract-boundary-map-result";
export const MAINTENANCE_GOVERNANCE_ADR_DEPENDENCY_POLICY_CONTRACT_BOUNDARY_MAP_VERSION:
  "0.1.0";
export const MAINTENANCE_GOVERNANCE_ADR_DEPENDENCY_POLICY_CONTRACT_BOUNDARY_MAP_KIND:
  "maintenance-governance-adr-dependency-policy-contract-boundary-map";
export const SECRETS_MANAGEMENT_KEY_ROTATION_EXTERNAL_GATEWAY_CREDENTIAL_BOUNDARY_MAP_SCHEMA:
  "ardyn.phase-5.72.secrets-management-key-rotation-external-gateway-credential-boundary-map-result";
export const SECRETS_MANAGEMENT_KEY_ROTATION_EXTERNAL_GATEWAY_CREDENTIAL_BOUNDARY_MAP_VERSION:
  "0.1.0";
export const SECRETS_MANAGEMENT_KEY_ROTATION_EXTERNAL_GATEWAY_CREDENTIAL_BOUNDARY_MAP_KIND:
  "secrets-management-key-rotation-external-gateway-credential-boundary-map";
export const EXTERNAL_GATEWAY_MATRIX_TRANSPORT_CONTRACT_BOUNDARY_MAP_SCHEMA:
  "ardyn.phase-5.73.external-gateway-matrix-transport-contract-boundary-map-result";
export const EXTERNAL_GATEWAY_MATRIX_TRANSPORT_CONTRACT_BOUNDARY_MAP_VERSION:
  "0.1.0";
export const EXTERNAL_GATEWAY_MATRIX_TRANSPORT_CONTRACT_BOUNDARY_MAP_KIND:
  "external-gateway-matrix-transport-contract-boundary-map";
export const COMMAND_SURFACE_SHELL_PRIMITIVE_CONTRACT_BOUNDARY_MAP_SCHEMA:
  "ardyn.phase-5.74.command-surface-shell-primitive-contract-boundary-map-result";
export const COMMAND_SURFACE_SHELL_PRIMITIVE_CONTRACT_BOUNDARY_MAP_VERSION:
  "0.1.0";
export const COMMAND_SURFACE_SHELL_PRIMITIVE_CONTRACT_BOUNDARY_MAP_KIND:
  "command-surface-shell-primitive-contract-boundary-map";
export const FABRIC_CORE_CONSUMER_INTEGRATION_READINESS_BOUNDARY_UPDATE_SCHEMA:
  "ardyn.phase-5.75.fabric-core-consumer-integration-readiness-boundary-update-result";
export const FABRIC_CORE_CONSUMER_INTEGRATION_READINESS_BOUNDARY_UPDATE_VERSION:
  "0.1.0";
export const FABRIC_CORE_CONSUMER_INTEGRATION_READINESS_BOUNDARY_UPDATE_KIND:
  "fabric-core-consumer-integration-readiness-boundary-update";
export const EMBEDDED_DB_QUERY_ENGINE_PRIMITIVE_CONTRACT_BOUNDARY_MAP_SCHEMA:
  "ardyn.phase-5.76.embedded-db-query-engine-primitive-contract-boundary-map-result";
export const EMBEDDED_DB_QUERY_ENGINE_PRIMITIVE_CONTRACT_BOUNDARY_MAP_VERSION:
  "0.1.0";
export const EMBEDDED_DB_QUERY_ENGINE_PRIMITIVE_CONTRACT_BOUNDARY_MAP_KIND:
  "embedded-db-query-engine-primitive-contract-boundary-map";

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

export type ConsumerContractGapIndexClassification =
  | "missing_consumer_contract_gap_index_input_rejected"
  | "malformed_consumer_contract_gap_index_input_rejected"
  | "empty_consumer_contract_gap_index_input_rejected"
  | "duplicate_invalid_consumer_contract_gap_index_input_rejected"
  | "mismatched_source_digest_consumer_contract_gap_index_input_rejected"
  | "reviewer_routing_looking_consumer_contract_gap_index_input_rejected"
  | "reviewer_assignment_looking_consumer_contract_gap_index_input_rejected"
  | "evaluator_execution_looking_consumer_contract_gap_index_input_rejected"
  | "evaluator_result_looking_consumer_contract_gap_index_input_rejected"
  | "approval_decision_looking_consumer_contract_gap_index_input_rejected"
  | "grant_looking_consumer_contract_gap_index_input_rejected"
  | "runtime_permission_looking_consumer_contract_gap_index_input_rejected"
  | "command_exposure_looking_consumer_contract_gap_index_input_rejected"
  | "runtime_effect_true_consumer_contract_gap_index_input_rejected"
  | "process_flag_true_consumer_contract_gap_index_input_rejected"
  | "execution_signal_looking_consumer_contract_gap_index_input_rejected"
  | "valid_consumer_contract_gap_index_runtime_still_blocked";

export interface ConsumerContractGapIndexEntry {
  consumerName: "Locus" | "Multiverse";
  consumerId: "locus" | "multiverse";
  gapId: string;
  sourceReadinessMatrixTouchpoint: string;
  sourceReadinessMatrixRowId: string;
  proposedFuturePhaseFamily: string;
  requiredPrerequisiteContracts: string[];
  allowedCurrentBehavior: string;
  forbiddenCurrentBehavior: string[];
  authorizationStatusFlags: {
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
    reviewerRoutingAuthorizationGranted: false;
    evaluatorExecutionAuthorizationGranted: false;
    approvalDecisionAuthorizationGranted: false;
    approvalGrantProduced: false;
  };
  blockerNotes: string[];
  planningMetadataEvidence: {
    planningMetadataOnly: true;
    reviewOnly: true;
    authoritative: false;
    sourcePhase: "5.46";
    sourceReadinessMatrixRowId: string;
    sourceReadinessMatrixStateKind: "consumer-contract-readiness-matrix-state";
    sourceReadinessMatrixRuntimeEffectAllFalse: true;
    runtimeEffectAllFalse: true;
    noCommandRuntimeControl: true;
    noConnectorGrant: true;
    noFabricRuntime: true;
    noWebsocketRuntime: true;
    noMcpRuntime: true;
    noTaskRuntime: true;
    noSecureDropRuntime: true;
  };
}

export interface ConsumerContractGapIndexGroup {
  consumerId: "locus" | "multiverse";
  consumerName: "Locus" | "Multiverse";
  futureAuthorizationCandidateBuckets: string[];
  gapIds: string[];
  runtimeAuthorizationGranted: false;
  commandAuthorizationGranted: false;
  connectorAuthorizationGranted: false;
  fabricRuntimeAuthorizationGranted?: false;
  webSocketRuntimeAuthorizationGranted?: false;
  mcpRuntimeAuthorizationGranted?: false;
  taskRuntimeAuthorizationGranted?: false;
  secureDropAuthorizationGranted?: false;
}

export interface ConsumerContractGapIndexState {
  schema: "ardyn.phase-5.47.consumer-contract-gap-index-state";
  schemaVersion: "0.1.0";
  stateKind: "consumer-contract-gap-index-state";
  stateMode: "review-only";
  reviewedAt: string;
  sourceConsumerContractReadinessMatrix: {
    schema: "ardyn.phase-5.46.consumer-contract-readiness-matrix-state";
    stateKind: "consumer-contract-readiness-matrix-state";
    stateMode: "review-only";
    reviewedAt: string;
    stateDigest: string;
    consumerContractReadinessMatrixOnly: true;
    targetConsumerIds: ["locus", "multiverse"];
    matrixRowCount: 11;
    locusRowCount: 5;
    multiverseRowCount: 6;
    secureDropFutureContentFabricCapabilityReferenceOnly: true;
    runtimeEffectAllFalse: true;
  };
  gapEntries: ConsumerContractGapIndexEntry[];
  gapGroups: ConsumerContractGapIndexGroup[];
  gapIndexSummary: Record<string, boolean | number | string | string[]>;
  targetConsumerIds: ["locus", "multiverse"];
  consumerContractGapIndexOnly: true;
  reviewOnly: true;
  authoritative: false;
  reviewArtifactOnly: true;
  consumerContractGapIndexIsReviewerRouting: false;
  consumerContractGapIndexIsReviewerAssignment: false;
  consumerContractGapIndexIsEvaluatorExecution: false;
  consumerContractGapIndexIsEvaluatorResult: false;
  consumerContractGapIndexIsApprovalDecision: false;
  consumerContractGapIndexIsApprovalGrant: false;
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
  mcpExecutionEnabled: false;
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
  httpRuntimeSurfaceEnabled: false;
  webSocketHttpSurfaceEnabled: false;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
}

export interface ConsumerContractGapIndexResult {
  schema: "ardyn.phase-5.47.consumer-contract-gap-index-result";
  schemaVersion: "0.1.0";
  consumerContractGapIndexKind: "consumer-contract-gap-index";
  consumerContractGapIndexMode: "review-only";
  reviewedAt: string;
  classification: ConsumerContractGapIndexClassification;
  sourceConsumerContractReadinessMatrixAccepted: boolean;
  consumerContractGapIndexProduced: boolean;
  consumerContractGapIndex: ConsumerContractGapIndexState | null;
  sourceConsumerContractReadinessMatrixSummary:
    | ConsumerContractGapIndexState["sourceConsumerContractReadinessMatrix"]
    | null;
  gapIndexSummary: ConsumerContractGapIndexState["gapIndexSummary"] | null;
  gapEntries: ConsumerContractGapIndexEntry[];
  gapGroups: ConsumerContractGapIndexGroup[];
  targetConsumerIds: Array<"locus" | "multiverse">;
  reviewOnly: true;
  authoritative: false;
  reviewArtifactOnly: true;
  consumerContractGapIndexOnly: true;
  consumerContractGapIndexIsReviewerRouting: false;
  consumerContractGapIndexIsReviewerAssignment: false;
  consumerContractGapIndexIsEvaluatorExecution: false;
  consumerContractGapIndexIsEvaluatorResult: false;
  consumerContractGapIndexIsApprovalDecision: false;
  consumerContractGapIndexIsApprovalGrant: false;
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
  mcpExecutionEnabled: false;
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
  httpRuntimeSurfaceEnabled: false;
  webSocketHttpSurfaceEnabled: false;
  rejectionReasons: string[];
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
}

export type ProductionReadinessCoverageStatus =
  | "covered"
  | "partial"
  | "missing"
  | "deferred"
  | "not_applicable";

export type ProductionReadinessCoverageMatrixClassification =
  | "malformed_production_readiness_coverage_matrix_input_rejected"
  | "reviewer_routing_looking_production_readiness_coverage_matrix_input_rejected"
  | "reviewer_assignment_looking_production_readiness_coverage_matrix_input_rejected"
  | "evaluator_execution_looking_production_readiness_coverage_matrix_input_rejected"
  | "evaluator_result_looking_production_readiness_coverage_matrix_input_rejected"
  | "approval_decision_looking_production_readiness_coverage_matrix_input_rejected"
  | "grant_looking_production_readiness_coverage_matrix_input_rejected"
  | "runtime_permission_looking_production_readiness_coverage_matrix_input_rejected"
  | "command_exposure_looking_production_readiness_coverage_matrix_input_rejected"
  | "runtime_effect_true_production_readiness_coverage_matrix_input_rejected"
  | "process_flag_true_production_readiness_coverage_matrix_input_rejected"
  | "execution_signal_looking_production_readiness_coverage_matrix_input_rejected"
  | "valid_production_readiness_coverage_matrix_runtime_still_blocked";

export interface ProductionReadinessCoverageRuntimeRequirements {
  liveRuntimeRequired: boolean;
  databaseStorageRequired: boolean;
  secretsRequired: boolean;
  externalServicesRequired: boolean;
  networkServerRequired: boolean;
  connectorRequired: boolean;
  fabricRequired: boolean;
  webSocketHttpRequired: boolean;
  mcpTaskExecutionRequired: boolean;
  secureDropRequired: boolean;
  filesystemProcessControlRequired: boolean;
  serviceDiscoveryScheduleRequired: boolean;
}

export interface ProductionReadinessCoverageMatrixRow {
  areaNumber: number;
  areaName: string;
  ardynSpecificInterpretation: string;
  currentStatus: ProductionReadinessCoverageStatus;
  currentEvidenceInRepo: string[];
  productionGap: string;
  futurePhaseCandidate: string;
  authorizationPrerequisiteNotes: string[];
  productionRuntimeRequirements: ProductionReadinessCoverageRuntimeRequirements;
  authorizationStatusFlags: Record<string, false>;
  currentAllowedBehavior: string;
  explicitlyForbiddenCurrentBehavior: string[];
  nonAuthorizingProof: true;
}

export interface ProductionReadinessCoverageMatrixState {
  schema: "ardyn.phase-5.48.production-readiness-coverage-matrix-state";
  schemaVersion: "0.1.0";
  stateKind: "production-readiness-coverage-matrix-state";
  stateMode: "review-only";
  reviewedAt: string;
  sourceRole: string;
  sourcePhaseContext: Record<string, boolean | number | string>;
  matrixRows: ProductionReadinessCoverageMatrixRow[];
  matrixSummary: Record<string, boolean | number | string | string[]>;
  topProductionReadinessGaps: string[];
  recommendedNextPhase: string;
  productionReadinessCoverageMatrixOnly: true;
  reviewOnly: true;
  authoritative: false;
  reviewArtifactOnly: true;
  productionInfrastructureImplemented: false;
  productionReadinessCoverageMatrixIsReviewerRouting: false;
  productionReadinessCoverageMatrixIsReviewerAssignment: false;
  productionReadinessCoverageMatrixIsEvaluatorExecution: false;
  productionReadinessCoverageMatrixIsEvaluatorResult: false;
  productionReadinessCoverageMatrixIsApprovalDecision: false;
  productionReadinessCoverageMatrixIsApprovalGrant: false;
  nonAuthorizingProof: true;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
  [key: string]: unknown;
}

export interface ProductionReadinessCoverageMatrixResult {
  schema: "ardyn.phase-5.48.production-readiness-coverage-matrix-result";
  schemaVersion: "0.1.0";
  productionReadinessCoverageMatrixKind: "production-readiness-coverage-matrix";
  productionReadinessCoverageMatrixMode: "review-only";
  reviewedAt: string;
  classification: ProductionReadinessCoverageMatrixClassification;
  productionReadinessCoverageMatrixProduced: boolean;
  productionReadinessCoverageMatrix:
    | ProductionReadinessCoverageMatrixState
    | null;
  matrixSummary: ProductionReadinessCoverageMatrixState["matrixSummary"] | null;
  matrixRows: ProductionReadinessCoverageMatrixRow[];
  topProductionReadinessGaps: string[];
  recommendedNextPhase: string | null;
  productionReadinessCoverageMatrixOnly: true;
  reviewOnly: true;
  authoritative: false;
  reviewArtifactOnly: true;
  productionInfrastructureImplemented: false;
  productionReadinessCoverageMatrixIsReviewerRouting: false;
  productionReadinessCoverageMatrixIsReviewerAssignment: false;
  productionReadinessCoverageMatrixIsEvaluatorExecution: false;
  productionReadinessCoverageMatrixIsEvaluatorResult: false;
  productionReadinessCoverageMatrixIsApprovalDecision: false;
  productionReadinessCoverageMatrixIsApprovalGrant: false;
  nonAuthorizingProof: true;
  rejectionReasons: string[];
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
  [key: string]: unknown;
}

export type ConsumerDisplayAccessibilityContractMapClassification =
  | "valid_consumer_display_accessibility_contract_map_runtime_still_blocked"
  | "malformed_consumer_display_accessibility_contract_map_input_rejected"
  | "grant_looking_consumer_display_accessibility_contract_map_input_rejected"
  | "approval_decision_looking_consumer_display_accessibility_contract_map_input_rejected"
  | "evaluator_result_looking_consumer_display_accessibility_contract_map_input_rejected"
  | "evaluator_execution_looking_consumer_display_accessibility_contract_map_input_rejected"
  | "reviewer_routing_looking_consumer_display_accessibility_contract_map_input_rejected"
  | "reviewer_assignment_looking_consumer_display_accessibility_contract_map_input_rejected"
  | "ui_interactivity_looking_consumer_display_accessibility_contract_map_input_rejected"
  | "runtime_permission_looking_consumer_display_accessibility_contract_map_input_rejected"
  | "command_exposure_looking_consumer_display_accessibility_contract_map_input_rejected"
  | "database_storage_looking_consumer_display_accessibility_contract_map_input_rejected"
  | "secrets_looking_consumer_display_accessibility_contract_map_input_rejected"
  | "connector_fabric_network_looking_consumer_display_accessibility_contract_map_input_rejected"
  | "secure_drop_looking_consumer_display_accessibility_contract_map_input_rejected"
  | "mcp_task_service_discovery_schedule_looking_consumer_display_accessibility_contract_map_input_rejected"
  | "process_control_looking_consumer_display_accessibility_contract_map_input_rejected"
  | "runtime_effect_true_consumer_display_accessibility_contract_map_input_rejected";

export interface ConsumerDisplayAccessibilityRequirementNotes {
  readableLabel: string;
  shortDescription: string;
  longDescription: string;
  severityStatusVocabulary: string[];
  keyboardScreenReaderDisplayNotes: string;
  colorIndependentStatusIndicatorRequired: true;
  reducedMotionDefaultStaticDisplayRequired: true;
  noAutoExecutionNoHiddenActionSemantics: true;
}

export interface ConsumerDisplayAccessibilityContractEntry {
  consumerName: "Locus" | "Multiverse";
  displaySurfaceId: string;
  sourceArdynArtifactType: string;
  allowedDisplayBehavior: string;
  forbiddenDisplayBehavior: string[];
  accessibilityRequirementNotes: ConsumerDisplayAccessibilityRequirementNotes;
  requiredFutureContractBeforeInteractivity: string;
  authorizationFlags: Record<string, false>;
  nonAuthorizingProof: true;
}

export interface ConsumerDisplayAccessibilityContractMapState {
  schema: "ardyn.phase-5.49.consumer-display-accessibility-contract-map-state";
  schemaVersion: "0.1.0";
  stateKind: "consumer-display-accessibility-contract-map-state";
  stateMode: "review-only";
  reviewedAt: string;
  sourcePhaseContext: Record<string, boolean | string>;
  displayContractEntries: ConsumerDisplayAccessibilityContractEntry[];
  contractMapSummary: Record<string, boolean | number | string | string[]>;
  topDisplayAccessibilityGaps: string[];
  recommendedNextPhase: string;
  consumerDisplayAccessibilityContractMapOnly: true;
  reviewOnly: true;
  authoritative: false;
  reviewArtifactOnly: true;
  nonAuthorizingProof: true;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
  [key: string]: unknown;
}

export interface ConsumerDisplayAccessibilityContractMapResult {
  schema: "ardyn.phase-5.49.consumer-display-accessibility-contract-map-result";
  schemaVersion: "0.1.0";
  consumerDisplayAccessibilityContractMapKind: "consumer-display-accessibility-contract-map";
  consumerDisplayAccessibilityContractMapMode: "review-only";
  reviewedAt: string;
  classification: ConsumerDisplayAccessibilityContractMapClassification;
  consumerDisplayAccessibilityContractMapProduced: boolean;
  consumerDisplayAccessibilityContractMap:
    | ConsumerDisplayAccessibilityContractMapState
    | null;
  contractMapSummary:
    | ConsumerDisplayAccessibilityContractMapState["contractMapSummary"]
    | null;
  displayContractEntries: ConsumerDisplayAccessibilityContractEntry[];
  topDisplayAccessibilityGaps: string[];
  recommendedNextPhase: string | null;
  consumerDisplayAccessibilityContractMapOnly: true;
  reviewOnly: true;
  authoritative: false;
  reviewArtifactOnly: true;
  nonAuthorizingProof: true;
  rejectionReasons: string[];
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
  [key: string]: unknown;
}

export type ConsumerDisplayFixtureSchemaBoundaryClassification =
  | "valid_consumer_display_fixture_schema_boundary_runtime_still_blocked"
  | "malformed_consumer_display_fixture_schema_boundary_input_rejected"
  | "missing_required_consumer_display_fixture_schema_boundary_entry_rejected"
  | "unknown_consumer_name_consumer_display_fixture_schema_boundary_input_rejected"
  | "unknown_display_intent_consumer_display_fixture_schema_boundary_input_rejected"
  | "interactive_actionable_intent_consumer_display_fixture_schema_boundary_input_rejected"
  | "authorization_flags_enabled_consumer_display_fixture_schema_boundary_input_rejected"
  | "nested_unsafe_flags_consumer_display_fixture_schema_boundary_input_rejected"
  | "hidden_command_runtime_semantics_consumer_display_fixture_schema_boundary_input_rejected"
  | "secure_drop_implementation_semantics_consumer_display_fixture_schema_boundary_input_rejected"
  | "websocket_http_fabric_mcp_task_execution_semantics_consumer_display_fixture_schema_boundary_input_rejected";

export interface ConsumerDisplayFixtureAccessibilityFields {
  keyboardScreenReaderDisplayNotes: string;
  colorIndependentStatusIndicatorRequired: true;
  reducedMotionDefaultStaticDisplayRequired: true;
  noAutoExecutionNoHiddenActionSemantics: true;
  colorOnlyStatusForbidden: true;
  motionRequiredForStatusForbidden: true;
}

export interface ConsumerDisplayFixtureRecursiveUnsafeInputFlags {
  unsafeInputFlagsPresent: false;
  nestedUnsafeFlagTruePresent: false;
  nestedAuthorizationFlagTruePresent: false;
  hiddenCommandRuntimeSemanticsPresent: false;
  secureDropImplementationSemanticsPresent: false;
  websocketHttpFabricMcpTaskExecutionSemanticsPresent: false;
}

export interface ConsumerDisplayFixtureSchemaBoundaryEntry {
  fixtureId: string;
  consumerName: "Locus" | "Multiverse";
  displaySurfaceId: string;
  sourceArdynArtifactType: string;
  displayIntent: "metadata_only";
  readableLabel: string;
  shortDescription: string;
  longDescription: string;
  statusSeverityVocabulary: string[];
  accessibilityFields: ConsumerDisplayFixtureAccessibilityFields;
  allowedDisplayBehavior: string;
  forbiddenDisplayBehavior: string[];
  requiredFutureContractBeforeInteractivity: string;
  blockedAuthorizationFlags: Record<string, false>;
  recursiveUnsafeInputFlags: ConsumerDisplayFixtureRecursiveUnsafeInputFlags;
  nonAuthorizingProof: true;
}

export interface ConsumerDisplayFixtureSchemaBoundaryState {
  schema: "ardyn.phase-5.50.consumer-display-fixture-schema-boundary-state";
  schemaVersion: "0.1.0";
  stateKind: "consumer-display-fixture-schema-boundary-state";
  stateMode: "review-only";
  reviewedAt: string;
  sourcePhaseContext: Record<string, boolean | string>;
  displayFixtureEntries: ConsumerDisplayFixtureSchemaBoundaryEntry[];
  schemaBoundarySummary: Record<string, boolean | number | string | string[]>;
  invalidFixtureCasePolicy: Record<string, boolean>;
  topDisplayFixtureSchemaGaps: string[];
  recommendedNextPhase: string;
  consumerDisplayFixtureSchemaBoundaryOnly: true;
  reviewOnly: true;
  authoritative: false;
  reviewArtifactOnly: true;
  nonAuthorizingProof: true;
  renderingCodeImplemented: false;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
  [key: string]: unknown;
}

export interface ConsumerDisplayFixtureSchemaBoundaryResult {
  schema: "ardyn.phase-5.50.consumer-display-fixture-schema-boundary-result";
  schemaVersion: "0.1.0";
  consumerDisplayFixtureSchemaBoundaryKind: "consumer-display-fixture-schema-boundary";
  consumerDisplayFixtureSchemaBoundaryMode: "review-only";
  reviewedAt: string;
  classification: ConsumerDisplayFixtureSchemaBoundaryClassification;
  consumerDisplayFixtureSchemaBoundaryProduced: boolean;
  consumerDisplayFixtureSchemaBoundary:
    | ConsumerDisplayFixtureSchemaBoundaryState
    | null;
  schemaBoundarySummary:
    | ConsumerDisplayFixtureSchemaBoundaryState["schemaBoundarySummary"]
    | null;
  displayFixtureEntries: ConsumerDisplayFixtureSchemaBoundaryEntry[];
  invalidFixtureCasePolicy: Record<string, boolean>;
  topDisplayFixtureSchemaGaps: string[];
  recommendedNextPhase: string | null;
  consumerDisplayFixtureSchemaBoundaryOnly: true;
  reviewOnly: true;
  authoritative: false;
  reviewArtifactOnly: true;
  nonAuthorizingProof: true;
  renderingCodeImplemented: false;
  rejectionReasons: string[];
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
  [key: string]: unknown;
}

export type ConsumerDisplayFixtureExamplePackClassification =
  | "valid_consumer_display_fixture_example_pack_runtime_still_blocked"
  | "malformed_consumer_display_fixture_example_pack_input_rejected"
  | "missing_required_consumer_display_fixture_example_rejected"
  | "unknown_consumer_name_consumer_display_fixture_example_rejected"
  | "unknown_display_intent_consumer_display_fixture_example_rejected"
  | "interactive_actionable_intent_consumer_display_fixture_example_rejected"
  | "authorization_flags_enabled_consumer_display_fixture_example_rejected"
  | "nested_unsafe_flags_consumer_display_fixture_example_rejected"
  | "hidden_command_runtime_semantics_consumer_display_fixture_example_rejected"
  | "secure_drop_implementation_semantics_consumer_display_fixture_example_rejected"
  | "websocket_http_fabric_mcp_task_execution_semantics_consumer_display_fixture_example_rejected";

export interface ConsumerDisplayFixtureExamplePayload {
  payloadKind: string;
  primaryStatus: string;
  secondaryStatus: string;
  staticTextRows: string[];
  statusTokens: string[];
  colorIndependentIndicator: string;
  motionPolicy: string;
  hiddenActionPolicy: string;
}

export interface ConsumerDisplayFixtureExampleEntry
  extends ConsumerDisplayFixtureSchemaBoundaryEntry {
  exampleKind: "consumer-display-fixture-example";
  exampleScenario: string;
  phase550SchemaBoundaryFixtureId: string;
  accessibilityNotes: ConsumerDisplayFixtureAccessibilityFields;
  explicitBlockedAuthorizationFlags: Record<string, false>;
  displayFixtureExamplePayload: ConsumerDisplayFixtureExamplePayload;
  conformsToPhase550Boundary: true;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
}

export interface ConsumerDisplayFixtureExamplePackState {
  schema: "ardyn.phase-5.51.consumer-display-fixture-example-pack-state";
  schemaVersion: "0.1.0";
  stateKind: "consumer-display-fixture-example-pack-state";
  stateMode: "review-only";
  reviewedAt: string;
  sourcePhaseContext: Record<string, boolean | string>;
  phase550SubagentAuditTrailReconciliation: Record<string, boolean | string>;
  fixtureExamples: ConsumerDisplayFixtureExampleEntry[];
  examplePackSummary: Record<string, boolean | number | string | string[]>;
  phase550BoundaryConformance: Record<string, boolean | string>;
  invalidExampleCasePolicy: Record<string, boolean>;
  topDisplayFixtureExampleGaps: string[];
  recommendedNextPhase: string;
  consumerDisplayFixtureExamplePackOnly: true;
  reviewOnly: true;
  authoritative: false;
  reviewArtifactOnly: true;
  nonAuthorizingProof: true;
  renderingCodeImplemented: false;
  externalLookupsEnabled: false;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
  [key: string]: unknown;
}

export interface ConsumerDisplayFixtureExamplePackResult {
  schema: "ardyn.phase-5.51.consumer-display-fixture-example-pack-result";
  schemaVersion: "0.1.0";
  consumerDisplayFixtureExamplePackKind: "consumer-display-fixture-example-pack";
  consumerDisplayFixtureExamplePackMode: "review-only";
  reviewedAt: string;
  classification: ConsumerDisplayFixtureExamplePackClassification;
  consumerDisplayFixtureExamplePackProduced: boolean;
  consumerDisplayFixtureExamplePack: ConsumerDisplayFixtureExamplePackState | null;
  examplePackSummary:
    | ConsumerDisplayFixtureExamplePackState["examplePackSummary"]
    | null;
  phase550BoundaryConformance:
    | ConsumerDisplayFixtureExamplePackState["phase550BoundaryConformance"]
    | null;
  fixtureExamples: ConsumerDisplayFixtureExampleEntry[];
  invalidExampleCasePolicy: Record<string, boolean>;
  topDisplayFixtureExampleGaps: string[];
  recommendedNextPhase: string | null;
  consumerDisplayFixtureExamplePackOnly: true;
  reviewOnly: true;
  authoritative: false;
  reviewArtifactOnly: true;
  nonAuthorizingProof: true;
  renderingCodeImplemented: false;
  externalLookupsEnabled: false;
  rejectionReasons: string[];
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
  [key: string]: unknown;
}

export type ConsumerDisplayFixtureConformanceHandoffClassification =
  | "valid_consumer_display_fixture_conformance_handoff_runtime_still_blocked"
  | "malformed_consumer_display_fixture_conformance_handoff_input_rejected"
  | "missing_required_consumer_display_fixture_conformance_handoff_entry_rejected"
  | "unknown_consumer_name_consumer_display_fixture_conformance_handoff_input_rejected"
  | "unknown_display_intent_consumer_display_fixture_conformance_handoff_input_rejected"
  | "interactive_actionable_intent_consumer_display_fixture_conformance_handoff_input_rejected"
  | "authorization_flags_enabled_consumer_display_fixture_conformance_handoff_input_rejected"
  | "unsafe_import_execution_flags_consumer_display_fixture_conformance_handoff_input_rejected"
  | "hidden_import_execution_runtime_semantics_consumer_display_fixture_conformance_handoff_input_rejected"
  | "secure_drop_implementation_semantics_consumer_display_fixture_conformance_handoff_input_rejected"
  | "websocket_http_fabric_mcp_task_execution_semantics_consumer_display_fixture_conformance_handoff_input_rejected"
  | "unknown_reference_consumer_display_fixture_conformance_handoff_input_rejected"
  | "nested_unsafe_flags_consumer_display_fixture_conformance_handoff_input_rejected"
  | "consumer_runner_import_export_implementation_semantics_consumer_display_fixture_conformance_handoff_input_rejected";

export interface ConsumerDisplayFixtureConformanceHandoffUnsafeImportExecutionFlags {
  fixtureImportEnabled: false;
  fixtureExportEnabled: false;
  fixtureImportCommandImplemented: false;
  fixtureExportCommandImplemented: false;
  importToolImplemented: false;
  exportToolImplemented: false;
  consumerConformanceRunnerImplemented: false;
  consumerConformanceRunnerEnabled: false;
  consumerRunnerExecutionEnabled: false;
  browserRenderingHarnessImplemented: false;
  hiddenImportSemanticsEnabled: false;
  hiddenExecutionSemanticsEnabled: false;
  hiddenRuntimeImportSemanticsEnabled: false;
  externalLookupEnabled: false;
}

export interface ConsumerDisplayFixtureConformanceHandoffEntry {
  handoffId: string;
  consumerName: "Locus" | "Multiverse";
  displaySurfaceId: string;
  sourceArdynArtifactType: string;
  handoffIntent: "metadata_only";
  referencedPhase550SchemaBoundaryId: string;
  referencedPhase551FixtureId: string;
  referencedFixtureGroup: string;
  expectedConsumerSideValidationResponsibility: string;
  allowedConsumerBehavior: string;
  forbiddenConsumerBehavior: string[];
  accessibilityConformanceExpectations: ConsumerDisplayFixtureAccessibilityFields;
  requiredFutureContractBeforeInteractivity: string;
  explicitBlockedAuthorizationFlags: Record<string, false>;
  unsafeImportExecutionFlags: ConsumerDisplayFixtureConformanceHandoffUnsafeImportExecutionFlags;
  consumerTargetOnly: true;
  consumerOwnedRunnerImplemented: false;
  fixtureImportCommandImplemented: false;
  fixtureExportCommandImplemented: false;
  browserRenderingHarnessImplemented: false;
  nonAuthorizingProof: true;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
}

export interface ConsumerDisplayFixtureConformanceHandoffState {
  schema: "ardyn.phase-5.52.consumer-display-fixture-conformance-handoff-state";
  schemaVersion: "0.1.0";
  stateKind: "consumer-display-fixture-conformance-handoff-state";
  stateMode: "review-only";
  reviewedAt: string;
  sourcePhaseContext: Record<string, boolean | string>;
  handoffEntries: ConsumerDisplayFixtureConformanceHandoffEntry[];
  handoffSummary: Record<string, boolean | number | string | string[]>;
  phase550SchemaBoundaryReference: Record<string, boolean | string>;
  phase551ExamplePackReference: Record<string, boolean | string>;
  invalidHandoffCasePolicy: Record<string, boolean>;
  topDisplayConformanceGaps: string[];
  recommendedNextPhase: string;
  consumerDisplayFixtureConformanceHandoffOnly: true;
  reviewOnly: true;
  authoritative: false;
  reviewArtifactOnly: true;
  nonAuthorizingProof: true;
  renderingCodeImplemented: false;
  browserRenderingHarnessImplemented: false;
  fixtureImportCommandImplemented: false;
  fixtureExportCommandImplemented: false;
  fixtureImportExportCommandsImplemented: false;
  consumerOwnedRunnerImplemented: false;
  consumerConformanceRunnerImplemented: false;
  externalLookupsEnabled: false;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
  [key: string]: unknown;
}

export interface ConsumerDisplayFixtureConformanceHandoffResult {
  schema: "ardyn.phase-5.52.consumer-display-fixture-conformance-handoff-result";
  schemaVersion: "0.1.0";
  consumerDisplayFixtureConformanceHandoffKind: "consumer-display-fixture-conformance-handoff";
  consumerDisplayFixtureConformanceHandoffMode: "review-only";
  reviewedAt: string;
  classification: ConsumerDisplayFixtureConformanceHandoffClassification;
  consumerDisplayFixtureConformanceHandoffProduced: boolean;
  consumerDisplayFixtureConformanceHandoff:
    | ConsumerDisplayFixtureConformanceHandoffState
    | null;
  handoffSummary:
    | ConsumerDisplayFixtureConformanceHandoffState["handoffSummary"]
    | null;
  phase550SchemaBoundaryReference:
    | ConsumerDisplayFixtureConformanceHandoffState["phase550SchemaBoundaryReference"]
    | null;
  phase551ExamplePackReference:
    | ConsumerDisplayFixtureConformanceHandoffState["phase551ExamplePackReference"]
    | null;
  handoffEntries: ConsumerDisplayFixtureConformanceHandoffEntry[];
  invalidHandoffCasePolicy: Record<string, boolean>;
  topDisplayConformanceGaps: string[];
  recommendedNextPhase: string | null;
  consumerDisplayFixtureConformanceHandoffOnly: true;
  reviewOnly: true;
  authoritative: false;
  reviewArtifactOnly: true;
  nonAuthorizingProof: true;
  renderingCodeImplemented: false;
  browserRenderingHarnessImplemented: false;
  fixtureImportCommandImplemented: false;
  fixtureExportCommandImplemented: false;
  fixtureImportExportCommandsImplemented: false;
  consumerOwnedRunnerImplemented: false;
  consumerConformanceRunnerImplemented: false;
  externalLookupsEnabled: false;
  rejectionReasons: string[];
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
  [key: string]: unknown;
}

export type ConsumerOwnedDisplayConformanceRunnerRequirementsClassification =
  | "valid_consumer_owned_display_conformance_runner_requirements_runtime_still_blocked"
  | "malformed_consumer_owned_display_conformance_runner_requirements_input_rejected"
  | "missing_required_consumer_owned_display_conformance_runner_requirement_rejected"
  | "unknown_consumer_name_consumer_owned_display_conformance_runner_requirements_input_rejected"
  | "unknown_requirements_intent_consumer_owned_display_conformance_runner_requirements_input_rejected"
  | "interactive_actionable_intent_consumer_owned_display_conformance_runner_requirements_input_rejected"
  | "authorization_flags_enabled_consumer_owned_display_conformance_runner_requirements_input_rejected"
  | "unsafe_runner_import_export_runtime_flags_consumer_owned_display_conformance_runner_requirements_input_rejected"
  | "hidden_runner_import_export_runtime_semantics_consumer_owned_display_conformance_runner_requirements_input_rejected"
  | "secure_drop_implementation_semantics_consumer_owned_display_conformance_runner_requirements_input_rejected"
  | "websocket_http_fabric_mcp_task_execution_semantics_consumer_owned_display_conformance_runner_requirements_input_rejected"
  | "unknown_reference_consumer_owned_display_conformance_runner_requirements_input_rejected"
  | "nested_unsafe_flags_consumer_owned_display_conformance_runner_requirements_input_rejected"
  | "runner_import_export_implementation_semantics_consumer_owned_display_conformance_runner_requirements_input_rejected";

export interface ConsumerOwnedDisplayConformanceRunnerRequirementsUnsafeFlags {
  runnerEnabled: false;
  runnerImplementedByArdyn: false;
  runnerExecutesFixtures: false;
  fixtureImportEnabled: false;
  fixtureExportEnabled: false;
  importExportCommandImplemented: false;
  packageExportImplemented: false;
  consumerSideCiImplemented: false;
  fixtureDiscoveryRuntimeImplemented: false;
  liveRegistryAccessEnabled: false;
  externalLookupEnabled: false;
  filesystemScanningEnabled: false;
  processControlEnabled: false;
  hiddenRunnerSemanticsEnabled: false;
  hiddenImportSemanticsEnabled: false;
  hiddenExportSemanticsEnabled: false;
  hiddenRuntimeSemanticsEnabled: false;
}

export interface ConsumerOwnedDisplayConformanceRunnerRequirementEntry {
  requirementId: string;
  consumerName: "Locus" | "Multiverse";
  displaySurfaceId: string;
  sourceArdynArtifactType: string;
  requirementsIntent: "metadata_only";
  referencedPhase550SchemaBoundaryId: string;
  referencedPhase551FixtureId: string;
  referencedPhase551FixtureGroup: string;
  referencedPhase552HandoffId: string;
  expectedConsumerOwnedRunnerResponsibility: string;
  allowedFutureRunnerBehavior: string;
  forbiddenCurrentArdynBehavior: string[];
  accessibilityWcagValidationExpectations:
    ConsumerDisplayFixtureAccessibilityFields &
      Record<string, boolean | string>;
  fixtureDeterminismExpectations: {
    deterministicFixtureIdsRequired: true;
    deterministicOrderingRequired: true;
    deterministicStatusVocabularyRequired: true;
    noClockNetworkRandomnessAllowed: true;
    consumerRunnerOutputMustBeReviewOnly: true;
  };
  requiredFutureContractBeforeInteractivity: string;
  explicitBlockedAuthorizationFlags: Record<string, false>;
  unsafeRunnerImportExportRuntimeFlags:
    ConsumerOwnedDisplayConformanceRunnerRequirementsUnsafeFlags;
  consumerTargetOnly: true;
  runnerImplementedByArdyn: false;
  importExportCommandImplemented: false;
  browserRenderingHarnessImplemented: false;
  packageExportImplemented: false;
  consumerSideCiImplemented: false;
  fixtureDiscoveryRuntimeImplemented: false;
  consumerRepoModifiedByArdyn: false;
  nonAuthorizingProof: true;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
}

export interface ConsumerOwnedDisplayConformanceRunnerRequirementsState {
  schema: "ardyn.phase-5.53.consumer-owned-display-conformance-runner-requirements-state";
  schemaVersion: "0.1.0";
  stateKind: "consumer-owned-display-conformance-runner-requirements-state";
  stateMode: "review-only";
  reviewedAt: string;
  sourcePhaseContext: Record<string, boolean | string>;
  phase552SubagentAuditTrailReconciliation: Record<string, string>;
  requirementEntries: ConsumerOwnedDisplayConformanceRunnerRequirementEntry[];
  requirementsSummary: Record<string, boolean | number | string | string[]>;
  phase550SchemaBoundaryReference: Record<string, boolean | string>;
  phase551ExamplePackReference: Record<string, boolean | string>;
  phase552ConformanceHandoffReference: Record<string, boolean | string>;
  invalidRequirementCasePolicy: Record<string, boolean>;
  topDisplayConformanceRunnerRequirementGaps: string[];
  recommendedNextPhase: string;
  consumerOwnedDisplayConformanceRunnerRequirementsOnly: true;
  reviewOnly: true;
  authoritative: false;
  reviewArtifactOnly: true;
  nonAuthorizingProof: true;
  renderingCodeImplemented: false;
  browserRenderingHarnessImplemented: false;
  runnerImplementedByArdyn: false;
  consumerOwnedRunnerImplemented: false;
  consumerConformanceRunnerImplemented: false;
  fixtureImportCommandImplemented: false;
  fixtureExportCommandImplemented: false;
  fixtureImportExportCommandsImplemented: false;
  importExportCommandImplemented: false;
  packageExportImplemented: false;
  consumerSideCiImplemented: false;
  fixtureDiscoveryRuntimeImplemented: false;
  consumerRepoModifiedByArdyn: false;
  externalLookupsEnabled: false;
  filesystemScanningEnabled: false;
  processControlEnabled: false;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
  [key: string]: unknown;
}

export interface ConsumerOwnedDisplayConformanceRunnerRequirementsResult {
  schema: "ardyn.phase-5.53.consumer-owned-display-conformance-runner-requirements-result";
  schemaVersion: "0.1.0";
  consumerOwnedDisplayConformanceRunnerRequirementsKind:
    "consumer-owned-display-conformance-runner-requirements";
  consumerOwnedDisplayConformanceRunnerRequirementsMode: "review-only";
  reviewedAt: string;
  classification: ConsumerOwnedDisplayConformanceRunnerRequirementsClassification;
  consumerOwnedDisplayConformanceRunnerRequirementsProduced: boolean;
  consumerOwnedDisplayConformanceRunnerRequirements:
    | ConsumerOwnedDisplayConformanceRunnerRequirementsState
    | null;
  requirementsSummary:
    | ConsumerOwnedDisplayConformanceRunnerRequirementsState["requirementsSummary"]
    | null;
  phase550SchemaBoundaryReference:
    | ConsumerOwnedDisplayConformanceRunnerRequirementsState["phase550SchemaBoundaryReference"]
    | null;
  phase551ExamplePackReference:
    | ConsumerOwnedDisplayConformanceRunnerRequirementsState["phase551ExamplePackReference"]
    | null;
  phase552ConformanceHandoffReference:
    | ConsumerOwnedDisplayConformanceRunnerRequirementsState["phase552ConformanceHandoffReference"]
    | null;
  phase552SubagentAuditTrailReconciliation:
    | ConsumerOwnedDisplayConformanceRunnerRequirementsState["phase552SubagentAuditTrailReconciliation"]
    | null;
  requirementEntries: ConsumerOwnedDisplayConformanceRunnerRequirementEntry[];
  invalidRequirementCasePolicy: Record<string, boolean>;
  topDisplayConformanceRunnerRequirementGaps: string[];
  recommendedNextPhase: string | null;
  consumerOwnedDisplayConformanceRunnerRequirementsOnly: true;
  reviewOnly: true;
  authoritative: false;
  reviewArtifactOnly: true;
  nonAuthorizingProof: true;
  renderingCodeImplemented: false;
  browserRenderingHarnessImplemented: false;
  runnerImplementedByArdyn: false;
  consumerOwnedRunnerImplemented: false;
  consumerConformanceRunnerImplemented: false;
  fixtureImportCommandImplemented: false;
  fixtureExportCommandImplemented: false;
  fixtureImportExportCommandsImplemented: false;
  importExportCommandImplemented: false;
  packageExportImplemented: false;
  consumerSideCiImplemented: false;
  fixtureDiscoveryRuntimeImplemented: false;
  consumerRepoModifiedByArdyn: false;
  externalLookupsEnabled: false;
  filesystemScanningEnabled: false;
  processControlEnabled: false;
  rejectionReasons: string[];
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
  [key: string]: unknown;
}

export type ConsumerOwnedDisplayConformanceRunnerTestPlanClassification =
  | "valid_consumer_owned_display_conformance_runner_test_plan_runtime_still_blocked"
  | "malformed_consumer_owned_display_conformance_runner_test_plan_input_rejected"
  | "missing_required_consumer_owned_display_conformance_runner_test_plan_entry_rejected"
  | "unknown_consumer_name_consumer_owned_display_conformance_runner_test_plan_input_rejected"
  | "unknown_test_plan_intent_consumer_owned_display_conformance_runner_test_plan_input_rejected"
  | "interactive_actionable_intent_consumer_owned_display_conformance_runner_test_plan_input_rejected"
  | "authorization_flags_enabled_consumer_owned_display_conformance_runner_test_plan_input_rejected"
  | "unsafe_runner_import_export_test_harness_runtime_flags_consumer_owned_display_conformance_runner_test_plan_input_rejected"
  | "hidden_runner_import_export_test_harness_runtime_semantics_consumer_owned_display_conformance_runner_test_plan_input_rejected"
  | "secure_drop_implementation_semantics_consumer_owned_display_conformance_runner_test_plan_input_rejected"
  | "websocket_http_fabric_mcp_task_execution_semantics_consumer_owned_display_conformance_runner_test_plan_input_rejected"
  | "unknown_reference_consumer_owned_display_conformance_runner_test_plan_input_rejected"
  | "nested_unsafe_flags_consumer_owned_display_conformance_runner_test_plan_input_rejected"
  | "noncanonical_consumer_owned_display_conformance_runner_test_plan_input_rejected"
  | "runner_test_harness_import_export_implementation_semantics_consumer_owned_display_conformance_runner_test_plan_input_rejected";

export interface ConsumerOwnedDisplayConformanceRunnerTestPlanUnsafeFlags {
  runnerEnabled: false;
  runnerImplementedByArdyn: false;
  runnerExecutesFixtures: false;
  testHarnessEnabled: false;
  testHarnessImplementedByArdyn: false;
  testHarnessExecutionEnabled: false;
  executableTestHarnessImplemented: false;
  consumerTestRunnerImplemented: false;
  testPlanExecutionEnabled: false;
  fixtureImportEnabled: false;
  fixtureExportEnabled: false;
  importExportCommandImplemented: false;
  packageExportImplemented: false;
  consumerSideCiImplemented: false;
  fixtureDiscoveryRuntimeImplemented: false;
  liveRegistryAccessEnabled: false;
  externalLookupEnabled: false;
  filesystemScanningEnabled: false;
  processControlEnabled: false;
  browserWcagAutomationImplemented: false;
  visualRegressionHarnessImplemented: false;
  screenReaderAutomationImplemented: false;
  hiddenRunnerSemanticsEnabled: false;
  hiddenTestHarnessSemanticsEnabled: false;
  hiddenImportSemanticsEnabled: false;
  hiddenExportSemanticsEnabled: false;
  hiddenRuntimeSemanticsEnabled: false;
}

export interface ConsumerOwnedDisplayConformanceRunnerTestPlanEntry {
  testPlanId: string;
  consumerName: "Locus" | "Multiverse";
  displaySurfaceId: string;
  sourceArdynArtifactType: string;
  testPlanIntent: "metadata_only";
  referencedPhase550SchemaBoundaryId: string;
  referencedPhase551FixtureId: string;
  referencedPhase551FixtureGroup: string;
  referencedPhase552HandoffId: string;
  referencedPhase553RunnerRequirementId: string;
  futureConsumerOwnedTestResponsibility: string;
  expectedAssertions: string[];
  allowedFutureTestBehavior: string;
  forbiddenCurrentArdynBehavior: string[];
  accessibilityWcagAssertionNotes:
    ConsumerDisplayFixtureAccessibilityFields &
      Record<string, boolean | string>;
  fixtureDeterminismExpectations: {
    deterministicFixtureIdsRequired: true;
    deterministicOrderingRequired: true;
    deterministicStatusVocabularyRequired: true;
    deterministicTestPlanIdsRequired: true;
    deterministicExpectedAssertionsRequired: true;
    noClockNetworkRandomnessAllowed: true;
    consumerOwnedTestOutputMustBeReviewOnly: true;
  };
  requiredFutureContractBeforeExecutableRunner: string;
  explicitBlockedAuthorizationFlags: Record<string, false>;
  unsafeRunnerImportExportTestHarnessRuntimeFlags:
    ConsumerOwnedDisplayConformanceRunnerTestPlanUnsafeFlags;
  consumerTargetOnly: true;
  runnerImplementedByArdyn: false;
  testHarnessImplementedByArdyn: false;
  importExportCommandImplemented: false;
  browserRenderingHarnessImplemented: false;
  packageExportImplemented: false;
  consumerSideCiImplemented: false;
  fixtureDiscoveryRuntimeImplemented: false;
  consumerRepoModifiedByArdyn: false;
  nonAuthorizingProof: true;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
}

export interface ConsumerOwnedDisplayConformanceRunnerTestPlanState {
  schema: "ardyn.phase-5.54.consumer-owned-display-conformance-runner-test-plan-state";
  schemaVersion: "0.1.0";
  stateKind: "consumer-owned-display-conformance-runner-test-plan-state";
  stateMode: "review-only";
  reviewedAt: string;
  sourcePhaseContext: Record<string, boolean | string>;
  testPlanEntries: ConsumerOwnedDisplayConformanceRunnerTestPlanEntry[];
  testPlanSummary: Record<string, boolean | number | string | string[]>;
  phase550SchemaBoundaryReference: Record<string, boolean | string>;
  phase551ExamplePackReference: Record<string, boolean | string>;
  phase552ConformanceHandoffReference: Record<string, boolean | string>;
  phase553RunnerRequirementsReference: Record<string, boolean | string>;
  invalidTestPlanCasePolicy: Record<string, boolean>;
  topDisplayConformanceRunnerTestPlanGaps: string[];
  recommendedNextPhase: string;
  consumerOwnedDisplayConformanceRunnerTestPlanOnly: true;
  reviewOnly: true;
  authoritative: false;
  reviewArtifactOnly: true;
  nonAuthorizingProof: true;
  renderingCodeImplemented: false;
  browserRenderingHarnessImplemented: false;
  runnerImplementedByArdyn: false;
  testHarnessImplementedByArdyn: false;
  consumerOwnedRunnerImplemented: false;
  consumerConformanceRunnerImplemented: false;
  fixtureImportCommandImplemented: false;
  fixtureExportCommandImplemented: false;
  fixtureImportExportCommandsImplemented: false;
  importExportCommandImplemented: false;
  packageExportImplemented: false;
  consumerSideCiImplemented: false;
  fixtureDiscoveryRuntimeImplemented: false;
  consumerRepoModifiedByArdyn: false;
  browserWcagAutomationImplemented: false;
  visualRegressionHarnessImplemented: false;
  screenReaderAutomationImplemented: false;
  externalLookupsEnabled: false;
  filesystemScanningEnabled: false;
  processControlEnabled: false;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
  [key: string]: unknown;
}

export interface ConsumerOwnedDisplayConformanceRunnerTestPlanResult {
  schema: "ardyn.phase-5.54.consumer-owned-display-conformance-runner-test-plan-result";
  schemaVersion: "0.1.0";
  consumerOwnedDisplayConformanceRunnerTestPlanKind:
    "consumer-owned-display-conformance-runner-test-plan";
  consumerOwnedDisplayConformanceRunnerTestPlanMode: "review-only";
  reviewedAt: string;
  classification: ConsumerOwnedDisplayConformanceRunnerTestPlanClassification;
  consumerOwnedDisplayConformanceRunnerTestPlanProduced: boolean;
  consumerOwnedDisplayConformanceRunnerTestPlan:
    | ConsumerOwnedDisplayConformanceRunnerTestPlanState
    | null;
  testPlanSummary:
    | ConsumerOwnedDisplayConformanceRunnerTestPlanState["testPlanSummary"]
    | null;
  phase550SchemaBoundaryReference:
    | ConsumerOwnedDisplayConformanceRunnerTestPlanState["phase550SchemaBoundaryReference"]
    | null;
  phase551ExamplePackReference:
    | ConsumerOwnedDisplayConformanceRunnerTestPlanState["phase551ExamplePackReference"]
    | null;
  phase552ConformanceHandoffReference:
    | ConsumerOwnedDisplayConformanceRunnerTestPlanState["phase552ConformanceHandoffReference"]
    | null;
  phase553RunnerRequirementsReference:
    | ConsumerOwnedDisplayConformanceRunnerTestPlanState["phase553RunnerRequirementsReference"]
    | null;
  testPlanEntries: ConsumerOwnedDisplayConformanceRunnerTestPlanEntry[];
  invalidTestPlanCasePolicy: Record<string, boolean>;
  topDisplayConformanceRunnerTestPlanGaps: string[];
  recommendedNextPhase: string | null;
  consumerOwnedDisplayConformanceRunnerTestPlanOnly: true;
  reviewOnly: true;
  authoritative: false;
  reviewArtifactOnly: true;
  nonAuthorizingProof: true;
  renderingCodeImplemented: false;
  browserRenderingHarnessImplemented: false;
  runnerImplementedByArdyn: false;
  testHarnessImplementedByArdyn: false;
  consumerOwnedRunnerImplemented: false;
  consumerConformanceRunnerImplemented: false;
  fixtureImportCommandImplemented: false;
  fixtureExportCommandImplemented: false;
  fixtureImportExportCommandsImplemented: false;
  importExportCommandImplemented: false;
  packageExportImplemented: false;
  consumerSideCiImplemented: false;
  fixtureDiscoveryRuntimeImplemented: false;
  consumerRepoModifiedByArdyn: false;
  browserWcagAutomationImplemented: false;
  visualRegressionHarnessImplemented: false;
  screenReaderAutomationImplemented: false;
  externalLookupsEnabled: false;
  filesystemScanningEnabled: false;
  processControlEnabled: false;
  rejectionReasons: string[];
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
  [key: string]: unknown;
}

export type ConsumerOwnedDisplayConformanceRunnerResultSchemaBoundaryClassification =
  | "valid_consumer_owned_display_conformance_runner_result_schema_boundary_runtime_still_blocked"
  | "malformed_consumer_owned_display_conformance_runner_result_schema_boundary_input_rejected"
  | "missing_required_consumer_owned_display_conformance_runner_result_schema_boundary_entry_rejected"
  | "unknown_consumer_name_consumer_owned_display_conformance_runner_result_schema_boundary_input_rejected"
  | "unknown_result_schema_intent_consumer_owned_display_conformance_runner_result_schema_boundary_input_rejected"
  | "interactive_actionable_intent_consumer_owned_display_conformance_runner_result_schema_boundary_input_rejected"
  | "authorization_flags_enabled_consumer_owned_display_conformance_runner_result_schema_boundary_input_rejected"
  | "unsafe_runner_result_producer_import_export_test_harness_runtime_flags_consumer_owned_display_conformance_runner_result_schema_boundary_input_rejected"
  | "hidden_runner_result_producer_import_export_test_harness_runtime_semantics_consumer_owned_display_conformance_runner_result_schema_boundary_input_rejected"
  | "secure_drop_implementation_semantics_consumer_owned_display_conformance_runner_result_schema_boundary_input_rejected"
  | "websocket_http_fabric_mcp_task_execution_semantics_consumer_owned_display_conformance_runner_result_schema_boundary_input_rejected"
  | "unknown_reference_consumer_owned_display_conformance_runner_result_schema_boundary_input_rejected"
  | "nested_unsafe_flags_consumer_owned_display_conformance_runner_result_schema_boundary_input_rejected"
  | "noncanonical_consumer_owned_display_conformance_runner_result_schema_boundary_input_rejected"
  | "runner_result_producer_import_export_test_harness_implementation_semantics_consumer_owned_display_conformance_runner_result_schema_boundary_input_rejected";

export interface ConsumerOwnedDisplayConformanceRunnerResultSchemaBoundaryUnsafeFlags
  extends ConsumerOwnedDisplayConformanceRunnerTestPlanUnsafeFlags {
  resultProducerEnabled: false;
  resultProducerImplementedByArdyn: false;
  resultCollectorEnabled: false;
  resultCollectorImplementedByArdyn: false;
  resultProductionEnabled: false;
  resultCollectionEnabled: false;
  resultEmissionEnabled: false;
  resultWriteEnabled: false;
  resultExportEnabled: false;
  resultImportEnabled: false;
  resultStorageWritesEnabled: false;
  conformanceResultProducerImplemented: false;
  conformanceResultCollectorImplemented: false;
  consumerResultProducerImplemented: false;
  consumerResultCollectorImplemented: false;
  resultSchemaExecutionEnabled: false;
  hiddenResultProducerSemanticsEnabled: false;
  hiddenResultCollectorSemanticsEnabled: false;
}

export interface ConsumerOwnedDisplayConformanceRunnerResultSchemaBoundaryEntry {
  resultSchemaId: string;
  consumerName: "Locus" | "Multiverse";
  displaySurfaceId: string;
  sourceArdynArtifactType: string;
  resultSchemaIntent: "metadata_only";
  referencedPhase550SchemaBoundaryId: string;
  referencedPhase551FixtureId: string;
  referencedPhase551FixtureGroup: string;
  referencedPhase552HandoffId: string;
  referencedPhase553RunnerRequirementId: string;
  referencedPhase554TestPlanId: string;
  futureConsumerOwnedResultResponsibility: string;
  allowedResultFields: string[];
  forbiddenResultFields: string[];
  deterministicOrderingHashExpectations: {
    deterministicResultSchemaIdsRequired: true;
    deterministicOrderingRequired: true;
    deterministicAllowedResultFieldOrderingRequired: true;
    deterministicForbiddenResultFieldOrderingRequired: true;
    deterministicHashInputOrderingRequired: true;
    noClockNetworkRandomnessAllowed: true;
    consumerOwnedResultOutputMustBeReviewOnly: true;
    hashDoesNotAuthorizeRuntime: true;
  };
  accessibilityWcagResultNotes:
    ConsumerDisplayFixtureAccessibilityFields &
      Record<string, boolean | string>;
  requiredFutureContractBeforeExecutableResultProduction: string;
  explicitBlockedAuthorizationFlags: Record<string, false>;
  unsafeRunnerResultProducerImportExportTestHarnessRuntimeFlags:
    ConsumerOwnedDisplayConformanceRunnerResultSchemaBoundaryUnsafeFlags;
  consumerTargetOnly: true;
  runnerImplementedByArdyn: false;
  resultProducerImplementedByArdyn: false;
  resultCollectorImplementedByArdyn: false;
  testHarnessImplementedByArdyn: false;
  importExportCommandImplemented: false;
  browserRenderingHarnessImplemented: false;
  packageExportImplemented: false;
  consumerSideCiImplemented: false;
  fixtureDiscoveryRuntimeImplemented: false;
  consumerRepoModifiedByArdyn: false;
  nonAuthorizingProof: true;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
}

export interface ConsumerOwnedDisplayConformanceRunnerResultSchemaBoundaryState {
  schema: "ardyn.phase-5.55.consumer-owned-display-conformance-runner-result-schema-boundary-state";
  schemaVersion: "0.1.0";
  stateKind: "consumer-owned-display-conformance-runner-result-schema-boundary-state";
  stateMode: "review-only";
  reviewedAt: string;
  sourcePhaseContext: Record<string, boolean | string>;
  phase554SubagentAuditTrailReconciliation: Record<string, string>;
  resultSchemaEntries: ConsumerOwnedDisplayConformanceRunnerResultSchemaBoundaryEntry[];
  resultSchemaBoundarySummary: Record<string, boolean | number | string | string[]>;
  phase550SchemaBoundaryReference: Record<string, boolean | string>;
  phase551ExamplePackReference: Record<string, boolean | string>;
  phase552ConformanceHandoffReference: Record<string, boolean | string>;
  phase553RunnerRequirementsReference: Record<string, boolean | string>;
  phase554TestPlanReference: Record<string, boolean | string>;
  invalidResultSchemaCasePolicy: Record<string, boolean>;
  topDisplayConformanceRunnerResultSchemaGaps: string[];
  recommendedNextPhase: string;
  consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryOnly: true;
  reviewOnly: true;
  authoritative: false;
  reviewArtifactOnly: true;
  nonAuthorizingProof: true;
  renderingCodeImplemented: false;
  browserRenderingHarnessImplemented: false;
  runnerImplementedByArdyn: false;
  resultProducerImplementedByArdyn: false;
  resultCollectorImplementedByArdyn: false;
  testHarnessImplementedByArdyn: false;
  consumerOwnedRunnerImplemented: false;
  consumerConformanceRunnerImplemented: false;
  fixtureImportCommandImplemented: false;
  fixtureExportCommandImplemented: false;
  fixtureImportExportCommandsImplemented: false;
  importExportCommandImplemented: false;
  packageExportImplemented: false;
  consumerSideCiImplemented: false;
  fixtureDiscoveryRuntimeImplemented: false;
  consumerRepoModifiedByArdyn: false;
  browserWcagAutomationImplemented: false;
  visualRegressionHarnessImplemented: false;
  screenReaderAutomationImplemented: false;
  externalLookupsEnabled: false;
  filesystemScanningEnabled: false;
  processControlEnabled: false;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
  [key: string]: unknown;
}

export interface ConsumerOwnedDisplayConformanceRunnerResultSchemaBoundaryResult {
  schema: "ardyn.phase-5.55.consumer-owned-display-conformance-runner-result-schema-boundary-result";
  schemaVersion: "0.1.0";
  consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryKind:
    "consumer-owned-display-conformance-runner-result-schema-boundary";
  consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryMode: "review-only";
  reviewedAt: string;
  classification: ConsumerOwnedDisplayConformanceRunnerResultSchemaBoundaryClassification;
  consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryProduced: boolean;
  consumerOwnedDisplayConformanceRunnerResultSchemaBoundary:
    | ConsumerOwnedDisplayConformanceRunnerResultSchemaBoundaryState
    | null;
  resultSchemaBoundarySummary:
    | ConsumerOwnedDisplayConformanceRunnerResultSchemaBoundaryState["resultSchemaBoundarySummary"]
    | null;
  phase550SchemaBoundaryReference:
    | ConsumerOwnedDisplayConformanceRunnerResultSchemaBoundaryState["phase550SchemaBoundaryReference"]
    | null;
  phase551ExamplePackReference:
    | ConsumerOwnedDisplayConformanceRunnerResultSchemaBoundaryState["phase551ExamplePackReference"]
    | null;
  phase552ConformanceHandoffReference:
    | ConsumerOwnedDisplayConformanceRunnerResultSchemaBoundaryState["phase552ConformanceHandoffReference"]
    | null;
  phase553RunnerRequirementsReference:
    | ConsumerOwnedDisplayConformanceRunnerResultSchemaBoundaryState["phase553RunnerRequirementsReference"]
    | null;
  phase554TestPlanReference:
    | ConsumerOwnedDisplayConformanceRunnerResultSchemaBoundaryState["phase554TestPlanReference"]
    | null;
  phase554SubagentAuditTrailReconciliation:
    | ConsumerOwnedDisplayConformanceRunnerResultSchemaBoundaryState["phase554SubagentAuditTrailReconciliation"]
    | null;
  resultSchemaEntries: ConsumerOwnedDisplayConformanceRunnerResultSchemaBoundaryEntry[];
  invalidResultSchemaCasePolicy: Record<string, boolean>;
  topDisplayConformanceRunnerResultSchemaGaps: string[];
  recommendedNextPhase: string | null;
  consumerOwnedDisplayConformanceRunnerResultSchemaBoundaryOnly: true;
  reviewOnly: true;
  authoritative: false;
  reviewArtifactOnly: true;
  nonAuthorizingProof: true;
  renderingCodeImplemented: false;
  browserRenderingHarnessImplemented: false;
  runnerImplementedByArdyn: false;
  resultProducerImplementedByArdyn: false;
  resultCollectorImplementedByArdyn: false;
  testHarnessImplementedByArdyn: false;
  consumerOwnedRunnerImplemented: false;
  consumerConformanceRunnerImplemented: false;
  fixtureImportCommandImplemented: false;
  fixtureExportCommandImplemented: false;
  fixtureImportExportCommandsImplemented: false;
  importExportCommandImplemented: false;
  packageExportImplemented: false;
  consumerSideCiImplemented: false;
  fixtureDiscoveryRuntimeImplemented: false;
  consumerRepoModifiedByArdyn: false;
  browserWcagAutomationImplemented: false;
  visualRegressionHarnessImplemented: false;
  screenReaderAutomationImplemented: false;
  externalLookupsEnabled: false;
  filesystemScanningEnabled: false;
  processControlEnabled: false;
  rejectionReasons: string[];
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
  [key: string]: unknown;
}

export type ConsumerOwnedDisplayConformanceResultHandoffClassification =
  | "valid_consumer_owned_display_conformance_result_handoff_runtime_still_blocked"
  | "malformed_consumer_owned_display_conformance_result_handoff_input_rejected"
  | "missing_required_consumer_owned_display_conformance_result_handoff_entry_rejected"
  | "unknown_consumer_name_consumer_owned_display_conformance_result_handoff_input_rejected"
  | "unknown_result_handoff_intent_consumer_owned_display_conformance_result_handoff_input_rejected"
  | "interactive_actionable_intent_consumer_owned_display_conformance_result_handoff_input_rejected"
  | "authorization_flags_enabled_consumer_owned_display_conformance_result_handoff_input_rejected"
  | "unsafe_runner_result_producer_result_collector_import_export_test_harness_runtime_flags_consumer_owned_display_conformance_result_handoff_input_rejected"
  | "hidden_runner_result_producer_result_collector_import_export_test_harness_runtime_semantics_consumer_owned_display_conformance_result_handoff_input_rejected"
  | "secure_drop_implementation_semantics_consumer_owned_display_conformance_result_handoff_input_rejected"
  | "websocket_http_fabric_mcp_task_execution_semantics_consumer_owned_display_conformance_result_handoff_input_rejected"
  | "unknown_reference_consumer_owned_display_conformance_result_handoff_input_rejected"
  | "nested_unsafe_flags_consumer_owned_display_conformance_result_handoff_input_rejected"
  | "noncanonical_consumer_owned_display_conformance_result_handoff_input_rejected"
  | "runner_result_producer_result_collector_import_export_test_harness_implementation_semantics_consumer_owned_display_conformance_result_handoff_input_rejected";

export interface ConsumerOwnedDisplayConformanceResultHandoffUnsafeFlags
  extends ConsumerOwnedDisplayConformanceRunnerResultSchemaBoundaryUnsafeFlags {
  resultImporterEnabled: false;
  resultImporterImplementedByArdyn: false;
  resultExporterEnabled: false;
  resultExporterImplementedByArdyn: false;
  resultImportCommandImplemented: false;
  resultExportCommandImplemented: false;
  resultHandoffExecutionEnabled: false;
  resultHandoffImportEnabled: false;
  resultHandoffExportEnabled: false;
  resultHandoffCiEnabled: false;
  resultHandoffRuntimeEnabled: false;
  consumerResultImporterImplemented: false;
  consumerResultExporterImplemented: false;
  hiddenResultImporterSemanticsEnabled: false;
  hiddenResultExporterSemanticsEnabled: false;
  hiddenResultHandoffSemanticsEnabled: false;
}

export interface ConsumerOwnedDisplayConformanceResultHandoffEntry {
  handoffId: string;
  consumerName: "Locus" | "Multiverse";
  displaySurfaceId: string;
  sourceArdynArtifactType: string;
  resultHandoffIntent: "metadata_only";
  referencedPhase550SchemaBoundaryId: string;
  referencedPhase551FixtureId: string;
  referencedPhase551FixtureGroup: string;
  referencedPhase552ConformanceHandoffId: string;
  referencedPhase553RunnerRequirementId: string;
  referencedPhase554TestPlanId: string;
  referencedPhase555ResultSchemaId: string;
  futureConsumerOwnedResultProducerResponsibility: string;
  futureConsumerOwnedResultCollectorResponsibility: string;
  allowedFutureResultHandoffBehavior: string;
  forbiddenCurrentArdynBehavior: string[];
  deterministicOrderingHashExpectations: {
    deterministicHandoffIdsRequired: true;
    deterministicOrderingRequired: true;
    deterministicForbiddenBehaviorOrderingRequired: true;
    deterministicHashInputOrderingRequired: true;
    noClockNetworkRandomnessAllowed: true;
    consumerOwnedResultHandoffMustBeReviewOnly: true;
    hashDoesNotAuthorizeRuntime: true;
  };
  accessibilityWcagResultHandoffNotes:
    ConsumerDisplayFixtureAccessibilityFields &
      Record<string, boolean | string>;
  requiredFutureContractBeforeExecutableResultProductionCollectionImportExportOrCi:
    string;
  explicitBlockedAuthorizationFlags: Record<string, false>;
  unsafeRunnerResultProducerResultCollectorImportExportTestHarnessRuntimeFlags:
    ConsumerOwnedDisplayConformanceResultHandoffUnsafeFlags;
  consumerTargetOnly: true;
  runnerImplementedByArdyn: false;
  resultProducerImplementedByArdyn: false;
  resultCollectorImplementedByArdyn: false;
  resultImporterImplementedByArdyn: false;
  resultExporterImplementedByArdyn: false;
  testHarnessImplementedByArdyn: false;
  importExportCommandImplemented: false;
  browserRenderingHarnessImplemented: false;
  packageExportImplemented: false;
  consumerSideCiImplemented: false;
  fixtureDiscoveryRuntimeImplemented: false;
  consumerRepoModifiedByArdyn: false;
  nonAuthorizingProof: true;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
}

export interface ConsumerOwnedDisplayConformanceResultHandoffState {
  schema: "ardyn.phase-5.56.consumer-owned-display-conformance-result-handoff-state";
  schemaVersion: "0.1.0";
  stateKind: "consumer-owned-display-conformance-result-handoff-state";
  stateMode: "review-only";
  reviewedAt: string;
  sourcePhaseContext: Record<string, boolean | string>;
  resultHandoffEntries: ConsumerOwnedDisplayConformanceResultHandoffEntry[];
  resultHandoffSummary: Record<string, boolean | number | string | string[]>;
  phase550SchemaBoundaryReference: Record<string, boolean | string>;
  phase551ExamplePackReference: Record<string, boolean | string>;
  phase552ConformanceHandoffReference: Record<string, boolean | string>;
  phase553RunnerRequirementsReference: Record<string, boolean | string>;
  phase554TestPlanReference: Record<string, boolean | string>;
  phase555ResultSchemaBoundaryReference: Record<string, boolean | string>;
  invalidResultHandoffCasePolicy: Record<string, boolean>;
  topDisplayConformanceResultHandoffGaps: string[];
  recommendedNextPhase: string;
  consumerOwnedDisplayConformanceResultHandoffOnly: true;
  reviewOnly: true;
  authoritative: false;
  reviewArtifactOnly: true;
  nonAuthorizingProof: true;
  renderingCodeImplemented: false;
  browserRenderingHarnessImplemented: false;
  runnerImplementedByArdyn: false;
  resultProducerImplementedByArdyn: false;
  resultCollectorImplementedByArdyn: false;
  resultImporterImplementedByArdyn: false;
  resultExporterImplementedByArdyn: false;
  testHarnessImplementedByArdyn: false;
  consumerOwnedRunnerImplemented: false;
  consumerConformanceRunnerImplemented: false;
  fixtureImportCommandImplemented: false;
  fixtureExportCommandImplemented: false;
  fixtureImportExportCommandsImplemented: false;
  importExportCommandImplemented: false;
  packageExportImplemented: false;
  consumerSideCiImplemented: false;
  fixtureDiscoveryRuntimeImplemented: false;
  consumerRepoModifiedByArdyn: false;
  browserWcagAutomationImplemented: false;
  visualRegressionHarnessImplemented: false;
  screenReaderAutomationImplemented: false;
  externalLookupsEnabled: false;
  filesystemScanningEnabled: false;
  processControlEnabled: false;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
  [key: string]: unknown;
}

export interface ConsumerOwnedDisplayConformanceResultHandoffResult {
  schema: "ardyn.phase-5.56.consumer-owned-display-conformance-result-handoff-result";
  schemaVersion: "0.1.0";
  consumerOwnedDisplayConformanceResultHandoffKind:
    "consumer-owned-display-conformance-result-handoff";
  consumerOwnedDisplayConformanceResultHandoffMode: "review-only";
  reviewedAt: string;
  classification: ConsumerOwnedDisplayConformanceResultHandoffClassification;
  consumerOwnedDisplayConformanceResultHandoffProduced: boolean;
  consumerOwnedDisplayConformanceResultHandoff:
    | ConsumerOwnedDisplayConformanceResultHandoffState
    | null;
  resultHandoffSummary:
    | ConsumerOwnedDisplayConformanceResultHandoffState["resultHandoffSummary"]
    | null;
  phase550SchemaBoundaryReference:
    | ConsumerOwnedDisplayConformanceResultHandoffState["phase550SchemaBoundaryReference"]
    | null;
  phase551ExamplePackReference:
    | ConsumerOwnedDisplayConformanceResultHandoffState["phase551ExamplePackReference"]
    | null;
  phase552ConformanceHandoffReference:
    | ConsumerOwnedDisplayConformanceResultHandoffState["phase552ConformanceHandoffReference"]
    | null;
  phase553RunnerRequirementsReference:
    | ConsumerOwnedDisplayConformanceResultHandoffState["phase553RunnerRequirementsReference"]
    | null;
  phase554TestPlanReference:
    | ConsumerOwnedDisplayConformanceResultHandoffState["phase554TestPlanReference"]
    | null;
  phase555ResultSchemaBoundaryReference:
    | ConsumerOwnedDisplayConformanceResultHandoffState["phase555ResultSchemaBoundaryReference"]
    | null;
  resultHandoffEntries: ConsumerOwnedDisplayConformanceResultHandoffEntry[];
  invalidResultHandoffCasePolicy: Record<string, boolean>;
  topDisplayConformanceResultHandoffGaps: string[];
  recommendedNextPhase: string | null;
  consumerOwnedDisplayConformanceResultHandoffOnly: true;
  reviewOnly: true;
  authoritative: false;
  reviewArtifactOnly: true;
  nonAuthorizingProof: true;
  renderingCodeImplemented: false;
  browserRenderingHarnessImplemented: false;
  runnerImplementedByArdyn: false;
  resultProducerImplementedByArdyn: false;
  resultCollectorImplementedByArdyn: false;
  resultImporterImplementedByArdyn: false;
  resultExporterImplementedByArdyn: false;
  testHarnessImplementedByArdyn: false;
  consumerOwnedRunnerImplemented: false;
  consumerConformanceRunnerImplemented: false;
  fixtureImportCommandImplemented: false;
  fixtureExportCommandImplemented: false;
  fixtureImportExportCommandsImplemented: false;
  importExportCommandImplemented: false;
  packageExportImplemented: false;
  consumerSideCiImplemented: false;
  fixtureDiscoveryRuntimeImplemented: false;
  consumerRepoModifiedByArdyn: false;
  browserWcagAutomationImplemented: false;
  visualRegressionHarnessImplemented: false;
  screenReaderAutomationImplemented: false;
  externalLookupsEnabled: false;
  filesystemScanningEnabled: false;
  processControlEnabled: false;
  rejectionReasons: string[];
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
  [key: string]: unknown;
}

export type ConsumerOwnedDisplayConformanceResultReviewIntakeBoundaryClassification =
  | "valid_consumer_owned_display_conformance_result_review_intake_boundary_runtime_still_blocked"
  | "malformed_consumer_owned_display_conformance_result_review_intake_boundary_input_rejected"
  | "missing_required_consumer_owned_display_conformance_result_review_intake_boundary_entry_rejected"
  | "unknown_consumer_name_consumer_owned_display_conformance_result_review_intake_boundary_input_rejected"
  | "unknown_review_intake_intent_consumer_owned_display_conformance_result_review_intake_boundary_input_rejected"
  | "interactive_actionable_intent_consumer_owned_display_conformance_result_review_intake_boundary_input_rejected"
  | "authorization_flags_enabled_consumer_owned_display_conformance_result_review_intake_boundary_input_rejected"
  | "unsafe_runner_result_producer_result_collector_import_export_validator_review_router_evaluator_approval_test_harness_runtime_flags_consumer_owned_display_conformance_result_review_intake_boundary_input_rejected"
  | "hidden_runner_result_producer_result_collector_import_export_validator_review_router_evaluator_approval_test_harness_runtime_semantics_consumer_owned_display_conformance_result_review_intake_boundary_input_rejected"
  | "secure_drop_implementation_semantics_consumer_owned_display_conformance_result_review_intake_boundary_input_rejected"
  | "websocket_http_fabric_mcp_task_execution_semantics_consumer_owned_display_conformance_result_review_intake_boundary_input_rejected"
  | "unknown_reference_consumer_owned_display_conformance_result_review_intake_boundary_input_rejected"
  | "nested_unsafe_flags_consumer_owned_display_conformance_result_review_intake_boundary_input_rejected"
  | "noncanonical_consumer_owned_display_conformance_result_review_intake_boundary_input_rejected"
  | "runner_result_producer_result_collector_import_export_validator_review_router_evaluator_approval_test_harness_implementation_semantics_consumer_owned_display_conformance_result_review_intake_boundary_input_rejected";

export interface ConsumerOwnedDisplayConformanceResultReviewIntakeBoundaryUnsafeFlags
  extends ConsumerOwnedDisplayConformanceResultHandoffUnsafeFlags {
  resultValidatorEnabled: false;
  resultValidatorImplementedByArdyn: false;
  reviewRouterEnabled: false;
  reviewRouterImplementedByArdyn: false;
  evaluatorEnabled: false;
  evaluatorImplementedByArdyn: false;
  evaluatorExecutionEnabled: false;
  approvalPathEnabled: false;
  approvalPathImplementedByArdyn: false;
  approvalDecisionEnabled: false;
  approvalDecisionProduced: false;
  approvalDecisionProducedByArdyn: false;
  approvalGrantEnabled: false;
  approvalGrantProduced: false;
  approvalGrantProducedByArdyn: false;
  resultReviewIntakeEnabled: false;
  resultReviewIntakeImportEnabled: false;
  resultReviewIntakeExportEnabled: false;
  resultReviewIntakeValidationEnabled: false;
  resultReviewIntakeRoutingEnabled: false;
  resultReviewIntakeEvaluationEnabled: false;
  resultReviewIntakeApprovalEnabled: false;
  resultReviewIntakeCiEnabled: false;
  resultReviewIntakeRuntimeEnabled: false;
  consumerResultValidatorImplemented: false;
  consumerReviewRouterImplemented: false;
  consumerEvaluatorImplemented: false;
  consumerApprovalPathImplemented: false;
  hiddenResultValidatorSemanticsEnabled: false;
  hiddenReviewRouterSemanticsEnabled: false;
  hiddenEvaluatorSemanticsEnabled: false;
  hiddenApprovalSemanticsEnabled: false;
  hiddenResultReviewIntakeSemanticsEnabled: false;
}

export interface ConsumerOwnedDisplayConformanceResultReviewIntakeBoundaryEntry {
  intakeId: string;
  consumerName: "Locus" | "Multiverse";
  displaySurfaceId: string;
  sourceArdynArtifactType: string;
  reviewIntakeIntent: "metadata_only";
  referencedPhase550SchemaBoundaryId: string;
  referencedPhase551FixtureId: string;
  referencedPhase551FixtureGroup: string;
  referencedPhase552ConformanceHandoffId: string;
  referencedPhase553RunnerRequirementId: string;
  referencedPhase554TestPlanId: string;
  referencedPhase555ResultSchemaId: string;
  referencedPhase556ResultHandoffId: string;
  futureConsumerOwnedResultArtifactResponsibility: string;
  allowedFutureIntakeCandidateBehavior: string;
  forbiddenCurrentArdynBehavior: string[];
  deterministicOrderingHashExpectations: {
    deterministicIntakeIdsRequired: true;
    deterministicOrderingRequired: true;
    deterministicForbiddenBehaviorOrderingRequired: true;
    deterministicHashInputOrderingRequired: true;
    noClockNetworkRandomnessAllowed: true;
    consumerOwnedResultReviewIntakeMustBeReviewOnly: true;
    hashDoesNotAuthorizeRuntime: true;
  };
  accessibilityWcagIntakeNotes:
    ConsumerDisplayFixtureAccessibilityFields &
      Record<string, boolean | string>;
  requiredFutureContractBeforeExecutableResultIntakeImportValidationRoutingEvaluationApprovalExportOrCi:
    string;
  explicitBlockedAuthorizationFlags: Record<string, false>;
  unsafeRunnerResultProducerResultCollectorImportExportValidatorReviewRouterEvaluatorApprovalTestHarnessRuntimeFlags:
    ConsumerOwnedDisplayConformanceResultReviewIntakeBoundaryUnsafeFlags;
  consumerTargetOnly: true;
  reviewIntakeCandidateMetadataOnly: true;
  runnerImplementedByArdyn: false;
  resultProducerImplementedByArdyn: false;
  resultCollectorImplementedByArdyn: false;
  resultImporterImplementedByArdyn: false;
  resultExporterImplementedByArdyn: false;
  resultValidatorImplementedByArdyn: false;
  reviewRouterImplementedByArdyn: false;
  evaluatorImplementedByArdyn: false;
  approvalPathImplementedByArdyn: false;
  approvalDecisionProducedByArdyn: false;
  approvalGrantProducedByArdyn: false;
  testHarnessImplementedByArdyn: false;
  importExportCommandImplemented: false;
  browserRenderingHarnessImplemented: false;
  packageExportImplemented: false;
  consumerSideCiImplemented: false;
  fixtureDiscoveryRuntimeImplemented: false;
  consumerRepoModifiedByArdyn: false;
  nonAuthorizingProof: true;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
}

export interface ConsumerOwnedDisplayConformanceResultReviewIntakeBoundaryState {
  schema: "ardyn.phase-5.57.consumer-owned-display-conformance-result-review-intake-boundary-state";
  schemaVersion: "0.1.0";
  stateKind: "consumer-owned-display-conformance-result-review-intake-boundary-state";
  stateMode: "review-only";
  reviewedAt: string;
  sourcePhaseContext: Record<string, boolean | string>;
  reviewIntakeEntries: ConsumerOwnedDisplayConformanceResultReviewIntakeBoundaryEntry[];
  reviewIntakeSummary: Record<string, boolean | number | string | string[]>;
  phase550SchemaBoundaryReference: Record<string, boolean | string>;
  phase551ExamplePackReference: Record<string, boolean | string>;
  phase552ConformanceHandoffReference: Record<string, boolean | string>;
  phase553RunnerRequirementsReference: Record<string, boolean | string>;
  phase554TestPlanReference: Record<string, boolean | string>;
  phase555ResultSchemaBoundaryReference: Record<string, boolean | string>;
  phase556ResultHandoffReference: Record<string, boolean | string>;
  invalidReviewIntakeCasePolicy: Record<string, boolean>;
  topDisplayConformanceResultReviewIntakeGaps: string[];
  recommendedNextPhase: string;
  consumerOwnedDisplayConformanceResultReviewIntakeBoundaryOnly: true;
  reviewIntakeCandidateMetadataOnly: true;
  reviewOnly: true;
  authoritative: false;
  reviewArtifactOnly: true;
  nonAuthorizingProof: true;
  renderingCodeImplemented: false;
  browserRenderingHarnessImplemented: false;
  runnerImplementedByArdyn: false;
  resultProducerImplementedByArdyn: false;
  resultCollectorImplementedByArdyn: false;
  resultImporterImplementedByArdyn: false;
  resultExporterImplementedByArdyn: false;
  resultValidatorImplementedByArdyn: false;
  reviewRouterImplementedByArdyn: false;
  evaluatorImplementedByArdyn: false;
  approvalPathImplementedByArdyn: false;
  approvalDecisionProducedByArdyn: false;
  approvalGrantProducedByArdyn: false;
  testHarnessImplementedByArdyn: false;
  consumerOwnedRunnerImplemented: false;
  consumerConformanceRunnerImplemented: false;
  fixtureImportCommandImplemented: false;
  fixtureExportCommandImplemented: false;
  fixtureImportExportCommandsImplemented: false;
  importExportCommandImplemented: false;
  packageExportImplemented: false;
  consumerSideCiImplemented: false;
  fixtureDiscoveryRuntimeImplemented: false;
  consumerRepoModifiedByArdyn: false;
  browserWcagAutomationImplemented: false;
  visualRegressionHarnessImplemented: false;
  screenReaderAutomationImplemented: false;
  reviewerRoutingPerformed: false;
  reviewerAssignmentPerformed: false;
  evaluatorExecutionPerformed: false;
  evaluatorResultProduced: false;
  approvalDecisionProduced: false;
  approvalGrantProduced: false;
  approvalGrantPersisted: false;
  externalLookupsEnabled: false;
  filesystemScanningEnabled: false;
  processControlEnabled: false;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
  [key: string]: unknown;
}

export interface ConsumerOwnedDisplayConformanceResultReviewIntakeBoundaryResult {
  schema: "ardyn.phase-5.57.consumer-owned-display-conformance-result-review-intake-boundary-result";
  schemaVersion: "0.1.0";
  consumerOwnedDisplayConformanceResultReviewIntakeBoundaryKind:
    "consumer-owned-display-conformance-result-review-intake-boundary";
  consumerOwnedDisplayConformanceResultReviewIntakeBoundaryMode: "review-only";
  reviewedAt: string;
  classification: ConsumerOwnedDisplayConformanceResultReviewIntakeBoundaryClassification;
  consumerOwnedDisplayConformanceResultReviewIntakeBoundaryProduced: boolean;
  consumerOwnedDisplayConformanceResultReviewIntakeBoundary:
    | ConsumerOwnedDisplayConformanceResultReviewIntakeBoundaryState
    | null;
  reviewIntakeSummary:
    | ConsumerOwnedDisplayConformanceResultReviewIntakeBoundaryState["reviewIntakeSummary"]
    | null;
  phase550SchemaBoundaryReference:
    | ConsumerOwnedDisplayConformanceResultReviewIntakeBoundaryState["phase550SchemaBoundaryReference"]
    | null;
  phase551ExamplePackReference:
    | ConsumerOwnedDisplayConformanceResultReviewIntakeBoundaryState["phase551ExamplePackReference"]
    | null;
  phase552ConformanceHandoffReference:
    | ConsumerOwnedDisplayConformanceResultReviewIntakeBoundaryState["phase552ConformanceHandoffReference"]
    | null;
  phase553RunnerRequirementsReference:
    | ConsumerOwnedDisplayConformanceResultReviewIntakeBoundaryState["phase553RunnerRequirementsReference"]
    | null;
  phase554TestPlanReference:
    | ConsumerOwnedDisplayConformanceResultReviewIntakeBoundaryState["phase554TestPlanReference"]
    | null;
  phase555ResultSchemaBoundaryReference:
    | ConsumerOwnedDisplayConformanceResultReviewIntakeBoundaryState["phase555ResultSchemaBoundaryReference"]
    | null;
  phase556ResultHandoffReference:
    | ConsumerOwnedDisplayConformanceResultReviewIntakeBoundaryState["phase556ResultHandoffReference"]
    | null;
  reviewIntakeEntries: ConsumerOwnedDisplayConformanceResultReviewIntakeBoundaryEntry[];
  invalidReviewIntakeCasePolicy: Record<string, boolean>;
  topDisplayConformanceResultReviewIntakeGaps: string[];
  recommendedNextPhase: string | null;
  consumerOwnedDisplayConformanceResultReviewIntakeBoundaryOnly: true;
  reviewIntakeCandidateMetadataOnly: true;
  reviewOnly: true;
  authoritative: false;
  reviewArtifactOnly: true;
  nonAuthorizingProof: true;
  renderingCodeImplemented: false;
  browserRenderingHarnessImplemented: false;
  runnerImplementedByArdyn: false;
  resultProducerImplementedByArdyn: false;
  resultCollectorImplementedByArdyn: false;
  resultImporterImplementedByArdyn: false;
  resultExporterImplementedByArdyn: false;
  resultValidatorImplementedByArdyn: false;
  reviewRouterImplementedByArdyn: false;
  evaluatorImplementedByArdyn: false;
  approvalPathImplementedByArdyn: false;
  approvalDecisionProducedByArdyn: false;
  approvalGrantProducedByArdyn: false;
  testHarnessImplementedByArdyn: false;
  consumerOwnedRunnerImplemented: false;
  consumerConformanceRunnerImplemented: false;
  fixtureImportCommandImplemented: false;
  fixtureExportCommandImplemented: false;
  fixtureImportExportCommandsImplemented: false;
  importExportCommandImplemented: false;
  packageExportImplemented: false;
  consumerSideCiImplemented: false;
  fixtureDiscoveryRuntimeImplemented: false;
  consumerRepoModifiedByArdyn: false;
  browserWcagAutomationImplemented: false;
  visualRegressionHarnessImplemented: false;
  screenReaderAutomationImplemented: false;
  reviewerRoutingPerformed: false;
  reviewerAssignmentPerformed: false;
  evaluatorExecutionPerformed: false;
  evaluatorResultProduced: false;
  approvalDecisionProduced: false;
  approvalGrantProduced: false;
  approvalGrantPersisted: false;
  externalLookupsEnabled: false;
  filesystemScanningEnabled: false;
  processControlEnabled: false;
  rejectionReasons: string[];
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
  [key: string]: unknown;
}

export type ConsumerOwnedDisplayConformanceResultReviewPackageBoundaryClassification =
  | "valid_consumer_owned_display_conformance_result_review_package_boundary_runtime_still_blocked"
  | "malformed_consumer_owned_display_conformance_result_review_package_boundary_input_rejected"
  | "missing_required_consumer_owned_display_conformance_result_review_package_boundary_entry_rejected"
  | "unknown_consumer_name_consumer_owned_display_conformance_result_review_package_boundary_input_rejected"
  | "unknown_review_package_intent_consumer_owned_display_conformance_result_review_package_boundary_input_rejected"
  | "interactive_actionable_intent_consumer_owned_display_conformance_result_review_package_boundary_input_rejected"
  | "authorization_flags_enabled_consumer_owned_display_conformance_result_review_package_boundary_input_rejected"
  | "unsafe_package_import_export_persistence_runner_result_producer_result_collector_validator_review_router_evaluator_approval_test_harness_runtime_flags_consumer_owned_display_conformance_result_review_package_boundary_input_rejected"
  | "hidden_package_import_export_persistence_runner_result_producer_result_collector_validator_review_router_evaluator_approval_test_harness_runtime_semantics_consumer_owned_display_conformance_result_review_package_boundary_input_rejected"
  | "secure_drop_implementation_semantics_consumer_owned_display_conformance_result_review_package_boundary_input_rejected"
  | "websocket_http_fabric_mcp_task_execution_semantics_consumer_owned_display_conformance_result_review_package_boundary_input_rejected"
  | "unknown_reference_consumer_owned_display_conformance_result_review_package_boundary_input_rejected"
  | "nested_unsafe_flags_consumer_owned_display_conformance_result_review_package_boundary_input_rejected"
  | "noncanonical_consumer_owned_display_conformance_result_review_package_boundary_input_rejected"
  | "package_import_export_persistence_runner_result_producer_result_collector_validator_review_router_evaluator_approval_test_harness_implementation_semantics_consumer_owned_display_conformance_result_review_package_boundary_input_rejected";

export interface ConsumerOwnedDisplayConformanceResultReviewPackageBoundaryUnsafeFlags
  extends ConsumerOwnedDisplayConformanceResultReviewIntakeBoundaryUnsafeFlags {
  packageExportEnabled: false;
  packageExportImplemented: false;
  packageImportEnabled: false;
  packageImportImplemented: false;
  packageWriterEnabled: false;
  packageWriterImplemented: false;
  packageReaderEnabled: false;
  packageReaderImplemented: false;
  packagePersistenceEnabled: false;
  packagePersistenceImplemented: false;
  packageDiscoveryEnabled: false;
  packageDiscoveryImplemented: false;
  packageDistributionEnabled: false;
  packageDistributionImplemented: false;
  packageProducedByArdyn: false;
  resultReviewPackageEnabled: false;
  resultReviewPackageProduced: false;
  resultReviewPackageExportEnabled: false;
  resultReviewPackageImportEnabled: false;
  resultReviewPackageValidationEnabled: false;
  resultReviewPackageRoutingEnabled: false;
  resultReviewPackagePersistenceEnabled: false;
  resultReviewPackageEvaluationEnabled: false;
  resultReviewPackageApprovalEnabled: false;
  resultReviewPackageCiEnabled: false;
  resultReviewPackageRuntimeEnabled: false;
  consumerPackageWriterImplemented: false;
  consumerPackageReaderImplemented: false;
  consumerPackagePersistenceImplemented: false;
  hiddenPackageSemanticsEnabled: false;
  hiddenPackageImportSemanticsEnabled: false;
  hiddenPackageExportSemanticsEnabled: false;
  hiddenPackagePersistenceSemanticsEnabled: false;
  hiddenPackageWriterSemanticsEnabled: false;
  hiddenPackageReaderSemanticsEnabled: false;
  hiddenResultReviewPackageSemanticsEnabled: false;
}

export interface ConsumerOwnedDisplayConformanceResultReviewPackageBoundaryEntry {
  packageBoundaryId: string;
  consumerName: "Locus" | "Multiverse";
  displaySurfaceId: string;
  sourceArdynArtifactType: string;
  reviewPackageIntent: "metadata_only";
  referencedPhase550SchemaBoundaryId: string;
  referencedPhase551FixtureId: string;
  referencedPhase551FixtureGroup: string;
  referencedPhase552ConformanceHandoffId: string;
  referencedPhase553RunnerRequirementId: string;
  referencedPhase554TestPlanId: string;
  referencedPhase555ResultSchemaId: string;
  referencedPhase556ResultHandoffId: string;
  referencedPhase557ReviewIntakeId: string;
  futureConsumerOwnedPackageResponsibility: string;
  allowedFutureReviewPackageFields: string[];
  forbiddenCurrentArdynBehavior: string[];
  deterministicOrderingHashExpectations: {
    deterministicPackageBoundaryIdsRequired: true;
    deterministicOrderingRequired: true;
    deterministicAllowedFieldOrderingRequired: true;
    deterministicForbiddenBehaviorOrderingRequired: true;
    deterministicHashInputOrderingRequired: true;
    noClockNetworkRandomnessAllowed: true;
    consumerOwnedResultReviewPackageMustBeReviewOnly: true;
    hashDoesNotAuthorizeRuntime: true;
  };
  accessibilityWcagPackageNotes:
    ConsumerDisplayFixtureAccessibilityFields &
      Record<string, boolean | string>;
  requiredFutureContractBeforePackageProductionImportExportValidationRoutingPersistenceEvaluationApprovalOrCi:
    string;
  explicitBlockedAuthorizationFlags: Record<string, false>;
  unsafePackageImportExportPersistenceRunnerResultProducerResultCollectorValidatorReviewRouterEvaluatorApprovalTestHarnessRuntimeFlags:
    ConsumerOwnedDisplayConformanceResultReviewPackageBoundaryUnsafeFlags;
  consumerTargetOnly: true;
  reviewPackageCandidateMetadataOnly: true;
  packageProducedByArdyn: false;
  packageExportImplemented: false;
  packageImportImplemented: false;
  packageWriterImplemented: false;
  packageReaderImplemented: false;
  packagePersistenceImplemented: false;
  packageDiscoveryImplemented: false;
  packageDistributionImplemented: false;
  runnerImplementedByArdyn: false;
  resultProducerImplementedByArdyn: false;
  resultCollectorImplementedByArdyn: false;
  resultImporterImplementedByArdyn: false;
  resultExporterImplementedByArdyn: false;
  resultValidatorImplementedByArdyn: false;
  reviewRouterImplementedByArdyn: false;
  evaluatorImplementedByArdyn: false;
  approvalPathImplementedByArdyn: false;
  approvalDecisionProducedByArdyn: false;
  approvalGrantProducedByArdyn: false;
  testHarnessImplementedByArdyn: false;
  importExportCommandImplemented: false;
  browserRenderingHarnessImplemented: false;
  consumerSideCiImplemented: false;
  fixtureDiscoveryRuntimeImplemented: false;
  consumerRepoModifiedByArdyn: false;
  nonAuthorizingProof: true;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
}

export interface ConsumerOwnedDisplayConformanceResultReviewPackageBoundaryState {
  schema: "ardyn.phase-5.58.consumer-owned-display-conformance-result-review-package-boundary-state";
  schemaVersion: "0.1.0";
  stateKind: "consumer-owned-display-conformance-result-review-package-boundary-state";
  stateMode: "review-only";
  reviewedAt: string;
  sourcePhaseContext: Record<string, boolean | string>;
  reviewPackageEntries: ConsumerOwnedDisplayConformanceResultReviewPackageBoundaryEntry[];
  reviewPackageSummary: Record<string, boolean | number | string | string[]>;
  phase550SchemaBoundaryReference: Record<string, boolean | string>;
  phase551ExamplePackReference: Record<string, boolean | string>;
  phase552ConformanceHandoffReference: Record<string, boolean | string>;
  phase553RunnerRequirementsReference: Record<string, boolean | string>;
  phase554TestPlanReference: Record<string, boolean | string>;
  phase555ResultSchemaBoundaryReference: Record<string, boolean | string>;
  phase556ResultHandoffReference: Record<string, boolean | string>;
  phase557ReviewIntakeBoundaryReference: Record<string, boolean | string>;
  invalidReviewPackageCasePolicy: Record<string, boolean>;
  topDisplayConformanceResultReviewPackageGaps: string[];
  recommendedNextPhase: string;
  consumerOwnedDisplayConformanceResultReviewPackageBoundaryOnly: true;
  reviewPackageCandidateMetadataOnly: true;
  reviewOnly: true;
  authoritative: false;
  reviewArtifactOnly: true;
  nonAuthorizingProof: true;
  renderingCodeImplemented: false;
  browserRenderingHarnessImplemented: false;
  packageProducedByArdyn: false;
  packageExportImplemented: false;
  packageImportImplemented: false;
  packageWriterImplemented: false;
  packageReaderImplemented: false;
  packagePersistenceImplemented: false;
  packageDiscoveryImplemented: false;
  packageDistributionImplemented: false;
  runnerImplementedByArdyn: false;
  resultProducerImplementedByArdyn: false;
  resultCollectorImplementedByArdyn: false;
  resultImporterImplementedByArdyn: false;
  resultExporterImplementedByArdyn: false;
  resultValidatorImplementedByArdyn: false;
  reviewRouterImplementedByArdyn: false;
  evaluatorImplementedByArdyn: false;
  approvalPathImplementedByArdyn: false;
  approvalDecisionProducedByArdyn: false;
  approvalGrantProducedByArdyn: false;
  testHarnessImplementedByArdyn: false;
  consumerOwnedRunnerImplemented: false;
  consumerConformanceRunnerImplemented: false;
  fixtureImportCommandImplemented: false;
  fixtureExportCommandImplemented: false;
  fixtureImportExportCommandsImplemented: false;
  importExportCommandImplemented: false;
  consumerSideCiImplemented: false;
  fixtureDiscoveryRuntimeImplemented: false;
  consumerRepoModifiedByArdyn: false;
  browserWcagAutomationImplemented: false;
  visualRegressionHarnessImplemented: false;
  screenReaderAutomationImplemented: false;
  reviewerRoutingPerformed: false;
  reviewerAssignmentPerformed: false;
  evaluatorExecutionPerformed: false;
  evaluatorResultProduced: false;
  approvalDecisionProduced: false;
  approvalGrantProduced: false;
  approvalGrantPersisted: false;
  externalLookupsEnabled: false;
  filesystemScanningEnabled: false;
  processControlEnabled: false;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
  [key: string]: unknown;
}

export interface ConsumerOwnedDisplayConformanceResultReviewPackageBoundaryResult {
  schema: "ardyn.phase-5.58.consumer-owned-display-conformance-result-review-package-boundary-result";
  schemaVersion: "0.1.0";
  consumerOwnedDisplayConformanceResultReviewPackageBoundaryKind:
    "consumer-owned-display-conformance-result-review-package-boundary";
  consumerOwnedDisplayConformanceResultReviewPackageBoundaryMode: "review-only";
  reviewedAt: string;
  classification: ConsumerOwnedDisplayConformanceResultReviewPackageBoundaryClassification;
  consumerOwnedDisplayConformanceResultReviewPackageBoundaryProduced: boolean;
  consumerOwnedDisplayConformanceResultReviewPackageBoundary:
    | ConsumerOwnedDisplayConformanceResultReviewPackageBoundaryState
    | null;
  reviewPackageSummary:
    | ConsumerOwnedDisplayConformanceResultReviewPackageBoundaryState["reviewPackageSummary"]
    | null;
  phase550SchemaBoundaryReference:
    | ConsumerOwnedDisplayConformanceResultReviewPackageBoundaryState["phase550SchemaBoundaryReference"]
    | null;
  phase551ExamplePackReference:
    | ConsumerOwnedDisplayConformanceResultReviewPackageBoundaryState["phase551ExamplePackReference"]
    | null;
  phase552ConformanceHandoffReference:
    | ConsumerOwnedDisplayConformanceResultReviewPackageBoundaryState["phase552ConformanceHandoffReference"]
    | null;
  phase553RunnerRequirementsReference:
    | ConsumerOwnedDisplayConformanceResultReviewPackageBoundaryState["phase553RunnerRequirementsReference"]
    | null;
  phase554TestPlanReference:
    | ConsumerOwnedDisplayConformanceResultReviewPackageBoundaryState["phase554TestPlanReference"]
    | null;
  phase555ResultSchemaBoundaryReference:
    | ConsumerOwnedDisplayConformanceResultReviewPackageBoundaryState["phase555ResultSchemaBoundaryReference"]
    | null;
  phase556ResultHandoffReference:
    | ConsumerOwnedDisplayConformanceResultReviewPackageBoundaryState["phase556ResultHandoffReference"]
    | null;
  phase557ReviewIntakeBoundaryReference:
    | ConsumerOwnedDisplayConformanceResultReviewPackageBoundaryState["phase557ReviewIntakeBoundaryReference"]
    | null;
  reviewPackageEntries: ConsumerOwnedDisplayConformanceResultReviewPackageBoundaryEntry[];
  invalidReviewPackageCasePolicy: Record<string, boolean>;
  topDisplayConformanceResultReviewPackageGaps: string[];
  recommendedNextPhase: string | null;
  consumerOwnedDisplayConformanceResultReviewPackageBoundaryOnly: true;
  reviewPackageCandidateMetadataOnly: true;
  reviewOnly: true;
  authoritative: false;
  reviewArtifactOnly: true;
  nonAuthorizingProof: true;
  renderingCodeImplemented: false;
  browserRenderingHarnessImplemented: false;
  packageProducedByArdyn: false;
  packageExportImplemented: false;
  packageImportImplemented: false;
  packageWriterImplemented: false;
  packageReaderImplemented: false;
  packagePersistenceImplemented: false;
  packageDiscoveryImplemented: false;
  packageDistributionImplemented: false;
  runnerImplementedByArdyn: false;
  resultProducerImplementedByArdyn: false;
  resultCollectorImplementedByArdyn: false;
  resultImporterImplementedByArdyn: false;
  resultExporterImplementedByArdyn: false;
  resultValidatorImplementedByArdyn: false;
  reviewRouterImplementedByArdyn: false;
  evaluatorImplementedByArdyn: false;
  approvalPathImplementedByArdyn: false;
  approvalDecisionProducedByArdyn: false;
  approvalGrantProducedByArdyn: false;
  testHarnessImplementedByArdyn: false;
  consumerOwnedRunnerImplemented: false;
  consumerConformanceRunnerImplemented: false;
  fixtureImportCommandImplemented: false;
  fixtureExportCommandImplemented: false;
  fixtureImportExportCommandsImplemented: false;
  importExportCommandImplemented: false;
  consumerSideCiImplemented: false;
  fixtureDiscoveryRuntimeImplemented: false;
  consumerRepoModifiedByArdyn: false;
  browserWcagAutomationImplemented: false;
  visualRegressionHarnessImplemented: false;
  screenReaderAutomationImplemented: false;
  reviewerRoutingPerformed: false;
  reviewerAssignmentPerformed: false;
  evaluatorExecutionPerformed: false;
  evaluatorResultProduced: false;
  approvalDecisionProduced: false;
  approvalGrantProduced: false;
  approvalGrantPersisted: false;
  externalLookupsEnabled: false;
  filesystemScanningEnabled: false;
  processControlEnabled: false;
  rejectionReasons: string[];
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
  [key: string]: unknown;
}

export type FabricAwareApiBackendContractBoundaryMapClassification =
  | "valid_fabric_aware_api_backend_contract_boundary_map_runtime_still_blocked"
  | "malformed_fabric_aware_api_backend_contract_boundary_map_input_rejected"
  | "missing_required_fabric_aware_api_backend_contract_boundary_entry_rejected"
  | "unknown_boundary_family_fabric_aware_api_backend_contract_boundary_map_input_rejected"
  | "unknown_related_consumer_repo_fabric_aware_api_backend_contract_boundary_map_input_rejected"
  | "unknown_current_status_fabric_aware_api_backend_contract_boundary_map_input_rejected"
  | "authorization_flags_enabled_fabric_aware_api_backend_contract_boundary_map_input_rejected"
  | "hidden_backend_server_api_fabric_bus_broker_transport_adapter_connector_registry_task_import_export_package_persistence_runtime_semantics_fabric_aware_api_backend_contract_boundary_map_input_rejected"
  | "secure_drop_implementation_semantics_fabric_aware_api_backend_contract_boundary_map_input_rejected"
  | "backend_server_api_fabric_bus_broker_transport_adapter_connector_registry_task_import_export_package_persistence_runtime_implementation_semantics_fabric_aware_api_backend_contract_boundary_map_input_rejected"
  | "unsafe_backend_server_api_fabric_bus_broker_transport_adapter_connector_registry_task_import_export_package_persistence_runtime_flags_fabric_aware_api_backend_contract_boundary_map_input_rejected"
  | "nested_unsafe_flags_fabric_aware_api_backend_contract_boundary_map_input_rejected"
  | "noncanonical_fabric_aware_api_backend_contract_boundary_map_input_rejected";

export type FabricAwareApiBackendContractBoundaryFamily =
  | "api_contract"
  | "backend_contract"
  | "fabric_coordination"
  | "consumer_boundary";

export type FabricAwareApiBackendContractBoundaryRelatedRepo =
  | "ardyn"
  | "locus"
  | "multiverse"
  | "content-fabric"
  | "repo-family";

export type FabricAwareApiBackendContractBoundaryStatus =
  | "metadata_only"
  | "blocked"
  | "future_contract_required";

export interface FabricAwareApiBackendContractBoundaryEntry {
  boundaryId: string;
  boundaryFamily: FabricAwareApiBackendContractBoundaryFamily;
  relatedConsumerOrRepo: FabricAwareApiBackendContractBoundaryRelatedRepo;
  currentStatus: FabricAwareApiBackendContractBoundaryStatus;
  allowedCurrentBehavior: string[];
  forbiddenCurrentBehavior: string[];
  requiredFutureContractBeforeImplementation: string;
  requiredFutureAuthorizationPhaseBeforeRuntime: string;
  fabricRoleDescription: string;
  secureDropRoleDescription: string;
  productionReadinessAreaReference: {
    phase: "5.48";
    areaNumber: 2;
    areaName: "API & Backend Logic";
    sourceFixture: string;
    sourceStatus: "deferred";
    representedByPhase559: true;
    authorizesRuntime: false;
  };
  phase558ReviewPackageBoundaryReference: {
    phase: "5.58";
    sourceFixture: string;
    displayConformanceChainReferenced: true;
    importsPackages: false;
    exportsPackages: false;
    authorizesRuntime: false;
  };
  fabricBoundaryMetadataOnly: true;
  apiBackendBoundaryMetadataOnly: true;
  locusAndMultiverseConsumerTargetsOnly: boolean;
  contentFabricCanonicalSecureDropOwnerOnly: boolean;
  explicitBlockedAuthorizationFlags: Record<string, false>;
  unsafeBackendServerApiFabricBusBrokerTransportAdapterConnectorRegistryTaskImportExportPackagePersistenceRuntimeFlags:
    Record<string, false>;
  nonAuthorizingProof: true;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
  [key: string]: unknown;
}

export interface FabricAwareApiBackendContractBoundaryMapState {
  schema: "ardyn.phase-5.59.fabric-aware-api-backend-contract-boundary-map-state";
  schemaVersion: "0.1.0";
  stateKind: "fabric-aware-api-backend-contract-boundary-map";
  stateMode: "review-only";
  reviewedAt: string;
  sourcePhaseContext: Record<string, boolean | number | string>;
  boundaryEntries: FabricAwareApiBackendContractBoundaryEntry[];
  boundaryMapSummary: Record<string, boolean | number | string | string[] | Record<string, number>>;
  invalidBoundaryCasePolicy: Record<string, boolean>;
  topApiBackendFabricContractGaps: string[];
  recommendedNextPhase: string;
  fabricAwareApiBackendContractBoundaryMapOnly: true;
  reviewOnly: true;
  metadataOnly: true;
  authoritative: false;
  nonAuthorizingProof: true;
  backendRuntimeImplementedByArdyn: false;
  serverImplementedByArdyn: false;
  apiEndpointImplementedByArdyn: false;
  endpointImplementedByArdyn: false;
  httpServerImplementedByArdyn: false;
  websocketHttpTransportImplementedByArdyn: false;
  fabricRuntimeImplementedByArdyn: false;
  fabricBusBrokerTransportImplementedByArdyn: false;
  adapterRuntimeImplementedByArdyn: false;
  connectorGrantProduced: false;
  registryConnectionImplementedByArdyn: false;
  liveRegistryConnectionEnabled: false;
  taskExecutionImplementedByArdyn: false;
  taskExecutionEnabled: false;
  importExportPathImplementedByArdyn: false;
  packageDistributionImplementedByArdyn: false;
  packageWriterImplementedByArdyn: false;
  packageReaderImplementedByArdyn: false;
  packagePersistenceImplementedByArdyn: false;
  persistenceImplementedByArdyn: false;
  resultCollectorImplementedByArdyn: false;
  resultValidatorImplementedByArdyn: false;
  reviewRouterImplementedByArdyn: false;
  evaluatorImplementedByArdyn: false;
  evaluatorExecutionPerformed: false;
  approvalPathImplementedByArdyn: false;
  approvalDecisionProducedByArdyn: false;
  approvalGrantProducedByArdyn: false;
  commandExposureEnabled: false;
  commandRuntimeControlEnabled: false;
  runtimeExecutionEnabled: false;
  databaseStorageRuntimeWritesEnabled: false;
  secretsRuntimeIngestionEnabled: false;
  mcpToolExposureEnabled: false;
  secureDropImplemented: false;
  secureDropCryptoImplemented: false;
  secureDropTransportImplemented: false;
  secureDropStegoImplemented: false;
  secureDropSendReceiveImplemented: false;
  secureDropInboxPollingEnabled: false;
  fileSelectionEnabled: false;
  connectorIngestionAdded: false;
  secretVaultEnvAccessEnabled: false;
  st3ggVendored: false;
  serviceDiscoveryEnabled: false;
  scheduleEnforcementEnabled: false;
  backgroundPollingEnabled: false;
  filesystemScanningEnabled: false;
  processControlEnabled: false;
  externalLookupsEnabled: false;
  uiFrontendBrowserRenderingImplemented: false;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
  [key: string]: unknown;
}

export interface FabricAwareApiBackendContractBoundaryMapResult {
  schema: "ardyn.phase-5.59.fabric-aware-api-backend-contract-boundary-map-result";
  schemaVersion: "0.1.0";
  fabricAwareApiBackendContractBoundaryMapKind:
    "fabric-aware-api-backend-contract-boundary-map";
  fabricAwareApiBackendContractBoundaryMapMode: "review-only";
  reviewedAt: string;
  classification: FabricAwareApiBackendContractBoundaryMapClassification;
  fabricAwareApiBackendContractBoundaryMapProduced: boolean;
  fabricAwareApiBackendContractBoundaryMap:
    | FabricAwareApiBackendContractBoundaryMapState
    | null;
  boundaryMapSummary:
    | FabricAwareApiBackendContractBoundaryMapState["boundaryMapSummary"]
    | null;
  boundaryEntries: FabricAwareApiBackendContractBoundaryEntry[];
  invalidBoundaryCasePolicy: Record<string, boolean>;
  topApiBackendFabricContractGaps: string[];
  recommendedNextPhase: string | null;
  fabricAwareApiBackendContractBoundaryMapOnly: true;
  reviewOnly: true;
  metadataOnly: true;
  authoritative: false;
  nonAuthorizingProof: true;
  backendRuntimeImplementedByArdyn: false;
  serverImplementedByArdyn: false;
  apiEndpointImplementedByArdyn: false;
  endpointImplementedByArdyn: false;
  httpServerImplementedByArdyn: false;
  websocketHttpTransportImplementedByArdyn: false;
  fabricRuntimeImplementedByArdyn: false;
  fabricBusBrokerTransportImplementedByArdyn: false;
  adapterRuntimeImplementedByArdyn: false;
  connectorGrantProduced: false;
  registryConnectionImplementedByArdyn: false;
  liveRegistryConnectionEnabled: false;
  taskExecutionImplementedByArdyn: false;
  taskExecutionEnabled: false;
  importExportPathImplementedByArdyn: false;
  packageDistributionImplementedByArdyn: false;
  packageWriterImplementedByArdyn: false;
  packageReaderImplementedByArdyn: false;
  packagePersistenceImplementedByArdyn: false;
  persistenceImplementedByArdyn: false;
  resultCollectorImplementedByArdyn: false;
  resultValidatorImplementedByArdyn: false;
  reviewRouterImplementedByArdyn: false;
  evaluatorImplementedByArdyn: false;
  evaluatorExecutionPerformed: false;
  approvalPathImplementedByArdyn: false;
  approvalDecisionProducedByArdyn: false;
  approvalGrantProducedByArdyn: false;
  commandExposureEnabled: false;
  commandRuntimeControlEnabled: false;
  runtimeExecutionEnabled: false;
  databaseStorageRuntimeWritesEnabled: false;
  secretsRuntimeIngestionEnabled: false;
  mcpToolExposureEnabled: false;
  secureDropImplemented: false;
  secureDropCryptoImplemented: false;
  secureDropTransportImplemented: false;
  secureDropStegoImplemented: false;
  secureDropSendReceiveImplemented: false;
  secureDropInboxPollingEnabled: false;
  fileSelectionEnabled: false;
  connectorIngestionAdded: false;
  secretVaultEnvAccessEnabled: false;
  st3ggVendored: false;
  serviceDiscoveryEnabled: false;
  scheduleEnforcementEnabled: false;
  backgroundPollingEnabled: false;
  filesystemScanningEnabled: false;
  processControlEnabled: false;
  externalLookupsEnabled: false;
  uiFrontendBrowserRenderingImplemented: false;
  rejectionReasons: Array<Record<string, boolean | string>>;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
  [key: string]: unknown;
}

export type InterAgentEncodedHandoffConformanceClassification =
  | "valid_inter_agent_encoded_handoff_conformance_runtime_still_blocked"
  | "malformed_inter_agent_encoded_handoff_conformance_input_rejected"
  | "missing_required_inter_agent_encoded_handoff_conformance_entry_rejected"
  | "unknown_handoff_family_inter_agent_encoded_handoff_conformance_input_rejected"
  | "unknown_source_or_target_actor_inter_agent_encoded_handoff_conformance_input_rejected"
  | "unknown_encoded_handoff_mode_inter_agent_encoded_handoff_conformance_input_rejected"
  | "unknown_current_status_inter_agent_encoded_handoff_conformance_input_rejected"
  | "authorization_flags_enabled_inter_agent_encoded_handoff_conformance_input_rejected"
  | "report_runs_checks_true_inter_agent_encoded_handoff_conformance_input_rejected"
  | "runtime_authorization_attempt_inter_agent_encoded_handoff_conformance_input_rejected"
  | "command_exposure_attempt_inter_agent_encoded_handoff_conformance_input_rejected"
  | "blocked_cli_bypass_attempt_inter_agent_encoded_handoff_conformance_input_rejected"
  | "hidden_codec_translator_encoder_decoder_conlang_execution_semantics_inter_agent_encoded_handoff_conformance_input_rejected"
  | "hidden_steganography_covert_channel_tokenizer_exploit_guardrail_evasion_bypass_semantics_inter_agent_encoded_handoff_conformance_input_rejected"
  | "hidden_import_export_package_persistence_semantics_inter_agent_encoded_handoff_conformance_input_rejected"
  | "secure_drop_implementation_semantics_inter_agent_encoded_handoff_conformance_input_rejected"
  | "hidden_fabric_websocket_http_mcp_task_runtime_semantics_inter_agent_encoded_handoff_conformance_input_rejected"
  | "unsafe_runtime_command_connector_fabric_websocket_http_mcp_task_secure_drop_service_discovery_schedule_filesystem_process_flags_inter_agent_encoded_handoff_conformance_input_rejected"
  | "nested_unsafe_flags_inter_agent_encoded_handoff_conformance_input_rejected"
  | "noncanonical_inter_agent_encoded_handoff_conformance_input_rejected";

export type InterAgentEncodedHandoffFamily =
  | "subagent_encoded_handoff"
  | "locus_harness_bridge"
  | "fabric_coordination_envelope"
  | "operator_translation_bridge"
  | "handoff_audit_visibility"
  | "protocol_reference_layer";

export type InterAgentEncodedHandoffActor =
  | "ardyn"
  | "ardyn-subagent"
  | "locus"
  | "external-harness"
  | "multiverse"
  | "content-fabric";

export type InterAgentEncodedHandoffStatus =
  | "metadata_only"
  | "blocked"
  | "future_contract_required";

export type InterAgentEncodedHandoffMode =
  | "plaintext"
  | "structured_metadata"
  | "encoded_candidate_metadata"
  | "operator_translation_required";

export interface InterAgentEncodedHandoffOneClickOption {
  optionId: string;
  label: string;
  optionIntent: "metadata_only";
  allowedFuturePreference: string;
  forbiddenCurrentBehavior: string[];
  nonExecutable: true;
  changesRuntimeBehavior: false;
  changesReportRunsChecks: false;
  exposesCommands: false;
  authorizesRuntime: false;
  producesApprovalGrant: false;
  connectorGrantProduced: false;
  nonAuthorizingProof: true;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
  [key: string]: unknown;
}

export interface InterAgentEncodedHandoffConformanceEntry {
  handoffId: string;
  handoffFamily: InterAgentEncodedHandoffFamily;
  sourceActor: InterAgentEncodedHandoffActor;
  targetActor: InterAgentEncodedHandoffActor;
  currentStatus: InterAgentEncodedHandoffStatus;
  encodedHandoffMode: InterAgentEncodedHandoffMode;
  allowedCurrentBehavior: string[];
  forbiddenCurrentBehavior: string[];
  requiredFutureContractBeforeImplementation: string;
  requiredFutureAuthorizationPhaseBeforeRuntime: string;
  translatorFinalOutputRequirement: string;
  oneClickOperatorOptionMetadata: Record<string, unknown>;
  rawProtocolAuditVisibilityRequirement: string;
  locusRoleDescription: string;
  fabricRoleDescription: string;
  secureDropRoleDescription: string;
  glossopetraeArchitectureReferenceOnly: true;
  glossopetraeCopiedVendoredInstalledImportedIntegrated: false;
  futureProtocolReferences: string[];
  futureProtocolReferencesMetadataOnly: true;
  encodedHandoffConformanceMetadataOnly: true;
  operatorPlaintextFinalOutputRequired: boolean;
  rawProtocolAuditVisibleOrDigestRequired: true;
  explicitBlockedAuthorizationFlags: Record<string, false>;
  unsafeEncodedHandoffRuntimeFlags: Record<string, false>;
  nonAuthorizingProof: true;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
  [key: string]: unknown;
}

export interface InterAgentEncodedHandoffConformanceState {
  schema: "ardyn.phase-5.60.inter-agent-encoded-handoff-conformance-state";
  schemaVersion: "0.1.0";
  stateKind: "inter-agent-encoded-handoff-conformance";
  stateMode: "review-only";
  reviewedAt: string;
  sourcePhaseContext: Record<string, boolean | string>;
  handoffEntries: InterAgentEncodedHandoffConformanceEntry[];
  oneClickOptions: InterAgentEncodedHandoffOneClickOption[];
  handoffConformanceSummary: Record<string, boolean | number | string | string[] | Record<string, number>>;
  invalidHandoffCasePolicy: Record<string, boolean>;
  topInterAgentHandoffFabricApiBackendGaps: string[];
  recommendedNextPhase: string;
  interAgentEncodedHandoffConformanceOnly: true;
  reviewOnly: true;
  metadataOnly: true;
  authoritative: false;
  nonAuthorizingProof: true;
  reportRunsChecks: false;
  encodedHandoffRuntimeImplementedByArdyn: false;
  codecImplemented: false;
  translatorRuntimeImplemented: false;
  encoderImplemented: false;
  decoderImplemented: false;
  conlangGeneratorImplemented: false;
  seedGeneratorImplemented: false;
  protocolRuntimeImplemented: false;
  covertChannelImplemented: false;
  stegoLayerImplemented: false;
  semanticStegoImplemented: false;
  tokenExploiterImplemented: false;
  guardrailEvasionImplemented: false;
  bypassPathImplemented: false;
  hiddenPayloadPathImplemented: false;
  transportImplementedByArdyn: false;
  fabricRuntimeImplementedByArdyn: false;
  backendRuntimeImplementedByArdyn: false;
  apiEndpointImplementedByArdyn: false;
  serverImplementedByArdyn: false;
  importExportPathImplementedByArdyn: false;
  packageDistributionImplementedByArdyn: false;
  persistenceImplementedByArdyn: false;
  commandExposureEnabled: false;
  commandRuntimeControlEnabled: false;
  runtimeExecutionEnabled: false;
  databaseStorageRuntimeWritesEnabled: false;
  secretsRuntimeIngestionEnabled: false;
  connectorGrantProduced: false;
  mcpToolExposureEnabled: false;
  taskExecutionEnabled: false;
  secureDropImplemented: false;
  st3ggVendored: false;
  serviceDiscoveryEnabled: false;
  scheduleEnforcementEnabled: false;
  backgroundPollingEnabled: false;
  filesystemScanningEnabled: false;
  processControlEnabled: false;
  uiFrontendBrowserRenderingImplemented: false;
  blockedCliBypassEnabled: false;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
  [key: string]: unknown;
}

export interface InterAgentEncodedHandoffConformanceResult {
  schema: "ardyn.phase-5.60.inter-agent-encoded-handoff-conformance-result";
  schemaVersion: "0.1.0";
  interAgentEncodedHandoffConformanceKind:
    "inter-agent-encoded-handoff-conformance";
  interAgentEncodedHandoffConformanceMode: "review-only";
  reviewedAt: string;
  classification: InterAgentEncodedHandoffConformanceClassification;
  interAgentEncodedHandoffConformanceProduced: boolean;
  interAgentEncodedHandoffConformance:
    | InterAgentEncodedHandoffConformanceState
    | null;
  handoffConformanceSummary:
    | InterAgentEncodedHandoffConformanceState["handoffConformanceSummary"]
    | null;
  handoffEntries: InterAgentEncodedHandoffConformanceEntry[];
  oneClickOptions: InterAgentEncodedHandoffOneClickOption[];
  invalidHandoffCasePolicy: Record<string, boolean>;
  topInterAgentHandoffFabricApiBackendGaps: string[];
  recommendedNextPhase: string | null;
  interAgentEncodedHandoffConformanceOnly: true;
  reviewOnly: true;
  metadataOnly: true;
  authoritative: false;
  nonAuthorizingProof: true;
  reportRunsChecks: false;
  encodedHandoffRuntimeImplementedByArdyn: false;
  codecImplemented: false;
  translatorRuntimeImplemented: false;
  encoderImplemented: false;
  decoderImplemented: false;
  conlangGeneratorImplemented: false;
  seedGeneratorImplemented: false;
  protocolRuntimeImplemented: false;
  covertChannelImplemented: false;
  stegoLayerImplemented: false;
  semanticStegoImplemented: false;
  tokenExploiterImplemented: false;
  guardrailEvasionImplemented: false;
  bypassPathImplemented: false;
  hiddenPayloadPathImplemented: false;
  transportImplementedByArdyn: false;
  fabricRuntimeImplementedByArdyn: false;
  backendRuntimeImplementedByArdyn: false;
  apiEndpointImplementedByArdyn: false;
  serverImplementedByArdyn: false;
  importExportPathImplementedByArdyn: false;
  packageDistributionImplementedByArdyn: false;
  persistenceImplementedByArdyn: false;
  commandExposureEnabled: false;
  commandRuntimeControlEnabled: false;
  runtimeExecutionEnabled: false;
  databaseStorageRuntimeWritesEnabled: false;
  secretsRuntimeIngestionEnabled: false;
  connectorGrantProduced: false;
  mcpToolExposureEnabled: false;
  taskExecutionEnabled: false;
  secureDropImplemented: false;
  st3ggVendored: false;
  serviceDiscoveryEnabled: false;
  scheduleEnforcementEnabled: false;
  backgroundPollingEnabled: false;
  filesystemScanningEnabled: false;
  processControlEnabled: false;
  uiFrontendBrowserRenderingImplemented: false;
  blockedCliBypassEnabled: false;
  rejectionReasons: Array<Record<string, boolean | string>>;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
  [key: string]: unknown;
}

export type DatabaseStorageContractBoundaryMapClassification =
  | "valid_database_storage_contract_boundary_map_runtime_still_blocked"
  | "malformed_database_storage_contract_boundary_map_input_rejected"
  | "missing_required_database_storage_contract_boundary_entry_rejected"
  | "unknown_top_level_field_database_storage_contract_boundary_map_input_rejected"
  | "unknown_boundary_family_database_storage_contract_boundary_map_input_rejected"
  | "unknown_related_system_database_storage_contract_boundary_map_input_rejected"
  | "unknown_current_status_database_storage_contract_boundary_map_input_rejected"
  | "unknown_data_classification_database_storage_contract_boundary_map_input_rejected"
  | "authorization_flags_enabled_database_storage_contract_boundary_map_input_rejected"
  | "report_runs_checks_true_database_storage_contract_boundary_map_input_rejected"
  | "runtime_authorization_attempt_database_storage_contract_boundary_map_input_rejected"
  | "command_exposure_attempt_database_storage_contract_boundary_map_input_rejected"
  | "blocked_cli_bypass_attempt_database_storage_contract_boundary_map_input_rejected"
  | "hidden_database_connection_semantics_database_storage_contract_boundary_map_input_rejected"
  | "hidden_filesystem_write_semantics_database_storage_contract_boundary_map_input_rejected"
  | "hidden_transcript_audit_write_semantics_database_storage_contract_boundary_map_input_rejected"
  | "hidden_cache_invalidation_runtime_semantics_database_storage_contract_boundary_map_input_rejected"
  | "hidden_migration_schema_change_semantics_database_storage_contract_boundary_map_input_rejected"
  | "hidden_import_export_package_persistence_semantics_database_storage_contract_boundary_map_input_rejected"
  | "hidden_secure_drop_implementation_semantics_database_storage_contract_boundary_map_input_rejected"
  | "hidden_fabric_websocket_http_mcp_task_runtime_semantics_database_storage_contract_boundary_map_input_rejected"
  | "unsafe_database_storage_cache_persistence_write_migration_rls_backup_restore_retention_runtime_flags_database_storage_contract_boundary_map_input_rejected"
  | "nested_unsafe_flags_database_storage_contract_boundary_map_input_rejected"
  | "noncanonical_database_storage_contract_boundary_map_input_rejected";

export type DatabaseStorageContractBoundaryFamily =
  | "database_contract"
  | "storage_contract"
  | "cache_contract"
  | "invalidation_contract"
  | "data_isolation_contract"
  | "transcript_storage_contract"
  | "audit_storage_contract"
  | "artifact_storage_contract"
  | "retention_policy_contract"
  | "backup_recovery_contract";

export type DatabaseStorageContractBoundaryRelatedSystem =
  | "ardyn"
  | "ardyn-subagent"
  | "locus"
  | "multiverse"
  | "content-fabric"
  | "repo-family";

export type DatabaseStorageContractBoundaryStatus =
  | "metadata_only"
  | "blocked"
  | "future_contract_required";

export type DatabaseStorageContractBoundaryDataClassification =
  | "no_live_data"
  | "metadata_only"
  | "future_transcript_data"
  | "future_audit_data"
  | "future_user_content"
  | "future_secure_drop_metadata";

export interface DatabaseStorageContractBoundaryEntry {
  boundaryId: string;
  boundaryFamily: DatabaseStorageContractBoundaryFamily;
  relatedSystem: DatabaseStorageContractBoundaryRelatedSystem;
  currentStatus: DatabaseStorageContractBoundaryStatus;
  allowedCurrentBehavior: string[];
  forbiddenCurrentBehavior: string[];
  requiredFutureContractBeforeImplementation: string;
  requiredFutureAuthorizationPhaseBeforeRuntime: string;
  dataClassificationNotes: DatabaseStorageContractBoundaryDataClassification[];
  dataIsolationExpectation: string;
  cacheInvalidationExpectation: string;
  rlsAppPermissionExpectation: string;
  retentionDeletionExpectation: string;
  backupRecoveryExpectation: string;
  transcriptAuditWriteBoundaryNote: string;
  locusRoleDescription: string;
  multiverseRoleDescription: string;
  fabricRoleDescription: string;
  secureDropRoleDescription: string;
  productionReadinessAreaReference: Record<string, boolean | number | string>;
  phase559FabricAwareApiBackendReference: Record<string, boolean | string>;
  phase560EncodedHandoffConformanceReference: Record<string, boolean | string>;
  databaseStorageBoundaryMetadataOnly: true;
  noLiveDataAccessed: true;
  explicitBlockedAuthorizationFlags: Record<string, false>;
  unsafeDatabaseStorageRuntimeFlags: Record<string, false>;
  nonAuthorizingProof: true;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
  [key: string]: unknown;
}

export interface DatabaseStorageContractBoundaryMapState {
  schema: "ardyn.phase-5.61.database-storage-contract-boundary-map-state";
  schemaVersion: "0.1.0";
  stateKind: "database-storage-contract-boundary-map";
  stateMode: "review-only";
  reviewedAt: string;
  sourcePhaseContext: Record<string, boolean | number | string>;
  boundaryEntries: DatabaseStorageContractBoundaryEntry[];
  boundaryMapSummary: Record<string, boolean | number | string | string[] | Record<string, number>>;
  invalidBoundaryCasePolicy: Record<string, boolean>;
  topDatabaseStorageFabricApiBackendGaps: string[];
  recommendedNextPhase: string;
  databaseStorageContractBoundaryMapOnly: true;
  reviewOnly: true;
  metadataOnly: true;
  authoritative: false;
  nonAuthorizingProof: true;
  reportRunsChecks: false;
  databaseClientImplemented: false;
  databaseSchemaImplemented: false;
  databaseMigrationImplemented: false;
  rlsPolicyImplemented: false;
  storageAdapterImplemented: false;
  cacheEngineImplemented: false;
  cacheInvalidationRuntimeImplemented: false;
  transcriptWriterImplemented: false;
  auditWriterImplemented: false;
  filesystemWriteEnabled: false;
  backupRestoreImplemented: false;
  retentionDeletionJobImplemented: false;
  importExportPathImplementedByArdyn: false;
  packageDistributionImplementedByArdyn: false;
  persistenceImplementedByArdyn: false;
  backendRuntimeImplementedByArdyn: false;
  apiEndpointImplementedByArdyn: false;
  serverImplementedByArdyn: false;
  websocketHttpTransportImplementedByArdyn: false;
  fabricRuntimeImplementedByArdyn: false;
  commandExposureEnabled: false;
  commandRuntimeControlEnabled: false;
  runtimeExecutionEnabled: false;
  databaseStorageRuntimeWritesEnabled: false;
  secretsRuntimeIngestionEnabled: false;
  connectorGrantProduced: false;
  mcpToolExposureEnabled: false;
  taskExecutionEnabled: false;
  secureDropImplemented: false;
  st3ggVendored: false;
  encodedHandoffRuntimeImplementedByArdyn: false;
  codecImplemented: false;
  translatorRuntimeImplemented: false;
  serviceDiscoveryEnabled: false;
  scheduleEnforcementEnabled: false;
  backgroundPollingEnabled: false;
  filesystemScanningEnabled: false;
  processControlEnabled: false;
  uiFrontendBrowserRenderingImplemented: false;
  blockedCliBypassEnabled: false;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
  [key: string]: unknown;
}

export interface DatabaseStorageContractBoundaryMapResult {
  schema: "ardyn.phase-5.61.database-storage-contract-boundary-map-result";
  schemaVersion: "0.1.0";
  databaseStorageContractBoundaryMapKind: "database-storage-contract-boundary-map";
  databaseStorageContractBoundaryMapMode: "review-only";
  reviewedAt: string;
  classification: DatabaseStorageContractBoundaryMapClassification;
  databaseStorageContractBoundaryMapProduced: boolean;
  databaseStorageContractBoundaryMap:
    | DatabaseStorageContractBoundaryMapState
    | null;
  boundaryMapSummary:
    | DatabaseStorageContractBoundaryMapState["boundaryMapSummary"]
    | null;
  boundaryEntries: DatabaseStorageContractBoundaryEntry[];
  invalidBoundaryCasePolicy: Record<string, boolean>;
  topDatabaseStorageFabricApiBackendGaps: string[];
  recommendedNextPhase: string | null;
  databaseStorageContractBoundaryMapOnly: true;
  reviewOnly: true;
  metadataOnly: true;
  authoritative: false;
  nonAuthorizingProof: true;
  reportRunsChecks: false;
  databaseClientImplemented: false;
  databaseSchemaImplemented: false;
  databaseMigrationImplemented: false;
  rlsPolicyImplemented: false;
  storageAdapterImplemented: false;
  cacheEngineImplemented: false;
  cacheInvalidationRuntimeImplemented: false;
  transcriptWriterImplemented: false;
  auditWriterImplemented: false;
  filesystemWriteEnabled: false;
  backupRestoreImplemented: false;
  retentionDeletionJobImplemented: false;
  importExportPathImplementedByArdyn: false;
  packageDistributionImplementedByArdyn: false;
  persistenceImplementedByArdyn: false;
  backendRuntimeImplementedByArdyn: false;
  apiEndpointImplementedByArdyn: false;
  serverImplementedByArdyn: false;
  websocketHttpTransportImplementedByArdyn: false;
  fabricRuntimeImplementedByArdyn: false;
  commandExposureEnabled: false;
  commandRuntimeControlEnabled: false;
  runtimeExecutionEnabled: false;
  databaseStorageRuntimeWritesEnabled: false;
  secretsRuntimeIngestionEnabled: false;
  connectorGrantProduced: false;
  mcpToolExposureEnabled: false;
  taskExecutionEnabled: false;
  secureDropImplemented: false;
  st3ggVendored: false;
  encodedHandoffRuntimeImplementedByArdyn: false;
  codecImplemented: false;
  translatorRuntimeImplemented: false;
  serviceDiscoveryEnabled: false;
  scheduleEnforcementEnabled: false;
  backgroundPollingEnabled: false;
  filesystemScanningEnabled: false;
  processControlEnabled: false;
  uiFrontendBrowserRenderingImplemented: false;
  blockedCliBypassEnabled: false;
  rejectionReasons: Array<Record<string, boolean | string>>;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
  [key: string]: unknown;
}

export type AuthPermissionsContractBoundaryMapClassification =
  | "valid_auth_permissions_contract_boundary_map_runtime_still_blocked"
  | "malformed_auth_permissions_contract_boundary_map_input_rejected"
  | "missing_required_auth_permissions_contract_boundary_entry_rejected"
  | "unknown_top_level_field_auth_permissions_contract_boundary_map_input_rejected"
  | "unknown_boundary_family_auth_permissions_contract_boundary_map_input_rejected"
  | "unknown_related_system_auth_permissions_contract_boundary_map_input_rejected"
  | "unknown_current_status_auth_permissions_contract_boundary_map_input_rejected"
  | "authorization_flags_enabled_auth_permissions_contract_boundary_map_input_rejected"
  | "report_runs_checks_true_auth_permissions_contract_boundary_map_input_rejected"
  | "runtime_authorization_attempt_auth_permissions_contract_boundary_map_input_rejected"
  | "command_exposure_attempt_auth_permissions_contract_boundary_map_input_rejected"
  | "blocked_cli_bypass_attempt_auth_permissions_contract_boundary_map_input_rejected"
  | "hidden_login_session_token_api_key_semantics_auth_permissions_contract_boundary_map_input_rejected"
  | "hidden_permission_evaluator_semantics_auth_permissions_contract_boundary_map_input_rejected"
  | "hidden_approval_decision_grant_semantics_auth_permissions_contract_boundary_map_input_rejected"
  | "hidden_connector_grant_semantics_auth_permissions_contract_boundary_map_input_rejected"
  | "hidden_runtime_authorization_semantics_auth_permissions_contract_boundary_map_input_rejected"
  | "hidden_secret_env_vault_access_semantics_auth_permissions_contract_boundary_map_input_rejected"
  | "hidden_external_identity_provider_integration_semantics_auth_permissions_contract_boundary_map_input_rejected"
  | "hidden_keyring_did_secure_drop_implementation_semantics_auth_permissions_contract_boundary_map_input_rejected"
  | "hidden_database_storage_rls_persistence_semantics_auth_permissions_contract_boundary_map_input_rejected"
  | "hidden_fabric_websocket_http_mcp_task_runtime_semantics_auth_permissions_contract_boundary_map_input_rejected"
  | "unsafe_identity_authentication_authorization_session_token_api_key_role_permission_grant_secret_delegation_revocation_runtime_flags_auth_permissions_contract_boundary_map_input_rejected"
  | "nested_unsafe_flags_auth_permissions_contract_boundary_map_input_rejected"
  | "noncanonical_auth_permissions_contract_boundary_map_input_rejected";

export type AuthPermissionsContractBoundaryFamily =
  | "identity_contract"
  | "authentication_contract"
  | "authorization_contract"
  | "permission_contract"
  | "role_contract"
  | "operator_consent_contract"
  | "approval_prerequisite_contract"
  | "runtime_authorization_boundary"
  | "connector_grant_boundary"
  | "secret_access_boundary"
  | "delegation_boundary"
  | "revocation_boundary"
  | "audit_subject_boundary";

export type AuthPermissionsContractBoundaryRelatedSystem =
  | "ardyn"
  | "ardyn-subagent"
  | "locus"
  | "multiverse"
  | "content-fabric"
  | "repo-family";

export type AuthPermissionsContractBoundaryStatus =
  | "metadata_only"
  | "blocked"
  | "future_contract_required";

export interface AuthPermissionsContractBoundaryEntry {
  boundaryId: string;
  boundaryFamily: AuthPermissionsContractBoundaryFamily;
  relatedSystem: AuthPermissionsContractBoundaryRelatedSystem;
  currentStatus: AuthPermissionsContractBoundaryStatus;
  allowedCurrentBehavior: string[];
  forbiddenCurrentBehavior: string[];
  requiredFutureContractBeforeImplementation: string;
  requiredFutureAuthorizationPhaseBeforeRuntime: string;
  identitySubjectNotes: string;
  rolePermissionExpectation: string;
  consentApprovalExpectation: string;
  revocationExpectation: string;
  auditSubjectExpectation: string;
  locusRoleDescription: string;
  multiverseRoleDescription: string;
  fabricRoleDescription: string;
  secureDropRoleDescription: string;
  productionReadinessAreaReference: Record<string, boolean | number | string>;
  phase559FabricAwareApiBackendReference: Record<string, boolean | string>;
  phase560EncodedHandoffConformanceReference: Record<string, boolean | string>;
  phase561DatabaseStorageContractBoundaryReference: Record<string, boolean | string>;
  authPermissionsBoundaryMetadataOnly: true;
  noIdentityVerificationPerformed: true;
  explicitBlockedAuthorizationFlags: Record<string, false>;
  unsafeAuthPermissionsRuntimeFlags: Record<string, false>;
  nonAuthorizingProof: true;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
  [key: string]: unknown;
}

export interface AuthPermissionsContractBoundaryMapState {
  schema: "ardyn.phase-5.62.auth-permissions-contract-boundary-map-state";
  schemaVersion: "0.1.0";
  stateKind: "auth-permissions-contract-boundary-map";
  stateMode: "review-only";
  reviewedAt: string;
  sourcePhaseContext: Record<string, boolean | number | string>;
  boundaryEntries: AuthPermissionsContractBoundaryEntry[];
  boundaryMapSummary: Record<string, boolean | number | string | string[] | Record<string, number>>;
  invalidBoundaryCasePolicy: Record<string, boolean>;
  topAuthPermissionsDatabaseStorageFabricApiBackendGaps: string[];
  recommendedNextPhase: string;
  authPermissionsContractBoundaryMapOnly: true;
  reviewOnly: true;
  metadataOnly: true;
  authoritative: false;
  nonAuthorizingProof: true;
  reportRunsChecks: false;
  identityProviderImplemented: false;
  authenticationRuntimeImplemented: false;
  loginFlowImplemented: false;
  sessionRuntimeImplemented: false;
  tokenIssuerImplemented: false;
  apiKeyIssuerImplemented: false;
  roleEngineImplemented: false;
  permissionEvaluatorImplemented: false;
  authorizationEvaluatorImplemented: false;
  grantProducerImplemented: false;
  approvalDecisionProduced: false;
  approvalGrantProduced: false;
  secretVaultEnvAccessEnabled: false;
  connectorGrantProduced: false;
  delegationEngineImplemented: false;
  revocationEngineImplemented: false;
  runtimeAuthorizationEnabled: false;
  policyEnforcementRuntimeImplemented: false;
  externalIdentityProviderIntegrated: false;
  keyringDidImplemented: false;
  databaseClientImplemented: false;
  databaseSchemaImplemented: false;
  databaseMigrationImplemented: false;
  rlsPolicyImplemented: false;
  storageAdapterImplemented: false;
  cacheEngineImplemented: false;
  cacheInvalidationRuntimeImplemented: false;
  transcriptWriterImplemented: false;
  auditWriterImplemented: false;
  filesystemWriteEnabled: false;
  importExportPathImplementedByArdyn: false;
  packageDistributionImplementedByArdyn: false;
  persistenceImplementedByArdyn: false;
  backendRuntimeImplementedByArdyn: false;
  apiEndpointImplementedByArdyn: false;
  serverImplementedByArdyn: false;
  websocketHttpTransportImplementedByArdyn: false;
  fabricRuntimeImplementedByArdyn: false;
  encodedHandoffRuntimeImplementedByArdyn: false;
  codecImplemented: false;
  translatorRuntimeImplemented: false;
  commandExposureEnabled: false;
  commandRuntimeControlEnabled: false;
  runtimeExecutionEnabled: false;
  databaseStorageRuntimeWritesEnabled: false;
  secretsRuntimeIngestionEnabled: false;
  mcpToolExposureEnabled: false;
  taskExecutionEnabled: false;
  secureDropImplemented: false;
  st3ggVendored: false;
  serviceDiscoveryEnabled: false;
  scheduleEnforcementEnabled: false;
  backgroundPollingEnabled: false;
  filesystemScanningEnabled: false;
  processControlEnabled: false;
  uiFrontendBrowserRenderingImplemented: false;
  blockedCliBypassEnabled: false;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
  [key: string]: unknown;
}

export interface AuthPermissionsContractBoundaryMapResult {
  schema: "ardyn.phase-5.62.auth-permissions-contract-boundary-map-result";
  schemaVersion: "0.1.0";
  authPermissionsContractBoundaryMapKind: "auth-permissions-contract-boundary-map";
  authPermissionsContractBoundaryMapMode: "review-only";
  reviewedAt: string;
  classification: AuthPermissionsContractBoundaryMapClassification;
  authPermissionsContractBoundaryMapProduced: boolean;
  authPermissionsContractBoundaryMap:
    | AuthPermissionsContractBoundaryMapState
    | null;
  boundaryMapSummary:
    | AuthPermissionsContractBoundaryMapState["boundaryMapSummary"]
    | null;
  boundaryEntries: AuthPermissionsContractBoundaryEntry[];
  invalidBoundaryCasePolicy: Record<string, boolean>;
  topAuthPermissionsDatabaseStorageFabricApiBackendGaps: string[];
  recommendedNextPhase: string | null;
  authPermissionsContractBoundaryMapOnly: true;
  reviewOnly: true;
  metadataOnly: true;
  authoritative: false;
  nonAuthorizingProof: true;
  reportRunsChecks: false;
  identityProviderImplemented: false;
  authenticationRuntimeImplemented: false;
  loginFlowImplemented: false;
  sessionRuntimeImplemented: false;
  tokenIssuerImplemented: false;
  apiKeyIssuerImplemented: false;
  roleEngineImplemented: false;
  permissionEvaluatorImplemented: false;
  authorizationEvaluatorImplemented: false;
  grantProducerImplemented: false;
  approvalDecisionProduced: false;
  approvalGrantProduced: false;
  secretVaultEnvAccessEnabled: false;
  connectorGrantProduced: false;
  delegationEngineImplemented: false;
  revocationEngineImplemented: false;
  runtimeAuthorizationEnabled: false;
  policyEnforcementRuntimeImplemented: false;
  externalIdentityProviderIntegrated: false;
  keyringDidImplemented: false;
  databaseClientImplemented: false;
  databaseSchemaImplemented: false;
  databaseMigrationImplemented: false;
  rlsPolicyImplemented: false;
  storageAdapterImplemented: false;
  cacheEngineImplemented: false;
  cacheInvalidationRuntimeImplemented: false;
  transcriptWriterImplemented: false;
  auditWriterImplemented: false;
  filesystemWriteEnabled: false;
  importExportPathImplementedByArdyn: false;
  packageDistributionImplementedByArdyn: false;
  persistenceImplementedByArdyn: false;
  backendRuntimeImplementedByArdyn: false;
  apiEndpointImplementedByArdyn: false;
  serverImplementedByArdyn: false;
  websocketHttpTransportImplementedByArdyn: false;
  fabricRuntimeImplementedByArdyn: false;
  encodedHandoffRuntimeImplementedByArdyn: false;
  codecImplemented: false;
  translatorRuntimeImplemented: false;
  commandExposureEnabled: false;
  commandRuntimeControlEnabled: false;
  runtimeExecutionEnabled: false;
  databaseStorageRuntimeWritesEnabled: false;
  secretsRuntimeIngestionEnabled: false;
  mcpToolExposureEnabled: false;
  taskExecutionEnabled: false;
  secureDropImplemented: false;
  st3ggVendored: false;
  serviceDiscoveryEnabled: false;
  scheduleEnforcementEnabled: false;
  backgroundPollingEnabled: false;
  filesystemScanningEnabled: false;
  processControlEnabled: false;
  uiFrontendBrowserRenderingImplemented: false;
  blockedCliBypassEnabled: false;
  rejectionReasons: Array<Record<string, boolean | string>>;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
  [key: string]: unknown;
}

export type SecurityRlsInputSanitizationContractBoundaryFamily =
  | "input_sanitization_contract"
  | "schema_validation_contract"
  | "injection_prevention_contract"
  | "rls_contract"
  | "data_isolation_contract"
  | "permission_enforcement_contract"
  | "secure_transport_contract"
  | "content_safety_contract"
  | "dependency_security_contract"
  | "secret_exposure_contract"
  | "audit_integrity_contract"
  | "encoded_handoff_safety_contract"
  | "secure_drop_boundary_contract";
export type SecurityRlsInputSanitizationContractBoundaryRelatedSystem =
  | "ardyn"
  | "ardyn-subagent"
  | "locus"
  | "multiverse"
  | "content-fabric"
  | "repo-family";
export type SecurityRlsInputSanitizationContractBoundaryStatus =
  | "metadata_only"
  | "blocked"
  | "future_contract_required";
export type SecurityRlsInputSanitizationContractBoundaryMapClassification =
  | "valid_security_rls_input_sanitization_contract_boundary_map_runtime_still_blocked"
  | "malformed_security_rls_input_sanitization_contract_boundary_map_input_rejected"
  | "missing_required_security_rls_input_sanitization_contract_boundary_entry_rejected"
  | "unknown_top_level_field_security_rls_input_sanitization_contract_boundary_map_input_rejected"
  | "unknown_boundary_family_security_rls_input_sanitization_contract_boundary_map_input_rejected"
  | "unknown_related_system_security_rls_input_sanitization_contract_boundary_map_input_rejected"
  | "unknown_current_status_security_rls_input_sanitization_contract_boundary_map_input_rejected"
  | "authorization_flags_enabled_security_rls_input_sanitization_contract_boundary_map_input_rejected"
  | "report_runs_checks_true_security_rls_input_sanitization_contract_boundary_map_input_rejected"
  | "runtime_authorization_attempt_security_rls_input_sanitization_contract_boundary_map_input_rejected"
  | "command_exposure_attempt_security_rls_input_sanitization_contract_boundary_map_input_rejected"
  | "blocked_cli_bypass_attempt_security_rls_input_sanitization_contract_boundary_map_input_rejected"
  | "hidden_backend_api_server_middleware_semantics_security_rls_input_sanitization_contract_boundary_map_input_rejected"
  | "hidden_database_rls_schema_migration_semantics_security_rls_input_sanitization_contract_boundary_map_input_rejected"
  | "hidden_secret_env_vault_access_semantics_security_rls_input_sanitization_contract_boundary_map_input_rejected"
  | "hidden_connector_grant_semantics_security_rls_input_sanitization_contract_boundary_map_input_rejected"
  | "hidden_fabric_websocket_http_mcp_task_runtime_semantics_security_rls_input_sanitization_contract_boundary_map_input_rejected"
  | "hidden_secure_drop_implementation_semantics_security_rls_input_sanitization_contract_boundary_map_input_rejected"
  | "hidden_encoded_handoff_codec_translator_stego_covert_channel_tokenizer_exploit_bypass_semantics_security_rls_input_sanitization_contract_boundary_map_input_rejected"
  | "hidden_audit_log_write_tamper_evident_writer_semantics_security_rls_input_sanitization_contract_boundary_map_input_rejected"
  | "unsafe_sanitizer_rls_permission_secure_transport_dependency_audit_log_secret_connector_external_lookup_runtime_flags_security_rls_input_sanitization_contract_boundary_map_input_rejected"
  | "nested_unsafe_flags_security_rls_input_sanitization_contract_boundary_map_input_rejected"
  | "noncanonical_security_rls_input_sanitization_contract_boundary_map_input_rejected";

export interface SecurityRlsInputSanitizationContractBoundaryEntry {
  boundaryId: string;
  boundaryFamily: SecurityRlsInputSanitizationContractBoundaryFamily;
  relatedSystem: SecurityRlsInputSanitizationContractBoundaryRelatedSystem;
  currentStatus: SecurityRlsInputSanitizationContractBoundaryStatus;
  allowedCurrentBehavior: string[];
  forbiddenCurrentBehavior: string[];
  requiredFutureContractBeforeImplementation: string;
  requiredFutureAuthorizationPhaseBeforeRuntime: string;
  inputSanitizationExpectation: string;
  injectionPreventionExpectation: string;
  rlsDataIsolationExpectation: string;
  permissionEnforcementExpectation: string;
  dependencySecurityToolingExpectation: string;
  secureTransportExpectation: string;
  auditIntegrityExpectation: string;
  locusRoleDescription: string;
  multiverseRoleDescription: string;
  fabricRoleDescription: string;
  secureDropRoleDescription: string;
  productionReadinessAreaReference: Record<string, boolean | number | string>;
  phase559FabricAwareApiBackendReference: Record<string, boolean | string>;
  phase560EncodedHandoffConformanceReference: Record<string, boolean | string>;
  phase561DatabaseStorageContractBoundaryReference: Record<string, boolean | string>;
  phase562AuthPermissionsContractBoundaryReference: Record<string, boolean | string>;
  securityRlsInputSanitizationBoundaryMetadataOnly: true;
  noLiveSecurityEnforcementPerformed: true;
  explicitBlockedAuthorizationFlags: Record<string, false>;
  unsafeSecurityRlsInputRuntimeFlags: Record<string, false>;
  nonAuthorizingProof: true;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
  [key: string]: unknown;
}

export interface SecurityRlsInputSanitizationContractBoundaryMapState {
  schema: "ardyn.phase-5.63.security-rls-input-sanitization-contract-boundary-map-state";
  schemaVersion: "0.1.0";
  stateKind: "security-rls-input-sanitization-contract-boundary-map";
  stateMode: "review-only";
  reviewedAt: string;
  sourcePhaseContext: Record<string, boolean | number | string>;
  boundaryEntries: SecurityRlsInputSanitizationContractBoundaryEntry[];
  boundaryMapSummary: Record<string, boolean | number | string | string[] | Record<string, number>>;
  invalidBoundaryCasePolicy: Record<string, boolean>;
  topSecurityRlsAuthDatabaseFabricApiBackendGaps: string[];
  recommendedNextPhase: string;
  securityRlsInputSanitizationContractBoundaryMapOnly: true;
  reviewOnly: true;
  metadataOnly: true;
  authoritative: false;
  nonAuthorizingProof: true;
  reportRunsChecks: false;
  sanitizerRuntimeImplemented: false;
  runtimeSanitizerImplemented: false;
  securityMiddlewareImplemented: false;
  rlsRuntimeImplemented: false;
  rlsPolicyImplemented: false;
  permissionEnforcementRuntimeImplemented: false;
  secureTransportRuntimeImplemented: false;
  auditWriterImplemented: false;
  logWriterImplemented: false;
  secretVaultEnvAccessEnabled: false;
  connectorGrantProduced: false;
  databaseClientImplemented: false;
  databaseSchemaImplemented: false;
  databaseMigrationImplemented: false;
  storageAdapterImplemented: false;
  cacheEngineImplemented: false;
  cacheInvalidationRuntimeImplemented: false;
  transcriptWriterImplemented: false;
  filesystemWriteEnabled: false;
  importExportPathImplementedByArdyn: false;
  packageDistributionImplementedByArdyn: false;
  persistenceImplementedByArdyn: false;
  backendRuntimeImplementedByArdyn: false;
  apiEndpointImplementedByArdyn: false;
  serverImplementedByArdyn: false;
  websocketHttpTransportImplementedByArdyn: false;
  fabricRuntimeImplementedByArdyn: false;
  encodedHandoffRuntimeImplementedByArdyn: false;
  codecImplemented: false;
  translatorRuntimeImplemented: false;
  commandExposureEnabled: false;
  commandRuntimeControlEnabled: false;
  runtimeExecutionEnabled: false;
  databaseStorageRuntimeWritesEnabled: false;
  secretsRuntimeIngestionEnabled: false;
  mcpToolExposureEnabled: false;
  taskExecutionEnabled: false;
  secureDropImplemented: false;
  st3ggVendored: false;
  serviceDiscoveryEnabled: false;
  scheduleEnforcementEnabled: false;
  backgroundPollingEnabled: false;
  filesystemScanningEnabled: false;
  processControlEnabled: false;
  uiFrontendBrowserRenderingImplemented: false;
  blockedCliBypassEnabled: false;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
  [key: string]: unknown;
}

export interface SecurityRlsInputSanitizationContractBoundaryMapResult {
  schema: "ardyn.phase-5.63.security-rls-input-sanitization-contract-boundary-map-result";
  schemaVersion: "0.1.0";
  securityRlsInputSanitizationContractBoundaryMapKind:
    "security-rls-input-sanitization-contract-boundary-map";
  securityRlsInputSanitizationContractBoundaryMapMode: "review-only";
  reviewedAt: string;
  classification: SecurityRlsInputSanitizationContractBoundaryMapClassification;
  securityRlsInputSanitizationContractBoundaryMapProduced: boolean;
  securityRlsInputSanitizationContractBoundaryMap:
    | SecurityRlsInputSanitizationContractBoundaryMapState
    | null;
  boundaryMapSummary:
    | SecurityRlsInputSanitizationContractBoundaryMapState["boundaryMapSummary"]
    | null;
  boundaryEntries: SecurityRlsInputSanitizationContractBoundaryEntry[];
  invalidBoundaryCasePolicy: Record<string, boolean>;
  topSecurityRlsAuthDatabaseFabricApiBackendGaps: string[];
  recommendedNextPhase: string | null;
  securityRlsInputSanitizationContractBoundaryMapOnly: true;
  reviewOnly: true;
  metadataOnly: true;
  authoritative: false;
  nonAuthorizingProof: true;
  reportRunsChecks: false;
  rejectionReasons: Array<Record<string, boolean | string>>;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
  [key: string]: unknown;
}

export type RateLimitingAbuseControlContractBoundaryMapClassification =
  | "valid_rate_limiting_abuse_control_contract_boundary_map_runtime_still_blocked"
  | "malformed_rate_limiting_abuse_control_contract_boundary_map_input_rejected"
  | "missing_required_rate_limiting_abuse_control_contract_boundary_entry_rejected"
  | "unknown_top_level_field_rate_limiting_abuse_control_contract_boundary_map_input_rejected"
  | "unknown_boundary_family_rate_limiting_abuse_control_contract_boundary_map_input_rejected"
  | "unknown_related_system_rate_limiting_abuse_control_contract_boundary_map_input_rejected"
  | "unknown_current_status_rate_limiting_abuse_control_contract_boundary_map_input_rejected"
  | "authorization_flags_enabled_rate_limiting_abuse_control_contract_boundary_map_input_rejected"
  | "report_runs_checks_true_rate_limiting_abuse_control_contract_boundary_map_input_rejected"
  | "runtime_authorization_attempt_rate_limiting_abuse_control_contract_boundary_map_input_rejected"
  | "command_exposure_attempt_rate_limiting_abuse_control_contract_boundary_map_input_rejected"
  | "blocked_cli_bypass_attempt_rate_limiting_abuse_control_contract_boundary_map_input_rejected"
  | "hidden_rate_limit_middleware_semantics_rate_limiting_abuse_control_contract_boundary_map_input_rejected"
  | "hidden_quota_engine_semantics_rate_limiting_abuse_control_contract_boundary_map_input_rejected"
  | "hidden_abuse_detector_runtime_scanner_semantics_rate_limiting_abuse_control_contract_boundary_map_input_rejected"
  | "hidden_retry_circuit_breaker_execution_semantics_rate_limiting_abuse_control_contract_boundary_map_input_rejected"
  | "hidden_idempotency_persistence_semantics_rate_limiting_abuse_control_contract_boundary_map_input_rejected"
  | "hidden_backend_api_server_semantics_rate_limiting_abuse_control_contract_boundary_map_input_rejected"
  | "hidden_database_storage_cache_write_semantics_rate_limiting_abuse_control_contract_boundary_map_input_rejected"
  | "hidden_auth_session_token_api_key_semantics_rate_limiting_abuse_control_contract_boundary_map_input_rejected"
  | "hidden_connector_grant_semantics_rate_limiting_abuse_control_contract_boundary_map_input_rejected"
  | "hidden_fabric_websocket_http_mcp_task_runtime_semantics_rate_limiting_abuse_control_contract_boundary_map_input_rejected"
  | "hidden_secure_drop_implementation_semantics_rate_limiting_abuse_control_contract_boundary_map_input_rejected"
  | "hidden_encoded_handoff_codec_translator_stego_covert_channel_tokenizer_exploit_bypass_semantics_rate_limiting_abuse_control_contract_boundary_map_input_rejected"
  | "unsafe_limiter_quota_throttle_abuse_queue_scheduler_retry_circuit_breaker_idempotency_cost_backend_storage_runtime_flags_rate_limiting_abuse_control_contract_boundary_map_input_rejected"
  | "nested_unsafe_flags_rate_limiting_abuse_control_contract_boundary_map_input_rejected"
  | "noncanonical_rate_limiting_abuse_control_contract_boundary_map_input_rejected";

export interface RateLimitingAbuseControlContractBoundaryEntry {
  boundaryId: string;
  boundaryFamily:
    | "rate_limit_contract"
    | "quota_contract"
    | "throttle_contract"
    | "abuse_detection_contract"
    | "denial_of_service_boundary"
    | "backpressure_contract"
    | "retry_budget_contract"
    | "idempotency_contract"
    | "request_cost_contract"
    | "encoded_handoff_abuse_boundary"
    | "fabric_coordination_abuse_boundary"
    | "connector_abuse_boundary"
    | "secure_drop_abuse_boundary";
  relatedSystem:
    | "ardyn"
    | "ardyn-subagent"
    | "locus"
    | "multiverse"
    | "content-fabric"
    | "repo-family";
  currentStatus: "metadata_only" | "blocked" | "future_contract_required";
  allowedCurrentBehavior: string[];
  forbiddenCurrentBehavior: string[];
  requiredFutureContractBeforeImplementation: string;
  requiredFutureAuthorizationPhaseBeforeRuntime: string;
  requestIdentityExpectation: string;
  quotaSubjectExpectation: string;
  backpressureExpectation: string;
  retryIdempotencyExpectation: string;
  abuseSignalExpectation: string;
  locusRoleDescription: string;
  multiverseRoleDescription: string;
  fabricRoleDescription: string;
  secureDropRoleDescription: string;
  productionReadinessAreaReference: Record<string, boolean | number | string>;
  phase559FabricAwareApiBackendReference: Record<string, boolean | string>;
  phase560InterAgentEncodedHandoffConformanceReference: Record<string, boolean | string>;
  phase561DatabaseStorageContractBoundaryReference: Record<string, boolean | string>;
  phase562AuthPermissionsContractBoundaryReference: Record<string, boolean | string>;
  phase563SecurityRlsInputSanitizationBoundaryReference: Record<string, boolean | string>;
  rateLimitingAbuseControlBoundaryMetadataOnly: true;
  noLiveTrafficHandlingPerformed: true;
  explicitBlockedAuthorizationFlags: Record<string, false>;
  unsafeRateLimitingAbuseControlRuntimeFlags: Record<string, false>;
  nonAuthorizingProof: true;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
  [key: string]: unknown;
}

export interface RateLimitingAbuseControlContractBoundaryMapState {
  schema: "ardyn.phase-5.64.rate-limiting-abuse-control-contract-boundary-map-state";
  schemaVersion: "0.1.0";
  stateKind: "rate-limiting-abuse-control-contract-boundary-map";
  stateMode: "review-only";
  reviewedAt: string;
  sourcePhaseContext: Record<string, boolean | number | string>;
  boundaryEntries: RateLimitingAbuseControlContractBoundaryEntry[];
  boundaryMapSummary: Record<string, boolean | number | string | string[] | Record<string, number>>;
  invalidBoundaryCasePolicy: Record<string, boolean>;
  topRateLimitingSecurityAuthDatabaseFabricApiBackendGaps: string[];
  recommendedNextPhase: string;
  rateLimitingAbuseControlContractBoundaryMapOnly: true;
  reviewOnly: true;
  metadataOnly: true;
  authoritative: false;
  nonAuthorizingProof: true;
  reportRunsChecks: false;
  limiterRuntimeImplemented: false;
  rateLimiterRuntimeImplemented: false;
  quotaEngineImplemented: false;
  throttleRuntimeImplemented: false;
  abuseDetectorImplemented: false;
  queueImplemented: false;
  schedulerImplemented: false;
  retryEngineImplemented: false;
  circuitBreakerImplemented: false;
  idempotencyStoreImplemented: false;
  requestCostMeterImplemented: false;
  backendRuntimeImplementedByArdyn: false;
  apiEndpointImplementedByArdyn: false;
  serverImplementedByArdyn: false;
  databaseClientImplemented: false;
  storageAdapterImplemented: false;
  cacheEngineImplemented: false;
  databaseStorageRuntimeWritesEnabled: false;
  connectorGrantProduced: false;
  fabricRuntimeImplementedByArdyn: false;
  websocketHttpTransportImplementedByArdyn: false;
  mcpToolExposureEnabled: false;
  taskExecutionEnabled: false;
  secureDropImplemented: false;
  encodedHandoffRuntimeImplementedByArdyn: false;
  codecImplemented: false;
  translatorRuntimeImplemented: false;
  commandExposureEnabled: false;
  runtimeExecutionEnabled: false;
  secretsRuntimeIngestionEnabled: false;
  serviceDiscoveryEnabled: false;
  scheduleEnforcementEnabled: false;
  filesystemScanningEnabled: false;
  processControlEnabled: false;
  uiFrontendBrowserRenderingImplemented: false;
  blockedCliBypassEnabled: false;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
  [key: string]: unknown;
}

export interface RateLimitingAbuseControlContractBoundaryMapResult {
  schema: "ardyn.phase-5.64.rate-limiting-abuse-control-contract-boundary-map-result";
  schemaVersion: "0.1.0";
  rateLimitingAbuseControlContractBoundaryMapKind:
    "rate-limiting-abuse-control-contract-boundary-map";
  rateLimitingAbuseControlContractBoundaryMapMode: "review-only";
  reviewedAt: string;
  classification: RateLimitingAbuseControlContractBoundaryMapClassification;
  rateLimitingAbuseControlContractBoundaryMapProduced: boolean;
  rateLimitingAbuseControlContractBoundaryMap:
    | RateLimitingAbuseControlContractBoundaryMapState
    | null;
  boundaryMapSummary:
    | RateLimitingAbuseControlContractBoundaryMapState["boundaryMapSummary"]
    | null;
  boundaryEntries: RateLimitingAbuseControlContractBoundaryEntry[];
  invalidBoundaryCasePolicy: Record<string, boolean>;
  topRateLimitingSecurityAuthDatabaseFabricApiBackendGaps: string[];
  recommendedNextPhase: string | null;
  rateLimitingAbuseControlContractBoundaryMapOnly: true;
  reviewOnly: true;
  metadataOnly: true;
  authoritative: false;
  nonAuthorizingProof: true;
  reportRunsChecks: false;
  rejectionReasons: Array<Record<string, boolean | string>>;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
  [key: string]: unknown;
}

export type ErrorTrackingLoggingAuditIntegrityContractBoundaryMapClassification =
  | "valid_error_tracking_logging_audit_integrity_contract_boundary_map_runtime_still_blocked"
  | "malformed_error_tracking_logging_audit_integrity_contract_boundary_map_input_rejected"
  | "missing_required_error_tracking_logging_audit_integrity_contract_boundary_entry_rejected"
  | "unknown_top_level_field_error_tracking_logging_audit_integrity_contract_boundary_map_input_rejected"
  | "unknown_boundary_family_error_tracking_logging_audit_integrity_contract_boundary_map_input_rejected"
  | "unknown_related_system_error_tracking_logging_audit_integrity_contract_boundary_map_input_rejected"
  | "unknown_current_status_error_tracking_logging_audit_integrity_contract_boundary_map_input_rejected"
  | "authorization_flags_enabled_error_tracking_logging_audit_integrity_contract_boundary_map_input_rejected"
  | "report_runs_checks_true_error_tracking_logging_audit_integrity_contract_boundary_map_input_rejected"
  | "runtime_authorization_attempt_error_tracking_logging_audit_integrity_contract_boundary_map_input_rejected"
  | "command_exposure_attempt_error_tracking_logging_audit_integrity_contract_boundary_map_input_rejected"
  | "blocked_cli_bypass_attempt_error_tracking_logging_audit_integrity_contract_boundary_map_input_rejected"
  | "hidden_log_writer_semantics_error_tracking_logging_audit_integrity_contract_boundary_map_input_rejected"
  | "hidden_audit_transcript_write_semantics_error_tracking_logging_audit_integrity_contract_boundary_map_input_rejected"
  | "hidden_telemetry_export_external_sink_semantics_error_tracking_logging_audit_integrity_contract_boundary_map_input_rejected"
  | "hidden_tamper_evident_chain_writer_semantics_error_tracking_logging_audit_integrity_contract_boundary_map_input_rejected"
  | "hidden_redaction_runtime_semantics_error_tracking_logging_audit_integrity_contract_boundary_map_input_rejected"
  | "hidden_backend_api_server_semantics_error_tracking_logging_audit_integrity_contract_boundary_map_input_rejected"
  | "hidden_database_storage_cache_write_semantics_error_tracking_logging_audit_integrity_contract_boundary_map_input_rejected"
  | "hidden_auth_session_token_api_key_semantics_error_tracking_logging_audit_integrity_contract_boundary_map_input_rejected"
  | "hidden_connector_grant_semantics_error_tracking_logging_audit_integrity_contract_boundary_map_input_rejected"
  | "hidden_fabric_websocket_http_mcp_task_runtime_semantics_error_tracking_logging_audit_integrity_contract_boundary_map_input_rejected"
  | "hidden_secure_drop_implementation_semantics_error_tracking_logging_audit_integrity_contract_boundary_map_input_rejected"
  | "hidden_encoded_handoff_codec_translator_stego_covert_channel_tokenizer_exploit_bypass_semantics_error_tracking_logging_audit_integrity_contract_boundary_map_input_rejected"
  | "unsafe_logger_audit_transcript_telemetry_error_external_sink_tamper_redaction_trace_alerting_backend_storage_runtime_flags_error_tracking_logging_audit_integrity_contract_boundary_map_input_rejected"
  | "nested_unsafe_flags_error_tracking_logging_audit_integrity_contract_boundary_map_input_rejected"
  | "noncanonical_error_tracking_logging_audit_integrity_contract_boundary_map_input_rejected";

export interface ErrorTrackingLoggingAuditIntegrityContractBoundaryEntry {
  boundaryId: string;
  boundaryFamily:
    | "error_tracking_contract"
    | "logging_contract"
    | "audit_integrity_contract"
    | "tamper_evidence_contract"
    | "trace_correlation_contract"
    | "transcript_observability_contract"
    | "redaction_contract"
    | "retention_contract"
    | "external_sink_boundary"
    | "abuse_event_observability_contract"
    | "encoded_handoff_audit_contract"
    | "fabric_observability_contract"
    | "secure_drop_audit_boundary";
  relatedSystem:
    | "ardyn"
    | "ardyn-subagent"
    | "locus"
    | "multiverse"
    | "content-fabric"
    | "repo-family";
  currentStatus: "metadata_only" | "blocked" | "future_contract_required";
  allowedCurrentBehavior: string[];
  forbiddenCurrentBehavior: string[];
  requiredFutureContractBeforeImplementation: string;
  requiredFutureAuthorizationPhaseBeforeRuntime: string;
  errorClassificationExpectation: string;
  logEventShapeExpectation: string;
  auditSubjectExpectation: string;
  tamperEvidenceExpectation: string;
  redactionExpectation: string;
  retentionDeletionExpectation: string;
  correlationIdempotencyExpectation: string;
  locusRoleDescription: string;
  multiverseRoleDescription: string;
  fabricRoleDescription: string;
  secureDropRoleDescription: string;
  productionReadinessAreaReference: Record<string, boolean | number | string>;
  phase559FabricAwareApiBackendReference: Record<string, boolean | string>;
  phase560InterAgentEncodedHandoffConformanceReference: Record<string, boolean | string>;
  phase561DatabaseStorageContractBoundaryReference: Record<string, boolean | string>;
  phase562AuthPermissionsContractBoundaryReference: Record<string, boolean | string>;
  phase563SecurityRlsInputSanitizationBoundaryReference: Record<string, boolean | string>;
  phase564RateLimitingAbuseControlBoundaryReference: Record<string, boolean | string>;
  errorTrackingLoggingAuditIntegrityBoundaryMetadataOnly: true;
  noLiveObservabilityPerformed: true;
  explicitBlockedAuthorizationFlags: Record<string, false>;
  unsafeErrorLoggingAuditRuntimeFlags: Record<string, false>;
  nonAuthorizingProof: true;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
  [key: string]: unknown;
}

export interface ErrorTrackingLoggingAuditIntegrityContractBoundaryMapState {
  schema: "ardyn.phase-5.65.error-tracking-logging-audit-integrity-contract-boundary-map-state";
  schemaVersion: "0.1.0";
  stateKind: "error-tracking-logging-audit-integrity-contract-boundary-map";
  stateMode: "review-only";
  reviewedAt: string;
  sourcePhaseContext: Record<string, boolean | number | string>;
  boundaryEntries: ErrorTrackingLoggingAuditIntegrityContractBoundaryEntry[];
  boundaryMapSummary: Record<string, boolean | number | string | string[] | Record<string, number>>;
  invalidBoundaryCasePolicy: Record<string, boolean>;
  topObservabilityLoggingSecurityRateLimitingAuthDatabaseFabricApiBackendGaps: string[];
  recommendedNextPhase: string;
  errorTrackingLoggingAuditIntegrityContractBoundaryMapOnly: true;
  reviewOnly: true;
  metadataOnly: true;
  authoritative: false;
  nonAuthorizingProof: true;
  reportRunsChecks: false;
  loggerRuntimeImplemented: false;
  logWriterImplemented: false;
  auditWriterImplemented: false;
  transcriptWriterImplemented: false;
  telemetryClientImplemented: false;
  errorCollectorImplemented: false;
  externalSinkImplemented: false;
  redactionRuntimeImplemented: false;
  tamperEvidentWriterImplemented: false;
  digestWriterImplemented: false;
  traceCollectorImplemented: false;
  alertingRuntimeImplemented: false;
  backendRuntimeImplementedByArdyn: false;
  apiEndpointImplementedByArdyn: false;
  serverImplementedByArdyn: false;
  databaseStorageRuntimeWritesEnabled: false;
  fabricRuntimeImplementedByArdyn: false;
  encodedHandoffRuntimeImplementedByArdyn: false;
  commandExposureEnabled: false;
  runtimeExecutionEnabled: false;
  secretsRuntimeIngestionEnabled: false;
  connectorGrantProduced: false;
  mcpToolExposureEnabled: false;
  taskExecutionEnabled: false;
  secureDropImplemented: false;
  serviceDiscoveryEnabled: false;
  scheduleEnforcementEnabled: false;
  filesystemScanningEnabled: false;
  processControlEnabled: false;
  uiFrontendBrowserRenderingImplemented: false;
  blockedCliBypassEnabled: false;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
  [key: string]: unknown;
}

export interface ErrorTrackingLoggingAuditIntegrityContractBoundaryMapResult {
  schema: "ardyn.phase-5.65.error-tracking-logging-audit-integrity-contract-boundary-map-result";
  schemaVersion: "0.1.0";
  errorTrackingLoggingAuditIntegrityContractBoundaryMapKind:
    "error-tracking-logging-audit-integrity-contract-boundary-map";
  errorTrackingLoggingAuditIntegrityContractBoundaryMapMode: "review-only";
  reviewedAt: string;
  classification: ErrorTrackingLoggingAuditIntegrityContractBoundaryMapClassification;
  errorTrackingLoggingAuditIntegrityContractBoundaryMapProduced: boolean;
  errorTrackingLoggingAuditIntegrityContractBoundaryMap:
    | ErrorTrackingLoggingAuditIntegrityContractBoundaryMapState
    | null;
  boundaryMapSummary:
    | ErrorTrackingLoggingAuditIntegrityContractBoundaryMapState["boundaryMapSummary"]
    | null;
  boundaryEntries: ErrorTrackingLoggingAuditIntegrityContractBoundaryEntry[];
  invalidBoundaryCasePolicy: Record<string, boolean>;
  topObservabilityLoggingSecurityRateLimitingAuthDatabaseFabricApiBackendGaps: string[];
  recommendedNextPhase: string | null;
  errorTrackingLoggingAuditIntegrityContractBoundaryMapOnly: true;
  reviewOnly: true;
  metadataOnly: true;
  authoritative: false;
  nonAuthorizingProof: true;
  reportRunsChecks: false;
  rejectionReasons: Array<Record<string, boolean | string>>;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
  [key: string]: unknown;
}

export type AvailabilityRecoveryContractBoundaryMapClassification =
  | "valid_availability_recovery_contract_boundary_map_runtime_still_blocked"
  | "malformed_availability_recovery_contract_boundary_map_input_rejected"
  | "missing_required_availability_recovery_contract_boundary_entry_rejected"
  | "unknown_top_level_field_availability_recovery_contract_boundary_map_input_rejected"
  | "unknown_boundary_family_availability_recovery_contract_boundary_map_input_rejected"
  | "unknown_related_system_availability_recovery_contract_boundary_map_input_rejected"
  | "unknown_current_status_availability_recovery_contract_boundary_map_input_rejected"
  | "authorization_flags_enabled_availability_recovery_contract_boundary_map_input_rejected"
  | "report_runs_checks_true_availability_recovery_contract_boundary_map_input_rejected"
  | "runtime_authorization_attempt_availability_recovery_contract_boundary_map_input_rejected"
  | "command_exposure_attempt_availability_recovery_contract_boundary_map_input_rejected"
  | "blocked_cli_bypass_attempt_availability_recovery_contract_boundary_map_input_rejected"
  | "hidden_health_check_runtime_semantics_availability_recovery_contract_boundary_map_input_rejected"
  | "hidden_monitor_scheduler_semantics_availability_recovery_contract_boundary_map_input_rejected"
  | "hidden_backup_restore_execution_semantics_availability_recovery_contract_boundary_map_input_rejected"
  | "hidden_failover_degraded_mode_runtime_semantics_availability_recovery_contract_boundary_map_input_rejected"
  | "hidden_process_supervision_semantics_availability_recovery_contract_boundary_map_input_rejected"
  | "hidden_backend_api_server_semantics_availability_recovery_contract_boundary_map_input_rejected"
  | "hidden_database_storage_cache_write_semantics_availability_recovery_contract_boundary_map_input_rejected"
  | "hidden_auth_session_token_api_key_semantics_availability_recovery_contract_boundary_map_input_rejected"
  | "hidden_connector_grant_semantics_availability_recovery_contract_boundary_map_input_rejected"
  | "hidden_fabric_websocket_http_mcp_task_runtime_semantics_availability_recovery_contract_boundary_map_input_rejected"
  | "hidden_secure_drop_implementation_semantics_availability_recovery_contract_boundary_map_input_rejected"
  | "hidden_encoded_handoff_codec_translator_stego_covert_channel_tokenizer_exploit_bypass_semantics_availability_recovery_contract_boundary_map_input_rejected"
  | "hidden_logger_audit_transcript_telemetry_external_sink_semantics_availability_recovery_contract_boundary_map_input_rejected"
  | "unsafe_availability_recovery_health_monitor_scheduler_backup_restore_failover_process_supervisor_backend_storage_runtime_flags_availability_recovery_contract_boundary_map_input_rejected"
  | "nested_unsafe_flags_availability_recovery_contract_boundary_map_input_rejected"
  | "noncanonical_availability_recovery_contract_boundary_map_input_rejected";

export interface AvailabilityRecoveryContractBoundaryEntry {
  boundaryId: string;
  boundaryFamily:
    | "availability_contract"
    | "health_check_contract"
    | "resilience_contract"
    | "disaster_recovery_contract"
    | "backup_contract"
    | "restore_contract"
    | "rto_rpo_contract"
    | "failover_contract"
    | "degraded_mode_contract"
    | "recovery_drill_contract"
    | "runtime_unavailability_contract"
    | "fabric_recovery_boundary"
    | "secure_drop_recovery_boundary";
  relatedSystem:
    | "ardyn"
    | "ardyn-subagent"
    | "locus"
    | "multiverse"
    | "content-fabric"
    | "repo-family";
  currentStatus: "metadata_only" | "blocked" | "future_contract_required";
  allowedCurrentBehavior: string[];
  forbiddenCurrentBehavior: string[];
  requiredFutureContractBeforeImplementation: string;
  requiredFutureAuthorizationPhaseBeforeRuntime: string;
  availabilityExpectation: string;
  degradedModeExpectation: string;
  healthCheckExpectation: string;
  backupRestoreExpectation: string;
  rtoRpoExpectation: string;
  recoveryDrillExpectation: string;
  dependencyFailureDomainExpectation: string;
  locusRoleDescription: string;
  multiverseRoleDescription: string;
  fabricRoleDescription: string;
  secureDropRoleDescription: string;
  productionReadinessAreaReference: Record<string, boolean | number | string>;
  phase559FabricAwareApiBackendReference: Record<string, boolean | string>;
  phase560InterAgentEncodedHandoffConformanceReference: Record<string, boolean | string>;
  phase561DatabaseStorageContractBoundaryReference: Record<string, boolean | string>;
  phase562AuthPermissionsContractBoundaryReference: Record<string, boolean | string>;
  phase563SecurityRlsInputSanitizationBoundaryReference: Record<string, boolean | string>;
  phase564RateLimitingAbuseControlBoundaryReference: Record<string, boolean | string>;
  phase565ErrorTrackingLoggingAuditIntegrityBoundaryReference: Record<string, boolean | string>;
  availabilityRecoveryBoundaryMetadataOnly: true;
  noLiveAvailabilityRecoveryPerformed: true;
  explicitBlockedAuthorizationFlags: Record<string, false>;
  unsafeAvailabilityRecoveryRuntimeFlags: Record<string, false>;
  nonAuthorizingProof: true;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
  [key: string]: unknown;
}

export interface AvailabilityRecoveryContractBoundaryMapState {
  schema: "ardyn.phase-5.66.availability-recovery-contract-boundary-map-state";
  schemaVersion: "0.1.0";
  stateKind: "availability-recovery-contract-boundary-map";
  stateMode: "review-only";
  reviewedAt: string;
  sourcePhaseContext: Record<string, boolean | number | string>;
  boundaryEntries: AvailabilityRecoveryContractBoundaryEntry[];
  boundaryMapSummary: Record<string, boolean | number | string | string[] | Record<string, number>>;
  invalidBoundaryCasePolicy: Record<string, boolean>;
  topAvailabilityRecoveryObservabilitySecurityRateLimitingAuthDatabaseFabricApiBackendGaps: string[];
  recommendedNextPhase: string;
  availabilityRecoveryContractBoundaryMapOnly: true;
  reviewOnly: true;
  metadataOnly: true;
  authoritative: false;
  nonAuthorizingProof: true;
  reportRunsChecks: false;
  healthCheckerImplemented: false;
  healthCheckRuntimeImplemented: false;
  monitorImplemented: false;
  schedulerImplemented: false;
  backupJobImplemented: false;
  restoreJobImplemented: false;
  failoverRuntimeImplemented: false;
  degradedModeRuntimeImplemented: false;
  recoveryAutomationImplemented: false;
  processSupervisorImplemented: false;
  externalServiceIntegrationImplemented: false;
  backendRuntimeImplementedByArdyn: false;
  apiEndpointImplementedByArdyn: false;
  serverImplementedByArdyn: false;
  databaseStorageRuntimeWritesEnabled: false;
  fabricRuntimeImplementedByArdyn: false;
  encodedHandoffRuntimeImplementedByArdyn: false;
  commandExposureEnabled: false;
  runtimeExecutionEnabled: false;
  secretsRuntimeIngestionEnabled: false;
  connectorGrantProduced: false;
  mcpToolExposureEnabled: false;
  taskExecutionEnabled: false;
  secureDropImplemented: false;
  serviceDiscoveryEnabled: false;
  scheduleEnforcementEnabled: false;
  filesystemScanningEnabled: false;
  processControlEnabled: false;
  uiFrontendBrowserRenderingImplemented: false;
  blockedCliBypassEnabled: false;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
  [key: string]: unknown;
}

export interface AvailabilityRecoveryContractBoundaryMapResult {
  schema: "ardyn.phase-5.66.availability-recovery-contract-boundary-map-result";
  schemaVersion: "0.1.0";
  availabilityRecoveryContractBoundaryMapKind:
    "availability-recovery-contract-boundary-map";
  availabilityRecoveryContractBoundaryMapMode: "review-only";
  reviewedAt: string;
  classification: AvailabilityRecoveryContractBoundaryMapClassification;
  availabilityRecoveryContractBoundaryMapProduced: boolean;
  availabilityRecoveryContractBoundaryMap:
    | AvailabilityRecoveryContractBoundaryMapState
    | null;
  boundaryMapSummary:
    | AvailabilityRecoveryContractBoundaryMapState["boundaryMapSummary"]
    | null;
  boundaryEntries: AvailabilityRecoveryContractBoundaryEntry[];
  invalidBoundaryCasePolicy: Record<string, boolean>;
  topAvailabilityRecoveryObservabilitySecurityRateLimitingAuthDatabaseFabricApiBackendGaps: string[];
  recommendedNextPhase: string | null;
  availabilityRecoveryContractBoundaryMapOnly: true;
  reviewOnly: true;
  metadataOnly: true;
  authoritative: false;
  nonAuthorizingProof: true;
  reportRunsChecks: false;
  rejectionReasons: Array<Record<string, boolean | string>>;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
  [key: string]: unknown;
}

export type InfrastructureComplianceDataRetentionContractBoundaryMapClassification =
  | "valid_infrastructure_compliance_data_retention_contract_boundary_map_runtime_still_blocked"
  | "malformed_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected"
  | "missing_required_infrastructure_compliance_data_retention_contract_boundary_entry_rejected"
  | "unknown_top_level_field_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected"
  | "unknown_boundary_family_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected"
  | "unknown_related_system_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected"
  | "unknown_current_status_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected"
  | "authorization_flags_enabled_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected"
  | "report_runs_checks_true_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected"
  | "runtime_authorization_attempt_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected"
  | "command_exposure_attempt_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected"
  | "blocked_cli_bypass_attempt_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected"
  | "hidden_infrastructure_automation_semantics_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected"
  | "hidden_deployment_cloud_provisioning_semantics_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected"
  | "hidden_compliance_certification_enforcement_semantics_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected"
  | "hidden_pii_collection_processing_semantics_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected"
  | "hidden_retention_deletion_export_execution_semantics_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected"
  | "hidden_vendor_external_service_integration_semantics_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected"
  | "hidden_secret_env_vault_access_semantics_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected"
  | "hidden_backend_api_server_semantics_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected"
  | "hidden_database_storage_cache_write_semantics_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected"
  | "hidden_auth_session_token_api_key_semantics_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected"
  | "hidden_connector_grant_semantics_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected"
  | "hidden_fabric_websocket_http_mcp_task_runtime_semantics_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected"
  | "hidden_secure_drop_implementation_semantics_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected"
  | "hidden_encoded_handoff_codec_translator_stego_covert_channel_tokenizer_exploit_bypass_semantics_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected"
  | "hidden_logger_audit_transcript_telemetry_external_sink_semantics_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected"
  | "hidden_health_backup_restore_failover_scheduler_process_supervisor_semantics_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected"
  | "unsafe_infrastructure_compliance_data_retention_runtime_flags_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected"
  | "nested_unsafe_flags_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected"
  | "noncanonical_infrastructure_compliance_data_retention_contract_boundary_map_input_rejected";

export interface InfrastructureComplianceDataRetentionContractBoundaryEntry {
  boundaryId: string;
  boundaryFamily:
    | "infrastructure_management_contract"
    | "deployment_governance_contract"
    | "environment_boundary_contract"
    | "compliance_readiness_contract"
    | "pii_boundary_contract"
    | "data_retention_contract"
    | "data_deletion_contract"
    | "data_export_contract"
    | "policy_governance_contract"
    | "data_processing_inventory_contract"
    | "vendor_external_service_boundary"
    | "secure_drop_compliance_boundary"
    | "fabric_compliance_boundary";
  relatedSystem:
    | "ardyn"
    | "ardyn-subagent"
    | "locus"
    | "multiverse"
    | "content-fabric"
    | "repo-family";
  currentStatus: "metadata_only" | "blocked" | "future_contract_required";
  allowedCurrentBehavior: string[];
  forbiddenCurrentBehavior: string[];
  requiredFutureContractBeforeImplementation: string;
  requiredFutureAuthorizationPhaseBeforeRuntime: string;
  infrastructureOwnershipExpectation: string;
  environmentSeparationExpectation: string;
  piiDataClassificationExpectation: string;
  retentionDeletionExportExpectation: string;
  compliancePostureNotes: string;
  vendorExternalServiceExpectation: string;
  policyGovernanceExpectation: string;
  locusRoleDescription: string;
  multiverseRoleDescription: string;
  fabricRoleDescription: string;
  secureDropRoleDescription: string;
  productionReadinessAreaReference: Record<string, boolean | number | string>;
  phase559FabricAwareApiBackendReference: Record<string, boolean | string>;
  phase560InterAgentEncodedHandoffConformanceReference: Record<string, boolean | string>;
  phase561DatabaseStorageContractBoundaryReference: Record<string, boolean | string>;
  phase562AuthPermissionsContractBoundaryReference: Record<string, boolean | string>;
  phase563SecurityRlsInputSanitizationBoundaryReference: Record<string, boolean | string>;
  phase564RateLimitingAbuseControlBoundaryReference: Record<string, boolean | string>;
  phase565ErrorTrackingLoggingAuditIntegrityBoundaryReference: Record<string, boolean | string>;
  phase566AvailabilityRecoveryBoundaryReference: Record<string, boolean | string>;
  infrastructureComplianceDataRetentionBoundaryMetadataOnly: true;
  noLiveInfrastructureComplianceDataRetentionPerformed: true;
  explicitBlockedAuthorizationFlags: Record<string, false>;
  unsafeInfrastructureComplianceDataRetentionRuntimeFlags: Record<string, false>;
  nonAuthorizingProof: true;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
  [key: string]: unknown;
}

export interface InfrastructureComplianceDataRetentionContractBoundaryMapState {
  schema: "ardyn.phase-5.67.infrastructure-compliance-data-retention-contract-boundary-map-state";
  schemaVersion: "0.1.0";
  stateKind: "infrastructure-compliance-data-retention-contract-boundary-map";
  stateMode: "review-only";
  reviewedAt: string;
  sourcePhaseContext: Record<string, boolean | number | string>;
  boundaryEntries: InfrastructureComplianceDataRetentionContractBoundaryEntry[];
  boundaryMapSummary: Record<string, boolean | number | string | string[] | Record<string, number>>;
  invalidBoundaryCasePolicy: Record<string, boolean>;
  topInfrastructureComplianceAvailabilityObservabilitySecurityAuthDatabaseFabricApiBackendGaps: string[];
  recommendedNextPhase: string;
  infrastructureComplianceDataRetentionContractBoundaryMapOnly: true;
  reviewOnly: true;
  metadataOnly: true;
  authoritative: false;
  nonAuthorizingProof: true;
  reportRunsChecks: false;
  infrastructureAutomationImplemented: false;
  deploymentAutomationImplemented: false;
  cloudProvisioningImplemented: false;
  complianceEnforcementImplemented: false;
  complianceCertificationClaimed: false;
  piiProcessingImplemented: false;
  dataRetentionJobImplemented: false;
  dataDeletionJobImplemented: false;
  dataExportJobImplemented: false;
  policyEngineImplemented: false;
  vendorIntegrationImplemented: false;
  externalServiceLookupEnabled: false;
  secretVaultEnvAccessEnabled: false;
  backendRuntimeImplementedByArdyn: false;
  databaseStorageRuntimeWritesEnabled: false;
  fabricRuntimeImplementedByArdyn: false;
  encodedHandoffRuntimeImplementedByArdyn: false;
  commandExposureEnabled: false;
  runtimeExecutionEnabled: false;
  connectorGrantProduced: false;
  mcpToolExposureEnabled: false;
  taskExecutionEnabled: false;
  secureDropImplemented: false;
  healthCheckRuntimeImplemented: false;
  backupJobImplemented: false;
  restoreJobImplemented: false;
  failoverRuntimeImplemented: false;
  serviceDiscoveryEnabled: false;
  filesystemScanningEnabled: false;
  processControlEnabled: false;
  uiFrontendBrowserRenderingImplemented: false;
  blockedCliBypassEnabled: false;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
  [key: string]: unknown;
}

export interface InfrastructureComplianceDataRetentionContractBoundaryMapResult {
  schema: "ardyn.phase-5.67.infrastructure-compliance-data-retention-contract-boundary-map-result";
  schemaVersion: "0.1.0";
  infrastructureComplianceDataRetentionContractBoundaryMapKind:
    "infrastructure-compliance-data-retention-contract-boundary-map";
  infrastructureComplianceDataRetentionContractBoundaryMapMode: "review-only";
  reviewedAt: string;
  classification: InfrastructureComplianceDataRetentionContractBoundaryMapClassification;
  infrastructureComplianceDataRetentionContractBoundaryMapProduced: boolean;
  infrastructureComplianceDataRetentionContractBoundaryMap:
    | InfrastructureComplianceDataRetentionContractBoundaryMapState
    | null;
  boundaryMapSummary:
    | InfrastructureComplianceDataRetentionContractBoundaryMapState["boundaryMapSummary"]
    | null;
  boundaryEntries: InfrastructureComplianceDataRetentionContractBoundaryEntry[];
  invalidBoundaryCasePolicy: Record<string, boolean>;
  topInfrastructureComplianceAvailabilityObservabilitySecurityAuthDatabaseFabricApiBackendGaps: string[];
  recommendedNextPhase: string | null;
  infrastructureComplianceDataRetentionContractBoundaryMapOnly: true;
  reviewOnly: true;
  metadataOnly: true;
  authoritative: false;
  nonAuthorizingProof: true;
  reportRunsChecks: false;
  rejectionReasons: Array<Record<string, boolean | string>>;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
  [key: string]: unknown;
}

export type AgentModeProfileSkillhubCapabilityBoundaryMapClassification =
  | "valid_agent_mode_profile_skillhub_capability_boundary_map_runtime_still_blocked"
  | "malformed_agent_mode_profile_skillhub_capability_boundary_map_input_rejected"
  | "missing_required_agent_mode_profile_skillhub_capability_boundary_entry_rejected"
  | "unknown_top_level_field_agent_mode_profile_skillhub_capability_boundary_map_input_rejected"
  | "unknown_boundary_family_agent_mode_profile_skillhub_capability_boundary_map_input_rejected"
  | "unknown_related_system_agent_mode_profile_skillhub_capability_boundary_map_input_rejected"
  | "unknown_current_status_agent_mode_profile_skillhub_capability_boundary_map_input_rejected"
  | "authorization_flags_enabled_agent_mode_profile_skillhub_capability_boundary_map_input_rejected"
  | "report_runs_checks_true_agent_mode_profile_skillhub_capability_boundary_map_input_rejected"
  | "runtime_authorization_attempt_agent_mode_profile_skillhub_capability_boundary_map_input_rejected"
  | "command_exposure_attempt_agent_mode_profile_skillhub_capability_boundary_map_input_rejected"
  | "blocked_cli_bypass_attempt_agent_mode_profile_skillhub_capability_boundary_map_input_rejected"
  | "hidden_cua_driver_execution_semantics_agent_mode_profile_skillhub_capability_boundary_map_input_rejected"
  | "hidden_computer_use_semantics_agent_mode_profile_skillhub_capability_boundary_map_input_rejected"
  | "hidden_input_automation_semantics_agent_mode_profile_skillhub_capability_boundary_map_input_rejected"
  | "hidden_action_approval_semantics_agent_mode_profile_skillhub_capability_boundary_map_input_rejected"
  | "hidden_multimodal_return_semantics_agent_mode_profile_skillhub_capability_boundary_map_input_rejected"
  | "hidden_telemetry_driver_update_semantics_agent_mode_profile_skillhub_capability_boundary_map_input_rejected"
  | "hidden_background_subagent_execution_semantics_agent_mode_profile_skillhub_capability_boundary_map_input_rejected"
  | "hidden_conversation_concurrency_semantics_agent_mode_profile_skillhub_capability_boundary_map_input_rejected"
  | "hidden_profile_personality_session_context_loading_semantics_agent_mode_profile_skillhub_capability_boundary_map_input_rejected"
  | "hidden_skill_loading_install_scan_inventory_semantics_agent_mode_profile_skillhub_capability_boundary_map_input_rejected"
  | "hidden_gateway_scheduled_terminal_semantics_agent_mode_profile_skillhub_capability_boundary_map_input_rejected"
  | "hidden_model_routing_fusion_judge_front_desk_semantics_agent_mode_profile_skillhub_capability_boundary_map_input_rejected"
  | "hidden_acp_a2a_adapter_registry_semantics_agent_mode_profile_skillhub_capability_boundary_map_input_rejected"
  | "hidden_backend_api_server_storage_auth_connector_semantics_agent_mode_profile_skillhub_capability_boundary_map_input_rejected"
  | "hidden_fabric_secure_drop_encoded_handoff_runtime_semantics_agent_mode_profile_skillhub_capability_boundary_map_input_rejected"
  | "hidden_logger_audit_telemetry_health_infrastructure_semantics_agent_mode_profile_skillhub_capability_boundary_map_input_rejected"
  | "unsafe_agent_mode_profile_skillhub_capability_runtime_flags_agent_mode_profile_skillhub_capability_boundary_map_input_rejected"
  | "nested_unsafe_flags_agent_mode_profile_skillhub_capability_boundary_map_input_rejected"
  | "noncanonical_agent_mode_profile_skillhub_capability_boundary_map_input_rejected";

export interface AgentModeProfileSkillhubCapabilityBoundaryEntry {
  boundaryId: string;
  boundaryFamily:
    | "agent_mode_contract"
    | "profile_contract"
    | "personality_session_contract"
    | "subagent_background_contract"
    | "conversation_continuity_contract"
    | "front_desk_model_contract"
    | "computer_use_contract"
    | "cua_driver_contract"
    | "cua_driver_mcp_stdio_contract"
    | "cua_driver_manifest_contract"
    | "computer_use_doctor_contract"
    | "desktop_control_contract"
    | "browser_control_contract"
    | "screenshot_capture_contract"
    | "accessibility_tree_contract"
    | "som_index_contract"
    | "safe_action_contract"
    | "mutating_action_approval_contract"
    | "blocked_key_combo_contract"
    | "dangerous_type_pattern_contract"
    | "multimodal_tool_return_contract"
    | "telemetry_opt_in_contract"
    | "driver_update_provenance_contract"
    | "terminal_backend_contract"
    | "toolset_contract"
    | "skill_loading_contract"
    | "skillhub_install_contract"
    | "skill_security_scan_contract"
    | "skill_inventory_contract"
    | "mcp_inventory_contract"
    | "plugin_inventory_contract"
    | "provider_inventory_contract"
    | "tool_adapter_visibility_contract"
    | "gateway_messaging_contract"
    | "scheduled_automation_contract"
    | "context_file_contract"
    | "memory_profile_contract"
    | "acp_adapter_registry_contract"
    | "a2a_handoff_contract"
    | "diffusion_mode_contract"
    | "sakana_style_mode_contract"
    | "fusion_judge_mode_contract"
    | "prompt_skill_resolution_contract"
    | "control_plane_visibility_contract";
  relatedSystem:
    | "ardyn"
    | "ardyn-subagent"
    | "locus"
    | "multiverse"
    | "content-fabric"
    | "repo-family"
    | "external-harness"
    | "hermes-reference"
    | "cua-driver-reference";
  currentStatus: "metadata_only" | "blocked" | "future_contract_required";
  allowedCurrentBehavior: string[];
  forbiddenCurrentBehavior: string[];
  requiredFutureContractBeforeImplementation: string;
  requiredFutureAuthorizationPhaseBeforeRuntime: string;
  operatorVisibilityExpectation: string;
  humanConversationContinuityExpectation: string;
  profilePersonalitySessionExpectation: string;
  promptToSkillMatchingExpectation: string;
  skillPluginMcpProviderInventoryExpectation: string;
  securityScanExpectation: string;
  frontDeskFallbackExpectation: string;
  modelRoutingExpectation: string;
  gatewayPlatformExpectation: string;
  memoryContextExpectation: string;
  cuaDriverRoleDescription: string;
  locusRoleDescription: string;
  multiverseRoleDescription: string;
  fabricRoleDescription: string;
  futureCuaDriverComputerUseActions: string[];
  architectureReferencePolicy: Record<string, boolean>;
  agentModeProfileSkillhubCapabilityBoundaryMetadataOnly: true;
  noLiveAgentModeProfileSkillhubCapabilityRuntimePerformed: true;
  explicitBlockedAuthorizationFlags: Record<string, false>;
  unsafeAgentModeCapabilityRuntimeFlags: Record<string, false>;
  nonAuthorizingProof: true;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
  [key: string]: unknown;
}

export interface AgentModeProfileSkillhubCapabilityBoundaryMapState {
  schema: "ardyn.phase-5.68.agent-mode-profile-skillhub-capability-boundary-map-state";
  schemaVersion: "0.1.0";
  stateKind: "agent-mode-profile-skillhub-capability-boundary-map";
  stateMode: "review-only";
  reviewedAt: string;
  sourcePhaseContext: Record<string, boolean | string>;
  boundaryEntries: AgentModeProfileSkillhubCapabilityBoundaryEntry[];
  boundaryMapSummary: Record<string, boolean | number | string | string[] | Record<string, number>>;
  invalidBoundaryCasePolicy: Record<string, boolean>;
  topHermesCuaAgentModeProfileSkillhubTestingQualityGatesFabricApiBackendGaps: string[];
  recommendedNextPhase: string;
  agentModeProfileSkillhubCapabilityBoundaryMapOnly: true;
  reviewOnly: true;
  metadataOnly: true;
  authoritative: false;
  nonAuthorizingProof: true;
  reportRunsChecks: false;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
  [key: string]: unknown;
}

export interface AgentModeProfileSkillhubCapabilityBoundaryMapResult {
  schema: "ardyn.phase-5.68.agent-mode-profile-skillhub-capability-boundary-map-result";
  schemaVersion: "0.1.0";
  agentModeProfileSkillhubCapabilityBoundaryMapKind:
    "agent-mode-profile-skillhub-capability-boundary-map";
  agentModeProfileSkillhubCapabilityBoundaryMapMode: "review-only";
  reviewedAt: string;
  classification: AgentModeProfileSkillhubCapabilityBoundaryMapClassification;
  agentModeProfileSkillhubCapabilityBoundaryMapProduced: boolean;
  agentModeProfileSkillhubCapabilityBoundaryMap:
    | AgentModeProfileSkillhubCapabilityBoundaryMapState
    | null;
  boundaryMapSummary:
    | AgentModeProfileSkillhubCapabilityBoundaryMapState["boundaryMapSummary"]
    | null;
  boundaryEntries: AgentModeProfileSkillhubCapabilityBoundaryEntry[];
  invalidBoundaryCasePolicy: Record<string, boolean>;
  topHermesCuaAgentModeProfileSkillhubTestingQualityGatesFabricApiBackendGaps: string[];
  recommendedNextPhase: string | null;
  agentModeProfileSkillhubCapabilityBoundaryMapOnly: true;
  reviewOnly: true;
  metadataOnly: true;
  authoritative: false;
  nonAuthorizingProof: true;
  reportRunsChecks: false;
  rejectionReasons: Array<Record<string, boolean | string>>;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
  [key: string]: unknown;
}

export function createAgentModeProfileSkillhubCapabilityBoundaryMapForReview(
  input?: Record<string, unknown>
): AgentModeProfileSkillhubCapabilityBoundaryMapResult;

export type TestingFrameworksQualityGatesContractBoundaryMapClassification =
  | "valid_testing_frameworks_quality_gates_contract_boundary_map_runtime_still_blocked"
  | "malformed_testing_frameworks_quality_gates_contract_boundary_map_input_rejected"
  | "missing_required_testing_frameworks_quality_gates_contract_boundary_entry_rejected"
  | "unknown_top_level_field_testing_frameworks_quality_gates_contract_boundary_map_input_rejected"
  | "unknown_boundary_family_testing_frameworks_quality_gates_contract_boundary_map_input_rejected"
  | "unknown_related_system_testing_frameworks_quality_gates_contract_boundary_map_input_rejected"
  | "unknown_current_status_testing_frameworks_quality_gates_contract_boundary_map_input_rejected"
  | "authorization_flags_enabled_testing_frameworks_quality_gates_contract_boundary_map_input_rejected"
  | "report_runs_checks_true_testing_frameworks_quality_gates_contract_boundary_map_input_rejected"
  | "runtime_authorization_attempt_testing_frameworks_quality_gates_contract_boundary_map_input_rejected"
  | "command_exposure_attempt_testing_frameworks_quality_gates_contract_boundary_map_input_rejected"
  | "blocked_cli_bypass_attempt_testing_frameworks_quality_gates_contract_boundary_map_input_rejected"
  | "hidden_test_harness_execution_semantics_testing_frameworks_quality_gates_contract_boundary_map_input_rejected"
  | "hidden_ci_release_automation_semantics_testing_frameworks_quality_gates_contract_boundary_map_input_rejected"
  | "hidden_browser_computer_use_cua_driver_execution_semantics_testing_frameworks_quality_gates_contract_boundary_map_input_rejected"
  | "hidden_model_eval_training_finetuning_semantics_testing_frameworks_quality_gates_contract_boundary_map_input_rejected"
  | "hidden_external_service_lookup_semantics_testing_frameworks_quality_gates_contract_boundary_map_input_rejected"
  | "hidden_backend_api_server_semantics_testing_frameworks_quality_gates_contract_boundary_map_input_rejected"
  | "hidden_database_storage_cache_write_semantics_testing_frameworks_quality_gates_contract_boundary_map_input_rejected"
  | "hidden_auth_session_token_api_key_semantics_testing_frameworks_quality_gates_contract_boundary_map_input_rejected"
  | "hidden_connector_grant_semantics_testing_frameworks_quality_gates_contract_boundary_map_input_rejected"
  | "hidden_fabric_websocket_http_mcp_task_runtime_semantics_testing_frameworks_quality_gates_contract_boundary_map_input_rejected"
  | "hidden_secure_drop_implementation_semantics_testing_frameworks_quality_gates_contract_boundary_map_input_rejected"
  | "hidden_encoded_handoff_codec_translator_stego_covert_channel_tokenizer_exploit_bypass_semantics_testing_frameworks_quality_gates_contract_boundary_map_input_rejected"
  | "hidden_logger_audit_transcript_telemetry_external_sink_semantics_testing_frameworks_quality_gates_contract_boundary_map_input_rejected"
  | "hidden_health_backup_restore_failover_scheduler_process_supervisor_semantics_testing_frameworks_quality_gates_contract_boundary_map_input_rejected"
  | "hidden_infrastructure_deployment_compliance_pii_retention_export_semantics_testing_frameworks_quality_gates_contract_boundary_map_input_rejected"
  | "hidden_agent_mode_profile_skillhub_background_subagent_fusion_front_desk_semantics_testing_frameworks_quality_gates_contract_boundary_map_input_rejected"
  | "unsafe_testing_frameworks_quality_gates_runtime_flags_testing_frameworks_quality_gates_contract_boundary_map_input_rejected"
  | "nested_unsafe_flags_testing_frameworks_quality_gates_contract_boundary_map_input_rejected"
  | "noncanonical_testing_frameworks_quality_gates_contract_boundary_map_input_rejected";

export interface TestingFrameworksQualityGatesContractBoundaryEntry {
  boundaryId: string;
  boundaryFamily:
    | "unit_test_contract"
    | "schema_test_contract"
    | "integration_test_contract"
    | "e2e_test_contract"
    | "regression_gate_contract"
    | "stress_test_contract"
    | "chaos_test_contract"
    | "security_test_contract"
    | "dependency_audit_contract"
    | "static_analysis_contract"
    | "fixture_conformance_contract"
    | "runtime_blocked_gate_contract"
    | "computer_use_test_contract"
    | "agent_mode_test_contract"
    | "model_eval_contract"
    | "quality_gate_contract"
    | "release_blocker_contract"
    | "ci_gate_contract";
  relatedSystem:
    | "ardyn"
    | "ardyn-subagent"
    | "locus"
    | "multiverse"
    | "content-fabric"
    | "repo-family"
    | "external-harness"
    | "hermes-reference"
    | "cua-driver-reference";
  currentStatus:
    | "metadata_only"
    | "covered_by_existing_validation"
    | "blocked"
    | "future_contract_required";
  allowedCurrentBehavior: string[];
  forbiddenCurrentBehavior: string[];
  requiredFutureContractBeforeImplementation: string;
  requiredFutureAuthorizationPhaseBeforeRuntime: string;
  qualityGateExpectation: string;
  failureBlockerExpectation: string;
  fixtureEvidenceExpectation: string;
  ciReleaseExpectation: string;
  securityStaticAnalysisExpectation: string;
  modelEvalExpectation: string;
  locusRoleDescription: string;
  multiverseRoleDescription: string;
  fabricRoleDescription: string;
  explicitBlockedAuthorizationFlags: Record<string, false>;
  unsafeTestingQualityGateRuntimeFlags: Record<string, false>;
  testingFrameworksQualityGatesBoundaryMetadataOnly: true;
  noLiveTestingFrameworksQualityGatesRuntimePerformed: true;
  nonAuthorizingProof: true;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
  [key: string]: unknown;
}

export interface TestingFrameworksQualityGatesContractBoundaryMapState {
  schema: "ardyn.phase-5.69.testing-frameworks-quality-gates-contract-boundary-map-state";
  schemaVersion: "0.1.0";
  stateKind: "testing-frameworks-quality-gates-contract-boundary-map";
  stateMode: "review-only";
  reviewedAt: string;
  sourcePhaseContext: Record<string, boolean | number | string>;
  boundaryEntries: TestingFrameworksQualityGatesContractBoundaryEntry[];
  boundaryMapSummary: Record<string, boolean | number | string | string[] | Record<string, number>>;
  invalidBoundaryCasePolicy: Record<string, boolean>;
  topTestingQualityGatesOperationsCodeModeFabricApiBackendGaps: string[];
  recommendedNextPhase: string;
  testingFrameworksQualityGatesContractBoundaryMapOnly: true;
  reviewOnly: true;
  metadataOnly: true;
  authoritative: false;
  nonAuthorizingProof: true;
  reportRunsChecks: false;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
  [key: string]: unknown;
}

export interface TestingFrameworksQualityGatesContractBoundaryMapResult {
  schema: "ardyn.phase-5.69.testing-frameworks-quality-gates-contract-boundary-map-result";
  schemaVersion: "0.1.0";
  testingFrameworksQualityGatesContractBoundaryMapKind:
    "testing-frameworks-quality-gates-contract-boundary-map";
  testingFrameworksQualityGatesContractBoundaryMapMode: "review-only";
  reviewedAt: string;
  classification: TestingFrameworksQualityGatesContractBoundaryMapClassification;
  testingFrameworksQualityGatesContractBoundaryMapProduced: boolean;
  testingFrameworksQualityGatesContractBoundaryMap:
    | TestingFrameworksQualityGatesContractBoundaryMapState
    | null;
  boundaryMapSummary:
    | TestingFrameworksQualityGatesContractBoundaryMapState["boundaryMapSummary"]
    | null;
  boundaryEntries: TestingFrameworksQualityGatesContractBoundaryEntry[];
  invalidBoundaryCasePolicy: Record<string, boolean>;
  topTestingQualityGatesOperationsCodeModeFabricApiBackendGaps: string[];
  recommendedNextPhase: string | null;
  testingFrameworksQualityGatesContractBoundaryMapOnly: true;
  reviewOnly: true;
  metadataOnly: true;
  authoritative: false;
  nonAuthorizingProof: true;
  reportRunsChecks: false;
  rejectionReasons: Array<Record<string, boolean | string>>;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
  [key: string]: unknown;
}

export function createTestingFrameworksQualityGatesContractBoundaryMapForReview(
  input?: Record<string, unknown>
): TestingFrameworksQualityGatesContractBoundaryMapResult;

export type OperationsReliabilityContractBoundaryMapClassification =
  | "valid_operations_reliability_contract_boundary_map_runtime_still_blocked"
  | "malformed_operations_reliability_contract_boundary_map_input_rejected"
  | "missing_required_operations_reliability_contract_boundary_entry_rejected"
  | "unknown_top_level_field_operations_reliability_contract_boundary_map_input_rejected"
  | "unknown_boundary_family_operations_reliability_contract_boundary_map_input_rejected"
  | "unknown_related_system_operations_reliability_contract_boundary_map_input_rejected"
  | "unknown_current_status_operations_reliability_contract_boundary_map_input_rejected"
  | "authorization_flags_enabled_operations_reliability_contract_boundary_map_input_rejected"
  | "report_runs_checks_true_operations_reliability_contract_boundary_map_input_rejected"
  | "runtime_authorization_attempt_operations_reliability_contract_boundary_map_input_rejected"
  | "command_exposure_attempt_operations_reliability_contract_boundary_map_input_rejected"
  | "blocked_cli_bypass_attempt_operations_reliability_contract_boundary_map_input_rejected"
  | "hidden_retry_circuit_breaker_execution_semantics_operations_reliability_contract_boundary_map_input_rejected"
  | "hidden_idempotency_persistence_semantics_operations_reliability_contract_boundary_map_input_rejected"
  | "hidden_queue_scheduler_worker_semantics_operations_reliability_contract_boundary_map_input_rejected"
  | "hidden_lease_work_ownership_runtime_semantics_operations_reliability_contract_boundary_map_input_rejected"
  | "hidden_cancellation_concurrency_runtime_semantics_operations_reliability_contract_boundary_map_input_rejected"
  | "hidden_background_subagent_execution_semantics_operations_reliability_contract_boundary_map_input_rejected"
  | "hidden_front_desk_fusion_judge_model_routing_runtime_semantics_operations_reliability_contract_boundary_map_input_rejected"
  | "hidden_computer_use_cua_driver_reliability_runtime_semantics_operations_reliability_contract_boundary_map_input_rejected"
  | "hidden_skillhub_install_rollback_runtime_semantics_operations_reliability_contract_boundary_map_input_rejected"
  | "hidden_mcp_tool_plugin_provider_runtime_semantics_operations_reliability_contract_boundary_map_input_rejected"
  | "hidden_backend_api_server_semantics_operations_reliability_contract_boundary_map_input_rejected"
  | "hidden_database_storage_cache_write_semantics_operations_reliability_contract_boundary_map_input_rejected"
  | "hidden_auth_session_token_api_key_semantics_operations_reliability_contract_boundary_map_input_rejected"
  | "hidden_connector_grant_semantics_operations_reliability_contract_boundary_map_input_rejected"
  | "hidden_fabric_websocket_http_mcp_task_runtime_semantics_operations_reliability_contract_boundary_map_input_rejected"
  | "hidden_secure_drop_implementation_semantics_operations_reliability_contract_boundary_map_input_rejected"
  | "hidden_encoded_handoff_codec_translator_stego_covert_channel_tokenizer_exploit_bypass_semantics_operations_reliability_contract_boundary_map_input_rejected"
  | "hidden_logger_audit_transcript_telemetry_external_sink_semantics_operations_reliability_contract_boundary_map_input_rejected"
  | "hidden_health_backup_restore_failover_scheduler_process_supervisor_semantics_operations_reliability_contract_boundary_map_input_rejected"
  | "hidden_infrastructure_deployment_compliance_pii_retention_export_semantics_operations_reliability_contract_boundary_map_input_rejected"
  | "hidden_testing_ci_release_automation_semantics_operations_reliability_contract_boundary_map_input_rejected"
  | "unsafe_operations_reliability_runtime_flags_operations_reliability_contract_boundary_map_input_rejected"
  | "nested_unsafe_flags_operations_reliability_contract_boundary_map_input_rejected"
  | "noncanonical_operations_reliability_contract_boundary_map_input_rejected";

export interface OperationsReliabilityContractBoundaryEntry {
  boundaryId: string;
  boundaryFamily:
    | "retry_contract"
    | "idempotency_contract"
    | "circuit_breaker_contract"
    | "concurrency_contract"
    | "cancellation_contract"
    | "lease_contract"
    | "work_ownership_contract"
    | "queue_semantics_contract"
    | "degraded_mode_contract"
    | "front_desk_busy_contract"
    | "background_subagent_reliability_contract"
    | "operation_runbook_contract"
    | "handoff_recovery_contract"
    | "fabric_reliability_contract"
    | "computer_use_reliability_contract"
    | "skillhub_reliability_contract";
  relatedSystem:
    | "ardyn"
    | "ardyn-subagent"
    | "locus"
    | "multiverse"
    | "content-fabric"
    | "repo-family"
    | "external-harness"
    | "hermes-reference"
    | "cua-driver-reference";
  currentStatus: "metadata_only" | "blocked" | "future_contract_required";
  allowedCurrentBehavior: string[];
  forbiddenCurrentBehavior: string[];
  requiredFutureContractBeforeImplementation: string;
  requiredFutureAuthorizationPhaseBeforeRuntime: string;
  retryExpectation: string;
  idempotencyExpectation: string;
  circuitBreakerExpectation: string;
  concurrencyExpectation: string;
  cancellationExpectation: string;
  workOwnershipExpectation: string;
  handoffRecoveryExpectation: string;
  degradedModeExpectation: string;
  runbookExpectation: string;
  locusRoleDescription: string;
  multiverseRoleDescription: string;
  fabricRoleDescription: string;
  explicitBlockedAuthorizationFlags: Record<string, false>;
  unsafeOperationsReliabilityRuntimeFlags: Record<string, false>;
  operationsReliabilityBoundaryMetadataOnly: true;
  noLiveOperationsReliabilityRuntimePerformed: true;
  nonAuthorizingProof: true;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
  [key: string]: unknown;
}

export interface OperationsReliabilityContractBoundaryMapState {
  schema: "ardyn.phase-5.70.operations-reliability-contract-boundary-map-state";
  schemaVersion: "0.1.0";
  stateKind: "operations-reliability-contract-boundary-map";
  stateMode: "review-only";
  reviewedAt: string;
  sourcePhaseContext: Record<string, boolean | number | string>;
  boundaryEntries: OperationsReliabilityContractBoundaryEntry[];
  boundaryMapSummary: Record<string, boolean | number | string | string[] | Record<string, number>>;
  invalidBoundaryCasePolicy: Record<string, boolean>;
  topOperationsReliabilityCodeModeFabricApiBackendGaps: string[];
  recommendedNextPhase: string;
  operationsReliabilityContractBoundaryMapOnly: true;
  reviewOnly: true;
  metadataOnly: true;
  authoritative: false;
  nonAuthorizingProof: true;
  reportRunsChecks: false;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
  [key: string]: unknown;
}

export interface OperationsReliabilityContractBoundaryMapResult {
  schema: "ardyn.phase-5.70.operations-reliability-contract-boundary-map-result";
  schemaVersion: "0.1.0";
  operationsReliabilityContractBoundaryMapKind:
    "operations-reliability-contract-boundary-map";
  operationsReliabilityContractBoundaryMapMode: "review-only";
  reviewedAt: string;
  classification: OperationsReliabilityContractBoundaryMapClassification;
  operationsReliabilityContractBoundaryMapProduced: boolean;
  operationsReliabilityContractBoundaryMap:
    | OperationsReliabilityContractBoundaryMapState
    | null;
  boundaryMapSummary:
    | OperationsReliabilityContractBoundaryMapState["boundaryMapSummary"]
    | null;
  boundaryEntries: OperationsReliabilityContractBoundaryEntry[];
  invalidBoundaryCasePolicy: Record<string, boolean>;
  topOperationsReliabilityCodeModeFabricApiBackendGaps: string[];
  recommendedNextPhase: string | null;
  operationsReliabilityContractBoundaryMapOnly: true;
  reviewOnly: true;
  metadataOnly: true;
  authoritative: false;
  nonAuthorizingProof: true;
  reportRunsChecks: false;
  rejectionReasons: Array<Record<string, boolean | string>>;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
  [key: string]: unknown;
}

export function createOperationsReliabilityContractBoundaryMapForReview(
  input?: Record<string, unknown>
): OperationsReliabilityContractBoundaryMapResult;

export type MaintenanceGovernanceAdrDependencyPolicyContractBoundaryMapClassification =
  | "valid_maintenance_governance_adr_dependency_policy_contract_boundary_map_runtime_still_blocked"
  | "malformed_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected"
  | "missing_required_maintenance_governance_adr_dependency_policy_contract_boundary_entry_rejected"
  | "unknown_top_level_field_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected"
  | "unknown_boundary_family_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected"
  | "unknown_related_system_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected"
  | "unknown_current_status_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected"
  | "authorization_flags_enabled_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected"
  | "report_runs_checks_true_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected"
  | "runtime_authorization_attempt_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected"
  | "command_exposure_attempt_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected"
  | "blocked_cli_bypass_attempt_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected"
  | "hidden_dependency_update_patch_execution_semantics_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected"
  | "hidden_release_ci_publishing_automation_semantics_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected"
  | "hidden_graphify_memory_mutation_semantics_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected"
  | "hidden_code_mode_runtime_semantics_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected"
  | "hidden_subagent_jules_automation_semantics_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected"
  | "hidden_external_reference_vendoring_copying_semantics_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected"
  | "hidden_backend_api_server_semantics_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected"
  | "hidden_database_storage_cache_write_semantics_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected"
  | "hidden_auth_session_token_api_key_semantics_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected"
  | "hidden_connector_grant_semantics_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected"
  | "hidden_fabric_websocket_http_mcp_task_runtime_semantics_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected"
  | "hidden_secure_drop_implementation_semantics_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected"
  | "hidden_encoded_handoff_codec_translator_stego_covert_channel_tokenizer_exploit_bypass_semantics_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected"
  | "hidden_hermes_cua_computer_use_runtime_semantics_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected"
  | "hidden_infrastructure_deployment_compliance_pii_retention_export_semantics_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected"
  | "hidden_testing_ci_release_automation_semantics_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected"
  | "unsafe_maintenance_governance_runtime_flags_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected"
  | "nested_unsafe_flags_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected"
  | "noncanonical_maintenance_governance_adr_dependency_policy_contract_boundary_map_input_rejected";

export interface MaintenanceGovernanceAdrDependencyPolicyContractBoundaryEntry {
  boundaryId: string;
  boundaryFamily:
    | "adr_contract"
    | "architecture_diagram_contract"
    | "governance_policy_contract"
    | "dependency_policy_contract"
    | "vulnerability_patch_policy_contract"
    | "waiver_policy_contract"
    | "release_governance_contract"
    | "versioning_policy_contract"
    | "ownership_contract"
    | "review_policy_contract"
    | "jules_review_boundary"
    | "subagent_review_boundary"
    | "toolkit_usage_boundary"
    | "graphify_memory_boundary"
    | "code_mode_governance_boundary"
    | "external_reference_policy_contract";
  relatedSystem:
    | "ardyn"
    | "ardyn-subagent"
    | "locus"
    | "multiverse"
    | "content-fabric"
    | "repo-family"
    | "external-harness"
    | "hermes-reference"
    | "cua-driver-reference";
  currentStatus:
    | "metadata_only"
    | "covered_by_existing_validation"
    | "blocked"
    | "future_contract_required";
  allowedCurrentBehavior: string[];
  forbiddenCurrentBehavior: string[];
  requiredFutureContractBeforeImplementation: string;
  requiredFutureAuthorizationPhaseBeforeRuntime: string;
  governanceExpectation: string;
  adrEvidenceExpectation: string;
  dependencyPolicyExpectation: string;
  waiverExceptionExpectation: string;
  reviewOwnershipExpectation: string;
  releaseVersioningExpectation: string;
  toolkitEvidenceExpectation: string;
  graphifyMemoryExpectation: string;
  externalReferenceProvenanceExpectation: string;
  locusRoleDescription: string;
  multiverseRoleDescription: string;
  fabricRoleDescription: string;
  explicitBlockedAuthorizationFlags: Record<string, false>;
  unsafeMaintenanceGovernanceRuntimeFlags: Record<string, false>;
  maintenanceGovernanceBoundaryMetadataOnly: true;
  noLiveMaintenanceGovernanceRuntimePerformed: true;
  nonAuthorizingProof: true;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
  [key: string]: unknown;
}

export interface MaintenanceGovernanceAdrDependencyPolicyContractBoundaryMapState {
  schema: "ardyn.phase-5.71.maintenance-governance-adr-dependency-policy-contract-boundary-map-state";
  schemaVersion: "0.1.0";
  stateKind: "maintenance-governance-adr-dependency-policy-contract-boundary-map";
  stateMode: "review-only";
  reviewedAt: string;
  sourcePhaseContext: Record<string, boolean | number | string>;
  boundaryEntries: MaintenanceGovernanceAdrDependencyPolicyContractBoundaryEntry[];
  boundaryMapSummary: Record<string, boolean | number | string | string[] | Record<string, number>>;
  invalidBoundaryCasePolicy: Record<string, boolean>;
  topMaintenanceGovernanceSecretsCodeModeFabricApiBackendGaps: string[];
  recommendedNextPhase: string;
  maintenanceGovernanceAdrDependencyPolicyContractBoundaryMapOnly: true;
  reviewOnly: true;
  metadataOnly: true;
  authoritative: false;
  nonAuthorizingProof: true;
  reportRunsChecks: false;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
  [key: string]: unknown;
}

export interface MaintenanceGovernanceAdrDependencyPolicyContractBoundaryMapResult {
  schema: "ardyn.phase-5.71.maintenance-governance-adr-dependency-policy-contract-boundary-map-result";
  schemaVersion: "0.1.0";
  maintenanceGovernanceAdrDependencyPolicyContractBoundaryMapKind:
    "maintenance-governance-adr-dependency-policy-contract-boundary-map";
  maintenanceGovernanceAdrDependencyPolicyContractBoundaryMapMode: "review-only";
  reviewedAt: string;
  classification: MaintenanceGovernanceAdrDependencyPolicyContractBoundaryMapClassification;
  maintenanceGovernanceAdrDependencyPolicyContractBoundaryMapProduced: boolean;
  maintenanceGovernanceAdrDependencyPolicyContractBoundaryMap:
    | MaintenanceGovernanceAdrDependencyPolicyContractBoundaryMapState
    | null;
  boundaryMapSummary:
    | MaintenanceGovernanceAdrDependencyPolicyContractBoundaryMapState["boundaryMapSummary"]
    | null;
  boundaryEntries: MaintenanceGovernanceAdrDependencyPolicyContractBoundaryEntry[];
  invalidBoundaryCasePolicy: Record<string, boolean>;
  topMaintenanceGovernanceSecretsCodeModeFabricApiBackendGaps: string[];
  recommendedNextPhase: string | null;
  maintenanceGovernanceAdrDependencyPolicyContractBoundaryMapOnly: true;
  reviewOnly: true;
  metadataOnly: true;
  authoritative: false;
  nonAuthorizingProof: true;
  reportRunsChecks: false;
  rejectionReasons: Array<Record<string, boolean | string>>;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
  [key: string]: unknown;
}

export function createMaintenanceGovernanceAdrDependencyPolicyContractBoundaryMapForReview(
  input?: Record<string, unknown>
): MaintenanceGovernanceAdrDependencyPolicyContractBoundaryMapResult;

export type SecretsManagementKeyRotationExternalGatewayCredentialBoundaryMapClassification =
  | "valid_secrets_management_key_rotation_external_gateway_credential_boundary_map_runtime_still_blocked"
  | "malformed_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected"
  | "missing_required_secrets_management_key_rotation_external_gateway_credential_boundary_entry_rejected"
  | "unknown_top_level_field_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected"
  | "unknown_boundary_family_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected"
  | "unknown_related_system_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected"
  | "unknown_current_status_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected"
  | "authorization_flags_enabled_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected"
  | "report_runs_checks_true_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected"
  | "runtime_authorization_attempt_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected"
  | "command_exposure_attempt_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected"
  | "blocked_cli_bypass_attempt_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected"
  | "hidden_secret_env_vault_access_semantics_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected"
  | "hidden_api_key_token_oauth_session_semantics_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected"
  | "hidden_matrix_gateway_credential_runtime_semantics_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected"
  | "hidden_e2ee_key_session_handling_semantics_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected"
  | "hidden_mcp_plugin_provider_credential_runtime_semantics_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected"
  | "hidden_skillhub_install_trust_scanner_runtime_semantics_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected"
  | "hidden_secret_scanner_rotation_redaction_runtime_semantics_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected"
  | "hidden_fabric_websocket_http_mcp_task_runtime_semantics_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected"
  | "hidden_secure_drop_implementation_keyring_did_semantics_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected"
  | "hidden_encoded_handoff_runtime_codec_translator_stego_covert_channel_tokenizer_exploit_bypass_semantics_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected"
  | "hidden_hermes_cua_computer_use_runtime_semantics_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected"
  | "hidden_shell_path_executable_env_history_runtime_semantics_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected"
  | "hidden_sqlite_embedded_db_query_key_runtime_semantics_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected"
  | "hidden_logger_audit_transcript_telemetry_external_sink_semantics_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected"
  | "hidden_backend_api_server_semantics_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected"
  | "hidden_database_storage_cache_write_semantics_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected"
  | "hidden_connector_grant_semantics_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected"
  | "hidden_infrastructure_deployment_compliance_pii_retention_export_semantics_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected"
  | "hidden_testing_ci_release_automation_semantics_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected"
  | "unsafe_secrets_management_key_rotation_external_gateway_credential_runtime_flags_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected"
  | "nested_unsafe_flags_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected"
  | "noncanonical_secrets_management_key_rotation_external_gateway_credential_boundary_map_input_rejected";

export interface SecretsManagementKeyRotationExternalGatewayCredentialBoundaryEntry {
  boundaryId: string;
  boundaryFamily:
    | "secret_management_contract"
    | "key_rotation_contract"
    | "credential_provenance_contract"
    | "env_secret_boundary"
    | "vault_access_boundary"
    | "api_key_boundary"
    | "oauth_token_boundary"
    | "session_token_boundary"
    | "provider_credential_boundary"
    | "mcp_credential_boundary"
    | "plugin_credential_boundary"
    | "skillhub_trust_boundary"
    | "matrix_gateway_credential_boundary"
    | "external_gateway_credential_boundary"
    | "fabric_secret_boundary"
    | "secure_drop_key_boundary"
    | "did_keyring_boundary"
    | "cua_driver_trust_boundary"
    | "computer_use_permission_secret_boundary"
    | "encoded_handoff_secret_boundary"
    | "secret_scanning_contract"
    | "secret_redaction_contract"
    | "secret_audit_contract";
  relatedSystem:
    | "ardyn"
    | "ardyn-subagent"
    | "locus"
    | "multiverse"
    | "content-fabric"
    | "repo-family"
    | "external-harness"
    | "matrix-reference"
    | "hermes-reference"
    | "cua-driver-reference"
    | "codecrafters-shell-reference"
    | "codecrafters-sqlite-reference";
  currentStatus: "metadata_only" | "blocked" | "future_contract_required";
  allowedCurrentBehavior: string[];
  forbiddenCurrentBehavior: string[];
  requiredFutureContractBeforeImplementation: string;
  requiredFutureAuthorizationPhaseBeforeRuntime: string;
  credentialSubjectExpectation: string;
  secretSourceProvenanceExpectation: string;
  rotationRevocationExpectation: string;
  storageNonStorageExpectation: string;
  redactionExpectation: string;
  auditExpectation: string;
  leastPrivilegeExpectation: string;
  localOnlyCloudOptInExpectation: string;
  locusRoleDescription: string;
  multiverseRoleDescription: string;
  fabricRoleDescription: string;
  secureDropRoleDescription: string;
  matrixGatewayRoleDescription: string;
  productionReadinessAreaReference: Record<string, boolean | number | string>;
  matrixGatewayCredentialExpectation: Record<string, boolean | string>;
  externalGatewayCredentialExpectation: Record<string, boolean | string>;
  primitiveReferenceExpectation: Record<string, boolean | string>;
  phase560EncodedHandoffReference: Record<string, boolean | string>;
  phase562AuthPermissionsReference: Record<string, boolean | string>;
  phase563SecurityRlsInputSanitizationReference: Record<string, boolean | string>;
  phase565ErrorTrackingLoggingAuditIntegrityReference: Record<string, boolean | string>;
  phase568AgentModeProfileSkillhubReference: Record<string, boolean | string>;
  phase571MaintenanceGovernanceReference: Record<string, boolean | string>;
  secretsCredentialBoundaryMetadataOnly: true;
  noLiveSecretsCredentialRuntimePerformed: true;
  explicitBlockedAuthorizationFlags: Record<string, false>;
  unsafeSecretsCredentialRuntimeFlags: Record<string, false>;
  nonAuthorizingProof: true;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
  [key: string]: unknown;
}

export interface SecretsManagementKeyRotationExternalGatewayCredentialBoundaryMapState {
  schema: "ardyn.phase-5.72.secrets-management-key-rotation-external-gateway-credential-boundary-map-state";
  schemaVersion: "0.1.0";
  stateKind: "secrets-management-key-rotation-external-gateway-credential-boundary-map";
  stateMode: "review-only";
  reviewedAt: string;
  sourcePhaseContext: Record<string, boolean | number | string>;
  boundaryEntries: SecretsManagementKeyRotationExternalGatewayCredentialBoundaryEntry[];
  boundaryMapSummary: Record<string, boolean | number | string | string[] | Record<string, number>>;
  invalidBoundaryCasePolicy: Record<string, boolean>;
  topSecretsMatrixShellSqliteCodeModeFabricApiBackendGaps: string[];
  recommendedNextPhase: string;
  secretsManagementKeyRotationExternalGatewayCredentialBoundaryMapOnly: true;
  reviewOnly: true;
  metadataOnly: true;
  authoritative: false;
  nonAuthorizingProof: true;
  reportRunsChecks: false;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
  [key: string]: unknown;
}

export interface SecretsManagementKeyRotationExternalGatewayCredentialBoundaryMapResult {
  schema: "ardyn.phase-5.72.secrets-management-key-rotation-external-gateway-credential-boundary-map-result";
  schemaVersion: "0.1.0";
  secretsManagementKeyRotationExternalGatewayCredentialBoundaryMapKind:
    "secrets-management-key-rotation-external-gateway-credential-boundary-map";
  secretsManagementKeyRotationExternalGatewayCredentialBoundaryMapMode:
    "review-only";
  reviewedAt: string;
  classification: SecretsManagementKeyRotationExternalGatewayCredentialBoundaryMapClassification;
  secretsManagementKeyRotationExternalGatewayCredentialBoundaryMapProduced: boolean;
  secretsManagementKeyRotationExternalGatewayCredentialBoundaryMap:
    | SecretsManagementKeyRotationExternalGatewayCredentialBoundaryMapState
    | null;
  boundaryMapSummary:
    | SecretsManagementKeyRotationExternalGatewayCredentialBoundaryMapState["boundaryMapSummary"]
    | null;
  boundaryEntries: SecretsManagementKeyRotationExternalGatewayCredentialBoundaryEntry[];
  invalidBoundaryCasePolicy: Record<string, boolean>;
  topSecretsMatrixShellSqliteCodeModeFabricApiBackendGaps: string[];
  recommendedNextPhase: string | null;
  secretsManagementKeyRotationExternalGatewayCredentialBoundaryMapOnly: true;
  reviewOnly: true;
  metadataOnly: true;
  authoritative: false;
  nonAuthorizingProof: true;
  reportRunsChecks: false;
  rejectionReasons: Array<Record<string, boolean | string>>;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
  [key: string]: unknown;
}

export function createSecretsManagementKeyRotationExternalGatewayCredentialBoundaryMapForReview(
  input?: Record<string, unknown>
): SecretsManagementKeyRotationExternalGatewayCredentialBoundaryMapResult;

export type ExternalGatewayMatrixTransportContractBoundaryMapClassification =
  | "valid_external_gateway_matrix_transport_contract_boundary_map_runtime_still_blocked"
  | "malformed_external_gateway_matrix_transport_contract_boundary_map_input_rejected"
  | "missing_required_external_gateway_matrix_transport_boundary_entry_rejected"
  | "unknown_top_level_field_external_gateway_matrix_transport_contract_boundary_map_input_rejected"
  | "unknown_boundary_family_external_gateway_matrix_transport_contract_boundary_map_input_rejected"
  | "unknown_related_system_external_gateway_matrix_transport_contract_boundary_map_input_rejected"
  | "unknown_current_status_external_gateway_matrix_transport_contract_boundary_map_input_rejected"
  | "authorization_flags_enabled_external_gateway_matrix_transport_contract_boundary_map_input_rejected"
  | "report_runs_checks_true_external_gateway_matrix_transport_contract_boundary_map_input_rejected"
  | "runtime_authorization_attempt_external_gateway_matrix_transport_contract_boundary_map_input_rejected"
  | "command_exposure_attempt_external_gateway_matrix_transport_contract_boundary_map_input_rejected"
  | "blocked_cli_bypass_attempt_external_gateway_matrix_transport_contract_boundary_map_input_rejected"
  | "hidden_matrix_gateway_runtime_semantics_external_gateway_matrix_transport_contract_boundary_map_input_rejected"
  | "hidden_external_connector_semantics_external_gateway_matrix_transport_contract_boundary_map_input_rejected"
  | "hidden_fabric_websocket_http_mcp_task_runtime_semantics_external_gateway_matrix_transport_contract_boundary_map_input_rejected"
  | "hidden_content_addressed_chunked_resumable_p2p_transport_semantics_external_gateway_matrix_transport_contract_boundary_map_input_rejected"
  | "hidden_secure_drop_implementation_semantics_external_gateway_matrix_transport_contract_boundary_map_input_rejected"
  | "hidden_secret_env_vault_token_keyring_semantics_external_gateway_matrix_transport_contract_boundary_map_input_rejected"
  | "hidden_shell_path_executable_env_history_runtime_semantics_external_gateway_matrix_transport_contract_boundary_map_input_rejected"
  | "hidden_sqlite_embedded_db_query_key_runtime_semantics_external_gateway_matrix_transport_contract_boundary_map_input_rejected"
  | "hidden_backend_api_server_semantics_external_gateway_matrix_transport_contract_boundary_map_input_rejected"
  | "hidden_database_storage_cache_write_semantics_external_gateway_matrix_transport_contract_boundary_map_input_rejected"
  | "hidden_auth_session_token_api_key_semantics_external_gateway_matrix_transport_contract_boundary_map_input_rejected"
  | "hidden_logger_audit_transcript_telemetry_external_sink_semantics_external_gateway_matrix_transport_contract_boundary_map_input_rejected"
  | "hidden_infrastructure_deployment_compliance_pii_retention_export_semantics_external_gateway_matrix_transport_contract_boundary_map_input_rejected"
  | "hidden_testing_ci_release_automation_semantics_external_gateway_matrix_transport_contract_boundary_map_input_rejected"
  | "unsafe_external_gateway_matrix_transport_runtime_flags_external_gateway_matrix_transport_contract_boundary_map_input_rejected"
  | "nested_unsafe_flags_external_gateway_matrix_transport_contract_boundary_map_input_rejected"
  | "noncanonical_external_gateway_matrix_transport_contract_boundary_map_input_rejected";

export interface ExternalGatewayMatrixTransportContractBoundaryEntry {
  boundaryId: string;
  boundaryFamily:
    | "matrix_gateway_contract"
    | "matrix_room_contract"
    | "matrix_identity_contract"
    | "matrix_e2ee_boundary"
    | "gateway_transport_contract"
    | "gateway_delivery_contract"
    | "gateway_ingestion_contract"
    | "gateway_export_contract"
    | "gateway_moderation_contract"
    | "gateway_rate_limit_contract"
    | "gateway_audit_contract"
    | "locus_gateway_visibility_contract"
    | "harness_gateway_bridge_contract"
    | "fabric_core_consumer_boundary"
    | "large_payload_transfer_todo_boundary"
    | "external_platform_gateway_contract";
  relatedSystem:
    | "ardyn"
    | "ardyn-subagent"
    | "locus"
    | "multiverse"
    | "content-fabric"
    | "repo-family"
    | "external-harness"
    | "matrix-reference"
    | "hiclaw-reference"
    | "fabric-core-reference";
  currentStatus: "metadata_only" | "blocked" | "future_contract_required";
  allowedCurrentBehavior: string[];
  forbiddenCurrentBehavior: string[];
  requiredFutureContractBeforeImplementation: string;
  requiredFutureAuthorizationPhaseBeforeRuntime: string;
  gatewayIdentityExpectation: string;
  credentialKeyExpectation: string;
  roomChannelAllowlistExpectation: string;
  messageIngestionExportExpectation: string;
  moderationAbuseExpectation: string;
  e2eeKeySessionExpectation: string;
  rateLimitDeliveryExpectation: string;
  auditVisibilityExpectation: string;
  largePayloadTransferExpectation: string;
  locusRoleDescription: string;
  multiverseFabricCoreRoleDescription: string;
  secureDropRoleDescription: string;
  phase572CredentialBoundaryReference: Record<string, boolean | string>;
  phase559FabricAwareApiBackendReference: Record<string, boolean | string>;
  phase560EncodedHandoffReference: Record<string, boolean | string>;
  phase564RateLimitingAbuseControlReference: Record<string, boolean | string>;
  phase565ErrorTrackingLoggingAuditIntegrityReference: Record<string, boolean | string>;
  fabricCoreProducerReference: Record<string, boolean | string>;
  externalPlatformGatewayExpectation: Record<string, boolean | string>;
  fabricCoreConsumerExpectation: Record<string, boolean | string>;
  gatewayTransportBoundaryMetadataOnly: true;
  noLiveExternalGatewayMatrixTransportRuntimePerformed: true;
  explicitBlockedAuthorizationFlags: Record<string, false>;
  unsafeExternalGatewayMatrixTransportRuntimeFlags: Record<string, false>;
  nonAuthorizingProof: true;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
  [key: string]: unknown;
}

export interface ExternalGatewayMatrixTransportContractBoundaryMapState {
  schema: "ardyn.phase-5.73.external-gateway-matrix-transport-contract-boundary-map-state";
  schemaVersion: "0.1.0";
  stateKind: "external-gateway-matrix-transport-contract-boundary-map";
  stateMode: "review-only";
  reviewedAt: string;
  sourcePhaseContext: Record<string, boolean | string>;
  boundaryEntries: ExternalGatewayMatrixTransportContractBoundaryEntry[];
  boundaryMapSummary: Record<string, boolean | number | string | string[] | Record<string, number>>;
  invalidBoundaryCasePolicy: Record<string, boolean>;
  topMatrixGatewayFabricCoreConsumerShellSqliteCodeModeFabricApiBackendGaps: string[];
  recommendedNextPhase: string;
  externalGatewayMatrixTransportContractBoundaryMapOnly: true;
  reviewOnly: true;
  metadataOnly: true;
  authoritative: false;
  nonAuthorizingProof: true;
  reportRunsChecks: false;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
  [key: string]: unknown;
}

export interface ExternalGatewayMatrixTransportContractBoundaryMapResult {
  schema: "ardyn.phase-5.73.external-gateway-matrix-transport-contract-boundary-map-result";
  schemaVersion: "0.1.0";
  externalGatewayMatrixTransportContractBoundaryMapKind:
    "external-gateway-matrix-transport-contract-boundary-map";
  externalGatewayMatrixTransportContractBoundaryMapMode: "review-only";
  reviewedAt: string;
  classification: ExternalGatewayMatrixTransportContractBoundaryMapClassification;
  externalGatewayMatrixTransportContractBoundaryMapProduced: boolean;
  externalGatewayMatrixTransportContractBoundaryMap:
    | ExternalGatewayMatrixTransportContractBoundaryMapState
    | null;
  boundaryMapSummary:
    | ExternalGatewayMatrixTransportContractBoundaryMapState["boundaryMapSummary"]
    | null;
  boundaryEntries: ExternalGatewayMatrixTransportContractBoundaryEntry[];
  invalidBoundaryCasePolicy: Record<string, boolean>;
  topMatrixGatewayFabricCoreConsumerShellSqliteCodeModeFabricApiBackendGaps: string[];
  recommendedNextPhase: string | null;
  externalGatewayMatrixTransportContractBoundaryMapOnly: true;
  reviewOnly: true;
  metadataOnly: true;
  authoritative: false;
  nonAuthorizingProof: true;
  reportRunsChecks: false;
  rejectionReasons: Array<Record<string, boolean | string>>;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
  [key: string]: unknown;
}

export function createExternalGatewayMatrixTransportContractBoundaryMapForReview(
  input?: Record<string, unknown>
): ExternalGatewayMatrixTransportContractBoundaryMapResult;

export type CommandSurfaceShellPrimitiveContractBoundaryMapClassification =
  | "valid_command_surface_shell_primitive_contract_boundary_map_runtime_still_blocked"
  | "malformed_command_surface_shell_primitive_contract_boundary_map_input_rejected"
  | "missing_required_command_surface_shell_primitive_boundary_entry_rejected"
  | "unknown_top_level_field_command_surface_shell_primitive_contract_boundary_map_input_rejected"
  | "unknown_boundary_family_command_surface_shell_primitive_contract_boundary_map_input_rejected"
  | "unknown_related_system_command_surface_shell_primitive_contract_boundary_map_input_rejected"
  | "unknown_current_status_command_surface_shell_primitive_contract_boundary_map_input_rejected"
  | "authorization_flags_enabled_command_surface_shell_primitive_contract_boundary_map_input_rejected"
  | "report_runs_checks_true_command_surface_shell_primitive_contract_boundary_map_input_rejected"
  | "runtime_authorization_attempt_command_surface_shell_primitive_contract_boundary_map_input_rejected"
  | "command_exposure_attempt_command_surface_shell_primitive_contract_boundary_map_input_rejected"
  | "blocked_cli_bypass_attempt_command_surface_shell_primitive_contract_boundary_map_input_rejected"
  | "hidden_shell_repl_process_execution_semantics_command_surface_shell_primitive_contract_boundary_map_input_rejected"
  | "hidden_path_executable_lookup_semantics_command_surface_shell_primitive_contract_boundary_map_input_rejected"
  | "hidden_filesystem_read_write_semantics_command_surface_shell_primitive_contract_boundary_map_input_rejected"
  | "hidden_env_secrets_exposure_semantics_command_surface_shell_primitive_contract_boundary_map_input_rejected"
  | "hidden_pipe_redirection_stdio_semantics_command_surface_shell_primitive_contract_boundary_map_input_rejected"
  | "hidden_job_control_background_worker_semantics_command_surface_shell_primitive_contract_boundary_map_input_rejected"
  | "hidden_command_exposure_or_runtime_authorization_semantics_command_surface_shell_primitive_contract_boundary_map_input_rejected"
  | "hidden_backend_api_server_semantics_command_surface_shell_primitive_contract_boundary_map_input_rejected"
  | "hidden_database_storage_cache_write_semantics_command_surface_shell_primitive_contract_boundary_map_input_rejected"
  | "hidden_auth_session_token_api_key_semantics_command_surface_shell_primitive_contract_boundary_map_input_rejected"
  | "hidden_connector_grant_semantics_command_surface_shell_primitive_contract_boundary_map_input_rejected"
  | "hidden_fabric_websocket_http_mcp_task_runtime_semantics_command_surface_shell_primitive_contract_boundary_map_input_rejected"
  | "hidden_secure_drop_implementation_semantics_command_surface_shell_primitive_contract_boundary_map_input_rejected"
  | "hidden_matrix_gateway_runtime_semantics_command_surface_shell_primitive_contract_boundary_map_input_rejected"
  | "hidden_content_addressed_chunked_resumable_p2p_transport_semantics_command_surface_shell_primitive_contract_boundary_map_input_rejected"
  | "hidden_sqlite_embedded_db_query_runtime_semantics_command_surface_shell_primitive_contract_boundary_map_input_rejected"
  | "hidden_hermes_cua_computer_use_runtime_semantics_command_surface_shell_primitive_contract_boundary_map_input_rejected"
  | "hidden_encoded_handoff_runtime_codec_translator_stego_covert_channel_tokenizer_exploit_bypass_semantics_command_surface_shell_primitive_contract_boundary_map_input_rejected"
  | "unsafe_command_surface_shell_primitive_runtime_flags_command_surface_shell_primitive_contract_boundary_map_input_rejected"
  | "nested_unsafe_flags_command_surface_shell_primitive_contract_boundary_map_input_rejected"
  | "noncanonical_command_surface_shell_primitive_contract_boundary_map_input_rejected";

export interface CommandSurfaceShellPrimitiveContractBoundaryEntry {
  boundaryId: string;
  boundaryFamily:
    | "command_surface_contract"
    | "repl_contract"
    | "prompt_contract"
    | "command_parser_contract"
    | "builtin_command_contract"
    | "path_resolution_contract"
    | "external_program_contract"
    | "process_spawn_boundary"
    | "exit_code_contract"
    | "quoting_contract"
    | "escaping_contract"
    | "redirection_contract"
    | "pipeline_contract"
    | "completion_contract"
    | "programmable_completion_contract"
    | "background_job_contract"
    | "job_control_contract"
    | "history_contract"
    | "history_persistence_contract"
    | "parameter_expansion_contract"
    | "environment_variable_contract"
    | "terminal_backend_contract"
    | "stdin_stdout_stderr_contract"
    | "shell_reference_boundary";
  relatedSystem:
    | "ardyn"
    | "ardyn-subagent"
    | "locus"
    | "multiverse"
    | "content-fabric"
    | "repo-family"
    | "external-harness"
    | "codecrafters-shell-reference"
    | "hermes-reference"
    | "cua-driver-reference";
  currentStatus: "metadata_only" | "blocked" | "future_contract_required";
  allowedCurrentBehavior: string[];
  forbiddenCurrentBehavior: string[];
  requiredFutureContractBeforeImplementation: string;
  requiredFutureAuthorizationPhaseBeforeRuntime: string;
  commandVisibilityExpectation: string;
  commandParsingExpectation: string;
  processControlExpectation: string;
  stdinStdoutStderrExpectation: string;
  filesystemInteractionExpectation: string;
  environmentSecretExposureExpectation: string;
  operatorApprovalExpectation: string;
  locusRoleDescription: string;
  fabricRoleDescription: string;
  explicitBlockedAuthorizationFlags: Record<string, false>;
  unsafeCommandSurfaceShellPrimitiveRuntimeFlags: Record<string, false>;
  commandSurfaceBoundaryMetadataOnly: true;
  noLiveCommandSurfaceShellPrimitiveRuntimePerformed: true;
  nonAuthorizingProof: true;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
  [key: string]: unknown;
}

export interface CommandSurfaceShellPrimitiveContractBoundaryMapState {
  schema: "ardyn.phase-5.74.command-surface-shell-primitive-contract-boundary-map-state";
  schemaVersion: "0.1.0";
  stateKind: "command-surface-shell-primitive-contract-boundary-map";
  stateMode: "review-only";
  reviewedAt: string;
  sourcePhaseContext: Record<string, boolean | string>;
  boundaryEntries: CommandSurfaceShellPrimitiveContractBoundaryEntry[];
  boundaryMapSummary: Record<string, boolean | number | string | string[] | Record<string, number>>;
  invalidBoundaryCasePolicy: Record<string, boolean>;
  topCommandSurfaceShellSqliteCodeModeFabricApiBackendGaps: string[];
  recommendedNextPhase: string;
  commandSurfaceShellPrimitiveContractBoundaryMapOnly: true;
  reviewOnly: true;
  metadataOnly: true;
  authoritative: false;
  nonAuthorizingProof: true;
  reportRunsChecks: false;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
  [key: string]: unknown;
}

export interface CommandSurfaceShellPrimitiveContractBoundaryMapResult {
  schema: "ardyn.phase-5.74.command-surface-shell-primitive-contract-boundary-map-result";
  schemaVersion: "0.1.0";
  commandSurfaceShellPrimitiveContractBoundaryMapKind:
    "command-surface-shell-primitive-contract-boundary-map";
  commandSurfaceShellPrimitiveContractBoundaryMapMode: "review-only";
  reviewedAt: string;
  classification: CommandSurfaceShellPrimitiveContractBoundaryMapClassification;
  commandSurfaceShellPrimitiveContractBoundaryMapProduced: boolean;
  commandSurfaceShellPrimitiveContractBoundaryMap:
    | CommandSurfaceShellPrimitiveContractBoundaryMapState
    | null;
  boundaryMapSummary:
    | CommandSurfaceShellPrimitiveContractBoundaryMapState["boundaryMapSummary"]
    | null;
  boundaryEntries: CommandSurfaceShellPrimitiveContractBoundaryEntry[];
  invalidBoundaryCasePolicy: Record<string, boolean>;
  topCommandSurfaceShellSqliteCodeModeFabricApiBackendGaps: string[];
  recommendedNextPhase: string | null;
  commandSurfaceShellPrimitiveContractBoundaryMapOnly: true;
  reviewOnly: true;
  metadataOnly: true;
  authoritative: false;
  nonAuthorizingProof: true;
  reportRunsChecks: false;
  rejectionReasons: Array<Record<string, boolean | string>>;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
  [key: string]: unknown;
}

export function createCommandSurfaceShellPrimitiveContractBoundaryMapForReview(
  input?: Record<string, unknown>
): CommandSurfaceShellPrimitiveContractBoundaryMapResult;

export type FabricCoreConsumerIntegrationReadinessBoundaryUpdateClassification =
  | "valid_fabric_core_consumer_integration_readiness_boundary_update_runtime_still_blocked"
  | "malformed_fabric_core_consumer_integration_readiness_boundary_update_input_rejected"
  | "missing_required_fabric_core_consumer_readiness_boundary_entry_rejected"
  | "unknown_top_level_field_fabric_core_consumer_integration_readiness_boundary_update_input_rejected"
  | "unknown_boundary_family_fabric_core_consumer_integration_readiness_boundary_update_input_rejected"
  | "unknown_related_system_fabric_core_consumer_integration_readiness_boundary_update_input_rejected"
  | "unknown_current_status_fabric_core_consumer_integration_readiness_boundary_update_input_rejected"
  | "authorization_flags_enabled_fabric_core_consumer_integration_readiness_boundary_update_input_rejected"
  | "report_runs_checks_true_fabric_core_consumer_integration_readiness_boundary_update_input_rejected"
  | "runtime_authorization_attempt_fabric_core_consumer_integration_readiness_boundary_update_input_rejected"
  | "command_exposure_attempt_fabric_core_consumer_integration_readiness_boundary_update_input_rejected"
  | "blocked_cli_bypass_attempt_fabric_core_consumer_integration_readiness_boundary_update_input_rejected"
  | "hidden_fabric_core_import_semantics_fabric_core_consumer_integration_readiness_boundary_update_input_rejected"
  | "hidden_sidecar_http_bearer_token_semantics_fabric_core_consumer_integration_readiness_boundary_update_input_rejected"
  | "hidden_hashing_content_id_verification_semantics_fabric_core_consumer_integration_readiness_boundary_update_input_rejected"
  | "hidden_content_addressed_chunked_resumable_p2p_transport_semantics_fabric_core_consumer_integration_readiness_boundary_update_input_rejected"
  | "hidden_large_payload_movement_semantics_fabric_core_consumer_integration_readiness_boundary_update_input_rejected"
  | "hidden_filesystem_scanning_file_selection_semantics_fabric_core_consumer_integration_readiness_boundary_update_input_rejected"
  | "hidden_backend_api_server_semantics_fabric_core_consumer_integration_readiness_boundary_update_input_rejected"
  | "hidden_database_storage_cache_write_semantics_fabric_core_consumer_integration_readiness_boundary_update_input_rejected"
  | "hidden_auth_session_token_api_key_semantics_fabric_core_consumer_integration_readiness_boundary_update_input_rejected"
  | "hidden_connector_grant_semantics_fabric_core_consumer_integration_readiness_boundary_update_input_rejected"
  | "hidden_matrix_gateway_runtime_semantics_fabric_core_consumer_integration_readiness_boundary_update_input_rejected"
  | "hidden_shell_command_runtime_semantics_fabric_core_consumer_integration_readiness_boundary_update_input_rejected"
  | "hidden_sqlite_embedded_db_query_runtime_semantics_fabric_core_consumer_integration_readiness_boundary_update_input_rejected"
  | "hidden_encoded_handoff_runtime_codec_translator_semantics_fabric_core_consumer_integration_readiness_boundary_update_input_rejected"
  | "unsafe_fabric_core_consumer_readiness_runtime_flags_fabric_core_consumer_integration_readiness_boundary_update_input_rejected"
  | "nested_unsafe_flags_fabric_core_consumer_integration_readiness_boundary_update_input_rejected"
  | "noncanonical_fabric_core_consumer_integration_readiness_boundary_update_input_rejected";

export interface FabricCoreConsumerIntegrationReadinessBoundaryEntry {
  boundaryId: string;
  boundaryFamily:
    | "fabric_core_consumer_readiness_contract"
    | "fabric_core_js_ts_consumer_contract"
    | "fabric_transport_sidecar_consumer_contract"
    | "fabric_content_id_reverification_contract"
    | "fabric_large_payload_todo_contract"
    | "fabric_existing_point_to_point_hold_contract"
    | "fabric_dedicated_consumer_prompt_required_contract"
    | "fabric_no_reimplementation_contract"
    | "fabric_no_p2p_dependency_contract"
    | "fabric_sidecar_bearer_token_boundary"
    | "fabric_loopback_http_boundary"
    | "fabric_security_review_dependency_contract";
  relatedSystem:
    | "ardyn"
    | "multiverse"
    | "locus"
    | "content-fabric"
    | "repo-family"
    | "fabric-core-reference"
    | "fabric-transport-d-reference";
  currentStatus:
    | "metadata_only"
    | "producer_ready_consumer_pending"
    | "blocked"
    | "future_contract_required";
  allowedCurrentBehavior: string[];
  forbiddenCurrentBehavior: string[];
  requiredFutureContractBeforeImplementation: string;
  requiredFutureAuthorizationPhaseBeforeRuntime: string;
  producerSourceOfTruthExpectation: string;
  jsTsConsumerExpectation: string;
  nonJsSidecarConsumerExpectation: string;
  contentIdReverificationExpectation: string;
  bearerTokenLoopbackExpectation: string;
  largePayloadTodoExpectation: string;
  pointToPointHoldExpectation: string;
  locusByteInteropExpectation: string;
  multiverseProducerRole: string;
  fabricRoleDescription: string;
  explicitBlockedAuthorizationFlags: Record<string, false>;
  unsafeFabricCoreConsumerReadinessRuntimeFlags: Record<string, false>;
  fabricCoreConsumerReadinessBoundaryMetadataOnly: true;
  noLiveFabricCoreConsumerIntegrationRuntimePerformed: true;
  nonAuthorizingProof: true;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
  [key: string]: unknown;
}

export interface FabricCoreConsumerIntegrationReadinessBoundaryUpdateState {
  schema: "ardyn.phase-5.75.fabric-core-consumer-integration-readiness-boundary-update-state";
  schemaVersion: "0.1.0";
  stateKind: "fabric-core-consumer-integration-readiness-boundary-update";
  stateMode: "review-only";
  reviewedAt: string;
  sourcePhaseContext: Record<string, boolean | string>;
  boundaryEntries: FabricCoreConsumerIntegrationReadinessBoundaryEntry[];
  boundaryMapSummary: Record<string, boolean | number | string | string[] | Record<string, number>>;
  invalidBoundaryCasePolicy: Record<string, boolean>;
  topFabricCoreConsumerSqliteCodeModeFabricApiBackendGaps: string[];
  recommendedNextPhase: string;
  fabricCoreConsumerIntegrationReadinessBoundaryUpdateOnly: true;
  reviewOnly: true;
  metadataOnly: true;
  authoritative: false;
  nonAuthorizingProof: true;
  reportRunsChecks: false;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
  [key: string]: unknown;
}

export interface FabricCoreConsumerIntegrationReadinessBoundaryUpdateResult {
  schema: "ardyn.phase-5.75.fabric-core-consumer-integration-readiness-boundary-update-result";
  schemaVersion: "0.1.0";
  fabricCoreConsumerIntegrationReadinessBoundaryUpdateKind:
    "fabric-core-consumer-integration-readiness-boundary-update";
  fabricCoreConsumerIntegrationReadinessBoundaryUpdateMode: "review-only";
  reviewedAt: string;
  classification: FabricCoreConsumerIntegrationReadinessBoundaryUpdateClassification;
  fabricCoreConsumerIntegrationReadinessBoundaryUpdateProduced: boolean;
  fabricCoreConsumerIntegrationReadinessBoundaryUpdate:
    | FabricCoreConsumerIntegrationReadinessBoundaryUpdateState
    | null;
  boundaryMapSummary:
    | FabricCoreConsumerIntegrationReadinessBoundaryUpdateState["boundaryMapSummary"]
    | null;
  boundaryEntries: FabricCoreConsumerIntegrationReadinessBoundaryEntry[];
  invalidBoundaryCasePolicy: Record<string, boolean>;
  topFabricCoreConsumerSqliteCodeModeFabricApiBackendGaps: string[];
  recommendedNextPhase: string | null;
  fabricCoreConsumerIntegrationReadinessBoundaryUpdateOnly: true;
  reviewOnly: true;
  metadataOnly: true;
  authoritative: false;
  nonAuthorizingProof: true;
  reportRunsChecks: false;
  rejectionReasons: Array<Record<string, boolean | string>>;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
  [key: string]: unknown;
}

export function createFabricCoreConsumerIntegrationReadinessBoundaryUpdateForReview(
  input?: Record<string, unknown>
): FabricCoreConsumerIntegrationReadinessBoundaryUpdateResult;

export type EmbeddedDbQueryEnginePrimitiveContractBoundaryMapClassification =
  | "valid_embedded_db_query_engine_primitive_contract_boundary_map_runtime_still_blocked"
  | "malformed_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected"
  | "missing_required_embedded_db_query_engine_boundary_entry_rejected"
  | "unknown_top_level_field_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected"
  | "unknown_boundary_family_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected"
  | "unknown_related_system_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected"
  | "unknown_current_status_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected"
  | "authorization_flags_enabled_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected"
  | "report_runs_checks_true_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected"
  | "runtime_authorization_attempt_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected"
  | "command_exposure_attempt_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected"
  | "blocked_cli_bypass_attempt_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected"
  | "hidden_sqlite_embedded_db_query_runtime_semantics_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected"
  | "hidden_database_file_page_parsing_semantics_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected"
  | "hidden_sql_query_execution_semantics_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected"
  | "hidden_btree_index_traversal_semantics_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected"
  | "hidden_transaction_wal_migration_semantics_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected"
  | "hidden_storage_cache_read_write_semantics_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected"
  | "hidden_filesystem_access_semantics_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected"
  | "hidden_auth_session_token_api_key_semantics_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected"
  | "hidden_connector_grant_semantics_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected"
  | "hidden_fabric_fabric_core_transport_runtime_semantics_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected"
  | "hidden_content_addressed_chunked_resumable_p2p_transport_semantics_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected"
  | "hidden_matrix_gateway_runtime_semantics_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected"
  | "hidden_shell_command_runtime_semantics_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected"
  | "hidden_secure_drop_implementation_semantics_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected"
  | "hidden_backend_api_server_semantics_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected"
  | "hidden_logger_audit_transcript_telemetry_external_sink_semantics_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected"
  | "unsafe_embedded_db_query_engine_primitive_runtime_flags_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected"
  | "nested_unsafe_flags_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected"
  | "noncanonical_embedded_db_query_engine_primitive_contract_boundary_map_input_rejected";

export interface EmbeddedDbQueryEnginePrimitiveBoundaryEntry {
  boundaryId: string;
  boundaryFamily: string;
  relatedSystem: string;
  currentStatus: string;
  allowedCurrentBehavior: string[];
  forbiddenCurrentBehavior: string[];
  requiredFutureContractBeforeImplementation: string;
  requiredFutureAuthorizationPhaseBeforeRuntime: string;
  databaseFileFormatExpectation: string;
  queryParsingExpectation: string;
  readOnlyQueryExpectation: string;
  dataIsolationExpectation: string;
  storageWriteExpectation: string;
  auditLoggingExpectation: string;
  migrationTransactionExpectation: string;
  performanceIndexingExpectation: string;
  locusRoleDescription: string;
  fabricRoleDescription: string;
  secureDropRoleDescription: string;
  explicitBlockedAuthorizationFlags: Record<string, false>;
  unsafeEmbeddedDbQueryEnginePrimitiveRuntimeFlags: Record<string, false>;
  embeddedDbQueryEnginePrimitiveBoundaryMetadataOnly: true;
  noLiveEmbeddedDbQueryEngineRuntimePerformed: true;
  nonAuthorizingProof: true;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
  [key: string]: unknown;
}

export interface EmbeddedDbQueryEnginePrimitiveContractBoundaryMapState {
  schema: "ardyn.phase-5.76.embedded-db-query-engine-primitive-contract-boundary-map-state";
  schemaVersion: "0.1.0";
  stateKind: "embedded-db-query-engine-primitive-contract-boundary-map";
  stateMode: "review-only";
  reviewedAt: string;
  sourcePhaseContext: Record<string, boolean | string>;
  boundaryEntries: EmbeddedDbQueryEnginePrimitiveBoundaryEntry[];
  boundaryMapSummary: Record<string, boolean | number | string | string[] | Record<string, number>>;
  invalidBoundaryCasePolicy: Record<string, boolean>;
  topEmbeddedDbQueryEngineCodeModeFabricApiBackendGaps: string[];
  recommendedNextPhase: string;
  embeddedDbQueryEnginePrimitiveContractBoundaryMapOnly: true;
  reviewOnly: true;
  metadataOnly: true;
  authoritative: false;
  nonAuthorizingProof: true;
  reportRunsChecks: false;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
  [key: string]: unknown;
}

export interface EmbeddedDbQueryEnginePrimitiveContractBoundaryMapResult {
  schema: "ardyn.phase-5.76.embedded-db-query-engine-primitive-contract-boundary-map-result";
  schemaVersion: "0.1.0";
  embeddedDbQueryEnginePrimitiveContractBoundaryMapKind:
    "embedded-db-query-engine-primitive-contract-boundary-map";
  embeddedDbQueryEnginePrimitiveContractBoundaryMapMode: "review-only";
  reviewedAt: string;
  classification: EmbeddedDbQueryEnginePrimitiveContractBoundaryMapClassification;
  embeddedDbQueryEnginePrimitiveContractBoundaryMapProduced: boolean;
  embeddedDbQueryEnginePrimitiveContractBoundaryMap:
    | EmbeddedDbQueryEnginePrimitiveContractBoundaryMapState
    | null;
  boundaryMapSummary:
    | EmbeddedDbQueryEnginePrimitiveContractBoundaryMapState["boundaryMapSummary"]
    | null;
  boundaryEntries: EmbeddedDbQueryEnginePrimitiveBoundaryEntry[];
  invalidBoundaryCasePolicy: Record<string, boolean>;
  topEmbeddedDbQueryEngineCodeModeFabricApiBackendGaps: string[];
  recommendedNextPhase: string | null;
  embeddedDbQueryEnginePrimitiveContractBoundaryMapOnly: true;
  reviewOnly: true;
  metadataOnly: true;
  authoritative: false;
  nonAuthorizingProof: true;
  reportRunsChecks: false;
  rejectionReasons: Array<Record<string, boolean | string>>;
  runtimeEffect: ReviewOnlyRuntimeEffectFalse;
  [key: string]: unknown;
}

export function createEmbeddedDbQueryEnginePrimitiveContractBoundaryMapForReview(
  input?: Record<string, unknown>
): EmbeddedDbQueryEnginePrimitiveContractBoundaryMapResult;

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
export function createConsumerContractGapIndexForReview(input?: {
  reviewedAt?: string;
  sourceConsumerContractReadinessMatrixDigest?: string;
  consumerContractReadinessMatrixEntries?: unknown[];
}): ConsumerContractGapIndexResult;
export function createProductionReadinessCoverageMatrixForReview(input?: {
  reviewedAt?: string;
}): ProductionReadinessCoverageMatrixResult;
export function createConsumerDisplayAccessibilityContractMapForReview(input?: {
  reviewedAt?: string;
}): ConsumerDisplayAccessibilityContractMapResult;
export function createConsumerDisplayFixtureSchemaBoundaryForReview(input?: {
  reviewedAt?: string;
  fixtureEntries?: unknown[];
}): ConsumerDisplayFixtureSchemaBoundaryResult;
export function createConsumerDisplayFixtureExamplePackForReview(input?: {
  reviewedAt?: string;
  fixtureExamples?: unknown[];
}): ConsumerDisplayFixtureExamplePackResult;
export function createConsumerDisplayFixtureConformanceHandoffForReview(input?: {
  reviewedAt?: string;
  handoffEntries?: unknown[];
}): ConsumerDisplayFixtureConformanceHandoffResult;
export function createConsumerOwnedDisplayConformanceRunnerRequirementsForReview(input?: {
  reviewedAt?: string;
  requirementEntries?: unknown[];
}): ConsumerOwnedDisplayConformanceRunnerRequirementsResult;
export function createConsumerOwnedDisplayConformanceRunnerTestPlanForReview(input?: {
  reviewedAt?: string;
  testPlanEntries?: unknown[];
}): ConsumerOwnedDisplayConformanceRunnerTestPlanResult;
export function createConsumerOwnedDisplayConformanceRunnerResultSchemaBoundaryForReview(input?: {
  reviewedAt?: string;
  resultSchemaEntries?: unknown[];
}): ConsumerOwnedDisplayConformanceRunnerResultSchemaBoundaryResult;
export function createConsumerOwnedDisplayConformanceResultHandoffForReview(input?: {
  reviewedAt?: string;
  resultHandoffEntries?: unknown[];
}): ConsumerOwnedDisplayConformanceResultHandoffResult;
export function createConsumerOwnedDisplayConformanceResultReviewIntakeBoundaryForReview(input?: {
  reviewedAt?: string;
  reviewIntakeEntries?: unknown[];
}): ConsumerOwnedDisplayConformanceResultReviewIntakeBoundaryResult;
export function createConsumerOwnedDisplayConformanceResultReviewPackageBoundaryForReview(input?: {
  reviewedAt?: string;
  reviewPackageEntries?: unknown[];
}): ConsumerOwnedDisplayConformanceResultReviewPackageBoundaryResult;
export function createFabricAwareApiBackendContractBoundaryMapForReview(input?: {
  reviewedAt?: string;
  boundaryEntries?: unknown[];
}): FabricAwareApiBackendContractBoundaryMapResult;
export function createInterAgentEncodedHandoffConformanceForReview(input?: {
  reviewedAt?: string;
  handoffEntries?: unknown[];
  oneClickOptions?: unknown[];
}): InterAgentEncodedHandoffConformanceResult;
export function createDatabaseStorageContractBoundaryMapForReview(input?: {
  reviewedAt?: string;
  boundaryEntries?: unknown[];
}): DatabaseStorageContractBoundaryMapResult;
export function createAuthPermissionsContractBoundaryMapForReview(input?: {
  reviewedAt?: string;
  boundaryEntries?: unknown[];
}): AuthPermissionsContractBoundaryMapResult;
export function createSecurityRlsInputSanitizationContractBoundaryMapForReview(input?: {
  reviewedAt?: string;
  boundaryEntries?: unknown[];
}): SecurityRlsInputSanitizationContractBoundaryMapResult;
export function createRateLimitingAbuseControlContractBoundaryMapForReview(input?: {
  reviewedAt?: string;
  boundaryEntries?: unknown[];
}): RateLimitingAbuseControlContractBoundaryMapResult;
export function createErrorTrackingLoggingAuditIntegrityContractBoundaryMapForReview(input?: {
  reviewedAt?: string;
  boundaryEntries?: unknown[];
}): ErrorTrackingLoggingAuditIntegrityContractBoundaryMapResult;
export function createAvailabilityRecoveryContractBoundaryMapForReview(input?: {
  reviewedAt?: string;
  boundaryEntries?: unknown[];
}): AvailabilityRecoveryContractBoundaryMapResult;
export function createInfrastructureComplianceDataRetentionContractBoundaryMapForReview(input?: {
  reviewedAt?: string;
  boundaryEntries?: unknown[];
}): InfrastructureComplianceDataRetentionContractBoundaryMapResult;
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
