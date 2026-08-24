// Modularization: shared Tier-1 review/boundary helpers extracted from index.mjs.
// Used by index.mjs kernel + multiple domain modules.

import { isPlainObjectRecord } from "../internal/utils.mjs";

function compareAscii(left, right) {
  if (left === right) {
    return 0;
  }

  return left < right ? -1 : 1;
}

function stableJsonValue(value) {
  if (Array.isArray(value)) {
    return value.map(stableJsonValue);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, entryValue]) => entryValue !== undefined)
        .sort(([left], [right]) => compareAscii(left, right))
        .map(([key, entryValue]) => [key, stableJsonValue(entryValue)])
    );
  }

  return value;
}

function stableJsonStringify(value) {
  return JSON.stringify(stableJsonValue(value));
}

function dataProperty(source, key) {
  if (!source || typeof source !== "object") {
    return undefined;
  }

  const descriptor = Object.getOwnPropertyDescriptor(source, key);
  return descriptor && "value" in descriptor ? descriptor.value : undefined;
}

const REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE = Object.freeze({
  runtimeEnabled: false,
  runtimeStarted: false,
  runtimeReady: false,
  runtimeCommandEnabled: false,
  runtimeCommandExposureEnabled: false,
  runtimeExecutionEnabled: false,
  runtimeExecuted: false,
  approvalGrantProduced: false,
  approvalGrantPersisted: false,
  approvalEvaluatorAuthoritative: false
});

const APPROVAL_PREREQUISITE_READER_DEFAULT_REVIEWED_AT =
  "1970-01-01T00:00:00.000Z";

const APPROVAL_PREREQUISITE_SOURCE_PREFLIGHT_DEFAULT_REVIEWED_AT =
  APPROVAL_PREREQUISITE_READER_DEFAULT_REVIEWED_AT;

function reviewOnlyRuntimeEffectAllFalse(runtimeEffect) {
  return (
    isPlainObjectRecord(runtimeEffect) &&
    Object.keys(REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE).every(
      (key) => runtimeEffect[key] === false
    ) &&
    Object.values(runtimeEffect).every(
      (value) => value === false
    )
  );
}

function approvalEvaluatorCandidateNestedTrueClaim(value, keyPredicate, seen = new Set()) {
  if (Array.isArray(value)) {
    return value.some((entry) =>
      approvalEvaluatorCandidateNestedTrueClaim(entry, keyPredicate, seen)
    );
  }

  if (!isPlainObjectRecord(value) || seen.has(value)) {
    return false;
  }

  seen.add(value);

  return Object.entries(value).some(
    ([key, value]) =>
      (value === true && keyPredicate(key)) ||
      approvalEvaluatorCandidateNestedTrueClaim(value, keyPredicate, seen)
  );
}

const REVIEW_ONLY_EVALUATOR_PREFLIGHT_PROTOTYPE_POLLUTION_PATH_FIELDS =
  Object.freeze(new Set(["__proto__", "constructor", "prototype"]));

const REVIEW_ONLY_INSPECTION_HANDOFF_METADATA_BOUNDARY_GRANT_KEY_PATTERN =
  /(^|_|\b)grant(ed|ing|Id|Produced|Persisted)?($|_|\b)/i;

function reviewOnlyInspectionHandoffMetadataBoundaryKeyTruePresent(
  value,
  keys,
  seen = new Set()
) {
  if (Array.isArray(value)) {
    return value.some((entry) =>
      reviewOnlyInspectionHandoffMetadataBoundaryKeyTruePresent(entry, keys, seen)
    );
  }

  if (!isPlainObjectRecord(value) || seen.has(value)) {
    return false;
  }

  seen.add(value);

  return Object.entries(value).some(
    ([key, entry]) =>
      (keys.includes(key) && entry === true) ||
      reviewOnlyInspectionHandoffMetadataBoundaryKeyTruePresent(
        entry,
        keys,
        seen
      )
  );
}

function reviewOnlyInspectionHandoffMetadataBoundaryRuntimeEffectAllFalse(
  runtimeEffect
) {
  return (
    isPlainObjectRecord(runtimeEffect) &&
    Object.values(runtimeEffect).every((value) => value === false)
  );
}

const REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_DIGEST_PATTERN =
  /^sha256:[0-9a-f]{64}$/;


export { compareAscii, stableJsonValue, stableJsonStringify, dataProperty, REVIEW_ONLY_EVALUATOR_RUNTIME_EFFECT_FALSE, APPROVAL_PREREQUISITE_READER_DEFAULT_REVIEWED_AT, APPROVAL_PREREQUISITE_SOURCE_PREFLIGHT_DEFAULT_REVIEWED_AT, reviewOnlyRuntimeEffectAllFalse, approvalEvaluatorCandidateNestedTrueClaim, REVIEW_ONLY_EVALUATOR_PREFLIGHT_PROTOTYPE_POLLUTION_PATH_FIELDS, REVIEW_ONLY_INSPECTION_HANDOFF_METADATA_BOUNDARY_GRANT_KEY_PATTERN, reviewOnlyInspectionHandoffMetadataBoundaryKeyTruePresent, reviewOnlyInspectionHandoffMetadataBoundaryRuntimeEffectAllFalse, REVIEW_ONLY_METADATA_HANDOFF_CHECKPOINT_DIGEST_PATTERN };
