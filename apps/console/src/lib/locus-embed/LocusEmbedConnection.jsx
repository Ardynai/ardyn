"use client";

import { useEffect, useState } from "react";
import { connectWebUiBrowser } from "@multiverse/fabric-hub-protocol";

export default function LocusEmbedConnection() {
  const [error, setError] = useState(null);
  useEffect(() => {
    if (window.parent === window) return;
    const read = async (response) => {
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? "webui_trust_unavailable");
      return body;
    };
    return connectWebUiBrowser({
      window,
      load: () => fetch("/api/locus-webui", { cache: "no-store" }).then(read),
      reply: (ticket) => fetch("/api/locus-webui", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ticket),
      }).then(read),
      onError: setError,
    });
  }, []);
  return error ? (
    <p role="alert" style={{ padding: "var(--space-3) var(--space-4)",
      borderBottom: "1px solid var(--border)", background: "var(--bg-surface)",
      color: "var(--text-primary)", fontSize: "var(--text-sm)" }}>
      Locus connection unavailable: {error}
    </p>
  ) : null;
}
