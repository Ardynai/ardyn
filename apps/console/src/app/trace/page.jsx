"use client";

import { useState } from "react";

const SAMPLE_TRANSCRIPT = [
  {
    type: "frame",
    timestamp: "2026-08-26T03:40:00.120Z",
    payload: {
      step: 1,
      command: "ardyn plan --manifest examples/harness.manifest.json",
      exitCode: 0,
      stdout: "Manifest validation succeeded: id=harness-v1, capabilities=['plan', 'dry-run']",
    },
  },
  {
    type: "audit",
    timestamp: "2026-08-26T03:40:01.050Z",
    payload: {
      action: "evaluate_permissions",
      requestedScope: "execution.sandboxed",
      decision: "allow",
      policy: "host-policy-v1",
    },
  },
  {
    type: "frame",
    timestamp: "2026-08-26T03:40:02.300Z",
    payload: {
      step: 2,
      command: "ardyn serve-runtime --dry-run --manifest examples/harness.manifest.json",
      stdout: "[DRY-RUN] Process spawn simulated. Computer-use container ready.",
      redacted: true,
    },
  },
  {
    type: "kill",
    timestamp: "2026-08-26T03:40:05.000Z",
    payload: {
      trigger: "manual_stop",
      reason: "Operator initiated session graceful termination",
      cleanedProcesses: 1,
    },
  },
];

export default function TracePage() {
  const [events, setEvents] = useState([]);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const text = evt.target?.result;
        if (typeof text !== "string") return;

        const lines = text.split("\n").filter((l) => l.trim().length > 0);
        const parsed = lines.map((line) => JSON.parse(line));
        setEvents(parsed);
        setSelectedIdx(parsed.length > 0 ? 0 : null);
        setErrorMessage(null);
      } catch (err) {
        setErrorMessage(`Failed to parse trace file: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  const loadSample = () => {
    setEvents(SAMPLE_TRANSCRIPT);
    setSelectedIdx(0);
    setErrorMessage(null);
  };

  const clearTrace = () => {
    setEvents([]);
    setSelectedIdx(null);
    setErrorMessage(null);
  };

  const filteredEvents = events.filter((ev) => {
    const typeMatch = filterType === "all" || (ev.type ?? "").toLowerCase() === filterType.toLowerCase();
    const query = searchQuery.trim().toLowerCase();
    if (!query) return typeMatch;
    return typeMatch && JSON.stringify(ev).toLowerCase().includes(query);
  });

  const selectedEvent = selectedIdx !== null && events[selectedIdx] ? events[selectedIdx] : null;

  const handleCopyJSON = () => {
    if (!selectedEvent) return;
    navigator.clipboard.writeText(JSON.stringify(selectedEvent, null, 2));
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="breadcrumb">
        <span style={{ color: "var(--text-muted)" }}>Console</span>
        <span style={{ color: "var(--text-muted)" }}>/</span>
        <span aria-current="page" style={{ color: "var(--text-secondary)" }}>Trace Viewer</span>
      </nav>

      {/* Page Header */}
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "var(--space-4)" }}>
        <div>
          <h1 className="page-title">Trace Viewer</h1>
          <p className="page-description">Session transcripts, JSONL event frames, audit logs, and replay inspection</p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-2)" }}>
          <button onClick={loadSample} className="btn-ghost" aria-label="Load sample transcript fixture">
            Load Sample Fixture
          </button>
          <label className="btn-primary" style={{ cursor: "pointer", display: "inline-flex", alignItems: "center" }}>
            <span>Upload JSONL</span>
            <input type="file" accept=".jsonl,.json,.txt" onChange={handleFileUpload} className="sr-only" aria-label="Upload JSONL transcript file" />
          </label>
          {events.length > 0 && (
            <button onClick={clearTrace} className="btn-ghost" style={{ color: "var(--danger)" }} aria-label="Clear trace data">
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="card" style={{ padding: "var(--space-4)", borderColor: "var(--danger)", background: "var(--danger-bg)", color: "var(--danger)" }} role="alert">
          <div style={{ fontWeight: 600 }}>Error Loading Trace</div>
          <div style={{ fontSize: "var(--text-sm)" }}>{errorMessage}</div>
        </div>
      )}

      {/* Main Trace Content View */}
      {events.length === 0 ? (
        /* Empty State */
        <section className="card" style={{ padding: "var(--space-8)", textAlign: "center" }} role="status">
          <div style={{ fontSize: "48px", opacity: 0.3, marginBottom: "var(--space-4)" }} aria-hidden="true">
            ≡
          </div>
          <h2 style={{ fontSize: "var(--text-lg)", fontWeight: 600, color: "var(--text-secondary)" }}>No Trace File Loaded</h2>
          <p style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)", marginTop: "var(--space-2)", maxWidth: "540px", marginInline: "auto" }}>
            Upload a session JSONL transcript generated by <code className="code-block inline">ardyn serve-runtime</code> or load the built-in sample fixture to inspect frames.
          </p>
          <div style={{ marginTop: "var(--space-6)", display: "flex", gap: "var(--space-3)", justifyContent: "center" }}>
            <button onClick={loadSample} className="btn-primary" aria-label="Load sample trace fixture">
              Load Sample Fixture
            </button>
            <label className="btn-ghost" style={{ cursor: "pointer" }}>
              <span>Browse File…</span>
              <input type="file" accept=".jsonl,.json,.txt" onChange={handleFileUpload} className="sr-only" aria-label="Browse trace file" />
            </label>
          </div>
        </section>
      ) : (
        /* Loaded Trace View Grid */
        <div style={{ display: "grid", gridTemplateColumns: "minmax(300px, 1fr) minmax(360px, 1fr)", gap: "var(--space-6)" }}>
          {/* Left Column: Event List & Filters */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            <div className="card" style={{ padding: "var(--space-4)" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                <input
                  type="text"
                  placeholder="Filter frames by text…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Filter frame text"
                  style={{
                    background: "var(--bg-void)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius)",
                    color: "var(--text-primary)",
                    padding: "0.5rem 0.75rem",
                    fontSize: "var(--text-sm)",
                    outline: "none",
                  }}
                />
                <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
                  {["all", "frame", "audit", "kill"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setFilterType(type)}
                      className={`btn-ghost ${filterType === type ? "active" : ""}`}
                      style={{ minHeight: "32px", padding: "0 0.625rem", fontSize: "var(--text-xs)" }}
                      aria-label={`Filter trace by type ${type}`}
                    >
                      {type.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Frame List */}
            <div className="card" style={{ padding: "var(--space-2)", maxHeight: "600px", overflowY: "auto" }} role="listbox" aria-label="Event frames list">
              {filteredEvents.length === 0 ? (
                <div style={{ padding: "var(--space-6)", textAlign: "center", color: "var(--text-muted)", fontSize: "var(--text-sm)" }}>
                  No matching events found
                </div>
              ) : (
                filteredEvents.map((ev, idx) => {
                  const originalIdx = events.indexOf(ev);
                  const isSelected = selectedIdx === originalIdx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedIdx(originalIdx)}
                      role="option"
                      aria-selected={isSelected}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        padding: "var(--space-3)",
                        borderRadius: "var(--radius)",
                        background: isSelected ? "var(--bg-active)" : "transparent",
                        border: isSelected ? "1px solid var(--border-accent)" : "1px solid transparent",
                        marginBottom: "4px",
                        cursor: "pointer",
                        transition: "all var(--transition)",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                        <span
                          className={`badge ${
                            ev.type === "frame"
                              ? "badge-info"
                              : ev.type === "audit"
                              ? "badge-success"
                              : ev.type === "kill"
                              ? "badge-danger"
                              : "badge-neutral"
                          }`}
                        >
                          {ev.type ?? "event"}
                        </span>
                        <span style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "monospace" }}>
                          {ev.timestamp ? new Date(ev.timestamp).toLocaleTimeString() : `#${originalIdx + 1}`}
                        </span>
                      </div>
                      <div style={{ fontSize: "var(--text-xs)", color: "var(--text-secondary)", fontFamily: "monospace", wordBreak: "break-all" }}>
                        {typeof ev.payload === "object" ? JSON.stringify(ev.payload).slice(0, 90) + "…" : String(ev.payload ?? "")}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Event Detail JSON Inspector */}
          <div className="card" style={{ padding: "var(--space-6)", display: "flex", flexDirection: "column" }}>
            <div className="section-header">
              <div>
                <h2 className="section-title">Frame Inspector</h2>
                <p className="section-subtitle">
                  {selectedEvent ? `Event #${selectedIdx + 1} (${selectedEvent.type ?? "raw"})` : "Select an event frame from the list"}
                </p>
              </div>
              {selectedEvent && (
                <button onClick={handleCopyJSON} className="btn-ghost" style={{ minHeight: "36px", padding: "0 0.75rem" }} aria-label="Copy JSON event to clipboard">
                  {copyFeedback ? "Copied!" : "Copy JSON"}
                </button>
              )}
            </div>

            {selectedEvent ? (
              <pre className="code-block" style={{ flex: 1, maxHeight: "540px", margin: 0 }}>
                {JSON.stringify(selectedEvent, null, 2)}
              </pre>
            ) : (
              <div style={{ padding: "var(--space-8)", textAlign: "center", color: "var(--text-muted)" }}>
                Click any event frame on the left to inspect detailed JSON payload.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Trace Schema Reference */}
      <section className="card" style={{ padding: "var(--space-6)" }}>
        <div className="section-header">
          <div>
            <h2 className="section-title">Transcript Specification</h2>
            <p className="section-subtitle">JSONL frame format per session-transcript-v1 contract</p>
          </div>
          <span className="badge badge-neutral">schema: session-transcript-v1</span>
        </div>
        <pre className="code-block">{`{
  "sessionId": "sess-8a9f31c2",
  "events": [
    { "type": "frame", "timestamp": "2026-08-26T03:40:00.000Z", "payload": { "step": 1, "command": "..." } },
    { "type": "audit", "timestamp": "2026-08-26T03:40:01.000Z", "payload": { "decision": "allow|deny" } },
    { "type": "kill", "timestamp": "2026-08-26T03:40:05.000Z", "payload": { "reason": "operator_kill" } }
  ]
}`}</pre>
      </section>
    </div>
  );
}
