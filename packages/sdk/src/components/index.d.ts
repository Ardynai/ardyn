// U14: Type declarations for the accessible display components.
// JSX is intentionally NOT referenced here — the runtime components are .jsx
// files meant for a bundler (Next.js/Vite); these declarations give TypeScript
// consumers typed props without adding react types as a dependency.
import type { ArdynManifest, SessionEvent } from "../index.d.ts";

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

export declare const SessionTrace: (props: SessionTraceProps) => unknown;
export declare const StatusBadge: (props: StatusBadgeProps) => unknown;
export declare const ManifestViewer: (props: ManifestViewerProps) => unknown;
export declare const ApprovalGate: (props: ApprovalGateProps) => unknown;
