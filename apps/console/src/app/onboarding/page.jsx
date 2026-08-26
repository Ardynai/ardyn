"use client";

import { useState } from "react";

export default function OnboardingPage() {
  const [copiedKey, setCopiedKey] = useState(null);

  const copyText = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const steps = [
    { num: 1, title: "Install Ardyn", cmd: "npm install @ardyn/core", desc: "Core package with manifest loader, JSON schema validation, and runtime client" },
    { num: 2, title: "Create a Manifest", cmd: "ardyn plan --manifest ardyn.manifest.json --task task.json", desc: "Define explicit agent-system capabilities and execution boundaries" },
    { num: 3, title: "Validate Capabilities", cmd: "ardyn capabilities --manifest ardyn.manifest.json", desc: "Verify permission scope boundaries and contract security policy" },
    { num: 4, title: "Run Dry-Run Mode", cmd: "ardyn serve-runtime --dry-run --manifest ardyn.manifest.json", desc: "Simulate container spawning and event framing without actual execution" },
    { num: 5, title: "Run Live Execution", cmd: "ardyn serve-runtime --enable-runtime --approve --manifest ardyn.manifest.json", desc: "Approval-gated execution with active kill switch and output secret redaction" },
  ];

  const sdkCode = `import { loadManifest, validateManifest } from "@ardyn/core";

// 1. Load agent system manifest from disk
const manifest = await loadManifest("ardyn.manifest.json");

// 2. Validate manifest against JSON schema contract
const result = validateManifest(manifest);
if (!result.valid) {
  console.error("Validation failed:", result.errors);
  process.exit(1);
}

console.log("Manifest valid:", manifest.id);`;

  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="breadcrumb">
        <span style={{ color: "var(--text-muted)" }}>Console</span>
        <span style={{ color: "var(--text-muted)" }}>/</span>
        <span aria-current="page" style={{ color: "var(--text-secondary)" }}>Onboarding</span>
      </nav>

      {/* Page Header */}
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "var(--space-4)" }}>
        <div>
          <h1 className="page-title">Consumer Onboarding</h1>
          <p className="page-description">Get from zero to running an approval-gated Ardyn harness session in 10 minutes</p>
        </div>
        <span className="badge badge-info" style={{ fontSize: "var(--text-sm)", padding: "0.4rem 0.8rem" }}>
          10-MINUTE QUICKSTART
        </span>
      </div>

      {/* Interactive 5-Step Guide */}
      <section aria-label="Onboarding steps" style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
        {steps.map((step) => (
          <article key={step.num} className="card card-hover" style={{ padding: "var(--space-6)" }} role="listitem">
            <div style={{ display: "flex", gap: "var(--space-4)", alignItems: "flex-start", flexWrap: "wrap" }}>
              {/* Step Number Circle */}
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "var(--accent-muted)",
                  border: "1px solid var(--border-accent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "var(--text-base)",
                  fontWeight: 700,
                  color: "var(--accent)",
                  flexShrink: 0,
                }}
              >
                {step.num}
              </div>

              {/* Step Content */}
              <div style={{ flex: 1, minWidth: "260px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-1)" }}>
                  <h2 style={{ fontSize: "var(--text-base)", fontWeight: 600, color: "var(--text-primary)" }}>{step.title}</h2>
                  <button
                    onClick={() => copyText(step.cmd, `step-${step.num}`)}
                    className="btn-ghost"
                    style={{ minHeight: "30px", padding: "0 0.625rem", fontSize: "var(--text-xs)" }}
                    aria-label={`Copy command for step ${step.num}`}
                  >
                    {copiedKey === `step-${step.num}` ? "Copied!" : "Copy"}
                  </button>
                </div>
                <p style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)", marginBottom: "var(--space-3)" }}>{step.desc}</p>
                <pre className="code-block" style={{ margin: 0 }} aria-label={`Command for step ${step.num}`}>
                  {step.cmd}
                </pre>
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* Programmatic SDK Quickstart */}
      <section className="card" style={{ padding: "var(--space-6)" }}>
        <div className="section-header">
          <div>
            <h2 className="section-title">Programmatic SDK Integration</h2>
            <p className="section-subtitle">Import and validate manifests directly in Node.js / ES modules</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
            <span className="badge badge-info">@ardyn/core</span>
            <button
              onClick={() => copyText(sdkCode, "sdk")}
              className="btn-ghost"
              style={{ minHeight: "34px", padding: "0 0.75rem", fontSize: "var(--text-xs)" }}
              aria-label="Copy SDK sample code"
            >
              {copiedKey === "sdk" ? "Copied!" : "Copy Code"}
            </button>
          </div>
        </div>
        <pre className="code-block" style={{ margin: 0 }}>
          {sdkCode}
        </pre>
      </section>
    </div>
  );
}
