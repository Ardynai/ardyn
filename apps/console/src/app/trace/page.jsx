// Ardyn Console — Trace Viewer
// Session trace viewer with JSONL frame display, loading/empty/error states
export default function TracePage() {
  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <nav aria-label="Breadcrumb" className="breadcrumb">
        <span style={{ color: "var(--text-muted)" }}>Console</span>
        <span style={{ color: "var(--text-muted)" }}>/</span>
        <span aria-current="page" style={{ color: "var(--text-secondary)" }}>Trace Viewer</span>
      </nav>

      <div className="page-header">
        <h1 className="page-title">Trace Viewer</h1>
        <p className="page-description">Session transcripts, JSONL frames, and replay</p>
      </div>

      {/* Empty state */}
      <section className="card" style={{ padding: "var(--space-8)", textAlign: "center" }} role="status">
        <div style={{ fontSize: "48px", opacity: 0.3, marginBottom: "var(--space-4)" }} aria-hidden="true">≡</div>
        <h2 style={{ fontSize: "var(--text-lg)", fontWeight: 600, color: "var(--text-secondary)" }}>No trace loaded</h2>
        <p style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)", marginTop: "var(--space-2)" }}>
          Run a session with <code className="code-block inline">ardyn serve-runtime</code> to generate a transcript.
        </p>
        <div style={{ marginTop: "var(--space-6)", display: "flex", gap: "var(--space-3)", justifyContent: "center" }}>
          <button className="btn-ghost" aria-label="Load transcript from file">Load Transcript</button>
          <button className="btn-ghost" aria-label="Replay last session">Replay Last</button>
        </div>
      </section>

      {/* Trace schema info */}
      <section className="card" style={{ padding: "var(--space-6)" }}>
        <div className="section-header">
          <div>
            <h2 className="section-title">Transcript Schema</h2>
            <p className="section-subtitle">JSONL format for session replay</p>
          </div>
          <span className="badge badge-neutral">schema: session-transcript-v1</span>
        </div>
        <pre className="code-block">{`{
  "sessionId": "sess-...",
  "events": [
    { "type": "frame", "timestamp": "...", "data": {...} },
    { "type": "audit", "timestamp": "...", "decision": "allow|deny" },
    { "type": "kill", "timestamp": "...", "reason": "kill_switch" }
  ]
}`}</pre>
      </section>
    </div>
  );
}