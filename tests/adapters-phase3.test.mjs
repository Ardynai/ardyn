import assert from "node:assert/strict";
import test from "node:test";

import * as openclaw from "@ardyn/adapter-openclaw";
import * as mcp from "@ardyn/mcp";
import * as pluginApi from "@ardyn/plugin-api";

const adapterPackages = [
  {
    name: "openclaw",
    module: openclaw,
    capabilityId: "adapter.openclaw.describe"
  },
  {
    name: "mcp",
    module: mcp,
    capabilityId: "adapter.mcp.describe"
  },
  {
    name: "plugin-api",
    module: pluginApi,
    capabilityId: "adapter.plugin-api.describe"
  }
];

function assertAllFalse(flags) {
  for (const [key, value] of Object.entries(flags)) {
    assert.equal(value, false, `${key} should remain false`);
  }
}

test("Phase 3 adapter packages export metadata only", () => {
  for (const adapterPackage of adapterPackages) {
    const exportedFunctions = Object.entries(adapterPackage.module)
      .filter(([, value]) => typeof value === "function")
      .map(([key]) => key);

    assert.deepEqual(exportedFunctions, [], `${adapterPackage.name} must not export behavior APIs`);
    assert.equal(adapterPackage.module.adapterRegistration.metadataOnly, true);
    assert.equal(adapterPackage.module.adapterRegistration.executionEnabled, false);
    assert.equal(adapterPackage.module.adapterRegistration.networkAccessEnabled, false);
    assert.equal(adapterPackage.module.adapterRegistration.installEnabled, false);
    assert.equal(adapterPackage.module.adapterRegistration.torrentDownloadEnabled, false);
    assertAllFalse(adapterPackage.module.adapterSafetyFlags);
  }
});

test("Phase 3 adapter capability descriptors are registry-read only", () => {
  for (const adapterPackage of adapterPackages) {
    assert.equal(adapterPackage.module.adapterCapability.id, adapterPackage.capabilityId);
    assert.equal(adapterPackage.module.adapterCapability.kind, "adapter");
    assert.deepEqual(adapterPackage.module.adapterCapability.permissions, [
      {
        scope: "registry",
        access: "read",
        reason: "Describe adapter registration metadata without connecting, executing, or installing."
      }
    ]);
    assert.deepEqual(adapterPackage.module.adapterRegistration.capabilities, [
      adapterPackage.module.adapterCapability
    ]);
  }
});
