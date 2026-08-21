// Ardyn Console — Consumer Onboarding
// 10-minute integrator flow
export default function OnboardingPage() {
  const steps = [
    { num: 1, title: "Install Ardyn", cmd: "npm install @ardyn/core", desc: "Core package with manifest, validation, and runtime" },
    { num: 2, title: "Create a manifest", cmd: "ardyn plan --manifest ardyn.manifest.json --task task.json", desc: "Define agent-system contracts" },
    { num: 3, title: "Validate", cmd: "ardyn capabilities --manifest ardyn.manifest.json", desc: "Check capabilities and permissions" },
    { num: 4, title: "Run (dry-run)", cmd: "ardyn serve-runtime --dry-run --manifest ardyn.manifest.json", desc: "Test without spawning processes" },
    { num: 5, title: "Run (live)", cmd: "ardyn serve-runtime --enable-runtime --approve --manifest ardyn.manifest.json", desc: "Approval-gated execution with kill switch" },
  ];

  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <nav aria-label="Breadcrumb" className="breadcrumb">
        <span style={{ color: "var(--text-muted)" }}>Console</span>
        <span style={{ color: "var(--text-muted)" }}>/</span>
        <span aria-current="page" style={{ color: "var(--text-secondary)" }}>Onboarding</span>
      </nav>

      <div className="page-header">
        <h1 className="page-title">Onboarding</h1>
        <p className="page-description">Get from zero to running in 10 minutes</p>
      </div>

      {/* Steps */}
      <section aria-label="Onboarding steps" style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
        {steps.map((step) => (
          <article key={step.num} className="card card-hover" style={{ padding: "var(--space-6)" }} role="listitem">
            <div style={{ display: "flex", gap: "var(--space-4)", alignItems: "flex-start" }}>
              {/* Step number */}
              <div style={{
                width: "32px", height: "32px", borderRadius: "50%",
                background: "var(--accent-muted)", border: "1px solid var(--border-accent)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "var(--text-sm)", fontWeight: 700, color: "var(--accent)",
                flexShrink: 0,
              }}>
                {step.num}
              </div>
              {/* Content */}
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: "var(--text-base)", fontWeight: 600, marginBottom: "var(--space-1)" }}>{step.title}</h3>
                <p style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)", marginBottom: "var(--space-3)" }}>{step.desc}</p>
                <pre className="code-block" style={{ margin: 0 }} aria-label={`Command for step ${step.num}`}>{step.cmd}</pre>
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* SDK quickstart */}
      <section className="card" style={{ padding: "var(--space-6)" }}>
        <div className="section-header">
          <div>
            <h2 className="section-title">SDK Quickstart</h2>
            <p className="section-subtitle">Use Ardyn as a library</p>
          </div>
          <span className="badge badge-info">@ardyn/core</span>
        </div>
        <pre className="code-block">{`import { loadManifest, validateManifest } from "@ardyn/core";

const manifest = await loadManifest("ardyn.manifest.json");
const result = validateManifest(manifest);
if (!result.valid) {
  console.error(result.errors);
  process.exit(1);
}
console.log("Manifest valid:", manifest.id);`}</pre>
      </section>
    </div>
  );
}