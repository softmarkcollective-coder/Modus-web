"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function GuestClient() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get("eventId");

  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [table, setTable] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!name || !eventId) return;

    setLoading(true);
    setError(null);
    setTable(null);

    try {
      const res = await fetch(
        `/api/guest?name=${encodeURIComponent(name)}&eventId=${eventId}`
      );

      const json = await res.json();

      if (!json.found) {
        setError(
          "We couldn’t find your name on the guest list. Please check the spelling or contact the host."
        );
        return;
      }

      setTable(json.result.table);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <div style={{ width: 420, textAlign: "center" }}>
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
        {table && <h2 style={{ marginTop: 24 }}>Table {table}</h2>}
      </div>
    </main>
  );
}