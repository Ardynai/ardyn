"use client";

import { useState } from "react";

export default function FederationPage() {
  const [copiedCmd, setCopiedCmd] = useState(null);

  const copyCommand = (cmd, key) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(key);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const peers = [
    { id: "node-local", name: "Local Harness (Current)", role: "Coordinator", status: "online", transport: "Loopback IPC", latency: "0ms" },
    { id: "node-fabric-1", name: "Fabric Peer Alpha", role: "Agent Worker", status: "ready", transport: "Matrix A2A Bridge", latency: "--" },
  ];

  const contracts = [
    { title: "Matrix A2A Envelope", detail: "Encrypted payload framing over Matrix rooms", badge: "success" },
    { title: "Schema Handshake v2", detail: "Strict manifest version agreement before message routing", badge: "success" },
    { title: "Redaction Protocol", detail: "Inter-agent transcript scrubbing of secret keys", badge: "info" },
    { title: "Distributed Audit Chain", detail: "Immutable JSONL record matching between peer nodes", badge: "info" },
  ];

  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="breadcrumb">
        <span style={{ color: "var(--text-muted)" }}>Console</span>
        <span style={{ color: "var(--text-muted)" }}>/</span>
        <span aria-current="page" style={{ color: "var(--text-secondary)" }}>Federation</span>
      </nav>

      {/* Page Header */}
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "var(--space-4)" }}>
        <div>
          <h1 className="page-title">Federation Mesh</h1>
          <p className="page-description">Agent-to-agent (A2A) network topology, Matrix transport contracts, and peer coordination</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
          <span className="badge badge-success">
            <span className="status-dot status-dot-success pulse-glow" />
            STANDALONE / READY
          </span>
          <span className="badge badge-neutral" style={{ fontFamily: "monospace" }}>
            Matrix A2A v1
          </span>
        </div>
      </div>

      {/* Standalone Node Banner */}
      <section className="card" style={{ padding: "var(--space-6)", borderColor: "var(--border-accent)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "var(--space-4)", flexWrap: "wrap" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "var(--accent-muted)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              color: "var(--accent)",
              flexShrink: 0,
            }}
            aria-hidden="true"
          >
            ⬡
          </div>
          <div style={{ flex: 1, minWidth: "260px" }}>
            <h2 style={{ fontSize: "var(--text-lg)", fontWeight: 600, color: "var(--text-primary)", marginBottom: "var(--space-1)" }}>
              Local Harness Operating in Standalone Mode
            </h2>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: "var(--space-3)" }}>
              The local node is operational and ready to link with remote peer harnesses via Matrix transport. To join or form a federation mesh, run the CLI bootstrap command:
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", flexWrap: "wrap" }}>
              <pre className="code-block inline" style={{ fontSize: "var(--text-xs)", color: "var(--accent)" }}>
                ardyn federation join --homeserver https://matrix.org --room-alias #ardyn-mesh:matrix.org
              </pre>
              <button
                onClick={() => copyCommand("ardyn federation join --homeserver https://matrix.org --room-alias #ardyn-mesh:matrix.org", "join")}
                className="btn-ghost"
                style={{ minHeight: "32px", padding: "0 0.625rem", fontSize: "var(--text-xs)" }}
                aria-label="Copy federation join command"
              >
                {copiedCmd === "join" ? "Copied!" : "Copy Command"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Topology Nodes Grid */}
      <section className="card" style={{ padding: "var(--space-6)" }}>
        <div className="section-header">
          <div>
            <h2 className="section-title">Peer Network Topology</h2>
            <p className="section-subtitle">Discovered and configured mesh nodes</p>
          </div>
          <span className="badge badge-neutral">{peers.length} Nodes Configured</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "var(--space-4)" }}>
          {peers.map((peer) => (
            <div
              key={peer.id}
              style={{
                background: "var(--bg-void)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                padding: "var(--space-4)",
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-2)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-primary)" }}>{peer.name}</div>
                <span className={`badge ${peer.status === "online" ? "badge-success" : "badge-neutral"}`}>
                  <span className={`status-dot ${peer.status === "online" ? "status-dot-success" : "status-dot-info"}`} />
                  {peer.status.toUpperCase()}
                </span>
              </div>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>
                Role: <span style={{ color: "var(--text-secondary)", fontWeight: 500 }}>{peer.role}</span>
              </div>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", fontFamily: "monospace" }}>
                Transport: {peer.transport} · Latency: {peer.latency}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Protocol & Transport Contracts */}
      <section className="card" style={{ padding: "var(--space-6)" }}>
        <div className="section-header">
          <div>
            <h2 className="section-title">Federation Protocol Contracts</h2>
            <p className="section-subtitle">Inter-agent transport invariants and schema compatibility rules</p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "var(--space-4)" }}>
          {contracts.map((item) => (
            <div
              key={item.title}
              style={{
                background: "var(--bg-void)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                padding: "var(--space-4)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-2)" }}>
                <span style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-primary)" }}>{item.title}</span>
                <span className={`badge badge-${item.badge}`}>Verified</span>
              </div>
              <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>{item.detail}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
