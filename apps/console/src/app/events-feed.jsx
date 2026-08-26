"use client";
// Credibility follow-up: REAL EventSource client for the Live Session Events
// panel. Subscribes to /api/events, renders session_event frames live, shows an
// honest empty state while idle and a reconnecting/error state on drop.
import { useEffect, useRef, useState } from "react";

const EMPTY_HINT = "no events yet — run `ardyn serve-runtime --buffer-events --enable-runtime --approve`";

export default function EventsFeed() {
  const [events, setEvents] = useState([]);
  const [connState, setConnState] = useState("connecting"); // connecting | live | reconnecting | error
  const retryRef = useRef(null);
  const esRef = useRef(null);

  useEffect(() => {
    let disposed = false;

    const connect = () => {
      if (disposed) return;
      setConnState((s) => (s === "error" ? "reconnecting" : "connecting"));
      // U5: EventSource cannot send headers. In a secured deployment the page
      // can be served with `window.__ARDYN_EVENTS_TOKEN__` (an operator-injected
      // short-lived token) and it is appended as ?token=; otherwise the plain
      // endpoint is used (open in dev / header-authenticated deployments).
      const injectedToken = typeof window !== "undefined" && typeof window.__ARDYN_EVENTS_TOKEN__ === "string"
        ? window.__ARDYN_EVENTS_TOKEN__
        : null;
      const url = injectedToken
        ? `/api/events?token=${encodeURIComponent(injectedToken)}`
        : "/api/events";
      const es = new EventSource(url);
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
            const next = [...prev, { key: `${data.buffered_at ?? ""}-${prev.length}`, data }];
            return next.slice(-50); // keep the last 50 events rendered
          });
        } catch {
          // malformed frame: ignore, keep the stream alive
        }
      });

      es.onerror = () => {
        es.close();
        if (disposed) return;
        setConnState("error");
        retryRef.current = setTimeout(connect, 3000); // auto-reconnect on drop
      };
    };

    connect();
    return () => {
      disposed = true;
      if (retryRef.current) clearTimeout(retryRef.current);
      esRef.current?.close();
    };
  }, []);

  const badge =
    connState === "live" ? { cls: "badge-success", dot: "status-dot-success", label: "LIVE" }
    : connState === "reconnecting" ? { cls: "badge-info", dot: "status-dot-info", label: "RECONNECTING" }
    : connState === "error" ? { cls: "badge-danger", dot: "", label: "OFFLINE" }
    : { cls: "badge-info", dot: "status-dot-info", label: "CONNECTING" };

  return (
    <div id="event-feed" className="event-feed" style={{ marginTop: "var(--space-4)" }} aria-label="Live event feed">
      <div aria-live="polite" aria-label={`Stream status: ${badge.label}`} data-conn-state={connState}>
        <span className={`badge ${badge.cls}`}>
          <span className={`status-dot ${badge.dot}`} />
          {badge.label}
        </span>
      </div>
      {events.length === 0 ? (
        <div className="event-item" style={{ color: "var(--text-muted)", fontStyle: "italic" }} role="status">
          {EMPTY_HINT}
        </div>
      ) : (
        <ul style={{ listStyle: "none", margin: 0, padding: 0 }} role="list">
          {[...events].reverse().map(({ key, data }) => (
            <li key={key} className="event-item" style={{ borderBottom: "1px solid var(--border)", padding: "var(--space-2) 0" }}>
              <code className="code-block inline" style={{ fontSize: "var(--text-xs)" }}>
                {JSON.stringify(data)}
              </code>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
