"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Dashboard", icon: "▣" },
  { href: "/trace", label: "Trace Viewer", icon: "≡" },
  { href: "/fixtures", label: "Fixtures", icon: "◫" },
  { href: "/federation", label: "Federation", icon: "⬡" },
  { href: "/runtime", label: "Runtime", icon: "⚡" },
  { href: "/onboarding", label: "Onboarding", icon: "→" },
];

export default function Navigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Top Navigation Bar */}
      <header className="mobile-header">
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
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
            <div style={{ fontSize: "var(--text-sm)", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.2 }}>
              Ardyn Harness
            </div>
            <div style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Console
            </div>
          </div>
        </div>

        <button
          className="btn-ghost"
          style={{ minHeight: "40px", minWidth: "40px", padding: "4px 8px" }}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-label="Toggle Navigation Menu"
        >
          {mobileOpen ? "✕ Menu" : "☰ Menu"}
        </button>
      </header>

      {/* Main Sidebar Navigation */}
      <nav
        aria-label="Main navigation"
        className={`sidebar-nav ${mobileOpen ? "mobile-open" : ""}`}
      >
        {/* Brand Header */}
        <div style={{ marginBottom: "var(--space-6)", padding: "0 var(--space-2)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                background: "linear-gradient(135deg, var(--accent), #0891b2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
                fontWeight: 800,
                color: "var(--text-inverse)",
                boxShadow: "0 0 12px var(--accent-glow)",
                flexShrink: 0,
              }}
            >
              A
            </div>
            <div>
              <div style={{ fontSize: "var(--text-base)", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
                Ardyn
              </div>
              <div style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>
                Harness Console
              </div>
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <a
                key={item.href}
                href={item.href}
                className={`nav-link ${isActive ? "active" : ""}`}
                aria-current={isActive ? "page" : undefined}
                onClick={() => setMobileOpen(false)}
              >
                <span style={{ fontSize: "16px", width: "20px", textAlign: "center", opacity: isActive ? 1 : 0.7 }}>{item.icon}</span>
                <span>{item.label}</span>
              </a>
            );
          })}
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Console System Status Footer */}
        <div style={{ padding: "var(--space-3) var(--space-2)", borderTop: "1px solid var(--border)", marginTop: "var(--space-4)" }}>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "monospace" }}>
            v0.1.0-alpha · build mode
          </div>
          <div style={{ fontSize: "11px", color: "var(--success)", marginTop: "var(--space-1)", display: "flex", alignItems: "center", gap: "6px" }}>
            <span className="status-dot status-dot-success pulse-glow" />
            <span style={{ fontFamily: "monospace" }}>local-first · approval-gated</span>
          </div>
        </div>
      </nav>
    </>
  );
}
