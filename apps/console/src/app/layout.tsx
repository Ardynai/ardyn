import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ardyn Harness Console",
  description: "Web UI for operating and observing the Ardyn AI harness",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex">
          {/* Sidebar */}
          <nav className="w-64 border-r border-[var(--border)] bg-[var(--bg-secondary)] p-4 flex flex-col gap-1">
            <div className="px-3 py-4 mb-2">
              <h1 className="text-lg font-bold text-[var(--text-primary)]">Ardyn Console</h1>
              <p className="text-xs text-[var(--text-secondary)] mt-1">Harness Operations</p>
            </div>
            <a href="/" className="nav-link">
              <span>Dashboard</span>
            </a>
            <a href="/trace" className="nav-link">
              <span>Trace Viewer</span>
            </a>
            <a href="/fixtures" className="nav-link">
              <span>Fixture Gallery</span>
            </a>
            <a href="/federation" className="nav-link">
              <span>Federation Monitor</span>
            </a>
            <a href="/runtime" className="nav-link">
              <span>Runtime Control</span>
            </a>
            <a href="/onboarding" className="nav-link">
              <span>Consumer Onboarding</span>
            </a>
          </nav>

          {/* Main content */}
          <main className="flex-1 p-8 overflow-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}