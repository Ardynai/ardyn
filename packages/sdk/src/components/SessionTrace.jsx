// M5: SessionTrace — accessible trace viewer component for consumers
export default function SessionTrace({ frames = [], sessionId, isLoading = false, error = null }) {
  if (isLoading) {
    return <div role="status" aria-label="Loading trace" className="ardyn-trace-loading">Loading trace…</div>;
  }
  if (error) {
    return <div role="alert" aria-label="Trace error" className="ardyn-trace-error">Error: {error}</div>;
  }
  if (!frames.length) {
    return <div role="status" aria-label="No frames" className="ardyn-trace-empty">No frames in this session.</div>;
  }
  return (
    <div role="log" aria-label={`Session trace ${sessionId ?? ""}`} aria-live="polite" className="ardyn-trace">
      {sessionId && <div className="ardyn-trace-session-id">Session: {sessionId}</div>}
      <ol className="ardyn-trace-frames">
        {frames.map((frame, i) => (
          <li key={i} className="ardyn-trace-frame" data-frame-type={frame.type ?? "unknown"}>
            <time dateTime={frame.timestamp}>{frame.timestamp ?? `Frame ${i + 1}`}</time>
            <pre aria-label={`Frame ${i + 1} content`}>{JSON.stringify(frame, null, 2)}</pre>
          </li>
        ))}
      </ol>
    </div>
  );
}