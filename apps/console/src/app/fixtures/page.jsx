// Ardyn Console — Fixtures Gallery
// Browse boundary maps, phase records, and test fixtures
export default function FixturesPage() {
  const categories = [
    { name: "Host Policy", count: 158, path: "tests/fixtures/host-policy" },
    { name: "Schema Validation", count: 103, path: "tests/fixtures/schemas" },
    { name: "Source Guards", count: 24, path: "tests/fixtures/source-guards" },
    { name: "Manifests", count: 12, path: "examples" },
    { name: "Federation", count: 8, path: "packages/fabric/fixtures" },
    { name: "Loop State", count: 7, path: "tests/fixtures/loop-state" },
  ];

  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <nav aria-label="Breadcrumb" className="breadcrumb">
        <span style={{ color: "var(--text-muted)" }}>Console</span>
        <span style={{ color: "var(--text-muted)" }}>/</span>
        <span aria-current="page" style={{ color: "var(--text-secondary)" }}>Fixtures</span>
      </nav>

      <div className="page-header">
        <h1 className="page-title">Fixtures</h1>
        <p className="page-description">Boundary maps, phase records, and test fixtures</p>
      </div>

      <section aria-label="Fixture categories" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "var(--space-4)" }}>
        {categories.map((cat) => (
          <article key={cat.name} className="card card-hover" style={{ padding: "var(--space-6)" }} role="listitem">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-3)" }}>
              <h3 style={{ fontSize: "var(--text-base)", fontWeight: 600 }}>{cat.name}</h3>
              <span className="badge badge-info">{cat.count}</span>
            </div>
            <code style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", fontFamily: "monospace" }}>{cat.path}</code>
          </article>
        ))}
      </section>

      {categories.length === 0 && (
        <div className="card" style={{ padding: "var(--space-8)", textAlign: "center" }} role="status">
          <p style={{ color: "var(--text-muted)" }}>No fixtures found.</p>
        </div>
      )}
    </div>
  );
}