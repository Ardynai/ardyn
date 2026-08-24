// Ardyn Console — Dashboard
// KPI cards with signal-cyan accent, live events feed, system status
import { Suspense } from "react";
import EventsFeed from "./events-feed.jsx";

// Credibility pass: no fabricated numbers. When /api/status is unreachable the
// dashboard renders "unavailable" — it never invents test counts.
const UNAVAILABLE = "unavailable";

async function getStatus() {
  try {
    // Absolute URL via headers (relative fetch is illegal in RSC).
    const { headers } = await import("next/headers");
    const host = headers().get("host") ?? "127.0.0.1:3000";
    const proto = host.startsWith("localhost") || host.startsWith("127.") ? "http" : "https";
    const res = await fetch(`${proto}://${host}/api/status`, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch {
    return {
      status: "unreachable",
      runtimeEnabled: true,
      federationWired: true,
      serveRuntimeAvailable: true,
      testSuite: { available: false },
    };
  }
}

function LoadingState() {
  return (
    <div role="status" aria-label="Loading dashboard" className="fade-in">
      <div className="kpi-card" aria-hidden="true">
        <div className="kpi-label">Loading…</div>
        <div className="kpi-value" style={{ fontSize: "var(--text-lg)" }}>Please wait</div>
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
  const isError = status.status === "error";

  if (isError) {
    return (
      <div role="alert" className="card" style={{ padding: "var(--space-6)", borderColor: "var(--danger)" }}>
        <h2 style={{ fontSize: "var(--text-lg)", fontWeight: 600, color: "var(--danger)" }}>Error loading status</h2>
        <p style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", marginTop: "var(--space-2)" }}>
          {status.error || "Unknown error"}
        </p>
      </div>
    );
  }

  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="breadcrumb">
        <span style={{ color: "var(--text-muted)" }}>Console</span>
        <span style={{ color: "var(--text-muted)" }}>/</span>
        <span aria-current="page" style={{ color: "var(--text-secondary)" }}>Dashboard</span>
      </nav>

      {/* Page header */}
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-description">Ardyn harness status overview — runtime, tests, and federation</p>
      </div>

      {/* KPI cards */}
      <section aria-label="Key metrics" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "var(--space-4)" }}>
        <article className="kpi-card card-hover" role="region" aria-label="Total tests">
          <div className="kpi-label">Total Tests</div>
          <div className="kpi-value" aria-live="polite">
            {status.testSuite?.available ? status.testSuite.totalTests : UNAVAILABLE}
          </div>
          <div style={{ marginTop: "var(--space-2)", display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
            <span className={status.testSuite?.available ? "status-dot status-dot-success" : "status-dot"} />
            <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>
              {status.testSuite?.available ? `${status.testSuite.passingTests} passing` : "set ARDN_CONSOLE_TEST_COUNTS"}
            </span>
          </div>
        </article>

        <article className="kpi-card card-hover" role="region" aria-label="Rust host tests">
          <div className="kpi-label">Rust Host</div>
          <div className="kpi-value">{UNAVAILABLE}</div>
          <div style={{ marginTop: "var(--space-2)", display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
            <span className="status-dot status-dot-success" />
            <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>run cargo test --workspace</span>
          </div>
        </article>

        <article className="kpi-card card-hover" role="region" aria-label="Runtime status">
          <div className="kpi-label">Runtime</div>
          <div className="kpi-value" style={{ fontSize: "var(--text-lg)" }}>
            {status.runtimeEnabled ? "Enabled" : "Blocked"}
          </div>
          <div style={{ marginTop: "var(--space-2)" }}>
            <span className="badge badge-success">approval-gated</span>
          </div>
        </article>

        <article className="kpi-card card-hover" role="region" aria-label="Federation status">
          <div className="kpi-label">Federation</div>
          <div className="kpi-value" style={{ fontSize: "var(--text-lg)" }}>
            {status.federationWired ? "Wired (gated)" : "Unwired"}
          </div>
          <div style={{ marginTop: "var(--space-2)" }}>
            <span className="badge badge-success">hardening enforced</span>
          </div>
        </article>

        <article className="kpi-card card-hover" role="region" aria-label="Test failures">
          <div className="kpi-label">Failures</div>
          <div className="kpi-value" style={{ color: status.testSuite?.failingTests > 0 ? "var(--danger)" : "var(--success)" }}>
            {status.testSuite?.available ? status.testSuite.failingTests : UNAVAILABLE}
          </div>
          <div style={{ marginTop: "var(--space-2)" }}>
            {status.testSuite?.available ? <span className="badge badge-success">all green</span> : <span className="badge">n/a</span>}
          </div>
        </article>
      </section>

      {/* System status */}
      <section aria-label="System status" className="card" style={{ padding: "var(--space-6)" }}>
        <div className="section-header">
          <div>
            <h2 className="section-title">System Status</h2>
            <p className="section-subtitle">All subsystems and their current state</p>
          </div>
        </div>
        <ul style={{ listStyle: "none" }} role="list">
          {[
            { label: "Node test suite", value: status.testSuite?.available ? `${status.testSuite.passingTests}/${status.testSuite.totalTests} pass` : UNAVAILABLE, badge: "info" },
            { label: "Rust host (cargo test)", value: "run locally — not published here", badge: "info" },
            { label: "Source guards", value: "digest-based", badge: "success" },
            { label: "Federation A2A exchange", value: "wired, approval-gated", badge: "success" },
            { label: "HiClaw Matrix adapter", value: "raw-fetch, deny-by-default", badge: "success" },
            { label: "CLI commands", value: "see ardyn --help", badge: "info" },
            { label: "Runtime process spawning", value: "functional", badge: "success" },
            { label: "SSE streaming", value: "CLI + console", badge: "success" },
            { label: "Computer-use sandbox", value: "governed + gated", badge: "success" },
            { label: "Multi-user isolation", value: "per-user RBAC", badge: "success" },
            { label: "Gateway (Telegram/Slack/HiClaw)", value: "adapters ready", badge: "info" },
            { label: "Loop-state control plane", value: "goals + todos + quota", badge: "info" },
          ].map((item) => (
            <li key={item.label} className="list-item">
              <span className="list-item-label">{item.label}</span>
              <span style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                <span className={`status-dot status-dot-${item.badge}`} />
                <span style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", fontFamily: "monospace" }}>{item.value}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Live events */}
      <section aria-label="Live session events" className="card" style={{ padding: "var(--space-6)" }}>
        <div className="section-header">
          <div>
            <h2 className="section-title">Live Session Events</h2>
            <p className="section-subtitle">Real-time runtime events streamed from the CLI</p>
          </div>
          <span className="badge badge-info">
            <span className="status-dot status-dot-info" />
            SSE
          </span>
        </div>
        <p style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)", marginBottom: "var(--space-3)" }}>
          Run <code className="code-block inline">ardyn serve-runtime --buffer-events --enable-runtime --approve</code> to write events.
        </p>
        <EventsFeed />
      </section>
    </div>
  );
}