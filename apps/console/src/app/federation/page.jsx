// Ardyn Console — Federation Monitor
// Read-only federation hardening status + sibling DID allowlist
export default function FederationPage() {
  const hardeningChecks = [
    { name: "Loopback-only sidecar", status: "applied", level: "critical" },
    { name: "HTTPS-only remote registry", status: "applied", level: "critical" },
    { name: "Closed sibling-DID allowlist", status: "applied", level: "critical" },
    { name: "Per-message signature verification", status: "applied", level: "critical" },
    { name: "Identity-file path confinement", status: "applied", level: "high" },
    { name: "Response-size cap", status: "applied", level: "high" },
    { name: "Registry host allowlist", status: "applied", level: "high" },
    { name: "Redirect: manual (no SSRF)", status: "applied", level: "high" },
  ];

  // Keep in sync with packages/fabric/src/federation.mjs
  // (FABRIC_FEDERATION_CLOSED_SIBLING_DIDS) and /api/federation.
  const siblings = [
    { did: "did:multiverse:ardyn", role: "self" },
    { did: "did:multiverse:hub", role: "sibling" },
    { did: "did:multiverse:kortex-audio", role: "sibling" },
    { did: "did:multiverse:locus", role: "sibling" },
    { did: "did:multiverse:custos", role: "sibling" },
    { did: "did:multiverse:somatic", role: "sibling" },
    { did: "did:multiverse:aegis", role: "sibling" },
    { did: "did:multiverse:praxis", role: "sibling" },
    { did: "did:multiverse:kybernetes", role: "sibling" },
  ];

  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <nav aria-label="Breadcrumb" className="breadcrumb">
        <span style={{ color: "var(--text-muted)" }}>Console</span>
        <span style={{ color: "var(--text-muted)" }}>/</span>
        <span aria-current="page" style={{ color: "var(--text-secondary)" }}>Federation</span>
      </nav>

      <div className="page-header">
        <h1 className="page-title">Federation</h1>
        <p className="page-description">Hardened client — A2A handoff exchange is wired and gated (--enable-federation-exchange --approve)</p>
      </div>

      {/* Status banner */}
      <section className="card" style={{ padding: "var(--space-6)", borderColor: "var(--border-accent)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
          <div style={{
            width: "48px", height: "48px", borderRadius: "50%",
            background: "var(--success-bg)", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "24px", color: "var(--success)",
          }}>
            ⬡
          </div>
          <div>
            <h2 style={{ fontSize: "var(--text-lg)", fontWeight: 600 }}>Hardened + Wired</h2>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>
              8/8 hardening checks applied · content exchange intentionally unwired
            </p>
          </div>
        </div>
      </section>

      {/* Hardening checks */}
      <section className="card" style={{ padding: "var(--space-6)" }}>
        <div className="section-header">
          <div>
            <h2 className="section-title">Hardening Checklist</h2>
            <p className="section-subtitle">Pre-wiring security audit items</p>
          </div>
          <span className="badge badge-success">8/8 applied</span>
        </div>
        <ul style={{ listStyle: "none" }} role="list">
          {hardeningChecks.map((check) => (
            <li key={check.name} className="list-item">
              <span style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                <span className="status-dot status-dot-success" />
                <span className="list-item-label">{check.name}</span>
              </span>
              <span style={{ display: "flex", gap: "var(--space-2)" }}>
                <span className={`badge badge-${check.level === "critical" ? "danger" : "warning"}`}>{check.level}</span>
                <span className="badge badge-success">{check.status}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Sibling DIDs */}
      <section className="card" style={{ padding: "var(--space-6)" }}>
        <div className="section-header">
          <div>
            <h2 className="section-title">Sibling DID Allowlist</h2>
            <p className="section-subtitle">Closed allowlist — only these DIDs are trusted</p>
          </div>
        </div>
        <ul style={{ listStyle: "none" }} role="list">
          {siblings.map((sib) => (
            <li key={sib.did} className="list-item">
              <code style={{ fontFamily: "monospace", fontSize: "var(--text-sm)", color: "var(--accent)" }}>{sib.did}</code>
              <span className={`badge badge-${sib.role === "self" ? "info" : "neutral"}`}>{sib.role}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}