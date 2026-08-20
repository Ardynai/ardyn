// M6: Trace Viewer — session trace with JSONL frame viewer, loading/empty/error states
export default function TracePage() {
  return (
    <div className="space-y-6">
      <nav aria-label="Breadcrumb" className="text-sm text-[var(--text-secondary)]">
        <a href="/" aria-label="Dashboard">Dashboard</a> › <span aria-current="page">Trace</span>
      </nav>
      <div>
        <h2 className="text-2xl font-bold mb-1">Trace Viewer</h2>
        <p className="text-sm text-[var(--text-secondary)]">View session traces and JSONL frames from runtime executions</p>
      </div>

      <section aria-label="Trace loading state" role="status" className="card p-6">
        <h3 className="text-lg font-semibold mb-2">No active session</h3>
        <p className="text-sm text-[var(--text-secondary)]">
          Run <code className="code-block inline">ardyn serve-runtime --enable-runtime --approve --command "..."</code> to generate a trace.
        </p>
      </section>

      <section aria-label="Empty state" className="card p-6">
        <h3 className="text-lg font-semibold mb-2">Empty state</h3>
        <p className="text-sm text-[var(--text-secondary)]" role="status">
          No frames in this session. A session with zero stdout output will show this message.
        </p>
      </section>

      <section aria-label="Error state" className="card p-6" role="alert">
        <h3 className="text-lg font-semibold mb-2 text-[var(--danger)]">Error state</h3>
        <p className="text-sm text-[var(--text-secondary)]">
          If the runtime encounters an error, the failure audit activates and the error details appear here.
        </p>
      </section>

      <section aria-label="Sample trace frame" className="card p-6">
        <h3 className="text-lg font-semibold mb-2">Sample JSONL Frame</h3>
        <pre className="code-block" aria-label="JSON frame content">{`{"type":"stdout_frame","timestamp":"2026-08-19T12:00:00.000Z","frame":{"event":"start"}}`}</pre>
      </section>
    </div>
  );
}