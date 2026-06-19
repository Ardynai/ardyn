import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";

const execFileAsync = promisify(execFile);
const packageJsonUrl = new URL("../package.json", import.meta.url);
const reportScriptUrl = new URL("../scripts/report-phase-status.mjs", import.meta.url);
const repoRoot = fileURLToPath(new URL("..", import.meta.url));
const reportScriptPath = fileURLToPath(reportScriptUrl);
const phase40IChecklistIds = [
  "event-framing",
  "stdout-stderr-policy",
  "failure-behavior",
  "local-path-safety",
  "rust-host-policy-contract-readiness",
  "policy-metadata-fixture-readiness",
  "review-record-compatibility-readiness",
  "comparison-display-readiness",
  "reviewer-index-readiness",
  "remaining-blockers-before-runtime",
  "explicit-approval-boundary-before-phase-4-1"
];
const phase40IInvariantIds = [
  "no-live-runtime",
  "no-stdin-loop",
  "no-stdio-reader",
  "no-listener-server",
  "no-runtime-subprocess-spawning",
  "no-adapter-call",
  "no-locus-runtime-dependency",
  "no-mcp-openclaw-call",
  "no-plugin-execution",
  "no-content-fabric-download-install-enable",
  "no-autonomous-loop",
  "no-secret-handling",
  "no-production-signing-key-usage",
  "no-transcript-replay-runtime",
  "no-websocket-http-control-surface",
  "no-runtime-approval-grant",
  "no-phase-4-1-implementation"
];
const phase41ProposalSectionIds = [
  "approval-boundary",
  "rust-host-stdio-ownership",
  "stdout-jsonl-emission",
  "stderr-diagnostics-redaction",
  "transcript-persistence-replay",
  "failure-audit-records",
  "kill-exit-fail-closed",
  "backpressure-partial-write",
  "line-integrity-failures",
  "required-tests-before-runtime",
  "phased-runtime-roadmap"
];
const phase41RequiredTestIds = [
  "approval-boundary-tests",
  "rust-host-stdio-ownership-tests",
  "stdout-jsonl-framing-tests",
  "stderr-redaction-tests",
  "transcript-persistence-replay-tests",
  "failure-audit-record-tests",
  "kill-exit-fail-closed-tests",
  "backpressure-partial-write-tests",
  "line-integrity-failure-tests",
  "runtime-command-negative-tests"
];
const phase41RoadmapIds = [
  "phase-4.1a-host-policy-approval-records",
  "phase-4.1b-rust-host-transport-harness",
  "phase-4.1c-stdout-stderr-enforcement",
  "phase-4.1d-transcript-persistence-replay",
  "phase-4.1e-failure-audit-and-kill-semantics",
  "phase-4.1f-major-runtime-readiness-checkpoint"
];
const phase41AApprovalClassifications = [
  "valid_review_record",
  "missing_operator_consent",
  "expired_or_not_yet_valid",
  "unsupported_version",
  "malformed",
  "denied",
  "runtime_not_available"
];
const phase41AConsentScope = [
  "process-stdio-ownership",
  "stdin-lifecycle-control",
  "stdout-jsonl-ownership",
  "stderr-diagnostics-ownership",
  "process-termination-control",
  "transcript-persistence-review",
  "failure-audit-record-emission"
];
const phase41AFixtureFiles = [
  "tests/fixtures/host-policy/phase4-1a/valid-review-only-host-policy-approval-record.json",
  "tests/fixtures/host-policy/phase4-1a/missing-operator-consent-host-policy-approval-record.json",
  "tests/fixtures/host-policy/phase4-1a/denied-host-policy-approval-record.json",
  "tests/fixtures/host-policy/phase4-1a/unsupported-major-host-policy-approval-record.json",
  "tests/fixtures/host-policy/phase4-1a/malformed-missing-record-kind-host-policy-approval-record.json",
  "tests/fixtures/host-policy/phase4-1a/expired-not-yet-valid-host-policy-approval-record.json",
  "tests/fixtures/host-policy/phase4-1a/runtime-grant-attempt-host-policy-approval-record.json"
];
const phase41BTransportHarnessClassifications = [
  "static_contract_only",
  "approval_missing",
  "policy_metadata_missing",
  "redaction_policy_missing",
  "transcript_policy_missing",
  "unsupported_version",
  "malformed",
  "runtime_unavailable"
];
const phase41BFixtureFiles = [
  "tests/fixtures/host-policy/phase4-1b/valid-static-transport-harness-contract.json",
  "tests/fixtures/host-policy/phase4-1b/missing-approval-reference-transport-harness-contract.json",
  "tests/fixtures/host-policy/phase4-1b/missing-policy-metadata-reference-transport-harness-contract.json",
  "tests/fixtures/host-policy/phase4-1b/missing-redaction-policy-reference-transport-harness-contract.json",
  "tests/fixtures/host-policy/phase4-1b/missing-transcript-audit-policy-reference-transport-harness-contract.json",
  "tests/fixtures/host-policy/phase4-1b/unsupported-major-transport-harness-contract.json",
  "tests/fixtures/host-policy/phase4-1b/malformed-missing-contract-kind-transport-harness-contract.json",
  "tests/fixtures/host-policy/phase4-1b/runtime-available-attempt-transport-harness-contract.json"
];
const phase41CJsonlClassifications = [
  "valid_whole_line_bundle",
  "blank_line_rejected",
  "missing_final_lf",
  "crlf_rejected",
  "malformed_json_line",
  "partial_line_rejected"
];
const phase41CRedactionClassifications = [
  "redacted_safe",
  "unredactable_fail_closed",
  "malformed"
];
const phase41CFixtureFiles = [
  "tests/fixtures/host-policy/phase4-1c/valid-static-framing-redaction-contract.json",
  "tests/fixtures/host-policy/phase4-1c/valid-whole-line-jsonl-bundle.json",
  "tests/fixtures/host-policy/phase4-1c/blank-line-rejected-jsonl-bundle.json",
  "tests/fixtures/host-policy/phase4-1c/missing-final-lf-rejected-jsonl-bundle.json",
  "tests/fixtures/host-policy/phase4-1c/crlf-rejected-jsonl-bundle.json",
  "tests/fixtures/host-policy/phase4-1c/malformed-json-line-rejected-jsonl-bundle.json",
  "tests/fixtures/host-policy/phase4-1c/partial-line-rejected-jsonl-bundle.json",
  "tests/fixtures/host-policy/phase4-1c/redacted-secret-token-diagnostic.json",
  "tests/fixtures/host-policy/phase4-1c/redacted-absolute-path-diagnostic.json",
  "tests/fixtures/host-policy/phase4-1c/redacted-stack-trace-diagnostic.json",
  "tests/fixtures/host-policy/phase4-1c/unredactable-diagnostic-fail-closed.json"
];
const phase41DReplayClassifications = [
  "replay_contract_only",
  "compatible",
  "upgrade_available",
  "unsupported_major",
  "malformed",
  "digest_mismatch",
  "sequence_gap",
  "duplicate_sequence",
  "out_of_order_sequence",
  "replay_runtime_unavailable"
];
const phase41DFailClosedClassifications = [
  "unsupported_major",
  "malformed",
  "digest_mismatch",
  "sequence_gap",
  "duplicate_sequence",
  "out_of_order_sequence",
  "replay_runtime_unavailable"
];
const phase41DFixtureFiles = [
  "tests/fixtures/host-policy/phase4-1d/valid-static-transcript-persistence-contract.json",
  "tests/fixtures/host-policy/phase4-1d/valid-static-transcript-replay-contract.json",
  "tests/fixtures/host-policy/phase4-1d/compatible-transcript-replay-record.json",
  "tests/fixtures/host-policy/phase4-1d/upgrade-available-transcript-replay-record.json",
  "tests/fixtures/host-policy/phase4-1d/unsupported-major-transcript-replay-record.json",
  "tests/fixtures/host-policy/phase4-1d/malformed-transcript-replay-record.json",
  "tests/fixtures/host-policy/phase4-1d/digest-mismatch-transcript-replay-record.json",
  "tests/fixtures/host-policy/phase4-1d/sequence-gap-transcript-replay-record.json",
  "tests/fixtures/host-policy/phase4-1d/duplicate-sequence-transcript-replay-record.json",
  "tests/fixtures/host-policy/phase4-1d/out-of-order-sequence-transcript-replay-record.json",
  "tests/fixtures/host-policy/phase4-1d/runtime-available-attempt-transcript-replay-record.json"
];
const phase41EFailureAuditClassifications = [
  "static_contract_only",
  "clean_failure",
  "redacted_failure",
  "unredactable_failure",
  "terminal_completed",
  "terminal_failed",
  "terminal_aborted",
  "terminal_rejected",
  "nonzero_exit_expected",
  "nonzero_exit_unexpected",
  "cleanup_required",
  "cleanup_not_available",
  "runtime_unavailable",
  "malformed",
  "unsupported_major"
];
const phase41EFailClosedClassifications = [
  "unredactable_failure",
  "nonzero_exit_unexpected",
  "cleanup_not_available",
  "runtime_unavailable",
  "malformed",
  "unsupported_major"
];
const phase41EFixtureFiles = [
  "tests/fixtures/host-policy/phase4-1e/valid-static-failure-audit-record.json",
  "tests/fixtures/host-policy/phase4-1e/redacted-failure-diagnostic-record.json",
  "tests/fixtures/host-policy/phase4-1e/unredactable-failure-diagnostic-fail-closed-record.json",
  "tests/fixtures/host-policy/phase4-1e/expected-nonzero-exit-mapping-record.json",
  "tests/fixtures/host-policy/phase4-1e/unexpected-nonzero-exit-mapping-record.json",
  "tests/fixtures/host-policy/phase4-1e/terminal-completed-record.json",
  "tests/fixtures/host-policy/phase4-1e/terminal-failed-record.json",
  "tests/fixtures/host-policy/phase4-1e/terminal-aborted-record.json",
  "tests/fixtures/host-policy/phase4-1e/terminal-rejected-record.json",
  "tests/fixtures/host-policy/phase4-1e/cleanup-required-policy-only-record.json",
  "tests/fixtures/host-policy/phase4-1e/cleanup-not-available-record.json",
  "tests/fixtures/host-policy/phase4-1e/runtime-cleanup-kill-attempt-record.json",
  "tests/fixtures/host-policy/phase4-1e/malformed-failure-audit-record.json",
  "tests/fixtures/host-policy/phase4-1e/unsupported-major-failure-audit-record.json"
];
const phase41FReadinessMatrixIds = [
  "runtime-proposal-boundary-readiness",
  "host-policy-approval-record-readiness",
  "transport-harness-contract-readiness",
  "framing-redaction-contract-readiness",
  "transcript-persistence-replay-contract-readiness",
  "failure-audit-kill-semantics-readiness",
  "runtime-effect-false-across-phase-4-1",
  "report-inventory-checkpoint-readiness",
  "runtime-command-negative-probe-readiness",
  "source-guard-no-runtime-surface-readiness",
  "devin-major-runtime-review-required",
  "separate-runtime-implementation-approval-required"
];
const phase41FBlockerIds = [
  "devin-major-runtime-readiness-review-not-recorded",
  "explicit-runtime-implementation-approval-not-recorded",
  "rust-host-live-stdio-runtime-not-implemented",
  "stdout-jsonl-live-writer-tests-missing",
  "stderr-redaction-live-enforcement-tests-missing",
  "transcript-persistence-replay-runtime-not-implemented",
  "failure-audit-cleanup-kill-runtime-not-implemented",
  "backpressure-partial-write-runtime-tests-missing",
  "line-integrity-runtime-tests-missing",
  "runtime-command-surface-not-approved",
  "approval-evaluator-host-policy-enforcement-not-implemented",
  "external-runtime-integrations-not-approved"
];
const phase41FConsolidatedPhases = ["4.1", "4.1A", "4.1B", "4.1C", "4.1D", "4.1E"];
const phase41FInventoryKeys = [
  "phase41ProposalInventory",
  "phase41AApprovalRecordInventory",
  "phase41BTransportHarnessInventory",
  "phase41CFramingRedactionInventory",
  "phase41DTranscriptReplayInventory",
  "phase41EFailureAuditInventory"
];
const phase41FFixtureFiles = [
  "tests/fixtures/host-policy/phase4-1f/runtime-readiness-checkpoint.json"
];
const phase41GPhaseSummaryPhases = [
  "4.0A",
  "4.0B",
  "4.0C",
  "4.0D",
  "4.0E",
  "4.0F",
  "4.0G",
  "4.0H",
  "4.0I",
  "4.1",
  "4.1A",
  "4.1B",
  "4.1C",
  "4.1D",
  "4.1E",
  "4.1F"
];
const phase41GEvidenceMapIds = [
  "dry-run-emitter-evidence",
  "transport-policy-evidence",
  "host-policy-review-evidence",
  "pre-runtime-readiness-evidence",
  "phase-4.1-planning-evidence",
  "status-report-evidence"
];
const phase41GInvariantIds = [
  "no-live-runtime",
  "no-live-stdin-command-loop",
  "no-live-stdio-reader-or-writer",
  "no-listener-server-or-web-control-surface",
  "no-subprocess-spawning-or-process-control",
  "no-adapter-locus-mcp-openclaw-plugin-or-content-fabric-runtime",
  "no-secret-or-production-signing-key-use",
  "no-transcript-persistence-replay-runtime",
  "no-runtime-approval-grant"
];
const phase41GBlockedSurfaceIds = [
  "serve-runtime-command",
  "stdio-runtime-command",
  "replay-session-transcript-command",
  "approval-evaluator-runtime",
  "process-stdio-ownership-runtime",
  "failure-audit-cleanup-kill-runtime",
  "transcript-persistence-replay-runtime",
  "external-integration-runtime"
];
const phase41GReviewerQuestionCategories = [
  "packet-navigation",
  "documentation-consistency",
  "evidence-completeness",
  "scope-boundary",
  "approval-consent-boundary",
  "runtime-negative-surface",
  "transport-stdio-boundary",
  "transcript-replay-boundary",
  "failure-audit-kill-boundary",
  "external-integration-boundary",
  "blocker-disposition"
];
const phase41GReviewerOutcomeCategories = [
  "packet-pass-runtime-still-blocked",
  "packet-pass-with-nits-runtime-still-blocked",
  "needs-clarification-runtime-still-blocked",
  "evidence-gap-runtime-still-blocked",
  "runtime-claim-detected-fail-closed",
  "out-of-scope-runtime-request",
  "external-review-recorded-runtime-still-blocked"
];
const phase41GFixtureFiles = [
  "tests/fixtures/host-policy/phase4-1g/external-review-packet.json"
];
const phase41HBlockedSurfaceIds = [
  "serve-runtime-command",
  "stdio-runtime-command",
  "replay-session-transcript-command",
  "approval-evaluator-runtime",
  "process-stdio-ownership-runtime",
  "failure-audit-cleanup-kill-runtime",
  "transcript-persistence-replay-runtime",
  "external-integration-runtime",
  "websocket-http-control-surface",
  "runtime-approval-grant"
];
const phase41HRejectedProbes = [
  "missing --dry-run",
  "unknown arg",
  "unsafe manifest URL",
  "invalid JSON manifest",
  "invalid JSON task",
  "replay-session-transcript",
  "policy-metadata",
  "host-policy-export",
  "serve-runtime",
  "stdio-runtime",
  "external-review-packet",
  "review-packet",
  "runtime-readiness-review"
];
const phase41HFixtureFiles = [
  "tests/fixtures/host-policy/phase4-1h/external-review-disposition.json"
];
const phase41IImplementedHarnessEvidenceIds = [
  "deterministic-stdout-jsonl-framing-tests",
  "stderr-isolation-tests",
  "malformed-and-early-eof-rejection-tests",
  "oversized-and-invalid-payload-rejection-tests",
  "negative-runtime-command-probes"
];
const phase41IOwnedFiles = [
  "crates/ardyn-host/src/lib.rs",
  "docs/phase-4-1i-rust-host-stdio-harness.md",
  "scripts/report-phase-status.mjs",
  "tests/report-phase-status.test.mjs",
  "tests/phase4-1i-rust-host-stdio-harness.test.mjs",
  "README.md",
  "apps/cli/README.md",
  "packages/core/README.md",
  "crates/ardyn-host/README.md",
  "docs/architecture.md",
  "docs/host-policy-preconditions.md",
  "docs/session-events-stdio-contract.md",
  "docs/phase-4-stdio-dry-run-event-emission.md",
  "docs/phase-4-1-runtime-proposal.md",
  "docs/phase-4-1h-external-review-disposition.md"
];
const phase41IExcludedCliRuntimeSourceFiles = [
  "apps/cli/src/index.mjs"
];
const phase41IDocFiles = [
  "docs/phase-4-1i-rust-host-stdio-harness.md",
  "docs/phase-4-1h-external-review-disposition.md",
  "docs/phase-4-1-runtime-proposal.md",
  "docs/phase-4-stdio-dry-run-event-emission.md",
  "docs/session-events-stdio-contract.md",
  "docs/host-policy-preconditions.md",
  "docs/architecture.md",
  "README.md",
  "apps/cli/README.md",
  "packages/core/README.md",
  "crates/ardyn-host/README.md"
];
const phase41JOwnedFiles = [
  "crates/ardyn-host/src/lib.rs",
  "tests/fixtures/stdio-harness/phase4-1j/expected-outcomes.json",
  "tests/fixtures/stdio-harness/phase4-1j/valid-single-event.jsonl",
  "tests/fixtures/stdio-harness/phase4-1j/valid-multiple-events.jsonl",
  "tests/fixtures/stdio-harness/phase4-1j/malformed-json.jsonl",
  "tests/fixtures/stdio-harness/phase4-1j/non-object-json.jsonl",
  "tests/fixtures/stdio-harness/phase4-1j/missing-required-fields.jsonl",
  "tests/fixtures/stdio-harness/phase4-1j/invalid-event-kind.jsonl",
  "tests/fixtures/stdio-harness/phase4-1j/oversized-payload.jsonl",
  "tests/fixtures/stdio-harness/phase4-1j/oversized-input.jsonl",
  "tests/fixtures/stdio-harness/phase4-1j/runtime-approval-request-rejected.jsonl",
  "docs/phase-4-1j-fixture-backed-stdio-boundaries.md",
  "scripts/report-phase-status.mjs",
  "tests/report-phase-status.test.mjs",
  "tests/phase4-1j-rust-host-stdio-boundary-fixtures.test.mjs",
  "README.md",
  "apps/cli/README.md",
  "packages/core/README.md",
  "crates/ardyn-host/README.md",
  "docs/architecture.md",
  "docs/host-policy-preconditions.md",
  "docs/session-events-stdio-contract.md",
  "docs/phase-4-stdio-dry-run-event-emission.md",
  "docs/phase-4-1-runtime-proposal.md",
  "docs/phase-4-1i-rust-host-stdio-harness.md"
];
const phase41JDocFiles = [
  "docs/phase-4-1j-fixture-backed-stdio-boundaries.md",
  "docs/phase-4-1i-rust-host-stdio-harness.md",
  "docs/phase-4-1-runtime-proposal.md",
  "docs/phase-4-stdio-dry-run-event-emission.md",
  "docs/session-events-stdio-contract.md",
  "docs/host-policy-preconditions.md",
  "docs/architecture.md",
  "README.md",
  "apps/cli/README.md",
  "packages/core/README.md",
  "crates/ardyn-host/README.md"
];
const phase41JFixtureBackedBoundaryEvidenceIds = [
  "phase-4.1j-fixture-suite-replay",
  "deterministic-jsonl-final-lf-boundary",
  "stderr-isolation-boundary",
  "malformed-eof-crlf-rejection-boundary",
  "runtime-like-command-rejection-boundary"
];
const phase41JFixtureFiles = [
  "tests/fixtures/stdio-harness/phase4-1j/expected-outcomes.json",
  "tests/fixtures/stdio-harness/phase4-1j/valid-single-event.jsonl",
  "tests/fixtures/stdio-harness/phase4-1j/valid-multiple-events.jsonl",
  "tests/fixtures/stdio-harness/phase4-1j/malformed-json.jsonl",
  "tests/fixtures/stdio-harness/phase4-1j/non-object-json.jsonl",
  "tests/fixtures/stdio-harness/phase4-1j/missing-required-fields.jsonl",
  "tests/fixtures/stdio-harness/phase4-1j/invalid-event-kind.jsonl",
  "tests/fixtures/stdio-harness/phase4-1j/oversized-payload.jsonl",
  "tests/fixtures/stdio-harness/phase4-1j/oversized-input.jsonl",
  "tests/fixtures/stdio-harness/phase4-1j/runtime-approval-request-rejected.jsonl"
];
const phase41JRuntimeLikeCommandRejectionProbes = [
  ...phase41HRejectedProbes,
  "fixture-backed-stdio-boundary",
  "stdio-boundary",
  "public-runtime-contract",
  "rust-host-stdio-harness",
  "stdio-harness",
  "runtime-harness",
  "runtime-readiness",
  "runtime-readiness-checkpoint",
  "approve-runtime",
  "grant-runtime",
  "enable-runtime",
  "approval-evaluator",
  "transport-harness",
  "stdin-reader",
  "stdout-writer",
  "stderr-writer",
  "failure-audit",
  "cleanup-runtime",
  "kill-runtime"
];
const phase41KDocFiles = [
  "docs/phase-4-1k-stdio-runtime-contract-gates.md",
  "docs/phase-4-1j-fixture-backed-stdio-boundaries.md",
  "docs/phase-4-1-runtime-proposal.md",
  "docs/phase-4-stdio-dry-run-event-emission.md",
  "docs/session-events-stdio-contract.md",
  "docs/host-policy-preconditions.md",
  "docs/architecture.md",
  "README.md",
  "apps/cli/README.md",
  "packages/core/README.md",
  "crates/ardyn-host/README.md"
];
const phase41KGateFixtureFiles = [
  "tests/fixtures/host-policy/phase4-1k/stdio-runtime-contract-gates.json"
];
const phase41KRustContractHelperNames = [
  "stdio_transport_policy_contract",
  "transport_harness_contract",
  "stdio_runtime_contract_gates",
  "parse_stdio_runtime_contract_gates_json",
  "classify_stdio_runtime_contract_gates_json"
];
const phase41KRuntimeLikeCommandRejectionProbes = [
  ...phase41HRejectedProbes,
  "stdio-runtime-contract-gates",
  "runtime-contract-gates",
  "stdio-runtime-contract",
  "public-stdio-runtime-contract",
  "public-runtime-contract",
  "fixture-backed-stdio-boundary",
  "stdio-boundary",
  "rust-host-stdio-harness",
  "stdio-harness",
  "runtime-harness",
  "runtime-readiness",
  "runtime-readiness-checkpoint",
  "approve-runtime",
  "grant-runtime",
  "enable-runtime",
  "approval-evaluator",
  "transport-harness",
  "stdin-reader",
  "stdout-writer",
  "stderr-writer",
  "failure-audit",
  "cleanup-runtime",
  "kill-runtime"
];
const phase41LDocFiles = [
  "docs/phase-4-1l-runtime-implementation-readiness.md",
  "docs/phase-4-1k-stdio-runtime-contract-gates.md",
  "docs/phase-4-1-runtime-proposal.md",
  "docs/phase-4-stdio-dry-run-event-emission.md",
  "docs/session-events-stdio-contract.md",
  "docs/host-policy-preconditions.md",
  "docs/architecture.md",
  "README.md",
  "apps/cli/README.md",
  "packages/core/README.md",
  "crates/ardyn-host/README.md"
];
const phase41LRuntimeLikeCommandRejectionProbes = [
  "serve-runtime",
  "stdio-runtime",
  "replay-session-transcript",
  "external-review-packet",
  "review-packet",
  "runtime-readiness-review",
  "runtime-implementation-readiness",
  "phase-4-2a-runtime-skeleton",
  "approve-runtime",
  "grant-runtime",
  "enable-runtime"
];
const phase42ADocFiles = [
  "docs/phase-4-2a-deliberately-blocked-rust-host-stdio-runtime-skeleton.md",
  "docs/phase-4-1l-runtime-implementation-readiness.md",
  "docs/phase-4-1-runtime-proposal.md",
  "docs/phase-4-stdio-dry-run-event-emission.md",
  "docs/session-events-stdio-contract.md",
  "docs/host-policy-preconditions.md",
  "docs/architecture.md",
  "README.md",
  "apps/cli/README.md",
  "packages/core/README.md",
  "crates/ardyn-host/README.md"
];
const phase42ARuntimeLikeCommandRejectionProbes = [
  ...phase41LRuntimeLikeCommandRejectionProbes,
  "runtime-skeleton"
];
const phase42BDocFiles = [
  "docs/phase-4-2b-blocked-lifecycle-failure-audit-skeleton.md",
  "docs/phase-4-2a-deliberately-blocked-rust-host-stdio-runtime-skeleton.md",
  "docs/phase-4-1l-runtime-implementation-readiness.md",
  "docs/phase-4-1-runtime-proposal.md",
  "docs/phase-4-stdio-dry-run-event-emission.md",
  "docs/session-events-stdio-contract.md",
  "docs/host-policy-preconditions.md",
  "docs/architecture.md",
  "README.md",
  "apps/cli/README.md",
  "packages/core/README.md",
  "crates/ardyn-host/README.md"
];
const phase42BRuntimeLikeCommandRejectionProbes = [
  ...phase42ARuntimeLikeCommandRejectionProbes,
  "runtime-lifecycle",
  "phase-4-2b-lifecycle-runtime",
  "phase-4-2b-failure-audit",
  "failure-audit-runtime",
  "cleanup-runtime",
  "kill-runtime"
];
const phase42CDocFiles = [
  "docs/phase-4-2c-runtime-readiness-review-gate.md",
  "docs/phase-4-2b-blocked-lifecycle-failure-audit-skeleton.md",
  "docs/phase-4-2a-deliberately-blocked-rust-host-stdio-runtime-skeleton.md",
  "docs/phase-4-1l-runtime-implementation-readiness.md",
  "docs/phase-4-1-runtime-proposal.md",
  "docs/phase-4-stdio-dry-run-event-emission.md",
  "docs/session-events-stdio-contract.md",
  "docs/host-policy-preconditions.md",
  "docs/architecture.md",
  "README.md",
  "apps/cli/README.md",
  "packages/core/README.md",
  "crates/ardyn-host/README.md"
];
const phase42CRuntimeLikeCommandRejectionProbes = [
  "serve-runtime",
  "stdio-runtime",
  "replay-session-transcript",
  "external-review-packet",
  "review-packet",
  "runtime-readiness-review",
  "runtime-implementation-readiness",
  "phase-4-2a-runtime-skeleton",
  "runtime-skeleton",
  "runtime-lifecycle",
  "phase-4-2b-lifecycle-runtime",
  "phase-4-2b-failure-audit",
  "phase-4-2c-runtime-readiness-review-gate",
  "phase-4-2c-readiness-gate",
  "runtime-readiness-gate",
  "readiness-gate",
  "failure-audit-runtime",
  "cleanup-runtime",
  "kill-runtime",
  "approve-runtime",
  "grant-runtime",
  "enable-runtime"
];
const phase42DDocFiles = [
  "docs/phase-4-2d-external-review-disposition-phase5-handoff.md",
  "docs/phase-5-1-controlled-runtime-implementation-approval-handoff.md",
  "docs/phase-4-2c-runtime-readiness-review-gate.md",
  "docs/phase-4-2b-blocked-lifecycle-failure-audit-skeleton.md",
  "docs/phase-4-2a-deliberately-blocked-rust-host-stdio-runtime-skeleton.md",
  "docs/phase-4-1-runtime-proposal.md",
  "docs/phase-4-stdio-dry-run-event-emission.md",
  "docs/session-events-stdio-contract.md",
  "docs/host-policy-preconditions.md",
  "docs/architecture.md",
  "README.md",
  "apps/cli/README.md",
  "packages/core/README.md",
  "crates/ardyn-host/README.md"
];
const phase51DocFiles = [
  "docs/phase-5-1-controlled-runtime-implementation-approval-handoff.md",
  "docs/phase-4-2d-external-review-disposition-phase5-handoff.md",
  "README.md",
  "apps/cli/README.md",
  "packages/core/README.md",
  "crates/ardyn-host/README.md"
];
const phase51CrossLinks = [
  "README.md",
  "apps/cli/README.md",
  "packages/core/README.md",
  "crates/ardyn-host/README.md",
  "docs/phase-4-2d-external-review-disposition-phase5-handoff.md",
  "docs/phase-5-1-controlled-runtime-implementation-approval-handoff.md"
];
const phase52DocFiles = [
  "docs/phase-5-2-guarded-runtime-implementation-slice.md",
  "docs/phase-5-1-controlled-runtime-implementation-approval-handoff.md",
  "docs/phase-5-3-command-surface-approval-preflight.md",
  "docs/phase-4-2d-external-review-disposition-phase5-handoff.md",
  "docs/phase-4-2c-runtime-readiness-review-gate.md",
  "README.md",
  "apps/cli/README.md",
  "packages/core/README.md",
  "crates/ardyn-host/README.md"
];
const phase52CrossLinks = [
  "README.md",
  "apps/cli/README.md",
  "packages/core/README.md",
  "crates/ardyn-host/README.md",
  "docs/phase-4-2c-runtime-readiness-review-gate.md",
  "docs/phase-4-2d-external-review-disposition-phase5-handoff.md",
  "docs/phase-5-1-controlled-runtime-implementation-approval-handoff.md",
  "docs/phase-5-2-guarded-runtime-implementation-slice.md",
  "docs/phase-5-3-command-surface-approval-preflight.md"
];
const phase53DocFiles = [
  "docs/phase-5-3-command-surface-approval-preflight.md",
  "docs/phase-5-2-guarded-runtime-implementation-slice.md",
  "docs/phase-5-1-controlled-runtime-implementation-approval-handoff.md",
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md"
];
const phase53CrossLinks = [
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md",
  "docs/phase-5-1-controlled-runtime-implementation-approval-handoff.md",
  "docs/phase-5-2-guarded-runtime-implementation-slice.md",
  "docs/phase-5-3-command-surface-approval-preflight.md"
];
const phase54DocFiles = [
  "docs/phase-5-4-disabled-command-exposure-plan.md",
  "docs/phase-5-3-command-surface-approval-preflight.md",
  "docs/phase-5-2-guarded-runtime-implementation-slice.md",
  "docs/phase-5-1-controlled-runtime-implementation-approval-handoff.md",
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md"
];
const phase54CrossLinks = [
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md",
  "docs/phase-5-1-controlled-runtime-implementation-approval-handoff.md",
  "docs/phase-5-2-guarded-runtime-implementation-slice.md",
  "docs/phase-5-3-command-surface-approval-preflight.md",
  "docs/phase-5-4-disabled-command-exposure-plan.md"
];
const phase54ADocFiles = [
  "docs/phase-5-4a-jules-review-disposition.md",
  "docs/phase-5-4-disabled-command-exposure-plan.md",
  "docs/phase-5-3-command-surface-approval-preflight.md",
  "docs/phase-5-2-guarded-runtime-implementation-slice.md",
  "docs/phase-5-1-controlled-runtime-implementation-approval-handoff.md",
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md"
];
const phase54ACrossLinks = [
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md",
  "docs/phase-5-1-controlled-runtime-implementation-approval-handoff.md",
  "docs/phase-5-2-guarded-runtime-implementation-slice.md",
  "docs/phase-5-3-command-surface-approval-preflight.md",
  "docs/phase-5-4-disabled-command-exposure-plan.md",
  "docs/phase-5-4a-jules-review-disposition.md"
];
const phase55DocFiles = [
  "docs/phase-5-5-default-blocked-runtime-cli.md",
  "docs/phase-5-4a-jules-review-disposition.md",
  "docs/phase-5-4-disabled-command-exposure-plan.md",
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md"
];
const phase55CrossLinks = [
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md",
  "docs/phase-5-1-controlled-runtime-implementation-approval-handoff.md",
  "docs/phase-5-2-guarded-runtime-implementation-slice.md",
  "docs/phase-5-3-command-surface-approval-preflight.md",
  "docs/phase-5-4-disabled-command-exposure-plan.md",
  "docs/phase-5-4a-jules-review-disposition.md",
  "docs/phase-5-5-default-blocked-runtime-cli.md"
];
const phase56DocFiles = [
  "docs/phase-5-6-runtime-enable-preconditions.md",
  "docs/phase-5-5-default-blocked-runtime-cli.md",
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md"
];
const phase56CrossLinks = [
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md",
  "docs/phase-5-1-controlled-runtime-implementation-approval-handoff.md",
  "docs/phase-5-2-guarded-runtime-implementation-slice.md",
  "docs/phase-5-3-command-surface-approval-preflight.md",
  "docs/phase-5-4-disabled-command-exposure-plan.md",
  "docs/phase-5-4a-jules-review-disposition.md",
  "docs/phase-5-5-default-blocked-runtime-cli.md",
  "docs/phase-5-6-runtime-enable-preconditions.md"
];
const phase57DocFiles = [
  "docs/phase-5-7-runtime-approval-validation.md",
  "docs/phase-5-6-runtime-enable-preconditions.md",
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md"
];
const phase57CrossLinks = [
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md",
  "docs/phase-5-1-controlled-runtime-implementation-approval-handoff.md",
  "docs/phase-5-2-guarded-runtime-implementation-slice.md",
  "docs/phase-5-3-command-surface-approval-preflight.md",
  "docs/phase-5-4-disabled-command-exposure-plan.md",
  "docs/phase-5-4a-jules-review-disposition.md",
  "docs/phase-5-5-default-blocked-runtime-cli.md",
  "docs/phase-5-6-runtime-enable-preconditions.md",
  "docs/phase-5-7-runtime-approval-validation.md"
];
const phase58DocFiles = [
  "docs/phase-5-8-runtime-command-exposure-approval.md",
  "docs/phase-5-7-runtime-approval-validation.md",
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md"
];
const phase58CrossLinks = [
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md",
  "docs/phase-5-1-controlled-runtime-implementation-approval-handoff.md",
  "docs/phase-5-2-guarded-runtime-implementation-slice.md",
  "docs/phase-5-3-command-surface-approval-preflight.md",
  "docs/phase-5-4-disabled-command-exposure-plan.md",
  "docs/phase-5-4a-jules-review-disposition.md",
  "docs/phase-5-5-default-blocked-runtime-cli.md",
  "docs/phase-5-6-runtime-enable-preconditions.md",
  "docs/phase-5-7-runtime-approval-validation.md",
  "docs/phase-5-8-runtime-command-exposure-approval.md"
];
const phase59DocFiles = [
  "docs/phase-5-9-approval-evaluator-grant-boundary.md",
  "docs/phase-5-8-runtime-command-exposure-approval.md",
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md"
];
const phase59CrossLinks = [
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md",
  "docs/phase-5-1-controlled-runtime-implementation-approval-handoff.md",
  "docs/phase-5-2-guarded-runtime-implementation-slice.md",
  "docs/phase-5-3-command-surface-approval-preflight.md",
  "docs/phase-5-4-disabled-command-exposure-plan.md",
  "docs/phase-5-4a-jules-review-disposition.md",
  "docs/phase-5-5-default-blocked-runtime-cli.md",
  "docs/phase-5-6-runtime-enable-preconditions.md",
  "docs/phase-5-7-runtime-approval-validation.md",
  "docs/phase-5-8-runtime-command-exposure-approval.md",
  "docs/phase-5-9-approval-evaluator-grant-boundary.md"
];
const phase510DocFiles = [
  "docs/phase-5-10-runtime-host-policy-boundary.md",
  "docs/phase-5-9-approval-evaluator-grant-boundary.md",
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md"
];
const phase510CrossLinks = [
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md",
  "docs/phase-5-1-controlled-runtime-implementation-approval-handoff.md",
  "docs/phase-5-2-guarded-runtime-implementation-slice.md",
  "docs/phase-5-3-command-surface-approval-preflight.md",
  "docs/phase-5-4-disabled-command-exposure-plan.md",
  "docs/phase-5-4a-jules-review-disposition.md",
  "docs/phase-5-5-default-blocked-runtime-cli.md",
  "docs/phase-5-6-runtime-enable-preconditions.md",
  "docs/phase-5-7-runtime-approval-validation.md",
  "docs/phase-5-8-runtime-command-exposure-approval.md",
  "docs/phase-5-9-approval-evaluator-grant-boundary.md",
  "docs/phase-5-10-runtime-host-policy-boundary.md"
];
const phase511DocFiles = [
  "docs/phase-5-11-runtime-stdio-safety-boundary.md",
  "docs/phase-5-10-runtime-host-policy-boundary.md",
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md"
];
const phase511CrossLinks = [
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md",
  "docs/phase-5-1-controlled-runtime-implementation-approval-handoff.md",
  "docs/phase-5-2-guarded-runtime-implementation-slice.md",
  "docs/phase-5-3-command-surface-approval-preflight.md",
  "docs/phase-5-4-disabled-command-exposure-plan.md",
  "docs/phase-5-4a-jules-review-disposition.md",
  "docs/phase-5-5-default-blocked-runtime-cli.md",
  "docs/phase-5-6-runtime-enable-preconditions.md",
  "docs/phase-5-7-runtime-approval-validation.md",
  "docs/phase-5-8-runtime-command-exposure-approval.md",
  "docs/phase-5-9-approval-evaluator-grant-boundary.md",
  "docs/phase-5-10-runtime-host-policy-boundary.md",
  "docs/phase-5-11-runtime-stdio-safety-boundary.md"
];
const phase512DocFiles = [
  "docs/phase-5-12-runtime-transcript-audit-boundary.md",
  "docs/phase-5-11-runtime-stdio-safety-boundary.md",
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md"
];
const phase512CrossLinks = [
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md",
  "docs/phase-5-1-controlled-runtime-implementation-approval-handoff.md",
  "docs/phase-5-2-guarded-runtime-implementation-slice.md",
  "docs/phase-5-3-command-surface-approval-preflight.md",
  "docs/phase-5-4-disabled-command-exposure-plan.md",
  "docs/phase-5-4a-jules-review-disposition.md",
  "docs/phase-5-5-default-blocked-runtime-cli.md",
  "docs/phase-5-6-runtime-enable-preconditions.md",
  "docs/phase-5-7-runtime-approval-validation.md",
  "docs/phase-5-8-runtime-command-exposure-approval.md",
  "docs/phase-5-9-approval-evaluator-grant-boundary.md",
  "docs/phase-5-10-runtime-host-policy-boundary.md",
  "docs/phase-5-11-runtime-stdio-safety-boundary.md",
  "docs/phase-5-12-runtime-transcript-audit-boundary.md"
];
const phase513DocFiles = [
  "docs/phase-5-13-runtime-process-control-boundary.md",
  "docs/phase-5-12-runtime-transcript-audit-boundary.md",
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md"
];
const phase513CrossLinks = [
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md",
  "docs/phase-5-1-controlled-runtime-implementation-approval-handoff.md",
  "docs/phase-5-2-guarded-runtime-implementation-slice.md",
  "docs/phase-5-3-command-surface-approval-preflight.md",
  "docs/phase-5-4-disabled-command-exposure-plan.md",
  "docs/phase-5-4a-jules-review-disposition.md",
  "docs/phase-5-5-default-blocked-runtime-cli.md",
  "docs/phase-5-6-runtime-enable-preconditions.md",
  "docs/phase-5-7-runtime-approval-validation.md",
  "docs/phase-5-8-runtime-command-exposure-approval.md",
  "docs/phase-5-9-approval-evaluator-grant-boundary.md",
  "docs/phase-5-10-runtime-host-policy-boundary.md",
  "docs/phase-5-11-runtime-stdio-safety-boundary.md",
  "docs/phase-5-12-runtime-transcript-audit-boundary.md",
  "docs/phase-5-13-runtime-process-control-boundary.md"
];
const phase514DocFiles = [
  "docs/phase-5-14-runtime-rollback-kill-switch-boundary.md",
  "docs/phase-5-13-runtime-process-control-boundary.md",
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md"
];
const phase514CrossLinks = [
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md",
  "docs/phase-5-1-controlled-runtime-implementation-approval-handoff.md",
  "docs/phase-5-2-guarded-runtime-implementation-slice.md",
  "docs/phase-5-3-command-surface-approval-preflight.md",
  "docs/phase-5-4-disabled-command-exposure-plan.md",
  "docs/phase-5-4a-jules-review-disposition.md",
  "docs/phase-5-5-default-blocked-runtime-cli.md",
  "docs/phase-5-6-runtime-enable-preconditions.md",
  "docs/phase-5-7-runtime-approval-validation.md",
  "docs/phase-5-8-runtime-command-exposure-approval.md",
  "docs/phase-5-9-approval-evaluator-grant-boundary.md",
  "docs/phase-5-10-runtime-host-policy-boundary.md",
  "docs/phase-5-11-runtime-stdio-safety-boundary.md",
  "docs/phase-5-12-runtime-transcript-audit-boundary.md",
  "docs/phase-5-13-runtime-process-control-boundary.md",
  "docs/phase-5-14-runtime-rollback-kill-switch-boundary.md"
];
const phase515DocFiles = [
  "docs/phase-5-15-positive-runtime-smoke-requirement.md",
  "docs/phase-5-14-runtime-rollback-kill-switch-boundary.md",
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md"
];
const phase515CrossLinks = [
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md",
  "docs/phase-5-1-controlled-runtime-implementation-approval-handoff.md",
  "docs/phase-5-2-guarded-runtime-implementation-slice.md",
  "docs/phase-5-3-command-surface-approval-preflight.md",
  "docs/phase-5-4-disabled-command-exposure-plan.md",
  "docs/phase-5-4a-jules-review-disposition.md",
  "docs/phase-5-5-default-blocked-runtime-cli.md",
  "docs/phase-5-6-runtime-enable-preconditions.md",
  "docs/phase-5-7-runtime-approval-validation.md",
  "docs/phase-5-8-runtime-command-exposure-approval.md",
  "docs/phase-5-9-approval-evaluator-grant-boundary.md",
  "docs/phase-5-10-runtime-host-policy-boundary.md",
  "docs/phase-5-11-runtime-stdio-safety-boundary.md",
  "docs/phase-5-12-runtime-transcript-audit-boundary.md",
  "docs/phase-5-13-runtime-process-control-boundary.md",
  "docs/phase-5-14-runtime-rollback-kill-switch-boundary.md",
  "docs/phase-5-15-positive-runtime-smoke-requirement.md"
];
const phase516DocFiles = [
  "docs/phase-5-16-runtime-enable-readiness-checkpoint.md",
  "docs/phase-5-15-positive-runtime-smoke-requirement.md",
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md"
];
const phase516CrossLinks = [
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md",
  "docs/phase-5-1-controlled-runtime-implementation-approval-handoff.md",
  "docs/phase-5-2-guarded-runtime-implementation-slice.md",
  "docs/phase-5-3-command-surface-approval-preflight.md",
  "docs/phase-5-4-disabled-command-exposure-plan.md",
  "docs/phase-5-4a-jules-review-disposition.md",
  "docs/phase-5-5-default-blocked-runtime-cli.md",
  "docs/phase-5-6-runtime-enable-preconditions.md",
  "docs/phase-5-7-runtime-approval-validation.md",
  "docs/phase-5-8-runtime-command-exposure-approval.md",
  "docs/phase-5-9-approval-evaluator-grant-boundary.md",
  "docs/phase-5-10-runtime-host-policy-boundary.md",
  "docs/phase-5-11-runtime-stdio-safety-boundary.md",
  "docs/phase-5-12-runtime-transcript-audit-boundary.md",
  "docs/phase-5-13-runtime-process-control-boundary.md",
  "docs/phase-5-14-runtime-rollback-kill-switch-boundary.md",
  "docs/phase-5-15-positive-runtime-smoke-requirement.md",
  "docs/phase-5-16-runtime-enable-readiness-checkpoint.md"
];
const phase517DocFiles = [
  "docs/phase-5-17-guarded-runtime-implementation-plan.md",
  "docs/phase-5-16-runtime-enable-readiness-checkpoint.md",
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md"
];
const phase517CrossLinks = [
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md",
  "docs/phase-5-1-controlled-runtime-implementation-approval-handoff.md",
  "docs/phase-5-2-guarded-runtime-implementation-slice.md",
  "docs/phase-5-3-command-surface-approval-preflight.md",
  "docs/phase-5-4-disabled-command-exposure-plan.md",
  "docs/phase-5-4a-jules-review-disposition.md",
  "docs/phase-5-5-default-blocked-runtime-cli.md",
  "docs/phase-5-6-runtime-enable-preconditions.md",
  "docs/phase-5-7-runtime-approval-validation.md",
  "docs/phase-5-8-runtime-command-exposure-approval.md",
  "docs/phase-5-9-approval-evaluator-grant-boundary.md",
  "docs/phase-5-10-runtime-host-policy-boundary.md",
  "docs/phase-5-11-runtime-stdio-safety-boundary.md",
  "docs/phase-5-12-runtime-transcript-audit-boundary.md",
  "docs/phase-5-13-runtime-process-control-boundary.md",
  "docs/phase-5-14-runtime-rollback-kill-switch-boundary.md",
  "docs/phase-5-15-positive-runtime-smoke-requirement.md",
  "docs/phase-5-16-runtime-enable-readiness-checkpoint.md",
  "docs/phase-5-17-guarded-runtime-implementation-plan.md"
];
const phase518DocFiles = [
  "docs/phase-5-18-review-only-approval-evaluator-skeleton.md",
  "docs/phase-5-17-guarded-runtime-implementation-plan.md",
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md"
];
const phase518CrossLinks = [
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md",
  "docs/phase-5-17-guarded-runtime-implementation-plan.md",
  "docs/phase-5-18-review-only-approval-evaluator-skeleton.md"
];
const phase519DocFiles = [
  "docs/phase-5-19-approval-prerequisite-reader-hardening.md",
  "docs/phase-5-18-review-only-approval-evaluator-skeleton.md",
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md"
];
const phase519CrossLinks = [
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md",
  "docs/phase-5-18-review-only-approval-evaluator-skeleton.md",
  "docs/phase-5-19-approval-prerequisite-reader-hardening.md"
];
const phase520DocFiles = [
  "docs/phase-5-20-approval-prerequisite-source-ingestion-preflight.md",
  "docs/phase-5-19-approval-prerequisite-reader-hardening.md",
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md"
];
const phase520CrossLinks = [
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md",
  "docs/phase-5-19-approval-prerequisite-reader-hardening.md",
  "docs/phase-5-20-approval-prerequisite-source-ingestion-preflight.md"
];
const phase521DocFiles = [
  "docs/phase-5-21-approval-prerequisite-source-selection.md",
  "docs/phase-5-20-approval-prerequisite-source-ingestion-preflight.md",
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md"
];
const phase521CrossLinks = [
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md",
  "docs/phase-5-20-approval-prerequisite-source-ingestion-preflight.md",
  "docs/phase-5-21-approval-prerequisite-source-selection.md"
];
const phase522DocFiles = [
  "docs/phase-5-22-approval-prerequisite-source-bundle.md",
  "docs/phase-5-21-approval-prerequisite-source-selection.md",
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md"
];
const phase522CrossLinks = [
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md",
  "docs/phase-5-21-approval-prerequisite-source-selection.md",
  "docs/phase-5-22-approval-prerequisite-source-bundle.md"
];
const phase523DocFiles = [
  "docs/phase-5-23-prerequisite-bundle-consumption-checkpoint.md",
  "docs/phase-5-22-approval-prerequisite-source-bundle.md",
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md"
];
const phase523CrossLinks = [
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md",
  "docs/phase-5-22-approval-prerequisite-source-bundle.md",
  "docs/phase-5-23-prerequisite-bundle-consumption-checkpoint.md"
];
const phase524DocFiles = [
  "docs/phase-5-24-prerequisite-evaluation-integration-checkpoint.md",
  "docs/phase-5-23-prerequisite-bundle-consumption-checkpoint.md",
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md"
];
const phase524CrossLinks = [
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md",
  "docs/phase-5-23-prerequisite-bundle-consumption-checkpoint.md",
  "docs/phase-5-24-prerequisite-evaluation-integration-checkpoint.md"
];
const phase525DocFiles = [
  "docs/phase-5-25-non-authorizing-review-artifact-boundary.md",
  "docs/phase-5-24-prerequisite-evaluation-integration-checkpoint.md",
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md"
];
const phase525CrossLinks = [
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md",
  "docs/phase-5-24-prerequisite-evaluation-integration-checkpoint.md",
  "docs/phase-5-25-non-authorizing-review-artifact-boundary.md"
];
const phase526DocFiles = [
  "docs/phase-5-26-review-artifact-evaluator-input-handoff.md",
  "docs/phase-5-25-non-authorizing-review-artifact-boundary.md",
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md"
];
const phase526CrossLinks = [
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md",
  "docs/phase-5-25-non-authorizing-review-artifact-boundary.md",
  "docs/phase-5-26-review-artifact-evaluator-input-handoff.md"
];
const phase527DocFiles = [
  "docs/phase-5-27-approval-evaluator-candidate-intake-checkpoint.md",
  "docs/phase-5-26-review-artifact-evaluator-input-handoff.md",
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md"
];
const phase527CrossLinks = [
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md",
  "docs/phase-5-26-review-artifact-evaluator-input-handoff.md",
  "docs/phase-5-27-approval-evaluator-candidate-intake-checkpoint.md"
];
const phase528DocFiles = [
  "docs/phase-5-28-review-only-evaluator-preflight-checkpoint.md",
  "docs/phase-5-27-approval-evaluator-candidate-intake-checkpoint.md",
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md"
];
const phase528CrossLinks = [
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md",
  "docs/phase-5-27-approval-evaluator-candidate-intake-checkpoint.md",
  "docs/phase-5-28-review-only-evaluator-preflight-checkpoint.md"
];
const phase529DocFiles = [
  "docs/phase-5-29-non-authorizing-evaluator-decision-candidate-boundary.md",
  "docs/phase-5-28-review-only-evaluator-preflight-checkpoint.md",
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md"
];
const phase529CrossLinks = [
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md",
  "docs/phase-5-28-review-only-evaluator-preflight-checkpoint.md",
  "docs/phase-5-29-non-authorizing-evaluator-decision-candidate-boundary.md"
];
const phase529ExpectedCaseIds = [
  "missing-non-authorizing-evaluator-decision-candidate-input-rejected",
  "malformed-non-authorizing-evaluator-decision-candidate-input-rejected",
  "malformed-non-authorizing-evaluator-decision-candidate-invalid-reviewed-at-rejected",
  "empty-non-authorizing-evaluator-decision-candidate-input-rejected",
  "conflicting-non-authorizing-evaluator-decision-candidate-input-rejected",
  "stale-non-authorizing-evaluator-decision-candidate-input-rejected",
  "revoked-non-authorizing-evaluator-decision-candidate-input-rejected",
  "unknown-non-authorizing-evaluator-decision-candidate-input-rejected",
  "duplicate-invalid-non-authorizing-evaluator-decision-candidate-input-rejected",
  "authorizing-looking-non-authorizing-evaluator-decision-candidate-input-rejected",
  "grant-looking-non-authorizing-evaluator-decision-candidate-input-rejected",
  "approval-decision-looking-non-authorizing-evaluator-decision-candidate-input-rejected",
  "approval-grant-looking-non-authorizing-evaluator-decision-candidate-input-rejected",
  "runtime-permission-looking-non-authorizing-evaluator-decision-candidate-input-rejected",
  "command-exposure-looking-non-authorizing-evaluator-decision-candidate-input-rejected",
  "evaluator-execution-looking-non-authorizing-evaluator-decision-candidate-input-rejected",
  "runtime-effect-true-non-authorizing-evaluator-decision-candidate-input-rejected",
  "process-flag-true-non-authorizing-evaluator-decision-candidate-input-rejected",
  "unsafe-top-level-non-authorizing-evaluator-decision-candidate-input-rejected",
  "unsafe-nested-decision-preflight-checkpoint-data-non-authorizing-evaluator-decision-candidate-input-rejected",
  "execution-signal-looking-non-authorizing-evaluator-decision-candidate-input-rejected",
  "valid-non-authorizing-evaluator-decision-candidate-state"
];
const phase530DocFiles = [
  "docs/phase-5-30-non-authorizing-evaluator-decision-candidate-inspection-artifact.md",
  "docs/phase-5-29-non-authorizing-evaluator-decision-candidate-boundary.md",
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md"
];
const phase530CrossLinks = [
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md",
  "docs/phase-5-29-non-authorizing-evaluator-decision-candidate-boundary.md",
  "docs/phase-5-30-non-authorizing-evaluator-decision-candidate-inspection-artifact.md"
];
const phase530ExpectedCaseIds = [
  "missing-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected",
  "malformed-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected",
  "malformed-non-authorizing-evaluator-decision-candidate-inspection-artifact-invalid-reviewed-at-rejected",
  "empty-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected",
  "conflicting-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected",
  "stale-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected",
  "revoked-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected",
  "unknown-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected",
  "duplicate-invalid-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected",
  "authorizing-looking-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected",
  "grant-looking-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected",
  "approval-decision-looking-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected",
  "approval-grant-looking-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected",
  "runtime-permission-looking-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected",
  "command-exposure-looking-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected",
  "evaluator-execution-looking-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected",
  "evaluator-result-looking-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected",
  "runtime-effect-true-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected",
  "process-flag-true-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected",
  "unsafe-top-level-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected",
  "unsafe-nested-decision-candidate-report-artifact-data-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected",
  "execution-signal-looking-non-authorizing-evaluator-decision-candidate-inspection-artifact-input-rejected",
  "valid-non-authorizing-evaluator-decision-candidate-inspection-artifact"
];
const phase531DocFiles = [
  "docs/phase-5-31-human-tool-inspection-disposition-boundary.md",
  "docs/phase-5-30-non-authorizing-evaluator-decision-candidate-inspection-artifact.md",
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md"
];
const phase531CrossLinks = [
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md",
  "docs/phase-5-30-non-authorizing-evaluator-decision-candidate-inspection-artifact.md",
  "docs/phase-5-31-human-tool-inspection-disposition-boundary.md"
];
const phase531ExpectedCaseIds = [
  "missing-human-tool-inspection-disposition-boundary-input-rejected",
  "malformed-human-tool-inspection-disposition-boundary-input-rejected",
  "malformed-human-tool-inspection-disposition-boundary-invalid-reviewed-at-rejected",
  "empty-human-tool-inspection-disposition-boundary-input-rejected",
  "conflicting-human-tool-inspection-disposition-boundary-input-rejected",
  "stale-human-tool-inspection-disposition-boundary-input-rejected",
  "revoked-human-tool-inspection-disposition-boundary-input-rejected",
  "unknown-human-tool-inspection-disposition-boundary-input-rejected",
  "duplicate-invalid-human-tool-inspection-disposition-boundary-input-rejected",
  "authorizing-looking-human-tool-inspection-disposition-boundary-input-rejected",
  "grant-looking-human-tool-inspection-disposition-boundary-input-rejected",
  "approval-decision-looking-human-tool-inspection-disposition-boundary-input-rejected",
  "approval-grant-looking-human-tool-inspection-disposition-boundary-input-rejected",
  "evaluator-result-looking-human-tool-inspection-disposition-boundary-input-rejected",
  "evaluator-execution-looking-human-tool-inspection-disposition-boundary-input-rejected",
  "runtime-permission-looking-human-tool-inspection-disposition-boundary-input-rejected",
  "command-exposure-looking-human-tool-inspection-disposition-boundary-input-rejected",
  "runtime-effect-true-human-tool-inspection-disposition-boundary-input-rejected",
  "process-flag-true-human-tool-inspection-disposition-boundary-input-rejected",
  "unsafe-top-level-human-tool-inspection-disposition-boundary-input-rejected",
  "unsafe-nested-inspection-artifact-disposition-data-human-tool-inspection-disposition-boundary-input-rejected",
  "execution-signal-looking-human-tool-inspection-disposition-boundary-input-rejected",
  "valid-human-tool-inspection-disposition-boundary"
];
const phase532DocFiles = [
  "docs/phase-5-32-review-only-disposition-aggregation-checkpoint.md",
  "docs/phase-5-31-human-tool-inspection-disposition-boundary.md",
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md"
];
const phase532CrossLinks = [
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md",
  "docs/phase-5-31-human-tool-inspection-disposition-boundary.md",
  "docs/phase-5-32-review-only-disposition-aggregation-checkpoint.md"
];
const phase532ExpectedCaseIds = [
  "missing-review-only-disposition-aggregation-checkpoint-input-rejected",
  "malformed-review-only-disposition-aggregation-checkpoint-input-rejected",
  "malformed-review-only-disposition-aggregation-checkpoint-invalid-reviewed-at-rejected",
  "empty-review-only-disposition-aggregation-checkpoint-input-rejected",
  "conflicting-review-only-disposition-aggregation-checkpoint-input-rejected",
  "stale-review-only-disposition-aggregation-checkpoint-input-rejected",
  "revoked-review-only-disposition-aggregation-checkpoint-input-rejected",
  "unknown-review-only-disposition-aggregation-checkpoint-input-rejected",
  "duplicate-invalid-review-only-disposition-aggregation-checkpoint-input-rejected",
  "authorizing-looking-review-only-disposition-aggregation-checkpoint-input-rejected",
  "grant-looking-review-only-disposition-aggregation-checkpoint-input-rejected",
  "approval-decision-looking-review-only-disposition-aggregation-checkpoint-input-rejected",
  "approval-grant-looking-review-only-disposition-aggregation-checkpoint-input-rejected",
  "evaluator-result-looking-review-only-disposition-aggregation-checkpoint-input-rejected",
  "evaluator-execution-looking-review-only-disposition-aggregation-checkpoint-input-rejected",
  "reviewer-routing-looking-review-only-disposition-aggregation-checkpoint-input-rejected",
  "runtime-permission-looking-review-only-disposition-aggregation-checkpoint-input-rejected",
  "command-exposure-looking-review-only-disposition-aggregation-checkpoint-input-rejected",
  "runtime-effect-true-review-only-disposition-aggregation-checkpoint-input-rejected",
  "process-flag-true-review-only-disposition-aggregation-checkpoint-input-rejected",
  "unsafe-top-level-review-only-disposition-aggregation-checkpoint-input-rejected",
  "unsafe-nested-disposition-aggregation-data-review-only-disposition-aggregation-checkpoint-input-rejected",
  "execution-signal-looking-review-only-disposition-aggregation-checkpoint-input-rejected",
  "valid-review-only-disposition-aggregation-checkpoint"
];
const phase533DocFiles = [
  "docs/phase-5-33-review-only-aggregation-inspection-handoff.md",
  "docs/phase-5-32-review-only-disposition-aggregation-checkpoint.md",
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md"
];
const phase533CrossLinks = [
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md",
  "docs/phase-5-32-review-only-disposition-aggregation-checkpoint.md",
  "docs/phase-5-33-review-only-aggregation-inspection-handoff.md"
];
const phase533ExpectedCaseIds = [
  "missing-review-only-aggregation-inspection-handoff-input-rejected",
  "malformed-review-only-aggregation-inspection-handoff-input-rejected",
  "malformed-review-only-aggregation-inspection-handoff-invalid-reviewed-at-rejected",
  "empty-review-only-aggregation-inspection-handoff-input-rejected",
  "conflicting-review-only-aggregation-inspection-handoff-input-rejected",
  "stale-review-only-aggregation-inspection-handoff-input-rejected",
  "revoked-review-only-aggregation-inspection-handoff-input-rejected",
  "unknown-review-only-aggregation-inspection-handoff-input-rejected",
  "duplicate-invalid-review-only-aggregation-inspection-handoff-input-rejected",
  "authorizing-looking-review-only-aggregation-inspection-handoff-input-rejected",
  "grant-looking-review-only-aggregation-inspection-handoff-input-rejected",
  "approval-decision-looking-review-only-aggregation-inspection-handoff-input-rejected",
  "approval-grant-looking-review-only-aggregation-inspection-handoff-input-rejected",
  "evaluator-result-looking-review-only-aggregation-inspection-handoff-input-rejected",
  "evaluator-execution-looking-review-only-aggregation-inspection-handoff-input-rejected",
  "reviewer-routing-looking-review-only-aggregation-inspection-handoff-input-rejected",
  "runtime-permission-looking-review-only-aggregation-inspection-handoff-input-rejected",
  "command-exposure-looking-review-only-aggregation-inspection-handoff-input-rejected",
  "runtime-effect-true-review-only-aggregation-inspection-handoff-input-rejected",
  "process-flag-true-review-only-aggregation-inspection-handoff-input-rejected",
  "unsafe-top-level-review-only-aggregation-inspection-handoff-input-rejected",
  "unsafe-nested-aggregation-inspection-handoff-data-review-only-aggregation-inspection-handoff-input-rejected",
  "execution-signal-looking-review-only-aggregation-inspection-handoff-input-rejected",
  "valid-review-only-aggregation-inspection-handoff"
];
const phase534DocFiles = [
  "docs/phase-5-34-review-only-handoff-readiness-artifact.md",
  "docs/phase-5-33-review-only-aggregation-inspection-handoff.md",
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md"
];
const phase534CrossLinks = [
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md",
  "docs/phase-5-33-review-only-aggregation-inspection-handoff.md",
  "docs/phase-5-34-review-only-handoff-readiness-artifact.md"
];
const phase534ExpectedCaseIds = [
  "missing-review-only-handoff-readiness-artifact-input-rejected",
  "malformed-review-only-handoff-readiness-artifact-input-rejected",
  "malformed-review-only-handoff-readiness-artifact-invalid-reviewed-at-rejected",
  "empty-review-only-handoff-readiness-artifact-input-rejected",
  "conflicting-review-only-handoff-readiness-artifact-input-rejected",
  "stale-review-only-handoff-readiness-artifact-input-rejected",
  "revoked-review-only-handoff-readiness-artifact-input-rejected",
  "unknown-review-only-handoff-readiness-artifact-input-rejected",
  "duplicate-invalid-review-only-handoff-readiness-artifact-input-rejected",
  "authorizing-looking-review-only-handoff-readiness-artifact-input-rejected",
  "grant-looking-review-only-handoff-readiness-artifact-input-rejected",
  "approval-decision-looking-review-only-handoff-readiness-artifact-input-rejected",
  "approval-grant-looking-review-only-handoff-readiness-artifact-input-rejected",
  "evaluator-result-looking-review-only-handoff-readiness-artifact-input-rejected",
  "evaluator-execution-looking-review-only-handoff-readiness-artifact-input-rejected",
  "reviewer-routing-looking-review-only-handoff-readiness-artifact-input-rejected",
  "reviewer-assignment-looking-review-only-handoff-readiness-artifact-input-rejected",
  "runtime-permission-looking-review-only-handoff-readiness-artifact-input-rejected",
  "command-exposure-looking-review-only-handoff-readiness-artifact-input-rejected",
  "runtime-effect-true-review-only-handoff-readiness-artifact-input-rejected",
  "process-flag-true-review-only-handoff-readiness-artifact-input-rejected",
  "unsafe-top-level-review-only-handoff-readiness-artifact-input-rejected",
  "unsafe-nested-handoff-readiness-artifact-data-review-only-handoff-readiness-artifact-input-rejected",
  "execution-signal-looking-review-only-handoff-readiness-artifact-input-rejected",
  "valid-review-only-handoff-readiness-artifact"
];
const phase535DocFiles = [
  "docs/phase-5-35-review-only-readiness-inspection-checkpoint.md",
  "docs/phase-5-34-review-only-handoff-readiness-artifact.md",
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md"
];
const phase535CrossLinks = [
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md",
  "docs/phase-5-34-review-only-handoff-readiness-artifact.md",
  "docs/phase-5-35-review-only-readiness-inspection-checkpoint.md"
];
const phase535ExpectedCaseIds = [
  "missing-review-only-readiness-inspection-checkpoint-input-rejected",
  "malformed-review-only-readiness-inspection-checkpoint-input-rejected",
  "malformed-review-only-readiness-inspection-checkpoint-invalid-reviewed-at-rejected",
  "empty-review-only-readiness-inspection-checkpoint-input-rejected",
  "conflicting-review-only-readiness-inspection-checkpoint-input-rejected",
  "stale-review-only-readiness-inspection-checkpoint-input-rejected",
  "revoked-review-only-readiness-inspection-checkpoint-input-rejected",
  "unknown-review-only-readiness-inspection-checkpoint-input-rejected",
  "duplicate-invalid-review-only-readiness-inspection-checkpoint-input-rejected",
  "authorizing-looking-review-only-readiness-inspection-checkpoint-input-rejected",
  "grant-looking-review-only-readiness-inspection-checkpoint-input-rejected",
  "approval-decision-looking-review-only-readiness-inspection-checkpoint-input-rejected",
  "approval-grant-looking-review-only-readiness-inspection-checkpoint-input-rejected",
  "evaluator-result-looking-review-only-readiness-inspection-checkpoint-input-rejected",
  "evaluator-execution-looking-review-only-readiness-inspection-checkpoint-input-rejected",
  "reviewer-routing-looking-review-only-readiness-inspection-checkpoint-input-rejected",
  "reviewer-assignment-looking-review-only-readiness-inspection-checkpoint-input-rejected",
  "runtime-permission-looking-review-only-readiness-inspection-checkpoint-input-rejected",
  "command-exposure-looking-review-only-readiness-inspection-checkpoint-input-rejected",
  "runtime-effect-true-review-only-readiness-inspection-checkpoint-input-rejected",
  "process-flag-true-review-only-readiness-inspection-checkpoint-input-rejected",
  "unsafe-top-level-review-only-readiness-inspection-checkpoint-input-rejected",
  "unsafe-nested-readiness-inspection-checkpoint-data-review-only-readiness-inspection-checkpoint-input-rejected",
  "execution-signal-looking-review-only-readiness-inspection-checkpoint-input-rejected",
  "valid-review-only-readiness-inspection-checkpoint"
];
const phase536DocFiles = [
  "docs/phase-5-36-review-only-readiness-handoff-disposition-boundary.md",
  "docs/phase-5-35-review-only-readiness-inspection-checkpoint.md",
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md"
];
const phase536CrossLinks = [
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md",
  "docs/phase-5-35-review-only-readiness-inspection-checkpoint.md",
  "docs/phase-5-36-review-only-readiness-handoff-disposition-boundary.md"
];
const phase536ExpectedCaseIds = [
  "missing-review-only-readiness-handoff-disposition-input-rejected",
  "malformed-review-only-readiness-handoff-disposition-input-rejected",
  "malformed-review-only-readiness-handoff-disposition-invalid-reviewed-at-rejected",
  "empty-review-only-readiness-handoff-disposition-input-rejected",
  "conflicting-review-only-readiness-handoff-disposition-input-rejected",
  "stale-review-only-readiness-handoff-disposition-input-rejected",
  "revoked-review-only-readiness-handoff-disposition-input-rejected",
  "unknown-review-only-readiness-handoff-disposition-input-rejected",
  "duplicate-invalid-review-only-readiness-handoff-disposition-input-rejected",
  "authorizing-looking-review-only-readiness-handoff-disposition-input-rejected",
  "grant-looking-review-only-readiness-handoff-disposition-input-rejected",
  "approval-decision-looking-review-only-readiness-handoff-disposition-input-rejected",
  "approval-grant-looking-review-only-readiness-handoff-disposition-input-rejected",
  "evaluator-result-looking-review-only-readiness-handoff-disposition-input-rejected",
  "evaluator-execution-looking-review-only-readiness-handoff-disposition-input-rejected",
  "reviewer-routing-looking-review-only-readiness-handoff-disposition-input-rejected",
  "reviewer-assignment-looking-review-only-readiness-handoff-disposition-input-rejected",
  "runtime-permission-looking-review-only-readiness-handoff-disposition-input-rejected",
  "command-exposure-looking-review-only-readiness-handoff-disposition-input-rejected",
  "runtime-effect-true-review-only-readiness-handoff-disposition-input-rejected",
  "process-flag-true-review-only-readiness-handoff-disposition-input-rejected",
  "unsafe-top-level-review-only-readiness-handoff-disposition-input-rejected",
  "unsafe-nested-readiness-handoff-disposition-data-review-only-readiness-handoff-disposition-input-rejected",
  "execution-signal-looking-review-only-readiness-handoff-disposition-input-rejected",
  "valid-review-only-readiness-handoff-disposition"
];
const phase537DocFiles = [
  "docs/phase-5-37-review-only-handoff-disposition-inspection-checkpoint.md",
  "docs/phase-5-36-review-only-readiness-handoff-disposition-boundary.md",
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md"
];
const phase537CrossLinks = [
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md",
  "docs/phase-5-36-review-only-readiness-handoff-disposition-boundary.md",
  "docs/phase-5-37-review-only-handoff-disposition-inspection-checkpoint.md"
];
const phase537ExpectedCaseIds = [
  "missing-review-only-handoff-disposition-inspection-checkpoint-input-rejected",
  "malformed-review-only-handoff-disposition-inspection-checkpoint-input-rejected",
  "malformed-review-only-handoff-disposition-inspection-checkpoint-invalid-reviewed-at-rejected",
  "empty-review-only-handoff-disposition-inspection-checkpoint-input-rejected",
  "conflicting-review-only-handoff-disposition-inspection-checkpoint-input-rejected",
  "stale-review-only-handoff-disposition-inspection-checkpoint-input-rejected",
  "revoked-review-only-handoff-disposition-inspection-checkpoint-input-rejected",
  "unknown-review-only-handoff-disposition-inspection-checkpoint-input-rejected",
  "duplicate-invalid-review-only-handoff-disposition-inspection-checkpoint-input-rejected",
  "authorizing-looking-review-only-handoff-disposition-inspection-checkpoint-input-rejected",
  "grant-looking-review-only-handoff-disposition-inspection-checkpoint-input-rejected",
  "approval-decision-looking-review-only-handoff-disposition-inspection-checkpoint-input-rejected",
  "approval-grant-looking-review-only-handoff-disposition-inspection-checkpoint-input-rejected",
  "evaluator-result-looking-review-only-handoff-disposition-inspection-checkpoint-input-rejected",
  "evaluator-execution-looking-review-only-handoff-disposition-inspection-checkpoint-input-rejected",
  "reviewer-routing-looking-review-only-handoff-disposition-inspection-checkpoint-input-rejected",
  "reviewer-assignment-looking-review-only-handoff-disposition-inspection-checkpoint-input-rejected",
  "runtime-permission-looking-review-only-handoff-disposition-inspection-checkpoint-input-rejected",
  "command-exposure-looking-review-only-handoff-disposition-inspection-checkpoint-input-rejected",
  "runtime-effect-true-review-only-handoff-disposition-inspection-checkpoint-input-rejected",
  "process-flag-true-review-only-handoff-disposition-inspection-checkpoint-input-rejected",
  "unsafe-top-level-review-only-handoff-disposition-inspection-checkpoint-input-rejected",
  "unsafe-nested-handoff-disposition-inspection-checkpoint-data-review-only-handoff-disposition-inspection-checkpoint-input-rejected",
  "execution-signal-looking-review-only-handoff-disposition-inspection-checkpoint-input-rejected",
  "valid-review-only-handoff-disposition-inspection-checkpoint"
];
const phase538DocFiles = [
  "docs/phase-5-38-review-only-inspection-handoff-metadata-boundary.md",
  "docs/phase-5-37-review-only-handoff-disposition-inspection-checkpoint.md",
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md"
];
const phase538CrossLinks = [
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md",
  "docs/phase-5-37-review-only-handoff-disposition-inspection-checkpoint.md",
  "docs/phase-5-38-review-only-inspection-handoff-metadata-boundary.md"
];
const phase538ExpectedCaseIds = [
  "missing-review-only-inspection-handoff-metadata-boundary-input-rejected",
  "malformed-review-only-inspection-handoff-metadata-boundary-input-rejected",
  "malformed-review-only-inspection-handoff-metadata-boundary-invalid-reviewed-at-rejected",
  "empty-review-only-inspection-handoff-metadata-boundary-input-rejected",
  "conflicting-review-only-inspection-handoff-metadata-boundary-input-rejected",
  "stale-review-only-inspection-handoff-metadata-boundary-input-rejected",
  "revoked-review-only-inspection-handoff-metadata-boundary-input-rejected",
  "unknown-review-only-inspection-handoff-metadata-boundary-input-rejected",
  "duplicate-invalid-review-only-inspection-handoff-metadata-boundary-input-rejected",
  "authorizing-looking-review-only-inspection-handoff-metadata-boundary-input-rejected",
  "grant-looking-review-only-inspection-handoff-metadata-boundary-input-rejected",
  "approval-decision-looking-review-only-inspection-handoff-metadata-boundary-input-rejected",
  "approval-grant-looking-review-only-inspection-handoff-metadata-boundary-input-rejected",
  "evaluator-result-looking-review-only-inspection-handoff-metadata-boundary-input-rejected",
  "evaluator-execution-looking-review-only-inspection-handoff-metadata-boundary-input-rejected",
  "reviewer-routing-looking-review-only-inspection-handoff-metadata-boundary-input-rejected",
  "reviewer-assignment-looking-review-only-inspection-handoff-metadata-boundary-input-rejected",
  "runtime-permission-looking-review-only-inspection-handoff-metadata-boundary-input-rejected",
  "command-exposure-looking-review-only-inspection-handoff-metadata-boundary-input-rejected",
  "runtime-effect-true-review-only-inspection-handoff-metadata-boundary-input-rejected",
  "process-flag-true-review-only-inspection-handoff-metadata-boundary-input-rejected",
  "unsafe-top-level-review-only-inspection-handoff-metadata-boundary-input-rejected",
  "unsafe-nested-checkpoint-inspection-handoff-metadata-review-only-inspection-handoff-metadata-boundary-input-rejected",
  "execution-signal-looking-review-only-inspection-handoff-metadata-boundary-input-rejected",
  "valid-review-only-inspection-handoff-metadata-boundary"
];
const phase519ExpectedTrueSafetyFlagNames = [
  "phase519ApprovalPrerequisiteReaderHardeningRecorded",
  "phase519ReaderReviewOnly",
  "phase519MissingPrerequisiteRecordsRejected",
  "phase519MalformedPrerequisiteRecordsRejected",
  "phase519RevokedPrerequisiteRecordsRejected",
  "phase519ValidPrerequisiteRecordsRecognizedForReviewOnly",
  "phase519DuplicatePrerequisiteRecordsRejected",
  "phase519StalePrerequisiteRecordsRejected",
  "phase519UnknownPrerequisiteRecordsRejected",
  "phase519ServeRuntimeStillDefaultBlocked"
];
const phase519ExpectedFalseSafetyFlagNames = [
  "phase519ReaderAuthoritative",
  "phase519ApprovalGrantProduced",
  "phase519ApprovalGrantPersisted",
  "phase519RuntimeEnabled",
  "phase519RuntimeStarted",
  "phase519RuntimeReady",
  "phase519RuntimeCommandEnabled",
  "phase519RuntimeCommandExposureEnabled",
  "phase519RuntimeExecutionEnabled",
  "phase519RuntimeExecuted",
  "phase519DryRunBypassesBlock",
  "phase519CanEnableRuntime",
  "phase519CliSourceChanged",
  "phase519RustSourceChanged",
  "phase519LiveStdinLoopEnabled",
  "phase519RuntimeStdoutWriterEnabled",
  "phase519RuntimeStderrWriterEnabled",
  "phase519ProcessSpawnEnabled",
  "phase519ProcessTerminationEnabled",
  "phase519RuntimeSupervisionEnabled",
  "phase519RuntimeTranscriptWritePerformed",
  "phase519RuntimeAuditWritePerformed",
  "phase519AdapterRuntimeBehaviorEnabled",
  "phase519ContentFabricRuntimeBehaviorEnabled",
  "phase519WebSocketHttpSurfaceEnabled"
];
const phase519SafetyFlagNames = [
  ...phase519ExpectedTrueSafetyFlagNames,
  ...phase519ExpectedFalseSafetyFlagNames
];
const phase520ExpectedTrueSafetyFlagNames = [
  "phase520ApprovalPrerequisiteSourcePreflightRecorded",
  "phase520PreflightReviewOnly",
  "phase520MissingSourceInputsRejected",
  "phase520MalformedSourceInputsRejected",
  "phase520EmptySourceInputsRejected",
  "phase520DuplicateSourceInputsRejected",
  "phase520StalePrerequisiteSourceInputsRejected",
  "phase520UnknownPrerequisiteSourceInputsRejected",
  "phase520RevokedPrerequisiteSourceInputsRejected",
  "phase520ValidSourceInputsRecognizedForReaderOnly",
  "phase520RejectedSourcesFailClosed",
  "phase520AcceptedSourcesMayFeedReviewReader",
  "phase520ServeRuntimeStillDefaultBlocked"
];
const phase520ExpectedFalseSafetyFlagNames = [
  "phase520PreflightAuthoritative",
  "phase520ApprovalGrantProduced",
  "phase520ApprovalGrantPersisted",
  "phase520RuntimeEnabled",
  "phase520RuntimeStarted",
  "phase520RuntimeReady",
  "phase520RuntimeCommandEnabled",
  "phase520RuntimeCommandExposureEnabled",
  "phase520RuntimeExecutionEnabled",
  "phase520RuntimeExecuted",
  "phase520DryRunBypassesBlock",
  "phase520CanEnableRuntime",
  "phase520CliSourceChanged",
  "phase520RustSourceChanged",
  "phase520FilesystemWatcherEnabled",
  "phase520ExternalSourceLookupEnabled",
  "phase520SecretsEnvIngestionEnabled",
  "phase520LiveStdinLoopEnabled",
  "phase520RuntimeStdoutWriterEnabled",
  "phase520RuntimeStderrWriterEnabled",
  "phase520ProcessSpawnEnabled",
  "phase520ProcessTerminationEnabled",
  "phase520RuntimeSupervisionEnabled",
  "phase520RuntimeTranscriptWritePerformed",
  "phase520RuntimeAuditWritePerformed",
  "phase520AdapterRuntimeBehaviorEnabled",
  "phase520ContentFabricRuntimeBehaviorEnabled",
  "phase520WebSocketHttpSurfaceEnabled"
];
const phase520SafetyFlagNames = [
  ...phase520ExpectedTrueSafetyFlagNames,
  ...phase520ExpectedFalseSafetyFlagNames
];
const phase521ExpectedTrueSafetyFlagNames = [
  "phase521ApprovalPrerequisiteSourceSelectionRecorded",
  "phase521SelectionReviewOnly",
  "phase521MissingSourcesRejected",
  "phase521MultipleValidSourcesHandledDeterministically",
  "phase521ConflictingValidSourcesRejected",
  "phase521DuplicateEquivalentSourcesHandledDeterministically",
  "phase521StaleSourcesRejected",
  "phase521RevokedSourcesRejected",
  "phase521UnknownSourcesRejected",
  "phase521MalformedSourcesRejected",
  "phase521EmptySourcesRejected",
  "phase521SelectedSourceFeedsReviewReaderOnly",
  "phase521ServeRuntimeStillDefaultBlocked"
];
const phase521ExpectedFalseSafetyFlagNames = [
  "phase521SelectionAuthoritative",
  "phase521ApprovalGrantProduced",
  "phase521ApprovalGrantPersisted",
  "phase521RuntimeEnabled",
  "phase521RuntimeStarted",
  "phase521RuntimeReady",
  "phase521RuntimeCommandEnabled",
  "phase521RuntimeCommandExposureEnabled",
  "phase521RuntimeExecutionEnabled",
  "phase521RuntimeExecuted",
  "phase521DryRunBypassesBlock",
  "phase521CanEnableRuntime",
  "phase521CliSourceChanged",
  "phase521RustSourceChanged",
  "phase521FilesystemWatcherEnabled",
  "phase521ExternalSourceLookupEnabled",
  "phase521SecretsEnvIngestionEnabled",
  "phase521LiveStdinLoopEnabled",
  "phase521RuntimeStdoutWriterEnabled",
  "phase521RuntimeStderrWriterEnabled",
  "phase521ProcessSpawnEnabled",
  "phase521ProcessTerminationEnabled",
  "phase521RuntimeSupervisionEnabled",
  "phase521RuntimeTranscriptWritePerformed",
  "phase521RuntimeAuditWritePerformed",
  "phase521AdapterRuntimeBehaviorEnabled",
  "phase521ContentFabricRuntimeBehaviorEnabled",
  "phase521WebSocketHttpSurfaceEnabled"
];
const phase521SafetyFlagNames = [
  ...phase521ExpectedTrueSafetyFlagNames,
  ...phase521ExpectedFalseSafetyFlagNames
];
const phase522ExpectedTrueSafetyFlagNames = [
  "phase522ApprovalPrerequisiteSourceBundleRecorded",
  "phase522BundleReviewOnly",
  "phase522MissingBundlePartsRejected",
  "phase522MissingRequiredBundlePartsRejected",
  "phase522MalformedBundlePartsRejected",
  "phase522DuplicateBundlePartsHandledDeterministically",
  "phase522ConflictingBundlePartsRejected",
  "phase522StaleSourcesRejected",
  "phase522RevokedSourcesRejected",
  "phase522UnknownSourcesRejected",
  "phase522MalformedSourcesRejected",
  "phase522EmptySourcesRejected",
  "phase522ValidBundleFeedsReviewReaderOnly",
  "phase522ServeRuntimeStillDefaultBlocked"
];
const phase522ExpectedFalseSafetyFlagNames = [
  "phase522BundleAuthoritative",
  "phase522ApprovalGrantProduced",
  "phase522ApprovalGrantPersisted",
  "phase522RuntimeEnabled",
  "phase522RuntimeStarted",
  "phase522RuntimeReady",
  "phase522RuntimeCommandEnabled",
  "phase522RuntimeCommandExposureEnabled",
  "phase522RuntimeExecutionEnabled",
  "phase522RuntimeExecuted",
  "phase522DryRunBypassesBlock",
  "phase522CanEnableRuntime",
  "phase522CliSourceChanged",
  "phase522RustSourceChanged",
  "phase522FilesystemWatcherEnabled",
  "phase522ExternalSourceLookupEnabled",
  "phase522SecretsEnvIngestionEnabled",
  "phase522LiveStdinLoopEnabled",
  "phase522RuntimeStdoutWriterEnabled",
  "phase522RuntimeStderrWriterEnabled",
  "phase522ProcessSpawnEnabled",
  "phase522ProcessTerminationEnabled",
  "phase522RuntimeSupervisionEnabled",
  "phase522RuntimeTranscriptWritePerformed",
  "phase522RuntimeAuditWritePerformed",
  "phase522AdapterRuntimeBehaviorEnabled",
  "phase522ContentFabricRuntimeBehaviorEnabled",
  "phase522WebSocketHttpSurfaceEnabled"
];
const phase522SafetyFlagNames = [
  ...phase522ExpectedTrueSafetyFlagNames,
  ...phase522ExpectedFalseSafetyFlagNames
];
const phase523ExpectedTrueSafetyFlagNames = [
  "phase523PrerequisiteBundleConsumptionCheckpointRecorded",
  "phase523CheckpointReviewOnly",
  "phase523MissingBundleRejected",
  "phase523MalformedBundleRejected",
  "phase523ConflictingBundleRejected",
  "phase523ValidBundleSummarizedForReviewOnlyEvaluation",
  "phase523BundleConsumptionReturnsCheckpointStateOnly",
  "phase523ServeRuntimeStillDefaultBlocked"
];
const phase523ExpectedFalseSafetyFlagNames = [
  "phase523CheckpointAuthoritative",
  "phase523ApprovalGrantProduced",
  "phase523ApprovalGrantPersisted",
  "phase523RuntimeEnabled",
  "phase523RuntimeStarted",
  "phase523RuntimeReady",
  "phase523RuntimeCommandEnabled",
  "phase523RuntimeCommandExposureEnabled",
  "phase523RuntimeExecutionEnabled",
  "phase523RuntimeExecuted",
  "phase523DryRunBypassesBlock",
  "phase523CanEnableRuntime",
  "phase523CliSourceChanged",
  "phase523RustSourceChanged",
  "phase523FilesystemWatcherEnabled",
  "phase523ExternalSourceLookupEnabled",
  "phase523SecretsEnvIngestionEnabled",
  "phase523LiveStdinLoopEnabled",
  "phase523RuntimeStdoutWriterEnabled",
  "phase523RuntimeStderrWriterEnabled",
  "phase523ProcessSpawnEnabled",
  "phase523ProcessTerminationEnabled",
  "phase523RuntimeSupervisionEnabled",
  "phase523RuntimeTranscriptWritePerformed",
  "phase523RuntimeAuditWritePerformed",
  "phase523AdapterRuntimeBehaviorEnabled",
  "phase523ContentFabricRuntimeBehaviorEnabled",
  "phase523WebSocketHttpSurfaceEnabled"
];
const phase523SafetyFlagNames = [
  ...phase523ExpectedTrueSafetyFlagNames,
  ...phase523ExpectedFalseSafetyFlagNames
];
const phase524ExpectedTrueSafetyFlagNames = [
  "phase524PrerequisiteEvaluationIntegrationCheckpointRecorded",
  "phase524CheckpointReviewOnly",
  "phase524SourceIngestionConnected",
  "phase524SourceSelectionConnected",
  "phase524SourceBundlingConnected",
  "phase524BundleConsumptionConnected",
  "phase524ReviewOnlyEvaluatorSummaryConnected",
  "phase524MissingPrerequisiteInputsRejected",
  "phase524MalformedPrerequisiteInputsRejected",
  "phase524EmptyPrerequisiteInputsRejected",
  "phase524ConflictingPrerequisiteInputsRejected",
  "phase524StalePrerequisiteInputsRejected",
  "phase524RevokedPrerequisiteInputsRejected",
  "phase524UnknownPrerequisiteInputsRejected",
  "phase524DuplicatePrerequisiteInputsRejected",
  "phase524ValidPrerequisiteInputsProduceReviewSummary",
  "phase524ServeRuntimeStillDefaultBlocked"
];
const phase524ExpectedFalseSafetyFlagNames = [
  "phase524CheckpointAuthoritative",
  "phase524ReviewSummaryIsApprovalGrant",
  "phase524ApprovalGrantProduced",
  "phase524ApprovalGrantPersisted",
  "phase524RuntimeEnabled",
  "phase524RuntimeStarted",
  "phase524RuntimeReady",
  "phase524RuntimeCommandEnabled",
  "phase524RuntimeCommandExposureEnabled",
  "phase524RuntimeExecutionEnabled",
  "phase524RuntimeExecuted",
  "phase524DryRunBypassesBlock",
  "phase524CanEnableRuntime",
  "phase524CliSourceChanged",
  "phase524RustSourceChanged",
  "phase524FilesystemWatcherEnabled",
  "phase524ExternalSourceLookupEnabled",
  "phase524SecretsEnvIngestionEnabled",
  "phase524LiveStdinLoopEnabled",
  "phase524RuntimeStdoutWriterEnabled",
  "phase524RuntimeStderrWriterEnabled",
  "phase524ProcessSpawnEnabled",
  "phase524ProcessTerminationEnabled",
  "phase524RuntimeSupervisionEnabled",
  "phase524RuntimeTranscriptWritePerformed",
  "phase524RuntimeAuditWritePerformed",
  "phase524AdapterRuntimeBehaviorEnabled",
  "phase524ContentFabricRuntimeBehaviorEnabled",
  "phase524WebSocketHttpSurfaceEnabled"
];
const phase524SafetyFlagNames = [
  ...phase524ExpectedTrueSafetyFlagNames,
  ...phase524ExpectedFalseSafetyFlagNames
];
const phase525ExpectedTrueSafetyFlagNames = [
  "phase525NonAuthorizingReviewArtifactBoundaryRecorded",
  "phase525BoundaryReviewOnly",
  "phase525IntegratedReviewSummaryAccepted",
  "phase525MissingPrerequisiteInputsRejected",
  "phase525MalformedPrerequisiteInputsRejected",
  "phase525EmptyPrerequisiteInputsRejected",
  "phase525ConflictingPrerequisiteInputsRejected",
  "phase525StalePrerequisiteInputsRejected",
  "phase525RevokedPrerequisiteInputsRejected",
  "phase525UnknownPrerequisiteInputsRejected",
  "phase525DuplicateInvalidPrerequisiteInputsRejected",
  "phase525ValidIntegratedSummariesProduceReviewArtifact",
  "phase525ServeRuntimeStillDefaultBlocked"
];
const phase525ExpectedFalseSafetyFlagNames = [
  "phase525BoundaryAuthoritative",
  "phase525ReviewArtifactIsApprovalGrant",
  "phase525ApprovalGrantProduced",
  "phase525ApprovalGrantPersisted",
  "phase525RuntimePermissionGranted",
  "phase525CommandExposurePermissionGranted",
  "phase525RuntimeEnabled",
  "phase525RuntimeStarted",
  "phase525RuntimeReady",
  "phase525RuntimeCommandEnabled",
  "phase525RuntimeCommandExposureEnabled",
  "phase525RuntimeExecutionEnabled",
  "phase525RuntimeExecuted",
  "phase525DryRunBypassesBlock",
  "phase525CanEnableRuntime",
  "phase525CliSourceChanged",
  "phase525RustSourceChanged",
  "phase525FilesystemWatcherEnabled",
  "phase525ExternalSourceLookupEnabled",
  "phase525SecretsEnvIngestionEnabled",
  "phase525LiveStdinLoopEnabled",
  "phase525RuntimeStdoutWriterEnabled",
  "phase525RuntimeStderrWriterEnabled",
  "phase525ProcessSpawnEnabled",
  "phase525ProcessTerminationEnabled",
  "phase525RuntimeSupervisionEnabled",
  "phase525RuntimeTranscriptWritePerformed",
  "phase525RuntimeAuditWritePerformed",
  "phase525AdapterRuntimeBehaviorEnabled",
  "phase525ContentFabricRuntimeBehaviorEnabled",
  "phase525WebSocketHttpSurfaceEnabled"
];
const phase525SafetyFlagNames = [
  ...phase525ExpectedTrueSafetyFlagNames,
  ...phase525ExpectedFalseSafetyFlagNames
];
const phase526ExpectedTrueSafetyFlagNames = [
  "phase526ReviewArtifactEvaluatorInputHandoffRecorded",
  "phase526HandoffReviewOnly",
  "phase526ValidReviewArtifactsProduceEvaluatorInputCandidate",
  "phase526MissingReviewArtifactsRejected",
  "phase526MalformedReviewArtifactsRejected",
  "phase526EmptyReviewArtifactsRejected",
  "phase526ConflictingReviewArtifactsRejected",
  "phase526StaleReviewArtifactsRejected",
  "phase526RevokedReviewArtifactsRejected",
  "phase526UnknownReviewArtifactsRejected",
  "phase526DuplicateInvalidReviewArtifactsRejected",
  "phase526AuthorizingLookingReviewArtifactsRejected",
  "phase526ServeRuntimeStillDefaultBlocked"
];
const phase526ExpectedFalseSafetyFlagNames = [
  "phase526HandoffAuthoritative",
  "phase526EvaluatorInputCandidateIsApprovalGrant",
  "phase526ApprovalGrantProduced",
  "phase526ApprovalGrantPersisted",
  "phase526RuntimePermissionGranted",
  "phase526CommandExposurePermissionGranted",
  "phase526RuntimeEnabled",
  "phase526RuntimeStarted",
  "phase526RuntimeReady",
  "phase526RuntimeCommandEnabled",
  "phase526RuntimeCommandExposureEnabled",
  "phase526RuntimeExecutionEnabled",
  "phase526RuntimeExecuted",
  "phase526DryRunBypassesBlock",
  "phase526CanEnableRuntime",
  "phase526CliSourceChanged",
  "phase526RustSourceChanged",
  "phase526FilesystemWatcherEnabled",
  "phase526ExternalSourceLookupEnabled",
  "phase526SecretsEnvIngestionEnabled",
  "phase526LiveStdinLoopEnabled",
  "phase526RuntimeStdoutWriterEnabled",
  "phase526RuntimeStderrWriterEnabled",
  "phase526ProcessSpawnEnabled",
  "phase526ProcessTerminationEnabled",
  "phase526RuntimeSupervisionEnabled",
  "phase526RuntimeTranscriptWritePerformed",
  "phase526RuntimeAuditWritePerformed",
  "phase526AdapterRuntimeBehaviorEnabled",
  "phase526ContentFabricRuntimeBehaviorEnabled",
  "phase526WebSocketHttpSurfaceEnabled"
];
const phase526SafetyFlagNames = [
  ...phase526ExpectedTrueSafetyFlagNames,
  ...phase526ExpectedFalseSafetyFlagNames
];
const phase527ExpectedTrueSafetyFlagNames = [
  "phase527ApprovalEvaluatorCandidateIntakeCheckpointRecorded",
  "phase527CheckpointReviewOnly",
  "phase527ValidEvaluatorInputCandidatesProduceIntakeCheckpointState",
  "phase527MissingEvaluatorInputCandidatesRejected",
  "phase527MalformedEvaluatorInputCandidatesRejected",
  "phase527EmptyEvaluatorInputCandidatesRejected",
  "phase527ConflictingEvaluatorInputCandidatesRejected",
  "phase527StaleEvaluatorInputCandidatesRejected",
  "phase527RevokedEvaluatorInputCandidatesRejected",
  "phase527UnknownEvaluatorInputCandidatesRejected",
  "phase527DuplicateInvalidEvaluatorInputCandidatesRejected",
  "phase527AuthorizingLookingEvaluatorInputCandidatesRejected",
  "phase527RuntimeEffectTrueEvaluatorInputCandidatesRejected",
  "phase527ProcessFlagTrueEvaluatorInputCandidatesRejected",
  "phase527UnsafeEvaluatorInputCandidatesRejected",
  "phase527ServeRuntimeStillDefaultBlocked"
];
const phase527ExpectedFalseSafetyFlagNames = [
  "phase527CheckpointAuthoritative",
  "phase527IntakeCheckpointStateIsApprovalGrant",
  "phase527ApprovalGrantProduced",
  "phase527ApprovalGrantPersisted",
  "phase527RuntimePermissionGranted",
  "phase527CommandExposurePermissionGranted",
  "phase527RuntimeEnabled",
  "phase527RuntimeStarted",
  "phase527RuntimeReady",
  "phase527RuntimeCommandEnabled",
  "phase527RuntimeCommandExposureEnabled",
  "phase527RuntimeExecutionEnabled",
  "phase527RuntimeExecuted",
  "phase527DryRunBypassesBlock",
  "phase527CanEnableRuntime",
  "phase527CliSourceChanged",
  "phase527RustSourceChanged",
  "phase527FilesystemWatcherEnabled",
  "phase527ExternalSourceLookupEnabled",
  "phase527SecretsEnvIngestionEnabled",
  "phase527LiveStdinLoopEnabled",
  "phase527RuntimeStdoutWriterEnabled",
  "phase527RuntimeStderrWriterEnabled",
  "phase527ProcessSpawnEnabled",
  "phase527ProcessTerminationEnabled",
  "phase527RuntimeSupervisionEnabled",
  "phase527RuntimeTranscriptWritePerformed",
  "phase527RuntimeAuditWritePerformed",
  "phase527AdapterRuntimeBehaviorEnabled",
  "phase527ContentFabricRuntimeBehaviorEnabled",
  "phase527WebSocketHttpSurfaceEnabled"
];
const phase527SafetyFlagNames = [
  ...phase527ExpectedTrueSafetyFlagNames,
  ...phase527ExpectedFalseSafetyFlagNames
];
const phase528ExpectedTrueSafetyFlagNames = [
  "phase528ReviewOnlyEvaluatorPreflightCheckpointRecorded",
  "phase528CheckpointReviewOnly",
  "phase528ValidIntakeCheckpointStateProducesPreflightState",
  "phase528MissingIntakeCheckpointStateRejected",
  "phase528MalformedIntakeCheckpointStateRejected",
  "phase528EmptyIntakeCheckpointStateRejected",
  "phase528ConflictingIntakeCheckpointStateRejected",
  "phase528StaleIntakeCheckpointStateRejected",
  "phase528RevokedIntakeCheckpointStateRejected",
  "phase528UnknownIntakeCheckpointStateRejected",
  "phase528DuplicateInvalidIntakeCheckpointStateRejected",
  "phase528AuthorizingLookingIntakeCheckpointStateRejected",
  "phase528GrantLookingIntakeCheckpointStateRejected",
  "phase528RuntimePermissionLookingIntakeCheckpointStateRejected",
  "phase528CommandExposureLookingIntakeCheckpointStateRejected",
  "phase528RuntimeEffectTrueIntakeCheckpointStateRejected",
  "phase528ProcessFlagTrueIntakeCheckpointStateRejected",
  "phase528UnsafeIntakeCheckpointStateRejected",
  "phase528ExecutionSignalLookingIntakeCheckpointStateRejected",
  "phase528ServeRuntimeStillDefaultBlocked"
];
const phase528ExpectedFalseSafetyFlagNames = [
  "phase528CheckpointAuthoritative",
  "phase528PreflightCheckpointStateIsApprovalGrant",
  "phase528ApprovalGrantProduced",
  "phase528ApprovalGrantPersisted",
  "phase528RuntimePermissionGranted",
  "phase528CommandExposurePermissionGranted",
  "phase528RuntimeEnabled",
  "phase528RuntimeStarted",
  "phase528RuntimeReady",
  "phase528RuntimeCommandEnabled",
  "phase528RuntimeCommandExposureEnabled",
  "phase528RuntimeExecutionEnabled",
  "phase528RuntimeExecuted",
  "phase528EvaluatorExecutionPerformed",
  "phase528DryRunBypassesBlock",
  "phase528CanEnableRuntime",
  "phase528CliSourceChanged",
  "phase528RustSourceChanged",
  "phase528FilesystemWatcherEnabled",
  "phase528ExternalSourceLookupEnabled",
  "phase528SecretsEnvIngestionEnabled",
  "phase528LiveStdinLoopEnabled",
  "phase528RuntimeStdoutWriterEnabled",
  "phase528RuntimeStderrWriterEnabled",
  "phase528ProcessSpawnEnabled",
  "phase528ProcessTerminationEnabled",
  "phase528RuntimeSupervisionEnabled",
  "phase528RuntimeTranscriptWritePerformed",
  "phase528RuntimeAuditWritePerformed",
  "phase528AdapterRuntimeBehaviorEnabled",
  "phase528ContentFabricRuntimeBehaviorEnabled",
  "phase528WebSocketHttpSurfaceEnabled"
];
const phase528SafetyFlagNames = [
  ...phase528ExpectedTrueSafetyFlagNames,
  ...phase528ExpectedFalseSafetyFlagNames
];
const phase529ExpectedTrueSafetyFlagNames = [
  "phase529NonAuthorizingEvaluatorDecisionCandidateBoundaryRecorded",
  "phase529BoundaryReviewOnly",
  "phase529ValidPreflightCheckpointStateProducesDecisionCandidateState",
  "phase529MissingPreflightCheckpointStateRejected",
  "phase529MalformedPreflightCheckpointStateRejected",
  "phase529EmptyPreflightCheckpointStateRejected",
  "phase529ConflictingPreflightCheckpointStateRejected",
  "phase529StalePreflightCheckpointStateRejected",
  "phase529RevokedPreflightCheckpointStateRejected",
  "phase529UnknownPreflightCheckpointStateRejected",
  "phase529DuplicateInvalidPreflightCheckpointStateRejected",
  "phase529AuthorizingLookingPreflightCheckpointStateRejected",
  "phase529GrantLookingPreflightCheckpointStateRejected",
  "phase529ApprovalDecisionLookingPreflightCheckpointStateRejected",
  "phase529ApprovalGrantLookingPreflightCheckpointStateRejected",
  "phase529RuntimePermissionLookingPreflightCheckpointStateRejected",
  "phase529CommandExposureLookingPreflightCheckpointStateRejected",
  "phase529EvaluatorExecutionLookingPreflightCheckpointStateRejected",
  "phase529RuntimeEffectTruePreflightCheckpointStateRejected",
  "phase529ProcessFlagTruePreflightCheckpointStateRejected",
  "phase529UnsafePreflightCheckpointStateRejected",
  "phase529ExecutionSignalLookingPreflightCheckpointStateRejected",
  "phase529ServeRuntimeStillDefaultBlocked"
];
const phase529ExpectedFalseSafetyFlagNames = [
  "phase529BoundaryAuthoritative",
  "phase529DecisionCandidateStateIsApprovalDecision",
  "phase529DecisionCandidateStateIsApprovalGrant",
  "phase529ApprovalDecisionProduced",
  "phase529ApprovalDecisionPersisted",
  "phase529ApprovalGrantProduced",
  "phase529ApprovalGrantPersisted",
  "phase529RuntimePermissionGranted",
  "phase529CommandExposurePermissionGranted",
  "phase529RuntimeEnabled",
  "phase529RuntimeStarted",
  "phase529RuntimeReady",
  "phase529RuntimeCommandEnabled",
  "phase529RuntimeCommandExposureEnabled",
  "phase529RuntimeExecutionEnabled",
  "phase529RuntimeExecuted",
  "phase529EvaluatorExecutionPerformed",
  "phase529DryRunBypassesBlock",
  "phase529CanEnableRuntime",
  "phase529CliSourceChanged",
  "phase529RustSourceChanged",
  "phase529FilesystemWatcherEnabled",
  "phase529ExternalSourceLookupEnabled",
  "phase529SecretsEnvIngestionEnabled",
  "phase529LiveStdinLoopEnabled",
  "phase529RuntimeStdoutWriterEnabled",
  "phase529RuntimeStderrWriterEnabled",
  "phase529ProcessSpawnEnabled",
  "phase529ProcessTerminationEnabled",
  "phase529RuntimeSupervisionEnabled",
  "phase529RuntimeTranscriptWritePerformed",
  "phase529RuntimeAuditWritePerformed",
  "phase529AdapterRuntimeBehaviorEnabled",
  "phase529ContentFabricRuntimeBehaviorEnabled",
  "phase529WebSocketHttpSurfaceEnabled"
];
const phase529SafetyFlagNames = [
  ...phase529ExpectedTrueSafetyFlagNames,
  ...phase529ExpectedFalseSafetyFlagNames
];
const phase530ExpectedTrueSafetyFlagNames = [
  "phase530NonAuthorizingEvaluatorDecisionCandidateInspectionArtifactRecorded",
  "phase530ArtifactReviewOnly",
  "phase530ValidDecisionCandidateStateProducesInspectionArtifact",
  "phase530MissingDecisionCandidateStateRejected",
  "phase530MalformedDecisionCandidateStateRejected",
  "phase530EmptyDecisionCandidateStateRejected",
  "phase530ConflictingDecisionCandidateStateRejected",
  "phase530StaleDecisionCandidateStateRejected",
  "phase530RevokedDecisionCandidateStateRejected",
  "phase530UnknownDecisionCandidateStateRejected",
  "phase530DuplicateInvalidDecisionCandidateStateRejected",
  "phase530AuthorizingLookingDecisionCandidateStateRejected",
  "phase530GrantLookingDecisionCandidateStateRejected",
  "phase530ApprovalDecisionLookingDecisionCandidateStateRejected",
  "phase530ApprovalGrantLookingDecisionCandidateStateRejected",
  "phase530RuntimePermissionLookingDecisionCandidateStateRejected",
  "phase530CommandExposureLookingDecisionCandidateStateRejected",
  "phase530EvaluatorExecutionLookingDecisionCandidateStateRejected",
  "phase530EvaluatorResultLookingDecisionCandidateStateRejected",
  "phase530RuntimeEffectTrueDecisionCandidateStateRejected",
  "phase530ProcessFlagTrueDecisionCandidateStateRejected",
  "phase530UnsafeDecisionCandidateStateRejected",
  "phase530ExecutionSignalLookingDecisionCandidateStateRejected",
  "phase530ServeRuntimeStillDefaultBlocked"
];
const phase530ExpectedFalseSafetyFlagNames = [
  "phase530ArtifactAuthoritative",
  "phase530InspectionArtifactIsApprovalDecision",
  "phase530InspectionArtifactIsApprovalGrant",
  "phase530EvaluatorResultProduced",
  "phase530EvaluatorResultPersisted",
  "phase530ApprovalDecisionProduced",
  "phase530ApprovalDecisionPersisted",
  "phase530ApprovalGrantProduced",
  "phase530ApprovalGrantPersisted",
  "phase530RuntimePermissionGranted",
  "phase530CommandExposurePermissionGranted",
  "phase530RuntimeEnabled",
  "phase530RuntimeStarted",
  "phase530RuntimeReady",
  "phase530RuntimeCommandEnabled",
  "phase530RuntimeCommandExposureEnabled",
  "phase530RuntimeExecutionEnabled",
  "phase530RuntimeExecuted",
  "phase530EvaluatorExecutionPerformed",
  "phase530DryRunBypassesBlock",
  "phase530CanEnableRuntime",
  "phase530CliSourceChanged",
  "phase530RustSourceChanged",
  "phase530FilesystemWatcherEnabled",
  "phase530ExternalSourceLookupEnabled",
  "phase530SecretsEnvIngestionEnabled",
  "phase530LiveStdinLoopEnabled",
  "phase530RuntimeStdoutWriterEnabled",
  "phase530RuntimeStderrWriterEnabled",
  "phase530ProcessSpawnEnabled",
  "phase530ProcessTerminationEnabled",
  "phase530RuntimeSupervisionEnabled",
  "phase530RuntimeTranscriptWritePerformed",
  "phase530RuntimeAuditWritePerformed",
  "phase530AdapterRuntimeBehaviorEnabled",
  "phase530ContentFabricRuntimeBehaviorEnabled",
  "phase530WebSocketHttpSurfaceEnabled"
];
const phase530SafetyFlagNames = [
  ...phase530ExpectedTrueSafetyFlagNames,
  ...phase530ExpectedFalseSafetyFlagNames
];
const phase531ExpectedTrueSafetyFlagNames = [
  "phase531HumanToolInspectionDispositionBoundaryRecorded",
  "phase531BoundaryReviewOnly",
  "phase531ValidInspectionArtifactProducesDispositionState",
  "phase531MissingInspectionArtifactRejected",
  "phase531MalformedInspectionArtifactRejected",
  "phase531EmptyInspectionArtifactRejected",
  "phase531ConflictingInspectionArtifactRejected",
  "phase531StaleInspectionArtifactRejected",
  "phase531RevokedInspectionArtifactRejected",
  "phase531UnknownInspectionArtifactRejected",
  "phase531DuplicateInvalidInspectionArtifactRejected",
  "phase531AuthorizingLookingInspectionArtifactRejected",
  "phase531GrantLookingInspectionArtifactRejected",
  "phase531ApprovalDecisionLookingInspectionArtifactRejected",
  "phase531ApprovalGrantLookingInspectionArtifactRejected",
  "phase531EvaluatorResultLookingInspectionArtifactRejected",
  "phase531EvaluatorExecutionLookingInspectionArtifactRejected",
  "phase531RuntimePermissionLookingInspectionArtifactRejected",
  "phase531CommandExposureLookingInspectionArtifactRejected",
  "phase531RuntimeEffectTrueInspectionArtifactRejected",
  "phase531ProcessFlagTrueInspectionArtifactRejected",
  "phase531UnsafeInspectionArtifactRejected",
  "phase531ExecutionSignalLookingInspectionArtifactRejected",
  "phase531ServeRuntimeStillDefaultBlocked"
];
const phase531ExpectedFalseSafetyFlagNames = [
  "phase531BoundaryAuthoritative",
  "phase531DispositionStateIsApprovalDecision",
  "phase531DispositionStateIsApprovalGrant",
  "phase531EvaluatorResultProduced",
  "phase531EvaluatorResultPersisted",
  "phase531ApprovalDecisionProduced",
  "phase531ApprovalDecisionPersisted",
  "phase531ApprovalGrantProduced",
  "phase531ApprovalGrantPersisted",
  "phase531RuntimePermissionGranted",
  "phase531CommandExposurePermissionGranted",
  "phase531RuntimeEnabled",
  "phase531RuntimeStarted",
  "phase531RuntimeReady",
  "phase531RuntimeCommandEnabled",
  "phase531RuntimeCommandExposureEnabled",
  "phase531RuntimeExecutionEnabled",
  "phase531RuntimeExecuted",
  "phase531EvaluatorExecutionPerformed",
  "phase531DryRunBypassesBlock",
  "phase531CanEnableRuntime",
  "phase531CliSourceChanged",
  "phase531RustSourceChanged",
  "phase531FilesystemWatcherEnabled",
  "phase531ExternalSourceLookupEnabled",
  "phase531SecretsEnvIngestionEnabled",
  "phase531LiveStdinLoopEnabled",
  "phase531RuntimeStdoutWriterEnabled",
  "phase531RuntimeStderrWriterEnabled",
  "phase531ProcessSpawnEnabled",
  "phase531ProcessTerminationEnabled",
  "phase531RuntimeSupervisionEnabled",
  "phase531RuntimeTranscriptWritePerformed",
  "phase531RuntimeAuditWritePerformed",
  "phase531AdapterRuntimeBehaviorEnabled",
  "phase531ContentFabricRuntimeBehaviorEnabled",
  "phase531WebSocketHttpSurfaceEnabled"
];
const phase531SafetyFlagNames = [
  ...phase531ExpectedTrueSafetyFlagNames,
  ...phase531ExpectedFalseSafetyFlagNames
];
const phase532ExpectedTrueSafetyFlagNames = [
  "phase532ReviewOnlyDispositionAggregationCheckpointRecorded",
  "phase532CheckpointReviewOnly",
  "phase532ValidDispositionStateProducesAggregationState",
  "phase532MissingDispositionStateRejected",
  "phase532MalformedDispositionStateRejected",
  "phase532EmptyDispositionStateRejected",
  "phase532ConflictingDispositionStateRejected",
  "phase532StaleDispositionStateRejected",
  "phase532RevokedDispositionStateRejected",
  "phase532UnknownDispositionStateRejected",
  "phase532DuplicateInvalidDispositionStateRejected",
  "phase532AuthorizingLookingDispositionStateRejected",
  "phase532GrantLookingDispositionStateRejected",
  "phase532ApprovalDecisionLookingDispositionStateRejected",
  "phase532ApprovalGrantLookingDispositionStateRejected",
  "phase532EvaluatorResultLookingDispositionStateRejected",
  "phase532EvaluatorExecutionLookingDispositionStateRejected",
  "phase532ReviewerRoutingLookingDispositionStateRejected",
  "phase532RuntimePermissionLookingDispositionStateRejected",
  "phase532CommandExposureLookingDispositionStateRejected",
  "phase532RuntimeEffectTrueDispositionStateRejected",
  "phase532ProcessFlagTrueDispositionStateRejected",
  "phase532UnsafeDispositionStateRejected",
  "phase532ExecutionSignalLookingDispositionStateRejected",
  "phase532ServeRuntimeStillDefaultBlocked"
];
const phase532ExpectedFalseSafetyFlagNames = [
  "phase532CheckpointAuthoritative",
  "phase532AggregationCheckpointIsReviewerRouting",
  "phase532AggregationCheckpointIsApprovalDecision",
  "phase532AggregationCheckpointIsApprovalGrant",
  "phase532ReviewerRoutingPerformed",
  "phase532EvaluatorResultProduced",
  "phase532EvaluatorResultPersisted",
  "phase532ApprovalDecisionProduced",
  "phase532ApprovalDecisionPersisted",
  "phase532ApprovalGrantProduced",
  "phase532ApprovalGrantPersisted",
  "phase532RuntimePermissionGranted",
  "phase532CommandExposurePermissionGranted",
  "phase532RuntimeEnabled",
  "phase532RuntimeStarted",
  "phase532RuntimeReady",
  "phase532RuntimeCommandEnabled",
  "phase532RuntimeCommandExposureEnabled",
  "phase532RuntimeExecutionEnabled",
  "phase532RuntimeExecuted",
  "phase532EvaluatorExecutionPerformed",
  "phase532DryRunBypassesBlock",
  "phase532CanEnableRuntime",
  "phase532CliSourceChanged",
  "phase532RustSourceChanged",
  "phase532FilesystemWatcherEnabled",
  "phase532ExternalSourceLookupEnabled",
  "phase532SecretsEnvIngestionEnabled",
  "phase532LiveStdinLoopEnabled",
  "phase532RuntimeStdoutWriterEnabled",
  "phase532RuntimeStderrWriterEnabled",
  "phase532ProcessSpawnEnabled",
  "phase532ProcessTerminationEnabled",
  "phase532RuntimeSupervisionEnabled",
  "phase532RuntimeTranscriptWritePerformed",
  "phase532RuntimeAuditWritePerformed",
  "phase532AdapterRuntimeBehaviorEnabled",
  "phase532ContentFabricRuntimeBehaviorEnabled",
  "phase532WebSocketHttpSurfaceEnabled"
];
const phase532SafetyFlagNames = [
  ...phase532ExpectedTrueSafetyFlagNames,
  ...phase532ExpectedFalseSafetyFlagNames
];
const phase533ExpectedTrueSafetyFlagNames = [
  "phase533ReviewOnlyAggregationInspectionHandoffRecorded",
  "phase533HandoffReviewOnly",
  "phase533ValidAggregationStateProducesInspectionHandoffState",
  "phase533MissingAggregationStateRejected",
  "phase533MalformedAggregationStateRejected",
  "phase533EmptyAggregationStateRejected",
  "phase533ConflictingAggregationStateRejected",
  "phase533StaleAggregationStateRejected",
  "phase533RevokedAggregationStateRejected",
  "phase533UnknownAggregationStateRejected",
  "phase533DuplicateInvalidAggregationStateRejected",
  "phase533AuthorizingLookingAggregationStateRejected",
  "phase533GrantLookingAggregationStateRejected",
  "phase533ApprovalDecisionLookingAggregationStateRejected",
  "phase533ApprovalGrantLookingAggregationStateRejected",
  "phase533EvaluatorResultLookingAggregationStateRejected",
  "phase533EvaluatorExecutionLookingAggregationStateRejected",
  "phase533ReviewerRoutingLookingAggregationStateRejected",
  "phase533RuntimePermissionLookingAggregationStateRejected",
  "phase533CommandExposureLookingAggregationStateRejected",
  "phase533RuntimeEffectTrueAggregationStateRejected",
  "phase533ProcessFlagTrueAggregationStateRejected",
  "phase533UnsafeAggregationStateRejected",
  "phase533ExecutionSignalLookingAggregationStateRejected",
  "phase533ServeRuntimeStillDefaultBlocked"
];
const phase533ExpectedFalseSafetyFlagNames = [
  "phase533HandoffAuthoritative",
  "phase533HandoffIsReviewerRouting",
  "phase533HandoffIsEvaluatorExecution",
  "phase533HandoffIsEvaluatorResult",
  "phase533HandoffIsApprovalDecision",
  "phase533HandoffIsApprovalGrant",
  "phase533ReviewerRoutingPerformed",
  "phase533EvaluatorResultProduced",
  "phase533EvaluatorResultPersisted",
  "phase533ApprovalDecisionProduced",
  "phase533ApprovalDecisionPersisted",
  "phase533ApprovalGrantProduced",
  "phase533ApprovalGrantPersisted",
  "phase533RuntimePermissionGranted",
  "phase533CommandExposurePermissionGranted",
  "phase533RuntimeEnabled",
  "phase533RuntimeStarted",
  "phase533RuntimeReady",
  "phase533RuntimeCommandEnabled",
  "phase533RuntimeCommandExposureEnabled",
  "phase533RuntimeExecutionEnabled",
  "phase533RuntimeExecuted",
  "phase533EvaluatorExecutionPerformed",
  "phase533DryRunBypassesBlock",
  "phase533CanEnableRuntime",
  "phase533CliSourceChanged",
  "phase533RustSourceChanged",
  "phase533FilesystemWatcherEnabled",
  "phase533ExternalSourceLookupEnabled",
  "phase533SecretsEnvIngestionEnabled",
  "phase533LiveStdinLoopEnabled",
  "phase533RuntimeStdoutWriterEnabled",
  "phase533RuntimeStderrWriterEnabled",
  "phase533ProcessSpawnEnabled",
  "phase533ProcessTerminationEnabled",
  "phase533RuntimeSupervisionEnabled",
  "phase533RuntimeTranscriptWritePerformed",
  "phase533RuntimeAuditWritePerformed",
  "phase533AdapterRuntimeBehaviorEnabled",
  "phase533ContentFabricRuntimeBehaviorEnabled",
  "phase533WebSocketHttpSurfaceEnabled"
];
const phase533SafetyFlagNames = [
  ...phase533ExpectedTrueSafetyFlagNames,
  ...phase533ExpectedFalseSafetyFlagNames
];
const phase534ExpectedTrueSafetyFlagNames = [
  "phase534ReviewOnlyHandoffReadinessArtifactRecorded",
  "phase534ArtifactReviewOnly",
  "phase534ValidHandoffStateProducesReadinessArtifact",
  "phase534MissingHandoffStateRejected",
  "phase534MalformedHandoffStateRejected",
  "phase534EmptyHandoffStateRejected",
  "phase534ConflictingHandoffStateRejected",
  "phase534StaleHandoffStateRejected",
  "phase534RevokedHandoffStateRejected",
  "phase534UnknownHandoffStateRejected",
  "phase534DuplicateInvalidHandoffStateRejected",
  "phase534AuthorizingLookingHandoffStateRejected",
  "phase534GrantLookingHandoffStateRejected",
  "phase534ApprovalDecisionLookingHandoffStateRejected",
  "phase534ApprovalGrantLookingHandoffStateRejected",
  "phase534EvaluatorResultLookingHandoffStateRejected",
  "phase534EvaluatorExecutionLookingHandoffStateRejected",
  "phase534ReviewerRoutingLookingHandoffStateRejected",
  "phase534ReviewerAssignmentLookingHandoffStateRejected",
  "phase534RuntimePermissionLookingHandoffStateRejected",
  "phase534CommandExposureLookingHandoffStateRejected",
  "phase534RuntimeEffectTrueHandoffStateRejected",
  "phase534ProcessFlagTrueHandoffStateRejected",
  "phase534UnsafeHandoffStateRejected",
  "phase534ExecutionSignalLookingHandoffStateRejected",
  "phase534ServeRuntimeStillDefaultBlocked"
];
const phase534ExpectedFalseSafetyFlagNames = [
  "phase534ArtifactAuthoritative",
  "phase534ReadinessArtifactIsReviewerRouting",
  "phase534ReadinessArtifactIsReviewerAssignment",
  "phase534ReadinessArtifactIsEvaluatorExecution",
  "phase534ReadinessArtifactIsEvaluatorResult",
  "phase534ReadinessArtifactIsApprovalDecision",
  "phase534ReadinessArtifactIsApprovalGrant",
  "phase534ReviewerRoutingPerformed",
  "phase534ReviewerAssignmentPerformed",
  "phase534EvaluatorResultProduced",
  "phase534EvaluatorResultPersisted",
  "phase534ApprovalDecisionProduced",
  "phase534ApprovalDecisionPersisted",
  "phase534ApprovalGrantProduced",
  "phase534ApprovalGrantPersisted",
  "phase534RuntimePermissionGranted",
  "phase534CommandExposurePermissionGranted",
  "phase534RuntimeEnabled",
  "phase534RuntimeStarted",
  "phase534RuntimeReady",
  "phase534RuntimeCommandEnabled",
  "phase534RuntimeCommandExposureEnabled",
  "phase534RuntimeExecutionEnabled",
  "phase534RuntimeExecuted",
  "phase534EvaluatorExecutionPerformed",
  "phase534DryRunBypassesBlock",
  "phase534CanEnableRuntime",
  "phase534CliSourceChanged",
  "phase534RustSourceChanged",
  "phase534FilesystemWatcherEnabled",
  "phase534ExternalSourceLookupEnabled",
  "phase534SecretsEnvIngestionEnabled",
  "phase534LiveStdinLoopEnabled",
  "phase534RuntimeStdoutWriterEnabled",
  "phase534RuntimeStderrWriterEnabled",
  "phase534ProcessSpawnEnabled",
  "phase534ProcessTerminationEnabled",
  "phase534RuntimeSupervisionEnabled",
  "phase534RuntimeTranscriptWritePerformed",
  "phase534RuntimeAuditWritePerformed",
  "phase534AdapterRuntimeBehaviorEnabled",
  "phase534ContentFabricRuntimeBehaviorEnabled",
  "phase534WebSocketHttpSurfaceEnabled"
];
const phase534SafetyFlagNames = [
  ...phase534ExpectedTrueSafetyFlagNames,
  ...phase534ExpectedFalseSafetyFlagNames
];
const phase535ExpectedTrueSafetyFlagNames = [
  "phase535ReviewOnlyReadinessInspectionCheckpointRecorded",
  "phase535ArtifactReviewOnly",
  "phase535ValidReadinessArtifactProducesInspectionCheckpoint",
  "phase535MissingReadinessArtifactRejected",
  "phase535MalformedReadinessArtifactRejected",
  "phase535EmptyReadinessArtifactRejected",
  "phase535ConflictingReadinessArtifactRejected",
  "phase535StaleReadinessArtifactRejected",
  "phase535RevokedReadinessArtifactRejected",
  "phase535UnknownReadinessArtifactRejected",
  "phase535DuplicateInvalidReadinessArtifactRejected",
  "phase535AuthorizingLookingReadinessArtifactRejected",
  "phase535GrantLookingReadinessArtifactRejected",
  "phase535ApprovalDecisionLookingReadinessArtifactRejected",
  "phase535ApprovalGrantLookingReadinessArtifactRejected",
  "phase535EvaluatorResultLookingReadinessArtifactRejected",
  "phase535EvaluatorExecutionLookingReadinessArtifactRejected",
  "phase535ReviewerRoutingLookingReadinessArtifactRejected",
  "phase535ReviewerAssignmentLookingReadinessArtifactRejected",
  "phase535RuntimePermissionLookingReadinessArtifactRejected",
  "phase535CommandExposureLookingReadinessArtifactRejected",
  "phase535RuntimeEffectTrueReadinessArtifactRejected",
  "phase535ProcessFlagTrueReadinessArtifactRejected",
  "phase535UnsafeReadinessArtifactRejected",
  "phase535ExecutionSignalLookingReadinessArtifactRejected",
  "phase535ServeRuntimeStillDefaultBlocked"
];
const phase535ExpectedFalseSafetyFlagNames = [
  "phase535ArtifactAuthoritative",
  "phase535ReadinessInspectionCheckpointIsReviewerRouting",
  "phase535ReadinessInspectionCheckpointIsReviewerAssignment",
  "phase535ReadinessInspectionCheckpointIsEvaluatorExecution",
  "phase535ReadinessInspectionCheckpointIsEvaluatorResult",
  "phase535ReadinessInspectionCheckpointIsApprovalDecision",
  "phase535ReadinessInspectionCheckpointIsApprovalGrant",
  "phase535ReviewerRoutingPerformed",
  "phase535ReviewerAssignmentPerformed",
  "phase535EvaluatorResultProduced",
  "phase535EvaluatorResultPersisted",
  "phase535ApprovalDecisionProduced",
  "phase535ApprovalDecisionPersisted",
  "phase535ApprovalGrantProduced",
  "phase535ApprovalGrantPersisted",
  "phase535RuntimePermissionGranted",
  "phase535CommandExposurePermissionGranted",
  "phase535RuntimeEnabled",
  "phase535RuntimeStarted",
  "phase535RuntimeReady",
  "phase535RuntimeCommandEnabled",
  "phase535RuntimeCommandExposureEnabled",
  "phase535RuntimeExecutionEnabled",
  "phase535RuntimeExecuted",
  "phase535EvaluatorExecutionPerformed",
  "phase535DryRunBypassesBlock",
  "phase535CanEnableRuntime",
  "phase535CliSourceChanged",
  "phase535RustSourceChanged",
  "phase535FilesystemWatcherEnabled",
  "phase535ExternalSourceLookupEnabled",
  "phase535SecretsEnvIngestionEnabled",
  "phase535LiveStdinLoopEnabled",
  "phase535RuntimeStdoutWriterEnabled",
  "phase535RuntimeStderrWriterEnabled",
  "phase535ProcessSpawnEnabled",
  "phase535ProcessTerminationEnabled",
  "phase535RuntimeSupervisionEnabled",
  "phase535RuntimeTranscriptWritePerformed",
  "phase535RuntimeAuditWritePerformed",
  "phase535AdapterRuntimeBehaviorEnabled",
  "phase535ContentFabricRuntimeBehaviorEnabled",
  "phase535WebSocketHttpSurfaceEnabled"
];
const phase535SafetyFlagNames = [
  ...phase535ExpectedTrueSafetyFlagNames,
  ...phase535ExpectedFalseSafetyFlagNames
];
const phase536ExpectedTrueSafetyFlagNames = [
  "phase536ReviewOnlyReadinessHandoffDispositionRecorded",
  "phase536BoundaryReviewOnly",
  "phase536ValidReadinessInspectionCheckpointProducesHandoffDisposition",
  "phase536MissingReadinessInspectionCheckpointRejected",
  "phase536MalformedReadinessInspectionCheckpointRejected",
  "phase536EmptyReadinessInspectionCheckpointRejected",
  "phase536ConflictingReadinessInspectionCheckpointRejected",
  "phase536StaleReadinessInspectionCheckpointRejected",
  "phase536RevokedReadinessInspectionCheckpointRejected",
  "phase536UnknownReadinessInspectionCheckpointRejected",
  "phase536DuplicateInvalidReadinessInspectionCheckpointRejected",
  "phase536AuthorizingLookingReadinessInspectionCheckpointRejected",
  "phase536GrantLookingReadinessInspectionCheckpointRejected",
  "phase536ApprovalDecisionLookingReadinessInspectionCheckpointRejected",
  "phase536ApprovalGrantLookingReadinessInspectionCheckpointRejected",
  "phase536EvaluatorResultLookingReadinessInspectionCheckpointRejected",
  "phase536EvaluatorExecutionLookingReadinessInspectionCheckpointRejected",
  "phase536ReviewerRoutingLookingReadinessInspectionCheckpointRejected",
  "phase536ReviewerAssignmentLookingReadinessInspectionCheckpointRejected",
  "phase536RuntimePermissionLookingReadinessInspectionCheckpointRejected",
  "phase536CommandExposureLookingReadinessInspectionCheckpointRejected",
  "phase536RuntimeEffectTrueReadinessInspectionCheckpointRejected",
  "phase536ProcessFlagTrueReadinessInspectionCheckpointRejected",
  "phase536UnsafeReadinessInspectionCheckpointRejected",
  "phase536ExecutionSignalLookingReadinessInspectionCheckpointRejected",
  "phase536ServeRuntimeStillDefaultBlocked"
];
const phase536ExpectedFalseSafetyFlagNames = [
  "phase536BoundaryAuthoritative",
  "phase536ReadinessHandoffDispositionIsReviewerRouting",
  "phase536ReadinessHandoffDispositionIsReviewerAssignment",
  "phase536ReadinessHandoffDispositionIsEvaluatorExecution",
  "phase536ReadinessHandoffDispositionIsEvaluatorResult",
  "phase536ReadinessHandoffDispositionIsApprovalDecision",
  "phase536ReadinessHandoffDispositionIsApprovalGrant",
  "phase536ReviewerRoutingPerformed",
  "phase536ReviewerAssignmentPerformed",
  "phase536EvaluatorResultProduced",
  "phase536EvaluatorResultPersisted",
  "phase536ApprovalDecisionProduced",
  "phase536ApprovalDecisionPersisted",
  "phase536ApprovalGrantProduced",
  "phase536ApprovalGrantPersisted",
  "phase536RuntimePermissionGranted",
  "phase536CommandExposurePermissionGranted",
  "phase536RuntimeEnabled",
  "phase536RuntimeStarted",
  "phase536RuntimeReady",
  "phase536RuntimeCommandEnabled",
  "phase536RuntimeCommandExposureEnabled",
  "phase536RuntimeExecutionEnabled",
  "phase536RuntimeExecuted",
  "phase536EvaluatorExecutionPerformed",
  "phase536DryRunBypassesBlock",
  "phase536CanEnableRuntime",
  "phase536CliSourceChanged",
  "phase536RustSourceChanged",
  "phase536FilesystemWatcherEnabled",
  "phase536ExternalSourceLookupEnabled",
  "phase536SecretsEnvIngestionEnabled",
  "phase536LiveStdinLoopEnabled",
  "phase536RuntimeStdoutWriterEnabled",
  "phase536RuntimeStderrWriterEnabled",
  "phase536ProcessSpawnEnabled",
  "phase536ProcessTerminationEnabled",
  "phase536RuntimeSupervisionEnabled",
  "phase536RuntimeTranscriptWritePerformed",
  "phase536RuntimeAuditWritePerformed",
  "phase536AdapterRuntimeBehaviorEnabled",
  "phase536ContentFabricRuntimeBehaviorEnabled",
  "phase536WebSocketHttpSurfaceEnabled"
];
const phase536SafetyFlagNames = [
  ...phase536ExpectedTrueSafetyFlagNames,
  ...phase536ExpectedFalseSafetyFlagNames
];
const phase537ExpectedTrueSafetyFlagNames = [
  "phase537ReviewOnlyHandoffDispositionInspectionCheckpointRecorded",
  "phase537CheckpointReviewOnly",
  "phase537ValidReadinessHandoffDispositionProducesInspectionCheckpoint",
  "phase537MissingReadinessHandoffDispositionRejected",
  "phase537MalformedReadinessHandoffDispositionRejected",
  "phase537EmptyReadinessHandoffDispositionRejected",
  "phase537ConflictingReadinessHandoffDispositionRejected",
  "phase537StaleReadinessHandoffDispositionRejected",
  "phase537RevokedReadinessHandoffDispositionRejected",
  "phase537UnknownReadinessHandoffDispositionRejected",
  "phase537DuplicateInvalidReadinessHandoffDispositionRejected",
  "phase537AuthorizingLookingReadinessHandoffDispositionRejected",
  "phase537GrantLookingReadinessHandoffDispositionRejected",
  "phase537ApprovalDecisionLookingReadinessHandoffDispositionRejected",
  "phase537ApprovalGrantLookingReadinessHandoffDispositionRejected",
  "phase537EvaluatorResultLookingReadinessHandoffDispositionRejected",
  "phase537EvaluatorExecutionLookingReadinessHandoffDispositionRejected",
  "phase537ReviewerRoutingLookingReadinessHandoffDispositionRejected",
  "phase537ReviewerAssignmentLookingReadinessHandoffDispositionRejected",
  "phase537RuntimePermissionLookingReadinessHandoffDispositionRejected",
  "phase537CommandExposureLookingReadinessHandoffDispositionRejected",
  "phase537RuntimeEffectTrueReadinessHandoffDispositionRejected",
  "phase537ProcessFlagTrueReadinessHandoffDispositionRejected",
  "phase537UnsafeReadinessHandoffDispositionRejected",
  "phase537ExecutionSignalLookingReadinessHandoffDispositionRejected",
  "phase537ServeRuntimeStillDefaultBlocked"
];
const phase537ExpectedFalseSafetyFlagNames = [
  "phase537CheckpointAuthoritative",
  "phase537HandoffDispositionInspectionCheckpointIsReviewerRouting",
  "phase537HandoffDispositionInspectionCheckpointIsReviewerAssignment",
  "phase537HandoffDispositionInspectionCheckpointIsEvaluatorExecution",
  "phase537HandoffDispositionInspectionCheckpointIsEvaluatorResult",
  "phase537HandoffDispositionInspectionCheckpointIsApprovalDecision",
  "phase537HandoffDispositionInspectionCheckpointIsApprovalGrant",
  "phase537ReviewerRoutingPerformed",
  "phase537ReviewerAssignmentPerformed",
  "phase537EvaluatorResultProduced",
  "phase537EvaluatorResultPersisted",
  "phase537ApprovalDecisionProduced",
  "phase537ApprovalDecisionPersisted",
  "phase537ApprovalGrantProduced",
  "phase537ApprovalGrantPersisted",
  "phase537RuntimePermissionGranted",
  "phase537CommandExposurePermissionGranted",
  "phase537RuntimeEnabled",
  "phase537RuntimeStarted",
  "phase537RuntimeReady",
  "phase537RuntimeCommandEnabled",
  "phase537RuntimeCommandExposureEnabled",
  "phase537RuntimeExecutionEnabled",
  "phase537RuntimeExecuted",
  "phase537EvaluatorExecutionPerformed",
  "phase537DryRunBypassesBlock",
  "phase537CanEnableRuntime",
  "phase537CliSourceChanged",
  "phase537RustSourceChanged",
  "phase537FilesystemWatcherEnabled",
  "phase537ExternalSourceLookupEnabled",
  "phase537SecretsEnvIngestionEnabled",
  "phase537LiveStdinLoopEnabled",
  "phase537RuntimeStdoutWriterEnabled",
  "phase537RuntimeStderrWriterEnabled",
  "phase537ProcessSpawnEnabled",
  "phase537ProcessTerminationEnabled",
  "phase537RuntimeSupervisionEnabled",
  "phase537RuntimeTranscriptWritePerformed",
  "phase537RuntimeAuditWritePerformed",
  "phase537AdapterRuntimeBehaviorEnabled",
  "phase537ContentFabricRuntimeBehaviorEnabled",
  "phase537WebSocketHttpSurfaceEnabled"
];
const phase537SafetyFlagNames = [
  ...phase537ExpectedTrueSafetyFlagNames,
  ...phase537ExpectedFalseSafetyFlagNames
];
const phase538ExpectedTrueSafetyFlagNames = [
  "phase538ReviewOnlyInspectionHandoffMetadataBoundaryRecorded",
  "phase538BoundaryReviewOnly",
  "phase538ValidHandoffDispositionInspectionCheckpointProducesMetadata",
  "phase538MissingHandoffDispositionInspectionCheckpointRejected",
  "phase538MalformedHandoffDispositionInspectionCheckpointRejected",
  "phase538EmptyHandoffDispositionInspectionCheckpointRejected",
  "phase538ConflictingHandoffDispositionInspectionCheckpointRejected",
  "phase538StaleHandoffDispositionInspectionCheckpointRejected",
  "phase538RevokedHandoffDispositionInspectionCheckpointRejected",
  "phase538UnknownHandoffDispositionInspectionCheckpointRejected",
  "phase538DuplicateInvalidHandoffDispositionInspectionCheckpointRejected",
  "phase538AuthorizingLookingHandoffDispositionInspectionCheckpointRejected",
  "phase538GrantLookingHandoffDispositionInspectionCheckpointRejected",
  "phase538ApprovalDecisionLookingHandoffDispositionInspectionCheckpointRejected",
  "phase538ApprovalGrantLookingHandoffDispositionInspectionCheckpointRejected",
  "phase538EvaluatorResultLookingHandoffDispositionInspectionCheckpointRejected",
  "phase538EvaluatorExecutionLookingHandoffDispositionInspectionCheckpointRejected",
  "phase538ReviewerRoutingLookingHandoffDispositionInspectionCheckpointRejected",
  "phase538ReviewerAssignmentLookingHandoffDispositionInspectionCheckpointRejected",
  "phase538RuntimePermissionLookingHandoffDispositionInspectionCheckpointRejected",
  "phase538CommandExposureLookingHandoffDispositionInspectionCheckpointRejected",
  "phase538RuntimeEffectTrueHandoffDispositionInspectionCheckpointRejected",
  "phase538ProcessFlagTrueHandoffDispositionInspectionCheckpointRejected",
  "phase538UnsafeHandoffDispositionInspectionCheckpointRejected",
  "phase538ExecutionSignalLookingHandoffDispositionInspectionCheckpointRejected",
  "phase538ServeRuntimeStillDefaultBlocked"
];
const phase538ExpectedFalseSafetyFlagNames = [
  "phase538BoundaryAuthoritative",
  "phase538InspectionHandoffMetadataIsReviewerRouting",
  "phase538InspectionHandoffMetadataIsReviewerAssignment",
  "phase538InspectionHandoffMetadataIsEvaluatorExecution",
  "phase538InspectionHandoffMetadataIsEvaluatorResult",
  "phase538InspectionHandoffMetadataIsApprovalDecision",
  "phase538InspectionHandoffMetadataIsApprovalGrant",
  "phase538ReviewerRoutingPerformed",
  "phase538ReviewerAssignmentPerformed",
  "phase538EvaluatorResultProduced",
  "phase538EvaluatorResultPersisted",
  "phase538ApprovalDecisionProduced",
  "phase538ApprovalDecisionPersisted",
  "phase538ApprovalGrantProduced",
  "phase538ApprovalGrantPersisted",
  "phase538RuntimePermissionGranted",
  "phase538CommandExposurePermissionGranted",
  "phase538RuntimeEnabled",
  "phase538RuntimeStarted",
  "phase538RuntimeReady",
  "phase538RuntimeCommandEnabled",
  "phase538RuntimeCommandExposureEnabled",
  "phase538RuntimeExecutionEnabled",
  "phase538RuntimeExecuted",
  "phase538EvaluatorExecutionPerformed",
  "phase538DryRunBypassesBlock",
  "phase538CanEnableRuntime",
  "phase538CliSourceChanged",
  "phase538RustSourceChanged",
  "phase538FilesystemWatcherEnabled",
  "phase538ExternalSourceLookupEnabled",
  "phase538SecretsEnvIngestionEnabled",
  "phase538LiveStdinLoopEnabled",
  "phase538RuntimeStdoutWriterEnabled",
  "phase538RuntimeStderrWriterEnabled",
  "phase538ProcessSpawnEnabled",
  "phase538ProcessTerminationEnabled",
  "phase538RuntimeSupervisionEnabled",
  "phase538RuntimeTranscriptWritePerformed",
  "phase538RuntimeAuditWritePerformed",
  "phase538AdapterRuntimeBehaviorEnabled",
  "phase538ContentFabricRuntimeBehaviorEnabled",
  "phase538WebSocketHttpSurfaceEnabled"
];
const phase538SafetyFlagNames = [
  ...phase538ExpectedTrueSafetyFlagNames,
  ...phase538ExpectedFalseSafetyFlagNames
];
const phase538ADocFiles = [
  "docs/phase-5-38a-cleanup-toolkit-adoption.md",
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md"
];
const phase538ACrossLinks = [
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md",
  "docs/phase-5-38-review-only-inspection-handoff-metadata-boundary.md",
  "docs/phase-5-38a-cleanup-toolkit-adoption.md"
];
const phase538AExpectedTrueSafetyFlagNames = [
  "phase538ACleanupToolkitAdoptionRecorded",
  "phase538ALanguageAwarePassOrderRecorded",
  "phase538ABehaviorPreserving",
  "phase538AServeRuntimeStillDefaultBlocked"
];
const phase538AExpectedFalseSafetyFlagNames = [
  "phase538AReviewBoundaryChainContinued",
  "phase538AReviewerRoutingPerformed",
  "phase538AReviewerAssignmentPerformed",
  "phase538AEvaluatorExecutionPerformed",
  "phase538AEvaluatorResultProduced",
  "phase538AApprovalDecisionProduced",
  "phase538AApprovalDecisionPersisted",
  "phase538AApprovalGrantProduced",
  "phase538AApprovalGrantPersisted",
  "phase538ARuntimePermissionGranted",
  "phase538ACommandExposurePermissionGranted",
  "phase538ARuntimeEnabled",
  "phase538ARuntimeStarted",
  "phase538ARuntimeCommandExposureEnabled",
  "phase538ARuntimeExecutionEnabled",
  "phase538ARuntimeExecuted",
  "phase538AProcessControlEnabled",
  "phase538AFilesystemWatcherEnabled",
  "phase538AExternalLookupEnabled",
  "phase538ASecretsEnvIngestionEnabled",
  "phase538AAdapterFabricWebSocketHttpSurfaceEnabled",
  "phase538AFallowRuntimeUsed",
  "phase538ADryRunBypassesBlock",
  "phase538ACanEnableRuntime"
];
const phase538ASafetyFlagNames = [
  ...phase538AExpectedTrueSafetyFlagNames,
  ...phase538AExpectedFalseSafetyFlagNames
];
const phase539DocFiles = [
  "docs/phase-5-39-review-only-inspection-handoff-checkpoint.md",
  "docs/phase-5-38-review-only-inspection-handoff-metadata-boundary.md",
  "docs/phase-5-38a-cleanup-toolkit-adoption.md",
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md"
];
const phase539CrossLinks = [
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md",
  "docs/phase-5-38-review-only-inspection-handoff-metadata-boundary.md",
  "docs/phase-5-38a-cleanup-toolkit-adoption.md",
  "docs/phase-5-39-review-only-inspection-handoff-checkpoint.md"
];
const phase539ExpectedCaseIds = [
  "missing-review-only-inspection-handoff-checkpoint-input-rejected",
  "malformed-review-only-inspection-handoff-checkpoint-input-rejected",
  "malformed-review-only-inspection-handoff-checkpoint-invalid-reviewed-at-rejected",
  "empty-review-only-inspection-handoff-checkpoint-input-rejected",
  "conflicting-review-only-inspection-handoff-checkpoint-input-rejected",
  "stale-review-only-inspection-handoff-checkpoint-input-rejected",
  "revoked-review-only-inspection-handoff-checkpoint-input-rejected",
  "unknown-review-only-inspection-handoff-checkpoint-input-rejected",
  "duplicate-invalid-review-only-inspection-handoff-checkpoint-input-rejected",
  "authorizing-looking-review-only-inspection-handoff-checkpoint-input-rejected",
  "grant-looking-review-only-inspection-handoff-checkpoint-input-rejected",
  "approval-decision-looking-review-only-inspection-handoff-checkpoint-input-rejected",
  "approval-grant-looking-review-only-inspection-handoff-checkpoint-input-rejected",
  "evaluator-result-looking-review-only-inspection-handoff-checkpoint-input-rejected",
  "evaluator-execution-looking-review-only-inspection-handoff-checkpoint-input-rejected",
  "reviewer-routing-looking-review-only-inspection-handoff-checkpoint-input-rejected",
  "reviewer-assignment-looking-review-only-inspection-handoff-checkpoint-input-rejected",
  "runtime-permission-looking-review-only-inspection-handoff-checkpoint-input-rejected",
  "command-exposure-looking-review-only-inspection-handoff-checkpoint-input-rejected",
  "runtime-effect-true-review-only-inspection-handoff-checkpoint-input-rejected",
  "process-flag-true-review-only-inspection-handoff-checkpoint-input-rejected",
  "unsafe-top-level-review-only-inspection-handoff-checkpoint-input-rejected",
  "unsafe-nested-inspection-handoff-checkpoint-metadata-review-only-inspection-handoff-checkpoint-input-rejected",
  "execution-signal-looking-review-only-inspection-handoff-checkpoint-input-rejected",
  "valid-review-only-inspection-handoff-checkpoint"
];
const phase539ExpectedTrueSafetyFlagNames = [
  "phase539ReviewOnlyInspectionHandoffCheckpointRecorded",
  "phase539CheckpointReviewOnly",
  "phase539ValidInspectionHandoffMetadataProducesCheckpoint",
  "phase539MissingInspectionHandoffMetadataRejected",
  "phase539MalformedInspectionHandoffMetadataRejected",
  "phase539EmptyInspectionHandoffMetadataRejected",
  "phase539ConflictingInspectionHandoffMetadataRejected",
  "phase539StaleInspectionHandoffMetadataRejected",
  "phase539RevokedInspectionHandoffMetadataRejected",
  "phase539UnknownInspectionHandoffMetadataRejected",
  "phase539DuplicateInvalidInspectionHandoffMetadataRejected",
  "phase539AuthorizingLookingInspectionHandoffMetadataRejected",
  "phase539GrantLookingInspectionHandoffMetadataRejected",
  "phase539ApprovalDecisionLookingInspectionHandoffMetadataRejected",
  "phase539ApprovalGrantLookingInspectionHandoffMetadataRejected",
  "phase539EvaluatorResultLookingInspectionHandoffMetadataRejected",
  "phase539EvaluatorExecutionLookingInspectionHandoffMetadataRejected",
  "phase539ReviewerRoutingLookingInspectionHandoffMetadataRejected",
  "phase539ReviewerAssignmentLookingInspectionHandoffMetadataRejected",
  "phase539RuntimePermissionLookingInspectionHandoffMetadataRejected",
  "phase539CommandExposureLookingInspectionHandoffMetadataRejected",
  "phase539RuntimeEffectTrueInspectionHandoffMetadataRejected",
  "phase539ProcessFlagTrueInspectionHandoffMetadataRejected",
  "phase539UnsafeInspectionHandoffMetadataRejected",
  "phase539ExecutionSignalLookingInspectionHandoffMetadataRejected",
  "phase539CleanupToolkitBaselineBehaviorPreserving",
  "phase539CleanupToolkitBaselineRuntimeBlocked",
  "phase539ServeRuntimeStillDefaultBlocked"
];
const phase539ExpectedFalseSafetyFlagNames = [
  "phase539CheckpointAuthoritative",
  "phase539InspectionHandoffCheckpointIsReviewerRouting",
  "phase539InspectionHandoffCheckpointIsReviewerAssignment",
  "phase539InspectionHandoffCheckpointIsEvaluatorExecution",
  "phase539InspectionHandoffCheckpointIsEvaluatorResult",
  "phase539InspectionHandoffCheckpointIsApprovalDecision",
  "phase539InspectionHandoffCheckpointIsApprovalGrant",
  "phase539ReviewerRoutingPerformed",
  "phase539ReviewerAssignmentPerformed",
  "phase539EvaluatorResultProduced",
  "phase539EvaluatorResultPersisted",
  "phase539ApprovalDecisionProduced",
  "phase539ApprovalDecisionPersisted",
  "phase539ApprovalGrantProduced",
  "phase539ApprovalGrantPersisted",
  "phase539RuntimePermissionGranted",
  "phase539CommandExposurePermissionGranted",
  "phase539RuntimeEnabled",
  "phase539RuntimeStarted",
  "phase539RuntimeReady",
  "phase539RuntimeCommandEnabled",
  "phase539RuntimeCommandExposureEnabled",
  "phase539RuntimeExecutionEnabled",
  "phase539RuntimeExecuted",
  "phase539EvaluatorExecutionPerformed",
  "phase539CleanupToolsInstalled",
  "phase539FallowRuntimeUsed",
  "phase539DryRunBypassesBlock",
  "phase539CanEnableRuntime",
  "phase539CliSourceChanged",
  "phase539RustSourceChanged",
  "phase539FilesystemWatcherEnabled",
  "phase539ExternalSourceLookupEnabled",
  "phase539SecretsEnvIngestionEnabled",
  "phase539LiveStdinLoopEnabled",
  "phase539RuntimeStdoutWriterEnabled",
  "phase539RuntimeStderrWriterEnabled",
  "phase539ProcessSpawnEnabled",
  "phase539ProcessTerminationEnabled",
  "phase539RuntimeSupervisionEnabled",
  "phase539RuntimeTranscriptWritePerformed",
  "phase539RuntimeAuditWritePerformed",
  "phase539AdapterRuntimeBehaviorEnabled",
  "phase539ContentFabricRuntimeBehaviorEnabled",
  "phase539WebSocketHttpSurfaceEnabled"
];
const phase539SafetyFlagNames = [
  ...phase539ExpectedTrueSafetyFlagNames,
  ...phase539ExpectedFalseSafetyFlagNames
];
const phase540DocFiles = [
  "docs/phase-5-40-review-only-checkpoint-handoff-layer.md",
  "docs/phase-5-39-review-only-inspection-handoff-checkpoint.md",
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md"
];
const phase540CrossLinks = [
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md",
  "docs/phase-5-39-review-only-inspection-handoff-checkpoint.md",
  "docs/phase-5-40-review-only-checkpoint-handoff-layer.md"
];
const phase540ExpectedCaseIds = [
  "missing-review-only-checkpoint-handoff-layer-input-rejected",
  "malformed-review-only-checkpoint-handoff-layer-input-rejected",
  "malformed-review-only-checkpoint-handoff-layer-invalid-reviewed-at-rejected",
  "empty-review-only-checkpoint-handoff-layer-input-rejected",
  "conflicting-review-only-checkpoint-handoff-layer-input-rejected",
  "stale-review-only-checkpoint-handoff-layer-input-rejected",
  "revoked-review-only-checkpoint-handoff-layer-input-rejected",
  "unknown-review-only-checkpoint-handoff-layer-input-rejected",
  "duplicate-invalid-review-only-checkpoint-handoff-layer-input-rejected",
  "authorizing-looking-review-only-checkpoint-handoff-layer-input-rejected",
  "grant-looking-review-only-checkpoint-handoff-layer-input-rejected",
  "approval-decision-looking-review-only-checkpoint-handoff-layer-input-rejected",
  "approval-grant-looking-review-only-checkpoint-handoff-layer-input-rejected",
  "evaluator-result-looking-review-only-checkpoint-handoff-layer-input-rejected",
  "evaluator-execution-looking-review-only-checkpoint-handoff-layer-input-rejected",
  "reviewer-routing-looking-review-only-checkpoint-handoff-layer-input-rejected",
  "reviewer-assignment-looking-review-only-checkpoint-handoff-layer-input-rejected",
  "runtime-permission-looking-review-only-checkpoint-handoff-layer-input-rejected",
  "command-exposure-looking-review-only-checkpoint-handoff-layer-input-rejected",
  "runtime-effect-true-review-only-checkpoint-handoff-layer-input-rejected",
  "process-flag-true-review-only-checkpoint-handoff-layer-input-rejected",
  "unsafe-top-level-review-only-checkpoint-handoff-layer-input-rejected",
  "unsafe-nested-checkpoint-handoff-metadata-review-only-checkpoint-handoff-layer-input-rejected",
  "execution-signal-looking-review-only-checkpoint-handoff-layer-input-rejected",
  "valid-review-only-checkpoint-handoff-layer"
];
const phase540ExpectedTrueSafetyFlagNames = [
  "phase540ReviewOnlyCheckpointHandoffLayerRecorded",
  "phase540CheckpointHandoffReviewOnly",
  "phase540ValidInspectionHandoffCheckpointProducesLayer",
  "phase540MissingInspectionHandoffCheckpointRejected",
  "phase540MalformedInspectionHandoffCheckpointRejected",
  "phase540EmptyInspectionHandoffCheckpointRejected",
  "phase540ConflictingInspectionHandoffCheckpointRejected",
  "phase540StaleInspectionHandoffCheckpointRejected",
  "phase540RevokedInspectionHandoffCheckpointRejected",
  "phase540UnknownInspectionHandoffCheckpointRejected",
  "phase540DuplicateInvalidInspectionHandoffCheckpointRejected",
  "phase540AuthorizingLookingInspectionHandoffCheckpointRejected",
  "phase540GrantLookingInspectionHandoffCheckpointRejected",
  "phase540ApprovalDecisionLookingInspectionHandoffCheckpointRejected",
  "phase540ApprovalGrantLookingInspectionHandoffCheckpointRejected",
  "phase540EvaluatorResultLookingInspectionHandoffCheckpointRejected",
  "phase540EvaluatorExecutionLookingInspectionHandoffCheckpointRejected",
  "phase540ReviewerRoutingLookingInspectionHandoffCheckpointRejected",
  "phase540ReviewerAssignmentLookingInspectionHandoffCheckpointRejected",
  "phase540RuntimePermissionLookingInspectionHandoffCheckpointRejected",
  "phase540CommandExposureLookingInspectionHandoffCheckpointRejected",
  "phase540RuntimeEffectTrueInspectionHandoffCheckpointRejected",
  "phase540ProcessFlagTrueInspectionHandoffCheckpointRejected",
  "phase540UnsafeCheckpointHandoffMetadataRejected",
  "phase540ExecutionSignalLookingInspectionHandoffCheckpointRejected",
  "phase540CleanupHardeningToolkitEvidenceOnly",
  "phase540ServeRuntimeStillDefaultBlocked"
];
const phase540ExpectedFalseSafetyFlagNames = [
  "phase540CheckpointHandoffAuthoritative",
  "phase540CheckpointHandoffLayerIsReviewerRouting",
  "phase540CheckpointHandoffLayerIsReviewerAssignment",
  "phase540CheckpointHandoffLayerIsEvaluatorExecution",
  "phase540CheckpointHandoffLayerIsEvaluatorResult",
  "phase540CheckpointHandoffLayerIsApprovalDecision",
  "phase540CheckpointHandoffLayerIsApprovalGrant",
  "phase540ReviewerRoutingPerformed",
  "phase540ReviewerAssignmentPerformed",
  "phase540EvaluatorResultProduced",
  "phase540EvaluatorResultPersisted",
  "phase540ApprovalDecisionProduced",
  "phase540ApprovalDecisionPersisted",
  "phase540ApprovalGrantProduced",
  "phase540ApprovalGrantPersisted",
  "phase540RuntimePermissionGranted",
  "phase540CommandExposurePermissionGranted",
  "phase540RuntimeEnabled",
  "phase540RuntimeStarted",
  "phase540RuntimeReady",
  "phase540RuntimeCommandEnabled",
  "phase540RuntimeCommandExposureEnabled",
  "phase540RuntimeExecutionEnabled",
  "phase540RuntimeExecuted",
  "phase540EvaluatorExecutionPerformed",
  "phase540ToolsInstalled",
  "phase540MegaLinterRun",
  "phase540BroadTrunkRewriteRun",
  "phase540FallowRuntimeUsed",
  "phase540DryRunBypassesBlock",
  "phase540CanEnableRuntime",
  "phase540CliSourceChanged",
  "phase540RustSourceChanged",
  "phase540FilesystemWatcherEnabled",
  "phase540ExternalSourceLookupEnabled",
  "phase540SecretsEnvIngestionEnabled",
  "phase540LiveStdinLoopEnabled",
  "phase540RuntimeStdoutWriterEnabled",
  "phase540RuntimeStderrWriterEnabled",
  "phase540ProcessSpawnEnabled",
  "phase540ProcessTerminationEnabled",
  "phase540RuntimeSupervisionEnabled",
  "phase540RuntimeTranscriptWritePerformed",
  "phase540RuntimeAuditWritePerformed",
  "phase540AdapterRuntimeBehaviorEnabled",
  "phase540ContentFabricRuntimeBehaviorEnabled",
  "phase540WebSocketHttpSurfaceEnabled"
];
const phase540SafetyFlagNames = [
  ...phase540ExpectedTrueSafetyFlagNames,
  ...phase540ExpectedFalseSafetyFlagNames
];
const phase541DocFiles = [
  "docs/phase-5-41-review-only-metadata-handoff-checkpoint.md",
  "docs/phase-5-40-review-only-checkpoint-handoff-layer.md",
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md"
];
const phase541CrossLinks = [
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md",
  "docs/phase-5-40-review-only-checkpoint-handoff-layer.md",
  "docs/phase-5-41-review-only-metadata-handoff-checkpoint.md"
];
const phase541ExpectedCaseIds = [
  "missing-review-only-metadata-handoff-checkpoint-input-rejected",
  "malformed-review-only-metadata-handoff-checkpoint-input-rejected",
  "malformed-review-only-metadata-handoff-checkpoint-invalid-reviewed-at-rejected",
  "empty-review-only-metadata-handoff-checkpoint-input-rejected",
  "conflicting-review-only-metadata-handoff-checkpoint-input-rejected",
  "stale-review-only-metadata-handoff-checkpoint-input-rejected",
  "revoked-review-only-metadata-handoff-checkpoint-input-rejected",
  "unknown-review-only-metadata-handoff-checkpoint-input-rejected",
  "duplicate-invalid-review-only-metadata-handoff-checkpoint-input-rejected",
  "authorizing-looking-review-only-metadata-handoff-checkpoint-input-rejected",
  "grant-looking-review-only-metadata-handoff-checkpoint-input-rejected",
  "approval-decision-looking-review-only-metadata-handoff-checkpoint-input-rejected",
  "approval-grant-looking-review-only-metadata-handoff-checkpoint-input-rejected",
  "evaluator-result-looking-review-only-metadata-handoff-checkpoint-input-rejected",
  "evaluator-execution-looking-review-only-metadata-handoff-checkpoint-input-rejected",
  "reviewer-routing-looking-review-only-metadata-handoff-checkpoint-input-rejected",
  "reviewer-assignment-looking-review-only-metadata-handoff-checkpoint-input-rejected",
  "runtime-permission-looking-review-only-metadata-handoff-checkpoint-input-rejected",
  "command-exposure-looking-review-only-metadata-handoff-checkpoint-input-rejected",
  "runtime-effect-true-review-only-metadata-handoff-checkpoint-input-rejected",
  "process-flag-true-review-only-metadata-handoff-checkpoint-input-rejected",
  "unsafe-top-level-review-only-metadata-handoff-checkpoint-input-rejected",
  "unsafe-nested-checkpoint-handoff-metadata-review-only-metadata-handoff-checkpoint-input-rejected",
  "execution-signal-looking-review-only-metadata-handoff-checkpoint-input-rejected",
  "valid-review-only-metadata-handoff-checkpoint"
];
const phase541ExpectedTrueSafetyFlagNames = [
  "phase541ReviewOnlyMetadataHandoffCheckpointRecorded",
  "phase541MetadataHandoffCheckpointReviewOnly",
  "phase541ValidCheckpointHandoffLayerProducesCheckpoint",
  "phase541MissingCheckpointHandoffLayerRejected",
  "phase541MalformedCheckpointHandoffLayerRejected",
  "phase541EmptyCheckpointHandoffLayerRejected",
  "phase541ConflictingCheckpointHandoffLayerRejected",
  "phase541StaleCheckpointHandoffLayerRejected",
  "phase541RevokedCheckpointHandoffLayerRejected",
  "phase541UnknownCheckpointHandoffLayerRejected",
  "phase541DuplicateInvalidCheckpointHandoffLayerRejected",
  "phase541AuthorizingLookingCheckpointHandoffLayerRejected",
  "phase541GrantLookingCheckpointHandoffLayerRejected",
  "phase541ApprovalDecisionLookingCheckpointHandoffLayerRejected",
  "phase541ApprovalGrantLookingCheckpointHandoffLayerRejected",
  "phase541EvaluatorResultLookingCheckpointHandoffLayerRejected",
  "phase541EvaluatorExecutionLookingCheckpointHandoffLayerRejected",
  "phase541ReviewerRoutingLookingCheckpointHandoffLayerRejected",
  "phase541ReviewerAssignmentLookingCheckpointHandoffLayerRejected",
  "phase541RuntimePermissionLookingCheckpointHandoffLayerRejected",
  "phase541CommandExposureLookingCheckpointHandoffLayerRejected",
  "phase541RuntimeEffectTrueCheckpointHandoffLayerRejected",
  "phase541ProcessFlagTrueCheckpointHandoffLayerRejected",
  "phase541UnsafeCheckpointHandoffMetadataRejected",
  "phase541ExecutionSignalLookingCheckpointHandoffLayerRejected",
  "phase541CleanupHardeningToolkitEvidenceOnly",
  "phase541ServeRuntimeStillDefaultBlocked"
];
const phase541ExpectedFalseSafetyFlagNames = [
  "phase541MetadataHandoffCheckpointAuthoritative",
  "phase541MetadataHandoffCheckpointIsReviewerRouting",
  "phase541MetadataHandoffCheckpointIsReviewerAssignment",
  "phase541MetadataHandoffCheckpointIsEvaluatorExecution",
  "phase541MetadataHandoffCheckpointIsEvaluatorResult",
  "phase541MetadataHandoffCheckpointIsApprovalDecision",
  "phase541MetadataHandoffCheckpointIsApprovalGrant",
  "phase541ReviewerRoutingPerformed",
  "phase541ReviewerAssignmentPerformed",
  "phase541EvaluatorResultProduced",
  "phase541EvaluatorResultPersisted",
  "phase541ApprovalDecisionProduced",
  "phase541ApprovalDecisionPersisted",
  "phase541ApprovalGrantProduced",
  "phase541ApprovalGrantPersisted",
  "phase541RuntimePermissionGranted",
  "phase541CommandExposurePermissionGranted",
  "phase541RuntimeEnabled",
  "phase541RuntimeStarted",
  "phase541RuntimeReady",
  "phase541RuntimeCommandEnabled",
  "phase541RuntimeCommandExposureEnabled",
  "phase541RuntimeExecutionEnabled",
  "phase541RuntimeExecuted",
  "phase541EvaluatorExecutionPerformed",
  "phase541ToolsInstalled",
  "phase541MegaLinterRun",
  "phase541BroadTrunkRewriteRun",
  "phase541FallowRuntimeUsed",
  "phase541DryRunBypassesBlock",
  "phase541CanEnableRuntime",
  "phase541CliSourceChanged",
  "phase541RustSourceChanged",
  "phase541FilesystemWatcherEnabled",
  "phase541ExternalSourceLookupEnabled",
  "phase541SecretsEnvIngestionEnabled",
  "phase541LiveStdinLoopEnabled",
  "phase541RuntimeStdoutWriterEnabled",
  "phase541RuntimeStderrWriterEnabled",
  "phase541ProcessSpawnEnabled",
  "phase541ProcessTerminationEnabled",
  "phase541RuntimeSupervisionEnabled",
  "phase541RuntimeTranscriptWritePerformed",
  "phase541RuntimeAuditWritePerformed",
  "phase541AdapterRuntimeBehaviorEnabled",
  "phase541ContentFabricRuntimeBehaviorEnabled",
  "phase541WebSocketHttpSurfaceEnabled"
];
const phase541SafetyFlagNames = [
  ...phase541ExpectedTrueSafetyFlagNames,
  ...phase541ExpectedFalseSafetyFlagNames
];
const phase542DocFiles = [
  "docs/phase-5-42-review-only-handoff-metadata-consolidation-layer.md",
  "docs/phase-5-41-review-only-metadata-handoff-checkpoint.md",
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md"
];
const phase542CrossLinks = [
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md",
  "docs/phase-5-41-review-only-metadata-handoff-checkpoint.md",
  "docs/phase-5-42-review-only-handoff-metadata-consolidation-layer.md"
];
const phase542ExpectedCaseIds = [
  "missing-review-only-handoff-metadata-consolidation-layer-input-rejected",
  "malformed-review-only-handoff-metadata-consolidation-layer-input-rejected",
  "malformed-review-only-handoff-metadata-consolidation-layer-invalid-reviewed-at-rejected",
  "empty-review-only-handoff-metadata-consolidation-layer-input-rejected",
  "conflicting-review-only-handoff-metadata-consolidation-layer-input-rejected",
  "stale-review-only-handoff-metadata-consolidation-layer-input-rejected",
  "revoked-review-only-handoff-metadata-consolidation-layer-input-rejected",
  "unknown-review-only-handoff-metadata-consolidation-layer-input-rejected",
  "duplicate-invalid-review-only-handoff-metadata-consolidation-layer-input-rejected",
  "authorizing-looking-review-only-handoff-metadata-consolidation-layer-input-rejected",
  "grant-looking-review-only-handoff-metadata-consolidation-layer-input-rejected",
  "approval-decision-looking-review-only-handoff-metadata-consolidation-layer-input-rejected",
  "approval-grant-looking-review-only-handoff-metadata-consolidation-layer-input-rejected",
  "evaluator-result-looking-review-only-handoff-metadata-consolidation-layer-input-rejected",
  "evaluator-execution-looking-review-only-handoff-metadata-consolidation-layer-input-rejected",
  "reviewer-routing-looking-review-only-handoff-metadata-consolidation-layer-input-rejected",
  "reviewer-assignment-looking-review-only-handoff-metadata-consolidation-layer-input-rejected",
  "runtime-permission-looking-review-only-handoff-metadata-consolidation-layer-input-rejected",
  "command-exposure-looking-review-only-handoff-metadata-consolidation-layer-input-rejected",
  "runtime-effect-true-review-only-handoff-metadata-consolidation-layer-input-rejected",
  "process-flag-true-review-only-handoff-metadata-consolidation-layer-input-rejected",
  "unsafe-top-level-review-only-handoff-metadata-consolidation-layer-input-rejected",
  "unsafe-nested-handoff-checkpoint-consolidation-metadata-review-only-handoff-metadata-consolidation-layer-input-rejected",
  "execution-signal-looking-review-only-handoff-metadata-consolidation-layer-input-rejected",
  "valid-review-only-handoff-metadata-consolidation-layer"
];
const phase542ExpectedTrueSafetyFlagNames = [
  "phase542ReviewOnlyHandoffMetadataConsolidationLayerRecorded",
  "phase542HandoffMetadataConsolidationLayerReviewOnly",
  "phase542ValidMetadataHandoffCheckpointProducesConsolidation",
  "phase542MissingMetadataHandoffCheckpointRejected",
  "phase542MalformedMetadataHandoffCheckpointRejected",
  "phase542EmptyMetadataHandoffCheckpointRejected",
  "phase542ConflictingMetadataHandoffCheckpointRejected",
  "phase542StaleMetadataHandoffCheckpointRejected",
  "phase542RevokedMetadataHandoffCheckpointRejected",
  "phase542UnknownMetadataHandoffCheckpointRejected",
  "phase542DuplicateInvalidMetadataHandoffCheckpointRejected",
  "phase542AuthorizingLookingMetadataHandoffCheckpointRejected",
  "phase542GrantLookingMetadataHandoffCheckpointRejected",
  "phase542ApprovalDecisionLookingMetadataHandoffCheckpointRejected",
  "phase542ApprovalGrantLookingMetadataHandoffCheckpointRejected",
  "phase542EvaluatorResultLookingMetadataHandoffCheckpointRejected",
  "phase542EvaluatorExecutionLookingMetadataHandoffCheckpointRejected",
  "phase542ReviewerRoutingLookingMetadataHandoffCheckpointRejected",
  "phase542ReviewerAssignmentLookingMetadataHandoffCheckpointRejected",
  "phase542RuntimePermissionLookingMetadataHandoffCheckpointRejected",
  "phase542CommandExposureLookingMetadataHandoffCheckpointRejected",
  "phase542RuntimeEffectTrueMetadataHandoffCheckpointRejected",
  "phase542ProcessFlagTrueMetadataHandoffCheckpointRejected",
  "phase542UnsafeHandoffCheckpointConsolidationMetadataRejected",
  "phase542ExecutionSignalLookingMetadataHandoffCheckpointRejected",
  "phase542NestedApprovalGrantRejected",
  "phase542NestedApprovalDecisionRejected",
  "phase542NestedReviewerAssignmentRejected",
  "phase542NestedReviewerRoutingRejected",
  "phase542NestedEvaluatorExecutionRejected",
  "phase542NestedEvaluatorResultRejected",
  "phase542NestedRuntimeEffectRejected",
  "phase542NestedCommandExposureRejected",
  "phase542MissingOrMalformedSourceDigestRejected",
  "phase542CleanupHardeningToolkitEvidenceOnly",
  "phase542ServeRuntimeStillDefaultBlocked"
];
const phase542ExpectedFalseSafetyFlagNames = [
  "phase542HandoffMetadataConsolidationLayerAuthoritative",
  "phase542HandoffMetadataConsolidationLayerIsReviewerRouting",
  "phase542HandoffMetadataConsolidationLayerIsReviewerAssignment",
  "phase542HandoffMetadataConsolidationLayerIsEvaluatorExecution",
  "phase542HandoffMetadataConsolidationLayerIsEvaluatorResult",
  "phase542HandoffMetadataConsolidationLayerIsApprovalDecision",
  "phase542HandoffMetadataConsolidationLayerIsApprovalGrant",
  "phase542ReviewerRoutingPerformed",
  "phase542ReviewerAssignmentPerformed",
  "phase542EvaluatorResultProduced",
  "phase542EvaluatorResultPersisted",
  "phase542ApprovalDecisionProduced",
  "phase542ApprovalDecisionPersisted",
  "phase542ApprovalGrantProduced",
  "phase542ApprovalGrantPersisted",
  "phase542RuntimePermissionGranted",
  "phase542CommandExposurePermissionGranted",
  "phase542RuntimeEnabled",
  "phase542RuntimeStarted",
  "phase542RuntimeReady",
  "phase542RuntimeCommandEnabled",
  "phase542RuntimeCommandExposureEnabled",
  "phase542RuntimeExecutionEnabled",
  "phase542RuntimeExecuted",
  "phase542EvaluatorExecutionPerformed",
  "phase542ToolsInstalled",
  "phase542MegaLinterRun",
  "phase542BroadTrunkRewriteRun",
  "phase542FallowRuntimeUsed",
  "phase542DryRunBypassesBlock",
  "phase542CanEnableRuntime",
  "phase542CliSourceChanged",
  "phase542RustSourceChanged",
  "phase542FilesystemWatcherEnabled",
  "phase542ExternalSourceLookupEnabled",
  "phase542SecretsEnvIngestionEnabled",
  "phase542LiveStdinLoopEnabled",
  "phase542RuntimeStdoutWriterEnabled",
  "phase542RuntimeStderrWriterEnabled",
  "phase542ProcessSpawnEnabled",
  "phase542ProcessTerminationEnabled",
  "phase542RuntimeSupervisionEnabled",
  "phase542RuntimeTranscriptWritePerformed",
  "phase542RuntimeAuditWritePerformed",
  "phase542AdapterRuntimeBehaviorEnabled",
  "phase542ContentFabricRuntimeBehaviorEnabled",
  "phase542WebSocketHttpSurfaceEnabled"
];
const phase542SafetyFlagNames = [
  ...phase542ExpectedTrueSafetyFlagNames,
  ...phase542ExpectedFalseSafetyFlagNames
];
const phase543DocFiles = [
  "docs/phase-5-43-review-only-consolidation-checkpoint-handoff.md",
  "docs/phase-5-42-review-only-handoff-metadata-consolidation-layer.md",
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md"
];
const phase543CrossLinks = [
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md",
  "docs/phase-5-42-review-only-handoff-metadata-consolidation-layer.md",
  "docs/phase-5-43-review-only-consolidation-checkpoint-handoff.md"
];
const phase543ExpectedCaseIds = [
  "missing-review-only-consolidation-checkpoint-handoff-input-rejected",
  "malformed-review-only-consolidation-checkpoint-handoff-input-rejected",
  "malformed-review-only-consolidation-checkpoint-handoff-invalid-reviewed-at-rejected",
  "empty-review-only-consolidation-checkpoint-handoff-input-rejected",
  "conflicting-review-only-consolidation-checkpoint-handoff-input-rejected",
  "stale-review-only-consolidation-checkpoint-handoff-input-rejected",
  "revoked-review-only-consolidation-checkpoint-handoff-input-rejected",
  "unknown-review-only-consolidation-checkpoint-handoff-input-rejected",
  "duplicate-invalid-review-only-consolidation-checkpoint-handoff-input-rejected",
  "authorizing-looking-review-only-consolidation-checkpoint-handoff-input-rejected",
  "grant-looking-review-only-consolidation-checkpoint-handoff-input-rejected",
  "approval-decision-looking-review-only-consolidation-checkpoint-handoff-input-rejected",
  "approval-grant-looking-review-only-consolidation-checkpoint-handoff-input-rejected",
  "evaluator-result-looking-review-only-consolidation-checkpoint-handoff-input-rejected",
  "evaluator-execution-looking-review-only-consolidation-checkpoint-handoff-input-rejected",
  "reviewer-routing-looking-review-only-consolidation-checkpoint-handoff-input-rejected",
  "reviewer-assignment-looking-review-only-consolidation-checkpoint-handoff-input-rejected",
  "runtime-permission-looking-review-only-consolidation-checkpoint-handoff-input-rejected",
  "command-exposure-looking-review-only-consolidation-checkpoint-handoff-input-rejected",
  "runtime-effect-true-review-only-consolidation-checkpoint-handoff-input-rejected",
  "process-flag-true-review-only-consolidation-checkpoint-handoff-input-rejected",
  "unsafe-top-level-review-only-consolidation-checkpoint-handoff-input-rejected",
  "unsafe-nested-consolidation-checkpoint-handoff-metadata-review-only-consolidation-checkpoint-handoff-input-rejected",
  "malformed-nested-entries-or-arrays-review-only-consolidation-checkpoint-handoff-input-rejected",
  "execution-signal-looking-review-only-consolidation-checkpoint-handoff-input-rejected",
  "mismatched-source-digest-review-only-consolidation-checkpoint-handoff-input-rejected",
  "valid-review-only-consolidation-checkpoint-handoff"
];
const phase543ExpectedTrueSafetyFlagNames = [
  "phase543ReviewOnlyConsolidationCheckpointHandoffRecorded",
  "phase543ConsolidationCheckpointHandoffReviewOnly",
  "phase543ValidHandoffMetadataConsolidationLayerProducesCheckpointHandoff",
  "phase543MissingHandoffMetadataConsolidationLayerRejected",
  "phase543MalformedHandoffMetadataConsolidationLayerRejected",
  "phase543EmptyHandoffMetadataConsolidationLayerRejected",
  "phase543ConflictingHandoffMetadataConsolidationLayerRejected",
  "phase543StaleHandoffMetadataConsolidationLayerRejected",
  "phase543RevokedHandoffMetadataConsolidationLayerRejected",
  "phase543UnknownHandoffMetadataConsolidationLayerRejected",
  "phase543DuplicateInvalidHandoffMetadataConsolidationLayerRejected",
  "phase543AuthorizingLookingHandoffMetadataConsolidationLayerRejected",
  "phase543GrantLookingHandoffMetadataConsolidationLayerRejected",
  "phase543ApprovalDecisionLookingHandoffMetadataConsolidationLayerRejected",
  "phase543ApprovalGrantLookingHandoffMetadataConsolidationLayerRejected",
  "phase543EvaluatorResultLookingHandoffMetadataConsolidationLayerRejected",
  "phase543EvaluatorExecutionLookingHandoffMetadataConsolidationLayerRejected",
  "phase543ReviewerRoutingLookingHandoffMetadataConsolidationLayerRejected",
  "phase543ReviewerAssignmentLookingHandoffMetadataConsolidationLayerRejected",
  "phase543RuntimePermissionLookingHandoffMetadataConsolidationLayerRejected",
  "phase543CommandExposureLookingHandoffMetadataConsolidationLayerRejected",
  "phase543RuntimeEffectTrueHandoffMetadataConsolidationLayerRejected",
  "phase543ProcessFlagTrueHandoffMetadataConsolidationLayerRejected",
  "phase543UnsafeConsolidationCheckpointHandoffMetadataRejected",
  "phase543MalformedNestedEntriesOrArraysRejected",
  "phase543ExecutionSignalLookingHandoffMetadataConsolidationLayerRejected",
  "phase543NestedApprovalGrantRejected",
  "phase543NestedApprovalDecisionRejected",
  "phase543NestedReviewerAssignmentRejected",
  "phase543NestedReviewerRoutingRejected",
  "phase543NestedEvaluatorExecutionRejected",
  "phase543NestedEvaluatorResultRejected",
  "phase543NestedRuntimeEffectRejected",
  "phase543NestedCommandExposureRejected",
  "phase543MissingMalformedOrMismatchedSourceDigestRejected",
  "phase543MalformedSourceEntryArraysRejected",
  "phase543CleanupHardeningToolkitEvidenceOnly",
  "phase543ServeRuntimeStillDefaultBlocked"
];
const phase543ExpectedFalseSafetyFlagNames = [
  "phase543ConsolidationCheckpointHandoffAuthoritative",
  "phase543ConsolidationCheckpointHandoffIsReviewerRouting",
  "phase543ConsolidationCheckpointHandoffIsReviewerAssignment",
  "phase543ConsolidationCheckpointHandoffIsEvaluatorExecution",
  "phase543ConsolidationCheckpointHandoffIsEvaluatorResult",
  "phase543ConsolidationCheckpointHandoffIsApprovalDecision",
  "phase543ConsolidationCheckpointHandoffIsApprovalGrant",
  "phase543ReviewerRoutingPerformed",
  "phase543ReviewerAssignmentPerformed",
  "phase543EvaluatorResultProduced",
  "phase543EvaluatorResultPersisted",
  "phase543ApprovalDecisionProduced",
  "phase543ApprovalDecisionPersisted",
  "phase543ApprovalGrantProduced",
  "phase543ApprovalGrantPersisted",
  "phase543RuntimePermissionGranted",
  "phase543CommandExposurePermissionGranted",
  "phase543RuntimeEnabled",
  "phase543RuntimeStarted",
  "phase543RuntimeReady",
  "phase543RuntimeCommandEnabled",
  "phase543RuntimeCommandExposureEnabled",
  "phase543RuntimeExecutionEnabled",
  "phase543RuntimeExecuted",
  "phase543EvaluatorExecutionPerformed",
  "phase543ToolsInstalled",
  "phase543MegaLinterRun",
  "phase543BroadTrunkRewriteRun",
  "phase543FallowRuntimeUsed",
  "phase543DryRunBypassesBlock",
  "phase543CanEnableRuntime",
  "phase543CliSourceChanged",
  "phase543RustSourceChanged",
  "phase543FilesystemWatcherEnabled",
  "phase543ExternalSourceLookupEnabled",
  "phase543SecretsEnvIngestionEnabled",
  "phase543LiveStdinLoopEnabled",
  "phase543RuntimeStdoutWriterEnabled",
  "phase543RuntimeStderrWriterEnabled",
  "phase543ProcessSpawnEnabled",
  "phase543ProcessTerminationEnabled",
  "phase543RuntimeSupervisionEnabled",
  "phase543RuntimeTranscriptWritePerformed",
  "phase543RuntimeAuditWritePerformed",
  "phase543AdapterRuntimeBehaviorEnabled",
  "phase543ContentFabricRuntimeBehaviorEnabled",
  "phase543WebSocketHttpSurfaceEnabled"
];
const phase543SafetyFlagNames = [
  ...phase543ExpectedTrueSafetyFlagNames,
  ...phase543ExpectedFalseSafetyFlagNames
];
const phase544DocFiles = [
  "docs/phase-5-44-review-only-consolidation-metadata-checkpoint.md",
  "docs/phase-5-43-review-only-consolidation-checkpoint-handoff.md",
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md"
];
const phase544CrossLinks = [
  "README.md",
  "apps/cli/README.md",
  "crates/ardyn-host/README.md",
  "docs/phase-5-43-review-only-consolidation-checkpoint-handoff.md",
  "docs/phase-5-44-review-only-consolidation-metadata-checkpoint.md"
];
const phase544ExpectedCaseIds = [
  "missing-review-only-consolidation-metadata-checkpoint-input-rejected",
  "malformed-review-only-consolidation-metadata-checkpoint-input-rejected",
  "malformed-review-only-consolidation-metadata-checkpoint-invalid-reviewed-at-rejected",
  "empty-review-only-consolidation-metadata-checkpoint-input-rejected",
  "conflicting-review-only-consolidation-metadata-checkpoint-input-rejected",
  "stale-review-only-consolidation-metadata-checkpoint-input-rejected",
  "revoked-review-only-consolidation-metadata-checkpoint-input-rejected",
  "unknown-review-only-consolidation-metadata-checkpoint-input-rejected",
  "duplicate-invalid-review-only-consolidation-metadata-checkpoint-input-rejected",
  "authorizing-looking-review-only-consolidation-metadata-checkpoint-input-rejected",
  "grant-looking-review-only-consolidation-metadata-checkpoint-input-rejected",
  "approval-decision-looking-review-only-consolidation-metadata-checkpoint-input-rejected",
  "approval-grant-looking-review-only-consolidation-metadata-checkpoint-input-rejected",
  "evaluator-result-looking-review-only-consolidation-metadata-checkpoint-input-rejected",
  "evaluator-execution-looking-review-only-consolidation-metadata-checkpoint-input-rejected",
  "reviewer-routing-looking-review-only-consolidation-metadata-checkpoint-input-rejected",
  "reviewer-assignment-looking-review-only-consolidation-metadata-checkpoint-input-rejected",
  "runtime-permission-looking-review-only-consolidation-metadata-checkpoint-input-rejected",
  "command-exposure-looking-review-only-consolidation-metadata-checkpoint-input-rejected",
  "runtime-effect-true-review-only-consolidation-metadata-checkpoint-input-rejected",
  "process-flag-true-review-only-consolidation-metadata-checkpoint-input-rejected",
  "unsafe-top-level-review-only-consolidation-metadata-checkpoint-input-rejected",
  "unsafe-nested-consolidation-metadata-checkpoint-input-rejected",
  "malformed-nested-entries-or-arrays-review-only-consolidation-metadata-checkpoint-input-rejected",
  "external-system-looking-review-only-consolidation-metadata-checkpoint-input-rejected",
  "connector-permission-looking-review-only-consolidation-metadata-checkpoint-input-rejected",
  "execution-signal-looking-review-only-consolidation-metadata-checkpoint-input-rejected",
  "mismatched-source-digest-review-only-consolidation-metadata-checkpoint-input-rejected",
  "valid-review-only-consolidation-metadata-checkpoint"
];
const phase544ExpectedNestedRegressionCaseIds = [
  "missing-source-consolidation-checkpoint-handoff-digest",
  "malformed-source-consolidation-checkpoint-handoff-digest",
  "mismatched-source-consolidation-checkpoint-handoff-digest",
  "missing-nested-source-handoff-metadata-consolidation-layer-digest",
  "malformed-nested-source-handoff-metadata-consolidation-layer-digest",
  "nested-approval-grant-rejected",
  "nested-approval-decision-rejected",
  "nested-reviewer-assignment-rejected",
  "nested-reviewer-routing-rejected",
  "nested-evaluator-execution-rejected",
  "nested-evaluator-result-rejected",
  "nested-runtime-effect-rejected",
  "nested-command-exposure-rejected",
  "nested-external-source-lookup-rejected",
  "nested-filesystem-watcher-rejected",
  "nested-source-url-rejected",
  "nested-source-file-path-rejected",
  "nested-env-field-rejected",
  "nested-secrets-field-rejected",
  "nested-process-control-field-rejected",
  "nested-external-system-metadata-rejected",
  "nested-connector-permission-grant-rejected",
  "malformed-source-entry-null-rejected",
  "malformed-source-entry-array-rejected",
  "malformed-nested-entry-array-rejected"
];
const phase544ExpectedTrueSafetyFlagNames = [
  "phase544ReviewOnlyConsolidationMetadataCheckpointRecorded",
  "phase544ConsolidationMetadataCheckpointReviewOnly",
  "phase544ValidConsolidationCheckpointHandoffProducesMetadataCheckpoint",
  "phase544MissingConsolidationCheckpointHandoffRejected",
  "phase544MalformedConsolidationCheckpointHandoffRejected",
  "phase544EmptyConsolidationCheckpointHandoffRejected",
  "phase544ConflictingConsolidationCheckpointHandoffRejected",
  "phase544StaleConsolidationCheckpointHandoffRejected",
  "phase544RevokedConsolidationCheckpointHandoffRejected",
  "phase544UnknownConsolidationCheckpointHandoffRejected",
  "phase544DuplicateInvalidConsolidationCheckpointHandoffRejected",
  "phase544AuthorizingLookingConsolidationCheckpointHandoffRejected",
  "phase544GrantLookingConsolidationCheckpointHandoffRejected",
  "phase544ApprovalDecisionLookingConsolidationCheckpointHandoffRejected",
  "phase544ApprovalGrantLookingConsolidationCheckpointHandoffRejected",
  "phase544EvaluatorResultLookingConsolidationCheckpointHandoffRejected",
  "phase544EvaluatorExecutionLookingConsolidationCheckpointHandoffRejected",
  "phase544ReviewerRoutingLookingConsolidationCheckpointHandoffRejected",
  "phase544ReviewerAssignmentLookingConsolidationCheckpointHandoffRejected",
  "phase544RuntimePermissionLookingConsolidationCheckpointHandoffRejected",
  "phase544CommandExposureLookingConsolidationCheckpointHandoffRejected",
  "phase544RuntimeEffectTrueConsolidationCheckpointHandoffRejected",
  "phase544ProcessFlagTrueConsolidationCheckpointHandoffRejected",
  "phase544UnsafeConsolidationMetadataCheckpointRejected",
  "phase544MalformedNestedEntriesOrArraysRejected",
  "phase544ExternalSystemLookingMetadataRejected",
  "phase544ConnectorPermissionLookingMetadataRejected",
  "phase544ExecutionSignalLookingConsolidationCheckpointHandoffRejected",
  "phase544NestedApprovalGrantRejected",
  "phase544NestedApprovalDecisionRejected",
  "phase544NestedReviewerAssignmentRejected",
  "phase544NestedReviewerRoutingRejected",
  "phase544NestedEvaluatorExecutionRejected",
  "phase544NestedEvaluatorResultRejected",
  "phase544NestedRuntimeEffectRejected",
  "phase544NestedCommandExposureRejected",
  "phase544NestedExternalSourceLookupRejected",
  "phase544NestedFilesystemWatcherRejected",
  "phase544NestedUrlFilePathEnvSecretsProcessControlRejected",
  "phase544MissingMalformedOrMismatchedSourceDigestRejected",
  "phase544MalformedSourceEntryArraysRejected",
  "phase544CleanupHardeningToolkitEvidenceOnly",
  "phase544ServeRuntimeStillDefaultBlocked"
];
const phase544ExpectedFalseSafetyFlagNames = [
  "phase544ConsolidationMetadataCheckpointAuthoritative",
  "phase544ConsolidationMetadataCheckpointIsReviewerRouting",
  "phase544ConsolidationMetadataCheckpointIsReviewerAssignment",
  "phase544ConsolidationMetadataCheckpointIsEvaluatorExecution",
  "phase544ConsolidationMetadataCheckpointIsEvaluatorResult",
  "phase544ConsolidationMetadataCheckpointIsApprovalDecision",
  "phase544ConsolidationMetadataCheckpointIsApprovalGrant",
  "phase544ReviewerRoutingPerformed",
  "phase544ReviewerAssignmentPerformed",
  "phase544EvaluatorResultProduced",
  "phase544EvaluatorResultPersisted",
  "phase544ApprovalDecisionProduced",
  "phase544ApprovalDecisionPersisted",
  "phase544ApprovalGrantProduced",
  "phase544ApprovalGrantPersisted",
  "phase544RuntimePermissionGranted",
  "phase544CommandExposurePermissionGranted",
  "phase544RuntimeEnabled",
  "phase544RuntimeStarted",
  "phase544RuntimeReady",
  "phase544RuntimeCommandEnabled",
  "phase544RuntimeCommandExposureEnabled",
  "phase544RuntimeExecutionEnabled",
  "phase544RuntimeExecuted",
  "phase544EvaluatorExecutionPerformed",
  "phase544ToolsInstalled",
  "phase544MegaLinterRun",
  "phase544BroadTrunkRewriteRun",
  "phase544FallowRuntimeUsed",
  "phase544DryRunBypassesBlock",
  "phase544CanEnableRuntime",
  "phase544CliSourceChanged",
  "phase544RustSourceChanged",
  "phase544FilesystemWatcherEnabled",
  "phase544ExternalSourceLookupEnabled",
  "phase544SecretsEnvIngestionEnabled",
  "phase544ConnectorIngestionAdded",
  "phase544ExternalSystemIntegrated",
  "phase544LiveStdinLoopEnabled",
  "phase544RuntimeStdoutWriterEnabled",
  "phase544RuntimeStderrWriterEnabled",
  "phase544ProcessSpawnEnabled",
  "phase544ProcessTerminationEnabled",
  "phase544RuntimeSupervisionEnabled",
  "phase544RuntimeTranscriptWritePerformed",
  "phase544RuntimeAuditWritePerformed",
  "phase544AdapterRuntimeBehaviorEnabled",
  "phase544ContentFabricRuntimeBehaviorEnabled",
  "phase544WebSocketHttpSurfaceEnabled"
];
const phase544SafetyFlagNames = [
  ...phase544ExpectedTrueSafetyFlagNames,
  ...phase544ExpectedFalseSafetyFlagNames
];
const phase545DocFiles = [
  "docs/phase-5-45-target-consumer-planning-metadata.md",
  "docs/phase-5-44-review-only-consolidation-metadata-checkpoint.md"
];
const phase545CrossLinks = [
  "docs/phase-5-44-review-only-consolidation-metadata-checkpoint.md",
  "docs/phase-5-45-target-consumer-planning-metadata.md"
];
const phase545ExpectedTrueSafetyFlagNames = [
  "phase545TargetConsumerPlanningMetadataRecorded",
  "phase545TargetConsumerPlanningMetadataReviewOnly",
  "phase545TargetConsumerPlanningMetadataProduced",
  "phase545PrimaryHarnessFrameworkWrapperLayer",
  "phase545LocusFirstClassTargetConsumer",
  "phase545MultiverseFirstClassTargetConsumer",
  "phase545SecureDropFutureContentFabricCapabilityReferenceOnly",
  "phase545ServeRuntimeStillDefaultBlocked"
];
const phase545ExpectedFalseSafetyFlagNames = [
  "phase545TargetConsumerPlanningMetadataAuthoritative",
  "phase545CommandRuntimeControlEnabled",
  "phase545RuntimePermissionGranted",
  "phase545CommandExposurePermissionGranted",
  "phase545RuntimeCommandExposureEnabled",
  "phase545RuntimeExecutionEnabled",
  "phase545ReviewerRoutingPerformed",
  "phase545ReviewerAssignmentPerformed",
  "phase545EvaluatorExecutionPerformed",
  "phase545EvaluatorResultProduced",
  "phase545ApprovalDecisionProduced",
  "phase545ApprovalGrantProduced",
  "phase545ApprovalGrantPersisted",
  "phase545ConnectorGrantProduced",
  "phase545ConnectorIngestionAdded",
  "phase545LiveRegistryConnectionEnabled",
  "phase545WebSocketRuntimeEnabled",
  "phase545HttpRuntimeEnabled",
  "phase545TaskRuntimeExecutionEnabled",
  "phase545McpRuntimeExecutionEnabled",
  "phase545FabricRuntimeSurfaceEnabled",
  "phase545ContentFabricRuntimeBehaviorEnabled",
  "phase545AdapterRuntimeBehaviorEnabled",
  "phase545SecureDropImplemented",
  "phase545SecureDropCryptoImplemented",
  "phase545SecureDropTransportImplemented",
  "phase545SecureDropStegoImplemented",
  "phase545SecureDropSendReceiveImplemented",
  "phase545SecureDropInboxPollingEnabled",
  "phase545FileSelectionEnabled",
  "phase545FilesystemWatcherEnabled",
  "phase545FilesystemScanningEnabled",
  "phase545SecretVaultEnvAccessEnabled",
  "phase545St3ggVendored",
  "phase545ProcessControlEnabled",
  "phase545LiveStdinLoopEnabled",
  "phase545RuntimeStdoutWriterEnabled",
  "phase545RuntimeStderrWriterEnabled",
  "phase545RuntimeTranscriptWritePerformed",
  "phase545RuntimeAuditWritePerformed",
  "phase545DryRunBypassesBlock",
  "phase545CliSourceChanged",
  "phase545RustSourceChanged",
  "phase545FabricSourceChanged"
];
const phase545SafetyFlagNames = [
  ...phase545ExpectedTrueSafetyFlagNames,
  ...phase545ExpectedFalseSafetyFlagNames
];
const phase546DocFiles = [
  "docs/phase-5-46-consumer-contract-readiness-matrix.md",
  "docs/phase-5-45-target-consumer-planning-metadata.md"
];
const phase546CrossLinks = [
  "docs/phase-5-45-target-consumer-planning-metadata.md",
  "docs/phase-5-46-consumer-contract-readiness-matrix.md"
];
const phase546ExpectedTrueSafetyFlagNames = [
  "phase546ConsumerContractReadinessMatrixRecorded",
  "phase546ConsumerContractReadinessMatrixReviewOnly",
  "phase546ConsumerContractReadinessMatrixProduced",
  "phase546LocusTouchpointsCovered",
  "phase546MultiverseTouchpointsCovered",
  "phase546SecureDropFutureContentFabricCapabilityReferenceOnly",
  "phase546ServeRuntimeStillDefaultBlocked"
];
const phase546ExpectedFalseSafetyFlagNames = [
  "phase546FallowRuntimeUsed",
  "phase546ConsumerContractReadinessMatrixAuthoritative",
  "phase546CommandRuntimeControlEnabled",
  "phase546RuntimePermissionGranted",
  "phase546CommandExposurePermissionGranted",
  "phase546RuntimeCommandExposureEnabled",
  "phase546RuntimeExecutionEnabled",
  "phase546ReviewerRoutingPerformed",
  "phase546ReviewerAssignmentPerformed",
  "phase546EvaluatorExecutionPerformed",
  "phase546EvaluatorResultProduced",
  "phase546ApprovalDecisionProduced",
  "phase546ApprovalGrantProduced",
  "phase546ApprovalGrantPersisted",
  "phase546ConnectorGrantProduced",
  "phase546ConnectorIngestionAdded",
  "phase546LiveRegistryConnectionEnabled",
  "phase546WebSocketRuntimeEnabled",
  "phase546HttpRuntimeEnabled",
  "phase546TaskRuntimeExecutionEnabled",
  "phase546TaskExecutionEnabled",
  "phase546McpRuntimeExecutionEnabled",
  "phase546McpToolExposureEnabled",
  "phase546FabricRuntimeSurfaceEnabled",
  "phase546ContentFabricRuntimeBehaviorEnabled",
  "phase546AdapterRuntimeBehaviorEnabled",
  "phase546SecureDropImplemented",
  "phase546SecureDropCryptoImplemented",
  "phase546SecureDropTransportImplemented",
  "phase546SecureDropStegoImplemented",
  "phase546SecureDropSendReceiveImplemented",
  "phase546SecureDropInboxPollingEnabled",
  "phase546FileSelectionEnabled",
  "phase546FilesystemWatcherEnabled",
  "phase546FilesystemScanningEnabled",
  "phase546SecretVaultEnvAccessEnabled",
  "phase546St3ggVendored",
  "phase546ProcessControlEnabled",
  "phase546LiveStdinLoopEnabled",
  "phase546RuntimeStdoutWriterEnabled",
  "phase546RuntimeStderrWriterEnabled",
  "phase546RuntimeTranscriptWritePerformed",
  "phase546RuntimeAuditWritePerformed",
  "phase546DryRunBypassesBlock",
  "phase546CliSourceChanged",
  "phase546RustSourceChanged",
  "phase546FabricSourceChanged"
];
const phase546SafetyFlagNames = [
  ...phase546ExpectedTrueSafetyFlagNames,
  ...phase546ExpectedFalseSafetyFlagNames
];
const phase42DRuntimeLikeCommandRejectionProbes = [
  "serve-runtime",
  "stdio-runtime",
  "replay-session-transcript",
  "external-review-packet",
  "review-packet",
  "runtime-readiness-review",
  "runtime-implementation-readiness",
  "phase-4-2a-runtime-skeleton",
  "runtime-skeleton",
  "runtime-lifecycle",
  "phase-4-2b-lifecycle-runtime",
  "phase-4-2b-failure-audit",
  "phase-4-2c-runtime-readiness-review-gate",
  "phase-4-2c-readiness-gate",
  "phase-4-2d-external-review-disposition",
  "phase-4-2d-phase5-handoff",
  "runtime-readiness-gate",
  "readiness-gate",
  "phase-5-1-controlled-runtime-implementation-approval",
  "controlled-runtime-implementation-approval",
  "runtime-implementation-approval",
  "runtime-command-surface-review",
  "approve-runtime-implementation",
  "approve-runtime-command",
  "phase-5-runtime",
  "phase-5-1-runtime",
  "failure-audit-runtime",
  "cleanup-runtime",
  "kill-runtime",
  "approve-runtime",
  "grant-runtime",
  "enable-runtime"
];
const phase51RuntimeLikeCommandRejectionProbes = [
  "serve-runtime",
  "stdio-runtime",
  "replay-session-transcript",
  "external-review-packet",
  "review-packet",
  "runtime-readiness-review",
  "grant-runtime",
  "runtime-implementation-approval",
  "runtime-command-surface-review",
  "controlled-runtime-implementation-approval",
  "phase-5-1-controlled-runtime-implementation-approval",
  "approve-runtime-implementation",
  "approve-runtime-command",
  "approve-runtime",
  "enable-runtime",
  "phase-5-runtime",
  "phase-5-1-runtime",
  "runtime-start",
  "runtime-stop",
  "runtime-status",
  "runtime-rollback",
  "runtime-failure-audit"
];
const phase52RuntimeLikeCommandRejectionProbes = [
  "serve-runtime",
  "stdio-runtime",
  "replay-session-transcript",
  "external-review-packet",
  "review-packet",
  "runtime-readiness-review",
  "grant-runtime",
  "runtime-implementation-approval",
  "runtime-command-surface-review",
  "controlled-runtime-implementation-approval",
  "approve-runtime-implementation",
  "approve-runtime-command",
  "approve-runtime",
  "enable-runtime",
  "phase-5-runtime",
  "phase-5-1-runtime",
  "phase-5-2-runtime",
  "phase-5-2-guarded-runtime",
  "guarded-runtime-implementation",
  "runtime-start",
  "runtime-stop",
  "runtime-status",
  "runtime-rollback",
  "runtime-failure-audit"
];

async function readJson(url) {
  return JSON.parse(await readFile(url, "utf8"));
}

async function runReport() {
  const { stdout, stderr } = await execFileAsync(process.execPath, [reportScriptPath], {
    cwd: repoRoot,
    maxBuffer: 4 * 1024 * 1024
  });

  assert.equal(stderr, "");
  return JSON.parse(stdout);
}

function assertAllFalse(record) {
  for (const [field, value] of Object.entries(record)) {
    assert.equal(value, false, field);
  }
}

function assertKnownInventoryStatuses(entries) {
  for (const entry of entries) {
    assert.match(entry.status, /^(present|missing)$/, entry.path);
  }
}

function removeSafetyFlags(flags, flagNames) {
  for (const flagName of flagNames) {
    delete flags[flagName];
  }
}

function assertSafetyFlags(report, flagNames, expectedValue) {
  for (const flagName of flagNames) {
    assert.equal(report.safetyPosture.flags[flagName], expectedValue);
  }
}

test("package exposes report:phase-status without replacing existing test scripts", async () => {
  const packageJson = await readJson(packageJsonUrl);

  assert.equal(packageJson.scripts.test, "node --test tests/*.test.mjs");
  assert.equal(
    packageJson.scripts["test:schemas"],
    "node --test tests/schema-validation.test.mjs tests/session-event-schema.test.mjs tests/session-transcript-schema.test.mjs"
  );
  assert.equal(packageJson.scripts["report:phase-status"], "node scripts/report-phase-status.mjs");
});

test("phase status report is Phase 5.46 consumer contract readiness matrix and does not claim to run checks", async () => {
  const report = await runReport();

  assert.equal(report.schemaVersion, "ardyn.phase-status-report.v1");
  assert.deepEqual(report.phase, {
    id: "5.46",
    name: "Locus and Multiverse consumer contract readiness matrix",
    executionPosture:
      "consumer-contract-readiness-matrix runtime-disabled no-new-runtime-capability no-command-runtime-control no-reviewer-routing no-reviewer-assignment no-evaluator-execution no-evaluator-result no-runtime-execution no-approval-decision no-approval-grant no-command-exposure no-connector-grant no-fabric-runtime no-websocket-runtime no-mcp-runtime no-task-runtime no-secure-drop-runtime"
  });
  assert.equal(report.reportMode, "local-summary-only");
  assert.equal(report.reportRunsChecks, false);
  assert.equal(report.externalCi.ran, false);
  assert.equal(report.externalCi.claimed, false);
  assert.match(report.externalCi.note, /does not query or imply external CI/i);
});

test("report lists configured checks and verification commands without running them", async () => {
  const report = await runReport();

  assert.deepEqual(report.configuredChecks, [
    {
      name: "test",
      command: "npm test",
      packageScript: "node --test tests/*.test.mjs",
      ranByReport: false
    },
    {
      name: "test:schemas",
      command: "npm run test:schemas",
      packageScript:
        "node --test tests/schema-validation.test.mjs tests/session-event-schema.test.mjs tests/session-transcript-schema.test.mjs",
      ranByReport: false
    },
    {
      name: "report:phase-status",
      command: "npm run report:phase-status",
      packageScript: "node scripts/report-phase-status.mjs",
      ranByReport: false
    }
  ]);

  const verificationByCommand = new Map(
    report.verificationCommands.map((entry) => [entry.command, entry])
  );

  assert.equal(verificationByCommand.size, report.verificationCommands.length);
  for (const { ranByReport } of report.verificationCommands) {
    assert.equal(ranByReport, false);
  }

  assert.deepEqual(Array.from(verificationByCommand.keys()).slice(0, 15), [
    "npm test",
    "npm run test:schemas",
    "cargo test --workspace",
    "cargo check --workspace",
    "cargo fmt --check",
    "cargo clippy --workspace -- -D warnings",
    "cargo audit",
    "cargo machete",
    "git diff --check",
    "git diff --cached --check",
    "npm audit --json",
    "fallow health --score --hotspots --targets --format json",
    "fallow audit --format json",
    "npm run report:phase-status",
    "node --test tests/report-phase-status.test.mjs"
  ]);

  assert.equal(
    verificationByCommand.get("npm run report:phase-status").purpose,
    "Render this deterministic local Phase 5.46 consumer contract readiness matrix status report."
  );
  assert.equal(
    verificationByCommand.get("node --test tests/report-phase-status.test.mjs").purpose,
    "Run focused tests for this local Phase 5.46 status report."
  );
  assert.equal(
    verificationByCommand.get("semgrep --config auto .").purpose,
    "Run Semgrep as evidence only for Phase 5.46 without folding unrelated findings into this phase."
  );
  assert.equal(
    verificationByCommand.get(
      "node --test tests/phase5-46-consumer-contract-readiness-matrix.test.mjs"
    ).purpose,
    "Run focused Phase 5.46 Locus/Multiverse consumer contract readiness matrix and blocked-runtime checks."
  );
  assert.equal(
    verificationByCommand.get(
      "node --test tests/phase5-45-target-consumer-planning-metadata.test.mjs"
    ).purpose,
    "Run focused Phase 5.45 Locus/Multiverse target-consumer planning metadata and blocked-runtime checks."
  );
  assert.equal(
    verificationByCommand.get(
      "node --test tests/phase5-28-review-only-evaluator-preflight-checkpoint.test.mjs"
    ).purpose,
    "Run focused Phase 5.28 review-only evaluator preflight checkpoint, Phase 5.44A prototype-pollution regression, and blocked-runtime checks."
  );
  assert.equal(
    verificationByCommand.get(
      "node --test tests/phase5-44-review-only-consolidation-metadata-checkpoint.test.mjs"
    ).purpose,
    "Run focused Phase 5.44 review-only consolidation metadata checkpoint and blocked-runtime checks."
  );
  assert.equal(
    verificationByCommand.get(
      "node --test tests/phase5-43-review-only-consolidation-checkpoint-handoff.test.mjs"
    ).purpose,
    "Run focused Phase 5.43 review-only consolidation checkpoint handoff and blocked-runtime checks."
  );
  assert.match(
    verificationByCommand.get("cargo audit").purpose,
    /Rust dependency advisory audit/
  );
  assert.match(
    verificationByCommand.get("cargo machete").purpose,
    /Rust unused-dependency advisory/
  );
  assert.match(
    verificationByCommand.get("cargo clippy --workspace -- -D warnings").purpose,
    /Rust linter\/static-analysis/
  );
  assert.match(
    verificationByCommand.get("npm audit --json").purpose,
    /dependency security audit/
  );
  assert.match(
    verificationByCommand.get("fallow health --score --hotspots --targets --format json")
      .purpose,
    /without using Fallow Runtime/
  );
  assert.match(
    verificationByCommand.get("fallow audit --format json").purpose,
    /without using Fallow Runtime/
  );

  for (const command of [
    "node --test tests/phase5-39-review-only-inspection-handoff-checkpoint.test.mjs",
    "node --test tests/phase5-38-review-only-inspection-handoff-metadata-boundary.test.mjs",
    "node --test tests/phase5-37-review-only-handoff-disposition-inspection-checkpoint.test.mjs",
    "node --test tests/phase5-2-runtime-default-blocked.test.mjs",
    "cargo test -p ardyn-host stdio_runtime",
    "node --test tests/phase4-0i-final-pre-runtime-readiness.test.mjs",
    "node --test tests/core-phase3-5-trace-fixtures.test.mjs"
  ]) {
    assert.ok(verificationByCommand.has(command), command);
  }
});

test("report inventories Phase 3.8 identity, Fabric family, Locus freeze, and session events", async () => {
  const report = await runReport();

  assert.deepEqual(report.phase38Inventory.harnessIdentity, {
    canonicalSlug: "ardyn",
    packageNamespace: "ardyn",
    manifestFacingHarnessId: "ardyn",
    keyringNamespace: "ardyn",
    fabricFamily: "ardyn",
    futureLocusConnectorExpectedId: "ardyn",
    multiverseIntegration: "optional-external",
    locusRuntimeDependency: false
  });

  assert.deepEqual(report.phase38Inventory.fabricFamilySet, [
    "*",
    "locus",
    "multiverse",
    "kortex-audio",
    "locus-evolution-lab",
    "somatic",
    "ardyn"
  ]);

  assert.deepEqual(report.phase38Inventory.staleSlugPolicy, {
    legacyArdynOsVariantsAcceptedAsCurrentHarnessId: false,
    acceptedAsCurrentHarnessId: false,
    allowedOnlyInNegativeTests: true
  });

  assert.deepEqual(report.phase38Inventory.locusDisplayContract, {
    freezeMarker: "PHASE_3_X_LOCUS_DISPLAY_CONTRACT_FROZEN",
    phase3xReadOnlyContractFrozen: true,
    locusMayDisplayPlannerTraces: true,
    locusMayDisplayReviewArtifacts: true,
    locusMayDisplayTraceDiffs: true,
    locusMayDisplaySchemaStatus: true,
    locusMayDisplayAttestationPlans: true,
    locusMayDisplaySessionEventFixtures: true,
    locusRuntimeDependency: false,
    approvalBypassAllowed: false,
    safetyBypassAllowed: false
  });

  assert.deepEqual(report.phase38Inventory.sessionEvents, {
    schema: "https://schemas.ardyn.ai/session-event.schema.json",
    schemaVersion: "0.1.0",
    sourceHarness: "ardyn",
    transportRoadmap: {
      firstFutureTransport: "stdio",
      stdioRuntimeImplemented: false,
      websocketRuntimeImplemented: false,
      httpRuntimeImplemented: false
    },
    eventTypes: [
      "session.started",
      "session.heartbeat",
      "session.capabilities",
      "task.planned",
      "approval.requested",
      "approval.recorded",
      "session.completed",
      "session.error"
    ],
    validExampleDirectory: "examples/session-events",
    invalidFixtures: ["invalid-source-harness.json", "invalid-safety-flag.json"],
    nonExecuting: true
  });

  assert.deepEqual(
    report.phase38Inventory.docs.map(({ path, status }) => [path, status]),
    [
      ["docs/harness-identity.md", "present"],
      ["docs/session-events-stdio-contract.md", "present"],
      ["docs/content-fabric.md", "present"],
      ["docs/locus-trace-display-contract.md", "present"]
    ]
  );

  assert.deepEqual(
    report.phase38Inventory.tests.map(({ path, status }) => [path, status]),
    [
      ["tests/phase3-8-locus-family-alignment.test.mjs", "present"],
      ["tests/session-event-schema.test.mjs", "present"],
      ["tests/fabric.test.mjs", "present"]
    ]
  );
});

test("report inventories review-trace commands and explicit-only output behavior", async () => {
  const report = await runReport();

  assert.deepEqual(report.phase36Inventory.reviewTraceCommands, [
    {
      command: "ardyn review-trace <left> <right>",
      mode: "default",
      writesFiles: false,
      summary: "Renders the non-executing trace review comparison in the default local review format."
    },
    {
      command: "ardyn review-trace --summary <left> <right>",
      mode: "summary",
      writesFiles: false,
      summary: "Renders a concise local summary of trace review changes."
    },
    {
      command: "ardyn review-trace --explain <left> <right>",
      mode: "explain",
      writesFiles: false,
      summary: "Renders reviewer-oriented local explanations for trace review changes."
    }
  ]);

  assert.deepEqual(report.phase36Inventory.exportErgonomics, {
    reportWritesFiles: false,
    reportOutputFileSupport: false,
    reviewTraceWritesFiles: false,
    reviewArtifactOutputCommand: "ardyn plan --review-artifact --output <file>",
    reviewArtifactOutputRequiresExplicitCliFlag: true,
    summary:
      "The report script is stdout-only local metadata; artifact file writes are only available through an explicit plan --review-artifact --output CLI request."
  });
});

test("report inventories Phase 3.9 transcript contract hardening and static review metadata", async () => {
  const report = await runReport();

  assert.deepEqual(report.phase39Inventory.transcriptSchema, {
    schema: "https://schemas.ardyn.ai/session-transcript.schema.json",
    schemaName: "ardyn.session-transcript",
    schemaVersion: "0.1.0",
    sourceHarness: "ardyn",
    nonExecuting: true,
    additionalProperties: false,
    unknownTopLevelFieldsRejected: true,
    unknownFutureMetadataInertUntilVersioned: true,
    semanticChecksOutsideJsonSchema: [
      "first-event-session-started",
      "contiguous-sequence-ordering",
      "cross-event-session-id-match",
      "cross-event-source-harness-match"
    ]
  });

  assert.deepEqual(report.phase39Inventory.transcriptFixtures, {
    directory: "examples/session-transcripts",
    files: [
      { path: "examples/session-transcripts/valid-error.json", status: "present" },
      { path: "examples/session-transcripts/valid-minimal.json", status: "present" },
      { path: "examples/session-transcripts/valid-task-approval.json", status: "present" },
      { path: "examples/session-transcripts/invalid-missing-session-started.json", status: "present" },
      { path: "examples/session-transcripts/invalid-out-of-order-sequence.json", status: "present" },
      { path: "examples/session-transcripts/invalid-safety-flag.json", status: "present" },
      { path: "examples/session-transcripts/invalid-source-harness.json", status: "present" }
    ]
  });

  assert.deepEqual(
    report.phase39Inventory.transcriptDocs.map(({ path, status }) => [path, status]),
    [
      ["docs/session-events-stdio-contract.md", "present"],
      ["docs/host-policy-preconditions.md", "present"],
      ["docs/locus-trace-display-contract.md", "present"],
      ["README.md", "present"]
    ]
  );

  assert.deepEqual(
    report.phase39Inventory.transcriptTests.map(({ path, status }) => [path, status]),
    [
      ["tests/session-transcript-schema.test.mjs", "present"],
      ["tests/core-phase3-9-session-transcripts.test.mjs", "present"],
      ["tests/report-phase-status.test.mjs", "present"]
    ]
  );

  assert.deepEqual(report.phase39Inventory.cliValidationCommandMetadata, {
    expectedCommand: "ardyn validate-session-transcript --file <file>",
    optionalModes: ["--summary", "--explain"],
    summary:
      "Implemented local read-only transcript validation command for static JSON review; Phase 3.9 does not implement a live stdio runtime.",
    filePolicy: {
      acceptsLocalFileOnly: true,
      urlsAllowed: false,
      fileUrlsAllowed: false,
      networkSharePathsAllowed: false,
      arbitraryLocalJsonPathsAllowed: true
    },
    writesFiles: false,
    network: false,
    stdioRuntime: false,
    processSpawning: false,
    locusRuntimeDependency: false
  });

  assert.deepEqual(report.phase39Inventory.safetyPreconditions, {
    explicitApprovalRequiredForTaskExecution: true,
    adapterPermissionDeclarationsRequired: true,
    rustHostPolicyRequiredForProcessNetworkFilesystemAccess: true,
    codePackEnablementRequiresFabricVerificationQuarantineEnablePolicy: true,
    stdoutStderrAndLineDelimitedJsonPolicyRequiredBeforeRuntime: true,
    locusRole: "peer-client-viewer-or-future-controller-only"
  });
});

test("report inventories Phase 3.10 transcript versioning and display metadata", async () => {
  const report = await runReport();

  assert.deepEqual(report.phase310Inventory.transcriptVersioning, {
    schema: "ardyn.session-transcript",
    schemaVersion: "0.1.0",
    schemaVersionSemantics:
      "Semantic version metadata for transcript envelope, safety proof, and event semantics; not a runtime permission.",
    compatibilityClasses: ["compatible", "upgrade_available", "unsupported_major", "malformed"],
    currentSupportedMajor: 0,
    sameMajorPatchMinorDisplayCompatible: true,
    sameMajorOlderMayBeUpgradeAvailable: true,
    unsupportedMajorBehavior:
      "Show identity, version, warnings, and raw inert metadata only; do not interpret current event or safety semantics.",
    malformedBehavior:
      "Show validation errors and raw inert metadata only; do not treat as ARDYN review evidence.",
    strictCurrentSchemaAllowsExtraTopLevelFields: false,
    unknownFieldsInertForCompatibilityAndDisplay: true,
    strictValidatorMayRejectCurrentSchemaExtraFields: true,
    deterministicTimestampPolicy: {
      liveTimestampsAllowedForMigrationOrStatusRecords: false,
      fixtureSuppliedTimestampsAllowed: true,
      deterministicTestMetadata: true,
      exampleEventCreatedAt: "1970-01-01T00:00:00.000Z",
      exampleGeneratedAt: "2026-06-02T00:00:00.000Z"
    },
    nonExecuting: true
  });

  assert.deepEqual(report.phase310Inventory.commandExamples, [
    {
      command: "ardyn validate-session-transcript --file <file> --schema-status",
      status: "implemented-local-read-only",
      writesFiles: false,
      network: false,
      processSpawning: false,
      stdioRuntime: false,
      summary:
        "Renders schema id, schemaVersion, compatibility class, migration availability, warnings, and safety posture for one local transcript."
    },
    {
      command: "ardyn validate-session-transcript --file <file> --display-summary",
      status: "implemented-local-read-only",
      writesFiles: false,
      network: false,
      processSpawning: false,
      stdioRuntime: false,
      summary:
        "Renders the Locus-facing read-only transcript summary fields for one local transcript."
    },
    {
      command: "ardyn validate-session-transcript --file <file> --compatibility-explain",
      status: "implemented-local-read-only",
      writesFiles: false,
      network: false,
      processSpawning: false,
      stdioRuntime: false,
      summary:
        "Renders compatibility reasoning, strict-validator notes, unknown-field policy, warnings, and severity mapping."
    }
  ]);

  assert.deepEqual(report.phase310Inventory.safetyPosture, {
    noLiveStdioRuntime: true,
    noCommandExecutionSemantics: true,
    noNetworkCalls: true,
    noProcessRuntime: true,
    noPluginInstall: true,
    noTorrentBehavior: true,
    noContentFabricRuntimeBehavior: true,
    noCodePackBehavior: true,
    noLocusRuntimeDependency: true
  });

  assert.deepEqual(
    report.phase310Inventory.docs.map(({ path, status }) => [path, status]),
    [
      ["docs/session-transcript-versioning-policy.md", "present"],
      ["docs/session-events-stdio-contract.md", "present"],
      ["docs/locus-trace-display-contract.md", "present"],
      ["README.md", "present"]
    ]
  );

  assert.deepEqual(
    report.phase310Inventory.fixtures.map(({ path, status }) => [path, status]),
    [
      ["tests/fixtures/session-transcripts/phase3-10/current-compatible.json", "present"],
      ["tests/fixtures/session-transcripts/phase3-10/display-summary.json", "present"],
      ["tests/fixtures/session-transcripts/phase3-10/inert-unknown-fields.json", "present"],
      ["tests/fixtures/session-transcripts/phase3-10/malformed.json", "present"],
      ["tests/fixtures/session-transcripts/phase3-10/migration-metadata.json", "present"],
      [
        "tests/fixtures/session-transcripts/phase3-10/older-compatible-upgrade-available.json",
        "present"
      ],
      ["tests/fixtures/session-transcripts/phase3-10/unsupported-major.json", "present"]
    ]
  );

  assert.deepEqual(
    report.phase310Inventory.tests.map(({ path, status }) => [path, status]),
    [
      ["tests/session-transcript-schema.test.mjs", "present"],
      ["tests/core-phase3-9-session-transcripts.test.mjs", "present"],
      ["tests/core-phase3-10-transcript-versioning.test.mjs", "present"],
      ["tests/report-phase-status.test.mjs", "present"]
    ]
  );
});

test("report inventories Phase 4.0A stdio dry-run event emission", async () => {
  const report = await runReport();

  assert.deepEqual(report.phase40AInventory.command, {
    command: "ardyn emit-session-events --dry-run --manifest <manifest.json> --task <task.json>",
    status: "implemented-finite-dry-run-emitter",
    stdout: "LF-delimited JSONL session events with one JSON object per line.",
    stderr: "Plain diagnostics and errors only.",
    writesFiles: false,
    readsStdin: false,
    network: false,
    processSpawning: false,
    listener: false,
    adapterCalls: false,
    locusRuntimeDependency: false,
    mcpCalls: false,
    openClawCalls: false,
    pluginExecution: false,
    contentFabricRuntimeBehavior: false
  });

  assert.deepEqual(report.phase40AInventory.coreApi, [
    "createStdioDryRunSessionEvents",
    "formatSessionEventsJsonl",
    "assertLocalFilePath",
    "assertLocalJsonFilePath",
    "readLocalJsonFile"
  ]);

  assert.deepEqual(report.phase40AInventory.eventOrder, [
    "session.started",
    "session.heartbeat",
    "session.capabilities",
    "task.planned",
    "approval.recorded",
    "session.completed"
  ]);

  assert.deepEqual(report.phase40AInventory.framing, {
    format: "jsonl",
    newline: "lf",
    finalTrailingNewline: true,
    validatesEveryEventBeforeSerialization: true,
    malformedEventsRejected: true
  });

  assert.deepEqual(report.phase40AInventory.localPathPolicy, {
    appliesTo: ["manifest", "task", "transcript", "local-json-review-input"],
    rejectsUrlSchemes: true,
    rejectsFileUrls: true,
    rejectsUncAndNetworkPaths: true,
    rejectsWindowsDriveRelativePaths: true,
    rejectsStdinMarker: true,
    rejectsNulCrLf: true,
    requiresJsonExtensionForJsonInputs: true,
    absoluteLocalPathsAllowed: true
  });

  assert.deepEqual(
    report.phase40AInventory.docs.map(({ path, status }) => [path, status]),
    [
      ["docs/phase-4-stdio-dry-run-event-emission.md", "present"],
      ["docs/session-events-stdio-contract.md", "present"],
      ["README.md", "present"],
      ["apps/cli/README.md", "present"],
      [".gitattributes", "present"]
    ]
  );

  assert.deepEqual(
    report.phase40AInventory.tests.map(({ path, status }) => [path, status]),
    [
      ["tests/core-phase4-stdio-dry-run.test.mjs", "present"],
      ["tests/cli-phase4-stdio-dry-run.test.mjs", "present"]
    ]
  );

  assert.deepEqual(report.phase40AInventory.safetyPosture, {
    nonExecuting: true,
    noLiveStdioRuntime: true,
    noStdinCommandLoop: true,
    noListener: true,
    noServer: true,
    noSubprocessSpawning: true,
    noAdapterCalls: true,
    noLocusRuntimeDependency: true,
    noMcpCalls: true,
    noOpenClawCalls: true,
    noPluginExecution: true,
    noContentFabricDownloadInstallEnable: true,
    allEventSafetyFlagsFalse: true
  });
});

test("report inventories Phase 4.0B dry-run emitter hardening", async () => {
  const report = await runReport();

  assert.deepEqual(report.phase40BInventory.command, {
    command: "ardyn emit-session-events --dry-run --manifest <manifest.json> --task <task.json>",
    status: "hardened-finite-dry-run-emitter",
    strictArgumentValidation: true,
    allowedArgs: ["--dry-run", "--manifest <path>", "--task <path>"],
    rejectsUnknownArgs: true,
    rejectsDuplicateArgs: true,
    rejectsMissingArgValues: true,
    rejectsExtraPositionals: true,
    validatesArgsBeforeFileReads: true,
    successStdout: "JSONL only.",
    failureStdout: "empty",
    failureStderr: "plain diagnostics"
  });

  assert.deepEqual(report.phase40BInventory.negativeCliCoverage, {
    unreadableManifestFile: true,
    unreadableTaskFile: true,
    invalidJsonManifest: true,
    invalidJsonTask: true,
    schemaInvalidManifest: true,
    schemaInvalidTask: true,
    unsafeManifestPath: true,
    unsafeTaskPath: true,
    missingDryRun: true,
    extraUnknownArgs: true,
    failuresEmitPartialStdoutJsonl: false
  });

  assert.deepEqual(report.phase40BInventory.formatterHardening, {
    finalLfRequired: true,
    blankJsonlLinesAllowed: false,
    sparseEventSlotsRejected: true,
    malformedEventsRejectedBeforeSerialization: true,
    allEventSafetyFlagsRemainFalse: true
  });

  assert.deepEqual(
    report.phase40BInventory.goldenFixtures.map(({ path, status }) => [path, status]),
    [["tests/fixtures/stdio-dry-run/phase4-0b-minimal-session-events.jsonl", "present"]]
  );

  assert.deepEqual(
    report.phase40BInventory.docs.map(({ path, status }) => [path, status]),
    [
      ["README.md", "present"],
      ["apps/cli/README.md", "present"],
      ["docs/phase-4-stdio-dry-run-event-emission.md", "present"],
      ["docs/session-events-stdio-contract.md", "present"],
      ["docs/host-policy-preconditions.md", "present"]
    ]
  );

  assert.deepEqual(
    report.phase40BInventory.tests.map(({ path, status }) => [path, status]),
    [
      ["tests/cli-phase4-stdio-dry-run.test.mjs", "present"],
      ["tests/core-phase4-stdio-dry-run.test.mjs", "present"],
      ["tests/report-phase-status.test.mjs", "present"]
    ]
  );

  assert.deepEqual(report.phase40BInventory.futureRustHostPolicyDesign, {
    documented: true,
    activeRuntimeEnforcement: false,
    rustOwnsFutureStdoutStderrPolicy: true,
    stdoutReservedForFutureJsonlEvents: true,
    stderrReservedForFutureDiagnostics: true,
    requiresBackpressureAndPartialWritePolicyBeforeRuntime: true
  });

  assert.deepEqual(report.phase40BInventory.safetyPosture, {
    nonExecuting: true,
    noLiveStdioRuntime: true,
    noStdinCommandLoop: true,
    noListener: true,
    noServer: true,
    noSubprocessSpawning: true,
    noAdapterCalls: true,
    noLocusRuntimeDependency: true,
    noMcpCalls: true,
    noOpenClawCalls: true,
    noPluginExecution: true,
    noContentFabricDownloadInstallEnable: true,
    noSecrets: true,
    noProductionSigningKeys: true
  });
});

test("report inventories Phase 4.0C pre-runtime transport policy", async () => {
  const report = await runReport();

  assert.deepEqual(report.phase40CInventory.transportPolicy, {
    document: "docs/phase-4-0c-pre-runtime-transport-policy.md",
    status: "policy-only-pre-runtime",
    activeRuntimeEnforcement: false,
    liveStdioRuntimeImplemented: false,
    stdinCommandLoopImplemented: false,
    replayCommandImplemented: false,
    stdoutOwnerBeforeRuntime: "current finite TypeScript dry-run CLI renderer",
    stdoutOwnerForFutureRuntime: "Rust host",
    stderrOwnerBeforeRuntime: "current finite TypeScript dry-run CLI diagnostics",
    stderrOwnerForFutureRuntime: "Rust host",
    stdoutReservedFor: "validated LF-delimited session-event JSONL",
    stderrReservedFor: "redacted diagnostics, never session-event JSONL"
  });

  assert.deepEqual(report.phase40CInventory.stdoutJsonlPolicy, {
    utf8Only: true,
    lfOnly: true,
    crlfAllowed: false,
    blankLinesAllowed: false,
    finalLfRequiredForCompleteStreams: true,
    oneJsonObjectPerLine: true,
    validatesSessionEventSchema: true,
    contiguousSequencesRequired: true,
    duplicateEventIdsAllowed: false,
    partialFramesAreInvalid: true
  });

  assert.deepEqual(report.phase40CInventory.stderrDiagnosticPolicy, {
    diagnosticsOnly: true,
    sessionEventsAllowedOnStderr: false,
    oneDiagnosticRecordPerLineBeforeRuntime: true,
    deterministicSeverityRequiredBeforeRuntime: true,
    deterministicCodeOrCategoryRequiredBeforeRuntime: true,
    redactionRequiredBeforeLiveRuntime: true,
    currentDryRunDiagnosticsArePlainText: true
  });

  assert.deepEqual(report.phase40CInventory.transportFailurePolicy, {
    backpressurePolicyImplemented: false,
    backpressureMustBeDefinedBeforeRuntime: true,
    partialWriteRecoveryImplemented: false,
    droppedLinesInvalidateTranscript: true,
    duplicateLinesInvalidateTranscript: true,
    outOfOrderLinesInvalidateTranscript: true,
    malformedLinesInvalidateTranscript: true,
    hostMustNotSynthesizeMissingEvents: true,
    processExitSemanticsDocumented: true
  });

  assert.deepEqual(report.phase40CInventory.redactionPolicy, {
    documentSection: "Stderr Redaction Policy",
    safeDiagnosticsToday: [
      "usage-errors",
      "unknown-or-duplicate-options",
      "local-path-policy-labels",
      "unreadable-local-files",
      "json-parse-summaries",
      "schema-validation-summaries"
    ],
    mustRedactBeforeRuntime: [
      "secrets",
      "production-signing-keys",
      "tokens-and-credentials",
      "local-absolute-paths",
      "environment-variables",
      "stack-traces",
      "raw-json-parse-excerpts",
      "schema-validation-values"
    ],
    liveSecretHandlingImplemented: false
  });

  assert.deepEqual(report.phase40CInventory.replayDesign, {
    documentSection: "Transcript Persistence And Replay Design",
    implementationStatus: "proposal-only",
    preferredReplayInput: "normalized ardyn.session-transcript JSON",
    rawJsonlCaptureRole: "forensic-source-only",
    compatibleWithExistingTranscriptValidation: true,
    futureCliProposalOnly: [
      "ardyn replay-session-transcript --file <session-transcript.json> --summary",
      "ardyn replay-session-transcript --file <session-transcript.json> --explain"
    ],
    liveReplayImplemented: false,
    transcriptPersistenceImplemented: false
  });

  assert.deepEqual(report.phase40CInventory.ownershipSplit, {
    futureRustHostOwns: [
      "stdout-stderr-policy",
      "buffering-flushing-backpressure",
      "partial-write-handling",
      "process-exit-semantics",
      "transport-failure-audit-records",
      "diagnostic-redaction-enforcement"
    ],
    typeScriptCoreOwns: [
      "manifest-validation",
      "task-validation",
      "non-executing-planning-data",
      "session-event-construction",
      "session-event-schema-validation",
      "normalized-transcript-validation",
      "diagnostic-classification-inputs"
    ]
  });

  assert.deepEqual(
    report.phase40CInventory.docs.map(({ path, status }) => [path, status]),
    [
      ["docs/phase-4-0c-pre-runtime-transport-policy.md", "present"],
      ["docs/phase-4-stdio-dry-run-event-emission.md", "present"],
      ["docs/session-events-stdio-contract.md", "present"],
      ["docs/host-policy-preconditions.md", "present"],
      ["README.md", "present"],
      ["apps/cli/README.md", "present"],
      ["packages/core/README.md", "present"],
      ["docs/architecture.md", "present"],
      ["crates/ardyn-host/README.md", "present"]
    ]
  );

  assert.deepEqual(
    report.phase40CInventory.tests.map(({ path, status }) => [path, status]),
    [
      ["tests/phase4-0c-transport-policy.test.mjs", "present"],
      ["tests/report-phase-status.test.mjs", "present"],
      ["tests/host-policy-preconditions.test.mjs", "present"]
    ]
  );

  assert.deepEqual(report.phase40CInventory.safetyPosture, {
    nonExecuting: true,
    noLiveStdioRuntime: true,
    noStdinCommandLoop: true,
    noListener: true,
    noServer: true,
    noSubprocessSpawning: true,
    noAdapterCalls: true,
    noLocusRuntimeDependency: true,
    noMcpCalls: true,
    noOpenClawCalls: true,
    noPluginExecution: true,
    noContentFabricDownloadInstallEnable: true,
    noSecrets: true,
    noProductionSigningKeys: true,
    noTranscriptPersistenceReplayRuntime: true,
    noWebSocketHttpControlSurface: true
  });
});

test("report inventories Phase 4.0D Rust-host transport policy contracts", async () => {
  const report = await runReport();

  assert.deepEqual(report.phase40DInventory.rustHostPolicyContract, {
    document: "docs/phase-4-0d-rust-host-transport-policy-contracts.md",
    source: "crates/ardyn-host/src/lib.rs",
    exportedHelper: "stdio_transport_policy_contract",
    status: "policy-only-pre-runtime",
    derivedFromPhase: "4.0C",
    runtimeImplementationActive: false,
    activeRuntimeEnforcement: false,
    liveStdioRuntimeImplemented: false,
    stdioOwnershipImplementationActive: false,
    replayRuntimeImplemented: false,
    transcriptPersistenceImplemented: false,
    secretHandlingImplemented: false
  });

  assert.deepEqual(report.phase40DInventory.contractTypes, [
    "PolicyImplementationStatus",
    "StdioPolicyOwner",
    "StdioStreamPurpose",
    "StdioLineEnding",
    "StdioCommitUnit",
    "StdioTransportFailureAction",
    "StdioLineFailureKind",
    "StderrDiagnosticClass",
    "RedactionSubject",
    "TranscriptReplayInputPreference",
    "RawJsonlCaptureRole",
    "StdioStreamOwnershipPolicy",
    "StdioJsonlFramingPolicy",
    "StderrDiagnosticPolicy",
    "StderrRedactionPolicy",
    "BackpressurePolicy",
    "PartialWritePolicy",
    "LineIntegrityFailureRule",
    "LineIntegrityPolicy",
    "ExitSemanticsPolicy",
    "TranscriptReplayReadinessPolicy",
    "RuntimeSafetyPolicyFlags",
    "StdioTransportPolicyContract"
  ]);

  assert.deepEqual(report.phase40DInventory.helpers, [
    "stdio_transport_policy_contract",
    "StdioTransportPolicyContract::is_pre_runtime_fail_closed",
    "RuntimeSafetyPolicyFlags::all_runtime_flags_disabled"
  ]);

  assert.deepEqual(report.phase40DInventory.modeledPolicies, {
    stdoutOwnership: true,
    stderrOwnership: true,
    jsonlFraming: true,
    stderrDiagnostics: true,
    stderrRedaction: true,
    backpressure: true,
    partialWrite: true,
    droppedLine: true,
    duplicateLine: true,
    outOfOrderLine: true,
    malformedLine: true,
    exitSemantics: true,
    transcriptReplayReadiness: true
  });

  assert.deepEqual(report.phase40DInventory.defaults, {
    implementationStatus: "policy-only-pre-runtime",
    runtimeImplementationActive: false,
    stdoutCurrentOwner: "typescript-dry-run-cli",
    stdoutFutureRuntimeOwner: "rust-host",
    stdoutReservedFor: "validated-session-event-jsonl-only",
    stderrCurrentOwner: "typescript-dry-run-cli",
    stderrFutureRuntimeOwner: "rust-host",
    stderrReservedFor: "redacted-diagnostics-only",
    jsonlLineEnding: "lf-only",
    finalLfRequiredForCompleteStreams: true,
    crlfAllowed: false,
    blankLinesAllowed: false,
    partialFramesAreEvents: false,
    duplicateEventIdsAllowed: false,
    redactionEnforcementActive: false,
    redactionRequiredBeforeRuntime: true,
    backpressureImplementationActive: false,
    partialWriteImplementationActive: false,
    transcriptReplayImplementationStatus: "policy-only-pre-runtime",
    transcriptPersistenceImplemented: false,
    replayRuntimeImplemented: false
  });

  assert.deepEqual(report.phase40DInventory.failClosedChecks, {
    defaultContractPasses: true,
    allRuntimeFlagsDisabled: true,
    liveStdioRuntimeMutationRejected: true,
    stdoutImplementationMutationRejected: true,
    partialFrameMutationRejected: true,
    duplicateLineRecoveryMutationRejected: true,
    replayRuntimeMutationRejected: true
  });

  assert.deepEqual(
    report.phase40DInventory.docs.map(({ path, status }) => [path, status]),
    [
      ["docs/phase-4-0d-rust-host-transport-policy-contracts.md", "present"],
      ["docs/phase-4-0c-pre-runtime-transport-policy.md", "present"],
      ["docs/phase-4-stdio-dry-run-event-emission.md", "present"],
      ["docs/session-events-stdio-contract.md", "present"],
      ["docs/host-policy-preconditions.md", "present"],
      ["docs/architecture.md", "present"],
      ["README.md", "present"],
      ["apps/cli/README.md", "present"],
      ["packages/core/README.md", "present"],
      ["crates/ardyn-host/README.md", "present"]
    ]
  );

  assert.deepEqual(
    report.phase40DInventory.tests.map(({ path, status }) => [path, status]),
    [
      ["crates/ardyn-host/src/lib.rs", "present"],
      ["tests/phase4-0d-rust-host-policy-contracts.test.mjs", "present"],
      ["tests/report-phase-status.test.mjs", "present"]
    ]
  );

  assert.deepEqual(report.phase40DInventory.safetyPosture, {
    nonExecuting: true,
    noLiveStdioRuntime: true,
    noStdinCommandLoop: true,
    noLiveStdioReader: true,
    noListener: true,
    noServer: true,
    noSubprocessSpawning: true,
    noAdapterCalls: true,
    noLocusRuntimeDependency: true,
    noMcpCalls: true,
    noOpenClawCalls: true,
    noPluginExecution: true,
    noContentFabricRuntimeBehavior: true,
    noTranscriptPersistenceReplayRuntime: true,
    noWebSocketHttpControlSurface: true,
    noSecrets: true,
    noProductionSigningKeys: true
  });
});

test("report inventories Phase 4.0E Rust-host policy metadata export", async () => {
  const report = await runReport();

  assert.deepEqual(report.phase40EInventory.policyMetadata, {
    document: "docs/phase-4-0e-rust-host-policy-metadata.md",
    source: "crates/ardyn-host/src/lib.rs",
    fixture: "tests/fixtures/host-policy/phase4-0e-stdio-transport-policy-metadata.json",
    schema: "ardyn.stdio-transport-policy-metadata",
    schemaVersion: "0.1.0",
    metadataPhase: "phase-4.0e-rust-host-policy-metadata",
    contractPhase: "phase-4.0d-rust-host-transport-policy-contracts",
    exportStatus: "review-export-only",
    runtimeStatus: "pre-runtime-policy-only",
    reviewOnly: true,
    activeRuntimeEnforcement: false,
    liveRuntimeBehaviorIntroduced: false
  });

  assert.deepEqual(report.phase40EInventory.jsonExport, {
    helper: "stdio_transport_policy_metadata_json",
    serializer: "serde_json::to_string_pretty",
    format: "pretty-json-lf-terminated",
    finalLfRequired: true,
    crlfAllowed: false,
    parseRejectsCr: true,
    digestHelper: "stdio_transport_policy_metadata_digest_hex",
    digestAlgorithm: "sha256",
    writesFiles: false,
    cliCommandAdded: false
  });

  assert.deepEqual(report.phase40EInventory.futureHostPolicyReviewRecordMapping, {
    mappingStruct: "HostPolicyReviewRecordMapping",
    recordStruct: "HostPolicyReviewRecord",
    mappingHelper: "host_policy_review_record_for_stdio_transport_policy_metadata",
    validationHelper: "validate_host_policy_review_record",
    recordSchema: "ardyn.host-policy-review-record",
    recordSchemaVersion: "0.1.0",
    reviewedPhase: "4.0E",
    policyContractSchema: "ardyn.stdio-transport-policy-metadata",
    policyContractVersion: "0.1.0",
    policyDigestAlgorithm: "sha256",
    runtimeStatus: "pre-runtime-policy-only",
    decisionStatusDefault: "review-pending",
    approvalRecordedDefault: false,
    rejectionRecordedDefault: false,
    reviewMetadataOnlyDefault: true,
    approvalFieldsReviewMetadataOnly: true,
    approvalRuntimeEffectAllowed: false,
    rejectionRuntimeEffectAllowed: false
  });

  assert.deepEqual(report.phase40EInventory.negativeDeserializationCoverage, {
    unknownVersion: true,
    missingRequiredFields: true,
    invalidStdoutOwnershipValue: true,
    invalidStderrOwnershipValue: true,
    permissiveLiveRuntimeMode: true,
    malformedRedactionPolicy: true,
    malformedLineIntegrityPolicy: true,
    malformedExitSemantics: true,
    crlfJsonRejected: true,
    unknownFieldsRejected: true
  });

  assert.deepEqual(report.phase40EInventory.nonExecutionInvariants, [
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

  assert.deepEqual(
    report.phase40EInventory.docs.map(({ path, status }) => [path, status]),
    [
      ["docs/phase-4-0e-rust-host-policy-metadata.md", "present"],
      ["docs/phase-4-0d-rust-host-transport-policy-contracts.md", "present"],
      ["docs/phase-4-stdio-dry-run-event-emission.md", "present"],
      ["docs/session-events-stdio-contract.md", "present"],
      ["docs/host-policy-preconditions.md", "present"],
      ["docs/architecture.md", "present"],
      ["README.md", "present"],
      ["apps/cli/README.md", "present"],
      ["packages/core/README.md", "present"],
      ["crates/ardyn-host/README.md", "present"]
    ]
  );

  assert.deepEqual(
    report.phase40EInventory.tests.map(({ path, status }) => [path, status]),
    [
      ["crates/ardyn-host/src/lib.rs", "present"],
      ["tests/fixtures/host-policy/phase4-0e-stdio-transport-policy-metadata.json", "present"],
      ["tests/phase4-0e-policy-metadata.test.mjs", "present"],
      ["tests/report-phase-status.test.mjs", "present"]
    ]
  );

  assert.deepEqual(report.phase40EInventory.safetyPosture, {
    nonExecuting: true,
    noLiveStdioRuntime: true,
    noStdinCommandLoop: true,
    noLiveStdioReader: true,
    noProcessStdioOwnership: true,
    noListener: true,
    noServer: true,
    noSubprocessSpawning: true,
    noAdapterCalls: true,
    noLocusRuntimeDependency: true,
    noMcpCalls: true,
    noOpenClawCalls: true,
    noPluginExecution: true,
    noContentFabricRuntimeBehavior: true,
    noTranscriptPersistenceReplayRuntime: true,
    noWebSocketHttpControlSurface: true,
    noSecrets: true,
    noProductionSigningKeys: true,
    noCliCommandAdded: true,
    noFileWriterAdded: true
  });
});

test("report inventories Phase 4.0F host-policy review records", async () => {
  const report = await runReport();

  assert.deepEqual(report.phase40FInventory.reviewRecords, {
    document: "docs/phase-4-0f-host-policy-review-records.md",
    source: "crates/ardyn-host/src/lib.rs",
    schema: "ardyn.host-policy-review-record",
    schemaVersion: "0.1.0",
    recordPhase: "phase-4.0f-host-policy-review-records",
    reviewedPhase: "4.0E",
    policyMetadataSchema: "ardyn.stdio-transport-policy-metadata",
    policyMetadataVersion: "0.1.0",
    policyMetadataDigestAlgorithm: "sha256",
    currentPolicyMetadataDigestHex:
      "91e64ea2ec4b61ef4850501ba4d80d01af5e23def60dd893652bfaa0cd7b494a",
    runtimeStatus: "pre-runtime-policy-only",
    staticReviewArtifactOnly: true,
    grantsRuntimeApproval: false,
    activeRuntimeEnforcement: false,
    liveRuntimeBehaviorIntroduced: false
  });

  assert.deepEqual(report.phase40FInventory.compatibilityClassification, {
    enum: "HostPolicyReviewCompatibility",
    helper: "classify_host_policy_review_record_json",
    parserHelper: "parse_host_policy_review_record_json",
    validationHelper: "validate_host_policy_review_record",
    classes: [
      "compatible",
      "upgrade_available",
      "unsupported_major",
      "malformed",
      "rejected_policy"
    ],
    exactCurrentValidationRequiredForCompatible: true,
    tolerantSchemaVersionPrepass: true,
    unsupportedMajorFailClosed: true,
    malformedFailClosed: true,
    rejectedPolicyFailClosed: true,
    sameMajorFutureMinorInertMetadataOnly: true
  });

  assert.deepEqual(report.phase40FInventory.deterministicMapping, {
    mappingHelper: "host_policy_review_record_for_stdio_transport_policy_metadata",
    jsonHelper: "host_policy_review_record_json_for_stdio_transport_policy_metadata",
    rejectedPolicyHelper:
      "rejected_host_policy_review_record_for_stdio_transport_policy_metadata",
    serializer: "serde_json::to_string_pretty",
    format: "pretty-json-lf-terminated",
    finalLfRequired: true,
    crlfAllowed: false,
    writesFiles: false,
    cliCommandAdded: false
  });

  assert.deepEqual(report.phase40FInventory.decisionMetadata, {
    defaultStatus: "review-pending",
    approvedStatusAllowedAsInertMetadata: true,
    rejectedStatusAllowedAsInertMetadata: true,
    approvalRecordedDefault: false,
    rejectionRecordedDefault: false,
    reviewMetadataOnlyRequired: true,
    approvalRuntimeEffectAllowed: false,
    rejectionRuntimeEffectAllowed: false,
    reviewRecordDoesNotGrantRuntimeApproval: true
  });

  assert.deepEqual(
    report.phase40FInventory.fixtures.map(({ path, status }) => [path, status]),
    [
      ["tests/fixtures/host-policy/phase4-0f/current-host-policy-review-record.json", "present"],
      [
        "tests/fixtures/host-policy/phase4-0f/same-major-future-minor-host-policy-review-record.json",
        "present"
      ],
      ["tests/fixtures/host-policy/phase4-0f/unsupported-major-host-policy-review-record.json", "present"],
      [
        "tests/fixtures/host-policy/phase4-0f/malformed-missing-schema-version-host-policy-review-record.json",
        "present"
      ],
      [
        "tests/fixtures/host-policy/phase4-0f/malformed-missing-policy-digest-host-policy-review-record.json",
        "present"
      ],
      [
        "tests/fixtures/host-policy/phase4-0f/malformed-permissive-approval-runtime-effect-host-policy-review-record.json",
        "present"
      ],
      [
        "tests/fixtures/host-policy/phase4-0f/rejected-permissive-policy-host-policy-review-record.json",
        "present"
      ]
    ]
  );

  assert.deepEqual(report.phase40FInventory.negativeCoverage, {
    unsupportedMajorClassifiedFailClosed: true,
    malformedMissingRequiredFieldsClassifiedFailClosed: true,
    missingPolicyDigestRejected: true,
    permissiveApprovalRuntimeEffectRejected: true,
    permissivePolicyMetadataRejectedPolicy: true,
    approvalFieldsRuntimeEffectRejected: true,
    crlfJsonRejected: true,
    unknownFieldsRejectedForExactCurrentRecords: true
  });

  assert.deepEqual(report.phase40FInventory.nonExecutionInvariants, [
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

  assert.deepEqual(
    report.phase40FInventory.docs.map(({ path, status }) => [path, status]),
    [
      ["docs/phase-4-0f-host-policy-review-records.md", "present"],
      ["docs/phase-4-0e-rust-host-policy-metadata.md", "present"],
      ["docs/phase-4-stdio-dry-run-event-emission.md", "present"],
      ["docs/session-events-stdio-contract.md", "present"],
      ["docs/host-policy-preconditions.md", "present"],
      ["docs/architecture.md", "present"],
      ["README.md", "present"],
      ["apps/cli/README.md", "present"],
      ["packages/core/README.md", "present"],
      ["crates/ardyn-host/README.md", "present"]
    ]
  );

  assert.deepEqual(
    report.phase40FInventory.tests.map(({ path, status }) => [path, status]),
    [
      ["crates/ardyn-host/src/lib.rs", "present"],
      [
        "tests/fixtures/host-policy/phase4-0f/current-host-policy-review-record.json",
        "present"
      ],
      ["tests/phase4-0f-host-policy-review-records.test.mjs", "present"],
      ["tests/report-phase-status.test.mjs", "present"]
    ]
  );

  assert.deepEqual(report.phase40FInventory.safetyPosture, {
    nonExecuting: true,
    noLiveStdioRuntime: true,
    noStdinCommandLoop: true,
    noLiveStdioReader: true,
    noProcessStdioOwnership: true,
    noListener: true,
    noServer: true,
    noSubprocessSpawning: true,
    noAdapterCalls: true,
    noLocusRuntimeDependency: true,
    noMcpCalls: true,
    noOpenClawCalls: true,
    noPluginExecution: true,
    noContentFabricRuntimeBehavior: true,
    noTranscriptPersistenceReplayRuntime: true,
    noWebSocketHttpControlSurface: true,
    noSecrets: true,
    noProductionSigningKeys: true,
    noRuntimeApprovalGrant: true,
    noCliCommandAdded: true,
    noFileWriterAdded: true
  });
});

test("report inventories Phase 4.0G host-policy review comparison", async () => {
  const report = await runReport();

  assert.deepEqual(report.phase40GInventory.hostPolicyReviewComparison, {
    document: "docs/phase-4-0g-host-policy-review-comparison.md",
    source: "packages/core/src/index.mjs",
    typeDeclarations: "packages/core/src/index.d.ts",
    schema: "ardyn.host-policy-review-record-comparison",
    schemaVersion: "0.1.0",
    comparisonPhase: "phase-4.0g-host-policy-review-comparison",
    artifactKind: "host_policy_review_record",
    helper: "compareHostPolicyReviewRecords",
    normalizationHelper: "normalizeHostPolicyReviewRecordForDisplay",
    displaySummaryHelper: "buildHostPolicyReviewRecordDisplaySummary",
    formatter: "formatHostPolicyReviewRecordComparisonJson",
    classifier: "classifyHostPolicyReviewRecordCompatibility",
    staticDisplayOnly: true,
    comparisonDoesNotGrantRuntimeApproval: true,
    approvalMetadataInert: true,
    rejectionMetadataInert: true,
    liveRuntimeBehaviorIntroduced: false,
    runtimeBehaviorIntroduced: false
  });

  assert.deepEqual(report.phase40GInventory.comparedFields, [
    "record kind",
    "record version",
    "reviewed phase",
    "policy contract version",
    "policy metadata schema",
    "policy metadata version",
    "policy metadata digest algorithm",
    "policy metadata digest hex",
    "runtime status",
    "non-execution invariant summary",
    "compatibility classification",
    "approval and rejection metadata",
    "warnings metadata",
    "errors metadata"
  ]);

  assert.deepEqual(report.phase40GInventory.compatibilityHandling, {
    exactCurrentCompatible: true,
    sameMajorUpgradeAvailableDisplayOnly: true,
    unsupportedMajorFailClosed: true,
    malformedFailClosed: true,
    rejectedPolicyFailClosed: true,
    digestMismatchFailClosedReviewEvidenceOnly: true,
    runtimeStatusMismatchFailClosed: true
  });

  assert.deepEqual(
    report.phase40GInventory.fixtureCoverage.map(({ path, status }) => [path, status]),
    [
      [
        "tests/fixtures/host-policy/phase4-0g/identical-current-host-policy-review-comparison.json",
        "present"
      ],
      [
        "tests/fixtures/host-policy/phase4-0g/same-major-future-minor-upgrade-available-host-policy-review-comparison.json",
        "present"
      ],
      [
        "tests/fixtures/host-policy/phase4-0g/unsupported-major-fail-closed-host-policy-review-comparison.json",
        "present"
      ],
      [
        "tests/fixtures/host-policy/phase4-0g/malformed-missing-schema-version-host-policy-review-comparison.json",
        "present"
      ],
      [
        "tests/fixtures/host-policy/phase4-0g/rejected-permissive-policy-host-policy-review-comparison.json",
        "present"
      ],
      [
        "tests/fixtures/host-policy/phase4-0g/policy-digest-mismatch-host-policy-review-comparison.json",
        "present"
      ],
      [
        "tests/fixtures/host-policy/phase4-0g/runtime-status-mismatch-host-policy-review-comparison.json",
        "present"
      ]
    ]
  );

  assert.deepEqual(report.phase40GInventory.cliCommandSurface, {
    commandAdded: false,
    finiteStaticOnly: true,
    stdoutPrinterAdded: false,
    fileWriterAdded: false,
    liveRuntimeCommandAdded: false,
    existingDryRunEmitterUnchanged: true
  });

  assert.deepEqual(
    report.phase40GInventory.docs.map(({ path, status }) => [path, status]),
    [
      ["docs/phase-4-0g-host-policy-review-comparison.md", "present"],
      ["docs/phase-4-0f-host-policy-review-records.md", "present"],
      ["docs/host-policy-preconditions.md", "present"],
      ["README.md", "present"],
      ["apps/cli/README.md", "present"],
      ["packages/core/README.md", "present"]
    ]
  );

  assert.deepEqual(
    report.phase40GInventory.tests.map(({ path, status }) => [path, status]),
    [
      ["tests/phase4-0g-host-policy-review-comparison.test.mjs", "present"],
      ["tests/report-phase-status.test.mjs", "present"]
    ]
  );

  assert.deepEqual(report.phase40GInventory.invariantProbes, [
    "missing --dry-run",
    "unknown emit-session-events arg",
    "unsafe manifest URL",
    "invalid JSON manifest",
    "invalid JSON task",
    "replay-session-transcript",
    "policy-metadata",
    "host-policy-export",
    "serve-runtime",
    "stdio-runtime"
  ]);

  assert.deepEqual(report.phase40GInventory.safetyPosture, {
    nonExecuting: true,
    noLiveStdioRuntime: true,
    noStdinCommandLoop: true,
    noLiveStdioReader: true,
    noProcessStdioOwnership: true,
    noListener: true,
    noServer: true,
    noSubprocessSpawning: true,
    noAdapterCalls: true,
    noLocusRuntimeDependency: true,
    noMcpCalls: true,
    noOpenClawCalls: true,
    noPluginExecution: true,
    noContentFabricRuntimeBehavior: true,
    noTranscriptPersistenceReplayRuntime: true,
    noWebSocketHttpControlSurface: true,
    noSecrets: true,
    noProductionSigningKeys: true,
    noRuntimeApprovalGrant: true,
    noCliCommandAdded: true,
    noFileWriterAdded: true
  });
});

test("report inventories Phase 4.0H reviewer handoff index", async () => {
  const report = await runReport();

  assert.deepEqual(report.phase40HInventory.reviewerHandoffIndex, {
    document: "docs/phase-4-0h-reviewer-handoff-index.md",
    metadataFixture: "tests/fixtures/host-policy/phase4-0h/reviewer-handoff-index.json",
    schema: "ardyn.phase-4-reviewer-handoff-index",
    schemaVersion: "0.1.0",
    indexPhase: "phase-4.0h-reviewer-handoff-index",
    phaseIntroduced: "4.0H",
    artifactKind: "phase_4_reviewer_handoff_index",
    reviewRange: {
      fromPhase: "4.0A",
      throughPhase: "4.0H"
    },
    runtimeStatus: "static-reviewer-index-only",
    artifactCount: 37,
    staticIndexOnly: true,
    reviewOnly: true,
    nonExecuting: true,
    reviewMetadataOnly: true,
    grantsRuntimeApproval: false,
    runtimeBehaviorIntroduced: false,
    liveRuntimeBehaviorIntroduced: false
  });

  assert.deepEqual(report.phase40HInventory.roleBoundaries, {
    authoritativeRoles: ["normative-doc", "source-evidence"],
    evidenceOnlyRoles: [
      "test-evidence",
      "fixture-evidence",
      "display-only-evidence",
      "metadata-index"
    ],
    normativeDocsAreAuthoritative: true,
    sourceEvidenceIsAuthoritativeForStaticContractSurface: true,
    fixturesAreEvidenceOnly: true,
    testsAreEvidenceOnly: true,
    comparisonArtifactsAreDisplayOnly: true,
    metadataIndexIsNavigationOnly: true,
    indexDoesNotOverrideNormativeDocs: true
  });

  assert.deepEqual(report.phase40HInventory.phaseCoverage, [
    "4.0A",
    "4.0B",
    "4.0C",
    "4.0D",
    "4.0E",
    "4.0F",
    "4.0G",
    "4.0H"
  ]);
  assert.equal(report.phase40HInventory.indexedArtifacts.length, 37);
  assert.deepEqual(report.phase40HInventory.artifactRoleCounts, {
    normativeDocs: 8,
    sourceEvidence: 1,
    testEvidence: 10,
    fixtureEvidence: 9,
    displayOnlyEvidence: 7,
    metadataIndex: 2
  });

  assert.deepEqual(report.phase40HInventory.comparisonAndReviewArtifactPosture, {
    reviewRecordFixturesStaticOnly: true,
    comparisonFixturesDisplayOnly: true,
    reviewRecordsGrantRuntimeApproval: false,
    comparisonsGrantRuntimeApproval: false,
    metadataIndexGrantsRuntimeApproval: false,
    futureLiveRuntimeBlockedUntilSeparateApprovedPhase: true
  });

  assert.deepEqual(report.phase40HInventory.cliCommandSurface, {
    commandAdded: false,
    reviewerIndexCommandAdded: false,
    policyIndexCommandAdded: false,
    finiteStaticOnly: true,
    stdoutPrinterAdded: false,
    fileWriterAdded: false,
    liveRuntimeCommandAdded: false,
    existingDryRunEmitterUnchanged: true
  });

  assert.deepEqual(
    report.phase40HInventory.docs.map(({ path, status }) => [path, status]),
    [
      ["docs/phase-4-0h-reviewer-handoff-index.md", "present"],
      ["docs/phase-4-0g-host-policy-review-comparison.md", "present"],
      ["docs/phase-4-stdio-dry-run-event-emission.md", "present"],
      ["docs/session-events-stdio-contract.md", "present"],
      ["docs/host-policy-preconditions.md", "present"],
      ["docs/architecture.md", "present"],
      ["README.md", "present"],
      ["apps/cli/README.md", "present"],
      ["packages/core/README.md", "present"]
    ]
  );

  assert.deepEqual(report.phase40HInventory.fixtures, [
    {
      path: "tests/fixtures/host-policy/phase4-0h/reviewer-handoff-index.json",
      status: "present"
    }
  ]);

  assert.deepEqual(
    report.phase40HInventory.tests.map(({ path, status }) => [path, status]),
    [
      ["tests/phase4-0h-reviewer-handoff-index.test.mjs", "present"],
      ["tests/report-phase-status.test.mjs", "present"]
    ]
  );

  assert.deepEqual(report.phase40HInventory.invariantProbes, [
    "missing --dry-run",
    "unknown emit-session-events arg",
    "unsafe manifest URL",
    "invalid JSON manifest",
    "invalid JSON task",
    "replay-session-transcript",
    "policy-metadata",
    "host-policy-export",
    "serve-runtime",
    "stdio-runtime",
    "host-policy-index",
    "policy-index",
    "review-index",
    "index-host-policy"
  ]);

  assert.deepEqual(report.phase40HInventory.safetyPosture, {
    nonExecuting: true,
    staticIndexOnly: true,
    reviewOnly: true,
    noLiveStdioRuntime: true,
    noStdinCommandLoop: true,
    noLiveStdioReader: true,
    noProcessStdioOwnership: true,
    noListener: true,
    noServer: true,
    noSubprocessSpawning: true,
    noAdapterCalls: true,
    noLocusRuntimeDependency: true,
    noMcpCalls: true,
    noOpenClawCalls: true,
    noPluginExecution: true,
    noContentFabricRuntimeBehavior: true,
    noTranscriptPersistenceReplayRuntime: true,
    noWebSocketHttpControlSurface: true,
    noSecrets: true,
    noProductionSigningKeys: true,
    noRuntimeApprovalGrant: true,
    noCliCommandAdded: true,
    noFileWriterAdded: true,
    noStdoutPrinterAdded: true,
    noRuntimeBehaviorIntroduced: true
  });
});

test("report inventories Phase 4.0I final pre-runtime readiness", async () => {
  const report = await runReport();

  assert.deepEqual(report.phase40IInventory.finalPreRuntimeReadiness, {
    document: "docs/phase-4-0i-final-pre-runtime-readiness.md",
    metadataFixture: "tests/fixtures/host-policy/phase4-0i/final-pre-runtime-readiness.json",
    schema: "ardyn.phase-4-final-pre-runtime-readiness",
    schemaVersion: "0.1.0",
    readinessPhase: "phase-4.0i-final-pre-runtime-readiness",
    phaseIntroduced: "4.0I",
    artifactKind: "phase_4_final_pre_runtime_readiness_bundle",
    reviewedStartingSha: "d0a8530e4c43991e79fddabdc49212f2c1a6a5f6",
    reviewRange: {
      fromPhase: "4.0A",
      throughPhase: "4.0I"
    },
    runtimeStatus: "final-pre-runtime-readiness-only",
    readinessStatus: "pre-runtime-evidence-ready-for-separate-phase-4.1-review",
    artifactCount: 40,
    checklistCount: 11,
    invariantCount: 17,
    finalPreRuntimeReadinessOnly: true,
    reviewOnly: true,
    nonExecuting: true,
    reviewMetadataOnly: true,
    grantsRuntimeApproval: false,
    runtimeBehaviorIntroduced: false,
    liveRuntimeBehaviorIntroduced: false,
    phase41Implemented: false,
    requiresSeparatePhase41Approval: true,
    phase41BlockedUnlessSeparatelyApproved: true
  });

  assert.deepEqual(report.phase40IInventory.devinMilestoneReview, {
    fromPhase: "4.0A",
    throughPhase: "4.0H",
    reviewer: "Devin",
    verdict: "PASS",
    reviewSummary:
      "Phase 4.0A through Phase 4.0H was reviewed as coherent, reviewable, and non-executing with no blockers before a separately approved Phase 4.1.",
    fullAuditCopied: false
  });

  assert.deepEqual(report.phase40IInventory.basedOnReviewerHandoffIndex, {
    document: "docs/phase-4-0h-reviewer-handoff-index.md",
    metadataFixture: "tests/fixtures/host-policy/phase4-0h/reviewer-handoff-index.json"
  });

  assert.deepEqual(report.phase40IInventory.phaseCoverage, [
    "4.0A",
    "4.0B",
    "4.0C",
    "4.0D",
    "4.0E",
    "4.0F",
    "4.0G",
    "4.0H",
    "4.0I"
  ]);
  assert.equal(report.phase40IInventory.phaseMilestones.length, 9);
  assert.equal(report.phase40IInventory.phaseMilestones.at(-1).runtimeStatus, "final-pre-runtime-readiness-only");

  assert.deepEqual(
    report.phase40IInventory.readinessChecklist.map((item) => item.id),
    phase40IChecklistIds
  );
  for (const checklistItem of report.phase40IInventory.readinessChecklist) {
    assert.equal(checklistItem.grantsRuntimeApproval, false, checklistItem.id);
    assert.equal(checklistItem.runtimeBehaviorIntroduced, false, checklistItem.id);
    assert.equal(checklistItem.phase41ApprovalRequired, true, checklistItem.id);
  }

  assert.deepEqual(
    report.phase40IInventory.nonExecutionInvariantMatrix.map((item) => item.id),
    phase40IInvariantIds
  );
  for (const invariant of report.phase40IInventory.nonExecutionInvariantMatrix) {
    assert.equal(invariant.status, "confirmed", invariant.id);
    assert.equal(invariant.grantsRuntimeApproval, false, invariant.id);
    assert.equal(invariant.runtimeBehaviorIntroduced, false, invariant.id);
  }

  assert.equal(report.phase40IInventory.representedArtifacts.length, 40);
  assert.deepEqual(report.phase40IInventory.representedArtifactCounts, {
    total: 40,
    upstreamReviewerIndexArtifacts: 37,
    phase40IArtifacts: 3
  });

  assert.deepEqual(report.phase40IInventory.cliCommandSurface, {
    commandAdded: false,
    readinessCommandAdded: false,
    finalReadinessCommandAdded: false,
    phase41RuntimeCommandAdded: false,
    stdoutPrinterAdded: false,
    fileWriterAdded: false,
    liveRuntimeCommandAdded: false,
    existingDryRunEmitterUnchanged: true
  });

  assert.deepEqual(report.phase40IInventory.phase41Boundary, {
    implemented: false,
    runtimeApprovalGranted: false,
    separateApprovalRequired: true,
    blockedUnlessSeparatelyApproved: true,
    thisPhaseCanGrantApproval: false,
    liveRuntimeStillBlocked: true
  });

  assert.deepEqual(
    report.phase40IInventory.docs.map(({ path, status }) => [path, status]),
    [
      ["docs/phase-4-0i-final-pre-runtime-readiness.md", "present"],
      ["docs/phase-4-0h-reviewer-handoff-index.md", "present"],
      ["docs/phase-4-stdio-dry-run-event-emission.md", "present"],
      ["docs/session-events-stdio-contract.md", "present"],
      ["docs/host-policy-preconditions.md", "present"],
      ["docs/architecture.md", "present"],
      ["README.md", "present"],
      ["apps/cli/README.md", "present"],
      ["packages/core/README.md", "present"]
    ]
  );

  assert.deepEqual(report.phase40IInventory.fixtures, [
    {
      path: "tests/fixtures/host-policy/phase4-0i/final-pre-runtime-readiness.json",
      status: "present"
    },
    {
      path: "tests/fixtures/host-policy/phase4-0h/reviewer-handoff-index.json",
      status: "present"
    }
  ]);

  assert.deepEqual(
    report.phase40IInventory.tests.map(({ path, status }) => [path, status]),
    [
      ["tests/phase4-0i-final-pre-runtime-readiness.test.mjs", "present"],
      ["tests/phase4-0h-reviewer-handoff-index.test.mjs", "present"],
      ["tests/report-phase-status.test.mjs", "present"]
    ]
  );

  assert.deepEqual(report.phase40IInventory.invariantProbes, [
    "missing --dry-run",
    "unknown emit-session-events arg",
    "unsafe manifest URL",
    "invalid JSON manifest",
    "invalid JSON task",
    "replay-session-transcript",
    "policy-metadata",
    "host-policy-export",
    "serve-runtime",
    "stdio-runtime",
    "runtime",
    "run",
    "execute",
    "live-runtime",
    "runtime-proposal",
    "proposal-runtime",
    "phase-4.1-runtime",
    "host-policy-index",
    "policy-index",
    "review-index",
    "index-host-policy"
  ]);

  assert.deepEqual(report.phase40IInventory.safetyPosture, {
    nonExecuting: true,
    finalPreRuntimeReadinessOnly: true,
    reviewOnly: true,
    noLiveStdioRuntime: true,
    noStdinCommandLoop: true,
    noLiveStdioReader: true,
    noProcessStdioOwnership: true,
    noListener: true,
    noServer: true,
    noSubprocessSpawning: true,
    noAdapterCalls: true,
    noLocusRuntimeDependency: true,
    noMcpCalls: true,
    noOpenClawCalls: true,
    noPluginExecution: true,
    noContentFabricRuntimeBehavior: true,
    noContentFabricDownloadInstallEnable: true,
    noTranscriptPersistenceReplayRuntime: true,
    noWebSocketHttpControlSurface: true,
    noSecrets: true,
    noProductionSigningKeys: true,
    noRuntimeApprovalGrant: true,
    noPhase41Implementation: true,
    requiresSeparatePhase41Approval: true,
    noCliCommandAdded: true,
    noFileWriterAdded: true,
    noStdoutPrinterAdded: true,
    noRuntimeBehaviorIntroduced: true
  });
});

test("report inventories Phase 4.1 runtime proposal without implementing runtime", async () => {
  const report = await runReport();

  assert.deepEqual(report.phase41ProposalInventory.runtimeProposal, {
    document: "docs/phase-4-1-runtime-proposal.md",
    metadataFixture: "tests/fixtures/host-policy/phase4-1/runtime-proposal.json",
    schema: "ardyn.phase-4-runtime-proposal",
    schemaVersion: "0.1.0",
    proposalPhase: "phase-4.1-runtime-proposal-only",
    phaseIntroduced: "4.1",
    artifactKind: "phase_4_runtime_proposal_only_bundle",
    reviewRange: {
      fromPhase: "4.0A",
      throughPhase: "4.1"
    },
    proposalStatus: "proposal-only-review-draft",
    runtimeStatus: "runtime-proposal-only",
    implementationStatus: "not-implemented",
    approvalStatus: "not-granted",
    roadmapStatus: "future-work-only",
    proposalOnly: true,
    reviewOnly: true,
    nonExecuting: true,
    reviewMetadataOnly: true,
    grantsRuntimeApproval: false,
    runtimeApprovalGranted: false,
    runtimeBehaviorIntroduced: false,
    liveRuntimeBehaviorIntroduced: false,
    phase41RuntimeImplemented: false,
    consumedByLiveHostLoop: false,
    requiresSeparateImplementationApproval: true,
    requiresSeparateRuntimeImplementationApproval: true
  });

  assert.deepEqual(report.phase41ProposalInventory.basedOnFinalReadiness, {
    document: "docs/phase-4-0i-final-pre-runtime-readiness.md",
    metadataFixture: "tests/fixtures/host-policy/phase4-0i/final-pre-runtime-readiness.json",
    finalReadinessCommit: "34ac1c3df105074bd5c2b1f04062e8d3da59204a"
  });
  assert.deepEqual(report.phase41ProposalInventory.devinReviewPolicy, {
    priorReviewedRange: {
      fromPhase: "4.0A",
      throughPhase: "4.0H"
    },
    priorReviewer: "Devin",
    priorVerdict: "PASS",
    codexValidationForThisPhase: true,
    requiresDevinReviewNow: false,
    preserveDevinReviewFor: "major-runtime-readiness-checkpoint"
  });

  assert.equal(report.phase41ProposalInventory.approvalBoundary.status, "defined-not-granted");
  assert.equal(report.phase41ProposalInventory.approvalBoundary.grantsRuntimeApproval, false);
  assert.equal(report.phase41ProposalInventory.approvalBoundary.runtimeBehaviorIntroduced, false);
  assert.deepEqual(report.phase41ProposalInventory.phaseCoverage, [
    "4.0A",
    "4.0B",
    "4.0C",
    "4.0D",
    "4.0E",
    "4.0F",
    "4.0G",
    "4.0H",
    "4.0I",
    "4.1"
  ]);
  assert.deepEqual(
    report.phase41ProposalInventory.proposalSections.map((section) => section.id),
    phase41ProposalSectionIds
  );
  assert.deepEqual(
    report.phase41ProposalInventory.requiredTestsBeforeRuntime.map((item) => item.id),
    phase41RequiredTestIds
  );
  assert.deepEqual(
    report.phase41ProposalInventory.implementationRoadmap.map((item) => item.id),
    phase41RoadmapIds
  );
  for (const section of report.phase41ProposalInventory.proposalSections) {
    assert.equal(section.proposalOnly, true, section.id);
    assert.equal(section.grantsRuntimeApproval, false, section.id);
    assert.equal(section.runtimeBehaviorIntroduced, false, section.id);
  }
  for (const item of report.phase41ProposalInventory.requiredTestsBeforeRuntime) {
    assert.equal(item.blocksRuntimeUntilPresent, true, item.id);
    assert.equal(item.proposalOnly, true, item.id);
    assert.equal(item.grantsRuntimeApproval, false, item.id);
  }
  for (const item of report.phase41ProposalInventory.implementationRoadmap) {
    assert.equal(item.implementationInThisPhase, false, item.id);
    assert.equal(item.requiresSeparateApproval, true, item.id);
    assert.equal(item.grantsRuntimeApproval, false, item.id);
  }
  assert.equal(report.phase41ProposalInventory.implementationRoadmap.at(-1).requiresDevinReview, true);

  assert.deepEqual(report.phase41ProposalInventory.representedArtifactCounts, {
    total: 43,
    upstreamFinalReadinessArtifacts: 40,
    phase41ProposalArtifacts: 3
  });
  assert.deepEqual(
    report.phase41ProposalInventory.proposalArtifacts.map((artifact) => artifact.path),
    [
      "docs/phase-4-1-runtime-proposal.md",
      "tests/fixtures/host-policy/phase4-1/runtime-proposal.json",
      "tests/phase4-1-runtime-proposal.test.mjs"
    ]
  );

  assert.deepEqual(report.phase41ProposalInventory.cliCommandSurface, {
    commandAdded: false,
    runtimeProposalCommandAdded: false,
    phase41RuntimeCommandAdded: false,
    serveRuntimeCommandAdded: false,
    stdioRuntimeCommandAdded: false,
    transcriptReplayCommandAdded: false,
    stdoutPrinterAdded: false,
    fileWriterAdded: false,
    liveRuntimeCommandAdded: false,
    existingDryRunEmitterUnchanged: true
  });
  assert.deepEqual(report.phase41ProposalInventory.apiSurface, {
    typescriptCoreRuntimeApiAdded: false,
    rustRuntimeHelperAdded: false,
    rustStdioOwnerAdded: false,
    hostPolicyEnforcementAdded: false,
    transcriptReplayRuntimeAdded: false
  });
  assert.deepEqual(
    report.phase41ProposalInventory.docs.map(({ path, status }) => [path, status]),
    [
      ["docs/phase-4-1-runtime-proposal.md", "present"],
      ["docs/phase-4-0i-final-pre-runtime-readiness.md", "present"],
      ["docs/phase-4-stdio-dry-run-event-emission.md", "present"],
      ["docs/session-events-stdio-contract.md", "present"],
      ["docs/host-policy-preconditions.md", "present"],
      ["docs/architecture.md", "present"],
      ["README.md", "present"],
      ["apps/cli/README.md", "present"],
      ["packages/core/README.md", "present"]
    ]
  );
  assert.deepEqual(report.phase41ProposalInventory.fixtures, [
    {
      path: "tests/fixtures/host-policy/phase4-1/runtime-proposal.json",
      status: "present"
    },
    {
      path: "tests/fixtures/host-policy/phase4-0i/final-pre-runtime-readiness.json",
      status: "present"
    }
  ]);
  assert.deepEqual(
    report.phase41ProposalInventory.tests.map(({ path, status }) => [path, status]),
    [
      ["tests/phase4-1-runtime-proposal.test.mjs", "present"],
      ["tests/phase4-0i-final-pre-runtime-readiness.test.mjs", "present"],
      ["tests/report-phase-status.test.mjs", "present"]
    ]
  );
  assert.deepEqual(report.phase41ProposalInventory.safetyPosture, {
    nonExecuting: true,
    proposalOnly: true,
    reviewOnly: true,
    noLiveStdioRuntime: true,
    noStdinCommandLoop: true,
    noLiveStdioReader: true,
    noProcessStdioOwnership: true,
    noListener: true,
    noServer: true,
    noSubprocessSpawning: true,
    noAdapterCalls: true,
    noLocusRuntimeDependency: true,
    noMcpCalls: true,
    noOpenClawCalls: true,
    noPluginExecution: true,
    noContentFabricRuntimeBehavior: true,
    noContentFabricDownloadInstallEnable: true,
    noTranscriptPersistenceReplayRuntime: true,
    noWebSocketHttpControlSurface: true,
    noSecrets: true,
    noProductionSigningKeys: true,
    noRuntimeApprovalGrant: true,
    noPhase41RuntimeImplementation: true,
    requiresSeparateRuntimeImplementationApproval: true,
    noCliCommandAdded: true,
    noFileWriterAdded: true,
    noStdoutPrinterAdded: true,
    noRuntimeBehaviorIntroduced: true
  });
});

test("report inventories Phase 4.1A host-policy approval records without enabling runtime", async () => {
  const report = await runReport();
  const inventory = report.phase41AApprovalRecordInventory;

  assert.deepEqual(inventory.hostPolicyApprovalRecords, {
    document: "docs/phase-4-1a-host-policy-approval-records.md",
    source: "crates/ardyn-host/src/lib.rs",
    schema: "ardyn.host-policy-approval-record",
    schemaVersion: "0.1.0",
    recordKind: "host-policy-approval-record",
    recordPhase: "phase-4.1a-host-policy-approval-records",
    reviewedPhase: "4.1A",
    runtimeCapabilityRequested: "live-stdio-runtime",
    approvalStatus: "review-approved",
    classification: "valid_review_record",
    currentRecordRuntimeStatement:
      "Current Phase 4.1A approval records are static review/audit artifacts only and do not enable runtime.",
    staticReviewArtifactOnly: true,
    operatorConsentNecessaryButNotSufficient: true,
    currentRecordEnablesRuntime: false,
    runtimeApprovalEffectAllowed: false,
    runtimeImplementationAvailable: false,
    runtimeCommandAvailable: false,
    grantsRuntimeApproval: false,
    runtimeApprovalGranted: false,
    runtimeBehaviorIntroduced: false,
    liveRuntimeBehaviorIntroduced: false,
    hostPolicyEnforcementActive: false,
    consumedByLiveHostLoop: false
  });

  assert.deepEqual(inventory.basedOnRuntimeProposal, {
    document: "docs/phase-4-1-runtime-proposal.md",
    metadataFixture: "tests/fixtures/host-policy/phase4-1/runtime-proposal.json",
    proposalPhase: "phase-4.1-runtime-proposal-only",
    approvalBoundaryId: "phase-4-1-live-runtime-approval-boundary",
    roadmapItem: "phase-4.1a-host-policy-approval-records",
    grantsRuntimeApproval: false,
    phase41RuntimeImplemented: false
  });
  assert.deepEqual(inventory.approvalRecordModel.classes, phase41AApprovalClassifications);
  assert.equal(inventory.approvalRecordModel.nonRuntimeReviewMetadataOnly, true);
  assert.deepEqual(inventory.operatorConsentDisplayFields.consentScope, phase41AConsentScope);
  assert.equal(inventory.operatorConsentDisplayFields.operatorConsentRuntimeEffectAllowed, false);
  assert.equal(
    inventory.operatorConsentDisplayFields.operatorConsentNecessaryButNotSufficient,
    true
  );
  assert.deepEqual(inventory.runtimeScopeNames.targetCommands, ["serve-runtime", "stdio-runtime"]);
  assert.equal(inventory.runtimeScopeNames.serveRuntimeAvailable, false);
  assert.equal(inventory.runtimeScopeNames.stdioRuntimeAvailable, false);
  assert.equal(inventory.runtimeScopeNames.requiresSeparateImplementationPhase, true);
  assert.equal(inventory.runtimeScopeNames.devinReviewRequiredBeforeEnablement, true);

  for (const reason of [
    "missing_operator_consent",
    "unsupported_schema_major",
    "malformed_record",
    "runtime_effect_flag_true",
    "runtime_not_available"
  ]) {
    assert.ok(inventory.denialReasonCatalog.includes(reason), reason);
  }

  assert.deepEqual(inventory.reviewOnlyDisplayBehavior, {
    approvalRecordsAreReviewAuditArtifactsOnly: true,
    operatorConsentNecessaryButNotSufficient: true,
    currentRecordsDoNotEnableRuntime: true,
    futureRuntimeRequiresSeparateApprovedImplementationPhase: true,
    preserveDevinReviewForMajorRuntimeReadinessCheckpoint: true,
    reportRunsChecks: false,
    writesFiles: false,
    printsStdoutFromCli: false,
    consumedByLiveHostLoop: false
  });
  assert.deepEqual(inventory.cliCommandSurface, {
    commandAdded: false,
    approvalRecordCommandAdded: false,
    operatorConsentCommandAdded: false,
    approveRuntimeCommandAdded: false,
    grantRuntimeCommandAdded: false,
    enableRuntimeCommandAdded: false,
    serveRuntimeCommandAdded: false,
    stdioRuntimeCommandAdded: false,
    stdoutPrinterAdded: false,
    fileWriterAdded: false,
    liveRuntimeCommandAdded: false,
    existingDryRunEmitterUnchanged: true
  });
  assert.deepEqual(inventory.apiSurface, {
    rustReviewOnlyTypesAdded: true,
    rustRuntimeHelperAdded: false,
    rustStdioOwnerAdded: false,
    typescriptCoreRuntimeApiAdded: false,
    hostPolicyEnforcementAdded: false,
    approvalEvaluatorAdded: false,
    transcriptReplayRuntimeAdded: false
  });
  assert.deepEqual(
    inventory.fixtures.map(({ path, status }) => [path, status]),
    phase41AFixtureFiles.map((path) => [path, "present"])
  );
  assert.deepEqual(
    inventory.docs.map(({ path, status }) => [path, status]),
    [
      ["docs/phase-4-1a-host-policy-approval-records.md", "present"],
      ["docs/phase-4-1-runtime-proposal.md", "present"],
      ["docs/phase-4-stdio-dry-run-event-emission.md", "present"],
      ["docs/session-events-stdio-contract.md", "present"],
      ["docs/host-policy-preconditions.md", "present"],
      ["docs/architecture.md", "present"],
      ["README.md", "present"],
      ["apps/cli/README.md", "present"],
      ["packages/core/README.md", "present"],
      ["crates/ardyn-host/README.md", "present"]
    ]
  );
  assert.deepEqual(
    inventory.tests.map(({ path, status }) => [path, status]),
    [
      ["crates/ardyn-host/src/lib.rs", "present"],
      ["tests/phase4-1a-host-policy-approval-records.test.mjs", "present"],
      ["tests/report-phase-status.test.mjs", "present"]
    ]
  );
  assert.deepEqual(inventory.invariantProbes, [
    "missing --dry-run",
    "unknown emit-session-events arg",
    "unsafe manifest URL",
    "invalid JSON manifest",
    "invalid JSON task",
    "replay-session-transcript",
    "policy-metadata",
    "host-policy-export",
    "serve-runtime",
    "stdio-runtime",
    "approve-runtime",
    "grant-runtime",
    "host-policy-approval",
    "operator-consent",
    "enable-runtime",
    "phase-4-1a-approval-records"
  ]);
  assert.deepEqual(inventory.safetyPosture, {
    nonExecuting: true,
    approvalRecordOnly: true,
    reviewOnly: true,
    noLiveStdioRuntime: true,
    noStdinCommandLoop: true,
    noLiveStdioReader: true,
    noProcessStdioOwnership: true,
    noListener: true,
    noServer: true,
    noSubprocessSpawning: true,
    noAdapterCalls: true,
    noLocusRuntimeDependency: true,
    noMcpCalls: true,
    noOpenClawCalls: true,
    noPluginExecution: true,
    noContentFabricRuntimeBehavior: true,
    noContentFabricDownloadInstallEnable: true,
    noTranscriptPersistenceReplayRuntime: true,
    noWebSocketHttpControlSurface: true,
    noSecrets: true,
    noProductionSigningKeys: true,
    noRuntimeApprovalGrant: true,
    noHostPolicyEnforcement: true,
    noApprovalEvaluator: true,
    noCliCommandAdded: true,
    noFileWriterAdded: true,
    noStdoutPrinterAdded: true,
    noRuntimeBehaviorIntroduced: true
  });
});

test("report inventories Phase 4.1B transport harness contracts without enabling runtime", async () => {
  const report = await runReport();
  const inventory = report.phase41BTransportHarnessInventory;

  assert.deepEqual(inventory.transportHarnessContract, {
    document: "docs/phase-4-1b-transport-harness-contracts.md",
    source: "crates/ardyn-host/src/lib.rs",
    fixture: "tests/fixtures/host-policy/phase4-1b/valid-static-transport-harness-contract.json",
    schema: "ardyn.transport-harness-contract",
    schemaVersion: "0.1.0",
    contractKind: "transport-harness-contract",
    contractPhase: "phase-4.1b-transport-harness-contracts",
    reviewedPhase: "4.1B",
    harnessKind: "rust-host-stdio-transport-harness-static-contract",
    harnessVersion: "0.1.0",
    classification: "static_contract_only",
    staticContractOnly: true,
    runtimeAvailable: false,
    currentContractEnablesRuntime: false,
    runtimeCommandAvailable: false,
    processStdioOwnershipAvailable: false,
    stdinReaderAvailable: false,
    stdoutWriterAvailable: false,
    stderrWriterAvailable: false,
    grantsRuntimeApproval: false,
    runtimeApprovalGranted: false,
    runtimeBehaviorIntroduced: false,
    liveRuntimeBehaviorIntroduced: false,
    consumedByLiveHostLoop: false
  });

  assert.deepEqual(inventory.basedOnApprovalRecord, {
    document: "docs/phase-4-1a-host-policy-approval-records.md",
    fixture: "tests/fixtures/host-policy/phase4-1a/valid-review-only-host-policy-approval-record.json",
    schema: "ardyn.host-policy-approval-record",
    classification: "valid_review_record",
    operatorConsentNecessaryButNotSufficient: true,
    approvalRecordGrantsRuntime: false
  });
  assert.deepEqual(inventory.basedOnPolicyMetadata, {
    document: "docs/phase-4-stdio-dry-run-event-emission.md",
    fixture: "tests/fixtures/host-policy/phase4-0e/stdio-transport-policy-metadata.json",
    schema: "ardyn.stdio-transport-policy-metadata",
    schemaVersion: "0.1.0",
    runtimeStatus: "pre-runtime-policy-only",
    reviewOnly: true,
    digestAlgorithm: "sha256"
  });
  assert.deepEqual(inventory.harnessContractModel.classes, phase41BTransportHarnessClassifications);
  assert.equal(inventory.harnessContractModel.exactCurrentStaticContractRequired, true);
  assert.equal(inventory.harnessContractModel.nonRuntimeReviewMetadataOnly, true);
  assert.deepEqual(
    inventory.supportedTransportModes.map(({ name, direction, metadataOnly, runtimeImplemented }) => ({
      name,
      direction,
      metadataOnly,
      runtimeImplemented
    })),
    [
      {
        name: "stdio-jsonl-session-events",
        direction: "stdout",
        metadataOnly: true,
        runtimeImplemented: false
      },
      {
        name: "stderr-diagnostics",
        direction: "stderr",
        metadataOnly: true,
        runtimeImplemented: false
      },
      {
        name: "stdin-command-stream",
        direction: "stdin",
        metadataOnly: true,
        runtimeImplemented: false
      }
    ]
  );
  assert.equal(inventory.runtimeAvailability.runtimeAvailable, false);
  assert.equal(inventory.runtimeAvailability.serveRuntimeAvailable, false);
  assert.equal(inventory.runtimeAvailability.stdioRuntimeAvailable, false);
  assert.equal(inventory.runtimeAvailability.processStdioOwnershipAvailable, false);
  assert.equal(inventory.runtimeAvailability.stdinReaderAvailable, false);
  assert.equal(inventory.requiredReferences.approvalRecordReference.present, true);
  assert.equal(inventory.requiredReferences.approvalRecordReference.approvalRecordGrantsRuntime, false);
  assert.equal(inventory.requiredReferences.policyMetadataReference.present, true);
  assert.equal(inventory.requiredReferences.stderrRedactionPolicyReference.present, true);
  assert.equal(inventory.requiredReferences.stderrRedactionPolicyReference.enforcementActive, false);
  assert.equal(inventory.requiredReferences.transcriptAuditOutputPolicyReference.present, true);
  assert.equal(
    inventory.requiredReferences.transcriptAuditOutputPolicyReference
      .transcriptPersistenceRuntimeImplemented,
    false
  );

  assert.deepEqual(inventory.reviewOnlyDisplayBehavior, {
    transportHarnessContractsAreStaticArtifactsOnly: true,
    approvalReferencesNecessaryButNotSufficient: true,
    currentContractsDoNotEnableRuntime: true,
    futureRuntimeRequiresSeparateApprovedImplementationPhase: true,
    preserveDevinReviewForMajorRuntimeReadinessCheckpoint: true,
    reportRunsChecks: false,
    writesFiles: false,
    printsStdoutFromCli: false,
    consumedByLiveHostLoop: false
  });
  assert.deepEqual(inventory.cliCommandSurface, {
    commandAdded: false,
    transportHarnessCommandAdded: false,
    serveRuntimeCommandAdded: false,
    stdioRuntimeCommandAdded: false,
    stdinReaderCommandAdded: false,
    stdoutWriterCommandAdded: false,
    stderrWriterCommandAdded: false,
    failureAuditCommandAdded: false,
    fileWriterAdded: false,
    stdoutPrinterAdded: false,
    existingDryRunEmitterUnchanged: true
  });
  assert.deepEqual(inventory.apiSurface, {
    rustStaticContractTypesAdded: true,
    rustRuntimeHelperAdded: false,
    rustStdioOwnerAdded: false,
    rustStdinReaderAdded: false,
    rustStdoutWriterAdded: false,
    rustStderrWriterAdded: false,
    typescriptCoreRuntimeApiAdded: false,
    hostPolicyEnforcementAdded: false,
    approvalEvaluatorAdded: false,
    transcriptReplayRuntimeAdded: false,
    failureAuditRuntimeAdded: false
  });
  assert.deepEqual(
    inventory.fixtures.map(({ path, status }) => [path, status]),
    phase41BFixtureFiles.map((path) => [path, "present"])
  );
  assert.deepEqual(
    inventory.docs.map(({ path, status }) => [path, status]),
    [
      ["docs/phase-4-1b-transport-harness-contracts.md", "present"],
      ["docs/phase-4-1a-host-policy-approval-records.md", "present"],
      ["docs/phase-4-1-runtime-proposal.md", "present"],
      ["docs/phase-4-stdio-dry-run-event-emission.md", "present"],
      ["docs/session-events-stdio-contract.md", "present"],
      ["docs/host-policy-preconditions.md", "present"],
      ["docs/architecture.md", "present"],
      ["README.md", "present"],
      ["apps/cli/README.md", "present"],
      ["packages/core/README.md", "present"],
      ["crates/ardyn-host/README.md", "present"]
    ]
  );
  assert.deepEqual(
    inventory.tests.map(({ path, status }) => [path, status]),
    [
      ["crates/ardyn-host/src/lib.rs", "present"],
      ["tests/phase4-1b-transport-harness-contracts.test.mjs", "present"],
      ["tests/report-phase-status.test.mjs", "present"]
    ]
  );

  for (const probe of [
    "transport-harness",
    "transport-harness-contract",
    "stdin-reader",
    "stdout-writer",
    "stderr-writer",
    "failure-audit",
    "emit-failure-audit"
  ]) {
    assert.ok(inventory.invariantProbes.includes(probe), probe);
  }

  assert.deepEqual(inventory.safetyPosture, {
    nonExecuting: true,
    transportHarnessContractOnly: true,
    reviewOnly: true,
    noLiveStdioRuntime: true,
    noStdinCommandLoop: true,
    noLiveStdioReader: true,
    noProcessStdioOwnership: true,
    noListener: true,
    noServer: true,
    noSubprocessSpawning: true,
    noAdapterCalls: true,
    noLocusRuntimeDependency: true,
    noMcpCalls: true,
    noOpenClawCalls: true,
    noPluginExecution: true,
    noContentFabricRuntimeBehavior: true,
    noContentFabricDownloadInstallEnable: true,
    noTranscriptPersistenceReplayRuntime: true,
    noWebSocketHttpControlSurface: true,
    noSecrets: true,
    noProductionSigningKeys: true,
    noRuntimeApprovalGrant: true,
    noHostPolicyEnforcement: true,
    noApprovalEvaluator: true,
    noStdoutWriter: true,
    noStderrWriter: true,
    noFailureAuditRuntime: true,
    noCliCommandAdded: true,
    noFileWriterAdded: true,
    noStdoutPrinterAdded: true,
    noRuntimeBehaviorIntroduced: true
  });
});

test("report inventories Phase 4.1C framing and redaction contracts without enabling runtime", async () => {
  const report = await runReport();
  const inventory = report.phase41CFramingRedactionInventory;

  assert.deepEqual(inventory.framingRedactionContract, {
    document: "docs/phase-4-1c-framing-redaction-contracts.md",
    source: "packages/core/src/index.mjs",
    types: "packages/core/src/index.d.ts",
    fixture: "tests/fixtures/host-policy/phase4-1c/valid-static-framing-redaction-contract.json",
    schema: "ardyn.stdio-framing-redaction-contract",
    schemaVersion: "0.1.0",
    contractKind: "stdio-framing-redaction-contract",
    contractPhase: "phase-4.1c-framing-redaction-contracts",
    reviewedPhase: "4.1C",
    staticContractOnly: true,
    currentContractEnablesRuntime: false,
    runtimeImplementationAvailable: false,
    runtimeCommandAvailable: false,
    processStdioOwnershipAvailable: false,
    stdinReaderAvailable: false,
    stdoutWriterAvailable: false,
    stderrWriterAvailable: false,
    failureAuditRuntimeAvailable: false,
    approvalEvaluatorAvailable: false,
    runtimeBehaviorIntroduced: false,
    liveRuntimeBehaviorIntroduced: false,
    consumedByLiveHostLoop: false
  });
  assert.deepEqual(inventory.basedOnTransportHarness, {
    document: "docs/phase-4-1b-transport-harness-contracts.md",
    fixture: "tests/fixtures/host-policy/phase4-1b/valid-static-transport-harness-contract.json",
    schema: "ardyn.transport-harness-contract",
    schemaVersion: "0.1.0",
    contractKind: "transport-harness-contract",
    contractPhase: "phase-4.1b-transport-harness-contracts",
    reviewedPhase: "4.1B",
    classification: "static_contract_only",
    approvalReferencesNecessaryButNotSufficient: true,
    currentContractEnablesRuntime: false,
    processStdioOwnershipAvailable: false,
    stdoutWriterAvailable: false,
    stderrWriterAvailable: false
  });
  assert.deepEqual(inventory.jsonlFraming, {
    exactlyOneJsonObjectPerLine: true,
    jsonObjectOnly: true,
    lfOnly: true,
    finalLfRequired: true,
    blankLinesAllowed: false,
    crlfAllowed: false,
    partialLineEmissionAllowed: false,
    deterministicKeyOrder: "ascii-key-order-via-stable-json-display-v1",
    helper: "formatJsonlWholeLinesForReview",
    classifications: phase41CJsonlClassifications,
    reviewOnly: true,
    noLiveWriter: true,
    stdoutWriterAvailable: false,
    writesToStdout: false,
    runtimeCommandAvailable: false
  });
  assert.deepEqual(inventory.stderrRedaction, {
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
    ],
    classifications: phase41CRedactionClassifications,
    reviewOnly: true,
    noLiveWriter: true,
    stderrWriterAvailable: false,
    writesToStderr: false,
    runtimeCommandAvailable: false
  });
  assert.deepEqual(inventory.validation, {
    helper: "validateJsonlWholeLineBundle",
    jsonlClassifications: phase41CJsonlClassifications,
    redactionClassifications: phase41CRedactionClassifications,
    fixtureBacked: true,
    reportRunsChecks: false,
    helpers: [
      "formatJsonlWholeLinesForReview",
      "validateJsonlWholeLineBundle",
      "redactStderrDiagnosticForReview",
      "classifyRedactionSafety"
    ]
  });
  assert.deepEqual(inventory.runtimeEffect, {
    currentContractEnablesRuntime: false,
    runtimeImplementationAvailable: false,
    runtimeCommandAvailable: false,
    processStdioOwnershipAvailable: false,
    stdinReaderAvailable: false,
    stdoutWriterAvailable: false,
    stderrWriterAvailable: false,
    failureAuditRuntimeAvailable: false,
    approvalEvaluatorAvailable: false
  });
  assert.deepEqual(inventory.reviewOnlyDisplayBehavior, {
    framingRedactionContractsAreStaticArtifactsOnly: true,
    currentContractsDoNotEnableRuntime: true,
    futureRuntimeRequiresSeparateApprovedImplementationPhase: true,
    preserveDevinReviewForMajorRuntimeReadinessCheckpoint: true,
    reportRunsChecks: false,
    writesFiles: false,
    printsStdoutFromCli: false,
    consumedByLiveHostLoop: false
  });
  assert.deepEqual(inventory.cliCommandSurface, {
    commandAdded: false,
    framingRedactionCommandAdded: false,
    stdoutFramingCommandAdded: false,
    stderrRedactionCommandAdded: false,
    stdoutWriterCommandAdded: false,
    stderrWriterCommandAdded: false,
    serveRuntimeCommandAdded: false,
    stdioRuntimeCommandAdded: false,
    fileWriterAdded: false,
    stdoutPrinterAdded: false,
    existingDryRunEmitterUnchanged: true
  });
  assert.deepEqual(inventory.apiSurface, {
    typescriptCoreStaticReviewHelpersAdded: true,
    typescriptCoreRuntimeApiAdded: false,
    rustRuntimeHelperAdded: false,
    rustStdioOwnerAdded: false,
    rustStdoutWriterAdded: false,
    rustStderrWriterAdded: false,
    approvalEvaluatorAdded: false,
    failureAuditRuntimeAdded: false,
    secretsUsed: false
  });
  assert.deepEqual(
    inventory.fixtures.map(({ path, status }) => [path, status]),
    phase41CFixtureFiles.map((path) => [path, "present"])
  );
  assert.deepEqual(
    inventory.docs.map(({ path, status }) => [path, status]),
    [
      ["docs/phase-4-1c-framing-redaction-contracts.md", "present"],
      ["docs/phase-4-1b-transport-harness-contracts.md", "present"],
      ["docs/phase-4-1-runtime-proposal.md", "present"],
      ["docs/phase-4-stdio-dry-run-event-emission.md", "present"],
      ["docs/session-events-stdio-contract.md", "present"],
      ["docs/host-policy-preconditions.md", "present"],
      ["docs/architecture.md", "present"],
      ["README.md", "present"],
      ["apps/cli/README.md", "present"],
      ["packages/core/README.md", "present"],
      ["crates/ardyn-host/README.md", "present"]
    ]
  );
  assert.deepEqual(
    inventory.tests.map(({ path, status }) => [path, status]),
    [
      ["tests/phase4-1c-framing-redaction-contracts.test.mjs", "present"],
      ["tests/report-phase-status.test.mjs", "present"],
      ["packages/core/src/index.mjs", "present"],
      ["packages/core/src/index.d.ts", "present"]
    ]
  );

  for (const probe of [
    "framing-redaction",
    "stdout-framing",
    "stderr-redaction",
    "redact-stderr",
    "validate-jsonl-framing",
    "phase-4-1c-framing-redaction"
  ]) {
    assert.ok(inventory.invariantProbes.includes(probe), probe);
  }

  assert.deepEqual(inventory.safetyPosture, {
    nonExecuting: true,
    framingRedactionContractOnly: true,
    reviewOnly: true,
    noLiveStdioRuntime: true,
    noStdinCommandLoop: true,
    noLiveStdioReader: true,
    noProcessStdioOwnership: true,
    noListener: true,
    noServer: true,
    noSubprocessSpawning: true,
    noAdapterCalls: true,
    noLocusRuntimeDependency: true,
    noMcpCalls: true,
    noOpenClawCalls: true,
    noPluginExecution: true,
    noContentFabricRuntimeBehavior: true,
    noContentFabricDownloadInstallEnable: true,
    noTranscriptPersistenceReplayRuntime: true,
    noWebSocketHttpControlSurface: true,
    noSecrets: true,
    noProductionSigningKeys: true,
    noRuntimeApprovalGrant: true,
    noHostPolicyEnforcement: true,
    noApprovalEvaluator: true,
    noStdoutWriter: true,
    noStderrWriter: true,
    noFailureAuditRuntime: true,
    noCliCommandAdded: true,
    noFileWriterAdded: true,
    noStdoutPrinterAdded: true,
    noRuntimeBehaviorIntroduced: true
  });
});

test("report inventories Phase 4.1D transcript replay contracts without enabling runtime", async () => {
  const report = await runReport();
  const inventory = report.phase41DTranscriptReplayInventory;

  assert.equal(inventory.transcriptPersistenceContract.schema, "ardyn.transcript-persistence-contract");
  assert.equal(inventory.transcriptPersistenceContract.schemaVersion, "0.1.0");
  assert.equal(inventory.transcriptPersistenceContract.contractKind, "transcript-persistence-contract");
  assert.equal(inventory.transcriptPersistenceContract.contractPhase, "phase-4.1d-transcript-replay-contracts");
  assert.equal(inventory.transcriptPersistenceContract.reviewedPhase, "4.1D");
  assert.equal(inventory.transcriptPersistenceContract.transcriptArtifactKind, "ardyn.session-transcript");
  assert.equal(inventory.transcriptPersistenceContract.transcriptVersion, "0.1.0");
  assert.equal(inventory.transcriptPersistenceContract.eventCount, 7);
  assert.deepEqual(inventory.transcriptPersistenceContract.sequenceRange, { first: 1, last: 7 });
  assert.equal(inventory.transcriptPersistenceContract.eventDigest.algorithm, "sha256");
  assert.match(inventory.transcriptPersistenceContract.eventDigest.value, /^sha256:[0-9a-f]{64}$/);
  assert.equal(inventory.transcriptPersistenceContract.persistedAt, "1970-01-01T00:00:00.000Z");
  assert.equal(
    inventory.transcriptPersistenceContract.persistedAtIsDeterministicFixtureMetadataOnly,
    true
  );
  assert.equal(inventory.transcriptPersistenceContract.staticContractOnly, true);
  assert.equal(inventory.transcriptPersistenceContract.replayCompatibilityClassification, "replay_contract_only");
  assert.equal(inventory.transcriptPersistenceContract.transcriptPersistenceRuntimeAvailable, false);
  assert.equal(inventory.transcriptPersistenceContract.transcriptReplayRuntimeAvailable, false);
  assert.equal(inventory.transcriptPersistenceContract.replayCommandAvailable, false);
  assert.equal(inventory.transcriptPersistenceContract.writesFiles, false);

  assert.equal(inventory.transcriptReplayContract.schema, "ardyn.transcript-replay-contract");
  assert.equal(inventory.transcriptReplayContract.contractKind, "transcript-replay-contract");
  assert.equal(inventory.transcriptReplayContract.staticContractOnly, true);
  assert.deepEqual(inventory.transcriptReplayContract.replayCommand, {
    name: "replay-session-transcript",
    implemented: false,
    rejectedByCli: true
  });
  assert.equal(inventory.transcriptReplayContract.transcriptPersistenceRuntimeAvailable, false);
  assert.equal(inventory.transcriptReplayContract.transcriptReplayRuntimeAvailable, false);
  assert.equal(inventory.transcriptReplayContract.replayCommandAvailable, false);
  assert.equal(inventory.transcriptReplayContract.writesFiles, false);

  assert.equal(inventory.compatibilityRecord.schema, "ardyn.transcript-replay-compatibility-record");
  assert.equal(inventory.compatibilityRecord.recordKind, "transcript-replay-compatibility-record");
  assert.equal(inventory.compatibilityRecord.classification, "compatible");
  assert.equal(inventory.compatibilityRecord.replaySafetyStatus, "static-compatible-review-only");
  assert.equal(inventory.compatibilityRecord.replayRuntimeAvailable, false);
  assert.equal(inventory.compatibilityRecord.replayCommandAvailable, false);
  assert.equal(inventory.compatibilityRecord.writesFiles, false);

  assert.deepEqual(inventory.basedOnFramingRedaction, {
    document: "docs/phase-4-1c-framing-redaction-contracts.md",
    fixture: "tests/fixtures/host-policy/phase4-1c/valid-static-framing-redaction-contract.json",
    schema: "ardyn.stdio-framing-redaction-contract",
    contractKind: "stdio-framing-redaction-contract",
    reviewedPhase: "4.1C",
    currentContractEnablesRuntime: false,
    stdoutWriterAvailable: false,
    stderrWriterAvailable: false
  });
  assert.deepEqual(inventory.normalizedTranscriptContract, {
    schema: "ardyn.session-transcript",
    schemaVersion: "0.1.0",
    helpers: [
      "validateSessionTranscript",
      "classifySessionTranscriptCompatibility",
      "buildSessionTranscriptDisplaySummary",
      "buildSessionTranscriptMigrationMetadata"
    ],
    compatibilityClasses: ["compatible", "upgrade_available", "unsupported_major", "malformed"],
    normalizedTranscriptInputOnly: true,
    rawJsonlForensicOnly: true
  });
  assert.deepEqual(inventory.replayCompatibility, {
    classifier: "classifyTranscriptReplayCompatibilityForReview",
    persistenceHelper: "createTranscriptPersistenceContractForReview",
    replayContractHelper: "createTranscriptReplayContractForReview",
    compatibilityRecordHelper: "createTranscriptReplayCompatibilityRecordForReview",
    classifications: phase41DReplayClassifications,
    failClosedClassifications: phase41DFailClosedClassifications
  });
  assert.deepEqual(inventory.inertReplayReview, {
    normalizedTranscriptInputOnly: true,
    rawJsonlForensicOnly: true,
    noLiveReplayConsumer: true,
    noAdapters: true,
    noTaskExecution: true,
    noTranscriptPersistenceRuntime: true,
    noReplayRuntime: true,
    replaySessionTranscriptRejected: true
  });
  assert.deepEqual(inventory.runtimeEffect, {
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
  });
  assert.deepEqual(inventory.reviewOnlyDisplayBehavior, {
    transcriptReplayContractsAreStaticArtifactsOnly: true,
    currentContractsDoNotEnableRuntime: true,
    futureRuntimeRequiresSeparateApprovedImplementationPhase: true,
    preserveDevinReviewForMajorRuntimeReadinessCheckpoint: true,
    reportRunsChecks: false,
    writesFiles: false,
    readsFiles: false,
    printsStdoutFromCli: false,
    consumedByLiveHostLoop: false
  });
  assert.deepEqual(inventory.cliCommandSurface, {
    commandAdded: false,
    replaySessionTranscriptCommandAdded: false,
    persistSessionTranscriptCommandAdded: false,
    transcriptReplayCommandAdded: false,
    transcriptPersistenceCommandAdded: false,
    serveRuntimeCommandAdded: false,
    stdioRuntimeCommandAdded: false,
    fileWriterAdded: false,
    stdoutPrinterAdded: false,
    existingDryRunEmitterUnchanged: true,
    existingValidateSessionTranscriptUnchanged: true
  });
  assert.deepEqual(inventory.apiSurface, {
    typescriptCoreStaticReviewHelpersAdded: true,
    typescriptCoreRuntimeApiAdded: false,
    rustRuntimeHelperAdded: false,
    rustStdioOwnerAdded: false,
    rustTranscriptPersistenceRuntimeAdded: false,
    rustTranscriptReplayRuntimeAdded: false,
    approvalEvaluatorAdded: false,
    failureAuditRuntimeAdded: false,
    secretsUsed: false
  });
  assert.deepEqual(
    inventory.fixtures.map(({ path, status }) => [path, status]),
    phase41DFixtureFiles.map((path) => [path, "present"])
  );
  assert.deepEqual(
    inventory.docs.map(({ path, status }) => [path, status]),
    [
      ["docs/phase-4-1d-transcript-replay-contracts.md", "present"],
      ["docs/phase-4-1c-framing-redaction-contracts.md", "present"],
      ["docs/phase-4-1-runtime-proposal.md", "present"],
      ["docs/phase-4-stdio-dry-run-event-emission.md", "present"],
      ["docs/session-events-stdio-contract.md", "present"],
      ["docs/host-policy-preconditions.md", "present"],
      ["docs/architecture.md", "present"],
      ["README.md", "present"],
      ["apps/cli/README.md", "present"],
      ["packages/core/README.md", "present"],
      ["crates/ardyn-host/README.md", "present"]
    ]
  );
  assert.deepEqual(
    inventory.tests.map(({ path, status }) => [path, status]),
    [
      ["tests/phase4-1d-transcript-replay-contracts.test.mjs", "present"],
      ["tests/report-phase-status.test.mjs", "present"],
      ["packages/core/src/index.mjs", "present"],
      ["packages/core/src/index.d.ts", "present"]
    ]
  );

  for (const probe of [
    "replay-session-transcript",
    "persist-session-transcript",
    "transcript-replay",
    "transcript-persistence",
    "transcript-sidecar",
    "serve-runtime",
    "stdio-runtime"
  ]) {
    assert.ok(inventory.invariantProbes.includes(probe), probe);
  }

  assert.deepEqual(inventory.safetyPosture, {
    nonExecuting: true,
    transcriptReplayContractOnly: true,
    reviewOnly: true,
    noLiveStdioRuntime: true,
    noStdinCommandLoop: true,
    noLiveStdioReader: true,
    noProcessStdioOwnership: true,
    noListener: true,
    noServer: true,
    noSubprocessSpawning: true,
    noAdapterCalls: true,
    noLocusRuntimeDependency: true,
    noMcpCalls: true,
    noOpenClawCalls: true,
    noPluginExecution: true,
    noContentFabricRuntimeBehavior: true,
    noContentFabricDownloadInstallEnable: true,
    noTranscriptPersistenceReplayRuntime: true,
    noReplayRuntime: true,
    noWebSocketHttpControlSurface: true,
    noSecrets: true,
    noProductionSigningKeys: true,
    noRuntimeApprovalGrant: true,
    noHostPolicyEnforcement: true,
    noApprovalEvaluator: true,
    noStdoutWriter: true,
    noStderrWriter: true,
    noFailureAuditRuntime: true,
    noCliCommandAdded: true,
    noFileWriterAdded: true,
    noStdoutPrinterAdded: true,
    noRuntimeBehaviorIntroduced: true
  });
});

test("report inventories Phase 4.1E failure-audit kill semantics without enabling runtime", async () => {
  const report = await runReport();
  const inventory = report.phase41EFailureAuditInventory;

  assert.equal(inventory.failureAuditRecord.schema, "ardyn.failure-audit-record");
  assert.equal(inventory.failureAuditRecord.schemaVersion, "0.1.0");
  assert.equal(inventory.failureAuditRecord.recordKind, "failure-audit-record");
  assert.equal(inventory.failureAuditRecord.recordPhase, "phase-4.1e-failure-audit-kill-semantics");
  assert.equal(inventory.failureAuditRecord.reviewedPhase, "4.1E");
  assert.equal(inventory.failureAuditRecord.sourcePhase, "phase-4.1d-transcript-replay-contracts");
  assert.equal(inventory.failureAuditRecord.classification, "static_contract_only");
  assert.equal(inventory.failureAuditRecord.failureCategory, "contract-definition");
  assert.equal(inventory.failureAuditRecord.terminalState, "not-run");
  assert.equal(inventory.failureAuditRecord.exitCodeClassification, "not-applicable");
  assert.equal(inventory.failureAuditRecord.stderrDiagnosticClassification, "clean_failure");
  assert.equal(inventory.failureAuditRecord.redactionStatus, "redacted_safe");
  assert.equal(inventory.failureAuditRecord.runtimeAvailabilityStatus, "runtime_unavailable");
  assert.equal(inventory.failureAuditRecord.failureAuditRuntimeAvailable, false);
  assert.equal(inventory.failureAuditRecord.cleanupRuntimeAvailable, false);
  assert.equal(inventory.failureAuditRecord.processKillAvailable, false);
  assert.equal(inventory.failureAuditRecord.processControlAvailable, false);
  assert.equal(inventory.failureAuditRecord.signalHandlerAvailable, false);
  assert.equal(inventory.failureAuditRecord.exitHandlerAvailable, false);
  assert.equal(inventory.failureAuditRecord.runtimeBehaviorIntroduced, false);
  assert.equal(inventory.failureAuditRecord.liveRuntimeBehaviorIntroduced, false);
  assert.equal(inventory.failureAuditRecord.consumedByLiveHostLoop, false);

  assert.deepEqual(inventory.redactedFailureDiagnostic, {
    fixture: "tests/fixtures/host-policy/phase4-1e/redacted-failure-diagnostic-record.json",
    classification: "redacted_failure",
    stderrDiagnosticClassification: "redacted_failure",
    redactionStatus: "redacted_safe",
    redactionCount: 1,
    rawDiagnosticIncluded: false
  });
  assert.deepEqual(inventory.runtimeAttempt, {
    fixture: "tests/fixtures/host-policy/phase4-1e/runtime-cleanup-kill-attempt-record.json",
    classification: "runtime_unavailable",
    sourceClassification: "cleanup_required",
    cleanupRuntimeAttempted: true,
    processKillAttempted: true,
    signalHandlerAttempted: true,
    failClosedExpected: true
  });
  assert.deepEqual(inventory.terminalStateRules, {
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
  });
  assert.deepEqual(inventory.nonzeroExitMappingRules, {
    deterministic: true,
    osSignalBehaviorEvaluated: false,
    exitZeroRequiresTerminalCompleted: true,
    sessionErrorMapsToNonzero: true,
    missingTerminalEventMapsToNonzero: true,
    redactionFailureMapsToNonzero: true,
    cleanupFailureMapsToNonzero: true,
    unexpectedNonzeroFailsClosed: true
  });
  assert.equal(inventory.stdoutCommitBoundary.policyOnly, true);
  assert.equal(inventory.stdoutCommitBoundary.partialOutputMayBecomeTranscriptEvidence, false);
  assert.equal(inventory.stdoutCommitBoundary.synthesizedTerminalEventAllowed, false);
  assert.equal(inventory.cleanupKillSemantics.cleanupRequirement.policyOnly, true);
  assert.equal(inventory.cleanupKillSemantics.killInterruptTimeoutSemantics.policyOnly, true);
  assert.equal(inventory.cleanupKillSemantics.cleanupRuntimeAvailable, false);
  assert.equal(inventory.cleanupKillSemantics.processKillAvailable, false);
  assert.equal(inventory.cleanupKillSemantics.killRuntimeAvailable, false);
  assert.equal(inventory.cleanupKillSemantics.interruptRuntimeAvailable, false);
  assert.equal(inventory.cleanupKillSemantics.timeoutRuntimeAvailable, false);
  assert.equal(inventory.cleanupKillSemantics.processControlAvailable, false);
  assert.deepEqual(inventory.transcriptPersistenceReplayImpact, {
    policyOnly: true,
    transcriptPersistenceRuntimeAvailable: false,
    transcriptReplayRuntimeAvailable: false,
    partialTranscriptMayBePersisted: false,
    replayPermitted: false,
    normalizedTranscriptRequiredBeforeReplay: true
  });
  assert.deepEqual(inventory.runtimeEffect, {
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
  });
  assert.deepEqual(inventory.classifications, phase41EFailureAuditClassifications);
  assert.deepEqual(inventory.failClosedClassifications, phase41EFailClosedClassifications);
  assert.deepEqual(inventory.reviewOnlyDisplayBehavior, {
    failureAuditRecordsAreStaticArtifactsOnly: true,
    currentContractsDoNotEnableRuntime: true,
    futureRuntimeRequiresSeparateApprovedImplementationPhase: true,
    preserveDevinReviewForMajorRuntimeReadinessCheckpoint: true,
    reportRunsChecks: false,
    writesFiles: false,
    readsFiles: false,
    printsStdoutFromCli: false,
    consumedByLiveHostLoop: false
  });
  assert.deepEqual(inventory.cliCommandSurface, {
    commandAdded: false,
    failureAuditCommandAdded: false,
    emitFailureAuditCommandAdded: false,
    cleanupRuntimeCommandAdded: false,
    killRuntimeCommandAdded: false,
    exitRuntimeCommandAdded: false,
    signalHandlerCommandAdded: false,
    serveRuntimeCommandAdded: false,
    stdioRuntimeCommandAdded: false,
    fileWriterAdded: false,
    stdoutPrinterAdded: false,
    existingDryRunEmitterUnchanged: true
  });
  assert.deepEqual(inventory.apiSurface, {
    typescriptCoreStaticReviewHelpersAdded: true,
    typescriptCoreRuntimeApiAdded: false,
    rustRuntimeHelperAdded: false,
    rustStdioOwnerAdded: false,
    failureAuditRuntimeAdded: false,
    cleanupRuntimeAdded: false,
    processKillAdded: false,
    processControlAdded: false,
    signalHandlerAdded: false,
    exitHandlerAdded: false,
    timeoutRuntimeAdded: false,
    approvalEvaluatorAdded: false,
    secretsUsed: false
  });
  assert.deepEqual(
    inventory.fixtures.map(({ path, status }) => [path, status]),
    phase41EFixtureFiles.map((path) => [path, "present"])
  );
  assert.deepEqual(
    inventory.docs.map(({ path, status }) => [path, status]),
    [
      ["docs/phase-4-1e-failure-audit-kill-semantics.md", "present"],
      ["docs/phase-4-1d-transcript-replay-contracts.md", "present"],
      ["docs/phase-4-1-runtime-proposal.md", "present"],
      ["docs/phase-4-stdio-dry-run-event-emission.md", "present"],
      ["docs/session-events-stdio-contract.md", "present"],
      ["docs/host-policy-preconditions.md", "present"],
      ["docs/architecture.md", "present"],
      ["README.md", "present"],
      ["apps/cli/README.md", "present"],
      ["packages/core/README.md", "present"],
      ["crates/ardyn-host/README.md", "present"]
    ]
  );
  assert.deepEqual(
    inventory.tests.map(({ path, status }) => [path, status]),
    [
      ["tests/phase4-1e-failure-audit-kill-semantics.test.mjs", "present"],
      ["tests/report-phase-status.test.mjs", "present"],
      ["packages/core/src/index.mjs", "present"],
      ["packages/core/src/index.d.ts", "present"]
    ]
  );

  for (const probe of [
    "missing --dry-run",
    "unsafe manifest URL",
    "invalid JSON manifest",
    "invalid JSON task",
    "replay-session-transcript",
    "serve-runtime",
    "stdio-runtime",
    "failure-audit",
    "failure-audit-record",
    "emit-failure-audit",
    "failure-audit-runtime",
    "cleanup-runtime",
    "run-cleanup",
    "kill-runtime",
    "kill-process",
    "terminate-process",
    "process-kill",
    "exit-runtime",
    "exit-handler",
    "signal-handler",
    "handle-signal",
    "approval-evaluator",
    "evaluate-approval"
  ]) {
    assert.ok(inventory.invariantProbes.includes(probe), probe);
  }

  assert.deepEqual(inventory.safetyPosture, {
    nonExecuting: true,
    failureAuditContractOnly: true,
    reviewOnly: true,
    noLiveRuntime: true,
    noFailureAuditRuntime: true,
    noCleanupRuntime: true,
    noProcessKill: true,
    noProcessControl: true,
    noSignalHandler: true,
    noTimeoutRuntime: true,
    noLiveStdioRuntime: true,
    noStdinCommandLoop: true,
    noLiveStdioReader: true,
    noProcessStdioOwnership: true,
    noListener: true,
    noServer: true,
    noSubprocessSpawning: true,
    noAdapterCalls: true,
    noLocusRuntimeDependency: true,
    noMcpCalls: true,
    noOpenClawCalls: true,
    noPluginExecution: true,
    noContentFabricRuntimeBehavior: true,
    noContentFabricDownloadInstallEnable: true,
    noTranscriptPersistenceReplayRuntime: true,
    noReplayRuntime: true,
    noWebSocketHttpControlSurface: true,
    noSecrets: true,
    noProductionSigningKeys: true,
    noRuntimeApprovalGrant: true,
    noHostPolicyEnforcement: true,
    noApprovalEvaluator: true,
    noStdoutWriter: true,
    noStderrWriter: true,
    noCliCommandAdded: true,
    noFileWriterAdded: true,
    noStdoutPrinterAdded: true,
    noRuntimeBehaviorIntroduced: true
  });
  assert.equal(report.safetyPosture.failureAuditContracts, true);
  assert.equal(report.safetyPosture.flags.phase41RuntimeImplemented, false);
});

test("report inventories Phase 4.1F runtime readiness checkpoint without enabling runtime", async () => {
  const report = await runReport();
  const inventory = report.phase41FRuntimeReadinessCheckpointInventory;

  assert.equal(inventory.checkpoint.schema, "ardyn.runtime-readiness-checkpoint");
  assert.equal(inventory.checkpoint.schemaVersion, "0.1.0");
  assert.equal(inventory.checkpoint.artifactKind, "runtime-readiness-checkpoint");
  assert.equal(inventory.checkpoint.checkpointPhase, "phase-4.1f-runtime-readiness-checkpoint");
  assert.equal(inventory.checkpoint.reviewedPhase, "4.1F");
  assert.equal(inventory.checkpoint.metadataGeneratedAt, "1970-01-01T00:00:00.000Z");
  assert.equal(inventory.checkpoint.checkpointOnly, true);
  assert.equal(inventory.checkpoint.reviewMetadataOnly, true);
  assert.equal(inventory.checkpoint.runtimeBehaviorIntroduced, false);
  assert.equal(inventory.checkpoint.liveRuntimeBehaviorIntroduced, false);
  assert.equal(inventory.checkpoint.grantsRuntimeApproval, false);

  assert.deepEqual(inventory.verdict, {
    id: "phase-4.1f-runtime-readiness-checkpoint-verdict",
    verdict: "checkpoint-pass-runtime-still-blocked",
    codexValidationStatus: "pass",
    devinReviewStatus: "required-before-runtime-enable",
    runtimeImplementationApproved: false,
    runtimeEnablementApproved: false,
    grantsRuntimeApproval: false,
    runtimeBehaviorIntroduced: false,
    liveRuntimeBehaviorIntroduced: false,
    requiresSeparateRuntimeImplementationApproval: true,
    blockingReasonIds: []
  });
  assert.deepEqual(inventory.consolidatedInventoryKeys, phase41FInventoryKeys);
  assert.deepEqual(inventory.consolidatedPhases, phase41FConsolidatedPhases);
  assert.deepEqual(inventory.readinessMatrixIds, phase41FReadinessMatrixIds);
  assert.deepEqual(inventory.blockerIds, phase41FBlockerIds);
  assert.deepEqual(inventory.requiredVerificationCommands, [
    "npm test",
    "npm run test:schemas",
    "cargo test --workspace",
    "cargo check --workspace",
    "cargo fmt --check",
    "git diff --check",
    "npm run report:phase-status"
  ]);
  assert.deepEqual(inventory.fixtureCounts, {
    "phase4-1": 1,
    "phase4-1a": 7,
    "phase4-1b": 8,
    "phase4-1c": 11,
    "phase4-1d": 11,
    "phase4-1e": 14,
    "phase4-1f": 1
  });
  assert.equal(inventory.approvalBoundary.grantsRuntimeApproval, false);
  assert.equal(inventory.approvalBoundary.runtimeBehaviorIntroduced, false);
  assert.ok(inventory.approvalBoundary.cannotApprove.includes("runtime implementation"));
  assert.ok(
    inventory.approvalBoundary.requiredBeforeRuntimeImplementation.includes(
      "explicit separately approved runtime implementation phase"
    )
  );

  for (const row of inventory.readinessMatrix) {
    assert.equal(row.grantsRuntimeApproval, false, row.id);
    assert.equal(row.runtimeBehaviorIntroduced, false, row.id);
    assert.equal(row.checkpointRequiredBeforeRuntime, true, row.id);
  }
  assert.equal(inventory.readinessMatrix.at(-2).status, "blocked-before-runtime");
  assert.equal(inventory.readinessMatrix.at(-1).status, "blocked-before-runtime");

  for (const blocker of inventory.blockersBeforeRuntime) {
    assert.equal(blocker.status, "blocking-live-runtime", blocker.id);
    assert.equal(blocker.severity, "blocker", blocker.id);
    assert.equal(blocker.runtimeUnblockRequiresSeparateApproval, true, blocker.id);
    assert.equal(blocker.grantsRuntimeApproval, false, blocker.id);
    assert.equal(blocker.runtimeBehaviorIntroduced, false, blocker.id);
  }

  assertAllFalse(inventory.runtimeEffect);
  assert.deepEqual(inventory.reviewOnlyDisplayBehavior, {
    checkpointRecordsAreStaticArtifactsOnly: true,
    checkpointCannotGrantRuntimeApproval: true,
    currentCheckpointDoesNotEnableRuntime: true,
    futureRuntimeRequiresSeparateApprovedImplementationPhase: true,
    preserveDevinReviewForMajorRuntimeReadinessCheckpoint: true,
    reportRunsChecks: false,
    writesFiles: false,
    readsFiles: false,
    printsStdoutFromCli: false,
    consumedByLiveHostLoop: false
  });
  assert.deepEqual(inventory.cliCommandSurface, {
    commandAdded: false,
    readinessCheckpointCommandAdded: false,
    runtimeReadinessCommandAdded: false,
    serveRuntimeCommandAdded: false,
    stdioRuntimeCommandAdded: false,
    replaySessionTranscriptCommandAdded: false,
    approvalEvaluatorCommandAdded: false,
    fileWriterAdded: false,
    stdoutPrinterAdded: false,
    existingDryRunEmitterUnchanged: true
  });
  assert.deepEqual(inventory.apiSurface, {
    typescriptCoreRuntimeApiAdded: false,
    typescriptCoreCheckpointHelperAdded: false,
    rustRuntimeHelperAdded: false,
    rustStdioOwnerAdded: false,
    approvalEvaluatorAdded: false,
    failureAuditRuntimeAdded: false,
    cleanupRuntimeAdded: false,
    processKillAdded: false,
    processControlAdded: false,
    transcriptPersistenceReplayRuntimeAdded: false,
    secretsUsed: false
  });
  assert.deepEqual(
    inventory.fixtures.map(({ path, status }) => [path, status]),
    phase41FFixtureFiles.map((path) => [path, "present"])
  );
  assert.deepEqual(
    inventory.docs.map(({ path, status }) => [path, status]),
    [
      ["docs/phase-4-1f-runtime-readiness-checkpoint.md", "present"],
      ["docs/phase-4-1e-failure-audit-kill-semantics.md", "present"],
      ["docs/phase-4-1-runtime-proposal.md", "present"],
      ["docs/phase-4-stdio-dry-run-event-emission.md", "present"],
      ["docs/session-events-stdio-contract.md", "present"],
      ["docs/host-policy-preconditions.md", "present"],
      ["docs/architecture.md", "present"],
      ["README.md", "present"],
      ["apps/cli/README.md", "present"],
      ["packages/core/README.md", "present"],
      ["crates/ardyn-host/README.md", "present"]
    ]
  );
  assert.deepEqual(
    inventory.tests.map(({ path, status }) => [path, status]),
    [
      ["tests/phase4-1f-runtime-readiness-checkpoint.test.mjs", "present"],
      ["tests/report-phase-status.test.mjs", "present"],
      ["tests/phase4-1e-failure-audit-kill-semantics.test.mjs", "present"]
    ]
  );

  for (const probe of [
    "missing --dry-run",
    "unsafe manifest URL",
    "invalid JSON manifest",
    "invalid JSON task",
    "serve-runtime",
    "stdio-runtime",
    "runtime-readiness",
    "runtime-readiness-checkpoint",
    "readiness-checkpoint",
    "checkpoint-runtime",
    "runtime-checkpoint",
    "devin-runtime-review",
    "approve-runtime",
    "grant-runtime",
    "enable-runtime",
    "replay-session-transcript",
    "persist-session-transcript",
    "failure-audit",
    "emit-failure-audit",
    "cleanup-runtime",
    "kill-runtime",
    "approval-evaluator",
    "evaluate-approval"
  ]) {
    assert.ok(inventory.invariantProbes.includes(probe), probe);
  }

  assert.deepEqual(inventory.safetyPosture, {
    nonExecuting: true,
    runtimeReadinessCheckpointOnly: true,
    reviewOnly: true,
    noLiveRuntime: true,
    noRuntimeCommand: true,
    noServeRuntime: true,
    noStdioRuntime: true,
    noReplaySessionTranscript: true,
    noLiveStdioRuntime: true,
    noStdinCommandLoop: true,
    noLiveStdioReader: true,
    noProcessStdioOwnership: true,
    noListener: true,
    noServer: true,
    noSubprocessSpawning: true,
    noAdapterCalls: true,
    noLocusRuntimeDependency: true,
    noMcpCalls: true,
    noOpenClawCalls: true,
    noPluginExecution: true,
    noContentFabricRuntimeBehavior: true,
    noContentFabricDownloadInstallEnable: true,
    noTranscriptPersistenceReplayRuntime: true,
    noFailureAuditRuntime: true,
    noCleanupRuntime: true,
    noProcessKill: true,
    noApprovalEvaluator: true,
    noWebSocketHttpControlSurface: true,
    noSecrets: true,
    noProductionSigningKeys: true,
    noRuntimeApprovalGrant: true,
    noCliCommandAdded: true,
    noFileWriterAdded: true,
    noStdoutPrinterAdded: true,
    noRuntimeBehaviorIntroduced: true
  });
  assert.equal(report.safetyPosture.runtimeReadinessCheckpoint, true);
  assert.equal(report.safetyPosture.flags.phase41RuntimeImplemented, false);
});

test("report inventories Phase 4.1G external review packet without enabling runtime", async () => {
  const report = await runReport();
  const inventory = report.phase41GExternalReviewPacketInventory;

  assert.equal(inventory.packet.schema, "ardyn.external-runtime-readiness-review-packet");
  assert.equal(inventory.packet.schemaVersion, "0.1.0");
  assert.equal(inventory.packet.artifactKind, "external-runtime-readiness-review-packet");
  assert.equal(inventory.packet.packetPhase, "phase-4.1g-external-review-packet");
  assert.equal(inventory.packet.reviewedPhase, "4.1G");
  assert.equal(inventory.packet.metadataGeneratedAt, "1970-01-01T00:00:00.000Z");
  assert.equal(inventory.packet.currentMainSha, "3a2f28e02494cb2ac0735e6bec32f283f4b616db");
  assert.equal(inventory.packet.reviewPacketOnly, true);
  assert.equal(inventory.packet.reviewMetadataOnly, true);
  assert.equal(inventory.packet.runtimeBehaviorIntroduced, false);
  assert.equal(inventory.packet.liveRuntimeBehaviorIntroduced, false);
  assert.equal(inventory.packet.grantsRuntimeApproval, false);

  assert.deepEqual(inventory.verdict, {
    id: "phase-4.1g-external-review-packet-verdict",
    verdict: "packet-ready-runtime-still-blocked",
    codexPacketStatus: "ready-for-external-review",
    devinReviewTarget: true,
    runtimeImplementationApproved: false,
    runtimeEnablementApproved: false,
    grantsRuntimeApproval: false,
    runtimeBehaviorIntroduced: false,
    liveRuntimeBehaviorIntroduced: false,
    requiresSeparateRuntimeImplementationApproval: true,
    requiresReviewerDecisionBeforeRuntime: true
  });
  assert.deepEqual(inventory.reviewedPhaseRange, {
    fromPhase: "4.0A",
    throughPhase: "4.1F",
    externalReviewTarget: "Devin or human runtime-readiness reviewer",
    addsRuntimeImplementation: false
  });
  assert.deepEqual(inventory.phaseSummaryPhases, phase41GPhaseSummaryPhases);
  assert.deepEqual(inventory.evidenceMapIds, phase41GEvidenceMapIds);
  assert.deepEqual(inventory.nonRuntimeInvariantIds, phase41GInvariantIds);
  assert.deepEqual(inventory.blockedRuntimeSurfaceIds, phase41GBlockedSurfaceIds);
  assert.deepEqual(inventory.reviewerQuestionCategories, phase41GReviewerQuestionCategories);
  assert.deepEqual(inventory.reviewerOutcomeCategories, phase41GReviewerOutcomeCategories);
  assert.deepEqual(inventory.recommendedOutcomeIds, [
    "approve-packet-only",
    "deny-runtime",
    "check-again"
  ]);

  for (const phase of inventory.phaseSummaries) {
    assert.equal(phase.runtimeImplemented, false, phase.phase);
    assert.equal(phase.grantsRuntimeApproval, false, phase.phase);
  }
  for (const invariant of inventory.nonRuntimeInvariantMatrix) {
    assert.equal(invariant.status, "preserved", invariant.id);
    assert.equal(invariant.runtimeBehaviorIntroduced, false, invariant.id);
    assert.equal(invariant.grantsRuntimeApproval, false, invariant.id);
  }
  for (const blockedSurface of inventory.blockedRuntimeSurfaces) {
    assert.equal(blockedSurface.status, "blocked", blockedSurface.id);
    assert.equal(blockedSurface.grantsRuntimeApproval, false, blockedSurface.id);
    assert.equal(blockedSurface.runtimeBehaviorIntroduced, false, blockedSurface.id);
  }
  for (const outcome of inventory.recommendedOutcomes) {
    assert.equal(outcome.grantsRuntimeApproval, false, outcome.outcome);
    assert.equal(outcome.runtimeImplementationApproved, false, outcome.outcome);
    assert.equal(outcome.runtimeEnablementApproved, false, outcome.outcome);
    assert.equal(outcome.runtimeBehaviorIntroduced, false, outcome.outcome);
    assert.equal(outcome.runtimeUnblockRequiresSeparateApproval, true, outcome.outcome);
  }

  assertAllFalse(inventory.runtimeEffect);
  assert.deepEqual(inventory.reviewOnlyDisplayBehavior, {
    externalReviewPacketIsStaticArtifactOnly: true,
    packetCannotGrantRuntimeApproval: true,
    packetDoesNotEnableRuntime: true,
    futureRuntimeRequiresSeparateApprovedImplementationPhase: true,
    reportRunsChecks: false,
    writesFiles: false,
    readsFiles: false,
    printsStdoutFromCli: false,
    consumedByLiveHostLoop: false
  });
  assert.deepEqual(inventory.cliCommandSurface, {
    commandAdded: false,
    externalReviewPacketCommandAdded: false,
    reviewPacketCommandAdded: false,
    runtimeReviewPacketCommandAdded: false,
    runtimeReadinessReviewCommandAdded: false,
    serveRuntimeCommandAdded: false,
    stdioRuntimeCommandAdded: false,
    replaySessionTranscriptCommandAdded: false,
    approvalEvaluatorCommandAdded: false,
    policyMetadataCommandAdded: false,
    hostPolicyExportCommandAdded: false,
    fileWriterAdded: false,
    stdoutPrinterAdded: false,
    existingDryRunEmitterUnchanged: true
  });
  assert.deepEqual(inventory.apiSurface, {
    typescriptCoreRuntimeApiAdded: false,
    typescriptCoreReviewPacketHelperAdded: false,
    rustRuntimeHelperAdded: false,
    rustStdioOwnerAdded: false,
    approvalEvaluatorAdded: false,
    hostPolicyEnforcementAdded: false,
    failureAuditRuntimeAdded: false,
    cleanupRuntimeAdded: false,
    processKillAdded: false,
    processControlAdded: false,
    transcriptPersistenceReplayRuntimeAdded: false,
    secretsUsed: false
  });
  assert.deepEqual(
    inventory.fixtures.map(({ path, status }) => [path, status]),
    phase41GFixtureFiles.map((path) => [path, "present"])
  );
  assert.deepEqual(
    inventory.docs.map(({ path, status }) => [path, status]),
    [
      ["docs/phase-4-1g-external-review-packet.md", "present"],
      ["docs/phase-4-1f-runtime-readiness-checkpoint.md", "present"],
      ["docs/phase-4-1-runtime-proposal.md", "present"],
      ["docs/phase-4-stdio-dry-run-event-emission.md", "present"],
      ["docs/session-events-stdio-contract.md", "present"],
      ["docs/host-policy-preconditions.md", "present"],
      ["docs/architecture.md", "present"],
      ["README.md", "present"],
      ["apps/cli/README.md", "present"],
      ["packages/core/README.md", "present"],
      ["crates/ardyn-host/README.md", "present"]
    ]
  );
  assert.deepEqual(
    inventory.tests.map(({ path, status }) => [path, status]),
    [
      ["tests/phase4-1g-external-review-packet.test.mjs", "present"],
      ["tests/report-phase-status.test.mjs", "present"],
      ["tests/phase4-1f-runtime-readiness-checkpoint.test.mjs", "present"]
    ]
  );

  for (const probe of [
    "missing --dry-run",
    "unsafe manifest URL",
    "invalid JSON manifest",
    "invalid JSON task",
    "serve-runtime",
    "stdio-runtime",
    "runtime-readiness-review",
    "external-review-packet",
    "review-packet",
    "runtime-review-packet",
    "phase-4-1g-review",
    "approve-runtime",
    "grant-runtime",
    "host-policy-approval",
    "operator-consent",
    "approval-evaluator",
    "replay-session-transcript",
    "transcript-replay",
    "transport-harness",
    "stdout-writer",
    "stderr-writer",
    "failure-audit-record",
    "cleanup-runtime",
    "kill-runtime",
    "policy-metadata",
    "host-policy-export"
  ]) {
    assert.ok(inventory.invariantProbes.includes(probe), probe);
  }

  assert.deepEqual(inventory.safetyPosture, {
    nonExecuting: true,
    externalReviewPacketOnly: true,
    reviewOnly: true,
    noLiveRuntime: true,
    noRuntimeCommand: true,
    noReviewPacketCommand: true,
    noServeRuntime: true,
    noStdioRuntime: true,
    noReplaySessionTranscript: true,
    noLiveStdioRuntime: true,
    noStdinCommandLoop: true,
    noLiveStdioReader: true,
    noStdoutWriter: true,
    noStderrWriter: true,
    noProcessStdioOwnership: true,
    noListener: true,
    noServer: true,
    noSubprocessSpawning: true,
    noAdapterCalls: true,
    noLocusRuntimeDependency: true,
    noMcpCalls: true,
    noOpenClawCalls: true,
    noPluginExecution: true,
    noContentFabricRuntimeBehavior: true,
    noContentFabricDownloadInstallEnable: true,
    noTranscriptPersistenceReplayRuntime: true,
    noFailureAuditRuntime: true,
    noCleanupRuntime: true,
    noProcessKill: true,
    noApprovalEvaluator: true,
    noHostPolicyEnforcement: true,
    noWebSocketHttpControlSurface: true,
    noSecrets: true,
    noProductionSigningKeys: true,
    noRuntimeApprovalGrant: true,
    noCliCommandAdded: true,
    noFileWriterAdded: true,
    noStdoutPrinterAdded: true,
    noRuntimeBehaviorIntroduced: true
  });
  assert.equal(report.safetyPosture.runtimeReadinessCheckpoint, true);
  assert.equal(report.safetyPosture.externalReviewPacket, true);
  assert.equal(report.safetyPosture.flags.phase41RuntimeImplemented, false);
});

test("report inventories Phase 4.1H external review disposition without enabling runtime", async () => {
  const report = await runReport();
  const inventory = report.phase41HExternalReviewDispositionInventory;

  assert.equal(inventory.disposition.schema, "ardyn.external-review-disposition-record");
  assert.equal(inventory.disposition.schemaVersion, "0.1.0");
  assert.equal(inventory.disposition.artifactKind, "external-review-disposition-record");
  assert.equal(inventory.disposition.dispositionPhase, "phase-4.1h-external-review-disposition");
  assert.equal(inventory.disposition.reviewedPhase, "4.1H");
  assert.equal(inventory.disposition.metadataGeneratedAt, "1970-01-01T00:00:00.000Z");
  assert.equal(
    inventory.disposition.currentMainSha,
    "74b9872a7e44972fcc6d9bf33eb5a93829554cd0"
  );
  assert.equal(inventory.disposition.reviewMetadataOnly, true);
  assert.equal(inventory.disposition.notFreshDevinReReview, true);
  assert.equal(inventory.disposition.runtimeBehaviorIntroduced, false);
  assert.equal(inventory.disposition.liveRuntimeBehaviorIntroduced, false);
  assert.equal(inventory.disposition.grantsRuntimeApproval, false);

  assert.deepEqual(inventory.sourceReview, {
    reviewer: "Devin",
    reviewedPacketPhase: "4.1G",
    reviewedPacketCurrentMainSha: "3a2f28e02494cb2ac0735e6bec32f283f4b616db",
    priorDisposition: "request_targeted_fixes_before_approval",
    architectureRuntimeBlockerFound: false,
    targetedBlocker: "stale_phase_4.1g_currentMainSha",
    freshDevinReReview: false,
    freshReReviewUnavailableReason: "devin_credits_unavailable"
  });
  assert.equal(inventory.targetedFix.blockerFixed, true);
  assert.equal(
    inventory.targetedFix.staleMainSha,
    "070b327b6132e14170598d3e865dcf5ec4b0993e"
  );
  assert.equal(
    inventory.targetedFix.correctedReviewedSha,
    "3a2f28e02494cb2ac0735e6bec32f283f4b616db"
  );
  assert.equal(
    inventory.targetedFix.fixCommitSha,
    "74b9872a7e44972fcc6d9bf33eb5a93829554cd0"
  );
  assert.equal(inventory.targetedFix.staleShaRemainingPhase41GPacketMatches, 0);
  assert.equal(inventory.targetedFix.appsCliSourceTouched, false);
  assert.deepEqual(inventory.targetedFix.filesChangedByFix, [
    "docs/phase-4-1g-external-review-packet.md",
    "tests/fixtures/host-policy/phase4-1g/external-review-packet.json",
    "tests/phase4-1g-external-review-packet.test.mjs",
    "tests/report-phase-status.test.mjs"
  ]);
  assert.equal(inventory.validationSummary.recordedFromTargetedFix, true);
  assert.deepEqual(
    inventory.validationSummary.commands.map(({ command, result }) => [command, result]),
    [
      ["npm test", "passed"],
      ["npm run test:schemas", "passed"],
      ["cargo test --workspace", "passed"],
      ["cargo check --workspace", "passed"],
      ["cargo fmt --check", "passed"],
      ["git diff --check", "passed"],
      ["npm run report:phase-status", "passed"]
    ]
  );
  assert.deepEqual(inventory.smokeProbeSummary.rejectionProbes, phase41HRejectedProbes);
  assert.equal(inventory.smokeProbeSummary.allRejected, true);
  assert.equal(inventory.smokeProbeSummary.allZeroStdout, true);
  assert.equal(inventory.smokeProbeSummary.emitSessionEventsDryRun.eventLines, 6);
  assert.equal(inventory.reviewOnlyBoundary.externalReviewDispositionRecordOnly, true);
  assert.equal(inventory.reviewOnlyBoundary.notFreshDevinReReview, true);
  assert.equal(
    inventory.reviewOnlyBoundary.readyToPlanFirstRustHostStdioRuntimeTestHarnessOnly,
    true
  );
  assert.equal(inventory.reviewOnlyBoundary.grantsRuntimeApproval, false);
  assert.equal(inventory.nextAllowedStep.id, "plan-first-rust-host-stdio-runtime-test-harness-only");
  assert.equal(inventory.nextAllowedStep.planningOnly, true);
  assert.equal(inventory.nextAllowedStep.implementationAllowedInThisPhase, false);
  assert.deepEqual(inventory.blockedRuntimeSurfaceIds, phase41HBlockedSurfaceIds);
  assertAllFalse(inventory.runtimeEffect);

  assert.deepEqual(inventory.reviewOnlyDisplayBehavior, {
    externalReviewDispositionIsStaticArtifactOnly: true,
    dispositionCannotGrantRuntimeApproval: true,
    dispositionDoesNotEnableRuntime: true,
    notFreshDevinReReview: true,
    futureRuntimeRequiresSeparateApprovedImplementationPhase: true,
    nextStepIsPlanningOnly: true,
    reportRunsChecks: false,
    writesFiles: false,
    readsFiles: false,
    printsStdoutFromCli: false,
    consumedByLiveHostLoop: false
  });
  assert.deepEqual(inventory.cliCommandSurface, {
    commandAdded: false,
    externalReviewDispositionCommandAdded: false,
    reviewDispositionCommandAdded: false,
    externalReviewPacketCommandAdded: false,
    reviewPacketCommandAdded: false,
    runtimeReadinessReviewCommandAdded: false,
    serveRuntimeCommandAdded: false,
    stdioRuntimeCommandAdded: false,
    replaySessionTranscriptCommandAdded: false,
    approvalEvaluatorCommandAdded: false,
    policyMetadataCommandAdded: false,
    hostPolicyExportCommandAdded: false,
    fileWriterAdded: false,
    stdoutPrinterAdded: false,
    existingDryRunEmitterUnchanged: true
  });
  assert.deepEqual(inventory.apiSurface, {
    typescriptCoreRuntimeApiAdded: false,
    typescriptCoreReviewDispositionHelperAdded: false,
    typescriptCoreReviewPacketHelperAdded: false,
    rustRuntimeHelperAdded: false,
    rustStdioOwnerAdded: false,
    approvalEvaluatorAdded: false,
    hostPolicyEnforcementAdded: false,
    failureAuditRuntimeAdded: false,
    cleanupRuntimeAdded: false,
    processKillAdded: false,
    processControlAdded: false,
    transcriptPersistenceReplayRuntimeAdded: false,
    secretsUsed: false
  });

  assert.deepEqual(
    inventory.fixtures.map((entry) => entry.path),
    phase41HFixtureFiles
  );
  assert.deepEqual(
    inventory.docs.map(({ path, status }) => [path, status]),
    [
      ["docs/phase-4-1h-external-review-disposition.md", "present"],
      ["docs/phase-4-1g-external-review-packet.md", "present"],
      ["docs/phase-4-1f-runtime-readiness-checkpoint.md", "present"],
      ["docs/phase-4-1-runtime-proposal.md", "present"],
      ["docs/phase-4-stdio-dry-run-event-emission.md", "present"],
      ["docs/session-events-stdio-contract.md", "present"],
      ["docs/host-policy-preconditions.md", "present"],
      ["docs/architecture.md", "present"],
      ["README.md", "present"],
      ["apps/cli/README.md", "present"],
      ["packages/core/README.md", "present"],
      ["crates/ardyn-host/README.md", "present"]
    ]
  );
  assert.deepEqual(
    inventory.tests.map(({ path, status }) => [path, status]),
    [
      ["tests/phase4-1h-external-review-disposition.test.mjs", "present"],
      ["tests/phase4-1g-external-review-packet.test.mjs", "present"],
      ["tests/report-phase-status.test.mjs", "present"]
    ]
  );

  for (const probe of [
    ...phase41HRejectedProbes,
    "approve-runtime",
    "grant-runtime",
    "enable-runtime",
    "approval-evaluator",
    "transport-harness",
    "stdin-reader",
    "stdout-writer",
    "stderr-writer",
    "failure-audit",
    "cleanup-runtime",
    "kill-runtime"
  ]) {
    assert.ok(inventory.invariantProbes.includes(probe), probe);
  }

  assert.deepEqual(inventory.safetyPosture, {
    nonExecuting: true,
    externalReviewDispositionOnly: true,
    reviewOnly: true,
    noFreshDevinReReview: true,
    targetedBlockerFixed: true,
    noLiveRuntime: true,
    noRuntimeCommand: true,
    noReviewDispositionCommand: true,
    noReviewPacketCommand: true,
    noServeRuntime: true,
    noStdioRuntime: true,
    noReplaySessionTranscript: true,
    noLiveStdioRuntime: true,
    noStdinCommandLoop: true,
    noLiveStdioReader: true,
    noStdoutWriter: true,
    noStderrWriter: true,
    noProcessStdioOwnership: true,
    noListener: true,
    noServer: true,
    noSubprocessSpawning: true,
    noAdapterCalls: true,
    noLocusRuntimeDependency: true,
    noMcpCalls: true,
    noOpenClawCalls: true,
    noPluginExecution: true,
    noContentFabricRuntimeBehavior: true,
    noContentFabricDownloadInstallEnable: true,
    noTranscriptPersistenceReplayRuntime: true,
    noFailureAuditRuntime: true,
    noCleanupRuntime: true,
    noProcessKill: true,
    noApprovalEvaluator: true,
    noHostPolicyEnforcement: true,
    noWebSocketHttpControlSurface: true,
    noSecrets: true,
    noProductionSigningKeys: true,
    noRuntimeApprovalGrant: true,
    noCliCommandAdded: true,
    noFileWriterAdded: true,
    noStdoutPrinterAdded: true,
    noRuntimeBehaviorIntroduced: true
  });
  assert.equal(report.safetyPosture.externalReviewPacket, true);
  assert.equal(report.safetyPosture.externalReviewDisposition, true);
  assert.equal(report.safetyPosture.flags.phase41RuntimeImplemented, false);
});

test("report inventories Phase 4.1I Rust-host stdio harness test infrastructure without enabling runtime", async () => {
  const report = await runReport();
  const inventory = report.phase41IRustHostStdioHarnessInventory;

  assert.deepEqual(inventory.harnessLayer, {
    document: "docs/phase-4-1i-rust-host-stdio-harness.md",
    precedingPhase: "4.1H",
    layerId: "first-rust-host-stdio-test-harness-layer",
    scope: "test-infrastructure-only",
    privateRustCfgTestHarness: true,
    inMemoryOnly: true,
    productionRuntimeSourceChanged: false,
    noFreshDevinReview: true,
    runtimeBlocked: true,
    runtimeBehaviorIntroduced: false,
    liveRuntimeBehaviorIntroduced: false,
    grantsRuntimeApproval: false
  });
  assert.equal(inventory.carriedForwardReview.noFreshDevinReview, true);
  assert.equal(inventory.carriedForwardReview.runtimeStillBlocked, true);
  assert.equal(
    inventory.carriedForwardReview.phase41HDispositionDocument,
    "docs/phase-4-1h-external-review-disposition.md"
  );
  assert.equal(
    inventory.carriedForwardReview.sourceReview.freshReReviewUnavailableReason,
    "devin_credits_unavailable"
  );
  assert.equal(inventory.carriedForwardReview.targetedFix.blockerFixed, true);

  assert.deepEqual(
    inventory.ownershipBoundary.ownedByThisPhase,
    phase41IOwnedFiles
  );
  assert.deepEqual(
    inventory.ownershipBoundary.excludedCliRuntimeSourceFiles,
    phase41IExcludedCliRuntimeSourceFiles
  );
  assert.equal(inventory.ownershipBoundary.rustTestHarnessSourceChangedByThisPhase, true);
  assert.equal(inventory.ownershipBoundary.productionRuntimeSourceChangedByThisPhase, false);
  assert.equal(inventory.ownershipBoundary.cliSourceChangedByThisPhase, false);
  assert.equal(
    inventory.ownershipBoundary.separateRuntimeImplementationApprovalRequired,
    true
  );
  assert.deepEqual(
    inventory.implementedHarnessEvidence.map(({ id }) => id),
    phase41IImplementedHarnessEvidenceIds
  );

  assert.deepEqual(inventory.reviewOnlyDisplayBehavior, {
    rustHostStdioHarnessIsPrivateTestInfrastructureOnly: true,
    testInfrastructureOnly: true,
    noFreshDevinReview: true,
    futureRuntimeRequiresSeparateApprovedImplementationPhase: true,
    reportRunsChecks: false,
    writesFiles: false,
    printsStdoutFromCli: false,
    consumedByLiveHostLoop: false
  });
  assert.deepEqual(inventory.cliCommandSurface, {
    commandAdded: false,
    rustHostStdioHarnessCommandAdded: false,
    stdioHarnessCommandAdded: false,
    runtimeHarnessCommandAdded: false,
    externalReviewDispositionCommandAdded: false,
    reviewDispositionCommandAdded: false,
    externalReviewPacketCommandAdded: false,
    reviewPacketCommandAdded: false,
    runtimeReadinessReviewCommandAdded: false,
    serveRuntimeCommandAdded: false,
    stdioRuntimeCommandAdded: false,
    replaySessionTranscriptCommandAdded: false,
    approvalEvaluatorCommandAdded: false,
    policyMetadataCommandAdded: false,
    hostPolicyExportCommandAdded: false,
    fileWriterAdded: false,
    stdoutPrinterAdded: false,
    existingDryRunEmitterUnchanged: true
  });
  assert.deepEqual(inventory.apiSurface, {
    typescriptCoreRuntimeApiAdded: false,
    typescriptCoreHarnessHelperAdded: false,
    rustRuntimeHelperAdded: false,
    rustStdioOwnerAdded: false,
    rustHarnessRuntimeAdded: false,
    approvalEvaluatorAdded: false,
    hostPolicyEnforcementAdded: false,
    failureAuditRuntimeAdded: false,
    cleanupRuntimeAdded: false,
    processKillAdded: false,
    processControlAdded: false,
    transcriptPersistenceReplayRuntimeAdded: false,
    secretsUsed: false
  });
  assert.deepEqual(inventory.fixtures, []);
  assert.deepEqual(inventory.rustTestSource.map(({ path, status }) => [path, status]), [
    ["crates/ardyn-host/src/lib.rs", "present"]
  ]);
  assert.deepEqual(
    inventory.docs.map(({ path, status }) => [path, status]),
    phase41IDocFiles.map((path) => [path, "present"])
  );
  assert.deepEqual(inventory.tests.map(({ path, status }) => [path, status]), [
    ["tests/report-phase-status.test.mjs", "present"],
    ["tests/phase4-1i-rust-host-stdio-harness.test.mjs", "present"]
  ]);

  for (const probe of [
    ...phase41HRejectedProbes,
    "rust-host-stdio-harness",
    "stdio-harness",
    "runtime-harness",
    "approve-runtime",
    "grant-runtime",
    "enable-runtime",
    "approval-evaluator",
    "transport-harness",
    "stdin-reader",
    "stdout-writer",
    "stderr-writer",
    "failure-audit",
    "cleanup-runtime",
    "kill-runtime"
  ]) {
    assert.ok(inventory.invariantProbes.includes(probe), probe);
  }

  assertAllFalse(inventory.runtimeEffect);
  assert.deepEqual(inventory.safetyPosture, {
    nonExecuting: true,
    rustHostStdioHarnessLayerOnly: true,
    privateRustTestHarnessOnly: true,
    testInfrastructureOnly: true,
    productionRuntimeUnchanged: true,
    noFreshDevinReview: true,
    runtimeBlocked: true,
    noLiveRuntime: true,
    noRuntimeCommand: true,
    noHarnessCommand: true,
    noReviewDispositionCommand: true,
    noReviewPacketCommand: true,
    noServeRuntime: true,
    noStdioRuntime: true,
    noReplaySessionTranscript: true,
    noLiveStdioRuntime: true,
    noStdinCommandLoop: true,
    noLiveStdioReader: true,
    noStdoutWriter: true,
    noStderrWriter: true,
    noProcessStdioOwnership: true,
    noListener: true,
    noServer: true,
    noSubprocessSpawning: true,
    noAdapterCalls: true,
    noLocusRuntimeDependency: true,
    noMcpCalls: true,
    noOpenClawCalls: true,
    noPluginExecution: true,
    noContentFabricRuntimeBehavior: true,
    noContentFabricDownloadInstallEnable: true,
    noTranscriptPersistenceReplayRuntime: true,
    noFailureAuditRuntime: true,
    noCleanupRuntime: true,
    noProcessKill: true,
    noApprovalEvaluator: true,
    noHostPolicyEnforcement: true,
    noWebSocketHttpControlSurface: true,
    noSecrets: true,
    noProductionSigningKeys: true,
    noRuntimeApprovalGrant: true,
    noCliCommandAdded: true,
    noFileWriterAdded: true,
    noStdoutPrinterAdded: true,
    noRuntimeBehaviorIntroduced: true
  });
  assert.equal(report.safetyPosture.rustHostStdioHarness, true);
  assert.equal(report.safetyPosture.flags.phase41IRuntimeImplemented, false);
  assert.equal(report.safetyPosture.flags.freshDevinReviewRan, false);
});

test("report inventories Phase 4.1J fixture-backed Rust stdio boundary coverage while runtime stays blocked", async () => {
  const report = await runReport();
  const inventory = report.phase41JFixtureBackedStdioBoundaryInventory;

  assert.deepEqual(inventory.boundaryLayer, {
    document: "docs/phase-4-1j-fixture-backed-stdio-boundaries.md",
    precedingPhase: "4.1I",
    layerId: "fixture-backed-rust-host-stdio-boundary-test-infrastructure",
    scope: "private-rust-fixture-backed-test-infrastructure",
    fixtureBackedRustHostCoverage: true,
    privateRustCfgTestHarness: true,
    inMemoryOnly: true,
    concreteFixtureSuiteAdded: true,
    privateHarnessNotPublicRuntimeContract: true,
    publicRuntimeContractIntroduced: false,
    runtimeReadinessClaimed: false,
    productionRuntimeSourceChanged: false,
    noFreshExternalReview: true,
    noFreshDevinReview: true,
    runtimeBlocked: true,
    runtimeBehaviorIntroduced: false,
    liveRuntimeBehaviorIntroduced: false,
    grantsRuntimeApproval: false
  });

  assert.deepEqual(inventory.carriedForwardHarnessEvidence, {
    phase41IHarnessDocument: "docs/phase-4-1i-rust-host-stdio-harness.md",
    phase41HDispositionDocument: "docs/phase-4-1h-external-review-disposition.md",
    privateRustCfgTestHarness: true,
    inMemoryOnly: true,
    extendedByPhase41JFixtures: true,
    notPublicRuntimeContract: true,
    noFreshExternalReview: true,
    noFreshDevinReview: true,
    runtimeStillBlocked: true,
    implementedHarnessEvidenceIds: phase41IImplementedHarnessEvidenceIds
  });

  assert.deepEqual(
    inventory.ownershipBoundary.ownedByThisPhase,
    phase41JOwnedFiles
  );
  assert.deepEqual(
    inventory.ownershipBoundary.excludedCliRuntimeSourceFiles,
    phase41IExcludedCliRuntimeSourceFiles
  );
  assert.equal(inventory.ownershipBoundary.rustTestHarnessSourceChangedByThisPhase, true);
  assert.equal(inventory.ownershipBoundary.productionRuntimeSourceChangedByThisPhase, false);
  assert.equal(inventory.ownershipBoundary.cliSourceChangedByThisPhase, false);
  assert.equal(inventory.ownershipBoundary.fixtureBackedTestInfrastructureOnly, true);
  assert.equal(
    inventory.ownershipBoundary.separateRuntimeImplementationApprovalRequired,
    true
  );

  assert.deepEqual(
    inventory.fixtureBackedBoundaryEvidence.map(({ id }) => id),
    phase41JFixtureBackedBoundaryEvidenceIds
  );
  assert.deepEqual(inventory.harnessBoundary, {
    privateRustFixtureBackedTestInfrastructureOnly: true,
    notRuntimeReadiness: true,
    noFreshExternalReview: true,
    noFreshDevinReview: true,
    privateHarnessNotPublicRuntimeContract: true,
    noPublicRuntimeContract: true,
    futureRuntimeRequiresSeparateApprovedImplementationPhase: true,
    reportRunsChecks: false,
    writesFiles: false,
    printsStdoutFromCli: false,
    consumedByLiveHostLoop: false
  });
  assert.deepEqual(inventory.cliCommandSurface, {
    commandAdded: false,
    fixtureBackedStdioBoundaryCommandAdded: false,
    rustHostStdioBoundaryCommandAdded: false,
    rustHostStdioHarnessCommandAdded: false,
    stdioHarnessCommandAdded: false,
    runtimeHarnessCommandAdded: false,
    externalReviewDispositionCommandAdded: false,
    reviewDispositionCommandAdded: false,
    externalReviewPacketCommandAdded: false,
    reviewPacketCommandAdded: false,
    runtimeReadinessCommandAdded: false,
    runtimeReadinessReviewCommandAdded: false,
    serveRuntimeCommandAdded: false,
    stdioRuntimeCommandAdded: false,
    replaySessionTranscriptCommandAdded: false,
    approvalEvaluatorCommandAdded: false,
    policyMetadataCommandAdded: false,
    hostPolicyExportCommandAdded: false,
    fileWriterAdded: false,
    stdoutPrinterAdded: false,
    existingDryRunEmitterUnchanged: true
  });
  assert.deepEqual(inventory.apiSurface, {
    typescriptCoreRuntimeApiAdded: false,
    typescriptCoreBoundaryHelperAdded: false,
    typescriptCoreHarnessHelperAdded: false,
    rustRuntimeHelperAdded: false,
    rustStdioOwnerAdded: false,
    rustHarnessRuntimeAdded: false,
    publicRustHarnessApiAdded: false,
    publicRuntimeContractAdded: false,
    approvalEvaluatorAdded: false,
    hostPolicyEnforcementAdded: false,
    failureAuditRuntimeAdded: false,
    cleanupRuntimeAdded: false,
    processKillAdded: false,
    processControlAdded: false,
    transcriptPersistenceReplayRuntimeAdded: false,
    secretsUsed: false
  });
  assert.deepEqual(
    inventory.fixtures.map(({ path, status }) => [path, status]),
    phase41JFixtureFiles.map((path) => [path, "present"])
  );
  assert.deepEqual(inventory.rustTestSource.map(({ path, status }) => [path, status]), [
    ["crates/ardyn-host/src/lib.rs", "present"]
  ]);
  assert.deepEqual(
    inventory.docs.map(({ path, status }) => [path, status]),
    phase41JDocFiles.map((path) => [path, "present"])
  );
  assert.deepEqual(inventory.tests.map(({ path, status }) => [path, status]), [
    ["tests/report-phase-status.test.mjs", "present"],
    ["tests/phase4-1j-rust-host-stdio-boundary-fixtures.test.mjs", "present"],
    ["tests/phase4-1i-rust-host-stdio-harness.test.mjs", "present"]
  ]);
  assert.deepEqual(
    inventory.runtimeLikeCommandRejectionProbes,
    phase41JRuntimeLikeCommandRejectionProbes
  );

  assertAllFalse(inventory.runtimeEffect);
  assert.deepEqual(inventory.safetyPosture, {
    nonExecuting: true,
    fixtureBackedStdioBoundariesOnly: true,
    privateRustTestHarnessOnly: true,
    fixtureBackedTestInfrastructureOnly: true,
    notRuntimeReadiness: true,
    privateHarnessNotPublicRuntimeContract: true,
    noPublicRuntimeContract: true,
    phase41IPrivateHarnessCoverageCarriedForward: true,
    productionRuntimeUnchanged: true,
    noFreshExternalReview: true,
    noFreshDevinReview: true,
    runtimeBlocked: true,
    noLiveRuntime: true,
    noRuntimeCommand: true,
    noHarnessCommand: true,
    noBoundaryCommand: true,
    noReviewDispositionCommand: true,
    noReviewPacketCommand: true,
    noRuntimeReadinessCommand: true,
    noServeRuntime: true,
    noStdioRuntime: true,
    noReplaySessionTranscript: true,
    noLiveStdioRuntime: true,
    noStdinCommandLoop: true,
    noLiveStdioReader: true,
    noStdoutWriter: true,
    noStderrWriter: true,
    noProcessStdioOwnership: true,
    noListener: true,
    noServer: true,
    noSubprocessSpawning: true,
    noAdapterCalls: true,
    noLocusRuntimeDependency: true,
    noMcpCalls: true,
    noOpenClawCalls: true,
    noPluginExecution: true,
    noContentFabricRuntimeBehavior: true,
    noContentFabricDownloadInstallEnable: true,
    noTranscriptPersistenceReplayRuntime: true,
    noFailureAuditRuntime: true,
    noCleanupRuntime: true,
    noProcessKill: true,
    noApprovalEvaluator: true,
    noHostPolicyEnforcement: true,
    noWebSocketHttpControlSurface: true,
    noSecrets: true,
    noProductionSigningKeys: true,
    noRuntimeApprovalGrant: true,
    noCliCommandAdded: true,
    noFileWriterAdded: true,
    noStdoutPrinterAdded: true,
    noRuntimeBehaviorIntroduced: true
  });
  assert.equal(report.safetyPosture.fixtureBackedStdioBoundaries, true);
  assert.equal(report.safetyPosture.flags.phase41JRuntimeImplemented, false);
  assert.equal(report.safetyPosture.flags.phase41JRuntimeReady, false);
  assert.equal(report.safetyPosture.flags.freshExternalReviewRan, true);
});

test("report inventories Phase 4.1K public Rust stdio runtime contract gates while runtime stays blocked", async () => {
  const report = await runReport();
  const inventory = report.phase41KStdioRuntimeContractGateInventory;

  assert.deepEqual(inventory.contractGateLayer, {
    document: "docs/phase-4-1k-stdio-runtime-contract-gates.md",
    precedingPhase: "4.1J",
    layerId: "approval-gated-rust-host-stdio-runtime-contract-gates",
    scope: "public-rust-runtime-contract-gate-only",
    publicRustContractIntroduced: true,
    publicRustContractReviewOnly: true,
    runtimeImplementationApproved: false,
    runtimeImplementationEnabled: false,
    runtimeEnabled: false,
    processStdioOwnership: false,
    cliSourceChanged: false,
    reportRunsChecks: false,
    freshExternalReviewRan: false,
    freshDevinReviewRan: false,
    runtimeBlocked: true,
    runtimeReadinessClaimed: false,
    runtimeBehaviorIntroduced: false,
    liveRuntimeBehaviorIntroduced: false,
    grantsRuntimeApproval: false
  });

  assert.equal(inventory.publicRustContractSurface.sourcePath, "crates/ardyn-host/src/lib.rs");
  assert.equal(inventory.publicRustContractSurface.publicRustContractIntroduced, true);
  assert.equal(
    inventory.publicRustContractSurface.contractSurfaceKind,
    "approval-gated-stdio-runtime-contract"
  );
  for (const field of [
    "runtimeImplementationApproved",
    "runtimeImplementationEnabled",
    "processStdioOwnershipAvailable",
    "stdoutWriterAvailable",
    "stderrWriterAvailable",
    "stdinReaderAvailable",
    "approvalEvaluatorAvailable",
    "hostPolicyEnforcementAvailable"
  ]) {
    assert.equal(inventory.publicRustContractSurface[field], false, field);
  }
  assert.deepEqual(
    inventory.publicRustContractSurface.helpers.map(({ name }) => name),
    phase41KRustContractHelperNames
  );
  for (const helper of inventory.publicRustContractSurface.helpers) {
    assert.equal(helper.sourcePath, "crates/ardyn-host/src/lib.rs");
    assert.equal(helper.runtimeImplementation, false, helper.name);
  }

  assert.deepEqual(
    inventory.gateFixtures.map(({ path }) => path),
    phase41KGateFixtureFiles
  );
  assertKnownInventoryStatuses(inventory.gateFixtures);
  assert.deepEqual(inventory.rustSourceInventory.map(({ path, status }) => [path, status]), [
    ["crates/ardyn-host/src/lib.rs", "present"]
  ]);
  assert.deepEqual(
    inventory.docs.map(({ path, status }) => [path, status]),
    phase41KDocFiles.map((path) => [path, "present"])
  );
  assert.deepEqual(inventory.tests.map(({ path }) => path), [
    "tests/report-phase-status.test.mjs",
    "tests/phase4-1k-stdio-runtime-contract-gates.test.mjs",
    "tests/phase4-1j-rust-host-stdio-boundary-fixtures.test.mjs"
  ]);
  assertKnownInventoryStatuses(inventory.tests);

  assert.deepEqual(
    inventory.ownershipBoundary.excludedCliRuntimeSourceFiles,
    phase41IExcludedCliRuntimeSourceFiles
  );
  assert.deepEqual(inventory.ownershipBoundary.rustAndFocusedTestOwnedByOtherWorkers, [
    "crates/ardyn-host/src/lib.rs",
    "tests/fixtures/host-policy/phase4-1k/stdio-runtime-contract-gates.json",
    "tests/phase4-1k-stdio-runtime-contract-gates.test.mjs"
  ]);
  assert.equal(inventory.ownershipBoundary.cliSourceChangedByThisPhase, false);
  assert.equal(inventory.ownershipBoundary.productionRuntimeSourceChangedByThisSubagent, false);
  assert.equal(inventory.ownershipBoundary.reportRunsChecks, false);
  assert.equal(
    inventory.ownershipBoundary.separateRuntimeImplementationApprovalRequired,
    true
  );
  assert.ok(
    inventory.ownershipBoundary.docsReportSubagentOwnedFiles.includes(
      "docs/phase-4-1k-stdio-runtime-contract-gates.md"
    )
  );
  assert.ok(
    inventory.ownershipBoundary.docsReportSubagentOwnedFiles.includes(
      "scripts/report-phase-status.mjs"
    )
  );

  assert.deepEqual(
    inventory.runtimeLikeCommandRejectionProbes,
    phase41KRuntimeLikeCommandRejectionProbes
  );
  assertAllFalse(inventory.runtimeEffect);
  assert.equal(inventory.safetyPosture.nonExecuting, true);
  assert.equal(inventory.safetyPosture.contractGateOnly, true);
  assert.equal(inventory.safetyPosture.publicRustContractReviewOnly, true);
  assert.equal(inventory.safetyPosture.runtimeImplementationApproved, false);
  assert.equal(inventory.safetyPosture.runtimeImplementationEnabled, false);
  assert.equal(inventory.safetyPosture.runtimeEnabled, false);
  assert.equal(inventory.safetyPosture.processStdioOwnershipAvailable, false);
  assert.equal(inventory.safetyPosture.cliSourceChanged, false);
  assert.equal(inventory.safetyPosture.reportRunsChecks, false);
  assert.equal(inventory.safetyPosture.noFreshExternalReview, true);
  assert.equal(inventory.safetyPosture.noFreshDevinReview, true);
  assert.equal(inventory.safetyPosture.runtimeBlocked, true);
  assert.equal(inventory.safetyPosture.noRuntimeCommand, true);
  assert.equal(inventory.safetyPosture.noContractGateCommand, true);
  assert.equal(inventory.safetyPosture.noProcessStdioOwnership, true);
  assert.equal(inventory.safetyPosture.noApprovalEvaluator, true);
  assert.equal(inventory.safetyPosture.noHostPolicyEnforcement, true);
  assert.equal(inventory.safetyPosture.noRuntimeApprovalGrant, true);
  assert.equal(inventory.safetyPosture.noRuntimeBehaviorIntroduced, true);
  assert.equal(report.safetyPosture.stdioRuntimeContractGates, true);
  assert.equal(report.safetyPosture.flags.phase41KRuntimeImplemented, false);
  assert.equal(report.safetyPosture.flags.phase41KRuntimeReady, false);
  assert.equal(report.safetyPosture.flags.phase41KRuntimeContractGateEnabled, false);
  assert.equal(report.safetyPosture.flags.freshExternalReviewRan, true);
  assert.equal(report.safetyPosture.flags.freshDevinReviewRan, false);
});

test("report inventories Phase 4.1L runtime implementation readiness while runtime stays blocked", async () => {
  const report = await runReport();
  const inventory = report.phase41LRuntimeImplementationReadinessInventory;

  assert.deepEqual(inventory.readinessLayer, {
    document: "docs/phase-4-1l-runtime-implementation-readiness.md",
    precedingPhase: "4.1K",
    layerId: "runtime-implementation-readiness-and-4.2a-handoff",
    scope: "implementation-readiness-design-test-plan-blocker-burn-down",
    readyToPlan42A: true,
    readyToImplementDeliberatelyBlockedSkeleton: true,
    runtimeEnablementReady: false,
    runtimeImplementationApproved: false,
    runtimeEnablementApproved: false,
    runtimeApprovalGranted: false,
    cliSourceChanged: false,
    appsCliIndexChanged: false,
    reportRunsChecks: false,
    freshExternalReviewRan: false,
    freshDevinReviewRan: false,
    runtimeBlocked: true,
    runtimeReadinessClaimed: false,
    runtimeBehaviorIntroduced: false,
    liveRuntimeBehaviorIntroduced: false,
    grantsRuntimeApproval: false
  });

  assert.deepEqual(
    [inventory.readinessFixture.path, inventory.readinessFixture.status],
    [
      "tests/fixtures/host-policy/phase4-1l/runtime-implementation-readiness.json",
      "present"
    ]
  );
  assert.deepEqual(inventory.readinessMetadata, {
    schema: "ardyn.phase-4.1l.runtime-implementation-readiness",
    schemaVersion: "0.1.0",
    phase: "phase-4.1l-runtime-implementation-readiness",
    artifactKind: "approval-reviewed-rust-host-stdio-runtime-implementation-readiness",
    metadataGeneratedAt: "1970-01-01T00:00:00.000Z",
    approvalWording: "4.2a_skeleton_entry_ready_runtime_enablement_blocked",
    auditApprovalWording: "skeleton_entry_ready_runtime_enablement_blocked"
  });

  assert.deepEqual(
    inventory.phase42AEntryCriteria.map(({ id, status, allows42ASkeletonPlanning, allowsRuntimeEnablement }) => [
      id,
      status,
      allows42ASkeletonPlanning,
      allowsRuntimeEnablement
    ]),
    [
      ["phase-4.1i-private-harness", "satisfied", true, false],
      ["phase-4.1j-fixture-boundaries", "satisfied", true, false],
      ["phase-4.1k-contract-gates", "satisfied", true, false],
      ["phase-4.1l-readiness-matrix", "satisfied", true, false]
    ]
  );
  assert.deepEqual(
    inventory.blockedRuntimeEnablementCriteria.map(({ id, status, grantsRuntimeApproval }) => [
      id,
      status,
      grantsRuntimeApproval
    ]),
    [
      ["fresh-external-review", "blocked", false],
      ["fresh-devin-review", "blocked", false],
      ["runtime-readiness-review", "blocked", false],
      ["host-policy-runtime-enforcement-review", "blocked", false],
      ["cli-runtime-command-review", "blocked", false]
    ]
  );
  assert.deepEqual(
    inventory.phase41EvidenceMap.map(({ phase, status, runtimeImplemented }) => [
      phase,
      status,
      runtimeImplemented
    ]),
    [
      ["4.1I", "satisfied-for-42a-skeleton-planning", false],
      ["4.1J", "satisfied-for-42a-skeleton-planning", false],
      ["4.1K", "satisfied-for-42a-skeleton-planning", false]
    ]
  );
  assert.equal(
    inventory.blockerBurnDown.find((blocker) => blocker.id === "runtime-command-surface").status,
    "blocked"
  );
  assert.equal(
    inventory.blockerBurnDown.find((blocker) => blocker.id === "bounded-skeleton-module-layout")
      .status,
    "ready"
  );
  assert.equal(
    inventory.phase42AHandoff.recommendedPhaseName,
    "Phase 4.2A deliberately blocked Rust-host stdio runtime skeleton"
  );
  assert.ok(
    inventory.phase42AHandoff.allowedScope.includes(
      "private Rust module skeletons under crates/ardyn-host"
    )
  );
  assert.ok(inventory.phase42AHandoff.disallowedScope.includes("live stdin read loop"));

  assert.deepEqual(
    inventory.docs.map(({ path, status }) => [path, status]),
    phase41LDocFiles.map((path) => [path, "present"])
  );
  assert.deepEqual(inventory.tests.map(({ path, status }) => [path, status]), [
    ["tests/report-phase-status.test.mjs", "present"],
    ["tests/phase4-1l-runtime-implementation-readiness.test.mjs", "present"],
    ["tests/phase4-1k-stdio-runtime-contract-gates.test.mjs", "present"]
  ]);
  assert.deepEqual(inventory.rustSourceInventory.map(({ path, status }) => [path, status]), [
    ["crates/ardyn-host/src/lib.rs", "present"]
  ]);
  assert.deepEqual(inventory.cliSourceInventory.map(({ path, status }) => [path, status]), [
    ["apps/cli/src/index.mjs", "present"]
  ]);
  assert.deepEqual(inventory.ownershipBoundary.excludedCliRuntimeSourceFiles, [
    "apps/cli/src/index.mjs"
  ]);
  assert.equal(inventory.ownershipBoundary.cliSourceChangedByThisPhase, false);
  assert.equal(inventory.ownershipBoundary.appsCliIndexChangedByThisPhase, false);
  assert.equal(inventory.ownershipBoundary.productionRuntimeSourceChangedByThisPhase, false);
  assert.equal(inventory.ownershipBoundary.reportRunsChecks, false);
  assert.equal(inventory.ownershipBoundary.separateRuntimeImplementationApprovalRequired, true);
  assert.equal(inventory.ownershipBoundary.separateRuntimeEnablementApprovalRequired, true);

  assert.deepEqual(
    inventory.runtimeLikeCommandRejectionProbes,
    phase41LRuntimeLikeCommandRejectionProbes
  );
  assertAllFalse(inventory.runtimeEffect);
  assert.equal(inventory.safetyPosture.nonExecuting, true);
  assert.equal(inventory.safetyPosture.readinessInventoryOnly, true);
  assert.equal(inventory.safetyPosture.readyToPlan42A, true);
  assert.equal(inventory.safetyPosture.readyToImplementDeliberatelyBlockedSkeleton, true);
  assert.equal(inventory.safetyPosture.runtimeEnablementReady, false);
  assert.equal(inventory.safetyPosture.runtimeImplementationApproved, false);
  assert.equal(inventory.safetyPosture.runtimeEnablementApproved, false);
  assert.equal(inventory.safetyPosture.runtimeEnabled, false);
  assert.equal(inventory.safetyPosture.cliSourceChanged, false);
  assert.equal(inventory.safetyPosture.appsCliIndexChanged, false);
  assert.equal(inventory.safetyPosture.reportRunsChecks, false);
  assert.equal(inventory.safetyPosture.noFreshExternalReview, true);
  assert.equal(inventory.safetyPosture.noFreshDevinReview, true);
  assert.equal(inventory.safetyPosture.runtimeBlocked, true);
  assert.equal(inventory.safetyPosture.noRuntimeCommand, true);
  assert.equal(inventory.safetyPosture.noImplementationReadinessCommand, true);
  assert.equal(inventory.safetyPosture.noPhase42ASkeletonCommand, true);
  assert.equal(inventory.safetyPosture.noProcessStdioOwnership, true);
  assert.equal(inventory.safetyPosture.noApprovalEvaluator, true);
  assert.equal(inventory.safetyPosture.noHostPolicyEnforcement, true);
  assert.equal(inventory.safetyPosture.noRuntimeApprovalGrant, true);
  assert.equal(inventory.safetyPosture.noRuntimeBehaviorIntroduced, true);
  assert.equal(report.safetyPosture.runtimeImplementationReadinessInventory, true);
  assert.equal(report.safetyPosture.flags.phase41LRuntimeImplemented, false);
  assert.equal(report.safetyPosture.flags.phase41LRuntimeReady, false);
  assert.equal(
    report.safetyPosture.flags.phase41LRuntimeImplementationReadinessCommandEnabled,
    false
  );
  assert.equal(report.safetyPosture.flags.freshExternalReviewRan, true);
  assert.equal(report.safetyPosture.flags.freshDevinReviewRan, false);
});

test("report inventories Phase 4.2A deliberately blocked runtime skeleton while runtime stays blocked", async () => {
  const report = await runReport();
  const inventory = report.phase42ADeliberatelyBlockedRuntimeSkeletonInventory;

  assert.deepEqual(inventory.skeletonLayer, {
    document: "docs/phase-4-2a-deliberately-blocked-rust-host-stdio-runtime-skeleton.md",
    precedingPhase: "4.1L",
    layerId: "deliberately-blocked-rust-host-stdio-runtime-skeleton",
    scope: "internal-rust-library-skeleton-runtime-unavailable",
    moduleRoot: "crates/ardyn-host/src/stdio_runtime/mod.rs",
    crateModuleVisibility: "private",
    runtimeEnabled: false,
    runtimeImplemented: false,
    runtimeReadinessClaimed: false,
    runtimeApprovalGranted: false,
    executionAvailable: false,
    approvalEvaluatorAvailable: false,
    cliSourceChanged: false,
    appsCliIndexChanged: false,
    reportRunsChecks: false,
    freshExternalReviewRan: false,
    freshDevinReviewRan: false,
    runtimeBlocked: true
  });

  assert.deepEqual(
    [inventory.skeletonFixture.path, inventory.skeletonFixture.status],
    [
      "tests/fixtures/host-policy/phase4-2a/blocked-stdio-runtime-skeleton-plan.json",
      "present"
    ]
  );
  assert.deepEqual(inventory.skeletonMetadata, {
    schema: "ardyn.phase-4.2a.blocked-stdio-runtime-skeleton-plan",
    schemaVersion: "0.1.0",
    phase: "phase-4.2a-blocked-stdio-runtime-skeleton",
    fixtureKind: "deliberately-blocked-rust-host-stdio-runtime-skeleton-expectations",
    metadataGeneratedAt: "1970-01-01T00:00:00.000Z"
  });
  assert.equal(
    inventory.reusedFixtures.validSingleEvent,
    "tests/fixtures/stdio-harness/phase4-1j/valid-single-event.jsonl"
  );
  assert.deepEqual(inventory.rustSkeleton.helperFunctions, [
    "stdio_runtime_skeleton_state",
    "plan_stdio_runtime_frame",
    "plan_stdio_runtime_gates",
    "plan_stdio_runtime_gates_from_bundle",
    "blocked_stdio_runtime_entrypoint",
    "blocked_stdio_runtime_approval_request",
    "blocked_stdio_runtime_execution_request"
  ]);
  assert.deepEqual(
    inventory.cases.map(({ name, expected }) => [
      name,
      expected.inputClassification,
      expected.entrypointStatus,
      expected.executed,
      expected.runtimeEnabled,
      expected.approvalGranted
    ]),
    [
      [
        "valid-single-event-maps-to-blocked-plan",
        "accepted_static_probe",
        "runtime_unavailable",
        false,
        false,
        false
      ],
      [
        "well-formed-runtime-approval-request-stays-blocked",
        "rejected_runtime_approval_request",
        "runtime_unavailable",
        false,
        false,
        false
      ]
    ]
  );

  assert.deepEqual(
    inventory.docs.map(({ path, status }) => [path, status]),
    phase42ADocFiles.map((path) => [path, "present"])
  );
  assert.deepEqual(inventory.tests.map(({ path, status }) => [path, status]), [
    ["tests/report-phase-status.test.mjs", "present"],
    ["tests/phase4-2a-blocked-rust-stdio-runtime-skeleton.test.mjs", "present"],
    ["tests/phase4-1l-runtime-implementation-readiness.test.mjs", "present"]
  ]);
  assert.deepEqual(inventory.rustSourceInventory.map(({ path, status }) => [path, status]), [
    ["crates/ardyn-host/src/lib.rs", "present"],
    ["crates/ardyn-host/src/stdio_runtime/mod.rs", "present"]
  ]);
  assert.deepEqual(inventory.cliSourceInventory.map(({ path, status }) => [path, status]), [
    ["apps/cli/src/index.mjs", "present"]
  ]);
  assert.deepEqual(inventory.ownershipBoundary.excludedCliRuntimeSourceFiles, [
    "apps/cli/src/index.mjs"
  ]);
  assert.equal(inventory.ownershipBoundary.cliSourceChangedByThisPhase, false);
  assert.equal(inventory.ownershipBoundary.appsCliIndexChangedByThisPhase, false);
  assert.equal(inventory.ownershipBoundary.reportRunsChecks, false);
  assert.equal(inventory.ownershipBoundary.separateRuntimeImplementationApprovalRequired, true);
  assert.equal(inventory.ownershipBoundary.separateRuntimeEnablementApprovalRequired, true);

  assert.deepEqual(
    inventory.runtimeLikeCommandRejectionProbes,
    phase42ARuntimeLikeCommandRejectionProbes
  );
  assertAllFalse(inventory.runtimeEffect);
  assert.equal(inventory.externalReview.externalReviewPerformed, false);
  assert.match(inventory.externalReview.externalReviewReason, /No Devin or Jules/);
  assert.equal(inventory.safetyPosture.nonExecuting, true);
  assert.equal(inventory.safetyPosture.blockedSkeletonOnly, true);
  assert.equal(inventory.safetyPosture.internalRustSkeletonCodePresent, true);
  assert.equal(inventory.safetyPosture.runtimeEnabled, false);
  assert.equal(inventory.safetyPosture.runtimeImplemented, false);
  assert.equal(inventory.safetyPosture.runtimeReadinessClaimed, false);
  assert.equal(inventory.safetyPosture.runtimeApprovalGranted, false);
  assert.equal(inventory.safetyPosture.executionAvailable, false);
  assert.equal(inventory.safetyPosture.approvalEvaluatorAvailable, false);
  assert.equal(inventory.safetyPosture.cliSourceChanged, false);
  assert.equal(inventory.safetyPosture.appsCliIndexChanged, false);
  assert.equal(inventory.safetyPosture.reportRunsChecks, false);
  assert.equal(inventory.safetyPosture.runtimeBlocked, true);
  assert.equal(inventory.safetyPosture.noRuntimeCommand, true);
  assert.equal(inventory.safetyPosture.noPhase42ASkeletonCommand, true);
  assert.equal(inventory.safetyPosture.noProcessStdioOwnership, true);
  assert.equal(inventory.safetyPosture.noApprovalEvaluator, true);
  assert.equal(inventory.safetyPosture.noRuntimeApprovalGrant, true);
  assert.equal(inventory.safetyPosture.noRuntimeBehaviorIntroduced, true);
  assert.equal(report.safetyPosture.phase42ADeliberatelyBlockedRuntimeSkeleton, true);
  assert.equal(report.safetyPosture.flags.phase42ARuntimeImplemented, false);
  assert.equal(report.safetyPosture.flags.phase42ARuntimeReady, false);
  assert.equal(report.safetyPosture.flags.phase42ARuntimeEnabled, false);
  assert.equal(report.safetyPosture.flags.phase42ARuntimeCommandEnabled, false);
  assert.equal(report.safetyPosture.flags.phase42AAppsCliIndexChanged, false);
});

test("report inventories Phase 4.2B blocked lifecycle and failure-audit skeleton while runtime stays blocked", async () => {
  const report = await runReport();
  const inventory = report.phase42BLifecycleFailureAuditSkeletonInventory;

  assert.deepEqual(inventory.skeletonLayer, {
    document: "docs/phase-4-2b-blocked-lifecycle-failure-audit-skeleton.md",
    precedingPhase: "4.2A",
    layerId: "blocked-lifecycle-failure-audit-skeleton",
    scope: "internal-rust-library-lifecycle-failure-audit-planning-runtime-unavailable",
    moduleRoot: "crates/ardyn-host/src/stdio_runtime/mod.rs",
    crateModuleVisibility: "private",
    runtimeEnabled: false,
    runtimeImplemented: false,
    runtimeReadinessClaimed: false,
    runtimeApprovalGranted: false,
    executionAvailable: false,
    lifecycleAvailable: false,
    processControlAvailable: false,
    failureAuditRuntimeAvailable: false,
    transcriptPersistenceRuntimeAvailable: false,
    approvalEvaluatorAvailable: false,
    cliSourceChanged: false,
    appsCliIndexChanged: false,
    reportRunsChecks: false,
    freshExternalReviewRan: false,
    freshDevinReviewRan: false,
    freshJulesReviewRan: false,
    runtimeBlocked: true
  });

  assert.deepEqual(
    [inventory.skeletonFixture.path, inventory.skeletonFixture.status],
    [
      "tests/fixtures/host-policy/phase4-2b/lifecycle-failure-audit-skeleton-plan.json",
      "present"
    ]
  );
  assert.deepEqual(inventory.skeletonMetadata, {
    schema: "ardyn.phase-4.2b.blocked-lifecycle-failure-audit-skeleton-plan",
    schemaVersion: "0.1.0",
    phase: "phase-4.2b-blocked-lifecycle-failure-audit-skeleton",
    fixtureKind: "blocked-rust-host-lifecycle-failure-audit-expectations",
    metadataGeneratedAt: "1970-01-01T00:00:00.000Z"
  });
  assert.equal(
    inventory.reusedFixtures.blockedRuntimeSkeleton,
    "tests/fixtures/host-policy/phase4-2a/blocked-stdio-runtime-skeleton-plan.json"
  );
  assert.deepEqual(inventory.rustLifecycleSkeleton.helperFunctions, [
    "plan_stdio_runtime_lifecycle_transition",
    "blocked_stdio_runtime_start_request",
    "blocked_stdio_runtime_stop_request",
    "blocked_stdio_runtime_kill_request",
    "blocked_stdio_runtime_execute_request",
    "stdio_runtime_lifecycle_unavailable_error"
  ]);
  assert.deepEqual(
    inventory.blockedLifecycleRequests.map(
      ({ name, action, expectedStatus, expectedBlockReason }) => [
        name,
        action,
        expectedStatus,
        expectedBlockReason
      ]
    ),
    [
      ["blocked-start-request", "start", "start_blocked", "start_unavailable"],
      ["blocked-stop-request", "stop", "stop_blocked", "stop_unavailable"],
      ["blocked-kill-request", "kill", "kill_blocked", "kill_unavailable"],
      ["blocked-execute-request", "execute", "execution_blocked", "execution_unavailable"]
    ]
  );
  assertAllFalse(inventory.blockedWriteSideEffects);
  assert.equal(inventory.deterministicFailureAudit.plannedOnly, true);
  assert.equal(inventory.deterministicFailureAudit.emitted, false);
  assert.equal(inventory.deterministicFailureAudit.runtimeEffectRecorded, false);
  assert.equal(inventory.deterministicFailureAudit.containsProcessId, false);

  assert.deepEqual(
    inventory.docs.map(({ path, status }) => [path, status]),
    phase42BDocFiles.map((path) => [path, "present"])
  );
  assert.deepEqual(inventory.tests.map(({ path, status }) => [path, status]), [
    ["tests/report-phase-status.test.mjs", "present"],
    ["tests/phase4-2b-blocked-lifecycle-failure-audit-skeleton.test.mjs", "present"],
    ["tests/phase4-2a-blocked-rust-stdio-runtime-skeleton.test.mjs", "present"]
  ]);
  assert.deepEqual(inventory.rustSourceInventory.map(({ path, status }) => [path, status]), [
    ["crates/ardyn-host/src/lib.rs", "present"],
    ["crates/ardyn-host/src/stdio_runtime/mod.rs", "present"]
  ]);
  assert.deepEqual(inventory.cliSourceInventory.map(({ path, status }) => [path, status]), [
    ["apps/cli/src/index.mjs", "present"]
  ]);
  assert.deepEqual(inventory.ownershipBoundary.excludedCliRuntimeSourceFiles, [
    "apps/cli/src/index.mjs"
  ]);
  assert.equal(inventory.ownershipBoundary.cliSourceChangedByThisPhase, false);
  assert.equal(inventory.ownershipBoundary.appsCliIndexChangedByThisPhase, false);
  assert.equal(inventory.ownershipBoundary.reportRunsChecks, false);
  assert.equal(inventory.ownershipBoundary.separateRuntimeImplementationApprovalRequired, true);
  assert.equal(inventory.ownershipBoundary.separateRuntimeEnablementApprovalRequired, true);

  assert.deepEqual(
    inventory.runtimeLikeCommandRejectionProbes,
    phase42BRuntimeLikeCommandRejectionProbes
  );
  assertAllFalse(inventory.runtimeEffect);
  assert.equal(inventory.externalReview.externalReviewPerformed, false);
  assert.match(inventory.externalReview.externalReviewReason, /No Devin or Jules/);
  assert.equal(inventory.safetyPosture.nonExecuting, true);
  assert.equal(inventory.safetyPosture.blockedSkeletonOnly, true);
  assert.equal(inventory.safetyPosture.internalRustLifecycleCodePresent, true);
  assert.equal(inventory.safetyPosture.runtimeEnabled, false);
  assert.equal(inventory.safetyPosture.runtimeImplemented, false);
  assert.equal(inventory.safetyPosture.processControlAvailable, false);
  assert.equal(inventory.safetyPosture.failureAuditRuntimeAvailable, false);
  assert.equal(inventory.safetyPosture.transcriptPersistenceRuntimeAvailable, false);
  assert.equal(inventory.safetyPosture.noProcessKill, true);
  assert.equal(inventory.safetyPosture.noProcessSignal, true);
  assert.equal(inventory.safetyPosture.noProcessPollOrWait, true);
  assert.equal(inventory.safetyPosture.noTranscriptWrite, true);
  assert.equal(inventory.safetyPosture.noFailureAuditWrite, true);
  assert.equal(inventory.safetyPosture.noRuntimeBehaviorIntroduced, true);
  assert.equal(report.safetyPosture.phase42BLifecycleFailureAuditSkeleton, true);
  assert.equal(report.safetyPosture.flags.phase42BRuntimeImplemented, false);
  assert.equal(report.safetyPosture.flags.phase42BRuntimeReady, false);
  assert.equal(report.safetyPosture.flags.phase42BRuntimeEnabled, false);
  assert.equal(report.safetyPosture.flags.phase42BRuntimeCommandEnabled, false);
  assert.equal(report.safetyPosture.flags.phase42BAppsCliIndexChanged, false);
  assert.equal(report.safetyPosture.flags.phase42BProcessControlEnabled, false);
  assert.equal(report.safetyPosture.flags.phase42BFailureAuditRuntimeEnabled, false);
  assert.equal(report.safetyPosture.flags.phase42BTranscriptPersistenceRuntimeEnabled, false);
});

test("report inventories Phase 4.2C runtime readiness review gate while runtime stays blocked", async () => {
  const report = await runReport();
  const inventory = report.phase42CRuntimeReadinessReviewGateInventory;

  assert.deepEqual(inventory.gateLayer, {
    document: "docs/phase-4-2c-runtime-readiness-review-gate.md",
    precedingPhase: "4.2B",
    layerId: "runtime-readiness-review-gate",
    scope: "external-review-packet-and-blocker-burn-down-runtime-still-blocked",
    fixture: "tests/fixtures/host-policy/phase4-2c/runtime-readiness-review-gate.json",
    readyForExternalReview: true,
    externalReviewComplete: false,
    runtimeReadinessApproved: false,
    runtimeEnablementApproved: false,
    runtimeEnabled: false,
    runtimeBlocked: true,
    runtimeUnblockRequiresSeparatePhase: true,
    runtimeApprovalRequiresSeparatePhase: true,
    cliSourceChanged: false,
    appsCliIndexChanged: false,
    reportRunsChecks: false
  });

  assert.deepEqual(
    [inventory.gateFixture.path, inventory.gateFixture.status],
    ["tests/fixtures/host-policy/phase4-2c/runtime-readiness-review-gate.json", "present"]
  );
  assert.deepEqual(inventory.gateMetadata, {
    schema: "ardyn.phase-4.2c.runtime-readiness-review-gate",
    schemaVersion: "0.1.0",
    phase: "phase-4.2c-runtime-readiness-review-gate",
    artifactKind: "runtime-readiness-review-gate-and-external-review-packet",
    metadataGeneratedAt: "1970-01-01T00:00:00.000Z",
    currentState: "blocked_skeleton_current",
    nextAllowedState: "ready_for_external_review_runtime_still_blocked",
    prohibitedTransitions: [
      "runtime_enabled",
      "runtime_approved",
      "runtime_command_available",
      "external_review_complete_without_recorded_jules_or_devin_review",
      "process_control_available",
      "transcript_or_failure_audit_runtime_write_available"
    ]
  });

  assert.equal(inventory.readinessGate.readyForExternalReview, true);
  assert.equal(inventory.readinessGate.runtimeReadinessApproved, false);
  assert.equal(inventory.readinessGate.runtimeEnablementApproved, false);
  assert.equal(inventory.readinessGate.runtimeEnabled, false);
  assert.equal(inventory.readinessGate.runtimeBlocked, true);
  assert.deepEqual(inventory.readinessGate.approvalBlockedBy, [
    "fresh-external-review-incomplete",
    "must-fix-before-any-enablement-blockers-open",
    "runtime-implementation-approval-missing",
    "runtime-enablement-approval-missing",
    "runtime-command-surface-not-approved",
    "host-policy-runtime-enforcement-not-implemented",
    "rollback-and-kill-switch-not-implemented"
  ]);

  assert.equal(inventory.externalReview.status, "packet-ready-runtime-still-blocked");
  assert.equal(inventory.externalReview.externalReviewPerformed, false);
  assert.equal(inventory.externalReview.externalReviewComplete, false);
  assert.equal(inventory.externalReview.reviewer, null);
  assert.equal(inventory.externalReview.reviewedCommit, null);
  assert.match(inventory.externalReview.externalReviewReason, /No Jules or Devin/);
  assert.equal(inventory.reviewPacket.document, "docs/phase-4-2c-runtime-readiness-review-gate.md");
  assert.equal(
    inventory.reviewPacket.fixture,
    "tests/fixtures/host-policy/phase4-2c/runtime-readiness-review-gate.json"
  );
  assert.deepEqual(inventory.reviewPacket.targetReviewers, ["Jules", "Devin"]);
  assert.equal(inventory.reviewPacket.questions.length, 5);
  assert.equal(inventory.reviewPacket.claimsExternalReviewComplete, false);
  assert.equal(inventory.reviewPacket.claimsRuntimeApproved, false);
  assert.equal(inventory.reviewPacket.claimsRuntimeEnabled, false);

  assert.equal(
    inventory.evidenceLinks.blockedRuntimeSkeleton.fixture,
    "tests/fixtures/host-policy/phase4-2a/blocked-stdio-runtime-skeleton-plan.json"
  );
  assert.equal(
    inventory.evidenceLinks.blockedLifecycleFailureAuditSkeleton.fixture,
    "tests/fixtures/host-policy/phase4-2b/lifecycle-failure-audit-skeleton-plan.json"
  );
  assert.equal(inventory.evidenceLinks.dryRunSmoke.expectedExitCode, 0);
  assert.equal(inventory.evidenceLinks.dryRunSmoke.expectedEventCount, 6);
  assert.equal(inventory.evidenceLinks.dryRunSmoke.zeroStderr, true);

  assert.deepEqual(
    inventory.blockerBurnDown.mustFixBeforeAnyEnablement.map(
      ({ id, classification, status, requiredBeforeRuntimeEnablement, grantsRuntimeApproval }) => [
        id,
        classification,
        status,
        requiredBeforeRuntimeEnablement,
        grantsRuntimeApproval
      ]
    ),
    [
      [
        "fresh-jules-or-devin-review",
        "must-fix-before-any-enablement",
        "open",
        true,
        false
      ],
      [
        "runtime-implementation-approval",
        "must-fix-before-any-enablement",
        "open",
        true,
        false
      ],
      [
        "runtime-command-surface-review",
        "must-fix-before-any-enablement",
        "open",
        true,
        false
      ],
      [
        "host-policy-runtime-enforcement",
        "must-fix-before-any-enablement",
        "open",
        true,
        false
      ],
      ["rollback-kill-switch", "must-fix-before-any-enablement", "open", true, false]
    ]
  );
  assert.ok(
    inventory.blockerBurnDown.mustFixDuringFirstEnablementImplementation.includes(
      "approval-evaluator"
    )
  );
  assert.ok(
    inventory.blockerBurnDown.mustRemainGuardedAfterEnablement.includes(
      "locus-mcp-openclaw-plugin-runtime-behavior"
    )
  );

  assert.deepEqual(
    inventory.docs.map(({ path, status }) => [path, status]),
    phase42CDocFiles.map((path) => [path, "present"])
  );
  assert.deepEqual(inventory.tests.map(({ path, status }) => [path, status]), [
    ["tests/report-phase-status.test.mjs", "present"],
    ["tests/phase4-2c-runtime-readiness-review-gate.test.mjs", "present"],
    ["tests/phase4-2b-blocked-lifecycle-failure-audit-skeleton.test.mjs", "present"],
    ["tests/phase4-2a-blocked-rust-stdio-runtime-skeleton.test.mjs", "present"]
  ]);
  assert.deepEqual(inventory.rustSourceInventory.map(({ path, status }) => [path, status]), [
    ["crates/ardyn-host/src/lib.rs", "present"],
    ["crates/ardyn-host/src/stdio_runtime/mod.rs", "present"]
  ]);
  assert.deepEqual(inventory.cliSourceInventory.map(({ path, status }) => [path, status]), [
    ["apps/cli/src/index.mjs", "present"]
  ]);
  assert.deepEqual(inventory.ownershipBoundary.excludedCliRuntimeSourceFiles, [
    "apps/cli/src/index.mjs"
  ]);
  assert.equal(inventory.ownershipBoundary.cliSourceChangedByThisPhase, false);
  assert.equal(inventory.ownershipBoundary.appsCliIndexChangedByThisPhase, false);
  assert.equal(inventory.ownershipBoundary.reportRunsChecks, false);
  assert.equal(inventory.ownershipBoundary.separateExternalReviewRequired, true);
  assert.equal(inventory.ownershipBoundary.separateRuntimeImplementationApprovalRequired, true);
  assert.equal(inventory.ownershipBoundary.separateRuntimeEnablementApprovalRequired, true);

  assert.deepEqual(
    inventory.runtimeLikeCommandRejectionProbes,
    phase42CRuntimeLikeCommandRejectionProbes
  );
  assertAllFalse(inventory.runtimeEffect);
  assert.equal(inventory.nonExecutionInvariants.at(-1), "ready-for-external-review-is-not-runtime-approval");
  assert.equal(inventory.safetyPosture.readyForExternalReview, true);
  assert.equal(inventory.safetyPosture.runtimeBlocked, true);
  assert.equal(inventory.safetyPosture.runtimeEnabled, false);
  assert.equal(inventory.safetyPosture.runtimeApproved, false);
  assert.equal(inventory.safetyPosture.runtimeReadinessApproved, false);
  assert.equal(inventory.safetyPosture.runtimeEnablementApproved, false);
  assert.equal(inventory.safetyPosture.externalReviewComplete, false);
  assert.equal(inventory.safetyPosture.noRuntimeCommand, true);
  assert.equal(inventory.safetyPosture.noReadinessApprovalCommand, true);
  assert.equal(inventory.safetyPosture.noExternalReviewCommand, true);
  assert.equal(inventory.safetyPosture.noProcessControl, true);
  assert.equal(inventory.safetyPosture.noTranscriptWrite, true);
  assert.equal(inventory.safetyPosture.noFailureAuditWrite, true);
  assert.equal(report.safetyPosture.phase42CRuntimeReadinessReviewGate, true);
  assert.equal(report.safetyPosture.flags.phase42CReadyForExternalReview, true);
  assert.equal(report.safetyPosture.flags.phase42CRuntimeImplemented, false);
  assert.equal(report.safetyPosture.flags.phase42CRuntimeReady, false);
  assert.equal(report.safetyPosture.flags.phase42CRuntimeApproved, false);
  assert.equal(report.safetyPosture.flags.phase42CRuntimeEnabled, false);
  assert.equal(report.safetyPosture.flags.phase42CRuntimeCommandEnabled, false);
  assert.equal(report.safetyPosture.flags.phase42CAppsCliIndexChanged, false);
  assert.equal(report.safetyPosture.flags.phase42CExternalReviewComplete, false);
  assert.equal(report.safetyPosture.flags.phase42CReadinessApprovalCommandEnabled, false);
  assert.equal(report.safetyPosture.flags.phase42CProcessControlEnabled, false);
  assert.equal(report.safetyPosture.flags.phase42CFailureAuditRuntimeEnabled, false);
  assert.equal(report.safetyPosture.flags.phase42CTranscriptPersistenceRuntimeEnabled, false);
});

test("report inventories Phase 4.2D Jules disposition and Phase 5 handoff while runtime stays blocked", async () => {
  const report = await runReport();
  const inventory = report.phase42DExternalReviewDispositionPhase5HandoffInventory;

  assert.deepEqual(inventory.dispositionLayer, {
    document: "docs/phase-4-2d-external-review-disposition-phase5-handoff.md",
    handoffDocument: "docs/phase-5-1-controlled-runtime-implementation-approval-handoff.md",
    precedingPhase: "4.2C",
    layerId: "external-review-disposition-phase5-handoff",
    scope: "record-jules-approve-and-handoff-phase5-runtime-still-blocked",
    fixture: "tests/fixtures/host-policy/phase4-2d/external-review-disposition-phase5-handoff.json",
    reviewer: "Jules",
    verdict: "APPROVE",
    externalReviewComplete: true,
    julesReviewRecorded: true,
    phase5HandoffReady: true,
    runtimeImplementationApproved: false,
    runtimeCommandSurfaceApproved: false,
    runtimeEnabled: false,
    runtimeBlocked: true,
    cliSourceChanged: false,
    appsCliIndexChanged: false,
    reportRunsChecks: false
  });

  assert.deepEqual(
    [inventory.dispositionFixture.path, inventory.dispositionFixture.status],
    [
      "tests/fixtures/host-policy/phase4-2d/external-review-disposition-phase5-handoff.json",
      "present"
    ]
  );
  assert.deepEqual(inventory.dispositionMetadata, {
    schema: "ardyn.phase-4.2d.external-review-disposition-phase5-handoff",
    schemaVersion: "0.1.0",
    phase: "phase-4.2d-external-review-disposition-phase5-handoff",
    artifactKind: "external-review-disposition-and-phase5-handoff",
    metadataGeneratedAt: "1970-01-01T00:00:00.000Z"
  });
  assert.deepEqual(inventory.sourcePhase, {
    previousPhase: "phase-4.2c-runtime-readiness-review-gate",
    previousCommit: "6f2097816cf1f93dbfffb468d8444ef7ec87e2ac",
    previousBranch: "codex/phase-4-2c-runtime-readiness-review-gate",
    previousFixture: "tests/fixtures/host-policy/phase4-2c/runtime-readiness-review-gate.json",
    postMergeReview: true
  });

  assert.equal(inventory.julesReviewDisposition.reviewer, "Jules");
  assert.equal(inventory.julesReviewDisposition.verdict, "APPROVE");
  assert.equal(inventory.julesReviewDisposition.status, "review-recorded-runtime-still-blocked");
  assert.equal(inventory.julesReviewDisposition.reviewedCommit, "6f2097816cf1f93dbfffb468d8444ef7ec87e2ac");
  assert.equal(inventory.julesReviewDisposition.externalReviewPerformed, true);
  assert.equal(inventory.julesReviewDisposition.externalReviewComplete, true);
  assert.equal(inventory.julesReviewDisposition.freshJulesReviewRan, true);
  assert.equal(inventory.julesReviewDisposition.freshDevinReviewRan, false);
  assert.equal(inventory.julesReviewDisposition.runtimeApprovalGranted, false);
  assert.equal(inventory.julesReviewDisposition.runtimeEnabled, false);
  assert.equal(inventory.julesReviewDisposition.runtimeImplementationApproved, false);
  assert.equal(inventory.julesReviewDisposition.runtimeCommandSurfaceApproved, false);
  assert.deepEqual(
    inventory.julesReviewDisposition.reviewFindings.map(({ id, status }) => [id, status]),
    [
      ["no-accidental-runtime-enablement", "approved"],
      ["no-missing-gate-or-test-before-merge", "approved"],
      ["runtime-remains-blocked", "approved"],
      ["source-guards-private-boundaries-adequate", "approved"],
      ["runtime-unavailable-entrypoints", "approved"],
      ["forbidden-api-guards-covered", "approved"],
      ["blocked-effects-enforced", "approved"],
      ["cli-runtime-commands-reject", "approved"],
      ["apps-cli-index-unchanged", "approved"]
    ]
  );
  assert.deepEqual(inventory.julesReviewDisposition.recommendedNextBoundary, {
    phase: "5.1",
    name: "Controlled Runtime Implementation Approval",
    summary:
      "Resolve runtime-implementation-approval and runtime-command-surface-review blockers before any guarded live loop or redacted writers.",
    runtimeEnablementAllowedByThisReview: false,
    runtimeImplementationAllowedByThisReview: false
  });

  assert.deepEqual(
    inventory.blockerDisposition.closedByJulesReview.map(
      ({ id, status, grantsRuntimeApproval, runtimeBehaviorIntroduced }) => [
        id,
        status,
        grantsRuntimeApproval,
        runtimeBehaviorIntroduced
      ]
    ),
    [["fresh-jules-or-devin-review", "closed-by-jules-approve", false, false]]
  );
  assert.deepEqual(
    inventory.blockerDisposition.stillOpenBeforeAnyImplementation.map(
      ({
        id,
        classification,
        status,
        requiredBeforeRuntimeEnablement,
        grantsRuntimeApproval,
        runtimeBehaviorIntroduced,
        nextPhase
      }) => [
        id,
        classification,
        status,
        requiredBeforeRuntimeEnablement,
        grantsRuntimeApproval,
        runtimeBehaviorIntroduced,
        nextPhase
      ]
    ),
    [
      [
        "runtime-implementation-approval",
        "must-fix-before-implementation",
        "open",
        true,
        false,
        false,
        "5.1"
      ],
      [
        "runtime-command-surface-review",
        "must-fix-before-command-surface",
        "open",
        true,
        false,
        false,
        "5.1"
      ],
      [
        "host-policy-runtime-enforcement",
        "must-fix-during-controlled-implementation",
        "open",
        true,
        false,
        false,
        "future-controlled-implementation"
      ],
      [
        "rollback-kill-switch",
        "must-fix-during-controlled-implementation",
        "open",
        true,
        false,
        false,
        "future-controlled-implementation"
      ]
    ]
  );
  assert.ok(
    inventory.blockerDisposition.mustRemainGuardedAfterImplementation.includes(
      "scope-bound-revocable-runtime-approval-grants"
    )
  );

  assert.equal(
    inventory.phase5Handoff.document,
    "docs/phase-5-1-controlled-runtime-implementation-approval-handoff.md"
  );
  assert.equal(inventory.phase5Handoff.nextPhase, "phase-5.1-controlled-runtime-implementation-approval");
  assert.equal(inventory.phase5Handoff.nextPhaseIsApprovalGateOnly, true);
  assert.equal(inventory.phase5Handoff.liveRuntimeImplementationAllowedByHandoff, false);
  assert.equal(inventory.phase5Handoff.runtimeEnablementAllowedByHandoff, false);
  assert.deepEqual(inventory.phase5Handoff.requiredApprovalRecordsBeforeRuntimeCommand, [
    "runtime-implementation-approval-record",
    "runtime-command-surface-review-record",
    "runtime-command-denied-by-default-policy-record",
    "operator-consent-scope-and-expiration-record",
    "rollback-and-kill-switch-design-record"
  ]);
  assert.ok(inventory.phase5Handoff.requiredDesignBeforeAnyLiveLoop.includes("bounded-stdin-loop-design"));
  assert.match(
    inventory.phase5Handoff.phase51Prompt,
    /Do not implement or enable a live runtime, CLI runtime command/
  );
  assert.match(
    inventory.phase5Handoff.phase51Prompt,
    /approval-boundary and runtime command-surface review artifacts only/
  );

  assert.deepEqual(
    inventory.docs.map(({ path, status }) => [path, status]),
    phase42DDocFiles.map((path) => [path, "present"])
  );
  assert.deepEqual(inventory.tests.map(({ path, status }) => [path, status]), [
    ["tests/report-phase-status.test.mjs", "present"],
    ["tests/phase4-2d-external-review-disposition-phase5-handoff.test.mjs", "present"],
    ["tests/phase4-2c-runtime-readiness-review-gate.test.mjs", "present"]
  ]);
  assert.deepEqual(inventory.cliSourceInventory.map(({ path, status }) => [path, status]), [
    ["apps/cli/src/index.mjs", "present"]
  ]);
  assert.deepEqual(inventory.ownershipBoundary.excludedCliRuntimeSourceFiles, [
    "apps/cli/src/index.mjs"
  ]);
  assert.equal(inventory.ownershipBoundary.cliSourceChangedByThisPhase, false);
  assert.equal(inventory.ownershipBoundary.appsCliIndexChangedByThisPhase, false);
  assert.equal(inventory.ownershipBoundary.reportRunsChecks, false);
  assert.equal(inventory.ownershipBoundary.separatePhase51ApprovalRequired, true);
  assert.equal(inventory.ownershipBoundary.separateRuntimeImplementationRequired, true);
  assert.equal(inventory.ownershipBoundary.separateRuntimeEnablementRequired, true);

  assert.deepEqual(
    inventory.runtimeLikeCommandRejectionProbes,
    phase42DRuntimeLikeCommandRejectionProbes
  );
  assertAllFalse(inventory.runtimeEffect);
  assert.ok(inventory.nonExecutionInvariants.includes("jules-approval-is-not-runtime-approval"));
  assert.ok(inventory.nonExecutionInvariants.includes("phase5-handoff-is-not-runtime-enablement"));
  assert.equal(inventory.nonExecutionInvariants.at(-1), "runtime-unavailable-by-construction");
  assert.equal(inventory.safetyPosture.julesReviewRecorded, true);
  assert.equal(inventory.safetyPosture.julesVerdictApproved, true);
  assert.equal(inventory.safetyPosture.externalReviewComplete, true);
  assert.equal(inventory.safetyPosture.phase5HandoffReady, true);
  assert.equal(inventory.safetyPosture.runtimeBlocked, true);
  assert.equal(inventory.safetyPosture.freshExternalReviewRan, true);
  assert.equal(inventory.safetyPosture.runtimeEnabled, false);
  assert.equal(inventory.safetyPosture.runtimeApproved, false);
  assert.equal(inventory.safetyPosture.runtimeImplementationApproved, false);
  assert.equal(inventory.safetyPosture.runtimeCommandSurfaceApproved, false);
  assert.equal(inventory.safetyPosture.noRuntimeCommand, true);
  assert.equal(inventory.safetyPosture.noRuntimeImplementationApprovalCommand, true);
  assert.equal(inventory.safetyPosture.noApprovalEvaluator, true);
  assert.equal(inventory.safetyPosture.noProcessControl, true);
  assert.equal(inventory.safetyPosture.noTranscriptWrite, true);
  assert.equal(inventory.safetyPosture.noFailureAuditWrite, true);
  assert.equal(report.safetyPosture.phase42DExternalReviewDispositionPhase5Handoff, true);
  assert.equal(report.safetyPosture.flags.phase42DJulesReviewRecorded, true);
  assert.equal(report.safetyPosture.flags.phase42DJulesReviewApproved, true);
  assert.equal(report.safetyPosture.flags.phase42DExternalReviewComplete, true);
  assert.equal(report.safetyPosture.flags.phase42DPhase5HandoffReady, true);
  assert.equal(report.safetyPosture.flags.phase42DRuntimeImplemented, false);
  assert.equal(report.safetyPosture.flags.phase42DRuntimeReady, false);
  assert.equal(report.safetyPosture.flags.phase42DRuntimeApproved, false);
  assert.equal(report.safetyPosture.flags.phase42DRuntimeImplementationApproved, false);
  assert.equal(report.safetyPosture.flags.phase42DRuntimeEnablementApproved, false);
  assert.equal(report.safetyPosture.flags.phase42DRuntimeCommandSurfaceApproved, false);
  assert.equal(report.safetyPosture.flags.phase42DRuntimeEnabled, false);
  assert.equal(report.safetyPosture.flags.phase42DRuntimeCommandEnabled, false);
  assert.equal(report.safetyPosture.flags.phase42DAppsCliIndexChanged, false);
  assert.equal(report.safetyPosture.flags.phase51RuntimeImplemented, false);
  assert.equal(report.safetyPosture.flags.phase51RuntimeEnabled, false);
  assert.equal(report.safetyPosture.flags.phase51RuntimeCommandEnabled, false);
  assert.equal(report.safetyPosture.flags.phase51ApprovalCommandEnabled, false);
  assert.equal(report.safetyPosture.flags.freshJulesReviewRan, true);
});

test("report inventories Phase 5.1 as approval to proceed with future implementation only", async () => {
  const report = await runReport();
  const inventory = report.phase51ControlledRuntimeImplementationApprovalInventory;

  assert.deepEqual(inventory.approvalLayer, {
    document: "docs/phase-5-1-controlled-runtime-implementation-approval-handoff.md",
    sourceDispositionDocument:
      "docs/phase-4-2d-external-review-disposition-phase5-handoff.md",
    approvalBoundaryFixture:
      "tests/fixtures/host-policy/phase5-1/controlled-runtime-implementation-approval-boundary.json",
    commandSurfaceReviewArtifact:
      "tests/fixtures/command-surface/phase5-1/runtime-command-surface-review-matrix.json",
    precedingPhase: "4.2D",
    layerId: "controlled-runtime-implementation-approval",
    scope: "approve-separate-future-implementation-phase-only-runtime-still-blocked",
    approvalRecordedForFutureImplementationPhase: true,
    runtimeImplementationInThisPhase: false,
    runtimeEnablementApproved: false,
    runtimeEnabled: false,
    runtimeCommandSurfaceEnabled: false,
    cliSourceChanged: false,
    appsCliIndexChanged: false,
    adapterRuntimeBehaviorChanged: false,
    contentFabricRuntimeBehaviorChanged: false,
    stdoutStderrWritersAdded: false,
    processControlAdded: false,
    transcriptAuditSideEffectsAdded: false,
    reportRunsChecks: false
  });

  assert.deepEqual(inventory.approvalBoundary, {
    fixture:
      "tests/fixtures/host-policy/phase5-1/controlled-runtime-implementation-approval-boundary.json",
    status: "approved-for-future-controlled-implementation-boundary-only",
    approvalRecordCreated: true,
    approvedToImplementNextSkeletonSlice: true,
    approvedNextSkeletonSliceRequiresSeparatePhase: true,
    grantsRuntimeEnablement: false,
    grantsRuntimeCommandExposure: false,
    grantsAdapterRuntimeBehavior: false,
    grantsContentFabricRuntimeBehavior: false,
    allowedNextWork: "separate-controlled-runtime-implementation-phase",
    requiredBeforeRuntimeEnablement: [
      "runtime-command-surface-review",
      "runtime-host-policy-enforcement",
      "rollback-and-kill-switch-review",
      "bounded-stdin-loop-design",
      "redacted-stdout-stderr-writer-design",
      "transcript-and-failure-audit-path-confinement",
      "approved-and-denied-runtime-smokes"
    ]
  });
  assert.deepEqual(inventory.commandSurfaceReview, {
    artifact:
      "tests/fixtures/command-surface/phase5-1/runtime-command-surface-review-matrix.json",
    status: "blocked",
    runtimeCommandSurfaceApproved: false,
    cliRuntimeCommandAdded: false,
    runtimeEnabled: false,
    candidateCommands: phase51RuntimeLikeCommandRejectionProbes
  });
  assert.deepEqual(inventory.sourceDisposition, {
    document: "docs/phase-4-2d-external-review-disposition-phase5-handoff.md",
    reviewer: "Jules",
    verdict: "APPROVE",
    externalReviewComplete: true,
    runtimeImplementationApprovedByDisposition: false,
    runtimeCommandSurfaceApprovedByDisposition: false,
    runtimeEnabledByDisposition: false
  });

  assert.deepEqual(
    inventory.docs.map(({ path, status }) => [path, status]),
    phase51DocFiles.map((path) => [path, "present"])
  );
  assert.deepEqual(inventory.crossLinks, phase51CrossLinks);
  assert.deepEqual(inventory.machineReadableArtifacts.map(({ path, status }) => [path, status]), [
    [
      "tests/fixtures/host-policy/phase5-1/controlled-runtime-implementation-approval-boundary.json",
      "present"
    ],
    [
      "tests/fixtures/command-surface/phase5-1/runtime-command-surface-review-matrix.json",
      "present"
    ]
  ]);
  assert.deepEqual(inventory.tests.map(({ path, status }) => [path, status]), [
    ["tests/report-phase-status.test.mjs", "present"],
    ["tests/phase5-1-controlled-runtime-implementation-approval-boundary.test.mjs", "present"],
    ["tests/phase5-1-command-surface-review.test.mjs", "present"]
  ]);
  assert.deepEqual(inventory.cliSourceInventory.map(({ path, status }) => [path, status]), [
    ["apps/cli/src/index.mjs", "present"]
  ]);
  assert.deepEqual(inventory.ownershipBoundary.docsStatusFiles, [
    "README.md",
    "apps/cli/README.md",
    "packages/core/README.md",
    "crates/ardyn-host/README.md",
    "docs/phase-4-2d-external-review-disposition-phase5-handoff.md",
    "docs/phase-5-1-controlled-runtime-implementation-approval-handoff.md",
    "scripts/report-phase-status.mjs",
    "tests/report-phase-status.test.mjs"
  ]);
  assert.deepEqual(inventory.ownershipBoundary.machineReadableArtifactFiles, [
    "tests/fixtures/host-policy/phase5-1/controlled-runtime-implementation-approval-boundary.json",
    "tests/fixtures/command-surface/phase5-1/runtime-command-surface-review-matrix.json"
  ]);
  assert.deepEqual(inventory.ownershipBoundary.excludedCliRuntimeSourceFiles, [
    "apps/cli/src/index.mjs"
  ]);
  assert.deepEqual(inventory.ownershipBoundary.excludedRustSourceFiles, [
    "crates/ardyn-host/src/lib.rs",
    "crates/ardyn-host/src/stdio_runtime/mod.rs"
  ]);
  assert.equal(inventory.ownershipBoundary.cliSourceChangedByThisPhase, false);
  assert.equal(inventory.ownershipBoundary.appsCliIndexChangedByThisPhase, false);
  assert.equal(inventory.ownershipBoundary.rustSourceChangedByThisPhase, false);
  assert.equal(inventory.ownershipBoundary.machineReadableApprovalFixtureChangedByThisPhase, true);
  assert.equal(inventory.ownershipBoundary.commandSurfaceReviewArtifactChangedByThisPhase, true);
  assert.equal(inventory.ownershipBoundary.reportRunsChecks, false);
  assert.equal(inventory.ownershipBoundary.separateImplementationPhaseRequired, true);
  assert.equal(inventory.ownershipBoundary.separateRuntimeEnablementRequired, true);

  assert.deepEqual(
    inventory.runtimeLikeCommandRejectionProbes,
    phase51RuntimeLikeCommandRejectionProbes
  );
  assertAllFalse(inventory.runtimeEffect);
  assert.deepEqual(inventory.nonExecutionInvariants, [
    "phase5-1-approval-is-for-a-separate-future-implementation-phase-only",
    "phase5-1-is-not-runtime-enablement",
    "runtime-command-surface-remains-blocked",
    "apps-cli-index-unchanged",
    "no-stdout-stderr-writers",
    "no-process-control",
    "no-transcript-or-audit-side-effects",
    "no-adapter-or-fabric-runtime-behavior"
  ]);
  assert.deepEqual(inventory.safetyPosture, {
    futureImplementationPhaseApproved: true,
    runtimeBlocked: true,
    runtimeEnabled: false,
    runtimeCommandEnabled: false,
    runtimeCommandSurfaceEnabled: false,
    runtimeImplementationInThisPhase: false,
    noRuntimeCommand: true,
    noRuntimeImplementationApprovalCommand: true,
    noApprovalEvaluator: true,
    noProcessControl: true,
    noStdoutStderrWriters: true,
    noTranscriptWrite: true,
    noFailureAuditWrite: true,
    noAdapterRuntimeBehavior: true,
    noContentFabricRuntimeBehavior: true
  });
  assert.equal(report.safetyPosture.phase51ControlledRuntimeImplementationApproval, true);
  assert.equal(report.safetyPosture.flags.phase51FutureImplementationPhaseApproved, true);
  assert.equal(report.safetyPosture.flags.phase51RuntimeImplementationInThisPhase, false);
  assert.equal(report.safetyPosture.flags.phase51RuntimeEnablementApproved, false);
  assert.equal(report.safetyPosture.flags.phase51RuntimeImplemented, false);
  assert.equal(report.safetyPosture.flags.phase51RuntimeEnabled, false);
  assert.equal(report.safetyPosture.flags.phase51RuntimeCommandEnabled, false);
  assert.equal(report.safetyPosture.flags.phase51RuntimeCommandSurfaceEnabled, false);
  assert.equal(report.safetyPosture.flags.phase51ApprovalCommandEnabled, false);
  assert.equal(report.safetyPosture.flags.phase51AppsCliIndexChanged, false);
  assert.equal(report.safetyPosture.flags.phase51ProcessControlEnabled, false);
  assert.equal(report.safetyPosture.flags.phase51StdoutStderrWritersEnabled, false);
  assert.equal(report.safetyPosture.flags.phase51TranscriptAuditSideEffectsEnabled, false);
  assert.equal(report.safetyPosture.flags.phase51AdapterRuntimeBehaviorEnabled, false);
  assert.equal(report.safetyPosture.flags.phase51ContentFabricRuntimeBehaviorEnabled, false);
});

test("report inventories Phase 5.2 as guarded implementation-slice status with runtime commands blocked", async () => {
  const report = await runReport();
  const inventory = report.phase52GuardedRuntimeImplementationSliceInventory;

  assert.deepEqual(inventory.statusLayer, {
    document: "docs/phase-5-2-guarded-runtime-implementation-slice.md",
    approvalSourceDocument:
      "docs/phase-5-1-controlled-runtime-implementation-approval-handoff.md",
    externalReviewSourceDocument:
      "docs/phase-4-2d-external-review-disposition-phase5-handoff.md",
    readinessSourceDocument: "docs/phase-4-2c-runtime-readiness-review-gate.md",
    precedingPhase: "5.1",
    layerId: "guarded-runtime-implementation-slice",
    scope: "guarded-private-rust-implementation-slice-runtime-enablement-blocked",
    implementationSliceStatusRecorded: true,
    runtimeImplementationMayExistBehindGuards: true,
    privateRustGuardedHelpersAdded: true,
    runtimeImplementationExposed: false,
    runtimeEnablementApproved: false,
    runtimeEnabled: false,
    runtimeCommandSurfaceEnabled: false,
    approvalGrantCreated: false,
    cliSourceChanged: false,
    appsCliIndexChanged: false,
    adapterRuntimeBehaviorChanged: false,
    contentFabricRuntimeBehaviorChanged: false,
    stdoutStderrWritersEnabled: false,
    processControlEnabled: false,
    transcriptAuditSideEffectsEnabled: false,
    reportRunsChecks: false
  });

  assert.deepEqual(
    inventory.docs.map(({ path, status }) => [path, status]),
    phase52DocFiles.map((path) => [path, "present"])
  );
  assert.deepEqual(inventory.crossLinks, phase52CrossLinks);
  assert.deepEqual(inventory.machineReadableArtifacts.map(({ path, status }) => [path, status]), [
    [
      "tests/fixtures/host-policy/phase5-2/guarded-runtime-default-blocked-boundary.json",
      "present"
    ],
    [
      "tests/fixtures/command-surface/phase5-2/runtime-command-rejection-matrix.json",
      "present"
    ]
  ]);
  assert.deepEqual(inventory.guardedRustHelpers, {
    source: "crates/ardyn-host/src/stdio_runtime/mod.rs",
    modulePubliclyExported: false,
    helpers: [
      "guarded_stdio_runtime_loop_budget",
      "plan_guarded_stdio_runtime_loop",
      "plan_guarded_redacted_writer",
      "plan_stdio_runtime_approval_boundary_from_fixture_json"
    ],
    liveStdinReads: false,
    liveStdoutStderrWrites: false,
    processControl: false,
    transcriptAuditWrites: false,
    approvalEvaluatorOrGrant: false
  });
  assert.deepEqual(inventory.tests.map(({ path, status }) => [path, status]), [
    ["tests/report-phase-status.test.mjs", "present"],
    ["tests/phase5-2-runtime-default-blocked.test.mjs", "present"]
  ]);
  assert.deepEqual(inventory.rustSourceInventory.map(({ path, status }) => [path, status]), [
    ["crates/ardyn-host/src/stdio_runtime/mod.rs", "present"],
    ["crates/ardyn-host/src/lib.rs", "present"]
  ]);
  assert.deepEqual(inventory.cliSourceInventory.map(({ path, status }) => [path, status]), [
    ["apps/cli/src/index.mjs", "present"]
  ]);
  assert.deepEqual(inventory.ownershipBoundary.docsStatusFiles, [
    "README.md",
    "apps/cli/README.md",
    "packages/core/README.md",
    "crates/ardyn-host/README.md",
    "docs/phase-4-2c-runtime-readiness-review-gate.md",
    "docs/phase-4-2d-external-review-disposition-phase5-handoff.md",
    "docs/phase-5-1-controlled-runtime-implementation-approval-handoff.md",
    "docs/phase-5-2-guarded-runtime-implementation-slice.md",
    "docs/phase-5-3-command-surface-approval-preflight.md",
    "scripts/report-phase-status.mjs",
    "tests/report-phase-status.test.mjs"
  ]);
  assert.deepEqual(inventory.ownershipBoundary.machineReadableArtifactFiles, [
    "tests/fixtures/host-policy/phase5-2/guarded-runtime-default-blocked-boundary.json",
    "tests/fixtures/command-surface/phase5-2/runtime-command-rejection-matrix.json"
  ]);
  assert.deepEqual(inventory.ownershipBoundary.focusedTestFiles, [
    "tests/phase5-2-runtime-default-blocked.test.mjs",
    "tests/report-phase-status.test.mjs"
  ]);
  assert.deepEqual(inventory.ownershipBoundary.rustSourceFiles, [
    "crates/ardyn-host/src/stdio_runtime/mod.rs"
  ]);
  assert.deepEqual(inventory.ownershipBoundary.excludedCliRuntimeSourceFiles, [
    "apps/cli/src/index.mjs"
  ]);
  assert.equal(inventory.ownershipBoundary.cliSourceChangedByThisPhase, false);
  assert.equal(inventory.ownershipBoundary.appsCliIndexChangedByThisPhase, false);
  assert.equal(inventory.ownershipBoundary.rustSourceChangedByThisPhase, true);
  assert.equal(inventory.ownershipBoundary.machineReadableArtifactsChangedByThisPhase, true);
  assert.equal(inventory.ownershipBoundary.reportRunsChecks, false);
  assert.equal(inventory.ownershipBoundary.separateRuntimeCommandSurfaceApprovalRequired, true);
  assert.equal(inventory.ownershipBoundary.separateRuntimeEnablementRequired, true);
  assert.deepEqual(inventory.approvalBoundaryFixture, {
    fixture: "tests/fixtures/host-policy/phase5-2/guarded-runtime-default-blocked-boundary.json",
    schema: "ardyn.phase-5.2.guarded-runtime-default-blocked-boundary",
    status: "blocked_by_default",
    runtimeBlocked: true,
    approvalBoundaryRequired: true,
    approvalGrantCreated: false,
    commandSurfaceExists: false
  });
  assert.deepEqual(inventory.commandSurfaceRejectionMatrix, {
    fixture: "tests/fixtures/command-surface/phase5-2/runtime-command-rejection-matrix.json",
    schema: "ardyn.phase-5.2.runtime-command-rejection-matrix",
    status: "blocked",
    candidateCommands: phase52RuntimeLikeCommandRejectionProbes,
    stdoutExpectation: "empty",
    stderrPrefix: "Usage: ardyn ",
    scratchDirectoryWrites: "none"
  });

  assert.deepEqual(
    inventory.runtimeLikeCommandRejectionProbes,
    phase52RuntimeLikeCommandRejectionProbes
  );
  assertAllFalse(inventory.runtimeEffect);
  assert.deepEqual(inventory.nonExecutionInvariants, [
    "phase5-2-private-rust-guarded-planning-only",
    "runtime-enablement-remains-blocked",
    "runtime-command-surface-remains-blocked",
    "apps-cli-index-unchanged",
    "no-approval-command",
    "no-live-stdin-stdout-stderr-or-process-control",
    "no-adapter-or-fabric-runtime-behavior"
  ]);
  assert.deepEqual(inventory.safetyPosture, {
    guardedImplementationSliceStatusRecorded: true,
    runtimeBlocked: true,
    runtimeEnabled: false,
    runtimeCommandEnabled: false,
    runtimeCommandSurfaceEnabled: false,
    runtimeEnablementApproved: false,
    noRuntimeCommand: true,
    noApprovalCommand: true,
    noProcessControl: true,
    noStdoutStderrWriters: true,
    noTranscriptWrite: true,
    noFailureAuditWrite: true,
    noAdapterRuntimeBehavior: true,
    noContentFabricRuntimeBehavior: true
  });
  assert.equal(report.safetyPosture.phase52GuardedRuntimeImplementationSlice, true);
  assert.equal(report.safetyPosture.flags.phase52GuardedImplementationSliceStatusRecorded, true);
  assert.equal(report.safetyPosture.flags.phase52RuntimeEnablementApproved, false);
  assert.equal(report.safetyPosture.flags.phase52RuntimeEnabled, false);
  assert.equal(report.safetyPosture.flags.phase52RuntimeCommandEnabled, false);
  assert.equal(report.safetyPosture.flags.phase52RuntimeCommandSurfaceEnabled, false);
  assert.equal(report.safetyPosture.flags.phase52ApprovalCommandEnabled, false);
  assert.equal(report.safetyPosture.flags.phase52AppsCliIndexChanged, false);
  assert.equal(report.safetyPosture.flags.phase52ProcessControlEnabled, false);
  assert.equal(report.safetyPosture.flags.phase52StdoutStderrWritersEnabled, false);
  assert.equal(report.safetyPosture.flags.phase52TranscriptAuditSideEffectsEnabled, false);
  assert.equal(report.safetyPosture.flags.phase52AdapterRuntimeBehaviorEnabled, false);
  assert.equal(report.safetyPosture.flags.phase52ContentFabricRuntimeBehaviorEnabled, false);
});

test("report inventories Phase 5.3 as command-surface approval preflight with runtime commands blocked", async () => {
  const report = await runReport();
  const inventory = report.phase53CommandSurfaceApprovalPreflightInventory;

  assert.deepEqual(inventory.statusLayer, {
    document: "docs/phase-5-3-command-surface-approval-preflight.md",
    guardedImplementationSourceDocument:
      "docs/phase-5-2-guarded-runtime-implementation-slice.md",
    approvalSourceDocument:
      "docs/phase-5-1-controlled-runtime-implementation-approval-handoff.md",
    precedingPhase: "5.2",
    layerId: "command-surface-approval-preflight",
    scope: "docs-status-command-surface-preflight-runtime-enablement-blocked",
    commandSurfacePreflightRecorded: true,
    futureCommandContractDocumented: true,
    futureReviewPacketDocumented: true,
    runtimeCommandSurfaceApproved: false,
    runtimeCommandSurfaceEnabled: false,
    runtimeEnablementApproved: false,
    runtimeEnabled: false,
    approvalCommandEnabled: false,
    cliSourceChanged: false,
    appsCliIndexChanged: false,
    rustSourceChanged: false,
    adapterRuntimeBehaviorChanged: false,
    contentFabricRuntimeBehaviorChanged: false,
    stdoutStderrWritersEnabled: false,
    processControlEnabled: false,
    transcriptAuditSideEffectsEnabled: false,
    reportRunsChecks: false
  });

  assert.deepEqual(
    inventory.docs.map(({ path, status }) => [path, status]),
    phase53DocFiles.map((path) => [path, "present"])
  );
  assert.deepEqual(inventory.crossLinks, phase53CrossLinks);
  assertKnownInventoryStatuses(inventory.machineReadableArtifacts);
  assert.deepEqual(inventory.machineReadableArtifacts.map(({ path }) => path), [
    "tests/fixtures/command-surface/phase5-3/command-surface-approval-preflight.json"
  ]);
  assertKnownInventoryStatuses(inventory.tests);
  assert.deepEqual(inventory.tests.map(({ path }) => path), [
    "tests/report-phase-status.test.mjs",
    "tests/phase5-3-command-surface-preflight.test.mjs"
  ]);
  assert.deepEqual(inventory.cliSourceInventory.map(({ path, status }) => [path, status]), [
    ["apps/cli/src/index.mjs", "present"]
  ]);
  assert.deepEqual(inventory.ownershipBoundary.docsStatusFiles, [
    "README.md",
    "apps/cli/README.md",
    "crates/ardyn-host/README.md",
    "docs/phase-5-1-controlled-runtime-implementation-approval-handoff.md",
    "docs/phase-5-2-guarded-runtime-implementation-slice.md",
    "docs/phase-5-3-command-surface-approval-preflight.md",
    "scripts/report-phase-status.mjs",
    "tests/report-phase-status.test.mjs"
  ]);
  assert.deepEqual(inventory.ownershipBoundary.machineReadableArtifactFiles, [
    "tests/fixtures/command-surface/phase5-3/command-surface-approval-preflight.json"
  ]);
  assert.deepEqual(inventory.ownershipBoundary.focusedTestFiles, [
    "tests/phase5-3-command-surface-preflight.test.mjs",
    "tests/report-phase-status.test.mjs"
  ]);
  assert.deepEqual(inventory.ownershipBoundary.excludedCliRuntimeSourceFiles, [
    "apps/cli/src/index.mjs"
  ]);
  assert.equal(inventory.ownershipBoundary.cliSourceChangedByThisPhase, false);
  assert.equal(inventory.ownershipBoundary.appsCliIndexChangedByThisPhase, false);
  assert.equal(inventory.ownershipBoundary.rustSourceChangedByThisPhase, false);
  assert.equal(inventory.ownershipBoundary.machineReadableArtifactsChangedByThisPhase, true);
  assert.equal(inventory.ownershipBoundary.reportRunsChecks, false);
  assert.equal(inventory.ownershipBoundary.separateRuntimeCommandSurfaceApprovalRequired, true);
  assert.equal(inventory.ownershipBoundary.separateRuntimeEnablementRequired, true);
  assert.deepEqual(inventory.commandSurfaceApprovalPreflight, {
    fixture: "tests/fixtures/command-surface/phase5-3/command-surface-approval-preflight.json",
    status: inventory.commandSurfaceApprovalPreflight.status,
    runtimeCommandSurfaceApproved: false,
    runtimeCommandSurfaceEnabled: false,
    runtimeEnabled: false,
    approvalCommandEnabled: false,
    appsCliIndexChanged: false
  });
  assert.match(inventory.commandSurfaceApprovalPreflight.status, /^(present|missing)$/);
  assert.deepEqual(inventory.futureCommandContractRequiredFields, [
    "exact-command-names-and-aliases",
    "denied-by-default-behavior",
    "approval-grant-scope-expiration-revocation-audit",
    "host-policy-enforcement-points",
    "stdout-jsonl-and-stderr-diagnostic-ownership",
    "transcript-and-failure-audit-write-confinement",
    "rollback-kill-switch-and-terminal-state-behavior",
    "approved-and-denied-cli-smokes"
  ]);
  assert.deepEqual(inventory.futureReviewPacketRequiredIfCommandExposureIsProposed, [
    "exact-command-surface-diff",
    "phase-5-3-preflight-fixture",
    "focused-denied-path-tests",
    "focused-approved-path-tests",
    "apps-cli-index-change-evidence",
    "runtime-enablements-separated-from-adapter-locus-mcp-openclaw-plugin-http-and-fabric"
  ]);
  assertAllFalse(inventory.runtimeEffect);
  assert.deepEqual(inventory.nonExecutionInvariants, [
    "phase5-3-command-surface-preflight-only",
    "runtime-enablement-remains-blocked",
    "runtime-command-surface-remains-blocked",
    "apps-cli-index-unchanged",
    "no-approval-command",
    "no-live-stdin-stdout-stderr-or-process-control",
    "no-adapter-or-fabric-runtime-behavior"
  ]);
  assert.deepEqual(inventory.safetyPosture, {
    commandSurfacePreflightRecorded: true,
    futureCommandContractDocumented: true,
    futureReviewPacketDocumented: true,
    runtimeBlocked: true,
    runtimeEnabled: false,
    runtimeCommandEnabled: false,
    runtimeCommandSurfaceEnabled: false,
    runtimeCommandSurfaceApproved: false,
    runtimeEnablementApproved: false,
    noRuntimeCommand: true,
    noApprovalCommand: true,
    noProcessControl: true,
    noStdoutStderrWriters: true,
    noTranscriptWrite: true,
    noFailureAuditWrite: true,
    noAdapterRuntimeBehavior: true,
    noContentFabricRuntimeBehavior: true
  });
  assert.equal(report.safetyPosture.phase53CommandSurfaceApprovalPreflight, true);
  assert.equal(report.safetyPosture.flags.phase53CommandSurfacePreflightRecorded, true);
  assert.equal(report.safetyPosture.flags.phase53FutureCommandContractDocumented, true);
  assert.equal(report.safetyPosture.flags.phase53FutureReviewPacketDocumented, true);
  assert.equal(report.safetyPosture.flags.phase53RuntimeEnablementApproved, false);
  assert.equal(report.safetyPosture.flags.phase53RuntimeEnabled, false);
  assert.equal(report.safetyPosture.flags.phase53RuntimeCommandEnabled, false);
  assert.equal(report.safetyPosture.flags.phase53RuntimeCommandSurfaceApproved, false);
  assert.equal(report.safetyPosture.flags.phase53RuntimeCommandSurfaceEnabled, false);
  assert.equal(report.safetyPosture.flags.phase53ApprovalCommandEnabled, false);
  assert.equal(report.safetyPosture.flags.phase53AppsCliIndexChanged, false);
  assert.equal(report.safetyPosture.flags.phase53ProcessControlEnabled, false);
  assert.equal(report.safetyPosture.flags.phase53StdoutStderrWritersEnabled, false);
  assert.equal(report.safetyPosture.flags.phase53TranscriptAuditSideEffectsEnabled, false);
  assert.equal(report.safetyPosture.flags.phase53AdapterRuntimeBehaviorEnabled, false);
  assert.equal(report.safetyPosture.flags.phase53ContentFabricRuntimeBehaviorEnabled, false);
});

test("report inventories Phase 5.4 as disabled command exposure plan with runtime commands blocked", async () => {
  const report = await runReport();
  const inventory = report.phase54DisabledCommandExposurePlanInventory;

  assert.deepEqual(inventory.statusLayer, {
    document: "docs/phase-5-4-disabled-command-exposure-plan.md",
    commandSurfacePreflightSourceDocument:
      "docs/phase-5-3-command-surface-approval-preflight.md",
    guardedImplementationSourceDocument:
      "docs/phase-5-2-guarded-runtime-implementation-slice.md",
    approvalSourceDocument:
      "docs/phase-5-1-controlled-runtime-implementation-approval-handoff.md",
    precedingPhase: "5.3",
    layerId: "disabled-command-exposure-plan",
    scope: "docs-status-disabled-command-exposure-plan-runtime-enablement-blocked",
    disabledCommandExposurePlanRecorded: true,
    futureCliImplementationChecklistDocumented: true,
    julesDevinReviewPacketDocumented: true,
    rollbackPlanDocumented: true,
    commandSurfaceDiffRiskNotesDocumented: true,
    runtimeCommandExposureApproved: false,
    runtimeCommandSurfaceApproved: false,
    runtimeCommandSurfaceEnabled: false,
    runtimeEnablementApproved: false,
    runtimeEnabled: false,
    approvalCommandEnabled: false,
    cliSourceChanged: false,
    appsCliIndexChanged: false,
    rustSourceChanged: false,
    adapterRuntimeBehaviorChanged: false,
    contentFabricRuntimeBehaviorChanged: false,
    stdoutStderrWritersEnabled: false,
    processControlEnabled: false,
    transcriptAuditSideEffectsEnabled: false,
    reportRunsChecks: false
  });

  assert.deepEqual(
    inventory.docs.map(({ path, status }) => [path, status]),
    phase54DocFiles.map((path) => [path, "present"])
  );
  assert.deepEqual(inventory.crossLinks, phase54CrossLinks);
  assertKnownInventoryStatuses(inventory.machineReadableArtifacts);
  assert.deepEqual(inventory.machineReadableArtifacts.map(({ path }) => path), [
    "tests/fixtures/command-surface/phase5-4/disabled-command-exposure-plan.json"
  ]);
  assertKnownInventoryStatuses(inventory.tests);
  assert.deepEqual(inventory.tests.map(({ path }) => path), [
    "tests/report-phase-status.test.mjs",
    "tests/phase5-4-disabled-command-exposure-plan.test.mjs"
  ]);
  assert.deepEqual(inventory.cliSourceInventory.map(({ path, status }) => [path, status]), [
    ["apps/cli/src/index.mjs", "present"]
  ]);
  assert.deepEqual(inventory.ownershipBoundary.docsStatusFiles, [
    "README.md",
    "apps/cli/README.md",
    "crates/ardyn-host/README.md",
    "docs/phase-5-1-controlled-runtime-implementation-approval-handoff.md",
    "docs/phase-5-2-guarded-runtime-implementation-slice.md",
    "docs/phase-5-3-command-surface-approval-preflight.md",
    "docs/phase-5-4-disabled-command-exposure-plan.md",
    "scripts/report-phase-status.mjs",
    "tests/report-phase-status.test.mjs"
  ]);
  assert.deepEqual(inventory.ownershipBoundary.machineReadableArtifactFiles, [
    "tests/fixtures/command-surface/phase5-4/disabled-command-exposure-plan.json"
  ]);
  assert.deepEqual(inventory.ownershipBoundary.focusedTestFiles, [
    "tests/phase5-4-disabled-command-exposure-plan.test.mjs",
    "tests/report-phase-status.test.mjs"
  ]);
  assert.deepEqual(inventory.ownershipBoundary.excludedCliRuntimeSourceFiles, [
    "apps/cli/src/index.mjs"
  ]);
  assert.equal(inventory.ownershipBoundary.cliSourceChangedByThisPhase, false);
  assert.equal(inventory.ownershipBoundary.appsCliIndexChangedByThisPhase, false);
  assert.equal(inventory.ownershipBoundary.rustSourceChangedByThisPhase, false);
  assert.equal(inventory.ownershipBoundary.machineReadableArtifactsChangedByThisPhase, true);
  assert.equal(inventory.ownershipBoundary.reportRunsChecks, false);
  assert.equal(inventory.ownershipBoundary.separateRuntimeCommandSurfaceApprovalRequired, true);
  assert.equal(inventory.ownershipBoundary.separateRuntimeEnablementRequired, true);
  assert.deepEqual(inventory.futureCliImplementationChecklist, [
    "exact-command-names-aliases-and-help-text",
    "deny-by-default-before-file-reads-or-runtime-work",
    "approval-record-validation-expiration-revocation-and-scope",
    "host-policy-enforcement-points-for-approved-and-denied-paths",
    "bounded-stdin-loop-and-jsonl-stdout-writer-ownership",
    "redacted-stderr-diagnostics-and-line-integrity-fail-closed",
    "transcript-and-failure-audit-path-confinement",
    "positive-and-negative-cli-smokes-for-approved-denied-malformed-expired-and-revoked-records",
    "rollback-kill-switch-and-terminal-state-proof"
  ]);
  assert.deepEqual(inventory.reviewPacketRequiredIfExposureIsProposed, [
    "jules-devin-review-summary",
    "exact-command-surface-diff",
    "apps-cli-index-change-evidence",
    "rust-host-public-surface-diff",
    "phase-5-3-preflight-and-phase-5-4-plan-links",
    "denied-path-test-output",
    "approved-path-test-output",
    "rollback-plan-and-kill-switch-evidence",
    "adapter-locus-mcp-openclaw-plugin-http-and-fabric-non-goals"
  ]);
  assert.deepEqual(inventory.rollbackPlanRequiredIfExposureIsProposed, [
    "single-flag-disable-runtime-command-surface",
    "remove-or-disable-cli-command-registration",
    "revert-public-rust-runtime-export-if-added",
    "preserve-denied-path-error-shape-and-empty-stdout",
    "record-terminal-aborted-or-rejected-state",
    "retain-transcript-and-failure-audit-confinement",
    "run-denied-path-smokes-after-rollback"
  ]);
  assert.deepEqual(inventory.commandSurfaceDiffRiskNotes, [
    "new-cli-command-registration-could-accidentally-create-runtime-exposure",
    "help-text-or-aliases-could-advertise-disabled-commands-as-available",
    "approval-evaluator-wiring-could-confuse-implementation-approval-with-enable-runtime-approval",
    "stdout-stderr-writer-ownership-could-bypass-redaction-or-jsonl-framing",
    "transcript-or-failure-audit-writes-could-create-side-effects-before-approval",
    "adapter-locus-mcp-openclaw-plugin-http-or-fabric-wiring-could-expand-scope"
  ]);
  assert.deepEqual(inventory.disabledCommandExposurePlan, {
    document: "docs/phase-5-4-disabled-command-exposure-plan.md",
    fixture: "tests/fixtures/command-surface/phase5-4/disabled-command-exposure-plan.json",
    schema: "ardyn.phase-5.4.disabled-command-exposure-plan",
    phase: "phase-5.4-disabled-command-exposure-plan",
    fixtureStatus: "present",
    status: "planned_disabled_unavailable",
    commandExposedToday: false,
    futureCandidateCommandCount: 18,
    runtimeCommandExposureApproved: false,
    runtimeCommandSurfaceApproved: false,
    runtimeCommandSurfaceEnabled: false,
    runtimeEnabled: false,
    approvalCommandEnabled: false,
    appsCliIndexChanged: false,
    rustSourceChanged: false,
    machineReadableArtifactsChanged: true
  });
  assertAllFalse(inventory.runtimeEffect);
  assert.deepEqual(inventory.nonExecutionInvariants, [
    "phase5-4-disabled-command-exposure-plan-only",
    "runtime-enablement-remains-blocked",
    "runtime-command-exposure-remains-blocked",
    "runtime-command-surface-remains-blocked",
    "apps-cli-index-unchanged",
    "no-approval-command",
    "no-live-stdin-stdout-stderr-or-process-control",
    "no-adapter-or-fabric-runtime-behavior"
  ]);
  assert.deepEqual(inventory.safetyPosture, {
    disabledCommandExposurePlanRecorded: true,
    futureCliImplementationChecklistDocumented: true,
    julesDevinReviewPacketDocumented: true,
    rollbackPlanDocumented: true,
    commandSurfaceDiffRiskNotesDocumented: true,
    runtimeBlocked: true,
    runtimeEnabled: false,
    runtimeCommandEnabled: false,
    runtimeCommandExposureApproved: false,
    runtimeCommandSurfaceEnabled: false,
    runtimeCommandSurfaceApproved: false,
    runtimeEnablementApproved: false,
    noRuntimeCommand: true,
    noApprovalCommand: true,
    noProcessControl: true,
    noStdoutStderrWriters: true,
    noTranscriptWrite: true,
    noFailureAuditWrite: true,
    noAdapterRuntimeBehavior: true,
    noContentFabricRuntimeBehavior: true
  });
  assert.equal(report.safetyPosture.phase54DisabledCommandExposurePlan, true);
  assert.equal(report.safetyPosture.flags.phase54DisabledCommandExposurePlanRecorded, true);
  assert.equal(report.safetyPosture.flags.phase54FutureCliImplementationChecklistDocumented, true);
  assert.equal(report.safetyPosture.flags.phase54JulesDevinReviewPacketDocumented, true);
  assert.equal(report.safetyPosture.flags.phase54RollbackPlanDocumented, true);
  assert.equal(report.safetyPosture.flags.phase54CommandSurfaceDiffRiskNotesDocumented, true);
  assert.equal(report.safetyPosture.flags.phase54RuntimeEnablementApproved, false);
  assert.equal(report.safetyPosture.flags.phase54RuntimeEnabled, false);
  assert.equal(report.safetyPosture.flags.phase54RuntimeCommandEnabled, false);
  assert.equal(report.safetyPosture.flags.phase54RuntimeCommandExposureApproved, false);
  assert.equal(report.safetyPosture.flags.phase54RuntimeCommandSurfaceApproved, false);
  assert.equal(report.safetyPosture.flags.phase54RuntimeCommandSurfaceEnabled, false);
  assert.equal(report.safetyPosture.flags.phase54ApprovalCommandEnabled, false);
  assert.equal(report.safetyPosture.flags.phase54AppsCliIndexChanged, false);
  assert.equal(report.safetyPosture.flags.phase54RustSourceChanged, false);
  assert.equal(report.safetyPosture.flags.phase54ProcessControlEnabled, false);
  assert.equal(report.safetyPosture.flags.phase54StdoutStderrWritersEnabled, false);
  assert.equal(report.safetyPosture.flags.phase54TranscriptAuditSideEffectsEnabled, false);
  assert.equal(report.safetyPosture.flags.phase54AdapterRuntimeBehaviorEnabled, false);
  assert.equal(report.safetyPosture.flags.phase54ContentFabricRuntimeBehaviorEnabled, false);
});

test("report inventories Phase 5.4A as Jules review disposition with runtime commands blocked", async () => {
  const report = await runReport();
  const inventory = report.phase54AJulesReviewDispositionInventory;

  assert.deepEqual(inventory.statusLayer, {
    document: "docs/phase-5-4a-jules-review-disposition.md",
    reviewedPhaseDocument: "docs/phase-5-4-disabled-command-exposure-plan.md",
    commandSurfacePreflightSourceDocument:
      "docs/phase-5-3-command-surface-approval-preflight.md",
    guardedImplementationSourceDocument:
      "docs/phase-5-2-guarded-runtime-implementation-slice.md",
    approvalSourceDocument:
      "docs/phase-5-1-controlled-runtime-implementation-approval-handoff.md",
    precedingPhase: "5.4",
    layerId: "jules-review-disposition",
    scope: "docs-status-jules-review-disposition-runtime-enablement-blocked",
    julesReviewDispositionRecorded: true,
    julesVerdictApproved: true,
    requestChanges: false,
    accidentalCommandRuntimeExposureFound: false,
    testsSufficientBeforeNextDefaultBlockedCliImplementation: true,
    mayProceedToNextStillDefaultBlockedCliCommandImplementationPhase: true,
    runtimeCommandExposureApproved: false,
    runtimeCommandSurfaceApproved: false,
    runtimeCommandSurfaceEnabled: false,
    runtimeEnablementApproved: false,
    runtimeEnabled: false,
    approvalCommandEnabled: false,
    cliSourceChanged: false,
    appsCliIndexChanged: false,
    chmodCorrectionNeeded: false,
    chmodCorrectionApplied: false,
    appsCliIndexExpectedMode: "100644",
    appsCliIndexModeOnCurrentMain: "100644",
    rustSourceChanged: false,
    adapterRuntimeBehaviorChanged: false,
    contentFabricRuntimeBehaviorChanged: false,
    stdoutStderrWritersEnabled: false,
    processControlEnabled: false,
    transcriptAuditSideEffectsEnabled: false,
    reportRunsChecks: false
  });

  assert.deepEqual(
    inventory.docs.map(({ path, status }) => [path, status]),
    phase54ADocFiles.map((path) => [path, "present"])
  );
  assert.deepEqual(inventory.crossLinks, phase54ACrossLinks);
  assertKnownInventoryStatuses(inventory.machineReadableArtifacts);
  assert.deepEqual(inventory.machineReadableArtifacts.map(({ path }) => path), [
    "tests/fixtures/command-surface/phase5-4a/jules-review-disposition.json"
  ]);
  assertKnownInventoryStatuses(inventory.tests);
  assert.deepEqual(inventory.tests.map(({ path }) => path), [
    "tests/report-phase-status.test.mjs",
    "tests/phase5-4a-jules-review-disposition.test.mjs",
    "tests/phase5-4-disabled-command-exposure-plan.test.mjs"
  ]);
  assert.deepEqual(inventory.cliSourceInventory.map(({ path, status }) => [path, status]), [
    ["apps/cli/src/index.mjs", "present"]
  ]);
  assert.deepEqual(inventory.ownershipBoundary.docsStatusFiles, [
    "README.md",
    "apps/cli/README.md",
    "crates/ardyn-host/README.md",
    "docs/phase-5-1-controlled-runtime-implementation-approval-handoff.md",
    "docs/phase-5-2-guarded-runtime-implementation-slice.md",
    "docs/phase-5-3-command-surface-approval-preflight.md",
    "docs/phase-5-4-disabled-command-exposure-plan.md",
    "docs/phase-5-4a-jules-review-disposition.md",
    "scripts/report-phase-status.mjs",
    "tests/report-phase-status.test.mjs"
  ]);
  assert.deepEqual(inventory.ownershipBoundary.machineReadableArtifactFiles, [
    "tests/fixtures/command-surface/phase5-4a/jules-review-disposition.json"
  ]);
  assert.deepEqual(inventory.ownershipBoundary.focusedTestFiles, [
    "tests/phase5-4a-jules-review-disposition.test.mjs",
    "tests/report-phase-status.test.mjs"
  ]);
  assert.deepEqual(inventory.ownershipBoundary.excludedCliRuntimeSourceFiles, [
    "apps/cli/src/index.mjs"
  ]);
  assert.equal(inventory.ownershipBoundary.cliSourceChangedByThisPhase, false);
  assert.equal(inventory.ownershipBoundary.appsCliIndexChangedByThisPhase, false);
  assert.equal(inventory.ownershipBoundary.chmodCorrectionNeededByThisPhase, false);
  assert.equal(inventory.ownershipBoundary.chmodCorrectionAppliedByThisPhase, false);
  assert.equal(inventory.ownershipBoundary.rustSourceChangedByThisPhase, false);
  assert.equal(inventory.ownershipBoundary.machineReadableArtifactsChangedByThisPhase, true);
  assert.equal(inventory.ownershipBoundary.reportRunsChecks, false);
  assert.equal(inventory.ownershipBoundary.separateRuntimeCommandSurfaceApprovalRequired, true);
  assert.equal(inventory.ownershipBoundary.separateRuntimeEnablementRequired, true);
  assert.deepEqual(inventory.julesReviewDisposition, {
    document: "docs/phase-5-4a-jules-review-disposition.md",
    fixture: "tests/fixtures/command-surface/phase5-4a/jules-review-disposition.json",
    schema: "ardyn.phase-5.4a.jules-review-disposition",
    phase: "phase-5.4a-jules-review-disposition",
    fixtureStatus: "present",
    reviewer: "Jules",
    verdict: "APPROVE",
    approved: true,
    requestChanges: false,
    reviewedPhase: "phase-5.4-disabled-command-exposure-plan",
    reviewedBranch: "codex/phase-5-4-disabled-command-exposure-plan",
    reviewedCommit: "60176ca83afe1fcd11dc303b557e8a468ed3b3c0",
    accidentalCommandRuntimeExposureFound: false,
    appsCliIndexContentIdenticalToBase: true,
    runtimeRemainsBlocked: true,
    commandExposureRemainsBlocked: true,
    testsSufficientBeforeNextDefaultBlockedCliImplementation: true,
    mayProceedToNextStillDefaultBlockedCliCommandImplementationPhase: true
  });
  assert.deepEqual(inventory.modeReview, {
    path: "apps/cli/src/index.mjs",
    expectedMode: "100644",
    modeOnCurrentMain: "100644",
    chmodCorrectionNeededOnCurrentMain: false,
    chmodCorrectionAppliedByPhase54A: false,
    contentChangedByPhase54A: false
  });
  assert.deepEqual(inventory.blockedCommandProbeNames, [
    "serve-runtime",
    "stdio-runtime",
    "replay-session-transcript",
    "external-review-packet",
    "review-packet",
    "runtime-readiness-review",
    "grant-runtime",
    "runtime-implementation-approval",
    "disabled-command-exposure-plan",
    "phase-5-4-disabled-command-exposure-plan",
    "runtime-command-exposure-plan",
    "expose-runtime-commands",
    "runtime-command-exposure-review",
    "jules-review-disposition",
    "phase-5-4a-jules-review-disposition",
    "runtime-review-disposition"
  ]);
  assertAllFalse(inventory.runtimeEffect);
  assert.deepEqual(inventory.nonExecutionInvariants, [
    "phase5-4a-review-disposition-only",
    "runtime-enablement-remains-blocked",
    "runtime-command-exposure-remains-blocked",
    "runtime-command-surface-remains-blocked",
    "apps-cli-index-content-unchanged",
    "apps-cli-index-mode-is-100644",
    "no-approval-command",
    "no-live-stdin-stdout-stderr-or-process-control",
    "no-transcript-or-audit-runtime-side-effects",
    "no-adapter-or-fabric-runtime-behavior"
  ]);
  assert.deepEqual(inventory.safetyPosture, {
    julesReviewDispositionRecorded: true,
    julesVerdictApproved: true,
    requestChanges: false,
    accidentalCommandRuntimeExposureFound: false,
    testsSufficientBeforeNextDefaultBlockedCliImplementation: true,
    mayProceedToNextStillDefaultBlockedCliCommandImplementationPhase: true,
    runtimeBlocked: true,
    commandExposureBlocked: true,
    runtimeEnabled: false,
    runtimeCommandEnabled: false,
    runtimeCommandExposureApproved: false,
    runtimeCommandSurfaceEnabled: false,
    runtimeCommandSurfaceApproved: false,
    runtimeEnablementApproved: false,
    noRuntimeCommand: true,
    noApprovalCommand: true,
    noProcessControl: true,
    noStdoutStderrWriters: true,
    noTranscriptWrite: true,
    noFailureAuditWrite: true,
    noAdapterRuntimeBehavior: true,
    noContentFabricRuntimeBehavior: true,
    noCliSourceContentChange: true,
    appsCliIndexMode100644: true,
    chmodCorrectionNeeded: false,
    chmodCorrectionApplied: false
  });
  assert.equal(report.safetyPosture.phase54AJulesReviewDisposition, true);
  assert.equal(report.safetyPosture.flags.phase54AJulesReviewDispositionRecorded, true);
  assert.equal(report.safetyPosture.flags.phase54AJulesReviewApproved, true);
  assert.equal(report.safetyPosture.flags.phase54ARequestChanges, false);
  assert.equal(report.safetyPosture.flags.phase54AAccidentalCommandRuntimeExposureFound, false);
  assert.equal(
    report.safetyPosture.flags.phase54ATestsSufficientBeforeNextDefaultBlockedCliImplementation,
    true
  );
  assert.equal(
    report.safetyPosture.flags.phase54AMayProceedToNextStillDefaultBlockedCliCommandImplementationPhase,
    true
  );
  assert.equal(report.safetyPosture.flags.phase54ARuntimeEnablementApproved, false);
  assert.equal(report.safetyPosture.flags.phase54ARuntimeEnabled, false);
  assert.equal(report.safetyPosture.flags.phase54ARuntimeCommandEnabled, false);
  assert.equal(report.safetyPosture.flags.phase54ARuntimeCommandExposureApproved, false);
  assert.equal(report.safetyPosture.flags.phase54ARuntimeCommandSurfaceApproved, false);
  assert.equal(report.safetyPosture.flags.phase54ARuntimeCommandSurfaceEnabled, false);
  assert.equal(report.safetyPosture.flags.phase54AApprovalCommandEnabled, false);
  assert.equal(report.safetyPosture.flags.phase54AAppsCliIndexChanged, false);
  assert.equal(report.safetyPosture.flags.phase54AAppsCliIndexContentChanged, false);
  assert.equal(report.safetyPosture.flags.phase54AAppsCliIndexModeCorrectionNeeded, false);
  assert.equal(report.safetyPosture.flags.phase54AAppsCliIndexModeCorrectionApplied, false);
  assert.equal(report.safetyPosture.flags.phase54ARustSourceChanged, false);
  assert.equal(report.safetyPosture.flags.phase54AProcessControlEnabled, false);
  assert.equal(report.safetyPosture.flags.phase54AStdoutStderrWritersEnabled, false);
  assert.equal(report.safetyPosture.flags.phase54ATranscriptAuditSideEffectsEnabled, false);
  assert.equal(report.safetyPosture.flags.phase54AAdapterRuntimeBehaviorEnabled, false);
  assert.equal(report.safetyPosture.flags.phase54AContentFabricRuntimeBehaviorEnabled, false);
});

test("report inventories Phase 5.5 as default-blocked runtime CLI with runtime unavailable", async () => {
  const report = await runReport();
  const inventory = report.phase55DefaultBlockedRuntimeCliInventory;

  assert.deepEqual(inventory.statusLayer, {
    document: "docs/phase-5-5-default-blocked-runtime-cli.md",
    fixture: "tests/fixtures/command-surface/phase5-5/default-blocked-runtime-cli.json",
    sourceReviewDispositionDocument: "docs/phase-5-4a-jules-review-disposition.md",
    disabledCommandExposurePlanDocument: "docs/phase-5-4-disabled-command-exposure-plan.md",
    precedingPhase: "5.4A",
    layerId: "default-blocked-runtime-cli",
    scope: "cli-recognition-only-runtime-unavailable",
    defaultBlockedRuntimeCliRecorded: true,
    recognizedRuntimeCommand: "serve-runtime",
    runtimeCommandRecognizedByCli: true,
    runtimeEnabled: false,
    runtimeExecutionEnabled: false,
    runtimeCommandEnabled: false,
    runtimeCommandExposureApproved: false,
    runtimeCommandSurfaceApproved: false,
    runtimeEnablementApproved: false,
    approvalCommandEnabled: false,
    approvalGrantCreated: false,
    approvalEvaluatorEnabled: false,
    dryRunBypassesBlock: false,
    stdoutEmptyWhileBlocked: true,
    deterministicUnavailableStderr: true,
    processControlEnabled: false,
    stdoutStderrWritersEnabled: false,
    transcriptAuditSideEffectsEnabled: false,
    adapterRuntimeBehaviorChanged: false,
    contentFabricRuntimeBehaviorChanged: false,
    rustSourceChanged: false,
    reportRunsChecks: false
  });

  assert.deepEqual(
    inventory.docs.map(({ path, status }) => [path, status]),
    phase55DocFiles.map((path) => [path, "present"])
  );
  assert.deepEqual(inventory.crossLinks, phase55CrossLinks);
  assertKnownInventoryStatuses(inventory.machineReadableArtifacts);
  assert.deepEqual(inventory.machineReadableArtifacts.map(({ path }) => path), [
    "tests/fixtures/command-surface/phase5-5/default-blocked-runtime-cli.json"
  ]);
  assertKnownInventoryStatuses(inventory.tests);
  assert.deepEqual(inventory.tests.map(({ path }) => path), [
    "tests/report-phase-status.test.mjs",
    "tests/phase5-5-default-blocked-runtime-cli.test.mjs"
  ]);
  assert.deepEqual(inventory.cliSourceInventory.map(({ path, status }) => [path, status]), [
    ["apps/cli/src/index.mjs", "present"]
  ]);
  assert.deepEqual(inventory.ownershipBoundary.docsStatusFiles, [
    "README.md",
    "apps/cli/README.md",
    "crates/ardyn-host/README.md",
    "docs/phase-5-1-controlled-runtime-implementation-approval-handoff.md",
    "docs/phase-5-2-guarded-runtime-implementation-slice.md",
    "docs/phase-5-3-command-surface-approval-preflight.md",
    "docs/phase-5-4-disabled-command-exposure-plan.md",
    "docs/phase-5-4a-jules-review-disposition.md",
    "docs/phase-5-5-default-blocked-runtime-cli.md",
    "scripts/report-phase-status.mjs",
    "tests/report-phase-status.test.mjs"
  ]);
  assert.deepEqual(inventory.ownershipBoundary.machineReadableArtifactFiles, [
    "tests/fixtures/command-surface/phase5-5/default-blocked-runtime-cli.json"
  ]);
  assert.deepEqual(inventory.ownershipBoundary.focusedTestFiles, [
    "tests/phase5-5-default-blocked-runtime-cli.test.mjs",
    "tests/report-phase-status.test.mjs"
  ]);
  assert.deepEqual(inventory.ownershipBoundary.cliRuntimeSourceFiles, [
    "apps/cli/src/index.mjs"
  ]);
  assert.deepEqual(inventory.ownershipBoundary.rustRuntimeSourceFilesChanged, []);
  assert.equal(inventory.ownershipBoundary.cliSourceChangedByThisPhase, true);
  assert.equal(inventory.ownershipBoundary.appsCliIndexChangedByThisPhase, true);
  assert.equal(inventory.ownershipBoundary.rustSourceChangedByThisPhase, false);
  assert.equal(inventory.ownershipBoundary.machineReadableArtifactsChangedByThisPhase, true);
  assert.equal(inventory.ownershipBoundary.reportRunsChecks, false);
  assert.equal(inventory.ownershipBoundary.separateRuntimeEnablementRequired, true);
  assert.equal(inventory.ownershipBoundary.separateRuntimeCommandEnablementRequired, true);
  assert.deepEqual(inventory.implementedCommandSurface, {
    commandName: "serve-runtime",
    recognizedByCli: true,
    runtimeEnabled: false,
    runtimeCommandEnabled: false,
    runtimeExecutionEnabled: false,
    defaultResult: "recognized_unavailable_nonzero_zero_stdout",
    dryRunResult: "recognized_unavailable_nonzero_zero_stdout",
    stdout: "",
    stderr:
      "Usage: ardyn serve-runtime [--dry-run]\nRuntime unavailable: serve-runtime is recognized, but runtime is not enabled in Phase 5.5.\n",
    exitCode: "nonzero"
  });
  assert.deepEqual(inventory.blockedBehavior.defaultInvocation, {
    args: ["serve-runtime"],
    exitCode: "nonzero",
    stdout: "",
    stderrIncludes: "Runtime unavailable",
    writesFiles: false,
    readsRuntimeState: false
  });
  assert.deepEqual(inventory.blockedBehavior.dryRunInvocation, {
    args: ["serve-runtime", "--dry-run"],
    exitCode: "nonzero",
    stdout: "",
    stderrIncludes: "Runtime unavailable",
    dryRunBypassesBlock: false,
    writesFiles: false,
    readsRuntimeState: false
  });
  assertAllFalse(inventory.runtimeEffect);
  assert.deepEqual(inventory.remainingBlockers, [
    "runtime-enablement-review",
    "approved-runtime-command-exposure-review",
    "approval-record-validation-and-revocation",
    "host-policy-runtime-enforcement",
    "bounded-stdin-loop-review",
    "stdout-stderr-writer-redaction-review",
    "transcript-and-failure-audit-confinement-review",
    "process-control-and-terminal-state-review",
    "rollback-kill-switch-review",
    "approved-positive-runtime-smokes"
  ]);
  assert.deepEqual(inventory.nonExecutionInvariants, [
    "phase5-5-default-blocked-cli-recognition-only",
    "serve-runtime-recognized-but-runtime-unavailable",
    "serve-runtime-dry-run-does-not-bypass-block",
    "runtime-enabled-false",
    "runtime-command-enabled-false",
    "zero-stdout",
    "safe-deterministic-stderr",
    "no-live-stdin-stdout-stderr-runtime-writers",
    "no-process-control",
    "no-transcript-or-audit-runtime-side-effects",
    "no-adapter-or-fabric-runtime-behavior"
  ]);
  assert.deepEqual(inventory.safetyPosture, {
    defaultBlockedRuntimeCliRecorded: true,
    runtimeCommandRecognizedByCli: true,
    runtimeBlocked: true,
    runtimeUnavailable: true,
    dryRunBypassesBlock: false,
    runtimeEnabled: false,
    runtimeStarted: false,
    runtimeReady: false,
    runtimeCommandEnabled: false,
    runtimeExecutionEnabled: false,
    runtimeCommandExposureApproved: false,
    runtimeCommandSurfaceApproved: false,
    runtimeEnablementApproved: false,
    approvalCommandEnabled: false,
    approvalGrantCreated: false,
    approvalEvaluatorEnabled: false,
    noProcessControl: true,
    noStdoutStderrWriters: true,
    noTranscriptWrite: true,
    noFailureAuditWrite: true,
    noAdapterRuntimeBehavior: true,
    noContentFabricRuntimeBehavior: true,
    noRustSourceChange: true,
    zeroStdoutWhileBlocked: true,
    deterministicUnavailableStderr: true
  });
  assert.equal(report.safetyPosture.phase55DefaultBlockedRuntimeCli, true);
  assert.equal(report.safetyPosture.flags.phase55DefaultBlockedRuntimeCliRecorded, true);
  assert.equal(report.safetyPosture.flags.phase55RuntimeCommandRecognizedByCli, true);
  assert.equal(report.safetyPosture.flags.phase55RuntimeUnavailable, true);
  assert.equal(report.safetyPosture.flags.phase55DryRunBypassesBlock, false);
  assert.equal(report.safetyPosture.flags.phase55RuntimeEnablementApproved, false);
  assert.equal(report.safetyPosture.flags.phase55RuntimeEnabled, false);
  assert.equal(report.safetyPosture.flags.phase55RuntimeStarted, false);
  assert.equal(report.safetyPosture.flags.phase55RuntimeReady, false);
  assert.equal(report.safetyPosture.flags.phase55RuntimeCommandEnabled, false);
  assert.equal(report.safetyPosture.flags.phase55RuntimeExecutionEnabled, false);
  assert.equal(report.safetyPosture.flags.phase55RuntimeCommandExposureApproved, false);
  assert.equal(report.safetyPosture.flags.phase55RuntimeCommandSurfaceApproved, false);
  assert.equal(report.safetyPosture.flags.phase55ApprovalCommandEnabled, false);
  assert.equal(report.safetyPosture.flags.phase55ApprovalGrantCreated, false);
  assert.equal(report.safetyPosture.flags.phase55ApprovalEvaluatorEnabled, false);
  assert.equal(report.safetyPosture.flags.phase55RustSourceChanged, false);
  assert.equal(report.safetyPosture.flags.phase55ProcessControlEnabled, false);
  assert.equal(report.safetyPosture.flags.phase55StdoutStderrWritersEnabled, false);
  assert.equal(report.safetyPosture.flags.phase55TranscriptAuditSideEffectsEnabled, false);
  assert.equal(report.safetyPosture.flags.phase55AdapterRuntimeBehaviorEnabled, false);
  assert.equal(report.safetyPosture.flags.phase55ContentFabricRuntimeBehaviorEnabled, false);
});

test("report inventories Phase 5.6 as runtime enablement preconditions with runtime blocked", async () => {
  const report = await runReport();
  const inventory = report.phase56RuntimeEnablePreconditionGateInventory;
  const expectedPreconditionIds = [
    "runtime-enablement-approval",
    "runtime-command-exposure-approval",
    "approval-record-validation-and-revocation",
    "host-policy-runtime-enforcement",
    "stdio-safety-boundary",
    "transcript-audit-confinement",
    "process-control-boundary",
    "rollback-kill-switch",
    "positive-runtime-smokes"
  ];

  assert.deepEqual(inventory.statusLayer, {
    document: "docs/phase-5-6-runtime-enable-preconditions.md",
    fixture: "tests/fixtures/host-policy/phase5-6/runtime-enable-precondition-gate.json",
    sourceDefaultBlockedRuntimeCliDocument: "docs/phase-5-5-default-blocked-runtime-cli.md",
    sourceDefaultBlockedRuntimeCliFixture:
      "tests/fixtures/command-surface/phase5-5/default-blocked-runtime-cli.json",
    precedingPhase: "5.5",
    layerId: "runtime-enable-precondition-gate",
    scope: "runtime-enable-preconditions-only-runtime-disabled",
    runtimeEnablementGateRecorded: true,
    gateSatisfied: false,
    requiredPreconditionCount: 9,
    satisfiedPreconditionCount: 0,
    canEnableRuntime: false,
    runtimeEnabled: false,
    runtimeExecutionEnabled: false,
    runtimeCommandEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    approvalCommandEnabled: false,
    approvalGrantCreated: false,
    approvalEvaluatorEnabled: false,
    processControlEnabled: false,
    stdoutStderrWritersEnabled: false,
    transcriptAuditSideEffectsEnabled: false,
    adapterRuntimeBehaviorChanged: false,
    contentFabricRuntimeBehaviorChanged: false,
    webSocketHttpSurfaceEnabled: false,
    cliSourceChanged: false,
    rustSourceChanged: false,
    reportRunsChecks: false
  });

  assert.deepEqual(
    inventory.docs.map(({ path, status }) => [path, status]),
    phase56DocFiles.map((path) => [path, "present"])
  );
  assert.deepEqual(inventory.crossLinks, phase56CrossLinks);
  assertKnownInventoryStatuses(inventory.machineReadableArtifacts);
  assert.deepEqual(inventory.machineReadableArtifacts.map(({ path }) => path), [
    "tests/fixtures/host-policy/phase5-6/runtime-enable-precondition-gate.json"
  ]);
  assertKnownInventoryStatuses(inventory.tests);
  assert.deepEqual(inventory.tests.map(({ path }) => path), [
    "tests/report-phase-status.test.mjs",
    "tests/phase5-6-runtime-enable-preconditions.test.mjs"
  ]);
  assert.deepEqual(inventory.ownershipBoundary, {
    docsStatusFiles: [
      "README.md",
      "apps/cli/README.md",
      "crates/ardyn-host/README.md",
      "docs/phase-5-5-default-blocked-runtime-cli.md",
      "docs/phase-5-6-runtime-enable-preconditions.md",
      "scripts/report-phase-status.mjs",
      "tests/report-phase-status.test.mjs"
    ],
    machineReadableArtifactFiles: [
      "tests/fixtures/host-policy/phase5-6/runtime-enable-precondition-gate.json"
    ],
    focusedTestFiles: [
      "tests/phase5-6-runtime-enable-preconditions.test.mjs",
      "tests/report-phase-status.test.mjs"
    ],
    cliRuntimeSourceFilesChanged: [],
    rustRuntimeSourceFilesChanged: [],
    cliSourceChangedByThisPhase: false,
    appsCliIndexChangedByThisPhase: false,
    rustSourceChangedByThisPhase: false,
    machineReadableArtifactsChangedByThisPhase: true,
    reportRunsChecks: false,
    separateRuntimeImplementationPhaseRequired: true,
    separateRuntimeEnablementApprovalRequired: true
  });
  assert.deepEqual(inventory.gateSummary, {
    runtimeEnablementGateRecorded: true,
    gateSatisfied: false,
    requiredPreconditionCount: 9,
    satisfiedPreconditionCount: 0,
    canEnableRuntime: false,
    runtimeEnabled: false,
    runtimeCommandEnabled: false,
    runtimeExecutionEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    requiresFutureReviewBeforeEnablement: true
  });
  assert.deepEqual(
    inventory.requiredPreconditions.map((precondition) => precondition.id),
    expectedPreconditionIds
  );
  for (const precondition of inventory.requiredPreconditions) {
    assert.equal(precondition.requiredBeforeRuntimeEnablement, true, precondition.id);
    assert.equal(precondition.satisfied, false, precondition.id);
    assert.equal(precondition.status, "blocked", precondition.id);
    assert.ok(precondition.requiredEvidence.length >= 3, precondition.id);
  }
  assertAllFalse(inventory.blockedRuntimeEffect);
  assert.deepEqual(inventory.serveRuntimeBlockedBehavior, {
    args: ["serve-runtime"],
    dryRunArgs: ["serve-runtime", "--dry-run"],
    recognizedByCli: true,
    exitCode: "nonzero",
    stdout: "",
    stderr:
      "Usage: ardyn serve-runtime [--dry-run]\nRuntime unavailable: serve-runtime is recognized, but runtime is not enabled in Phase 5.5.\n",
    runtimeExecution: false,
    writesFiles: false
  });
  assert.deepEqual(inventory.forbiddenBehavior, [
    "runtime-enabled-true",
    "runtime-command-enabled-true",
    "runtime-start",
    "live-stdin-loop",
    "runtime-stdout-stderr-writer",
    "process-control",
    "transcript-audit-runtime-write",
    "adapter-runtime-behavior",
    "content-fabric-runtime-behavior",
    "websocket-http-runtime-surface",
    "approval-grant-or-evaluator"
  ]);
  assert.deepEqual(inventory.safetyPosture, {
    runtimeEnablementGateRecorded: true,
    runtimeEnablementGateSatisfied: false,
    canEnableRuntime: false,
    runtimeBlocked: true,
    runtimeEnabled: false,
    runtimeStarted: false,
    runtimeReady: false,
    runtimeCommandEnabled: false,
    runtimeExecutionEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    approvalCommandEnabled: false,
    approvalGrantCreated: false,
    approvalEvaluatorEnabled: false,
    noLiveStdinLoop: true,
    noStdoutStderrWriters: true,
    noProcessControl: true,
    noTranscriptWrite: true,
    noFailureAuditWrite: true,
    noAdapterRuntimeBehavior: true,
    noContentFabricRuntimeBehavior: true,
    noWebSocketHttpSurface: true,
    noCliSourceChange: true,
    noRustSourceChange: true
  });
  assert.equal(report.safetyPosture.phase56RuntimeEnablePreconditionGate, true);
  assert.equal(report.safetyPosture.flags.phase56RuntimeEnablementGateRecorded, true);
  assert.equal(report.safetyPosture.flags.phase56RuntimeEnablementGateSatisfied, false);
  assert.equal(report.safetyPosture.flags.phase56RequiredPreconditionCount, 9);
  assert.equal(report.safetyPosture.flags.phase56SatisfiedPreconditionCount, 0);
  assert.equal(report.safetyPosture.flags.phase56CanEnableRuntime, false);
  assert.equal(report.safetyPosture.flags.phase56RuntimeEnabled, false);
  assert.equal(report.safetyPosture.flags.phase56RuntimeStarted, false);
  assert.equal(report.safetyPosture.flags.phase56RuntimeReady, false);
  assert.equal(report.safetyPosture.flags.phase56RuntimeCommandEnabled, false);
  assert.equal(report.safetyPosture.flags.phase56RuntimeExecutionEnabled, false);
  assert.equal(report.safetyPosture.flags.phase56ServeRuntimeStillDefaultBlocked, true);
  assert.equal(report.safetyPosture.flags.phase56DryRunBypassesBlock, false);
  assert.equal(report.safetyPosture.flags.phase56ApprovalCommandEnabled, false);
  assert.equal(report.safetyPosture.flags.phase56ApprovalGrantCreated, false);
  assert.equal(report.safetyPosture.flags.phase56ApprovalEvaluatorEnabled, false);
  assert.equal(report.safetyPosture.flags.phase56CliSourceChanged, false);
  assert.equal(report.safetyPosture.flags.phase56RustSourceChanged, false);
  assert.equal(report.safetyPosture.flags.phase56ProcessControlEnabled, false);
  assert.equal(report.safetyPosture.flags.phase56StdoutStderrWritersEnabled, false);
  assert.equal(report.safetyPosture.flags.phase56TranscriptAuditSideEffectsEnabled, false);
  assert.equal(report.safetyPosture.flags.phase56AdapterRuntimeBehaviorEnabled, false);
  assert.equal(report.safetyPosture.flags.phase56ContentFabricRuntimeBehaviorEnabled, false);
  assert.equal(report.safetyPosture.flags.phase56WebSocketHttpSurfaceEnabled, false);
});

test("report inventories Phase 5.7 as runtime approval validation with runtime blocked", async () => {
  const report = await runReport();
  const inventory = report.phase57RuntimeApprovalValidationInventory;
  const expectedCaseIds = [
    "missing-approval",
    "invalid-approval",
    "revoked-approval",
    "valid-approval-prerequisite-only"
  ];

  assert.deepEqual(inventory.statusLayer, {
    document: "docs/phase-5-7-runtime-approval-validation.md",
    fixture: "tests/fixtures/host-policy/phase5-7/runtime-approval-validation-contract.json",
    sourceRuntimeEnablePreconditionDocument:
      "docs/phase-5-6-runtime-enable-preconditions.md",
    sourceRuntimeEnablePreconditionFixture:
      "tests/fixtures/host-policy/phase5-6/runtime-enable-precondition-gate.json",
    precedingPhase: "5.6",
    layerId: "runtime-approval-validation-contract",
    scope: "approval-validation-contract-only-runtime-disabled",
    approvalValidationContractRecorded: true,
    missingApprovalRejected: true,
    invalidApprovalRejected: true,
    revokedApprovalRejected: true,
    validApprovalRecognizedAsPrerequisiteOnly: true,
    validApprovalEnablesRuntime: false,
    validApprovalStartsRuntime: false,
    canEnableRuntime: false,
    runtimeEnabled: false,
    runtimeExecutionEnabled: false,
    runtimeCommandEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    approvalCommandEnabled: false,
    approvalGrantCreated: false,
    approvalEvaluatorImplemented: false,
    processControlEnabled: false,
    stdoutStderrWritersEnabled: false,
    transcriptAuditSideEffectsEnabled: false,
    adapterRuntimeBehaviorChanged: false,
    contentFabricRuntimeBehaviorChanged: false,
    webSocketHttpSurfaceEnabled: false,
    cliSourceChanged: false,
    rustSourceChanged: false,
    reportRunsChecks: false
  });

  assert.deepEqual(
    inventory.docs.map(({ path, status }) => [path, status]),
    phase57DocFiles.map((path) => [path, "present"])
  );
  assert.deepEqual(inventory.crossLinks, phase57CrossLinks);
  assertKnownInventoryStatuses(inventory.machineReadableArtifacts);
  assert.deepEqual(inventory.machineReadableArtifacts.map(({ path }) => path), [
    "tests/fixtures/host-policy/phase5-7/runtime-approval-validation-contract.json"
  ]);
  assertKnownInventoryStatuses(inventory.tests);
  assert.deepEqual(inventory.tests.map(({ path }) => path), [
    "tests/report-phase-status.test.mjs",
    "tests/phase5-7-runtime-approval-validation.test.mjs"
  ]);
  assert.deepEqual(inventory.ownershipBoundary, {
    docsStatusFiles: [
      "README.md",
      "apps/cli/README.md",
      "crates/ardyn-host/README.md",
      "docs/phase-5-6-runtime-enable-preconditions.md",
      "docs/phase-5-7-runtime-approval-validation.md",
      "scripts/report-phase-status.mjs",
      "tests/report-phase-status.test.mjs"
    ],
    machineReadableArtifactFiles: [
      "tests/fixtures/host-policy/phase5-7/runtime-approval-validation-contract.json"
    ],
    focusedTestFiles: [
      "tests/phase5-7-runtime-approval-validation.test.mjs",
      "tests/report-phase-status.test.mjs"
    ],
    cliRuntimeSourceFilesChanged: [],
    rustRuntimeSourceFilesChanged: [],
    cliSourceChangedByThisPhase: false,
    appsCliIndexChangedByThisPhase: false,
    rustSourceChangedByThisPhase: false,
    machineReadableArtifactsChangedByThisPhase: true,
    reportRunsChecks: false,
    separateRuntimeImplementationPhaseRequired: true,
    separateRuntimeEnablementApprovalRequired: true
  });
  assert.deepEqual(inventory.contractSummary, {
    approvalValidationContractRecorded: true,
    approvalRecordSchema: "ardyn.runtime-approval-record",
    approvalRecordSchemaVersion: "0.1.0",
    missingApprovalRejected: true,
    invalidApprovalRejected: true,
    revokedApprovalRejected: true,
    validApprovalRecognizedAsPrerequisiteOnly: true,
    validApprovalEnablesRuntime: false,
    validApprovalStartsRuntime: false,
    runtimeEnabled: false,
    runtimeCommandEnabled: false,
    runtimeExecutionEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    approvalGrantCreated: false,
    approvalEvaluatorImplemented: false,
    requiresRemainingPhase56Preconditions: true,
    canEnableRuntime: false
  });
  assert.equal(inventory.approvalRecordShape.recordKind, "runtime-approval-record");
  assert.ok(inventory.approvalRecordShape.requiredTopLevelFields.includes("revocation"));
  assert.ok(inventory.approvalRecordShape.requiredTopLevelFields.includes("runtimeEffect"));
  assert.deepEqual(
    inventory.approvalCases.map((approvalCase) => approvalCase.caseId),
    expectedCaseIds
  );
  for (const approvalCase of inventory.approvalCases) {
    assertAllFalse(approvalCase.runtimeEffect);
    if (approvalCase.caseId === "valid-approval-prerequisite-only") {
      assert.equal(approvalCase.rejected, false);
      assert.equal(approvalCase.approvalRecordValid, true);
      assert.equal(approvalCase.prerequisiteSignalRecognized, true);
      assert.ok(approvalCase.remainingBlockers.length >= 5);
    } else {
      assert.equal(approvalCase.rejected, true, approvalCase.caseId);
      assert.equal(approvalCase.prerequisiteSignalRecognized, false, approvalCase.caseId);
      assert.ok(approvalCase.rejectionReasons.length >= 1, approvalCase.caseId);
    }
  }
  assert.deepEqual(inventory.validationRules, {
    missingApproval: "must_reject_before_runtime_enablement",
    invalidApproval: "must_reject_before_runtime_enablement",
    revokedApproval: "must_reject_before_runtime_enablement",
    validApproval: "may_count_only_as_prerequisite_signal",
    validApprovalCannotEnableRuntime: true,
    validApprovalCannotStartRuntime: true,
    validApprovalCannotExposeCommand: true,
    dryRunCannotBypassApproval: true,
    separateFutureRuntimeEnablementReviewRequired: true
  });
  assertAllFalse(inventory.blockedRuntimeEffect);
  assert.deepEqual(inventory.serveRuntimeBlockedBehavior, {
    args: ["serve-runtime"],
    dryRunArgs: ["serve-runtime", "--dry-run"],
    recognizedByCli: true,
    exitCode: "nonzero",
    stdout: "",
    stderr:
      "Usage: ardyn serve-runtime [--dry-run]\nRuntime unavailable: serve-runtime is recognized, but runtime is not enabled in Phase 5.5.\n",
    runtimeExecution: false,
    writesFiles: false
  });
  assert.deepEqual(inventory.forbiddenBehavior, [
    "runtime-enabled-true",
    "runtime-command-enabled-true",
    "runtime-start",
    "live-stdin-loop",
    "runtime-stdout-stderr-writer",
    "process-control",
    "transcript-audit-runtime-write",
    "adapter-runtime-behavior",
    "content-fabric-runtime-behavior",
    "websocket-http-runtime-surface",
    "approval-grant-or-evaluator"
  ]);
  assert.deepEqual(inventory.safetyPosture, {
    approvalValidationContractRecorded: true,
    missingApprovalRejected: true,
    invalidApprovalRejected: true,
    revokedApprovalRejected: true,
    validApprovalPrerequisiteOnly: true,
    validApprovalEnablesRuntime: false,
    validApprovalStartsRuntime: false,
    canEnableRuntime: false,
    runtimeBlocked: true,
    runtimeEnabled: false,
    runtimeStarted: false,
    runtimeReady: false,
    runtimeCommandEnabled: false,
    runtimeExecutionEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    approvalCommandEnabled: false,
    approvalGrantCreated: false,
    approvalEvaluatorImplemented: false,
    noLiveStdinLoop: true,
    noStdoutStderrWriters: true,
    noProcessControl: true,
    noTranscriptWrite: true,
    noFailureAuditWrite: true,
    noAdapterRuntimeBehavior: true,
    noContentFabricRuntimeBehavior: true,
    noWebSocketHttpSurface: true,
    noCliSourceChange: true,
    noRustSourceChange: true
  });
  assert.equal(report.safetyPosture.phase57RuntimeApprovalValidationContract, true);
  assert.equal(report.safetyPosture.flags.phase57ApprovalValidationContractRecorded, true);
  assert.equal(report.safetyPosture.flags.phase57MissingApprovalRejected, true);
  assert.equal(report.safetyPosture.flags.phase57InvalidApprovalRejected, true);
  assert.equal(report.safetyPosture.flags.phase57RevokedApprovalRejected, true);
  assert.equal(report.safetyPosture.flags.phase57ValidApprovalPrerequisiteOnly, true);
  assert.equal(report.safetyPosture.flags.phase57ValidApprovalEnablesRuntime, false);
  assert.equal(report.safetyPosture.flags.phase57ValidApprovalStartsRuntime, false);
  assert.equal(report.safetyPosture.flags.phase57CanEnableRuntime, false);
  assert.equal(report.safetyPosture.flags.phase57RuntimeEnabled, false);
  assert.equal(report.safetyPosture.flags.phase57RuntimeStarted, false);
  assert.equal(report.safetyPosture.flags.phase57RuntimeReady, false);
  assert.equal(report.safetyPosture.flags.phase57RuntimeCommandEnabled, false);
  assert.equal(report.safetyPosture.flags.phase57RuntimeExecutionEnabled, false);
  assert.equal(report.safetyPosture.flags.phase57ServeRuntimeStillDefaultBlocked, true);
  assert.equal(report.safetyPosture.flags.phase57DryRunBypassesBlock, false);
  assert.equal(report.safetyPosture.flags.phase57ApprovalCommandEnabled, false);
  assert.equal(report.safetyPosture.flags.phase57ApprovalGrantCreated, false);
  assert.equal(report.safetyPosture.flags.phase57ApprovalEvaluatorImplemented, false);
  assert.equal(report.safetyPosture.flags.phase57CliSourceChanged, false);
  assert.equal(report.safetyPosture.flags.phase57RustSourceChanged, false);
  assert.equal(report.safetyPosture.flags.phase57ProcessControlEnabled, false);
  assert.equal(report.safetyPosture.flags.phase57StdoutStderrWritersEnabled, false);
  assert.equal(report.safetyPosture.flags.phase57TranscriptAuditSideEffectsEnabled, false);
  assert.equal(report.safetyPosture.flags.phase57AdapterRuntimeBehaviorEnabled, false);
  assert.equal(report.safetyPosture.flags.phase57ContentFabricRuntimeBehaviorEnabled, false);
  assert.equal(report.safetyPosture.flags.phase57WebSocketHttpSurfaceEnabled, false);
});

test("report inventories Phase 5.8 as command-exposure approval with runtime blocked", async () => {
  const report = await runReport();
  const inventory = report.phase58RuntimeCommandExposureApprovalInventory;
  const expectedCaseIds = [
    "missing-command-exposure-approval",
    "invalid-command-exposure-approval",
    "revoked-command-exposure-approval",
    "valid-command-exposure-approval-prerequisite-only"
  ];

  assert.deepEqual(inventory.statusLayer, {
    document: "docs/phase-5-8-runtime-command-exposure-approval.md",
    fixture:
      "tests/fixtures/command-surface/phase5-8/runtime-command-exposure-approval-contract.json",
    sourceRuntimeApprovalValidationDocument:
      "docs/phase-5-7-runtime-approval-validation.md",
    sourceRuntimeApprovalValidationFixture:
      "tests/fixtures/host-policy/phase5-7/runtime-approval-validation-contract.json",
    precedingPhase: "5.7",
    layerId: "runtime-command-exposure-approval-contract",
    scope: "command-exposure-approval-contract-only-runtime-disabled",
    commandExposureApprovalContractRecorded: true,
    missingCommandExposureApprovalRejected: true,
    invalidCommandExposureApprovalRejected: true,
    revokedCommandExposureApprovalRejected: true,
    validCommandExposureApprovalRecognizedAsPrerequisiteOnly: true,
    validCommandExposureApprovalEnablesRuntime: false,
    validCommandExposureApprovalStartsRuntime: false,
    validCommandExposureApprovalExposesRuntimeExecution: false,
    validCommandExposureApprovalExposesUserRuntimeCommand: false,
    recognizedCommandIsRuntimeExecutionExposure: false,
    canEnableRuntime: false,
    runtimeEnabled: false,
    runtimeExecutionEnabled: false,
    runtimeCommandEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    approvalCommandEnabled: false,
    approvalGrantCreated: false,
    approvalEvaluatorImplemented: false,
    processControlEnabled: false,
    stdoutStderrWritersEnabled: false,
    transcriptAuditSideEffectsEnabled: false,
    adapterRuntimeBehaviorChanged: false,
    contentFabricRuntimeBehaviorChanged: false,
    webSocketHttpSurfaceEnabled: false,
    cliSourceChanged: false,
    rustSourceChanged: false,
    reportRunsChecks: false
  });

  assert.deepEqual(
    inventory.docs.map(({ path, status }) => [path, status]),
    phase58DocFiles.map((path) => [path, "present"])
  );
  assert.deepEqual(inventory.crossLinks, phase58CrossLinks);
  assertKnownInventoryStatuses(inventory.machineReadableArtifacts);
  assert.deepEqual(inventory.machineReadableArtifacts.map(({ path }) => path), [
    "tests/fixtures/command-surface/phase5-8/runtime-command-exposure-approval-contract.json"
  ]);
  assertKnownInventoryStatuses(inventory.tests);
  assert.deepEqual(inventory.tests.map(({ path }) => path), [
    "tests/report-phase-status.test.mjs",
    "tests/phase5-8-runtime-command-exposure-approval.test.mjs"
  ]);
  assert.deepEqual(inventory.ownershipBoundary, {
    docsStatusFiles: [
      "README.md",
      "apps/cli/README.md",
      "crates/ardyn-host/README.md",
      "docs/phase-5-7-runtime-approval-validation.md",
      "docs/phase-5-8-runtime-command-exposure-approval.md",
      "scripts/report-phase-status.mjs",
      "tests/report-phase-status.test.mjs"
    ],
    machineReadableArtifactFiles: [
      "tests/fixtures/command-surface/phase5-8/runtime-command-exposure-approval-contract.json"
    ],
    focusedTestFiles: [
      "tests/phase5-8-runtime-command-exposure-approval.test.mjs",
      "tests/report-phase-status.test.mjs"
    ],
    cliRuntimeSourceFilesChanged: [],
    rustRuntimeSourceFilesChanged: [],
    cliSourceChangedByThisPhase: false,
    appsCliIndexChangedByThisPhase: false,
    rustSourceChangedByThisPhase: false,
    machineReadableArtifactsChangedByThisPhase: true,
    reportRunsChecks: false,
    separateRuntimeImplementationPhaseRequired: true,
    separateRuntimeEnablementApprovalRequired: true
  });
  assert.deepEqual(inventory.contractSummary, {
    commandExposureApprovalContractRecorded: true,
    commandExposureApprovalRecordSchema: "ardyn.runtime-command-exposure-approval-record",
    commandExposureApprovalRecordSchemaVersion: "0.1.0",
    missingCommandExposureApprovalRejected: true,
    invalidCommandExposureApprovalRejected: true,
    revokedCommandExposureApprovalRejected: true,
    validCommandExposureApprovalRecognizedAsPrerequisiteOnly: true,
    validCommandExposureApprovalEnablesRuntime: false,
    validCommandExposureApprovalStartsRuntime: false,
    validCommandExposureApprovalExposesRuntimeExecution: false,
    validCommandExposureApprovalExposesUserRuntimeCommand: false,
    recognizedCommandIsRuntimeExecutionExposure: false,
    recognizedRuntimeCommandDefaultBlocked: true,
    runtimeEnabled: false,
    runtimeCommandEnabled: false,
    runtimeExecutionEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    approvalGrantCreated: false,
    approvalEvaluatorImplemented: false,
    requiresRemainingPhase56Preconditions: true,
    requiresSeparateRuntimeEnablementReview: true,
    canEnableRuntime: false
  });
  assert.equal(
    inventory.commandExposureApprovalRecordShape.recordKind,
    "runtime-command-exposure-approval-record"
  );
  assert.ok(
    inventory.commandExposureApprovalRecordShape.requiredTopLevelFields.includes(
      "commandExposureEffect"
    )
  );
  assert.ok(
    inventory.commandExposureApprovalRecordShape.requiredScopeFields.includes(
      "defaultBlockedCliContractDigest"
    )
  );
  assert.deepEqual(
    inventory.commandExposureApprovalCases.map((approvalCase) => approvalCase.caseId),
    expectedCaseIds
  );
  for (const approvalCase of inventory.commandExposureApprovalCases) {
    assertAllFalse(approvalCase.commandExposureEffect);
    assertAllFalse(approvalCase.runtimeEffect);
    if (approvalCase.caseId === "valid-command-exposure-approval-prerequisite-only") {
      assert.equal(approvalCase.rejected, false);
      assert.equal(approvalCase.approvalRecordValid, true);
      assert.equal(approvalCase.prerequisiteSignalRecognized, true);
      assert.ok(approvalCase.remainingBlockers.length >= 5);
    } else {
      assert.equal(approvalCase.rejected, true, approvalCase.caseId);
      assert.equal(approvalCase.prerequisiteSignalRecognized, false, approvalCase.caseId);
      assert.ok(approvalCase.rejectionReasons.length >= 1, approvalCase.caseId);
    }
  }
  assert.deepEqual(inventory.validationRules, {
    missingCommandExposureApproval: "must_reject_before_runtime_command_exposure",
    invalidCommandExposureApproval: "must_reject_before_runtime_command_exposure",
    revokedCommandExposureApproval: "must_reject_before_runtime_command_exposure",
    validCommandExposureApproval: "may_count_only_as_prerequisite_signal",
    validCommandExposureApprovalCannotEnableRuntime: true,
    validCommandExposureApprovalCannotStartRuntime: true,
    validCommandExposureApprovalCannotExposeRuntimeExecution: true,
    validCommandExposureApprovalCannotExposeAdditionalCliCommands: true,
    recognizedCommandDoesNotImplyRuntimeExecutionExposure: true,
    dryRunCannotBypassApproval: true,
    separateFutureRuntimeEnablementReviewRequired: true
  });
  assert.deepEqual(inventory.recognizedCommandBoundary, {
    recognizedRuntimeCommandsToday: ["serve-runtime"],
    recognizedRuntimeCommandCountToday: 1,
    recognizedRuntimeCommandDefaultBlocked: true,
    additionalRuntimeCommandsRecognizedByThisPhase: false,
    additionalRuntimeCommandsExposedByThisPhase: false,
    userRuntimeExecutionExposedToday: false,
    futureCommandExposureApprovalRequiredBeforeExposure: true
  });
  assertAllFalse(inventory.blockedRuntimeEffect);
  assert.deepEqual(inventory.serveRuntimeBlockedBehavior, {
    args: ["serve-runtime"],
    dryRunArgs: ["serve-runtime", "--dry-run"],
    recognizedByCli: true,
    exitCode: "nonzero",
    stdout: "",
    stderr:
      "Usage: ardyn serve-runtime [--dry-run]\nRuntime unavailable: serve-runtime is recognized, but runtime is not enabled in Phase 5.5.\n",
    runtimeExecution: false,
    writesFiles: false
  });
  assert.ok(inventory.forbiddenBehavior.includes("runtime-execution-exposed"));
  assert.ok(inventory.forbiddenBehavior.includes("new-runtime-command-recognized"));
  assert.deepEqual(inventory.safetyPosture, {
    commandExposureApprovalContractRecorded: true,
    missingCommandExposureApprovalRejected: true,
    invalidCommandExposureApprovalRejected: true,
    revokedCommandExposureApprovalRejected: true,
    validCommandExposureApprovalPrerequisiteOnly: true,
    validCommandExposureApprovalEnablesRuntime: false,
    validCommandExposureApprovalStartsRuntime: false,
    validCommandExposureApprovalExposesRuntimeExecution: false,
    validCommandExposureApprovalExposesUserRuntimeCommand: false,
    recognizedCommandIsRuntimeExecutionExposure: false,
    canEnableRuntime: false,
    runtimeBlocked: true,
    runtimeEnabled: false,
    runtimeStarted: false,
    runtimeReady: false,
    runtimeCommandEnabled: false,
    runtimeExecutionEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    approvalCommandEnabled: false,
    approvalGrantCreated: false,
    approvalEvaluatorImplemented: false,
    noLiveStdinLoop: true,
    noStdoutStderrWriters: true,
    noProcessControl: true,
    noTranscriptWrite: true,
    noFailureAuditWrite: true,
    noAdapterRuntimeBehavior: true,
    noContentFabricRuntimeBehavior: true,
    noWebSocketHttpSurface: true,
    noCliSourceChange: true,
    noRustSourceChange: true
  });
  assert.equal(report.safetyPosture.phase58RuntimeCommandExposureApprovalContract, true);
  assert.equal(
    report.safetyPosture.flags.phase58CommandExposureApprovalContractRecorded,
    true
  );
  assert.equal(report.safetyPosture.flags.phase58MissingCommandExposureApprovalRejected, true);
  assert.equal(report.safetyPosture.flags.phase58InvalidCommandExposureApprovalRejected, true);
  assert.equal(report.safetyPosture.flags.phase58RevokedCommandExposureApprovalRejected, true);
  assert.equal(
    report.safetyPosture.flags.phase58ValidCommandExposureApprovalPrerequisiteOnly,
    true
  );
  assert.equal(report.safetyPosture.flags.phase58ValidCommandExposureApprovalEnablesRuntime, false);
  assert.equal(report.safetyPosture.flags.phase58ValidCommandExposureApprovalStartsRuntime, false);
  assert.equal(
    report.safetyPosture.flags.phase58ValidCommandExposureApprovalExposesRuntimeExecution,
    false
  );
  assert.equal(
    report.safetyPosture.flags.phase58ValidCommandExposureApprovalExposesUserRuntimeCommand,
    false
  );
  assert.equal(report.safetyPosture.flags.phase58RecognizedCommandIsRuntimeExecutionExposure, false);
  assert.equal(report.safetyPosture.flags.phase58CanEnableRuntime, false);
  assert.equal(report.safetyPosture.flags.phase58RuntimeEnabled, false);
  assert.equal(report.safetyPosture.flags.phase58RuntimeStarted, false);
  assert.equal(report.safetyPosture.flags.phase58RuntimeReady, false);
  assert.equal(report.safetyPosture.flags.phase58RuntimeCommandEnabled, false);
  assert.equal(report.safetyPosture.flags.phase58RuntimeExecutionEnabled, false);
  assert.equal(report.safetyPosture.flags.phase58ServeRuntimeStillDefaultBlocked, true);
  assert.equal(report.safetyPosture.flags.phase58DryRunBypassesBlock, false);
  assert.equal(report.safetyPosture.flags.phase58ApprovalCommandEnabled, false);
  assert.equal(report.safetyPosture.flags.phase58ApprovalGrantCreated, false);
  assert.equal(report.safetyPosture.flags.phase58ApprovalEvaluatorImplemented, false);
  assert.equal(report.safetyPosture.flags.phase58CliSourceChanged, false);
  assert.equal(report.safetyPosture.flags.phase58RustSourceChanged, false);
  assert.equal(report.safetyPosture.flags.phase58ProcessControlEnabled, false);
  assert.equal(report.safetyPosture.flags.phase58StdoutStderrWritersEnabled, false);
  assert.equal(report.safetyPosture.flags.phase58TranscriptAuditSideEffectsEnabled, false);
  assert.equal(report.safetyPosture.flags.phase58AdapterRuntimeBehaviorEnabled, false);
  assert.equal(report.safetyPosture.flags.phase58ContentFabricRuntimeBehaviorEnabled, false);
  assert.equal(report.safetyPosture.flags.phase58WebSocketHttpSurfaceEnabled, false);
});

test("report inventories Phase 5.9 as evaluator/grant boundary with runtime blocked", async () => {
  const report = await runReport();
  const inventory = report.phase59ApprovalEvaluatorGrantBoundaryInventory;
  const expectedCaseIds = [
    "valid-runtime-approval-only",
    "valid-command-exposure-approval-only",
    "valid-approval-signals-no-evaluator",
    "fake-grant-attempt"
  ];

  assert.deepEqual(inventory.statusLayer, {
    document: "docs/phase-5-9-approval-evaluator-grant-boundary.md",
    fixture:
      "tests/fixtures/host-policy/phase5-9/approval-evaluator-grant-boundary-contract.json",
    sourceRuntimeCommandExposureApprovalDocument:
      "docs/phase-5-8-runtime-command-exposure-approval.md",
    sourceRuntimeCommandExposureApprovalFixture:
      "tests/fixtures/command-surface/phase5-8/runtime-command-exposure-approval-contract.json",
    precedingPhase: "5.8",
    layerId: "approval-evaluator-grant-boundary-contract",
    scope: "approval-evaluator-grant-boundary-only-runtime-disabled",
    approvalEvaluatorGrantBoundaryRecorded: true,
    runtimeApprovalPrerequisiteOnly: true,
    commandExposureApprovalPrerequisiteOnly: true,
    combinedApprovalSignalsPrerequisiteOnly: true,
    approvalEvaluatorImplemented: false,
    approvalGrantProduced: false,
    validApprovalSignalsCreateGrant: false,
    validApprovalSignalsEnableRuntime: false,
    validApprovalSignalsStartRuntime: false,
    validApprovalSignalsExposeRuntimeExecution: false,
    canEnableRuntime: false,
    runtimeEnabled: false,
    runtimeExecutionEnabled: false,
    runtimeCommandEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    approvalCommandEnabled: false,
    processControlEnabled: false,
    stdoutStderrWritersEnabled: false,
    transcriptAuditSideEffectsEnabled: false,
    adapterRuntimeBehaviorChanged: false,
    contentFabricRuntimeBehaviorChanged: false,
    webSocketHttpSurfaceEnabled: false,
    cliSourceChanged: false,
    rustSourceChanged: false,
    reportRunsChecks: false
  });

  assert.deepEqual(
    inventory.docs.map(({ path, status }) => [path, status]),
    phase59DocFiles.map((path) => [path, "present"])
  );
  assert.deepEqual(inventory.crossLinks, phase59CrossLinks);
  assertKnownInventoryStatuses(inventory.machineReadableArtifacts);
  assert.deepEqual(inventory.machineReadableArtifacts.map(({ path }) => path), [
    "tests/fixtures/host-policy/phase5-9/approval-evaluator-grant-boundary-contract.json"
  ]);
  assertKnownInventoryStatuses(inventory.tests);
  assert.deepEqual(inventory.tests.map(({ path }) => path), [
    "tests/report-phase-status.test.mjs",
    "tests/phase5-9-approval-evaluator-grant-boundary.test.mjs"
  ]);
  assert.deepEqual(inventory.ownershipBoundary, {
    docsStatusFiles: [
      "README.md",
      "apps/cli/README.md",
      "crates/ardyn-host/README.md",
      "docs/phase-5-8-runtime-command-exposure-approval.md",
      "docs/phase-5-9-approval-evaluator-grant-boundary.md",
      "scripts/report-phase-status.mjs",
      "tests/report-phase-status.test.mjs"
    ],
    machineReadableArtifactFiles: [
      "tests/fixtures/host-policy/phase5-9/approval-evaluator-grant-boundary-contract.json"
    ],
    focusedTestFiles: [
      "tests/phase5-9-approval-evaluator-grant-boundary.test.mjs",
      "tests/report-phase-status.test.mjs"
    ],
    cliRuntimeSourceFilesChanged: [],
    rustRuntimeSourceFilesChanged: [],
    cliSourceChangedByThisPhase: false,
    appsCliIndexChangedByThisPhase: false,
    rustSourceChangedByThisPhase: false,
    machineReadableArtifactsChangedByThisPhase: true,
    reportRunsChecks: false,
    separateRuntimeImplementationPhaseRequired: true,
    separateRuntimeEnablementApprovalRequired: true
  });
  assert.deepEqual(inventory.contractSummary, {
    approvalEvaluatorGrantBoundaryRecorded: true,
    runtimeApprovalPrerequisiteOnly: true,
    commandExposureApprovalPrerequisiteOnly: true,
    combinedApprovalSignalsPrerequisiteOnly: true,
    approvalEvaluatorImplemented: false,
    approvalGrantProduced: false,
    approvalGrantSchema: "ardyn.runtime-approval-grant",
    approvalGrantSchemaVersion: "not-implemented",
    validRuntimeApprovalCreatesEvaluator: false,
    validCommandExposureApprovalCreatesEvaluator: false,
    validApprovalSignalsCreateGrant: false,
    validApprovalSignalsEnableRuntime: false,
    validApprovalSignalsStartRuntime: false,
    validApprovalSignalsExposeRuntimeExecution: false,
    runtimeEnabled: false,
    runtimeCommandEnabled: false,
    runtimeExecutionEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    requiresSeparateEvaluatorImplementationReview: true,
    requiresRemainingPhase56Preconditions: true,
    canEnableRuntime: false
  });
  assert.equal(inventory.boundarySignals.runtimeApprovalRecord.recognizedAsPrerequisite, true);
  assert.equal(inventory.boundarySignals.runtimeApprovalRecord.createsEvaluator, false);
  assert.equal(inventory.boundarySignals.runtimeApprovalRecord.createsGrant, false);
  assert.equal(
    inventory.boundarySignals.commandExposureApprovalRecord.recognizedAsPrerequisite,
    true
  );
  assert.equal(inventory.boundarySignals.commandExposureApprovalRecord.createsEvaluator, false);
  assert.equal(inventory.boundarySignals.commandExposureApprovalRecord.createsGrant, false);
  assert.deepEqual(inventory.boundarySignals.combinedPrerequisiteState, {
    runtimeApprovalValid: true,
    commandExposureApprovalValid: true,
    allPrerequisiteSignalsRecognized: true,
    evaluatorAvailable: false,
    grantAvailable: false,
    runtimeEnablementAllowed: false
  });
  assert.equal(
    inventory.evaluatorGrantBoundaryShape.futureEvaluatorKind,
    "runtime-approval-evaluator"
  );
  assert.equal(inventory.evaluatorGrantBoundaryShape.futureGrantKind, "runtime-approval-grant");
  assert.ok(
    inventory.evaluatorGrantBoundaryShape.requiredBeforeImplementation.includes(
      "separate-evaluator-design-review"
    )
  );
  assert.deepEqual(
    inventory.boundaryCases.map((boundaryCase) => boundaryCase.caseId),
    expectedCaseIds
  );
  for (const boundaryCase of inventory.boundaryCases) {
    assert.equal(boundaryCase.prerequisiteSignalRecognized, true, boundaryCase.caseId);
    assert.equal(boundaryCase.rejectedForRuntimeEnablement, true, boundaryCase.caseId);
    assertAllFalse(boundaryCase.evaluatorEffect);
    assertAllFalse(boundaryCase.runtimeEffect);
  }
  assert.deepEqual(inventory.validationRules, {
    validRuntimeApproval: "may_count_only_as_prerequisite_signal",
    validCommandExposureApproval: "may_count_only_as_prerequisite_signal",
    combinedApprovalSignals: "must_not_create_evaluator_or_grant",
    fakeGrantAttempt: "must_reject_before_runtime_enablement",
    validApprovalSignalsCannotCreateEvaluator: true,
    validApprovalSignalsCannotProduceGrant: true,
    validApprovalSignalsCannotEnableRuntime: true,
    validApprovalSignalsCannotStartRuntime: true,
    validApprovalSignalsCannotExposeRuntimeExecution: true,
    dryRunCannotBypassApprovalBoundary: true,
    separateFutureRuntimeEnablementReviewRequired: true
  });
  assertAllFalse(inventory.blockedRuntimeEffect);
  assert.deepEqual(inventory.serveRuntimeBlockedBehavior, {
    args: ["serve-runtime"],
    dryRunArgs: ["serve-runtime", "--dry-run"],
    recognizedByCli: true,
    exitCode: "nonzero",
    stdout: "",
    stderr:
      "Usage: ardyn serve-runtime [--dry-run]\nRuntime unavailable: serve-runtime is recognized, but runtime is not enabled in Phase 5.5.\n",
    runtimeExecution: false,
    writesFiles: false
  });
  assert.ok(inventory.forbiddenBehavior.includes("approval-evaluator-implemented"));
  assert.ok(inventory.forbiddenBehavior.includes("approval-grant-produced"));
  assert.deepEqual(inventory.safetyPosture, {
    approvalEvaluatorGrantBoundaryRecorded: true,
    runtimeApprovalPrerequisiteOnly: true,
    commandExposureApprovalPrerequisiteOnly: true,
    combinedApprovalSignalsPrerequisiteOnly: true,
    approvalEvaluatorImplemented: false,
    approvalGrantProduced: false,
    validApprovalSignalsCreateGrant: false,
    validApprovalSignalsEnableRuntime: false,
    validApprovalSignalsStartRuntime: false,
    validApprovalSignalsExposeRuntimeExecution: false,
    canEnableRuntime: false,
    runtimeBlocked: true,
    runtimeEnabled: false,
    runtimeStarted: false,
    runtimeReady: false,
    runtimeCommandEnabled: false,
    runtimeExecutionEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    approvalCommandEnabled: false,
    noLiveStdinLoop: true,
    noStdoutStderrWriters: true,
    noProcessControl: true,
    noTranscriptWrite: true,
    noFailureAuditWrite: true,
    noAdapterRuntimeBehavior: true,
    noContentFabricRuntimeBehavior: true,
    noWebSocketHttpSurface: true,
    noCliSourceChange: true,
    noRustSourceChange: true
  });
  assert.equal(report.safetyPosture.phase59ApprovalEvaluatorGrantBoundaryContract, true);
  assert.equal(report.safetyPosture.flags.phase59ApprovalEvaluatorGrantBoundaryRecorded, true);
  assert.equal(report.safetyPosture.flags.phase59RuntimeApprovalPrerequisiteOnly, true);
  assert.equal(report.safetyPosture.flags.phase59CommandExposureApprovalPrerequisiteOnly, true);
  assert.equal(report.safetyPosture.flags.phase59CombinedApprovalSignalsPrerequisiteOnly, true);
  assert.equal(report.safetyPosture.flags.phase59ApprovalEvaluatorImplemented, false);
  assert.equal(report.safetyPosture.flags.phase59ApprovalGrantProduced, false);
  assert.equal(report.safetyPosture.flags.phase59ValidApprovalSignalsCreateGrant, false);
  assert.equal(report.safetyPosture.flags.phase59ValidApprovalSignalsEnableRuntime, false);
  assert.equal(report.safetyPosture.flags.phase59ValidApprovalSignalsStartRuntime, false);
  assert.equal(
    report.safetyPosture.flags.phase59ValidApprovalSignalsExposeRuntimeExecution,
    false
  );
  assert.equal(report.safetyPosture.flags.phase59CanEnableRuntime, false);
  assert.equal(report.safetyPosture.flags.phase59RuntimeEnabled, false);
  assert.equal(report.safetyPosture.flags.phase59RuntimeStarted, false);
  assert.equal(report.safetyPosture.flags.phase59RuntimeReady, false);
  assert.equal(report.safetyPosture.flags.phase59RuntimeCommandEnabled, false);
  assert.equal(report.safetyPosture.flags.phase59RuntimeExecutionEnabled, false);
  assert.equal(report.safetyPosture.flags.phase59ServeRuntimeStillDefaultBlocked, true);
  assert.equal(report.safetyPosture.flags.phase59DryRunBypassesBlock, false);
  assert.equal(report.safetyPosture.flags.phase59ApprovalCommandEnabled, false);
  assert.equal(report.safetyPosture.flags.phase59CliSourceChanged, false);
  assert.equal(report.safetyPosture.flags.phase59RustSourceChanged, false);
  assert.equal(report.safetyPosture.flags.phase59ProcessControlEnabled, false);
  assert.equal(report.safetyPosture.flags.phase59StdoutStderrWritersEnabled, false);
  assert.equal(report.safetyPosture.flags.phase59TranscriptAuditSideEffectsEnabled, false);
  assert.equal(report.safetyPosture.flags.phase59AdapterRuntimeBehaviorEnabled, false);
  assert.equal(report.safetyPosture.flags.phase59ContentFabricRuntimeBehaviorEnabled, false);
  assert.equal(report.safetyPosture.flags.phase59WebSocketHttpSurfaceEnabled, false);
});

test("report inventories Phase 5.10 as runtime host-policy boundary with runtime blocked", async () => {
  const report = await runReport();
  const inventory = report.phase510RuntimeHostPolicyBoundaryInventory;
  const expectedCaseIds = [
    "missing-host-policy-enforcement",
    "invalid-host-policy-enforcement",
    "permissive-unbounded-host-policy-enforcement",
    "valid-restrictive-host-policy-prerequisite-only"
  ];

  assert.deepEqual(inventory.statusLayer, {
    document: "docs/phase-5-10-runtime-host-policy-boundary.md",
    fixture:
      "tests/fixtures/host-policy/phase5-10/runtime-host-policy-enforcement-boundary-contract.json",
    sourceApprovalEvaluatorGrantBoundaryDocument:
      "docs/phase-5-9-approval-evaluator-grant-boundary.md",
    sourceApprovalEvaluatorGrantBoundaryFixture:
      "tests/fixtures/host-policy/phase5-9/approval-evaluator-grant-boundary-contract.json",
    precedingPhase: "5.9",
    layerId: "runtime-host-policy-enforcement-boundary-contract",
    scope: "runtime-host-policy-boundary-only-runtime-disabled",
    runtimeHostPolicyBoundaryRecorded: true,
    hostPolicyRuntimeEnforcementRequired: true,
    hostPolicyRuntimeEnforcementImplemented: false,
    hostPolicyRuntimeEnforcementActive: false,
    missingHostPolicyEnforcementRejected: true,
    invalidHostPolicyEnforcementRejected: true,
    permissiveUnboundedHostPolicyEnforcementRejected: true,
    validRestrictiveHostPolicyPrerequisiteOnly: true,
    validRestrictiveHostPolicyEnablesRuntime: false,
    validRestrictiveHostPolicyStartsRuntime: false,
    validRestrictiveHostPolicyExposesRuntimeExecution: false,
    canEnableRuntime: false,
    runtimeEnabled: false,
    runtimeExecutionEnabled: false,
    runtimeCommandEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    hostPolicyCommandEnabled: false,
    approvalCommandEnabled: false,
    approvalEvaluatorImplemented: false,
    approvalGrantProduced: false,
    processControlEnabled: false,
    stdoutStderrWritersEnabled: false,
    transcriptAuditSideEffectsEnabled: false,
    adapterRuntimeBehaviorChanged: false,
    contentFabricRuntimeBehaviorChanged: false,
    webSocketHttpSurfaceEnabled: false,
    cliSourceChanged: false,
    rustSourceChanged: false,
    reportRunsChecks: false
  });

  assert.deepEqual(
    inventory.docs.map(({ path, status }) => [path, status]),
    phase510DocFiles.map((path) => [path, "present"])
  );
  assert.deepEqual(inventory.crossLinks, phase510CrossLinks);
  assertKnownInventoryStatuses(inventory.machineReadableArtifacts);
  assert.deepEqual(inventory.machineReadableArtifacts.map(({ path }) => path), [
    "tests/fixtures/host-policy/phase5-10/runtime-host-policy-enforcement-boundary-contract.json"
  ]);
  assertKnownInventoryStatuses(inventory.tests);
  assert.deepEqual(inventory.tests.map(({ path }) => path), [
    "tests/report-phase-status.test.mjs",
    "tests/phase5-10-runtime-host-policy-boundary.test.mjs"
  ]);
  assert.deepEqual(inventory.ownershipBoundary, {
    docsStatusFiles: [
      "README.md",
      "apps/cli/README.md",
      "crates/ardyn-host/README.md",
      "docs/phase-5-9-approval-evaluator-grant-boundary.md",
      "docs/phase-5-10-runtime-host-policy-boundary.md",
      "scripts/report-phase-status.mjs",
      "tests/report-phase-status.test.mjs"
    ],
    machineReadableArtifactFiles: [
      "tests/fixtures/host-policy/phase5-10/runtime-host-policy-enforcement-boundary-contract.json"
    ],
    focusedTestFiles: [
      "tests/phase5-10-runtime-host-policy-boundary.test.mjs",
      "tests/report-phase-status.test.mjs"
    ],
    cliRuntimeSourceFilesChanged: [],
    rustRuntimeSourceFilesChanged: [],
    cliSourceChangedByThisPhase: false,
    appsCliIndexChangedByThisPhase: false,
    rustSourceChangedByThisPhase: false,
    machineReadableArtifactsChangedByThisPhase: true,
    reportRunsChecks: false,
    separateRuntimeImplementationPhaseRequired: true,
    separateRuntimeEnablementApprovalRequired: true
  });
  assert.deepEqual(inventory.contractSummary, {
    runtimeHostPolicyBoundaryRecorded: true,
    hostPolicyRuntimeEnforcementRequired: true,
    hostPolicyRuntimeEnforcementImplemented: false,
    hostPolicyRuntimeEnforcementActive: false,
    missingHostPolicyEnforcementRejected: true,
    invalidHostPolicyEnforcementRejected: true,
    permissiveUnboundedHostPolicyEnforcementRejected: true,
    validRestrictiveHostPolicyPrerequisiteOnly: true,
    validRestrictiveHostPolicyEnablesRuntime: false,
    validRestrictiveHostPolicyStartsRuntime: false,
    validRestrictiveHostPolicyExposesRuntimeExecution: false,
    runtimeEnabled: false,
    runtimeCommandEnabled: false,
    runtimeExecutionEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    requiresSeparateHostPolicyRuntimeImplementationReview: true,
    requiresRemainingPhase56Preconditions: true,
    canEnableRuntime: false
  });
  assert.equal(
    inventory.hostPolicyBoundaryShape.futureEnforcementKind,
    "runtime-host-policy-enforcement"
  );
  assert.ok(
    inventory.hostPolicyBoundaryShape.requiredBeforeRuntimeEnablement.includes(
      "restrictive-host-policy-runtime-enforcement"
    )
  );
  assert.ok(
    inventory.hostPolicyBoundaryShape.rejectedEnforcementShapes.includes(
      "permissive-host-policy-enforcement"
    )
  );
  assert.ok(
    inventory.hostPolicyBoundaryShape.requiredRestrictiveControls.includes(
      "deny-by-default-runtime-actions"
    )
  );
  assert.deepEqual(
    inventory.hostPolicyEnforcementCases.map((boundaryCase) => boundaryCase.caseId),
    expectedCaseIds
  );
  for (const boundaryCase of inventory.hostPolicyEnforcementCases) {
    assert.equal(boundaryCase.rejectedForRuntimeEnablement, true, boundaryCase.caseId);
    assertAllFalse(boundaryCase.enforcementEffect);
    assertAllFalse(boundaryCase.runtimeEffect);
  }
  assert.deepEqual(inventory.validationRules, {
    missingHostPolicyEnforcement: "must_reject_before_runtime_enablement",
    invalidHostPolicyEnforcement: "must_reject_before_runtime_enablement",
    permissiveUnboundedHostPolicyEnforcement: "must_reject_before_runtime_enablement",
    validRestrictiveHostPolicy: "may_count_only_as_prerequisite_signal",
    validRestrictiveHostPolicyCannotEnableRuntime: true,
    validRestrictiveHostPolicyCannotStartRuntime: true,
    validRestrictiveHostPolicyCannotExposeRuntimeExecution: true,
    validRestrictiveHostPolicyCannotBypassApprovalEvaluatorOrGrant: true,
    validRestrictiveHostPolicyCannotBypassRemainingPhase56Preconditions: true,
    dryRunCannotBypassHostPolicyBoundary: true,
    separateFutureRuntimeEnablementReviewRequired: true
  });
  assertAllFalse(inventory.blockedRuntimeEffect);
  assert.deepEqual(inventory.serveRuntimeBlockedBehavior, {
    args: ["serve-runtime"],
    dryRunArgs: ["serve-runtime", "--dry-run"],
    recognizedByCli: true,
    exitCode: "nonzero",
    stdout: "",
    stderr:
      "Usage: ardyn serve-runtime [--dry-run]\nRuntime unavailable: serve-runtime is recognized, but runtime is not enabled in Phase 5.5.\n",
    runtimeExecution: false,
    writesFiles: false
  });
  assert.ok(inventory.forbiddenBehavior.includes("host-policy-runtime-enforcement-implemented"));
  assert.ok(inventory.forbiddenBehavior.includes("host-policy-command-enabled"));
  assert.deepEqual(inventory.safetyPosture, {
    runtimeHostPolicyBoundaryRecorded: true,
    hostPolicyRuntimeEnforcementRequired: true,
    hostPolicyRuntimeEnforcementImplemented: false,
    hostPolicyRuntimeEnforcementActive: false,
    missingHostPolicyEnforcementRejected: true,
    invalidHostPolicyEnforcementRejected: true,
    permissiveUnboundedHostPolicyEnforcementRejected: true,
    validRestrictiveHostPolicyPrerequisiteOnly: true,
    validRestrictiveHostPolicyEnablesRuntime: false,
    validRestrictiveHostPolicyStartsRuntime: false,
    validRestrictiveHostPolicyExposesRuntimeExecution: false,
    canEnableRuntime: false,
    runtimeBlocked: true,
    runtimeEnabled: false,
    runtimeStarted: false,
    runtimeReady: false,
    runtimeCommandEnabled: false,
    runtimeExecutionEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    hostPolicyCommandEnabled: false,
    approvalCommandEnabled: false,
    noLiveStdinLoop: true,
    noStdoutStderrWriters: true,
    noProcessControl: true,
    noTranscriptWrite: true,
    noFailureAuditWrite: true,
    noAdapterRuntimeBehavior: true,
    noContentFabricRuntimeBehavior: true,
    noWebSocketHttpSurface: true,
    noCliSourceChange: true,
    noRustSourceChange: true
  });
  assert.equal(report.safetyPosture.phase510RuntimeHostPolicyBoundaryContract, true);
  assert.equal(report.safetyPosture.flags.phase510RuntimeHostPolicyBoundaryRecorded, true);
  assert.equal(report.safetyPosture.flags.phase510HostPolicyRuntimeEnforcementRequired, true);
  assert.equal(report.safetyPosture.flags.phase510HostPolicyRuntimeEnforcementImplemented, false);
  assert.equal(report.safetyPosture.flags.phase510HostPolicyRuntimeEnforcementActive, false);
  assert.equal(report.safetyPosture.flags.phase510MissingHostPolicyEnforcementRejected, true);
  assert.equal(report.safetyPosture.flags.phase510InvalidHostPolicyEnforcementRejected, true);
  assert.equal(
    report.safetyPosture.flags.phase510PermissiveUnboundedHostPolicyEnforcementRejected,
    true
  );
  assert.equal(report.safetyPosture.flags.phase510ValidRestrictiveHostPolicyPrerequisiteOnly, true);
  assert.equal(report.safetyPosture.flags.phase510ValidRestrictiveHostPolicyEnablesRuntime, false);
  assert.equal(report.safetyPosture.flags.phase510ValidRestrictiveHostPolicyStartsRuntime, false);
  assert.equal(
    report.safetyPosture.flags.phase510ValidRestrictiveHostPolicyExposesRuntimeExecution,
    false
  );
  assert.equal(report.safetyPosture.flags.phase510CanEnableRuntime, false);
  assert.equal(report.safetyPosture.flags.phase510RuntimeEnabled, false);
  assert.equal(report.safetyPosture.flags.phase510RuntimeStarted, false);
  assert.equal(report.safetyPosture.flags.phase510RuntimeReady, false);
  assert.equal(report.safetyPosture.flags.phase510RuntimeCommandEnabled, false);
  assert.equal(report.safetyPosture.flags.phase510RuntimeExecutionEnabled, false);
  assert.equal(report.safetyPosture.flags.phase510ServeRuntimeStillDefaultBlocked, true);
  assert.equal(report.safetyPosture.flags.phase510DryRunBypassesBlock, false);
  assert.equal(report.safetyPosture.flags.phase510HostPolicyCommandEnabled, false);
  assert.equal(report.safetyPosture.flags.phase510ApprovalCommandEnabled, false);
  assert.equal(report.safetyPosture.flags.phase510CliSourceChanged, false);
  assert.equal(report.safetyPosture.flags.phase510RustSourceChanged, false);
  assert.equal(report.safetyPosture.flags.phase510ProcessControlEnabled, false);
  assert.equal(report.safetyPosture.flags.phase510StdoutStderrWritersEnabled, false);
  assert.equal(report.safetyPosture.flags.phase510TranscriptAuditSideEffectsEnabled, false);
  assert.equal(report.safetyPosture.flags.phase510AdapterRuntimeBehaviorEnabled, false);
  assert.equal(report.safetyPosture.flags.phase510ContentFabricRuntimeBehaviorEnabled, false);
  assert.equal(report.safetyPosture.flags.phase510WebSocketHttpSurfaceEnabled, false);
});

test("report inventories Phase 5.11 as runtime stdio safety boundary with runtime blocked", async () => {
  const report = await runReport();
  const inventory = report.phase511RuntimeStdioSafetyBoundaryInventory;
  const expectedCaseIds = [
    "missing-stdio-safety",
    "invalid-stdio-safety",
    "unbounded-stdin-stdout-stderr-behavior",
    "valid-restrictive-stdio-safety-prerequisite-only"
  ];

  assert.deepEqual(inventory.statusLayer, {
    document: "docs/phase-5-11-runtime-stdio-safety-boundary.md",
    fixture:
      "tests/fixtures/host-policy/phase5-11/runtime-stdio-safety-boundary-contract.json",
    sourceRuntimeHostPolicyBoundaryDocument:
      "docs/phase-5-10-runtime-host-policy-boundary.md",
    sourceRuntimeHostPolicyBoundaryFixture:
      "tests/fixtures/host-policy/phase5-10/runtime-host-policy-enforcement-boundary-contract.json",
    precedingPhase: "5.10",
    layerId: "runtime-stdio-safety-boundary-contract",
    scope: "runtime-stdio-safety-boundary-only-runtime-disabled",
    runtimeStdioSafetyBoundaryRecorded: true,
    stdioSafetyRequiredBeforeRuntimeEnablement: true,
    stdioSafetyImplemented: false,
    stdioSafetyActive: false,
    missingStdioSafetyRejected: true,
    invalidStdioSafetyRejected: true,
    unboundedStdinStdoutStderrBehaviorRejected: true,
    validRestrictiveStdioSafetyPrerequisiteOnly: true,
    validRestrictiveStdioSafetyEnablesRuntime: false,
    validRestrictiveStdioSafetyStartsRuntime: false,
    validRestrictiveStdioSafetyExposesRuntimeExecution: false,
    canEnableRuntime: false,
    runtimeEnabled: false,
    runtimeExecutionEnabled: false,
    runtimeCommandEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    stdioSafetyCommandEnabled: false,
    liveStdinLoopEnabled: false,
    runtimeStdoutWriterEnabled: false,
    runtimeStderrWriterEnabled: false,
    approvalCommandEnabled: false,
    approvalEvaluatorImplemented: false,
    approvalGrantProduced: false,
    processControlEnabled: false,
    transcriptAuditSideEffectsEnabled: false,
    adapterRuntimeBehaviorChanged: false,
    contentFabricRuntimeBehaviorChanged: false,
    webSocketHttpSurfaceEnabled: false,
    cliSourceChanged: false,
    rustSourceChanged: false,
    reportRunsChecks: false
  });

  assert.deepEqual(
    inventory.docs.map(({ path, status }) => [path, status]),
    phase511DocFiles.map((path) => [path, "present"])
  );
  assert.deepEqual(inventory.crossLinks, phase511CrossLinks);
  assertKnownInventoryStatuses(inventory.machineReadableArtifacts);
  assert.deepEqual(inventory.machineReadableArtifacts.map(({ path }) => path), [
    "tests/fixtures/host-policy/phase5-11/runtime-stdio-safety-boundary-contract.json"
  ]);
  assertKnownInventoryStatuses(inventory.tests);
  assert.deepEqual(inventory.tests.map(({ path }) => path), [
    "tests/report-phase-status.test.mjs",
    "tests/phase5-11-runtime-stdio-safety-boundary.test.mjs"
  ]);
  assert.deepEqual(inventory.ownershipBoundary, {
    docsStatusFiles: [
      "README.md",
      "apps/cli/README.md",
      "crates/ardyn-host/README.md",
      "docs/phase-5-10-runtime-host-policy-boundary.md",
      "docs/phase-5-11-runtime-stdio-safety-boundary.md",
      "scripts/report-phase-status.mjs",
      "tests/report-phase-status.test.mjs"
    ],
    machineReadableArtifactFiles: [
      "tests/fixtures/host-policy/phase5-11/runtime-stdio-safety-boundary-contract.json"
    ],
    focusedTestFiles: [
      "tests/phase5-11-runtime-stdio-safety-boundary.test.mjs",
      "tests/report-phase-status.test.mjs"
    ],
    cliRuntimeSourceFilesChanged: [],
    rustRuntimeSourceFilesChanged: [],
    cliSourceChangedByThisPhase: false,
    appsCliIndexChangedByThisPhase: false,
    rustSourceChangedByThisPhase: false,
    machineReadableArtifactsChangedByThisPhase: true,
    reportRunsChecks: false,
    separateRuntimeImplementationPhaseRequired: true,
    separateRuntimeEnablementApprovalRequired: true
  });
  assert.deepEqual(inventory.contractSummary, {
    runtimeStdioSafetyBoundaryRecorded: true,
    stdioSafetyRequiredBeforeRuntimeEnablement: true,
    stdioSafetyImplemented: false,
    stdioSafetyActive: false,
    missingStdioSafetyRejected: true,
    invalidStdioSafetyRejected: true,
    unboundedStdinStdoutStderrBehaviorRejected: true,
    validRestrictiveStdioSafetyPrerequisiteOnly: true,
    validRestrictiveStdioSafetyEnablesRuntime: false,
    validRestrictiveStdioSafetyStartsRuntime: false,
    validRestrictiveStdioSafetyExposesRuntimeExecution: false,
    runtimeEnabled: false,
    runtimeCommandEnabled: false,
    runtimeExecutionEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    requiresSeparateStdioRuntimeImplementationReview: true,
    requiresRemainingPhase56Preconditions: true,
    canEnableRuntime: false
  });
  assert.equal(inventory.stdioSafetyBoundaryShape.futureSafetyKind, "runtime-stdio-safety");
  assert.ok(
    inventory.stdioSafetyBoundaryShape.requiredBeforeRuntimeEnablement.includes(
      "bounded-stdin-read-policy"
    )
  );
  assert.ok(
    inventory.stdioSafetyBoundaryShape.rejectedSafetyShapes.includes(
      "unbounded-stdin-stdout-stderr-behavior"
    )
  );
  assert.ok(
    inventory.stdioSafetyBoundaryShape.requiredRestrictiveControls.includes(
      "bounded-stdout-stderr-framing-redaction-and-backpressure"
    )
  );
  assert.deepEqual(
    inventory.stdioSafetyCases.map((boundaryCase) => boundaryCase.caseId),
    expectedCaseIds
  );
  for (const boundaryCase of inventory.stdioSafetyCases) {
    assert.equal(boundaryCase.rejectedForRuntimeEnablement, true);
    assertAllFalse(boundaryCase.stdioEffect);
    assertAllFalse(boundaryCase.runtimeEffect);
  }
  assert.equal(inventory.validationRules.validRestrictiveStdioSafetyCannotEnableRuntime, true);
  assert.equal(inventory.validationRules.validRestrictiveStdioSafetyCannotStartRuntime, true);
  assert.equal(
    inventory.validationRules.validRestrictiveStdioSafetyCannotExposeRuntimeExecution,
    true
  );
  assertAllFalse(inventory.blockedRuntimeEffect);
  assert.equal(inventory.serveRuntimeBlockedBehavior.recognizedByCli, true);
  assert.equal(inventory.serveRuntimeBlockedBehavior.runtimeExecution, false);
  assert.equal(inventory.serveRuntimeBlockedBehavior.writesFiles, false);
  assert.ok(inventory.forbiddenBehavior.includes("live-stdin-loop"));
  assert.ok(inventory.forbiddenBehavior.includes("runtime-stdout-writer"));
  assert.ok(inventory.forbiddenBehavior.includes("runtime-stderr-writer"));
  assert.deepEqual(inventory.safetyPosture, {
    runtimeStdioSafetyBoundaryRecorded: true,
    stdioSafetyRequiredBeforeRuntimeEnablement: true,
    stdioSafetyImplemented: false,
    stdioSafetyActive: false,
    missingStdioSafetyRejected: true,
    invalidStdioSafetyRejected: true,
    unboundedStdinStdoutStderrBehaviorRejected: true,
    validRestrictiveStdioSafetyPrerequisiteOnly: true,
    validRestrictiveStdioSafetyEnablesRuntime: false,
    validRestrictiveStdioSafetyStartsRuntime: false,
    validRestrictiveStdioSafetyExposesRuntimeExecution: false,
    canEnableRuntime: false,
    runtimeBlocked: true,
    runtimeEnabled: false,
    runtimeStarted: false,
    runtimeReady: false,
    runtimeCommandEnabled: false,
    runtimeExecutionEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    stdioSafetyCommandEnabled: false,
    liveStdinLoopEnabled: false,
    runtimeStdoutWriterEnabled: false,
    runtimeStderrWriterEnabled: false,
    approvalCommandEnabled: false,
    noLiveStdinLoop: true,
    noStdoutStderrWriters: true,
    noProcessControl: true,
    noTranscriptWrite: true,
    noFailureAuditWrite: true,
    noAdapterRuntimeBehavior: true,
    noContentFabricRuntimeBehavior: true,
    noWebSocketHttpSurface: true,
    noCliSourceChange: true,
    noRustSourceChange: true
  });
  assert.equal(report.safetyPosture.phase511RuntimeStdioSafetyBoundaryContract, true);
  assert.equal(report.safetyPosture.flags.phase511RuntimeEnabled, false);
  assert.equal(report.safetyPosture.flags.phase511RuntimeCommandEnabled, false);
  assert.equal(report.safetyPosture.flags.phase511RuntimeExecutionEnabled, false);
  assert.equal(report.safetyPosture.flags.phase511LiveStdinLoopEnabled, false);
  assert.equal(report.safetyPosture.flags.phase511RuntimeStdoutWriterEnabled, false);
  assert.equal(report.safetyPosture.flags.phase511RuntimeStderrWriterEnabled, false);
  assert.equal(report.safetyPosture.flags.phase511ProcessControlEnabled, false);
  assert.equal(report.safetyPosture.flags.phase511TranscriptAuditSideEffectsEnabled, false);
  assert.equal(report.safetyPosture.flags.phase511WebSocketHttpSurfaceEnabled, false);
});

test("report inventories Phase 5.12 as runtime transcript/audit boundary with runtime blocked", async () => {
  const report = await runReport();
  const inventory = report.phase512RuntimeTranscriptAuditBoundaryInventory;
  const expectedCaseIds = [
    "missing-transcript-audit-confinement",
    "invalid-transcript-audit-confinement",
    "unbounded-runtime-transcript-audit-writes",
    "valid-restrictive-transcript-audit-confinement-prerequisite-only"
  ];

  assert.deepEqual(inventory.statusLayer, {
    document: "docs/phase-5-12-runtime-transcript-audit-boundary.md",
    fixture:
      "tests/fixtures/host-policy/phase5-12/runtime-transcript-audit-confinement-boundary-contract.json",
    sourceRuntimeStdioSafetyBoundaryDocument:
      "docs/phase-5-11-runtime-stdio-safety-boundary.md",
    sourceRuntimeStdioSafetyBoundaryFixture:
      "tests/fixtures/host-policy/phase5-11/runtime-stdio-safety-boundary-contract.json",
    precedingPhase: "5.11",
    layerId: "runtime-transcript-audit-confinement-boundary-contract",
    scope: "runtime-transcript-audit-boundary-only-runtime-disabled",
    runtimeTranscriptAuditBoundaryRecorded: true,
    transcriptAuditConfinementRequiredBeforeRuntimeEnablement: true,
    transcriptAuditConfinementImplemented: false,
    transcriptAuditConfinementActive: false,
    missingTranscriptAuditConfinementRejected: true,
    invalidTranscriptAuditConfinementRejected: true,
    unboundedRuntimeTranscriptAuditWritesRejected: true,
    validRestrictiveTranscriptAuditConfinementPrerequisiteOnly: true,
    validRestrictiveTranscriptAuditConfinementEnablesRuntime: false,
    validRestrictiveTranscriptAuditConfinementStartsRuntime: false,
    validRestrictiveTranscriptAuditConfinementExposesRuntimeExecution: false,
    canEnableRuntime: false,
    runtimeEnabled: false,
    runtimeExecutionEnabled: false,
    runtimeCommandEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    transcriptAuditConfinementCommandEnabled: false,
    transcriptAuditConfinementImplemented: false,
    transcriptAuditConfinementActive: false,
    transcriptAuditConfinementEvaluated: false,
    runtimeTranscriptWriterEnabled: false,
    runtimeAuditWriterEnabled: false,
    runtimeTranscriptWritePerformed: false,
    runtimeAuditWritePerformed: false,
    stdioSafetyCommandEnabled: false,
    liveStdinLoopEnabled: false,
    runtimeStdoutWriterEnabled: false,
    runtimeStderrWriterEnabled: false,
    approvalCommandEnabled: false,
    approvalEvaluatorImplemented: false,
    approvalGrantProduced: false,
    processControlEnabled: false,
    hostPolicyRuntimeEnforcementImplemented: false,
    hostPolicyRuntimeEnforcementActive: false,
    adapterRuntimeBehaviorChanged: false,
    contentFabricRuntimeBehaviorChanged: false,
    webSocketHttpSurfaceEnabled: false,
    cliSourceChanged: false,
    rustSourceChanged: false,
    reportRunsChecks: false
  });

  assert.deepEqual(
    inventory.docs.map(({ path, status }) => [path, status]),
    phase512DocFiles.map((path) => [path, "present"])
  );
  assert.deepEqual(inventory.crossLinks, phase512CrossLinks);
  assertKnownInventoryStatuses(inventory.machineReadableArtifacts);
  assert.deepEqual(inventory.machineReadableArtifacts.map(({ path }) => path), [
    "tests/fixtures/host-policy/phase5-12/runtime-transcript-audit-confinement-boundary-contract.json"
  ]);
  assertKnownInventoryStatuses(inventory.tests);
  assert.deepEqual(inventory.tests.map(({ path }) => path), [
    "tests/report-phase-status.test.mjs",
    "tests/phase5-12-runtime-transcript-audit-boundary.test.mjs"
  ]);
  assert.deepEqual(inventory.ownershipBoundary, {
    docsStatusFiles: [
      "README.md",
      "apps/cli/README.md",
      "crates/ardyn-host/README.md",
      "docs/phase-5-11-runtime-stdio-safety-boundary.md",
      "docs/phase-5-12-runtime-transcript-audit-boundary.md",
      "scripts/report-phase-status.mjs",
      "tests/report-phase-status.test.mjs"
    ],
    machineReadableArtifactFiles: [
      "tests/fixtures/host-policy/phase5-12/runtime-transcript-audit-confinement-boundary-contract.json"
    ],
    focusedTestFiles: [
      "tests/phase5-12-runtime-transcript-audit-boundary.test.mjs",
      "tests/report-phase-status.test.mjs"
    ],
    cliRuntimeSourceFilesChanged: [],
    rustRuntimeSourceFilesChanged: [],
    cliSourceChangedByThisPhase: false,
    appsCliIndexChangedByThisPhase: false,
    rustSourceChangedByThisPhase: false,
    machineReadableArtifactsChangedByThisPhase: true,
    reportRunsChecks: false,
    separateRuntimeImplementationPhaseRequired: true,
    separateRuntimeEnablementApprovalRequired: true
  });
  assert.deepEqual(inventory.contractSummary, {
    runtimeTranscriptAuditBoundaryRecorded: true,
    transcriptAuditConfinementRequiredBeforeRuntimeEnablement: true,
    transcriptAuditConfinementImplemented: false,
    transcriptAuditConfinementActive: false,
    missingTranscriptAuditConfinementRejected: true,
    invalidTranscriptAuditConfinementRejected: true,
    unboundedRuntimeTranscriptAuditWritesRejected: true,
    validRestrictiveTranscriptAuditConfinementPrerequisiteOnly: true,
    validRestrictiveTranscriptAuditConfinementEnablesRuntime: false,
    validRestrictiveTranscriptAuditConfinementStartsRuntime: false,
    validRestrictiveTranscriptAuditConfinementExposesRuntimeExecution: false,
    runtimeEnabled: false,
    runtimeCommandEnabled: false,
    runtimeExecutionEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    requiresSeparateTranscriptAuditRuntimeImplementationReview: true,
    requiresRemainingPhase56Preconditions: true,
    canEnableRuntime: false
  });
  assert.equal(
    inventory.transcriptAuditConfinementBoundaryShape.futureConfinementKind,
    "runtime-transcript-audit-confinement"
  );
  assert.ok(
    inventory.transcriptAuditConfinementBoundaryShape.requiredBeforeRuntimeEnablement.includes(
      "bounded-transcript-write-policy"
    )
  );
  assert.ok(
    inventory.transcriptAuditConfinementBoundaryShape.requiredBeforeRuntimeEnablement.includes(
      "bounded-audit-write-policy"
    )
  );
  assert.ok(
    inventory.transcriptAuditConfinementBoundaryShape.rejectedConfinementShapes.includes(
      "unbounded-runtime-transcript-audit-writes"
    )
  );
  assert.ok(
    inventory.transcriptAuditConfinementBoundaryShape.requiredRestrictiveControls.includes(
      "no-transcript-or-audit-runtime-side-effects-through-dry-run"
    )
  );
  assert.deepEqual(
    inventory.transcriptAuditConfinementCases.map((boundaryCase) => boundaryCase.caseId),
    expectedCaseIds
  );
  for (const boundaryCase of inventory.transcriptAuditConfinementCases) {
    assert.equal(boundaryCase.rejectedForRuntimeEnablement, true);
    assertAllFalse(boundaryCase.transcriptAuditEffect);
    assertAllFalse(boundaryCase.runtimeEffect);
  }
  assert.equal(
    inventory.validationRules.validRestrictiveTranscriptAuditConfinementCannotEnableRuntime,
    true
  );
  assert.equal(
    inventory.validationRules.validRestrictiveTranscriptAuditConfinementCannotStartRuntime,
    true
  );
  assert.equal(
    inventory.validationRules
      .validRestrictiveTranscriptAuditConfinementCannotExposeRuntimeExecution,
    true
  );
  assert.equal(
    inventory.validationRules.validRestrictiveTranscriptAuditConfinementCannotBypassStdioSafetyBoundary,
    true
  );
  assertAllFalse(inventory.blockedRuntimeEffect);
  assert.equal(inventory.serveRuntimeBlockedBehavior.recognizedByCli, true);
  assert.equal(inventory.serveRuntimeBlockedBehavior.runtimeExecution, false);
  assert.equal(inventory.serveRuntimeBlockedBehavior.writesFiles, false);
  assert.ok(inventory.forbiddenBehavior.includes("runtime-transcript-write"));
  assert.ok(inventory.forbiddenBehavior.includes("runtime-audit-write"));
  assert.ok(inventory.forbiddenBehavior.includes("live-stdin-loop"));
  assert.deepEqual(inventory.safetyPosture, {
    runtimeTranscriptAuditBoundaryRecorded: true,
    transcriptAuditConfinementRequiredBeforeRuntimeEnablement: true,
    transcriptAuditConfinementImplemented: false,
    transcriptAuditConfinementActive: false,
    missingTranscriptAuditConfinementRejected: true,
    invalidTranscriptAuditConfinementRejected: true,
    unboundedRuntimeTranscriptAuditWritesRejected: true,
    validRestrictiveTranscriptAuditConfinementPrerequisiteOnly: true,
    validRestrictiveTranscriptAuditConfinementEnablesRuntime: false,
    validRestrictiveTranscriptAuditConfinementStartsRuntime: false,
    validRestrictiveTranscriptAuditConfinementExposesRuntimeExecution: false,
    canEnableRuntime: false,
    runtimeBlocked: true,
    runtimeEnabled: false,
    runtimeStarted: false,
    runtimeReady: false,
    runtimeCommandEnabled: false,
    runtimeExecutionEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    transcriptAuditConfinementCommandEnabled: false,
    transcriptAuditConfinementImplemented: false,
    transcriptAuditConfinementActive: false,
    transcriptAuditConfinementEvaluated: false,
    runtimeTranscriptWriterEnabled: false,
    runtimeAuditWriterEnabled: false,
    runtimeTranscriptWritePerformed: false,
    runtimeAuditWritePerformed: false,
    stdioSafetyCommandEnabled: false,
    liveStdinLoopEnabled: false,
    runtimeStdoutWriterEnabled: false,
    runtimeStderrWriterEnabled: false,
    approvalCommandEnabled: false,
    noLiveStdinLoop: true,
    noStdoutStderrWriters: true,
    noProcessControl: true,
    noTranscriptWrite: true,
    noFailureAuditWrite: true,
    noTranscriptAuditRuntimeWrites: true,
    noAdapterRuntimeBehavior: true,
    noContentFabricRuntimeBehavior: true,
    noWebSocketHttpSurface: true,
    noCliSourceChange: true,
    noRustSourceChange: true
  });
  assert.equal(report.safetyPosture.phase512RuntimeTranscriptAuditBoundaryContract, true);
  assert.equal(report.safetyPosture.flags.phase512RuntimeEnabled, false);
  assert.equal(report.safetyPosture.flags.phase512RuntimeCommandEnabled, false);
  assert.equal(report.safetyPosture.flags.phase512RuntimeExecutionEnabled, false);
  assert.equal(report.safetyPosture.flags.phase512RuntimeTranscriptWriterEnabled, false);
  assert.equal(report.safetyPosture.flags.phase512RuntimeAuditWriterEnabled, false);
  assert.equal(report.safetyPosture.flags.phase512RuntimeTranscriptWritePerformed, false);
  assert.equal(report.safetyPosture.flags.phase512RuntimeAuditWritePerformed, false);
  assert.equal(report.safetyPosture.flags.phase512ProcessControlEnabled, false);
  assert.equal(report.safetyPosture.flags.phase512WebSocketHttpSurfaceEnabled, false);
});

test("report inventories Phase 5.13 as runtime process-control boundary with runtime blocked", async () => {
  const report = await runReport();
  const inventory = report.phase513RuntimeProcessControlBoundaryInventory;
  const expectedCaseIds = [
    "missing-process-control-boundary",
    "invalid-process-control-boundary",
    "unbounded-process-spawning-termination-supervision",
    "valid-restrictive-process-control-boundary-prerequisite-only"
  ];

  assert.deepEqual(inventory.statusLayer, {
    document: "docs/phase-5-13-runtime-process-control-boundary.md",
    fixture:
      "tests/fixtures/host-policy/phase5-13/runtime-process-control-boundary-contract.json",
    sourceRuntimeTranscriptAuditBoundaryDocument:
      "docs/phase-5-12-runtime-transcript-audit-boundary.md",
    sourceRuntimeTranscriptAuditBoundaryFixture:
      "tests/fixtures/host-policy/phase5-12/runtime-transcript-audit-confinement-boundary-contract.json",
    precedingPhase: "5.12",
    layerId: "runtime-process-control-boundary-contract",
    scope: "runtime-process-control-boundary-only-runtime-disabled",
    runtimeProcessControlBoundaryRecorded: true,
    processControlRequiredBeforeRuntimeEnablement: true,
    processControlBoundaryImplemented: false,
    processControlBoundaryActive: false,
    missingProcessControlBoundaryRejected: true,
    invalidProcessControlBoundaryRejected: true,
    unboundedProcessSpawningTerminationSupervisionRejected: true,
    validRestrictiveProcessControlBoundaryPrerequisiteOnly: true,
    validRestrictiveProcessControlBoundaryEnablesRuntime: false,
    validRestrictiveProcessControlBoundaryStartsRuntime: false,
    validRestrictiveProcessControlBoundaryExposesRuntimeExecution: false,
    canEnableRuntime: false,
    runtimeEnabled: false,
    runtimeExecutionEnabled: false,
    runtimeCommandEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    processControlCommandEnabled: false,
    processControlBoundaryImplemented: false,
    processControlBoundaryActive: false,
    processControlBoundaryEvaluated: false,
    processSpawnEnabled: false,
    processTerminationEnabled: false,
    runtimeSupervisionEnabled: false,
    childProcessManaged: false,
    processSignalSent: false,
    processWaitPerformed: false,
    transcriptAuditConfinementCommandEnabled: false,
    transcriptAuditConfinementImplemented: false,
    transcriptAuditConfinementActive: false,
    runtimeTranscriptWriterEnabled: false,
    runtimeAuditWriterEnabled: false,
    runtimeTranscriptWritePerformed: false,
    runtimeAuditWritePerformed: false,
    stdioSafetyCommandEnabled: false,
    liveStdinLoopEnabled: false,
    runtimeStdoutWriterEnabled: false,
    runtimeStderrWriterEnabled: false,
    approvalCommandEnabled: false,
    approvalEvaluatorImplemented: false,
    approvalGrantProduced: false,
    hostPolicyRuntimeEnforcementImplemented: false,
    hostPolicyRuntimeEnforcementActive: false,
    adapterRuntimeBehaviorChanged: false,
    contentFabricRuntimeBehaviorChanged: false,
    webSocketHttpSurfaceEnabled: false,
    cliSourceChanged: false,
    rustSourceChanged: false,
    reportRunsChecks: false
  });

  assert.deepEqual(
    inventory.docs.map(({ path, status }) => [path, status]),
    phase513DocFiles.map((path) => [path, "present"])
  );
  assert.deepEqual(inventory.crossLinks, phase513CrossLinks);
  assertKnownInventoryStatuses(inventory.machineReadableArtifacts);
  assert.deepEqual(inventory.machineReadableArtifacts.map(({ path }) => path), [
    "tests/fixtures/host-policy/phase5-13/runtime-process-control-boundary-contract.json"
  ]);
  assertKnownInventoryStatuses(inventory.tests);
  assert.deepEqual(inventory.tests.map(({ path }) => path), [
    "tests/report-phase-status.test.mjs",
    "tests/phase5-13-runtime-process-control-boundary.test.mjs"
  ]);
  assert.deepEqual(inventory.ownershipBoundary, {
    docsStatusFiles: [
      "README.md",
      "apps/cli/README.md",
      "crates/ardyn-host/README.md",
      "docs/phase-5-12-runtime-transcript-audit-boundary.md",
      "docs/phase-5-13-runtime-process-control-boundary.md",
      "scripts/report-phase-status.mjs",
      "tests/report-phase-status.test.mjs"
    ],
    machineReadableArtifactFiles: [
      "tests/fixtures/host-policy/phase5-13/runtime-process-control-boundary-contract.json"
    ],
    focusedTestFiles: [
      "tests/phase5-13-runtime-process-control-boundary.test.mjs",
      "tests/report-phase-status.test.mjs"
    ],
    cliRuntimeSourceFilesChanged: [],
    rustRuntimeSourceFilesChanged: [],
    cliSourceChangedByThisPhase: false,
    appsCliIndexChangedByThisPhase: false,
    rustSourceChangedByThisPhase: false,
    machineReadableArtifactsChangedByThisPhase: true,
    reportRunsChecks: false,
    separateRuntimeImplementationPhaseRequired: true,
    separateRuntimeEnablementApprovalRequired: true
  });
  assert.deepEqual(inventory.contractSummary, {
    runtimeProcessControlBoundaryRecorded: true,
    processControlRequiredBeforeRuntimeEnablement: true,
    processControlBoundaryImplemented: false,
    processControlBoundaryActive: false,
    missingProcessControlBoundaryRejected: true,
    invalidProcessControlBoundaryRejected: true,
    unboundedProcessSpawningTerminationSupervisionRejected: true,
    validRestrictiveProcessControlBoundaryPrerequisiteOnly: true,
    validRestrictiveProcessControlBoundaryEnablesRuntime: false,
    validRestrictiveProcessControlBoundaryStartsRuntime: false,
    validRestrictiveProcessControlBoundaryExposesRuntimeExecution: false,
    runtimeEnabled: false,
    runtimeCommandEnabled: false,
    runtimeExecutionEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    requiresSeparateProcessControlRuntimeImplementationReview: true,
    requiresRemainingPhase56Preconditions: true,
    canEnableRuntime: false
  });
  assert.equal(
    inventory.processControlBoundaryShape.futureBoundaryKind,
    "runtime-process-control-boundary"
  );
  assert.ok(
    inventory.processControlBoundaryShape.requiredBeforeRuntimeEnablement.includes(
      "bounded-process-spawn-policy"
    )
  );
  assert.ok(
    inventory.processControlBoundaryShape.requiredBeforeRuntimeEnablement.includes(
      "bounded-runtime-supervision-policy"
    )
  );
  assert.ok(
    inventory.processControlBoundaryShape.rejectedBoundaryShapes.includes(
      "unbounded-process-spawning-termination-supervision"
    )
  );
  assert.ok(
    inventory.processControlBoundaryShape.requiredRestrictiveControls.includes(
      "deny-shell-string-process-control"
    )
  );
  assert.deepEqual(
    inventory.processControlBoundaryCases.map((boundaryCase) => boundaryCase.caseId),
    expectedCaseIds
  );
  for (const boundaryCase of inventory.processControlBoundaryCases) {
    assert.equal(boundaryCase.rejectedForRuntimeEnablement, true);
    assertAllFalse(boundaryCase.processControlEffect);
    assertAllFalse(boundaryCase.runtimeEffect);
  }
  assert.equal(
    inventory.validationRules.validRestrictiveProcessControlBoundaryCannotEnableRuntime,
    true
  );
  assert.equal(
    inventory.validationRules.validRestrictiveProcessControlBoundaryCannotStartRuntime,
    true
  );
  assert.equal(
    inventory.validationRules.validRestrictiveProcessControlBoundaryCannotExposeRuntimeExecution,
    true
  );
  assert.equal(
    inventory.validationRules.validRestrictiveProcessControlBoundaryCannotBypassTranscriptAuditBoundary,
    true
  );
  assertAllFalse(inventory.blockedRuntimeEffect);
  assert.equal(inventory.serveRuntimeBlockedBehavior.recognizedByCli, true);
  assert.equal(inventory.serveRuntimeBlockedBehavior.runtimeExecution, false);
  assert.equal(inventory.serveRuntimeBlockedBehavior.writesFiles, false);
  assert.ok(inventory.forbiddenBehavior.includes("process-spawn"));
  assert.ok(inventory.forbiddenBehavior.includes("process-termination"));
  assert.ok(inventory.forbiddenBehavior.includes("runtime-supervision"));
  assert.deepEqual(inventory.safetyPosture, {
    runtimeProcessControlBoundaryRecorded: true,
    processControlRequiredBeforeRuntimeEnablement: true,
    processControlBoundaryImplemented: false,
    processControlBoundaryActive: false,
    missingProcessControlBoundaryRejected: true,
    invalidProcessControlBoundaryRejected: true,
    unboundedProcessSpawningTerminationSupervisionRejected: true,
    validRestrictiveProcessControlBoundaryPrerequisiteOnly: true,
    validRestrictiveProcessControlBoundaryEnablesRuntime: false,
    validRestrictiveProcessControlBoundaryStartsRuntime: false,
    validRestrictiveProcessControlBoundaryExposesRuntimeExecution: false,
    canEnableRuntime: false,
    runtimeBlocked: true,
    runtimeEnabled: false,
    runtimeStarted: false,
    runtimeReady: false,
    runtimeCommandEnabled: false,
    runtimeExecutionEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    processControlCommandEnabled: false,
    processControlBoundaryImplemented: false,
    processControlBoundaryActive: false,
    processControlBoundaryEvaluated: false,
    processSpawnEnabled: false,
    processTerminationEnabled: false,
    runtimeSupervisionEnabled: false,
    childProcessManaged: false,
    processSignalSent: false,
    processWaitPerformed: false,
    transcriptAuditConfinementCommandEnabled: false,
    transcriptAuditConfinementImplemented: false,
    transcriptAuditConfinementActive: false,
    runtimeTranscriptWriterEnabled: false,
    runtimeAuditWriterEnabled: false,
    runtimeTranscriptWritePerformed: false,
    runtimeAuditWritePerformed: false,
    stdioSafetyCommandEnabled: false,
    liveStdinLoopEnabled: false,
    runtimeStdoutWriterEnabled: false,
    runtimeStderrWriterEnabled: false,
    approvalCommandEnabled: false,
    noLiveStdinLoop: true,
    noStdoutStderrWriters: true,
    noProcessControl: true,
    noProcessSpawn: true,
    noProcessTermination: true,
    noRuntimeSupervision: true,
    noChildProcessManagement: true,
    noProcessSignal: true,
    noProcessWait: true,
    noTranscriptWrite: true,
    noFailureAuditWrite: true,
    noTranscriptAuditRuntimeWrites: true,
    noAdapterRuntimeBehavior: true,
    noContentFabricRuntimeBehavior: true,
    noWebSocketHttpSurface: true,
    noCliSourceChange: true,
    noRustSourceChange: true
  });
  assert.equal(report.safetyPosture.phase513RuntimeProcessControlBoundaryContract, true);
  assert.equal(report.safetyPosture.flags.phase513RuntimeEnabled, false);
  assert.equal(report.safetyPosture.flags.phase513RuntimeCommandEnabled, false);
  assert.equal(report.safetyPosture.flags.phase513RuntimeExecutionEnabled, false);
  assert.equal(report.safetyPosture.flags.phase513ProcessSpawnEnabled, false);
  assert.equal(report.safetyPosture.flags.phase513ProcessTerminationEnabled, false);
  assert.equal(report.safetyPosture.flags.phase513RuntimeSupervisionEnabled, false);
  assert.equal(report.safetyPosture.flags.phase513ChildProcessManaged, false);
  assert.equal(report.safetyPosture.flags.phase513ProcessSignalSent, false);
  assert.equal(report.safetyPosture.flags.phase513ProcessWaitPerformed, false);
  assert.equal(report.safetyPosture.flags.phase513WebSocketHttpSurfaceEnabled, false);
});

test("report inventories Phase 5.14 as runtime rollback/kill-switch boundary with runtime blocked", async () => {
  const report = await runReport();
  const inventory = report.phase514RuntimeRollbackKillSwitchBoundaryInventory;
  const expectedCaseIds = [
    "missing-rollback-kill-switch-boundary",
    "invalid-rollback-kill-switch-boundary",
    "non-deterministic-or-manual-only-rollback",
    "valid-restrictive-rollback-kill-switch-boundary-prerequisite-only"
  ];

  assert.deepEqual(inventory.statusLayer, {
    document: "docs/phase-5-14-runtime-rollback-kill-switch-boundary.md",
    fixture:
      "tests/fixtures/host-policy/phase5-14/runtime-rollback-kill-switch-boundary-contract.json",
    sourceRuntimeProcessControlBoundaryDocument:
      "docs/phase-5-13-runtime-process-control-boundary.md",
    sourceRuntimeProcessControlBoundaryFixture:
      "tests/fixtures/host-policy/phase5-13/runtime-process-control-boundary-contract.json",
    precedingPhase: "5.13",
    layerId: "runtime-rollback-kill-switch-boundary-contract",
    scope: "runtime-rollback-kill-switch-boundary-only-runtime-disabled",
    runtimeRollbackKillSwitchBoundaryRecorded: true,
    rollbackKillSwitchRequiredBeforeRuntimeEnablement: true,
    rollbackKillSwitchBoundaryImplemented: false,
    rollbackKillSwitchBoundaryActive: false,
    missingRollbackKillSwitchBoundaryRejected: true,
    invalidRollbackKillSwitchBoundaryRejected: true,
    nonDeterministicOrManualOnlyRollbackRejected: true,
    validRestrictiveRollbackKillSwitchBoundaryPrerequisiteOnly: true,
    validRestrictiveRollbackKillSwitchBoundaryEnablesRuntime: false,
    validRestrictiveRollbackKillSwitchBoundaryStartsRuntime: false,
    validRestrictiveRollbackKillSwitchBoundaryExposesRuntimeExecution: false,
    canEnableRuntime: false,
    runtimeEnabled: false,
    runtimeExecutionEnabled: false,
    runtimeCommandEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    rollbackKillSwitchCommandEnabled: false,
    rollbackKillSwitchBoundaryEvaluated: false,
    rollbackCommandEnabled: false,
    killSwitchCommandEnabled: false,
    runtimeShutdownEnabled: false,
    runtimeRollbackPerformed: false,
    killSwitchActivated: false,
    rollbackVerificationPerformed: false,
    processControlCommandEnabled: false,
    processControlBoundaryImplemented: false,
    processControlBoundaryActive: false,
    processSpawnEnabled: false,
    processTerminationEnabled: false,
    runtimeSupervisionEnabled: false,
    childProcessManaged: false,
    processSignalSent: false,
    processWaitPerformed: false,
    transcriptAuditConfinementCommandEnabled: false,
    transcriptAuditConfinementImplemented: false,
    transcriptAuditConfinementActive: false,
    runtimeTranscriptWriterEnabled: false,
    runtimeAuditWriterEnabled: false,
    runtimeTranscriptWritePerformed: false,
    runtimeAuditWritePerformed: false,
    stdioSafetyCommandEnabled: false,
    liveStdinLoopEnabled: false,
    runtimeStdoutWriterEnabled: false,
    runtimeStderrWriterEnabled: false,
    approvalCommandEnabled: false,
    approvalEvaluatorImplemented: false,
    approvalGrantProduced: false,
    hostPolicyRuntimeEnforcementImplemented: false,
    hostPolicyRuntimeEnforcementActive: false,
    adapterRuntimeBehaviorChanged: false,
    contentFabricRuntimeBehaviorChanged: false,
    webSocketHttpSurfaceEnabled: false,
    cliSourceChanged: false,
    rustSourceChanged: false,
    reportRunsChecks: false
  });

  assert.deepEqual(
    inventory.docs.map(({ path, status }) => [path, status]),
    phase514DocFiles.map((path) => [path, "present"])
  );
  assert.deepEqual(inventory.crossLinks, phase514CrossLinks);
  assertKnownInventoryStatuses(inventory.machineReadableArtifacts);
  assert.deepEqual(inventory.machineReadableArtifacts.map(({ path }) => path), [
    "tests/fixtures/host-policy/phase5-14/runtime-rollback-kill-switch-boundary-contract.json"
  ]);
  assertKnownInventoryStatuses(inventory.tests);
  assert.deepEqual(inventory.tests.map(({ path }) => path), [
    "tests/report-phase-status.test.mjs",
    "tests/phase5-14-runtime-rollback-kill-switch-boundary.test.mjs"
  ]);
  assert.deepEqual(inventory.ownershipBoundary, {
    docsStatusFiles: [
      "README.md",
      "apps/cli/README.md",
      "crates/ardyn-host/README.md",
      "docs/phase-5-13-runtime-process-control-boundary.md",
      "docs/phase-5-14-runtime-rollback-kill-switch-boundary.md",
      "scripts/report-phase-status.mjs",
      "tests/report-phase-status.test.mjs"
    ],
    machineReadableArtifactFiles: [
      "tests/fixtures/host-policy/phase5-14/runtime-rollback-kill-switch-boundary-contract.json"
    ],
    focusedTestFiles: [
      "tests/phase5-14-runtime-rollback-kill-switch-boundary.test.mjs",
      "tests/report-phase-status.test.mjs"
    ],
    cliRuntimeSourceFilesChanged: [],
    rustRuntimeSourceFilesChanged: [],
    cliSourceChangedByThisPhase: false,
    appsCliIndexChangedByThisPhase: false,
    rustSourceChangedByThisPhase: false,
    machineReadableArtifactsChangedByThisPhase: true,
    reportRunsChecks: false,
    separateRuntimeImplementationPhaseRequired: true,
    separateRuntimeEnablementApprovalRequired: true
  });
  assert.deepEqual(inventory.contractSummary, {
    runtimeRollbackKillSwitchBoundaryRecorded: true,
    rollbackKillSwitchRequiredBeforeRuntimeEnablement: true,
    rollbackKillSwitchBoundaryImplemented: false,
    rollbackKillSwitchBoundaryActive: false,
    missingRollbackKillSwitchBoundaryRejected: true,
    invalidRollbackKillSwitchBoundaryRejected: true,
    nonDeterministicOrManualOnlyRollbackRejected: true,
    validRestrictiveRollbackKillSwitchBoundaryPrerequisiteOnly: true,
    validRestrictiveRollbackKillSwitchBoundaryEnablesRuntime: false,
    validRestrictiveRollbackKillSwitchBoundaryStartsRuntime: false,
    validRestrictiveRollbackKillSwitchBoundaryExposesRuntimeExecution: false,
    runtimeEnabled: false,
    runtimeCommandEnabled: false,
    runtimeExecutionEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    requiresSeparateRollbackKillSwitchRuntimeImplementationReview: true,
    requiresRemainingPhase56Preconditions: true,
    canEnableRuntime: false
  });
  assert.equal(
    inventory.rollbackKillSwitchBoundaryShape.futureBoundaryKind,
    "runtime-rollback-kill-switch-boundary"
  );
  assert.ok(
    inventory.rollbackKillSwitchBoundaryShape.requiredBeforeRuntimeEnablement.includes(
      "deterministic-runtime-disable-path"
    )
  );
  assert.ok(
    inventory.rollbackKillSwitchBoundaryShape.requiredBeforeRuntimeEnablement.includes(
      "bounded-kill-switch-activation-policy"
    )
  );
  assert.ok(
    inventory.rollbackKillSwitchBoundaryShape.rejectedBoundaryShapes.includes(
      "non-deterministic-or-manual-only-rollback"
    )
  );
  assert.ok(
    inventory.rollbackKillSwitchBoundaryShape.requiredRestrictiveControls.includes(
      "rollback-path-must-fail-before-runtime-start-on-mismatch"
    )
  );
  assert.deepEqual(
    inventory.rollbackKillSwitchBoundaryCases.map((boundaryCase) => boundaryCase.caseId),
    expectedCaseIds
  );
  for (const boundaryCase of inventory.rollbackKillSwitchBoundaryCases) {
    assert.equal(boundaryCase.rejectedForRuntimeEnablement, true);
    assertAllFalse(boundaryCase.rollbackKillSwitchEffect);
    assertAllFalse(boundaryCase.runtimeEffect);
  }
  assert.equal(
    inventory.validationRules.validRestrictiveRollbackKillSwitchBoundaryCannotEnableRuntime,
    true
  );
  assert.equal(
    inventory.validationRules.validRestrictiveRollbackKillSwitchBoundaryCannotStartRuntime,
    true
  );
  assert.equal(
    inventory.validationRules.validRestrictiveRollbackKillSwitchBoundaryCannotExposeRuntimeExecution,
    true
  );
  assert.equal(
    inventory.validationRules.validRestrictiveRollbackKillSwitchBoundaryCannotBypassProcessControlBoundary,
    true
  );
  assertAllFalse(inventory.blockedRuntimeEffect);
  assert.equal(inventory.serveRuntimeBlockedBehavior.recognizedByCli, true);
  assert.equal(inventory.serveRuntimeBlockedBehavior.runtimeExecution, false);
  assert.equal(inventory.serveRuntimeBlockedBehavior.writesFiles, false);
  assert.ok(inventory.forbiddenBehavior.includes("runtime-shutdown"));
  assert.ok(inventory.forbiddenBehavior.includes("runtime-rollback"));
  assert.ok(inventory.forbiddenBehavior.includes("kill-switch-activation"));
  assert.deepEqual(inventory.safetyPosture, {
    runtimeRollbackKillSwitchBoundaryRecorded: true,
    rollbackKillSwitchRequiredBeforeRuntimeEnablement: true,
    rollbackKillSwitchBoundaryImplemented: false,
    rollbackKillSwitchBoundaryActive: false,
    missingRollbackKillSwitchBoundaryRejected: true,
    invalidRollbackKillSwitchBoundaryRejected: true,
    nonDeterministicOrManualOnlyRollbackRejected: true,
    validRestrictiveRollbackKillSwitchBoundaryPrerequisiteOnly: true,
    validRestrictiveRollbackKillSwitchBoundaryEnablesRuntime: false,
    validRestrictiveRollbackKillSwitchBoundaryStartsRuntime: false,
    validRestrictiveRollbackKillSwitchBoundaryExposesRuntimeExecution: false,
    canEnableRuntime: false,
    runtimeBlocked: true,
    runtimeEnabled: false,
    runtimeStarted: false,
    runtimeReady: false,
    runtimeCommandEnabled: false,
    runtimeExecutionEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    rollbackKillSwitchCommandEnabled: false,
    rollbackKillSwitchBoundaryEvaluated: false,
    rollbackCommandEnabled: false,
    killSwitchCommandEnabled: false,
    runtimeShutdownEnabled: false,
    runtimeRollbackPerformed: false,
    killSwitchActivated: false,
    rollbackVerificationPerformed: false,
    processControlCommandEnabled: false,
    processControlBoundaryImplemented: false,
    processControlBoundaryActive: false,
    processSpawnEnabled: false,
    processTerminationEnabled: false,
    runtimeSupervisionEnabled: false,
    childProcessManaged: false,
    processSignalSent: false,
    processWaitPerformed: false,
    transcriptAuditConfinementCommandEnabled: false,
    transcriptAuditConfinementImplemented: false,
    transcriptAuditConfinementActive: false,
    runtimeTranscriptWriterEnabled: false,
    runtimeAuditWriterEnabled: false,
    runtimeTranscriptWritePerformed: false,
    runtimeAuditWritePerformed: false,
    stdioSafetyCommandEnabled: false,
    liveStdinLoopEnabled: false,
    runtimeStdoutWriterEnabled: false,
    runtimeStderrWriterEnabled: false,
    approvalCommandEnabled: false,
    noLiveStdinLoop: true,
    noStdoutStderrWriters: true,
    noProcessControl: true,
    noProcessSpawn: true,
    noProcessTermination: true,
    noRuntimeSupervision: true,
    noChildProcessManagement: true,
    noProcessSignal: true,
    noProcessWait: true,
    noRuntimeShutdown: true,
    noRuntimeRollback: true,
    noKillSwitchActivation: true,
    noRollbackVerificationSideEffect: true,
    noTranscriptWrite: true,
    noFailureAuditWrite: true,
    noTranscriptAuditRuntimeWrites: true,
    noAdapterRuntimeBehavior: true,
    noContentFabricRuntimeBehavior: true,
    noWebSocketHttpSurface: true,
    noCliSourceChange: true,
    noRustSourceChange: true
  });
  assert.equal(report.safetyPosture.phase514RuntimeRollbackKillSwitchBoundaryContract, true);
  assert.equal(report.safetyPosture.flags.phase514RuntimeEnabled, false);
  assert.equal(report.safetyPosture.flags.phase514RuntimeCommandEnabled, false);
  assert.equal(report.safetyPosture.flags.phase514RuntimeExecutionEnabled, false);
  assert.equal(report.safetyPosture.flags.phase514RollbackKillSwitchCommandEnabled, false);
  assert.equal(report.safetyPosture.flags.phase514RuntimeShutdownEnabled, false);
  assert.equal(report.safetyPosture.flags.phase514RuntimeRollbackPerformed, false);
  assert.equal(report.safetyPosture.flags.phase514KillSwitchActivated, false);
  assert.equal(report.safetyPosture.flags.phase514RollbackVerificationPerformed, false);
  assert.equal(report.safetyPosture.flags.phase514ProcessTerminationEnabled, false);
  assert.equal(report.safetyPosture.flags.phase514WebSocketHttpSurfaceEnabled, false);
});

test("report inventories Phase 5.15 as positive runtime smoke requirement with runtime blocked", async () => {
  const report = await runReport();
  const inventory = report.phase515PositiveRuntimeSmokeRequirementInventory;
  const expectedCaseIds = [
    "missing-positive-runtime-smoke-coverage",
    "invalid-positive-runtime-smoke-coverage",
    "non-guarded-or-non-deterministic-runtime-smoke-coverage",
    "valid-positive-runtime-smoke-coverage-prerequisite-only"
  ];

  assert.deepEqual(inventory.statusLayer, {
    document: "docs/phase-5-15-positive-runtime-smoke-requirement.md",
    fixture:
      "tests/fixtures/host-policy/phase5-15/positive-runtime-smoke-requirement-contract.json",
    sourceRuntimeRollbackKillSwitchBoundaryDocument:
      "docs/phase-5-14-runtime-rollback-kill-switch-boundary.md",
    sourceRuntimeRollbackKillSwitchBoundaryFixture:
      "tests/fixtures/host-policy/phase5-14/runtime-rollback-kill-switch-boundary-contract.json",
    precedingPhase: "5.14",
    layerId: "positive-runtime-smoke-requirement-contract",
    scope: "positive-runtime-smoke-requirement-only-runtime-disabled",
    positiveRuntimeSmokeRequirementRecorded: true,
    positiveRuntimeSmokeCoverageRequiredBeforeRuntimeEnablement: true,
    positiveRuntimeSmokeCoverageImplemented: false,
    positiveRuntimeSmokeCoverageActive: false,
    missingPositiveRuntimeSmokeCoverageRejected: true,
    invalidPositiveRuntimeSmokeCoverageRejected: true,
    nonGuardedOrNonDeterministicRuntimeSmokeCoverageRejected: true,
    validPositiveRuntimeSmokeCoveragePrerequisiteOnly: true,
    validPositiveRuntimeSmokeCoverageEnablesRuntime: false,
    validPositiveRuntimeSmokeCoverageStartsRuntime: false,
    validPositiveRuntimeSmokeCoverageExposesRuntimeExecution: false,
    validPositiveRuntimeSmokeCoverageRunsRuntime: false,
    canEnableRuntime: false,
    runtimeEnabled: false,
    runtimeExecutionEnabled: false,
    runtimeCommandEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    positiveRuntimeSmokeCommandEnabled: false,
    positiveRuntimeSmokeCoverageEvaluated: false,
    positiveRuntimeSmokeExecuted: false,
    positiveRuntimeSmokePassed: false,
    runtimeSmokeCommandEnabled: false,
    rollbackKillSwitchCommandEnabled: false,
    rollbackKillSwitchBoundaryImplemented: false,
    rollbackKillSwitchBoundaryActive: false,
    runtimeShutdownEnabled: false,
    runtimeRollbackPerformed: false,
    killSwitchActivated: false,
    processControlCommandEnabled: false,
    processControlBoundaryImplemented: false,
    processControlBoundaryActive: false,
    processSpawnEnabled: false,
    processTerminationEnabled: false,
    runtimeSupervisionEnabled: false,
    childProcessManaged: false,
    processSignalSent: false,
    processWaitPerformed: false,
    transcriptAuditConfinementCommandEnabled: false,
    transcriptAuditConfinementImplemented: false,
    transcriptAuditConfinementActive: false,
    runtimeTranscriptWriterEnabled: false,
    runtimeAuditWriterEnabled: false,
    runtimeTranscriptWritePerformed: false,
    runtimeAuditWritePerformed: false,
    stdioSafetyCommandEnabled: false,
    liveStdinLoopEnabled: false,
    runtimeStdoutWriterEnabled: false,
    runtimeStderrWriterEnabled: false,
    approvalCommandEnabled: false,
    approvalEvaluatorImplemented: false,
    approvalGrantProduced: false,
    hostPolicyRuntimeEnforcementImplemented: false,
    hostPolicyRuntimeEnforcementActive: false,
    adapterRuntimeBehaviorChanged: false,
    contentFabricRuntimeBehaviorChanged: false,
    webSocketHttpSurfaceEnabled: false,
    cliSourceChanged: false,
    rustSourceChanged: false,
    reportRunsChecks: false
  });

  assert.deepEqual(
    inventory.docs.map(({ path, status }) => [path, status]),
    phase515DocFiles.map((path) => [path, "present"])
  );
  assert.deepEqual(inventory.crossLinks, phase515CrossLinks);
  assertKnownInventoryStatuses(inventory.machineReadableArtifacts);
  assert.deepEqual(inventory.machineReadableArtifacts.map(({ path }) => path), [
    "tests/fixtures/host-policy/phase5-15/positive-runtime-smoke-requirement-contract.json"
  ]);
  assertKnownInventoryStatuses(inventory.tests);
  assert.deepEqual(inventory.tests.map(({ path }) => path), [
    "tests/report-phase-status.test.mjs",
    "tests/phase5-15-positive-runtime-smoke-requirement.test.mjs"
  ]);
  assert.deepEqual(inventory.ownershipBoundary, {
    docsStatusFiles: [
      "README.md",
      "apps/cli/README.md",
      "crates/ardyn-host/README.md",
      "docs/phase-5-14-runtime-rollback-kill-switch-boundary.md",
      "docs/phase-5-15-positive-runtime-smoke-requirement.md",
      "scripts/report-phase-status.mjs",
      "tests/report-phase-status.test.mjs"
    ],
    machineReadableArtifactFiles: [
      "tests/fixtures/host-policy/phase5-15/positive-runtime-smoke-requirement-contract.json"
    ],
    focusedTestFiles: [
      "tests/phase5-15-positive-runtime-smoke-requirement.test.mjs",
      "tests/report-phase-status.test.mjs"
    ],
    cliRuntimeSourceFilesChanged: [],
    rustRuntimeSourceFilesChanged: [],
    cliSourceChangedByThisPhase: false,
    appsCliIndexChangedByThisPhase: false,
    rustSourceChangedByThisPhase: false,
    machineReadableArtifactsChangedByThisPhase: true,
    reportRunsChecks: false,
    separateRuntimeImplementationPhaseRequired: true,
    separateRuntimeEnablementApprovalRequired: true
  });
  assert.deepEqual(inventory.contractSummary, {
    positiveRuntimeSmokeRequirementRecorded: true,
    positiveRuntimeSmokeCoverageRequiredBeforeRuntimeEnablement: true,
    positiveRuntimeSmokeCoverageImplemented: false,
    positiveRuntimeSmokeCoverageActive: false,
    missingPositiveRuntimeSmokeCoverageRejected: true,
    invalidPositiveRuntimeSmokeCoverageRejected: true,
    nonGuardedOrNonDeterministicRuntimeSmokeCoverageRejected: true,
    validPositiveRuntimeSmokeCoveragePrerequisiteOnly: true,
    validPositiveRuntimeSmokeCoverageEnablesRuntime: false,
    validPositiveRuntimeSmokeCoverageStartsRuntime: false,
    validPositiveRuntimeSmokeCoverageExposesRuntimeExecution: false,
    validPositiveRuntimeSmokeCoverageRunsRuntime: false,
    runtimeEnabled: false,
    runtimeCommandEnabled: false,
    runtimeExecutionEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    requiresSeparatePositiveRuntimeSmokeImplementationReview: true,
    requiresRemainingPhase56Preconditions: true,
    canEnableRuntime: false
  });
  assert.equal(
    inventory.positiveRuntimeSmokeRequirementShape.futureRequirementKind,
    "positive-runtime-smoke-requirement"
  );
  assert.ok(
    inventory.positiveRuntimeSmokeRequirementShape.requiredBeforeRuntimeEnablement.includes(
      "guarded-runtime-smoke-plan"
    )
  );
  assert.ok(
    inventory.positiveRuntimeSmokeRequirementShape.requiredBeforeRuntimeEnablement.includes(
      "deterministic-smoke-input-fixture"
    )
  );
  assert.ok(
    inventory.positiveRuntimeSmokeRequirementShape.rejectedRequirementShapes.includes(
      "non-guarded-or-non-deterministic-runtime-smoke-coverage"
    )
  );
  assert.ok(
    inventory.positiveRuntimeSmokeRequirementShape.requiredRestrictiveControls.includes(
      "smoke-coverage-cannot-run-runtime-in-this-phase"
    )
  );
  assert.deepEqual(
    inventory.positiveRuntimeSmokeRequirementCases.map(
      (requirementCase) => requirementCase.caseId
    ),
    expectedCaseIds
  );
  for (const requirementCase of inventory.positiveRuntimeSmokeRequirementCases) {
    assert.equal(requirementCase.rejectedForRuntimeEnablement, true);
    assertAllFalse(requirementCase.positiveRuntimeSmokeEffect);
    assertAllFalse(requirementCase.runtimeEffect);
  }
  assert.equal(
    inventory.validationRules.validPositiveRuntimeSmokeCoverageCannotEnableRuntime,
    true
  );
  assert.equal(
    inventory.validationRules.validPositiveRuntimeSmokeCoverageCannotStartRuntime,
    true
  );
  assert.equal(
    inventory.validationRules.validPositiveRuntimeSmokeCoverageCannotRunRuntime,
    true
  );
  assert.equal(
    inventory.validationRules.validPositiveRuntimeSmokeCoverageCannotBypassRollbackKillSwitchBoundary,
    true
  );
  assertAllFalse(inventory.blockedRuntimeEffect);
  assert.equal(inventory.serveRuntimeBlockedBehavior.recognizedByCli, true);
  assert.equal(inventory.serveRuntimeBlockedBehavior.runtimeExecution, false);
  assert.equal(inventory.serveRuntimeBlockedBehavior.writesFiles, false);
  assert.ok(inventory.forbiddenBehavior.includes("positive-runtime-smoke-executed"));
  assert.ok(inventory.forbiddenBehavior.includes("runtime-executed"));
  assert.ok(inventory.forbiddenBehavior.includes("runtime-smoke-command-enabled"));
  assert.deepEqual(inventory.safetyPosture, {
    positiveRuntimeSmokeRequirementRecorded: true,
    positiveRuntimeSmokeCoverageRequiredBeforeRuntimeEnablement: true,
    positiveRuntimeSmokeCoverageImplemented: false,
    positiveRuntimeSmokeCoverageActive: false,
    missingPositiveRuntimeSmokeCoverageRejected: true,
    invalidPositiveRuntimeSmokeCoverageRejected: true,
    nonGuardedOrNonDeterministicRuntimeSmokeCoverageRejected: true,
    validPositiveRuntimeSmokeCoveragePrerequisiteOnly: true,
    validPositiveRuntimeSmokeCoverageEnablesRuntime: false,
    validPositiveRuntimeSmokeCoverageStartsRuntime: false,
    validPositiveRuntimeSmokeCoverageExposesRuntimeExecution: false,
    validPositiveRuntimeSmokeCoverageRunsRuntime: false,
    canEnableRuntime: false,
    runtimeBlocked: true,
    runtimeEnabled: false,
    runtimeStarted: false,
    runtimeReady: false,
    runtimeCommandEnabled: false,
    runtimeExecutionEnabled: false,
    runtimeExecuted: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    positiveRuntimeSmokeCommandEnabled: false,
    positiveRuntimeSmokeCoverageEvaluated: false,
    positiveRuntimeSmokeExecuted: false,
    positiveRuntimeSmokePassed: false,
    runtimeSmokeCommandEnabled: false,
    rollbackKillSwitchCommandEnabled: false,
    rollbackKillSwitchBoundaryImplemented: false,
    rollbackKillSwitchBoundaryActive: false,
    runtimeShutdownEnabled: false,
    runtimeRollbackPerformed: false,
    killSwitchActivated: false,
    processControlCommandEnabled: false,
    processControlBoundaryImplemented: false,
    processControlBoundaryActive: false,
    processSpawnEnabled: false,
    processTerminationEnabled: false,
    runtimeSupervisionEnabled: false,
    childProcessManaged: false,
    processSignalSent: false,
    processWaitPerformed: false,
    transcriptAuditConfinementCommandEnabled: false,
    transcriptAuditConfinementImplemented: false,
    transcriptAuditConfinementActive: false,
    runtimeTranscriptWriterEnabled: false,
    runtimeAuditWriterEnabled: false,
    runtimeTranscriptWritePerformed: false,
    runtimeAuditWritePerformed: false,
    stdioSafetyCommandEnabled: false,
    liveStdinLoopEnabled: false,
    runtimeStdoutWriterEnabled: false,
    runtimeStderrWriterEnabled: false,
    approvalCommandEnabled: false,
    noLiveStdinLoop: true,
    noStdoutStderrWriters: true,
    noProcessControl: true,
    noProcessSpawn: true,
    noProcessTermination: true,
    noRuntimeSupervision: true,
    noChildProcessManagement: true,
    noProcessSignal: true,
    noProcessWait: true,
    noRuntimeSmokeExecution: true,
    noRuntimeExecution: true,
    noTranscriptWrite: true,
    noFailureAuditWrite: true,
    noTranscriptAuditRuntimeWrites: true,
    noAdapterRuntimeBehavior: true,
    noContentFabricRuntimeBehavior: true,
    noWebSocketHttpSurface: true,
    noCliSourceChange: true,
    noRustSourceChange: true
  });
  assert.equal(report.safetyPosture.phase515PositiveRuntimeSmokeRequirementContract, true);
  assert.equal(report.safetyPosture.flags.phase515RuntimeEnabled, false);
  assert.equal(report.safetyPosture.flags.phase515RuntimeCommandEnabled, false);
  assert.equal(report.safetyPosture.flags.phase515RuntimeExecutionEnabled, false);
  assert.equal(report.safetyPosture.flags.phase515RuntimeExecuted, false);
  assert.equal(report.safetyPosture.flags.phase515PositiveRuntimeSmokeCommandEnabled, false);
  assert.equal(report.safetyPosture.flags.phase515PositiveRuntimeSmokeExecuted, false);
  assert.equal(report.safetyPosture.flags.phase515PositiveRuntimeSmokePassed, false);
  assert.equal(report.safetyPosture.flags.phase515RuntimeSmokeCommandEnabled, false);
  assert.equal(report.safetyPosture.flags.phase515ProcessSpawnEnabled, false);
  assert.equal(report.safetyPosture.flags.phase515RuntimeSupervisionEnabled, false);
  assert.equal(report.safetyPosture.flags.phase515WebSocketHttpSurfaceEnabled, false);
});

test("report inventories Phase 5.16 as runtime enablement readiness checkpoint with runtime blocked", async () => {
  const report = await runReport();
  const inventory = report.phase516RuntimeEnableReadinessCheckpointInventory;
  const expectedContractIds = [
    "runtime-enable-precondition-gate",
    "runtime-approval-validation",
    "runtime-command-exposure-approval",
    "approval-evaluator-grant-boundary",
    "runtime-host-policy-boundary",
    "runtime-stdio-safety-boundary",
    "runtime-transcript-audit-boundary",
    "runtime-process-control-boundary",
    "runtime-rollback-kill-switch-boundary",
    "positive-runtime-smoke-requirement"
  ];

  assert.deepEqual(inventory.statusLayer, {
    document: "docs/phase-5-16-runtime-enable-readiness-checkpoint.md",
    fixture:
      "tests/fixtures/host-policy/phase5-16/runtime-enable-readiness-checkpoint.json",
    sourcePositiveRuntimeSmokeDocument:
      "docs/phase-5-15-positive-runtime-smoke-requirement.md",
    sourcePositiveRuntimeSmokeFixture:
      "tests/fixtures/host-policy/phase5-15/positive-runtime-smoke-requirement-contract.json",
    precedingPhase: "5.15",
    layerId: "runtime-enable-readiness-checkpoint",
    scope: "phase-5-runtime-enable-readiness-checkpoint-runtime-disabled",
    runtimeEnableReadinessCheckpointRecorded: true,
    phase56Through515ContractsRepresented: true,
    representedPreconditionCount: 10,
    implementedLivePreconditionCount: 0,
    approvalRecordsPrerequisiteOnly: true,
    commandExposureApprovalPrerequisiteOnly: true,
    approvalEvaluatorImplemented: false,
    approvalGrantProduced: false,
    hostPolicyRuntimeEnforcementImplemented: false,
    stdioSafetyImplemented: false,
    transcriptAuditConfinementImplemented: false,
    processControlBoundaryImplemented: false,
    rollbackKillSwitchBoundaryImplemented: false,
    positiveRuntimeSmokeCoverageImplemented: false,
    readyForRuntimeEnablement: false,
    readyForLiveRuntimeImplementation: false,
    canEnableRuntime: false,
    runtimeEnabled: false,
    runtimeStarted: false,
    runtimeReady: false,
    runtimeCommandEnabled: false,
    runtimeExecutionEnabled: false,
    runtimeExecuted: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    approvalEvaluatorImplementedInThisPhase: false,
    approvalGrantProducedInThisPhase: false,
    hostPolicyRuntimeEnforcementImplementedInThisPhase: false,
    stdioSafetyImplementedInThisPhase: false,
    transcriptAuditConfinementImplementedInThisPhase: false,
    processControlBoundaryImplementedInThisPhase: false,
    rollbackKillSwitchBoundaryImplementedInThisPhase: false,
    positiveRuntimeSmokeCoverageImplementedInThisPhase: false,
    liveStdinLoopEnabled: false,
    runtimeStdoutWriterEnabled: false,
    runtimeStderrWriterEnabled: false,
    processSpawnEnabled: false,
    processTerminationEnabled: false,
    runtimeSupervisionEnabled: false,
    runtimeTranscriptWritePerformed: false,
    runtimeAuditWritePerformed: false,
    adapterRuntimeBehaviorChanged: false,
    contentFabricRuntimeBehaviorChanged: false,
    webSocketHttpSurfaceEnabled: false,
    cliSourceChanged: false,
    rustSourceChanged: false,
    reportRunsChecks: false
  });

  assert.deepEqual(
    inventory.docs.map(({ path, status }) => [path, status]),
    phase516DocFiles.map((path) => [path, "present"])
  );
  assert.deepEqual(inventory.crossLinks, phase516CrossLinks);
  assertKnownInventoryStatuses(inventory.machineReadableArtifacts);
  assert.deepEqual(inventory.machineReadableArtifacts.map(({ path }) => path), [
    "tests/fixtures/host-policy/phase5-16/runtime-enable-readiness-checkpoint.json"
  ]);
  assertKnownInventoryStatuses(inventory.tests);
  assert.deepEqual(inventory.tests.map(({ path }) => path), [
    "tests/report-phase-status.test.mjs",
    "tests/phase5-16-runtime-enable-readiness-checkpoint.test.mjs"
  ]);
  assert.deepEqual(inventory.ownershipBoundary, {
    docsStatusFiles: [
      "README.md",
      "apps/cli/README.md",
      "crates/ardyn-host/README.md",
      "docs/phase-5-15-positive-runtime-smoke-requirement.md",
      "docs/phase-5-16-runtime-enable-readiness-checkpoint.md",
      "scripts/report-phase-status.mjs",
      "tests/report-phase-status.test.mjs"
    ],
    machineReadableArtifactFiles: [
      "tests/fixtures/host-policy/phase5-16/runtime-enable-readiness-checkpoint.json"
    ],
    focusedTestFiles: [
      "tests/phase5-16-runtime-enable-readiness-checkpoint.test.mjs",
      "tests/report-phase-status.test.mjs"
    ],
    cliRuntimeSourceFilesChanged: [],
    rustRuntimeSourceFilesChanged: [],
    cliSourceChangedByThisPhase: false,
    appsCliIndexChangedByThisPhase: false,
    rustSourceChangedByThisPhase: false,
    machineReadableArtifactsChangedByThisPhase: true,
    reportRunsChecks: false,
    separateRuntimeImplementationPhaseRequired: true,
    separateRuntimeEnablementApprovalRequired: true
  });
  assert.deepEqual(
    inventory.sourcePhases.map(({ contractId }) => contractId),
    expectedContractIds
  );
  assert.deepEqual(inventory.checkpointSummary, {
    runtimeEnableReadinessCheckpointRecorded: true,
    phase56Through515ContractsRepresented: true,
    representedPreconditionCount: 10,
    implementedLivePreconditionCount: 0,
    approvalRecordsPrerequisiteOnly: true,
    commandExposureApprovalPrerequisiteOnly: true,
    approvalEvaluatorImplemented: false,
    approvalGrantProduced: false,
    hostPolicyRuntimeEnforcementImplemented: false,
    stdioSafetyImplemented: false,
    transcriptAuditConfinementImplemented: false,
    processControlBoundaryImplemented: false,
    rollbackKillSwitchBoundaryImplemented: false,
    positiveRuntimeSmokeCoverageImplemented: false,
    runtimeEnabled: false,
    runtimeCommandEnabled: false,
    runtimeExecutionEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    readyForRuntimeEnablement: false,
    readyForLiveRuntimeImplementation: false,
    canEnableRuntime: false
  });
  assert.deepEqual(
    inventory.preconditionContracts.map(({ contractId }) => contractId),
    expectedContractIds
  );
  for (const contract of inventory.preconditionContracts) {
    assert.equal(contract.representedAsContract, true);
    assert.equal(contract.prerequisiteOnly, true);
    assert.equal(contract.implementedAsLiveRuntime, false);
    assert.equal(contract.activeRuntimeBehavior, false);
    assert.equal(contract.enablesRuntime, false);
    assert.equal(contract.startsRuntime, false);
    assert.equal(contract.exposesRuntimeExecution, false);
  }
  assert.deepEqual(inventory.prerequisiteSignalStatus, {
    validRuntimeApprovalPrerequisiteOnly: true,
    validCommandExposureApprovalPrerequisiteOnly: true,
    approvalEvaluatorImplemented: false,
    approvalGrantProduced: false,
    hostPolicyContractOnly: true,
    stdioSafetyContractOnly: true,
    transcriptAuditContractOnly: true,
    processControlContractOnly: true,
    rollbackKillSwitchContractOnly: true,
    positiveRuntimeSmokeContractOnly: true,
    anyPrerequisiteSignalEnablesRuntime: false,
    anyPrerequisiteSignalStartsRuntime: false,
    anyPrerequisiteSignalExposesRuntimeExecution: false
  });
  assertAllFalse(inventory.liveRuntimeStatus);
  assert.equal(inventory.serveRuntimeBlockedBehavior.recognizedByCli, true);
  assert.equal(inventory.serveRuntimeBlockedBehavior.stdout, "");
  assert.equal(inventory.serveRuntimeBlockedBehavior.runtimeExecution, false);
  assert.equal(inventory.serveRuntimeBlockedBehavior.writesFiles, false);
  assert.equal(inventory.readinessDecision.decision, "blocked");
  assert.equal(inventory.readinessDecision.readyForRuntimeEnablement, false);
  assert.equal(inventory.readinessDecision.readyForLiveRuntimeImplementation, false);
  assert.equal(
    inventory.readinessDecision.recommendedNextPhase,
    "phase-5.17-guarded-runtime-implementation-plan"
  );
  assert.ok(inventory.readinessDecision.blockers.includes("approval_evaluator_not_implemented"));
  assert.ok(inventory.readinessDecision.blockers.includes("positive_runtime_smoke_not_implemented"));
  assertAllFalse(inventory.readinessDecision.runtimeEffect);
  assert.ok(inventory.forbiddenBehavior.includes("approval-evaluator-implemented"));
  assert.ok(inventory.forbiddenBehavior.includes("positive-runtime-smoke-implemented"));
  assert.ok(inventory.validationCommands.includes("npm test"));
  assert.ok(
    inventory.validationCommands.includes(
      "node --test tests/phase5-16-runtime-enable-readiness-checkpoint.test.mjs"
    )
  );
  assert.deepEqual(inventory.safetyPosture, {
    runtimeEnableReadinessCheckpointRecorded: true,
    phase56Through515ContractsRepresented: true,
    representedPreconditionCount: 10,
    implementedLivePreconditionCount: 0,
    approvalRecordsPrerequisiteOnly: true,
    commandExposureApprovalPrerequisiteOnly: true,
    approvalEvaluatorImplemented: false,
    approvalGrantProduced: false,
    hostPolicyRuntimeEnforcementImplemented: false,
    stdioSafetyImplemented: false,
    transcriptAuditConfinementImplemented: false,
    processControlBoundaryImplemented: false,
    rollbackKillSwitchBoundaryImplemented: false,
    positiveRuntimeSmokeCoverageImplemented: false,
    readyForRuntimeEnablement: false,
    readyForLiveRuntimeImplementation: false,
    canEnableRuntime: false,
    runtimeBlocked: true,
    runtimeEnabled: false,
    runtimeStarted: false,
    runtimeReady: false,
    runtimeCommandEnabled: false,
    runtimeExecutionEnabled: false,
    runtimeExecuted: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    liveStdinLoopEnabled: false,
    runtimeStdoutWriterEnabled: false,
    runtimeStderrWriterEnabled: false,
    processSpawnEnabled: false,
    processTerminationEnabled: false,
    runtimeSupervisionEnabled: false,
    childProcessManaged: false,
    runtimeTranscriptWritePerformed: false,
    runtimeAuditWritePerformed: false,
    adapterRuntimeBehaviorEnabled: false,
    contentFabricRuntimeBehaviorEnabled: false,
    webSocketHttpSurfaceEnabled: false,
    noLiveStdinLoop: true,
    noStdoutStderrWriters: true,
    noProcessControl: true,
    noProcessSpawn: true,
    noProcessTermination: true,
    noRuntimeSupervision: true,
    noChildProcessManagement: true,
    noRuntimeExecution: true,
    noTranscriptWrite: true,
    noFailureAuditWrite: true,
    noTranscriptAuditRuntimeWrites: true,
    noAdapterRuntimeBehavior: true,
    noContentFabricRuntimeBehavior: true,
    noWebSocketHttpSurface: true,
    noCliSourceChange: true,
    noRustSourceChange: true
  });
  assert.equal(report.safetyPosture.phase516RuntimeEnableReadinessCheckpoint, true);
  assert.equal(report.safetyPosture.flags.phase516RuntimeEnabled, false);
  assert.equal(report.safetyPosture.flags.phase516RuntimeCommandEnabled, false);
  assert.equal(report.safetyPosture.flags.phase516RuntimeExecutionEnabled, false);
  assert.equal(report.safetyPosture.flags.phase516RuntimeExecuted, false);
  assert.equal(report.safetyPosture.flags.phase516ProcessSpawnEnabled, false);
  assert.equal(report.safetyPosture.flags.phase516RuntimeSupervisionEnabled, false);
  assert.equal(report.safetyPosture.flags.phase516RuntimeTranscriptWritePerformed, false);
  assert.equal(report.safetyPosture.flags.phase516RuntimeAuditWritePerformed, false);
  assert.equal(report.safetyPosture.flags.phase516WebSocketHttpSurfaceEnabled, false);
});

test("report inventories Phase 5.17 as guarded runtime implementation plan with runtime blocked", async () => {
  const report = await runReport();
  const inventory = report.phase517GuardedRuntimeImplementationPlanInventory;
  const expectedContractIds = [
    "runtime-enable-precondition-gate",
    "runtime-approval-validation",
    "runtime-command-exposure-approval",
    "approval-evaluator-grant-boundary",
    "runtime-host-policy-boundary",
    "runtime-stdio-safety-boundary",
    "runtime-transcript-audit-boundary",
    "runtime-process-control-boundary",
    "runtime-rollback-kill-switch-boundary",
    "positive-runtime-smoke-requirement",
    "runtime-enable-readiness-checkpoint"
  ];
  const expectedStepIds = [
    "confirm-approval-and-command-exposure-record-readers",
    "add-review-only-approval-evaluator-design",
    "add-restrictive-host-policy-runtime-gate",
    "add-bounded-stdio-runtime-gate",
    "add-transcript-audit-confinement-gate",
    "add-process-control-boundary-gate",
    "add-rollback-kill-switch-gate",
    "add-positive-runtime-smoke-fixtures",
    "prepare-still-default-blocked-runtime-entrypoint-slice"
  ];

  assert.deepEqual(inventory.statusLayer, {
    document: "docs/phase-5-17-guarded-runtime-implementation-plan.md",
    fixture:
      "tests/fixtures/host-policy/phase5-17/guarded-runtime-implementation-plan.json",
    sourceRuntimeEnableReadinessCheckpointDocument:
      "docs/phase-5-16-runtime-enable-readiness-checkpoint.md",
    sourceRuntimeEnableReadinessCheckpointFixture:
      "tests/fixtures/host-policy/phase5-16/runtime-enable-readiness-checkpoint.json",
    precedingPhase: "5.16",
    layerId: "guarded-runtime-implementation-plan",
    scope: "phase-5-guarded-runtime-implementation-plan-runtime-disabled",
    guardedRuntimeImplementationPlanRecorded: true,
    prerequisiteContractCount: 11,
    plannedImplementationStepCount: 9,
    implementationInThisPhase: false,
    runtimeEnabled: false,
    runtimeStarted: false,
    runtimeReady: false,
    runtimeCommandEnabled: false,
    runtimeCommandExposureEnabled: false,
    runtimeExecutionEnabled: false,
    runtimeExecuted: false,
    approvalEvaluatorImplemented: false,
    approvalGrantProduced: false,
    runtimeImplementationAdded: false,
    hostPolicyRuntimeEnforcementImplemented: false,
    stdioSafetyImplemented: false,
    liveStdinLoopEnabled: false,
    runtimeStdoutWriterEnabled: false,
    runtimeStderrWriterEnabled: false,
    transcriptAuditConfinementImplemented: false,
    runtimeTranscriptWritePerformed: false,
    runtimeAuditWritePerformed: false,
    processControlBoundaryImplemented: false,
    processSpawnEnabled: false,
    processTerminationEnabled: false,
    runtimeSupervisionEnabled: false,
    rollbackKillSwitchBoundaryImplemented: false,
    runtimeRollbackPerformed: false,
    killSwitchActivated: false,
    positiveRuntimeSmokeCoverageImplemented: false,
    positiveRuntimeSmokeExecuted: false,
    adapterRuntimeBehaviorChanged: false,
    contentFabricRuntimeBehaviorChanged: false,
    webSocketHttpSurfaceEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    readyForRuntimeEnablement: false,
    canEnableRuntime: false,
    cliSourceChanged: false,
    rustSourceChanged: false,
    reportRunsChecks: false
  });

  assert.deepEqual(
    inventory.docs.map(({ path, status }) => [path, status]),
    phase517DocFiles.map((path) => [path, "present"])
  );
  assert.deepEqual(inventory.crossLinks, phase517CrossLinks);
  assertKnownInventoryStatuses(inventory.machineReadableArtifacts);
  assert.deepEqual(inventory.machineReadableArtifacts.map(({ path }) => path), [
    "tests/fixtures/host-policy/phase5-17/guarded-runtime-implementation-plan.json"
  ]);
  assertKnownInventoryStatuses(inventory.tests);
  assert.deepEqual(inventory.tests.map(({ path }) => path), [
    "tests/report-phase-status.test.mjs",
    "tests/phase5-17-guarded-runtime-implementation-plan.test.mjs"
  ]);
  assert.deepEqual(inventory.ownershipBoundary, {
    docsStatusFiles: [
      "README.md",
      "apps/cli/README.md",
      "crates/ardyn-host/README.md",
      "docs/phase-5-16-runtime-enable-readiness-checkpoint.md",
      "docs/phase-5-17-guarded-runtime-implementation-plan.md",
      "scripts/report-phase-status.mjs",
      "tests/report-phase-status.test.mjs"
    ],
    machineReadableArtifactFiles: [
      "tests/fixtures/host-policy/phase5-17/guarded-runtime-implementation-plan.json"
    ],
    focusedTestFiles: [
      "tests/phase5-17-guarded-runtime-implementation-plan.test.mjs",
      "tests/report-phase-status.test.mjs"
    ],
    cliRuntimeSourceFilesChanged: [],
    rustRuntimeSourceFilesChanged: [],
    cliSourceChangedByThisPhase: false,
    appsCliIndexChangedByThisPhase: false,
    rustSourceChangedByThisPhase: false,
    machineReadableArtifactsChangedByThisPhase: true,
    reportRunsChecks: false,
    separateRuntimeImplementationPhaseRequired: true,
    separateRuntimeEnablementApprovalRequired: true
  });
  assert.deepEqual(inventory.sourceCheckpoint, {
    phase: "phase-5.16-runtime-enable-readiness-checkpoint",
    document: "docs/phase-5-16-runtime-enable-readiness-checkpoint.md",
    fixture: "tests/fixtures/host-policy/phase5-16/runtime-enable-readiness-checkpoint.json"
  });
  assert.deepEqual(
    inventory.prerequisiteContracts.map(({ contractId }) => contractId),
    expectedContractIds
  );
  for (const contract of inventory.prerequisiteContracts) {
    assert.equal(contract.prerequisiteOnly, true);
    assert.equal(contract.implementedByThisPhase, false);
    assert.equal(contract.enablesRuntime, false);
    assert.equal(contract.startsRuntime, false);
    assert.equal(contract.exposesRuntimeExecution, false);
  }
  assert.deepEqual(inventory.implementationPlanSummary, {
    guardedRuntimeImplementationPlanRecorded: true,
    prerequisiteContractCount: 11,
    plannedImplementationStepCount: 9,
    implementationInThisPhase: false,
    runtimeEnabled: false,
    runtimeCommandEnabled: false,
    runtimeExecutionEnabled: false,
    approvalEvaluatorImplemented: false,
    approvalGrantProduced: false,
    runtimeCommandExposureEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    readyForRuntimeEnablement: false,
    canEnableRuntime: false
  });
  assert.deepEqual(
    inventory.plannedImplementationSequence.map(({ stepId }) => stepId),
    expectedStepIds
  );
  for (const step of inventory.plannedImplementationSequence) {
    assert.equal(step.plannedOnly, true);
    assert.equal(step.implementedInThisPhase, false);
    assert.equal(step.enablesRuntime, false);
    assert.equal(step.startsRuntime, false);
    assert.equal(step.exposesRuntimeExecution, false);
  }
  assert.deepEqual(inventory.prerequisiteContractStatus, {
    allPriorContractsPrerequisiteOnly: true,
    approvalRecordsPrerequisiteOnly: true,
    commandExposureApprovalPrerequisiteOnly: true,
    readinessCheckpointPrerequisiteOnly: true,
    anyPrerequisiteEnablesRuntime: false,
    anyPrerequisiteStartsRuntime: false,
    anyPrerequisiteExposesRuntimeExecution: false,
    anyPrerequisiteCreatesApprovalGrant: false
  });
  assertAllFalse(inventory.runtimeBlockedStatus);
  assert.equal(inventory.serveRuntimeBlockedBehavior.recognizedByCli, true);
  assert.equal(inventory.serveRuntimeBlockedBehavior.stdout, "");
  assert.equal(inventory.serveRuntimeBlockedBehavior.runtimeExecution, false);
  assert.equal(inventory.serveRuntimeBlockedBehavior.writesFiles, false);
  assert.equal(inventory.planningDecision.decision, "blocked");
  assert.equal(inventory.planningDecision.planRecorded, true);
  assert.equal(inventory.planningDecision.readyForRuntimeEnablement, false);
  assert.equal(
    inventory.planningDecision.recommendedNextSlice,
    "phase-5.18-review-only-approval-evaluator-skeleton"
  );
  assert.ok(inventory.planningDecision.blockers.includes("approval_evaluator_not_implemented"));
  assert.ok(inventory.planningDecision.blockers.includes("runtime_enablement_review_not_granted"));
  assertAllFalse(inventory.planningDecision.runtimeEffect);
  assert.ok(inventory.forbiddenBehavior.includes("approval-evaluator-implemented"));
  assert.ok(inventory.forbiddenBehavior.includes("runtime-implementation-added"));
  assert.ok(inventory.forbiddenBehavior.includes("runtime-executed"));
  assert.ok(
    inventory.validationCommands.includes(
      "node --test tests/phase5-17-guarded-runtime-implementation-plan.test.mjs"
    )
  );
  assert.deepEqual(inventory.safetyPosture, {
    guardedRuntimeImplementationPlanRecorded: true,
    prerequisiteContractCount: 11,
    plannedImplementationStepCount: 9,
    implementationInThisPhase: false,
    allPriorContractsPrerequisiteOnly: true,
    approvalRecordsPrerequisiteOnly: true,
    commandExposureApprovalPrerequisiteOnly: true,
    readinessCheckpointPrerequisiteOnly: true,
    anyPrerequisiteEnablesRuntime: false,
    anyPrerequisiteStartsRuntime: false,
    anyPrerequisiteExposesRuntimeExecution: false,
    anyPrerequisiteCreatesApprovalGrant: false,
    runtimeBlocked: true,
    runtimeEnabled: false,
    runtimeStarted: false,
    runtimeReady: false,
    runtimeCommandEnabled: false,
    runtimeCommandExposureEnabled: false,
    runtimeExecutionEnabled: false,
    runtimeExecuted: false,
    approvalEvaluatorImplemented: false,
    approvalGrantProduced: false,
    runtimeImplementationAdded: false,
    hostPolicyRuntimeEnforcementImplemented: false,
    stdioSafetyImplemented: false,
    liveStdinLoopEnabled: false,
    runtimeStdoutWriterEnabled: false,
    runtimeStderrWriterEnabled: false,
    transcriptAuditConfinementImplemented: false,
    runtimeTranscriptWritePerformed: false,
    runtimeAuditWritePerformed: false,
    processControlBoundaryImplemented: false,
    processSpawnEnabled: false,
    processTerminationEnabled: false,
    runtimeSupervisionEnabled: false,
    rollbackKillSwitchBoundaryImplemented: false,
    runtimeRollbackPerformed: false,
    killSwitchActivated: false,
    positiveRuntimeSmokeCoverageImplemented: false,
    positiveRuntimeSmokeExecuted: false,
    adapterRuntimeBehaviorEnabled: false,
    contentFabricRuntimeBehaviorEnabled: false,
    webSocketHttpSurfaceEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    readyForRuntimeEnablement: false,
    canEnableRuntime: false,
    noLiveStdinLoop: true,
    noStdoutStderrWriters: true,
    noProcessControl: true,
    noProcessSpawn: true,
    noProcessTermination: true,
    noRuntimeSupervision: true,
    noRuntimeExecution: true,
    noTranscriptWrite: true,
    noFailureAuditWrite: true,
    noTranscriptAuditRuntimeWrites: true,
    noAdapterRuntimeBehavior: true,
    noContentFabricRuntimeBehavior: true,
    noWebSocketHttpSurface: true,
    noCliSourceChange: true,
    noRustSourceChange: true
  });
  assert.equal(report.safetyPosture.phase517GuardedRuntimeImplementationPlan, true);
  assert.equal(report.safetyPosture.flags.phase517RuntimeEnabled, false);
  assert.equal(report.safetyPosture.flags.phase517RuntimeCommandEnabled, false);
  assert.equal(report.safetyPosture.flags.phase517RuntimeExecutionEnabled, false);
  assert.equal(report.safetyPosture.flags.phase517RuntimeExecuted, false);
  assert.equal(report.safetyPosture.flags.phase517ApprovalEvaluatorImplemented, false);
  assert.equal(report.safetyPosture.flags.phase517ApprovalGrantProduced, false);
  assert.equal(report.safetyPosture.flags.phase517RuntimeImplementationAdded, false);
  assert.equal(report.safetyPosture.flags.phase517ProcessSpawnEnabled, false);
  assert.equal(report.safetyPosture.flags.phase517RuntimeSupervisionEnabled, false);
  assert.equal(report.safetyPosture.flags.phase517WebSocketHttpSurfaceEnabled, false);
});

test("report inventories Phase 5.18 as review-only approval evaluator skeleton with runtime blocked", async () => {
  const report = await runReport();
  const inventory = report.phase518ReviewOnlyApprovalEvaluatorSkeletonInventory;

  assert.deepEqual(inventory.statusLayer, {
    document: "docs/phase-5-18-review-only-approval-evaluator-skeleton.md",
    fixture:
      "tests/fixtures/host-policy/phase5-18/review-only-approval-evaluator-skeleton.json",
    sourceGuardedRuntimeImplementationPlanDocument:
      "docs/phase-5-17-guarded-runtime-implementation-plan.md",
    sourceGuardedRuntimeImplementationPlanFixture:
      "tests/fixtures/host-policy/phase5-17/guarded-runtime-implementation-plan.json",
    precedingPhase: "5.17",
    layerId: "review-only-approval-evaluator-skeleton",
    scope: "phase-5-review-only-approval-evaluator-runtime-disabled",
    reviewOnlyApprovalEvaluatorSkeletonRecorded: true,
    evaluatorKind: "review-only-runtime-approval-evaluator",
    evaluatorReviewOnly: true,
    evaluatorAuthoritative: false,
    approvalGrantProduced: false,
    approvalGrantPersisted: false,
    runtimeEnabled: false,
    runtimeStarted: false,
    runtimeReady: false,
    runtimeCommandEnabled: false,
    runtimeCommandExposureEnabled: false,
    runtimeExecutionEnabled: false,
    runtimeExecuted: false,
    liveStdinLoopEnabled: false,
    runtimeStdoutWriterEnabled: false,
    runtimeStderrWriterEnabled: false,
    processSpawnEnabled: false,
    processTerminationEnabled: false,
    runtimeSupervisionEnabled: false,
    runtimeTranscriptWritePerformed: false,
    runtimeAuditWritePerformed: false,
    adapterRuntimeBehaviorChanged: false,
    contentFabricRuntimeBehaviorChanged: false,
    webSocketHttpSurfaceEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    canEnableRuntime: false,
    cliSourceChanged: false,
    rustSourceChanged: false,
    reportRunsChecks: false
  });

  assert.deepEqual(
    inventory.docs.map(({ path, status }) => [path, status]),
    phase518DocFiles.map((path) => [path, "present"])
  );
  assert.deepEqual(inventory.crossLinks, phase518CrossLinks);
  assertKnownInventoryStatuses(inventory.machineReadableArtifacts);
  assert.deepEqual(inventory.machineReadableArtifacts.map(({ path }) => path), [
    "tests/fixtures/host-policy/phase5-18/review-only-approval-evaluator-skeleton.json"
  ]);
  assertKnownInventoryStatuses(inventory.tests);
  assert.deepEqual(inventory.tests.map(({ path }) => path), [
    "tests/report-phase-status.test.mjs",
    "tests/phase5-18-review-only-approval-evaluator-skeleton.test.mjs"
  ]);
  assert.deepEqual(inventory.ownershipBoundary, {
    docsStatusFiles: [
      "README.md",
      "apps/cli/README.md",
      "crates/ardyn-host/README.md",
      "docs/phase-5-17-guarded-runtime-implementation-plan.md",
      "docs/phase-5-18-review-only-approval-evaluator-skeleton.md",
      "scripts/report-phase-status.mjs",
      "tests/report-phase-status.test.mjs"
    ],
    coreReviewOnlyFilesChanged: [
      "packages/core/src/index.mjs",
      "packages/core/src/index.d.ts"
    ],
    machineReadableArtifactFiles: [
      "tests/fixtures/host-policy/phase5-18/review-only-approval-evaluator-skeleton.json"
    ],
    focusedTestFiles: [
      "tests/phase5-18-review-only-approval-evaluator-skeleton.test.mjs",
      "tests/report-phase-status.test.mjs"
    ],
    cliRuntimeSourceFilesChanged: [],
    rustRuntimeSourceFilesChanged: [],
    cliSourceChangedByThisPhase: false,
    appsCliIndexChangedByThisPhase: false,
    rustSourceChangedByThisPhase: false,
    approvalGrantProducedByThisPhase: false,
    runtimeEnabledByThisPhase: false,
    reportRunsChecks: false,
    separateApprovalGrantPhaseRequired: true,
    separateRuntimeEnablementApprovalRequired: true
  });
  assert.deepEqual(inventory.sourcePhase, {
    phase: "phase-5.17-guarded-runtime-implementation-plan",
    document: "docs/phase-5-17-guarded-runtime-implementation-plan.md",
    fixture: "tests/fixtures/host-policy/phase5-17/guarded-runtime-implementation-plan.json",
    runtimeEnabled: false,
    implementationPlanRecorded: true,
    recommendedNextSlice: "phase-5.18-review-only-approval-evaluator-skeleton"
  });
  assert.deepEqual(inventory.evaluatorSummary, {
    reviewOnlyApprovalEvaluatorSkeletonRecorded: true,
    evaluatorKind: "review-only-runtime-approval-evaluator",
    evaluatorReviewOnly: true,
    evaluatorAuthoritative: false,
    missingPrerequisiteRecordsRejected: true,
    invalidPrerequisiteRecordsRejected: true,
    revokedPrerequisiteRecordsRejected: true,
    validPrerequisiteRecordsRecognizedForReviewOnly: true,
    approvalGrantProduced: false,
    approvalGrantPersisted: false,
    runtimeEnabled: false,
    runtimeCommandEnabled: false,
    runtimeCommandExposureEnabled: false,
    runtimeExecutionEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    canEnableRuntime: false
  });
  assert.equal(inventory.evaluatorInputShape.runtimeApprovalRecordSchema, "ardyn.runtime-approval-record");
  assert.equal(
    inventory.evaluatorInputShape.commandExposureApprovalRecordSchema,
    "ardyn.runtime-command-exposure-approval-record"
  );
  assert.equal(inventory.evaluatorResultShape.resultCannotAuthorizeRuntime, true);
  assert.deepEqual(inventory.evaluatorCases.map(({ caseId }) => caseId), [
    "missing-prerequisite-records",
    "invalid-runtime-approval-record",
    "revoked-runtime-approval-record",
    "valid-prerequisite-records-review-only"
  ]);
  for (const evaluatorCase of inventory.evaluatorCases) {
    assert.equal(evaluatorCase.reviewOnly, true);
    assert.equal(evaluatorCase.authoritative, false);
    assert.equal(evaluatorCase.approvalGrant.produced, false);
    assert.equal(evaluatorCase.approvalGrant.persisted, false);
    assert.equal(evaluatorCase.approvalGrant.grantId, null);
    assertAllFalse(evaluatorCase.runtimeEffect);
  }
  assertAllFalse(inventory.blockedRuntimeEffect);
  assert.equal(inventory.serveRuntimeBlockedBehavior.recognizedByCli, true);
  assert.equal(inventory.serveRuntimeBlockedBehavior.stdout, "");
  assert.equal(inventory.serveRuntimeBlockedBehavior.runtimeExecution, false);
  assert.equal(inventory.serveRuntimeBlockedBehavior.writesFiles, false);
  assert.ok(inventory.forbiddenBehavior.includes("approval-grant-produced"));
  assert.ok(inventory.forbiddenBehavior.includes("approval-evaluator-cli-command"));
  assert.ok(inventory.forbiddenBehavior.includes("runtime-executed"));
  assert.ok(
    inventory.validationCommands.includes(
      "node --test tests/phase5-18-review-only-approval-evaluator-skeleton.test.mjs"
    )
  );
  assert.deepEqual(inventory.safetyPosture, {
    reviewOnlyApprovalEvaluatorSkeletonRecorded: true,
    evaluatorReviewOnly: true,
    evaluatorAuthoritative: false,
    missingPrerequisiteRecordsRejected: true,
    invalidPrerequisiteRecordsRejected: true,
    revokedPrerequisiteRecordsRejected: true,
    validPrerequisiteRecordsRecognizedForReviewOnly: true,
    approvalGrantProduced: false,
    approvalGrantPersisted: false,
    runtimeBlocked: true,
    runtimeEnabled: false,
    runtimeStarted: false,
    runtimeReady: false,
    runtimeCommandEnabled: false,
    runtimeCommandExposureEnabled: false,
    runtimeExecutionEnabled: false,
    runtimeExecuted: false,
    liveStdinLoopEnabled: false,
    runtimeStdoutWriterEnabled: false,
    runtimeStderrWriterEnabled: false,
    processSpawnEnabled: false,
    processTerminationEnabled: false,
    runtimeSupervisionEnabled: false,
    runtimeTranscriptWritePerformed: false,
    runtimeAuditWritePerformed: false,
    adapterRuntimeBehaviorEnabled: false,
    contentFabricRuntimeBehaviorEnabled: false,
    webSocketHttpSurfaceEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    canEnableRuntime: false,
    noCliSourceChange: true,
    noRustSourceChange: true
  });
  assert.equal(report.safetyPosture.phase518ReviewOnlyApprovalEvaluatorSkeleton, true);
  assert.equal(report.safetyPosture.flags.phase518EvaluatorReviewOnly, true);
  assert.equal(report.safetyPosture.flags.phase518EvaluatorAuthoritative, false);
  assert.equal(report.safetyPosture.flags.phase518ApprovalGrantProduced, false);
  assert.equal(report.safetyPosture.flags.phase518ApprovalGrantPersisted, false);
  assert.equal(report.safetyPosture.flags.phase518RuntimeEnabled, false);
  assert.equal(report.safetyPosture.flags.phase518RuntimeCommandEnabled, false);
  assert.equal(report.safetyPosture.flags.phase518RuntimeCommandExposureEnabled, false);
  assert.equal(report.safetyPosture.flags.phase518RuntimeExecutionEnabled, false);
  assert.equal(report.safetyPosture.flags.phase518RuntimeExecuted, false);
  assert.equal(report.safetyPosture.flags.phase518ProcessSpawnEnabled, false);
  assert.equal(report.safetyPosture.flags.phase518RuntimeSupervisionEnabled, false);
  assert.equal(report.safetyPosture.flags.phase518WebSocketHttpSurfaceEnabled, false);
});

test("report inventories Phase 5.19 as approval prerequisite reader hardening with runtime blocked", async () => {
  const report = await runReport();
  const inventory = report.phase519ApprovalPrerequisiteReaderHardeningInventory;

  assert.deepEqual(inventory.statusLayer, {
    document: "docs/phase-5-19-approval-prerequisite-reader-hardening.md",
    fixture:
      "tests/fixtures/host-policy/phase5-19/approval-prerequisite-reader-hardening.json",
    sourceReviewOnlyApprovalEvaluatorDocument:
      "docs/phase-5-18-review-only-approval-evaluator-skeleton.md",
    sourceReviewOnlyApprovalEvaluatorFixture:
      "tests/fixtures/host-policy/phase5-18/review-only-approval-evaluator-skeleton.json",
    precedingPhase: "5.18",
    layerId: "approval-prerequisite-reader-hardening",
    scope: "phase-5-approval-prerequisite-reader-review-only-runtime-disabled",
    approvalPrerequisiteReaderHardeningRecorded: true,
    readerKind: "approval-prerequisite-reader",
    readerReviewOnly: true,
    readerAuthoritative: false,
    approvalGrantProduced: false,
    approvalGrantPersisted: false,
    runtimeEnabled: false,
    runtimeStarted: false,
    runtimeReady: false,
    runtimeCommandEnabled: false,
    runtimeCommandExposureEnabled: false,
    runtimeExecutionEnabled: false,
    runtimeExecuted: false,
    liveStdinLoopEnabled: false,
    runtimeStdoutWriterEnabled: false,
    runtimeStderrWriterEnabled: false,
    processSpawnEnabled: false,
    processTerminationEnabled: false,
    runtimeSupervisionEnabled: false,
    runtimeTranscriptWritePerformed: false,
    runtimeAuditWritePerformed: false,
    adapterRuntimeBehaviorChanged: false,
    contentFabricRuntimeBehaviorChanged: false,
    webSocketHttpSurfaceEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    canEnableRuntime: false,
    cliSourceChanged: false,
    rustSourceChanged: false,
    reportRunsChecks: false
  });

  assert.deepEqual(
    inventory.docs.map(({ path, status }) => [path, status]),
    phase519DocFiles.map((path) => [path, "present"])
  );
  assert.deepEqual(inventory.crossLinks, phase519CrossLinks);
  assertKnownInventoryStatuses(inventory.machineReadableArtifacts);
  assert.deepEqual(inventory.machineReadableArtifacts.map(({ path }) => path), [
    "tests/fixtures/host-policy/phase5-19/approval-prerequisite-reader-hardening.json"
  ]);
  assertKnownInventoryStatuses(inventory.tests);
  assert.deepEqual(inventory.tests.map(({ path }) => path), [
    "tests/report-phase-status.test.mjs",
    "tests/phase5-19-approval-prerequisite-reader-hardening.test.mjs"
  ]);
  assert.deepEqual(inventory.sourcePhase, {
    phase: "phase-5.18-review-only-approval-evaluator-skeleton",
    document: "docs/phase-5-18-review-only-approval-evaluator-skeleton.md",
    fixture: "tests/fixtures/host-policy/phase5-18/review-only-approval-evaluator-skeleton.json",
    runtimeEnabled: false,
    reviewOnlyApprovalEvaluatorSkeletonRecorded: true,
    approvalGrantProduced: false,
    recommendedNextSlice: "phase-5.19-approval-prerequisite-reader-hardening"
  });
  assert.deepEqual(inventory.readerSummary, {
    approvalPrerequisiteReaderHardeningRecorded: true,
    readerKind: "approval-prerequisite-reader",
    readerReviewOnly: true,
    readerAuthoritative: false,
    missingPrerequisiteRecordsRejected: true,
    malformedPrerequisiteRecordsRejected: true,
    revokedPrerequisiteRecordsRejected: true,
    validPrerequisiteRecordsRecognizedForReviewOnly: true,
    duplicatePrerequisiteRecordsRejected: true,
    stalePrerequisiteRecordsRejected: true,
    unknownPrerequisiteRecordsRejected: true,
    approvalGrantProduced: false,
    approvalGrantPersisted: false,
    runtimeEnabled: false,
    runtimeCommandEnabled: false,
    runtimeCommandExposureEnabled: false,
    runtimeExecutionEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    canEnableRuntime: false
  });
  assert.equal(inventory.readerInputShape.runtimeApprovalRecordSchema, "ardyn.runtime-approval-record");
  assert.equal(
    inventory.readerInputShape.commandExposureApprovalRecordSchema,
    "ardyn.runtime-command-exposure-approval-record"
  );
  assert.equal(inventory.readerResultShape.resultCannotAuthorizeRuntime, true);
  assert.deepEqual(inventory.readerCases.map(({ caseId }) => caseId), [
    "missing-prerequisite-records",
    "malformed-prerequisite-record",
    "malformed-sparse-effect-record",
    "revoked-prerequisite-record",
    "valid-prerequisite-records-review-only",
    "duplicate-prerequisite-record",
    "stale-prerequisite-record",
    "unknown-prerequisite-record"
  ]);
  for (const readerCase of inventory.readerCases) {
    assert.equal(readerCase.reviewOnly, true);
    assert.equal(readerCase.authoritative, false);
    assert.equal(readerCase.approvalGrant.produced, false);
    assert.equal(readerCase.approvalGrant.persisted, false);
    assert.equal(readerCase.approvalGrant.grantId, null);
    assertAllFalse(readerCase.runtimeEffect);
  }
  assert.equal(inventory.evaluatorIntegration.readerUsedByReviewOnlyEvaluator, true);
  assert.equal(inventory.evaluatorIntegration.evaluatorStillReviewOnly, true);
  assert.equal(inventory.evaluatorIntegration.evaluatorCanProduceGrant, false);
  assertAllFalse(inventory.blockedRuntimeEffect);
  assert.equal(inventory.serveRuntimeBlockedBehavior.recognizedByCli, true);
  assert.equal(inventory.serveRuntimeBlockedBehavior.stdout, "");
  assert.equal(inventory.serveRuntimeBlockedBehavior.runtimeExecution, false);
  assert.equal(inventory.serveRuntimeBlockedBehavior.writesFiles, false);
  assert.ok(inventory.forbiddenBehavior.includes("approval-grant-produced"));
  assert.ok(inventory.forbiddenBehavior.includes("approval-prerequisite-reader-cli-command"));
  assert.ok(inventory.forbiddenBehavior.includes("runtime-executed"));
  assert.ok(
    inventory.validationCommands.includes(
      "node --test tests/phase5-19-approval-prerequisite-reader-hardening.test.mjs"
    )
  );
  assert.deepEqual(inventory.safetyPosture, {
    approvalPrerequisiteReaderHardeningRecorded: true,
    readerReviewOnly: true,
    readerAuthoritative: false,
    missingPrerequisiteRecordsRejected: true,
    malformedPrerequisiteRecordsRejected: true,
    revokedPrerequisiteRecordsRejected: true,
    validPrerequisiteRecordsRecognizedForReviewOnly: true,
    duplicatePrerequisiteRecordsRejected: true,
    stalePrerequisiteRecordsRejected: true,
    unknownPrerequisiteRecordsRejected: true,
    approvalGrantProduced: false,
    approvalGrantPersisted: false,
    runtimeBlocked: true,
    runtimeEnabled: false,
    runtimeStarted: false,
    runtimeReady: false,
    runtimeCommandEnabled: false,
    runtimeCommandExposureEnabled: false,
    runtimeExecutionEnabled: false,
    runtimeExecuted: false,
    liveStdinLoopEnabled: false,
    runtimeStdoutWriterEnabled: false,
    runtimeStderrWriterEnabled: false,
    processSpawnEnabled: false,
    processTerminationEnabled: false,
    runtimeSupervisionEnabled: false,
    runtimeTranscriptWritePerformed: false,
    runtimeAuditWritePerformed: false,
    adapterRuntimeBehaviorEnabled: false,
    contentFabricRuntimeBehaviorEnabled: false,
    webSocketHttpSurfaceEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    canEnableRuntime: false,
    noCliSourceChange: true,
    noRustSourceChange: true
  });
  assert.equal(report.safetyPosture.phase519ApprovalPrerequisiteReaderHardening, true);
  assert.equal(report.safetyPosture.flags.phase519ReaderReviewOnly, true);
  assert.equal(report.safetyPosture.flags.phase519ReaderAuthoritative, false);
  assert.equal(report.safetyPosture.flags.phase519ApprovalGrantProduced, false);
  assert.equal(report.safetyPosture.flags.phase519ApprovalGrantPersisted, false);
  assert.equal(report.safetyPosture.flags.phase519RuntimeEnabled, false);
  assert.equal(report.safetyPosture.flags.phase519RuntimeCommandEnabled, false);
  assert.equal(report.safetyPosture.flags.phase519RuntimeCommandExposureEnabled, false);
  assert.equal(report.safetyPosture.flags.phase519RuntimeExecutionEnabled, false);
  assert.equal(report.safetyPosture.flags.phase519RuntimeExecuted, false);
  assert.equal(report.safetyPosture.flags.phase519ProcessSpawnEnabled, false);
  assert.equal(report.safetyPosture.flags.phase519RuntimeSupervisionEnabled, false);
  assert.equal(report.safetyPosture.flags.phase519WebSocketHttpSurfaceEnabled, false);
});

test("report inventories Phase 5.20 as approval prerequisite source ingestion preflight with runtime blocked", async () => {
  const report = await runReport();
  const inventory = report.phase520ApprovalPrerequisiteSourceIngestionPreflightInventory;

  assert.deepEqual(inventory.statusLayer, {
    document: "docs/phase-5-20-approval-prerequisite-source-ingestion-preflight.md",
    fixture:
      "tests/fixtures/host-policy/phase5-20/approval-prerequisite-source-ingestion-preflight.json",
    sourceApprovalPrerequisiteReaderDocument:
      "docs/phase-5-19-approval-prerequisite-reader-hardening.md",
    sourceApprovalPrerequisiteReaderFixture:
      "tests/fixtures/host-policy/phase5-19/approval-prerequisite-reader-hardening.json",
    precedingPhase: "5.19",
    layerId: "approval-prerequisite-source-ingestion-preflight",
    scope:
      "phase-5-approval-prerequisite-source-ingestion-preflight-review-only-runtime-disabled",
    approvalPrerequisiteSourcePreflightRecorded: true,
    preflightKind: "approval-prerequisite-source-ingestion-preflight",
    preflightReviewOnly: true,
    preflightAuthoritative: false,
    approvalGrantProduced: false,
    approvalGrantPersisted: false,
    runtimeEnabled: false,
    runtimeStarted: false,
    runtimeReady: false,
    runtimeCommandEnabled: false,
    runtimeCommandExposureEnabled: false,
    runtimeExecutionEnabled: false,
    runtimeExecuted: false,
    filesystemWatcherEnabled: false,
    externalSourceLookupEnabled: false,
    secretsEnvIngestionEnabled: false,
    liveStdinLoopEnabled: false,
    runtimeStdoutWriterEnabled: false,
    runtimeStderrWriterEnabled: false,
    processSpawnEnabled: false,
    processTerminationEnabled: false,
    runtimeSupervisionEnabled: false,
    runtimeTranscriptWritePerformed: false,
    runtimeAuditWritePerformed: false,
    adapterRuntimeBehaviorChanged: false,
    contentFabricRuntimeBehaviorChanged: false,
    webSocketHttpSurfaceEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    canEnableRuntime: false,
    cliSourceChanged: false,
    rustSourceChanged: false,
    reportRunsChecks: false
  });

  assert.deepEqual(
    inventory.docs.map(({ path, status }) => [path, status]),
    phase520DocFiles.map((path) => [path, "present"])
  );
  assert.deepEqual(inventory.crossLinks, phase520CrossLinks);
  assertKnownInventoryStatuses(inventory.machineReadableArtifacts);
  assert.deepEqual(inventory.machineReadableArtifacts.map(({ path }) => path), [
    "tests/fixtures/host-policy/phase5-20/approval-prerequisite-source-ingestion-preflight.json"
  ]);
  assertKnownInventoryStatuses(inventory.tests);
  assert.deepEqual(inventory.tests.map(({ path }) => path), [
    "tests/report-phase-status.test.mjs",
    "tests/phase5-20-approval-prerequisite-source-ingestion-preflight.test.mjs"
  ]);
  assert.deepEqual(inventory.sourcePhase, {
    phase: "phase-5.19-approval-prerequisite-reader-hardening",
    readerPath: "packages/core/src/index.mjs#readApprovalPrerequisiteRecordsForReview",
    evaluatorPath: "packages/core/src/index.mjs#evaluateRuntimeApprovalPrerequisitesForReview",
    runtimeEnabled: false,
    approvalGrantProduced: false
  });
  assert.deepEqual(inventory.preflightSummary, {
    approvalPrerequisiteSourcePreflightRecorded: true,
    preflightKind: "approval-prerequisite-source-ingestion-preflight",
    preflightReviewOnly: true,
    preflightAuthoritative: false,
    missingSourceInputsRejected: true,
    malformedSourceInputsRejected: true,
    emptySourceInputsRejected: true,
    duplicateSourceInputsRejected: true,
    stalePrerequisiteSourceInputsRejected: true,
    unknownPrerequisiteSourceInputsRejected: true,
    revokedPrerequisiteSourceInputsRejected: true,
    validSourceInputsRecognizedForReaderOnly: true,
    approvalGrantProduced: false,
    approvalGrantPersisted: false,
    runtimeEnabled: false,
    runtimeCommandEnabled: false,
    runtimeCommandExposureEnabled: false,
    runtimeExecutionEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    canEnableRuntime: false
  });
  assert.equal(inventory.sourceInputShape.sourceKind, "inline-prerequisite-records");
  assert.equal(inventory.sourceInputShape.sourceMode, "in-memory");
  assert.equal(inventory.sourceInputShape.filesystemWatcherAllowed, false);
  assert.equal(inventory.sourceInputShape.externalSourceLookupAllowed, false);
  assert.equal(inventory.sourceInputShape.secretsEnvIngestionAllowed, false);
  assert.equal(
    inventory.preflightResultShape.schema,
    "ardyn.phase-5.20.approval-prerequisite-source-preflight-result"
  );
  assert.equal(inventory.preflightResultShape.resultCannotAuthorizeRuntime ?? true, true);
  assert.deepEqual(inventory.sourcePreflightCases.map(({ caseId }) => caseId), [
    "missing-source-inputs",
    "malformed-source-input",
    "empty-source-input",
    "duplicate-source-input",
    "stale-prerequisite-source-input",
    "unknown-prerequisite-source-input",
    "revoked-prerequisite-source-input",
    "valid-prerequisite-source-input"
  ]);
  for (const sourceCase of inventory.sourcePreflightCases) {
    assert.equal(sourceCase.reviewOnly, true);
    assert.equal(sourceCase.authoritative, false);
    assert.equal(sourceCase.approvalGrant.produced, false);
    assert.equal(sourceCase.approvalGrant.persisted, false);
    assert.equal(sourceCase.approvalGrant.grantId, null);
    assertAllFalse(sourceCase.runtimeEffect);
  }
  assert.equal(inventory.readerIntegration.acceptedSourcesMayFeedReviewReader, true);
  assert.equal(inventory.readerIntegration.rejectedSourcesDoNotFeedReader, true);
  assert.equal(inventory.readerIntegration.readerStillReviewOnly, true);
  assert.equal(inventory.readerIntegration.evaluatorStillReviewOnly, true);
  assert.equal(inventory.readerIntegration.readerCanProduceGrant, false);
  assert.equal(inventory.readerIntegration.evaluatorCanProduceGrant, false);
  assertAllFalse(inventory.blockedRuntimeEffect);
  assert.equal(inventory.serveRuntimeBlockedBehavior.recognizedByCli, true);
  assert.equal(inventory.serveRuntimeBlockedBehavior.stdout, "");
  assert.equal(inventory.serveRuntimeBlockedBehavior.runtimeExecution, false);
  assert.equal(inventory.serveRuntimeBlockedBehavior.writesFiles, false);
  assert.ok(
    inventory.forbiddenBehavior.includes(
      "No filesystem watcher is added for prerequisite sources."
    )
  );
  assert.ok(
    inventory.forbiddenBehavior.includes("No external source lookup is performed.")
  );
  assert.ok(
    inventory.forbiddenBehavior.includes(
      "No approval grant is produced or persisted."
    )
  );
  assert.ok(
    inventory.validationCommands.includes(
      "node --test tests/phase5-20-approval-prerequisite-source-ingestion-preflight.test.mjs"
    )
  );
  assert.deepEqual(inventory.safetyPosture, {
    approvalPrerequisiteSourcePreflightRecorded: true,
    preflightReviewOnly: true,
    preflightAuthoritative: false,
    missingSourceInputsRejected: true,
    malformedSourceInputsRejected: true,
    emptySourceInputsRejected: true,
    duplicateSourceInputsRejected: true,
    stalePrerequisiteSourceInputsRejected: true,
    unknownPrerequisiteSourceInputsRejected: true,
    revokedPrerequisiteSourceInputsRejected: true,
    validSourceInputsRecognizedForReaderOnly: true,
    acceptedSourcesMayFeedReviewReader: true,
    rejectedSourcesDoNotFeedReader: true,
    approvalGrantProduced: false,
    approvalGrantPersisted: false,
    runtimeBlocked: true,
    runtimeEnabled: false,
    runtimeStarted: false,
    runtimeReady: false,
    runtimeCommandEnabled: false,
    runtimeCommandExposureEnabled: false,
    runtimeExecutionEnabled: false,
    runtimeExecuted: false,
    filesystemWatcherEnabled: false,
    externalSourceLookupEnabled: false,
    secretsEnvIngestionEnabled: false,
    liveStdinLoopEnabled: false,
    runtimeStdoutWriterEnabled: false,
    runtimeStderrWriterEnabled: false,
    processSpawnEnabled: false,
    processTerminationEnabled: false,
    runtimeSupervisionEnabled: false,
    runtimeTranscriptWritePerformed: false,
    runtimeAuditWritePerformed: false,
    adapterRuntimeBehaviorEnabled: false,
    contentFabricRuntimeBehaviorEnabled: false,
    webSocketHttpSurfaceEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    canEnableRuntime: false,
    noCliSourceChange: true,
    noRustSourceChange: true
  });
  assert.equal(report.safetyPosture.phase520ApprovalPrerequisiteSourceIngestionPreflight, true);
  for (const flagName of phase520ExpectedTrueSafetyFlagNames) {
    assert.equal(report.safetyPosture.flags[flagName], true);
  }
  for (const flagName of phase520ExpectedFalseSafetyFlagNames) {
    assert.equal(report.safetyPosture.flags[flagName], false);
  }
});

test("report inventories Phase 5.21 as approval prerequisite source selection with runtime blocked", async () => {
  const report = await runReport();
  const inventory = report.phase521ApprovalPrerequisiteSourceSelectionInventory;

  assert.deepEqual(inventory.statusLayer, {
    document: "docs/phase-5-21-approval-prerequisite-source-selection.md",
    fixture:
      "tests/fixtures/host-policy/phase5-21/approval-prerequisite-source-selection-contract.json",
    sourceApprovalPrerequisitePreflightDocument:
      "docs/phase-5-20-approval-prerequisite-source-ingestion-preflight.md",
    sourceApprovalPrerequisitePreflightFixture:
      "tests/fixtures/host-policy/phase5-20/approval-prerequisite-source-ingestion-preflight.json",
    precedingPhase: "5.20",
    layerId: "approval-prerequisite-source-selection",
    scope:
      "phase-5-approval-prerequisite-source-selection-review-only-runtime-disabled",
    approvalPrerequisiteSourceSelectionRecorded: true,
    selectionKind: "approval-prerequisite-source-selection",
    selectionReviewOnly: true,
    selectionAuthoritative: false,
    missingSourcesRejected: true,
    multipleValidSourcesHandledDeterministically: true,
    conflictingValidSourcesRejected: true,
    duplicateEquivalentSourcesHandledDeterministically: true,
    staleSourcesRejected: true,
    revokedSourcesRejected: true,
    unknownSourcesRejected: true,
    malformedSourcesRejected: true,
    emptySourcesRejected: true,
    selectedSourceFeedsReviewReaderOnly: true,
    approvalGrantProduced: false,
    approvalGrantPersisted: false,
    runtimeEnabled: false,
    runtimeStarted: false,
    runtimeReady: false,
    runtimeCommandEnabled: false,
    runtimeCommandExposureEnabled: false,
    runtimeExecutionEnabled: false,
    runtimeExecuted: false,
    filesystemWatcherEnabled: false,
    externalSourceLookupEnabled: false,
    secretsEnvIngestionEnabled: false,
    liveStdinLoopEnabled: false,
    runtimeStdoutWriterEnabled: false,
    runtimeStderrWriterEnabled: false,
    processSpawnEnabled: false,
    processTerminationEnabled: false,
    runtimeSupervisionEnabled: false,
    runtimeTranscriptWritePerformed: false,
    runtimeAuditWritePerformed: false,
    adapterRuntimeBehaviorChanged: false,
    contentFabricRuntimeBehaviorChanged: false,
    webSocketHttpSurfaceEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    canEnableRuntime: false,
    cliSourceChanged: false,
    rustSourceChanged: false,
    reportRunsChecks: false
  });

  assert.deepEqual(
    inventory.docs.map(({ path, status }) => [path, status]),
    phase521DocFiles.map((path) => [path, "present"])
  );
  assert.deepEqual(inventory.crossLinks, phase521CrossLinks);
  assertKnownInventoryStatuses(inventory.machineReadableArtifacts);
  assert.deepEqual(inventory.machineReadableArtifacts.map(({ path }) => path), [
    "tests/fixtures/host-policy/phase5-21/approval-prerequisite-source-selection-contract.json"
  ]);
  assertKnownInventoryStatuses(inventory.tests);
  assert.deepEqual(inventory.tests.map(({ path }) => path), [
    "tests/report-phase-status.test.mjs",
    "tests/phase5-21-approval-prerequisite-source-selection.test.mjs"
  ]);
  assert.deepEqual(inventory.sourcePhase, {
    phase: "phase-5.20-approval-prerequisite-source-ingestion-preflight",
    preflightPath:
      "packages/core/src/index.mjs#preflightApprovalPrerequisiteSourcesForReview",
    readerPath: "packages/core/src/index.mjs#readApprovalPrerequisiteRecordsForReview",
    evaluatorPath: "packages/core/src/index.mjs#evaluateRuntimeApprovalPrerequisitesForReview",
    runtimeEnabled: false,
    approvalGrantProduced: false
  });
  assert.deepEqual(inventory.selectionSummary, {
    approvalPrerequisiteSourceSelectionRecorded: true,
    selectionKind: "approval-prerequisite-source-selection",
    selectionReviewOnly: true,
    selectionAuthoritative: false,
    missingSourcesRejected: true,
    multipleValidSourcesHandledDeterministically: true,
    conflictingValidSourcesRejected: true,
    duplicateEquivalentSourcesHandledDeterministically: true,
    staleSourcesRejected: true,
    revokedSourcesRejected: true,
    unknownSourcesRejected: true,
    malformedSourcesRejected: true,
    emptySourcesRejected: true,
    selectedSourceFeedsReviewReaderOnly: true,
    approvalGrantProduced: false,
    approvalGrantPersisted: false,
    runtimeEnabled: false,
    runtimeCommandEnabled: false,
    runtimeCommandExposureEnabled: false,
    runtimeExecutionEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    canEnableRuntime: false
  });
  assert.equal(inventory.sourceSelectionShape.sourceKind, "inline-prerequisite-records");
  assert.equal(inventory.sourceSelectionShape.sourceMode, "in-memory");
  assert.equal(inventory.sourceSelectionShape.deterministicTieBreak, "lowest-source-id");
  assert.equal(inventory.sourceSelectionShape.conflictPolicy, "fail-closed");
  assert.equal(inventory.sourceSelectionShape.filesystemWatcherAllowed, false);
  assert.equal(inventory.sourceSelectionShape.externalSourceLookupAllowed, false);
  assert.equal(inventory.sourceSelectionShape.secretsEnvIngestionAllowed, false);
  assert.equal(
    inventory.selectionResultShape.schema,
    "ardyn.phase-5.21.approval-prerequisite-source-selection-result"
  );
  assert.equal(inventory.selectionResultShape.selectedReaderInputOnly, true);
  assert.equal(inventory.selectionResultShape.approvalGrantProduced, false);
  assert.deepEqual(inventory.sourceSelectionCases.map(({ caseId }) => caseId), [
    "missing-sources",
    "single-valid-source-selected",
    "multiple-equivalent-valid-sources-selected",
    "duplicate-equivalent-valid-sources-selected",
    "conflicting-valid-sources-rejected",
    "duplicate-source-id-rejected",
    "stale-source-rejected",
    "revoked-source-rejected",
    "unknown-source-rejected",
    "malformed-source-rejected",
    "empty-source-rejected"
  ]);
  for (const sourceCase of inventory.sourceSelectionCases) {
    assert.equal(sourceCase.reviewOnly, true);
    assert.equal(sourceCase.authoritative, false);
    assert.equal(sourceCase.approvalGrant.produced, false);
    assert.equal(sourceCase.approvalGrant.persisted, false);
    assert.equal(sourceCase.approvalGrant.grantId, null);
    assertAllFalse(sourceCase.runtimeEffect);
  }
  assert.equal(inventory.readerIntegration.selectedSourceMayFeedReviewReader, true);
  assert.equal(inventory.readerIntegration.rejectedSelectionDoesNotFeedReader, true);
  assert.equal(inventory.readerIntegration.readerStillReviewOnly, true);
  assert.equal(inventory.readerIntegration.evaluatorStillReviewOnly, true);
  assert.equal(inventory.readerIntegration.readerCanProduceGrant, false);
  assert.equal(inventory.readerIntegration.evaluatorCanProduceGrant, false);
  assertAllFalse(inventory.blockedRuntimeEffect);
  assert.equal(inventory.serveRuntimeBlockedBehavior.recognizedByCli, true);
  assert.equal(inventory.serveRuntimeBlockedBehavior.stdout, "");
  assert.equal(inventory.serveRuntimeBlockedBehavior.runtimeExecution, false);
  assert.equal(inventory.serveRuntimeBlockedBehavior.writesFiles, false);
  assert.ok(
    inventory.forbiddenBehavior.includes(
      "No CLI source-selection command is exposed."
    )
  );
  assert.ok(
    inventory.forbiddenBehavior.includes(
      "No approval grant is produced or persisted."
    )
  );
  assert.ok(
    inventory.validationCommands.includes(
      "node --test tests/phase5-21-approval-prerequisite-source-selection.test.mjs"
    )
  );
  assert.deepEqual(inventory.safetyPosture, {
    approvalPrerequisiteSourceSelectionRecorded: true,
    selectionReviewOnly: true,
    selectionAuthoritative: false,
    missingSourcesRejected: true,
    multipleValidSourcesHandledDeterministically: true,
    conflictingValidSourcesRejected: true,
    duplicateEquivalentSourcesHandledDeterministically: true,
    staleSourcesRejected: true,
    revokedSourcesRejected: true,
    unknownSourcesRejected: true,
    malformedSourcesRejected: true,
    emptySourcesRejected: true,
    selectedSourceFeedsReviewReaderOnly: true,
    approvalGrantProduced: false,
    approvalGrantPersisted: false,
    runtimeBlocked: true,
    runtimeEnabled: false,
    runtimeStarted: false,
    runtimeReady: false,
    runtimeCommandEnabled: false,
    runtimeCommandExposureEnabled: false,
    runtimeExecutionEnabled: false,
    runtimeExecuted: false,
    filesystemWatcherEnabled: false,
    externalSourceLookupEnabled: false,
    secretsEnvIngestionEnabled: false,
    liveStdinLoopEnabled: false,
    runtimeStdoutWriterEnabled: false,
    runtimeStderrWriterEnabled: false,
    processSpawnEnabled: false,
    processTerminationEnabled: false,
    runtimeSupervisionEnabled: false,
    runtimeTranscriptWritePerformed: false,
    runtimeAuditWritePerformed: false,
    adapterRuntimeBehaviorEnabled: false,
    contentFabricRuntimeBehaviorEnabled: false,
    webSocketHttpSurfaceEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    canEnableRuntime: false,
    noCliSourceChange: true,
    noRustSourceChange: true
  });
  assert.equal(report.safetyPosture.phase521ApprovalPrerequisiteSourceSelection, true);
  for (const flagName of phase521ExpectedTrueSafetyFlagNames) {
    assert.equal(report.safetyPosture.flags[flagName], true);
  }
  for (const flagName of phase521ExpectedFalseSafetyFlagNames) {
    assert.equal(report.safetyPosture.flags[flagName], false);
  }
});

test("report inventories Phase 5.22 as approval prerequisite source bundle with runtime blocked", async () => {
  const report = await runReport();
  const inventory = report.phase522ApprovalPrerequisiteSourceBundleInventory;

  assert.deepEqual(inventory.statusLayer, {
    document: "docs/phase-5-22-approval-prerequisite-source-bundle.md",
    fixture:
      "tests/fixtures/host-policy/phase5-22/approval-prerequisite-source-bundle-contract.json",
    sourceApprovalPrerequisiteSelectionDocument:
      "docs/phase-5-21-approval-prerequisite-source-selection.md",
    sourceApprovalPrerequisiteSelectionFixture:
      "tests/fixtures/host-policy/phase5-21/approval-prerequisite-source-selection-contract.json",
    precedingPhase: "5.21",
    layerId: "approval-prerequisite-source-bundle",
    scope:
      "phase-5-approval-prerequisite-source-bundle-review-only-runtime-disabled",
    approvalPrerequisiteSourceBundleRecorded: true,
    bundleKind: "approval-prerequisite-source-bundle",
    bundleReviewOnly: true,
    bundleAuthoritative: false,
    missingBundlePartsRejected: true,
    missingRequiredBundlePartsRejected: true,
    malformedBundlePartsRejected: true,
    duplicateBundlePartsHandledDeterministically: true,
    conflictingBundlePartsRejected: true,
    staleSourcesRejected: true,
    revokedSourcesRejected: true,
    unknownSourcesRejected: true,
    malformedSourcesRejected: true,
    emptySourcesRejected: true,
    validBundleFeedsReviewReaderOnly: true,
    approvalGrantProduced: false,
    approvalGrantPersisted: false,
    runtimeEnabled: false,
    runtimeStarted: false,
    runtimeReady: false,
    runtimeCommandEnabled: false,
    runtimeCommandExposureEnabled: false,
    runtimeExecutionEnabled: false,
    runtimeExecuted: false,
    filesystemWatcherEnabled: false,
    externalSourceLookupEnabled: false,
    secretsEnvIngestionEnabled: false,
    liveStdinLoopEnabled: false,
    runtimeStdoutWriterEnabled: false,
    runtimeStderrWriterEnabled: false,
    processSpawnEnabled: false,
    processTerminationEnabled: false,
    runtimeSupervisionEnabled: false,
    runtimeTranscriptWritePerformed: false,
    runtimeAuditWritePerformed: false,
    adapterRuntimeBehaviorChanged: false,
    contentFabricRuntimeBehaviorChanged: false,
    webSocketHttpSurfaceEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    canEnableRuntime: false,
    cliSourceChanged: false,
    rustSourceChanged: false,
    reportRunsChecks: false
  });

  assert.deepEqual(
    inventory.docs.map(({ path, status }) => [path, status]),
    phase522DocFiles.map((path) => [path, "present"])
  );
  assert.deepEqual(inventory.crossLinks, phase522CrossLinks);
  assertKnownInventoryStatuses(inventory.machineReadableArtifacts);
  assert.deepEqual(inventory.machineReadableArtifacts.map(({ path }) => path), [
    "tests/fixtures/host-policy/phase5-22/approval-prerequisite-source-bundle-contract.json"
  ]);
  assertKnownInventoryStatuses(inventory.tests);
  assert.deepEqual(inventory.tests.map(({ path }) => path), [
    "tests/report-phase-status.test.mjs",
    "tests/phase5-22-approval-prerequisite-source-bundle.test.mjs"
  ]);
  assert.deepEqual(inventory.sourcePhase, {
    phase: "phase-5.21-approval-prerequisite-source-selection",
    selectionPath:
      "packages/core/src/index.mjs#selectApprovalPrerequisiteSourcesForReview",
    preflightPath:
      "packages/core/src/index.mjs#preflightApprovalPrerequisiteSourcesForReview",
    readerPath: "packages/core/src/index.mjs#readApprovalPrerequisiteRecordsForReview",
    evaluatorPath: "packages/core/src/index.mjs#evaluateRuntimeApprovalPrerequisitesForReview",
    runtimeEnabled: false,
    approvalGrantProduced: false
  });
  assert.deepEqual(inventory.bundleSummary, {
    approvalPrerequisiteSourceBundleRecorded: true,
    bundleKind: "approval-prerequisite-source-bundle",
    bundleReviewOnly: true,
    bundleAuthoritative: false,
    missingBundlePartsRejected: true,
    missingRequiredBundlePartsRejected: true,
    malformedBundlePartsRejected: true,
    duplicateBundlePartsHandledDeterministically: true,
    conflictingBundlePartsRejected: true,
    staleSourcesRejected: true,
    revokedSourcesRejected: true,
    unknownSourcesRejected: true,
    malformedSourcesRejected: true,
    emptySourcesRejected: true,
    validBundleFeedsReviewReaderOnly: true,
    approvalGrantProduced: false,
    approvalGrantPersisted: false,
    runtimeEnabled: false,
    runtimeCommandEnabled: false,
    runtimeCommandExposureEnabled: false,
    runtimeExecutionEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    canEnableRuntime: false
  });
  assert.equal(inventory.bundlePartShape.partKind, "selected-prerequisite-source");
  assert.equal(inventory.bundlePartShape.partMode, "in-memory");
  assert.equal(inventory.bundlePartShape.deterministicTieBreak, "lowest-part-id");
  assert.equal(inventory.bundlePartShape.conflictPolicy, "fail-closed");
  assert.equal(inventory.bundlePartShape.filesystemWatcherAllowed, false);
  assert.equal(inventory.bundlePartShape.externalSourceLookupAllowed, false);
  assert.equal(inventory.bundlePartShape.secretsEnvIngestionAllowed, false);
  assert.equal(
    inventory.bundleResultShape.schema,
    "ardyn.phase-5.22.approval-prerequisite-source-bundle-result"
  );
  assert.equal(inventory.bundleResultShape.bundledReaderInputOnly, true);
  assert.equal(inventory.bundleResultShape.approvalGrantProduced, false);
  assert.deepEqual(inventory.sourceBundleCases.map(({ caseId }) => caseId), [
    "missing-bundle-parts",
    "missing-required-bundle-part",
    "malformed-bundle-part",
    "single-valid-bundle",
    "duplicate-equivalent-bundle-parts",
    "conflicting-bundle-parts-rejected",
    "stale-source-bundle-rejected",
    "revoked-source-bundle-rejected",
    "unknown-source-bundle-rejected",
    "malformed-source-bundle-rejected",
    "empty-source-bundle-rejected"
  ]);
  for (const bundleCase of inventory.sourceBundleCases) {
    assert.equal(bundleCase.reviewOnly, true);
    assert.equal(bundleCase.authoritative, false);
    assert.equal(bundleCase.approvalGrant.produced, false);
    assert.equal(bundleCase.approvalGrant.persisted, false);
    assert.equal(bundleCase.approvalGrant.grantId, null);
    assertAllFalse(bundleCase.runtimeEffect);
  }
  assert.equal(inventory.readerIntegration.validBundleMayFeedReviewReader, true);
  assert.equal(inventory.readerIntegration.rejectedBundleDoesNotFeedReader, true);
  assert.equal(inventory.readerIntegration.readerStillReviewOnly, true);
  assert.equal(inventory.readerIntegration.evaluatorStillReviewOnly, true);
  assert.equal(inventory.readerIntegration.readerCanProduceGrant, false);
  assert.equal(inventory.readerIntegration.evaluatorCanProduceGrant, false);
  assertAllFalse(inventory.blockedRuntimeEffect);
  assert.equal(inventory.serveRuntimeBlockedBehavior.recognizedByCli, true);
  assert.equal(inventory.serveRuntimeBlockedBehavior.stdout, "");
  assert.equal(inventory.serveRuntimeBlockedBehavior.runtimeExecution, false);
  assert.equal(inventory.serveRuntimeBlockedBehavior.writesFiles, false);
  assert.ok(
    inventory.forbiddenBehavior.includes("No CLI source-bundle command is exposed.")
  );
  assert.ok(
    inventory.forbiddenBehavior.includes(
      "No approval grant is produced or persisted."
    )
  );
  assert.ok(
    inventory.validationCommands.includes(
      "node --test tests/phase5-22-approval-prerequisite-source-bundle.test.mjs"
    )
  );
  assert.deepEqual(inventory.safetyPosture, {
    approvalPrerequisiteSourceBundleRecorded: true,
    bundleReviewOnly: true,
    bundleAuthoritative: false,
    missingBundlePartsRejected: true,
    missingRequiredBundlePartsRejected: true,
    malformedBundlePartsRejected: true,
    duplicateBundlePartsHandledDeterministically: true,
    conflictingBundlePartsRejected: true,
    staleSourcesRejected: true,
    revokedSourcesRejected: true,
    unknownSourcesRejected: true,
    malformedSourcesRejected: true,
    emptySourcesRejected: true,
    validBundleFeedsReviewReaderOnly: true,
    approvalGrantProduced: false,
    approvalGrantPersisted: false,
    runtimeBlocked: true,
    runtimeEnabled: false,
    runtimeStarted: false,
    runtimeReady: false,
    runtimeCommandEnabled: false,
    runtimeCommandExposureEnabled: false,
    runtimeExecutionEnabled: false,
    runtimeExecuted: false,
    filesystemWatcherEnabled: false,
    externalSourceLookupEnabled: false,
    secretsEnvIngestionEnabled: false,
    liveStdinLoopEnabled: false,
    runtimeStdoutWriterEnabled: false,
    runtimeStderrWriterEnabled: false,
    processSpawnEnabled: false,
    processTerminationEnabled: false,
    runtimeSupervisionEnabled: false,
    runtimeTranscriptWritePerformed: false,
    runtimeAuditWritePerformed: false,
    adapterRuntimeBehaviorEnabled: false,
    contentFabricRuntimeBehaviorEnabled: false,
    webSocketHttpSurfaceEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    canEnableRuntime: false,
    noCliSourceChange: true,
    noRustSourceChange: true
  });
  assert.equal(report.safetyPosture.phase522ApprovalPrerequisiteSourceBundle, true);
  for (const flagName of phase522ExpectedTrueSafetyFlagNames) {
    assert.equal(report.safetyPosture.flags[flagName], true);
  }
  for (const flagName of phase522ExpectedFalseSafetyFlagNames) {
    assert.equal(report.safetyPosture.flags[flagName], false);
  }
});

test("report inventories Phase 5.23 as prerequisite bundle consumption checkpoint with runtime blocked", async () => {
  const report = await runReport();
  const inventory = report.phase523PrerequisiteBundleConsumptionCheckpointInventory;

  assert.deepEqual(inventory.statusLayer, {
    document: "docs/phase-5-23-prerequisite-bundle-consumption-checkpoint.md",
    fixture:
      "tests/fixtures/host-policy/phase5-23/prerequisite-bundle-consumption-checkpoint.json",
    sourceApprovalPrerequisiteBundleDocument:
      "docs/phase-5-22-approval-prerequisite-source-bundle.md",
    sourceApprovalPrerequisiteBundleFixture:
      "tests/fixtures/host-policy/phase5-22/approval-prerequisite-source-bundle-contract.json",
    precedingPhase: "5.22",
    layerId: "prerequisite-bundle-consumption-checkpoint",
    scope:
      "phase-5-prerequisite-bundle-consumption-checkpoint-review-only-runtime-disabled",
    consumptionCheckpointRecorded: true,
    checkpointKind: "approval-prerequisite-bundle-consumption-checkpoint",
    checkpointReviewOnly: true,
    checkpointAuthoritative: false,
    missingBundleRejected: true,
    malformedBundleRejected: true,
    conflictingBundleRejected: true,
    validBundleSummarizedForReviewOnlyEvaluation: true,
    bundleConsumptionReturnsCheckpointStateOnly: true,
    approvalGrantProduced: false,
    approvalGrantPersisted: false,
    runtimeEnabled: false,
    runtimeStarted: false,
    runtimeReady: false,
    runtimeCommandEnabled: false,
    runtimeCommandExposureEnabled: false,
    runtimeExecutionEnabled: false,
    runtimeExecuted: false,
    filesystemWatcherEnabled: false,
    externalSourceLookupEnabled: false,
    secretsEnvIngestionEnabled: false,
    liveStdinLoopEnabled: false,
    runtimeStdoutWriterEnabled: false,
    runtimeStderrWriterEnabled: false,
    processSpawnEnabled: false,
    processTerminationEnabled: false,
    runtimeSupervisionEnabled: false,
    runtimeTranscriptWritePerformed: false,
    runtimeAuditWritePerformed: false,
    adapterRuntimeBehaviorChanged: false,
    contentFabricRuntimeBehaviorChanged: false,
    webSocketHttpSurfaceEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    canEnableRuntime: false,
    cliSourceChanged: false,
    rustSourceChanged: false,
    reportRunsChecks: false
  });

  assert.deepEqual(
    inventory.docs.map(({ path, status }) => [path, status]),
    phase523DocFiles.map((path) => [path, "present"])
  );
  assert.deepEqual(inventory.crossLinks, phase523CrossLinks);
  assertKnownInventoryStatuses(inventory.machineReadableArtifacts);
  assert.deepEqual(inventory.machineReadableArtifacts.map(({ path }) => path), [
    "tests/fixtures/host-policy/phase5-23/prerequisite-bundle-consumption-checkpoint.json"
  ]);
  assertKnownInventoryStatuses(inventory.tests);
  assert.deepEqual(inventory.tests.map(({ path }) => path), [
    "tests/report-phase-status.test.mjs",
    "tests/phase5-23-prerequisite-bundle-consumption-checkpoint.test.mjs"
  ]);
  assert.deepEqual(inventory.sourcePhase, {
    phase: "phase-5.22-approval-prerequisite-source-bundle",
    bundlePath:
      "packages/core/src/index.mjs#bundleApprovalPrerequisiteSourcesForReview",
    checkpointPath:
      "packages/core/src/index.mjs#consumeApprovalPrerequisiteBundleForReview",
    readerPath: "packages/core/src/index.mjs#readApprovalPrerequisiteRecordsForReview",
    evaluatorPath: "packages/core/src/index.mjs#evaluateRuntimeApprovalPrerequisitesForReview",
    runtimeEnabled: false,
    approvalGrantProduced: false
  });
  assert.deepEqual(inventory.checkpointSummary, {
    consumptionCheckpointRecorded: true,
    checkpointKind: "approval-prerequisite-bundle-consumption-checkpoint",
    checkpointReviewOnly: true,
    checkpointAuthoritative: false,
    missingBundleRejected: true,
    malformedBundleRejected: true,
    conflictingBundleRejected: true,
    validBundleSummarizedForReviewOnlyEvaluation: true,
    bundleConsumptionReturnsCheckpointStateOnly: true,
    approvalGrantProduced: false,
    approvalGrantPersisted: false,
    runtimeEnabled: false,
    runtimeCommandEnabled: false,
    runtimeCommandExposureEnabled: false,
    runtimeExecutionEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    canEnableRuntime: false
  });
  assert.equal(
    inventory.consumptionInputShape.sourceBundleSchema,
    "ardyn.phase-5.22.approval-prerequisite-source-bundle-result"
  );
  assert.equal(inventory.consumptionInputShape.bundleModeRequired, "review-only");
  assert.equal(inventory.consumptionInputShape.conflictingBundlePolicy, "fail-closed");
  assert.equal(inventory.consumptionInputShape.filesystemWatcherAllowed, false);
  assert.equal(inventory.consumptionInputShape.externalSourceLookupAllowed, false);
  assert.equal(inventory.consumptionInputShape.secretsEnvIngestionAllowed, false);
  assert.equal(
    inventory.consumptionResultShape.schema,
    "ardyn.phase-5.23.approval-prerequisite-bundle-consumption-checkpoint-result"
  );
  assert.equal(inventory.consumptionResultShape.checkpointStateOnly, true);
  assert.equal(inventory.consumptionResultShape.approvalGrantProduced, false);
  assert.deepEqual(inventory.bundleConsumptionCases.map(({ caseId }) => caseId), [
    "missing-bundle-rejected",
    "malformed-bundle-rejected",
    "conflicting-bundle-rejected",
    "valid-bundle-review-only-summary"
  ]);
  for (const bundleCase of inventory.bundleConsumptionCases) {
    assert.equal(bundleCase.reviewOnly, true);
    assert.equal(bundleCase.authoritative, false);
    assert.equal(bundleCase.approvalGrant.produced, false);
    assert.equal(bundleCase.approvalGrant.persisted, false);
    assert.equal(bundleCase.approvalGrant.grantId, null);
    assertAllFalse(bundleCase.runtimeEffect);
  }
  assert.equal(
    inventory.reviewEvaluatorIntegration.validBundleMayFeedReviewEvaluator,
    true
  );
  assert.equal(
    inventory.reviewEvaluatorIntegration.rejectedBundleDoesNotFeedEvaluator,
    true
  );
  assert.equal(inventory.reviewEvaluatorIntegration.evaluatorStillReviewOnly, true);
  assert.equal(inventory.reviewEvaluatorIntegration.evaluatorCanProduceGrant, false);
  assertAllFalse(inventory.blockedRuntimeEffect);
  assert.equal(inventory.serveRuntimeBlockedBehavior.recognizedByCli, true);
  assert.equal(inventory.serveRuntimeBlockedBehavior.stdout, "");
  assert.equal(inventory.serveRuntimeBlockedBehavior.runtimeExecution, false);
  assert.equal(inventory.serveRuntimeBlockedBehavior.writesFiles, false);
  assert.ok(
    inventory.forbiddenBehavior.includes(
      "No CLI bundle-consumption command is exposed."
    )
  );
  assert.ok(
    inventory.forbiddenBehavior.includes(
      "No approval grant is produced or persisted."
    )
  );
  assert.ok(
    inventory.validationCommands.includes(
      "node --test tests/phase5-23-prerequisite-bundle-consumption-checkpoint.test.mjs"
    )
  );
  assert.deepEqual(inventory.safetyPosture, {
    consumptionCheckpointRecorded: true,
    checkpointReviewOnly: true,
    checkpointAuthoritative: false,
    missingBundleRejected: true,
    malformedBundleRejected: true,
    conflictingBundleRejected: true,
    validBundleSummarizedForReviewOnlyEvaluation: true,
    bundleConsumptionReturnsCheckpointStateOnly: true,
    approvalGrantProduced: false,
    approvalGrantPersisted: false,
    runtimeBlocked: true,
    runtimeEnabled: false,
    runtimeStarted: false,
    runtimeReady: false,
    runtimeCommandEnabled: false,
    runtimeCommandExposureEnabled: false,
    runtimeExecutionEnabled: false,
    runtimeExecuted: false,
    filesystemWatcherEnabled: false,
    externalSourceLookupEnabled: false,
    secretsEnvIngestionEnabled: false,
    liveStdinLoopEnabled: false,
    runtimeStdoutWriterEnabled: false,
    runtimeStderrWriterEnabled: false,
    processSpawnEnabled: false,
    processTerminationEnabled: false,
    runtimeSupervisionEnabled: false,
    runtimeTranscriptWritePerformed: false,
    runtimeAuditWritePerformed: false,
    adapterRuntimeBehaviorEnabled: false,
    contentFabricRuntimeBehaviorEnabled: false,
    webSocketHttpSurfaceEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    canEnableRuntime: false,
    noCliSourceChange: true,
    noRustSourceChange: true
  });
  assert.equal(
    report.safetyPosture.phase523PrerequisiteBundleConsumptionCheckpoint,
    true
  );
  for (const flagName of phase523ExpectedTrueSafetyFlagNames) {
    assert.equal(report.safetyPosture.flags[flagName], true);
  }
  for (const flagName of phase523ExpectedFalseSafetyFlagNames) {
    assert.equal(report.safetyPosture.flags[flagName], false);
  }
});

test("report inventories Phase 5.24 as prerequisite evaluation integration checkpoint with runtime blocked", async () => {
  const report = await runReport();
  const inventory =
    report.phase524PrerequisiteEvaluationIntegrationCheckpointInventory;

  assert.deepEqual(inventory.statusLayer, {
    document: "docs/phase-5-24-prerequisite-evaluation-integration-checkpoint.md",
    fixture:
      "tests/fixtures/host-policy/phase5-24/prerequisite-evaluation-integration-checkpoint.json",
    sourcePrerequisiteBundleConsumptionDocument:
      "docs/phase-5-23-prerequisite-bundle-consumption-checkpoint.md",
    sourcePrerequisiteBundleConsumptionFixture:
      "tests/fixtures/host-policy/phase5-23/prerequisite-bundle-consumption-checkpoint.json",
    precedingPhase: "5.23",
    layerId: "prerequisite-evaluation-integration-checkpoint",
    scope:
      "phase-5-prerequisite-evaluation-integration-checkpoint-review-only-runtime-disabled",
    integrationCheckpointRecorded: true,
    checkpointKind: "approval-prerequisite-evaluation-integration-checkpoint",
    checkpointReviewOnly: true,
    checkpointAuthoritative: false,
    sourceIngestionConnected: true,
    sourceSelectionConnected: true,
    sourceBundlingConnected: true,
    bundleConsumptionConnected: true,
    reviewOnlyEvaluatorSummaryConnected: true,
    missingPrerequisiteInputsRejected: true,
    malformedPrerequisiteInputsRejected: true,
    emptyPrerequisiteInputsRejected: true,
    conflictingPrerequisiteInputsRejected: true,
    stalePrerequisiteInputsRejected: true,
    revokedPrerequisiteInputsRejected: true,
    unknownPrerequisiteInputsRejected: true,
    duplicatePrerequisiteInputsRejected: true,
    validPrerequisiteInputsProduceReviewSummary: true,
    reviewSummaryIsApprovalGrant: false,
    approvalGrantProduced: false,
    approvalGrantPersisted: false,
    runtimeEnabled: false,
    runtimeStarted: false,
    runtimeReady: false,
    runtimeCommandEnabled: false,
    runtimeCommandExposureEnabled: false,
    runtimeExecutionEnabled: false,
    runtimeExecuted: false,
    filesystemWatcherEnabled: false,
    externalSourceLookupEnabled: false,
    secretsEnvIngestionEnabled: false,
    liveStdinLoopEnabled: false,
    runtimeStdoutWriterEnabled: false,
    runtimeStderrWriterEnabled: false,
    processSpawnEnabled: false,
    processTerminationEnabled: false,
    runtimeSupervisionEnabled: false,
    runtimeTranscriptWritePerformed: false,
    runtimeAuditWritePerformed: false,
    adapterRuntimeBehaviorChanged: false,
    contentFabricRuntimeBehaviorChanged: false,
    webSocketHttpSurfaceEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    canEnableRuntime: false,
    cliSourceChanged: false,
    rustSourceChanged: false,
    reportRunsChecks: false
  });

  assert.deepEqual(
    inventory.docs.map(({ path, status }) => [path, status]),
    phase524DocFiles.map((path) => [path, "present"])
  );
  assert.deepEqual(inventory.crossLinks, phase524CrossLinks);
  assertKnownInventoryStatuses(inventory.machineReadableArtifacts);
  assert.deepEqual(inventory.machineReadableArtifacts.map(({ path }) => path), [
    "tests/fixtures/host-policy/phase5-24/prerequisite-evaluation-integration-checkpoint.json"
  ]);
  assertKnownInventoryStatuses(inventory.tests);
  assert.deepEqual(inventory.tests.map(({ path }) => path), [
    "tests/report-phase-status.test.mjs",
    "tests/phase5-24-prerequisite-evaluation-integration-checkpoint.test.mjs"
  ]);
  assert.deepEqual(inventory.sourcePhase, {
    phase: "phase-5.23-prerequisite-bundle-consumption-checkpoint",
    sourceIngestionPath:
      "packages/core/src/index.mjs#preflightApprovalPrerequisiteSourcesForReview",
    sourceSelectionPath:
      "packages/core/src/index.mjs#selectApprovalPrerequisiteSourcesForReview",
    sourceBundlePath:
      "packages/core/src/index.mjs#bundleApprovalPrerequisiteSourcesForReview",
    bundleConsumptionPath:
      "packages/core/src/index.mjs#consumeApprovalPrerequisiteBundleForReview",
    integrationCheckpointPath:
      "packages/core/src/index.mjs#evaluatePrerequisiteIntegrationCheckpointForReview",
    reviewOnlyEvaluatorPath:
      "packages/core/src/index.mjs#evaluateRuntimeApprovalPrerequisitesForReview",
    runtimeEnabled: false,
    approvalGrantProduced: false
  });
  assert.deepEqual(inventory.integrationSummary, {
    integrationCheckpointRecorded: true,
    checkpointKind: "approval-prerequisite-evaluation-integration-checkpoint",
    checkpointReviewOnly: true,
    checkpointAuthoritative: false,
    sourceIngestionConnected: true,
    sourceSelectionConnected: true,
    sourceBundlingConnected: true,
    bundleConsumptionConnected: true,
    reviewOnlyEvaluatorSummaryConnected: true,
    missingPrerequisiteInputsRejected: true,
    malformedPrerequisiteInputsRejected: true,
    emptyPrerequisiteInputsRejected: true,
    conflictingPrerequisiteInputsRejected: true,
    stalePrerequisiteInputsRejected: true,
    revokedPrerequisiteInputsRejected: true,
    unknownPrerequisiteInputsRejected: true,
    duplicatePrerequisiteInputsRejected: true,
    validPrerequisiteInputsProduceReviewSummary: true,
    reviewSummaryIsApprovalGrant: false,
    approvalGrantProduced: false,
    approvalGrantPersisted: false,
    runtimeEnabled: false,
    runtimeCommandEnabled: false,
    runtimeCommandExposureEnabled: false,
    runtimeExecutionEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    canEnableRuntime: false
  });
  assert.equal(inventory.integrationInputShape.sourceInputsRequired, true);
  assert.equal(inventory.integrationInputShape.sourceKind, "inline-prerequisite-records");
  assert.equal(inventory.integrationInputShape.sourceMode, "in-memory");
  assert.equal(inventory.integrationInputShape.conflictingInputPolicy, "fail-closed");
  assert.equal(inventory.integrationInputShape.filesystemWatcherAllowed, false);
  assert.equal(inventory.integrationInputShape.externalSourceLookupAllowed, false);
  assert.equal(inventory.integrationInputShape.secretsEnvIngestionAllowed, false);
  assert.equal(
    inventory.integrationResultShape.schema,
    "ardyn.phase-5.24.approval-prerequisite-integration-checkpoint-result"
  );
  assert.equal(inventory.integrationResultShape.reviewSummaryIsApprovalGrant, false);
  assert.equal(inventory.integrationResultShape.approvalGrantProduced, false);
  assert.deepEqual(
    inventory.integrationCheckpointCases.map(({ caseId }) => caseId),
    [
      "missing-prerequisite-input-rejected",
      "malformed-prerequisite-input-rejected",
      "empty-prerequisite-input-rejected",
      "conflicting-prerequisite-input-rejected",
      "stale-prerequisite-input-rejected",
      "revoked-prerequisite-input-rejected",
      "unknown-prerequisite-input-rejected",
      "duplicate-prerequisite-input-rejected",
      "valid-prerequisite-review-summary"
    ]
  );
  for (const checkpointCase of inventory.integrationCheckpointCases) {
    assert.equal(checkpointCase.reviewOnly, true);
    assert.equal(checkpointCase.authoritative, false);
    assert.equal(checkpointCase.reviewSummaryIsApprovalGrant, false);
    assert.equal(checkpointCase.approvalGrant.produced, false);
    assert.equal(checkpointCase.approvalGrant.persisted, false);
    assert.equal(checkpointCase.approvalGrant.grantId, null);
    assertAllFalse(checkpointCase.runtimeEffect);
  }
  assert.equal(inventory.pipelineStageIntegration.sourceIngestionFeedsSelection, true);
  assert.equal(inventory.pipelineStageIntegration.sourceSelectionFeedsBundling, true);
  assert.equal(inventory.pipelineStageIntegration.sourceBundlingFeedsConsumption, true);
  assert.equal(
    inventory.pipelineStageIntegration.bundleConsumptionFeedsReviewOnlyEvaluatorSummary,
    true
  );
  assert.equal(inventory.pipelineStageIntegration.reviewSummaryCanProduceGrant, false);
  assert.equal(inventory.pipelineStageIntegration.reviewSummaryCanEnableRuntime, false);
  assertAllFalse(inventory.blockedRuntimeEffect);
  assert.equal(inventory.serveRuntimeBlockedBehavior.recognizedByCli, true);
  assert.equal(inventory.serveRuntimeBlockedBehavior.stdout, "");
  assert.equal(inventory.serveRuntimeBlockedBehavior.runtimeExecution, false);
  assert.equal(inventory.serveRuntimeBlockedBehavior.writesFiles, false);
  assert.ok(
    inventory.forbiddenBehavior.includes(
      "No CLI integration-checkpoint command is exposed."
    )
  );
  assert.ok(
    inventory.forbiddenBehavior.includes(
      "No approval grant is produced or persisted."
    )
  );
  assert.ok(
    inventory.validationCommands.includes(
      "node --test tests/phase5-24-prerequisite-evaluation-integration-checkpoint.test.mjs"
    )
  );
  assert.deepEqual(inventory.safetyPosture, {
    integrationCheckpointRecorded: true,
    checkpointReviewOnly: true,
    checkpointAuthoritative: false,
    sourceIngestionConnected: true,
    sourceSelectionConnected: true,
    sourceBundlingConnected: true,
    bundleConsumptionConnected: true,
    reviewOnlyEvaluatorSummaryConnected: true,
    missingPrerequisiteInputsRejected: true,
    malformedPrerequisiteInputsRejected: true,
    emptyPrerequisiteInputsRejected: true,
    conflictingPrerequisiteInputsRejected: true,
    stalePrerequisiteInputsRejected: true,
    revokedPrerequisiteInputsRejected: true,
    unknownPrerequisiteInputsRejected: true,
    duplicatePrerequisiteInputsRejected: true,
    validPrerequisiteInputsProduceReviewSummary: true,
    reviewSummaryIsApprovalGrant: false,
    approvalGrantProduced: false,
    approvalGrantPersisted: false,
    runtimeBlocked: true,
    runtimeEnabled: false,
    runtimeStarted: false,
    runtimeReady: false,
    runtimeCommandEnabled: false,
    runtimeCommandExposureEnabled: false,
    runtimeExecutionEnabled: false,
    runtimeExecuted: false,
    filesystemWatcherEnabled: false,
    externalSourceLookupEnabled: false,
    secretsEnvIngestionEnabled: false,
    liveStdinLoopEnabled: false,
    runtimeStdoutWriterEnabled: false,
    runtimeStderrWriterEnabled: false,
    processSpawnEnabled: false,
    processTerminationEnabled: false,
    runtimeSupervisionEnabled: false,
    runtimeTranscriptWritePerformed: false,
    runtimeAuditWritePerformed: false,
    adapterRuntimeBehaviorEnabled: false,
    contentFabricRuntimeBehaviorEnabled: false,
    webSocketHttpSurfaceEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    canEnableRuntime: false,
    noCliSourceChange: true,
    noRustSourceChange: true
  });
  assert.equal(
    report.safetyPosture.phase524PrerequisiteEvaluationIntegrationCheckpoint,
    true
  );
  for (const flagName of phase524ExpectedTrueSafetyFlagNames) {
    assert.equal(report.safetyPosture.flags[flagName], true);
  }
  for (const flagName of phase524ExpectedFalseSafetyFlagNames) {
    assert.equal(report.safetyPosture.flags[flagName], false);
  }
});

test("report inventories Phase 5.25 as non-authorizing review artifact boundary with runtime blocked", async () => {
  const report = await runReport();
  const inventory = report.phase525NonAuthorizingReviewArtifactBoundaryInventory;

  assert.deepEqual(inventory.statusLayer, {
    document: "docs/phase-5-25-non-authorizing-review-artifact-boundary.md",
    fixture:
      "tests/fixtures/host-policy/phase5-25/non-authorizing-review-artifact-boundary.json",
    sourcePrerequisiteEvaluationIntegrationDocument:
      "docs/phase-5-24-prerequisite-evaluation-integration-checkpoint.md",
    sourcePrerequisiteEvaluationIntegrationFixture:
      "tests/fixtures/host-policy/phase5-24/prerequisite-evaluation-integration-checkpoint.json",
    precedingPhase: "5.24",
    layerId: "non-authorizing-review-artifact-boundary",
    scope:
      "phase-5-non-authorizing-review-artifact-boundary-review-only-runtime-disabled",
    artifactBoundaryRecorded: true,
    boundaryKind: "non-authorizing-prerequisite-review-artifact-boundary",
    boundaryReviewOnly: true,
    boundaryAuthoritative: false,
    integratedReviewSummaryAccepted: true,
    missingPrerequisiteInputsRejected: true,
    malformedPrerequisiteInputsRejected: true,
    emptyPrerequisiteInputsRejected: true,
    conflictingPrerequisiteInputsRejected: true,
    stalePrerequisiteInputsRejected: true,
    revokedPrerequisiteInputsRejected: true,
    unknownPrerequisiteInputsRejected: true,
    duplicateInvalidPrerequisiteInputsRejected: true,
    validIntegratedSummariesProduceReviewArtifact: true,
    reviewArtifactIsApprovalGrant: false,
    approvalGrantProduced: false,
    approvalGrantPersisted: false,
    runtimePermissionGranted: false,
    commandExposurePermissionGranted: false,
    runtimeEnabled: false,
    runtimeStarted: false,
    runtimeReady: false,
    runtimeCommandEnabled: false,
    runtimeCommandExposureEnabled: false,
    runtimeExecutionEnabled: false,
    runtimeExecuted: false,
    filesystemWatcherEnabled: false,
    externalSourceLookupEnabled: false,
    secretsEnvIngestionEnabled: false,
    liveStdinLoopEnabled: false,
    runtimeStdoutWriterEnabled: false,
    runtimeStderrWriterEnabled: false,
    processSpawnEnabled: false,
    processTerminationEnabled: false,
    runtimeSupervisionEnabled: false,
    runtimeTranscriptWritePerformed: false,
    runtimeAuditWritePerformed: false,
    adapterRuntimeBehaviorChanged: false,
    contentFabricRuntimeBehaviorChanged: false,
    webSocketHttpSurfaceEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    canEnableRuntime: false,
    cliSourceChanged: false,
    rustSourceChanged: false,
    reportRunsChecks: false
  });

  assert.deepEqual(
    inventory.docs.map(({ path, status }) => [path, status]),
    phase525DocFiles.map((path) => [path, "present"])
  );
  assert.deepEqual(inventory.crossLinks, phase525CrossLinks);
  assertKnownInventoryStatuses(inventory.machineReadableArtifacts);
  assert.deepEqual(inventory.machineReadableArtifacts.map(({ path }) => path), [
    "tests/fixtures/host-policy/phase5-25/non-authorizing-review-artifact-boundary.json"
  ]);
  assertKnownInventoryStatuses(inventory.tests);
  assert.deepEqual(inventory.tests.map(({ path }) => path), [
    "tests/report-phase-status.test.mjs",
    "tests/phase5-25-non-authorizing-review-artifact-boundary.test.mjs"
  ]);
  assert.deepEqual(inventory.sourcePhase, {
    phase: "phase-5.24-prerequisite-evaluation-integration-checkpoint",
    reviewArtifactBoundaryPath:
      "packages/core/src/index.mjs#createPrerequisiteReviewArtifactBoundaryForReview",
    sourceIntegrationCheckpointPath:
      "packages/core/src/index.mjs#evaluatePrerequisiteIntegrationCheckpointForReview",
    sourceIntegrationFixture:
      "tests/fixtures/host-policy/phase5-24/prerequisite-evaluation-integration-checkpoint.json",
    runtimeEnabled: false,
    approvalGrantProduced: false
  });
  assert.deepEqual(inventory.artifactBoundarySummary, {
    artifactBoundaryRecorded: true,
    boundaryKind: "non-authorizing-prerequisite-review-artifact-boundary",
    boundaryReviewOnly: true,
    boundaryAuthoritative: false,
    integratedReviewSummaryAccepted: true,
    missingPrerequisiteInputsRejected: true,
    malformedPrerequisiteInputsRejected: true,
    emptyPrerequisiteInputsRejected: true,
    conflictingPrerequisiteInputsRejected: true,
    stalePrerequisiteInputsRejected: true,
    revokedPrerequisiteInputsRejected: true,
    unknownPrerequisiteInputsRejected: true,
    duplicateInvalidPrerequisiteInputsRejected: true,
    validIntegratedSummariesProduceReviewArtifact: true,
    reviewArtifactIsApprovalGrant: false,
    approvalGrantProduced: false,
    approvalGrantPersisted: false,
    runtimePermissionGranted: false,
    commandExposurePermissionGranted: false,
    runtimeEnabled: false,
    runtimeCommandEnabled: false,
    runtimeCommandExposureEnabled: false,
    runtimeExecutionEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    canEnableRuntime: false
  });
  assert.equal(inventory.artifactInputShape.sourceInputsRequired, true);
  assert.equal(inventory.artifactInputShape.sourceIntegrationCheckpointRequired, true);
  assert.equal(inventory.artifactInputShape.validIntegratedSummaryRequired, true);
  assert.equal(inventory.artifactInputShape.conflictingInputPolicy, "fail-closed");
  assert.equal(inventory.artifactInputShape.duplicateInvalidInputPolicy, "fail-closed");
  assert.equal(inventory.artifactInputShape.filesystemWatcherAllowed, false);
  assert.equal(inventory.artifactInputShape.externalSourceLookupAllowed, false);
  assert.equal(inventory.artifactInputShape.secretsEnvIngestionAllowed, false);
  assert.equal(
    inventory.artifactResultShape.schema,
    "ardyn.phase-5.25.prerequisite-review-artifact-boundary-result"
  );
  assert.equal(
    inventory.artifactResultShape.reviewArtifactSchema,
    "ardyn.phase-5.25.non-authorizing-prerequisite-review-artifact"
  );
  assert.equal(inventory.artifactResultShape.reviewArtifactIsApprovalGrant, false);
  assert.equal(inventory.artifactResultShape.approvalGrantProduced, false);
  assert.equal(inventory.artifactResultShape.approvalGrantPersisted, false);
  assert.equal(inventory.artifactResultShape.runtimePermissionGranted, false);
  assert.equal(inventory.artifactResultShape.commandExposurePermissionGranted, false);
  assert.equal(inventory.artifactResultShape.runtimeEffectAllFalse, true);
  assert.deepEqual(
    inventory.artifactBoundaryCases.map(({ caseId }) => caseId),
    [
      "missing-prerequisite-artifact-input-rejected",
      "malformed-prerequisite-artifact-input-rejected",
      "empty-prerequisite-artifact-input-rejected",
      "conflicting-prerequisite-artifact-input-rejected",
      "stale-prerequisite-artifact-input-rejected",
      "revoked-prerequisite-artifact-input-rejected",
      "unknown-prerequisite-artifact-input-rejected",
      "duplicate-invalid-prerequisite-artifact-input-rejected",
      "valid-prerequisite-non-authorizing-review-artifact"
    ]
  );
  for (const boundaryCase of inventory.artifactBoundaryCases) {
    assert.equal(boundaryCase.reviewOnly, true);
    assert.equal(boundaryCase.authoritative, false);
    assert.equal(boundaryCase.reviewArtifactIsApprovalGrant, false);
    assert.equal(boundaryCase.approvalGrant.produced, false);
    assert.equal(boundaryCase.approvalGrant.persisted, false);
    assert.equal(boundaryCase.approvalGrant.grantId, null);
    assert.equal(boundaryCase.runtimePermissionGranted, false);
    assert.equal(boundaryCase.commandExposurePermissionGranted, false);
    assertAllFalse(boundaryCase.runtimeEffect);
  }
  assert.equal(
    inventory.reviewArtifactBoundary.reviewArtifactCanGrantApproval,
    false
  );
  assert.equal(
    inventory.reviewArtifactBoundary.reviewArtifactCanPersistGrant,
    false
  );
  assert.equal(
    inventory.reviewArtifactBoundary.reviewArtifactCanEnableRuntime,
    false
  );
  assert.equal(
    inventory.reviewArtifactBoundary.reviewArtifactCanExposeRuntimeCommand,
    false
  );
  assert.equal(
    inventory.reviewArtifactBoundary.reviewArtifactCanExecuteRuntime,
    false
  );
  assert.equal(
    inventory.reviewArtifactBoundary.reviewArtifactCanStartRuntime,
    false
  );
  assertAllFalse(inventory.blockedRuntimeEffect);
  assert.equal(inventory.serveRuntimeBlockedBehavior.recognizedByCli, true);
  assert.equal(inventory.serveRuntimeBlockedBehavior.stdout, "");
  assert.equal(inventory.serveRuntimeBlockedBehavior.runtimeExecution, false);
  assert.equal(inventory.serveRuntimeBlockedBehavior.writesFiles, false);
  assert.ok(
    inventory.forbiddenBehavior.includes(
      "No CLI review-artifact-boundary command is exposed."
    )
  );
  assert.ok(
    inventory.forbiddenBehavior.includes(
      "No review artifact can be treated as runtime permission."
    )
  );
  assert.ok(
    inventory.forbiddenBehavior.includes(
      "No approval grant is produced or persisted."
    )
  );
  assert.ok(
    inventory.validationCommands.includes(
      "node --test tests/phase5-25-non-authorizing-review-artifact-boundary.test.mjs"
    )
  );
  assert.ok(
    inventory.validationCommands.includes(
      "fallow health --score --hotspots --targets --format json"
    )
  );
  assert.deepEqual(inventory.safetyPosture, {
    artifactBoundaryRecorded: true,
    boundaryReviewOnly: true,
    boundaryAuthoritative: false,
    integratedReviewSummaryAccepted: true,
    missingPrerequisiteInputsRejected: true,
    malformedPrerequisiteInputsRejected: true,
    emptyPrerequisiteInputsRejected: true,
    conflictingPrerequisiteInputsRejected: true,
    stalePrerequisiteInputsRejected: true,
    revokedPrerequisiteInputsRejected: true,
    unknownPrerequisiteInputsRejected: true,
    duplicateInvalidPrerequisiteInputsRejected: true,
    validIntegratedSummariesProduceReviewArtifact: true,
    reviewArtifactIsApprovalGrant: false,
    approvalGrantProduced: false,
    approvalGrantPersisted: false,
    runtimePermissionGranted: false,
    commandExposurePermissionGranted: false,
    runtimeBlocked: true,
    runtimeEnabled: false,
    runtimeStarted: false,
    runtimeReady: false,
    runtimeCommandEnabled: false,
    runtimeCommandExposureEnabled: false,
    runtimeExecutionEnabled: false,
    runtimeExecuted: false,
    filesystemWatcherEnabled: false,
    externalSourceLookupEnabled: false,
    secretsEnvIngestionEnabled: false,
    liveStdinLoopEnabled: false,
    runtimeStdoutWriterEnabled: false,
    runtimeStderrWriterEnabled: false,
    processSpawnEnabled: false,
    processTerminationEnabled: false,
    runtimeSupervisionEnabled: false,
    runtimeTranscriptWritePerformed: false,
    runtimeAuditWritePerformed: false,
    adapterRuntimeBehaviorEnabled: false,
    contentFabricRuntimeBehaviorEnabled: false,
    webSocketHttpSurfaceEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    canEnableRuntime: false,
    noCliSourceChange: true,
    noRustSourceChange: true
  });
  assert.equal(report.safetyPosture.phase525NonAuthorizingReviewArtifactBoundary, true);
  assertSafetyFlags(report, phase525ExpectedTrueSafetyFlagNames, true);
  assertSafetyFlags(report, phase525ExpectedFalseSafetyFlagNames, false);
});

test("report inventories Phase 5.26 as review artifact evaluator-input handoff with runtime blocked", async () => {
  const report = await runReport();
  const inventory = report.phase526ReviewArtifactEvaluatorInputHandoffInventory;

  assert.deepEqual(inventory.statusLayer, {
    document: "docs/phase-5-26-review-artifact-evaluator-input-handoff.md",
    fixture:
      "tests/fixtures/host-policy/phase5-26/review-artifact-evaluator-input-handoff.json",
    sourceReviewArtifactBoundaryDocument:
      "docs/phase-5-25-non-authorizing-review-artifact-boundary.md",
    sourceReviewArtifactBoundaryFixture:
      "tests/fixtures/host-policy/phase5-25/non-authorizing-review-artifact-boundary.json",
    precedingPhase: "5.25",
    layerId: "review-artifact-evaluator-input-handoff",
    scope:
      "phase-5-review-artifact-evaluator-input-handoff-review-only-runtime-disabled",
    handoffRecorded: true,
    handoffKind: "review-artifact-evaluator-input-handoff",
    handoffReviewOnly: true,
    handoffAuthoritative: false,
    validReviewArtifactsProduceEvaluatorInputCandidate: true,
    missingReviewArtifactsRejected: true,
    malformedReviewArtifactsRejected: true,
    emptyReviewArtifactsRejected: true,
    conflictingReviewArtifactsRejected: true,
    staleReviewArtifactsRejected: true,
    revokedReviewArtifactsRejected: true,
    unknownReviewArtifactsRejected: true,
    duplicateInvalidReviewArtifactsRejected: true,
    authorizingLookingReviewArtifactsRejected: true,
    evaluatorInputCandidateIsApprovalGrant: false,
    approvalGrantProduced: false,
    approvalGrantPersisted: false,
    runtimePermissionGranted: false,
    commandExposurePermissionGranted: false,
    runtimeEnabled: false,
    runtimeStarted: false,
    runtimeReady: false,
    runtimeCommandEnabled: false,
    runtimeCommandExposureEnabled: false,
    runtimeExecutionEnabled: false,
    runtimeExecuted: false,
    filesystemWatcherEnabled: false,
    externalSourceLookupEnabled: false,
    secretsEnvIngestionEnabled: false,
    liveStdinLoopEnabled: false,
    runtimeStdoutWriterEnabled: false,
    runtimeStderrWriterEnabled: false,
    processSpawnEnabled: false,
    processTerminationEnabled: false,
    runtimeSupervisionEnabled: false,
    runtimeTranscriptWritePerformed: false,
    runtimeAuditWritePerformed: false,
    adapterRuntimeBehaviorChanged: false,
    contentFabricRuntimeBehaviorChanged: false,
    webSocketHttpSurfaceEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    canEnableRuntime: false,
    cliSourceChanged: false,
    rustSourceChanged: false,
    reportRunsChecks: false
  });

  assert.deepEqual(
    inventory.docs.map(({ path, status }) => [path, status]),
    phase526DocFiles.map((path) => [path, "present"])
  );
  assert.deepEqual(inventory.crossLinks, phase526CrossLinks);
  assertKnownInventoryStatuses(inventory.machineReadableArtifacts);
  assert.deepEqual(inventory.machineReadableArtifacts.map(({ path }) => path), [
    "tests/fixtures/host-policy/phase5-26/review-artifact-evaluator-input-handoff.json"
  ]);
  assertKnownInventoryStatuses(inventory.tests);
  assert.deepEqual(inventory.tests.map(({ path }) => path), [
    "tests/report-phase-status.test.mjs",
    "tests/phase5-26-review-artifact-evaluator-input-handoff.test.mjs"
  ]);
  assert.deepEqual(inventory.sourcePhase, {
    phase: "phase-5.25-non-authorizing-review-artifact-boundary",
    reviewArtifactBoundaryPath:
      "packages/core/src/index.mjs#createPrerequisiteReviewArtifactBoundaryForReview",
    evaluatorInputHandoffPath:
      "packages/core/src/index.mjs#createReviewArtifactEvaluatorInputHandoffForReview",
    sourceReviewArtifactFixture:
      "tests/fixtures/host-policy/phase5-25/non-authorizing-review-artifact-boundary.json",
    runtimeEnabled: false,
    approvalGrantProduced: false
  });
  assert.deepEqual(inventory.handoffSummary, {
    handoffRecorded: true,
    handoffKind: "review-artifact-evaluator-input-handoff",
    handoffReviewOnly: true,
    handoffAuthoritative: false,
    validReviewArtifactsProduceEvaluatorInputCandidate: true,
    missingReviewArtifactsRejected: true,
    malformedReviewArtifactsRejected: true,
    emptyReviewArtifactsRejected: true,
    conflictingReviewArtifactsRejected: true,
    staleReviewArtifactsRejected: true,
    revokedReviewArtifactsRejected: true,
    unknownReviewArtifactsRejected: true,
    duplicateInvalidReviewArtifactsRejected: true,
    authorizingLookingReviewArtifactsRejected: true,
    evaluatorInputCandidateIsApprovalGrant: false,
    approvalGrantProduced: false,
    approvalGrantPersisted: false,
    runtimePermissionGranted: false,
    commandExposurePermissionGranted: false,
    runtimeEnabled: false,
    runtimeCommandEnabled: false,
    runtimeCommandExposureEnabled: false,
    runtimeExecutionEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    canEnableRuntime: false
  });
  assert.equal(inventory.handoffInputShape.reviewArtifactsRequired, true);
  assert.equal(
    inventory.handoffInputShape.reviewArtifactSchema,
    "ardyn.phase-5.25.non-authorizing-prerequisite-review-artifact"
  );
  assert.equal(inventory.handoffInputShape.validReviewArtifactRequired, true);
  assert.equal(
    inventory.handoffInputShape.authorizingLookingArtifactPolicy,
    "fail-closed"
  );
  assert.equal(inventory.handoffInputShape.conflictingInputPolicy, "fail-closed");
  assert.equal(
    inventory.handoffInputShape.duplicateInvalidInputPolicy,
    "fail-closed"
  );
  assert.equal(inventory.handoffInputShape.filesystemWatcherAllowed, false);
  assert.equal(inventory.handoffInputShape.externalSourceLookupAllowed, false);
  assert.equal(inventory.handoffInputShape.secretsEnvIngestionAllowed, false);
  assert.equal(
    inventory.handoffResultShape.schema,
    "ardyn.phase-5.26.prerequisite-review-artifact-evaluator-input-handoff-result"
  );
  assert.equal(
    inventory.handoffResultShape.evaluatorInputCandidateSchema,
    "ardyn.phase-5.26.review-artifact-evaluator-input-candidate"
  );
  assert.equal(
    inventory.handoffResultShape.evaluatorInputCandidateIsApprovalGrant,
    false
  );
  assert.equal(inventory.handoffResultShape.approvalGrantProduced, false);
  assert.equal(inventory.handoffResultShape.approvalGrantPersisted, false);
  assert.equal(inventory.handoffResultShape.runtimePermissionGranted, false);
  assert.equal(
    inventory.handoffResultShape.commandExposurePermissionGranted,
    false
  );
  assert.equal(inventory.handoffResultShape.runtimeEffectAllFalse, true);
  assert.deepEqual(
    inventory.handoffCases.map(({ caseId }) => caseId),
    [
      "missing-review-artifact-handoff-input-rejected",
      "malformed-review-artifact-handoff-input-rejected",
      "malformed-review-artifact-invalid-reviewed-at-rejected",
      "empty-review-artifact-handoff-input-rejected",
      "conflicting-review-artifact-handoff-input-rejected",
      "stale-review-artifact-handoff-input-rejected",
      "revoked-review-artifact-handoff-input-rejected",
      "unknown-review-artifact-handoff-input-rejected",
      "duplicate-invalid-review-artifact-handoff-input-rejected",
      "authorizing-looking-review-artifact-handoff-input-rejected",
      "authorizing-looking-review-artifact-extra-runtime-effect-rejected",
      "authorizing-looking-review-artifact-extra-process-flag-rejected",
      "valid-review-artifact-evaluator-input-candidate"
    ]
  );
  for (const handoffCase of inventory.handoffCases) {
    assert.equal(handoffCase.reviewOnly, true);
    assert.equal(handoffCase.authoritative, false);
    assert.equal(handoffCase.evaluatorInputCandidateIsApprovalGrant, false);
    assert.equal(handoffCase.approvalGrant.produced, false);
    assert.equal(handoffCase.approvalGrant.persisted, false);
    assert.equal(handoffCase.approvalGrant.grantId, null);
    assert.equal(handoffCase.runtimePermissionGranted, false);
    assert.equal(handoffCase.commandExposurePermissionGranted, false);
    assertAllFalse(handoffCase.runtimeEffect);
  }
  assert.equal(
    inventory.evaluatorInputCandidateBoundary.candidateCanGrantApproval,
    false
  );
  assert.equal(
    inventory.evaluatorInputCandidateBoundary.candidateCanPersistGrant,
    false
  );
  assert.equal(
    inventory.evaluatorInputCandidateBoundary.candidateCanGrantRuntimePermission,
    false
  );
  assert.equal(
    inventory.evaluatorInputCandidateBoundary
      .candidateCanGrantCommandExposurePermission,
    false
  );
  assert.equal(
    inventory.evaluatorInputCandidateBoundary.candidateCanExecuteRuntime,
    false
  );
  assert.equal(
    inventory.evaluatorInputCandidateBoundary.candidateCanStartRuntime,
    false
  );
  assertAllFalse(inventory.blockedRuntimeEffect);
  assert.deepEqual(inventory.serveRuntimeBlockedBehavior.args, ["serve-runtime"]);
  assert.deepEqual(inventory.serveRuntimeBlockedBehavior.dryRunArgs, [
    "serve-runtime",
    "--dry-run"
  ]);
  assert.equal(inventory.serveRuntimeBlockedBehavior.stdoutEmpty, true);
  assert.equal(inventory.serveRuntimeBlockedBehavior.writesFiles, false);
  assert.equal(inventory.forbiddenBehavior.approvalGrantProduced, false);
  assert.equal(inventory.forbiddenBehavior.approvalGrantPersisted, false);
  assert.equal(inventory.forbiddenBehavior.runtimePermissionGranted, false);
  assert.equal(
    inventory.forbiddenBehavior.commandExposurePermissionGranted,
    false
  );
  assert.equal(inventory.forbiddenBehavior.runtimeExecutionEnabled, false);
  assert.equal(inventory.forbiddenBehavior.cliCommandAdded, false);
  assert.equal(inventory.forbiddenBehavior.rustHostImplementationAdded, false);
  assert.ok(
    inventory.validationCommands.includes(
      "node --test tests/phase5-26-review-artifact-evaluator-input-handoff.test.mjs"
    )
  );
  assert.ok(
    inventory.validationCommands.includes(
      "fallow health --score --hotspots --targets --format json"
    )
  );
  assert.deepEqual(inventory.safetyPosture, {
    handoffRecorded: true,
    handoffReviewOnly: true,
    handoffAuthoritative: false,
    validReviewArtifactsProduceEvaluatorInputCandidate: true,
    missingReviewArtifactsRejected: true,
    malformedReviewArtifactsRejected: true,
    emptyReviewArtifactsRejected: true,
    conflictingReviewArtifactsRejected: true,
    staleReviewArtifactsRejected: true,
    revokedReviewArtifactsRejected: true,
    unknownReviewArtifactsRejected: true,
    duplicateInvalidReviewArtifactsRejected: true,
    authorizingLookingReviewArtifactsRejected: true,
    evaluatorInputCandidateIsApprovalGrant: false,
    approvalGrantProduced: false,
    approvalGrantPersisted: false,
    runtimePermissionGranted: false,
    commandExposurePermissionGranted: false,
    runtimeBlocked: true,
    runtimeEnabled: false,
    runtimeStarted: false,
    runtimeReady: false,
    runtimeCommandEnabled: false,
    runtimeCommandExposureEnabled: false,
    runtimeExecutionEnabled: false,
    runtimeExecuted: false,
    filesystemWatcherEnabled: false,
    externalSourceLookupEnabled: false,
    secretsEnvIngestionEnabled: false,
    liveStdinLoopEnabled: false,
    runtimeStdoutWriterEnabled: false,
    runtimeStderrWriterEnabled: false,
    processSpawnEnabled: false,
    processTerminationEnabled: false,
    runtimeSupervisionEnabled: false,
    runtimeTranscriptWritePerformed: false,
    runtimeAuditWritePerformed: false,
    adapterRuntimeBehaviorEnabled: false,
    contentFabricRuntimeBehaviorEnabled: false,
    webSocketHttpSurfaceEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    canEnableRuntime: false,
    noCliSourceChange: true,
    noRustSourceChange: true
  });
  assert.equal(
    report.safetyPosture.phase526ReviewArtifactEvaluatorInputHandoff,
    true
  );
  assertSafetyFlags(report, phase526ExpectedTrueSafetyFlagNames, true);
  assertSafetyFlags(report, phase526ExpectedFalseSafetyFlagNames, false);
});

test("report inventories Phase 5.27 as approval-evaluator candidate intake checkpoint with runtime blocked", async () => {
  const report = await runReport();
  const inventory =
    report.phase527ApprovalEvaluatorCandidateIntakeCheckpointInventory;

  assert.deepEqual(inventory.statusLayer, {
    document:
      "docs/phase-5-27-approval-evaluator-candidate-intake-checkpoint.md",
    fixture:
      "tests/fixtures/host-policy/phase5-27/approval-evaluator-candidate-intake-checkpoint.json",
    sourceEvaluatorInputHandoffDocument:
      "docs/phase-5-26-review-artifact-evaluator-input-handoff.md",
    sourceEvaluatorInputHandoffFixture:
      "tests/fixtures/host-policy/phase5-26/review-artifact-evaluator-input-handoff.json",
    precedingPhase: "5.26",
    layerId: "approval-evaluator-candidate-intake-checkpoint",
    scope:
      "phase-5-approval-evaluator-candidate-intake-checkpoint-review-only-runtime-disabled",
    intakeCheckpointRecorded: true,
    checkpointKind: "approval-evaluator-candidate-intake-checkpoint",
    checkpointReviewOnly: true,
    checkpointAuthoritative: false,
    validEvaluatorInputCandidatesProduceIntakeCheckpointState: true,
    missingEvaluatorInputCandidatesRejected: true,
    malformedEvaluatorInputCandidatesRejected: true,
    emptyEvaluatorInputCandidatesRejected: true,
    conflictingEvaluatorInputCandidatesRejected: true,
    staleEvaluatorInputCandidatesRejected: true,
    revokedEvaluatorInputCandidatesRejected: true,
    unknownEvaluatorInputCandidatesRejected: true,
    duplicateInvalidEvaluatorInputCandidatesRejected: true,
    authorizingLookingEvaluatorInputCandidatesRejected: true,
    runtimeEffectTrueEvaluatorInputCandidatesRejected: true,
    processFlagTrueEvaluatorInputCandidatesRejected: true,
    unsafeEvaluatorInputCandidatesRejected: true,
    intakeCheckpointStateIsApprovalGrant: false,
    approvalGrantProduced: false,
    approvalGrantPersisted: false,
    runtimePermissionGranted: false,
    commandExposurePermissionGranted: false,
    runtimeEnabled: false,
    runtimeStarted: false,
    runtimeReady: false,
    runtimeCommandEnabled: false,
    runtimeCommandExposureEnabled: false,
    runtimeExecutionEnabled: false,
    runtimeExecuted: false,
    filesystemWatcherEnabled: false,
    externalSourceLookupEnabled: false,
    secretsEnvIngestionEnabled: false,
    liveStdinLoopEnabled: false,
    runtimeStdoutWriterEnabled: false,
    runtimeStderrWriterEnabled: false,
    processSpawnEnabled: false,
    processTerminationEnabled: false,
    runtimeSupervisionEnabled: false,
    runtimeTranscriptWritePerformed: false,
    runtimeAuditWritePerformed: false,
    adapterRuntimeBehaviorChanged: false,
    contentFabricRuntimeBehaviorChanged: false,
    webSocketHttpSurfaceEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    canEnableRuntime: false,
    cliSourceChanged: false,
    rustSourceChanged: false,
    reportRunsChecks: false
  });

  assert.deepEqual(
    inventory.docs.map(({ path, status }) => [path, status]),
    phase527DocFiles.map((path) => [path, "present"])
  );
  assert.deepEqual(inventory.crossLinks, phase527CrossLinks);
  assertKnownInventoryStatuses(inventory.machineReadableArtifacts);
  assert.deepEqual(inventory.machineReadableArtifacts.map(({ path }) => path), [
    "tests/fixtures/host-policy/phase5-27/approval-evaluator-candidate-intake-checkpoint.json"
  ]);
  assertKnownInventoryStatuses(inventory.tests);
  assert.deepEqual(inventory.tests.map(({ path }) => path), [
    "tests/report-phase-status.test.mjs",
    "tests/phase5-27-approval-evaluator-candidate-intake-checkpoint.test.mjs"
  ]);
  assert.deepEqual(inventory.sourcePhase, {
    phase: "phase-5.26-review-artifact-evaluator-input-handoff",
    reviewArtifactEvaluatorInputHandoffPath:
      "packages/core/src/index.mjs#createReviewArtifactEvaluatorInputHandoffForReview",
    candidateIntakeCheckpointPath:
      "packages/core/src/index.mjs#createApprovalEvaluatorCandidateIntakeCheckpointForReview",
    sourceEvaluatorInputCandidateFixture:
      "tests/fixtures/host-policy/phase5-26/review-artifact-evaluator-input-handoff.json",
    runtimeEnabled: false,
    approvalGrantProduced: false
  });
  assert.deepEqual(inventory.intakeSummary, {
    intakeCheckpointRecorded: true,
    checkpointKind: "approval-evaluator-candidate-intake-checkpoint",
    checkpointReviewOnly: true,
    checkpointAuthoritative: false,
    validEvaluatorInputCandidatesProduceIntakeCheckpointState: true,
    missingEvaluatorInputCandidatesRejected: true,
    malformedEvaluatorInputCandidatesRejected: true,
    emptyEvaluatorInputCandidatesRejected: true,
    conflictingEvaluatorInputCandidatesRejected: true,
    staleEvaluatorInputCandidatesRejected: true,
    revokedEvaluatorInputCandidatesRejected: true,
    unknownEvaluatorInputCandidatesRejected: true,
    duplicateInvalidEvaluatorInputCandidatesRejected: true,
    authorizingLookingEvaluatorInputCandidatesRejected: true,
    runtimeEffectTrueEvaluatorInputCandidatesRejected: true,
    processFlagTrueEvaluatorInputCandidatesRejected: true,
    unsafeEvaluatorInputCandidatesRejected: true,
    intakeCheckpointStateIsApprovalGrant: false,
    approvalGrantProduced: false,
    approvalGrantPersisted: false,
    runtimePermissionGranted: false,
    commandExposurePermissionGranted: false,
    runtimeEnabled: false,
    runtimeCommandEnabled: false,
    runtimeCommandExposureEnabled: false,
    runtimeExecutionEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    canEnableRuntime: false
  });
  assert.equal(
    inventory.intakeInputShape.evaluatorInputCandidateSchema,
    "ardyn.phase-5.26.review-artifact-evaluator-input-candidate"
  );
  assert.equal(
    inventory.intakeInputShape.evaluatorInputCandidateMode,
    "review-only"
  );
  assert.equal(
    inventory.intakeInputShape.validEvaluatorInputCandidateRequired,
    true
  );
  assert.equal(
    inventory.intakeInputShape.authorizingLookingCandidatePolicy,
    "fail-closed"
  );
  assert.equal(
    inventory.intakeInputShape.runtimeEffectTrueCandidatePolicy,
    "fail-closed"
  );
  assert.equal(
    inventory.intakeInputShape.processFlagTrueCandidatePolicy,
    "fail-closed"
  );
  assert.equal(inventory.intakeInputShape.unsafeCandidatePolicy, "fail-closed");
  assert.equal(inventory.intakeInputShape.conflictingInputPolicy, "fail-closed");
  assert.equal(
    inventory.intakeInputShape.duplicateInvalidInputPolicy,
    "fail-closed"
  );
  assert.equal(inventory.intakeInputShape.filesystemWatcherAllowed, false);
  assert.equal(inventory.intakeInputShape.externalSourceLookupAllowed, false);
  assert.equal(inventory.intakeInputShape.secretsEnvIngestionAllowed, false);
  assert.equal(
    inventory.intakeResultShape.schema,
    "ardyn.phase-5.27.approval-evaluator-candidate-intake-checkpoint-result"
  );
  assert.equal(
    inventory.intakeResultShape.intakeCheckpointStateSchema,
    "ardyn.phase-5.27.approval-evaluator-candidate-intake-state"
  );
  assert.equal(
    inventory.intakeResultShape.intakeCheckpointStateIsApprovalGrant,
    false
  );
  assert.equal(inventory.intakeResultShape.approvalGrantProduced, false);
  assert.equal(inventory.intakeResultShape.approvalGrantPersisted, false);
  assert.equal(inventory.intakeResultShape.runtimePermissionGranted, false);
  assert.equal(
    inventory.intakeResultShape.commandExposurePermissionGranted,
    false
  );
  assert.equal(inventory.intakeResultShape.runtimeCommandExposureEnabled, false);
  assert.equal(inventory.intakeResultShape.runtimeExecutionEnabled, false);
  assert.equal(inventory.intakeResultShape.runtimeEffectAllFalse, true);
  assert.deepEqual(
    inventory.intakeCases.map(({ caseId }) => caseId),
    [
      "missing-approval-evaluator-candidate-intake-input-rejected",
      "malformed-approval-evaluator-candidate-intake-input-rejected",
      "malformed-approval-evaluator-candidate-invalid-reviewed-at-rejected",
      "empty-approval-evaluator-candidate-intake-input-rejected",
      "conflicting-approval-evaluator-candidate-intake-input-rejected",
      "stale-approval-evaluator-candidate-intake-input-rejected",
      "revoked-approval-evaluator-candidate-intake-input-rejected",
      "unknown-approval-evaluator-candidate-intake-input-rejected",
      "duplicate-invalid-approval-evaluator-candidate-intake-input-rejected",
      "authorizing-looking-approval-evaluator-candidate-intake-input-rejected",
      "runtime-effect-true-approval-evaluator-candidate-intake-input-rejected",
      "process-flag-true-approval-evaluator-candidate-intake-input-rejected",
      "unsafe-approval-evaluator-candidate-intake-input-rejected",
      "nested-unsafe-approval-evaluator-candidate-intake-input-rejected",
      "valid-approval-evaluator-candidate-intake-checkpoint-state"
    ]
  );
  for (const intakeCase of inventory.intakeCases) {
    assert.equal(intakeCase.reviewOnly, true);
    assert.equal(intakeCase.authoritative, false);
    assert.equal(intakeCase.intakeCheckpointStateIsApprovalGrant, false);
    assert.equal(intakeCase.approvalGrant.produced, false);
    assert.equal(intakeCase.approvalGrant.persisted, false);
    assert.equal(intakeCase.approvalGrant.grantId, null);
    assert.equal(intakeCase.runtimePermissionGranted, false);
    assert.equal(intakeCase.commandExposurePermissionGranted, false);
    assert.equal(intakeCase.runtimeCommandExposureEnabled, false);
    assert.equal(intakeCase.runtimeExecutionEnabled, false);
    assertAllFalse(intakeCase.runtimeEffect);
  }
  assert.equal(
    inventory.intakeCheckpointStateBoundary.stateCanGrantApproval,
    false
  );
  assert.equal(
    inventory.intakeCheckpointStateBoundary.stateCanPersistGrant,
    false
  );
  assert.equal(
    inventory.intakeCheckpointStateBoundary.stateCanGrantRuntimePermission,
    false
  );
  assert.equal(
    inventory.intakeCheckpointStateBoundary
      .stateCanGrantCommandExposurePermission,
    false
  );
  assert.equal(
    inventory.intakeCheckpointStateBoundary.stateCanExposeRuntimeCommand,
    false
  );
  assert.equal(
    inventory.intakeCheckpointStateBoundary.stateCanExecuteRuntime,
    false
  );
  assertAllFalse(inventory.blockedRuntimeEffect);
  assert.deepEqual(inventory.serveRuntimeBlockedBehavior.args, ["serve-runtime"]);
  assert.deepEqual(inventory.serveRuntimeBlockedBehavior.dryRunArgs, [
    "serve-runtime",
    "--dry-run"
  ]);
  assert.equal(inventory.serveRuntimeBlockedBehavior.stdoutEmpty, true);
  assert.equal(inventory.serveRuntimeBlockedBehavior.writesFiles, false);
  assert.equal(inventory.forbiddenBehavior.approvalGrantProduced, false);
  assert.equal(inventory.forbiddenBehavior.approvalGrantPersisted, false);
  assert.equal(inventory.forbiddenBehavior.runtimePermissionGranted, false);
  assert.equal(
    inventory.forbiddenBehavior.commandExposurePermissionGranted,
    false
  );
  assert.equal(inventory.forbiddenBehavior.runtimeCommandExposureEnabled, false);
  assert.equal(inventory.forbiddenBehavior.runtimeExecutionEnabled, false);
  assert.equal(inventory.forbiddenBehavior.cliCommandAdded, false);
  assert.equal(inventory.forbiddenBehavior.rustHostImplementationAdded, false);
  assert.ok(
    inventory.validationCommands.includes(
      "node --test tests/phase5-27-approval-evaluator-candidate-intake-checkpoint.test.mjs"
    )
  );
  assert.ok(
    inventory.validationCommands.includes(
      "fallow health --score --hotspots --targets --format json"
    )
  );
  assert.deepEqual(inventory.safetyPosture, {
    intakeCheckpointRecorded: true,
    checkpointReviewOnly: true,
    checkpointAuthoritative: false,
    validEvaluatorInputCandidatesProduceIntakeCheckpointState: true,
    missingEvaluatorInputCandidatesRejected: true,
    malformedEvaluatorInputCandidatesRejected: true,
    emptyEvaluatorInputCandidatesRejected: true,
    conflictingEvaluatorInputCandidatesRejected: true,
    staleEvaluatorInputCandidatesRejected: true,
    revokedEvaluatorInputCandidatesRejected: true,
    unknownEvaluatorInputCandidatesRejected: true,
    duplicateInvalidEvaluatorInputCandidatesRejected: true,
    authorizingLookingEvaluatorInputCandidatesRejected: true,
    runtimeEffectTrueEvaluatorInputCandidatesRejected: true,
    processFlagTrueEvaluatorInputCandidatesRejected: true,
    unsafeEvaluatorInputCandidatesRejected: true,
    intakeCheckpointStateIsApprovalGrant: false,
    approvalGrantProduced: false,
    approvalGrantPersisted: false,
    runtimePermissionGranted: false,
    commandExposurePermissionGranted: false,
    runtimeBlocked: true,
    runtimeEnabled: false,
    runtimeStarted: false,
    runtimeReady: false,
    runtimeCommandEnabled: false,
    runtimeCommandExposureEnabled: false,
    runtimeExecutionEnabled: false,
    runtimeExecuted: false,
    filesystemWatcherEnabled: false,
    externalSourceLookupEnabled: false,
    secretsEnvIngestionEnabled: false,
    liveStdinLoopEnabled: false,
    runtimeStdoutWriterEnabled: false,
    runtimeStderrWriterEnabled: false,
    processSpawnEnabled: false,
    processTerminationEnabled: false,
    runtimeSupervisionEnabled: false,
    runtimeTranscriptWritePerformed: false,
    runtimeAuditWritePerformed: false,
    adapterRuntimeBehaviorEnabled: false,
    contentFabricRuntimeBehaviorEnabled: false,
    webSocketHttpSurfaceEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    canEnableRuntime: false,
    noCliSourceChange: true,
    noRustSourceChange: true
  });
  assert.equal(
    report.safetyPosture.phase527ApprovalEvaluatorCandidateIntakeCheckpoint,
    true
  );
  assertSafetyFlags(report, phase527ExpectedTrueSafetyFlagNames, true);
  assertSafetyFlags(report, phase527ExpectedFalseSafetyFlagNames, false);
});

test("report inventories Phase 5.28 as review-only evaluator preflight checkpoint with runtime and evaluator execution blocked", async () => {
  const report = await runReport();
  const inventory =
    report.phase528ReviewOnlyEvaluatorPreflightCheckpointInventory;

  assert.deepEqual(inventory.statusLayer, {
    document: "docs/phase-5-28-review-only-evaluator-preflight-checkpoint.md",
    fixture:
      "tests/fixtures/host-policy/phase5-28/review-only-evaluator-preflight-checkpoint.json",
    sourceCandidateIntakeCheckpointDocument:
      "docs/phase-5-27-approval-evaluator-candidate-intake-checkpoint.md",
    sourceCandidateIntakeCheckpointFixture:
      "tests/fixtures/host-policy/phase5-27/approval-evaluator-candidate-intake-checkpoint.json",
    precedingPhase: "5.27",
    layerId: "review-only-evaluator-preflight-checkpoint",
    scope:
      "phase-5-review-only-evaluator-preflight-checkpoint-runtime-disabled",
    evaluatorPreflightCheckpointRecorded: true,
    checkpointKind: "review-only-evaluator-preflight-checkpoint",
    checkpointReviewOnly: true,
    checkpointAuthoritative: false,
    validIntakeCheckpointStateProducesPreflightState: true,
    missingIntakeCheckpointStateRejected: true,
    malformedIntakeCheckpointStateRejected: true,
    emptyIntakeCheckpointStateRejected: true,
    conflictingIntakeCheckpointStateRejected: true,
    staleIntakeCheckpointStateRejected: true,
    revokedIntakeCheckpointStateRejected: true,
    unknownIntakeCheckpointStateRejected: true,
    duplicateInvalidIntakeCheckpointStateRejected: true,
    authorizingLookingIntakeCheckpointStateRejected: true,
    grantLookingIntakeCheckpointStateRejected: true,
    runtimePermissionLookingIntakeCheckpointStateRejected: true,
    commandExposureLookingIntakeCheckpointStateRejected: true,
    runtimeEffectTrueIntakeCheckpointStateRejected: true,
    processFlagTrueIntakeCheckpointStateRejected: true,
    unsafeIntakeCheckpointStateRejected: true,
    executionSignalLookingIntakeCheckpointStateRejected: true,
    preflightCheckpointStateIsApprovalGrant: false,
    approvalGrantProduced: false,
    approvalGrantPersisted: false,
    runtimePermissionGranted: false,
    commandExposurePermissionGranted: false,
    runtimeEnabled: false,
    runtimeStarted: false,
    runtimeReady: false,
    runtimeCommandEnabled: false,
    runtimeCommandExposureEnabled: false,
    runtimeExecutionEnabled: false,
    runtimeExecuted: false,
    evaluatorExecutionPerformed: false,
    filesystemWatcherEnabled: false,
    externalSourceLookupEnabled: false,
    secretsEnvIngestionEnabled: false,
    liveStdinLoopEnabled: false,
    runtimeStdoutWriterEnabled: false,
    runtimeStderrWriterEnabled: false,
    processSpawnEnabled: false,
    processTerminationEnabled: false,
    runtimeSupervisionEnabled: false,
    runtimeTranscriptWritePerformed: false,
    runtimeAuditWritePerformed: false,
    adapterRuntimeBehaviorChanged: false,
    contentFabricRuntimeBehaviorChanged: false,
    webSocketHttpSurfaceEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    canEnableRuntime: false,
    cliSourceChanged: false,
    rustSourceChanged: false,
    reportRunsChecks: false
  });

  assert.deepEqual(
    inventory.docs.map(({ path, status }) => [path, status]),
    phase528DocFiles.map((path) => [path, "present"])
  );
  assert.deepEqual(inventory.crossLinks, phase528CrossLinks);
  assertKnownInventoryStatuses(inventory.machineReadableArtifacts);
  assert.deepEqual(inventory.machineReadableArtifacts.map(({ path }) => path), [
    "tests/fixtures/host-policy/phase5-28/review-only-evaluator-preflight-checkpoint.json"
  ]);
  assertKnownInventoryStatuses(inventory.tests);
  assert.deepEqual(inventory.tests.map(({ path }) => path), [
    "tests/report-phase-status.test.mjs",
    "tests/phase5-28-review-only-evaluator-preflight-checkpoint.test.mjs"
  ]);
  assert.deepEqual(inventory.sourcePhase, {
    phase: "phase-5.27-approval-evaluator-candidate-intake-checkpoint",
    candidateIntakeCheckpointPath:
      "packages/core/src/index.mjs#createApprovalEvaluatorCandidateIntakeCheckpointForReview",
    evaluatorPreflightCheckpointPath:
      "packages/core/src/index.mjs#createReviewOnlyEvaluatorPreflightCheckpointForReview",
    sourceIntakeCheckpointFixture:
      "tests/fixtures/host-policy/phase5-27/approval-evaluator-candidate-intake-checkpoint.json",
    runtimeEnabled: false,
    approvalGrantProduced: false,
    evaluatorExecutionPerformed: false
  });
  assert.deepEqual(inventory.preflightSummary, {
    evaluatorPreflightCheckpointRecorded: true,
    checkpointKind: "review-only-evaluator-preflight-checkpoint",
    checkpointReviewOnly: true,
    checkpointAuthoritative: false,
    validIntakeCheckpointStateProducesPreflightState: true,
    missingIntakeCheckpointStateRejected: true,
    malformedIntakeCheckpointStateRejected: true,
    emptyIntakeCheckpointStateRejected: true,
    conflictingIntakeCheckpointStateRejected: true,
    staleIntakeCheckpointStateRejected: true,
    revokedIntakeCheckpointStateRejected: true,
    unknownIntakeCheckpointStateRejected: true,
    duplicateInvalidIntakeCheckpointStateRejected: true,
    authorizingLookingIntakeCheckpointStateRejected: true,
    grantLookingIntakeCheckpointStateRejected: true,
    runtimePermissionLookingIntakeCheckpointStateRejected: true,
    commandExposureLookingIntakeCheckpointStateRejected: true,
    runtimeEffectTrueIntakeCheckpointStateRejected: true,
    processFlagTrueIntakeCheckpointStateRejected: true,
    unsafeIntakeCheckpointStateRejected: true,
    executionSignalLookingIntakeCheckpointStateRejected: true,
    preflightCheckpointStateIsApprovalGrant: false,
    approvalGrantProduced: false,
    approvalGrantPersisted: false,
    runtimePermissionGranted: false,
    commandExposurePermissionGranted: false,
    runtimeEnabled: false,
    runtimeCommandEnabled: false,
    runtimeCommandExposureEnabled: false,
    runtimeExecutionEnabled: false,
    evaluatorExecutionPerformed: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    canEnableRuntime: false
  });
  assert.equal(
    inventory.preflightInputShape.intakeCheckpointStateSchema,
    "ardyn.phase-5.27.approval-evaluator-candidate-intake-state"
  );
  assert.equal(inventory.preflightInputShape.intakeCheckpointStateMode, "review-only");
  assert.equal(
    inventory.preflightInputShape.validIntakeCheckpointStateRequired,
    true
  );
  assert.equal(
    inventory.preflightInputShape.grantLookingCheckpointStatePolicy,
    "fail-closed"
  );
  assert.equal(
    inventory.preflightInputShape.runtimePermissionLookingCheckpointStatePolicy,
    "fail-closed"
  );
  assert.equal(
    inventory.preflightInputShape.commandExposureLookingCheckpointStatePolicy,
    "fail-closed"
  );
  assert.equal(
    inventory.preflightInputShape.executionSignalLookingCheckpointStatePolicy,
    "fail-closed"
  );
  assert.equal(
    inventory.preflightInputShape.unsafeNestedCheckpointDataPolicy,
    "fail-closed"
  );
  assert.equal(inventory.preflightInputShape.filesystemWatcherAllowed, false);
  assert.equal(inventory.preflightInputShape.externalSourceLookupAllowed, false);
  assert.equal(inventory.preflightInputShape.secretsEnvIngestionAllowed, false);
  assert.equal(
    inventory.preflightResultShape.schema,
    "ardyn.phase-5.28.review-only-evaluator-preflight-checkpoint-result"
  );
  assert.equal(
    inventory.preflightResultShape.preflightCheckpointStateSchema,
    "ardyn.phase-5.28.review-only-evaluator-preflight-state"
  );
  assert.equal(
    inventory.preflightResultShape.preflightCheckpointStateIsApprovalGrant,
    false
  );
  assert.equal(inventory.preflightResultShape.approvalGrantProduced, false);
  assert.equal(inventory.preflightResultShape.approvalGrantPersisted, false);
  assert.equal(inventory.preflightResultShape.runtimePermissionGranted, false);
  assert.equal(
    inventory.preflightResultShape.commandExposurePermissionGranted,
    false
  );
  assert.equal(inventory.preflightResultShape.runtimeCommandExposureEnabled, false);
  assert.equal(inventory.preflightResultShape.runtimeExecutionEnabled, false);
  assert.equal(inventory.preflightResultShape.evaluatorExecutionPerformed, false);
  assert.equal(inventory.preflightResultShape.runtimeEffectAllFalse, true);
  assert.deepEqual(
    inventory.preflightCases.map(({ caseId }) => caseId),
    [
      "missing-review-only-evaluator-preflight-input-rejected",
      "malformed-review-only-evaluator-preflight-input-rejected",
      "malformed-review-only-evaluator-preflight-invalid-reviewed-at-rejected",
      "empty-review-only-evaluator-preflight-input-rejected",
      "conflicting-review-only-evaluator-preflight-input-rejected",
      "stale-review-only-evaluator-preflight-input-rejected",
      "revoked-review-only-evaluator-preflight-input-rejected",
      "unknown-review-only-evaluator-preflight-input-rejected",
      "duplicate-invalid-review-only-evaluator-preflight-input-rejected",
      "authorizing-looking-review-only-evaluator-preflight-input-rejected",
      "grant-looking-review-only-evaluator-preflight-input-rejected",
      "runtime-permission-looking-review-only-evaluator-preflight-input-rejected",
      "command-exposure-looking-review-only-evaluator-preflight-input-rejected",
      "runtime-effect-true-review-only-evaluator-preflight-input-rejected",
      "process-flag-true-review-only-evaluator-preflight-input-rejected",
      "unsafe-top-level-review-only-evaluator-preflight-input-rejected",
      "unsafe-nested-checkpoint-data-review-only-evaluator-preflight-input-rejected",
      "execution-signal-looking-review-only-evaluator-preflight-input-rejected",
      "valid-review-only-evaluator-preflight-checkpoint-state"
    ]
  );
  for (const preflightCase of inventory.preflightCases) {
    assert.equal(preflightCase.reviewOnly, true);
    assert.equal(preflightCase.authoritative, false);
    assert.equal(preflightCase.preflightCheckpointStateIsApprovalGrant, false);
    assert.equal(preflightCase.approvalGrant.produced, false);
    assert.equal(preflightCase.approvalGrant.persisted, false);
    assert.equal(preflightCase.approvalGrant.grantId, null);
    assert.equal(preflightCase.runtimePermissionGranted, false);
    assert.equal(preflightCase.commandExposurePermissionGranted, false);
    assert.equal(preflightCase.runtimeCommandExposureEnabled, false);
    assert.equal(preflightCase.runtimeExecutionEnabled, false);
    assert.equal(preflightCase.evaluatorExecuted, false);
    assertAllFalse(preflightCase.runtimeEffect);
  }
  assert.equal(
    inventory.preflightCheckpointStateBoundary.stateCanGrantApproval,
    false
  );
  assert.equal(
    inventory.preflightCheckpointStateBoundary.stateCanPersistGrant,
    false
  );
  assert.equal(
    inventory.preflightCheckpointStateBoundary.stateCanGrantRuntimePermission,
    false
  );
  assert.equal(
    inventory.preflightCheckpointStateBoundary
      .stateCanGrantCommandExposurePermission,
    false
  );
  assert.equal(
    inventory.preflightCheckpointStateBoundary.stateCanExecuteEvaluator,
    false
  );
  assert.equal(
    inventory.preflightCheckpointStateBoundary.stateCanExecuteRuntime,
    false
  );
  assertAllFalse(inventory.blockedRuntimeEffect);
  assert.deepEqual(inventory.serveRuntimeBlockedBehavior.args, ["serve-runtime"]);
  assert.deepEqual(inventory.serveRuntimeBlockedBehavior.dryRunArgs, [
    "serve-runtime",
    "--dry-run"
  ]);
  assert.equal(inventory.serveRuntimeBlockedBehavior.stdoutEmpty, true);
  assert.equal(inventory.serveRuntimeBlockedBehavior.writesFiles, false);
  assert.equal(inventory.forbiddenBehavior.approvalGrantProduced, false);
  assert.equal(inventory.forbiddenBehavior.approvalGrantPersisted, false);
  assert.equal(inventory.forbiddenBehavior.runtimePermissionGranted, false);
  assert.equal(
    inventory.forbiddenBehavior.commandExposurePermissionGranted,
    false
  );
  assert.equal(inventory.forbiddenBehavior.runtimeCommandExposureEnabled, false);
  assert.equal(inventory.forbiddenBehavior.runtimeExecutionEnabled, false);
  assert.equal(inventory.forbiddenBehavior.evaluatorExecutionPerformed, false);
  assert.equal(inventory.forbiddenBehavior.cliCommandAdded, false);
  assert.equal(inventory.forbiddenBehavior.rustHostImplementationAdded, false);
  assert.ok(
    inventory.validationCommands.includes(
      "node --test tests/phase5-28-review-only-evaluator-preflight-checkpoint.test.mjs"
    )
  );
  assert.ok(
    inventory.validationCommands.includes(
      "fallow health --score --hotspots --targets --format json"
    )
  );
  assert.deepEqual(inventory.safetyPosture, {
    evaluatorPreflightCheckpointRecorded: true,
    checkpointReviewOnly: true,
    checkpointAuthoritative: false,
    validIntakeCheckpointStateProducesPreflightState: true,
    missingIntakeCheckpointStateRejected: true,
    malformedIntakeCheckpointStateRejected: true,
    emptyIntakeCheckpointStateRejected: true,
    conflictingIntakeCheckpointStateRejected: true,
    staleIntakeCheckpointStateRejected: true,
    revokedIntakeCheckpointStateRejected: true,
    unknownIntakeCheckpointStateRejected: true,
    duplicateInvalidIntakeCheckpointStateRejected: true,
    authorizingLookingIntakeCheckpointStateRejected: true,
    grantLookingIntakeCheckpointStateRejected: true,
    runtimePermissionLookingIntakeCheckpointStateRejected: true,
    commandExposureLookingIntakeCheckpointStateRejected: true,
    runtimeEffectTrueIntakeCheckpointStateRejected: true,
    processFlagTrueIntakeCheckpointStateRejected: true,
    unsafeIntakeCheckpointStateRejected: true,
    executionSignalLookingIntakeCheckpointStateRejected: true,
    preflightCheckpointStateIsApprovalGrant: false,
    approvalGrantProduced: false,
    approvalGrantPersisted: false,
    runtimePermissionGranted: false,
    commandExposurePermissionGranted: false,
    runtimeBlocked: true,
    runtimeEnabled: false,
    runtimeStarted: false,
    runtimeReady: false,
    runtimeCommandEnabled: false,
    runtimeCommandExposureEnabled: false,
    runtimeExecutionEnabled: false,
    runtimeExecuted: false,
    evaluatorExecutionPerformed: false,
    filesystemWatcherEnabled: false,
    externalSourceLookupEnabled: false,
    secretsEnvIngestionEnabled: false,
    liveStdinLoopEnabled: false,
    runtimeStdoutWriterEnabled: false,
    runtimeStderrWriterEnabled: false,
    processSpawnEnabled: false,
    processTerminationEnabled: false,
    runtimeSupervisionEnabled: false,
    runtimeTranscriptWritePerformed: false,
    runtimeAuditWritePerformed: false,
    adapterRuntimeBehaviorEnabled: false,
    contentFabricRuntimeBehaviorEnabled: false,
    webSocketHttpSurfaceEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    canEnableRuntime: false,
    noCliSourceChange: true,
    noRustSourceChange: true
  });
  assert.equal(
    report.safetyPosture.phase528ReviewOnlyEvaluatorPreflightCheckpoint,
    true
  );
  assertSafetyFlags(report, phase528ExpectedTrueSafetyFlagNames, true);
  assertSafetyFlags(report, phase528ExpectedFalseSafetyFlagNames, false);
});

test("report inventories Phase 5.29 as non-authorizing evaluator decision-candidate boundary", async () => {
  const report = await runReport();
  const inventory =
    report.phase529NonAuthorizingEvaluatorDecisionCandidateBoundaryInventory;

  assert.deepEqual(inventory.statusLayer, {
    document:
      "docs/phase-5-29-non-authorizing-evaluator-decision-candidate-boundary.md",
    fixture:
      "tests/fixtures/host-policy/phase5-29/non-authorizing-evaluator-decision-candidate-boundary.json",
    sourcePreflightCheckpointDocument:
      "docs/phase-5-28-review-only-evaluator-preflight-checkpoint.md",
    sourcePreflightCheckpointFixture:
      "tests/fixtures/host-policy/phase5-28/review-only-evaluator-preflight-checkpoint.json",
    precedingPhase: "5.28",
    layerId: "non-authorizing-evaluator-decision-candidate-boundary",
    scope:
      "phase-5-non-authorizing-evaluator-decision-candidate-boundary-runtime-disabled",
    evaluatorDecisionCandidateBoundaryRecorded: true,
    boundaryKind: "non-authorizing-evaluator-decision-candidate-boundary",
    boundaryReviewOnly: true,
    boundaryAuthoritative: false,
    validPreflightCheckpointStateProducesDecisionCandidateState: true,
    missingPreflightCheckpointStateRejected: true,
    malformedPreflightCheckpointStateRejected: true,
    emptyPreflightCheckpointStateRejected: true,
    conflictingPreflightCheckpointStateRejected: true,
    stalePreflightCheckpointStateRejected: true,
    revokedPreflightCheckpointStateRejected: true,
    unknownPreflightCheckpointStateRejected: true,
    duplicateInvalidPreflightCheckpointStateRejected: true,
    authorizingLookingPreflightCheckpointStateRejected: true,
    grantLookingPreflightCheckpointStateRejected: true,
    approvalDecisionLookingPreflightCheckpointStateRejected: true,
    approvalGrantLookingPreflightCheckpointStateRejected: true,
    runtimePermissionLookingPreflightCheckpointStateRejected: true,
    commandExposureLookingPreflightCheckpointStateRejected: true,
    evaluatorExecutionLookingPreflightCheckpointStateRejected: true,
    runtimeEffectTruePreflightCheckpointStateRejected: true,
    processFlagTruePreflightCheckpointStateRejected: true,
    unsafePreflightCheckpointStateRejected: true,
    executionSignalLookingPreflightCheckpointStateRejected: true,
    decisionCandidateStateIsApprovalDecision: false,
    decisionCandidateStateIsApprovalGrant: false,
    approvalDecisionProduced: false,
    approvalDecisionPersisted: false,
    approvalGrantProduced: false,
    approvalGrantPersisted: false,
    runtimePermissionGranted: false,
    commandExposurePermissionGranted: false,
    runtimeEnabled: false,
    runtimeStarted: false,
    runtimeReady: false,
    runtimeCommandEnabled: false,
    runtimeCommandExposureEnabled: false,
    runtimeExecutionEnabled: false,
    runtimeExecuted: false,
    evaluatorExecutionPerformed: false,
    filesystemWatcherEnabled: false,
    externalSourceLookupEnabled: false,
    secretsEnvIngestionEnabled: false,
    liveStdinLoopEnabled: false,
    runtimeStdoutWriterEnabled: false,
    runtimeStderrWriterEnabled: false,
    processSpawnEnabled: false,
    processTerminationEnabled: false,
    runtimeSupervisionEnabled: false,
    runtimeTranscriptWritePerformed: false,
    runtimeAuditWritePerformed: false,
    adapterRuntimeBehaviorChanged: false,
    contentFabricRuntimeBehaviorChanged: false,
    webSocketHttpSurfaceEnabled: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    canEnableRuntime: false,
    cliSourceChanged: false,
    rustSourceChanged: false,
    reportRunsChecks: false
  });

  assert.deepEqual(
    inventory.docs.map(({ path, status }) => [path, status]),
    phase529DocFiles.map((path) => [path, "present"])
  );
  assert.deepEqual(inventory.crossLinks, phase529CrossLinks);
  assertKnownInventoryStatuses(inventory.machineReadableArtifacts);
  assert.deepEqual(inventory.machineReadableArtifacts.map(({ path }) => path), [
    "tests/fixtures/host-policy/phase5-29/non-authorizing-evaluator-decision-candidate-boundary.json"
  ]);
  assertKnownInventoryStatuses(inventory.tests);
  assert.deepEqual(inventory.tests.map(({ path }) => path), [
    "tests/report-phase-status.test.mjs",
    "tests/phase5-29-non-authorizing-evaluator-decision-candidate-boundary.test.mjs"
  ]);
  assert.deepEqual(inventory.sourcePhase, {
    phase: "phase-5.28-review-only-evaluator-preflight-checkpoint",
    preflightCheckpointPath:
      "packages/core/src/index.mjs#createReviewOnlyEvaluatorPreflightCheckpointForReview",
    decisionCandidateBoundaryPath:
      "packages/core/src/index.mjs#createNonAuthorizingEvaluatorDecisionCandidateBoundaryForReview",
    sourcePreflightCheckpointFixture:
      "tests/fixtures/host-policy/phase5-28/review-only-evaluator-preflight-checkpoint.json",
    runtimeEnabled: false,
    approvalDecisionProduced: false,
    approvalGrantProduced: false,
    evaluatorExecutionPerformed: false
  });
  assert.deepEqual(inventory.decisionCandidateSummary, {
    evaluatorDecisionCandidateBoundaryRecorded: true,
    boundaryKind: "non-authorizing-evaluator-decision-candidate-boundary",
    boundaryReviewOnly: true,
    boundaryAuthoritative: false,
    validPreflightCheckpointStateProducesDecisionCandidateState: true,
    missingPreflightCheckpointStateRejected: true,
    malformedPreflightCheckpointStateRejected: true,
    emptyPreflightCheckpointStateRejected: true,
    conflictingPreflightCheckpointStateRejected: true,
    stalePreflightCheckpointStateRejected: true,
    revokedPreflightCheckpointStateRejected: true,
    unknownPreflightCheckpointStateRejected: true,
    duplicateInvalidPreflightCheckpointStateRejected: true,
    authorizingLookingPreflightCheckpointStateRejected: true,
    grantLookingPreflightCheckpointStateRejected: true,
    approvalDecisionLookingPreflightCheckpointStateRejected: true,
    approvalGrantLookingPreflightCheckpointStateRejected: true,
    runtimePermissionLookingPreflightCheckpointStateRejected: true,
    commandExposureLookingPreflightCheckpointStateRejected: true,
    evaluatorExecutionLookingPreflightCheckpointStateRejected: true,
    runtimeEffectTruePreflightCheckpointStateRejected: true,
    processFlagTruePreflightCheckpointStateRejected: true,
    unsafePreflightCheckpointStateRejected: true,
    executionSignalLookingPreflightCheckpointStateRejected: true,
    decisionCandidateStateIsApprovalDecision: false,
    decisionCandidateStateIsApprovalGrant: false,
    approvalDecisionProduced: false,
    approvalGrantProduced: false,
    approvalGrantPersisted: false,
    runtimePermissionGranted: false,
    commandExposurePermissionGranted: false,
    runtimeEnabled: false,
    runtimeCommandEnabled: false,
    runtimeCommandExposureEnabled: false,
    runtimeExecutionEnabled: false,
    evaluatorExecutionPerformed: false,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    canEnableRuntime: false
  });
  assert.equal(
    inventory.decisionCandidateInputShape.preflightCheckpointStateSchema,
    "ardyn.phase-5.28.review-only-evaluator-preflight-state"
  );
  assert.equal(
    inventory.decisionCandidateInputShape.approvalDecisionLookingCheckpointStatePolicy,
    "fail-closed"
  );
  assert.equal(
    inventory.decisionCandidateInputShape.unsafeNestedDecisionPreflightCheckpointDataPolicy,
    "fail-closed"
  );
  assert.equal(
    inventory.decisionCandidateResultShape.schema,
    "ardyn.phase-5.29.non-authorizing-evaluator-decision-candidate-boundary-result"
  );
  assert.equal(
    inventory.decisionCandidateResultShape.decisionCandidateStateSchema,
    "ardyn.phase-5.29.review-only-evaluator-decision-candidate-state"
  );
  assert.equal(
    inventory.decisionCandidateResultShape.decisionCandidateStateIsApprovalDecision,
    false
  );
  assert.equal(inventory.decisionCandidateResultShape.approvalDecisionProduced, false);
  assert.equal(inventory.decisionCandidateResultShape.evaluatorExecuted, false);
  assert.deepEqual(
    inventory.decisionCandidateCases.map(({ caseId }) => caseId),
    phase529ExpectedCaseIds
  );
  for (const decisionCase of inventory.decisionCandidateCases) {
    assert.equal(decisionCase.reviewOnly, true);
    assert.equal(decisionCase.authoritative, false);
    assert.equal(decisionCase.reviewArtifactOnly, true);
    assert.equal(decisionCase.decisionCandidateStateIsApprovalDecision, false);
    assert.equal(decisionCase.decisionCandidateStateIsApprovalGrant, false);
    assert.equal(decisionCase.approvalDecisionProduced, false);
    assert.equal(decisionCase.approvalGrant.produced, false);
    assert.equal(decisionCase.approvalGrant.persisted, false);
    assert.equal(decisionCase.approvalGrant.grantId, null);
    assert.equal(decisionCase.runtimePermissionGranted, false);
    assert.equal(decisionCase.commandExposurePermissionGranted, false);
    assert.equal(decisionCase.evaluatorExecuted, false);
    assertAllFalse(decisionCase.runtimeEffect);
  }
  assert.equal(inventory.decisionCandidateStateBoundary.stateCanExecuteEvaluator, false);
  assert.equal(
    inventory.decisionCandidateStateBoundary.stateCanProduceApprovalDecision,
    false
  );
  assert.equal(inventory.decisionCandidateStateBoundary.stateCanGrantApproval, false);
  assert.equal(
    inventory.decisionCandidateStateBoundary.stateCanGrantRuntimePermission,
    false
  );
  assertAllFalse(inventory.blockedRuntimeEffect);
  assert.deepEqual(inventory.serveRuntimeBlockedBehavior.args, ["serve-runtime"]);
  assert.deepEqual(inventory.serveRuntimeBlockedBehavior.dryRunArgs, [
    "serve-runtime",
    "--dry-run"
  ]);
  assert.equal(inventory.serveRuntimeBlockedBehavior.writesFiles, false);
  assert.equal(inventory.forbiddenBehavior.approvalDecisionProduced, false);
  assert.equal(inventory.forbiddenBehavior.evaluatorExecutionPerformed, false);
  assert.ok(
    inventory.validationCommands.includes(
      "node --test tests/phase5-29-non-authorizing-evaluator-decision-candidate-boundary.test.mjs"
    )
  );
  assert.equal(
    report.safetyPosture.phase529NonAuthorizingEvaluatorDecisionCandidateBoundary,
    true
  );
  assertSafetyFlags(report, phase529ExpectedTrueSafetyFlagNames, true);
  assertSafetyFlags(report, phase529ExpectedFalseSafetyFlagNames, false);
});

test("report inventories Phase 5.30 as non-authorizing evaluator decision-candidate inspection artifact", async () => {
  const report = await runReport();
  const inventory =
    report.phase530NonAuthorizingEvaluatorDecisionCandidateInspectionArtifactInventory;

  assert.deepEqual(
    inventory.docs.map(({ path, status }) => [path, status]),
    phase530DocFiles.map((path) => [path, "present"])
  );
  assert.deepEqual(inventory.crossLinks, phase530CrossLinks);
  assertKnownInventoryStatuses(inventory.machineReadableArtifacts);
  assert.deepEqual(inventory.machineReadableArtifacts.map(({ path }) => path), [
    "tests/fixtures/host-policy/phase5-30/non-authorizing-evaluator-decision-candidate-inspection-artifact.json"
  ]);
  assertKnownInventoryStatuses(inventory.tests);
  assert.deepEqual(inventory.tests.map(({ path }) => path), [
    "tests/report-phase-status.test.mjs",
    "tests/phase5-30-evaluator-decision-candidate-inspection-artifact.test.mjs"
  ]);
  assert.equal(inventory.statusLayer.precedingPhase, "5.29");
  assert.equal(
    inventory.statusLayer.layerId,
    "non-authorizing-evaluator-decision-candidate-inspection-artifact"
  );
  assert.equal(
    inventory.statusLayer.validDecisionCandidateStateProducesInspectionArtifact,
    true
  );
  assert.equal(inventory.statusLayer.evaluatorResultProduced, false);
  assert.equal(inventory.statusLayer.approvalDecisionProduced, false);
  assert.equal(inventory.statusLayer.approvalGrantProduced, false);
  assert.equal(inventory.statusLayer.runtimePermissionGranted, false);
  assert.equal(inventory.statusLayer.commandExposurePermissionGranted, false);
  assert.equal(inventory.statusLayer.evaluatorExecutionPerformed, false);
  assert.equal(inventory.statusLayer.serveRuntimeStillDefaultBlocked, true);
  assert.deepEqual(inventory.sourcePhase, {
    phase: "phase-5.29-non-authorizing-evaluator-decision-candidate-boundary",
    decisionCandidateStatePath:
      "packages/core/src/index.mjs#createNonAuthorizingEvaluatorDecisionCandidateBoundaryForReview",
    inspectionArtifactPath:
      "packages/core/src/index.mjs#createNonAuthorizingEvaluatorDecisionCandidateInspectionArtifactForReview",
    sourceDecisionCandidateFixture:
      "tests/fixtures/host-policy/phase5-29/non-authorizing-evaluator-decision-candidate-boundary.json",
    runtimeEnabled: false,
    evaluatorResultProduced: false,
    approvalDecisionProduced: false,
    approvalGrantProduced: false,
    evaluatorExecutionPerformed: false
  });
  assert.equal(
    inventory.inspectionArtifactInputShape.decisionCandidateStateSchema,
    "ardyn.phase-5.29.review-only-evaluator-decision-candidate-state"
  );
  assert.equal(
    inventory.inspectionArtifactInputShape.evaluatorResultLookingDecisionCandidateStatePolicy,
    "fail-closed"
  );
  assert.equal(
    inventory.inspectionArtifactInputShape.unsafeNestedDecisionCandidateReportArtifactDataPolicy,
    "fail-closed"
  );
  assert.equal(
    inventory.inspectionArtifactResultShape.schema,
    "ardyn.phase-5.30.non-authorizing-evaluator-decision-candidate-inspection-artifact-result"
  );
  assert.equal(
    inventory.inspectionArtifactResultShape.inspectionArtifactSchema,
    "ardyn.phase-5.30.non-authorizing-evaluator-decision-candidate-inspection-artifact"
  );
  assert.equal(
    inventory.inspectionArtifactResultShape.inspectionArtifactIsApprovalDecision,
    false
  );
  assert.equal(inventory.inspectionArtifactResultShape.evaluatorResultProduced, false);
  assert.equal(inventory.inspectionArtifactResultShape.approvalDecisionProduced, false);
  assert.equal(inventory.inspectionArtifactResultShape.evaluatorExecuted, false);
  assert.deepEqual(
    inventory.inspectionArtifactCases.map(({ caseId }) => caseId),
    phase530ExpectedCaseIds
  );
  for (const inspectionCase of inventory.inspectionArtifactCases) {
    assert.equal(inspectionCase.reviewOnly, true);
    assert.equal(inspectionCase.authoritative, false);
    assert.equal(inspectionCase.reviewArtifactOnly, true);
    assert.equal(inspectionCase.inspectionArtifactIsApprovalDecision, false);
    assert.equal(inspectionCase.inspectionArtifactIsApprovalGrant, false);
    assert.equal(inspectionCase.evaluatorResultProduced, false);
    assert.equal(inspectionCase.approvalDecisionProduced, false);
    assert.equal(inspectionCase.approvalGrant.produced, false);
    assert.equal(inspectionCase.approvalGrant.persisted, false);
    assert.equal(inspectionCase.approvalGrant.grantId, null);
    assert.equal(inspectionCase.runtimePermissionGranted, false);
    assert.equal(inspectionCase.commandExposurePermissionGranted, false);
    assert.equal(inspectionCase.evaluatorExecuted, false);
    assertAllFalse(inspectionCase.runtimeEffect);
  }
  assert.equal(inventory.inspectionArtifactBoundary.artifactCanExecuteEvaluator, false);
  assert.equal(
    inventory.inspectionArtifactBoundary.artifactCanProduceEvaluatorResult,
    false
  );
  assert.equal(
    inventory.inspectionArtifactBoundary.artifactCanProduceApprovalDecision,
    false
  );
  assert.equal(inventory.inspectionArtifactBoundary.artifactCanGrantApproval, false);
  assert.equal(
    inventory.inspectionArtifactBoundary.artifactCanGrantRuntimePermission,
    false
  );
  assertAllFalse(inventory.blockedRuntimeEffect);
  assert.deepEqual(inventory.serveRuntimeBlockedBehavior.args, ["serve-runtime"]);
  assert.deepEqual(inventory.serveRuntimeBlockedBehavior.dryRunArgs, [
    "serve-runtime",
    "--dry-run"
  ]);
  assert.equal(inventory.serveRuntimeBlockedBehavior.writesFiles, false);
  assert.equal(inventory.forbiddenBehavior.evaluatorResultProduction, false);
  assert.equal(inventory.forbiddenBehavior.approvalDecisionProduction, false);
  assert.equal(inventory.forbiddenBehavior.evaluatorExecution, false);
  assert.ok(
    inventory.validationCommands.includes(
      "node --test tests/phase5-30-evaluator-decision-candidate-inspection-artifact.test.mjs"
    )
  );
  assert.equal(
    report.safetyPosture
      .phase530NonAuthorizingEvaluatorDecisionCandidateInspectionArtifact,
    true
  );
  assertSafetyFlags(report, phase530ExpectedTrueSafetyFlagNames, true);
  assertSafetyFlags(report, phase530ExpectedFalseSafetyFlagNames, false);
});

test("report inventories Phase 5.31 as review-only human/tool inspection disposition boundary", async () => {
  const report = await runReport();
  const inventory = report.phase531HumanToolInspectionDispositionBoundaryInventory;

  assert.deepEqual(
    inventory.docs.map(({ path, status }) => [path, status]),
    phase531DocFiles.map((path) => [path, "present"])
  );
  assert.deepEqual(inventory.crossLinks, phase531CrossLinks);
  assertKnownInventoryStatuses(inventory.machineReadableArtifacts);
  assert.deepEqual(inventory.machineReadableArtifacts.map(({ path }) => path), [
    "tests/fixtures/host-policy/phase5-31/human-tool-inspection-disposition-boundary.json"
  ]);
  assertKnownInventoryStatuses(inventory.tests);
  assert.deepEqual(inventory.tests.map(({ path }) => path), [
    "tests/report-phase-status.test.mjs",
    "tests/phase5-31-human-tool-inspection-disposition-boundary.test.mjs"
  ]);
  assert.equal(inventory.statusLayer.precedingPhase, "5.30");
  assert.equal(
    inventory.statusLayer.layerId,
    "human-tool-inspection-disposition-boundary"
  );
  assert.equal(
    inventory.statusLayer.validInspectionArtifactProducesDispositionState,
    true
  );
  assert.equal(inventory.statusLayer.evaluatorResultProduced, false);
  assert.equal(inventory.statusLayer.evaluatorResultPersisted, false);
  assert.equal(inventory.statusLayer.approvalDecisionProduced, false);
  assert.equal(inventory.statusLayer.approvalDecisionPersisted, false);
  assert.equal(inventory.statusLayer.approvalGrantProduced, false);
  assert.equal(inventory.statusLayer.runtimePermissionGranted, false);
  assert.equal(inventory.statusLayer.commandExposurePermissionGranted, false);
  assert.equal(inventory.statusLayer.evaluatorExecutionPerformed, false);
  assert.equal(inventory.statusLayer.serveRuntimeStillDefaultBlocked, true);
  assert.deepEqual(inventory.sourcePhase, {
    phase: "phase-5.30-non-authorizing-evaluator-decision-candidate-inspection-artifact",
    inspectionArtifactPath:
      "packages/core/src/index.mjs#createNonAuthorizingEvaluatorDecisionCandidateInspectionArtifactForReview",
    dispositionBoundaryPath:
      "packages/core/src/index.mjs#createHumanToolInspectionDispositionBoundaryForReview",
    sourceInspectionArtifactFixture:
      "tests/fixtures/host-policy/phase5-30/non-authorizing-evaluator-decision-candidate-inspection-artifact.json",
    runtimeEnabled: false,
    evaluatorResultProduced: false,
    approvalDecisionProduced: false,
    approvalGrantProduced: false,
    evaluatorExecutionPerformed: false
  });
  assert.equal(
    inventory.dispositionBoundaryInputShape.inspectionArtifactSchema,
    "ardyn.phase-5.30.non-authorizing-evaluator-decision-candidate-inspection-artifact"
  );
  assert.equal(
    inventory.dispositionBoundaryInputShape.evaluatorResultLookingInspectionArtifactPolicy,
    "fail-closed"
  );
  assert.equal(
    inventory.dispositionBoundaryInputShape.unsafeNestedInspectionArtifactDispositionDataPolicy,
    "fail-closed"
  );
  assert.equal(
    inventory.dispositionBoundaryResultShape.schema,
    "ardyn.phase-5.31.human-tool-inspection-disposition-boundary-result"
  );
  assert.equal(
    inventory.dispositionBoundaryResultShape.dispositionStateSchema,
    "ardyn.phase-5.31.review-only-human-tool-inspection-disposition-state"
  );
  assert.equal(
    inventory.dispositionBoundaryResultShape.dispositionStateIsApprovalDecision,
    false
  );
  assert.equal(inventory.dispositionBoundaryResultShape.evaluatorResultProduced, false);
  assert.equal(inventory.dispositionBoundaryResultShape.approvalDecisionProduced, false);
  assert.equal(inventory.dispositionBoundaryResultShape.evaluatorExecuted, false);
  assert.deepEqual(
    inventory.dispositionBoundaryCases.map(({ caseId }) => caseId),
    phase531ExpectedCaseIds
  );
  for (const dispositionCase of inventory.dispositionBoundaryCases) {
    assert.equal(dispositionCase.reviewOnly, true);
    assert.equal(dispositionCase.authoritative, false);
    assert.equal(dispositionCase.reviewArtifactOnly, true);
    assert.equal(dispositionCase.dispositionStateIsApprovalDecision, false);
    assert.equal(dispositionCase.dispositionStateIsApprovalGrant, false);
    assert.equal(dispositionCase.evaluatorResultProduced, false);
    assert.equal(dispositionCase.evaluatorResultPersisted, false);
    assert.equal(dispositionCase.approvalDecisionProduced, false);
    assert.equal(dispositionCase.approvalGrant.produced, false);
    assert.equal(dispositionCase.approvalGrant.persisted, false);
    assert.equal(dispositionCase.approvalGrant.grantId, null);
    assert.equal(dispositionCase.runtimePermissionGranted, false);
    assert.equal(dispositionCase.commandExposurePermissionGranted, false);
    assert.equal(dispositionCase.evaluatorExecuted, false);
    assertAllFalse(dispositionCase.runtimeEffect);
  }
  assert.equal(inventory.dispositionBoundary.dispositionCanExecuteEvaluator, false);
  assert.equal(
    inventory.dispositionBoundary.dispositionCanProduceEvaluatorResult,
    false
  );
  assert.equal(
    inventory.dispositionBoundary.dispositionCanProduceApprovalDecision,
    false
  );
  assert.equal(inventory.dispositionBoundary.dispositionCanGrantApproval, false);
  assert.equal(
    inventory.dispositionBoundary.dispositionCanGrantRuntimePermission,
    false
  );
  assertAllFalse(inventory.blockedRuntimeEffect);
  assert.deepEqual(inventory.serveRuntimeBlockedBehavior.args, ["serve-runtime"]);
  assert.deepEqual(inventory.serveRuntimeBlockedBehavior.dryRunArgs, [
    "serve-runtime",
    "--dry-run"
  ]);
  assert.equal(inventory.serveRuntimeBlockedBehavior.writesFiles, false);
  assert.equal(inventory.forbiddenBehavior.evaluatorResultProduction, false);
  assert.equal(inventory.forbiddenBehavior.approvalDecisionProduction, false);
  assert.equal(inventory.forbiddenBehavior.evaluatorExecution, false);
  assert.ok(
    inventory.validationCommands.includes(
      "node --test tests/phase5-31-human-tool-inspection-disposition-boundary.test.mjs"
    )
  );
  assert.equal(
    report.safetyPosture.phase531HumanToolInspectionDispositionBoundary,
    true
  );
  assertSafetyFlags(report, phase531ExpectedTrueSafetyFlagNames, true);
  assertSafetyFlags(report, phase531ExpectedFalseSafetyFlagNames, false);
});

test("report inventories Phase 5.32 as review-only disposition aggregation checkpoint", async () => {
  const report = await runReport();
  const inventory =
    report.phase532ReviewOnlyDispositionAggregationCheckpointInventory;

  assert.deepEqual(
    inventory.docs.map(({ path, status }) => [path, status]),
    phase532DocFiles.map((path) => [path, "present"])
  );
  assert.deepEqual(inventory.crossLinks, phase532CrossLinks);
  assertKnownInventoryStatuses(inventory.machineReadableArtifacts);
  assert.deepEqual(inventory.machineReadableArtifacts.map(({ path }) => path), [
    "tests/fixtures/host-policy/phase5-32/review-only-disposition-aggregation-checkpoint.json"
  ]);
  assertKnownInventoryStatuses(inventory.tests);
  assert.deepEqual(inventory.tests.map(({ path }) => path), [
    "tests/report-phase-status.test.mjs",
    "tests/phase5-32-review-only-disposition-aggregation-checkpoint.test.mjs"
  ]);
  assert.equal(inventory.statusLayer.precedingPhase, "5.31");
  assert.equal(
    inventory.statusLayer.layerId,
    "review-only-disposition-aggregation-checkpoint"
  );
  assert.equal(
    inventory.statusLayer.validDispositionStateProducesAggregationState,
    true
  );
  assert.equal(inventory.statusLayer.reviewerRoutingPerformed, false);
  assert.equal(inventory.statusLayer.evaluatorResultProduced, false);
  assert.equal(inventory.statusLayer.evaluatorResultPersisted, false);
  assert.equal(inventory.statusLayer.approvalDecisionProduced, false);
  assert.equal(inventory.statusLayer.approvalDecisionPersisted, false);
  assert.equal(inventory.statusLayer.approvalGrantProduced, false);
  assert.equal(inventory.statusLayer.runtimePermissionGranted, false);
  assert.equal(inventory.statusLayer.commandExposurePermissionGranted, false);
  assert.equal(inventory.statusLayer.evaluatorExecutionPerformed, false);
  assert.equal(inventory.statusLayer.serveRuntimeStillDefaultBlocked, true);
  assert.deepEqual(inventory.sourcePhase, {
    phase: "phase-5.31-human-tool-inspection-disposition-boundary",
    dispositionBoundaryPath:
      "packages/core/src/index.mjs#createHumanToolInspectionDispositionBoundaryForReview",
    aggregationCheckpointPath:
      "packages/core/src/index.mjs#createReviewOnlyDispositionAggregationCheckpointForReview",
    sourceDispositionBoundaryFixture:
      "tests/fixtures/host-policy/phase5-31/human-tool-inspection-disposition-boundary.json",
    runtimeEnabled: false,
    reviewerRoutingPerformed: false,
    evaluatorResultProduced: false,
    approvalDecisionProduced: false,
    approvalGrantProduced: false,
    evaluatorExecutionPerformed: false
  });
  assert.equal(
    inventory.aggregationCheckpointInputShape.dispositionStateSchema,
    "ardyn.phase-5.31.review-only-human-tool-inspection-disposition-state"
  );
  assert.equal(
    inventory.aggregationCheckpointInputShape.reviewerRoutingLookingDispositionStatePolicy,
    "fail-closed"
  );
  assert.equal(
    inventory.aggregationCheckpointInputShape.unsafeNestedDispositionAggregationDataPolicy,
    "fail-closed"
  );
  assert.equal(
    inventory.aggregationCheckpointResultShape.schema,
    "ardyn.phase-5.32.review-only-disposition-aggregation-checkpoint-result"
  );
  assert.equal(
    inventory.aggregationCheckpointResultShape.aggregationStateSchema,
    "ardyn.phase-5.32.review-only-disposition-aggregation-state"
  );
  assert.equal(
    inventory.aggregationCheckpointResultShape.aggregationCheckpointIsReviewerRouting,
    false
  );
  assert.equal(
    inventory.aggregationCheckpointResultShape.aggregationCheckpointIsApprovalDecision,
    false
  );
  assert.equal(inventory.aggregationCheckpointResultShape.evaluatorResultProduced, false);
  assert.equal(inventory.aggregationCheckpointResultShape.approvalDecisionProduced, false);
  assert.equal(inventory.aggregationCheckpointResultShape.evaluatorExecuted, false);
  assert.deepEqual(
    inventory.aggregationCheckpointCases.map(({ caseId }) => caseId),
    phase532ExpectedCaseIds
  );
  for (const aggregationCase of inventory.aggregationCheckpointCases) {
    assert.equal(aggregationCase.reviewOnly, true);
    assert.equal(aggregationCase.authoritative, false);
    assert.equal(aggregationCase.reviewArtifactOnly, true);
    assert.equal(aggregationCase.aggregationMetadataOnly, true);
    assert.equal(aggregationCase.aggregationCheckpointIsReviewerRouting, false);
    assert.equal(aggregationCase.aggregationCheckpointIsApprovalDecision, false);
    assert.equal(aggregationCase.aggregationCheckpointIsApprovalGrant, false);
    assert.equal(aggregationCase.reviewerRoutingPerformed, false);
    assert.equal(aggregationCase.evaluatorResultProduced, false);
    assert.equal(aggregationCase.evaluatorResultPersisted, false);
    assert.equal(aggregationCase.approvalDecisionProduced, false);
    assert.equal(aggregationCase.approvalGrant.produced, false);
    assert.equal(aggregationCase.approvalGrant.persisted, false);
    assert.equal(aggregationCase.approvalGrant.grantId, null);
    assert.equal(aggregationCase.runtimePermissionGranted, false);
    assert.equal(aggregationCase.commandExposurePermissionGranted, false);
    assert.equal(aggregationCase.evaluatorExecuted, false);
    assertAllFalse(aggregationCase.runtimeEffect);
  }
  assert.equal(
    inventory.aggregationCheckpoint.aggregationCanPerformReviewerRouting,
    false
  );
  assert.equal(
    inventory.aggregationCheckpoint.aggregationCanExecuteEvaluator,
    false
  );
  assert.equal(
    inventory.aggregationCheckpoint.aggregationCanProduceEvaluatorResult,
    false
  );
  assert.equal(
    inventory.aggregationCheckpoint.aggregationCanProduceApprovalDecision,
    false
  );
  assert.equal(
    inventory.aggregationCheckpoint.aggregationCanGrantApproval,
    false
  );
  assert.equal(
    inventory.aggregationCheckpoint.aggregationCanGrantRuntimePermission,
    false
  );
  assertAllFalse(inventory.blockedRuntimeEffect);
  assert.deepEqual(inventory.serveRuntimeBlockedBehavior.args, ["serve-runtime"]);
  assert.deepEqual(inventory.serveRuntimeBlockedBehavior.dryRunArgs, [
    "serve-runtime",
    "--dry-run"
  ]);
  assert.equal(inventory.serveRuntimeBlockedBehavior.writesFiles, false);
  assert.equal(inventory.forbiddenBehavior.reviewerRouting, false);
  assert.equal(inventory.forbiddenBehavior.evaluatorResultProduction, false);
  assert.equal(inventory.forbiddenBehavior.approvalDecisionProduction, false);
  assert.equal(inventory.forbiddenBehavior.evaluatorExecution, false);
  assert.ok(
    inventory.validationCommands.includes(
      "node --test tests/phase5-32-review-only-disposition-aggregation-checkpoint.test.mjs"
    )
  );
  assert.equal(
    report.safetyPosture.phase532ReviewOnlyDispositionAggregationCheckpoint,
    true
  );
  assertSafetyFlags(report, phase532ExpectedTrueSafetyFlagNames, true);
  assertSafetyFlags(report, phase532ExpectedFalseSafetyFlagNames, false);
});

test("report inventories Phase 5.33 as review-only aggregation inspection handoff", async () => {
  const report = await runReport();
  const inventory = report.phase533ReviewOnlyAggregationInspectionHandoffInventory;

  assert.deepEqual(
    inventory.docs.map(({ path, status }) => [path, status]),
    phase533DocFiles.map((path) => [path, "present"])
  );
  assert.deepEqual(inventory.crossLinks, phase533CrossLinks);
  assertKnownInventoryStatuses(inventory.machineReadableArtifacts);
  assert.deepEqual(inventory.machineReadableArtifacts.map(({ path }) => path), [
    "tests/fixtures/host-policy/phase5-33/review-only-aggregation-inspection-handoff.json"
  ]);
  assertKnownInventoryStatuses(inventory.tests);
  assert.deepEqual(inventory.tests.map(({ path }) => path), [
    "tests/report-phase-status.test.mjs",
    "tests/phase5-33-review-only-aggregation-inspection-handoff.test.mjs"
  ]);
  assert.equal(inventory.statusLayer.precedingPhase, "5.32");
  assert.equal(
    inventory.statusLayer.layerId,
    "review-only-aggregation-inspection-handoff"
  );
  assert.equal(
    inventory.statusLayer.validAggregationStateProducesInspectionHandoffState,
    true
  );
  assert.equal(inventory.statusLayer.handoffIsReviewerRouting, false);
  assert.equal(inventory.statusLayer.handoffIsEvaluatorExecution, false);
  assert.equal(inventory.statusLayer.handoffIsEvaluatorResult, false);
  assert.equal(inventory.statusLayer.handoffIsApprovalDecision, false);
  assert.equal(inventory.statusLayer.handoffIsApprovalGrant, false);
  assert.equal(inventory.statusLayer.reviewerRoutingPerformed, false);
  assert.equal(inventory.statusLayer.evaluatorResultProduced, false);
  assert.equal(inventory.statusLayer.evaluatorResultPersisted, false);
  assert.equal(inventory.statusLayer.approvalDecisionProduced, false);
  assert.equal(inventory.statusLayer.approvalDecisionPersisted, false);
  assert.equal(inventory.statusLayer.approvalGrantProduced, false);
  assert.equal(inventory.statusLayer.runtimePermissionGranted, false);
  assert.equal(inventory.statusLayer.commandExposurePermissionGranted, false);
  assert.equal(inventory.statusLayer.evaluatorExecutionPerformed, false);
  assert.equal(inventory.statusLayer.serveRuntimeStillDefaultBlocked, true);
  assert.deepEqual(inventory.sourcePhase, {
    phase: "phase-5.32-review-only-disposition-aggregation-checkpoint",
    aggregationCheckpointPath:
      "packages/core/src/index.mjs#createReviewOnlyDispositionAggregationCheckpointForReview",
    aggregationInspectionHandoffPath:
      "packages/core/src/index.mjs#createReviewOnlyAggregationInspectionHandoffForReview",
    sourceAggregationCheckpointFixture:
      "tests/fixtures/host-policy/phase5-32/review-only-disposition-aggregation-checkpoint.json",
    runtimeEnabled: false,
    reviewerRoutingPerformed: false,
    evaluatorResultProduced: false,
    approvalDecisionProduced: false,
    approvalGrantProduced: false,
    evaluatorExecutionPerformed: false
  });
  assert.equal(
    inventory.aggregationInspectionHandoffInputShape.aggregationStateSchema,
    "ardyn.phase-5.32.review-only-disposition-aggregation-state"
  );
  assert.equal(
    inventory.aggregationInspectionHandoffInputShape.reviewerRoutingLookingAggregationStatePolicy,
    "fail-closed"
  );
  assert.equal(
    inventory.aggregationInspectionHandoffInputShape.unsafeNestedAggregationInspectionHandoffDataPolicy,
    "fail-closed"
  );
  assert.equal(
    inventory.aggregationInspectionHandoffResultShape.schema,
    "ardyn.phase-5.33.review-only-aggregation-inspection-handoff-result"
  );
  assert.equal(
    inventory.aggregationInspectionHandoffResultShape.inspectionHandoffStateSchema,
    "ardyn.phase-5.33.review-only-aggregation-inspection-handoff-state"
  );
  assert.equal(
    inventory.aggregationInspectionHandoffResultShape.handoffIsReviewerRouting,
    false
  );
  assert.equal(
    inventory.aggregationInspectionHandoffResultShape.handoffIsEvaluatorExecution,
    false
  );
  assert.equal(
    inventory.aggregationInspectionHandoffResultShape.handoffIsEvaluatorResult,
    false
  );
  assert.equal(
    inventory.aggregationInspectionHandoffResultShape.handoffIsApprovalDecision,
    false
  );
  assert.equal(
    inventory.aggregationInspectionHandoffResultShape.handoffIsApprovalGrant,
    false
  );
  assert.equal(
    inventory.aggregationInspectionHandoffResultShape.evaluatorResultProduced,
    false
  );
  assert.equal(
    inventory.aggregationInspectionHandoffResultShape.approvalDecisionProduced,
    false
  );
  assert.equal(
    inventory.aggregationInspectionHandoffResultShape.evaluatorExecuted,
    false
  );
  assert.deepEqual(
    inventory.aggregationInspectionHandoffCases.map(({ caseId }) => caseId),
    phase533ExpectedCaseIds
  );
  for (const handoffCase of inventory.aggregationInspectionHandoffCases) {
    assert.equal(handoffCase.reviewOnly, true);
    assert.equal(handoffCase.authoritative, false);
    assert.equal(handoffCase.reviewArtifactOnly, true);
    assert.equal(handoffCase.inspectionHandoffMetadataOnly, true);
    assert.equal(handoffCase.handoffIsReviewerRouting, false);
    assert.equal(handoffCase.handoffIsEvaluatorExecution, false);
    assert.equal(handoffCase.handoffIsEvaluatorResult, false);
    assert.equal(handoffCase.handoffIsApprovalDecision, false);
    assert.equal(handoffCase.handoffIsApprovalGrant, false);
    assert.equal(handoffCase.reviewerRoutingPerformed, false);
    assert.equal(handoffCase.evaluatorResultProduced, false);
    assert.equal(handoffCase.evaluatorResultPersisted, false);
    assert.equal(handoffCase.approvalDecisionProduced, false);
    assert.equal(handoffCase.approvalGrant.produced, false);
    assert.equal(handoffCase.approvalGrant.persisted, false);
    assert.equal(handoffCase.approvalGrant.grantId, null);
    assert.equal(handoffCase.runtimePermissionGranted, false);
    assert.equal(handoffCase.commandExposurePermissionGranted, false);
    assert.equal(handoffCase.evaluatorExecuted, false);
    assertAllFalse(handoffCase.runtimeEffect);
  }
  assert.equal(
    inventory.aggregationInspectionHandoff.handoffCanPerformReviewerRouting,
    false
  );
  assert.equal(
    inventory.aggregationInspectionHandoff.handoffCanExecuteEvaluator,
    false
  );
  assert.equal(
    inventory.aggregationInspectionHandoff.handoffCanProduceEvaluatorResult,
    false
  );
  assert.equal(
    inventory.aggregationInspectionHandoff.handoffCanProduceApprovalDecision,
    false
  );
  assert.equal(
    inventory.aggregationInspectionHandoff.handoffCanGrantApproval,
    false
  );
  assert.equal(
    inventory.aggregationInspectionHandoff.handoffCanGrantRuntimePermission,
    false
  );
  assertAllFalse(inventory.blockedRuntimeEffect);
  assert.deepEqual(inventory.serveRuntimeBlockedBehavior.args, ["serve-runtime"]);
  assert.deepEqual(inventory.serveRuntimeBlockedBehavior.dryRunArgs, [
    "serve-runtime",
    "--dry-run"
  ]);
  assert.equal(inventory.serveRuntimeBlockedBehavior.writesFiles, false);
  assert.equal(inventory.forbiddenBehavior.reviewerRoutingPerformed, false);
  assert.equal(inventory.forbiddenBehavior.evaluatorResultProduced, false);
  assert.equal(inventory.forbiddenBehavior.approvalDecisionProduced, false);
  assert.equal(inventory.forbiddenBehavior.evaluatorExecutionPerformed, false);
  assert.ok(
    inventory.validationCommands.includes(
      "node --test tests/phase5-33-review-only-aggregation-inspection-handoff.test.mjs"
    )
  );
  assert.equal(
    report.safetyPosture.phase533ReviewOnlyAggregationInspectionHandoff,
    true
  );
  assertSafetyFlags(report, phase533ExpectedTrueSafetyFlagNames, true);
  assertSafetyFlags(report, phase533ExpectedFalseSafetyFlagNames, false);
});

test("report inventories Phase 5.34 as review-only handoff readiness artifact", async () => {
  const report = await runReport();
  const inventory = report.phase534ReviewOnlyHandoffReadinessArtifactInventory;

  assert.deepEqual(
    inventory.docs.map(({ path, status }) => [path, status]),
    phase534DocFiles.map((path) => [path, "present"])
  );
  assert.deepEqual(inventory.crossLinks, phase534CrossLinks);
  assertKnownInventoryStatuses(inventory.machineReadableArtifacts);
  assert.deepEqual(inventory.machineReadableArtifacts.map(({ path }) => path), [
    "tests/fixtures/host-policy/phase5-34/review-only-handoff-readiness-artifact.json"
  ]);
  assertKnownInventoryStatuses(inventory.tests);
  assert.deepEqual(inventory.tests.map(({ path }) => path), [
    "tests/report-phase-status.test.mjs",
    "tests/phase5-34-review-only-handoff-readiness-artifact.test.mjs"
  ]);
  assert.equal(inventory.statusLayer.precedingPhase, "5.33");
  assert.equal(
    inventory.statusLayer.layerId,
    "review-only-handoff-readiness-artifact"
  );
  assert.equal(
    inventory.statusLayer.validHandoffStateProducesReadinessArtifact,
    true
  );
  assert.equal(inventory.statusLayer.readinessArtifactIsReviewerRouting, false);
  assert.equal(inventory.statusLayer.readinessArtifactIsReviewerAssignment, false);
  assert.equal(inventory.statusLayer.readinessArtifactIsEvaluatorExecution, false);
  assert.equal(inventory.statusLayer.readinessArtifactIsEvaluatorResult, false);
  assert.equal(inventory.statusLayer.readinessArtifactIsApprovalDecision, false);
  assert.equal(inventory.statusLayer.readinessArtifactIsApprovalGrant, false);
  assert.equal(inventory.statusLayer.reviewerRoutingPerformed, false);
  assert.equal(inventory.statusLayer.reviewerAssignmentPerformed, false);
  assert.equal(inventory.statusLayer.evaluatorResultProduced, false);
  assert.equal(inventory.statusLayer.evaluatorResultPersisted, false);
  assert.equal(inventory.statusLayer.approvalDecisionProduced, false);
  assert.equal(inventory.statusLayer.approvalDecisionPersisted, false);
  assert.equal(inventory.statusLayer.approvalGrantProduced, false);
  assert.equal(inventory.statusLayer.runtimePermissionGranted, false);
  assert.equal(inventory.statusLayer.commandExposurePermissionGranted, false);
  assert.equal(inventory.statusLayer.evaluatorExecutionPerformed, false);
  assert.equal(inventory.statusLayer.serveRuntimeStillDefaultBlocked, true);
  assert.deepEqual(inventory.sourcePhase, {
    phase: "phase-5.33-review-only-aggregation-inspection-handoff",
    aggregationInspectionHandoffPath:
      "packages/core/src/index.mjs#createReviewOnlyAggregationInspectionHandoffForReview",
    handoffReadinessArtifactPath:
      "packages/core/src/index.mjs#createReviewOnlyHandoffReadinessArtifactForReview",
    sourceHandoffFixture:
      "tests/fixtures/host-policy/phase5-33/review-only-aggregation-inspection-handoff.json",
    runtimeEnabled: false,
    reviewerRoutingPerformed: false,
    reviewerAssignmentPerformed: false,
    evaluatorExecutionPerformed: false,
    evaluatorResultProduced: false,
    approvalDecisionProduced: false,
    approvalGrantProduced: false
  });
  assert.equal(
    inventory.handoffReadinessArtifactInputShape.handoffStateSchema,
    "ardyn.phase-5.33.review-only-aggregation-inspection-handoff-state"
  );
  assert.equal(
    inventory.handoffReadinessArtifactInputShape.reviewerRoutingLookingHandoffStatePolicy,
    "fail-closed"
  );
  assert.equal(
    inventory.handoffReadinessArtifactInputShape.reviewerAssignmentLookingHandoffStatePolicy,
    "fail-closed"
  );
  assert.equal(
    inventory.handoffReadinessArtifactInputShape.unsafeNestedHandoffReadinessArtifactDataPolicy,
    "fail-closed"
  );
  assert.equal(
    inventory.handoffReadinessArtifactResultShape.schema,
    "ardyn.phase-5.34.review-only-handoff-readiness-artifact-result"
  );
  assert.equal(
    inventory.handoffReadinessArtifactResultShape.readinessArtifactStateSchema,
    "ardyn.phase-5.34.review-only-handoff-readiness-artifact-state"
  );
  assert.equal(
    inventory.handoffReadinessArtifactResultShape.readinessArtifactIsReviewerRouting,
    false
  );
  assert.equal(
    inventory.handoffReadinessArtifactResultShape.readinessArtifactIsReviewerAssignment,
    false
  );
  assert.equal(
    inventory.handoffReadinessArtifactResultShape.readinessArtifactIsEvaluatorExecution,
    false
  );
  assert.equal(
    inventory.handoffReadinessArtifactResultShape.readinessArtifactIsEvaluatorResult,
    false
  );
  assert.equal(
    inventory.handoffReadinessArtifactResultShape.readinessArtifactIsApprovalDecision,
    false
  );
  assert.equal(
    inventory.handoffReadinessArtifactResultShape.readinessArtifactIsApprovalGrant,
    false
  );
  assert.equal(
    inventory.handoffReadinessArtifactResultShape.evaluatorResultProduced,
    false
  );
  assert.equal(
    inventory.handoffReadinessArtifactResultShape.approvalDecisionProduced,
    false
  );
  assert.equal(
    inventory.handoffReadinessArtifactResultShape.evaluatorExecuted,
    false
  );
  assert.deepEqual(
    inventory.handoffReadinessArtifactCases.map(({ caseId }) => caseId),
    phase534ExpectedCaseIds
  );
  for (const artifactCase of inventory.handoffReadinessArtifactCases) {
    assert.equal(artifactCase.reviewOnly, true);
    assert.equal(artifactCase.authoritative, false);
    assert.equal(artifactCase.reviewArtifactOnly, true);
    assert.equal(artifactCase.readinessArtifactMetadataOnly, true);
    assert.equal(artifactCase.readinessArtifactIsReviewerRouting, false);
    assert.equal(artifactCase.readinessArtifactIsReviewerAssignment, false);
    assert.equal(artifactCase.readinessArtifactIsEvaluatorExecution, false);
    assert.equal(artifactCase.readinessArtifactIsEvaluatorResult, false);
    assert.equal(artifactCase.readinessArtifactIsApprovalDecision, false);
    assert.equal(artifactCase.readinessArtifactIsApprovalGrant, false);
    assert.equal(artifactCase.reviewerRoutingPerformed, false);
    assert.equal(artifactCase.reviewerAssignmentPerformed, false);
    assert.equal(artifactCase.evaluatorResultProduced, false);
    assert.equal(artifactCase.evaluatorResultPersisted, false);
    assert.equal(artifactCase.approvalDecisionProduced, false);
    assert.equal(artifactCase.approvalGrant.produced, false);
    assert.equal(artifactCase.approvalGrant.persisted, false);
    assert.equal(artifactCase.approvalGrant.grantId, null);
    assert.equal(artifactCase.runtimePermissionGranted, false);
    assert.equal(artifactCase.commandExposurePermissionGranted, false);
    assert.equal(artifactCase.evaluatorExecuted, false);
    assertAllFalse(artifactCase.runtimeEffect);
  }
  assert.equal(
    inventory.handoffReadinessArtifact.artifactCanPerformReviewerRouting,
    false
  );
  assert.equal(
    inventory.handoffReadinessArtifact.artifactCanAssignReviewers,
    false
  );
  assert.equal(
    inventory.handoffReadinessArtifact.artifactCanExecuteEvaluator,
    false
  );
  assert.equal(
    inventory.handoffReadinessArtifact.artifactCanProduceEvaluatorResult,
    false
  );
  assert.equal(
    inventory.handoffReadinessArtifact.artifactCanProduceApprovalDecision,
    false
  );
  assert.equal(
    inventory.handoffReadinessArtifact.artifactCanGrantApproval,
    false
  );
  assert.equal(
    inventory.handoffReadinessArtifact.artifactCanGrantRuntimePermission,
    false
  );
  assertAllFalse(inventory.blockedRuntimeEffect);
  assert.deepEqual(inventory.serveRuntimeBlockedBehavior.args, ["serve-runtime"]);
  assert.deepEqual(inventory.serveRuntimeBlockedBehavior.dryRunArgs, [
    "serve-runtime",
    "--dry-run"
  ]);
  assert.equal(inventory.serveRuntimeBlockedBehavior.writesFiles, false);
  assert.equal(inventory.forbiddenBehavior.reviewerRouting, false);
  assert.equal(inventory.forbiddenBehavior.reviewerAssignment, false);
  assert.equal(inventory.forbiddenBehavior.evaluatorResult, false);
  assert.equal(inventory.forbiddenBehavior.approvalDecision, false);
  assert.equal(inventory.forbiddenBehavior.evaluatorExecution, false);
  assert.ok(
    inventory.validationCommands.includes(
      "node --test tests/phase5-34-review-only-handoff-readiness-artifact.test.mjs"
    )
  );
  assert.equal(
    report.safetyPosture.phase534ReviewOnlyHandoffReadinessArtifact,
    true
  );
  assertSafetyFlags(report, phase534ExpectedTrueSafetyFlagNames, true);
  assertSafetyFlags(report, phase534ExpectedFalseSafetyFlagNames, false);
});

test("report inventories Phase 5.35 as review-only readiness inspection checkpoint", async () => {
  const report = await runReport();
  const inventory = report.phase535ReviewOnlyReadinessInspectionCheckpointInventory;

  assert.deepEqual(
    inventory.docs.map(({ path, status }) => [path, status]),
    phase535DocFiles.map((path) => [path, "present"])
  );
  assert.deepEqual(inventory.crossLinks, phase535CrossLinks);
  assertKnownInventoryStatuses(inventory.machineReadableArtifacts);
  assert.deepEqual(inventory.machineReadableArtifacts.map(({ path }) => path), [
    "tests/fixtures/host-policy/phase5-35/review-only-readiness-inspection-checkpoint.json"
  ]);
  assertKnownInventoryStatuses(inventory.tests);
  assert.deepEqual(inventory.tests.map(({ path }) => path), [
    "tests/report-phase-status.test.mjs",
    "tests/phase5-35-review-only-readiness-inspection-checkpoint.test.mjs"
  ]);
  assert.equal(inventory.statusLayer.precedingPhase, "5.34");
  assert.equal(
    inventory.statusLayer.layerId,
    "review-only-readiness-inspection-checkpoint"
  );
  assert.equal(
    inventory.statusLayer.validReadinessArtifactProducesInspectionCheckpoint,
    true
  );
  assert.equal(
    inventory.statusLayer.readinessInspectionCheckpointIsReviewerRouting,
    false
  );
  assert.equal(
    inventory.statusLayer.readinessInspectionCheckpointIsReviewerAssignment,
    false
  );
  assert.equal(
    inventory.statusLayer.readinessInspectionCheckpointIsEvaluatorExecution,
    false
  );
  assert.equal(
    inventory.statusLayer.readinessInspectionCheckpointIsEvaluatorResult,
    false
  );
  assert.equal(
    inventory.statusLayer.readinessInspectionCheckpointIsApprovalDecision,
    false
  );
  assert.equal(
    inventory.statusLayer.readinessInspectionCheckpointIsApprovalGrant,
    false
  );
  assert.equal(inventory.statusLayer.reviewerRoutingPerformed, false);
  assert.equal(inventory.statusLayer.reviewerAssignmentPerformed, false);
  assert.equal(inventory.statusLayer.evaluatorResultProduced, false);
  assert.equal(inventory.statusLayer.evaluatorResultPersisted, false);
  assert.equal(inventory.statusLayer.approvalDecisionProduced, false);
  assert.equal(inventory.statusLayer.approvalDecisionPersisted, false);
  assert.equal(inventory.statusLayer.approvalGrantProduced, false);
  assert.equal(inventory.statusLayer.approvalGrantPersisted, false);
  assert.equal(inventory.statusLayer.runtimePermissionGranted, false);
  assert.equal(inventory.statusLayer.commandExposurePermissionGranted, false);
  assert.equal(inventory.statusLayer.evaluatorExecutionPerformed, false);
  assert.equal(inventory.statusLayer.serveRuntimeStillDefaultBlocked, true);
  assert.deepEqual(inventory.sourcePhase, {
    phase: "phase-5.34-review-only-handoff-readiness-artifact",
    artifactKind: "review-only-handoff-readiness-artifact",
    fixture:
      "tests/fixtures/host-policy/phase5-34/review-only-handoff-readiness-artifact.json"
  });
  assert.equal(
    inventory.readinessInspectionCheckpointInputShape.readinessArtifacts,
    "exactly one Phase 5.34 review-only handoff readiness artifact state"
  );
  assert.equal(
    inventory.readinessInspectionCheckpointResultShape.schema,
    "ardyn.phase-5.35.review-only-readiness-inspection-checkpoint-result"
  );
  assert.equal(
    inventory.readinessInspectionCheckpointResultShape.stateSchema,
    "ardyn.phase-5.35.review-only-readiness-inspection-checkpoint-state"
  );
  assert.equal(
    inventory.readinessInspectionCheckpointResultShape.producesApprovalDecision,
    false
  );
  assert.equal(
    inventory.readinessInspectionCheckpointResultShape.producesApprovalGrant,
    false
  );
  assert.equal(
    inventory.readinessInspectionCheckpointResultShape.executesEvaluator,
    false
  );
  assert.deepEqual(
    inventory.readinessInspectionCheckpointCases.map(({ caseId }) => caseId),
    phase535ExpectedCaseIds
  );
  for (const artifactCase of inventory.readinessInspectionCheckpointCases) {
    assert.equal(artifactCase.reviewOnly, true);
    assert.equal(artifactCase.authoritative, false);
    assert.equal(artifactCase.reviewArtifactOnly, true);
    assert.equal(artifactCase.readinessInspectionCheckpointMetadataOnly, true);
    assert.equal(artifactCase.readinessInspectionCheckpointIsReviewerRouting, false);
    assert.equal(
      artifactCase.readinessInspectionCheckpointIsReviewerAssignment,
      false
    );
    assert.equal(
      artifactCase.readinessInspectionCheckpointIsEvaluatorExecution,
      false
    );
    assert.equal(artifactCase.readinessInspectionCheckpointIsEvaluatorResult, false);
    assert.equal(
      artifactCase.readinessInspectionCheckpointIsApprovalDecision,
      false
    );
    assert.equal(artifactCase.readinessInspectionCheckpointIsApprovalGrant, false);
    assert.equal(artifactCase.reviewerRoutingPerformed, false);
    assert.equal(artifactCase.reviewerAssignmentPerformed, false);
    assert.equal(artifactCase.evaluatorResultProduced, false);
    assert.equal(artifactCase.evaluatorResultPersisted, false);
    assert.equal(artifactCase.approvalDecisionProduced, false);
    assert.equal(artifactCase.approvalGrant.produced, false);
    assert.equal(artifactCase.approvalGrant.persisted, false);
    assert.equal(artifactCase.approvalGrant.grantId, null);
    assert.equal(artifactCase.runtimePermissionGranted, false);
    assert.equal(artifactCase.commandExposurePermissionGranted, false);
    assert.equal(artifactCase.evaluatorExecuted, false);
    assertAllFalse(artifactCase.runtimeEffect);
  }
  assert.equal(
    inventory.readinessInspectionCheckpoint.artifactCanPerformReviewerRouting,
    false
  );
  assert.equal(
    inventory.readinessInspectionCheckpoint.artifactCanAssignReviewers,
    false
  );
  assert.equal(
    inventory.readinessInspectionCheckpoint.artifactCanExecuteEvaluator,
    false
  );
  assert.equal(
    inventory.readinessInspectionCheckpoint.artifactCanProduceEvaluatorResult,
    false
  );
  assert.equal(
    inventory.readinessInspectionCheckpoint.artifactCanProduceApprovalDecision,
    false
  );
  assert.equal(
    inventory.readinessInspectionCheckpoint.artifactCanGrantApproval,
    false
  );
  assert.equal(
    inventory.readinessInspectionCheckpoint.artifactCanGrantRuntimePermission,
    false
  );
  assertAllFalse(inventory.blockedRuntimeEffect);
  assert.deepEqual(inventory.serveRuntimeBlockedBehavior.args, ["serve-runtime"]);
  assert.deepEqual(inventory.serveRuntimeBlockedBehavior.dryRunArgs, [
    "serve-runtime",
    "--dry-run"
  ]);
  assert.equal(inventory.serveRuntimeBlockedBehavior.writesFiles, false);
  assert.equal(inventory.forbiddenBehavior.reviewerRouting, false);
  assert.equal(inventory.forbiddenBehavior.reviewerAssignment, false);
  assert.equal(inventory.forbiddenBehavior.evaluatorResult, false);
  assert.equal(inventory.forbiddenBehavior.approvalDecision, false);
  assert.equal(inventory.forbiddenBehavior.evaluatorExecution, false);
  assert.ok(
    inventory.validationCommands.includes(
      "node --test tests/phase5-35-review-only-readiness-inspection-checkpoint.test.mjs"
    )
  );
  assert.equal(
    report.safetyPosture.phase535ReviewOnlyReadinessInspectionCheckpoint,
    true
  );
  assertSafetyFlags(report, phase535ExpectedTrueSafetyFlagNames, true);
  assertSafetyFlags(report, phase535ExpectedFalseSafetyFlagNames, false);
});

test("report inventories Phase 5.36 as review-only readiness handoff disposition boundary", async () => {
  const report = await runReport();
  const inventory =
    report.phase536ReviewOnlyReadinessHandoffDispositionBoundaryInventory;

  assert.deepEqual(
    inventory.docs.map(({ path, status }) => [path, status]),
    phase536DocFiles.map((path) => [path, "present"])
  );
  assert.deepEqual(inventory.crossLinks, phase536CrossLinks);
  assertKnownInventoryStatuses(inventory.machineReadableArtifacts);
  assert.deepEqual(inventory.machineReadableArtifacts.map(({ path }) => path), [
    "tests/fixtures/host-policy/phase5-36/review-only-readiness-handoff-disposition-boundary.json"
  ]);
  assertKnownInventoryStatuses(inventory.tests);
  assert.deepEqual(inventory.tests.map(({ path }) => path), [
    "tests/report-phase-status.test.mjs",
    "tests/phase5-36-review-only-readiness-handoff-disposition-boundary.test.mjs"
  ]);
  assert.equal(inventory.statusLayer.precedingPhase, "5.35");
  assert.equal(
    inventory.statusLayer.layerId,
    "review-only-readiness-handoff-disposition-boundary"
  );
  assert.equal(
    inventory.statusLayer.validReadinessInspectionCheckpointProducesHandoffDisposition,
    true
  );
  assert.equal(
    inventory.statusLayer.readinessHandoffDispositionIsReviewerRouting,
    false
  );
  assert.equal(
    inventory.statusLayer.readinessHandoffDispositionIsReviewerAssignment,
    false
  );
  assert.equal(
    inventory.statusLayer.readinessHandoffDispositionIsEvaluatorExecution,
    false
  );
  assert.equal(
    inventory.statusLayer.readinessHandoffDispositionIsEvaluatorResult,
    false
  );
  assert.equal(
    inventory.statusLayer.readinessHandoffDispositionIsApprovalDecision,
    false
  );
  assert.equal(
    inventory.statusLayer.readinessHandoffDispositionIsApprovalGrant,
    false
  );
  assert.equal(inventory.statusLayer.reviewerRoutingPerformed, false);
  assert.equal(inventory.statusLayer.reviewerAssignmentPerformed, false);
  assert.equal(inventory.statusLayer.evaluatorResultProduced, false);
  assert.equal(inventory.statusLayer.evaluatorResultPersisted, false);
  assert.equal(inventory.statusLayer.approvalDecisionProduced, false);
  assert.equal(inventory.statusLayer.approvalDecisionPersisted, false);
  assert.equal(inventory.statusLayer.approvalGrantProduced, false);
  assert.equal(inventory.statusLayer.approvalGrantPersisted, false);
  assert.equal(inventory.statusLayer.runtimePermissionGranted, false);
  assert.equal(inventory.statusLayer.commandExposurePermissionGranted, false);
  assert.equal(inventory.statusLayer.evaluatorExecutionPerformed, false);
  assert.equal(inventory.statusLayer.serveRuntimeStillDefaultBlocked, true);
  assert.deepEqual(inventory.sourcePhase, {
    phase: "phase-5.35-review-only-readiness-inspection-checkpoint",
    artifactKind: "review-only-readiness-inspection-checkpoint",
    fixture:
      "tests/fixtures/host-policy/phase5-35/review-only-readiness-inspection-checkpoint.json"
  });
  assert.equal(
    inventory.readinessHandoffDispositionInputShape.readinessInspectionCheckpoints,
    "exactly one Phase 5.35 review-only readiness inspection checkpoint state"
  );
  assert.equal(
    inventory.readinessHandoffDispositionResultShape.schema,
    "ardyn.phase-5.36.review-only-readiness-handoff-disposition-boundary-result"
  );
  assert.equal(
    inventory.readinessHandoffDispositionResultShape.stateSchema,
    "ardyn.phase-5.36.review-only-readiness-handoff-disposition-state"
  );
  assert.equal(
    inventory.readinessHandoffDispositionResultShape.producesApprovalDecision,
    false
  );
  assert.equal(
    inventory.readinessHandoffDispositionResultShape.producesApprovalGrant,
    false
  );
  assert.equal(
    inventory.readinessHandoffDispositionResultShape.executesEvaluator,
    false
  );
  assert.deepEqual(
    inventory.readinessHandoffDispositionCases.map(({ caseId }) => caseId),
    phase536ExpectedCaseIds
  );
  for (const dispositionCase of inventory.readinessHandoffDispositionCases) {
    assert.equal(dispositionCase.reviewOnly, true);
    assert.equal(dispositionCase.authoritative, false);
    assert.equal(dispositionCase.reviewArtifactOnly, true);
    assert.equal(dispositionCase.readinessHandoffDispositionIsReviewerRouting, false);
    assert.equal(
      dispositionCase.readinessHandoffDispositionIsReviewerAssignment,
      false
    );
    assert.equal(
      dispositionCase.readinessHandoffDispositionIsEvaluatorExecution,
      false
    );
    assert.equal(dispositionCase.readinessHandoffDispositionIsEvaluatorResult, false);
    assert.equal(
      dispositionCase.readinessHandoffDispositionIsApprovalDecision,
      false
    );
    assert.equal(dispositionCase.readinessHandoffDispositionIsApprovalGrant, false);
    assert.equal(dispositionCase.reviewerRoutingPerformed, false);
    assert.equal(dispositionCase.reviewerAssignmentPerformed, false);
    assert.equal(dispositionCase.evaluatorResultProduced, false);
    assert.equal(dispositionCase.approvalDecisionProduced, false);
    assert.equal(dispositionCase.approvalGrant.produced, false);
    assert.equal(dispositionCase.approvalGrant.persisted, false);
    assert.equal(dispositionCase.approvalGrant.grantId, null);
    assert.equal(dispositionCase.runtimePermissionGranted, false);
    assert.equal(dispositionCase.commandExposurePermissionGranted, false);
    assert.equal(dispositionCase.evaluatorExecuted, false);
    assertAllFalse(dispositionCase.runtimeEffect);
  }
  assert.equal(
    inventory.readinessHandoffDisposition.readinessHandoffDispositionMetadataOnly,
    true
  );
  assert.equal(
    inventory.readinessHandoffDisposition.readinessHandoffDispositionIsReviewerRouting,
    false
  );
  assert.equal(
    inventory.readinessHandoffDisposition.readinessHandoffDispositionIsReviewerAssignment,
    false
  );
  assert.equal(
    inventory.readinessHandoffDisposition.readinessHandoffDispositionIsEvaluatorExecution,
    false
  );
  assert.equal(
    inventory.readinessHandoffDisposition.readinessHandoffDispositionIsEvaluatorResult,
    false
  );
  assert.equal(
    inventory.readinessHandoffDisposition.readinessHandoffDispositionIsApprovalDecision,
    false
  );
  assert.equal(
    inventory.readinessHandoffDisposition.readinessHandoffDispositionIsApprovalGrant,
    false
  );
  assertAllFalse(inventory.blockedRuntimeEffect);
  assert.equal(
    inventory.serveRuntimeBlockedBehavior.serveRuntimeDefaultBlocked,
    true
  );
  assert.equal(inventory.serveRuntimeBlockedBehavior.dryRunBypassesBlock, false);
  assert.equal(inventory.serveRuntimeBlockedBehavior.runtimeEnabled, false);
  assert.equal(
    inventory.serveRuntimeBlockedBehavior.runtimeCommandExposureEnabled,
    false
  );
  assert.equal(
    inventory.serveRuntimeBlockedBehavior.runtimeExecutionEnabled,
    false
  );
  assert.equal(inventory.forbiddenBehavior.reviewerRoutingPerformed, false);
  assert.equal(inventory.forbiddenBehavior.reviewerAssignmentPerformed, false);
  assert.equal(inventory.forbiddenBehavior.evaluatorExecuted, false);
  assert.equal(inventory.forbiddenBehavior.evaluatorResultProduced, false);
  assert.equal(inventory.forbiddenBehavior.approvalDecisionProduced, false);
  assert.equal(inventory.forbiddenBehavior.approvalGrantProduced, false);
  assert.equal(inventory.forbiddenBehavior.approvalGrantPersisted, false);
  assert.ok(
    inventory.validationCommands.includes(
      "node --test tests/phase5-36-review-only-readiness-handoff-disposition-boundary.test.mjs"
    )
  );
  assert.equal(
    report.safetyPosture.phase536ReviewOnlyReadinessHandoffDispositionBoundary,
    true
  );
  assertSafetyFlags(report, phase536ExpectedTrueSafetyFlagNames, true);
  assertSafetyFlags(report, phase536ExpectedFalseSafetyFlagNames, false);
});

test("report inventories Phase 5.37 as review-only handoff disposition inspection checkpoint", async () => {
  const report = await runReport();
  const inventory =
    report.phase537ReviewOnlyHandoffDispositionInspectionCheckpointInventory;

  assert.deepEqual(
    inventory.docs.map(({ path, status }) => [path, status]),
    phase537DocFiles.map((path) => [path, "present"])
  );
  assert.deepEqual(inventory.crossLinks, phase537CrossLinks);
  assertKnownInventoryStatuses(inventory.machineReadableArtifacts);
  assert.deepEqual(inventory.machineReadableArtifacts.map(({ path }) => path), [
    "tests/fixtures/host-policy/phase5-37/review-only-handoff-disposition-inspection-checkpoint.json"
  ]);
  assertKnownInventoryStatuses(inventory.tests);
  assert.deepEqual(inventory.tests.map(({ path }) => path), [
    "tests/report-phase-status.test.mjs",
    "tests/phase5-37-review-only-handoff-disposition-inspection-checkpoint.test.mjs"
  ]);
  assert.equal(inventory.statusLayer.precedingPhase, "5.36");
  assert.equal(
    inventory.statusLayer.layerId,
    "review-only-handoff-disposition-inspection-checkpoint"
  );
  assert.equal(
    inventory.statusLayer.validReadinessHandoffDispositionProducesInspectionCheckpoint,
    true
  );
  assert.equal(
    inventory.statusLayer.handoffDispositionInspectionCheckpointIsReviewerRouting,
    false
  );
  assert.equal(
    inventory.statusLayer.handoffDispositionInspectionCheckpointIsReviewerAssignment,
    false
  );
  assert.equal(
    inventory.statusLayer.handoffDispositionInspectionCheckpointIsEvaluatorExecution,
    false
  );
  assert.equal(
    inventory.statusLayer.handoffDispositionInspectionCheckpointIsEvaluatorResult,
    false
  );
  assert.equal(
    inventory.statusLayer.handoffDispositionInspectionCheckpointIsApprovalDecision,
    false
  );
  assert.equal(
    inventory.statusLayer.handoffDispositionInspectionCheckpointIsApprovalGrant,
    false
  );
  assert.equal(inventory.statusLayer.reviewerRoutingPerformed, false);
  assert.equal(inventory.statusLayer.reviewerAssignmentPerformed, false);
  assert.equal(inventory.statusLayer.evaluatorResultProduced, false);
  assert.equal(inventory.statusLayer.evaluatorResultPersisted, false);
  assert.equal(inventory.statusLayer.approvalDecisionProduced, false);
  assert.equal(inventory.statusLayer.approvalDecisionPersisted, false);
  assert.equal(inventory.statusLayer.approvalGrantProduced, false);
  assert.equal(inventory.statusLayer.approvalGrantPersisted, false);
  assert.equal(inventory.statusLayer.runtimePermissionGranted, false);
  assert.equal(inventory.statusLayer.commandExposurePermissionGranted, false);
  assert.equal(inventory.statusLayer.evaluatorExecutionPerformed, false);
  assert.equal(inventory.statusLayer.serveRuntimeStillDefaultBlocked, true);
  assert.deepEqual(inventory.sourcePhase, {
    phase: "phase-5.36-review-only-readiness-handoff-disposition-boundary",
    readinessHandoffDispositionPath:
      "packages/core/src/index.mjs#createReviewOnlyReadinessHandoffDispositionBoundaryForReview",
    handoffDispositionInspectionCheckpointPath:
      "packages/core/src/index.mjs#createReviewOnlyHandoffDispositionInspectionCheckpointForReview",
    sourceReadinessHandoffDispositionFixture:
      "tests/fixtures/host-policy/phase5-36/review-only-readiness-handoff-disposition-boundary.json",
    runtimeEnabled: false,
    reviewerRoutingPerformed: false,
    reviewerAssignmentPerformed: false,
    approvalDecisionProduced: false,
    approvalGrantProduced: false,
    evaluatorExecutionPerformed: false
  });
  assert.equal(
    inventory.handoffDispositionInspectionCheckpointInputShape
      .readinessHandoffDispositions,
    "exactly one Phase 5.36 review-only readiness handoff/disposition state"
  );
  assert.equal(
    inventory.handoffDispositionInspectionCheckpointResultShape.schema,
    "ardyn.phase-5.37.review-only-handoff-disposition-inspection-checkpoint-result"
  );
  assert.equal(
    inventory.handoffDispositionInspectionCheckpointResultShape.stateSchema,
    "ardyn.phase-5.37.review-only-handoff-disposition-inspection-checkpoint-state"
  );
  assert.equal(
    inventory.handoffDispositionInspectionCheckpointResultShape.performsReviewerRouting,
    false
  );
  assert.equal(
    inventory.handoffDispositionInspectionCheckpointResultShape.assignsReviewers,
    false
  );
  assert.equal(
    inventory.handoffDispositionInspectionCheckpointResultShape.executesEvaluator,
    false
  );
  assert.equal(
    inventory.handoffDispositionInspectionCheckpointResultShape.producesEvaluatorResult,
    false
  );
  assert.equal(
    inventory.handoffDispositionInspectionCheckpointResultShape.producesApprovalDecision,
    false
  );
  assert.equal(
    inventory.handoffDispositionInspectionCheckpointResultShape.producesApprovalGrant,
    false
  );
  assert.deepEqual(
    inventory.handoffDispositionInspectionCheckpointCases.map(({ caseId }) => caseId),
    phase537ExpectedCaseIds
  );
  for (const checkpointCase of inventory.handoffDispositionInspectionCheckpointCases) {
    assert.equal(checkpointCase.reviewOnly, true);
    assert.equal(checkpointCase.authoritative, false);
    assert.equal(checkpointCase.reviewArtifactOnly, true);
    assert.equal(
      checkpointCase.handoffDispositionInspectionCheckpointIsReviewerRouting,
      false
    );
    assert.equal(
      checkpointCase.handoffDispositionInspectionCheckpointIsReviewerAssignment,
      false
    );
    assert.equal(
      checkpointCase.handoffDispositionInspectionCheckpointIsEvaluatorExecution,
      false
    );
    assert.equal(
      checkpointCase.handoffDispositionInspectionCheckpointIsEvaluatorResult,
      false
    );
    assert.equal(
      checkpointCase.handoffDispositionInspectionCheckpointIsApprovalDecision,
      false
    );
    assert.equal(
      checkpointCase.handoffDispositionInspectionCheckpointIsApprovalGrant,
      false
    );
    assert.equal(checkpointCase.reviewerRoutingPerformed, false);
    assert.equal(checkpointCase.reviewerAssignmentPerformed, false);
    assert.equal(checkpointCase.evaluatorResultProduced, false);
    assert.equal(checkpointCase.evaluatorResultPersisted, false);
    assert.equal(checkpointCase.approvalDecisionProduced, false);
    assert.equal(checkpointCase.approvalDecisionPersisted, false);
    assert.equal(checkpointCase.approvalGrant.produced, false);
    assert.equal(checkpointCase.approvalGrant.persisted, false);
    assert.equal(checkpointCase.approvalGrant.grantId, null);
    assert.equal(checkpointCase.runtimePermissionGranted, false);
    assert.equal(checkpointCase.commandExposurePermissionGranted, false);
    assert.equal(checkpointCase.runtimeCommandExposureEnabled, false);
    assert.equal(checkpointCase.runtimeExecutionEnabled, false);
    assert.equal(checkpointCase.evaluatorExecuted, false);
    assertAllFalse(checkpointCase.runtimeEffect);
  }
  assert.equal(
    inventory.handoffDispositionInspectionCheckpoint
      .handoffDispositionInspectionCheckpointMetadataOnly,
    true
  );
  assert.equal(
    inventory.handoffDispositionInspectionCheckpoint
      .handoffDispositionInspectionCheckpointIsReviewerRouting,
    false
  );
  assert.equal(
    inventory.handoffDispositionInspectionCheckpoint
      .handoffDispositionInspectionCheckpointIsReviewerAssignment,
    false
  );
  assert.equal(
    inventory.handoffDispositionInspectionCheckpoint
      .handoffDispositionInspectionCheckpointIsEvaluatorExecution,
    false
  );
  assert.equal(
    inventory.handoffDispositionInspectionCheckpoint
      .handoffDispositionInspectionCheckpointIsEvaluatorResult,
    false
  );
  assert.equal(
    inventory.handoffDispositionInspectionCheckpoint
      .handoffDispositionInspectionCheckpointIsApprovalDecision,
    false
  );
  assert.equal(
    inventory.handoffDispositionInspectionCheckpoint
      .handoffDispositionInspectionCheckpointIsApprovalGrant,
    false
  );
  assert.equal(inventory.handoffDispositionInspectionCheckpoint.reviewerRoutingPerformed, false);
  assert.equal(inventory.handoffDispositionInspectionCheckpoint.reviewerAssignmentPerformed, false);
  assert.equal(inventory.handoffDispositionInspectionCheckpoint.evaluatorExecuted, false);
  assert.equal(inventory.handoffDispositionInspectionCheckpoint.evaluatorResultProduced, false);
  assert.equal(inventory.handoffDispositionInspectionCheckpoint.approvalDecisionProduced, false);
  assert.equal(inventory.handoffDispositionInspectionCheckpoint.approvalGrantProduced, false);
  assert.equal(inventory.handoffDispositionInspectionCheckpoint.approvalGrantPersisted, false);
  assertAllFalse(inventory.blockedRuntimeEffect);
  assert.equal(inventory.serveRuntimeBlockedBehavior.defaultBlocked, true);
  assert.equal(inventory.serveRuntimeBlockedBehavior.dryRunBlocked, true);
  assert.equal(inventory.serveRuntimeBlockedBehavior.dryRunBypassesBlock, false);
  assert.equal(inventory.serveRuntimeBlockedBehavior.stdout, "");
  assert.equal(inventory.forbiddenBehavior.reviewerRoutingPerformed, false);
  assert.equal(inventory.forbiddenBehavior.reviewerAssignmentPerformed, false);
  assert.equal(inventory.forbiddenBehavior.evaluatorExecutionPerformed, false);
  assert.equal(inventory.forbiddenBehavior.evaluatorResultProduced, false);
  assert.equal(inventory.forbiddenBehavior.approvalDecisionProduced, false);
  assert.equal(inventory.forbiddenBehavior.approvalGrantProduced, false);
  assert.equal(inventory.forbiddenBehavior.approvalGrantPersisted, false);
  assert.ok(
    inventory.validationCommands.includes(
      "node --test tests/phase5-37-review-only-handoff-disposition-inspection-checkpoint.test.mjs"
    )
  );
  assert.equal(
    report.safetyPosture.phase537ReviewOnlyHandoffDispositionInspectionCheckpoint,
    true
  );
  assertSafetyFlags(report, phase537ExpectedTrueSafetyFlagNames, true);
  assertSafetyFlags(report, phase537ExpectedFalseSafetyFlagNames, false);
});

test("report inventories Phase 5.38 as review-only inspection handoff metadata boundary", async () => {
  const report = await runReport();
  const inventory =
    report.phase538ReviewOnlyInspectionHandoffMetadataBoundaryInventory;

  assert.deepEqual(
    inventory.docs.map(({ path, status }) => [path, status]),
    phase538DocFiles.map((path) => [path, "present"])
  );
  assert.deepEqual(inventory.crossLinks, phase538CrossLinks);
  assertKnownInventoryStatuses(inventory.machineReadableArtifacts);
  assert.deepEqual(inventory.machineReadableArtifacts.map(({ path }) => path), [
    "tests/fixtures/host-policy/phase5-38/review-only-inspection-handoff-metadata-boundary.json"
  ]);
  assertKnownInventoryStatuses(inventory.tests);
  assert.deepEqual(inventory.tests.map(({ path }) => path), [
    "tests/report-phase-status.test.mjs",
    "tests/phase5-38-review-only-inspection-handoff-metadata-boundary.test.mjs"
  ]);
  assert.equal(inventory.statusLayer.precedingPhase, "5.37");
  assert.equal(
    inventory.statusLayer.layerId,
    "review-only-inspection-handoff-metadata-boundary"
  );
  assert.equal(
    inventory.statusLayer.validHandoffDispositionInspectionCheckpointProducesMetadata,
    true
  );
  assert.equal(inventory.statusLayer.inspectionHandoffMetadataIsReviewerRouting, false);
  assert.equal(inventory.statusLayer.inspectionHandoffMetadataIsReviewerAssignment, false);
  assert.equal(inventory.statusLayer.inspectionHandoffMetadataIsEvaluatorExecution, false);
  assert.equal(inventory.statusLayer.inspectionHandoffMetadataIsEvaluatorResult, false);
  assert.equal(inventory.statusLayer.inspectionHandoffMetadataIsApprovalDecision, false);
  assert.equal(inventory.statusLayer.inspectionHandoffMetadataIsApprovalGrant, false);
  assert.equal(inventory.statusLayer.reviewerRoutingPerformed, false);
  assert.equal(inventory.statusLayer.reviewerAssignmentPerformed, false);
  assert.equal(inventory.statusLayer.evaluatorResultProduced, false);
  assert.equal(inventory.statusLayer.evaluatorResultPersisted, false);
  assert.equal(inventory.statusLayer.approvalDecisionProduced, false);
  assert.equal(inventory.statusLayer.approvalDecisionPersisted, false);
  assert.equal(inventory.statusLayer.approvalGrantProduced, false);
  assert.equal(inventory.statusLayer.approvalGrantPersisted, false);
  assert.equal(inventory.statusLayer.runtimePermissionGranted, false);
  assert.equal(inventory.statusLayer.commandExposurePermissionGranted, false);
  assert.equal(inventory.statusLayer.evaluatorExecutionPerformed, false);
  assert.equal(inventory.statusLayer.serveRuntimeStillDefaultBlocked, true);
  assert.deepEqual(inventory.sourcePhase, {
    phase: "phase-5.37-review-only-handoff-disposition-inspection-checkpoint",
    handoffDispositionInspectionCheckpointPath:
      "packages/core/src/index.mjs#createReviewOnlyHandoffDispositionInspectionCheckpointForReview",
    inspectionHandoffMetadataBoundaryPath:
      "packages/core/src/index.mjs#createReviewOnlyInspectionHandoffMetadataBoundaryForReview",
    sourceHandoffDispositionInspectionCheckpointFixture:
      "tests/fixtures/host-policy/phase5-37/review-only-handoff-disposition-inspection-checkpoint.json",
    runtimeEnabled: false,
    reviewerRoutingPerformed: false,
    reviewerAssignmentPerformed: false,
    approvalDecisionProduced: false,
    approvalGrantProduced: false,
    evaluatorExecutionPerformed: false
  });
  assert.equal(
    inventory.inspectionHandoffMetadataInputShape
      .handoffDispositionInspectionCheckpoints,
    "exactly one Phase 5.37 review-only handoff disposition inspection checkpoint state"
  );
  assert.equal(
    inventory.inspectionHandoffMetadataResultShape.schema,
    "ardyn.phase-5.38.review-only-inspection-handoff-metadata-boundary-result"
  );
  assert.equal(
    inventory.inspectionHandoffMetadataResultShape.stateSchema,
    "ardyn.phase-5.38.review-only-inspection-handoff-metadata-state"
  );
  assert.equal(
    inventory.inspectionHandoffMetadataResultShape.performsReviewerRouting,
    false
  );
  assert.equal(inventory.inspectionHandoffMetadataResultShape.assignsReviewers, false);
  assert.equal(inventory.inspectionHandoffMetadataResultShape.executesEvaluator, false);
  assert.equal(
    inventory.inspectionHandoffMetadataResultShape.producesEvaluatorResult,
    false
  );
  assert.equal(
    inventory.inspectionHandoffMetadataResultShape.producesApprovalDecision,
    false
  );
  assert.equal(
    inventory.inspectionHandoffMetadataResultShape.producesApprovalGrant,
    false
  );
  assert.equal(
    inventory.inspectionHandoffMetadataResultShape.persistsApprovalGrant,
    false
  );
  assert.equal(
    inventory.inspectionHandoffMetadataResultShape.grantsRuntimePermission,
    false
  );
  assert.equal(
    inventory.inspectionHandoffMetadataResultShape.grantsCommandExposurePermission,
    false
  );
  assert.deepEqual(
    inventory.inspectionHandoffMetadataCases.map(({ caseId }) => caseId),
    phase538ExpectedCaseIds
  );
  for (const metadataCase of inventory.inspectionHandoffMetadataCases) {
    assert.equal(metadataCase.reviewOnly, true);
    assert.equal(metadataCase.authoritative, false);
    assert.equal(metadataCase.reviewArtifactOnly, true);
    assert.equal(metadataCase.inspectionHandoffMetadataIsReviewerRouting, false);
    assert.equal(metadataCase.inspectionHandoffMetadataIsReviewerAssignment, false);
    assert.equal(metadataCase.inspectionHandoffMetadataIsEvaluatorExecution, false);
    assert.equal(metadataCase.inspectionHandoffMetadataIsEvaluatorResult, false);
    assert.equal(metadataCase.inspectionHandoffMetadataIsApprovalDecision, false);
    assert.equal(metadataCase.inspectionHandoffMetadataIsApprovalGrant, false);
    assert.equal(metadataCase.reviewerRoutingPerformed, false);
    assert.equal(metadataCase.reviewerAssignmentPerformed, false);
    assert.equal(metadataCase.evaluatorResultProduced, false);
    assert.equal(metadataCase.evaluatorResultPersisted, false);
    assert.equal(metadataCase.approvalDecisionProduced, false);
    assert.equal(metadataCase.approvalDecisionPersisted, false);
    assert.equal(metadataCase.approvalGrant.produced, false);
    assert.equal(metadataCase.approvalGrant.persisted, false);
    assert.equal(metadataCase.approvalGrant.grantId, null);
    assert.equal(metadataCase.approvalGrantProduced, false);
    assert.equal(metadataCase.approvalGrantPersisted, false);
    assert.equal(metadataCase.runtimePermissionGranted, false);
    assert.equal(metadataCase.commandExposurePermissionGranted, false);
    assert.equal(metadataCase.runtimeCommandExposureEnabled, false);
    assert.equal(metadataCase.runtimeExecutionEnabled, false);
    assert.equal(metadataCase.evaluatorExecuted, false);
    assertAllFalse(metadataCase.runtimeEffect);
  }
  assert.equal(
    inventory.inspectionHandoffMetadata.inspectionHandoffMetadataOnly,
    true
  );
  assert.equal(
    inventory.inspectionHandoffMetadata.sourceHandoffDispositionInspectionCheckpoint
      .handoffDispositionInspectionCheckpointMetadataOnly,
    true
  );
  assert.equal(
    inventory.inspectionHandoffMetadata.inspectionHandoffMetadataIsReviewerRouting,
    false
  );
  assert.equal(
    inventory.inspectionHandoffMetadata.inspectionHandoffMetadataIsReviewerAssignment,
    false
  );
  assert.equal(
    inventory.inspectionHandoffMetadata.inspectionHandoffMetadataIsEvaluatorExecution,
    false
  );
  assert.equal(
    inventory.inspectionHandoffMetadata.inspectionHandoffMetadataIsEvaluatorResult,
    false
  );
  assert.equal(
    inventory.inspectionHandoffMetadata.inspectionHandoffMetadataIsApprovalDecision,
    false
  );
  assert.equal(
    inventory.inspectionHandoffMetadata.inspectionHandoffMetadataIsApprovalGrant,
    false
  );
  assert.equal(inventory.inspectionHandoffMetadata.reviewerRoutingPerformed, false);
  assert.equal(inventory.inspectionHandoffMetadata.reviewerAssignmentPerformed, false);
  assert.equal(inventory.inspectionHandoffMetadata.evaluatorExecuted, false);
  assert.equal(
    inventory.inspectionHandoffMetadata.evaluatorExecutionRequested,
    false
  );
  assert.equal(inventory.inspectionHandoffMetadata.evaluatorResultProduced, false);
  assert.equal(inventory.inspectionHandoffMetadata.approvalDecisionProduced, false);
  assert.equal(inventory.inspectionHandoffMetadata.approvalGrantProduced, false);
  assert.equal(inventory.inspectionHandoffMetadata.approvalGrantPersisted, false);
  assert.equal(inventory.inspectionHandoffMetadata.runtimePermissionGranted, false);
  assert.equal(
    inventory.inspectionHandoffMetadata.commandExposurePermissionGranted,
    false
  );
  assert.equal(inventory.inspectionHandoffMetadata.runtimeCommandExposureEnabled, false);
  assert.equal(inventory.inspectionHandoffMetadata.runtimeExecutionEnabled, false);
  assertAllFalse(inventory.blockedRuntimeEffect);
  assert.equal(inventory.serveRuntimeBlockedBehavior.defaultBlocked, true);
  assert.equal(inventory.serveRuntimeBlockedBehavior.dryRunBlocked, true);
  assert.equal(inventory.serveRuntimeBlockedBehavior.dryRunBypassesBlock, false);
  assert.equal(inventory.serveRuntimeBlockedBehavior.stdout, "");
  assert.equal(inventory.forbiddenBehavior.reviewerRoutingPerformed, false);
  assert.equal(inventory.forbiddenBehavior.reviewerAssignmentPerformed, false);
  assert.equal(inventory.forbiddenBehavior.evaluatorExecutionPerformed, false);
  assert.equal(inventory.forbiddenBehavior.evaluatorResultProduced, false);
  assert.equal(inventory.forbiddenBehavior.approvalDecisionProduced, false);
  assert.equal(inventory.forbiddenBehavior.approvalGrantProduced, false);
  assert.equal(inventory.forbiddenBehavior.approvalGrantPersisted, false);
  assert.equal(inventory.forbiddenBehavior.runtimePermissionGranted, false);
  assert.equal(inventory.forbiddenBehavior.commandExposurePermissionGranted, false);
  assert.equal(inventory.forbiddenBehavior.runtimeCommandExposureEnabled, false);
  assert.equal(inventory.forbiddenBehavior.runtimeExecutionEnabled, false);
  assert.ok(
    inventory.validationCommands.includes(
      "node --test tests/phase5-38-review-only-inspection-handoff-metadata-boundary.test.mjs"
    )
  );
  assert.equal(
    report.safetyPosture.phase538ReviewOnlyInspectionHandoffMetadataBoundary,
    true
  );
  assertSafetyFlags(report, phase538ExpectedTrueSafetyFlagNames, true);
  assertSafetyFlags(report, phase538ExpectedFalseSafetyFlagNames, false);
});

test("report inventories Phase 5.38A as language-aware cleanup toolkit adoption", async () => {
  const report = await runReport();
  const inventory = report.phase538ACleanupToolkitAdoptionInventory;

  assert.deepEqual(
    inventory.docs.map(({ path, status }) => [path, status]),
    phase538ADocFiles.map((path) => [path, "present"])
  );
  assert.deepEqual(inventory.crossLinks, phase538ACrossLinks);
  assert.equal(inventory.statusLayer.precedingPhase, "5.38");
  assert.equal(inventory.statusLayer.layerId, "language-aware-cleanup-toolkit-adoption");
  assert.equal(inventory.statusLayer.cleanupToolkitBaselineRecorded, true);
  assert.equal(inventory.statusLayer.languageAwarePassOrderRecorded, true);
  assert.equal(inventory.statusLayer.behaviorPreserving, true);
  assert.equal(inventory.statusLayer.reviewBoundaryChainContinued, false);
  assert.equal(inventory.statusLayer.runtimeCapabilityAdded, false);
  assert.equal(inventory.statusLayer.reviewerRoutingPerformed, false);
  assert.equal(inventory.statusLayer.reviewerAssignmentPerformed, false);
  assert.equal(inventory.statusLayer.evaluatorExecutionPerformed, false);
  assert.equal(inventory.statusLayer.evaluatorResultProduced, false);
  assert.equal(inventory.statusLayer.approvalDecisionProduced, false);
  assert.equal(inventory.statusLayer.approvalGrantProduced, false);
  assert.equal(inventory.statusLayer.approvalGrantPersisted, false);
  assert.equal(inventory.statusLayer.runtimePermissionGranted, false);
  assert.equal(inventory.statusLayer.commandExposurePermissionGranted, false);
  assert.equal(inventory.statusLayer.runtimeEnabled, false);
  assert.equal(inventory.statusLayer.runtimeCommandExposureEnabled, false);
  assert.equal(inventory.statusLayer.runtimeExecutionEnabled, false);
  assert.equal(inventory.statusLayer.runtimeExecuted, false);
  assert.equal(inventory.statusLayer.fallowRuntimeUsed, false);
  assert.equal(inventory.statusLayer.serveRuntimeStillDefaultBlocked, true);
  assert.equal(inventory.statusLayer.dryRunBypassesBlock, false);
  assert.deepEqual(
    inventory.toolkitPassOrder.map(({ order, pass }) => [order, pass]),
    [
      [1, "formatter"],
      [2, "linter"],
      [3, "dead-code/static analysis"],
      [4, "security/dependency audit"]
    ]
  );
  assert.ok(
    inventory.toolkitPassOrder.some(({ tools }) =>
      tools.some(
        ({ tool, status }) =>
          tool === "cargo clippy --workspace -- -D warnings" &&
          status === "available"
      )
    )
  );
  assert.ok(
    inventory.toolkitPassOrder.some(({ tools }) =>
      tools.some(
        ({ tool, status, runtimeUsed }) =>
          tool === "fallow audit --format json" &&
          status === "available" &&
          runtimeUsed === false
      )
    )
  );
  assert.ok(
    inventory.safeFixesApplied.some(
      ({ file, behaviorPreserving, runtimeCapabilityAdded }) =>
        file === "crates/ardyn-host/src/stdio_runtime/mod.rs" &&
        behaviorPreserving === true &&
        runtimeCapabilityAdded === false
    )
  );
  assert.ok(
    inventory.safeFixesApplied.some(
      ({ file, behaviorPreserving, runtimeCapabilityAdded }) =>
        file === "crates/ardyn-host/src/lib.rs" &&
        behaviorPreserving === true &&
        runtimeCapabilityAdded === false
    )
  );
  assert.ok(
    inventory.riskyFindingsDeferred.some(
      ({ finding, disposition }) =>
        finding.includes("serialized stdio runtime failure audit enum variants") &&
        disposition === "deferred"
    )
  );
  assert.deepEqual(inventory.securityFollowUps, []);
  assert.ok(
    inventory.unavailableOrSkippedTools.some(
      ({ tool, reason }) =>
        tool === "cargo-audit" && reason.includes("Not already installed")
    )
  );
  assert.equal(inventory.sourceBoundary.phase5ReviewBoundaryChainContinued, false);
  assert.equal(inventory.sourceBoundary.coreReviewHelperAdded, false);
  assert.equal(inventory.sourceBoundary.fixtureAdded, false);
  assert.equal(inventory.sourceBoundary.cliBehaviorChanged, false);
  assert.equal(inventory.sourceBoundary.runtimeCommandExposureAdded, false);
  assert.equal(inventory.sourceBoundary.rustHostRuntimeImplementationAdded, false);
  assert.equal(inventory.sourceBoundary.liveRuntimeAdded, false);
  assert.ok(inventory.validationCommands.includes("cargo clippy --workspace -- -D warnings"));
  assert.ok(inventory.validationCommands.includes("npm audit --json"));
  assert.ok(
    inventory.validationCommands.includes(
      "fallow health --score --hotspots --targets --format json"
    )
  );
  assert.ok(inventory.validationCommands.includes("fallow audit --format json"));
  assert.equal(inventory.forbiddenBehavior.reviewerRoutingPerformed, false);
  assert.equal(inventory.forbiddenBehavior.reviewerAssignmentPerformed, false);
  assert.equal(inventory.forbiddenBehavior.evaluatorExecutionPerformed, false);
  assert.equal(inventory.forbiddenBehavior.evaluatorResultProduced, false);
  assert.equal(inventory.forbiddenBehavior.approvalDecisionProduced, false);
  assert.equal(inventory.forbiddenBehavior.approvalGrantProduced, false);
  assert.equal(inventory.forbiddenBehavior.approvalGrantPersisted, false);
  assert.equal(inventory.forbiddenBehavior.runtimePermissionGranted, false);
  assert.equal(inventory.forbiddenBehavior.commandExposurePermissionGranted, false);
  assert.equal(inventory.forbiddenBehavior.runtimeCommandExposureEnabled, false);
  assert.equal(inventory.forbiddenBehavior.runtimeExecutionEnabled, false);
  assert.equal(inventory.forbiddenBehavior.runtimeEnabled, false);
  assert.equal(inventory.forbiddenBehavior.runtimeExecuted, false);
  assert.equal(inventory.forbiddenBehavior.processControlEnabled, false);
  assert.equal(inventory.forbiddenBehavior.filesystemWatcherEnabled, false);
  assert.equal(inventory.forbiddenBehavior.externalLookupEnabled, false);
  assert.equal(inventory.forbiddenBehavior.envSecretsIngestionEnabled, false);
  assert.equal(
    inventory.forbiddenBehavior.adapterFabricWebSocketHttpSurfaceEnabled,
    false
  );
  assert.equal(inventory.forbiddenBehavior.fallowRuntimeUsed, false);
  assert.equal(inventory.forbiddenBehavior.serveRuntimeStillDefaultBlocked, true);
  assert.equal(inventory.forbiddenBehavior.dryRunBypassesBlock, false);
  assert.equal(report.safetyPosture.phase538ALanguageAwareCleanupToolkitAdoption, true);
  assertSafetyFlags(report, phase538AExpectedTrueSafetyFlagNames, true);
  assertSafetyFlags(report, phase538AExpectedFalseSafetyFlagNames, false);
});

test("report inventories Phase 5.39 as review-only inspection handoff checkpoint", async () => {
  const report = await runReport();
  const inventory = report.phase539ReviewOnlyInspectionHandoffCheckpointInventory;

  assert.deepEqual(
    inventory.docs.map(({ path, status }) => [path, status]),
    phase539DocFiles.map((path) => [path, "present"])
  );
  assert.deepEqual(inventory.crossLinks, phase539CrossLinks);
  assertKnownInventoryStatuses(inventory.machineReadableArtifacts);
  assert.deepEqual(inventory.machineReadableArtifacts.map(({ path }) => path), [
    "tests/fixtures/host-policy/phase5-39/review-only-inspection-handoff-checkpoint.json"
  ]);
  assertKnownInventoryStatuses(inventory.tests);
  assert.deepEqual(inventory.tests.map(({ path }) => path), [
    "tests/report-phase-status.test.mjs",
    "tests/phase5-39-review-only-inspection-handoff-checkpoint.test.mjs"
  ]);
  assert.equal(inventory.statusLayer.precedingPhase, "5.38");
  assert.equal(inventory.statusLayer.cleanupEvidencePhase, "5.38A");
  assert.equal(inventory.statusLayer.layerId, "review-only-inspection-handoff-checkpoint");
  assert.equal(
    inventory.statusLayer.validInspectionHandoffMetadataProducesCheckpoint,
    true
  );
  assert.equal(inventory.statusLayer.cleanupToolkitBaselineBehaviorPreserving, true);
  assert.equal(inventory.statusLayer.cleanupToolkitBaselineRuntimeBlocked, true);
  assert.equal(inventory.statusLayer.cleanupToolsInstalledByPhase539, false);
  assert.equal(inventory.statusLayer.fallowRuntimeUsed, false);
  assert.equal(inventory.statusLayer.inspectionHandoffCheckpointIsReviewerRouting, false);
  assert.equal(
    inventory.statusLayer.inspectionHandoffCheckpointIsReviewerAssignment,
    false
  );
  assert.equal(
    inventory.statusLayer.inspectionHandoffCheckpointIsEvaluatorExecution,
    false
  );
  assert.equal(
    inventory.statusLayer.inspectionHandoffCheckpointIsEvaluatorResult,
    false
  );
  assert.equal(
    inventory.statusLayer.inspectionHandoffCheckpointIsApprovalDecision,
    false
  );
  assert.equal(inventory.statusLayer.inspectionHandoffCheckpointIsApprovalGrant, false);
  assert.equal(inventory.statusLayer.reviewerRoutingPerformed, false);
  assert.equal(inventory.statusLayer.reviewerAssignmentPerformed, false);
  assert.equal(inventory.statusLayer.evaluatorResultProduced, false);
  assert.equal(inventory.statusLayer.evaluatorResultPersisted, false);
  assert.equal(inventory.statusLayer.approvalDecisionProduced, false);
  assert.equal(inventory.statusLayer.approvalDecisionPersisted, false);
  assert.equal(inventory.statusLayer.approvalGrantProduced, false);
  assert.equal(inventory.statusLayer.approvalGrantPersisted, false);
  assert.equal(inventory.statusLayer.runtimePermissionGranted, false);
  assert.equal(inventory.statusLayer.commandExposurePermissionGranted, false);
  assert.equal(inventory.statusLayer.evaluatorExecutionPerformed, false);
  assert.equal(inventory.statusLayer.serveRuntimeStillDefaultBlocked, true);
  assert.deepEqual(inventory.sourcePhase, {
    phase: "phase-5.38-review-only-inspection-handoff-metadata-boundary",
    inspectionHandoffMetadataBoundaryPath:
      "packages/core/src/index.mjs#createReviewOnlyInspectionHandoffMetadataBoundaryForReview",
    inspectionHandoffCheckpointPath:
      "packages/core/src/index.mjs#createReviewOnlyInspectionHandoffCheckpointForReview",
    sourceInspectionHandoffMetadataBoundaryFixture:
      "tests/fixtures/host-policy/phase5-38/review-only-inspection-handoff-metadata-boundary.json",
    cleanupToolkitBaselineDocument:
      "docs/phase-5-38a-cleanup-toolkit-adoption.md",
    runtimeEnabled: false,
    reviewerRoutingPerformed: false,
    reviewerAssignmentPerformed: false,
    approvalDecisionProduced: false,
    approvalGrantProduced: false,
    evaluatorExecutionPerformed: false
  });
  assert.equal(
    inventory.inspectionHandoffCheckpointInputShape.inspectionHandoffMetadataEntries,
    "exactly one Phase 5.38 review-only inspection/handoff metadata state"
  );
  assert.equal(
    inventory.inspectionHandoffCheckpointResultShape.schema,
    "ardyn.phase-5.39.review-only-inspection-handoff-checkpoint-result"
  );
  assert.equal(
    inventory.inspectionHandoffCheckpointResultShape.stateSchema,
    "ardyn.phase-5.39.review-only-inspection-handoff-checkpoint-state"
  );
  assert.equal(
    inventory.inspectionHandoffCheckpointResultShape.performsReviewerRouting,
    false
  );
  assert.equal(inventory.inspectionHandoffCheckpointResultShape.assignsReviewers, false);
  assert.equal(inventory.inspectionHandoffCheckpointResultShape.executesEvaluator, false);
  assert.equal(
    inventory.inspectionHandoffCheckpointResultShape.producesEvaluatorResult,
    false
  );
  assert.equal(
    inventory.inspectionHandoffCheckpointResultShape.producesApprovalDecision,
    false
  );
  assert.equal(
    inventory.inspectionHandoffCheckpointResultShape.producesApprovalGrant,
    false
  );
  assert.equal(
    inventory.inspectionHandoffCheckpointResultShape.persistsApprovalGrant,
    false
  );
  assert.equal(
    inventory.inspectionHandoffCheckpointResultShape.grantsRuntimePermission,
    false
  );
  assert.equal(
    inventory.inspectionHandoffCheckpointResultShape.grantsCommandExposurePermission,
    false
  );
  assert.deepEqual(
    inventory.inspectionHandoffCheckpointCases.map(({ caseId }) => caseId),
    phase539ExpectedCaseIds
  );
  for (const checkpointCase of inventory.inspectionHandoffCheckpointCases) {
    assert.equal(checkpointCase.reviewOnly, true);
    assert.equal(checkpointCase.authoritative, false);
    assert.equal(checkpointCase.reviewArtifactOnly, true);
    assert.equal(checkpointCase.inspectionHandoffCheckpointIsReviewerRouting, false);
    assert.equal(
      checkpointCase.inspectionHandoffCheckpointIsReviewerAssignment,
      false
    );
    assert.equal(
      checkpointCase.inspectionHandoffCheckpointIsEvaluatorExecution,
      false
    );
    assert.equal(checkpointCase.inspectionHandoffCheckpointIsEvaluatorResult, false);
    assert.equal(
      checkpointCase.inspectionHandoffCheckpointIsApprovalDecision,
      false
    );
    assert.equal(checkpointCase.inspectionHandoffCheckpointIsApprovalGrant, false);
    assert.equal(checkpointCase.reviewerRoutingPerformed, false);
    assert.equal(checkpointCase.reviewerAssignmentPerformed, false);
    assert.equal(checkpointCase.evaluatorResultProduced, false);
    assert.equal(checkpointCase.evaluatorResultPersisted, false);
    assert.equal(checkpointCase.approvalDecisionProduced, false);
    assert.equal(checkpointCase.approvalDecisionPersisted, false);
    assert.equal(checkpointCase.approvalGrant.produced, false);
    assert.equal(checkpointCase.approvalGrant.persisted, false);
    assert.equal(checkpointCase.approvalGrant.grantId, null);
    assert.equal(checkpointCase.approvalGrantProduced, false);
    assert.equal(checkpointCase.approvalGrantPersisted, false);
    assert.equal(checkpointCase.runtimePermissionGranted, false);
    assert.equal(checkpointCase.commandExposurePermissionGranted, false);
    assert.equal(checkpointCase.runtimeCommandExposureEnabled, false);
    assert.equal(checkpointCase.runtimeExecutionEnabled, false);
    assert.equal(checkpointCase.evaluatorExecuted, false);
    assertAllFalse(checkpointCase.runtimeEffect);
  }
  assert.equal(
    inventory.inspectionHandoffCheckpoint.inspectionHandoffCheckpointMetadataOnly,
    true
  );
  assert.equal(
    inventory.inspectionHandoffCheckpoint.sourceInspectionHandoffMetadata
      .inspectionHandoffMetadataOnly,
    true
  );
  assert.equal(
    inventory.inspectionHandoffCheckpoint.inspectionHandoffCheckpointIsReviewerRouting,
    false
  );
  assert.equal(
    inventory.inspectionHandoffCheckpoint
      .inspectionHandoffCheckpointIsReviewerAssignment,
    false
  );
  assert.equal(
    inventory.inspectionHandoffCheckpoint
      .inspectionHandoffCheckpointIsEvaluatorExecution,
    false
  );
  assert.equal(
    inventory.inspectionHandoffCheckpoint
      .inspectionHandoffCheckpointIsEvaluatorResult,
    false
  );
  assert.equal(
    inventory.inspectionHandoffCheckpoint
      .inspectionHandoffCheckpointIsApprovalDecision,
    false
  );
  assert.equal(
    inventory.inspectionHandoffCheckpoint.inspectionHandoffCheckpointIsApprovalGrant,
    false
  );
  assert.equal(inventory.inspectionHandoffCheckpoint.reviewerRoutingPerformed, false);
  assert.equal(inventory.inspectionHandoffCheckpoint.reviewerAssignmentPerformed, false);
  assert.equal(inventory.inspectionHandoffCheckpoint.evaluatorExecuted, false);
  assert.equal(inventory.inspectionHandoffCheckpoint.evaluatorExecutionRequested, false);
  assert.equal(inventory.inspectionHandoffCheckpoint.evaluatorResultProduced, false);
  assert.equal(inventory.inspectionHandoffCheckpoint.approvalDecisionProduced, false);
  assert.equal(inventory.inspectionHandoffCheckpoint.approvalGrantProduced, false);
  assert.equal(inventory.inspectionHandoffCheckpoint.approvalGrantPersisted, false);
  assert.equal(inventory.inspectionHandoffCheckpoint.runtimePermissionGranted, false);
  assert.equal(
    inventory.inspectionHandoffCheckpoint.commandExposurePermissionGranted,
    false
  );
  assert.equal(
    inventory.inspectionHandoffCheckpoint.runtimeCommandExposureEnabled,
    false
  );
  assert.equal(inventory.inspectionHandoffCheckpoint.runtimeExecutionEnabled, false);
  assert.equal(inventory.cleanupToolkitBaselineEvidence.behaviorPreserving, true);
  assert.equal(
    inventory.cleanupToolkitBaselineEvidence.serveRuntimeStillDefaultBlocked,
    true
  );
  assert.equal(inventory.cleanupToolkitBaselineEvidence.fallowRuntimeUsed, false);
  assertAllFalse(inventory.blockedRuntimeEffect);
  assert.equal(inventory.serveRuntimeBlockedBehavior.defaultBlocked, true);
  assert.equal(inventory.serveRuntimeBlockedBehavior.dryRunBlocked, true);
  assert.equal(inventory.serveRuntimeBlockedBehavior.dryRunBypassesBlock, false);
  assert.equal(inventory.serveRuntimeBlockedBehavior.stdout, "");
  assert.equal(inventory.forbiddenBehavior.reviewerRoutingPerformed, false);
  assert.equal(inventory.forbiddenBehavior.reviewerAssignmentPerformed, false);
  assert.equal(inventory.forbiddenBehavior.evaluatorExecutionPerformed, false);
  assert.equal(inventory.forbiddenBehavior.evaluatorResultProduced, false);
  assert.equal(inventory.forbiddenBehavior.approvalDecisionProduced, false);
  assert.equal(inventory.forbiddenBehavior.approvalGrantProduced, false);
  assert.equal(inventory.forbiddenBehavior.approvalGrantPersisted, false);
  assert.equal(inventory.forbiddenBehavior.runtimePermissionGranted, false);
  assert.equal(inventory.forbiddenBehavior.commandExposurePermissionGranted, false);
  assert.equal(inventory.forbiddenBehavior.runtimeCommandExposureEnabled, false);
  assert.equal(inventory.forbiddenBehavior.runtimeExecutionEnabled, false);
  assert.ok(
    inventory.validationCommands.includes(
      "node --test tests/phase5-39-review-only-inspection-handoff-checkpoint.test.mjs"
    )
  );
  assert.equal(
    report.safetyPosture.phase539ReviewOnlyInspectionHandoffCheckpoint,
    true
  );
  assertSafetyFlags(report, phase539ExpectedTrueSafetyFlagNames, true);
  assertSafetyFlags(report, phase539ExpectedFalseSafetyFlagNames, false);
});

test("report inventories Phase 5.40 as review-only checkpoint handoff layer", async () => {
  const report = await runReport();
  const inventory = report.phase540ReviewOnlyCheckpointHandoffLayerInventory;

  assert.deepEqual(
    inventory.docs.map(({ path, status }) => [path, status]),
    phase540DocFiles.map((path) => [path, "present"])
  );
  assert.deepEqual(inventory.crossLinks, phase540CrossLinks);
  assertKnownInventoryStatuses(inventory.machineReadableArtifacts);
  assert.deepEqual(inventory.machineReadableArtifacts.map(({ path }) => path), [
    "tests/fixtures/host-policy/phase5-40/review-only-checkpoint-handoff-layer.json"
  ]);
  assertKnownInventoryStatuses(inventory.tests);
  assert.deepEqual(inventory.tests.map(({ path }) => path), [
    "tests/report-phase-status.test.mjs",
    "tests/phase5-40-review-only-checkpoint-handoff-layer.test.mjs"
  ]);
  assert.equal(inventory.statusLayer.precedingPhase, "5.39");
  assert.equal(inventory.statusLayer.layerId, "review-only-checkpoint-handoff-layer");
  assert.equal(
    inventory.statusLayer.validInspectionHandoffCheckpointProducesLayer,
    true
  );
  assert.equal(inventory.statusLayer.cleanupHardeningToolkitEvidenceOnly, true);
  assert.equal(inventory.statusLayer.toolsInstalledByPhase540, false);
  assert.equal(inventory.statusLayer.megaLinterRun, false);
  assert.equal(inventory.statusLayer.broadTrunkRewriteRun, false);
  assert.equal(inventory.statusLayer.fallowRuntimeUsed, false);
  assert.equal(inventory.statusLayer.checkpointHandoffLayerIsReviewerRouting, false);
  assert.equal(
    inventory.statusLayer.checkpointHandoffLayerIsReviewerAssignment,
    false
  );
  assert.equal(
    inventory.statusLayer.checkpointHandoffLayerIsEvaluatorExecution,
    false
  );
  assert.equal(inventory.statusLayer.checkpointHandoffLayerIsEvaluatorResult, false);
  assert.equal(
    inventory.statusLayer.checkpointHandoffLayerIsApprovalDecision,
    false
  );
  assert.equal(inventory.statusLayer.checkpointHandoffLayerIsApprovalGrant, false);
  assert.equal(inventory.statusLayer.reviewerRoutingPerformed, false);
  assert.equal(inventory.statusLayer.reviewerAssignmentPerformed, false);
  assert.equal(inventory.statusLayer.evaluatorResultProduced, false);
  assert.equal(inventory.statusLayer.evaluatorResultPersisted, false);
  assert.equal(inventory.statusLayer.approvalDecisionProduced, false);
  assert.equal(inventory.statusLayer.approvalDecisionPersisted, false);
  assert.equal(inventory.statusLayer.approvalGrantProduced, false);
  assert.equal(inventory.statusLayer.approvalGrantPersisted, false);
  assert.equal(inventory.statusLayer.runtimePermissionGranted, false);
  assert.equal(inventory.statusLayer.commandExposurePermissionGranted, false);
  assert.equal(inventory.statusLayer.evaluatorExecutionPerformed, false);
  assert.equal(inventory.statusLayer.serveRuntimeStillDefaultBlocked, true);
  assert.deepEqual(inventory.sourcePhase, {
    phase: "phase-5.39-review-only-inspection-handoff-checkpoint",
    inspectionHandoffCheckpointPath:
      "packages/core/src/index.mjs#createReviewOnlyInspectionHandoffCheckpointForReview",
    checkpointHandoffLayerPath:
      "packages/core/src/index.mjs#createReviewOnlyCheckpointHandoffLayerForReview",
    sourceInspectionHandoffCheckpointFixture:
      "tests/fixtures/host-policy/phase5-39/review-only-inspection-handoff-checkpoint.json",
    cleanupHardeningToolkitEvidence: "installed-tools-only-no-installs",
    runtimeEnabled: false,
    reviewerRoutingPerformed: false,
    reviewerAssignmentPerformed: false,
    approvalDecisionProduced: false,
    approvalGrantProduced: false,
    evaluatorExecutionPerformed: false
  });
  assert.equal(
    inventory.checkpointHandoffLayerInputShape.inspectionHandoffCheckpointEntries,
    "exactly one Phase 5.39 review-only inspection handoff checkpoint state"
  );
  assert.equal(
    inventory.checkpointHandoffLayerResultShape.schema,
    "ardyn.phase-5.40.review-only-checkpoint-handoff-layer-result"
  );
  assert.equal(
    inventory.checkpointHandoffLayerResultShape.stateSchema,
    "ardyn.phase-5.40.review-only-checkpoint-handoff-layer-state"
  );
  assert.equal(
    inventory.checkpointHandoffLayerResultShape.performsReviewerRouting,
    false
  );
  assert.equal(inventory.checkpointHandoffLayerResultShape.assignsReviewers, false);
  assert.equal(inventory.checkpointHandoffLayerResultShape.executesEvaluator, false);
  assert.equal(
    inventory.checkpointHandoffLayerResultShape.producesEvaluatorResult,
    false
  );
  assert.equal(
    inventory.checkpointHandoffLayerResultShape.producesApprovalDecision,
    false
  );
  assert.equal(
    inventory.checkpointHandoffLayerResultShape.producesApprovalGrant,
    false
  );
  assert.equal(
    inventory.checkpointHandoffLayerResultShape.persistsApprovalGrant,
    false
  );
  assert.equal(
    inventory.checkpointHandoffLayerResultShape.grantsRuntimePermission,
    false
  );
  assert.equal(
    inventory.checkpointHandoffLayerResultShape.grantsCommandExposurePermission,
    false
  );
  assert.deepEqual(
    inventory.checkpointHandoffLayerCases.map(({ caseId }) => caseId),
    phase540ExpectedCaseIds
  );
  for (const checkpointCase of inventory.checkpointHandoffLayerCases) {
    assert.equal(checkpointCase.reviewOnly, true);
    assert.equal(checkpointCase.authoritative, false);
    assert.equal(checkpointCase.reviewArtifactOnly, true);
    assert.equal(checkpointCase.checkpointHandoffLayerIsReviewerRouting, false);
    assert.equal(
      checkpointCase.checkpointHandoffLayerIsReviewerAssignment,
      false
    );
    assert.equal(
      checkpointCase.checkpointHandoffLayerIsEvaluatorExecution,
      false
    );
    assert.equal(checkpointCase.checkpointHandoffLayerIsEvaluatorResult, false);
    assert.equal(
      checkpointCase.checkpointHandoffLayerIsApprovalDecision,
      false
    );
    assert.equal(checkpointCase.checkpointHandoffLayerIsApprovalGrant, false);
    assert.equal(checkpointCase.reviewerRoutingPerformed, false);
    assert.equal(checkpointCase.reviewerAssignmentPerformed, false);
    assert.equal(checkpointCase.evaluatorResultProduced, false);
    assert.equal(checkpointCase.evaluatorResultPersisted, false);
    assert.equal(checkpointCase.approvalDecisionProduced, false);
    assert.equal(checkpointCase.approvalDecisionPersisted, false);
    assert.equal(checkpointCase.approvalGrant.produced, false);
    assert.equal(checkpointCase.approvalGrant.persisted, false);
    assert.equal(checkpointCase.approvalGrant.grantId, null);
    assert.equal(checkpointCase.approvalGrantProduced, false);
    assert.equal(checkpointCase.approvalGrantPersisted, false);
    assert.equal(checkpointCase.runtimePermissionGranted, false);
    assert.equal(checkpointCase.commandExposurePermissionGranted, false);
    assert.equal(checkpointCase.runtimeCommandExposureEnabled, false);
    assert.equal(checkpointCase.runtimeExecutionEnabled, false);
    assert.equal(checkpointCase.evaluatorExecuted, false);
    assertAllFalse(checkpointCase.runtimeEffect);
  }
  assert.equal(inventory.checkpointHandoffLayer.checkpointHandoffMetadataOnly, true);
  assert.equal(
    inventory.checkpointHandoffLayer.sourceInspectionHandoffCheckpoint
      .inspectionHandoffCheckpointMetadataOnly,
    true
  );
  assert.equal(
    inventory.checkpointHandoffLayer.checkpointHandoffLayerIsReviewerRouting,
    false
  );
  assert.equal(
    inventory.checkpointHandoffLayer.checkpointHandoffLayerIsReviewerAssignment,
    false
  );
  assert.equal(
    inventory.checkpointHandoffLayer.checkpointHandoffLayerIsEvaluatorExecution,
    false
  );
  assert.equal(
    inventory.checkpointHandoffLayer.checkpointHandoffLayerIsEvaluatorResult,
    false
  );
  assert.equal(
    inventory.checkpointHandoffLayer.checkpointHandoffLayerIsApprovalDecision,
    false
  );
  assert.equal(
    inventory.checkpointHandoffLayer.checkpointHandoffLayerIsApprovalGrant,
    false
  );
  assert.equal(inventory.checkpointHandoffLayer.reviewerRoutingPerformed, false);
  assert.equal(inventory.checkpointHandoffLayer.reviewerAssignmentPerformed, false);
  assert.equal(inventory.checkpointHandoffLayer.evaluatorExecuted, false);
  assert.equal(inventory.checkpointHandoffLayer.evaluatorExecutionRequested, false);
  assert.equal(inventory.checkpointHandoffLayer.evaluatorResultProduced, false);
  assert.equal(inventory.checkpointHandoffLayer.approvalDecisionProduced, false);
  assert.equal(inventory.checkpointHandoffLayer.approvalGrantProduced, false);
  assert.equal(inventory.checkpointHandoffLayer.approvalGrantPersisted, false);
  assert.equal(inventory.checkpointHandoffLayer.runtimePermissionGranted, false);
  assert.equal(
    inventory.checkpointHandoffLayer.commandExposurePermissionGranted,
    false
  );
  assert.equal(
    inventory.checkpointHandoffLayer.runtimeCommandExposureEnabled,
    false
  );
  assert.equal(inventory.checkpointHandoffLayer.runtimeExecutionEnabled, false);
  assert.equal(inventory.cleanupHardeningToolkitEvidence.cargoAuditRequired, true);
  assert.equal(inventory.cleanupHardeningToolkitEvidence.cargoMacheteRequired, true);
  assert.equal(inventory.cleanupHardeningToolkitEvidence.toolsInstalledByPhase540, false);
  assert.equal(inventory.cleanupHardeningToolkitEvidence.fallowRuntimeUsed, false);
  assertAllFalse(inventory.blockedRuntimeEffect);
  assert.equal(inventory.serveRuntimeBlockedBehavior.defaultBlocked, true);
  assert.equal(inventory.serveRuntimeBlockedBehavior.dryRunBlocked, true);
  assert.equal(inventory.serveRuntimeBlockedBehavior.dryRunBypassesBlock, false);
  assert.equal(inventory.serveRuntimeBlockedBehavior.stdout, "");
  assert.equal(inventory.forbiddenBehavior.reviewerRoutingPerformed, false);
  assert.equal(inventory.forbiddenBehavior.reviewerAssignmentPerformed, false);
  assert.equal(inventory.forbiddenBehavior.evaluatorExecutionPerformed, false);
  assert.equal(inventory.forbiddenBehavior.evaluatorResultProduced, false);
  assert.equal(inventory.forbiddenBehavior.approvalDecisionProduced, false);
  assert.equal(inventory.forbiddenBehavior.approvalGrantProduced, false);
  assert.equal(inventory.forbiddenBehavior.approvalGrantPersisted, false);
  assert.equal(inventory.forbiddenBehavior.runtimePermissionGranted, false);
  assert.equal(inventory.forbiddenBehavior.commandExposurePermissionGranted, false);
  assert.equal(inventory.forbiddenBehavior.runtimeCommandExposureEnabled, false);
  assert.equal(inventory.forbiddenBehavior.runtimeExecutionEnabled, false);
  assert.ok(
    inventory.validationCommands.includes(
      "node --test tests/phase5-40-review-only-checkpoint-handoff-layer.test.mjs"
    )
  );
  assert.deepEqual(inventory.optionalAdvisoryCommands, [
    "knip",
    "depcheck",
    "osv-scanner scan .",
    "trivy fs --scanners vuln,secret,misconfig .",
    "semgrep --config auto ."
  ]);
  assert.equal(report.safetyPosture.phase540ReviewOnlyCheckpointHandoffLayer, true);
  assertSafetyFlags(report, phase540ExpectedTrueSafetyFlagNames, true);
  assertSafetyFlags(report, phase540ExpectedFalseSafetyFlagNames, false);
});

test("report inventories Phase 5.41 as review-only metadata handoff checkpoint", async () => {
  const report = await runReport();
  const inventory = report.phase541ReviewOnlyMetadataHandoffCheckpointInventory;

  assert.equal(inventory.statusLayer.layerId, "review-only-metadata-handoff-checkpoint");
  assert.deepEqual(
    inventory.docs.map(({ path, status }) => [path, status]),
    phase541DocFiles.map((path) => [path, "present"])
  );
  assert.deepEqual(inventory.crossLinks, phase541CrossLinks);
  assert.equal(
    inventory.statusLayer.metadataHandoffCheckpointIsReviewerRouting,
    false
  );
  assert.equal(
    inventory.statusLayer.metadataHandoffCheckpointIsReviewerAssignment,
    false
  );
  assert.equal(
    inventory.statusLayer.metadataHandoffCheckpointIsEvaluatorExecution,
    false
  );
  assert.equal(
    inventory.statusLayer.metadataHandoffCheckpointIsEvaluatorResult,
    false
  );
  assert.equal(
    inventory.statusLayer.metadataHandoffCheckpointIsApprovalDecision,
    false
  );
  assert.equal(
    inventory.statusLayer.metadataHandoffCheckpointIsApprovalGrant,
    false
  );
  assert.equal(inventory.ownershipBoundary.cliRuntimeSourceFilesChanged.length, 0);
  assert.equal(inventory.ownershipBoundary.rustRuntimeSourceFilesChanged.length, 0);
  assert.equal(inventory.ownershipBoundary.reviewerRoutingPerformedByThisPhase, false);
  assert.equal(
    inventory.ownershipBoundary.reviewerAssignmentPerformedByThisPhase,
    false
  );
  assert.equal(inventory.ownershipBoundary.evaluatorExecutionPerformedByThisPhase, false);
  assert.equal(inventory.ownershipBoundary.evaluatorResultProducedByThisPhase, false);
  assert.equal(inventory.ownershipBoundary.approvalDecisionProducedByThisPhase, false);
  assert.equal(inventory.ownershipBoundary.approvalGrantProducedByThisPhase, false);
  assert.equal(inventory.ownershipBoundary.runtimePermissionGrantedByThisPhase, false);
  assert.equal(
    inventory.ownershipBoundary.commandExposurePermissionGrantedByThisPhase,
    false
  );
  assert.equal(inventory.ownershipBoundary.runtimeEnabledByThisPhase, false);
  assert.equal(inventory.sourcePhase.phase, "phase-5.40-review-only-checkpoint-handoff-layer");
  assert.equal(
    inventory.metadataHandoffCheckpointInputShape.checkpointHandoffLayerEntries,
    "exactly one Phase 5.40 review-only checkpoint handoff layer state"
  );
  assert.equal(
    inventory.metadataHandoffCheckpointResultShape.schema,
    "ardyn.phase-5.41.review-only-metadata-handoff-checkpoint-result"
  );
  assert.equal(
    inventory.metadataHandoffCheckpointResultShape.stateSchema,
    "ardyn.phase-5.41.review-only-metadata-handoff-checkpoint-state"
  );
  assert.equal(
    inventory.metadataHandoffCheckpointResultShape.performsReviewerRouting,
    false
  );
  assert.equal(
    inventory.metadataHandoffCheckpointResultShape.assignsReviewers,
    false
  );
  assert.equal(inventory.metadataHandoffCheckpointResultShape.executesEvaluator, false);
  assert.equal(
    inventory.metadataHandoffCheckpointResultShape.producesEvaluatorResult,
    false
  );
  assert.equal(
    inventory.metadataHandoffCheckpointResultShape.producesApprovalDecision,
    false
  );
  assert.equal(
    inventory.metadataHandoffCheckpointResultShape.producesApprovalGrant,
    false
  );
  assert.equal(
    inventory.metadataHandoffCheckpointResultShape.persistsApprovalGrant,
    false
  );
  assert.equal(
    inventory.metadataHandoffCheckpointResultShape.grantsRuntimePermission,
    false
  );
  assert.equal(
    inventory.metadataHandoffCheckpointResultShape.grantsCommandExposurePermission,
    false
  );
  assert.deepEqual(
    inventory.metadataHandoffCheckpointCases.map(({ caseId }) => caseId),
    phase541ExpectedCaseIds
  );
  for (const checkpointCase of inventory.metadataHandoffCheckpointCases) {
    assert.equal(checkpointCase.reviewOnly, true);
    assert.equal(checkpointCase.authoritative, false);
    assert.equal(checkpointCase.reviewArtifactOnly, true);
    assert.equal(checkpointCase.metadataHandoffCheckpointIsReviewerRouting, false);
    assert.equal(
      checkpointCase.metadataHandoffCheckpointIsReviewerAssignment,
      false
    );
    assert.equal(
      checkpointCase.metadataHandoffCheckpointIsEvaluatorExecution,
      false
    );
    assert.equal(checkpointCase.metadataHandoffCheckpointIsEvaluatorResult, false);
    assert.equal(
      checkpointCase.metadataHandoffCheckpointIsApprovalDecision,
      false
    );
    assert.equal(checkpointCase.metadataHandoffCheckpointIsApprovalGrant, false);
    assert.equal(checkpointCase.reviewerRoutingPerformed, false);
    assert.equal(checkpointCase.reviewerAssignmentPerformed, false);
    assert.equal(checkpointCase.evaluatorResultProduced, false);
    assert.equal(checkpointCase.evaluatorResultPersisted, false);
    assert.equal(checkpointCase.approvalDecisionProduced, false);
    assert.equal(checkpointCase.approvalDecisionPersisted, false);
    assert.equal(checkpointCase.approvalGrant.produced, false);
    assert.equal(checkpointCase.approvalGrant.persisted, false);
    assert.equal(checkpointCase.approvalGrant.grantId, null);
    assert.equal(checkpointCase.approvalGrantProduced, false);
    assert.equal(checkpointCase.approvalGrantPersisted, false);
    assert.equal(checkpointCase.runtimePermissionGranted, false);
    assert.equal(checkpointCase.commandExposurePermissionGranted, false);
    assert.equal(checkpointCase.runtimeCommandExposureEnabled, false);
    assert.equal(checkpointCase.runtimeExecutionEnabled, false);
    assert.equal(checkpointCase.evaluatorExecuted, false);
    assertAllFalse(checkpointCase.runtimeEffect);
  }
  assert.equal(
    inventory.metadataHandoffCheckpoint.metadataHandoffCheckpointMetadataOnly,
    true
  );
  assert.equal(
    inventory.metadataHandoffCheckpoint.sourceCheckpointHandoffLayer
      .checkpointHandoffMetadataOnly,
    true
  );
  assert.equal(
    inventory.metadataHandoffCheckpoint.metadataHandoffCheckpointIsReviewerRouting,
    false
  );
  assert.equal(
    inventory.metadataHandoffCheckpoint.metadataHandoffCheckpointIsReviewerAssignment,
    false
  );
  assert.equal(
    inventory.metadataHandoffCheckpoint.metadataHandoffCheckpointIsEvaluatorExecution,
    false
  );
  assert.equal(
    inventory.metadataHandoffCheckpoint.metadataHandoffCheckpointIsEvaluatorResult,
    false
  );
  assert.equal(
    inventory.metadataHandoffCheckpoint.metadataHandoffCheckpointIsApprovalDecision,
    false
  );
  assert.equal(
    inventory.metadataHandoffCheckpoint.metadataHandoffCheckpointIsApprovalGrant,
    false
  );
  assert.equal(inventory.metadataHandoffCheckpoint.reviewerRoutingPerformed, false);
  assert.equal(inventory.metadataHandoffCheckpoint.reviewerAssignmentPerformed, false);
  assert.equal(inventory.metadataHandoffCheckpoint.evaluatorExecuted, false);
  assert.equal(
    inventory.metadataHandoffCheckpoint.evaluatorExecutionRequested,
    false
  );
  assert.equal(inventory.metadataHandoffCheckpoint.evaluatorResultProduced, false);
  assert.equal(inventory.metadataHandoffCheckpoint.approvalDecisionProduced, false);
  assert.equal(inventory.metadataHandoffCheckpoint.approvalGrantProduced, false);
  assert.equal(inventory.metadataHandoffCheckpoint.approvalGrantPersisted, false);
  assert.equal(inventory.metadataHandoffCheckpoint.runtimePermissionGranted, false);
  assert.equal(
    inventory.metadataHandoffCheckpoint.commandExposurePermissionGranted,
    false
  );
  assert.equal(
    inventory.metadataHandoffCheckpoint.runtimeCommandExposureEnabled,
    false
  );
  assert.equal(inventory.metadataHandoffCheckpoint.runtimeExecutionEnabled, false);
  assert.equal(inventory.cleanupHardeningToolkitEvidence.cargoAuditRequired, true);
  assert.equal(inventory.cleanupHardeningToolkitEvidence.cargoMacheteRequired, true);
  assert.equal(inventory.cleanupHardeningToolkitEvidence.toolsInstalledByPhase541, false);
  assert.equal(inventory.cleanupHardeningToolkitEvidence.fallowRuntimeUsed, false);
  assertAllFalse(inventory.blockedRuntimeEffect);
  assert.equal(inventory.serveRuntimeBlockedBehavior.defaultBlocked, true);
  assert.equal(inventory.serveRuntimeBlockedBehavior.dryRunBlocked, true);
  assert.equal(inventory.serveRuntimeBlockedBehavior.dryRunBypassesBlock, false);
  assert.equal(inventory.serveRuntimeBlockedBehavior.stdout, "");
  assert.equal(inventory.forbiddenBehavior.reviewerRoutingPerformed, false);
  assert.equal(inventory.forbiddenBehavior.reviewerAssignmentPerformed, false);
  assert.equal(inventory.forbiddenBehavior.evaluatorExecutionPerformed, false);
  assert.equal(inventory.forbiddenBehavior.evaluatorResultProduced, false);
  assert.equal(inventory.forbiddenBehavior.approvalDecisionProduced, false);
  assert.equal(inventory.forbiddenBehavior.approvalGrantProduced, false);
  assert.equal(inventory.forbiddenBehavior.approvalGrantPersisted, false);
  assert.equal(inventory.forbiddenBehavior.runtimePermissionGranted, false);
  assert.equal(inventory.forbiddenBehavior.commandExposurePermissionGranted, false);
  assert.equal(inventory.forbiddenBehavior.runtimeCommandExposureEnabled, false);
  assert.equal(inventory.forbiddenBehavior.runtimeExecutionEnabled, false);
  assert.ok(
    inventory.validationCommands.includes(
      "node --test tests/phase5-41-review-only-metadata-handoff-checkpoint.test.mjs"
    )
  );
  assert.deepEqual(inventory.optionalAdvisoryCommands, [
    "knip",
    "depcheck",
    "osv-scanner scan .",
    "trivy fs --scanners vuln,secret,misconfig .",
    "semgrep --config auto ."
  ]);
  assert.equal(report.safetyPosture.phase541ReviewOnlyMetadataHandoffCheckpoint, true);
  assertSafetyFlags(report, phase541ExpectedTrueSafetyFlagNames, true);
  assertSafetyFlags(report, phase541ExpectedFalseSafetyFlagNames, false);
});

test("report inventories Phase 5.42 as review-only handoff metadata consolidation layer", async () => {
  const report = await runReport();
  const inventory =
    report.phase542ReviewOnlyHandoffMetadataConsolidationLayerInventory;

  assert.equal(
    inventory.statusLayer.layerId,
    "review-only-handoff-metadata-consolidation-layer"
  );
  assert.deepEqual(
    inventory.docs.map(({ path, status }) => [path, status]),
    phase542DocFiles.map((path) => [path, "present"])
  );
  assert.deepEqual(inventory.crossLinks, phase542CrossLinks);
  assert.equal(
    inventory.statusLayer.handoffMetadataConsolidationLayerIsReviewerRouting,
    false
  );
  assert.equal(
    inventory.statusLayer.handoffMetadataConsolidationLayerIsReviewerAssignment,
    false
  );
  assert.equal(
    inventory.statusLayer.handoffMetadataConsolidationLayerIsEvaluatorExecution,
    false
  );
  assert.equal(
    inventory.statusLayer.handoffMetadataConsolidationLayerIsEvaluatorResult,
    false
  );
  assert.equal(
    inventory.statusLayer.handoffMetadataConsolidationLayerIsApprovalDecision,
    false
  );
  assert.equal(
    inventory.statusLayer.handoffMetadataConsolidationLayerIsApprovalGrant,
    false
  );
  assert.equal(inventory.statusLayer.nestedApprovalGrantRejected, true);
  assert.equal(inventory.statusLayer.nestedApprovalDecisionRejected, true);
  assert.equal(inventory.statusLayer.nestedReviewerAssignmentRejected, true);
  assert.equal(inventory.statusLayer.nestedReviewerRoutingRejected, true);
  assert.equal(inventory.statusLayer.nestedEvaluatorExecutionRejected, true);
  assert.equal(inventory.statusLayer.nestedEvaluatorResultRejected, true);
  assert.equal(inventory.statusLayer.nestedRuntimeEffectRejected, true);
  assert.equal(inventory.statusLayer.nestedCommandExposureRejected, true);
  assert.equal(inventory.statusLayer.missingOrMalformedSourceDigestRejected, true);
  assert.equal(inventory.statusLayer.reviewerRoutingPerformed, false);
  assert.equal(inventory.statusLayer.reviewerAssignmentPerformed, false);
  assert.equal(inventory.statusLayer.evaluatorExecutionPerformed, false);
  assert.equal(inventory.statusLayer.evaluatorResultProduced, false);
  assert.equal(inventory.statusLayer.approvalDecisionProduced, false);
  assert.equal(inventory.statusLayer.approvalGrantProduced, false);
  assert.equal(inventory.statusLayer.approvalGrantPersisted, false);
  assert.equal(inventory.statusLayer.runtimePermissionGranted, false);
  assert.equal(inventory.statusLayer.commandExposurePermissionGranted, false);
  assert.equal(inventory.statusLayer.runtimeExecutionEnabled, false);
  assert.equal(inventory.statusLayer.serveRuntimeStillDefaultBlocked, true);
  assert.equal(inventory.statusLayer.dryRunBypassesBlock, false);
  assert.equal(inventory.statusLayer.cliSourceChanged, false);
  assert.equal(inventory.statusLayer.rustSourceChanged, false);
  assert.deepEqual(
    inventory.machineReadableArtifacts.map(({ path, status }) => [path, status]),
    [
      [
        "tests/fixtures/host-policy/phase5-42/review-only-handoff-metadata-consolidation-layer.json",
        "present"
      ]
    ]
  );
  assert.deepEqual(
    inventory.tests.map(({ path, status }) => [path, status]),
    [
      ["tests/report-phase-status.test.mjs", "present"],
      [
        "tests/phase5-42-review-only-handoff-metadata-consolidation-layer.test.mjs",
        "present"
      ]
    ]
  );
  assert.deepEqual(
    inventory.ownershipBoundary.cliRuntimeSourceFilesChanged,
    []
  );
  assert.deepEqual(
    inventory.ownershipBoundary.rustRuntimeSourceFilesChanged,
    []
  );
  assert.equal(inventory.sourcePhase.phase, "phase-5.41-review-only-metadata-handoff-checkpoint");
  assert.deepEqual(
    inventory.handoffMetadataConsolidationCases.map(({ caseId }) => caseId),
    phase542ExpectedCaseIds
  );
  assert.deepEqual(
    inventory.nestedSourceRegressionCases.map(({ caseId }) => caseId),
    [
      "missing-source-checkpoint-handoff-layer-digest",
      "malformed-source-checkpoint-handoff-layer-digest",
      "nested-approval-grant-rejected",
      "nested-approval-decision-rejected",
      "nested-reviewer-assignment-rejected",
      "nested-reviewer-routing-rejected",
      "nested-evaluator-execution-rejected",
      "nested-evaluator-result-rejected",
      "nested-runtime-effect-rejected",
      "nested-command-exposure-rejected"
    ]
  );
  assert.equal(
    inventory.handoffMetadataConsolidationLayer.schema,
    "ardyn.phase-5.42.review-only-handoff-metadata-consolidation-layer-state"
  );
  assert.equal(
    inventory.handoffMetadataConsolidationLayer
      .handoffMetadataConsolidationLayerMetadataOnly,
    true
  );
  assert.equal(
    inventory.handoffMetadataConsolidationLayer.sourceMetadataHandoffCheckpoint
      .metadataHandoffCheckpointMetadataOnly,
    true
  );
  assert.equal(
    inventory.handoffMetadataConsolidationLayer
      .handoffMetadataConsolidationLayerIsReviewerRouting,
    false
  );
  assert.equal(
    inventory.handoffMetadataConsolidationLayer
      .handoffMetadataConsolidationLayerIsReviewerAssignment,
    false
  );
  assert.equal(
    inventory.handoffMetadataConsolidationLayer
      .handoffMetadataConsolidationLayerIsEvaluatorExecution,
    false
  );
  assert.equal(
    inventory.handoffMetadataConsolidationLayer
      .handoffMetadataConsolidationLayerIsEvaluatorResult,
    false
  );
  assert.equal(
    inventory.handoffMetadataConsolidationLayer
      .handoffMetadataConsolidationLayerIsApprovalDecision,
    false
  );
  assert.equal(
    inventory.handoffMetadataConsolidationLayer
      .handoffMetadataConsolidationLayerIsApprovalGrant,
    false
  );
  assert.equal(inventory.handoffMetadataConsolidationLayer.reviewerRoutingPerformed, false);
  assert.equal(
    inventory.handoffMetadataConsolidationLayer.reviewerAssignmentPerformed,
    false
  );
  assert.equal(inventory.handoffMetadataConsolidationLayer.evaluatorExecuted, false);
  assert.equal(
    inventory.handoffMetadataConsolidationLayer.evaluatorExecutionRequested,
    false
  );
  assert.equal(
    inventory.handoffMetadataConsolidationLayer.evaluatorResultProduced,
    false
  );
  assert.equal(
    inventory.handoffMetadataConsolidationLayer.approvalDecisionProduced,
    false
  );
  assert.equal(
    inventory.handoffMetadataConsolidationLayer.approvalGrantProduced,
    false
  );
  assert.equal(
    inventory.handoffMetadataConsolidationLayer.approvalGrantPersisted,
    false
  );
  assert.equal(
    inventory.handoffMetadataConsolidationLayer.runtimePermissionGranted,
    false
  );
  assert.equal(
    inventory.handoffMetadataConsolidationLayer.commandExposurePermissionGranted,
    false
  );
  assert.equal(
    inventory.handoffMetadataConsolidationLayer.runtimeCommandExposureEnabled,
    false
  );
  assert.equal(
    inventory.handoffMetadataConsolidationLayer.runtimeExecutionEnabled,
    false
  );
  assert.equal(inventory.cleanupHardeningToolkitEvidence.cargoAuditRequired, true);
  assert.equal(inventory.cleanupHardeningToolkitEvidence.cargoMacheteRequired, true);
  assert.equal(
    inventory.cleanupHardeningToolkitEvidence.toolsInstalledByPhase542,
    false
  );
  assert.equal(inventory.cleanupHardeningToolkitEvidence.fallowRuntimeUsed, false);
  assertAllFalse(inventory.blockedRuntimeEffect);
  assert.equal(inventory.serveRuntimeBlockedBehavior.defaultBlocked, true);
  assert.equal(inventory.serveRuntimeBlockedBehavior.dryRunBlocked, true);
  assert.equal(inventory.serveRuntimeBlockedBehavior.dryRunBypassesBlock, false);
  assert.equal(inventory.serveRuntimeBlockedBehavior.stdout, "");
  assert.equal(inventory.forbiddenBehavior.reviewerRoutingPerformed, false);
  assert.equal(inventory.forbiddenBehavior.reviewerAssignmentPerformed, false);
  assert.equal(inventory.forbiddenBehavior.evaluatorExecutionPerformed, false);
  assert.equal(inventory.forbiddenBehavior.evaluatorResultProduced, false);
  assert.equal(inventory.forbiddenBehavior.approvalDecisionProduced, false);
  assert.equal(inventory.forbiddenBehavior.approvalGrantProduced, false);
  assert.equal(inventory.forbiddenBehavior.approvalGrantPersisted, false);
  assert.equal(inventory.forbiddenBehavior.runtimePermissionGranted, false);
  assert.equal(inventory.forbiddenBehavior.commandExposurePermissionGranted, false);
  assert.equal(inventory.forbiddenBehavior.runtimeCommandExposureEnabled, false);
  assert.equal(inventory.forbiddenBehavior.runtimeExecutionEnabled, false);
  assert.ok(
    inventory.validationCommands.includes(
      "node --test tests/phase5-42-review-only-handoff-metadata-consolidation-layer.test.mjs"
    )
  );
  assert.deepEqual(inventory.optionalAdvisoryCommands, [
    "knip",
    "depcheck",
    "osv-scanner scan .",
    "trivy fs --scanners vuln,secret,misconfig .",
    "semgrep --config auto ."
  ]);
  assert.equal(
    report.safetyPosture.phase542ReviewOnlyHandoffMetadataConsolidationLayer,
    true
  );
  assertSafetyFlags(report, phase542ExpectedTrueSafetyFlagNames, true);
  assertSafetyFlags(report, phase542ExpectedFalseSafetyFlagNames, false);
});

test("report inventories Phase 5.43 as review-only consolidation checkpoint handoff", async () => {
  const report = await runReport();
  const inventory =
    report.phase543ReviewOnlyConsolidationCheckpointHandoffInventory;

  assert.equal(
    inventory.statusLayer.layerId,
    "review-only-consolidation-checkpoint-handoff"
  );
  assert.deepEqual(
    inventory.docs.map(({ path, status }) => [path, status]),
    phase543DocFiles.map((path) => [path, "present"])
  );
  assert.deepEqual(inventory.crossLinks, phase543CrossLinks);
  assert.equal(
    inventory.statusLayer.consolidationCheckpointHandoffIsReviewerRouting,
    false
  );
  assert.equal(
    inventory.statusLayer.consolidationCheckpointHandoffIsReviewerAssignment,
    false
  );
  assert.equal(
    inventory.statusLayer.consolidationCheckpointHandoffIsEvaluatorExecution,
    false
  );
  assert.equal(
    inventory.statusLayer.consolidationCheckpointHandoffIsEvaluatorResult,
    false
  );
  assert.equal(
    inventory.statusLayer.consolidationCheckpointHandoffIsApprovalDecision,
    false
  );
  assert.equal(
    inventory.statusLayer.consolidationCheckpointHandoffIsApprovalGrant,
    false
  );
  assert.equal(inventory.statusLayer.nestedApprovalGrantRejected, true);
  assert.equal(inventory.statusLayer.nestedApprovalDecisionRejected, true);
  assert.equal(inventory.statusLayer.nestedReviewerAssignmentRejected, true);
  assert.equal(inventory.statusLayer.nestedReviewerRoutingRejected, true);
  assert.equal(inventory.statusLayer.nestedEvaluatorExecutionRejected, true);
  assert.equal(inventory.statusLayer.nestedEvaluatorResultRejected, true);
  assert.equal(inventory.statusLayer.nestedRuntimeEffectRejected, true);
  assert.equal(inventory.statusLayer.nestedCommandExposureRejected, true);
  assert.equal(
    inventory.statusLayer.missingMalformedOrMismatchedSourceDigestRejected,
    true
  );
  assert.equal(inventory.statusLayer.malformedSourceEntryArraysRejected, true);
  assert.equal(inventory.statusLayer.reviewerRoutingPerformed, false);
  assert.equal(inventory.statusLayer.reviewerAssignmentPerformed, false);
  assert.equal(inventory.statusLayer.evaluatorExecutionPerformed, false);
  assert.equal(inventory.statusLayer.evaluatorResultProduced, false);
  assert.equal(inventory.statusLayer.approvalDecisionProduced, false);
  assert.equal(inventory.statusLayer.approvalGrantProduced, false);
  assert.equal(inventory.statusLayer.approvalGrantPersisted, false);
  assert.equal(inventory.statusLayer.runtimePermissionGranted, false);
  assert.equal(inventory.statusLayer.commandExposurePermissionGranted, false);
  assert.equal(inventory.statusLayer.runtimeExecutionEnabled, false);
  assert.equal(inventory.statusLayer.serveRuntimeStillDefaultBlocked, true);
  assert.equal(inventory.statusLayer.dryRunBypassesBlock, false);
  assert.equal(inventory.statusLayer.cliSourceChanged, false);
  assert.equal(inventory.statusLayer.rustSourceChanged, false);
  assert.deepEqual(
    inventory.machineReadableArtifacts.map(({ path, status }) => [path, status]),
    [
      [
        "tests/fixtures/host-policy/phase5-43/review-only-consolidation-checkpoint-handoff.json",
        "present"
      ]
    ]
  );
  assert.deepEqual(
    inventory.tests.map(({ path, status }) => [path, status]),
    [
      ["tests/report-phase-status.test.mjs", "present"],
      [
        "tests/phase5-43-review-only-consolidation-checkpoint-handoff.test.mjs",
        "present"
      ]
    ]
  );
  assert.deepEqual(inventory.ownershipBoundary.cliRuntimeSourceFilesChanged, []);
  assert.deepEqual(inventory.ownershipBoundary.rustRuntimeSourceFilesChanged, []);
  assert.equal(
    inventory.sourcePhase.phase,
    "phase-5.42-review-only-handoff-metadata-consolidation-layer"
  );
  assert.deepEqual(
    inventory.consolidationCheckpointHandoffCases.map(({ caseId }) => caseId),
    phase543ExpectedCaseIds
  );
  assert.deepEqual(
    inventory.nestedSourceRegressionCases.map(({ caseId }) => caseId),
    [
      "missing-source-handoff-metadata-consolidation-layer-digest",
      "malformed-source-handoff-metadata-consolidation-layer-digest",
      "mismatched-source-handoff-metadata-consolidation-layer-digest",
      "missing-nested-source-metadata-handoff-checkpoint-digest",
      "malformed-nested-source-metadata-handoff-checkpoint-digest",
      "nested-approval-grant-rejected",
      "nested-approval-decision-rejected",
      "nested-reviewer-assignment-rejected",
      "nested-reviewer-routing-rejected",
      "nested-evaluator-execution-rejected",
      "nested-evaluator-result-rejected",
      "nested-runtime-effect-rejected",
      "nested-command-exposure-rejected",
      "nested-source-url-rejected",
      "nested-source-file-path-rejected",
      "nested-summary-external-source-lookup-rejected",
      "nested-summary-filesystem-watcher-rejected",
      "nested-cleanup-env-secrets-ingested-rejected",
      "nested-cleanup-secrets-env-ingestion-rejected",
      "malformed-source-entry-null-rejected",
      "malformed-source-entry-array-rejected",
      "malformed-nested-entry-array-rejected"
    ]
  );
  assert.equal(
    inventory.consolidationCheckpointHandoff.schema,
    "ardyn.phase-5.43.review-only-consolidation-checkpoint-handoff-state"
  );
  assert.equal(
    inventory.consolidationCheckpointHandoff
      .consolidationCheckpointHandoffMetadataOnly,
    true
  );
  assert.equal(
    inventory.consolidationCheckpointHandoff
      .sourceHandoffMetadataConsolidationLayer
      .handoffMetadataConsolidationLayerMetadataOnly,
    true
  );
  assert.equal(
    inventory.consolidationCheckpointHandoff
      .consolidationCheckpointHandoffIsReviewerRouting,
    false
  );
  assert.equal(
    inventory.consolidationCheckpointHandoff
      .consolidationCheckpointHandoffIsReviewerAssignment,
    false
  );
  assert.equal(
    inventory.consolidationCheckpointHandoff
      .consolidationCheckpointHandoffIsEvaluatorExecution,
    false
  );
  assert.equal(
    inventory.consolidationCheckpointHandoff
      .consolidationCheckpointHandoffIsEvaluatorResult,
    false
  );
  assert.equal(
    inventory.consolidationCheckpointHandoff
      .consolidationCheckpointHandoffIsApprovalDecision,
    false
  );
  assert.equal(
    inventory.consolidationCheckpointHandoff
      .consolidationCheckpointHandoffIsApprovalGrant,
    false
  );
  assert.equal(
    inventory.consolidationCheckpointHandoff.reviewerRoutingPerformed,
    false
  );
  assert.equal(
    inventory.consolidationCheckpointHandoff.reviewerAssignmentPerformed,
    false
  );
  assert.equal(inventory.consolidationCheckpointHandoff.evaluatorExecuted, false);
  assert.equal(
    inventory.consolidationCheckpointHandoff.evaluatorExecutionRequested,
    false
  );
  assert.equal(
    inventory.consolidationCheckpointHandoff.evaluatorResultProduced,
    false
  );
  assert.equal(
    inventory.consolidationCheckpointHandoff.approvalDecisionProduced,
    false
  );
  assert.equal(
    inventory.consolidationCheckpointHandoff.approvalGrantProduced,
    false
  );
  assert.equal(
    inventory.consolidationCheckpointHandoff.approvalGrantPersisted,
    false
  );
  assert.equal(
    inventory.consolidationCheckpointHandoff.runtimePermissionGranted,
    false
  );
  assert.equal(
    inventory.consolidationCheckpointHandoff.commandExposurePermissionGranted,
    false
  );
  assert.equal(
    inventory.consolidationCheckpointHandoff.runtimeCommandExposureEnabled,
    false
  );
  assert.equal(
    inventory.consolidationCheckpointHandoff.runtimeExecutionEnabled,
    false
  );
  assert.equal(inventory.cleanupHardeningToolkitEvidence.cargoAuditRequired, true);
  assert.equal(inventory.cleanupHardeningToolkitEvidence.cargoMacheteRequired, true);
  assert.equal(
    inventory.cleanupHardeningToolkitEvidence.toolsInstalledByPhase543,
    false
  );
  assert.equal(inventory.cleanupHardeningToolkitEvidence.fallowRuntimeUsed, false);
  assertAllFalse(inventory.blockedRuntimeEffect);
  assert.equal(inventory.serveRuntimeBlockedBehavior.defaultBlocked, true);
  assert.equal(inventory.serveRuntimeBlockedBehavior.dryRunBlocked, true);
  assert.equal(inventory.serveRuntimeBlockedBehavior.dryRunBypassesBlock, false);
  assert.equal(inventory.serveRuntimeBlockedBehavior.stdout, "");
  assert.equal(inventory.forbiddenBehavior.reviewerRoutingPerformed, false);
  assert.equal(inventory.forbiddenBehavior.reviewerAssignmentPerformed, false);
  assert.equal(inventory.forbiddenBehavior.evaluatorExecutionPerformed, false);
  assert.equal(inventory.forbiddenBehavior.evaluatorResultProduced, false);
  assert.equal(inventory.forbiddenBehavior.approvalDecisionProduced, false);
  assert.equal(inventory.forbiddenBehavior.approvalGrantProduced, false);
  assert.equal(inventory.forbiddenBehavior.approvalGrantPersisted, false);
  assert.equal(inventory.forbiddenBehavior.runtimePermissionGranted, false);
  assert.equal(inventory.forbiddenBehavior.commandExposurePermissionGranted, false);
  assert.equal(inventory.forbiddenBehavior.runtimeCommandExposureEnabled, false);
  assert.equal(inventory.forbiddenBehavior.runtimeExecutionEnabled, false);
  assert.ok(
    inventory.validationCommands.includes(
      "node --test tests/phase5-43-review-only-consolidation-checkpoint-handoff.test.mjs"
    )
  );
  assert.deepEqual(inventory.optionalAdvisoryCommands, [
    "knip",
    "depcheck",
    "osv-scanner scan .",
    "trivy fs --scanners vuln,secret,misconfig .",
    "semgrep --config auto ."
  ]);
  assert.equal(
    report.safetyPosture.phase543ReviewOnlyConsolidationCheckpointHandoff,
    true
  );
  assertSafetyFlags(report, phase543ExpectedTrueSafetyFlagNames, true);
  assertSafetyFlags(report, phase543ExpectedFalseSafetyFlagNames, false);
});

test("report inventories Phase 5.44 as review-only consolidation metadata checkpoint", async () => {
  const report = await runReport();
  const inventory =
    report.phase544ReviewOnlyConsolidationMetadataCheckpointInventory;

  assert.equal(
    inventory.statusLayer.layerId,
    "review-only-consolidation-metadata-checkpoint"
  );
  assert.deepEqual(
    inventory.docs.map(({ path, status }) => [path, status]),
    phase544DocFiles.map((path) => [path, "present"])
  );
  assert.deepEqual(inventory.crossLinks, phase544CrossLinks);
  assert.equal(
    inventory.statusLayer.consolidationMetadataCheckpointIsReviewerRouting,
    false
  );
  assert.equal(
    inventory.statusLayer.consolidationMetadataCheckpointIsReviewerAssignment,
    false
  );
  assert.equal(
    inventory.statusLayer.consolidationMetadataCheckpointIsEvaluatorExecution,
    false
  );
  assert.equal(
    inventory.statusLayer.consolidationMetadataCheckpointIsEvaluatorResult,
    false
  );
  assert.equal(
    inventory.statusLayer.consolidationMetadataCheckpointIsApprovalDecision,
    false
  );
  assert.equal(
    inventory.statusLayer.consolidationMetadataCheckpointIsApprovalGrant,
    false
  );
  assert.equal(inventory.statusLayer.nestedApprovalGrantRejected, true);
  assert.equal(inventory.statusLayer.nestedApprovalDecisionRejected, true);
  assert.equal(inventory.statusLayer.nestedReviewerAssignmentRejected, true);
  assert.equal(inventory.statusLayer.nestedReviewerRoutingRejected, true);
  assert.equal(inventory.statusLayer.nestedEvaluatorExecutionRejected, true);
  assert.equal(inventory.statusLayer.nestedEvaluatorResultRejected, true);
  assert.equal(inventory.statusLayer.nestedRuntimeEffectRejected, true);
  assert.equal(inventory.statusLayer.nestedCommandExposureRejected, true);
  assert.equal(inventory.statusLayer.nestedExternalSourceLookupRejected, true);
  assert.equal(inventory.statusLayer.nestedFilesystemWatcherRejected, true);
  assert.equal(
    inventory.statusLayer.nestedUrlFilePathEnvSecretsProcessControlRejected,
    true
  );
  assert.equal(inventory.statusLayer.externalSystemLookingMetadataRejected, true);
  assert.equal(inventory.statusLayer.connectorPermissionLookingMetadataRejected, true);
  assert.equal(
    inventory.statusLayer.missingMalformedOrMismatchedSourceDigestRejected,
    true
  );
  assert.equal(inventory.statusLayer.malformedSourceEntryArraysRejected, true);
  assert.equal(inventory.statusLayer.reviewerRoutingPerformed, false);
  assert.equal(inventory.statusLayer.reviewerAssignmentPerformed, false);
  assert.equal(inventory.statusLayer.evaluatorExecutionPerformed, false);
  assert.equal(inventory.statusLayer.evaluatorResultProduced, false);
  assert.equal(inventory.statusLayer.approvalDecisionProduced, false);
  assert.equal(inventory.statusLayer.approvalGrantProduced, false);
  assert.equal(inventory.statusLayer.approvalGrantPersisted, false);
  assert.equal(inventory.statusLayer.runtimePermissionGranted, false);
  assert.equal(inventory.statusLayer.commandExposurePermissionGranted, false);
  assert.equal(inventory.statusLayer.runtimeExecutionEnabled, false);
  assert.equal(inventory.statusLayer.connectorIngestionAdded, false);
  assert.equal(inventory.statusLayer.externalSystemIntegrated, false);
  assert.equal(inventory.statusLayer.serveRuntimeStillDefaultBlocked, true);
  assert.equal(inventory.statusLayer.dryRunBypassesBlock, false);
  assert.equal(inventory.statusLayer.cliSourceChanged, false);
  assert.equal(inventory.statusLayer.rustSourceChanged, false);
  assert.deepEqual(
    inventory.machineReadableArtifacts.map(({ path, status }) => [path, status]),
    [
      [
        "tests/fixtures/host-policy/phase5-44/review-only-consolidation-metadata-checkpoint.json",
        "present"
      ]
    ]
  );
  assert.deepEqual(
    inventory.tests.map(({ path, status }) => [path, status]),
    [
      ["tests/report-phase-status.test.mjs", "present"],
      [
        "tests/phase5-44-review-only-consolidation-metadata-checkpoint.test.mjs",
        "present"
      ]
    ]
  );
  assert.deepEqual(inventory.ownershipBoundary.cliRuntimeSourceFilesChanged, []);
  assert.deepEqual(inventory.ownershipBoundary.rustRuntimeSourceFilesChanged, []);
  assert.equal(
    inventory.sourcePhase.phase,
    "phase-5.43-review-only-consolidation-checkpoint-handoff"
  );
  assert.deepEqual(
    inventory.consolidationMetadataCheckpointCases.map(({ caseId }) => caseId),
    phase544ExpectedCaseIds
  );
  assert.deepEqual(
    inventory.nestedSourceRegressionCases.map(({ caseId }) => caseId),
    phase544ExpectedNestedRegressionCaseIds
  );
  assert.equal(
    inventory.consolidationMetadataCheckpoint.schema,
    "ardyn.phase-5.44.review-only-consolidation-metadata-checkpoint-state"
  );
  assert.equal(
    inventory.consolidationMetadataCheckpoint
      .consolidationMetadataCheckpointMetadataOnly,
    true
  );
  assert.equal(
    inventory.consolidationMetadataCheckpoint
      .sourceConsolidationCheckpointHandoff
      .consolidationCheckpointHandoffMetadataOnly,
    true
  );
  assert.equal(
    inventory.consolidationMetadataCheckpoint
      .consolidationMetadataCheckpointIsReviewerRouting,
    false
  );
  assert.equal(
    inventory.consolidationMetadataCheckpoint
      .consolidationMetadataCheckpointIsReviewerAssignment,
    false
  );
  assert.equal(
    inventory.consolidationMetadataCheckpoint
      .consolidationMetadataCheckpointIsEvaluatorExecution,
    false
  );
  assert.equal(
    inventory.consolidationMetadataCheckpoint
      .consolidationMetadataCheckpointIsEvaluatorResult,
    false
  );
  assert.equal(
    inventory.consolidationMetadataCheckpoint
      .consolidationMetadataCheckpointIsApprovalDecision,
    false
  );
  assert.equal(
    inventory.consolidationMetadataCheckpoint
      .consolidationMetadataCheckpointIsApprovalGrant,
    false
  );
  assert.equal(
    inventory.consolidationMetadataCheckpoint.reviewerRoutingPerformed,
    false
  );
  assert.equal(
    inventory.consolidationMetadataCheckpoint.reviewerAssignmentPerformed,
    false
  );
  assert.equal(inventory.consolidationMetadataCheckpoint.evaluatorExecuted, false);
  assert.equal(
    inventory.consolidationMetadataCheckpoint.evaluatorExecutionRequested,
    false
  );
  assert.equal(
    inventory.consolidationMetadataCheckpoint.evaluatorResultProduced,
    false
  );
  assert.equal(
    inventory.consolidationMetadataCheckpoint.approvalDecisionProduced,
    false
  );
  assert.equal(
    inventory.consolidationMetadataCheckpoint.approvalGrantProduced,
    false
  );
  assert.equal(
    inventory.consolidationMetadataCheckpoint.approvalGrantPersisted,
    false
  );
  assert.equal(
    inventory.consolidationMetadataCheckpoint.runtimePermissionGranted,
    false
  );
  assert.equal(
    inventory.consolidationMetadataCheckpoint.commandExposurePermissionGranted,
    false
  );
  assert.equal(
    inventory.consolidationMetadataCheckpoint.runtimeCommandExposureEnabled,
    false
  );
  assert.equal(
    inventory.consolidationMetadataCheckpoint.runtimeExecutionEnabled,
    false
  );
  assert.equal(inventory.cleanupHardeningToolkitEvidence.cargoAuditRequired, true);
  assert.equal(inventory.cleanupHardeningToolkitEvidence.cargoMacheteRequired, true);
  assert.equal(
    inventory.cleanupHardeningToolkitEvidence.toolsInstalledByPhase544,
    false
  );
  assert.equal(inventory.cleanupHardeningToolkitEvidence.fallowRuntimeUsed, false);
  assertAllFalse(inventory.blockedRuntimeEffect);
  assert.equal(inventory.serveRuntimeBlockedBehavior.defaultBlocked, true);
  assert.equal(inventory.serveRuntimeBlockedBehavior.dryRunBlocked, true);
  assert.equal(inventory.serveRuntimeBlockedBehavior.dryRunBypassesBlock, false);
  assert.equal(inventory.serveRuntimeBlockedBehavior.stdout, "");
  assert.equal(inventory.forbiddenBehavior.reviewerRoutingPerformed, false);
  assert.equal(inventory.forbiddenBehavior.reviewerAssignmentPerformed, false);
  assert.equal(inventory.forbiddenBehavior.evaluatorExecutionPerformed, false);
  assert.equal(inventory.forbiddenBehavior.evaluatorResultProduced, false);
  assert.equal(inventory.forbiddenBehavior.approvalDecisionProduced, false);
  assert.equal(inventory.forbiddenBehavior.approvalGrantProduced, false);
  assert.equal(inventory.forbiddenBehavior.approvalGrantPersisted, false);
  assert.equal(inventory.forbiddenBehavior.runtimePermissionGranted, false);
  assert.equal(inventory.forbiddenBehavior.commandExposurePermissionGranted, false);
  assert.equal(inventory.forbiddenBehavior.runtimeCommandExposureEnabled, false);
  assert.equal(inventory.forbiddenBehavior.runtimeExecutionEnabled, false);
  assert.equal(inventory.forbiddenBehavior.connectorIngestionAdded, false);
  assert.equal(inventory.forbiddenBehavior.externalSystemIntegrated, false);
  assert.ok(
    inventory.validationCommands.includes(
      "node --test tests/phase5-44-review-only-consolidation-metadata-checkpoint.test.mjs"
    )
  );
  assert.deepEqual(inventory.optionalAdvisoryCommands, [
    "knip",
    "depcheck --json",
    "osv-scanner scan .",
    "trivy fs --scanners vuln,secret,misconfig .",
    "semgrep --config auto ."
  ]);
  assert.equal(
    report.safetyPosture.phase544ReviewOnlyConsolidationMetadataCheckpoint,
    true
  );
  assertSafetyFlags(report, phase544ExpectedTrueSafetyFlagNames, true);
  assertSafetyFlags(report, phase544ExpectedFalseSafetyFlagNames, false);
});

test("report inventories Phase 5.44A as focused prototype-pollution hardening", async () => {
  const report = await runReport();
  const inventory = report.phase544APrototypePollutionHardeningInventory;

  assert.equal(
    inventory.statusLayer.document,
    "docs/phase-5-44a-prototype-pollution-hardening.md"
  );
  assert.equal(inventory.statusLayer.affectedFile, "packages/core/src/index.mjs");
  assert.equal(
    inventory.statusLayer.affectedHelper,
    "reviewOnlyEvaluatorPreflightPathValue"
  );
  assert.equal(inventory.statusLayer.affectedSemgrepLineBeforePatch, 8709);
  assert.equal(
    inventory.statusLayer.semgrepCheckId,
    "javascript.lang.security.audit.prototype-pollution.prototype-pollution-loop.prototype-pollution-loop"
  );
  assert.equal(
    inventory.statusLayer.hardeningApproach,
    "reserved path segments are rejected and nested path traversal uses descriptor-based own data-property reads"
  );
  assert.deepEqual(inventory.statusLayer.prototypePollutionKeysBlocked, [
    "__proto__",
    "constructor",
    "prototype"
  ]);
  assert.equal(inventory.statusLayer.normalMetadataKeysPreserved, true);
  assert.equal(inventory.statusLayer.reviewOnlyMetadataChainContinued, false);
  assert.equal(inventory.statusLayer.runtimeStarted, false);
  assert.equal(inventory.statusLayer.runtimeReady, false);
  assert.equal(inventory.statusLayer.runtimeExecuted, false);
  assert.equal(inventory.statusLayer.connectorIngestionAdded, false);
  assert.equal(inventory.statusLayer.secureDropImplemented, false);
  assert.equal(inventory.statusLayer.cliSourceChanged, false);
  assert.equal(inventory.statusLayer.rustSourceChanged, false);
  assert.deepEqual(
    inventory.docs.map(({ path, status }) => [path, status]),
    [
      ["docs/phase-5-44a-prototype-pollution-hardening.md", "present"],
      ["README.md", "present"]
    ]
  );
  assert.deepEqual(
    inventory.tests.map(({ path, status }) => [path, status]),
    [
      [
        "tests/phase5-28-review-only-evaluator-preflight-checkpoint.test.mjs",
        "present"
      ],
      ["tests/report-phase-status.test.mjs", "present"]
    ]
  );
  assert.deepEqual(inventory.semgrepBaseline, {
    command: "semgrep --config auto .",
    beforeFindings: 1,
    afterExpectedFindings: 0,
    findingFile: "packages/core/src/index.mjs",
    findingLineBeforePatch: 8709,
    findingBlamedCommit: "bb85a2c8",
    findingStatus: "fixed-in-phase-5.44a"
  });
  assert.deepEqual(inventory.regressionCoverage.keysCovered, [
    "__proto__",
    "constructor",
    "prototype"
  ]);
  assert.equal(inventory.regressionCoverage.inheritedPrototypeGrantDataIgnored, true);
  assert.equal(inventory.regressionCoverage.unsafeOwnMetadataKeysFailClosed, true);
  assert.equal(inventory.regressionCoverage.objectPrototypeMutationPrevented, true);
  assert.equal(inventory.regressionCoverage.normalMetadataBehaviorPreserved, true);
  assert.deepEqual(inventory.ownershipBoundary.cliRuntimeSourceFilesChanged, []);
  assert.deepEqual(inventory.ownershipBoundary.rustRuntimeSourceFilesChanged, []);
  assert.equal(inventory.serveRuntimeBlockedBehavior.defaultBlocked, true);
  assert.equal(inventory.serveRuntimeBlockedBehavior.dryRunBlocked, true);
  assert.equal(inventory.serveRuntimeBlockedBehavior.dryRunBypassesBlock, false);
  assert.equal(inventory.serveRuntimeBlockedBehavior.stdout, "");
  assert.equal(inventory.forbiddenBehavior.reviewerRoutingPerformed, false);
  assert.equal(inventory.forbiddenBehavior.reviewerAssignmentPerformed, false);
  assert.equal(inventory.forbiddenBehavior.evaluatorExecutionPerformed, false);
  assert.equal(inventory.forbiddenBehavior.evaluatorResultProduced, false);
  assert.equal(inventory.forbiddenBehavior.approvalDecisionProduced, false);
  assert.equal(inventory.forbiddenBehavior.approvalGrantProduced, false);
  assert.equal(inventory.forbiddenBehavior.approvalGrantPersisted, false);
  assert.equal(inventory.forbiddenBehavior.runtimePermissionGranted, false);
  assert.equal(inventory.forbiddenBehavior.commandExposurePermissionGranted, false);
  assert.equal(inventory.forbiddenBehavior.runtimeCommandExposureEnabled, false);
  assert.equal(inventory.forbiddenBehavior.runtimeExecutionEnabled, false);
  assert.equal(inventory.forbiddenBehavior.connectorIngestionAdded, false);
  assert.equal(inventory.forbiddenBehavior.secureDropImplemented, false);
  assert.equal(inventory.safetyPosture.prototypePollutionFindingFixed, true);
  assert.equal(inventory.safetyPosture.reviewOnlyMetadataChainContinued, false);
  assert.equal(inventory.safetyPosture.runtimeBlocked, true);
  assert.equal(inventory.safetyPosture.runtimeEnabled, false);
  assert.equal(inventory.safetyPosture.runtimeCommandExposureEnabled, false);
  assert.equal(inventory.safetyPosture.runtimeExecutionEnabled, false);
  assert.equal(inventory.safetyPosture.reviewerRoutingPerformed, false);
  assert.equal(inventory.safetyPosture.reviewerAssignmentPerformed, false);
  assert.equal(inventory.safetyPosture.evaluatorExecutionPerformed, false);
  assert.equal(inventory.safetyPosture.evaluatorResultProduced, false);
  assert.equal(inventory.safetyPosture.approvalDecisionProduced, false);
  assert.equal(inventory.safetyPosture.approvalGrantProduced, false);
  assert.equal(inventory.safetyPosture.approvalGrantPersisted, false);
  assert.equal(inventory.safetyPosture.commandExposurePermissionGranted, false);
  assert.equal(inventory.safetyPosture.connectorIngestionAdded, false);
  assert.equal(inventory.safetyPosture.secureDropImplemented, false);
  assert.equal(inventory.safetyPosture.serveRuntimeStillDefaultBlocked, true);
  assert.equal(inventory.safetyPosture.dryRunBypassesBlock, false);
  assert.equal(inventory.safetyPosture.noCliSourceChange, true);
  assert.equal(inventory.safetyPosture.noRustSourceChange, true);
  assert.equal(report.safetyPosture.phase544APrototypePollutionHardening, true);
});

test("report inventories Phase 5.45 as Locus/Multiverse target-consumer planning metadata", async () => {
  const report = await runReport();
  const inventory = report.phase545TargetConsumerPlanningMetadataInventory;
  const consumers = new Map(
    inventory.targetConsumers.map((consumer) => [consumer.consumerId, consumer])
  );
  const locus = consumers.get("locus");
  const multiverse = consumers.get("multiverse");

  assert.equal(inventory.statusLayer.layerId, "target-consumer-planning-metadata");
  assert.deepEqual(
    inventory.docs.map(({ path, status }) => [path, status]),
    phase545DocFiles.map((path) => [path, "present"])
  );
  assert.deepEqual(inventory.crossLinks, phase545CrossLinks);
  assert.deepEqual(inventory.statusLayer.targetConsumerIds, [
    "locus",
    "multiverse"
  ]);
  assert.equal(inventory.statusLayer.primaryHarnessFrameworkWrapperLayer, true);
  assert.equal(inventory.statusLayer.locusFirstClassTargetConsumer, true);
  assert.equal(inventory.statusLayer.multiverseFirstClassTargetConsumer, true);
  assert.equal(
    inventory.statusLayer.secureDropFutureContentFabricCapabilityReferenceOnly,
    true
  );
  assert.equal(inventory.statusLayer.commandRuntimeControlEnabled, false);
  assert.equal(inventory.statusLayer.connectorGrantProduced, false);
  assert.equal(inventory.statusLayer.fabricRuntimeSurfaceEnabled, false);
  assert.equal(inventory.statusLayer.contentFabricRuntimeBehaviorEnabled, false);
  assert.equal(inventory.statusLayer.secureDropImplemented, false);
  assert.equal(inventory.statusLayer.secureDropCryptoImplemented, false);
  assert.equal(inventory.statusLayer.secureDropTransportImplemented, false);
  assert.equal(inventory.statusLayer.secureDropStegoImplemented, false);
  assert.equal(inventory.statusLayer.secureDropSendReceiveImplemented, false);
  assert.equal(inventory.statusLayer.secureDropInboxPollingEnabled, false);
  assert.equal(inventory.statusLayer.fileSelectionEnabled, false);
  assert.equal(inventory.statusLayer.filesystemScanningEnabled, false);
  assert.equal(inventory.statusLayer.secretVaultEnvAccessEnabled, false);
  assert.equal(inventory.statusLayer.st3ggVendored, false);
  assert.equal(inventory.statusLayer.cliSourceChanged, false);
  assert.equal(inventory.statusLayer.rustSourceChanged, false);
  assert.equal(inventory.statusLayer.fabricSourceChanged, false);
  assert.deepEqual(
    inventory.machineReadableArtifacts.map(({ path, status }) => [path, status]),
    [
      [
        "tests/fixtures/host-policy/phase5-45/target-consumer-planning-metadata.json",
        "present"
      ]
    ]
  );
  assert.deepEqual(
    inventory.tests.map(({ path, status }) => [path, status]),
    [
      [
        "tests/phase5-45-target-consumer-planning-metadata.test.mjs",
        "present"
      ],
      ["tests/report-phase-status.test.mjs", "present"]
    ]
  );
  assert.deepEqual(inventory.ownershipBoundary.cliRuntimeSourceFilesChanged, []);
  assert.deepEqual(inventory.ownershipBoundary.rustRuntimeSourceFilesChanged, []);
  assert.deepEqual(inventory.ownershipBoundary.fabricRuntimeSourceFilesChanged, []);
  assert.deepEqual(inventory.ownershipBoundary.locusRepoFilesChanged, []);
  assert.deepEqual(inventory.ownershipBoundary.multiverseRepoFilesChanged, []);
  assert.deepEqual(inventory.ownershipBoundary.contentFabricRepoFilesChanged, []);
  assert.equal(
    inventory.sourceConsolidationMetadataCheckpointSummary.schema,
    "ardyn.phase-5.44.review-only-consolidation-metadata-checkpoint-state"
  );
  assert.equal(
    inventory.targetConsumerPlanningMetadata.schema,
    "ardyn.phase-5.45.target-consumer-planning-metadata-state"
  );
  assert.deepEqual(inventory.targetConsumerPlanningMetadata.targetConsumerIds, [
    "locus",
    "multiverse"
  ]);
  assert.equal(locus.firstClassTargetConsumer, true);
  assert.equal(locus.statusControlSurfaceContracts.commandControlEnabled, false);
  assert.equal(locus.statusControlSurfaceContracts.runtimeControlEnabled, false);
  assert.equal(locus.processToolCapabilityMetadata.processControlEnabled, false);
  assert.equal(locus.processToolCapabilityMetadata.toolExecutionEnabled, false);
  assert.equal(locus.reviewArtifacts.locusVisibleReviewArtifacts, true);
  assert.equal(
    locus.secureDropFutureContractReferences.canonicalCapabilityOwner,
    "content-fabric"
  );
  assert.equal(locus.secureDropFutureContractReferences.ardynConsumesNow, false);
  assertAllFalse(locus.nonAuthorizingBoundary);
  assert.equal(multiverse.firstClassTargetConsumer, true);
  assert.equal(
    multiverse.worldProjectOrchestrationContracts.liveRegistryConnectionEnabled,
    false
  );
  assert.equal(multiverse.visibleAiCapabilityMetadata.evaluatorExecutionEnabled, false);
  assert.equal(multiverse.taskCapabilityWrapperContracts.taskExecutionEnabled, false);
  assert.equal(multiverse.taskCapabilityWrapperContracts.mcpExecutionEnabled, false);
  assert.equal(
    multiverse.citizenAdapterCandidateMetadata.adapterRuntimeBehaviorEnabled,
    false
  );
  assert.equal(
    multiverse.fabricCoordinationMetadata.fabricRuntimeSurfaceEnabled,
    false
  );
  assert.equal(
    multiverse.fabricCoordinationMetadata.contentFabricRuntimeBehaviorEnabled,
    false
  );
  assertAllFalse(multiverse.nonAuthorizingBoundary);
  assert.equal(
    inventory.secureDropFutureCapability.canonicalCapability,
    "content-fabric.secure-drop"
  );
  assert.equal(inventory.secureDropFutureCapability.ardynConsumesNow, false);
  assert.equal(inventory.secureDropFutureCapability.cryptoImplemented, false);
  assert.equal(inventory.secureDropFutureCapability.transportImplemented, false);
  assert.equal(inventory.secureDropFutureCapability.stegoImplemented, false);
  assert.equal(inventory.secureDropFutureCapability.sendReceiveImplemented, false);
  assert.equal(inventory.secureDropFutureCapability.inboxPollingImplemented, false);
  assert.equal(inventory.secureDropFutureCapability.fileSelectionImplemented, false);
  assert.equal(
    inventory.secureDropFutureCapability.filesystemScanningImplemented,
    false
  );
  assert.equal(
    inventory.secureDropFutureCapability.connectorIngestionImplemented,
    false
  );
  assert.equal(inventory.secureDropFutureCapability.secretVaultEnvAccessImplemented, false);
  assert.equal(inventory.secureDropFutureCapability.st3ggVendored, false);
  assertAllFalse(inventory.blockedRuntimeEffect);
  assertAllFalse(inventory.forbiddenBehavior);
  assert.equal(inventory.serveRuntimeBlockedBehavior.defaultBlocked, true);
  assert.equal(inventory.serveRuntimeBlockedBehavior.dryRunBlocked, true);
  assert.equal(inventory.serveRuntimeBlockedBehavior.dryRunBypassesBlock, false);
  assert.ok(
    inventory.validationCommands.includes(
      "node --test tests/phase5-45-target-consumer-planning-metadata.test.mjs"
    )
  );
  assert.deepEqual(inventory.optionalAdvisoryCommands, [
    "semgrep --config auto ."
  ]);
  assert.equal(report.safetyPosture.phase545TargetConsumerPlanningMetadata, true);
  assertSafetyFlags(report, phase545ExpectedTrueSafetyFlagNames, true);
  assertSafetyFlags(report, phase545ExpectedFalseSafetyFlagNames, false);
});

test("report inventories Phase 5.46 as Locus/Multiverse consumer contract readiness matrix", async () => {
  const report = await runReport();
  const inventory = report.phase546ConsumerContractReadinessMatrixInventory;
  const rows = new Map(inventory.matrixRows.map((row) => [row.rowId, row]));

  assert.equal(inventory.statusLayer.layerId, "consumer-contract-readiness-matrix");
  assert.deepEqual(
    inventory.docs.map(({ path, status }) => [path, status]),
    phase546DocFiles.map((path) => [path, "present"])
  );
  assert.deepEqual(inventory.crossLinks, phase546CrossLinks);
  assert.deepEqual(inventory.statusLayer.targetConsumerIds, [
    "locus",
    "multiverse"
  ]);
  assert.equal(inventory.statusLayer.rowCount, 11);
  assert.equal(inventory.statusLayer.locusRowCount, 5);
  assert.equal(inventory.statusLayer.multiverseRowCount, 6);
  assert.equal(inventory.statusLayer.locusTouchpointsCovered, true);
  assert.equal(inventory.statusLayer.multiverseTouchpointsCovered, true);
  assert.equal(
    inventory.statusLayer.secureDropFutureContentFabricCapabilityReferenceOnly,
    true
  );
  assert.equal(inventory.statusLayer.commandRuntimeControlEnabled, false);
  assert.equal(inventory.statusLayer.connectorGrantProduced, false);
  assert.equal(inventory.statusLayer.webSocketRuntimeEnabled, false);
  assert.equal(inventory.statusLayer.taskRuntimeExecutionEnabled, false);
  assert.equal(inventory.statusLayer.taskExecutionEnabled, false);
  assert.equal(inventory.statusLayer.mcpRuntimeExecutionEnabled, false);
  assert.equal(inventory.statusLayer.mcpToolExposureEnabled, false);
  assert.equal(inventory.statusLayer.fabricRuntimeSurfaceEnabled, false);
  assert.equal(inventory.statusLayer.contentFabricRuntimeBehaviorEnabled, false);
  assert.equal(inventory.statusLayer.secureDropImplemented, false);
  assert.equal(inventory.statusLayer.secureDropCryptoImplemented, false);
  assert.equal(inventory.statusLayer.secureDropTransportImplemented, false);
  assert.equal(inventory.statusLayer.secureDropStegoImplemented, false);
  assert.equal(inventory.statusLayer.secureDropSendReceiveImplemented, false);
  assert.equal(inventory.statusLayer.secureDropInboxPollingEnabled, false);
  assert.equal(inventory.statusLayer.fileSelectionEnabled, false);
  assert.equal(inventory.statusLayer.filesystemScanningEnabled, false);
  assert.equal(inventory.statusLayer.secretVaultEnvAccessEnabled, false);
  assert.equal(inventory.statusLayer.st3ggVendored, false);
  assert.equal(inventory.statusLayer.fallowRuntimeUsed, false);
  assert.equal(inventory.statusLayer.cliSourceChanged, false);
  assert.equal(inventory.statusLayer.rustSourceChanged, false);
  assert.equal(inventory.statusLayer.fabricSourceChanged, false);
  assert.deepEqual(
    inventory.machineReadableArtifacts.map(({ path, status }) => [path, status]),
    [
      [
        "tests/fixtures/host-policy/phase5-46/consumer-contract-readiness-matrix.json",
        "present"
      ]
    ]
  );
  assert.deepEqual(
    inventory.tests.map(({ path, status }) => [path, status]),
    [
      [
        "tests/phase5-46-consumer-contract-readiness-matrix.test.mjs",
        "present"
      ],
      ["tests/report-phase-status.test.mjs", "present"]
    ]
  );
  assert.deepEqual(inventory.ownershipBoundary.cliRuntimeSourceFilesChanged, []);
  assert.deepEqual(inventory.ownershipBoundary.rustRuntimeSourceFilesChanged, []);
  assert.deepEqual(inventory.ownershipBoundary.fabricRuntimeSourceFilesChanged, []);
  assert.deepEqual(inventory.ownershipBoundary.locusRepoFilesChanged, []);
  assert.deepEqual(inventory.ownershipBoundary.multiverseRepoFilesChanged, []);
  assert.deepEqual(inventory.ownershipBoundary.contentFabricRepoFilesChanged, []);
  assert.equal(inventory.ownershipBoundary.mcpToolExposureAddedByThisPhase, false);
  assert.equal(inventory.ownershipBoundary.fallowRuntimeUsedByThisPhase, false);
  assert.equal(
    inventory.sourceTargetConsumerPlanningMetadataSummary.schema,
    "ardyn.phase-5.45.target-consumer-planning-metadata-state"
  );
  assert.equal(
    inventory.consumerContractReadinessMatrix.schema,
    "ardyn.phase-5.46.consumer-contract-readiness-matrix-state"
  );
  assert.deepEqual(inventory.consumerContractReadinessMatrix.targetConsumerIds, [
    "locus",
    "multiverse"
  ]);
  assert.deepEqual([...rows.keys()], [
    "locus.status-control-surface-display",
    "locus.process-tool-capability-metadata",
    "locus.visible-review-artifacts",
    "locus.future-secure-drop-compose-inbox-surface",
    "locus.command-control-runtime-boundary",
    "multiverse.world-project-orchestration-metadata",
    "multiverse.visible-ai-capability-metadata",
    "multiverse.task-capability-wrapper-metadata",
    "multiverse.review-only-citizen-adapter-candidate-metadata",
    "multiverse.registry-websocket-mcp-task-runtime-boundary",
    "multiverse.fabric-coordination-metadata"
  ]);
  for (const row of rows.values()) {
    assert.equal(row.readinessState, "future-contract-required-runtime-blocked");
    assert.equal(row.authorizationFlags.documentaryMetadataVisible, true);
    for (const [key, value] of Object.entries(row.authorizationFlags)) {
      if (key !== "documentaryMetadataVisible") {
        assert.equal(value, false, `${row.rowId}.${key}`);
      }
    }
  }
  assert.ok(
    rows
      .get("locus.future-secure-drop-compose-inbox-surface")
      .requiredFutureContracts.includes(
        "content-fabric.secure-drop.compose-consumer-contract"
      )
  );
  assert.ok(
    rows
      .get("multiverse.registry-websocket-mcp-task-runtime-boundary")
      .explicitlyForbiddenBehavior.includes("MCP tool exposure")
  );
  assert.ok(
    rows
      .get("multiverse.fabric-coordination-metadata")
      .explicitlyForbiddenBehavior.includes("Fabric runtime surface")
  );
  assertAllFalse(inventory.blockedRuntimeEffect);
  assertAllFalse(inventory.forbiddenBehavior);
  assert.equal(inventory.serveRuntimeBlockedBehavior.defaultBlocked, true);
  assert.equal(inventory.serveRuntimeBlockedBehavior.dryRunBlocked, true);
  assert.equal(inventory.serveRuntimeBlockedBehavior.dryRunBypassesBlock, false);
  assert.ok(
    inventory.validationCommands.includes(
      "node --test tests/phase5-46-consumer-contract-readiness-matrix.test.mjs"
    )
  );
  assert.deepEqual(inventory.optionalAdvisoryCommands, [
    "semgrep --config auto ."
  ]);
  assert.equal(report.safetyPosture.phase546ConsumerContractReadinessMatrix, true);
  assertSafetyFlags(report, phase546ExpectedTrueSafetyFlagNames, true);
  assertSafetyFlags(report, phase546ExpectedFalseSafetyFlagNames, false);
});

test("report inventories Phase 3.6 versioning, display contract, fixtures, docs, and tests", async () => {
  const report = await runReport();

  assert.deepEqual(report.phase36Inventory.reviewArtifactVersioning, {
    schema: "ardyn.approval-review-artifact",
    schemaVersion: "0.1.0",
    version: "0.1.0",
    compatibilityStates: ["compatible", "unsupported_major", "malformed"],
    supportedMajor: {
      schemaVersion: 0,
      version: 0
    },
    compatibleSameMajorDisplayOnly: true,
    fullArtifactValidationRequiresExactCurrentVersion: true,
    unsupportedMajorRejected: true,
    unknownFieldsPreservedForDisplay: true,
    deterministicFixtureTimestamps: {
      generatedAt: "2026-06-02T00:00:00.000Z",
      approvalDecisionCreatedAt: "1970-01-01T00:00:00.000Z"
    }
  });

  assert.deepEqual(report.phase36Inventory.displayContract, {
    locusRuntimeDependency: false,
    displaySummaryHelper: "buildApprovalReviewArtifactDisplaySummary",
    normalizationHelper: "normalizeApprovalReviewArtifactForDisplay",
    versionValidationHelper: "validateApprovalReviewArtifactVersion",
    compatibilityHelper: "classifyApprovalReviewArtifactCompatibility",
    displaysPlannerTraces: true,
    displaysReviewArtifacts: true,
    displaysTraceDiffs: true,
    approvalStatusDisplayRulesDocumented: true,
    severityMappingDocumented: true,
    unknownFieldsAreInertMetadata: true
  });

  assert.deepEqual(report.phase36Inventory.traceReviewFixtures, [
    {
      path: "tests/fixtures/trace-review/equal-left-approval-review-artifact.json",
      status: "present"
    },
    {
      path: "tests/fixtures/trace-review/equal-right-approval-review-artifact.json",
      status: "present"
    },
    {
      path: "tests/fixtures/trace-review/approval-status-changed-approval-review-artifact.json",
      status: "present"
    },
    {
      path: "tests/fixtures/trace-review/selected-capability-changed-approval-review-artifact.json",
      status: "present"
    },
    {
      path: "tests/fixtures/trace-review/unresolved-request-changed-approval-review-artifact.json",
      status: "present"
    },
    {
      path: "tests/fixtures/trace-review/invalid-review-artifact.json",
      status: "present"
    }
  ]);

  assert.deepEqual(
    report.phase36Inventory.docs.map(({ path, status }) => [path, status]),
    [
      ["README.md", "present"],
      ["apps/cli/README.md", "present"],
      ["docs/planner-policy-review.md", "present"],
      ["docs/planner-trace-review-workflow.md", "present"],
      ["docs/locus-trace-display-contract.md", "present"],
      ["docs/review-artifact-versioning-policy.md", "present"],
      ["docs/host-policy-preconditions.md", "present"],
      ["packages/core/README.md", "present"]
    ]
  );

  assert.deepEqual(
    report.phase36Inventory.tests.map(({ path, status }) => [path, status]),
    [
      ["tests/cli-phase3.test.mjs", "present"],
      ["tests/core-phase3-4-review-artifacts.test.mjs", "present"],
      ["tests/core-phase3-4-trace-comparison.test.mjs", "present"],
      ["tests/core-phase3-5-trace-fixtures.test.mjs", "present"],
      ["tests/core-phase3-6-review-artifact-versioning.test.mjs", "present"],
      ["tests/report-phase-status.test.mjs", "present"],
      ["tests/host-policy-preconditions.test.mjs", "present"]
    ]
  );
});

test("report inventories Phase 3.7 schema migration and attestation planning", async () => {
  const report = await runReport();

  assert.deepEqual(report.phase37Inventory.schemaMigrationMetadata, {
    schema: "ardyn.schema-migration-metadata",
    schemaVersion: "0.1.0",
    artifactKinds: [
      "manifest",
      "task",
      "planner_trace",
      "approval_review_artifact",
      "trace_diff",
      "host_policy"
    ],
    compatibilityStates: ["compatible", "upgrade_available", "unsupported_major", "malformed"],
    migrationRequiredFor: ["unsupported_major", "malformed"],
    migrationAvailableFor: ["upgrade_available"],
    nonExecuting: true
  });

  assert.deepEqual(report.phase37Inventory.attestationPlanning, {
    schema: "ardyn.review-artifact-attestation-plan",
    schemaVersion: "0.1.0",
    digestAlgorithm: "sha256",
    canonicalization: "ardyn.stable-json-display-v1",
    verificationStatuses: ["unsigned", "planned", "test_fixture_only", "unsupported"],
    productionSigningKeys: false,
    realSigning: false,
    secrets: false,
    nonExecuting: true,
    contentFabricAlignment:
      "Review-artifact attestation planning keeps payloads separate from Content Fabric signing payloads and does not enable Content Fabric runtime behavior."
  });

  assert.deepEqual(report.phase37Inventory.cliCommands, [
    {
      command: "ardyn review-artifact --file <file> --schema-status",
      writesFiles: false,
      network: false,
      summary:
        "Renders deterministic schema migration metadata and display status for one local review artifact."
    },
    {
      command: "ardyn review-artifact --file <file> --attestation-plan",
      writesFiles: false,
      network: false,
      summary:
        "Renders unsigned review-artifact attestation planning metadata for one local review artifact."
    }
  ]);

  assert.deepEqual(
    report.phase37Inventory.fixtures.map(({ path, status }) => [path, status]),
    [
      ["tests/fixtures/review-artifacts/phase3-7/current-compatible-review-artifact.json", "present"],
      ["tests/fixtures/review-artifacts/phase3-7/older-compatible-review-artifact.json", "present"],
      ["tests/fixtures/review-artifacts/phase3-7/unsupported-major-review-artifact.json", "present"],
      ["tests/fixtures/review-artifacts/phase3-7/malformed-review-artifact.json", "present"],
      ["tests/fixtures/review-artifacts/phase3-7/unsigned-attestation-plan.json", "present"],
      ["tests/fixtures/review-artifacts/phase3-7/test-fixture-only-attestation-plan.json", "present"],
      ["tests/fixtures/review-artifacts/phase3-7/migration-metadata-display.json", "present"]
    ]
  );

  assert.deepEqual(
    report.phase37Inventory.docs.map(({ path, status }) => [path, status]),
    [
      ["docs/schema-migration-policy.md", "present"],
      ["docs/review-artifact-attestation-plan.md", "present"]
    ]
  );

  assert.deepEqual(
    report.phase37Inventory.tests.map(({ path, status }) => [path, status]),
    [
      ["tests/core-phase3-7-schema-attestation.test.mjs", "present"],
      ["tests/cli-phase3.test.mjs", "present"]
    ]
  );
});

test("safety posture keeps every execution, network, plugin, torrent, and runtime flag false", async () => {
  const report = await runReport();

  assert.equal(report.safetyPosture.nonExecuting, true);
  assert.equal(report.safetyPosture.noSecrets, true);
  assert.equal(report.safetyPosture.noNetwork, true);
  assert.equal(report.safetyPosture.noProcessSpawn, true);
  assert.equal(report.safetyPosture.noStdioRuntime, true);
  assert.equal(report.safetyPosture.stdioDryRunEmitter, true);
  assert.equal(report.safetyPosture.stdioDryRunHardening, true);
  assert.equal(report.safetyPosture.stdioTransportPolicy, true);
  assert.equal(report.safetyPosture.stdioRustHostPolicyContracts, true);
  assert.equal(report.safetyPosture.stdioPolicyMetadataExport, true);
  assert.equal(report.safetyPosture.stdioPolicyReviewRecords, true);
  assert.equal(report.safetyPosture.hostPolicyReviewComparison, true);
  assert.equal(report.safetyPosture.reviewerHandoffIndex, true);
  assert.equal(report.safetyPosture.finalPreRuntimeReadiness, true);
  assert.equal(report.safetyPosture.runtimeProposal, true);
  assert.equal(report.safetyPosture.hostPolicyApprovalRecords, true);
  assert.equal(report.safetyPosture.transportHarnessContracts, true);
  assert.equal(report.safetyPosture.framingRedactionContracts, true);
  assert.equal(report.safetyPosture.transcriptReplayContracts, true);
  assert.equal(report.safetyPosture.failureAuditContracts, true);
  assert.equal(report.safetyPosture.runtimeReadinessCheckpoint, true);
  assert.equal(report.safetyPosture.externalReviewPacket, true);
  assert.equal(report.safetyPosture.externalReviewDisposition, true);
  assert.equal(report.safetyPosture.rustHostStdioHarness, true);
  assert.equal(report.safetyPosture.fixtureBackedStdioBoundaries, true);
  assert.equal(report.safetyPosture.stdioRuntimeContractGates, true);
  assert.equal(report.safetyPosture.runtimeImplementationReadinessInventory, true);
  assert.equal(report.safetyPosture.phase42ADeliberatelyBlockedRuntimeSkeleton, true);
  assert.equal(report.safetyPosture.phase42BLifecycleFailureAuditSkeleton, true);
  assert.equal(report.safetyPosture.phase42CRuntimeReadinessReviewGate, true);
  assert.equal(report.safetyPosture.phase42DExternalReviewDispositionPhase5Handoff, true);
  assert.equal(report.safetyPosture.phase51ControlledRuntimeImplementationApproval, true);
  assert.equal(report.safetyPosture.phase52GuardedRuntimeImplementationSlice, true);
  assert.equal(report.safetyPosture.phase53CommandSurfaceApprovalPreflight, true);
  assert.equal(report.safetyPosture.phase54DisabledCommandExposurePlan, true);
  assert.equal(report.safetyPosture.phase54AJulesReviewDisposition, true);
  assert.equal(report.safetyPosture.phase55DefaultBlockedRuntimeCli, true);
  assert.equal(report.safetyPosture.phase56RuntimeEnablePreconditionGate, true);
  assert.equal(report.safetyPosture.phase57RuntimeApprovalValidationContract, true);
  assert.equal(report.safetyPosture.phase58RuntimeCommandExposureApprovalContract, true);
  assert.equal(report.safetyPosture.phase59ApprovalEvaluatorGrantBoundaryContract, true);
  assert.equal(report.safetyPosture.phase510RuntimeHostPolicyBoundaryContract, true);
  assert.equal(report.safetyPosture.phase511RuntimeStdioSafetyBoundaryContract, true);
  assert.equal(report.safetyPosture.phase512RuntimeTranscriptAuditBoundaryContract, true);
  assert.equal(report.safetyPosture.phase513RuntimeProcessControlBoundaryContract, true);
  assert.equal(report.safetyPosture.phase514RuntimeRollbackKillSwitchBoundaryContract, true);
  assert.equal(report.safetyPosture.phase515PositiveRuntimeSmokeRequirementContract, true);
  assert.equal(report.safetyPosture.phase516RuntimeEnableReadinessCheckpoint, true);
  assert.equal(report.safetyPosture.phase517GuardedRuntimeImplementationPlan, true);
  assert.equal(report.safetyPosture.phase518ReviewOnlyApprovalEvaluatorSkeleton, true);
  assert.equal(report.safetyPosture.phase519ApprovalPrerequisiteReaderHardening, true);
  assert.equal(report.safetyPosture.phase520ApprovalPrerequisiteSourceIngestionPreflight, true);
  assert.equal(report.safetyPosture.phase521ApprovalPrerequisiteSourceSelection, true);
  assert.equal(report.safetyPosture.phase522ApprovalPrerequisiteSourceBundle, true);
  assert.equal(report.safetyPosture.phase523PrerequisiteBundleConsumptionCheckpoint, true);
  assert.equal(report.safetyPosture.phase524PrerequisiteEvaluationIntegrationCheckpoint, true);
  assert.equal(report.safetyPosture.phase525NonAuthorizingReviewArtifactBoundary, true);
  assert.equal(report.safetyPosture.phase526ReviewArtifactEvaluatorInputHandoff, true);
  assert.equal(report.safetyPosture.phase527ApprovalEvaluatorCandidateIntakeCheckpoint, true);
  assert.equal(report.safetyPosture.phase528ReviewOnlyEvaluatorPreflightCheckpoint, true);
  assert.equal(report.safetyPosture.phase529NonAuthorizingEvaluatorDecisionCandidateBoundary, true);
  assert.equal(
    report.safetyPosture.phase530NonAuthorizingEvaluatorDecisionCandidateInspectionArtifact,
    true
  );
  assert.equal(report.safetyPosture.phase531HumanToolInspectionDispositionBoundary, true);
  assert.equal(
    report.safetyPosture.phase532ReviewOnlyDispositionAggregationCheckpoint,
    true
  );
  assert.equal(report.safetyPosture.phase533ReviewOnlyAggregationInspectionHandoff, true);
  assert.equal(report.safetyPosture.phase534ReviewOnlyHandoffReadinessArtifact, true);
  assert.equal(report.safetyPosture.phase535ReviewOnlyReadinessInspectionCheckpoint, true);
  assert.equal(report.safetyPosture.phase536ReviewOnlyReadinessHandoffDispositionBoundary, true);
  assert.equal(report.safetyPosture.phase537ReviewOnlyHandoffDispositionInspectionCheckpoint, true);
  assert.equal(report.safetyPosture.phase538ReviewOnlyInspectionHandoffMetadataBoundary, true);
  assert.equal(report.safetyPosture.phase539ReviewOnlyInspectionHandoffCheckpoint, true);
  assert.equal(report.safetyPosture.phase540ReviewOnlyCheckpointHandoffLayer, true);
  assert.equal(report.safetyPosture.noLocusRuntimeDependency, true);

  const expectedFlags = {
    runtimeExecution: false,
    networkCalls: false,
    networkListeners: false,
    stdioRuntime: false,
    websocketRuntime: false,
    httpRuntime: false,
    locusRuntimeDependency: false,
    adapterConnections: false,
    mcpCalls: false,
    openClawCalls: false,
    pluginInstall: false,
    torrentDownload: false,
    codePackEnablement: false,
    autonomousLoops: false,
    contentFabricRuntimeBehavior: false,
    secretsUsed: false,
    processSpawning: false,
    phase41RuntimeImplemented: false,
    phase41IRuntimeImplemented: false,
    phase41JRuntimeImplemented: false,
    phase41JRuntimeReady: false,
    phase41KRuntimeImplemented: false,
    phase41KRuntimeReady: false,
    phase41KRuntimeContractGateEnabled: false,
    phase41LRuntimeImplemented: false,
    phase41LRuntimeReady: false,
    phase41LRuntimeImplementationReadinessCommandEnabled: false,
    phase42ARuntimeImplemented: false,
    phase42ARuntimeReady: false,
    phase42ARuntimeEnabled: false,
    phase42ARuntimeCommandEnabled: false,
    phase42AAppsCliIndexChanged: false,
    phase42BRuntimeImplemented: false,
    phase42BRuntimeReady: false,
    phase42BRuntimeEnabled: false,
    phase42BRuntimeCommandEnabled: false,
    phase42BAppsCliIndexChanged: false,
    phase42BProcessControlEnabled: false,
    phase42BFailureAuditRuntimeEnabled: false,
    phase42BTranscriptPersistenceRuntimeEnabled: false,
    phase42CReadyForExternalReview: true,
    phase42CRuntimeImplemented: false,
    phase42CRuntimeReady: false,
    phase42CRuntimeApproved: false,
    phase42CRuntimeEnabled: false,
    phase42CRuntimeCommandEnabled: false,
    phase42CAppsCliIndexChanged: false,
    phase42CExternalReviewComplete: false,
    phase42CReadinessApprovalCommandEnabled: false,
    phase42CProcessControlEnabled: false,
    phase42CFailureAuditRuntimeEnabled: false,
    phase42CTranscriptPersistenceRuntimeEnabled: false,
    phase42DJulesReviewRecorded: true,
    phase42DJulesReviewApproved: true,
    phase42DExternalReviewComplete: true,
    phase42DPhase5HandoffReady: true,
    phase42DRuntimeImplemented: false,
    phase42DRuntimeReady: false,
    phase42DRuntimeApproved: false,
    phase42DRuntimeImplementationApproved: false,
    phase42DRuntimeEnablementApproved: false,
    phase42DRuntimeCommandSurfaceApproved: false,
    phase42DRuntimeEnabled: false,
    phase42DRuntimeCommandEnabled: false,
    phase42DAppsCliIndexChanged: false,
    phase42DProcessControlEnabled: false,
    phase42DFailureAuditRuntimeEnabled: false,
    phase42DTranscriptPersistenceRuntimeEnabled: false,
    phase51FutureImplementationPhaseApproved: true,
    phase51RuntimeImplementationInThisPhase: false,
    phase51RuntimeEnablementApproved: false,
    phase51RuntimeImplemented: false,
    phase51RuntimeEnabled: false,
    phase51RuntimeCommandEnabled: false,
    phase51ApprovalCommandEnabled: false,
    phase51RuntimeCommandSurfaceEnabled: false,
    phase51AppsCliIndexChanged: false,
    phase51ProcessControlEnabled: false,
    phase51StdoutStderrWritersEnabled: false,
    phase51TranscriptAuditSideEffectsEnabled: false,
    phase51AdapterRuntimeBehaviorEnabled: false,
    phase51ContentFabricRuntimeBehaviorEnabled: false,
    phase52GuardedImplementationSliceStatusRecorded: true,
    phase52RuntimeEnablementApproved: false,
    phase52RuntimeEnabled: false,
    phase52RuntimeCommandEnabled: false,
    phase52RuntimeCommandSurfaceEnabled: false,
    phase52ApprovalCommandEnabled: false,
    phase52AppsCliIndexChanged: false,
    phase52ProcessControlEnabled: false,
    phase52StdoutStderrWritersEnabled: false,
    phase52TranscriptAuditSideEffectsEnabled: false,
    phase52AdapterRuntimeBehaviorEnabled: false,
    phase52ContentFabricRuntimeBehaviorEnabled: false,
    phase53CommandSurfacePreflightRecorded: true,
    phase53FutureCommandContractDocumented: true,
    phase53FutureReviewPacketDocumented: true,
    phase53RuntimeEnablementApproved: false,
    phase53RuntimeEnabled: false,
    phase53RuntimeCommandEnabled: false,
    phase53RuntimeCommandSurfaceApproved: false,
    phase53RuntimeCommandSurfaceEnabled: false,
    phase53ApprovalCommandEnabled: false,
    phase53AppsCliIndexChanged: false,
    phase53ProcessControlEnabled: false,
    phase53StdoutStderrWritersEnabled: false,
    phase53TranscriptAuditSideEffectsEnabled: false,
    phase53AdapterRuntimeBehaviorEnabled: false,
    phase53ContentFabricRuntimeBehaviorEnabled: false,
    phase54DisabledCommandExposurePlanRecorded: true,
    phase54FutureCliImplementationChecklistDocumented: true,
    phase54JulesDevinReviewPacketDocumented: true,
    phase54RollbackPlanDocumented: true,
    phase54CommandSurfaceDiffRiskNotesDocumented: true,
    phase54RuntimeEnablementApproved: false,
    phase54RuntimeEnabled: false,
    phase54RuntimeCommandEnabled: false,
    phase54RuntimeCommandExposureApproved: false,
    phase54RuntimeCommandSurfaceApproved: false,
    phase54RuntimeCommandSurfaceEnabled: false,
    phase54ApprovalCommandEnabled: false,
    phase54AppsCliIndexChanged: false,
    phase54RustSourceChanged: false,
    phase54ProcessControlEnabled: false,
    phase54StdoutStderrWritersEnabled: false,
    phase54TranscriptAuditSideEffectsEnabled: false,
    phase54AdapterRuntimeBehaviorEnabled: false,
    phase54ContentFabricRuntimeBehaviorEnabled: false,
    phase54AJulesReviewDispositionRecorded: true,
    phase54AJulesReviewApproved: true,
    phase54ARequestChanges: false,
    phase54AAccidentalCommandRuntimeExposureFound: false,
    phase54ATestsSufficientBeforeNextDefaultBlockedCliImplementation: true,
    phase54AMayProceedToNextStillDefaultBlockedCliCommandImplementationPhase: true,
    phase54ARuntimeEnablementApproved: false,
    phase54ARuntimeEnabled: false,
    phase54ARuntimeCommandEnabled: false,
    phase54ARuntimeCommandExposureApproved: false,
    phase54ARuntimeCommandSurfaceApproved: false,
    phase54ARuntimeCommandSurfaceEnabled: false,
    phase54AApprovalCommandEnabled: false,
    phase54AAppsCliIndexChanged: false,
    phase54AAppsCliIndexContentChanged: false,
    phase54AAppsCliIndexModeCorrectionNeeded: false,
    phase54AAppsCliIndexModeCorrectionApplied: false,
    phase54ARustSourceChanged: false,
    phase54AProcessControlEnabled: false,
    phase54AStdoutStderrWritersEnabled: false,
    phase54ATranscriptAuditSideEffectsEnabled: false,
    phase54AAdapterRuntimeBehaviorEnabled: false,
    phase54AContentFabricRuntimeBehaviorEnabled: false,
    phase55DefaultBlockedRuntimeCliRecorded: true,
    phase55RuntimeCommandRecognizedByCli: true,
    phase55RuntimeUnavailable: true,
    phase55DryRunBypassesBlock: false,
    phase55RuntimeEnablementApproved: false,
    phase55RuntimeEnabled: false,
    phase55RuntimeStarted: false,
    phase55RuntimeReady: false,
    phase55RuntimeCommandEnabled: false,
    phase55RuntimeExecutionEnabled: false,
    phase55RuntimeCommandExposureApproved: false,
    phase55RuntimeCommandSurfaceApproved: false,
    phase55ApprovalCommandEnabled: false,
    phase55ApprovalGrantCreated: false,
    phase55ApprovalEvaluatorEnabled: false,
    phase55RustSourceChanged: false,
    phase55ProcessControlEnabled: false,
    phase55StdoutStderrWritersEnabled: false,
    phase55TranscriptAuditSideEffectsEnabled: false,
    phase55AdapterRuntimeBehaviorEnabled: false,
    phase55ContentFabricRuntimeBehaviorEnabled: false,
    phase56RuntimeEnablementGateRecorded: true,
    phase56RuntimeEnablementGateSatisfied: false,
    phase56RequiredPreconditionCount: 9,
    phase56SatisfiedPreconditionCount: 0,
    phase56CanEnableRuntime: false,
    phase56RuntimeEnabled: false,
    phase56RuntimeStarted: false,
    phase56RuntimeReady: false,
    phase56RuntimeCommandEnabled: false,
    phase56RuntimeExecutionEnabled: false,
    phase56ServeRuntimeStillDefaultBlocked: true,
    phase56DryRunBypassesBlock: false,
    phase56ApprovalCommandEnabled: false,
    phase56ApprovalGrantCreated: false,
    phase56ApprovalEvaluatorEnabled: false,
    phase56CliSourceChanged: false,
    phase56RustSourceChanged: false,
    phase56ProcessControlEnabled: false,
    phase56StdoutStderrWritersEnabled: false,
    phase56TranscriptAuditSideEffectsEnabled: false,
    phase56AdapterRuntimeBehaviorEnabled: false,
    phase56ContentFabricRuntimeBehaviorEnabled: false,
    phase56WebSocketHttpSurfaceEnabled: false,
    phase57ApprovalValidationContractRecorded: true,
    phase57MissingApprovalRejected: true,
    phase57InvalidApprovalRejected: true,
    phase57RevokedApprovalRejected: true,
    phase57ValidApprovalPrerequisiteOnly: true,
    phase57ValidApprovalEnablesRuntime: false,
    phase57ValidApprovalStartsRuntime: false,
    phase57CanEnableRuntime: false,
    phase57RuntimeEnabled: false,
    phase57RuntimeStarted: false,
    phase57RuntimeReady: false,
    phase57RuntimeCommandEnabled: false,
    phase57RuntimeExecutionEnabled: false,
    phase57ServeRuntimeStillDefaultBlocked: true,
    phase57DryRunBypassesBlock: false,
    phase57ApprovalCommandEnabled: false,
    phase57ApprovalGrantCreated: false,
    phase57ApprovalEvaluatorImplemented: false,
    phase57CliSourceChanged: false,
    phase57RustSourceChanged: false,
    phase57ProcessControlEnabled: false,
    phase57StdoutStderrWritersEnabled: false,
    phase57TranscriptAuditSideEffectsEnabled: false,
    phase57AdapterRuntimeBehaviorEnabled: false,
    phase57ContentFabricRuntimeBehaviorEnabled: false,
    phase57WebSocketHttpSurfaceEnabled: false,
    phase58CommandExposureApprovalContractRecorded: true,
    phase58MissingCommandExposureApprovalRejected: true,
    phase58InvalidCommandExposureApprovalRejected: true,
    phase58RevokedCommandExposureApprovalRejected: true,
    phase58ValidCommandExposureApprovalPrerequisiteOnly: true,
    phase58ValidCommandExposureApprovalEnablesRuntime: false,
    phase58ValidCommandExposureApprovalStartsRuntime: false,
    phase58ValidCommandExposureApprovalExposesRuntimeExecution: false,
    phase58ValidCommandExposureApprovalExposesUserRuntimeCommand: false,
    phase58RecognizedCommandIsRuntimeExecutionExposure: false,
    phase58CanEnableRuntime: false,
    phase58RuntimeEnabled: false,
    phase58RuntimeStarted: false,
    phase58RuntimeReady: false,
    phase58RuntimeCommandEnabled: false,
    phase58RuntimeExecutionEnabled: false,
    phase58ServeRuntimeStillDefaultBlocked: true,
    phase58DryRunBypassesBlock: false,
    phase58ApprovalCommandEnabled: false,
    phase58ApprovalGrantCreated: false,
    phase58ApprovalEvaluatorImplemented: false,
    phase58CliSourceChanged: false,
    phase58RustSourceChanged: false,
    phase58ProcessControlEnabled: false,
    phase58StdoutStderrWritersEnabled: false,
    phase58TranscriptAuditSideEffectsEnabled: false,
    phase58AdapterRuntimeBehaviorEnabled: false,
    phase58ContentFabricRuntimeBehaviorEnabled: false,
    phase58WebSocketHttpSurfaceEnabled: false,
    phase59ApprovalEvaluatorGrantBoundaryRecorded: true,
    phase59RuntimeApprovalPrerequisiteOnly: true,
    phase59CommandExposureApprovalPrerequisiteOnly: true,
    phase59CombinedApprovalSignalsPrerequisiteOnly: true,
    phase59ApprovalEvaluatorImplemented: false,
    phase59ApprovalGrantProduced: false,
    phase59ValidApprovalSignalsCreateGrant: false,
    phase59ValidApprovalSignalsEnableRuntime: false,
    phase59ValidApprovalSignalsStartRuntime: false,
    phase59ValidApprovalSignalsExposeRuntimeExecution: false,
    phase59CanEnableRuntime: false,
    phase59RuntimeEnabled: false,
    phase59RuntimeStarted: false,
    phase59RuntimeReady: false,
    phase59RuntimeCommandEnabled: false,
    phase59RuntimeExecutionEnabled: false,
    phase59ServeRuntimeStillDefaultBlocked: true,
    phase59DryRunBypassesBlock: false,
    phase59ApprovalCommandEnabled: false,
    phase59CliSourceChanged: false,
    phase59RustSourceChanged: false,
    phase59ProcessControlEnabled: false,
    phase59StdoutStderrWritersEnabled: false,
    phase59TranscriptAuditSideEffectsEnabled: false,
    phase59AdapterRuntimeBehaviorEnabled: false,
    phase59ContentFabricRuntimeBehaviorEnabled: false,
    phase59WebSocketHttpSurfaceEnabled: false,
    phase510RuntimeHostPolicyBoundaryRecorded: true,
    phase510HostPolicyRuntimeEnforcementRequired: true,
    phase510HostPolicyRuntimeEnforcementImplemented: false,
    phase510HostPolicyRuntimeEnforcementActive: false,
    phase510MissingHostPolicyEnforcementRejected: true,
    phase510InvalidHostPolicyEnforcementRejected: true,
    phase510PermissiveUnboundedHostPolicyEnforcementRejected: true,
    phase510ValidRestrictiveHostPolicyPrerequisiteOnly: true,
    phase510ValidRestrictiveHostPolicyEnablesRuntime: false,
    phase510ValidRestrictiveHostPolicyStartsRuntime: false,
    phase510ValidRestrictiveHostPolicyExposesRuntimeExecution: false,
    phase510CanEnableRuntime: false,
    phase510RuntimeEnabled: false,
    phase510RuntimeStarted: false,
    phase510RuntimeReady: false,
    phase510RuntimeCommandEnabled: false,
    phase510RuntimeExecutionEnabled: false,
    phase510ServeRuntimeStillDefaultBlocked: true,
    phase510DryRunBypassesBlock: false,
    phase510HostPolicyCommandEnabled: false,
    phase510ApprovalCommandEnabled: false,
    phase510CliSourceChanged: false,
    phase510RustSourceChanged: false,
    phase510ProcessControlEnabled: false,
    phase510StdoutStderrWritersEnabled: false,
    phase510TranscriptAuditSideEffectsEnabled: false,
    phase510AdapterRuntimeBehaviorEnabled: false,
    phase510ContentFabricRuntimeBehaviorEnabled: false,
    phase510WebSocketHttpSurfaceEnabled: false,
    phase511RuntimeStdioSafetyBoundaryRecorded: true,
    phase511StdioSafetyRequiredBeforeRuntimeEnablement: true,
    phase511StdioSafetyImplemented: false,
    phase511StdioSafetyActive: false,
    phase511MissingStdioSafetyRejected: true,
    phase511InvalidStdioSafetyRejected: true,
    phase511UnboundedStdinStdoutStderrBehaviorRejected: true,
    phase511ValidRestrictiveStdioSafetyPrerequisiteOnly: true,
    phase511ValidRestrictiveStdioSafetyEnablesRuntime: false,
    phase511ValidRestrictiveStdioSafetyStartsRuntime: false,
    phase511ValidRestrictiveStdioSafetyExposesRuntimeExecution: false,
    phase511CanEnableRuntime: false,
    phase511RuntimeEnabled: false,
    phase511RuntimeStarted: false,
    phase511RuntimeReady: false,
    phase511RuntimeCommandEnabled: false,
    phase511RuntimeExecutionEnabled: false,
    phase511ServeRuntimeStillDefaultBlocked: true,
    phase511DryRunBypassesBlock: false,
    phase511StdioSafetyCommandEnabled: false,
    phase511LiveStdinLoopEnabled: false,
    phase511RuntimeStdoutWriterEnabled: false,
    phase511RuntimeStderrWriterEnabled: false,
    phase511ApprovalCommandEnabled: false,
    phase511CliSourceChanged: false,
    phase511RustSourceChanged: false,
    phase511ProcessControlEnabled: false,
    phase511TranscriptAuditSideEffectsEnabled: false,
    phase511AdapterRuntimeBehaviorEnabled: false,
    phase511ContentFabricRuntimeBehaviorEnabled: false,
    phase511WebSocketHttpSurfaceEnabled: false,
    phase512RuntimeTranscriptAuditBoundaryRecorded: true,
    phase512TranscriptAuditConfinementRequiredBeforeRuntimeEnablement: true,
    phase512TranscriptAuditConfinementImplemented: false,
    phase512TranscriptAuditConfinementActive: false,
    phase512MissingTranscriptAuditConfinementRejected: true,
    phase512InvalidTranscriptAuditConfinementRejected: true,
    phase512UnboundedRuntimeTranscriptAuditWritesRejected: true,
    phase512ValidRestrictiveTranscriptAuditConfinementPrerequisiteOnly: true,
    phase512ValidRestrictiveTranscriptAuditConfinementEnablesRuntime: false,
    phase512ValidRestrictiveTranscriptAuditConfinementStartsRuntime: false,
    phase512ValidRestrictiveTranscriptAuditConfinementExposesRuntimeExecution: false,
    phase512CanEnableRuntime: false,
    phase512RuntimeEnabled: false,
    phase512RuntimeStarted: false,
    phase512RuntimeReady: false,
    phase512RuntimeCommandEnabled: false,
    phase512RuntimeExecutionEnabled: false,
    phase512ServeRuntimeStillDefaultBlocked: true,
    phase512DryRunBypassesBlock: false,
    phase512TranscriptAuditConfinementCommandEnabled: false,
    phase512TranscriptAuditConfinementImplemented: false,
    phase512TranscriptAuditConfinementActive: false,
    phase512RuntimeTranscriptWriterEnabled: false,
    phase512RuntimeAuditWriterEnabled: false,
    phase512RuntimeTranscriptWritePerformed: false,
    phase512RuntimeAuditWritePerformed: false,
    phase512LiveStdinLoopEnabled: false,
    phase512RuntimeStdoutWriterEnabled: false,
    phase512RuntimeStderrWriterEnabled: false,
    phase512ApprovalCommandEnabled: false,
    phase512CliSourceChanged: false,
    phase512RustSourceChanged: false,
    phase512ProcessControlEnabled: false,
    phase512AdapterRuntimeBehaviorEnabled: false,
    phase512ContentFabricRuntimeBehaviorEnabled: false,
    phase512WebSocketHttpSurfaceEnabled: false,
    phase513RuntimeProcessControlBoundaryRecorded: true,
    phase513ProcessControlRequiredBeforeRuntimeEnablement: true,
    phase513ProcessControlBoundaryImplemented: false,
    phase513ProcessControlBoundaryActive: false,
    phase513MissingProcessControlBoundaryRejected: true,
    phase513InvalidProcessControlBoundaryRejected: true,
    phase513UnboundedProcessSpawningTerminationSupervisionRejected: true,
    phase513ValidRestrictiveProcessControlBoundaryPrerequisiteOnly: true,
    phase513ValidRestrictiveProcessControlBoundaryEnablesRuntime: false,
    phase513ValidRestrictiveProcessControlBoundaryStartsRuntime: false,
    phase513ValidRestrictiveProcessControlBoundaryExposesRuntimeExecution: false,
    phase513CanEnableRuntime: false,
    phase513RuntimeEnabled: false,
    phase513RuntimeStarted: false,
    phase513RuntimeReady: false,
    phase513RuntimeCommandEnabled: false,
    phase513RuntimeExecutionEnabled: false,
    phase513ServeRuntimeStillDefaultBlocked: true,
    phase513DryRunBypassesBlock: false,
    phase513ProcessControlCommandEnabled: false,
    phase513ProcessControlBoundaryImplemented: false,
    phase513ProcessControlBoundaryActive: false,
    phase513ProcessControlBoundaryEvaluated: false,
    phase513ProcessSpawnEnabled: false,
    phase513ProcessTerminationEnabled: false,
    phase513RuntimeSupervisionEnabled: false,
    phase513ChildProcessManaged: false,
    phase513ProcessSignalSent: false,
    phase513ProcessWaitPerformed: false,
    phase513LiveStdinLoopEnabled: false,
    phase513RuntimeStdoutWriterEnabled: false,
    phase513RuntimeStderrWriterEnabled: false,
    phase513RuntimeTranscriptWritePerformed: false,
    phase513RuntimeAuditWritePerformed: false,
    phase513ApprovalCommandEnabled: false,
    phase513CliSourceChanged: false,
    phase513RustSourceChanged: false,
    phase513AdapterRuntimeBehaviorEnabled: false,
    phase513ContentFabricRuntimeBehaviorEnabled: false,
    phase513WebSocketHttpSurfaceEnabled: false,
    phase514RuntimeRollbackKillSwitchBoundaryRecorded: true,
    phase514RollbackKillSwitchRequiredBeforeRuntimeEnablement: true,
    phase514RollbackKillSwitchBoundaryImplemented: false,
    phase514RollbackKillSwitchBoundaryActive: false,
    phase514MissingRollbackKillSwitchBoundaryRejected: true,
    phase514InvalidRollbackKillSwitchBoundaryRejected: true,
    phase514NonDeterministicOrManualOnlyRollbackRejected: true,
    phase514ValidRestrictiveRollbackKillSwitchBoundaryPrerequisiteOnly: true,
    phase514ValidRestrictiveRollbackKillSwitchBoundaryEnablesRuntime: false,
    phase514ValidRestrictiveRollbackKillSwitchBoundaryStartsRuntime: false,
    phase514ValidRestrictiveRollbackKillSwitchBoundaryExposesRuntimeExecution: false,
    phase514CanEnableRuntime: false,
    phase514RuntimeEnabled: false,
    phase514RuntimeStarted: false,
    phase514RuntimeReady: false,
    phase514RuntimeCommandEnabled: false,
    phase514RuntimeExecutionEnabled: false,
    phase514ServeRuntimeStillDefaultBlocked: true,
    phase514DryRunBypassesBlock: false,
    phase514RollbackKillSwitchCommandEnabled: false,
    phase514RollbackKillSwitchBoundaryImplemented: false,
    phase514RollbackKillSwitchBoundaryActive: false,
    phase514RollbackKillSwitchBoundaryEvaluated: false,
    phase514RollbackCommandEnabled: false,
    phase514KillSwitchCommandEnabled: false,
    phase514RuntimeShutdownEnabled: false,
    phase514RuntimeRollbackPerformed: false,
    phase514KillSwitchActivated: false,
    phase514RollbackVerificationPerformed: false,
    phase514ProcessTerminationEnabled: false,
    phase514LiveStdinLoopEnabled: false,
    phase514RuntimeStdoutWriterEnabled: false,
    phase514RuntimeStderrWriterEnabled: false,
    phase514RuntimeTranscriptWritePerformed: false,
    phase514RuntimeAuditWritePerformed: false,
    phase514ApprovalCommandEnabled: false,
    phase514CliSourceChanged: false,
    phase514RustSourceChanged: false,
    phase514AdapterRuntimeBehaviorEnabled: false,
    phase514ContentFabricRuntimeBehaviorEnabled: false,
    phase514WebSocketHttpSurfaceEnabled: false,
    phase515PositiveRuntimeSmokeRequirementRecorded: true,
    phase515PositiveRuntimeSmokeCoverageRequiredBeforeRuntimeEnablement: true,
    phase515PositiveRuntimeSmokeCoverageImplemented: false,
    phase515PositiveRuntimeSmokeCoverageActive: false,
    phase515MissingPositiveRuntimeSmokeCoverageRejected: true,
    phase515InvalidPositiveRuntimeSmokeCoverageRejected: true,
    phase515NonGuardedOrNonDeterministicRuntimeSmokeCoverageRejected: true,
    phase515ValidPositiveRuntimeSmokeCoveragePrerequisiteOnly: true,
    phase515ValidPositiveRuntimeSmokeCoverageEnablesRuntime: false,
    phase515ValidPositiveRuntimeSmokeCoverageStartsRuntime: false,
    phase515ValidPositiveRuntimeSmokeCoverageExposesRuntimeExecution: false,
    phase515ValidPositiveRuntimeSmokeCoverageRunsRuntime: false,
    phase515CanEnableRuntime: false,
    phase515RuntimeEnabled: false,
    phase515RuntimeStarted: false,
    phase515RuntimeReady: false,
    phase515RuntimeCommandEnabled: false,
    phase515RuntimeExecutionEnabled: false,
    phase515RuntimeExecuted: false,
    phase515ServeRuntimeStillDefaultBlocked: true,
    phase515DryRunBypassesBlock: false,
    phase515PositiveRuntimeSmokeCommandEnabled: false,
    phase515PositiveRuntimeSmokeCoverageImplemented: false,
    phase515PositiveRuntimeSmokeCoverageActive: false,
    phase515PositiveRuntimeSmokeCoverageEvaluated: false,
    phase515PositiveRuntimeSmokeExecuted: false,
    phase515PositiveRuntimeSmokePassed: false,
    phase515RuntimeSmokeCommandEnabled: false,
    phase515LiveStdinLoopEnabled: false,
    phase515RuntimeStdoutWriterEnabled: false,
    phase515RuntimeStderrWriterEnabled: false,
    phase515ProcessSpawnEnabled: false,
    phase515ProcessTerminationEnabled: false,
    phase515RuntimeSupervisionEnabled: false,
    phase515RuntimeTranscriptWritePerformed: false,
    phase515RuntimeAuditWritePerformed: false,
    phase515ApprovalCommandEnabled: false,
    phase515CliSourceChanged: false,
    phase515RustSourceChanged: false,
    phase515AdapterRuntimeBehaviorEnabled: false,
    phase515ContentFabricRuntimeBehaviorEnabled: false,
    phase515WebSocketHttpSurfaceEnabled: false,
    phase516RuntimeEnableReadinessCheckpointRecorded: true,
    phase516Phase56Through515ContractsRepresented: true,
    phase516RepresentedPreconditionCount: 10,
    phase516ImplementedLivePreconditionCount: 0,
    phase516ApprovalRecordsPrerequisiteOnly: true,
    phase516CommandExposureApprovalPrerequisiteOnly: true,
    phase516ApprovalEvaluatorImplemented: false,
    phase516ApprovalGrantProduced: false,
    phase516HostPolicyRuntimeEnforcementImplemented: false,
    phase516StdioSafetyImplemented: false,
    phase516TranscriptAuditConfinementImplemented: false,
    phase516ProcessControlBoundaryImplemented: false,
    phase516RollbackKillSwitchBoundaryImplemented: false,
    phase516PositiveRuntimeSmokeCoverageImplemented: false,
    phase516ReadyForRuntimeEnablement: false,
    phase516ReadyForLiveRuntimeImplementation: false,
    phase516CanEnableRuntime: false,
    phase516RuntimeEnabled: false,
    phase516RuntimeStarted: false,
    phase516RuntimeReady: false,
    phase516RuntimeCommandEnabled: false,
    phase516RuntimeExecutionEnabled: false,
    phase516RuntimeExecuted: false,
    phase516ServeRuntimeStillDefaultBlocked: true,
    phase516DryRunBypassesBlock: false,
    phase516LiveStdinLoopEnabled: false,
    phase516RuntimeStdoutWriterEnabled: false,
    phase516RuntimeStderrWriterEnabled: false,
    phase516ProcessSpawnEnabled: false,
    phase516ProcessTerminationEnabled: false,
    phase516RuntimeSupervisionEnabled: false,
    phase516RuntimeTranscriptWritePerformed: false,
    phase516RuntimeAuditWritePerformed: false,
    phase516AdapterRuntimeBehaviorEnabled: false,
    phase516ContentFabricRuntimeBehaviorEnabled: false,
    phase516WebSocketHttpSurfaceEnabled: false,
    phase516CliSourceChanged: false,
    phase516RustSourceChanged: false,
    phase517GuardedRuntimeImplementationPlanRecorded: true,
    phase517PrerequisiteContractCount: 11,
    phase517PlannedImplementationStepCount: 9,
    phase517ImplementationInThisPhase: false,
    phase517AllPriorContractsPrerequisiteOnly: true,
    phase517ApprovalRecordsPrerequisiteOnly: true,
    phase517CommandExposureApprovalPrerequisiteOnly: true,
    phase517ReadinessCheckpointPrerequisiteOnly: true,
    phase517AnyPrerequisiteEnablesRuntime: false,
    phase517AnyPrerequisiteStartsRuntime: false,
    phase517AnyPrerequisiteExposesRuntimeExecution: false,
    phase517AnyPrerequisiteCreatesApprovalGrant: false,
    phase517RuntimeEnabled: false,
    phase517RuntimeStarted: false,
    phase517RuntimeReady: false,
    phase517RuntimeCommandEnabled: false,
    phase517RuntimeCommandExposureEnabled: false,
    phase517RuntimeExecutionEnabled: false,
    phase517RuntimeExecuted: false,
    phase517ApprovalEvaluatorImplemented: false,
    phase517ApprovalGrantProduced: false,
    phase517RuntimeImplementationAdded: false,
    phase517HostPolicyRuntimeEnforcementImplemented: false,
    phase517StdioSafetyImplemented: false,
    phase517LiveStdinLoopEnabled: false,
    phase517RuntimeStdoutWriterEnabled: false,
    phase517RuntimeStderrWriterEnabled: false,
    phase517TranscriptAuditConfinementImplemented: false,
    phase517RuntimeTranscriptWritePerformed: false,
    phase517RuntimeAuditWritePerformed: false,
    phase517ProcessControlBoundaryImplemented: false,
    phase517ProcessSpawnEnabled: false,
    phase517ProcessTerminationEnabled: false,
    phase517RuntimeSupervisionEnabled: false,
    phase517RollbackKillSwitchBoundaryImplemented: false,
    phase517RuntimeRollbackPerformed: false,
    phase517KillSwitchActivated: false,
    phase517PositiveRuntimeSmokeCoverageImplemented: false,
    phase517PositiveRuntimeSmokeExecuted: false,
    phase517AdapterRuntimeBehaviorEnabled: false,
    phase517ContentFabricRuntimeBehaviorEnabled: false,
    phase517WebSocketHttpSurfaceEnabled: false,
    phase517ServeRuntimeStillDefaultBlocked: true,
    phase517DryRunBypassesBlock: false,
    phase517ReadyForRuntimeEnablement: false,
    phase517CanEnableRuntime: false,
    phase517CliSourceChanged: false,
    phase517RustSourceChanged: false,
    phase518ReviewOnlyApprovalEvaluatorSkeletonRecorded: true,
    phase518EvaluatorReviewOnly: true,
    phase518EvaluatorAuthoritative: false,
    phase518MissingPrerequisiteRecordsRejected: true,
    phase518InvalidPrerequisiteRecordsRejected: true,
    phase518RevokedPrerequisiteRecordsRejected: true,
    phase518ValidPrerequisiteRecordsRecognizedForReviewOnly: true,
    phase518ApprovalGrantProduced: false,
    phase518ApprovalGrantPersisted: false,
    phase518RuntimeEnabled: false,
    phase518RuntimeStarted: false,
    phase518RuntimeReady: false,
    phase518RuntimeCommandEnabled: false,
    phase518RuntimeCommandExposureEnabled: false,
    phase518RuntimeExecutionEnabled: false,
    phase518RuntimeExecuted: false,
    phase518ServeRuntimeStillDefaultBlocked: true,
    phase518DryRunBypassesBlock: false,
    phase518CanEnableRuntime: false,
    phase518CliSourceChanged: false,
    phase518RustSourceChanged: false,
    phase518LiveStdinLoopEnabled: false,
    phase518RuntimeStdoutWriterEnabled: false,
    phase518RuntimeStderrWriterEnabled: false,
    phase518ProcessSpawnEnabled: false,
    phase518ProcessTerminationEnabled: false,
    phase518RuntimeSupervisionEnabled: false,
    phase518RuntimeTranscriptWritePerformed: false,
    phase518RuntimeAuditWritePerformed: false,
    phase518AdapterRuntimeBehaviorEnabled: false,
    phase518ContentFabricRuntimeBehaviorEnabled: false,
    phase518WebSocketHttpSurfaceEnabled: false,
    freshExternalReviewRan: true,
    freshDevinReviewRan: false,
    freshJulesReviewRan: true,
    externalCiRan: false
  };

  const comparableFlags = { ...report.safetyPosture.flags };
  removeSafetyFlags(comparableFlags, [
    ...phase519SafetyFlagNames,
    ...phase520SafetyFlagNames,
    ...phase521SafetyFlagNames,
    ...phase522SafetyFlagNames,
    ...phase523SafetyFlagNames,
    ...phase524SafetyFlagNames,
    ...phase525SafetyFlagNames,
    ...phase526SafetyFlagNames,
    ...phase527SafetyFlagNames,
    ...phase528SafetyFlagNames,
    ...phase529SafetyFlagNames,
    ...phase530SafetyFlagNames,
    ...phase531SafetyFlagNames,
    ...phase532SafetyFlagNames,
    ...phase533SafetyFlagNames,
    ...phase534SafetyFlagNames,
    ...phase535SafetyFlagNames,
    ...phase536SafetyFlagNames,
    ...phase537SafetyFlagNames,
    ...phase538SafetyFlagNames,
    ...phase538ASafetyFlagNames,
    ...phase539SafetyFlagNames,
    ...phase540SafetyFlagNames,
    ...phase541SafetyFlagNames,
    ...phase542SafetyFlagNames,
    ...phase543SafetyFlagNames,
    ...phase544SafetyFlagNames,
    ...phase545SafetyFlagNames,
    ...phase546SafetyFlagNames
  ]);
  assert.deepEqual(comparableFlags, expectedFlags);
  assertSafetyFlags(report, phase519ExpectedTrueSafetyFlagNames, true);
  assertSafetyFlags(report, phase519ExpectedFalseSafetyFlagNames, false);
  assertSafetyFlags(report, phase520ExpectedTrueSafetyFlagNames, true);
  assertSafetyFlags(report, phase520ExpectedFalseSafetyFlagNames, false);
  assertSafetyFlags(report, phase521ExpectedTrueSafetyFlagNames, true);
  assertSafetyFlags(report, phase521ExpectedFalseSafetyFlagNames, false);
  assertSafetyFlags(report, phase522ExpectedTrueSafetyFlagNames, true);
  assertSafetyFlags(report, phase522ExpectedFalseSafetyFlagNames, false);
  assertSafetyFlags(report, phase523ExpectedTrueSafetyFlagNames, true);
  assertSafetyFlags(report, phase523ExpectedFalseSafetyFlagNames, false);
  assertSafetyFlags(report, phase524ExpectedTrueSafetyFlagNames, true);
  assertSafetyFlags(report, phase524ExpectedFalseSafetyFlagNames, false);
  assertSafetyFlags(report, phase525ExpectedTrueSafetyFlagNames, true);
  assertSafetyFlags(report, phase525ExpectedFalseSafetyFlagNames, false);
  assertSafetyFlags(report, phase526ExpectedTrueSafetyFlagNames, true);
  assertSafetyFlags(report, phase526ExpectedFalseSafetyFlagNames, false);
  assertSafetyFlags(report, phase527ExpectedTrueSafetyFlagNames, true);
  assertSafetyFlags(report, phase527ExpectedFalseSafetyFlagNames, false);
  assertSafetyFlags(report, phase528ExpectedTrueSafetyFlagNames, true);
  assertSafetyFlags(report, phase528ExpectedFalseSafetyFlagNames, false);
  assertSafetyFlags(report, phase529ExpectedTrueSafetyFlagNames, true);
  assertSafetyFlags(report, phase529ExpectedFalseSafetyFlagNames, false);
  assertSafetyFlags(report, phase530ExpectedTrueSafetyFlagNames, true);
  assertSafetyFlags(report, phase530ExpectedFalseSafetyFlagNames, false);
  assertSafetyFlags(report, phase531ExpectedTrueSafetyFlagNames, true);
  assertSafetyFlags(report, phase531ExpectedFalseSafetyFlagNames, false);
  assertSafetyFlags(report, phase532ExpectedTrueSafetyFlagNames, true);
  assertSafetyFlags(report, phase532ExpectedFalseSafetyFlagNames, false);
  assertSafetyFlags(report, phase533ExpectedTrueSafetyFlagNames, true);
  assertSafetyFlags(report, phase533ExpectedFalseSafetyFlagNames, false);
  assertSafetyFlags(report, phase534ExpectedTrueSafetyFlagNames, true);
  assertSafetyFlags(report, phase534ExpectedFalseSafetyFlagNames, false);
  assertSafetyFlags(report, phase535ExpectedTrueSafetyFlagNames, true);
  assertSafetyFlags(report, phase535ExpectedFalseSafetyFlagNames, false);
  assertSafetyFlags(report, phase536ExpectedTrueSafetyFlagNames, true);
  assertSafetyFlags(report, phase536ExpectedFalseSafetyFlagNames, false);
  assertSafetyFlags(report, phase537ExpectedTrueSafetyFlagNames, true);
  assertSafetyFlags(report, phase537ExpectedFalseSafetyFlagNames, false);
  assertSafetyFlags(report, phase538ExpectedTrueSafetyFlagNames, true);
  assertSafetyFlags(report, phase538ExpectedFalseSafetyFlagNames, false);
  assertSafetyFlags(report, phase538AExpectedTrueSafetyFlagNames, true);
  assertSafetyFlags(report, phase538AExpectedFalseSafetyFlagNames, false);
  assertSafetyFlags(report, phase539ExpectedTrueSafetyFlagNames, true);
  assertSafetyFlags(report, phase539ExpectedFalseSafetyFlagNames, false);
  assertSafetyFlags(report, phase540ExpectedTrueSafetyFlagNames, true);
  assertSafetyFlags(report, phase540ExpectedFalseSafetyFlagNames, false);
  assertSafetyFlags(report, phase541ExpectedTrueSafetyFlagNames, true);
  assertSafetyFlags(report, phase541ExpectedFalseSafetyFlagNames, false);
  assertSafetyFlags(report, phase542ExpectedTrueSafetyFlagNames, true);
  assertSafetyFlags(report, phase542ExpectedFalseSafetyFlagNames, false);
  assertSafetyFlags(report, phase543ExpectedTrueSafetyFlagNames, true);
  assertSafetyFlags(report, phase543ExpectedFalseSafetyFlagNames, false);
  assertSafetyFlags(report, phase544ExpectedTrueSafetyFlagNames, true);
  assertSafetyFlags(report, phase544ExpectedFalseSafetyFlagNames, false);
  assertSafetyFlags(report, phase545ExpectedTrueSafetyFlagNames, true);
  assertSafetyFlags(report, phase545ExpectedFalseSafetyFlagNames, false);
  assertSafetyFlags(report, phase546ExpectedTrueSafetyFlagNames, true);
  assertSafetyFlags(report, phase546ExpectedFalseSafetyFlagNames, false);
  assert.equal(report.phase36Inventory.displayContract.locusRuntimeDependency, false);
  assert.equal(report.phase36Inventory.displayContract.unknownFieldsAreInertMetadata, true);
});

test("report script source does not import forbidden process, network, write, or runtime modules", async () => {
  const source = await readFile(reportScriptUrl, "utf8");
  const forbiddenPatterns = [
    /node:child_process/,
    /from\s+["']child_process["']/,
    /node:http/,
    /node:https/,
    /node:net/,
    /node:dgram/,
    /\bfetch\s*\(/,
    /\bWebSocket\b/,
    /\bspawn\s*\(/,
    /\bexec(File)?\s*\(/,
    /\bcreateServer\s*\(/,
    /\blisten\s*\(/,
    /\bwriteFile\s*\(/,
    /\bappendFile\s*\(/,
    /\bmkdir\s*\(/,
    /\brm\s*\(/,
    /\bunlink\s*\(/
  ];

  for (const pattern of forbiddenPatterns) {
    assert.doesNotMatch(source, pattern);
  }
});
