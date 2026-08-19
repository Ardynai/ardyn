// M6: Dashboard page — KPI cards + phase status
import { Suspense } from "react";

async function getPhaseStatus() {
  // Static data for now — in production this would fetch from the harness API
  return {
    totalTests: 1209,
    passingTests: 1209,
    failingTests: 0,
    phases: 119,
    runtimeEnabled: true,
    federationWired: false,
    serveRuntimeAvailable: true,
  };
}

export default async function DashboardPage() {
  const status = await getPhaseStatus();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">Dashboard</h2>
        <p className="text-sm text-[var(--text-secondary)]">
          Ardyn harness status overview
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="card p-5 card-hover">
          <div className="kpi-label">Total Tests</div>
          <div className="kpi-value">{status.totalTests}</div>
          <div className="mt-2">
            <span className="badge badge-success">{status.passingTests} passing</span>
          </div>
        </div>

        <div className="card p-5 card-hover">
          <div className="kpi-label">Phases</div>
          <div className="kpi-value">{status.phases}</div>
          <div className="mt-2">
            <span className="badge badge-info">metadata recorded</span>
          </div>
        </div>

        <div className="card p-5 card-hover">
          <div className="kpi-label">Runtime</div>
          <div className="kpi-value text-lg">
            {status.runtimeEnabled ? "Enabled" : "Blocked"}
          </div>
          <div className="mt-2">
            {status.serveRuntimeAvailable ? (
              <span className="badge badge-success">serve-runtime available</span>
            ) : (
              <span className="badge badge-danger">serve-runtime blocked</span>
            )}
          </div>
        </div>

        <div className="card p-5 card-hover">
          <div className="kpi-label">Federation</div>
          <div className="kpi-value text-lg">
            {status.federationWired ? "Wired" : "Unwired"}
          </div>
          <div className="mt-2">
            <span className="badge badge-warning">hardened, not wired</span>
          </div>
        </div>

        <div className="card p-5 card-hover">
          <div className="kpi-label">Test Failures</div>
          <div className="kpi-value">{status.failingTests}</div>
          <div className="mt-2">
            {status.failingTests === 0 ? (
              <span className="badge badge-success">all green</span>
            ) : (
              <span className="badge badge-danger">{status.failingTests} failing</span>
            )}
          </div>
        </div>
      </div>

      {/* Status Section */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">System Status</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--text-secondary)]">Node test suite</span>
            <span className="badge badge-success">{status.passingTests}/{status.totalTests} pass</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--text-secondary)]">Rust host (cargo test)</span>
            <span className="badge badge-success">98 pass</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--text-secondary)]">Source guards</span>
            <span className="badge badge-success">digest-based</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--text-secondary)]">JSON Schema validation</span>
            <span className="badge badge-success">103 schemas</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--text-secondary)]">Federation hardening</span>
            <span className="badge badge-success">5/5 applied</span>
          </div>
        </div>
      </div>
    </div>
  );
}