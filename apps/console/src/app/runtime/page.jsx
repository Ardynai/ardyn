// Ardyn Console — Runtime Control
// Approval-gated, kill switch, redaction — never bypasses the security floor
export default function RuntimePage() {
  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <nav aria-label="Breadcrumb" className="breadcrumb">
        <span style={{ color: "var(--text-muted)" }}>Console</span>
        <span style={{ color: "var(--text-muted)" }}>/</span>
        <span aria-current="page" style={{ color: "var(--text-secondary)" }}>Runtime</span>
      </nav>

      <div className="page-header">
        <h1 className="page-title">Runtime</h1>
        <p className="page-description">Approval-gated execution with kill switch, redaction, and audit</p>
      </div>

      {/* Approval gate */}
      <section className="card" style={{ padding: "var(--space-6)", borderColor: "var(--warning)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
          <div style={{
            width: "48px", height: "48px", borderRadius: "12px",
            background: "var(--warning-bg)", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "24px", color: "var(--warning)",
          }}>
            ⚡
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: "var(--text-lg)", fontWeight: 600 }}>Approval Gate</h2>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>
              Runtime requires explicit <code style={{ fontFamily: "monospace", color: "var(--accent)" }}>--enable-runtime</code> + <code style={{ fontFamily: "monospace", color: "var(--accent)" }}>--approve</code>
            </p>
          </div>
          <span className="badge badge-warning">gated</span>
        </div>
      </section>

      {/* Runtime features */}
      <section className="card" style={{ padding: "var(--space-6)" }}>
        <div className="section-header">
          <div>
            <h2 className="section-title">Runtime Features</h2>
            <p className="section-subtitle">Kill switch, redaction, audit, and transcript</p>
          </div>
        </div>
        <ul style={{ listStyle: "none" }} role="list">
          {[
            { label: "Kill switch", value: "destroys sandbox on trigger", badge: "danger" },
            { label: "Secret redaction", value: "masks tokens/secrets in output", badge: "success" },
            { label: "Transcript audit", value: "full JSONL event log", badge: "success" },
            { label: "Failure audit", value: "nonzero exit + error capture", badge: "warning" },
            { label: "Computer-use sandbox", value: "Docker container, ephemeral", badge: "info" },
            { label: "Per-session token", value: "loopback-bound, 32-byte random", badge: "info" },
          ].map((item) => (
            <li key={item.label} className="list-item">
              <span style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                <span className={`status-dot status-dot-${item.badge}`} />
                <span className="list-item-label">{item.label}</span>
              </span>
              <span style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)", fontFamily: "monospace" }}>{item.value}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* CLI usage */}
      <section className="card" style={{ padding: "var(--space-6)" }}>
        <div className="section-header">
          <div>
            <h2 className="section-title">CLI Usage</h2>
            <p className="section-subtitle">Runtime and computer-use commands</p>
          </div>
        </div>
        <pre className="code-block" aria-label="Runtime CLI commands">{`# Serve runtime (approval-gated)
ardyn serve-runtime --enable-runtime --approve --manifest <path>

# Computer-use (sandboxed, approval-gated)
ardyn computer-use --enable-computer-use --approve --manifest <path> --dry-run

# Stream events to console
ardyn serve-runtime --enable-runtime --approve --buffer-events --manifest <path>`}</pre>
      </section>
    </div>
  );
}