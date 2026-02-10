"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

type GuestResult = {
  event: {
    id: string;
    name: string;
    image?: string;
    layout: any;
  };
  guest: {
    name: string;
    tableId: number;
  };
};

export default function GuestClient() {
  const { eventId } = useParams<{ eventId: string }>();

  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GuestResult | null>(null);

  async function handleSubmit() {
    if (!name || !eventId) {
      setError("Missing name or event.");
      return;
    }

    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!apiBase) {
      setError("API base URL is not configured.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(
        `${apiBase}/api/public/event/${encodeURIComponent(
          eventId
        )}/guest?name=${encodeURIComponent(name)}`,
        { cache: "no-store" }
      );

      const json = await res.json();

      if (!json.found) {
        setError(
          "We couldn’t find your name on the guest list. Please check the spelling or contact the host."
        );
        return;
      }

      setResult({
        event: json.event,
        guest: json.guest,
      });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <div style={{ width: 420, textAlign: "center" }}>
        {!result && (
          <>
            <h1>Find your table</h1>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name (as on the guest list)"
              style={{ width: "100%", padding: 12, marginTop: 20 }}
            />

            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{ marginTop: 20 }}
            >
              {loading ? "Finding…" : "Show my table"}
            </button>

            {error && <p style={{ marginTop: 16 }}>{error}</p>}
          </>
        )}

        {result && (
          <>
            <h2 style={{ marginTop: 24 }}>
              Table {result.guest.tableId}
            </h2>

            {/*
              🔜 NÆSTE TRIN:
              Render hele bordopstillingen
              via result.event.layout
            */}
          </>
        )}
      </div>
    </main>
  );
}