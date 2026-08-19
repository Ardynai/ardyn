// M6: Runtime Control — approval-gated, never bypasses the security floor
export default function RuntimePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">Runtime Control</h2>
        <p className="text-sm text-[var(--text-secondary)]">
          Start/stop serve-runtime sessions — approval gates are enforced
        </p>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Runtime Session</h3>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-[var(--text-secondary)] block mb-1">
              Manifest Path
            </label>
            <input
              type="text"
              placeholder="examples/minimal-manifest/ardyn.manifest.json"
              className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg text-sm"
              defaultValue="examples/minimal-manifest/ardyn.manifest.json"
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" defaultChecked />
              <span>Dry Run (plan only, no execution)</span>
            </label>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" />
              <span>Approve execution (requires --approve in CLI)</span>
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button className="btn-primary">
              Start Runtime
            </button>
            <button className="btn-danger">
              Kill (Emergency Stop)
            </button>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-3">Approval Gate Status</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-[var(--text-secondary)]">Runtime enabled flag</span>
            <span className="badge badge-success">available (--enable-runtime)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[var(--text-secondary)]">Approval required</span>
            <span className="badge badge-success">enforced (--approve)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[var(--text-secondary)]">Kill switch</span>
            <span className="badge badge-success">available</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[var(--text-secondary)]">Redaction</span>
            <span className="badge badge-success">fail-closed</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[var(--text-secondary)]">Transcript audit</span>
            <span className="badge badge-success">enabled</span>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-2">Active Sessions</h3>
        <p className="text-sm text-[var(--text-secondary)]">No active runtime sessions.</p>
      </div>
    </div>
  );
}