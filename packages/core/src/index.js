// packages/core/src/index.js — barrel re-export for modularized core
// This file re-exports everything from index.mjs (the monolith) plus
// extracted modules. As modularization progresses, functions move from
// index.mjs into dedicated modules and are re-exported here.
//
// Current extraction status:
// - internal/utils.mjs: isPlainObjectRecord, isUtcIsoTimestampWithMilliseconds (M0.6)
// - data-auth.mjs: createDatabase, checkPermission, grantPermission, revokePermission,
//   checkRateLimit, getSecret, redactSecrets, sanitizeQuery (M3)
//
// Future extractions (per modularization plan):
// - create-review-helpers.mjs: all 74 create*ForReview functions
// - schema-validation.mjs: JSON Schema validation utilities
// - boundary-map-helpers.mjs: boundary map generation/comparison
// - phase-metadata.mjs: phase status and report helpers

export * from "./index.mjs";
export * from "./data-auth.mjs";