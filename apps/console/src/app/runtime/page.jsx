"use client";

import { useState } from "react";

export default function RuntimePage() {
  const [copiedCmd, setCopiedCmd] = useState(null);

  const copyCommand = (cmd, key) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(key);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const runtimeFeatures = [
    { label: "Kill switch", value: "destroys sandbox on trigger / violation", badge: "danger", detail: "Immediate process SIGKILL + Docker cleanup" },
    { label: "Secret redaction", value: "masks tokens/secrets in output & traces", badge: "success", detail: "Automatic regex scrubbing for sensitive keys" },
    { label: "Transcript audit", value: "full JSONL event log per session", badge: "success", detail: "session-transcript-v1 schema compliant" },
    { label: "Failure audit", value: "nonzero exit & error capture", badge: "warning", detail: "Captures stderr, signal, and stack frame" },
    { label: "Computer-use sandbox", value: "Docker container, ephemeral & isolated", badge: "info", detail: "Loopback socket boundary with strict limits" },
    { label: "Per-session token", value: "loopback-bound, 32-byte random secret", badge: "info", detail: "Cryptographic auth token per execution instance" },
  ];

  const cliCommands = [
    {
      title: "Serve Runtime (Approval-Gated)",
      desc: "Starts the runtime server requiring both explicit flags",
      cmd: "ardyn serve-runtime --enable-runtime --approve --manifest ardyn.manifest.json",
      key: "serve",
    },
    {
      title: "Computer-Use Sandbox (Dry-Run)",
      desc: "Simulate sandboxed desktop automation without spawning containers",
      cmd: "ardyn computer-use --enable-computer-use --approve --manifest ardyn.manifest.json --dry-run",
      key: "computer-dry",
    },
    {
      title: "Stream Session Events to Console",
      desc: "Buffer real-time events for live observation on the dashboard",
      cmd: "ardyn serve-runtime --enable-runtime --approve --buffer-events --manifest ardyn.manifest.json",
      key: "stream",
    },
  ];

  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="breadcrumb">
        <span style={{ color: "var(--text-muted)" }}>Console</span>
        <span style={{ color: "var(--text-muted)" }}>/</span>
        <span aria-current="page" style={{ color: "var(--text-secondary)" }}>Runtime Control</span>
      </nav>

      {/* Page Header */}
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "var(--space-4)" }}>
        <div>
          <h1 className="page-title">Runtime Control</h1>
          <p className="page-description">Approval-gated execution environment with kill switch, secret redaction, and audit logging</p>
        </div>
        <span className="badge badge-warning" style={{ fontSize: "var(--text-sm)", padding: "0.4rem 0.8rem" }}>
          FAIL-CLOSED IN PROD
        </span>
      </div>

      {/* Security Approval Gate Callout */}
      <section className="card" style={{ padding: "var(--space-6)", borderColor: "var(--warning)", background: "rgba(245, 158, 11, 0.05)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "var(--space-4)", flexWrap: "wrap" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "var(--warning-bg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              color: "var(--warning)",
              flexShrink: 0,
            }}
            aria-hidden="true"
          >
            ⚡
          </div>
          <div style={{ flex: 1, minWidth: "260px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-1)" }}>
              <h2 style={{ fontSize: "var(--text-lg)", fontWeight: 600, color: "var(--text-primary)" }}>Dual-Flag Approval Gate Enforced</h2>
              <span className="badge badge-warning">Gated</span>
            </div>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", lineHeight: 1.5 }}>
              Execution is blocked by default. Running active runtime services requires explicitly passing both{" "}
              <code className="code-block inline" style={{ color: "var(--accent)" }}>--enable-runtime</code> and{" "}
              <code className="code-block inline" style={{ color: "var(--accent)" }}>--approve</code>. Omission of either flag halts initialization immediately.
            </p>
          </div>
        </div>
      </section>

      {/* Runtime Features Table / Cards */}
      <section className="card" style={{ padding: "var(--space-6)" }}>
        <div className="section-header">
          <div>
            <h2 className="section-title">Runtime Governance & Safety Features</h2>
            <p className="section-subtitle">Active security controls enforced across every execution session</p>
          </div>
        </div>
        <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--space-2)" }} role="list">
          {runtimeFeatures.map((item) => (
            <li key={item.label} className="list-item" style={{ padding: "var(--space-3) 0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                <span className={`status-dot status-dot-${item.badge}`} />
                <div>
                  <div className="list-item-label" style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>{item.detail}</div>
                </div>
              </div>
              <span style={{ fontSize: "var(--text-xs)", color: "var(--text-secondary)", fontFamily: "monospace", textAlign: "right" }}>
                {item.value}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Interactive CLI Command Reference */}
      <section className="card" style={{ padding: "var(--space-6)" }}>
        <div className="section-header">
          <div>
            <h2 className="section-title">CLI Invocation Reference</h2>
            <p className="section-subtitle">Copyable command primitives for harness operator workflows</p>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          {cliCommands.map((item) => (
            <div
              key={item.key}
              style={{
                background: "var(--bg-void)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                padding: "var(--space-4)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-2)" }}>
                <div>
                  <div style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-primary)" }}>{item.title}</div>
                  <div style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>{item.desc}</div>
                </div>
                <button
                  onClick={() => copyCommand(item.cmd, item.key)}
                  className="btn-ghost"
                  style={{ minHeight: "34px", padding: "0 0.75rem", fontSize: "var(--text-xs)" }}
                  aria-label={`Copy command for ${item.title}`}
                >
                  {copiedCmd === item.key ? "Copied!" : "Copy"}
                </button>
              </div>
              <pre className="code-block" style={{ margin: 0 }}>
                {item.cmd}
              </pre>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
