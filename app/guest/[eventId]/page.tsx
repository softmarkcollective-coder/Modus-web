"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

type EventData = {
  id: string;
  name: string;
  image?: string | null;
  layout: any;
};

type GuestData = {
  name: string;
  table: number;
};

export default function GuestPage() {
  const { eventId } = useParams<{ eventId: string }>();

  const [name, setName] = useState("");
  const [event, setEvent] = useState<EventData | null>(null);
  const [guest, setGuest] = useState<GuestData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLookup() {
    if (!eventId || !name) return;

    setLoading(true);
    setError(null);
    setGuest(null);

    const API = process.env.NEXT_PUBLIC_VIBECODE_API_BASE;

    try {
      // 1. Hent event (alt data)
      const eventRes = await fetch(
        `${API}/api/public/event/${eventId}`,
        { cache: "no-store" }
      );
      const eventJson = await eventRes.json();
      setEvent(eventJson);

      // 2. Slå gæst op
      const guestRes = await fetch(
        `${API}/api/public/event/${eventId}/guest?name=${encodeURIComponent(name)}`,
        { cache: "no-store" }
      );
      const guestJson = await guestRes.json();

      if (!guestJson.found) {
        setError("We couldn’t find your name on the guest list.");
        return;
      }

      setGuest(guestJson.guest);
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <div style={{ width: 420, textAlign: "center" }}>
        <h1>{event?.name ?? "Find your table"}</h1>

        {!guest && (
          <>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              style={{ width: "100%", padding: 12, marginTop: 20 }}
            />

            <button
              onClick={handleLookup}
              disabled={loading}
              style={{ marginTop: 20 }}
            >
              {loading ? "Finding…" : "Show my table"}
            </button>
          </>
        )}

        {error && <p style={{ marginTop: 16 }}>{error}</p>}

        {guest && (
          <h2 style={{ marginTop: 24 }}>
            Table {guest.table}
          </h2>
        )}
      </div>
    </main>
  );
}