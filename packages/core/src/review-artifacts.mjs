import { createHash } from "node:crypto";

// Modularization: review-artifact & approval-evaluator pipeline extracted from index.mjs
// (phases 5.18-5.47). Public surface preserved via index.mjs re-export shims.
// Dependency-ordered symbol list from the extraction map (callees first).

import { isPlainObjectRecord, isUtcIsoTimestampWithMilliseconds, isReviewedAtDefaulted } from "./internal/utils.mjs";
import { APPROVAL_PREREQUISITE_INTEGRATION_CLASSIFICATION_BY_BUNDLE, APPROVAL_PREREQUISITE_INTEGRATION_CLASSIFICATION_BY_CONSUMPTION, APPROVAL_PREREQUISITE_READER_DEFAULT_REVIEWED_AT, APPROVAL_PREREQUISITE_SOURCE_PREFLIGHT_DEFAULT_REVIEWED_AT, NON_AUTHORIZING_EVALUATOR_DECISION_REQUIRED_FALSE_FIELDS, REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_CLEANUP_EVIDENCE_FIELDS, REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_RUNTIME_EFFECT_FIELDS, REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_CLEANUP_EVIDENCE_FIELDS, REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_RUNTIME_EFFECT_FIELDS, REVIEW_ONLY_EVALUATOR_PREFLIGHT_PROTOTYPE_POLLUTION_PATH_FIELDS, REVIEW_ONLY_EVALUATOR_PREFLIGHT_REQUIRED_FALSE_FIELDS, REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE, REVIEW_ONLY_INSPECTION_HANDOFF_METADATA_BOUNDARY_GRANT_KEY_PATTERN, REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_DIGEST_PATTERN, REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_DECISION_CANDIDATE_SUMMARY_FIELDS, approvalEvaluatorCandidateNestedTrueClaim, approvalPrerequisiteBundleConsumptionAcceptedSummary, approvalPrerequisiteIntegrationReviewSummary, approvalPrerequisiteSourceSelectionSignature, approvalPrerequisiteStableValue, consumerContractGapIndexForbiddenBehavior, consumerContractReadinessMatrixForbiddenBehavior, dataProperty, reviewOnlyInspectionHandoffMetadataBoundaryKeyTruePresent, reviewOnlyInspectionHandoffMetadataBoundaryRuntimeEffectAllFalse, reviewOnlyRuntimeEffectAllFalse, stableJsonStringify, targetConsumerPlanningMetadataForbiddenBehavior, MALFORMED_HUMAN_TOOL_INSPECTION_DISPOSITION_CLASSIFICATION, hasOwn, MALFORMED_REVIEW_ONLY_DISPOSITION_AGGREGATION_CLASSIFICATION, MALFORMED_REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_CLASSIFICATION, MALFORMED_REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_CLASSIFICATION, REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_REVIEWER_ROUTING_FALSE_PATHS, REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_REVIEWER_ROUTING_NULL_PATHS, MALFORMED_REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_CLASSIFICATION, MALFORMED_REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_CLASSIFICATION, MALFORMED_REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_CLASSIFICATION, REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_EXTERNAL_SYSTEM_KEYS } from "./internal/review-shared.mjs";

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
export const NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_BOUNDARY_SCHEMA =
  "ardyn.phase-5.29.non-authorizing-evaluator-decision-candidate-boundary-result";
export const NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_BOUNDARY_VERSION =
  "0.1.0";
export const NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_BOUNDARY_KIND =
  "non-authorizing-evaluator-decision-candidate-boundary";
export const NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_ARTIFACT_SCHEMA =
  "ardyn.phase-5.30.non-authorizing-evaluator-decision-candidate-inspection-artifact-result";
export const NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_ARTIFACT_VERSION =
  "0.1.0";
export const NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_ARTIFACT_KIND =
  "non-authorizing-evaluator-decision-candidate-inspection-artifact";
export const HUMAN_TOOL_INSPECTION_DISPOSITION_BOUNDARY_SCHEMA =
  "ardyn.phase-5.31.human-tool-inspection-disposition-boundary-result";
export const HUMAN_TOOL_INSPECTION_DISPOSITION_BOUNDARY_VERSION = "0.1.0";
export const HUMAN_TOOL_INSPECTION_DISPOSITION_BOUNDARY_KIND =
  "human-tool-inspection-disposition-boundary";
export const REVIEW_ONLY_DISPOSITION_AGGREGATION_CHECKPOINT_SCHEMA =
  "ardyn.phase-5.32.review-only-disposition-aggregation-checkpoint-result";
export const REVIEW_ONLY_DISPOSITION_AGGREGATION_CHECKPOINT_VERSION = "0.1.0";
export const REVIEW_ONLY_DISPOSITION_AGGREGATION_CHECKPOINT_KIND =
  "review-only-disposition-aggregation-checkpoint";
export const REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_SCHEMA =
  "ardyn.phase-5.33.review-only-aggregation-inspection-handoff-result";
export const REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_VERSION = "0.1.0";
export const REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_KIND =
  "review-only-aggregation-inspection-handoff";
export const REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_SCHEMA =
  "ardyn.phase-5.34.review-only-handoff-readiness-artifact-result";
export const REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_VERSION = "0.1.0";
export const REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_KIND =
  "review-only-handoff-readiness-artifact";
export const REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_SCHEMA =
  "ardyn.phase-5.35.review-only-readiness-inspection-checkpoint-result";
export const REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_VERSION = "0.1.0";
export const REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_KIND =
  "review-only-readiness-inspection-checkpoint";
export const REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_BOUNDARY_SCHEMA =
  "ardyn.phase-5.36.review-only-readiness-handoff-disposition-boundary-result";
export const REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_BOUNDARY_VERSION =
  "0.1.0";
export const REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_BOUNDARY_KIND =
  "review-only-readiness-handoff-disposition-boundary";
export const REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_SCHEMA =
  "ardyn.phase-5.37.review-only-handoff-disposition-inspection-checkpoint-result";
export const REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_VERSION =
  "0.1.0";
export const REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_KIND =
  "review-only-handoff-disposition-inspection-checkpoint";
export const REVIEW_ONLY_INSPECTION_HANDOFF_METADATA_BOUNDARY_SCHEMA =
  "ardyn.phase-5.38.review-only-inspection-handoff-metadata-boundary-result";
export const REVIEW_ONLY_INSPECTION_HANDOFF_METADATA_BOUNDARY_VERSION =
  "0.1.0";
export const REVIEW_ONLY_INSPECTION_HANDOFF_METADATA_BOUNDARY_KIND =
  "review-only-inspection-handoff-metadata-boundary";
export const REVIEW_ONLY_INSPECTION_HANDOFF_CHECKPOINT_SCHEMA =
  "ardyn.phase-5.39.review-only-inspection-handoff-checkpoint-result";
export const REVIEW_ONLY_INSPECTION_HANDOFF_CHECKPOINT_VERSION = "0.1.0";
export const REVIEW_ONLY_INSPECTION_HANDOFF_CHECKPOINT_KIND =
  "review-only-inspection-handoff-checkpoint";
export const REVIEW_ONLY_CHECKPOINT_HANDOFF_LAYER_SCHEMA =
  "ardyn.phase-5.40.review-only-checkpoint-handoff-layer-result";
export const REVIEW_ONLY_CHECKPOINT_HANDOFF_LAYER_VERSION = "0.1.0";
export const REVIEW_ONLY_CHECKPOINT_HANDOFF_LAYER_KIND =
  "review-only-checkpoint-handoff-layer";
export const REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_SCHEMA =
  "ardyn.phase-5.41.review-only-metadata-handoff-checkpoint-result";
export const REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_VERSION = "0.1.0";
export const REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_KIND =
  "review-only-metadata-handoff-checkpoint";
export const REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_SCHEMA =
  "ardyn.phase-5.42.review-only-handoff-metadata-consolidation-layer-result";
export const REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_VERSION =
  "0.1.0";
export const REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_KIND =
  "review-only-handoff-metadata-consolidation-layer";
export const REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_SCHEMA =
  "ardyn.phase-5.43.review-only-consolidation-checkpoint-handoff-result";
export const REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_VERSION = "0.1.0";
export const REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_KIND =
  "review-only-consolidation-checkpoint-handoff";
export const REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_SCHEMA =
  "ardyn.phase-5.44.review-only-consolidation-metadata-checkpoint-result";
export const REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_VERSION = "0.1.0";
export const REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_KIND =
  "review-only-consolidation-metadata-checkpoint";
export const TARGET_CONSUMER_PLANNING_METADATA_SCHEMA =
  "ardyn.phase-5.45.target-consumer-planning-metadata-result";
export const TARGET_CONSUMER_PLANNING_METADATA_VERSION = "0.1.0";
export const TARGET_CONSUMER_PLANNING_METADATA_KIND =
  "target-consumer-planning-metadata";
export const CONSUMER_CONTRACT_READINESS_MATRIX_SCHEMA =
  "ardyn.phase-5.46.consumer-contract-readiness-matrix-result";
export const CONSUMER_CONTRACT_READINESS_MATRIX_VERSION = "0.1.0";
export const CONSUMER_CONTRACT_READINESS_MATRIX_KIND =
  "consumer-contract-readiness-matrix";
export const CONSUMER_CONTRACT_GAP_INDEX_SCHEMA =
  "ardyn.phase-5.47.consumer-contract-gap-index-result";
export const CONSUMER_CONTRACT_GAP_INDEX_VERSION = "0.1.0";
export const CONSUMER_CONTRACT_GAP_INDEX_KIND =
  "consumer-contract-gap-index";
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
  reviewedAtDefaulted,
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
    reviewedAtDefaulted,
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
  const reviewedAtDefaulted = isReviewedAtDefaulted(input);
  const sourceInputs = approvalPrerequisiteSourceInputArray(input);

  if (sourceInputs.length === 0) {
    return approvalPrerequisiteSourcePreflightResult({
      reviewedAt,
      reviewedAtDefaulted,
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
      reviewedAtDefaulted,
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
    reviewedAtDefaulted,
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
  reviewedAtDefaulted,
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
    reviewedAtDefaulted,
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
  const reviewedAtDefaulted = isReviewedAtDefaulted(input);
  const sourceInputs = approvalPrerequisiteSourceInputArray(input);

  if (sourceInputs.length === 0) {
    return approvalPrerequisiteSourceSelectionResult({
      reviewedAt,
      reviewedAtDefaulted,
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
    reviewedAtDefaulted,
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
  reviewedAtDefaulted,
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
    reviewedAtDefaulted,
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
  const reviewedAtDefaulted = isReviewedAtDefaulted(input);
  const bundleParts = approvalPrerequisiteSourceBundleParts(input);

  if (bundleParts.length === 0) {
    return approvalPrerequisiteSourceBundleResult({
      reviewedAt,
      reviewedAtDefaulted,
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
    reviewedAtDefaulted,
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
  reviewedAtDefaulted,
  sourceBundle,
  classification
}) {
  const accepted =
    approvalPrerequisiteBundleConsumptionAccepted(classification);
  const evaluator = approvalPrerequisiteBundleConsumptionEvaluator({
    accepted,
    reviewedAt,
    reviewedAtDefaulted,
    sourceBundle
  });

  return {
    schema: APPROVAL_PREREQUISITE_BUNDLE_CONSUMPTION_CHECKPOINT_SCHEMA,
    schemaVersion: APPROVAL_PREREQUISITE_BUNDLE_CONSUMPTION_CHECKPOINT_VERSION,
    checkpointKind: APPROVAL_PREREQUISITE_BUNDLE_CONSUMPTION_CHECKPOINT_KIND,
    checkpointMode: "review-only",
    reviewedAt,
    reviewedAtDefaulted,
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
  const reviewedAtDefaulted = isReviewedAtDefaulted(input);
  const sourceBundle = approvalPrerequisiteBundleConsumptionSourceBundle(input);
  const classification =
    approvalPrerequisiteBundleConsumptionClassification(sourceBundle);

  return approvalPrerequisiteBundleConsumptionResult({
    reviewedAt,
    reviewedAtDefaulted,
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
  const reviewedAtDefaulted = isReviewedAtDefaulted(input);
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
  const reviewedAtDefaulted = isReviewedAtDefaulted(input);
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
    reviewedAtDefaulted,
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
  const reviewedAtDefaulted = isReviewedAtDefaulted(input);
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
    reviewedAtDefaulted,
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
    if (
      REVIEW_ONLY_EVALUATOR_PREFLIGHT_PROTOTYPE_POLLUTION_PATH_FIELDS.has(field) ||
      !isPlainObjectRecord(current)
    ) {
      return undefined;
    }

    current = dataProperty(current, field);
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
  const reviewedAtDefaulted = isReviewedAtDefaulted(input);
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
    reviewedAtDefaulted,
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

const NON_AUTHORIZING_EVALUATOR_DECISION_STATE_SCHEMA =
  "ardyn.phase-5.29.review-only-evaluator-decision-candidate-state";

const NON_AUTHORIZING_EVALUATOR_DECISION_MIN_REVIEWED_AT =
  "2026-06-16T00:00:00.000Z";

const VALID_NON_AUTHORIZING_EVALUATOR_DECISION_CLASSIFICATION =
  "valid_non_authorizing_evaluator_decision_candidate_runtime_still_blocked";

const NON_AUTHORIZING_EVALUATOR_DECISION_REQUIRED_FIELDS = Object.freeze([
  ...NON_AUTHORIZING_EVALUATOR_DECISION_REQUIRED_FALSE_FIELDS,
  "approvalGrantId"
]);

const NON_AUTHORIZING_EVALUATOR_DECISION_STATE_FIELDS = Object.freeze([
  "schema",
  "schemaVersion",
  "stateKind",
  "stateMode",
  "reviewedAt",
  "sourceIntakeCheckpointState",
  "pipelineSummary",
  "integratedReviewSummary",
  "evaluatorPreflightAccepted",
  "evaluatorPreflightCheckpointStateIsApprovalGrant",
  "approvalGrantProduced",
  "approvalGrantPersisted",
  "approvalGrantId",
  "runtimePermissionGranted",
  "commandExposurePermissionGranted",
  "runtimeCommandExposureEnabled",
  "runtimeExecutionEnabled",
  "evaluatorExecutionRequested",
  "evaluatorExecutionStarted",
  "evaluatorExecutionEnabled",
  "evaluatorExecuted",
  "runtimeEffect"
]);

const NON_AUTHORIZING_EVALUATOR_DECISION_SOURCE_INTAKE_FIELDS = Object.freeze([
  "schema",
  "stateKind",
  "stateMode",
  "reviewedAt",
  "stateDigest",
  "sourceEvaluatorInputCandidateDigest",
  "intakeCheckpointStateIsApprovalGrant",
  "approvalGrantProduced",
  "approvalGrantPersisted",
  "runtimeEffectAllFalse"
]);

const NON_AUTHORIZING_EVALUATOR_DECISION_PIPELINE_SUMMARY_FIELDS =
  REVIEW_ONLY_EVALUATOR_PREFLIGHT_PIPELINE_SUMMARY_FIELDS;

const NON_AUTHORIZING_EVALUATOR_DECISION_INTEGRATED_SUMMARY_FIELDS =
  REVIEW_ONLY_EVALUATOR_PREFLIGHT_INTEGRATED_SUMMARY_FIELDS;

const NON_AUTHORIZING_EVALUATOR_DECISION_ALLOWED_FIELDS = new Set([
  ...NON_AUTHORIZING_EVALUATOR_DECISION_STATE_FIELDS,
  ...NON_AUTHORIZING_EVALUATOR_DECISION_SOURCE_INTAKE_FIELDS,
  ...NON_AUTHORIZING_EVALUATOR_DECISION_PIPELINE_SUMMARY_FIELDS,
  ...NON_AUTHORIZING_EVALUATOR_DECISION_INTEGRATED_SUMMARY_FIELDS
]);

const NON_AUTHORIZING_EVALUATOR_DECISION_STATE_CHECKS = Object.freeze([
  ["schema", (value) => value === REVIEW_ONLY_EVALUATOR_PREFLIGHT_STATE_SCHEMA],
  [
    "schemaVersion",
    (value) => value === REVIEW_ONLY_EVALUATOR_PREFLIGHT_CHECKPOINT_VERSION
  ],
  ["stateKind", (value) => value === "review-only-evaluator-preflight-state"],
  ["stateMode", (value) => value === "review-only"],
  ["reviewedAt", isUtcIsoTimestampWithMilliseconds],
  ["sourceIntakeCheckpointState", isPlainObjectRecord],
  ["pipelineSummary", isPlainObjectRecord],
  ["integratedReviewSummary", isPlainObjectRecord],
  ["evaluatorPreflightAccepted", (value) => value === true],
  ["runtimeEffect", isPlainObjectRecord]
]);

const NON_AUTHORIZING_EVALUATOR_DECISION_SOURCE_INTAKE_CHECKS = Object.freeze([
  ["schema", (value) => value === APPROVAL_EVALUATOR_CANDIDATE_INTAKE_STATE_SCHEMA],
  ["stateKind", (value) => value === "approval-evaluator-candidate-intake-state"],
  ["stateMode", (value) => value === "review-only"],
  ["reviewedAt", isUtcIsoTimestampWithMilliseconds],
  [
    "stateDigest",
    (value) =>
      typeof value === "string" && /^sha256:[0-9a-f]{64}$/.test(value)
  ],
  [
    "sourceEvaluatorInputCandidateDigest",
    (value) =>
      typeof value === "string" && /^sha256:[0-9a-f]{64}$/.test(value)
  ],
  ["intakeCheckpointStateIsApprovalGrant", (value) => value === false],
  ["approvalGrantProduced", (value) => value === false],
  ["approvalGrantPersisted", (value) => value === false],
  ["runtimeEffectAllFalse", (value) => value === true]
]);

const NON_AUTHORIZING_EVALUATOR_DECISION_APPROVAL_DECISION_FIELDS =
  Object.freeze([
    "approvalDecision",
    "approvalDecisionProduced",
    "approvalDecisionPersisted",
    "approvalDecisionId",
    "approvalDecisionGranted",
    "approvalDecisionAccepted",
    "approvalDecisionAuthorized",
    "approvalDecisionResult",
    "decisionCandidateIsApprovalDecision"
  ]);

const NON_AUTHORIZING_EVALUATOR_DECISION_GENERIC_GRANT_TRUE_FIELDS =
  Object.freeze([
    "grantProduced",
    "grantPersisted",
    "grantCreated",
    "grantIssued",
    "grantAuthorized",
    "grantAccepted",
    "runtimeGrantProduced",
    "permissionGrantProduced"
  ]);

const NON_AUTHORIZING_EVALUATOR_DECISION_EVALUATOR_EXECUTION_TRUE_FIELDS =
  Object.freeze([
    "evaluatorExecutionRequested",
    "evaluatorExecutionStarted",
    "evaluatorExecutionEnabled",
    "evaluatorExecutionPerformed",
    "evaluatorExecuted"
  ]);

const NON_AUTHORIZING_EVALUATOR_DECISION_APPROVAL_GRANT_FALSE_PATHS =
  Object.freeze([
    Object.freeze(["evaluatorPreflightCheckpointStateIsApprovalGrant"]),
    Object.freeze(["approvalGrantProduced"]),
    Object.freeze(["approvalGrantPersisted"]),
    Object.freeze(["sourceIntakeCheckpointState", "intakeCheckpointStateIsApprovalGrant"]),
    Object.freeze(["sourceIntakeCheckpointState", "approvalGrantProduced"]),
    Object.freeze(["sourceIntakeCheckpointState", "approvalGrantPersisted"]),
    Object.freeze(["integratedReviewSummary", "reviewSummaryIsApprovalGrant"]),
    Object.freeze(["integratedReviewSummary", "approvalGrantProduced"]),
    Object.freeze(["integratedReviewSummary", "approvalGrantPersisted"])
  ]);

const NON_AUTHORIZING_EVALUATOR_DECISION_APPROVAL_GRANT_NULL_PATHS =
  Object.freeze([
    Object.freeze(["approvalGrantId"]),
    Object.freeze(["integratedReviewSummary", "approvalGrantId"])
  ]);

const NON_AUTHORIZING_EVALUATOR_DECISION_APPROVAL_GRANT_TRUE_PATHS =
  Object.freeze([
    Object.freeze(["approvalGrant", "produced"]),
    Object.freeze(["approvalGrant", "persisted"])
  ]);

function nonAuthorizingEvaluatorDecisionUnexpectedUnsafeField(
  value,
  seen = new Set()
) {
  if (Array.isArray(value)) {
    return value.some((entry) =>
      nonAuthorizingEvaluatorDecisionUnexpectedUnsafeField(entry, seen)
    );
  }

  if (!isPlainObjectRecord(value) || seen.has(value)) {
    return false;
  }

  seen.add(value);

  return Object.entries(value).some(
    ([key, entry]) =>
      (!NON_AUTHORIZING_EVALUATOR_DECISION_ALLOWED_FIELDS.has(key) &&
        APPROVAL_EVALUATOR_CANDIDATE_UNSAFE_TRUE_FIELD_PATTERN.test(key)) ||
      nonAuthorizingEvaluatorDecisionUnexpectedUnsafeField(entry, seen)
  );
}

function nonAuthorizingEvaluatorDecisionApprovalDecisionLooking(
  value,
  seen = new Set()
) {
  if (Array.isArray(value)) {
    return value.some((entry) =>
      nonAuthorizingEvaluatorDecisionApprovalDecisionLooking(entry, seen)
    );
  }

  if (!isPlainObjectRecord(value) || seen.has(value)) {
    return false;
  }

  seen.add(value);

  return Object.entries(value).some(
    ([key, entry]) =>
      NON_AUTHORIZING_EVALUATOR_DECISION_APPROVAL_DECISION_FIELDS.includes(key) ||
      key === "decision" ||
      nonAuthorizingEvaluatorDecisionApprovalDecisionLooking(entry, seen)
  );
}

function nonAuthorizingEvaluatorDecisionUnknown(preflightState) {
  return (
    (typeof preflightState.schema === "string" &&
      preflightState.schema !== REVIEW_ONLY_EVALUATOR_PREFLIGHT_STATE_SCHEMA) ||
    (typeof preflightState.stateKind === "string" &&
      preflightState.stateKind !== "review-only-evaluator-preflight-state")
  );
}

function nonAuthorizingEvaluatorDecisionRevoked(preflightState) {
  return (
    preflightState.revoked === true ||
    (isPlainObjectRecord(preflightState.revocation) &&
      preflightState.revocation.revoked === true)
  );
}

function nonAuthorizingEvaluatorDecisionStale(preflightState) {
  return (
    isUtcIsoTimestampWithMilliseconds(preflightState.reviewedAt) &&
    preflightState.reviewedAt <
      NON_AUTHORIZING_EVALUATOR_DECISION_MIN_REVIEWED_AT
  );
}

const NON_AUTHORIZING_EVALUATOR_DECISION_MALFORMED_CHECKS = Object.freeze([
  (preflightState) =>
    !recordHasExactFields(
      preflightState,
      NON_AUTHORIZING_EVALUATOR_DECISION_STATE_FIELDS
    ),
  (preflightState) =>
    !recordPassesChecks(
      preflightState,
      NON_AUTHORIZING_EVALUATOR_DECISION_STATE_CHECKS
    ),
  (preflightState) =>
    !recordHasExactFields(
      preflightState.sourceIntakeCheckpointState,
      NON_AUTHORIZING_EVALUATOR_DECISION_SOURCE_INTAKE_FIELDS
    ),
  (preflightState) =>
    !recordHasFields(
      preflightState,
      NON_AUTHORIZING_EVALUATOR_DECISION_REQUIRED_FIELDS
    ),
  (preflightState) =>
    !recordPassesChecks(
      preflightState.sourceIntakeCheckpointState,
      NON_AUTHORIZING_EVALUATOR_DECISION_SOURCE_INTAKE_CHECKS
    ),
  (preflightState) =>
    !recordHasExactFields(
      preflightState.pipelineSummary,
      NON_AUTHORIZING_EVALUATOR_DECISION_PIPELINE_SUMMARY_FIELDS
    ),
  (preflightState) =>
    !recordPassesChecks(
      preflightState.pipelineSummary,
      PREREQUISITE_REVIEW_ARTIFACT_PIPELINE_CHECKS
    ),
  (preflightState) =>
    !recordHasExactFields(
      preflightState.integratedReviewSummary,
      NON_AUTHORIZING_EVALUATOR_DECISION_INTEGRATED_SUMMARY_FIELDS
    ),
  (preflightState) =>
    !recordPassesChecks(
      preflightState.integratedReviewSummary,
      PREREQUISITE_REVIEW_ARTIFACT_SUMMARY_CHECKS
    )
]);

function nonAuthorizingEvaluatorDecisionMalformed(preflightState) {
  return NON_AUTHORIZING_EVALUATOR_DECISION_MALFORMED_CHECKS.some(
    (predicate) => predicate(preflightState)
  );
}

function nonAuthorizingEvaluatorDecisionGrantLooking(preflightState) {
  return approvalEvaluatorCandidateNestedTrueClaim(
    preflightState,
    (key) =>
      NON_AUTHORIZING_EVALUATOR_DECISION_GENERIC_GRANT_TRUE_FIELDS.includes(key)
  );
}

function nonAuthorizingEvaluatorDecisionApprovalGrantLooking(preflightState) {
  return (
    NON_AUTHORIZING_EVALUATOR_DECISION_APPROVAL_GRANT_FALSE_PATHS.some((path) =>
      reviewOnlyEvaluatorPreflightPathDoesNotMatch(preflightState, path, false)
    ) ||
    NON_AUTHORIZING_EVALUATOR_DECISION_APPROVAL_GRANT_NULL_PATHS.some((path) =>
      reviewOnlyEvaluatorPreflightPathDoesNotMatch(preflightState, path, null)
    ) ||
    NON_AUTHORIZING_EVALUATOR_DECISION_APPROVAL_GRANT_TRUE_PATHS.some(
      (path) => reviewOnlyEvaluatorPreflightPathValue(preflightState, path) === true
    )
  );
}

function nonAuthorizingEvaluatorDecisionRuntimePermissionLooking(preflightState) {
  return approvalEvaluatorCandidateNestedTrueClaim(
    preflightState,
    (key) =>
      REVIEW_ONLY_EVALUATOR_PREFLIGHT_RUNTIME_PERMISSION_TRUE_FIELDS.includes(key)
  );
}

function nonAuthorizingEvaluatorDecisionCommandExposureLooking(preflightState) {
  return approvalEvaluatorCandidateNestedTrueClaim(
    preflightState,
    (key) =>
      REVIEW_ONLY_EVALUATOR_PREFLIGHT_COMMAND_EXPOSURE_TRUE_FIELDS.includes(key)
  );
}

function nonAuthorizingEvaluatorDecisionEvaluatorExecutionLooking(preflightState) {
  return approvalEvaluatorCandidateNestedTrueClaim(
    preflightState,
    (key) =>
      NON_AUTHORIZING_EVALUATOR_DECISION_EVALUATOR_EXECUTION_TRUE_FIELDS.includes(
        key
      )
  );
}

function nonAuthorizingEvaluatorDecisionExecutionSignalLooking(preflightState) {
  return approvalEvaluatorCandidateNestedTrueClaim(
    preflightState,
    (key) => REVIEW_ONLY_EVALUATOR_PREFLIGHT_EXECUTION_SIGNAL_TRUE_FIELDS.includes(key)
  );
}

function nonAuthorizingEvaluatorDecisionRuntimeEffectTrue(preflightState) {
  return approvalEvaluatorCandidateRuntimeEffectTrue(preflightState);
}

function nonAuthorizingEvaluatorDecisionProcessFlagTrue(preflightState) {
  return approvalEvaluatorCandidateNestedTrueClaim(
    preflightState,
    (key) => APPROVAL_EVALUATOR_CANDIDATE_PROCESS_TRUE_FIELDS.includes(key)
  );
}

function nonAuthorizingEvaluatorDecisionUnsafeTrueSurface(preflightState) {
  return approvalEvaluatorCandidateNestedTrueClaim(
    preflightState,
    (key) => APPROVAL_EVALUATOR_CANDIDATE_UNSAFE_TRUE_FIELD_PATTERN.test(key)
  );
}

function nonAuthorizingEvaluatorDecisionAuthorizing(preflightState) {
  return approvalEvaluatorCandidateNestedTrueClaim(
    preflightState,
    (key) =>
      REVIEW_ONLY_EVALUATOR_PREFLIGHT_AUTHORITATIVE_TRUE_FIELDS.includes(key)
  );
}

const NON_AUTHORIZING_EVALUATOR_DECISION_SINGLE_REJECTION_CHECKS =
  Object.freeze([
    [
      (preflightState) => !isPlainObjectRecord(preflightState),
      "malformed_non_authorizing_evaluator_decision_candidate_input_rejected"
    ],
    [
      nonAuthorizingEvaluatorDecisionUnknown,
      "unknown_non_authorizing_evaluator_decision_candidate_input_rejected"
    ],
    [
      nonAuthorizingEvaluatorDecisionRevoked,
      "revoked_non_authorizing_evaluator_decision_candidate_input_rejected"
    ],
    [
      nonAuthorizingEvaluatorDecisionStale,
      "stale_non_authorizing_evaluator_decision_candidate_input_rejected"
    ],
    [
      nonAuthorizingEvaluatorDecisionApprovalDecisionLooking,
      "approval_decision_looking_non_authorizing_evaluator_decision_candidate_input_rejected"
    ],
    [
      nonAuthorizingEvaluatorDecisionUnexpectedUnsafeField,
      "unsafe_non_authorizing_evaluator_decision_candidate_input_rejected"
    ],
    [
      nonAuthorizingEvaluatorDecisionGrantLooking,
      "grant_looking_non_authorizing_evaluator_decision_candidate_input_rejected"
    ],
    [
      nonAuthorizingEvaluatorDecisionApprovalGrantLooking,
      "approval_grant_looking_non_authorizing_evaluator_decision_candidate_input_rejected"
    ],
    [
      nonAuthorizingEvaluatorDecisionRuntimePermissionLooking,
      "runtime_permission_looking_non_authorizing_evaluator_decision_candidate_input_rejected"
    ],
    [
      nonAuthorizingEvaluatorDecisionCommandExposureLooking,
      "command_exposure_looking_non_authorizing_evaluator_decision_candidate_input_rejected"
    ],
    [
      nonAuthorizingEvaluatorDecisionEvaluatorExecutionLooking,
      "evaluator_execution_looking_non_authorizing_evaluator_decision_candidate_input_rejected"
    ],
    [
      nonAuthorizingEvaluatorDecisionExecutionSignalLooking,
      "execution_signal_looking_non_authorizing_evaluator_decision_candidate_input_rejected"
    ],
    [
      nonAuthorizingEvaluatorDecisionRuntimeEffectTrue,
      "runtime_effect_true_non_authorizing_evaluator_decision_candidate_input_rejected"
    ],
    [
      nonAuthorizingEvaluatorDecisionProcessFlagTrue,
      "process_flag_true_non_authorizing_evaluator_decision_candidate_input_rejected"
    ],
    [
      nonAuthorizingEvaluatorDecisionUnsafeTrueSurface,
      "unsafe_non_authorizing_evaluator_decision_candidate_input_rejected"
    ],
    [
      nonAuthorizingEvaluatorDecisionAuthorizing,
      "authorizing_non_authorizing_evaluator_decision_candidate_input_rejected"
    ],
    [
      nonAuthorizingEvaluatorDecisionMalformed,
      "malformed_non_authorizing_evaluator_decision_candidate_input_rejected"
    ]
  ]);

function nonAuthorizingEvaluatorDecisionSingleClassification(preflightState) {
  return (
    NON_AUTHORIZING_EVALUATOR_DECISION_SINGLE_REJECTION_CHECKS.find(
      ([predicate]) => predicate(preflightState)
    )?.[1] ?? VALID_NON_AUTHORIZING_EVALUATOR_DECISION_CLASSIFICATION
  );
}

function firstNonAuthorizingEvaluatorDecisionRejection(preflightStates) {
  return (
    preflightStates
      .map(nonAuthorizingEvaluatorDecisionSingleClassification)
      .find(
        (classification) =>
          classification !== VALID_NON_AUTHORIZING_EVALUATOR_DECISION_CLASSIFICATION
      ) ?? null
  );
}

function nonAuthorizingEvaluatorDecisionStatesContainDuplicate(preflightStates) {
  const digests = preflightStates.map((preflightState) =>
    reviewArtifactHandoffDigest(preflightState)
  );

  return new Set(digests).size !== digests.length;
}

const NON_AUTHORIZING_EVALUATOR_DECISION_RESOLVERS = Object.freeze([
  (preflightStates) =>
    preflightStates === undefined
      ? "missing_non_authorizing_evaluator_decision_candidate_input_rejected"
      : null,
  (preflightStates) =>
    !Array.isArray(preflightStates)
      ? "malformed_non_authorizing_evaluator_decision_candidate_input_rejected"
      : null,
  (preflightStates) =>
    preflightStates.length === 0
      ? "empty_non_authorizing_evaluator_decision_candidate_input_rejected"
      : null,
  firstNonAuthorizingEvaluatorDecisionRejection,
  (preflightStates) =>
    nonAuthorizingEvaluatorDecisionStatesContainDuplicate(preflightStates)
      ? "duplicate_invalid_non_authorizing_evaluator_decision_candidate_input_rejected"
      : null,
  (preflightStates) =>
    preflightStates.length > 1
      ? "conflicting_non_authorizing_evaluator_decision_candidate_input_rejected"
      : null
]);

function nonAuthorizingEvaluatorDecisionClassification(preflightStates) {
  let classification = null;

  NON_AUTHORIZING_EVALUATOR_DECISION_RESOLVERS.some((resolver) => {
    classification = resolver(preflightStates);
    return classification !== null;
  });

  return classification ?? VALID_NON_AUTHORIZING_EVALUATOR_DECISION_CLASSIFICATION;
}

function nonAuthorizingEvaluatorDecisionCandidateSummary() {
  return {
    candidateKind: "review-only-evaluator-decision-candidate",
    candidateMode: "review-only",
    candidateClassification:
      VALID_NON_AUTHORIZING_EVALUATOR_DECISION_CLASSIFICATION,
    reviewArtifactOnly: true,
    approvalDecisionProduced: false,
    approvalGrantProduced: false,
    runtimePermissionGranted: false,
    commandExposurePermissionGranted: false,
    evaluatorExecuted: false,
    runtimeEffectAllFalse: true
  };
}

function nonAuthorizingEvaluatorDecisionStateFromPreflightState(
  preflightState,
  reviewedAt
) {
  return {
    schema: NON_AUTHORIZING_EVALUATOR_DECISION_STATE_SCHEMA,
    schemaVersion:
      NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_BOUNDARY_VERSION,
    stateKind: "review-only-evaluator-decision-candidate-state",
    stateMode: "review-only",
    reviewedAt,
    sourcePreflightCheckpointState: {
      schema: preflightState.schema,
      stateKind: preflightState.stateKind,
      stateMode: preflightState.stateMode,
      reviewedAt: preflightState.reviewedAt,
      stateDigest: reviewArtifactHandoffDigest(preflightState),
      sourceIntakeCheckpointStateDigest:
        preflightState.sourceIntakeCheckpointState.stateDigest,
      sourceEvaluatorInputCandidateDigest:
        preflightState.sourceIntakeCheckpointState
          .sourceEvaluatorInputCandidateDigest,
      preflightCheckpointStateIsApprovalGrant: false,
      approvalDecisionProduced: false,
      approvalGrantProduced: false,
      approvalGrantPersisted: false,
      evaluatorExecuted: false,
      runtimeEffectAllFalse: true
    },
    pipelineSummary: reviewOnlyEvaluatorPreflightPipelineSummary(
      preflightState.pipelineSummary
    ),
    integratedReviewSummary: reviewOnlyEvaluatorPreflightIntegratedSummary(
      preflightState.integratedReviewSummary
    ),
    decisionCandidateSummary: nonAuthorizingEvaluatorDecisionCandidateSummary(),
    decisionCandidateAccepted: true,
    reviewArtifactOnly: true,
    decisionCandidateStateIsApprovalDecision: false,
    decisionCandidateStateIsApprovalGrant: false,
    approvalDecisionProduced: false,
    approvalDecisionPersisted: false,
    approvalDecisionId: null,
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

function nonAuthorizingEvaluatorDecisionRejectionReasons({
  accepted,
  classification
}) {
  if (accepted) {
    return [
      "evaluator_decision_candidate_state_is_review_artifact_only",
      "approval_decision_not_implemented",
      "approval_grant_not_implemented",
      "evaluator_execution_not_implemented",
      "runtime_enablement_still_blocked"
    ];
  }

  return [
    classification,
    "evaluator_decision_candidate_state_not_produced",
    "approval_decision_not_implemented",
    "approval_grant_not_implemented",
    "evaluator_execution_not_implemented",
    "runtime_enablement_still_blocked"
  ];
}

export function createNonAuthorizingEvaluatorDecisionCandidateBoundaryForReview(
  input = {}
) {
  const reviewedAt = approvalPrerequisiteSourceReviewedAt(input);
  const reviewedAtDefaulted = isReviewedAtDefaulted(input);
  const preflightCheckpointStates = input.preflightCheckpointStates;
  const classification = nonAuthorizingEvaluatorDecisionClassification(
    preflightCheckpointStates
  );
  const accepted =
    classification === VALID_NON_AUTHORIZING_EVALUATOR_DECISION_CLASSIFICATION;
  const preflightCheckpointState = accepted ? preflightCheckpointStates[0] : null;
  const decisionCandidateState = accepted
    ? nonAuthorizingEvaluatorDecisionStateFromPreflightState(
        preflightCheckpointState,
        reviewedAt
      )
    : null;

  return {
    schema: NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_BOUNDARY_SCHEMA,
    schemaVersion:
      NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_BOUNDARY_VERSION,
    boundaryKind: NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_BOUNDARY_KIND,
    boundaryMode: "review-only",
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    preflightCheckpointStateAccepted: accepted,
    decisionCandidateStateProduced: accepted,
    decisionCandidateStateIsApprovalDecision: false,
    decisionCandidateStateIsApprovalGrant: false,
    decisionCandidateState,
    decisionCandidateSummary: accepted
      ? {
          schema: preflightCheckpointState.schema,
          stateKind: preflightCheckpointState.stateKind,
          stateMode: preflightCheckpointState.stateMode,
          reviewedAt: preflightCheckpointState.reviewedAt,
          stateDigest: reviewArtifactHandoffDigest(preflightCheckpointState),
          preflightCheckpointStateIsApprovalGrant: false,
          approvalDecisionProduced: false,
          approvalGrantProduced: false,
          approvalGrantPersisted: false,
          evaluatorExecuted: false,
          runtimeEffectAllFalse: true
        }
      : null,
    reviewOnly: true,
    authoritative: false,
    reviewArtifactOnly: true,
    approvalDecisionProduced: false,
    approvalDecisionPersisted: false,
    approvalDecisionId: null,
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
    rejectionReasons: nonAuthorizingEvaluatorDecisionRejectionReasons({
      accepted,
      classification
    }),
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

const NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_ARTIFACT_INTERNAL_SCHEMA =
  "ardyn.phase-5.30.non-authorizing-evaluator-decision-candidate-inspection-artifact";

const NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_MIN_REVIEWED_AT =
  "2026-06-16T00:00:00.000Z";

const VALID_NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_CLASSIFICATION =
  "valid_non_authorizing_evaluator_decision_candidate_inspection_artifact_runtime_still_blocked";

const NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_REQUIRED_FALSE_FIELDS =
  Object.freeze([
    "decisionCandidateStateIsApprovalDecision",
    "decisionCandidateStateIsApprovalGrant",
    "approvalDecisionProduced",
    "approvalDecisionPersisted",
    "approvalGrantProduced",
    "approvalGrantPersisted",
    "runtimePermissionGranted",
    "commandExposurePermissionGranted",
    "runtimeCommandExposureEnabled",
    "runtimeExecutionEnabled",
    "evaluatorExecutionRequested",
    "evaluatorExecutionStarted",
    "evaluatorExecutionEnabled",
    "evaluatorExecuted"
  ]);

const NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_REQUIRED_NULL_FIELDS =
  Object.freeze(["approvalDecisionId", "approvalGrantId"]);

const NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_STATE_FIELDS =
  Object.freeze([
    "schema",
    "schemaVersion",
    "stateKind",
    "stateMode",
    "reviewedAt",
    "sourcePreflightCheckpointState",
    "pipelineSummary",
    "integratedReviewSummary",
    "decisionCandidateSummary",
    "decisionCandidateAccepted",
    "reviewArtifactOnly",
    "decisionCandidateStateIsApprovalDecision",
    "decisionCandidateStateIsApprovalGrant",
    "approvalDecisionProduced",
    "approvalDecisionPersisted",
    "approvalDecisionId",
    "approvalGrantProduced",
    "approvalGrantPersisted",
    "approvalGrantId",
    "runtimePermissionGranted",
    "commandExposurePermissionGranted",
    "runtimeCommandExposureEnabled",
    "runtimeExecutionEnabled",
    "evaluatorExecutionRequested",
    "evaluatorExecutionStarted",
    "evaluatorExecutionEnabled",
    "evaluatorExecuted",
    "runtimeEffect"
  ]);

const NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_SOURCE_PREFLIGHT_FIELDS =
  Object.freeze([
    "schema",
    "stateKind",
    "stateMode",
    "reviewedAt",
    "stateDigest",
    "sourceIntakeCheckpointStateDigest",
    "sourceEvaluatorInputCandidateDigest",
    "preflightCheckpointStateIsApprovalGrant",
    "approvalDecisionProduced",
    "approvalGrantProduced",
    "approvalGrantPersisted",
    "evaluatorExecuted",
    "runtimeEffectAllFalse"
  ]);

const NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_SUMMARY_FIELDS =
  Object.freeze([
    "candidateKind",
    "candidateMode",
    "candidateClassification",
    "reviewArtifactOnly",
    "approvalDecisionProduced",
    "approvalGrantProduced",
    "runtimePermissionGranted",
    "commandExposurePermissionGranted",
    "evaluatorExecuted",
    "runtimeEffectAllFalse"
  ]);

const NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_ALLOWED_FIELDS =
  new Set([
    ...NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_STATE_FIELDS,
    ...NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_SOURCE_PREFLIGHT_FIELDS,
    ...NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_SUMMARY_FIELDS,
    ...NON_AUTHORIZING_EVALUATOR_DECISION_PIPELINE_SUMMARY_FIELDS,
    ...NON_AUTHORIZING_EVALUATOR_DECISION_INTEGRATED_SUMMARY_FIELDS
  ]);

const NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_STATE_CHECKS =
  Object.freeze([
    [
      "schema",
      (value) => value === NON_AUTHORIZING_EVALUATOR_DECISION_STATE_SCHEMA
    ],
    [
      "schemaVersion",
      (value) =>
        value === NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_BOUNDARY_VERSION
    ],
    [
      "stateKind",
      (value) => value === "review-only-evaluator-decision-candidate-state"
    ],
    ["stateMode", (value) => value === "review-only"],
    ["reviewedAt", isUtcIsoTimestampWithMilliseconds],
    ["sourcePreflightCheckpointState", isPlainObjectRecord],
    ["pipelineSummary", isPlainObjectRecord],
    ["integratedReviewSummary", isPlainObjectRecord],
    ["decisionCandidateSummary", isPlainObjectRecord],
    ["decisionCandidateAccepted", (value) => value === true],
    ["reviewArtifactOnly", (value) => value === true],
    ["runtimeEffect", isPlainObjectRecord]
  ]);

const NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_SOURCE_PREFLIGHT_CHECKS =
  Object.freeze([
    [
      "schema",
      (value) => value === REVIEW_ONLY_EVALUATOR_PREFLIGHT_STATE_SCHEMA
    ],
    [
      "stateKind",
      (value) => value === "review-only-evaluator-preflight-state"
    ],
    ["stateMode", (value) => value === "review-only"],
    ["reviewedAt", isUtcIsoTimestampWithMilliseconds],
    [
      "stateDigest",
      (value) =>
        typeof value === "string" && /^sha256:[0-9a-f]{64}$/.test(value)
    ],
    [
      "sourceIntakeCheckpointStateDigest",
      (value) =>
        typeof value === "string" && /^sha256:[0-9a-f]{64}$/.test(value)
    ],
    [
      "sourceEvaluatorInputCandidateDigest",
      (value) =>
        typeof value === "string" && /^sha256:[0-9a-f]{64}$/.test(value)
    ],
    ["preflightCheckpointStateIsApprovalGrant", (value) => value === false],
    ["approvalDecisionProduced", (value) => value === false],
    ["approvalGrantProduced", (value) => value === false],
    ["approvalGrantPersisted", (value) => value === false],
    ["evaluatorExecuted", (value) => value === false],
    ["runtimeEffectAllFalse", (value) => value === true]
  ]);

const NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_SUMMARY_CHECKS =
  Object.freeze([
    [
      "candidateKind",
      (value) => value === "review-only-evaluator-decision-candidate"
    ],
    ["candidateMode", (value) => value === "review-only"],
    [
      "candidateClassification",
      (value) => value === VALID_NON_AUTHORIZING_EVALUATOR_DECISION_CLASSIFICATION
    ],
    ["reviewArtifactOnly", (value) => value === true],
    ["approvalDecisionProduced", (value) => value === false],
    ["approvalGrantProduced", (value) => value === false],
    ["runtimePermissionGranted", (value) => value === false],
    ["commandExposurePermissionGranted", (value) => value === false],
    ["evaluatorExecuted", (value) => value === false],
    ["runtimeEffectAllFalse", (value) => value === true]
  ]);

const NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_APPROVAL_DECISION_FALSE_PATHS =
  Object.freeze([
    Object.freeze(["decisionCandidateStateIsApprovalDecision"]),
    Object.freeze(["approvalDecisionProduced"]),
    Object.freeze(["approvalDecisionPersisted"]),
    Object.freeze(["sourcePreflightCheckpointState", "approvalDecisionProduced"]),
    Object.freeze(["decisionCandidateSummary", "approvalDecisionProduced"])
  ]);

const NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_APPROVAL_DECISION_NULL_PATHS =
  Object.freeze([Object.freeze(["approvalDecisionId"])]);

const NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_APPROVAL_DECISION_TRUE_FIELDS =
  Object.freeze([
    "approvalDecisionGranted",
    "approvalDecisionAccepted",
    "approvalDecisionAuthorized",
    "decisionCandidateIsApprovalDecision"
  ]);

const NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_APPROVAL_GRANT_FALSE_PATHS =
  Object.freeze([
    Object.freeze(["decisionCandidateStateIsApprovalGrant"]),
    Object.freeze(["approvalGrantProduced"]),
    Object.freeze(["approvalGrantPersisted"]),
    Object.freeze([
      "sourcePreflightCheckpointState",
      "preflightCheckpointStateIsApprovalGrant"
    ]),
    Object.freeze(["sourcePreflightCheckpointState", "approvalGrantProduced"]),
    Object.freeze(["sourcePreflightCheckpointState", "approvalGrantPersisted"]),
    Object.freeze(["integratedReviewSummary", "reviewSummaryIsApprovalGrant"]),
    Object.freeze(["integratedReviewSummary", "approvalGrantProduced"]),
    Object.freeze(["integratedReviewSummary", "approvalGrantPersisted"]),
    Object.freeze(["decisionCandidateSummary", "approvalGrantProduced"])
  ]);

const NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_APPROVAL_GRANT_NULL_PATHS =
  Object.freeze([
    Object.freeze(["approvalGrantId"]),
    Object.freeze(["integratedReviewSummary", "approvalGrantId"])
  ]);

const NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_APPROVAL_GRANT_TRUE_PATHS =
  Object.freeze([
    Object.freeze(["approvalGrant", "produced"]),
    Object.freeze(["approvalGrant", "persisted"])
  ]);

const NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_GENERIC_GRANT_TRUE_FIELDS =
  Object.freeze([
    "grantProduced",
    "grantPersisted",
    "grantCreated",
    "grantIssued",
    "grantAuthorized",
    "grantAccepted",
    "runtimeGrantProduced",
    "permissionGrantProduced"
  ]);

const NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_EVALUATOR_EXECUTION_TRUE_FIELDS =
  Object.freeze([
    "evaluatorExecutionRequested",
    "evaluatorExecutionStarted",
    "evaluatorExecutionEnabled",
    "evaluatorExecutionPerformed",
    "evaluatorExecuted"
  ]);

const NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_EVALUATOR_RESULT_FIELDS =
  Object.freeze([
    "evaluatorResult",
    "evaluatorResultProduced",
    "evaluatorResultPersisted",
    "evaluatorResultId",
    "evaluationResult",
    "evaluatorOutput",
    "evaluatorOutcome",
    "resultProduced"
  ]);

function nonAuthorizingEvaluatorDecisionCandidateInspectionUnexpectedUnsafeField(
  value,
  seen = new Set()
) {
  if (Array.isArray(value)) {
    return value.some((entry) =>
      nonAuthorizingEvaluatorDecisionCandidateInspectionUnexpectedUnsafeField(
        entry,
        seen
      )
    );
  }

  if (!isPlainObjectRecord(value) || seen.has(value)) {
    return false;
  }

  seen.add(value);

  return Object.entries(value).some(
    ([key, entry]) =>
      (!NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_ALLOWED_FIELDS.has(
        key
      ) &&
        APPROVAL_EVALUATOR_CANDIDATE_UNSAFE_TRUE_FIELD_PATTERN.test(key)) ||
      nonAuthorizingEvaluatorDecisionCandidateInspectionUnexpectedUnsafeField(
        entry,
        seen
      )
  );
}

function nonAuthorizingEvaluatorDecisionCandidateInspectionKeyPresent(
  value,
  keys,
  seen = new Set()
) {
  if (Array.isArray(value)) {
    return value.some((entry) =>
      nonAuthorizingEvaluatorDecisionCandidateInspectionKeyPresent(
        entry,
        keys,
        seen
      )
    );
  }

  if (!isPlainObjectRecord(value) || seen.has(value)) {
    return false;
  }

  seen.add(value);

  return Object.entries(value).some(
    ([key, entry]) =>
      keys.includes(key) ||
      nonAuthorizingEvaluatorDecisionCandidateInspectionKeyPresent(
        entry,
        keys,
        seen
      )
  );
}

function nonAuthorizingEvaluatorDecisionCandidateInspectionUnknown(
  decisionCandidateState
) {
  return (
    (typeof decisionCandidateState.schema === "string" &&
      decisionCandidateState.schema !==
        NON_AUTHORIZING_EVALUATOR_DECISION_STATE_SCHEMA) ||
    (typeof decisionCandidateState.stateKind === "string" &&
      decisionCandidateState.stateKind !==
        "review-only-evaluator-decision-candidate-state")
  );
}

function nonAuthorizingEvaluatorDecisionCandidateInspectionRevoked(
  decisionCandidateState
) {
  return (
    decisionCandidateState.revoked === true ||
    (isPlainObjectRecord(decisionCandidateState.revocation) &&
      decisionCandidateState.revocation.revoked === true)
  );
}

function nonAuthorizingEvaluatorDecisionCandidateInspectionStale(
  decisionCandidateState
) {
  return (
    isUtcIsoTimestampWithMilliseconds(decisionCandidateState.reviewedAt) &&
    decisionCandidateState.reviewedAt <
      NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_MIN_REVIEWED_AT
  );
}

const NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_MALFORMED_CHECKS =
  Object.freeze([
    (decisionCandidateState) =>
      !recordHasExactFields(
        decisionCandidateState,
        NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_STATE_FIELDS
      ),
    (decisionCandidateState) =>
      !recordPassesChecks(
        decisionCandidateState,
        NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_STATE_CHECKS
      ),
    (decisionCandidateState) =>
      !recordHasExactFields(
        decisionCandidateState.sourcePreflightCheckpointState,
        NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_SOURCE_PREFLIGHT_FIELDS
      ),
    (decisionCandidateState) =>
      !recordPassesChecks(
        decisionCandidateState.sourcePreflightCheckpointState,
        NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_SOURCE_PREFLIGHT_CHECKS
      ),
    (decisionCandidateState) =>
      !recordHasExactFields(
        decisionCandidateState.pipelineSummary,
        NON_AUTHORIZING_EVALUATOR_DECISION_PIPELINE_SUMMARY_FIELDS
      ),
    (decisionCandidateState) =>
      !recordPassesChecks(
        decisionCandidateState.pipelineSummary,
        PREREQUISITE_REVIEW_ARTIFACT_PIPELINE_CHECKS
      ),
    (decisionCandidateState) =>
      !recordHasExactFields(
        decisionCandidateState.integratedReviewSummary,
        NON_AUTHORIZING_EVALUATOR_DECISION_INTEGRATED_SUMMARY_FIELDS
      ),
    (decisionCandidateState) =>
      !recordPassesChecks(
        decisionCandidateState.integratedReviewSummary,
        PREREQUISITE_REVIEW_ARTIFACT_SUMMARY_CHECKS
      ),
    (decisionCandidateState) =>
      !recordHasExactFields(
        decisionCandidateState.decisionCandidateSummary,
        NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_SUMMARY_FIELDS
      ),
    (decisionCandidateState) =>
      !recordPassesChecks(
        decisionCandidateState.decisionCandidateSummary,
        NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_SUMMARY_CHECKS
      ),
    (decisionCandidateState) =>
      !recordPassesChecks(
        decisionCandidateState,
        NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_REQUIRED_FALSE_FIELDS.map(
          (field) => [field, (value) => value === false]
        )
      ),
    (decisionCandidateState) =>
      !recordPassesChecks(
        decisionCandidateState,
        NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_REQUIRED_NULL_FIELDS.map(
          (field) => [field, (value) => value === null]
        )
      )
  ]);

function nonAuthorizingEvaluatorDecisionCandidateInspectionMalformed(
  decisionCandidateState
) {
  return NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_MALFORMED_CHECKS.some(
    (predicate) => predicate(decisionCandidateState)
  );
}

function nonAuthorizingEvaluatorDecisionCandidateInspectionGrantLooking(
  decisionCandidateState
) {
  return approvalEvaluatorCandidateNestedTrueClaim(
    decisionCandidateState,
    (key) =>
      NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_GENERIC_GRANT_TRUE_FIELDS.includes(
        key
      )
  );
}

function nonAuthorizingEvaluatorDecisionCandidateInspectionApprovalDecisionLooking(
  decisionCandidateState
) {
  return (
    NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_APPROVAL_DECISION_FALSE_PATHS.some(
      (path) => reviewOnlyEvaluatorPreflightPathDoesNotMatch(
        decisionCandidateState,
        path,
        false
      )
    ) ||
    NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_APPROVAL_DECISION_NULL_PATHS.some(
      (path) => reviewOnlyEvaluatorPreflightPathDoesNotMatch(
        decisionCandidateState,
        path,
        null
      )
    ) ||
    approvalEvaluatorCandidateNestedTrueClaim(
      decisionCandidateState,
      (key) =>
        NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_APPROVAL_DECISION_TRUE_FIELDS.includes(
          key
        )
    ) ||
    nonAuthorizingEvaluatorDecisionCandidateInspectionKeyPresent(
      decisionCandidateState,
      ["approvalDecision", "approvalDecisionResult", "decision"]
    )
  );
}

function nonAuthorizingEvaluatorDecisionCandidateInspectionApprovalGrantLooking(
  decisionCandidateState
) {
  return (
    NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_APPROVAL_GRANT_FALSE_PATHS.some(
      (path) => reviewOnlyEvaluatorPreflightPathDoesNotMatch(
        decisionCandidateState,
        path,
        false
      )
    ) ||
    NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_APPROVAL_GRANT_NULL_PATHS.some(
      (path) => reviewOnlyEvaluatorPreflightPathDoesNotMatch(
        decisionCandidateState,
        path,
        null
      )
    ) ||
    NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_APPROVAL_GRANT_TRUE_PATHS.some(
      (path) =>
        reviewOnlyEvaluatorPreflightPathValue(decisionCandidateState, path) === true
    )
  );
}

function nonAuthorizingEvaluatorDecisionCandidateInspectionRuntimePermissionLooking(
  decisionCandidateState
) {
  return approvalEvaluatorCandidateNestedTrueClaim(
    decisionCandidateState,
    (key) =>
      REVIEW_ONLY_EVALUATOR_PREFLIGHT_RUNTIME_PERMISSION_TRUE_FIELDS.includes(key)
  );
}

function nonAuthorizingEvaluatorDecisionCandidateInspectionCommandExposureLooking(
  decisionCandidateState
) {
  return approvalEvaluatorCandidateNestedTrueClaim(
    decisionCandidateState,
    (key) =>
      REVIEW_ONLY_EVALUATOR_PREFLIGHT_COMMAND_EXPOSURE_TRUE_FIELDS.includes(key)
  );
}

function nonAuthorizingEvaluatorDecisionCandidateInspectionEvaluatorExecutionLooking(
  decisionCandidateState
) {
  return approvalEvaluatorCandidateNestedTrueClaim(
    decisionCandidateState,
    (key) =>
      NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_EVALUATOR_EXECUTION_TRUE_FIELDS.includes(
        key
      )
  );
}

function nonAuthorizingEvaluatorDecisionCandidateInspectionEvaluatorResultLooking(
  decisionCandidateState
) {
  return nonAuthorizingEvaluatorDecisionCandidateInspectionKeyPresent(
    decisionCandidateState,
    NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_EVALUATOR_RESULT_FIELDS
  );
}

function nonAuthorizingEvaluatorDecisionCandidateInspectionExecutionSignalLooking(
  decisionCandidateState
) {
  return approvalEvaluatorCandidateNestedTrueClaim(
    decisionCandidateState,
    (key) => REVIEW_ONLY_EVALUATOR_PREFLIGHT_EXECUTION_SIGNAL_TRUE_FIELDS.includes(key)
  );
}

function nonAuthorizingEvaluatorDecisionCandidateInspectionRuntimeEffectTrue(
  decisionCandidateState
) {
  return approvalEvaluatorCandidateRuntimeEffectTrue(decisionCandidateState);
}

function nonAuthorizingEvaluatorDecisionCandidateInspectionProcessFlagTrue(
  decisionCandidateState
) {
  return approvalEvaluatorCandidateNestedTrueClaim(
    decisionCandidateState,
    (key) => APPROVAL_EVALUATOR_CANDIDATE_PROCESS_TRUE_FIELDS.includes(key)
  );
}

function nonAuthorizingEvaluatorDecisionCandidateInspectionUnsafeTrueSurface(
  decisionCandidateState
) {
  return approvalEvaluatorCandidateNestedTrueClaim(
    decisionCandidateState,
    (key) => APPROVAL_EVALUATOR_CANDIDATE_UNSAFE_TRUE_FIELD_PATTERN.test(key)
  );
}

function nonAuthorizingEvaluatorDecisionCandidateInspectionAuthorizing(
  decisionCandidateState
) {
  return approvalEvaluatorCandidateNestedTrueClaim(
    decisionCandidateState,
    (key) =>
      REVIEW_ONLY_EVALUATOR_PREFLIGHT_AUTHORITATIVE_TRUE_FIELDS.includes(key)
  );
}

const NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_SINGLE_REJECTION_CHECKS =
  Object.freeze([
    [
      (decisionCandidateState) => !isPlainObjectRecord(decisionCandidateState),
      "malformed_non_authorizing_evaluator_decision_candidate_inspection_artifact_input_rejected"
    ],
    [
      nonAuthorizingEvaluatorDecisionCandidateInspectionUnknown,
      "unknown_non_authorizing_evaluator_decision_candidate_inspection_artifact_input_rejected"
    ],
    [
      nonAuthorizingEvaluatorDecisionCandidateInspectionRevoked,
      "revoked_non_authorizing_evaluator_decision_candidate_inspection_artifact_input_rejected"
    ],
    [
      nonAuthorizingEvaluatorDecisionCandidateInspectionStale,
      "stale_non_authorizing_evaluator_decision_candidate_inspection_artifact_input_rejected"
    ],
    [
      nonAuthorizingEvaluatorDecisionCandidateInspectionApprovalDecisionLooking,
      "approval_decision_looking_non_authorizing_evaluator_decision_candidate_inspection_artifact_input_rejected"
    ],
    [
      nonAuthorizingEvaluatorDecisionCandidateInspectionUnexpectedUnsafeField,
      "unsafe_non_authorizing_evaluator_decision_candidate_inspection_artifact_input_rejected"
    ],
    [
      nonAuthorizingEvaluatorDecisionCandidateInspectionGrantLooking,
      "grant_looking_non_authorizing_evaluator_decision_candidate_inspection_artifact_input_rejected"
    ],
    [
      nonAuthorizingEvaluatorDecisionCandidateInspectionApprovalGrantLooking,
      "approval_grant_looking_non_authorizing_evaluator_decision_candidate_inspection_artifact_input_rejected"
    ],
    [
      nonAuthorizingEvaluatorDecisionCandidateInspectionRuntimePermissionLooking,
      "runtime_permission_looking_non_authorizing_evaluator_decision_candidate_inspection_artifact_input_rejected"
    ],
    [
      nonAuthorizingEvaluatorDecisionCandidateInspectionCommandExposureLooking,
      "command_exposure_looking_non_authorizing_evaluator_decision_candidate_inspection_artifact_input_rejected"
    ],
    [
      nonAuthorizingEvaluatorDecisionCandidateInspectionEvaluatorExecutionLooking,
      "evaluator_execution_looking_non_authorizing_evaluator_decision_candidate_inspection_artifact_input_rejected"
    ],
    [
      nonAuthorizingEvaluatorDecisionCandidateInspectionEvaluatorResultLooking,
      "evaluator_result_looking_non_authorizing_evaluator_decision_candidate_inspection_artifact_input_rejected"
    ],
    [
      nonAuthorizingEvaluatorDecisionCandidateInspectionExecutionSignalLooking,
      "execution_signal_looking_non_authorizing_evaluator_decision_candidate_inspection_artifact_input_rejected"
    ],
    [
      nonAuthorizingEvaluatorDecisionCandidateInspectionRuntimeEffectTrue,
      "runtime_effect_true_non_authorizing_evaluator_decision_candidate_inspection_artifact_input_rejected"
    ],
    [
      nonAuthorizingEvaluatorDecisionCandidateInspectionProcessFlagTrue,
      "process_flag_true_non_authorizing_evaluator_decision_candidate_inspection_artifact_input_rejected"
    ],
    [
      nonAuthorizingEvaluatorDecisionCandidateInspectionUnsafeTrueSurface,
      "unsafe_non_authorizing_evaluator_decision_candidate_inspection_artifact_input_rejected"
    ],
    [
      nonAuthorizingEvaluatorDecisionCandidateInspectionAuthorizing,
      "authorizing_non_authorizing_evaluator_decision_candidate_inspection_artifact_input_rejected"
    ],
    [
      nonAuthorizingEvaluatorDecisionCandidateInspectionMalformed,
      "malformed_non_authorizing_evaluator_decision_candidate_inspection_artifact_input_rejected"
    ]
  ]);

function nonAuthorizingEvaluatorDecisionCandidateInspectionSingleClassification(
  decisionCandidateState
) {
  return (
    NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_SINGLE_REJECTION_CHECKS.find(
      ([predicate]) => predicate(decisionCandidateState)
    )?.[1] ??
    VALID_NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_CLASSIFICATION
  );
}

function firstNonAuthorizingEvaluatorDecisionCandidateInspectionRejection(
  decisionCandidateStates
) {
  return (
    decisionCandidateStates
      .map(nonAuthorizingEvaluatorDecisionCandidateInspectionSingleClassification)
      .find(
        (classification) =>
          classification !==
          VALID_NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_CLASSIFICATION
      ) ?? null
  );
}

function nonAuthorizingEvaluatorDecisionCandidateInspectionStatesContainDuplicate(
  decisionCandidateStates
) {
  const digests = decisionCandidateStates.map((decisionCandidateState) =>
    reviewArtifactHandoffDigest(decisionCandidateState)
  );

  return new Set(digests).size !== digests.length;
}

const NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_RESOLVERS =
  Object.freeze([
    (decisionCandidateStates) =>
      decisionCandidateStates === undefined
        ? "missing_non_authorizing_evaluator_decision_candidate_inspection_artifact_input_rejected"
        : null,
    (decisionCandidateStates) =>
      !Array.isArray(decisionCandidateStates)
        ? "malformed_non_authorizing_evaluator_decision_candidate_inspection_artifact_input_rejected"
        : null,
    (decisionCandidateStates) =>
      decisionCandidateStates.length === 0
        ? "empty_non_authorizing_evaluator_decision_candidate_inspection_artifact_input_rejected"
        : null,
    firstNonAuthorizingEvaluatorDecisionCandidateInspectionRejection,
    (decisionCandidateStates) =>
      nonAuthorizingEvaluatorDecisionCandidateInspectionStatesContainDuplicate(
        decisionCandidateStates
      )
        ? "duplicate_invalid_non_authorizing_evaluator_decision_candidate_inspection_artifact_input_rejected"
        : null,
    (decisionCandidateStates) =>
      decisionCandidateStates.length > 1
        ? "conflicting_non_authorizing_evaluator_decision_candidate_inspection_artifact_input_rejected"
        : null
  ]);

function nonAuthorizingEvaluatorDecisionCandidateInspectionClassification(
  decisionCandidateStates
) {
  let classification = null;

  NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_RESOLVERS.some(
    (resolver) => {
      classification = resolver(decisionCandidateStates);
      return classification !== null;
    }
  );

  return (
    classification ??
    VALID_NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_CLASSIFICATION
  );
}

function nonAuthorizingEvaluatorDecisionCandidateInspectionSummary() {
  return {
    artifactKind:
      NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_ARTIFACT_KIND,
    artifactMode: "review-only",
    sourceDecisionCandidateClassification:
      VALID_NON_AUTHORIZING_EVALUATOR_DECISION_CLASSIFICATION,
    reviewArtifactOnly: true,
    evaluatorResultProduced: false,
    approvalDecisionProduced: false,
    approvalGrantProduced: false,
    runtimePermissionGranted: false,
    commandExposurePermissionGranted: false,
    evaluatorExecuted: false,
    runtimeEffectAllFalse: true
  };
}

function nonAuthorizingEvaluatorDecisionCandidateInspectionArtifactFromState(
  decisionCandidateState,
  reviewedAt
) {
  return {
    schema:
      NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_ARTIFACT_INTERNAL_SCHEMA,
    schemaVersion:
      NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_ARTIFACT_VERSION,
    artifactKind:
      NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_ARTIFACT_KIND,
    artifactMode: "review-only",
    reviewedAt,
    sourceDecisionCandidateState: {
      schema: decisionCandidateState.schema,
      stateKind: decisionCandidateState.stateKind,
      stateMode: decisionCandidateState.stateMode,
      reviewedAt: decisionCandidateState.reviewedAt,
      stateDigest: reviewArtifactHandoffDigest(decisionCandidateState),
      sourcePreflightCheckpointStateDigest:
        decisionCandidateState.sourcePreflightCheckpointState.stateDigest,
      sourceIntakeCheckpointStateDigest:
        decisionCandidateState.sourcePreflightCheckpointState
          .sourceIntakeCheckpointStateDigest,
      sourceEvaluatorInputCandidateDigest:
        decisionCandidateState.sourcePreflightCheckpointState
          .sourceEvaluatorInputCandidateDigest,
      decisionCandidateAccepted: true,
      decisionCandidateStateIsApprovalDecision: false,
      decisionCandidateStateIsApprovalGrant: false,
      evaluatorResultProduced: false,
      approvalDecisionProduced: false,
      approvalGrantProduced: false,
      approvalGrantPersisted: false,
      evaluatorExecuted: false,
      runtimeEffectAllFalse: true
    },
    pipelineSummary: reviewOnlyEvaluatorPreflightPipelineSummary(
      decisionCandidateState.pipelineSummary
    ),
    integratedReviewSummary: reviewOnlyEvaluatorPreflightIntegratedSummary(
      decisionCandidateState.integratedReviewSummary
    ),
    decisionCandidateSummary:
      nonAuthorizingEvaluatorDecisionCandidateSummary(),
    inspectionSummary:
      nonAuthorizingEvaluatorDecisionCandidateInspectionSummary(),
    inspectionArtifactOnly: true,
    inspectionArtifactIsApprovalDecision: false,
    inspectionArtifactIsApprovalGrant: false,
    evaluatorResultProduced: false,
    evaluatorResultPersisted: false,
    evaluatorResultId: null,
    approvalDecisionProduced: false,
    approvalDecisionPersisted: false,
    approvalDecisionId: null,
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

function nonAuthorizingEvaluatorDecisionCandidateInspectionRejectionReasons({
  accepted,
  classification
}) {
  if (accepted) {
    return [
      "evaluator_decision_candidate_inspection_artifact_is_review_only",
      "evaluator_result_not_implemented",
      "approval_decision_not_implemented",
      "approval_grant_not_implemented",
      "evaluator_execution_not_implemented",
      "runtime_enablement_still_blocked"
    ];
  }

  return [
    classification,
    "evaluator_decision_candidate_inspection_artifact_not_produced",
    "evaluator_result_not_implemented",
    "approval_decision_not_implemented",
    "approval_grant_not_implemented",
    "evaluator_execution_not_implemented",
    "runtime_enablement_still_blocked"
  ];
}

export function createNonAuthorizingEvaluatorDecisionCandidateInspectionArtifactForReview(
  input = {}
) {
  const reviewedAt = approvalPrerequisiteSourceReviewedAt(input);
  const reviewedAtDefaulted = isReviewedAtDefaulted(input);
  const decisionCandidateStates = input.decisionCandidateStates;
  const classification =
    nonAuthorizingEvaluatorDecisionCandidateInspectionClassification(
      decisionCandidateStates
    );
  const accepted =
    classification ===
    VALID_NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_CLASSIFICATION;
  const decisionCandidateState = accepted ? decisionCandidateStates[0] : null;
  const inspectionArtifact = accepted
    ? nonAuthorizingEvaluatorDecisionCandidateInspectionArtifactFromState(
        decisionCandidateState,
        reviewedAt
      )
    : null;

  return {
    schema:
      NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_ARTIFACT_SCHEMA,
    schemaVersion:
      NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_ARTIFACT_VERSION,
    artifactKind:
      NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_ARTIFACT_KIND,
    artifactMode: "review-only",
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    decisionCandidateStateAccepted: accepted,
    inspectionArtifactProduced: accepted,
    inspectionArtifactIsApprovalDecision: false,
    inspectionArtifactIsApprovalGrant: false,
    inspectionArtifact,
    inspectionSummary: accepted
      ? {
          schema: decisionCandidateState.schema,
          stateKind: decisionCandidateState.stateKind,
          stateMode: decisionCandidateState.stateMode,
          reviewedAt: decisionCandidateState.reviewedAt,
          stateDigest: reviewArtifactHandoffDigest(decisionCandidateState),
          decisionCandidateStateIsApprovalDecision: false,
          decisionCandidateStateIsApprovalGrant: false,
          evaluatorResultProduced: false,
          approvalDecisionProduced: false,
          approvalGrantProduced: false,
          approvalGrantPersisted: false,
          evaluatorExecuted: false,
          runtimeEffectAllFalse: true
        }
      : null,
    reviewOnly: true,
    authoritative: false,
    reviewArtifactOnly: true,
    evaluatorResultProduced: false,
    evaluatorResultPersisted: false,
    evaluatorResultId: null,
    approvalDecisionProduced: false,
    approvalDecisionPersisted: false,
    approvalDecisionId: null,
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
    rejectionReasons:
      nonAuthorizingEvaluatorDecisionCandidateInspectionRejectionReasons({
        accepted,
        classification
      }),
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

const HUMAN_TOOL_INSPECTION_DISPOSITION_STATE_SCHEMA =
  "ardyn.phase-5.31.review-only-human-tool-inspection-disposition-state";

const HUMAN_TOOL_INSPECTION_DISPOSITION_MIN_REVIEWED_AT =
  "2026-06-16T00:00:00.000Z";

const VALID_HUMAN_TOOL_INSPECTION_DISPOSITION_CLASSIFICATION =
  "valid_human_tool_inspection_disposition_boundary_runtime_still_blocked";
const HUMAN_TOOL_INSPECTION_DISPOSITION_ARTIFACT_REQUIRED_FALSE_FIELDS =
  Object.freeze([
    "inspectionArtifactIsApprovalDecision",
    "inspectionArtifactIsApprovalGrant",
    "evaluatorResultProduced",
    "evaluatorResultPersisted",
    "approvalDecisionProduced",
    "approvalDecisionPersisted",
    "approvalGrantProduced",
    "approvalGrantPersisted",
    "runtimePermissionGranted",
    "commandExposurePermissionGranted",
    "runtimeCommandExposureEnabled",
    "runtimeExecutionEnabled",
    "evaluatorExecutionRequested",
    "evaluatorExecutionStarted",
    "evaluatorExecutionEnabled",
    "evaluatorExecuted"
  ]);

const HUMAN_TOOL_INSPECTION_DISPOSITION_ARTIFACT_REQUIRED_NULL_FIELDS =
  Object.freeze(["evaluatorResultId", "approvalDecisionId", "approvalGrantId"]);

const HUMAN_TOOL_INSPECTION_DISPOSITION_ARTIFACT_FIELDS = Object.freeze([
  "schema",
  "schemaVersion",
  "artifactKind",
  "artifactMode",
  "reviewedAt",
  "sourceDecisionCandidateState",
  "pipelineSummary",
  "integratedReviewSummary",
  "decisionCandidateSummary",
  "inspectionSummary",
  "inspectionArtifactOnly",
  "inspectionArtifactIsApprovalDecision",
  "inspectionArtifactIsApprovalGrant",
  "evaluatorResultProduced",
  "evaluatorResultPersisted",
  "evaluatorResultId",
  "approvalDecisionProduced",
  "approvalDecisionPersisted",
  "approvalDecisionId",
  "approvalGrantProduced",
  "approvalGrantPersisted",
  "approvalGrantId",
  "runtimePermissionGranted",
  "commandExposurePermissionGranted",
  "runtimeCommandExposureEnabled",
  "runtimeExecutionEnabled",
  "evaluatorExecutionRequested",
  "evaluatorExecutionStarted",
  "evaluatorExecutionEnabled",
  "evaluatorExecuted",
  "runtimeEffect"
]);

const HUMAN_TOOL_INSPECTION_DISPOSITION_SOURCE_ARTIFACT_FIELDS = Object.freeze([
  "schema",
  "stateKind",
  "stateMode",
  "reviewedAt",
  "stateDigest",
  "sourcePreflightCheckpointStateDigest",
  "sourceIntakeCheckpointStateDigest",
  "sourceEvaluatorInputCandidateDigest",
  "decisionCandidateAccepted",
  "decisionCandidateStateIsApprovalDecision",
  "decisionCandidateStateIsApprovalGrant",
  "evaluatorResultProduced",
  "approvalDecisionProduced",
  "approvalGrantProduced",
  "approvalGrantPersisted",
  "evaluatorExecuted",
  "runtimeEffectAllFalse"
]);

const HUMAN_TOOL_INSPECTION_DISPOSITION_INSPECTION_SUMMARY_FIELDS =
  Object.freeze([
    "artifactKind",
    "artifactMode",
    "sourceDecisionCandidateClassification",
    "reviewArtifactOnly",
    "evaluatorResultProduced",
    "approvalDecisionProduced",
    "approvalGrantProduced",
    "runtimePermissionGranted",
    "commandExposurePermissionGranted",
    "evaluatorExecuted",
    "runtimeEffectAllFalse"
  ]);

const HUMAN_TOOL_INSPECTION_DISPOSITION_ALLOWED_FIELDS = new Set([
  ...HUMAN_TOOL_INSPECTION_DISPOSITION_ARTIFACT_FIELDS,
  ...HUMAN_TOOL_INSPECTION_DISPOSITION_SOURCE_ARTIFACT_FIELDS,
  ...HUMAN_TOOL_INSPECTION_DISPOSITION_INSPECTION_SUMMARY_FIELDS,
  ...NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_SUMMARY_FIELDS,
  ...NON_AUTHORIZING_EVALUATOR_DECISION_PIPELINE_SUMMARY_FIELDS,
  ...NON_AUTHORIZING_EVALUATOR_DECISION_INTEGRATED_SUMMARY_FIELDS
]);

const HUMAN_TOOL_INSPECTION_DISPOSITION_ARTIFACT_CHECKS = Object.freeze([
  [
    "schema",
    (value) =>
      value ===
      NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_ARTIFACT_INTERNAL_SCHEMA
  ],
  [
    "schemaVersion",
    (value) =>
      value ===
      NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_ARTIFACT_VERSION
  ],
  [
    "artifactKind",
    (value) =>
      value ===
      NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_ARTIFACT_KIND
  ],
  ["artifactMode", (value) => value === "review-only"],
  ["reviewedAt", isUtcIsoTimestampWithMilliseconds],
  ["sourceDecisionCandidateState", isPlainObjectRecord],
  ["pipelineSummary", isPlainObjectRecord],
  ["integratedReviewSummary", isPlainObjectRecord],
  ["decisionCandidateSummary", isPlainObjectRecord],
  ["inspectionSummary", isPlainObjectRecord],
  ["inspectionArtifactOnly", (value) => value === true],
  ["runtimeEffect", isPlainObjectRecord]
]);

const HUMAN_TOOL_INSPECTION_DISPOSITION_SOURCE_ARTIFACT_CHECKS = Object.freeze([
  [
    "schema",
    (value) => value === NON_AUTHORIZING_EVALUATOR_DECISION_STATE_SCHEMA
  ],
  [
    "stateKind",
    (value) => value === "review-only-evaluator-decision-candidate-state"
  ],
  ["stateMode", (value) => value === "review-only"],
  ["reviewedAt", isUtcIsoTimestampWithMilliseconds],
  [
    "stateDigest",
    (value) =>
      typeof value === "string" && /^sha256:[0-9a-f]{64}$/.test(value)
  ],
  [
    "sourcePreflightCheckpointStateDigest",
    (value) =>
      typeof value === "string" && /^sha256:[0-9a-f]{64}$/.test(value)
  ],
  [
    "sourceIntakeCheckpointStateDigest",
    (value) =>
      typeof value === "string" && /^sha256:[0-9a-f]{64}$/.test(value)
  ],
  [
    "sourceEvaluatorInputCandidateDigest",
    (value) =>
      typeof value === "string" && /^sha256:[0-9a-f]{64}$/.test(value)
  ],
  ["decisionCandidateAccepted", (value) => value === true],
  ["decisionCandidateStateIsApprovalDecision", (value) => value === false],
  ["decisionCandidateStateIsApprovalGrant", (value) => value === false],
  ["evaluatorResultProduced", (value) => value === false],
  ["approvalDecisionProduced", (value) => value === false],
  ["approvalGrantProduced", (value) => value === false],
  ["approvalGrantPersisted", (value) => value === false],
  ["evaluatorExecuted", (value) => value === false],
  ["runtimeEffectAllFalse", (value) => value === true]
]);

const HUMAN_TOOL_INSPECTION_DISPOSITION_INSPECTION_SUMMARY_CHECKS =
  Object.freeze([
    [
      "artifactKind",
      (value) =>
        value ===
        NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_ARTIFACT_KIND
    ],
    ["artifactMode", (value) => value === "review-only"],
    [
      "sourceDecisionCandidateClassification",
      (value) => value === VALID_NON_AUTHORIZING_EVALUATOR_DECISION_CLASSIFICATION
    ],
    ["reviewArtifactOnly", (value) => value === true],
    ["evaluatorResultProduced", (value) => value === false],
    ["approvalDecisionProduced", (value) => value === false],
    ["approvalGrantProduced", (value) => value === false],
    ["runtimePermissionGranted", (value) => value === false],
    ["commandExposurePermissionGranted", (value) => value === false],
    ["evaluatorExecuted", (value) => value === false],
    ["runtimeEffectAllFalse", (value) => value === true]
  ]);

const HUMAN_TOOL_INSPECTION_DISPOSITION_EVALUATOR_RESULT_FALSE_PATHS =
  Object.freeze([
    Object.freeze(["evaluatorResultProduced"]),
    Object.freeze(["evaluatorResultPersisted"]),
    Object.freeze(["sourceDecisionCandidateState", "evaluatorResultProduced"]),
    Object.freeze(["inspectionSummary", "evaluatorResultProduced"])
  ]);

const HUMAN_TOOL_INSPECTION_DISPOSITION_EVALUATOR_RESULT_NULL_PATHS =
  Object.freeze([Object.freeze(["evaluatorResultId"])]);

const HUMAN_TOOL_INSPECTION_DISPOSITION_EVALUATOR_RESULT_OBJECT_FIELDS =
  Object.freeze([
    "evaluatorResult",
    "evaluationResult",
    "evaluatorOutput",
    "evaluatorOutcome",
    "resultProduced"
  ]);

const HUMAN_TOOL_INSPECTION_DISPOSITION_APPROVAL_DECISION_FALSE_PATHS =
  Object.freeze([
    Object.freeze(["inspectionArtifactIsApprovalDecision"]),
    Object.freeze(["approvalDecisionProduced"]),
    Object.freeze(["approvalDecisionPersisted"]),
    Object.freeze([
      "sourceDecisionCandidateState",
      "decisionCandidateStateIsApprovalDecision"
    ]),
    Object.freeze(["sourceDecisionCandidateState", "approvalDecisionProduced"]),
    Object.freeze(["inspectionSummary", "approvalDecisionProduced"]),
    Object.freeze(["decisionCandidateSummary", "approvalDecisionProduced"])
  ]);

const HUMAN_TOOL_INSPECTION_DISPOSITION_APPROVAL_DECISION_NULL_PATHS =
  Object.freeze([Object.freeze(["approvalDecisionId"])]);

const HUMAN_TOOL_INSPECTION_DISPOSITION_APPROVAL_DECISION_TRUE_FIELDS =
  Object.freeze([
    "approvalDecisionGranted",
    "approvalDecisionAccepted",
    "approvalDecisionAuthorized",
    "inspectionDispositionIsApprovalDecision"
  ]);

const HUMAN_TOOL_INSPECTION_DISPOSITION_APPROVAL_GRANT_FALSE_PATHS =
  Object.freeze([
    Object.freeze(["inspectionArtifactIsApprovalGrant"]),
    Object.freeze(["approvalGrantProduced"]),
    Object.freeze(["approvalGrantPersisted"]),
    Object.freeze([
      "sourceDecisionCandidateState",
      "decisionCandidateStateIsApprovalGrant"
    ]),
    Object.freeze(["sourceDecisionCandidateState", "approvalGrantProduced"]),
    Object.freeze(["sourceDecisionCandidateState", "approvalGrantPersisted"]),
    Object.freeze(["integratedReviewSummary", "reviewSummaryIsApprovalGrant"]),
    Object.freeze(["integratedReviewSummary", "approvalGrantProduced"]),
    Object.freeze(["integratedReviewSummary", "approvalGrantPersisted"]),
    Object.freeze(["inspectionSummary", "approvalGrantProduced"]),
    Object.freeze(["decisionCandidateSummary", "approvalGrantProduced"])
  ]);

const HUMAN_TOOL_INSPECTION_DISPOSITION_APPROVAL_GRANT_NULL_PATHS =
  Object.freeze([
    Object.freeze(["approvalGrantId"]),
    Object.freeze(["integratedReviewSummary", "approvalGrantId"])
  ]);

const HUMAN_TOOL_INSPECTION_DISPOSITION_APPROVAL_GRANT_TRUE_PATHS =
  Object.freeze([
    Object.freeze(["approvalGrant", "produced"]),
    Object.freeze(["approvalGrant", "persisted"])
  ]);

const HUMAN_TOOL_INSPECTION_DISPOSITION_GENERIC_GRANT_TRUE_FIELDS =
  Object.freeze([
    "grantProduced",
    "grantPersisted",
    "grantCreated",
    "grantIssued",
    "grantAuthorized",
    "grantAccepted",
    "runtimeGrantProduced",
    "permissionGrantProduced"
  ]);

const HUMAN_TOOL_INSPECTION_DISPOSITION_EVALUATOR_EXECUTION_TRUE_FIELDS =
  Object.freeze([
    "evaluatorExecutionRequested",
    "evaluatorExecutionStarted",
    "evaluatorExecutionEnabled",
    "evaluatorExecutionPerformed",
    "evaluatorExecuted"
  ]);

function humanToolInspectionDispositionUnexpectedUnsafeField(
  value,
  seen = new Set()
) {
  if (Array.isArray(value)) {
    return value.some((entry) =>
      humanToolInspectionDispositionUnexpectedUnsafeField(entry, seen)
    );
  }

  if (!isPlainObjectRecord(value) || seen.has(value)) {
    return false;
  }

  seen.add(value);

  return Object.entries(value).some(
    ([key, entry]) =>
      (!HUMAN_TOOL_INSPECTION_DISPOSITION_ALLOWED_FIELDS.has(key) &&
        APPROVAL_EVALUATOR_CANDIDATE_UNSAFE_TRUE_FIELD_PATTERN.test(key)) ||
      humanToolInspectionDispositionUnexpectedUnsafeField(entry, seen)
  );
}

function humanToolInspectionDispositionKeyPresent(value, keys, seen = new Set()) {
  if (Array.isArray(value)) {
    return value.some((entry) =>
      humanToolInspectionDispositionKeyPresent(entry, keys, seen)
    );
  }

  if (!isPlainObjectRecord(value) || seen.has(value)) {
    return false;
  }

  seen.add(value);

  return Object.entries(value).some(
    ([key, entry]) =>
      keys.includes(key) ||
      humanToolInspectionDispositionKeyPresent(entry, keys, seen)
  );
}

function humanToolInspectionDispositionUnknown(inspectionArtifact) {
  return (
    (typeof inspectionArtifact.schema === "string" &&
      inspectionArtifact.schema !==
        NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_ARTIFACT_INTERNAL_SCHEMA) ||
    (typeof inspectionArtifact.artifactKind === "string" &&
      inspectionArtifact.artifactKind !==
        NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_ARTIFACT_KIND)
  );
}

function humanToolInspectionDispositionRevoked(inspectionArtifact) {
  return (
    inspectionArtifact.revoked === true ||
    (isPlainObjectRecord(inspectionArtifact.revocation) &&
      inspectionArtifact.revocation.revoked === true)
  );
}

function humanToolInspectionDispositionStale(inspectionArtifact) {
  return (
    isUtcIsoTimestampWithMilliseconds(inspectionArtifact.reviewedAt) &&
    inspectionArtifact.reviewedAt <
      HUMAN_TOOL_INSPECTION_DISPOSITION_MIN_REVIEWED_AT
  );
}

const HUMAN_TOOL_INSPECTION_DISPOSITION_MALFORMED_CHECKS = Object.freeze([
  (inspectionArtifact) =>
    !recordHasExactFields(
      inspectionArtifact,
      HUMAN_TOOL_INSPECTION_DISPOSITION_ARTIFACT_FIELDS
    ),
  (inspectionArtifact) =>
    !recordPassesChecks(
      inspectionArtifact,
      HUMAN_TOOL_INSPECTION_DISPOSITION_ARTIFACT_CHECKS
    ),
  (inspectionArtifact) =>
    !recordHasExactFields(
      inspectionArtifact.sourceDecisionCandidateState,
      HUMAN_TOOL_INSPECTION_DISPOSITION_SOURCE_ARTIFACT_FIELDS
    ),
  (inspectionArtifact) =>
    !recordPassesChecks(
      inspectionArtifact.sourceDecisionCandidateState,
      HUMAN_TOOL_INSPECTION_DISPOSITION_SOURCE_ARTIFACT_CHECKS
    ),
  (inspectionArtifact) =>
    !recordHasExactFields(
      inspectionArtifact.pipelineSummary,
      NON_AUTHORIZING_EVALUATOR_DECISION_PIPELINE_SUMMARY_FIELDS
    ),
  (inspectionArtifact) =>
    !recordPassesChecks(
      inspectionArtifact.pipelineSummary,
      PREREQUISITE_REVIEW_ARTIFACT_PIPELINE_CHECKS
    ),
  (inspectionArtifact) =>
    !recordHasExactFields(
      inspectionArtifact.integratedReviewSummary,
      NON_AUTHORIZING_EVALUATOR_DECISION_INTEGRATED_SUMMARY_FIELDS
    ),
  (inspectionArtifact) =>
    !recordPassesChecks(
      inspectionArtifact.integratedReviewSummary,
      PREREQUISITE_REVIEW_ARTIFACT_SUMMARY_CHECKS
    ),
  (inspectionArtifact) =>
    !recordHasExactFields(
      inspectionArtifact.decisionCandidateSummary,
      NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_SUMMARY_FIELDS
    ),
  (inspectionArtifact) =>
    !recordPassesChecks(
      inspectionArtifact.decisionCandidateSummary,
      NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_SUMMARY_CHECKS
    ),
  (inspectionArtifact) =>
    !recordHasExactFields(
      inspectionArtifact.inspectionSummary,
      HUMAN_TOOL_INSPECTION_DISPOSITION_INSPECTION_SUMMARY_FIELDS
    ),
  (inspectionArtifact) =>
    !recordPassesChecks(
      inspectionArtifact.inspectionSummary,
      HUMAN_TOOL_INSPECTION_DISPOSITION_INSPECTION_SUMMARY_CHECKS
    ),
  (inspectionArtifact) =>
    !recordPassesChecks(
      inspectionArtifact,
      HUMAN_TOOL_INSPECTION_DISPOSITION_ARTIFACT_REQUIRED_FALSE_FIELDS.map(
        (field) => [field, (value) => value === false]
      )
    ),
  (inspectionArtifact) =>
    !recordPassesChecks(
      inspectionArtifact,
      HUMAN_TOOL_INSPECTION_DISPOSITION_ARTIFACT_REQUIRED_NULL_FIELDS.map(
        (field) => [field, (value) => value === null]
      )
    ),
  (inspectionArtifact) =>
    !reviewOnlyRuntimeEffectAllFalse(inspectionArtifact.runtimeEffect)
]);

function humanToolInspectionDispositionMalformed(inspectionArtifact) {
  return HUMAN_TOOL_INSPECTION_DISPOSITION_MALFORMED_CHECKS.some((predicate) =>
    predicate(inspectionArtifact)
  );
}

function humanToolInspectionDispositionGrantLooking(inspectionArtifact) {
  return approvalEvaluatorCandidateNestedTrueClaim(
    inspectionArtifact,
    (key) =>
      HUMAN_TOOL_INSPECTION_DISPOSITION_GENERIC_GRANT_TRUE_FIELDS.includes(key)
  );
}

function humanToolInspectionDispositionApprovalDecisionLooking(
  inspectionArtifact
) {
  return (
    HUMAN_TOOL_INSPECTION_DISPOSITION_APPROVAL_DECISION_FALSE_PATHS.some(
      (path) =>
        reviewOnlyEvaluatorPreflightPathDoesNotMatch(
          inspectionArtifact,
          path,
          false
        )
    ) ||
    HUMAN_TOOL_INSPECTION_DISPOSITION_APPROVAL_DECISION_NULL_PATHS.some((path) =>
      reviewOnlyEvaluatorPreflightPathDoesNotMatch(
        inspectionArtifact,
        path,
        null
      )
    ) ||
    approvalEvaluatorCandidateNestedTrueClaim(
      inspectionArtifact,
      (key) =>
        HUMAN_TOOL_INSPECTION_DISPOSITION_APPROVAL_DECISION_TRUE_FIELDS.includes(
          key
        )
    ) ||
    humanToolInspectionDispositionKeyPresent(inspectionArtifact, [
      "approvalDecision",
      "approvalDecisionResult",
      "decision"
    ])
  );
}

function humanToolInspectionDispositionApprovalGrantLooking(inspectionArtifact) {
  return (
    HUMAN_TOOL_INSPECTION_DISPOSITION_APPROVAL_GRANT_FALSE_PATHS.some((path) =>
      reviewOnlyEvaluatorPreflightPathDoesNotMatch(
        inspectionArtifact,
        path,
        false
      )
    ) ||
    HUMAN_TOOL_INSPECTION_DISPOSITION_APPROVAL_GRANT_NULL_PATHS.some((path) =>
      reviewOnlyEvaluatorPreflightPathDoesNotMatch(
        inspectionArtifact,
        path,
        null
      )
    ) ||
    HUMAN_TOOL_INSPECTION_DISPOSITION_APPROVAL_GRANT_TRUE_PATHS.some(
      (path) =>
        reviewOnlyEvaluatorPreflightPathValue(inspectionArtifact, path) === true
    )
  );
}

function humanToolInspectionDispositionEvaluatorResultLooking(
  inspectionArtifact
) {
  return (
    HUMAN_TOOL_INSPECTION_DISPOSITION_EVALUATOR_RESULT_FALSE_PATHS.some((path) =>
      reviewOnlyEvaluatorPreflightPathDoesNotMatch(
        inspectionArtifact,
        path,
        false
      )
    ) ||
    HUMAN_TOOL_INSPECTION_DISPOSITION_EVALUATOR_RESULT_NULL_PATHS.some((path) =>
      reviewOnlyEvaluatorPreflightPathDoesNotMatch(
        inspectionArtifact,
        path,
        null
      )
    ) ||
    humanToolInspectionDispositionKeyPresent(
      inspectionArtifact,
      HUMAN_TOOL_INSPECTION_DISPOSITION_EVALUATOR_RESULT_OBJECT_FIELDS
    )
  );
}

function humanToolInspectionDispositionEvaluatorExecutionLooking(
  inspectionArtifact
) {
  return approvalEvaluatorCandidateNestedTrueClaim(
    inspectionArtifact,
    (key) =>
      HUMAN_TOOL_INSPECTION_DISPOSITION_EVALUATOR_EXECUTION_TRUE_FIELDS.includes(
        key
      )
  );
}

function humanToolInspectionDispositionRuntimePermissionLooking(
  inspectionArtifact
) {
  return approvalEvaluatorCandidateNestedTrueClaim(
    inspectionArtifact,
    (key) =>
      REVIEW_ONLY_EVALUATOR_PREFLIGHT_RUNTIME_PERMISSION_TRUE_FIELDS.includes(key)
  );
}

function humanToolInspectionDispositionCommandExposureLooking(
  inspectionArtifact
) {
  return approvalEvaluatorCandidateNestedTrueClaim(
    inspectionArtifact,
    (key) =>
      REVIEW_ONLY_EVALUATOR_PREFLIGHT_COMMAND_EXPOSURE_TRUE_FIELDS.includes(key)
  );
}

function humanToolInspectionDispositionRuntimeEffectTrue(inspectionArtifact) {
  return approvalEvaluatorCandidateRuntimeEffectTrue(inspectionArtifact);
}

function humanToolInspectionDispositionProcessFlagTrue(inspectionArtifact) {
  return approvalEvaluatorCandidateNestedTrueClaim(
    inspectionArtifact,
    (key) => APPROVAL_EVALUATOR_CANDIDATE_PROCESS_TRUE_FIELDS.includes(key)
  );
}

function humanToolInspectionDispositionUnsafeTrueSurface(inspectionArtifact) {
  return approvalEvaluatorCandidateNestedTrueClaim(
    inspectionArtifact,
    (key) => APPROVAL_EVALUATOR_CANDIDATE_UNSAFE_TRUE_FIELD_PATTERN.test(key)
  );
}

function humanToolInspectionDispositionExecutionSignalLooking(
  inspectionArtifact
) {
  return approvalEvaluatorCandidateNestedTrueClaim(
    inspectionArtifact,
    (key) => REVIEW_ONLY_EVALUATOR_PREFLIGHT_EXECUTION_SIGNAL_TRUE_FIELDS.includes(key)
  );
}

function humanToolInspectionDispositionAuthorizing(inspectionArtifact) {
  return approvalEvaluatorCandidateNestedTrueClaim(
    inspectionArtifact,
    (key) =>
      REVIEW_ONLY_EVALUATOR_PREFLIGHT_AUTHORITATIVE_TRUE_FIELDS.includes(key)
  );
}

const HUMAN_TOOL_INSPECTION_DISPOSITION_SINGLE_REJECTION_CHECKS =
  Object.freeze([
    [
      (inspectionArtifact) => !isPlainObjectRecord(inspectionArtifact),
      "malformed_human_tool_inspection_disposition_boundary_input_rejected"
    ],
    [
      humanToolInspectionDispositionUnknown,
      "unknown_human_tool_inspection_disposition_boundary_input_rejected"
    ],
    [
      humanToolInspectionDispositionRevoked,
      "revoked_human_tool_inspection_disposition_boundary_input_rejected"
    ],
    [
      humanToolInspectionDispositionStale,
      "stale_human_tool_inspection_disposition_boundary_input_rejected"
    ],
    [
      humanToolInspectionDispositionApprovalDecisionLooking,
      "approval_decision_looking_human_tool_inspection_disposition_boundary_input_rejected"
    ],
    [
      humanToolInspectionDispositionUnexpectedUnsafeField,
      "unsafe_human_tool_inspection_disposition_boundary_input_rejected"
    ],
    [
      humanToolInspectionDispositionGrantLooking,
      "grant_looking_human_tool_inspection_disposition_boundary_input_rejected"
    ],
    [
      humanToolInspectionDispositionApprovalGrantLooking,
      "approval_grant_looking_human_tool_inspection_disposition_boundary_input_rejected"
    ],
    [
      humanToolInspectionDispositionEvaluatorResultLooking,
      "evaluator_result_looking_human_tool_inspection_disposition_boundary_input_rejected"
    ],
    [
      humanToolInspectionDispositionEvaluatorExecutionLooking,
      "evaluator_execution_looking_human_tool_inspection_disposition_boundary_input_rejected"
    ],
    [
      humanToolInspectionDispositionRuntimePermissionLooking,
      "runtime_permission_looking_human_tool_inspection_disposition_boundary_input_rejected"
    ],
    [
      humanToolInspectionDispositionCommandExposureLooking,
      "command_exposure_looking_human_tool_inspection_disposition_boundary_input_rejected"
    ],
    [
      humanToolInspectionDispositionRuntimeEffectTrue,
      "runtime_effect_true_human_tool_inspection_disposition_boundary_input_rejected"
    ],
    [
      humanToolInspectionDispositionProcessFlagTrue,
      "process_flag_true_human_tool_inspection_disposition_boundary_input_rejected"
    ],
    [
      humanToolInspectionDispositionUnsafeTrueSurface,
      "unsafe_human_tool_inspection_disposition_boundary_input_rejected"
    ],
    [
      humanToolInspectionDispositionExecutionSignalLooking,
      "execution_signal_looking_human_tool_inspection_disposition_boundary_input_rejected"
    ],
    [
      humanToolInspectionDispositionAuthorizing,
      "authorizing_human_tool_inspection_disposition_boundary_input_rejected"
    ],
    [
      humanToolInspectionDispositionMalformed,
      "malformed_human_tool_inspection_disposition_boundary_input_rejected"
    ]
  ]);

function humanToolInspectionDispositionSingleClassification(inspectionArtifact) {
  return (
    HUMAN_TOOL_INSPECTION_DISPOSITION_SINGLE_REJECTION_CHECKS.find(
      ([predicate]) => predicate(inspectionArtifact)
    )?.[1] ?? VALID_HUMAN_TOOL_INSPECTION_DISPOSITION_CLASSIFICATION
  );
}

function firstHumanToolInspectionDispositionRejection(inspectionArtifacts) {
  return (
    inspectionArtifacts
      .map(humanToolInspectionDispositionSingleClassification)
      .find(
        (classification) =>
          classification !== VALID_HUMAN_TOOL_INSPECTION_DISPOSITION_CLASSIFICATION
      ) ?? null
  );
}

function humanToolInspectionDispositionArtifactsContainDuplicate(
  inspectionArtifacts
) {
  const digests = inspectionArtifacts.map((inspectionArtifact) =>
    reviewArtifactHandoffDigest(inspectionArtifact)
  );

  return new Set(digests).size !== digests.length;
}

const HUMAN_TOOL_INSPECTION_DISPOSITION_RESOLVERS = Object.freeze([
  (inspectionArtifacts) =>
    inspectionArtifacts === undefined
      ? "missing_human_tool_inspection_disposition_boundary_input_rejected"
      : null,
  (inspectionArtifacts) =>
    !Array.isArray(inspectionArtifacts)
      ? "malformed_human_tool_inspection_disposition_boundary_input_rejected"
      : null,
  (inspectionArtifacts) =>
    inspectionArtifacts.length === 0
      ? "empty_human_tool_inspection_disposition_boundary_input_rejected"
      : null,
  firstHumanToolInspectionDispositionRejection,
  (inspectionArtifacts) =>
    humanToolInspectionDispositionArtifactsContainDuplicate(inspectionArtifacts)
      ? "duplicate_invalid_human_tool_inspection_disposition_boundary_input_rejected"
      : null,
  (inspectionArtifacts) =>
    inspectionArtifacts.length > 1
      ? "conflicting_human_tool_inspection_disposition_boundary_input_rejected"
      : null
]);

function humanToolInspectionDispositionClassification(inspectionArtifacts) {
  let classification = null;

  HUMAN_TOOL_INSPECTION_DISPOSITION_RESOLVERS.some((resolver) => {
    classification = resolver(inspectionArtifacts);
    return classification !== null;
  });

  return (
    classification ?? VALID_HUMAN_TOOL_INSPECTION_DISPOSITION_CLASSIFICATION
  );
}

function humanToolInspectionDispositionSummary() {
  return {
    dispositionKind: "review-only-human-tool-inspection-disposition",
    dispositionMode: "review-only",
    sourceInspectionArtifactClassification:
      VALID_NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_CLASSIFICATION,
    reviewArtifactOnly: true,
    evaluatorResultProduced: false,
    approvalDecisionProduced: false,
    approvalGrantProduced: false,
    runtimePermissionGranted: false,
    commandExposurePermissionGranted: false,
    evaluatorExecuted: false,
    runtimeEffectAllFalse: true
  };
}

function humanToolInspectionDispositionStateFromArtifact(
  inspectionArtifact,
  reviewedAt
) {
  return {
    schema: HUMAN_TOOL_INSPECTION_DISPOSITION_STATE_SCHEMA,
    schemaVersion: HUMAN_TOOL_INSPECTION_DISPOSITION_BOUNDARY_VERSION,
    stateKind: "review-only-human-tool-inspection-disposition-state",
    stateMode: "review-only",
    reviewedAt,
    sourceInspectionArtifact: {
      schema: inspectionArtifact.schema,
      artifactKind: inspectionArtifact.artifactKind,
      artifactMode: inspectionArtifact.artifactMode,
      reviewedAt: inspectionArtifact.reviewedAt,
      artifactDigest: reviewArtifactHandoffDigest(inspectionArtifact),
      sourceDecisionCandidateStateDigest:
        inspectionArtifact.sourceDecisionCandidateState.stateDigest,
      sourcePreflightCheckpointStateDigest:
        inspectionArtifact.sourceDecisionCandidateState
          .sourcePreflightCheckpointStateDigest,
      sourceIntakeCheckpointStateDigest:
        inspectionArtifact.sourceDecisionCandidateState
          .sourceIntakeCheckpointStateDigest,
      sourceEvaluatorInputCandidateDigest:
        inspectionArtifact.sourceDecisionCandidateState
          .sourceEvaluatorInputCandidateDigest,
      inspectionArtifactOnly: true,
      inspectionArtifactIsApprovalDecision: false,
      inspectionArtifactIsApprovalGrant: false,
      evaluatorResultProduced: false,
      approvalDecisionProduced: false,
      approvalGrantProduced: false,
      approvalGrantPersisted: false,
      evaluatorExecuted: false,
      runtimeEffectAllFalse: true
    },
    pipelineSummary: reviewOnlyEvaluatorPreflightPipelineSummary(
      inspectionArtifact.pipelineSummary
    ),
    integratedReviewSummary: reviewOnlyEvaluatorPreflightIntegratedSummary(
      inspectionArtifact.integratedReviewSummary
    ),
    decisionCandidateSummary:
      nonAuthorizingEvaluatorDecisionCandidateSummary(),
    inspectionSummary:
      nonAuthorizingEvaluatorDecisionCandidateInspectionSummary(),
    dispositionSummary: humanToolInspectionDispositionSummary(),
    inspectionArtifactAccepted: true,
    reviewArtifactOnly: true,
    dispositionStateIsApprovalDecision: false,
    dispositionStateIsApprovalGrant: false,
    evaluatorResultProduced: false,
    evaluatorResultPersisted: false,
    evaluatorResultId: null,
    approvalDecisionProduced: false,
    approvalDecisionPersisted: false,
    approvalDecisionId: null,
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

function humanToolInspectionDispositionRejectionReasons({
  accepted,
  classification
}) {
  if (accepted) {
    return [
      "human_tool_inspection_disposition_state_is_review_only",
      "evaluator_result_not_implemented",
      "approval_decision_not_implemented",
      "approval_grant_not_implemented",
      "evaluator_execution_not_implemented",
      "runtime_enablement_still_blocked"
    ];
  }

  return [
    classification,
    "human_tool_inspection_disposition_state_not_produced",
    "evaluator_result_not_implemented",
    "approval_decision_not_implemented",
    "approval_grant_not_implemented",
    "evaluator_execution_not_implemented",
    "runtime_enablement_still_blocked"
  ];
}

function humanToolInspectionDispositionBoundaryInputRecord(input) {
  return isPlainObjectRecord(input) ? input : null;
}

function humanToolInspectionDispositionBoundaryReviewedAt(inputRecord) {
  if (
    inputRecord === null ||
    !Object.prototype.hasOwnProperty.call(inputRecord, "reviewedAt")
  ) {
    return APPROVAL_PREREQUISITE_SOURCE_PREFLIGHT_DEFAULT_REVIEWED_AT;
  }

  return isUtcIsoTimestampWithMilliseconds(inputRecord.reviewedAt)
    ? inputRecord.reviewedAt
    : APPROVAL_PREREQUISITE_SOURCE_PREFLIGHT_DEFAULT_REVIEWED_AT;
}

function humanToolInspectionDispositionBoundaryInputMalformed(inputRecord) {
  return (
    inputRecord === null ||
    (Object.prototype.hasOwnProperty.call(inputRecord, "reviewedAt") &&
      !isUtcIsoTimestampWithMilliseconds(inputRecord.reviewedAt))
  );
}

function humanToolInspectionDispositionBoundaryInspectionArtifacts(inputRecord) {
  return inputRecord === null ? undefined : inputRecord.inspectionArtifacts;
}

function humanToolInspectionDispositionBoundaryClassification(
  inputRecord,
  inspectionArtifacts
) {
  return humanToolInspectionDispositionBoundaryInputMalformed(inputRecord)
    ? MALFORMED_HUMAN_TOOL_INSPECTION_DISPOSITION_CLASSIFICATION
    : humanToolInspectionDispositionClassification(inspectionArtifacts);
}

function humanToolInspectionDispositionSummaryFromArtifact(inspectionArtifact) {
  return {
    schema: inspectionArtifact.schema,
    artifactKind: inspectionArtifact.artifactKind,
    artifactMode: inspectionArtifact.artifactMode,
    reviewedAt: inspectionArtifact.reviewedAt,
    artifactDigest: reviewArtifactHandoffDigest(inspectionArtifact),
    inspectionArtifactIsApprovalDecision: false,
    inspectionArtifactIsApprovalGrant: false,
    evaluatorResultProduced: false,
    approvalDecisionProduced: false,
    approvalGrantProduced: false,
    approvalGrantPersisted: false,
    evaluatorExecuted: false,
    runtimeEffectAllFalse: true
  };
}

function humanToolInspectionDispositionAcceptedOutput({
  accepted,
  inspectionArtifacts,
  reviewedAt
}) {
  if (!accepted) {
    return {
      dispositionState: null,
      dispositionSummary: null
    };
  }

  const inspectionArtifact = inspectionArtifacts[0];

  return {
    dispositionState: humanToolInspectionDispositionStateFromArtifact(
      inspectionArtifact,
      reviewedAt
    ),
    dispositionSummary:
      humanToolInspectionDispositionSummaryFromArtifact(inspectionArtifact)
  };
}

function humanToolInspectionDispositionBoundaryResult({
  reviewedAt,
  reviewedAtDefaulted,
  classification,
  accepted,
  dispositionState,
  dispositionSummary
}) {
  return {
    schema: HUMAN_TOOL_INSPECTION_DISPOSITION_BOUNDARY_SCHEMA,
    schemaVersion: HUMAN_TOOL_INSPECTION_DISPOSITION_BOUNDARY_VERSION,
    boundaryKind: HUMAN_TOOL_INSPECTION_DISPOSITION_BOUNDARY_KIND,
    boundaryMode: "review-only",
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    inspectionArtifactAccepted: accepted,
    dispositionStateProduced: accepted,
    dispositionStateIsApprovalDecision: false,
    dispositionStateIsApprovalGrant: false,
    dispositionState,
    dispositionSummary,
    reviewOnly: true,
    authoritative: false,
    reviewArtifactOnly: true,
    evaluatorResultProduced: false,
    evaluatorResultPersisted: false,
    evaluatorResultId: null,
    approvalDecisionProduced: false,
    approvalDecisionPersisted: false,
    approvalDecisionId: null,
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
    rejectionReasons: humanToolInspectionDispositionRejectionReasons({
      accepted,
      classification
    }),
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

export function createHumanToolInspectionDispositionBoundaryForReview(input = {}) {
  const inputRecord = humanToolInspectionDispositionBoundaryInputRecord(input);
  const reviewedAt =
    humanToolInspectionDispositionBoundaryReviewedAt(inputRecord);
  const reviewedAtDefaulted = isReviewedAtDefaulted(inputRecord);
  const inspectionArtifacts =
    humanToolInspectionDispositionBoundaryInspectionArtifacts(inputRecord);
  const classification =
    humanToolInspectionDispositionBoundaryClassification(
      inputRecord,
      inspectionArtifacts
    );
  const accepted =
    classification === VALID_HUMAN_TOOL_INSPECTION_DISPOSITION_CLASSIFICATION;
  const { dispositionState, dispositionSummary } =
    humanToolInspectionDispositionAcceptedOutput({
      accepted,
      inspectionArtifacts,
      reviewedAt
    });

  return humanToolInspectionDispositionBoundaryResult({
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    accepted,
    dispositionState,
    dispositionSummary
  });
}

const REVIEW_ONLY_DISPOSITION_AGGREGATION_STATE_SCHEMA =
  "ardyn.phase-5.32.review-only-disposition-aggregation-state";

const REVIEW_ONLY_DISPOSITION_AGGREGATION_MIN_REVIEWED_AT =
  "2026-06-16T00:00:00.000Z";

const VALID_REVIEW_ONLY_DISPOSITION_AGGREGATION_CLASSIFICATION =
  "valid_review_only_disposition_aggregation_checkpoint_runtime_still_blocked";
const REVIEW_ONLY_DISPOSITION_AGGREGATION_REQUIRED_FALSE_FIELDS = Object.freeze([
  "dispositionStateIsApprovalDecision",
  "dispositionStateIsApprovalGrant",
  "evaluatorResultProduced",
  "evaluatorResultPersisted",
  "approvalDecisionProduced",
  "approvalDecisionPersisted",
  "approvalGrantProduced",
  "approvalGrantPersisted",
  "runtimePermissionGranted",
  "commandExposurePermissionGranted",
  "runtimeCommandExposureEnabled",
  "runtimeExecutionEnabled",
  "evaluatorExecutionRequested",
  "evaluatorExecutionStarted",
  "evaluatorExecutionEnabled",
  "evaluatorExecuted"
]);

const REVIEW_ONLY_DISPOSITION_AGGREGATION_REQUIRED_NULL_FIELDS = Object.freeze([
  "evaluatorResultId",
  "approvalDecisionId",
  "approvalGrantId"
]);

const REVIEW_ONLY_DISPOSITION_AGGREGATION_SOURCE_STATE_FIELDS = Object.freeze([
  "schema",
  "schemaVersion",
  "stateKind",
  "stateMode",
  "reviewedAt",
  "sourceInspectionArtifact",
  "pipelineSummary",
  "integratedReviewSummary",
  "decisionCandidateSummary",
  "inspectionSummary",
  "dispositionSummary",
  "inspectionArtifactAccepted",
  "reviewArtifactOnly",
  "dispositionStateIsApprovalDecision",
  "dispositionStateIsApprovalGrant",
  "evaluatorResultProduced",
  "evaluatorResultPersisted",
  "evaluatorResultId",
  "approvalDecisionProduced",
  "approvalDecisionPersisted",
  "approvalDecisionId",
  "approvalGrantProduced",
  "approvalGrantPersisted",
  "approvalGrantId",
  "runtimePermissionGranted",
  "commandExposurePermissionGranted",
  "runtimeCommandExposureEnabled",
  "runtimeExecutionEnabled",
  "evaluatorExecutionRequested",
  "evaluatorExecutionStarted",
  "evaluatorExecutionEnabled",
  "evaluatorExecuted",
  "runtimeEffect"
]);

const REVIEW_ONLY_DISPOSITION_AGGREGATION_DISPOSITION_SUMMARY_FIELDS =
  Object.freeze([
    "dispositionKind",
    "dispositionMode",
    "sourceInspectionArtifactClassification",
    "reviewArtifactOnly",
    "evaluatorResultProduced",
    "approvalDecisionProduced",
    "approvalGrantProduced",
    "runtimePermissionGranted",
    "commandExposurePermissionGranted",
    "evaluatorExecuted",
    "runtimeEffectAllFalse"
  ]);

const REVIEW_ONLY_DISPOSITION_AGGREGATION_SOURCE_INSPECTION_ARTIFACT_FIELDS =
  Object.freeze([
    "schema",
    "artifactKind",
    "artifactMode",
    "reviewedAt",
    "artifactDigest",
    "sourceDecisionCandidateStateDigest",
    "sourcePreflightCheckpointStateDigest",
    "sourceIntakeCheckpointStateDigest",
    "sourceEvaluatorInputCandidateDigest",
    "inspectionArtifactOnly",
    "inspectionArtifactIsApprovalDecision",
    "inspectionArtifactIsApprovalGrant",
    "evaluatorResultProduced",
    "approvalDecisionProduced",
    "approvalGrantProduced",
    "approvalGrantPersisted",
    "evaluatorExecuted",
    "runtimeEffectAllFalse"
  ]);

const REVIEW_ONLY_DISPOSITION_AGGREGATION_ALLOWED_FIELDS = new Set([
  ...REVIEW_ONLY_DISPOSITION_AGGREGATION_SOURCE_STATE_FIELDS,
  ...REVIEW_ONLY_DISPOSITION_AGGREGATION_SOURCE_INSPECTION_ARTIFACT_FIELDS,
  ...HUMAN_TOOL_INSPECTION_DISPOSITION_INSPECTION_SUMMARY_FIELDS,
  ...REVIEW_ONLY_DISPOSITION_AGGREGATION_DISPOSITION_SUMMARY_FIELDS,
  ...NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_SUMMARY_FIELDS,
  ...NON_AUTHORIZING_EVALUATOR_DECISION_PIPELINE_SUMMARY_FIELDS,
  ...NON_AUTHORIZING_EVALUATOR_DECISION_INTEGRATED_SUMMARY_FIELDS
]);

const REVIEW_ONLY_DISPOSITION_AGGREGATION_SOURCE_STATE_CHECKS = Object.freeze([
  ["schema", (value) => value === HUMAN_TOOL_INSPECTION_DISPOSITION_STATE_SCHEMA],
  [
    "schemaVersion",
    (value) => value === HUMAN_TOOL_INSPECTION_DISPOSITION_BOUNDARY_VERSION
  ],
  [
    "stateKind",
    (value) => value === "review-only-human-tool-inspection-disposition-state"
  ],
  ["stateMode", (value) => value === "review-only"],
  ["reviewedAt", isUtcIsoTimestampWithMilliseconds],
  ["sourceInspectionArtifact", isPlainObjectRecord],
  ["pipelineSummary", isPlainObjectRecord],
  ["integratedReviewSummary", isPlainObjectRecord],
  ["decisionCandidateSummary", isPlainObjectRecord],
  ["inspectionSummary", isPlainObjectRecord],
  ["dispositionSummary", isPlainObjectRecord],
  ["inspectionArtifactAccepted", (value) => value === true],
  ["reviewArtifactOnly", (value) => value === true],
  ["runtimeEffect", isPlainObjectRecord]
]);

const REVIEW_ONLY_DISPOSITION_AGGREGATION_SOURCE_INSPECTION_ARTIFACT_CHECKS =
  Object.freeze([
    [
      "schema",
      (value) =>
        value ===
        NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_ARTIFACT_INTERNAL_SCHEMA
    ],
    [
      "artifactKind",
      (value) =>
        value ===
        NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_ARTIFACT_KIND
    ],
    ["artifactMode", (value) => value === "review-only"],
    ["reviewedAt", isUtcIsoTimestampWithMilliseconds],
    [
      "artifactDigest",
      (value) =>
        typeof value === "string" && /^sha256:[0-9a-f]{64}$/.test(value)
    ],
    [
      "sourceDecisionCandidateStateDigest",
      (value) =>
        typeof value === "string" && /^sha256:[0-9a-f]{64}$/.test(value)
    ],
    [
      "sourcePreflightCheckpointStateDigest",
      (value) =>
        typeof value === "string" && /^sha256:[0-9a-f]{64}$/.test(value)
    ],
    [
      "sourceIntakeCheckpointStateDigest",
      (value) =>
        typeof value === "string" && /^sha256:[0-9a-f]{64}$/.test(value)
    ],
    [
      "sourceEvaluatorInputCandidateDigest",
      (value) =>
        typeof value === "string" && /^sha256:[0-9a-f]{64}$/.test(value)
    ],
    ["inspectionArtifactOnly", (value) => value === true],
    ["inspectionArtifactIsApprovalDecision", (value) => value === false],
    ["inspectionArtifactIsApprovalGrant", (value) => value === false],
    ["evaluatorResultProduced", (value) => value === false],
    ["approvalDecisionProduced", (value) => value === false],
    ["approvalGrantProduced", (value) => value === false],
    ["approvalGrantPersisted", (value) => value === false],
    ["evaluatorExecuted", (value) => value === false],
    ["runtimeEffectAllFalse", (value) => value === true]
  ]);

const REVIEW_ONLY_DISPOSITION_AGGREGATION_DISPOSITION_SUMMARY_CHECKS =
  Object.freeze([
    [
      "dispositionKind",
      (value) => value === "review-only-human-tool-inspection-disposition"
    ],
    ["dispositionMode", (value) => value === "review-only"],
    [
      "sourceInspectionArtifactClassification",
      (value) =>
        value ===
        VALID_NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_CLASSIFICATION
    ],
    ["reviewArtifactOnly", (value) => value === true],
    ["evaluatorResultProduced", (value) => value === false],
    ["approvalDecisionProduced", (value) => value === false],
    ["approvalGrantProduced", (value) => value === false],
    ["runtimePermissionGranted", (value) => value === false],
    ["commandExposurePermissionGranted", (value) => value === false],
    ["evaluatorExecuted", (value) => value === false],
    ["runtimeEffectAllFalse", (value) => value === true]
  ]);

const REVIEW_ONLY_DISPOSITION_AGGREGATION_EVALUATOR_RESULT_FALSE_PATHS =
  Object.freeze([
    Object.freeze(["evaluatorResultProduced"]),
    Object.freeze(["evaluatorResultPersisted"]),
    Object.freeze(["sourceInspectionArtifact", "evaluatorResultProduced"]),
    Object.freeze(["inspectionSummary", "evaluatorResultProduced"]),
    Object.freeze(["dispositionSummary", "evaluatorResultProduced"])
  ]);

const REVIEW_ONLY_DISPOSITION_AGGREGATION_EVALUATOR_RESULT_NULL_PATHS =
  Object.freeze([Object.freeze(["evaluatorResultId"])]);

const REVIEW_ONLY_DISPOSITION_AGGREGATION_EVALUATOR_RESULT_OBJECT_FIELDS =
  Object.freeze([
    "evaluatorResult",
    "evaluationResult",
    "evaluatorOutput",
    "evaluatorOutcome",
    "resultProduced"
  ]);

const REVIEW_ONLY_DISPOSITION_AGGREGATION_APPROVAL_DECISION_FALSE_PATHS =
  Object.freeze([
    Object.freeze(["dispositionStateIsApprovalDecision"]),
    Object.freeze(["approvalDecisionProduced"]),
    Object.freeze(["approvalDecisionPersisted"]),
    Object.freeze(["inspectionSummary", "approvalDecisionProduced"]),
    Object.freeze(["decisionCandidateSummary", "approvalDecisionProduced"]),
    Object.freeze(["dispositionSummary", "approvalDecisionProduced"])
  ]);

const REVIEW_ONLY_DISPOSITION_AGGREGATION_APPROVAL_DECISION_NULL_PATHS =
  Object.freeze([Object.freeze(["approvalDecisionId"])]);

const REVIEW_ONLY_DISPOSITION_AGGREGATION_APPROVAL_DECISION_TRUE_FIELDS =
  Object.freeze([
    "approvalDecision",
    "approvalDecisionResult",
    "approvalDecisionGranted",
    "approvalDecisionAccepted",
    "approvalDecisionAuthorized",
    "dispositionAggregationIsApprovalDecision"
  ]);

const REVIEW_ONLY_DISPOSITION_AGGREGATION_APPROVAL_GRANT_FALSE_PATHS =
  Object.freeze([
    Object.freeze(["dispositionStateIsApprovalGrant"]),
    Object.freeze(["approvalGrantProduced"]),
    Object.freeze(["approvalGrantPersisted"]),
    Object.freeze(["sourceInspectionArtifact", "approvalGrantProduced"]),
    Object.freeze(["sourceInspectionArtifact", "approvalGrantPersisted"]),
    Object.freeze(["integratedReviewSummary", "reviewSummaryIsApprovalGrant"]),
    Object.freeze(["integratedReviewSummary", "approvalGrantProduced"]),
    Object.freeze(["integratedReviewSummary", "approvalGrantPersisted"]),
    Object.freeze(["inspectionSummary", "approvalGrantProduced"]),
    Object.freeze(["decisionCandidateSummary", "approvalGrantProduced"]),
    Object.freeze(["dispositionSummary", "approvalGrantProduced"])
  ]);

const REVIEW_ONLY_DISPOSITION_AGGREGATION_APPROVAL_GRANT_NULL_PATHS =
  Object.freeze([
    Object.freeze(["approvalGrantId"]),
    Object.freeze(["integratedReviewSummary", "approvalGrantId"])
  ]);

const REVIEW_ONLY_DISPOSITION_AGGREGATION_APPROVAL_GRANT_TRUE_PATHS =
  Object.freeze([
    Object.freeze(["approvalGrant", "produced"]),
    Object.freeze(["approvalGrant", "persisted"])
  ]);

const REVIEW_ONLY_DISPOSITION_AGGREGATION_GENERIC_GRANT_TRUE_FIELDS =
  Object.freeze([
    "grantProduced",
    "grantPersisted",
    "grantCreated",
    "grantIssued",
    "grantAuthorized",
    "grantAccepted",
    "runtimeGrantProduced",
    "permissionGrantProduced"
  ]);

const REVIEW_ONLY_DISPOSITION_AGGREGATION_EVALUATOR_EXECUTION_TRUE_FIELDS =
  Object.freeze([
    "evaluatorExecutionRequested",
    "evaluatorExecutionStarted",
    "evaluatorExecutionEnabled",
    "evaluatorExecutionPerformed",
    "evaluatorExecuted"
  ]);

const REVIEW_ONLY_DISPOSITION_AGGREGATION_REVIEWER_ROUTING_FIELDS =
  Object.freeze([
    "reviewerRouting",
    "reviewerRoute",
    "reviewerRouteId",
    "reviewerQueue",
    "reviewerAssignment",
    "assignedReviewer",
    "assignedReviewers",
    "routing",
    "routingDecision",
    "routingResult",
    "routeReviewer",
    "reviewerRoutingPerformed",
    "reviewerRoutingEnabled",
    "reviewerRoutingPermissionGranted"
  ]);

function reviewOnlyDispositionAggregationUnexpectedUnsafeField(
  value,
  seen = new Set()
) {
  if (Array.isArray(value)) {
    return value.some((entry) =>
      reviewOnlyDispositionAggregationUnexpectedUnsafeField(entry, seen)
    );
  }

  if (!isPlainObjectRecord(value) || seen.has(value)) {
    return false;
  }

  seen.add(value);

  return Object.entries(value).some(
    ([key, entry]) =>
      (!REVIEW_ONLY_DISPOSITION_AGGREGATION_ALLOWED_FIELDS.has(key) &&
        APPROVAL_EVALUATOR_CANDIDATE_UNSAFE_TRUE_FIELD_PATTERN.test(key)) ||
      reviewOnlyDispositionAggregationUnexpectedUnsafeField(entry, seen)
  );
}

function reviewOnlyDispositionAggregationKeyPresent(
  value,
  keys,
  seen = new Set()
) {
  if (Array.isArray(value)) {
    return value.some((entry) =>
      reviewOnlyDispositionAggregationKeyPresent(entry, keys, seen)
    );
  }

  if (!isPlainObjectRecord(value) || seen.has(value)) {
    return false;
  }

  seen.add(value);

  return Object.entries(value).some(
    ([key, entry]) =>
      keys.includes(key) ||
      reviewOnlyDispositionAggregationKeyPresent(entry, keys, seen)
  );
}

function reviewOnlyDispositionAggregationUnknown(dispositionState) {
  return (
    (typeof dispositionState.schema === "string" &&
      dispositionState.schema !== HUMAN_TOOL_INSPECTION_DISPOSITION_STATE_SCHEMA) ||
    (typeof dispositionState.stateKind === "string" &&
      dispositionState.stateKind !==
        "review-only-human-tool-inspection-disposition-state")
  );
}

function reviewOnlyDispositionAggregationRevoked(dispositionState) {
  return (
    dispositionState.revoked === true ||
    (isPlainObjectRecord(dispositionState.revocation) &&
      dispositionState.revocation.revoked === true)
  );
}

function reviewOnlyDispositionAggregationStale(dispositionState) {
  return (
    isUtcIsoTimestampWithMilliseconds(dispositionState.reviewedAt) &&
    dispositionState.reviewedAt <
      REVIEW_ONLY_DISPOSITION_AGGREGATION_MIN_REVIEWED_AT
  );
}

const REVIEW_ONLY_DISPOSITION_AGGREGATION_MALFORMED_CHECKS = Object.freeze([
  (dispositionState) =>
    !recordHasExactFields(
      dispositionState,
      REVIEW_ONLY_DISPOSITION_AGGREGATION_SOURCE_STATE_FIELDS
    ),
  (dispositionState) =>
    !recordPassesChecks(
      dispositionState,
      REVIEW_ONLY_DISPOSITION_AGGREGATION_SOURCE_STATE_CHECKS
    ),
  (dispositionState) =>
    !recordHasExactFields(
      dispositionState.sourceInspectionArtifact,
      REVIEW_ONLY_DISPOSITION_AGGREGATION_SOURCE_INSPECTION_ARTIFACT_FIELDS
    ),
  (dispositionState) =>
    !recordPassesChecks(
      dispositionState.sourceInspectionArtifact,
      REVIEW_ONLY_DISPOSITION_AGGREGATION_SOURCE_INSPECTION_ARTIFACT_CHECKS
    ),
  (dispositionState) =>
    !recordHasExactFields(
      dispositionState.pipelineSummary,
      NON_AUTHORIZING_EVALUATOR_DECISION_PIPELINE_SUMMARY_FIELDS
    ),
  (dispositionState) =>
    !recordPassesChecks(
      dispositionState.pipelineSummary,
      PREREQUISITE_REVIEW_ARTIFACT_PIPELINE_CHECKS
    ),
  (dispositionState) =>
    !recordHasExactFields(
      dispositionState.integratedReviewSummary,
      NON_AUTHORIZING_EVALUATOR_DECISION_INTEGRATED_SUMMARY_FIELDS
    ),
  (dispositionState) =>
    !recordPassesChecks(
      dispositionState.integratedReviewSummary,
      PREREQUISITE_REVIEW_ARTIFACT_SUMMARY_CHECKS
    ),
  (dispositionState) =>
    !recordHasExactFields(
      dispositionState.decisionCandidateSummary,
      NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_SUMMARY_FIELDS
    ),
  (dispositionState) =>
    !recordPassesChecks(
      dispositionState.decisionCandidateSummary,
      NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_SUMMARY_CHECKS
    ),
  (dispositionState) =>
    !recordHasExactFields(
      dispositionState.inspectionSummary,
      HUMAN_TOOL_INSPECTION_DISPOSITION_INSPECTION_SUMMARY_FIELDS
    ),
  (dispositionState) =>
    !recordPassesChecks(
      dispositionState.inspectionSummary,
      HUMAN_TOOL_INSPECTION_DISPOSITION_INSPECTION_SUMMARY_CHECKS
    ),
  (dispositionState) =>
    !recordHasExactFields(
      dispositionState.dispositionSummary,
      REVIEW_ONLY_DISPOSITION_AGGREGATION_DISPOSITION_SUMMARY_FIELDS
    ),
  (dispositionState) =>
    !recordPassesChecks(
      dispositionState.dispositionSummary,
      REVIEW_ONLY_DISPOSITION_AGGREGATION_DISPOSITION_SUMMARY_CHECKS
    ),
  (dispositionState) =>
    !recordPassesChecks(
      dispositionState,
      REVIEW_ONLY_DISPOSITION_AGGREGATION_REQUIRED_FALSE_FIELDS.map((field) => [
        field,
        (value) => value === false
      ])
    ),
  (dispositionState) =>
    !recordPassesChecks(
      dispositionState,
      REVIEW_ONLY_DISPOSITION_AGGREGATION_REQUIRED_NULL_FIELDS.map((field) => [
        field,
        (value) => value === null
      ])
    ),
  (dispositionState) =>
    !reviewOnlyRuntimeEffectAllFalse(dispositionState.runtimeEffect)
]);

function reviewOnlyDispositionAggregationMalformed(dispositionState) {
  return REVIEW_ONLY_DISPOSITION_AGGREGATION_MALFORMED_CHECKS.some((predicate) =>
    predicate(dispositionState)
  );
}

function reviewOnlyDispositionAggregationGrantLooking(dispositionState) {
  return approvalEvaluatorCandidateNestedTrueClaim(
    dispositionState,
    (key) =>
      REVIEW_ONLY_DISPOSITION_AGGREGATION_GENERIC_GRANT_TRUE_FIELDS.includes(key)
  );
}

function reviewOnlyDispositionAggregationApprovalDecisionLooking(
  dispositionState
) {
  return (
    REVIEW_ONLY_DISPOSITION_AGGREGATION_APPROVAL_DECISION_FALSE_PATHS.some(
      (path) =>
        reviewOnlyEvaluatorPreflightPathDoesNotMatch(
          dispositionState,
          path,
          false
        )
    ) ||
    REVIEW_ONLY_DISPOSITION_AGGREGATION_APPROVAL_DECISION_NULL_PATHS.some(
      (path) =>
        reviewOnlyEvaluatorPreflightPathDoesNotMatch(
          dispositionState,
          path,
          null
        )
    ) ||
    reviewOnlyDispositionAggregationKeyPresent(
      dispositionState,
      REVIEW_ONLY_DISPOSITION_AGGREGATION_APPROVAL_DECISION_TRUE_FIELDS
    )
  );
}

function reviewOnlyDispositionAggregationApprovalGrantLooking(dispositionState) {
  return (
    REVIEW_ONLY_DISPOSITION_AGGREGATION_APPROVAL_GRANT_FALSE_PATHS.some((path) =>
      reviewOnlyEvaluatorPreflightPathDoesNotMatch(dispositionState, path, false)
    ) ||
    REVIEW_ONLY_DISPOSITION_AGGREGATION_APPROVAL_GRANT_NULL_PATHS.some((path) =>
      reviewOnlyEvaluatorPreflightPathDoesNotMatch(dispositionState, path, null)
    ) ||
    REVIEW_ONLY_DISPOSITION_AGGREGATION_APPROVAL_GRANT_TRUE_PATHS.some(
      (path) =>
        reviewOnlyEvaluatorPreflightPathValue(dispositionState, path) === true
    )
  );
}

function reviewOnlyDispositionAggregationEvaluatorResultLooking(
  dispositionState
) {
  return (
    REVIEW_ONLY_DISPOSITION_AGGREGATION_EVALUATOR_RESULT_FALSE_PATHS.some(
      (path) =>
        reviewOnlyEvaluatorPreflightPathDoesNotMatch(
          dispositionState,
          path,
          false
        )
    ) ||
    REVIEW_ONLY_DISPOSITION_AGGREGATION_EVALUATOR_RESULT_NULL_PATHS.some(
      (path) =>
        reviewOnlyEvaluatorPreflightPathDoesNotMatch(
          dispositionState,
          path,
          null
        )
    ) ||
    reviewOnlyDispositionAggregationKeyPresent(
      dispositionState,
      REVIEW_ONLY_DISPOSITION_AGGREGATION_EVALUATOR_RESULT_OBJECT_FIELDS
    )
  );
}

function reviewOnlyDispositionAggregationEvaluatorExecutionLooking(
  dispositionState
) {
  return approvalEvaluatorCandidateNestedTrueClaim(
    dispositionState,
    (key) =>
      REVIEW_ONLY_DISPOSITION_AGGREGATION_EVALUATOR_EXECUTION_TRUE_FIELDS.includes(
        key
      )
  );
}

function reviewOnlyDispositionAggregationReviewerRoutingLooking(
  dispositionState
) {
  return reviewOnlyDispositionAggregationKeyPresent(
    dispositionState,
    REVIEW_ONLY_DISPOSITION_AGGREGATION_REVIEWER_ROUTING_FIELDS
  );
}

function reviewOnlyDispositionAggregationRuntimePermissionLooking(
  dispositionState
) {
  return approvalEvaluatorCandidateNestedTrueClaim(
    dispositionState,
    (key) =>
      REVIEW_ONLY_EVALUATOR_PREFLIGHT_RUNTIME_PERMISSION_TRUE_FIELDS.includes(key)
  );
}

function reviewOnlyDispositionAggregationCommandExposureLooking(
  dispositionState
) {
  return approvalEvaluatorCandidateNestedTrueClaim(
    dispositionState,
    (key) =>
      REVIEW_ONLY_EVALUATOR_PREFLIGHT_COMMAND_EXPOSURE_TRUE_FIELDS.includes(key)
  );
}

function reviewOnlyDispositionAggregationRuntimeEffectTrue(dispositionState) {
  return approvalEvaluatorCandidateRuntimeEffectTrue(dispositionState);
}

function reviewOnlyDispositionAggregationProcessFlagTrue(dispositionState) {
  return approvalEvaluatorCandidateNestedTrueClaim(
    dispositionState,
    (key) => APPROVAL_EVALUATOR_CANDIDATE_PROCESS_TRUE_FIELDS.includes(key)
  );
}

function reviewOnlyDispositionAggregationUnsafeTrueSurface(dispositionState) {
  return approvalEvaluatorCandidateNestedTrueClaim(
    dispositionState,
    (key) => APPROVAL_EVALUATOR_CANDIDATE_UNSAFE_TRUE_FIELD_PATTERN.test(key)
  );
}

function reviewOnlyDispositionAggregationExecutionSignalLooking(
  dispositionState
) {
  return approvalEvaluatorCandidateNestedTrueClaim(
    dispositionState,
    (key) => REVIEW_ONLY_EVALUATOR_PREFLIGHT_EXECUTION_SIGNAL_TRUE_FIELDS.includes(key)
  );
}

function reviewOnlyDispositionAggregationAuthorizing(dispositionState) {
  return approvalEvaluatorCandidateNestedTrueClaim(
    dispositionState,
    (key) =>
      REVIEW_ONLY_EVALUATOR_PREFLIGHT_AUTHORITATIVE_TRUE_FIELDS.includes(key)
  );
}

const REVIEW_ONLY_DISPOSITION_AGGREGATION_SINGLE_REJECTION_CHECKS =
  Object.freeze([
    [
      (dispositionState) => !isPlainObjectRecord(dispositionState),
      "malformed_review_only_disposition_aggregation_checkpoint_input_rejected"
    ],
    [
      reviewOnlyDispositionAggregationUnknown,
      "unknown_review_only_disposition_aggregation_checkpoint_input_rejected"
    ],
    [
      reviewOnlyDispositionAggregationRevoked,
      "revoked_review_only_disposition_aggregation_checkpoint_input_rejected"
    ],
    [
      reviewOnlyDispositionAggregationStale,
      "stale_review_only_disposition_aggregation_checkpoint_input_rejected"
    ],
    [
      reviewOnlyDispositionAggregationApprovalDecisionLooking,
      "approval_decision_looking_review_only_disposition_aggregation_checkpoint_input_rejected"
    ],
    [
      reviewOnlyDispositionAggregationUnexpectedUnsafeField,
      "unsafe_review_only_disposition_aggregation_checkpoint_input_rejected"
    ],
    [
      reviewOnlyDispositionAggregationGrantLooking,
      "grant_looking_review_only_disposition_aggregation_checkpoint_input_rejected"
    ],
    [
      reviewOnlyDispositionAggregationApprovalGrantLooking,
      "approval_grant_looking_review_only_disposition_aggregation_checkpoint_input_rejected"
    ],
    [
      reviewOnlyDispositionAggregationEvaluatorResultLooking,
      "evaluator_result_looking_review_only_disposition_aggregation_checkpoint_input_rejected"
    ],
    [
      reviewOnlyDispositionAggregationEvaluatorExecutionLooking,
      "evaluator_execution_looking_review_only_disposition_aggregation_checkpoint_input_rejected"
    ],
    [
      reviewOnlyDispositionAggregationReviewerRoutingLooking,
      "reviewer_routing_looking_review_only_disposition_aggregation_checkpoint_input_rejected"
    ],
    [
      reviewOnlyDispositionAggregationRuntimePermissionLooking,
      "runtime_permission_looking_review_only_disposition_aggregation_checkpoint_input_rejected"
    ],
    [
      reviewOnlyDispositionAggregationCommandExposureLooking,
      "command_exposure_looking_review_only_disposition_aggregation_checkpoint_input_rejected"
    ],
    [
      reviewOnlyDispositionAggregationRuntimeEffectTrue,
      "runtime_effect_true_review_only_disposition_aggregation_checkpoint_input_rejected"
    ],
    [
      reviewOnlyDispositionAggregationProcessFlagTrue,
      "process_flag_true_review_only_disposition_aggregation_checkpoint_input_rejected"
    ],
    [
      reviewOnlyDispositionAggregationUnsafeTrueSurface,
      "unsafe_review_only_disposition_aggregation_checkpoint_input_rejected"
    ],
    [
      reviewOnlyDispositionAggregationExecutionSignalLooking,
      "execution_signal_looking_review_only_disposition_aggregation_checkpoint_input_rejected"
    ],
    [
      reviewOnlyDispositionAggregationAuthorizing,
      "authorizing_review_only_disposition_aggregation_checkpoint_input_rejected"
    ],
    [
      reviewOnlyDispositionAggregationMalformed,
      "malformed_review_only_disposition_aggregation_checkpoint_input_rejected"
    ]
  ]);

function reviewOnlyDispositionAggregationSingleClassification(dispositionState) {
  return (
    REVIEW_ONLY_DISPOSITION_AGGREGATION_SINGLE_REJECTION_CHECKS.find(
      ([predicate]) => predicate(dispositionState)
    )?.[1] ?? VALID_REVIEW_ONLY_DISPOSITION_AGGREGATION_CLASSIFICATION
  );
}

function firstReviewOnlyDispositionAggregationRejection(dispositionStates) {
  return (
    dispositionStates
      .map(reviewOnlyDispositionAggregationSingleClassification)
      .find(
        (classification) =>
          classification !==
          VALID_REVIEW_ONLY_DISPOSITION_AGGREGATION_CLASSIFICATION
      ) ?? null
  );
}

function reviewOnlyDispositionAggregationStatesContainDuplicate(
  dispositionStates
) {
  const digests = dispositionStates.map((dispositionState) =>
    reviewArtifactHandoffDigest(dispositionState)
  );

  return new Set(digests).size !== digests.length;
}

const REVIEW_ONLY_DISPOSITION_AGGREGATION_RESOLVERS = Object.freeze([
  (dispositionStates) =>
    dispositionStates === undefined
      ? "missing_review_only_disposition_aggregation_checkpoint_input_rejected"
      : null,
  (dispositionStates) =>
    !Array.isArray(dispositionStates)
      ? "malformed_review_only_disposition_aggregation_checkpoint_input_rejected"
      : null,
  (dispositionStates) =>
    dispositionStates.length === 0
      ? "empty_review_only_disposition_aggregation_checkpoint_input_rejected"
      : null,
  firstReviewOnlyDispositionAggregationRejection,
  (dispositionStates) =>
    reviewOnlyDispositionAggregationStatesContainDuplicate(dispositionStates)
      ? "duplicate_invalid_review_only_disposition_aggregation_checkpoint_input_rejected"
      : null,
  (dispositionStates) =>
    dispositionStates.length > 1
      ? "conflicting_review_only_disposition_aggregation_checkpoint_input_rejected"
      : null
]);

function reviewOnlyDispositionAggregationClassification(dispositionStates) {
  let classification = null;

  REVIEW_ONLY_DISPOSITION_AGGREGATION_RESOLVERS.some((resolver) => {
    classification = resolver(dispositionStates);
    return classification !== null;
  });

  return (
    classification ?? VALID_REVIEW_ONLY_DISPOSITION_AGGREGATION_CLASSIFICATION
  );
}

function reviewOnlyDispositionAggregationSummary() {
  return {
    aggregationKind: "review-only-disposition-aggregation-checkpoint",
    aggregationMode: "review-only",
    sourceDispositionClassification:
      VALID_HUMAN_TOOL_INSPECTION_DISPOSITION_CLASSIFICATION,
    aggregationMetadataOnly: true,
    reviewerRoutingPerformed: false,
    evaluatorResultProduced: false,
    approvalDecisionProduced: false,
    approvalGrantProduced: false,
    runtimePermissionGranted: false,
    commandExposurePermissionGranted: false,
    evaluatorExecuted: false,
    runtimeEffectAllFalse: true
  };
}

function reviewOnlyDispositionAggregationStateFromDispositionState(
  dispositionState,
  reviewedAt
) {
  return {
    schema: REVIEW_ONLY_DISPOSITION_AGGREGATION_STATE_SCHEMA,
    schemaVersion: REVIEW_ONLY_DISPOSITION_AGGREGATION_CHECKPOINT_VERSION,
    stateKind: "review-only-disposition-aggregation-state",
    stateMode: "review-only",
    reviewedAt,
    sourceDispositionState: {
      schema: dispositionState.schema,
      stateKind: dispositionState.stateKind,
      stateMode: dispositionState.stateMode,
      reviewedAt: dispositionState.reviewedAt,
      stateDigest: reviewArtifactHandoffDigest(dispositionState),
      sourceInspectionArtifactDigest:
        dispositionState.sourceInspectionArtifact.artifactDigest,
      sourceDecisionCandidateStateDigest:
        dispositionState.sourceInspectionArtifact.sourceDecisionCandidateStateDigest,
      sourcePreflightCheckpointStateDigest:
        dispositionState.sourceInspectionArtifact
          .sourcePreflightCheckpointStateDigest,
      sourceIntakeCheckpointStateDigest:
        dispositionState.sourceInspectionArtifact.sourceIntakeCheckpointStateDigest,
      sourceEvaluatorInputCandidateDigest:
        dispositionState.sourceInspectionArtifact.sourceEvaluatorInputCandidateDigest,
      inspectionArtifactAccepted: true,
      reviewArtifactOnly: true,
      dispositionStateIsApprovalDecision: false,
      dispositionStateIsApprovalGrant: false,
      evaluatorResultProduced: false,
      approvalDecisionProduced: false,
      approvalGrantProduced: false,
      approvalGrantPersisted: false,
      evaluatorExecuted: false,
      runtimeEffectAllFalse: true
    },
    pipelineSummary: reviewOnlyEvaluatorPreflightPipelineSummary(
      dispositionState.pipelineSummary
    ),
    integratedReviewSummary: reviewOnlyEvaluatorPreflightIntegratedSummary(
      dispositionState.integratedReviewSummary
    ),
    decisionCandidateSummary:
      nonAuthorizingEvaluatorDecisionCandidateSummary(),
    inspectionSummary:
      nonAuthorizingEvaluatorDecisionCandidateInspectionSummary(),
    dispositionSummary: humanToolInspectionDispositionSummary(),
    aggregationSummary: reviewOnlyDispositionAggregationSummary(),
    dispositionStateAccepted: true,
    aggregationMetadataOnly: true,
    aggregationCheckpointIsReviewerRouting: false,
    aggregationCheckpointIsApprovalDecision: false,
    aggregationCheckpointIsApprovalGrant: false,
    reviewerRoutingPerformed: false,
    reviewerRoutingEnabled: false,
    reviewerRouteId: null,
    evaluatorResultProduced: false,
    evaluatorResultPersisted: false,
    evaluatorResultId: null,
    approvalDecisionProduced: false,
    approvalDecisionPersisted: false,
    approvalDecisionId: null,
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

function reviewOnlyDispositionAggregationRejectionReasons({
  accepted,
  classification
}) {
  if (accepted) {
    return [
      "disposition_aggregation_checkpoint_is_review_only",
      "reviewer_routing_not_implemented",
      "evaluator_result_not_implemented",
      "approval_decision_not_implemented",
      "approval_grant_not_implemented",
      "evaluator_execution_not_implemented",
      "runtime_enablement_still_blocked"
    ];
  }

  return [
    classification,
    "disposition_aggregation_state_not_produced",
    "reviewer_routing_not_implemented",
    "evaluator_result_not_implemented",
    "approval_decision_not_implemented",
    "approval_grant_not_implemented",
    "evaluator_execution_not_implemented",
    "runtime_enablement_still_blocked"
  ];
}

function reviewOnlyDispositionAggregationInputRecord(input) {
  return isPlainObjectRecord(input) ? input : null;
}

function reviewOnlyDispositionAggregationReviewedAt(inputRecord) {
  if (
    inputRecord === null ||
    !Object.prototype.hasOwnProperty.call(inputRecord, "reviewedAt")
  ) {
    return APPROVAL_PREREQUISITE_SOURCE_PREFLIGHT_DEFAULT_REVIEWED_AT;
  }

  return isUtcIsoTimestampWithMilliseconds(inputRecord.reviewedAt)
    ? inputRecord.reviewedAt
    : APPROVAL_PREREQUISITE_SOURCE_PREFLIGHT_DEFAULT_REVIEWED_AT;
}

function reviewOnlyDispositionAggregationInputMalformed(inputRecord) {
  return (
    inputRecord === null ||
    (Object.prototype.hasOwnProperty.call(inputRecord, "reviewedAt") &&
      !isUtcIsoTimestampWithMilliseconds(inputRecord.reviewedAt))
  );
}

function reviewOnlyDispositionAggregationDispositionStates(inputRecord) {
  return inputRecord === null ? undefined : inputRecord.dispositionStates;
}

function reviewOnlyDispositionAggregationInputClassification(
  inputRecord,
  dispositionStates
) {
  return reviewOnlyDispositionAggregationInputMalformed(inputRecord)
    ? MALFORMED_REVIEW_ONLY_DISPOSITION_AGGREGATION_CLASSIFICATION
    : reviewOnlyDispositionAggregationClassification(dispositionStates);
}

function reviewOnlyDispositionAggregationSummaryFromDispositionState(
  dispositionState
) {
  return {
    schema: dispositionState.schema,
    stateKind: dispositionState.stateKind,
    stateMode: dispositionState.stateMode,
    reviewedAt: dispositionState.reviewedAt,
    stateDigest: reviewArtifactHandoffDigest(dispositionState),
    dispositionStateIsApprovalDecision: false,
    dispositionStateIsApprovalGrant: false,
    reviewerRoutingPerformed: false,
    evaluatorResultProduced: false,
    approvalDecisionProduced: false,
    approvalGrantProduced: false,
    approvalGrantPersisted: false,
    evaluatorExecuted: false,
    runtimeEffectAllFalse: true
  };
}

function reviewOnlyDispositionAggregationAcceptedOutput({
  accepted,
  dispositionStates,
  reviewedAt
}) {
  if (!accepted) {
    return {
      aggregationState: null,
      aggregationSummary: null
    };
  }

  const dispositionState = dispositionStates[0];

  return {
    aggregationState: reviewOnlyDispositionAggregationStateFromDispositionState(
      dispositionState,
      reviewedAt
    ),
    aggregationSummary:
      reviewOnlyDispositionAggregationSummaryFromDispositionState(dispositionState)
  };
}

function reviewOnlyDispositionAggregationCheckpointResult({
  reviewedAt,
  reviewedAtDefaulted,
  classification,
  accepted,
  aggregationState,
  aggregationSummary
}) {
  return {
    schema: REVIEW_ONLY_DISPOSITION_AGGREGATION_CHECKPOINT_SCHEMA,
    schemaVersion: REVIEW_ONLY_DISPOSITION_AGGREGATION_CHECKPOINT_VERSION,
    checkpointKind: REVIEW_ONLY_DISPOSITION_AGGREGATION_CHECKPOINT_KIND,
    checkpointMode: "review-only",
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    dispositionStateAccepted: accepted,
    aggregationStateProduced: accepted,
    aggregationCheckpointIsReviewerRouting: false,
    aggregationCheckpointIsApprovalDecision: false,
    aggregationCheckpointIsApprovalGrant: false,
    aggregationState,
    aggregationSummary,
    reviewOnly: true,
    authoritative: false,
    reviewArtifactOnly: true,
    aggregationMetadataOnly: true,
    reviewerRoutingPerformed: false,
    reviewerRoutingEnabled: false,
    reviewerRouteId: null,
    evaluatorResultProduced: false,
    evaluatorResultPersisted: false,
    evaluatorResultId: null,
    approvalDecisionProduced: false,
    approvalDecisionPersisted: false,
    approvalDecisionId: null,
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
    rejectionReasons: reviewOnlyDispositionAggregationRejectionReasons({
      accepted,
      classification
    }),
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

export function createReviewOnlyDispositionAggregationCheckpointForReview(
  input = {}
) {
  const inputRecord = reviewOnlyDispositionAggregationInputRecord(input);
  const reviewedAt = reviewOnlyDispositionAggregationReviewedAt(inputRecord);
  const reviewedAtDefaulted = isReviewedAtDefaulted(inputRecord);
  const dispositionStates =
    reviewOnlyDispositionAggregationDispositionStates(inputRecord);
  const classification = reviewOnlyDispositionAggregationInputClassification(
    inputRecord,
    dispositionStates
  );
  const accepted =
    classification === VALID_REVIEW_ONLY_DISPOSITION_AGGREGATION_CLASSIFICATION;
  const { aggregationState, aggregationSummary } =
    reviewOnlyDispositionAggregationAcceptedOutput({
      accepted,
      dispositionStates,
      reviewedAt
    });

  return reviewOnlyDispositionAggregationCheckpointResult({
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    accepted,
    aggregationState,
    aggregationSummary
  });
}

const REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_STATE_SCHEMA =
  "ardyn.phase-5.33.review-only-aggregation-inspection-handoff-state";

const REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_MIN_REVIEWED_AT =
  "2026-06-16T00:00:00.000Z";

const VALID_REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_CLASSIFICATION =
  "valid_review_only_aggregation_inspection_handoff_runtime_still_blocked";
const REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_REQUIRED_FALSE_FIELDS =
  Object.freeze([
    "aggregationCheckpointIsReviewerRouting",
    "aggregationCheckpointIsApprovalDecision",
    "aggregationCheckpointIsApprovalGrant",
    "reviewerRoutingPerformed",
    "reviewerRoutingEnabled",
    "evaluatorResultProduced",
    "evaluatorResultPersisted",
    "approvalDecisionProduced",
    "approvalDecisionPersisted",
    "approvalGrantProduced",
    "approvalGrantPersisted",
    "runtimePermissionGranted",
    "commandExposurePermissionGranted",
    "runtimeCommandExposureEnabled",
    "runtimeExecutionEnabled",
    "evaluatorExecutionRequested",
    "evaluatorExecutionStarted",
    "evaluatorExecutionEnabled",
    "evaluatorExecuted"
  ]);

const REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_REQUIRED_NULL_FIELDS =
  Object.freeze([
    "reviewerRouteId",
    "evaluatorResultId",
    "approvalDecisionId",
    "approvalGrantId"
  ]);

const REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_SOURCE_STATE_FIELDS =
  Object.freeze([
    "schema",
    "schemaVersion",
    "stateKind",
    "stateMode",
    "reviewedAt",
    "sourceDispositionState",
    "pipelineSummary",
    "integratedReviewSummary",
    "decisionCandidateSummary",
    "inspectionSummary",
    "dispositionSummary",
    "aggregationSummary",
    "dispositionStateAccepted",
    "aggregationMetadataOnly",
    "aggregationCheckpointIsReviewerRouting",
    "aggregationCheckpointIsApprovalDecision",
    "aggregationCheckpointIsApprovalGrant",
    "reviewerRoutingPerformed",
    "reviewerRoutingEnabled",
    "reviewerRouteId",
    "evaluatorResultProduced",
    "evaluatorResultPersisted",
    "evaluatorResultId",
    "approvalDecisionProduced",
    "approvalDecisionPersisted",
    "approvalDecisionId",
    "approvalGrantProduced",
    "approvalGrantPersisted",
    "approvalGrantId",
    "runtimePermissionGranted",
    "commandExposurePermissionGranted",
    "runtimeCommandExposureEnabled",
    "runtimeExecutionEnabled",
    "evaluatorExecutionRequested",
    "evaluatorExecutionStarted",
    "evaluatorExecutionEnabled",
    "evaluatorExecuted",
    "runtimeEffect"
  ]);

const REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_SOURCE_DISPOSITION_FIELDS =
  Object.freeze([
    "schema",
    "stateKind",
    "stateMode",
    "reviewedAt",
    "stateDigest",
    "sourceInspectionArtifactDigest",
    "sourceDecisionCandidateStateDigest",
    "sourcePreflightCheckpointStateDigest",
    "sourceIntakeCheckpointStateDigest",
    "sourceEvaluatorInputCandidateDigest",
    "inspectionArtifactAccepted",
    "reviewArtifactOnly",
    "dispositionStateIsApprovalDecision",
    "dispositionStateIsApprovalGrant",
    "evaluatorResultProduced",
    "approvalDecisionProduced",
    "approvalGrantProduced",
    "approvalGrantPersisted",
    "evaluatorExecuted",
    "runtimeEffectAllFalse"
  ]);

const REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_AGGREGATION_SUMMARY_FIELDS =
  Object.freeze([
    "aggregationKind",
    "aggregationMode",
    "sourceDispositionClassification",
    "aggregationMetadataOnly",
    "reviewerRoutingPerformed",
    "evaluatorResultProduced",
    "approvalDecisionProduced",
    "approvalGrantProduced",
    "runtimePermissionGranted",
    "commandExposurePermissionGranted",
    "evaluatorExecuted",
    "runtimeEffectAllFalse"
  ]);

const REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_ALLOWED_FIELDS = new Set([
  ...REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_SOURCE_STATE_FIELDS,
  ...REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_SOURCE_DISPOSITION_FIELDS,
  ...REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_AGGREGATION_SUMMARY_FIELDS,
  ...HUMAN_TOOL_INSPECTION_DISPOSITION_INSPECTION_SUMMARY_FIELDS,
  ...REVIEW_ONLY_DISPOSITION_AGGREGATION_DISPOSITION_SUMMARY_FIELDS,
  ...NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_SUMMARY_FIELDS,
  ...NON_AUTHORIZING_EVALUATOR_DECISION_PIPELINE_SUMMARY_FIELDS,
  ...NON_AUTHORIZING_EVALUATOR_DECISION_INTEGRATED_SUMMARY_FIELDS
]);

const REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_SOURCE_STATE_CHECKS =
  Object.freeze([
    [
      "schema",
      (value) => value === REVIEW_ONLY_DISPOSITION_AGGREGATION_STATE_SCHEMA
    ],
    [
      "schemaVersion",
      (value) => value === REVIEW_ONLY_DISPOSITION_AGGREGATION_CHECKPOINT_VERSION
    ],
    [
      "stateKind",
      (value) => value === "review-only-disposition-aggregation-state"
    ],
    ["stateMode", (value) => value === "review-only"],
    ["reviewedAt", isUtcIsoTimestampWithMilliseconds],
    ["sourceDispositionState", isPlainObjectRecord],
    ["pipelineSummary", isPlainObjectRecord],
    ["integratedReviewSummary", isPlainObjectRecord],
    ["decisionCandidateSummary", isPlainObjectRecord],
    ["inspectionSummary", isPlainObjectRecord],
    ["dispositionSummary", isPlainObjectRecord],
    ["aggregationSummary", isPlainObjectRecord],
    ["dispositionStateAccepted", (value) => value === true],
    ["aggregationMetadataOnly", (value) => value === true],
    ["runtimeEffect", isPlainObjectRecord]
  ]);

const REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_SOURCE_DISPOSITION_CHECKS =
  Object.freeze([
    ["schema", (value) => value === HUMAN_TOOL_INSPECTION_DISPOSITION_STATE_SCHEMA],
    [
      "stateKind",
      (value) => value === "review-only-human-tool-inspection-disposition-state"
    ],
    ["stateMode", (value) => value === "review-only"],
    ["reviewedAt", isUtcIsoTimestampWithMilliseconds],
    [
      "stateDigest",
      (value) =>
        typeof value === "string" && /^sha256:[0-9a-f]{64}$/.test(value)
    ],
    [
      "sourceInspectionArtifactDigest",
      (value) =>
        typeof value === "string" && /^sha256:[0-9a-f]{64}$/.test(value)
    ],
    [
      "sourceDecisionCandidateStateDigest",
      (value) =>
        typeof value === "string" && /^sha256:[0-9a-f]{64}$/.test(value)
    ],
    [
      "sourcePreflightCheckpointStateDigest",
      (value) =>
        typeof value === "string" && /^sha256:[0-9a-f]{64}$/.test(value)
    ],
    [
      "sourceIntakeCheckpointStateDigest",
      (value) =>
        typeof value === "string" && /^sha256:[0-9a-f]{64}$/.test(value)
    ],
    [
      "sourceEvaluatorInputCandidateDigest",
      (value) =>
        typeof value === "string" && /^sha256:[0-9a-f]{64}$/.test(value)
    ],
    ["inspectionArtifactAccepted", (value) => value === true],
    ["reviewArtifactOnly", (value) => value === true],
    ["dispositionStateIsApprovalDecision", (value) => value === false],
    ["dispositionStateIsApprovalGrant", (value) => value === false],
    ["evaluatorResultProduced", (value) => value === false],
    ["approvalDecisionProduced", (value) => value === false],
    ["approvalGrantProduced", (value) => value === false],
    ["approvalGrantPersisted", (value) => value === false],
    ["evaluatorExecuted", (value) => value === false],
    ["runtimeEffectAllFalse", (value) => value === true]
  ]);

const REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_AGGREGATION_SUMMARY_CHECKS =
  Object.freeze([
    [
      "aggregationKind",
      (value) => value === "review-only-disposition-aggregation-checkpoint"
    ],
    ["aggregationMode", (value) => value === "review-only"],
    [
      "sourceDispositionClassification",
      (value) => value === VALID_HUMAN_TOOL_INSPECTION_DISPOSITION_CLASSIFICATION
    ],
    ["aggregationMetadataOnly", (value) => value === true],
    ["reviewerRoutingPerformed", (value) => value === false],
    ["evaluatorResultProduced", (value) => value === false],
    ["approvalDecisionProduced", (value) => value === false],
    ["approvalGrantProduced", (value) => value === false],
    ["runtimePermissionGranted", (value) => value === false],
    ["commandExposurePermissionGranted", (value) => value === false],
    ["evaluatorExecuted", (value) => value === false],
    ["runtimeEffectAllFalse", (value) => value === true]
  ]);

const REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_EVALUATOR_RESULT_FALSE_PATHS =
  Object.freeze([
    Object.freeze(["evaluatorResultProduced"]),
    Object.freeze(["evaluatorResultPersisted"]),
    Object.freeze(["sourceDispositionState", "evaluatorResultProduced"]),
    Object.freeze(["aggregationSummary", "evaluatorResultProduced"]),
    Object.freeze(["inspectionSummary", "evaluatorResultProduced"]),
    Object.freeze(["dispositionSummary", "evaluatorResultProduced"])
  ]);

const REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_EVALUATOR_RESULT_NULL_PATHS =
  Object.freeze([Object.freeze(["evaluatorResultId"])]);

const REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_EVALUATOR_RESULT_OBJECT_FIELDS =
  Object.freeze([
    "evaluatorResult",
    "evaluationResult",
    "evaluatorOutput",
    "evaluatorOutcome",
    "resultProduced"
  ]);

const REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_APPROVAL_DECISION_FALSE_PATHS =
  Object.freeze([
    Object.freeze(["aggregationCheckpointIsApprovalDecision"]),
    Object.freeze(["approvalDecisionProduced"]),
    Object.freeze(["approvalDecisionPersisted"]),
    Object.freeze(["sourceDispositionState", "dispositionStateIsApprovalDecision"]),
    Object.freeze(["inspectionSummary", "approvalDecisionProduced"]),
    Object.freeze(["decisionCandidateSummary", "approvalDecisionProduced"]),
    Object.freeze(["dispositionSummary", "approvalDecisionProduced"]),
    Object.freeze(["aggregationSummary", "approvalDecisionProduced"])
  ]);

const REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_APPROVAL_DECISION_NULL_PATHS =
  Object.freeze([Object.freeze(["approvalDecisionId"])]);

const REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_APPROVAL_DECISION_TRUE_FIELDS =
  Object.freeze([
    "approvalDecision",
    "approvalDecisionResult",
    "approvalDecisionGranted",
    "approvalDecisionAccepted",
    "approvalDecisionAuthorized",
    "aggregationInspectionHandoffIsApprovalDecision"
  ]);

const REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_APPROVAL_GRANT_FALSE_PATHS =
  Object.freeze([
    Object.freeze(["aggregationCheckpointIsApprovalGrant"]),
    Object.freeze(["approvalGrantProduced"]),
    Object.freeze(["approvalGrantPersisted"]),
    Object.freeze(["sourceDispositionState", "dispositionStateIsApprovalGrant"]),
    Object.freeze(["sourceDispositionState", "approvalGrantProduced"]),
    Object.freeze(["sourceDispositionState", "approvalGrantPersisted"]),
    Object.freeze(["integratedReviewSummary", "reviewSummaryIsApprovalGrant"]),
    Object.freeze(["integratedReviewSummary", "approvalGrantProduced"]),
    Object.freeze(["integratedReviewSummary", "approvalGrantPersisted"]),
    Object.freeze(["inspectionSummary", "approvalGrantProduced"]),
    Object.freeze(["decisionCandidateSummary", "approvalGrantProduced"]),
    Object.freeze(["dispositionSummary", "approvalGrantProduced"]),
    Object.freeze(["aggregationSummary", "approvalGrantProduced"])
  ]);

const REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_APPROVAL_GRANT_NULL_PATHS =
  Object.freeze([
    Object.freeze(["approvalGrantId"]),
    Object.freeze(["integratedReviewSummary", "approvalGrantId"])
  ]);

const REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_APPROVAL_GRANT_TRUE_PATHS =
  Object.freeze([
    Object.freeze(["approvalGrant", "produced"]),
    Object.freeze(["approvalGrant", "persisted"])
  ]);

const REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_GENERIC_GRANT_TRUE_FIELDS =
  Object.freeze([
    "grantProduced",
    "grantPersisted",
    "grantCreated",
    "grantIssued",
    "grantAuthorized",
    "grantAccepted",
    "runtimeGrantProduced",
    "permissionGrantProduced"
  ]);

const REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_EVALUATOR_EXECUTION_TRUE_FIELDS =
  Object.freeze([
    "evaluatorExecutionRequested",
    "evaluatorExecutionStarted",
    "evaluatorExecutionEnabled",
    "evaluatorExecutionPerformed",
    "evaluatorExecuted"
  ]);

const REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_REVIEWER_ROUTING_FIELDS =
  Object.freeze([
    "reviewerRouting",
    "reviewerRoute",
    "reviewerQueue",
    "reviewerAssignment",
    "assignedReviewer",
    "assignedReviewers",
    "routing",
    "routingDecision",
    "routingResult",
    "routeReviewer",
    "reviewerRoutingPermissionGranted"
  ]);

function reviewOnlyAggregationInspectionHandoffUnexpectedUnsafeField(
  value,
  seen = new Set()
) {
  if (Array.isArray(value)) {
    return value.some((entry) =>
      reviewOnlyAggregationInspectionHandoffUnexpectedUnsafeField(entry, seen)
    );
  }

  if (!isPlainObjectRecord(value) || seen.has(value)) {
    return false;
  }

  seen.add(value);

  return Object.entries(value).some(
    ([key, entry]) =>
      (!REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_ALLOWED_FIELDS.has(key) &&
        APPROVAL_EVALUATOR_CANDIDATE_UNSAFE_TRUE_FIELD_PATTERN.test(key)) ||
      reviewOnlyAggregationInspectionHandoffUnexpectedUnsafeField(entry, seen)
  );
}

function reviewOnlyAggregationInspectionHandoffKeyPresent(
  value,
  keys,
  seen = new Set()
) {
  if (Array.isArray(value)) {
    return value.some((entry) =>
      reviewOnlyAggregationInspectionHandoffKeyPresent(entry, keys, seen)
    );
  }

  if (!isPlainObjectRecord(value) || seen.has(value)) {
    return false;
  }

  seen.add(value);

  return Object.entries(value).some(
    ([key, entry]) =>
      keys.includes(key) ||
      reviewOnlyAggregationInspectionHandoffKeyPresent(entry, keys, seen)
  );
}

function reviewOnlyAggregationInspectionHandoffUnknown(aggregationState) {
  return (
    (typeof aggregationState.schema === "string" &&
      aggregationState.schema !== REVIEW_ONLY_DISPOSITION_AGGREGATION_STATE_SCHEMA) ||
    (typeof aggregationState.stateKind === "string" &&
      aggregationState.stateKind !== "review-only-disposition-aggregation-state")
  );
}

function reviewOnlyAggregationInspectionHandoffRevoked(aggregationState) {
  return (
    aggregationState.revoked === true ||
    (isPlainObjectRecord(aggregationState.revocation) &&
      aggregationState.revocation.revoked === true)
  );
}

function reviewOnlyAggregationInspectionHandoffStale(aggregationState) {
  return (
    isUtcIsoTimestampWithMilliseconds(aggregationState.reviewedAt) &&
    aggregationState.reviewedAt <
      REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_MIN_REVIEWED_AT
  );
}

const REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_MALFORMED_CHECKS =
  Object.freeze([
    (aggregationState) =>
      !recordHasExactFields(
        aggregationState,
        REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_SOURCE_STATE_FIELDS
      ),
    (aggregationState) =>
      !recordPassesChecks(
        aggregationState,
        REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_SOURCE_STATE_CHECKS
      ),
    (aggregationState) =>
      !recordHasExactFields(
        aggregationState.sourceDispositionState,
        REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_SOURCE_DISPOSITION_FIELDS
      ),
    (aggregationState) =>
      !recordPassesChecks(
        aggregationState.sourceDispositionState,
        REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_SOURCE_DISPOSITION_CHECKS
      ),
    (aggregationState) =>
      !recordHasExactFields(
        aggregationState.pipelineSummary,
        NON_AUTHORIZING_EVALUATOR_DECISION_PIPELINE_SUMMARY_FIELDS
      ),
    (aggregationState) =>
      !recordPassesChecks(
        aggregationState.pipelineSummary,
        PREREQUISITE_REVIEW_ARTIFACT_PIPELINE_CHECKS
      ),
    (aggregationState) =>
      !recordHasExactFields(
        aggregationState.integratedReviewSummary,
        NON_AUTHORIZING_EVALUATOR_DECISION_INTEGRATED_SUMMARY_FIELDS
      ),
    (aggregationState) =>
      !recordPassesChecks(
        aggregationState.integratedReviewSummary,
        PREREQUISITE_REVIEW_ARTIFACT_SUMMARY_CHECKS
      ),
    (aggregationState) =>
      !recordHasExactFields(
        aggregationState.decisionCandidateSummary,
        NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_SUMMARY_FIELDS
      ),
    (aggregationState) =>
      !recordPassesChecks(
        aggregationState.decisionCandidateSummary,
        NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_SUMMARY_CHECKS
      ),
    (aggregationState) =>
      !recordHasExactFields(
        aggregationState.inspectionSummary,
        HUMAN_TOOL_INSPECTION_DISPOSITION_INSPECTION_SUMMARY_FIELDS
      ),
    (aggregationState) =>
      !recordPassesChecks(
        aggregationState.inspectionSummary,
        HUMAN_TOOL_INSPECTION_DISPOSITION_INSPECTION_SUMMARY_CHECKS
      ),
    (aggregationState) =>
      !recordHasExactFields(
        aggregationState.dispositionSummary,
        REVIEW_ONLY_DISPOSITION_AGGREGATION_DISPOSITION_SUMMARY_FIELDS
      ),
    (aggregationState) =>
      !recordPassesChecks(
        aggregationState.dispositionSummary,
        REVIEW_ONLY_DISPOSITION_AGGREGATION_DISPOSITION_SUMMARY_CHECKS
      ),
    (aggregationState) =>
      !recordHasExactFields(
        aggregationState.aggregationSummary,
        REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_AGGREGATION_SUMMARY_FIELDS
      ),
    (aggregationState) =>
      !recordPassesChecks(
        aggregationState.aggregationSummary,
        REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_AGGREGATION_SUMMARY_CHECKS
      ),
    (aggregationState) =>
      !recordPassesChecks(
        aggregationState,
        REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_REQUIRED_FALSE_FIELDS.map(
          (field) => [field, (value) => value === false]
        )
      ),
    (aggregationState) =>
      !recordPassesChecks(
        aggregationState,
        REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_REQUIRED_NULL_FIELDS.map(
          (field) => [field, (value) => value === null]
        )
      ),
    (aggregationState) =>
      !reviewOnlyRuntimeEffectAllFalse(aggregationState.runtimeEffect)
  ]);

function reviewOnlyAggregationInspectionHandoffMalformed(aggregationState) {
  return REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_MALFORMED_CHECKS.some(
    (predicate) => predicate(aggregationState)
  );
}

function reviewOnlyAggregationInspectionHandoffGrantLooking(aggregationState) {
  return approvalEvaluatorCandidateNestedTrueClaim(
    aggregationState,
    (key) =>
      REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_GENERIC_GRANT_TRUE_FIELDS.includes(
        key
      )
  );
}

function reviewOnlyAggregationInspectionHandoffApprovalDecisionLooking(
  aggregationState
) {
  return (
    REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_APPROVAL_DECISION_FALSE_PATHS.some(
      (path) =>
        reviewOnlyEvaluatorPreflightPathDoesNotMatch(
          aggregationState,
          path,
          false
        )
    ) ||
    REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_APPROVAL_DECISION_NULL_PATHS.some(
      (path) =>
        reviewOnlyEvaluatorPreflightPathDoesNotMatch(
          aggregationState,
          path,
          null
        )
    ) ||
    reviewOnlyAggregationInspectionHandoffKeyPresent(
      aggregationState,
      REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_APPROVAL_DECISION_TRUE_FIELDS
    )
  );
}

function reviewOnlyAggregationInspectionHandoffApprovalGrantLooking(
  aggregationState
) {
  return (
    REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_APPROVAL_GRANT_FALSE_PATHS.some(
      (path) =>
        reviewOnlyEvaluatorPreflightPathDoesNotMatch(
          aggregationState,
          path,
          false
        )
    ) ||
    REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_APPROVAL_GRANT_NULL_PATHS.some(
      (path) =>
        reviewOnlyEvaluatorPreflightPathDoesNotMatch(
          aggregationState,
          path,
          null
        )
    ) ||
    REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_APPROVAL_GRANT_TRUE_PATHS.some(
      (path) =>
        reviewOnlyEvaluatorPreflightPathValue(aggregationState, path) === true
    )
  );
}

function reviewOnlyAggregationInspectionHandoffEvaluatorResultLooking(
  aggregationState
) {
  return (
    REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_EVALUATOR_RESULT_FALSE_PATHS.some(
      (path) =>
        reviewOnlyEvaluatorPreflightPathDoesNotMatch(
          aggregationState,
          path,
          false
        )
    ) ||
    REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_EVALUATOR_RESULT_NULL_PATHS.some(
      (path) =>
        reviewOnlyEvaluatorPreflightPathDoesNotMatch(
          aggregationState,
          path,
          null
        )
    ) ||
    reviewOnlyAggregationInspectionHandoffKeyPresent(
      aggregationState,
      REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_EVALUATOR_RESULT_OBJECT_FIELDS
    )
  );
}

function reviewOnlyAggregationInspectionHandoffEvaluatorExecutionLooking(
  aggregationState
) {
  return approvalEvaluatorCandidateNestedTrueClaim(
    aggregationState,
    (key) =>
      REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_EVALUATOR_EXECUTION_TRUE_FIELDS.includes(
        key
      )
  );
}

function reviewOnlyAggregationInspectionHandoffReviewerRoutingLooking(
  aggregationState
) {
  return reviewOnlyAggregationInspectionHandoffKeyPresent(
    aggregationState,
    REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_REVIEWER_ROUTING_FIELDS
  );
}

function reviewOnlyAggregationInspectionHandoffRuntimePermissionLooking(
  aggregationState
) {
  return approvalEvaluatorCandidateNestedTrueClaim(
    aggregationState,
    (key) =>
      REVIEW_ONLY_EVALUATOR_PREFLIGHT_RUNTIME_PERMISSION_TRUE_FIELDS.includes(key)
  );
}

function reviewOnlyAggregationInspectionHandoffCommandExposureLooking(
  aggregationState
) {
  return approvalEvaluatorCandidateNestedTrueClaim(
    aggregationState,
    (key) =>
      REVIEW_ONLY_EVALUATOR_PREFLIGHT_COMMAND_EXPOSURE_TRUE_FIELDS.includes(key)
  );
}

function reviewOnlyAggregationInspectionHandoffRuntimeEffectTrue(
  aggregationState
) {
  return approvalEvaluatorCandidateRuntimeEffectTrue(aggregationState);
}

function reviewOnlyAggregationInspectionHandoffProcessFlagTrue(aggregationState) {
  return approvalEvaluatorCandidateNestedTrueClaim(
    aggregationState,
    (key) => APPROVAL_EVALUATOR_CANDIDATE_PROCESS_TRUE_FIELDS.includes(key)
  );
}

function reviewOnlyAggregationInspectionHandoffUnsafeTrueSurface(
  aggregationState
) {
  return approvalEvaluatorCandidateNestedTrueClaim(
    aggregationState,
    (key) => APPROVAL_EVALUATOR_CANDIDATE_UNSAFE_TRUE_FIELD_PATTERN.test(key)
  );
}

function reviewOnlyAggregationInspectionHandoffExecutionSignalLooking(
  aggregationState
) {
  return approvalEvaluatorCandidateNestedTrueClaim(
    aggregationState,
    (key) => REVIEW_ONLY_EVALUATOR_PREFLIGHT_EXECUTION_SIGNAL_TRUE_FIELDS.includes(key)
  );
}

function reviewOnlyAggregationInspectionHandoffAuthorizing(aggregationState) {
  return approvalEvaluatorCandidateNestedTrueClaim(
    aggregationState,
    (key) =>
      REVIEW_ONLY_EVALUATOR_PREFLIGHT_AUTHORITATIVE_TRUE_FIELDS.includes(key)
  );
}

const REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_SINGLE_REJECTION_CHECKS =
  Object.freeze([
    [
      (aggregationState) => !isPlainObjectRecord(aggregationState),
      "malformed_review_only_aggregation_inspection_handoff_input_rejected"
    ],
    [
      reviewOnlyAggregationInspectionHandoffUnknown,
      "unknown_review_only_aggregation_inspection_handoff_input_rejected"
    ],
    [
      reviewOnlyAggregationInspectionHandoffRevoked,
      "revoked_review_only_aggregation_inspection_handoff_input_rejected"
    ],
    [
      reviewOnlyAggregationInspectionHandoffStale,
      "stale_review_only_aggregation_inspection_handoff_input_rejected"
    ],
    [
      reviewOnlyAggregationInspectionHandoffApprovalDecisionLooking,
      "approval_decision_looking_review_only_aggregation_inspection_handoff_input_rejected"
    ],
    [
      reviewOnlyAggregationInspectionHandoffUnexpectedUnsafeField,
      "unsafe_review_only_aggregation_inspection_handoff_input_rejected"
    ],
    [
      reviewOnlyAggregationInspectionHandoffGrantLooking,
      "grant_looking_review_only_aggregation_inspection_handoff_input_rejected"
    ],
    [
      reviewOnlyAggregationInspectionHandoffApprovalGrantLooking,
      "approval_grant_looking_review_only_aggregation_inspection_handoff_input_rejected"
    ],
    [
      reviewOnlyAggregationInspectionHandoffEvaluatorResultLooking,
      "evaluator_result_looking_review_only_aggregation_inspection_handoff_input_rejected"
    ],
    [
      reviewOnlyAggregationInspectionHandoffEvaluatorExecutionLooking,
      "evaluator_execution_looking_review_only_aggregation_inspection_handoff_input_rejected"
    ],
    [
      reviewOnlyAggregationInspectionHandoffReviewerRoutingLooking,
      "reviewer_routing_looking_review_only_aggregation_inspection_handoff_input_rejected"
    ],
    [
      reviewOnlyAggregationInspectionHandoffRuntimePermissionLooking,
      "runtime_permission_looking_review_only_aggregation_inspection_handoff_input_rejected"
    ],
    [
      reviewOnlyAggregationInspectionHandoffCommandExposureLooking,
      "command_exposure_looking_review_only_aggregation_inspection_handoff_input_rejected"
    ],
    [
      reviewOnlyAggregationInspectionHandoffRuntimeEffectTrue,
      "runtime_effect_true_review_only_aggregation_inspection_handoff_input_rejected"
    ],
    [
      reviewOnlyAggregationInspectionHandoffProcessFlagTrue,
      "process_flag_true_review_only_aggregation_inspection_handoff_input_rejected"
    ],
    [
      reviewOnlyAggregationInspectionHandoffUnsafeTrueSurface,
      "unsafe_review_only_aggregation_inspection_handoff_input_rejected"
    ],
    [
      reviewOnlyAggregationInspectionHandoffExecutionSignalLooking,
      "execution_signal_looking_review_only_aggregation_inspection_handoff_input_rejected"
    ],
    [
      reviewOnlyAggregationInspectionHandoffAuthorizing,
      "authorizing_review_only_aggregation_inspection_handoff_input_rejected"
    ],
    [
      reviewOnlyAggregationInspectionHandoffMalformed,
      "malformed_review_only_aggregation_inspection_handoff_input_rejected"
    ]
  ]);

function reviewOnlyAggregationInspectionHandoffSingleClassification(
  aggregationState
) {
  return (
    REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_SINGLE_REJECTION_CHECKS.find(
      ([predicate]) => predicate(aggregationState)
    )?.[1] ??
    VALID_REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_CLASSIFICATION
  );
}

function firstReviewOnlyAggregationInspectionHandoffRejection(
  aggregationStates
) {
  return (
    aggregationStates
      .map(reviewOnlyAggregationInspectionHandoffSingleClassification)
      .find(
        (classification) =>
          classification !==
          VALID_REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_CLASSIFICATION
      ) ?? null
  );
}

function reviewOnlyAggregationInspectionHandoffStatesContainDuplicate(
  aggregationStates
) {
  const digests = aggregationStates.map((aggregationState) =>
    reviewArtifactHandoffDigest(aggregationState)
  );

  return new Set(digests).size !== digests.length;
}

const REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_RESOLVERS = Object.freeze([
  (aggregationStates) =>
    aggregationStates === undefined
      ? "missing_review_only_aggregation_inspection_handoff_input_rejected"
      : null,
  (aggregationStates) =>
    !Array.isArray(aggregationStates)
      ? "malformed_review_only_aggregation_inspection_handoff_input_rejected"
      : null,
  (aggregationStates) =>
    aggregationStates.length === 0
      ? "empty_review_only_aggregation_inspection_handoff_input_rejected"
      : null,
  firstReviewOnlyAggregationInspectionHandoffRejection,
  (aggregationStates) =>
    reviewOnlyAggregationInspectionHandoffStatesContainDuplicate(
      aggregationStates
    )
      ? "duplicate_invalid_review_only_aggregation_inspection_handoff_input_rejected"
      : null,
  (aggregationStates) =>
    aggregationStates.length > 1
      ? "conflicting_review_only_aggregation_inspection_handoff_input_rejected"
      : null
]);

function reviewOnlyAggregationInspectionHandoffClassification(
  aggregationStates
) {
  let classification = null;

  REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_RESOLVERS.some((resolver) => {
    classification = resolver(aggregationStates);
    return classification !== null;
  });

  return (
    classification ??
    VALID_REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_CLASSIFICATION
  );
}

function reviewOnlyAggregationInspectionHandoffSummary() {
  return {
    handoffKind: "review-only-aggregation-inspection-handoff",
    handoffMode: "review-only",
    sourceAggregationClassification:
      VALID_REVIEW_ONLY_DISPOSITION_AGGREGATION_CLASSIFICATION,
    inspectionHandoffMetadataOnly: true,
    reviewerRoutingPerformed: false,
    evaluatorExecutionPerformed: false,
    evaluatorResultProduced: false,
    approvalDecisionProduced: false,
    approvalGrantProduced: false,
    runtimePermissionGranted: false,
    commandExposurePermissionGranted: false,
    evaluatorExecuted: false,
    runtimeEffectAllFalse: true
  };
}

function reviewOnlyAggregationInspectionHandoffStateFromAggregationState(
  aggregationState,
  reviewedAt
) {
  return {
    schema: REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_STATE_SCHEMA,
    schemaVersion: REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_VERSION,
    stateKind: "review-only-aggregation-inspection-handoff-state",
    stateMode: "review-only",
    reviewedAt,
    sourceAggregationState: {
      schema: aggregationState.schema,
      stateKind: aggregationState.stateKind,
      stateMode: aggregationState.stateMode,
      reviewedAt: aggregationState.reviewedAt,
      stateDigest: reviewArtifactHandoffDigest(aggregationState),
      sourceDispositionStateDigest:
        aggregationState.sourceDispositionState.stateDigest,
      sourceInspectionArtifactDigest:
        aggregationState.sourceDispositionState.sourceInspectionArtifactDigest,
      sourceDecisionCandidateStateDigest:
        aggregationState.sourceDispositionState.sourceDecisionCandidateStateDigest,
      sourcePreflightCheckpointStateDigest:
        aggregationState.sourceDispositionState
          .sourcePreflightCheckpointStateDigest,
      sourceIntakeCheckpointStateDigest:
        aggregationState.sourceDispositionState.sourceIntakeCheckpointStateDigest,
      sourceEvaluatorInputCandidateDigest:
        aggregationState.sourceDispositionState
          .sourceEvaluatorInputCandidateDigest,
      dispositionStateAccepted: true,
      aggregationMetadataOnly: true,
      aggregationCheckpointIsReviewerRouting: false,
      aggregationCheckpointIsApprovalDecision: false,
      aggregationCheckpointIsApprovalGrant: false,
      reviewerRoutingPerformed: false,
      evaluatorResultProduced: false,
      approvalDecisionProduced: false,
      approvalGrantProduced: false,
      approvalGrantPersisted: false,
      evaluatorExecuted: false,
      runtimeEffectAllFalse: true
    },
    pipelineSummary: reviewOnlyEvaluatorPreflightPipelineSummary(
      aggregationState.pipelineSummary
    ),
    integratedReviewSummary: reviewOnlyEvaluatorPreflightIntegratedSummary(
      aggregationState.integratedReviewSummary
    ),
    decisionCandidateSummary:
      nonAuthorizingEvaluatorDecisionCandidateSummary(),
    inspectionSummary:
      nonAuthorizingEvaluatorDecisionCandidateInspectionSummary(),
    dispositionSummary: humanToolInspectionDispositionSummary(),
    aggregationSummary: reviewOnlyDispositionAggregationSummary(),
    handoffSummary: reviewOnlyAggregationInspectionHandoffSummary(),
    aggregationStateAccepted: true,
    inspectionHandoffMetadataOnly: true,
    handoffIsReviewerRouting: false,
    handoffIsEvaluatorExecution: false,
    handoffIsEvaluatorResult: false,
    handoffIsApprovalDecision: false,
    handoffIsApprovalGrant: false,
    reviewerRoutingPerformed: false,
    reviewerRoutingEnabled: false,
    reviewerRouteId: null,
    evaluatorResultProduced: false,
    evaluatorResultPersisted: false,
    evaluatorResultId: null,
    approvalDecisionProduced: false,
    approvalDecisionPersisted: false,
    approvalDecisionId: null,
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

function reviewOnlyAggregationInspectionHandoffRejectionReasons({
  accepted,
  classification
}) {
  if (accepted) {
    return [
      "aggregation_inspection_handoff_is_review_only",
      "reviewer_routing_not_implemented",
      "evaluator_execution_not_implemented",
      "evaluator_result_not_implemented",
      "approval_decision_not_implemented",
      "approval_grant_not_implemented",
      "runtime_enablement_still_blocked"
    ];
  }

  return [
    classification,
    "aggregation_inspection_handoff_state_not_produced",
    "reviewer_routing_not_implemented",
    "evaluator_execution_not_implemented",
    "evaluator_result_not_implemented",
    "approval_decision_not_implemented",
    "approval_grant_not_implemented",
    "runtime_enablement_still_blocked"
  ];
}

function reviewOnlyAggregationInspectionHandoffInputRecord(input) {
  return isPlainObjectRecord(input) ? input : null;
}

function reviewOnlyAggregationInspectionHandoffReviewedAt(inputRecord) {
  if (
    inputRecord === null ||
    !Object.prototype.hasOwnProperty.call(inputRecord, "reviewedAt")
  ) {
    return APPROVAL_PREREQUISITE_SOURCE_PREFLIGHT_DEFAULT_REVIEWED_AT;
  }

  return isUtcIsoTimestampWithMilliseconds(inputRecord.reviewedAt)
    ? inputRecord.reviewedAt
    : APPROVAL_PREREQUISITE_SOURCE_PREFLIGHT_DEFAULT_REVIEWED_AT;
}

function reviewOnlyAggregationInspectionHandoffInputMalformed(inputRecord) {
  return (
    inputRecord === null ||
    (Object.prototype.hasOwnProperty.call(inputRecord, "reviewedAt") &&
      !isUtcIsoTimestampWithMilliseconds(inputRecord.reviewedAt))
  );
}

function reviewOnlyAggregationInspectionHandoffAggregationStates(inputRecord) {
  return inputRecord === null ? undefined : inputRecord.aggregationStates;
}

function reviewOnlyAggregationInspectionHandoffInputClassification(
  inputRecord,
  aggregationStates
) {
  return reviewOnlyAggregationInspectionHandoffInputMalformed(inputRecord)
    ? MALFORMED_REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_CLASSIFICATION
    : reviewOnlyAggregationInspectionHandoffClassification(aggregationStates);
}

function reviewOnlyAggregationInspectionHandoffSummaryFromAggregationState(
  aggregationState
) {
  return {
    schema: aggregationState.schema,
    stateKind: aggregationState.stateKind,
    stateMode: aggregationState.stateMode,
    reviewedAt: aggregationState.reviewedAt,
    stateDigest: reviewArtifactHandoffDigest(aggregationState),
    aggregationCheckpointIsReviewerRouting: false,
    aggregationCheckpointIsApprovalDecision: false,
    aggregationCheckpointIsApprovalGrant: false,
    reviewerRoutingPerformed: false,
    evaluatorResultProduced: false,
    approvalDecisionProduced: false,
    approvalGrantProduced: false,
    approvalGrantPersisted: false,
    evaluatorExecuted: false,
    runtimeEffectAllFalse: true
  };
}

function reviewOnlyAggregationInspectionHandoffAcceptedOutput({
  accepted,
  aggregationStates,
  reviewedAt
}) {
  if (!accepted) {
    return {
      inspectionHandoffState: null,
      aggregationSummary: null
    };
  }

  const aggregationState = aggregationStates[0];

  return {
    inspectionHandoffState:
      reviewOnlyAggregationInspectionHandoffStateFromAggregationState(
        aggregationState,
        reviewedAt
      ),
    aggregationSummary:
      reviewOnlyAggregationInspectionHandoffSummaryFromAggregationState(
        aggregationState
      )
  };
}

function reviewOnlyAggregationInspectionHandoffResult({
  reviewedAt,
  reviewedAtDefaulted,
  classification,
  accepted,
  inspectionHandoffState,
  aggregationSummary
}) {
  return {
    schema: REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_SCHEMA,
    schemaVersion: REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_VERSION,
    handoffKind: REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_KIND,
    handoffMode: "review-only",
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    aggregationStateAccepted: accepted,
    inspectionHandoffStateProduced: accepted,
    handoffIsReviewerRouting: false,
    handoffIsEvaluatorExecution: false,
    handoffIsEvaluatorResult: false,
    handoffIsApprovalDecision: false,
    handoffIsApprovalGrant: false,
    inspectionHandoffState,
    aggregationSummary,
    reviewOnly: true,
    authoritative: false,
    reviewArtifactOnly: true,
    inspectionHandoffMetadataOnly: true,
    reviewerRoutingPerformed: false,
    reviewerRoutingEnabled: false,
    reviewerRouteId: null,
    evaluatorResultProduced: false,
    evaluatorResultPersisted: false,
    evaluatorResultId: null,
    approvalDecisionProduced: false,
    approvalDecisionPersisted: false,
    approvalDecisionId: null,
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
    rejectionReasons: reviewOnlyAggregationInspectionHandoffRejectionReasons({
      accepted,
      classification
    }),
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

export function createReviewOnlyAggregationInspectionHandoffForReview(
  input = {}
) {
  const inputRecord = reviewOnlyAggregationInspectionHandoffInputRecord(input);
  const reviewedAt =
    reviewOnlyAggregationInspectionHandoffReviewedAt(inputRecord);
  const reviewedAtDefaulted = isReviewedAtDefaulted(inputRecord);
  const aggregationStates =
    reviewOnlyAggregationInspectionHandoffAggregationStates(inputRecord);
  const classification =
    reviewOnlyAggregationInspectionHandoffInputClassification(
      inputRecord,
      aggregationStates
    );
  const accepted =
    classification ===
    VALID_REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_CLASSIFICATION;
  const { inspectionHandoffState, aggregationSummary } =
    reviewOnlyAggregationInspectionHandoffAcceptedOutput({
      accepted,
      aggregationStates,
      reviewedAt
    });

  return reviewOnlyAggregationInspectionHandoffResult({
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    accepted,
    inspectionHandoffState,
    aggregationSummary
  });
}

const REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_STATE_SCHEMA =
  "ardyn.phase-5.34.review-only-handoff-readiness-artifact-state";

const REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_MIN_REVIEWED_AT =
  "2026-06-16T00:00:00.000Z";

const VALID_REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_CLASSIFICATION =
  "valid_review_only_handoff_readiness_artifact_runtime_still_blocked";
const REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_REQUIRED_FALSE_FIELDS =
  Object.freeze([
    "handoffIsReviewerRouting",
    "handoffIsEvaluatorExecution",
    "handoffIsEvaluatorResult",
    "handoffIsApprovalDecision",
    "handoffIsApprovalGrant",
    "reviewerRoutingPerformed",
    "reviewerRoutingEnabled",
    "evaluatorResultProduced",
    "evaluatorResultPersisted",
    "approvalDecisionProduced",
    "approvalDecisionPersisted",
    "approvalGrantProduced",
    "approvalGrantPersisted",
    "runtimePermissionGranted",
    "commandExposurePermissionGranted",
    "runtimeCommandExposureEnabled",
    "runtimeExecutionEnabled",
    "evaluatorExecutionRequested",
    "evaluatorExecutionStarted",
    "evaluatorExecutionEnabled",
    "evaluatorExecuted"
  ]);

const REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_REQUIRED_NULL_FIELDS =
  Object.freeze([
    "reviewerRouteId",
    "evaluatorResultId",
    "approvalDecisionId",
    "approvalGrantId"
  ]);

const REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_SOURCE_STATE_FIELDS =
  Object.freeze([
    "schema",
    "schemaVersion",
    "stateKind",
    "stateMode",
    "reviewedAt",
    "sourceAggregationState",
    "pipelineSummary",
    "integratedReviewSummary",
    "decisionCandidateSummary",
    "inspectionSummary",
    "dispositionSummary",
    "aggregationSummary",
    "handoffSummary",
    "aggregationStateAccepted",
    "inspectionHandoffMetadataOnly",
    "handoffIsReviewerRouting",
    "handoffIsEvaluatorExecution",
    "handoffIsEvaluatorResult",
    "handoffIsApprovalDecision",
    "handoffIsApprovalGrant",
    "reviewerRoutingPerformed",
    "reviewerRoutingEnabled",
    "reviewerRouteId",
    "evaluatorResultProduced",
    "evaluatorResultPersisted",
    "evaluatorResultId",
    "approvalDecisionProduced",
    "approvalDecisionPersisted",
    "approvalDecisionId",
    "approvalGrantProduced",
    "approvalGrantPersisted",
    "approvalGrantId",
    "runtimePermissionGranted",
    "commandExposurePermissionGranted",
    "runtimeCommandExposureEnabled",
    "runtimeExecutionEnabled",
    "evaluatorExecutionRequested",
    "evaluatorExecutionStarted",
    "evaluatorExecutionEnabled",
    "evaluatorExecuted",
    "runtimeEffect"
  ]);

const REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_SOURCE_AGGREGATION_FIELDS =
  Object.freeze([
    "schema",
    "stateKind",
    "stateMode",
    "reviewedAt",
    "stateDigest",
    "sourceDispositionStateDigest",
    "sourceInspectionArtifactDigest",
    "sourceDecisionCandidateStateDigest",
    "sourcePreflightCheckpointStateDigest",
    "sourceIntakeCheckpointStateDigest",
    "sourceEvaluatorInputCandidateDigest",
    "dispositionStateAccepted",
    "aggregationMetadataOnly",
    "aggregationCheckpointIsReviewerRouting",
    "aggregationCheckpointIsApprovalDecision",
    "aggregationCheckpointIsApprovalGrant",
    "reviewerRoutingPerformed",
    "evaluatorResultProduced",
    "approvalDecisionProduced",
    "approvalGrantProduced",
    "approvalGrantPersisted",
    "evaluatorExecuted",
    "runtimeEffectAllFalse"
  ]);

const REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_HANDOFF_SUMMARY_FIELDS =
  Object.freeze([
    "handoffKind",
    "handoffMode",
    "sourceAggregationClassification",
    "inspectionHandoffMetadataOnly",
    "reviewerRoutingPerformed",
    "evaluatorExecutionPerformed",
    "evaluatorResultProduced",
    "approvalDecisionProduced",
    "approvalGrantProduced",
    "runtimePermissionGranted",
    "commandExposurePermissionGranted",
    "evaluatorExecuted",
    "runtimeEffectAllFalse"
  ]);

const REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_ALLOWED_FIELDS = new Set([
  ...REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_SOURCE_STATE_FIELDS,
  ...REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_SOURCE_AGGREGATION_FIELDS,
  ...REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_HANDOFF_SUMMARY_FIELDS,
  ...REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_AGGREGATION_SUMMARY_FIELDS,
  ...HUMAN_TOOL_INSPECTION_DISPOSITION_INSPECTION_SUMMARY_FIELDS,
  ...REVIEW_ONLY_DISPOSITION_AGGREGATION_DISPOSITION_SUMMARY_FIELDS,
  ...NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_SUMMARY_FIELDS,
  ...NON_AUTHORIZING_EVALUATOR_DECISION_PIPELINE_SUMMARY_FIELDS,
  ...NON_AUTHORIZING_EVALUATOR_DECISION_INTEGRATED_SUMMARY_FIELDS
]);

const REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_SOURCE_STATE_CHECKS =
  Object.freeze([
    [
      "schema",
      (value) => value === REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_STATE_SCHEMA
    ],
    [
      "schemaVersion",
      (value) => value === REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_VERSION
    ],
    [
      "stateKind",
      (value) => value === "review-only-aggregation-inspection-handoff-state"
    ],
    ["stateMode", (value) => value === "review-only"],
    ["reviewedAt", isUtcIsoTimestampWithMilliseconds],
    ["sourceAggregationState", isPlainObjectRecord],
    ["pipelineSummary", isPlainObjectRecord],
    ["integratedReviewSummary", isPlainObjectRecord],
    ["decisionCandidateSummary", isPlainObjectRecord],
    ["inspectionSummary", isPlainObjectRecord],
    ["dispositionSummary", isPlainObjectRecord],
    ["aggregationSummary", isPlainObjectRecord],
    ["handoffSummary", isPlainObjectRecord],
    ["aggregationStateAccepted", (value) => value === true],
    ["inspectionHandoffMetadataOnly", (value) => value === true],
    ["runtimeEffect", isPlainObjectRecord]
  ]);

const REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_SOURCE_AGGREGATION_CHECKS =
  Object.freeze([
    ["schema", (value) => value === REVIEW_ONLY_DISPOSITION_AGGREGATION_STATE_SCHEMA],
    [
      "stateKind",
      (value) => value === "review-only-disposition-aggregation-state"
    ],
    ["stateMode", (value) => value === "review-only"],
    ["reviewedAt", isUtcIsoTimestampWithMilliseconds],
    [
      "stateDigest",
      (value) =>
        typeof value === "string" && /^sha256:[0-9a-f]{64}$/.test(value)
    ],
    [
      "sourceDispositionStateDigest",
      (value) =>
        typeof value === "string" && /^sha256:[0-9a-f]{64}$/.test(value)
    ],
    [
      "sourceInspectionArtifactDigest",
      (value) =>
        typeof value === "string" && /^sha256:[0-9a-f]{64}$/.test(value)
    ],
    [
      "sourceDecisionCandidateStateDigest",
      (value) =>
        typeof value === "string" && /^sha256:[0-9a-f]{64}$/.test(value)
    ],
    [
      "sourcePreflightCheckpointStateDigest",
      (value) =>
        typeof value === "string" && /^sha256:[0-9a-f]{64}$/.test(value)
    ],
    [
      "sourceIntakeCheckpointStateDigest",
      (value) =>
        typeof value === "string" && /^sha256:[0-9a-f]{64}$/.test(value)
    ],
    [
      "sourceEvaluatorInputCandidateDigest",
      (value) =>
        typeof value === "string" && /^sha256:[0-9a-f]{64}$/.test(value)
    ],
    ["dispositionStateAccepted", (value) => value === true],
    ["aggregationMetadataOnly", (value) => value === true],
    ["aggregationCheckpointIsReviewerRouting", (value) => value === false],
    ["aggregationCheckpointIsApprovalDecision", (value) => value === false],
    ["aggregationCheckpointIsApprovalGrant", (value) => value === false],
    ["reviewerRoutingPerformed", (value) => value === false],
    ["evaluatorResultProduced", (value) => value === false],
    ["approvalDecisionProduced", (value) => value === false],
    ["approvalGrantProduced", (value) => value === false],
    ["approvalGrantPersisted", (value) => value === false],
    ["evaluatorExecuted", (value) => value === false],
    ["runtimeEffectAllFalse", (value) => value === true]
  ]);

const REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_HANDOFF_SUMMARY_CHECKS =
  Object.freeze([
    [
      "handoffKind",
      (value) => value === "review-only-aggregation-inspection-handoff"
    ],
    ["handoffMode", (value) => value === "review-only"],
    [
      "sourceAggregationClassification",
      (value) => value === VALID_REVIEW_ONLY_DISPOSITION_AGGREGATION_CLASSIFICATION
    ],
    ["inspectionHandoffMetadataOnly", (value) => value === true],
    ["reviewerRoutingPerformed", (value) => value === false],
    ["evaluatorExecutionPerformed", (value) => value === false],
    ["evaluatorResultProduced", (value) => value === false],
    ["approvalDecisionProduced", (value) => value === false],
    ["approvalGrantProduced", (value) => value === false],
    ["runtimePermissionGranted", (value) => value === false],
    ["commandExposurePermissionGranted", (value) => value === false],
    ["evaluatorExecuted", (value) => value === false],
    ["runtimeEffectAllFalse", (value) => value === true]
  ]);

const REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_EVALUATOR_RESULT_FALSE_PATHS =
  Object.freeze([
    Object.freeze(["handoffIsEvaluatorResult"]),
    Object.freeze(["evaluatorResultProduced"]),
    Object.freeze(["evaluatorResultPersisted"]),
    Object.freeze(["sourceAggregationState", "evaluatorResultProduced"]),
    Object.freeze(["aggregationSummary", "evaluatorResultProduced"]),
    Object.freeze(["inspectionSummary", "evaluatorResultProduced"]),
    Object.freeze(["dispositionSummary", "evaluatorResultProduced"]),
    Object.freeze(["handoffSummary", "evaluatorResultProduced"])
  ]);

const REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_EVALUATOR_RESULT_NULL_PATHS =
  Object.freeze([Object.freeze(["evaluatorResultId"])]);

const REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_EVALUATOR_RESULT_OBJECT_FIELDS =
  Object.freeze([
    "evaluatorResult",
    "evaluationResult",
    "evaluatorOutput",
    "evaluatorOutcome",
    "resultProduced"
  ]);

const REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_APPROVAL_DECISION_FALSE_PATHS =
  Object.freeze([
    Object.freeze(["handoffIsApprovalDecision"]),
    Object.freeze(["approvalDecisionProduced"]),
    Object.freeze(["approvalDecisionPersisted"]),
    Object.freeze(["sourceAggregationState", "aggregationCheckpointIsApprovalDecision"]),
    Object.freeze(["inspectionSummary", "approvalDecisionProduced"]),
    Object.freeze(["decisionCandidateSummary", "approvalDecisionProduced"]),
    Object.freeze(["dispositionSummary", "approvalDecisionProduced"]),
    Object.freeze(["aggregationSummary", "approvalDecisionProduced"]),
    Object.freeze(["handoffSummary", "approvalDecisionProduced"])
  ]);

const REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_APPROVAL_DECISION_NULL_PATHS =
  Object.freeze([Object.freeze(["approvalDecisionId"])]);

const REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_APPROVAL_DECISION_TRUE_FIELDS =
  Object.freeze([
    "approvalDecision",
    "approvalDecisionResult",
    "approvalDecisionGranted",
    "approvalDecisionAccepted",
    "approvalDecisionAuthorized",
    "handoffReadinessArtifactIsApprovalDecision"
  ]);

const REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_APPROVAL_GRANT_FALSE_PATHS =
  Object.freeze([
    Object.freeze(["handoffIsApprovalGrant"]),
    Object.freeze(["approvalGrantProduced"]),
    Object.freeze(["approvalGrantPersisted"]),
    Object.freeze(["sourceAggregationState", "aggregationCheckpointIsApprovalGrant"]),
    Object.freeze(["sourceAggregationState", "approvalGrantProduced"]),
    Object.freeze(["sourceAggregationState", "approvalGrantPersisted"]),
    Object.freeze(["integratedReviewSummary", "reviewSummaryIsApprovalGrant"]),
    Object.freeze(["integratedReviewSummary", "approvalGrantProduced"]),
    Object.freeze(["integratedReviewSummary", "approvalGrantPersisted"]),
    Object.freeze(["inspectionSummary", "approvalGrantProduced"]),
    Object.freeze(["decisionCandidateSummary", "approvalGrantProduced"]),
    Object.freeze(["dispositionSummary", "approvalGrantProduced"]),
    Object.freeze(["aggregationSummary", "approvalGrantProduced"]),
    Object.freeze(["handoffSummary", "approvalGrantProduced"])
  ]);

const REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_APPROVAL_GRANT_NULL_PATHS =
  Object.freeze([
    Object.freeze(["approvalGrantId"]),
    Object.freeze(["integratedReviewSummary", "approvalGrantId"])
  ]);

const REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_APPROVAL_GRANT_TRUE_PATHS =
  Object.freeze([
    Object.freeze(["approvalGrant", "produced"]),
    Object.freeze(["approvalGrant", "persisted"])
  ]);

const REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_GENERIC_GRANT_TRUE_FIELDS =
  Object.freeze([
    "grantProduced",
    "grantPersisted",
    "grantCreated",
    "grantIssued",
    "grantAuthorized",
    "grantAccepted",
    "runtimeGrantProduced",
    "permissionGrantProduced"
  ]);

const REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_EVALUATOR_EXECUTION_TRUE_FIELDS =
  Object.freeze([
    "evaluatorExecutionRequested",
    "evaluatorExecutionStarted",
    "evaluatorExecutionEnabled",
    "evaluatorExecutionPerformed",
    "evaluatorExecuted"
  ]);

const REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_REVIEWER_ROUTING_FIELDS =
  Object.freeze([
    "reviewerRouting",
    "reviewerRoute",
    "reviewerQueue",
    "routing",
    "routingDecision",
    "routingResult",
    "routeReviewer",
    "reviewerRoutingPermissionGranted"
  ]);

const REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_REVIEWER_ASSIGNMENT_FIELDS =
  Object.freeze([
    "reviewerAssignment",
    "reviewerAssignmentId",
    "reviewerAssignmentEnabled",
    "reviewerAssignmentPerformed",
    "reviewerAssigned",
    "reviewerAssignee",
    "assignedReviewer",
    "assignedReviewers",
    "reviewerId",
    "reviewerIds",
    "reviewerAllocation",
    "assignmentDecision",
    "humanReviewer",
    "toolReviewer",
    "reviewerAssignmentPermissionGranted"
  ]);

function reviewOnlyHandoffReadinessArtifactUnexpectedUnsafeField(
  value,
  seen = new Set()
) {
  if (Array.isArray(value)) {
    return value.some((entry) =>
      reviewOnlyHandoffReadinessArtifactUnexpectedUnsafeField(entry, seen)
    );
  }

  if (!isPlainObjectRecord(value) || seen.has(value)) {
    return false;
  }

  seen.add(value);

  return Object.entries(value).some(
    ([key, entry]) =>
      (!REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_ALLOWED_FIELDS.has(key) &&
        APPROVAL_EVALUATOR_CANDIDATE_UNSAFE_TRUE_FIELD_PATTERN.test(key)) ||
      reviewOnlyHandoffReadinessArtifactUnexpectedUnsafeField(entry, seen)
  );
}

function reviewOnlyHandoffReadinessArtifactKeyPresent(
  value,
  keys,
  seen = new Set()
) {
  if (Array.isArray(value)) {
    return value.some((entry) =>
      reviewOnlyHandoffReadinessArtifactKeyPresent(entry, keys, seen)
    );
  }

  if (!isPlainObjectRecord(value) || seen.has(value)) {
    return false;
  }

  seen.add(value);

  return Object.entries(value).some(
    ([key, entry]) =>
      keys.includes(key) ||
      reviewOnlyHandoffReadinessArtifactKeyPresent(entry, keys, seen)
  );
}

function reviewOnlyHandoffReadinessArtifactUnknown(handoffState) {
  return (
    (typeof handoffState.schema === "string" &&
      handoffState.schema !== REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_STATE_SCHEMA) ||
    (typeof handoffState.stateKind === "string" &&
      handoffState.stateKind !==
        "review-only-aggregation-inspection-handoff-state")
  );
}

function reviewOnlyHandoffReadinessArtifactRevoked(handoffState) {
  return (
    handoffState.revoked === true ||
    (isPlainObjectRecord(handoffState.revocation) &&
      handoffState.revocation.revoked === true)
  );
}

function reviewOnlyHandoffReadinessArtifactStale(handoffState) {
  return (
    isUtcIsoTimestampWithMilliseconds(handoffState.reviewedAt) &&
    handoffState.reviewedAt <
      REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_MIN_REVIEWED_AT
  );
}

const REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_MALFORMED_CHECKS =
  Object.freeze([
    (handoffState) =>
      !recordHasExactFields(
        handoffState,
        REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_SOURCE_STATE_FIELDS
      ),
    (handoffState) =>
      !recordPassesChecks(
        handoffState,
        REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_SOURCE_STATE_CHECKS
      ),
    (handoffState) =>
      !recordHasExactFields(
        handoffState.sourceAggregationState,
        REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_SOURCE_AGGREGATION_FIELDS
      ),
    (handoffState) =>
      !recordPassesChecks(
        handoffState.sourceAggregationState,
        REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_SOURCE_AGGREGATION_CHECKS
      ),
    (handoffState) =>
      !recordHasExactFields(
        handoffState.pipelineSummary,
        NON_AUTHORIZING_EVALUATOR_DECISION_PIPELINE_SUMMARY_FIELDS
      ),
    (handoffState) =>
      !recordPassesChecks(
        handoffState.pipelineSummary,
        PREREQUISITE_REVIEW_ARTIFACT_PIPELINE_CHECKS
      ),
    (handoffState) =>
      !recordHasExactFields(
        handoffState.integratedReviewSummary,
        NON_AUTHORIZING_EVALUATOR_DECISION_INTEGRATED_SUMMARY_FIELDS
      ),
    (handoffState) =>
      !recordPassesChecks(
        handoffState.integratedReviewSummary,
        PREREQUISITE_REVIEW_ARTIFACT_SUMMARY_CHECKS
      ),
    (handoffState) =>
      !recordHasExactFields(
        handoffState.decisionCandidateSummary,
        NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_SUMMARY_FIELDS
      ),
    (handoffState) =>
      !recordPassesChecks(
        handoffState.decisionCandidateSummary,
        NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_SUMMARY_CHECKS
      ),
    (handoffState) =>
      !recordHasExactFields(
        handoffState.inspectionSummary,
        HUMAN_TOOL_INSPECTION_DISPOSITION_INSPECTION_SUMMARY_FIELDS
      ),
    (handoffState) =>
      !recordPassesChecks(
        handoffState.inspectionSummary,
        HUMAN_TOOL_INSPECTION_DISPOSITION_INSPECTION_SUMMARY_CHECKS
      ),
    (handoffState) =>
      !recordHasExactFields(
        handoffState.dispositionSummary,
        REVIEW_ONLY_DISPOSITION_AGGREGATION_DISPOSITION_SUMMARY_FIELDS
      ),
    (handoffState) =>
      !recordPassesChecks(
        handoffState.dispositionSummary,
        REVIEW_ONLY_DISPOSITION_AGGREGATION_DISPOSITION_SUMMARY_CHECKS
      ),
    (handoffState) =>
      !recordHasExactFields(
        handoffState.aggregationSummary,
        REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_AGGREGATION_SUMMARY_FIELDS
      ),
    (handoffState) =>
      !recordPassesChecks(
        handoffState.aggregationSummary,
        REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_AGGREGATION_SUMMARY_CHECKS
      ),
    (handoffState) =>
      !recordHasExactFields(
        handoffState.handoffSummary,
        REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_HANDOFF_SUMMARY_FIELDS
      ),
    (handoffState) =>
      !recordPassesChecks(
        handoffState.handoffSummary,
        REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_HANDOFF_SUMMARY_CHECKS
      ),
    (handoffState) =>
      !recordPassesChecks(
        handoffState,
        REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_REQUIRED_FALSE_FIELDS.map(
          (field) => [field, (value) => value === false]
        )
      ),
    (handoffState) =>
      !recordPassesChecks(
        handoffState,
        REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_REQUIRED_NULL_FIELDS.map(
          (field) => [field, (value) => value === null]
        )
      ),
    (handoffState) => !reviewOnlyRuntimeEffectAllFalse(handoffState.runtimeEffect)
  ]);

function reviewOnlyHandoffReadinessArtifactMalformed(handoffState) {
  return REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_MALFORMED_CHECKS.some(
    (predicate) => predicate(handoffState)
  );
}

function reviewOnlyHandoffReadinessArtifactGrantLooking(handoffState) {
  return approvalEvaluatorCandidateNestedTrueClaim(
    handoffState,
    (key) =>
      REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_GENERIC_GRANT_TRUE_FIELDS.includes(
        key
      )
  );
}

function reviewOnlyHandoffReadinessArtifactApprovalDecisionLooking(
  handoffState
) {
  return (
    REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_APPROVAL_DECISION_FALSE_PATHS.some(
      (path) =>
        reviewOnlyEvaluatorPreflightPathDoesNotMatch(handoffState, path, false)
    ) ||
    REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_APPROVAL_DECISION_NULL_PATHS.some(
      (path) =>
        reviewOnlyEvaluatorPreflightPathDoesNotMatch(handoffState, path, null)
    ) ||
    reviewOnlyHandoffReadinessArtifactKeyPresent(
      handoffState,
      REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_APPROVAL_DECISION_TRUE_FIELDS
    )
  );
}

function reviewOnlyHandoffReadinessArtifactApprovalGrantLooking(handoffState) {
  return (
    REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_APPROVAL_GRANT_FALSE_PATHS.some(
      (path) =>
        reviewOnlyEvaluatorPreflightPathDoesNotMatch(handoffState, path, false)
    ) ||
    REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_APPROVAL_GRANT_NULL_PATHS.some(
      (path) =>
        reviewOnlyEvaluatorPreflightPathDoesNotMatch(handoffState, path, null)
    ) ||
    REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_APPROVAL_GRANT_TRUE_PATHS.some(
      (path) => reviewOnlyEvaluatorPreflightPathValue(handoffState, path) === true
    )
  );
}

function reviewOnlyHandoffReadinessArtifactEvaluatorResultLooking(handoffState) {
  return (
    REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_EVALUATOR_RESULT_FALSE_PATHS.some(
      (path) =>
        reviewOnlyEvaluatorPreflightPathDoesNotMatch(handoffState, path, false)
    ) ||
    REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_EVALUATOR_RESULT_NULL_PATHS.some(
      (path) =>
        reviewOnlyEvaluatorPreflightPathDoesNotMatch(handoffState, path, null)
    ) ||
    reviewOnlyHandoffReadinessArtifactKeyPresent(
      handoffState,
      REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_EVALUATOR_RESULT_OBJECT_FIELDS
    )
  );
}

function reviewOnlyHandoffReadinessArtifactEvaluatorExecutionLooking(
  handoffState
) {
  return approvalEvaluatorCandidateNestedTrueClaim(
    handoffState,
    (key) =>
      REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_EVALUATOR_EXECUTION_TRUE_FIELDS.includes(
        key
      )
  );
}

function reviewOnlyHandoffReadinessArtifactReviewerRoutingLooking(handoffState) {
  return [
    ...REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_REVIEWER_ROUTING_FALSE_PATHS.map(
      (path) =>
        reviewOnlyEvaluatorPreflightPathDoesNotMatch(handoffState, path, false)
    ),
    ...REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_REVIEWER_ROUTING_NULL_PATHS.map(
      (path) =>
        reviewOnlyEvaluatorPreflightPathDoesNotMatch(handoffState, path, null)
    ),
    reviewOnlyHandoffReadinessArtifactKeyPresent(
      handoffState,
      REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_REVIEWER_ROUTING_FIELDS
    )
  ].some(Boolean);
}

function reviewOnlyHandoffReadinessArtifactReviewerAssignmentLooking(
  handoffState
) {
  return reviewOnlyHandoffReadinessArtifactKeyPresent(
    handoffState,
    REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_REVIEWER_ASSIGNMENT_FIELDS
  );
}

function reviewOnlyHandoffReadinessArtifactRuntimePermissionLooking(
  handoffState
) {
  return approvalEvaluatorCandidateNestedTrueClaim(
    handoffState,
    (key) =>
      REVIEW_ONLY_EVALUATOR_PREFLIGHT_RUNTIME_PERMISSION_TRUE_FIELDS.includes(key)
  );
}

function reviewOnlyHandoffReadinessArtifactCommandExposureLooking(
  handoffState
) {
  return approvalEvaluatorCandidateNestedTrueClaim(
    handoffState,
    (key) =>
      REVIEW_ONLY_EVALUATOR_PREFLIGHT_COMMAND_EXPOSURE_TRUE_FIELDS.includes(key)
  );
}

function reviewOnlyHandoffReadinessArtifactRuntimeEffectTrue(handoffState) {
  return approvalEvaluatorCandidateRuntimeEffectTrue(handoffState);
}

function reviewOnlyHandoffReadinessArtifactProcessFlagTrue(handoffState) {
  return approvalEvaluatorCandidateNestedTrueClaim(
    handoffState,
    (key) => APPROVAL_EVALUATOR_CANDIDATE_PROCESS_TRUE_FIELDS.includes(key)
  );
}

function reviewOnlyHandoffReadinessArtifactUnsafeTrueSurface(handoffState) {
  return approvalEvaluatorCandidateNestedTrueClaim(
    handoffState,
    (key) => APPROVAL_EVALUATOR_CANDIDATE_UNSAFE_TRUE_FIELD_PATTERN.test(key)
  );
}

function reviewOnlyHandoffReadinessArtifactExecutionSignalLooking(handoffState) {
  return approvalEvaluatorCandidateNestedTrueClaim(
    handoffState,
    (key) => REVIEW_ONLY_EVALUATOR_PREFLIGHT_EXECUTION_SIGNAL_TRUE_FIELDS.includes(key)
  );
}

function reviewOnlyHandoffReadinessArtifactAuthorizing(handoffState) {
  return approvalEvaluatorCandidateNestedTrueClaim(
    handoffState,
    (key) =>
      REVIEW_ONLY_EVALUATOR_PREFLIGHT_AUTHORITATIVE_TRUE_FIELDS.includes(key)
  );
}

const REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_SINGLE_REJECTION_CHECKS =
  Object.freeze([
    [
      (handoffState) => !isPlainObjectRecord(handoffState),
      "malformed_review_only_handoff_readiness_artifact_input_rejected"
    ],
    [
      reviewOnlyHandoffReadinessArtifactUnknown,
      "unknown_review_only_handoff_readiness_artifact_input_rejected"
    ],
    [
      reviewOnlyHandoffReadinessArtifactRevoked,
      "revoked_review_only_handoff_readiness_artifact_input_rejected"
    ],
    [
      reviewOnlyHandoffReadinessArtifactStale,
      "stale_review_only_handoff_readiness_artifact_input_rejected"
    ],
    [
      reviewOnlyHandoffReadinessArtifactApprovalDecisionLooking,
      "approval_decision_looking_review_only_handoff_readiness_artifact_input_rejected"
    ],
    [
      reviewOnlyHandoffReadinessArtifactReviewerRoutingLooking,
      "reviewer_routing_looking_review_only_handoff_readiness_artifact_input_rejected"
    ],
    [
      reviewOnlyHandoffReadinessArtifactReviewerAssignmentLooking,
      "reviewer_assignment_looking_review_only_handoff_readiness_artifact_input_rejected"
    ],
    [
      reviewOnlyHandoffReadinessArtifactUnexpectedUnsafeField,
      "unsafe_review_only_handoff_readiness_artifact_input_rejected"
    ],
    [
      reviewOnlyHandoffReadinessArtifactGrantLooking,
      "grant_looking_review_only_handoff_readiness_artifact_input_rejected"
    ],
    [
      reviewOnlyHandoffReadinessArtifactApprovalGrantLooking,
      "approval_grant_looking_review_only_handoff_readiness_artifact_input_rejected"
    ],
    [
      reviewOnlyHandoffReadinessArtifactEvaluatorResultLooking,
      "evaluator_result_looking_review_only_handoff_readiness_artifact_input_rejected"
    ],
    [
      reviewOnlyHandoffReadinessArtifactEvaluatorExecutionLooking,
      "evaluator_execution_looking_review_only_handoff_readiness_artifact_input_rejected"
    ],
    [
      reviewOnlyHandoffReadinessArtifactRuntimePermissionLooking,
      "runtime_permission_looking_review_only_handoff_readiness_artifact_input_rejected"
    ],
    [
      reviewOnlyHandoffReadinessArtifactCommandExposureLooking,
      "command_exposure_looking_review_only_handoff_readiness_artifact_input_rejected"
    ],
    [
      reviewOnlyHandoffReadinessArtifactRuntimeEffectTrue,
      "runtime_effect_true_review_only_handoff_readiness_artifact_input_rejected"
    ],
    [
      reviewOnlyHandoffReadinessArtifactProcessFlagTrue,
      "process_flag_true_review_only_handoff_readiness_artifact_input_rejected"
    ],
    [
      reviewOnlyHandoffReadinessArtifactUnsafeTrueSurface,
      "unsafe_review_only_handoff_readiness_artifact_input_rejected"
    ],
    [
      reviewOnlyHandoffReadinessArtifactExecutionSignalLooking,
      "execution_signal_looking_review_only_handoff_readiness_artifact_input_rejected"
    ],
    [
      reviewOnlyHandoffReadinessArtifactAuthorizing,
      "authorizing_review_only_handoff_readiness_artifact_input_rejected"
    ],
    [
      reviewOnlyHandoffReadinessArtifactMalformed,
      "malformed_review_only_handoff_readiness_artifact_input_rejected"
    ]
  ]);

function reviewOnlyHandoffReadinessArtifactSingleClassification(handoffState) {
  return (
    REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_SINGLE_REJECTION_CHECKS.find(
      ([predicate]) => predicate(handoffState)
    )?.[1] ?? VALID_REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_CLASSIFICATION
  );
}

function firstReviewOnlyHandoffReadinessArtifactRejection(handoffStates) {
  return (
    handoffStates
      .map(reviewOnlyHandoffReadinessArtifactSingleClassification)
      .find(
        (classification) =>
          classification !==
          VALID_REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_CLASSIFICATION
      ) ?? null
  );
}

function reviewOnlyHandoffReadinessArtifactStatesContainDuplicate(
  handoffStates
) {
  const digests = handoffStates.map((handoffState) =>
    reviewArtifactHandoffDigest(handoffState)
  );

  return new Set(digests).size !== digests.length;
}

const REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_RESOLVERS = Object.freeze([
  (handoffStates) =>
    handoffStates === undefined
      ? "missing_review_only_handoff_readiness_artifact_input_rejected"
      : null,
  (handoffStates) =>
    !Array.isArray(handoffStates)
      ? "malformed_review_only_handoff_readiness_artifact_input_rejected"
      : null,
  (handoffStates) =>
    handoffStates.length === 0
      ? "empty_review_only_handoff_readiness_artifact_input_rejected"
      : null,
  firstReviewOnlyHandoffReadinessArtifactRejection,
  (handoffStates) =>
    reviewOnlyHandoffReadinessArtifactStatesContainDuplicate(handoffStates)
      ? "duplicate_invalid_review_only_handoff_readiness_artifact_input_rejected"
      : null,
  (handoffStates) =>
    handoffStates.length > 1
      ? "conflicting_review_only_handoff_readiness_artifact_input_rejected"
      : null
]);

function reviewOnlyHandoffReadinessArtifactClassification(handoffStates) {
  let classification = null;

  REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_RESOLVERS.some((resolver) => {
    classification = resolver(handoffStates);
    return classification !== null;
  });

  return (
    classification ?? VALID_REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_CLASSIFICATION
  );
}

function reviewOnlyHandoffReadinessSummary() {
  return {
    readinessKind: "review-only-handoff-readiness-artifact",
    readinessMode: "review-only",
    sourceHandoffClassification:
      VALID_REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_CLASSIFICATION,
    readinessArtifactMetadataOnly: true,
    reviewerRoutingPerformed: false,
    reviewerAssignmentPerformed: false,
    evaluatorExecutionPerformed: false,
    evaluatorResultProduced: false,
    approvalDecisionProduced: false,
    approvalGrantProduced: false,
    runtimePermissionGranted: false,
    commandExposurePermissionGranted: false,
    evaluatorExecuted: false,
    runtimeEffectAllFalse: true
  };
}

function reviewOnlyHandoffReadinessArtifactStateFromHandoffState(
  handoffState,
  reviewedAt
) {
  return {
    schema: REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_STATE_SCHEMA,
    schemaVersion: REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_VERSION,
    stateKind: "review-only-handoff-readiness-artifact-state",
    stateMode: "review-only",
    reviewedAt,
    sourceInspectionHandoffState: {
      schema: handoffState.schema,
      stateKind: handoffState.stateKind,
      stateMode: handoffState.stateMode,
      reviewedAt: handoffState.reviewedAt,
      stateDigest: reviewArtifactHandoffDigest(handoffState),
      sourceAggregationStateDigest: handoffState.sourceAggregationState.stateDigest,
      sourceDispositionStateDigest:
        handoffState.sourceAggregationState.sourceDispositionStateDigest,
      sourceInspectionArtifactDigest:
        handoffState.sourceAggregationState.sourceInspectionArtifactDigest,
      sourceDecisionCandidateStateDigest:
        handoffState.sourceAggregationState.sourceDecisionCandidateStateDigest,
      sourcePreflightCheckpointStateDigest:
        handoffState.sourceAggregationState.sourcePreflightCheckpointStateDigest,
      sourceIntakeCheckpointStateDigest:
        handoffState.sourceAggregationState.sourceIntakeCheckpointStateDigest,
      sourceEvaluatorInputCandidateDigest:
        handoffState.sourceAggregationState.sourceEvaluatorInputCandidateDigest,
      aggregationStateAccepted: true,
      inspectionHandoffMetadataOnly: true,
      handoffIsReviewerRouting: false,
      handoffIsEvaluatorExecution: false,
      handoffIsEvaluatorResult: false,
      handoffIsApprovalDecision: false,
      handoffIsApprovalGrant: false,
      reviewerRoutingPerformed: false,
      reviewerAssignmentPerformed: false,
      evaluatorResultProduced: false,
      approvalDecisionProduced: false,
      approvalGrantProduced: false,
      approvalGrantPersisted: false,
      evaluatorExecuted: false,
      runtimeEffectAllFalse: true
    },
    pipelineSummary: reviewOnlyEvaluatorPreflightPipelineSummary(
      handoffState.pipelineSummary
    ),
    integratedReviewSummary: reviewOnlyEvaluatorPreflightIntegratedSummary(
      handoffState.integratedReviewSummary
    ),
    decisionCandidateSummary:
      nonAuthorizingEvaluatorDecisionCandidateSummary(),
    inspectionSummary:
      nonAuthorizingEvaluatorDecisionCandidateInspectionSummary(),
    dispositionSummary: humanToolInspectionDispositionSummary(),
    aggregationSummary: reviewOnlyDispositionAggregationSummary(),
    handoffSummary: reviewOnlyAggregationInspectionHandoffSummary(),
    readinessSummary: reviewOnlyHandoffReadinessSummary(),
    handoffStateAccepted: true,
    readinessArtifactMetadataOnly: true,
    readinessArtifactIsReviewerRouting: false,
    readinessArtifactIsReviewerAssignment: false,
    readinessArtifactIsEvaluatorExecution: false,
    readinessArtifactIsEvaluatorResult: false,
    readinessArtifactIsApprovalDecision: false,
    readinessArtifactIsApprovalGrant: false,
    reviewerRoutingPerformed: false,
    reviewerRoutingEnabled: false,
    reviewerRouteId: null,
    reviewerAssignmentPerformed: false,
    reviewerAssignmentEnabled: false,
    reviewerAssignmentId: null,
    reviewerId: null,
    evaluatorResultProduced: false,
    evaluatorResultPersisted: false,
    evaluatorResultId: null,
    approvalDecisionProduced: false,
    approvalDecisionPersisted: false,
    approvalDecisionId: null,
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

function reviewOnlyHandoffReadinessArtifactRejectionReasons({
  accepted,
  classification
}) {
  if (accepted) {
    return [
      "handoff_readiness_artifact_is_review_only",
      "reviewer_routing_not_implemented",
      "reviewer_assignment_not_implemented",
      "evaluator_execution_not_implemented",
      "evaluator_result_not_implemented",
      "approval_decision_not_implemented",
      "approval_grant_not_implemented",
      "runtime_enablement_still_blocked"
    ];
  }

  return [
    classification,
    "handoff_readiness_artifact_not_produced",
    "reviewer_routing_not_implemented",
    "reviewer_assignment_not_implemented",
    "evaluator_execution_not_implemented",
    "evaluator_result_not_implemented",
    "approval_decision_not_implemented",
    "approval_grant_not_implemented",
    "runtime_enablement_still_blocked"
  ];
}

function reviewOnlyHandoffReadinessArtifactInputRecord(input) {
  return isPlainObjectRecord(input) ? input : null;
}

function reviewOnlyHandoffReadinessArtifactReviewedAt(inputRecord) {
  if (
    inputRecord === null ||
    !Object.prototype.hasOwnProperty.call(inputRecord, "reviewedAt")
  ) {
    return APPROVAL_PREREQUISITE_SOURCE_PREFLIGHT_DEFAULT_REVIEWED_AT;
  }

  return isUtcIsoTimestampWithMilliseconds(inputRecord.reviewedAt)
    ? inputRecord.reviewedAt
    : APPROVAL_PREREQUISITE_SOURCE_PREFLIGHT_DEFAULT_REVIEWED_AT;
}

function reviewOnlyHandoffReadinessArtifactInputMalformed(inputRecord) {
  return (
    inputRecord === null ||
    (Object.prototype.hasOwnProperty.call(inputRecord, "reviewedAt") &&
      !isUtcIsoTimestampWithMilliseconds(inputRecord.reviewedAt))
  );
}

function reviewOnlyHandoffReadinessArtifactHandoffStates(inputRecord) {
  return inputRecord === null ? undefined : inputRecord.handoffStates;
}

function reviewOnlyHandoffReadinessArtifactInputClassification(
  inputRecord,
  handoffStates
) {
  return reviewOnlyHandoffReadinessArtifactInputMalformed(inputRecord)
    ? MALFORMED_REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_CLASSIFICATION
    : reviewOnlyHandoffReadinessArtifactClassification(handoffStates);
}

function reviewOnlyHandoffReadinessArtifactSummaryFromHandoffState(
  handoffState
) {
  return {
    schema: handoffState.schema,
    stateKind: handoffState.stateKind,
    stateMode: handoffState.stateMode,
    reviewedAt: handoffState.reviewedAt,
    stateDigest: reviewArtifactHandoffDigest(handoffState),
    handoffIsReviewerRouting: false,
    handoffIsEvaluatorExecution: false,
    handoffIsEvaluatorResult: false,
    handoffIsApprovalDecision: false,
    handoffIsApprovalGrant: false,
    reviewerRoutingPerformed: false,
    reviewerAssignmentPerformed: false,
    evaluatorResultProduced: false,
    approvalDecisionProduced: false,
    approvalGrantProduced: false,
    approvalGrantPersisted: false,
    evaluatorExecuted: false,
    runtimeEffectAllFalse: true
  };
}

function reviewOnlyHandoffReadinessArtifactAcceptedOutput({
  accepted,
  handoffStates,
  reviewedAt
}) {
  if (!accepted) {
    return {
      readinessArtifact: null,
      handoffSummary: null
    };
  }

  const handoffState = handoffStates[0];

  return {
    readinessArtifact: reviewOnlyHandoffReadinessArtifactStateFromHandoffState(
      handoffState,
      reviewedAt
    ),
    handoffSummary:
      reviewOnlyHandoffReadinessArtifactSummaryFromHandoffState(handoffState)
  };
}

function reviewOnlyHandoffReadinessArtifactResult({
  reviewedAt,
  reviewedAtDefaulted,
  classification,
  accepted,
  readinessArtifact,
  handoffSummary
}) {
  return {
    schema: REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_SCHEMA,
    schemaVersion: REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_VERSION,
    artifactKind: REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_KIND,
    artifactMode: "review-only",
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    handoffStateAccepted: accepted,
    readinessArtifactProduced: accepted,
    readinessArtifactIsReviewerRouting: false,
    readinessArtifactIsReviewerAssignment: false,
    readinessArtifactIsEvaluatorExecution: false,
    readinessArtifactIsEvaluatorResult: false,
    readinessArtifactIsApprovalDecision: false,
    readinessArtifactIsApprovalGrant: false,
    readinessArtifact,
    handoffSummary,
    reviewOnly: true,
    authoritative: false,
    reviewArtifactOnly: true,
    readinessArtifactMetadataOnly: true,
    reviewerRoutingPerformed: false,
    reviewerRoutingEnabled: false,
    reviewerRouteId: null,
    reviewerAssignmentPerformed: false,
    reviewerAssignmentEnabled: false,
    reviewerAssignmentId: null,
    reviewerId: null,
    evaluatorResultProduced: false,
    evaluatorResultPersisted: false,
    evaluatorResultId: null,
    approvalDecisionProduced: false,
    approvalDecisionPersisted: false,
    approvalDecisionId: null,
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
    rejectionReasons: reviewOnlyHandoffReadinessArtifactRejectionReasons({
      accepted,
      classification
    }),
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

export function createReviewOnlyHandoffReadinessArtifactForReview(input = {}) {
  const inputRecord = reviewOnlyHandoffReadinessArtifactInputRecord(input);
  const reviewedAt = reviewOnlyHandoffReadinessArtifactReviewedAt(inputRecord);
  const reviewedAtDefaulted = isReviewedAtDefaulted(inputRecord);
  const handoffStates =
    reviewOnlyHandoffReadinessArtifactHandoffStates(inputRecord);
  const classification =
    reviewOnlyHandoffReadinessArtifactInputClassification(
      inputRecord,
      handoffStates
    );
  const accepted =
    classification ===
    VALID_REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_CLASSIFICATION;
  const { readinessArtifact, handoffSummary } =
    reviewOnlyHandoffReadinessArtifactAcceptedOutput({
      accepted,
      handoffStates,
      reviewedAt
    });

  return reviewOnlyHandoffReadinessArtifactResult({
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    accepted,
    readinessArtifact,
    handoffSummary
  });
}

const REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_STATE_SCHEMA =
  "ardyn.phase-5.35.review-only-readiness-inspection-checkpoint-state";

const REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_MIN_REVIEWED_AT =
  "2026-06-16T00:00:00.000Z";

const VALID_REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_CLASSIFICATION =
  "valid_review_only_readiness_inspection_checkpoint_runtime_still_blocked";
const REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_SOURCE_FIELDS = Object.freeze([
  "schema",
  "schemaVersion",
  "stateKind",
  "stateMode",
  "reviewedAt",
  "sourceInspectionHandoffState",
  "pipelineSummary",
  "integratedReviewSummary",
  "decisionCandidateSummary",
  "inspectionSummary",
  "dispositionSummary",
  "aggregationSummary",
  "handoffSummary",
  "readinessSummary",
  "handoffStateAccepted",
  "readinessArtifactMetadataOnly",
  "readinessArtifactIsReviewerRouting",
  "readinessArtifactIsReviewerAssignment",
  "readinessArtifactIsEvaluatorExecution",
  "readinessArtifactIsEvaluatorResult",
  "readinessArtifactIsApprovalDecision",
  "readinessArtifactIsApprovalGrant",
  "reviewerRoutingPerformed",
  "reviewerRoutingEnabled",
  "reviewerRouteId",
  "reviewerAssignmentPerformed",
  "reviewerAssignmentEnabled",
  "reviewerAssignmentId",
  "reviewerId",
  "evaluatorResultProduced",
  "evaluatorResultPersisted",
  "evaluatorResultId",
  "approvalDecisionProduced",
  "approvalDecisionPersisted",
  "approvalDecisionId",
  "approvalGrantProduced",
  "approvalGrantPersisted",
  "approvalGrantId",
  "runtimePermissionGranted",
  "commandExposurePermissionGranted",
  "runtimeCommandExposureEnabled",
  "runtimeExecutionEnabled",
  "evaluatorExecutionRequested",
  "evaluatorExecutionStarted",
  "evaluatorExecutionEnabled",
  "evaluatorExecuted",
  "runtimeEffect"
]);

const REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_SOURCE_HANDOFF_FIELDS =
  Object.freeze([
    "schema",
    "stateKind",
    "stateMode",
    "reviewedAt",
    "stateDigest",
    "sourceAggregationStateDigest",
    "sourceDispositionStateDigest",
    "sourceInspectionArtifactDigest",
    "sourceDecisionCandidateStateDigest",
    "sourcePreflightCheckpointStateDigest",
    "sourceIntakeCheckpointStateDigest",
    "sourceEvaluatorInputCandidateDigest",
    "aggregationStateAccepted",
    "inspectionHandoffMetadataOnly",
    "handoffIsReviewerRouting",
    "handoffIsEvaluatorExecution",
    "handoffIsEvaluatorResult",
    "handoffIsApprovalDecision",
    "handoffIsApprovalGrant",
    "reviewerRoutingPerformed",
    "reviewerAssignmentPerformed",
    "evaluatorResultProduced",
    "approvalDecisionProduced",
    "approvalGrantProduced",
    "approvalGrantPersisted",
    "evaluatorExecuted",
    "runtimeEffectAllFalse"
  ]);

const REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_READINESS_SUMMARY_FIELDS =
  Object.freeze([
    "readinessKind",
    "readinessMode",
    "sourceHandoffClassification",
    "readinessArtifactMetadataOnly",
    "reviewerRoutingPerformed",
    "reviewerAssignmentPerformed",
    "evaluatorExecutionPerformed",
    "evaluatorResultProduced",
    "approvalDecisionProduced",
    "approvalGrantProduced",
    "runtimePermissionGranted",
    "commandExposurePermissionGranted",
    "evaluatorExecuted",
    "runtimeEffectAllFalse"
  ]);

const REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_REQUIRED_FALSE_FIELDS =
  Object.freeze([
    "readinessArtifactIsReviewerRouting",
    "readinessArtifactIsReviewerAssignment",
    "readinessArtifactIsEvaluatorExecution",
    "readinessArtifactIsEvaluatorResult",
    "readinessArtifactIsApprovalDecision",
    "readinessArtifactIsApprovalGrant",
    "reviewerRoutingPerformed",
    "reviewerRoutingEnabled",
    "reviewerAssignmentPerformed",
    "reviewerAssignmentEnabled",
    "evaluatorResultProduced",
    "evaluatorResultPersisted",
    "approvalDecisionProduced",
    "approvalDecisionPersisted",
    "approvalGrantProduced",
    "approvalGrantPersisted",
    "runtimePermissionGranted",
    "commandExposurePermissionGranted",
    "runtimeCommandExposureEnabled",
    "runtimeExecutionEnabled",
    "evaluatorExecutionRequested",
    "evaluatorExecutionStarted",
    "evaluatorExecutionEnabled",
    "evaluatorExecuted"
  ]);

const REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_REQUIRED_NULL_FIELDS =
  Object.freeze([
    "reviewerRouteId",
    "reviewerAssignmentId",
    "reviewerId",
    "evaluatorResultId",
    "approvalDecisionId",
    "approvalGrantId"
  ]);

const REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_ALLOWED_FIELDS = new Set([
  ...REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_SOURCE_FIELDS,
  ...REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_SOURCE_HANDOFF_FIELDS,
  ...REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_READINESS_SUMMARY_FIELDS,
  ...REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_HANDOFF_SUMMARY_FIELDS,
  ...REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_AGGREGATION_SUMMARY_FIELDS,
  ...HUMAN_TOOL_INSPECTION_DISPOSITION_INSPECTION_SUMMARY_FIELDS,
  ...REVIEW_ONLY_DISPOSITION_AGGREGATION_DISPOSITION_SUMMARY_FIELDS,
  ...NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_SUMMARY_FIELDS,
  ...NON_AUTHORIZING_EVALUATOR_DECISION_PIPELINE_SUMMARY_FIELDS,
  ...NON_AUTHORIZING_EVALUATOR_DECISION_INTEGRATED_SUMMARY_FIELDS
]);

const REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_SOURCE_CHECKS = Object.freeze([
  ["schema", (value) => value === REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_STATE_SCHEMA],
  [
    "schemaVersion",
    (value) => value === REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_VERSION
  ],
  [
    "stateKind",
    (value) => value === "review-only-handoff-readiness-artifact-state"
  ],
  ["stateMode", (value) => value === "review-only"],
  ["reviewedAt", isUtcIsoTimestampWithMilliseconds],
  ["sourceInspectionHandoffState", isPlainObjectRecord],
  ["pipelineSummary", isPlainObjectRecord],
  ["integratedReviewSummary", isPlainObjectRecord],
  ["decisionCandidateSummary", isPlainObjectRecord],
  ["inspectionSummary", isPlainObjectRecord],
  ["dispositionSummary", isPlainObjectRecord],
  ["aggregationSummary", isPlainObjectRecord],
  ["handoffSummary", isPlainObjectRecord],
  ["readinessSummary", isPlainObjectRecord],
  ["handoffStateAccepted", (value) => value === true],
  ["readinessArtifactMetadataOnly", (value) => value === true],
  ["runtimeEffect", isPlainObjectRecord]
]);

const REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_SOURCE_HANDOFF_CHECKS =
  Object.freeze([
    [
      "schema",
      (value) => value === REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_STATE_SCHEMA
    ],
    [
      "stateKind",
      (value) => value === "review-only-aggregation-inspection-handoff-state"
    ],
    ["stateMode", (value) => value === "review-only"],
    ["reviewedAt", isUtcIsoTimestampWithMilliseconds],
    ["stateDigest", (value) => typeof value === "string" && /^sha256:[0-9a-f]{64}$/.test(value)],
    [
      "sourceAggregationStateDigest",
      (value) => typeof value === "string" && /^sha256:[0-9a-f]{64}$/.test(value)
    ],
    [
      "sourceDispositionStateDigest",
      (value) => typeof value === "string" && /^sha256:[0-9a-f]{64}$/.test(value)
    ],
    [
      "sourceInspectionArtifactDigest",
      (value) => typeof value === "string" && /^sha256:[0-9a-f]{64}$/.test(value)
    ],
    [
      "sourceDecisionCandidateStateDigest",
      (value) => typeof value === "string" && /^sha256:[0-9a-f]{64}$/.test(value)
    ],
    [
      "sourcePreflightCheckpointStateDigest",
      (value) => typeof value === "string" && /^sha256:[0-9a-f]{64}$/.test(value)
    ],
    [
      "sourceIntakeCheckpointStateDigest",
      (value) => typeof value === "string" && /^sha256:[0-9a-f]{64}$/.test(value)
    ],
    [
      "sourceEvaluatorInputCandidateDigest",
      (value) => typeof value === "string" && /^sha256:[0-9a-f]{64}$/.test(value)
    ],
    ["aggregationStateAccepted", (value) => value === true],
    ["inspectionHandoffMetadataOnly", (value) => value === true],
    ["handoffIsReviewerRouting", (value) => value === false],
    ["handoffIsEvaluatorExecution", (value) => value === false],
    ["handoffIsEvaluatorResult", (value) => value === false],
    ["handoffIsApprovalDecision", (value) => value === false],
    ["handoffIsApprovalGrant", (value) => value === false],
    ["reviewerRoutingPerformed", (value) => value === false],
    ["reviewerAssignmentPerformed", (value) => value === false],
    ["evaluatorResultProduced", (value) => value === false],
    ["approvalDecisionProduced", (value) => value === false],
    ["approvalGrantProduced", (value) => value === false],
    ["approvalGrantPersisted", (value) => value === false],
    ["evaluatorExecuted", (value) => value === false],
    ["runtimeEffectAllFalse", (value) => value === true]
  ]);

const REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_READINESS_SUMMARY_CHECKS =
  Object.freeze([
    [
      "readinessKind",
      (value) => value === "review-only-handoff-readiness-artifact"
    ],
    ["readinessMode", (value) => value === "review-only"],
    [
      "sourceHandoffClassification",
      (value) =>
        value === VALID_REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_CLASSIFICATION
    ],
    ["readinessArtifactMetadataOnly", (value) => value === true],
    ["reviewerRoutingPerformed", (value) => value === false],
    ["reviewerAssignmentPerformed", (value) => value === false],
    ["evaluatorExecutionPerformed", (value) => value === false],
    ["evaluatorResultProduced", (value) => value === false],
    ["approvalDecisionProduced", (value) => value === false],
    ["approvalGrantProduced", (value) => value === false],
    ["runtimePermissionGranted", (value) => value === false],
    ["commandExposurePermissionGranted", (value) => value === false],
    ["evaluatorExecuted", (value) => value === false],
    ["runtimeEffectAllFalse", (value) => value === true]
  ]);

const REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_FALSE_PATHS = Object.freeze({
  approvalDecision: [
    ["readinessArtifactIsApprovalDecision"],
    ["approvalDecisionProduced"],
    ["approvalDecisionPersisted"],
    ["sourceInspectionHandoffState", "handoffIsApprovalDecision"],
    ["inspectionSummary", "approvalDecisionProduced"],
    ["decisionCandidateSummary", "approvalDecisionProduced"],
    ["dispositionSummary", "approvalDecisionProduced"],
    ["aggregationSummary", "approvalDecisionProduced"],
    ["handoffSummary", "approvalDecisionProduced"],
    ["readinessSummary", "approvalDecisionProduced"]
  ],
  approvalGrant: [
    ["readinessArtifactIsApprovalGrant"],
    ["approvalGrantProduced"],
    ["approvalGrantPersisted"],
    ["sourceInspectionHandoffState", "handoffIsApprovalGrant"],
    ["sourceInspectionHandoffState", "approvalGrantProduced"],
    ["sourceInspectionHandoffState", "approvalGrantPersisted"],
    ["integratedReviewSummary", "reviewSummaryIsApprovalGrant"],
    ["integratedReviewSummary", "approvalGrantProduced"],
    ["integratedReviewSummary", "approvalGrantPersisted"],
    ["inspectionSummary", "approvalGrantProduced"],
    ["decisionCandidateSummary", "approvalGrantProduced"],
    ["dispositionSummary", "approvalGrantProduced"],
    ["aggregationSummary", "approvalGrantProduced"],
    ["handoffSummary", "approvalGrantProduced"],
    ["readinessSummary", "approvalGrantProduced"]
  ],
  evaluatorResult: [
    ["readinessArtifactIsEvaluatorResult"],
    ["evaluatorResultProduced"],
    ["evaluatorResultPersisted"],
    ["sourceInspectionHandoffState", "handoffIsEvaluatorResult"],
    ["sourceInspectionHandoffState", "evaluatorResultProduced"],
    ["readinessSummary", "evaluatorResultProduced"],
    ["aggregationSummary", "evaluatorResultProduced"],
    ["inspectionSummary", "evaluatorResultProduced"],
    ["dispositionSummary", "evaluatorResultProduced"],
    ["handoffSummary", "evaluatorResultProduced"]
  ],
  reviewerRouting: [
    ["readinessArtifactIsReviewerRouting"],
    ["reviewerRoutingPerformed"],
    ["reviewerRoutingEnabled"],
    ["sourceInspectionHandoffState", "handoffIsReviewerRouting"],
    ["sourceInspectionHandoffState", "reviewerRoutingPerformed"],
    ["readinessSummary", "reviewerRoutingPerformed"]
  ],
  reviewerAssignment: [
    ["readinessArtifactIsReviewerAssignment"],
    ["reviewerAssignmentPerformed"],
    ["reviewerAssignmentEnabled"],
    ["sourceInspectionHandoffState", "reviewerAssignmentPerformed"],
    ["readinessSummary", "reviewerAssignmentPerformed"]
  ]
});

const REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_NULL_PATHS = Object.freeze({
  approvalDecision: [["approvalDecisionId"]],
  approvalGrant: [["approvalGrantId"], ["integratedReviewSummary", "approvalGrantId"]],
  evaluatorResult: [["evaluatorResultId"]],
  reviewerRouting: [["reviewerRouteId"]],
  reviewerAssignment: [["reviewerAssignmentId"], ["reviewerId"]]
});

const REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_OBJECT_FIELD_GROUPS =
  Object.freeze({
    approvalDecision: [
      "approvalDecision",
      "approvalDecisionResult",
      "approvalDecisionGranted",
      "approvalDecisionAccepted",
      "approvalDecisionAuthorized",
      "readinessInspectionCheckpointIsApprovalDecision"
    ],
    evaluatorResult: [
      "evaluatorResult",
      "evaluationResult",
      "evaluatorOutput",
      "evaluatorOutcome",
      "resultProduced"
    ],
    reviewerRouting: [
      "reviewerRouting",
      "reviewerRoute",
      "reviewerQueue",
      "routing",
      "routingDecision",
      "routingResult",
      "routeReviewer",
      "reviewerRoutingPermissionGranted"
    ],
    reviewerAssignment: [
      "reviewerAssignment",
      "reviewerAssigned",
      "reviewerAssignee",
      "assignedReviewer",
      "assignedReviewers",
      "reviewerIds",
      "reviewerAllocation",
      "assignmentDecision",
      "humanReviewer",
      "toolReviewer",
      "reviewerAssignmentPermissionGranted"
    ]
  });

function reviewOnlyReadinessInspectionCheckpointKeyPresent(
  value,
  keys,
  seen = new Set()
) {
  if (Array.isArray(value)) {
    return value.some((entry) =>
      reviewOnlyReadinessInspectionCheckpointKeyPresent(entry, keys, seen)
    );
  }

  if (!isPlainObjectRecord(value) || seen.has(value)) {
    return false;
  }

  seen.add(value);

  return Object.entries(value).some(
    ([key, entry]) =>
      keys.includes(key) ||
      reviewOnlyReadinessInspectionCheckpointKeyPresent(entry, keys, seen)
  );
}

function reviewOnlyReadinessInspectionCheckpointUnexpectedUnsafeField(
  value,
  seen = new Set()
) {
  if (Array.isArray(value)) {
    return value.some((entry) =>
      reviewOnlyReadinessInspectionCheckpointUnexpectedUnsafeField(entry, seen)
    );
  }

  if (!isPlainObjectRecord(value) || seen.has(value)) {
    return false;
  }

  seen.add(value);

  return Object.entries(value).some(
    ([key, entry]) =>
      (!REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_ALLOWED_FIELDS.has(key) &&
        APPROVAL_EVALUATOR_CANDIDATE_UNSAFE_TRUE_FIELD_PATTERN.test(key)) ||
      reviewOnlyReadinessInspectionCheckpointUnexpectedUnsafeField(entry, seen)
  );
}

function reviewOnlyReadinessInspectionCheckpointPathMismatch(
  readinessArtifact,
  pathGroup,
  expected
) {
  return pathGroup.some((path) =>
    reviewOnlyEvaluatorPreflightPathDoesNotMatch(
      readinessArtifact,
      path,
      expected
    )
  );
}

function reviewOnlyReadinessInspectionCheckpointUnknown(readinessArtifact) {
  return (
    (typeof readinessArtifact.schema === "string" &&
      readinessArtifact.schema !== REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_STATE_SCHEMA) ||
    (typeof readinessArtifact.stateKind === "string" &&
      readinessArtifact.stateKind !==
        "review-only-handoff-readiness-artifact-state")
  );
}

function reviewOnlyReadinessInspectionCheckpointRevoked(readinessArtifact) {
  return (
    readinessArtifact.revoked === true ||
    (isPlainObjectRecord(readinessArtifact.revocation) &&
      readinessArtifact.revocation.revoked === true)
  );
}

function reviewOnlyReadinessInspectionCheckpointStale(readinessArtifact) {
  return (
    isUtcIsoTimestampWithMilliseconds(readinessArtifact.reviewedAt) &&
    readinessArtifact.reviewedAt <
      REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_MIN_REVIEWED_AT
  );
}

const REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_MALFORMED_CHECKS =
  Object.freeze([
    (readinessArtifact) =>
      !recordHasExactFields(
        readinessArtifact,
        REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_SOURCE_FIELDS
      ),
    (readinessArtifact) =>
      !recordPassesChecks(
        readinessArtifact,
        REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_SOURCE_CHECKS
      ),
    (readinessArtifact) =>
      !recordHasExactFields(
        readinessArtifact.sourceInspectionHandoffState,
        REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_SOURCE_HANDOFF_FIELDS
      ),
    (readinessArtifact) =>
      !recordPassesChecks(
        readinessArtifact.sourceInspectionHandoffState,
        REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_SOURCE_HANDOFF_CHECKS
      ),
    (readinessArtifact) =>
      !recordHasExactFields(
        readinessArtifact.pipelineSummary,
        NON_AUTHORIZING_EVALUATOR_DECISION_PIPELINE_SUMMARY_FIELDS
      ),
    (readinessArtifact) =>
      !recordPassesChecks(
        readinessArtifact.pipelineSummary,
        PREREQUISITE_REVIEW_ARTIFACT_PIPELINE_CHECKS
      ),
    (readinessArtifact) =>
      !recordHasExactFields(
        readinessArtifact.integratedReviewSummary,
        NON_AUTHORIZING_EVALUATOR_DECISION_INTEGRATED_SUMMARY_FIELDS
      ),
    (readinessArtifact) =>
      !recordPassesChecks(
        readinessArtifact.integratedReviewSummary,
        PREREQUISITE_REVIEW_ARTIFACT_SUMMARY_CHECKS
      ),
    (readinessArtifact) =>
      !recordHasExactFields(
        readinessArtifact.decisionCandidateSummary,
        NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_SUMMARY_FIELDS
      ),
    (readinessArtifact) =>
      !recordPassesChecks(
        readinessArtifact.decisionCandidateSummary,
        NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_SUMMARY_CHECKS
      ),
    (readinessArtifact) =>
      !recordHasExactFields(
        readinessArtifact.inspectionSummary,
        HUMAN_TOOL_INSPECTION_DISPOSITION_INSPECTION_SUMMARY_FIELDS
      ),
    (readinessArtifact) =>
      !recordPassesChecks(
        readinessArtifact.inspectionSummary,
        HUMAN_TOOL_INSPECTION_DISPOSITION_INSPECTION_SUMMARY_CHECKS
      ),
    (readinessArtifact) =>
      !recordHasExactFields(
        readinessArtifact.dispositionSummary,
        REVIEW_ONLY_DISPOSITION_AGGREGATION_DISPOSITION_SUMMARY_FIELDS
      ),
    (readinessArtifact) =>
      !recordPassesChecks(
        readinessArtifact.dispositionSummary,
        REVIEW_ONLY_DISPOSITION_AGGREGATION_DISPOSITION_SUMMARY_CHECKS
      ),
    (readinessArtifact) =>
      !recordHasExactFields(
        readinessArtifact.aggregationSummary,
        REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_AGGREGATION_SUMMARY_FIELDS
      ),
    (readinessArtifact) =>
      !recordPassesChecks(
        readinessArtifact.aggregationSummary,
        REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_AGGREGATION_SUMMARY_CHECKS
      ),
    (readinessArtifact) =>
      !recordHasExactFields(
        readinessArtifact.handoffSummary,
        REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_HANDOFF_SUMMARY_FIELDS
      ),
    (readinessArtifact) =>
      !recordPassesChecks(
        readinessArtifact.handoffSummary,
        REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_HANDOFF_SUMMARY_CHECKS
      ),
    (readinessArtifact) =>
      !recordHasExactFields(
        readinessArtifact.readinessSummary,
        REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_READINESS_SUMMARY_FIELDS
      ),
    (readinessArtifact) =>
      !recordPassesChecks(
        readinessArtifact.readinessSummary,
        REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_READINESS_SUMMARY_CHECKS
      ),
    (readinessArtifact) =>
      !recordPassesChecks(
        readinessArtifact,
        REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_REQUIRED_FALSE_FIELDS.map(
          (field) => [field, (value) => value === false]
        )
      ),
    (readinessArtifact) =>
      !recordPassesChecks(
        readinessArtifact,
        REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_REQUIRED_NULL_FIELDS.map(
          (field) => [field, (value) => value === null]
        )
      ),
    (readinessArtifact) =>
      !reviewOnlyRuntimeEffectAllFalse(readinessArtifact.runtimeEffect)
  ]);

function reviewOnlyReadinessInspectionCheckpointMalformed(readinessArtifact) {
  return REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_MALFORMED_CHECKS.some(
    (predicate) => predicate(readinessArtifact)
  );
}

function reviewOnlyReadinessInspectionCheckpointGrantLooking(readinessArtifact) {
  return approvalEvaluatorCandidateNestedTrueClaim(
    readinessArtifact,
    (key) =>
      [
        "grantProduced",
        "grantPersisted",
        "grantCreated",
        "grantIssued",
        "grantAuthorized",
        "grantAccepted",
        "runtimeGrantProduced",
        "permissionGrantProduced"
      ].includes(key)
  );
}

function reviewOnlyReadinessInspectionCheckpointApprovalDecisionLooking(
  readinessArtifact
) {
  return (
    reviewOnlyReadinessInspectionCheckpointPathMismatch(
      readinessArtifact,
      REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_FALSE_PATHS.approvalDecision,
      false
    ) ||
    reviewOnlyReadinessInspectionCheckpointPathMismatch(
      readinessArtifact,
      REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_NULL_PATHS.approvalDecision,
      null
    ) ||
    reviewOnlyReadinessInspectionCheckpointKeyPresent(
      readinessArtifact,
      REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_OBJECT_FIELD_GROUPS
        .approvalDecision
    )
  );
}

function reviewOnlyReadinessInspectionCheckpointApprovalGrantLooking(
  readinessArtifact
) {
  return (
    reviewOnlyReadinessInspectionCheckpointPathMismatch(
      readinessArtifact,
      REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_FALSE_PATHS.approvalGrant,
      false
    ) ||
    reviewOnlyReadinessInspectionCheckpointPathMismatch(
      readinessArtifact,
      REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_NULL_PATHS.approvalGrant,
      null
    ) ||
    [["approvalGrant", "produced"], ["approvalGrant", "persisted"]].some(
      (path) =>
        reviewOnlyEvaluatorPreflightPathValue(readinessArtifact, path) === true
    )
  );
}

function reviewOnlyReadinessInspectionCheckpointEvaluatorResultLooking(
  readinessArtifact
) {
  return (
    reviewOnlyReadinessInspectionCheckpointPathMismatch(
      readinessArtifact,
      REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_FALSE_PATHS.evaluatorResult,
      false
    ) ||
    reviewOnlyReadinessInspectionCheckpointPathMismatch(
      readinessArtifact,
      REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_NULL_PATHS.evaluatorResult,
      null
    ) ||
    reviewOnlyReadinessInspectionCheckpointKeyPresent(
      readinessArtifact,
      REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_OBJECT_FIELD_GROUPS
        .evaluatorResult
    )
  );
}

function reviewOnlyReadinessInspectionCheckpointEvaluatorExecutionLooking(
  readinessArtifact
) {
  return approvalEvaluatorCandidateNestedTrueClaim(
    readinessArtifact,
    (key) =>
      [
        "evaluatorExecutionRequested",
        "evaluatorExecutionStarted",
        "evaluatorExecutionEnabled",
        "evaluatorExecutionPerformed",
        "evaluatorExecuted"
      ].includes(key)
  );
}

function reviewOnlyReadinessInspectionCheckpointReviewerRoutingLooking(
  readinessArtifact
) {
  return (
    reviewOnlyReadinessInspectionCheckpointPathMismatch(
      readinessArtifact,
      REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_FALSE_PATHS.reviewerRouting,
      false
    ) ||
    reviewOnlyReadinessInspectionCheckpointPathMismatch(
      readinessArtifact,
      REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_NULL_PATHS.reviewerRouting,
      null
    ) ||
    reviewOnlyReadinessInspectionCheckpointKeyPresent(
      readinessArtifact,
      REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_OBJECT_FIELD_GROUPS
        .reviewerRouting
    )
  );
}

function reviewOnlyReadinessInspectionCheckpointReviewerAssignmentLooking(
  readinessArtifact
) {
  return (
    reviewOnlyReadinessInspectionCheckpointPathMismatch(
      readinessArtifact,
      REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_FALSE_PATHS.reviewerAssignment,
      false
    ) ||
    reviewOnlyReadinessInspectionCheckpointPathMismatch(
      readinessArtifact,
      REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_NULL_PATHS.reviewerAssignment,
      null
    ) ||
    reviewOnlyReadinessInspectionCheckpointKeyPresent(
      readinessArtifact,
      REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_OBJECT_FIELD_GROUPS
        .reviewerAssignment
    )
  );
}

function reviewOnlyReadinessInspectionCheckpointRuntimePermissionLooking(
  readinessArtifact
) {
  return approvalEvaluatorCandidateNestedTrueClaim(
    readinessArtifact,
    (key) =>
      REVIEW_ONLY_EVALUATOR_PREFLIGHT_RUNTIME_PERMISSION_TRUE_FIELDS.includes(key)
  );
}

function reviewOnlyReadinessInspectionCheckpointCommandExposureLooking(
  readinessArtifact
) {
  return approvalEvaluatorCandidateNestedTrueClaim(
    readinessArtifact,
    (key) =>
      REVIEW_ONLY_EVALUATOR_PREFLIGHT_COMMAND_EXPOSURE_TRUE_FIELDS.includes(key)
  );
}

function reviewOnlyReadinessInspectionCheckpointRuntimeEffectTrue(
  readinessArtifact
) {
  return approvalEvaluatorCandidateRuntimeEffectTrue(readinessArtifact);
}

function reviewOnlyReadinessInspectionCheckpointProcessFlagTrue(
  readinessArtifact
) {
  return approvalEvaluatorCandidateNestedTrueClaim(
    readinessArtifact,
    (key) => APPROVAL_EVALUATOR_CANDIDATE_PROCESS_TRUE_FIELDS.includes(key)
  );
}

function reviewOnlyReadinessInspectionCheckpointUnsafeTrueSurface(
  readinessArtifact
) {
  return approvalEvaluatorCandidateNestedTrueClaim(
    readinessArtifact,
    (key) => APPROVAL_EVALUATOR_CANDIDATE_UNSAFE_TRUE_FIELD_PATTERN.test(key)
  );
}

function reviewOnlyReadinessInspectionCheckpointExecutionSignalLooking(
  readinessArtifact
) {
  return approvalEvaluatorCandidateNestedTrueClaim(
    readinessArtifact,
    (key) => REVIEW_ONLY_EVALUATOR_PREFLIGHT_EXECUTION_SIGNAL_TRUE_FIELDS.includes(key)
  );
}

function reviewOnlyReadinessInspectionCheckpointAuthorizing(readinessArtifact) {
  return approvalEvaluatorCandidateNestedTrueClaim(
    readinessArtifact,
    (key) =>
      REVIEW_ONLY_EVALUATOR_PREFLIGHT_AUTHORITATIVE_TRUE_FIELDS.includes(key)
  );
}

const REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_SINGLE_REJECTION_CHECKS =
  Object.freeze([
    [
      (readinessArtifact) => !isPlainObjectRecord(readinessArtifact),
      "malformed_review_only_readiness_inspection_checkpoint_input_rejected"
    ],
    [
      reviewOnlyReadinessInspectionCheckpointUnknown,
      "unknown_review_only_readiness_inspection_checkpoint_input_rejected"
    ],
    [
      reviewOnlyReadinessInspectionCheckpointRevoked,
      "revoked_review_only_readiness_inspection_checkpoint_input_rejected"
    ],
    [
      reviewOnlyReadinessInspectionCheckpointStale,
      "stale_review_only_readiness_inspection_checkpoint_input_rejected"
    ],
    [
      reviewOnlyReadinessInspectionCheckpointApprovalDecisionLooking,
      "approval_decision_looking_review_only_readiness_inspection_checkpoint_input_rejected"
    ],
    [
      reviewOnlyReadinessInspectionCheckpointReviewerRoutingLooking,
      "reviewer_routing_looking_review_only_readiness_inspection_checkpoint_input_rejected"
    ],
    [
      reviewOnlyReadinessInspectionCheckpointReviewerAssignmentLooking,
      "reviewer_assignment_looking_review_only_readiness_inspection_checkpoint_input_rejected"
    ],
    [
      reviewOnlyReadinessInspectionCheckpointUnexpectedUnsafeField,
      "unsafe_review_only_readiness_inspection_checkpoint_input_rejected"
    ],
    [
      reviewOnlyReadinessInspectionCheckpointGrantLooking,
      "grant_looking_review_only_readiness_inspection_checkpoint_input_rejected"
    ],
    [
      reviewOnlyReadinessInspectionCheckpointApprovalGrantLooking,
      "approval_grant_looking_review_only_readiness_inspection_checkpoint_input_rejected"
    ],
    [
      reviewOnlyReadinessInspectionCheckpointEvaluatorResultLooking,
      "evaluator_result_looking_review_only_readiness_inspection_checkpoint_input_rejected"
    ],
    [
      reviewOnlyReadinessInspectionCheckpointEvaluatorExecutionLooking,
      "evaluator_execution_looking_review_only_readiness_inspection_checkpoint_input_rejected"
    ],
    [
      reviewOnlyReadinessInspectionCheckpointRuntimePermissionLooking,
      "runtime_permission_looking_review_only_readiness_inspection_checkpoint_input_rejected"
    ],
    [
      reviewOnlyReadinessInspectionCheckpointCommandExposureLooking,
      "command_exposure_looking_review_only_readiness_inspection_checkpoint_input_rejected"
    ],
    [
      reviewOnlyReadinessInspectionCheckpointRuntimeEffectTrue,
      "runtime_effect_true_review_only_readiness_inspection_checkpoint_input_rejected"
    ],
    [
      reviewOnlyReadinessInspectionCheckpointProcessFlagTrue,
      "process_flag_true_review_only_readiness_inspection_checkpoint_input_rejected"
    ],
    [
      reviewOnlyReadinessInspectionCheckpointUnsafeTrueSurface,
      "unsafe_review_only_readiness_inspection_checkpoint_input_rejected"
    ],
    [
      reviewOnlyReadinessInspectionCheckpointExecutionSignalLooking,
      "execution_signal_looking_review_only_readiness_inspection_checkpoint_input_rejected"
    ],
    [
      reviewOnlyReadinessInspectionCheckpointAuthorizing,
      "authorizing_review_only_readiness_inspection_checkpoint_input_rejected"
    ],
    [
      reviewOnlyReadinessInspectionCheckpointMalformed,
      "malformed_review_only_readiness_inspection_checkpoint_input_rejected"
    ]
  ]);

function reviewOnlyReadinessInspectionCheckpointSingleClassification(
  readinessArtifact
) {
  return (
    REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_SINGLE_REJECTION_CHECKS.find(
      ([predicate]) => predicate(readinessArtifact)
    )?.[1] ?? VALID_REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_CLASSIFICATION
  );
}

function firstReviewOnlyReadinessInspectionCheckpointRejection(
  readinessArtifacts
) {
  return (
    readinessArtifacts
      .map(reviewOnlyReadinessInspectionCheckpointSingleClassification)
      .find(
        (classification) =>
          classification !==
          VALID_REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_CLASSIFICATION
      ) ?? null
  );
}

function reviewOnlyReadinessInspectionCheckpointArtifactsContainDuplicate(
  readinessArtifacts
) {
  const digests = readinessArtifacts.map((readinessArtifact) =>
    reviewArtifactHandoffDigest(readinessArtifact)
  );

  return new Set(digests).size !== digests.length;
}

const REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_RESOLVERS = Object.freeze([
  (readinessArtifacts) =>
    readinessArtifacts === undefined
      ? "missing_review_only_readiness_inspection_checkpoint_input_rejected"
      : null,
  (readinessArtifacts) =>
    !Array.isArray(readinessArtifacts)
      ? "malformed_review_only_readiness_inspection_checkpoint_input_rejected"
      : null,
  (readinessArtifacts) =>
    readinessArtifacts.length === 0
      ? "empty_review_only_readiness_inspection_checkpoint_input_rejected"
      : null,
  firstReviewOnlyReadinessInspectionCheckpointRejection,
  (readinessArtifacts) =>
    reviewOnlyReadinessInspectionCheckpointArtifactsContainDuplicate(
      readinessArtifacts
    )
      ? "duplicate_invalid_review_only_readiness_inspection_checkpoint_input_rejected"
      : null,
  (readinessArtifacts) =>
    readinessArtifacts.length > 1
      ? "conflicting_review_only_readiness_inspection_checkpoint_input_rejected"
      : null
]);

function reviewOnlyReadinessInspectionCheckpointClassification(
  readinessArtifacts
) {
  let classification = null;

  REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_RESOLVERS.some((resolver) => {
    classification = resolver(readinessArtifacts);
    return classification !== null;
  });

  return (
    classification ??
    VALID_REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_CLASSIFICATION
  );
}

function reviewOnlyReadinessInspectionCheckpointSummary() {
  return {
    checkpointKind: "review-only-readiness-inspection-checkpoint",
    checkpointMode: "review-only",
    sourceReadinessClassification:
      VALID_REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_CLASSIFICATION,
    readinessInspectionCheckpointMetadataOnly: true,
    reviewerRoutingPerformed: false,
    reviewerAssignmentPerformed: false,
    evaluatorExecutionPerformed: false,
    evaluatorResultProduced: false,
    approvalDecisionProduced: false,
    approvalGrantProduced: false,
    runtimePermissionGranted: false,
    commandExposurePermissionGranted: false,
    evaluatorExecuted: false,
    runtimeEffectAllFalse: true
  };
}

function reviewOnlyReadinessInspectionCheckpointStateFromReadinessArtifact(
  readinessArtifact,
  reviewedAt
) {
  return {
    schema: REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_STATE_SCHEMA,
    schemaVersion: REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_VERSION,
    stateKind: "review-only-readiness-inspection-checkpoint-state",
    stateMode: "review-only",
    reviewedAt,
    sourceHandoffReadinessArtifact: {
      schema: readinessArtifact.schema,
      stateKind: readinessArtifact.stateKind,
      stateMode: readinessArtifact.stateMode,
      reviewedAt: readinessArtifact.reviewedAt,
      stateDigest: reviewArtifactHandoffDigest(readinessArtifact),
      sourceInspectionHandoffStateDigest:
        readinessArtifact.sourceInspectionHandoffState.stateDigest,
      sourceAggregationStateDigest:
        readinessArtifact.sourceInspectionHandoffState.sourceAggregationStateDigest,
      sourceDispositionStateDigest:
        readinessArtifact.sourceInspectionHandoffState.sourceDispositionStateDigest,
      sourceInspectionArtifactDigest:
        readinessArtifact.sourceInspectionHandoffState.sourceInspectionArtifactDigest,
      sourceDecisionCandidateStateDigest:
        readinessArtifact.sourceInspectionHandoffState
          .sourceDecisionCandidateStateDigest,
      sourcePreflightCheckpointStateDigest:
        readinessArtifact.sourceInspectionHandoffState
          .sourcePreflightCheckpointStateDigest,
      sourceIntakeCheckpointStateDigest:
        readinessArtifact.sourceInspectionHandoffState
          .sourceIntakeCheckpointStateDigest,
      sourceEvaluatorInputCandidateDigest:
        readinessArtifact.sourceInspectionHandoffState
          .sourceEvaluatorInputCandidateDigest,
      handoffStateAccepted: true,
      readinessArtifactMetadataOnly: true,
      readinessArtifactIsReviewerRouting: false,
      readinessArtifactIsReviewerAssignment: false,
      readinessArtifactIsEvaluatorExecution: false,
      readinessArtifactIsEvaluatorResult: false,
      readinessArtifactIsApprovalDecision: false,
      readinessArtifactIsApprovalGrant: false,
      reviewerRoutingPerformed: false,
      reviewerAssignmentPerformed: false,
      evaluatorResultProduced: false,
      approvalDecisionProduced: false,
      approvalGrantProduced: false,
      approvalGrantPersisted: false,
      evaluatorExecuted: false,
      runtimeEffectAllFalse: true
    },
    pipelineSummary: reviewOnlyEvaluatorPreflightPipelineSummary(
      readinessArtifact.pipelineSummary
    ),
    integratedReviewSummary: reviewOnlyEvaluatorPreflightIntegratedSummary(
      readinessArtifact.integratedReviewSummary
    ),
    decisionCandidateSummary:
      nonAuthorizingEvaluatorDecisionCandidateSummary(),
    inspectionSummary:
      nonAuthorizingEvaluatorDecisionCandidateInspectionSummary(),
    dispositionSummary: humanToolInspectionDispositionSummary(),
    aggregationSummary: reviewOnlyDispositionAggregationSummary(),
    handoffSummary: reviewOnlyAggregationInspectionHandoffSummary(),
    readinessSummary: reviewOnlyHandoffReadinessSummary(),
    inspectionCheckpointSummary:
      reviewOnlyReadinessInspectionCheckpointSummary(),
    readinessArtifactAccepted: true,
    readinessInspectionCheckpointMetadataOnly: true,
    readinessInspectionCheckpointIsReviewerRouting: false,
    readinessInspectionCheckpointIsReviewerAssignment: false,
    readinessInspectionCheckpointIsEvaluatorExecution: false,
    readinessInspectionCheckpointIsEvaluatorResult: false,
    readinessInspectionCheckpointIsApprovalDecision: false,
    readinessInspectionCheckpointIsApprovalGrant: false,
    reviewerRoutingPerformed: false,
    reviewerRoutingEnabled: false,
    reviewerRouteId: null,
    reviewerAssignmentPerformed: false,
    reviewerAssignmentEnabled: false,
    reviewerAssignmentId: null,
    reviewerId: null,
    evaluatorResultProduced: false,
    evaluatorResultPersisted: false,
    evaluatorResultId: null,
    approvalDecisionProduced: false,
    approvalDecisionPersisted: false,
    approvalDecisionId: null,
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

function reviewOnlyReadinessInspectionCheckpointRejectionReasons({
  accepted,
  classification
}) {
  if (accepted) {
    return [
      "readiness_inspection_checkpoint_is_review_only",
      "reviewer_routing_not_implemented",
      "reviewer_assignment_not_implemented",
      "evaluator_execution_not_implemented",
      "evaluator_result_not_implemented",
      "approval_decision_not_implemented",
      "approval_grant_not_implemented",
      "runtime_enablement_still_blocked"
    ];
  }

  return [
    classification,
    "readiness_inspection_checkpoint_not_produced",
    "reviewer_routing_not_implemented",
    "reviewer_assignment_not_implemented",
    "evaluator_execution_not_implemented",
    "evaluator_result_not_implemented",
    "approval_decision_not_implemented",
    "approval_grant_not_implemented",
    "runtime_enablement_still_blocked"
  ];
}

function reviewOnlyReadinessInspectionCheckpointInputRecord(input) {
  return isPlainObjectRecord(input) ? input : null;
}

function reviewOnlyReadinessInspectionCheckpointReviewedAt(inputRecord) {
  if (
    inputRecord === null ||
    !Object.prototype.hasOwnProperty.call(inputRecord, "reviewedAt")
  ) {
    return APPROVAL_PREREQUISITE_SOURCE_PREFLIGHT_DEFAULT_REVIEWED_AT;
  }

  return isUtcIsoTimestampWithMilliseconds(inputRecord.reviewedAt)
    ? inputRecord.reviewedAt
    : APPROVAL_PREREQUISITE_SOURCE_PREFLIGHT_DEFAULT_REVIEWED_AT;
}

function reviewOnlyReadinessInspectionCheckpointInputMalformed(inputRecord) {
  return (
    inputRecord === null ||
    (Object.prototype.hasOwnProperty.call(inputRecord, "reviewedAt") &&
      !isUtcIsoTimestampWithMilliseconds(inputRecord.reviewedAt))
  );
}

function reviewOnlyReadinessInspectionCheckpointReadinessArtifacts(inputRecord) {
  return inputRecord === null ? undefined : inputRecord.readinessArtifacts;
}

function reviewOnlyReadinessInspectionCheckpointInputClassification(
  inputRecord,
  readinessArtifacts
) {
  return reviewOnlyReadinessInspectionCheckpointInputMalformed(inputRecord)
    ? MALFORMED_REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_CLASSIFICATION
    : reviewOnlyReadinessInspectionCheckpointClassification(readinessArtifacts);
}

function reviewOnlyReadinessInspectionCheckpointSummaryFromReadinessArtifact(
  readinessArtifact
) {
  return {
    schema: readinessArtifact.schema,
    stateKind: readinessArtifact.stateKind,
    stateMode: readinessArtifact.stateMode,
    reviewedAt: readinessArtifact.reviewedAt,
    stateDigest: reviewArtifactHandoffDigest(readinessArtifact),
    readinessArtifactIsReviewerRouting: false,
    readinessArtifactIsReviewerAssignment: false,
    readinessArtifactIsEvaluatorExecution: false,
    readinessArtifactIsEvaluatorResult: false,
    readinessArtifactIsApprovalDecision: false,
    readinessArtifactIsApprovalGrant: false,
    reviewerRoutingPerformed: false,
    reviewerAssignmentPerformed: false,
    evaluatorResultProduced: false,
    approvalDecisionProduced: false,
    approvalGrantProduced: false,
    approvalGrantPersisted: false,
    evaluatorExecuted: false,
    runtimeEffectAllFalse: true
  };
}

function reviewOnlyReadinessInspectionCheckpointAcceptedOutput({
  accepted,
  readinessArtifacts,
  reviewedAt
}) {
  if (!accepted) {
    return {
      readinessInspectionCheckpoint: null,
      readinessArtifactSummary: null
    };
  }

  const readinessArtifact = readinessArtifacts[0];

  return {
    readinessInspectionCheckpoint:
      reviewOnlyReadinessInspectionCheckpointStateFromReadinessArtifact(
        readinessArtifact,
        reviewedAt
      ),
    readinessArtifactSummary:
      reviewOnlyReadinessInspectionCheckpointSummaryFromReadinessArtifact(
        readinessArtifact
      )
  };
}

function reviewOnlyReadinessInspectionCheckpointResult({
  reviewedAt,
  reviewedAtDefaulted,
  classification,
  accepted,
  readinessInspectionCheckpoint,
  readinessArtifactSummary
}) {
  return {
    schema: REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_SCHEMA,
    schemaVersion: REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_VERSION,
    artifactKind: REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_KIND,
    artifactMode: "review-only",
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    readinessArtifactAccepted: accepted,
    readinessInspectionCheckpointProduced: accepted,
    readinessInspectionCheckpointIsReviewerRouting: false,
    readinessInspectionCheckpointIsReviewerAssignment: false,
    readinessInspectionCheckpointIsEvaluatorExecution: false,
    readinessInspectionCheckpointIsEvaluatorResult: false,
    readinessInspectionCheckpointIsApprovalDecision: false,
    readinessInspectionCheckpointIsApprovalGrant: false,
    readinessInspectionCheckpoint,
    readinessArtifactSummary,
    reviewOnly: true,
    authoritative: false,
    reviewArtifactOnly: true,
    readinessInspectionCheckpointMetadataOnly: true,
    reviewerRoutingPerformed: false,
    reviewerRoutingEnabled: false,
    reviewerRouteId: null,
    reviewerAssignmentPerformed: false,
    reviewerAssignmentEnabled: false,
    reviewerAssignmentId: null,
    reviewerId: null,
    evaluatorResultProduced: false,
    evaluatorResultPersisted: false,
    evaluatorResultId: null,
    approvalDecisionProduced: false,
    approvalDecisionPersisted: false,
    approvalDecisionId: null,
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
    rejectionReasons: reviewOnlyReadinessInspectionCheckpointRejectionReasons({
      accepted,
      classification
    }),
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

export function createReviewOnlyReadinessInspectionCheckpointForReview(
  input = {}
) {
  const inputRecord = reviewOnlyReadinessInspectionCheckpointInputRecord(input);
  const reviewedAt =
    reviewOnlyReadinessInspectionCheckpointReviewedAt(inputRecord);
  const reviewedAtDefaulted = isReviewedAtDefaulted(inputRecord);
  const readinessArtifacts =
    reviewOnlyReadinessInspectionCheckpointReadinessArtifacts(inputRecord);
  const classification =
    reviewOnlyReadinessInspectionCheckpointInputClassification(
      inputRecord,
      readinessArtifacts
    );
  const accepted =
    classification ===
    VALID_REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_CLASSIFICATION;
  const { readinessInspectionCheckpoint, readinessArtifactSummary } =
    reviewOnlyReadinessInspectionCheckpointAcceptedOutput({
      accepted,
      readinessArtifacts,
      reviewedAt
    });

  return reviewOnlyReadinessInspectionCheckpointResult({
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    accepted,
    readinessInspectionCheckpoint,
    readinessArtifactSummary
  });
}

const REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_STATE_SCHEMA =
  "ardyn.phase-5.36.review-only-readiness-handoff-disposition-state";

const REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_MIN_REVIEWED_AT =
  "2026-06-16T00:00:00.000Z";

const VALID_REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_CLASSIFICATION =
  "valid_review_only_readiness_handoff_disposition_runtime_still_blocked";
const REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_SOURCE_FIELDS = Object.freeze([
  "schema",
  "schemaVersion",
  "stateKind",
  "stateMode",
  "reviewedAt",
  "sourceHandoffReadinessArtifact",
  "pipelineSummary",
  "integratedReviewSummary",
  "decisionCandidateSummary",
  "inspectionSummary",
  "dispositionSummary",
  "aggregationSummary",
  "handoffSummary",
  "readinessSummary",
  "inspectionCheckpointSummary",
  "readinessArtifactAccepted",
  "readinessInspectionCheckpointMetadataOnly",
  "readinessInspectionCheckpointIsReviewerRouting",
  "readinessInspectionCheckpointIsReviewerAssignment",
  "readinessInspectionCheckpointIsEvaluatorExecution",
  "readinessInspectionCheckpointIsEvaluatorResult",
  "readinessInspectionCheckpointIsApprovalDecision",
  "readinessInspectionCheckpointIsApprovalGrant",
  "reviewerRoutingPerformed",
  "reviewerRoutingEnabled",
  "reviewerRouteId",
  "reviewerAssignmentPerformed",
  "reviewerAssignmentEnabled",
  "reviewerAssignmentId",
  "reviewerId",
  "evaluatorResultProduced",
  "evaluatorResultPersisted",
  "evaluatorResultId",
  "approvalDecisionProduced",
  "approvalDecisionPersisted",
  "approvalDecisionId",
  "approvalGrantProduced",
  "approvalGrantPersisted",
  "approvalGrantId",
  "runtimePermissionGranted",
  "commandExposurePermissionGranted",
  "runtimeCommandExposureEnabled",
  "runtimeExecutionEnabled",
  "evaluatorExecutionRequested",
  "evaluatorExecutionStarted",
  "evaluatorExecutionEnabled",
  "evaluatorExecuted",
  "runtimeEffect"
]);

const REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_SOURCE_CHECKPOINT_FIELDS =
  Object.freeze([
    "schema",
    "stateKind",
    "stateMode",
    "reviewedAt",
    "stateDigest",
    "sourceInspectionHandoffStateDigest",
    "sourceAggregationStateDigest",
    "sourceDispositionStateDigest",
    "sourceInspectionArtifactDigest",
    "sourceDecisionCandidateStateDigest",
    "sourcePreflightCheckpointStateDigest",
    "sourceIntakeCheckpointStateDigest",
    "sourceEvaluatorInputCandidateDigest",
    "handoffStateAccepted",
    "readinessArtifactMetadataOnly",
    "readinessArtifactIsReviewerRouting",
    "readinessArtifactIsReviewerAssignment",
    "readinessArtifactIsEvaluatorExecution",
    "readinessArtifactIsEvaluatorResult",
    "readinessArtifactIsApprovalDecision",
    "readinessArtifactIsApprovalGrant",
    "reviewerRoutingPerformed",
    "reviewerAssignmentPerformed",
    "evaluatorResultProduced",
    "approvalDecisionProduced",
    "approvalGrantProduced",
    "approvalGrantPersisted",
    "evaluatorExecuted",
    "runtimeEffectAllFalse"
  ]);

const REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_CHECKPOINT_SUMMARY_FIELDS =
  Object.freeze([
    "checkpointKind",
    "checkpointMode",
    "sourceReadinessClassification",
    "readinessInspectionCheckpointMetadataOnly",
    "reviewerRoutingPerformed",
    "reviewerAssignmentPerformed",
    "evaluatorExecutionPerformed",
    "evaluatorResultProduced",
    "approvalDecisionProduced",
    "approvalGrantProduced",
    "runtimePermissionGranted",
    "commandExposurePermissionGranted",
    "evaluatorExecuted",
    "runtimeEffectAllFalse"
  ]);

const REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_REQUIRED_FALSE_FIELDS =
  Object.freeze([
    "readinessInspectionCheckpointIsReviewerRouting",
    "readinessInspectionCheckpointIsReviewerAssignment",
    "readinessInspectionCheckpointIsEvaluatorExecution",
    "readinessInspectionCheckpointIsEvaluatorResult",
    "readinessInspectionCheckpointIsApprovalDecision",
    "readinessInspectionCheckpointIsApprovalGrant",
    "reviewerRoutingPerformed",
    "reviewerRoutingEnabled",
    "reviewerAssignmentPerformed",
    "reviewerAssignmentEnabled",
    "evaluatorResultProduced",
    "evaluatorResultPersisted",
    "approvalDecisionProduced",
    "approvalDecisionPersisted",
    "approvalGrantProduced",
    "approvalGrantPersisted",
    "runtimePermissionGranted",
    "commandExposurePermissionGranted",
    "runtimeCommandExposureEnabled",
    "runtimeExecutionEnabled",
    "evaluatorExecutionRequested",
    "evaluatorExecutionStarted",
    "evaluatorExecutionEnabled",
    "evaluatorExecuted"
  ]);

const REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_REQUIRED_NULL_FIELDS =
  Object.freeze([
    "reviewerRouteId",
    "reviewerAssignmentId",
    "reviewerId",
    "evaluatorResultId",
    "approvalDecisionId",
    "approvalGrantId"
  ]);

const REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_ALLOWED_FIELDS = new Set([
  ...REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_SOURCE_FIELDS,
  ...REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_SOURCE_CHECKPOINT_FIELDS,
  ...REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_CHECKPOINT_SUMMARY_FIELDS,
  ...REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_DECISION_CANDIDATE_SUMMARY_FIELDS,
  ...REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_READINESS_SUMMARY_FIELDS,
  ...REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_HANDOFF_SUMMARY_FIELDS,
  ...REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_AGGREGATION_SUMMARY_FIELDS,
  ...HUMAN_TOOL_INSPECTION_DISPOSITION_INSPECTION_SUMMARY_FIELDS,
  ...REVIEW_ONLY_DISPOSITION_AGGREGATION_DISPOSITION_SUMMARY_FIELDS,
  ...NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_SUMMARY_FIELDS,
  ...NON_AUTHORIZING_EVALUATOR_DECISION_PIPELINE_SUMMARY_FIELDS,
  ...NON_AUTHORIZING_EVALUATOR_DECISION_INTEGRATED_SUMMARY_FIELDS
]);

const REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_SOURCE_CHECKS = Object.freeze([
  [
    "schema",
    (value) => value === REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_STATE_SCHEMA
  ],
  [
    "schemaVersion",
    (value) => value === REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_VERSION
  ],
  [
    "stateKind",
    (value) => value === "review-only-readiness-inspection-checkpoint-state"
  ],
  ["stateMode", (value) => value === "review-only"],
  ["reviewedAt", isUtcIsoTimestampWithMilliseconds],
  ["sourceHandoffReadinessArtifact", isPlainObjectRecord],
  ["pipelineSummary", isPlainObjectRecord],
  ["integratedReviewSummary", isPlainObjectRecord],
  ["decisionCandidateSummary", isPlainObjectRecord],
  ["inspectionSummary", isPlainObjectRecord],
  ["dispositionSummary", isPlainObjectRecord],
  ["aggregationSummary", isPlainObjectRecord],
  ["handoffSummary", isPlainObjectRecord],
  ["readinessSummary", isPlainObjectRecord],
  ["inspectionCheckpointSummary", isPlainObjectRecord],
  ["readinessArtifactAccepted", (value) => value === true],
  ["readinessInspectionCheckpointMetadataOnly", (value) => value === true],
  ["runtimeEffect", isPlainObjectRecord]
]);

const REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_SOURCE_CHECKPOINT_CHECKS =
  Object.freeze([
    [
      "schema",
      (value) => value === REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_STATE_SCHEMA
    ],
    [
      "stateKind",
      (value) => value === "review-only-handoff-readiness-artifact-state"
    ],
    ["stateMode", (value) => value === "review-only"],
    ["reviewedAt", isUtcIsoTimestampWithMilliseconds],
    ["stateDigest", (value) => typeof value === "string" && /^sha256:[0-9a-f]{64}$/.test(value)],
    [
      "sourceInspectionHandoffStateDigest",
      (value) => typeof value === "string" && /^sha256:[0-9a-f]{64}$/.test(value)
    ],
    [
      "sourceAggregationStateDigest",
      (value) => typeof value === "string" && /^sha256:[0-9a-f]{64}$/.test(value)
    ],
    [
      "sourceDispositionStateDigest",
      (value) => typeof value === "string" && /^sha256:[0-9a-f]{64}$/.test(value)
    ],
    [
      "sourceInspectionArtifactDigest",
      (value) => typeof value === "string" && /^sha256:[0-9a-f]{64}$/.test(value)
    ],
    [
      "sourceDecisionCandidateStateDigest",
      (value) => typeof value === "string" && /^sha256:[0-9a-f]{64}$/.test(value)
    ],
    [
      "sourcePreflightCheckpointStateDigest",
      (value) => typeof value === "string" && /^sha256:[0-9a-f]{64}$/.test(value)
    ],
    [
      "sourceIntakeCheckpointStateDigest",
      (value) => typeof value === "string" && /^sha256:[0-9a-f]{64}$/.test(value)
    ],
    [
      "sourceEvaluatorInputCandidateDigest",
      (value) => typeof value === "string" && /^sha256:[0-9a-f]{64}$/.test(value)
    ],
    ["handoffStateAccepted", (value) => value === true],
    ["readinessArtifactMetadataOnly", (value) => value === true],
    ["readinessArtifactIsReviewerRouting", (value) => value === false],
    ["readinessArtifactIsReviewerAssignment", (value) => value === false],
    ["readinessArtifactIsEvaluatorExecution", (value) => value === false],
    ["readinessArtifactIsEvaluatorResult", (value) => value === false],
    ["readinessArtifactIsApprovalDecision", (value) => value === false],
    ["readinessArtifactIsApprovalGrant", (value) => value === false],
    ["reviewerRoutingPerformed", (value) => value === false],
    ["reviewerAssignmentPerformed", (value) => value === false],
    ["evaluatorResultProduced", (value) => value === false],
    ["approvalDecisionProduced", (value) => value === false],
    ["approvalGrantProduced", (value) => value === false],
    ["approvalGrantPersisted", (value) => value === false],
    ["evaluatorExecuted", (value) => value === false],
    ["runtimeEffectAllFalse", (value) => value === true]
  ]);

const REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_CHECKPOINT_SUMMARY_CHECKS =
  Object.freeze([
    [
      "checkpointKind",
      (value) => value === "review-only-readiness-inspection-checkpoint"
    ],
    ["checkpointMode", (value) => value === "review-only"],
    [
      "sourceReadinessClassification",
      (value) =>
        value === VALID_REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_CLASSIFICATION
    ],
    ["readinessInspectionCheckpointMetadataOnly", (value) => value === true],
    ["reviewerRoutingPerformed", (value) => value === false],
    ["reviewerAssignmentPerformed", (value) => value === false],
    ["evaluatorExecutionPerformed", (value) => value === false],
    ["evaluatorResultProduced", (value) => value === false],
    ["approvalDecisionProduced", (value) => value === false],
    ["approvalGrantProduced", (value) => value === false],
    ["runtimePermissionGranted", (value) => value === false],
    ["commandExposurePermissionGranted", (value) => value === false],
    ["evaluatorExecuted", (value) => value === false],
    ["runtimeEffectAllFalse", (value) => value === true]
  ]);

const REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_FALSE_PATHS = Object.freeze({
  approvalDecision: [
    ["readinessInspectionCheckpointIsApprovalDecision"],
    ["approvalDecisionProduced"],
    ["approvalDecisionPersisted"],
    ["inspectionCheckpointSummary", "approvalDecisionProduced"],
    ["inspectionSummary", "approvalDecisionProduced"],
    ["decisionCandidateSummary", "approvalDecisionProduced"],
    ["dispositionSummary", "approvalDecisionProduced"],
    ["aggregationSummary", "approvalDecisionProduced"],
    ["handoffSummary", "approvalDecisionProduced"],
    ["readinessSummary", "approvalDecisionProduced"]
  ],
  approvalGrant: [
    ["readinessInspectionCheckpointIsApprovalGrant"],
    ["approvalGrantProduced"],
    ["approvalGrantPersisted"],
    ["sourceHandoffReadinessArtifact", "readinessArtifactIsApprovalGrant"],
    ["sourceHandoffReadinessArtifact", "approvalGrantProduced"],
    ["sourceHandoffReadinessArtifact", "approvalGrantPersisted"],
    ["integratedReviewSummary", "reviewSummaryIsApprovalGrant"],
    ["integratedReviewSummary", "approvalGrantProduced"],
    ["integratedReviewSummary", "approvalGrantPersisted"],
    ["inspectionCheckpointSummary", "approvalGrantProduced"],
    ["inspectionSummary", "approvalGrantProduced"],
    ["decisionCandidateSummary", "approvalGrantProduced"],
    ["dispositionSummary", "approvalGrantProduced"],
    ["aggregationSummary", "approvalGrantProduced"],
    ["handoffSummary", "approvalGrantProduced"],
    ["readinessSummary", "approvalGrantProduced"]
  ],
  evaluatorResult: [
    ["readinessInspectionCheckpointIsEvaluatorResult"],
    ["evaluatorResultProduced"],
    ["evaluatorResultPersisted"],
    ["sourceHandoffReadinessArtifact", "readinessArtifactIsEvaluatorResult"],
    ["sourceHandoffReadinessArtifact", "evaluatorResultProduced"],
    ["inspectionCheckpointSummary", "evaluatorResultProduced"],
    ["readinessSummary", "evaluatorResultProduced"],
    ["aggregationSummary", "evaluatorResultProduced"],
    ["inspectionSummary", "evaluatorResultProduced"],
    ["dispositionSummary", "evaluatorResultProduced"],
    ["handoffSummary", "evaluatorResultProduced"]
  ],
  reviewerRouting: [
    ["readinessInspectionCheckpointIsReviewerRouting"],
    ["reviewerRoutingPerformed"],
    ["reviewerRoutingEnabled"],
    ["sourceHandoffReadinessArtifact", "readinessArtifactIsReviewerRouting"],
    ["sourceHandoffReadinessArtifact", "reviewerRoutingPerformed"],
    ["inspectionCheckpointSummary", "reviewerRoutingPerformed"],
    ["readinessSummary", "reviewerRoutingPerformed"]
  ],
  reviewerAssignment: [
    ["readinessInspectionCheckpointIsReviewerAssignment"],
    ["reviewerAssignmentPerformed"],
    ["reviewerAssignmentEnabled"],
    ["sourceHandoffReadinessArtifact", "readinessArtifactIsReviewerAssignment"],
    ["sourceHandoffReadinessArtifact", "reviewerAssignmentPerformed"],
    ["inspectionCheckpointSummary", "reviewerAssignmentPerformed"],
    ["readinessSummary", "reviewerAssignmentPerformed"]
  ],
  evaluatorExecution: [
    ["readinessInspectionCheckpointIsEvaluatorExecution"],
    ["evaluatorExecutionRequested"],
    ["evaluatorExecutionStarted"],
    ["evaluatorExecutionEnabled"],
    ["evaluatorExecuted"],
    ["sourceHandoffReadinessArtifact", "readinessArtifactIsEvaluatorExecution"],
    ["sourceHandoffReadinessArtifact", "evaluatorExecuted"],
    ["inspectionCheckpointSummary", "evaluatorExecuted"],
    ["readinessSummary", "evaluatorExecuted"]
  ],
  runtimePermission: [
    ["runtimePermissionGranted"],
    ["inspectionCheckpointSummary", "runtimePermissionGranted"],
    ["readinessSummary", "runtimePermissionGranted"]
  ],
  commandExposure: [
    ["commandExposurePermissionGranted"],
    ["runtimeCommandExposureEnabled"],
    ["inspectionCheckpointSummary", "commandExposurePermissionGranted"],
    ["readinessSummary", "commandExposurePermissionGranted"]
  ],
  runtimeExecution: [
    ["runtimeExecutionEnabled"]
  ]
});

const REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_NULL_PATHS = Object.freeze({
  approvalDecision: [["approvalDecisionId"]],
  approvalGrant: [["approvalGrantId"], ["integratedReviewSummary", "approvalGrantId"]],
  evaluatorResult: [["evaluatorResultId"]],
  reviewerRouting: [["reviewerRouteId"]],
  reviewerAssignment: [["reviewerAssignmentId"], ["reviewerId"]]
});

const REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_OBJECT_FIELD_GROUPS =
  Object.freeze({
    approvalDecision: [
      "approvalDecision",
      "approvalDecisionResult",
      "approvalDecisionGranted",
      "approvalDecisionAccepted",
      "approvalDecisionAuthorized",
      "readinessHandoffDispositionIsApprovalDecision"
    ],
    evaluatorResult: [
      "evaluatorResult",
      "evaluationResult",
      "evaluatorOutput",
      "evaluatorOutcome",
      "resultProduced"
    ],
    reviewerRouting: [
      "reviewerRouting",
      "reviewerRoute",
      "reviewerQueue",
      "routing",
      "routingDecision",
      "routingResult",
      "routeReviewer",
      "reviewerRoutingPermissionGranted"
    ],
    reviewerAssignment: [
      "reviewerAssignment",
      "reviewerAssigned",
      "reviewerAssignee",
      "assignedReviewer",
      "assignedReviewers",
      "reviewerIds",
      "reviewerAllocation",
      "assignmentDecision",
      "humanReviewer",
      "toolReviewer",
      "reviewerAssignmentPermissionGranted"
    ]
  });

const REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_GRANT_KEY_PATTERN =
  /(^|_|\b)grant(ed|ing|Id|Produced|Persisted)?($|_|\b)/i;

function reviewOnlyReadinessHandoffDispositionKeyPresent(
  value,
  keys,
  seen = new Set()
) {
  if (Array.isArray(value)) {
    return value.some((entry) =>
      reviewOnlyReadinessHandoffDispositionKeyPresent(entry, keys, seen)
    );
  }

  if (!isPlainObjectRecord(value) || seen.has(value)) {
    return false;
  }

  seen.add(value);

  return Object.entries(value).some(
    ([key, entry]) =>
      keys.includes(key) ||
      reviewOnlyReadinessHandoffDispositionKeyPresent(entry, keys, seen)
  );
}

function reviewOnlyReadinessHandoffDispositionKeyTruePresent(
  value,
  keys,
  seen = new Set()
) {
  if (Array.isArray(value)) {
    return value.some((entry) =>
      reviewOnlyReadinessHandoffDispositionKeyTruePresent(entry, keys, seen)
    );
  }

  if (!isPlainObjectRecord(value) || seen.has(value)) {
    return false;
  }

  seen.add(value);

  return Object.entries(value).some(
    ([key, entry]) =>
      (keys.includes(key) && entry === true) ||
      reviewOnlyReadinessHandoffDispositionKeyTruePresent(entry, keys, seen)
  );
}

function reviewOnlyReadinessHandoffDispositionUnexpectedUnsafeField(
  value,
  seen = new Set()
) {
  if (Array.isArray(value)) {
    return value.some((entry) =>
      reviewOnlyReadinessHandoffDispositionUnexpectedUnsafeField(entry, seen)
    );
  }

  if (!isPlainObjectRecord(value) || seen.has(value)) {
    return false;
  }

  seen.add(value);

  return Object.entries(value).some(
    ([key, entry]) =>
      (!REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_ALLOWED_FIELDS.has(key) &&
        APPROVAL_EVALUATOR_CANDIDATE_UNSAFE_TRUE_FIELD_PATTERN.test(key)) ||
      reviewOnlyReadinessHandoffDispositionUnexpectedUnsafeField(entry, seen)
  );
}

function reviewOnlyReadinessHandoffDispositionPathMismatch(
  readinessInspectionCheckpoint,
  pathGroup,
  expected
) {
  return pathGroup.some((path) =>
    reviewOnlyEvaluatorPreflightPathDoesNotMatch(
      readinessInspectionCheckpoint,
      path,
      expected
    )
  );
}

function reviewOnlyReadinessHandoffDispositionUnknown(
  readinessInspectionCheckpoint
) {
  return (
    (typeof readinessInspectionCheckpoint.schema === "string" &&
      readinessInspectionCheckpoint.schema !==
        REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_STATE_SCHEMA) ||
    (typeof readinessInspectionCheckpoint.stateKind === "string" &&
      readinessInspectionCheckpoint.stateKind !==
        "review-only-readiness-inspection-checkpoint-state")
  );
}

function reviewOnlyReadinessHandoffDispositionRevoked(
  readinessInspectionCheckpoint
) {
  return (
    readinessInspectionCheckpoint.revoked === true ||
    (isPlainObjectRecord(readinessInspectionCheckpoint.revocation) &&
      readinessInspectionCheckpoint.revocation.revoked === true)
  );
}

function reviewOnlyReadinessHandoffDispositionStale(
  readinessInspectionCheckpoint
) {
  return (
    isUtcIsoTimestampWithMilliseconds(readinessInspectionCheckpoint.reviewedAt) &&
    readinessInspectionCheckpoint.reviewedAt <
      REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_MIN_REVIEWED_AT
  );
}

const REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_MALFORMED_CHECKS =
  Object.freeze([
    (readinessInspectionCheckpoint) =>
      !recordHasExactFields(
        readinessInspectionCheckpoint,
        REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_SOURCE_FIELDS
      ),
    (readinessInspectionCheckpoint) =>
      REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_SOURCE_CHECKS.some(
        ([field, predicate]) => !predicate(readinessInspectionCheckpoint[field])
      ),
    (readinessInspectionCheckpoint) =>
      !recordHasExactFields(
        readinessInspectionCheckpoint.sourceHandoffReadinessArtifact,
        REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_SOURCE_CHECKPOINT_FIELDS
      ),
    (readinessInspectionCheckpoint) =>
      REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_SOURCE_CHECKPOINT_CHECKS.some(
        ([field, predicate]) =>
          !predicate(
            readinessInspectionCheckpoint.sourceHandoffReadinessArtifact?.[field]
          )
      ),
    (readinessInspectionCheckpoint) =>
      !recordHasExactFields(
        readinessInspectionCheckpoint.inspectionCheckpointSummary,
        REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_CHECKPOINT_SUMMARY_FIELDS
      ),
    (readinessInspectionCheckpoint) =>
      REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_CHECKPOINT_SUMMARY_CHECKS.some(
        ([field, predicate]) =>
          !predicate(readinessInspectionCheckpoint.inspectionCheckpointSummary?.[field])
      ),
    (readinessInspectionCheckpoint) =>
      REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_REQUIRED_FALSE_FIELDS.some(
        (field) => readinessInspectionCheckpoint[field] !== false
      ),
    (readinessInspectionCheckpoint) =>
      REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_REQUIRED_NULL_FIELDS.some(
        (field) => readinessInspectionCheckpoint[field] !== null
      ),
    (readinessInspectionCheckpoint) =>
      !reviewOnlyRuntimeEffectAllFalse(readinessInspectionCheckpoint.runtimeEffect)
  ]);

function reviewOnlyReadinessHandoffDispositionMalformed(
  readinessInspectionCheckpoint
) {
  return REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_MALFORMED_CHECKS.some(
    (predicate) => predicate(readinessInspectionCheckpoint)
  );
}

function reviewOnlyReadinessHandoffDispositionGrantLooking(
  readinessInspectionCheckpoint
) {
  return Object.entries(readinessInspectionCheckpoint).some(
    ([key, value]) =>
      REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_GRANT_KEY_PATTERN.test(key) &&
      value !== false &&
      value !== null &&
      value !== undefined
  );
}

function reviewOnlyReadinessHandoffDispositionApprovalDecisionLooking(
  readinessInspectionCheckpoint
) {
  return (
    reviewOnlyReadinessHandoffDispositionPathMismatch(
      readinessInspectionCheckpoint,
      REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_FALSE_PATHS.approvalDecision,
      false
    ) ||
    reviewOnlyReadinessHandoffDispositionPathMismatch(
      readinessInspectionCheckpoint,
      REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_NULL_PATHS.approvalDecision,
      null
    ) ||
    reviewOnlyReadinessHandoffDispositionKeyTruePresent(
      readinessInspectionCheckpoint,
      REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_OBJECT_FIELD_GROUPS
        .approvalDecision
    )
  );
}

function reviewOnlyReadinessHandoffDispositionApprovalGrantLooking(
  readinessInspectionCheckpoint
) {
  return (
    reviewOnlyReadinessHandoffDispositionPathMismatch(
      readinessInspectionCheckpoint,
      REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_FALSE_PATHS.approvalGrant,
      false
    ) ||
    reviewOnlyReadinessHandoffDispositionPathMismatch(
      readinessInspectionCheckpoint,
      REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_NULL_PATHS.approvalGrant,
      null
    )
  );
}

function reviewOnlyReadinessHandoffDispositionEvaluatorResultLooking(
  readinessInspectionCheckpoint
) {
  return (
    reviewOnlyReadinessHandoffDispositionPathMismatch(
      readinessInspectionCheckpoint,
      REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_FALSE_PATHS.evaluatorResult,
      false
    ) ||
    reviewOnlyReadinessHandoffDispositionPathMismatch(
      readinessInspectionCheckpoint,
      REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_NULL_PATHS.evaluatorResult,
      null
    ) ||
    reviewOnlyReadinessHandoffDispositionKeyTruePresent(
      readinessInspectionCheckpoint,
      REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_OBJECT_FIELD_GROUPS.evaluatorResult
    )
  );
}

function reviewOnlyReadinessHandoffDispositionEvaluatorExecutionLooking(
  readinessInspectionCheckpoint
) {
  return reviewOnlyReadinessHandoffDispositionPathMismatch(
    readinessInspectionCheckpoint,
    REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_FALSE_PATHS.evaluatorExecution,
    false
  );
}

function reviewOnlyReadinessHandoffDispositionReviewerRoutingLooking(
  readinessInspectionCheckpoint
) {
  return (
    reviewOnlyReadinessHandoffDispositionPathMismatch(
      readinessInspectionCheckpoint,
      REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_FALSE_PATHS.reviewerRouting,
      false
    ) ||
    reviewOnlyReadinessHandoffDispositionPathMismatch(
      readinessInspectionCheckpoint,
      REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_NULL_PATHS.reviewerRouting,
      null
    ) ||
    reviewOnlyReadinessHandoffDispositionKeyPresent(
      readinessInspectionCheckpoint,
      REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_OBJECT_FIELD_GROUPS.reviewerRouting
    )
  );
}

function reviewOnlyReadinessHandoffDispositionReviewerAssignmentLooking(
  readinessInspectionCheckpoint
) {
  return (
    reviewOnlyReadinessHandoffDispositionPathMismatch(
      readinessInspectionCheckpoint,
      REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_FALSE_PATHS.reviewerAssignment,
      false
    ) ||
    reviewOnlyReadinessHandoffDispositionPathMismatch(
      readinessInspectionCheckpoint,
      REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_NULL_PATHS.reviewerAssignment,
      null
    ) ||
    reviewOnlyReadinessHandoffDispositionKeyPresent(
      readinessInspectionCheckpoint,
      REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_OBJECT_FIELD_GROUPS
        .reviewerAssignment
    )
  );
}

function reviewOnlyReadinessHandoffDispositionRuntimePermissionLooking(
  readinessInspectionCheckpoint
) {
  return (
    reviewOnlyReadinessHandoffDispositionPathMismatch(
      readinessInspectionCheckpoint,
      REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_FALSE_PATHS.runtimePermission,
      false
    ) ||
    reviewOnlyReadinessHandoffDispositionKeyTruePresent(
      readinessInspectionCheckpoint,
      [
        "runtimePermission",
        "runtimeAuthorization",
        "runtimeAuthorized"
      ]
    )
  );
}

function reviewOnlyReadinessHandoffDispositionCommandExposureLooking(
  readinessInspectionCheckpoint
) {
  return (
    reviewOnlyReadinessHandoffDispositionPathMismatch(
      readinessInspectionCheckpoint,
      REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_FALSE_PATHS.commandExposure,
      false
    ) ||
    reviewOnlyReadinessHandoffDispositionKeyTruePresent(
      readinessInspectionCheckpoint,
      [
        "commandExposure",
        "commandExposurePermission",
        "runtimeCommandEnabled",
        "commandsExposed"
      ]
    )
  );
}

function reviewOnlyReadinessHandoffDispositionRuntimeEffectTrue(
  readinessInspectionCheckpoint
) {
  return (
    !reviewOnlyRuntimeEffectAllFalse(readinessInspectionCheckpoint.runtimeEffect) ||
    reviewOnlyReadinessHandoffDispositionKeyTruePresent(
      readinessInspectionCheckpoint,
      ["runtimeStarted", "runtimeReady", "runtimeExecuted"]
    )
  );
}

function reviewOnlyReadinessHandoffDispositionProcessFlagTrue(
  readinessInspectionCheckpoint
) {
  return reviewOnlyReadinessHandoffDispositionKeyTruePresent(
    readinessInspectionCheckpoint,
    [
      "processStarted",
      "processSpawned",
      "processSpawnEnabled",
      "processRunning",
      "processKilled",
      "processControlEnabled"
    ]
  );
}

function reviewOnlyReadinessHandoffDispositionUnsafeTrueSurface(
  readinessInspectionCheckpoint
) {
  return reviewOnlyReadinessHandoffDispositionKeyTruePresent(
    readinessInspectionCheckpoint,
    [
      "filesystemWatcherEnabled",
      "externalLookupEnabled",
      "externalSourceLookupEnabled",
      "secretsEnvIngestionEnabled",
      "envIngestionEnabled",
      "webSocketHttpSurfaceEnabled",
      "adapterRuntimeBehaviorEnabled",
      "contentFabricRuntimeBehaviorEnabled"
    ]
  );
}

function reviewOnlyReadinessHandoffDispositionExecutionSignalLooking(
  readinessInspectionCheckpoint
) {
  return (
    reviewOnlyReadinessHandoffDispositionPathMismatch(
      readinessInspectionCheckpoint,
      REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_FALSE_PATHS.runtimeExecution,
      false
    ) ||
    reviewOnlyReadinessHandoffDispositionKeyTruePresent(
      readinessInspectionCheckpoint,
      [
        "executionSignal",
        "executionRequested",
        "executionStarted",
        "executionEnabled",
        "execute",
        "startRuntime"
      ]
    )
  );
}

function reviewOnlyReadinessHandoffDispositionAuthorizing(
  readinessInspectionCheckpoint
) {
  return (
    readinessInspectionCheckpoint.reviewOnly !== true &&
    readinessInspectionCheckpoint.authoritative === true
  ) || reviewOnlyReadinessHandoffDispositionKeyTruePresent(
    readinessInspectionCheckpoint,
    [
      "authorization",
      "authorized",
      "authorizing",
      "authorizationGranted",
      "approvalAuthorized",
      "permissionGranted"
    ]
  );
}

const REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_SINGLE_REJECTION_CHECKS =
  Object.freeze([
    [
      reviewOnlyReadinessHandoffDispositionUnknown,
      "unknown_review_only_readiness_handoff_disposition_input_rejected"
    ],
    [
      reviewOnlyReadinessHandoffDispositionRevoked,
      "revoked_review_only_readiness_handoff_disposition_input_rejected"
    ],
    [
      reviewOnlyReadinessHandoffDispositionStale,
      "stale_review_only_readiness_handoff_disposition_input_rejected"
    ],
    [
      reviewOnlyReadinessHandoffDispositionApprovalDecisionLooking,
      "approval_decision_looking_review_only_readiness_handoff_disposition_input_rejected"
    ],
    [
      reviewOnlyReadinessHandoffDispositionReviewerRoutingLooking,
      "reviewer_routing_looking_review_only_readiness_handoff_disposition_input_rejected"
    ],
    [
      reviewOnlyReadinessHandoffDispositionReviewerAssignmentLooking,
      "reviewer_assignment_looking_review_only_readiness_handoff_disposition_input_rejected"
    ],
    [
      reviewOnlyReadinessHandoffDispositionUnexpectedUnsafeField,
      "unsafe_review_only_readiness_handoff_disposition_input_rejected"
    ],
    [
      reviewOnlyReadinessHandoffDispositionGrantLooking,
      "grant_looking_review_only_readiness_handoff_disposition_input_rejected"
    ],
    [
      reviewOnlyReadinessHandoffDispositionApprovalGrantLooking,
      "approval_grant_looking_review_only_readiness_handoff_disposition_input_rejected"
    ],
    [
      reviewOnlyReadinessHandoffDispositionEvaluatorResultLooking,
      "evaluator_result_looking_review_only_readiness_handoff_disposition_input_rejected"
    ],
    [
      reviewOnlyReadinessHandoffDispositionEvaluatorExecutionLooking,
      "evaluator_execution_looking_review_only_readiness_handoff_disposition_input_rejected"
    ],
    [
      reviewOnlyReadinessHandoffDispositionRuntimePermissionLooking,
      "runtime_permission_looking_review_only_readiness_handoff_disposition_input_rejected"
    ],
    [
      reviewOnlyReadinessHandoffDispositionCommandExposureLooking,
      "command_exposure_looking_review_only_readiness_handoff_disposition_input_rejected"
    ],
    [
      reviewOnlyReadinessHandoffDispositionRuntimeEffectTrue,
      "runtime_effect_true_review_only_readiness_handoff_disposition_input_rejected"
    ],
    [
      reviewOnlyReadinessHandoffDispositionProcessFlagTrue,
      "process_flag_true_review_only_readiness_handoff_disposition_input_rejected"
    ],
    [
      reviewOnlyReadinessHandoffDispositionUnsafeTrueSurface,
      "unsafe_review_only_readiness_handoff_disposition_input_rejected"
    ],
    [
      reviewOnlyReadinessHandoffDispositionExecutionSignalLooking,
      "execution_signal_looking_review_only_readiness_handoff_disposition_input_rejected"
    ],
    [
      reviewOnlyReadinessHandoffDispositionAuthorizing,
      "authorizing_review_only_readiness_handoff_disposition_input_rejected"
    ],
    [
      reviewOnlyReadinessHandoffDispositionMalformed,
      "malformed_review_only_readiness_handoff_disposition_input_rejected"
    ]
  ]);

function reviewOnlyReadinessHandoffDispositionSingleClassification(
  readinessInspectionCheckpoint
) {
  return (
    REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_SINGLE_REJECTION_CHECKS.find(
      ([predicate]) => predicate(readinessInspectionCheckpoint)
    )?.[1] ?? VALID_REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_CLASSIFICATION
  );
}

function firstReviewOnlyReadinessHandoffDispositionRejection(
  readinessInspectionCheckpoints
) {
  return (
    readinessInspectionCheckpoints
      .map(reviewOnlyReadinessHandoffDispositionSingleClassification)
      .find(
        (classification) =>
          classification !==
          VALID_REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_CLASSIFICATION
      ) ?? null
  );
}

function reviewOnlyReadinessHandoffDispositionCheckpointsContainDuplicate(
  readinessInspectionCheckpoints
) {
  const digests = readinessInspectionCheckpoints.map((checkpoint) =>
    reviewArtifactHandoffDigest(checkpoint)
  );

  return new Set(digests).size !== digests.length;
}

const REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_RESOLVERS = Object.freeze([
  (readinessInspectionCheckpoints) =>
    readinessInspectionCheckpoints === undefined
      ? "missing_review_only_readiness_handoff_disposition_input_rejected"
      : null,
  (readinessInspectionCheckpoints) =>
    !Array.isArray(readinessInspectionCheckpoints)
      ? "malformed_review_only_readiness_handoff_disposition_input_rejected"
      : null,
  (readinessInspectionCheckpoints) =>
    readinessInspectionCheckpoints.length === 0
      ? "empty_review_only_readiness_handoff_disposition_input_rejected"
      : null,
  firstReviewOnlyReadinessHandoffDispositionRejection,
  (readinessInspectionCheckpoints) =>
    reviewOnlyReadinessHandoffDispositionCheckpointsContainDuplicate(
      readinessInspectionCheckpoints
    )
      ? "duplicate_invalid_review_only_readiness_handoff_disposition_input_rejected"
      : null,
  (readinessInspectionCheckpoints) =>
    readinessInspectionCheckpoints.length > 1
      ? "conflicting_review_only_readiness_handoff_disposition_input_rejected"
      : null
]);

function reviewOnlyReadinessHandoffDispositionClassification(
  readinessInspectionCheckpoints
) {
  let classification = null;

  REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_RESOLVERS.some((resolver) => {
    classification = resolver(readinessInspectionCheckpoints);
    return classification !== null;
  });

  return (
    classification ??
    VALID_REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_CLASSIFICATION
  );
}

function reviewOnlyReadinessHandoffDispositionSummary() {
  return {
    dispositionKind: "review-only-readiness-handoff-disposition",
    dispositionMode: "review-only",
    sourceReadinessInspectionClassification:
      VALID_REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_CLASSIFICATION,
    readinessHandoffDispositionMetadataOnly: true,
    reviewerRoutingPerformed: false,
    reviewerAssignmentPerformed: false,
    evaluatorExecutionPerformed: false,
    evaluatorResultProduced: false,
    approvalDecisionProduced: false,
    approvalGrantProduced: false,
    runtimePermissionGranted: false,
    commandExposurePermissionGranted: false,
    evaluatorExecuted: false,
    runtimeEffectAllFalse: true
  };
}

function reviewOnlyReadinessHandoffDispositionStateFromCheckpoint(
  readinessInspectionCheckpoint,
  reviewedAt
) {
  return {
    schema: REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_STATE_SCHEMA,
    schemaVersion: REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_BOUNDARY_VERSION,
    stateKind: "review-only-readiness-handoff-disposition-state",
    stateMode: "review-only",
    reviewedAt,
    sourceReadinessInspectionCheckpoint: {
      schema: readinessInspectionCheckpoint.schema,
      stateKind: readinessInspectionCheckpoint.stateKind,
      stateMode: readinessInspectionCheckpoint.stateMode,
      reviewedAt: readinessInspectionCheckpoint.reviewedAt,
      stateDigest: reviewArtifactHandoffDigest(readinessInspectionCheckpoint),
      sourceHandoffReadinessArtifactDigest:
        readinessInspectionCheckpoint.sourceHandoffReadinessArtifact.stateDigest,
      sourceInspectionHandoffStateDigest:
        readinessInspectionCheckpoint.sourceHandoffReadinessArtifact
          .sourceInspectionHandoffStateDigest,
      sourceAggregationStateDigest:
        readinessInspectionCheckpoint.sourceHandoffReadinessArtifact
          .sourceAggregationStateDigest,
      sourceDispositionStateDigest:
        readinessInspectionCheckpoint.sourceHandoffReadinessArtifact
          .sourceDispositionStateDigest,
      sourceInspectionArtifactDigest:
        readinessInspectionCheckpoint.sourceHandoffReadinessArtifact
          .sourceInspectionArtifactDigest,
      sourceDecisionCandidateStateDigest:
        readinessInspectionCheckpoint.sourceHandoffReadinessArtifact
          .sourceDecisionCandidateStateDigest,
      sourcePreflightCheckpointStateDigest:
        readinessInspectionCheckpoint.sourceHandoffReadinessArtifact
          .sourcePreflightCheckpointStateDigest,
      sourceIntakeCheckpointStateDigest:
        readinessInspectionCheckpoint.sourceHandoffReadinessArtifact
          .sourceIntakeCheckpointStateDigest,
      sourceEvaluatorInputCandidateDigest:
        readinessInspectionCheckpoint.sourceHandoffReadinessArtifact
          .sourceEvaluatorInputCandidateDigest,
      readinessArtifactAccepted: true,
      readinessInspectionCheckpointMetadataOnly: true,
      readinessInspectionCheckpointIsReviewerRouting: false,
      readinessInspectionCheckpointIsReviewerAssignment: false,
      readinessInspectionCheckpointIsEvaluatorExecution: false,
      readinessInspectionCheckpointIsEvaluatorResult: false,
      readinessInspectionCheckpointIsApprovalDecision: false,
      readinessInspectionCheckpointIsApprovalGrant: false,
      reviewerRoutingPerformed: false,
      reviewerAssignmentPerformed: false,
      evaluatorResultProduced: false,
      approvalDecisionProduced: false,
      approvalGrantProduced: false,
      approvalGrantPersisted: false,
      evaluatorExecuted: false,
      runtimeEffectAllFalse: true
    },
    pipelineSummary: reviewOnlyEvaluatorPreflightPipelineSummary(
      readinessInspectionCheckpoint.pipelineSummary
    ),
    integratedReviewSummary: reviewOnlyEvaluatorPreflightIntegratedSummary(
      readinessInspectionCheckpoint.integratedReviewSummary
    ),
    decisionCandidateSummary:
      nonAuthorizingEvaluatorDecisionCandidateSummary(),
    inspectionSummary:
      nonAuthorizingEvaluatorDecisionCandidateInspectionSummary(),
    dispositionSummary: humanToolInspectionDispositionSummary(),
    aggregationSummary: reviewOnlyDispositionAggregationSummary(),
    handoffSummary: reviewOnlyAggregationInspectionHandoffSummary(),
    readinessSummary: reviewOnlyHandoffReadinessSummary(),
    inspectionCheckpointSummary:
      reviewOnlyReadinessInspectionCheckpointSummary(),
    readinessHandoffDispositionSummary:
      reviewOnlyReadinessHandoffDispositionSummary(),
    readinessInspectionCheckpointAccepted: true,
    readinessHandoffDispositionMetadataOnly: true,
    readinessHandoffDispositionIsReviewerRouting: false,
    readinessHandoffDispositionIsReviewerAssignment: false,
    readinessHandoffDispositionIsEvaluatorExecution: false,
    readinessHandoffDispositionIsEvaluatorResult: false,
    readinessHandoffDispositionIsApprovalDecision: false,
    readinessHandoffDispositionIsApprovalGrant: false,
    reviewerRoutingPerformed: false,
    reviewerRoutingEnabled: false,
    reviewerRouteId: null,
    reviewerAssignmentPerformed: false,
    reviewerAssignmentEnabled: false,
    reviewerAssignmentId: null,
    reviewerId: null,
    evaluatorResultProduced: false,
    evaluatorResultPersisted: false,
    evaluatorResultId: null,
    approvalDecisionProduced: false,
    approvalDecisionPersisted: false,
    approvalDecisionId: null,
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

function reviewOnlyReadinessHandoffDispositionRejectionReasons({
  accepted,
  classification
}) {
  if (accepted) {
    return [
      "readiness_handoff_disposition_is_review_only",
      "reviewer_routing_not_implemented",
      "reviewer_assignment_not_implemented",
      "evaluator_execution_not_implemented",
      "evaluator_result_not_implemented",
      "approval_decision_not_implemented",
      "approval_grant_not_implemented",
      "runtime_enablement_still_blocked"
    ];
  }

  return [
    classification,
    "readiness_handoff_disposition_not_produced",
    "reviewer_routing_not_implemented",
    "reviewer_assignment_not_implemented",
    "evaluator_execution_not_implemented",
    "evaluator_result_not_implemented",
    "approval_decision_not_implemented",
    "approval_grant_not_implemented",
    "runtime_enablement_still_blocked"
  ];
}

function reviewOnlyReadinessHandoffDispositionInputRecord(input) {
  return isPlainObjectRecord(input) ? input : null;
}

function reviewOnlyReadinessHandoffDispositionReviewedAt(inputRecord) {
  if (
    inputRecord === null ||
    !Object.prototype.hasOwnProperty.call(inputRecord, "reviewedAt")
  ) {
    return APPROVAL_PREREQUISITE_SOURCE_PREFLIGHT_DEFAULT_REVIEWED_AT;
  }

  return isUtcIsoTimestampWithMilliseconds(inputRecord.reviewedAt)
    ? inputRecord.reviewedAt
    : APPROVAL_PREREQUISITE_SOURCE_PREFLIGHT_DEFAULT_REVIEWED_AT;
}

function reviewOnlyReadinessHandoffDispositionInputMalformed(inputRecord) {
  return (
    inputRecord === null ||
    (Object.prototype.hasOwnProperty.call(inputRecord, "reviewedAt") &&
      !isUtcIsoTimestampWithMilliseconds(inputRecord.reviewedAt))
  );
}

function reviewOnlyReadinessHandoffDispositionCheckpoints(inputRecord) {
  return inputRecord === null
    ? undefined
    : inputRecord.readinessInspectionCheckpoints;
}

function reviewOnlyReadinessHandoffDispositionInputClassification(
  inputRecord,
  readinessInspectionCheckpoints
) {
  return reviewOnlyReadinessHandoffDispositionInputMalformed(inputRecord)
    ? MALFORMED_REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_CLASSIFICATION
    : reviewOnlyReadinessHandoffDispositionClassification(
        readinessInspectionCheckpoints
      );
}

function reviewOnlyReadinessHandoffDispositionSummaryFromCheckpoint(
  readinessInspectionCheckpoint
) {
  return {
    schema: readinessInspectionCheckpoint.schema,
    stateKind: readinessInspectionCheckpoint.stateKind,
    stateMode: readinessInspectionCheckpoint.stateMode,
    reviewedAt: readinessInspectionCheckpoint.reviewedAt,
    stateDigest: reviewArtifactHandoffDigest(readinessInspectionCheckpoint),
    readinessInspectionCheckpointIsReviewerRouting: false,
    readinessInspectionCheckpointIsReviewerAssignment: false,
    readinessInspectionCheckpointIsEvaluatorExecution: false,
    readinessInspectionCheckpointIsEvaluatorResult: false,
    readinessInspectionCheckpointIsApprovalDecision: false,
    readinessInspectionCheckpointIsApprovalGrant: false,
    reviewerRoutingPerformed: false,
    reviewerAssignmentPerformed: false,
    evaluatorResultProduced: false,
    approvalDecisionProduced: false,
    approvalGrantProduced: false,
    approvalGrantPersisted: false,
    evaluatorExecuted: false,
    runtimeEffectAllFalse: true
  };
}

function reviewOnlyReadinessHandoffDispositionAcceptedOutput({
  accepted,
  readinessInspectionCheckpoints,
  reviewedAt
}) {
  if (!accepted) {
    return {
      readinessHandoffDisposition: null,
      readinessInspectionCheckpointSummary: null
    };
  }

  const readinessInspectionCheckpoint = readinessInspectionCheckpoints[0];

  return {
    readinessHandoffDisposition:
      reviewOnlyReadinessHandoffDispositionStateFromCheckpoint(
        readinessInspectionCheckpoint,
        reviewedAt
      ),
    readinessInspectionCheckpointSummary:
      reviewOnlyReadinessHandoffDispositionSummaryFromCheckpoint(
        readinessInspectionCheckpoint
      )
  };
}

function reviewOnlyReadinessHandoffDispositionResult({
  reviewedAt,
  reviewedAtDefaulted,
  classification,
  accepted,
  readinessHandoffDisposition,
  readinessInspectionCheckpointSummary
}) {
  return {
    schema: REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_BOUNDARY_SCHEMA,
    schemaVersion: REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_BOUNDARY_VERSION,
    boundaryKind: REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_BOUNDARY_KIND,
    boundaryMode: "review-only",
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    readinessInspectionCheckpointAccepted: accepted,
    readinessHandoffDispositionProduced: accepted,
    readinessHandoffDispositionIsReviewerRouting: false,
    readinessHandoffDispositionIsReviewerAssignment: false,
    readinessHandoffDispositionIsEvaluatorExecution: false,
    readinessHandoffDispositionIsEvaluatorResult: false,
    readinessHandoffDispositionIsApprovalDecision: false,
    readinessHandoffDispositionIsApprovalGrant: false,
    readinessHandoffDisposition,
    readinessInspectionCheckpointSummary,
    reviewOnly: true,
    authoritative: false,
    reviewArtifactOnly: true,
    readinessHandoffDispositionMetadataOnly: true,
    reviewerRoutingPerformed: false,
    reviewerRoutingEnabled: false,
    reviewerRouteId: null,
    reviewerAssignmentPerformed: false,
    reviewerAssignmentEnabled: false,
    reviewerAssignmentId: null,
    reviewerId: null,
    evaluatorResultProduced: false,
    evaluatorResultPersisted: false,
    evaluatorResultId: null,
    approvalDecisionProduced: false,
    approvalDecisionPersisted: false,
    approvalDecisionId: null,
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
    rejectionReasons: reviewOnlyReadinessHandoffDispositionRejectionReasons({
      accepted,
      classification
    }),
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

export function createReviewOnlyReadinessHandoffDispositionBoundaryForReview(
  input = {}
) {
  const inputRecord = reviewOnlyReadinessHandoffDispositionInputRecord(input);
  const reviewedAt =
    reviewOnlyReadinessHandoffDispositionReviewedAt(inputRecord);
  const reviewedAtDefaulted = isReviewedAtDefaulted(inputRecord);
  const readinessInspectionCheckpoints =
    reviewOnlyReadinessHandoffDispositionCheckpoints(inputRecord);
  const classification =
    reviewOnlyReadinessHandoffDispositionInputClassification(
      inputRecord,
      readinessInspectionCheckpoints
    );
  const accepted =
    classification ===
    VALID_REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_CLASSIFICATION;
  const { readinessHandoffDisposition, readinessInspectionCheckpointSummary } =
    reviewOnlyReadinessHandoffDispositionAcceptedOutput({
      accepted,
      readinessInspectionCheckpoints,
      reviewedAt
    });

  return reviewOnlyReadinessHandoffDispositionResult({
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    accepted,
    readinessHandoffDisposition,
    readinessInspectionCheckpointSummary
  });
}

const REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_STATE_SCHEMA =
  "ardyn.phase-5.37.review-only-handoff-disposition-inspection-checkpoint-state";

const REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_MIN_REVIEWED_AT =
  "2026-06-17T00:00:00.000Z";

const VALID_REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_CLASSIFICATION =
  "valid_review_only_handoff_disposition_inspection_checkpoint_runtime_still_blocked";
const REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_SOURCE_FIELDS =
  Object.freeze([
    "schema",
    "schemaVersion",
    "stateKind",
    "stateMode",
    "reviewedAt",
    "sourceReadinessInspectionCheckpoint",
    "pipelineSummary",
    "integratedReviewSummary",
    "decisionCandidateSummary",
    "inspectionSummary",
    "dispositionSummary",
    "aggregationSummary",
    "handoffSummary",
    "readinessSummary",
    "inspectionCheckpointSummary",
    "readinessHandoffDispositionSummary",
    "readinessInspectionCheckpointAccepted",
    "readinessHandoffDispositionMetadataOnly",
    "readinessHandoffDispositionIsReviewerRouting",
    "readinessHandoffDispositionIsReviewerAssignment",
    "readinessHandoffDispositionIsEvaluatorExecution",
    "readinessHandoffDispositionIsEvaluatorResult",
    "readinessHandoffDispositionIsApprovalDecision",
    "readinessHandoffDispositionIsApprovalGrant",
    "reviewerRoutingPerformed",
    "reviewerRoutingEnabled",
    "reviewerRouteId",
    "reviewerAssignmentPerformed",
    "reviewerAssignmentEnabled",
    "reviewerAssignmentId",
    "reviewerId",
    "evaluatorResultProduced",
    "evaluatorResultPersisted",
    "evaluatorResultId",
    "approvalDecisionProduced",
    "approvalDecisionPersisted",
    "approvalDecisionId",
    "approvalGrantProduced",
    "approvalGrantPersisted",
    "approvalGrantId",
    "runtimePermissionGranted",
    "commandExposurePermissionGranted",
    "runtimeCommandExposureEnabled",
    "runtimeExecutionEnabled",
    "evaluatorExecutionRequested",
    "evaluatorExecutionStarted",
    "evaluatorExecutionEnabled",
    "evaluatorExecuted",
    "runtimeEffect"
  ]);

const REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_SOURCE_READINESS_FIELDS =
  Object.freeze([
    "schema",
    "stateKind",
    "stateMode",
    "reviewedAt",
    "stateDigest",
    "sourceHandoffReadinessArtifactDigest",
    "sourceInspectionHandoffStateDigest",
    "sourceAggregationStateDigest",
    "sourceDispositionStateDigest",
    "sourceInspectionArtifactDigest",
    "sourceDecisionCandidateStateDigest",
    "sourcePreflightCheckpointStateDigest",
    "sourceIntakeCheckpointStateDigest",
    "sourceEvaluatorInputCandidateDigest",
    "readinessArtifactAccepted",
    "readinessInspectionCheckpointMetadataOnly",
    "readinessInspectionCheckpointIsReviewerRouting",
    "readinessInspectionCheckpointIsReviewerAssignment",
    "readinessInspectionCheckpointIsEvaluatorExecution",
    "readinessInspectionCheckpointIsEvaluatorResult",
    "readinessInspectionCheckpointIsApprovalDecision",
    "readinessInspectionCheckpointIsApprovalGrant",
    "reviewerRoutingPerformed",
    "reviewerAssignmentPerformed",
    "evaluatorResultProduced",
    "approvalDecisionProduced",
    "approvalGrantProduced",
    "approvalGrantPersisted",
    "evaluatorExecuted",
    "runtimeEffectAllFalse"
  ]);

const REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_DISPOSITION_SUMMARY_FIELDS =
  Object.freeze([
    "dispositionKind",
    "dispositionMode",
    "sourceReadinessInspectionClassification",
    "readinessHandoffDispositionMetadataOnly",
    "reviewerRoutingPerformed",
    "reviewerAssignmentPerformed",
    "evaluatorExecutionPerformed",
    "evaluatorResultProduced",
    "approvalDecisionProduced",
    "approvalGrantProduced",
    "runtimePermissionGranted",
    "commandExposurePermissionGranted",
    "evaluatorExecuted",
    "runtimeEffectAllFalse"
  ]);

const REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_REQUIRED_FALSE_FIELDS =
  Object.freeze([
    "readinessHandoffDispositionIsReviewerRouting",
    "readinessHandoffDispositionIsReviewerAssignment",
    "readinessHandoffDispositionIsEvaluatorExecution",
    "readinessHandoffDispositionIsEvaluatorResult",
    "readinessHandoffDispositionIsApprovalDecision",
    "readinessHandoffDispositionIsApprovalGrant",
    "reviewerRoutingPerformed",
    "reviewerRoutingEnabled",
    "reviewerAssignmentPerformed",
    "reviewerAssignmentEnabled",
    "evaluatorResultProduced",
    "evaluatorResultPersisted",
    "approvalDecisionProduced",
    "approvalDecisionPersisted",
    "approvalGrantProduced",
    "approvalGrantPersisted",
    "runtimePermissionGranted",
    "commandExposurePermissionGranted",
    "runtimeCommandExposureEnabled",
    "runtimeExecutionEnabled",
    "evaluatorExecutionRequested",
    "evaluatorExecutionStarted",
    "evaluatorExecutionEnabled",
    "evaluatorExecuted"
  ]);

const REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_REQUIRED_NULL_FIELDS =
  Object.freeze([
    "reviewerRouteId",
    "reviewerAssignmentId",
    "reviewerId",
    "evaluatorResultId",
    "approvalDecisionId",
    "approvalGrantId"
  ]);

const REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_ALLOWED_FIELDS =
  new Set([
    ...REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_SOURCE_FIELDS,
    ...REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_SOURCE_READINESS_FIELDS,
    ...REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_DISPOSITION_SUMMARY_FIELDS,
    ...REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_CHECKPOINT_SUMMARY_FIELDS,
    ...REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_READINESS_SUMMARY_FIELDS,
    ...REVIEW_ONLY_HANDOFF_READINESS_ARTIFACT_HANDOFF_SUMMARY_FIELDS,
    ...REVIEW_ONLY_AGGREGATION_INSPECTION_HANDOFF_AGGREGATION_SUMMARY_FIELDS,
    ...HUMAN_TOOL_INSPECTION_DISPOSITION_INSPECTION_SUMMARY_FIELDS,
    ...REVIEW_ONLY_DISPOSITION_AGGREGATION_DISPOSITION_SUMMARY_FIELDS,
    ...NON_AUTHORIZING_EVALUATOR_DECISION_CANDIDATE_INSPECTION_SUMMARY_FIELDS,
    ...NON_AUTHORIZING_EVALUATOR_DECISION_PIPELINE_SUMMARY_FIELDS,
    ...NON_AUTHORIZING_EVALUATOR_DECISION_INTEGRATED_SUMMARY_FIELDS
  ]);

const REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_SOURCE_CHECKS =
  Object.freeze([
    [
      "schema",
      (value) => value === REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_STATE_SCHEMA
    ],
    [
      "schemaVersion",
      (value) =>
        value === REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_BOUNDARY_VERSION
    ],
    [
      "stateKind",
      (value) => value === "review-only-readiness-handoff-disposition-state"
    ],
    ["stateMode", (value) => value === "review-only"],
    ["reviewedAt", isUtcIsoTimestampWithMilliseconds],
    ["sourceReadinessInspectionCheckpoint", isPlainObjectRecord],
    ["pipelineSummary", isPlainObjectRecord],
    ["integratedReviewSummary", isPlainObjectRecord],
    ["decisionCandidateSummary", isPlainObjectRecord],
    ["inspectionSummary", isPlainObjectRecord],
    ["dispositionSummary", isPlainObjectRecord],
    ["aggregationSummary", isPlainObjectRecord],
    ["handoffSummary", isPlainObjectRecord],
    ["readinessSummary", isPlainObjectRecord],
    ["inspectionCheckpointSummary", isPlainObjectRecord],
    ["readinessHandoffDispositionSummary", isPlainObjectRecord],
    ["readinessInspectionCheckpointAccepted", (value) => value === true],
    ["readinessHandoffDispositionMetadataOnly", (value) => value === true],
    ["runtimeEffect", isPlainObjectRecord]
  ]);

const REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_SOURCE_READINESS_CHECKS =
  Object.freeze([
    [
      "schema",
      (value) => value === REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_STATE_SCHEMA
    ],
    [
      "stateKind",
      (value) => value === "review-only-readiness-inspection-checkpoint-state"
    ],
    ["stateMode", (value) => value === "review-only"],
    ["reviewedAt", isUtcIsoTimestampWithMilliseconds],
    ["stateDigest", (value) => typeof value === "string" && /^sha256:[0-9a-f]{64}$/.test(value)],
    [
      "sourceHandoffReadinessArtifactDigest",
      (value) => typeof value === "string" && /^sha256:[0-9a-f]{64}$/.test(value)
    ],
    [
      "sourceInspectionHandoffStateDigest",
      (value) => typeof value === "string" && /^sha256:[0-9a-f]{64}$/.test(value)
    ],
    [
      "sourceAggregationStateDigest",
      (value) => typeof value === "string" && /^sha256:[0-9a-f]{64}$/.test(value)
    ],
    [
      "sourceDispositionStateDigest",
      (value) => typeof value === "string" && /^sha256:[0-9a-f]{64}$/.test(value)
    ],
    [
      "sourceInspectionArtifactDigest",
      (value) => typeof value === "string" && /^sha256:[0-9a-f]{64}$/.test(value)
    ],
    [
      "sourceDecisionCandidateStateDigest",
      (value) => typeof value === "string" && /^sha256:[0-9a-f]{64}$/.test(value)
    ],
    [
      "sourcePreflightCheckpointStateDigest",
      (value) => typeof value === "string" && /^sha256:[0-9a-f]{64}$/.test(value)
    ],
    [
      "sourceIntakeCheckpointStateDigest",
      (value) => typeof value === "string" && /^sha256:[0-9a-f]{64}$/.test(value)
    ],
    [
      "sourceEvaluatorInputCandidateDigest",
      (value) => typeof value === "string" && /^sha256:[0-9a-f]{64}$/.test(value)
    ],
    ["readinessArtifactAccepted", (value) => value === true],
    ["readinessInspectionCheckpointMetadataOnly", (value) => value === true],
    ["readinessInspectionCheckpointIsReviewerRouting", (value) => value === false],
    ["readinessInspectionCheckpointIsReviewerAssignment", (value) => value === false],
    ["readinessInspectionCheckpointIsEvaluatorExecution", (value) => value === false],
    ["readinessInspectionCheckpointIsEvaluatorResult", (value) => value === false],
    ["readinessInspectionCheckpointIsApprovalDecision", (value) => value === false],
    ["readinessInspectionCheckpointIsApprovalGrant", (value) => value === false],
    ["reviewerRoutingPerformed", (value) => value === false],
    ["reviewerAssignmentPerformed", (value) => value === false],
    ["evaluatorResultProduced", (value) => value === false],
    ["approvalDecisionProduced", (value) => value === false],
    ["approvalGrantProduced", (value) => value === false],
    ["approvalGrantPersisted", (value) => value === false],
    ["evaluatorExecuted", (value) => value === false],
    ["runtimeEffectAllFalse", (value) => value === true]
  ]);

const REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_DISPOSITION_SUMMARY_CHECKS =
  Object.freeze([
    [
      "dispositionKind",
      (value) => value === "review-only-readiness-handoff-disposition"
    ],
    ["dispositionMode", (value) => value === "review-only"],
    [
      "sourceReadinessInspectionClassification",
      (value) =>
        value === VALID_REVIEW_ONLY_READINESS_INSPECTION_CHECKPOINT_CLASSIFICATION
    ],
    ["readinessHandoffDispositionMetadataOnly", (value) => value === true],
    ["reviewerRoutingPerformed", (value) => value === false],
    ["reviewerAssignmentPerformed", (value) => value === false],
    ["evaluatorExecutionPerformed", (value) => value === false],
    ["evaluatorResultProduced", (value) => value === false],
    ["approvalDecisionProduced", (value) => value === false],
    ["approvalGrantProduced", (value) => value === false],
    ["runtimePermissionGranted", (value) => value === false],
    ["commandExposurePermissionGranted", (value) => value === false],
    ["evaluatorExecuted", (value) => value === false],
    ["runtimeEffectAllFalse", (value) => value === true]
  ]);

const REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_FALSE_PATHS =
  Object.freeze({
    approvalDecision: [
      ["readinessHandoffDispositionIsApprovalDecision"],
      ["approvalDecisionProduced"],
      ["approvalDecisionPersisted"],
      ["readinessHandoffDispositionSummary", "approvalDecisionProduced"],
      ["inspectionCheckpointSummary", "approvalDecisionProduced"],
      ["inspectionSummary", "approvalDecisionProduced"],
      ["decisionCandidateSummary", "approvalDecisionProduced"],
      ["dispositionSummary", "approvalDecisionProduced"],
      ["aggregationSummary", "approvalDecisionProduced"],
      ["handoffSummary", "approvalDecisionProduced"],
      ["readinessSummary", "approvalDecisionProduced"]
    ],
    approvalGrant: [
      ["readinessHandoffDispositionIsApprovalGrant"],
      ["approvalGrantProduced"],
      ["approvalGrantPersisted"],
      ["sourceReadinessInspectionCheckpoint", "readinessInspectionCheckpointIsApprovalGrant"],
      ["sourceReadinessInspectionCheckpoint", "approvalGrantProduced"],
      ["sourceReadinessInspectionCheckpoint", "approvalGrantPersisted"],
      ["integratedReviewSummary", "reviewSummaryIsApprovalGrant"],
      ["integratedReviewSummary", "approvalGrantProduced"],
      ["integratedReviewSummary", "approvalGrantPersisted"],
      ["readinessHandoffDispositionSummary", "approvalGrantProduced"],
      ["inspectionCheckpointSummary", "approvalGrantProduced"],
      ["inspectionSummary", "approvalGrantProduced"],
      ["decisionCandidateSummary", "approvalGrantProduced"],
      ["dispositionSummary", "approvalGrantProduced"],
      ["aggregationSummary", "approvalGrantProduced"],
      ["handoffSummary", "approvalGrantProduced"],
      ["readinessSummary", "approvalGrantProduced"]
    ],
    evaluatorResult: [
      ["readinessHandoffDispositionIsEvaluatorResult"],
      ["evaluatorResultProduced"],
      ["evaluatorResultPersisted"],
      ["sourceReadinessInspectionCheckpoint", "readinessInspectionCheckpointIsEvaluatorResult"],
      ["sourceReadinessInspectionCheckpoint", "evaluatorResultProduced"],
      ["readinessHandoffDispositionSummary", "evaluatorResultProduced"],
      ["inspectionCheckpointSummary", "evaluatorResultProduced"],
      ["readinessSummary", "evaluatorResultProduced"],
      ["aggregationSummary", "evaluatorResultProduced"],
      ["inspectionSummary", "evaluatorResultProduced"],
      ["dispositionSummary", "evaluatorResultProduced"],
      ["handoffSummary", "evaluatorResultProduced"]
    ],
    reviewerRouting: [
      ["readinessHandoffDispositionIsReviewerRouting"],
      ["reviewerRoutingPerformed"],
      ["reviewerRoutingEnabled"],
      ["sourceReadinessInspectionCheckpoint", "readinessInspectionCheckpointIsReviewerRouting"],
      ["sourceReadinessInspectionCheckpoint", "reviewerRoutingPerformed"],
      ["readinessHandoffDispositionSummary", "reviewerRoutingPerformed"],
      ["inspectionCheckpointSummary", "reviewerRoutingPerformed"],
      ["readinessSummary", "reviewerRoutingPerformed"]
    ],
    reviewerAssignment: [
      ["readinessHandoffDispositionIsReviewerAssignment"],
      ["reviewerAssignmentPerformed"],
      ["reviewerAssignmentEnabled"],
      ["sourceReadinessInspectionCheckpoint", "readinessInspectionCheckpointIsReviewerAssignment"],
      ["sourceReadinessInspectionCheckpoint", "reviewerAssignmentPerformed"],
      ["readinessHandoffDispositionSummary", "reviewerAssignmentPerformed"],
      ["inspectionCheckpointSummary", "reviewerAssignmentPerformed"],
      ["readinessSummary", "reviewerAssignmentPerformed"]
    ],
    evaluatorExecution: [
      ["readinessHandoffDispositionIsEvaluatorExecution"],
      ["evaluatorExecutionRequested"],
      ["evaluatorExecutionStarted"],
      ["evaluatorExecutionEnabled"],
      ["evaluatorExecuted"],
      ["sourceReadinessInspectionCheckpoint", "readinessInspectionCheckpointIsEvaluatorExecution"],
      ["sourceReadinessInspectionCheckpoint", "evaluatorExecuted"],
      ["readinessHandoffDispositionSummary", "evaluatorExecuted"],
      ["inspectionCheckpointSummary", "evaluatorExecuted"],
      ["readinessSummary", "evaluatorExecuted"]
    ],
    runtimePermission: [
      ["runtimePermissionGranted"],
      ["readinessHandoffDispositionSummary", "runtimePermissionGranted"],
      ["inspectionCheckpointSummary", "runtimePermissionGranted"],
      ["readinessSummary", "runtimePermissionGranted"]
    ],
    commandExposure: [
      ["commandExposurePermissionGranted"],
      ["runtimeCommandExposureEnabled"],
      ["readinessHandoffDispositionSummary", "commandExposurePermissionGranted"],
      ["inspectionCheckpointSummary", "commandExposurePermissionGranted"],
      ["readinessSummary", "commandExposurePermissionGranted"]
    ],
    runtimeExecution: [["runtimeExecutionEnabled"]]
  });

const REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_NULL_PATHS =
  Object.freeze({
    approvalDecision: [["approvalDecisionId"]],
    approvalGrant: [["approvalGrantId"], ["integratedReviewSummary", "approvalGrantId"]],
    evaluatorResult: [["evaluatorResultId"]],
    reviewerRouting: [["reviewerRouteId"]],
    reviewerAssignment: [["reviewerAssignmentId"], ["reviewerId"]]
  });

const REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_OBJECT_FIELD_GROUPS =
  Object.freeze({
    approvalDecision: [
      "approvalDecision",
      "approvalDecisionResult",
      "approvalDecisionGranted",
      "approvalDecisionAccepted",
      "approvalDecisionAuthorized",
      "handoffDispositionInspectionCheckpointIsApprovalDecision"
    ],
    evaluatorResult: [
      "evaluatorResult",
      "evaluationResult",
      "evaluatorOutput",
      "evaluatorOutcome",
      "resultProduced"
    ],
    reviewerRouting: [
      "reviewerRouting",
      "reviewerRoute",
      "reviewerQueue",
      "routing",
      "routingDecision",
      "routingResult",
      "routeReviewer",
      "reviewerRoutingPermissionGranted"
    ],
    reviewerAssignment: [
      "reviewerAssignment",
      "reviewerAssigned",
      "reviewerAssignee",
      "assignedReviewer",
      "assignedReviewers",
      "reviewerIds",
      "reviewerAllocation",
      "assignmentDecision",
      "humanReviewer",
      "toolReviewer",
      "reviewerAssignmentPermissionGranted"
    ]
  });

const REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_GRANT_KEY_PATTERN =
  /(^|_|\b)grant(ed|ing|Id|Produced|Persisted)?($|_|\b)/i;

function reviewOnlyHandoffDispositionInspectionCheckpointKeyPresent(
  value,
  keys,
  seen = new Set()
) {
  if (Array.isArray(value)) {
    return value.some((entry) =>
      reviewOnlyHandoffDispositionInspectionCheckpointKeyPresent(
        entry,
        keys,
        seen
      )
    );
  }

  if (!isPlainObjectRecord(value) || seen.has(value)) {
    return false;
  }

  seen.add(value);

  return Object.entries(value).some(
    ([key, entry]) =>
      keys.includes(key) ||
      reviewOnlyHandoffDispositionInspectionCheckpointKeyPresent(entry, keys, seen)
  );
}

function reviewOnlyHandoffDispositionInspectionCheckpointKeyTruePresent(
  value,
  keys,
  seen = new Set()
) {
  if (Array.isArray(value)) {
    return value.some((entry) =>
      reviewOnlyHandoffDispositionInspectionCheckpointKeyTruePresent(
        entry,
        keys,
        seen
      )
    );
  }

  if (!isPlainObjectRecord(value) || seen.has(value)) {
    return false;
  }

  seen.add(value);

  return Object.entries(value).some(
    ([key, entry]) =>
      (keys.includes(key) && entry === true) ||
      reviewOnlyHandoffDispositionInspectionCheckpointKeyTruePresent(
        entry,
        keys,
        seen
      )
  );
}

function reviewOnlyHandoffDispositionInspectionCheckpointUnexpectedUnsafeField(
  value,
  seen = new Set()
) {
  if (Array.isArray(value)) {
    return value.some((entry) =>
      reviewOnlyHandoffDispositionInspectionCheckpointUnexpectedUnsafeField(
        entry,
        seen
      )
    );
  }

  if (!isPlainObjectRecord(value) || seen.has(value)) {
    return false;
  }

  seen.add(value);

  return Object.entries(value).some(
    ([key, entry]) =>
      (!REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_ALLOWED_FIELDS.has(
        key
      ) &&
        APPROVAL_EVALUATOR_CANDIDATE_UNSAFE_TRUE_FIELD_PATTERN.test(key)) ||
      reviewOnlyHandoffDispositionInspectionCheckpointUnexpectedUnsafeField(
        entry,
        seen
      )
  );
}

function reviewOnlyHandoffDispositionInspectionCheckpointPathMismatch(
  readinessHandoffDisposition,
  pathGroup,
  expected
) {
  return pathGroup.some((path) =>
    reviewOnlyEvaluatorPreflightPathDoesNotMatch(
      readinessHandoffDisposition,
      path,
      expected
    )
  );
}

function reviewOnlyHandoffDispositionInspectionCheckpointUnknown(
  readinessHandoffDisposition
) {
  return (
    (typeof readinessHandoffDisposition.schema === "string" &&
      readinessHandoffDisposition.schema !==
        REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_STATE_SCHEMA) ||
    (typeof readinessHandoffDisposition.stateKind === "string" &&
      readinessHandoffDisposition.stateKind !==
        "review-only-readiness-handoff-disposition-state")
  );
}

function reviewOnlyHandoffDispositionInspectionCheckpointRevoked(
  readinessHandoffDisposition
) {
  return (
    readinessHandoffDisposition.revoked === true ||
    (isPlainObjectRecord(readinessHandoffDisposition.revocation) &&
      readinessHandoffDisposition.revocation.revoked === true)
  );
}

function reviewOnlyHandoffDispositionInspectionCheckpointStale(
  readinessHandoffDisposition
) {
  return (
    isUtcIsoTimestampWithMilliseconds(readinessHandoffDisposition.reviewedAt) &&
    readinessHandoffDisposition.reviewedAt <
      REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_MIN_REVIEWED_AT
  );
}

const REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_MALFORMED_CHECKS =
  Object.freeze([
    (readinessHandoffDisposition) =>
      !recordHasExactFields(
        readinessHandoffDisposition,
        REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_SOURCE_FIELDS
      ),
    (readinessHandoffDisposition) =>
      !recordPassesChecks(
        readinessHandoffDisposition,
        REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_SOURCE_CHECKS
      ),
    (readinessHandoffDisposition) =>
      !recordHasExactFields(
        readinessHandoffDisposition.sourceReadinessInspectionCheckpoint,
        REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_SOURCE_READINESS_FIELDS
      ),
    (readinessHandoffDisposition) =>
      !recordPassesChecks(
        readinessHandoffDisposition.sourceReadinessInspectionCheckpoint,
        REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_SOURCE_READINESS_CHECKS
      ),
    (readinessHandoffDisposition) =>
      !recordHasExactFields(
        readinessHandoffDisposition.readinessHandoffDispositionSummary,
        REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_DISPOSITION_SUMMARY_FIELDS
      ),
    (readinessHandoffDisposition) =>
      !recordPassesChecks(
        readinessHandoffDisposition.readinessHandoffDispositionSummary,
        REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_DISPOSITION_SUMMARY_CHECKS
      ),
    (readinessHandoffDisposition) =>
      REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_REQUIRED_FALSE_FIELDS.some(
        (field) => readinessHandoffDisposition[field] !== false
      ),
    (readinessHandoffDisposition) =>
      REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_REQUIRED_NULL_FIELDS.some(
        (field) => readinessHandoffDisposition[field] !== null
      ),
    (readinessHandoffDisposition) =>
      !reviewOnlyRuntimeEffectAllFalse(readinessHandoffDisposition.runtimeEffect)
  ]);

function reviewOnlyHandoffDispositionInspectionCheckpointMalformed(
  readinessHandoffDisposition
) {
  return REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_MALFORMED_CHECKS.some(
    (predicate) => predicate(readinessHandoffDisposition)
  );
}

function reviewOnlyHandoffDispositionInspectionCheckpointGrantLooking(
  readinessHandoffDisposition
) {
  return Object.entries(readinessHandoffDisposition).some(
    ([key, value]) =>
      REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_GRANT_KEY_PATTERN.test(
        key
      ) &&
      value !== false &&
      value !== null &&
      value !== undefined
  );
}

function reviewOnlyHandoffDispositionInspectionCheckpointApprovalDecisionLooking(
  readinessHandoffDisposition
) {
  return (
    reviewOnlyHandoffDispositionInspectionCheckpointPathMismatch(
      readinessHandoffDisposition,
      REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_FALSE_PATHS
        .approvalDecision,
      false
    ) ||
    reviewOnlyHandoffDispositionInspectionCheckpointPathMismatch(
      readinessHandoffDisposition,
      REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_NULL_PATHS
        .approvalDecision,
      null
    ) ||
    reviewOnlyHandoffDispositionInspectionCheckpointKeyTruePresent(
      readinessHandoffDisposition,
      REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_OBJECT_FIELD_GROUPS
        .approvalDecision
    )
  );
}

function reviewOnlyHandoffDispositionInspectionCheckpointApprovalGrantLooking(
  readinessHandoffDisposition
) {
  return (
    reviewOnlyHandoffDispositionInspectionCheckpointPathMismatch(
      readinessHandoffDisposition,
      REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_FALSE_PATHS
        .approvalGrant,
      false
    ) ||
    reviewOnlyHandoffDispositionInspectionCheckpointPathMismatch(
      readinessHandoffDisposition,
      REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_NULL_PATHS
        .approvalGrant,
      null
    )
  );
}

function reviewOnlyHandoffDispositionInspectionCheckpointEvaluatorResultLooking(
  readinessHandoffDisposition
) {
  return (
    reviewOnlyHandoffDispositionInspectionCheckpointPathMismatch(
      readinessHandoffDisposition,
      REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_FALSE_PATHS
        .evaluatorResult,
      false
    ) ||
    reviewOnlyHandoffDispositionInspectionCheckpointPathMismatch(
      readinessHandoffDisposition,
      REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_NULL_PATHS
        .evaluatorResult,
      null
    ) ||
    reviewOnlyHandoffDispositionInspectionCheckpointKeyTruePresent(
      readinessHandoffDisposition,
      REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_OBJECT_FIELD_GROUPS
        .evaluatorResult
    )
  );
}

function reviewOnlyHandoffDispositionInspectionCheckpointEvaluatorExecutionLooking(
  readinessHandoffDisposition
) {
  return reviewOnlyHandoffDispositionInspectionCheckpointPathMismatch(
    readinessHandoffDisposition,
    REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_FALSE_PATHS
      .evaluatorExecution,
    false
  );
}

function reviewOnlyHandoffDispositionInspectionCheckpointReviewerRoutingLooking(
  readinessHandoffDisposition
) {
  return (
    reviewOnlyHandoffDispositionInspectionCheckpointPathMismatch(
      readinessHandoffDisposition,
      REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_FALSE_PATHS
        .reviewerRouting,
      false
    ) ||
    reviewOnlyHandoffDispositionInspectionCheckpointPathMismatch(
      readinessHandoffDisposition,
      REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_NULL_PATHS
        .reviewerRouting,
      null
    ) ||
    reviewOnlyHandoffDispositionInspectionCheckpointKeyPresent(
      readinessHandoffDisposition,
      REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_OBJECT_FIELD_GROUPS
        .reviewerRouting
    )
  );
}

function reviewOnlyHandoffDispositionInspectionCheckpointReviewerAssignmentLooking(
  readinessHandoffDisposition
) {
  return (
    reviewOnlyHandoffDispositionInspectionCheckpointPathMismatch(
      readinessHandoffDisposition,
      REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_FALSE_PATHS
        .reviewerAssignment,
      false
    ) ||
    reviewOnlyHandoffDispositionInspectionCheckpointPathMismatch(
      readinessHandoffDisposition,
      REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_NULL_PATHS
        .reviewerAssignment,
      null
    ) ||
    reviewOnlyHandoffDispositionInspectionCheckpointKeyPresent(
      readinessHandoffDisposition,
      REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_OBJECT_FIELD_GROUPS
        .reviewerAssignment
    )
  );
}

function reviewOnlyHandoffDispositionInspectionCheckpointRuntimePermissionLooking(
  readinessHandoffDisposition
) {
  return (
    reviewOnlyHandoffDispositionInspectionCheckpointPathMismatch(
      readinessHandoffDisposition,
      REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_FALSE_PATHS
        .runtimePermission,
      false
    ) ||
    reviewOnlyHandoffDispositionInspectionCheckpointKeyTruePresent(
      readinessHandoffDisposition,
      [
        "runtimePermission",
        "runtimeAuthorization",
        "runtimeAuthorized"
      ]
    )
  );
}

function reviewOnlyHandoffDispositionInspectionCheckpointCommandExposureLooking(
  readinessHandoffDisposition
) {
  return (
    reviewOnlyHandoffDispositionInspectionCheckpointPathMismatch(
      readinessHandoffDisposition,
      REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_FALSE_PATHS
        .commandExposure,
      false
    ) ||
    reviewOnlyHandoffDispositionInspectionCheckpointKeyTruePresent(
      readinessHandoffDisposition,
      [
        "commandExposure",
        "commandExposurePermission",
        "runtimeCommandEnabled",
        "commandsExposed"
      ]
    )
  );
}

function reviewOnlyHandoffDispositionInspectionCheckpointRuntimeEffectTrue(
  readinessHandoffDisposition
) {
  return (
    !reviewOnlyRuntimeEffectAllFalse(readinessHandoffDisposition.runtimeEffect) ||
    reviewOnlyHandoffDispositionInspectionCheckpointKeyTruePresent(
      readinessHandoffDisposition,
      ["runtimeStarted", "runtimeReady", "runtimeExecuted"]
    )
  );
}

function reviewOnlyHandoffDispositionInspectionCheckpointProcessFlagTrue(
  readinessHandoffDisposition
) {
  return reviewOnlyHandoffDispositionInspectionCheckpointKeyTruePresent(
    readinessHandoffDisposition,
    [
      "processStarted",
      "processSpawned",
      "processSpawnEnabled",
      "processRunning",
      "processKilled",
      "processControlEnabled"
    ]
  );
}

function reviewOnlyHandoffDispositionInspectionCheckpointUnsafeTrueSurface(
  readinessHandoffDisposition
) {
  return reviewOnlyHandoffDispositionInspectionCheckpointKeyTruePresent(
    readinessHandoffDisposition,
    [
      "filesystemWatcherEnabled",
      "externalLookupEnabled",
      "externalSourceLookupEnabled",
      "secretsEnvIngestionEnabled",
      "envIngestionEnabled",
      "webSocketHttpSurfaceEnabled",
      "adapterRuntimeBehaviorEnabled",
      "contentFabricRuntimeBehaviorEnabled"
    ]
  );
}

function reviewOnlyHandoffDispositionInspectionCheckpointExecutionSignalLooking(
  readinessHandoffDisposition
) {
  return (
    reviewOnlyHandoffDispositionInspectionCheckpointPathMismatch(
      readinessHandoffDisposition,
      REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_FALSE_PATHS
        .runtimeExecution,
      false
    ) ||
    reviewOnlyHandoffDispositionInspectionCheckpointKeyTruePresent(
      readinessHandoffDisposition,
      [
        "executionSignal",
        "executionRequested",
        "executionStarted",
        "executionEnabled",
        "execute",
        "startRuntime"
      ]
    )
  );
}

function reviewOnlyHandoffDispositionInspectionCheckpointAuthorizing(
  readinessHandoffDisposition
) {
  return (
    readinessHandoffDisposition.reviewOnly !== true &&
    readinessHandoffDisposition.authoritative === true
  ) || reviewOnlyHandoffDispositionInspectionCheckpointKeyTruePresent(
    readinessHandoffDisposition,
    [
      "authorization",
      "authorized",
      "authorizing",
      "authorizationGranted",
      "approvalAuthorized",
      "permissionGranted"
    ]
  );
}

const REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_SINGLE_REJECTION_CHECKS =
  Object.freeze([
    [
      reviewOnlyHandoffDispositionInspectionCheckpointUnknown,
      "unknown_review_only_handoff_disposition_inspection_checkpoint_input_rejected"
    ],
    [
      reviewOnlyHandoffDispositionInspectionCheckpointRevoked,
      "revoked_review_only_handoff_disposition_inspection_checkpoint_input_rejected"
    ],
    [
      reviewOnlyHandoffDispositionInspectionCheckpointStale,
      "stale_review_only_handoff_disposition_inspection_checkpoint_input_rejected"
    ],
    [
      reviewOnlyHandoffDispositionInspectionCheckpointApprovalDecisionLooking,
      "approval_decision_looking_review_only_handoff_disposition_inspection_checkpoint_input_rejected"
    ],
    [
      reviewOnlyHandoffDispositionInspectionCheckpointReviewerRoutingLooking,
      "reviewer_routing_looking_review_only_handoff_disposition_inspection_checkpoint_input_rejected"
    ],
    [
      reviewOnlyHandoffDispositionInspectionCheckpointReviewerAssignmentLooking,
      "reviewer_assignment_looking_review_only_handoff_disposition_inspection_checkpoint_input_rejected"
    ],
    [
      reviewOnlyHandoffDispositionInspectionCheckpointUnexpectedUnsafeField,
      "unsafe_review_only_handoff_disposition_inspection_checkpoint_input_rejected"
    ],
    [
      reviewOnlyHandoffDispositionInspectionCheckpointGrantLooking,
      "grant_looking_review_only_handoff_disposition_inspection_checkpoint_input_rejected"
    ],
    [
      reviewOnlyHandoffDispositionInspectionCheckpointApprovalGrantLooking,
      "approval_grant_looking_review_only_handoff_disposition_inspection_checkpoint_input_rejected"
    ],
    [
      reviewOnlyHandoffDispositionInspectionCheckpointEvaluatorResultLooking,
      "evaluator_result_looking_review_only_handoff_disposition_inspection_checkpoint_input_rejected"
    ],
    [
      reviewOnlyHandoffDispositionInspectionCheckpointEvaluatorExecutionLooking,
      "evaluator_execution_looking_review_only_handoff_disposition_inspection_checkpoint_input_rejected"
    ],
    [
      reviewOnlyHandoffDispositionInspectionCheckpointRuntimePermissionLooking,
      "runtime_permission_looking_review_only_handoff_disposition_inspection_checkpoint_input_rejected"
    ],
    [
      reviewOnlyHandoffDispositionInspectionCheckpointCommandExposureLooking,
      "command_exposure_looking_review_only_handoff_disposition_inspection_checkpoint_input_rejected"
    ],
    [
      reviewOnlyHandoffDispositionInspectionCheckpointRuntimeEffectTrue,
      "runtime_effect_true_review_only_handoff_disposition_inspection_checkpoint_input_rejected"
    ],
    [
      reviewOnlyHandoffDispositionInspectionCheckpointProcessFlagTrue,
      "process_flag_true_review_only_handoff_disposition_inspection_checkpoint_input_rejected"
    ],
    [
      reviewOnlyHandoffDispositionInspectionCheckpointUnsafeTrueSurface,
      "unsafe_review_only_handoff_disposition_inspection_checkpoint_input_rejected"
    ],
    [
      reviewOnlyHandoffDispositionInspectionCheckpointExecutionSignalLooking,
      "execution_signal_looking_review_only_handoff_disposition_inspection_checkpoint_input_rejected"
    ],
    [
      reviewOnlyHandoffDispositionInspectionCheckpointAuthorizing,
      "authorizing_review_only_handoff_disposition_inspection_checkpoint_input_rejected"
    ],
    [
      reviewOnlyHandoffDispositionInspectionCheckpointMalformed,
      "malformed_review_only_handoff_disposition_inspection_checkpoint_input_rejected"
    ]
  ]);

function reviewOnlyHandoffDispositionInspectionCheckpointSingleClassification(
  readinessHandoffDisposition
) {
  return (
    REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_SINGLE_REJECTION_CHECKS.find(
      ([predicate]) => predicate(readinessHandoffDisposition)
    )?.[1] ??
    VALID_REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_CLASSIFICATION
  );
}

function firstReviewOnlyHandoffDispositionInspectionCheckpointRejection(
  readinessHandoffDispositions
) {
  return (
    readinessHandoffDispositions
      .map(reviewOnlyHandoffDispositionInspectionCheckpointSingleClassification)
      .find(
        (classification) =>
          classification !==
          VALID_REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_CLASSIFICATION
      ) ?? null
  );
}

function reviewOnlyHandoffDispositionInspectionCheckpointInputsContainDuplicate(
  readinessHandoffDispositions
) {
  const digests = readinessHandoffDispositions.map((disposition) =>
    reviewArtifactHandoffDigest(disposition)
  );

  return new Set(digests).size !== digests.length;
}

const REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_RESOLVERS =
  Object.freeze([
    (readinessHandoffDispositions) =>
      readinessHandoffDispositions === undefined
        ? "missing_review_only_handoff_disposition_inspection_checkpoint_input_rejected"
        : null,
    (readinessHandoffDispositions) =>
      !Array.isArray(readinessHandoffDispositions)
        ? "malformed_review_only_handoff_disposition_inspection_checkpoint_input_rejected"
        : null,
    (readinessHandoffDispositions) =>
      readinessHandoffDispositions.length === 0
        ? "empty_review_only_handoff_disposition_inspection_checkpoint_input_rejected"
        : null,
    firstReviewOnlyHandoffDispositionInspectionCheckpointRejection,
    (readinessHandoffDispositions) =>
      reviewOnlyHandoffDispositionInspectionCheckpointInputsContainDuplicate(
        readinessHandoffDispositions
      )
        ? "duplicate_invalid_review_only_handoff_disposition_inspection_checkpoint_input_rejected"
        : null,
    (readinessHandoffDispositions) =>
      readinessHandoffDispositions.length > 1
        ? "conflicting_review_only_handoff_disposition_inspection_checkpoint_input_rejected"
        : null
  ]);

function reviewOnlyHandoffDispositionInspectionCheckpointClassification(
  readinessHandoffDispositions
) {
  let classification = null;

  REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_RESOLVERS.some(
    (resolver) => {
      classification = resolver(readinessHandoffDispositions);
      return classification !== null;
    }
  );

  return (
    classification ??
    VALID_REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_CLASSIFICATION
  );
}

function reviewOnlyHandoffDispositionInspectionCheckpointSummary() {
  return {
    checkpointKind: "review-only-handoff-disposition-inspection-checkpoint",
    checkpointMode: "review-only",
    sourceReadinessHandoffDispositionClassification:
      VALID_REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_CLASSIFICATION,
    handoffDispositionInspectionCheckpointMetadataOnly: true,
    reviewerRoutingPerformed: false,
    reviewerAssignmentPerformed: false,
    evaluatorExecutionPerformed: false,
    evaluatorResultProduced: false,
    approvalDecisionProduced: false,
    approvalGrantProduced: false,
    runtimePermissionGranted: false,
    commandExposurePermissionGranted: false,
    evaluatorExecuted: false,
    runtimeEffectAllFalse: true
  };
}

function reviewOnlyHandoffDispositionInspectionCheckpointStateFromDisposition(
  readinessHandoffDisposition,
  reviewedAt
) {
  return {
    schema: REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_STATE_SCHEMA,
    schemaVersion: REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_VERSION,
    stateKind: "review-only-handoff-disposition-inspection-checkpoint-state",
    stateMode: "review-only",
    reviewedAt,
    sourceReadinessHandoffDisposition: {
      schema: readinessHandoffDisposition.schema,
      stateKind: readinessHandoffDisposition.stateKind,
      stateMode: readinessHandoffDisposition.stateMode,
      reviewedAt: readinessHandoffDisposition.reviewedAt,
      stateDigest: reviewArtifactHandoffDigest(readinessHandoffDisposition),
      sourceReadinessInspectionCheckpointDigest:
        readinessHandoffDisposition.sourceReadinessInspectionCheckpoint
          .stateDigest,
      sourceHandoffReadinessArtifactDigest:
        readinessHandoffDisposition.sourceReadinessInspectionCheckpoint
          .sourceHandoffReadinessArtifactDigest,
      sourceInspectionHandoffStateDigest:
        readinessHandoffDisposition.sourceReadinessInspectionCheckpoint
          .sourceInspectionHandoffStateDigest,
      sourceAggregationStateDigest:
        readinessHandoffDisposition.sourceReadinessInspectionCheckpoint
          .sourceAggregationStateDigest,
      sourceDispositionStateDigest:
        readinessHandoffDisposition.sourceReadinessInspectionCheckpoint
          .sourceDispositionStateDigest,
      sourceInspectionArtifactDigest:
        readinessHandoffDisposition.sourceReadinessInspectionCheckpoint
          .sourceInspectionArtifactDigest,
      sourceDecisionCandidateStateDigest:
        readinessHandoffDisposition.sourceReadinessInspectionCheckpoint
          .sourceDecisionCandidateStateDigest,
      sourcePreflightCheckpointStateDigest:
        readinessHandoffDisposition.sourceReadinessInspectionCheckpoint
          .sourcePreflightCheckpointStateDigest,
      sourceIntakeCheckpointStateDigest:
        readinessHandoffDisposition.sourceReadinessInspectionCheckpoint
          .sourceIntakeCheckpointStateDigest,
      sourceEvaluatorInputCandidateDigest:
        readinessHandoffDisposition.sourceReadinessInspectionCheckpoint
          .sourceEvaluatorInputCandidateDigest,
      readinessInspectionCheckpointAccepted: true,
      readinessHandoffDispositionMetadataOnly: true,
      readinessHandoffDispositionIsReviewerRouting: false,
      readinessHandoffDispositionIsReviewerAssignment: false,
      readinessHandoffDispositionIsEvaluatorExecution: false,
      readinessHandoffDispositionIsEvaluatorResult: false,
      readinessHandoffDispositionIsApprovalDecision: false,
      readinessHandoffDispositionIsApprovalGrant: false,
      reviewerRoutingPerformed: false,
      reviewerAssignmentPerformed: false,
      evaluatorResultProduced: false,
      approvalDecisionProduced: false,
      approvalGrantProduced: false,
      approvalGrantPersisted: false,
      evaluatorExecuted: false,
      runtimeEffectAllFalse: true
    },
    pipelineSummary: reviewOnlyEvaluatorPreflightPipelineSummary(
      readinessHandoffDisposition.pipelineSummary
    ),
    integratedReviewSummary: reviewOnlyEvaluatorPreflightIntegratedSummary(
      readinessHandoffDisposition.integratedReviewSummary
    ),
    decisionCandidateSummary:
      nonAuthorizingEvaluatorDecisionCandidateSummary(),
    inspectionSummary:
      nonAuthorizingEvaluatorDecisionCandidateInspectionSummary(),
    dispositionSummary: humanToolInspectionDispositionSummary(),
    aggregationSummary: reviewOnlyDispositionAggregationSummary(),
    handoffSummary: reviewOnlyAggregationInspectionHandoffSummary(),
    readinessSummary: reviewOnlyHandoffReadinessSummary(),
    inspectionCheckpointSummary:
      reviewOnlyReadinessInspectionCheckpointSummary(),
    readinessHandoffDispositionSummary:
      reviewOnlyReadinessHandoffDispositionSummary(),
    handoffDispositionInspectionCheckpointSummary:
      reviewOnlyHandoffDispositionInspectionCheckpointSummary(),
    readinessHandoffDispositionAccepted: true,
    handoffDispositionInspectionCheckpointMetadataOnly: true,
    handoffDispositionInspectionCheckpointIsReviewerRouting: false,
    handoffDispositionInspectionCheckpointIsReviewerAssignment: false,
    handoffDispositionInspectionCheckpointIsEvaluatorExecution: false,
    handoffDispositionInspectionCheckpointIsEvaluatorResult: false,
    handoffDispositionInspectionCheckpointIsApprovalDecision: false,
    handoffDispositionInspectionCheckpointIsApprovalGrant: false,
    reviewerRoutingPerformed: false,
    reviewerRoutingEnabled: false,
    reviewerRouteId: null,
    reviewerAssignmentPerformed: false,
    reviewerAssignmentEnabled: false,
    reviewerAssignmentId: null,
    reviewerId: null,
    evaluatorResultProduced: false,
    evaluatorResultPersisted: false,
    evaluatorResultId: null,
    approvalDecisionProduced: false,
    approvalDecisionPersisted: false,
    approvalDecisionId: null,
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

function reviewOnlyHandoffDispositionInspectionCheckpointRejectionReasons({
  accepted,
  classification
}) {
  if (accepted) {
    return [
      "handoff_disposition_inspection_checkpoint_is_review_only",
      "reviewer_routing_not_implemented",
      "reviewer_assignment_not_implemented",
      "evaluator_execution_not_implemented",
      "evaluator_result_not_implemented",
      "approval_decision_not_implemented",
      "approval_grant_not_implemented",
      "runtime_enablement_still_blocked"
    ];
  }

  return [
    classification,
    "handoff_disposition_inspection_checkpoint_not_produced",
    "reviewer_routing_not_implemented",
    "reviewer_assignment_not_implemented",
    "evaluator_execution_not_implemented",
    "evaluator_result_not_implemented",
    "approval_decision_not_implemented",
    "approval_grant_not_implemented",
    "runtime_enablement_still_blocked"
  ];
}

function reviewOnlyHandoffDispositionInspectionCheckpointInputRecord(input) {
  return isPlainObjectRecord(input) ? input : null;
}

function reviewOnlyHandoffDispositionInspectionCheckpointReviewedAt(inputRecord) {
  if (
    inputRecord === null ||
    !Object.prototype.hasOwnProperty.call(inputRecord, "reviewedAt")
  ) {
    return APPROVAL_PREREQUISITE_SOURCE_PREFLIGHT_DEFAULT_REVIEWED_AT;
  }

  return isUtcIsoTimestampWithMilliseconds(inputRecord.reviewedAt)
    ? inputRecord.reviewedAt
    : APPROVAL_PREREQUISITE_SOURCE_PREFLIGHT_DEFAULT_REVIEWED_AT;
}

function reviewOnlyHandoffDispositionInspectionCheckpointInputMalformed(
  inputRecord
) {
  return (
    inputRecord === null ||
    (Object.prototype.hasOwnProperty.call(inputRecord, "reviewedAt") &&
      !isUtcIsoTimestampWithMilliseconds(inputRecord.reviewedAt))
  );
}

function reviewOnlyHandoffDispositionInspectionCheckpointDispositions(
  inputRecord
) {
  return inputRecord === null
    ? undefined
    : inputRecord.readinessHandoffDispositions;
}

function reviewOnlyHandoffDispositionInspectionCheckpointInputClassification(
  inputRecord,
  readinessHandoffDispositions
) {
  return reviewOnlyHandoffDispositionInspectionCheckpointInputMalformed(
    inputRecord
  )
    ? MALFORMED_REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_CLASSIFICATION
    : reviewOnlyHandoffDispositionInspectionCheckpointClassification(
        readinessHandoffDispositions
      );
}

function reviewOnlyHandoffDispositionInspectionCheckpointSummaryFromDisposition(
  readinessHandoffDisposition
) {
  return {
    schema: readinessHandoffDisposition.schema,
    stateKind: readinessHandoffDisposition.stateKind,
    stateMode: readinessHandoffDisposition.stateMode,
    reviewedAt: readinessHandoffDisposition.reviewedAt,
    stateDigest: reviewArtifactHandoffDigest(readinessHandoffDisposition),
    readinessHandoffDispositionIsReviewerRouting: false,
    readinessHandoffDispositionIsReviewerAssignment: false,
    readinessHandoffDispositionIsEvaluatorExecution: false,
    readinessHandoffDispositionIsEvaluatorResult: false,
    readinessHandoffDispositionIsApprovalDecision: false,
    readinessHandoffDispositionIsApprovalGrant: false,
    reviewerRoutingPerformed: false,
    reviewerAssignmentPerformed: false,
    evaluatorResultProduced: false,
    approvalDecisionProduced: false,
    approvalGrantProduced: false,
    approvalGrantPersisted: false,
    evaluatorExecuted: false,
    runtimeEffectAllFalse: true
  };
}

function reviewOnlyHandoffDispositionInspectionCheckpointAcceptedOutput({
  accepted,
  readinessHandoffDispositions,
  reviewedAt
}) {
  if (!accepted) {
    return {
      handoffDispositionInspectionCheckpoint: null,
      readinessHandoffDispositionSummary: null
    };
  }

  const readinessHandoffDisposition = readinessHandoffDispositions[0];

  return {
    handoffDispositionInspectionCheckpoint:
      reviewOnlyHandoffDispositionInspectionCheckpointStateFromDisposition(
        readinessHandoffDisposition,
        reviewedAt
      ),
    readinessHandoffDispositionSummary:
      reviewOnlyHandoffDispositionInspectionCheckpointSummaryFromDisposition(
        readinessHandoffDisposition
      )
  };
}

function reviewOnlyHandoffDispositionInspectionCheckpointResult({
  reviewedAt,
  reviewedAtDefaulted,
  classification,
  accepted,
  handoffDispositionInspectionCheckpoint,
  readinessHandoffDispositionSummary
}) {
  return {
    schema: REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_SCHEMA,
    schemaVersion: REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_VERSION,
    checkpointKind: REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_KIND,
    checkpointMode: "review-only",
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    readinessHandoffDispositionAccepted: accepted,
    handoffDispositionInspectionCheckpointProduced: accepted,
    handoffDispositionInspectionCheckpointIsReviewerRouting: false,
    handoffDispositionInspectionCheckpointIsReviewerAssignment: false,
    handoffDispositionInspectionCheckpointIsEvaluatorExecution: false,
    handoffDispositionInspectionCheckpointIsEvaluatorResult: false,
    handoffDispositionInspectionCheckpointIsApprovalDecision: false,
    handoffDispositionInspectionCheckpointIsApprovalGrant: false,
    handoffDispositionInspectionCheckpoint,
    readinessHandoffDispositionSummary,
    reviewOnly: true,
    authoritative: false,
    reviewArtifactOnly: true,
    handoffDispositionInspectionCheckpointMetadataOnly: true,
    reviewerRoutingPerformed: false,
    reviewerRoutingEnabled: false,
    reviewerRouteId: null,
    reviewerAssignmentPerformed: false,
    reviewerAssignmentEnabled: false,
    reviewerAssignmentId: null,
    reviewerId: null,
    evaluatorResultProduced: false,
    evaluatorResultPersisted: false,
    evaluatorResultId: null,
    approvalDecisionProduced: false,
    approvalDecisionPersisted: false,
    approvalDecisionId: null,
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
    rejectionReasons:
      reviewOnlyHandoffDispositionInspectionCheckpointRejectionReasons({
        accepted,
        classification
      }),
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

export function createReviewOnlyHandoffDispositionInspectionCheckpointForReview(
  input = {}
) {
  const inputRecord =
    reviewOnlyHandoffDispositionInspectionCheckpointInputRecord(input);
  const reviewedAt =
    reviewOnlyHandoffDispositionInspectionCheckpointReviewedAt(inputRecord);
  const reviewedAtDefaulted = isReviewedAtDefaulted(inputRecord);
  const readinessHandoffDispositions =
    reviewOnlyHandoffDispositionInspectionCheckpointDispositions(inputRecord);
  const classification =
    reviewOnlyHandoffDispositionInspectionCheckpointInputClassification(
      inputRecord,
      readinessHandoffDispositions
    );
  const accepted =
    classification ===
    VALID_REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_CLASSIFICATION;
  const {
    handoffDispositionInspectionCheckpoint,
    readinessHandoffDispositionSummary
  } = reviewOnlyHandoffDispositionInspectionCheckpointAcceptedOutput({
    accepted,
    readinessHandoffDispositions,
    reviewedAt
  });

  return reviewOnlyHandoffDispositionInspectionCheckpointResult({
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    accepted,
    handoffDispositionInspectionCheckpoint,
    readinessHandoffDispositionSummary
  });
}

const REVIEW_ONLY_INSPECTION_HANDOFF_METADATA_STATE_SCHEMA =
  "ardyn.phase-5.38.review-only-inspection-handoff-metadata-state";

const REVIEW_ONLY_INSPECTION_HANDOFF_METADATA_BOUNDARY_MIN_REVIEWED_AT =
  "2026-06-17T00:00:00.000Z";

const VALID_REVIEW_ONLY_INSPECTION_HANDOFF_METADATA_BOUNDARY_CLASSIFICATION =
  "valid_review_only_inspection_handoff_metadata_boundary_runtime_still_blocked";
const MALFORMED_REVIEW_ONLY_INSPECTION_HANDOFF_METADATA_BOUNDARY_CLASSIFICATION =
  "malformed_review_only_inspection_handoff_metadata_boundary_input_rejected";

const REVIEW_ONLY_INSPECTION_HANDOFF_METADATA_BOUNDARY_SOURCE_FIELDS =
  Object.freeze([
    "schema",
    "schemaVersion",
    "stateKind",
    "stateMode",
    "reviewedAt",
    "sourceReadinessHandoffDisposition",
    "pipelineSummary",
    "integratedReviewSummary",
    "decisionCandidateSummary",
    "inspectionSummary",
    "dispositionSummary",
    "aggregationSummary",
    "handoffSummary",
    "readinessSummary",
    "inspectionCheckpointSummary",
    "readinessHandoffDispositionSummary",
    "handoffDispositionInspectionCheckpointSummary",
    "readinessHandoffDispositionAccepted",
    "handoffDispositionInspectionCheckpointMetadataOnly",
    "handoffDispositionInspectionCheckpointIsReviewerRouting",
    "handoffDispositionInspectionCheckpointIsReviewerAssignment",
    "handoffDispositionInspectionCheckpointIsEvaluatorExecution",
    "handoffDispositionInspectionCheckpointIsEvaluatorResult",
    "handoffDispositionInspectionCheckpointIsApprovalDecision",
    "handoffDispositionInspectionCheckpointIsApprovalGrant",
    "reviewerRoutingPerformed",
    "reviewerRoutingEnabled",
    "reviewerRouteId",
    "reviewerAssignmentPerformed",
    "reviewerAssignmentEnabled",
    "reviewerAssignmentId",
    "reviewerId",
    "evaluatorResultProduced",
    "evaluatorResultPersisted",
    "evaluatorResultId",
    "approvalDecisionProduced",
    "approvalDecisionPersisted",
    "approvalDecisionId",
    "approvalGrantProduced",
    "approvalGrantPersisted",
    "approvalGrantId",
    "runtimePermissionGranted",
    "commandExposurePermissionGranted",
    "runtimeCommandExposureEnabled",
    "runtimeExecutionEnabled",
    "evaluatorExecutionRequested",
    "evaluatorExecutionStarted",
    "evaluatorExecutionEnabled",
    "evaluatorExecuted",
    "runtimeEffect"
  ]);

const REVIEW_ONLY_INSPECTION_HANDOFF_METADATA_BOUNDARY_REQUIRED_FALSE_FIELDS =
  Object.freeze([
    "handoffDispositionInspectionCheckpointIsReviewerRouting",
    "handoffDispositionInspectionCheckpointIsReviewerAssignment",
    "handoffDispositionInspectionCheckpointIsEvaluatorExecution",
    "handoffDispositionInspectionCheckpointIsEvaluatorResult",
    "handoffDispositionInspectionCheckpointIsApprovalDecision",
    "handoffDispositionInspectionCheckpointIsApprovalGrant",
    "reviewerRoutingPerformed",
    "reviewerRoutingEnabled",
    "reviewerAssignmentPerformed",
    "reviewerAssignmentEnabled",
    "evaluatorResultProduced",
    "evaluatorResultPersisted",
    "approvalDecisionProduced",
    "approvalDecisionPersisted",
    "approvalGrantProduced",
    "approvalGrantPersisted",
    "runtimePermissionGranted",
    "commandExposurePermissionGranted",
    "runtimeCommandExposureEnabled",
    "runtimeExecutionEnabled",
    "evaluatorExecutionRequested",
    "evaluatorExecutionStarted",
    "evaluatorExecutionEnabled",
    "evaluatorExecuted"
  ]);

const REVIEW_ONLY_INSPECTION_HANDOFF_METADATA_BOUNDARY_REQUIRED_NULL_FIELDS =
  Object.freeze([
    "reviewerRouteId",
    "reviewerAssignmentId",
    "reviewerId",
    "evaluatorResultId",
    "approvalDecisionId",
    "approvalGrantId"
  ]);

const REVIEW_ONLY_INSPECTION_HANDOFF_METADATA_BOUNDARY_REQUIRED_LITERAL_FIELDS =
  Object.freeze([
    [
      "schema",
      REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_STATE_SCHEMA
    ],
    [
      "schemaVersion",
      REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_VERSION
    ],
    [
      "stateKind",
      "review-only-handoff-disposition-inspection-checkpoint-state"
    ],
    ["stateMode", "review-only"],
    ["readinessHandoffDispositionAccepted", true],
    ["handoffDispositionInspectionCheckpointMetadataOnly", true]
  ]);

const REVIEW_ONLY_INSPECTION_HANDOFF_METADATA_BOUNDARY_REQUIRED_OBJECT_FIELDS =
  Object.freeze([
    "sourceReadinessHandoffDisposition",
    "pipelineSummary",
    "integratedReviewSummary",
    "decisionCandidateSummary",
    "inspectionSummary",
    "dispositionSummary",
    "aggregationSummary",
    "handoffSummary",
    "readinessSummary",
    "inspectionCheckpointSummary",
    "readinessHandoffDispositionSummary"
  ]);

const REVIEW_ONLY_INSPECTION_HANDOFF_METADATA_BOUNDARY_REQUIRED_SUMMARY_FIELDS =
  Object.freeze([
    [
      "checkpointKind",
      REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_KIND
    ],
    ["checkpointMode", "review-only"],
    [
      "sourceReadinessHandoffDispositionClassification",
      VALID_REVIEW_ONLY_READINESS_HANDOFF_DISPOSITION_CLASSIFICATION
    ],
    ["handoffDispositionInspectionCheckpointMetadataOnly", true]
  ]);

const REVIEW_ONLY_INSPECTION_HANDOFF_METADATA_BOUNDARY_UNKNOWN_TRUE_FIELDS =
  Object.freeze(["unknown", "sourceUnknown"]);

const REVIEW_ONLY_INSPECTION_HANDOFF_METADATA_BOUNDARY_REVOKED_TRUE_FIELDS =
  Object.freeze(["revoked"]);

const REVIEW_ONLY_INSPECTION_HANDOFF_METADATA_BOUNDARY_REVOKED_PRESENT_FIELDS =
  Object.freeze(["revokedAt"]);

const REVIEW_ONLY_INSPECTION_HANDOFF_METADATA_BOUNDARY_REVIEWER_ASSIGNMENT_FALSE_FIELDS =
  Object.freeze(["reviewerAssignmentPerformed", "reviewerAssignmentEnabled"]);

const REVIEW_ONLY_INSPECTION_HANDOFF_METADATA_BOUNDARY_REVIEWER_ASSIGNMENT_NULL_FIELDS =
  Object.freeze(["reviewerAssignmentId", "reviewerId"]);

const REVIEW_ONLY_INSPECTION_HANDOFF_METADATA_BOUNDARY_ALLOWED_TOP_LEVEL_FIELDS =
  new Set(REVIEW_ONLY_INSPECTION_HANDOFF_METADATA_BOUNDARY_SOURCE_FIELDS);

const REVIEW_ONLY_INSPECTION_HANDOFF_METADATA_BOUNDARY_OBJECT_FIELD_GROUPS =
  Object.freeze({
    approvalDecision: [
      "approvalDecision",
      "approvalDecisionResult",
      "approvalDecisionGranted",
      "approvalDecisionAccepted",
      "approvalDecisionAuthorized",
      "inspectionHandoffMetadataIsApprovalDecision"
    ],
    evaluatorResult: [
      "evaluatorResult",
      "evaluationResult",
      "evaluatorOutput",
      "evaluatorOutcome",
      "resultProduced"
    ],
    reviewerRouting: [
      "reviewerRouting",
      "reviewerRoute",
      "reviewerQueue",
      "routing",
      "routingDecision",
      "routingResult",
      "routeReviewer",
      "reviewerRoutingPermissionGranted"
    ],
    reviewerAssignment: [
      "reviewerAssignment",
      "reviewerAssigned",
      "reviewerAssignee",
      "assignedReviewer",
      "assignedReviewers",
      "reviewerIds",
      "reviewerAllocation",
      "assignmentDecision",
      "humanReviewer",
      "toolReviewer",
      "reviewerAssignmentPermissionGranted"
    ]
  });

const REVIEW_ONLY_INSPECTION_HANDOFF_METADATA_BOUNDARY_MALFORMED_CHECKS =
  Object.freeze([
    (checkpoint) => isPlainObjectRecord(checkpoint),
    (checkpoint) =>
      reviewOnlyInspectionHandoffMetadataBoundaryFieldsEqual(
        checkpoint,
        REVIEW_ONLY_INSPECTION_HANDOFF_METADATA_BOUNDARY_REQUIRED_LITERAL_FIELDS
      ),
    (checkpoint) => isUtcIsoTimestampWithMilliseconds(checkpoint.reviewedAt),
    (checkpoint) =>
      reviewOnlyInspectionHandoffMetadataBoundaryFieldsPlainObjects(
        checkpoint,
        REVIEW_ONLY_INSPECTION_HANDOFF_METADATA_BOUNDARY_REQUIRED_OBJECT_FIELDS
      ),
    (_checkpoint, summary) => isPlainObjectRecord(summary),
    (_checkpoint, summary) =>
      reviewOnlyInspectionHandoffMetadataBoundaryFieldsEqual(
        summary,
        REVIEW_ONLY_INSPECTION_HANDOFF_METADATA_BOUNDARY_REQUIRED_SUMMARY_FIELDS
      ),
    (checkpoint) =>
      REVIEW_ONLY_INSPECTION_HANDOFF_METADATA_BOUNDARY_REQUIRED_FALSE_FIELDS.every(
        (field) => checkpoint[field] === false
      ),
    (checkpoint) =>
      REVIEW_ONLY_INSPECTION_HANDOFF_METADATA_BOUNDARY_REQUIRED_NULL_FIELDS.every(
        (field) => checkpoint[field] === null
      ),
    (checkpoint) =>
      reviewOnlyInspectionHandoffMetadataBoundaryRuntimeEffectAllFalse(
        checkpoint.runtimeEffect
      )
  ]);

function reviewOnlyInspectionHandoffMetadataBoundaryKeyPresent(
  value,
  keys,
  seen = new Set()
) {
  if (Array.isArray(value)) {
    return value.some((entry) =>
      reviewOnlyInspectionHandoffMetadataBoundaryKeyPresent(entry, keys, seen)
    );
  }

  if (!isPlainObjectRecord(value) || seen.has(value)) {
    return false;
  }

  seen.add(value);

  return Object.entries(value).some(
    ([key, entry]) =>
      keys.includes(key) ||
      reviewOnlyInspectionHandoffMetadataBoundaryKeyPresent(entry, keys, seen)
  );
}

function reviewOnlyInspectionHandoffMetadataBoundaryGrantLooking(
  value,
  seen = new Set()
) {
  if (Array.isArray(value)) {
    return value.some((entry) =>
      reviewOnlyInspectionHandoffMetadataBoundaryGrantLooking(entry, seen)
    );
  }

  if (!isPlainObjectRecord(value) || seen.has(value)) {
    return false;
  }

  seen.add(value);

  return Object.entries(value).some(([key, entry]) => {
    if (
      REVIEW_ONLY_INSPECTION_HANDOFF_METADATA_BOUNDARY_GRANT_KEY_PATTERN.test(key)
    ) {
      return entry !== false && entry !== null && entry !== "not-implemented";
    }

    return reviewOnlyInspectionHandoffMetadataBoundaryGrantLooking(entry, seen);
  });
}

function reviewOnlyInspectionHandoffMetadataBoundaryFieldsEqual(record, fields) {
  return fields.every(([field, expectedValue]) => record[field] === expectedValue);
}

function reviewOnlyInspectionHandoffMetadataBoundaryFieldsPlainObjects(
  record,
  fields
) {
  return fields.every((field) => isPlainObjectRecord(record[field]));
}

function reviewOnlyInspectionHandoffMetadataBoundaryAnyFieldTrue(record, fields) {
  return isPlainObjectRecord(record) && fields.some((field) => record[field] === true);
}

function reviewOnlyInspectionHandoffMetadataBoundaryAnyFieldPresent(
  record,
  fields
) {
  return (
    isPlainObjectRecord(record) &&
    fields.some((field) => Object.prototype.hasOwnProperty.call(record, field))
  );
}

function reviewOnlyInspectionHandoffMetadataBoundaryAnyFieldNotEqual(
  record,
  fields,
  expectedValue
) {
  return fields.some((field) => record[field] !== expectedValue);
}

function reviewOnlyInspectionHandoffMetadataBoundaryUnexpectedUnsafeField(
  checkpoint
) {
  return (
    isPlainObjectRecord(checkpoint) &&
    Object.keys(checkpoint).some(
      (key) =>
        !REVIEW_ONLY_INSPECTION_HANDOFF_METADATA_BOUNDARY_ALLOWED_TOP_LEVEL_FIELDS.has(
          key
        )
    )
  );
}

function reviewOnlyInspectionHandoffMetadataBoundaryUnsafeNestedMetadata(
  checkpoint
) {
  return reviewOnlyInspectionHandoffMetadataBoundaryKeyPresent(checkpoint, [
    "inspectionHandoffMetadata",
    "inspectionHandoffMetadataBoundary",
    "handoffMetadata",
    "boundaryMetadata",
    "checkpointMetadata",
    "executionMetadata"
  ]);
}

function reviewOnlyInspectionHandoffMetadataBoundaryUnknown(checkpoint) {
  return (
    isPlainObjectRecord(checkpoint) &&
    (reviewOnlyInspectionHandoffMetadataBoundaryAnyFieldTrue(
      checkpoint,
      REVIEW_ONLY_INSPECTION_HANDOFF_METADATA_BOUNDARY_UNKNOWN_TRUE_FIELDS
    ) ||
      ["classification", "status"].some((field) => checkpoint[field] === "unknown"))
  );
}

function reviewOnlyInspectionHandoffMetadataBoundaryRevoked(checkpoint) {
  return (
    isPlainObjectRecord(checkpoint) &&
    (reviewOnlyInspectionHandoffMetadataBoundaryAnyFieldTrue(
      checkpoint,
      REVIEW_ONLY_INSPECTION_HANDOFF_METADATA_BOUNDARY_REVOKED_TRUE_FIELDS
    ) ||
      reviewOnlyInspectionHandoffMetadataBoundaryAnyFieldPresent(
        checkpoint,
        REVIEW_ONLY_INSPECTION_HANDOFF_METADATA_BOUNDARY_REVOKED_PRESENT_FIELDS
      ) ||
      ["classification", "status"].some((field) => checkpoint[field] === "revoked"))
  );
}

function reviewOnlyInspectionHandoffMetadataBoundaryStale(checkpoint) {
  return (
    isPlainObjectRecord(checkpoint) &&
    isUtcIsoTimestampWithMilliseconds(checkpoint.reviewedAt) &&
    checkpoint.reviewedAt <
      REVIEW_ONLY_INSPECTION_HANDOFF_METADATA_BOUNDARY_MIN_REVIEWED_AT
  );
}

function reviewOnlyInspectionHandoffMetadataBoundaryMalformed(checkpoint) {
  const summary = isPlainObjectRecord(checkpoint)
    ? checkpoint.handoffDispositionInspectionCheckpointSummary
    : null;

  return !REVIEW_ONLY_INSPECTION_HANDOFF_METADATA_BOUNDARY_MALFORMED_CHECKS.every(
    (predicate) => predicate(checkpoint, summary)
  );
}

function reviewOnlyInspectionHandoffMetadataBoundaryApprovalDecisionLooking(
  checkpoint
) {
  return (
    checkpoint.approvalDecisionProduced !== false ||
    checkpoint.approvalDecisionPersisted !== false ||
    checkpoint.approvalDecisionId !== null ||
    reviewOnlyInspectionHandoffMetadataBoundaryKeyTruePresent(
      checkpoint,
      REVIEW_ONLY_INSPECTION_HANDOFF_METADATA_BOUNDARY_OBJECT_FIELD_GROUPS
        .approvalDecision
    )
  );
}

function reviewOnlyInspectionHandoffMetadataBoundaryApprovalGrantLooking(
  checkpoint) {
  return (
    checkpoint.approvalGrantProduced !== false ||
    checkpoint.approvalGrantPersisted !== false ||
    checkpoint.approvalGrantId !== null
  );
}

function reviewOnlyInspectionHandoffMetadataBoundaryEvaluatorResultLooking(
  checkpoint
) {
  return (
    checkpoint.evaluatorResultProduced !== false ||
    checkpoint.evaluatorResultPersisted !== false ||
    checkpoint.evaluatorResultId !== null ||
    reviewOnlyInspectionHandoffMetadataBoundaryKeyTruePresent(
      checkpoint,
      REVIEW_ONLY_INSPECTION_HANDOFF_METADATA_BOUNDARY_OBJECT_FIELD_GROUPS
        .evaluatorResult
    )
  );
}

function reviewOnlyInspectionHandoffMetadataBoundaryEvaluatorExecutionLooking(
  checkpoint
) {
  return (
    checkpoint.evaluatorExecutionRequested !== false ||
    checkpoint.evaluatorExecutionStarted !== false ||
    checkpoint.evaluatorExecutionEnabled !== false ||
    checkpoint.evaluatorExecuted !== false
  );
}

function reviewOnlyInspectionHandoffMetadataBoundaryReviewerRoutingLooking(
  checkpoint
) {
  return (
    checkpoint.reviewerRoutingPerformed !== false ||
    checkpoint.reviewerRoutingEnabled !== false ||
    checkpoint.reviewerRouteId !== null ||
    reviewOnlyInspectionHandoffMetadataBoundaryKeyPresent(
      checkpoint,
      REVIEW_ONLY_INSPECTION_HANDOFF_METADATA_BOUNDARY_OBJECT_FIELD_GROUPS
        .reviewerRouting
    )
  );
}

function reviewOnlyInspectionHandoffMetadataBoundaryReviewerAssignmentLooking(
  checkpoint
) {
  return (
    reviewOnlyInspectionHandoffMetadataBoundaryAnyFieldNotEqual(
      checkpoint,
      REVIEW_ONLY_INSPECTION_HANDOFF_METADATA_BOUNDARY_REVIEWER_ASSIGNMENT_FALSE_FIELDS,
      false
    ) ||
    reviewOnlyInspectionHandoffMetadataBoundaryAnyFieldNotEqual(
      checkpoint,
      REVIEW_ONLY_INSPECTION_HANDOFF_METADATA_BOUNDARY_REVIEWER_ASSIGNMENT_NULL_FIELDS,
      null
    ) ||
    reviewOnlyInspectionHandoffMetadataBoundaryKeyPresent(
      checkpoint,
      REVIEW_ONLY_INSPECTION_HANDOFF_METADATA_BOUNDARY_OBJECT_FIELD_GROUPS
        .reviewerAssignment
    )
  );
}

function reviewOnlyInspectionHandoffMetadataBoundaryRuntimePermissionLooking(
  checkpoint
) {
  return (
    checkpoint.runtimePermissionGranted !== false ||
    reviewOnlyInspectionHandoffMetadataBoundaryKeyTruePresent(checkpoint, [
      "runtimePermission",
      "runtimePermissionGranted",
      "canEnableRuntime"
    ])
  );
}

function reviewOnlyInspectionHandoffMetadataBoundaryCommandExposureLooking(
  checkpoint
) {
  return (
    checkpoint.commandExposurePermissionGranted !== false ||
    checkpoint.runtimeCommandExposureEnabled !== false ||
    reviewOnlyInspectionHandoffMetadataBoundaryKeyTruePresent(checkpoint, [
      "commandExposure",
      "commandExposurePermissionGranted",
      "runtimeCommandEnabled",
      "runtimeCommandExposureEnabled"
    ])
  );
}

function reviewOnlyInspectionHandoffMetadataBoundaryRuntimeEffectTrue(
  checkpoint
) {
  return (
    !reviewOnlyInspectionHandoffMetadataBoundaryRuntimeEffectAllFalse(
      checkpoint.runtimeEffect
    ) ||
    reviewOnlyInspectionHandoffMetadataBoundaryKeyTruePresent(checkpoint, [
      "runtimeEnabled",
      "runtimeStarted",
      "runtimeReady",
      "runtimeExecutionEnabled",
      "runtimeExecuted"
    ])
  );
}

function reviewOnlyInspectionHandoffMetadataBoundaryProcessFlagTrue(checkpoint) {
  return reviewOnlyInspectionHandoffMetadataBoundaryKeyTruePresent(checkpoint, [
    "processSpawned",
    "processSpawning",
    "processControlPerformed",
    "processTerminationEnabled",
    "runtimeSupervisionEnabled",
    "stdinLoopEnabled",
    "stdoutRuntimeWriterEnabled",
    "stderrRuntimeWriterEnabled"
  ]);
}

function reviewOnlyInspectionHandoffMetadataBoundaryExecutionSignalLooking(
  checkpoint
) {
  return (
    checkpoint.runtimeExecutionEnabled !== false ||
    checkpoint.evaluatorExecuted !== false ||
    reviewOnlyInspectionHandoffMetadataBoundaryKeyTruePresent(checkpoint, [
      "executionSignal",
      "executionRequested",
      "executionStarted",
      "runtimeExecutionSignal",
      "approvalEvaluatorAuthoritative"
    ])
  );
}

function reviewOnlyInspectionHandoffMetadataBoundaryAuthorizing(checkpoint) {
  return reviewOnlyInspectionHandoffMetadataBoundaryKeyTruePresent(checkpoint, [
    "authoritative",
    "authorizing",
    "authorized",
    "authorizationGranted",
    "approvalAuthorized",
    "canApproveRuntime",
    "canGrantRuntime"
  ]);
}

const REVIEW_ONLY_INSPECTION_HANDOFF_METADATA_BOUNDARY_SINGLE_REJECTION_CHECKS =
  Object.freeze([
    [
      "unknown_review_only_inspection_handoff_metadata_boundary_input_rejected",
      reviewOnlyInspectionHandoffMetadataBoundaryUnknown
    ],
    [
      "revoked_review_only_inspection_handoff_metadata_boundary_input_rejected",
      reviewOnlyInspectionHandoffMetadataBoundaryRevoked
    ],
    [
      "stale_review_only_inspection_handoff_metadata_boundary_input_rejected",
      reviewOnlyInspectionHandoffMetadataBoundaryStale
    ],
    [
      "approval_decision_looking_review_only_inspection_handoff_metadata_boundary_input_rejected",
      reviewOnlyInspectionHandoffMetadataBoundaryApprovalDecisionLooking
    ],
    [
      "reviewer_routing_looking_review_only_inspection_handoff_metadata_boundary_input_rejected",
      reviewOnlyInspectionHandoffMetadataBoundaryReviewerRoutingLooking
    ],
    [
      "reviewer_assignment_looking_review_only_inspection_handoff_metadata_boundary_input_rejected",
      reviewOnlyInspectionHandoffMetadataBoundaryReviewerAssignmentLooking
    ],
    [
      "unsafe_review_only_inspection_handoff_metadata_boundary_input_rejected",
      reviewOnlyInspectionHandoffMetadataBoundaryUnexpectedUnsafeField
    ],
    [
      "unsafe_review_only_inspection_handoff_metadata_boundary_input_rejected",
      reviewOnlyInspectionHandoffMetadataBoundaryUnsafeNestedMetadata
    ],
    [
      "approval_grant_looking_review_only_inspection_handoff_metadata_boundary_input_rejected",
      reviewOnlyInspectionHandoffMetadataBoundaryApprovalGrantLooking
    ],
    [
      "grant_looking_review_only_inspection_handoff_metadata_boundary_input_rejected",
      reviewOnlyInspectionHandoffMetadataBoundaryGrantLooking
    ],
    [
      "evaluator_result_looking_review_only_inspection_handoff_metadata_boundary_input_rejected",
      reviewOnlyInspectionHandoffMetadataBoundaryEvaluatorResultLooking
    ],
    [
      "evaluator_execution_looking_review_only_inspection_handoff_metadata_boundary_input_rejected",
      reviewOnlyInspectionHandoffMetadataBoundaryEvaluatorExecutionLooking
    ],
    [
      "runtime_permission_looking_review_only_inspection_handoff_metadata_boundary_input_rejected",
      reviewOnlyInspectionHandoffMetadataBoundaryRuntimePermissionLooking
    ],
    [
      "command_exposure_looking_review_only_inspection_handoff_metadata_boundary_input_rejected",
      reviewOnlyInspectionHandoffMetadataBoundaryCommandExposureLooking
    ],
    [
      "runtime_effect_true_review_only_inspection_handoff_metadata_boundary_input_rejected",
      reviewOnlyInspectionHandoffMetadataBoundaryRuntimeEffectTrue
    ],
    [
      "process_flag_true_review_only_inspection_handoff_metadata_boundary_input_rejected",
      reviewOnlyInspectionHandoffMetadataBoundaryProcessFlagTrue
    ],
    [
      "execution_signal_looking_review_only_inspection_handoff_metadata_boundary_input_rejected",
      reviewOnlyInspectionHandoffMetadataBoundaryExecutionSignalLooking
    ],
    [
      "authorizing_review_only_inspection_handoff_metadata_boundary_input_rejected",
      reviewOnlyInspectionHandoffMetadataBoundaryAuthorizing
    ],
    [
      MALFORMED_REVIEW_ONLY_INSPECTION_HANDOFF_METADATA_BOUNDARY_CLASSIFICATION,
      reviewOnlyInspectionHandoffMetadataBoundaryMalformed
    ]
  ]);

function reviewOnlyInspectionHandoffMetadataBoundarySingleClassification(
  checkpoint
) {
  const rejection =
    REVIEW_ONLY_INSPECTION_HANDOFF_METADATA_BOUNDARY_SINGLE_REJECTION_CHECKS.find(
      ([, predicate]) => predicate(checkpoint)
    );

  return rejection?.[0] ?? VALID_REVIEW_ONLY_INSPECTION_HANDOFF_METADATA_BOUNDARY_CLASSIFICATION;
}

function reviewOnlyInspectionHandoffMetadataBoundaryInputsContainDuplicate(
  checkpoints
) {
  const digests = checkpoints
    .filter(isPlainObjectRecord)
    .map((checkpoint) => reviewArtifactHandoffDigest(checkpoint));
  return new Set(digests).size !== digests.length;
}

function reviewOnlyInspectionHandoffMetadataBoundaryMultiInputClassification(
  checkpoints
) {
  return reviewOnlyInspectionHandoffMetadataBoundaryInputsContainDuplicate(
    checkpoints
  )
    ? "duplicate_invalid_review_only_inspection_handoff_metadata_boundary_input_rejected"
    : "conflicting_review_only_inspection_handoff_metadata_boundary_input_rejected";
}

const REVIEW_ONLY_INSPECTION_HANDOFF_METADATA_BOUNDARY_INPUT_REJECTIONS =
  Object.freeze([
    [
      (checkpoints) => checkpoints === undefined,
      () => "missing_review_only_inspection_handoff_metadata_boundary_input_rejected"
    ],
    [
      (checkpoints) => !Array.isArray(checkpoints),
      () => MALFORMED_REVIEW_ONLY_INSPECTION_HANDOFF_METADATA_BOUNDARY_CLASSIFICATION
    ],
    [
      (checkpoints) => checkpoints.length === 0,
      () => "empty_review_only_inspection_handoff_metadata_boundary_input_rejected"
    ],
    [
      (checkpoints) => checkpoints.length > 1,
      reviewOnlyInspectionHandoffMetadataBoundaryMultiInputClassification
    ]
  ]);

function reviewOnlyInspectionHandoffMetadataBoundaryInputRejection(checkpoints) {
  const rejection =
    REVIEW_ONLY_INSPECTION_HANDOFF_METADATA_BOUNDARY_INPUT_REJECTIONS.find(
      ([predicate]) => predicate(checkpoints)
    );
  return rejection?.[1](checkpoints);
}

function reviewOnlyInspectionHandoffMetadataBoundaryClassification(checkpoints) {
  const inputRejection =
    reviewOnlyInspectionHandoffMetadataBoundaryInputRejection(checkpoints);

  return (
    inputRejection ??
    reviewOnlyInspectionHandoffMetadataBoundarySingleClassification(checkpoints[0])
  );
}

function reviewOnlyInspectionHandoffMetadataBoundarySummary() {
  return {
    boundaryKind: REVIEW_ONLY_INSPECTION_HANDOFF_METADATA_BOUNDARY_KIND,
    boundaryMode: "review-only",
    sourceHandoffDispositionInspectionCheckpointClassification:
      VALID_REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_CLASSIFICATION,
    inspectionHandoffMetadataOnly: true,
    reviewerRoutingPerformed: false,
    reviewerAssignmentPerformed: false,
    evaluatorExecutionPerformed: false,
    evaluatorResultProduced: false,
    approvalDecisionProduced: false,
    approvalGrantProduced: false,
    runtimePermissionGranted: false,
    commandExposurePermissionGranted: false,
    evaluatorExecuted: false,
    runtimeEffectAllFalse: true
  };
}

function reviewOnlyInspectionHandoffMetadataStateFromCheckpoint(
  checkpoint,
  reviewedAt
) {
  return {
    schema: REVIEW_ONLY_INSPECTION_HANDOFF_METADATA_STATE_SCHEMA,
    schemaVersion: REVIEW_ONLY_INSPECTION_HANDOFF_METADATA_BOUNDARY_VERSION,
    stateKind: "review-only-inspection-handoff-metadata-state",
    stateMode: "review-only",
    reviewedAt,
    sourceHandoffDispositionInspectionCheckpoint: {
      schema: checkpoint.schema,
      stateKind: checkpoint.stateKind,
      stateMode: checkpoint.stateMode,
      reviewedAt: checkpoint.reviewedAt,
      stateDigest: reviewArtifactHandoffDigest(checkpoint),
      sourceReadinessHandoffDispositionDigest: reviewArtifactHandoffDigest(
        checkpoint.sourceReadinessHandoffDisposition
      ),
      handoffDispositionInspectionCheckpointMetadataOnly: true,
      handoffDispositionInspectionCheckpointIsReviewerRouting: false,
      handoffDispositionInspectionCheckpointIsReviewerAssignment: false,
      handoffDispositionInspectionCheckpointIsEvaluatorExecution: false,
      handoffDispositionInspectionCheckpointIsEvaluatorResult: false,
      handoffDispositionInspectionCheckpointIsApprovalDecision: false,
      handoffDispositionInspectionCheckpointIsApprovalGrant: false,
      reviewerRoutingPerformed: false,
      reviewerAssignmentPerformed: false,
      evaluatorResultProduced: false,
      approvalDecisionProduced: false,
      approvalGrantProduced: false,
      approvalGrantPersisted: false,
      evaluatorExecuted: false,
      runtimeEffectAllFalse: true
    },
    pipelineSummary: reviewOnlyEvaluatorPreflightPipelineSummary(
      checkpoint.pipelineSummary
    ),
    integratedReviewSummary: reviewOnlyEvaluatorPreflightIntegratedSummary(
      checkpoint.integratedReviewSummary
    ),
    decisionCandidateSummary:
      nonAuthorizingEvaluatorDecisionCandidateSummary(),
    inspectionSummary:
      nonAuthorizingEvaluatorDecisionCandidateInspectionSummary(),
    dispositionSummary: humanToolInspectionDispositionSummary(),
    aggregationSummary: reviewOnlyDispositionAggregationSummary(),
    handoffSummary: reviewOnlyAggregationInspectionHandoffSummary(),
    readinessSummary: reviewOnlyHandoffReadinessSummary(),
    inspectionCheckpointSummary:
      reviewOnlyReadinessInspectionCheckpointSummary(),
    readinessHandoffDispositionSummary:
      reviewOnlyReadinessHandoffDispositionSummary(),
    handoffDispositionInspectionCheckpointSummary:
      reviewOnlyHandoffDispositionInspectionCheckpointSummary(),
    inspectionHandoffMetadataSummary:
      reviewOnlyInspectionHandoffMetadataBoundarySummary(),
    handoffDispositionInspectionCheckpointAccepted: true,
    inspectionHandoffMetadataOnly: true,
    inspectionHandoffMetadataIsReviewerRouting: false,
    inspectionHandoffMetadataIsReviewerAssignment: false,
    inspectionHandoffMetadataIsEvaluatorExecution: false,
    inspectionHandoffMetadataIsEvaluatorResult: false,
    inspectionHandoffMetadataIsApprovalDecision: false,
    inspectionHandoffMetadataIsApprovalGrant: false,
    reviewerRoutingPerformed: false,
    reviewerRoutingEnabled: false,
    reviewerRouteId: null,
    reviewerAssignmentPerformed: false,
    reviewerAssignmentEnabled: false,
    reviewerAssignmentId: null,
    reviewerId: null,
    evaluatorResultProduced: false,
    evaluatorResultPersisted: false,
    evaluatorResultId: null,
    approvalDecisionProduced: false,
    approvalDecisionPersisted: false,
    approvalDecisionId: null,
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

function reviewOnlyInspectionHandoffMetadataBoundaryRejectionReasons({
  accepted,
  classification
}) {
  if (accepted) {
    return [
      "inspection_handoff_metadata_boundary_is_review_only",
      "reviewer_routing_not_implemented",
      "reviewer_assignment_not_implemented",
      "evaluator_execution_not_implemented",
      "evaluator_result_not_implemented",
      "approval_decision_not_implemented",
      "approval_grant_not_implemented",
      "runtime_enablement_still_blocked"
    ];
  }

  return [
    classification,
    "inspection_handoff_metadata_boundary_not_produced",
    "reviewer_routing_not_implemented",
    "reviewer_assignment_not_implemented",
    "evaluator_execution_not_implemented",
    "evaluator_result_not_implemented",
    "approval_decision_not_implemented",
    "approval_grant_not_implemented",
    "runtime_enablement_still_blocked"
  ];
}

function reviewOnlyInspectionHandoffMetadataBoundaryInputRecord(input) {
  return isPlainObjectRecord(input) ? input : null;
}

function reviewOnlyInspectionHandoffMetadataBoundaryReviewedAt(inputRecord) {
  if (
    inputRecord === null ||
    !Object.prototype.hasOwnProperty.call(inputRecord, "reviewedAt")
  ) {
    return APPROVAL_PREREQUISITE_SOURCE_PREFLIGHT_DEFAULT_REVIEWED_AT;
  }

  return isUtcIsoTimestampWithMilliseconds(inputRecord.reviewedAt)
    ? inputRecord.reviewedAt
    : APPROVAL_PREREQUISITE_SOURCE_PREFLIGHT_DEFAULT_REVIEWED_AT;
}

function reviewOnlyInspectionHandoffMetadataBoundaryInputMalformed(inputRecord) {
  return (
    inputRecord === null ||
    (Object.prototype.hasOwnProperty.call(inputRecord, "reviewedAt") &&
      !isUtcIsoTimestampWithMilliseconds(inputRecord.reviewedAt))
  );
}

function reviewOnlyInspectionHandoffMetadataBoundaryCheckpoints(inputRecord) {
  return inputRecord === null
    ? undefined
    : inputRecord.handoffDispositionInspectionCheckpoints;
}

function reviewOnlyInspectionHandoffMetadataBoundaryInputClassification(
  inputRecord,
  checkpoints
) {
  return reviewOnlyInspectionHandoffMetadataBoundaryInputMalformed(inputRecord)
    ? MALFORMED_REVIEW_ONLY_INSPECTION_HANDOFF_METADATA_BOUNDARY_CLASSIFICATION
    : reviewOnlyInspectionHandoffMetadataBoundaryClassification(checkpoints);
}

function reviewOnlyInspectionHandoffMetadataBoundarySummaryFromCheckpoint(
  checkpoint
) {
  return {
    schema: checkpoint.schema,
    stateKind: checkpoint.stateKind,
    stateMode: checkpoint.stateMode,
    reviewedAt: checkpoint.reviewedAt,
    stateDigest: reviewArtifactHandoffDigest(checkpoint),
    handoffDispositionInspectionCheckpointIsReviewerRouting: false,
    handoffDispositionInspectionCheckpointIsReviewerAssignment: false,
    handoffDispositionInspectionCheckpointIsEvaluatorExecution: false,
    handoffDispositionInspectionCheckpointIsEvaluatorResult: false,
    handoffDispositionInspectionCheckpointIsApprovalDecision: false,
    handoffDispositionInspectionCheckpointIsApprovalGrant: false,
    reviewerRoutingPerformed: false,
    reviewerAssignmentPerformed: false,
    evaluatorResultProduced: false,
    approvalDecisionProduced: false,
    approvalGrantProduced: false,
    approvalGrantPersisted: false,
    evaluatorExecuted: false,
    runtimeEffectAllFalse: true
  };
}

function reviewOnlyInspectionHandoffMetadataBoundaryAcceptedOutput({
  accepted,
  checkpoints,
  reviewedAt
}) {
  if (!accepted) {
    return {
      inspectionHandoffMetadata: null,
      handoffDispositionInspectionCheckpointSummary: null
    };
  }

  const checkpoint = checkpoints[0];

  return {
    inspectionHandoffMetadata:
      reviewOnlyInspectionHandoffMetadataStateFromCheckpoint(
        checkpoint,
        reviewedAt
      ),
    handoffDispositionInspectionCheckpointSummary:
      reviewOnlyInspectionHandoffMetadataBoundarySummaryFromCheckpoint(checkpoint)
  };
}

function reviewOnlyInspectionHandoffMetadataBoundaryResult({
  reviewedAt,
  reviewedAtDefaulted,
  classification,
  accepted,
  inspectionHandoffMetadata,
  handoffDispositionInspectionCheckpointSummary
}) {
  return {
    schema: REVIEW_ONLY_INSPECTION_HANDOFF_METADATA_BOUNDARY_SCHEMA,
    schemaVersion: REVIEW_ONLY_INSPECTION_HANDOFF_METADATA_BOUNDARY_VERSION,
    boundaryKind: REVIEW_ONLY_INSPECTION_HANDOFF_METADATA_BOUNDARY_KIND,
    boundaryMode: "review-only",
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    handoffDispositionInspectionCheckpointAccepted: accepted,
    inspectionHandoffMetadataProduced: accepted,
    inspectionHandoffMetadataIsReviewerRouting: false,
    inspectionHandoffMetadataIsReviewerAssignment: false,
    inspectionHandoffMetadataIsEvaluatorExecution: false,
    inspectionHandoffMetadataIsEvaluatorResult: false,
    inspectionHandoffMetadataIsApprovalDecision: false,
    inspectionHandoffMetadataIsApprovalGrant: false,
    inspectionHandoffMetadata,
    handoffDispositionInspectionCheckpointSummary,
    reviewOnly: true,
    authoritative: false,
    reviewArtifactOnly: true,
    inspectionHandoffMetadataOnly: true,
    reviewerRoutingPerformed: false,
    reviewerRoutingEnabled: false,
    reviewerRouteId: null,
    reviewerAssignmentPerformed: false,
    reviewerAssignmentEnabled: false,
    reviewerAssignmentId: null,
    reviewerId: null,
    evaluatorResultProduced: false,
    evaluatorResultPersisted: false,
    evaluatorResultId: null,
    approvalDecisionProduced: false,
    approvalDecisionPersisted: false,
    approvalDecisionId: null,
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
    rejectionReasons:
      reviewOnlyInspectionHandoffMetadataBoundaryRejectionReasons({
        accepted,
        classification
      }),
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

export function createReviewOnlyInspectionHandoffMetadataBoundaryForReview(
  input = {}
) {
  const inputRecord =
    reviewOnlyInspectionHandoffMetadataBoundaryInputRecord(input);
  const reviewedAt =
    reviewOnlyInspectionHandoffMetadataBoundaryReviewedAt(inputRecord);
  const reviewedAtDefaulted = isReviewedAtDefaulted(inputRecord);
  const checkpoints =
    reviewOnlyInspectionHandoffMetadataBoundaryCheckpoints(inputRecord);
  const classification =
    reviewOnlyInspectionHandoffMetadataBoundaryInputClassification(
      inputRecord,
      checkpoints
    );
  const accepted =
    classification ===
    VALID_REVIEW_ONLY_INSPECTION_HANDOFF_METADATA_BOUNDARY_CLASSIFICATION;
  const {
    inspectionHandoffMetadata,
    handoffDispositionInspectionCheckpointSummary
  } = reviewOnlyInspectionHandoffMetadataBoundaryAcceptedOutput({
    accepted,
    checkpoints,
    reviewedAt
  });

  return reviewOnlyInspectionHandoffMetadataBoundaryResult({
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    accepted,
    inspectionHandoffMetadata,
    handoffDispositionInspectionCheckpointSummary
  });
}

const REVIEW_ONLY_INSPECTION_HANDOFF_CHECKPOINT_STATE_SCHEMA =
  "ardyn.phase-5.39.review-only-inspection-handoff-checkpoint-state";

const REVIEW_ONLY_INSPECTION_HANDOFF_CHECKPOINT_MIN_REVIEWED_AT =
  "2026-06-17T00:00:00.000Z";

const VALID_REVIEW_ONLY_INSPECTION_HANDOFF_CHECKPOINT_CLASSIFICATION =
  "valid_review_only_inspection_handoff_checkpoint_runtime_still_blocked";
const MALFORMED_REVIEW_ONLY_INSPECTION_HANDOFF_CHECKPOINT_CLASSIFICATION =
  "malformed_review_only_inspection_handoff_checkpoint_input_rejected";

const REVIEW_ONLY_INSPECTION_HANDOFF_CHECKPOINT_SOURCE_FIELDS = Object.freeze([
  "schema",
  "schemaVersion",
  "stateKind",
  "stateMode",
  "reviewedAt",
  "sourceHandoffDispositionInspectionCheckpoint",
  "pipelineSummary",
  "integratedReviewSummary",
  "decisionCandidateSummary",
  "inspectionSummary",
  "dispositionSummary",
  "aggregationSummary",
  "handoffSummary",
  "readinessSummary",
  "inspectionCheckpointSummary",
  "readinessHandoffDispositionSummary",
  "handoffDispositionInspectionCheckpointSummary",
  "inspectionHandoffMetadataSummary",
  "handoffDispositionInspectionCheckpointAccepted",
  "inspectionHandoffMetadataOnly",
  "inspectionHandoffMetadataIsReviewerRouting",
  "inspectionHandoffMetadataIsReviewerAssignment",
  "inspectionHandoffMetadataIsEvaluatorExecution",
  "inspectionHandoffMetadataIsEvaluatorResult",
  "inspectionHandoffMetadataIsApprovalDecision",
  "inspectionHandoffMetadataIsApprovalGrant",
  "reviewerRoutingPerformed",
  "reviewerRoutingEnabled",
  "reviewerRouteId",
  "reviewerAssignmentPerformed",
  "reviewerAssignmentEnabled",
  "reviewerAssignmentId",
  "reviewerId",
  "evaluatorResultProduced",
  "evaluatorResultPersisted",
  "evaluatorResultId",
  "approvalDecisionProduced",
  "approvalDecisionPersisted",
  "approvalDecisionId",
  "approvalGrantProduced",
  "approvalGrantPersisted",
  "approvalGrantId",
  "runtimePermissionGranted",
  "commandExposurePermissionGranted",
  "runtimeCommandExposureEnabled",
  "runtimeExecutionEnabled",
  "evaluatorExecutionRequested",
  "evaluatorExecutionStarted",
  "evaluatorExecutionEnabled",
  "evaluatorExecuted",
  "runtimeEffect"
]);

const REVIEW_ONLY_INSPECTION_HANDOFF_CHECKPOINT_REQUIRED_FALSE_FIELDS =
  Object.freeze([
    "inspectionHandoffMetadataIsReviewerRouting",
    "inspectionHandoffMetadataIsReviewerAssignment",
    "inspectionHandoffMetadataIsEvaluatorExecution",
    "inspectionHandoffMetadataIsEvaluatorResult",
    "inspectionHandoffMetadataIsApprovalDecision",
    "inspectionHandoffMetadataIsApprovalGrant",
    "reviewerRoutingPerformed",
    "reviewerRoutingEnabled",
    "reviewerAssignmentPerformed",
    "reviewerAssignmentEnabled",
    "evaluatorResultProduced",
    "evaluatorResultPersisted",
    "approvalDecisionProduced",
    "approvalDecisionPersisted",
    "approvalGrantProduced",
    "approvalGrantPersisted",
    "runtimePermissionGranted",
    "commandExposurePermissionGranted",
    "runtimeCommandExposureEnabled",
    "runtimeExecutionEnabled",
    "evaluatorExecutionRequested",
    "evaluatorExecutionStarted",
    "evaluatorExecutionEnabled",
    "evaluatorExecuted"
  ]);

const REVIEW_ONLY_INSPECTION_HANDOFF_CHECKPOINT_REQUIRED_NULL_FIELDS =
  Object.freeze([
    "reviewerRouteId",
    "reviewerAssignmentId",
    "reviewerId",
    "evaluatorResultId",
    "approvalDecisionId",
    "approvalGrantId"
  ]);

const REVIEW_ONLY_INSPECTION_HANDOFF_CHECKPOINT_REQUIRED_LITERAL_FIELDS =
  Object.freeze([
    ["schema", REVIEW_ONLY_INSPECTION_HANDOFF_METADATA_STATE_SCHEMA],
    [
      "schemaVersion",
      REVIEW_ONLY_INSPECTION_HANDOFF_METADATA_BOUNDARY_VERSION
    ],
    ["stateKind", "review-only-inspection-handoff-metadata-state"],
    ["stateMode", "review-only"],
    ["handoffDispositionInspectionCheckpointAccepted", true],
    ["inspectionHandoffMetadataOnly", true]
  ]);

const REVIEW_ONLY_INSPECTION_HANDOFF_CHECKPOINT_REQUIRED_OBJECT_FIELDS =
  Object.freeze([
    "sourceHandoffDispositionInspectionCheckpoint",
    "pipelineSummary",
    "integratedReviewSummary",
    "decisionCandidateSummary",
    "inspectionSummary",
    "dispositionSummary",
    "aggregationSummary",
    "handoffSummary",
    "readinessSummary",
    "inspectionCheckpointSummary",
    "readinessHandoffDispositionSummary",
    "handoffDispositionInspectionCheckpointSummary",
    "inspectionHandoffMetadataSummary"
  ]);

const REVIEW_ONLY_INSPECTION_HANDOFF_CHECKPOINT_REQUIRED_SUMMARY_FIELDS =
  Object.freeze([
    ["boundaryKind", REVIEW_ONLY_INSPECTION_HANDOFF_METADATA_BOUNDARY_KIND],
    ["boundaryMode", "review-only"],
    [
      "sourceHandoffDispositionInspectionCheckpointClassification",
      VALID_REVIEW_ONLY_HANDOFF_DISPOSITION_INSPECTION_CHECKPOINT_CLASSIFICATION
    ],
    ["inspectionHandoffMetadataOnly", true]
  ]);

const REVIEW_ONLY_INSPECTION_HANDOFF_CHECKPOINT_UNKNOWN_TRUE_FIELDS =
  Object.freeze(["unknown", "sourceUnknown"]);

const REVIEW_ONLY_INSPECTION_HANDOFF_CHECKPOINT_REVOKED_TRUE_FIELDS =
  Object.freeze(["revoked"]);

const REVIEW_ONLY_INSPECTION_HANDOFF_CHECKPOINT_REVOKED_PRESENT_FIELDS =
  Object.freeze(["revokedAt"]);

const REVIEW_ONLY_INSPECTION_HANDOFF_CHECKPOINT_REVIEWER_ASSIGNMENT_FALSE_FIELDS =
  Object.freeze(["reviewerAssignmentPerformed", "reviewerAssignmentEnabled"]);

const REVIEW_ONLY_INSPECTION_HANDOFF_CHECKPOINT_REVIEWER_ASSIGNMENT_NULL_FIELDS =
  Object.freeze(["reviewerAssignmentId", "reviewerId"]);

const REVIEW_ONLY_INSPECTION_HANDOFF_CHECKPOINT_ALLOWED_TOP_LEVEL_FIELDS =
  new Set(REVIEW_ONLY_INSPECTION_HANDOFF_CHECKPOINT_SOURCE_FIELDS);

const REVIEW_ONLY_INSPECTION_HANDOFF_CHECKPOINT_OBJECT_FIELD_GROUPS =
  Object.freeze({
    approvalDecision: [
      "approvalDecision",
      "approvalDecisionResult",
      "approvalDecisionGranted",
      "approvalDecisionAccepted",
      "approvalDecisionAuthorized",
      "inspectionHandoffCheckpointIsApprovalDecision"
    ],
    evaluatorResult: [
      "evaluatorResult",
      "evaluationResult",
      "evaluatorOutput",
      "evaluatorOutcome",
      "resultProduced"
    ],
    reviewerRouting: [
      "reviewerRouting",
      "reviewerRoute",
      "reviewerQueue",
      "routing",
      "routingDecision",
      "routingResult",
      "routeReviewer",
      "reviewerRoutingPermissionGranted"
    ],
    reviewerAssignment: [
      "reviewerAssignment",
      "reviewerAssigned",
      "reviewerAssignee",
      "assignedReviewer",
      "assignedReviewers",
      "reviewerIds",
      "reviewerAllocation",
      "assignmentDecision",
      "humanReviewer",
      "toolReviewer",
      "reviewerAssignmentPermissionGranted"
    ]
  });

const REVIEW_ONLY_INSPECTION_HANDOFF_CHECKPOINT_MALFORMED_CHECKS =
  Object.freeze([
    (metadata) => isPlainObjectRecord(metadata),
    (metadata) =>
      reviewOnlyInspectionHandoffMetadataBoundaryFieldsEqual(
        metadata,
        REVIEW_ONLY_INSPECTION_HANDOFF_CHECKPOINT_REQUIRED_LITERAL_FIELDS
      ),
    (metadata) => isUtcIsoTimestampWithMilliseconds(metadata.reviewedAt),
    (metadata) =>
      reviewOnlyInspectionHandoffMetadataBoundaryFieldsPlainObjects(
        metadata,
        REVIEW_ONLY_INSPECTION_HANDOFF_CHECKPOINT_REQUIRED_OBJECT_FIELDS
      ),
    (_metadata, summary) => isPlainObjectRecord(summary),
    (_metadata, summary) =>
      reviewOnlyInspectionHandoffMetadataBoundaryFieldsEqual(
        summary,
        REVIEW_ONLY_INSPECTION_HANDOFF_CHECKPOINT_REQUIRED_SUMMARY_FIELDS
      ),
    (metadata) =>
      REVIEW_ONLY_INSPECTION_HANDOFF_CHECKPOINT_REQUIRED_FALSE_FIELDS.every(
        (field) => metadata[field] === false
      ),
    (metadata) =>
      REVIEW_ONLY_INSPECTION_HANDOFF_CHECKPOINT_REQUIRED_NULL_FIELDS.every(
        (field) => metadata[field] === null
      ),
    (metadata) =>
      reviewOnlyInspectionHandoffMetadataBoundaryRuntimeEffectAllFalse(
        metadata.runtimeEffect
      )
  ]);

function reviewOnlyInspectionHandoffCheckpointUnexpectedUnsafeField(metadata) {
  return (
    isPlainObjectRecord(metadata) &&
    Object.keys(metadata).some(
      (key) =>
        !REVIEW_ONLY_INSPECTION_HANDOFF_CHECKPOINT_ALLOWED_TOP_LEVEL_FIELDS.has(
          key
        )
    )
  );
}

function reviewOnlyInspectionHandoffCheckpointUnsafeNestedMetadata(metadata) {
  return reviewOnlyInspectionHandoffMetadataBoundaryKeyPresent(metadata, [
    "inspectionHandoffCheckpoint",
    "inspectionHandoffCheckpointMetadata",
    "checkpointMetadata",
    "handoffMetadata",
    "boundaryMetadata",
    "reviewerRoutingMetadata",
    "reviewerAssignmentMetadata",
    "evaluatorExecutionMetadata",
    "evaluatorResultMetadata",
    "approvalDecisionMetadata",
    "approvalGrantMetadata",
    "runtimePermissionMetadata",
    "commandExposureMetadata",
    "executionMetadata"
  ]);
}

function reviewOnlyInspectionHandoffCheckpointUnknown(metadata) {
  return (
    isPlainObjectRecord(metadata) &&
    (reviewOnlyInspectionHandoffMetadataBoundaryAnyFieldTrue(
      metadata,
      REVIEW_ONLY_INSPECTION_HANDOFF_CHECKPOINT_UNKNOWN_TRUE_FIELDS
    ) ||
      ["classification", "status"].some((field) => metadata[field] === "unknown"))
  );
}

function reviewOnlyInspectionHandoffCheckpointRevoked(metadata) {
  return (
    isPlainObjectRecord(metadata) &&
    (reviewOnlyInspectionHandoffMetadataBoundaryAnyFieldTrue(
      metadata,
      REVIEW_ONLY_INSPECTION_HANDOFF_CHECKPOINT_REVOKED_TRUE_FIELDS
    ) ||
      reviewOnlyInspectionHandoffMetadataBoundaryAnyFieldPresent(
        metadata,
        REVIEW_ONLY_INSPECTION_HANDOFF_CHECKPOINT_REVOKED_PRESENT_FIELDS
      ) ||
      ["classification", "status"].some((field) => metadata[field] === "revoked"))
  );
}

function reviewOnlyInspectionHandoffCheckpointStale(metadata) {
  return (
    isPlainObjectRecord(metadata) &&
    isUtcIsoTimestampWithMilliseconds(metadata.reviewedAt) &&
    metadata.reviewedAt <
      REVIEW_ONLY_INSPECTION_HANDOFF_CHECKPOINT_MIN_REVIEWED_AT
  );
}

function reviewOnlyInspectionHandoffCheckpointMalformed(metadata) {
  const summary = isPlainObjectRecord(metadata)
    ? metadata.inspectionHandoffMetadataSummary
    : null;

  return !REVIEW_ONLY_INSPECTION_HANDOFF_CHECKPOINT_MALFORMED_CHECKS.every(
    (predicate) => predicate(metadata, summary)
  );
}

function reviewOnlyInspectionHandoffCheckpointApprovalDecisionLooking(metadata) {
  return (
    metadata.approvalDecisionProduced !== false ||
    metadata.approvalDecisionPersisted !== false ||
    metadata.approvalDecisionId !== null ||
    reviewOnlyInspectionHandoffMetadataBoundaryKeyTruePresent(
      metadata,
      REVIEW_ONLY_INSPECTION_HANDOFF_CHECKPOINT_OBJECT_FIELD_GROUPS
        .approvalDecision
    )
  );
}

function reviewOnlyInspectionHandoffCheckpointApprovalGrantLooking(metadata) {
  return (
    metadata.approvalGrantProduced !== false ||
    metadata.approvalGrantPersisted !== false ||
    metadata.approvalGrantId !== null
  );
}

function reviewOnlyInspectionHandoffCheckpointEvaluatorResultLooking(metadata) {
  return (
    metadata.evaluatorResultProduced !== false ||
    metadata.evaluatorResultPersisted !== false ||
    metadata.evaluatorResultId !== null ||
    reviewOnlyInspectionHandoffMetadataBoundaryKeyTruePresent(
      metadata,
      REVIEW_ONLY_INSPECTION_HANDOFF_CHECKPOINT_OBJECT_FIELD_GROUPS
        .evaluatorResult
    )
  );
}

function reviewOnlyInspectionHandoffCheckpointEvaluatorExecutionLooking(
  metadata
) {
  return (
    metadata.evaluatorExecutionRequested !== false ||
    metadata.evaluatorExecutionStarted !== false ||
    metadata.evaluatorExecutionEnabled !== false ||
    metadata.evaluatorExecuted !== false
  );
}

function reviewOnlyInspectionHandoffCheckpointReviewerRoutingLooking(metadata) {
  return (
    metadata.reviewerRoutingPerformed !== false ||
    metadata.reviewerRoutingEnabled !== false ||
    metadata.reviewerRouteId !== null ||
    reviewOnlyInspectionHandoffMetadataBoundaryKeyPresent(
      metadata,
      REVIEW_ONLY_INSPECTION_HANDOFF_CHECKPOINT_OBJECT_FIELD_GROUPS
        .reviewerRouting
    )
  );
}

function reviewOnlyInspectionHandoffCheckpointReviewerAssignmentLooking(
  metadata
) {
  return (
    reviewOnlyInspectionHandoffMetadataBoundaryAnyFieldNotEqual(
      metadata,
      REVIEW_ONLY_INSPECTION_HANDOFF_CHECKPOINT_REVIEWER_ASSIGNMENT_FALSE_FIELDS,
      false
    ) ||
    reviewOnlyInspectionHandoffMetadataBoundaryAnyFieldNotEqual(
      metadata,
      REVIEW_ONLY_INSPECTION_HANDOFF_CHECKPOINT_REVIEWER_ASSIGNMENT_NULL_FIELDS,
      null
    ) ||
    reviewOnlyInspectionHandoffMetadataBoundaryKeyPresent(
      metadata,
      REVIEW_ONLY_INSPECTION_HANDOFF_CHECKPOINT_OBJECT_FIELD_GROUPS
        .reviewerAssignment
    )
  );
}

function reviewOnlyInspectionHandoffCheckpointRuntimePermissionLooking(metadata) {
  return (
    metadata.runtimePermissionGranted !== false ||
    reviewOnlyInspectionHandoffMetadataBoundaryKeyTruePresent(metadata, [
      "runtimePermission",
      "runtimePermissionGranted",
      "canEnableRuntime"
    ])
  );
}

function reviewOnlyInspectionHandoffCheckpointCommandExposureLooking(metadata) {
  return (
    metadata.commandExposurePermissionGranted !== false ||
    metadata.runtimeCommandExposureEnabled !== false ||
    reviewOnlyInspectionHandoffMetadataBoundaryKeyTruePresent(metadata, [
      "commandExposure",
      "commandExposurePermissionGranted",
      "runtimeCommandEnabled",
      "runtimeCommandExposureEnabled"
    ])
  );
}

function reviewOnlyInspectionHandoffCheckpointRuntimeEffectTrue(metadata) {
  return (
    !reviewOnlyInspectionHandoffMetadataBoundaryRuntimeEffectAllFalse(
      metadata.runtimeEffect
    ) ||
    reviewOnlyInspectionHandoffMetadataBoundaryKeyTruePresent(metadata, [
      "runtimeEnabled",
      "runtimeStarted",
      "runtimeReady",
      "runtimeExecutionEnabled",
      "runtimeExecuted"
    ])
  );
}

function reviewOnlyInspectionHandoffCheckpointProcessFlagTrue(metadata) {
  return reviewOnlyInspectionHandoffMetadataBoundaryKeyTruePresent(metadata, [
    "processSpawned",
    "processSpawning",
    "processControlPerformed",
    "processTerminationEnabled",
    "runtimeSupervisionEnabled",
    "stdinLoopEnabled",
    "stdoutRuntimeWriterEnabled",
    "stderrRuntimeWriterEnabled"
  ]);
}

function reviewOnlyInspectionHandoffCheckpointExecutionSignalLooking(metadata) {
  return (
    metadata.runtimeExecutionEnabled !== false ||
    metadata.evaluatorExecuted !== false ||
    reviewOnlyInspectionHandoffMetadataBoundaryKeyTruePresent(metadata, [
      "executionSignal",
      "executionRequested",
      "executionStarted",
      "runtimeExecutionSignal",
      "approvalEvaluatorAuthoritative"
    ])
  );
}

function reviewOnlyInspectionHandoffCheckpointAuthorizing(metadata) {
  return reviewOnlyInspectionHandoffMetadataBoundaryKeyTruePresent(metadata, [
    "authoritative",
    "authorizing",
    "authorized",
    "authorizationGranted",
    "approvalAuthorized",
    "canApproveRuntime",
    "canGrantRuntime"
  ]);
}

const REVIEW_ONLY_INSPECTION_HANDOFF_CHECKPOINT_SINGLE_REJECTION_CHECKS =
  Object.freeze([
    [
      "unknown_review_only_inspection_handoff_checkpoint_input_rejected",
      reviewOnlyInspectionHandoffCheckpointUnknown
    ],
    [
      "revoked_review_only_inspection_handoff_checkpoint_input_rejected",
      reviewOnlyInspectionHandoffCheckpointRevoked
    ],
    [
      "stale_review_only_inspection_handoff_checkpoint_input_rejected",
      reviewOnlyInspectionHandoffCheckpointStale
    ],
    [
      "approval_decision_looking_review_only_inspection_handoff_checkpoint_input_rejected",
      reviewOnlyInspectionHandoffCheckpointApprovalDecisionLooking
    ],
    [
      "reviewer_routing_looking_review_only_inspection_handoff_checkpoint_input_rejected",
      reviewOnlyInspectionHandoffCheckpointReviewerRoutingLooking
    ],
    [
      "reviewer_assignment_looking_review_only_inspection_handoff_checkpoint_input_rejected",
      reviewOnlyInspectionHandoffCheckpointReviewerAssignmentLooking
    ],
    [
      "unsafe_review_only_inspection_handoff_checkpoint_input_rejected",
      reviewOnlyInspectionHandoffCheckpointUnexpectedUnsafeField
    ],
    [
      "unsafe_review_only_inspection_handoff_checkpoint_input_rejected",
      reviewOnlyInspectionHandoffCheckpointUnsafeNestedMetadata
    ],
    [
      "approval_grant_looking_review_only_inspection_handoff_checkpoint_input_rejected",
      reviewOnlyInspectionHandoffCheckpointApprovalGrantLooking
    ],
    [
      "grant_looking_review_only_inspection_handoff_checkpoint_input_rejected",
      reviewOnlyInspectionHandoffMetadataBoundaryGrantLooking
    ],
    [
      "evaluator_result_looking_review_only_inspection_handoff_checkpoint_input_rejected",
      reviewOnlyInspectionHandoffCheckpointEvaluatorResultLooking
    ],
    [
      "evaluator_execution_looking_review_only_inspection_handoff_checkpoint_input_rejected",
      reviewOnlyInspectionHandoffCheckpointEvaluatorExecutionLooking
    ],
    [
      "runtime_permission_looking_review_only_inspection_handoff_checkpoint_input_rejected",
      reviewOnlyInspectionHandoffCheckpointRuntimePermissionLooking
    ],
    [
      "command_exposure_looking_review_only_inspection_handoff_checkpoint_input_rejected",
      reviewOnlyInspectionHandoffCheckpointCommandExposureLooking
    ],
    [
      "runtime_effect_true_review_only_inspection_handoff_checkpoint_input_rejected",
      reviewOnlyInspectionHandoffCheckpointRuntimeEffectTrue
    ],
    [
      "process_flag_true_review_only_inspection_handoff_checkpoint_input_rejected",
      reviewOnlyInspectionHandoffCheckpointProcessFlagTrue
    ],
    [
      "execution_signal_looking_review_only_inspection_handoff_checkpoint_input_rejected",
      reviewOnlyInspectionHandoffCheckpointExecutionSignalLooking
    ],
    [
      "authorizing_review_only_inspection_handoff_checkpoint_input_rejected",
      reviewOnlyInspectionHandoffCheckpointAuthorizing
    ],
    [
      MALFORMED_REVIEW_ONLY_INSPECTION_HANDOFF_CHECKPOINT_CLASSIFICATION,
      reviewOnlyInspectionHandoffCheckpointMalformed
    ]
  ]);

function reviewOnlyInspectionHandoffCheckpointSingleClassification(metadata) {
  const rejection =
    REVIEW_ONLY_INSPECTION_HANDOFF_CHECKPOINT_SINGLE_REJECTION_CHECKS.find(
      ([, predicate]) => predicate(metadata)
    );

  return rejection?.[0] ?? VALID_REVIEW_ONLY_INSPECTION_HANDOFF_CHECKPOINT_CLASSIFICATION;
}

function reviewOnlyInspectionHandoffCheckpointInputsContainDuplicate(metadata) {
  const digests = metadata
    .filter(isPlainObjectRecord)
    .map((entry) => reviewArtifactHandoffDigest(entry));
  return new Set(digests).size !== digests.length;
}

function reviewOnlyInspectionHandoffCheckpointMultiInputClassification(metadata) {
  return reviewOnlyInspectionHandoffCheckpointInputsContainDuplicate(metadata)
    ? "duplicate_invalid_review_only_inspection_handoff_checkpoint_input_rejected"
    : "conflicting_review_only_inspection_handoff_checkpoint_input_rejected";
}

const REVIEW_ONLY_INSPECTION_HANDOFF_CHECKPOINT_INPUT_REJECTIONS =
  Object.freeze([
    [
      (metadata) => metadata === undefined,
      () => "missing_review_only_inspection_handoff_checkpoint_input_rejected"
    ],
    [
      (metadata) => !Array.isArray(metadata),
      () => MALFORMED_REVIEW_ONLY_INSPECTION_HANDOFF_CHECKPOINT_CLASSIFICATION
    ],
    [
      (metadata) => metadata.length === 0,
      () => "empty_review_only_inspection_handoff_checkpoint_input_rejected"
    ],
    [
      (metadata) => metadata.length > 1,
      reviewOnlyInspectionHandoffCheckpointMultiInputClassification
    ]
  ]);

function reviewOnlyInspectionHandoffCheckpointInputRejection(metadata) {
  const rejection =
    REVIEW_ONLY_INSPECTION_HANDOFF_CHECKPOINT_INPUT_REJECTIONS.find(
      ([predicate]) => predicate(metadata)
    );
  return rejection?.[1](metadata);
}

function reviewOnlyInspectionHandoffCheckpointClassification(metadata) {
  const inputRejection =
    reviewOnlyInspectionHandoffCheckpointInputRejection(metadata);

  return (
    inputRejection ??
    reviewOnlyInspectionHandoffCheckpointSingleClassification(metadata[0])
  );
}

function reviewOnlyInspectionHandoffCheckpointSummary() {
  return {
    checkpointKind: REVIEW_ONLY_INSPECTION_HANDOFF_CHECKPOINT_KIND,
    checkpointMode: "review-only",
    sourceInspectionHandoffMetadataBoundaryClassification:
      VALID_REVIEW_ONLY_INSPECTION_HANDOFF_METADATA_BOUNDARY_CLASSIFICATION,
    inspectionHandoffCheckpointMetadataOnly: true,
    cleanupToolkitBaselineEvidence: "phase-5.38a-behavior-preserving-runtime-blocked",
    reviewerRoutingPerformed: false,
    reviewerAssignmentPerformed: false,
    evaluatorExecutionPerformed: false,
    evaluatorResultProduced: false,
    approvalDecisionProduced: false,
    approvalGrantProduced: false,
    runtimePermissionGranted: false,
    commandExposurePermissionGranted: false,
    evaluatorExecuted: false,
    runtimeEffectAllFalse: true
  };
}

function reviewOnlyInspectionHandoffCheckpointCleanupEvidence() {
  return {
    phase: "phase-5.38a-cleanup-toolkit-adoption",
    document: "docs/phase-5-38a-cleanup-toolkit-adoption.md",
    behaviorPreserving: true,
    serveRuntimeStillDefaultBlocked: true,
    dryRunBypassesBlock: false,
    cleanupToolsInstalledByPhase539: false,
    fallowRuntimeUsed: false,
    runtimeExecutionEnabled: false,
    commandExposurePermissionGranted: false
  };
}

function reviewOnlyInspectionHandoffCheckpointStateFromMetadata(
  metadata,
  reviewedAt
) {
  return {
    schema: REVIEW_ONLY_INSPECTION_HANDOFF_CHECKPOINT_STATE_SCHEMA,
    schemaVersion: REVIEW_ONLY_INSPECTION_HANDOFF_CHECKPOINT_VERSION,
    stateKind: "review-only-inspection-handoff-checkpoint-state",
    stateMode: "review-only",
    reviewedAt,
    sourceInspectionHandoffMetadata: {
      schema: metadata.schema,
      stateKind: metadata.stateKind,
      stateMode: metadata.stateMode,
      reviewedAt: metadata.reviewedAt,
      stateDigest: reviewArtifactHandoffDigest(metadata),
      sourceHandoffDispositionInspectionCheckpointDigest:
        metadata.sourceHandoffDispositionInspectionCheckpoint.stateDigest,
      inspectionHandoffMetadataOnly: true,
      inspectionHandoffMetadataIsReviewerRouting: false,
      inspectionHandoffMetadataIsReviewerAssignment: false,
      inspectionHandoffMetadataIsEvaluatorExecution: false,
      inspectionHandoffMetadataIsEvaluatorResult: false,
      inspectionHandoffMetadataIsApprovalDecision: false,
      inspectionHandoffMetadataIsApprovalGrant: false,
      reviewerRoutingPerformed: false,
      reviewerAssignmentPerformed: false,
      evaluatorResultProduced: false,
      approvalDecisionProduced: false,
      approvalGrantProduced: false,
      approvalGrantPersisted: false,
      evaluatorExecuted: false,
      runtimeEffectAllFalse: true
    },
    checkpointSummary: reviewOnlyInspectionHandoffCheckpointSummary(),
    cleanupToolkitBaselineEvidence:
      reviewOnlyInspectionHandoffCheckpointCleanupEvidence(),
    inspectionHandoffMetadataAccepted: true,
    inspectionHandoffCheckpointMetadataOnly: true,
    inspectionHandoffCheckpointIsReviewerRouting: false,
    inspectionHandoffCheckpointIsReviewerAssignment: false,
    inspectionHandoffCheckpointIsEvaluatorExecution: false,
    inspectionHandoffCheckpointIsEvaluatorResult: false,
    inspectionHandoffCheckpointIsApprovalDecision: false,
    inspectionHandoffCheckpointIsApprovalGrant: false,
    reviewerRoutingPerformed: false,
    reviewerRoutingEnabled: false,
    reviewerRouteId: null,
    reviewerAssignmentPerformed: false,
    reviewerAssignmentEnabled: false,
    reviewerAssignmentId: null,
    reviewerId: null,
    evaluatorResultProduced: false,
    evaluatorResultPersisted: false,
    evaluatorResultId: null,
    approvalDecisionProduced: false,
    approvalDecisionPersisted: false,
    approvalDecisionId: null,
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

function reviewOnlyInspectionHandoffCheckpointRejectionReasons({
  accepted,
  classification
}) {
  if (accepted) {
    return [
      "inspection_handoff_checkpoint_is_review_only",
      "reviewer_routing_not_implemented",
      "reviewer_assignment_not_implemented",
      "evaluator_execution_not_implemented",
      "evaluator_result_not_implemented",
      "approval_decision_not_implemented",
      "approval_grant_not_implemented",
      "phase_5_38a_cleanup_baseline_behavior_preserving",
      "runtime_enablement_still_blocked"
    ];
  }

  return [
    classification,
    "inspection_handoff_checkpoint_not_produced",
    "reviewer_routing_not_implemented",
    "reviewer_assignment_not_implemented",
    "evaluator_execution_not_implemented",
    "evaluator_result_not_implemented",
    "approval_decision_not_implemented",
    "approval_grant_not_implemented",
    "runtime_enablement_still_blocked"
  ];
}

function reviewOnlyInspectionHandoffCheckpointInputRecord(input) {
  return isPlainObjectRecord(input) ? input : null;
}

function reviewOnlyInspectionHandoffCheckpointReviewedAt(inputRecord) {
  if (
    inputRecord === null ||
    !Object.prototype.hasOwnProperty.call(inputRecord, "reviewedAt")
  ) {
    return APPROVAL_PREREQUISITE_SOURCE_PREFLIGHT_DEFAULT_REVIEWED_AT;
  }

  return isUtcIsoTimestampWithMilliseconds(inputRecord.reviewedAt)
    ? inputRecord.reviewedAt
    : APPROVAL_PREREQUISITE_SOURCE_PREFLIGHT_DEFAULT_REVIEWED_AT;
}

function reviewOnlyInspectionHandoffCheckpointInputMalformed(inputRecord) {
  return (
    inputRecord === null ||
    (Object.prototype.hasOwnProperty.call(inputRecord, "reviewedAt") &&
      !isUtcIsoTimestampWithMilliseconds(inputRecord.reviewedAt))
  );
}

function reviewOnlyInspectionHandoffCheckpointEntries(inputRecord) {
  return inputRecord === null
    ? undefined
    : inputRecord.inspectionHandoffMetadataEntries;
}

function reviewOnlyInspectionHandoffCheckpointInputClassification(
  inputRecord,
  metadata
) {
  return reviewOnlyInspectionHandoffCheckpointInputMalformed(inputRecord)
    ? MALFORMED_REVIEW_ONLY_INSPECTION_HANDOFF_CHECKPOINT_CLASSIFICATION
    : reviewOnlyInspectionHandoffCheckpointClassification(metadata);
}

function reviewOnlyInspectionHandoffCheckpointSummaryFromMetadata(metadata) {
  return {
    schema: metadata.schema,
    stateKind: metadata.stateKind,
    stateMode: metadata.stateMode,
    reviewedAt: metadata.reviewedAt,
    stateDigest: reviewArtifactHandoffDigest(metadata),
    inspectionHandoffMetadataIsReviewerRouting: false,
    inspectionHandoffMetadataIsReviewerAssignment: false,
    inspectionHandoffMetadataIsEvaluatorExecution: false,
    inspectionHandoffMetadataIsEvaluatorResult: false,
    inspectionHandoffMetadataIsApprovalDecision: false,
    inspectionHandoffMetadataIsApprovalGrant: false,
    reviewerRoutingPerformed: false,
    reviewerAssignmentPerformed: false,
    evaluatorResultProduced: false,
    approvalDecisionProduced: false,
    approvalGrantProduced: false,
    approvalGrantPersisted: false,
    evaluatorExecuted: false,
    runtimeEffectAllFalse: true
  };
}

function reviewOnlyInspectionHandoffCheckpointAcceptedOutput({
  accepted,
  metadata,
  reviewedAt
}) {
  if (!accepted) {
    return {
      inspectionHandoffCheckpoint: null,
      inspectionHandoffMetadataSummary: null
    };
  }

  const sourceMetadata = metadata[0];

  return {
    inspectionHandoffCheckpoint:
      reviewOnlyInspectionHandoffCheckpointStateFromMetadata(
        sourceMetadata,
        reviewedAt
      ),
    inspectionHandoffMetadataSummary:
      reviewOnlyInspectionHandoffCheckpointSummaryFromMetadata(sourceMetadata)
  };
}

function reviewOnlyInspectionHandoffCheckpointResult({
  reviewedAt,
  reviewedAtDefaulted,
  classification,
  accepted,
  inspectionHandoffCheckpoint,
  inspectionHandoffMetadataSummary
}) {
  return {
    schema: REVIEW_ONLY_INSPECTION_HANDOFF_CHECKPOINT_SCHEMA,
    schemaVersion: REVIEW_ONLY_INSPECTION_HANDOFF_CHECKPOINT_VERSION,
    checkpointKind: REVIEW_ONLY_INSPECTION_HANDOFF_CHECKPOINT_KIND,
    checkpointMode: "review-only",
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    inspectionHandoffMetadataAccepted: accepted,
    inspectionHandoffCheckpointProduced: accepted,
    inspectionHandoffCheckpointIsReviewerRouting: false,
    inspectionHandoffCheckpointIsReviewerAssignment: false,
    inspectionHandoffCheckpointIsEvaluatorExecution: false,
    inspectionHandoffCheckpointIsEvaluatorResult: false,
    inspectionHandoffCheckpointIsApprovalDecision: false,
    inspectionHandoffCheckpointIsApprovalGrant: false,
    inspectionHandoffCheckpoint,
    inspectionHandoffMetadataSummary,
    cleanupToolkitBaselineEvidence:
      reviewOnlyInspectionHandoffCheckpointCleanupEvidence(),
    reviewOnly: true,
    authoritative: false,
    reviewArtifactOnly: true,
    inspectionHandoffCheckpointMetadataOnly: true,
    reviewerRoutingPerformed: false,
    reviewerRoutingEnabled: false,
    reviewerRouteId: null,
    reviewerAssignmentPerformed: false,
    reviewerAssignmentEnabled: false,
    reviewerAssignmentId: null,
    reviewerId: null,
    evaluatorResultProduced: false,
    evaluatorResultPersisted: false,
    evaluatorResultId: null,
    approvalDecisionProduced: false,
    approvalDecisionPersisted: false,
    approvalDecisionId: null,
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
    rejectionReasons: reviewOnlyInspectionHandoffCheckpointRejectionReasons({
      accepted,
      classification
    }),
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

export function createReviewOnlyInspectionHandoffCheckpointForReview(input = {}) {
  const inputRecord = reviewOnlyInspectionHandoffCheckpointInputRecord(input);
  const reviewedAt =
    reviewOnlyInspectionHandoffCheckpointReviewedAt(inputRecord);
  const reviewedAtDefaulted = isReviewedAtDefaulted(inputRecord);
  const metadata = reviewOnlyInspectionHandoffCheckpointEntries(inputRecord);
  const classification =
    reviewOnlyInspectionHandoffCheckpointInputClassification(
      inputRecord,
      metadata
    );
  const accepted =
    classification ===
    VALID_REVIEW_ONLY_INSPECTION_HANDOFF_CHECKPOINT_CLASSIFICATION;
  const { inspectionHandoffCheckpoint, inspectionHandoffMetadataSummary } =
    reviewOnlyInspectionHandoffCheckpointAcceptedOutput({
      accepted,
      metadata,
      reviewedAt
    });

  return reviewOnlyInspectionHandoffCheckpointResult({
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    accepted,
    inspectionHandoffCheckpoint,
    inspectionHandoffMetadataSummary
  });
}

const REVIEW_ONLY_CHECKPOINT_HANDOFF_LAYER_STATE_SCHEMA =
  "ardyn.phase-5.40.review-only-checkpoint-handoff-layer-state";

const REVIEW_ONLY_CHECKPOINT_HANDOFF_LAYER_MIN_REVIEWED_AT =
  "2026-06-17T00:00:00.000Z";

const VALID_REVIEW_ONLY_CHECKPOINT_HANDOFF_LAYER_CLASSIFICATION =
  "valid_review_only_checkpoint_handoff_layer_runtime_still_blocked";
const MALFORMED_REVIEW_ONLY_CHECKPOINT_HANDOFF_LAYER_CLASSIFICATION =
  "malformed_review_only_checkpoint_handoff_layer_input_rejected";

const REVIEW_ONLY_CHECKPOINT_HANDOFF_LAYER_SOURCE_FIELDS = Object.freeze([
  "schema",
  "schemaVersion",
  "stateKind",
  "stateMode",
  "reviewedAt",
  "sourceInspectionHandoffMetadata",
  "checkpointSummary",
  "cleanupToolkitBaselineEvidence",
  "inspectionHandoffMetadataAccepted",
  "inspectionHandoffCheckpointMetadataOnly",
  "inspectionHandoffCheckpointIsReviewerRouting",
  "inspectionHandoffCheckpointIsReviewerAssignment",
  "inspectionHandoffCheckpointIsEvaluatorExecution",
  "inspectionHandoffCheckpointIsEvaluatorResult",
  "inspectionHandoffCheckpointIsApprovalDecision",
  "inspectionHandoffCheckpointIsApprovalGrant",
  "reviewerRoutingPerformed",
  "reviewerRoutingEnabled",
  "reviewerRouteId",
  "reviewerAssignmentPerformed",
  "reviewerAssignmentEnabled",
  "reviewerAssignmentId",
  "reviewerId",
  "evaluatorResultProduced",
  "evaluatorResultPersisted",
  "evaluatorResultId",
  "approvalDecisionProduced",
  "approvalDecisionPersisted",
  "approvalDecisionId",
  "approvalGrantProduced",
  "approvalGrantPersisted",
  "approvalGrantId",
  "runtimePermissionGranted",
  "commandExposurePermissionGranted",
  "runtimeCommandExposureEnabled",
  "runtimeExecutionEnabled",
  "evaluatorExecutionRequested",
  "evaluatorExecutionStarted",
  "evaluatorExecutionEnabled",
  "evaluatorExecuted",
  "runtimeEffect"
]);

const REVIEW_ONLY_CHECKPOINT_HANDOFF_LAYER_REQUIRED_FALSE_FIELDS =
  Object.freeze([
    "inspectionHandoffCheckpointIsReviewerRouting",
    "inspectionHandoffCheckpointIsReviewerAssignment",
    "inspectionHandoffCheckpointIsEvaluatorExecution",
    "inspectionHandoffCheckpointIsEvaluatorResult",
    "inspectionHandoffCheckpointIsApprovalDecision",
    "inspectionHandoffCheckpointIsApprovalGrant",
    "reviewerRoutingPerformed",
    "reviewerRoutingEnabled",
    "reviewerAssignmentPerformed",
    "reviewerAssignmentEnabled",
    "evaluatorResultProduced",
    "evaluatorResultPersisted",
    "approvalDecisionProduced",
    "approvalDecisionPersisted",
    "approvalGrantProduced",
    "approvalGrantPersisted",
    "runtimePermissionGranted",
    "commandExposurePermissionGranted",
    "runtimeCommandExposureEnabled",
    "runtimeExecutionEnabled",
    "evaluatorExecutionRequested",
    "evaluatorExecutionStarted",
    "evaluatorExecutionEnabled",
    "evaluatorExecuted"
  ]);

const REVIEW_ONLY_CHECKPOINT_HANDOFF_LAYER_REQUIRED_NULL_FIELDS =
  Object.freeze([
    "reviewerRouteId",
    "reviewerAssignmentId",
    "reviewerId",
    "evaluatorResultId",
    "approvalDecisionId",
    "approvalGrantId"
  ]);

const REVIEW_ONLY_CHECKPOINT_HANDOFF_LAYER_REQUIRED_LITERAL_FIELDS =
  Object.freeze([
    ["schema", REVIEW_ONLY_INSPECTION_HANDOFF_CHECKPOINT_STATE_SCHEMA],
    ["schemaVersion", REVIEW_ONLY_INSPECTION_HANDOFF_CHECKPOINT_VERSION],
    ["stateKind", "review-only-inspection-handoff-checkpoint-state"],
    ["stateMode", "review-only"],
    ["inspectionHandoffMetadataAccepted", true],
    ["inspectionHandoffCheckpointMetadataOnly", true]
  ]);

const REVIEW_ONLY_CHECKPOINT_HANDOFF_LAYER_REQUIRED_OBJECT_FIELDS =
  Object.freeze([
    "sourceInspectionHandoffMetadata",
    "checkpointSummary",
    "cleanupToolkitBaselineEvidence"
  ]);

const REVIEW_ONLY_CHECKPOINT_HANDOFF_LAYER_REQUIRED_SUMMARY_FIELDS =
  Object.freeze([
    ["checkpointKind", REVIEW_ONLY_INSPECTION_HANDOFF_CHECKPOINT_KIND],
    ["checkpointMode", "review-only"],
    [
      "sourceInspectionHandoffMetadataBoundaryClassification",
      VALID_REVIEW_ONLY_INSPECTION_HANDOFF_METADATA_BOUNDARY_CLASSIFICATION
    ],
    ["inspectionHandoffCheckpointMetadataOnly", true],
    [
      "cleanupToolkitBaselineEvidence",
      "phase-5.38a-behavior-preserving-runtime-blocked"
    ]
  ]);

const REVIEW_ONLY_CHECKPOINT_HANDOFF_LAYER_UNKNOWN_TRUE_FIELDS = Object.freeze([
  "unknown",
  "sourceUnknown"
]);

const REVIEW_ONLY_CHECKPOINT_HANDOFF_LAYER_REVOKED_TRUE_FIELDS =
  Object.freeze(["revoked"]);

const REVIEW_ONLY_CHECKPOINT_HANDOFF_LAYER_REVOKED_PRESENT_FIELDS =
  Object.freeze(["revokedAt"]);

const REVIEW_ONLY_CHECKPOINT_HANDOFF_LAYER_REVIEWER_ASSIGNMENT_FALSE_FIELDS =
  Object.freeze(["reviewerAssignmentPerformed", "reviewerAssignmentEnabled"]);

const REVIEW_ONLY_CHECKPOINT_HANDOFF_LAYER_REVIEWER_ASSIGNMENT_NULL_FIELDS =
  Object.freeze(["reviewerAssignmentId", "reviewerId"]);

const REVIEW_ONLY_CHECKPOINT_HANDOFF_LAYER_ALLOWED_TOP_LEVEL_FIELDS = new Set(
  REVIEW_ONLY_CHECKPOINT_HANDOFF_LAYER_SOURCE_FIELDS
);

const REVIEW_ONLY_CHECKPOINT_HANDOFF_LAYER_OBJECT_FIELD_GROUPS = Object.freeze({
  approvalDecision: [
    "approvalDecision",
    "approvalDecisionResult",
    "approvalDecisionGranted",
    "approvalDecisionAccepted",
    "approvalDecisionAuthorized",
    "checkpointHandoffLayerIsApprovalDecision"
  ],
  evaluatorResult: [
    "evaluatorResult",
    "evaluationResult",
    "evaluatorOutput",
    "evaluatorOutcome",
    "resultProduced"
  ],
  reviewerRouting: [
    "reviewerRouting",
    "reviewerRoute",
    "reviewerQueue",
    "routing",
    "routingDecision",
    "routingResult",
    "routeReviewer",
    "reviewerRoutingPermissionGranted"
  ],
  reviewerAssignment: [
    "reviewerAssignment",
    "reviewerAssigned",
    "reviewerAssignee",
    "assignedReviewer",
    "assignedReviewers",
    "reviewerIds",
    "reviewerAllocation",
    "assignmentDecision",
    "humanReviewer",
    "toolReviewer",
    "reviewerAssignmentPermissionGranted"
  ]
});

const REVIEW_ONLY_CHECKPOINT_HANDOFF_LAYER_MALFORMED_CHECKS = Object.freeze([
  (checkpoint) => isPlainObjectRecord(checkpoint),
  (checkpoint) =>
    reviewOnlyInspectionHandoffMetadataBoundaryFieldsEqual(
      checkpoint,
      REVIEW_ONLY_CHECKPOINT_HANDOFF_LAYER_REQUIRED_LITERAL_FIELDS
    ),
  (checkpoint) => isUtcIsoTimestampWithMilliseconds(checkpoint.reviewedAt),
  (checkpoint) =>
    reviewOnlyInspectionHandoffMetadataBoundaryFieldsPlainObjects(
      checkpoint,
      REVIEW_ONLY_CHECKPOINT_HANDOFF_LAYER_REQUIRED_OBJECT_FIELDS
    ),
  (_checkpoint, summary) => isPlainObjectRecord(summary),
  (_checkpoint, summary) =>
    reviewOnlyInspectionHandoffMetadataBoundaryFieldsEqual(
      summary,
      REVIEW_ONLY_CHECKPOINT_HANDOFF_LAYER_REQUIRED_SUMMARY_FIELDS
    ),
  (checkpoint) =>
    REVIEW_ONLY_CHECKPOINT_HANDOFF_LAYER_REQUIRED_FALSE_FIELDS.every(
      (field) => checkpoint[field] === false
    ),
  (checkpoint) =>
    REVIEW_ONLY_CHECKPOINT_HANDOFF_LAYER_REQUIRED_NULL_FIELDS.every(
      (field) => checkpoint[field] === null
    ),
  (checkpoint) =>
    reviewOnlyInspectionHandoffMetadataBoundaryRuntimeEffectAllFalse(
      checkpoint.runtimeEffect
    )
]);

function reviewOnlyCheckpointHandoffLayerUnexpectedUnsafeField(checkpoint) {
  return (
    isPlainObjectRecord(checkpoint) &&
    Object.keys(checkpoint).some(
      (key) =>
        !REVIEW_ONLY_CHECKPOINT_HANDOFF_LAYER_ALLOWED_TOP_LEVEL_FIELDS.has(key)
    )
  );
}

function reviewOnlyCheckpointHandoffLayerUnsafeNestedMetadata(checkpoint) {
  return reviewOnlyInspectionHandoffMetadataBoundaryKeyPresent(checkpoint, [
    "checkpointHandoffLayer",
    "checkpointHandoffLayerMetadata",
    "checkpointMetadata",
    "handoffMetadata",
    "checkpointHandoffMetadata",
    "reviewerRoutingMetadata",
    "reviewerAssignmentMetadata",
    "evaluatorExecutionMetadata",
    "evaluatorResultMetadata",
    "approvalDecisionMetadata",
    "approvalGrantMetadata",
    "runtimePermissionMetadata",
    "commandExposureMetadata",
    "executionMetadata"
  ]);
}

function reviewOnlyCheckpointHandoffLayerUnknown(checkpoint) {
  return (
    isPlainObjectRecord(checkpoint) &&
    (reviewOnlyInspectionHandoffMetadataBoundaryAnyFieldTrue(
      checkpoint,
      REVIEW_ONLY_CHECKPOINT_HANDOFF_LAYER_UNKNOWN_TRUE_FIELDS
    ) ||
      ["classification", "status"].some(
        (field) => checkpoint[field] === "unknown"
      ))
  );
}

function reviewOnlyCheckpointHandoffLayerRevoked(checkpoint) {
  return (
    isPlainObjectRecord(checkpoint) &&
    (reviewOnlyInspectionHandoffMetadataBoundaryAnyFieldTrue(
      checkpoint,
      REVIEW_ONLY_CHECKPOINT_HANDOFF_LAYER_REVOKED_TRUE_FIELDS
    ) ||
      reviewOnlyInspectionHandoffMetadataBoundaryAnyFieldPresent(
        checkpoint,
        REVIEW_ONLY_CHECKPOINT_HANDOFF_LAYER_REVOKED_PRESENT_FIELDS
      ) ||
      ["classification", "status"].some(
        (field) => checkpoint[field] === "revoked"
      ))
  );
}

function reviewOnlyCheckpointHandoffLayerStale(checkpoint) {
  return (
    isPlainObjectRecord(checkpoint) &&
    isUtcIsoTimestampWithMilliseconds(checkpoint.reviewedAt) &&
    checkpoint.reviewedAt < REVIEW_ONLY_CHECKPOINT_HANDOFF_LAYER_MIN_REVIEWED_AT
  );
}

function reviewOnlyCheckpointHandoffLayerMalformed(checkpoint) {
  const summary = isPlainObjectRecord(checkpoint)
    ? checkpoint.checkpointSummary
    : null;

  return !REVIEW_ONLY_CHECKPOINT_HANDOFF_LAYER_MALFORMED_CHECKS.every(
    (predicate) => predicate(checkpoint, summary)
  );
}

function reviewOnlyCheckpointHandoffLayerApprovalDecisionLooking(checkpoint) {
  return (
    checkpoint.approvalDecisionProduced !== false ||
    checkpoint.approvalDecisionPersisted !== false ||
    checkpoint.approvalDecisionId !== null ||
    reviewOnlyInspectionHandoffMetadataBoundaryKeyTruePresent(
      checkpoint,
      REVIEW_ONLY_CHECKPOINT_HANDOFF_LAYER_OBJECT_FIELD_GROUPS.approvalDecision
    )
  );
}

function reviewOnlyCheckpointHandoffLayerApprovalGrantLooking(checkpoint) {
  return (
    checkpoint.approvalGrantProduced !== false ||
    checkpoint.approvalGrantPersisted !== false ||
    checkpoint.approvalGrantId !== null
  );
}

function reviewOnlyCheckpointHandoffLayerEvaluatorResultLooking(checkpoint) {
  return (
    checkpoint.evaluatorResultProduced !== false ||
    checkpoint.evaluatorResultPersisted !== false ||
    checkpoint.evaluatorResultId !== null ||
    reviewOnlyInspectionHandoffMetadataBoundaryKeyTruePresent(
      checkpoint,
      REVIEW_ONLY_CHECKPOINT_HANDOFF_LAYER_OBJECT_FIELD_GROUPS.evaluatorResult
    )
  );
}

function reviewOnlyCheckpointHandoffLayerEvaluatorExecutionLooking(checkpoint) {
  return (
    checkpoint.evaluatorExecutionRequested !== false ||
    checkpoint.evaluatorExecutionStarted !== false ||
    checkpoint.evaluatorExecutionEnabled !== false ||
    checkpoint.evaluatorExecuted !== false
  );
}

function reviewOnlyCheckpointHandoffLayerReviewerRoutingLooking(checkpoint) {
  return (
    checkpoint.reviewerRoutingPerformed !== false ||
    checkpoint.reviewerRoutingEnabled !== false ||
    checkpoint.reviewerRouteId !== null ||
    reviewOnlyInspectionHandoffMetadataBoundaryKeyPresent(
      checkpoint,
      REVIEW_ONLY_CHECKPOINT_HANDOFF_LAYER_OBJECT_FIELD_GROUPS.reviewerRouting
    )
  );
}

function reviewOnlyCheckpointHandoffLayerReviewerAssignmentLooking(checkpoint) {
  return (
    reviewOnlyInspectionHandoffMetadataBoundaryAnyFieldNotEqual(
      checkpoint,
      REVIEW_ONLY_CHECKPOINT_HANDOFF_LAYER_REVIEWER_ASSIGNMENT_FALSE_FIELDS,
      false
    ) ||
    reviewOnlyInspectionHandoffMetadataBoundaryAnyFieldNotEqual(
      checkpoint,
      REVIEW_ONLY_CHECKPOINT_HANDOFF_LAYER_REVIEWER_ASSIGNMENT_NULL_FIELDS,
      null
    ) ||
    reviewOnlyInspectionHandoffMetadataBoundaryKeyPresent(
      checkpoint,
      REVIEW_ONLY_CHECKPOINT_HANDOFF_LAYER_OBJECT_FIELD_GROUPS.reviewerAssignment
    )
  );
}

function reviewOnlyCheckpointHandoffLayerRuntimePermissionLooking(checkpoint) {
  return (
    checkpoint.runtimePermissionGranted !== false ||
    reviewOnlyInspectionHandoffMetadataBoundaryKeyTruePresent(checkpoint, [
      "runtimePermission",
      "runtimePermissionGranted",
      "canEnableRuntime"
    ])
  );
}

function reviewOnlyCheckpointHandoffLayerCommandExposureLooking(checkpoint) {
  return (
    checkpoint.commandExposurePermissionGranted !== false ||
    checkpoint.runtimeCommandExposureEnabled !== false ||
    reviewOnlyInspectionHandoffMetadataBoundaryKeyTruePresent(checkpoint, [
      "commandExposure",
      "commandExposurePermissionGranted",
      "runtimeCommandEnabled",
      "runtimeCommandExposureEnabled"
    ])
  );
}

function reviewOnlyCheckpointHandoffLayerRuntimeEffectTrue(checkpoint) {
  return (
    !reviewOnlyInspectionHandoffMetadataBoundaryRuntimeEffectAllFalse(
      checkpoint.runtimeEffect
    ) ||
    reviewOnlyInspectionHandoffMetadataBoundaryKeyTruePresent(checkpoint, [
      "runtimeEnabled",
      "runtimeStarted",
      "runtimeReady",
      "runtimeExecutionEnabled",
      "runtimeExecuted"
    ])
  );
}

function reviewOnlyCheckpointHandoffLayerProcessFlagTrue(checkpoint) {
  return reviewOnlyInspectionHandoffMetadataBoundaryKeyTruePresent(checkpoint, [
    "processSpawned",
    "processSpawning",
    "processControlPerformed",
    "processTerminationEnabled",
    "runtimeSupervisionEnabled",
    "stdinLoopEnabled",
    "stdoutRuntimeWriterEnabled",
    "stderrRuntimeWriterEnabled"
  ]);
}

function reviewOnlyCheckpointHandoffLayerExecutionSignalLooking(checkpoint) {
  return (
    checkpoint.runtimeExecutionEnabled !== false ||
    checkpoint.evaluatorExecuted !== false ||
    reviewOnlyInspectionHandoffMetadataBoundaryKeyTruePresent(checkpoint, [
      "executionSignal",
      "executionRequested",
      "executionStarted",
      "runtimeExecutionSignal",
      "approvalEvaluatorAuthoritative"
    ])
  );
}

function reviewOnlyCheckpointHandoffLayerAuthorizing(checkpoint) {
  return reviewOnlyInspectionHandoffMetadataBoundaryKeyTruePresent(checkpoint, [
    "authoritative",
    "authorizing",
    "authorized",
    "authorizationGranted",
    "approvalAuthorized",
    "canApproveRuntime",
    "canGrantRuntime"
  ]);
}

const REVIEW_ONLY_CHECKPOINT_HANDOFF_LAYER_SINGLE_REJECTION_CHECKS =
  Object.freeze([
    [
      "unknown_review_only_checkpoint_handoff_layer_input_rejected",
      reviewOnlyCheckpointHandoffLayerUnknown
    ],
    [
      "revoked_review_only_checkpoint_handoff_layer_input_rejected",
      reviewOnlyCheckpointHandoffLayerRevoked
    ],
    [
      "stale_review_only_checkpoint_handoff_layer_input_rejected",
      reviewOnlyCheckpointHandoffLayerStale
    ],
    [
      "approval_decision_looking_review_only_checkpoint_handoff_layer_input_rejected",
      reviewOnlyCheckpointHandoffLayerApprovalDecisionLooking
    ],
    [
      "reviewer_routing_looking_review_only_checkpoint_handoff_layer_input_rejected",
      reviewOnlyCheckpointHandoffLayerReviewerRoutingLooking
    ],
    [
      "reviewer_assignment_looking_review_only_checkpoint_handoff_layer_input_rejected",
      reviewOnlyCheckpointHandoffLayerReviewerAssignmentLooking
    ],
    [
      "unsafe_review_only_checkpoint_handoff_layer_input_rejected",
      reviewOnlyCheckpointHandoffLayerUnexpectedUnsafeField
    ],
    [
      "unsafe_review_only_checkpoint_handoff_layer_input_rejected",
      reviewOnlyCheckpointHandoffLayerUnsafeNestedMetadata
    ],
    [
      "approval_grant_looking_review_only_checkpoint_handoff_layer_input_rejected",
      reviewOnlyCheckpointHandoffLayerApprovalGrantLooking
    ],
    [
      "grant_looking_review_only_checkpoint_handoff_layer_input_rejected",
      reviewOnlyInspectionHandoffMetadataBoundaryGrantLooking
    ],
    [
      "evaluator_result_looking_review_only_checkpoint_handoff_layer_input_rejected",
      reviewOnlyCheckpointHandoffLayerEvaluatorResultLooking
    ],
    [
      "evaluator_execution_looking_review_only_checkpoint_handoff_layer_input_rejected",
      reviewOnlyCheckpointHandoffLayerEvaluatorExecutionLooking
    ],
    [
      "runtime_permission_looking_review_only_checkpoint_handoff_layer_input_rejected",
      reviewOnlyCheckpointHandoffLayerRuntimePermissionLooking
    ],
    [
      "command_exposure_looking_review_only_checkpoint_handoff_layer_input_rejected",
      reviewOnlyCheckpointHandoffLayerCommandExposureLooking
    ],
    [
      "runtime_effect_true_review_only_checkpoint_handoff_layer_input_rejected",
      reviewOnlyCheckpointHandoffLayerRuntimeEffectTrue
    ],
    [
      "process_flag_true_review_only_checkpoint_handoff_layer_input_rejected",
      reviewOnlyCheckpointHandoffLayerProcessFlagTrue
    ],
    [
      "execution_signal_looking_review_only_checkpoint_handoff_layer_input_rejected",
      reviewOnlyCheckpointHandoffLayerExecutionSignalLooking
    ],
    [
      "authorizing_review_only_checkpoint_handoff_layer_input_rejected",
      reviewOnlyCheckpointHandoffLayerAuthorizing
    ],
    [
      MALFORMED_REVIEW_ONLY_CHECKPOINT_HANDOFF_LAYER_CLASSIFICATION,
      reviewOnlyCheckpointHandoffLayerMalformed
    ]
  ]);

function reviewOnlyCheckpointHandoffLayerSingleClassification(checkpoint) {
  const rejection =
    REVIEW_ONLY_CHECKPOINT_HANDOFF_LAYER_SINGLE_REJECTION_CHECKS.find(
      ([, predicate]) => predicate(checkpoint)
    );

  return rejection?.[0] ?? VALID_REVIEW_ONLY_CHECKPOINT_HANDOFF_LAYER_CLASSIFICATION;
}

function reviewOnlyCheckpointHandoffLayerInputsContainDuplicate(checkpoints) {
  const digests = checkpoints
    .filter(isPlainObjectRecord)
    .map((entry) => reviewArtifactHandoffDigest(entry));
  return new Set(digests).size !== digests.length;
}

function reviewOnlyCheckpointHandoffLayerMultiInputClassification(checkpoints) {
  return reviewOnlyCheckpointHandoffLayerInputsContainDuplicate(checkpoints)
    ? "duplicate_invalid_review_only_checkpoint_handoff_layer_input_rejected"
    : "conflicting_review_only_checkpoint_handoff_layer_input_rejected";
}

const REVIEW_ONLY_CHECKPOINT_HANDOFF_LAYER_INPUT_REJECTIONS = Object.freeze([
  [
    (checkpoints) => checkpoints === undefined,
    () => "missing_review_only_checkpoint_handoff_layer_input_rejected"
  ],
  [
    (checkpoints) => !Array.isArray(checkpoints),
    () => MALFORMED_REVIEW_ONLY_CHECKPOINT_HANDOFF_LAYER_CLASSIFICATION
  ],
  [
    (checkpoints) => checkpoints.length === 0,
    () => "empty_review_only_checkpoint_handoff_layer_input_rejected"
  ],
  [
    (checkpoints) => checkpoints.length > 1,
    reviewOnlyCheckpointHandoffLayerMultiInputClassification
  ]
]);

function reviewOnlyCheckpointHandoffLayerInputRejection(checkpoints) {
  const rejection = REVIEW_ONLY_CHECKPOINT_HANDOFF_LAYER_INPUT_REJECTIONS.find(
    ([predicate]) => predicate(checkpoints)
  );
  return rejection?.[1](checkpoints);
}

function reviewOnlyCheckpointHandoffLayerClassification(checkpoints) {
  const inputRejection =
    reviewOnlyCheckpointHandoffLayerInputRejection(checkpoints);

  return (
    inputRejection ??
    reviewOnlyCheckpointHandoffLayerSingleClassification(checkpoints[0])
  );
}

function reviewOnlyCheckpointHandoffLayerSummary() {
  return {
    checkpointHandoffKind: REVIEW_ONLY_CHECKPOINT_HANDOFF_LAYER_KIND,
    checkpointHandoffMode: "review-only",
    sourceInspectionHandoffCheckpointClassification:
      VALID_REVIEW_ONLY_INSPECTION_HANDOFF_CHECKPOINT_CLASSIFICATION,
    checkpointHandoffMetadataOnly: true,
    cleanupHardeningToolkitEvidence:
      "installed-toolkit-validation-evidence-only",
    reviewerRoutingPerformed: false,
    reviewerAssignmentPerformed: false,
    evaluatorExecutionPerformed: false,
    evaluatorResultProduced: false,
    approvalDecisionProduced: false,
    approvalGrantProduced: false,
    runtimePermissionGranted: false,
    commandExposurePermissionGranted: false,
    evaluatorExecuted: false,
    runtimeEffectAllFalse: true
  };
}

function reviewOnlyCheckpointHandoffLayerCleanupEvidence() {
  return {
    phase: "phase-5.40-review-only-checkpoint-handoff-layer",
    evidenceMode: "installed-cleanup-hardening-toolkit-validation-only",
    npmAuditRequired: true,
    cargoAuditRequired: true,
    cargoMacheteRequired: true,
    fallowStaticRequired: true,
    optionalAdvisoryChecksAllowed: true,
    megaLinterRun: false,
    broadTrunkRewriteRun: false,
    toolsInstalledByPhase540: false,
    fallowRuntimeUsed: false,
    runtimeExecutionEnabled: false,
    commandExposurePermissionGranted: false
  };
}

function reviewOnlyCheckpointHandoffLayerStateFromCheckpoint(
  checkpoint,
  reviewedAt
) {
  return {
    schema: REVIEW_ONLY_CHECKPOINT_HANDOFF_LAYER_STATE_SCHEMA,
    schemaVersion: REVIEW_ONLY_CHECKPOINT_HANDOFF_LAYER_VERSION,
    stateKind: "review-only-checkpoint-handoff-layer-state",
    stateMode: "review-only",
    reviewedAt,
    sourceInspectionHandoffCheckpoint: {
      schema: checkpoint.schema,
      stateKind: checkpoint.stateKind,
      stateMode: checkpoint.stateMode,
      reviewedAt: checkpoint.reviewedAt,
      stateDigest: reviewArtifactHandoffDigest(checkpoint),
      sourceInspectionHandoffMetadataDigest:
        checkpoint.sourceInspectionHandoffMetadata.stateDigest,
      inspectionHandoffCheckpointMetadataOnly: true,
      inspectionHandoffCheckpointIsReviewerRouting: false,
      inspectionHandoffCheckpointIsReviewerAssignment: false,
      inspectionHandoffCheckpointIsEvaluatorExecution: false,
      inspectionHandoffCheckpointIsEvaluatorResult: false,
      inspectionHandoffCheckpointIsApprovalDecision: false,
      inspectionHandoffCheckpointIsApprovalGrant: false,
      reviewerRoutingPerformed: false,
      reviewerAssignmentPerformed: false,
      evaluatorResultProduced: false,
      approvalDecisionProduced: false,
      approvalGrantProduced: false,
      approvalGrantPersisted: false,
      evaluatorExecuted: false,
      runtimeEffectAllFalse: true
    },
    checkpointHandoffSummary: reviewOnlyCheckpointHandoffLayerSummary(),
    cleanupHardeningToolkitEvidence:
      reviewOnlyCheckpointHandoffLayerCleanupEvidence(),
    inspectionHandoffCheckpointAccepted: true,
    checkpointHandoffMetadataOnly: true,
    checkpointHandoffLayerIsReviewerRouting: false,
    checkpointHandoffLayerIsReviewerAssignment: false,
    checkpointHandoffLayerIsEvaluatorExecution: false,
    checkpointHandoffLayerIsEvaluatorResult: false,
    checkpointHandoffLayerIsApprovalDecision: false,
    checkpointHandoffLayerIsApprovalGrant: false,
    reviewerRoutingPerformed: false,
    reviewerRoutingEnabled: false,
    reviewerRouteId: null,
    reviewerAssignmentPerformed: false,
    reviewerAssignmentEnabled: false,
    reviewerAssignmentId: null,
    reviewerId: null,
    evaluatorResultProduced: false,
    evaluatorResultPersisted: false,
    evaluatorResultId: null,
    approvalDecisionProduced: false,
    approvalDecisionPersisted: false,
    approvalDecisionId: null,
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

function reviewOnlyCheckpointHandoffLayerRejectionReasons({
  accepted,
  classification
}) {
  if (accepted) {
    return [
      "checkpoint_handoff_layer_is_review_only",
      "reviewer_routing_not_implemented",
      "reviewer_assignment_not_implemented",
      "evaluator_execution_not_implemented",
      "evaluator_result_not_implemented",
      "approval_decision_not_implemented",
      "approval_grant_not_implemented",
      "installed_cleanup_hardening_toolkit_evidence_only",
      "runtime_enablement_still_blocked"
    ];
  }

  return [
    classification,
    "checkpoint_handoff_layer_not_produced",
    "reviewer_routing_not_implemented",
    "reviewer_assignment_not_implemented",
    "evaluator_execution_not_implemented",
    "evaluator_result_not_implemented",
    "approval_decision_not_implemented",
    "approval_grant_not_implemented",
    "runtime_enablement_still_blocked"
  ];
}

function reviewOnlyCheckpointHandoffLayerInputRecord(input) {
  return isPlainObjectRecord(input) ? input : null;
}

function reviewOnlyCheckpointHandoffLayerReviewedAt(inputRecord) {
  if (
    inputRecord === null ||
    !Object.prototype.hasOwnProperty.call(inputRecord, "reviewedAt")
  ) {
    return APPROVAL_PREREQUISITE_SOURCE_PREFLIGHT_DEFAULT_REVIEWED_AT;
  }

  return isUtcIsoTimestampWithMilliseconds(inputRecord.reviewedAt)
    ? inputRecord.reviewedAt
    : APPROVAL_PREREQUISITE_SOURCE_PREFLIGHT_DEFAULT_REVIEWED_AT;
}

function reviewOnlyCheckpointHandoffLayerInputMalformed(inputRecord) {
  return (
    inputRecord === null ||
    (Object.prototype.hasOwnProperty.call(inputRecord, "reviewedAt") &&
      !isUtcIsoTimestampWithMilliseconds(inputRecord.reviewedAt))
  );
}

function reviewOnlyCheckpointHandoffLayerEntries(inputRecord) {
  return inputRecord === null
    ? undefined
    : inputRecord.inspectionHandoffCheckpointEntries;
}

function reviewOnlyCheckpointHandoffLayerInputClassification(
  inputRecord,
  checkpoints
) {
  return reviewOnlyCheckpointHandoffLayerInputMalformed(inputRecord)
    ? MALFORMED_REVIEW_ONLY_CHECKPOINT_HANDOFF_LAYER_CLASSIFICATION
    : reviewOnlyCheckpointHandoffLayerClassification(checkpoints);
}

function reviewOnlyCheckpointHandoffLayerSummaryFromCheckpoint(checkpoint) {
  return {
    schema: checkpoint.schema,
    stateKind: checkpoint.stateKind,
    stateMode: checkpoint.stateMode,
    reviewedAt: checkpoint.reviewedAt,
    stateDigest: reviewArtifactHandoffDigest(checkpoint),
    inspectionHandoffCheckpointMetadataOnly: true,
    inspectionHandoffCheckpointIsReviewerRouting: false,
    inspectionHandoffCheckpointIsReviewerAssignment: false,
    inspectionHandoffCheckpointIsEvaluatorExecution: false,
    inspectionHandoffCheckpointIsEvaluatorResult: false,
    inspectionHandoffCheckpointIsApprovalDecision: false,
    inspectionHandoffCheckpointIsApprovalGrant: false,
    reviewerRoutingPerformed: false,
    reviewerAssignmentPerformed: false,
    evaluatorResultProduced: false,
    approvalDecisionProduced: false,
    approvalGrantProduced: false,
    approvalGrantPersisted: false,
    evaluatorExecuted: false,
    runtimeEffectAllFalse: true
  };
}

function reviewOnlyCheckpointHandoffLayerAcceptedOutput({
  accepted,
  checkpoints,
  reviewedAt
}) {
  if (!accepted) {
    return {
      checkpointHandoffLayer: null,
      inspectionHandoffCheckpointSummary: null
    };
  }

  const sourceCheckpoint = checkpoints[0];

  return {
    checkpointHandoffLayer:
      reviewOnlyCheckpointHandoffLayerStateFromCheckpoint(
        sourceCheckpoint,
        reviewedAt
      ),
    inspectionHandoffCheckpointSummary:
      reviewOnlyCheckpointHandoffLayerSummaryFromCheckpoint(sourceCheckpoint)
  };
}

function reviewOnlyCheckpointHandoffLayerResult({
  reviewedAt,
  reviewedAtDefaulted,
  classification,
  accepted,
  checkpointHandoffLayer,
  inspectionHandoffCheckpointSummary
}) {
  return {
    schema: REVIEW_ONLY_CHECKPOINT_HANDOFF_LAYER_SCHEMA,
    schemaVersion: REVIEW_ONLY_CHECKPOINT_HANDOFF_LAYER_VERSION,
    checkpointHandoffKind: REVIEW_ONLY_CHECKPOINT_HANDOFF_LAYER_KIND,
    checkpointHandoffMode: "review-only",
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    inspectionHandoffCheckpointAccepted: accepted,
    checkpointHandoffLayerProduced: accepted,
    checkpointHandoffLayerIsReviewerRouting: false,
    checkpointHandoffLayerIsReviewerAssignment: false,
    checkpointHandoffLayerIsEvaluatorExecution: false,
    checkpointHandoffLayerIsEvaluatorResult: false,
    checkpointHandoffLayerIsApprovalDecision: false,
    checkpointHandoffLayerIsApprovalGrant: false,
    checkpointHandoffLayer,
    inspectionHandoffCheckpointSummary,
    cleanupHardeningToolkitEvidence:
      reviewOnlyCheckpointHandoffLayerCleanupEvidence(),
    reviewOnly: true,
    authoritative: false,
    reviewArtifactOnly: true,
    checkpointHandoffMetadataOnly: true,
    reviewerRoutingPerformed: false,
    reviewerRoutingEnabled: false,
    reviewerRouteId: null,
    reviewerAssignmentPerformed: false,
    reviewerAssignmentEnabled: false,
    reviewerAssignmentId: null,
    reviewerId: null,
    evaluatorResultProduced: false,
    evaluatorResultPersisted: false,
    evaluatorResultId: null,
    approvalDecisionProduced: false,
    approvalDecisionPersisted: false,
    approvalDecisionId: null,
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
    rejectionReasons: reviewOnlyCheckpointHandoffLayerRejectionReasons({
      accepted,
      classification
    }),
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

export function createReviewOnlyCheckpointHandoffLayerForReview(input = {}) {
  const inputRecord = reviewOnlyCheckpointHandoffLayerInputRecord(input);
  const reviewedAt = reviewOnlyCheckpointHandoffLayerReviewedAt(inputRecord);
  const reviewedAtDefaulted = isReviewedAtDefaulted(inputRecord);
  const checkpoints = reviewOnlyCheckpointHandoffLayerEntries(inputRecord);
  const classification = reviewOnlyCheckpointHandoffLayerInputClassification(
    inputRecord,
    checkpoints
  );
  const accepted =
    classification === VALID_REVIEW_ONLY_CHECKPOINT_HANDOFF_LAYER_CLASSIFICATION;
  const { checkpointHandoffLayer, inspectionHandoffCheckpointSummary } =
    reviewOnlyCheckpointHandoffLayerAcceptedOutput({
      accepted,
      checkpoints,
      reviewedAt
    });

  return reviewOnlyCheckpointHandoffLayerResult({
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    accepted,
    checkpointHandoffLayer,
    inspectionHandoffCheckpointSummary
  });
}

const REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_STATE_SCHEMA =
  "ardyn.phase-5.41.review-only-metadata-handoff-checkpoint-state";

const REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_MIN_REVIEWED_AT =
  "2026-06-17T00:00:00.000Z";

const VALID_REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_CLASSIFICATION =
  "valid_review_only_metadata_handoff_checkpoint_runtime_still_blocked";
const MALFORMED_REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_CLASSIFICATION =
  "malformed_review_only_metadata_handoff_checkpoint_input_rejected";

const REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_SOURCE_FIELDS = Object.freeze([
  "schema",
  "schemaVersion",
  "stateKind",
  "stateMode",
  "reviewedAt",
  "sourceInspectionHandoffCheckpoint",
  "checkpointHandoffSummary",
  "cleanupHardeningToolkitEvidence",
  "inspectionHandoffCheckpointAccepted",
  "checkpointHandoffMetadataOnly",
  "checkpointHandoffLayerIsReviewerRouting",
  "checkpointHandoffLayerIsReviewerAssignment",
  "checkpointHandoffLayerIsEvaluatorExecution",
  "checkpointHandoffLayerIsEvaluatorResult",
  "checkpointHandoffLayerIsApprovalDecision",
  "checkpointHandoffLayerIsApprovalGrant",
  "reviewerRoutingPerformed",
  "reviewerRoutingEnabled",
  "reviewerRouteId",
  "reviewerAssignmentPerformed",
  "reviewerAssignmentEnabled",
  "reviewerAssignmentId",
  "reviewerId",
  "evaluatorResultProduced",
  "evaluatorResultPersisted",
  "evaluatorResultId",
  "approvalDecisionProduced",
  "approvalDecisionPersisted",
  "approvalDecisionId",
  "approvalGrantProduced",
  "approvalGrantPersisted",
  "approvalGrantId",
  "runtimePermissionGranted",
  "commandExposurePermissionGranted",
  "runtimeCommandExposureEnabled",
  "runtimeExecutionEnabled",
  "evaluatorExecutionRequested",
  "evaluatorExecutionStarted",
  "evaluatorExecutionEnabled",
  "evaluatorExecuted",
  "runtimeEffect"
]);

const REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_REQUIRED_FALSE_FIELDS =
  Object.freeze([
    "checkpointHandoffLayerIsReviewerRouting",
    "checkpointHandoffLayerIsReviewerAssignment",
    "checkpointHandoffLayerIsEvaluatorExecution",
    "checkpointHandoffLayerIsEvaluatorResult",
    "checkpointHandoffLayerIsApprovalDecision",
    "checkpointHandoffLayerIsApprovalGrant",
    "reviewerRoutingPerformed",
    "reviewerRoutingEnabled",
    "reviewerAssignmentPerformed",
    "reviewerAssignmentEnabled",
    "evaluatorResultProduced",
    "evaluatorResultPersisted",
    "approvalDecisionProduced",
    "approvalDecisionPersisted",
    "approvalGrantProduced",
    "approvalGrantPersisted",
    "runtimePermissionGranted",
    "commandExposurePermissionGranted",
    "runtimeCommandExposureEnabled",
    "runtimeExecutionEnabled",
    "evaluatorExecutionRequested",
    "evaluatorExecutionStarted",
    "evaluatorExecutionEnabled",
    "evaluatorExecuted"
  ]);

const REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_REQUIRED_NULL_FIELDS =
  Object.freeze([
    "reviewerRouteId",
    "reviewerAssignmentId",
    "reviewerId",
    "evaluatorResultId",
    "approvalDecisionId",
    "approvalGrantId"
  ]);

const REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_REQUIRED_LITERAL_FIELDS =
  Object.freeze([
    ["schema", REVIEW_ONLY_CHECKPOINT_HANDOFF_LAYER_STATE_SCHEMA],
    ["schemaVersion", REVIEW_ONLY_CHECKPOINT_HANDOFF_LAYER_VERSION],
    ["stateKind", "review-only-checkpoint-handoff-layer-state"],
    ["stateMode", "review-only"],
    ["inspectionHandoffCheckpointAccepted", true],
    ["checkpointHandoffMetadataOnly", true]
  ]);

const REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_REQUIRED_OBJECT_FIELDS =
  Object.freeze([
    "sourceInspectionHandoffCheckpoint",
    "checkpointHandoffSummary",
    "cleanupHardeningToolkitEvidence"
  ]);

const REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_SOURCE_CHECKPOINT_LITERAL_FIELDS =
  Object.freeze([
    ["schema", REVIEW_ONLY_INSPECTION_HANDOFF_CHECKPOINT_STATE_SCHEMA],
    ["stateKind", "review-only-inspection-handoff-checkpoint-state"],
    ["stateMode", "review-only"],
    ["inspectionHandoffCheckpointMetadataOnly", true],
    ["runtimeEffectAllFalse", true]
  ]);

const REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_SOURCE_CHECKPOINT_DIGEST_FIELDS =
  Object.freeze(["stateDigest", "sourceInspectionHandoffMetadataDigest"]);

const REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_SOURCE_CHECKPOINT_FALSE_FIELDS =
  Object.freeze([
    "inspectionHandoffCheckpointIsReviewerRouting",
    "inspectionHandoffCheckpointIsReviewerAssignment",
    "inspectionHandoffCheckpointIsEvaluatorExecution",
    "inspectionHandoffCheckpointIsEvaluatorResult",
    "inspectionHandoffCheckpointIsApprovalDecision",
    "inspectionHandoffCheckpointIsApprovalGrant",
    "reviewerRoutingPerformed",
    "reviewerAssignmentPerformed",
    "evaluatorResultProduced",
    "approvalDecisionProduced",
    "approvalGrantProduced",
    "approvalGrantPersisted",
    "evaluatorExecuted"
  ]);

const REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_APPROVAL_DECISION_FALSE_FIELDS =
  Object.freeze([
    "approvalDecisionProduced",
    "approvalDecisionPersisted",
    "checkpointHandoffLayerIsApprovalDecision"
  ]);

const REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_APPROVAL_DECISION_NULL_FIELDS =
  Object.freeze(["approvalDecisionId"]);

const REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_APPROVAL_GRANT_FALSE_FIELDS =
  Object.freeze([
    "approvalGrantProduced",
    "approvalGrantPersisted",
    "checkpointHandoffLayerIsApprovalGrant"
  ]);

const REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_APPROVAL_GRANT_NULL_FIELDS =
  Object.freeze(["approvalGrantId"]);

const REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_EVALUATOR_RESULT_FALSE_FIELDS =
  Object.freeze([
    "evaluatorResultProduced",
    "evaluatorResultPersisted",
    "checkpointHandoffLayerIsEvaluatorResult"
  ]);

const REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_EVALUATOR_RESULT_NULL_FIELDS =
  Object.freeze(["evaluatorResultId"]);

const REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_REVIEWER_ROUTING_FALSE_FIELDS =
  Object.freeze([
    "reviewerRoutingPerformed",
    "reviewerRoutingEnabled",
    "checkpointHandoffLayerIsReviewerRouting"
  ]);

const REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_REVIEWER_ROUTING_NULL_FIELDS =
  Object.freeze(["reviewerRouteId"]);

const REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_REQUIRED_SUMMARY_FIELDS =
  Object.freeze([
    ["checkpointHandoffKind", REVIEW_ONLY_CHECKPOINT_HANDOFF_LAYER_KIND],
    ["checkpointHandoffMode", "review-only"],
    [
      "sourceInspectionHandoffCheckpointClassification",
      VALID_REVIEW_ONLY_INSPECTION_HANDOFF_CHECKPOINT_CLASSIFICATION
    ],
    ["checkpointHandoffMetadataOnly", true],
    [
      "cleanupHardeningToolkitEvidence",
      "installed-toolkit-validation-evidence-only"
    ],
    ["reviewerRoutingPerformed", false],
    ["reviewerAssignmentPerformed", false],
    ["evaluatorExecutionPerformed", false],
    ["evaluatorResultProduced", false],
    ["approvalDecisionProduced", false],
    ["approvalGrantProduced", false],
    ["runtimePermissionGranted", false],
    ["commandExposurePermissionGranted", false],
    ["evaluatorExecuted", false],
    ["runtimeEffectAllFalse", true]
  ]);

const REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_UNKNOWN_TRUE_FIELDS =
  Object.freeze(["unknown", "sourceUnknown"]);

const REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_REVOKED_TRUE_FIELDS =
  Object.freeze(["revoked"]);

const REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_REVOKED_PRESENT_FIELDS =
  Object.freeze(["revokedAt"]);

const REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_REVIEWER_ASSIGNMENT_FALSE_FIELDS =
  Object.freeze([
    "reviewerAssignmentPerformed",
    "reviewerAssignmentEnabled",
    "checkpointHandoffLayerIsReviewerAssignment"
  ]);

const REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_REVIEWER_ASSIGNMENT_NULL_FIELDS =
  Object.freeze(["reviewerAssignmentId", "reviewerId"]);

const REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_EVALUATOR_EXECUTION_FALSE_FIELDS =
  Object.freeze([
    "evaluatorExecutionRequested",
    "evaluatorExecutionStarted",
    "evaluatorExecutionEnabled",
    "evaluatorExecuted",
    "checkpointHandoffLayerIsEvaluatorExecution"
  ]);

const REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_SOURCE_REVIEWER_ROUTING_TRUE_FIELDS =
  Object.freeze([
    "inspectionHandoffCheckpointIsReviewerRouting",
    "reviewerRoutingPerformed",
    "reviewerRoutingEnabled"
  ]);

const REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_SOURCE_REVIEWER_ASSIGNMENT_TRUE_FIELDS =
  Object.freeze([
    "inspectionHandoffCheckpointIsReviewerAssignment",
    "reviewerAssignmentPerformed",
    "reviewerAssignmentEnabled"
  ]);

const REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_SOURCE_EVALUATOR_EXECUTION_TRUE_FIELDS =
  Object.freeze([
    "inspectionHandoffCheckpointIsEvaluatorExecution",
    "evaluatorExecutionRequested",
    "evaluatorExecutionStarted",
    "evaluatorExecutionEnabled",
    "evaluatorExecuted"
  ]);

const REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_SOURCE_EVALUATOR_RESULT_TRUE_FIELDS =
  Object.freeze([
    "inspectionHandoffCheckpointIsEvaluatorResult",
    "evaluatorResultProduced",
    "evaluatorResultPersisted"
  ]);

const REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_SOURCE_APPROVAL_DECISION_TRUE_FIELDS =
  Object.freeze([
    "inspectionHandoffCheckpointIsApprovalDecision",
    "approvalDecisionProduced",
    "approvalDecisionPersisted"
  ]);

const REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_SOURCE_APPROVAL_GRANT_TRUE_FIELDS =
  Object.freeze([
    "inspectionHandoffCheckpointIsApprovalGrant",
    "approvalGrantProduced",
    "approvalGrantPersisted"
  ]);

const REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_SOURCE_CHECKPOINT_VALID_CHECKS =
  Object.freeze([
    isPlainObjectRecord,
    (sourceCheckpoint) =>
      isUtcIsoTimestampWithMilliseconds(sourceCheckpoint.reviewedAt),
    (sourceCheckpoint) =>
      reviewOnlyInspectionHandoffMetadataBoundaryFieldsEqual(
        sourceCheckpoint,
        REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_SOURCE_CHECKPOINT_LITERAL_FIELDS
      ),
    (sourceCheckpoint) =>
      REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_SOURCE_CHECKPOINT_DIGEST_FIELDS.every(
        (field) =>
          reviewOnlyMetadataHandoffCheckpointDigestString(sourceCheckpoint[field])
      ),
    (sourceCheckpoint) =>
      REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_SOURCE_CHECKPOINT_FALSE_FIELDS.every(
        (field) => sourceCheckpoint[field] === false
      )
  ]);

const REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_ALLOWED_TOP_LEVEL_FIELDS =
  new Set(REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_SOURCE_FIELDS);

const REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_OBJECT_FIELD_GROUPS =
  Object.freeze({
    approvalDecision: [
      "approvalDecision",
      "approvalDecisionResult",
      "approvalDecisionGranted",
      "approvalDecisionAccepted",
      "approvalDecisionAuthorized",
      "checkpointHandoffLayerIsApprovalDecision",
      "metadataHandoffCheckpointIsApprovalDecision"
    ],
    evaluatorResult: [
      "evaluatorResult",
      "evaluationResult",
      "evaluatorOutput",
      "evaluatorOutcome",
      "resultProduced",
      "checkpointHandoffLayerIsEvaluatorResult",
      "metadataHandoffCheckpointIsEvaluatorResult"
    ],
    reviewerRouting: [
      "reviewerRouting",
      "reviewerRoute",
      "reviewerQueue",
      "routing",
      "routingDecision",
      "routingResult",
      "routeReviewer",
      "reviewerRoutingPermissionGranted"
    ],
    reviewerAssignment: [
      "reviewerAssignment",
      "reviewerAssigned",
      "reviewerAssignee",
      "assignedReviewer",
      "assignedReviewers",
      "reviewerIds",
      "reviewerAllocation",
      "assignmentDecision",
      "humanReviewer",
      "toolReviewer",
      "reviewerAssignmentPermissionGranted"
    ]
  });

const REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_MALFORMED_CHECKS = Object.freeze([
  (checkpoint) => isPlainObjectRecord(checkpoint),
  (checkpoint) =>
    reviewOnlyInspectionHandoffMetadataBoundaryFieldsEqual(
      checkpoint,
      REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_REQUIRED_LITERAL_FIELDS
    ),
  (checkpoint) => isUtcIsoTimestampWithMilliseconds(checkpoint.reviewedAt),
  (checkpoint) =>
    reviewOnlyInspectionHandoffMetadataBoundaryFieldsPlainObjects(
      checkpoint,
      REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_REQUIRED_OBJECT_FIELDS
    ),
  (checkpoint) =>
    reviewOnlyMetadataHandoffCheckpointSourceCheckpointValid(checkpoint),
  (_checkpoint, summary) => isPlainObjectRecord(summary),
  (_checkpoint, summary) =>
    reviewOnlyInspectionHandoffMetadataBoundaryFieldsEqual(
      summary,
      REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_REQUIRED_SUMMARY_FIELDS
    ),
  (checkpoint) =>
    REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_REQUIRED_FALSE_FIELDS.every(
      (field) => checkpoint[field] === false
    ),
  (checkpoint) =>
    REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_REQUIRED_NULL_FIELDS.every(
      (field) => checkpoint[field] === null
    ),
  (checkpoint) =>
    reviewOnlyInspectionHandoffMetadataBoundaryRuntimeEffectAllFalse(
      checkpoint.runtimeEffect
    )
]);

function reviewOnlyMetadataHandoffCheckpointUnexpectedUnsafeField(checkpoint) {
  return (
    isPlainObjectRecord(checkpoint) &&
    Object.keys(checkpoint).some(
      (key) =>
        !REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_ALLOWED_TOP_LEVEL_FIELDS.has(
          key
        )
    )
  );
}

function reviewOnlyMetadataHandoffCheckpointSourceCheckpoint(checkpoint) {
  return isPlainObjectRecord(checkpoint)
    ? checkpoint.sourceInspectionHandoffCheckpoint
    : null;
}

function reviewOnlyMetadataHandoffCheckpointDigestString(value) {
  return (
    typeof value === "string" &&
    REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_DIGEST_PATTERN.test(value)
  );
}

function reviewOnlyMetadataHandoffCheckpointSourceCheckpointValid(checkpoint) {
  const sourceCheckpoint =
    reviewOnlyMetadataHandoffCheckpointSourceCheckpoint(checkpoint);

  return REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_SOURCE_CHECKPOINT_VALID_CHECKS.every(
    (predicate) => predicate(sourceCheckpoint)
  );
}

function reviewOnlyMetadataHandoffCheckpointSourceKeyTruePresent(
  checkpoint,
  fields
) {
  return reviewOnlyInspectionHandoffMetadataBoundaryKeyTruePresent(
    reviewOnlyMetadataHandoffCheckpointSourceCheckpoint(checkpoint),
    fields
  );
}

function reviewOnlyMetadataHandoffCheckpointSourceRuntimeEffectTrue(checkpoint) {
  const sourceCheckpoint =
    reviewOnlyMetadataHandoffCheckpointSourceCheckpoint(checkpoint);

  return (
    isPlainObjectRecord(sourceCheckpoint) &&
    Object.prototype.hasOwnProperty.call(
      sourceCheckpoint,
      "runtimeEffectAllFalse"
    ) &&
    sourceCheckpoint.runtimeEffectAllFalse !== true
  );
}

function reviewOnlyMetadataHandoffCheckpointUnsafeNestedMetadata(checkpoint) {
  return reviewOnlyInspectionHandoffMetadataBoundaryKeyPresent(checkpoint, [
    "metadataHandoffCheckpoint",
    "metadataHandoffCheckpointMetadata",
    "checkpointHandoffLayer",
    "checkpointHandoffLayerMetadata",
    "checkpointMetadata",
    "handoffMetadata",
    "checkpointHandoffMetadata",
    "reviewerRoutingMetadata",
    "reviewerAssignmentMetadata",
    "evaluatorExecutionMetadata",
    "evaluatorResultMetadata",
    "approvalDecisionMetadata",
    "approvalGrantMetadata",
    "runtimePermissionMetadata",
    "commandExposureMetadata",
    "executionMetadata"
  ]);
}

function reviewOnlyMetadataHandoffCheckpointUnknown(checkpoint) {
  return (
    isPlainObjectRecord(checkpoint) &&
    (reviewOnlyInspectionHandoffMetadataBoundaryAnyFieldTrue(
      checkpoint,
      REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_UNKNOWN_TRUE_FIELDS
    ) ||
      ["classification", "status"].some(
        (field) => checkpoint[field] === "unknown"
      ))
  );
}

function reviewOnlyMetadataHandoffCheckpointRevoked(checkpoint) {
  return (
    isPlainObjectRecord(checkpoint) &&
    (reviewOnlyInspectionHandoffMetadataBoundaryAnyFieldTrue(
      checkpoint,
      REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_REVOKED_TRUE_FIELDS
    ) ||
      reviewOnlyInspectionHandoffMetadataBoundaryAnyFieldPresent(
        checkpoint,
        REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_REVOKED_PRESENT_FIELDS
      ) ||
      ["classification", "status"].some(
        (field) => checkpoint[field] === "revoked"
      ))
  );
}

function reviewOnlyMetadataHandoffCheckpointStale(checkpoint) {
  return (
    isPlainObjectRecord(checkpoint) &&
    isUtcIsoTimestampWithMilliseconds(checkpoint.reviewedAt) &&
    checkpoint.reviewedAt <
      REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_MIN_REVIEWED_AT
  );
}

function reviewOnlyMetadataHandoffCheckpointMalformed(checkpoint) {
  const summary = isPlainObjectRecord(checkpoint)
    ? checkpoint.checkpointHandoffSummary
    : null;

  return !REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_MALFORMED_CHECKS.every(
    (predicate) => predicate(checkpoint, summary)
  );
}

function reviewOnlyMetadataHandoffCheckpointApprovalDecisionLooking(checkpoint) {
  return (
    reviewOnlyInspectionHandoffMetadataBoundaryAnyFieldNotEqual(
      checkpoint,
      REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_APPROVAL_DECISION_FALSE_FIELDS,
      false
    ) ||
    reviewOnlyInspectionHandoffMetadataBoundaryAnyFieldNotEqual(
      checkpoint,
      REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_APPROVAL_DECISION_NULL_FIELDS,
      null
    ) ||
    reviewOnlyMetadataHandoffCheckpointSourceKeyTruePresent(
      checkpoint,
      REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_SOURCE_APPROVAL_DECISION_TRUE_FIELDS
    ) ||
    reviewOnlyInspectionHandoffMetadataBoundaryKeyTruePresent(
      checkpoint,
      REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_OBJECT_FIELD_GROUPS
        .approvalDecision
    )
  );
}

function reviewOnlyMetadataHandoffCheckpointApprovalGrantLooking(checkpoint) {
  return (
    reviewOnlyInspectionHandoffMetadataBoundaryAnyFieldNotEqual(
      checkpoint,
      REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_APPROVAL_GRANT_FALSE_FIELDS,
      false
    ) ||
    reviewOnlyInspectionHandoffMetadataBoundaryAnyFieldNotEqual(
      checkpoint,
      REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_APPROVAL_GRANT_NULL_FIELDS,
      null
    ) ||
    reviewOnlyMetadataHandoffCheckpointSourceKeyTruePresent(
      checkpoint,
      REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_SOURCE_APPROVAL_GRANT_TRUE_FIELDS
    )
  );
}

function reviewOnlyMetadataHandoffCheckpointEvaluatorResultLooking(checkpoint) {
  return (
    reviewOnlyInspectionHandoffMetadataBoundaryAnyFieldNotEqual(
      checkpoint,
      REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_EVALUATOR_RESULT_FALSE_FIELDS,
      false
    ) ||
    reviewOnlyInspectionHandoffMetadataBoundaryAnyFieldNotEqual(
      checkpoint,
      REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_EVALUATOR_RESULT_NULL_FIELDS,
      null
    ) ||
    reviewOnlyMetadataHandoffCheckpointSourceKeyTruePresent(
      checkpoint,
      REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_SOURCE_EVALUATOR_RESULT_TRUE_FIELDS
    ) ||
    reviewOnlyInspectionHandoffMetadataBoundaryKeyTruePresent(
      checkpoint,
      REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_OBJECT_FIELD_GROUPS
        .evaluatorResult
    )
  );
}

function reviewOnlyMetadataHandoffCheckpointEvaluatorExecutionLooking(
  checkpoint
) {
  return (
    reviewOnlyInspectionHandoffMetadataBoundaryAnyFieldNotEqual(
      checkpoint,
      REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_EVALUATOR_EXECUTION_FALSE_FIELDS,
      false
    ) ||
    reviewOnlyMetadataHandoffCheckpointSourceKeyTruePresent(
      checkpoint,
      REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_SOURCE_EVALUATOR_EXECUTION_TRUE_FIELDS
    )
  );
}

function reviewOnlyMetadataHandoffCheckpointReviewerRoutingLooking(checkpoint) {
  return (
    reviewOnlyInspectionHandoffMetadataBoundaryAnyFieldNotEqual(
      checkpoint,
      REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_REVIEWER_ROUTING_FALSE_FIELDS,
      false
    ) ||
    reviewOnlyInspectionHandoffMetadataBoundaryAnyFieldNotEqual(
      checkpoint,
      REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_REVIEWER_ROUTING_NULL_FIELDS,
      null
    ) ||
    reviewOnlyMetadataHandoffCheckpointSourceKeyTruePresent(
      checkpoint,
      REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_SOURCE_REVIEWER_ROUTING_TRUE_FIELDS
    ) ||
    reviewOnlyInspectionHandoffMetadataBoundaryKeyPresent(
      checkpoint,
      REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_OBJECT_FIELD_GROUPS
        .reviewerRouting
    )
  );
}

function reviewOnlyMetadataHandoffCheckpointReviewerAssignmentLooking(
  checkpoint
) {
  return (
    reviewOnlyInspectionHandoffMetadataBoundaryAnyFieldNotEqual(
      checkpoint,
      REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_REVIEWER_ASSIGNMENT_FALSE_FIELDS,
      false
    ) ||
    reviewOnlyInspectionHandoffMetadataBoundaryAnyFieldNotEqual(
      checkpoint,
      REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_REVIEWER_ASSIGNMENT_NULL_FIELDS,
      null
    ) ||
    reviewOnlyMetadataHandoffCheckpointSourceKeyTruePresent(
      checkpoint,
      REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_SOURCE_REVIEWER_ASSIGNMENT_TRUE_FIELDS
    ) ||
    reviewOnlyInspectionHandoffMetadataBoundaryKeyPresent(
      checkpoint,
      REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_OBJECT_FIELD_GROUPS
        .reviewerAssignment
    )
  );
}

function reviewOnlyMetadataHandoffCheckpointRuntimePermissionLooking(
  checkpoint
) {
  return (
    checkpoint.runtimePermissionGranted !== false ||
    reviewOnlyInspectionHandoffMetadataBoundaryKeyTruePresent(checkpoint, [
      "runtimePermission",
      "runtimePermissionGranted",
      "canEnableRuntime"
    ])
  );
}

function reviewOnlyMetadataHandoffCheckpointCommandExposureLooking(checkpoint) {
  return (
    checkpoint.commandExposurePermissionGranted !== false ||
    checkpoint.runtimeCommandExposureEnabled !== false ||
    reviewOnlyInspectionHandoffMetadataBoundaryKeyTruePresent(checkpoint, [
      "commandExposure",
      "commandExposurePermissionGranted",
      "runtimeCommandEnabled",
      "runtimeCommandExposureEnabled"
    ])
  );
}

function reviewOnlyMetadataHandoffCheckpointRuntimeEffectTrue(checkpoint) {
  return (
    !reviewOnlyInspectionHandoffMetadataBoundaryRuntimeEffectAllFalse(
      checkpoint.runtimeEffect
    ) ||
    reviewOnlyMetadataHandoffCheckpointSourceRuntimeEffectTrue(checkpoint) ||
    reviewOnlyInspectionHandoffMetadataBoundaryKeyTruePresent(checkpoint, [
      "runtimeEnabled",
      "runtimeStarted",
      "runtimeReady",
      "runtimeExecutionEnabled",
      "runtimeExecuted"
    ])
  );
}

function reviewOnlyMetadataHandoffCheckpointProcessFlagTrue(checkpoint) {
  return reviewOnlyInspectionHandoffMetadataBoundaryKeyTruePresent(checkpoint, [
    "processSpawned",
    "processSpawning",
    "processControlPerformed",
    "processTerminationEnabled",
    "runtimeSupervisionEnabled",
    "stdinLoopEnabled",
    "stdoutRuntimeWriterEnabled",
    "stderrRuntimeWriterEnabled"
  ]);
}

function reviewOnlyMetadataHandoffCheckpointExecutionSignalLooking(checkpoint) {
  return (
    checkpoint.runtimeExecutionEnabled !== false ||
    checkpoint.evaluatorExecuted !== false ||
    reviewOnlyInspectionHandoffMetadataBoundaryKeyTruePresent(checkpoint, [
      "executionSignal",
      "executionRequested",
      "executionStarted",
      "runtimeExecutionSignal",
      "approvalEvaluatorAuthoritative"
    ])
  );
}

function reviewOnlyMetadataHandoffCheckpointAuthorizing(checkpoint) {
  return reviewOnlyInspectionHandoffMetadataBoundaryKeyTruePresent(checkpoint, [
    "authoritative",
    "authorizing",
    "authorized",
    "authorizationGranted",
    "approvalAuthorized",
    "canApproveRuntime",
    "canGrantRuntime"
  ]);
}

const REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_SINGLE_REJECTION_CHECKS =
  Object.freeze([
    [
      "unknown_review_only_metadata_handoff_checkpoint_input_rejected",
      reviewOnlyMetadataHandoffCheckpointUnknown
    ],
    [
      "revoked_review_only_metadata_handoff_checkpoint_input_rejected",
      reviewOnlyMetadataHandoffCheckpointRevoked
    ],
    [
      "stale_review_only_metadata_handoff_checkpoint_input_rejected",
      reviewOnlyMetadataHandoffCheckpointStale
    ],
    [
      "approval_decision_looking_review_only_metadata_handoff_checkpoint_input_rejected",
      reviewOnlyMetadataHandoffCheckpointApprovalDecisionLooking
    ],
    [
      "reviewer_routing_looking_review_only_metadata_handoff_checkpoint_input_rejected",
      reviewOnlyMetadataHandoffCheckpointReviewerRoutingLooking
    ],
    [
      "reviewer_assignment_looking_review_only_metadata_handoff_checkpoint_input_rejected",
      reviewOnlyMetadataHandoffCheckpointReviewerAssignmentLooking
    ],
    [
      "unsafe_review_only_metadata_handoff_checkpoint_input_rejected",
      reviewOnlyMetadataHandoffCheckpointUnexpectedUnsafeField
    ],
    [
      "unsafe_review_only_metadata_handoff_checkpoint_input_rejected",
      reviewOnlyMetadataHandoffCheckpointUnsafeNestedMetadata
    ],
    [
      "approval_grant_looking_review_only_metadata_handoff_checkpoint_input_rejected",
      reviewOnlyMetadataHandoffCheckpointApprovalGrantLooking
    ],
    [
      "grant_looking_review_only_metadata_handoff_checkpoint_input_rejected",
      reviewOnlyInspectionHandoffMetadataBoundaryGrantLooking
    ],
    [
      "evaluator_result_looking_review_only_metadata_handoff_checkpoint_input_rejected",
      reviewOnlyMetadataHandoffCheckpointEvaluatorResultLooking
    ],
    [
      "evaluator_execution_looking_review_only_metadata_handoff_checkpoint_input_rejected",
      reviewOnlyMetadataHandoffCheckpointEvaluatorExecutionLooking
    ],
    [
      "runtime_permission_looking_review_only_metadata_handoff_checkpoint_input_rejected",
      reviewOnlyMetadataHandoffCheckpointRuntimePermissionLooking
    ],
    [
      "command_exposure_looking_review_only_metadata_handoff_checkpoint_input_rejected",
      reviewOnlyMetadataHandoffCheckpointCommandExposureLooking
    ],
    [
      "runtime_effect_true_review_only_metadata_handoff_checkpoint_input_rejected",
      reviewOnlyMetadataHandoffCheckpointRuntimeEffectTrue
    ],
    [
      "process_flag_true_review_only_metadata_handoff_checkpoint_input_rejected",
      reviewOnlyMetadataHandoffCheckpointProcessFlagTrue
    ],
    [
      "execution_signal_looking_review_only_metadata_handoff_checkpoint_input_rejected",
      reviewOnlyMetadataHandoffCheckpointExecutionSignalLooking
    ],
    [
      "authorizing_review_only_metadata_handoff_checkpoint_input_rejected",
      reviewOnlyMetadataHandoffCheckpointAuthorizing
    ],
    [
      MALFORMED_REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_CLASSIFICATION,
      reviewOnlyMetadataHandoffCheckpointMalformed
    ]
  ]);

function reviewOnlyMetadataHandoffCheckpointSingleClassification(checkpoint) {
  const rejection =
    REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_SINGLE_REJECTION_CHECKS.find(
      ([, predicate]) => predicate(checkpoint)
    );

  return (
    rejection?.[0] ?? VALID_REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_CLASSIFICATION
  );
}

function reviewOnlyMetadataHandoffCheckpointInputsContainDuplicate(checkpoints) {
  const digests = checkpoints
    .filter(isPlainObjectRecord)
    .map((entry) => reviewArtifactHandoffDigest(entry));
  return new Set(digests).size !== digests.length;
}

function reviewOnlyMetadataHandoffCheckpointMultiInputClassification(
  checkpoints
) {
  return reviewOnlyMetadataHandoffCheckpointInputsContainDuplicate(checkpoints)
    ? "duplicate_invalid_review_only_metadata_handoff_checkpoint_input_rejected"
    : "conflicting_review_only_metadata_handoff_checkpoint_input_rejected";
}

const REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_INPUT_REJECTIONS = Object.freeze([
  [
    (checkpoints) => checkpoints === undefined,
    () => "missing_review_only_metadata_handoff_checkpoint_input_rejected"
  ],
  [
    (checkpoints) => !Array.isArray(checkpoints),
    () => MALFORMED_REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_CLASSIFICATION
  ],
  [
    (checkpoints) => checkpoints.length === 0,
    () => "empty_review_only_metadata_handoff_checkpoint_input_rejected"
  ],
  [
    (checkpoints) => checkpoints.length > 1,
    reviewOnlyMetadataHandoffCheckpointMultiInputClassification
  ]
]);

function reviewOnlyMetadataHandoffCheckpointInputRejection(checkpoints) {
  const rejection =
    REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_INPUT_REJECTIONS.find(
      ([predicate]) => predicate(checkpoints)
    );
  return rejection?.[1](checkpoints);
}

function reviewOnlyMetadataHandoffCheckpointClassification(checkpoints) {
  const inputRejection =
    reviewOnlyMetadataHandoffCheckpointInputRejection(checkpoints);

  return (
    inputRejection ??
    reviewOnlyMetadataHandoffCheckpointSingleClassification(checkpoints[0])
  );
}

function reviewOnlyMetadataHandoffCheckpointSummary() {
  return {
    metadataHandoffCheckpointKind:
      REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_KIND,
    metadataHandoffCheckpointMode: "review-only",
    sourceCheckpointHandoffLayerClassification:
      VALID_REVIEW_ONLY_CHECKPOINT_HANDOFF_LAYER_CLASSIFICATION,
    metadataHandoffCheckpointMetadataOnly: true,
    cleanupHardeningToolkitEvidence:
      "installed-toolkit-validation-evidence-only",
    reviewerRoutingPerformed: false,
    reviewerAssignmentPerformed: false,
    evaluatorExecutionPerformed: false,
    evaluatorResultProduced: false,
    approvalDecisionProduced: false,
    approvalGrantProduced: false,
    runtimePermissionGranted: false,
    commandExposurePermissionGranted: false,
    evaluatorExecuted: false,
    runtimeEffectAllFalse: true
  };
}

function reviewOnlyMetadataHandoffCheckpointCleanupEvidence() {
  return {
    phase: "phase-5.41-review-only-metadata-handoff-checkpoint",
    evidenceMode: "installed-cleanup-hardening-toolkit-validation-only",
    npmAuditRequired: true,
    cargoAuditRequired: true,
    cargoMacheteRequired: true,
    fallowStaticRequired: true,
    optionalAdvisoryChecksAllowed: true,
    megaLinterRun: false,
    broadTrunkRewriteRun: false,
    toolsInstalledByPhase541: false,
    fallowRuntimeUsed: false,
    runtimeExecutionEnabled: false,
    commandExposurePermissionGranted: false
  };
}

function reviewOnlyMetadataHandoffCheckpointStateFromLayer(layer, reviewedAt) {
  return {
    schema: REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_STATE_SCHEMA,
    schemaVersion: REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_VERSION,
    stateKind: "review-only-metadata-handoff-checkpoint-state",
    stateMode: "review-only",
    reviewedAt,
    sourceCheckpointHandoffLayer: {
      schema: layer.schema,
      stateKind: layer.stateKind,
      stateMode: layer.stateMode,
      reviewedAt: layer.reviewedAt,
      stateDigest: reviewArtifactHandoffDigest(layer),
      sourceInspectionHandoffCheckpointDigest:
        layer.sourceInspectionHandoffCheckpoint.stateDigest,
      checkpointHandoffMetadataOnly: true,
      checkpointHandoffLayerIsReviewerRouting: false,
      checkpointHandoffLayerIsReviewerAssignment: false,
      checkpointHandoffLayerIsEvaluatorExecution: false,
      checkpointHandoffLayerIsEvaluatorResult: false,
      checkpointHandoffLayerIsApprovalDecision: false,
      checkpointHandoffLayerIsApprovalGrant: false,
      reviewerRoutingPerformed: false,
      reviewerAssignmentPerformed: false,
      evaluatorResultProduced: false,
      approvalDecisionProduced: false,
      approvalGrantProduced: false,
      approvalGrantPersisted: false,
      evaluatorExecuted: false,
      runtimeEffectAllFalse: true
    },
    metadataHandoffCheckpointSummary:
      reviewOnlyMetadataHandoffCheckpointSummary(),
    cleanupHardeningToolkitEvidence:
      reviewOnlyMetadataHandoffCheckpointCleanupEvidence(),
    checkpointHandoffLayerAccepted: true,
    metadataHandoffCheckpointMetadataOnly: true,
    metadataHandoffCheckpointIsReviewerRouting: false,
    metadataHandoffCheckpointIsReviewerAssignment: false,
    metadataHandoffCheckpointIsEvaluatorExecution: false,
    metadataHandoffCheckpointIsEvaluatorResult: false,
    metadataHandoffCheckpointIsApprovalDecision: false,
    metadataHandoffCheckpointIsApprovalGrant: false,
    reviewerRoutingPerformed: false,
    reviewerRoutingEnabled: false,
    reviewerRouteId: null,
    reviewerAssignmentPerformed: false,
    reviewerAssignmentEnabled: false,
    reviewerAssignmentId: null,
    reviewerId: null,
    evaluatorResultProduced: false,
    evaluatorResultPersisted: false,
    evaluatorResultId: null,
    approvalDecisionProduced: false,
    approvalDecisionPersisted: false,
    approvalDecisionId: null,
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

function reviewOnlyMetadataHandoffCheckpointRejectionReasons({
  accepted,
  classification
}) {
  if (accepted) {
    return [
      "metadata_handoff_checkpoint_is_review_only",
      "reviewer_routing_not_implemented",
      "reviewer_assignment_not_implemented",
      "evaluator_execution_not_implemented",
      "evaluator_result_not_implemented",
      "approval_decision_not_implemented",
      "approval_grant_not_implemented",
      "installed_cleanup_hardening_toolkit_evidence_only",
      "runtime_enablement_still_blocked"
    ];
  }

  return [
    classification,
    "metadata_handoff_checkpoint_not_produced",
    "reviewer_routing_not_implemented",
    "reviewer_assignment_not_implemented",
    "evaluator_execution_not_implemented",
    "evaluator_result_not_implemented",
    "approval_decision_not_implemented",
    "approval_grant_not_implemented",
    "runtime_enablement_still_blocked"
  ];
}

function reviewOnlyMetadataHandoffCheckpointInputRecord(input) {
  return isPlainObjectRecord(input) ? input : null;
}

function reviewOnlyMetadataHandoffCheckpointReviewedAt(inputRecord) {
  if (
    inputRecord === null ||
    !Object.prototype.hasOwnProperty.call(inputRecord, "reviewedAt")
  ) {
    return APPROVAL_PREREQUISITE_SOURCE_PREFLIGHT_DEFAULT_REVIEWED_AT;
  }

  return isUtcIsoTimestampWithMilliseconds(inputRecord.reviewedAt)
    ? inputRecord.reviewedAt
    : APPROVAL_PREREQUISITE_SOURCE_PREFLIGHT_DEFAULT_REVIEWED_AT;
}

function reviewOnlyMetadataHandoffCheckpointInputMalformed(inputRecord) {
  return (
    inputRecord === null ||
    (Object.prototype.hasOwnProperty.call(inputRecord, "reviewedAt") &&
      !isUtcIsoTimestampWithMilliseconds(inputRecord.reviewedAt))
  );
}

function reviewOnlyMetadataHandoffCheckpointEntries(inputRecord) {
  return inputRecord === null
    ? undefined
    : inputRecord.checkpointHandoffLayerEntries;
}

function reviewOnlyMetadataHandoffCheckpointInputClassification(
  inputRecord,
  checkpoints
) {
  return reviewOnlyMetadataHandoffCheckpointInputMalformed(inputRecord)
    ? MALFORMED_REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_CLASSIFICATION
    : reviewOnlyMetadataHandoffCheckpointClassification(checkpoints);
}

function reviewOnlyMetadataHandoffCheckpointSummaryFromLayer(layer) {
  return {
    schema: layer.schema,
    stateKind: layer.stateKind,
    stateMode: layer.stateMode,
    reviewedAt: layer.reviewedAt,
    stateDigest: reviewArtifactHandoffDigest(layer),
    checkpointHandoffMetadataOnly: true,
    checkpointHandoffLayerIsReviewerRouting: false,
    checkpointHandoffLayerIsReviewerAssignment: false,
    checkpointHandoffLayerIsEvaluatorExecution: false,
    checkpointHandoffLayerIsEvaluatorResult: false,
    checkpointHandoffLayerIsApprovalDecision: false,
    checkpointHandoffLayerIsApprovalGrant: false,
    reviewerRoutingPerformed: false,
    reviewerAssignmentPerformed: false,
    evaluatorResultProduced: false,
    approvalDecisionProduced: false,
    approvalGrantProduced: false,
    approvalGrantPersisted: false,
    evaluatorExecuted: false,
    runtimeEffectAllFalse: true
  };
}

function reviewOnlyMetadataHandoffCheckpointAcceptedOutput({
  accepted,
  checkpoints,
  reviewedAt
}) {
  if (!accepted) {
    return {
      metadataHandoffCheckpoint: null,
      checkpointHandoffLayerSummary: null
    };
  }

  const sourceLayer = checkpoints[0];

  return {
    metadataHandoffCheckpoint:
      reviewOnlyMetadataHandoffCheckpointStateFromLayer(sourceLayer, reviewedAt),
    checkpointHandoffLayerSummary:
      reviewOnlyMetadataHandoffCheckpointSummaryFromLayer(sourceLayer)
  };
}

function reviewOnlyMetadataHandoffCheckpointResult({
  reviewedAt,
  reviewedAtDefaulted,
  classification,
  accepted,
  metadataHandoffCheckpoint,
  checkpointHandoffLayerSummary
}) {
  return {
    schema: REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_SCHEMA,
    schemaVersion: REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_VERSION,
    metadataHandoffCheckpointKind:
      REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_KIND,
    metadataHandoffCheckpointMode: "review-only",
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    checkpointHandoffLayerAccepted: accepted,
    metadataHandoffCheckpointProduced: accepted,
    metadataHandoffCheckpointIsReviewerRouting: false,
    metadataHandoffCheckpointIsReviewerAssignment: false,
    metadataHandoffCheckpointIsEvaluatorExecution: false,
    metadataHandoffCheckpointIsEvaluatorResult: false,
    metadataHandoffCheckpointIsApprovalDecision: false,
    metadataHandoffCheckpointIsApprovalGrant: false,
    metadataHandoffCheckpoint,
    checkpointHandoffLayerSummary,
    cleanupHardeningToolkitEvidence:
      reviewOnlyMetadataHandoffCheckpointCleanupEvidence(),
    reviewOnly: true,
    authoritative: false,
    reviewArtifactOnly: true,
    metadataHandoffCheckpointMetadataOnly: true,
    reviewerRoutingPerformed: false,
    reviewerRoutingEnabled: false,
    reviewerRouteId: null,
    reviewerAssignmentPerformed: false,
    reviewerAssignmentEnabled: false,
    reviewerAssignmentId: null,
    reviewerId: null,
    evaluatorResultProduced: false,
    evaluatorResultPersisted: false,
    evaluatorResultId: null,
    approvalDecisionProduced: false,
    approvalDecisionPersisted: false,
    approvalDecisionId: null,
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
    rejectionReasons: reviewOnlyMetadataHandoffCheckpointRejectionReasons({
      accepted,
      classification
    }),
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

export function createReviewOnlyMetadataHandoffCheckpointForReview(input = {}) {
  const inputRecord = reviewOnlyMetadataHandoffCheckpointInputRecord(input);
  const reviewedAt =
    reviewOnlyMetadataHandoffCheckpointReviewedAt(inputRecord);
  const reviewedAtDefaulted = isReviewedAtDefaulted(inputRecord);
  const checkpoints = reviewOnlyMetadataHandoffCheckpointEntries(inputRecord);
  const classification =
    reviewOnlyMetadataHandoffCheckpointInputClassification(
      inputRecord,
      checkpoints
    );
  const accepted =
    classification ===
    VALID_REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_CLASSIFICATION;
  const { metadataHandoffCheckpoint, checkpointHandoffLayerSummary } =
    reviewOnlyMetadataHandoffCheckpointAcceptedOutput({
      accepted,
      checkpoints,
      reviewedAt
    });

  return reviewOnlyMetadataHandoffCheckpointResult({
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    accepted,
    metadataHandoffCheckpoint,
    checkpointHandoffLayerSummary
  });
}

const REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_STATE_SCHEMA =
  "ardyn.phase-5.42.review-only-handoff-metadata-consolidation-layer-state";
const REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_MIN_REVIEWED_AT =
  "2026-06-17T00:00:00.000Z";
const VALID_REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_CLASSIFICATION =
  "valid_review_only_handoff_metadata_consolidation_layer_runtime_still_blocked";
const MALFORMED_REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_CLASSIFICATION =
  "malformed_review_only_handoff_metadata_consolidation_layer_input_rejected";

const REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_SOURCE_FIELDS =
  Object.freeze([
    "schema",
    "schemaVersion",
    "stateKind",
    "stateMode",
    "reviewedAt",
    "sourceCheckpointHandoffLayer",
    "metadataHandoffCheckpointSummary",
    "cleanupHardeningToolkitEvidence",
    "checkpointHandoffLayerAccepted",
    "metadataHandoffCheckpointMetadataOnly",
    "metadataHandoffCheckpointIsReviewerRouting",
    "metadataHandoffCheckpointIsReviewerAssignment",
    "metadataHandoffCheckpointIsEvaluatorExecution",
    "metadataHandoffCheckpointIsEvaluatorResult",
    "metadataHandoffCheckpointIsApprovalDecision",
    "metadataHandoffCheckpointIsApprovalGrant",
    "reviewerRoutingPerformed",
    "reviewerRoutingEnabled",
    "reviewerRouteId",
    "reviewerAssignmentPerformed",
    "reviewerAssignmentEnabled",
    "reviewerAssignmentId",
    "reviewerId",
    "evaluatorResultProduced",
    "evaluatorResultPersisted",
    "evaluatorResultId",
    "approvalDecisionProduced",
    "approvalDecisionPersisted",
    "approvalDecisionId",
    "approvalGrantProduced",
    "approvalGrantPersisted",
    "approvalGrantId",
    "runtimePermissionGranted",
    "commandExposurePermissionGranted",
    "runtimeCommandExposureEnabled",
    "runtimeExecutionEnabled",
    "evaluatorExecutionRequested",
    "evaluatorExecutionStarted",
    "evaluatorExecutionEnabled",
    "evaluatorExecuted",
    "runtimeEffect"
  ]);

const REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_REQUIRED_FALSE_FIELDS =
  Object.freeze([
    "metadataHandoffCheckpointIsReviewerRouting",
    "metadataHandoffCheckpointIsReviewerAssignment",
    "metadataHandoffCheckpointIsEvaluatorExecution",
    "metadataHandoffCheckpointIsEvaluatorResult",
    "metadataHandoffCheckpointIsApprovalDecision",
    "metadataHandoffCheckpointIsApprovalGrant",
    "reviewerRoutingPerformed",
    "reviewerRoutingEnabled",
    "reviewerAssignmentPerformed",
    "reviewerAssignmentEnabled",
    "evaluatorResultProduced",
    "evaluatorResultPersisted",
    "approvalDecisionProduced",
    "approvalDecisionPersisted",
    "approvalGrantProduced",
    "approvalGrantPersisted",
    "runtimePermissionGranted",
    "commandExposurePermissionGranted",
    "runtimeCommandExposureEnabled",
    "runtimeExecutionEnabled",
    "evaluatorExecutionRequested",
    "evaluatorExecutionStarted",
    "evaluatorExecutionEnabled",
    "evaluatorExecuted"
  ]);

const REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_REQUIRED_NULL_FIELDS =
  Object.freeze([
    "reviewerRouteId",
    "reviewerAssignmentId",
    "reviewerId",
    "evaluatorResultId",
    "approvalDecisionId",
    "approvalGrantId"
  ]);

const REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_REQUIRED_LITERAL_FIELDS =
  Object.freeze([
    ["schema", REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_STATE_SCHEMA],
    ["schemaVersion", REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_VERSION],
    ["stateKind", "review-only-metadata-handoff-checkpoint-state"],
    ["stateMode", "review-only"],
    ["checkpointHandoffLayerAccepted", true],
    ["metadataHandoffCheckpointMetadataOnly", true]
  ]);

const REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_REQUIRED_OBJECT_FIELDS =
  Object.freeze([
    "sourceCheckpointHandoffLayer",
    "metadataHandoffCheckpointSummary",
    "cleanupHardeningToolkitEvidence",
    "runtimeEffect"
  ]);

const REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_SOURCE_LAYER_LITERAL_FIELDS =
  Object.freeze([
    ["schema", REVIEW_ONLY_CHECKPOINT_HANDOFF_LAYER_STATE_SCHEMA],
    ["stateKind", "review-only-checkpoint-handoff-layer-state"],
    ["stateMode", "review-only"],
    ["checkpointHandoffMetadataOnly", true],
    ["runtimeEffectAllFalse", true]
  ]);

const REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_SOURCE_LAYER_DIGEST_FIELDS =
  Object.freeze(["stateDigest", "sourceInspectionHandoffCheckpointDigest"]);

const REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_SOURCE_LAYER_FALSE_FIELDS =
  Object.freeze([
    "checkpointHandoffLayerIsReviewerRouting",
    "checkpointHandoffLayerIsReviewerAssignment",
    "checkpointHandoffLayerIsEvaluatorExecution",
    "checkpointHandoffLayerIsEvaluatorResult",
    "checkpointHandoffLayerIsApprovalDecision",
    "checkpointHandoffLayerIsApprovalGrant",
    "reviewerRoutingPerformed",
    "reviewerAssignmentPerformed",
    "evaluatorResultProduced",
    "approvalDecisionProduced",
    "approvalGrantProduced",
    "approvalGrantPersisted",
    "evaluatorExecuted"
  ]);

const REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_REQUIRED_SUMMARY_FIELDS =
  Object.freeze([
    ["metadataHandoffCheckpointKind", REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_KIND],
    ["metadataHandoffCheckpointMode", "review-only"],
    [
      "sourceCheckpointHandoffLayerClassification",
      VALID_REVIEW_ONLY_CHECKPOINT_HANDOFF_LAYER_CLASSIFICATION
    ],
    ["metadataHandoffCheckpointMetadataOnly", true],
    [
      "cleanupHardeningToolkitEvidence",
      "installed-toolkit-validation-evidence-only"
    ],
    ["reviewerRoutingPerformed", false],
    ["reviewerAssignmentPerformed", false],
    ["evaluatorExecutionPerformed", false],
    ["evaluatorResultProduced", false],
    ["approvalDecisionProduced", false],
    ["approvalGrantProduced", false],
    ["runtimePermissionGranted", false],
    ["commandExposurePermissionGranted", false],
    ["evaluatorExecuted", false],
    ["runtimeEffectAllFalse", true]
  ]);

const REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_UNKNOWN_TRUE_FIELDS =
  Object.freeze(["unknown", "sourceUnknown"]);

const REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_REVOKED_TRUE_FIELDS =
  Object.freeze(["revoked"]);

const REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_REVOKED_PRESENT_FIELDS =
  Object.freeze(["revokedAt"]);

const REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_APPROVAL_DECISION_FALSE_FIELDS =
  Object.freeze([
    "approvalDecisionProduced",
    "approvalDecisionPersisted",
    "metadataHandoffCheckpointIsApprovalDecision"
  ]);

const REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_APPROVAL_DECISION_NULL_FIELDS =
  Object.freeze(["approvalDecisionId"]);

const REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_APPROVAL_GRANT_FALSE_FIELDS =
  Object.freeze([
    "approvalGrantProduced",
    "approvalGrantPersisted",
    "metadataHandoffCheckpointIsApprovalGrant"
  ]);

const REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_APPROVAL_GRANT_NULL_FIELDS =
  Object.freeze(["approvalGrantId"]);

const REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_EVALUATOR_RESULT_FALSE_FIELDS =
  Object.freeze([
    "evaluatorResultProduced",
    "evaluatorResultPersisted",
    "metadataHandoffCheckpointIsEvaluatorResult"
  ]);

const REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_EVALUATOR_RESULT_NULL_FIELDS =
  Object.freeze(["evaluatorResultId"]);

const REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_EVALUATOR_EXECUTION_FALSE_FIELDS =
  Object.freeze([
    "evaluatorExecutionRequested",
    "evaluatorExecutionStarted",
    "evaluatorExecutionEnabled",
    "evaluatorExecuted",
    "metadataHandoffCheckpointIsEvaluatorExecution"
  ]);

const REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_REVIEWER_ROUTING_FALSE_FIELDS =
  Object.freeze([
    "reviewerRoutingPerformed",
    "reviewerRoutingEnabled",
    "metadataHandoffCheckpointIsReviewerRouting"
  ]);

const REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_REVIEWER_ROUTING_NULL_FIELDS =
  Object.freeze(["reviewerRouteId"]);

const REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_REVIEWER_ASSIGNMENT_FALSE_FIELDS =
  Object.freeze([
    "reviewerAssignmentPerformed",
    "reviewerAssignmentEnabled",
    "metadataHandoffCheckpointIsReviewerAssignment"
  ]);

const REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_REVIEWER_ASSIGNMENT_NULL_FIELDS =
  Object.freeze(["reviewerAssignmentId", "reviewerId"]);

const REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_SOURCE_REVIEWER_ROUTING_TRUE_FIELDS =
  Object.freeze([
    "checkpointHandoffLayerIsReviewerRouting",
    "reviewerRoutingPerformed",
    "reviewerRoutingEnabled"
  ]);

const REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_SOURCE_REVIEWER_ASSIGNMENT_TRUE_FIELDS =
  Object.freeze([
    "checkpointHandoffLayerIsReviewerAssignment",
    "reviewerAssignmentPerformed",
    "reviewerAssignmentEnabled"
  ]);

const REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_SOURCE_EVALUATOR_EXECUTION_TRUE_FIELDS =
  Object.freeze([
    "checkpointHandoffLayerIsEvaluatorExecution",
    "evaluatorExecutionRequested",
    "evaluatorExecutionStarted",
    "evaluatorExecutionEnabled",
    "evaluatorExecuted"
  ]);

const REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_SOURCE_EVALUATOR_RESULT_TRUE_FIELDS =
  Object.freeze([
    "checkpointHandoffLayerIsEvaluatorResult",
    "evaluatorResultProduced",
    "evaluatorResultPersisted"
  ]);

const REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_SOURCE_APPROVAL_DECISION_TRUE_FIELDS =
  Object.freeze([
    "checkpointHandoffLayerIsApprovalDecision",
    "approvalDecisionProduced",
    "approvalDecisionPersisted"
  ]);

const REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_SOURCE_APPROVAL_GRANT_TRUE_FIELDS =
  Object.freeze([
    "checkpointHandoffLayerIsApprovalGrant",
    "approvalGrantProduced",
    "approvalGrantPersisted"
  ]);

const REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_SOURCE_COMMAND_EXPOSURE_TRUE_FIELDS =
  Object.freeze([
    "commandExposurePermissionGranted",
    "runtimeCommandExposureEnabled",
    "runtimeCommandEnabled"
  ]);

const REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_ALLOWED_TOP_LEVEL_FIELDS =
  new Set(REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_SOURCE_FIELDS);

const REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_OBJECT_FIELD_GROUPS =
  Object.freeze({
    approvalDecision: [
      "approvalDecision",
      "approvalDecisionResult",
      "approvalDecisionGranted",
      "approvalDecisionAccepted",
      "approvalDecisionAuthorized",
      "handoffMetadataConsolidationLayerIsApprovalDecision"
    ],
    evaluatorResult: [
      "evaluatorResult",
      "evaluationResult",
      "evaluatorOutput",
      "evaluatorOutcome",
      "resultProduced",
      "handoffMetadataConsolidationLayerIsEvaluatorResult"
    ],
    reviewerRouting: [
      "reviewerRouting",
      "reviewerRoute",
      "reviewerQueue",
      "routing",
      "routingDecision",
      "routingResult",
      "routeReviewer",
      "reviewerRoutingPermissionGranted"
    ],
    reviewerAssignment: [
      "reviewerAssignment",
      "reviewerAssigned",
      "reviewerAssignee",
      "assignedReviewer",
      "assignedReviewers",
      "reviewerIds",
      "reviewerAllocation",
      "assignmentDecision",
      "humanReviewer",
      "toolReviewer",
      "reviewerAssignmentPermissionGranted"
    ]
  });

function reviewOnlyHandoffMetadataConsolidationLayerSourceLayer(
  metadataCheckpoint
) {
  return isPlainObjectRecord(metadataCheckpoint)
    ? metadataCheckpoint.sourceCheckpointHandoffLayer
    : null;
}

function reviewOnlyHandoffMetadataConsolidationLayerSourceLayerValid(
  metadataCheckpoint
) {
  const sourceLayer =
    reviewOnlyHandoffMetadataConsolidationLayerSourceLayer(metadataCheckpoint);
  const checks = [
    isPlainObjectRecord,
    (layer) => isUtcIsoTimestampWithMilliseconds(layer.reviewedAt),
    (layer) =>
      reviewOnlyInspectionHandoffMetadataBoundaryFieldsEqual(
        layer,
        REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_SOURCE_LAYER_LITERAL_FIELDS
      ),
    (layer) =>
      REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_SOURCE_LAYER_DIGEST_FIELDS.every(
        (field) => reviewOnlyMetadataHandoffCheckpointDigestString(layer[field])
      ),
    (layer) =>
      REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_SOURCE_LAYER_FALSE_FIELDS.every(
        (field) => layer[field] === false
      )
  ];

  return checks.every((predicate) => predicate(sourceLayer));
}

const REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_MALFORMED_CHECKS =
  Object.freeze([
    (metadataCheckpoint) => isPlainObjectRecord(metadataCheckpoint),
    (metadataCheckpoint) =>
      reviewOnlyInspectionHandoffMetadataBoundaryFieldsEqual(
        metadataCheckpoint,
        REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_REQUIRED_LITERAL_FIELDS
      ),
    (metadataCheckpoint) =>
      isUtcIsoTimestampWithMilliseconds(metadataCheckpoint.reviewedAt),
    (metadataCheckpoint) =>
      reviewOnlyInspectionHandoffMetadataBoundaryFieldsPlainObjects(
        metadataCheckpoint,
        REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_REQUIRED_OBJECT_FIELDS
      ),
    (metadataCheckpoint) =>
      reviewOnlyHandoffMetadataConsolidationLayerSourceLayerValid(
        metadataCheckpoint
      ),
    (_metadataCheckpoint, summary) => isPlainObjectRecord(summary),
    (_metadataCheckpoint, summary) =>
      reviewOnlyInspectionHandoffMetadataBoundaryFieldsEqual(
        summary,
        REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_REQUIRED_SUMMARY_FIELDS
      ),
    (metadataCheckpoint) =>
      REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_REQUIRED_FALSE_FIELDS.every(
        (field) => metadataCheckpoint[field] === false
      ),
    (metadataCheckpoint) =>
      REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_REQUIRED_NULL_FIELDS.every(
        (field) => metadataCheckpoint[field] === null
      ),
    (metadataCheckpoint) =>
      reviewOnlyInspectionHandoffMetadataBoundaryRuntimeEffectAllFalse(
        metadataCheckpoint.runtimeEffect
      )
  ]);

function reviewOnlyHandoffMetadataConsolidationLayerChecksAny(
  metadataCheckpoint,
  checks
) {
  return checks.some((predicate) => predicate(metadataCheckpoint));
}

function reviewOnlyHandoffMetadataConsolidationLayerSourceKeyTruePresent(
  metadataCheckpoint,
  fields
) {
  return reviewOnlyInspectionHandoffMetadataBoundaryKeyTruePresent(
    reviewOnlyHandoffMetadataConsolidationLayerSourceLayer(metadataCheckpoint),
    fields
  );
}

function reviewOnlyHandoffMetadataConsolidationLayerUnexpectedUnsafeField(
  metadataCheckpoint
) {
  return (
    isPlainObjectRecord(metadataCheckpoint) &&
    Object.keys(metadataCheckpoint).some(
      (key) =>
        !REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_ALLOWED_TOP_LEVEL_FIELDS.has(
          key
        )
    )
  );
}

function reviewOnlyHandoffMetadataConsolidationLayerUnsafeNestedMetadata(
  metadataCheckpoint
) {
  return reviewOnlyInspectionHandoffMetadataBoundaryKeyPresent(
    metadataCheckpoint,
    [
      "handoffMetadataConsolidationLayer",
      "handoffMetadataConsolidationLayerMetadata",
      "consolidationMetadata",
      "consolidatedHandoffMetadata",
      "metadataHandoffCheckpointMetadata",
      "checkpointMetadata",
      "handoffMetadata",
      "checkpointHandoffMetadata",
      "reviewerRoutingMetadata",
      "reviewerAssignmentMetadata",
      "evaluatorExecutionMetadata",
      "evaluatorResultMetadata",
      "approvalDecisionMetadata",
      "approvalGrantMetadata",
      "runtimePermissionMetadata",
      "commandExposureMetadata",
      "executionMetadata"
    ]
  );
}

function reviewOnlyHandoffMetadataConsolidationLayerUnknown(metadataCheckpoint) {
  return reviewOnlyHandoffMetadataConsolidationLayerChecksAny(metadataCheckpoint, [
    (checkpoint) =>
      reviewOnlyInspectionHandoffMetadataBoundaryAnyFieldTrue(
        checkpoint,
        REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_UNKNOWN_TRUE_FIELDS
      ),
    (checkpoint) =>
      ["classification", "status"].some((field) => checkpoint[field] === "unknown")
  ]);
}

function reviewOnlyHandoffMetadataConsolidationLayerRevoked(
  metadataCheckpoint
) {
  return reviewOnlyHandoffMetadataConsolidationLayerChecksAny(metadataCheckpoint, [
    (checkpoint) =>
      reviewOnlyInspectionHandoffMetadataBoundaryAnyFieldTrue(
        checkpoint,
        REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_REVOKED_TRUE_FIELDS
      ),
    (checkpoint) =>
      reviewOnlyInspectionHandoffMetadataBoundaryAnyFieldPresent(
        checkpoint,
        REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_REVOKED_PRESENT_FIELDS
      ),
    (checkpoint) =>
      ["classification", "status"].some((field) => checkpoint[field] === "revoked")
  ]);
}

function reviewOnlyHandoffMetadataConsolidationLayerStale(metadataCheckpoint) {
  return (
    isPlainObjectRecord(metadataCheckpoint) &&
    isUtcIsoTimestampWithMilliseconds(metadataCheckpoint.reviewedAt) &&
    metadataCheckpoint.reviewedAt <
      REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_MIN_REVIEWED_AT
  );
}

function reviewOnlyHandoffMetadataConsolidationLayerMalformed(
  metadataCheckpoint
) {
  const summary = isPlainObjectRecord(metadataCheckpoint)
    ? metadataCheckpoint.metadataHandoffCheckpointSummary
    : null;

  return !REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_MALFORMED_CHECKS.every(
    (predicate) => predicate(metadataCheckpoint, summary)
  );
}

function reviewOnlyHandoffMetadataConsolidationLayerApprovalDecisionLooking(
  metadataCheckpoint
) {
  return reviewOnlyHandoffMetadataConsolidationLayerChecksAny(metadataCheckpoint, [
    (checkpoint) =>
      reviewOnlyInspectionHandoffMetadataBoundaryAnyFieldNotEqual(
        checkpoint,
        REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_APPROVAL_DECISION_FALSE_FIELDS,
        false
      ),
    (checkpoint) =>
      reviewOnlyInspectionHandoffMetadataBoundaryAnyFieldNotEqual(
        checkpoint,
        REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_APPROVAL_DECISION_NULL_FIELDS,
        null
      ),
    (checkpoint) =>
      reviewOnlyHandoffMetadataConsolidationLayerSourceKeyTruePresent(
        checkpoint,
        REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_SOURCE_APPROVAL_DECISION_TRUE_FIELDS
      ),
    (checkpoint) =>
      reviewOnlyInspectionHandoffMetadataBoundaryKeyTruePresent(
        checkpoint,
        REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_OBJECT_FIELD_GROUPS
          .approvalDecision
      )
  ]);
}

function reviewOnlyHandoffMetadataConsolidationLayerApprovalGrantLooking(
  metadataCheckpoint
) {
  return reviewOnlyHandoffMetadataConsolidationLayerChecksAny(metadataCheckpoint, [
    (checkpoint) =>
      reviewOnlyInspectionHandoffMetadataBoundaryAnyFieldNotEqual(
        checkpoint,
        REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_APPROVAL_GRANT_FALSE_FIELDS,
        false
      ),
    (checkpoint) =>
      reviewOnlyInspectionHandoffMetadataBoundaryAnyFieldNotEqual(
        checkpoint,
        REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_APPROVAL_GRANT_NULL_FIELDS,
        null
      ),
    (checkpoint) =>
      reviewOnlyHandoffMetadataConsolidationLayerSourceKeyTruePresent(
        checkpoint,
        REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_SOURCE_APPROVAL_GRANT_TRUE_FIELDS
      )
  ]);
}

function reviewOnlyHandoffMetadataConsolidationLayerEvaluatorResultLooking(
  metadataCheckpoint
) {
  return reviewOnlyHandoffMetadataConsolidationLayerChecksAny(metadataCheckpoint, [
    (checkpoint) =>
      reviewOnlyInspectionHandoffMetadataBoundaryAnyFieldNotEqual(
        checkpoint,
        REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_EVALUATOR_RESULT_FALSE_FIELDS,
        false
      ),
    (checkpoint) =>
      reviewOnlyInspectionHandoffMetadataBoundaryAnyFieldNotEqual(
        checkpoint,
        REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_EVALUATOR_RESULT_NULL_FIELDS,
        null
      ),
    (checkpoint) =>
      reviewOnlyHandoffMetadataConsolidationLayerSourceKeyTruePresent(
        checkpoint,
        REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_SOURCE_EVALUATOR_RESULT_TRUE_FIELDS
      ),
    (checkpoint) =>
      reviewOnlyInspectionHandoffMetadataBoundaryKeyTruePresent(
        checkpoint,
        REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_OBJECT_FIELD_GROUPS
          .evaluatorResult
      )
  ]);
}

function reviewOnlyHandoffMetadataConsolidationLayerEvaluatorExecutionLooking(
  metadataCheckpoint
) {
  return reviewOnlyHandoffMetadataConsolidationLayerChecksAny(metadataCheckpoint, [
    (checkpoint) =>
      reviewOnlyInspectionHandoffMetadataBoundaryAnyFieldNotEqual(
        checkpoint,
        REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_EVALUATOR_EXECUTION_FALSE_FIELDS,
        false
      ),
    (checkpoint) =>
      reviewOnlyHandoffMetadataConsolidationLayerSourceKeyTruePresent(
        checkpoint,
        REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_SOURCE_EVALUATOR_EXECUTION_TRUE_FIELDS
      )
  ]);
}

function reviewOnlyHandoffMetadataConsolidationLayerReviewerRoutingLooking(
  metadataCheckpoint
) {
  return reviewOnlyHandoffMetadataConsolidationLayerChecksAny(metadataCheckpoint, [
    (checkpoint) =>
      reviewOnlyInspectionHandoffMetadataBoundaryAnyFieldNotEqual(
        checkpoint,
        REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_REVIEWER_ROUTING_FALSE_FIELDS,
        false
      ),
    (checkpoint) =>
      reviewOnlyInspectionHandoffMetadataBoundaryAnyFieldNotEqual(
        checkpoint,
        REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_REVIEWER_ROUTING_NULL_FIELDS,
        null
      ),
    (checkpoint) =>
      reviewOnlyHandoffMetadataConsolidationLayerSourceKeyTruePresent(
        checkpoint,
        REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_SOURCE_REVIEWER_ROUTING_TRUE_FIELDS
      ),
    (checkpoint) =>
      reviewOnlyInspectionHandoffMetadataBoundaryKeyPresent(
        checkpoint,
        REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_OBJECT_FIELD_GROUPS
          .reviewerRouting
      )
  ]);
}

function reviewOnlyHandoffMetadataConsolidationLayerReviewerAssignmentLooking(
  metadataCheckpoint
) {
  return reviewOnlyHandoffMetadataConsolidationLayerChecksAny(metadataCheckpoint, [
    (checkpoint) =>
      reviewOnlyInspectionHandoffMetadataBoundaryAnyFieldNotEqual(
        checkpoint,
        REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_REVIEWER_ASSIGNMENT_FALSE_FIELDS,
        false
      ),
    (checkpoint) =>
      reviewOnlyInspectionHandoffMetadataBoundaryAnyFieldNotEqual(
        checkpoint,
        REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_REVIEWER_ASSIGNMENT_NULL_FIELDS,
        null
      ),
    (checkpoint) =>
      reviewOnlyHandoffMetadataConsolidationLayerSourceKeyTruePresent(
        checkpoint,
        REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_SOURCE_REVIEWER_ASSIGNMENT_TRUE_FIELDS
      ),
    (checkpoint) =>
      reviewOnlyInspectionHandoffMetadataBoundaryKeyPresent(
        checkpoint,
        REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_OBJECT_FIELD_GROUPS
          .reviewerAssignment
      )
  ]);
}

function reviewOnlyHandoffMetadataConsolidationLayerRuntimePermissionLooking(
  metadataCheckpoint
) {
  return reviewOnlyInspectionHandoffMetadataBoundaryKeyTruePresent(
    metadataCheckpoint,
    ["runtimePermission", "runtimePermissionGranted", "canEnableRuntime"]
  );
}

function reviewOnlyHandoffMetadataConsolidationLayerCommandExposureLooking(
  metadataCheckpoint
) {
  return reviewOnlyHandoffMetadataConsolidationLayerChecksAny(metadataCheckpoint, [
    (checkpoint) =>
      reviewOnlyInspectionHandoffMetadataBoundaryKeyTruePresent(checkpoint, [
        "commandExposure",
        "commandExposurePermissionGranted",
        "runtimeCommandEnabled",
        "runtimeCommandExposureEnabled"
      ]),
    (checkpoint) =>
      reviewOnlyHandoffMetadataConsolidationLayerSourceKeyTruePresent(
        checkpoint,
        REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_SOURCE_COMMAND_EXPOSURE_TRUE_FIELDS
      )
  ]);
}

function reviewOnlyHandoffMetadataConsolidationLayerSourceRuntimeEffectTrue(
  metadataCheckpoint
) {
  const sourceLayer =
    reviewOnlyHandoffMetadataConsolidationLayerSourceLayer(metadataCheckpoint);

  return (
    isPlainObjectRecord(sourceLayer) &&
    Object.prototype.hasOwnProperty.call(sourceLayer, "runtimeEffectAllFalse") &&
    sourceLayer.runtimeEffectAllFalse !== true
  );
}

function reviewOnlyHandoffMetadataConsolidationLayerRuntimeEffectTrue(
  metadataCheckpoint
) {
  return reviewOnlyHandoffMetadataConsolidationLayerChecksAny(metadataCheckpoint, [
    (checkpoint) =>
      !reviewOnlyInspectionHandoffMetadataBoundaryRuntimeEffectAllFalse(
        checkpoint.runtimeEffect
      ),
    (checkpoint) =>
      reviewOnlyInspectionHandoffMetadataBoundaryKeyTruePresent(checkpoint, [
        "runtimeEnabled",
        "runtimeStarted",
        "runtimeReady",
        "runtimeExecutionEnabled",
        "runtimeExecuted"
      ]),
    reviewOnlyHandoffMetadataConsolidationLayerSourceRuntimeEffectTrue
  ]);
}

function reviewOnlyHandoffMetadataConsolidationLayerProcessFlagTrue(
  metadataCheckpoint
) {
  return reviewOnlyInspectionHandoffMetadataBoundaryKeyTruePresent(
    metadataCheckpoint,
    [
      "processSpawned",
      "processSpawning",
      "processControlPerformed",
      "processTerminationEnabled",
      "runtimeSupervisionEnabled",
      "stdinLoopEnabled",
      "stdoutRuntimeWriterEnabled",
      "stderrRuntimeWriterEnabled"
    ]
  );
}

function reviewOnlyHandoffMetadataConsolidationLayerExecutionSignalLooking(
  metadataCheckpoint
) {
  return reviewOnlyInspectionHandoffMetadataBoundaryKeyTruePresent(
    metadataCheckpoint,
    [
      "executionSignal",
      "executionRequested",
      "executionStarted",
      "runtimeExecutionSignal",
      "approvalEvaluatorAuthoritative"
    ]
  );
}

function reviewOnlyHandoffMetadataConsolidationLayerAuthorizing(
  metadataCheckpoint
) {
  return reviewOnlyInspectionHandoffMetadataBoundaryKeyTruePresent(
    metadataCheckpoint,
    [
      "authoritative",
      "authorizing",
      "authorized",
      "authorizationGranted",
      "approvalAuthorized",
      "canApproveRuntime",
      "canGrantRuntime"
    ]
  );
}

const REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_SINGLE_REJECTION_CHECKS =
  Object.freeze([
    [
      "unknown_review_only_handoff_metadata_consolidation_layer_input_rejected",
      reviewOnlyHandoffMetadataConsolidationLayerUnknown
    ],
    [
      "revoked_review_only_handoff_metadata_consolidation_layer_input_rejected",
      reviewOnlyHandoffMetadataConsolidationLayerRevoked
    ],
    [
      "stale_review_only_handoff_metadata_consolidation_layer_input_rejected",
      reviewOnlyHandoffMetadataConsolidationLayerStale
    ],
    [
      "approval_decision_looking_review_only_handoff_metadata_consolidation_layer_input_rejected",
      reviewOnlyHandoffMetadataConsolidationLayerApprovalDecisionLooking
    ],
    [
      "reviewer_routing_looking_review_only_handoff_metadata_consolidation_layer_input_rejected",
      reviewOnlyHandoffMetadataConsolidationLayerReviewerRoutingLooking
    ],
    [
      "reviewer_assignment_looking_review_only_handoff_metadata_consolidation_layer_input_rejected",
      reviewOnlyHandoffMetadataConsolidationLayerReviewerAssignmentLooking
    ],
    [
      "unsafe_review_only_handoff_metadata_consolidation_layer_input_rejected",
      reviewOnlyHandoffMetadataConsolidationLayerUnexpectedUnsafeField
    ],
    [
      "unsafe_review_only_handoff_metadata_consolidation_layer_input_rejected",
      reviewOnlyHandoffMetadataConsolidationLayerUnsafeNestedMetadata
    ],
    [
      "approval_grant_looking_review_only_handoff_metadata_consolidation_layer_input_rejected",
      reviewOnlyHandoffMetadataConsolidationLayerApprovalGrantLooking
    ],
    [
      "grant_looking_review_only_handoff_metadata_consolidation_layer_input_rejected",
      reviewOnlyInspectionHandoffMetadataBoundaryGrantLooking
    ],
    [
      "evaluator_result_looking_review_only_handoff_metadata_consolidation_layer_input_rejected",
      reviewOnlyHandoffMetadataConsolidationLayerEvaluatorResultLooking
    ],
    [
      "evaluator_execution_looking_review_only_handoff_metadata_consolidation_layer_input_rejected",
      reviewOnlyHandoffMetadataConsolidationLayerEvaluatorExecutionLooking
    ],
    [
      "runtime_permission_looking_review_only_handoff_metadata_consolidation_layer_input_rejected",
      reviewOnlyHandoffMetadataConsolidationLayerRuntimePermissionLooking
    ],
    [
      "command_exposure_looking_review_only_handoff_metadata_consolidation_layer_input_rejected",
      reviewOnlyHandoffMetadataConsolidationLayerCommandExposureLooking
    ],
    [
      "runtime_effect_true_review_only_handoff_metadata_consolidation_layer_input_rejected",
      reviewOnlyHandoffMetadataConsolidationLayerRuntimeEffectTrue
    ],
    [
      "process_flag_true_review_only_handoff_metadata_consolidation_layer_input_rejected",
      reviewOnlyHandoffMetadataConsolidationLayerProcessFlagTrue
    ],
    [
      "execution_signal_looking_review_only_handoff_metadata_consolidation_layer_input_rejected",
      reviewOnlyHandoffMetadataConsolidationLayerExecutionSignalLooking
    ],
    [
      "authorizing_review_only_handoff_metadata_consolidation_layer_input_rejected",
      reviewOnlyHandoffMetadataConsolidationLayerAuthorizing
    ],
    [
      MALFORMED_REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_CLASSIFICATION,
      reviewOnlyHandoffMetadataConsolidationLayerMalformed
    ]
  ]);

function reviewOnlyHandoffMetadataConsolidationLayerSingleClassification(
  metadataCheckpoint
) {
  const rejection =
    REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_SINGLE_REJECTION_CHECKS.find(
      ([, predicate]) => predicate(metadataCheckpoint)
    );

  return (
    rejection?.[0] ??
    VALID_REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_CLASSIFICATION
  );
}

function reviewOnlyHandoffMetadataConsolidationLayerInputsContainDuplicate(
  metadataCheckpoints
) {
  const digests = metadataCheckpoints
    .filter(isPlainObjectRecord)
    .map((entry) => reviewArtifactHandoffDigest(entry));
  return new Set(digests).size !== digests.length;
}

function reviewOnlyHandoffMetadataConsolidationLayerMultiInputClassification(
  metadataCheckpoints
) {
  return reviewOnlyHandoffMetadataConsolidationLayerInputsContainDuplicate(
    metadataCheckpoints
  )
    ? "duplicate_invalid_review_only_handoff_metadata_consolidation_layer_input_rejected"
    : "conflicting_review_only_handoff_metadata_consolidation_layer_input_rejected";
}

const REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_INPUT_REJECTIONS =
  Object.freeze([
    [
      (metadataCheckpoints) => metadataCheckpoints === undefined,
      () =>
        "missing_review_only_handoff_metadata_consolidation_layer_input_rejected"
    ],
    [
      (metadataCheckpoints) => !Array.isArray(metadataCheckpoints),
      () => MALFORMED_REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_CLASSIFICATION
    ],
    [
      (metadataCheckpoints) => metadataCheckpoints.length === 0,
      () => "empty_review_only_handoff_metadata_consolidation_layer_input_rejected"
    ],
    [
      (metadataCheckpoints) => metadataCheckpoints.length > 1,
      reviewOnlyHandoffMetadataConsolidationLayerMultiInputClassification
    ],
    [
      (metadataCheckpoints) => !isPlainObjectRecord(metadataCheckpoints[0]),
      () => MALFORMED_REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_CLASSIFICATION
    ]
  ]);

function reviewOnlyHandoffMetadataConsolidationLayerInputRejection(
  metadataCheckpoints
) {
  const rejection =
    REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_INPUT_REJECTIONS.find(
      ([predicate]) => predicate(metadataCheckpoints)
    );
  return rejection?.[1](metadataCheckpoints);
}

function reviewOnlyHandoffMetadataConsolidationLayerClassification(
  metadataCheckpoints
) {
  const inputRejection =
    reviewOnlyHandoffMetadataConsolidationLayerInputRejection(
      metadataCheckpoints
    );

  return (
    inputRejection ??
    reviewOnlyHandoffMetadataConsolidationLayerSingleClassification(
      metadataCheckpoints[0]
    )
  );
}

function reviewOnlyHandoffMetadataConsolidationLayerSummary() {
  return {
    handoffMetadataConsolidationLayerKind:
      REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_KIND,
    handoffMetadataConsolidationLayerMode: "review-only",
    sourceMetadataHandoffCheckpointClassification:
      VALID_REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_CLASSIFICATION,
    handoffMetadataConsolidationLayerMetadataOnly: true,
    cleanupHardeningToolkitEvidence:
      "installed-toolkit-validation-evidence-only",
    reviewerRoutingPerformed: false,
    reviewerAssignmentPerformed: false,
    evaluatorExecutionPerformed: false,
    evaluatorResultProduced: false,
    approvalDecisionProduced: false,
    approvalGrantProduced: false,
    runtimePermissionGranted: false,
    commandExposurePermissionGranted: false,
    evaluatorExecuted: false,
    runtimeEffectAllFalse: true
  };
}

function reviewOnlyHandoffMetadataConsolidationLayerCleanupEvidence() {
  return {
    phase: "phase-5.42-review-only-handoff-metadata-consolidation-layer",
    evidenceMode: "installed-cleanup-hardening-toolkit-validation-only",
    npmAuditRequired: true,
    cargoAuditRequired: true,
    cargoMacheteRequired: true,
    fallowStaticRequired: true,
    optionalAdvisoryChecksAllowed: true,
    megaLinterRun: false,
    broadTrunkRewriteRun: false,
    toolsInstalledByPhase542: false,
    fallowRuntimeUsed: false,
    runtimeExecutionEnabled: false,
    commandExposurePermissionGranted: false
  };
}

function reviewOnlyHandoffMetadataConsolidationLayerStateFromCheckpoint(
  metadataCheckpoint,
  reviewedAt
) {
  return {
    schema: REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_STATE_SCHEMA,
    schemaVersion: REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_VERSION,
    stateKind: "review-only-handoff-metadata-consolidation-layer-state",
    stateMode: "review-only",
    reviewedAt,
    sourceMetadataHandoffCheckpoint: {
      schema: metadataCheckpoint.schema,
      stateKind: metadataCheckpoint.stateKind,
      stateMode: metadataCheckpoint.stateMode,
      reviewedAt: metadataCheckpoint.reviewedAt,
      stateDigest: reviewArtifactHandoffDigest(metadataCheckpoint),
      sourceCheckpointHandoffLayerDigest:
        metadataCheckpoint.sourceCheckpointHandoffLayer.stateDigest,
      sourceInspectionHandoffCheckpointDigest:
        metadataCheckpoint.sourceCheckpointHandoffLayer
          .sourceInspectionHandoffCheckpointDigest,
      metadataHandoffCheckpointMetadataOnly: true,
      metadataHandoffCheckpointIsReviewerRouting: false,
      metadataHandoffCheckpointIsReviewerAssignment: false,
      metadataHandoffCheckpointIsEvaluatorExecution: false,
      metadataHandoffCheckpointIsEvaluatorResult: false,
      metadataHandoffCheckpointIsApprovalDecision: false,
      metadataHandoffCheckpointIsApprovalGrant: false,
      reviewerRoutingPerformed: false,
      reviewerAssignmentPerformed: false,
      evaluatorResultProduced: false,
      approvalDecisionProduced: false,
      approvalGrantProduced: false,
      approvalGrantPersisted: false,
      evaluatorExecuted: false,
      runtimeEffectAllFalse: true
    },
    handoffMetadataConsolidationSummary:
      reviewOnlyHandoffMetadataConsolidationLayerSummary(),
    cleanupHardeningToolkitEvidence:
      reviewOnlyHandoffMetadataConsolidationLayerCleanupEvidence(),
    metadataHandoffCheckpointAccepted: true,
    handoffMetadataConsolidationLayerMetadataOnly: true,
    handoffMetadataConsolidationLayerIsReviewerRouting: false,
    handoffMetadataConsolidationLayerIsReviewerAssignment: false,
    handoffMetadataConsolidationLayerIsEvaluatorExecution: false,
    handoffMetadataConsolidationLayerIsEvaluatorResult: false,
    handoffMetadataConsolidationLayerIsApprovalDecision: false,
    handoffMetadataConsolidationLayerIsApprovalGrant: false,
    reviewerRoutingPerformed: false,
    reviewerRoutingEnabled: false,
    reviewerRouteId: null,
    reviewerAssignmentPerformed: false,
    reviewerAssignmentEnabled: false,
    reviewerAssignmentId: null,
    reviewerId: null,
    evaluatorResultProduced: false,
    evaluatorResultPersisted: false,
    evaluatorResultId: null,
    approvalDecisionProduced: false,
    approvalDecisionPersisted: false,
    approvalDecisionId: null,
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

function reviewOnlyHandoffMetadataConsolidationLayerRejectionReasons({
  accepted,
  classification
}) {
  if (accepted) {
    return [
      "handoff_metadata_consolidation_layer_is_review_only",
      "reviewer_routing_not_implemented",
      "reviewer_assignment_not_implemented",
      "evaluator_execution_not_implemented",
      "evaluator_result_not_implemented",
      "approval_decision_not_implemented",
      "approval_grant_not_implemented",
      "installed_cleanup_hardening_toolkit_evidence_only",
      "runtime_enablement_still_blocked"
    ];
  }

  return [
    classification,
    "handoff_metadata_consolidation_layer_not_produced",
    "reviewer_routing_not_implemented",
    "reviewer_assignment_not_implemented",
    "evaluator_execution_not_implemented",
    "evaluator_result_not_implemented",
    "approval_decision_not_implemented",
    "approval_grant_not_implemented",
    "runtime_enablement_still_blocked"
  ];
}

function reviewOnlyHandoffMetadataConsolidationLayerInputRecord(input) {
  return isPlainObjectRecord(input) ? input : null;
}

function reviewOnlyHandoffMetadataConsolidationLayerReviewedAt(inputRecord) {
  if (
    inputRecord === null ||
    !Object.prototype.hasOwnProperty.call(inputRecord, "reviewedAt")
  ) {
    return APPROVAL_PREREQUISITE_SOURCE_PREFLIGHT_DEFAULT_REVIEWED_AT;
  }

  return isUtcIsoTimestampWithMilliseconds(inputRecord.reviewedAt)
    ? inputRecord.reviewedAt
    : APPROVAL_PREREQUISITE_SOURCE_PREFLIGHT_DEFAULT_REVIEWED_AT;
}

function reviewOnlyHandoffMetadataConsolidationLayerInputMalformed(inputRecord) {
  return (
    inputRecord === null ||
    (Object.prototype.hasOwnProperty.call(inputRecord, "reviewedAt") &&
      !isUtcIsoTimestampWithMilliseconds(inputRecord.reviewedAt))
  );
}

function reviewOnlyHandoffMetadataConsolidationLayerEntries(inputRecord) {
  return inputRecord === null
    ? undefined
    : inputRecord.metadataHandoffCheckpointEntries;
}

function reviewOnlyHandoffMetadataConsolidationLayerInputClassification(
  inputRecord,
  metadataCheckpoints
) {
  return reviewOnlyHandoffMetadataConsolidationLayerInputMalformed(inputRecord)
    ? MALFORMED_REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_CLASSIFICATION
    : reviewOnlyHandoffMetadataConsolidationLayerClassification(
        metadataCheckpoints
      );
}

function reviewOnlyHandoffMetadataConsolidationLayerSummaryFromCheckpoint(
  metadataCheckpoint
) {
  return {
    schema: metadataCheckpoint.schema,
    stateKind: metadataCheckpoint.stateKind,
    stateMode: metadataCheckpoint.stateMode,
    reviewedAt: metadataCheckpoint.reviewedAt,
    stateDigest: reviewArtifactHandoffDigest(metadataCheckpoint),
    metadataHandoffCheckpointMetadataOnly: true,
    metadataHandoffCheckpointIsReviewerRouting: false,
    metadataHandoffCheckpointIsReviewerAssignment: false,
    metadataHandoffCheckpointIsEvaluatorExecution: false,
    metadataHandoffCheckpointIsEvaluatorResult: false,
    metadataHandoffCheckpointIsApprovalDecision: false,
    metadataHandoffCheckpointIsApprovalGrant: false,
    reviewerRoutingPerformed: false,
    reviewerAssignmentPerformed: false,
    evaluatorResultProduced: false,
    approvalDecisionProduced: false,
    approvalGrantProduced: false,
    approvalGrantPersisted: false,
    evaluatorExecuted: false,
    runtimeEffectAllFalse: true
  };
}

function reviewOnlyHandoffMetadataConsolidationLayerAcceptedOutput({
  accepted,
  metadataCheckpoints,
  reviewedAt
}) {
  if (!accepted) {
    return {
      handoffMetadataConsolidationLayer: null,
      metadataHandoffCheckpointSummary: null
    };
  }

  const sourceCheckpoint = metadataCheckpoints[0];

  return {
    handoffMetadataConsolidationLayer:
      reviewOnlyHandoffMetadataConsolidationLayerStateFromCheckpoint(
        sourceCheckpoint,
        reviewedAt
      ),
    metadataHandoffCheckpointSummary:
      reviewOnlyHandoffMetadataConsolidationLayerSummaryFromCheckpoint(
        sourceCheckpoint
      )
  };
}

function reviewOnlyHandoffMetadataConsolidationLayerResult({
  reviewedAt,
  reviewedAtDefaulted,
  classification,
  accepted,
  handoffMetadataConsolidationLayer,
  metadataHandoffCheckpointSummary
}) {
  return {
    schema: REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_SCHEMA,
    schemaVersion: REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_VERSION,
    handoffMetadataConsolidationLayerKind:
      REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_KIND,
    handoffMetadataConsolidationLayerMode: "review-only",
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    metadataHandoffCheckpointAccepted: accepted,
    handoffMetadataConsolidationLayerProduced: accepted,
    handoffMetadataConsolidationLayerIsReviewerRouting: false,
    handoffMetadataConsolidationLayerIsReviewerAssignment: false,
    handoffMetadataConsolidationLayerIsEvaluatorExecution: false,
    handoffMetadataConsolidationLayerIsEvaluatorResult: false,
    handoffMetadataConsolidationLayerIsApprovalDecision: false,
    handoffMetadataConsolidationLayerIsApprovalGrant: false,
    handoffMetadataConsolidationLayer,
    metadataHandoffCheckpointSummary,
    cleanupHardeningToolkitEvidence:
      reviewOnlyHandoffMetadataConsolidationLayerCleanupEvidence(),
    reviewOnly: true,
    authoritative: false,
    reviewArtifactOnly: true,
    handoffMetadataConsolidationLayerMetadataOnly: true,
    reviewerRoutingPerformed: false,
    reviewerRoutingEnabled: false,
    reviewerRouteId: null,
    reviewerAssignmentPerformed: false,
    reviewerAssignmentEnabled: false,
    reviewerAssignmentId: null,
    reviewerId: null,
    evaluatorResultProduced: false,
    evaluatorResultPersisted: false,
    evaluatorResultId: null,
    approvalDecisionProduced: false,
    approvalDecisionPersisted: false,
    approvalDecisionId: null,
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
    rejectionReasons: reviewOnlyHandoffMetadataConsolidationLayerRejectionReasons({
      accepted,
      classification
    }),
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

export function createReviewOnlyHandoffMetadataConsolidationLayerForReview(
  input = {}
) {
  const inputRecord =
    reviewOnlyHandoffMetadataConsolidationLayerInputRecord(input);
  const reviewedAt =
    reviewOnlyHandoffMetadataConsolidationLayerReviewedAt(inputRecord);
  const reviewedAtDefaulted = isReviewedAtDefaulted(inputRecord);
  const metadataCheckpoints =
    reviewOnlyHandoffMetadataConsolidationLayerEntries(inputRecord);
  const classification =
    reviewOnlyHandoffMetadataConsolidationLayerInputClassification(
      inputRecord,
      metadataCheckpoints
    );
  const accepted =
    classification ===
    VALID_REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_CLASSIFICATION;
  const {
    handoffMetadataConsolidationLayer,
    metadataHandoffCheckpointSummary
  } = reviewOnlyHandoffMetadataConsolidationLayerAcceptedOutput({
    accepted,
    metadataCheckpoints,
    reviewedAt
  });

  return reviewOnlyHandoffMetadataConsolidationLayerResult({
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    accepted,
    handoffMetadataConsolidationLayer,
    metadataHandoffCheckpointSummary
  });
}

const REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_STATE_SCHEMA =
  "ardyn.phase-5.43.review-only-consolidation-checkpoint-handoff-state";
const REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_MIN_REVIEWED_AT =
  REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_MIN_REVIEWED_AT;
const VALID_REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_CLASSIFICATION =
  "valid_review_only_consolidation_checkpoint_handoff_runtime_still_blocked";
const MALFORMED_REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_CLASSIFICATION =
  "malformed_review_only_consolidation_checkpoint_handoff_input_rejected";
const MISMATCHED_SOURCE_DIGEST_REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_CLASSIFICATION =
  "mismatched_source_digest_review_only_consolidation_checkpoint_handoff_input_rejected";

const REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_SOURCE_FIELDS =
  Object.freeze([
    "schema",
    "schemaVersion",
    "stateKind",
    "stateMode",
    "reviewedAt",
    "sourceMetadataHandoffCheckpoint",
    "handoffMetadataConsolidationSummary",
    "cleanupHardeningToolkitEvidence",
    "metadataHandoffCheckpointAccepted",
    "handoffMetadataConsolidationLayerMetadataOnly",
    "handoffMetadataConsolidationLayerIsReviewerRouting",
    "handoffMetadataConsolidationLayerIsReviewerAssignment",
    "handoffMetadataConsolidationLayerIsEvaluatorExecution",
    "handoffMetadataConsolidationLayerIsEvaluatorResult",
    "handoffMetadataConsolidationLayerIsApprovalDecision",
    "handoffMetadataConsolidationLayerIsApprovalGrant",
    "reviewerRoutingPerformed",
    "reviewerRoutingEnabled",
    "reviewerRouteId",
    "reviewerAssignmentPerformed",
    "reviewerAssignmentEnabled",
    "reviewerAssignmentId",
    "reviewerId",
    "evaluatorResultProduced",
    "evaluatorResultPersisted",
    "evaluatorResultId",
    "approvalDecisionProduced",
    "approvalDecisionPersisted",
    "approvalDecisionId",
    "approvalGrantProduced",
    "approvalGrantPersisted",
    "approvalGrantId",
    "runtimePermissionGranted",
    "commandExposurePermissionGranted",
    "runtimeCommandExposureEnabled",
    "runtimeExecutionEnabled",
    "evaluatorExecutionRequested",
    "evaluatorExecutionStarted",
    "evaluatorExecutionEnabled",
    "evaluatorExecuted",
    "runtimeEffect"
  ]);

const REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_REQUIRED_FALSE_FIELDS =
  Object.freeze([
    "handoffMetadataConsolidationLayerIsReviewerRouting",
    "handoffMetadataConsolidationLayerIsReviewerAssignment",
    "handoffMetadataConsolidationLayerIsEvaluatorExecution",
    "handoffMetadataConsolidationLayerIsEvaluatorResult",
    "handoffMetadataConsolidationLayerIsApprovalDecision",
    "handoffMetadataConsolidationLayerIsApprovalGrant",
    "reviewerRoutingPerformed",
    "reviewerRoutingEnabled",
    "reviewerAssignmentPerformed",
    "reviewerAssignmentEnabled",
    "evaluatorResultProduced",
    "evaluatorResultPersisted",
    "approvalDecisionProduced",
    "approvalDecisionPersisted",
    "approvalGrantProduced",
    "approvalGrantPersisted",
    "runtimePermissionGranted",
    "commandExposurePermissionGranted",
    "runtimeCommandExposureEnabled",
    "runtimeExecutionEnabled",
    "evaluatorExecutionRequested",
    "evaluatorExecutionStarted",
    "evaluatorExecutionEnabled",
    "evaluatorExecuted"
  ]);

const REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_REQUIRED_NULL_FIELDS =
  Object.freeze([
    "reviewerRouteId",
    "reviewerAssignmentId",
    "reviewerId",
    "evaluatorResultId",
    "approvalDecisionId",
    "approvalGrantId"
  ]);

const REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_REQUIRED_LITERAL_FIELDS =
  Object.freeze([
    ["schema", REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_STATE_SCHEMA],
    ["schemaVersion", REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_VERSION],
    ["stateKind", "review-only-handoff-metadata-consolidation-layer-state"],
    ["stateMode", "review-only"],
    ["metadataHandoffCheckpointAccepted", true],
    ["handoffMetadataConsolidationLayerMetadataOnly", true]
  ]);

const REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_REQUIRED_OBJECT_FIELDS =
  Object.freeze([
    "sourceMetadataHandoffCheckpoint",
    "handoffMetadataConsolidationSummary",
    "cleanupHardeningToolkitEvidence",
    "runtimeEffect"
  ]);

const REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_SOURCE_METADATA_LITERAL_FIELDS =
  Object.freeze([
    ["schema", REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_STATE_SCHEMA],
    ["stateKind", "review-only-metadata-handoff-checkpoint-state"],
    ["stateMode", "review-only"],
    ["metadataHandoffCheckpointMetadataOnly", true],
    ["runtimeEffectAllFalse", true]
  ]);

const REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_SOURCE_METADATA_DIGEST_FIELDS =
  Object.freeze([
    "stateDigest",
    "sourceCheckpointHandoffLayerDigest",
    "sourceInspectionHandoffCheckpointDigest"
  ]);

const REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_SOURCE_METADATA_FALSE_FIELDS =
  Object.freeze([
    "metadataHandoffCheckpointIsReviewerRouting",
    "metadataHandoffCheckpointIsReviewerAssignment",
    "metadataHandoffCheckpointIsEvaluatorExecution",
    "metadataHandoffCheckpointIsEvaluatorResult",
    "metadataHandoffCheckpointIsApprovalDecision",
    "metadataHandoffCheckpointIsApprovalGrant",
    "reviewerRoutingPerformed",
    "reviewerAssignmentPerformed",
    "evaluatorResultProduced",
    "approvalDecisionProduced",
    "approvalGrantProduced",
    "approvalGrantPersisted",
    "evaluatorExecuted"
  ]);

const REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_REQUIRED_SUMMARY_FIELDS =
  Object.freeze([
    [
      "handoffMetadataConsolidationLayerKind",
      REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_KIND
    ],
    ["handoffMetadataConsolidationLayerMode", "review-only"],
    [
      "sourceMetadataHandoffCheckpointClassification",
      VALID_REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_CLASSIFICATION
    ],
    ["handoffMetadataConsolidationLayerMetadataOnly", true],
    [
      "cleanupHardeningToolkitEvidence",
      "installed-toolkit-validation-evidence-only"
    ],
    ["reviewerRoutingPerformed", false],
    ["reviewerAssignmentPerformed", false],
    ["evaluatorExecutionPerformed", false],
    ["evaluatorResultProduced", false],
    ["approvalDecisionProduced", false],
    ["approvalGrantProduced", false],
    ["runtimePermissionGranted", false],
    ["commandExposurePermissionGranted", false],
    ["evaluatorExecuted", false],
    ["runtimeEffectAllFalse", true]
  ]);

const REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_SAFE_NESTED_KEYS = new Set([
  ...REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_SOURCE_FIELDS,
  ...REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_SOURCE_METADATA_LITERAL_FIELDS.map(
    ([field]) => field
  ),
  ...REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_SOURCE_METADATA_DIGEST_FIELDS,
  ...REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_SOURCE_METADATA_FALSE_FIELDS,
  ...REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_REQUIRED_SUMMARY_FIELDS.map(
    ([field]) => field
  ),
  ...REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_CLEANUP_EVIDENCE_FIELDS,
  ...REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_RUNTIME_EFFECT_FIELDS
]);

const REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_UNKNOWN_TRUE_FIELDS =
  Object.freeze(["unknown", "sourceUnknown"]);
const REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_REVOKED_TRUE_FIELDS =
  Object.freeze(["revoked"]);
const REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_REVOKED_PRESENT_FIELDS =
  Object.freeze(["revokedAt"]);

const REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_ALLOWED_TOP_LEVEL_FIELDS =
  new Set(REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_SOURCE_FIELDS);

const REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_OBJECT_FIELD_GROUPS =
  Object.freeze({
    approvalDecision: [
      "approvalDecision",
      "approvalDecisionResult",
      "approvalDecisionGranted",
      "approvalDecisionAccepted",
      "approvalDecisionAuthorized",
      "consolidationCheckpointHandoffIsApprovalDecision"
    ],
    evaluatorResult: [
      "evaluatorResult",
      "evaluationResult",
      "evaluatorOutput",
      "evaluatorOutcome",
      "resultProduced",
      "consolidationCheckpointHandoffIsEvaluatorResult"
    ],
    reviewerRouting: [
      "reviewerRouting",
      "reviewerRoute",
      "reviewerQueue",
      "routing",
      "routingDecision",
      "routingResult",
      "routeReviewer",
      "reviewerRoutingPermissionGranted"
    ],
    reviewerAssignment: [
      "reviewerAssignment",
      "reviewerAssigned",
      "reviewerAssignee",
      "assignedReviewer",
      "assignedReviewers",
      "reviewerIds",
      "reviewerAllocation",
      "assignmentDecision",
      "humanReviewer",
      "toolReviewer",
      "reviewerAssignmentPermissionGranted"
    ]
  });

function reviewOnlyConsolidationCheckpointHandoffSourceMetadata(
  consolidationLayer
) {
  return isPlainObjectRecord(consolidationLayer)
    ? consolidationLayer.sourceMetadataHandoffCheckpoint
    : null;
}

function reviewOnlyConsolidationCheckpointHandoffSourceMetadataValid(
  consolidationLayer
) {
  const sourceMetadata =
    reviewOnlyConsolidationCheckpointHandoffSourceMetadata(consolidationLayer);
  const checks = [
    isPlainObjectRecord,
    (metadata) => isUtcIsoTimestampWithMilliseconds(metadata.reviewedAt),
    (metadata) =>
      reviewOnlyInspectionHandoffMetadataBoundaryFieldsEqual(
        metadata,
        REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_SOURCE_METADATA_LITERAL_FIELDS
      ),
    (metadata) =>
      REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_SOURCE_METADATA_DIGEST_FIELDS.every(
        (field) => reviewOnlyMetadataHandoffCheckpointDigestString(metadata[field])
      ),
    (metadata) =>
      REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_SOURCE_METADATA_FALSE_FIELDS.every(
        (field) => metadata[field] === false
      )
  ];

  return checks.every((predicate) => predicate(sourceMetadata));
}

const REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_MALFORMED_CHECKS =
  Object.freeze([
    (consolidationLayer) => isPlainObjectRecord(consolidationLayer),
    (consolidationLayer) =>
      reviewOnlyInspectionHandoffMetadataBoundaryFieldsEqual(
        consolidationLayer,
        REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_REQUIRED_LITERAL_FIELDS
      ),
    (consolidationLayer) =>
      isUtcIsoTimestampWithMilliseconds(consolidationLayer.reviewedAt),
    (consolidationLayer) =>
      reviewOnlyInspectionHandoffMetadataBoundaryFieldsPlainObjects(
        consolidationLayer,
        REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_REQUIRED_OBJECT_FIELDS
      ),
    reviewOnlyConsolidationCheckpointHandoffSourceMetadataValid,
    (_consolidationLayer, summary) => isPlainObjectRecord(summary),
    (_consolidationLayer, summary) =>
      reviewOnlyInspectionHandoffMetadataBoundaryFieldsEqual(
        summary,
        REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_REQUIRED_SUMMARY_FIELDS
      ),
    (consolidationLayer) =>
      REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_REQUIRED_FALSE_FIELDS.every(
        (field) => consolidationLayer[field] === false
      ),
    (consolidationLayer) =>
      REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_REQUIRED_NULL_FIELDS.every(
        (field) => consolidationLayer[field] === null
      ),
    (consolidationLayer) =>
      reviewOnlyInspectionHandoffMetadataBoundaryRuntimeEffectAllFalse(
        consolidationLayer.runtimeEffect
      )
  ]);

function reviewOnlyConsolidationCheckpointHandoffChecksAny(
  consolidationLayer,
  checks
) {
  return checks.some((predicate) => predicate(consolidationLayer));
}

function reviewOnlyConsolidationCheckpointHandoffSourceKeyTruePresent(
  consolidationLayer,
  fields
) {
  return reviewOnlyInspectionHandoffMetadataBoundaryKeyTruePresent(
    reviewOnlyConsolidationCheckpointHandoffSourceMetadata(consolidationLayer),
    fields
  );
}

function reviewOnlyConsolidationCheckpointHandoffUnexpectedUnsafeField(
  consolidationLayer
) {
  return (
    isPlainObjectRecord(consolidationLayer) &&
    Object.keys(consolidationLayer).some(
      (key) =>
        !REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_ALLOWED_TOP_LEVEL_FIELDS.has(
          key
        )
    )
  );
}

function reviewOnlyConsolidationCheckpointHandoffUnsafeNestedMetadata(
  consolidationLayer
) {
  return reviewOnlyInspectionHandoffMetadataBoundaryKeyPresent(
    consolidationLayer,
    [
      "consolidationCheckpointHandoff",
      "consolidationCheckpointHandoffMetadata",
      "checkpointHandoffMetadata",
      "handoffMetadata",
      "checkpointMetadata",
      "consolidationMetadata",
      "handoffMetadataConsolidationLayerMetadata",
      "reviewerRoutingMetadata",
      "reviewerAssignmentMetadata",
      "evaluatorExecutionMetadata",
      "evaluatorResultMetadata",
      "approvalDecisionMetadata",
      "approvalGrantMetadata",
      "runtimePermissionMetadata",
      "commandExposureMetadata",
      "executionMetadata"
    ]
  ) || reviewOnlyConsolidationCheckpointHandoffUnsafeRuntimeInputKey(
    consolidationLayer
  );
}

function reviewOnlyConsolidationCheckpointHandoffUnsafeRuntimeInputKey(
  value,
  seen = new Set()
) {
  if (Array.isArray(value)) {
    return value.some((entry) =>
      reviewOnlyConsolidationCheckpointHandoffUnsafeRuntimeInputKey(entry, seen)
    );
  }

  if (!isPlainObjectRecord(value) || seen.has(value)) {
    return false;
  }

  seen.add(value);

  return Object.entries(value).some(
    ([key, entry]) =>
      (APPROVAL_EVALUATOR_CANDIDATE_UNSAFE_TRUE_FIELD_PATTERN.test(key) &&
        !REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_SAFE_NESTED_KEYS.has(
          key
        )) ||
      reviewOnlyConsolidationCheckpointHandoffUnsafeRuntimeInputKey(entry, seen)
  );
}

function reviewOnlyConsolidationCheckpointHandoffContainsArray(value) {
  if (Array.isArray(value)) {
    return true;
  }

  if (!isPlainObjectRecord(value)) {
    return false;
  }

  return Object.values(value).some((entry) =>
    reviewOnlyConsolidationCheckpointHandoffContainsArray(entry)
  );
}

function reviewOnlyConsolidationCheckpointHandoffUnknown(consolidationLayer) {
  return reviewOnlyConsolidationCheckpointHandoffChecksAny(consolidationLayer, [
    (layer) =>
      reviewOnlyInspectionHandoffMetadataBoundaryAnyFieldTrue(
        layer,
        REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_UNKNOWN_TRUE_FIELDS
      ),
    (layer) =>
      ["classification", "status"].some((field) => layer[field] === "unknown")
  ]);
}

function reviewOnlyConsolidationCheckpointHandoffRevoked(consolidationLayer) {
  return reviewOnlyConsolidationCheckpointHandoffChecksAny(consolidationLayer, [
    (layer) =>
      reviewOnlyInspectionHandoffMetadataBoundaryAnyFieldTrue(
        layer,
        REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_REVOKED_TRUE_FIELDS
      ),
    (layer) =>
      reviewOnlyInspectionHandoffMetadataBoundaryAnyFieldPresent(
        layer,
        REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_REVOKED_PRESENT_FIELDS
      ),
    (layer) =>
      ["classification", "status"].some((field) => layer[field] === "revoked")
  ]);
}

function reviewOnlyConsolidationCheckpointHandoffStale(consolidationLayer) {
  return (
    isPlainObjectRecord(consolidationLayer) &&
    isUtcIsoTimestampWithMilliseconds(consolidationLayer.reviewedAt) &&
    consolidationLayer.reviewedAt <
      REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_MIN_REVIEWED_AT
  );
}

function reviewOnlyConsolidationCheckpointHandoffMalformed(consolidationLayer) {
  const summary = isPlainObjectRecord(consolidationLayer)
    ? consolidationLayer.handoffMetadataConsolidationSummary
    : null;

  return !REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_MALFORMED_CHECKS.every(
    (predicate) => predicate(consolidationLayer, summary)
  );
}

function reviewOnlyConsolidationCheckpointHandoffApprovalDecisionLooking(
  consolidationLayer
) {
  return reviewOnlyConsolidationCheckpointHandoffChecksAny(consolidationLayer, [
    (layer) =>
      reviewOnlyInspectionHandoffMetadataBoundaryAnyFieldNotEqual(
        layer,
        ["approvalDecisionProduced", "approvalDecisionPersisted"],
        false
      ),
    (layer) =>
      reviewOnlyInspectionHandoffMetadataBoundaryAnyFieldNotEqual(
        layer,
        ["approvalDecisionId"],
        null
      ),
    (layer) =>
      reviewOnlyConsolidationCheckpointHandoffSourceKeyTruePresent(layer, [
        "approvalDecisionProduced",
        "approvalDecisionPersisted"
      ]),
    (layer) =>
      reviewOnlyInspectionHandoffMetadataBoundaryKeyTruePresent(
        layer,
        REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_OBJECT_FIELD_GROUPS
          .approvalDecision
      )
  ]);
}

function reviewOnlyConsolidationCheckpointHandoffApprovalGrantLooking(
  consolidationLayer
) {
  return reviewOnlyConsolidationCheckpointHandoffChecksAny(consolidationLayer, [
    (layer) =>
      reviewOnlyInspectionHandoffMetadataBoundaryAnyFieldNotEqual(
        layer,
        ["approvalGrantProduced", "approvalGrantPersisted"],
        false
      ),
    (layer) =>
      reviewOnlyInspectionHandoffMetadataBoundaryAnyFieldNotEqual(
        layer,
        ["approvalGrantId"],
        null
      ),
    (layer) =>
      reviewOnlyConsolidationCheckpointHandoffSourceKeyTruePresent(layer, [
        "approvalGrantProduced",
        "approvalGrantPersisted"
      ])
  ]);
}

function reviewOnlyConsolidationCheckpointHandoffEvaluatorResultLooking(
  consolidationLayer
) {
  return reviewOnlyConsolidationCheckpointHandoffChecksAny(consolidationLayer, [
    (layer) =>
      reviewOnlyInspectionHandoffMetadataBoundaryAnyFieldNotEqual(
        layer,
        ["evaluatorResultProduced", "evaluatorResultPersisted"],
        false
      ),
    (layer) =>
      reviewOnlyInspectionHandoffMetadataBoundaryAnyFieldNotEqual(
        layer,
        ["evaluatorResultId"],
        null
      ),
    (layer) =>
      reviewOnlyConsolidationCheckpointHandoffSourceKeyTruePresent(layer, [
        "evaluatorResultProduced"
      ]),
    (layer) =>
      reviewOnlyInspectionHandoffMetadataBoundaryKeyTruePresent(
        layer,
        REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_OBJECT_FIELD_GROUPS
          .evaluatorResult
      )
  ]);
}

function reviewOnlyConsolidationCheckpointHandoffEvaluatorExecutionLooking(
  consolidationLayer
) {
  return reviewOnlyConsolidationCheckpointHandoffChecksAny(consolidationLayer, [
    (layer) =>
      reviewOnlyInspectionHandoffMetadataBoundaryAnyFieldNotEqual(
        layer,
        [
          "evaluatorExecutionRequested",
          "evaluatorExecutionStarted",
          "evaluatorExecutionEnabled",
          "evaluatorExecuted"
        ],
        false
      ),
    (layer) =>
      reviewOnlyConsolidationCheckpointHandoffSourceKeyTruePresent(layer, [
        "evaluatorExecutionRequested",
        "evaluatorExecutionStarted",
        "evaluatorExecutionEnabled",
        "evaluatorExecuted"
      ])
  ]);
}

function reviewOnlyConsolidationCheckpointHandoffReviewerRoutingLooking(
  consolidationLayer
) {
  return reviewOnlyConsolidationCheckpointHandoffChecksAny(consolidationLayer, [
    (layer) =>
      reviewOnlyInspectionHandoffMetadataBoundaryAnyFieldNotEqual(
        layer,
        ["reviewerRoutingPerformed", "reviewerRoutingEnabled"],
        false
      ),
    (layer) =>
      reviewOnlyInspectionHandoffMetadataBoundaryAnyFieldNotEqual(
        layer,
        ["reviewerRouteId"],
        null
      ),
    (layer) =>
      reviewOnlyConsolidationCheckpointHandoffSourceKeyTruePresent(layer, [
        "reviewerRoutingPerformed"
      ]),
    (layer) =>
      reviewOnlyInspectionHandoffMetadataBoundaryKeyPresent(
        layer,
        REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_OBJECT_FIELD_GROUPS
          .reviewerRouting
      )
  ]);
}

function reviewOnlyConsolidationCheckpointHandoffReviewerAssignmentLooking(
  consolidationLayer
) {
  return reviewOnlyConsolidationCheckpointHandoffChecksAny(consolidationLayer, [
    (layer) =>
      reviewOnlyInspectionHandoffMetadataBoundaryAnyFieldNotEqual(
        layer,
        ["reviewerAssignmentPerformed", "reviewerAssignmentEnabled"],
        false
      ),
    (layer) =>
      reviewOnlyInspectionHandoffMetadataBoundaryAnyFieldNotEqual(
        layer,
        ["reviewerAssignmentId", "reviewerId"],
        null
      ),
    (layer) =>
      reviewOnlyConsolidationCheckpointHandoffSourceKeyTruePresent(layer, [
        "reviewerAssignmentPerformed"
      ]),
    (layer) =>
      reviewOnlyInspectionHandoffMetadataBoundaryKeyPresent(
        layer,
        REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_OBJECT_FIELD_GROUPS
          .reviewerAssignment
      )
  ]);
}

function reviewOnlyConsolidationCheckpointHandoffRuntimePermissionLooking(
  consolidationLayer
) {
  return reviewOnlyInspectionHandoffMetadataBoundaryKeyTruePresent(
    consolidationLayer,
    ["runtimePermission", "runtimePermissionGranted", "canEnableRuntime"]
  );
}

function reviewOnlyConsolidationCheckpointHandoffCommandExposureLooking(
  consolidationLayer
) {
  return reviewOnlyConsolidationCheckpointHandoffChecksAny(consolidationLayer, [
    (layer) =>
      reviewOnlyInspectionHandoffMetadataBoundaryKeyTruePresent(layer, [
        "commandExposure",
        "commandExposurePermissionGranted",
        "runtimeCommandEnabled",
        "runtimeCommandExposureEnabled"
      ]),
    (layer) =>
      reviewOnlyConsolidationCheckpointHandoffSourceKeyTruePresent(layer, [
        "commandExposurePermissionGranted",
        "runtimeCommandExposureEnabled",
        "runtimeCommandEnabled"
      ])
  ]);
}

function reviewOnlyConsolidationCheckpointHandoffRuntimeEffectTrue(
  consolidationLayer
) {
  const sourceMetadata =
    reviewOnlyConsolidationCheckpointHandoffSourceMetadata(consolidationLayer);

  return reviewOnlyConsolidationCheckpointHandoffChecksAny(consolidationLayer, [
    (layer) =>
      !reviewOnlyInspectionHandoffMetadataBoundaryRuntimeEffectAllFalse(
        layer.runtimeEffect
      ),
    (layer) =>
      reviewOnlyInspectionHandoffMetadataBoundaryKeyTruePresent(layer, [
        "runtimeEnabled",
        "runtimeStarted",
        "runtimeReady",
        "runtimeExecutionEnabled",
        "runtimeExecuted"
      ]),
    () =>
      isPlainObjectRecord(sourceMetadata) &&
      Object.prototype.hasOwnProperty.call(
        sourceMetadata,
        "runtimeEffectAllFalse"
      ) &&
      sourceMetadata.runtimeEffectAllFalse !== true
  ]);
}

function reviewOnlyConsolidationCheckpointHandoffProcessFlagTrue(
  consolidationLayer
) {
  return reviewOnlyInspectionHandoffMetadataBoundaryKeyTruePresent(
    consolidationLayer,
    [
      "processSpawned",
      "processSpawning",
      "processControlPerformed",
      "processTerminationEnabled",
      "runtimeSupervisionEnabled",
      "stdinLoopEnabled",
      "stdoutRuntimeWriterEnabled",
      "stderrRuntimeWriterEnabled"
    ]
  );
}

function reviewOnlyConsolidationCheckpointHandoffExecutionSignalLooking(
  consolidationLayer
) {
  return reviewOnlyInspectionHandoffMetadataBoundaryKeyTruePresent(
    consolidationLayer,
    [
      "executionSignal",
      "executionRequested",
      "executionStarted",
      "runtimeExecutionSignal",
      "approvalEvaluatorAuthoritative"
    ]
  );
}

function reviewOnlyConsolidationCheckpointHandoffAuthorizing(
  consolidationLayer
) {
  return reviewOnlyInspectionHandoffMetadataBoundaryKeyTruePresent(
    consolidationLayer,
    [
      "authoritative",
      "authorizing",
      "authorized",
      "authorizationGranted",
      "approvalAuthorized",
      "canApproveRuntime",
      "canGrantRuntime"
    ]
  );
}

const REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_SINGLE_REJECTION_CHECKS =
  Object.freeze([
    [
      "unknown_review_only_consolidation_checkpoint_handoff_input_rejected",
      reviewOnlyConsolidationCheckpointHandoffUnknown
    ],
    [
      "revoked_review_only_consolidation_checkpoint_handoff_input_rejected",
      reviewOnlyConsolidationCheckpointHandoffRevoked
    ],
    [
      "stale_review_only_consolidation_checkpoint_handoff_input_rejected",
      reviewOnlyConsolidationCheckpointHandoffStale
    ],
    [
      "approval_decision_looking_review_only_consolidation_checkpoint_handoff_input_rejected",
      reviewOnlyConsolidationCheckpointHandoffApprovalDecisionLooking
    ],
    [
      "reviewer_routing_looking_review_only_consolidation_checkpoint_handoff_input_rejected",
      reviewOnlyConsolidationCheckpointHandoffReviewerRoutingLooking
    ],
    [
      "reviewer_assignment_looking_review_only_consolidation_checkpoint_handoff_input_rejected",
      reviewOnlyConsolidationCheckpointHandoffReviewerAssignmentLooking
    ],
    [
      "unsafe_review_only_consolidation_checkpoint_handoff_input_rejected",
      reviewOnlyConsolidationCheckpointHandoffUnexpectedUnsafeField
    ],
    [
      "unsafe_review_only_consolidation_checkpoint_handoff_input_rejected",
      reviewOnlyConsolidationCheckpointHandoffUnsafeNestedMetadata
    ],
    [
      MALFORMED_REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_CLASSIFICATION,
      reviewOnlyConsolidationCheckpointHandoffContainsArray
    ],
    [
      "approval_grant_looking_review_only_consolidation_checkpoint_handoff_input_rejected",
      reviewOnlyConsolidationCheckpointHandoffApprovalGrantLooking
    ],
    [
      "grant_looking_review_only_consolidation_checkpoint_handoff_input_rejected",
      reviewOnlyInspectionHandoffMetadataBoundaryGrantLooking
    ],
    [
      "evaluator_result_looking_review_only_consolidation_checkpoint_handoff_input_rejected",
      reviewOnlyConsolidationCheckpointHandoffEvaluatorResultLooking
    ],
    [
      "evaluator_execution_looking_review_only_consolidation_checkpoint_handoff_input_rejected",
      reviewOnlyConsolidationCheckpointHandoffEvaluatorExecutionLooking
    ],
    [
      "runtime_permission_looking_review_only_consolidation_checkpoint_handoff_input_rejected",
      reviewOnlyConsolidationCheckpointHandoffRuntimePermissionLooking
    ],
    [
      "command_exposure_looking_review_only_consolidation_checkpoint_handoff_input_rejected",
      reviewOnlyConsolidationCheckpointHandoffCommandExposureLooking
    ],
    [
      "runtime_effect_true_review_only_consolidation_checkpoint_handoff_input_rejected",
      reviewOnlyConsolidationCheckpointHandoffRuntimeEffectTrue
    ],
    [
      "process_flag_true_review_only_consolidation_checkpoint_handoff_input_rejected",
      reviewOnlyConsolidationCheckpointHandoffProcessFlagTrue
    ],
    [
      "execution_signal_looking_review_only_consolidation_checkpoint_handoff_input_rejected",
      reviewOnlyConsolidationCheckpointHandoffExecutionSignalLooking
    ],
    [
      "authorizing_review_only_consolidation_checkpoint_handoff_input_rejected",
      reviewOnlyConsolidationCheckpointHandoffAuthorizing
    ],
    [
      MALFORMED_REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_CLASSIFICATION,
      reviewOnlyConsolidationCheckpointHandoffMalformed
    ]
  ]);

function reviewOnlyConsolidationCheckpointHandoffSingleClassification(
  consolidationLayer
) {
  const rejection =
    REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_SINGLE_REJECTION_CHECKS.find(
      ([, predicate]) => predicate(consolidationLayer)
    );

  return (
    rejection?.[0] ??
    VALID_REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_CLASSIFICATION
  );
}

function reviewOnlyConsolidationCheckpointHandoffInputsContainDuplicate(
  consolidationLayers
) {
  const digests = consolidationLayers
    .filter(isPlainObjectRecord)
    .map((entry) => reviewArtifactHandoffDigest(entry));
  return new Set(digests).size !== digests.length;
}

function reviewOnlyConsolidationCheckpointHandoffMultiInputClassification(
  consolidationLayers
) {
  return reviewOnlyConsolidationCheckpointHandoffInputsContainDuplicate(
    consolidationLayers
  )
    ? "duplicate_invalid_review_only_consolidation_checkpoint_handoff_input_rejected"
    : "conflicting_review_only_consolidation_checkpoint_handoff_input_rejected";
}

function reviewOnlyConsolidationCheckpointHandoffDigestMissing(inputRecord) {
  return (
    inputRecord === null ||
    !Object.prototype.hasOwnProperty.call(
      inputRecord,
      "sourceHandoffMetadataConsolidationLayerDigest"
    )
  );
}

function reviewOnlyConsolidationCheckpointHandoffSourceDigest(inputRecord) {
  return inputRecord === null
    ? undefined
    : inputRecord.sourceHandoffMetadataConsolidationLayerDigest;
}

function reviewOnlyConsolidationCheckpointHandoffSourceDigestMatches(
  consolidationLayers,
  sourceDigest
) {
  return (
    Array.isArray(consolidationLayers) &&
    consolidationLayers.length === 1 &&
    isPlainObjectRecord(consolidationLayers[0]) &&
    sourceDigest === reviewArtifactHandoffDigest(consolidationLayers[0])
  );
}

const REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_INPUT_REJECTIONS =
  Object.freeze([
    [
      (consolidationLayers) => consolidationLayers === undefined,
      () =>
        "missing_review_only_consolidation_checkpoint_handoff_input_rejected"
    ],
    [
      (consolidationLayers) => !Array.isArray(consolidationLayers),
      () => MALFORMED_REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_CLASSIFICATION
    ],
    [
      (consolidationLayers) => consolidationLayers.length === 0,
      () => "empty_review_only_consolidation_checkpoint_handoff_input_rejected"
    ],
    [
      (consolidationLayers) =>
        consolidationLayers.some((entry) => !isPlainObjectRecord(entry)),
      () => MALFORMED_REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_CLASSIFICATION
    ],
    [
      (consolidationLayers) => consolidationLayers.length > 1,
      reviewOnlyConsolidationCheckpointHandoffMultiInputClassification
    ]
  ]);

function reviewOnlyConsolidationCheckpointHandoffInputRejection(
  consolidationLayers
) {
  const rejection =
    REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_INPUT_REJECTIONS.find(
      ([predicate]) => predicate(consolidationLayers)
    );
  return rejection?.[1](consolidationLayers);
}

function reviewOnlyConsolidationCheckpointHandoffDigestRejection(
  inputRecord,
  sourceDigest
) {
  return reviewOnlyConsolidationCheckpointHandoffDigestMissing(inputRecord) ||
    !reviewOnlyMetadataHandoffCheckpointDigestString(sourceDigest)
    ? MALFORMED_REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_CLASSIFICATION
    : undefined;
}

function reviewOnlyConsolidationCheckpointHandoffMismatchRejection(
  consolidationLayers,
  sourceDigest
) {
  return reviewOnlyConsolidationCheckpointHandoffSourceDigestMatches(
    consolidationLayers,
    sourceDigest
  )
    ? undefined
    : MISMATCHED_SOURCE_DIGEST_REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_CLASSIFICATION;
}

function reviewOnlyConsolidationCheckpointHandoffClassification({
  inputRecord,
  consolidationLayers,
  sourceDigest
}) {
  const inputRejection =
    reviewOnlyConsolidationCheckpointHandoffInputRejection(consolidationLayers);

  if (inputRejection !== undefined) {
    return inputRejection;
  }

  const digestRejection = reviewOnlyConsolidationCheckpointHandoffDigestRejection(
    inputRecord,
    sourceDigest
  );

  if (digestRejection !== undefined) {
    return digestRejection;
  }

  const mismatchRejection =
    reviewOnlyConsolidationCheckpointHandoffMismatchRejection(
      consolidationLayers,
      sourceDigest
    );

  if (mismatchRejection !== undefined) {
    return mismatchRejection;
  }

  return reviewOnlyConsolidationCheckpointHandoffSingleClassification(
    consolidationLayers[0]
  );
}

function reviewOnlyConsolidationCheckpointHandoffSummary() {
  return {
    consolidationCheckpointHandoffKind:
      REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_KIND,
    consolidationCheckpointHandoffMode: "review-only",
    sourceHandoffMetadataConsolidationLayerClassification:
      VALID_REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_CLASSIFICATION,
    consolidationCheckpointHandoffMetadataOnly: true,
    cleanupHardeningToolkitEvidence:
      "installed-toolkit-validation-evidence-only",
    reviewerRoutingPerformed: false,
    reviewerAssignmentPerformed: false,
    evaluatorExecutionPerformed: false,
    evaluatorResultProduced: false,
    approvalDecisionProduced: false,
    approvalGrantProduced: false,
    runtimePermissionGranted: false,
    commandExposurePermissionGranted: false,
    evaluatorExecuted: false,
    runtimeEffectAllFalse: true
  };
}

function reviewOnlyConsolidationCheckpointHandoffCleanupEvidence() {
  return {
    phase: "phase-5.43-review-only-consolidation-checkpoint-handoff",
    evidenceMode: "installed-cleanup-hardening-toolkit-validation-only",
    npmAuditRequired: true,
    cargoAuditRequired: true,
    cargoMacheteRequired: true,
    fallowStaticRequired: true,
    optionalAdvisoryChecksAllowed: true,
    megaLinterRun: false,
    broadTrunkRewriteRun: false,
    toolsInstalledByPhase543: false,
    fallowRuntimeUsed: false,
    runtimeExecutionEnabled: false,
    commandExposurePermissionGranted: false
  };
}

function reviewOnlyConsolidationCheckpointHandoffStateFromLayer(
  consolidationLayer,
  reviewedAt,
  sourceDigest
) {
  return {
    schema: REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_STATE_SCHEMA,
    schemaVersion: REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_VERSION,
    stateKind: "review-only-consolidation-checkpoint-handoff-state",
    stateMode: "review-only",
    reviewedAt,
    sourceHandoffMetadataConsolidationLayer: {
      schema: consolidationLayer.schema,
      stateKind: consolidationLayer.stateKind,
      stateMode: consolidationLayer.stateMode,
      reviewedAt: consolidationLayer.reviewedAt,
      stateDigest: sourceDigest,
      sourceMetadataHandoffCheckpointDigest:
        consolidationLayer.sourceMetadataHandoffCheckpoint.stateDigest,
      sourceCheckpointHandoffLayerDigest:
        consolidationLayer.sourceMetadataHandoffCheckpoint
          .sourceCheckpointHandoffLayerDigest,
      sourceInspectionHandoffCheckpointDigest:
        consolidationLayer.sourceMetadataHandoffCheckpoint
          .sourceInspectionHandoffCheckpointDigest,
      handoffMetadataConsolidationLayerMetadataOnly: true,
      handoffMetadataConsolidationLayerIsReviewerRouting: false,
      handoffMetadataConsolidationLayerIsReviewerAssignment: false,
      handoffMetadataConsolidationLayerIsEvaluatorExecution: false,
      handoffMetadataConsolidationLayerIsEvaluatorResult: false,
      handoffMetadataConsolidationLayerIsApprovalDecision: false,
      handoffMetadataConsolidationLayerIsApprovalGrant: false,
      reviewerRoutingPerformed: false,
      reviewerAssignmentPerformed: false,
      evaluatorResultProduced: false,
      approvalDecisionProduced: false,
      approvalGrantProduced: false,
      approvalGrantPersisted: false,
      evaluatorExecuted: false,
      runtimeEffectAllFalse: true
    },
    consolidationCheckpointHandoffSummary:
      reviewOnlyConsolidationCheckpointHandoffSummary(),
    cleanupHardeningToolkitEvidence:
      reviewOnlyConsolidationCheckpointHandoffCleanupEvidence(),
    sourceHandoffMetadataConsolidationLayerAccepted: true,
    consolidationCheckpointHandoffMetadataOnly: true,
    consolidationCheckpointHandoffIsReviewerRouting: false,
    consolidationCheckpointHandoffIsReviewerAssignment: false,
    consolidationCheckpointHandoffIsEvaluatorExecution: false,
    consolidationCheckpointHandoffIsEvaluatorResult: false,
    consolidationCheckpointHandoffIsApprovalDecision: false,
    consolidationCheckpointHandoffIsApprovalGrant: false,
    reviewerRoutingPerformed: false,
    reviewerRoutingEnabled: false,
    reviewerRouteId: null,
    reviewerAssignmentPerformed: false,
    reviewerAssignmentEnabled: false,
    reviewerAssignmentId: null,
    reviewerId: null,
    evaluatorResultProduced: false,
    evaluatorResultPersisted: false,
    evaluatorResultId: null,
    approvalDecisionProduced: false,
    approvalDecisionPersisted: false,
    approvalDecisionId: null,
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

function reviewOnlyConsolidationCheckpointHandoffRejectionReasons({
  accepted,
  classification
}) {
  if (accepted) {
    return [
      "consolidation_checkpoint_handoff_is_review_only",
      "reviewer_routing_not_implemented",
      "reviewer_assignment_not_implemented",
      "evaluator_execution_not_implemented",
      "evaluator_result_not_implemented",
      "approval_decision_not_implemented",
      "approval_grant_not_implemented",
      "installed_cleanup_hardening_toolkit_evidence_only",
      "runtime_enablement_still_blocked"
    ];
  }

  return [
    classification,
    "consolidation_checkpoint_handoff_not_produced",
    "reviewer_routing_not_implemented",
    "reviewer_assignment_not_implemented",
    "evaluator_execution_not_implemented",
    "evaluator_result_not_implemented",
    "approval_decision_not_implemented",
    "approval_grant_not_implemented",
    "runtime_enablement_still_blocked"
  ];
}

function reviewOnlyConsolidationCheckpointHandoffInputRecord(input) {
  return isPlainObjectRecord(input) ? input : null;
}

function reviewOnlyConsolidationCheckpointHandoffReviewedAt(inputRecord) {
  if (
    inputRecord === null ||
    !Object.prototype.hasOwnProperty.call(inputRecord, "reviewedAt")
  ) {
    return APPROVAL_PREREQUISITE_SOURCE_PREFLIGHT_DEFAULT_REVIEWED_AT;
  }

  return isUtcIsoTimestampWithMilliseconds(inputRecord.reviewedAt)
    ? inputRecord.reviewedAt
    : APPROVAL_PREREQUISITE_SOURCE_PREFLIGHT_DEFAULT_REVIEWED_AT;
}

function reviewOnlyConsolidationCheckpointHandoffInputMalformed(inputRecord) {
  return (
    inputRecord === null ||
    (Object.prototype.hasOwnProperty.call(inputRecord, "reviewedAt") &&
      !isUtcIsoTimestampWithMilliseconds(inputRecord.reviewedAt))
  );
}

function reviewOnlyConsolidationCheckpointHandoffEntries(inputRecord) {
  return inputRecord === null
    ? undefined
    : inputRecord.handoffMetadataConsolidationLayerEntries;
}

function reviewOnlyConsolidationCheckpointHandoffInputClassification(
  inputRecord,
  consolidationLayers,
  sourceDigest
) {
  return reviewOnlyConsolidationCheckpointHandoffInputMalformed(inputRecord)
    ? MALFORMED_REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_CLASSIFICATION
    : reviewOnlyConsolidationCheckpointHandoffClassification({
        inputRecord,
        consolidationLayers,
        sourceDigest
      });
}

function reviewOnlyConsolidationCheckpointHandoffSummaryFromLayer(
  consolidationLayer,
  sourceDigest
) {
  return {
    schema: consolidationLayer.schema,
    stateKind: consolidationLayer.stateKind,
    stateMode: consolidationLayer.stateMode,
    reviewedAt: consolidationLayer.reviewedAt,
    stateDigest: sourceDigest,
    handoffMetadataConsolidationLayerMetadataOnly: true,
    handoffMetadataConsolidationLayerIsReviewerRouting: false,
    handoffMetadataConsolidationLayerIsReviewerAssignment: false,
    handoffMetadataConsolidationLayerIsEvaluatorExecution: false,
    handoffMetadataConsolidationLayerIsEvaluatorResult: false,
    handoffMetadataConsolidationLayerIsApprovalDecision: false,
    handoffMetadataConsolidationLayerIsApprovalGrant: false,
    reviewerRoutingPerformed: false,
    reviewerAssignmentPerformed: false,
    evaluatorResultProduced: false,
    approvalDecisionProduced: false,
    approvalGrantProduced: false,
    approvalGrantPersisted: false,
    evaluatorExecuted: false,
    runtimeEffectAllFalse: true
  };
}

function reviewOnlyConsolidationCheckpointHandoffAcceptedOutput({
  accepted,
  consolidationLayers,
  reviewedAt,
  sourceDigest
}) {
  if (!accepted) {
    return {
      consolidationCheckpointHandoff: null,
      handoffMetadataConsolidationLayerSummary: null
    };
  }

  const sourceLayer = consolidationLayers[0];

  return {
    consolidationCheckpointHandoff:
      reviewOnlyConsolidationCheckpointHandoffStateFromLayer(
        sourceLayer,
        reviewedAt,
        sourceDigest
      ),
    handoffMetadataConsolidationLayerSummary:
      reviewOnlyConsolidationCheckpointHandoffSummaryFromLayer(
        sourceLayer,
        sourceDigest
      )
  };
}

function reviewOnlyConsolidationCheckpointHandoffResult({
  reviewedAt,
  reviewedAtDefaulted,
  classification,
  accepted,
  consolidationCheckpointHandoff,
  handoffMetadataConsolidationLayerSummary
}) {
  return {
    schema: REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_SCHEMA,
    schemaVersion: REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_VERSION,
    consolidationCheckpointHandoffKind:
      REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_KIND,
    consolidationCheckpointHandoffMode: "review-only",
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    sourceHandoffMetadataConsolidationLayerAccepted: accepted,
    consolidationCheckpointHandoffProduced: accepted,
    consolidationCheckpointHandoffIsReviewerRouting: false,
    consolidationCheckpointHandoffIsReviewerAssignment: false,
    consolidationCheckpointHandoffIsEvaluatorExecution: false,
    consolidationCheckpointHandoffIsEvaluatorResult: false,
    consolidationCheckpointHandoffIsApprovalDecision: false,
    consolidationCheckpointHandoffIsApprovalGrant: false,
    consolidationCheckpointHandoff,
    handoffMetadataConsolidationLayerSummary,
    cleanupHardeningToolkitEvidence:
      reviewOnlyConsolidationCheckpointHandoffCleanupEvidence(),
    reviewOnly: true,
    authoritative: false,
    reviewArtifactOnly: true,
    consolidationCheckpointHandoffMetadataOnly: true,
    reviewerRoutingPerformed: false,
    reviewerRoutingEnabled: false,
    reviewerRouteId: null,
    reviewerAssignmentPerformed: false,
    reviewerAssignmentEnabled: false,
    reviewerAssignmentId: null,
    reviewerId: null,
    evaluatorResultProduced: false,
    evaluatorResultPersisted: false,
    evaluatorResultId: null,
    approvalDecisionProduced: false,
    approvalDecisionPersisted: false,
    approvalDecisionId: null,
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
    rejectionReasons: reviewOnlyConsolidationCheckpointHandoffRejectionReasons({
      accepted,
      classification
    }),
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

export function createReviewOnlyConsolidationCheckpointHandoffForReview(
  input = {}
) {
  const inputRecord =
    reviewOnlyConsolidationCheckpointHandoffInputRecord(input);
  const reviewedAt =
    reviewOnlyConsolidationCheckpointHandoffReviewedAt(inputRecord);
  const reviewedAtDefaulted = isReviewedAtDefaulted(inputRecord);
  const consolidationLayers =
    reviewOnlyConsolidationCheckpointHandoffEntries(inputRecord);
  const sourceDigest =
    reviewOnlyConsolidationCheckpointHandoffSourceDigest(inputRecord);
  const classification =
    reviewOnlyConsolidationCheckpointHandoffInputClassification(
      inputRecord,
      consolidationLayers,
      sourceDigest
    );
  const accepted =
    classification ===
    VALID_REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_CLASSIFICATION;
  const {
    consolidationCheckpointHandoff,
    handoffMetadataConsolidationLayerSummary
  } = reviewOnlyConsolidationCheckpointHandoffAcceptedOutput({
    accepted,
    consolidationLayers,
    reviewedAt,
    sourceDigest
  });

  return reviewOnlyConsolidationCheckpointHandoffResult({
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    accepted,
    consolidationCheckpointHandoff,
    handoffMetadataConsolidationLayerSummary
  });
}

const REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_STATE_SCHEMA =
  "ardyn.phase-5.44.review-only-consolidation-metadata-checkpoint-state";
const REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_MIN_REVIEWED_AT =
  "2026-06-18T00:00:00.000Z";
const VALID_REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_CLASSIFICATION =
  "valid_review_only_consolidation_metadata_checkpoint_runtime_still_blocked";
const MALFORMED_REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_CLASSIFICATION =
  "malformed_review_only_consolidation_metadata_checkpoint_input_rejected";
const MISMATCHED_SOURCE_DIGEST_REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_CLASSIFICATION =
  "mismatched_source_digest_review_only_consolidation_metadata_checkpoint_input_rejected";

const REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_SOURCE_FIELDS =
  Object.freeze([
    "schema",
    "schemaVersion",
    "stateKind",
    "stateMode",
    "reviewedAt",
    "sourceHandoffMetadataConsolidationLayer",
    "consolidationCheckpointHandoffSummary",
    "cleanupHardeningToolkitEvidence",
    "sourceHandoffMetadataConsolidationLayerAccepted",
    "consolidationCheckpointHandoffMetadataOnly",
    "consolidationCheckpointHandoffIsReviewerRouting",
    "consolidationCheckpointHandoffIsReviewerAssignment",
    "consolidationCheckpointHandoffIsEvaluatorExecution",
    "consolidationCheckpointHandoffIsEvaluatorResult",
    "consolidationCheckpointHandoffIsApprovalDecision",
    "consolidationCheckpointHandoffIsApprovalGrant",
    "reviewerRoutingPerformed",
    "reviewerRoutingEnabled",
    "reviewerRouteId",
    "reviewerAssignmentPerformed",
    "reviewerAssignmentEnabled",
    "reviewerAssignmentId",
    "reviewerId",
    "evaluatorResultProduced",
    "evaluatorResultPersisted",
    "evaluatorResultId",
    "approvalDecisionProduced",
    "approvalDecisionPersisted",
    "approvalDecisionId",
    "approvalGrantProduced",
    "approvalGrantPersisted",
    "approvalGrantId",
    "runtimePermissionGranted",
    "commandExposurePermissionGranted",
    "runtimeCommandExposureEnabled",
    "runtimeExecutionEnabled",
    "evaluatorExecutionRequested",
    "evaluatorExecutionStarted",
    "evaluatorExecutionEnabled",
    "evaluatorExecuted",
    "runtimeEffect"
  ]);

const REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_REQUIRED_FALSE_FIELDS =
  Object.freeze([
    "consolidationCheckpointHandoffIsReviewerRouting",
    "consolidationCheckpointHandoffIsReviewerAssignment",
    "consolidationCheckpointHandoffIsEvaluatorExecution",
    "consolidationCheckpointHandoffIsEvaluatorResult",
    "consolidationCheckpointHandoffIsApprovalDecision",
    "consolidationCheckpointHandoffIsApprovalGrant",
    "reviewerRoutingPerformed",
    "reviewerRoutingEnabled",
    "reviewerAssignmentPerformed",
    "reviewerAssignmentEnabled",
    "evaluatorResultProduced",
    "evaluatorResultPersisted",
    "approvalDecisionProduced",
    "approvalDecisionPersisted",
    "approvalGrantProduced",
    "approvalGrantPersisted",
    "runtimePermissionGranted",
    "commandExposurePermissionGranted",
    "runtimeCommandExposureEnabled",
    "runtimeExecutionEnabled",
    "evaluatorExecutionRequested",
    "evaluatorExecutionStarted",
    "evaluatorExecutionEnabled",
    "evaluatorExecuted"
  ]);

const REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_REQUIRED_NULL_FIELDS =
  Object.freeze([
    "reviewerRouteId",
    "reviewerAssignmentId",
    "reviewerId",
    "evaluatorResultId",
    "approvalDecisionId",
    "approvalGrantId"
  ]);

const REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_REQUIRED_LITERAL_FIELDS =
  Object.freeze([
    ["schema", REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_STATE_SCHEMA],
    ["schemaVersion", REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_VERSION],
    ["stateKind", "review-only-consolidation-checkpoint-handoff-state"],
    ["stateMode", "review-only"],
    ["sourceHandoffMetadataConsolidationLayerAccepted", true],
    ["consolidationCheckpointHandoffMetadataOnly", true]
  ]);

const REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_REQUIRED_OBJECT_FIELDS =
  Object.freeze([
    "sourceHandoffMetadataConsolidationLayer",
    "consolidationCheckpointHandoffSummary",
    "cleanupHardeningToolkitEvidence",
    "runtimeEffect"
  ]);

const REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_SOURCE_HANDOFF_LITERAL_FIELDS =
  Object.freeze([
    ["schema", REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_STATE_SCHEMA],
    ["stateKind", "review-only-handoff-metadata-consolidation-layer-state"],
    ["stateMode", "review-only"],
    ["handoffMetadataConsolidationLayerMetadataOnly", true],
    ["runtimeEffectAllFalse", true]
  ]);

const REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_SOURCE_HANDOFF_DIGEST_FIELDS =
  Object.freeze([
    "stateDigest",
    "sourceMetadataHandoffCheckpointDigest",
    "sourceCheckpointHandoffLayerDigest",
    "sourceInspectionHandoffCheckpointDigest"
  ]);

const REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_SOURCE_HANDOFF_FALSE_FIELDS =
  Object.freeze([
    "handoffMetadataConsolidationLayerIsReviewerRouting",
    "handoffMetadataConsolidationLayerIsReviewerAssignment",
    "handoffMetadataConsolidationLayerIsEvaluatorExecution",
    "handoffMetadataConsolidationLayerIsEvaluatorResult",
    "handoffMetadataConsolidationLayerIsApprovalDecision",
    "handoffMetadataConsolidationLayerIsApprovalGrant",
    "reviewerRoutingPerformed",
    "reviewerAssignmentPerformed",
    "evaluatorResultProduced",
    "approvalDecisionProduced",
    "approvalGrantProduced",
    "approvalGrantPersisted",
    "evaluatorExecuted"
  ]);

const REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_REQUIRED_SUMMARY_FIELDS =
  Object.freeze([
    [
      "consolidationCheckpointHandoffKind",
      REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_KIND
    ],
    ["consolidationCheckpointHandoffMode", "review-only"],
    [
      "sourceHandoffMetadataConsolidationLayerClassification",
      VALID_REVIEW_ONLY_HANDOFF_METADATA_CONSOLIDATION_LAYER_CLASSIFICATION
    ],
    ["consolidationCheckpointHandoffMetadataOnly", true],
    [
      "cleanupHardeningToolkitEvidence",
      "installed-toolkit-validation-evidence-only"
    ],
    ["reviewerRoutingPerformed", false],
    ["reviewerAssignmentPerformed", false],
    ["evaluatorExecutionPerformed", false],
    ["evaluatorResultProduced", false],
    ["approvalDecisionProduced", false],
    ["approvalGrantProduced", false],
    ["runtimePermissionGranted", false],
    ["commandExposurePermissionGranted", false],
    ["evaluatorExecuted", false],
    ["runtimeEffectAllFalse", true]
  ]);

const REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_CONNECTOR_PERMISSION_KEYS =
  Object.freeze([
    "connectorPermissionGranted",
    "connectorAccessGranted",
    "connectorPermissionGrant",
    "connectorRuntimeAccessGranted",
    "permissionAwareConnectorAccessGranted"
  ]);

const REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_SAFE_NESTED_KEYS =
  new Set([
    ...REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_SOURCE_FIELDS,
    ...REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_SOURCE_HANDOFF_LITERAL_FIELDS.map(
      ([field]) => field
    ),
    ...REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_SOURCE_HANDOFF_DIGEST_FIELDS,
    ...REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_SOURCE_HANDOFF_FALSE_FIELDS,
    ...REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_REQUIRED_SUMMARY_FIELDS.map(
      ([field]) => field
    ),
    ...REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_CLEANUP_EVIDENCE_FIELDS,
    ...REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_RUNTIME_EFFECT_FIELDS
  ]);

const REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_UNKNOWN_TRUE_FIELDS =
  Object.freeze(["unknown", "sourceUnknown"]);
const REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_REVOKED_TRUE_FIELDS =
  Object.freeze(["revoked"]);
const REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_REVOKED_PRESENT_FIELDS =
  Object.freeze(["revokedAt"]);

const REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_ALLOWED_TOP_LEVEL_FIELDS =
  new Set(REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_SOURCE_FIELDS);

const REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_OBJECT_FIELD_GROUPS =
  Object.freeze({
    approvalDecision: [
      "approvalDecision",
      "approvalDecisionResult",
      "approvalDecisionGranted",
      "approvalDecisionAccepted",
      "approvalDecisionAuthorized",
      "consolidationMetadataCheckpointIsApprovalDecision"
    ],
    evaluatorResult: [
      "evaluatorResult",
      "evaluationResult",
      "evaluatorOutput",
      "evaluatorOutcome",
      "resultProduced",
      "consolidationMetadataCheckpointIsEvaluatorResult"
    ],
    reviewerRouting: [
      "reviewerRouting",
      "reviewerRoute",
      "reviewerQueue",
      "routing",
      "routingDecision",
      "routingResult",
      "routeReviewer",
      "reviewerRoutingPermissionGranted"
    ],
    reviewerAssignment: [
      "reviewerAssignment",
      "reviewerAssigned",
      "reviewerAssignee",
      "assignedReviewer",
      "assignedReviewers",
      "reviewerIds",
      "reviewerAllocation",
      "assignmentDecision",
      "humanReviewer",
      "toolReviewer",
      "reviewerAssignmentPermissionGranted"
    ]
  });

function reviewOnlyConsolidationMetadataCheckpointSourceHandoff(sourceState) {
  return isPlainObjectRecord(sourceState)
    ? sourceState.sourceHandoffMetadataConsolidationLayer
    : null;
}

function reviewOnlyConsolidationMetadataCheckpointSourceHandoffValid(
  sourceState
) {
  const sourceHandoff =
    reviewOnlyConsolidationMetadataCheckpointSourceHandoff(sourceState);
  const checks = [
    isPlainObjectRecord,
    (handoff) => isUtcIsoTimestampWithMilliseconds(handoff.reviewedAt),
    (handoff) =>
      reviewOnlyInspectionHandoffMetadataBoundaryFieldsEqual(
        handoff,
        REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_SOURCE_HANDOFF_LITERAL_FIELDS
      ),
    (handoff) =>
      REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_SOURCE_HANDOFF_DIGEST_FIELDS.every(
        (field) => reviewOnlyMetadataHandoffCheckpointDigestString(handoff[field])
      ),
    (handoff) =>
      REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_SOURCE_HANDOFF_FALSE_FIELDS.every(
        (field) => handoff[field] === false
      )
  ];

  return checks.every((predicate) => predicate(sourceHandoff));
}

const REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_MALFORMED_CHECKS =
  Object.freeze([
    (sourceState) => isPlainObjectRecord(sourceState),
    (sourceState) =>
      reviewOnlyInspectionHandoffMetadataBoundaryFieldsEqual(
        sourceState,
        REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_REQUIRED_LITERAL_FIELDS
      ),
    (sourceState) => isUtcIsoTimestampWithMilliseconds(sourceState.reviewedAt),
    (sourceState) =>
      reviewOnlyInspectionHandoffMetadataBoundaryFieldsPlainObjects(
        sourceState,
        REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_REQUIRED_OBJECT_FIELDS
      ),
    reviewOnlyConsolidationMetadataCheckpointSourceHandoffValid,
    (_sourceState, summary) => isPlainObjectRecord(summary),
    (_sourceState, summary) =>
      reviewOnlyInspectionHandoffMetadataBoundaryFieldsEqual(
        summary,
        REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_REQUIRED_SUMMARY_FIELDS
      ),
    (sourceState) =>
      REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_REQUIRED_FALSE_FIELDS.every(
        (field) => sourceState[field] === false
      ),
    (sourceState) =>
      REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_REQUIRED_NULL_FIELDS.every(
        (field) => sourceState[field] === null
      ),
    (sourceState) =>
      reviewOnlyInspectionHandoffMetadataBoundaryRuntimeEffectAllFalse(
        sourceState.runtimeEffect
      )
  ]);

function reviewOnlyConsolidationMetadataCheckpointChecksAny(
  sourceState,
  checks
) {
  return checks.some((predicate) => predicate(sourceState));
}

function reviewOnlyConsolidationMetadataCheckpointSourceKeyTruePresent(
  sourceState,
  fields
) {
  return reviewOnlyInspectionHandoffMetadataBoundaryKeyTruePresent(
    reviewOnlyConsolidationMetadataCheckpointSourceHandoff(sourceState),
    fields
  );
}

function reviewOnlyConsolidationMetadataCheckpointUnexpectedUnsafeField(
  sourceState
) {
  return (
    isPlainObjectRecord(sourceState) &&
    Object.keys(sourceState).some(
      (key) =>
        !REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_ALLOWED_TOP_LEVEL_FIELDS.has(
          key
        )
    )
  );
}

function reviewOnlyConsolidationMetadataCheckpointUnsafeNestedMetadata(
  sourceState
) {
  return reviewOnlyInspectionHandoffMetadataBoundaryKeyPresent(sourceState, [
    "consolidationMetadataCheckpoint",
    "consolidationMetadataCheckpointMetadata",
    "metadataCheckpoint",
    "checkpointMetadata",
    "consolidationMetadata",
    "consolidationCheckpointHandoffMetadata",
    "reviewerRoutingMetadata",
    "reviewerAssignmentMetadata",
    "evaluatorExecutionMetadata",
    "evaluatorResultMetadata",
    "approvalDecisionMetadata",
    "approvalGrantMetadata",
    "runtimePermissionMetadata",
    "commandExposureMetadata",
    "executionMetadata",
    ...REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_EXTERNAL_SYSTEM_KEYS
  ]) || reviewOnlyConsolidationMetadataCheckpointUnsafeRuntimeInputKey(
    sourceState
  );
}

function reviewOnlyConsolidationMetadataCheckpointUnsafeRuntimeInputKey(
  value,
  seen = new Set()
) {
  if (Array.isArray(value)) {
    return value.some((entry) =>
      reviewOnlyConsolidationMetadataCheckpointUnsafeRuntimeInputKey(entry, seen)
    );
  }

  if (!isPlainObjectRecord(value) || seen.has(value)) {
    return false;
  }

  seen.add(value);

  return Object.entries(value).some(
    ([key, entry]) =>
      (APPROVAL_EVALUATOR_CANDIDATE_UNSAFE_TRUE_FIELD_PATTERN.test(key) &&
        !REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_SAFE_NESTED_KEYS.has(
          key
        )) ||
      reviewOnlyConsolidationMetadataCheckpointUnsafeRuntimeInputKey(entry, seen)
  );
}

function reviewOnlyConsolidationMetadataCheckpointContainsArray(value) {
  if (Array.isArray(value)) {
    return true;
  }

  if (!isPlainObjectRecord(value)) {
    return false;
  }

  return Object.values(value).some((entry) =>
    reviewOnlyConsolidationMetadataCheckpointContainsArray(entry)
  );
}

function reviewOnlyConsolidationMetadataCheckpointUnknown(sourceState) {
  return reviewOnlyConsolidationMetadataCheckpointChecksAny(sourceState, [
    (state) =>
      reviewOnlyInspectionHandoffMetadataBoundaryAnyFieldTrue(
        state,
        REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_UNKNOWN_TRUE_FIELDS
      ),
    (state) =>
      ["classification", "status"].some((field) => state[field] === "unknown")
  ]);
}

function reviewOnlyConsolidationMetadataCheckpointRevoked(sourceState) {
  return reviewOnlyConsolidationMetadataCheckpointChecksAny(sourceState, [
    (state) =>
      reviewOnlyInspectionHandoffMetadataBoundaryAnyFieldTrue(
        state,
        REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_REVOKED_TRUE_FIELDS
      ),
    (state) =>
      reviewOnlyInspectionHandoffMetadataBoundaryAnyFieldPresent(
        state,
        REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_REVOKED_PRESENT_FIELDS
      ),
    (state) =>
      ["classification", "status"].some((field) => state[field] === "revoked")
  ]);
}

function reviewOnlyConsolidationMetadataCheckpointStale(sourceState) {
  return (
    isPlainObjectRecord(sourceState) &&
    isUtcIsoTimestampWithMilliseconds(sourceState.reviewedAt) &&
    sourceState.reviewedAt <
      REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_MIN_REVIEWED_AT
  );
}

function reviewOnlyConsolidationMetadataCheckpointMalformed(sourceState) {
  const summary = isPlainObjectRecord(sourceState)
    ? sourceState.consolidationCheckpointHandoffSummary
    : null;

  return !REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_MALFORMED_CHECKS.every(
    (predicate) => predicate(sourceState, summary)
  );
}

function reviewOnlyConsolidationMetadataCheckpointApprovalDecisionLooking(
  sourceState
) {
  return reviewOnlyConsolidationMetadataCheckpointChecksAny(sourceState, [
    (state) =>
      reviewOnlyInspectionHandoffMetadataBoundaryAnyFieldNotEqual(
        state,
        ["approvalDecisionProduced", "approvalDecisionPersisted"],
        false
      ),
    (state) =>
      reviewOnlyInspectionHandoffMetadataBoundaryAnyFieldNotEqual(
        state,
        ["approvalDecisionId"],
        null
      ),
    (state) =>
      reviewOnlyConsolidationMetadataCheckpointSourceKeyTruePresent(state, [
        "approvalDecisionProduced",
        "approvalDecisionPersisted"
      ]),
    (state) =>
      reviewOnlyInspectionHandoffMetadataBoundaryKeyTruePresent(
        state,
        REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_OBJECT_FIELD_GROUPS
          .approvalDecision
      )
  ]);
}

function reviewOnlyConsolidationMetadataCheckpointApprovalGrantLooking(
  sourceState
) {
  return reviewOnlyConsolidationMetadataCheckpointChecksAny(sourceState, [
    (state) =>
      reviewOnlyInspectionHandoffMetadataBoundaryAnyFieldNotEqual(
        state,
        ["approvalGrantProduced", "approvalGrantPersisted"],
        false
      ),
    (state) =>
      reviewOnlyInspectionHandoffMetadataBoundaryAnyFieldNotEqual(
        state,
        ["approvalGrantId"],
        null
      ),
    (state) =>
      reviewOnlyConsolidationMetadataCheckpointSourceKeyTruePresent(state, [
        "approvalGrantProduced",
        "approvalGrantPersisted"
      ])
  ]);
}

function reviewOnlyConsolidationMetadataCheckpointEvaluatorResultLooking(
  sourceState
) {
  return reviewOnlyConsolidationMetadataCheckpointChecksAny(sourceState, [
    (state) =>
      reviewOnlyInspectionHandoffMetadataBoundaryAnyFieldNotEqual(
        state,
        ["evaluatorResultProduced", "evaluatorResultPersisted"],
        false
      ),
    (state) =>
      reviewOnlyInspectionHandoffMetadataBoundaryAnyFieldNotEqual(
        state,
        ["evaluatorResultId"],
        null
      ),
    (state) =>
      reviewOnlyConsolidationMetadataCheckpointSourceKeyTruePresent(state, [
        "evaluatorResultProduced"
      ]),
    (state) =>
      reviewOnlyInspectionHandoffMetadataBoundaryKeyTruePresent(
        state,
        REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_OBJECT_FIELD_GROUPS
          .evaluatorResult
      )
  ]);
}

function reviewOnlyConsolidationMetadataCheckpointEvaluatorExecutionLooking(
  sourceState
) {
  return reviewOnlyConsolidationMetadataCheckpointChecksAny(sourceState, [
    (state) =>
      reviewOnlyInspectionHandoffMetadataBoundaryAnyFieldNotEqual(
        state,
        [
          "evaluatorExecutionRequested",
          "evaluatorExecutionStarted",
          "evaluatorExecutionEnabled",
          "evaluatorExecuted"
        ],
        false
      ),
    (state) =>
      reviewOnlyConsolidationMetadataCheckpointSourceKeyTruePresent(state, [
        "evaluatorExecutionRequested",
        "evaluatorExecutionStarted",
        "evaluatorExecutionEnabled",
        "evaluatorExecuted"
      ])
  ]);
}

function reviewOnlyConsolidationMetadataCheckpointReviewerRoutingLooking(
  sourceState
) {
  return reviewOnlyConsolidationMetadataCheckpointChecksAny(sourceState, [
    (state) =>
      reviewOnlyInspectionHandoffMetadataBoundaryAnyFieldNotEqual(
        state,
        ["reviewerRoutingPerformed", "reviewerRoutingEnabled"],
        false
      ),
    (state) =>
      reviewOnlyInspectionHandoffMetadataBoundaryAnyFieldNotEqual(
        state,
        ["reviewerRouteId"],
        null
      ),
    (state) =>
      reviewOnlyConsolidationMetadataCheckpointSourceKeyTruePresent(state, [
        "reviewerRoutingPerformed"
      ]),
    (state) =>
      reviewOnlyInspectionHandoffMetadataBoundaryKeyPresent(
        state,
        REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_OBJECT_FIELD_GROUPS
          .reviewerRouting
      )
  ]);
}

function reviewOnlyConsolidationMetadataCheckpointReviewerAssignmentLooking(
  sourceState
) {
  return reviewOnlyConsolidationMetadataCheckpointChecksAny(sourceState, [
    (state) =>
      reviewOnlyInspectionHandoffMetadataBoundaryAnyFieldNotEqual(
        state,
        ["reviewerAssignmentPerformed", "reviewerAssignmentEnabled"],
        false
      ),
    (state) =>
      reviewOnlyInspectionHandoffMetadataBoundaryAnyFieldNotEqual(
        state,
        ["reviewerAssignmentId", "reviewerId"],
        null
      ),
    (state) =>
      reviewOnlyConsolidationMetadataCheckpointSourceKeyTruePresent(state, [
        "reviewerAssignmentPerformed"
      ]),
    (state) =>
      reviewOnlyInspectionHandoffMetadataBoundaryKeyPresent(
        state,
        REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_OBJECT_FIELD_GROUPS
          .reviewerAssignment
      )
  ]);
}

function reviewOnlyConsolidationMetadataCheckpointRuntimePermissionLooking(
  sourceState
) {
  return reviewOnlyInspectionHandoffMetadataBoundaryKeyTruePresent(sourceState, [
    "runtimePermission",
    "runtimePermissionGranted",
    "canEnableRuntime"
  ]);
}

function reviewOnlyConsolidationMetadataCheckpointCommandExposureLooking(
  sourceState
) {
  return reviewOnlyConsolidationMetadataCheckpointChecksAny(sourceState, [
    (state) =>
      reviewOnlyInspectionHandoffMetadataBoundaryKeyTruePresent(state, [
        "commandExposure",
        "commandExposurePermissionGranted",
        "runtimeCommandEnabled",
        "runtimeCommandExposureEnabled"
      ]),
    (state) =>
      reviewOnlyConsolidationMetadataCheckpointSourceKeyTruePresent(state, [
        "commandExposurePermissionGranted",
        "runtimeCommandExposureEnabled",
        "runtimeCommandEnabled"
      ])
  ]);
}

function reviewOnlyConsolidationMetadataCheckpointRuntimeEffectTrue(
  sourceState
) {
  const sourceHandoff =
    reviewOnlyConsolidationMetadataCheckpointSourceHandoff(sourceState);

  return reviewOnlyConsolidationMetadataCheckpointChecksAny(sourceState, [
    (state) =>
      !reviewOnlyInspectionHandoffMetadataBoundaryRuntimeEffectAllFalse(
        state.runtimeEffect
      ),
    (state) =>
      reviewOnlyInspectionHandoffMetadataBoundaryKeyTruePresent(state, [
        "runtimeEnabled",
        "runtimeStarted",
        "runtimeReady",
        "runtimeExecutionEnabled",
        "runtimeExecuted"
      ]),
    () =>
      isPlainObjectRecord(sourceHandoff) &&
      Object.prototype.hasOwnProperty.call(sourceHandoff, "runtimeEffectAllFalse") &&
      sourceHandoff.runtimeEffectAllFalse !== true
  ]);
}

function reviewOnlyConsolidationMetadataCheckpointProcessFlagTrue(sourceState) {
  return reviewOnlyInspectionHandoffMetadataBoundaryKeyTruePresent(sourceState, [
    "processSpawned",
    "processSpawning",
    "processControlEnabled",
    "processControlPerformed",
    "processTerminationEnabled",
    "runtimeSupervisionEnabled",
    "stdinLoopEnabled",
    "stdoutRuntimeWriterEnabled",
    "stderrRuntimeWriterEnabled"
  ]);
}

function reviewOnlyConsolidationMetadataCheckpointExecutionSignalLooking(
  sourceState
) {
  return reviewOnlyInspectionHandoffMetadataBoundaryKeyTruePresent(sourceState, [
    "executionSignal",
    "executionRequested",
    "executionStarted",
    "runtimeExecutionSignal",
    "approvalEvaluatorAuthoritative"
  ]);
}

function reviewOnlyConsolidationMetadataCheckpointConnectorPermissionLooking(
  sourceState
) {
  return reviewOnlyInspectionHandoffMetadataBoundaryKeyTruePresent(
    sourceState,
    REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_CONNECTOR_PERMISSION_KEYS
  );
}

function reviewOnlyConsolidationMetadataCheckpointAuthorizing(sourceState) {
  return reviewOnlyInspectionHandoffMetadataBoundaryKeyTruePresent(sourceState, [
    "authoritative",
    "authorizing",
    "authorized",
    "authorizationGranted",
    "approvalAuthorized",
    "canApproveRuntime",
    "canGrantRuntime"
  ]);
}

const REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_SINGLE_REJECTION_CHECKS =
  Object.freeze([
    [
      "unknown_review_only_consolidation_metadata_checkpoint_input_rejected",
      reviewOnlyConsolidationMetadataCheckpointUnknown
    ],
    [
      "revoked_review_only_consolidation_metadata_checkpoint_input_rejected",
      reviewOnlyConsolidationMetadataCheckpointRevoked
    ],
    [
      "stale_review_only_consolidation_metadata_checkpoint_input_rejected",
      reviewOnlyConsolidationMetadataCheckpointStale
    ],
    [
      "approval_decision_looking_review_only_consolidation_metadata_checkpoint_input_rejected",
      reviewOnlyConsolidationMetadataCheckpointApprovalDecisionLooking
    ],
    [
      "reviewer_routing_looking_review_only_consolidation_metadata_checkpoint_input_rejected",
      reviewOnlyConsolidationMetadataCheckpointReviewerRoutingLooking
    ],
    [
      "reviewer_assignment_looking_review_only_consolidation_metadata_checkpoint_input_rejected",
      reviewOnlyConsolidationMetadataCheckpointReviewerAssignmentLooking
    ],
    [
      "unsafe_review_only_consolidation_metadata_checkpoint_input_rejected",
      reviewOnlyConsolidationMetadataCheckpointUnexpectedUnsafeField
    ],
    [
      "unsafe_review_only_consolidation_metadata_checkpoint_input_rejected",
      reviewOnlyConsolidationMetadataCheckpointUnsafeNestedMetadata
    ],
    [
      MALFORMED_REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_CLASSIFICATION,
      reviewOnlyConsolidationMetadataCheckpointContainsArray
    ],
    [
      "approval_grant_looking_review_only_consolidation_metadata_checkpoint_input_rejected",
      reviewOnlyConsolidationMetadataCheckpointApprovalGrantLooking
    ],
    [
      "grant_looking_review_only_consolidation_metadata_checkpoint_input_rejected",
      reviewOnlyConsolidationMetadataCheckpointConnectorPermissionLooking
    ],
    [
      "grant_looking_review_only_consolidation_metadata_checkpoint_input_rejected",
      reviewOnlyInspectionHandoffMetadataBoundaryGrantLooking
    ],
    [
      "evaluator_result_looking_review_only_consolidation_metadata_checkpoint_input_rejected",
      reviewOnlyConsolidationMetadataCheckpointEvaluatorResultLooking
    ],
    [
      "evaluator_execution_looking_review_only_consolidation_metadata_checkpoint_input_rejected",
      reviewOnlyConsolidationMetadataCheckpointEvaluatorExecutionLooking
    ],
    [
      "runtime_permission_looking_review_only_consolidation_metadata_checkpoint_input_rejected",
      reviewOnlyConsolidationMetadataCheckpointRuntimePermissionLooking
    ],
    [
      "command_exposure_looking_review_only_consolidation_metadata_checkpoint_input_rejected",
      reviewOnlyConsolidationMetadataCheckpointCommandExposureLooking
    ],
    [
      "runtime_effect_true_review_only_consolidation_metadata_checkpoint_input_rejected",
      reviewOnlyConsolidationMetadataCheckpointRuntimeEffectTrue
    ],
    [
      "process_flag_true_review_only_consolidation_metadata_checkpoint_input_rejected",
      reviewOnlyConsolidationMetadataCheckpointProcessFlagTrue
    ],
    [
      "execution_signal_looking_review_only_consolidation_metadata_checkpoint_input_rejected",
      reviewOnlyConsolidationMetadataCheckpointExecutionSignalLooking
    ],
    [
      "authorizing_review_only_consolidation_metadata_checkpoint_input_rejected",
      reviewOnlyConsolidationMetadataCheckpointAuthorizing
    ],
    [
      MALFORMED_REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_CLASSIFICATION,
      reviewOnlyConsolidationMetadataCheckpointMalformed
    ]
  ]);

function reviewOnlyConsolidationMetadataCheckpointSingleClassification(
  sourceState
) {
  const rejection =
    REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_SINGLE_REJECTION_CHECKS.find(
      ([, predicate]) => predicate(sourceState)
    );

  return (
    rejection?.[0] ??
    VALID_REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_CLASSIFICATION
  );
}

function reviewOnlyConsolidationMetadataCheckpointInputsContainDuplicate(
  sourceStates
) {
  const digests = sourceStates
    .filter(isPlainObjectRecord)
    .map((entry) => reviewArtifactHandoffDigest(entry));
  return new Set(digests).size !== digests.length;
}

function reviewOnlyConsolidationMetadataCheckpointMultiInputClassification(
  sourceStates
) {
  return reviewOnlyConsolidationMetadataCheckpointInputsContainDuplicate(
    sourceStates
  )
    ? "duplicate_invalid_review_only_consolidation_metadata_checkpoint_input_rejected"
    : "conflicting_review_only_consolidation_metadata_checkpoint_input_rejected";
}

function reviewOnlyConsolidationMetadataCheckpointDigestMissing(inputRecord) {
  return (
    inputRecord === null ||
    !Object.prototype.hasOwnProperty.call(
      inputRecord,
      "sourceConsolidationCheckpointHandoffDigest"
    )
  );
}

function reviewOnlyConsolidationMetadataCheckpointSourceDigest(inputRecord) {
  return inputRecord === null
    ? undefined
    : inputRecord.sourceConsolidationCheckpointHandoffDigest;
}

function reviewOnlyConsolidationMetadataCheckpointSourceDigestMatches(
  sourceStates,
  sourceDigest
) {
  return (
    Array.isArray(sourceStates) &&
    sourceStates.length === 1 &&
    isPlainObjectRecord(sourceStates[0]) &&
    sourceDigest === reviewArtifactHandoffDigest(sourceStates[0])
  );
}

const REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_INPUT_REJECTIONS =
  Object.freeze([
    [
      (sourceStates) => sourceStates === undefined,
      () =>
        "missing_review_only_consolidation_metadata_checkpoint_input_rejected"
    ],
    [
      (sourceStates) => !Array.isArray(sourceStates),
      () => MALFORMED_REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_CLASSIFICATION
    ],
    [
      (sourceStates) => sourceStates.length === 0,
      () => "empty_review_only_consolidation_metadata_checkpoint_input_rejected"
    ],
    [
      (sourceStates) => sourceStates.some((entry) => !isPlainObjectRecord(entry)),
      () => MALFORMED_REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_CLASSIFICATION
    ],
    [
      (sourceStates) => sourceStates.length > 1,
      reviewOnlyConsolidationMetadataCheckpointMultiInputClassification
    ]
  ]);

function reviewOnlyConsolidationMetadataCheckpointInputRejection(sourceStates) {
  const rejection =
    REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_INPUT_REJECTIONS.find(
      ([predicate]) => predicate(sourceStates)
    );
  return rejection?.[1](sourceStates);
}

function reviewOnlyConsolidationMetadataCheckpointDigestRejection(
  inputRecord,
  sourceDigest
) {
  return reviewOnlyConsolidationMetadataCheckpointDigestMissing(inputRecord) ||
    !reviewOnlyMetadataHandoffCheckpointDigestString(sourceDigest)
    ? MALFORMED_REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_CLASSIFICATION
    : undefined;
}

function reviewOnlyConsolidationMetadataCheckpointMismatchRejection(
  sourceStates,
  sourceDigest
) {
  return reviewOnlyConsolidationMetadataCheckpointSourceDigestMatches(
    sourceStates,
    sourceDigest
  )
    ? undefined
    : MISMATCHED_SOURCE_DIGEST_REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_CLASSIFICATION;
}

function reviewOnlyConsolidationMetadataCheckpointClassification({
  inputRecord,
  sourceStates,
  sourceDigest
}) {
  const inputRejection =
    reviewOnlyConsolidationMetadataCheckpointInputRejection(sourceStates);

  if (inputRejection !== undefined) {
    return inputRejection;
  }

  const digestRejection = reviewOnlyConsolidationMetadataCheckpointDigestRejection(
    inputRecord,
    sourceDigest
  );

  if (digestRejection !== undefined) {
    return digestRejection;
  }

  const mismatchRejection =
    reviewOnlyConsolidationMetadataCheckpointMismatchRejection(
      sourceStates,
      sourceDigest
    );

  if (mismatchRejection !== undefined) {
    return mismatchRejection;
  }

  return reviewOnlyConsolidationMetadataCheckpointSingleClassification(
    sourceStates[0]
  );
}

function reviewOnlyConsolidationMetadataCheckpointSummary() {
  return {
    consolidationMetadataCheckpointKind:
      REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_KIND,
    consolidationMetadataCheckpointMode: "review-only",
    sourceConsolidationCheckpointHandoffClassification:
      VALID_REVIEW_ONLY_CONSOLIDATION_CHECKPOINT_HANDOFF_CLASSIFICATION,
    consolidationMetadataCheckpointMetadataOnly: true,
    cleanupHardeningToolkitEvidence:
      "installed-toolkit-validation-evidence-only",
    reviewerRoutingPerformed: false,
    reviewerAssignmentPerformed: false,
    evaluatorExecutionPerformed: false,
    evaluatorResultProduced: false,
    approvalDecisionProduced: false,
    approvalGrantProduced: false,
    runtimePermissionGranted: false,
    commandExposurePermissionGranted: false,
    evaluatorExecuted: false,
    runtimeEffectAllFalse: true
  };
}

function reviewOnlyConsolidationMetadataCheckpointCleanupEvidence() {
  return {
    phase: "phase-5.44-review-only-consolidation-metadata-checkpoint",
    evidenceMode: "installed-cleanup-hardening-toolkit-validation-only",
    npmAuditRequired: true,
    cargoAuditRequired: true,
    cargoMacheteRequired: true,
    fallowStaticRequired: true,
    optionalAdvisoryChecksAllowed: true,
    megaLinterRun: false,
    broadTrunkRewriteRun: false,
    toolsInstalledByPhase544: false,
    fallowRuntimeUsed: false,
    runtimeExecutionEnabled: false,
    commandExposurePermissionGranted: false
  };
}

function reviewOnlyConsolidationMetadataCheckpointStateFromSource(
  sourceState,
  reviewedAt,
  sourceDigest
) {
  return {
    schema: REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_STATE_SCHEMA,
    schemaVersion: REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_VERSION,
    stateKind: "review-only-consolidation-metadata-checkpoint-state",
    stateMode: "review-only",
    reviewedAt,
    sourceConsolidationCheckpointHandoff: {
      schema: sourceState.schema,
      stateKind: sourceState.stateKind,
      stateMode: sourceState.stateMode,
      reviewedAt: sourceState.reviewedAt,
      stateDigest: sourceDigest,
      sourceHandoffMetadataConsolidationLayerDigest:
        sourceState.sourceHandoffMetadataConsolidationLayer.stateDigest,
      sourceMetadataHandoffCheckpointDigest:
        sourceState.sourceHandoffMetadataConsolidationLayer
          .sourceMetadataHandoffCheckpointDigest,
      sourceCheckpointHandoffLayerDigest:
        sourceState.sourceHandoffMetadataConsolidationLayer
          .sourceCheckpointHandoffLayerDigest,
      sourceInspectionHandoffCheckpointDigest:
        sourceState.sourceHandoffMetadataConsolidationLayer
          .sourceInspectionHandoffCheckpointDigest,
      consolidationCheckpointHandoffMetadataOnly: true,
      consolidationCheckpointHandoffIsReviewerRouting: false,
      consolidationCheckpointHandoffIsReviewerAssignment: false,
      consolidationCheckpointHandoffIsEvaluatorExecution: false,
      consolidationCheckpointHandoffIsEvaluatorResult: false,
      consolidationCheckpointHandoffIsApprovalDecision: false,
      consolidationCheckpointHandoffIsApprovalGrant: false,
      reviewerRoutingPerformed: false,
      reviewerAssignmentPerformed: false,
      evaluatorResultProduced: false,
      approvalDecisionProduced: false,
      approvalGrantProduced: false,
      approvalGrantPersisted: false,
      evaluatorExecuted: false,
      runtimeEffectAllFalse: true
    },
    consolidationMetadataCheckpointSummary:
      reviewOnlyConsolidationMetadataCheckpointSummary(),
    cleanupHardeningToolkitEvidence:
      reviewOnlyConsolidationMetadataCheckpointCleanupEvidence(),
    sourceConsolidationCheckpointHandoffAccepted: true,
    consolidationMetadataCheckpointMetadataOnly: true,
    consolidationMetadataCheckpointIsReviewerRouting: false,
    consolidationMetadataCheckpointIsReviewerAssignment: false,
    consolidationMetadataCheckpointIsEvaluatorExecution: false,
    consolidationMetadataCheckpointIsEvaluatorResult: false,
    consolidationMetadataCheckpointIsApprovalDecision: false,
    consolidationMetadataCheckpointIsApprovalGrant: false,
    reviewerRoutingPerformed: false,
    reviewerRoutingEnabled: false,
    reviewerRouteId: null,
    reviewerAssignmentPerformed: false,
    reviewerAssignmentEnabled: false,
    reviewerAssignmentId: null,
    reviewerId: null,
    evaluatorResultProduced: false,
    evaluatorResultPersisted: false,
    evaluatorResultId: null,
    approvalDecisionProduced: false,
    approvalDecisionPersisted: false,
    approvalDecisionId: null,
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

function reviewOnlyConsolidationMetadataCheckpointRejectionReasons({
  accepted,
  classification
}) {
  if (accepted) {
    return [
      "consolidation_metadata_checkpoint_is_review_only",
      "reviewer_routing_not_implemented",
      "reviewer_assignment_not_implemented",
      "evaluator_execution_not_implemented",
      "evaluator_result_not_implemented",
      "approval_decision_not_implemented",
      "approval_grant_not_implemented",
      "installed_cleanup_hardening_toolkit_evidence_only",
      "runtime_enablement_still_blocked"
    ];
  }

  return [
    classification,
    "consolidation_metadata_checkpoint_not_produced",
    "reviewer_routing_not_implemented",
    "reviewer_assignment_not_implemented",
    "evaluator_execution_not_implemented",
    "evaluator_result_not_implemented",
    "approval_decision_not_implemented",
    "approval_grant_not_implemented",
    "runtime_enablement_still_blocked"
  ];
}

function reviewOnlyConsolidationMetadataCheckpointInputRecord(input) {
  return isPlainObjectRecord(input) ? input : null;
}

function reviewOnlyConsolidationMetadataCheckpointReviewedAt(inputRecord) {
  if (
    inputRecord === null ||
    !Object.prototype.hasOwnProperty.call(inputRecord, "reviewedAt")
  ) {
    return APPROVAL_PREREQUISITE_SOURCE_PREFLIGHT_DEFAULT_REVIEWED_AT;
  }

  return isUtcIsoTimestampWithMilliseconds(inputRecord.reviewedAt)
    ? inputRecord.reviewedAt
    : APPROVAL_PREREQUISITE_SOURCE_PREFLIGHT_DEFAULT_REVIEWED_AT;
}

function reviewOnlyConsolidationMetadataCheckpointInputMalformed(inputRecord) {
  return (
    inputRecord === null ||
    (Object.prototype.hasOwnProperty.call(inputRecord, "reviewedAt") &&
      !isUtcIsoTimestampWithMilliseconds(inputRecord.reviewedAt))
  );
}

function reviewOnlyConsolidationMetadataCheckpointEntries(inputRecord) {
  return inputRecord === null
    ? undefined
    : inputRecord.consolidationCheckpointHandoffEntries;
}

function reviewOnlyConsolidationMetadataCheckpointInputClassification(
  inputRecord,
  sourceStates,
  sourceDigest
) {
  return reviewOnlyConsolidationMetadataCheckpointInputMalformed(inputRecord)
    ? MALFORMED_REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_CLASSIFICATION
    : reviewOnlyConsolidationMetadataCheckpointClassification({
        inputRecord,
        sourceStates,
        sourceDigest
      });
}

function reviewOnlyConsolidationMetadataCheckpointSummaryFromSource(
  sourceState,
  sourceDigest
) {
  return {
    schema: sourceState.schema,
    stateKind: sourceState.stateKind,
    stateMode: sourceState.stateMode,
    reviewedAt: sourceState.reviewedAt,
    stateDigest: sourceDigest,
    consolidationCheckpointHandoffMetadataOnly: true,
    consolidationCheckpointHandoffIsReviewerRouting: false,
    consolidationCheckpointHandoffIsReviewerAssignment: false,
    consolidationCheckpointHandoffIsEvaluatorExecution: false,
    consolidationCheckpointHandoffIsEvaluatorResult: false,
    consolidationCheckpointHandoffIsApprovalDecision: false,
    consolidationCheckpointHandoffIsApprovalGrant: false,
    reviewerRoutingPerformed: false,
    reviewerAssignmentPerformed: false,
    evaluatorResultProduced: false,
    approvalDecisionProduced: false,
    approvalGrantProduced: false,
    approvalGrantPersisted: false,
    evaluatorExecuted: false,
    runtimeEffectAllFalse: true
  };
}

function reviewOnlyConsolidationMetadataCheckpointAcceptedOutput({
  accepted,
  sourceStates,
  reviewedAt,
  sourceDigest
}) {
  if (!accepted) {
    return {
      consolidationMetadataCheckpoint: null,
      consolidationCheckpointHandoffSummary: null
    };
  }

  const sourceState = sourceStates[0];

  return {
    consolidationMetadataCheckpoint:
      reviewOnlyConsolidationMetadataCheckpointStateFromSource(
        sourceState,
        reviewedAt,
        sourceDigest
      ),
    consolidationCheckpointHandoffSummary:
      reviewOnlyConsolidationMetadataCheckpointSummaryFromSource(
        sourceState,
        sourceDigest
      )
  };
}

function reviewOnlyConsolidationMetadataCheckpointResult({
  reviewedAt,
  reviewedAtDefaulted,
  classification,
  accepted,
  consolidationMetadataCheckpoint,
  consolidationCheckpointHandoffSummary
}) {
  return {
    schema: REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_SCHEMA,
    schemaVersion: REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_VERSION,
    consolidationMetadataCheckpointKind:
      REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_KIND,
    consolidationMetadataCheckpointMode: "review-only",
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    sourceConsolidationCheckpointHandoffAccepted: accepted,
    consolidationMetadataCheckpointProduced: accepted,
    consolidationMetadataCheckpointIsReviewerRouting: false,
    consolidationMetadataCheckpointIsReviewerAssignment: false,
    consolidationMetadataCheckpointIsEvaluatorExecution: false,
    consolidationMetadataCheckpointIsEvaluatorResult: false,
    consolidationMetadataCheckpointIsApprovalDecision: false,
    consolidationMetadataCheckpointIsApprovalGrant: false,
    consolidationMetadataCheckpoint,
    consolidationCheckpointHandoffSummary,
    cleanupHardeningToolkitEvidence:
      reviewOnlyConsolidationMetadataCheckpointCleanupEvidence(),
    reviewOnly: true,
    authoritative: false,
    reviewArtifactOnly: true,
    consolidationMetadataCheckpointMetadataOnly: true,
    reviewerRoutingPerformed: false,
    reviewerRoutingEnabled: false,
    reviewerRouteId: null,
    reviewerAssignmentPerformed: false,
    reviewerAssignmentEnabled: false,
    reviewerAssignmentId: null,
    reviewerId: null,
    evaluatorResultProduced: false,
    evaluatorResultPersisted: false,
    evaluatorResultId: null,
    approvalDecisionProduced: false,
    approvalDecisionPersisted: false,
    approvalDecisionId: null,
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
    rejectionReasons:
      reviewOnlyConsolidationMetadataCheckpointRejectionReasons({
        accepted,
        classification
      }),
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

export function createReviewOnlyConsolidationMetadataCheckpointForReview(
  input = {}
) {
  const inputRecord =
    reviewOnlyConsolidationMetadataCheckpointInputRecord(input);
  const reviewedAt =
    reviewOnlyConsolidationMetadataCheckpointReviewedAt(inputRecord);
  const reviewedAtDefaulted = isReviewedAtDefaulted(inputRecord);
  const sourceStates =
    reviewOnlyConsolidationMetadataCheckpointEntries(inputRecord);
  const sourceDigest =
    reviewOnlyConsolidationMetadataCheckpointSourceDigest(inputRecord);
  const classification =
    reviewOnlyConsolidationMetadataCheckpointInputClassification(
      inputRecord,
      sourceStates,
      sourceDigest
    );
  const accepted =
    classification ===
    VALID_REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_CLASSIFICATION;
  const {
    consolidationMetadataCheckpoint,
    consolidationCheckpointHandoffSummary
  } = reviewOnlyConsolidationMetadataCheckpointAcceptedOutput({
    accepted,
    sourceStates,
    reviewedAt,
    sourceDigest
  });

  return reviewOnlyConsolidationMetadataCheckpointResult({
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    accepted,
    consolidationMetadataCheckpoint,
    consolidationCheckpointHandoffSummary
  });
}

const TARGET_CONSUMER_PLANNING_METADATA_STATE_SCHEMA =
  "ardyn.phase-5.45.target-consumer-planning-metadata-state";
const VALID_TARGET_CONSUMER_PLANNING_METADATA_CLASSIFICATION =
  "valid_target_consumer_planning_metadata_runtime_still_blocked";
const MALFORMED_TARGET_CONSUMER_PLANNING_METADATA_CLASSIFICATION =
  "malformed_target_consumer_planning_metadata_input_rejected";
const MISMATCHED_SOURCE_DIGEST_TARGET_CONSUMER_PLANNING_METADATA_CLASSIFICATION =
  "mismatched_source_digest_target_consumer_planning_metadata_input_rejected";

const TARGET_CONSUMER_PLANNING_METADATA_SOURCE_LITERAL_FIELDS = Object.freeze([
  ["schema", REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_STATE_SCHEMA],
  ["schemaVersion", REVIEW_ONLY_CONSOLIDATION_METADATA_CHECKPOINT_VERSION],
  ["stateKind", "review-only-consolidation-metadata-checkpoint-state"],
  ["stateMode", "review-only"],
  ["sourceConsolidationCheckpointHandoffAccepted", true],
  ["consolidationMetadataCheckpointMetadataOnly", true]
]);

const TARGET_CONSUMER_PLANNING_METADATA_SOURCE_FALSE_FIELDS = Object.freeze([
  "consolidationMetadataCheckpointIsReviewerRouting",
  "consolidationMetadataCheckpointIsReviewerAssignment",
  "consolidationMetadataCheckpointIsEvaluatorExecution",
  "consolidationMetadataCheckpointIsEvaluatorResult",
  "consolidationMetadataCheckpointIsApprovalDecision",
  "consolidationMetadataCheckpointIsApprovalGrant",
  "reviewerRoutingPerformed",
  "reviewerRoutingEnabled",
  "reviewerAssignmentPerformed",
  "reviewerAssignmentEnabled",
  "evaluatorResultProduced",
  "evaluatorResultPersisted",
  "approvalDecisionProduced",
  "approvalDecisionPersisted",
  "approvalGrantProduced",
  "approvalGrantPersisted",
  "runtimePermissionGranted",
  "commandExposurePermissionGranted",
  "runtimeCommandExposureEnabled",
  "runtimeExecutionEnabled",
  "evaluatorExecutionRequested",
  "evaluatorExecutionStarted",
  "evaluatorExecutionEnabled",
  "evaluatorExecuted"
]);

const TARGET_CONSUMER_PLANNING_METADATA_SOURCE_NULL_FIELDS = Object.freeze([
  "reviewerRouteId",
  "reviewerAssignmentId",
  "reviewerId",
  "evaluatorResultId",
  "approvalDecisionId",
  "approvalGrantId"
]);

const TARGET_CONSUMER_PLANNING_METADATA_REVIEWER_ROUTING_TRUE_FIELDS =
  Object.freeze([
    "targetConsumerPlanningMetadataIsReviewerRouting",
    "reviewerRoutingPerformed",
    "reviewerRoutingEnabled"
  ]);
const TARGET_CONSUMER_PLANNING_METADATA_REVIEWER_ASSIGNMENT_TRUE_FIELDS =
  Object.freeze([
    "targetConsumerPlanningMetadataIsReviewerAssignment",
    "reviewerAssignmentPerformed",
    "reviewerAssignmentEnabled"
  ]);
const TARGET_CONSUMER_PLANNING_METADATA_EVALUATOR_EXECUTION_TRUE_FIELDS =
  Object.freeze([
    "targetConsumerPlanningMetadataIsEvaluatorExecution",
    "evaluatorExecutionPerformed",
    "evaluatorExecutionRequested",
    "evaluatorExecutionStarted",
    "evaluatorExecutionEnabled",
    "evaluatorExecuted"
  ]);
const TARGET_CONSUMER_PLANNING_METADATA_EVALUATOR_RESULT_TRUE_FIELDS =
  Object.freeze([
    "targetConsumerPlanningMetadataIsEvaluatorResult",
    "evaluatorResultProduced",
    "evaluatorResultPersisted"
  ]);
const TARGET_CONSUMER_PLANNING_METADATA_APPROVAL_DECISION_TRUE_FIELDS =
  Object.freeze([
    "targetConsumerPlanningMetadataIsApprovalDecision",
    "approvalDecisionProduced",
    "approvalDecisionPersisted"
  ]);
const TARGET_CONSUMER_PLANNING_METADATA_GRANT_TRUE_FIELDS = Object.freeze([
  "targetConsumerPlanningMetadataIsApprovalGrant",
  "approvalGrantProduced",
  "approvalGrantPersisted",
  "connectorGrantProduced",
  "connectorPermissionGranted",
  "connectorAccessGranted"
]);
const TARGET_CONSUMER_PLANNING_METADATA_RUNTIME_PERMISSION_TRUE_FIELDS =
  Object.freeze([
    "runtimePermissionGranted",
    "runtimeEnablementApproved",
    "canEnableRuntime"
  ]);
const TARGET_CONSUMER_PLANNING_METADATA_COMMAND_EXPOSURE_TRUE_FIELDS =
  Object.freeze([
    "commandExposurePermissionGranted",
    "runtimeCommandExposureEnabled",
    "commandRuntimeControlEnabled",
    "commandControlEnabled"
  ]);
const TARGET_CONSUMER_PLANNING_METADATA_PROCESS_TRUE_FIELDS = Object.freeze([
  "processControlEnabled",
  "processSpawnEnabled",
  "processTerminationEnabled",
  "runtimeSupervisionEnabled"
]);
const TARGET_CONSUMER_PLANNING_METADATA_UNSAFE_RUNTIME_TRUE_FIELDS =
  Object.freeze([
    "runtimeEnabled",
    "runtimeStarted",
    "runtimeReady",
    "runtimeCommandEnabled",
    "runtimeCommandExposureEnabled",
    "runtimeExecutionEnabled",
    "runtimeExecuted",
    "liveRegistryConnectionEnabled",
    "webSocketRuntimeEnabled",
    "httpRuntimeEnabled",
    "taskExecutionEnabled",
    "mcpExecutionEnabled",
    "fabricRuntimeSurfaceEnabled",
    "contentFabricRuntimeBehaviorEnabled",
    "adapterRuntimeBehaviorEnabled",
    "filesystemWatcherEnabled",
    "externalSourceLookupEnabled",
    "fileSelectionEnabled",
    "filesystemScanningEnabled",
    "connectorIngestionAdded",
    "secretVaultEnvAccessEnabled",
    "secureDropImplemented",
    "secureDropCryptoImplemented",
    "secureDropTransportImplemented",
    "secureDropStegoImplemented",
    "secureDropSendReceiveImplemented",
    "secureDropInboxPollingEnabled",
    "st3ggVendored",
    "transcriptRuntimeWritePerformed",
    "auditRuntimeWritePerformed",
    "runtimeStdoutWriterEnabled",
    "runtimeStderrWriterEnabled",
    "liveStdinLoopEnabled"
  ]);

function targetConsumerPlanningMetadataInputRecord(input) {
  return isPlainObjectRecord(input) ? input : null;
}

function targetConsumerPlanningMetadataReviewedAt(inputRecord) {
  if (
    inputRecord === null ||
    !Object.prototype.hasOwnProperty.call(inputRecord, "reviewedAt")
  ) {
    return APPROVAL_PREREQUISITE_SOURCE_PREFLIGHT_DEFAULT_REVIEWED_AT;
  }

  return isUtcIsoTimestampWithMilliseconds(inputRecord.reviewedAt)
    ? inputRecord.reviewedAt
    : APPROVAL_PREREQUISITE_SOURCE_PREFLIGHT_DEFAULT_REVIEWED_AT;
}

function targetConsumerPlanningMetadataInputMalformed(inputRecord) {
  return (
    inputRecord === null ||
    (Object.prototype.hasOwnProperty.call(inputRecord, "reviewedAt") &&
      !isUtcIsoTimestampWithMilliseconds(inputRecord.reviewedAt))
  );
}

function targetConsumerPlanningMetadataEntries(inputRecord) {
  return inputRecord === null
    ? undefined
    : inputRecord.consolidationMetadataCheckpointEntries;
}

function targetConsumerPlanningMetadataSourceDigest(inputRecord) {
  return inputRecord === null
    ? undefined
    : inputRecord.sourceConsolidationMetadataCheckpointDigest;
}

function targetConsumerPlanningMetadataDigestMissing(inputRecord) {
  return (
    inputRecord === null ||
    !Object.prototype.hasOwnProperty.call(
      inputRecord,
      "sourceConsolidationMetadataCheckpointDigest"
    )
  );
}

function targetConsumerPlanningMetadataSourceDigestMatches(
  sourceStates,
  sourceDigest
) {
  return (
    Array.isArray(sourceStates) &&
    sourceStates.length === 1 &&
    isPlainObjectRecord(sourceStates[0]) &&
    sourceDigest === reviewArtifactHandoffDigest(sourceStates[0])
  );
}

function targetConsumerPlanningMetadataSourceValid(sourceState) {
  return (
    isPlainObjectRecord(sourceState) &&
    isUtcIsoTimestampWithMilliseconds(sourceState.reviewedAt) &&
    reviewOnlyInspectionHandoffMetadataBoundaryFieldsEqual(
      sourceState,
      TARGET_CONSUMER_PLANNING_METADATA_SOURCE_LITERAL_FIELDS
    ) &&
    TARGET_CONSUMER_PLANNING_METADATA_SOURCE_FALSE_FIELDS.every(
      (field) => sourceState[field] === false
    ) &&
    TARGET_CONSUMER_PLANNING_METADATA_SOURCE_NULL_FIELDS.every(
      (field) => sourceState[field] === null
    ) &&
    isPlainObjectRecord(sourceState.sourceConsolidationCheckpointHandoff) &&
    isPlainObjectRecord(sourceState.consolidationMetadataCheckpointSummary) &&
    isPlainObjectRecord(sourceState.cleanupHardeningToolkitEvidence) &&
    reviewOnlyInspectionHandoffMetadataBoundaryRuntimeEffectAllFalse(
      sourceState.runtimeEffect
    )
  );
}

function targetConsumerPlanningMetadataKeyTruePresent(sourceState, fields) {
  return reviewOnlyInspectionHandoffMetadataBoundaryKeyTruePresent(
    sourceState,
    fields
  );
}

function targetConsumerPlanningMetadataUnsafeRuntimeSignal(sourceState) {
  return (
    targetConsumerPlanningMetadataKeyTruePresent(
      sourceState,
      TARGET_CONSUMER_PLANNING_METADATA_UNSAFE_RUNTIME_TRUE_FIELDS
    ) ||
    reviewOnlyInspectionHandoffMetadataBoundaryKeyTruePresent(
      sourceState,
      TARGET_CONSUMER_PLANNING_METADATA_PROCESS_TRUE_FIELDS
    )
  );
}

function targetConsumerPlanningMetadataSingleClassification(sourceState) {
  if (
    targetConsumerPlanningMetadataKeyTruePresent(
      sourceState,
      TARGET_CONSUMER_PLANNING_METADATA_GRANT_TRUE_FIELDS
    )
  ) {
    return "grant_looking_target_consumer_planning_metadata_input_rejected";
  }

  if (
    targetConsumerPlanningMetadataKeyTruePresent(
      sourceState,
      TARGET_CONSUMER_PLANNING_METADATA_APPROVAL_DECISION_TRUE_FIELDS
    )
  ) {
    return "approval_decision_looking_target_consumer_planning_metadata_input_rejected";
  }

  if (
    targetConsumerPlanningMetadataKeyTruePresent(
      sourceState,
      TARGET_CONSUMER_PLANNING_METADATA_EVALUATOR_RESULT_TRUE_FIELDS
    )
  ) {
    return "evaluator_result_looking_target_consumer_planning_metadata_input_rejected";
  }

  if (
    targetConsumerPlanningMetadataKeyTruePresent(
      sourceState,
      TARGET_CONSUMER_PLANNING_METADATA_EVALUATOR_EXECUTION_TRUE_FIELDS
    )
  ) {
    return "evaluator_execution_looking_target_consumer_planning_metadata_input_rejected";
  }

  if (
    targetConsumerPlanningMetadataKeyTruePresent(
      sourceState,
      TARGET_CONSUMER_PLANNING_METADATA_REVIEWER_ROUTING_TRUE_FIELDS
    )
  ) {
    return "reviewer_routing_looking_target_consumer_planning_metadata_input_rejected";
  }

  if (
    targetConsumerPlanningMetadataKeyTruePresent(
      sourceState,
      TARGET_CONSUMER_PLANNING_METADATA_REVIEWER_ASSIGNMENT_TRUE_FIELDS
    )
  ) {
    return "reviewer_assignment_looking_target_consumer_planning_metadata_input_rejected";
  }

  if (
    targetConsumerPlanningMetadataKeyTruePresent(
      sourceState,
      TARGET_CONSUMER_PLANNING_METADATA_RUNTIME_PERMISSION_TRUE_FIELDS
    )
  ) {
    return "runtime_permission_looking_target_consumer_planning_metadata_input_rejected";
  }

  if (
    targetConsumerPlanningMetadataKeyTruePresent(
      sourceState,
      TARGET_CONSUMER_PLANNING_METADATA_COMMAND_EXPOSURE_TRUE_FIELDS
    )
  ) {
    return "command_exposure_looking_target_consumer_planning_metadata_input_rejected";
  }

  if (
    isPlainObjectRecord(sourceState) &&
    isPlainObjectRecord(sourceState.runtimeEffect) &&
    !reviewOnlyInspectionHandoffMetadataBoundaryRuntimeEffectAllFalse(
      sourceState.runtimeEffect
    )
  ) {
    return "runtime_effect_true_target_consumer_planning_metadata_input_rejected";
  }

  if (
    targetConsumerPlanningMetadataKeyTruePresent(
      sourceState,
      TARGET_CONSUMER_PLANNING_METADATA_PROCESS_TRUE_FIELDS
    )
  ) {
    return "process_flag_true_target_consumer_planning_metadata_input_rejected";
  }

  if (targetConsumerPlanningMetadataUnsafeRuntimeSignal(sourceState)) {
    return "execution_signal_looking_target_consumer_planning_metadata_input_rejected";
  }

  return targetConsumerPlanningMetadataSourceValid(sourceState)
    ? VALID_TARGET_CONSUMER_PLANNING_METADATA_CLASSIFICATION
    : MALFORMED_TARGET_CONSUMER_PLANNING_METADATA_CLASSIFICATION;
}

function targetConsumerPlanningMetadataInputRejection(sourceStates) {
  if (sourceStates === undefined) {
    return "missing_target_consumer_planning_metadata_input_rejected";
  }

  if (!Array.isArray(sourceStates)) {
    return MALFORMED_TARGET_CONSUMER_PLANNING_METADATA_CLASSIFICATION;
  }

  if (sourceStates.length === 0) {
    return "empty_target_consumer_planning_metadata_input_rejected";
  }

  if (sourceStates.some((entry) => !isPlainObjectRecord(entry))) {
    return MALFORMED_TARGET_CONSUMER_PLANNING_METADATA_CLASSIFICATION;
  }

  return sourceStates.length > 1
    ? "duplicate_invalid_target_consumer_planning_metadata_input_rejected"
    : undefined;
}

function targetConsumerPlanningMetadataInputClassification({
  inputRecord,
  sourceStates,
  sourceDigest
}) {
  if (targetConsumerPlanningMetadataInputMalformed(inputRecord)) {
    return MALFORMED_TARGET_CONSUMER_PLANNING_METADATA_CLASSIFICATION;
  }

  const inputRejection = targetConsumerPlanningMetadataInputRejection(sourceStates);

  if (inputRejection !== undefined) {
    return inputRejection;
  }

  if (
    targetConsumerPlanningMetadataDigestMissing(inputRecord) ||
    !reviewOnlyMetadataHandoffCheckpointDigestString(sourceDigest)
  ) {
    return MALFORMED_TARGET_CONSUMER_PLANNING_METADATA_CLASSIFICATION;
  }

  if (
    !targetConsumerPlanningMetadataSourceDigestMatches(sourceStates, sourceDigest)
  ) {
    return MISMATCHED_SOURCE_DIGEST_TARGET_CONSUMER_PLANNING_METADATA_CLASSIFICATION;
  }

  return targetConsumerPlanningMetadataSingleClassification(sourceStates[0]);
}

function targetConsumerPlanningMetadataPrimaryHarnessLayer() {
  return {
    product: "Ardyn",
    layerKind: "primary-harness-framework-wrapper-layer",
    repoFamilyScope: "ardyn-repo-family",
    primaryHarnessForRepoFamily: true,
    firstClassTargetConsumers: ["locus", "multiverse"],
    planningMetadataOnly: true,
    runtimeBlocked: true,
    secureDropConsumerOnlyAfterExplicitAuthorization: true
  };
}

function targetConsumerPlanningMetadataLocusConsumer() {
  return {
    consumerId: "locus",
    consumerName: "Locus",
    firstClassTargetConsumer: true,
    consumerRole: "status-control-surface-and-review-artifact-consumer",
    contractCoverage: [
      "status-control-surface-contracts",
      "process-tool-capability-metadata",
      "locus-visible-review-artifacts",
      "future-secure-drop-compose-consumer-contract-reference",
      "future-secure-drop-inbox-consumer-contract-reference"
    ],
    statusControlSurfaceContracts: {
      statusMetadataVisible: true,
      controlSurfaceMetadataVisible: true,
      commandControlEnabled: false,
      runtimeControlEnabled: false
    },
    processToolCapabilityMetadata: {
      processMetadataVisible: true,
      toolCapabilityMetadataVisible: true,
      processControlEnabled: false,
      toolExecutionEnabled: false
    },
    reviewArtifacts: {
      locusVisibleReviewArtifacts: true,
      reviewArtifactConsumerOnly: true,
      reviewerRoutingPerformed: false,
      reviewerAssignmentPerformed: false
    },
    secureDropFutureContractReferences: {
      canonicalCapabilityOwner: "content-fabric",
      capabilityStatus: "future-content-fabric-capability-reference-only",
      composeContractReference:
        "future-content-fabric.secure-drop.compose-consumer-contract",
      inboxConsumerContractReference:
        "future-content-fabric.secure-drop.inbox-consumer-contract",
      ardynConsumesNow: false
    },
    nonAuthorizingBoundary: {
      commandRuntimeControlEnabled: false,
      runtimeExecutionEnabled: false,
      runtimePermissionGranted: false,
      commandExposurePermissionGranted: false,
      connectorGrantProduced: false
    }
  };
}

function targetConsumerPlanningMetadataMultiverseConsumer() {
  return {
    consumerId: "multiverse",
    consumerName: "Multiverse",
    firstClassTargetConsumer: true,
    consumerRole: "world-project-orchestration-and-wrapper-contract-consumer",
    contractCoverage: [
      "world-project-orchestration-contracts",
      "visible-ai-capability-metadata",
      "task-capability-wrapper-contracts",
      "review-only-citizen-adapter-candidate-metadata",
      "fabric-coordination-metadata"
    ],
    worldProjectOrchestrationContracts: {
      worldMetadataVisible: true,
      projectOrchestrationMetadataVisible: true,
      liveRegistryConnectionEnabled: false,
      liveTaskExecutionEnabled: false
    },
    visibleAiCapabilityMetadata: {
      aiCapabilityMetadataVisible: true,
      modelRuntimeEnabled: false,
      evaluatorExecutionEnabled: false
    },
    taskCapabilityWrapperContracts: {
      taskWrapperMetadataVisible: true,
      capabilityWrapperMetadataVisible: true,
      taskExecutionEnabled: false,
      mcpExecutionEnabled: false
    },
    citizenAdapterCandidateMetadata: {
      reviewOnlyCandidateMetadataVisible: true,
      citizenAdapterCandidateMetadataOnly: true,
      adapterRuntimeBehaviorEnabled: false,
      connectorIngestionAdded: false
    },
    fabricCoordinationMetadata: {
      fabricCoordinationMetadataVisible: true,
      fabricRuntimeSurfaceEnabled: false,
      contentFabricRuntimeBehaviorEnabled: false,
      webSocketHttpSurfaceEnabled: false
    },
    nonAuthorizingBoundary: {
      liveRegistryExecutionEnabled: false,
      webSocketRuntimeEnabled: false,
      taskRuntimeExecutionEnabled: false,
      mcpRuntimeExecutionEnabled: false,
      connectorGrantProduced: false
    }
  };
}

function targetConsumerPlanningMetadataSecureDropFutureCapability() {
  return {
    capabilityName: "Secure Drop",
    canonicalCapability: "content-fabric.secure-drop",
    canonicalCapabilityOwner: "content-fabric",
    phaseStatus: "future-canonical-content-fabric-capability-reference-only",
    ardynMayConsumeAfterExplicitAuthorization: true,
    ardynConsumesNow: false,
    cryptoImplemented: false,
    transportImplemented: false,
    stegoImplemented: false,
    sendReceiveImplemented: false,
    composeRuntimeImplemented: false,
    inboxPollingImplemented: false,
    fileSelectionImplemented: false,
    filesystemScanningImplemented: false,
    connectorIngestionImplemented: false,
    secretVaultEnvAccessImplemented: false,
    st3ggVendored: false,
    contentFabricRuntimeBehaviorEnabled: false
  };
}

function targetConsumerPlanningMetadataSummary() {
  return {
    targetConsumerPlanningMetadataKind: TARGET_CONSUMER_PLANNING_METADATA_KIND,
    targetConsumerPlanningMetadataMode: "review-only",
    primaryHarnessFrameworkWrapperLayer: true,
    firstClassTargetConsumerIds: ["locus", "multiverse"],
    targetConsumerCount: 2,
    locusFirstClassTargetConsumer: true,
    multiverseFirstClassTargetConsumer: true,
    locusStatusControlSurfaceContractsCovered: true,
    locusProcessToolCapabilityMetadataCovered: true,
    locusVisibleReviewArtifactsCovered: true,
    locusSecureDropFutureComposeInboxReferencesCovered: true,
    multiverseWorldProjectOrchestrationContractsCovered: true,
    multiverseVisibleAiCapabilityMetadataCovered: true,
    multiverseTaskCapabilityWrapperContractsCovered: true,
    multiverseReviewOnlyCitizenAdapterCandidateMetadataCovered: true,
    multiverseFabricCoordinationMetadataCovered: true,
    secureDropFutureContentFabricCapabilityReferenceOnly: true,
    metadataOnly: true,
    reviewOnly: true,
    authoritative: false,
    commandRuntimeControlEnabled: false,
    runtimeExecutionEnabled: false,
    connectorGrantProduced: false,
    fabricRuntimeSurfaceEnabled: false,
    contentFabricRuntimeBehaviorEnabled: false,
    secureDropImplemented: false
  };
}

function targetConsumerPlanningMetadataSourceSummary(sourceState, sourceDigest) {
  return {
    schema: sourceState.schema,
    stateKind: sourceState.stateKind,
    stateMode: sourceState.stateMode,
    reviewedAt: sourceState.reviewedAt,
    stateDigest: sourceDigest,
    consolidationMetadataCheckpointMetadataOnly: true,
    consolidationMetadataCheckpointIsReviewerRouting: false,
    consolidationMetadataCheckpointIsReviewerAssignment: false,
    consolidationMetadataCheckpointIsEvaluatorExecution: false,
    consolidationMetadataCheckpointIsEvaluatorResult: false,
    consolidationMetadataCheckpointIsApprovalDecision: false,
    consolidationMetadataCheckpointIsApprovalGrant: false,
    runtimeEffectAllFalse: true
  };
}

function targetConsumerPlanningMetadataStateFromSource(
  sourceState,
  reviewedAt,
  sourceDigest
) {
  const targetConsumers = [
    targetConsumerPlanningMetadataLocusConsumer(),
    targetConsumerPlanningMetadataMultiverseConsumer()
  ];

  return {
    schema: TARGET_CONSUMER_PLANNING_METADATA_STATE_SCHEMA,
    schemaVersion: TARGET_CONSUMER_PLANNING_METADATA_VERSION,
    stateKind: "target-consumer-planning-metadata-state",
    stateMode: "review-only",
    reviewedAt,
    sourceConsolidationMetadataCheckpoint:
      targetConsumerPlanningMetadataSourceSummary(sourceState, sourceDigest),
    primaryHarnessLayer: targetConsumerPlanningMetadataPrimaryHarnessLayer(),
    targetConsumers,
    secureDropFutureCapability:
      targetConsumerPlanningMetadataSecureDropFutureCapability(),
    targetConsumerPlanningSummary: targetConsumerPlanningMetadataSummary(),
    targetConsumerIds: targetConsumers.map(({ consumerId }) => consumerId),
    targetConsumerPlanningMetadataOnly: true,
    reviewOnly: true,
    authoritative: false,
    reviewArtifactOnly: true,
    targetConsumerPlanningMetadataIsReviewerRouting: false,
    targetConsumerPlanningMetadataIsReviewerAssignment: false,
    targetConsumerPlanningMetadataIsEvaluatorExecution: false,
    targetConsumerPlanningMetadataIsEvaluatorResult: false,
    targetConsumerPlanningMetadataIsApprovalDecision: false,
    targetConsumerPlanningMetadataIsApprovalGrant: false,
    ...targetConsumerPlanningMetadataForbiddenBehavior(),
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

function targetConsumerPlanningMetadataAcceptedOutput({
  accepted,
  sourceStates,
  reviewedAt,
  sourceDigest
}) {
  if (!accepted) {
    return {
      targetConsumerPlanningMetadata: null,
      sourceConsolidationMetadataCheckpointSummary: null
    };
  }

  const sourceState = sourceStates[0];

  return {
    targetConsumerPlanningMetadata:
      targetConsumerPlanningMetadataStateFromSource(
        sourceState,
        reviewedAt,
        sourceDigest
      ),
    sourceConsolidationMetadataCheckpointSummary:
      targetConsumerPlanningMetadataSourceSummary(sourceState, sourceDigest)
  };
}

function targetConsumerPlanningMetadataRejectionReasons({
  accepted,
  classification
}) {
  if (accepted) {
    return [
      "target_consumer_planning_metadata_is_review_only",
      "locus_and_multiverse_recorded_as_first_class_target_consumers",
      "secure_drop_is_future_content_fabric_capability_reference_only",
      "command_runtime_control_not_implemented",
      "connector_grants_not_implemented",
      "fabric_runtime_not_implemented",
      "secure_drop_runtime_not_implemented",
      "runtime_enablement_still_blocked"
    ];
  }

  return [
    classification,
    "target_consumer_planning_metadata_not_produced",
    "command_runtime_control_not_implemented",
    "connector_grants_not_implemented",
    "fabric_runtime_not_implemented",
    "secure_drop_runtime_not_implemented",
    "runtime_enablement_still_blocked"
  ];
}

function targetConsumerPlanningMetadataResult({
  reviewedAt,
  reviewedAtDefaulted,
  classification,
  accepted,
  targetConsumerPlanningMetadata,
  sourceConsolidationMetadataCheckpointSummary
}) {
  return {
    schema: TARGET_CONSUMER_PLANNING_METADATA_SCHEMA,
    schemaVersion: TARGET_CONSUMER_PLANNING_METADATA_VERSION,
    targetConsumerPlanningMetadataKind: TARGET_CONSUMER_PLANNING_METADATA_KIND,
    targetConsumerPlanningMetadataMode: "review-only",
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    sourceConsolidationMetadataCheckpointAccepted: accepted,
    targetConsumerPlanningMetadataProduced: accepted,
    targetConsumerPlanningMetadata,
    sourceConsolidationMetadataCheckpointSummary,
    targetConsumerPlanningSummary: accepted
      ? targetConsumerPlanningMetadata.targetConsumerPlanningSummary
      : null,
    targetConsumers: accepted ? targetConsumerPlanningMetadata.targetConsumers : [],
    targetConsumerIds: accepted ? targetConsumerPlanningMetadata.targetConsumerIds : [],
    secureDropFutureCapability: accepted
      ? targetConsumerPlanningMetadata.secureDropFutureCapability
      : null,
    reviewOnly: true,
    authoritative: false,
    reviewArtifactOnly: true,
    targetConsumerPlanningMetadataOnly: true,
    targetConsumerPlanningMetadataIsReviewerRouting: false,
    targetConsumerPlanningMetadataIsReviewerAssignment: false,
    targetConsumerPlanningMetadataIsEvaluatorExecution: false,
    targetConsumerPlanningMetadataIsEvaluatorResult: false,
    targetConsumerPlanningMetadataIsApprovalDecision: false,
    targetConsumerPlanningMetadataIsApprovalGrant: false,
    ...targetConsumerPlanningMetadataForbiddenBehavior(),
    rejectionReasons:
      targetConsumerPlanningMetadataRejectionReasons({
        accepted,
        classification
      }),
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

export function createTargetConsumerPlanningMetadataForReview(input = {}) {
  const inputRecord = targetConsumerPlanningMetadataInputRecord(input);
  const reviewedAt = targetConsumerPlanningMetadataReviewedAt(inputRecord);
  const reviewedAtDefaulted = isReviewedAtDefaulted(inputRecord);
  const sourceStates = targetConsumerPlanningMetadataEntries(inputRecord);
  const sourceDigest = targetConsumerPlanningMetadataSourceDigest(inputRecord);
  const classification = targetConsumerPlanningMetadataInputClassification({
    inputRecord,
    sourceStates,
    sourceDigest
  });
  const accepted =
    classification === VALID_TARGET_CONSUMER_PLANNING_METADATA_CLASSIFICATION;
  const {
    targetConsumerPlanningMetadata,
    sourceConsolidationMetadataCheckpointSummary
  } = targetConsumerPlanningMetadataAcceptedOutput({
    accepted,
    sourceStates,
    reviewedAt,
    sourceDigest
  });

  return targetConsumerPlanningMetadataResult({
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    accepted,
    targetConsumerPlanningMetadata,
    sourceConsolidationMetadataCheckpointSummary
  });
}

const CONSUMER_CONTRACT_READINESS_MATRIX_STATE_SCHEMA =
  "ardyn.phase-5.46.consumer-contract-readiness-matrix-state";
const VALID_CONSUMER_CONTRACT_READINESS_MATRIX_CLASSIFICATION =
  "valid_consumer_contract_readiness_matrix_runtime_still_blocked";
const MALFORMED_CONSUMER_CONTRACT_READINESS_MATRIX_CLASSIFICATION =
  "malformed_consumer_contract_readiness_matrix_input_rejected";
const MISMATCHED_SOURCE_DIGEST_CONSUMER_CONTRACT_READINESS_MATRIX_CLASSIFICATION =
  "mismatched_source_digest_consumer_contract_readiness_matrix_input_rejected";

const CONSUMER_CONTRACT_READINESS_MATRIX_SOURCE_LITERAL_FIELDS = Object.freeze([
  ["schema", TARGET_CONSUMER_PLANNING_METADATA_STATE_SCHEMA],
  ["schemaVersion", TARGET_CONSUMER_PLANNING_METADATA_VERSION],
  ["stateKind", "target-consumer-planning-metadata-state"],
  ["stateMode", "review-only"],
  ["targetConsumerPlanningMetadataOnly", true],
  ["reviewOnly", true],
  ["authoritative", false],
  ["reviewArtifactOnly", true]
]);

const CONSUMER_CONTRACT_READINESS_MATRIX_SOURCE_FALSE_FIELDS = Object.freeze([
  "targetConsumerPlanningMetadataIsReviewerRouting",
  "targetConsumerPlanningMetadataIsReviewerAssignment",
  "targetConsumerPlanningMetadataIsEvaluatorExecution",
  "targetConsumerPlanningMetadataIsEvaluatorResult",
  "targetConsumerPlanningMetadataIsApprovalDecision",
  "targetConsumerPlanningMetadataIsApprovalGrant",
  ...Object.keys(targetConsumerPlanningMetadataForbiddenBehavior())
]);

const CONSUMER_CONTRACT_READINESS_MATRIX_REVIEWER_ROUTING_TRUE_FIELDS =
  Object.freeze([
    "consumerContractReadinessMatrixIsReviewerRouting",
    "reviewerRoutingPerformed",
    "reviewerRoutingEnabled"
  ]);
const CONSUMER_CONTRACT_READINESS_MATRIX_REVIEWER_ASSIGNMENT_TRUE_FIELDS =
  Object.freeze([
    "consumerContractReadinessMatrixIsReviewerAssignment",
    "reviewerAssignmentPerformed",
    "reviewerAssignmentEnabled"
  ]);
const CONSUMER_CONTRACT_READINESS_MATRIX_EVALUATOR_EXECUTION_TRUE_FIELDS =
  Object.freeze([
    "consumerContractReadinessMatrixIsEvaluatorExecution",
    "evaluatorExecutionPerformed",
    "evaluatorExecutionRequested",
    "evaluatorExecutionStarted",
    "evaluatorExecutionEnabled",
    "evaluatorExecuted"
  ]);
const CONSUMER_CONTRACT_READINESS_MATRIX_EVALUATOR_RESULT_TRUE_FIELDS =
  Object.freeze([
    "consumerContractReadinessMatrixIsEvaluatorResult",
    "evaluatorResultProduced",
    "evaluatorResultPersisted"
  ]);
const CONSUMER_CONTRACT_READINESS_MATRIX_APPROVAL_DECISION_TRUE_FIELDS =
  Object.freeze([
    "consumerContractReadinessMatrixIsApprovalDecision",
    "approvalDecisionProduced",
    "approvalDecisionPersisted"
  ]);
const CONSUMER_CONTRACT_READINESS_MATRIX_GRANT_TRUE_FIELDS = Object.freeze([
  "consumerContractReadinessMatrixIsApprovalGrant",
  "approvalGrantProduced",
  "approvalGrantPersisted",
  "connectorGrantProduced",
  "connectorPermissionGranted",
  "connectorAccessGranted"
]);
const CONSUMER_CONTRACT_READINESS_MATRIX_RUNTIME_PERMISSION_TRUE_FIELDS =
  Object.freeze([
    "runtimePermissionGranted",
    "runtimeEnablementApproved",
    "canEnableRuntime"
  ]);
const CONSUMER_CONTRACT_READINESS_MATRIX_COMMAND_EXPOSURE_TRUE_FIELDS =
  Object.freeze([
    "commandExposurePermissionGranted",
    "runtimeCommandExposureEnabled",
    "commandRuntimeControlEnabled",
    "commandControlEnabled"
  ]);
const CONSUMER_CONTRACT_READINESS_MATRIX_PROCESS_TRUE_FIELDS = Object.freeze([
  "processControlEnabled",
  "processSpawnEnabled",
  "processTerminationEnabled",
  "runtimeSupervisionEnabled"
]);
const CONSUMER_CONTRACT_READINESS_MATRIX_UNSAFE_RUNTIME_TRUE_FIELDS =
  Object.freeze([
    "runtimeEnabled",
    "runtimeStarted",
    "runtimeReady",
    "runtimeCommandEnabled",
    "runtimeCommandExposureEnabled",
    "runtimeExecutionEnabled",
    "runtimeExecuted",
    "liveRegistryConnectionEnabled",
    "webSocketRuntimeEnabled",
    "httpRuntimeEnabled",
    "taskRuntimeExecutionEnabled",
    "taskExecutionEnabled",
    "mcpRuntimeExecutionEnabled",
    "mcpExecutionEnabled",
    "mcpToolExposureEnabled",
    "fabricRuntimeSurfaceEnabled",
    "contentFabricRuntimeBehaviorEnabled",
    "adapterRuntimeBehaviorEnabled",
    "filesystemWatcherEnabled",
    "externalSourceLookupEnabled",
    "fileSelectionEnabled",
    "filesystemScanningEnabled",
    "connectorIngestionAdded",
    "secretVaultEnvAccessEnabled",
    "secureDropImplemented",
    "secureDropCryptoImplemented",
    "secureDropTransportImplemented",
    "secureDropStegoImplemented",
    "secureDropSendReceiveImplemented",
    "secureDropInboxPollingEnabled",
    "st3ggVendored",
    "transcriptRuntimeWritePerformed",
    "auditRuntimeWritePerformed",
    "runtimeStdoutWriterEnabled",
    "runtimeStderrWriterEnabled",
    "liveStdinLoopEnabled"
  ]);

function consumerContractReadinessMatrixInputRecord(input) {
  return isPlainObjectRecord(input) ? input : null;
}

function consumerContractReadinessMatrixReviewedAt(inputRecord) {
  if (
    inputRecord === null ||
    !Object.prototype.hasOwnProperty.call(inputRecord, "reviewedAt")
  ) {
    return APPROVAL_PREREQUISITE_SOURCE_PREFLIGHT_DEFAULT_REVIEWED_AT;
  }

  return isUtcIsoTimestampWithMilliseconds(inputRecord.reviewedAt)
    ? inputRecord.reviewedAt
    : APPROVAL_PREREQUISITE_SOURCE_PREFLIGHT_DEFAULT_REVIEWED_AT;
}

function consumerContractReadinessMatrixInputMalformed(inputRecord) {
  return (
    inputRecord === null ||
    (Object.prototype.hasOwnProperty.call(inputRecord, "reviewedAt") &&
      !isUtcIsoTimestampWithMilliseconds(inputRecord.reviewedAt))
  );
}

function consumerContractReadinessMatrixEntries(inputRecord) {
  return inputRecord === null
    ? undefined
    : inputRecord.targetConsumerPlanningMetadataEntries;
}

function consumerContractReadinessMatrixSourceDigest(inputRecord) {
  return inputRecord === null
    ? undefined
    : inputRecord.sourceTargetConsumerPlanningMetadataDigest;
}

function consumerContractReadinessMatrixDigestMissing(inputRecord) {
  return (
    inputRecord === null ||
    !Object.prototype.hasOwnProperty.call(
      inputRecord,
      "sourceTargetConsumerPlanningMetadataDigest"
    )
  );
}

function consumerContractReadinessMatrixSourceDigestMatches(
  sourceStates,
  sourceDigest
) {
  return (
    Array.isArray(sourceStates) &&
    sourceStates.length === 1 &&
    isPlainObjectRecord(sourceStates[0]) &&
    sourceDigest === reviewArtifactHandoffDigest(sourceStates[0])
  );
}

function consumerContractReadinessMatrixSourceConsumerById(sourceState, id) {
  return Array.isArray(sourceState.targetConsumers)
    ? sourceState.targetConsumers.find((consumer) => consumer.consumerId === id)
    : undefined;
}

function consumerContractReadinessMatrixSourceValid(sourceState) {
  const locus = consumerContractReadinessMatrixSourceConsumerById(
    sourceState,
    "locus"
  );
  const multiverse = consumerContractReadinessMatrixSourceConsumerById(
    sourceState,
    "multiverse"
  );

  return (
    isPlainObjectRecord(sourceState) &&
    isUtcIsoTimestampWithMilliseconds(sourceState.reviewedAt) &&
    reviewOnlyInspectionHandoffMetadataBoundaryFieldsEqual(
      sourceState,
      CONSUMER_CONTRACT_READINESS_MATRIX_SOURCE_LITERAL_FIELDS
    ) &&
    CONSUMER_CONTRACT_READINESS_MATRIX_SOURCE_FALSE_FIELDS.every(
      (field) => sourceState[field] === false
    ) &&
    isPlainObjectRecord(sourceState.primaryHarnessLayer) &&
    sourceState.primaryHarnessLayer.product === "Ardyn" &&
    sourceState.primaryHarnessLayer.primaryHarnessForRepoFamily === true &&
    sourceState.primaryHarnessLayer.planningMetadataOnly === true &&
    sourceState.primaryHarnessLayer.runtimeBlocked === true &&
    Array.isArray(sourceState.primaryHarnessLayer.firstClassTargetConsumers) &&
    sourceState.primaryHarnessLayer.firstClassTargetConsumers.length === 2 &&
    sourceState.primaryHarnessLayer.firstClassTargetConsumers[0] === "locus" &&
    sourceState.primaryHarnessLayer.firstClassTargetConsumers[1] ===
      "multiverse" &&
    Array.isArray(sourceState.targetConsumerIds) &&
    sourceState.targetConsumerIds.length === 2 &&
    sourceState.targetConsumerIds[0] === "locus" &&
    sourceState.targetConsumerIds[1] === "multiverse" &&
    isPlainObjectRecord(locus) &&
    locus.firstClassTargetConsumer === true &&
    isPlainObjectRecord(locus.statusControlSurfaceContracts) &&
    locus.statusControlSurfaceContracts.commandControlEnabled === false &&
    locus.statusControlSurfaceContracts.runtimeControlEnabled === false &&
    isPlainObjectRecord(locus.processToolCapabilityMetadata) &&
    locus.processToolCapabilityMetadata.processControlEnabled === false &&
    locus.processToolCapabilityMetadata.toolExecutionEnabled === false &&
    isPlainObjectRecord(locus.secureDropFutureContractReferences) &&
    locus.secureDropFutureContractReferences.canonicalCapabilityOwner ===
      "content-fabric" &&
    locus.secureDropFutureContractReferences.ardynConsumesNow === false &&
    isPlainObjectRecord(multiverse) &&
    multiverse.firstClassTargetConsumer === true &&
    isPlainObjectRecord(multiverse.worldProjectOrchestrationContracts) &&
    multiverse.worldProjectOrchestrationContracts
      .liveRegistryConnectionEnabled === false &&
    multiverse.worldProjectOrchestrationContracts.liveTaskExecutionEnabled ===
      false &&
    isPlainObjectRecord(multiverse.taskCapabilityWrapperContracts) &&
    multiverse.taskCapabilityWrapperContracts.taskExecutionEnabled === false &&
    multiverse.taskCapabilityWrapperContracts.mcpExecutionEnabled === false &&
    isPlainObjectRecord(multiverse.fabricCoordinationMetadata) &&
    multiverse.fabricCoordinationMetadata.fabricRuntimeSurfaceEnabled ===
      false &&
    multiverse.fabricCoordinationMetadata
      .contentFabricRuntimeBehaviorEnabled === false &&
    isPlainObjectRecord(sourceState.secureDropFutureCapability) &&
    sourceState.secureDropFutureCapability.canonicalCapability ===
      "content-fabric.secure-drop" &&
    sourceState.secureDropFutureCapability.ardynConsumesNow === false &&
    sourceState.secureDropFutureCapability.cryptoImplemented === false &&
    sourceState.secureDropFutureCapability.transportImplemented === false &&
    sourceState.secureDropFutureCapability.stegoImplemented === false &&
    sourceState.secureDropFutureCapability.sendReceiveImplemented === false &&
    sourceState.secureDropFutureCapability.inboxPollingImplemented === false &&
    sourceState.secureDropFutureCapability.fileSelectionImplemented === false &&
    sourceState.secureDropFutureCapability.filesystemScanningImplemented ===
      false &&
    sourceState.secureDropFutureCapability.connectorIngestionImplemented ===
      false &&
    sourceState.secureDropFutureCapability.secretVaultEnvAccessImplemented ===
      false &&
    sourceState.secureDropFutureCapability.st3ggVendored === false &&
    reviewOnlyInspectionHandoffMetadataBoundaryRuntimeEffectAllFalse(
      sourceState.runtimeEffect
    )
  );
}

function consumerContractReadinessMatrixKeyTruePresent(sourceState, fields) {
  return reviewOnlyInspectionHandoffMetadataBoundaryKeyTruePresent(
    sourceState,
    fields
  );
}

function consumerContractReadinessMatrixUnsafeRuntimeSignal(sourceState) {
  return (
    consumerContractReadinessMatrixKeyTruePresent(
      sourceState,
      CONSUMER_CONTRACT_READINESS_MATRIX_UNSAFE_RUNTIME_TRUE_FIELDS
    ) ||
    reviewOnlyInspectionHandoffMetadataBoundaryKeyTruePresent(
      sourceState,
      CONSUMER_CONTRACT_READINESS_MATRIX_PROCESS_TRUE_FIELDS
    )
  );
}

function consumerContractReadinessMatrixSingleClassification(sourceState) {
  if (
    consumerContractReadinessMatrixKeyTruePresent(
      sourceState,
      CONSUMER_CONTRACT_READINESS_MATRIX_GRANT_TRUE_FIELDS
    )
  ) {
    return "grant_looking_consumer_contract_readiness_matrix_input_rejected";
  }

  if (
    consumerContractReadinessMatrixKeyTruePresent(
      sourceState,
      CONSUMER_CONTRACT_READINESS_MATRIX_APPROVAL_DECISION_TRUE_FIELDS
    )
  ) {
    return "approval_decision_looking_consumer_contract_readiness_matrix_input_rejected";
  }

  if (
    consumerContractReadinessMatrixKeyTruePresent(
      sourceState,
      CONSUMER_CONTRACT_READINESS_MATRIX_EVALUATOR_RESULT_TRUE_FIELDS
    )
  ) {
    return "evaluator_result_looking_consumer_contract_readiness_matrix_input_rejected";
  }

  if (
    consumerContractReadinessMatrixKeyTruePresent(
      sourceState,
      CONSUMER_CONTRACT_READINESS_MATRIX_EVALUATOR_EXECUTION_TRUE_FIELDS
    )
  ) {
    return "evaluator_execution_looking_consumer_contract_readiness_matrix_input_rejected";
  }

  if (
    consumerContractReadinessMatrixKeyTruePresent(
      sourceState,
      CONSUMER_CONTRACT_READINESS_MATRIX_REVIEWER_ROUTING_TRUE_FIELDS
    )
  ) {
    return "reviewer_routing_looking_consumer_contract_readiness_matrix_input_rejected";
  }

  if (
    consumerContractReadinessMatrixKeyTruePresent(
      sourceState,
      CONSUMER_CONTRACT_READINESS_MATRIX_REVIEWER_ASSIGNMENT_TRUE_FIELDS
    )
  ) {
    return "reviewer_assignment_looking_consumer_contract_readiness_matrix_input_rejected";
  }

  if (
    consumerContractReadinessMatrixKeyTruePresent(
      sourceState,
      CONSUMER_CONTRACT_READINESS_MATRIX_RUNTIME_PERMISSION_TRUE_FIELDS
    )
  ) {
    return "runtime_permission_looking_consumer_contract_readiness_matrix_input_rejected";
  }

  if (
    consumerContractReadinessMatrixKeyTruePresent(
      sourceState,
      CONSUMER_CONTRACT_READINESS_MATRIX_COMMAND_EXPOSURE_TRUE_FIELDS
    )
  ) {
    return "command_exposure_looking_consumer_contract_readiness_matrix_input_rejected";
  }

  if (
    isPlainObjectRecord(sourceState) &&
    isPlainObjectRecord(sourceState.runtimeEffect) &&
    !reviewOnlyInspectionHandoffMetadataBoundaryRuntimeEffectAllFalse(
      sourceState.runtimeEffect
    )
  ) {
    return "runtime_effect_true_consumer_contract_readiness_matrix_input_rejected";
  }

  if (
    consumerContractReadinessMatrixKeyTruePresent(
      sourceState,
      CONSUMER_CONTRACT_READINESS_MATRIX_PROCESS_TRUE_FIELDS
    )
  ) {
    return "process_flag_true_consumer_contract_readiness_matrix_input_rejected";
  }

  if (consumerContractReadinessMatrixUnsafeRuntimeSignal(sourceState)) {
    return "execution_signal_looking_consumer_contract_readiness_matrix_input_rejected";
  }

  return consumerContractReadinessMatrixSourceValid(sourceState)
    ? VALID_CONSUMER_CONTRACT_READINESS_MATRIX_CLASSIFICATION
    : MALFORMED_CONSUMER_CONTRACT_READINESS_MATRIX_CLASSIFICATION;
}

function consumerContractReadinessMatrixInputRejection(sourceStates) {
  if (sourceStates === undefined) {
    return "missing_consumer_contract_readiness_matrix_input_rejected";
  }

  if (!Array.isArray(sourceStates)) {
    return MALFORMED_CONSUMER_CONTRACT_READINESS_MATRIX_CLASSIFICATION;
  }

  if (sourceStates.length === 0) {
    return "empty_consumer_contract_readiness_matrix_input_rejected";
  }

  if (sourceStates.some((entry) => !isPlainObjectRecord(entry))) {
    return MALFORMED_CONSUMER_CONTRACT_READINESS_MATRIX_CLASSIFICATION;
  }

  return sourceStates.length > 1
    ? "duplicate_invalid_consumer_contract_readiness_matrix_input_rejected"
    : undefined;
}

function consumerContractReadinessMatrixInputClassification({
  inputRecord,
  sourceStates,
  sourceDigest
}) {
  if (consumerContractReadinessMatrixInputMalformed(inputRecord)) {
    return MALFORMED_CONSUMER_CONTRACT_READINESS_MATRIX_CLASSIFICATION;
  }

  const inputRejection =
    consumerContractReadinessMatrixInputRejection(sourceStates);

  if (inputRejection !== undefined) {
    return inputRejection;
  }

  if (
    consumerContractReadinessMatrixDigestMissing(inputRecord) ||
    !reviewOnlyMetadataHandoffCheckpointDigestString(sourceDigest)
  ) {
    return MALFORMED_CONSUMER_CONTRACT_READINESS_MATRIX_CLASSIFICATION;
  }

  if (
    !consumerContractReadinessMatrixSourceDigestMatches(
      sourceStates,
      sourceDigest
    )
  ) {
    return MISMATCHED_SOURCE_DIGEST_CONSUMER_CONTRACT_READINESS_MATRIX_CLASSIFICATION;
  }

  return consumerContractReadinessMatrixSingleClassification(sourceStates[0]);
}

function consumerContractReadinessMatrixAuthorizationFlags() {
  return {
    runtimeAuthorizationGranted: false,
    commandAuthorizationGranted: false,
    connectorAuthorizationGranted: false,
    fabricRuntimeAuthorizationGranted: false,
    webSocketRuntimeAuthorizationGranted: false,
    httpRuntimeAuthorizationGranted: false,
    mcpRuntimeAuthorizationGranted: false,
    mcpToolExposureAuthorizationGranted: false,
    taskRuntimeAuthorizationGranted: false,
    secureDropAuthorizationGranted: false,
    approvalGrantProduced: false,
    documentaryMetadataVisible: true
  };
}

function consumerContractReadinessMatrixRow({
  rowId,
  consumerId,
  consumerName,
  touchpointName,
  requiredFutureContracts,
  currentAllowedBehavior,
  explicitlyForbiddenBehavior,
  blockerNotes
}) {
  return {
    rowId,
    consumerId,
    consumerName,
    touchpointName,
    readinessState: "future-contract-required-runtime-blocked",
    requiredFutureContracts,
    currentAllowedBehavior,
    explicitlyForbiddenBehavior,
    authorizationFlags: consumerContractReadinessMatrixAuthorizationFlags(),
    blockerNotes
  };
}

function consumerContractReadinessMatrixRows() {
  return [
    consumerContractReadinessMatrixRow({
      rowId: "locus.status-control-surface-display",
      consumerId: "locus",
      consumerName: "Locus",
      touchpointName: "status/control-surface display",
      requiredFutureContracts: [
        "locus.status-control-surface.display-contract",
        "ardyn.review-status.snapshot-contract",
        "ardyn.control-surface-readonly-metadata-contract"
      ],
      currentAllowedBehavior:
        "Display deterministic Ardyn status and control-surface metadata as review-only text.",
      explicitlyForbiddenBehavior: [
        "command control",
        "runtime control",
        "process control",
        "live status polling",
        "approval grant persistence"
      ],
      blockerNotes: [
        "Requires a later explicit command/control authorization phase before any interactive Locus control surface can call Ardyn.",
        "Current Phase 5.46 output is documentary metadata only."
      ]
    }),
    consumerContractReadinessMatrixRow({
      rowId: "locus.process-tool-capability-metadata",
      consumerId: "locus",
      consumerName: "Locus",
      touchpointName: "process/tool capability metadata",
      requiredFutureContracts: [
        "locus.process-capability-metadata-contract",
        "locus.tool-capability-metadata-contract",
        "ardyn.non-executing-capability-display-contract"
      ],
      currentAllowedBehavior:
        "Expose static process/tool capability labels for review without tool execution.",
      explicitlyForbiddenBehavior: [
        "process spawn",
        "process termination",
        "tool invocation",
        "stdin loop",
        "stdout/stderr runtime writer"
      ],
      blockerNotes: [
        "Requires separate process-control and tool-execution authorization phases.",
        "No process supervision or stdio runtime writer is introduced."
      ]
    }),
    consumerContractReadinessMatrixRow({
      rowId: "locus.visible-review-artifacts",
      consumerId: "locus",
      consumerName: "Locus",
      touchpointName: "Locus-visible review artifacts",
      requiredFutureContracts: [
        "locus.review-artifact-display-contract",
        "ardyn.review-artifact-index-contract",
        "ardyn.review-only-artifact-provenance-contract"
      ],
      currentAllowedBehavior:
        "List deterministic Ardyn review artifacts and provenance metadata for Locus-visible review.",
      explicitlyForbiddenBehavior: [
        "reviewer routing",
        "reviewer assignment",
        "evaluator execution",
        "evaluator result production",
        "approval decision"
      ],
      blockerNotes: [
        "Requires future review routing and evaluator authorization phases before artifacts can drive assignment or decisions.",
        "Current artifacts remain non-authoritative."
      ]
    }),
    consumerContractReadinessMatrixRow({
      rowId: "locus.future-secure-drop-compose-inbox-surface",
      consumerId: "locus",
      consumerName: "Locus",
      touchpointName: "future Secure Drop compose/inbox consumer surface",
      requiredFutureContracts: [
        "content-fabric.secure-drop.compose-consumer-contract",
        "content-fabric.secure-drop.inbox-consumer-contract",
        "ardyn.future-secure-drop-consumer-boundary-contract"
      ],
      currentAllowedBehavior:
        "Reference future content-fabric Secure Drop compose and inbox contracts by name only.",
      explicitlyForbiddenBehavior: [
        "Secure Drop crypto",
        "Secure Drop transport",
        "stego",
        "send/receive",
        "inbox polling",
        "file selection",
        "filesystem scanning",
        "secret/vault/env access",
        "ST3GG vendoring"
      ],
      blockerNotes: [
        "Requires a later explicit content-fabric Secure Drop authorization phase.",
        "Ardyn does not consume Secure Drop in Phase 5.46."
      ]
    }),
    consumerContractReadinessMatrixRow({
      rowId: "locus.command-control-runtime-boundary",
      consumerId: "locus",
      consumerName: "Locus",
      touchpointName: "command/control runtime boundary",
      requiredFutureContracts: [
        "ardyn.command-control-runtime-authorization-contract",
        "ardyn.command-exposure-precondition-contract",
        "locus.control-surface-command-boundary-contract"
      ],
      currentAllowedBehavior:
        "Document that Locus command/control runtime remains unavailable.",
      explicitlyForbiddenBehavior: [
        "command exposure",
        "runtime permission grant",
        "runtime execution",
        "process control",
        "transcript runtime write",
        "audit runtime write"
      ],
      blockerNotes: [
        "Requires explicit runtime enablement and command exposure authorization.",
        "serve-runtime remains blocked, including dry-run."
      ]
    }),
    consumerContractReadinessMatrixRow({
      rowId: "multiverse.world-project-orchestration-metadata",
      consumerId: "multiverse",
      consumerName: "Multiverse",
      touchpointName: "world/project orchestration metadata",
      requiredFutureContracts: [
        "multiverse.world-project-orchestration-metadata-contract",
        "ardyn.world-project-wrapper-status-contract",
        "ardyn.non-executing-orchestration-reference-contract"
      ],
      currentAllowedBehavior:
        "Record static world/project orchestration metadata for future wrapper planning.",
      explicitlyForbiddenBehavior: [
        "live registry connection",
        "world mutation",
        "project mutation",
        "task execution",
        "adapter runtime behavior"
      ],
      blockerNotes: [
        "Requires future Multiverse orchestration authorization before live registry or project writes.",
        "Phase 5.46 does not connect to Multiverse."
      ]
    }),
    consumerContractReadinessMatrixRow({
      rowId: "multiverse.visible-ai-capability-metadata",
      consumerId: "multiverse",
      consumerName: "Multiverse",
      touchpointName: "visible AI capability metadata",
      requiredFutureContracts: [
        "multiverse.visible-ai-capability-metadata-contract",
        "ardyn.ai-capability-review-only-contract",
        "ardyn.evaluator-non-execution-contract"
      ],
      currentAllowedBehavior:
        "Expose AI capability labels and requirements for review-only planning.",
      explicitlyForbiddenBehavior: [
        "model runtime",
        "evaluator execution",
        "evaluator result production",
        "approval decision",
        "approval grant"
      ],
      blockerNotes: [
        "Requires explicit evaluator and model-runtime authorization phases.",
        "Current metadata cannot trigger AI execution."
      ]
    }),
    consumerContractReadinessMatrixRow({
      rowId: "multiverse.task-capability-wrapper-metadata",
      consumerId: "multiverse",
      consumerName: "Multiverse",
      touchpointName: "task/capability wrapper metadata",
      requiredFutureContracts: [
        "multiverse.task-wrapper-metadata-contract",
        "multiverse.capability-wrapper-metadata-contract",
        "ardyn.task-capability-wrapper-boundary-contract"
      ],
      currentAllowedBehavior:
        "Describe task and capability wrapper metadata without invoking tasks or MCP tools.",
      explicitlyForbiddenBehavior: [
        "task execution",
        "MCP execution",
        "MCP tool exposure",
        "connector grants",
        "runtime command exposure"
      ],
      blockerNotes: [
        "Requires future task runtime and MCP authorization phases.",
        "No MCP tool is exposed by Ardyn in Phase 5.46."
      ]
    }),
    consumerContractReadinessMatrixRow({
      rowId: "multiverse.review-only-citizen-adapter-candidate-metadata",
      consumerId: "multiverse",
      consumerName: "Multiverse",
      touchpointName: "review-only citizen/adapter candidate metadata",
      requiredFutureContracts: [
        "multiverse.citizen-candidate-review-contract",
        "multiverse.adapter-candidate-review-contract",
        "ardyn.connector-grant-precondition-contract"
      ],
      currentAllowedBehavior:
        "Record citizen/adapter candidates as review-only metadata for future consideration.",
      explicitlyForbiddenBehavior: [
        "adapter runtime behavior",
        "connector ingestion",
        "connector grant",
        "HTTP runtime",
        "secret/vault/env access"
      ],
      blockerNotes: [
        "Requires explicit connector and adapter runtime authorization phases.",
        "Candidate metadata is non-authorizing and cannot grant connector access."
      ]
    }),
    consumerContractReadinessMatrixRow({
      rowId: "multiverse.registry-websocket-mcp-task-runtime-boundary",
      consumerId: "multiverse",
      consumerName: "Multiverse",
      touchpointName: "registry/websocket/MCP/task runtime boundary",
      requiredFutureContracts: [
        "multiverse.registry-runtime-authorization-contract",
        "multiverse.websocket-runtime-authorization-contract",
        "multiverse.mcp-task-runtime-authorization-contract",
        "ardyn.runtime-boundary-contract"
      ],
      currentAllowedBehavior:
        "Document that registry, websocket, MCP, and task runtime paths remain unavailable.",
      explicitlyForbiddenBehavior: [
        "live registry connection",
        "websocket runtime",
        "HTTP runtime",
        "MCP tool exposure",
        "MCP execution",
        "task execution"
      ],
      blockerNotes: [
        "Requires explicit registry, websocket, MCP, and task runtime authorization phases.",
        "Fallow remains advisory only and Fallow Runtime is not used."
      ]
    }),
    consumerContractReadinessMatrixRow({
      rowId: "multiverse.fabric-coordination-metadata",
      consumerId: "multiverse",
      consumerName: "Multiverse",
      touchpointName: "Fabric coordination metadata",
      requiredFutureContracts: [
        "multiverse.fabric-coordination-metadata-contract",
        "ardyn.fabric-runtime-authorization-contract",
        "content-fabric.runtime-behavior-authorization-contract"
      ],
      currentAllowedBehavior:
        "Record Fabric coordination references as metadata only.",
      explicitlyForbiddenBehavior: [
        "Fabric runtime surface",
        "content-fabric runtime behavior",
        "adapter runtime behavior",
        "websocket/HTTP runtime",
        "Secure Drop implementation"
      ],
      blockerNotes: [
        "Requires separate Fabric and content-fabric runtime authorization phases.",
        "Secure Drop remains a future content-fabric capability reference only."
      ]
    })
  ];
}

function consumerContractReadinessMatrixSummary(rows) {
  return {
    consumerContractReadinessMatrixKind:
      CONSUMER_CONTRACT_READINESS_MATRIX_KIND,
    consumerContractReadinessMatrixMode: "review-only",
    sourceTargetConsumerPlanningMetadataAccepted: true,
    targetConsumerIds: ["locus", "multiverse"],
    targetConsumerCount: 2,
    rowCount: rows.length,
    locusRowCount: rows.filter(({ consumerId }) => consumerId === "locus")
      .length,
    multiverseRowCount: rows.filter(
      ({ consumerId }) => consumerId === "multiverse"
    ).length,
    locusStatusControlSurfaceDisplayCovered: true,
    locusProcessToolCapabilityMetadataCovered: true,
    locusVisibleReviewArtifactsCovered: true,
    locusFutureSecureDropComposeInboxConsumerSurfaceCovered: true,
    locusCommandControlRuntimeBoundaryCovered: true,
    multiverseWorldProjectOrchestrationMetadataCovered: true,
    multiverseVisibleAiCapabilityMetadataCovered: true,
    multiverseTaskCapabilityWrapperMetadataCovered: true,
    multiverseReviewOnlyCitizenAdapterCandidateMetadataCovered: true,
    multiverseRegistryWebSocketMcpTaskRuntimeBoundaryCovered: true,
    multiverseFabricCoordinationMetadataCovered: true,
    metadataOnly: true,
    reviewOnly: true,
    authoritative: false,
    runtimeAuthorizationGranted: false,
    commandAuthorizationGranted: false,
    connectorAuthorizationGranted: false,
    fabricRuntimeAuthorizationGranted: false,
    webSocketRuntimeAuthorizationGranted: false,
    mcpRuntimeAuthorizationGranted: false,
    taskRuntimeAuthorizationGranted: false,
    secureDropAuthorizationGranted: false
  };
}

function consumerContractReadinessMatrixSourceSummary(sourceState, sourceDigest) {
  return {
    schema: sourceState.schema,
    stateKind: sourceState.stateKind,
    stateMode: sourceState.stateMode,
    reviewedAt: sourceState.reviewedAt,
    stateDigest: sourceDigest,
    targetConsumerPlanningMetadataOnly: true,
    firstClassTargetConsumerIds: sourceState.targetConsumerIds,
    locusFirstClassTargetConsumer: true,
    multiverseFirstClassTargetConsumer: true,
    secureDropFutureContentFabricCapabilityReferenceOnly: true,
    runtimeEffectAllFalse: true
  };
}

function consumerContractReadinessMatrixStateFromSource(
  sourceState,
  reviewedAt,
  sourceDigest
) {
  const rows = consumerContractReadinessMatrixRows();

  return {
    schema: CONSUMER_CONTRACT_READINESS_MATRIX_STATE_SCHEMA,
    schemaVersion: CONSUMER_CONTRACT_READINESS_MATRIX_VERSION,
    stateKind: "consumer-contract-readiness-matrix-state",
    stateMode: "review-only",
    reviewedAt,
    sourceTargetConsumerPlanningMetadata:
      consumerContractReadinessMatrixSourceSummary(sourceState, sourceDigest),
    matrixRows: rows,
    matrixSummary: consumerContractReadinessMatrixSummary(rows),
    targetConsumerIds: ["locus", "multiverse"],
    consumerContractReadinessMatrixOnly: true,
    reviewOnly: true,
    authoritative: false,
    reviewArtifactOnly: true,
    consumerContractReadinessMatrixIsReviewerRouting: false,
    consumerContractReadinessMatrixIsReviewerAssignment: false,
    consumerContractReadinessMatrixIsEvaluatorExecution: false,
    consumerContractReadinessMatrixIsEvaluatorResult: false,
    consumerContractReadinessMatrixIsApprovalDecision: false,
    consumerContractReadinessMatrixIsApprovalGrant: false,
    ...consumerContractReadinessMatrixForbiddenBehavior(),
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

function consumerContractReadinessMatrixAcceptedOutput({
  accepted,
  sourceStates,
  reviewedAt,
  sourceDigest
}) {
  if (!accepted) {
    return {
      consumerContractReadinessMatrix: null,
      sourceTargetConsumerPlanningMetadataSummary: null
    };
  }

  const sourceState = sourceStates[0];

  return {
    consumerContractReadinessMatrix:
      consumerContractReadinessMatrixStateFromSource(
        sourceState,
        reviewedAt,
        sourceDigest
      ),
    sourceTargetConsumerPlanningMetadataSummary:
      consumerContractReadinessMatrixSourceSummary(sourceState, sourceDigest)
  };
}

function consumerContractReadinessMatrixRejectionReasons({
  accepted,
  classification
}) {
  if (accepted) {
    return [
      "consumer_contract_readiness_matrix_is_review_only",
      "locus_and_multiverse_touchpoints_mapped_to_future_contracts",
      "runtime_command_connector_fabric_websocket_mcp_task_secure_drop_authorizations_false",
      "secure_drop_is_future_content_fabric_capability_reference_only",
      "fallow_runtime_not_used",
      "runtime_enablement_still_blocked"
    ];
  }

  return [
    classification,
    "consumer_contract_readiness_matrix_not_produced",
    "runtime_command_connector_fabric_websocket_mcp_task_secure_drop_authorizations_false",
    "runtime_enablement_still_blocked"
  ];
}

function consumerContractReadinessMatrixResult({
  reviewedAt,
  reviewedAtDefaulted,
  classification,
  accepted,
  consumerContractReadinessMatrix,
  sourceTargetConsumerPlanningMetadataSummary
}) {
  return {
    schema: CONSUMER_CONTRACT_READINESS_MATRIX_SCHEMA,
    schemaVersion: CONSUMER_CONTRACT_READINESS_MATRIX_VERSION,
    consumerContractReadinessMatrixKind:
      CONSUMER_CONTRACT_READINESS_MATRIX_KIND,
    consumerContractReadinessMatrixMode: "review-only",
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    sourceTargetConsumerPlanningMetadataAccepted: accepted,
    consumerContractReadinessMatrixProduced: accepted,
    consumerContractReadinessMatrix,
    sourceTargetConsumerPlanningMetadataSummary,
    matrixSummary: accepted ? consumerContractReadinessMatrix.matrixSummary : null,
    matrixRows: accepted ? consumerContractReadinessMatrix.matrixRows : [],
    targetConsumerIds: accepted
      ? consumerContractReadinessMatrix.targetConsumerIds
      : [],
    reviewOnly: true,
    authoritative: false,
    reviewArtifactOnly: true,
    consumerContractReadinessMatrixOnly: true,
    consumerContractReadinessMatrixIsReviewerRouting: false,
    consumerContractReadinessMatrixIsReviewerAssignment: false,
    consumerContractReadinessMatrixIsEvaluatorExecution: false,
    consumerContractReadinessMatrixIsEvaluatorResult: false,
    consumerContractReadinessMatrixIsApprovalDecision: false,
    consumerContractReadinessMatrixIsApprovalGrant: false,
    ...consumerContractReadinessMatrixForbiddenBehavior(),
    rejectionReasons:
      consumerContractReadinessMatrixRejectionReasons({
        accepted,
        classification
      }),
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

export function createConsumerContractReadinessMatrixForReview(input = {}) {
  const inputRecord = consumerContractReadinessMatrixInputRecord(input);
  const reviewedAt = consumerContractReadinessMatrixReviewedAt(inputRecord);
  const reviewedAtDefaulted = isReviewedAtDefaulted(inputRecord);
  const sourceStates = consumerContractReadinessMatrixEntries(inputRecord);
  const sourceDigest = consumerContractReadinessMatrixSourceDigest(inputRecord);
  const classification = consumerContractReadinessMatrixInputClassification({
    inputRecord,
    sourceStates,
    sourceDigest
  });
  const accepted =
    classification ===
    VALID_CONSUMER_CONTRACT_READINESS_MATRIX_CLASSIFICATION;
  const {
    consumerContractReadinessMatrix,
    sourceTargetConsumerPlanningMetadataSummary
  } = consumerContractReadinessMatrixAcceptedOutput({
    accepted,
    sourceStates,
    reviewedAt,
    sourceDigest
  });

  return consumerContractReadinessMatrixResult({
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    accepted,
    consumerContractReadinessMatrix,
    sourceTargetConsumerPlanningMetadataSummary
  });
}

const CONSUMER_CONTRACT_GAP_INDEX_STATE_SCHEMA =
  "ardyn.phase-5.47.consumer-contract-gap-index-state";
const VALID_CONSUMER_CONTRACT_GAP_INDEX_CLASSIFICATION =
  "valid_consumer_contract_gap_index_runtime_still_blocked";
const MALFORMED_CONSUMER_CONTRACT_GAP_INDEX_CLASSIFICATION =
  "malformed_consumer_contract_gap_index_input_rejected";
const MISMATCHED_SOURCE_DIGEST_CONSUMER_CONTRACT_GAP_INDEX_CLASSIFICATION =
  "mismatched_source_digest_consumer_contract_gap_index_input_rejected";

const CONSUMER_CONTRACT_GAP_INDEX_SOURCE_LITERAL_FIELDS = Object.freeze([
  ["schema", CONSUMER_CONTRACT_READINESS_MATRIX_STATE_SCHEMA],
  ["schemaVersion", CONSUMER_CONTRACT_READINESS_MATRIX_VERSION],
  ["stateKind", "consumer-contract-readiness-matrix-state"],
  ["stateMode", "review-only"],
  ["consumerContractReadinessMatrixOnly", true],
  ["reviewOnly", true],
  ["authoritative", false],
  ["reviewArtifactOnly", true]
]);

const CONSUMER_CONTRACT_GAP_INDEX_SOURCE_FALSE_FIELDS = Object.freeze([
  "consumerContractReadinessMatrixIsReviewerRouting",
  "consumerContractReadinessMatrixIsReviewerAssignment",
  "consumerContractReadinessMatrixIsEvaluatorExecution",
  "consumerContractReadinessMatrixIsEvaluatorResult",
  "consumerContractReadinessMatrixIsApprovalDecision",
  "consumerContractReadinessMatrixIsApprovalGrant",
  ...Object.keys(consumerContractReadinessMatrixForbiddenBehavior())
]);

const CONSUMER_CONTRACT_GAP_INDEX_REVIEWER_ROUTING_TRUE_FIELDS =
  Object.freeze([
    "consumerContractGapIndexIsReviewerRouting",
    "reviewerRoutingPerformed",
    "reviewerRoutingEnabled"
  ]);
const CONSUMER_CONTRACT_GAP_INDEX_REVIEWER_ASSIGNMENT_TRUE_FIELDS =
  Object.freeze([
    "consumerContractGapIndexIsReviewerAssignment",
    "reviewerAssignmentPerformed",
    "reviewerAssignmentEnabled"
  ]);
const CONSUMER_CONTRACT_GAP_INDEX_EVALUATOR_EXECUTION_TRUE_FIELDS =
  Object.freeze([
    "consumerContractGapIndexIsEvaluatorExecution",
    "evaluatorExecutionPerformed",
    "evaluatorExecutionRequested",
    "evaluatorExecutionStarted",
    "evaluatorExecutionEnabled",
    "evaluatorExecuted"
  ]);
const CONSUMER_CONTRACT_GAP_INDEX_EVALUATOR_RESULT_TRUE_FIELDS =
  Object.freeze([
    "consumerContractGapIndexIsEvaluatorResult",
    "evaluatorResultProduced",
    "evaluatorResultPersisted"
  ]);
const CONSUMER_CONTRACT_GAP_INDEX_APPROVAL_DECISION_TRUE_FIELDS =
  Object.freeze([
    "consumerContractGapIndexIsApprovalDecision",
    "approvalDecisionProduced",
    "approvalDecisionPersisted"
  ]);
const CONSUMER_CONTRACT_GAP_INDEX_GRANT_TRUE_FIELDS = Object.freeze([
  "consumerContractGapIndexIsApprovalGrant",
  "approvalGrantProduced",
  "approvalGrantPersisted",
  "connectorGrantProduced",
  "connectorPermissionGranted",
  "connectorAccessGranted"
]);
const CONSUMER_CONTRACT_GAP_INDEX_RUNTIME_PERMISSION_TRUE_FIELDS =
  Object.freeze([
    "runtimePermissionGranted",
    "runtimeEnablementApproved",
    "canEnableRuntime"
  ]);
const CONSUMER_CONTRACT_GAP_INDEX_COMMAND_EXPOSURE_TRUE_FIELDS =
  Object.freeze([
    "commandExposurePermissionGranted",
    "runtimeCommandExposureEnabled",
    "commandRuntimeControlEnabled",
    "commandControlEnabled"
  ]);
const CONSUMER_CONTRACT_GAP_INDEX_PROCESS_TRUE_FIELDS = Object.freeze([
  "processControlEnabled",
  "processSpawnEnabled",
  "processTerminationEnabled",
  "runtimeSupervisionEnabled"
]);
const CONSUMER_CONTRACT_GAP_INDEX_UNSAFE_RUNTIME_TRUE_FIELDS = Object.freeze([
  "runtimeEnabled",
  "runtimeStarted",
  "runtimeReady",
  "runtimeCommandEnabled",
  "runtimeCommandExposureEnabled",
  "runtimeExecutionEnabled",
  "runtimeExecuted",
  "liveRegistryConnectionEnabled",
  "webSocketRuntimeEnabled",
  "httpRuntimeEnabled",
  "taskRuntimeExecutionEnabled",
  "taskExecutionEnabled",
  "mcpRuntimeExecutionEnabled",
  "mcpExecutionEnabled",
  "mcpToolExposureEnabled",
  "fabricRuntimeSurfaceEnabled",
  "contentFabricRuntimeBehaviorEnabled",
  "adapterRuntimeBehaviorEnabled",
  "filesystemWatcherEnabled",
  "externalSourceLookupEnabled",
  "fileSelectionEnabled",
  "filesystemScanningEnabled",
  "connectorIngestionAdded",
  "secretVaultEnvAccessEnabled",
  "secureDropImplemented",
  "secureDropCryptoImplemented",
  "secureDropTransportImplemented",
  "secureDropStegoImplemented",
  "secureDropSendReceiveImplemented",
  "secureDropInboxPollingEnabled",
  "st3ggVendored",
  "transcriptRuntimeWritePerformed",
  "auditRuntimeWritePerformed",
  "runtimeStdoutWriterEnabled",
  "runtimeStderrWriterEnabled",
  "liveStdinLoopEnabled"
]);

const CONSUMER_CONTRACT_GAP_INDEX_REQUIRED_ROW_IDS = Object.freeze([
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

const CONSUMER_CONTRACT_GAP_INDEX_ENTRY_PLAN = Object.freeze([
  {
    sourceRowId: "locus.status-control-surface-display",
    consumerId: "locus",
    consumerName: "Locus",
    gapId: "locus.status-control-surface-display-contract-gap",
    proposedFuturePhaseFamily: "locus-status-control-display-authorization"
  },
  {
    sourceRowId: "locus.process-tool-capability-metadata",
    consumerId: "locus",
    consumerName: "Locus",
    gapId: "locus.process-tool-capability-metadata-contract-gap",
    proposedFuturePhaseFamily:
      "locus-process-tool-capability-metadata-authorization"
  },
  {
    sourceRowId: "locus.visible-review-artifacts",
    consumerId: "locus",
    consumerName: "Locus",
    gapId: "locus.visible-review-artifact-contract-gap",
    proposedFuturePhaseFamily: "locus-visible-review-artifact-authorization"
  },
  {
    sourceRowId: "locus.future-secure-drop-compose-inbox-surface",
    consumerId: "locus",
    consumerName: "Locus",
    gapId: "locus.future-secure-drop-compose-inbox-consumer-contract-gap",
    proposedFuturePhaseFamily:
      "locus-future-secure-drop-consumer-authorization"
  },
  {
    sourceRowId: "locus.command-control-runtime-boundary",
    consumerId: "locus",
    consumerName: "Locus",
    gapId: "locus.command-control-runtime-authorization-boundary-gap",
    proposedFuturePhaseFamily:
      "locus-command-control-runtime-authorization-boundary"
  },
  {
    sourceRowId: "multiverse.world-project-orchestration-metadata",
    consumerId: "multiverse",
    consumerName: "Multiverse",
    gapId: "multiverse.world-project-orchestration-metadata-contract-gap",
    proposedFuturePhaseFamily:
      "multiverse-world-project-orchestration-metadata-authorization"
  },
  {
    sourceRowId: "multiverse.visible-ai-capability-metadata",
    consumerId: "multiverse",
    consumerName: "Multiverse",
    gapId: "multiverse.visible-ai-capability-metadata-contract-gap",
    proposedFuturePhaseFamily:
      "multiverse-visible-ai-capability-metadata-authorization"
  },
  {
    sourceRowId: "multiverse.task-capability-wrapper-metadata",
    consumerId: "multiverse",
    consumerName: "Multiverse",
    gapId: "multiverse.task-capability-wrapper-metadata-contract-gap",
    proposedFuturePhaseFamily:
      "multiverse-task-capability-wrapper-metadata-authorization"
  },
  {
    sourceRowId: "multiverse.review-only-citizen-adapter-candidate-metadata",
    consumerId: "multiverse",
    consumerName: "Multiverse",
    gapId: "multiverse.review-only-citizen-adapter-candidate-contract-gap",
    proposedFuturePhaseFamily:
      "multiverse-citizen-adapter-candidate-review-authorization"
  },
  {
    sourceRowId: "multiverse.fabric-coordination-metadata",
    consumerId: "multiverse",
    consumerName: "Multiverse",
    gapId: "multiverse.fabric-coordination-metadata-contract-gap",
    proposedFuturePhaseFamily:
      "multiverse-fabric-coordination-metadata-authorization"
  },
  {
    sourceRowId: "multiverse.registry-websocket-mcp-task-runtime-boundary",
    consumerId: "multiverse",
    consumerName: "Multiverse",
    gapId: "multiverse.registry-websocket-mcp-task-runtime-authorization-boundary-gap",
    proposedFuturePhaseFamily:
      "multiverse-registry-websocket-mcp-task-runtime-authorization-boundary"
  }
]);

function consumerContractGapIndexInputRecord(input) {
  return isPlainObjectRecord(input) ? input : null;
}

function consumerContractGapIndexReviewedAt(inputRecord) {
  if (
    inputRecord === null ||
    !Object.prototype.hasOwnProperty.call(inputRecord, "reviewedAt")
  ) {
    return APPROVAL_PREREQUISITE_SOURCE_PREFLIGHT_DEFAULT_REVIEWED_AT;
  }

  return isUtcIsoTimestampWithMilliseconds(inputRecord.reviewedAt)
    ? inputRecord.reviewedAt
    : APPROVAL_PREREQUISITE_SOURCE_PREFLIGHT_DEFAULT_REVIEWED_AT;
}

function consumerContractGapIndexInputMalformed(inputRecord) {
  return (
    inputRecord === null ||
    (Object.prototype.hasOwnProperty.call(inputRecord, "reviewedAt") &&
      !isUtcIsoTimestampWithMilliseconds(inputRecord.reviewedAt))
  );
}

function consumerContractGapIndexEntries(inputRecord) {
  return inputRecord === null
    ? undefined
    : inputRecord.consumerContractReadinessMatrixEntries;
}

function consumerContractGapIndexSourceDigest(inputRecord) {
  return inputRecord === null
    ? undefined
    : inputRecord.sourceConsumerContractReadinessMatrixDigest;
}

function consumerContractGapIndexDigestMissing(inputRecord) {
  return (
    inputRecord === null ||
    !Object.prototype.hasOwnProperty.call(
      inputRecord,
      "sourceConsumerContractReadinessMatrixDigest"
    )
  );
}

function consumerContractGapIndexSourceDigestMatches(
  sourceStates,
  sourceDigest
) {
  return (
    Array.isArray(sourceStates) &&
    sourceStates.length === 1 &&
    isPlainObjectRecord(sourceStates[0]) &&
    sourceDigest === reviewArtifactHandoffDigest(sourceStates[0])
  );
}

function consumerContractGapIndexSourceRowById(sourceState, rowId) {
  return Array.isArray(sourceState.matrixRows)
    ? sourceState.matrixRows.find((row) => row.rowId === rowId)
    : undefined;
}

function consumerContractGapIndexSourceRowValid(row, rowId) {
  const plan = CONSUMER_CONTRACT_GAP_INDEX_ENTRY_PLAN.find(
    (entryPlan) => entryPlan.sourceRowId === rowId
  );

  return (
    isPlainObjectRecord(plan) &&
    isPlainObjectRecord(row) &&
    row.rowId === rowId &&
    row.consumerId === plan.consumerId &&
    row.consumerName === plan.consumerName &&
    typeof row.touchpointName === "string" &&
    row.touchpointName.length > 0 &&
    row.readinessState === "future-contract-required-runtime-blocked" &&
    Array.isArray(row.requiredFutureContracts) &&
    row.requiredFutureContracts.length >= 3 &&
    row.requiredFutureContracts.every((contract) => typeof contract === "string") &&
    typeof row.currentAllowedBehavior === "string" &&
    row.currentAllowedBehavior.length > 0 &&
    Array.isArray(row.explicitlyForbiddenBehavior) &&
    row.explicitlyForbiddenBehavior.length >= 5 &&
    row.explicitlyForbiddenBehavior.every(
      (behavior) => typeof behavior === "string"
    ) &&
    Array.isArray(row.blockerNotes) &&
    row.blockerNotes.length >= 2 &&
    row.blockerNotes.every((note) => typeof note === "string") &&
    isPlainObjectRecord(row.authorizationFlags) &&
    row.authorizationFlags.documentaryMetadataVisible === true &&
    Object.entries(row.authorizationFlags).every(([field, value]) =>
      field === "documentaryMetadataVisible" ? value === true : value === false
    )
  );
}

function consumerContractGapIndexSourceValid(sourceState) {
  return (
    isPlainObjectRecord(sourceState) &&
    isUtcIsoTimestampWithMilliseconds(sourceState.reviewedAt) &&
    reviewOnlyInspectionHandoffMetadataBoundaryFieldsEqual(
      sourceState,
      CONSUMER_CONTRACT_GAP_INDEX_SOURCE_LITERAL_FIELDS
    ) &&
    CONSUMER_CONTRACT_GAP_INDEX_SOURCE_FALSE_FIELDS.every(
      (field) => sourceState[field] === false
    ) &&
    Array.isArray(sourceState.targetConsumerIds) &&
    sourceState.targetConsumerIds.length === 2 &&
    sourceState.targetConsumerIds[0] === "locus" &&
    sourceState.targetConsumerIds[1] === "multiverse" &&
    Array.isArray(sourceState.matrixRows) &&
    sourceState.matrixRows.length ===
      CONSUMER_CONTRACT_GAP_INDEX_REQUIRED_ROW_IDS.length &&
    CONSUMER_CONTRACT_GAP_INDEX_REQUIRED_ROW_IDS.every(
      (rowId, index) =>
        sourceState.matrixRows[index]?.rowId === rowId &&
        consumerContractGapIndexSourceRowValid(sourceState.matrixRows[index], rowId)
    ) &&
    isPlainObjectRecord(sourceState.matrixSummary) &&
    sourceState.matrixSummary.rowCount === 11 &&
    sourceState.matrixSummary.locusRowCount === 5 &&
    sourceState.matrixSummary.multiverseRowCount === 6 &&
    sourceState.matrixSummary.locusStatusControlSurfaceDisplayCovered === true &&
    sourceState.matrixSummary.locusProcessToolCapabilityMetadataCovered === true &&
    sourceState.matrixSummary.locusVisibleReviewArtifactsCovered === true &&
    sourceState.matrixSummary
      .locusFutureSecureDropComposeInboxConsumerSurfaceCovered === true &&
    sourceState.matrixSummary.locusCommandControlRuntimeBoundaryCovered === true &&
    sourceState.matrixSummary
      .multiverseWorldProjectOrchestrationMetadataCovered === true &&
    sourceState.matrixSummary.multiverseVisibleAiCapabilityMetadataCovered ===
      true &&
    sourceState.matrixSummary.multiverseTaskCapabilityWrapperMetadataCovered ===
      true &&
    sourceState.matrixSummary
      .multiverseReviewOnlyCitizenAdapterCandidateMetadataCovered === true &&
    sourceState.matrixSummary
      .multiverseRegistryWebSocketMcpTaskRuntimeBoundaryCovered === true &&
    sourceState.matrixSummary.multiverseFabricCoordinationMetadataCovered ===
      true &&
    sourceState.matrixSummary.metadataOnly === true &&
    sourceState.matrixSummary.reviewOnly === true &&
    sourceState.matrixSummary.authoritative === false &&
    sourceState.matrixSummary.runtimeAuthorizationGranted === false &&
    sourceState.matrixSummary.commandAuthorizationGranted === false &&
    sourceState.matrixSummary.connectorAuthorizationGranted === false &&
    sourceState.matrixSummary.fabricRuntimeAuthorizationGranted === false &&
    sourceState.matrixSummary.webSocketRuntimeAuthorizationGranted === false &&
    sourceState.matrixSummary.mcpRuntimeAuthorizationGranted === false &&
    sourceState.matrixSummary.taskRuntimeAuthorizationGranted === false &&
    sourceState.matrixSummary.secureDropAuthorizationGranted === false &&
    isPlainObjectRecord(sourceState.sourceTargetConsumerPlanningMetadata) &&
    sourceState.sourceTargetConsumerPlanningMetadata
      .secureDropFutureContentFabricCapabilityReferenceOnly === true &&
    sourceState.sourceTargetConsumerPlanningMetadata.runtimeEffectAllFalse ===
      true &&
    reviewOnlyInspectionHandoffMetadataBoundaryRuntimeEffectAllFalse(
      sourceState.runtimeEffect
    )
  );
}

function consumerContractGapIndexKeyTruePresent(sourceState, fields) {
  return reviewOnlyInspectionHandoffMetadataBoundaryKeyTruePresent(
    sourceState,
    fields
  );
}

function consumerContractGapIndexUnsafeRuntimeSignal(sourceState) {
  return (
    consumerContractGapIndexKeyTruePresent(
      sourceState,
      CONSUMER_CONTRACT_GAP_INDEX_UNSAFE_RUNTIME_TRUE_FIELDS
    ) ||
    reviewOnlyInspectionHandoffMetadataBoundaryKeyTruePresent(
      sourceState,
      CONSUMER_CONTRACT_GAP_INDEX_PROCESS_TRUE_FIELDS
    )
  );
}

function consumerContractGapIndexSingleClassification(sourceState) {
  if (
    consumerContractGapIndexKeyTruePresent(
      sourceState,
      CONSUMER_CONTRACT_GAP_INDEX_GRANT_TRUE_FIELDS
    )
  ) {
    return "grant_looking_consumer_contract_gap_index_input_rejected";
  }

  if (
    consumerContractGapIndexKeyTruePresent(
      sourceState,
      CONSUMER_CONTRACT_GAP_INDEX_APPROVAL_DECISION_TRUE_FIELDS
    )
  ) {
    return "approval_decision_looking_consumer_contract_gap_index_input_rejected";
  }

  if (
    consumerContractGapIndexKeyTruePresent(
      sourceState,
      CONSUMER_CONTRACT_GAP_INDEX_EVALUATOR_RESULT_TRUE_FIELDS
    )
  ) {
    return "evaluator_result_looking_consumer_contract_gap_index_input_rejected";
  }

  if (
    consumerContractGapIndexKeyTruePresent(
      sourceState,
      CONSUMER_CONTRACT_GAP_INDEX_EVALUATOR_EXECUTION_TRUE_FIELDS
    )
  ) {
    return "evaluator_execution_looking_consumer_contract_gap_index_input_rejected";
  }

  if (
    consumerContractGapIndexKeyTruePresent(
      sourceState,
      CONSUMER_CONTRACT_GAP_INDEX_REVIEWER_ROUTING_TRUE_FIELDS
    )
  ) {
    return "reviewer_routing_looking_consumer_contract_gap_index_input_rejected";
  }

  if (
    consumerContractGapIndexKeyTruePresent(
      sourceState,
      CONSUMER_CONTRACT_GAP_INDEX_REVIEWER_ASSIGNMENT_TRUE_FIELDS
    )
  ) {
    return "reviewer_assignment_looking_consumer_contract_gap_index_input_rejected";
  }

  if (
    consumerContractGapIndexKeyTruePresent(
      sourceState,
      CONSUMER_CONTRACT_GAP_INDEX_RUNTIME_PERMISSION_TRUE_FIELDS
    )
  ) {
    return "runtime_permission_looking_consumer_contract_gap_index_input_rejected";
  }

  if (
    consumerContractGapIndexKeyTruePresent(
      sourceState,
      CONSUMER_CONTRACT_GAP_INDEX_COMMAND_EXPOSURE_TRUE_FIELDS
    )
  ) {
    return "command_exposure_looking_consumer_contract_gap_index_input_rejected";
  }

  if (
    isPlainObjectRecord(sourceState) &&
    isPlainObjectRecord(sourceState.runtimeEffect) &&
    !reviewOnlyInspectionHandoffMetadataBoundaryRuntimeEffectAllFalse(
      sourceState.runtimeEffect
    )
  ) {
    return "runtime_effect_true_consumer_contract_gap_index_input_rejected";
  }

  if (
    consumerContractGapIndexKeyTruePresent(
      sourceState,
      CONSUMER_CONTRACT_GAP_INDEX_PROCESS_TRUE_FIELDS
    )
  ) {
    return "process_flag_true_consumer_contract_gap_index_input_rejected";
  }

  if (consumerContractGapIndexUnsafeRuntimeSignal(sourceState)) {
    return "execution_signal_looking_consumer_contract_gap_index_input_rejected";
  }

  return consumerContractGapIndexSourceValid(sourceState)
    ? VALID_CONSUMER_CONTRACT_GAP_INDEX_CLASSIFICATION
    : MALFORMED_CONSUMER_CONTRACT_GAP_INDEX_CLASSIFICATION;
}

function consumerContractGapIndexInputRejection(sourceStates) {
  if (sourceStates === undefined) {
    return "missing_consumer_contract_gap_index_input_rejected";
  }

  if (!Array.isArray(sourceStates)) {
    return MALFORMED_CONSUMER_CONTRACT_GAP_INDEX_CLASSIFICATION;
  }

  if (sourceStates.length === 0) {
    return "empty_consumer_contract_gap_index_input_rejected";
  }

  if (sourceStates.some((entry) => !isPlainObjectRecord(entry))) {
    return MALFORMED_CONSUMER_CONTRACT_GAP_INDEX_CLASSIFICATION;
  }

  return sourceStates.length > 1
    ? "duplicate_invalid_consumer_contract_gap_index_input_rejected"
    : undefined;
}

function consumerContractGapIndexInputClassification({
  inputRecord,
  sourceStates,
  sourceDigest
}) {
  if (consumerContractGapIndexInputMalformed(inputRecord)) {
    return MALFORMED_CONSUMER_CONTRACT_GAP_INDEX_CLASSIFICATION;
  }

  const inputRejection = consumerContractGapIndexInputRejection(sourceStates);

  if (inputRejection !== undefined) {
    return inputRejection;
  }

  if (
    consumerContractGapIndexDigestMissing(inputRecord) ||
    !reviewOnlyMetadataHandoffCheckpointDigestString(sourceDigest)
  ) {
    return MALFORMED_CONSUMER_CONTRACT_GAP_INDEX_CLASSIFICATION;
  }

  if (!consumerContractGapIndexSourceDigestMatches(sourceStates, sourceDigest)) {
    return MISMATCHED_SOURCE_DIGEST_CONSUMER_CONTRACT_GAP_INDEX_CLASSIFICATION;
  }

  return consumerContractGapIndexSingleClassification(sourceStates[0]);
}

function consumerContractGapIndexAuthorizationStatusFlags() {
  return {
    runtimeAuthorizationGranted: false,
    commandAuthorizationGranted: false,
    connectorAuthorizationGranted: false,
    fabricRuntimeAuthorizationGranted: false,
    webSocketRuntimeAuthorizationGranted: false,
    httpRuntimeAuthorizationGranted: false,
    mcpRuntimeAuthorizationGranted: false,
    mcpToolExposureAuthorizationGranted: false,
    taskRuntimeAuthorizationGranted: false,
    secureDropAuthorizationGranted: false,
    reviewerRoutingAuthorizationGranted: false,
    evaluatorExecutionAuthorizationGranted: false,
    approvalDecisionAuthorizationGranted: false,
    approvalGrantProduced: false
  };
}

function consumerContractGapIndexEntry(sourceState, plan) {
  const sourceRow = consumerContractGapIndexSourceRowById(
    sourceState,
    plan.sourceRowId
  );

  return {
    consumerName: plan.consumerName,
    consumerId: plan.consumerId,
    gapId: plan.gapId,
    sourceReadinessMatrixTouchpoint: sourceRow.touchpointName,
    sourceReadinessMatrixRowId: sourceRow.rowId,
    proposedFuturePhaseFamily: plan.proposedFuturePhaseFamily,
    requiredPrerequisiteContracts: [...sourceRow.requiredFutureContracts],
    allowedCurrentBehavior: sourceRow.currentAllowedBehavior,
    forbiddenCurrentBehavior: [...sourceRow.explicitlyForbiddenBehavior],
    authorizationStatusFlags: consumerContractGapIndexAuthorizationStatusFlags(),
    blockerNotes: [...sourceRow.blockerNotes],
    planningMetadataEvidence: {
      planningMetadataOnly: true,
      reviewOnly: true,
      authoritative: false,
      sourcePhase: "5.46",
      sourceReadinessMatrixRowId: sourceRow.rowId,
      sourceReadinessMatrixStateKind: sourceState.stateKind,
      sourceReadinessMatrixRuntimeEffectAllFalse: true,
      runtimeEffectAllFalse: true,
      noCommandRuntimeControl: true,
      noConnectorGrant: true,
      noFabricRuntime: true,
      noWebsocketRuntime: true,
      noMcpRuntime: true,
      noTaskRuntime: true,
      noSecureDropRuntime: true
    }
  };
}

function consumerContractGapIndexEntriesFromSource(sourceState) {
  return CONSUMER_CONTRACT_GAP_INDEX_ENTRY_PLAN.map((plan) =>
    consumerContractGapIndexEntry(sourceState, plan)
  );
}

function consumerContractGapIndexGroups(entries) {
  return [
    {
      consumerId: "locus",
      consumerName: "Locus",
      futureAuthorizationCandidateBuckets: [
        "status/control-surface display contract",
        "process/tool capability metadata contract",
        "Locus-visible review artifact contract",
        "future Secure Drop compose/inbox consumer contract",
        "command/control runtime authorization boundary"
      ],
      gapIds: entries
        .filter((entry) => entry.consumerId === "locus")
        .map((entry) => entry.gapId),
      runtimeAuthorizationGranted: false,
      commandAuthorizationGranted: false,
      connectorAuthorizationGranted: false,
      secureDropAuthorizationGranted: false
    },
    {
      consumerId: "multiverse",
      consumerName: "Multiverse",
      futureAuthorizationCandidateBuckets: [
        "world/project orchestration metadata contract",
        "visible AI capability metadata contract",
        "task/capability wrapper metadata contract",
        "review-only citizen/adapter candidate contract",
        "Fabric coordination metadata contract",
        "registry/websocket/MCP/task runtime authorization boundary"
      ],
      gapIds: entries
        .filter((entry) => entry.consumerId === "multiverse")
        .map((entry) => entry.gapId),
      runtimeAuthorizationGranted: false,
      commandAuthorizationGranted: false,
      connectorAuthorizationGranted: false,
      fabricRuntimeAuthorizationGranted: false,
      webSocketRuntimeAuthorizationGranted: false,
      mcpRuntimeAuthorizationGranted: false,
      taskRuntimeAuthorizationGranted: false
    }
  ];
}

function consumerContractGapIndexSummary(entries) {
  return {
    consumerContractGapIndexKind: CONSUMER_CONTRACT_GAP_INDEX_KIND,
    consumerContractGapIndexMode: "review-only",
    sourceConsumerContractReadinessMatrixAccepted: true,
    targetConsumerIds: ["locus", "multiverse"],
    targetConsumerCount: 2,
    gapEntryCount: entries.length,
    locusGapCount: entries.filter(({ consumerId }) => consumerId === "locus")
      .length,
    multiverseGapCount: entries.filter(
      ({ consumerId }) => consumerId === "multiverse"
    ).length,
    locusStatusControlSurfaceDisplayContractGapCovered: true,
    locusProcessToolCapabilityMetadataContractGapCovered: true,
    locusVisibleReviewArtifactContractGapCovered: true,
    locusFutureSecureDropComposeInboxConsumerContractGapCovered: true,
    locusCommandControlRuntimeAuthorizationBoundaryGapCovered: true,
    multiverseWorldProjectOrchestrationMetadataContractGapCovered: true,
    multiverseVisibleAiCapabilityMetadataContractGapCovered: true,
    multiverseTaskCapabilityWrapperMetadataContractGapCovered: true,
    multiverseReviewOnlyCitizenAdapterCandidateContractGapCovered: true,
    multiverseFabricCoordinationMetadataContractGapCovered: true,
    multiverseRegistryWebSocketMcpTaskRuntimeAuthorizationBoundaryGapCovered:
      true,
    metadataOnly: true,
    reviewOnly: true,
    authoritative: false,
    runtimeAuthorizationGranted: false,
    commandAuthorizationGranted: false,
    connectorAuthorizationGranted: false,
    fabricRuntimeAuthorizationGranted: false,
    webSocketRuntimeAuthorizationGranted: false,
    httpRuntimeAuthorizationGranted: false,
    mcpRuntimeAuthorizationGranted: false,
    mcpToolExposureAuthorizationGranted: false,
    taskRuntimeAuthorizationGranted: false,
    secureDropAuthorizationGranted: false
  };
}

function consumerContractGapIndexSourceSummary(sourceState, sourceDigest) {
  return {
    schema: sourceState.schema,
    stateKind: sourceState.stateKind,
    stateMode: sourceState.stateMode,
    reviewedAt: sourceState.reviewedAt,
    stateDigest: sourceDigest,
    consumerContractReadinessMatrixOnly: true,
    targetConsumerIds: sourceState.targetConsumerIds,
    matrixRowCount: sourceState.matrixRows.length,
    locusRowCount: sourceState.matrixSummary.locusRowCount,
    multiverseRowCount: sourceState.matrixSummary.multiverseRowCount,
    secureDropFutureContentFabricCapabilityReferenceOnly: true,
    runtimeEffectAllFalse: true
  };
}

function consumerContractGapIndexStateFromSource(
  sourceState,
  reviewedAt,
  sourceDigest
) {
  const gapEntries = consumerContractGapIndexEntriesFromSource(sourceState);
  const gapGroups = consumerContractGapIndexGroups(gapEntries);

  return {
    schema: CONSUMER_CONTRACT_GAP_INDEX_STATE_SCHEMA,
    schemaVersion: CONSUMER_CONTRACT_GAP_INDEX_VERSION,
    stateKind: "consumer-contract-gap-index-state",
    stateMode: "review-only",
    reviewedAt,
    sourceConsumerContractReadinessMatrix: consumerContractGapIndexSourceSummary(
      sourceState,
      sourceDigest
    ),
    gapEntries,
    gapGroups,
    gapIndexSummary: consumerContractGapIndexSummary(gapEntries),
    targetConsumerIds: ["locus", "multiverse"],
    consumerContractGapIndexOnly: true,
    reviewOnly: true,
    authoritative: false,
    reviewArtifactOnly: true,
    consumerContractGapIndexIsReviewerRouting: false,
    consumerContractGapIndexIsReviewerAssignment: false,
    consumerContractGapIndexIsEvaluatorExecution: false,
    consumerContractGapIndexIsEvaluatorResult: false,
    consumerContractGapIndexIsApprovalDecision: false,
    consumerContractGapIndexIsApprovalGrant: false,
    ...consumerContractGapIndexForbiddenBehavior(),
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

function consumerContractGapIndexAcceptedOutput({
  accepted,
  sourceStates,
  reviewedAt,
  sourceDigest
}) {
  if (!accepted) {
    return {
      consumerContractGapIndex: null,
      sourceConsumerContractReadinessMatrixSummary: null
    };
  }

  const sourceState = sourceStates[0];

  return {
    consumerContractGapIndex: consumerContractGapIndexStateFromSource(
      sourceState,
      reviewedAt,
      sourceDigest
    ),
    sourceConsumerContractReadinessMatrixSummary:
      consumerContractGapIndexSourceSummary(sourceState, sourceDigest)
  };
}

function consumerContractGapIndexRejectionReasons({
  accepted,
  classification
}) {
  if (accepted) {
    return [
      "consumer_contract_gap_index_is_review_only",
      "locus_and_multiverse_gaps_grouped_for_future_authorization_planning",
      "runtime_command_connector_fabric_websocket_mcp_task_secure_drop_authorizations_false",
      "secure_drop_is_future_content_fabric_capability_reference_only",
      "fallow_runtime_not_used",
      "runtime_enablement_still_blocked"
    ];
  }

  return [
    classification,
    "consumer_contract_gap_index_not_produced",
    "runtime_command_connector_fabric_websocket_mcp_task_secure_drop_authorizations_false",
    "runtime_enablement_still_blocked"
  ];
}

function consumerContractGapIndexResult({
  reviewedAt,
  reviewedAtDefaulted,
  classification,
  accepted,
  consumerContractGapIndex,
  sourceConsumerContractReadinessMatrixSummary
}) {
  return {
    schema: CONSUMER_CONTRACT_GAP_INDEX_SCHEMA,
    schemaVersion: CONSUMER_CONTRACT_GAP_INDEX_VERSION,
    consumerContractGapIndexKind: CONSUMER_CONTRACT_GAP_INDEX_KIND,
    consumerContractGapIndexMode: "review-only",
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    sourceConsumerContractReadinessMatrixAccepted: accepted,
    consumerContractGapIndexProduced: accepted,
    consumerContractGapIndex,
    sourceConsumerContractReadinessMatrixSummary,
    gapIndexSummary: accepted ? consumerContractGapIndex.gapIndexSummary : null,
    gapEntries: accepted ? consumerContractGapIndex.gapEntries : [],
    gapGroups: accepted ? consumerContractGapIndex.gapGroups : [],
    targetConsumerIds: accepted ? consumerContractGapIndex.targetConsumerIds : [],
    reviewOnly: true,
    authoritative: false,
    reviewArtifactOnly: true,
    consumerContractGapIndexOnly: true,
    consumerContractGapIndexIsReviewerRouting: false,
    consumerContractGapIndexIsReviewerAssignment: false,
    consumerContractGapIndexIsEvaluatorExecution: false,
    consumerContractGapIndexIsEvaluatorResult: false,
    consumerContractGapIndexIsApprovalDecision: false,
    consumerContractGapIndexIsApprovalGrant: false,
    ...consumerContractGapIndexForbiddenBehavior(),
    rejectionReasons:
      consumerContractGapIndexRejectionReasons({
        accepted,
        classification
      }),
    runtimeEffect: { ...REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE }
  };
}

export function createConsumerContractGapIndexForReview(input = {}) {
  const inputRecord = consumerContractGapIndexInputRecord(input);
  const reviewedAt = consumerContractGapIndexReviewedAt(inputRecord);
  const reviewedAtDefaulted = isReviewedAtDefaulted(inputRecord);
  const sourceStates = consumerContractGapIndexEntries(inputRecord);
  const sourceDigest = consumerContractGapIndexSourceDigest(inputRecord);
  const classification = consumerContractGapIndexInputClassification({
    inputRecord,
    sourceStates,
    sourceDigest
  });
  const accepted =
    classification === VALID_CONSUMER_CONTRACT_GAP_INDEX_CLASSIFICATION;
  const {
    consumerContractGapIndex,
    sourceConsumerContractReadinessMatrixSummary
  } = consumerContractGapIndexAcceptedOutput({
    accepted,
    sourceStates,
    reviewedAt,
    sourceDigest
  });

  return consumerContractGapIndexResult({
    reviewedAt,
    reviewedAtDefaulted,
    classification,
    accepted,
    consumerContractGapIndex,
    sourceConsumerContractReadinessMatrixSummary
  });
}


export { CONSUMER_CONTRACT_GAP_INDEX_UNSAFE_RUNTIME_TRUE_FIELDS };
