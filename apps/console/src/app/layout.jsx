// Ardyn Console — Root Layout
// Design: "command-room" — operator's console with signal-cyan accent
import "./globals.css";

export const metadata = {
  title: "Ardyn Harness Console",
  description: "Web UI for operating and observing the Ardyn AI harness",
};

const navItems = [
  { href: "/", label: "Dashboard", icon: "▣" },
  { href: "/trace", label: "Trace Viewer", icon: "≡" },
  { href: "/fixtures", label: "Fixtures", icon: "◫" },
  { href: "/federation", label: "Federation", icon: "⬡" },
  { href: "/runtime", label: "Runtime", icon: "⚡" },
  { href: "/onboarding", label: "Onboarding", icon: "→" },
];

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div style={{ display: "flex", minHeight: "100vh", position: "relative", zIndex: 1 }}>
          {/* Sidebar */}
          <nav
            aria-label="Main navigation"
            style={{
              width: "240px",
              flexShrink: 0,
              borderRight: `1px solid var(--border)`,
              background: "var(--bg-surface)",
              padding: "var(--space-4)",
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-1)",
              position: "sticky",
              top: 0,
              height: "100vh",
              overflowY: "auto",
            }}
          >
            {/* Brand */}
            <div style={{ marginBottom: "var(--space-6)", padding: "0 var(--space-2)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "6px",
                    background: "linear-gradient(135deg, var(--accent), #0891b2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "14px",
                    fontWeight: 800,
                    color: "var(--text-inverse)",
                    flexShrink: 0,
                  }}
                >
                  A
                </div>
                <div>
                  <div style={{ fontSize: "var(--text-sm)", fontWeight: 700, color: "var(--text-primary)" }}>
                    Ardyn
                  </div>
                  <div style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    Harness Console
                  </div>
                </div>
              </div>
            </div>

            {/* Nav items */}
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`nav-link ${item.href === "/" ? "active" : ""}`}
                aria-current={item.href === "/" ? "page" : undefined}
              >
                <span style={{ fontSize: "16px", width: "20px", textAlign: "center", opacity: 0.7 }}>{item.icon}</span>
                <span>{item.label}</span>
              </a>
            ))}

            {/* Spacer */}
            <div style={{ flex: 1 }} />

            {/* Version footer */}
            <div style={{ padding: "var(--space-3) var(--space-2)", borderTop: "1px solid var(--border)", marginTop: "var(--space-4)" }}>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "monospace" }}>
                v0.1.0-alpha · build mode
              </div>
              <div style={{ fontSize: "11px", color: "var(--success)", marginTop: "var(--space-1)", display: "flex", alignItems: "center", gap: "6px" }}>
                <span className="status-dot status-dot-success" />
                <span style={{ fontFamily: "monospace" }}>local-first · approval-gated</span>
              </div>
            </div>
          </nav>

          {/* Main content */}
          <main
            role="main"
            style={{
              flex: 1,
              padding: "var(--space-8)",
              maxWidth: "1200px",
              overflowX: "hidden",
            }}
          >
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}