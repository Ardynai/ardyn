// next metadata
import "./globals.css";

export const metadata = {
  title: "Ardyn Harness Console",
  description: "Web UI for operating and observing the Ardyn AI harness",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex">
          <nav aria-label="Main navigation" className="w-64 border-r border-[var(--border)] p-4 space-y-1 hidden md:block">
            <div className="mb-4 px-2">
              <h1 className="text-lg font-bold text-[var(--accent)]">Ardyn Console</h1>
              <p className="text-xs text-[var(--text-secondary)]">Harness Control</p>
            </div>
            <a href="/" className="nav-link active" aria-current="page">📊 Dashboard</a>
            <a href="/trace" className="nav-link">📋 Trace Viewer</a>
            <a href="/fixtures" className="nav-link">📁 Fixtures</a>
            <a href="/federation" className="nav-link">🌐 Federation</a>
            <a href="/runtime" className="nav-link">⚡ Runtime</a>
            <a href="/onboarding" className="nav-link">🚀 Onboarding</a>
          </nav>
          <main className="flex-1 p-6" role="main">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}