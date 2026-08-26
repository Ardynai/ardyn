"use client";

import { useState } from "react";

export default function FixturesPage() {
  const [copiedPath, setCopiedPath] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { name: "Host Policy", count: 158, path: "tests/fixtures/host-policy", desc: "Security policy invariants, execution boundaries, and role permissions" },
    { name: "Schema Validation", count: 103, path: "tests/fixtures/schemas", desc: "JSON schemas for manifests, tasks, session events, and transcripts" },
    { name: "Source Guards", count: 24, path: "tests/fixtures/source-guards", desc: "Digest integrity signatures and forbidden module import checks" },
    { name: "Manifests", count: 12, path: "examples", desc: "Example agent system manifests and capability declarations" },
    { name: "Federation", count: 8, path: "packages/fabric/fixtures", desc: "A2A transport payload frames and Matrix handshake mock fixtures" },
    { name: "Loop State", count: 7, path: "tests/fixtures/loop-state", desc: "Agent loop state persistence and checkpoint recovery snapshots" },
  ];

  const copyPath = (path) => {
    navigator.clipboard.writeText(path);
    setCopiedPath(path);
    setTimeout(() => setCopiedPath(null), 2000);
  };

  const filteredCategories = categories.filter((cat) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return cat.name.toLowerCase().includes(query) || cat.path.toLowerCase().includes(query) || cat.desc.toLowerCase().includes(query);
  });

  const totalFixtureCount = categories.reduce((sum, c) => sum + c.count, 0);

  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="breadcrumb">
        <span style={{ color: "var(--text-muted)" }}>Console</span>
        <span style={{ color: "var(--text-muted)" }}>/</span>
        <span aria-current="page" style={{ color: "var(--text-secondary)" }}>Fixtures</span>
      </nav>

      {/* Page Header */}
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "var(--space-4)" }}>
        <div>
          <h1 className="page-title">Test Fixtures & Boundary Maps</h1>
          <p className="page-description">Deterministic test fixtures, schema validation suites, host policies, and phase evidence records</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
          <span className="badge badge-info" style={{ fontSize: "var(--text-sm)", padding: "0.4rem 0.8rem" }}>
            {categories.length} Fixture Categories
          </span>
        </div>
      </div>

      {/* Search Bar & Filter Controls */}
      <div className="card" style={{ padding: "var(--space-4)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-4)", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="Search fixture categories or paths…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search fixture categories or file paths"
            style={{
              background: "var(--bg-void)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              color: "var(--text-primary)",
              padding: "0.55rem 0.85rem",
              fontSize: "var(--text-sm)",
              outline: "none",
              flex: 1,
              minWidth: "260px",
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="btn-ghost"
              style={{ minHeight: "36px", padding: "0 0.75rem", fontSize: "var(--text-xs)" }}
              aria-label="Clear fixture search query"
            >
              Clear Filter
            </button>
          )}
        </div>
      </div>

      {/* Categories Grid */}
      <section aria-label="Fixture categories" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "var(--space-4)" }}>
        {filteredCategories.map((cat) => (
          <article key={cat.name} className="card card-hover" style={{ padding: "var(--space-6)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-2)" }}>
                <h2 style={{ fontSize: "var(--text-base)", fontWeight: 600, color: "var(--text-primary)" }}>{cat.name}</h2>
                <span className="badge badge-info">Fixture Set</span>
              </div>
              <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", marginBottom: "var(--space-4)", lineHeight: 1.5 }}>
                {cat.desc}
              </p>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-2)", background: "var(--bg-void)", padding: "var(--space-2) var(--space-3)", borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>
              <code style={{ fontSize: "var(--text-xs)", color: "var(--accent)", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {cat.path}
              </code>
              <button
                onClick={() => copyPath(cat.path)}
                className="btn-ghost"
                style={{ minHeight: "28px", padding: "0 0.5rem", fontSize: "11px", flexShrink: 0 }}
                aria-label={`Copy path ${cat.path}`}
              >
                {copiedPath === cat.path ? "Copied!" : "Copy Path"}
              </button>
            </div>
          </article>
        ))}
      </section>

      {/* Empty Filter State */}
      {filteredCategories.length === 0 && (
        <div className="card" style={{ padding: "var(--space-8)", textAlign: "center" }} role="status">
          <p style={{ color: "var(--text-secondary)", fontWeight: 500 }}>No fixture categories matching "{searchQuery}"</p>
          <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", marginTop: "var(--space-1)" }}>
            Try searching for "host", "schema", "manifest", or "guard".
          </p>
        </div>
      )}
    </div>
  );
}
