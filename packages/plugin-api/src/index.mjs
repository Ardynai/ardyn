export const adapterId = "adapter.plugin-api";
export const adapterPackageName = "@ardyn/plugin-api";

export const adapterSafetyFlags = Object.freeze({
  executionEnabled: false,
  toolExecutionEnabled: false,
  autonomousExecutionEnabled: false,
  productionToolExecutionEnabled: false,
  apiCallsEnabled: false,
  networkListening: false,
  longRunningServicesStarted: false,
  processesSpawned: false,
  pluginInstallEnabled: false,
  torrentDownloadEnabled: false,
  codePackEnablementEnabled: false,
  agentLoopEnabled: false
});

export const adapterCapability = Object.freeze({
  id: "adapter.plugin-api.describe",
  kind: "adapter",
  description: "Describe plugin API registration metadata without loading or installing plugins.",
  permissions: Object.freeze([
    Object.freeze({
      scope: "registry",
      access: "read",
      reason: "Describe adapter registration metadata without connecting, executing, or installing."
    })
  ])
});

export const adapterRegistration = Object.freeze({
  id: adapterId,
  packageName: adapterPackageName,
  phase: "phase-3-task-planning",
  metadataOnly: true,
  enabled: false,
  external: true,
  description: "Metadata-only plugin API registration stub.",
  capabilities: Object.freeze([adapterCapability]),
  executionEnabled: false,
  networkAccessEnabled: false,
  installEnabled: false,
  torrentDownloadEnabled: false,
  safety: adapterSafetyFlags
});
