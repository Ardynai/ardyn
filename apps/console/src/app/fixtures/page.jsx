// M6: Fixture Gallery — browse boundary maps and phase records
export default function FixturesPage() {
  const fixtureCategories = [
    { name: "Host Policy", count: 158, path: "tests/fixtures/host-policy" },
    { name: "Command Surface", count: 12, path: "tests/fixtures/command-surface" },
    { name: "Session Transcripts", count: 8, path: "tests/fixtures/session-transcripts" },
    { name: "Trace Comparison", count: 4, path: "tests/fixtures/trace-comparison" },
    { name: "Source Guards", count: 11, path: "tests/fixtures/source-guards" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">Fixture Gallery</h2>
        <p className="text-sm text-[var(--text-secondary)]">
          Browse boundary maps, phase records, and test fixtures
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {fixtureCategories.map((cat) => (
          <div key={cat.name} className="card p-5 card-hover">
            <h3 className="text-lg font-semibold mb-2">{cat.name}</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-3">{cat.path}</p>
            <div className="flex items-center justify-between">
              <span className="badge badge-info">{cat.count} fixtures</span>
              <button className="text-sm text-[var(--accent)] hover:underline">
                Browse →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}