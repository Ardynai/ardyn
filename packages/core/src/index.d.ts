export const ARDYN_SCHEMA_VERSION: "0.1.0";
export const ARDYN_PHASE: "phase-2-schema-handshake";
export const HOST_CRATE_NAME: "ardyn-host";

export type RuntimeHost = "rust";
export type RuntimeCore = "typescript";
export type CapabilityKind =
  | "adapter"
  | "browser"
  | "desktop"
  | "mcp-client"
  | "mcp-server"
  | "memory"
  | "model-provider"
  | "tool"
  | "workflow";
export type PermissionScope =
  | "browser"
  | "credentials"
  | "desktop"
  | "filesystem"
  | "memory"
  | "network"
  | "process"
  | "provider"
  | "registry";
export type PermissionAccess = "read" | "write" | "connect" | "admin";
export type TaskMode = "plan" | "dry-run";

export interface ArdynPermission {
  scope: PermissionScope;
  access: PermissionAccess;
  reason?: string;
}

export interface ArdynCapability {
  id: string;
  kind: CapabilityKind;
  description: string;
  permissions: ArdynPermission[];
}

export interface ArdynRuntime {
  host: RuntimeHost;
  core: RuntimeCore;
  entrypoint?: string;
}

export interface ArdynAdapterConfig {
  enabled: boolean;
  external: boolean;
  endpoint?: string;
  notes?: string;
}

export interface ArdynPolicies {
  defaultTaskMode?: TaskMode;
  requiresApprovalFor?: Exclude<PermissionScope, "memory">[];
}

export interface ArdynManifest {
  schemaVersion: "0.1.0";
  name: string;
  version: string;
  description?: string;
  runtime: ArdynRuntime;
  capabilities: ArdynCapability[];
  adapters?: Record<string, ArdynAdapterConfig>;
  policies?: ArdynPolicies;
}

export interface ArdynTaskConstraints {
  requireHumanApproval?: boolean;
  allowNetwork?: boolean;
  maxSteps?: number;
  workspaceRoot?: string;
}

export interface ArdynTask {
  id: string;
  objective: string;
  mode: TaskMode;
  requestedCapabilities: string[];
  constraints?: ArdynTaskConstraints;
  inputs?: Record<string, unknown>;
  metadata?: Record<string, string | number | boolean | null>;
}

export interface ValidationResult {
  valid: boolean;
  errors: unknown[];
}

export interface HostInfo {
  crateName: "ardyn-host";
  responsibilities: string[];
}

export interface PlatformInfo {
  os: string;
  arch: string;
  family: string;
  isWindows: boolean;
  windowsFirst: true;
}

export interface StaticHandshake {
  schemaVersion: "0.1.0";
  phase: "phase-2-schema-handshake";
  manifest: {
    path: string | null;
    schemaVersion: "0.1.0";
    name: string;
    version: string;
    description: string | null;
  };
  runtime: {
    host: RuntimeHost;
    core: RuntimeCore;
    entrypoint: string | null;
  };
  host: HostInfo;
  platform: PlatformInfo;
  capabilities: ArdynCapability[];
  adapters: Record<string, ArdynAdapterConfig>;
  policies: ArdynPolicies;
  executionEnabled: false;
  toolExecutionEnabled: false;
  autonomousExecutionEnabled: false;
  productionToolExecutionEnabled: false;
  apiCallsEnabled: false;
  networkListening: false;
  longRunningServicesStarted: false;
  processesSpawned: false;
}

export function loadManifest(manifestPath: string): Promise<ArdynManifest>;
export function validateManifest(manifest: unknown): ValidationResult;
export function normalizeCapabilities(manifest: ArdynManifest): ArdynCapability[];
export function createHostInfo(): HostInfo;
export function createPlatformInfo(): PlatformInfo;
export function createStaticIdentity(): object;
export function createStaticHandshake(
  manifest: ArdynManifest,
  options?: { manifestPath?: string }
): StaticHandshake;
export function createStaticHandshakeFromPath(manifestPath: string): Promise<StaticHandshake>;
export function createDoctorReport(): object;
export function manifestPathToUrl(manifestPath: string): string;
