// M6: Trace/Artifact Viewer — flagship view
export default function TracePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">Trace Viewer</h2>
        <p className="text-sm text-[var(--text-secondary)]">
          Session transcripts and review artifacts
        </p>
      </div>

      {/* Empty state */}
      <div className="card p-12 text-center">
        <div className="text-4xl mb-4">📋</div>
        <h3 className="text-lg font-semibold mb-2">No trace loaded</h3>
        <p className="text-sm text-[var(--text-secondary)] mb-4">
          Load a session transcript or review artifact to view its details.
        </p>
        <div className="flex justify-center gap-3">
          <button className="btn-primary">Load Transcript</button>
          <button className="btn-primary">Load Artifact</button>
        </div>
      </div>

      {/* Loading state placeholder */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Traces</h3>
        <div className="text-sm text-[var(--text-secondary)]">
          No recent traces available. Run <code className="text-[var(--accent)]">ardyn emit-session-events --dry-run</code> to generate session events.
        </div>
      </div>
    </div>
  );
}