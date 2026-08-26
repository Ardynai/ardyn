// Type definitions for @ardyn/sdk
// These types allow TypeScript consumers to use the SDK with full type safety.
// U14: function signatures added — previously the file declared interfaces
// only, so `loadManifest` & co. had no typed entry points.

/**
 * Load and validate an Ardyn manifest from a path.
 * Mirrors src/index.mjs `loadManifest`.
 */
export declare function loadManifest(manifestPath: string): Promise<ArdynManifest>;

/** Create a session plan from a manifest and task. Mirrors `createPlan`. */
export declare function createPlan(manifest: ArdynManifest, task: ArdynTask): {
  schema: "ardyn.session-plan";
  schemaVersion: string;
  manifestId: string;
  taskId: string;
  objective: string;
  mode: string;
  capabilities: string[];
  createdAt: string;
};

/** Validate a session transcript. Mirrors `validateTranscript`. */
export declare function validateTranscript(transcript: unknown): { valid: boolean; error: string | null };

/** Get the Ardyn SDK version. Mirrors `getVersion`. */
export declare function getVersion(): string;

export declare const ARDYN_SDK_VERSION: string;

export interface ArdynManifest {
  id: string;
  version: string;
  capabilities: string[];
  adapters?: Record<string, unknown>;
  runtime?: {
    enabled: boolean;
    approvalRequired: boolean;
  };
}

export interface ArdynTask {
  id: string;
  objective: string;
  mode: "plan" | "review-only" | "execute";
  requestedCapabilities: string[];
}

export interface SessionEvent {
  type: string;
  timestamp: string;
  data?: unknown;
  frame?: unknown;
  text?: string;
}

export interface TranscriptAudit {
  replayEnabled: boolean;
  auditEnabled: boolean;
  transcriptPath: string | null;
  events: SessionEvent[];
}

export interface ProcessResult {
  exitCode: number;
  stdout: string;
  stderr: string;
  frames: unknown[];
  killed: boolean;
  killedReason: string | null;
  rustSession?: boolean;
  rustSessionId?: string;
  rustStatus?: string;
}

export interface FailureAudit {
  enabled: boolean;
  killOnFailure: boolean;
  rollbackOnFailure: boolean;
  activated: boolean;
}

export interface RedactionPolicy {
  stderrRedactionEnabled: boolean;
  redactionMode: "fail-closed";
  unredactableHandling: "blocked";
}

export interface RuntimePlan {
  command: string;
  dryRun: boolean;
  runtimeEnabled: boolean;
  approved: boolean;
  approvalGateStatus: string;
  killSwitchAvailable: boolean;
  killSwitchActivated: boolean;
  sessionId: string;
  sessionPlan: {
    sessionId: string;
    frames: unknown[];
    maxFrames: number;
    lifecycle: string;
  };
  redaction: RedactionPolicy;
  transcriptAudit: TranscriptAudit;
  failureAudit: FailureAudit;
  processesSpawned: boolean;
  processResult: ProcessResult | null;
  executionEnabled: boolean;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export interface PlanResult {
  sessionId: string;
  manifest: ArdynManifest;
  task: ArdynTask;
  plan: unknown;
}

// Display component props
export interface SessionTraceProps {
  frames?: SessionEvent[];
  sessionId?: string;
  isLoading?: boolean;
  error?: string | null;
}

export interface StatusBadgeProps {
  status?: "active" | "blocked" | "pending" | "approved" | "denied" | "unknown";
  label?: string;
}

export interface ManifestViewerProps {
  manifest?: ArdynManifest | null;
  isLoading?: boolean;
  error?: string | null;
}

export interface ApprovalGateProps {
  approved?: boolean;
  onApprove?: () => void;
  label?: string;
  disabled?: boolean;
}

// DB & Auth types
export interface Permission {
  role: string;
  capability: string;
  granted: boolean;
}

export interface AuditLogEntry {
  id?: number;
  session_id: string | null;
  event_type: string;
  event_data: string;
  timestamp: string;
}

export interface Database {
  prepare(query: string): {
    all(): Record<string, unknown>[];
    get(...params: unknown[]): Record<string, unknown> | undefined;
    run(...params: unknown[]): void;
  };
  exec(sql: string): void;
  close(): void;
  changes?: number;
}