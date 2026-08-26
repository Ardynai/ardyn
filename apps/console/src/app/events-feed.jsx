"use client";

import { useEffect, useRef, useState } from "react";

const EMPTY_HINT = "no events yet — run `ardyn serve-runtime --buffer-events --enable-runtime --approve`";

export default function EventsFeed() {
  const [events, setEvents] = useState([]);
  const [connState, setConnState] = useState("connecting"); // connecting | live | reconnecting | error
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const retryRef = useRef(null);
  const esRef = useRef(null);

  useEffect(() => {
    let disposed = false;

    const connect = () => {
      if (disposed) return;
      setConnState((s) => (s === "error" ? "reconnecting" : "connecting"));
      const es = new EventSource("/api/events");
      esRef.current = es;

      es.addEventListener("connected", () => {
        if (!disposed) setConnState("live");
      });

      es.addEventListener("session_event", (e) => {
        if (disposed) return;
        try {
          const data = JSON.parse(e.data);
          setConnState("live");
          setEvents((prev) => {
            const next = [...prev, { id: `${data.buffered_at ?? Date.now()}-${prev.length}`, data }];
            return next.slice(-100); // Buffer up to 100 recent events
          });
        } catch {
          // malformed frame ignore
        }
      });

      es.onerror = () => {
        es.close();
        if (disposed) return;
        setConnState("error");
        retryRef.current = setTimeout(connect, 3000);
      };
    };

    connect();

    return () => {
      disposed = true;
      if (retryRef.current) clearTimeout(retryRef.current);
      if (esRef.current) esRef.current.close();
    };
  }, []);

  const filteredEvents = events.filter((ev) => {
    const typeMatch = filterType === "all" || (ev.data.type ?? "").toLowerCase() === filterType.toLowerCase();
    const query = searchQuery.trim().toLowerCase();
    if (!query) return typeMatch;
    const str = JSON.stringify(ev.data).toLowerCase();
    return typeMatch && str.includes(query);
  });

  return (
    <div className="card" style={{ padding: "var(--space-6)" }}>
      {/* Header & Controls */}
      <div className="section-header" style={{ flexWrap: "wrap", gap: "var(--space-3)" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
            <h2 className="section-title">Live Session Events</h2>
            <span
              className={`status-dot ${
                connState === "live"
                  ? "status-dot-success pulse-glow"
                  : connState === "connecting" || connState === "reconnecting"
                  ? "status-dot-warning"
                  : "status-dot-danger"
              }`}
            />
            <span style={{ fontSize: "var(--text-xs)", fontFamily: "monospace", color: "var(--text-muted)", textTransform: "uppercase" }}>
              {connState}
            </span>
          </div>
          <p className="section-subtitle">Real-time SSE stream from /api/events</p>
        </div>

        {/* Filter Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="Search events…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search live session events"
            style={{
              background: "var(--bg-void)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              color: "var(--text-primary)",
              padding: "0.4rem 0.75rem",
              fontSize: "var(--text-xs)",
              outline: "none",
              minWidth: "160px",
            }}
          />
          {["all", "frame", "audit", "kill"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`btn-ghost ${filterType === type ? "active" : ""}`}
              style={{ minHeight: "32px", padding: "0 0.625rem", fontSize: "var(--text-xs)" }}
              aria-label={`Filter events by type ${type}`}
            >
              {type.toUpperCase()}
            </button>
          ))}
          {events.length > 0 && (
            <button
              onClick={() => setEvents([])}
              className="btn-ghost"
              style={{ minHeight: "32px", padding: "0 0.625rem", fontSize: "var(--text-xs)", color: "var(--danger)" }}
              aria-label="Clear buffered live events"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Events List View */}
      {filteredEvents.length === 0 ? (
        <div
          style={{
            padding: "var(--space-8)",
            textAlign: "center",
            border: "1px dashed var(--border)",
            borderRadius: "var(--radius)",
            background: "var(--bg-void)",
          }}
          role="status"
        >
          <div style={{ fontSize: "28px", opacity: 0.4, marginBottom: "var(--space-2)" }} aria-hidden="true">
            📡
          </div>
          <p style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", fontWeight: 500 }}>
            {events.length === 0 ? "Awaiting Live Events Stream" : "No matching events found"}
          </p>
          <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", marginTop: "var(--space-1)" }}>
            {EMPTY_HINT}
          </p>
        </div>
      ) : (
        <div className="event-feed" tabIndex={0} aria-label="Event stream log">
          {filteredEvents.map((ev) => (
            <div key={ev.id} className="event-item">
              <span className="event-timestamp">
                {ev.data.buffered_at ? new Date(ev.data.buffered_at).toLocaleTimeString() : new Date().toLocaleTimeString()}
              </span>
              <span className="event-type">[{ev.data.type ?? "event"}]</span>
              <span className="event-data">
                {typeof ev.data.payload === "object" ? JSON.stringify(ev.data.payload) : String(ev.data.payload ?? JSON.stringify(ev.data))}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
