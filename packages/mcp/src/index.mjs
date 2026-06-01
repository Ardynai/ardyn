export const adapterId = "adapter.mcp";
export const adapterPackageName = "@ardyn/mcp";

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
  id: "adapter.mcp.describe",
  kind: "adapter",
  description: "Describe MCP adapter registration metadata without opening protocol connections.",
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
  description: "Metadata-only MCP adapter registration stub.",
  capabilities: Object.freeze([adapterCapability]),
  executionEnabled: false,
  networkAccessEnabled: false,
  installEnabled: false,
  torrentDownloadEnabled: false,
  safety: adapterSafetyFlags
});
