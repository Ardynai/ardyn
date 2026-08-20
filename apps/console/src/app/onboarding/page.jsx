// M6: Consumer Onboarding — 10-minute integrator flow
export default function OnboardingPage() {
  const steps = [
    { num: 1, title: "Install Ardyn", code: "npm install @ardyn/core" },
    { num: 2, title: "Load a manifest", code: 'import { loadManifest } from "@ardyn/core";\nconst manifest = await loadManifest("ardyn.manifest.json");' },
    { num: 3, title: "Create a task plan", code: 'import { createTaskPlan } from "@ardyn/core";\nconst plan = await createTaskPlan(manifest, task);' },
    { num: 4, title: "Run with approval", code: 'ardyn serve-runtime --enable-runtime --approve \\\n  --manifest ardyn.manifest.json --command "node script.js"' },
    { num: 5, title: "View in console", code: "cd apps/console && npm run dev" },
  ];

  return (
    <div className="space-y-6">
      <nav aria-label="Breadcrumb" className="text-sm text-[var(--text-secondary)]">
        <a href="/" aria-label="Dashboard">Dashboard</a> › <span aria-current="page">Onboarding</span>
      </nav>
      <div>
        <h2 className="text-2xl font-bold mb-1">Consumer Onboarding</h2>
        <p className="text-sm text-[var(--text-secondary)]">Get started with Ardyn in 10 minutes</p>
      </div>

      <ol role="list" className="space-y-4">
        {steps.length === 0 ? (
          <li role="status" className="card p-6"><p className="text-sm">No onboarding steps available.</p></li>
        ) : (
          steps.map((step) => (
            <li key={step.num} className="card p-6" role="listitem" aria-label={`Step ${step.num}: ${step.title}`}>
              <div className="flex items-start gap-4">
                <span className="badge badge-info" aria-label={`Step ${step.num}`}>{step.num}</span>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{step.title}</h3>
                  <pre className="code-block mt-2" aria-label={`Code for step ${step.num}`}>{step.code}</pre>
                </div>
              </div>
            </li>
          ))
        )}
      </ol>

      <section aria-label="SDK display components" className="card p-6">
        <h3 className="text-lg font-semibold mb-4">SDK Display Components</h3>
        <ul role="list" className="space-y-2">
          <li className="flex justify-between"><span className="text-sm">SessionTrace</span><span className="badge badge-success">accessible (aria-live, role=log)</span></li>
          <li className="flex justify-between"><span className="text-sm">StatusBadge</span><span className="badge badge-success">accessible (aria-label)</span></li>
          <li className="flex justify-between"><span className="text-sm">ManifestViewer</span><span className="badge badge-success">accessible (role=region)</span></li>
          <li className="flex justify-between"><span className="text-sm">ApprovalGate</span><span className="badge badge-success">accessible (aria-disabled)</span></li>
          <li className="flex justify-between"><span className="text-sm">TypeScript types</span><span className="badge badge-success">15+ interfaces</span></li>
        </ul>
      </section>
    </div>
  );
}