// M6: Consumer Onboarding — 10-minute integrator flow
export default function OnboardingPage() {
  const steps = [
    { num: 1, title: "Install Ardyn", code: "npm install @ardyn/core" },
    { num: 2, title: "Create a manifest", code: 'echo \'{"schema":"ardyn.manifest","schemaVersion":"0.1.0","capabilities":[]}\' > ardyn.manifest.json' },
    { num: 3, title: "Run doctor", code: "node apps/cli/src/index.mjs doctor" },
    { num: 4, title: "Check identity", code: "node apps/cli/src/index.mjs identity" },
    { num: 5, title: "Plan a task", code: "node apps/cli/src/index.mjs plan --manifest ardyn.manifest.json --task task.json --summary" },
    { num: 6, title: "Dry-run serve", code: "node apps/cli/src/index.mjs serve --dry-run --manifest ardyn.manifest.json" },
    { num: 7, title: "Runtime plan", code: "node apps/cli/src/index.mjs serve-runtime --enable-runtime --dry-run --manifest ardyn.manifest.json" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">Consumer Onboarding</h2>
        <p className="text-sm text-[var(--text-secondary)]">
          Get started with Ardyn in 10 minutes
        </p>
      </div>

      <div className="space-y-4">
        {steps.map((step) => (
          <div key={step.num} className="card p-5">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center text-white font-bold text-sm">
                {step.num}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <div className="code-block">
                  <code>{step.code}</code>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-2">Next Steps</h3>
        <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
          <li>• Read the <a href="#" className="text-[var(--accent)] hover:underline">consumer quickstart</a> for integration patterns</li>
          <li>• Browse the <a href="/fixtures" className="text-[var(--accent)] hover:underline">fixture gallery</a> to understand boundary maps</li>
          <li>• Check the <a href="/federation" className="text-[var(--accent)] hover:underline">federation monitor</a> for transport invariants</li>
          <li>• Review the <a href="/runtime" className="text-[var(--accent)] hover:underline">runtime control</a> for approval-gated execution</li>
        </ul>
      </div>
    </div>
  );
}