export type AdapterPermissionScope = "registry";
export type AdapterPermissionAccess = "read";

export interface AdapterCapabilityDescriptor {
  id: "adapter.mcp.describe";
  kind: "adapter";
  description: string;
  permissions: readonly [
    {
      scope: AdapterPermissionScope;
      access: AdapterPermissionAccess;
      reason: string;
    }
  ];
}

export interface AdapterSafetyFlags {
  executionEnabled: false;
  toolExecutionEnabled: false;
  autonomousExecutionEnabled: false;
  productionToolExecutionEnabled: false;
  apiCallsEnabled: false;
  networkListening: false;
  longRunningServicesStarted: false;
  processesSpawned: false;
  pluginInstallEnabled: false;
  torrentDownloadEnabled: false;
  codePackEnablementEnabled: false;
  agentLoopEnabled: false;
}

export interface AdapterRegistration {
  id: "adapter.mcp";
  packageName: "@ardyn/mcp";
  phase: "phase-3-task-planning";
  metadataOnly: true;
  enabled: false;
  external: true;
  description: string;
  capabilities: readonly [AdapterCapabilityDescriptor];
  executionEnabled: false;
  networkAccessEnabled: false;
  installEnabled: false;
  torrentDownloadEnabled: false;
  safety: AdapterSafetyFlags;
}

export const adapterId: "adapter.mcp";
export const adapterPackageName: "@ardyn/mcp";
export const adapterSafetyFlags: AdapterSafetyFlags;
export const adapterCapability: AdapterCapabilityDescriptor;
export const adapterRegistration: AdapterRegistration;
