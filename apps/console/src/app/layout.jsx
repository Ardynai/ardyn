// Ardyn Console — Root Layout
import "./globals.css";
import Navigation from "./navigation.jsx";

export const metadata = {
  title: "Ardyn Harness Console",
  description: "Web UI for operating and observing the Ardyn AI harness",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <div style={{ display: "flex", flexDirection: "row", minHeight: "100vh", position: "relative", zIndex: 1 }}>
          <Navigation />
          <main
            id="main-content"
            role="main"
            tabIndex={-1}
            style={{
              flex: 1,
              padding: "var(--space-8)",
              maxWidth: "1280px",
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
