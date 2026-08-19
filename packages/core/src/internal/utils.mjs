// packages/core/src/internal/utils.mjs
// M0.6: Shared internal utilities extracted from the monolith.
// These are the most-referenced helpers (isPlainObjectRecord: 481 refs,
// isUtcIsoTimestampWithMilliseconds: 126 refs, isReviewedAtDefaulted: 73 refs).
// index.mjs imports and re-exports them so all existing imports stay valid.

const UTC_ISO_TIMESTAMP_WITH_MILLISECONDS_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

function isPlainObjectRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isUtcIsoTimestampWithMilliseconds(value) {
  const timestamp = Date.parse(value);

  return (
    typeof value === "string" &&
    UTC_ISO_TIMESTAMP_WITH_MILLISECONDS_PATTERN.test(value) &&
    Number.isFinite(timestamp) &&
    new Date(timestamp).toISOString() === value
  );
}

function isReviewedAtDefaulted(inputRecord) {
  return (
    inputRecord === null ||
    inputRecord === undefined ||
    typeof inputRecord !== "object" ||
    !Object.prototype.hasOwnProperty.call(inputRecord, "reviewedAt") ||
    !isUtcIsoTimestampWithMilliseconds(inputRecord.reviewedAt)
  );
}

export {
  UTC_ISO_TIMESTAMP_WITH_MILLISECONDS_PATTERN,
  isPlainObjectRecord,
  isUtcIsoTimestampWithMilliseconds,
  isReviewedAtDefaulted
};
