// M6: Fixture Gallery — browse boundary maps and phase records
export default function FixturesPage() {
  const categories = [
    { name: "Host Policy", count: 158, path: "tests/fixtures/host-policy/" },
    { name: "Command Surface", count: 12, path: "tests/fixtures/command-surface/" },
    { name: "Source Guards", count: 11, path: "tests/fixtures/source-guards/" },
    { name: "Minimal Manifest", count: 1, path: "examples/minimal-manifest/" },
  ];

  return (
    <div className="space-y-6">
      <nav aria-label="Breadcrumb" className="text-sm text-[var(--text-secondary)]">
        <a href="/" aria-label="Dashboard">Dashboard</a> › <span aria-current="page">Fixtures</span>
      </nav>
      <div>
        <h2 className="text-2xl font-bold mb-1">Fixture Gallery</h2>
        <p className="text-sm text-[var(--text-secondary)]">Browse boundary-map fixtures and phase metadata records</p>
      </div>

      <section aria-label="Fixture categories" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.length === 0 ? (
          <div role="status" aria-label="No fixtures" className="card p-6">
            <p className="text-sm text-[var(--text-secondary)]">No fixtures found.</p>
          </div>
        ) : (
          categories.map((cat) => (
            <article key={cat.name} className="card p-5 card-hover" role="region" aria-label={`${cat.name} fixtures`}>
              <h3 className="text-lg font-semibold">{cat.name}</h3>
              <p className="kpi-value mt-2">{cat.count}</p>
              <p className="text-xs text-[var(--text-secondary)] mt-1">{cat.path}</p>
            </article>
          ))
        )}
      </section>

      <section aria-label="Schema validation" className="card p-6">
        <h3 className="text-lg font-semibold mb-4">JSON Schema Validation</h3>
        <ul role="list" className="space-y-2">
          <li className="flex justify-between"><span className="text-sm">Manifest schema</span><span className="badge badge-success">validated</span></li>
          <li className="flex justify-between"><span className="text-sm">Task schema</span><span className="badge badge-success">validated</span></li>
          <li className="flex justify-between"><span className="text-sm">Session event schema</span><span className="badge badge-success">validated</span></li>
          <li className="flex justify-between"><span className="text-sm">Boundary-map schemas</span><span className="badge badge-success">103 schemas</span></li>
        </ul>
      </section>
    </div>
  );
}