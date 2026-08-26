// Ardyn Console — Dashboard
import { Suspense } from "react";
import EventsFeed from "./events-feed.jsx";

const UNAVAILABLE = "unavailable";

async function getStatus() {
  try {
    const { headers } = await import("next/headers");
    const headerList = await headers();
    const host = headerList.get("host") ?? "127.0.0.1:3000";
    const proto = host.startsWith("localhost") || host.startsWith("127.") ? "http" : "https";
    const res = await fetch(`${proto}://${host}/api/status`, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch {
    return {
      status: "unreachable",
      runtimeEnabled: null,
      federationWired: null,
      serveRuntimeAvailable: null,
      testSuite: { available: false },
    };
  }
}

function LoadingState() {
  return (
    <div role="status" aria-label="Loading dashboard" className="fade-in">
      <div className="kpi-card" aria-hidden="true">
        <div className="kpi-label">Loading Operator Telemetry…</div>
        <div className="kpi-value" style={{ fontSize: "var(--text-lg)" }}>Connecting to Ardyn Control Plane…</div>
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <DashboardContent />
    </Suspense>
  );
}

async function DashboardContent() {
  const status = await getStatus();
  const isHealthy = status.status === "ok";

  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="breadcrumb">
        <span style={{ color: "var(--text-muted)" }}>Console</span>
        <span style={{ color: "var(--text-muted)" }}>/</span>
        <span aria-current="page" style={{ color: "var(--text-secondary)" }}>Dashboard</span>
      </nav>

      {/* Page Header */}
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "var(--space-4)" }}>
        <div>
          <h1 className="page-title">Operator Dashboard</h1>
          <p className="page-description">Local harness telemetry, approval-gated runtime status, and real-time session events</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
          <span className={`badge ${isHealthy ? "badge-success" : "badge-danger"}`}>
            <span className={`status-dot ${isHealthy ? "status-dot-success" : "status-dot-danger"}`} />
            {isHealthy ? "API HEALTHY" : "API UNREACHABLE"}
          </span>
          <span className="badge badge-neutral" style={{ fontFamily: "monospace" }}>
            v0.1.0-alpha
          </span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <section aria-label="System Metrics" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "var(--space-4)" }}>
        <article className="kpi-card">
          <div className="kpi-label">API Health</div>
          <div className="kpi-value" style={{ color: isHealthy ? "var(--success)" : "var(--danger)" }}>
            {isHealthy ? "Active" : "Unreachable"}
          </div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", marginTop: "var(--space-1)" }}>
            /api/status endpoint check
          </div>
        </article>

        <article className="kpi-card">
          <div className="kpi-label">Runtime Execution</div>
          <div className="kpi-value" style={{ color: status.runtimeEnabled ? "var(--accent)" : "var(--text-muted)" }}>
            {status.runtimeEnabled == null ? "Unknown" : status.runtimeEnabled ? "Gated" : "Disabled"}
          </div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", marginTop: "var(--space-1)" }}>
            Requires --enable-runtime --approve
          </div>
        </article>

        <article className="kpi-card">
          <div className="kpi-label">Federation Mesh</div>
          <div className="kpi-value" style={{ color: status.federationWired ? "var(--success)" : "var(--warning)" }}>
            {status.federationWired == null ? "Unknown" : status.federationWired ? "Wired" : "Standalone"}
          </div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", marginTop: "var(--space-1)" }}>
            A2A Matrix transport pipeline
          </div>
        </article>

        <article className="kpi-card">
          <div className="kpi-label">Test Suite</div>
          <div className="kpi-value">
            {status.testSuite?.available ? `${status.testSuite.passCount ?? 0} Pass` : UNAVAILABLE}
          </div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", marginTop: "var(--space-1)" }}>
            {status.testSuite?.available ? "Root node suite passing" : "No synthetic counts emitted"}
          </div>
        </article>
      </section>

      {/* Live Session Events Stream */}
      <EventsFeed />

      {/* Security & Safety Posture Summary */}
      <section className="card" style={{ padding: "var(--space-6)" }}>
        <div className="section-header">
          <div>
            <h2 className="section-title">Security & Safety Posture</h2>
            <p className="section-subtitle">Core invariants enforced by the local harness engine</p>
          </div>
          <span className="badge badge-info">Approval Gated</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--space-4)" }}>
          <div style={{ padding: "var(--space-4)", background: "var(--bg-void)", borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>
            <div style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-primary)", marginBottom: "var(--space-1)" }}>
              Explicit Flag Verification
            </div>
            <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>
              Execution rejected unless both <code className="code-block inline">--enable-runtime</code> and <code className="code-block inline">--approve</code> are supplied.
            </p>
          </div>
          <div style={{ padding: "var(--space-4)", background: "var(--bg-void)", borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>
            <div style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-primary)", marginBottom: "var(--space-1)" }}>
              Secret Redaction
            </div>
            <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>
              Automatic regex masking of sensitive API tokens, passwords, and authorization headers in trace logs.
            </p>
          </div>
          <div style={{ padding: "var(--space-4)", background: "var(--bg-void)", borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>
            <div style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-primary)", marginBottom: "var(--space-1)" }}>
              Fail-Safe Kill Switch
            </div>
            <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>
              Instant container termination and process cleanup on safety policy violation or unexpected signal.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
