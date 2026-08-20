// M6: Runtime Control — approval-gated, never bypasses the security floor
export default function RuntimePage() {
  return (
    <div className="space-y-6">
      <nav aria-label="Breadcrumb" className="text-sm text-[var(--text-secondary)]">
        <a href="/" aria-label="Dashboard">Dashboard</a> › <span aria-current="page">Runtime</span>
      </nav>
      <div>
        <h2 className="text-2xl font-bold mb-1">Runtime Control</h2>
        <p className="text-sm text-[var(--text-secondary)]">Approval-gated runtime — the UI never bypasses the CLI security floor</p>
      </div>

      <section aria-label="Approval gate" className="card p-6" role="group">
        <h3 className="text-lg font-semibold mb-4">Approval Gate</h3>
        <div className="flex items-center gap-4 mb-4">
          <span className="badge badge-warning" role="status" aria-label="Approval required">⚠ Approval required</span>
          <button type="button" className="btn-primary" aria-disabled="true" disabled aria-label="Approve runtime (disabled — use CLI)">
            Approve Runtime
          </button>
        </div>
        <p className="text-sm text-[var(--text-secondary)]">
          This button is intentionally disabled. Runtime approval must be done via the CLI:
        </p>
        <pre className="code-block mt-2" aria-label="CLI approval command">{`ardyn serve-runtime --enable-runtime --approve --manifest <path> --command "..."`}</pre>
      </section>

      <section aria-label="Runtime features" className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Runtime Features</h3>
        <ul role="list" className="space-y-2">
          <li className="flex justify-between"><span className="text-sm">Process spawning</span><span className="badge badge-success">functional</span></li>
          <li className="flex justify-between"><span className="text-sm">Kill switch (--kill-after-ms)</span><span className="badge badge-success">functional</span></li>
          <li className="flex justify-between"><span className="text-sm">Stderr redaction</span><span className="badge badge-success">masks token=/secret=/Bearer</span></li>
          <li className="flex justify-between"><span className="text-sm">Transcript audit</span><span className="badge badge-success">per-session events</span></li>
          <li className="flex justify-between"><span className="text-sm">Failure audit</span><span className="badge badge-success">activates on non-zero exit</span></li>
          <li className="flex justify-between"><span className="text-sm">Rust host bridge (--rust-session)</span><span className="badge badge-success">functional</span></li>
          <li className="flex justify-between"><span className="text-sm">SSE streaming (--stream)</span><span className="badge badge-success">CLI + console</span></li>
          <li className="flex justify-between"><span className="text-sm">Event buffer (--buffer-events)</span><span className="badge badge-success">file-based bridge</span></li>
        </ul>
      </section>

      <section aria-label="Error state example" className="card p-6" role="alert">
        <h3 className="text-lg font-semibold mb-2 text-[var(--danger)]">Error State</h3>
        <p className="text-sm text-[var(--text-secondary)]">
          If a runtime process exits with a non-zero code, the failure audit activates and the error is recorded in the transcript.
        </p>
      </section>
    </div>
  );
}