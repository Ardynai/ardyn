/**
 * data-helpers.js — Barrel re-export of data / IO helpers from index.mjs.
 *
 * Re-exports: readLocalJsonFile, load/loadTask manifest loaders, capability
 * resolution and normalization helpers, manifestPathToUrl.
 * NOTE: writeLocalJsonFile and resolveLocalJsonPath are internal helpers in
 * index.mjs (not exported) and therefore cannot be re-exported here.
 *
 * Re-export count: 8
 */

export { isSupportedPermissionScope } from "./index.mjs";
export { loadManifest } from "./index.mjs";
export { loadTask } from "./index.mjs";
export { manifestPathToUrl } from "./index.mjs";
export { normalizeCapabilities } from "./index.mjs";
export { readLocalJsonFile } from "./index.mjs";
export { resolveTaskCapabilities } from "./index.mjs";
export { supportedTaskCapabilityScopes } from "./index.mjs";
