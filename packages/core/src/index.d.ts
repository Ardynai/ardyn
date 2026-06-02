export const ARDYN_SCHEMA_VERSION: "0.1.0";
export const ARDYN_PHASE: "phase-3-task-planning";
export const APPROVAL_REVIEW_ARTIFACT_SCHEMA: "ardyn.approval-review-artifact";
export const APPROVAL_REVIEW_ARTIFACT_VERSION: "0.1.0";
export const HOST_CRATE_NAME: "ardyn-host";
export const APPROVAL_REQUIRED: "approval-required";
export const APPROVAL_DENIED: "approval-denied";
export const APPROVAL_GRANTED: "approval-granted";
export const APPROVAL_STATUSES: readonly [
  "approval-required",
  "approval-denied",
  "approval-granted"
];
export const APPROVAL_DECISION_REQUIRED: "required";
export const APPROVAL_DECISION_DENIED: "denied";
export const APPROVAL_DECISION_GRANTED: "granted";
export const APPROVAL_DECISION_NOT_REQUIRED: "not_required";
export const APPROVAL_DECISION_STATUSES: readonly [
  "required",
  "denied",
  "granted",
  "not_required"
];

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
export type ApprovalStatus = "approval-required" | "approval-denied" | "approval-granted";
export type ApprovalDecisionStatus = "required" | "denied" | "granted" | "not_required";
export type CapabilityMatchType = "exact" | "tag" | "scope" | "no-match";

export interface ArdynPermission {
  scope: PermissionScope;
  access: PermissionAccess;
  reason?: string;
}

export interface ArdynCapability {
  id: string;
  kind: CapabilityKind;
  description: string;
  tags?: string[];
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

export interface NoExecutionSafetyFlags {
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

export interface TaskCapabilityResolution {
  request: string;
  matchType: CapabilityMatchType;
  scope: PermissionScope | null;
  capabilityIds: string[];
  selectedCapabilityIds: string[];
  candidates: TaskCapabilityCandidate[];
  reason: string;
}

export interface TaskCapabilityCandidate {
  capabilityId: string;
  matchType: Exclude<CapabilityMatchType, "no-match">;
  score: 300 | 200 | 100;
  scope: PermissionScope | null;
  tag: string | null;
  reason: string;
}

export interface ResolvedTaskCapabilities {
  selectedCapabilities: ArdynCapability[];
  resolutions: TaskCapabilityResolution[];
  unresolvedRequests: string[];
  duplicateRequestedCapabilities: string[];
}

export interface TaskApprovalReasonConstraint {
  type: "task-constraint";
  field: "constraints.requireHumanApproval";
}

export interface TaskApprovalReasonPolicyScope {
  type: "policy-scope";
  capabilityId: string;
  scope: PermissionScope;
  access: PermissionAccess;
}

export type TaskApprovalReason = TaskApprovalReasonConstraint | TaskApprovalReasonPolicyScope;

export interface TaskApprovalGate {
  required: boolean;
  status: ApprovalStatus | null;
  reasons: TaskApprovalReason[];
}

export interface ApprovalDecisionInput {
  status: ApprovalDecisionStatus;
  reason?: string;
}

export interface ApprovalDecision {
  id: string;
  taskId: string;
  requestedCapabilityIds: string[];
  status: ApprovalDecisionStatus;
  reason: string;
  createdAt: string;
  nonExecuting: true;
}

export interface TaskMatchingPolicy {
  exactCapabilityId: true;
  permissionScope: true;
  tags: true;
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
  phase: "phase-3-task-planning";
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
  pluginInstallEnabled: false;
  torrentDownloadEnabled: false;
  codePackEnablementEnabled: false;
  agentLoopEnabled: false;
}

export interface TaskPlan {
  schemaVersion: "0.1.0";
  phase: "phase-3-task-planning";
  manifest: {
    path: string | null;
    schemaVersion: "0.1.0";
    name: string;
    version: string;
    description: string | null;
  };
  taskPath: string | null;
  task: ArdynTask;
  requestedCapabilities: string[];
  duplicateRequestedCapabilities: string[];
  matchingPolicy: TaskMatchingPolicy;
  resolutions: TaskCapabilityResolution[];
  selectedCapabilities: ArdynCapability[];
  unresolvedRequests: string[];
  approval: TaskApprovalGate;
  approvalDecision: ApprovalDecision;
  plannerTrace: PlannerTrace;
  safety: NoExecutionSafetyFlags;
}

export interface PlannerTrace {
  taskIntake: {
    valid: true;
    errors: unknown[];
    taskId: string;
    requestedCapabilities: string[];
  };
  manifest: {
    id: string;
    version: string;
    schemaVersion: "0.1.0";
  };
  candidateCapabilities: Array<{
    request: string;
    candidates: TaskCapabilityCandidate[];
  }>;
  selectedCapabilities: string[];
  unresolvedRequests: string[];
  approvalDecision: ApprovalDecision;
  safety: NoExecutionSafetyFlags;
}

export interface ApprovalReviewArtifactCandidate {
  rank: number;
  capabilityId: string;
  matchType: Exclude<CapabilityMatchType, "no-match">;
  score: 300 | 200 | 100;
  scope: PermissionScope | null;
  tag: string | null;
  reason: string;
}

export interface ApprovalReviewArtifact {
  schema: "ardyn.approval-review-artifact";
  schemaVersion: "0.1.0";
  version: "0.1.0";
  generatedAt: string;
  nonExecuting: true;
  taskId: string;
  manifest: {
    id: string;
    version: string;
    schemaVersion: "0.1.0";
  };
  requestedCapabilityIds: string[];
  candidateRankings: Array<{
    request: string;
    candidates: ApprovalReviewArtifactCandidate[];
  }>;
  selectedCapabilities: string[];
  unresolvedRequests: string[];
  approvalDecision: ApprovalDecision;
  safety: NoExecutionSafetyFlags;
}

export interface ApprovalReviewArtifactOptions {
  generatedAt?: string;
}

export type ApprovalReviewArtifactDifferenceType =
  | "task-mismatch"
  | "manifest-mismatch"
  | "requested-capabilities-change"
  | "selected-capabilities-change"
  | "unresolved-requests-change"
  | "approval-requested-capabilities-change"
  | "approval-status-change"
  | "candidate-rankings-change";

export interface ApprovalReviewArtifactDifference {
  type: ApprovalReviewArtifactDifferenceType;
  path: string;
  left: unknown;
  right: unknown;
  added?: string[];
  removed?: string[];
}

export interface ApprovalReviewArtifactComparison {
  equal: boolean;
  differenceCount: number;
  differences: ApprovalReviewArtifactDifference[];
  nonExecuting: true;
  safety: NoExecutionSafetyFlags;
}

export type ApprovalReviewArtifactComparisonSource =
  | TaskPlan
  | PlannerTrace
  | ApprovalReviewArtifact;

export function loadManifest(manifestPath: string): Promise<ArdynManifest>;
export function loadTask(taskPath: string): Promise<ArdynTask>;
export function validateManifest(manifest: unknown): ValidationResult;
export function validateTask(task: unknown): ValidationResult;
export function validateApprovalReviewArtifact(artifact: unknown): ValidationResult;
export function createNoExecutionSafetyFlags(): NoExecutionSafetyFlags;
export function supportedTaskCapabilityScopes(): PermissionScope[];
export function isSupportedPermissionScope(value: string): value is PermissionScope;
export function normalizeCapabilities(manifest: ArdynManifest): ArdynCapability[];
export function resolveTaskCapabilities(
  manifest: ArdynManifest,
  requestedCapabilities: string[]
): ResolvedTaskCapabilities;
export function createTaskPlan(
  manifest: ArdynManifest,
  task: ArdynTask,
  options?: {
    manifestPath?: string;
    taskPath?: string;
    createdAt?: string;
    approvalDecision?: ApprovalDecisionInput;
  }
): TaskPlan;
export function createApprovalReviewArtifact(
  source: TaskPlan | PlannerTrace,
  options?: ApprovalReviewArtifactOptions
): ApprovalReviewArtifact;
export function compareApprovalReviewArtifacts(
  left: ApprovalReviewArtifactComparisonSource,
  right: ApprovalReviewArtifactComparisonSource
): ApprovalReviewArtifactComparison;
export function createHostInfo(): HostInfo;
export function platformFamilyForNodePlatform(platform: string): "windows" | "unix";
export function createPlatformInfo(platform?: string, arch?: string): PlatformInfo;
export function createStaticIdentity(): object;
export function createStaticHandshake(
  manifest: ArdynManifest,
  options?: { manifestPath?: string }
): StaticHandshake;
export function createStaticHandshakeFromPath(manifestPath: string): Promise<StaticHandshake>;
export function createDoctorReport(): object;
export function manifestPathToUrl(manifestPath: string): string;
