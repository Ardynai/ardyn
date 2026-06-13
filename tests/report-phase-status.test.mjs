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
    cwd: repoRoot
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

test("package exposes report:phase-status without replacing existing test scripts", async () => {
  const packageJson = await readJson(packageJsonUrl);

  assert.equal(packageJson.scripts.test, "node --test tests/*.test.mjs");
  assert.equal(
    packageJson.scripts["test:schemas"],
    "node --test tests/schema-validation.test.mjs tests/session-event-schema.test.mjs tests/session-transcript-schema.test.mjs"
  );
  assert.equal(packageJson.scripts["report:phase-status"], "node scripts/report-phase-status.mjs");
});

test("phase status report is Phase 5.14 runtime rollback/kill-switch boundary docs/status metadata and does not claim to run checks", async () => {
  const report = await runReport();

  assert.equal(report.schemaVersion, "ardyn.phase-status-report.v1");
  assert.deepEqual(report.phase, {
    id: "5.14",
    name: "Runtime rollback/kill-switch boundary",
    executionPosture:
      "runtime-rollback-kill-switch-boundary-contract runtime-disabled no-runtime-execution"
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

  assert.deepEqual(report.verificationCommands, [
    {
      command: "npm test",
      purpose: "Run the repository node:test suite.",
      ranByReport: false
    },
    {
      command: "npm run test:schemas",
      purpose: "Run focused schema validation tests.",
      ranByReport: false
    },
    {
      command: "cargo test --workspace",
      purpose: "Run Rust workspace tests.",
      ranByReport: false
    },
    {
      command: "cargo check --workspace",
      purpose: "Check Rust workspace compilation without producing binaries.",
      ranByReport: false
    },
    {
      command: "cargo fmt --check",
      purpose: "Check Rust formatting without modifying files.",
      ranByReport: false
    },
    {
      command: "git diff --check",
      purpose: "Check the working diff for whitespace errors.",
      ranByReport: false
    },
    {
      command: "git diff --cached --check",
      purpose: "Check the staged diff for whitespace errors after new files are staged.",
      ranByReport: false
    },
    {
      command: "npm run report:phase-status",
      purpose:
        "Render this deterministic local Phase 5.14 runtime rollback/kill-switch boundary status report.",
      ranByReport: false
    },
    {
      command: "node --test tests/report-phase-status.test.mjs",
      purpose: "Run focused tests for this local Phase 5.14 status report.",
      ranByReport: false
    },
    {
      command: "node --test tests/phase5-14-runtime-rollback-kill-switch-boundary.test.mjs",
      purpose:
        "Run focused Phase 5.14 runtime rollback/kill-switch boundary and blocked-runtime checks.",
      ranByReport: false
    },
    {
      command: "node --test tests/phase5-13-runtime-process-control-boundary.test.mjs",
      purpose:
        "Run focused Phase 5.13 runtime process-control boundary and blocked-runtime checks.",
      ranByReport: false
    },
    {
      command: "node --test tests/phase5-12-runtime-transcript-audit-boundary.test.mjs",
      purpose:
        "Run focused Phase 5.12 runtime transcript/audit boundary and blocked-runtime checks.",
      ranByReport: false
    },
    {
      command: "node --test tests/phase5-11-runtime-stdio-safety-boundary.test.mjs",
      purpose:
        "Run focused Phase 5.11 runtime stdio safety boundary and blocked-runtime checks.",
      ranByReport: false
    },
    {
      command: "node --test tests/phase5-10-runtime-host-policy-boundary.test.mjs",
      purpose:
        "Run focused Phase 5.10 runtime host-policy boundary and blocked-runtime checks.",
      ranByReport: false
    },
    {
      command: "node --test tests/phase5-9-approval-evaluator-grant-boundary.test.mjs",
      purpose:
        "Run focused Phase 5.9 approval evaluator/grant boundary and blocked-runtime checks.",
      ranByReport: false
    },
    {
      command: "node --test tests/phase5-8-runtime-command-exposure-approval.test.mjs",
      purpose:
        "Run focused Phase 5.8 command-exposure approval contract and blocked-runtime checks.",
      ranByReport: false
    },
    {
      command: "node --test tests/phase5-7-runtime-approval-validation.test.mjs",
      purpose:
        "Run focused Phase 5.7 runtime approval validation contract and blocked-runtime checks.",
      ranByReport: false
    },
    {
      command: "node --test tests/phase5-6-runtime-enable-preconditions.test.mjs",
      purpose:
        "Run focused Phase 5.6 runtime enablement precondition gate and blocked-runtime checks.",
      ranByReport: false
    },
    {
      command: "node --test tests/phase5-5-default-blocked-runtime-cli.test.mjs",
      purpose:
        "Run focused Phase 5.5 default-blocked runtime CLI fixture and command behavior checks.",
      ranByReport: false
    },
    {
      command: "node --test tests/phase5-4a-jules-review-disposition.test.mjs",
      purpose:
        "Run focused Phase 5.4A Jules review disposition fixture and runtime rejection checks.",
      ranByReport: false
    },
    {
      command: "node --test tests/phase5-4-disabled-command-exposure-plan.test.mjs",
      purpose:
        "Run focused Phase 5.4 disabled command exposure fixture and runtime rejection checks.",
      ranByReport: false
    },
    {
      command: "node --test tests/phase5-3-command-surface-preflight.test.mjs",
      purpose:
        "Run focused Phase 5.3 command-surface approval preflight fixture and runtime rejection checks.",
      ranByReport: false
    },
    {
      command: "node --test tests/phase5-2-runtime-default-blocked.test.mjs",
      purpose:
        "Run focused Phase 5.2 blocked-runtime fixture and candidate command rejection checks.",
      ranByReport: false
    },
    {
      command: "fallow health --score --hotspots --targets --format json",
      purpose:
        "Run deterministic Fallow health and hotspot evidence for JS/TS/package/test/report surfaces.",
      ranByReport: false
    },
    {
      command: "fallow audit --format json",
      purpose:
        "Run deterministic Fallow changed-code audit evidence for JS/TS/package/test/report surfaces.",
      ranByReport: false
    },
    {
      command: "node --test tests/phase5-1-controlled-runtime-implementation-approval-boundary.test.mjs",
      purpose:
        "Run focused Phase 5.1 implementation approval-boundary fixture and runtime rejection checks.",
      ranByReport: false
    },
    {
      command: "node --test tests/phase5-1-command-surface-review.test.mjs",
      purpose:
        "Run focused Phase 5.1 command-surface review matrix and candidate command rejection checks.",
      ranByReport: false
    },
    {
      command: "node --test tests/phase4-2d-external-review-disposition-phase5-handoff.test.mjs",
      purpose:
        "Run focused Phase 4.2D Jules review disposition, Phase 5 handoff, and runtime rejection checks.",
      ranByReport: false
    },
    {
      command: "node --test tests/phase4-2c-runtime-readiness-review-gate.test.mjs",
      purpose:
        "Run focused Phase 4.2C readiness gate fixture, source-guard, external-review, and rejection checks.",
      ranByReport: false
    },
    {
      command: "node --test tests/phase4-2b-blocked-lifecycle-failure-audit-skeleton.test.mjs",
      purpose:
        "Run focused Phase 4.2B blocked lifecycle/failure-audit skeleton fixture, source-guard, and rejection checks.",
      ranByReport: false
    },
    {
      command: "node --test tests/phase4-2a-blocked-rust-stdio-runtime-skeleton.test.mjs",
      purpose:
        "Run focused Phase 4.2A blocked Rust-host stdio runtime skeleton fixture, source-guard, and rejection checks.",
      ranByReport: false
    },
    {
      command: "cargo test -p ardyn-host stdio_runtime",
      purpose:
        "Run Rust-host Phase 4.2B blocked stdio lifecycle/failure-audit skeleton planning and unavailable-entrypoint tests.",
      ranByReport: false
    },
    {
      command: "node --test tests/phase4-1l-runtime-implementation-readiness.test.mjs",
      purpose:
        "Run focused Phase 4.1L runtime implementation-readiness and 4.2A handoff checks.",
      ranByReport: false
    },
    {
      command: "cargo test -p ardyn-host phase4_1l",
      purpose:
        "Run Rust-host design-facing static checks for the Phase 4.1L 4.2A handoff boundary.",
      ranByReport: false
    },
    {
      command: "node --test tests/phase4-1k-stdio-runtime-contract-gates.test.mjs",
      purpose:
        "Run focused Phase 4.1K approval-gated Rust-host stdio runtime contract-gate checks.",
      ranByReport: false
    },
    {
      command: "cargo test -p ardyn-host stdio_runtime_contract",
      purpose:
        "Run Rust-host stdio runtime contract-gate tests when the Phase 4.1K Rust contract slice is present.",
      ranByReport: false
    },
    {
      command: "node --test tests/phase4-1j-rust-host-stdio-boundary-fixtures.test.mjs",
      purpose: "Run focused Phase 4.1J fixture-backed Rust-host stdio boundary checks.",
      ranByReport: false
    },
    {
      command: "node --test tests/phase4-1i-rust-host-stdio-harness.test.mjs",
      purpose: "Run focused Phase 4.1I Rust-host stdio harness boundary checks.",
      ranByReport: false
    },
    {
      command: "node --test tests/phase4-1h-external-review-disposition.test.mjs",
      purpose: "Run focused Phase 4.1H external review disposition static checks.",
      ranByReport: false
    },
    {
      command: "node --test tests/phase4-1g-external-review-packet.test.mjs",
      purpose: "Run focused Phase 4.1G external review packet static checks.",
      ranByReport: false
    },
    {
      command: "node --test tests/phase4-1f-runtime-readiness-checkpoint.test.mjs",
      purpose: "Run focused Phase 4.1F runtime-readiness checkpoint static checks.",
      ranByReport: false
    },
    {
      command: "node --test tests/phase4-1e-failure-audit-kill-semantics.test.mjs",
      purpose: "Run focused Phase 4.1E failure-audit/terminal-state/kill-exit static checks.",
      ranByReport: false
    },
    {
      command: "node --test tests/phase4-1d-transcript-replay-contracts.test.mjs",
      purpose: "Run focused Phase 4.1D transcript persistence/replay static checks.",
      ranByReport: false
    },
    {
      command: "node --test tests/phase4-1c-framing-redaction-contracts.test.mjs",
      purpose: "Run focused Phase 4.1C framing/redaction static checks.",
      ranByReport: false
    },
    {
      command: "node --test tests/phase4-1b-transport-harness-contracts.test.mjs",
      purpose: "Run focused Phase 4.1B transport harness contract static checks.",
      ranByReport: false
    },
    {
      command: "node --test tests/phase4-1a-host-policy-approval-records.test.mjs",
      purpose: "Run focused Phase 4.1A host-policy approval-record static checks.",
      ranByReport: false
    },
    {
      command: "node --test tests/phase4-1-runtime-proposal.test.mjs",
      purpose: "Run focused Phase 4.1 runtime proposal static checks.",
      ranByReport: false
    },
    {
      command: "node --test tests/phase4-0i-final-pre-runtime-readiness.test.mjs",
      purpose: "Run focused Phase 4.0I final pre-runtime readiness static checks.",
      ranByReport: false
    },
    {
      command: "node --test tests/phase4-0h-reviewer-handoff-index.test.mjs",
      purpose: "Run focused Phase 4.0H reviewer handoff index static checks.",
      ranByReport: false
    },
    {
      command: "node --test tests/host-policy-preconditions.test.mjs",
      purpose: "Run focused documentation/report checks for host-policy preconditions.",
      ranByReport: false
    },
    {
      command: "node --test tests/phase4-0c-transport-policy.test.mjs",
      purpose: "Run focused Phase 4.0C pre-runtime transport policy static checks.",
      ranByReport: false
    },
    {
      command: "node --test tests/phase4-0d-rust-host-policy-contracts.test.mjs",
      purpose: "Run focused Phase 4.0D Rust-host transport policy contract static checks.",
      ranByReport: false
    },
    {
      command: "node --test tests/phase4-0e-policy-metadata.test.mjs",
      purpose: "Run focused Phase 4.0E Rust-host policy metadata export static checks.",
      ranByReport: false
    },
    {
      command: "node --test tests/phase4-0f-host-policy-review-records.test.mjs",
      purpose: "Run focused Phase 4.0F host-policy review-record static checks.",
      ranByReport: false
    },
    {
      command: "node --test tests/phase4-0g-host-policy-review-comparison.test.mjs",
      purpose: "Run focused Phase 4.0G host-policy review-record comparison checks.",
      ranByReport: false
    },
    {
      command: "node --test tests/core-phase3-5-trace-fixtures.test.mjs",
      purpose: "Run focused Phase 3.5 trace-review fixture tests.",
      ranByReport: false
    },
    {
      command: "node --test tests/core-phase3-6-review-artifact-versioning.test.mjs",
      purpose: "Run focused Phase 3.6 review-artifact versioning and display tests.",
      ranByReport: false
    },
    {
      command: "node --test tests/core-phase3-7-schema-attestation.test.mjs",
      purpose: "Run focused Phase 3.7 schema migration and attestation planning tests.",
      ranByReport: false
    },
    {
      command: "node --test tests/session-event-schema.test.mjs",
      purpose: "Run focused Phase 3.8 session-event schema and fixture tests.",
      ranByReport: false
    },
    {
      command: "node --test tests/session-transcript-schema.test.mjs",
      purpose: "Run focused Phase 3.9 session-transcript schema and fixture tests.",
      ranByReport: false
    },
    {
      command: "node --test tests/core-phase3-9-session-transcripts.test.mjs",
      purpose: "Run focused Phase 3.9 static transcript validation and summary tests.",
      ranByReport: false
    },
    {
      command: "node --test tests/core-phase3-10-transcript-versioning.test.mjs",
      purpose: "Run focused Phase 3.10 transcript compatibility, migration, and display tests.",
      ranByReport: false
    },
    {
      command: "node --test tests/phase3-8-locus-family-alignment.test.mjs",
      purpose: "Run focused Phase 3.8 harness identity, Fabric family, and Locus display freeze tests.",
      ranByReport: false
    },
    {
      command: "node --test tests/cli-phase3.test.mjs",
      purpose: "Run focused CLI tests covering review-trace and review artifact export ergonomics.",
      ranByReport: false
    },
    {
      command: "node --test tests/core-phase4-stdio-dry-run.test.mjs",
      purpose: "Run focused Phase 4.0A core tests for JSONL event emission and path policy.",
      ranByReport: false
    },
    {
      command: "node --test tests/cli-phase4-stdio-dry-run.test.mjs",
      purpose: "Run focused Phase 4.0A CLI tests for stdout JSONL, stderr errors, and no side effects.",
      ranByReport: false
    }
  ]);

  for (const command of report.verificationCommands) {
    assert.equal(command.ranByReport, false, `${command.command} should not be run by report`);
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
    freshExternalReviewRan: true,
    freshDevinReviewRan: false,
    freshJulesReviewRan: true,
    externalCiRan: false
  };

  assert.deepEqual(report.safetyPosture.flags, expectedFlags);
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
