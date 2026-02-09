"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

export default function GuestPage() {
  const { eventId } = useParams<{ eventId: string }>();

  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    name: string;
    table: string;
  } | null>(null);

  async function handleLookup() {
    setError(null);
    setResult(null);

    if (!name || !eventId) {
      setError("Missing name or event.");
      return;
    }

    try {
      const res = await fetch(
        `/api/guest?eventId=${encodeURIComponent(eventId)}&name=${encodeURIComponent(name)}`
      );

      const data = await res.json();

      if (!data.found) {
        setError(
          "We couldn't find your name on the guest list. Please check the spelling or contact the host."
        );
        return;
      }

      setResult({
        name: data.guest.name,
        table: data.table,
      });
    } catch {
      setError("Something went wrong. Please try again.");
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0b0b0b",
        color: "white",
        padding: 24,
      }}
    >
      <div style={{ maxWidth: 420, width: "100%", textAlign: "center" }}>
        <h1 style={{ fontSize: 36, marginBottom: 24 }}>Find your table</h1>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          style={{
            width: "100%",
            padding: 14,
            fontSize: 16,
            borderRadius: 12,
            border: "1px solid #333",
            marginBottom: 16,
            background: "#111",
            color: "white",
          }}
        />

        <button
          onClick={handleLookup}
          style={{
            width: "100%",
            padding: 14,
            fontSize: 16,
            borderRadius: 999,
            background: "#d6b36a",
            color: "#000",
            border: "none",
            cursor: "pointer",
            marginBottom: 16,
          }}
        >
          Show my table
        </button>

        {error && <p style={{ opacity: 0.9 }}>{error}</p>}

        {result && (
          <div style={{ marginTop: 24 }}>
            <p>
              <strong>{result.name}</strong>
            </p>
            <p>Table: {result.table}</p>
          </div>
        )}
      </div>
    </div>
  );
}