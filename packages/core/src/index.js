/**
 * index.js — Top-level barrel for @ardyn/core.
 *
 * Re-exports the FULL public surface from index.mjs (the 73k-line monolith),
 * plus the logical sub-module barrels (validation.js, create-review-helpers.js,
 * data-helpers.js, schema-helpers.js). Implementations stay in index.mjs; this
 * file only re-exports, so the 1364-test suite (which imports index.mjs
 * directly) is unaffected.
 *
 * This documents the modular extraction path without moving implementations.
 * Consumers may import from "@ardyn/core" (which still resolves to index.mjs
 * via package.json exports) or from the focused sub-modules.
 *
 * Re-export count from index.mjs: 429
 *   - validation.js:        9
 *   - create-review-helpers: 65
 *   - data-helpers.js:       8
 *   - schema-helpers.js:    87
 *   - remaining (index.js): 260
 */

// Full public surface from the monolith:
export * from "./index.mjs";

// Logical sub-module barrels (re-export subsets of the above):
export * from "./validation.js";
export * from "./create-review-helpers.js";
export * from "./data-helpers.js";
export * from "./schema-helpers.js";
