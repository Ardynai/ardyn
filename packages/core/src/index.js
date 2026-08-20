// packages/core/src/index.js — barrel re-export for modularized core
// This file re-exports everything from index.mjs (the monolith) plus
// extracted modules. As modularization progresses, functions move from
// index.mjs into dedicated modules and are re-exported here.
//
// Current extraction status:
// - internal/utils.mjs: isPlainObjectRecord, isUtcIsoTimestampWithMilliseconds (M0.6)
// - data-auth.mjs: createDatabase, checkPermission, grantPermission, revokePermission,
//   checkRateLimit, getSecret, redactSecrets, sanitizeQuery (M3)
// - validation.js: 53 validation/classification/formatting functions (re-export)
// - create-review-helpers.js: 65 create*ForReview functions (re-export)
//
// Future extractions (per modularization plan):
// - Move create*ForReview implementations from index.mjs → create-review-helpers.mjs
// - Move validation implementations from index.mjs → validation.mjs
// - Move schema-validation helpers → schema-validation.mjs
// - Move phase-metadata helpers → phase-metadata.mjs
// - Reduce index.mjs to constants + shared helpers only

export * from "./index.mjs";
export * from "./data-auth.mjs";